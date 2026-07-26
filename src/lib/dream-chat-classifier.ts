/**
 * Dream Chat Pre-Classifier (Sprint G — §39.2.1)
 *
 * Classifier local rapide (regex + heuristique) qui détecte l'intention du message user
 * et route vers le tier IA approprié. Pas d'IA, pas d'embedding — juste de la regex.
 *
 * Mapping intentions → tier :
 *   ack_simple              → haiku  (oui/non/merci/ok/salut, ~80% du trafic visé)
 *   micro_question          → haiku  (questions courtes, <30 chars)
 *   depot_simple            → haiku  (1-3 phrases, pas de question explicite)
 *   exploration_moyenne     → sonnet (kairos détaillé, demande angle)        — DEFAULT
 *   demande_synthese        → opus   (mots-clés "synthèse", "tisse", "lettre")
 *   force_polyphony         → sonnet (3 voix structurées — flag explicite)
 *   crisis                  → bypass (déjà câblé en amont, on retourne juste pour info)
 *
 * Distribution attendue (§39.2.1) :
 *   ~80% Haiku · ~18% Sonnet · ~2% Opus
 *   coût pondéré = ~$0.22/user/jour vs $0.75 sans tiering = -71%
 *
 * Override user :
 *   - force_tier explicite passe outre (Premium peut "explore en profondeur")
 *   - force_polyphony force Sonnet (chemin polyphony existant)
 */

export type ChatIntent =
  | 'ack_simple'
  | 'micro_question'
  | 'depot_simple'
  | 'exploration_moyenne'
  | 'demande_synthese'
  | 'force_polyphony'
  | 'crisis'

export type ChatTier = 'haiku' | 'sonnet' | 'opus'

export interface ClassifyResult {
  intent: ChatIntent
  tier: ChatTier
  reason: string
}

// ── Regex patterns ──
const ACK_SIMPLE_PATTERNS = [
  /^\s*(oui|non|ok|okay|d'accord|d'ac|ouais|ouaip|nope|nan|merci|thanks|thx|salut|hello|hi|coucou|hey|bonjour|bonsoir|bye|à plus|au revoir|ciao|tchao|ça marche|cool|super|génial|nice|parfait|ouais ouais|ah ouais|ah ok|ah d'accord|ah bien|🙏|❤️|♥|💛|✨|🌙|👍|👋)[\s.!?]*$/i,
  /^\s*(je suis là|presente|presence|j'arrive|une seconde|un instant|attends|wait)[\s.!?]*$/i,
]

const SYNTHESIS_KEYWORDS = [
  /\bsynth[èe]se\b/i,
  /\bsynth[ée]tise/i,
  /\btisse(r|s)?\b/i,
  /\btissage\b/i,
  /\blettre\b/i,
  /\bportrait\b/i,
  /\b(dresse|dresser)\s+(le|un|mon)\s+portrait\b/i,
  /\bbilan\b/i,
  /\brecap(itulatif)?\b/i,
  /\b(fait|fais|faire)\s+le\s+point\b/i,
  /\b(grande|profonde)\s+lecture\b/i,
  /\btisse[rz]?\s+(tout|ensemble|les fils|le fil|mes r[êe]ves)\b/i,
  /\bmonth(ly)?\s+(synth|portrait|letter|recap)/i,
]

const QUESTION_MARKERS = /[?¿]/

// Heuristique : compte de phrases approximatif (point/exclamation/question + nouvelles lignes)
function countSentences(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  const sentences = trimmed.split(/[.!?…]\s+|\n+/).filter((s) => s.trim().length > 0)
  return sentences.length
}

function isExplorationDeep(text: string): boolean {
  const lower = text.toLowerCase()
  // mots-clés qui signalent une demande d'exploration approfondie ou polyphonique
  const deepMarkers = [
    /\b(que pense|qu'en pense|qu'en pensez|comment lis|comment lirais|comment vois|comment voir)\b/i,
    /\b(angle|angles|perspective|perspectives|voix|polyphonie|polyphonique)\b/i,
    /\bdonne[- ]moi\s+(plusieurs|trois|3)\b/i,
    /\bla for[êe]t\b/i,
    /\b(image autonome|arch[ée]type|somatique|onirique)\b/i,
    /\b(forme|seuil|ombre|figure)\s+qui\b/i,
    /\bqu'est[- ]ce\s+que\s+(tu en|en)\s+(dis|penses|sentirais)\b/i,
  ]
  return deepMarkers.some((re) => re.test(lower))
}

/**
 * Classifier principal.
 * IMPORTANT : la détection crisis est gérée AILLEURS (detectCrisis dans route.ts).
 * Cette fonction suppose que le message n'est pas un signal crisis.
 */
export function classifyChatMessage(
  message: string,
  opts: { force_tier?: ChatTier; force_polyphony?: boolean } = {}
): ClassifyResult {
  // Override 1 : force_polyphony → toujours sonnet (chemin polyphony)
  if (opts.force_polyphony) {
    return { intent: 'force_polyphony', tier: 'sonnet', reason: 'force_polyphony flag' }
  }

  // Override 2 : force_tier explicite (Premium "explore en profondeur")
  if (opts.force_tier) {
    return {
      intent: 'exploration_moyenne',
      tier: opts.force_tier,
      reason: `force_tier=${opts.force_tier}`,
    }
  }

  const text = (message || '').trim()
  const length = text.length

  // 1️⃣ ack_simple — court ack/salutation
  if (length <= 30 && ACK_SIMPLE_PATTERNS.some((re) => re.test(text))) {
    return { intent: 'ack_simple', tier: 'haiku', reason: 'ack/salutation pattern' }
  }

  // 2️⃣ demande_synthese — mots-clés synthèse / tissage / lettre
  if (SYNTHESIS_KEYWORDS.some((re) => re.test(text))) {
    return {
      intent: 'demande_synthese',
      tier: 'opus',
      reason: 'synthesis keyword detected',
    }
  }

  // 3️⃣ exploration_moyenne — demande explicite d'angle/perspective/voix
  if (isExplorationDeep(text)) {
    return {
      intent: 'exploration_moyenne',
      tier: 'sonnet',
      reason: 'deep exploration markers',
    }
  }

  // 4️⃣ micro_question — courte question (<30 chars + ?)
  if (length <= 30 && QUESTION_MARKERS.test(text)) {
    return { intent: 'micro_question', tier: 'haiku', reason: 'short question (<30 chars + ?)' }
  }

  // 5️⃣ depot_simple — court (≤3 phrases, ≤200 chars), pas de question
  const sentences = countSentences(text)
  if (length <= 200 && sentences <= 3 && !QUESTION_MARKERS.test(text)) {
    return { intent: 'depot_simple', tier: 'haiku', reason: 'short deposit, no question' }
  }

  // 6️⃣ Default → exploration_moyenne / Sonnet
  return {
    intent: 'exploration_moyenne',
    tier: 'sonnet',
    reason: 'default fallback (long form or open-ended)',
  }
}

/**
 * Logique inverse pour debug/admin :
 * estime la part attendue de chaque tier sur un échantillon de messages.
 */
export function distributionStats(samples: string[]): Record<ChatTier, number> {
  const counts: Record<ChatTier, number> = { haiku: 0, sonnet: 0, opus: 0 }
  for (const s of samples) {
    const r = classifyChatMessage(s)
    counts[r.tier] += 1
  }
  return counts
}
