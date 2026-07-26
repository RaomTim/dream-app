import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/reality-check-tick
 *
 * Log un RC effectué dans la journée (anti-leaderboard, juste un événement
 * journalisé). Cohérent 3_LUCID_TECHNICAL §3.2 + 1_LUCID_BIBLE §4.4
 * (RC plafonnés 5/jour suggéré max — anti-OCD réinforcement).
 *
 * Body :
 *   {
 *     rc_id?: uuid,
 *     result: 'eveille_clair' | 'douteux' | 'jeune_lucide',
 *     triggered_kairos_id?: uuid,
 *     notes?: string
 *   }
 *
 * Returns :
 *   { event: row, daily_count: number, hit_daily_max: boolean }
 *
 * Auteur : Yeshua, 2026-04-28.
 */

const VALID_RESULTS = ['eveille_clair', 'douteux', 'jeune_lucide']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const result = body.result
    if (!VALID_RESULTS.includes(result)) {
      return NextResponse.json(
        { error: 'result must be eveille_clair | douteux | jeune_lucide' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Compter les events du jour pour anti-OCD soft warning
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const { count: dailyCount } = await supabase
      .from('lucid_reality_check_events')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('event_at', startOfDay.toISOString())

    // Read user's max
    const { data: profile } = await supabase
      .from('lucid_user_profile')
      .select('rc_daily_max')
      .eq('user_id', userId)
      .maybeSingle()

    const dailyMax = profile?.rc_daily_max || 5
    const currentCount = (dailyCount || 0) + 1

    // Insert event (on ne BLOQUE pas — on warn seulement, anti-paternalisme)
    const { data, error } = await supabase
      .from('lucid_reality_check_events')
      .insert({
        user_id: userId,
        rc_id: body.rc_id || null,
        result,
        triggered_kairos_id: body.triggered_kairos_id || null,
        notes: body.notes || null,
      })
      .select('*')
      .single()

    if (error) throw error

    // Update RC counter on parent row (best-effort)
    if (body.rc_id) {
      try {
        const { data: rc } = await supabase
          .from('lucid_reality_checks')
          .select('id, performed_count')
          .eq('id', body.rc_id)
          .eq('user_id', userId)
          .maybeSingle()
        if (rc) {
          await supabase
            .from('lucid_reality_checks')
            .update({
              performed_count: (rc.performed_count || 0) + 1,
              last_performed_at: new Date().toISOString(),
            })
            .eq('id', rc.id)
        }
      } catch (e) {
        console.warn('[lucid.rc-tick] parent counter bump failed', e)
      }
    }

    return NextResponse.json({
      event: data,
      daily_count: currentCount,
      hit_daily_max: currentCount >= dailyMax,
      soft_warning: currentCount >= dailyMax
        ? 'Tu as atteint ton plafond personnel pour aujourd\'hui. Repose ton attention.'
        : null,
    }, { status: 201 })
  } catch (e: any) {
    console.error('[lucid.reality-check-tick.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
