import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/practice-letter
 *
 * Génère (ou retourne depuis cache 14j) une lettre narrative mensuelle
 * sur la pratique lucide du user. Sonnet 200-400 mots.
 *
 * NARRATIVE, PAS SCORE — cohérent 1_LUCID_BIBLE §4.6 anti-gamification +
 * 3_LUCID_TECHNICAL §3.2 PRACTICE_NOT_SCORE_NARRATIVE.
 *
 * Body : { force?: boolean }  // force=true ignore le cache
 *
 * Returns :
 *   {
 *     letter: string,
 *     period_start: ISO,
 *     period_end: ISO,
 *     cached: boolean,
 *     word_count: number
 *   }
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export const maxDuration = 45

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const LETTER_SYSTEM = `Tu écris une LETTRE de 200-400 mots à un rêveur qui pratique la lucidité depuis quelque temps. Tu connais sa pratique récente : ses rêves lucides marqués, ses dream signs personnels, ses RC effectués, ses sessions MILD.

POSTURE INFUSE (1_LUCID_BIBLE §2.2) :
- "Présence éveillée DANS le rêve, PAS pilotage du rêve"
- Anti-gamification ABSOLUE : aucun chiffre, aucun pourcentage, aucun "bravo X lucides cette semaine", aucun ranking
- Anti-flatterie : ne pas dire "tu progresses bien" sans raison
- Anti-prescription : ne pas commander "fais ceci". Suggérer doucement.
- Voix absorbée : pas de "selon LaBerge", pas de "Aizenstat dit". Tu portes en toi la lignée des praticiens lucides éveillés.

STRUCTURE NARRATIVE :
- Pas de bullet points
- Pas de "Cher rêveur,"
- Pas de signature
- Une seule lettre fluide en prose
- Français, ton tutoyant chaleureux mais pas mielleux
- Tu peux ouvrir avec une image (ce qui revient dans ses rêves), nommer une posture observée, finir sur une question ouverte ou un seuil

EXEMPLES DE TONS À VISER :
- "Dans tes nuits récentes, une figure d'eau revient. Elle ne demande pas que tu la tiennes — elle demande que tu la regardes."
- "Tu as choisi l'observation plus que la prise. C'est une posture rare. Tu sais ce qu'elle coûte."
- "Si une porte s'ouvre cette lune, demande-toi : qu'est-ce que je n'ai pas voulu voir ?"

INTERDICTIONS STRICTES :
- ❌ "X lucides ce mois"
- ❌ "X% de réussite"
- ❌ "tu as battu ton record"
- ❌ "MILD a une efficacité de 20%" (pas de numbers ici)
- ❌ Dream yoga/Wangyal/Bön (red line §4.7)
- ❌ "Tu devrais faire WBTB plus souvent"

Réponds EN PROSE FRANÇAISE, 200-400 mots, sans markdown, sans titre, sans signature.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const force = body.force === true
    const supabase = createServerClient()

    // Cache check (14 jours)
    if (!force) {
      const { data: cached } = await supabase
        .from('lucid_practice_letters')
        .select('*')
        .eq('user_id', userId)
        .gte('cache_valid_until', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cached) {
        return NextResponse.json({
          letter: cached.letter_text,
          period_start: cached.period_start,
          period_end: cached.period_end,
          cached: true,
          word_count: cached.word_count,
        })
      }
    }

    // Période : 90 derniers jours
    const periodEnd = new Date()
    const periodStart = new Date(Date.now() - 90 * 86400000)

    // Fetch lucid kairos (lucidity_score >= 1 OR is_lucid=true)
    const { data: lucidMeta } = await supabase
      .from('lucid_kairos_metadata')
      .select('kairos_id, recognition_category, posture, technique_used, is_lucid, lucidity_score, created_at')
      .eq('user_id', userId)
      .or('is_lucid.eq.true,lucidity_score.gte.1')
      .gte('created_at', periodStart.toISOString())
      .order('created_at', { ascending: false })
      .limit(50)

    // Fetch dream signs actifs
    const { data: dreamsigns } = await supabase
      .from('lucid_dream_signs')
      .select('sign_label, sign_category, occurrences_count')
      .eq('user_id', userId)
      .eq('active', true)
      .order('occurrences_count', { ascending: false })
      .limit(15)

    // Fetch RC events recent
    const { data: rcEvents } = await supabase
      .from('lucid_reality_check_events')
      .select('result, event_at')
      .eq('user_id', userId)
      .gte('event_at', periodStart.toISOString())
      .order('event_at', { ascending: false })
      .limit(50)

    // Fetch MILD sessions
    const { data: mildSessions } = await supabase
      .from('lucid_mild_sessions')
      .select('intention_text, session_at')
      .eq('user_id', userId)
      .gte('session_at', periodStart.toISOString())
      .order('session_at', { ascending: false })
      .limit(20)

    const inputs = {
      lucid_kairos_count: (lucidMeta || []).length,
      postures: Array.from(new Set((lucidMeta || []).map((m: any) => m.posture).filter(Boolean))),
      recognition_categories: Array.from(new Set((lucidMeta || []).map((m: any) => m.recognition_category).filter(Boolean))),
      techniques: Array.from(new Set((lucidMeta || []).map((m: any) => m.technique_used).filter(Boolean))),
      top_dreamsigns: (dreamsigns || []).slice(0, 5).map((d: any) => d.sign_label),
      rc_count: (rcEvents || []).length,
      mild_count: (mildSessions || []).length,
      sample_intentions: (mildSessions || [])
        .slice(0, 3)
        .map((m: any) => (m.intention_text || '').slice(0, 100))
        .filter(Boolean),
    }

    const userContent = `Pratique lucide récente (90 derniers jours) :

- Rêves marqués lucides : ${inputs.lucid_kairos_count}
- Postures rencontrées : ${inputs.postures.join(', ') || '(aucune notée)'}
- Catégories de reconnaissance : ${inputs.recognition_categories.join(', ') || '(aucune)'}
- Techniques utilisées : ${inputs.techniques.join(', ') || '(aucune notée)'}
- Dream signs personnels (top 5) : ${inputs.top_dreamsigns.join(', ') || '(aucun)'}
- Reality checks effectués : ${inputs.rc_count}
- Sessions MILD : ${inputs.mild_count}
- Échantillon d'intentions récentes : ${inputs.sample_intentions.join(' | ') || '(aucune)'}

Écris la lettre maintenant. 200-400 mots. Prose. Français. Aucun chiffre, aucun pourcentage.`

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: LETTER_SYSTEM,
      messages: [{ role: 'user', content: userContent }],
    })

    const letter = completion.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim()

    if (!letter || letter.length < 80) {
      return NextResponse.json({ error: 'letter generation failed' }, { status: 500 })
    }

    const wordCount = letter.split(/\s+/).filter(Boolean).length

    // Cache it
    const { data: saved } = await supabase
      .from('lucid_practice_letters')
      .insert({
        user_id: userId,
        period_start: periodStart.toISOString(),
        period_end: periodEnd.toISOString(),
        letter_text: letter,
        word_count: wordCount,
        input_kairos_count: inputs.lucid_kairos_count,
        input_rc_events_count: inputs.rc_count,
        input_dreamsigns_count: (dreamsigns || []).length,
        input_mild_sessions_count: inputs.mild_count,
        model: 'claude-sonnet-4-6',
      })
      .select('*')
      .single()

    return NextResponse.json({
      letter,
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
      cached: false,
      word_count: wordCount,
      letter_id: saved?.id,
    })
  } catch (e: any) {
    console.error('[lucid.practice-letter.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
