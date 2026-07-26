import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import crypto from 'crypto'
import { requireAuth } from '@/lib/auth-server'

function generateInviteCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase() // 6 hex chars
}

// GET — Mes cercles (en tant que membre)
// 🔒 2026-04-20 TIER 2 (session verification)
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // Récupérer les cercles où l'user est membre actif (left_at NULL)
    const { data: memberships, error: memErr } = await supabase
      .from('circle_members')
      .select('circle_id, role, display_name, joined_at')
      .eq('user_id', userId)
      .is('left_at', null)

    if (memErr) throw memErr
    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ circles: [] })
    }

    const circleIds = memberships.map(m => m.circle_id)
    const { data: circles, error: circErr } = await supabase
      .from('circles')
      .select('*')
      .in('id', circleIds)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (circErr) throw circErr

    // Enrichir avec le rôle de l'user + nombre de membres actifs + dernière restitution preview
    const enriched = await Promise.all((circles || []).map(async (c) => {
      const mem = memberships.find(m => m.circle_id === c.id)
      const [{ count }, lastRestit] = await Promise.all([
        supabase
          .from('circle_members')
          .select('id', { count: 'exact', head: true })
          .eq('circle_id', c.id)
          .is('left_at', null),
        supabase
          .from('circle_restitutions')
          .select('id, narrative_text, requested_at, status')
          .eq('circle_id', c.id)
          .eq('status', 'ready')
          .order('requested_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
      ])
      return {
        ...c,
        my_role: mem?.role,
        member_count: count || 0,
        last_restitution: lastRestit.data
          ? {
              id: lastRestit.data.id,
              requested_at: lastRestit.data.requested_at,
              preview: (lastRestit.data.narrative_text || '').slice(0, 220),
            }
          : null,
      }
    }))

    return NextResponse.json({ circles: enriched })
  } catch (error: any) {
    console.error('Circles list error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — Créer un cercle
// 🔒 2026-04-20 TIER 2 (session verification)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const {
      name,
      description,
      maxMembers,
      frequency,
      // 2026-04-25 — Refonte Cercle V1 (Bible §3.4.1)
      type,                // 'spontane' | 'intentionnel' | 'facilite'
      intention_text,      // libre, V1 = single, V2 = jusqu'à 3 sous-intentions
      sub_intentions,      // string[] optionnel (jusqu'à 3)
      // 2026-04-28 — Cercles éphémères 21j (T2 Niveau 3)
      ephemeral_days,      // number 1..90 ; null = cercle non-éphémère
    } = body
    if (!name) {
      return NextResponse.json({ error: 'name required' }, { status: 400 })
    }

    // ephemeral_days validation : nullable, max 90
    let ephemeralUntil: string | null = null
    if (ephemeral_days !== undefined && ephemeral_days !== null && ephemeral_days !== '') {
      const days = Number(ephemeral_days)
      if (Number.isFinite(days) && days >= 1 && days <= 90) {
        ephemeralUntil = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString()
      }
    }

    // type fallback : 'spontane' si non précisé (Bible §3.4.1 : zéro protocole)
    const validTypes = new Set(['spontane', 'intentionnel', 'facilite'])
    const safeType = validTypes.has(type) ? type : 'spontane'

    // Stocker sous-intentions dans intention_history (jsonb) pour préserver historique
    const subList = Array.isArray(sub_intentions)
      ? sub_intentions.filter((s: any) => typeof s === 'string' && s.trim()).slice(0, 3)
      : []
    const intentionHistory = (safeType === 'intentionnel' && (intention_text || subList.length))
      ? [{
          set_at: new Date().toISOString(),
          set_by: userId,
          intention: intention_text || null,
          sub_intentions: subList,
        }]
      : null

    // Générer un code d'invitation unique (6 chars, lisible)
    const inviteCode = generateInviteCode()

    const insertPayload: any = {
      name,
      description: description || null,
      created_by: userId,
      invite_code: inviteCode,
      max_members: maxMembers || 8,
      frequency: frequency || 'weekly',
      type: safeType,
      intention_text: safeType === 'intentionnel' ? (intention_text || null) : null,
      intention_history: intentionHistory,
    }
    if (ephemeralUntil) {
      insertPayload.ephemeral_until = ephemeralUntil
    }

    const { data: circle, error: createErr } = await supabase
      .from('circles')
      .insert(insertPayload)
      .select()
      .single()

    if (createErr) throw createErr

    // Auto-join le créateur comme gardien
    const { error: joinErr } = await supabase
      .from('circle_members')
      .insert({
        circle_id: circle.id,
        user_id: userId,
        role: 'guardian',
        display_name: body.displayName || null,
      })

    if (joinErr) throw joinErr

    return NextResponse.json({ circle: { ...circle, my_role: 'guardian', member_count: 1 } }, { status: 201 })
  } catch (error: any) {
    console.error('Circle create error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
