import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/user/validate
 * Body: { context_type, context_id, validation, proposition_voix?, user_note? }
 *
 * validation ∈ ['aha','maybe','no','skip']
 *
 * Source : 3_TECHNICAL.md §39 — micro-questions AHA post-synthèse.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.context_type || !body.validation) {
      return NextResponse.json({ error: 'context_type + validation required' }, { status: 400 })
    }
    if (!['aha', 'maybe', 'no', 'skip'].includes(body.validation)) {
      return NextResponse.json({ error: 'invalid validation' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_validations')
      .insert({
        user_id: userId,
        context_type: body.context_type,
        context_id: body.context_id || null,
        validation: body.validation,
        proposition_voix: body.proposition_voix || null,
        user_note: body.user_note || null,
      })
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ validation: data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
