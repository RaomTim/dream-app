import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/forest-bridge
 *
 * Pour un kairos lucide donné, propose 3 voix polyphoniques de la lignée des
 * praticiens lucides éveillés (LaBerge / Tholey / Stumbrys / Moss / Aizenstat).
 *
 * Garde-fou WANGYAL : jamais cité (red line 1_LUCID_BIBLE §4.7 + §6.2 absorbé,
 * pas de cherry-picking dream yoga sans lignée). Sa substance peut être
 * laïcisée via Moss "voyage conscient", LaBerge autosuggestion, Bachelard
 * réverie — mais sans signature Wangyal.
 *
 * Body : { kairos_id }
 *
 * Returns :
 *   {
 *     voices: [
 *       { angle: 'paper'|'stone'|'silk', text: '...', tradition: 'praticiens lucides éveillés' },
 *       ...
 *     ],
 *     kairos_id, is_lucid_confirmed: bool
 *   }
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const FOREST_LUCID_SYSTEM = `Tu portes la voix d'une lignée — celle des praticiens lucides éveillés. Tu as absorbé : LaBerge (Stanford, REM-validated), Tholey (lucid clarity without manipulation), Stumbrys (méta-analyses prudentes), Moss (Conscious Dreaming, voyage conscient), Aizenstat (Dream Tending, eidola autonomes), Bachelard (poétique de la rêverie).

Tu NE CITES AUCUN AUTEUR par son nom dans la voix user-facing.
Tu NE CITES JAMAIS Wangyal, dream yoga, milam, rigpa, tigle, dakini — red line absolue.
Tu peux dire : "des lignées qui tiennent que…", "les praticiens du voyage conscient disent…", "une tradition empirique a observé que…".

Tu reçois un kairos lucide (rêve où le rêveur a reconnu qu'il rêvait) et tu produis 3 VOIX POLYPHONIQUES :
- ANGLE "paper" — voix empirique, presque cognitive, qui pointe les mécanismes (reality check, dream signs, MILD intention)
- ANGLE "stone" — voix contemplative, qui pointe la stabilité de la conscience, la non-saisie
- ANGLE "silk" — voix poétique, qui rend le rêve à son mystère, sans le solidifier

POSTURE :
- Présence éveillée DANS le rêve, PAS pilotage du rêve (1_LUCID_BIBLE §2.2)
- Pas de "tu devrais faire X". Suggérer doucement.
- 2-4 phrases par voix (60-120 mots chacune)
- Français
- Pas de jargon technique sans glose contextuelle

Réponds en JSON STRICT :
{
  "voices": [
    { "angle": "paper", "text": "..." },
    { "angle": "stone", "text": "..." },
    { "angle": "silk", "text": "..." }
  ]
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairos_id = body.kairos_id
    if (!kairos_id) {
      return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: k } = await supabase
      .from('kairos')
      .select('id, raw_text, title, kairos_type, motif_tags')
      .eq('id', kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    if (!k) return NextResponse.json({ error: 'kairos not found' }, { status: 404 })

    // Vérifier qu'il y a bien is_lucid=true OU que detection_confidence est haute
    const { data: meta } = await supabase
      .from('lucid_kairos_metadata')
      .select('is_lucid, detection_confidence, recognition_category, posture, technique_used')
      .eq('kairos_id', kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    const isLucidConfirmed = meta?.is_lucid === true
    const isLucidCandidate = (meta?.detection_confidence || 0) >= 0.70

    if (!isLucidConfirmed && !isLucidCandidate) {
      return NextResponse.json(
        {
          error: 'Ce kairos n\'est pas marqué lucide. Forêt bridge réservé aux rêves lucides confirmés.',
          hint: 'Marque le kairos is_lucid=true via /api/lucid/kairos-metadata, ou utilise la Forêt globale.',
        },
        { status: 400 }
      )
    }

    // Compose context
    const ctx = `KAIROS LUCIDE :

Titre : ${k.title || '(sans titre)'}
Texte : ${(k.raw_text || '').slice(0, 1500)}
${meta?.recognition_category ? `\nReconnaissance : ${meta.recognition_category}` : ''}
${meta?.posture ? `Posture : ${meta.posture}` : ''}
${meta?.technique_used ? `Technique : ${meta.technique_used}` : ''}

Produis maintenant les 3 voix polyphoniques (paper / stone / silk).`

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      system: FOREST_LUCID_SYSTEM,
      messages: [{ role: 'user', content: ctx }],
    })

    const txt = completion.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim()

    let parsed: any = { voices: [] }
    try {
      const jsonMatch = txt.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : txt)
    } catch {
      console.warn('[lucid.forest-bridge] JSON parse failed', txt.slice(0, 200))
      return NextResponse.json({ voices: [], parse_error: true })
    }

    const VALID_ANGLES = ['paper', 'stone', 'silk']
    const voices = (parsed?.voices || [])
      .filter((v: any) => v && VALID_ANGLES.includes(v.angle) && typeof v.text === 'string')
      .map((v: any) => ({
        angle: v.angle,
        text: String(v.text).trim().slice(0, 1000),
        tradition: 'praticiens lucides éveillés',
      }))
      .slice(0, 3)

    return NextResponse.json({
      voices,
      kairos_id,
      is_lucid_confirmed: isLucidConfirmed,
      detection_confidence: meta?.detection_confidence || null,
    })
  } catch (e: any) {
    console.error('[lucid.forest-bridge.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
