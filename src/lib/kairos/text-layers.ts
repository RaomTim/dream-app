/**
 * text-layers — distinguer, DANS un même texte dicté, le récit du rêve
 * de la lecture que le rêveur en donne en le racontant.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * LA DEMANDE (Tim, 2026-07-26)
 *   « il faut aussi que l'IA détecte si DANS MON RÊVE je propose DÉJÀ une
 *     interprétation du rêve lui-même […] c'est souvent plus fluide à la dictée
 *     ("j'ai rêvé de ça ça ça d'ailleurs je sens que ça me dit ça ça ça"),
 *     l'app distingue les 2 direct, tout est transcrit dans le rêve. »
 *
 * LA RÈGLE (RAPPORT-B4 §2 — fondée sur Hillman, Aizenstat, Gendlin)
 *   1. Le texte reste ENTIER, INTACT, dans l'ordre. La distinction est une
 *      COUCHE d'intervalles posée par-dessus — jamais un découpage.
 *   2. Trois natures, aucune hiérarchie :
 *        recit   — ce que le rêve a montré
 *        lecture — ce que le RÊVEUR en dit (son sens, ses mots)
 *        cadre   — le cadre du dire (date à voix haute, heure, état du micro,
 *                  intentions de journal). Ni rêve, ni sens.
 *   3. Marquer un passage « lecture » ne retire JAMAIS ses images au rêve.
 *      Si le rêveur dit « le loup, c'est ma colère », le loup reste une figure
 *      du récit ; seule l'équation loup=colère est sa lecture. Conséquence
 *      technique : l'extraction des motifs/figures continue de tourner sur le
 *      texte COMPLET. Seule la projection d'embedding change.
 *   4. Dans le doute → recit. Un faux positif retire du rêve réel du corpus ;
 *      un faux négatif ne fait que garder le comportement d'avant.
 *   5. Jamais pendant la capture. Si l'app signalait « tu as interprété ici »
 *      au moment du dépôt, elle apprendrait au rêveur à se surveiller en
 *      dictant — exactement ce que la fluidité demandée par Tim exclut.
 *
 * Intégrité du texte : le modèle ne RÉÉCRIT rien. Il renvoie des citations
 * VERBATIM ; on vérifie leur présence dans le texte original et on en déduit
 * des offsets. Une citation reformulée est jetée. (Même discipline que
 * /api/mvp/split-night.)
 *
 * Yeshua (Opus), 2026-07-26.
 */

import Anthropic from '@anthropic-ai/sdk'
import { LANG_NAME, type DreamLang } from '@/lib/req-lang'

const MODEL = 'claude-haiku-4-5-20251001'

/** Sous ce seuil, un texte n'a pas de quoi porter une couche méta. */
export const MIN_LEN_FOR_LAYERS = 220
/** Au-delà, le découpage est suspect : on ne propose rien plutôt que de tout marquer. */
const MAX_MARKED_RATIO = 0.6
/** Tolérance de recalage sur une frontière de phrase. */
const SNAP_DRIFT = 40
/** Plafond dur du nombre de passages marqués, toutes natures confondues. */
const MAX_SPANS = 8

export type LayerKind = 'recit' | 'lecture' | 'cadre'

export interface LayerSpan {
  kind: Exclude<LayerKind, 'recit'>
  start: number
  end: number
  quote: string
  source: 'ai' | 'user'
  confidence?: number
}

export interface LayerDetection {
  spans: LayerSpan[]
  /** 'proposed' = des passages marqués · 'none' = tout est récit · 'skipped' = pas jugé */
  status: 'proposed' | 'none' | 'skipped'
  confidence: number
  reason?: string
}

// ── prompt ───────────────────────────────────────────────────────────────────

