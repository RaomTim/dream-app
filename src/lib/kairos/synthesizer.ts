/**
 * Kairos synthesizer — workflow synthèse 6 tiers polyphonique.
 *
 * Phase 6 du pipeline (cf 3_TECHNICAL.md §37 + INVESTIGATION-CALIBRATION).
 *
 * Auteur: Yeshua, 2026-04-25 (chantier 4).
 */

import Anthropic from '@anthropic-ai/sdk'
import { TIER_TO_SYSTEM, FOREST_ABSORB_LABEL, type SynthesisTier } from '@/prompts/synthesis-tiers'
import type { KairosExtraction } from './extraction'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODELS = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
}

export async function synthesizeKairos(opts: {
  rawText: string
  extraction: KairosExtraction
  tier: SynthesisTier
  forestContext?: string
  userMeaningContext?: string
  patternsSummary?: Record<string, number>
  edgesPreview?: Array<{ edge_type: string; preview?: string }>
}): Promise<{ text: string; voices: string[] }> {
  const { rawText, extraction, tier, forestContext, userMeaningContext, patternsSummary, edgesPreview } = opts

  const systemPrompt =
    TIER_TO_SYSTEM[tier] +
    (forestContext ? `\n\n${FOREST_ABSORB_LABEL}\n\n${forestContext}` : '')

  let userContent = `## Texte du kairos\n${rawText}\n\n## Extraction\n${JSON.stringify(
    {
      figures: extraction.figures,
      motif_tags: extraction.motif_tags,
      archetypal_tags: extraction.archetypal_tags,
      somatic_markers: extraction.somatic_markers,
      narrative_dynamics: extraction.narrative_dynamics,
      thresholds_passages: extraction.thresholds_passages,
      paradoxes_unresolved: extraction.paradoxes_unresolved,
      dream_ask: extraction.dream_ask,
      flags_backend: extraction.flags_backend,
    },
    null,
    2
  )}`

  if (patternsSummary && Object.keys(patternsSummary).length > 0) {
    userContent += `\n\n## Résonances détectées dans le corpus\n${JSON.stringify(patternsSummary, null, 2)}`
  }

  if (edgesPreview && edgesPreview.length > 0) {
    userContent += `\n\n## Aperçu des kairos résonnants (anonymisés)\n${edgesPreview
      .slice(0, 5)
      .map((e, i) => `${i + 1}. [${e.edge_type}] ${e.preview || ''}`)
      .join('\n')}`
  }

  if (userMeaningContext) {
    userContent += `\n\n${userMeaningContext}`
  }

  // Big_dream → Opus, sinon Sonnet
  const model = tier === 'big_dream' ? MODELS.opus : MODELS.sonnet
  const max_tokens = tier === 'reverie' || tier === 'image_tending' ? 800 : 1500

  const response = await anthropic.messages.create({
    model,
    max_tokens,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''

  // V1 voices : on enregistre juste le tier comme voice marker
  // V1.5 : Sonnet pourrait expliciter quelles voix il a mobilisées
  return { text, voices: [tier] }
}
