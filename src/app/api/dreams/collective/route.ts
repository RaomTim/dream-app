import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/dreams/collective?range=7d&scope=global&scopeValue=
 *
 * COUCHE 3 — ORACLE DE L'INCONSCIENT COLLECTIF
 *
 * Pas un dashboard. Un détecteur de réalité en formation.
 * Seth : les rêves coordonnent au niveau espèce. Quand des clusters
 * convergent avant l'actualité → master event en formation.
 *
 * Couches : global / country / region / timezone
 * Pondération : grands rêves (numinosity 4-5) pèsent 3x
 * Polyphonie : pas de résumé unique, voix multiples
 */

/*
 * 🔒 PRIVACY FIX — 2026-04-20
 *
 * REMOVED from .select():
 *   - soul_wish      → raw personal text, deeply private, never aggregate-safe
 *   - figure_types   → structured personal content (figure names per user)
 *   - entities       → raw personal entities extracted from dream text
 *
 * KEPT (safe for anonymised collective analysis):
 *   - tags, mood, archetypal_process, numinosity, root_dream_patterns
 *   - created_at, entry_type, user_id (internal only, never returned in response)
 *
 * GATE ADDED:
 *   - Filter on collective_optin = true. Fails-closed: returns 0 rows until the
 *     migration adds the column and a user explicitly opts in.
 *
 * TODO(migration): add collective_optin bool column to dreams table, default false.
 *   See: supabase/migrations/20260420_add_collective_optin.sql
 *
 * REMOVED from response:
 *   - soulWishes[]  → was exposing verbatim soul_wish text to any authenticated caller.
 *     The "anonymized" claim was false — any user with 3 dreams and high numinosity
 *     was trivially re-identifiable from their soul_wish text.
 */

// Numinosity weighting — von Franz: big dreams are qualitatively different
const NUMINOSITY_WEIGHT: Record<number, number> = {
  1: 0.5, 2: 0.8, 3: 1, 4: 2.5, 5: 4,
}

type MasterEvent = {
  id: string
  type: 'process_convergence' | 'figure_convergence' | 'theme_surge' | 'numinous_cluster' | 'mood_shift'
  severity: 'signal' | 'pattern' | 'convergence' | 'master_event'
  title: string
  description: { fr: string; en: string }
  elements: string[]
  dreamerCount: number
  dreamCount: number
  numinousRatio: number
  signalStrength: number
  windowDays: number
}

