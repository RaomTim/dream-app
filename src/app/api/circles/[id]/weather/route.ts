/**
 * /api/circles/[id]/weather — Météo psychique du cercle (C.6)
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (vue agrégée du cercle)
 *
 * Vue agrégée des 30 derniers jours sur kairos_circle_optin (anonymisé) :
 *   - Valences moyennes / écart-type
 *   - Top 5 motifs / top 5 root_dream_patterns / top 5 figures
 *   - Comptage somatic markers (zones les plus présentes)
 *   - Comptage "eau" / "feu" / "seuil" / "figure du père/mère/enfant" via heuristique
 *
 * → texte poétique court généré par Haiku (économe), 80-180 mots, sobre, conditionnel.
 *
 * Endpoints :
 *   GET  → renvoie la dernière météo cachée (≤ 24h) ou indique stale
 *   POST → force "tisser la météo" (régénère)
 *
 * Privacy :
 *   - K-anonymity 5+ contributeurs uniques sur la fenêtre, sinon refus.
 *   - Aucun nom au modèle, jamais. Texte généré sans identité.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const HAIKU_MODEL = 'claude-haiku-4-5' // économe pour cette feature
const WINDOW_DAYS = 30
const K_THRESHOLD = 5
const CACHE_HOURS = 24

const SYSTEM_PROMPT = `Tu écris la "météo psychique" d'un cercle de rêveurs ce mois-ci, en 80-180 mots SOBRES.

POSTURE NON-NÉGOCIABLE :
- Pas de bullet points. Pas de headers. Pas de markdown. Pas d'emoji.
- Pas de noms, pas de pronoms personnels qui désignent (jamais "vous", "tu" ; uniquement "le cercle" ou phrases impersonnelles).
- P-Inversion : tu décris ce qui circule, tu ne conclus jamais.
- Vocabulaire désensorcelé INFUSE : pas de "vibrations", "énergie", "alignement", "magie". Préfère "ce qui revient", "ce qui circule", "ce qui pèse", "ce qui s'allège".
- Ton poétique mais sec, comme une note météo : factuel, court, atmosphérique.
- Phrasé conditionnel sur les interprétations.

EXEMPLES de tonalité visée :
- "Le cercle a porté beaucoup de rêves d'eau ce mois-ci. Trois traversées de seuil. Deux figures du père. Une saison de retrait collectif."
- "Quelque chose autour du feu revient. Le ventre aussi, présent dans plusieurs dépôts. Les figures sont rares ce mois-ci, comme si la matière passait en arrière-plan."

NE JAMAIS :
- Diagnostiquer une "période X" ou "phase Y".
- Affirmer que le cercle "ressent" ou "vit" quelque chose en commun.
- Conclure ou prescrire.
- Parler en "je".

Réponds STRICTEMENT en JSON :
{
  "weather": "texte 80-180 mots sobre"
}`

async function isMember(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

type Metrics = {
  contributors: number
  deposit_count: number
  avg_valence: number | null
  intense_count: number
  positive_count: number
  negative_count: number
  top_motifs: { motif: string; count: number }[]
  top_root_patterns: { pattern: string; count: number }[]
  top_figures: { name: string; count: number }[]
  top_zones: { zone: string; count: number }[]
  water_count: number
  fire_count: number
  threshold_count: number
  father_count: number
  mother_count: number
  child_count: number
  shadow_count: number
}

const WATER_RE = /\b(eau|mer|rivière|lac|océan|pluie|fleuve|noyade|bain|inondation)\b/i
const FIRE_RE = /\b(feu|brûler|flamme|incendie|brasier|cendres|fumée)\b/i
const THRESHOLD_RE = /\b(seuil|porte|passage|frontière|traversée|pont|tunnel|sortir|entrer)\b/i
const FATHER_RE = /\b(père|paternel|patriarche|grand-père)\b/i
const MOTHER_RE = /\b(mère|maternel|matrice|grand-mère)\b/i
const CHILD_RE = /\b(enfant|bébé|nourrisson|fillette|garçonnet|petit·e)\b/i
const SHADOW_RE = /\b(ombre|nuit|noir|obscur|inconnu|étranger)\b/i

function aggregateMetrics(rows: any[]): Metrics {
  const contributors = new Set<string>()
  let depositCount = 0
  let valenceSum = 0
  let valenceCount = 0
  let intense = 0
  let positive = 0
  let negative = 0
  const motifs = new Map<string, number>()
  const roots = new Map<string, number>()
  const figures = new Map<string, number>()
  const zones = new Map<string, number>()
  let water = 0,
    fire = 0,
    threshold = 0,
    father = 0,
    mother = 0,
    child = 0,
    shadow = 0

  for (const k of rows) {
    contributors.add(String(k.user_id))
    depositCount++

    if (typeof k.affective_valence === 'number') {
      valenceSum += k.affective_valence
      valenceCount++
      if (k.affective_valence > 0.4) positive++
      if (k.affective_valence < -0.4) negative++
    }
    if (typeof k.affective_intensity === 'number' && k.affective_intensity > 0.7) intense++

    for (const t of k.motif_tags || []) {
      if (typeof t === 'string') motifs.set(t, (motifs.get(t) || 0) + 1)
    }
    for (const r of k.root_dream_patterns || []) {
      if (typeof r === 'string') roots.set(r, (roots.get(r) || 0) + 1)
    }
    if (Array.isArray(k.figures)) {
      for (const f of k.figures) {
        const name = typeof f === 'string' ? f : f?.name || f?.label
        if (typeof name === 'string') figures.set(name, (figures.get(name) || 0) + 1)
      }
    }
    if (k.somatic_markers && typeof k.somatic_markers === 'object') {
      const sm = k.somatic_markers as any
      const list: any[] = Array.isArray(sm) ? sm : Array.isArray(sm.markers) ? sm.markers : []
      for (const m of list) {
        const z = typeof m === 'string' ? m : m?.zone
        if (typeof z === 'string') zones.set(z, (zones.get(z) || 0) + 1)
      }
    }

    const blob = `${k.raw_text || ''} ${(k.motif_tags || []).join(' ')} ${(k.root_dream_patterns || []).join(' ')}`
    if (WATER_RE.test(blob)) water++
    if (FIRE_RE.test(blob)) fire++
    if (THRESHOLD_RE.test(blob)) threshold++
    if (FATHER_RE.test(blob)) father++
    if (MOTHER_RE.test(blob)) mother++
    if (CHILD_RE.test(blob)) child++
    if (SHADOW_RE.test(blob)) shadow++
  }

  function topN(m: Map<string, number>, n: number, key: string): any[] {
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([k, c]) => ({ [key]: k, count: c }))
  }

  return {
    contributors: contributors.size,
    deposit_count: depositCount,
    avg_valence: valenceCount > 0 ? valenceSum / valenceCount : null,
    intense_count: intense,
    positive_count: positive,
    negative_count: negative,
    top_motifs: topN(motifs, 5, 'motif') as any,
    top_root_patterns: topN(roots, 5, 'pattern') as any,
    top_figures: topN(figures, 5, 'name') as any,
    top_zones: topN(zones, 5, 'zone') as any,
    water_count: water,
    fire_count: fire,
    threshold_count: threshold,
    father_count: father,
    mother_count: mother,
    child_count: child,
    shadow_count: shadow,
  }
}

async function loadAggregateRows(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string
) {
  const since = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString()

  const { data: optins } = await supabase
    .from('kairos_circle_optin')
    .select('kairos_id, user_id')
    .eq('circle_id', circleId)
    .gte('opted_at', since)
    .limit(1000)

  if (!optins || optins.length === 0) return []

  const ids = Array.from(new Set(optins.map((o: any) => o.kairos_id)))
  const { data: kairos } = await supabase
    .from('kairos')
    .select(
      'id, user_id, raw_text, motif_tags, figures, root_dream_patterns, somatic_markers, affective_valence, affective_intensity'
    )
    .in('id', ids)

  return kairos || []
}

// ════════════════════════════════════════════════════════════════════
// GET — dernière météo cachée
// ════════════════════════════════════════════════════════════════════
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { data } = await supabase
      .from('circle_weather')
      .select('id, generated_at, window_days, metrics, weather_text, k_anon_ok')
      .eq('circle_id', params.id)
      .order('generated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data) {
      return NextResponse.json({ weather: null, stale: true })
    }

    const ageMs = Date.now() - new Date((data as any).generated_at).getTime()
    const stale = ageMs > CACHE_HOURS * 3600 * 1000

    return NextResponse.json({ weather: data, stale })
  } catch (e: any) {
    console.warn('[circle/weather GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

// ════════════════════════════════════════════════════════════════════
// POST — "tisser la météo" (régénère, K-anonymity required)
// ════════════════════════════════════════════════════════════════════
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const rows = await loadAggregateRows(supabase, params.id)
    const metrics = aggregateMetrics(rows)

    if (metrics.contributors < K_THRESHOLD) {
      return NextResponse.json({
        weather: null,
        k_anonymity_failed: true,
        contributor_count: metrics.contributors,
        threshold: K_THRESHOLD,
        message: `Pas encore assez de voix sur ${WINDOW_DAYS}j (${metrics.contributors}/${K_THRESHOLD}) pour tisser la météo sans risquer de nommer quelqu'un.`,
      })
    }

    if (metrics.deposit_count === 0) {
      return NextResponse.json({
        weather: null,
        empty: true,
        message: 'Aucun dépôt sur la fenêtre.',
      })
    }

    // Build a compact metrics summary for the model
    const summary = {
      fenêtre_jours: WINDOW_DAYS,
      contributeurs_uniques: metrics.contributors,
      dépôts_total: metrics.deposit_count,
      valence_moyenne: metrics.avg_valence?.toFixed(2),
      dépôts_intenses: metrics.intense_count,
      dépôts_lourds: metrics.negative_count,
      dépôts_lumineux: metrics.positive_count,
      motifs_dominants: metrics.top_motifs.map((m: any) => `${m.motif} (×${m.count})`).join(', '),
      patterns_dominants: metrics.top_root_patterns.map((p: any) => `${p.pattern} (×${p.count})`).join(', '),
      figures_dominantes: metrics.top_figures.map((f: any) => `${f.name} (×${f.count})`).join(', '),
      zones_corps_présentes: metrics.top_zones.map((z: any) => `${z.zone} (×${z.count})`).join(', '),
      éléments_archétypaux: {
        eau: metrics.water_count,
        feu: metrics.fire_count,
        seuil_traversée: metrics.threshold_count,
        figure_père: metrics.father_count,
        figure_mère: metrics.mother_count,
        figure_enfant: metrics.child_count,
        ombre_inconnu: metrics.shadow_count,
      },
    }

    const userPrompt = `Voici les métriques agrégées (anonymisées) du cercle sur ${WINDOW_DAYS} jours :

${JSON.stringify(summary, null, 2)}

Tisse la météo sobre du cercle selon les règles strictes ci-dessus.`

    const result = await anthropic.messages.create({
      model: HAIKU_MODEL,
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = result.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text from model')
    }

    let parsed: { weather: string }
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      // Fallback : prendre le texte brut
      parsed = { weather: textContent.text.trim() }
    }

    if (!parsed.weather) throw new Error('weather vide')

    // Persist
    const { data: inserted } = await supabase
      .from('circle_weather')
      .insert({
        circle_id: params.id,
        window_days: WINDOW_DAYS,
        metrics,
        weather_text: parsed.weather,
        k_anon_ok: true,
      })
      .select('id, generated_at, weather_text, metrics')
      .single()

    return NextResponse.json({
      weather: inserted || {
        weather_text: parsed.weather,
        metrics,
        generated_at: new Date().toISOString(),
      },
      stale: false,
    })
  } catch (e: any) {
    console.warn('[circle/weather POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
