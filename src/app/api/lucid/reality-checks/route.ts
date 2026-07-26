import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/reality-checks
 *
 * GET   → list user's reality checks
 * POST  → create a new reality check
 *
 * Auteur : Yeshua, 2026-04-26.
 */

const VALID_TECHNIQUES = [
  'finger_through_palm',
  'look_at_clock',
  'look_at_text',
  'look_at_hands',
  'breath_through_nose',
  'jump_test',
  'custom',
]
const VALID_VIBRATION = ['short', 'medium', 'long']
const VALID_TRIGGER_CONTEXT = ['interval', 'on_app_open', 'on_morning', 'on_evening', 'on_random']

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('lucid_reality_checks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ reality_checks: data || [] })
  } catch (e: any) {
    console.error('[lucid.rc.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const technique = body.technique || 'finger_through_palm'
    if (!VALID_TECHNIQUES.includes(technique)) {
      return NextResponse.json({ error: 'invalid technique' }, { status: 400 })
    }

    const supabase = createServerClient()
    const insertRow: any = {
      user_id: userId,
      enabled: body.enabled !== false,
      technique,
      custom_label: body.custom_label || null,
      interval_minutes: typeof body.interval_minutes === 'number' ? body.interval_minutes : 90,
      active_hours_start: body.active_hours_start || '08:00',
      active_hours_end: body.active_hours_end || '22:00',
      vibration_pattern: VALID_VIBRATION.includes(body.vibration_pattern) ? body.vibration_pattern : 'short',
      sound_enabled: body.sound_enabled === true,
      trigger_context: VALID_TRIGGER_CONTEXT.includes(body.trigger_context) ? body.trigger_context : 'interval',
      max_per_day: typeof body.max_per_day === 'number' ? body.max_per_day : 3,
    }

    const { data, error } = await supabase
      .from('lucid_reality_checks')
      .insert(insertRow)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ reality_check: data }, { status: 201 })
  } catch (e: any) {
    console.error('[lucid.rc.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
