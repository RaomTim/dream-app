import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang } from '@/lib/req-lang'

/**
 * POST /api/mvp/split-night — découpe une NUIT en rêves distincts (§12bis.D).
 *
 * Body : { text, markers? }
 *   - text    : la transcription/le texte de la nuit.
 *   - markers : nombres (secondes écoulées) posés par le bouton « rêve suivant »
 *               pendant l'enregistrement voix. Ils comptent comme un signal FORT
 *               d'intention (la personne a dit « là, ça change de rêve »), mais
 *               PAS comme des positions littérales : gpt-4o-transcribe ne rend pas
 *               d'horodatage par mot, donc on ne peut pas mapper un marqueur voix
 *               à un offset de caractère. On passe donc leur NOMBRE à Haiku comme
 *               indice (« attends-toi à ~N+1 rêves ») ; c'est Haiku qui pose les
 *               coupures là où le récit les confirme. (À l'écrit, « --- » / « autre
 *               rêve » restent, eux, des frontières DURES — voir normalizeHard.)
 *
 * Retour : { dreams: [{ text }], confidence }
 *   - 1 seul rêve détecté → dreams de longueur 1 : l'UI ne change RIEN au flux actuel.
 *
 * Intégrité du texte : Haiku ne RÉÉCRIT jamais le rêve. Il renvoie seulement les
 * premiers mots (ancres) de chaque nouveau rêve ; on découpe le texte ORIGINAL sur
 * ces ancres + les marqueurs ⁂. Aucune reformulation, aucune perte.
 *
 * Yeshua (Opus), 2026-07-12.
 */
export const maxDuration = 30

const MODEL = 'claude-haiku-4-5-20251001'
const HARD = '⁂'

// Frontières DURES écrites par la personne (§12bis.D, cas 2 : texte) → sentinelle ⁂.
// On ne touche qu'aux lignes qui SONT un séparateur (tirets seuls, « autre/nouveau
// rêve » isolé) — jamais « j'ai fait un autre rêve où… » au fil d'une phrase.
function normalizeHard(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/(^|\n)[ \t]*[-–—_*]{3,}[ \t]*(?=\n|$)/g, `$1${HARD}`)
    .replace(/(^|\n)[ \t>*·.-]*\(?(?:autre|nouveau)\s+r[êe]ve\)?[ \t]*[:.\-–—]?[ \t]*(?=\n|$)/gi, `$1${HARD}`)
    .replace(/(^|\n)[ \t>*·.-]*\(?another\s+dream\)?[ \t]*[:.\-–—]?[ \t]*(?=\n|$)/gi, `$1${HARD}`)
}

// Découpe le texte ORIGINAL (avec ses ⁂) aux frontières = positions ⁂ + ancres Haiku.
// On ne fabrique jamais de texte : on ne fait que trancher et nettoyer les ⁂.
function splitByCuts(text: string, anchors: string[]): string[] {
  const positions = new Set<number>([0])
  // ⁂ (frontières dures) — toujours des coupures
  let idx = text.indexOf(HARD)
  while (idx !== -1) { positions.add(idx); idx = text.indexOf(HARD, idx + 1) }
  // ancres (frontières implicites détectées par Haiku) — recherche séquentielle
  // pour respecter l'ordre et éviter qu'une ancre retombe sur une occurrence antérieure.
  const lower = text.toLowerCase()
  let from = 0
  for (const a of anchors) {
    const key = (a || '').trim().toLowerCase().replace(/\s+/g, ' ')
    if (key.length < 4) continue
    const at = lower.indexOf(key, from)
    if (at > 0) { positions.add(at); from = at + key.length }
  }
  const sorted = Array.from(positions).sort((x, y) => x - y)
  const segs: string[] = []
  for (let i = 0; i < sorted.length; i++) {
    const start = sorted[i]
    const end = i + 1 < sorted.length ? sorted[i + 1] : text.length
    segs.push(text.slice(start, end))
  }
  return segs
    .map(s => s.replace(new RegExp(HARD, 'g'), ' ').replace(/[ \t]+\n/g, '\n').trim())
    .filter(s => s.length >= 2)
}

function extractJson(raw: string): any {
  const s = raw.indexOf('{')
  const e = raw.lastIndexOf('}')
  if (s === -1 || e === -1 || e < s) return null
  try { return JSON.parse(raw.slice(s, e + 1)) } catch { return null }
}

