import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang } from '@/lib/req-lang'
import { extractDreamDateFromText } from '@/lib/kairos/dream-date'

/**
 * /api/mvp/dream-date/propose — l'extraction RÉTROACTIVE des dates dites dans le texte.
 *
 * GET   ?status=pending           → la liste à revoir (rien n'est appliqué).
 * POST  { limit?, kairos_ids? }   → fait lire les textes et ÉCRIT DES PROPOSITIONS.
 *                                   N'écrit JAMAIS dans kairos.dream_date.
 * PATCH { id, decision }          → 'accept' applique la date · 'reject' la classe.
 *                                   { id, dream_date } permet de corriger l'année
 *                                   manquante en acceptant.
 *
 * POURQUOI CE DÉTOUR. 42 rêves de Tim portent la date de leur IMPORT (18–23/04/2026,
 * dont 32 le seul 19/04). Beaucoup disent leur vraie date dans le texte dicté
 * (« Rêve du 24 avril », « en ce 2 août 2023 »). Mais l'année manque presque
 * toujours, et parfois le rêveur hésite lui-même (« le 13 avril ou le 13 mai »).
 * Une date mal devinée est PIRE qu'une date absente : elle fabrique des échos
 * anciens faux, ce qui est exactement le bug qu'on répare. Donc rien en masse.
 *
 * Yeshua (Opus), 2026-07-26.
 */
export const maxDuration = 300

export async function OPTIONS() { return corsOptions() }

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const status = new URL(req.url).searchParams.get('status') || 'pending'

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos_dream_date_proposals')
      .select('id, kairos_id, quote, quote_start, proposed_date, proposed_precision, year_missing, ambiguous, confidence, reasoning, parts, status, created_at')
      .eq('user_id', userId)
      .eq('status', status)
      .order('confidence', { ascending: false })
      .limit(200)
    if (error) throw error

    const ids = (data || []).map((p: any) => p.kairos_id)
    const titles: Record<string, any> = {}
    if (ids.length) {
      const { data: ks } = await supabase
        .from('kairos')
        .select('id, title, created_at, dream_date, dream_date_precision')
        .in('id', ids)
      for (const k of ks || []) titles[(k as any).id] = k
    }

    return corsify(NextResponse.json({
      proposals: (data || []).map((p: any) => ({ ...p, kairos: titles[p.kairos_id] || null })),
      count: (data || []).length,
    }))
  } catch (e: any) {
    console.error('[dream-date.propose GET]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const lang = reqLang(req)
    const limit = Math.min(80, Math.max(1, parseInt(body.limit, 10) || 60))

    const supabase = createServerClient()
    let q = supabase
      .from('kairos')
      .select('id, raw_text, created_at, capture_method, dream_date, dream_date_precision')
      .eq('user_id', userId)
      .is('dream_date', null)
      .order('created_at', { ascending: true })
      .limit(limit)
    if (Array.isArray(body.kairos_ids) && body.kairos_ids.length) {
      q = supabase
        .from('kairos')
        .select('id, raw_text, created_at, capture_method, dream_date, dream_date_precision')
        .eq('user_id', userId)
        .in('id', body.kairos_ids.slice(0, limit))
    }
    const { data: rows, error } = await q
    if (error) throw error

    let found = 0
    let scanned = 0
    const results: any[] = []

    for (const k of rows || []) {
      scanned++
      // Un import en masse ne dit rien de l'année : son created_at n'est pas un
      // repère fiable. On le signale à l'extracteur, qui s'abstiendra de déduire.
      const depositIsReliable = (k as any).dream_date_precision !== 'unknown'
      const prop = await extractDreamDateFromText({
        rawText: (k as any).raw_text || '',
        depositAt: (k as any).created_at,
        depositIsReliable,
        lang,
      })
      if (!prop) continue
      found++
      const row = {
        kairos_id: (k as any).id,
        user_id: userId,
        quote: prop.quote,
        quote_start: prop.quote_start,
        proposed_date: prop.proposed_date,
        proposed_precision: prop.proposed_precision,
        year_missing: prop.year_missing,
        ambiguous: prop.ambiguous,
        confidence: prop.confidence,
        reasoning: prop.reasoning,
        parts: prop.parts,
        status: 'pending',
      }
      await supabase.from('kairos_dream_date_proposals').upsert(row, { onConflict: 'kairos_id' })
      results.push(row)
    }

    return corsify(NextResponse.json({ scanned, found, proposals: results, applied: 0 }))
  } catch (e: any) {
    console.error('[dream-date.propose POST]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const id = typeof body.id === 'string' ? body.id : ''
    const decision = body.decision === 'accept' ? 'accepted' : body.decision === 'reject' ? 'rejected' : null
    if (!id || !decision) return corsify(NextResponse.json({ error: 'id + decision requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { data: prop } = await supabase
      .from('kairos_dream_date_proposals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .maybeSingle()
    if (!prop) return corsify(NextResponse.json({ error: 'proposition introuvable' }, { status: 404 }))

    if (decision === 'accepted') {
      // La date effectivement appliquée : celle qui est proposée, ou celle que
      // le relecteur complète (cas courant : l'année manquait).
      const override = typeof body.dream_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.dream_date)
        ? body.dream_date
        : null
      const finalDate = override || (prop as any).proposed_date
      if (!finalDate) {
        return corsify(NextResponse.json({ error: 'aucune date à appliquer — complète l\'année' }, { status: 400 }))
      }
      const prec = typeof body.dream_date_precision === 'string' ? body.dream_date_precision : (prop as any).proposed_precision
      await supabase
        .from('kairos')
        .update({
          dream_date: finalDate,
          dream_date_precision: prec === 'unknown' ? 'day' : prec,
          dream_date_source: 'text_extraction',
          dream_date_label: null,
        })
        .eq('id', (prop as any).kairos_id)
        .eq('user_id', userId)
    }

    await supabase
      .from('kairos_dream_date_proposals')
      .update({ status: decision, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)

    return corsify(NextResponse.json({ ok: true, status: decision }))
  } catch (e: any) {
    console.error('[dream-date.propose PATCH]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
