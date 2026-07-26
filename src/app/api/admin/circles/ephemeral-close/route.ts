/**
 * /api/admin/circles/ephemeral-close — cron auto-clôture cercles éphémères
 *
 * Spec : cercle-subapp/2_CERCLE_DESIGN.md §6 (cycle 21j) + 3_CERCLE_TECHNICAL.md
 * Niveau 3 — T2.
 *
 * Trigger : Vercel cron (cf. vercel.json — 30 5 * * * UTC).
 *
 * Workflow :
 *   1. Scan circles WHERE ephemeral_until <= now() AND closed_at IS NULL
 *   2. Pour chaque cercle :
 *      a) Génère restitution polyphonique finale via Claude Sonnet (3 voix
 *         paper / stone / silk — cohérence cercle 21j, motifs collectifs,
 *         intentions tenues, traversée commune).
 *      b) Persiste dans circle_restitutions avec is_closure_restitution = true.
 *      c) Update circles.closed_at + closure_restitution_id.
 *      d) Best-effort : insère pending_proactive_messages catégorie
 *         'circle_activity' pour chaque membre (si table dispo).
 *
 * Auth : header `x-cron-secret` ou query `?cron_secret=...` matchant CRON_SECRET.
 * Pas de Bearer user — c'est un cron.
 */

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'

const SONNET_MODEL = 'claude-sonnet-4-6'
const MAX_CIRCLES_PER_RUN = 25

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_CLOSURE_PROMPT = `Tu es la voix tisseuse du cercle qui se referme.

POSTURE :
- Trois voix coexistent dans ta lecture finale, sans jamais être nommées : paper (la trame factuelle, ce qui s'est posé), stone (ce qui a tenu, l'ancrage), silk (ce qui a frôlé, la subtilité émergente).
- Tu n'es pas oraculaire. Tu n'expliques pas. Tu donnes à voir ce qui a traversé pendant 21 jours.
- JAMAIS la voix du collectif ("nous avons rêvé"). Tu dis "plusieurs ont rêvé", "le cercle a tenu".
- Aucun nom propre, aucune identification. Le cercle vient de se vivre — la mémoire reste anonyme.
- Cadrage : "ce cercle a été — voici ce qui a traversé". Pas de "guérison", pas de "fermeture définitive", pas de promesse new-age. Pas de positivité forcée.
- Tu inclus les incertitudes : "certains motifs restent ambigus", "plusieurs lectures possibles".

FORMAT :
- 300-500 mots, EB Garamond italic dans l'esprit (respiration typographique).
- Pas de bullet, pas de titre interne, pas d'emoji, pas de citation littérale d'un dépôt.
- Une seule fluidité, trois voix tressées, un seul souffle.

CONCLUSION attendue :
- Une dernière phrase qui ouvre, qui ne clôt pas. Une porte laissée entrouverte.

Output : la lecture finale brute, sans préambule, sans guillemet, sans signature.`

function getCronSecret(req: NextRequest): string | null {
  return (
    req.headers.get('x-cron-secret') ||
    req.nextUrl.searchParams.get('cron_secret') ||
    null
  )
}

