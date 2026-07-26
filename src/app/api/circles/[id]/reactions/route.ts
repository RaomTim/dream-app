import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-04-25 — Yeshua
 * Réactions sobres sur une restitution polyphonique de cercle.
 * 3 valeurs autorisées : 'resonates' | 'unfamiliar' | 'question'.
 *
 * Pattern : pas de likes, pas de commentaires libres. Juste 3 gestes
 * de tenir/poser/questionner — pour préserver la sobriété du cercle.
 *
 * Table : circle_restitution_reactions (PK = restitution_id + user_id + reaction_type)
 *  → idempotent : appel répété d'un même geste ne crée pas de doublon.
 *  → DELETE pour retirer un geste posé.
 */

const VALID_REACTIONS = new Set(['resonates', 'unfamiliar', 'question'])

// POST /api/circles/[id]/reactions
// Body : { restitution_id: uuid, reaction_type: 'resonates'|'unfamiliar'|'question' }
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { restitution_id, reaction_type } = body || {}
    if (!restitution_id) {
      return NextResponse.json({ error: 'restitution_id required' }, { status: 400 })
    }
    if (!reaction_type || !VALID_REACTIONS.has(reaction_type)) {
      return NextResponse.json(
        { error: "reaction_type must be one of 'resonates', 'unfamiliar', 'question'" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Vérifier membership ET que la restitution appartient bien à ce cercle
    const [member, restit] = await Promise.all([
      supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', params.id)
        .eq('user_id', userId)
        .is('left_at', null)
        .maybeSingle(),
      supabase
        .from('circle_restitutions')
        .select('id, circle_id')
        .eq('id', restitution_id)
        .maybeSingle(),
    ])

    if (!member.data) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }
    if (!restit.data || restit.data.circle_id !== params.id) {
      return NextResponse.json({ error: 'Restitution not found in this circle' }, { status: 404 })
    }

    // Upsert idempotent (PK = restitution_id + user_id + reaction_type)
    const { error: upsertErr } = await supabase
      .from('circle_restitution_reactions')
      .upsert(
        { restitution_id, user_id: userId, reaction_type },
        { onConflict: 'restitution_id,user_id,reaction_type' }
      )

    if (upsertErr) {
      // Tolérer "duplicate" silencieusement (idempotence)
      if (!String(upsertErr.message || '').toLowerCase().includes('duplicate')) {
        throw upsertErr
      }
    }

    return NextResponse.json({ ok: true, reaction_type, restitution_id })
  } catch (e: any) {
    console.error('Circle reaction POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// DELETE /api/circles/[id]/reactions?restitution_id=...&reaction_type=...
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const restitution_id = searchParams.get('restitution_id')
    const reaction_type = searchParams.get('reaction_type')

    if (!restitution_id || !reaction_type) {
      return NextResponse.json(
        { error: 'restitution_id and reaction_type required' },
        { status: 400 }
      )
    }
    if (!VALID_REACTIONS.has(reaction_type)) {
      return NextResponse.json({ error: 'invalid reaction_type' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Membership check
    const { data: member } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', params.id)
      .eq('user_id', userId)
      .is('left_at', null)
      .maybeSingle()
    if (!member) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const { error } = await supabase
      .from('circle_restitution_reactions')
      .delete()
      .eq('restitution_id', restitution_id)
      .eq('user_id', userId)
      .eq('reaction_type', reaction_type)

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('Circle reaction DELETE error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// GET /api/circles/[id]/reactions?restitution_id=...
// Returns aggregated counts per reaction_type + user's own reactions
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const restitution_id = searchParams.get('restitution_id')
    if (!restitution_id) {
      return NextResponse.json({ error: 'restitution_id required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Membership check
    const { data: member } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', params.id)
      .eq('user_id', userId)
      .is('left_at', null)
      .maybeSingle()
    if (!member) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const { data: rows, error } = await supabase
      .from('circle_restitution_reactions')
      .select('reaction_type, user_id')
      .eq('restitution_id', restitution_id)
    if (error) throw error

    const counts: Record<string, number> = { resonates: 0, unfamiliar: 0, question: 0 }
    const mine: Record<string, boolean> = { resonates: false, unfamiliar: false, question: false }
    for (const r of rows || []) {
      if (counts[r.reaction_type] !== undefined) counts[r.reaction_type]++
      if (r.user_id === userId) mine[r.reaction_type] = true
    }

    return NextResponse.json({ counts, mine, total: (rows || []).length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
