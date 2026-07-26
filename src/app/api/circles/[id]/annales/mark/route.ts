/**
 * /api/circles/[id]/annales/mark — Marquer/dé-marquer un kairos comme "tale_marquant"
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (★ doux qui résonne pour le cercle)
 *
 * POST   { kairos_id }   → INSERT circle_kairos_marks (idempotent : ON CONFLICT DO NOTHING)
 * DELETE { kairos_id }   → DELETE circle_kairos_marks (de l'utilisateur courant)
 *
 * Garde-fous :
 *   - Le kairos doit être partagé clear (kairos_circle_shared) dans ce cercle
 *     → on ne peut pas marquer un dépôt qu'on n'a pas le droit de voir.
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

async function isShared(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  kairosId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('kairos_circle_shared')
    .select('kairos_id')
    .eq('circle_id', circleId)
    .eq('kairos_id', kairosId)
    .maybeSingle()
  return !!data
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : null
    if (!kairosId) {
      return NextResponse.json({ error: 'kairos_id requis' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }
    if (!(await isShared(supabase, params.id, kairosId))) {
      return NextResponse.json({ error: 'Kairos non partagé clair dans ce cercle' }, { status: 404 })
    }

    const { error } = await supabase
      .from('circle_kairos_marks')
      .insert({ circle_id: params.id, kairos_id: kairosId, user_id: userId })

    // On tolère duplicate (idempotent)
    if (error && !String(error.message || '').toLowerCase().includes('duplicate')) {
      throw error
    }

    return NextResponse.json({ ok: true, marked: true })
  } catch (e: any) {
    console.warn('[circle/annales/mark POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const kairosId = searchParams.get('kairos_id') || body.kairos_id
    if (!kairosId) {
      return NextResponse.json({ error: 'kairos_id requis' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { error } = await supabase
      .from('circle_kairos_marks')
      .delete()
      .eq('circle_id', params.id)
      .eq('kairos_id', kairosId)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true, marked: false })
  } catch (e: any) {
    console.warn('[circle/annales/mark DELETE] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
