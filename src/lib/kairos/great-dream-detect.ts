/**
 * great-dream-detect — LE RELIEF DU CORPUS.
 *
 * Ce que fait ce fichier : parcourir le corpus d'un rêveur et désigner les rêves
 * qui RESSORTENT, pour les lui PROPOSER. Rien d'autre.
 *
 * ── LA RÈGLE DURE, avant tout le reste ──────────────────────────────────────
 * Ce fichier ne marque JAMAIS un rêve. Il produit des *candidats*. Un candidat
 * non reviewé n'est pas un grand rêve, et n'entre pas dans le journal.
 * Seul le tap du rêveur fait entrer (1_BIBLE §3.13.3 — « l'IA suggère, elle ne
 * décide jamais »). L'écriture de `user_marked_numinous` reste la porte unique
 * PATCH /api/kairos/[id], et elle n'est actionnée que par un geste humain.
 *
 * ── CE QUI FONDE LA MÉTHODE (Forêt, digests lus en session) ─────────────────
 *
 * • **Bulkeley, _Big Dreams_ (2016)** — deux idées, et ce sont les deux piliers.
 *   1. **Black Swan Approach** : la science du rêve regarde la moyenne et jette
 *      les extrêmes comme du bruit ; Bulkeley fait l'inverse. Ce qui compte est
 *      l'outlier. → on ne cherche pas un seuil absolu de « grandeur », on cherche
 *      **l'écart au corpus DE CE RÊVEUR**. Tout est z-scoré par rêveur, jamais
 *      comparé entre rêveurs.
 *   2. **Continuité / discontinuité** : les rêves ordinaires prolongent la vie
 *      éveillée ; les grands rêves **rompent avec ses normes, de façon
 *      structurée** — et c'est cette rupture qui est détectable. D'où la
 *      composante `discontinuite` (synesthésie, atemporalité, effondrement du
 *      temps, prototypes).
 *   Les **4 prototypes** (aggressive / sexual / gravitational / mystical) sont
 *   utilisés ici en signal, **jamais affichés** (1_BIBLE §4.1 : « classification
 *   soft jamais imposée », backend only).
 *   Le **carry-over effect** (l'effet mesurable qui persiste au réveil) est le
 *   signal le plus honnête de tous — c'est le seul qui ne juge pas le texte mais
 *   observe ce que le rêve a *fait*. Il est câblé (`carryover`), et il est
 *   quasi-vide aujourd'hui : il se remplira à l'usage.
 *
 * • **von Franz, _The Way of the Dream_** — le grand rêve est « qualitativement
 *   différent », d'une intensité exceptionnelle, et **marque une transition
 *   majeure**. D'où le poids fort sur `charge` (intensité affective) et la
 *   composante `seuils` (les passages explicites relevés dans le rêve).
 *
 * • **Hillman, _The Dream and the Underworld_** — l'**erreur d'Hercule** : l'ego
 *   héroïque qui descend aux enfers en matraquant, et remonte les figures au
 *   grand jour **par la force de l'interprétation**. C'est exactement ce qu'un
 *   détecteur bavard ferait. D'où deux interdits tenus en dur :
 *   - le modèle ne dit jamais ce que le rêve VEUT DIRE — il **nomme l'image**
 *     (épistrophè : on revient à l'image, on ne la développe pas en sens) ;
 *   - le `dream_ego_stance` n'entre PAS dans le score. Chez Hillman l'impuissance
 *     du moi-rêvant (ne pas pouvoir courir, ni fuir, ni frapper) n'est pas une
 *     pathologie mais le comportement juste dans le monde d'en bas. Scorer
 *     l'agentivité ferait remonter les rêves héroïques et couler les rêves de
 *     paralysie — l'inverse de ce qu'il faut.
 *
 * • **Aizenstat, _Tending the Dream Is Tending the World_** — on *tend* l'image,
 *   on ne la fixe pas : « laisser les figures marcher sur leurs propres jambes ».
 *   D'où la forme de la proposition : une image du rêve, citée, et le silence.
 *   Et les quatre capacités (curiosité, patience, compassion, sens) traduites en
 *   règles de rythme : jamais au dépôt, jamais en rafale, jamais de relance.
 *
 * ── LE PIÈGE QU'ON DOIT MESURER, PAS SUPPOSER ───────────────────────────────
 * Le corpus est de la dictée vocale. Un long enregistrement contient plus de
 * motifs, plus d'archétypes, plus de seuils — mécaniquement. Sur le corpus de
 * Tim : corr(longueur, numinosity_score) = **0.441**, corr(longueur, archétypes)
 * = **0.499**. Un détecteur naïf attraperait donc **les rêves longs**, pas les
 * rêves puissants, et ça se verrait à peine.
 * D'où : **chaque composante est résidualisée sur log(longueur)** avant d'être
 * sommée (`residualize`). Ce qui reste est ce que la longueur n'explique pas.
 * La corrélation résiduelle est recalculée et exposée (`diagnostics`) — le
 * détecteur doit pouvoir prouver qu'il n'attrape pas la longueur.
 *
 * Yeshua (Opus, agent B3), 2026-07-26.
 */

