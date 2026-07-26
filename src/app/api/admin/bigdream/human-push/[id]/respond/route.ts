/**
 * POST /api/admin/bigdream/human-push/[id]/respond
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Push humain payant — réponse praticien).
 *
 * Body : { response_text: string }
 *
 * Auth : praticien admin (vérifie ADMIN_PRATICIEN_EMAILS env var contient l'email
 * du user authentifié). Marque le push delivered + insère pending_proactive_messages
 * pour notifier le user.
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_PRATICIEN_EMAILS || process.env.ADMIN_EMAILS || ''
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const responseText: string =
      typeof body.response_text === 'string' ? body.response_text.trim().slice(0, 8000) : ''
    if (responseText.length < 20) {
      return NextResponse.json(
        { error: 'response_text requis (min 20 caractères)' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // 1) Vérifie que le user authentifié est dans ADMIN_PRATICIEN_EMAILS
    const adminEmails = getAdminEmails()
    if (adminEmails.length === 0) {
      return NextResponse.json(
        { error: 'ADMIN_PRATICIEN_EMAILS non configuré' },
        { status: 500 }
      )
    }

    const { data: userRecord } = await supabase.auth.admin.getUserById(userId)
    const email = (userRecord?.user?.email || '').toLowerCase()
    if (!email || !adminEmails.includes(email)) {
      return NextResponse.json({ error: 'forbidden — non praticien' }, { status: 403 })
    }

    // 2) Charge le push
    const { data: push, error: pErr } = await supabase
      .from('bigdream_human_pushes')
      .select('id, user_id, status')
      .eq('id', params.id)
      .maybeSingle()
    if (pErr) throw pErr
    if (!push) return NextResponse.json({ error: 'push introuvable' }, { status: 404 })

    if (push.status === 'delivered') {
      return NextResponse.json({ error: 'push déjà délivré' }, { status: 409 })
    }
    if (push.status === 'refunded') {
      return NextResponse.json({ error: 'push remboursé' }, { status: 409 })
    }

    // 3) Mark delivered + assign praticien_id
    const nowIso = new Date().toISOString()
    const { data: updated, error: uErr } = await supabase
      .from('bigdream_human_pushes')
      .update({
        status: 'delivered',
        praticien_id: userId,
        praticien_response_text: responseText,
        delivered_at: nowIso,
      })
      .eq('id', params.id)
      .select('id, status, delivered_at')
      .single()

    if (uErr || !updated) throw uErr || new Error('update failed')

    // 4) Notify user via pending_proactive_messages (best-effort)
    try {
      await supabase.from('pending_proactive_messages').insert({
        user_id: push.user_id,
        scheduled_for: nowIso,
        category: 'echo_detected',
        content:
          "Une réponse humaine vient d'arriver pour ton Big Dream. Elle est dans ton journal de pushes.",
      })
    } catch (notifyErr) {
      console.warn(
        '[bigdream.admin.respond] notify failed:',
        notifyErr instanceof Error ? notifyErr.message : 'unknown'
      )
    }

    return NextResponse.json({ push: updated })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.admin.respond] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
