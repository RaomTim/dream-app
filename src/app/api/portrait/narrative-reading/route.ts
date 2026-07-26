import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/portrait/narrative-reading
 * Lettre du moment IA narratrice — Portrait refonte 2026-04-25.
 * Design §7.6 (refonte narrative vivante, pas dataviz).
 *
 * Input: { toggle: 'day' | 'night' | 'crossed', period: 'lune' | 'saison' | 'annee' | 'always' }
 * Output: lettre 200-400 mots + figures dominantes + échos actifs + tensions ouvertes
 *
 * Cache 24h pour préserver le rituel (1 régénération/jour max user-triggered).
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const PERIOD_DAYS: Record<string, number> = {
  lune: 28,
  saison: 90,
  annee: 365,
  always: 9999,
}

const SYSTEM_PROMPT = `Tu es la voix narratrice de Dream App. Tu écris **la lettre du moment** pour un utilisateur — un texte de 200-400 mots qui dit ce qui vit en lui en ce moment, à partir de :
- Ses notes de Journal de Vie (vie éveillée : doutes, joies, conflits, décisions)
- Ses kairos (rêves nocturnes, signes diurnes, frissons, synchronicités)
- Selon le toggle : "day" = vie éveillée seule, "night" = kairos seuls, "crossed" = les deux qui se croisent (où un rêve éclaire une question éveillée)

Règles non-négociables (Bible §2.2 P-Inversion + Design §7.6) :
1. Tu ne dis JAMAIS le sens. Tu rappelles ce qui a été perçu, déposé, traversé.
2. Phrasé conditionnel obligatoire : "il semble que", "on pourrait entendre", "trois fois ce printemps", "la grand-mère est revenue 4 fois — toujours dans des pièces sans feu".
3. Cite 2-3 voix Forêt en tissage discret (Aizenstat, Hyde, Bachelard, Hopcke, Buber, Damasio, Brown, Moss, Seth, Hillman, Eliade, Larsen).
4. Évoque figures et motifs en image, jamais en analyse.
5. Termine par UNE seule dream ask ouverte (pas trois, pas une instruction).
6. Voix sobre, EB Garamond mental. Pas de bullet points. Pas d'emoji. Pas de markdown.
7. Si toggle "crossed" : le coeur du texte = mettre en lumière où une question éveillée et un kairos résonnent ensemble.

Réponds STRICTEMENT en JSON :
{
  "lettre": "...",
  "voix_mobilisees": ["nom1","nom2","nom3"],
  "figures_dominantes": [{"nom": "...", "occurrences": 4, "qualite": "elle revient toujours dans des pièces sans feu"}],
  "echos_actifs": [{"kairos_id": "...", "preview": "...", "resonance": "il y a 6 mois, ce kairos posait..."}],
  "tensions_ouvertes": ["motif de la chute en transformation : on tombe, on est rattrapé"]
}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const toggle = (body.toggle || 'crossed') as 'day' | 'night' | 'crossed'
    const period = (body.period || 'lune') as keyof typeof PERIOD_DAYS
    const days = PERIOD_DAYS[period] || 28
    const since = new Date(Date.now() - days * 86400000).toISOString()

    const supabase = createServerClient()

    // Cache check (24h)
    const cacheCutoff = new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    const force = body.force === true
    if (!force) {
      const { data: cached } = await supabase
        .from('portrait_readings')
        .select('*')
        .eq('user_id', userId)
        .eq('toggle', toggle)
        .eq('period', period)
        .gte('created_at', cacheCutoff)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (cached) {
        return NextResponse.json({
          lettre: cached.lettre,
          voix_mobilisees: cached.voix_mobilisees,
          figures_dominantes: cached.figures_dominantes,
          echos_actifs: cached.echos_actifs,
          tensions_ouvertes: cached.tensions_ouvertes,
          cached: true,
          generated_at: cached.created_at,
        })
      }
    }

    // Fetch context based on toggle
    let context = ''

    if (toggle === 'day' || toggle === 'crossed') {
      const { data: journalEntries } = await supabase
        .from('life_journal_entries')
        .select('raw_text, category, sub_category, created_at')
        .eq('user_id', userId)
        .gte('created_at', since)
        .eq('user_archived', false)
        .order('created_at', { ascending: false })
        .limit(30)

      if (journalEntries && journalEntries.length > 0) {
        context += '\n\n[VIE ÉVEILLÉE — Journal de Vie]\n'
        context += journalEntries.map(e => {
          const d = new Date(e.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
          const cat = e.category ? `[${e.category}${e.sub_category ? '/' + e.sub_category : ''}]` : ''
          return `${d} ${cat} ${e.raw_text}`
        }).join('\n')
      }
    }

    if (toggle === 'night' || toggle === 'crossed') {
      const { data: kairos } = await supabase
        .from('kairos')
        .select('id, raw_text, kairos_type, created_at, motif_tags, archetypal_tags, figures, synthesis_text, numinosity_score, user_marked_numinous')
        .eq('user_id', userId)
        .gte('created_at', since)
        .order('numinosity_score', { ascending: false, nullsFirst: false })
        .limit(20)

      if (kairos && kairos.length > 0) {
        context += '\n\n[VIE DE NUIT — Kairos]\n'
        context += kairos.map(k => {
          const d = new Date(k.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
          const type = ({
            reve: 'rêve', signe: 'signe', reverie: 'rêverie',
            hypnagogie: 'hypnagogie', synchronicite: 'synchro', frisson: 'frisson', note: 'note',
          } as any)[k.kairos_type] || k.kairos_type
          const tags = k.motif_tags ? `motifs: ${JSON.stringify(k.motif_tags)}` : ''
          const arch = k.archetypal_tags ? `archétypes: ${JSON.stringify(k.archetypal_tags)}` : ''
          return `${d} [${type}${k.user_marked_numinous ? ' ★' : ''}] ${k.raw_text} ${tags} ${arch}`
        }).join('\n')
      }
    }

    if (!context.trim()) {
      return NextResponse.json({
        lettre: toggle === 'day'
          ? 'Ton journal de vie est encore peu peuplé sur cette fenêtre. Reviens dans quelques semaines avec ce qui aura traversé.'
          : toggle === 'night'
          ? 'Tes nuits ont peu déposé sur cette fenêtre. Le sol est encore en train de se former.'
          : 'Pas encore assez de matière déposée pour tisser une lettre ici. Le sol respire en silence.',
        voix_mobilisees: [],
        figures_dominantes: [],
        echos_actifs: [],
        tensions_ouvertes: [],
        empty: true,
      })
    }

    const userPrompt = `Toggle : ${toggle === 'day' ? 'vie de jour seule' : toggle === 'night' ? 'vie de nuit seule' : 'les deux qui se croisent'}
