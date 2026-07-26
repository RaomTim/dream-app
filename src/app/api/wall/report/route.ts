import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { wallClient } from '@/lib/wall'

/**
 * POST /api/wall/report
 * Body : { post_id, reason? }
 *
 * Signaler un dépôt du Mur (drapeau, appui long — SPEC §5 · M2).
 * Alimente la file de modération (lue par le service_role uniquement).
 * Réponse volontairement neutre : jamais de compteur, jamais d'identité.
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
    const reason =
      typeof body?.reason === 'string' && body.reason.trim() ? body.reason.trim().slice(0, 500) : null

    const wall = wallClient()

    // Le post existe ?
    const { data: post, error: pErr } = await wall
      .from('posts')
      .select('id')
      .eq('id', postId)
      .maybeSingle()
    if (pErr) throw pErr
    if (!post) return NextResponse.json({ error: 'post not found' }, { status: 404 })

    const { error: insErr } = await wall
      .from('reports')
      .insert({ post_id: postId, user_id: userId, reason, status: 'open' })
    if (insErr) throw insErr

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[wall/report.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
