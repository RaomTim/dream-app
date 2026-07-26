import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET  /api/circles/[id]/restitutions    → list restitutions
 * POST /api/circles/[id]/restitutions    → request new (RPC) — Sonnet generation
 *                                          handled by EF generate-circle-restitution
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    // Member check
    const member = await supabase
      .from('circle_members').select('id').eq('circle_id', params.id).eq('user_id', userId)
      .is('left_at', null).maybeSingle()
    if (!member.data) return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })

    const { data, error } = await supabase
      .from('circle_restitutions')
      .select('id, requested_by, requested_at, period_start, period_end, narrative_text, patterns_detected, intention_at_time, status, metadata')
      .eq('circle_id', params.id)
      .order('requested_at', { ascending: false })
      .limit(20)
    if (error) throw error
    return NextResponse.json({ restitutions: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

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
    const member = await supabase
      .from('circle_members').select('id').eq('circle_id', params.id).eq('user_id', userId)
      .is('left_at', null).maybeSingle()
    if (!member.data) return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })

    const periodDays = parseInt(body.period_days || '28')

    const { data: restitId, error: rpcErr } = await supabase.rpc('request_circle_restitution', {
      p_circle_id: params.id,
      p_requested_by: userId,
      p_period_days: periodDays,
    })
    if (rpcErr) throw rpcErr

    // V1 : on déclenche la génération inline (synchrone) sans EF cloud.
    // V1.5 : déléguer à supabase/functions/generate-circle-restitution via pg_net.
    void generateRestitutionInline(supabase, restitId as string, params.id, periodDays).catch((err) => {
      console.error('[restitutions.POST] inline gen failed:', err)
    })

    return NextResponse.json({ restitution_id: restitId, status: 'pending' }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

async function generateRestitutionInline(
  supabase: any,
  restitutionId: string,
  circleId: string,
  periodDays: number
) {
  const { data: patterns, error: pErr } = await supabase.rpc('get_circle_patterns', {
    p_circle_id: circleId,
    p_period_start: new Date(Date.now() - periodDays * 24 * 3600 * 1000).toISOString(),
    p_period_end: new Date().toISOString(),
  })
  if (pErr) {
    await supabase.from('circle_restitutions').update({ status: 'failed' }).eq('id', restitutionId)
    return
  }

  // Très simple V1 : si k-anon insuffisant → narrative explicite "pas assez de voix"
  if (!patterns || (patterns.unique_authors || 0) < (patterns.k_anon_threshold || 3)) {
    await supabase.from('circle_restitutions').update({
      status: 'ready',
      narrative_text:
        "Pour cette fenêtre de temps, le cercle n'a pas encore assez de voix pour qu'un motif émerge sans risque d'identification. Reviens plus tard ou invite d'autres tenir la veille.",
      patterns_detected: patterns || {},
    }).eq('id', restitutionId)
    return
  }

  // V1.5 : appel Sonnet pour narrative polyphonique. V1 : narrative descriptive simple.
  const lines: string[] = []
  lines.push(`Sur la période demandée, ${patterns.unique_authors} voix ont déposé ${patterns.total_kairos_optin} kairos en partage agrégé.`)
  if (patterns.top_motifs?.length) {
    const top = patterns.top_motifs.slice(0, 5).map((m: any) => `${m.motif} (${m.unique_authors} voix)`).join(', ')
    lines.push(`Motifs qui reviennent : ${top}.`)
  }
  if (patterns.top_archetypes?.length) {
    const top = patterns.top_archetypes.slice(0, 4).map((a: any) => a.archetype).join(', ')
    lines.push(`Archétypes en présence : ${top}.`)
  }
  if (patterns.somatic_zones?.length) {
    const top = patterns.somatic_zones.slice(0, 3).map((s: any) => s.zone).join(', ')
    lines.push(`Le corps a parlé surtout par : ${top}.`)
  }
  lines.push('Une lecture polyphonique plus profonde sera générée par EF generate-circle-restitution une fois deployée.')

  await supabase.from('circle_restitutions').update({
    status: 'ready',
    narrative_text: lines.join('\n\n'),
    patterns_detected: patterns,
  }).eq('id', restitutionId)
}
