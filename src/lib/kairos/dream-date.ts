/**
 * dream-date — la date du RÊVE, distincte de la date du DÉPÔT.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LA DEMANDE (Tim, 2026-07-26)
 *   « Il faut aussi que l'app permette d'enregistrer des rêves à rebours :
 *     j'enregistre aujourd'hui mon rêve d'avant-hier. »
 *
 * LE MODÈLE
 *   kairos.created_at            = quand le rêve a été DÉPOSÉ (inchangé, jamais réécrit)
 *   kairos.dream_date            = quand le rêve a EU LIEU (NULL = on ne sait pas)
 *   kairos.dream_date_precision  = à quel point on le sait
 *   kairos.dream_date_label      = les mots du rêveur (« en avril », « il y a des années »)
 *   kairos.occurred_at (généré)  = dream_date ?? created_at → LE temps du rêve.
 *                                  Tout calcul temporel lit celle-ci.
 *   kairos.occurred_at_reliable  = false quand la date est explicitement inconnue.
 *
 * LE FLOU EST UNE VALEUR. Un rêve ancien raconté aujourd'hui n'a souvent pas de
 * date exacte. Forcer une date fausse est pire que reconnaître qu'on ne sait pas :
 * c'est exactement ce qui a produit les faux échos anciens (45 rêves importés
 * portant tous la date d'import du 18–23/04/2026).
 *
 * Yeshua (Opus), 2026-07-26.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { DreamLang } from '@/lib/req-lang'

/* B6 2026-07-26 — les types et l'AFFICHAGE vivent dans `dream-date-view.ts`,
   qui n'a aucune dépendance serveur : `src/app/mvp/page.tsx` est un composant
   client, et importer ce fichier-ci y aurait embarqué le SDK Anthropic (ci-dessus)
   dans le bundle du navigateur. Tout est ré-exporté ici : les imports serveur
   existants (`@/lib/kairos/dream-date`) n'ont pas eu à bouger. */
export {
  DREAM_DATE_PRECISIONS,
  toLocalISODate,
  formatDreamDate,
  canAssertDelta,
} from './dream-date-view'
export type {
  DreamDatePrecision,
  DreamDateSource,
  DreamDateFields,
  DreamDateShortcut,
} from './dream-date-view'

import {
  DREAM_DATE_PRECISIONS,
  toLocalISODate,
  type DreamDatePrecision,
  type DreamDateFields,
  type DreamDateShortcut,
} from './dream-date-view'

// ── entrée utilisateur ───────────────────────────────────────────────────────

export function shortcutToFields(shortcut: DreamDateShortcut, now: Date = new Date()): DreamDateFields {
  const day = (offset: number) => {
    const d = new Date(now)
    if (now.getHours() < 4) d.setDate(d.getDate() - 1)
    d.setDate(d.getDate() - offset)
    return toLocalISODate(d)
  }
  switch (shortcut) {
    case 'tonight':
      return { dream_date: day(0), dream_date_precision: 'night', dream_date_label: null, dream_date_source: 'default' }
    case 'yesterday':
      return { dream_date: day(1), dream_date_precision: 'night', dream_date_label: null, dream_date_source: 'user' }
    case 'before_yesterday':
      return { dream_date: day(2), dream_date_precision: 'night', dream_date_label: null, dream_date_source: 'user' }
    case 'few_days':
      // On ancre au milieu de la fenêtre plutôt que de choisir un jour au hasard,
      // et la précision dit que c'est approximatif.
      return { dream_date: day(4), dream_date_precision: 'week', dream_date_label: null, dream_date_source: 'user' }
    case 'this_month':
      return { dream_date: day(15), dream_date_precision: 'month', dream_date_label: null, dream_date_source: 'user' }
    case 'unknown':
    default:
      return { dream_date: null, dream_date_precision: 'unknown', dream_date_label: null, dream_date_source: 'user' }
  }
}

/**
 * Nettoie ce qui arrive du client. Une date sans précision est traitée comme
 * une nuit précise ; une précision 'unknown' efface la date (on n'invente pas).
 */
