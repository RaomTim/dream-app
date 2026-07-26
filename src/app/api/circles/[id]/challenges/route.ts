import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-07-11 — Yeshua (Opus) — SPEC §4 G-défis
 *
 * Un défi lancé dans un groupe. Des PRÉNOMS, jamais des chiffres de jours.
 * PAS de suivi automatique, PAS de compteur, PAS de rappel : les encouragements
 * se font dans le chat, entre humains. Le défi se termine quand son créateur
 * tape « Terminer » (PATCH status=done sur challenges/[challengeId]).
 *
 * GET  /api/circles/[id]/challenges           → défis + prénoms des participants
 * POST /api/circles/[id]/challenges { title } → lance un défi (status=open)
 */

async function assertMember(supabase: any, circleId: string, userId: string) {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

async function buildAuthorMap(supabase: any, circleId: string): Promise<Record<string, string>> {
  const { data: members } = await supabase
    .from('circle_members')
    .select('user_id, display_name, pseudonym')
    .eq('circle_id', circleId)
  const map: Record<string, string> = {}
  for (const m of members || []) {
    map[m.user_id] = (m.display_name || m.pseudonym || '').trim() || 'Un rêveur'
  }
  return map
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
    if (!(await assertMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const { data: challenges, error } = await supabase
      .from('circle_challenges')
      .select('id, circle_id, creator_id, title, status, created_at')
      .eq('circle_id', params.id)
      .order('created_at', { ascending: false })
      .limit(30)
    if (error) throw error

    const ids = (challenges || []).map((c: any) => c.id)
    const authorMap = await buildAuthorMap(supabase, params.id)

    const membersByChallenge: Record<string, string[]> = {}
    const mineByChallenge: Record<string, boolean> = {}
    if (ids.length) {
      const { data: cm } = await supabase
        .from('circle_challenge_members')
        .select('challenge_id, user_id, joined_at')
        .in('challenge_id', ids)
        .order('joined_at', { ascending: true })
      for (const row of cm || []) {
        (membersByChallenge[row.challenge_id] ||= []).push(authorMap[row.user_id] || 'Un rêveur')
        if (row.user_id === userId) mineByChallenge[row.challenge_id] = true
      }
    }

    const enriched = (challenges || []).map((c: any) => ({
      ...c,
      is_creator: c.creator_id === userId,
      participants: membersByChallenge[c.id] || [],
      i_am_in: !!mineByChallenge[c.id],
    }))

    return NextResponse.json({ challenges: enriched })
  } catch (e: any) {
    console.error('[circle/challenges GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
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

    const title = typeof body.title === 'string' ? body.title.trim() : ''
    if (!title) {
      return NextResponse.json({ error: 'title requis' }, { status: 400 })
    }
    if (title.length > 140) {
      return NextResponse.json({ error: 'title trop long (max 140)' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!(await assertMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const { data: challenge, error } = await supabase
      .from('circle_challenges')
      .insert({ circle_id: params.id, creator_id: userId, title, status: 'open' })
      .select('id, circle_id, creator_id, title, status, created_at')
      .single()
    if (error) throw error

    // Le créateur en est d'office (il peut se retirer via DELETE join)
    await supabase
      .from('circle_challenge_members')
      .insert({ challenge_id: challenge.id, user_id: userId })
      .then(undefined, () => {}) // idempotent : tolère un doublon éventuel

    const authorMap = await buildAuthorMap(supabase, params.id)
    return NextResponse.json({
      challenge: {
        ...challenge,
        is_creator: true,
        participants: [authorMap[userId] || 'Un rêveur'],
        i_am_in: true,
      },
    }, { status: 201 })
  } catch (e: any) {
    console.error('[circle/challenges POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
