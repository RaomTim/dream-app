import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/numinous
 * Type 8 — kairos avec numinosity ≥ seuil.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)

    const { data, error } = await supabase.rpc('list_kairos_numinous', {
      p_user_id: userId,
      p_min_score: parseFloat(searchParams.get('min_score') || '0.7'),
      p_days: parseInt(searchParams.get('days') || '365'),
      p_limit: parseInt(searchParams.get('limit') || '50'),
    })
    if (error) throw error
    return NextResponse.json({ numinous: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
