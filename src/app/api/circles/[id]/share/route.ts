import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// GET — Récupérer les partages d'un cercle (optionnel: filtrer par session)
// 🔒 2026-04-20 FIX BRECHE : userId OBLIGATOIRE + membership check
// 🔒 2026-04-20 TIER 2 (session verification)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const circleId = params.id
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('sessionId')

    // 🔒 Vérifier membership AVANT de servir les shares
    const { data: member } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!member) {
      return NextResponse.json({ error: 'Not a member of this circle' }, { status: 403 })
    }

    let query = supabase
      .from('circle_shares')
      .select('*')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false })

    if (sessionId) {
      query = query.eq('session_id', sessionId)
    }

    const { data, error } = await query.limit(50)
    if (error) throw error

    // 2026-07-11 — FIX partage cassé (SPEC §12bis) : la ShareSheet écrit dans
    // `kairos_circle_shared` (POST /api/kairos/[id]/circle-share), pas dans `circle_shares`.
    // Le feed doit voir LES DEUX. On fusionne ici en lecture (source unique de vérité pour
    // le retrait = kairos_circle_shared, donc « retirer » se reflète tout seul dans le feed).
    // Pas de fusion quand on filtre par session (les partages kaïros n'ont pas de session).
    let merged: any[] = data || []
    if (!sessionId) {
      const { data: kShares } = await supabase
        .from('kairos_circle_shared')
        .select('kairos_id, user_id, pseudonym, shared_at')
        .eq('circle_id', circleId)
        .order('shared_at', { ascending: false })
        .limit(50)

      if (kShares && kShares.length > 0) {
        const kairosIds = kShares.map((s: any) => s.kairos_id)
        const { data: kairosRows } = await supabase
          .from('kairos')
          .select('id, raw_text, title, kairos_type')
          .in('id', kairosIds)
        const byId: Record<string, any> = {}
        for (const k of kairosRows || []) byId[k.id] = k

        const kairosShares = kShares
          .map((s: any) => {
            const k = byId[s.kairos_id]
            if (!k) return null // kairos supprimé → ne pas afficher (cohérent avec le retrait)
            const isDay = k.kairos_type === 'note_jour'
            return {
              id: `kcs:${s.kairos_id}:${s.circle_id}`,
              circle_id: circleId,
              user_id: s.user_id,
              share_type: isDay ? 'moment' : 'dream',
              content: k.raw_text || k.title || '',
              dream_id: null,
              session_id: null,
              created_at: s.shared_at,
              author_name: s.pseudonym || null,
              kairos_id: s.kairos_id,
            }
          })
          .filter(Boolean)

        merged = [...merged, ...(kairosShares as any[])]
        merged.sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
        merged = merged.slice(0, 50)
      }
    }

    return NextResponse.json({ shares: merged })
  } catch (error: any) {
    console.error('Circle shares error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — Partager un rêve ou écrire un miroir ("si c'était mon rêve")
// 🔒 2026-04-20 TIER 2 (session verification)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const circleId = params.id
    const { dreamId, sessionId, shareType, content } = body

    // Vérifier que l'user est bien membre
    const { data: member } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!member) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    // shareType: 'dream' (partager un rêve) ou 'mirror' (si c'était mon rêve) ou 'resonance' (ça résonne)
    const validTypes = ['dream', 'mirror', 'resonance']
    const type = validTypes.includes(shareType) ? shareType : 'dream'

    const share: any = {
      circle_id: circleId,
      user_id: userId,
      share_type: type,
      content: content || null,
    }

    if (dreamId) share.dream_id = dreamId
    if (sessionId) share.session_id = sessionId

    const { data, error } = await supabase
      .from('circle_shares')
      .insert(share)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ share: data }, { status: 201 })
  } catch (error: any) {
    console.error('Circle share error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
