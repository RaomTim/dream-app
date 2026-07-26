import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

// GET — Sessions d'un cercle
// 🔒 2026-04-20 FIX BRECHE : userId OBLIGATOIRE + membership check
// 🔒 2026-04-20 TIER 2 (session verification)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const circleId = params.id

    const { data: member } = await supabase
      .from('circle_members')
      .select('id')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!member) {
      return NextResponse.json({ error: 'Not a member of this circle' }, { status: 403 })
    }

    const { data, error } = await supabase
      .from('circle_sessions')
      .select('*')
      .eq('circle_id', circleId)
      .order('started_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return NextResponse.json({ sessions: data })
  } catch (error: any) {
    console.error('Circle sessions error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST — Démarrer une session de cercle
// 🔒 2026-04-20 TIER 2 (session verification)
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
    const circleId = params.id
    const { focusDreamId } = body

    // Vérifier que l'user est gardien ou membre
    const { data: member } = await supabase
      .from('circle_members')
      .select('role')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .maybeSingle()

    if (!member) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    // Phases : listening → resonance → action
    const { data: session, error } = await supabase
      .from('circle_sessions')
      .insert({
        circle_id: circleId,
        started_by: userId,
        phase: 'listening',
        focus_dream_id: focusDreamId || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ session }, { status: 201 })
  } catch (error: any) {
    console.error('Circle session create error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
