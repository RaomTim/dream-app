/**
 * /api/personal-dictionary — Feature 2 (2026-04-29)
 *
 * Spec : 4_LOG.md 2026-04-29 — moat épistémique.
 *
 * GET → liste les symboles personnels du user (top 50 par last_seen_at DESC).
 *       Filtres : kind, archived, limit, offset.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const { searchParams } = new URL(req.url)
  const kind = searchParams.get('kind') // motif|figure|lieu|sensation|synchronicite
  const includeArchived = searchParams.get('include_archived') === 'true'
  const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  try {
    const supabase = createServerClient()
    let query = supabase
      .from('personal_dictionary_symbols')
      .select(
        'id, symbol_text, symbol_kind, first_seen_at, last_seen_at, count_total, valence_avg, associated_figures, evolution_summary, paper_angle, stone_angle, silk_angle, paragraph_cached_at, paragraph_cache_valid_until, archived_at, created_at, updated_at'
      )
      .eq('user_id', userId)
      .order('last_seen_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (!includeArchived) query = query.is('archived_at', null)
    if (kind) query = query.eq('symbol_kind', kind)

    const { data, error } = await query
    if (error) {
      return NextResponse.json({ symbols: [], _warning: error.message }, { status: 200 })
    }
    return NextResponse.json({ symbols: data || [] })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ symbols: [], _error: msg }, { status: 200 })
  }
}
