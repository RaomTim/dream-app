/**
 * Pipeline orchestrateur kairos — 8 phases.
 *
 * Source : 3_TECHNICAL.md §38 + CABLAGE-TECHNIQUE-PLAN-EXECUTION §3.
 *
 * Phases :
 *   1. Récupération kairos (raw_text, type)
 *   2. Whisper si voice (déjà fait côté frontend via /api/transcribe)
 *   3. Extraction Sonnet 16 dimensions (avec contexte user)
 *   4. Embeddings parallèles (4 vecteurs)
 *   5. Forest consultation (queryForestForMode)
 *   6. Numinosity scoring composite
 *   7. Pattern detection (8 RPCs → kairos_edges)
 *   8. Synthesis polyphonique 6 tiers
 *   9. Update kairos final + numinosity_pending = false
 *
 * Auteur: Yeshua, 2026-04-25 (chantier 1+2+3+4 intégrés).
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import { extractKairos16Dimensions, type KairosExtraction } from './extraction'
import {
  computeKairosEmbeddings,
  formatConceptsForEmbed,
  formatSomaticForEmbed,
  formatArchetypalForEmbed,
} from './embeddings'
import { computeNuminosityScore } from './numinosity'
import { normalizeWarningSignal, resolveCareCardEligibility } from './warning'
import { runPatternDetection } from './pattern-detection'
import { synthesizeKairos } from './synthesizer'
import { detectSynthesisTier } from '@/prompts/synthesis-tiers'
import { buildUserMeaningContext, countRootPatternMatches } from './user-context'
import { detectTextLayers, buildProjections } from './text-layers'
import { harvestMeaningsFromLecture, storeHarvestedMeanings } from './user-meaning-harvest'
import { queryForestForMode } from '@/lib/forest-retrieval'
import { asLang, type DreamLang } from '@/lib/req-lang'

export interface PipelineResult {
  ok: boolean
  kairos_id: string
  phases_completed: string[]
  errors: string[]
  numinosity_score?: number
  synthesis_tier?: string
  edges_count?: number
}

/**
 * `lang` = la langue du RÊVEUR au moment où il écrit (header X-Dream-Lang, relayé par
 * la route appelante). Elle ne pilote QUE les 3 champs vus à l'écran (title_poetic,
 * dream_ask, warning_signal.what_insists). Défaut 'fr' — c'est ce que reçoit le cron
 * enrich-batch, qui n'a pas de requête utilisateur et donc pas de header. Limite
 * assumée : un rêve rattrapé par le cron d'un rêveur anglophone aura un titre FR.
 */
