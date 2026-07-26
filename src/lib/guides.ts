/**
 * Les 10 guides de Dream — config unique (SPEC-ECRANS §3, tableau C3).
 *
 * Chantier D · 2026-07-11 · Yeshua (Opus).
 * I18N · 2026-07-11 · Yeshua (Opus) — le TEXTE a quitté ce fichier.
 *
 * Un « guide » = une petite traversée, une question à la fois, dans une langue
 * mondiale : un enfant de 12 ans et un parent de 60 ans comprennent chaque mot.
 * Aucun mot spirituel/jargon à l'écran (voir §0.1) : pas de « honorer »,
 * « oraculaire », « intégration », « seuil », « oracle », « protocole ».
 * Tutoiement chaleureux. Chaque phrase ≤ 15 mots quand c'est possible.
 *
 * ── OÙ VIT LE TEXTE ─────────────────────────────────────────────────────────
 * Plus une seule phrase en dur ici. Tout le contenu (noms, phrases, intros,
 * questions, hints, placeholders) vit dans :
 *     src/lib/i18n/mvp/content.{fr,en}.json  →  content.guides.<id>.*
 *
 * Ce fichier ne garde que la STRUCTURE (ids, ordre des étapes, type de champ,
 * durée, eveningOK) + les CLÉS i18n (`nameKey`, `qKey`…).
 *
 * Compatibilité : les champs texte (`name`, `phrase`, `intro`, `duration`,
 * `q`, `hint`, `placeholder`) existent TOUJOURS et portent le FR, lu directement
 * dans content.fr.json (donc jamais dupliqué, jamais désynchronisé). Un écran
 * qui n'a pas encore été traduit affiche donc le FR — pas une clé nue.
 *
 * Pour afficher dans la langue du rêveur, un composant fait :
 *     const { t } = useT()
 *     const guide = localizeGuide(GUIDES_BY_ID[id], t)   // → même type Guide
 *
 * Ports legacy (src/_legacy_v1.1/lib-dream-legacy/protocols.ts) — simplifiés,
 * dé-jargonnés, une question par écran :
 *   raconter   ← DREAM 10 étapes        retour     ← re-entry (construit)
 *   geste      ← geste concret          intention  ← pré-sommeil (soir)
 *   rendormir  ← REENTRY calme          relire     ← DAY 5 (soir)
 * Écrits neufs (les 4 manquants) :
 *   ecouter-corps (Focusing/Gendlin) · parler-image (Dream Tending) ·
 *   coincidence (synchronicity story) · intuition (rêverie/hypnagogie).
 */

import contentFr from './i18n/mvp/content.fr.json'

export type GuideStepInput = 'text' | 'none'

/** Résout une clé « content.a.b.c » dans le FR — repli de secours, jamais un crash. */
function fr(key: string): string {
  const path = key.replace(/^content\./, '').split('.')
  const val = path.reduce<any>((acc, p) => (acc == null ? acc : acc[p]), contentFr as any)
  return typeof val === 'string' ? val : ''
}

export interface GuideStep {
  id: string
  /** La question, une par écran. Voix simple, tutoiement. FR par défaut. */
  q: string
  /** Sous-ligne d'aide, facultative. */
  hint?: string
  /** Placeholder du champ, facultatif. */
  placeholder?: string
  /** 'none' = pas de champ (pause, respiration, ancrage) — juste « continuer ». */
  input?: GuideStepInput
  /* ── clés i18n (à passer à t()) ── */
  qKey: string
  hintKey?: string
  placeholderKey?: string
}

export interface Guide {
  id: string
  /** Nom à l'écran (moldu, définitif). FR par défaut. */
  name: string
  /** La phrase d'1 ligne (carte). */
  phrase: string
  /** Durée estimée, affichée telle quelle. */
  duration: string
  /** L'intro (écran « on y va ? »). */
  intro: string
  steps: GuideStep[]
  /** Lançable sans écrire un rêve d'abord (guides du soir). */
  eveningOK?: boolean
  /** Origine (métadonnée interne, jamais à l'écran). */
  legacy?: string
  /* ── clés i18n (à passer à t()) ── */
  nameKey: string
  phraseKey: string
  durationKey: string
  introKey: string
}

