/**
 * /api/circles/[id]/intentions/[intentionId] — PATCH/DELETE intention
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 + 3_TECHNICAL.md §39.6
 *
 * PATCH  → update intention_text / active_until / archived_at (membre du cercle)
 * DELETE → soft-delete (archived_at = now())
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; intentionId: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const updates: Record<string, unknown> = {}
    if (typeof body.intention_text === 'string' && body.intention_text.trim()) {
      const t = body.intention_text.trim()
      if (t.length > 600) {
        return NextResponse.json({ error: 'intention_text trop long (max 600)' }, { status: 400 })
      }
      updates.intention_text = t
    }
    if (body.active_until === null || typeof body.active_until === 'string') {
      updates.active_until = body.active_until || null
    }
    if (body.archived_at === null || typeof body.archived_at === 'string') {
      updates.archived_at = body.archived_at || null
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'aucun champ valide à mettre à jour' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('circle_intentions')
      .update(updates)
      .eq('id', params.intentionId)
      .eq('circle_id', params.id)
      .select('id, circle_id, proposed_by_user_id, intention_text, active_until, votes_count, archived_at, ai_synthesis_monthly, created_at')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'intention introuvable' }, { status: 404 })
    return NextResponse.json({ intention: data })
  } catch (e: any) {
    console.warn('[circle/intentions PATCH] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; intentionId: string } }
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
      .update({ archived_at: new Date().toISOString() })
      .eq('id', params.intentionId)
      .eq('circle_id', params.id)
      .select('id, archived_at')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'intention introuvable' }, { status: 404 })
    return NextResponse.json({ ok: true, intention: data })
  } catch (e: any) {
    console.warn('[circle/intentions DELETE] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
