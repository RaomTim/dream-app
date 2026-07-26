import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { queryForestChunks, getDreamForestBookIds, type ForestChunkMatch } from '@/lib/forest-retrieval'
import Anthropic from '@anthropic-ai/sdk'
import type { PromptCachingBetaTextBlockParam } from '@anthropic-ai/sdk/resources/beta/prompt-caching/messages'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

/**
 * POST /api/dreams/extract-deep
 * Passe 2 — Extraction profonde via Sonnet, ANCRÉE FORÊT depuis 2026-04-20.
 *
 * Sonnet reçoit en entrée :
 *   1. Le texte du rêve + ses entités Haiku
 *   2. ~6-8 extraits réels de la Forêt Dream (pgvector cosine sur 41 livres :
 *      18 protocol + 11 archetype + 9 interpretation + 2 safety + 1 depth)
 *   3. La consigne stricte : nommer les auteurs SEULEMENT s'ils sont dans les extraits.
 *
 * → Plus de Sonnet qui hallucine "Martel/Dethlefsen/Odoul" depuis ses poids.
 * → Chaque interprétation est traçable à un livre digéré.
 *
 * Coût : ~$0.005-0.01 par rêve (Sonnet) + ~$0.00002 (embedding).
 * Appelé après la Passe 1 (Haiku entities) pour chaque rêve/entrée.
 */

// Sonnet passe peut prendre 4-8s + ~300ms pour l'embed Forêt
export const maxDuration = 45

