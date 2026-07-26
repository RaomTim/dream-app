import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/great-dreams/consult — la consultation à DOUBLE LECTURE.
 * Réf : TAXONOMIE-GRANDS-REVES.md §4 · VISION-CHANT-DU-COEUR-2026-07-13.md §2.
 *
 * Le rêveur dépose une difficulté du moment (un « chant du cœur »). L'app rend
 * deux lectures SÉPARÉES, jamais fusionnées :
 *   A. ses grands rêves (ceux qu'il a lui-même marqués)
 *   B. le reste du corpus (rêves + kaïros), sans filtre de grandeur
 *
 * ── LE CRITÈRE D'ACCEPTATION (Tim, verbatim) ────────────────────────────
 * « il faudrait juste que l'IA soit vraiment bonne à ne pas me ramener du bruit
 *   mais du contenu de très haute qualité pour me soutenir. »
 * Traduit : mieux vaut 1 rêve juste que 4 rêves plausibles. ZÉRO est une réponse
 * valide (1_BIBLE.md SILENCE_AS_FEATURE). D'où : rappel large par embedding,
 * puis coupe franche par re-ranking LLM avec droit au silence.
 *
 * ── LA LIGNE À NE PAS FRANCHIR ──────────────────────────────────────────
 * L'app RAMÈNE le rêve, elle ne le TRADUIT pas. Aucune interprétation, aucun
 * rapprochement énoncé, aucune psychologisation, aucune question d'orientation.
 * (safety-checks.json red lines 5 & 6 ; 1_BIBLE.md §2.2 P-Inversion.)
 *
 * Yeshua (Opus, A3), 2026-07-26.
 */

export const maxDuration = 60

const MODEL_RERANK = 'claude-sonnet-4-6'
/** 1_BIBLE.md §3.1.ter — « pas d'illimitisme » : préserver le rituel. */
const MAX_CONSULT_PER_DAY = 3
/** Rappel large : on ratisse, la coupe est faite par le LLM ensuite. */
const RECALL_LIMIT = 10
const MIN_SIM = 0.05
/** Ce que le LLM doit atteindre pour qu'un rêve soit montré. Sur 5. */
const KEEP_THRESHOLD = 3
const MAX_KEPT_PER_READING = 3
const DREAM_CHARS = 2500

const RERANK_SYSTEM = `Tu tries des rêves. Tu ne les interprètes JAMAIS.

Un rêveur traverse une difficulté. On te donne sa situation, puis une liste de ses propres rêves et moments notés. Tu dis lesquels valent d'être relus MAINTENANT, à côté de cette situation — et lesquels ne valent pas.

## Ta seule question pour chaque rêve
« Si cette personne relisait ce rêve ce soir avec sa difficulté en tête, est-ce que quelque chose se passerait ? »
Pas « est-ce que le sujet est proche ». Un rêve peut parler du même sujet et n'apporter rien ; un rêve sans rapport apparent peut porter exactement la même tension.

## La barre est HAUTE
Le rêveur a dit : ne me ramène pas du bruit, ramène-moi du contenu de très haute qualité qui me soutienne.
- Mieux vaut rendre 1 rêve juste que 4 rêves plausibles.
- **Rendre une liste VIDE est une bonne réponse** quand rien ne touche vraiment. C'est attendu, ce n'est pas un échec. Ne remplis jamais pour remplir.
- Ne retiens jamais un rêve juste parce qu'il est le « moins pire » du lot.

## Le corpus est du brut de dictée — attention
Ces textes sont des transcriptions vocales au réveil. Ils contiennent :
- du cadrage à ignorer : « Journal de rêve, 13 janvier », « j'ai pas pris le réflexe de les enregistrer », « je viens de passer dix minutes à raconter mon rêve mais ça n'a pas enregistré », « bon déjà j'ai bien dormi » ;
- de la transcription fautive (mots déformés, phrases coupées) ;
- parfois PLUSIEURS rêves différents dans une même entrée.
Juge uniquement la MATIÈRE ONIRIQUE. Ne compte jamais le bavardage de cadrage comme du contenu. Si une entrée contient plusieurs rêves, juge celui qui touche, et cite-le lui.

## Interdits absolus dans ta raison
- Dire ce que le rêve VEUT DIRE, ou ce qu'il dit de la situation.
- Faire le lien à la place du rêveur : pas de « ce qui fait écho à », « cela symbolise », « ton inconscient », « c'est-à-dire », « comme ta relation ».
- Parler du rêveur : pas de « tu es en évitement », « tu as peur de », « tu cherches ».
- Rassurer, prédire, conseiller, poser une question.

## Ce que ta raison DOIT être
Une phrase courte et FACTUELLE : ce qu'il y a DANS le rêve. Rien de plus. Le rêveur fait le rapprochement lui-même — c'est tout l'intérêt.
- BIEN : « Une école, une course contre la montre pour retrouver quelqu'un, et la porte reste fermée. »
- BIEN : « Un maître aveugle qui guide quand même le bateau. »
- MAL : « Ce rêve montre que tu cherches ta place. » (interprétation)
- MAL : « L'école fait écho à ton sentiment de ne pas être à la hauteur. » (rapprochement énoncé)

## Notation
5 = touche la situation en plein, le rêveur va le sentir immédiatement
4 = touche vraiment
3 = touche assez pour valoir la relecture (la barre)
2 = thème voisin, mais rien ne se passerait
1 = aucun rapport réel

Ne rends QUE les rêves à 3 ou plus. Maximum 3.

Réponds STRICTEMENT en JSON, sans texte autour :
{"kept":[{"id":"<uuid exact>","score":<1-5>,"reason":"<une phrase factuelle>"}]}
Aucun rêve à la hauteur → {"kept":[]}`

function buildCandidateBlock(rows: any[]): string {
  return rows
    .map((r, i) => {
      const date = r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '?'
      const body = (r.raw_text || '').replace(/\s+/g, ' ').trim()
      const truncated = body.length > DREAM_CHARS
      const lines = [
        `### ${i + 1}. id=${r.id}`,
        `Type : ${r.kairos_type || 'reve'} · Rêvé le ${date}`,
      ]
      if (r.title) lines.push(`Titre : ${r.title}`)
      // La note du rêveur pèse plus que le récit : c'est déjà de l'interprétation vécue.
      if (r.great_dream_note) lines.push(`>> Ce que le rêveur en dit lui-même : « ${r.great_dream_note} »`)
      if (Array.isArray(r.great_dream_facets) && r.great_dream_facets.length) {
        const lbl: Record<string, string> = {
          change: "ça l'a changé",
          force: 'ça lui donne de la force',
          ouvert: "il n'a pas fini de le comprendre",
        }
        lines.push(`>> Il a marqué ce rêve : ${r.great_dream_facets.map((f: string) => lbl[f] || f).join(' · ')}`)
      }
      lines.push(`Texte : ${body.slice(0, DREAM_CHARS)}${truncated ? ' […]' : ''}`)
      return lines.join('\n')
    })
    .join('\n\n')
}

async function rerank(
  anthropic: Anthropic,
  situation: string,
  rows: any[],
  readingLabel: string
): Promise<{ id: string; score: number; reason: string }[]> {
  if (!rows.length) return []

  const userMsg = `## La situation que traverse le rêveur, dans ses mots
« ${situation} »

## ${readingLabel} (${rows.length})

${buildCandidateBlock(rows)}

Lesquels valent d'être relus ce soir à côté de cette situation ? Rappelle-toi : la liste vide est une bonne réponse.`

  const res = await anthropic.messages.create({
    model: MODEL_RERANK,
    max_tokens: 1200,
    temperature: 0.2, // on trie, on ne crée pas
    system: RERANK_SYSTEM,
    messages: [{ role: 'user', content: userMsg }],
  })

  const raw = res.content.find((c: any) => c.type === 'text')
  const text = raw && raw.type === 'text' ? raw.text : ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) {
    console.warn('[great-dreams.consult] rerank: pas de JSON —', text.slice(0, 200))
    return []
  }
  let parsed: any
  try {
    parsed = JSON.parse(match[0])
  } catch {
    console.warn('[great-dreams.consult] rerank: JSON illisible')
    return []
  }

  const valid = new Set(rows.map(r => r.id))
  return (Array.isArray(parsed.kept) ? parsed.kept : [])
    .filter((k: any) => k && valid.has(k.id) && typeof k.score === 'number' && k.score >= KEEP_THRESHOLD)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, MAX_KEPT_PER_READING)
    .map((k: any) => ({ id: String(k.id), score: k.score, reason: String(k.reason || '').trim() }))
}

