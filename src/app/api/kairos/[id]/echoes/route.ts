import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/[id]/echoes
 *
 * Wrapper RPC find_kairos_echoes_multilayer.
 * Retourne les kairos résonnants (multi-layer combined score).
 *
 * Query params : w_sem, w_con, w_som, w_arc (poids de combinaison), limit
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

    const { data, error } = await supabase.rpc('find_kairos_echoes_multilayer', {
      p_user_id: userId,
      p_kairos_id: params.id,
      p_w_sem: parseFloat(searchParams.get('w_sem') || '0.30'),
      p_w_con: parseFloat(searchParams.get('w_con') || '0.30'),
      p_w_som: parseFloat(searchParams.get('w_som') || '0.20'),
      p_w_arc: parseFloat(searchParams.get('w_arc') || '0.20'),
      p_min_combined: parseFloat(searchParams.get('min_combined') || '0.55'),
      p_limit: parseInt(searchParams.get('limit') || '20'),
    })

    if (error) throw error

    // Enrichir avec preview text
    const ids = (data || []).map((d: any) => d.other_id)
    let previews: Record<string, any> = {}
    if (ids.length > 0) {
      const { data: kairoses } = await supabase
        .from('kairos')
        .select('id, title, raw_text, kairos_type, created_at, numinosity_score')
        .in('id', ids)
      for (const k of (kairoses || []) as any[]) {
        previews[k.id] = {
          title: k.title,
          preview: (k.raw_text || '').slice(0, 160),
          kairos_type: k.kairos_type,
          created_at: k.created_at,
          numinosity_score: k.numinosity_score,
        }
      }
    }

    const enriched = (data || []).map((d: any) => ({
      ...d,
      ...previews[d.other_id],
    }))

    return NextResponse.json({ echoes: enriched })
  } catch (e: any) {
    console.error('[kairos/echoes.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
