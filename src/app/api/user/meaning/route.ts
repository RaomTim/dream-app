import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * Routes user_meaning_layer — couche apprentissage personnelle (chantier 7).
 *
 * GET    : list user meanings
 * POST   : declare new meaning
 * DELETE : ?id=  remove
 */

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_meaning_layer')
      .select('id, symbol_concept, user_meaning, weight, context_lang, source, created_at, updated_at')
      .eq('user_id', userId)
      .order('weight', { ascending: false })

    if (error) throw error
    return NextResponse.json({ meanings: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const symbol = (body.symbol_concept || '').toString().trim()
    const meaning = (body.user_meaning || '').toString().trim()
    if (!symbol || !meaning) {
      return NextResponse.json({ error: 'symbol_concept + user_meaning required' }, { status: 400 })
    }
    const weight = typeof body.weight === 'number' ? Math.max(0, Math.min(5, body.weight)) : 1.0
    const lang = body.context_lang || 'fr'
    const source = body.source || null

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_meaning_layer')
      .upsert(
        { user_id: userId, symbol_concept: symbol, user_meaning: meaning, weight, context_lang: lang, source },
        { onConflict: 'user_id,symbol_concept,context_lang' }
      )
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ meaning: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const supabase = createServerClient()
    const { error } = await supabase
      .from('user_meaning_layer')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
