import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

/**
 * /api/nightmares/forest-reading
 *
 * Spec : 2_DESIGN.md §11.bis.20.13 (Re-spec Sanctuaire Cauchemars/Deuil —
 * interprétation Forêt nuancée trauma-safe).
 *
 * POST { dream_id?, raw_text? } → polyphonie 3 voix filtrées trauma-safe
 *
 * Voix appelables :
 *   paper · KALSCHED (Inner World of Trauma) ou AIZENSTAT
 *           (cauchemars comme messagers, pas ennemis)
 *   stone · LEVINE (Waking the Tiger) ou OGDEN (Trauma and the Body)
 *   silk  · MOSS (Lightning Dreamwork pour cauchemars) ou JUNG-via-AIZENSTAT
 *
 * Voix EXCLUES (red lines §11.bis.20.13) : Hillman pure underworld
 * (trop dark), Wangyal sleep yoga (technique avancée trop exigeante en crise).
 *
 * Garde-fous :
 *   - frozen_until > now() → 403 "voie suspendue"
 *   - signal clinique (suicide / dissociation / panique aiguë) →
 *     EXIT_TO_HUMAN avec 3114 + SOS Amitié + 112
 *
 * Cadrage explicite (§11.bis.20.13) : "Voici trois angles. Aucun ne nie la
 * lourdeur. Aucun ne dit pourquoi. Ils proposent des manières de TENIR ce
 * qui est venu."
 */

export const maxDuration = 45

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 1100

