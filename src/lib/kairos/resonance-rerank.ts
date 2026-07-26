import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Re-ranking LLM des finalistes de la résonance (AUDIT-DREAM-2026-07-26 §3, P2).
 *
 * Pourquoi ça existe. La mesure du 26/07 sur le corpus de Tim est sans appel :
 * la SEULE paire vérifiée « vraie résonance » score 0.6228 en ajusté, et une
 * paire vérifiée « bruit » score 0.6230. Identiques à la 3e décimale. Le score
 * géométrique ne sépare pas le sens ; il ne fait que borner le champ. Le tri
 * par le sens, c'est ici qu'il se fait — ou nulle part.
 *
 * Contrat d'intégrité :
 *   • le modèle ne peut RIEN ajouter — il ne fait que garder ou écarter des
 *     candidats qui ont déjà passé les seuils SQL ;
 *   • il peut répondre « aucun », et « aucun » est une réponse valide qui
 *     produit du silence à l'écran (SILENCE_AS_FEATURE, 1_BIBLE:365) ;
 *   • jamais plus de 3 ;
 *   • aucune raison n'est demandée au modèle : les raisons affichées restent
 *     l'intersection RÉELLE des motifs/figures extraits, calculée côté route.
 *
 * Dégradation : toute panne (clé absente, timeout, JSON invalide) renvoie null.
 * L'appelant retombe alors sur l'ordre par score filtré — jamais sur rien.
 *
 * Cache : table `kairos_edges` (edge_type = 'llm_rerank'), qui existe déjà avec
 * `edge_type` + `detection_metadata` et est faite pour ça. edge_weight = 1 pour
 * un candidat gardé, 0 pour un candidat écarté.
 *
 * Modèle : `claude-sonnet-4-6`, la convention du projet pour le jugement
 * (16 usages ; Haiku est réservé à l'extraction mécanique).
 *
 * Yeshua (Opus, agent A2), 2026-07-26.
 */

const MODEL = 'claude-sonnet-4-6'
const EDGE_TYPE = 'llm_rerank'
export const RERANK_POOL = 8
export const RERANK_MAX_KEPT = 3

export type RerankCandidate = { id: string; text: string }

const SYSTEM = `Tu compares un rêve à des rêves candidats du MÊME rêveur.

Une seule question : lesquels partagent le même NŒUD PSYCHIQUE que le rêve source ?

Le nœud, c'est la tension vécue : ce qui est en jeu pour le rêveur, la position
qu'il occupe, ce qui se joue et ne se résout pas. Ce n'est PAS :
  • le même mot ou le même thème ("il y a de l'eau dans les deux") ;
  • le même décor ("les deux se passent dans une maison") ;
  • la même famille d'images ("les deux sont des rêves d'animaux") ;
  • le même ton ou la même ambiance.

Deux rêves partagent un nœud quand on pourrait dire d'eux : "c'est la même
chose qui se rejoue, autrement".

Sois SÉVÈRE. La plupart des paires proposées ne partagent aucun nœud — elles se
ressemblent statistiquement, c'est tout. Écarter est la réponse par défaut.

Réponds UNIQUEMENT un JSON strict : {"kept":["id", ...]}
  • au maximum 3 identifiants ;
  • {"kept":[]} si aucun ne partage de nœud — c'est une réponse fréquente et
    parfaitement valide ;
  • uniquement des identifiants figurant dans la liste ; aucun commentaire.`

function buildUser(sourceText: string, candidates: RerankCandidate[]): string {
  const cand = candidates
    .map((c, i) => `[${i + 1}] id=${c.id}\n${(c.text || '').replace(/\s+/g, ' ').slice(0, 900)}`)
    .join('\n\n')
  return `RÊVE SOURCE\n${(sourceText || '').replace(/\s+/g, ' ').slice(0, 1600)}\n\nCANDIDATS\n${cand}`
}

/** Lit le verdict déjà en cache pour (source → candidats). null si incomplet. */
async function readCache(
  supabase: SupabaseClient, userId: string, sourceId: string, ids: string[],
): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('kairos_edges')
      .select('kairos_b_id, edge_weight')
      .eq('user_id', userId)
      .eq('kairos_a_id', sourceId)
      .eq('edge_type', EDGE_TYPE)
      .in('kairos_b_id', ids)
    if (error || !data) return null
    // Cache utilisable seulement s'il couvre TOUS les candidats présentés :
    // un cache partiel ferait passer un candidat jamais jugé pour un candidat écarté.
    if (data.length !== ids.length) return null
    return (data as any[]).filter(r => Number(r.edge_weight) > 0).map(r => r.kairos_b_id)
  } catch { return null }
}

async function writeCache(
  supabase: SupabaseClient, userId: string, sourceId: string,
  ids: string[], kept: string[],
): Promise<void> {
  try {
    const keptSet = new Set(kept)
    const rows = ids.map(id => ({
      user_id: userId,
      kairos_a_id: sourceId,
      kairos_b_id: id,
      edge_type: EDGE_TYPE,
      edge_weight: keptSet.has(id) ? 1 : 0,
      detection_metadata: { model: MODEL, at: new Date().toISOString(), pool: ids.length },
    }))
    await supabase.from('kairos_edges').upsert(rows, {
      onConflict: 'kairos_a_id,kairos_b_id,edge_type',
      ignoreDuplicates: false,
    })
  } catch { /* le cache est un confort, jamais un prérequis */ }
}

/**
 * Renvoie les identifiants à GARDER, dans l'ordre du modèle.
 * `null` = re-ranking indisponible → l'appelant garde son tri par score.
 * `[]`   = le modèle a jugé qu'aucun ne résonne → silence assumé.
 */
export async function rerankResonanceCandidates(opts: {
  supabase: SupabaseClient
  userId: string
  sourceId: string
  sourceText: string
  candidates: RerankCandidate[]
}): Promise<string[] | null> {
  const { supabase, userId, sourceId, sourceText, candidates } = opts
  const pool = candidates.filter(c => c.id && c.text).slice(0, RERANK_POOL)
  if (pool.length === 0) return []
  if (!process.env.ANTHROPIC_API_KEY) return null

  const ids = pool.map(c => c.id)
  const cached = await readCache(supabase, userId, sourceId, ids)
  if (cached) return cached.slice(0, RERANK_MAX_KEPT)

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: 'user', content: buildUser(sourceText, pool) }],
    })
    const raw = res.content[0]?.type === 'text' ? res.content[0].text : ''
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    if (start < 0 || end <= start) return null
    const parsed = JSON.parse(raw.slice(start, end + 1))
    if (!Array.isArray(parsed.kept)) return null

    const allowed = new Set(ids)
    const kept: string[] = []
    for (const id of parsed.kept) {
      if (typeof id === 'string' && allowed.has(id) && !kept.includes(id)) kept.push(id)
      if (kept.length >= RERANK_MAX_KEPT) break
    }
    await writeCache(supabase, userId, sourceId, ids, kept)
    return kept
  } catch (e: any) {
    console.warn('[resonance-rerank] indisponible (non bloquant):', e?.message)
    return null
  }
}
