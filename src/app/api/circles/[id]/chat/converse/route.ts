/**
 * /api/circles/[id]/chat/converse — Chat IA gardienne du Cercle
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (Cercle avec IA gardienne)
 *        3_TECHNICAL.md §39.6 (routes API circle chat)
 *
 * Endpoints :
 *   POST  /api/circles/[id]/chat/converse  → message user, persist, déclenche IA si triggered
 *   GET   /api/circles/[id]/chat/converse  → 50 derniers messages (RLS via membership)
 *
 * Triggering IA gardienne :
 *   - @<presence_name> du user (sa présence Anima par défaut) OU @Anima
 *   - /forêt /synthèse /intention en début de message
 *   - Détection valence < -0.6 (mots cauchemar/deuil) → exception proactive Sanctuaire
 *
 * Architecture :
 *   - Persiste user message dans circle_chat_messages immédiatement (avec triggered_by_keyword)
 *   - Si triggered → call Anthropic Sonnet streaming SSE + persist as is_ai_gardienne=true
 *   - Si crisis silencieuse → réponse Sanctuaire (pas streaming)
 *   - Pas de DM IA-membre : si user veut parler privé à Anima → /api/dream-chat/converse
 *
 * Privacy : pas de données nominatives, IA s'appuie sur :
 *   - intention(s) actives du cercle (anonymisées par construction — pas de user_id exposé)
 *   - 5 derniers dépôts circle_shares (anonymisés via display_name si fourni)
 *   - 10 derniers messages chat (contexte court)
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const SONNET_MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 1200

// ════════════════════════════════════════════════════════════════════
// VALENCE DETECTION — proactive Sanctuaire si signaux deuil/cauchemar
// ════════════════════════════════════════════════════════════════════
const NEGATIVE_VALENCE_PATTERNS = [
  /\b(cauchemar|cauchemars|terreur nocturne|nuit terrible|épouvante|paralysie du sommeil)\b/i,
  /\b(deuil|deuiller|perdu un proche|enterrement|funérailles|mort de|décès)\b/i,
  /\b(je n'en peux plus|à bout|effondré|effondrée|écrasé|écrasée|trop lourd)\b/i,
  /\b(angoisse|angoissé|angoissée|terreur|panique|tétanisé|tétanisée)\b/i,
  /\b(abandonné|abandonnée|trahi|trahie|seul au monde)\b/i,
]

function detectNegativeValence(text: string): boolean {
  let hits = 0
  for (const re of NEGATIVE_VALENCE_PATTERNS) {
    if (re.test(text)) hits++
    if (hits >= 2) return true
  }
  // Single very strong signal : cauchemar OR deuil suffit
  return /\b(cauchemar|terreur nocturne|deuil profond|effondrée|effondré)\b/i.test(text)
}

const SANCTUAIRE_RESPONSE = `Ce que tu déposes ici est dense — et le cercle n'est pas toujours le lieu pour le tenir seul.
Si tu veux, le Sanctuaire t'accueille en privé pour traverser ça : un espace doux, sans audience, à ton rythme.
Tu peux aussi rester ici, simplement, et laisser le cercle veiller en silence.`

// ════════════════════════════════════════════════════════════════════
// TRIGGER DETECTION — @nom ou /commande
// ════════════════════════════════════════════════════════════════════
type TriggerResult = {
  triggered: boolean
  keyword: string | null
  type: 'mention' | 'command' | null
}

function detectTrigger(text: string, presenceName: string): TriggerResult {
  const trimmed = text.trim()

  // Commands en début de message
  const cmdMatch = trimmed.match(/^\/(forêt|foret|synthèse|synthese|intention)\b/i)
  if (cmdMatch) {
    return { triggered: true, keyword: '/' + cmdMatch[1].toLowerCase(), type: 'command' }
  }

  // @mention du presence_name OU @Anima par défaut
  const escaped = presenceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const mentionRe = new RegExp(`@(${escaped}|Anima)\\b`, 'i')
  const mentionMatch = trimmed.match(mentionRe)
  if (mentionMatch) {
    return { triggered: true, keyword: '@' + mentionMatch[1], type: 'mention' }
  }

  return { triggered: false, keyword: null, type: null }
}

// ════════════════════════════════════════════════════════════════════
// SYSTEM PROMPT — IA gardienne du cercle
// ════════════════════════════════════════════════════════════════════
type CircleContext = {
  circleName: string
  circleType: string
  circleIntentionText: string | null
  activeIntentions: { intention_text: string }[]
  recentShares: { share_type: string; content: string | null; created_at: string }[]
  recentMessages: { content: string; is_ai_gardienne: boolean; created_at: string }[]
  triggeredKeyword: string | null
}

function buildSystemPrompt(ctx: CircleContext): string {
  const intentionsBlock = ctx.activeIntentions.length
    ? ctx.activeIntentions.map((i, idx) => `  ${idx + 1}. « ${i.intention_text} »`).join('\n')
    : '  (aucune intention active déposée)'

  const sharesBlock = ctx.recentShares.length
    ? ctx.recentShares
        .slice(0, 5)
        .map((s, idx) => {
          const preview = (s.content || '').slice(0, 200).replace(/\s+/g, ' ')
          return `  ${idx + 1}. [${s.share_type}] ${preview}`
        })
        .join('\n')
    : '  (aucun dépôt récent)'

  return `Tu es une IA gardienne discrète du cercle « ${ctx.circleName} » (type : ${ctx.circleType}).

POSTURE NON-NÉGOCIABLE :
- Tu es témoin, pas oracle. Tu tiens le cercle, tu ne le diriges pas.
- P-Inversion : le sens vient du cercle, jamais de toi.
- Tu PROPOSES 1-2 angles, jamais une conclusion. Vocabulaire désensorcelé INFUSE.
- Trauma-safe substrat. Tu protèges l'anonymat — tu ne nommes JAMAIS un membre.
- Tu n'es pas thérapeute, pas coach, pas modératrice autoritaire.

VOIX :
- Direct, doux, peu de filler. Pas de "great question". Tutoiement français.
- Phrasé conditionnel : "il semble que", "on pourrait entendre", "certain·es disent".
- Pas d'emoji, pas de markdown lourd. Pas de citations nommées (auteur/livre).
- Réponses courtes (3-6 phrases max sauf si on te demande explicitement plus).

CONTEXTE DU CERCLE :
${ctx.circleIntentionText ? `Intention principale du cercle : « ${ctx.circleIntentionText} »\n` : ''}Intentions actives proposées :
${intentionsBlock}

Dépôts récents (anonymisés) :
${sharesBlock}

DÉCLENCHEUR ACTUEL : ${ctx.triggeredKeyword || '(non explicité)'}
- Si "@<nom>" → réponds comme si on t'invitait dans la conversation, avec retenue.
- Si "/forêt" → propose 1-2 résonances avec ce qui circule dans le cercle (sans citer livre nommé).
- Si "/synthèse" → tisse en 4-6 lignes ce que les dépôts récents portent en commun, sans nommer personne.
- Si "/intention" → invite le cercle à formuler ou affiner une intention partagée.

NE JAMAIS :
- Diagnostiquer (médicalement/psychologiquement).
- Affirmer un sens. Toujours conditionnel.
- Nommer un membre individuellement.
- Proposer une interprétation arrêtée d'un dépôt.
- Promettre des résultats émotionnels.`
}

// ════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════
function sseEvent(data: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
}

async function getPresenceName(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<string> {
  try {
    const { data } = await supabase
      .from('chat_sessions')
      .select('presence_name')
      .eq('user_id', userId)
      .maybeSingle()
    return data?.presence_name || 'Anima'
  } catch {
    return 'Anima'
  }
}

async function checkMembership(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  userId: string
): Promise<boolean> {
  // circle_members.user_id is TEXT (legacy) — compare as string
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

async function loadCircleContext(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  triggeredKeyword: string | null
): Promise<CircleContext> {
  const [circleRes, intentionsRes, sharesRes, messagesRes] = await Promise.all([
    supabase
      .from('circles')
      .select('name, type, intention_text')
      .eq('id', circleId)
      .maybeSingle(),
    supabase
      .from('circle_intentions')
      .select('intention_text')
      .eq('circle_id', circleId)
      .is('archived_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('circle_shares')
      .select('share_type, content, created_at')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('circle_chat_messages')
      .select('content, is_ai_gardienne, created_at')
      .eq('circle_id', circleId)
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  return {
    circleName: circleRes.data?.name || '(cercle sans nom)',
    circleType: circleRes.data?.type || 'spontane',
    circleIntentionText: circleRes.data?.intention_text || null,
    activeIntentions: intentionsRes.data || [],
    recentShares: sharesRes.data || [],
    recentMessages: (messagesRes.data || []).reverse(),
    triggeredKeyword,
  }
}

// ════════════════════════════════════════════════════════════════════
// POST — message user + IA streaming si triggered
// ════════════════════════════════════════════════════════════════════
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => ({}))
  const { message, matter, is_voice, voice_duration_ms, voice_transcript_lang } = body as {
    message?: string
    matter?: string
    is_voice?: boolean
    voice_duration_ms?: number
    voice_transcript_lang?: string
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'message requis' }, { status: 400 })
  }

  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const circleId = params.id

  // 1️⃣ Membership check (RLS fallback safety)
  const isMember = await checkMembership(supabase, circleId, userId)
  if (!isMember) {
    return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
  }

  // 2️⃣ Récupère presence_name pour @mention detection
  const presenceName = await getPresenceName(supabase, userId)

  // 3️⃣ Detect trigger + valence
  const trigger = detectTrigger(message, presenceName)
  const negativeValence = detectNegativeValence(message)
  const validMatters = new Set(['paper', 'stone', 'silk', 'ember', 'linen'])
  const safeMatter = matter && validMatters.has(matter) ? matter : null

  // 4️⃣ Persist user message
  const { data: userMsg, error: insertErr } = await supabase
    .from('circle_chat_messages')
    .insert({
      circle_id: circleId,
      user_id: userId,
      is_ai_gardienne: false,
      content: message.trim(),
      matter: safeMatter,
      triggered_by_keyword: trigger.keyword,
      is_voice: is_voice === true,
      voice_duration_ms:
        Number.isFinite(voice_duration_ms as any) && (voice_duration_ms as number) > 0
          ? Math.min(parseInt(String(voice_duration_ms), 10), 600000)
          : null,
      voice_transcript_lang:
        typeof voice_transcript_lang === 'string' && voice_transcript_lang.length <= 8
          ? voice_transcript_lang
          : null,
    })
    .select('id, created_at')
    .single()

  if (insertErr) {
    console.warn('[circle/chat/converse] insert user message failed:', insertErr.message)
    return NextResponse.json({ error: 'persist failed: ' + insertErr.message }, { status: 500 })
  }

  // 5️⃣ Si valence négative — réponse Sanctuaire silencieuse, pas de streaming
  //    NB: priorité sur trigger normal — la safety prime.
  if (negativeValence) {
    await supabase.from('circle_chat_messages').insert({
      circle_id: circleId,
      user_id: null,
      is_ai_gardienne: true,
      content: SANCTUAIRE_RESPONSE,
      voice_attribution: 'gardienne_sanctuaire',
      reply_to_message_id: userMsg.id,
    }).then(undefined, (e) => console.warn('[circle/chat/converse] sanctuaire insert failed:', e?.message))

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(sseEvent({ type: 'message_persisted', message_id: userMsg.id }))
        controller.enqueue(sseEvent({ type: 'sanctuaire', text: SANCTUAIRE_RESPONSE }))
        controller.enqueue(sseEvent({ type: 'done', reason: 'sanctuaire_silencieux' }))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
    })
  }

  // 6️⃣ Si pas trigger → on persiste juste le message, pas d'IA
  if (!trigger.triggered) {
    return NextResponse.json({
      message_id: userMsg.id,
      created_at: userMsg.created_at,
      ai_called: false,
    })
  }

  // 7️⃣ Charge contexte cercle pour system prompt
  const ctx = await loadCircleContext(supabase, circleId, trigger.keyword)

  // 8️⃣ Build system prompt + messages
  const systemPrompt = buildSystemPrompt(ctx)
  const userPrompt = `Quelqu'un dans le cercle vient de déposer (déclencheur : ${trigger.keyword}) :

« ${message.trim()} »

Réponds depuis ta posture de gardienne — court, juste, conditionnel.`

  // 9️⃣ Stream Anthropic
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(sseEvent({ type: 'message_persisted', message_id: userMsg.id }))
        controller.enqueue(sseEvent({ type: 'trigger', keyword: trigger.keyword, kind: trigger.type }))

        const aStream = anthropic.messages.stream({
          model: SONNET_MODEL,
          max_tokens: MAX_TOKENS,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        })

        let buffer = ''

        for await (const chunk of aStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            buffer += chunk.delta.text
            controller.enqueue(sseEvent({ type: 'chunk', text: chunk.delta.text }))
          }
        }

        // 🔟 Persist assistant message
        await supabase
          .from('circle_chat_messages')
          .insert({
            circle_id: circleId,
            user_id: null,
            is_ai_gardienne: true,
            content: buffer,
            voice_attribution: trigger.type === 'command' ? `gardienne_${trigger.keyword?.replace('/', '')}` : 'gardienne',
            reply_to_message_id: userMsg.id,
          })
          .then(undefined, (e) => console.warn('[circle/chat/converse] ai persist failed:', e?.message))

        controller.enqueue(sseEvent({ type: 'done' }))
        controller.close()
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error'
        console.error('[circle/chat/converse] stream error:', msg)
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
// GET — 50 derniers messages du cercle
// ════════════════════════════════════════════════════════════════════
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const circleId = params.id

  const isMember = await checkMembership(supabase, circleId, userId)
  if (!isMember) {
    return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('circle_chat_messages')
    .select('id, user_id, is_ai_gardienne, content, matter, voice_attribution, triggered_by_keyword, reply_to_message_id, is_voice, voice_duration_ms, voice_transcript_lang, created_at')
    .eq('circle_id', circleId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.warn('[circle/chat/converse GET] failed:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Renvoie chronologique (oldest first)
  return NextResponse.json({ messages: (data || []).reverse() })
}
