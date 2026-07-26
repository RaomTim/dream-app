import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/great-dreams — le journal à part.
 * Réf : TAXONOMIE-GRANDS-REVES.md §3.
 *
 * Rend DEUX collections, jamais fusionnées :
 *   - dreams        : les rêves marqués (kairos.user_marked_numinous = true)
 *   - interpretations : les interprétations gardées (kairos_interpretations.status='kept')
 *
 * Aucune écriture ici : le marquage passe par PATCH /api/kairos/[id] (porte
 * unique). Aucun filtre sur numinosity_score — un rêve n'entre JAMAIS dans ce
 * journal par décision de l'IA, uniquement par le tap du rêveur (§1.5).
 *
 * Query : ?sort=reve (défaut, date du rêve) | ?sort=reconnu (date de marquage)
 *
 * Yeshua (Opus, A3), 2026-07-26.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const sort = searchParams.get('sort') === 'reconnu' ? 'reconnu' : 'reve'

    const { data: dreams, error: dErr } = await supabase
      .from('kairos')
      .select('id, title, raw_text, kairos_type, created_at, marked_great_at, great_dream_facets, great_dream_note, numinosity_score')
      .eq('user_id', userId)
      .eq('user_marked_numinous', true)
      .order(sort === 'reconnu' ? 'marked_great_at' : 'created_at', { ascending: false, nullsFirst: false })
      .limit(200)
    if (dErr) throw dErr

    // Les interprétations gardées. Elles existaient déjà (status/kept_at) mais
    // ne vivaient que sur la fiche de leur rêve — c'est ça qu'on répare, pas un
    // nouveau flag (§1.4).
    const { data: kept, error: iErr } = await supabase
      .from('kairos_interpretations')
      .select('id, kairos_id, body, resonance_note, kept_at, created_at')
      .eq('user_id', userId)
      .eq('status', 'kept')
      .order('kept_at', { ascending: false, nullsFirst: false })
      .limit(100)
    if (iErr) throw iErr

    // Titre du rêve porteur, pour que l'interprétation gardée soit cliquable et située.
    const parentIds = Array.from(new Set((kept || []).map((k: any) => k.kairos_id).filter(Boolean)))
    let parents: Record<string, { title: string | null; created_at: string }> = {}
    if (parentIds.length) {
      const { data: ps } = await supabase
        .from('kairos')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .in('id', parentIds)
      for (const p of ps || []) parents[p.id] = { title: p.title, created_at: p.created_at }
    }

    return NextResponse.json({
      dreams: (dreams || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        excerpt: (d.raw_text || '').replace(/\s+/g, ' ').trim().slice(0, 280),
        kairos_type: d.kairos_type,
        created_at: d.created_at,
        marked_great_at: d.marked_great_at,
        facets: d.great_dream_facets || [],
        note: d.great_dream_note,
      })),
      interpretations: (kept || []).map((k: any) => ({
        id: k.id,
        kairos_id: k.kairos_id,
        body: k.body,
        resonance_note: k.resonance_note,
        kept_at: k.kept_at || k.created_at,
        dream_title: parents[k.kairos_id]?.title ?? null,
        dream_created_at: parents[k.kairos_id]?.created_at ?? null,
      })),
    })
  } catch (e: any) {
    console.error('[great-dreams.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
