import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/[id]/edges
 *
 * Récupère tous les edges (résonances détectées) impliquant ce kairos.
 *
 * Query params:
 *  - edge_type (filter)
 *  - min_weight (default 0.5)
 *  - limit (default 30)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const edgeType = searchParams.get('edge_type')
    const minWeight = parseFloat(searchParams.get('min_weight') || '0.5')
    const limit = parseInt(searchParams.get('limit') || '30')

    let query = supabase
      .from('kairos_edges')
      .select('id, kairos_a_id, kairos_b_id, edge_type, edge_weight, detection_metadata, created_at')
      .eq('user_id', userId)
      .or(`kairos_a_id.eq.${params.id},kairos_b_id.eq.${params.id}`)
      .gte('edge_weight', minWeight)
      .order('edge_weight', { ascending: false })
      .limit(limit)

    if (edgeType) query = query.eq('edge_type', edgeType)

    const { data, error } = await query
    if (error) throw error

    // Enrichir avec preview de l'autre kairos
    const otherIds = (data || []).map((e: any) =>
      e.kairos_a_id === params.id ? e.kairos_b_id : e.kairos_a_id
    )
    const previewMap: Record<string, any> = {}
    if (otherIds.length > 0) {
      const { data: kairoses } = await supabase
        .from('kairos')
        .select('id, raw_text, kairos_type, created_at, numinosity_score')
        .in('id', otherIds)
      for (const k of (kairoses || []) as any[]) {
        previewMap[k.id] = {
          preview: (k.raw_text || '').slice(0, 120),
          kairos_type: k.kairos_type,
          created_at: k.created_at,
          numinosity_score: k.numinosity_score,
        }
      }
    }

    const enriched = (data || []).map((e: any) => {
      const otherId = e.kairos_a_id === params.id ? e.kairos_b_id : e.kairos_a_id
      return {
        ...e,
        other_kairos_id: otherId,
        other: previewMap[otherId] || null,
      }
    })

    return NextResponse.json({ edges: enriched })
  } catch (e: any) {
    console.error('[kairos/edges.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
