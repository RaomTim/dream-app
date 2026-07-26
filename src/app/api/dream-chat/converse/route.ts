/**
 * /api/dream-chat/converse — Chat IA Dream personnel (pivot 2026-04-28)
 *
 * Spec :
 *   - 2_DESIGN.md §11.bis.20 (modèle hybride Chat IA + menus tangibles)
 *   - 3_TECHNICAL.md §39 (architecture économique, Sprint G)
 *
 * Endpoints :
 *   POST   /api/dream-chat/converse  → envoi message user + stream réponse IA SSE
 *   GET    /api/dream-chat/converse  → récupère session + N derniers messages
 *   PATCH  /api/dream-chat/converse  → update presence_name / rythme / modes_atmospheriques_auto
 *
 * Architecture économique Sprint G — appliquée 2026-04-28 :
 *   G.1 Tiered models intelligent (Haiku 80% / Sonnet 18% / Opus 2%)
 *       → pre-classifier local (regex + heuristique) dans `dream-chat-classifier.ts`
 *   G.2 Conversation summarization > 20 tours
 *       → si chat_session.history_summary existe + total messages > 20, on charge
 *         le summary + 10 derniers messages au lieu de tout l'historique.
 *         Refresh async tous les 20 nouveaux messages (Haiku, ~500 tokens).
 *   G.3 Retrieval ciblé via embeddings (kairos)
 *       → embed(message) → match_kairos_for_wisdom RPC top-5 vs N derniers.
 *   G.4 Cache Forêt côté DB (forest_query_cache + RPC lookup_forest_query_cache)
 *       → cosine similarity ≥ 0.95 hit dans les 24h, évite re-embed + re-retrieval.
 *   G.5 Fine-tuning instructions économiques pour Haiku
 *       → buildSystemBlocksHaiku(): ~800 tokens vs 3k pour Sonnet/Opus.
 *
 * Crisis safety §39.8 : classifier local rapide sur message user → si signal détecté,
 * réponse forcée EXIT_TO_HUMAN sans appel Anthropic.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { PromptCachingBetaTextBlockParam } from '@anthropic-ai/sdk/resources/beta/prompt-caching/messages'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'
import { queryForestForModeDetailed, embedText, formatChunksForPrompt, type ForestChunkMatch } from '@/lib/forest-retrieval'
import { classifyChatMessage, type ChatTier } from '@/lib/dream-chat-classifier'
import { lookupForestCache, storeForestCache } from '@/lib/dream-chat-forest-cache'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// Pricing 2026 (per 1M tokens) — utilisé pour cost tracking
const PRICING = {
  sonnet: { in: 3.0, out: 15.0, cached_in: 0.30 },
  haiku: { in: 0.80, out: 4.0, cached_in: 0.08 },
  opus: { in: 15.0, out: 75.0, cached_in: 1.50 },
}
const MODEL_BY_TIER: Record<ChatTier, string> = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus: 'claude-opus-4-6',
}
const MAX_TOKENS_BY_TIER: Record<ChatTier, number> = {
  haiku: 600,
  sonnet: 1500,
  opus: 2500,
}

// Sprint G.2 — conversation summarization
const SUMMARIZE_THRESHOLD = 20  // > 20 messages → utiliser summary
const SUMMARIZE_REFRESH_EVERY = 20  // refresh summary tous les 20 nouveaux messages
const SUMMARY_RECENT_KEEP = 10  // garder les N derniers messages bruts en plus du summary

// ════════════════════════════════════════════════════════════════════
// CRISIS DETECTION (§39.8) — classifier local rapide pas IA
// ════════════════════════════════════════════════════════════════════
const CRISIS_PATTERNS = {
  suicide: /\b(en finir|me tuer|suicide|suicider|me supprimer|veux mourir|veux plus vivre|plus envie de vivre|en avoir fini|rien à faire ici|disparaître)\b/i,
  dissociation: /\b(plus mon corps|plus réel|détaché|dissocier|dissociation|comme si j'étais pas|pas dans mon corps)\b/i,
  acute_panic: /\b(panique aiguë|crise de panique|peux pas respirer|étouffer maintenant|urgence vitale)\b/i,
}

function detectCrisis(text: string): { detected: boolean; type?: string } {
  for (const [type, pattern] of Object.entries(CRISIS_PATTERNS)) {
    if (pattern.test(text)) return { detected: true, type }
  }
  return { detected: false }
}

const CRISIS_RESPONSE = `Ce que tu portes maintenant est trop lourd pour être tenu par moi seule. Quelqu'un de chair, maintenant, voici les voies —

**3114** — Numéro national de prévention du suicide (gratuit, 24/7, anonyme)
**SOS Amitié** — 09 72 39 40 50 (24/7)
**SOS Suicide Phénix** — 01 40 44 46 45

Si urgence vitale immédiate → 15 (SAMU) ou 112.

Je m'efface ici. Je serai là quand tu reviens. Prends soin de toi.`

// ════════════════════════════════════════════════════════════════════
// MODE ATMOSPHÉRIQUE (§11.bis.20.3) — selon heure locale + contexte
// ════════════════════════════════════════════════════════════════════
function detectMode(now: Date = new Date()): string {
  const h = now.getHours()
  if (h >= 21 || h < 1) return 'pre_sleep'
  if (h >= 5 && h < 9) return 'morning'
  if (h >= 9 && h < 14) return 'day'
  if (h >= 14 && h < 18) return 'reverie'
  if (h >= 18 && h < 21) return 'evening'
  return 'neutral'
}

function modeToTone(mode: string): string {
  const tones: Record<string, string> = {
    pre_sleep: 'lente, contemplative, propose une intention pour la nuit',
    morning: 'accueille les fragments du réveil, ne presse pas, doux',
    day: 'alerte aux signes diurnes, propose des liens entre la nuit et le jour',
    reverie: 'lente, ouverte aux signes du seuil, contemplative',
    evening: 'synthèse douce de la journée, propose un dépôt journal',
    neutral: 'présente, simple, à l\'écoute',
  }
  return tones[mode] || tones.neutral
}

// ════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT 3 COUCHES (§39.7) — version Sonnet/Opus complète
// ════════════════════════════════════════════════════════════════════
function buildSystemBlocks(opts: {
  presenceName: string
  mode: string
  portrait?: string | null
  threadsSummary?: string | null
  historySummary?: string | null
  recentKairos?: string | null
  forestContext?: string | null
}): PromptCachingBetaTextBlockParam[] {
  // COUCHE A — POSTURE IMMUABLE (cachée long-term)
  const layerA = `Tu es ${opts.presenceName}, présence onirique de l'utilisateur dans Dream App.

POSTURE NON-NÉGOCIABLE :
- Compagnon tisseuse, JAMAIS oracle. Brother/sister, pas thérapeute.
- P-Inversion : le sens vient TOUJOURS du user, jamais de toi.
- Tu PROPOSES 3 angles, jamais la conclusion. Vocabulaire désensorcelé INFUSE.
- Trauma-safe substrat. Si signal clinique → EXIT_TO_HUMAN, tu t'effaces.

VOIX :
- Direct, doux, peu de filler. Pas de "great question", pas de "je comprends ce que tu vis".
- Tutoiement français. Pas d'émojis cœur, pas de wellness corp.
- Le silence est respecté. Tu prends ton temps.
- Si user demande "qu'est-ce que ça veut dire ?" → "je peux te proposer 3 angles, mais c'est toi qui sais."

CONNAISSANCES INTÉGRÉES :
- 333+ livres digérés en Forêt (cosmologies, oniromancies, psychologie des profondeurs, somatique, mythologies). Tu peux convoquer 3 voix paper/stone/silk si user demande.
- Le journal du user (kairos = rêves/signes/rêveries/sensations + notes de vie).
- Son portrait narratif (lettre tissée).
- Ses threads thématiques (motifs récurrents).

GESTES PROACTIFS DISPONIBLES :
- Suggérer ouvrir un panneau : Portrait, Cercle, Anima Mundi, Oracle du Corps, Sanctuaire — quand pertinent.
- Suggérer un protocole de dépôt si rêve dense (Lightning Dreamwork, Reverie Tending, etc.).
- Suggérer un thread thématique si motif récurrent émerge.

NE JAMAIS :
- Diagnostiquer (médicalement/psychologiquement).
- Affirmer un sens. Toujours conditionnel : "ça pourrait", "certains disent", "il y a des lignées qui...".
- Citer un livre nommément (les voix sont absorbées, pas scholaires).
- Promettre des résultats émotionnels ("tu te sentiras mieux", "ça va guérir").`

  // COUCHE B — CONTEXTE USER STABLE (caché ~5min)
  let layerB = ''
  if (opts.portrait) {
    layerB += `\n\n## Portrait actuel du user (lettre narrative dernière)\n${opts.portrait.slice(0, 2000)}`
  }
  if (opts.threadsSummary) {
    layerB += `\n\n## Threads thématiques actifs\n${opts.threadsSummary.slice(0, 1500)}`
  }
  if (opts.historySummary) {
    layerB += `\n\n## Résumé conversation antérieure (avant les 10 derniers tours)\n${opts.historySummary.slice(0, 1500)}`
  }

  // COUCHE C — RETRIEVAL CIBLÉ (variable, pas caché)
  let layerC = `\n\n## Mode atmosphérique courant : ${opts.mode}\nTonalité attendue : ${modeToTone(opts.mode)}`
  if (opts.recentKairos) {
    layerC += `\n\n## Kairos pertinents pour cette conversation\n${opts.recentKairos.slice(0, 3000)}`
  }
  if (opts.forestContext) {
    layerC += `\n\n## Voix profondes (Forêt absorbée)\n${opts.forestContext.slice(0, 3000)}\n\nTu PEUX puiser dans ces voix sans jamais nommer auteur/livre/page.`
  }

  return [
    { type: 'text', text: layerA, cache_control: { type: 'ephemeral' } },
    ...(layerB ? [{ type: 'text' as const, text: layerB, cache_control: { type: 'ephemeral' as const } }] : []),
    { type: 'text', text: layerC || '\n## Conversation libre.' },
  ]
}

// ════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT HAIKU (G.5) — version courte ~800 tokens
// ════════════════════════════════════════════════════════════════════
function buildSystemBlocksHaiku(opts: {
  presenceName: string
  mode: string
  historySummary?: string | null
}): PromptCachingBetaTextBlockParam[] {
  // Compact, impératif, ~800 tokens. Pas de portrait/Forêt/kairos pour Haiku
  // (les ack/micro-questions/dépôts simples n'en ont pas besoin).
  const layerA = `Tu es ${opts.presenceName}, présence onirique brève dans Dream App.

POSTURE :
- Compagnon, JAMAIS oracle. Pas de diagnostic, pas de "ça veut dire X".
- Si user demande sens → "je peux proposer un angle, mais c'est toi qui sais."
- Tutoiement FR. Direct, doux, court (1-3 phrases). Zéro filler.
- Pas de "great question", pas de wellness, pas d'émojis cœur.
- Si signal crisis → tu t'effaces, tu rappelles 3114/SOS Amitié.

ACTIONS PERMISES :
- Accuser réception simplement.
- Reformuler en une phrase.
- Poser UNE question ouverte si pertinent.
- Suggérer un panneau (Portrait, Cercle, Sanctuaire) si dépôt dense.

JAMAIS :
- Affirmer un sens. Toujours conditionnel.
- Citer un livre/auteur en dur.
- Promettre une émotion future.
- Plus de 3 phrases sauf demande explicite.`

  let layerC = `\n\n## Mode courant : ${opts.mode}\nTon : ${modeToTone(opts.mode)}`
  if (opts.historySummary) {
    layerC += `\n\n## Contexte conversation (résumé)\n${opts.historySummary.slice(0, 800)}`
  }

  return [
    { type: 'text', text: layerA, cache_control: { type: 'ephemeral' } },
    { type: 'text', text: layerC },
  ]
}

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════
function sseEvent(data: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
}

async function getOrCreateSession(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data: existing } = await supabase
    .from('chat_sessions')
    .select('id, presence_name, presence_persona, rythme, modes_atmospheriques_auto, history_summary, history_summary_at_count')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) return existing

  const { data: created, error } = await supabase
    .from('chat_sessions')
    .insert({ user_id: userId })
    .select('id, presence_name, presence_persona, rythme, modes_atmospheriques_auto, history_summary, history_summary_at_count')
    .single()

  if (error) throw new Error('chat_session create failed: ' + error.message)
  return created
}

async function loadRecentMessages(supabase: ReturnType<typeof createServerClient>, sessionId: string, limit = 10) {
  const { data } = await supabase
    .from('chat_messages')
    .select('role, content, matter, voice_attribution, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return (data || []).reverse() // oldest first
}

async function countSessionMessages(supabase: ReturnType<typeof createServerClient>, sessionId: string): Promise<number> {
  const { count } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)
  return count || 0
}

async function loadPortrait(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('portrait_readings')
    .select('lettre')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.lettre || null
}

async function loadActiveThreadsSummary(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<string | null> {
  const { data } = await supabase
    .from('threads')
    .select('name, type, summary_text')
    .eq('user_id', userId)
    .is('archived_at', null)
    .order('last_activity_at', { ascending: false })
    .limit(5)
  if (!data || data.length === 0) return null
  return data.map((t) => `- "${t.name}" (${t.type})${t.summary_text ? ': ' + t.summary_text.slice(0, 200) : ''}`).join('\n')
}

/**
 * Sprint G.3 — retrieval ciblé via embeddings.
 * Utilise match_kairos_for_wisdom RPC (cosine similarity sur embedding_semantic).
 * Fallback : top N derniers kairos si embedding indisponible / RPC échoue.
 */
