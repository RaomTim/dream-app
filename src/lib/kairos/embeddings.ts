/**
 * Embeddings spécialisés pour kairos.
 *
 * 4 vecteurs :
 * - embedding_semantic    (1536d) : texte natif
 * - embedding_concept     (1536d) : concepts LLM-extracted, condensés
 * - embedding_somatic     (768d)  : marqueurs corporels (zones + qualités)
 * - embedding_archetypal  (768d)  : tags archétypaux (anglais pivot)
 *
 * NB : pour les vecteurs 768d, on utilise text-embedding-3-small et on pad/truncate
 * via le paramètre `dimensions` quand il sera disponible. En attendant on appelle
 * text-embedding-3-small (1536) puis on tronque à 768. C'est un compromis V1
 * — le pivot complet (Matryoshka) sera fait V1.5.
 *
 * Auteur: Yeshua, 2026-04-25.
 */

import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

async function embedFull(text: string): Promise<number[] | null> {
  const trimmed = (text || '').trim().slice(0, 8000)
  if (trimmed.length < 3) return null
  try {
    const r = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: trimmed,
    })
    return r.data[0].embedding
  } catch (err) {
    console.error('[embeddings] OpenAI error:', String(err).slice(0, 200))
    return null
  }
}

/**
 * Pour 768d : on pourra utiliser le param `dimensions` d'OpenAI v3 quand stable.
 * En attendant, on tronque à 768 (fonction Matryoshka 3-small native).
 */
async function embedTruncated768(text: string): Promise<number[] | null> {
  const trimmed = (text || '').trim().slice(0, 4000)
  if (trimmed.length < 3) return null
  try {
    const r = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: trimmed,
      dimensions: 768,
    })
    return r.data[0].embedding
  } catch (err) {
    // Fallback : embed full puis truncate
    const full = await embedFull(trimmed)
    return full ? full.slice(0, 768) : null
  }
}

export interface KairosEmbeddings {
  embedding_semantic: number[] | null
  embedding_concept: number[] | null
  embedding_somatic: number[] | null
  embedding_archetypal: number[] | null
}

/**
 * Compute les 4 embeddings en parallèle.
 * Optimisation D6 Tim : les inputs vides → vecteurs null (pas de call inutile).
 */
export async function computeKairosEmbeddings(opts: {
  rawText: string
  conceptsText?: string
  somaticText?: string
  archetypalText?: string
}): Promise<KairosEmbeddings> {
  const { rawText, conceptsText, somaticText, archetypalText } = opts

  const [semantic, concept, somatic, archetypal] = await Promise.all([
    embedFull(rawText),
    conceptsText ? embedFull(conceptsText) : Promise.resolve(null),
    somaticText ? embedTruncated768(somaticText) : Promise.resolve(null),
    archetypalText ? embedTruncated768(archetypalText) : Promise.resolve(null),
  ])

  return {
    embedding_semantic: semantic,
    embedding_concept: concept,
    embedding_somatic: somatic,
    embedding_archetypal: archetypal,
  }
}

/**
 * Helpers pour formater inputs des embeddings spécialisés.
 */
export function formatConceptsForEmbed(extraction: {
  concepts_for_embed?: string[]
  motif_tags?: string[]
  metaphors_extrapolated?: string[]
}): string {
  const parts: string[] = []
  if (extraction.concepts_for_embed?.length) parts.push(extraction.concepts_for_embed.join(' '))
  if (extraction.motif_tags?.length) parts.push(extraction.motif_tags.join(' '))
  if (extraction.metaphors_extrapolated?.length) parts.push(extraction.metaphors_extrapolated.join(' '))
  return parts.join(' ').trim()
}

export function formatSomaticForEmbed(extraction: {
  somatic_markers?: Record<string, any>
}): string {
  if (!extraction.somatic_markers) return ''
  const entries = Object.entries(extraction.somatic_markers)
  if (entries.length === 0) return ''
  return entries
    .map(([zone, m]) => {
      if (typeof m === 'object' && m !== null) {
        return `${zone} ${m.quality || ''} intensity_${m.intensity ?? ''}`
      }
      return `${zone} ${m}`
    })
    .join(' ')
    .trim()
}

export function formatArchetypalForEmbed(extraction: {
  archetypal_tags?: string[]
  figures?: any[]
}): string {
  const parts: string[] = []
  if (extraction.archetypal_tags?.length) parts.push(extraction.archetypal_tags.join(' '))
  if (extraction.figures?.length) {
    const types = extraction.figures.map((f: any) => f.type).filter(Boolean)
    if (types.length) parts.push(types.join(' '))
  }
  return parts.join(' ').trim()
}
