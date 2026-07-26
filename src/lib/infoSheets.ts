/**
 * infoSheets.ts — Le contenu des fiches ⓘ (système « profondeur cachée », SPEC §0.2 + §8 H1)
 *
 * Deux étages :
 *   · bubble  = étage 1 : UNE phrase, langage courant (ce qui s'ouvre au tap du ⓘ).
 *   · body    = étage 2 : la fiche plein écran, ~200 mots max, phrases courtes, exemples concrets.
 *   · source  = « D'où ça vient » : 2-3 lignes, sans jargon, auteurs OK, JAMAIS de fait/chiffre inventé.
 *
 * Règles d'écriture (SPEC, acté 10/07) : phrases courtes, mots du quotidien, exemples concrets,
 * zéro poésie floue, zéro claim médical/thérapeutique. Ton : chaleureux, simple, digne.
 *
 * Garde-fous INTEGRITE-VERITE : aucune source, étude ni chiffre inventé. Les attributions
 * (Jung, Bachelard, Gendlin, Dalí, les Grecs, l'hypnagogie, l'incubation) sont réelles et
 * décrites en langage courant, sans leur faire dire plus qu'elles ne disent.
 *
 * ── OÙ VIT LE TEXTE (i18n, 2026-07-11) ──────────────────────────────────────
 * Le texte des 16 fiches est sorti d'ici. Il vit dans :
 *     src/lib/i18n/mvp/content.{fr,en}.json  →  content.info.sheets.<id>.*
 * L'anglais est une RÉ-ÉCRITURE, pas une traduction machine.
 *
 * Ce fichier ne garde que la structure (ids, groupes, ordre) + les clés i18n.
 * Compatibilité : `term`, `bubble`, `body`, `source` existent toujours et portent
 * le FR (lu depuis content.fr.json — jamais dupliqué). Pour la langue du rêveur :
 *     const { t, tRaw } = useT()
 *     const sheet = localizeInfoSheet(INFO_SHEETS[id], t, tRaw)   // même type
 *
 * Yeshua (Opus), 2026-07-11.
 */

import contentFr from './i18n/mvp/content.fr.json'

/** Résout une clé « content.a.b.c » dans le FR (string ou string[]). */
function frRaw(key: string): any {
  const path = key.replace(/^content\./, '').split('.')
  return path.reduce<any>((acc, p) => (acc == null ? acc : acc[p]), contentFr as any)
}
const frStr = (key: string): string => (typeof frRaw(key) === 'string' ? frRaw(key) : '')

export type InfoSheetContent = {
  /** Titre de la fiche (plein écran). FR par défaut. */
  term: string
  /** Étage 1 — la bulle, une seule phrase. */
  bubble: string
  /** Étage 2 — le corps, en paragraphes courts (≤ ~200 mots au total). */
  body: string[]
  /** « D'où ça vient » — 2-3 lignes, optionnel. */
  source?: string
  /* ── clés i18n ── */
  termKey: string
  bubbleKey: string
  bodyKey: string
  sourceKey?: string
}

export type InfoGroup = {
  title: string
  ids: string[]
  /** clé i18n du titre de groupe */
  titleKey: string
}

/** La signature de `t` du provider (useT().t). */
export type TFn = (key: string, vars?: Record<string, string | number>) => string
/** La signature de `tRaw` du provider (useT().tRaw) — nécessaire pour les tableaux (body). */
export type TRawFn = (key: string) => any

/** Toutes les fiches, dans l'ordre d'apparition dans l'index. */
const SHEET_IDS = [
  // Les mots de Dream
  'kairos', 'intuition', 'signe', 'coincidence', 'frisson', 'sieste',
  // Comment ça marche
  'how-interpret', 'signal-soin', 'wall-anon', 'credits', 'data',
  // Les guides (les plus opaques)
  'guide-image', 'guide-corps', 'guide-intuition', 'guide-reentry', 'guide-intention',
] as const

function buildSheet(id: string): InfoSheetContent {
  const base = `content.info.sheets.${id}`
  const body = frRaw(`${base}.body`)
  const source = frStr(`${base}.source`)
  const sheet: InfoSheetContent = {
    term: frStr(`${base}.term`),
    bubble: frStr(`${base}.bubble`),
    body: Array.isArray(body) ? (body as string[]) : [],
    termKey: `${base}.term`,
    bubbleKey: `${base}.bubble`,
    bodyKey: `${base}.body`,
  }
  if (source) { sheet.source = source; sheet.sourceKey = `${base}.source` }
  return sheet
}

export const INFO_SHEETS: Record<string, InfoSheetContent> = Object.fromEntries(
  SHEET_IDS.map((id) => [id, buildSheet(id)])
)

/** L'index de « Comment marche Dream » (H1) — regroupé, jamais atteint avant le ⓘ en contexte. */
export const INFO_INDEX: InfoGroup[] = [
  {
    titleKey: 'content.info.groups.words.title',
    title: frStr('content.info.groups.words.title'),
    ids: ['kairos', 'intuition', 'signe', 'coincidence', 'frisson', 'sieste'],
  },
  {
    titleKey: 'content.info.groups.how.title',
    title: frStr('content.info.groups.how.title'),
    ids: ['how-interpret', 'signal-soin', 'wall-anon', 'credits', 'data'],
  },
  {
    titleKey: 'content.info.groups.guides.title',
    title: frStr('content.info.groups.guides.title'),
    ids: ['guide-image', 'guide-corps', 'guide-intuition', 'guide-reentry', 'guide-intention'],
  },
]

export function getInfoSheet(id: string): InfoSheetContent | null {
  return INFO_SHEETS[id] ?? null
}

/* ─────────────────────────── i18n : résolution ─────────────────────────── */

/** Rend une fiche dans la langue du rêveur. Même type en entrée et en sortie. */
export function localizeInfoSheet(sheet: InfoSheetContent, t: TFn, tRaw: TRawFn): InfoSheetContent {
  const body = tRaw(sheet.bodyKey)
  return {
    ...sheet,
    term: t(sheet.termKey),
    bubble: t(sheet.bubbleKey),
    body: Array.isArray(body) ? (body as string[]) : sheet.body,
    ...(sheet.sourceKey ? { source: t(sheet.sourceKey) } : {}),
  }
}

/** Rend l'index (titres de groupes) dans la langue du rêveur. */
export function localizeInfoIndex(index: InfoGroup[], t: TFn): InfoGroup[] {
  return index.map((g) => ({ ...g, title: t(g.titleKey) }))
}
