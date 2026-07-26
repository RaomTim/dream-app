/**
 * /api/dream-chat/threads/detect — B.2 (2026-04-28)
 *
 * Spec : 2_DESIGN.md §11.bis.20.10 + Tim arbitrage seuil k=3 dépôts.
 *
 * Job batch async — détecte motifs/personnages/lieux récurrents dans les kairos
 * d'un user (>=3 dépôts en 30j) et propose des threads thématiques via
 * pending_proactive_messages avec category='thread_proposed'.
 *
 * Triggers :
 *   POST /api/dream-chat/threads/detect (auth user) → détecte pour le user authentifié
 *   POST /api/dream-chat/threads/detect avec body { all_users: true } → batch global
 *     (réservé aux service_role / cron Vercel)
 *
 * Stratégie heuristique MVP (Sprint G : upgrade vers IA classifier) :
 *   - Pour chaque user : récupère ses kairos des 30 derniers jours
 *   - Aggregate sur tags + entities.figures + entities.lieux + entities.personnages
 *   - Pour chaque candidat (motif/personnage/lieu) avec count >= 3 :
 *       - Vérifie qu'aucun thread actif n'existe déjà (par name proche OU par chevauchement kairos_ids)
 *       - Vérifie qu'aucune proactive_message thread_proposed pas encore livrée n'existe
 *       - Crée la pending_proactive_message
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const K_MIN = 3
const WINDOW_DAYS = 30

type DetectedCandidate = {
  type: 'motif' | 'personnage' | 'saison' | 'intention' | 'lieu' | 'synchronicite' | 'question'
  name: string
  kairosIds: string[]
}

async function detectForUser(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<{ proposed: number; skipped: number }> {
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 3600 * 1000).toISOString()

  // 1️⃣ Charge kairos des 30j
  const { data: kairos } = await supabase
    .from('kairos')
    .select('id, raw_text, tags, entities, root_dream_patterns')
    .eq('user_id', userId)
    .gte('created_at', cutoff)
    .limit(500)

  if (!kairos || kairos.length === 0) return { proposed: 0, skipped: 0 }

  // 2️⃣ Aggregate sur tags + entities.figures/lieux/personnages
  const candidates = new Map<string, DetectedCandidate>()

  for (const k of kairos) {
    const kid = k.id as string

    const addCandidate = (type: DetectedCandidate['type'], name: string) => {
      if (!name || name.length < 2 || name.length > 60) return
      const norm = name.trim().toLowerCase()
      const key = `${type}:${norm}`
      if (!candidates.has(key)) {
        candidates.set(key, { type, name: name.trim(), kairosIds: [] })
      }
      const c = candidates.get(key)!
      if (!c.kairosIds.includes(kid)) c.kairosIds.push(kid)
    }

    // Tags (motifs)
    const tags = (k.tags as string[] | null) || []
    for (const t of tags) addCandidate('motif', t)

    // Root dream patterns (motifs structurels)
    const rdp = (k.root_dream_patterns as string[] | null) || []
    for (const t of rdp) addCandidate('motif', t)

    // Entities (figures, lieux, personnages)
    const entities = (k.entities as Record<string, unknown> | null) || {}
    if (Array.isArray(entities.figures)) {
      for (const f of entities.figures as Array<{ name?: string } | string>) {
        const name = typeof f === 'string' ? f : f?.name
        if (name) addCandidate('personnage', name)
      }
    }
    if (Array.isArray(entities.personnages)) {
      for (const p of entities.personnages as Array<{ name?: string } | string>) {
        const name = typeof p === 'string' ? p : p?.name
        if (name) addCandidate('personnage', name)
      }
    }
    if (Array.isArray(entities.lieux)) {
      for (const l of entities.lieux as Array<{ name?: string } | string>) {
        const name = typeof l === 'string' ? l : l?.name
        if (name) addCandidate('lieu', name)
      }
    }
  }

  // 3️⃣ Filter : count >= K_MIN
  const recurring = Array.from(candidates.values()).filter((c) => c.kairosIds.length >= K_MIN)

  // 4️⃣ Pour chaque candidat, check pas déjà existant (thread actif + pending undelivered)
  let proposed = 0
  let skipped = 0
  for (const c of recurring) {
    // Check thread actif déjà existant
    const { data: existingThreads } = await supabase
      .from('threads')
      .select('id, name')
      .eq('user_id', userId)
      .eq('type', c.type)
      .is('archived_at', null)
      .ilike('name', '%' + c.name.slice(0, 30) + '%')
      .limit(1)
    if (existingThreads && existingThreads.length > 0) { skipped++; continue }

    // Check pending proactive message thread_proposed pas encore livrée
    const { data: existingPending } = await supabase
      .from('pending_proactive_messages')
      .select('id')
      .eq('user_id', userId)
      .eq('category', 'thread_proposed')
      .is('delivered_at', null)
      .ilike('content', '%' + c.name.slice(0, 30) + '%')
      .limit(1)
    if (existingPending && existingPending.length > 0) { skipped++; continue }

    // Crée la proactive message
    const typeLabel = {
      motif: 'le motif',
      personnage: 'la figure',
      saison: 'la saison',
      intention: 'l\'intention',
      lieu: 'le lieu',
      synchronicite: 'la synchronicité',
      question: 'la question',
    }[c.type]

    const content = `J'ai remarqué que ${typeLabel} "${c.name}" revient dans ${c.kairosIds.length} de tes dépôts récents. Veux-tu qu'on en fasse un fil — un thread pour le tisser dans le temps ?`

    await supabase.from('pending_proactive_messages').insert({
      user_id: userId,
      scheduled_for: new Date().toISOString(),
      category: 'thread_proposed',
      content,
      context_kairos_ids: c.kairosIds,
    })
    proposed++
  }

  return { proposed, skipped }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const allUsersMode = body?.all_users === true

  if (allUsersMode) {
    // Mode batch — réservé service_role (cron Vercel)
    const cronToken = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('cron_secret')
    if (cronToken !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }
    // Utilise service_role pour bypass RLS
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    )

    // Récupère les users actifs des 7 derniers jours
    const since = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString()
    const { data: activeUsers } = await adminClient
      .from('kairos')
      .select('user_id')
      .gte('created_at', since)
    const uniqueUsers = Array.from(new Set((activeUsers || []).map((r) => r.user_id as string).filter(Boolean)))

    let totalProposed = 0
    let totalSkipped = 0
    const errors: string[] = []
    for (const uid of uniqueUsers) {
      try {
        const r = await detectForUser(adminClient as unknown as ReturnType<typeof createServerClient>, uid)
        totalProposed += r.proposed
        totalSkipped += r.skipped
      } catch (e) {
        errors.push(uid + ': ' + (e instanceof Error ? e.message : 'err'))
      }
    }
    return NextResponse.json({ users_scanned: uniqueUsers.length, proposed: totalProposed, skipped: totalSkipped, errors })
  }

  // Mode user-scoped
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()
  const result = await detectForUser(supabase, userId)
  return NextResponse.json(result)
}
