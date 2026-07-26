/**
 * Pattern detection — 8 types V1 (sur 16 spec).
 *
 * Source : SYNTHESE-A-PATTERN-ECHOING.md (16 types) + 3_TECHNICAL.md §38 phase 5.
 *
 * Types V1 (essentiels) :
 * 1  resonance_directe         (sémantique pgvector)
 * 2  resonance_metaphorique    (concept pgvector)
 * 3  resonance_somatique       (somatique pgvector + zone match)
 * 4  resonance_archetypale     (archetypal pgvector)
 * 5  inverse_mirror            (sem high + valence opposite) — Type 5
 * 6  cycle_step                (motif récurrent évolutif) — Type 6
 * 7  echo_prophetique          (past dream → present, Δt ≥ 30j, seuils stricts) — Type 7
 * 8  numinous_signal           (numinosity > 0.7) — Type 8
 * 10 compagnon_constellation   (inner/outer pair < 72h) — Type 10
 * 14 figure_evolution          (somatic recurrence ≥ 3) — Type 14 transmuté
 *
 * Différés V1.5 : 4, 9, 11, 12, 15, 16
 *
 * Auteur: Yeshua, 2026-04-25 (chantier 3).
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export interface DetectedEdge {
  edge_type: string
  other_kairos_id: string
  weight: number
  metadata: Record<string, any>
}

export interface PatternDetectionResult {
  edges: DetectedEdge[]
  patterns_summary: Record<string, number>  // edge_type → count
}

/**
 * Run all V1 detectors et insert edges in DB (service_role).
 * Return summary pour synthesis tier detection.
 */
