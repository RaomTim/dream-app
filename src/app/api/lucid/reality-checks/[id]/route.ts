import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/reality-checks/[id]
 *
 * PATCH  → update reality check (toggle enabled, change technique, etc.)
 * DELETE → remove reality check
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
      'technique',
      'custom_label',
      'interval_minutes',
      'active_hours_start',
      'active_hours_end',
      'vibration_pattern',
      'sound_enabled',
      'performed_count',
      'last_performed_at',
      'trigger_context',
      'max_per_day',
    ]
    const patch: Record<string, any> = {}
    for (const k of allowed) {
      if (k in body) patch[k] = body[k]
    }

    const { data, error } = await supabase
      .from('lucid_reality_checks')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ reality_check: data })
  } catch (e: any) {
    console.error('[lucid.rc.PATCH]', e)
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
      .from('lucid_reality_checks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[lucid.rc.DELETE]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
