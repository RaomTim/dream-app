import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/nightmares/list-marked?type=nightmare|grief|both&limit=50
 *
 * Liste les kairos marqués cauchemar et/ou rêve de deuil pour user.
 * Affichage : sanctuaire des cauchemars & deuil.
 */

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const type = req.nextUrl.searchParams.get('type') || 'both'
  const limit = Math.max(1, Math.min(200, parseInt(req.nextUrl.searchParams.get('limit') || '50', 10) || 50))

  const supabase = createServerClient()
  let q = supabase
    .from('dreams')
    .select('id, title, raw_text, dream_date, mood, is_nightmare, is_grief_related, grief_who, frozen_until, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (type === 'nightmare') q = q.eq('is_nightmare', true)
  else if (type === 'grief') q = q.eq('is_grief_related', true)
  else q = q.or('is_nightmare.eq.true,is_grief_related.eq.true')

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data || [] })
}