export async function runPatternDetection(opts: {
  supabaseService: SupabaseClient
  userId: string
  kairosId: string
  motifTags: string[]
  numinosityScore: number
  somaticZones: string[]
}): Promise<PatternDetectionResult> {
  const { supabaseService, userId, kairosId, motifTags, numinosityScore, somaticZones } = opts
  const edges: DetectedEdge[] = []

  // Type 1+2+3+4 — multilayer echoes
  const { data: multilayerData, error: mErr } = await supabaseService.rpc(
    'find_kairos_echoes_multilayer',
    {
      p_user_id: userId,
      p_kairos_id: kairosId,
      p_min_combined: 0.55,
      p_limit: 15,
    }
  )
  if (mErr) console.error('[pattern] multilayer error:', mErr.message)
  for (const row of (multilayerData || []) as any[]) {
    if (!row.combined_score || row.combined_score < 0.55) continue
    // Determine dominant edge_type by which sim is highest
    const sims = {
      resonance_directe: row.sim_sem || 0,
      resonance_metaphorique: row.sim_con || 0,
      resonance_somatique: row.sim_som || 0,
      resonance_archetypale: row.sim_arc || 0,
    }
    const dominant = Object.entries(sims).sort(([, a], [, b]) => (b as number) - (a as number))[0]
    if ((dominant[1] as number) < 0.45) continue
    edges.push({
      edge_type: dominant[0],
      other_kairos_id: row.other_id,
      weight: Math.min(1, row.combined_score),
      metadata: { ...sims, source: 'multilayer' },
    })
  }

  // Type 5 — inverse mirror
  const { data: mirrorData, error: mirErr } = await supabaseService.rpc(
    'find_kairos_inverse_mirrors',
    { p_user_id: userId, p_kairos_id: kairosId, p_limit: 5 }
  )
  if (mirErr) console.error('[pattern] mirror error:', mirErr.message)
  for (const row of (mirrorData || []) as any[]) {
    edges.push({
      edge_type: 'inverse_mirror',
      other_kairos_id: row.other_id,
      weight: Math.min(1, row.sim_sem * 0.7 + row.valence_delta * 0.3),
      metadata: { sim_sem: row.sim_sem, valence_delta: row.valence_delta },
    })
  }

  // Type 6 — cycle (motif récurrent ≥ 3 occurrences)
  for (const motif of motifTags.slice(0, 5)) {
    const { data: cycleData, error: cErr } = await supabaseService.rpc(
      'find_kairos_cycles',
      { p_user_id: userId, p_motif_tag: motif, p_days: 180, p_limit: 30 }
    )
    if (cErr) continue
    const occurrences = (cycleData || []) as any[]
    if (occurrences.length >= 3) {
      // Link this kairos to its 2 closest predecessors with same motif
      const predecessors = occurrences.filter((o) => o.kairos_id !== kairosId).slice(-2)
      for (const pred of predecessors) {
        edges.push({
          edge_type: 'cycle_step',
          other_kairos_id: pred.kairos_id,
          weight: 0.7,
          metadata: { motif, total_occurrences: occurrences.length },
        })
      }
    }
  }

  // Type 7 — prophetic (D4 Tim 2026-04-25 : seuils 0.75/0.4)
  const { data: propheticData, error: pErr } = await supabaseService.rpc(
    'find_kairos_prophetic',
    {
      p_user_id: userId,
      p_kairos_id: kairosId,
      p_min_days_back: 30,
      p_min_combined: 0.75,
      p_min_numinosity_past: 0.4,
      p_limit: 3,
    }
  )
  if (pErr) console.error('[pattern] prophetic error:', pErr.message)
  for (const row of (propheticData || []) as any[]) {
    edges.push({
      edge_type: 'echo_prophetique',
      other_kairos_id: row.past_id,
      weight: Math.min(1, row.combined_score),
      metadata: {
        days_delta: row.days_delta,
        past_numinosity: row.past_numinosity,
        // maturation ECHO_RIPENING réellement vérifiée côté RPC (2_DESIGN:247)
        ripening_recurrence: row.ripening_recurrence,
        ripening_somatic: row.ripening_somatic,
        shared_motif: row.shared_motif,
        adjusted_score: row.adjusted_score,
        z_score: row.z_score,
        flagged_sensitive: true, // D4 Tim : tag transparence
      },
    })
  }

  // `prophetic_status = 'awakened'` n'était écrit NULLE PART sur `kairos` : le seul
  // writer visait la table legacy `dreams`. Résultat, /api/echoes/prophetic/matured
  // (consommé par public/v12/api.jsx, surface toujours servie) ne s'est jamais
  // déclenché. Un écho qui franchit les cinq verrous EST, par définition, l'écho
  // « mûr » que cette route attend. On l'écrit ici, au moment de l'enrichissement.
  if ((propheticData || []).length > 0) {
    try {
      await supabaseService
        .from('kairos')
        .update({ prophetic_status: 'awakened' })
        .eq('user_id', userId)
        .eq('prophetic_status', 'dormant')
        .in('id', (propheticData as any[]).map(r => r.past_id).filter(Boolean))
    } catch (e: any) {
      console.warn('[pattern] awakened non bloquant:', e?.message)
    }
  }

  // Type 8 — numinous signal (self-flag, pas d'edge externe)
  if (numinosityScore >= 0.7) {
    // No edge — c'est un signal scalaire affiché côté UI uniquement
    // Mais on pourrait link à d'autres numinous high si on veut une "constellation numineuse"
    const { data: numinousList } = await supabaseService.rpc('list_kairos_numinous', {
      p_user_id: userId,
      p_min_score: 0.7,
      p_days: 365,
      p_limit: 5,
    })
    for (const row of (numinousList || []) as any[]) {
      if (row.kairos_id === kairosId) continue
      edges.push({
        edge_type: 'numinous_signal',
        other_kairos_id: row.kairos_id,
        weight: 0.6,
        metadata: { both_numinous: true, scores: [numinosityScore, row.numinosity_score] },
      })
    }
  }

  // Type 10 — compagnon_constellation (inner/outer pair < 72h)
  const { data: pairData, error: pairErr } = await supabaseService.rpc(
    'find_kairos_inner_outer',
    { p_user_id: userId, p_kairos_id: kairosId, p_window_hours: 72, p_min_sem: 0.55, p_limit: 3 }
  )
  if (pairErr) console.error('[pattern] inner_outer error:', pairErr.message)
  for (const row of (pairData || []) as any[]) {
    edges.push({
      edge_type: 'compagnon_constellation',
      other_kairos_id: row.other_id,
      weight: Math.min(1, row.sim_sem * 0.8 + 0.2),
      metadata: {
        hours_delta: row.hours_delta,
        other_type: row.other_type,
      },
    })
  }

  // Type 14 — somatic recurrence par zone (transmute en figure_evolution edge si ≥ 3)
  for (const zone of somaticZones.slice(0, 3)) {
    const { data: recurData, error: rErr } = await supabaseService.rpc(
      'find_kairos_somatic_recurrence',
      { p_user_id: userId, p_zone: zone, p_min_count: 3, p_days: 365 }
    )
    if (rErr) continue
    const recur = (recurData || [])[0] as any
    if (!recur || !recur.kairos_ids?.length) continue
    // Link to the 2 most recent past occurrences
    const others = recur.kairos_ids.filter((id: string) => id !== kairosId).slice(-2)
    for (const otherId of others) {
      edges.push({
        edge_type: 'figure_evolution', // transmute V1 (zone qui revient = corps qui parle)
        other_kairos_id: otherId,
        weight: 0.65,
        metadata: { somatic_zone: zone, total_occurrences: recur.occurrences },
      })
    }
  }

  // Insert edges (batch, ON CONFLICT DO NOTHING via PK natural)
  // Check : valid edge_types from migration kairos_substrate
  const VALID_EDGE_TYPES = new Set([
    'resonance_directe', 'resonance_metaphorique', 'resonance_somatique', 'resonance_archetypale',
    'inverse_mirror', 'cycle_step', 'echo_prophetique', 'co_occurrence_constellation',
    'symbolic_resonance_lateral', 'numinous_signal', 'transformation_marker',
    'cross_lingual_resonance', 'compagnon_constellation', 'tradition_specific_match',
    'figure_evolution', 'image_monde_link',
  ])

  const validEdges = edges.filter((e) => VALID_EDGE_TYPES.has(e.edge_type))

  // Dédoublonner sur (other_kairos_id, edge_type) → garder weight max
  const dedup = new Map<string, DetectedEdge>()
  for (const e of validEdges) {
    const key = `${e.other_kairos_id}|${e.edge_type}`
    const existing = dedup.get(key)
    if (!existing || existing.weight < e.weight) dedup.set(key, e)
  }

  const finalEdges = Array.from(dedup.values())

  if (finalEdges.length > 0) {
    const insertRows = finalEdges.map((e) => ({
      kairos_a_id: kairosId,
      kairos_b_id: e.other_kairos_id,
      user_id: userId,
      edge_type: e.edge_type,
      edge_weight: Math.max(0, Math.min(1, e.weight)),
      detection_metadata: e.metadata,
    }))
    const { error: insErr } = await supabaseService.from('kairos_edges').insert(insertRows)
    if (insErr) {
      // Pas fatal — peut être conflict CHECK distinct_endpoints (rare)
      console.error('[pattern] edges insert error:', insErr.message)
    }
  }

  // Patterns summary pour tier detection
  const patterns_summary: Record<string, number> = {}
  for (const e of finalEdges) {
    patterns_summary[e.edge_type] = (patterns_summary[e.edge_type] || 0) + 1
  }

  return { edges: finalEdges, patterns_summary }
}
