import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * POST /api/mvp/feedback
 * Le felt-shift feedback — signal d'apprentissage le plus fort (Gendlin).
 * Body: { kairos_id, validation: 'resonates'|'partial'|'rejected',
 *         felt?: boolean, felt_location?: string, note?: string, terms?: string[] }
 * → insert user_validations + RPC dream_learn_from_feedback (poids du lexique).
 * Yeshua, 2026-06-10 (Vague 1 MVP).
 */
export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const validation = ['resonates', 'partial', 'rejected'].includes(body.validation)
      ? body.validation
      : null
    if (!validation) return corsify(NextResponse.json({ error: 'validation invalide' }, { status: 400 }))

    const supabase = createServerClient()

    // 1. Trace user_validations (best-effort — le learn est le cœur)
    // Mapping vers le vocab CHECK existant de la table : aha / maybe / no / skip
    const VALIDATION_MAP: Record<string, string> = { resonates: 'aha', partial: 'maybe', rejected: 'no' }
    try {
      await supabase.from('user_validations').insert({
        user_id: userId,
        context_type: 'kairos',
        context_id: body.kairos_id || null,
        validation: VALIDATION_MAP[validation] || 'maybe',
        reading_kind: 'mvp_interpretation',
        felt_shift_location: body.felt_location || null,
        user_note: body.note || null,
      })
    } catch (e) {
      console.warn('[mvp.feedback] user_validations insert failed (non-blocking)', e)
    }

    // 2. Apprentissage : les poids du lexique bougent
    let terms: string[] = Array.isArray(body.terms) ? body.terms.filter((t: any) => typeof t === 'string').slice(0, 20) : []
    if (!terms.length && body.kairos_id) {
      const { data: k } = await supabase
        .from('kairos')
        .select('motif_tags')
        .eq('id', body.kairos_id)
        .eq('user_id', userId)
        .single()
      terms = (k?.motif_tags || []).slice(0, 12)
    }
    if (terms.length) {
      const { error: learnErr } = await supabase.rpc('dream_learn_from_feedback', {
        p_user_id: userId,
        p_terms: terms,
        p_validation: validation,
        p_felt: body.felt === true,
      })
      if (learnErr) console.warn('[mvp.feedback] learn rpc:', learnErr.message)
    }

    return corsify(NextResponse.json({ ok: true, learned_terms: terms.length }))
  } catch (e: any) {
    console.error('[mvp.feedback]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
