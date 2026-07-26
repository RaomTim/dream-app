/**
 * User context — fetches user_meaning_layer + user_validations pour enrichir
 * les prompts Sonnet (chantier 7 — couche apprentissage personnelle).
 *
 * Source : 3_TECHNICAL.md §39 + CABLAGE-TECHNIQUE-PLAN-EXECUTION §7.
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export async function buildUserMeaningContext(
  client: SupabaseClient,
  userId: string,
  opts: { maxMeanings?: number; maxAhaVoices?: number } = {}
): Promise<string> {
  const { maxMeanings = 20, maxAhaVoices = 10 } = opts

  const [{ data: meanings }, { data: ahas }] = await Promise.all([
    client
      .from('user_meaning_layer')
      .select('symbol_concept, user_meaning, weight')
      .eq('user_id', userId)
      .order('weight', { ascending: false })
      .limit(maxMeanings),
    client
      .from('user_validations')
      .select('proposition_voix, validation, created_at')
      .eq('user_id', userId)
      .eq('validation', 'aha')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  let context = ''

  if (meanings && meanings.length > 0) {
    context += `## Cosmologie symbolique du rêveur (déclarée — à respecter, jamais contredire frontalement)\n`
    context += meanings
      .map((m: any) => `- "${m.symbol_concept}" ≈ ${m.user_meaning} (poids ${m.weight})`)
      .join('\n')
  }

  if (ahas && ahas.length > 0) {
    // Top voices = ce que l'user a confirmé "aha"
    const voiceCounts: Record<string, number> = {}
    for (const a of ahas as any[]) {
      const v = a.proposition_voix || 'unknown'
      voiceCounts[v] = (voiceCounts[v] || 0) + 1
    }
    const topVoices = Object.entries(voiceCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, maxAhaVoices)
      .map(([v, c]) => `- ${v} (${c} aha)`)
    if (topVoices.length > 0) {
      context += `\n\n## Voix qui parlent au rêveur (favoriser leur présence dans la polyphonie)\n${topVoices.join('\n')}`
    }
  }

  return context
}

/**
 * Compte combien de kairos passés du user partagent ≥ 1 root_dream_pattern
 * avec la liste donnée. Utilisé pour récurrence dans numinosity scoring.
 */
export async function countRootPatternMatches(
  client: SupabaseClient,
  userId: string,
  rootPatterns: string[]
): Promise<number> {
  if (!rootPatterns || rootPatterns.length === 0) return 0
  const { count, error } = await client
    .from('kairos')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .overlaps('root_dream_patterns', rootPatterns)
  if (error) return 0
  return count || 0
}
