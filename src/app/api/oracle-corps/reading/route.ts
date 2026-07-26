import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

/**
 * /api/oracle-corps/reading
 *
 * Spec : 2_DESIGN.md §11.bis.20.12 (Re-spec Oracle du Corps).
 *
 * POST { marker_id?, sensation_text?, zone?, zone_custom_text?, side?, view_face? }
 *   → polyphonie 3 voix corps (paper / stone / silk)
 *
 * Voix appelables (le modèle choisit selon contexte sensation/zone) :
 *   paper · DAMASIO (somatic markers) ou GENDLIN (felt-sense)
 *   stone · MARTEL (sens psychologique des maladies) ou DETHLEFSEN (Krankheit als Weg)
 *   silk  · MOSS (rule of skin) ou ODOUL (langage du corps) ou MINDELL (dreambody)
 *
 * Cadrage P-Inversion (§11.bis.20.12) : "le corps parle, mais c'est toi qui sais
 * ce qu'il dit". Vocabulaire désensorcelé. Pas de "selon Damasio" en visible.
 */

export const maxDuration = 45

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 900

interface ReadingVoice {
  voice: string // ex: "paper", "stone", "silk" — l'auteur convoqué reste interne
  text: string
}
interface ReadingResult {
  paper: ReadingVoice
  stone: ReadingVoice
  silk: ReadingVoice
}

const SYSTEM_PROMPT = `Tu es la lecture polyphonique de l'Oracle du Corps de Dream App.

ROLE :
Tu reçois une sensation corporelle (zone + texte libre + côté + intensité éventuelle).
Tu réponds par TROIS voix courtes, chacune un angle distinct, sans diagnostiquer.

POSTURE NON-NÉGOCIABLE — P-Inversion :
- Le corps parle, MAIS c'est l'utilisateur qui sait ce qu'il dit.
- Tu PROPOSES des angles, JAMAIS la conclusion.
- Vocabulaire conditionnel : "ça pourrait", "il y a des lignées qui disent", "certains entendent ici".
- Vocabulaire désensorcelé INFUSE (pas wellness corp, pas pop-spi, pas médical).
- Tutoiement français, doux, direct, peu de filler.
- JAMAIS nommer un auteur ou un livre en visible. Les voix sont absorbées, pas scholaires.
- JAMAIS de promesse ("ça va guérir", "tu te sentiras mieux").
- JAMAIS de diagnostic médical ou psychologique.

LES TROIS VOIX (CHOISIS L'ANGLE LE PLUS PERTINENT) :

paper — voix scientifique-sensorielle :
  Soit lignée des marqueurs somatiques (le corps comme système d'évaluation préverbal,
  les sensations comme indicateurs avant la pensée).
  Soit lignée du felt-sense (sentir avant nommer, laisser le sens émerger lentement
  d'une sensation floue qui s'éclaircit quand on l'écoute).

stone — voix sens psychologique du corps :
  Soit lignée des correspondances émotion-organe (chaque zone porte une mémoire,
  un conflit, un sens psychologique récurrent — ce que le corps porte que la
  conscience n'a pas encore saisi).
  Soit lignée polarité maladie-chemin (le symptôme comme expression de ce qui
  cherche à s'équilibrer, polarités opposées qui demandent intégration).

silk — voix du corps-rêveur, oniromancie somatique :
  Soit lignée règle de la peau (le corps comme limite-membrane qui distingue
  dehors/dedans et porte les rêves jusqu'à la veille).
  Soit lignée dreambody (le corps a son rêve propre, le symptôme est un personnage
  qui veut être entendu, pas combattu).
  Soit lignée langage symbolique des organes (chaque zone = un lieu archetypal :
  "le lieu du père", "le lieu de la base", etc.).

FORMAT DE SORTIE — JSON strict :
{
  "paper": { "voice": "paper", "text": "..." },
  "stone": { "voice": "stone", "text": "..." },
  "silk":  { "voice": "silk",  "text": "..." }
}

Chaque text :
- 2 à 4 phrases courtes
- formulation conditionnelle, ouverte
- ZÉRO mention d'auteur, de livre, de page
- ZÉRO formule "selon X"
- termine ouvert, jamais conclusif

Réponse : UNIQUEMENT le JSON, rien avant, rien après.`

function buildUserContext(opts: {
  zone?: string | null
  zoneCustomText?: string | null
  side?: string | null
  viewFace?: string | null
  intensity?: number | null
  valence?: number | null
  sensationText?: string | null
  contextText?: string | null
}): string {
  const parts: string[] = []
  const zoneLabel = opts.zoneCustomText
    ? `${opts.zone || 'autre'} — ${opts.zoneCustomText}`
    : opts.zone || 'non précisée'
  parts.push(`Zone : ${zoneLabel}`)
  if (opts.side) parts.push(`Côté : ${opts.side}`)
  if (opts.viewFace) parts.push(`Vue : ${opts.viewFace}`)
  if (opts.intensity != null) parts.push(`Intensité : ${opts.intensity}/5`)
  if (opts.valence != null) parts.push(`Tonalité (valence) : ${opts.valence}`)
  if (opts.sensationText) parts.push(`Sensation décrite : « ${opts.sensationText} »`)
  if (opts.contextText) parts.push(`Contexte : ${opts.contextText}`)
  parts.push('')
  parts.push("Donne-moi les trois voix sous le format JSON spécifié, en t'adaptant à cette sensation.")
  return parts.join('\n')
}

