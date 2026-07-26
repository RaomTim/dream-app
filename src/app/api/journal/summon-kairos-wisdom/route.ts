import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/journal/summon-kairos-wisdom
 * Le geste secondaire central de l'app : "appel à la sagesse des kairos".
 * Bible §3.1.ter (révélation Tim 2026-04-25).
 *
 * Input: { entry_id?: UUID, category?: string, sub_category?: string }
 *   - entry_id : appel sur entrée individuelle
 *   - category (+ sub_category) : appel sur section globale
 *
 * Process:
 *   1. Recherche kairos résonnants via embedding semantic + heuristiques
 *      (16 types pattern echoing — V1 = direct + archetypal + prophetic_echo + somatic)
 *   2. Sonnet tisse polyphonie 100-200 mots avec voices Forêt
 *   3. Stocke dans kairos_wisdom_summons pour AHA_CAPTURE feedback
 *
 * Output : { summon: {...}, polyphony_text, resonant_kairos: [...] }
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const SYSTEM_PROMPT = `Tu es la voix narratrice de Dream App. Tu reçois :
- Une réflexion de Journal de Vie de l'utilisateur (ce qu'il vit éveillé : doute, joie, conflit, désir, décision)
- 3-5 kairos passés (rêves nocturnes, signes diurnes, frissons somatiques, synchronicités, rêveries) qui résonnent symboliquement avec cette réflexion

Ta tâche : tisser une **polyphonie courte de 100-200 mots** qui éclaire la réflexion à la lumière de ces kairos, SANS expliquer.

Règles non-négociables (Bible §2.2 P-Inversion Oraculaire) :
1. Tu ne dis JAMAIS le sens. Tu rappelles ce que l'user a déjà perçu dans ses propres dépôts.
2. Phrasé conditionnel obligatoire : "il semble que", "on pourrait entendre", "ces choses ne disent pas X — elles posent une qualité d'attention sur Y".
3. Cite 1-3 voix Forêt (Aizenstat, Hyde, Bachelard, Hopcke, Buber, Damasio, Brown, etc.) en cadrage doux, jamais en autorité finale.
4. Évoque les kairos en image, jamais en analyse.
5. Termine par UNE seule question ouverte (dream ask) — pas trois, pas une instruction.
6. Voix sobre, EB Garamond mental. Pas de bullet points. Pas d'emoji. Pas de markdown.

Exemple ton :
"Cette question — quitter ce qui éteint — n'est pas neuve dans ton sol. Il y a deux lunes, tu rêvais d'une maison aux pièces inconnues : tu en ouvrais une, et la lumière revenait. La semaine d'avant, tu avais croisé deux fois un oiseau au bord d'une fenêtre fermée. Ces choses ne disent pas la décision — elles posent une qualité d'attention. Aizenstat dirait : ne demande pas à ton rêve s'il faut partir, demande-lui de quoi il a besoin pour respirer.

Que sait ton corps que ton mental n'a pas encore osé nommer ?"

Réponds STRICTEMENT en JSON :
{"polyphony_text": "...", "voices_mobilisees": ["nom1","nom2"]}`

