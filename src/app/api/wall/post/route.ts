import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { wallClient } from '@/lib/wall'

/**
 * POST /api/wall/post
 * Body : { kairos_id, tab }  (tab ∈ 'nuit' | 'jour')
 *
 * Dépose un kairos sur le Mur, ANONYMEMENT (SPEC §5 · P1).
 * `body` = SNAPSHOT du texte du kairos (raw_text) au moment du partage.
 *
 * CONTRAT PARTAGÉ : la sheet « Partager » (autre agent) appelle exactement
 * POST /api/wall/post { kairos_id, tab }. Ne pas changer cette signature.
 *
 * Idempotent : re-déposer un kairos déjà publié renvoie le post existant
 * (un seul post « publié » par kairos — cf. index posts_one_live_per_kairos).
 *
 * Yeshua (Opus), 2026-07-11.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = body?.kairos_id
    const rawTab = body?.tab
    if (!kairosId || typeof kairosId !== 'string') {
      return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })
    }
    if (rawTab !== 'nuit' && rawTab !== 'jour') {
      return NextResponse.json({ error: "tab must be 'nuit' or 'jour'" }, { status: 400 })
    }
    const tab: 'nuit' | 'jour' = rawTab

    // 1️⃣ Propriété du kairos + récupération du texte à figer (snapshot)
    const svc = createServerClient()
    const { data: kairos, error: kErr } = await svc
      .from('kairos')
      .select('id, raw_text')
      .eq('id', kairosId)
      .eq('user_id', userId)
      .maybeSingle()
    if (kErr) throw kErr
    if (!kairos) return NextResponse.json({ error: 'Kairos not yours' }, { status: 403 })

    const snapshot = (kairos.raw_text || '').trim().slice(0, 8000)
    if (snapshot.length < 3) {
      return NextResponse.json({ error: 'kairos has no text to share' }, { status: 400 })
    }

    const wall = wallClient()

    // 2️⃣ Idempotence : un post « publié » existe déjà pour ce kairos ?
    const { data: existing } = await wall
      .from('posts')
      .select('id, created_at')
      .eq('user_id', userId)
      .eq('kairos_id', kairosId)
      .eq('status', 'published')
      .maybeSingle()
    if (existing) {
      return NextResponse.json({ ok: true, post: { id: existing.id, created_at: existing.created_at }, already: true })
    }

    // 3️⃣ Dépôt
    const { data: created, error: insErr } = await wall
      .from('posts')
      .insert({ kairos_id: kairosId, user_id: userId, tab, body: snapshot, status: 'published' })
      .select('id, created_at')
      .single()
    if (insErr) {
      // Course avec l'index partiel unique → récupérer le post existant
      if (String(insErr.message || '').toLowerCase().includes('duplicate')) {
        const { data: race } = await wall
          .from('posts')
          .select('id, created_at')
          .eq('user_id', userId)
          .eq('kairos_id', kairosId)
          .eq('status', 'published')
          .maybeSingle()
        if (race) return NextResponse.json({ ok: true, post: race, already: true })
      }
      throw insErr
    }

    return NextResponse.json({ ok: true, post: created }, { status: 201 })
  } catch (e: any) {
    console.error('[wall/post.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
