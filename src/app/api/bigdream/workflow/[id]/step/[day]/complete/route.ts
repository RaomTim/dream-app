/**
 * POST /api/bigdream/workflow/[id]/step/[day]/complete
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Big Dreams Workflow).
 *
 * Body : { capture_text?: string, capture_voice?: boolean }
 *
 * Marque le step (workflow_id, day) complété + advance current_day si on est
 * sur le jour courant. Idempotent : ré-appel met à jour la capture mais ne
 * recule jamais current_day.
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; day: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const day = parseInt(params.day, 10)
    if (!Number.isFinite(day) || day < 1 || day > 7) {
      return NextResponse.json({ error: 'day invalide (1..7)' }, { status: 400 })
    }

    const captureText: string | null =
      typeof body.capture_text === 'string' && body.capture_text.trim().length > 0
        ? body.capture_text.trim().slice(0, 8000)
        : null
    const captureVoice: boolean = body.capture_voice === true

    const supabase = createServerClient()

    // 1) Vérifie que le workflow appartient au user
    const { data: workflow, error: wErr } = await supabase
      .from('bigdream_workflows')
      .select('id, current_day, closed_at')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (wErr) throw wErr
    if (!workflow) return NextResponse.json({ error: 'workflow introuvable' }, { status: 404 })

    // 2) Update le step
    const { data: updatedStep, error: sErr } = await supabase
      .from('bigdream_workflow_steps')
      .update({
        completed_at: new Date().toISOString(),
        user_capture: captureText,
        user_capture_voice: captureVoice,
      })
      .eq('workflow_id', params.id)
      .eq('day', day)
      .select('day, step_kind, completed_at, user_capture, user_capture_voice')
      .maybeSingle()

    if (sErr) throw sErr
    if (!updatedStep) return NextResponse.json({ error: 'step introuvable' }, { status: 404 })

    // 3) Advance current_day si on vient de compléter le jour courant
    let nextCurrent = workflow.current_day || 1
    if (day === nextCurrent && nextCurrent < 7) {
      nextCurrent = nextCurrent + 1
      await supabase
        .from('bigdream_workflows')
        .update({ current_day: nextCurrent })
        .eq('id', params.id)
        .eq('user_id', userId)
    }

    return NextResponse.json({ step: updatedStep, current_day: nextCurrent })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.step.complete] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
