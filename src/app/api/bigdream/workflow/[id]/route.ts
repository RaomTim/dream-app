/**
 * GET /api/bigdream/workflow/[id]
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Big Dreams Workflow).
 *
 * Retourne le workflow + ses 7 steps + le kairos parent (raw_text + synthesis_text).
 * Owner-only (filtré par user_id côté requête en plus de RLS).
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const { data: workflow, error: wErr } = await supabase
      .from('bigdream_workflows')
      .select(
        'id, kairos_id, started_at, closed_at, current_day, closing_letter, closing_letter_generated_at, archived_at'
      )
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (wErr) throw wErr
    if (!workflow) return NextResponse.json({ error: 'workflow introuvable' }, { status: 404 })

    const { data: steps, error: sErr } = await supabase
      .from('bigdream_workflow_steps')
      .select('day, step_kind, completed_at, user_capture, user_capture_voice')
      .eq('workflow_id', params.id)
      .order('day', { ascending: true })

    if (sErr) throw sErr

    // Charge le kairos parent (texte + synthèse) pour affichage UI
    const { data: kairos } = await supabase
      .from('kairos')
      .select('id, raw_text, synthesis_text, numinosity_score, motif_tags, archetypal_tags, figures, created_at')
      .eq('id', workflow.kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    return NextResponse.json({ workflow, steps: steps || [], kairos: kairos || null })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.workflow.GET] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