/* ────────────────────────────────────────────────────────────────────────────
 * Constantes de rythme et de sélectivité. Une ligne à changer chacune.
 * ──────────────────────────────────────────────────────────────────────────── */

/** En dessous, aucune détection : les z-scores n'ont pas de sens et le brief est
 *  explicite — « un corpus de 5 rêves ne contient probablement aucun grand rêve
 *  détectable ». 12 est le premier palier où l'écart-type cesse d'être une
 *  devinette (même raisonnement qu'A2 §3 sur la borne (n−1)/√n). */
export const MIN_CORPUS = 12

/** Un rêve n'est pas proposable avant d'avoir eu le temps de faire son effet.
 *  1_BIBLE §3.13.1 : « un rêve devient grand plus tard » ; Bulkeley : le
 *  carry-over se mesure APRÈS. Et ça garantit qu'aucune proposition ne peut
 *  jamais apparaître dans le flux du réveil. */
export const MIN_AGE_DAYS = 30

/** Entrées trop courtes = fragments, rituels, tests. Pas des rêves. */
export const MIN_TEXT_CHARS = 300

/** Combien de finalistes partent au lecteur. Au-delà on paie sans gagner. */
export const SHORTLIST = 8

/** La première review d'un historique. Assez pour remplir le journal, assez peu
 *  pour être fait en quelques minutes sans se lasser. */
export const FIRST_REVIEW_MAX = 7

/** Le rythme de croisière. Une par semaine, jamais deux. « Mieux vaut proposer
 *  1 rêve par semaine que 12 d'un coup. » */
export const WEEKLY_MAX = 1
export const WEEKLY_COOLDOWN_DAYS = 7

/** Le plancher de relief, **en écarts-types du corpus de ce rêveur** (le relief
 *  est lui-même z-scoré, donc portable d'un corpus à l'autre — un rêveur qui
 *  écrit court et un rêveur qui écrit long ont la même barre).
 *  En dessous, un rêve ne « ressort » pas : il est juste le moins ordinaire d'un
 *  corpus ordinaire, et on se tait (SILENCE_AS_FEATURE).
 *  Calibré sur le corpus de Tim : cf. RAPPORT-B3 §3. */
export const MIN_RELIEF = 1.3

/** Le carry-over (Bulkeley) est le meilleur signal du lot, mais c'est un signal
 *  de comportement : sur un corpus où presque personne n'a jamais rien écrit,
 *  le z-scorer transforme un seul geste en outlier à +7σ qui écrase tout le
 *  reste. En dessous de ce nombre d'observations, la composante est neutralisée.
 *  Même raisonnement qu'A2 : calibrer sur 1 verdict, c'est refaire l'erreur
 *  qu'on répare. */
