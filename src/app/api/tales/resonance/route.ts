import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/tales/resonance
 *
 * Capture résonance user sur un conte présenté (Bible §17.4).
 * "ce conte chante" / "silent" / "rejected".
 *
 * Body: { tale_id, kairos_id?, resonance: 'chants'|'silent'|'rejected', user_note? }
 */

const ALLOWED = new Set(['chants', 'silent', 'rejected'])

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const tale_id = String(body.tale_id || '').trim()
  const resonance = String(body.resonance || '').trim()
  if (!tale_id || !ALLOWED.has(resonance)) {
    return NextResponse.json({ error: 'tale_id + valid resonance required' }, { status: 400 })
  }

  const supabase = createServerClient()
  const insertObj: Record<string, any> = {
    user_id: userId,
    tale_id,
    resonance,
    user_note: body.user_note ? String(body.user_note).slice(0, 800) : null,
  }
  if (body.kairos_id) insertObj.kairos_id = String(body.kairos_id)

  // Upsert on (user, tale, kairos)
  const { data, error } = await supabase
    .from('tale_user_resonance')
    .upsert(insertObj, { onConflict: 'user_id,tale_id,kairos_id' })
    .select('*')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resonance: data })
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tale_user_resonance')
    .select('id, tale_id, kairos_id, resonance, user_note, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resonances: data || [] })
}
