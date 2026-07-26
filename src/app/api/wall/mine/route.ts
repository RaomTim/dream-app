import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { wallClient } from '@/lib/wall'

/**
 * GET /api/wall/mine
 *   → Mes dépôts au Mur, avec leur compte de touches (ma « douce trace privée »).
 *     Sert Réglages → « Le Mur » (mes partages → les retirer).
 *
 * DELETE /api/wall/mine?post_id=<id>
 *   → Retire un de mes dépôts (soft delete : status='removed' → disparaît du feed,
 *     préserve l'intégrité des touches/reports).
 *
 * Le demandeur ne voit QUE ses propres posts. Aucune identité d'autrui n'est jamais
 * exposée (les touches sont juste comptées, pas listées).
 *
 * Yeshua (Opus), 2026-07-11.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const wall = wallClient()

    // Contrat ShareSheet (agent E) : GET /api/wall/mine?kairos_id=X → { posted: boolean }
    const kairosId = new URL(req.url).searchParams.get('kairos_id')
    if (kairosId) {
      const { data: existing, error: exErr } = await wall
        .from('posts')
        .select('id')
        .eq('user_id', userId)
        .eq('kairos_id', kairosId)
        .eq('status', 'published')
        .maybeSingle()
      if (exErr) throw exErr
      return NextResponse.json({ posted: !!existing, post_id: existing?.id ?? null })
    }

    const { data: posts, error } = await wall
      .from('posts')
      .select('id, kairos_id, tab, body, created_at, status')
      .eq('user_id', userId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
    if (error) throw error

    // Compte de touches par post (trace privée de l'auteur)
    const withCounts = await Promise.all(
      (posts || []).map(async (p) => {
        const { count } = await wall
          .from('touches')
          .select('id', { count: 'exact', head: true })
          .eq('post_id', p.id)
        return {
          id: p.id,
          kairos_id: p.kairos_id,
          tab: p.tab,
          body: p.body,
          created_at: p.created_at,
          touch_count: count ?? 0,
        }
      })
    )

    return NextResponse.json({ posts: withCounts })
  } catch (e: any) {
    console.error('[wall/mine.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const postId = searchParams.get('post_id')
    const kairosId = searchParams.get('kairos_id') // contrat ShareSheet : retrait par kairos
    if (!postId && !kairosId) return NextResponse.json({ error: 'post_id or kairos_id required' }, { status: 400 })

    const wall = wallClient()
    let query = wall
      .from('posts')
      .update({ status: 'removed' })
      .eq('user_id', userId) // ne retire que MES posts
      .eq('status', 'published')
    query = postId ? query.eq('id', postId) : query.eq('kairos_id', kairosId!)
    const { data: updated, error } = await query.select('id').maybeSingle()
    if (error) throw error
    if (!updated) return NextResponse.json({ error: 'post not found' }, { status: 404 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[wall/mine.DELETE] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
