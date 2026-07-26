import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/cycles?motif=X&days=180
 * Type 6 — cycle / motif évolutif.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const motif = searchParams.get('motif')
    if (!motif) return NextResponse.json({ error: 'motif required' }, { status: 400 })

    const { data, error } = await supabase.rpc('find_kairos_cycles', {
      p_user_id: userId,
      p_motif_tag: motif,
      p_days: parseInt(searchParams.get('days') || '180'),
      p_limit: parseInt(searchParams.get('limit') || '30'),
    })
    if (error) throw error
    return NextResponse.json({ cycle: data || [], motif })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
