import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/stats
 *
 * GET → return aggregated lucid stats for the user :
 *   total_lucid_dreams, total_dreams, recall_rate, current_streak_per_week,
 *   top_signs (top 10 by occurrences), recent_lucid_per_day (last 30 days),
 *   technique_breakdown.
 *
 * Auteur : Yeshua, 2026-04-26.
 */

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const now = Date.now()
    const thirty = new Date(now - 30 * 86400000).toISOString()
    const seven = new Date(now - 7 * 86400000).toISOString()

    // Total kairos type=reve
    const { count: totalDreams } = await supabase
      .from('kairos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('kairos_type', 'reve')

    // Total lucid metadata where score >= 1
    const { data: lucidRows } = await supabase
      .from('lucid_kairos_metadata')
      .select('lucidity_score, lucidity_technique, created_at')
      .eq('user_id', userId)
      .gte('lucidity_score', 1)
      .order('created_at', { ascending: false })
      .limit(500)

    const totalLucid = (lucidRows || []).length

    // Streak this week (lucid count over last 7d)
    const lucidLastWeek = (lucidRows || []).filter((r: any) => r.created_at >= seven).length

    // Best streak (rough : max lucid in any rolling 7d window — V1 approx)
    const sortedAsc = [...(lucidRows || [])].sort((a: any, b: any) => a.created_at.localeCompare(b.created_at))
    let best = 0
    for (let i = 0; i < sortedAsc.length; i++) {
      const start = new Date(sortedAsc[i].created_at).getTime()
      let count = 0
      for (let j = i; j < sortedAsc.length; j++) {
        const t = new Date(sortedAsc[j].created_at).getTime()
        if (t - start <= 7 * 86400000) count++
        else break
      }
      best = Math.max(best, count)
    }

    // Recent 30 days — daily breakdown
    const recent = (lucidRows || []).filter((r: any) => r.created_at >= thirty)
    const dailyMap: Record<string, number> = {}
    for (let i = 0; i < 30; i++) {
      const d = new Date(now - i * 86400000)
      const k = d.toISOString().slice(0, 10)
      dailyMap[k] = 0
    }
    for (const r of recent) {
      const k = (r as any).created_at.slice(0, 10)
      if (k in dailyMap) dailyMap[k]++
    }
    const recent_lucid_per_day = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count }))

    // Technique breakdown
    const techMap: Record<string, number> = {}
    for (const r of lucidRows || []) {
      const t = (r as any).lucidity_technique || 'unknown'
      techMap[t] = (techMap[t] || 0) + 1
    }

    // Top signs
    const { data: signs } = await supabase
      .from('lucid_dream_signs')
      .select('id, sign_label, sign_category, occurrences_count, triggered_lucidity_count')
      .eq('user_id', userId)
      .order('occurrences_count', { ascending: false })
      .limit(10)

    // Total signs
    const { count: signsCount } = await supabase
      .from('lucid_dream_signs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    const recall_rate = totalDreams && totalDreams > 0
      ? Math.round((totalLucid / (totalDreams || 1)) * 100)
      : 0

    return NextResponse.json({
      stats: {
        total_dreams: totalDreams || 0,
        total_lucid_dreams: totalLucid,
        recall_rate_pct: recall_rate,
        current_streak_per_week: lucidLastWeek,
        best_streak_in_7d_window: best,
        signs_count: signsCount || 0,
        top_signs: signs || [],
        recent_lucid_per_day,
        technique_breakdown: techMap,
      },
    })
  } catch (e: any) {
    console.error('[lucid.stats.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
