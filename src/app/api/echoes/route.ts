import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { synthesizeEchoes } from '@/lib/ai-router'
import { queryForestForMode } from '@/lib/forest-retrieval'
import { requireAuth } from '@/lib/auth-server'

export const maxDuration = 45

/**
 * GET /api/echoes?userId=xxx
 *
 * ÉCHOS PROPHÉTIQUES — Feature #1 de Dream App.
 *
 * Architecture Seth-informée (11 livres) :
 * - Les rêves se connectent par RÉSONANCE SÉMANTIQUE, pas par mots-clés
 * - pgvector cosine similarity dans un espace multilingue (1536 dims)
 * - Aucune limite temporelle : un rêve d'il y a 2 ans peut s'allumer aujourd'hui
 * - 90% des rêves sont prophétiques (Seth) — l'app les RÉVEILLE
 *
 * 4 types d'échos détectés :
 * 1. Rêve ↔ Jour (prophétiques — le rêve préparait cet événement)
 * 2. Rêve ↔ Rêve (patterns récurrents, processus archétypaux liés)
 * 3. Échos inverses (fuite ↔ poursuite, perte ↔ don)
 * 4. Root dreams (patterns universels partagés)
 *
 * Coût LLM : $0.00 — tout est pgvector SQL.
 */

interface Echo {
  id: string
  echoType: 'prophetic' | 'dream-day' | 'dream-dream' | 'root-dream' | 'archetypal'
  sourceId: string
  sourceTitle: string
  sourceExcerpt: string
  sourceDate: string
  sourceType: string
  matchId: string
  matchTitle: string
  matchExcerpt: string
  matchDate: string
  matchType: string
  resonance: string
  strength: number // 0-1 cosine similarity
  timeDelta: string // "il y a 3 mois", "hier"
  isProphetic: boolean
}

