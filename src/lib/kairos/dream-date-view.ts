/**
 * dream-date-view — la part CLIENT de `dream-date.ts` : les types, et ce qui
 * s'affiche. Aucune dépendance serveur.
 *
 * POURQUOI CE FICHIER EXISTE (B6, 2026-07-26)
 *   `dream-date.ts` importe `@anthropic-ai/sdk` au niveau du module (extraction
 *   rétroactive). `src/app/mvp/page.tsx` est `'use client'` : y importer
 *   `formatDreamDate` depuis `dream-date.ts` aurait embarqué le SDK Anthropic —
 *   et une référence à `process.env.ANTHROPIC_API_KEY` — dans le bundle du
 *   navigateur. On sépare donc ce qui s'affiche de ce qui appelle un modèle.
 *
 *   `dream-date.ts` ré-exporte tout ce qui suit : aucun import serveur existant
 *   n'a eu à changer.
 *
 * Yeshua (Opus), 2026-07-26.
 */

export const DREAM_DATE_PRECISIONS = ['night', 'day', 'week', 'month', 'season', 'year', 'unknown'] as const
export type DreamDatePrecision = (typeof DREAM_DATE_PRECISIONS)[number]

export type DreamDateSource = 'user' | 'default' | 'legacy_backfill' | 'text_extraction' | 'import'

export interface DreamDateFields {
  dream_date: string | null
  dream_date_precision: DreamDatePrecision | null
  dream_date_label: string | null
  dream_date_source: DreamDateSource | null
}

/** `YYYY-MM-DD` en heure LOCALE (jamais toISOString(), qui décale d'un jour le soir). */
export function toLocalISODate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/**
 * Les raccourcis du geste UI. Par défaut « cette nuit » — un tap pour dire autre
 * chose. Jamais de sélecteur de date en plein réveil.
 *
 * « cette nuit » : la nuit qui vient de finir. Avant 4 h du matin on est encore
 * dans la nuit commencée la veille — un dépôt à 3 h porte donc la date de la
 * veille, comme le dit la langue (« la nuit du 12 »).
 */
export type DreamDateShortcut = 'tonight' | 'yesterday' | 'before_yesterday' | 'few_days' | 'this_month' | 'unknown'

/**
 * Ce qu'on écrit sous un rêve. Le principe : ne JAMAIS afficher plus de précision
 * qu'on n'en a. « en avril » reste « en avril », pas « le 15 avril ».
 * `deposited` n'est mentionné que s'il diffère du jour du rêve (rêve à rebours).
 */
export function formatDreamDate(
  k: { dream_date?: string | null; dream_date_precision?: string | null; dream_date_label?: string | null; created_at?: string | null },
  locale = 'fr-FR'
): { when: string; deposited: string | null } {
  const fr = locale.startsWith('fr')
  const label = k.dream_date_label?.trim()
  const prec = (k.dream_date_precision || 'night') as DreamDatePrecision

  if (prec === 'unknown' || !k.dream_date) {
    return {
      when: label || (fr ? 'date inconnue' : 'date unknown'),
      deposited: k.created_at ? new Date(k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) : null,
    }
  }

  const d = new Date(`${k.dream_date}T12:00:00Z`)
  let when: string
  switch (prec) {
    case 'year':
      when = String(d.getUTCFullYear())
      break
    case 'season':
    case 'month':
      when = d.toLocaleDateString(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
      break
    case 'week':
      when = (fr ? 'autour du ' : 'around ') + d.toLocaleDateString(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' })
      break
    default:
      when = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', timeZone: 'UTC' })
  }
  if (label) when = label

  let deposited: string | null = null
  if (k.created_at) {
    const dep = new Date(k.created_at)
    const sameDay = toLocalISODate(dep) === k.dream_date
    if (!sameDay) deposited = dep.toLocaleDateString(locale, { day: 'numeric', month: 'long' })
  }
  return { when, deposited }
}

/** Les précisions sur lesquelles on s'autorise à AFFIRMER une distance en jours. */
export function canAssertDelta(precision?: string | null): boolean {
  const p = (precision || 'night') as DreamDatePrecision
  return p === 'night' || p === 'day' || p === 'week'
}