export async function GET(req: NextRequest) {
  // 🔒 2026-04-20 FIX BRECHE : authentification obligatoire (anti-scraping + anti-abus)
  // 🔒 2026-04-20 TIER 2 (session verification)
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error

  const supabase = createServerClient()
  const { searchParams } = new URL(req.url)
  const range = searchParams.get('range') || '7d'
  const scope = searchParams.get('scope') || 'global'
  const scopeValue = searchParams.get('scopeValue') || ''

  // Calculate date range
  const now = new Date()
  let since: Date
  if (range === '30d') {
    since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  } else if (range === 'lunar') {
    since = new Date(now.getTime() - 29.5 * 24 * 60 * 60 * 1000)
  } else if (range === '90d') {
    since = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  } else {
    since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  // Fetch ALL opted-in dreams in the period (no user filter — global)
  // 🔒 Only select fields safe for collective anonymised view.
  //    soul_wish, figure_types, entities, raw_text, title are EXCLUDED.
  // 🔒 collective_optin filter: fails-closed (0 rows) until migration adds column.
  // TODO(migration): add collective_optin bool column to dreams table, default false.
  const { data: rawDreams, error } = await supabase
    .from('dreams')
    .select('id, user_id, created_at, entry_type, mood, numinosity, archetypal_process, tags')
    .eq('collective_optin', true)
    .gte('created_at', since.toISOString())
    .neq('entry_type', 'day')
    .neq('entry_type', 'jour')
    .neq('entry_type', 'journal')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!rawDreams || rawDreams.length === 0) {
    return NextResponse.json({ collective: null, masterEvents: [], message: 'No dreams in this period' })
  }

  // If scope filter, fetch user profiles and filter
  let dreams = rawDreams
  let profileMap = new Map<string, { timezone?: string; country?: string; region?: string }>()

  if (scope !== 'global') {
    const userIds = Array.from(new Set(rawDreams.map(d => d.user_id)))
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, timezone, country, region')
      .in('id', userIds)

    if (profiles) {
      for (const p of profiles) {
        profileMap.set(p.id, { timezone: p.timezone, country: p.country, region: p.region })
      }
    }

    // Apply geographic filter
    if (scope === 'country' && scopeValue) {
      const filteredUserIds = new Set(
        Array.from(profileMap.entries())
          .filter(([_, p]) => p.country?.toLowerCase() === scopeValue.toLowerCase())
          .map(([id]) => id)
      )
      dreams = rawDreams.filter(d => filteredUserIds.has(d.user_id))
    } else if (scope === 'region' && scopeValue) {
      const filteredUserIds = new Set(
        Array.from(profileMap.entries())
          .filter(([_, p]) => p.region?.toLowerCase() === scopeValue.toLowerCase())
          .map(([id]) => id)
      )
      dreams = rawDreams.filter(d => filteredUserIds.has(d.user_id))
    } else if (scope === 'timezone' && scopeValue) {
      const filteredUserIds = new Set(
        Array.from(profileMap.entries())
          .filter(([_, p]) => p.timezone === scopeValue)
          .map(([id]) => id)
      )
      dreams = rawDreams.filter(d => filteredUserIds.has(d.user_id))
    }
  }

  if (dreams.length === 0) {
    return NextResponse.json({ collective: null, masterEvents: [], message: 'No dreams for this scope' })
  }

  const uniqueDreamers = new Set(dreams.map(d => d.user_id))

  // Helper: weighted count (numinous dreams weigh more)
  function weightedCount(items: typeof dreams): number {
    return items.reduce((sum, d) => {
      const w = NUMINOSITY_WEIGHT[d.numinosity || 1] || 1
      return sum + w
    }, 0)
  }

  // ============================================================
  // 1. FIGURES — REMOVED (2026-04-20 privacy fix)
  // figure_types is no longer fetched (personal content).
  // figure_convergence master events remain disabled until a privacy-safe
  // aggregate pipeline is designed (e.g. counting archetype categories, not names).
  // ============================================================
  const figureMap = new Map<string, {
    name: string; type: string; count: number; weightedCount: number;
    dreamerSet: Set<string>; numinousCount: number; dates: string[]
  }>()
  const globalFigures: {
    name: string; type: string; count: number; weightedCount: number;
    dreamers: number; numinousCount: number; crossDreamer: boolean; dates: string[]
  }[] = []

  // ============================================================
  // 2. THEMES — weighted
  // ============================================================
  const themeMap = new Map<string, { count: number; weightedCount: number; dreamerSet: Set<string> }>()
  for (const d of dreams) {
    if (!d.tags || !Array.isArray(d.tags)) continue
    const w = NUMINOSITY_WEIGHT[d.numinosity || 1] || 1
    for (const tag of d.tags) {
      const existing = themeMap.get(tag) || { count: 0, weightedCount: 0, dreamerSet: new Set<string>() }
      existing.count++
      existing.weightedCount += w
      existing.dreamerSet.add(d.user_id)
      themeMap.set(tag, existing)
    }
  }
  const globalThemes = Array.from(themeMap.entries())
    .sort((a, b) => b[1].weightedCount - a[1].weightedCount)
    .slice(0, 20)
    .map(([theme, v]) => ({
      theme, count: v.count,
      weightedCount: Math.round(v.weightedCount * 10) / 10,
      dreamers: v.dreamerSet.size,
      crossDreamer: v.dreamerSet.size >= 2,
    }))

  // ============================================================
  // 3. ARCHETYPAL PROCESSES — weighted, with dreamer tracking
  // ============================================================
  const processMap = new Map<string, { count: number; weightedCount: number; dreamerSet: Set<string>; numinousCount: number; dates: string[] }>()
  for (const d of dreams) {
    if (!d.archetypal_process) continue
    const w = NUMINOSITY_WEIGHT[d.numinosity || 1] || 1
    const existing = processMap.get(d.archetypal_process) || {
      count: 0, weightedCount: 0, dreamerSet: new Set<string>(), numinousCount: 0, dates: [] as string[],
    }
    existing.count++
    existing.weightedCount += w
    existing.dreamerSet.add(d.user_id)
    if (d.numinosity && d.numinosity >= 4) existing.numinousCount++
    existing.dates.push(d.created_at.substring(0, 10))
    processMap.set(d.archetypal_process, existing)
  }
  const globalProcesses = Array.from(processMap.entries())
    .sort((a, b) => b[1].weightedCount - a[1].weightedCount)
    .slice(0, 10)
    .map(([process, v]) => ({
      process, count: v.count,
      weightedCount: Math.round(v.weightedCount * 10) / 10,
      dreamers: v.dreamerSet.size,
      numinousCount: v.numinousCount,
      dates: Array.from(new Set(v.dates)).sort(),
    }))

  // ============================================================
  // 4. MOOD LANDSCAPE — weighted
  // ============================================================
  const moodMap = new Map<string, { count: number; weightedCount: number }>()
  for (const d of dreams) {
    if (!d.mood) continue
    const w = NUMINOSITY_WEIGHT[d.numinosity || 1] || 1
    const existing = moodMap.get(d.mood) || { count: 0, weightedCount: 0 }
    existing.count++
    existing.weightedCount += w
    moodMap.set(d.mood, existing)
  }
  const moodLandscape = Array.from(moodMap.entries())
    .sort((a, b) => b[1].weightedCount - a[1].weightedCount)
    .slice(0, 12)
    .map(([mood, v]) => ({ mood, count: v.count, weightedCount: Math.round(v.weightedCount * 10) / 10 }))

  // ============================================================
  // 5. NUMINOUS SIGNAL — big dreams cluster analysis
  // ============================================================
  const numinousDreams = dreams.filter(d => d.numinosity && d.numinosity >= 4)
  const numinousRate = dreams.length > 0 ? Math.round((numinousDreams.length / dreams.length) * 100) : 0
  const totalWeighted = weightedCount(dreams)

  // ============================================================
  // 6. DAILY RHYTHM
  // ============================================================
  const dailyMap = new Map<string, { total: number; numinous: number }>()
  for (const d of dreams) {
    const day = d.created_at.substring(0, 10)
    const existing = dailyMap.get(day) || { total: 0, numinous: 0 }
    existing.total++
    if (d.numinosity && d.numinosity >= 4) existing.numinous++
    dailyMap.set(day, existing)
  }
  const dailyRhythm = Array.from(dailyMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, v]) => ({ date, count: v.total, numinous: v.numinous }))

  // ============================================================
  // 7. SOUL WISHES — REMOVED (2026-04-20 privacy fix)
  // soul_wish is personal raw text. Even "anonymized", re-identification is trivial
  // for users with distinctive content. Not aggregate-safe. Removed entirely.
  // ============================================================

  // ============================================================
  // 8. MASTER EVENTS DETECTION — the oracle core
  // Seth: clusters of dreams converge before reality manifests
  // ============================================================
  const masterEvents: MasterEvent[] = []
  let eventCounter = 0

  // 8a. PROCESS CONVERGENCE — same archetypal process across 3+ dreamers in tight window
  for (const [process, data] of Array.from(processMap.entries())) {
    if (data.dreamerSet.size >= 3 && data.numinousCount >= 1) {
      const ratio = data.numinousCount / data.count
      const strength = data.weightedCount * data.dreamerSet.size * (1 + ratio)
      const severity = strength >= 30 ? 'master_event' : strength >= 15 ? 'convergence' : strength >= 8 ? 'pattern' : 'signal'
      masterEvents.push({
        id: `proc-${eventCounter++}`,
        type: 'process_convergence',
        severity,
        title: process,
        description: {
          fr: `${data.dreamerSet.size} rêveurs traversent simultanément un processus de ${process.toLowerCase()}. ${data.numinousCount} grand(s) rêve(s) impliqué(s).`,
          en: `${data.dreamerSet.size} dreamers are simultaneously moving through ${process.toLowerCase()}. ${data.numinousCount} big dream(s) involved.`,
        },
        elements: [process],
        dreamerCount: data.dreamerSet.size,
        dreamCount: data.count,
        numinousRatio: Math.round(ratio * 100) / 100,
        signalStrength: Math.round(strength * 10) / 10,
        windowDays: range === '7d' ? 7 : range === '30d' ? 30 : range === 'lunar' ? 29 : 90,
      })
    }
  }

  // 8b. FIGURE CONVERGENCE — same figure across 3+ dreamers
  for (const [_, data] of Array.from(figureMap.entries())) {
    if (data.dreamerSet.size >= 3) {
      const ratio = data.numinousCount / data.count
      const strength = data.weightedCount * data.dreamerSet.size
      const severity = strength >= 25 ? 'master_event' : strength >= 12 ? 'convergence' : strength >= 6 ? 'pattern' : 'signal'
      masterEvents.push({
        id: `fig-${eventCounter++}`,
        type: 'figure_convergence',
        severity,
        title: data.name,
        description: {
          fr: `La figure "${data.name}" apparaît chez ${data.dreamerSet.size} rêveurs simultanément. Type : ${data.type}.`,
          en: `The figure "${data.name}" appears across ${data.dreamerSet.size} dreamers simultaneously. Type: ${data.type}.`,
        },
        elements: [data.name],
        dreamerCount: data.dreamerSet.size,
        dreamCount: data.count,
        numinousRatio: Math.round(ratio * 100) / 100,
        signalStrength: Math.round(strength * 10) / 10,
        windowDays: range === '7d' ? 7 : range === '30d' ? 30 : range === 'lunar' ? 29 : 90,
      })
    }
  }

  // 8c. THEME SURGE — same theme explodes across dreamers
  for (const [theme, data] of Array.from(themeMap.entries())) {
    if (data.dreamerSet.size >= 3 && data.weightedCount >= 5) {
      const strength = data.weightedCount * data.dreamerSet.size
      const severity = strength >= 20 ? 'convergence' : strength >= 10 ? 'pattern' : 'signal'
      masterEvents.push({
        id: `theme-${eventCounter++}`,
        type: 'theme_surge',
        severity,
        title: theme,
        description: {
          fr: `Le thème "${theme}" surgit chez ${data.dreamerSet.size} rêveurs (${data.count} rêves).`,
          en: `The theme "${theme}" surges across ${data.dreamerSet.size} dreamers (${data.count} dreams).`,
        },
        elements: [theme],
        dreamerCount: data.dreamerSet.size,
        dreamCount: data.count,
        numinousRatio: 0,
        signalStrength: Math.round(strength * 10) / 10,
        windowDays: range === '7d' ? 7 : range === '30d' ? 30 : range === 'lunar' ? 29 : 90,
      })
    }
  }

  // 8d. NUMINOUS CLUSTER — abnormal spike in big dreams
  if (numinousRate >= 25 && numinousDreams.length >= 3) {
    const numinousDreamers = new Set(numinousDreams.map(d => d.user_id))
    const strength = numinousDreams.length * numinousDreamers.size * (numinousRate / 10)
    masterEvents.push({
      id: `numinous-${eventCounter++}`,
      type: 'numinous_cluster',
      severity: strength >= 30 ? 'master_event' : strength >= 15 ? 'convergence' : 'pattern',
      title: 'Numinous Cluster',
      description: {
        fr: `${numinousRate}% des rêves sont numineux (normalement ~10%). ${numinousDreams.length} grands rêves chez ${numinousDreamers.size} rêveurs. Le champ onirique s'intensifie.`,
        en: `${numinousRate}% of dreams are numinous (normally ~10%). ${numinousDreams.length} big dreams across ${numinousDreamers.size} dreamers. The dream field is intensifying.`,
      },
      elements: ['numinous_spike'],
      dreamerCount: numinousDreamers.size,
      dreamCount: numinousDreams.length,
      numinousRatio: numinousRate / 100,
      signalStrength: Math.round(strength * 10) / 10,
      windowDays: range === '7d' ? 7 : range === '30d' ? 30 : range === 'lunar' ? 29 : 90,
    })
  }

  // Sort master events by signal strength
  masterEvents.sort((a, b) => b.signalStrength - a.signalStrength)

  // ============================================================
  // 9. GEOGRAPHIC BREAKDOWN (if global scope)
  // ============================================================
  let geoBreakdown: { country: string; dreamCount: number; dreamerCount: number }[] = []
  if (scope === 'global' && profileMap.size > 0) {
    const geoMap = new Map<string, { dreams: number; dreamers: Set<string> }>()
    for (const d of dreams) {
      const profile = profileMap.get(d.user_id)
      const country = profile?.country || 'unknown'
      const existing = geoMap.get(country) || { dreams: 0, dreamers: new Set<string>() }
      existing.dreams++
      existing.dreamers.add(d.user_id)
      geoMap.set(country, existing)
    }
    geoBreakdown = Array.from(geoMap.entries())
      .filter(([c]) => c !== 'unknown')
      .sort((a, b) => b[1].dreamers.size - a[1].dreamers.size)
      .map(([country, v]) => ({ country, dreamCount: v.dreams, dreamerCount: v.dreamers.size }))
  }

  // ============================================================
  // 10. PERSIST active master events to DB
  // ============================================================
  const significantEvents = masterEvents.filter(e => e.severity === 'convergence' || e.severity === 'master_event')
  if (significantEvents.length > 0) {
    for (const evt of significantEvents.slice(0, 5)) {
      await supabase.from('master_events').insert({
        event_type: evt.type,
        severity: evt.severity,
        title: evt.title,
        description: JSON.stringify(evt.description),
        converging_processes: evt.type === 'process_convergence' ? evt.elements : null,
        converging_figures: evt.type === 'figure_convergence' ? evt.elements : null,
        converging_themes: evt.type === 'theme_surge' ? evt.elements : null,
        scope,
        scope_value: scopeValue || null,
        dreamer_count: evt.dreamerCount,
        dream_count: evt.dreamCount,
        numinous_count: Math.round(evt.numinousRatio * evt.dreamCount),
        numinous_ratio: evt.numinousRatio,
        signal_strength: evt.signalStrength,
        window_start: since.toISOString(),
        window_end: now.toISOString(),
        status: 'active',
        raw_data: evt,
      }).then(() => {}) // fire-and-forget
    }
  }

  // ============================================================
  // 11. FETCH HISTORICAL MASTER EVENTS
  // ============================================================
  const { data: historicalEvents } = await supabase
    .from('master_events')
    .select('id, event_type, severity, title, description, signal_strength, dreamer_count, dream_count, status, confirmed_at, confirmation_note, created_at')
    .in('status', ['active', 'confirmed'])
    .order('signal_strength', { ascending: false })
    .limit(10)

  return NextResponse.json({
    collective: {
      range,
      scope,
      scopeValue: scopeValue || null,
      period: { from: since.toISOString(), to: now.toISOString() },
      stats: {
        totalDreams: dreams.length,
        uniqueDreamers: uniqueDreamers.size,
        numinousCount: numinousDreams.length,
        numinousRate,
        totalWeighted: Math.round(totalWeighted * 10) / 10,
        avgDreamsPerDay: dailyRhythm.length > 0
          ? Math.round((dreams.length / dailyRhythm.length) * 10) / 10
          : 0,
      },
      globalFigures,
      globalThemes,
      globalProcesses,
      moodLandscape,
      dailyRhythm,
      geoBreakdown,
    },
    masterEvents,
    historicalEvents: historicalEvents || [],
  })
}