export function normalizeDreamDateInput(body: any): Partial<DreamDateFields> {
  const out: Partial<DreamDateFields> = {}
  if (typeof body?.dream_date_shortcut === 'string') {
    const s = body.dream_date_shortcut as DreamDateShortcut
    if (['tonight', 'yesterday', 'before_yesterday', 'few_days', 'this_month', 'unknown'].includes(s)) {
      return shortcutToFields(s)
    }
  }

  const hasDate = typeof body?.dream_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.dream_date)
  const prec: DreamDatePrecision | null =
    typeof body?.dream_date_precision === 'string' &&
    (DREAM_DATE_PRECISIONS as readonly string[]).includes(body.dream_date_precision)
      ? (body.dream_date_precision as DreamDatePrecision)
      : null

  if (prec === 'unknown') {
    out.dream_date = null
    out.dream_date_precision = 'unknown'
  } else if (hasDate) {
    // Un rêve ne peut pas avoir eu lieu demain.
    const d = new Date(`${body.dream_date}T12:00:00Z`)
    if (isNaN(d.getTime())) return out
    const today = new Date()
    if (d.getTime() > today.getTime() + 36 * 3600 * 1000) return out
    out.dream_date = body.dream_date
    out.dream_date_precision = prec || 'night'
  } else if (prec) {
    out.dream_date_precision = prec
  }

  if (typeof body?.dream_date_label === 'string') {
    out.dream_date_label = body.dream_date_label.trim().slice(0, 120) || null
  }
  if (out.dream_date !== undefined || out.dream_date_precision !== undefined) {
    out.dream_date_source = body?.dream_date_source === 'default' ? 'default' : 'user'
  }
  return out
}

// ── affichage ───────────────────────────────────────────────────────────────
// `formatDreamDate` et `canAssertDelta` vivent dans ./dream-date-view (ré-exportés
// en tête de ce fichier) — voir la note B6 ci-dessus.

// ── extraction rétroactive ───────────────────────────────────────────────────

export interface DateProposal {
  quote: string
  quote_start: number
  proposed_date: string | null
  proposed_precision: DreamDatePrecision
  year_missing: boolean
  ambiguous: boolean
  confidence: number
  reasoning: string
  parts: { day?: number; month?: number; year?: number; alt_quote?: string }
}

const EXTRACT_MODEL = 'claude-haiku-4-5-20251001'

const EXTRACT_SYSTEM = `Tu lis la transcription d'un rêve dicté. Beaucoup de ces enregistrements commencent par la date, dite à voix haute : « Rêve du 24 avril », « Petit enregistrement du 13 avril », « en ce 2 août 2023 », « mes petits rêves du 31 », « Journal de rêve, 13 janvier ».

TA TÂCHE : trouver la date à laquelle ce rêve a eu lieu, SI elle est dite dans le texte. Rien d'autre.

RÈGLES DURES
- Tu ne devines JAMAIS. Une date mal devinée est pire qu'une date absente.
- Tu ne renvoies une date que si elle est DITE. « cette nuit », « ce matin », « hier » ne sont PAS des dates : ils ne disent rien de quand l'enregistrement a été fait. Dans ce cas : found=false.
- Le passage cité est copié EXACTEMENT depuis le texte, mot pour mot.
- Si l'année n'est pas dite (le cas courant), tu laisses year absent. Tu ne la déduis pas.
- Si la personne hésite elle-même (« le 13 avril ou le 13 mai »), tu poses ambiguous=true et tu mets la seconde date dans alt_quote.
- Une date qui appartient au RÊVE (« on était en 1840 dans le rêve ») n'est pas la date du rêve. Ignore-la.
- Les mois sont des nombres 1–12. Les jours 1–31.

Réponds UNIQUEMENT en JSON, rien autour :
{"found":true,"quote":"passage exact","day":24,"month":4,"year":null,"ambiguous":false,"alt_quote":null,"confidence":0.0}
ou {"found":false}`

function extractJson(raw: string): any {
  const s = raw.indexOf('{')
  const e = raw.lastIndexOf('}')
  if (s === -1 || e === -1 || e < s) return null
  try { return JSON.parse(raw.slice(s, e + 1)) } catch { return null }
}

