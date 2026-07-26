import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/dream-signs
 *
 * GET  → list all dream signs (auto + manual), sorted by occurrences DESC
 * POST → add manual dream sign { sign_label, sign_category? }
 *
 * Auteur : Yeshua, 2026-04-26.
 */

const VALID_CATEGORIES = ['character', 'location', 'object', 'action', 'emotion']

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('lucid_dream_signs')
      .select(
        'id, sign_label, sign_category, occurrences_count, last_occurred_at, triggered_lucidity_count, detection_source, user_validated, is_personal_sign, created_at'
      )
      .eq('user_id', userId)
      .order('occurrences_count', { ascending: false })
      .limit(200)

    if (error) throw error
    return NextResponse.json({ dream_signs: data || [] })
  } catch (e: any) {
    console.error('[lucid.signs.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const sign_label = (body.sign_label || '').trim().toLowerCase()
    if (!sign_label || sign_label.length < 2) {
      return NextResponse.json({ error: 'sign_label required (min 2 chars)' }, { status: 400 })
    }
    const sign_category = VALID_CATEGORIES.includes(body.sign_category) ? body.sign_category : null

    const supabase = createServerClient()

    // Si déjà existe (même label + user) → renforcer
    const { data: existing } = await supabase
      .from('lucid_dream_signs')
      .select('id, occurrences_count')
      .eq('user_id', userId)
      .eq('sign_label', sign_label)
      .maybeSingle()

    if (existing) {
      const { data, error } = await supabase
        .from('lucid_dream_signs')
        .update({
          occurrences_count: (existing.occurrences_count || 0) + 1,
          last_occurred_at: new Date().toISOString(),
          user_validated: true,
        })
        .eq('id', existing.id)
        .select('*')
        .single()
      if (error) throw error
      return NextResponse.json({ dream_sign: data, reinforced: true })
    }

    const { data, error } = await supabase
      .from('lucid_dream_signs')
      .insert({
        user_id: userId,
        sign_label,
        sign_category,
        detection_source: 'user_manual',
        user_validated: true,
        occurrences_count: 1,
      })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ dream_sign: data }, { status: 201 })
  } catch (e: any) {
    console.error('[lucid.signs.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
