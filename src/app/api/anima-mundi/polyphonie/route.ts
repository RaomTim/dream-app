import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/anima-mundi/polyphonie
 * Dernières polyphonies lunaires publiées.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '6')

    const { data, error } = await supabase
      .from('polyphonies_lunaires')
      .select('id, lunar_phase, period_start, period_end, narrative_text, voices_mobilisees, k_count, computed_at')
      .eq('approved_for_publication', true)
      .order('period_end', { ascending: false })
      .limit(limit)
    if (error) throw error
    return NextResponse.json({ polyphonies: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
