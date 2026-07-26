/**
 * /api/circles/[id]/rituals/[ritualId]/advance — Avancer un rituel à la phase suivante
 *
 * POST { to_phase? }
 *   - Sans paramètre : passe à la phase suivante définie dans metadata.phases (linéaire).
 *   - Avec to_phase : bascule explicitement (ex: re-ouvrir une phase précédente).
 *
 * MVP : tout membre peut faire avancer (pas de modération hiérarchique).
 *       Si on souhaite plus tard restreindre au proposeur, ajouter un check ici.
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
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { data: ritual } = await supabase
      .from('circle_rituals')
      .select('id, circle_id, current_phase, metadata, started_at')
      .eq('id', params.ritualId)
      .eq('circle_id', params.id)
      .maybeSingle()

    if (!ritual) return NextResponse.json({ error: 'Rituel introuvable' }, { status: 404 })

    const phases: string[] = (ritual.metadata as any)?.phases || []
    const explicit = typeof body.to_phase === 'string' ? body.to_phase : null

    let nextPhase: string
    if (explicit) {
      if (!phases.includes(explicit) && !['closed', 'archived'].includes(explicit)) {
        return NextResponse.json({ error: 'phase invalide pour ce rituel' }, { status: 400 })
      }
      nextPhase = explicit
    } else {
      const idx = phases.indexOf(ritual.current_phase)
      if (idx < 0) {
        return NextResponse.json({ error: 'phase courante introuvable dans la définition' }, { status: 500 })
      }
      if (idx >= phases.length - 1) {
        nextPhase = 'closed'
      } else {
        nextPhase = phases[idx + 1]
      }
    }

    const updates: any = {
      current_phase: nextPhase,
      updated_at: new Date().toISOString(),
    }
    if (!ritual.started_at && ritual.current_phase === 'open' && nextPhase !== 'open') {
      updates.started_at = new Date().toISOString()
    }
    if (nextPhase === 'closed') {
      updates.closed_at = new Date().toISOString()
    }

    const { data: updated, error } = await supabase
      .from('circle_rituals')
      .update(updates)
      .eq('id', params.ritualId)
      .eq('circle_id', params.id)
      .select('id, current_phase, started_at, closed_at, updated_at')
      .single()

    if (error) throw error

    return NextResponse.json({ ritual: updated, prev_phase: ritual.current_phase, next_phase: nextPhase })
  } catch (e: any) {
    console.warn('[circle/rituals/advance POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
