import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/dream-signs-suggest
 *
 * Suggère 3 dream signs personnels (max) à partir des kairos récents.
 * Sonnet extrait les anomalies récurrentes des 30 derniers kairos rêve nocturne.
 *
 * Body : {} (rien — lit kairos user)
 *
 * Returns :
 *   {
 *     suggestions: [
 *       { label, category, occurrence_count, sample_kairos_ids[] },
 *       ...
 *     ],
 *     existing_count: number
 *   }
 *
 * Source = 'ia_suggested'. Le user doit confirmer pour passer à 'ia_promoted'.
 *
 * Cohérent 3_LUCID_TECHNICAL §3.2 + 1_LUCID_BIBLE §3.1 (Marcus persona — dream signs perso, pas génériques).
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SUGGEST_SYSTEM = `Tu es un analyste onirique formé par la Forêt INFUSE (332 livres digérés). Tu connais LaBerge (4 catégories de dream signs : Inner Awareness, Action, Form, Context), Tholey, Moss, Aizenstat.

Tu reçois jusqu'à 30 textes de rêves récents d'une même personne. Tu dois identifier les ÉLÉMENTS RÉCURRENTS qui pourraient devenir des "dream signs" personnels — des anomalies, motifs, sensations qui REVIENNENT et qui, une fois reconnus, peuvent déclencher la lucidité.

CRITÈRES :
- Récurrent (apparaît ≥ 2 fois dans le batch)
- Spécifique (pas "une personne" — mais "un homme en costume", pas "une maison" mais "une maison aux pièces inconnues")
- Actionnable (le user peut le repérer en se l'appropriant)

POSTURE :
- Pas de jargon technique mis en avant ("LaBerge dit que…")
- Pas d'invention : si tu n'as pas vu de récurrence claire, retourne []
- Pas plus de 3 suggestions
- Catégorie = inner_awareness | action | form | context (LaBerge 4 cat)

Réponds en JSON STRICT :
{
  "suggestions": [
    {
      "label": "<2-5 mots minuscules en français>",
      "category": "<inner_awareness | action | form | context>",
      "occurrence_count": <int>,
      "rationale": "<1 phrase courte — pourquoi cette récurrence>"
    }
  ]
}

Si rien ne ressort clairement, retourne { "suggestions": [] }. Pas de bullshit.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // Fetch recent kairos rêve nocturne (30 max, last 90d)
    const since = new Date(Date.now() - 90 * 86400000).toISOString()
    const { data: kairos } = await supabase
      .from('kairos')
      .select('id, raw_text, created_at')
      .eq('user_id', userId)
      .eq('kairos_type', 'reve')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(30)

    if (!kairos || kairos.length < 3) {
      return NextResponse.json({
        suggestions: [],
        existing_count: 0,
        reason: 'pas assez de rêves récents (≥3 nécessaire)',
      })
    }

    // Existing dream signs (pour éviter doublons)
    const { data: existingSigns } = await supabase
      .from('lucid_dream_signs')
      .select('sign_label')
      .eq('user_id', userId)
      .eq('active', true)

    const existingLabels = new Set(
      (existingSigns || []).map((s: any) => String(s.sign_label).toLowerCase().trim())
    )

    // Compose prompt input — concat 30 rêves (truncate raw_text)
    const concat = kairos
      .map((k: any, i: number) => {
        const txt = (k.raw_text || '').slice(0, 600)
        return `[K${i + 1}] (${k.created_at?.slice(0, 10)})\n${txt}`
      })
      .join('\n\n---\n\n')

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      system: SUGGEST_SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Voici ${kairos.length} rêves récents de la même personne. Identifie max 3 dream signs personnels récurrents.\n\n${concat}`,
        },
      ],
    })

    const txt = completion.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim()

    let parsed: any = { suggestions: [] }
    try {
      const jsonMatch = txt.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : txt)
    } catch {
      console.warn('[lucid.suggest] JSON parse failed', txt.slice(0, 200))
      return NextResponse.json({ suggestions: [], parse_error: true })
    }

    const VALID_CAT = ['inner_awareness', 'action', 'form', 'context']
    const filtered = (parsed?.suggestions || [])
      .filter((s: any) => s && typeof s.label === 'string')
      .map((s: any) => ({
        label: String(s.label).toLowerCase().trim(),
        category: VALID_CAT.includes(s.category) ? s.category : 'context',
        occurrence_count: Number.isFinite(s.occurrence_count) ? Math.max(2, Math.min(20, Math.round(s.occurrence_count))) : 2,
        rationale: String(s.rationale || '').slice(0, 200),
      }))
      .filter((s: any) => s.label.length >= 2 && !existingLabels.has(s.label))
      .slice(0, 3)

    // Insert as ia_suggested (not yet promoted)
    const inserted: any[] = []
    for (const s of filtered) {
      const { data, error } = await supabase
        .from('lucid_dream_signs')
        .insert({
          user_id: userId,
          sign_label: s.label,
          sign_category: s.category,
          source: 'ia_suggested',
          detection_source: 'nlp_auto',
          occurrences_count: s.occurrence_count,
          user_validated: false,
          active: true,
        })
        .select('*')
        .single()

      if (!error && data) inserted.push({ ...data, rationale: s.rationale })
    }

    return NextResponse.json({
      suggestions: inserted,
      existing_count: existingLabels.size,
      analyzed_kairos_count: kairos.length,
    })
  } catch (e: any) {
    console.error('[lucid.dream-signs-suggest.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
