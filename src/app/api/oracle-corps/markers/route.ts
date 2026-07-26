import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/oracle-corps/markers
 *
 * Oracle du Corps (Bible §17.2) — body markers cliquables sur silhouette.
 * Chaque marker = (zone, side, view_face, intensity 1-5, valence, sensation_text, kairos_id?).
 *
 * GET   ?days=30 → list markers (heat map agrégée)
 * POST  → create marker
 * DELETE ?id=... → remove marker
 */

const ALLOWED_ZONES = new Set([
  'head', 'jaw', 'neck', 'throat', 'shoulders',
  'chest', 'heart', 'belly', 'lower_belly', 'pelvis',
  'back_upper', 'back_lower', 'hands', 'arms_left', 'arms_right',
  'legs', 'knees', 'feet', 'whole_body', 'other',
])
const ALLOWED_SIDES = new Set(['left', 'right', 'center', 'both'])
const ALLOWED_VIEW = new Set(['front', 'back'])

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const days = Math.max(1, Math.min(365, parseInt(req.nextUrl.searchParams.get('days') || '30', 10) || 30))
  const kairosId = req.nextUrl.searchParams.get('kairos_id')

  const supabase = createServerClient()
  const since = new Date(Date.now() - days * 24 * 3600 * 1000).toISOString()

  let query = supabase
    .from('body_oracle_markers')
    .select('id, kairos_id, zone, side, view_face, intensity, valence, sensation_text, context_text, trigger_text, zone_custom_text, created_at')
    .eq('user_id', userId)
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  if (kairosId) query = query.eq('kairos_id', kairosId)

  const { data: markers, error } = await query.limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Heat map: aggregate by (zone, view_face)
  const heat = new Map<string, { zone: string; view_face: string; count: number; total_intensity: number; avg_valence: number | null; valence_count: number }>()
  for (const m of markers || []) {
    const k = `${m.zone}::${m.view_face}`
    const cur = heat.get(k)
    if (cur) {
      cur.count++
      cur.total_intensity += (m.intensity || 0)
      if (m.valence !== null && m.valence !== undefined) {
        cur.valence_count++
        cur.avg_valence = ((cur.avg_valence ?? 0) * (cur.valence_count - 1) + m.valence) / cur.valence_count
      }
    } else {
      heat.set(k, {
        zone: m.zone,
        view_face: m.view_face,
        count: 1,
        total_intensity: m.intensity || 0,
        avg_valence: m.valence ?? null,
        valence_count: m.valence !== null && m.valence !== undefined ? 1 : 0,
      })
    }
  }
  const heatmap = Array.from(heat.values()).map((h) => ({
    zone: h.zone,
    view_face: h.view_face,
    count: h.count,
    avg_intensity: h.count > 0 ? h.total_intensity / h.count : 0,
    avg_valence: h.avg_valence,
  })).sort((a, b) => b.count - a.count)

  // Correlations zone ↔ recent kairos motifs (top 8 zones)
  const topZones = heatmap.slice(0, 8).map((h) => h.zone)
  const correlations: Array<{ zone: string; co_occurring_motifs: string[] }> = []
  if (topZones.length > 0 && (markers || []).some((m) => m.kairos_id)) {
    const kairosIds = Array.from(new Set((markers || []).filter((m) => m.kairos_id).map((m) => m.kairos_id))) as string[]
    if (kairosIds.length > 0) {
      const { data: linkedDreams } = await supabase
        .from('dreams')
        .select('id, tags, root_dream_patterns')
        .in('id', kairosIds)
        .eq('user_id', userId)
      const dreamMap = new Map<string, { tags: string[]; patterns: string[] }>()
      for (const d of linkedDreams || []) {
        dreamMap.set(d.id, {
          tags: (d.tags || []) as string[],
          patterns: (d.root_dream_patterns || []) as string[],
        })
      }
      for (const z of topZones) {
        const motifCounts = new Map<string, number>()
        for (const m of markers || []) {
          if (m.zone !== z || !m.kairos_id) continue
          const dream = dreamMap.get(m.kairos_id as string)
          if (!dream) continue
          const allMotifs = [...(dream.tags || []), ...(dream.patterns || [])]
          for (const motif of allMotifs) {
            const lc = String(motif).toLowerCase()
            motifCounts.set(lc, (motifCounts.get(lc) || 0) + 1)
          }
        }
        const top = Array.from(motifCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .filter(([, c]) => c >= 2)
          .slice(0, 5)
          .map(([m]) => m)
        if (top.length > 0) correlations.push({ zone: z, co_occurring_motifs: top })
      }
    }
  }

  return NextResponse.json({
    markers: markers || [],
    heatmap,
    correlations,
    days,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const zone = String(body.zone || '').trim()
  if (!zone || !ALLOWED_ZONES.has(zone)) {
    return NextResponse.json({ error: 'invalid zone' }, { status: 400 })
  }
  const intensity = Math.max(1, Math.min(5, parseInt(String(body.intensity ?? 3), 10) || 3))
  const valence = body.valence === null || body.valence === undefined
    ? null
    : Math.max(-1, Math.min(1, parseFloat(String(body.valence))))
  const side = body.side && ALLOWED_SIDES.has(String(body.side)) ? String(body.side) : null
  const view_face = body.view_face && ALLOWED_VIEW.has(String(body.view_face))
    ? String(body.view_face)
    : 'front'

  const insertObj: Record<string, any> = {
    user_id: userId,
    zone,
    side,
    view_face,
    intensity,
    valence,
    sensation_text: body.sensation_text ? String(body.sensation_text).slice(0, 800) : null,
    context_text: body.context_text ? String(body.context_text).slice(0, 800) : null,
    trigger_text: body.trigger_text ? String(body.trigger_text).slice(0, 400) : null,
    // 2026-04-28 §11.bis.20.12 — précision libre quand la silhouette ne couvre
    // pas la zone (ex: "main droite", "paupière gauche", "plante du pied").
    zone_custom_text: body.zone_custom_text ? String(body.zone_custom_text).slice(0, 200) : null,
  }
  if (body.kairos_id) insertObj.kairos_id = String(body.kairos_id)

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('body_oracle_markers')
    .insert(insertObj)
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ marker: data })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const supabase = createServerClient()
  const { error } = await supabase
    .from('body_oracle_markers')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