export async function runKairosEnrichmentPipeline(opts: {
  supabaseService: SupabaseClient
  userId: string
  kairosId: string
  lang?: DreamLang
}): Promise<PipelineResult> {
  const { supabaseService, userId, kairosId } = opts
  const lang = asLang(opts.lang)
  const phases_completed: string[] = []
  const errors: string[] = []

  // Phase 1 : load kairos
  const { data: kairos, error: loadErr } = await supabaseService
    .from('kairos')
    .select('id, raw_text, kairos_type, user_id, user_first_reading_submitted, title')
    .eq('id', kairosId)
    .eq('user_id', userId)
    .maybeSingle()

  if (loadErr || !kairos || !kairos.raw_text) {
    return {
      ok: false,
      kairos_id: kairosId,
      phases_completed,
      errors: [`Phase 1 load failed: ${loadErr?.message || 'kairos not found'}`],
    }
  }
  phases_completed.push('1_load')

  const kairosType = kairos.kairos_type || 'reve'
  const rawText = kairos.raw_text as string

  // ───────────────────────────────────────────────────────────────────────────
  // Phase 2 : RÉCIT / LECTURE DU RÊVEUR / CADRE (B4, 2026-07-26)
  //
  // Le texte n'est PAS découpé : raw_text reste entier, intact, et c'est lui qui
  // s'affiche. On pose seulement une couche d'intervalles par-dessus.
  //
  // Ce qui en dépend, et POURQUOI (mesuré le 26/07 sur les 64 rêves du corpus,
  // table de travail `_b4_layer_embeddings` — RAPPORT-B4 §5) :
  //   · embedding sémantique  → recit_text = raw_text MOINS le seul « cadre »
  //       (date dite à voix haute, heure, état du micro, résidus de transcription).
  //       Marge de séparation vraie paire / bruit : +21 %. Hubness : −24 %.
  //   · la LECTURE DU RÊVEUR RESTE dans ce qu'on embedde. La retirer fait
  //       RETOMBER la séparation sous la référence (mesuré : −4 %) — A2 l'avait
  //       constaté sans pouvoir l'expliquer : ce qu'il perdait en « nettoyant les
  //       préambules », c'était précisément le cadrage psychique du rêveur.
  //   · l'extraction 16 dimensions continue de tourner sur le texte COMPLET.
  //       Règle : marquer un passage « lecture » ne retire JAMAIS ses images au
  //       rêve. « le loup, c'est ma colère » → le loup reste une figure du récit.
  //
  // Non bloquant : si la détection échoue, recitText retombe sur rawText et le
  // pipeline continue exactement comme avant.
  let recitText = rawText
  let lectureText = ''
  try {
    const det = await detectTextLayers({ rawText, lang })
    if (det.spans.length) {
      const proj = buildProjections(rawText, det.spans)
      recitText = proj.recit_text || rawText
      lectureText = proj.lecture_text || ''
      await supabaseService
        .from('kairos_text_layers')
        .delete()
        .eq('kairos_id', kairosId)
        .eq('user_id', userId)
      await supabaseService.from('kairos_text_layers').insert(
        det.spans.map((s) => ({
          kairos_id: kairosId,
          user_id: userId,
          kind: s.kind,
          start_char: s.start,
          end_char: s.end,
          quote: rawText.slice(s.start, s.end),
          source: s.source,
          confidence: s.confidence ?? null,
        }))
      )
      await supabaseService
        .from('kairos')
        .update({
          text_layers_status: 'proposed',
          text_layers_at: new Date().toISOString(),
          recit_text: proj.recit_text || null,
          recit_only_text: proj.recit_only_text || null,
          lecture_text: proj.lecture_text || null,
        })
        .eq('id', kairosId)
        .eq('user_id', userId)
    } else {
      await supabaseService
        .from('kairos')
        .update({ text_layers_status: det.status, text_layers_at: new Date().toISOString() })
        .eq('id', kairosId)
        .eq('user_id', userId)
    }
    phases_completed.push('2_text_layers')
  } catch (e: any) {
    errors.push(`text_layers: ${e.message}`)
  }

  // Phase 1.5 : user meaning context (chantier 7)
  let userMeaningContext = ''
  try {
    userMeaningContext = await buildUserMeaningContext(supabaseService, userId)
    phases_completed.push('1.5_user_context')
  } catch (e: any) {
    errors.push(`user_context: ${e.message}`)
  }

  // Phase 5 : Forest consultation EARLY (utilisée par extraction + synthesis)
  let forestText = ''
  try {
    const mode =
      kairosType === 'reve' || kairosType === 'reverie' || kairosType === 'hypnagogie'
        ? 'dream'
        : kairosType === 'frisson'
          ? 'body'
          : 'day'
    forestText = await queryForestForMode(supabaseService, rawText, mode, 8)
    phases_completed.push('5_forest')
  } catch (e: any) {
    errors.push(`forest: ${e.message}`)
  }

  // Phase 3 : Extraction Sonnet 16 dimensions
  let extraction: KairosExtraction = {}
  try {
    extraction = await extractKairos16Dimensions({
      rawText,
      kairosType,
      forestContext: forestText,
      userMeaningContext,
      lang,
    })
    phases_completed.push('3_extract')
  } catch (e: any) {
    errors.push(`extract: ${e.message}`)
  }

  // Phase 3.5 : warning_signal (§12bis.E) — ce sur quoi le rêve INSISTE, + le cap ~1/semaine.
  // Le verdict `card_eligible` est FIGÉ ici (comme le score de numinosité) : la fiche est stable
  // à la relecture, et le cap se tient sans table ni migration (filtre jsonb sur setting_metadata).
  let storedWarning: any = null
  try {
    storedWarning = await resolveCareCardEligibility({
      supabaseService,
      userId,
      kairosId,
      warning: normalizeWarningSignal(extraction),
    })
    if (storedWarning) phases_completed.push('3.5_warning')
  } catch (e: any) {
    errors.push(`warning: ${e.message}`)
  }

  // Phase 4 : Embeddings parallèles
  let embeddings: any = {
    embedding_semantic: null,
    embedding_concept: null,
    embedding_somatic: null,
    embedding_archetypal: null,
  }
  try {
    embeddings = await computeKairosEmbeddings({
      // B4 : le vecteur sémantique porte le rêve MOINS son cadre d'enregistrement.
      // Pas moins la lecture du rêveur — voir la note de la phase 2.
      rawText: recitText,
      conceptsText: formatConceptsForEmbed(extraction),
      somaticText: formatSomaticForEmbed(extraction),
      archetypalText: formatArchetypalForEmbed(extraction),
    })
    phases_completed.push('4_embeddings')
  } catch (e: any) {
    errors.push(`embeddings: ${e.message}`)
  }

  // Phase 4.5 : Update kairos avec extraction + embeddings (avant pattern detection)
  // Pattern detection a besoin des embeddings du kairos courant.
  //
  // 🐛 FIX 2026-07-26 (Lot 1 flotte A5) : extraction.title_poetic était calculé par
  // extractKairos16Dimensions() (et extractLightNote()) mais JAMAIS persisté sur
  // kairos.title — la mise à jour s'arrêtait à figures/motif_tags/etc et laissait le
  // titre tomber au sol. Résultat : depuis ~mai 2026 (fin des imports en masse porteurs
  // de titre), aucun kairos capturé en direct n'était plus jamais auto-titré. On ne pose
  // le titre que si l'utilisateur n'en a pas déjà choisi un (mvp/name) — jamais d'écrasement.
  const updateExtraction: any = {
    ...(!kairos.title && extraction.title_poetic
      ? { title: extraction.title_poetic.trim().slice(0, 120) }
      : {}),
    raw_text_lang: extraction.lang_detected || null,
    figures: extraction.figures || {},
    motif_tags: extraction.motif_tags || [],
    somatic_markers: extraction.somatic_markers || {},
    archetypal_tags: extraction.archetypal_tags || [],
    setting_metadata: {
      ...(extraction.setting_metadata || {}),
      // §12bis.E — pas de colonne dédiée : le signal vit dans le jsonb déjà renvoyé par GET /api/kairos/[id].
      ...(storedWarning ? { warning_signal: storedWarning } : {}),
    },
    narrative_dynamics: extraction.narrative_dynamics || {},
    temporal_signature: extraction.temporal_signature || {},
    sensorial_qualities: extraction.sensorial_qualities || {},
    thresholds_passages: extraction.thresholds_passages || {},
    parole_silence: extraction.parole_silence || {},
    power_relations: extraction.power_relations
      ? { text: extraction.power_relations }
      : {},
    paradoxes_unresolved: extraction.paradoxes_unresolved || {},
    metaphors_extrapolated: extraction.metaphors_extrapolated || {},
    dream_ask: extraction.dream_ask || null,
    root_dream_patterns: extraction.root_dream_patterns || [],
    affective_valence: extraction.affective_valence ?? 0,
    affective_intensity: extraction.affective_intensity ?? 0,
    dominant_emotion: extraction.dominant_emotion || null,
    place_label: extraction.place_label || null,
    life_themes: extraction.life_themes || [],
    dream_ego_stance: extraction.dream_ego_stance || null,
  }
  // Embeddings (only set if computed)
  for (const k of Object.keys(embeddings) as Array<keyof typeof embeddings>) {
    if (embeddings[k]) updateExtraction[k] = embeddings[k]
  }

  await supabaseService
    .from('kairos')
    .update(updateExtraction)
    .eq('id', kairosId)
    .eq('user_id', userId)

  phases_completed.push('4.5_persist_extract')

  // Phase 7 : Pattern detection (avec embeddings persistés)
  let patternResult: any = { edges: [], patterns_summary: {} }
  try {
    const somaticZones = Object.keys(extraction.somatic_markers || {})
    patternResult = await runPatternDetection({
      supabaseService,
      userId,
      kairosId,
      motifTags: extraction.motif_tags || [],
      numinosityScore: extraction.numinosity_composite?.score || 0,
      somaticZones,
    })
    phases_completed.push('7_patterns')
  } catch (e: any) {
    errors.push(`patterns: ${e.message}`)
  }

  // Phase 6 : Numinosity scoring composite
  let numinosity: { score: number; signals: string[]; pending_flag: boolean }
  try {
    const matches = await countRootPatternMatches(
      supabaseService,
      userId,
      extraction.root_dream_patterns || []
    )
    numinosity = computeNuminosityScore({
      extraction,
      root_pattern_matches_in_corpus: matches,
      edges_count: patternResult.edges.length,
    })
    phases_completed.push('6_numinosity')
  } catch (e: any) {
    numinosity = { score: 0, signals: [], pending_flag: true }
    errors.push(`numinosity: ${e.message}`)
  }

  // Phase 8 : Synthesis tier + polyphonie
  let synthesisText = ''
  let synthesisTier = 'standard'
  let synthesisVoices: string[] = []
  try {
    const tier = detectSynthesisTier({
      kairos_type: kairosType,
      numinosity_score: numinosity.score,
      archetypal_tags: extraction.archetypal_tags,
      flags_backend: extraction.flags_backend,
      somatic_markers: extraction.somatic_markers,
      edges_count_by_type: patternResult.patterns_summary,
    })
    synthesisTier = tier

    const result = await synthesizeKairos({
      rawText,
      extraction,
      tier,
      forestContext: forestText,
      userMeaningContext,
      patternsSummary: patternResult.patterns_summary,
    })
    synthesisText = result.text
    synthesisVoices = result.voices
    phases_completed.push('8_synthesis')
  } catch (e: any) {
    errors.push(`synthesis: ${e.message}`)
  }

  // Phase 9 : Final update — synthesis + numinosity + pending OFF
  const finalUpdate: any = {
    numinosity_score: numinosity.score,
    numinosity_pending: numinosity.pending_flag,
    updated_at: new Date().toISOString(),
  }
  if (synthesisText) {
    finalUpdate.synthesis_text = synthesisText
    finalUpdate.synthesis_tier = synthesisTier
    finalUpdate.synthesis_voices = synthesisVoices
    finalUpdate.synthesis_generated_at = new Date().toISOString()
    // metadata enrichie dans setting_metadata pour debug
    finalUpdate.setting_metadata = {
      ...(updateExtraction.setting_metadata || {}),
      synthesis_meta: {
        forest_chunks_used: forestText ? forestText.split('\n\n').length : 0,
        numinosity_signals: numinosity.signals,
        patterns_summary: patternResult.patterns_summary,
      },
    }
  }
  await supabaseService.from('kairos').update(finalUpdate).eq('id', kairosId).eq('user_id', userId)
  phases_completed.push('9_finalize')

  // Phase 8.5 — L'APP APPREND DU RÊVEUR (B4).
  // Ce que le rêveur a dit lui-même du sens de ses images va dans sa couche
  // personnelle, marqué comme SIEN (source='dictee_lecture'), avec un poids bas
  // qui ne monte que s'il le redit. L'app ne valide pas, ne corrige pas, ne
  // reformule pas — et ne rendra jamais cette lecture comme si elle venait d'elle.
  try {
    if (lectureText.trim().length >= 60) {
      const meanings = await harvestMeaningsFromLecture({ lectureText, lang })
      if (meanings.length) {
        const n = await storeHarvestedMeanings(supabaseService, userId, meanings, lang)
        if (n) phases_completed.push(`8.5_user_meanings(${n})`)
      }
    }
  } catch (e: any) {
    errors.push(`user_meanings: ${e.message}`)
  }

  // Phase 9.5 — Big Dream auto-detect → propose 7-jour workflow via proactive
  // (Feature 3, 2026-04-29). Conditions : numinosity_score > 0.85 OR tier='big_dream'.
  // Anti-doublon : skip si workflow déjà existe pour ce kairos OU pending message
  // 'echo_detected' déjà créé pour ce kairos.
  try {
    const isBigDream = (numinosity.score || 0) > 0.85 || synthesisTier === 'big_dream'
    if (isBigDream) {
      const { data: existingWorkflow } = await supabaseService
        .from('bigdream_workflows')
        .select('id')
        .eq('user_id', userId)
        .eq('kairos_id', kairosId)
        .limit(1)

      if (!existingWorkflow || existingWorkflow.length === 0) {
        const { data: existingPending } = await supabaseService
          .from('pending_proactive_messages')
          .select('id')
          .eq('user_id', userId)
          .eq('category', 'echo_detected')
          .contains('context_kairos_ids', [kairosId])
          .is('delivered_at', null)
          .limit(1)

        if (!existingPending || existingPending.length === 0) {
          await supabaseService.from('pending_proactive_messages').insert({
            user_id: userId,
            scheduled_for: new Date().toISOString(),
            category: 'echo_detected',
            content:
              "Ce rêve a une qualité particulière. Veux-tu le tenir sur 7 jours ?",
            context_kairos_ids: [kairosId],
          })
          phases_completed.push('9.5_bigdream_proposed')
        }
      }
    }
  } catch (e: any) {
    errors.push(`bigdream_propose: ${e.message}`)
  }

  return {
    ok: errors.length === 0,
    kairos_id: kairosId,
    phases_completed,
    errors,
    numinosity_score: numinosity.score,
    synthesis_tier: synthesisTier,
    edges_count: patternResult.edges.length,
  }
}
