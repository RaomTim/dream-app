import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/constellation/snapshot
 *
 * Calcule le nombre de noeuds (figures + motifs émergents) actuellement présents
 * dans la constellation user. Compare avec last_constellation_node_count en DB.
 * Si nouveau noeud détecté → renvoie { new_nodes_count > 0 } pour permettre
 * au frontend de fire le Wow4 ("naissance-noeud").
 *
 * GET → { current_count, last_known_count, new_nodes_count, should_fire_wow4 }
 * POST { ack_count } → met à jour last_constellation_node_count après que
 *        le frontend a affiché le Wow.
 *
 * Implémentation :
 *  - On compte les motifs/figures distincts qui ont >= 2 occurrences (seuil
 *    pour qu'ils apparaissent dans la constellation).
 *  - Sources V1 : table `personal_forest` (occurrence_count >= 2) +
 *    motif_tags depuis kairos.
 *
 * Auteur : Yeshua, 2026-04-25 (post-deploy V1.2 chantier 1 / Wow4).
 */

async function computeNodeCount(supabase: any, userId: string): Promise<number> {
  // Source A : personal_forest (motifs symboliques persistés par mode legacy)
  const { count: personalCount } = await supabase
    .from('personal_forest')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('occurrence_count', 2)

  // Source B : motif_tags distincts depuis kairos (refonte V1)
  const { data: kairosRows } = await supabase
    .from('kairos')
    .select('motif_tags')
    .eq('user_id', userId)
    .not('motif_tags', 'is', null)

  const motifFreq = new Map<string, number>()
  for (const row of (kairosRows || []) as Array<{ motif_tags: string[] }>) {
    const tags = Array.isArray(row.motif_tags) ? row.motif_tags : []
    for (const tag of tags) {
      if (typeof tag !== 'string' || tag.length < 2) continue
      const key = tag.toLowerCase().trim()
      motifFreq.set(key, (motifFreq.get(key) || 0) + 1)
    }
  }
  let kairosMotifCount = 0
  motifFreq.forEach(c => { if (c >= 2) kairosMotifCount++ })

  return Math.max(personalCount || 0, kairosMotifCount)
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    const current = await computeNodeCount(supabase, userId)

    const { data: state } = await supabase
      .from('user_wow_state')
      .select('last_constellation_node_count, first_constellation_birth_fired_at')
      .eq('user_id', userId)
      .maybeSingle()

    const last = state?.last_constellation_node_count ?? 0
    const wowAlreadyFired = !!state?.first_constellation_birth_fired_at
    const newNodes = Math.max(0, current - last)
    // On ne déclenche qu'à la naissance du PREMIER noeud (Wow4 = first-time).
    // Mais on continue à tracker last_count pour permettre une V2 "naissance répétée".
    const shouldFire = newNodes > 0 && !wowAlreadyFired && current >= 1

    return NextResponse.json({
      current_count: current,
      last_known_count: last,
      new_nodes_count: newNodes,
      should_fire_wow4: shouldFire,
    })
  } catch (e: any) {
    console.error('[constellation.snapshot.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const ackCount = Number(body?.ack_count ?? await computeNodeCount(supabase, userId))

    const { error } = await supabase
      .from('user_wow_state')
      .upsert(
        { user_id: userId, last_constellation_node_count: ackCount },
        { onConflict: 'user_id' }
      )
    if (error) throw error
    return NextResponse.json({ ok: true, ack_count: ackCount })
  } catch (e: any) {
    console.error('[constellation.snapshot.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
