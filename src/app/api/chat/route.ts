import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth-server'

export const maxDuration = 60

import {
  chatWithDreamAlphaStream,
  extractEntities,
  extractOracle,
  detectPatterns,
  type AppMode,
} from '@/lib/ai-router'
// 2026-04-20 : generateTale retiré — les contes réels sont servis par
// /api/tales/match (score-based sur sub-forêt contes). Plus de génération IA de conte.
import {
  createServerClient,
  getPersonalForest,
  updatePersonalForest,
} from '@/lib/supabase'
import { queryForestForMode } from '@/lib/forest-retrieval'

/** Encode a single SSE event as a UTF-8 Uint8Array. */
function sseEvent(data: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    messages,
    dreamId,
    mode = 'dream',
    isFirstEntry = false,
    guidedStep,
    protocolId,
    locale = 'fr',
  } = body

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'Messages requis' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // 🔒 2026-04-23 TIER 2 : Bearer auth migration
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error

  const { userId } = auth
  const appMode = mode as AppMode
  const supabase = createServerClient()
  const userMessage = messages[messages.length - 1]

  // === CONTEXTE PARALLÈLE (tout défensif — rien ne doit crasher) ===
  let recentHistory = ''
  let forestContext = ''
  let personalForest = ''

  try {
    // 🔒 FILTRE user_id OBLIGATOIRE — chaque user ne voit QUE ses rêves
    const { data: recentEntries } = await supabase
      .from('dreams')
      .select('title, raw_text, entities, source, tags, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(15)

    if (recentEntries && recentEntries.length > 0) {
      recentHistory = recentEntries
        .map((d) => {
          const date = new Date(d.created_at).toLocaleDateString('fr-FR')
          const type =
            d.source === 'oracle'
              ? '🃏 Oracle'
              : d.source === 'journal'
              ? '📝 Journal'
              : '🌙 Rêve'
          const entities = d.entities ? ` | Entités: ${JSON.stringify(d.entities)}` : ''
          return `[${date}] ${type} — ${d.title || 'Sans titre'}: ${d.raw_text?.substring(0, 300)}${entities}`
        })
        .join('\n\n')
    }
  } catch (e) {
    console.error('Recent history error (non-blocking):', e)
  }

  try {
    // Câblage pgvector 2026-04-20 : chaque mode tire de vrais extraits
    // depuis forest_chunks scopé sur les rôles pertinents du mode.
    forestContext = await queryForestForMode(supabase, userMessage.content, appMode, 6)
  } catch (e) {
    console.error('Forest query error (non-blocking):', e)
  }

  try {
    personalForest = await getPersonalForest(supabase, userId, 20)
  } catch (e) {
    console.error('Personal forest error (non-blocking):', e)
  }

  // === CROSS-PATTERN HINT (étape 7 du protocole rêve) ===
  if (guidedStep === 7 && protocolId === 'reve' && recentHistory) {
    recentHistory = `## INSTRUCTION: CHERCHE ACTIVEMENT des résonances entre ce nouveau rêve et l'historique ci-dessous. Présente les connexions trouvées.\n\n${recentHistory}`
  }

  // === SSE STREAM ===
  const encoder = new TextEncoder()
  let fullResponse = ''

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Get the Anthropic stream from ai-router
        const anthropicStream = chatWithDreamAlphaStream(
          messages,
          appMode,
          recentHistory || undefined,
          forestContext || undefined,
          personalForest || undefined,
          locale
        )

        // Stream chunks to client in real time
        for await (const chunk of anthropicStream) {
          fullResponse += chunk
          controller.enqueue(sseEvent({ type: 'chunk', content: chunk }))
        }

        // === POST-STREAM: parallel extraction + DB saves (non-blocking) ===
        let entities: unknown = null
        let patterns: unknown = null
        let oracleData: unknown = null

        const isLastProtocolStep =
          guidedStep &&
          ((protocolId === 'reve' && guidedStep === 9) ||
            (protocolId === 'jour' && guidedStep === 5) ||
            (protocolId === 'rituel' && guidedStep === 5))

        if ((isFirstEntry || isLastProtocolStep) && userMessage.role === 'user') {
          const fullText = isLastProtocolStep
            ? messages
                .filter((m: { role: string }) => m.role === 'user')
                .map((m: { content: string }) => m.content)
                .join('\n\n')
            : userMessage.content

          if (appMode === 'dream' || appMode === 'day' || appMode === 'ritual') {
            const [e, p] = await Promise.all([
              extractEntities(fullText).catch(() => null),
              recentHistory
                ? detectPatterns(fullText, recentHistory, forestContext || undefined).catch(
                    () => null
                  )
                : Promise.resolve(null),
            ])
            entities = e
            patterns = p
          } else if (appMode === 'oracle') {
            oracleData = await extractOracle(fullText).catch(() => null)
            entities = oracleData
          }

          // Sauvegarder les données extraites
          if (dreamId) {
            const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
            if (entities) updates.entities = entities
            if (patterns) updates.patterns = patterns
            try {
              // 🔒 FIX BRECHE : double filtre id + user_id (pas d'écriture cross-user)
              await supabase
                .from('dreams')
                .update(updates)
                .eq('id', dreamId)
                .eq('user_id', userId)
            } catch (e) {
              console.error(e)
            }
          }

          // Personal forest auto
          if (entities && dreamId) {
            try {
              await updatePersonalForest(supabase, userId, entities, dreamId)
            } catch (e) {
              console.error('Personal forest update error:', e)
            }
          }
        }

        // Sauvegarder les messages
        if (dreamId) {
          try {
            await supabase.from('conversations').insert([
              { dream_id: dreamId, role: 'user', content: userMessage.content, mode: appMode },
              { dream_id: dreamId, role: 'assistant', content: fullResponse, mode: appMode },
            ])
          } catch (e) {
            console.error(e)
          }
        }

        // Send final 'done' event with metadata
        controller.enqueue(
          sseEvent({
            type: 'done',
            metadata: {
              entities,
              patterns,
              oracleData,
            },
          })
        )
      } catch (error: unknown) {
        console.error('Chat stream error:', error)
        const msg =
          error instanceof Error ? error.message : 'Connexion échouée'
        controller.enqueue(
          sseEvent({
            type: 'error',
            message: `Erreur : ${msg}. Réessaie.`,
          })
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      // Required for Vercel edge streaming
      'X-Accel-Buffering': 'no',
    },
  })
}
