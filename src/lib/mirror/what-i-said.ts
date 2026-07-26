/**
 * LE MIROIR — mode « ce que j'en ai dit »
 * ───────────────────────────────────────
 * Le mode le plus honnête du miroir : **zéro prose générée.** L'app ne dit rien
 * d'elle-même. Elle rend au rêveur ses propres lectures, datées, côte à côte,
 * et se tait.
 *
 * Loi : `DOCTRINE-MIROIR.md` §10 (« le moins cher, le plus fort »), §1.4 (le
 * miroir CITE, il ne caractérise pas), §3.2 (registre de ce qui revient, jamais
 * de ce qui est réglé), §7 (les douze interdits), §9 (beau par MONTAGE).
 * Matière : la couche `lecture` de B4 (`RAPPORT-B4.md` §2) — 171 passages sur
 * le corpus de Tim.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LES QUATRE DÉCISIONS DE CONCEPTION, ET POURQUOI
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ① L'ANCRE EST UN MOT, PAS UN THÈME.
 *    Un fil ne se tient que par un mot présent VERBATIM dans chaque lecture
 *    citée, dans SA bouche. `puissance` relie parce que le mot y est cinq fois ;
 *    « la question du pouvoir » relierait parce que l'app l'a décidé — et ce
 *    serait déjà caractériser (interdit 2). D'où la règle dure : **les familles
 *    sont MORPHOLOGIQUES, jamais sémantiques.** `puissan` (puissance/puissant)
 *    est permis ; `(magie|pouvoir|chamane)` ne l'est pas, et a été retiré après
 *    l'avoir mesuré : c'est un jugement de synonymie, donc une thèse.
 *    Le libellé affiché est la forme la plus fréquente parmi les citations, et
 *    chaque carte surligne SA forme à elle. Rien n'est affirmé qui ne soit lisible.
 *
 * ② LA GRAMMAIRE TEMPORELLE SUIT LA FIABILITÉ DES DATES, PAS L'ENVIE.
 *    42 des 64 rêves de Tim sont « date inconnue » (B4 §1.3). Un montage qui les
 *    range dans une ligne fabrique un mouvement qui n'a pas eu lieu — le piège
 *    exact démontré en `FAISABILITE-MIROIR.md` §6.2.
 *      · `ligne`     — construite sur le SOUS-ENSEMBLE fiablement daté, quand
 *                      il tient seul (≥ 2 lectures, ≥ 2 rêves). Ordre chrono,
 *                      écarts écrits en clair, la date en grand.
 *      · `pele-mele` — sinon. Aucun ordre affiché, aucun écart, cartes posées à
 *                      plat. La carte non datée dit pourquoi (« déposé le …, la
 *                      date du rêve n'a jamais été posée ») et offre le geste
 *                      qui la répare.
 *    On ne mélange JAMAIS daté et non daté dans une séquence.
 *
 *    ⚠️ CORRECTION MESURÉE (26/07, à la première exécution sur le corpus réel).
 *    La première version décidait la grammaire sur TOUTES les lectures du fil :
 *    une seule lecture non datée faisait basculer le fil entier en pêle-mêle.
 *    Effet observé : le fil « rêve » — 24 rêves, dont 9 fiablement datés sur
 *    28 mois, le plus riche du corpus — disparaissait de l'écran, écrasé par
 *    des fils de deux cartes. Un fil qui possède de quoi tenir une ligne DOIT
 *    la tenir ; ses lectures sans date ne sont pas cachées, elles sont
 *    seulement hors de cette ligne-là, et `undatedHeld` le dit à l'écran.
 *    C'est l'inverse d'un adoucissement : la ligne ne contient QUE du daté,
 *    donc elle est plus stricte qu'avant, pas moins.
 *
 * ③ LA SÉLECTION EST MÉCANIQUE, JAMAIS QUALITATIVE.
 *    Quand un fil a plus de lectures que le plafond, l'app ne garde pas « les
 *    plus fortes » — elle n'a pas le droit d'avoir un avis. Elle garde la plus
 *    ancienne, la plus récente, et complète par ÉCART TEMPOREL MAXIMAL (fil daté)
 *    ou par ordre stable (fil non daté). Un tri par longueur, par numinosité ou
 *    par confiance réintroduirait un jugement — et `numinosity_score` corrèle
 *    0,615 avec la longueur du texte (E2 §1.2) : il sélectionnerait le bavardage.
 *
 * ④ LE SILENCE EST UNE SORTIE NORMALE.
 *    Aucun fil ≥ 2 lectures sur 2 rêves distincts → on ne rend rien. Interdit 12 :
 *    « servir le moins mauvais plutôt que rien » est le mode d'échec, pas la
 *    tolérance. `buildThreads` retourne un tableau vide, et c'est un succès.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * CE QUE CE FICHIER NE FAIT PAS, ET NE FERA JAMAIS
 * ═══════════════════════════════════════════════════════════════════════════
 * Aucun appel de modèle. Aucune phrase générée. Aucun champ de résolution
 * (§3.3 : pas de `is_resolved`, `progress`, `stage`, `healed`). Aucun comptage
 * rendu nu — tout nombre sort accompagné de ses dates (§7, règle des nombres).
 * Aucune lecture d'une autre table que celles du rêveur (interdit 7).
 *
 * Yeshua (Opus, G2), 2026-07-26.
 */

