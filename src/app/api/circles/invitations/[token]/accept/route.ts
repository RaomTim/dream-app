import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/circles/invitations/[token]/accept
 *
 * Auth required. Vérifie la validité du token, decrement uses_remaining,
 * INSERT dans circle_members (si pas déjà membre).
 *
 * Returns : { circle_id, already_member?: true }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const token = params.token

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    // 1) Lookup invitation
    const { data: inv, error: invErr } = await supabase
      .from('circle_invitations')
      .select('token, circle_id, expires_at, uses_remaining, uses_total, revoked_at')
      .eq('token', token)
      .maybeSingle()

    if (invErr) throw invErr
    if (!inv) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    const now = Date.now()
    if (inv.revoked_at) {
      return NextResponse.json({ error: 'Invitation revoked' }, { status: 410 })
    }
    if (new Date(inv.expires_at).getTime() <= now) {
      return NextResponse.json({ error: 'Invitation expired' }, { status: 410 })
    }
    if ((inv.uses_remaining ?? 0) <= 0) {
      return NextResponse.json({ error: 'Invitation exhausted' }, { status: 410 })
    }

    // 2) Lookup circle (état actif/non-clos)
    const { data: circle, error: cErr } = await supabase
      .from('circles')
      .select('id, max_members, is_active, closed_at')
      .eq('id', inv.circle_id)
      .maybeSingle()

    if (cErr) throw cErr
    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 })
    }
    if (circle.closed_at || circle.is_active === false) {
      return NextResponse.json({ error: 'Circle closed' }, { status: 410 })
    }

    // 3) Already member ? — short-circuit (pas de décrément)
    const { data: existing } = await supabase
      .from('circle_members')
      .select('id, left_at')
      .eq('circle_id', circle.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing && !existing.left_at) {
      return NextResponse.json({
        circle_id: circle.id,
        already_member: true,
      })
    }

    // 4) Capacity check
    const { count: activeCount } = await supabase
      .from('circle_members')
      .select('id', { count: 'exact', head: true })
      .eq('circle_id', circle.id)
      .is('left_at', null)

    if ((activeCount || 0) >= (circle.max_members || 12)) {
      return NextResponse.json({ error: 'Circle full' }, { status: 403 })
    }

    // 5) Insert membership (ré-active si soft-leave passé)
    if (existing && existing.left_at) {
      const { error: updErr } = await supabase
        .from('circle_members')
        .update({ left_at: null, joined_at: new Date().toISOString() })
        .eq('id', existing.id)
      if (updErr) throw updErr
    } else {
      const { error: insErr } = await supabase
        .from('circle_members')
        .insert({
          circle_id: circle.id,
          user_id: userId,
          role: 'dreamer',
        })
      if (insErr) throw insErr
    }

    // 6) Decrement uses_remaining + increment uses_total
    const { error: decErr } = await supabase
      .from('circle_invitations')
      .update({
        uses_remaining: Math.max(0, (inv.uses_remaining ?? 1) - 1),
        uses_total: (inv.uses_total ?? 0) + 1,
      })
      .eq('token', token)

    if (decErr) {
      console.warn('[circle invitation accept] decrement failed (non-fatal):', decErr.message)
    }

    return NextResponse.json({
      circle_id: circle.id,
      already_member: false,
    })
  } catch (e: any) {
    console.error('[circle invitation accept] error:', e)
    return NextResponse.json(
      { error: e?.message || 'Accept failed' },
      { status: 500 }
    )
  }
}
