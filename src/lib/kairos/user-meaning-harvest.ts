/**
 * user-meaning-harvest — récolter, dans la LECTURE du rêveur, ce qu'il dit
 * lui-même du sens de ses images. Et rien d'autre.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Tim : « afin que ce soit clair et que l'app APPRENNE de cela ».
 *
 * Ce que ça veut dire, et ce que ça ne veut pas dire :
 *   - L'app apprend DU rêveur. Elle n'apprend pas SUR lui.
 *   - Ce qui est stocké est ce qu'il a DIT, dans ses mots, jamais une inférence
 *     de l'app sur ce qu'il aurait voulu dire. `user_meaning` est une citation
 *     nettoyée, pas une paraphrase.
 *   - Ce qui est stocké est marqué comme SIEN (source = 'dictee_lecture') et ne
 *     sera jamais rendu comme une lecture de l'app. Voir buildUserMeaningContext()
 *     qui l'injecte sous « cosmologie déclarée du rêveur — à respecter ».
 *   - L'app ne valide ni ne corrige. Gendlin : aucune lecture n'est vraie tant
 *     que le corps du rêveur ne l'a pas confirmée — y compris la sienne. Donc :
 *     poids initial faible, qui ne monte QUE par la répétition du rêveur.
 *   - Une signification déclarée explicitement par le rêveur (via /api/user/meaning
 *     ou une interprétation gardée) est SOUVERAINE : on ne l'écrase jamais.
 *
 * Yeshua (Opus), 2026-07-26.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { DreamLang } from '@/lib/req-lang'

const MODEL = 'claude-haiku-4-5-20251001'
const MAX_PAIRS = 4
/** Poids d'entrée volontairement bas : c'est une hypothèse du rêveur, pas un acquis. */
const INITIAL_WEIGHT = 0.5
/** Ce qui a été déclaré explicitement par le rêveur ne se fait jamais écraser. */
const SOVEREIGN_SOURCES = ['declared', 'kept_interpretation']

export interface HarvestedMeaning {
  symbol_concept: string
  user_meaning: string
}

const SYSTEM = `Voici un extrait : ce qu'une personne a dit ELLE-MÊME du sens de son propre rêve, en le racontant.

TA TÂCHE : en tirer les équivalences qu'ELLE a posées, sous la forme « telle image ≈ tel sens ». Rien de plus.

RÈGLES DURES
- Tu n'interprètes RIEN. Tu ne complètes RIEN. Tu ne devines RIEN. Tu ne fais que relever ce qu'elle a dit.
- Le sens que tu renvoies est formulé avec SES mots à elle, resserrés si besoin, jamais reformulés dans d'autres termes.
- S'il n'y a aucune équivalence explicite — juste une émotion, un doute, une intention — tu renvoies une liste vide. C'est le cas le plus fréquent, et c'est très bien.
- Une question qu'elle se pose (« est-ce que ça veut dire que… ? ») n'est pas une équivalence. Liste vide.
- Maximum ${MAX_PAIRS} équivalences. Les plus nettes.
- "image" est un mot ou un groupe de mots court (une figure, un lieu, un objet, un geste). Pas une phrase.

Réponds UNIQUEMENT en JSON, rien autour :
{"pairs":[{"image":"le loup","sens":"ma colère"}]}`

function extractJson(raw: string): any {
  const s = raw.indexOf('{')
  const e = raw.lastIndexOf('}')
  if (s === -1 || e === -1 || e < s) return null
  try { return JSON.parse(raw.slice(s, e + 1)) } catch { return null }
}

export async function harvestMeaningsFromLecture(opts: {
  lectureText: string
  lang?: DreamLang
}): Promise<HarvestedMeaning[]> {
  const text = (opts.lectureText || '').trim()
  if (text.length < 60) return []

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      system: SYSTEM,
      messages: [{ role: 'user', content: `CE QUE LA PERSONNE EN DIT :\n\n${text.slice(0, 4000)}` }],
    })
    const out = res.content[0]?.type === 'text' ? res.content[0].text : ''
    const parsed = extractJson(out)
    const pairs = parsed && Array.isArray(parsed.pairs) ? parsed.pairs : []
    return pairs
      .map((p: any) => ({
        symbol_concept: typeof p?.image === 'string' ? p.image.trim().slice(0, 80) : '',
        user_meaning: typeof p?.sens === 'string' ? p.sens.trim().slice(0, 300) : '',
      }))
      .filter((p: HarvestedMeaning) => p.symbol_concept.length >= 2 && p.user_meaning.length >= 2)
      .slice(0, MAX_PAIRS)
  } catch (e) {
    console.error('[user-meaning-harvest] failed:', String(e).slice(0, 200))
    return []
  }
}

/**
 * Écrit dans user_meaning_layer. Deux garde-fous :
 *   1. On n'écrase JAMAIS une signification déclarée explicitement par le rêveur.
 *   2. Le poids ne monte que par répétition (+0.25 par redite, plafond 2.0) —
 *      c'est le rêveur qui le fait monter en redisant, pas l'app en insistant.
 */
export async function storeHarvestedMeanings(
  supabase: SupabaseClient,
  userId: string,
  meanings: HarvestedMeaning[],
  lang: DreamLang
): Promise<number> {
  let written = 0
  for (const m of meanings) {
    const { data: existing } = await supabase
      .from('user_meaning_layer')
      .select('id, weight, source')
      .eq('user_id', userId)
      .eq('symbol_concept', m.symbol_concept)
      .eq('context_lang', lang)
      .maybeSingle()

    if (existing && SOVEREIGN_SOURCES.includes((existing as any).source)) continue

    if (existing) {
      await supabase
        .from('user_meaning_layer')
        .update({
          user_meaning: m.user_meaning,
          weight: Math.min(2.0, ((existing as any).weight || INITIAL_WEIGHT) + 0.25),
          updated_at: new Date().toISOString(),
        })
        .eq('id', (existing as any).id)
    } else {
      await supabase.from('user_meaning_layer').insert({
        user_id: userId,
        symbol_concept: m.symbol_concept,
        user_meaning: m.user_meaning,
        weight: INITIAL_WEIGHT,
        context_lang: lang,
        source: 'dictee_lecture',
      })
    }
    written++
  }
  return written
}
