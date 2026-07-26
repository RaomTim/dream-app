import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/circles/[id]/invitations
 *
 * Crée un nouveau lien magique d'invitation pour un cercle.
 * Auteur doit être membre actif. Token urlsafe ~43 chars (32 bytes base64url).
 *
 * Body : {
 *   uses_remaining?: number       // default 12
 *   expires_in_days?: number      // default 14 (max 60)
 * }
 *
 * Returns : { token, share_url, expires_at, uses_remaining }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const circleId = params.id

    // Membership check : circle_members.user_id est TEXT legacy
    const { data: member, error: memErr } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .is('left_at', null)
      .maybeSingle()

    if (memErr) throw memErr
    if (!member) {
      return NextResponse.json(
        { error: 'Not a member of this circle' },
        { status: 403 }
      )
    }

    // Validation params
    const usesRemaining = Number.isFinite(body?.uses_remaining)
      ? Math.max(1, Math.min(100, Number(body.uses_remaining)))
      : 12
    const expiresInDays = Number.isFinite(body?.expires_in_days)
      ? Math.max(1, Math.min(60, Number(body.expires_in_days)))
      : 14

    // Token urlsafe : 32 bytes → 43 chars base64url
    const token = crypto.randomBytes(32).toString('base64url')
    const expiresAt = new Date(Date.now() + expiresInDays * 24 * 3600 * 1000).toISOString()

    const { data: inv, error: insErr } = await supabase
      .from('circle_invitations')
      .insert({
        token,
        circle_id: circleId,
        created_by: userId,
        expires_at: expiresAt,
        uses_remaining: usesRemaining,
        uses_total: 0,
      })
      .select('token, expires_at, uses_remaining')
      .single()

    if (insErr) throw insErr

    // Build share URL — utilise origin Vercel par défaut si présent.
    const origin =
      req.headers.get('origin') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://dream-alpha-bice.vercel.app'

    const shareUrl = `${origin.replace(/\/+$/, '')}/circle-invite/${encodeURIComponent(inv.token)}`

    return NextResponse.json(
      {
        token: inv.token,
        share_url: shareUrl,
        expires_at: inv.expires_at,
        uses_remaining: inv.uses_remaining,
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error('[circle invitations.POST] error:', e)
    return NextResponse.json(
      { error: e?.message || 'Failed to create invitation' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/circles/[id]/invitations
 * Liste les invitations actives du cercle (créateur only — chaque user voit les
 * tokens qu'il a personnellement créés).
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
    const { data, error } = await supabase
      .from('circle_invitations')
      .select('token, created_at, expires_at, uses_remaining, uses_total, revoked_at')
      .eq('circle_id', params.id)
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw error
    return NextResponse.json({ invitations: data || [] })
  } catch (e: any) {
    console.error('[circle invitations.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
