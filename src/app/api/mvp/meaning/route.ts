import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * POST /api/mvp/meaning — « l'eau, pour toi, c'est quoi ? »
 * Le rêveur donne SON sens à un symbole → user_meaning_layer (le moat, Kaplan/Delaney).
 * Body: { symbol, meaning } · GET ?symbol= → le sens existant.
 * Yeshua, 2026-06-11 (Vague A V3).
 */
export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const symbol = typeof body.symbol === 'string' ? body.symbol.trim().slice(0, 120) : ''
    const meaning = typeof body.meaning === 'string' ? body.meaning.trim().slice(0, 600) : ''
    if (!symbol || meaning.length < 2) return corsify(NextResponse.json({ error: 'symbol et meaning requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { error } = await supabase.from('user_meaning_layer').upsert(
      { user_id: userId, symbol_concept: symbol, user_meaning: meaning, weight: 0.6, source: 'user_direct', updated_at: new Date().toISOString() },
      { onConflict: 'user_id,symbol_concept' }
    )
    if (error) {
      // fallback : l'index unique est sur lower(symbol_concept) (expression) — upsert manuel
      const { data: existing } = await supabase.from('user_meaning_layer').select('id').eq('user_id', userId).ilike('symbol_concept', symbol).maybeSingle()
      if (existing) await supabase.from('user_meaning_layer').update({ user_meaning: meaning, weight: 0.6, updated_at: new Date().toISOString() }).eq('id', existing.id)
      else {
        const { error: e2 } = await supabase.from('user_meaning_layer').insert({ user_id: userId, symbol_concept: symbol, user_meaning: meaning, weight: 0.6, source: 'user_direct' })
        if (e2) return corsify(NextResponse.json({ error: e2.message }, { status: 500 }))
      }
    }
    return corsify(NextResponse.json({ ok: true }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const symbol = new URL(req.url).searchParams.get('symbol') || ''
    if (!symbol) return corsify(NextResponse.json({ error: 'symbol requis' }, { status: 400 }))
    const supabase = createServerClient()
    const { data } = await supabase.from('user_meaning_layer').select('user_meaning, weight').eq('user_id', userId).ilike('symbol_concept', symbol).maybeSingle()
    return corsify(NextResponse.json({ meaning: data?.user_meaning || null, weight: data?.weight ?? null }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
