import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { synthesizeBodyOracle } from '@/lib/ai-router'
import { queryForestForMode } from '@/lib/forest-retrieval'
import { requireAuth } from '@/lib/auth-server'

export const maxDuration = 30

/**
 * GET /api/oracle-corps?userId=...
 *
 * Agrège les données somatiques depuis dreams.somatic_location et dreams.body_symbolism.
 * Retourne les corrélations par zone corporelle (Mindell dreambody).
 *
 * Returns: { correlations: SomaticCorrelation[] }
 */

export async function GET(req: NextRequest) {
  // 🔒 2026-04-20 TIER 2 (session verification)
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const wantSynthesis = req.nextUrl.searchParams.get('synthesis') === 'true'
  const locale = (req.nextUrl.searchParams.get('locale') || 'fr') as 'fr' | 'en'

  const supabase = createServerClient()

  // Fetch dreams with somatic data
  const { data: dreams, error } = await supabase
    .from('dreams')
    .select('id, title, created_at, somatic_location, body_symbolism, entry_type')
    .eq('user_id', userId)
    .or('somatic_location.neq.null,body_symbolism.neq.null')
    .in('entry_type', ['dream', 'reve', 'reentry'])
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!dreams || dreams.length === 0) return NextResponse.json({ correlations: [] })

  // Aggregate by zone
  const zoneMap = new Map<string, {
    zone: string
    count: number
    dreams: Array<{
      id: string
      title: string | null
      created_at: string
      body_symbolism: any
      somatic_location: string | null
    }>
  }>()

  for (const dream of dreams) {
    // From explicit somatic_location
    const zones = new Set<string>()

    if (dream.somatic_location) {
      zones.add(dream.somatic_location)
    }

    // From body_symbolism.zones (extracted by Passe 2)
    if (dream.body_symbolism?.zones && Array.isArray(dream.body_symbolism.zones)) {
      for (const z of dream.body_symbolism.zones) {
        const mapped = mapSymbolismZone(z)
        if (mapped) zones.add(mapped)
      }
    }

    const zoneArray = Array.from(zones)
    for (const zone of zoneArray) {
      const existing = zoneMap.get(zone)
      if (existing) {
        existing.count++
        existing.dreams.push({
          id: dream.id,
          title: dream.title,
          created_at: dream.created_at,
          body_symbolism: dream.body_symbolism,
          somatic_location: dream.somatic_location,
        })
      } else {
        zoneMap.set(zone, {
          zone,
          count: 1,
          dreams: [{
            id: dream.id,
            title: dream.title,
            created_at: dream.created_at,
            body_symbolism: dream.body_symbolism,
            somatic_location: dream.somatic_location,
          }],
        })
      }
    }
  }

  const correlations = Array.from(zoneMap.values())
    .sort((a, b) => b.count - a.count)

  // ─── Couche de synthèse Forêt (on-demand, dreambody) ───
  let synthesis: string | null = null
  if (wantSynthesis && correlations.length > 0) {
    try {
      const zonesSignal = correlations
        .slice(0, 6)
        .map((c) => `${c.zone} (${c.count}×)`)
        .join(', ')
      const forestContext = await queryForestForMode(
        supabase,
        `zones corporelles qui reviennent en rêve : ${zonesSignal}. dreambody, symptôme-signal, amplification somatique, canal corps.`,
        'body',
        8
      )
      const correlationsSummary = JSON.stringify(
        correlations.slice(0, 8).map((c) => ({
          zone: c.zone,
          count: c.count,
          dreams: c.dreams.slice(0, 3).map((d) => ({
            title: d.title,
            date: d.created_at,
            body_symbolism: d.body_symbolism,
            somatic: d.somatic_location,
          })),
        })),
        null,
        2
      )
      synthesis = await synthesizeBodyOracle(correlationsSummary, forestContext, locale)
    } catch (e) {
      console.error('[oracle-corps] synthesis failed (non-blocking):', e)
    }
  }

  return NextResponse.json({ correlations, synthesis })
}

/**
 * Map body_symbolism zone descriptions to canonical zones.
 * body_symbolism.zones can contain free-text like "genou gauche", "coeur", "dos".
 */
function mapSymbolismZone(zone: string): string | null {
  const z = zone.toLowerCase()
  if (z.includes('tête') || z.includes('head') || z.includes('crâne') || z.includes('front')) return 'head'
  if (z.includes('gorge') || z.includes('throat') || z.includes('cou') || z.includes('neck')) return 'throat'
  if (z.includes('poitrine') || z.includes('chest') || z.includes('coeur') || z.includes('cœur') || z.includes('heart') || z.includes('poumon')) return 'chest'
  if (z.includes('ventre') || z.includes('belly') || z.includes('estomac') || z.includes('intestin') || z.includes('plexus')) return 'belly'
  if (z.includes('main') || z.includes('hand') || z.includes('doigt') || z.includes('bras') || z.includes('épaule') || z.includes('arm')) return 'hands'
  if (z.includes('jambe') || z.includes('leg') || z.includes('pied') || z.includes('genou') || z.includes('cheville') || z.includes('hanche')) return 'legs'
  if (z.includes('dos') || z.includes('back') || z.includes('colonne') || z.includes('spine') || z.includes('lombaire')) return 'back'
  return 'other'
}
