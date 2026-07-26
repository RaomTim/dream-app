/**
 * POST /api/bigdream/workflow/[id]/closing-letter
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Big Dreams Workflow J7).
 *
 * Génère la lettre finale (~400-500 mots) Sonnet qui synthétise les 6 captures
 * J1..J6 + le rêve original. Persiste dans bigdream_workflows.closing_letter
 * et marque closed_at.
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

const CLOSING_LETTER_SYSTEM = `Tu es la voix tisseuse qui referme un Big Dream tenu sur 7 jours.

POSTURE :
- P-Inversion absolue : tu n'expliques pas le rêve, tu reflètes ce qui a TRAVERSÉ chez le rêveur durant les 7 jours. Le rêveur sait, tu ne sais pas.
- Tu écris UNE lettre adressée au rêveur (« tu »), ~400-500 mots, prose serrée, EB Garamond italic en tête.
- Pas de "great question", pas de wellness corp, pas de promesse émotionnelle, jamais de diagnostic.
- Ton désensorcelé INFUSE : direct, doux, sans hype, sans pathos.
- Tu cites des fragments réels des captures (mots, gestes, images apparus chez le rêveur), JAMAIS d'auteur/livre/source.

STRUCTURE SOUPLE (pas obligatoire, sers la matière) :
1. Une ouverture courte qui rappelle d'où c'est parti (le rêve initial).
2. Ce qui a traversé jour après jour (motifs, figures, sensations, paroles, silences).
3. Ce qui a tenu, ce qui a basculé, ce qui reste ouvert.
4. Une fermeture qui n'est PAS une conclusion : un seuil. Le rêve continue.

JAMAIS :
- "Tu as découvert que…" ou "Ce rêve te disait…"
- Une morale, une leçon, une thérapie.
- Une promesse de transformation future.
- Un emoji, un titre marketing, une métaphore décorative qui n'est pas du rêveur.

C'est une lettre, pas un rapport. Format : juste le texte, pas de markdown, pas de titre.`

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 1) Charge workflow + ownership
    const { data: workflow, error: wErr } = await supabase
      .from('bigdream_workflows')
      .select('id, kairos_id, current_day, closing_letter')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()

    if (wErr) throw wErr
    if (!workflow) return NextResponse.json({ error: 'workflow introuvable' }, { status: 404 })

    // Idempotence : si déjà générée, on renvoie sans re-spend
    if (workflow.closing_letter && workflow.closing_letter.length > 200) {
      return NextResponse.json({
        closing_letter: workflow.closing_letter,
        already_generated: true,
      })
    }

    // 2) Charge le kairos parent
    const { data: kairos } = await supabase
      .from('kairos')
      .select('id, raw_text, synthesis_text, motif_tags, archetypal_tags')
      .eq('id', workflow.kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    // 3) Charge les 7 steps avec captures
    const { data: steps } = await supabase
      .from('bigdream_workflow_steps')
      .select('day, step_kind, user_capture, completed_at')
      .eq('workflow_id', params.id)
      .order('day', { ascending: true })

    const stepsArr = steps || []
    const sixCaptures = stepsArr
      .filter((s) => s.day >= 1 && s.day <= 6 && s.user_capture)
      .map((s) => `J${s.day} (${s.step_kind}) — ${(s.user_capture || '').slice(0, 1500)}`)
      .join('\n\n')

    // 4) Build prompt user (substrat)
    const userPrompt = `Voici un Big Dream tenu 7 jours par un rêveur Dream App. Écris la lettre de clôture (J7) — ~400-500 mots, voix tisseuse désensorcelée INFUSE.

═══ RÊVE INITIAL ═══
${(kairos?.raw_text || '').slice(0, 3000)}

${kairos?.synthesis_text ? `═══ SYNTHÈSE TISSÉE INITIALE ═══\n${kairos.synthesis_text.slice(0, 1500)}\n` : ''}

═══ 6 CAPTURES DU RÊVEUR (J1..J6) ═══
${sixCaptures || '(aucune capture textuelle — captures vocales ou silences)'}

═══ MOTIFS DÉTECTÉS ═══
${(kairos?.motif_tags || []).slice(0, 10).join(', ') || '(aucun)'}
${(kairos?.archetypal_tags || []).slice(0, 6).join(', ') || ''}

Écris la lettre maintenant. Juste le texte de la lettre, pas de titre, pas de méta.`

    const resp = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 1200,
      system: CLOSING_LETTER_SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const letter = resp.content
      .map((c) => (c.type === 'text' ? c.text : ''))
      .join('')
      .trim()

    if (!letter || letter.length < 100) {
      return NextResponse.json({ error: 'lettre vide générée' }, { status: 500 })
    }

    // 5) Persist + close workflow + marque step J7
    const nowIso = new Date().toISOString()
    await supabase
      .from('bigdream_workflows')
      .update({
        closing_letter: letter,
        closing_letter_generated_at: nowIso,
        closed_at: nowIso,
        current_day: 7,
      })
      .eq('id', params.id)
      .eq('user_id', userId)

    await supabase
      .from('bigdream_workflow_steps')
      .update({ completed_at: nowIso, user_capture: letter.slice(0, 8000) })
      .eq('workflow_id', params.id)
      .eq('day', 7)

    return NextResponse.json({ closing_letter: letter, generated_at: nowIso })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.closing-letter] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