/* ─────────────────────────── LES TYPES ─────────────────────────── */

export type MirrorReadingSource = 'dictee' | 'today'

/** Une lecture : ce que le rêveur a dit de son rêve, avec sa date. */
export type MirrorReading = {
  id: string
  kairosId: string | null
  dreamTitle: string | null
  quote: string
  /** Le temps du RÊVE (`occurred_at`), pas celui du dépôt. */
  occurredAt: string
  /** `occurred_at_reliable` — le droit d'affirmer une date (B4 §1.1). */
  dated: boolean
  /** Le dépôt — sert uniquement à expliquer une date inconnue. */
  depositedAt: string | null
  source: MirrorReadingSource
  /** Bornes de l'ancre DANS `quote`, pour le surlignage. */
  match: { start: number; end: number } | null
}

export type MirrorGrammar = 'ligne' | 'pele-mele'

export type MirrorThread = {
  /** Le mot, tel qu'il sort de sa bouche — forme la plus fréquente parmi les citations. */
  anchor: string
  anchorSlug: string
  grammar: MirrorGrammar
  readings: MirrorReading[]
  /** Renseigné UNIQUEMENT en grammaire `ligne`. */
  span: { from: string; to: string; months: number } | null
  /** Combien de lectures le fil compte avant plafonnement (pour la ligne factuelle). */
  totalReadings: number
  /** Nombre de rêves distincts d'où viennent les lectures citées. */
  dreamCount: number
  /**
   * Lectures qui portent le mot mais que la ligne ne peut pas accueillir, faute
   * de date fiable. Dit à l'écran, jamais tu ; c'est ce qui empêche la ligne
   * d'être un mensonge par omission — et c'est l'endroit exact où proposer de
   * poser les dates manquantes.
   */
  undatedHeld: number
}

/* ─────────────────── LE CATALOGUE D'ANCRES ───────────────────
 * Chaque entrée est UNE racine et ses flexions. Rien d'autre.
 * `rx` est appliqué sur la citation normalisée (minuscules, sans accents).
 *
 * ⚠️ RÈGLE D'ADMISSION D'UNE ANCRE — à relire avant d'en ajouter une :
 * si deux personnes raisonnables peuvent être en désaccord sur le fait que
 * deux mots de la famille « veulent dire la même chose », l'ancre est
 * sémantique et doit être refusée. `reveill` (réveillé/réveille) passe.
 * `(peur|angoisse|trouille)` ne passe pas — c'est une thèse sur le lexique
 * de quelqu'un d'autre.
 *
 * Les locutions figées (`je me demande`, `je sais pas`) sont admises parce
 * qu'elles sont citées MOT POUR MOT : ce n'est pas une famille, c'est une
 * chaîne. `je (ne )?sais pas` couvre la négation orale, rien de plus.
 */
export type Anchor = { slug: string; rx: RegExp; minLen?: number }

