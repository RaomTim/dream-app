import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/nightmares/protection-state
 *
 * GET  → fetch user_protection_state (default in-memory if absent)
 * POST → upsert (toggle nightmare_mode_enabled, set country_code)
 */

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_protection_state')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) {
    return NextResponse.json({
      state: {
        user_id: userId,
        freeze_until: null,
        nightmare_mode_enabled: false,
        last_marked_crisis_at: null,
        last_auto_proposal_at: null,
        country_code: null,
        _exists: false,
      },
    })
  }
  // Compute is_frozen flag
  const isFrozen = data.freeze_until && new Date(data.freeze_until).getTime() > Date.now()
  return NextResponse.json({ state: { ...data, is_frozen: !!isFrozen, _exists: true } })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const allowed = ['nightmare_mode_enabled', 'country_code']
  const patch: Record<string, any> = {}
  for (const k of allowed) if (k in body) patch[k] = body[k]
  patch.updated_at = new Date().toISOString()

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('user_protection_state')
    .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ state: data })
}