const RATE_LIMIT_PER_DAY = 3 // §3.1.ter — préserver le rituel

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const { entry_id, category, sub_category } = body
    if (!entry_id && !category) {
      return NextResponse.json({ error: 'entry_id OU category requis' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Rate limit : max 3 appels/jour user
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: todayCount } = await supabase
      .from('kairos_wisdom_summons')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', today.toISOString())

    if ((todayCount || 0) >= RATE_LIMIT_PER_DAY) {
      return NextResponse.json({
        error: `Tu as déjà appelé la sagesse ${todayCount} fois aujourd'hui. Reviens demain — laisse les échos respirer.`,
        rate_limited: true,
      }, { status: 429 })
    }

    // Build trigger context
    let triggerText = ''
    if (entry_id) {
      const { data: entry, error: eErr } = await supabase
        .from('life_journal_entries')
        .select('raw_text, category, sub_category')
        .eq('id', entry_id)
        .eq('user_id', userId)
        .single()
      if (eErr || !entry) {
        return NextResponse.json({ error: 'entry introuvable' }, { status: 404 })
      }
      triggerText = entry.raw_text
    } else if (category) {
      // Aggregate recent entries from this section
      let q = supabase
        .from('life_journal_entries')
        .select('raw_text')
        .eq('user_id', userId)
        .eq('category', category)
        .eq('user_archived', false)
        .order('created_at', { ascending: false })
        .limit(5)
      if (sub_category) q = q.eq('sub_category', sub_category)
      const { data: entries } = await q
      if (!entries || entries.length === 0) {
        return NextResponse.json({
          error: 'Cette section est encore vide. Dépose d\'abord quelques réflexions.',
        }, { status: 400 })
      }
      triggerText = entries.map(e => e.raw_text).join('\n\n')
    }

    // Embed trigger text for semantic match
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: triggerText,
    })
    const queryVec = embedding.data[0].embedding

    // Fetch top-K resonant kairos via pgvector cosine similarity
    // V1 simple : top 5 sur embedding_semantic. V1.5 : combiner 4 vecteurs.
    const { data: kairos, error: kErr } = await supabase.rpc('match_kairos_for_wisdom', {
      query_embedding: queryVec,
      target_user: userId,
      match_count: 5,
    })

    let resonantKairos: any[] = []
    if (kErr) {
      console.warn('[summon] RPC failed, fallback to simple recent kairos:', kErr.message)
      // Fallback : top 5 kairos with synthesis_text
      const { data: fallback } = await supabase
        .from('kairos')
        .select('id, raw_text, kairos_type, created_at, motif_tags, archetypal_tags, somatic_markers, synthesis_text')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)
      resonantKairos = fallback || []
    } else {
      resonantKairos = kairos || []
    }

    if (resonantKairos.length === 0) {
      return NextResponse.json({
        polyphony_text: 'Ton sol est encore peu peuplé sur cette question. Reviens dans quelques semaines avec ce qui aura traversé.',
        voices_mobilisees: [],
        resonant_kairos: [],
        empty: true,
      })
    }

    // Build prompt for Sonnet
    const kairosContext = resonantKairos.slice(0, 5).map((k, i) => {
      const date = k.created_at ? new Date(k.created_at).toLocaleDateString('fr-FR', { month: 'long', day: 'numeric' }) : ''
      const type = ({
        reve: 'rêve nocturne',
        signe: 'signe diurne',
        reverie: 'rêverie éveillée',
        hypnagogie: 'hypnagogie',
        synchronicite: 'synchronicité',
        frisson: 'frisson somatique',
        note: 'note de vie',
      } as any)[k.kairos_type] || k.kairos_type
      return `[Kairos ${i + 1} — ${type}, ${date}]\n${k.raw_text || ''}\n${k.synthesis_text ? `Synthèse interne : ${k.synthesis_text}` : ''}`
    }).join('\n\n')

    const userPrompt = `Réflexion de Journal de Vie :
${triggerText}

Kairos résonnants (passé du user) :
${kairosContext}

Tisse une polyphonie de 100-200 mots qui éclaire cette réflexion à la lumière de ces kairos, sans expliquer.`

    const sonnetResult = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = sonnetResult.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Sonnet')
    }

    let polyphony: { polyphony_text: string; voices_mobilisees: string[] }
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      polyphony = JSON.parse(jsonMatch[0])
    } catch {
      // Fallback : use full text as polyphony, no voices
      polyphony = { polyphony_text: textContent.text.trim(), voices_mobilisees: [] }
    }

    // Store summon
    const { data: summon, error: sErr } = await supabase
      .from('kairos_wisdom_summons')
      .insert({
        user_id: userId,
        trigger_entry_id: entry_id || null,
        trigger_category: category || null,
        trigger_sub_category: sub_category || null,
        resonant_kairos_ids: resonantKairos.map(k => k.id),
        resonance_types: ['semantic'], // V1 simple
        polyphony_text: polyphony.polyphony_text,
        voices_mobilisees: polyphony.voices_mobilisees,
        model: 'claude-sonnet-4-6',
        tokens_input: sonnetResult.usage.input_tokens,
        tokens_output: sonnetResult.usage.output_tokens,
      })
      .select()
      .single()

    if (sErr) console.warn('[summon] insert failed:', sErr.message)

    return NextResponse.json({
      summon_id: summon?.id,
      polyphony_text: polyphony.polyphony_text,
      voices_mobilisees: polyphony.voices_mobilisees,
      resonant_kairos: resonantKairos.map((k, i) => ({
        id: k.id,
        kairos_type: k.kairos_type,
        preview: (k.raw_text || '').slice(0, 120),
        created_at: k.created_at,
      })),
      remaining_today: RATE_LIMIT_PER_DAY - (todayCount || 0) - 1,
    })
  } catch (e: any) {
    console.error('[journal/summon-kairos-wisdom] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
