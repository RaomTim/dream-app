import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/session-events
 *
 * GET  → liste les sessions lucides récentes (last 90d)
 * POST → log une session lucide complète (induction → réveil)
 *
 * Body POST :
 *   {
 *     session_started_at?: ISO,
 *     session_ended_at?: ISO,
 *     duration_minutes?: int,
 *     technique?: 'mild' | 'wbtb_mild' | 'ssild' | 'wild' | 'fild' | 'spontane' | 'autre',
 *     resulted_kairos_id?: uuid,
 *     wbtb_event_id?: uuid,
 *     mild_session_id?: uuid,
 *     awareness_level?: 'present' | 'flux' | 'dialogue' | 'observation' | 'piloted' | 'lost',
 *     notes?: string
 *   }
 *
 * NOTE anti-gamification : awareness_level est NARRATIF, pas un score 0-5.
 * Cohérent 1_LUCID_BIBLE §4.6 + 3_LUCID_TECHNICAL §10 glossaire.
 *
 * Auteur : Yeshua, 2026-04-28.
 */

const VALID_TECHNIQUE = ['mild', 'wbtb_mild', 'ssild', 'wild', 'fild', 'spontane', 'autre', 'non_pratique']
const VALID_AWARENESS = ['present', 'flux', 'dialogue', 'observation', 'piloted', 'lost']

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const since = new Date(Date.now() - 90 * 86400000).toISOString()

    const { data, error } = await supabase
      .from('lucid_session_events')
      .select('*')
      .eq('user_id', userId)
      .gte('session_started_at', since)
      .order('session_started_at', { ascending: false })
      .limit(100)

    if (error) throw error
    return NextResponse.json({ sessions: data || [] })
  } catch (e: any) {
    console.error('[lucid.session-events.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const technique = VALID_TECHNIQUE.includes(body.technique) ? body.technique : null
    const awareness_level = VALID_AWARENESS.includes(body.awareness_level)
      ? body.awareness_level
      : null

    const row: any = {
      user_id: userId,
      session_started_at: body.session_started_at || new Date().toISOString(),
      session_ended_at: body.session_ended_at || null,
      duration_minutes:
        Number.isFinite(body.duration_minutes)
          ? Math.max(0, Math.min(720, Math.round(body.duration_minutes)))
          : null,
      technique,
      resulted_kairos_id: body.resulted_kairos_id || null,
      wbtb_event_id: body.wbtb_event_id || null,
      mild_session_id: body.mild_session_id || null,
      awareness_level,
      notes: typeof body.notes === 'string' ? body.notes.slice(0, 2000) : null,
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('lucid_session_events')
      .insert(row)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ session: data }, { status: 201 })
  } catch (e: any) {
    console.error('[lucid.session-events.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
