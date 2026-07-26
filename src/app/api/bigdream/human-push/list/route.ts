/**
 * GET /api/bigdream/human-push/list
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Push humain payant).
 *
 * Liste les pushes du user authentifié, ordre chronologique inversé.
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('bigdream_human_pushes')
      .select(
        'id, workflow_id, kairos_id, status, amount_eur, stripe_payment_intent_id, user_request_text, praticien_response_text, requested_at, delivered_at'
      )
      .eq('user_id', userId)
      .order('requested_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ pushes: data || [] })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.human-push.list] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
