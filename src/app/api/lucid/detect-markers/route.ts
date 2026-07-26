import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { detectLucidMarkers, shouldAutoTagLucid, shouldPromptLucidConfirmation } from '@/lib/lucid-detector'

/**
 * POST /api/lucid/detect-markers
 *
 * Détecte les marqueurs de lucidité dans un texte de rêve.
 *
 * Body :
 *   { kairos_id }                                   → lit raw_text de kairos
 *   { raw_text }                                    → analyse texte brut direct
 *   { kairos_id, persist: true }                    → upsert lucid_kairos_metadata
 *                                                       avec is_lucid=null (pending confirmation)
 *
 * Returns :
 *   {
 *     markers: LucidMarkers,
 *     should_auto_tag: boolean,
 *     should_prompt_user: boolean,
 *     persisted: boolean
 *   }
 *
 * Cohérent 3_LUCID_TECHNICAL §3.3 (Phase 3.5 pipeline) + §4.3 (action post-détection).
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export const maxDuration = 10

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    let text = (body.raw_text || '').toString()
    let kairosId: string | null = body.kairos_id || null

    const supabase = createServerClient()

    // Si kairos_id fourni, charger raw_text depuis DB
    if (kairosId && !text) {
      const { data: k } = await supabase
        .from('kairos')
        .select('id, raw_text, user_id')
        .eq('id', kairosId)
        .eq('user_id', userId)
        .maybeSingle()

      if (!k?.raw_text) {
        return NextResponse.json(
          { error: 'kairos not found or empty' },
          { status: 404 }
        )
      }
      text = k.raw_text
    }

    if (!text || text.length < 5) {
      return NextResponse.json(
        { error: 'raw_text or kairos_id required' },
        { status: 400 }
      )
    }

    // Run detection
    const markers = detectLucidMarkers(text)
    const should_auto_tag = shouldAutoTagLucid(markers)
    const should_prompt_user = shouldPromptLucidConfirmation(markers)

    // Persistence : seulement si kairos_id + (persist OR auto_tag)
    let persisted = false
    if (kairosId && (body.persist === true || should_auto_tag)) {
      // Vérifier que le kairos appartient bien à l'user
      const { data: k } = await supabase
        .from('kairos')
        .select('id')
        .eq('id', kairosId)
        .eq('user_id', userId)
        .maybeSingle()

      if (k) {
        const { data: existing } = await supabase
          .from('lucid_kairos_metadata')
          .select('id, is_lucid, user_confirmed')
          .eq('kairos_id', kairosId)
          .eq('user_id', userId)
          .maybeSingle()

        const row: any = {
          kairos_id: kairosId,
          user_id: userId,
          // is_lucid stays NULL = pending user confirmation (cohérent §4.3 brief)
          is_lucid: existing?.user_confirmed ? existing.is_lucid : null,
          recognition_category: markers.recognition_category,
          technique_used: markers.technique_detected,
          posture: markers.posture_detected,
          hypnagogic_entry: markers.hypnagogic_entry,
          sleep_paralysis_experienced: markers.sleep_paralysis_experienced,
          detection_confidence: markers.confidence,
          detection_signals: markers.signals,
          updated_at: new Date().toISOString(),
        }

        if (existing) {
          await supabase
            .from('lucid_kairos_metadata')
            .update(row)
            .eq('id', existing.id)
        } else {
          await supabase.from('lucid_kairos_metadata').insert(row)
        }
        persisted = true
      }
    }

    return NextResponse.json({
      markers,
      should_auto_tag,
      should_prompt_user,
      persisted,
    })
  } catch (e: any) {
    console.error('[lucid.detect-markers.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