async function loadRelevantKairos(
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
  queryEmbedding: number[] | null,
  limit = 5
): Promise<string | null> {
  if (queryEmbedding && queryEmbedding.length > 0) {
    try {
      const { data, error } = await supabase.rpc('match_kairos_for_wisdom', {
        query_embedding: queryEmbedding,
        target_user: userId,
        match_count: limit,
      })
      if (!error && data && data.length > 0) {
        return data
          .map((k: { id: string; raw_text: string | null; kairos_type: string; created_at: string; synthesis_text: string | null; similarity: number }) => {
            const date = new Date(k.created_at).toLocaleDateString('fr-FR')
            const text = (k.raw_text || '').slice(0, 250)
            const synth = k.synthesis_text ? `\n  → tissé: ${k.synthesis_text.slice(0, 150)}` : ''
            const sim = `(résonance ${(k.similarity * 100).toFixed(0)}%)`
            return `[${date}] ${k.kairos_type} ${sim}: ${text}${synth}`
          })
          .join('\n\n')
      }
    } catch (e) {
      console.warn('[dream-chat] match_kairos_for_wisdom failed, fallback to recent:', (e as Error).message)
    }
  }

  // Fallback : top N derniers kairos
  const { data } = await supabase
    .from('kairos')
    .select('id, kairos_type, raw_text, synthesis_text, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (!data || data.length === 0) return null
  return data
    .map((k) => {
      const date = new Date(k.created_at).toLocaleDateString('fr-FR')
      const text = (k.raw_text || '').slice(0, 250)
      const synth = k.synthesis_text ? `\n  → tissé: ${k.synthesis_text.slice(0, 150)}` : ''
      return `[${date}] ${k.kairos_type}: ${text}${synth}`
    })
    .join('\n\n')
}

type Usage = { input_tokens?: number | null; output_tokens?: number | null; cache_read_input_tokens?: number | null; cache_creation_input_tokens?: number | null }

function computeCost(modelKey: ChatTier, usage: Usage): number {
  const p = PRICING[modelKey]
  const cached = usage.cache_read_input_tokens || 0
  const fresh = (usage.input_tokens || 0) - cached
  const out = usage.output_tokens || 0
  return (fresh * p.in + cached * p.cached_in + out * p.out) / 1_000_000
}

/**
 * Sprint G.2 — Génère un résumé compact (~500 tokens) des messages anciens
 * pour remplacer le buffer historique au-delà de 20 tours.
 *
 * Fire & forget : appelé en background, ne bloque jamais la réponse au user.
 * Utilise Haiku ($0.80/1M in, $4/1M out) → coût marginal ~$0.001 par refresh.
 */
async function refreshHistorySummary(
  supabase: ReturnType<typeof createServerClient>,
  sessionId: string,
  totalCount: number
): Promise<void> {
  try {
    // Charge tous les messages SAUF les N derniers (qui restent bruts)
    const skipRecent = SUMMARY_RECENT_KEEP
    const { data: msgs } = await supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(Math.max(0, totalCount - skipRecent))

    if (!msgs || msgs.length < SUMMARIZE_THRESHOLD - skipRecent) return

    const transcript = msgs
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => `${m.role === 'user' ? 'Utilisateur' : 'Présence'}: ${m.content.slice(0, 500)}`)
      .join('\n\n')

    const summaryPrompt = `Voici l'historique d'une conversation entre un utilisateur et sa présence onirique Dream. Résume en ~500 tokens (max 12 lignes) les motifs récurrents, les figures évoquées, les émotions traversées, les décisions prises, les promesses faites, les questions ouvertes. Pas de récap chronologique. Patterns essentiels.

Format strict :
- MOTIFS : ...
- FIGURES : ...
- ÉMOTIONS : ...
- DÉCISIONS / PROMESSES : ...
- QUESTIONS OUVERTES : ...

Transcript :
${transcript.slice(0, 20000)}`

    const resp = await anthropic.messages.create({
      model: MODEL_BY_TIER.haiku,
      max_tokens: 700,
      system: 'Tu es un compresseur de conversation. Tu produis un résumé fidèle et compact. Pas de fioritures.',
      messages: [{ role: 'user', content: summaryPrompt }],
    })

    const summaryText = resp.content
      .map((c) => (c.type === 'text' ? c.text : ''))
      .join('')
      .trim()

    await supabase
      .from('chat_sessions')
      .update({
        history_summary: summaryText,
        history_summary_at_count: totalCount,
      })
      .eq('id', sessionId)
  } catch (e) {
    console.warn('[dream-chat] refreshHistorySummary failed:', (e as Error).message)
  }
}