function tryParseReading(raw: string): ReadingResult | null {
  // Le modèle peut entourer de ```json ... ```. On extrait le premier objet JSON.
  let s = raw.trim()
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fence) s = fence[1].trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  const slice = s.slice(start, end + 1)
  try {
    const parsed = JSON.parse(slice)
    if (
      parsed?.paper?.text &&
      parsed?.stone?.text &&
      parsed?.silk?.text
    ) {
      return {
        paper: { voice: 'paper', text: String(parsed.paper.text) },
        stone: { voice: 'stone', text: String(parsed.stone.text) },
        silk: { voice: 'silk', text: String(parsed.silk.text) },
      }
    }
  } catch {
    return null
  }
  return null
}

const FALLBACK_READING: ReadingResult = {
  paper: {
    voice: 'paper',
    text: "Cette sensation pourrait être un signal pré-verbal, un marqueur que le corps pose avant que la pensée ne nomme. Reste avec elle un instant, sans la résoudre. Vois ce qui s'éclaircit quand tu l'écoutes.",
  },
  stone: {
    voice: 'stone',
    text: "Ce que tu portes là pourrait avoir une mémoire. Pas forcément la tienne, pas forcément récente. Certaines lignées disent que le corps garde ce que la conscience n'a pas eu le temps d'accueillir.",
  },
  silk: {
    voice: 'silk',
    text: "Et si cette sensation était un personnage du corps-rêve qui demande à être entendu ? Pas combattu, pas résolu — juste tenu. Vois si elle veut te dire quelque chose si tu lui laisses la place.",
  },
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()

  let zone: string | null = body.zone ? String(body.zone) : null
  let zoneCustomText: string | null = body.zone_custom_text ? String(body.zone_custom_text).slice(0, 200) : null
  let side: string | null = body.side ? String(body.side) : null
  let viewFace: string | null = body.view_face ? String(body.view_face) : null
  let intensity: number | null = body.intensity != null ? Number(body.intensity) : null
  let valence: number | null = body.valence != null ? Number(body.valence) : null
  let sensationText: string | null = body.sensation_text ? String(body.sensation_text).slice(0, 800) : null
  let contextText: string | null = body.context_text ? String(body.context_text).slice(0, 800) : null

  // Si marker_id fourni → enrichit le contexte depuis la base
  if (body.marker_id) {
    const { data: marker, error } = await supabase
      .from('body_oracle_markers')
      .select('zone, zone_custom_text, side, view_face, intensity, valence, sensation_text, context_text')
      .eq('id', String(body.marker_id))
      .eq('user_id', userId)
      .maybeSingle()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (marker) {
      zone = zone || marker.zone || null
      zoneCustomText = zoneCustomText || marker.zone_custom_text || null
      side = side || marker.side || null
      viewFace = viewFace || marker.view_face || null
      intensity = intensity ?? marker.intensity ?? null
      valence = valence ?? marker.valence ?? null
      sensationText = sensationText || marker.sensation_text || null
      contextText = contextText || marker.context_text || null
    }
  }

  if (!zone && !zoneCustomText && !sensationText) {
    return NextResponse.json(
      { error: 'au minimum zone, zone_custom_text ou sensation_text est requis' },
      { status: 400 }
    )
  }

  const userMessage = buildUserContext({
    zone,
    zoneCustomText,
    side,
    viewFace,
    intensity,
    valence,
    sensationText,
    contextText,
  })

  try {
    const resp = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const textBlock = resp.content.find((b) => b.type === 'text')
    const raw = textBlock && textBlock.type === 'text' ? textBlock.text : ''
    const reading = tryParseReading(raw)

    if (!reading) {
      console.warn('[oracle-corps/reading] JSON parse failed, using fallback. Raw:', raw.slice(0, 300))
      return NextResponse.json({
        reading: FALLBACK_READING,
        framing: "Voici trois angles. Le corps parle, mais c'est toi qui sais ce qu'il dit.",
        fallback: true,
      })
    }

    return NextResponse.json({
      reading,
      framing: "Voici trois angles. Le corps parle, mais c'est toi qui sais ce qu'il dit.",
      usage: resp.usage,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[oracle-corps/reading] Anthropic call failed:', msg)
    return NextResponse.json({
      reading: FALLBACK_READING,
      framing: "Voici trois angles. Le corps parle, mais c'est toi qui sais ce qu'il dit.",
      fallback: true,
      error: msg,
    })
  }
}
