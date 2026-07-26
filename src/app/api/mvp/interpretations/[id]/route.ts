import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, CORS_HEADERS } from '@/lib/mvp-cors'
import { uploadAudioAttachment, signAttachment } from '@/lib/kairos-attachments'

/**
 * /api/mvp/interpretations/[id] — modifier / supprimer une interprétation gardée (§C1bis, fiche J3).
 *
 * PATCH { resonance_note?, resonance_audio?(b64), resonance_audio_mime?, status?, append_correction? }
 *        - append_correction = { user_correction, revised_body } → empilé dans corrections[] (avec `at`).
 *        - resonance_note / audio → modifier la note de résonance.
 *        - status → 'kept' | 'proposed' (retirer le signet = supprimer, via DELETE).
 * DELETE → supprime l'interprétation gardée (irréversible côté user).
 *
 * Owner-only : le service role bypass RLS → on vérifie user_id à la main.
 * Yeshua (Opus), 2026-07-11.
 */
export const maxDuration = 30

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS_HEADERS, 'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS' } })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const id = params.id
    if (!id) return corsify(NextResponse.json({ error: 'id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { data: existing } = await supabase
      .from('kairos_interpretations')
      .select('id, user_id, corrections, status')
      .eq('id', id)
      .single()
    if (!existing || existing.user_id !== userId) {
      return corsify(NextResponse.json({ error: 'introuvable' }, { status: 404 }))
    }

    const patch: Record<string, any> = {}

    if (typeof body.resonance_note === 'string') {
      patch.resonance_note = body.resonance_note.trim().slice(0, 1200) || null
    }
    if (typeof body.resonance_audio === 'string' && body.resonance_audio.length > 32) {
      const p = await uploadAudioAttachment(supabase, userId, body.resonance_audio, body.resonance_audio_mime || 'audio/webm')
      if (p) patch.resonance_audio_path = p
    }
    if (body.status === 'kept' || body.status === 'proposed') {
      patch.status = body.status
      if (body.status === 'kept') patch.kept_at = new Date().toISOString()
    }
    if (body.append_correction && typeof body.append_correction === 'object') {
      const uc = String(body.append_correction.user_correction || '').slice(0, 1500)
      const rb = String(body.append_correction.revised_body || '').slice(0, 6000)
      if (uc || rb) {
        const prev = Array.isArray(existing.corrections) ? existing.corrections : []
        patch.corrections = [...prev, { at: new Date().toISOString(), user_correction: uc, revised_body: rb }].slice(-50)
      }
    }

    if (!Object.keys(patch).length) {
      return corsify(NextResponse.json({ error: 'rien à modifier' }, { status: 400 }))
    }

    const { data: row, error } = await supabase
      .from('kairos_interpretations')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, kairos_id, body, status, resonance_note, resonance_audio_path, corrections, created_at, kept_at')
      .single()
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))

    const audio_url = row?.resonance_audio_path ? await signAttachment(supabase, row.resonance_audio_path) : null
    return corsify(NextResponse.json({ interpretation: { ...row, audio_url } }))
  } catch (e: any) {
    console.error('[mvp.interpretations.PATCH]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const id = params.id
    if (!id) return corsify(NextResponse.json({ error: 'id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { error } = await supabase
      .from('kairos_interpretations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))
    return corsify(NextResponse.json({ ok: true }))
  } catch (e: any) {
    console.error('[mvp.interpretations.DELETE]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
