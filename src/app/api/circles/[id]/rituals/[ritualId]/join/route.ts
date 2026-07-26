/**
 * /api/circles/[id]/rituals/[ritualId]/join — Joindre / quitter un rituel
 *
 * POST   → INSERT circle_ritual_participants (idempotent)
 * DELETE → status='left' (soft, on garde la trace pour audit)
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

export async function POST(
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

    // Vérifie que le rituel appartient bien à ce cercle
    const { data: ritual } = await supabase
      .from('circle_rituals')
      .select('id, circle_id, current_phase')
      .eq('id', params.ritualId)
      .eq('circle_id', params.id)
      .maybeSingle()

    if (!ritual) return NextResponse.json({ error: 'Rituel introuvable' }, { status: 404 })

    const { error } = await supabase
      .from('circle_ritual_participants')
      .upsert(
        { ritual_id: params.ritualId, user_id: userId, status: 'joined' },
        { onConflict: 'ritual_id,user_id' }
      )

    if (error) throw error
    return NextResponse.json({ ok: true, joined: true })
  } catch (e: any) {
    console.warn('[circle/rituals/join POST] failed:', e?.message)
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
      .from('circle_ritual_participants')
      .update({ status: 'left' })
      .eq('ritual_id', params.ritualId)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true, joined: false })
  } catch (e: any) {
    console.warn('[circle/rituals/join DELETE] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
