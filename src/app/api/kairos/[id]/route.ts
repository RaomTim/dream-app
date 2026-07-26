import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/kairos/[id]
 * Récupère un kairos avec tous ses scalars + synthesis (si générée).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('kairos')
      .select(
        'id, user_id, title, kairos_type, capture_method, raw_text, raw_text_lang, created_at, updated_at, numinosity_score, numinosity_pending, affective_valence, affective_intensity, dominant_emotion, figures, motif_tags, somatic_markers, archetypal_tags, setting_metadata, narrative_dynamics, temporal_signature, sensorial_qualities, thresholds_passages, parole_silence, power_relations, paradoxes_unresolved, metaphors_extrapolated, dream_ask, root_dream_patterns, prophetic_status, soul_season_id, user_first_reading_submitted, user_marked_numinous, transcript_verified, synthesis_text, synthesis_tier, synthesis_voices, synthesis_generated_at, forest_sources, marked_great_at, great_dream_facets, great_dream_note'
      )
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Kairos not found' }, { status: 404 })

    return NextResponse.json({ kairos: data })
  } catch (e: any) {
    console.error('[kairos/id.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * PATCH /api/kairos/[id]
 * Permet d'update certains champs : user_marked_numinous, raw_text (avec re-trigger
 * pipeline), user_first_reading_submitted, prophetic_status.
 */
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

    const allowed: Record<string, any> = {}
    if (typeof body.user_marked_numinous === 'boolean') {
      allowed.user_marked_numinous = body.user_marked_numinous
      // Trigger numinosity re-calc
      allowed.numinosity_pending = true
    }
    if (typeof body.user_first_reading_submitted === 'boolean') {
      allowed.user_first_reading_submitted = body.user_first_reading_submitted
    }
    if (typeof body.prophetic_status === 'string' &&
      ['dormant', 'awakened', 'confirmed', 'declined'].includes(body.prophetic_status)) {
      allowed.prophetic_status = body.prophetic_status
    }
    // 2026-04-25 — kairos_type whitelist (UI Capture chips post-submit)
    if (typeof body.kairos_type === 'string' &&
      ['reve', 'signe', 'reverie', 'hypnagogie', 'synchronicite', 'frisson', 'note_jour'].includes(body.kairos_type)) {
      allowed.kairos_type = body.kairos_type
    }
    // raw_text update — re-trigger pipeline by setting numinosity_pending
    if (typeof body.raw_text === 'string' && body.raw_text.trim().length > 0) {
      allowed.raw_text = body.raw_text.trim()
      allowed.numinosity_pending = true
    }
    // 2026-07-22 — passe Q/R de vérification de transcription (§12ter.D)
    if (typeof body.transcript_verified === 'boolean') {
      allowed.transcript_verified = body.transcript_verified
    }

    // 2026-07-26 (A3) — LES GRANDS RÊVES (TAXONOMIE-GRANDS-REVES.md)
    // La marque elle-même reste `user_marked_numinous` ci-dessus : pas de second
    // booléen. Ici on n'ajoute que la nuance FACULTATIVE et les mots du rêveur.
    // `marked_great_at` n'est PAS whitelisté — c'est le trigger DB qui le pose
    // (trg_kairos_track_marked_great), sinon le client pourrait antidater sa
    // propre reconnaissance.
    const GREAT_DREAM_FACETS = ['change', 'force', 'ouvert']
    if (Array.isArray(body.great_dream_facets)) {
      allowed.great_dream_facets = Array.from(
        new Set(body.great_dream_facets.filter((f: any) => GREAT_DREAM_FACETS.includes(f)))
      )
    }
    if (typeof body.great_dream_note === 'string') {
      const n = body.great_dream_note.trim()
      allowed.great_dream_note = n.length > 0 ? n.slice(0, 600) : null
    }

    // 2026-04-26 — Protocole Accompagné (Bible §3.11 + Design §11.bis.13)
    // Whitelist fields pour protocoles guidés.
    const PROTOCOL_IDS = [
      'lightning_dreamwork', 'dream_tending', 'sidewalk_oracle',
      'reverie_tending', 'hypnagogic_recall', 'synchronicity_story',
      'focusing_felt_sense', 'fin_de_journee', 'pre_sommeil', 'reentry',
    ]
    if (typeof body.protocol_used === 'string' && PROTOCOL_IDS.includes(body.protocol_used)) {
      allowed.protocol_used = body.protocol_used
    }
    if (body.protocol_session_data && typeof body.protocol_session_data === 'object') {
      allowed.protocol_session_data = body.protocol_session_data
    }
    if (typeof body.protocol_completed_at === 'string') {
      allowed.protocol_completed_at = body.protocol_completed_at
    }
    if (typeof body.protocol_step_count === 'number' && body.protocol_step_count >= 0) {
      allowed.protocol_step_count = body.protocol_step_count
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json({ error: 'No allowed fields to update' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('kairos')
      .update(allowed)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Kairos not found' }, { status: 404 })

    return NextResponse.json({ kairos: data })
  } catch (e: any) {
    console.error('[kairos/id.PATCH] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * DELETE /api/kairos/[id]
 * Burn — suppression cryptographique (V1 : DELETE simple, V1.5 : crypto wipe + audit log).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Ownership d'abord — sinon 404 (pas de leak d'existence).
    const { data: owned } = await supabase
      .from('kairos')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()
    if (!owned) return NextResponse.json({ error: 'Kairos not found' }, { status: 404 })

    // SPEC §10 — retirer les partages cercle/Mur AVANT la suppression.
    // (kairos_circle_shared est aussi CASCADE côté DB, mais on le retire explicitement
    //  pour que le geste soit clair et immédiat côté feed de groupe.)
    await supabase.from('kairos_circle_shared').delete().eq('kairos_id', params.id).eq('user_id', userId)

    // Mur — soft delete défensif (schéma `wall` construit en parallèle : si absent, on n'échoue pas).
    try {
      const { wallClient } = await import('@/lib/wall')
      await wallClient()
        .from('posts')
        .update({ status: 'removed' })
        .eq('kairos_id', params.id)
        .eq('user_id', userId)
        .eq('status', 'published')
    } catch { /* Mur pas encore là — rien à retirer */ }

    // Suppression du kaïros (CASCADE : attachments, edges, interpretations, optins…).
    const { error } = await supabase
      .from('kairos')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId)

    if (error) throw error
    return NextResponse.json({ ok: true, burned: params.id })
  } catch (e: any) {
    console.error('[kairos/id.DELETE] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
