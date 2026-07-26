import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * DELETE /api/circles/[id]/invitations/[token]
 * Révoque une invitation. Auth required + créateur de l'invitation only.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; token: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // Vérifie ownership avant revoke
    const { data: inv, error: findErr } = await supabase
      .from('circle_invitations')
      .select('token, created_by, circle_id, revoked_at')
      .eq('token', params.token)
      .eq('circle_id', params.id)
      .maybeSingle()

    if (findErr) throw findErr
    if (!inv) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }
    if (inv.created_by !== userId) {
      return NextResponse.json({ error: 'Only the creator can revoke' }, { status: 403 })
    }
    if (inv.revoked_at) {
      return NextResponse.json({ ok: true, already_revoked: true })
    }

    const { error: updErr } = await supabase
      .from('circle_invitations')
      .update({ revoked_at: new Date().toISOString() })
      .eq('token', params.token)

    if (updErr) throw updErr

    return NextResponse.json({ ok: true, token: params.token })
  } catch (e: any) {
    console.error('[circle invitations.DELETE] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
