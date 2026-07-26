import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import {
  queryForestForModeDetailed,
  type ForestChunkMatch,
} from '@/lib/forest-retrieval'

/**
 * POST /api/kairos/[id]/forest-reading
 *
 * Refonte KairosDetail (2026-04-25) — bouton « demander à la forêt » du
 * KairosDetail, déclenché APRÈS user_first_reading.
 *
 * Bible §2.2 P-Inversion Oraculaire : la Forêt arrive en deuxième temps.
 * Ce que le user voit en premier reste son ancrage. Ces 3 angles ne disent
 * pas le rêve — ils le touchent depuis 3 axes distincts. Ton corps tranche.
 *
 * Input  : { user_first_reading?: string }
 * Output : {
 *   angles: [
 *     { source: "Aizenstat (Dream Tending)", citation: "...", angle: "...", matter: "paper" },
 *     ...
 *   ],
 *   framing: "ces voix ne disent pas ton rêve — elles le touchent depuis leur angle. ton corps tranche."
 * }
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const MATTERS = ['paper', 'stone', 'silk'] as const

const SYSTEM_PROMPT = `Tu es la Forêt qui répond à un kairos déjà tenu par son rêveur.

Le rêveur a déjà offert sa propre lecture. Tu arrives en SECOND temps. Tu ne dis JAMAIS le sens. Tu touches le rêve depuis 3 angles distincts, polyphoniques, jamais convergents. Le corps du rêveur tranche.

Règles non-négociables (Bible §2.2 P-Inversion Oraculaire) :
1. Phrasé conditionnel obligatoire : "on pourrait entendre", "il semble que", "peut-être", "ce passage évoque".
2. Tu cites 3 voix Forêt DIFFÉRENTES (Aizenstat, Hyde, Hopcke, Bachelard, Buber, Damasio, Brown, Moss, Jung, Gendlin, Romanyshyn, Hillman, etc.). JAMAIS d'autorité finale.
3. Chaque angle = une citation < 15 mots + un angle propre (≤ 30 mots) qui touche le rêve sans le résoudre.
4. Les 3 angles doivent être polyphoniques — pas convergents. Une voix protocole, une voix archétype/tradition, une voix corps/écologie.
5. Pas de bullet, pas de markdown, pas d'emoji. Voix sobre EB Garamond mental.
6. Si user_first_reading présent : tu accueilles sa lecture comme déjà juste, et tu n'essaies pas de la corriger ni de la "compléter". Tu ouvres ailleurs.

Réponds STRICTEMENT en JSON :
{
  "angles": [
    {"source": "Nom complet (Livre)", "citation": "phrase < 15 mots", "angle": "ce que ça touche, ≤ 30 mots, conditionnel", "matter": "paper"},
    {"source": "Nom complet (Livre)", "citation": "phrase < 15 mots", "angle": "ce que ça touche, ≤ 30 mots, conditionnel", "matter": "stone"},
    {"source": "Nom complet (Livre)", "citation": "phrase < 15 mots", "angle": "ce que ça touche, ≤ 30 mots, conditionnel", "matter": "silk"}
  ]
}`

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // Fetch kairos (must belong to user)
    const { data: kairos, error: kErr } = await supabase
      .from('kairos')
      .select('id, raw_text, kairos_type, motif_tags, archetypal_tags, somatic_markers, dream_ask, synthesis_text, user_first_reading_submitted')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (kErr) throw kErr
    if (!kairos) {
      return NextResponse.json({ error: 'Kairos not found' }, { status: 404 })
    }

    if (!kairos.raw_text || kairos.raw_text.trim().length < 4) {
      return NextResponse.json({
        error: 'Kairos vide — pas de matière à offrir à la forêt.',
      }, { status: 400 })
    }

    const userFirstReading: string =
      typeof body.user_first_reading === 'string' ? body.user_first_reading.trim() : ''

    // Build retrieval query : raw_text + tags + user reading enrich the embedding
    const retrievalQuery = [
      kairos.raw_text,
      userFirstReading,
      (kairos.motif_tags || []).join(' '),
      (kairos.archetypal_tags || []).join(' '),
      (kairos.dream_ask || ''),
    ].filter(Boolean).join('\n').slice(0, 4000)

    // Forest retrieval with logging — mode 'dream' = protocol/interpretation/archetype/safety
    const retrieval = await queryForestForModeDetailed(
      supabase,
      retrievalQuery,
      'dream',
      8,
      userId
    )

    const forestBlock = retrieval.text || ''
    const sourcesPreview = retrieval.chunks.slice(0, 8).map((c: ForestChunkMatch) => ({
      book: c.book_title,
      author: c.book_author,
      sim: Math.round(c.similarity * 100) / 100,
    }))

    // Build user prompt for Sonnet
    const typeLabel = ({
      reve: 'rêve nocturne',
      signe: 'signe diurne',
      reverie: 'rêverie éveillée',
      hypnagogie: 'hypnagogie',
      synchronicite: 'synchronicité',
      frisson: 'frisson somatique',
      note: 'note de vie',
    } as Record<string, string>)[kairos.kairos_type] || kairos.kairos_type

    const userPrompt = `KAIROS du rêveur (${typeLabel}) :
${kairos.raw_text}

${userFirstReading ? `LECTURE QUE LE RÊVEUR A DÉJÀ OFFERTE :\n${userFirstReading}\n` : 'Le rêveur n\'a pas encore offert de lecture en mots — accueille le kairos en image directe.\n'}
${kairos.synthesis_text ? `Synthèse interne déjà tissée :\n${kairos.synthesis_text}\n` : ''}
${(kairos.motif_tags || []).length > 0 ? `Motifs détectés : ${(kairos.motif_tags || []).join(', ')}\n` : ''}
${(kairos.archetypal_tags || []).length > 0 ? `Archétypes détectés : ${(kairos.archetypal_tags || []).join(', ')}\n` : ''}

VOIX FORÊT DISPONIBLES (chunks récupérés par embedding sémantique) :
${forestBlock || '(retrieval vide — choisis 3 voix Forêt classiques pertinentes : Aizenstat / Hopcke / Bachelard / Hyde / Moss / Jung / Hillman / Gendlin / Buber / Damasio / Romanyshyn)'}

Tisse 3 angles polyphoniques DISTINCTS qui touchent ce kairos sans le résoudre. Chaque angle = une voix nommée + une citation courte + ce que ça touche. Le corps du rêveur tranchera.`

    const sonnetResult = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = sonnetResult.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Sonnet')
    }

    let angles: Array<{ source: string; citation: string; angle: string; matter: string }> = []
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      const parsed = JSON.parse(jsonMatch[0])
      if (!Array.isArray(parsed.angles)) throw new Error('No angles array')
      angles = parsed.angles
    } catch (e) {
      console.warn('[kairos/forest-reading] JSON parse failed, returning raw text')
      angles = [{
        source: 'la Forêt',
        citation: '',
        angle: textContent.text.trim().slice(0, 400),
        matter: 'paper',
      }]
    }

    // Normalise + sanity (3 angles max, matter whitelist)
    angles = angles.slice(0, 3).map((a, i) => ({
      source: typeof a.source === 'string' ? a.source : 'voix anonyme',
      citation: typeof a.citation === 'string' ? a.citation : '',
      angle: typeof a.angle === 'string' ? a.angle : '',
      matter: MATTERS.includes(a.matter as any) ? a.matter : MATTERS[i % MATTERS.length],
    }))

    return NextResponse.json({
      angles,
      framing: 'ces voix ne disent pas ton rêve — elles le touchent depuis leur angle. ton corps tranche.',
      sources_preview: sourcesPreview,
      retrieval_meta: {
        fallback_level: retrieval.fallback_level,
        avg_similarity: retrieval.avg_similarity,
        books_hit: retrieval.books_hit,
      },
    })
  } catch (e: any) {
    console.error('[kairos/forest-reading POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