export const ANCHORS: Anchor[] = [
  // locutions citées mot pour mot
  { slug: 'je me demande', rx: /je me demande/g },
  { slug: 'je sais pas', rx: /je (?:ne )?sais pas/g },
  { slug: 'je me suis réveillé', rx: /je me suis reveill\w*/g },
  // racines + flexions
  // ⚠️ Les motifs s'appliquent au texte REPLIÉ (minuscules, accents retirés) :
  // n'écrire ici que des formes sans accent. `\brev(e|es|...)\b` ne mord pas
  // « reveille » — la frontière de mot l'en empêche, et c'est voulu : se
  // réveiller est un autre fil.
  { slug: 'rêve', rx: /\brev(?:e|es|er|ee|ait|ais|ent|erie)\b/g },
  { slug: 'puissance', rx: /puissan\w*/g },
  { slug: 'confiance', rx: /confian\w*/g },
  { slug: 'intégrité', rx: /integrit\w*/g },
  { slug: 'invitation', rx: /invit\w*/g },
  { slug: 'peur', rx: /\bpeur\w*/g },
  { slug: 'honte', rx: /\bhont\w*/g },
  { slug: 'guerrier', rx: /guerri\w*/g },
  { slug: 'école', rx: /ecol\w*/g },
  { slug: 'corps', rx: /\bcorps\b/g },
  { slug: 'magique', rx: /magiqu\w*/g },
  { slug: 'temple', rx: /temple\w*/g },
  { slug: 'vérité', rx: /verit\w*/g },
  { slug: 'chant', rx: /\bchant\w*/g },
  { slug: 'souveraineté', rx: /souverain\w*/g },
  { slug: 'ancêtres', rx: /ancetr\w*/g },
  { slug: 'famille', rx: /famill\w*/g },
  { slug: 'équipe', rx: /equip\w*/g },
  { slug: 'protéger', rx: /proteg\w*|protect\w*/g },
  { slug: 'important', rx: /importan\w*/g },
  { slug: 'intention', rx: /intention\w*/g },
  { slug: 'incarner', rx: /incarn\w*|desincarn\w*/g },
  { slug: 'énergie', rx: /energi\w*/g },
  { slug: 'sacré', rx: /\bsacre\w*/g },
  { slug: 'initiation', rx: /\biniti(?:e|ee|ation|er|ations)\b/g },
  { slug: 'jeu', rx: /\bjeu\b|\bjeux\b|\bjouer\b/g },
  { slug: 'liberté', rx: /libert\w*|\blibre\b/g },
  { slug: 'voyage', rx: /voyag\w*/g },
  { slug: 'réaliser', rx: /realis\w*/g },
]

/* ─────────────────────── LES SEUILS ───────────────────────
 * Doctrine §9 : « deux qui se répondent valent mieux que huit qui
 * s'accumulent ». Le plafond n'est pas une contrainte technique, c'est la
 * spécification. */
export const MIN_READINGS = 2
export const MIN_DREAMS = 2
export const MAX_READINGS_PER_THREAD = 4
export const MAX_THREADS = 6
/** Plafond de fils datés, pour que le flou reste visible (cf. le quota, plus bas). */
export const MAX_LINE_THREADS = 4
/** En dessous, une lecture est trop courte pour tenir seule dans un montage. */
export const MIN_QUOTE_CHARS = 24

/* ─────────────────────── NORMALISATION ─────────────────────── */

/** Minuscules, sans accents. Conserve les longueurs → les index de match
 *  restent valides sur la citation d'origine. */
export function fold(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’ʼ]/g, "'")
}

/** Réduction agressive, pour comparer deux citations entre elles. */
function shingleSet(s: string): Set<string> {
  const words = fold(s)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
  const out = new Set<string>()
  for (let i = 0; i < words.length - 1; i++) out.add(words[i] + ' ' + words[i + 1])
  if (words.length === 1) out.add(words[0])
  return out
}

/**
 * Deux citations sont-elles la même chose ?
 *
 * ⚠️ CE GARDE-FOU N'EST PAS COSMÉTIQUE. Le corpus de Tim contient quatre
 * doublons octet pour octet et au moins deux quasi-doublons (E2 §1.1) : le même
 * enregistrement importé deux fois, avec deux titres. Mesuré ici : la lecture
 * « Je sens la forme de réalité de comment on peut se retrouver hors de son
 * corps… » existe en deux versions qui ne diffèrent que de trois mots.
 * Sans ce test, le miroir montre à Tim la MÊME phrase deux fois en laissant
 * entendre qu'elle est revenue. C'est le seul mensonge que ce mode puisse
 * commettre — il ne cite que lui, donc la seule façon de le trahir est de lui
 * faire croire à une répétition qui n'a pas eu lieu.
 *
 * Jaccard sur bigrammes ≥ 0,62, OU inclusion d'un texte dans l'autre.
 */