export const MIN_CARRYOVER_OBSERVATIONS = 5

/* ────────────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────────────── */

export type DetectRow = {
  id: string
  created_at: string
  title: string | null
  raw_text: string | null
  kairos_type: string | null
  user_marked_numinous: boolean | null
  numinosity_score: number | null
  affective_intensity: number | null
  motif_tags: string[] | null
  archetypal_tags: string[] | null
  life_themes: string[] | null
  root_dream_patterns: string[] | null
  somatic_markers: any
  sensorial_qualities: any
  temporal_signature: any
  thresholds_passages: any
  paradoxes_unresolved: any
  narrative_dynamics: any
  /** carry-over — compté par l'appelant, jamais deviné ici */
  interpretation_count?: number
  protocol_done?: boolean
}

export type Components = {
  charge: number
  discontinuite: number
  inacheve: number
  seuils: number
  archetypal: number
  singularite: number
  carryover: number
}

export type Scored = {
  row: DetectRow
  relief: number
  raw: Components
  z: Components
  prototypes: string[]
  lengthChars: number
}

export type Diagnostics = {
  corpus: number
  eligible: number
  duplicatesDropped: number
  /** corr(log longueur, relief) — AVANT résidualisation. Doit être élevée. */
  corrLengthBefore: number
  /** corr(log longueur, relief) — APRÈS. Doit être ~0. C'est la preuve. */
  corrLengthAfter: number
  reliefMean: number
  reliefSd: number
  reliefMax: number
  /** false = trop peu de gestes du rêveur pour que le carry-over compte */
  carryoverLive: boolean
}

/* ────────────────────────────────────────────────────────────────────────────
 * Petites mathématiques, écrites une fois
 * ──────────────────────────────────────────────────────────────────────────── */

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0
}

function sd(xs: number[]): number {
  if (xs.length < 2) return 0
  const m = mean(xs)
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1))
}

export function corr(xs: number[], ys: number[]): number {
  const n = Math.min(xs.length, ys.length)
  if (n < 3) return 0
  const mx = mean(xs), my = mean(ys)
  let num = 0, dx = 0, dy = 0
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my
    num += a * b; dx += a * a; dy += b * b
  }
  const den = Math.sqrt(dx * dy)
  return den === 0 ? 0 : num / den
}

/**
 * Retire de `ys` ce que `xs` explique linéairement (OLS simple), puis z-score
 * le résidu. C'est LE geste anti-« rêves longs » : après ça, la composante ne
 * porte plus que ce que la longueur n'expliquait pas.
 */
export function residualize(ys: number[], xs: number[]): number[] {
  const n = ys.length
  if (n < 3) return ys.map(() => 0)
  const mx = mean(xs), my = mean(ys)
  let cov = 0, varx = 0
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my)
    varx += (xs[i] - mx) ** 2
  }
  const b = varx === 0 ? 0 : cov / varx
  const res = ys.map((y, i) => y - (my + b * (xs[i] - mx)))
  const s = sd(res)
  return s === 0 ? res.map(() => 0) : res.map(r => r / s)
}

/* ────────────────────────────────────────────────────────────────────────────
 * Extraction des signaux bruts
 * ──────────────────────────────────────────────────────────────────────────── */

function arrLen(v: any): number {
  return Array.isArray(v) ? v.length : 0
}

function jsonCount(v: any): number {
  if (Array.isArray(v)) return v.length
  if (v && typeof v === 'object') return Object.keys(v).length
  return 0
}

/**
 * Les 4 prototypes de Bulkeley, reconnus depuis les motifs racines et les
 * qualités déjà extraites. **Backend uniquement** — jamais montrés au rêveur
 * (1_BIBLE §4.1). Ils servent à mesurer la discontinuité, pas à étiqueter.
 */
