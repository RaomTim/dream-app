import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/anima-mundi/voute
 * Aggregat : dernière météo, dernière polyphonie, compteur annales en circulation,
 * nombre d'opt-ins meteo actifs (transparence k-anon).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error

    const supabase = createServerClient()

    const [meteoResp, polyphonieResp, annalesResp, optinResp] = await Promise.all([
      supabase.from('meteos_inconscient')
        .select('id, period_end, top_motifs, top_archetypes, k_count, computed_at')
        .eq('approved', true)
        .order('period_end', { ascending: false })
        .limit(1).maybeSingle(),
      supabase.from('polyphonies_lunaires')
        .select('id, lunar_phase, period_end, narrative_text, voices_mobilisees, computed_at')
        .eq('approved_for_publication', true)
        .order('period_end', { ascending: false })
        .limit(1).maybeSingle(),
      supabase.from('annales_circulation')
        .select('id', { count: 'exact', head: true })
        .eq('state', 'circulating'),
      supabase.from('kairos_global_optin')
        .select('user_id', { count: 'exact', head: true })
        .eq('share_for_meteo', true),
    ])

    return NextResponse.json({
      meteo: meteoResp.data,
      polyphonie: polyphonieResp.data,
      annales_circulating_count: annalesResp.count || 0,
      meteo_optin_count: optinResp.count || 0,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
