import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * POST /api/mvp/resonate — ANIMUS : une note de jour fait remonter les rêves qui résonnent.
 * Body: { text } → top 3 rêves résonants (match_kairos_for_wisdom, cosine sur embedding_semantic).
 * Spec MVP 23/05 §2 (bridging Delaney). Yeshua, 2026-06-11.
 *
 * ── 2026-07-26, agent A2 (AUDIT-DREAM-2026-07-26 §3) ──────────────────────────
 * Même défaut que la route « ce qui résonne » : `match_kairos_for_wisdom` était
 * un top-K NU (aucun seuil), suivi d'un `.slice(0,3)`. La note de jour la plus
 * banale remontait donc toujours 3 rêves, même à similarité de bruit.
 * Désormais : seuil réel côté RPC, plafond 3, PLANCHER 0 — `resonances: []` est
 * une réponse valide et attendue (SILENCE_AS_FEATURE, 1_BIBLE:365).
 */
export const maxDuration = 30

/** plafond, jamais un quota. */
const MAX_RESONANCES = 3

/**
 * Seuil de similarité sémantique. Mesuré sur le corpus réel de Tim au 26/07
 * (64 kairos, 4032 paires, quasi-doublons exclus) : moyenne 0.5856, médiane
 * 0.6099, p90 0.7115, p95 0.7302. À 0.71 on retient le décile supérieur —
 * au-dessous, on est dans le bruit de fond d'un corpus mono-locuteur.
 * Un rêve peut donc légitimement ne rien faire remonter.
 */
const MIN_SIMILARITY = 0.71

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const text = typeof body.text === 'string' ? body.text.trim().slice(0, 3000) : ''
    if (text.length < 5) return corsify(NextResponse.json({ error: 'texte trop court' }, { status: 400 }))

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
    const emb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text.slice(0, 2000) })
    const queryVec = emb.data[0].embedding

    const supabase = createServerClient()
    const { data: matches, error } = await supabase.rpc('match_kairos_for_wisdom', {
      query_embedding: queryVec,
      target_user: userId,
      // on demande un peu large (les note_jour sont filtrées ensuite), mais c'est
      // le seuil — pas le slice — qui décide de ce qui s'affiche.
      match_count: 8,
      min_similarity: MIN_SIMILARITY,
    })
    if (error) {
      console.warn('[mvp.resonate] rpc:', error.message)
      return corsify(NextResponse.json({ resonances: [] }))
    }

    const resonances = (matches || [])
      .filter((m: any) => (m.kairos_type || 'reve') !== 'note_jour')
      .slice(0, MAX_RESONANCES)
      .map((m: any) => ({
        id: m.id,
        title: m.title || null,
        excerpt: (m.raw_text || '').slice(0, 220),
        created_at: m.created_at,
        similarity: typeof m.similarity === 'number' ? Math.round(m.similarity * 100) / 100 : null,
      }))

    return corsify(NextResponse.json({ resonances }))
  } catch (e: any) {
    console.error('[mvp.resonate]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
