/**
 * /api/dream-chat/prophetic/detect — Feature 1 (2026-04-29)
 *
 * Spec : 4_LOG.md 2026-04-29 — moat philosophique.
 *
 * Job batch quotidien — pour chaque user actif (≥1 kairos déposé en 7j) :
 *   1. récupère life_journal_entries des 14 derniers jours (signes diurnes récents)
 *   2. embed le raw_text de chaque entry (si embedding_semantic absent)
 *   3. RPC match_kairos_for_life_echo : kairos passés du même user, similarity ≥ 0.85,
 *      created_at < entry.created_at - 7j (au moins 7j d'écart pour qualifier de prophétique)
 *   4. crée pending_proactive_messages category='echo_detected' avec context_kairos_ids =
 *      [kairos_id_passé, life_entry_id_present_uuid]
 *   5. anti-doublon : skip si déjà créé pending pour ce kairos_id dans 30j
 *
 * Cardrage anti-surconfirmation :
 *   - JAMAIS « c'est prophétique »
 *   - TOUJOURS « voici un écho POSSIBLE »
 *   - « c'est toi qui sens si c'est vrai »
 *   - Threshold strict 0.85
 *
 * Triggers :
 *   POST /api/dream-chat/prophetic/detect (auth user) — détecte pour le user authentifié
 *   POST /api/dream-chat/prophetic/detect avec body { all_users: true } + cron_secret
 *     → batch global (réservé service_role / cron Vercel)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'
import { embedText } from '@/lib/forest-retrieval'

export const maxDuration = 300

const SIMILARITY_THRESHOLD = 0.85
const MIN_DAYS_GAP = 7              // au moins 7j entre kairos passé et entry présente
const ENTRIES_LOOKBACK_DAYS = 14    // signes diurnes récents
const ACTIVE_USER_LOOKBACK_DAYS = 7 // user "actif" si kairos déposé dans 7j
const ANTI_DOUBLON_DAYS = 30        // skip si déjà pending pour ce kairos dans 30j
const MAX_ENTRIES_PER_USER = 50     // garde-fou

type AdminClient = ReturnType<typeof createServerClient>

function shortSummary(text: string, maxLen = 60): string {
  if (!text) return ''
  const cleaned = text.trim().replace(/\s+/g, ' ')
  if (cleaned.length <= maxLen) return cleaned
  return cleaned.slice(0, maxLen - 1).replace(/\s+\S*$/, '') + '…'
}

function relativeTimeFr(fromIso: string, toIso: string): string {
  const from = new Date(fromIso).getTime()
  const to = new Date(toIso).getTime()
  const diffMs = Math.max(0, to - from)
  const days = Math.floor(diffMs / (24 * 3600 * 1000))
  if (days < 30) return `il y a ${days} jour${days > 1 ? 's' : ''}`
  const months = Math.floor(days / 30)
  if (months < 12) return `il y a ${months} mois`
  const years = Math.floor(days / 365)
  return `il y a ${years} an${years > 1 ? 's' : ''}`
}

async function detectForUser(
  supabase: AdminClient,
  userId: string
): Promise<{ proposed: number; skipped: number; entries_scanned: number; matches_found: number }> {
  const now = Date.now()
  const entriesSince = new Date(now - ENTRIES_LOOKBACK_DAYS * 24 * 3600 * 1000).toISOString()

  // 1️⃣ Charge life_journal_entries des 14j (jour récent)
  const { data: entries, error: entriesErr } = await supabase
    .from('life_journal_entries')
    .select('id, raw_text, created_at, embedding_semantic')
    .eq('user_id', userId)
    .eq('user_archived', false)
    .gte('created_at', entriesSince)
    .order('created_at', { ascending: false })
    .limit(MAX_ENTRIES_PER_USER)

  if (entriesErr) {
    return { proposed: 0, skipped: 0, entries_scanned: 0, matches_found: 0 }
  }
  if (!entries || entries.length === 0) {
    return { proposed: 0, skipped: 0, entries_scanned: 0, matches_found: 0 }
  }

  let proposed = 0
  let skipped = 0
  let matchesFound = 0

  for (const entry of entries) {
    if (!entry.raw_text || entry.raw_text.trim().length < 10) continue

    // 2️⃣ Embed entry si manquant (et persiste pour réutilisation)
    let embedding: number[] | null = null
    if (Array.isArray(entry.embedding_semantic) && entry.embedding_semantic.length === 1536) {
      embedding = entry.embedding_semantic as number[]
    } else {
      try {
        embedding = await embedText(entry.raw_text)
        // Persist (fire-and-forget, swallow erreur)
        await supabase
          .from('life_journal_entries')
          .update({ embedding_semantic: embedding, embeddings_pending: false })
          .eq('id', entry.id)
      } catch (e) {
        console.warn('[prophetic/detect] embedText failed:', (e as Error).message)
        continue
      }
    }
    if (!embedding) continue

    // 3️⃣ Match kairos passés > 7j d'écart
    const beforeDate = new Date(new Date(entry.created_at).getTime() - MIN_DAYS_GAP * 24 * 3600 * 1000).toISOString()

    const { data: matches, error: matchErr } = await supabase.rpc('match_kairos_for_life_echo', {
      query_embedding: embedding,
      target_user: userId,
      before_date: beforeDate,
      match_count: 3,
      min_similarity: SIMILARITY_THRESHOLD,
    })
    if (matchErr) {
      console.warn('[prophetic/detect] RPC failed:', matchErr.message)
      continue
    }
    if (!matches || matches.length === 0) continue

    matchesFound += matches.length

    // 4️⃣ Pour chaque match, créer pending si pas déjà fait dans 30j
    for (const match of matches as Array<{ id: string; raw_text: string; kairos_type: string | null; created_at: string; similarity: number }>) {
      // Anti-doublon : check pending dans les 30j pour ce kairos_id
      const antiDoublonSince = new Date(now - ANTI_DOUBLON_DAYS * 24 * 3600 * 1000).toISOString()
      const { data: existing } = await supabase
        .from('pending_proactive_messages')
        .select('id')
        .eq('user_id', userId)
        .eq('category', 'echo_detected')
        .contains('context_kairos_ids', [match.id])
        .gte('created_at', antiDoublonSince)
        .limit(1)

      if (existing && existing.length > 0) {
        skipped++
        continue
      }

      // Construit le message — cardrage anti-surconfirmation
      const entrySummary = shortSummary(entry.raw_text)
      const kairosSummary = shortSummary(match.raw_text)
      const ago = relativeTimeFr(match.created_at, entry.created_at)
      const content = `Hier tu as croisé « ${entrySummary} ». ${ago.charAt(0).toUpperCase() + ago.slice(1)} tu rêvais « ${kairosSummary} ». C'est peut-être un écho — c'est toi qui sens. Veux-tu voir le miroir ?`

      // context_kairos_ids = [kairos passé, life entry présent]
      // Note : life_journal_entries.id est uuid (compatible context_kairos_ids uuid[])
      const { error: insertErr } = await supabase
        .from('pending_proactive_messages')
        .insert({
          user_id: userId,
          scheduled_for: new Date().toISOString(),
          category: 'echo_detected',
          content,
          context_kairos_ids: [match.id, entry.id],
        })
      if (insertErr) {
        console.warn('[prophetic/detect] insert pending failed:', insertErr.message)
        continue
      }
      proposed++
    }
  }

  return { proposed, skipped, entries_scanned: entries.length, matches_found: matchesFound }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const allUsersMode = body?.all_users === true || req.nextUrl.searchParams.get('all_users') === '1'

  if (allUsersMode) {
    const cronToken =
      req.headers.get('x-cron-secret') ||
      req.nextUrl.searchParams.get('cron_secret')
    if (cronToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    ) as unknown as AdminClient

    // Récupère users actifs (kairos déposé dans 7j)
    const since = new Date(Date.now() - ACTIVE_USER_LOOKBACK_DAYS * 24 * 3600 * 1000).toISOString()
    const { data: activeUsers } = await adminClient
      .from('kairos')
      .select('user_id')
      .gte('created_at', since)
    const uniqueUsers = Array.from(
      new Set((activeUsers || []).map((r: { user_id: string }) => r.user_id).filter(Boolean))
    )

    let totalProposed = 0
    let totalSkipped = 0
    let totalScanned = 0
    let totalMatches = 0
    const errors: string[] = []
    for (const uid of uniqueUsers) {
      try {
        const r = await detectForUser(adminClient, uid)
        totalProposed += r.proposed
        totalSkipped += r.skipped
        totalScanned += r.entries_scanned
        totalMatches += r.matches_found
      } catch (e) {
        errors.push(uid + ': ' + (e instanceof Error ? e.message : 'err'))
      }
    }
    return NextResponse.json({
      users_scanned: uniqueUsers.length,
      entries_scanned: totalScanned,
      matches_found: totalMatches,
      proposed: totalProposed,
      skipped: totalSkipped,
      errors,
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
