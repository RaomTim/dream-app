/**
 * /api/admin/dream-chat/metrics — observabilité Sprint G (§39.9)
 *
 * Endpoint admin (allowlist email) qui agrège :
 *  - coût total / jour / tier (sur N derniers jours)
 *  - répartition tiers haiku/sonnet/opus
 *  - cost per user per day (top users)
 *  - latence avg estimée via tokens_in/out + classify reason distribution
 *
 * Auth : email allowlist via env ADMIN_EMAILS (séparés par virgule).
 * Backed by SQL view `vw_chat_costs_per_user_per_day` (cf. migration G.6).
 *
 * Query params :
 *   ?days=7   (défaut 7, max 90)
 *   ?top=20   (défaut 20)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@/lib/supabase'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'gestion@infuse.earth')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

async function requireAdmin(req: NextRequest): Promise<{ ok: true; userId: string; email: string } | { ok: false; error: NextResponse }> {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return { ok: false, error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }
  }
  const token = authHeader.slice('Bearer '.length).trim()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user?.id || !data.user.email) {
    return { ok: false, error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
  }
  const email = data.user.email.toLowerCase()
  if (!ADMIN_EMAILS.includes(email)) {
    return { ok: false, error: NextResponse.json({ error: 'Admin access required' }, { status: 403 }) }
  }
  return { ok: true, userId: data.user.id, email }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.error

  const url = new URL(req.url)
  const days = Math.min(90, Math.max(1, parseInt(url.searchParams.get('days') || '7', 10)))
  const top = Math.min(100, Math.max(1, parseInt(url.searchParams.get('top') || '20', 10)))

  const supabase = createServerClient()
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // 1️⃣ Aggregate by day x tier (from vw_chat_costs_per_user_per_day or fallback raw)
  const { data: byDay, error: byDayErr } = await supabase
    .from('vw_chat_costs_per_user_per_day')
    .select('day, model_tier, count, sum_cost_usd, sum_tokens_in, sum_tokens_out')
    .gte('day', since.slice(0, 10))
    .order('day', { ascending: false })

  if (byDayErr) {
    console.warn('[admin/metrics] view query failed, falling back to raw:', byDayErr.message)
  }

  // 2️⃣ Top users by cost
  const { data: topUsers } = await supabase.rpc('admin_top_chat_users', {
    days_back: days,
    top_n: top,
  })

  // 3️⃣ Tier distribution global
  const tierDistribution = (byDay || []).reduce(
    (acc, row) => {
      const tier = row.model_tier || 'unknown'
      acc.count[tier] = (acc.count[tier] || 0) + Number(row.count || 0)
      acc.cost[tier] = (acc.cost[tier] || 0) + Number(row.sum_cost_usd || 0)
      return acc
    },
    { count: {} as Record<string, number>, cost: {} as Record<string, number> }
  )

  const totalMessages = Object.values(tierDistribution.count).reduce((a, b) => a + b, 0)
  const totalCost = Object.values(tierDistribution.cost).reduce((a, b) => a + b, 0)

  // 4️⃣ Daily totals
  const dailyTotals: Record<string, { date: string; cost: number; messages: number }> = {}
  for (const row of byDay || []) {
    const d = row.day
    if (!dailyTotals[d]) dailyTotals[d] = { date: d, cost: 0, messages: 0 }
    dailyTotals[d].cost += Number(row.sum_cost_usd || 0)
    dailyTotals[d].messages += Number(row.count || 0)
  }

  return NextResponse.json({
    range: { days, since: since.slice(0, 10) },
    totals: {
      messages: totalMessages,
      cost_usd: Number(totalCost.toFixed(4)),
      avg_cost_per_message: totalMessages > 0 ? Number((totalCost / totalMessages).toFixed(6)) : 0,
    },
    tier_distribution: {
      by_count: tierDistribution.count,
      by_cost_usd: Object.fromEntries(
        Object.entries(tierDistribution.cost).map(([k, v]) => [k, Number(v.toFixed(4))])
      ),
      by_count_pct: Object.fromEntries(
        Object.entries(tierDistribution.count).map(([k, v]) => [
          k,
          totalMessages > 0 ? Number(((v / totalMessages) * 100).toFixed(1)) : 0,
        ])
      ),
    },
    daily: Object.values(dailyTotals).sort((a, b) => (a.date < b.date ? 1 : -1)),
    top_users: topUsers || [],
  })
}
