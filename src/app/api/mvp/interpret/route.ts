import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, langDirective, langDirectiveShort, LANG_NAME, type DreamLang } from '@/lib/req-lang'

/**
 * POST /api/mvp/interpret — l'interprétation Dream, user-first (SSE stream).
 *
 * Body: { kairos_id, user_reading?: string, mode?: 'interpret' | 'name', continue_text?: string }
 *  - mode 'interpret' (défaut) : stream l'interprétation Dream
 *  - mode 'name' : propose 3 noms pour le rêve (réponse JSON courte, non streamée)
 *
 * Filet « lecture coupée » (§12ter.B) : quand la génération atteint max_tokens, le stream
 * émet une frame `data: {"stop_reason":"max_tokens"}` juste avant `[DONE]`. L'UI propose alors
 * « Continuer ». La continuation renvoie le texte déjà reçu dans `continue_text` : on le pose
 * comme début du tour assistant (prefill), le modèle REPREND proprement là où il s'est arrêté —
 * ce n'est pas une re-génération, seulement la suite est streamée (l'UI la concatène).
 *
 * Posture (1_BIBLE §2.2 réconcilié 2026-05-23) : le rêveur lit TOUJOURS en premier.
 * Si user_reading est fournie, Dream dialogue avec elle — jamais par-dessus.
 * Le lexique personnel (dream_lexicon_for_terms) conditionne le prompt :
 * les sens du user priment sur tout symbolisme générique.
 *
 * Yeshua, 2026-06-10 (Vague 1 MVP). TODO V1.1 : retrieval Forêt ciblé (chunks).
 */
export const maxDuration = 60

const SYSTEM_BASE = `Tu es Dream, présence d'écoute d'une app de rêves. Tu accompagnes un rêveur.

TA POSTURE (non négociable) :
- Tu tends le rêve, tu ne le disséques pas. Les images du rêve sont vivantes — tu ne les figes jamais en un sens unique et fermé.
- Tu PEUX interpréter, avec nuance et profondeur — c'est ce qu'on attend de toi. Mais tu proposes, tu ne décrètes pas. Pas de "ton rêve signifie X". Plutôt : "on pourrait entendre…", "quelque chose semble…", "peut-être que…" — sans excès de précaution non plus : une lecture claire, incarnée, qui ose dire quelque chose.
- Si le rêveur a donné SA lecture, tu commences par elle : tu la reçois vraiment, tu la prolonges, tu la creuses. Ta lecture vient en second regard, en dialogue — jamais en correction.
- LE LEXIQUE PERSONNEL PRIME : si le rêveur a déjà donné un sens à une image (fourni dans le contexte), ce sens-là est le point de départ. Le symbolisme général ne vient qu'en complément.
- Tu termines toujours en rendant le rêve au rêveur : une question ouverte ou une invitation à sentir, jamais une conclusion fermée.

TA FORME :
- Tutoiement (ou son équivalent intime dans ta langue de sortie). Minuscules naturelles, ponctuation calme.
- 2 à 4 paragraphes courts. Pas de listes, pas de titres, pas d'emoji, pas de jargon (ni "inconscient" clinique, ni "archétype" sauf si le rêveur l'emploie).
- Concret, sensoriel, chaleureux. Jamais de flatterie, jamais de mysticisme vendeur.

INTERDITS ABSOLUS :
- Aucun diagnostic, aucun conseil médical ou psychologique.
- Ne jamais inventer un élément absent du rêve.
- Ne jamais parler à la place d'une figure du rêve ("je suis l'eau et je te dis…" : interdit).`

