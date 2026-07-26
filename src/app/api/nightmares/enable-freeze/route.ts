import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/nightmares/enable-freeze
 * body: { days?: number (default 30), is_crisis?: boolean }
 *
 * Active le freeze des révélations Forêt/échos/portrait pour N jours.
 * Si is_crisis = true → bump last_marked_crisis_at + force enable nightmare_mode.
 */

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const days = Math.max(1, Math.min(180, parseInt(String(body.days ?? 30), 10) || 30))
  const isCrisis = !!body.is_crisis
  const freezeUntil = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString()

  const supabase = createServerClient()
  const patch: Record<string, any> = {
    user_id: userId,
    freeze_until: freezeUntil,
    nightmare_mode_enabled: true,
    updated_at: new Date().toISOString(),
  }
  if (isCrisis) patch.last_marked_crisis_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('user_protection_state')
    .upsert(patch, { onConflict: 'user_id' })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ state: data, frozen_for_days: days })
}

export async function DELETE(req: NextRequest) {
  // Lift the freeze
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_protection_state')
    .upsert(
      { user_id: userId, freeze_until: null, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ state: data, ok: true })
}