/** Recolle les métadonnées d'affichage sur ce que le LLM a retenu. */
function hydrate(kept: { id: string; score: number; reason: string }[], rows: any[]) {
  const by = new Map(rows.map(r => [r.id, r]))
  return kept.map(k => {
    const r = by.get(k.id)
    return {
      id: k.id,
      reason: k.reason,
      score: k.score,
      title: r?.title ?? null,
      excerpt: (r?.raw_text || '').replace(/\s+/g, ' ').trim().slice(0, 240),
      kairos_type: r?.kairos_type ?? 'reve',
      created_at: r?.created_at ?? null,
      marked_great_at: r?.marked_great_at ?? null,
      facets: r?.great_dream_facets ?? [],
      note: r?.great_dream_note ?? null,
      similarity: typeof r?.similarity === 'number' ? Math.round(r.similarity * 100) / 100 : null,
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const situation = typeof body.text === 'string' ? body.text.trim().slice(0, 2000) : ''
    if (situation.length < 10) {
      return NextResponse.json({ error: 'situation trop courte' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Cadence — 1_BIBLE §3.1.ter. Volontairement souple : on informe, on ne punit pas.
    const since = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const { count } = await supabase
      .from('great_dream_consultations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', since)
    if ((count ?? 0) >= MAX_CONSULT_PER_DAY) {
      return NextResponse.json({
        rate_limited: true,
        reading_great: [],
        reading_all: [],
        silence: true,
      })
    }

    // 1 — l'embedding de la situation (même modèle que le reste de l'app)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
    const emb = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: situation,
    })
    const vec = emb.data[0].embedding

    // 2 — RAPPEL LARGE, deux passes séparées. Pas de tri fin ici : le cosinus ne
    //     sépare pas le signal du bruit sur ce corpus (§4.2).
    const [greatRes, allRes] = await Promise.all([
      supabase.rpc('find_great_dreams_for_situation', {
        p_user_id: userId, p_embedding: vec, p_scope: 'great',
        p_limit: RECALL_LIMIT, p_min_sim: MIN_SIM, p_exclude_great: false,
      }),
      supabase.rpc('find_great_dreams_for_situation', {
        p_user_id: userId, p_embedding: vec, p_scope: 'all',
        p_limit: RECALL_LIMIT, p_min_sim: MIN_SIM, p_exclude_great: true,
      }),
    ])
    if (greatRes.error) throw greatRes.error
    if (allRes.error) throw allRes.error

    const greatRows = (greatRes.data || [])
    // Lecture B : on ne ramène pas une note de jour comme « rêve » — mais on garde
    // les kaïros (signes, frissons, synchronicités), Tim les veut explicitement.
    const allRows = (allRes.data || [])

    // 3 — COUPE. Les deux lectures sont jugées SÉPARÉMENT : la barre d'un grand
    //     rêve n'est pas celle du corpus, et fusionner diluerait la décision du rêveur.
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const [keptGreat, keptAll] = await Promise.all([
      rerank(anthropic, situation, greatRows, 'Les rêves que le rêveur a lui-même marqués comme grands'),
      rerank(anthropic, situation, allRows, 'Ses autres rêves et moments notés'),
    ])

    const readingGreat = hydrate(keptGreat, greatRows)
    const readingAll = hydrate(keptAll, allRows)

    // 4 — mémoire (pas un flag : la cadence + la relecture d'une consultation passée)
    const { data: saved } = await supabase
      .from('great_dream_consultations')
      .insert({
        user_id: userId,
        situation_text: situation,
        reading_great: readingGreat,
        reading_all: readingAll,
      })
      .select('id')
      .maybeSingle()

    return NextResponse.json({
      id: saved?.id ?? null,
      situation,
      reading_great: readingGreat,
      reading_all: readingAll,
      // Le silence est une RÉPONSE, pas une erreur — l'UI doit le dire ainsi.
      silence: readingGreat.length === 0 && readingAll.length === 0,
      // Diagnostic (jamais affiché) : combien de candidats ont été écartés.
      examined: { great: greatRows.length, all: allRows.length },
    })
  } catch (e: any) {
    console.error('[great-dreams.consult]', e)
    return NextResponse.json({ error: e.message || 'failed' }, { status: 500 })
  }
}
