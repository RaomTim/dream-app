import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/user/annotate
 * Body: { kairos_id, annotation_text, marker_position? }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.kairos_id || !body.annotation_text) {
      return NextResponse.json({ error: 'kairos_id + annotation_text required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Verify kairos ownership
    const ownership = await supabase
      .from('kairos').select('id').eq('id', body.kairos_id).eq('user_id', userId).maybeSingle()
    if (!ownership.data) return NextResponse.json({ error: 'Kairos not yours' }, { status: 403 })

    const { data, error } = await supabase
      .from('kairos_user_annotations')
      .insert({
        user_id: userId,
        kairos_id: body.kairos_id,
        annotation_text: body.annotation_text,
        marker_position: body.marker_position ?? null,
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ annotation: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const { searchParams } = new URL(req.url)
    const kairosId = searchParams.get('kairos_id')
    if (!kairosId) return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos_user_annotations')
      .select('id, annotation_text, marker_position, created_at')
      .eq('kairos_id', kairosId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return NextResponse.json({ annotations: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
