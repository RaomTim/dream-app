import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { wallClient, nightLabels } from '@/lib/wall'

/**
 * GET /api/wall/feed?tab=nuit|jour&cursor=<ISO>
 *
 * LE MUR — flux public ANONYME (SPEC §5 · M1).
 * Chronologique pur, groupé par nuit calendaire. Chaque dépôt ne renvoie
 * QUE { id, body, created_at } + une signature relative (« cette nuit »).
 *
 * RÈGLE D'OR : jamais de user_id, jamais d'identité d'auteur, aucun compteur public.
 *
 * Yeshua (Opus), 2026-07-11.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error

    const { searchParams } = new URL(req.url)
    const tabParam = searchParams.get('tab') || 'nuit'
    const tab: 'nuit' | 'jour' = tabParam === 'jour' ? 'jour' : 'nuit'
    const cursor = searchParams.get('cursor')
    const limit = Math.min(60, parseInt(searchParams.get('limit') || '30', 10) || 30)

    const wall = wallClient()

    let query = wall
      .from('posts')
      // ⚠️ RÈGLE D'OR : sélection stricte — id, body, created_at UNIQUEMENT.
      .select('id, body, created_at')
      .eq('tab', tab)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit + 1) // +1 pour détecter la page suivante

    if (cursor) query = query.lt('created_at', cursor)

    const { data, error } = await query
    if (error) throw error

    const rows = (data || []).slice(0, limit)
    const nextCursor =
      (data || []).length > limit ? rows[rows.length - 1]?.created_at ?? null : null

    // Regroupement par nuit calendaire (ordre décroissant préservé)
    const now = new Date()
    const groups: {
      date: string
      separator: string
      posts: { id: string; body: string; created_at: string; when: string }[]
    }[] = []
    const byDate = new Map<string, (typeof groups)[number]>()

    for (const r of rows) {
      const labels = nightLabels(r.created_at, tab, now)
      let g = byDate.get(labels.dateKey)
      if (!g) {
        g = { date: labels.dateKey, separator: labels.separator, posts: [] }
        byDate.set(labels.dateKey, g)
        groups.push(g)
      }
      g.posts.push({
        id: r.id,
        body: r.body,
        created_at: r.created_at,
        when: labels.signature, // « Quelqu'un · <when> »
      })
    }

    return NextResponse.json({ tab, groups, next_cursor: nextCursor })
  } catch (e: any) {
    console.error('[wall/feed.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