const SYSTEM = `Tu sépares le récit d'une NUIT en rêves distincts. Une nuit peut contenir plusieurs rêves : la personne se réveille et se rendort, ou change complètement de décor ET d'histoire, ou dit « et puis un autre rêve », « ensuite j'ai rêvé que… » (ou, en anglais, « and then another dream », « then I dreamt that… »). Chaque rêve = une scène/histoire cohérente.

LANGUE : le texte peut être écrit dans n'importe quelle langue (français, anglais, autre). Tu ne traduis RIEN et tu ne réécris RIEN : les ancres que tu renvoies sont des extraits copiés mot pour mot du texte, dans sa langue d'origine.

Le texte peut contenir le marqueur ⁂ : c'est une frontière POSÉE PAR LA PERSONNE, toujours une coupure — ne la discute pas.

TA TÂCHE : repérer où commence chaque NOUVEAU rêve (après le premier). Pour chacun, renvoie ses 6 à 10 PREMIERS MOTS, copiés EXACTEMENT depuis le texte (mêmes mots, mêmes accents, aucune reformulation) — c'est une ancre qui sert à couper.

RÈGLES :
- Ne coupe QUE sur un vrai changement de rêve. Un même rêve qui se déroule, change de lieu ou de personnage SANS rupture de récit = UN seul rêve.
- Dans le doute, NE coupe PAS : mieux vaut un rêve gardé entier que tronçonné.
- Si tout le texte est un seul rêve : renvoie une liste "cuts" vide.
- N'invente jamais de mots : chaque ancre doit exister telle quelle dans le texte.

Réponds UNIQUEMENT en JSON, rien autour :
{"cuts": ["premiers mots du 2e rêve", "premiers mots du 3e rêve"], "confidence": 0.0}
confidence = ta certitude sur le découpage (1 = certain, 0.5 = hésitant).`

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error

    // Cette route ne rend AUCUNE prose : elle renvoie des tranches du texte ORIGINAL.
    // La langue ne sert donc qu'aux messages d'erreur (les seuls textes vus à l'écran).
    const lang = reqLang(req)

    const raw = typeof body.text === 'string' ? body.text.trim().slice(0, 12000) : ''
    if (raw.length < 3) {
      return corsify(NextResponse.json({
        error: lang === 'en' ? 'text required' : 'text requis',
      }, { status: 400 }))
    }
    const markers: number[] = Array.isArray(body.markers)
      ? body.markers.filter((m: any) => typeof m === 'number' && isFinite(m)).slice(0, 20)
      : []

    const normalized = normalizeHard(raw)
    const hasHard = normalized.includes(HARD)

    // Court-circuit économe : texte court, aucune frontière dure, aucun marqueur voix
    // → un seul rêve, on n'appelle pas Haiku (zéro friction, zéro coût sur le cas 90 %).
    if (!hasHard && markers.length === 0 && raw.length < 200) {
      return corsify(NextResponse.json({ dreams: [{ text: raw }], confidence: 0.9 }))
    }

    // Indice de comptage : les marqueurs voix + les ⁂ écrits disent combien de
    // ruptures la personne a signalées. Haiku s'en sert sans y être asservi.
    const hardCount = (normalized.match(new RegExp(HARD, 'g')) || []).length
    const signalled = markers.length + hardCount
    const hint = signalled > 0
      ? `\n\nINDICE : la personne a signalé ${signalled} frontière(s) (bouton « rêve suivant » ou séparateur écrit). Attends-toi à environ ${signalled + 1} rêves, mais ne coupe que là où le récit le confirme.`
      : ''

    let anchors: string[] = []
    let confidence = 0.6
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
      const res = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 500,
        system: SYSTEM,
        messages: [{ role: 'user', content: `LA NUIT :\n\n${normalized}${hint}` }],
      })
      const outText = res.content[0]?.type === 'text' ? res.content[0].text : ''
      const parsed = extractJson(outText)
      if (parsed) {
        anchors = Array.isArray(parsed.cuts) ? parsed.cuts.filter((c: any) => typeof c === 'string') : []
        if (typeof parsed.confidence === 'number') confidence = Math.max(0, Math.min(1, parsed.confidence))
      }
    } catch (e) {
      // Haiku indisponible : on retombe sur les frontières DURES seules (⁂), sinon single.
      console.error('[mvp.split-night] haiku failed, hard-split fallback:', e)
      confidence = hasHard ? 0.5 : 0.3
    }

    let dreams = splitByCuts(normalized, anchors)
    // Garde-fou : jamais plus de 8 rêves d'une nuit (au-delà = découpage douteux → on garde entier).
    if (dreams.length > 8) { dreams = [raw]; confidence = Math.min(confidence, 0.4) }
    if (dreams.length <= 1) {
      return corsify(NextResponse.json({ dreams: [{ text: raw }], confidence }))
    }
    return corsify(NextResponse.json({ dreams: dreams.map(text => ({ text })), confidence }))
  } catch (e: any) {
    console.error('[mvp.split-night]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
