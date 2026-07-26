import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * POST /api/mvp/learn-deep — l'apprentissage en profondeur (DREAM-MVP-SPEC-ECRANS-A-Z §C1bis).
 *
 * Chaque garde / correction / note de résonance N'EST PAS un simple like : elle
 * enseigne le langage symbolique personnel du rêveur. On extrait légèrement les
 * symboles nommés dans SON texte (Haiku), on les rattache à ce qui est déjà ancré
 * (son dictionnaire personnel + les images du rêve), et on upsert user_meaning_layer
 * avec une source distincte et un poids différencié :
 *
 *   correction        → 0.85   (le rêveur ENSEIGNE son langage : signal le plus fort)
 *   resonance_note    → 0.75   (ses propres mots sur ce qui résonne)
 *   kept_interpretation → 0.6   (il endorse la lecture de Dream : provisoire, overridable)
 *
 * Intégrité (triptyque vérité) : on n'INVENTE jamais un sens. Haiku n'extrait que ce
 * qui est explicitement dit dans le texte du rêveur. Pour kept_interpretation (texte =
 * la lecture de Dream, pas celle du rêveur), on reste bas en poids ET on ne garde que
 * les symboles déjà ancrés — c'est un sens ENDOSSÉ, jamais fabriqué, toujours dominé
 * par les sens directs (user_direct) et les corrections.
 *
 * Body: { kairos_id, text, source: 'kept_interpretation' | 'correction' | 'resonance_note' }
 * → { learned: n, source }   (best-effort — jamais bloquant pour l'UX)
 *
 * Réutilise les conventions de user_meaning_layer (cf. /api/mvp/meaning) :
 * unique (user_id, symbol_concept, context_lang), weight ∈ [0,5], upsert weight-aware.
 *
 * Yeshua (Opus), 2026-07-11.
 */
export const maxDuration = 30

const SOURCE_WEIGHT: Record<string, number> = {
  correction: 0.85,
  resonance_note: 0.75,
  kept_interpretation: 0.6,
}

const norm = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    // ── source 'link_feedback' : le 1-clic « résonne / pas vraiment » sur un lien de « CE QUI RÉSONNE »
    // (contrat de body distinct : pas de texte du rêveur, mais link_kairos_id + verdict). §12bis.A. ──
    if (body.source === 'link_feedback') {
      return handleLinkFeedback(body, userId)
    }

    const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
    const text = typeof body.text === 'string' ? body.text.trim().slice(0, 3000) : ''
    const source = ['kept_interpretation', 'correction', 'resonance_note'].includes(body.source) ? body.source : null
    if (!kairosId || text.length < 4 || !source) {
      return corsify(NextResponse.json({ error: 'kairos_id, text et source valides requis' }, { status: 400 }))
    }
    const weight = SOURCE_WEIGHT[source]

    const supabase = createServerClient()

    // Ownership + images du rêve
    const { data: k } = await supabase
      .from('kairos')
      .select('id, motif_tags, figures')
      .eq('id', kairosId)
      .eq('user_id', userId)
      .single()
    if (!k) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    // Termes ancrés : dictionnaire personnel ∪ images du rêve (motifs + figures)
    const figureNames: string[] = Array.isArray(k.figures) ? (k.figures as any[]).map(f => f?.name).filter(Boolean) : []
    const { data: dict } = await supabase
      .from('personal_dictionary_symbols')
      .select('symbol_text')
      .eq('user_id', userId)
      .is('archived_at', null)
      .order('last_seen_at', { ascending: false })
      .limit(300)
    const dictTerms = (dict || []).map((d: any) => d.symbol_text).filter(Boolean)
    const groundedRaw: string[] = Array.from(new Set([...(k.motif_tags || []), ...figureNames, ...dictTerms].filter(Boolean)))
    // map normalisé → forme canonique (on préfère la forme du dictionnaire/rêve)
    const canon = new Map<string, string>()
    for (const t of groundedRaw) { const n = norm(t); if (n && !canon.has(n)) canon.set(n, t) }

    // Extraction légère (Haiku) : { symbol, meaning } que le rêveur donne dans SON texte
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const groundedHint = groundedRaw.slice(0, 40).join(', ')
    const extractSystem = `Tu extrais, d'un court texte écrit par un rêveur à propos de SON rêve, les symboles auxquels il donne un sens personnel.

Réponds UNIQUEMENT un JSON strict : {"pairs":[{"symbol":"…","meaning":"…"}]}.
- "symbol" = une image/un mot du rêve (ex: eau, maison, ma sœur, la route). De préférence pris dans cette liste d'images déjà connues du rêveur : ${groundedHint || '(aucune)'}. Tu peux en ajouter un hors liste s'il est clairement nommé dans le texte.
- "meaning" = ce que CE texte dit que ce symbole signifie ou évoque POUR LUI. Court (≤ 120 caractères), fidèle à ses mots, jamais inventé.
- N'invente RIEN. Si le texte ne donne de sens à aucun symbole, renvoie {"pairs":[]}. Maximum 6 paires.
- Minuscules. Pas de guillemets à l'intérieur des valeurs.
- LANGUE : ne traduis JAMAIS. "symbol" et "meaning" restent DANS LA LANGUE DU TEXTE — ce sont les mots du rêveur, c'est son lexique personnel qu'on construit. Traduire fracturerait son lexique (« eau » et « water » deviendraient deux entrées étrangères l'une à l'autre). Cette route est la seule exception à la règle « on sort dans la langue du rêveur » : ici, on ne sort rien, on lui rend ses propres mots.`

    let pairs: { symbol: string; meaning: string }[] = []
    try {
      const res = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 380,
        system: extractSystem,
        messages: [{ role: 'user', content: text }],
      })
      const raw = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
      const parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1))
      pairs = Array.isArray(parsed.pairs) ? parsed.pairs : []
    } catch (e: any) {
      console.warn('[mvp.learn-deep] extraction failed (non-blocking):', e?.message)
      pairs = []
    }

    // Filtrage + canonicalisation
    const clean: { symbol: string; meaning: string }[] = []
    const seen = new Set<string>()
    for (const p of pairs) {
      const sym = typeof p?.symbol === 'string' ? p.symbol.trim().slice(0, 120) : ''
      const mean = typeof p?.meaning === 'string' ? p.meaning.trim().slice(0, 300) : ''
      if (!sym || mean.length < 2) continue
      const n = norm(sym)
      if (!n || seen.has(n)) continue
      // kept_interpretation (texte = lecture de Dream) : uniquement des symboles DÉJÀ ancrés
      if (source === 'kept_interpretation' && !canon.has(n)) continue
      const canonical = canon.get(n) || sym
      seen.add(n)
      clean.push({ symbol: canonical, meaning: mean })
    }

    // Upsert weight-aware dans user_meaning_layer.
    // Unique = (user_id, symbol_concept, context_lang). On ne dilue jamais un sens plus fort :
    // on n'écrase que si le nouveau poids >= poids existant.
    let learned = 0
    for (const { symbol, meaning } of clean) {
      try {
        const { data: existing } = await supabase
          .from('user_meaning_layer')
          .select('id, weight, source')
          .eq('user_id', userId)
          .eq('context_lang', 'fr')
          .ilike('symbol_concept', symbol)
          .maybeSingle()

        if (existing) {
          if ((existing.weight ?? 0) > weight) continue // sens plus fort déjà en place → on respecte
          // le lexique personnel prime : une simple lecture endossée n'écrase jamais un sens
          // que le rêveur a énoncé lui-même (user_direct / resonance_note / correction).
          if (source === 'kept_interpretation' && existing.source && existing.source !== 'kept_interpretation') continue
          const { error } = await supabase
            .from('user_meaning_layer')
            .update({ user_meaning: meaning, weight, source, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
          if (!error) learned++
        } else {
          const { error } = await supabase
            .from('user_meaning_layer')
            .insert({ user_id: userId, symbol_concept: symbol, user_meaning: meaning, weight, source, context_lang: 'fr' })
          if (!error) learned++
        }
      } catch (e: any) {
        console.warn('[mvp.learn-deep] upsert failed for', symbol, e?.message)
      }
    }

    return corsify(NextResponse.json({ learned, source }))
  } catch (e: any) {
    console.error('[mvp.learn-deep]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

/**
 * link_feedback — le rêveur confirme (« résonne ») ou écarte (« pas vraiment ») un lien de résonance.
 *
 * Deux effets, tous deux honnêtes (aucune invention) :
 *   • mémoire du verdict → table resonance_feedback (upsert sur (user, source, other)).
 *     Les « dismissed » ne remontent plus dans /api/kairos/[id]/resonance.
 *   • si « résonne » : le pont confirmé RENFORCE la salience des symboles RÉELLEMENT communs aux deux
 *     kairos (intersection des motifs/figures extraits) — mais UNIQUEMENT ceux que le rêveur a déjà
 *     dans son lexique. On ne fabrique aucun sens : on ne fait que remonter le poids d'un sens existant
 *     (poids fort 0.8, jamais dilué vers le bas). C'est « le bridge confirmé entraîne la détection perso ».
 *
 * Best-effort, non bloquant : si la table n'est pas encore migrée, on renvoie recorded:false sans casser l'UX.
 */
const LINK_RESONATES_WEIGHT = 0.8

async function handleLinkFeedback(body: any, userId: string): Promise<Response> {
  const kairosId = typeof body.kairos_id === 'string' ? body.kairos_id : ''
  const linkId = typeof body.link_kairos_id === 'string' ? body.link_kairos_id : ''
  const verdict = body.verdict === 'resonates' || body.verdict === 'dismissed' ? body.verdict : null
  const register = typeof body.register === 'string' ? body.register.slice(0, 24) : null
  if (!kairosId || !linkId || !verdict || kairosId === linkId) {
    return corsify(NextResponse.json({ error: 'kairos_id, link_kairos_id et verdict valides requis' }, { status: 400 }))
  }

  const supabase = createServerClient()

  // Ownership des deux kairos (+ leurs images, pour le renforcement du pont confirmé)
  const { data: pair } = await supabase
    .from('kairos')
    .select('id, motif_tags, figures')
    .eq('user_id', userId)
    .in('id', [kairosId, linkId])
  const src = (pair || []).find((k: any) => k.id === kairosId)
  const other = (pair || []).find((k: any) => k.id === linkId)
  if (!src || !other) return corsify(NextResponse.json({ error: 'kairos introuvable' }, { status: 404 }))

  // Mémoire du verdict (table optionnelle jusqu'à migration).
  // On conserve le score AU MOMENT DE L'AFFICHAGE : sans lui, un « pas vraiment »
  // ne fait que masquer un lien et n'apprend rien. Avec lui, ~30 verdicts
  // suffisent à lire le seuil dans les données (calibrate_z_from_feedback).
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)
  let recorded = false
  try {
    const { error } = await supabase
      .from('resonance_feedback')
      .upsert(
        {
          user_id: userId, source_kairos_id: kairosId, other_kairos_id: linkId, register, verdict,
          z_at_serve: num(body.z_at_serve), adjusted_at_serve: num(body.adjusted_at_serve),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,source_kairos_id,other_kairos_id' },
      )
    recorded = !error
    // Recalibrage best-effort : ne fait rien sous 30 verdicts.
    if (recorded) {
      await supabase.rpc('calibrate_z_from_feedback', { p_user_id: userId })
    }
  } catch (e: any) {
    console.warn('[mvp.learn-deep/link_feedback] resonance_feedback indisponible (non bloquant):', e?.message)
  }

  // Renforcement du pont confirmé : les symboles communs RÉELS, s'ils sont déjà dans le lexique.
  let reinforced = 0
  if (verdict === 'resonates') {
    const figNames = (f: any): string[] => Array.isArray(f) ? f.map((x: any) => x?.name).filter(Boolean) : []
    const sMap = new Map<string, string>()
    for (const m of [...(src.motif_tags || []), ...figNames(src.figures)]) { const n = norm(m); if (n) sMap.set(n, m) }
    const shared: string[] = []
    for (const m of [...(other.motif_tags || []), ...figNames(other.figures)]) {
      const n = norm(m)
      if (sMap.has(n) && !shared.some(s => norm(s) === n)) shared.push(sMap.get(n)!)
    }
    for (const symbol of shared.slice(0, 8)) {
      try {
        const { data: existing } = await supabase
          .from('user_meaning_layer')
          .select('id, weight')
          .eq('user_id', userId)
          .eq('context_lang', 'fr')
          .ilike('symbol_concept', symbol)
          .maybeSingle()
        // on ne fabrique jamais un sens : on ne renforce QUE ce qui existe déjà, et seulement vers le haut.
        if (existing && (existing.weight ?? 0) < LINK_RESONATES_WEIGHT) {
          const { error } = await supabase
            .from('user_meaning_layer')
            .update({ weight: LINK_RESONATES_WEIGHT, updated_at: new Date().toISOString() })
            .eq('id', existing.id)
          if (!error) reinforced++
        }
      } catch (e: any) {
        console.warn('[mvp.learn-deep/link_feedback] renforcement échoué pour', symbol, e?.message)
      }
    }
  }

  return corsify(NextResponse.json({ recorded, verdict, reinforced, source: 'link_feedback' }))
}
