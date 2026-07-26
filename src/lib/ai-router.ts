import Anthropic from '@anthropic-ai/sdk'
import type { PromptCachingBetaTextBlockParam } from '@anthropic-ai/sdk/resources/beta/prompt-caching/messages'
import type { Locale } from '@/lib/i18n'
import {
  getDreamAlphaSystem,
  getDreamAlphaRitual,
  getDreamAlphaTale,
  DREAM_ALPHA_EXTRACTION,
  DREAM_ALPHA_PATTERN,
  DREAM_ALPHA_ORACLE,
} from '@/prompts/dream-alpha-system'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

type ModelTier = 'haiku' | 'sonnet' | 'opus'

const MODELS: Record<ModelTier, string> = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
}

// 2026-04-20 : mode 'forest' retiré — Dream App ne consulte plus la forêt
// globale comme un mode interne. Bridge vers foret-app.vercel.app à la place.
export type AppMode = 'dream' | 'day' | 'oracle' | 'tale' | 'ritual' | 'reentry' | 'body'

/**
 * Label Forêt V5 — voix absorbée, pas scholaire.
 *
 * Les chunks sont injectés pour NOURRIR Sonnet/Opus. Aucune citation nommée,
 * aucune bibliographie visible, aucune page. Les sources vivent en backend
 * (colonne forest_sources) et peuvent être affichées via toggle côté UI.
 *
 * Tim, 2026-04-20 : « profondeur embarquée et immersive, pas l'étude
 * analytique en mode scholaire libraire. »
 */
const FOREST_ABSORB_LABEL = `## 🌲 Voix profondes (contexte absorbé)
Les passages ci-dessous viennent de 276+ livres digérés. Tu les LIS, tu les INFUSES, puis tu parles dans TA PROPRE VOIX — celle d'un frère qui a lu mille nuits et parle depuis ce qui a été digéré.

- Aucun « selon X », « Hillman écrit », « page 142 », « Moss appelle ça... »
- Aucune phrase en italique avec source nommée
- Aucune liste d'auteurs, pas de marqueurs [GENDLIN], [HILLMAN], [SETH]
- Pas de guillemets d'érudit. Pas de « dans son livre... »

Tu peux évoquer une tradition sans nommer le livre : « il y a des lignées qui… », « certaines traditions tiennent que… », « les anciens savaient que… ». La source reste invisible, la profondeur passe dans le tissu.

Synthèse = ce qui a mangé ces pages. Jamais bibliographie.`

/**
 * Build system blocks for chat (shared between streaming and non-streaming variants).
 */
function buildChatParams(
  messages: { role: 'user' | 'assistant'; content: string }[],
  mode: AppMode,
  dreamHistory?: string,
  forestContext?: string,
  personalForest?: string,
  locale: Locale = 'fr'
): {
  model: string
  max_tokens: number
  system: PromptCachingBetaTextBlockParam[]
  messages: { role: 'user' | 'assistant'; content: string }[]
} {
  const staticPrompt = mode === 'ritual' ? getDreamAlphaRitual(locale) : getDreamAlphaSystem(locale)

  let dynamicPrompt = ''
  if (dreamHistory) {
    dynamicPrompt += `\n\n## Historique récent (rêves, journal, tirages)\n${dreamHistory}`
  }
  if (forestContext) {
    dynamicPrompt += `\n\n${FOREST_ABSORB_LABEL}\n\n${forestContext}`
  }
  if (personalForest) {
    dynamicPrompt += `\n\n${personalForest}\nUtilise ces symboles récurrents pour créer des ponts. Si un symbole revient souvent, note-le.`
  }
  if (mode !== 'ritual') {
    dynamicPrompt += `\n\n## Mode actif : ${mode}`
  }

  const model = mode === 'tale' ? MODELS.opus : MODELS.sonnet

  const systemBlocks: PromptCachingBetaTextBlockParam[] = dynamicPrompt
    ? [
        { type: 'text', text: staticPrompt, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: dynamicPrompt },
      ]
    : [{ type: 'text', text: staticPrompt, cache_control: { type: 'ephemeral' } }]

  return {
    model,
    max_tokens: mode === 'tale' ? 1500 : 2048,
    system: systemBlocks,
    messages,
  }
}

/**
 * Routing intelligent :
 * - Haiku : extraction d'entités, pipeline mécanique
 * - Sonnet : conversation (dream, day, oracle), patterns
 * - Opus : conte-miroir, exploration profonde
 *
 * SSE-friendly variant — yields raw text chunks as they arrive from Anthropic.
 * The caller (route.ts) is responsible for framing them as SSE events.
 */