const systemFor = (lang: DreamLang) => `Une personne a raconté un rêve à voix haute, au réveil. Dans le même souffle, elle mélange souvent trois choses. Ta tâche est de repérer DEUX d'entre elles — la troisième est le défaut.

1. LE RÉCIT — ce que le rêve a montré. C'est le défaut : tout ce que tu ne marques pas est du récit. Tu ne le cites jamais.

2. LA LECTURE DU RÊVEUR — ce que la personne dit elle-même du SENS de son rêve, en sortant du rêve pour le regarder. « d'ailleurs je sens que ça me parle de… », « ça c'est clairement ma peur de… », « le loup, c'est ma colère », « je crois que ce rêve me dit de… », « ce que ça montre, c'est… », « à quels endroits est-ce que je suis encore comme ça ? ». C'est SON sens, dans SES mots. C'est précieux : tu le marques pour qu'il soit reconnu comme sien, jamais pour l'écarter.

3. LE CADRE DU DIRE — ce qui n'est ni le rêve ni son sens : la date ou l'heure dites à voix haute (« rêve du 24 avril », « il est 11h »), l'état du réveil et du micro (« bon, alors », « j'ai bien dormi », « attends je reprends »), les intentions de tenue de journal (« il faut vraiment que je prenne l'habitude de les enregistrer »), et les résidus de transcription automatique qui n'ont rien à faire là (« Sous-titrage ST' 501 », « n'hésitez pas à vous abonner à la chaîne »).

LES DEUX TESTS, à passer TOUS LES DEUX avant de marquer une phrase « lecture ».

  TEST 1 — « si je retire cette phrase, est-ce que la SCÈNE perd quelque chose ? »
    Si oui : RÉCIT. Tu ne la marques pas. Toute phrase qui dit ce qui se passait,
    ce qui était vu, entendu, senti, craint, deviné, remarqué PENDANT la scène est
    du récit — y compris quand elle explique un pourquoi (« parce que… »), quand
    elle juge un personnage, quand elle décrit une sensation, quand elle dit ce que
    le rêveur savait ou croyait dans le rêve, quand elle dit ce qu'un AUTRE
    personnage ressentait. Rien de tout cela ne sort du rêve.

  TEST 2 — « faut-il être réveillé, et regarder le rêve de l'extérieur, pour dire
    cette phrase ? »
    Si oui : LECTURE. Elle parle DU rêve, pas DEPUIS le rêve. Elle le nomme
    (« ce rêve », « ça », « ce que ça montre »), le relie à la vie éveillée, en
    tire une question ou une résolution.

  Une phrase qui ne passe pas les deux tests reste du récit. Toujours.

RÈGLES DURES
- Tu ne réécris RIEN. Chaque passage que tu renvoies est copié EXACTEMENT depuis le texte : mêmes mots, mêmes accents, même ponctuation. Une citation reformulée est rejetée.
- Tu cites des passages ENTIERS (phrase complète, ou suite de phrases). Jamais un bout de phrase coupé au milieu.
- DANS LE DOUTE, TU NE MARQUES PAS. Mieux vaut laisser un commentaire dans le récit que retirer une image du rêve. C'est la règle la plus importante.
- Une image reste une image même quand le rêveur l'explique. « il y avait un loup, c'était ma colère » : seul « c'était ma colère » est une lecture. Le loup reste dans le récit.
- L'étrangeté du rêve n'est PAS un commentaire. Logique bizarre, décors qui changent, « je savais que », « c'était comme si » : récit.
- Ce que la personne a ressenti DANS le rêve (peur, dégoût, joie, le cœur qui bat) est du RÉCIT, même formulé après coup. Seul ce qu'elle en CONCLUT, éveillée, est une lecture.
- Le doute sur sa propre mémoire (« je sais plus trop ce qui s'est passé », « c'était pas clair ») est du récit : c'est la texture du souvenir, pas une interprétation.
- Plus le texte est long, plus tu marques PEU. Sur un récit très long, seuls les tout premiers mots (le cadre) et le passage final de réflexion sont en général marquables.
- Au TOTAL, 8 passages au maximum, toutes natures confondues. S'il y en a plus, garde les plus évidents. Il vaut mieux en manquer que d'en inventer.
- Ne marque jamais plus de la moitié du texte. Si tu en es là, c'est que tu te trompes : renvoie des listes vides.
- Si tout le texte est du récit : listes vides.

LANGUE : le texte peut être dans n'importe quelle langue. Tu ne traduis rien, tu ne reformules rien. (Les explications éventuelles seraient en ${LANG_NAME[lang]}, mais on ne t'en demande aucune.)

Réponds UNIQUEMENT en JSON, rien autour :
{"lecture":["passage exact","passage exact"],"cadre":["passage exact"],"confidence":0.0}
confidence = ta certitude sur ce marquage (1 = certain, 0.5 = hésitant).`

