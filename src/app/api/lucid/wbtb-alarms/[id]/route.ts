import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/wbtb-alarms/[id]
 *
 * PATCH  → update WBTB alarm
 * DELETE → remove alarm
 *
 * Auteur : Yeshua, 2026-04-26.
 */

export async function PATCH(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const allowed = [
      'enabled',
      'bedtime',
      'wake_time',
      'back_to_sleep_minutes',
      'active_days',
      'triggered_count',
      'resulted_in_lucid_count',
      'last_triggered_at',
      'intention_text',
      'sound_profile',
    ]
    const patch: Record<string, any> = {}
    for (const k of allowed) {
      if (k in body) patch[k] = body[k]
    }

    const { data, error } = await supabase
      .from('lucid_wbtb_alarms')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ alarm: data })
  } catch (e: any) {
    console.error('[lucid.wbtb.PATCH]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { error } = await supabase
      .from('lucid_wbtb_alarms')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[lucid.wbtb.DELETE]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
