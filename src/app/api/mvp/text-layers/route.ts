import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang } from '@/lib/req-lang'
import {
  detectTextLayers,
  buildProjections,
  type LayerSpan,
} from '@/lib/kairos/text-layers'

/**
 * /api/mvp/text-layers — la couche RÉCIT / LECTURE DU RÊVEUR / CADRE.
 *
 * GET    ?kairos_id=…  → les intervalles déjà posés sur ce rêve.
 * POST   { kairos_id } → fait relire le texte et PROPOSE des intervalles.
 * PATCH  { kairos_id, spans } → le rêveur corrige. Sa version est souveraine :
 *                               source='user', jamais réécrasée par une passe IA.
 * DELETE { kairos_id } → « tout est récit » : on efface la couche.
 *
 * LE TEXTE N'EST JAMAIS MODIFIÉ. raw_text reste entier, intact, dans l'ordre.
 * Seules les colonnes dérivées (recit_text / recit_only_text / lecture_text) sont
 * recalculées — ce sont des projections, pas des versions concurrentes du rêve.
 *
 * Voir la règle complète dans src/lib/kairos/text-layers.ts et RAPPORT-B4 §2.
 *
 * Yeshua (Opus), 2026-07-26.
 */
export const maxDuration = 45

export async function OPTIONS() { return corsOptions() }

async function loadKairos(supabase: any, kairosId: string, userId: string) {
  const { data } = await supabase
    .from('kairos')
    .select('id, raw_text, text_layers_status')
    .eq('id', kairosId)
    .eq('user_id', userId)
    .maybeSingle()
  return data
}

/** Réécrit la couche entière (transaction logique : delete + insert) et les projections. */
async function persistLayers(
  supabase: any,
  kairosId: string,
  userId: string,
  rawText: string,
  spans: LayerSpan[],
  status: 'proposed' | 'confirmed' | 'none' | 'skipped'
) {
  await supabase.from('kairos_text_layers').delete().eq('kairos_id', kairosId).eq('user_id', userId)
  if (spans.length) {
    await supabase.from('kairos_text_layers').insert(
      spans.map((s) => ({
        kairos_id: kairosId,
        user_id: userId,
        kind: s.kind,
        start_char: s.start,
        end_char: s.end,
        quote: rawText.slice(s.start, s.end),
        source: s.source,
        confidence: s.confidence ?? null,
      }))
    )
  }
  const proj = buildProjections(rawText, spans)
  await supabase
    .from('kairos')
    .update({
      text_layers_status: status,
      text_layers_at: new Date().toISOString(),
      recit_text: proj.recit_text || null,
      recit_only_text: proj.recit_only_text || null,
      lecture_text: proj.lecture_text || null,
    })
    .eq('id', kairosId)
    .eq('user_id', userId)
  return proj
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const kairosId = new URL(req.url).searchParams.get('kairos_id') || ''
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const k = await loadKairos(supabase, kairosId, userId)
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    const { data: rows } = await supabase
      .from('kairos_text_layers')
      .select('kind, start_char, end_char, quote, source, confidence')
      .eq('kairos_id', kairosId)
      .eq('user_id', userId)
      .order('start_char', { ascending: true })

    return corsify(NextResponse.json({
      status: k.text_layers_status || 'none',
      spans: (rows || []).map((r: any) => ({
        kind: r.kind, start: r.start_char, end: r.end_char, quote: r.quote,
        source: r.source, confidence: r.confidence,
      })),
    }))
  } catch (e: any) {
    console.error('[mvp.text-layers GET]', e)
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

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const k = await loadKairos(supabase, kairosId, userId)
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    // Une correction du rêveur est souveraine : on ne repasse jamais dessus.
    if (k.text_layers_status === 'confirmed' && body.force !== true) {
      return corsify(NextResponse.json({ status: 'confirmed', spans: [], skipped: 'user_confirmed' }))
    }

    const det = await detectTextLayers({ rawText: k.raw_text || '', lang })
    const status = det.status === 'proposed' ? 'proposed' : det.status === 'none' ? 'none' : 'skipped'
    const proj = await persistLayers(supabase, kairosId, userId, k.raw_text || '', det.spans, status)

    return corsify(NextResponse.json({
      status,
      confidence: det.confidence,
      reason: det.reason || null,
      spans: det.spans,
      ratios: {
        recit: (proj.recit_text.length / Math.max(1, (k.raw_text || '').length)),
        lecture: (proj.lecture_text.length / Math.max(1, (k.raw_text || '').length)),
      },
    }))
  } catch (e: any) {
    console.error('[mvp.text-layers POST]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const k = await loadKairos(supabase, kairosId, userId)
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))
    const raw = k.raw_text || ''

    // Les bornes viennent du client : on les borne au texte et on jette tout ce
    // qui ne tient pas debout. Jamais d'intervalle hors texte, jamais de vide.
    const spans: LayerSpan[] = (Array.isArray(body.spans) ? body.spans : [])
      .map((s: any) => ({
        kind: s?.kind === 'cadre' ? 'cadre' : 'lecture',
        start: Math.max(0, Math.min(raw.length, parseInt(s?.start, 10))),
        end: Math.max(0, Math.min(raw.length, parseInt(s?.end, 10))),
        quote: '',
        source: 'user' as const,
        confidence: 1,
      }))
      .filter((s: LayerSpan) => Number.isFinite(s.start) && Number.isFinite(s.end) && s.end > s.start)

    const proj = await persistLayers(supabase, kairosId, userId, raw, spans, 'confirmed')
    return corsify(NextResponse.json({ status: 'confirmed', spans, ratios: {
      recit: proj.recit_text.length / Math.max(1, raw.length),
      lecture: proj.lecture_text.length / Math.max(1, raw.length),
    } }))
  } catch (e: any) {
    console.error('[mvp.text-layers PATCH]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : new URL(req.url).searchParams.get('kairos_id') || ''
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const k = await loadKairos(supabase, kairosId, userId)
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    // « tout est récit » — le rêveur reprend la main, définitivement.
    await persistLayers(supabase, kairosId, userId, k.raw_text || '', [], 'confirmed')
    return corsify(NextResponse.json({ status: 'confirmed', spans: [] }))
  } catch (e: any) {
    console.error('[mvp.text-layers DELETE]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
