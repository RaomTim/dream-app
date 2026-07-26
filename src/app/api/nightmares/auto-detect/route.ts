import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/nightmares/auto-detect
 *
 * Heuristique silencieuse : si user a déposé >= 3 kairos avec valence < -0.6
 * sur les 14 derniers jours → propose mode protection.
 *
 * Throttle : ne propose pas plus d'une fois par 14 jours.
 *
 * Returns: { propose: boolean, reason?, recent_low_valence_count, last_proposal_at }
 */

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()

  // Fetch protection state
  const { data: pState } = await supabase
    .from('user_protection_state')
    .select('nightmare_mode_enabled, last_auto_proposal_at')
    .eq('user_id', userId)
    .maybeSingle()

  // Already enabled? skip
  if (pState?.nightmare_mode_enabled) {
    return NextResponse.json({ propose: false, reason: 'already_enabled' })
  }

  // Throttle
  if (pState?.last_auto_proposal_at) {
    const since = Date.now() - new Date(pState.last_auto_proposal_at).getTime()
    if (since < 14 * 24 * 3600 * 1000) {
      return NextResponse.json({ propose: false, reason: 'throttled' })
    }
  }

  // Count recent low-valence kairos (legacy dreams + new kairos)
  const since14 = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
  const { data: recentLow } = await supabase
    .from('kairos')
    .select('id, affective_valence, created_at')
    .eq('user_id', userId)
    .lt('affective_valence', -0.6)
    .gte('created_at', since14)
  const lowCount = (recentLow || []).length

  if (lowCount < 3) {
    return NextResponse.json({ propose: false, reason: 'below_threshold', recent_low_valence_count: lowCount })
  }

  // Bump last_auto_proposal_at
  await supabase
    .from('user_protection_state')
    .upsert(
      {
        user_id: userId,
        last_auto_proposal_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  return NextResponse.json({
    propose: true,
    reason: 'low_valence_threshold_reached',
    recent_low_valence_count: lowCount,
  })
}