export async function* chatWithDreamAlphaStream(
  messages: { role: 'user' | 'assistant'; content: string }[],
  mode: AppMode = 'dream',
  dreamHistory?: string,
  forestContext?: string,
  personalForest?: string,
  locale: Locale = 'fr'
): AsyncGenerator<string> {
  const params = buildChatParams(messages, mode, dreamHistory, forestContext, personalForest, locale)

  const stream = anthropic.beta.promptCaching.messages.stream(params)

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}

/**
 * Non-streaming variant — kept for backward-compat (other routes, tests, etc.)
 * Internally uses chatWithDreamAlphaStream and accumulates.
 */
export async function chatWithDreamAlpha(
  messages: { role: 'user' | 'assistant'; content: string }[],
  mode: AppMode = 'dream',
  dreamHistory?: string,
  forestContext?: string,
  personalForest?: string,
  locale: Locale = 'fr'
): Promise<string> {
  let result = ''
  for await (const chunk of chatWithDreamAlphaStream(
    messages, mode, dreamHistory, forestContext, personalForest, locale
  )) {
    result += chunk
  }
  return result
}

/**
 * DEPRECATED — 2026-04-20
 *
 * generateTale previously generated AI-produced conte-miroir text via Opus.
 * This violates the Tim/INFUSE rule: CONTE must be 100% score-match on real
 * tales from the `tales` table (sous-forêt), never AI-generated.
 *
 * This function is intentionally left as a hard-throwing stub so that any
 * remaining caller surfaces immediately at runtime rather than silently
 * generating forbidden AI content.
 *
 * Use /api/tales/match instead (POST with dreamId + context → returns scored
 * real tales from the DB, ethics_flag='open' only).
 *
 * DO NOT restore the Opus generation body without explicit approval.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function generateTale(
  recentContext: string,
  conversationMessages?: { role: 'user' | 'assistant'; content: string }[],
  locale: Locale = 'fr',
  forestContext?: string
): Promise<string> {
  throw new Error(
    'generateTale is deprecated — CONTE must score-match real tales from tales table. Use /api/tales/match instead.'
  )
}

/**
 * Extraction oracle/tarot (Haiku — rapide et structuré)
 */
export async function extractOracle(oracleText: string): Promise<any> {
  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 1024,
    system: DREAM_ALPHA_ORACLE,
    messages: [{ role: 'user', content: oracleText }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return {}
  }
}

/**
 * Extraction d'entités (Haiku — rapide et pas cher)
 */
export async function extractEntities(dreamText: string): Promise<any> {
  const response = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 1024,
    system: DREAM_ALPHA_EXTRACTION,
    messages: [{ role: 'user', content: dreamText }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    // Extraire le JSON du texte (peut être wrapped dans ```json)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return {}
  }
}

/**
 * Détection de patterns (Sonnet — balance qualité/coût)
 * 2026-04-20 : nourri par chunks Forêt pour comprendre archétypes, initiations,
 * processus symboliques via les lignées digérées (Jung, Hillman, Moss, von Franz…).
 * La Forêt n'est PAS citée — elle est absorbée dans l'analyse.
 */
export async function detectPatterns(
  newDream: string,
  dreamHistory: string,
  forestContext?: string
): Promise<any> {
  let systemPrompt = DREAM_ALPHA_PATTERN
  if (forestContext) {
    systemPrompt += `\n\n${FOREST_ABSORB_LABEL}\n\n${forestContext}`
  }

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: `## Nouveau rêve\n${newDream}\n\n## Historique\n${dreamHistory}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return {}
  }
}

/**
 * Exploration profonde (Opus — pour les moments qui comptent)
 * Chunks Forêt absorbés, pas cités.
 */
export async function deepExploration(
  messages: { role: 'user' | 'assistant'; content: string }[],
  forestContext: string,
  locale: Locale = 'fr'
): Promise<string> {
  const systemPrompt = `${getDreamAlphaSystem(locale)}\n\n${FOREST_ABSORB_LABEL}\n\n${forestContext}`

  const response = await anthropic.messages.create({
    model: MODELS.opus,
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

/**
 * Synthèse d'échos prophétiques (Sonnet — narration poétique des patterns)
 *
 * Prend les échos bruts détectés par /api/echoes (pgvector + archetypal) et
 * les TISSE en une lecture profonde. Chunks Forêt absorbés pour nourrir la
 * compréhension archétypale des résonances.
 */
export async function synthesizeEchoes(
  echoesJson: string,
  forestContext: string,
  locale: Locale = 'fr'
): Promise<string> {
  const systemPrompt = `${locale === 'fr' ? 'Tu es Yeshua en mode lecture d\'échos. L\'utilisateur a accumulé des résonances entre ses rêves et ses jours. Tu reçois ces échos en JSON et tu les TISSES en une lecture unique — pas une liste, pas une énumération. Une voix qui nomme ce qui se joue, les patterns qui émergent, le territoire que l\'âme traverse. Courte (300-500 mots), dense, incarnée.' : 'You are Yeshua in echo-reading mode. The user has accumulated resonances between their dreams and days. You receive these echoes as JSON and WEAVE them into a single reading — not a list, not enumeration. A voice that names what is happening, the patterns emerging, the territory the soul is crossing. Short (300-500 words), dense, embodied.'}

${FOREST_ABSORB_LABEL}

${forestContext}`

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Voici mes échos récents :\n\n${echoesJson}\n\nFais-moi la lecture.` }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

