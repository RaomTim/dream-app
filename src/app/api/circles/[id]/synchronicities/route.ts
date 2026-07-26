/**
 * /api/circles/[id]/synchronicities — Synchronicités collectives (C.5)
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (motifs collectifs émergents) + §3.5 résonance 16 types
 *
 * Détecte les motifs (tags / figures / root_dream_patterns) qui circulent chez
 * ≥3 contributeurs uniques du cercle dans une fenêtre de 7 jours, sur la base des
 * kairos partagés AU CERCLE (kairos_circle_optin = anonymisé pour patterns).
 *
 * Endpoints :
 *   GET  /api/circles/[id]/synchronicities                → renvoie la liste détectée
 *   POST /api/circles/[id]/synchronicities { motif }      → demande une lecture polyphonique
 *                                                          de la synchronicité (3 voix forêt cadrées)
 *
 * Privacy :
 *   - Anonymisation par défaut (glyphs α β γ).
 *   - Un nom (display_name ou pseudonym) n'apparaît QUE si le user a fait
 *     `shared_clear` sur AU MOINS UN kairos contenant le motif (kairos_circle_shared
 *     present pour ce kairos_id) → confirmé via join.
 *   - Pas de motif < 3 contributeurs uniques (k=3 explicite).
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const SONNET_MODEL = 'claude-sonnet-4-6'
const WINDOW_DAYS = 7
const K_THRESHOLD = 3

type CrossKairosRow = {
  id?: string
  kairos_id?: string
  user_id: string
  motif_tags: string[] | null
  figures: any
  root_dream_patterns: string[] | null
}

type SyncMotif = {
  motif: string
  kind: 'motif_tag' | 'figure' | 'root_pattern'
  contributors: number
  contributor_glyphs: string[]
  contributor_names: string[] | null
  kairos_count: number
  sample_kairos_ids: string[]
}

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

function glyphFor(idx: number): string {
  const g = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ']
  return g[idx % g.length]
}

function normalizeMotif(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ')
}

async function detectSynchronicities(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string
): Promise<SyncMotif[]> {
  const since = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString()

  // 1. Récupère tous les opt-in du cercle sur la fenêtre
  const { data: optins, error: optinErr } = await supabase
    .from('kairos_circle_optin')
    .select('kairos_id, user_id, opted_at')
    .eq('circle_id', circleId)
    .gte('opted_at', since)
    .limit(500)

  if (optinErr || !optins || optins.length === 0) return []

  const kairosIds = Array.from(new Set(optins.map((o) => o.kairos_id)))
  if (kairosIds.length === 0) return []

  // 2. Récupère les kairos avec leurs motifs / figures / root patterns
  const { data: kairosRows, error: krErr } = await supabase
    .from('kairos')
    .select('id, user_id, motif_tags, figures, root_dream_patterns')
    .in('id', kairosIds)

  if (krErr || !kairosRows) return []

  // 3. Récupère les kairos partagés clear (pour mapping pseudonym)
  const { data: sharedRows } = await supabase
    .from('kairos_circle_shared')
    .select('kairos_id, user_id, pseudonym')
    .eq('circle_id', circleId)
    .in('kairos_id', kairosIds)

  const sharedByUser = new Map<string, { pseudonym: string | null }>()
  for (const r of sharedRows || []) {
    sharedByUser.set((r as any).user_id, { pseudonym: (r as any).pseudonym })
  }

  // 4. Récupère display_name fallback dans circle_members (user_id stocké en TEXT)
  const userIdsText = Array.from(new Set(kairosRows.map((k) => String(k.user_id))))
  const { data: members } = await supabase
    .from('circle_members')
    .select('user_id, display_name, pseudonym')
    .eq('circle_id', circleId)
    .in('user_id', userIdsText)
    .is('left_at', null)

  const memberByUser = new Map<string, { display_name: string | null; pseudonym: string | null }>()
  for (const m of members || []) {
    memberByUser.set(String((m as any).user_id), {
      display_name: (m as any).display_name,
      pseudonym: (m as any).pseudonym,
    })
  }

  // 5. Aggrège les motifs cross-membres
  type Bucket = { kind: 'motif_tag' | 'figure' | 'root_pattern'; users: Set<string>; kairos: Set<string> }
  const buckets = new Map<string, Bucket>()

  function add(kind: 'motif_tag' | 'figure' | 'root_pattern', value: string, userId: string, kairosId: string) {
    const key = `${kind}::${normalizeMotif(value)}`
    let b = buckets.get(key)
    if (!b) {
      b = { kind, users: new Set(), kairos: new Set() }
      buckets.set(key, b)
    }
    b.users.add(userId)
    b.kairos.add(kairosId)
  }

  for (const k of (kairosRows as unknown as CrossKairosRow[])) {
    const userId = String(k.user_id)
    const kairosId = String(k.kairos_id ?? k.id ?? '')

    for (const m of k.motif_tags || []) {
      if (typeof m === 'string' && m.trim()) add('motif_tag', m, userId, kairosId)
    }
    for (const r of k.root_dream_patterns || []) {
      if (typeof r === 'string' && r.trim()) add('root_pattern', r, userId, kairosId)
    }
    // figures peut être array de strings OU array d'objets {name, ...}
    if (Array.isArray(k.figures)) {
      for (const f of k.figures) {
        const name = typeof f === 'string' ? f : f?.name || f?.label
        if (typeof name === 'string' && name.trim()) add('figure', name, userId, kairosId)
      }
    } else if (k.figures && typeof k.figures === 'object') {
      for (const v of Object.values(k.figures)) {
        if (Array.isArray(v)) {
          for (const item of v) {
            const name = typeof item === 'string' ? item : (item as any)?.name || (item as any)?.label
            if (typeof name === 'string' && name.trim()) add('figure', name, userId, kairosId)
          }
        }
      }
    }
  }

  // 6. Filter k≥3 contributeurs uniques + format
  const result: SyncMotif[] = []
  let glyphIdx = 0
  const userGlyphs = new Map<string, string>()
  function glyphForUser(userId: string): string {
    let g = userGlyphs.get(userId)
    if (!g) {
      g = glyphFor(glyphIdx++)
      userGlyphs.set(userId, g)
    }
    return g
  }

  const bucketEntries: Array<[string, Bucket]> = []
  buckets.forEach((b, key) => bucketEntries.push([key, b]))

  for (const entry of bucketEntries) {
    const key = entry[0]
    const b = entry[1]
    if (b.users.size < K_THRESHOLD) continue
    const kind = key.split('::')[0] as 'motif_tag' | 'figure' | 'root_pattern'
    const motif = key.slice(kind.length + 2)

    // Pour chaque contributor : si ≥1 de ses kairos sur ce motif est shared_clear,
    // on peut révéler son nom. Sinon glyph.
    const contributorNames: string[] = []
    const contributorGlyphs: string[] = []
    let allRevealed = true

    const userList: string[] = []
    b.users.forEach((u) => userList.push(u))
    for (const userId of userList) {
      const sharedInfo = sharedByUser.get(userId)
      const memberInfo = memberByUser.get(userId)
      const revealName =
        (sharedInfo?.pseudonym ||
          memberInfo?.pseudonym ||
          memberInfo?.display_name) &&
        !!sharedByUser.get(userId)
      if (revealName) {
        const name =
          (sharedByUser.get(userId)?.pseudonym ||
            memberInfo?.pseudonym ||
            memberInfo?.display_name) ?? null
        if (name) contributorNames.push(name)
        else allRevealed = false
      } else {
        allRevealed = false
      }
      contributorGlyphs.push(glyphForUser(userId))
    }

    const kairosArr: string[] = []
    b.kairos.forEach((k) => kairosArr.push(k))

    result.push({
      motif,
      kind,
      contributors: b.users.size,
      contributor_glyphs: contributorGlyphs,
      contributor_names: allRevealed ? contributorNames : null,
      kairos_count: b.kairos.size,
      sample_kairos_ids: kairosArr.slice(0, 5),
    })
  }

  // 7. Sort by contributor count desc, then kairos count desc
  result.sort((a, b) => b.contributors - a.contributors || b.kairos_count - a.kairos_count)

  // Cap to top 12
  return result.slice(0, 12)
}

// ════════════════════════════════════════════════════════════════════
// GET — détection live (pas de cache, fenêtre 7j)
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

    const synchronicities = await detectSynchronicities(supabase, params.id)
    return NextResponse.json({
      synchronicities,
      window_days: WINDOW_DAYS,
      threshold: K_THRESHOLD,
    })
  } catch (e: any) {
    console.warn('[circle/synchronicities GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

// ════════════════════════════════════════════════════════════════════
// POST — lecture polyphonique d'une synchronicité (3 voix cadrées)
// ════════════════════════════════════════════════════════════════════
const POLY_SYSTEM = `Tu produis une lecture polyphonique COURTE (3 voix distinctes) sur un motif qui traverse plusieurs membres d'un cercle de rêveurs cette semaine.

POSTURE NON-NÉGOCIABLE :
- Tu ne nommes JAMAIS un membre. Tu parles du motif comme entité.
- P-Inversion : tu PROPOSES des angles, tu ne CONCLUS jamais.
- Trauma-safe + vocabulaire désensorcelé INFUSE.
- Pas de citations d'auteur nommées. Pas d'emoji. Pas de markdown.
- Phrasé conditionnel : "il semble que", "ce motif pourrait porter", "certain·es entendraient".

Trois voix DISTINCTES, chacune ~50-80 mots :
- "paper"  : voix psychologique des profondeurs (figures intérieures, compensation, dynamiques)
- "stone"  : voix somatique / ancrée (corps, lieu, incarnation, présence physique du motif)
- "silk"   : voix onirique poétique (image, rêve, mystère, ce qui n'a pas de mots)

Réponds STRICTEMENT en JSON :
{
  "paper": "...",
  "stone": "...",
  "silk":  "...",
  "closing_question": "..."
}

closing_question = UNE question ouverte qui invite le cercle à répondre, pas une instruction.`

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const motif = typeof body.motif === 'string' ? body.motif.trim() : ''
    const kind = typeof body.kind === 'string' ? body.kind : 'motif_tag'
    if (!motif) return NextResponse.json({ error: 'motif requis' }, { status: 400 })

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    // Re-confirme que ce motif existe bien dans le cercle (anti-hallucination prompt user)
    const all = await detectSynchronicities(supabase, params.id)
    const found = all.find((s) => normalizeMotif(s.motif) === normalizeMotif(motif))
    if (!found) {
      return NextResponse.json(
        { error: 'motif non détecté dans le cercle (sous le seuil k=3 ou hors fenêtre 7j)' },
        { status: 404 }
      )
    }

    const userPrompt = `Le motif « ${motif} » (catégorie ${kind}) traverse ${found.contributors} membres du cercle au moins ${found.kairos_count} fois ces ${WINDOW_DAYS} derniers jours.

Tisse les trois voix selon les règles strictes ci-dessus.`

    const result = await anthropic.messages.create({
      model: SONNET_MODEL,
      max_tokens: 1500,
      system: POLY_SYSTEM,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = result.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text from model')
    }

    let parsed: { paper: string; stone: string; silk: string; closing_question?: string }
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json(
        { error: 'parsing JSON 3 voix échoué', raw: textContent.text.slice(0, 600) },
        { status: 502 }
      )
    }

    return NextResponse.json({
      motif,
      kind,
      contributors: found.contributors,
      kairos_count: found.kairos_count,
      voices: {
        paper: parsed.paper || '',
        stone: parsed.stone || '',
        silk: parsed.silk || '',
      },
      closing_question: parsed.closing_question || '',
    })
  } catch (e: any) {
    console.warn('[circle/synchronicities POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
