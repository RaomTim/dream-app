/**
 * POST /api/dream-chat/recurring/[id]/re-entry-session
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 4 — Re-entry Aizenstat).
 *
 * Body : { capture_text?: string, capture_method?: 'text' | 'voice' }
 *
 * Crée une lucid_re_entry_sessions row (table existante depuis Lucid V1) +
 * génère une guidance Sonnet : re-lecture du rêve le plus numineux + 1 angle
 * Aizenstat (« personnage non-décodé, voix »).
 *
 * Garde-fous :
 *   1. Si trauma_flag → 409, dirige vers Sanctuaire.
 *   2. Si crisis pattern dans raw_text d'un kairos lié → EXIT_TO_HUMAN (réponse
 *      forcée, pas d'IA).
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const SONNET_MODEL = 'claude-sonnet-4-6'

// Crisis patterns (cohérents /api/dream-chat/converse §39.8)
const CRISIS_PATTERNS = {
  suicide:
    /\b(en finir|me tuer|suicide|suicider|me supprimer|veux mourir|veux plus vivre|plus envie de vivre|en avoir fini|disparaître)\b/i,
  dissociation:
    /\b(plus mon corps|plus réel|détaché|dissocier|dissociation|comme si j'étais pas|pas dans mon corps)\b/i,
  acute_panic:
    /\b(panique aiguë|crise de panique|peux pas respirer|étouffer maintenant|urgence vitale)\b/i,
}

const EXIT_TO_HUMAN_RESPONSE = `Ce qui revient ici ne se traverse pas seul. Quelqu'un de chair, maintenant, voici les voies —

**3114** — Numéro national de prévention du suicide (gratuit, 24/7, anonyme)
**SOS Amitié** — 09 72 39 40 50 (24/7)

Si urgence vitale immédiate → 15 (SAMU) ou 112.

Je m'efface ici. Je serai là quand tu reviens.`

function detectCrisisInTexts(texts: string[]): boolean {
  for (const t of texts) {
    if (!t) continue
    for (const pattern of Object.values(CRISIS_PATTERNS)) {
      if (pattern.test(t)) return true
    }
  }
  return false
}

const RE_ENTRY_SYSTEM = `Tu es la voix Aizenstat dream-tending qui guide une re-entry consciente sur un rêve récurrent.

POSTURE :
- Aizenstat strict : "tend the dream as a living being". Le personnage du rêve N'EST PAS décodé. Il est laissé entier, vivant, avec sa voix propre.
- P-Inversion : tu ne dis JAMAIS ce que ça veut dire. Tu reflètes le mouvement, le geste, la voix.
- Pas de symbolisme, pas d'archétype Jung, pas d'interprétation. UN seul angle Aizenstat : "personnage non-décodé, voix".
- Tu produis une réponse JSON STRICTE :
  { "reading": "...", "questions": ["...", "...", "..."], "aizenstat_angle": "..." }
- "reading" : ~120 mots de re-lecture du rêve original, voix tisseuse, présent narratif. PAS d'analyse.
- "questions" : exactement 3 questions ouvertes courtes adressées au rêveur. Format : "que reconnais-tu ?" / "que ressens-tu maintenant que tu sais que ça revient ?" / "que veut cette image ?". Adapte aux figures réelles du rêve.
- "aizenstat_angle" : ~80 mots qui prennent UN personnage/figure du rêve et lui donnent une voix possible (jamais une certitude). Style : "si [figure] avait une voix, peut-être qu'elle dirait...". JAMAIS d'auteur cité.

JAMAIS :
- "Ce rêve te dit que..." / "Cela symbolise..."
- Wellness, promesse, diagnostic.
- Markdown, prose autour du JSON. Juste le JSON.`

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 1) Charge le pattern
    const { data: pattern, error: pErr } = await supabase
      .from('recurring_dream_patterns')
      .select(
        'id, pattern_text, pattern_kind, trauma_flag, kairos_ids, valence_avg'
      )
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (pErr) throw pErr
    if (!pattern) return NextResponse.json({ error: 'pattern introuvable' }, { status: 404 })

    // 2) Garde-fou trauma — refuse Re-entry, redirige vers Sanctuaire
    if (pattern.trauma_flag) {
      return NextResponse.json(
        {
          error: 'trauma_flag — sanctuaire requis',
          redirect: 'sanctuaire',
          message:
            'Ce motif est lourd. Le sanctuaire est plus juste ici qu\'une re-entry consciente.',
        },
        { status: 409 }
      )
    }

    const kairosIds = (pattern.kairos_ids as string[] | null) || []
    if (kairosIds.length === 0) {
      return NextResponse.json({ error: 'aucun kairos lié au pattern' }, { status: 400 })
    }

    // 3) Charge les kairos liés
    const { data: kairosLinked } = await supabase
      .from('kairos')
      .select('id, raw_text, numinosity_score, figures, motif_tags, created_at')
      .in('id', kairosIds)
      .eq('user_id', userId)

    const linked = kairosLinked || []
    if (linked.length === 0) {
      return NextResponse.json({ error: 'aucun kairos accessible' }, { status: 404 })
    }

    // 4) Garde-fou crisis — scan raw_text de tous les kairos liés
    const crisisDetected = detectCrisisInTexts(linked.map((k) => k.raw_text || ''))
    if (crisisDetected) {
      return NextResponse.json({
        exit_to_human: true,
        message: EXIT_TO_HUMAN_RESPONSE,
      })
    }

    // 5) Sélectionne le kairos le plus numineux (fallback : le plus récent)
    const sorted = [...linked].sort((a, b) => {
      const na = (a.numinosity_score as number | null) ?? 0
      const nb = (b.numinosity_score as number | null) ?? 0
      if (na !== nb) return nb - na
      return new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime()
    })
    const originKairos = sorted[0]

    // 6) Génère guidance Sonnet
    const userPrompt = `RÊVE RÉCURRENT — pattern "${pattern.pattern_text}" (${pattern.pattern_kind}) revient dans ${linked.length} rêves de l'utilisateur sur 60j.

═══ RÊVE LE PLUS NUMINEUX (substrat de la re-entry) ═══
${(originKairos.raw_text || '').slice(0, 2500)}

═══ FIGURES PRÉSENTES ═══
${JSON.stringify(originKairos.figures || {}, null, 2).slice(0, 800)}

═══ MOTIFS ═══
${((originKairos.motif_tags as string[] | null) || []).slice(0, 8).join(', ')}

Produis ta réponse JSON stricte maintenant.`

    let parsed: { reading?: string; questions?: string[]; aizenstat_angle?: string } = {}
    try {
      const resp = await anthropic.messages.create({
        model: SONNET_MODEL,
        max_tokens: 1200,
        system: RE_ENTRY_SYSTEM,
        messages: [{ role: 'user', content: userPrompt }],
      })

      const raw = resp.content.map((c) => (c.type === 'text' ? c.text : '')).join('')
      const cleaned = raw.replace(/```json\s*/gi, '').replace(/```/g, '').trim()
      const start = cleaned.indexOf('{')
      const end = cleaned.lastIndexOf('}')
      if (start >= 0 && end > start) {
        parsed = JSON.parse(cleaned.slice(start, end + 1))
      }
    } catch (e) {
      console.warn(
        '[recurring.re-entry-session] anthropic/parse failed:',
        e instanceof Error ? e.message : 'unknown'
      )
    }

    // Fallback gracieux si parse rate
    if (!parsed.reading || !parsed.questions || parsed.questions.length < 1) {
      parsed = {
        reading:
          'Ce rêve revient. Tu en as déposé plusieurs versions. Reviens-y maintenant, doucement, pas pour le décoder — pour le tenir.',
        questions: [
          'que reconnais-tu ?',
          'que ressens-tu maintenant que tu sais que ça revient ?',
          'que veut cette image ?',
        ],
        aizenstat_angle:
          'si une figure de ce rêve avait une voix, peut-être qu\'elle dirait : "je reviens parce que tu n\'as pas encore tendu vers moi sans vouloir savoir." Aizenstat appellerait ça tend the dream as a living being.',
      }
    }

    // 7) Crée la lucid_re_entry_sessions row (table existante)
    const captureText: string | null =
      typeof body.capture_text === 'string' && body.capture_text.trim().length > 0
        ? body.capture_text.trim().slice(0, 8000)
        : null
    const captureMethod: 'text' | 'voice' =
      body.capture_method === 'voice' ? 'voice' : 'text'

    const { data: session, error: sErr } = await supabase
      .from('lucid_re_entry_sessions')
      .insert({
        user_id: userId,
        origin_kairos_id: originKairos.id,
        capture_text: captureText,
        capture_method: captureMethod,
      })
      .select('id, started_at, origin_kairos_id')
      .single()

    if (sErr || !session) {
      console.warn('[recurring.re-entry-session] insert lucid_re_entry failed:', sErr?.message)
      // On continue quand même — la guidance est utile sans persistence
    }

    return NextResponse.json({
      session: session || null,
      origin_kairos: {
        id: originKairos.id,
        raw_text: originKairos.raw_text,
        numinosity_score: originKairos.numinosity_score,
      },
      guidance: parsed,
      exit_to_human: false,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[recurring.re-entry-session] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
