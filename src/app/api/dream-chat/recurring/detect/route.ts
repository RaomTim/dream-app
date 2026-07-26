/**
 * POST /api/dream-chat/recurring/detect
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 4 — Mode rêve récurrent + Re-entry Aizenstat).
 *
 * Détection : un même motif/figure/lieu/situation revient ≥5 fois dans kairos
 * sur 60 jours → upsert recurring_dream_patterns + propose Anima via
 * pending_proactive_messages category='pattern_emerging'.
 *
 * Garde-fou trauma : si valence_avg < -0.6 → trauma_flag = true →
 * la proposition pousse vers Sanctuaire (NightmareDepositChoiceModal),
 * PAS Re-entry (côté frontend, branche selon trauma_flag).
 *
 * Triggers :
 *   POST (auth user)                 → scan 60j pour ce user
 *   POST ?cron_secret=… &all_users=1 → batch global (cron Vercel daily 6h30 UTC)
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 300

const WINDOW_DAYS = 60
const MIN_OCCURRENCES = 5

type PatternKind = 'motif' | 'figure' | 'lieu' | 'situation'

interface Candidate {
  text: string
  kind: PatternKind
  kairosIds: string[]
  valences: number[]
  firstSeen: string
  lastSeen: string
}

async function detectForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<{ patterns_upserted: number; pending_created: number }> {
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 3600 * 1000).toISOString()

  // 1) Charge kairos des 60j (uniquement rêves/oniriques)
  const { data: kairos } = await supabase
    .from('kairos')
    .select(
      'id, raw_text, motif_tags, figures, setting_metadata, root_dream_patterns, affective_valence, created_at, kairos_type'
    )
    .eq('user_id', userId)
    .gte('created_at', cutoff)
    .in('kairos_type', ['reve', 'reverie', 'hypnagogie'])
    .limit(1000)

  if (!kairos || kairos.length < MIN_OCCURRENCES) {
    return { patterns_upserted: 0, pending_created: 0 }
  }

  // 2) Aggregate par (kind, normalized_text)
  const candidates = new Map<string, Candidate>()

  const addCandidate = (
    kind: PatternKind,
    rawName: string,
    kairosId: string,
    valence: number | null,
    createdAt: string
  ) => {
    if (!rawName || typeof rawName !== 'string') return
    const trimmed = rawName.trim()
    if (trimmed.length < 2 || trimmed.length > 80) return
    const norm = trimmed.toLowerCase()
    const key = `${kind}:${norm}`
    if (!candidates.has(key)) {
      candidates.set(key, {
        text: trimmed,
        kind,
        kairosIds: [],
        valences: [],
        firstSeen: createdAt,
        lastSeen: createdAt,
      })
    }
    const c = candidates.get(key)!
    if (!c.kairosIds.includes(kairosId)) {
      c.kairosIds.push(kairosId)
      if (typeof valence === 'number') c.valences.push(valence)
      if (createdAt < c.firstSeen) c.firstSeen = createdAt
      if (createdAt > c.lastSeen) c.lastSeen = createdAt
    }
  }

  for (const k of kairos) {
    const kid = k.id as string
    const valence = typeof k.affective_valence === 'number' ? k.affective_valence : null
    const createdAt = k.created_at as string

    // Motifs (motif_tags + root_dream_patterns)
    for (const t of (k.motif_tags as string[] | null) || []) {
      addCandidate('motif', t, kid, valence, createdAt)
    }
    for (const t of (k.root_dream_patterns as string[] | null) || []) {
      addCandidate('motif', t, kid, valence, createdAt)
    }

    // Figures (k.figures peut être objet { characters: [...], etc. } ou liste)
    const figures = k.figures as Record<string, unknown> | null
    if (figures && typeof figures === 'object') {
      for (const fkey of ['characters', 'figures', 'personnages']) {
        const arr = (figures as any)[fkey]
        if (Array.isArray(arr)) {
          for (const f of arr) {
            const name = typeof f === 'string' ? f : f?.name || f?.label
            if (name) addCandidate('figure', String(name), kid, valence, createdAt)
          }
        }
      }
    }

    // Lieux (setting_metadata.places ou setting_metadata.lieu)
    const setting = k.setting_metadata as Record<string, unknown> | null
    if (setting && typeof setting === 'object') {
      for (const pkey of ['places', 'lieu', 'lieux', 'location']) {
        const arr = (setting as any)[pkey]
        if (Array.isArray(arr)) {
          for (const p of arr) {
            const name = typeof p === 'string' ? p : p?.name || p?.label
            if (name) addCandidate('lieu', String(name), kid, valence, createdAt)
          }
        } else if (typeof arr === 'string' && arr.trim().length > 0) {
          addCandidate('lieu', arr, kid, valence, createdAt)
        }
      }
    }
  }

  // 3) Filtre count >= 5
  const recurring = Array.from(candidates.values()).filter(
    (c) => c.kairosIds.length >= MIN_OCCURRENCES
  )

  let upserted = 0
  let pendingCreated = 0

  for (const c of recurring) {
    const valenceAvg =
      c.valences.length > 0 ? c.valences.reduce((a, b) => a + b, 0) / c.valences.length : null
    const traumaFlag = valenceAvg !== null && valenceAvg < -0.6

    // Upsert (ON CONFLICT user_id+pattern_text+pattern_kind → update)
    const { data: upsertedRow, error: uErr } = await supabase
      .from('recurring_dream_patterns')
      .upsert(
        {
          user_id: userId,
          pattern_text: c.text,
          pattern_kind: c.kind,
          first_seen_at: c.firstSeen,
          last_seen_at: c.lastSeen,
          count_total: c.kairosIds.length,
          valence_avg: valenceAvg,
          kairos_ids: c.kairosIds,
          trauma_flag: traumaFlag,
        },
        { onConflict: 'user_id,pattern_text,pattern_kind' }
      )
      .select('id, acknowledged_at')
      .single()

    if (uErr || !upsertedRow) {
      console.warn('[recurring.detect] upsert failed for', c.text, uErr?.message)
      continue
    }
    upserted++

    // Si déjà acknowledged → ne pas re-spammer une proactive
    if (upsertedRow.acknowledged_at) continue

    // Anti-doublon proactive : check pending non-livré pour ce pattern
    const { data: existingPending } = await supabase
      .from('pending_proactive_messages')
      .select('id')
      .eq('user_id', userId)
      .eq('category', 'pattern_emerging')
      .ilike('content', `%"${c.text}"%`)
      .is('delivered_at', null)
      .limit(1)

    if (existingPending && existingPending.length > 0) continue

    const kindLabel: Record<PatternKind, string> = {
      motif: 'motif',
      figure: 'figure',
      lieu: 'lieu',
      situation: 'situation',
    }

    const content = traumaFlag
      ? `Le ${kindLabel[c.kind]} "${c.text}" revient dans ${c.kairosIds.length} de tes rêves récents — et chaque fois la valence est lourde. Le sanctuaire est là si tu veux y déposer ce qui pèse, sans interprétation.`
      : `Ce ${kindLabel[c.kind]} "${c.text}" revient dans ${c.kairosIds.length} de tes rêves récents. Aizenstat dirait qu'il a quelque chose à te dire. Veux-tu y retourner consciemment ? 5min.`

    await supabase.from('pending_proactive_messages').insert({
      user_id: userId,
      scheduled_for: new Date().toISOString(),
      category: 'pattern_emerging',
      content,
      context_kairos_ids: c.kairosIds,
    })
    pendingCreated++
  }

  return { patterns_upserted: upserted, pending_created: pendingCreated }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const url = new URL(req.url)
  const allUsersMode =
    body?.all_users === true || url.searchParams.get('all_users') === '1'

  if (allUsersMode) {
    // Batch (cron Vercel)
    const cronToken =
      req.headers.get('x-cron-secret') || url.searchParams.get('cron_secret')
    if (cronToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
    const { data: activeUsers } = await adminClient
      .from('kairos')
      .select('user_id')
      .gte('created_at', since)

    const uniqueUsers = Array.from(
      new Set((activeUsers || []).map((r) => r.user_id as string).filter(Boolean))
    )

    let totalPatterns = 0
    let totalPending = 0
    const errors: string[] = []
    for (const uid of uniqueUsers) {
      try {
        const r = await detectForUser(adminClient, uid)
        totalPatterns += r.patterns_upserted
        totalPending += r.pending_created
      } catch (e) {
        errors.push(uid + ': ' + (e instanceof Error ? e.message : 'err'))
      }
    }

    return NextResponse.json({
      users_scanned: uniqueUsers.length,
      patterns_upserted: totalPatterns,
      pending_created: totalPending,
      errors: errors.slice(0, 20),
    })
  }

  // Mode user-scoped
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const result = await detectForUser(supabase, userId)
  return NextResponse.json(result)
}
