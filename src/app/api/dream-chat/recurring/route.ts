/**
 * GET /api/dream-chat/recurring
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 4 — Mode rêve récurrent).
 *
 * Liste les recurring_dream_patterns du user authentifié, ordre last_seen DESC.
 * Filtre archived_at IS NULL par défaut.
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
    const url = new URL(req.url)
    const includeArchived = url.searchParams.get('include_archived') === 'true'

    let query = supabase
      .from('recurring_dream_patterns')
      .select(
        'id, pattern_text, pattern_kind, first_seen_at, last_seen_at, count_total, valence_avg, kairos_ids, trauma_flag, acknowledged_at, archived_at'
      )
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false })
      .limit(50)

    if (!includeArchived) query = query.is('archived_at', null)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ patterns: data || [] })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[recurring.list] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
