import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/dream-signs/[id]
 *
 * PATCH  → update a dream sign (toggle is_personal_sign for MILD ★, edit category)
 * DELETE → remove a dream sign
 *
 * Auteur : Yeshua, 2026-04-26 ; refonte 2026-04-28 (is_personal_sign).
 */

export async function PATCH(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const allowed = ['is_personal_sign', 'sign_category', 'sign_label']
    const patch: Record<string, any> = {}
    for (const k of allowed) {
      if (k in body) patch[k] = body[k]
    }

    const { data, error } = await supabase
      .from('lucid_dream_signs')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ dream_sign: data })
  } catch (e: any) {
    console.error('[lucid.signs.PATCH]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  try {
    const id = ctx.params.id
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { error } = await supabase
      .from('lucid_dream_signs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[lucid.signs.DELETE]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
