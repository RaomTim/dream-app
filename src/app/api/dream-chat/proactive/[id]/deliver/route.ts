/**
 * /api/dream-chat/proactive/[id]/deliver — F.1 (2026-04-28)
 *
 * Spec : 2_DESIGN.md §11.bis.20.7
 *
 * POST → marque un pending_proactive_messages comme delivered.
 *   body : { user_responded?: boolean | null, response_kind?: 'yes'|'later'|'no'|null }
 *
 *   - [oui →]            → user_responded=true,  response_kind='yes'
 *   - [plus tard]        → user_responded=null,  response_kind='later'  (delivered seulement)
 *   - [pas maintenant]   → user_responded=false, response_kind='no'
 *
 * Toujours scoped au user authentifié (RLS + double-check user_id).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function POST(req: NextRequest, ctx: { params: { id: string } }) {
  const id = ctx?.params?.id
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'id requis' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const userResponded =
    body?.user_responded === true ? true :
    body?.user_responded === false ? false : null

  const responseKind = ['yes', 'later', 'no'].includes(body?.response_kind)
    ? (body.response_kind as 'yes' | 'later' | 'no')
    : null

  try {
    const supabase = createServerClient()
    const updates: Record<string, unknown> = {
      delivered_at: new Date().toISOString(),
    }
    if (userResponded !== null) updates.user_responded = userResponded
    if (responseKind) updates.response_kind = responseKind

    const { data, error } = await supabase
      .from('pending_proactive_messages')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, delivered_at, user_responded')
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (!data) {
      return NextResponse.json({ error: 'message introuvable ou déjà livré' }, { status: 404 })
    }
    return NextResponse.json({ message: data })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
