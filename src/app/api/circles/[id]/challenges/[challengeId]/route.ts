import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-07-11 — Yeshua (Opus) — SPEC §4 G-défis
 * PATCH /api/circles/[id]/challenges/[challengeId]  { status:'done' }
 *   → seul le créateur peut terminer le défi. Copy écran : « Défi terminé. Bravo à vous. »
 *     (pas d'emoji système — on tient la ligne.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; challengeId: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const status = body.status === 'done' ? 'done' : body.status === 'open' ? 'open' : null
    if (!status) {
      return NextResponse.json({ error: "status must be 'done' or 'open'" }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: challenge } = await supabase
      .from('circle_challenges')
      .select('id, circle_id, creator_id')
      .eq('id', params.challengeId)
      .maybeSingle()

    if (!challenge || challenge.circle_id !== params.id) {
      return NextResponse.json({ error: 'Challenge not found in this circle' }, { status: 404 })
    }
    if (challenge.creator_id !== userId) {
      return NextResponse.json({ error: 'Seul le créateur peut terminer ce défi' }, { status: 403 })
    }

    const { data: updated, error } = await supabase
      .from('circle_challenges')
      .update({ status })
      .eq('id', params.challengeId)
      .select('id, circle_id, creator_id, title, status, created_at')
      .single()
    if (error) throw error

    return NextResponse.json({ challenge: updated })
  } catch (e: any) {
    console.error('[circle/challenges PATCH]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
