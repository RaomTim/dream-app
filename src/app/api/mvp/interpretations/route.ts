import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { uploadAudioAttachment, signAttachment } from '@/lib/kairos-attachments'

/**
 * /api/mvp/interpretations — l'interprétation Dream GARDÉE (DREAM-MVP-SPEC-ECRANS-A-Z §C1bis).
 *
 * L'interprétation générée par /api/mvp/interpret (streamée) ne vivait que dans le
 * state React. Ici on la fige quand le rêveur la garde (« Ça me parle » = garde auto,
 * ou signet « Garder »). La table `kairos_interpretations` est owner-only (RLS) ;
 * cette route passe par le service role (bypass) et vérifie l'ownership du kairos.
 *
 * GET  ?kairos_id=…  → liste des interprétations gardées d'un rêve (avec URL audio signée). Pour J3.
 * POST { kairos_id, body, status?, resonance_note?, resonance_audio?(b64), resonance_audio_mime?, corrections? }
 *       → crée une interprétation gardée. Renvoie { interpretation }.
 *
 * L'apprentissage (extraction de symboles → user_meaning_layer) est déclenché
 * séparément par le client via /api/mvp/learn-deep, avec la source adéquate.
 *
 * Yeshua (Opus), 2026-07-11.
 */
export const maxDuration = 30

export async function OPTIONS() { return corsOptions() }

async function shape(supabase: any, row: any) {
  if (!row) return row
  const audio_url = row.resonance_audio_path ? await signAttachment(supabase, row.resonance_audio_path) : null
  return { ...row, audio_url }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = new URL(req.url).searchParams.get('kairos_id')
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos_interpretations')
      .select('id, kairos_id, body, status, resonance_note, resonance_audio_path, corrections, created_at, kept_at')
      .eq('kairos_id', kairosId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))

    const interpretations = await Promise.all((data || []).map(r => shape(supabase, r)))
    return corsify(NextResponse.json({ interpretations }))
  } catch (e: any) {
    console.error('[mvp.interpretations.GET]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    const text = typeof body.body === 'string' ? body.body.trim() : ''
    if (!kairosId || text.length < 2) {
      return corsify(NextResponse.json({ error: 'kairos_id et body requis' }, { status: 400 }))
    }
    const status = body.status === 'proposed' ? 'proposed' : 'kept'

    const supabase = createServerClient()

    // Ownership du kairos (le service role bypass RLS → on vérifie à la main)
    const { data: k } = await supabase.from('kairos').select('id').eq('id', kairosId).eq('user_id', userId).single()
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    // Audio de la note de résonance (best-effort — jamais bloquant)
    let audioPath: string | null = null
    if (typeof body.resonance_audio === 'string' && body.resonance_audio.length > 32) {
      audioPath = await uploadAudioAttachment(supabase, userId, body.resonance_audio, body.resonance_audio_mime || 'audio/webm')
    }

    const corrections = Array.isArray(body.corrections) ? body.corrections.slice(0, 50) : []
    const resonanceNote = typeof body.resonance_note === 'string' ? body.resonance_note.trim().slice(0, 1200) || null : null

    const { data: row, error } = await supabase
      .from('kairos_interpretations')
      .insert({
        kairos_id: kairosId,
        user_id: userId,
        body: text.slice(0, 6000),
        status,
        resonance_note: resonanceNote,
        resonance_audio_path: audioPath,
        corrections,
        kept_at: status === 'kept' ? new Date().toISOString() : null,
      })
      .select('id, kairos_id, body, status, resonance_note, resonance_audio_path, corrections, created_at, kept_at')
      .single()
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))

    return corsify(NextResponse.json({ interpretation: await shape(supabase, row) }))
  } catch (e: any) {
    console.error('[mvp.interpretations.POST]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
