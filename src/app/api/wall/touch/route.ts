import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { wallClient } from '@/lib/wall'

/**
 * POST /api/wall/touch
 * Body : { post_id }
 *
 * « Ça me touche » — bascule (toggle) sur un dépôt du Mur (SPEC §5 · M2).
 * Réponse : { touched: boolean }.
 *
 * RÈGLE D'OR : le COMPTE de touches n'est renvoyé QUE si le demandeur est
 * l'auteur du post (sa « douce trace privée »). Pour tous les autres, aucun
 * chiffre — jamais de +1 public, jamais d'identité.
 *
 * Yeshua (Opus), 2026-07-11.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const postId = body?.post_id
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'post_id required' }, { status: 400 })
    }

    const wall = wallClient()

    // Le post existe et est publié ? (on lit user_id UNIQUEMENT côté serveur)
    const { data: post, error: pErr } = await wall
      .from('posts')
      .select('id, user_id, status')
      .eq('id', postId)
      .maybeSingle()
    if (pErr) throw pErr
    if (!post || post.status !== 'published') {
      return NextResponse.json({ error: 'post not found' }, { status: 404 })
    }

    const isAuthor = post.user_id === userId

    // Toggle
    const { data: existing } = await wall
      .from('touches')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .maybeSingle()

    let touched: boolean
    if (existing) {
      await wall.from('touches').delete().eq('id', existing.id)
      touched = false
    } else {
      const { error: insErr } = await wall
        .from('touches')
        .insert({ post_id: postId, user_id: userId })
      // tolérer la course (unique post_id+user_id)
      if (insErr && !String(insErr.message || '').toLowerCase().includes('duplicate')) throw insErr
      touched = true
    }

    // Compte : seulement pour l'auteur (jamais exposé aux autres)
    const res: { ok: true; touched: boolean; count?: number } = { ok: true, touched }
    if (isAuthor) {
      const { count } = await wall
        .from('touches')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId)
      res.count = count ?? 0
    }

    return NextResponse.json(res)
  } catch (e: any) {
    console.error('[wall/touch.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
