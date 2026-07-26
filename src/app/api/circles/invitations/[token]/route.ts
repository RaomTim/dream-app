import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * GET /api/circles/invitations/[token]
 *
 * Preview PUBLIC d'une invitation cercle (no auth).
 * Renvoie : { circle: { name, intention, member_count, glyph, ephemeral_until },
 *            invitation: { uses_remaining, expires_at },
 *            can_join: boolean }
 *
 * Privacy radicale : ne révèle JAMAIS les noms/identités des membres.
 * Si invitation expirée / revoked / épuisée → 410 Gone.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 1) Lookup invitation
    const { data: inv, error: invErr } = await supabase
      .from('circle_invitations')
      .select('token, circle_id, created_at, expires_at, uses_remaining, uses_total, revoked_at')
      .eq('token', token)
      .maybeSingle()

    if (invErr) throw invErr
    if (!inv) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
    }

    const now = Date.now()
    const expired = new Date(inv.expires_at).getTime() <= now
    const revoked = !!inv.revoked_at
    const exhausted = (inv.uses_remaining ?? 0) <= 0

    if (expired || revoked || exhausted) {
      return NextResponse.json(
        {
          error: revoked
            ? 'Invitation revoked'
            : expired
              ? 'Invitation expired'
              : 'Invitation exhausted',
          can_join: false,
          invitation: {
            uses_remaining: inv.uses_remaining,
            expires_at: inv.expires_at,
            revoked,
            expired,
            exhausted,
          },
        },
        { status: 410 }
      )
    }

    // 2) Lookup circle (champs publics minimaux uniquement)
    const { data: circle, error: cErr } = await supabase
      .from('circles')
      .select('id, name, type, intention_text, ephemeral_until, closed_at, is_active, max_members')
      .eq('id', inv.circle_id)
      .maybeSingle()

    if (cErr) throw cErr
    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 })
    }

    if (circle.closed_at) {
      return NextResponse.json(
        { error: 'Circle closed', can_join: false },
        { status: 410 }
      )
    }
    if (circle.is_active === false) {
      return NextResponse.json(
        { error: 'Circle archived', can_join: false },
        { status: 410 }
      )
    }

    // 3) Member count (pas de noms)
    const { count } = await supabase
      .from('circle_members')
      .select('id', { count: 'exact', head: true })
      .eq('circle_id', circle.id)
      .is('left_at', null)

    const memberCount = count || 0
    const isFull = memberCount >= (circle.max_members || 12)

    // Glyphe public : prochaine lettre grecque libre — purement décoratif.
    // On reste générique : la lettre exacte sera attribuée par trigger DB lors du join.
    const greekLetters = ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ']
    const glyph = greekLetters[Math.min(memberCount, greekLetters.length - 1)]

    return NextResponse.json({
      circle: {
        // PAS d'id leak intentionnel — on garde id pour permettre le accept,
        // mais la preview reste minimaliste.
        id: circle.id,
        name: circle.name,
        type: circle.type || 'spontane',
        intention: circle.intention_text || null,
        member_count: memberCount,
        glyph,
        ephemeral_until: circle.ephemeral_until || null,
      },
      invitation: {
        uses_remaining: inv.uses_remaining,
        expires_at: inv.expires_at,
      },
      can_join: !isFull,
    })
  } catch (e: any) {
    console.error('[circle invitation preview] error:', e)
    return NextResponse.json(
      { error: e?.message || 'Preview failed' },
      { status: 500 }
    )
  }
}
