/**
 * /api/personal-dictionary/refresh — Feature 2 (2026-04-29)
 *
 * Re-aggregate kairos → personal_dictionary_symbols.
 * Pour chaque user (auth scope OU all_users + cron) :
 *   1. récupère kairos des 90 derniers jours
 *   2. extrait symboles depuis :
 *        - motif_tags (text[])         → kind='motif'
 *        - root_dream_patterns (text[])→ kind='motif'
 *        - figures (jsonb)             → kind='figure'
 *        - setting_metadata.lieux      → kind='lieu'
 *        - somatic_markers keys        → kind='sensation'
 *   3. pour chaque (symbol_text, kind) avec count >= 3 sur 90j, upsert dans
 *      personal_dictionary_symbols :
 *        - count_total = nombre de kairos distincts
 *        - first_seen_at / last_seen_at
 *        - valence_avg = AVG(kairos.affective_valence)
 *        - associated_figures = top 5 figures cooccurrentes
 *        - evolution_summary = computed (heuristique sombre/porteur)
 *
 * Triggers :
 *   POST /api/personal-dictionary/refresh (auth user)
 *   POST /api/personal-dictionary/refresh?cron_secret=...&all_users=1 (cron)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 300

const WINDOW_DAYS = 90
const MIN_COUNT = 3
const MAX_KAIROS_PER_USER = 1000
const ACTIVE_USER_LOOKBACK_DAYS = 30 // user a au moins 1 kairos dans 30j

type AdminClient = ReturnType<typeof createServerClient>

type SymbolKind = 'motif' | 'figure' | 'lieu' | 'sensation' | 'synchronicite'

type SymbolAggregate = {
  symbol_text: string
  symbol_kind: SymbolKind
  kairos_ids: Set<string>
  first_seen_at: string
  last_seen_at: string
  valence_sum: number
  valence_count: number
  cooccurring_figures: Map<string, number>
}

function normalize(s: unknown): string {
  if (typeof s !== 'string') return ''
  return s.trim().toLowerCase()
}

function pushSymbol(
  agg: Map<string, SymbolAggregate>,
  kind: SymbolKind,
  rawText: string,
  kairosId: string,
  createdAt: string,
  valence: number | null
) {
  const norm = normalize(rawText)
  if (!norm || norm.length < 2 || norm.length > 80) return
  const key = `${kind}::${norm}`
  let entry = agg.get(key)
  if (!entry) {
    entry = {
      symbol_text: norm,
      symbol_kind: kind,
      kairos_ids: new Set<string>(),
      first_seen_at: createdAt,
      last_seen_at: createdAt,
      valence_sum: 0,
      valence_count: 0,
      cooccurring_figures: new Map<string, number>(),
    }
    agg.set(key, entry)
  }
  entry.kairos_ids.add(kairosId)
  if (createdAt < entry.first_seen_at) entry.first_seen_at = createdAt
  if (createdAt > entry.last_seen_at) entry.last_seen_at = createdAt
  if (typeof valence === 'number' && !Number.isNaN(valence)) {
    entry.valence_sum += valence
    entry.valence_count += 1
  }
}

function extractFigures(figures: unknown): string[] {
  // figures jsonb peut être un array ou un objet { primary: [...], ...}
  const out: string[] = []
  if (!figures) return out
  if (Array.isArray(figures)) {
    for (const f of figures) {
      if (typeof f === 'string') out.push(f)
      else if (f && typeof f === 'object' && typeof (f as { name?: unknown }).name === 'string') {
        out.push((f as { name: string }).name)
      }
    }
  } else if (typeof figures === 'object') {
    for (const v of Object.values(figures as Record<string, unknown>)) {
      if (Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === 'string') out.push(item)
          else if (item && typeof item === 'object' && typeof (item as { name?: unknown }).name === 'string') {
            out.push((item as { name: string }).name)
          }
        }
      } else if (typeof v === 'string') {
        out.push(v)
      }
    }
  }
  return out
}

function extractLieux(setting: unknown): string[] {
  if (!setting || typeof setting !== 'object') return []
  const out: string[] = []
  const s = setting as Record<string, unknown>
  for (const key of ['lieux', 'lieu', 'places', 'locations']) {
    const v = s[key]
    if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === 'string') out.push(item)
        else if (item && typeof item === 'object' && typeof (item as { name?: unknown }).name === 'string') {
          out.push((item as { name: string }).name)
        }
      }
    } else if (typeof v === 'string') {
      out.push(v)
    }
  }
  return out
}

function extractSensations(somatic: unknown): string[] {
  if (!somatic || typeof somatic !== 'object') return []
  const out: string[] = []
  for (const [k, v] of Object.entries(somatic as Record<string, unknown>)) {
    // valeurs falsy (0, false, null) skip
    if (v === false || v === 0 || v === null || v === undefined) continue
    out.push(k)
  }
  return out
}

function computeEvolution(
  kairosWithDates: Array<{ created_at: string; valence: number | null }>
): string {
  if (kairosWithDates.length < 4) return ''
  // partition older half / newer half
  const sorted = [...kairosWithDates].sort((a, b) => a.created_at.localeCompare(b.created_at))
  const mid = Math.floor(sorted.length / 2)
  const older = sorted.slice(0, mid).filter((k) => typeof k.valence === 'number')
  const newer = sorted.slice(mid).filter((k) => typeof k.valence === 'number')
  if (older.length === 0 || newer.length === 0) return ''
  const oldAvg = older.reduce((s, k) => s + (k.valence || 0), 0) / older.length
  const newAvg = newer.reduce((s, k) => s + (k.valence || 0), 0) / newer.length
  const delta = newAvg - oldAvg
  if (Math.abs(delta) < 0.25) return 'présence stable'
  if (delta > 0) {
    if (oldAvg < -0.2) return 'était sombre, devient porteur'
    return 'gagne en lumière'
  }
  if (newAvg < -0.2) return 'devient plus pesant'
  return 'perd en luminosité'
}

async function refreshForUser(
  supabase: AdminClient,
  userId: string
): Promise<{ symbols_processed: number; upserts: number; archived_stale: number }> {
  const since = new Date(Date.now() - WINDOW_DAYS * 24 * 3600 * 1000).toISOString()

  // 2026-07-26 (B4) — first_seen_at / last_seen_at d'un symbole datent du RÊVE, pas
  // du dépôt : c'est eux qui pilotent la fenêtre saison/année de l'écran Univers
  // (RPC dream_symbol_book). Un symbole vu dans un rêve d'avril raconté en juillet
  // doit compter pour avril. `occurred_at` vaut created_at tant qu'aucune date de
  // rêve n'est posée → aucun changement sur les données existantes.
  const BASE =
    'id, created_at, motif_tags, archetypal_tags, root_dream_patterns, figures, setting_metadata, somatic_markers, affective_valence, kairos_type'
  const withOccurred = await supabase
    .from('kairos')
    .select(`${BASE}, occurred_at`)
    .eq('user_id', userId)
    .gte('occurred_at', since)
    .order('occurred_at', { ascending: false })
    .limit(MAX_KAIROS_PER_USER)

  let kairos: any[] | null = withOccurred.data as any
  let error = withOccurred.error
  if (error && /occurred_at|column .* does not exist|42703/i.test(`${error.message} ${(error as any).code || ''}`)) {
    const legacy = await supabase
      .from('kairos')
      .select(BASE)
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(MAX_KAIROS_PER_USER)
    kairos = legacy.data as any
    error = legacy.error
  }

  if (error) {
    console.warn('[personal-dictionary/refresh] fetch kairos failed:', error.message)
    return { symbols_processed: 0, upserts: 0, archived_stale: 0 }
  }
  if (!kairos || kairos.length === 0) {
    return { symbols_processed: 0, upserts: 0, archived_stale: 0 }
  }

  const agg = new Map<string, SymbolAggregate>()

  // Pour cooccurrence figures par kairos
  const figuresByKairos = new Map<string, string[]>()

  for (const k of kairos) {
    const kid = k.id as string
    // B4 : la date du symbole = la date du rêve (fallback dépôt si colonne absente).
    const created = ((k as any).occurred_at || k.created_at) as string
    const valence = typeof k.affective_valence === 'number' ? k.affective_valence : null

    const figs = extractFigures(k.figures).map((f) => f.trim()).filter(Boolean)
    figuresByKairos.set(kid, figs)

    const tags = (k.motif_tags as string[] | null) || []
    for (const t of tags) pushSymbol(agg, 'motif', t, kid, created, valence)

    const rdp = (k.root_dream_patterns as string[] | null) || []
    for (const t of rdp) pushSymbol(agg, 'motif', t, kid, created, valence)

    for (const f of figs) pushSymbol(agg, 'figure', f, kid, created, valence)

    const lieux = extractLieux(k.setting_metadata)
    for (const l of lieux) pushSymbol(agg, 'lieu', l, kid, created, valence)

    const sensations = extractSensations(k.somatic_markers)
    for (const s of sensations) pushSymbol(agg, 'sensation', s, kid, created, valence)

    if (k.kairos_type === 'synchronicite') {
      const archetypal = (k.archetypal_tags as string[] | null) || []
      for (const t of archetypal) pushSymbol(agg, 'synchronicite', t, kid, created, valence)
    }
  }

  // Calcul cooccurrences figures + filter MIN_COUNT
  const finalSymbols = Array.from(agg.values()).filter((s) => s.kairos_ids.size >= MIN_COUNT)

  for (const sym of finalSymbols) {
    const kidArr = Array.from(sym.kairos_ids)
    for (const kid of kidArr) {
      const figs = figuresByKairos.get(kid) || []
      for (const f of figs) {
        const fnorm = f.trim()
        if (!fnorm) continue
        // Skip si la figure EST le symbole lui-même (kind='figure')
        if (sym.symbol_kind === 'figure' && normalize(fnorm) === sym.symbol_text) continue
        sym.cooccurring_figures.set(fnorm, (sym.cooccurring_figures.get(fnorm) || 0) + 1)
      }
    }
  }

  // Compute evolution_summary par symbole
  const evolutionByKey = new Map<string, string>()
  for (const sym of finalSymbols) {
    const kairosWithDates = Array.from(sym.kairos_ids).map((kid) => {
      const k = kairos.find((kk) => kk.id === kid)
      return {
        // B4 : l'évolution d'un symbole se lit dans l'ordre des RÊVES, pas des dépôts.
        created_at: (((k as any)?.occurred_at as string) || (k?.created_at as string) || ''),
        valence: typeof k?.affective_valence === 'number' ? k.affective_valence : null,
      }
    })
    evolutionByKey.set(`${sym.symbol_kind}::${sym.symbol_text}`, computeEvolution(kairosWithDates))
  }

  // Upsert
  const now = new Date().toISOString()
  let upserts = 0
  for (const sym of finalSymbols) {
    const valenceAvg = sym.valence_count > 0 ? sym.valence_sum / sym.valence_count : null
    const topFigures = Array.from(sym.cooccurring_figures.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name]) => name)

    const evolution = evolutionByKey.get(`${sym.symbol_kind}::${sym.symbol_text}`) || ''

    const { error: upErr } = await supabase
      .from('personal_dictionary_symbols')
      .upsert(
        {
          user_id: userId,
          symbol_text: sym.symbol_text,
          symbol_kind: sym.symbol_kind,
          first_seen_at: sym.first_seen_at,
          last_seen_at: sym.last_seen_at,
          count_total: sym.kairos_ids.size,
          valence_avg: valenceAvg,
          associated_figures: topFigures,
          evolution_summary: evolution || null,
          archived_at: null, // si refresh re-trouve un symbol archivé, on le réveille
          updated_at: now,
        },
        { onConflict: 'user_id,symbol_text,symbol_kind', ignoreDuplicates: false }
      )
    if (upErr) {
      console.warn('[personal-dictionary/refresh] upsert failed for', sym.symbol_text, ':', upErr.message)
      continue
    }
    upserts++
  }

  // Soft-archive : symbols qui n'apparaissent plus dans la fenêtre 90j
  // (last_seen_at < since dans la table) — auto-archive pour ne pas polluer la liste
  const { data: stale } = await supabase
    .from('personal_dictionary_symbols')
    .select('id')
    .eq('user_id', userId)
    .is('archived_at', null)
    .lt('last_seen_at', since)
  let archivedStale = 0
  if (stale && stale.length > 0) {
    const ids = stale.map((s: { id: string }) => s.id)
    const { error: archErr } = await supabase
      .from('personal_dictionary_symbols')
      .update({ archived_at: now })
      .in('id', ids)
    if (!archErr) archivedStale = ids.length
  }

  return { symbols_processed: finalSymbols.length, upserts, archived_stale: archivedStale }
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

    const since = new Date(Date.now() - ACTIVE_USER_LOOKBACK_DAYS * 24 * 3600 * 1000).toISOString()
    // ⚠️ Ici on garde created_at À DESSEIN (B4) : « qui a utilisé l'app récemment »
    // est bien une question de DÉPÔT, pas de date de rêve. Un rêveur qui rentre
    // aujourd'hui dix rêves de l'an dernier est un utilisateur actif aujourd'hui.
    const { data: activeUsers } = await adminClient
      .from('kairos')
      .select('user_id')
      .gte('created_at', since)
    const uniqueUsers = Array.from(
      new Set((activeUsers || []).map((r: { user_id: string }) => r.user_id).filter(Boolean))
    )

    let totalUpserts = 0
    let totalProcessed = 0
    let totalArchived = 0
    const errors: string[] = []
    for (const uid of uniqueUsers) {
      try {
        const r = await refreshForUser(adminClient, uid)
        totalUpserts += r.upserts
        totalProcessed += r.symbols_processed
        totalArchived += r.archived_stale
      } catch (e) {
        errors.push(uid + ': ' + (e instanceof Error ? e.message : 'err'))
      }
    }
    return NextResponse.json({
      users_scanned: uniqueUsers.length,
      symbols_processed: totalProcessed,
      upserts: totalUpserts,
      archived_stale: totalArchived,
      errors,
    })
  }

  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const result = await refreshForUser(supabase, userId)
  return NextResponse.json(result)
}