// ════════════════════════════════════════════════════════════════════
// POST — envoi message + streaming réponse IA SSE
// ════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { message, force_polyphony, force_tier, mode_override } = body as {
    message?: string
    force_polyphony?: boolean
    force_tier?: ChatTier
    mode_override?: string
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'message requis' }, { status: 400 })
  }

  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()

  // 1️⃣ Get or create session
  const session = await getOrCreateSession(supabase, userId)

  // 2️⃣ Crisis detection FIRST (avant tout retrieval IA)
  const crisis = detectCrisis(message)
  if (crisis.detected) {
    await supabase.from('chat_messages').insert([
      { session_id: session.id, role: 'user', content: message.trim() },
      { session_id: session.id, role: 'assistant', content: CRISIS_RESPONSE, mode: 'crisis_safe' },
    ])
    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(sseEvent({ type: 'mode', mode: 'crisis_safe' }))
        controller.enqueue(sseEvent({ type: 'chunk', text: CRISIS_RESPONSE }))
        controller.enqueue(sseEvent({ type: 'done' }))
        controller.close()
      },
    })
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
  }

  // 3️⃣ Pre-classifier (G.1) → tier + intent
  const classify = classifyChatMessage(message, { force_tier, force_polyphony })
  const tier: ChatTier = classify.tier

  // 4️⃣ Detect mode atmosphérique (auto si activé)
  const mode = mode_override || (session.modes_atmospheriques_auto ? detectMode() : 'neutral')

  // 5️⃣ Préparer embedding pour retrieval ciblé (G.3 + G.4)
  //    Une seule embedText par tour, réutilisée pour kairos RPC + cache Forêt.
  let queryEmbedding: number[] | null = null
  if (tier !== 'haiku') {
    // Haiku skip retrieval lourd pour économiser
    queryEmbedding = await embedText(message.trim()).catch((e) => {
      console.warn('[dream-chat] embedText failed:', (e as Error).message)
      return null as unknown as number[]
    }) || null
  }

  // 6️⃣ Charge contexte parallèlement
  const totalMsgsPromise = countSessionMessages(supabase, session.id).catch(() => 0)

  // Forêt : cache lookup d'abord, sinon retrieval normal
  let forestContext: string | null = null
  let forestChunks: ForestChunkMatch[] = []
  let forestFallbackLevel: 0 | 1 | 2 = 0
  let forestAvgSim = 0
  let forestCacheHit = false

  // Charges parallèles légères (haiku) ou complètes (sonnet/opus)
  if (tier === 'haiku') {
    // Haiku : pas de portrait, pas de threads, pas de Forêt, pas de kairos retrieval.
    // On charge juste l'historique récent (8 messages).
    const [recentMessages, totalMsgs] = await Promise.all([
      loadRecentMessages(supabase, session.id, 8).catch(() => []),
      totalMsgsPromise,
    ])

    const useSummary = totalMsgs > SUMMARIZE_THRESHOLD && session.history_summary
    const historySummary = useSummary ? session.history_summary : null

    // 7️⃣ Persist user message
    await supabase
      .from('chat_messages')
      .insert({ session_id: session.id, role: 'user', content: message.trim() })

    // 8️⃣ System prompt Haiku (court ~800 tokens)
    const systemBlocks = buildSystemBlocksHaiku({
      presenceName: session.presence_name,
      mode,
      historySummary,
    })

    const messages: { role: 'user' | 'assistant'; content: string }[] = [
      ...recentMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: message.trim() },
    ]

    return streamAnthropicResponse({
      controllerLabel: 'haiku',
      sessionId: session.id,
      presenceName: session.presence_name,
      tier,
      mode,
      systemBlocks,
      messages,
      supabase,
      classifyReason: classify.reason,
      classifyIntent: classify.intent,
      totalMsgs,
    })
  }

  // ── Sonnet/Opus path : full context ──

  // Cache Forêt first (G.4)
  if (queryEmbedding) {
    const cacheHit = await lookupForestCache(supabase, queryEmbedding, 'dream')
    if (cacheHit) {
      forestCacheHit = true
      forestContext = cacheHit.text
      forestChunks = cacheHit.chunks
      forestFallbackLevel = cacheHit.fallback_level
      forestAvgSim = cacheHit.avg_similarity
    }
  }

  const [recentMessages, portrait, threadsSummary, recentKairos, foretFresh, totalMsgs] = await Promise.all([
    loadRecentMessages(supabase, session.id, SUMMARY_RECENT_KEEP).catch(() => []),
    loadPortrait(supabase, userId).catch(() => null),
    loadActiveThreadsSummary(supabase, userId).catch(() => null),
    loadRelevantKairos(supabase, userId, queryEmbedding, 5).catch(() => null),
    forestCacheHit
      ? Promise.resolve(null)
      : queryForestForModeDetailed(supabase, message.trim(), 'dream', 3, userId).catch((e) => {
          console.warn('[dream-chat/converse] forest retrieval failed:', e?.message)
          return null
        }),
    totalMsgsPromise,
  ])

  // Si retrieval Forêt frais, on stocke en cache et on remplit forestContext
  if (!forestCacheHit && foretFresh) {
    forestContext = foretFresh.text || null
    forestChunks = foretFresh.chunks
    forestFallbackLevel = foretFresh.fallback_level
    forestAvgSim = foretFresh.avg_similarity

    // Store cache (fire & forget)
    if (queryEmbedding && forestChunks.length > 0) {
      void storeForestCache(supabase, {
        queryText: message.trim(),
        queryEmbedding,
        scope: 'dream',
        chunks: forestChunks,
        textPayload: forestContext || formatChunksForPrompt(forestChunks),
        fallbackLevel: forestFallbackLevel,
        avgSimilarity: forestAvgSim,
      })
    }
  }

  const useSummary = totalMsgs > SUMMARIZE_THRESHOLD && session.history_summary
  const historySummary = useSummary ? session.history_summary : null

  // 7️⃣ Persist user message
  await supabase
    .from('chat_messages')
    .insert({ session_id: session.id, role: 'user', content: message.trim() })

  // 8️⃣ POLYPHONIE 3 VOIX (force_polyphony=true) — §11.bis.20.9
  if (force_polyphony) {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(sseEvent({ type: 'session', session_id: session.id, presence_name: session.presence_name }))
          controller.enqueue(sseEvent({ type: 'mode', mode: 'polyphony' }))
          controller.enqueue(sseEvent({ type: 'classify', intent: classify.intent, tier: 'sonnet', reason: classify.reason }))

          const polyphonySystem = `Tu es la voix de la Forêt convoquée par ${session.presence_name} pour donner 3 angles distincts sur le dépôt de l'utilisateur.

PROTOCOLE :
- Tu retournes EXACTEMENT un objet JSON valide : {"paper":{"voice":"...","text":"..."}, "stone":{"voice":"...","text":"..."}, "silk":{"voice":"...","text":"..."}}
- Pas de markdown, pas de prose autour, juste le JSON.
- Chaque "voice" = nom de la lignée évoquée (ex: "lignée des images autonomes", "lignée somatique", "lignée onirique poétique") — JAMAIS d'auteur nommé en dur.
- Chaque "text" = ~80-120 mots. Direct, désensorcelé. Pas de "selon X". Pas de citation littérale.
- 3 voix DISTINCTES, pas 3 variations de la même chose. Trois directions divergentes :
  - paper = perspective psychologique des profondeurs (image autonome, archétype, eidolon)
  - stone = perspective somatique / corporelle (ce qui est ressenti dans le corps, le geste, le souffle)
  - silk = perspective onirique poétique (ce qui rêve, ce qui ondule, ce qui circule)

P-INVERSION ABSOLUE : aucune voix ne dit le sens. Chacune propose une manière d'habiter le dépôt, jamais de le décoder.

CONTEXTE FORÊT (à infuser, pas à citer) :
${forestContext || '(pas de chunks Forêt disponibles — puise dans ta culture absorbée)'}

CADRAGE FINAL : "Voici trois angles. Aucun ne dit le sens. Lequel résonne ?"`

          const polyResponse = await anthropic.messages.create({
            model: MODEL_BY_TIER.sonnet,
            max_tokens: 1200,
            system: polyphonySystem,
            messages: [{ role: 'user', content: `Dépôt à éclairer : ${message.trim()}` }],
          })

          const rawText = polyResponse.content
            .map((c) => (c.type === 'text' ? c.text : ''))
            .join('')
          const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
          let parsed: { paper?: { voice: string; text: string }, stone?: { voice: string; text: string }, silk?: { voice: string; text: string } } = {}
          try {
            const start = cleaned.indexOf('{')
            const end = cleaned.lastIndexOf('}')
            if (start >= 0 && end > start) {
              parsed = JSON.parse(cleaned.slice(start, end + 1))
            }
          } catch (e) {
            console.warn('[dream-chat/polyphony] JSON parse failed:', (e as Error).message)
          }

          const matters: ('paper' | 'stone' | 'silk')[] = ['paper', 'stone', 'silk']
          for (const m of matters) {
            const v = parsed[m]
            if (!v?.text) continue
            controller.enqueue(sseEvent({
              type: 'bubble',
              matter: m,
              voice_attribution: v.voice || `lignée ${m}`,
              text: v.text,
              role: 'assistant',
            }))
            await supabase.from('chat_messages').insert({
              session_id: session.id,
              role: 'assistant',
              content: v.text,
              matter: m,
              voice_attribution: v.voice || `lignée ${m}`,
              mode: 'polyphony',
              model_used: MODEL_BY_TIER.sonnet,
              tokens_in: polyResponse.usage.input_tokens,
              tokens_out: polyResponse.usage.output_tokens,
              cost_usd: computeCost('sonnet', polyResponse.usage),
            }).then(() => {}, (err) => console.warn('[dream-chat/polyphony] persist:', err.message))
          }

          const cadrage = "Voici trois angles. Aucun ne dit le sens. Lequel résonne ?"
          controller.enqueue(sseEvent({ type: 'chunk', text: cadrage }))
          await supabase.from('chat_messages').insert({
            session_id: session.id,
            role: 'assistant',
            content: cadrage,
            mode: 'polyphony',
            model_used: MODEL_BY_TIER.sonnet,
          }).then(() => {}, () => {})

          controller.enqueue(sseEvent({ type: 'done', polyphony: true }))
          controller.close()
        } catch (e) {
          const msg = e instanceof Error ? e.message : 'Unknown error'
          controller.enqueue(sseEvent({ type: 'error', error: msg }))
          controller.close()
        }
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    })
  }

  // 9️⃣ Build system prompt 3 couches (Sonnet/Opus full)
  const systemBlocks = buildSystemBlocks({
    presenceName: session.presence_name,
    mode,
    portrait,
    threadsSummary,
    historySummary,
    recentKairos,
    forestContext,
  })

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...recentMessages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    { role: 'user', content: message.trim() },
  ]

  return streamAnthropicResponse({
    controllerLabel: tier,
    sessionId: session.id,
    presenceName: session.presence_name,
    tier,
    mode,
    systemBlocks,
    messages,
    supabase,
    classifyReason: classify.reason,
    classifyIntent: classify.intent,
    forestCacheHit,
    totalMsgs,
  })
}