/** La structure seule : ids, ordre, type de champ. Le texte est dans les JSON. */
type StepSpec = [id: string, input?: GuideStepInput]
interface GuideSpec {
  id: string
  steps: StepSpec[]
  eveningOK?: boolean
  legacy?: string
}

const SPECS: GuideSpec[] = [
  {
    id: 'raconter',
    legacy: 'DREAM 10 étapes',
    steps: [['film'], ['details'], ['corps'], ['reel'], ['rappelle'], ['garde']],
  },
  {
    id: 'retour',
    legacy: 're-entry (construit)',
    steps: [['installe', 'none'], ['revois', 'none'], ['entre', 'none'], ['depose']],
  },
  {
    id: 'geste',
    legacy: 'geste concret (construit)',
    steps: [['envie'], ['choix'], ['quand']],
  },
  {
    id: 'intention',
    eveningOK: true,
    legacy: 'pré-sommeil (soir)',
    steps: [['journee'], ['question'], ['image'], ['confie', 'none']],
  },
  {
    id: 'rendormir',
    eveningOK: true,
    legacy: 'REENTRY calme',
    steps: [['ici', 'none'], ['respire', 'none'], ['main', 'none'], ['lieu'], ['laisse', 'none']],
  },
  {
    id: 'relire',
    eveningOK: true,
    legacy: 'DAY 5 (soir)',
    steps: [['passe'], ['corps'], ['echo'], ['coinc'], ['endors']],
  },
  {
    id: 'ecouter-corps',
    legacy: 'Focusing / Gendlin',
    steps: [['ou'], ['quoi'], ['mot'], ['demande']],
  },
  {
    id: 'parler-image',
    legacy: 'Dream Tending',
    steps: [['choix'], ['decris'], ['dit'], ['reponds']],
  },
  {
    id: 'coincidence',
    legacy: 'synchronicity story',
    steps: [['ordre'], ['avant'], ['touche'], ['histoire']],
  },
  {
    id: 'intuition',
    eveningOK: true,
    legacy: 'rêverie / hypnagogie',
    steps: [['note'], ['contexte'], ['ressemble']],
  },
]

function buildGuide(spec: GuideSpec): Guide {
  const base = `content.guides.${spec.id}`
  const steps: GuideStep[] = spec.steps.map(([stepId, input]) => {
    const sk = `${base}.steps.${stepId}`
    const hint = fr(`${sk}.hint`)
    const placeholder = fr(`${sk}.placeholder`)
    const step: GuideStep = { id: stepId, q: fr(`${sk}.q`), qKey: `${sk}.q` }
    if (hint) { step.hint = hint; step.hintKey = `${sk}.hint` }
    if (placeholder) { step.placeholder = placeholder; step.placeholderKey = `${sk}.placeholder` }
    if (input) step.input = input
    return step
  })
  return {
    id: spec.id,
    name: fr(`${base}.name`),
    phrase: fr(`${base}.phrase`),
    duration: fr(`${base}.duration`),
    intro: fr(`${base}.intro`),
    steps,
    ...(spec.eveningOK ? { eveningOK: true } : {}),
    ...(spec.legacy ? { legacy: spec.legacy } : {}),
    nameKey: `${base}.name`,
    phraseKey: `${base}.phrase`,
    durationKey: `${base}.duration`,
    introKey: `${base}.intro`,
  }
}

export const GUIDES: Guide[] = SPECS.map(buildGuide)

export const GUIDES_BY_ID: Record<string, Guide> = Object.fromEntries(
  GUIDES.map((g) => [g.id, g])
)

/* ─────────────────────────── i18n : résolution ─────────────────────────── */

/** La signature de `t` du provider (useT().t). */
export type TFn = (key: string, vars?: Record<string, string | number>) => string

