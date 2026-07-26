import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-07-11 — Yeshua (Opus) — SPEC §4 G7 (réglages du groupe)
 *
 * GET   /api/circles/[id]          → le groupe + la liste des membres (avec alias)
 * PATCH /api/circles/[id]          → éditer, selon les droits :
 *   · name           (créateur/gardien) — renommer le groupe
 *   · intention_text (créateur/gardien) — modifier l'intention
 *   · intention_clear:true            — retirer l'intention
 *   · my_alias                        — mon alias DANS CE groupe (toujours soi)
 *
 * Note : il n'existait aucune route au niveau du cercle lui-même (que des
 * sous-ressources). Ce fichier est purement additif — aucun risque de conflit.
 */

async function getMembership(supabase: any, circleId: string, userId: string) {
  const { data } = await supabase
    .from('circle_members')
    .select('id, role')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return data // { id, role } | null
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const membership = await getMembership(supabase, params.id, userId)
    if (!membership) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const [{ data: circle, error: cErr }, { data: members, error: mErr }] = await Promise.all([
      supabase.from('circles')
        .select('id, name, description, created_by, invite_code, invite_token, type, intention_text, is_active, created_at')
        .eq('id', params.id).maybeSingle(),
      supabase.from('circle_members')
        .select('user_id, role, display_name, pseudonym, joined_at')
        .eq('circle_id', params.id).is('left_at', null)
        .order('joined_at', { ascending: true }),
    ])
    if (cErr) throw cErr
    if (mErr) throw mErr
    if (!circle) return NextResponse.json({ error: 'Circle not found' }, { status: 404 })

    const memberList = (members || []).map((m: any) => ({
      user_id: m.user_id,
      role: m.role,
      alias: (m.display_name || m.pseudonym || '').trim() || null,
      is_me: m.user_id === userId,
      is_creator: m.user_id === circle.created_by,
      joined_at: m.joined_at,
    }))

    return NextResponse.json({
      circle: {
        ...circle,
        my_role: membership.role,
        member_count: memberList.length,
        i_am_creator: circle.created_by === userId,
      },
      members: memberList,
    })
  } catch (e: any) {
    console.error('[circle GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const membership = await getMembership(supabase, params.id, userId)
    if (!membership) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const { data: circle } = await supabase
      .from('circles')
      .select('id, created_by, type')
      .eq('id', params.id)
      .maybeSingle()
    if (!circle) return NextResponse.json({ error: 'Circle not found' }, { status: 404 })

    const isGuardian = circle.created_by === userId || membership.role === 'guardian'

    // 1) mon alias dans CE groupe — toujours autorisé pour soi-même
    if (typeof body.my_alias === 'string') {
      const alias = body.my_alias.trim().slice(0, 60)
      const { error } = await supabase
        .from('circle_members')
        .update({ display_name: alias || null })
        .eq('id', membership.id)
      if (error) throw error
    }

    // 2) nom + intention — créateur/gardien seulement
    const circlePatch: any = {}
    if (typeof body.name === 'string' && body.name.trim()) {
      if (!isGuardian) return NextResponse.json({ error: 'Seul le gardien peut renommer le groupe' }, { status: 403 })
      circlePatch.name = body.name.trim().slice(0, 120)
    }
    if (body.intention_clear === true) {
      if (!isGuardian) return NextResponse.json({ error: 'Seul le gardien peut retirer l\'intention' }, { status: 403 })
      circlePatch.intention_text = null
    } else if (typeof body.intention_text === 'string') {
      if (!isGuardian) return NextResponse.json({ error: 'Seul le gardien peut modifier l\'intention' }, { status: 403 })
      const it = body.intention_text.trim()
      circlePatch.intention_text = it ? it.slice(0, 600) : null
      // bascule le type en 'intentionnel' dès qu'une intention est posée
      if (it && circle.type !== 'intentionnel') circlePatch.type = 'intentionnel'
    }

    if (Object.keys(circlePatch).length) {
      const { error } = await supabase.from('circles').update(circlePatch).eq('id', params.id)
      if (error) throw error
    }

    // renvoyer l'état frais
    const { data: fresh } = await supabase
      .from('circles')
      .select('id, name, intention_text, invite_code, type')
      .eq('id', params.id)
      .maybeSingle()

    return NextResponse.json({ ok: true, circle: fresh })
  } catch (e: any) {
    console.error('[circle PATCH]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
