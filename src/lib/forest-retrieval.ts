/**
 * Forest Retrieval — pgvector semantic search over forest_chunks
 *
 * C'est le muscle qui faisait défaut à Dream App : jusqu'ici on lisait juste les
 * METADATA des livres (titre/auteur/tags) sans jamais toucher aux 60 983 chunks
 * embeddings réellement digérés. Cette lib branche enfin le contenu.
 *
 * Un seul point d'entrée :
 *   queryForestChunks(client, queryText, opts) → string formaté pour system prompt
 *
 * Helpers :
 *   embedText(text)                            → vector(1536) via OpenAI
 *   getDreamForestBookIds(client, roles?)      → text[] des livres scopés
 *   formatChunksForPrompt(chunks)              → bloc citable Named Lineage
 */

import OpenAI from 'openai'
import type { SupabaseClient } from '@supabase/supabase-js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export interface ForestChunkMatch {
  id: number
  book_id: string
  book_title: string | null
  book_author: string | null
  book_main_root: string | null
  chunk_text: string
  page_start: number | null
  page_end: number | null
  chunk_index: number
  similarity: number
}

export interface QueryForestChunksOpts {
  /** Restreint la recherche à un sous-ensemble de livres (ex: 65 dream books) */
  bookIds?: string[]
  /** Nombre max de chunks retournés (défaut 8) */
  limit?: number
  /** Seuil minimal de similarité cosine (défaut 0.25 — coupe les faux positifs) */
  minSimilarity?: number
  /** Si true, retourne les chunks bruts au lieu d'un string formaté */
  raw?: boolean
}

/**
 * Embed un texte via OpenAI text-embedding-3-small (1536 dims, multilingue).
 * ~300ms, ~$0.00002 / 1K tokens.
 */
export async function embedText(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // truncate par sécurité (text-embedding-3-small max 8192 tokens)
  })
  return response.data[0].embedding
}

/**
 * Récupère les book_ids du sous-ensemble Dream Forest.
 * Si `roles` est fourni, restreint aux livres ayant ces dream_role(s).
 *
 * Rôles disponibles : protocol, archetype, tradition, interpretation,
 *                     ecology, narrative, lucid, safety, depth
 */
export async function getDreamForestBookIds(
  client: SupabaseClient,
  roles?: string[]
): Promise<string[]> {
  let query = client.from('dream_forest_books').select('book_id')
  if (roles && roles.length > 0) {
    query = query.in('dream_role', roles)
  } else {
    // 🔴 2026-07-26 (Lot 3 flotte A5) : sans filtre de rôle explicite, c'est l'appel T2
    // du fallback (queryForestForModeDetailed) — « Dream Forest entière, tous rôles ».
    // 'internal_only' = livres retirés du routage grand public (Hay/Martel/Odoul, flags
    // éthiques HIGH/MEDIUM victim-blaming + deterministic_causality). Sans ce filtre,
    // le T2 les réinjectait quand même dès que le T1 scopé par rôle était insuffisant —
    // le trou que ce lot devait fermer. Ne PAS retirer sans revalider le routage T2/T3.
    query = query.neq('dream_role', 'internal_only')
  }
  const { data, error } = await query
  if (error || !data) return []
  return data.map((r: { book_id: string }) => r.book_id)
}

/**
 * Recherche sémantique sur forest_chunks via pgvector.
 *
 * @returns Bloc texte formaté pour injection dans system prompt, OU array brut si opts.raw
 */
export async function queryForestChunks(
  client: SupabaseClient,
  queryText: string,
  opts: QueryForestChunksOpts = {}
): Promise<string | ForestChunkMatch[]> {
  const { bookIds, limit = 8, minSimilarity = 0.2, raw = false } = opts

  if (!queryText || queryText.trim().length < 3) {
    return raw ? [] : ''
  }

  let embedding: number[]
  try {
    embedding = await embedText(queryText)
  } catch (err) {
    console.error('[forest-retrieval] embedText failed:', err)
    return raw ? [] : ''
  }

  const { data, error } = await client.rpc('match_forest_chunks', {
    query_embedding: embedding,
    match_count: limit,
    filter_book_ids: bookIds && bookIds.length > 0 ? bookIds : null,
    min_similarity: minSimilarity,
  })

  if (error) {
    console.error('[forest-retrieval] RPC match_forest_chunks failed:', error.message)
    return raw ? [] : ''
  }

  const chunks = (data || []) as ForestChunkMatch[]
  if (raw) return chunks
  return formatChunksForPrompt(chunks)
}

