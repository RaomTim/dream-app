import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/user/skip
 * Body: { context_type, context_id?, skip_reason? }
 *
 * User skip d'un écho/voix/proposition. Sert à pondérer edges.weight
 * dans le pipeline (chantier 7).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.context_type) {
      return NextResponse.json({ error: 'context_type required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_skips')
      .insert({
        user_id: userId,
        context_type: body.context_type,
        context_id: body.context_id || null,
        skip_reason: body.skip_reason || null,
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ skip: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
