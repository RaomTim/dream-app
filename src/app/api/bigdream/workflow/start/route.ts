/**
 * POST /api/bigdream/workflow/start
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Big Dreams Workflow).
 *
 * Body : { kairos_id: string }
 *
 * Crée un bigdream_workflow + 7 steps J1..J7 (un step_kind par jour).
 * UNIQUE(user_id, kairos_id) → si workflow existe déjà, retourne celui-ci
 * (idempotent côté UI).
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

// 7 étapes ordonnées du workflow Big Dream
const STEP_KINDS_BY_DAY: Record<number, string> = {
  1: 'silence',
  2: 'image_or_drawing',
  3: 'dialogue_personnage',
  4: 'polyphonie_3_voix',
  5: 'correlations_foret',
  6: 'oracle_corps',
  7: 'letter_to_self',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId: string | undefined = body?.kairos_id
    if (!kairosId || typeof kairosId !== 'string') {
      return NextResponse.json({ error: 'kairos_id requis' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 1) Vérifie ownership du kairos
    const { data: kairos, error: kErr } = await supabase
      .from('kairos')
      .select('id, user_id, raw_text, numinosity_score, synthesis_tier')
      .eq('id', kairosId)
      .eq('user_id', userId)
      .maybeSingle()

    if (kErr) throw kErr
    if (!kairos) return NextResponse.json({ error: 'kairos introuvable' }, { status: 404 })

    // 2) Si un workflow existe déjà pour ce (user, kairos) → renvoie-le
    const { data: existing } = await supabase
      .from('bigdream_workflows')
      .select('id, started_at, current_day, closed_at, archived_at')
      .eq('user_id', userId)
      .eq('kairos_id', kairosId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ workflow: existing, created: false })
    }

    // 3) Crée workflow
    const { data: created, error: cErr } = await supabase
      .from('bigdream_workflows')
      .insert({ user_id: userId, kairos_id: kairosId })
      .select('id, started_at, current_day, closed_at')
      .single()

    if (cErr || !created) {
      return NextResponse.json({ error: cErr?.message || 'create failed' }, { status: 500 })
    }

    // 4) Crée les 7 steps J1..J7 (pending = completed_at IS NULL)
    const stepRows = Object.entries(STEP_KINDS_BY_DAY).map(([day, kind]) => ({
      workflow_id: created.id,
      day: parseInt(day, 10),
      step_kind: kind,
    }))

    const { error: sErr } = await supabase
      .from('bigdream_workflow_steps')
      .insert(stepRows)

    if (sErr) {
      // Best-effort cleanup si steps échouent
      await supabase.from('bigdream_workflows').delete().eq('id', created.id)
      return NextResponse.json({ error: 'steps insert failed: ' + sErr.message }, { status: 500 })
    }

    return NextResponse.json(
      { workflow: created, steps_created: stepRows.length, created: true },
      { status: 201 }
    )
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.start] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
