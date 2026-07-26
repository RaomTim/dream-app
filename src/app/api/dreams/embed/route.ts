import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import OpenAI from 'openai'
import { requireAuth } from '@/lib/auth-server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

// Embedding rapide (~300ms) mais garde du slack pour retries réseau
export const maxDuration = 15

/**
 * POST /api/dreams/embed
 * Passe 3 — Génère un embedding multilingue pour un rêve/entrée.
 * Utilise OpenAI text-embedding-3-small (1536 dims, multilingue natif).
 * Coût : ~$0.00002 / 1K tokens = quasi gratuit.
 *
 * L'embedding permet :
 * - Échos prophétiques (pgvector cosine similarity sans limite temporelle)
 * - Croisement multilingue (FR/EN/ES/... dans le même espace vectoriel)
 * - Logique associative (incendie ≈ noyade si même charge émotionnelle)
 * - Échos inverses (fuite ↔ poursuite détectés sémantiquement)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dreamId } = body

    if (!dreamId) {
      return NextResponse.json({ error: 'dreamId required' }, { status: 400 })
    }

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Récupérer le rêve SEULEMENT s'il appartient à userId
    const { data: dream, error } = await supabase
      .from('dreams')
      .select('id, raw_text, title, entry_type, dream_asks, soul_wish, archetypal_process')
      .eq('id', dreamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !dream?.raw_text) {
      return NextResponse.json({ error: 'Dream not found or empty' }, { status: 404 })
    }

    // Composer le texte à embedder — enrichi avec les métadonnées profondes
    // L'embedding capture le SENS complet, pas juste les mots du récit
    let textToEmbed = dream.raw_text

    if (dream.title) {
      textToEmbed = `${dream.title}. ${textToEmbed}`
    }

    if (dream.archetypal_process) {
      textToEmbed += `\nProcessus archétypal : ${dream.archetypal_process}`
    }

    if (dream.dream_asks) {
      textToEmbed += `\nCe que le rêve demande : ${dream.dream_asks}`
    }

    if (dream.soul_wish) {
      textToEmbed += `\nVoeu de l'âme : ${dream.soul_wish}`
    }

    // Générer l'embedding multilingue
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: textToEmbed,
    })

    const embedding = embeddingResponse.data[0].embedding

    // Stocker dans pgvector
    // On utilise une requête SQL directe pour le type vector
    const { error: updateError } = await supabase.rpc('update_dream_embedding', {
      p_dream_id: dreamId,
      p_embedding: JSON.stringify(embedding),
    })

    // Fallback : si la RPC n'existe pas, on fait un raw update
    if (updateError) {
      // 🔒 Double filtre id + user_id au update (pas d'écriture cross-user)
      const { error: rawError } = await supabase
        .from('dreams')
        .update({
          embedding: JSON.stringify(embedding),
          updated_at: new Date().toISOString(),
        })
        .eq('id', dreamId)
        .eq('user_id', userId)

      if (rawError) {
        console.error('Embed update error:', rawError)
        return NextResponse.json({ error: rawError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      ok: true,
      dimensions: embedding.length,
      tokens_used: embeddingResponse.usage?.total_tokens || 0,
    })
  } catch (error: any) {
    console.error('Embed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
