import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'
import { queryForestForMode } from '@/lib/forest-retrieval'
import { reqLang, asLang } from '@/lib/req-lang'

/**
 * POST /api/protocoles/sonnet-step
 *
 * Pour V1 : enrichissement OPTIONNEL de la question N+1 d'un protocole.
 * Le catalogue (`protocoles-catalog.jsx`) tient des questions pré-écrites
 * fidèles à la source Forêt. Sonnet n'est appelé QUE si l'UI demande
 * une reformulation contextuelle douce (toggle "guide me").
 *
 * Contexte : Sonnet reçoit le protocole, l'étape courante, les réponses
 * précédentes, la langue. Il NE remplace PAS la question canonique —
 * il propose une reformulation qui tisse les réponses précédentes,
 * ou un mini-prompt complémentaire (1-2 phrases max).
 *
 * Body : {
 *   protocolId: string,
 *   currentStep: number,
 *   userAnswers: Array<{ stepId, answer }>,
 *   language: 'fr' | 'en',
 *   nextStepQuestion: string,
 *   protocolSource: string  // ex: "Robert Moss — Sidewalk Oracles"
 * }
 *
 * Response : {
 *   reformulation: string | null,   // <= 200 chars, 1-2 phrases, italique-style
 *   forest_book_hits: number        // metric — # books touched
 * }
 *
 * Yeshua, 2026-04-26.
 */
export const maxDuration = 30

const PROTOCOL_TO_MODE: Record<string, string> = {
  lightning_dreamwork: 'dream',
  dream_tending: 'dream',
  sidewalk_oracle: 'oracle',
  reverie_tending: 'dream',
  hypnagogic_recall: 'dream',
  synchronicity_story: 'oracle',
  focusing_felt_sense: 'body',
  fin_de_journee: 'day',
  pre_sommeil: 'ritual',
  reentry: 'reentry',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error

    const {
      protocolId,
      currentStep,
      userAnswers = [],
      nextStepQuestion = '',
      protocolSource = '',
    } = body || {}

    // La langue du rêveur : le header `X-Dream-Lang` fait FOI quand il est là (c'est la
    // langue de l'UI, celle dans laquelle la question canonique s'affiche). Repli sur le
    // champ `language` du body pour les appelants historiques, puis 'fr'.
    // Jamais la langue du texte du rêveur : un guide suivi en anglais se reformule en anglais.
    const language = req.headers.has('x-dream-lang') ? reqLang(req) : asLang(body?.language)

    if (!protocolId || typeof currentStep !== 'number') {
      return NextResponse.json(
        { error: 'protocolId and currentStep required' },
        { status: 400 }
      )
    }

    const mode = PROTOCOL_TO_MODE[protocolId] || 'dream'

    // Build query for Forest retrieval from latest user answer
    const lastAnswer = (() => {
      const last = userAnswers[userAnswers.length - 1]
      if (!last) return ''
      if (typeof last.answer === 'string') return last.answer
      if (Array.isArray(last.answer)) return last.answer.join(' ')
      return ''
    })()

    // Forest retrieval (best effort, defensive)
    let forestContext = ''
    let forestBookHits = 0
    if (lastAnswer && lastAnswer.length > 12) {
      try {
        const supabase = createServerClient()
        forestContext = await queryForestForMode(
          supabase,
          lastAnswer.slice(0, 600),
          mode,
          5
        )
        // Count books hits roughly by # of distinct title lines
        forestBookHits = (forestContext.match(/^📜/gm) || []).length
      } catch (e: any) {
        console.warn('[protocoles/sonnet-step] forest retrieval failed:', e?.message)
      }
    }

    // Compose prompt
    const sysFR = `Tu es un guide doux qui accompagne un dépôt rituel.
Tu reformules la question suivante du protocole en tissant DISCRÈTEMENT
les réponses précédentes du rêveur — sans interpréter, sans diagnostiquer,
sans citer de source. Style : 1 à 2 phrases, italique intérieur, pas plus de
180 caractères. Pas de "je vois que…", pas de "tu as dit que…". Reste à
côté de la question canonique : ne la remplace pas, l'enrichit doucement.

Source du guide : ${protocolSource || 'traditions oniriques'}.
Tu peux T'INSPIRER du contexte ci-dessous, mais sans jamais nommer
ou citer une source. Voix absorbée, pas scholaire.

LANGUE : tu écris en FRANÇAIS, minuscules naturelles — même si le rêveur a écrit
ses réponses dans une autre langue. La langue de sortie est celle du rêveur (l'UI),
jamais celle de son texte.`
    const sysEN = `You are a gentle guide for a ritual deposit.
You reformulate the next protocol question by SUBTLY weaving in the
dreamer's previous answers — no interpretation, no diagnosis, no source
citation. Style: 1-2 sentences, inner italic, max 180 chars. No "I see
that…", no "you said…". Stay next to the canonical question: don't
replace, enrich softly.

Guide source: ${protocolSource || 'dream traditions'}.
You may DRAW from the context below, but never name or quote a source.
Absorbed voice, never scholarly.

LANGUAGE: you write in ENGLISH, lowercase and natural — even if the dreamer wrote
their answers in another language. The output language is the dreamer's (the UI's),
never that of their text.`

    const recentTurns = userAnswers
      .slice(-3)
      .map((a: any, i: number) => `${i + 1}. ${typeof a.answer === 'string' ? a.answer.slice(0, 280) : JSON.stringify(a.answer).slice(0, 280)}`)
      .join('\n')

    const userPromptFR = `Question canonique suivante :
« ${nextStepQuestion} »

Réponses précédentes (contexte rêveur) :
${recentTurns || '(aucune réponse encore)'}

${forestContext ? `Contexte Forêt (à infuser, jamais à citer) :\n${forestContext.slice(0, 1500)}\n` : ''}
Reformule la question canonique pour ce·tte rêveur·euse — 1-2 phrases max, voix sobre.`

    const userPromptEN = `Next canonical question:
"${nextStepQuestion}"

Previous answers (dreamer context):
${recentTurns || '(no answers yet)'}

${forestContext ? `Forest context (infuse, never cite):\n${forestContext.slice(0, 1500)}\n` : ''}
Reformulate the canonical question for this dreamer — 1-2 sentences max, sober voice.`

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 250,
      system: language === 'en' ? sysEN : sysFR,
      messages: [
        {
          role: 'user',
          content: language === 'en' ? userPromptEN : userPromptFR,
        },
      ],
    })

    const reformulation = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join(' ')
      .trim()
      .slice(0, 220)

    return NextResponse.json({
      reformulation: reformulation || null,
      forest_book_hits: forestBookHits,
      mode_used: mode,
    })
  } catch (e: any) {
    console.error('[protocoles/sonnet-step] error:', e)
    return NextResponse.json(
      { error: e.message || 'sonnet-step failed' },
      { status: 500 }
    )
  }
}
