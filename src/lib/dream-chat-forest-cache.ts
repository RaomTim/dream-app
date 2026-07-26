/**
 * Forest Query Cache (Sprint G — §39.2 G.4)
 *
 * Évite de re-embedder + re-RPC une query déjà vue dans les 24h.
 *
 * Workflow :
 *   1. embedText(message) — coûte ~$0.00002, mais surtout ~300ms latence
 *   2. SELECT chunks_data WHERE created_at > now() - 24h ORDER BY embedding <=> queryVec
 *   3. si meilleur hit ≥ 0.95 cosine similarity → cache HIT, on retourne le payload
 *   4. sinon → on laisse le caller faire le retrieval normal et appelle storeForestCache
 *
 * Table backing : forest_query_cache (cf. migration §G.4.SQL)
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { ForestChunkMatch } from './forest-retrieval'

const CACHE_TTL_HOURS = 24
const SIMILARITY_THRESHOLD = 0.95

export interface CacheHit {
  chunks: ForestChunkMatch[]
  text: string
  fallback_level: 0 | 1 | 2
  avg_similarity: number
  hit_similarity: number  // similarité entre la query nouvelle et la query cachée
}

/**
 * Lookup dans le cache : retourne null si pas de hit.
 * NE LANCE PAS l'embedding lui-même — le caller doit fournir queryEmbedding.
 */
export async function lookupForestCache(
  client: SupabaseClient,
  queryEmbedding: number[],
  scope: string = 'dream'
): Promise<CacheHit | null> {
  try {
    const { data, error } = await client.rpc('lookup_forest_query_cache', {
      query_embedding: queryEmbedding,
      query_scope: scope,
      ttl_hours: CACHE_TTL_HOURS,
      min_similarity: SIMILARITY_THRESHOLD,
    })
    if (error) {
      console.warn('[forest-cache] lookup failed:', error.message)
      return null
    }
    if (!data || data.length === 0) return null
    const row = data[0]
    return {
      chunks: (row.chunks_data || []) as ForestChunkMatch[],
      text: row.text_payload || '',
      fallback_level: (row.fallback_level ?? 0) as 0 | 1 | 2,
      avg_similarity: row.avg_similarity_cached ?? 0,
      hit_similarity: row.hit_similarity ?? 0,
    }
  } catch (e) {
    console.warn('[forest-cache] lookup exception:', (e as Error).message)
    return null
  }
}

/**
 * Stocke un retrieval frais dans le cache (fire & forget).
 */
export async function storeForestCache(
  client: SupabaseClient,
  args: {
    queryText: string
    queryEmbedding: number[]
    scope: string
    chunks: ForestChunkMatch[]
    textPayload: string
    fallbackLevel: 0 | 1 | 2
    avgSimilarity: number
  }
): Promise<void> {
  try {
    const { error } = await client.from('forest_query_cache').insert({
      query_text: args.queryText.slice(0, 1000),
      query_embedding: args.queryEmbedding,
      scope: args.scope,
      chunks_data: args.chunks,
      text_payload: args.textPayload,
      fallback_level: args.fallbackLevel,
      avg_similarity_cached: args.avgSimilarity,
    })
    if (error) console.warn('[forest-cache] store failed:', error.message)
  } catch (e) {
    console.warn('[forest-cache] store exception:', (e as Error).message)
  }
}
