import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// 🔒 2026-04-20 FIX BRECHE PRIVÉE — Tier 1 (ownership check)
// 🔒 2026-04-20 TIER 2 (session verification)
// Toutes les opérations sur /api/dreams/[id] exigent un user vérifié ET vérifient ownership.
// Sans token/userId → 401. Si le rêve n'appartient pas à userId → 404 (pas 403 : pas de leak d'existence).
// Le legacy userId query-param est encore accepté via requireAuth() le temps que les clients migrent.

// GET — Un rêve spécifique avec ses conversations
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Double filtre id + user_id — le rêve n'est retourné que si l'user en est propriétaire
    const { data: dream, error: dreamErr } = await supabase
      .from('dreams')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (dreamErr) throw dreamErr
    if (!dream) {
      // 404 plutôt que 403 pour ne pas leak l'existence d'un rêve appartenant à un autre user
      return NextResponse.json({ error: 'Dream not found' }, { status: 404 })
    }

    const { data: conversations } = await supabase
      .from('conversations')
      .select('*')
      .eq('dream_id', params.id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      dream,
      conversations: conversations || [],
    })
  } catch (error: any) {
    console.error('Dream get error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH — Mettre à jour un rêve
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }

    // Champs modifiables (user_id JAMAIS modifiable via PATCH)
    const allowed = [
      'title', 'raw_text', 'mood', 'tags', 'entities', 'patterns',
      'prophetic_suspect', 'notes', 'numinosity', 'soul_wish',
      'somatic_location', 'double_dream', 'framework_level',
      'archetypal_process', 'figure_types', 'body_symbolism', 'prophetic_status',
    ]
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    // 🔒 Double filtre id + user_id — l'update ne passe QUE si ownership confirmé
    const { data, error } = await supabase
      .from('dreams')
      .update(updates)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Dream not found' }, { status: 404 })
    }

    return NextResponse.json({ dream: data })
  } catch (error: any) {
    console.error('Dream update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE — Supprimer un rêve
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Vérifier ownership AVANT de toucher conversations/dream
    const { data: dream } = await supabase
      .from('dreams')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (!dream) {
      return NextResponse.json({ error: 'Dream not found' }, { status: 404 })
    }

    // Supprimer conversations associées d'abord
    await supabase.from('conversations').delete().eq('dream_id', params.id)

    // Double filtre id + user_id au delete
    const { error } = await supabase
      .from('dreams')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Dream delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
