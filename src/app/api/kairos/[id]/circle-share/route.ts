import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/[id]/circle-share
 * → liste des groupes où CE kairos a déjà été partagé par l'utilisateur courant.
 * Utilisé par la Sheet P1 (pré-cocher / éviter les doublons) et par la section
 * « Partagé dans… » de la fiche J3.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const { data: shares, error } = await supabase
      .from('kairos_circle_shared')
      .select('circle_id, pseudonym, created_at')
      .eq('kairos_id', params.id)
      .eq('user_id', userId)
    if (error) throw error

    let circles: { circle_id: string; name: string; pseudonym: string | null }[] = []
    if (shares && shares.length > 0) {
      const ids = shares.map((s: any) => s.circle_id)
      const { data: circleRows } = await supabase.from('circles').select('id, name').in('id', ids)
      circles = shares.map((s: any) => ({
        circle_id: s.circle_id,
        name: circleRows?.find((c: any) => c.id === s.circle_id)?.name || 'groupe',
        pseudonym: s.pseudonym ?? null,
      }))
    }
    return NextResponse.json({ circles })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * POST /api/kairos/[id]/circle-share
 * Body: { circle_id, pseudonym? }
 * → INSERT kairos_circle_shared (cleartext partage explicite identifiable)
 *
 * Distinct du opt-in agrégation : ici les autres membres VOIENT le rêve avec
 * l'auteur (ou pseudo).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const { circle_id, pseudonym } = body
    if (!circle_id) return NextResponse.json({ error: 'circle_id required' }, { status: 400 })

    const supabase = createServerClient()

    const [kairosCheck, memberCheck] = await Promise.all([
      supabase.from('kairos').select('id').eq('id', params.id).eq('user_id', userId).maybeSingle(),
      supabase.from('circle_members')
        .select('id, pseudonym').eq('circle_id', circle_id).eq('user_id', userId)
        .is('left_at', null).maybeSingle(),
    ])
    if (!kairosCheck.data) return NextResponse.json({ error: 'Kairos not yours' }, { status: 403 })
    if (!memberCheck.data) return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })

    const finalPseudo = pseudonym || (memberCheck.data as any).pseudonym || null

    const { error } = await supabase
      .from('kairos_circle_shared')
      .insert({ kairos_id: params.id, circle_id, user_id: userId, pseudonym: finalPseudo })

    if (error && !String(error.message || '').includes('duplicate')) {
      throw error
    }
    return NextResponse.json({ ok: true, shared: true, pseudonym: finalPseudo })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const { searchParams } = new URL(req.url)
    const circle_id = searchParams.get('circle_id')
    if (!circle_id) return NextResponse.json({ error: 'circle_id required' }, { status: 400 })

    const supabase = createServerClient()
    const { error } = await supabase
      .from('kairos_circle_shared')
      .delete()
      .eq('kairos_id', params.id)
      .eq('circle_id', circle_id)
      .eq('user_id', userId)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
