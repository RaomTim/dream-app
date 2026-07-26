import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/dreams/lifeline?userId=xxx
 *
 * LIGNE DE VIE — arc narratif cross-rêves.
 * Agrège : figures récurrentes + évolution, thèmes, grands rêves,
 * échos prophétiques confirmés, engagements honorés.
 */

export async function GET(req: NextRequest) {
  // 🔒 2026-04-20 TIER 2 (session verification)
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()

  // Fetch all dreams ordered by date
  const { data: dreams, error } = await supabase
    .from('dreams')
    .select('id, title, raw_text, created_at, entry_type, mood, numinosity, soul_wish, honoring_action, honoring_status, honoring_note, prophetic_status, figure_types, entities, archetypal_process, tags')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!dreams || dreams.length === 0) return NextResponse.json({ lifeline: null })

  // 1. TIMELINE — monthly buckets
  const monthBuckets = new Map<string, { month: string; count: number; dreams: number; days: number; numinous: number }>()
  for (const d of dreams) {
    const date = new Date(d.created_at)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const existing = monthBuckets.get(key) || { month: key, count: 0, dreams: 0, days: 0, numinous: 0 }
    existing.count++
    if (d.entry_type === 'day' || d.entry_type === 'jour' || d.entry_type === 'journal') {
      existing.days++
    } else {
      existing.dreams++
    }
    if (d.numinosity && d.numinosity >= 4) existing.numinous++
    monthBuckets.set(key, existing)
  }

  // 2. FIGURES — recurring with evolution timeline
  const figureTimeline = new Map<string, { name: string; type: string; dates: string[]; dreamIds: string[] }>()
  for (const d of dreams) {
    const figures = d.figure_types as any[] | null
    if (!Array.isArray(figures)) continue
    for (const fig of figures) {
      if (!fig.name) continue
      const key = fig.name.toLowerCase().trim()
      const existing = figureTimeline.get(key) || {
        name: fig.name, type: fig.type || 'unknown', dates: [] as string[], dreamIds: [] as string[],
      }
      existing.dates.push(d.created_at)
      if (!existing.dreamIds.includes(d.id)) existing.dreamIds.push(d.id)
      figureTimeline.set(key, existing)
    }
  }
  // Only keep recurring figures (2+ appearances)
  const recurringFigures = Array.from(figureTimeline.values())
    .filter(f => f.dreamIds.length >= 2)
    .sort((a, b) => b.dreamIds.length - a.dreamIds.length)
    .slice(0, 15)
    .map(f => ({
      name: f.name,
      type: f.type,
      appearances: f.dreamIds.length,
      firstSeen: f.dates[0],
      lastSeen: f.dates[f.dates.length - 1],
      timeline: f.dates.map(d => d.substring(0, 10)),
    }))

  // 3. THEMES — from tags + archetypal_process
  const themeCount = new Map<string, number>()
  for (const d of dreams) {
    if (d.tags && Array.isArray(d.tags)) {
      for (const tag of d.tags) {
        themeCount.set(tag, (themeCount.get(tag) || 0) + 1)
      }
    }
    if (d.archetypal_process) {
      themeCount.set(`◈ ${d.archetypal_process}`, (themeCount.get(`◈ ${d.archetypal_process}`) || 0) + 1)
    }
  }
  const topThemes = Array.from(themeCount.entries())
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([theme, count]) => ({ theme, count }))

  // 4. NUMINOUS DREAMS — big dreams (numinosity >= 4)
  const numinousDreams = dreams
    .filter(d => d.numinosity && d.numinosity >= 4)
    .map(d => ({
      id: d.id,
      title: d.title || (d.raw_text || '').substring(0, 60),
      date: d.created_at,
      numinosity: d.numinosity,
      soulWish: d.soul_wish,
    }))

  // 5. PROPHETIC ECHOES — awakened or confirmed
  const propheticDreams = dreams
    .filter(d => d.prophetic_status === 'awakened' || d.prophetic_status === 'confirmed')
    .map(d => ({
      id: d.id,
      title: d.title || (d.raw_text || '').substring(0, 60),
      date: d.created_at,
      status: d.prophetic_status,
    }))

  // 6. HONORING — engagement tracker
  const honoringDreams = dreams.filter(d => d.honoring_action)
  const honoredCount = honoringDreams.filter(d => d.honoring_status === 'honored').length
  const pledgedCount = honoringDreams.filter(d => d.honoring_status === 'pledged').length
  const honoringList = honoringDreams.map(d => ({
    id: d.id,
    title: d.title || (d.raw_text || '').substring(0, 40),
    action: d.honoring_action,
    status: d.honoring_status,
    note: d.honoring_note,
    date: d.created_at,
  }))

  return NextResponse.json({
    lifeline: {
      timeline: Array.from(monthBuckets.values()),
      recurringFigures,
      topThemes,
      numinousDreams,
      propheticDreams,
      honoring: {
        total: honoringDreams.length,
        honored: honoredCount,
        pledged: pledgedCount,
        list: honoringList,
      },
      stats: {
        totalDreams: dreams.filter(d => d.entry_type !== 'day' && d.entry_type !== 'jour' && d.entry_type !== 'journal').length,
        totalDays: dreams.filter(d => d.entry_type === 'day' || d.entry_type === 'jour' || d.entry_type === 'journal').length,
        totalEntries: dreams.length,
        firstEntry: dreams[0].created_at,
        lastEntry: dreams[dreams.length - 1].created_at,
      },
    },
  })
}
