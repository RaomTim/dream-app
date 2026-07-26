/**
 * POST /api/dream-chat/recurring/[id]/acknowledge
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 4 — Mode rêve récurrent).
 *
 * Marque le pattern comme acknowledged + retourne la voie suggérée :
 *   - trauma_flag = true → suggestion = 'sanctuaire' (NightmareDepositChoiceModal)
 *   - sinon              → suggestion = 're-entry' (Aizenstat dream-tending)
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const { data: pattern, error: pErr } = await supabase
      .from('recurring_dream_patterns')
      .select('id, pattern_text, pattern_kind, trauma_flag, kairos_ids, acknowledged_at')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (pErr) throw pErr
    if (!pattern) return NextResponse.json({ error: 'pattern introuvable' }, { status: 404 })

    if (!pattern.acknowledged_at) {
      await supabase
        .from('recurring_dream_patterns')
        .update({ acknowledged_at: new Date().toISOString() })
        .eq('id', params.id)
        .eq('user_id', userId)
    }

    const suggestion = pattern.trauma_flag ? 'sanctuaire' : 're-entry'

    return NextResponse.json({
      pattern: { ...pattern, acknowledged_at: pattern.acknowledged_at || new Date().toISOString() },
      suggestion,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[recurring.acknowledge] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