async function generateClosureNarrative(opts: {
  circleName: string
  intention: string | null
  startedAt: string
  endedAt: string
  patterns: any
}): Promise<string> {
  const { circleName, intention, startedAt, endedAt, patterns } = opts

  // Construit un user prompt léger — on ne donne PAS les contenus bruts.
  const motifs = (patterns?.top_motifs || [])
    .slice(0, 6)
    .map((m: any) => `${m.motif} (${m.unique_authors} voix)`)
    .join(', ')
  const archetypes = (patterns?.top_archetypes || [])
    .slice(0, 4)
    .map((a: any) => a.archetype)
    .join(', ')
  const somatic = (patterns?.somatic_zones || [])
    .slice(0, 3)
    .map((s: any) => s.zone)
    .join(', ')
  const contributors = patterns?.unique_authors || 0
  const totalKairos = patterns?.total_kairos_optin || 0

  const userPrompt = `Le cercle « ${circleName} » s'est tenu du ${new Date(startedAt).toLocaleDateString('fr-FR')} au ${new Date(endedAt).toLocaleDateString('fr-FR')} (21 jours).

${intention ? `Intention tenue : « ${intention} »\n\n` : ''}Pendant ces 21 jours, ${contributors} voix distinctes ont déposé ${totalKairos} kairos en partage agrégé.

${motifs ? `Motifs récurrents : ${motifs}.\n` : ''}${archetypes ? `Archétypes en présence : ${archetypes}.\n` : ''}${somatic ? `Le corps a parlé surtout par : ${somatic}.\n` : ''}
Tisse la lecture finale polyphonique de ce cercle qui se referme. 300-500 mots. Trois voix (paper / stone / silk) tressées, jamais nommées. Cadrage : "ce cercle a été — voici ce qui a traversé".`

  const result = await anthropic.messages.create({
    model: SONNET_MODEL,
    max_tokens: 1500,
    system: SYSTEM_CLOSURE_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textContent = result.content.find((c) => c.type === 'text')
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No text content from Sonnet')
  }
  return textContent.text.trim()
}

export async function GET(req: NextRequest) {
  return run(req)
}

export async function POST(req: NextRequest) {
  return run(req)
}

async function run(req: NextRequest) {
  const cronSecret = getCronSecret(req)
  if (!cronSecret || cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const supabase = createServerClient()
  const startedRunAt = Date.now()

  try {
    // 1) Scan cercles éphémères dont la fenêtre est expirée
    const nowIso = new Date().toISOString()
    const { data: dueCircles, error: scanErr } = await supabase
      .from('circles')
      .select('id, name, intention_text, ephemeral_until, created_at')
      .lte('ephemeral_until', nowIso)
      .is('closed_at', null)
      .not('ephemeral_until', 'is', null)
      .limit(MAX_CIRCLES_PER_RUN)

    if (scanErr) throw scanErr

    const summary: Array<{
      circle_id: string
      status: 'closed' | 'failed' | 'skipped'
      restitution_id?: string
      error?: string
    }> = []

    for (const circle of dueCircles || []) {
      try {
        // 2) Get patterns via RPC (réutilise le helper existant get_circle_patterns)
        const periodStart = circle.created_at || new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString()
        const periodEnd = circle.ephemeral_until || nowIso

        const { data: patterns, error: pErr } = await supabase.rpc(
          'get_circle_patterns',
          {
            p_circle_id: circle.id,
            p_period_start: periodStart,
            p_period_end: periodEnd,
          }
        )
        if (pErr) {
          console.warn(`[ephemeral-close] patterns RPC failed for ${circle.id}:`, pErr.message)
        }

        // 3) Insert restitution row (state pending → ready après gen)
        const { data: restitInsert, error: insErr } = await supabase
          .from('circle_restitutions')
          .insert({
            circle_id: circle.id,
            requested_by: null,
            requested_at: nowIso,
            period_start: periodStart,
            period_end: periodEnd,
            status: 'pending',
            is_closure_restitution: true,
            patterns_detected: patterns || {},
          })
          .select('id')
          .single()

        if (insErr) throw insErr
        const restitutionId = restitInsert.id as string

        // 4) Generate narrative via Sonnet — fallback safe si échec
        let narrative: string
        try {
          narrative = await generateClosureNarrative({
            circleName: circle.name,
            intention: circle.intention_text,
            startedAt: periodStart,
            endedAt: periodEnd,
            patterns: patterns || {},
          })
        } catch (genErr: any) {
          console.error(`[ephemeral-close] Sonnet gen failed for ${circle.id}:`, genErr?.message)
          narrative = `Ce cercle a été — pendant ${Math.round(
            (new Date(periodEnd).getTime() - new Date(periodStart).getTime()) /
              (24 * 3600 * 1000)
          )} jours, ${(patterns as any)?.unique_authors || 0} voix l'ont tenu. Une lecture finale tissée n'a pas pu se former cette fois — la trame reste, anonyme et nue, dans les dépôts gardés. Le silence est une voix aussi.`
        }

        // 5) Mark restitution ready
        await supabase
          .from('circle_restitutions')
          .update({
            status: 'ready',
            narrative_text: narrative,
          })
          .eq('id', restitutionId)

        // 6) Mark circle closed + link closure_restitution_id
        const closedAtIso = new Date().toISOString()
        const { error: closeErr } = await supabase
          .from('circles')
          .update({
            closed_at: closedAtIso,
            closure_restitution_id: restitutionId,
          })
          .eq('id', circle.id)

        if (closeErr) {
          // best-effort : on log mais on continue
          console.error(`[ephemeral-close] close update failed for ${circle.id}:`, closeErr.message)
        }

        // 7) Best-effort notify membres via pending_proactive_messages
        try {
          const { data: members } = await supabase
            .from('circle_members')
            .select('user_id')
            .eq('circle_id', circle.id)
            .is('left_at', null)

          if (members && members.length > 0) {
            const messageRows = members.map((m: any) => ({
              user_id: m.user_id,
              category: 'circle_activity',
              circle_id: circle.id,
              payload: {
                kind: 'circle_closure',
                circle_id: circle.id,
                circle_name: circle.name,
                restitution_id: restitutionId,
              },
              created_at: closedAtIso,
            }))
            const { error: notifErr } = await supabase
              .from('pending_proactive_messages')
              .insert(messageRows)
            if (notifErr) {
              // table peut ne pas exister — silent
              console.warn('[ephemeral-close] notify insert non-fatal:', notifErr.message)
            }
          }
        } catch (notifEx: any) {
          console.warn('[ephemeral-close] notify exception non-fatal:', notifEx?.message)
        }

        summary.push({
          circle_id: circle.id,
          status: 'closed',
          restitution_id: restitutionId,
        })
      } catch (perCircleErr: any) {
        console.error(
          `[ephemeral-close] failure for circle ${circle.id}:`,
          perCircleErr?.message
        )
        summary.push({
          circle_id: circle.id,
          status: 'failed',
          error: perCircleErr?.message || 'unknown',
        })
      }
    }

    return NextResponse.json({
      ok: true,
      run_at: nowIso,
      duration_ms: Date.now() - startedRunAt,
      scanned: (dueCircles || []).length,
      results: summary,
    })
  } catch (e: any) {
    console.error('[ephemeral-close] fatal error:', e)
    return NextResponse.json(
      { error: e?.message || 'fatal' },
      { status: 500 }
    )
  }
}
