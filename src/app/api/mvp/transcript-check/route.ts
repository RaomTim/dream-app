import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, LANG_NAME, type DreamLang } from '@/lib/req-lang'

/**
 * POST /api/mvp/transcript-check — relire une transcription voix (§12ter.D).
 *
 * Un rêve dicté au réveil, d'une voix pâteuse, est parfois mal transcrit : mots avalés,
 * homophones (« les mouches du temple » pour « les marches du temple »), suites de mots
 * qui ne veulent rien dire. Haiku RELIT la transcription et repère UNIQUEMENT ce qui ne
 * fait pas sens — jamais l'étrangeté normale d'un rêve. Pour chaque passage douteux, une
 * QUESTION douce (« ici j'ai entendu … — c'était bien ça, ou autre chose ? »). Aucune
 * réécriture d'office : c'est le rêveur qui tranche, côté client (composant TranscriptCheck).
 *
 * Body: { kairos_id }
 * → { issues: [{ quote, question }], clean: boolean }
 *   - quote  : passage copié EXACTEMENT du texte (vérifié présent → anti-invention).
 *   - question : en langue du rêveur (X-Dream-Lang), chaleureuse, jamais culpabilisante.
 *   - max 4 issues. clean = aucun passage douteux.
 *
 * Lecture seule : cette route ne modifie RIEN. La correction éventuelle est validée par le
 * client via PATCH /api/kairos/[id] (raw_text corrigé + transcript_verified).
 *
 * Yeshua (Opus), 2026-07-22 — DREAM-MVP-SPEC-ECRANS-A-Z.md §12ter.D.
 */
export const maxDuration = 30

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_ISSUES = 4
const MIN_LEN = 40 // sous ce seuil, rien de signifiant à vérifier → on n'appelle pas le modèle

function extractJson(raw: string): any {
  const s = raw.indexOf('{')
  const e = raw.lastIndexOf('}')
  if (s === -1 || e === -1 || e < s) return null
  try { return JSON.parse(raw.slice(s, e + 1)) } catch { return null }
}

const systemFor = (lang: DreamLang) => `Tu relis la transcription d'un rêve. La personne a dicté son rêve à la voix, au réveil, souvent d'une voix pâteuse — et la transcription automatique a pu mal entendre certains passages (mots avalés, homophones, suites de mots qui ne veulent rien dire).

TA TÂCHE : repérer UNIQUEMENT les passages qui ne font pas sens — probablement une erreur de transcription. Pour chacun, tu poses une question douce, en mots simples, pour vérifier ce que la personne voulait dire.

ATTENTION — un rêve est naturellement étrange : décors qui changent, logique bizarre, images surréalistes, objets impossibles. Ça, ce n'est PAS une erreur : n'y touche jamais. Tu ne signales QUE ce qui ressemble à un mot mal ENTENDU (« les mouches du temple » là où « les marches du temple » aurait du sens), à une suite de mots incohérente, ou à une rupture nette au milieu d'une phrase.

RÈGLES DURES :
- Tu ne réécris JAMAIS le rêve, tu ne proposes pas la correction toi-même : tu poses une question, c'est la personne qui sait.
- Chaque passage cité (quote) est copié EXACTEMENT depuis le texte, mot pour mot, mêmes accents, même ponctuation — jamais reformulé, jamais raccourci.
- Maximum ${MAX_ISSUES} passages. S'il y en a plus, garde les ${MAX_ISSUES} plus douteux.
- Dans le doute, tu ne signales PAS. Mieux vaut laisser un passage étrange qu'inventer un problème.
- Si tout le texte se tient (aucune erreur visible de transcription) : liste vide.

Les questions sont écrites en ${LANG_NAME[lang]}, chaleureuses et jamais culpabilisantes (jamais « tu as mal dit », toujours « ici j'ai entendu … — c'était bien ça, ou autre chose ? »). Le passage cité, lui, reste dans sa langue d'origine : tu ne le traduis pas.

Réponds UNIQUEMENT en JSON, rien autour :
{"issues":[{"quote":"passage exact du texte","question":"ta question douce"}],"clean":true}
clean = true si aucun passage douteux (issues vide), false sinon.`

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const lang = reqLang(req)

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    if (!kairosId) {
      return corsify(NextResponse.json({ error: lang === 'en' ? 'kairos_id required' : 'kairos_id requis' }, { status: 400 }))
    }

    const supabase = createServerClient()
    const { data: k } = await supabase
      .from('kairos')
      .select('id, raw_text')
      .eq('id', kairosId)
      .eq('user_id', userId)
      .single()
    if (!k) return corsify(NextResponse.json({ error: lang === 'en' ? 'dream not found' : 'rêve introuvable' }, { status: 404 }))

    const raw = (k.raw_text || '').slice(0, 6000)
    // Texte trop court → rien de signifiant à relire. On répond « clair » sans coût modèle.
    if (raw.trim().length < MIN_LEN) {
      return corsify(NextResponse.json({ issues: [], clean: true }))
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: systemFor(lang),
      messages: [{ role: 'user', content: `LE RÊVE (transcription à vérifier) :\n\n${raw}` }],
    })
    const outText = res.content[0]?.type === 'text' ? res.content[0].text : ''
    const parsed = extractJson(outText)

    // Anti-invention : on ne garde qu'une issue dont la citation existe VERBATIM dans le texte.
    const seen = new Set<string>()
    const issues: { quote: string; question: string }[] = []
    const rawIssues = parsed && Array.isArray(parsed.issues) ? parsed.issues : []
    for (const it of rawIssues) {
      const quote = typeof it?.quote === 'string' ? it.quote.trim() : ''
      const question = typeof it?.question === 'string' ? it.question.trim() : ''
      if (!quote || !question) continue
      if (!raw.includes(quote)) continue // le modèle a reformulé → on écarte (jamais de fausse citation)
      const key = quote.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      issues.push({ quote: quote.slice(0, 400), question: question.slice(0, 400) })
      if (issues.length >= MAX_ISSUES) break
    }

    return corsify(NextResponse.json({ issues, clean: issues.length === 0 }))
  } catch (e: any) {
    console.error('[mvp.transcript-check]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
