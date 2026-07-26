/**
 * /api/admin/forest-cache/purge — cron purge cache Forêt expiré
 *
 * Spec : Forêt FIRST workflow, racine 3_TECHNICAL §32
 *
 * Trigger : Vercel cron (cf. vercel.json — 0 5 * * * UTC).
 *
 * Workflow :
 *   1. RPC purge_forest_query_cache_expired(ttl_hours)
 *      → supprime les rows de forest_query_cache plus vieilles que ttl_hours
 *      → returns deleted_count
 *   2. Renvoie { ok, deleted_count, ttl_hours }
 *
 * Auth : header `x-cron-secret` ou query `?cron_secret=...` matchant CRON_SECRET.
 * Pas de Bearer user — c'est un cron.
 *
 * Query params optionnels :
 *   - ttl_hours (default 24) — seuil d'expiration en heures
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

function getCronSecret(req: NextRequest): string | null {
  return (
    req.headers.get('x-cron-secret') ||
    req.nextUrl.searchParams.get('cron_secret') ||
    null
  )
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

  const ttlHoursParam = req.nextUrl.searchParams.get('ttl_hours')
  const ttlHours = ttlHoursParam ? Math.max(1, parseInt(ttlHoursParam, 10) || 24) : 24

  const supabase = createServerClient()
  const startedAt = Date.now()

  try {
    const { data, error } = await supabase.rpc(
      'purge_forest_query_cache_expired',
      { ttl_hours: ttlHours }
    )

    if (error) {
      // RPC peut ne pas exister sur un environnement de dev — best-effort log
      console.warn('[forest-cache/purge] RPC failed:', error.message)
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          ttl_hours: ttlHours,
        },
        { status: 500 }
      )
    }

    // RPC retourne soit un int (deleted_count) soit un row { deleted_count }
    let deletedCount: number = 0
    if (typeof data === 'number') {
      deletedCount = data
    } else if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const v = obj.deleted_count
      if (typeof v === 'number') deletedCount = v
    } else if (Array.isArray(data) && data.length > 0) {
      const v = (data[0] as Record<string, unknown>)?.deleted_count
      if (typeof v === 'number') deletedCount = v
    }

    return NextResponse.json({
      ok: true,
      run_at: new Date().toISOString(),
      duration_ms: Date.now() - startedAt,
      ttl_hours: ttlHours,
      deleted_count: deletedCount,
    })
  } catch (e: any) {
    console.error('[forest-cache/purge] fatal:', e?.message)
    return NextResponse.json(
      { error: e?.message || 'fatal' },
      { status: 500 }
    )
  }
}
