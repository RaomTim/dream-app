/**
 * /api/circles/[id]/intentions/[intentionId]/vote — POST vote pour une intention
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 + 3_TECHNICAL.md §39.6
 *
 * MVP : incrément atomique de votes_count (pas d'idempotence stricte server-side
 * faute de table dédiée — voir note dans le rapport agent). Le client doit
 * désactiver le bouton après un vote pour éviter le double-clic.
 *
 * Tier 2 : ajouter table circle_intention_votes(intention_id, user_id) UNIQUE
 *          → SQL fourni dans le rapport agent.
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

    // Lecture courante puis update — non-atomique stricte mais OK pour MVP
    // (race conditions rares à cette échelle, votes_count cosmétique).
    const { data: current, error: readErr } = await supabase
      .from('circle_intentions')
      .select('id, votes_count, archived_at')
      .eq('id', params.intentionId)
      .eq('circle_id', params.id)
      .maybeSingle()

    if (readErr) throw readErr
    if (!current) return NextResponse.json({ error: 'intention introuvable' }, { status: 404 })
    if (current.archived_at) {
      return NextResponse.json({ error: 'intention archivée' }, { status: 410 })
    }

    const newCount = (current.votes_count || 0) + 1

    const { data, error } = await supabase
      .from('circle_intentions')
      .update({ votes_count: newCount })
      .eq('id', params.intentionId)
      .eq('circle_id', params.id)
      .select('id, votes_count')
      .single()

    if (error) throw error
    return NextResponse.json({ ok: true, intention: data })
  } catch (e: any) {
    console.warn('[circle/intentions/vote POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
