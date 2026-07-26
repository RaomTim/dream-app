import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { normalizeDreamDateInput } from '@/lib/kairos/dream-date'

/**
 * PATCH /api/mvp/dream-date — poser (ou effacer) la date du RÊVE.
 *
 * Body : { kairos_id, dream_date_shortcut } — le geste courant, un tap :
 *          'tonight' | 'yesterday' | 'before_yesterday' | 'few_days' | 'this_month' | 'unknown'
 *        ou { kairos_id, dream_date: 'YYYY-MM-DD', dream_date_precision?, dream_date_label? }
 *          — le cas rare (« en avril 2019 »), quand le rêveur ouvre le détail.
 *
 * `created_at` n'est JAMAIS touché : la date de dépôt reste la vérité de dépôt.
 * C'est `occurred_at` (colonne générée) qui bascule, et avec elle tout ce qui
 * calcule sur le temps.
 *
 * Route dédiée volontairement : la date du rêve n'a pas à passer par la whitelist
 * générique de PATCH /api/kairos/[id], qui appartient à d'autres chantiers.
 *
 * Yeshua (Opus), 2026-07-26.
 */
export const maxDuration = 15

export async function OPTIONS() { return corsOptions() }

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const fields = normalizeDreamDateInput(body)
    if (Object.keys(fields).length === 0) {
      return corsify(NextResponse.json({ error: 'aucune date exploitable' }, { status: 400 }))
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos')
      .update(fields)
      .eq('id', kairosId)
      .eq('user_id', userId)
      .select('id, created_at, dream_date, dream_date_precision, dream_date_label, dream_date_source, occurred_at, occurred_at_reliable')
      .maybeSingle()

    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))
    if (!data) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))
    return corsify(NextResponse.json({ kairos: data }))
  } catch (e: any) {
    console.error('[mvp.dream-date PATCH]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