const PROTOTYPE_PATTERNS: Record<string, string[]> = {
  aggressive: ['pursuit', 'attack', 'nightmare', 'predator', 'war'],
  sexual: ['forbidden_desire', 'nudity', 'eros', 'sexual'],
  gravitational: ['falling', 'flight', 'paralysis', 'water', 'flood', 'earthquake'],
  mystical: ['death_rebirth', 'luminous', 'cosmic', 'unity'],
}

/** Marqueurs archétypaux du divin / cosmique — von Franz : le Soi se manifeste
 *  en figures divines, mandalas, images cosmiques. */
const MYSTICAL_ARCHETYPES = [
  'great_mother', 'divine', 'god', 'cosmic', 'self_realization', 'sacred',
  'draconic', 'christ', 'sophia', 'luminous', 'mandala', 'axis_mundi', 'anima_mundi',
]

export function prototypesOf(row: DetectRow): string[] {
  const roots = (row.root_dream_patterns || []).map(s => String(s).toLowerCase())
  const arch = (row.archetypal_tags || []).map(s => String(s).toLowerCase())
  const hits = new Set<string>()
  for (const [proto, keys] of Object.entries(PROTOTYPE_PATTERNS)) {
    if (roots.some(r => keys.some(k => r.includes(k)))) hits.add(proto)
  }
  if (arch.some(a => MYSTICAL_ARCHETYPES.some(m => a.includes(m)))) hits.add('mystical')
  const sq = row.sensorial_qualities || {}
  if (sq.synesthetic === true) hits.add('mystical')
  return Array.from(hits)
}

/**
 * Discontinuité au sens de Bulkeley : de combien ce rêve rompt-il avec les
 * normes de la veille. On additionne des faits déjà extraits, aucun n'est
 * inventé ici.
 */
function discontinuity(row: DetectRow): number {
  const sq = row.sensorial_qualities || {}
  const ts = row.temporal_signature || {}
  let d = 0
  if (sq.synesthetic === true) d += 1.5      // Bulkeley : marqueur mystique fort
  if (ts.atemporality === true) d += 1
  if (ts.temporal_collapse === true) d += 1
  if (ts.anachronism === true) d += 0.5
  d += prototypesOf(row).length * 0.5
  d += (row.numinosity_score ?? 0) * 1.5     // le score IA n'est QU'une composante
  return d
}

/** Combien de sens différents le rêve engage — Aizenstat : l'image a un corps,
 *  on y accède par les sens ; un rêve qui se sent est un rêve qui reste. */
function sensorialBreadth(row: DetectRow): number {
  const sq = row.sensorial_qualities || {}
  return ['sight', 'sound', 'touch', 'taste', 'smell', 'proprioception']
    .filter(k => sq[k] === true).length
}

/** Charge somatique : von Franz — le rêve passe par le corps. */
function somaticLoad(row: DetectRow): number {
  const sm = row.somatic_markers
  if (!sm || typeof sm !== 'object') return 0
  const vals = Object.values(sm as Record<string, any>)
    .map(v => (v && typeof v === 'object' && typeof v.intensity === 'number' ? v.intensity : 0))
  return vals.length ? Math.max(...vals) + vals.length * 0.1 : 0
}

/* ────────────────────────────────────────────────────────────────────────────
 * Nettoyage du corpus
 * ──────────────────────────────────────────────────────────────────────────── */

function normKey(t: string | null): string {
  return (t || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 400)
}

/**
 * Écarte ce qui n'est pas un rêve relisable, et les doublons d'import (le corpus
 * de Tim en contient 5 paires — A2 §5). En cas de doublon on garde le PLUS ANCIEN :
 * si un même récit existe deux fois, la date qui compte est celle de la nuit.
 */