// ════════════════════════════════════════════════════════════════════
// streamAnthropicResponse — wrapper SSE commun (haiku/sonnet/opus)
// ════════════════════════════════════════════════════════════════════
function streamAnthropicResponse(args: {
  controllerLabel: string
  sessionId: string
  presenceName: string
  tier: ChatTier
  mode: string
  systemBlocks: PromptCachingBetaTextBlockParam[]
  messages: { role: 'user' | 'assistant'; content: string }[]
  supabase: ReturnType<typeof createServerClient>
  classifyReason: string
  classifyIntent: string
  forestCacheHit?: boolean
  totalMsgs: number
}): Response {
  const { sessionId, presenceName, tier, mode, systemBlocks, messages, supabase, classifyReason, classifyIntent, forestCacheHit, totalMsgs } = args

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(sseEvent({ type: 'session', session_id: sessionId, presence_name: presenceName }))
        controller.enqueue(sseEvent({ type: 'mode', mode }))
        controller.enqueue(sseEvent({
          type: 'classify',
          intent: classifyIntent,
          tier,
          reason: classifyReason,
          forest_cache: !!forestCacheHit,
        }))

        const aStream = anthropic.beta.promptCaching.messages.stream({
          model: MODEL_BY_TIER[tier],
          max_tokens: MAX_TOKENS_BY_TIER[tier],
          system: systemBlocks,
          messages,
        })

        let buffer = ''
        let usage: Usage = {}

        for await (const chunk of aStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            buffer += chunk.delta.text
            controller.enqueue(sseEvent({ type: 'chunk', text: chunk.delta.text }))
          } else if (chunk.type === 'message_delta' && chunk.usage) {
            usage = { ...usage, ...chunk.usage }
          } else if (chunk.type === 'message_start' && chunk.message.usage) {
            usage = { ...usage, ...chunk.message.usage }
          }
        }

        const cost = computeCost(tier, usage)

        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: buffer,
          mode,
          model_used: MODEL_BY_TIER[tier],
          tokens_in: usage.input_tokens,
          tokens_out: usage.output_tokens,
          cost_usd: cost,
        })

        controller.enqueue(sseEvent({ type: 'done', usage, cost_usd: cost, tier }))
        controller.close()

        // Sprint G.2 — Refresh history summary tous les SUMMARIZE_REFRESH_EVERY messages
        // newTotal = totalMsgs (avant ce tour) + 2 (user msg + assistant msg)
        const newTotal = totalMsgs + 2
        // refresh quand on franchit un palier de SUMMARIZE_REFRESH_EVERY
        if (newTotal >= SUMMARIZE_THRESHOLD && newTotal % SUMMARIZE_REFRESH_EVERY < 2) {
          // fire & forget — ne bloque pas la réponse
          void refreshHistorySummary(supabase, sessionId, newTotal)
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        controller.enqueue(sseEvent({ type: 'error', error: msg }))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

// ════════════════════════════════════════════════════════════════════
// GET — récupère session + N derniers messages
// ════════════════════════════════════════════════════════════════════
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const session = await getOrCreateSession(supabase, userId)
  const messages = await loadRecentMessages(supabase, session.id, 50)

  return NextResponse.json({
    session,
    messages,
    detected_mode: session.modes_atmospheriques_auto ? detectMode() : 'neutral',
  })
}

// ════════════════════════════════════════════════════════════════════
// PATCH — update presence_name / rythme / modes_atmospheriques_auto
// ════════════════════════════════════════════════════════════════════
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const updates: Record<string, unknown> = {}
  if (typeof body.presence_name === 'string' && body.presence_name.trim()) {
    updates.presence_name = body.presence_name.trim().slice(0, 60)
  }
  if (['silence', 'discret', 'actif', 'nourri'].includes(body.rythme)) {
    updates.rythme = body.rythme
  }
  if (typeof body.modes_atmospheriques_auto === 'boolean') {
    updates.modes_atmospheriques_auto = body.modes_atmospheriques_auto
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'aucun champ valide à mettre à jour' }, { status: 400 })
  }

  const supabase = createServerClient()
  await getOrCreateSession(supabase, userId)

  const { data, error } = await supabase
    .from('chat_sessions')
    .update(updates)
    .eq('user_id', userId)
    .select('id, presence_name, presence_persona, rythme, modes_atmospheriques_auto')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ session: data })
}