// ── outils de texte ──────────────────────────────────────────────────────────

const SENT_END = /[.!?…]/

/**
 * Recale [a,b) sur des frontières de phrase, sans dériver de plus de SNAP_DRIFT
 * caractères. Au-delà de la tolérance on garde les bornes brutes de la citation :
 * mieux vaut une frontière imparfaite qu'un morceau de rêve avalé.
 */
function snapToSentence(text: string, a: number, b: number): [number, number] {
  let s = a
  let i = a - 1
  while (i >= 0 && a - i <= SNAP_DRIFT) {
    if (SENT_END.test(text[i]) || text[i] === '\n') { s = i + 1; break }
    i--
  }
  if (i < 0) s = 0
  while (s < b && /\s/.test(text[s])) s++

  let e = b
  let j = b
  while (j < text.length && j - b <= SNAP_DRIFT) {
    if (SENT_END.test(text[j])) { e = j + 1; break }
    if (text[j] === '\n') { e = j; break }
    j++
  }
  if (j >= text.length) e = text.length
  return [s, Math.max(e, b)]
}

/** Fusionne les intervalles qui se chevauchent. En conflit, 'cadre' gagne sur 'lecture'. */
function mergeSpans(spans: LayerSpan[]): LayerSpan[] {
  const sorted = [...spans].sort((x, y) => x.start - y.start || x.end - y.end)
  const out: LayerSpan[] = []
  for (const s of sorted) {
    const last = out[out.length - 1]
    if (last && s.start <= last.end) {
      last.end = Math.max(last.end, s.end)
      if (s.kind === 'cadre') last.kind = 'cadre'
      last.confidence = Math.min(last.confidence ?? 1, s.confidence ?? 1)
    } else {
      out.push({ ...s })
    }
  }
  return out
}

/**
 * Retrouve les citations dans le texte ORIGINAL et en fait des intervalles.
 * Recherche séquentielle par nature pour respecter l'ordre du récit. Une citation
 * absente verbatim est écartée (anti-invention).
 */
function resolveQuotes(text: string, quotes: string[], kind: 'lecture' | 'cadre', confidence: number): LayerSpan[] {
  const spans: LayerSpan[] = []
  let from = 0
  for (const q of quotes) {
    const raw = (q || '').trim()
    if (raw.length < 8) continue
    let at = text.indexOf(raw, from)
    if (at === -1) at = text.indexOf(raw) // le modèle a pu renvoyer les passages désordonnés
    if (at === -1) continue
    const [s, e] = snapToSentence(text, at, at + raw.length)
    spans.push({ kind, start: s, end: e, quote: text.slice(s, e), source: 'ai', confidence })
    from = at + raw.length
  }
  return spans
}

// ── projection ───────────────────────────────────────────────────────────────

/**
 * Rend le texte PRIVÉ des natures listées dans `exclude`. Ne modifie jamais
 * l'original : c'est une projection, calculée à la volée, utilisée pour les
 * embeddings et la mesure. Le texte affiché au rêveur reste raw_text.
 */