/**
 * Retrieval de haut niveau adapté au mode Dream App.
 *
 * Plus de mode 'forest' — Dream App ne consulte plus la forêt globale comme
 * un mode interne. Le bridge vers foret-app.vercel.app remplace cette fonction
 * (tarification + profondeur séparées côté Forêt App).
 *
 *   dream   → protocol, interpretation, archetype, safety
 *   day     → interpretation, depth, ecology
 *   oracle  → archetype, tradition, narrative
 *   tale    → narrative, tradition, archetype, ecology
 *   ritual  → protocol, lucid, tradition, safety
 *   reentry → protocol, interpretation, lucid, safety
 *   body    → interpretation, ecology, safety
 */
const MODE_TO_ROLES: Record<string, string[]> = {
  dream: ['protocol', 'interpretation', 'archetype', 'safety'],
  day: ['interpretation', 'depth', 'ecology'],
  oracle: ['archetype', 'tradition', 'narrative'],
  tale: ['narrative', 'tradition', 'archetype', 'ecology'],
  ritual: ['protocol', 'lucid', 'tradition', 'safety'],
  reentry: ['protocol', 'interpretation', 'lucid', 'safety'],
  body: ['interpretation', 'ecology', 'safety'],
  // 2026-04-26 — Protocoles guidés (Bible §3.11)
  sidewalk: ['archetype', 'tradition', 'narrative', 'interpretation'],
  reverie: ['interpretation', 'depth', 'archetype', 'narrative'],
  hypnagogie: ['protocol', 'interpretation', 'depth', 'safety'],
  synchronicity: ['archetype', 'tradition', 'narrative', 'interpretation'],
  'felt-sense': ['interpretation', 'ecology', 'safety', 'depth'],
  'journal-evening': ['interpretation', 'depth', 'ecology', 'tradition'],
}

/**
 * Résultat détaillé du retrieval (pour logging + consommation backend).
 *   - text : bloc formaté pour injection dans system prompt
 *   - chunks : les chunks bruts (pour forest_sources / bouton « sources »)
 *   - fallback_level : 0 = scope réussi, 1 = Dream Forest entière, 2 = 299 livres
 *   - avg_similarity : moyenne des similarités retournées
 *   - books_hit : book_ids uniques qui ont répondu
 */
export interface QueryForestForModeResult {
  text: string
  chunks: ForestChunkMatch[]
  fallback_level: 0 | 1 | 2
  avg_similarity: number
  books_hit: string[]
}

/**
 * Retrieval avec FALLBACK 3 tours :
 *   T1 — scope strict du mode (ex: 41 livres dream)
 *   T2 — Dream Forest entière (65 livres tous rôles)
 *   T3 — tous les livres Forest (299)
 *
 * Le fallback se déclenche si :
 *   - T1 retourne < 4 chunks OU avg similarity < 0.35
 *   - T2 même règle → bascule T3
 *
 * Compat : retourne juste le text formaté.
 */
export async function queryForestForMode(
  client: SupabaseClient,
  queryText: string,
  mode: string,
  limit: number = 8
): Promise<string> {
  const res = await queryForestForModeDetailed(client, queryText, mode, limit)
  return res.text
}

