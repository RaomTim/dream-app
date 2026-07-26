import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/wbtb-alarms
 *
 * GET  → list user's WBTB alarms
 * POST → create new alarm
 *
 * Auteur : Yeshua, 2026-04-26.
 */

const VALID_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const VALID_SOUND = ['gentle', 'chime', 'vibration_only']

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('lucid_wbtb_alarms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ alarms: data || [] })
  } catch (e: any) {
    console.error('[lucid.wbtb.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.bedtime || !body.wake_time) {
      return NextResponse.json({ error: 'bedtime + wake_time required' }, { status: 400 })
    }

    const days = Array.isArray(body.active_days)
      ? body.active_days.filter((d: string) => VALID_DAYS.includes(d))
      : VALID_DAYS

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('lucid_wbtb_alarms')
      .insert({
        user_id: userId,
        enabled: body.enabled !== false,
        bedtime: body.bedtime,
        wake_time: body.wake_time,
        back_to_sleep_minutes: typeof body.back_to_sleep_minutes === 'number' ? body.back_to_sleep_minutes : 20,
        active_days: days,
        intention_text: typeof body.intention_text === 'string' && body.intention_text.trim().length > 0
          ? body.intention_text.trim()
          : 'je vais retourner dormir, et je vais reconnaître que je rêve.',
        sound_profile: VALID_SOUND.includes(body.sound_profile) ? body.sound_profile : 'gentle',
      })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ alarm: data }, { status: 201 })
  } catch (e: any) {
    console.error('[lucid.wbtb.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