/**
 * Synthèse de figures (Sonnet — lecture archétypale des personnages récurrents)
 *
 * Prend les motifs agrégés par /api/figures (Seth types + co-occurrences) et
 * livre une lecture qui nomme qui revient, comment ils évoluent, quels ponts
 * archétypaux ils tissent. Voix absorbée, pas bibliographie.
 */
export async function synthesizeFigures(
  motifsJson: string,
  forestContext: string,
  locale: Locale = 'fr'
): Promise<string> {
  const systemPrompt = `${locale === 'fr'
    ? `Tu es Yeshua en mode lecture de figures. L'utilisateur a un peuple de rêve — des personnages qui reviennent, se transforment, se répondent. Tu reçois leurs motifs en JSON (nom, type Seth, occurrences, co-présences) et tu livres une lecture courte et incarnée : qui porte quoi, quelles alliances se tissent, quelles figures mûrissent, laquelle demande dialogue en priorité.
200-350 mots. Ton de frère qui connaît le peuple de nuit.`
    : `You are Yeshua reading dream figures. The user has a dream people — characters who recur, transform, reply to each other. You receive their motifs as JSON (name, Seth type, occurrences, co-presences) and deliver a short, embodied reading: who carries what, what alliances are forming, which figures are ripening, which one asks for dialogue first.
200-350 words. Tone of a brother who knows the night people.`}

${FOREST_ABSORB_LABEL}

${forestContext}`

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 1200,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Voici mon peuple de rêve :\n\n${motifsJson}\n\nQui revient, qui mûrit, qui demande ?` }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

/**
 * Synthèse Oracle du Corps (Sonnet — dreambody reading)
 *
 * Prend les corrélations somatiques agrégées par /api/oracle-corps (zones +
 * body_symbolism + rêves liés) et livre une lecture dreambody (Mindell absorbé).
 * Le corps parle en parallèle du rêve — cette synthèse traduit le langage.
 */
export async function synthesizeBodyOracle(
  correlationsJson: string,
  forestContext: string,
  locale: Locale = 'fr'
): Promise<string> {
  const systemPrompt = `${locale === 'fr'
    ? `Tu es Yeshua en mode Oracle du Corps. L'utilisateur a tracé des sensations, des zones, des symptômes qui traversent ses rêves et ses jours. Tu reçois ces corrélations en JSON (zone, nombre d'occurrences, rêves liés, body_symbolism) et tu livres une lecture dreambody : le corps rêve en parallèle, il te montre où le travail se fait. Nomme la zone qui parle le plus fort, ce qu'elle porte, comment la tenir vivante plutôt que la réduire à un diagnostic.
JAMAIS diagnostic médical. TOUJOURS "si ton corps rêvait à travers ce signal, qu'est-ce qu'il dirait ?". 250-400 mots.`
    : `You are Yeshua in Body Oracle mode. The user has traced sensations, zones, symptoms crossing their dreams and days. You receive these correlations as JSON (zone, occurrence count, linked dreams, body_symbolism) and deliver a dreambody reading: the body dreams alongside, it shows you where the work is happening. Name the zone speaking loudest, what it carries, how to tend it alive rather than reduce it to diagnosis.
NEVER medical diagnosis. ALWAYS "if your body were dreaming through this signal, what would it say?". 250-400 words.`}

${FOREST_ABSORB_LABEL}

${forestContext}`

  const response = await anthropic.messages.create({
    model: MODELS.sonnet,
    max_tokens: 1200,
    system: systemPrompt,
    messages: [{ role: 'user', content: `Voici mes corrélations somatiques :\n\n${correlationsJson}\n\nQu'est-ce que mon corps rêve ?` }],
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
