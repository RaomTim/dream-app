import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// GET — Liste des rêves (avec pagination, filtré par user)
// 🔒 2026-04-20 FIX BRECHE : userId OBLIGATOIRE, jamais de dump global
// 🔒 2026-04-20 TIER 2 (session verification)
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    const query = supabase
      .from('dreams')
      .select('id, title, raw_text, mood, tags, entities, patterns, prophetic_suspect, entry_type, created_at, updated_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const searchQuery = search
      ? query.or(`title.ilike.%${search}%,raw_text.ilike.%${search}%`)
      : query

    const { data, error, count } = await searchQuery

    if (error) throw error

    return NextResponse.json({ dreams: data, total: count })
  } catch (error: any) {
    console.error('Dreams list error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — Créer un nouveau rêve
// 🔒 2026-04-20 FIX BRECHE : user_id OBLIGATOIRE, jamais de default alpha-tester-1
// 🔒 2026-04-20 TIER 2 (session verification)
// 🟡 2026-04-25 LEGACY : POST /api/kairos est le path V1.2 canonique. Cette route
//                       reste opérationnelle pour compat mais log un warning.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    console.warn('[dreams.POST] LEGACY path used — consider migrating client to POST /api/kairos', {
      via: auth.via,
      entry_type: body?.entry_type,
    })

    const supabase = createServerClient()

    const dream = {
      title: body.title || null,
      raw_text: body.raw_text,
      audio_url: body.audio_url || null,
      mood: body.mood || null,
      tags: body.tags || [],
      source: body.source || 'text',
      entry_type: body.entry_type || 'dream',
      oracle_data: body.oracle_data || null,
      dream_date: body.dream_date || new Date().toISOString().split('T')[0],
      user_id: userId,
    }

    if (!dream.raw_text) {
      return NextResponse.json({ error: 'Texte du rêve requis' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('dreams')
      .insert(dream)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ dream: data }, { status: 201 })
  } catch (error: any) {
    console.error('Dream create error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
