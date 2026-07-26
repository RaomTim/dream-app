import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/circles/:id/resonances
 *
 * COUCHE 1 — IA CROISE LES RÊVES DU CERCLE
 * Cross-reference les rêves partagés dans un cercle.
 * Détecte : figures récurrentes cross-dreamers, thèmes communs,
 * processus archétypaux partagés, résonances émotionnelles.
 */

type SharedDream = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  mood: string | null;
  numinosity: number | null;
  figure_types: any[] | null;
  entities: any | null;
  archetypal_process: string | null;
  tags: string[] | null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  // 🔒 2026-04-20 FIX BRECHE : l'appelant DOIT être membre du cercle
  // 🔒 2026-04-20 TIER 2 (session verification)
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const circleId = params.id
  const supabase = createServerClient()

  // 1. Get circle members
  const { data: members, error: memErr } = await supabase
    .from('circle_members')
    .select('user_id, display_name, role')
    .eq('circle_id', circleId)

  if (memErr) return NextResponse.json({ error: memErr.message }, { status: 500 })
  if (!members || members.length < 2) {
    return NextResponse.json({
      resonances: null,
      message: 'Need at least 2 members to detect resonances',
    })
  }

  // 🔒 Vérifier que l'user appelant est bien membre du cercle
  if (!members.some(m => m.user_id === userId)) {
    return NextResponse.json({ error: 'Not a member of this circle' }, { status: 403 })
  }

  const memberIds = members.map(m => m.user_id)
  const memberNames = new Map(members.map(m => [m.user_id, m.display_name || 'Rêveur anonyme']))

  // 2. Get dreams shared in this circle
  const { data: shares, error: shareErr } = await supabase
    .from('circle_shares')
    .select('dream_id, user_id')
    .eq('circle_id', circleId)
    .eq('share_type', 'dream')
    .not('dream_id', 'is', null)

  if (shareErr) return NextResponse.json({ error: shareErr.message }, { status: 500 })

  // 3. Fetch the actual dream data for shared dreams
  const sharedDreamIds = (shares || []).map(s => s.dream_id).filter(Boolean) as string[]

  let dreams: SharedDream[] = []
  if (sharedDreamIds.length > 0) {
    const { data: dreamData, error: dreamErr } = await supabase
      .from('dreams')
      .select('id, user_id, title, created_at, mood, numinosity, figure_types, entities, archetypal_process, tags')
      .in('id', sharedDreamIds)
      .order('created_at', { ascending: false })

    if (dreamErr) return NextResponse.json({ error: dreamErr.message }, { status: 500 })
    dreams = dreamData || []
  }

  // Also get recent dreams from all circle members (last 30 days) for richer cross-referencing
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const { data: recentDreams, error: recentErr } = await supabase
    .from('dreams')
    .select('id, user_id, title, created_at, mood, numinosity, figure_types, entities, archetypal_process, tags')
    .in('user_id', memberIds)
    .gte('created_at', thirtyDaysAgo)
    .neq('entry_type', 'day')
    .neq('entry_type', 'jour')
    .neq('entry_type', 'journal')
    .order('created_at', { ascending: false })

  if (recentErr) return NextResponse.json({ error: recentErr.message }, { status: 500 })

  // Merge shared + recent, dedup
  const allDreamIds = new Set<string>()
  const allDreams: SharedDream[] = []
  for (const d of [...dreams, ...(recentDreams || [])]) {
    if (!allDreamIds.has(d.id)) {
      allDreamIds.add(d.id)
      allDreams.push(d)
    }
  }

  if (allDreams.length < 2) {
    return NextResponse.json({
      resonances: null,
      message: 'Not enough dreams to detect resonances',
    })
  }

  // 4. CROSS-DREAMER FIGURES — figures appearing across different dreamers
  const figureMap = new Map<string, {
    name: string; type: string;
    dreamerSet: Set<string>;
    dreamIds: string[];
    dates: string[];
  }>()

  for (const d of allDreams) {
    const figures = d.figure_types as any[] | null
    if (!Array.isArray(figures)) continue
    for (const fig of figures) {
      if (!fig.name) continue
      const key = fig.name.toLowerCase().trim()
      const existing = figureMap.get(key) || {
        name: fig.name, type: fig.type || 'unknown',
        dreamerSet: new Set<string>(), dreamIds: [] as string[], dates: [] as string[],
      }
      existing.dreamerSet.add(d.user_id)
      if (!existing.dreamIds.includes(d.id)) existing.dreamIds.push(d.id)
      existing.dates.push(d.created_at)
      figureMap.set(key, existing)
    }
  }

  const sharedFigures = Array.from(figureMap.values())
    .filter(f => f.dreamerSet.size >= 2) // Must appear across 2+ members
    .sort((a, b) => b.dreamerSet.size - a.dreamerSet.size)
    .slice(0, 15)
    .map(f => ({
      name: f.name,
      type: f.type,
      dreamers: Array.from(f.dreamerSet).map(uid => memberNames.get(uid) || 'Anonyme'),
      dreamerCount: f.dreamerSet.size,
      appearances: f.dreamIds.length,
      dateRange: {
        first: f.dates.sort()[0],
        last: f.dates.sort()[f.dates.length - 1],
      },
    }))

  // 5. SHARED THEMES — tags appearing across different dreamers
  const themeMap = new Map<string, { count: number; dreamerSet: Set<string> }>()
  for (const d of allDreams) {
    if (d.tags && Array.isArray(d.tags)) {
      for (const tag of d.tags) {
        const existing = themeMap.get(tag) || { count: 0, dreamerSet: new Set<string>() }
        existing.count++
        existing.dreamerSet.add(d.user_id)
        themeMap.set(tag, existing)
      }
    }
  }

  const sharedThemes = Array.from(themeMap.entries())
    .filter(([_, v]) => v.dreamerSet.size >= 2)
    .sort((a, b) => b[1].dreamerSet.size - a[1].dreamerSet.size)
    .slice(0, 12)
    .map(([theme, v]) => ({
      theme,
      count: v.count,
      dreamers: Array.from(v.dreamerSet).map(uid => memberNames.get(uid) || 'Anonyme'),
    }))

  // 6. SHARED PROCESSES — archetypal processes across dreamers
  const processMap = new Map<string, { count: number; dreamerSet: Set<string> }>()
  for (const d of allDreams) {
    if (d.archetypal_process) {
      const existing = processMap.get(d.archetypal_process) || { count: 0, dreamerSet: new Set<string>() }
      existing.count++
      existing.dreamerSet.add(d.user_id)
      processMap.set(d.archetypal_process, existing)
    }
  }

  const sharedProcesses = Array.from(processMap.entries())
    .filter(([_, v]) => v.dreamerSet.size >= 2)
    .sort((a, b) => b[1].dreamerSet.size - a[1].dreamerSet.size)
    .map(([process, v]) => ({
      process,
      count: v.count,
      dreamerCount: v.dreamerSet.size,
    }))

  // 7. MOOD RESONANCE — same moods across dreamers
  const moodMap = new Map<string, { count: number; dreamerSet: Set<string> }>()
  for (const d of allDreams) {
    if (d.mood) {
      const existing = moodMap.get(d.mood) || { count: 0, dreamerSet: new Set<string>() }
      existing.count++
      existing.dreamerSet.add(d.user_id)
      moodMap.set(d.mood, existing)
    }
  }

  const sharedMoods = Array.from(moodMap.entries())
    .filter(([_, v]) => v.dreamerSet.size >= 2)
    .sort((a, b) => b[1].dreamerSet.size - a[1].dreamerSet.size)
    .slice(0, 8)
    .map(([mood, v]) => ({
      mood,
      count: v.count,
      dreamerCount: v.dreamerSet.size,
    }))

  // 8. NUMINOUS SIGNAL — any big dreams in the circle?
  const numinousDreams = allDreams
    .filter(d => d.numinosity && d.numinosity >= 4)
    .map(d => ({
      title: d.title || '(sans titre)',
      dreamer: memberNames.get(d.user_id) || 'Anonyme',
      numinosity: d.numinosity,
      date: d.created_at,
    }))

  return NextResponse.json({
    resonances: {
      circleId,
      memberCount: members.length,
      dreamsAnalyzed: allDreams.length,
      sharedFigures,
      sharedThemes,
      sharedProcesses,
      sharedMoods,
      numinousDreams,
      insight: sharedFigures.length > 0 || sharedThemes.length > 0
        ? {
            fr: `Le cercle partage ${sharedFigures.length} figure(s) et ${sharedThemes.length} thème(s) communs. ${sharedProcesses.length > 0 ? `Mouvement collectif dominant : ${sharedProcesses[0]?.process}.` : ''}`,
            en: `The circle shares ${sharedFigures.length} figure(s) and ${sharedThemes.length} common theme(s). ${sharedProcesses.length > 0 ? `Dominant collective movement: ${sharedProcesses[0]?.process}.` : ''}`,
          }
        : {
            fr: 'Pas encore assez de résonances détectées. Continuez à partager vos rêves.',
            en: 'Not enough resonances detected yet. Keep sharing your dreams.',
          },
    },
  })
}
