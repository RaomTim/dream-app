import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-07-11 — Yeshua (Opus) — SPEC §4 G-défis
 * POST   /api/circles/[id]/challenges/[challengeId]/join  → « J'en suis »
 * DELETE /api/circles/[id]/challenges/[challengeId]/join  → se retirer
 * Idempotent : re-taper « J'en suis » ne crée pas de doublon (unique constraint).
 */

async function guard(supabase: any, circleId: string, challengeId: string, userId: string) {
  const [member, challenge] = await Promise.all([
    supabase.from('circle_members').select('id')
      .eq('circle_id', circleId).eq('user_id', userId).is('left_at', null).maybeSingle(),
    supabase.from('circle_challenges').select('id, circle_id, status')
      .eq('id', challengeId).maybeSingle(),
  ])
  if (!member.data) return { error: NextResponse.json({ error: 'Not member of circle' }, { status: 403 }) }
  if (!challenge.data || challenge.data.circle_id !== circleId) {
    return { error: NextResponse.json({ error: 'Challenge not found in this circle' }, { status: 404 }) }
  }
  return { challenge: challenge.data }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; challengeId: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const g = await guard(supabase, params.id, params.challengeId, userId)
    if ('error' in g) return g.error

    const { error } = await supabase
      .from('circle_challenge_members')
      .upsert({ challenge_id: params.challengeId, user_id: userId }, { onConflict: 'challenge_id,user_id' })
    if (error && !String(error.message || '').toLowerCase().includes('duplicate')) throw error

    return NextResponse.json({ ok: true, i_am_in: true })
  } catch (e: any) {
    console.error('[circle/challenges/join POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; challengeId: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const g = await guard(supabase, params.id, params.challengeId, userId)
    if ('error' in g) return g.error

    const { error } = await supabase
      .from('circle_challenge_members')
      .delete()
      .eq('challenge_id', params.challengeId)
      .eq('user_id', userId)
    if (error) throw error

    return NextResponse.json({ ok: true, i_am_in: false })
  } catch (e: any) {
    console.error('[circle/challenges/join DELETE]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
