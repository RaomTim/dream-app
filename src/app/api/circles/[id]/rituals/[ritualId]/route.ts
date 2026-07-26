/**
 * /api/circles/[id]/rituals/[ritualId] — Détail d'un rituel + contributions
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (vue dédiée timer + prompts par phase)
 *
 * GET    → ritual + participants + contributions (toutes phases, chronologique)
 * DELETE → archive le rituel (current_phase='archived', proposeur ou tout membre OK
 *          en MVP — pas de modération hiérarchique)
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
  { params }: { params: { id: string; ritualId: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const [ritualRes, partsRes, contribRes] = await Promise.all([
      supabase
        .from('circle_rituals')
        .select(
          'id, circle_id, proposed_by, ritual_type, title, prompt_seed, target_kairos_id, current_phase, scheduled_at, window_hours, started_at, closed_at, metadata, created_at, updated_at'
        )
        .eq('id', params.ritualId)
        .eq('circle_id', params.id)
        .maybeSingle(),
      supabase
        .from('circle_ritual_participants')
        .select('user_id, joined_at, status')
        .eq('ritual_id', params.ritualId),
      supabase
        .from('circle_ritual_contributions')
        .select('id, user_id, phase, voice_attribution, content, matter, is_voice, voice_duration_ms, created_at')
        .eq('ritual_id', params.ritualId)
        .order('created_at', { ascending: true }),
    ])

    if (!ritualRes.data) {
      return NextResponse.json({ error: 'Rituel introuvable' }, { status: 404 })
    }

    const myJoined = (partsRes.data || []).some((p: any) => String(p.user_id) === String(userId))

    return NextResponse.json({
      ritual: ritualRes.data,
      participants: partsRes.data || [],
      participant_count: (partsRes.data || []).length,
      i_joined: myJoined,
      contributions: contribRes.data || [],
    })
  } catch (e: any) {
    console.warn('[circle/rituals/[ritualId] GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; ritualId: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { error } = await supabase
      .from('circle_rituals')
      .update({ current_phase: 'archived', closed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', params.ritualId)
      .eq('circle_id', params.id)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.warn('[circle/rituals/[ritualId] DELETE] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
