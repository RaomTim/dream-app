import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/constellation
 * Force-directed graph nodes + edges (Portrait + Constellation Figures).
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '90')
    const minWeight = parseFloat(searchParams.get('min_weight') || '0.5')
    const edgeTypesParam = searchParams.get('edge_types')
    const edgeTypes = edgeTypesParam ? edgeTypesParam.split(',') : null

    const { data, error } = await supabase.rpc('get_constellation_graph', {
      p_user_id: userId,
      p_days: days,
      p_edge_types: edgeTypes,
      p_min_weight: minWeight,
    })
    if (error) throw error

    return NextResponse.json({ graph: data || { nodes: [], edges: [] } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