const systemFor = (lang: DreamLang) => SYSTEM_BASE + langDirective(lang)

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    // La langue du rêveur (header posé par les 2 clients HTTP). Défaut : fr.
    const lang = reqLang(req)

    if (!body.kairos_id) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { data: k, error: kErr } = await supabase
      .from('kairos')
      .select('id, raw_text, motif_tags, figures, dominant_emotion, affective_valence, created_at, kairos_type')
      .eq('id', body.kairos_id)
      .eq('user_id', userId)
      .single()
    if (kErr || !k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    // Lexique personnel : les sens déjà donnés par le rêveur
    const figureNames: string[] = Array.isArray(k.figures)
      ? (k.figures as any[]).map(f => f?.name).filter(Boolean)
      : []
    const terms = [...(k.motif_tags || []), ...figureNames].slice(0, 14)
    let lexiconBlock = ''
    if (terms.length) {
      const { data: lex } = await supabase.rpc('dream_lexicon_for_terms', {
        p_user_id: userId,
        p_terms: terms,
      })
      const entries = (lex || []).filter((l: any) => l.user_meaning)
      if (entries.length) {
        lexiconBlock =
          '\n\nSENS DÉJÀ DONNÉS PAR LE RÊVEUR (son lexique — ils priment) :\n' +
          entries.map((l: any) => `- « ${l.symbol_concept} » : ${l.user_meaning}`).join('\n')
      }
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

    // ── mode 'name' : 3 propositions de nom, JSON court ──
    if (body.mode === 'name') {
      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: `Tu nommes des rêves. Réponds UNIQUEMENT un JSON: {"names":["…","…","…"]}. 3 noms courts (2-5 mots), poétiques mais sobres, en minuscules, tirés des images du rêve. Pas de guillemets dans les noms.${langDirectiveShort(lang)}`,
        messages: [{ role: 'user', content: `Le rêve :\n${(k.raw_text || '').slice(0, 1500)}` }],
      })
      const txt = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
      try {
        const parsed = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1))
        return corsify(NextResponse.json({ names: (parsed.names || []).slice(0, 3) }))
      } catch {
        return corsify(NextResponse.json({ names: [] }))
      }
    }

    // ── mode 'honor' : 3 petites actions réelles qui prolongent le rêve (d'après Moss) ──
    // (le mot « honorer » est banni à l'écran §0.1 — la copy dit « un geste concret »)
    if (body.mode === 'honor') {
      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 280,
        system: `Tu proposes de petites actions réelles qui prolongent un rêve dans la journée (d'après Robert Moss : un acte concret, minuscule, tiré d'une image du rêve). Réponds UNIQUEMENT un JSON: {"gestures":["…","…","…"]}. 3 actions simples, concrètes, faisables aujourd'hui, minuscules, 5-14 mots chacune, tirées des images DU rêve. Pas de méditation générique. N'emploie jamais les mots « honorer », « rituel », « protocole ».${langDirectiveShort(lang)}`,
        messages: [{ role: 'user', content: `Le rêve :\n${(k.raw_text || '').slice(0, 1500)}` }],
      })
      const txt = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
      try {
        const parsed = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1))
        return corsify(NextResponse.json({ gestures: (parsed.gestures || []).slice(0, 3) }))
      } catch {
        return corsify(NextResponse.json({ gestures: [] }))
      }
    }

    // ── mode 'interpret' : stream SSE ──
    const userReading = typeof body.user_reading === 'string' ? body.user_reading.trim().slice(0, 2000) : ''
    const deeper = body.depth === 'deeper'
    // Continuation propre (§12ter.B) : le texte déjà streamé, renvoyé pour reprendre la lecture.
    const continueText = typeof body.continue_text === 'string' ? body.continue_text.replace(/\s+$/, '').slice(-8000) : ''

    // ── « à la lumière du présent » (§12bis.B) : relire ce rêve à travers ce que le rêveur vit MAINTENANT.
    // Cap 3/jour PARTAGÉ avec l'appel à la sagesse : les deux comptent la même table kairos_wisdom_summons
    // (une ligne-repère 'present_context_read' y est déposée à chaque relecture réussie). Message doux au-delà.
    // Une continuation ne re-consomme PAS le budget partagé (elle prolonge la même lecture).
    const presentContext = (body.present_context === true || body.present_context === 'true') && !continueText
    let presentBlock = ''
    if (presentContext) {
      const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0)
      const { count } = await supabase
        .from('kairos_wisdom_summons')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', dayStart.toISOString())
      if ((count || 0) >= 3) {
        return corsify(NextResponse.json({
          error: lang === 'en'
            ? 'come back tomorrow — the night may have added something.'
            : 'Reviens demain — la nuit aura peut-être ajouté quelque chose.',
          rate_limited: true,
        }, { status: 429 }))
      }
      // ce que le rêveur traverse en ce moment : ses 5-8 dernières notes de JOUR (hors ce kairos)
      const { data: recentNotes } = await supabase
        .from('kairos')
        .select('raw_text')
        .eq('user_id', userId)
        .eq('kairos_type', 'note_jour')
        .neq('id', body.kairos_id)
        .order('created_at', { ascending: false })
        .limit(8)
      const lines = (recentNotes || [])
        .map((n: any) => (n.raw_text || '').replace(/\s+/g, ' ').trim().slice(0, 260))
        .filter((s: string) => s.length > 0)
      if (lines.length) {
        presentBlock =
          `\n\nCE QUE LE RÊVEUR TRAVERSE EN CE MOMENT (ce qu'il a noté ces derniers jours — relis le rêve à CETTE lumière, sans forcer le lien ; s'il n'y a pas d'écho, ne l'invente pas) :\n` +
          lines.map((l: string) => `- ${l}`).join('\n')
      }
    }

    const ctx = [
      `LE RÊVE (écrit le ${new Date(k.created_at).toLocaleDateString(lang === 'en' ? 'en-GB' : 'fr-FR')}) :`,
      k.raw_text,
      k.dominant_emotion ? `\nÉmotion dominante perçue : ${k.dominant_emotion}` : '',
      terms.length ? `Images présentes : ${terms.join(', ')}` : '',
      lexiconBlock,
      userReading
        ? `\n\nLA LECTURE DU RÊVEUR (donnée en premier — commence par elle, dialogue avec elle) :\n« ${userReading} »`
        : `\n\nLe rêveur n'a pas souhaité donner sa lecture ("dis-moi ce que tu vois"). Offre la tienne — claire, nuancée, vivante — puis rends-lui le rêve.`,
      presentBlock,
      deeper
        ? `\n\nLE RÊVEUR A DEMANDÉ D'ALLER PLUS LOIN. Une première lecture lui a déjà été offerte — ne la répète pas, descends d'un cran. Touche : ce que ce rêve demande de lui, ce qui s'y rejoue depuis longtemps, ce que le corps y sait avant la pensée, ce qui cherche à être vécu à travers lui. Plus incarné, plus risqué — sans jamais figer ni décréter. Tu rends toujours le rêve au rêveur à la fin.`
        : '',
    ].join('\n')

    // Continuation propre (§12ter.B) : le texte déjà streamé (continueText, calculé plus haut)
    // devient le début du tour assistant → le modèle reprend la suite, sans répéter.
    // L'espace final est déjà coupé (l'API refuse un prefill assistant terminé par un blanc).
    const userMsg = `${ctx}\n\n(Rappel : tu réponds en ${LANG_NAME[lang]}.)`
    const messages: Anthropic.MessageParam[] = continueText
      ? [{ role: 'user', content: userMsg }, { role: 'assistant', content: continueText }]
      : [{ role: 'user', content: userMsg }]

    const stream = await anthropic.messages.create({
      model: deeper ? 'claude-opus-4-6' : 'claude-sonnet-4-6',
      max_tokens: deeper ? 2048 : 1024,
      system: systemFor(lang),
      messages,
      stream: true,
    })

    // present_context réussi → ligne-repère qui compte contre le budget partagé (best-effort, non bloquant)
    if (presentContext) {
      try {
        await supabase.from('kairos_wisdom_summons').insert({ user_id: userId, trigger_category: 'present_context_read', polyphony_text: '' })
      } catch (e: any) {
        console.warn('[mvp.interpret] present_context ledger insert failed (non-blocking):', e?.message)
      }
    }

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        let stopReason: string | null = null
        try {
          for await (const ev of stream) {
            if (ev.type === 'content_block_delta' && (ev.delta as any).type === 'text_delta') {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ t: (ev.delta as any).text })}\n\n`))
            } else if (ev.type === 'message_delta' && (ev as any).delta?.stop_reason) {
              stopReason = (ev as any).delta.stop_reason
            }
          }
          // lecture coupée par la limite de tokens → l'UI proposera « Continuer »
          if (stopReason === 'max_tokens') {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ stop_reason: 'max_tokens' })}\n\n`))
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (e: any) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: e.message })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return corsify(new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    }))
  } catch (e: any) {
    console.error('[mvp.interpret]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
