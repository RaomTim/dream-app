/**
 * /api/circles/[id]/annales — Annales du cercle (C.7)
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (archive des rêves marquants partagés)
 *
 * Vue chronologique inversée des kairos partagés en mode shared_clear (kairos_circle_shared)
 * + comptage des marques "tale_marquant" (circle_kairos_marks).
 *
 * Filtres optionnels :
 *   ?member=<user_id>     → seulement ce contributeur
 *   ?motif=<tag>          → seulement les kairos contenant ce motif (motif_tags ilike)
 *   ?month=YYYY-MM        → seulement ce mois calendaire
 *   ?starred=1            → seulement ceux marqués par au moins 1 membre
 *   ?limit=N              → cap volume (default 50, max 200)
 *
 * Privacy :
 *   - Lit kairos_circle_shared (partage cleartext explicite, pas l'opt-in anonymisé).
 *   - Le pseudonym vient de kairos_circle_shared.pseudonym (déposé au moment du partage clear).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

async function isMember(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
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
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const member = searchParams.get('member')
    const motif = searchParams.get('motif')
    const month = searchParams.get('month') // YYYY-MM
    const starredOnly = searchParams.get('starred') === '1'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10) || 50, 200)

    // 1. Liste shared
    let query = supabase
      .from('kairos_circle_shared')
      .select('kairos_id, user_id, pseudonym, shared_at')
      .eq('circle_id', params.id)
      .order('shared_at', { ascending: false })
      .limit(limit)

    if (member) query = query.eq('user_id', member)

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [yy, mm] = month.split('-')
      const start = new Date(`${yy}-${mm}-01T00:00:00Z`)
      const end = new Date(start)
      end.setUTCMonth(end.getUTCMonth() + 1)
      query = query.gte('shared_at', start.toISOString()).lt('shared_at', end.toISOString())
    }

    const { data: shares, error } = await query
    if (error) throw error
    if (!shares || shares.length === 0) {
      return NextResponse.json({ entries: [], total: 0 })
    }

    // 2. Récupère les kairos liés
    const kairosIds = Array.from(new Set(shares.map((s: any) => s.kairos_id)))
    const { data: kairosRows } = await supabase
      .from('kairos')
      .select('id, raw_text, motif_tags, root_dream_patterns, figures, affective_valence, created_at')
      .in('id', kairosIds)

    const kairosMap = new Map<string, any>()
    for (const k of kairosRows || []) kairosMap.set(String((k as any).id), k)

    // 3. Récupère les marks (tale_marquant) par kairos pour ce cercle
    const { data: marks } = await supabase
      .from('circle_kairos_marks')
      .select('kairos_id, user_id, marked_at')
      .eq('circle_id', params.id)
      .in('kairos_id', kairosIds)

    const marksByKairos = new Map<string, { count: number; mine: boolean }>()
    for (const id of kairosIds) marksByKairos.set(id, { count: 0, mine: false })
    for (const m of marks || []) {
      const k = String((m as any).kairos_id)
      const cur = marksByKairos.get(k) || { count: 0, mine: false }
      cur.count++
      if (String((m as any).user_id) === String(userId)) cur.mine = true
      marksByKairos.set(k, cur)
    }

    // 4. Compose entries
    let entries = shares
      .map((s: any) => {
        const k = kairosMap.get(String(s.kairos_id))
        if (!k) return null
        const marksInfo = marksByKairos.get(String(s.kairos_id)) || { count: 0, mine: false }
        return {
          kairos_id: s.kairos_id,
          user_id: s.user_id,
          pseudonym: s.pseudonym,
          shared_at: s.shared_at,
          raw_text: k.raw_text,
          motif_tags: k.motif_tags || [],
          root_dream_patterns: k.root_dream_patterns || [],
          figures: k.figures || null,
          valence: k.affective_valence,
          kairos_created_at: k.created_at,
          marks_count: marksInfo.count,
          marked_by_me: marksInfo.mine,
        }
      })
      .filter(Boolean) as any[]

    if (motif) {
      const m = motif.toLowerCase()
      entries = entries.filter((e: any) => {
        const tags = (e.motif_tags as string[]).map((t) => t.toLowerCase())
        const roots = (e.root_dream_patterns as string[]).map((t) => t.toLowerCase())
        return tags.some((t) => t.includes(m)) || roots.some((t) => t.includes(m))
      })
    }

    if (starredOnly) {
      entries = entries.filter((e: any) => e.marks_count > 0)
    }

    return NextResponse.json({ entries, total: entries.length })
  } catch (e: any) {
    console.warn('[circle/annales GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
