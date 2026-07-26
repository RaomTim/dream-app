import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/[id]/prophetic
 * Type 7 — past dreams résonnant avec ce kairos (Δt ≥ 30j).
 *
 * D4 Tim 2026-04-25 : seuils stricts 0.75/0.4 + flag transparence dans metadata.
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

    const { data, error } = await supabase.rpc('find_kairos_prophetic', {
      p_user_id: userId,
      p_kairos_id: params.id,
      p_min_days_back: parseInt(searchParams.get('min_days_back') || '30'),
      p_min_combined: parseFloat(searchParams.get('min_combined') || '0.75'),
      p_min_numinosity_past: parseFloat(searchParams.get('min_numinosity_past') || '0.4'),
      p_limit: parseInt(searchParams.get('limit') || '5'),
    })
    if (error) throw error

    // Enrich previews
    const ids = (data || []).map((d: any) => d.past_id)
    const previewMap: Record<string, any> = {}
    if (ids.length > 0) {
      const { data: kairoses } = await supabase
        .from('kairos')
        .select('id, raw_text, created_at, numinosity_score, kairos_type')
        .in('id', ids)
      for (const k of (kairoses || []) as any[]) {
        previewMap[k.id] = {
          preview: (k.raw_text || '').slice(0, 200),
          created_at: k.created_at,
          kairos_type: k.kairos_type,
        }
      }
    }

    const enriched = (data || []).map((d: any) => ({
      ...d,
      ...previewMap[d.past_id],
      sensitive_notice: 'D4 Tim 2026-04-25 : signal prophétique probabiliste, pas certitude.',
    }))

    return NextResponse.json({ propheties: enriched })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
