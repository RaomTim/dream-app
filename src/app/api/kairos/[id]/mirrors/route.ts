import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/[id]/mirrors
 * Type 5 — inverse mirrors (sem high + valence opposite).
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

    const { data, error } = await supabase.rpc('find_kairos_inverse_mirrors', {
      p_user_id: userId,
      p_kairos_id: params.id,
      p_limit: 5,
    })
    if (error) throw error

    return NextResponse.json({ mirrors: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