// ── Crisis detection (mirroir de dream-chat/converse §39.8) ─────────
const CRISIS_PATTERNS: Record<string, RegExp> = {
  suicide:
    /\b(en finir|me tuer|suicide|suicider|me supprimer|veux mourir|veux plus vivre|plus envie de vivre|en avoir fini|rien à faire ici|disparaître)\b/i,
  dissociation:
    /\b(plus mon corps|plus réel|détaché|dissocier|dissociation|comme si j['’]étais pas|pas dans mon corps)\b/i,
  acute_panic:
    /\b(panique aiguë|crise de panique|peux pas respirer|étouffer maintenant|urgence vitale)\b/i,
}

function detectCrisis(text: string): { detected: boolean; type?: string } {
  for (const [type, pattern] of Object.entries(CRISIS_PATTERNS)) {
    if (pattern.test(text)) return { detected: true, type }
  }
  return { detected: false }
}

const FRAMING =
  "Voici trois angles. Aucun ne nie la lourdeur. Aucun ne dit pourquoi. Ils proposent des manières de TENIR ce qui est venu."

const FREEZE_RESPONSE = {
  status: 'frozen' as const,
  message:
    "Cette voie est suspendue le temps que tu te restaures. Le sanctuaire reste ouvert si tu veux y déposer ce qui pèse, sans interprétation, sans jugement.",
}

const EXIT_TO_HUMAN_RESPONSE = {
  status: 'exit_to_human' as const,
  message:
    "Ce que tu portes maintenant est trop lourd pour être tenu par moi seule. Quelqu'un de chair, maintenant —",
  resources: {
    FR: [
      { name: '3114 — Numéro national de prévention du suicide', phone: '3114', note: '24/7, gratuit, anonyme' },
      { name: 'SOS Amitié', phone: '09 72 39 40 50', note: 'écoute 24/7' },
      { name: 'SOS Suicide Phénix', phone: '01 40 44 46 45', note: 'tous les jours' },
      { name: 'Urgence vitale immédiate', phone: '15 ou 112', note: 'SAMU / urgences européennes' },
    ],
  },
}

interface ReadingVoice {
  voice: string
  text: string
}
interface ReadingResult {
  paper: ReadingVoice
  stone: ReadingVoice
  silk: ReadingVoice
}

const SYSTEM_PROMPT = `Tu es la lecture polyphonique trauma-safe du Sanctuaire des cauchemars.

CONTEXTE :
L'utilisateur a déposé un cauchemar ou un rêve dense, lourd. Il a CHOISI de demander
des angles de lecture (option opt-in). Tu n'es pas convoquée pour les rêves marqués
"deuil aigu" ni pour les rêves en crise active — la couche d'appel a déjà filtré ça.

POSTURE NON-NÉGOCIABLE — TRAUMA-SAFE ABSOLUE :
- AUCUN angle ne nie la lourdeur. Le rêve est lourd. Tu ne le minimises pas.
- AUCUN angle ne dit "pourquoi". Pas de causalité psychanalytique imposée.
- TU PROPOSES DES MANIÈRES DE TENIR, pas des manières d'expliquer.
- P-Inversion absolue : le sens vient du user, jamais de toi. Tu ouvres trois portes,
  tu n'en franchis aucune.
- Vocabulaire conditionnel : "ça pourrait", "certains lisent ici", "il y a une lignée qui dit".
- Vocabulaire désensorcelé. Pas de wellness corp. Pas de pop-spi. Pas de médical.
- ZÉRO mention d'auteur, de livre, de page en visible. Les voix sont absorbées.
- ZÉRO promesse de soulagement.
- ZÉRO diagnostic.
- Pas d'émojis, pas de filler.

VOIX EXCLUES (red lines §11.bis.20.13) :
- Pas de descente pure dans l'underworld archetypal — trop dark pour cet espace.
- Pas de technique de sleep yoga ou de pratique avancée — trop exigeant en cauchemar.

LES TROIS VOIX (CHOISIS L'ANGLE LE PLUS PERTINENT) :

paper — voix psychologie des profondeurs, posture trauma-curée :
  Soit lignée monde intérieur du trauma : les figures effrayantes du rêve peuvent
  être des protections de la psyché qui tiennent quelque chose à distance pour qu'on
  ne soit pas brisé. Pas pour guérir maintenant — pour comprendre que ce qui semble
  ennemi a peut-être une fonction de garde.
  Soit lignée du cauchemar comme messager : les figures sombres ne sont pas là pour
  punir. Elles portent quelque chose qu'elles essaient de dire dans la seule langue
  qu'elles connaissent.

stone — voix somatique-trauma :
  Soit lignée libération somatique : le corps a peut-être figé une réponse qui n'a
  jamais pu se compléter. Le cauchemar peut être le corps qui essaie de faire passer
  cette charge dans la veille pour qu'elle puisse enfin se traverser. Pas se forcer
  à comprendre — laisser le corps trembler, soupirer, bouger lentement si ça vient.
  Soit lignée corps-trauma intégration : ce qui a été trop pour la pensée se loge
  dans le corps. Le cauchemar peut nommer une zone, une posture, une retenue —
  une carte à lire lentement, à plusieurs.

silk — voix oniromancie trauma-safe :
  Soit lignée du dialogue éclair avec le rêve (sans interprétation imposée) :
  on peut écrire au cauchemar comme à une figure qui visite, lui demander
  "qu'est-ce que tu portes ?" — sans attendre de réponse, juste pour ouvrir la place.
  Soit lignée des figures autonomes : ce qui apparaît dans le rêve a sa propre
  vie. Le cauchemar n'est pas TOI — c'est quelque chose qui vient à travers toi
  cette nuit. Le tenir comme on tient un visiteur lourd, pas comme un verdict.

FORMAT DE SORTIE — JSON strict :
{
  "paper": { "voice": "paper", "text": "..." },
  "stone": { "voice": "stone", "text": "..." },
  "silk":  { "voice": "silk",  "text": "..." }
}

Chaque text :
- 2 à 4 phrases courtes
- formulation conditionnelle, ouverte
- ZÉRO mention d'auteur/livre/page
- ZÉRO formule "selon X"
- termine ouvert, jamais conclusif

Réponse : UNIQUEMENT le JSON, rien avant, rien après.`

const FALLBACK_READING: ReadingResult = {
  paper: {
    voice: 'paper',
    text:
      "Cette figure pourrait n'être pas l'ennemi qu'elle paraît. Certaines lignées disent que le rêve met en scène des gardiens sombres qui tiennent quelque chose à distance — pas pour te blesser, pour qu'autre chose ne brise pas tout. On peut juste reconnaître qu'elle est là, sans la combattre ce soir.",
  },
  stone: {
    voice: 'stone',
    text:
      "Vois ce que ton corps a porté en se réveillant. Une zone, une retenue, une posture. Il y a une lecture qui dit que le corps essaie parfois de finir un mouvement qui n'a jamais pu aller au bout. Pas tout de suite — juste laisser le corps respirer, trembler s'il veut, sans forcer.",
  },
  silk: {
    voice: 'silk',
    text:
      "Tu peux tenir ce rêve comme un visiteur lourd qui passe, pas comme un verdict sur toi. Si tu veux, écris-lui une phrase courte — pas pour comprendre, juste pour reconnaître qu'il est venu. Il a peut-être quelque chose à porter qui n'est pas à toi seule.",
  },
}

function tryParseReading(raw: string): ReadingResult | null {
  let s = raw.trim()
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fence) s = fence[1].trim()
  const start = s.indexOf('{')
  const end = s.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  const slice = s.slice(start, end + 1)
  try {
    const parsed = JSON.parse(slice)
    if (parsed?.paper?.text && parsed?.stone?.text && parsed?.silk?.text) {
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

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()

  // 1️⃣ Garde-fou freeze : si user a activé frozen_until, on refuse cette voie
  const { data: protection } = await supabase
    .from('user_protection_state')
    .select('freeze_until, nightmare_mode_enabled')
    .eq('user_id', userId)
    .maybeSingle()

  if (protection?.freeze_until && new Date(protection.freeze_until).getTime() > Date.now()) {
    return NextResponse.json(FREEZE_RESPONSE, { status: 403 })
  }

  // 2️⃣ Récupère le texte source (dream_id OU raw_text)
  let dreamText: string | null = body.raw_text ? String(body.raw_text).slice(0, 6000) : null
  let dreamMeta: { is_grief_related?: boolean; is_nightmare?: boolean } | null = null

  if (body.dream_id) {
    const { data: dream, error } = await supabase
      .from('dreams')
      .select('content, raw_text, is_nightmare, is_grief_related, frozen_until')
      .eq('id', String(body.dream_id))
      .eq('user_id', userId)
      .maybeSingle()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    if (dream) {
      // dream-level frozen_until → bloqué aussi
      if (dream.frozen_until && new Date(dream.frozen_until).getTime() > Date.now()) {
        return NextResponse.json(FREEZE_RESPONSE, { status: 403 })
      }
      dreamText = dreamText || dream.content || dream.raw_text || null
      dreamMeta = { is_grief_related: dream.is_grief_related, is_nightmare: dream.is_nightmare }
    }
  }

  if (!dreamText || dreamText.trim().length < 10) {
    return NextResponse.json(
      { error: 'dream_id ou raw_text (>10 caractères) requis' },
      { status: 400 }
    )
  }

  // 3️⃣ Garde-fou clinique : signal de crise → EXIT_TO_HUMAN sans IA
  const crisis = detectCrisis(dreamText)
  if (crisis.detected) {
    return NextResponse.json(
      { ...EXIT_TO_HUMAN_RESPONSE, signal_type: crisis.type },
      { status: 200 }
    )
  }

  // 4️⃣ Garde-fou deuil aigu : si dreamMeta.is_grief_related → on refuse aussi
  // l'interprétation (la spec §11.bis.20.13 : "L'accueil pur SANS interprétation
  // reste le DEFAULT pour les rêves marqués deuil")
  if (dreamMeta?.is_grief_related) {
    return NextResponse.json(
      {
        status: 'grief_silence',
        message:
          "Pour ce rêve, je préfère me taire. Le deuil ne s'interprète pas. Le sanctuaire t'accueille sans rien dire — c'est l'espace qui ne juge pas.",
      },
      { status: 200 }
    )
  }

  // 5️⃣ Appel polyphonique trauma-safe
  const userMessage = `Voici le rêve que la personne a déposé :

« ${dreamText.trim()} »

Donne-moi les trois voix sous le format JSON spécifié, en posture trauma-safe absolue.`

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
      console.warn(
        '[nightmares/forest-reading] JSON parse failed, fallback. Raw:',
        raw.slice(0, 300)
      )
      return NextResponse.json({
        status: 'ok',
        reading: FALLBACK_READING,
        framing: FRAMING,
        fallback: true,
      })
    }

    return NextResponse.json({
      status: 'ok',
      reading,
      framing: FRAMING,
      usage: resp.usage,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    console.error('[nightmares/forest-reading] Anthropic call failed:', msg)
    return NextResponse.json({
      status: 'ok',
      reading: FALLBACK_READING,
      framing: FRAMING,
      fallback: true,
      error: msg,
    })
  }
}
