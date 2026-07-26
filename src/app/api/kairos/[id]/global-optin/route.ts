import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/kairos/[id]/global-optin
 * Body: { share_for_meteo?, share_for_polyphonie?, share_for_annales? }
 *
 * Anima Mundi opt-in granulaire (3 niveaux séparés).
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

    const supabase = createServerClient()

    // Verify ownership
    const kairosCheck = await supabase
      .from('kairos').select('id').eq('id', params.id).eq('user_id', userId).maybeSingle()
    if (!kairosCheck.data) return NextResponse.json({ error: 'Kairos not yours' }, { status: 403 })

    const row = {
      kairos_id: params.id,
      user_id: userId,
      share_for_meteo: body.share_for_meteo === true,
      share_for_polyphonie: body.share_for_polyphonie === true,
      share_for_annales: body.share_for_annales === true,
    }

    // Upsert (kairos_id is PK)
    const { error } = await supabase
      .from('kairos_global_optin')
      .upsert(row, { onConflict: 'kairos_id' })

    if (error) throw error
    return NextResponse.json({ ok: true, optin: row })
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

    const supabase = createServerClient()
    const { error } = await supabase
      .from('kairos_global_optin')
      .delete()
      .eq('kairos_id', params.id)
      .eq('user_id', userId)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
