import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/anima-mundi/annales
 * Annales en circulation + récentes archivées.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error

    const supabase = createServerClient()

    const [circulating, archived] = await Promise.all([
      supabase.from('annales_circulation')
        .select('id, curated_text, pseudonym, threshold_required, hold_count, shared_at, expires_at')
        .eq('state', 'circulating')
        .order('shared_at', { ascending: false })
        .limit(30),
      supabase.from('annales_circulation')
        .select('id, curated_text, pseudonym, threshold_required, hold_count, shared_at, archived_at')
        .eq('state', 'archived')
        .order('archived_at', { ascending: false })
        .limit(10),
    ])

    return NextResponse.json({
      circulating: circulating.data || [],
      archived: archived.data || [],
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
