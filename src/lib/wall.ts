import { createServerClient } from '@/lib/supabase'

/**
 * LE MUR — helpers serveur (schéma `wall`).
 * SPEC : DREAM-MVP-SPEC-ECRANS-A-Z.md §5.
 *
 * RÈGLE D'OR : aucune fonction ici ne renvoie jamais user_id vers le client.
 * Les libellés temporels (séparateurs « ── cette nuit ── » et signature
 * « Quelqu'un · cette nuit ») sont calculés côté serveur pour centraliser
 * la copy française exacte de la SPEC.
 *
 * Yeshua (Opus), 2026-07-11.
 */

const PARIS = 'Europe/Paris'
const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

/** Client Supabase (service_role) scopé au schéma `wall`. */
export function wallClient() {
  return createServerClient().schema('wall')
}

/** Clé calendrier Europe/Paris au format YYYY-MM-DD. */
export function parisDateKey(d: Date): string {
  // en-CA → YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

/** Différence en jours (a - b) entre deux clés YYYY-MM-DD. */
function dayDiff(aKey: string, bKey: string): number {
  const a = Date.parse(aKey + 'T00:00:00Z')
  const b = Date.parse(bKey + 'T00:00:00Z')
  return Math.round((a - b) / 86400000)
}

/** « 8 juillet » (jour + mois, Paris). */
function frDayMonth(d: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: PARIS,
    day: 'numeric',
    month: 'numeric',
  }).formatToParts(d)
  const day = parts.find(p => p.type === 'day')?.value ?? ''
  const monthNum = parseInt(parts.find(p => p.type === 'month')?.value ?? '1', 10)
  return `${day} ${MONTHS_FR[monthNum - 1]}`
}

export type NightLabels = {
  dateKey: string   // YYYY-MM-DD (regroupement)
  separator: string // « cette nuit » | « la nuit d'hier » | « la nuit du 8 juillet » (nuit)
  signature: string // « cette nuit » | « hier » | « le 8 juillet » (carte)
}

/**
 * Libellés temporels d'un dépôt, copy française exacte de la SPEC §5.
 * `tab` change le registre : nuit → « la nuit … », jour → « le … / aujourd'hui ».
 */
export function nightLabels(createdAtISO: string, tab: 'nuit' | 'jour', now: Date = new Date()): NightLabels {
  const d = new Date(createdAtISO)
  const key = parisDateKey(d)
  const todayKey = parisDateKey(now)
  const diff = dayDiff(todayKey, key)
  const dm = frDayMonth(d)

  let separator: string
  let signature: string
  if (diff <= 0) {
    separator = tab === 'nuit' ? 'cette nuit' : "aujourd'hui"
    signature = separator
  } else if (diff === 1) {
    separator = tab === 'nuit' ? "la nuit d'hier" : 'hier'
    signature = 'hier'
  } else {
    separator = tab === 'nuit' ? `la nuit du ${dm}` : `le ${dm}`
    signature = `le ${dm}`
  }
  return { dateKey: key, separator, signature }
}