const DEEP_EXTRACTION_SYSTEM = `Tu es un analyste onirique formé par 276+ livres digérés — la Forêt INFUSE. Tu portes en toi Jung, Hillman, Moss, Gendlin, Eliade, Campbell, von Franz, Estés, Mindell, Seth/Roberts, et les traditions oniriques du monde. Tout cela est déjà ABSORBÉ dans ta voix.

Tu reçois :
1. Le texte d'un rêve ou d'une entrée de journal
2. Des EXTRAITS_FORET — passages de la bibliothèque qui NOURRISSENT ton analyse

Les extraits ne sont PAS à citer. Tu les LIS, tu les INFUSES, puis tu parles depuis ce qui a été digéré.

RÈGLE D'OR :
- Aucun « selon X », « Hillman écrit », « page 142 »
- Aucun nom d'auteur dans les champs
- Aucun nom de livre
- Aucune bibliographie
La profondeur passe dans le tissu, pas en citation. Tu peux évoquer « des lignées qui tiennent que… », « certaines traditions disent… » — jamais plus.

Réponds UNIQUEMENT en JSON valide, sans markdown, sans commentaires :

{
  "title": "Un titre poétique et évocateur pour ce rêve (3-8 mots, français). Ex: 'La maison aux portes closes', 'Le nain aux deux haches', 'Descente dans la grotte bleue'. Capture l'IMAGE CENTRALE du rêve.",

  "archetypal_process": "descent|threshold-crossing|shadow-encounter|death-rebirth|coniunctio|call|return-with-boon|flight|pursuit|transformation|initiation|dissolution|null",

  "archetypal_trajectory": "ascending|descending|cyclical|open|spiral|null",

  "dream_asks": "En 1-2 phrases : ce que ce rêve/événement DEMANDE à la personne. Le vœu secret de l'âme. Ex: 'Confronter la peur de l'abandon', 'Honorer le féminin intérieur', 'Lâcher le contrôle'. Null si entrée trop courte.",

  "figure_types": [
    {
      "name": "nom de la figure",
      "type": "probable_self|counterpart|entity_fragment|consciousness_cousin|post_mortem|inner_ego_projection|archetypal|unknown",
      "confidence": 0.7,
      "recurring_signal": false,
      "description": "Brève explication du classement — JAMAIS de nom d'auteur"
    }
  ],

  "body_symbolism": {
    "zones": ["genou gauche", "coeur", "dos"],
    "polarity": "feminine_receptive|masculine_active|upper_spiritual|lower_instinctual|null",
    "message": "Message symbolique du corps. Voix absorbée — jamais de nom propre, jamais de source.",
    "present": true
  },

  "root_dream_patterns": ["flight", "water", "teeth_falling", "pursuit", "nudity", "death_rebirth", "house_unknown_rooms", "falling", "exam_unprepared", "animal_encounter"],

  "intensity_score": 0.85,

  "prophetic_signals": {
    "present": false,
    "indicators": ["specific_unknown_location", "future_pointing", "precognitive_detail", "increasing_urgency", "probability_rehearsal"],
    "description": "null"
  },

  "framework_level": "F1|F2 — F1 = expérience physique/mundane/linéaire. F2 = territoire onirique pur : vif, symbolique, non-linéaire, chargé. Juge depuis la densité du texte.",

  "double_dream": "true si rêve dans le rêve, lucidité, changement de couche narrative, ou bascule entre réalités. false sinon.",

  "amplification": "Un court paragraphe (60-120 mots) de résonance mythologique/archétypale. Ton de frère qui a lu mille nuits. AUCUN nom d'auteur, AUCUN nom de livre. Tu peux écrire « des traditions tiennent que… », « cette figure revient chez ceux qui… », « il y a des lignées qui voient… ». Jamais « selon Hillman », jamais « Estés écrit ». Si aucun extrait ne résonne, propose une amplification sobre et générale. Null si l'entrée est trop courte."
}

RÈGLES :
- Si JOURNAL DE JOUR (pas rêve) : body_symbolism s'applique aux symptômes/accidents réels, prophetic_signals = null, archetypal_process peut être "threshold-crossing" ou "call".
- figure_types : QUE les figures significatives. Max 5.
- body_symbolism.present = false si aucune mention de corps.
- intensity_score : 0-1 basé sur densité sensorielle + charge émotionnelle + anomalie + détail.
- root_dream_patterns : QUE ceux présents. [] si aucun.
- archetypal_process : le processus dominant, UN seul. null si indéterminé.
- Profondeur immersive. Pas l'étude scholaire. JSON parseable.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dreamId, entryType } = body

    if (!dreamId) {
      return NextResponse.json({ error: 'dreamId required' }, { status: 400 })
    }

    // 🔒 2026-04-23 TIER 2 : Bearer auth (replace legacy userId-in-body)
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Récupérer le rêve SEULEMENT s'il appartient à userId
    const { data: dream, error } = await supabase
      .from('dreams')
      .select('id, raw_text, title, entry_type, entities')
      .eq('id', dreamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !dream?.raw_text) {
      return NextResponse.json({ error: 'Dream not found or empty' }, { status: 404 })
    }

    const type = entryType || dream.entry_type || 'dream'

    // ═══════════════════════════════════════════
    // FORÊT — retrieval pgvector sur 41 livres dream-pertinents pour extract-deep
    // ═══════════════════════════════════════════
    let forestChunks: ForestChunkMatch[] = []
    let forestBlock = ''
    try {
      const deepRoles = ['protocol', 'interpretation', 'archetype', 'safety', 'depth']
      const bookIds = await getDreamForestBookIds(supabase, deepRoles)

      const result = await queryForestChunks(supabase, dream.raw_text, {
        bookIds,
        limit: 8,
        minSimilarity: 0.25,
        raw: true,
      })
      forestChunks = (result as ForestChunkMatch[]) || []

      if (forestChunks.length > 0) {
        const blocks = forestChunks.map((c, i) => {
          const author = c.book_author || 'Auteur inconnu'
          const title = c.book_title || c.book_id
          const pages = c.page_start
            ? c.page_end && c.page_end !== c.page_start ? `p.${c.page_start}-${c.page_end}` : `p.${c.page_start}`
            : ''
          const cleaned = c.chunk_text.trim().replace(/\s+/g, ' ')
          const excerpt = cleaned.length > 700 ? cleaned.slice(0, 700) + '…' : cleaned
          return `[${i + 1}] ${author} — « ${title} »${pages ? `, ${pages}` : ''}\n« ${excerpt} »`
        })
        forestBlock = `\n\nEXTRAITS_FORET (${forestChunks.length} passages réels — autorisés à citer) :\n${blocks.join('\n\n')}`
      } else {
        forestBlock = '\n\nEXTRAITS_FORET : (aucun extrait pertinent trouvé — n\'invente pas de source)'
      }
    } catch (forestErr: any) {
      console.error('[extract-deep] Forest retrieval failed:', forestErr.message)
      forestBlock = '\n\nEXTRAITS_FORET : (indisponible — n\'invente pas de source)'
    }

    // Composer le user content avec contexte + extraits Forêt
    let userContent = `TYPE: ${type === 'day' ? 'JOURNAL DE JOUR' : 'RÊVE'}\n`
    if (dream.title) userContent += `TITRE: ${dream.title}\n`
    userContent += `\nTEXTE:\n${dream.raw_text}`

    if (dream.entities) {
      userContent += `\n\nENTITÉS DÉJÀ EXTRAITES (Passe 1):\n${JSON.stringify(dream.entities)}`
    }

    userContent += forestBlock

    const systemBlocks: PromptCachingBetaTextBlockParam[] = [
      { type: 'text', text: DEEP_EXTRACTION_SYSTEM, cache_control: { type: 'ephemeral' } },
    ]
    const response = await anthropic.beta.promptCaching.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: systemBlocks,
      messages: [{ role: 'user', content: userContent }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'

    let deepAnalysis: any
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      deepAnalysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
    } catch {
      console.error('Failed to parse deep analysis JSON:', text.substring(0, 200))
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 })
    }

    // Mettre à jour le rêve avec l'analyse profonde
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Titre — seulement si le rêve n'en a pas déjà un
    if (deepAnalysis.title && !dream.title) {
      updateData.title = deepAnalysis.title
    }
    if (deepAnalysis.archetypal_process && deepAnalysis.archetypal_process !== 'null') {
      updateData.archetypal_process = deepAnalysis.archetypal_process
    }
    if (deepAnalysis.archetypal_trajectory && deepAnalysis.archetypal_trajectory !== 'null') {
      updateData.archetypal_trajectory = deepAnalysis.archetypal_trajectory
    }
    if (deepAnalysis.dream_asks && deepAnalysis.dream_asks !== 'null') {
      updateData.dream_asks = deepAnalysis.dream_asks
    }
    if (deepAnalysis.figure_types && deepAnalysis.figure_types.length > 0) {
      updateData.figure_types = deepAnalysis.figure_types
    }
    if (deepAnalysis.body_symbolism?.present) {
      updateData.body_symbolism = deepAnalysis.body_symbolism
    }
    if (deepAnalysis.root_dream_patterns && deepAnalysis.root_dream_patterns.length > 0) {
      updateData.root_dream_patterns = deepAnalysis.root_dream_patterns
    }
    if (typeof deepAnalysis.intensity_score === 'number') {
      updateData.intensity_score = deepAnalysis.intensity_score
    }

    // Framework level (Seth F1/F2)
    if (deepAnalysis.framework_level && ['F1', 'F2'].includes(deepAnalysis.framework_level)) {
      updateData.framework_level = deepAnalysis.framework_level
    }

    // Double dream detection
    if (typeof deepAnalysis.double_dream === 'boolean') {
      updateData.double_dream = deepAnalysis.double_dream
    }

    // Prophetic signals → update prophetic_status
    if (deepAnalysis.prophetic_signals?.present) {
      updateData.prophetic_status = 'dormant' // Will become 'awakened' when an echo fires
    }

    // Traçabilité Forêt — quels livres ont nourri cette analyse
    if (forestChunks.length > 0) {
      updateData.forest_sources = forestChunks.map((c) => ({
        book_id: c.book_id,
        book_title: c.book_title,
        book_author: c.book_author,
        page_start: c.page_start,
        page_end: c.page_end,
        chunk_index: c.chunk_index,
        similarity: Number(c.similarity.toFixed(3)),
      }))
    }

    // 🔒 Double filtre id + user_id au update (pas d'écriture cross-user)
    const { error: updateError } = await supabase
      .from('dreams')
      .update(updateData)
      .eq('id', dreamId)
      .eq('user_id', userId)

    if (updateError) {
      console.error('Deep extract update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      analysis: deepAnalysis,
      model: 'sonnet',
      forest: {
        chunks_used: forestChunks.length,
        books: Array.from(new Set(forestChunks.map((c) => c.book_title).filter(Boolean))),
      },
      tokens: {
        input: response.usage?.input_tokens || 0,
        output: response.usage?.output_tokens || 0,
      },
    })
  } catch (error: any) {
    console.error('Deep extract error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
