import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/user/wow-state — server-authoritative Wow registry.
 *
 * GET → renvoie les flags Wow déjà tirés pour le user courant.
 *        Utilisé par le frontend au mount pour décider quels Wow déclencher
 *        (en plus du localStorage `wowRegistry`).
 *
 * POST { name } → marque un Wow comme tiré (idempotent).
 *        Côté DB, INSERT ON CONFLICT avec COALESCE — un Wow déjà tiré n'est
 *        jamais retiré.
 *
 * Auteur : Yeshua, 2026-04-25 (post-deploy V1.2 chantier 1).
 */

const NAME_TO_COLUMN: Record<string, string> = {
  'first-launch': 'first_launch_fired_at',
  'premier-kairos': 'first_kairos_fired_at',
  'premier-echo-prophetique': 'first_prophetic_echo_fired_at',
  'big-dream-marquage': 'first_big_dream_fired_at',
  'naissance-noeud': 'first_constellation_birth_fired_at',
  'premiere-restitution-cercle': 'first_circle_restitution_fired_at',
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_wow_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error

    const fired: Record<string, string | null> = {}
    for (const [name, col] of Object.entries(NAME_TO_COLUMN)) {
      fired[name] = (data as any)?.[col] ?? null
    }
    return NextResponse.json({ fired, last_constellation_node_count: data?.last_constellation_node_count ?? 0 })
  } catch (e: any) {
    console.error('[user.wow-state.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const name = String(body?.name || '')
    const col = NAME_TO_COLUMN[name]
    if (!col) {
      return NextResponse.json({ error: `Unknown wow name: ${name}` }, { status: 400 })
    }

    const supabase = createServerClient()
    // Idempotent : insère si pas existant, sinon laisse la valeur existante (COALESCE).
    const now = new Date().toISOString()
    const { error: upErr } = await supabase
      .from('user_wow_state')
      .upsert(
        { user_id: userId, [col]: now },
        { onConflict: 'user_id', ignoreDuplicates: false }
      )
    if (upErr) throw upErr

    // S'assurer qu'on n'écrase pas une date plus ancienne (COALESCE manuel)
    const { data: row } = await supabase
      .from('user_wow_state')
      .select(col)
      .eq('user_id', userId)
      .maybeSingle()

    return NextResponse.json({ ok: true, name, fired_at: (row as any)?.[col] || now })
  } catch (e: any) {
    console.error('[user.wow-state.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
