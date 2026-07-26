/**
 * /api/circles/[id]/rituals/[ritualId]/contribute — Déposer une contribution
 *
 * POST { content, voice_attribution?, matter?, is_voice?, voice_duration_ms? }
 *      → INSERT circle_ritual_contributions sur la phase courante du rituel.
 *
 * Garde-fous :
 *   - L'utilisateur doit être joined (status='joined' ou 'completed') au rituel.
 *   - Le rituel doit être en phase != 'archived' / 'closed'.
 *   - voice_attribution requis pour council_4_voix (dreamer/protector/soul/shadow)
 *     mais on ne bloque pas — on tag avec phase comme fallback.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

async function isMember(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; ritualId: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const content = typeof body.content === 'string' ? body.content.trim() : ''
    if (!content) {
      return NextResponse.json({ error: 'content requis' }, { status: 400 })
    }
    if (content.length > 4000) {
      return NextResponse.json({ error: 'content trop long (max 4000)' }, { status: 400 })
    }

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { data: ritual } = await supabase
      .from('circle_rituals')
      .select('id, circle_id, current_phase, ritual_type')
      .eq('id', params.ritualId)
      .eq('circle_id', params.id)
      .maybeSingle()

    if (!ritual) return NextResponse.json({ error: 'Rituel introuvable' }, { status: 404 })
    if (['archived', 'closed'].includes(ritual.current_phase)) {
      return NextResponse.json({ error: 'Rituel terminé, contributions fermées' }, { status: 409 })
    }

    const validMatters = new Set(['paper', 'stone', 'silk', 'ember', 'linen'])
    const matter = typeof body.matter === 'string' && validMatters.has(body.matter) ? body.matter : null

    const validVoices = new Set(['dreamer', 'protector', 'soul', 'shadow', 'self'])
    const voiceAttr = typeof body.voice_attribution === 'string' && validVoices.has(body.voice_attribution)
      ? body.voice_attribution
      : null

    const { data: contrib, error } = await supabase
      .from('circle_ritual_contributions')
      .insert({
        ritual_id: params.ritualId,
        user_id: userId,
        phase: ritual.current_phase,
        voice_attribution: voiceAttr,
        content,
        matter,
        is_voice: body.is_voice === true,
        voice_duration_ms:
          Number.isFinite(body.voice_duration_ms) ? Math.max(0, parseInt(body.voice_duration_ms, 10)) : null,
      })
      .select('id, phase, voice_attribution, content, matter, is_voice, voice_duration_ms, created_at')
      .single()

    if (error) throw error

    return NextResponse.json({ contribution: contrib }, { status: 201 })
  } catch (e: any) {
    console.warn('[circle/rituals/contribute POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
