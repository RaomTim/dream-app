import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/anima-mundi/meteo
 * List dernières météos publiées (approved=true).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '4')

    const { data, error } = await supabase
      .from('meteos_inconscient')
      .select('id, period_start, period_end, top_motifs, top_archetypes, hot_symbols, polarities, k_count, computed_at')
      .eq('approved', true)
      .order('period_end', { ascending: false })
      .limit(limit)
    if (error) throw error
    return NextResponse.json({ meteos: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