/** Rend un guide dans la langue du rêveur. Même type en entrée et en sortie. */
export function localizeGuide(guide: Guide, t: TFn): Guide {
  return {
    ...guide,
    name: t(guide.nameKey),
    phrase: t(guide.phraseKey),
    duration: t(guide.durationKey),
    intro: t(guide.introKey),
    steps: guide.steps.map((s) => ({
      ...s,
      q: t(s.qKey),
      ...(s.hintKey ? { hint: t(s.hintKey) } : {}),
      ...(s.placeholderKey ? { placeholder: t(s.placeholderKey) } : {}),
    })),
  }
}

/** Confort : la liste entière, traduite. */
export function localizeGuides(guides: Guide[], t: TFn): Guide[] {
  return guides.map((g) => localizeGuide(g, t))
}

/**
 * Proposition contextuelle (SPEC §C2 — table de routage).
 *   rêve interrompu → Retourner dans le rêve
 *   rêve marquant (rayonne) → Un geste concret
 *   cauchemar → Se rendormir en douceur
 *   coïncidence → Raconter la coïncidence
 *   corps mentionné → Écouter son corps
 *   défaut → Raconter en entier
 * Retourne 1 à 3 guides, le plus adapté en premier.
 *
 * Le texte reçu peut être écrit dans n'importe quelle langue : on teste donc les
 * marqueurs FR **et** EN. Le routage ne doit pas dépendre de la langue de l'UI.
 */
export function proposeGuides(input: {
  type?: string
  text?: string
  radiant?: boolean
}): Guide[] {
  const t = (input.text || '').toLowerCase()
  const type = input.type || ''
  const ids: string[] = []
  const push = (id: string) => { if (!ids.includes(id)) ids.push(id) }

  const has = (re: RegExp) => re.test(t)

  // cauchemar / réveil en détresse → se rendormir
  if (has(/cauchemar|angoiss|terreur|poursuiv|monstre|je tombe|je tombais|effray|panique|hurl|noyade|je me noie|nightmare|terrified|chased|chasing me|monster|i was falling|i fell|panic|scream|drowning/)) push('rendormir')
  // rêve interrompu / réveil au milieu → retourner dans le rêve
  if (has(/réveill|reveill|interrompu|coupé|coupe net|ça s'arrête|ca s'arrete|juste avant de|sonnerie|sans savoir la suite|woke up|i awoke|interrupted|cut off|it stopped|just before|alarm|never found out/)) push('retour')
  // coïncidence / synchronicité
  if (type === 'synchronicite' || type === 'signe' || has(/coïncidence|coincidence|synchron|au même moment|au meme moment|comme par hasard|at the same moment|out of nowhere|by chance/)) push('coincidence')
  // corps mentionné
  if (has(/corps|ventre|gorge|poitrine|cœur|coeur|mains?|jambes?|douleur|tension|souffle|respir|peau|dos|body|belly|stomach|throat|chest|heart|hands?|legs?|pain|tense|breath|breathing|skin|back/)) push('ecouter-corps')
  // rêve marquant (rayonne)
  if (input.radiant) push('geste')
  // notes de jour → relire / attraper une intuition
  if (type === 'note_jour') { push('relire'); push('intuition') }

  // toujours proposer un socle sûr en dernier recours
  push('raconter')

  return ids.slice(0, 3).map((id) => GUIDES_BY_ID[id]).filter(Boolean)
}

/* ── compteur privé « déjà fait N fois » (localStorage, informatif, jamais un objectif) ── */
const COUNT_KEY = 'dream_guide_counts_v1'

function readCounts(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(COUNT_KEY) || '{}') } catch { return {} }
}

export function getGuideCount(id: string): number {
  return readCounts()[id] || 0
}

export function incGuideCount(id: string): void {
  if (typeof window === 'undefined') return
  try {
    const c = readCounts()
    c[id] = (c[id] || 0) + 1
    localStorage.setItem(COUNT_KEY, JSON.stringify(c))
  } catch { /* silencieux — le compteur n'est qu'un confort */ }
}
