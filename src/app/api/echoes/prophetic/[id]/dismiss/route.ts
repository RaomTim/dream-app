import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/echoes/prophetic/[id]/dismiss — Sprint P1 (2026-04-27)
 *
 * Marque un écho prophétique comme dismiss explicitement par l'user
 * (clic sur le "x" du chuchotement DreamHome).
 *
 * Pose `kairos.prophetic_dismissed_at = now()` → exclut définitivement
 * cet écho de la requête /matured (qui filtre sur dismissed_at IS NULL).
 *
 * Body : aucun (id dans path).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!params.id) {
      return NextResponse.json({ error: 'kairos id required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await supabase
      .from('kairos')
      .update({ prophetic_dismissed_at: new Date().toISOString() })
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
