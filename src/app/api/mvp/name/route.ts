import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * POST /api/mvp/name — rituel de nommage du rêve.
 * Body: { kairos_id, title }
 * Yeshua, 2026-06-10 (Vague 1 MVP).
 */
export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : ''
    if (!body.kairos_id || !title) return corsify(NextResponse.json({ error: 'kairos_id et title requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { error } = await supabase
      .from('kairos')
      .update({ title })
      .eq('id', body.kairos_id)
      .eq('user_id', userId)
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))

    return corsify(NextResponse.json({ ok: true }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