/**
 * Lit la date dite DANS le texte. Ne renvoie qu'une PROPOSITION — jamais appliquée
 * telle quelle. C'est la règle : rien en masse, tout revu.
 *
 * `depositAt` sert uniquement de garde-fou : une date proposée ne peut pas être
 * postérieure au dépôt. Quand l'année manque, on ne la déduit du dépôt QUE si le
 * dépôt est fiable (capture en direct) et que le jour/mois tombe dans les 400
 * jours qui le précèdent. Sur un import en masse, le dépôt ne dit rien de l'année :
 * on laisse `proposed_date` à NULL et `year_missing` à true.
 */
export async function extractDreamDateFromText(opts: {
  rawText: string
  depositAt: string
  depositIsReliable: boolean
  lang?: DreamLang
}): Promise<DateProposal | null> {
  const text = (opts.rawText || '').slice(0, 3000) // la date se dit au début
  if (text.trim().length < 40) return null

  let parsed: any = null
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: EXTRACT_MODEL,
      max_tokens: 400,
      system: EXTRACT_SYSTEM,
      messages: [{ role: 'user', content: `LE TEXTE :\n\n${text}` }],
    })
    const out = res.content[0]?.type === 'text' ? res.content[0].text : ''
    parsed = extractJson(out)
  } catch (e) {
    console.error('[dream-date] model failed:', String(e).slice(0, 200))
    return null
  }
  if (!parsed || parsed.found !== true) return null

  const quote = typeof parsed.quote === 'string' ? parsed.quote.trim() : ''
  if (!quote) return null
  const quoteStart = (opts.rawText || '').indexOf(quote)
  if (quoteStart === -1) return null // reformulé → anti-invention

  const day = Number.isInteger(parsed.day) && parsed.day >= 1 && parsed.day <= 31 ? parsed.day : undefined
  const month = Number.isInteger(parsed.month) && parsed.month >= 1 && parsed.month <= 12 ? parsed.month : undefined
  const year = Number.isInteger(parsed.year) && parsed.year >= 1970 && parsed.year <= 2100 ? parsed.year : undefined
  if (!month && !year) return null

  const ambiguous = parsed.ambiguous === true
  const confidence = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5
  const parts: DateProposal['parts'] = { day, month, year }
  if (typeof parsed.alt_quote === 'string' && parsed.alt_quote.trim()) parts.alt_quote = parsed.alt_quote.trim()

  const deposit = new Date(opts.depositAt)
  let proposed: string | null = null
  let precision: DreamDatePrecision = 'unknown'
  let yearMissing = !year

  const pad = (n: number) => String(n).padStart(2, '0')

  if (year && month) {
    proposed = `${year}-${pad(month)}-${pad(day || 15)}`
    precision = day ? 'day' : 'month'
  } else if (month && opts.depositIsReliable) {
    // Année déduite du dépôt : on prend l'occurrence la plus récente qui soit
    // ANTÉRIEURE au dépôt et à moins de 400 jours. Sinon on ne propose rien.
    const y = deposit.getUTCFullYear()
    for (const cand of [y, y - 1]) {
      const iso = `${cand}-${pad(month)}-${pad(day || 15)}`
      const t = new Date(`${iso}T12:00:00Z`).getTime()
      const delta = deposit.getTime() - t
      if (delta >= -36 * 3600 * 1000 && delta < 400 * 24 * 3600 * 1000) {
        proposed = iso
        precision = day ? 'day' : 'month'
        yearMissing = false
        break
      }
    }
  }

  // Une date proposée ne peut jamais être postérieure au dépôt.
  if (proposed && new Date(`${proposed}T12:00:00Z`).getTime() > deposit.getTime() + 36 * 3600 * 1000) {
    proposed = null
    precision = 'unknown'
    yearMissing = true
  }

  const reasoning = [
    day ? `jour ${day}` : null,
    month ? `mois ${month}` : null,
    year ? `année ${year}` : 'année non dite',
    ambiguous ? 'le rêveur hésite lui-même' : null,
    !proposed ? 'année indécidable → aucune date proposée' : null,
  ].filter(Boolean).join(' · ')

  return {
    quote: quote.slice(0, 300),
    quote_start: quoteStart,
    proposed_date: proposed,
    proposed_precision: precision,
    year_missing: yearMissing,
    ambiguous,
    confidence: ambiguous ? Math.min(confidence, 0.4) : confidence,
    reasoning,
    parts,
  }
}