export async function GET(req: NextRequest) {
  // 🔒 2026-04-20 TIER 2 (session verification)
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const wantSynthesis = req.nextUrl.searchParams.get('synthesis') === 'true'
  const locale = (req.nextUrl.searchParams.get('locale') || 'fr') as 'fr' | 'en'

  const supabase = createServerClient()
  const echoes: Echo[] = []

  // =============================================
  // PHASE 1 — ÉCHOS VECTORIELS (pgvector)
  // La magie : cosine similarity multilingue sans limite temporelle
  // =============================================

  // Récupérer TOUTES les entrées avec embedding (pas juste 7 jours)
  // Pour les imports massifs, les rêves peuvent dater de mois/années
  // On prend les N plus récents pour limiter le coût des requêtes pgvector
  const { data: recentEntries } = await supabase
    .from('dreams')
    .select('id, title, raw_text, entry_type, embedding, archetypal_process, archetypal_trajectory, intensity_score, prophetic_status, root_dream_patterns, created_at')
    .eq('user_id', userId)
    .not('embedding', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (recentEntries && recentEntries.length > 0) {
    for (const entry of recentEntries) {
      // Pour chaque entrée récente, chercher les échos dans TOUT l'historique
      // pgvector fait le gros du travail — une seule requête SQL
      const { data: matches } = await supabase.rpc('find_dream_echoes', {
        p_user_id: userId,
        p_embedding: entry.embedding,
        p_exclude_id: entry.id,
        p_match_threshold: 0.35, // cosine distance threshold (plus petit = plus proche)
        p_max_results: 10,
      })

      if (matches && matches.length > 0) {
        for (const match of matches) {
          // Déterminer le type d'écho
          const isDreamDay = (entry.entry_type === 'day' && (match.entry_type === 'dream' || !match.entry_type))
            || ((!entry.entry_type || entry.entry_type === 'dream') && match.entry_type === 'day')

          const timeDeltaMs = Math.abs(new Date(entry.created_at).getTime() - new Date(match.created_at).getTime())
          const timeDeltaDays = Math.floor(timeDeltaMs / (24 * 60 * 60 * 1000))

          // Un écho est PROPHÉTIQUE si :
          // - C'est un rêve ancien qui résonne avec un journal de jour récent
          // - ET le rêve a plus de 3 jours
          const isProphetic = isDreamDay && timeDeltaDays > 3
            && ((entry.entry_type === 'day' && (match.entry_type === 'dream' || !match.entry_type))
              || false)

          // Déterminer la résonance (ce qui connecte les deux)
          let resonance = ''
          if (entry.archetypal_process && match.archetypal_process) {
            if (entry.archetypal_process === match.archetypal_process) {
              resonance = `Même processus : ${entry.archetypal_process}`
            } else {
              // Échos inverses (descente ↔ retour, poursuite ↔ fuite)
              const inverses: Record<string, string> = {
                'descent': 'return-with-boon',
                'return-with-boon': 'descent',
                'pursuit': 'flight',
                'flight': 'pursuit',
                'death-rebirth': 'call',
                'call': 'death-rebirth',
                'dissolution': 'coniunctio',
                'coniunctio': 'dissolution',
              }
              if (inverses[entry.archetypal_process] === match.archetypal_process) {
                resonance = `Écho inversé : ${entry.archetypal_process} ↔ ${match.archetypal_process}`
              } else {
                resonance = `${entry.archetypal_process} → ${match.archetypal_process}`
              }
            }
          }

          if (!resonance) {
            resonance = `Résonance sémantique (${Math.round((1 - match.distance) * 100)}%)`
          }

          const echoType = isProphetic ? 'prophetic'
            : isDreamDay ? 'dream-day'
            : 'dream-dream'

          echoes.push({
            id: `${entry.id}-${match.id}`,
            echoType,
            sourceId: entry.id,
            sourceTitle: entry.title || (entry.raw_text || '').substring(0, 60),
            sourceExcerpt: (entry.raw_text || '').substring(0, 120),
            sourceDate: entry.created_at,
            sourceType: entry.entry_type || 'dream',
            matchId: match.id,
            matchTitle: match.title || (match.raw_text || '').substring(0, 60),
            matchExcerpt: (match.raw_text || '').substring(0, 120),
            matchDate: match.created_at,
            matchType: match.entry_type || 'dream',
            resonance,
            strength: 1 - match.distance, // Convert distance to similarity (0-1)
            timeDelta: formatTimeDelta(timeDeltaDays),
            isProphetic,
          })

          // Si prophétique, marquer le rêve ancien comme "awakened"
          if (isProphetic && match.prophetic_status === 'dormant') {
            await supabase
              .from('dreams')
              .update({ prophetic_status: 'awakened', updated_at: new Date().toISOString() })
              .eq('id', match.id)
          }
        }
      }
    }
  }

  // =============================================
  // PHASE 2 — ÉCHOS ARCHÉTYPAUX (même processus, sans embedding)
  // Fallback pour les rêves sans embedding (anciens ou en cours de traitement)
  // =============================================

  const { data: recentWithProcess } = await supabase
    .from('dreams')
    .select('id, title, raw_text, entry_type, archetypal_process, created_at')
    .eq('user_id', userId)
    .not('archetypal_process', 'is', null)
    .order('created_at', { ascending: false })
    .limit(20)

  if (recentWithProcess && recentWithProcess.length > 0) {
    for (const entry of recentWithProcess) {
      // Chercher d'autres rêves avec le même processus archétypal
      const { data: archetypeMatches } = await supabase
        .from('dreams')
        .select('id, title, raw_text, entry_type, archetypal_process, created_at')
        .eq('user_id', userId)
        .eq('archetypal_process', entry.archetypal_process!)
        .neq('id', entry.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (archetypeMatches) {
        for (const match of archetypeMatches) {
          // Éviter les doublons avec les échos vectoriels
          const alreadyFound = echoes.some(e => e.id === `${entry.id}-${match.id}` || e.id === `${match.id}-${entry.id}`)
          if (alreadyFound) continue

          const timeDeltaDays = Math.floor(
            Math.abs(new Date(entry.created_at).getTime() - new Date(match.created_at).getTime()) / (24 * 60 * 60 * 1000)
          )

          echoes.push({
            id: `${entry.id}-${match.id}`,
            echoType: 'archetypal',
            sourceId: entry.id,
            sourceTitle: entry.title || (entry.raw_text || '').substring(0, 60),
            sourceExcerpt: (entry.raw_text || '').substring(0, 120),
            sourceDate: entry.created_at,
            sourceType: entry.entry_type || 'dream',
            matchId: match.id,
            matchTitle: match.title || (match.raw_text || '').substring(0, 60),
            matchExcerpt: (match.raw_text || '').substring(0, 120),
            matchDate: match.created_at,
            matchType: match.entry_type || 'dream',
            resonance: `Processus partagé : ${entry.archetypal_process}`,
            strength: 0.6,
            timeDelta: formatTimeDelta(timeDeltaDays),
            isProphetic: false,
          })
        }
      }
    }
  }

  // =============================================
  // PHASE 3 — ROOT DREAMS (patterns universels)
  // =============================================

  const { data: recentRoots } = await supabase
    .from('dreams')
    .select('id, title, raw_text, root_dream_patterns, created_at')
    .eq('user_id', userId)
    .not('root_dream_patterns', 'is', null)
    .order('created_at', { ascending: false })
    .limit(15)

  if (recentRoots) {
    for (const entry of recentRoots) {
      if (!entry.root_dream_patterns || entry.root_dream_patterns.length === 0) continue

      // Chercher des rêves avec les mêmes root patterns
      for (const pattern of entry.root_dream_patterns) {
        const { data: rootMatches } = await supabase
          .from('dreams')
          .select('id, title, raw_text, root_dream_patterns, created_at')
          .eq('user_id', userId)
          .neq('id', entry.id)
          .contains('root_dream_patterns', [pattern])
          .order('created_at', { ascending: false })
          .limit(2)

        if (rootMatches) {
          for (const match of rootMatches) {
            const alreadyFound = echoes.some(e => e.id === `${entry.id}-${match.id}` || e.id === `${match.id}-${entry.id}`)
            if (alreadyFound) continue

            const timeDeltaDays = Math.floor(
              Math.abs(new Date(entry.created_at).getTime() - new Date(match.created_at).getTime()) / (24 * 60 * 60 * 1000)
            )

            echoes.push({
              id: `${entry.id}-${match.id}`,
              echoType: 'root-dream',
              sourceId: entry.id,
              sourceTitle: entry.title || (entry.raw_text || '').substring(0, 60),
              sourceExcerpt: (entry.raw_text || '').substring(0, 120),
              sourceDate: entry.created_at,
              sourceType: 'dream',
              matchId: match.id,
              matchTitle: match.title || (match.raw_text || '').substring(0, 60),
              matchExcerpt: (match.raw_text || '').substring(0, 120),
              matchDate: match.created_at,
              matchType: 'dream',
              resonance: `Root dream partagé : ${pattern}`,
              strength: 0.5,
              timeDelta: formatTimeDelta(timeDeltaDays),
              isProphetic: false,
            })
          }
        }
      }
    }
  }

  // Trier : prophétiques d'abord, puis par force, déduplicater
  const uniqueEchoes = deduplicateEchoes(echoes)
  uniqueEchoes.sort((a, b) => {
    if (a.isProphetic && !b.isProphetic) return -1
    if (!a.isProphetic && b.isProphetic) return 1
    return b.strength - a.strength
  })

  // ─── Couche de synthèse Forêt (on-demand) ───
  // Si ?synthesis=true, on nourrit Sonnet avec les échos + chunks Forêt
  // absorbés pour produire une lecture tissée. Cabling 3 couches :
  //   individuelle (l'utilisateur) — ce endpoint
  //   groupe / globale — endpoints séparés à construire sur la même mécanique
  let synthesis: string | null = null
  if (wantSynthesis && uniqueEchoes.length > 0) {
    try {
      // Query des résonances archétypales cumulées pour orienter la Forêt
      const signalQuery = uniqueEchoes
        .slice(0, 10)
        .map((e) => `${e.resonance} | ${e.sourceTitle} ↔ ${e.matchTitle}`)
        .join(' — ')
      const forestContext = await queryForestForMode(
        supabase,
        signalQuery,
        'day', // mode day pour lecture archétypale depuis les échos
        8
      )
      const echoesSummary = JSON.stringify(
        uniqueEchoes.slice(0, 15).map((e) => ({
          type: e.echoType,
          resonance: e.resonance,
          source: e.sourceTitle,
          match: e.matchTitle,
          strength: Math.round(e.strength * 100) / 100,
          timeDelta: e.timeDelta,
          prophetic: e.isProphetic,
        })),
        null,
        2
      )
      synthesis = await synthesizeEchoes(echoesSummary, forestContext, locale)
    } catch (e) {
      console.error('[echoes] synthesis failed (non-blocking):', e)
    }
  }

  return NextResponse.json({
    echoes: uniqueEchoes.slice(0, 30),
    synthesis,
    stats: {
      total: uniqueEchoes.length,
      prophetic: uniqueEchoes.filter(e => e.isProphetic).length,
      vectorial: uniqueEchoes.filter(e => e.echoType === 'dream-day' || e.echoType === 'dream-dream' || e.echoType === 'prophetic').length,
      archetypal: uniqueEchoes.filter(e => e.echoType === 'archetypal').length,
      rootDream: uniqueEchoes.filter(e => e.echoType === 'root-dream').length,
    },
    // Legacy compatibility
    correspondences: uniqueEchoes.slice(0, 30).map(e => ({
      id: e.id,
      echoType: e.echoType === 'prophetic' ? 'dream-day' : e.echoType,
      nightFragment: e.sourceType === 'dream' ? e.sourceTitle : e.matchTitle,
      nightTime: e.sourceType === 'dream' ? formatTime(e.sourceDate) : formatTime(e.matchDate),
      dayEvent: e.sourceType === 'day' ? e.sourceTitle : e.matchTitle,
      dayTime: e.sourceType === 'day' ? formatTime(e.sourceDate) : formatTime(e.matchDate),
      resonance: e.resonance,
      strength: Math.min(3, Math.ceil(e.strength * 3)) as 1 | 2 | 3,
      isProphetic: e.isProphetic,
      timeDelta: e.timeDelta,
    })),
  })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatTimeDelta(days: number): string {
  if (days === 0) return "aujourd'hui"
  if (days === 1) return 'hier'
  if (days < 7) return `il y a ${days} jours`
  if (days < 30) return `il y a ${Math.floor(days / 7)} semaine${days >= 14 ? 's' : ''}`
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`
  return `il y a ${Math.floor(days / 365)} an${days >= 730 ? 's' : ''}`
}

function deduplicateEchoes(echoes: Echo[]): Echo[] {
  // Step 1 — deduplicate symmetric pairs (A↔B = B↔A), keep first seen
  const pairSeen = new Set<string>()
  const afterPairDedup = echoes.filter(e => {
    const key1 = `${e.sourceId}-${e.matchId}`
    const key2 = `${e.matchId}-${e.sourceId}`
    if (pairSeen.has(key1) || pairSeen.has(key2)) return false
    pairSeen.add(key1)
    return true
  })

  // Step 2 — deduplicate by (sourceId, echoType): if the same source dream
  // yields multiple cards of the same type (e.g. 10 vectorial matches for one
  // dream), keep only the highest-strength occurrence per (sourceId, type).
  // This eliminates the "3× same dream title" visual glitch in DreamSync.
  const bestBySourceType = new Map<string, Echo>()
  for (const echo of afterPairDedup) {
    const key = `${echo.sourceId}::${echo.echoType}`
    const existing = bestBySourceType.get(key)
    if (!existing || echo.strength > existing.strength) {
      bestBySourceType.set(key, echo)
    }
  }

  return Array.from(bestBySourceType.values())
}