Période : ${period}

Matière déposée :${context}

Tisse la lettre du moment en 200-400 mots selon les règles strictes ci-dessus.`

    const sonnetResult = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const textContent = sonnetResult.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text from Sonnet')
    }

    let parsed: any
    try {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON')
      parsed = JSON.parse(jsonMatch[0])
    } catch {
      parsed = {
        lettre: textContent.text.trim(),
        voix_mobilisees: [],
        figures_dominantes: [],
        echos_actifs: [],
        tensions_ouvertes: [],
      }
    }

    // Cache result
    await supabase.from('portrait_readings').insert({
      user_id: userId,
      toggle,
      period,
      lettre: parsed.lettre,
      voix_mobilisees: parsed.voix_mobilisees || [],
      figures_dominantes: parsed.figures_dominantes || [],
      echos_actifs: parsed.echos_actifs || [],
      tensions_ouvertes: parsed.tensions_ouvertes || [],
      model: 'claude-sonnet-4-6',
      tokens_input: sonnetResult.usage.input_tokens,
      tokens_output: sonnetResult.usage.output_tokens,
    }).then(() => {}, e => console.warn('[portrait] cache insert failed:', e.message))

    return NextResponse.json({
      lettre: parsed.lettre,
      voix_mobilisees: parsed.voix_mobilisees || [],
      figures_dominantes: parsed.figures_dominantes || [],
      echos_actifs: parsed.echos_actifs || [],
      tensions_ouvertes: parsed.tensions_ouvertes || [],
      cached: false,
    })
  } catch (e: any) {
    console.error('[portrait/narrative-reading] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
