import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// POST — Rejoindre un cercle via code d'invitation
// 2026-04-25 — migré legacy userId-in-body → Bearer auth (Tier 2)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const { inviteCode, displayName } = body

    if (!inviteCode) {
      return NextResponse.json({ error: 'inviteCode required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Trouver le cercle
    const { data: circle, error: findErr } = await supabase
      .from('circles')
      .select('*')
      .eq('invite_code', String(inviteCode).toUpperCase())
      .eq('is_active', true)
      .single()

    if (findErr || !circle) {
      return NextResponse.json({ error: 'Cercle non trouvé ou inactif' }, { status: 404 })
    }

    // Vérifier si déjà membre
    const { data: existing } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circle.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Déjà membre de ce cercle', circle }, { status: 409 })
    }

    // Vérifier le nombre max
    const { count } = await supabase
      .from('circle_members')
      .select('id', { count: 'exact', head: true })
      .eq('circle_id', circle.id)

    if (count && count >= circle.max_members) {
      return NextResponse.json({ error: 'Cercle complet' }, { status: 403 })
    }

    // Rejoindre
    const { error: joinErr } = await supabase
      .from('circle_members')
      .insert({
        circle_id: circle.id,
        user_id: userId,
        role: 'dreamer',
        display_name: displayName || null,
      })

    if (joinErr) throw joinErr

    return NextResponse.json({
      circle: { ...circle, my_role: 'dreamer', member_count: (count || 0) + 1 },
    })
  } catch (error: any) {
    console.error('Circle join error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
