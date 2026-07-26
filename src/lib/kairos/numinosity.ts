/**
 * Numinosity scoring composite.
 *
 * Source : 3_TECHNICAL.md §35.6 — score composite révisable rétroactivement.
 *
 * Composantes (poids égaux V1, calibrer post-launch) :
 * 1. Densité sensorielle (sensorial_qualities count)
 * 2. Charge somatique (somatic_markers count + intensity)
 * 3. Anomalie (anachronisme, atemporalité, paradoxes)
 * 4. Tag user "ce moment compte" (×2 boost)
 * 5. Récurrence (root_dream_patterns matches dans corpus user)
 * 6. Archetypal density (archetypal_tags count)
 *
 * Auteur: Yeshua, 2026-04-25 (chantier 1).
 */

import type { KairosExtraction } from './extraction'

export interface NuminosityInput {
  extraction: KairosExtraction
  user_marked_numinous?: boolean
  root_pattern_matches_in_corpus?: number  // count of past kairos sharing root patterns
  edges_count?: number  // count of resonance edges already detected
}

export function computeNuminosityScore(input: NuminosityInput): {
  score: number
  signals: string[]
  pending_flag: boolean
} {
  const { extraction, user_marked_numinous, root_pattern_matches_in_corpus = 0, edges_count = 0 } = input
  const signals: string[] = []
  let score = 0

  // 1. Densité sensorielle (0-0.15)
  const sensorialActive = countActiveSensorialChannels(extraction.sensorial_qualities)
  const sensorialScore = Math.min(0.15, sensorialActive * 0.025)
  score += sensorialScore
  if (sensorialActive >= 4) signals.push('sensorial_density')

  // 2. Charge somatique (0-0.20)
  const somaticZones = Object.keys(extraction.somatic_markers || {}).length
  const somaticIntensitySum = Object.values(extraction.somatic_markers || {}).reduce((s: number, m: any) => {
    const intensity = typeof m === 'object' && m?.intensity ? m.intensity : 0
    return s + intensity
  }, 0)
  const somaticScore = Math.min(0.20, somaticZones * 0.05 + somaticIntensitySum * 0.05)
  score += somaticScore
  if (somaticZones >= 2) signals.push('somatic_charge')

  // 3. Anomalie (0-0.15)
  let anomalyScore = 0
  const ts = extraction.temporal_signature || {}
  if (ts.anachronism) { anomalyScore += 0.05; signals.push('anachronism') }
  if (ts.atemporality) { anomalyScore += 0.05; signals.push('atemporality') }
  if (ts.temporal_collapse) { anomalyScore += 0.05; signals.push('temporal_collapse') }
  const paradoxes = (extraction.paradoxes_unresolved || []).length
  if (paradoxes > 0) { anomalyScore += Math.min(0.05, paradoxes * 0.025); signals.push('paradoxes') }
  score += Math.min(0.15, anomalyScore)

  // 4. Tag user (0-0.20, ×2 boost)
  if (user_marked_numinous) {
    score += 0.20
    signals.push('user_marked')
  }

  // 5. Récurrence (0-0.15)
  if (root_pattern_matches_in_corpus >= 5) {
    score += 0.15
    signals.push('root_pattern_recurrence_strong')
  } else if (root_pattern_matches_in_corpus >= 2) {
    score += 0.08
    signals.push('root_pattern_recurrence')
  }

  // Edges détectés bonus (0-0.10)
  if (edges_count >= 5) {
    score += 0.10
    signals.push('multi_layer_resonance')
  } else if (edges_count >= 2) {
    score += 0.05
  }

  // 6. Archetypal density (0-0.15)
  const archetypalCount = (extraction.archetypal_tags || []).length
  const archetypalScore = Math.min(0.15, archetypalCount * 0.04)
  score += archetypalScore
  if (archetypalCount >= 3) signals.push('archetypal_density')

  // Tradition_specific big boost
  if (extraction.flags_backend?.tradition_specific) {
    score += 0.10
    signals.push(`tradition_specific:${extraction.flags_backend.tradition_specific}`)
  }

  // Composite preliminaire from Sonnet
  const sonnetScore = extraction.numinosity_composite?.score || 0
  if (sonnetScore > 0) {
    // Blend 60% calculé / 40% Sonnet
    score = score * 0.6 + sonnetScore * 0.4
  }

  // Cap [0, 1]
  score = Math.max(0, Math.min(1, score))

  // Pending flag : true si le scoring peut évoluer (peu de corpus user)
  const pending = root_pattern_matches_in_corpus < 3

  return { score, signals, pending_flag: pending }
}

function countActiveSensorialChannels(sq?: any): number {
  if (!sq) return 0
  let n = 0
  for (const k of ['sight', 'sound', 'smell', 'touch', 'taste', 'proprioception', 'synesthetic']) {
    if (sq[k] === true) n++
  }
  return n
}
