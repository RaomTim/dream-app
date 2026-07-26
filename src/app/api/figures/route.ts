import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { synthesizeFigures } from '@/lib/ai-router'
import { queryForestForMode } from '@/lib/forest-retrieval'
import { requireAuth } from '@/lib/auth-server'

export const maxDuration = 30

/**
 * GET /api/figures?userId=...
 *
 * Agrège les figures de rêve depuis dreams.figure_types.
 * Chaque figure a: name, type, confidence, description, recurring_signal.
 * On agrège par nom (case-insensitive), on compte les occurrences,
 * et on retourne les motifs triés par fréquence.
 */
export async function GET(req: NextRequest) {
  // 🔒 2026-04-20 TIER 2 (session verification)
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const wantSynthesis = req.nextUrl.searchParams.get('synthesis') === 'true'
  const locale = (req.nextUrl.searchParams.get('locale') || 'fr') as 'fr' | 'en'

  const supabase = createServerClient()

  // Récupérer tous les rêves avec figure_types
  const { data: dreams, error } = await supabase
    .from('dreams')
    .select('id, figure_types, created_at')
    .eq('user_id', userId)
    .not('figure_types', 'is', null)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!dreams || dreams.length === 0) return NextResponse.json({ motifs: [], edges: [] })

  // Agrégation par nom de figure (case-insensitive)
  const figureMap = new Map<string, {
    name: string
    displayName: string
    type: string
    occurrences: number
    dreamIds: string[]
    firstSeen: string
    lastSeen: string
    descriptions: string[]
    types: string[]
  }>()

  for (const dream of dreams) {
    const figures = dream.figure_types as any[]
    if (!Array.isArray(figures)) continue

    for (const fig of figures) {
      if (!fig.name) continue
      const key = fig.name.toLowerCase().trim()

      const existing = figureMap.get(key)
      if (existing) {
        existing.occurrences++
        if (!existing.dreamIds.includes(dream.id)) {
          existing.dreamIds.push(dream.id)
        }
        existing.lastSeen = dream.created_at
        if (fig.description) existing.descriptions.push(fig.description)
        if (fig.type && !existing.types.includes(fig.type)) existing.types.push(fig.type)
      } else {
        figureMap.set(key, {
          name: key,
          displayName: fig.name,
          type: fig.type || 'unknown',
          occurrences: 1,
          dreamIds: [dream.id],
          firstSeen: dream.created_at,
          lastSeen: dream.created_at,
          descriptions: fig.description ? [fig.description] : [],
          types: fig.type ? [fig.type] : [],
        })
      }
    }
  }

  // Convertir en Motif[] trié par occurrences
  const allFigures = Array.from(figureMap.values())
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 40)

  const motifs = allFigures.map((f, i) => ({
    id: `fig-${i}`,
    label: f.displayName,
    occurrences: f.occurrences,
    firstSeen: new Date(f.firstSeen).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    emergentPhase: isEmergent(f),
    type: f.type,
    types: f.types,
    dreamIds: f.dreamIds,
  }))

  // Edges = figures qui partagent des rêves (co-occurrence)
  const edges: Array<{ a: string; b: string; weight: number }> = []
  for (let i = 0; i < allFigures.length && i < 20; i++) {
    for (let j = i + 1; j < allFigures.length && j < 20; j++) {
      const shared = allFigures[i].dreamIds.filter(d => allFigures[j].dreamIds.includes(d))
      if (shared.length > 0) {
        edges.push({ a: `fig-${i}`, b: `fig-${j}`, weight: shared.length })
      }
    }
  }

  // ─── Couche de synthèse Forêt (on-demand) ───
  let synthesis: string | null = null
  if (wantSynthesis && motifs.length > 0) {
    try {
      // Query orientée autour des figures les plus saillantes
      const topFigures = motifs
        .slice(0, 8)
        .map((m) => `${m.label} (${m.type}, ${m.occurrences}×)`)
        .join(' | ')
      const forestContext = await queryForestForMode(
        supabase,
        `figures de rêve récurrentes : ${topFigures}. archetypes, initiation, dialogue avec les présences.`,
        'dream',
        8
      )
      const motifsSummary = JSON.stringify(
        motifs.slice(0, 15).map((m) => ({
          name: m.label,
          type: m.type,
          types: m.types,
          occurrences: m.occurrences,
          firstSeen: m.firstSeen,
          emergent: m.emergentPhase,
        })),
        null,
        2
      )
      synthesis = await synthesizeFigures(motifsSummary, forestContext, locale)
    } catch (e) {
      console.error('[figures] synthesis failed (non-blocking):', e)
    }
  }

  return NextResponse.json({ motifs, edges, synthesis })
}

function isEmergent(f: { firstSeen: string; lastSeen: string; occurrences: number }): boolean {
  const firstSeen = new Date(f.firstSeen)
  const lastSeen = new Date(f.lastSeen)
  const daysSinceFirst = (Date.now() - firstSeen.getTime()) / (1000 * 60 * 60 * 24)
  const daysSinceLast = (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceFirst < 60 && daysSinceLast < 30 && f.occurrences >= 2
}