export function cleanCorpus(rows: DetectRow[]): { kept: DetectRow[]; dropped: number } {
  const usable = rows.filter(r => (r.raw_text || '').trim().length >= MIN_TEXT_CHARS)
  const byKey = new Map<string, DetectRow>()
  let dropped = 0
  for (const r of [...usable].sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))) {
    const k = normKey(r.raw_text)
    if (byKey.has(k)) { dropped++; continue }
    byKey.set(k, r)
  }
  return { kept: Array.from(byKey.values()), dropped: dropped + (rows.length - usable.length) }
}

/* ────────────────────────────────────────────────────────────────────────────
 * LE SCORE
 * ──────────────────────────────────────────────────────────────────────────── */

/**
 * Poids. Chacun est défendable ou il ne devrait pas être là.
 *  charge         — von Franz + Bulkeley : l'intensité est le critère n°1
 *  discontinuite  — Bulkeley : c'est LA thèse du livre, ce qui sépare grand d'ordinaire
 *  inacheve       — Tim verbatim (« je suis loin d'avoir fini de l'intégrer ») ;
 *                   Hillman : le rêve résiste à la clôture, et c'est sa nature
 *  seuils         — von Franz : le grand rêve marque une transition
 *  archetypal     — von Franz, mais c'est la composante la plus corrélée à la
 *                   longueur (0.499) : poids volontairement bas
 *  singularite    — Bulkeley, Black Swan : l'outlier dans SON corpus
 *  carryover      — Bulkeley, carry-over effects : le seul signal qui n'est pas
 *                   un jugement sur le texte mais une observation de l'effet.
 *                   Quasi vide aujourd'hui, il se remplit à l'usage.
 */
export const WEIGHTS: Components = {
  charge: 1.0,
  discontinuite: 1.0,
  inacheve: 0.8,
  seuils: 0.8,
  archetypal: 0.6,
  singularite: 0.6,
  carryover: 0.5,
}

function rawComponents(row: DetectRow, motifFreq: Map<string, number>, n: number): Components {
  const motifs = (row.motif_tags || []).map(m => String(m).toLowerCase())
  // Black Swan : la part des motifs de ce rêve qui n'apparaissent presque nulle
  // part ailleurs dans SON corpus. Moyenne (pas somme) → indépendant du nombre.
  const singularite = motifs.length
    ? mean(motifs.map(m => 1 - (motifFreq.get(m) ?? 1) / n))
    : 0

  return {
    charge: (row.affective_intensity ?? 0) + somaticLoad(row) * 0.4,
    discontinuite: discontinuity(row) + sensorialBreadth(row) * 0.15,
    inacheve: jsonCount(row.paradoxes_unresolved),
    seuils: jsonCount(row.thresholds_passages) + (row.narrative_dynamics?.turning_point ? 0.5 : 0),
    archetypal: arrLen(row.archetypal_tags) + arrLen(row.life_themes) * 0.5,
    singularite,
    carryover: (row.interpretation_count ?? 0) * 1.0 + (row.protocol_done ? 1 : 0),
  }
}

const KEYS = Object.keys(WEIGHTS) as (keyof Components)[]

/**
 * Score tout le corpus. Rend les rêves triés par relief décroissant, plus les
 * diagnostics qui permettent de vérifier qu'on n'attrape pas la longueur.
 *
 * Les rêves déjà marqués restent dans le calcul (ils font partie du corpus et
 * de sa moyenne) mais sont retirés des candidats par `selectCandidates`.
 */