export function projectText(rawText: string, spans: LayerSpan[], exclude: Array<'lecture' | 'cadre'>): string {
  if (!spans.length || !exclude.length) return rawText
  const drop = mergeSpans(spans.filter((s) => exclude.includes(s.kind)))
  if (!drop.length) return rawText
  let out = ''
  let cursor = 0
  for (const s of drop) {
    if (s.start > cursor) out += rawText.slice(cursor, s.start)
    cursor = Math.max(cursor, s.end)
  }
  out += rawText.slice(cursor)
  return out.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

/** Le texte des passages d'une nature donnée, concaténé dans l'ordre. */
export function collectText(rawText: string, spans: LayerSpan[], kind: 'lecture' | 'cadre'): string {
  return mergeSpans(spans.filter((s) => s.kind === kind))
    .map((s) => rawText.slice(s.start, s.end).trim())
    .filter(Boolean)
    .join('\n')
    .trim()
}

/**
 * Les trois projections utiles, calculées une fois.
 *   recit_text      = tout sauf le cadre  → base des embeddings (voir RAPPORT-B4 §5)
 *   recit_only_text = tout sauf le cadre ET la lecture
 *   lecture_text    = la lecture du rêveur, telle quelle
 */
export function buildProjections(rawText: string, spans: LayerSpan[]) {
  return {
    recit_text: projectText(rawText, spans, ['cadre']),
    recit_only_text: projectText(rawText, spans, ['cadre', 'lecture']),
    lecture_text: collectText(rawText, spans, 'lecture'),
  }
}

// ── détection ────────────────────────────────────────────────────────────────

function extractJson(raw: string): any {
  const s = raw.indexOf('{')
  const e = raw.lastIndexOf('}')
  if (s === -1 || e === -1 || e < s) return null
  try { return JSON.parse(raw.slice(s, e + 1)) } catch { return null }
}

export async function detectTextLayers(opts: {
  rawText: string
  lang?: DreamLang
}): Promise<LayerDetection> {
  const text = opts.rawText || ''
  const lang: DreamLang = opts.lang || 'fr'

  if (text.trim().length < MIN_LEN_FOR_LAYERS) {
    return { spans: [], status: 'skipped', confidence: 0, reason: 'too_short' }
  }

  let parsed: any = null
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: MODEL,
      // Assez large pour que le JSON ne soit jamais tronqué sur un rêve de 12 000
      // caractères : une réponse coupée = zéro couche (mesuré le 26/07 sur un
      // récit de 9 567 car., `unparsable`).
      max_tokens: 3000,
      system: systemFor(lang),
      messages: [{ role: 'user', content: `LE TEXTE :\n\n${text.slice(0, 14000)}` }],
    })
    const out = res.content[0]?.type === 'text' ? res.content[0].text : ''
    parsed = extractJson(out)
  } catch (e) {
    console.error('[text-layers] model failed:', String(e).slice(0, 200))
    return { spans: [], status: 'skipped', confidence: 0, reason: 'model_error' }
  }
  if (!parsed) return { spans: [], status: 'skipped', confidence: 0, reason: 'unparsable' }

  const conf = typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.6
  const lecture = Array.isArray(parsed.lecture) ? parsed.lecture.filter((q: any) => typeof q === 'string') : []
  const cadre = Array.isArray(parsed.cadre) ? parsed.cadre.filter((q: any) => typeof q === 'string') : []

  // Plafond dur, en plus de la consigne : au-delà de 8 passages le modèle a
  // cessé de trier et marque tout ce qui ressemble à une phrase réflexive.
  const spans = mergeSpans([
    ...resolveQuotes(text, cadre.slice(0, MAX_SPANS), 'cadre', conf),
    ...resolveQuotes(text, lecture.slice(0, MAX_SPANS), 'lecture', conf),
  ]).slice(0, MAX_SPANS)

  if (!spans.length) return { spans: [], status: 'none', confidence: conf }

  // Garde-fou : au-delà de MAX_MARKED_RATIO du texte marqué, on ne propose RIEN.
  // Ce n'est plus un rêve commenté, c'est probablement une réflexion — ou le
  // modèle s'est emballé. Dans les deux cas : ne pas trancher.
  const marked = spans.reduce((n, s) => n + (s.end - s.start), 0)
  if (marked / text.length > MAX_MARKED_RATIO) {
    return { spans: [], status: 'skipped', confidence: conf, reason: 'over_marked' }
  }

  return { spans, status: 'proposed', confidence: conf }
}