export function sameReading(a: string, b: string): boolean {
  const fa = fold(a).replace(/[^a-z0-9]+/g, ' ').trim()
  const fb = fold(b).replace(/[^a-z0-9]+/g, ' ').trim()
  if (!fa || !fb) return false
  if (fa === fb) return true
  if (fa.length > 40 && fb.length > 40 && (fa.includes(fb) || fb.includes(fa))) return true
  const sa = shingleSet(a)
  const sb = shingleSet(b)
  if (sa.size === 0 || sb.size === 0) return false
  let inter = 0
  sa.forEach((g) => { if (sb.has(g)) inter++ })
  const union = sa.size + sb.size - inter
  return union > 0 && inter / union >= 0.62
}

/** Écarte les lectures qui répètent une lecture déjà retenue. Garde la plus ancienne. */
export function dedupeReadings(readings: MirrorReading[]): MirrorReading[] {
  const sorted = [...readings].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
  const kept: MirrorReading[] = []
  for (const r of sorted) {
    if (!kept.some((k) => sameReading(k.quote, r.quote))) kept.push(r)
  }
  return kept
}

/* ─────────────────────── LE MONTAGE ─────────────────────── */

function monthsBetween(a: string, b: string): number {
  const da = new Date(a)
  const db = new Date(b)
  return Math.max(0, Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
}

/**
 * Plafonne un fil SANS jugement de valeur (décision ③).
 * Fil daté      → la plus ancienne, la plus récente, puis les écarts les plus larges.
 * Fil non daté  → ordre stable (titre du rêve, puis id), tronqué.
 */
function capReadings(readings: MirrorReading[], allDated: boolean, max: number): MirrorReading[] {
  if (readings.length <= max) return readings
  if (!allDated) {
    return [...readings]
      .sort((a, b) => (a.dreamTitle || '').localeCompare(b.dreamTitle || '') || a.id.localeCompare(b.id))
      .slice(0, max)
  }
  const chrono = [...readings].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
  const picked = [chrono[0], chrono[chrono.length - 1]]
  // On ajoute, une par une, celle qui tombe le plus loin de tout ce qui est déjà pris.
  while (picked.length < max) {
    let best: MirrorReading | null = null
    let bestGap = -1
    for (const cand of chrono) {
      if (picked.some((p) => p.id === cand.id)) continue
      const gap = Math.min(...picked.map((p) => Math.abs(new Date(cand.occurredAt).getTime() - new Date(p.occurredAt).getTime())))
      if (gap > bestGap) { bestGap = gap; best = cand }
    }
    if (!best) break
    picked.push(best)
  }
  return picked.sort((a, b) => a.occurredAt.localeCompare(b.occurredAt))
}

/** Le libellé de l'ancre = la forme la plus fréquente réellement prononcée. */
function dominantForm(slug: string, hits: string[]): string {
  if (hits.length === 0) return slug
  const tally = new Map<string, number>()
  for (const h of hits) tally.set(h, (tally.get(h) || 0) + 1)
  let best = hits[0]
  let bestN = 0
  tally.forEach((n, form) => {
    if (n > bestN || (n === bestN && form.length < best.length)) { best = form; bestN = n }
  })
  return best
}

export type BuildInput = { readings: MirrorReading[]; anchors?: Anchor[] }

/**
 * Construit les fils. Retourne `[]` quand il n'y a rien à montrer — et c'est
 * une réponse valide, pas une panne (décision ④).
 */
export function buildThreads({ readings, anchors = ANCHORS }: BuildInput): MirrorThread[] {
  const usable = readings.filter((r) => (r.quote || '').trim().length >= MIN_QUOTE_CHARS)
  const threads: MirrorThread[] = []

  for (const anchor of anchors) {
    const hits: { reading: MirrorReading; form: string; start: number; end: number }[] = []
    for (const r of usable) {
      anchor.rx.lastIndex = 0
      const m = anchor.rx.exec(fold(r.quote))
      if (!m) continue
      /* `fold` préserve les longueurs → les index valent sur la citation
         d'origine. On reprend la forme DANS SON TEXTE À LUI : c'est « rêve »
         qui doit s'afficher, jamais « reve ». Le repli sert à chercher, il ne
         doit jamais servir à montrer. */
      const start = m.index
      const end = m.index + m[0].length
      hits.push({ reading: r, form: r.quote.slice(start, end), start, end })
    }
    if (hits.length < MIN_READINGS) continue

    const deduped = dedupeReadings(
      hits.map((h) => ({ ...h.reading, match: { start: h.start, end: h.end } }))
    )
    if (deduped.length < MIN_READINGS) continue
    if (new Set(deduped.map((r) => r.kairosId ?? r.id)).size < MIN_DREAMS) continue

    /* La ligne se construit sur le sous-ensemble DATÉ, et seulement s'il tient
       debout tout seul. Sinon, pêle-mêle sur l'ensemble. Jamais de mélange. */
    const datedOnly = deduped.filter((r) => r.dated)
    const datedHoldsUp =
      datedOnly.length >= MIN_READINGS &&
      new Set(datedOnly.map((r) => r.kairosId ?? r.id)).size >= MIN_DREAMS

    const grammar: MirrorGrammar = datedHoldsUp ? 'ligne' : 'pele-mele'
    const pool = datedHoldsUp ? datedOnly : deduped
    const capped = capReadings(pool, datedHoldsUp, MAX_READINGS_PER_THREAD)

    // Les formes réellement prononcées, restreintes aux citations retenues.
    const formsOfCapped = capped
      .map((r) => hits.find((h) => h.reading.id === r.id)?.form)
      .filter((f): f is string => Boolean(f))

    let span: MirrorThread['span'] = null
    if (grammar === 'ligne') {
      const from = capped[0].occurredAt
      const to = capped[capped.length - 1].occurredAt
      span = { from, to, months: monthsBetween(from, to) }
    }

    threads.push({
      anchor: dominantForm(anchor.slug, formsOfCapped),
      anchorSlug: anchor.slug,
      grammar,
      readings: capped,
      span,
      totalReadings: deduped.length,
      dreamCount: new Set(capped.map((r) => r.kairosId ?? r.id)).size,
      undatedHeld: datedHoldsUp ? deduped.length - datedOnly.length : 0,
    })
  }

  /* L'ORDRE DES FILS. Pas « le plus intéressant » — l'app n'a pas d'avis.
     Critère purement structurel, dans cet ordre :
       1. les fils qui portent une ligne datée passent devant (ils disent
          quelque chose de vrai sur le temps, les autres non) ;
       2. à égalité, l'amplitude temporelle ;
       3. à égalité, le nombre de rêves distincts ;
       4. à égalité, l'ordre alphabétique — stable, donc reproductible. */
  threads.sort((a, b) => {
    if (a.grammar !== b.grammar) return a.grammar === 'ligne' ? -1 : 1
    const sa = a.span?.months ?? 0
    const sb = b.span?.months ?? 0
    if (sa !== sb) return sb - sa
    if (a.dreamCount !== b.dreamCount) return b.dreamCount - a.dreamCount
    return a.anchorSlug.localeCompare(b.anchorSlug)
  })

  /* ── LE QUOTA DE GRAMMAIRE ──────────────────────────────────────────────
     Les lignes passent devant (elles disent quelque chose de vrai sur le
     temps), MAIS elles ne prennent pas toute la place.

     Mesuré le 26/07 : sans quota, les six emplacements partaient tous à des
     lignes, et AUCUN pêle-mêle n'atteignait l'écran — alors que 39 des 60
     rêves de Tim n'ont pas de date. Deux tiers de son corpus devenaient
     invisibles sans que rien ne le dise. C'est exactement le mode d'échec que
     `FAISABILITE-MIROIR.md` §6 nomme : l'app ne ment pas, elle se contente de
     montrer la partie qui l'arrange, et le rêveur en conclut que le reste
     n'existe pas.

     D'où : au plus MAX_LINE_THREADS lignes, le reste revient au pêle-mêle.
     Le flou a droit de cité à l'écran, il n'est pas relégué. */
  const seen = new Set<string>()
  const spread: MirrorThread[] = []
  let lines = 0

  const admit = (th: MirrorThread): boolean => {
    /* Un même rêve ne doit pas porter tous les fils : sinon le miroir n'est
       qu'une relecture d'une seule nuit sous six angles. Un fil est écarté si
       TOUTES ses lectures viennent de rêves déjà couverts. */
    const ids = th.readings.map((r) => r.kairosId ?? r.id)
    if (spread.length > 0 && ids.every((id) => seen.has(id))) return false
    ids.forEach((id) => seen.add(id))
    spread.push(th)
    if (th.grammar === 'ligne') lines++
    return true
  }

  for (const th of threads) {
    if (spread.length >= MAX_THREADS) break
    if (th.grammar === 'ligne' && lines >= MAX_LINE_THREADS) continue
    admit(th)
  }
  /* Deuxième passe : s'il reste des emplacements (peu de pêle-mêle disponible),
     on les rend aux lignes plutôt que de laisser l'écran plus court sans raison. */
  if (spread.length < MAX_THREADS) {
    for (const th of threads) {
      if (spread.length >= MAX_THREADS) break
      if (spread.some((s) => s.anchorSlug === th.anchorSlug)) continue
      admit(th)
    }
  }
  return spread
}

/* ─────────────────── LA LIGNE FACTUELLE DU HAUT ───────────────────
 * §7, règle annexe sur les nombres : « un nombre n'est autorisé que s'il est
 * accompagné, dans la même phrase, de l'énumération ou des dates qui le
 * composent ». D'où : en grammaire `ligne`, le compte sort avec sa période ;
 * en `pele-mele`, il ne sort PAS du tout, parce qu'il n'y a aucune période à
 * lui adjoindre. On ne dit pas « cinq fois » quand on ne sait pas quand. */
export function threadFactLine(
  th: MirrorThread,
  locale: 'fr' | 'en',
  fmtMonthYear: (iso: string) => string
): string {
  const n = th.readings.length
  if (th.grammar === 'ligne' && th.span) {
    const from = fmtMonthYear(th.span.from)
    const to = fmtMonthYear(th.span.to)
    return locale === 'en'
      ? `${n} readings, between ${from} and ${to}.`
      : `${n} lectures, entre ${from} et ${to}.`
  }
  return locale === 'en'
    ? 'These readings are not dated.'
    : 'Ces lectures ne sont pas datées.'
}

/* ────────────────── LE GARDE-FOU DE SORTIE ──────────────────
 * §7 interdits 2, 3, 4, 5, 11 : la porte lexicale. Ce mode ne génère aucune
 * prose, donc rien ne devrait jamais l'atteindre — c'est exactement pour ça
 * qu'il faut la tester. Elle s'applique à TOUT texte que l'app produit
 * elle-même (les libellés d'écran), jamais aux citations du rêveur, qui sont
 * souveraines (§5.3) et peuvent contenir n'importe lequel de ces mots. */
export const FORBIDDEN_OUTPUT = [
  /\btu es\b/i, /\btu as tendance\b/i, /\bton rapport à\b/i, /\bta peur de\b/i,
  /\bton besoin de\b/i, /\btu cherches à\b/i,
  /\bombre\b/i, /\bpart sombre\b/i, /\bcôté obscur\b/i, /\brefoulé\b/i, /\bton inconscient\b/i,
  /\bdépassé\b/i, /\brég(?:lé|lée)\b/i, /\bguéri\b/i, /\brésolu\b/i, /\bsurmonté\b/i,
  /\bétape\b/i, /\bphase\b/i, /\btu as avancé\b/i, /\bprogress/i, /\bévolution\b/i,
  /\bparce que\b/i, /\bà cause de\b/i, /\bcela vient de\b/i, /\best lié à ton\b/i,
  /\btu as raison\b/i, /\bexactement\b/i, /\bbelle intuition\b/i, /\bc'est très juste\b/i,
]

/** `true` si un libellé produit par l'app franchit une red line. */
export function violatesOutputGate(appText: string): string | null {
  for (const rx of FORBIDDEN_OUTPUT) if (rx.test(appText)) return rx.source
  return null
}
