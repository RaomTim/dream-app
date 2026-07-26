/**
 * /api/circles/[id]/portrait/generate — Lettre Portrait Cercle (mensuel)
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (onglet Portrait Cercle)
 *        3_TECHNICAL.md §39.6 (réutilise circle_intentions.ai_synthesis_monthly
 *                              comme stockage MVP, voir note rapport pour table dédiée)
 *
 * POST  → génère lettre cercle ~300-500 mots tissant motifs collectifs du mois
 *
 * Garde-fous :
 *   - Cache mensuel (30j) sauf force=true
 *   - K-anonymity strict : 5+ contributeurs uniques requis sur la fenêtre
 *   - Anonymisation absolue : aucun nom, pseudo, ID exposé au modèle
 *   - P-Inversion : propose des angles, ne conclut jamais
 *   - Trauma-safe + vocabulaire désensorcelé INFUSE
 *
 * Architecture stockage MVP :
 *   On stocke dans une intention "système" du cercle (proposed_by_user_id NULL,
 *   intention_text='__portrait_mensuel__', ai_synthesis_monthly=la lettre, created_at=now()).
 *   Permet de réutiliser la table sans migration — sera promu en circle_portraits
 *   à terme (voir rapport).
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const OPUS_MODEL = 'claude-opus-4-6'
const PORTRAIT_MARKER = '__portrait_mensuel__'
const K_ANONYMITY_THRESHOLD = 5
const CACHE_DAYS = 30

const SYSTEM_PROMPT = `Tu écris la **lettre cercle du mois** — un texte narratif de 300 à 500 mots qui tisse les motifs collectifs traversés par un cercle ce mois-ci, à partir de dépôts agrégés et anonymisés.

POSTURE NON-NÉGOCIABLE :
1. P-Inversion stricte : tu PROPOSES des angles, des résonances possibles. Tu ne CONCLUS jamais.
2. Anonymat absolu : tu ne nommes JAMAIS un membre, jamais un dépôt isolé. Tu parles toujours du cercle comme entité.
3. Phrasé conditionnel obligatoire : "il semble que", "on pourrait entendre", "quelque chose dans le cercle revient vers...".
4. Vocabulaire désensorcelé INFUSE : pas de "chemin", "voyage intérieur", "vibrations", "énergies", "alignement", "magie", "transformation". Préfère : "ce qui circule", "ce qui revient", "ce qui se tient", "ce qui bouge", "ce qui a été déposé".
5. Trauma-safe : pas de prescription, pas d'interprétation arrêtée d'un motif difficile. Tu nommes ce qui passe sans figer.
6. Voix sobre, EB Garamond mental. Pas de bullet points. Pas d'emoji. Pas de markdown.
7. Termine par une seule question ouverte au cercle (pas trois, pas une instruction).

NE JAMAIS :
- Diagnostiquer, médicaliser, psychologiser un membre.
- Affirmer un sens partagé ("le cercle traverse une période X").
- Citer un livre nommément.
- Promettre un résultat collectif.
- Utiliser "vous" ou "on" englobants qui présument une expérience commune.

Réponds STRICTEMENT en JSON :
{
  "lettre": "...",
  "motifs_evoques": ["motif1", "motif2", "motif3"]
}`

type Body = {
  force?: boolean
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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json().catch(() => ({}))) as Body
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const circleId = params.id

    // 1️⃣ Membership check
    if (!(await isMember(supabase, circleId, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    // 2️⃣ Cache check (30j) sauf force=true
    const force = body.force === true
    const cacheCutoff = new Date(Date.now() - CACHE_DAYS * 86400000).toISOString()

    if (!force) {
      const { data: cached } = await supabase
        .from('circle_intentions')
        .select('id, ai_synthesis_monthly, created_at')
        .eq('circle_id', circleId)
        .eq('intention_text', PORTRAIT_MARKER)
        .gte('created_at', cacheCutoff)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cached?.ai_synthesis_monthly) {
        return NextResponse.json({
          lettre: cached.ai_synthesis_monthly,
          cached: true,
          generated_at: cached.created_at,
        })
      }
    }

    // 3️⃣ Récupère dépôts du dernier mois + count contributeurs uniques
    const since = new Date(Date.now() - CACHE_DAYS * 86400000).toISOString()
    const { data: shares, error: sharesErr } = await supabase
      .from('circle_shares')
      .select('user_id, content, share_type, created_at')
      .eq('circle_id', circleId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(200)

    if (sharesErr) {
      console.warn('[circle/portrait/generate] shares fetch failed:', sharesErr.message)
      return NextResponse.json({ error: 'fetch shares failed' }, { status: 500 })
    }

    const uniqueAuthors = new Set((shares || []).map((s) => s.user_id).filter(Boolean))
    const contributorCount = uniqueAuthors.size

    // 4️⃣ K-anonymity strict
    if (contributorCount < K_ANONYMITY_THRESHOLD) {
      return NextResponse.json(
        {
          lettre: null,
          k_anonymity_failed: true,
          contributor_count: contributorCount,
          threshold: K_ANONYMITY_THRESHOLD,
          message:
            "Le cercle n'a pas encore tissé assez de voix ce mois-ci pour qu'un portrait puisse émerger sans risquer de nommer quelqu'un. Reviens quand d'autres auront déposé.",
        },
        { status: 200 }
      )
    }

    // 5️⃣ Aggrège anonymement les dépôts pour le prompt
    //    → on retire user_id, on tronque, on mélange pour éviter ordre temporel exposant un membre
    const anonContents = (shares || [])
      .filter((s) => s.content && s.content.trim().length > 0)
      .map((s) => ({
        type: s.share_type || 'depot',
        text: (s.content || '').slice(0, 500).replace(/\s+/g, ' ').trim(),
      }))
      .sort(() => Math.random() - 0.5) // shuffle léger
      .slice(0, 40) // cap volume input

    if (anonContents.length === 0) {
      return NextResponse.json(
        {
          lettre: null,
          empty: true,
          message: 'Aucun dépôt textuel sur la fenêtre — rien à tisser pour le moment.',
        },
        { status: 200 }
      )
    }

    const corpus = anonContents
      .map((c, i) => `[dépôt ${i + 1}, ${c.type}] ${c.text}`)
      .join('\n\n')

    const userPrompt = `Cercle : ${contributorCount} contributeurs uniques sur les ${CACHE_DAYS} derniers jours, ${anonContents.length} dépôts agrégés et anonymisés ci-dessous.

Corpus anonymisé du cercle ce mois-ci :
${corpus}

Tisse la lettre cercle du mois en 300-500 mots selon les règles strictes ci-dessus.`

    // 6️⃣ Call Opus
    const result = await anthropic.messages.create({
      model: OPUS_MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = result.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text from Opus')
    }

    let parsed: { lettre: string; motifs_evoques?: string[] }
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      // Fallback : garder le texte brut comme lettre
      parsed = { lettre: textContent.text.trim(), motifs_evoques: [] }
    }

    if (!parsed.lettre) {
      throw new Error('lettre vide après parsing')
    }

    // 7️⃣ Persist (réutilise circle_intentions, marker spécial)
    await supabase
      .from('circle_intentions')
      .insert({
        circle_id: circleId,
        proposed_by_user_id: null,
        intention_text: PORTRAIT_MARKER,
        active_until: null,
        votes_count: 0,
        ai_synthesis_monthly: parsed.lettre,
      })
      .then(undefined, (e) =>
        console.warn('[circle/portrait/generate] persist failed:', e?.message)
      )

    return NextResponse.json({
      lettre: parsed.lettre,
      motifs_evoques: parsed.motifs_evoques || [],
      contributor_count: contributorCount,
      cached: false,
      generated_at: new Date().toISOString(),
    })
  } catch (e: any) {
    console.error('[circle/portrait/generate] error:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
