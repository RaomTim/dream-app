import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/feedback
 * QW1 — FeedbackButton omniprésent.
 * Insert dans dream_app_feedback. Bearer auth requis.
 *
 * Body :
 *   {
 *     context_type: string,        // 'screen' | 'feature' | 'oracle' | ...
 *     context_id?: string,         // 'JournalScreen' | 'kairos:<uuid>'
 *     feedback_text: string,
 *     severity?: 'low'|'medium'|'high',
 *     user_email?: string,
 *   }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const {
      context_type,
      context_id = null,
      feedback_text,
      severity = 'low',
      user_email = null,
    } = body || {}

    if (!context_type || typeof context_type !== 'string') {
      return NextResponse.json(
        { error: 'context_type requis' },
        { status: 400 }
      )
    }
    if (!feedback_text || typeof feedback_text !== 'string' || feedback_text.trim().length === 0) {
      return NextResponse.json(
        { error: 'feedback_text requis' },
        { status: 400 }
      )
    }
    if (!['low', 'medium', 'high'].includes(severity)) {
      return NextResponse.json(
        { error: "severity doit etre 'low' | 'medium' | 'high'" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    const userAgent = req.headers.get('user-agent') || null

    const { data, error } = await supabase
      .from('dream_app_feedback')
      .insert({
        user_id: userId,
        context_type,
        context_id,
        feedback_text: feedback_text.trim(),
        severity,
        user_email,
        user_agent: userAgent,
      })
      .select('id, severity, created_at')
      .single()

    if (error) throw error

    return NextResponse.json({ feedback: data }, { status: 201 })
  } catch (error: any) {
    console.error('[api/feedback] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