export async function queryForestForModeDetailed(
  client: SupabaseClient,
  queryText: string,
  mode: string,
  limit: number = 8,
  userId?: string
): Promise<QueryForestForModeResult> {
  const startTs = Date.now()
  const MIN_CHUNKS = 4
  const QUALITY_THRESHOLD = 0.35

  const roles = MODE_TO_ROLES[mode] ?? MODE_TO_ROLES.dream

  const avg = (arr: ForestChunkMatch[]) =>
    arr.length === 0 ? 0 : arr.reduce((s, c) => s + c.similarity, 0) / arr.length

  // Helper de logging — fire & forget, ne bloque jamais la réponse.
  const logRetrieval = (result: QueryForestForModeResult) => {
    void client
      .from('forest_retrieval_logs')
      .insert({
        user_id: userId ?? null,
        app: 'dream-alpha',
        mode,
        query_preview: queryText.slice(0, 300),
        fallback_level: result.fallback_level,
        avg_similarity: result.avg_similarity,
        chunks_count: result.chunks.length,
        books_hit: result.books_hit,
        roles_requested: roles,
        latency_ms: Date.now() - startTs,
      })
      .then(({ error }) => {
        if (error) console.error('[forest-retrieval] log insert failed:', error.message)
      })
  }

  // ── T1 — scope strict du mode ──
  const scopeBookIds = await getDreamForestBookIds(client, roles)
  let best: ForestChunkMatch[] = []
  if (scopeBookIds.length > 0) {
    const r = await queryForestChunks(client, queryText, {
      bookIds: scopeBookIds,
      limit,
      minSimilarity: 0.2,
      raw: true,
    })
    best = (r as ForestChunkMatch[]) || []

    if (best.length >= MIN_CHUNKS && avg(best) >= QUALITY_THRESHOLD) {
      const out: QueryForestForModeResult = {
        text: formatChunksForPrompt(best),
        chunks: best,
        fallback_level: 0,
        avg_similarity: avg(best),
        books_hit: Array.from(new Set(best.map((c) => c.book_id))),
      }
      logRetrieval(out)
      return out
    }
  }

  // ── T2 — Dream Forest entière ──
  const dreamIds = await getDreamForestBookIds(client)
  if (dreamIds.length > 0) {
    const r = await queryForestChunks(client, queryText, {
      bookIds: dreamIds,
      limit,
      minSimilarity: 0.2,
      raw: true,
    })
    const t2 = (r as ForestChunkMatch[]) || []
    if (t2.length >= MIN_CHUNKS && avg(t2) >= QUALITY_THRESHOLD) {
      const out: QueryForestForModeResult = {
        text: formatChunksForPrompt(t2),
        chunks: t2,
        fallback_level: 1,
        avg_similarity: avg(t2),
        books_hit: Array.from(new Set(t2.map((c) => c.book_id))),
      }
      logRetrieval(out)
      return out
    }
    if (t2.length > best.length) best = t2
  }

  // ── T3 — tous les livres Forest (299) ──
  const r = await queryForestChunks(client, queryText, {
    limit,
    minSimilarity: 0.2,
    raw: true,
  })
  const t3 = (r as ForestChunkMatch[]) || []
  if (t3.length > best.length) best = t3

  const out: QueryForestForModeResult = {
    text: formatChunksForPrompt(best),
    chunks: best,
    fallback_level: 2,
    avg_similarity: avg(best),
    books_hit: Array.from(new Set(best.map((c) => c.book_id))),
  }
  logRetrieval(out)
  return out
}

/**
 * Formate des chunks Forêt en bloc texte injectable dans un system prompt.
 *
 * Format optimisé pour la règle Named Lineage du prompt V4 :
 *   « Tu cites toujours la source et passes au sens — jamais Forêt anonyme. »
 *
 * Chaque chunk apparaît avec :
 *   - 📜 Titre (Auteur), p.X-Y, similarité
 *   - Le passage exact entre guillemets
 *
 * → Sonnet/Opus peut citer fidèlement et nommer la lignée sans halluciner.
 */
export function formatChunksForPrompt(chunks: ForestChunkMatch[]): string {
  if (chunks.length === 0) return ''

  const blocks = chunks.map((c, i) => {
    const author = c.book_author || 'Auteur inconnu'
    const title = c.book_title || c.book_id
    const pages = c.page_start
      ? c.page_end && c.page_end !== c.page_start
        ? `p.${c.page_start}-${c.page_end}`
        : `p.${c.page_start}`
      : ''
    const sim = `${(c.similarity * 100).toFixed(0)}%`
    const cleaned = c.chunk_text.trim().replace(/\s+/g, ' ')
    const excerpt = cleaned.length > 800 ? cleaned.slice(0, 800) + '…' : cleaned

    return `[${i + 1}] 📜 **${title}** — ${author}${pages ? `, ${pages}` : ''} (sim ${sim})\n« ${excerpt} »`
  })

  // Pas de header — le consommateur (ai-router, extract-deep) ajoute son propre
  // label et sa consigne Named Lineage. On retourne juste les blocs numérotés.
  return blocks.join('\n\n')
}
