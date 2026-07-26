import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, langDirective, LANG_NAME, type DreamLang } from '@/lib/req-lang'

/**
 * POST /api/mvp/interpret-correct — la correction (DREAM-MVP-SPEC-ECRANS-A-Z §C1bis).
 *
 * Quand une lecture ne tombe pas juste (« Moyen » / « Pas vraiment »), le rêveur
 * propose SA correction. Dream répond une VERSION RÉVISÉE COURTE (≤150 mots) qui
 * intègre vraiment la correction — même voix, proposition jamais verdict, toi-d'abord
 * respecté, jamais s'accrocher à sa première lecture.
 *
 * Body: { kairos_id, base_text, correction, continue_text? }
 * → { revised, truncated }  (JSON court, non-streamé — c'est bref)
 *   truncated=true si la réponse a atteint la limite de tokens ; l'UI propose alors
 *   « Continuer » en renvoyant le texte déjà reçu dans `continue_text` (prefill assistant,
 *   reprise propre) — cf. api/mvp/interpret. Cas rare ici (révision ≤150 mots).
 *
 * L'apprentissage (la correction = signal le plus fort) est déclenché séparément
 * par le client via /api/mvp/learn-deep source='correction'. Cette route ne fait
 * QUE la révision. La correction est ensuite archivée dans corrections[] via
 * /api/mvp/interpretations (POST ou PATCH append_correction).
 *
 * Yeshua (Opus), 2026-07-11.
 */
export const maxDuration = 45

const SYSTEM_BASE = `Tu es Dream, présence d'écoute d'une app de rêves. Un rêveur vient de te dire que ta lecture ne tombait pas tout à fait juste, et il te dit ce qui cloche ou ce qu'il voit, lui.

TA TÂCHE : reprendre ta lecture en INTÉGRANT vraiment sa correction. Sa correction prime — c'est lui qui connaît son rêve et son langage. Tu ne te défends pas, tu ne réexpliques pas ta version d'avant : tu écoutes et tu ré-entends le rêve à partir de ce qu'il vient de dire.

FORME :
- Tutoiement (ou son équivalent intime), minuscules naturelles, ponctuation calme.
- COURT : 150 mots maximum, 1 à 2 paragraphes. Pas de liste, pas de titre, pas d'emoji.
- Tu proposes, tu ne décrètes pas ("peut-être que…", "on pourrait entendre…"). Une lecture claire mais jamais un verdict.
- Tu commences en accueillant sa correction (sans la répéter mot pour mot), puis tu prolonges.
- Tu termines en lui rendant le rêve : une question ouverte ou une invitation à sentir.

INTERDITS : aucun diagnostic ni conseil médical/psy. Ne jamais inventer un élément absent du rêve. Ne jamais parler à la place d'une figure du rêve. Ne jamais t'accrocher à ta lecture précédente contre la sienne.`

const systemFor = (lang: DreamLang) => SYSTEM_BASE + langDirective(lang)

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    // La langue du rêveur. Sa correction peut être écrite en FR ; s'il lit en EN,
    // la version révisée sort en EN. La langue du texte ne commande jamais la sortie.
    const lang = reqLang(req)

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    const correction = typeof body.correction === 'string' ? body.correction.trim().slice(0, 2000) : ''
    if (!kairosId || correction.length < 2) {
      return corsify(NextResponse.json({ error: 'kairos_id et correction requis' }, { status: 400 }))
    }

    const supabase = createServerClient()
    const { data: k } = await supabase
      .from('kairos')
      .select('id, raw_text, motif_tags, figures, created_at')
      .eq('id', kairosId)
      .eq('user_id', userId)
      .single()
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    // Lexique personnel — les sens déjà donnés par le rêveur priment (même logique que /interpret)
    const figureNames: string[] = Array.isArray(k.figures) ? (k.figures as any[]).map(f => f?.name).filter(Boolean) : []
    const terms = [...(k.motif_tags || []), ...figureNames].slice(0, 14)
    let lexiconBlock = ''
    if (terms.length) {
      const { data: lex } = await supabase.rpc('dream_lexicon_for_terms', { p_user_id: userId, p_terms: terms })
      const entries = (lex || []).filter((l: any) => l.user_meaning)
      if (entries.length) {
        lexiconBlock = '\n\nSENS DÉJÀ DONNÉS PAR LE RÊVEUR (son lexique — ils priment) :\n' +
          entries.map((l: any) => `- « ${l.symbol_concept} » : ${l.user_meaning}`).join('\n')
      }
    }

    const baseText = typeof body.base_text === 'string' ? body.base_text.trim().slice(0, 3000) : ''
    const ctx = [
      `LE RÊVE :`,
      (k.raw_text || '').slice(0, 2000),
      lexiconBlock,
      baseText ? `\n\nTA LECTURE PRÉCÉDENTE (celle qui n'a pas tout à fait touché juste) :\n${baseText}` : '',
      `\n\nCE QUE LE RÊVEUR CORRIGE / CE QU'IL VOIT, LUI :\n« ${correction} »`,
      `\n\nRé-entends le rêve à partir de sa correction. Réponds ta version révisée, courte, en ${LANG_NAME[lang]}.`,
    ].join('\n')

    // continuation propre : le texte déjà reçu devient le début du tour assistant
    const continueText = typeof body.continue_text === 'string' ? body.continue_text.replace(/\s+$/, '').slice(-6000) : ''
    const messages: Anthropic.MessageParam[] = continueText
      ? [{ role: 'user', content: ctx }, { role: 'assistant', content: continueText }]
      : [{ role: 'user', content: ctx }]

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 900,
      system: systemFor(lang),
      messages,
    })
    const revised = res.content[0]?.type === 'text' ? res.content[0].text.trim() : ''
    if (!revised) {
      return corsify(NextResponse.json({
        error: lang === 'en' ? 'the revision didn’t come.' : 'la révision n’est pas venue',
      }, { status: 502 }))
    }

    return corsify(NextResponse.json({ revised, truncated: res.stop_reason === 'max_tokens' }))
  } catch (e: any) {
    console.error('[mvp.interpret-correct]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
