import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/wbtb-intention
 *
 * Programme l'intention pré-sommeil pour ce soir + sound profile.
 * Vérifie le plafond hebdo (anti-iatrogène §4.4 1_LUCID_BIBLE).
 *
 * Body :
 *   {
 *     alarm_id?: uuid,         // si user a plusieurs alarms config
 *     intention: string,
 *     sound_profile?: 'gentle' | 'chime' | 'vibration_only'
 *   }
 *
 * Returns en cas de succès :
 *   { ok: true, scheduled_for: 'YYYY-MM-DD', this_week_count: int, weekly_max: int }
 *
 * En cas de refus (plafond) :
 *   403 { error: "...", this_week_count, weekly_max }
 *
 * Auteur : Yeshua, 2026-04-28.
 */

const VALID_SOUND = ['gentle', 'chime', 'vibration_only']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const intention = String(body.intention || '').trim()
    if (!intention || intention.length < 3) {
      return NextResponse.json(
        { error: 'intention required (min 3 chars)' },
        { status: 400 }
      )
    }
    if (intention.length > 500) {
      return NextResponse.json({ error: 'intention too long (max 500 chars)' }, { status: 400 })
    }

    const sound_profile = VALID_SOUND.includes(body.sound_profile) ? body.sound_profile : 'gentle'

    const supabase = createServerClient()

    // Vérifier RPC plafond hebdo
    const { data: canSchedule } = await supabase.rpc('lucid_wbtb_can_schedule', {
      p_user_id: userId,
    })

    if (canSchedule === false) {
      // Lire les counts pour le retour
      const { data: profile } = await supabase
        .from('lucid_user_profile')
        .select('wbtb_weekly_max')
        .eq('user_id', userId)
        .maybeSingle()

      const { data: alarms } = await supabase
        .from('lucid_wbtb_alarms')
        .select('this_week_count')
        .eq('user_id', userId)

      const totalWeek = (alarms || []).reduce(
        (sum: number, a: any) => Math.max(sum, a.this_week_count || 0),
        0
      )

      return NextResponse.json(
        {
          error: 'Plafond hebdo atteint pour ta sécurité. Le sommeil aussi est une pratique.',
          this_week_count: totalWeek,
          weekly_max: profile?.wbtb_weekly_max || 4,
          retry_after: 'lundi prochain',
        },
        { status: 403 }
      )
    }

    // Trouver l'alarm config
    let alarmId: string | null = body.alarm_id || null
    if (!alarmId) {
      // Prendre la première alarm enabled, sinon la dernière
      const { data: alarm } = await supabase
        .from('lucid_wbtb_alarms')
        .select('id')
        .eq('user_id', userId)
        .eq('enabled', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!alarm) {
        return NextResponse.json(
          { error: 'no WBTB alarm configured — create one first' },
          { status: 400 }
        )
      }
      alarmId = alarm.id
    }

    // Update alarm avec intention + sound + scheduled
    const today = new Date().toISOString().slice(0, 10)
    const { data: updated, error } = await supabase
      .from('lucid_wbtb_alarms')
      .update({
        intention_for_tonight: intention,
        intention_text: intention,
        sound_profile,
        scheduled_for_tonight: true,
        scheduled_for: today,
        this_week_count: 0, // sera incrémenté dynamiquement par le trigger d'alarm dismiss
        updated_at: new Date().toISOString(),
      })
      .eq('id', alarmId)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) throw error

    // Incrémenter le compteur hebdo (manuellement — RPC simple)
    const { data: post } = await supabase
      .from('lucid_wbtb_alarms')
      .select('this_week_count')
      .eq('id', alarmId)
      .single()

    await supabase
      .from('lucid_wbtb_alarms')
      .update({ this_week_count: (post?.this_week_count || 0) + 1 })
      .eq('id', alarmId)

    const { data: profile } = await supabase
      .from('lucid_user_profile')
      .select('wbtb_weekly_max')
      .eq('user_id', userId)
      .maybeSingle()

    return NextResponse.json({
      ok: true,
      alarm: updated,
      scheduled_for: today,
      this_week_count: (post?.this_week_count || 0) + 1,
      weekly_max: profile?.wbtb_weekly_max || 4,
    })
  } catch (e: any) {
    console.error('[lucid.wbtb-intention.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
