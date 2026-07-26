import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * PATCH /api/journal/entries/[id]
 * Mise à jour partielle d'une entrée Journal de Vie.
 * Whitelist : raw_text, protocol_used, protocol_session_data, protocol_completed_at,
 * user_archived.
 *
 * Yeshua, 2026-04-26 — pour support protocole "Fin de Journée".
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const allowed: Record<string, any> = {}
    if (typeof body.raw_text === 'string' && body.raw_text.trim().length > 0) {
      allowed.raw_text = body.raw_text.trim()
      allowed.categorize_pending = true
    }
    if (typeof body.user_archived === 'boolean') {
      allowed.user_archived = body.user_archived
    }
    if (typeof body.protocol_used === 'string' && body.protocol_used.length > 0) {
      allowed.protocol_used = body.protocol_used
    }
    if (body.protocol_session_data && typeof body.protocol_session_data === 'object') {
      allowed.protocol_session_data = body.protocol_session_data
    }
    if (typeof body.protocol_completed_at === 'string') {
      allowed.protocol_completed_at = body.protocol_completed_at
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'No allowed fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('life_journal_entries')
      .update(allowed)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })

    return NextResponse.json({ entry: data })
  } catch (e: any) {
    console.error('[journal/entries/id.PATCH] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * DELETE /api/journal/entries/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { error } = await supabase
      .from('life_journal_entries')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[journal/entries/id.DELETE] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
