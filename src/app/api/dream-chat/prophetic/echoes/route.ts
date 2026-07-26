/**
 * /api/dream-chat/prophetic/echoes — Feature 1 (2026-04-29)
 *
 * GET → liste les pending_proactive_messages category='echo_detected' du user.
 *       Joint le kairos passé + life_journal_entry présente pour chaque écho.
 *
 * Query params :
 *   include_delivered=true → inclut aussi les échos déjà livrés
 *   limit=20               → max
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const includeDelivered = req.nextUrl.searchParams.get('include_delivered') === 'true'
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20', 10), 50)

  try {
    const supabase = createServerClient()

    let query = supabase
      .from('pending_proactive_messages')
      .select('id, content, context_kairos_ids, scheduled_for, delivered_at, user_responded, created_at')
      .eq('user_id', userId)
      .eq('category', 'echo_detected')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!includeDelivered) {
      query = query.is('delivered_at', null)
    }

    const { data: pendings, error } = await query
    if (error) {
      return NextResponse.json({ echoes: [], _warning: error.message })
    }

    if (!pendings || pendings.length === 0) {
      return NextResponse.json({ echoes: [] })
    }

    // Hydrate kairos passés + life entries
    const kairosIds = new Set<string>()
    const entryIds = new Set<string>()
    for (const p of pendings) {
      const ids = (p.context_kairos_ids as string[] | null) || []
      // convention : [kairos_id_passé, life_entry_id]
      if (ids[0]) kairosIds.add(ids[0])
      if (ids[1]) entryIds.add(ids[1])
    }

    const [kairosRes, entriesRes] = await Promise.all([
      kairosIds.size > 0
        ? supabase
            .from('kairos')
            .select('id, raw_text, kairos_type, created_at')
            .in('id', Array.from(kairosIds))
        : Promise.resolve({ data: [] as Array<{ id: string; raw_text: string; kairos_type: string | null; created_at: string }> }),
      entryIds.size > 0
        ? supabase
            .from('life_journal_entries')
            .select('id, raw_text, category, sub_category, created_at')
            .in('id', Array.from(entryIds))
        : Promise.resolve({ data: [] as Array<{ id: string; raw_text: string; category: string | null; sub_category: string | null; created_at: string }> }),
    ])

    const kairosMap = new Map((kairosRes.data || []).map((k) => [k.id, k]))
    const entriesMap = new Map((entriesRes.data || []).map((e) => [e.id, e]))

    const echoes = pendings.map((p) => {
      const ids = (p.context_kairos_ids as string[] | null) || []
      return {
        id: p.id,
        content: p.content,
        scheduled_for: p.scheduled_for,
        delivered_at: p.delivered_at,
        user_responded: p.user_responded,
        created_at: p.created_at,
        past_kairos: ids[0] ? kairosMap.get(ids[0]) || null : null,
        present_entry: ids[1] ? entriesMap.get(ids[1]) || null : null,
      }
    })

    return NextResponse.json({ echoes })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ echoes: [], _error: msg }, { status: 200 })
  }
}