export function scoreCorpus(rows: DetectRow[]): { scored: Scored[]; diagnostics: Diagnostics } {
  const { kept, dropped } = cleanCorpus(rows)
  const n = kept.length

  const motifFreq = new Map<string, number>()
  for (const r of kept) {
    // Array.from : le tsconfig du projet ne permet pas d'itérer un Set directement.
    for (const m of Array.from(new Set((r.motif_tags || []).map(x => String(x).toLowerCase())))) {
      motifFreq.set(m, (motifFreq.get(m) ?? 0) + 1)
    }
  }

  const raws = kept.map(r => rawComponents(r, motifFreq, Math.max(n, 1)))
  const logLen = kept.map(r => Math.log(Math.max((r.raw_text || '').length, 1)))

  // Le carry-over n'entre dans le score que s'il y a de quoi le mesurer.
  const carryoverObs = raws.filter(c => c.carryover > 0).length
  const carryoverLive = carryoverObs >= MIN_CARRYOVER_OBSERVATIONS
  if (!carryoverLive) for (const c of raws) c.carryover = 0

  // Chaque composante est résidualisée sur log(longueur) PUIS z-scorée.
  const zByKey: Record<string, number[]> = {}
  for (const k of KEYS) {
    zByKey[k] = residualize(raws.map(c => c[k]), logLen)
  }

  const wsum = KEYS.reduce((acc, k) => acc + WEIGHTS[k], 0)
  const rawRelief = kept.map((_, i) => KEYS.reduce((acc, k) => acc + zByKey[k][i] * WEIGHTS[k], 0) / wsum)
  // Le relief est lui-même z-scoré : la barre s'exprime en écarts-types du
  // corpus de CE rêveur, jamais en unités absolues (Bulkeley, Black Swan).
  const rSd = sd(rawRelief)
  const scored: Scored[] = kept.map((row, i) => {
    const z = Object.fromEntries(KEYS.map(k => [k, zByKey[k][i]])) as Components
    return {
      row,
      relief: rSd === 0 ? 0 : rawRelief[i] / rSd,
      raw: raws[i], z,
      prototypes: prototypesOf(row),
      lengthChars: (row.raw_text || '').length,
    }
  })

  // La preuve : avant / après. On recalcule un relief NON résidualisé pour
  // montrer ce qu'on aurait obtenu sans le correctif.
  const zNaive: Record<string, number[]> = {}
  for (const k of KEYS) {
    const v = raws.map(c => c[k])
    const m = mean(v), s = sd(v)
    zNaive[k] = v.map(x => (s === 0 ? 0 : (x - m) / s))
  }
  const naive = kept.map((_, i) => KEYS.reduce((a, k) => a + zNaive[k][i] * WEIGHTS[k], 0) / wsum)

  const reliefs = scored.map(s => s.relief)
  const diagnostics: Diagnostics = {
    corpus: rows.length,
    eligible: n,
    duplicatesDropped: dropped,
    corrLengthBefore: corr(logLen, naive),
    corrLengthAfter: corr(logLen, reliefs),
    reliefMean: mean(reliefs),
    reliefSd: sd(reliefs),
    reliefMax: reliefs.length ? Math.max(...reliefs) : 0,
    carryoverLive,
  }

  scored.sort((a, b) => b.relief - a.relief)
  return { scored, diagnostics }
}

/**
 * La shortlist qui part au lecteur. Applique les règles de rythme et de
 * décence — c'est ici que le silence est produit, pas plus loin.
 *
 * @param alreadySeen  ids déjà proposés (acceptés OU écartés) — on ne relance jamais.
 */
export function selectCandidates(
  scored: Scored[],
  opts: { now?: Date; alreadySeen?: Set<string>; limit?: number } = {}
): Scored[] {
  const now = opts.now ?? new Date()
  const seen = opts.alreadySeen ?? new Set<string>()
  const limit = opts.limit ?? SHORTLIST

  if (scored.length < MIN_CORPUS) return []

  return scored
    .filter(s => !s.row.user_marked_numinous)          // déjà un grand rêve : rien à proposer
    .filter(s => !seen.has(s.row.id))                   // jamais deux fois
    .filter(s => (+now - +new Date(s.row.created_at)) / 86400000 >= MIN_AGE_DAYS)
    .filter(s => s.relief >= MIN_RELIEF)                // le silence vit ici
    .slice(0, limit)
}
