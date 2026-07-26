/**
 * /api/circles/[id]/intentions — CRUD intentions du cercle
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (onglet Intentions du Cercle)
 *        3_TECHNICAL.md §39.6 (table circle_intentions)
 *
 * Endpoints :
 *   GET   → liste intentions actives (archived_at IS NULL) triées par created_at DESC
 *   POST  → propose nouvelle intention (intention_text + active_until optionnel)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

async function isMember(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('circle_intentions')
      .select('id, circle_id, proposed_by_user_id, intention_text, active_until, votes_count, ai_synthesis_monthly, created_at')
      .eq('circle_id', params.id)
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return NextResponse.json({ intentions: data || [] })
  } catch (e: any) {
    console.warn('[circle/intentions GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const intentionText = typeof body.intention_text === 'string' ? body.intention_text.trim() : ''
    if (!intentionText) {
      return NextResponse.json({ error: 'intention_text requis' }, { status: 400 })
    }
    if (intentionText.length > 600) {
      return NextResponse.json({ error: 'intention_text trop long (max 600)' }, { status: 400 })
    }

    const activeUntil = typeof body.active_until === 'string' && body.active_until
      ? body.active_until
      : null

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('circle_intentions')
      .insert({
        circle_id: params.id,
        proposed_by_user_id: userId,
        intention_text: intentionText,
        active_until: activeUntil,
        votes_count: 0,
      })
      .select('id, circle_id, proposed_by_user_id, intention_text, active_until, votes_count, created_at')
      .single()

    if (error) throw error
    return NextResponse.json({ intention: data }, { status: 201 })
  } catch (e: any) {
    console.warn('[circle/intentions POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
