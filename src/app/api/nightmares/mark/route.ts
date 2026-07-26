import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/nightmares/mark
 * body: { kairos_id, is_nightmare?: boolean, is_grief_related?: boolean, grief_who?: string }
 *
 * Marque un kairos comme cauchemar et/ou rêve de deuil.
 * Vérifie ownership avant patch.
 */

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const kairosId = String(body.kairos_id || '').trim()
  if (!kairosId) return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })

  const supabase = createServerClient()

  // Verify ownership
  const { data: dream, error: dErr } = await supabase
    .from('dreams')
    .select('id, user_id')
    .eq('id', kairosId)
    .eq('user_id', userId)
    .maybeSingle()
  if (dErr || !dream) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const patch: Record<string, any> = { updated_at: new Date().toISOString() }
  if (typeof body.is_nightmare === 'boolean') patch.is_nightmare = body.is_nightmare
  if (typeof body.is_grief_related === 'boolean') patch.is_grief_related = body.is_grief_related
  if (body.grief_who !== undefined) {
    patch.grief_who = body.grief_who ? String(body.grief_who).slice(0, 200) : null
  }

  const { data, error } = await supabase
    .from('dreams')
    .update(patch)
    .eq('id', kairosId)
    .eq('user_id', userId)
    .select('id, is_nightmare, is_grief_related, grief_who')
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data })
}
