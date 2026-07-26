/**
 * Extraction Sonnet 16 dimensions pour kairos.
 *
 * Source: src/prompts/dream-alpha-extract-calibrated.ts
 * Auteur: Yeshua, 2026-04-25 (chantier 2 + 1 câblage backend).
 */

import Anthropic from '@anthropic-ai/sdk'
import {
  EXTRACT_CALIBRATED_SYSTEM,
  EXTRACT_LIGHT_NOTE_SYSTEM,
  extractLangBlock,
} from '@/prompts/dream-alpha-extract-calibrated'
import { asLang, type DreamLang } from '@/lib/req-lang'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const MODELS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
}

export interface KairosExtraction {
  lang_detected?: string
  title_poetic?: string
  figures?: any[]
  motif_tags?: string[]
  somatic_markers?: Record<string, any>
  archetypal_tags?: string[]
  setting_metadata?: any
  place_label?: string | null
  life_themes?: string[]
  dream_ego_stance?: string | null
  narrative_dynamics?: any
  temporal_signature?: any
  sensorial_qualities?: any
  thresholds_passages?: any[]
  parole_silence?: any
  power_relations?: string | null
  paradoxes_unresolved?: any[]
  metaphors_extrapolated?: string[]
  dream_ask?: string | null
  root_dream_patterns?: string[]
  affective_valence?: number
  affective_intensity?: number
  dominant_emotion?: string | null
  numinosity_composite?: { score: number; pending_flag: boolean; signals: string[] }
  /**
   * §12bis.E — ce sur quoi le rêve INSISTE (conflit, casse, épuisement, perte). Descriptif,
   * jamais prédictif. Seuil haut : `present: false` par défaut. Normalisation + cap : ./warning.ts
   */
  warning_signal?: {
    present: boolean
    intensity: number
    domain: 'relation' | 'corps' | 'materiel' | 'direction' | 'autre'
    what_insists: string
    needs_human_care: boolean
  }
  concepts_for_embed?: string[]
  flags_backend?: {
    somatic_alert_candidate?: boolean
    big_dream?: boolean
    tradition_specific?: string | null
    image_tending_candidate?: boolean
    hypnagogic_seed?: boolean
  }
}

/**
 * Extraction calibrée 16 dimensions via Sonnet, avec injection contexte personnel
 * (user_meaning_layer + user_validations) + Forêt absorbée optionnelle.
 *
 * `lang` = la langue du RÊVEUR (header X-Dream-Lang), pas celle du texte. Elle
 * commande les 3 champs qui finissent à l'écran (title_poetic, dream_ask,
 * warning_signal.what_insists). Les pivots internes (archétypes, motifs, concepts)
 * ne bougent pas — voir extractLangBlock(). Défaut : 'fr' (l'app est FR-first).
 */
export async function extractKairos16Dimensions(opts: {
  rawText: string
  kairosType: string
  forestContext?: string
  userMeaningContext?: string
  lang?: DreamLang
}): Promise<KairosExtraction> {
  const { rawText, kairosType, forestContext, userMeaningContext } = opts
  const lang = asLang(opts.lang)

  // Note jour : extraction allégée (D6 Tim 2026-04-25)
  if (kairosType === 'note_jour') {
    return extractLightNote(rawText, lang)
  }

  let userContent = `KAIROS_TYPE: ${kairosType}\n\nTEXTE:\n${rawText}`

  if (userMeaningContext) {
    userContent += `\n\n${userMeaningContext}`
  }

  if (forestContext) {
    userContent += `\n\n## EXTRAITS FORET (contexte absorbé, jamais cité)\n${forestContext}`
  }

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 3000,
    system: EXTRACT_CALIBRATED_SYSTEM + extractLangBlock(lang),
    messages: [{ role: 'user', content: userContent }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return {}

  try {
    return JSON.parse(jsonMatch[0]) as KairosExtraction
  } catch (err) {
    console.error('[extraction] JSON parse failed:', String(err).slice(0, 200))
    return {}
  }
}

async function extractLightNote(rawText: string, lang: DreamLang = 'fr'): Promise<KairosExtraction> {
  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 500,
    system: EXTRACT_LIGHT_NOTE_SYSTEM + extractLangBlock(lang),
    messages: [{ role: 'user', content: rawText }],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return {}
  try {
    const light = JSON.parse(jsonMatch[0])
    return {
      lang_detected: light.lang_detected,
      title_poetic: light.title_short,
      motif_tags: light.motif_tags || [],
      affective_valence: light.affective_valence ?? 0,
      affective_intensity: light.affective_intensity ?? 0,
    }
  } catch {
    return {}
  }
}
