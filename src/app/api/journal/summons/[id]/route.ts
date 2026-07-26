import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * PATCH /api/journal/summons/[id]
 * Update AHA_CAPTURE feedback sur une polyphonie d'appel sagesse.
 * Bible §3.7 (couche d'apprentissage personnelle).
 */

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const allowed: Record<string, any> = {}
    if (typeof body.felt_shift_location === 'string' &&
      ['gorge', 'poitrine', 'ventre', 'nuque', 'ailleurs', 'aucune'].includes(body.felt_shift_location)) {
      allowed.felt_shift_location = body.felt_shift_location
    }
    if (typeof body.aha_level === 'string' &&
      ['fort', 'peut-etre', 'non'].includes(body.aha_level)) {
      allowed.aha_level = body.aha_level
    }
    if (typeof body.aha_note === 'string' && body.aha_note.trim()) {
      allowed.aha_note = body.aha_note.trim().slice(0, 1000)
    }
    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'No allowed fields' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos_wisdom_summons')
      .update(allowed)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'summon introuvable' }, { status: 404 })

    return NextResponse.json({ summon: data })
  } catch (e: any) {
    console.error('[journal/summons/id PATCH] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
