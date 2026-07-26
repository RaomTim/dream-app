/**
 * /api/personal-dictionary/[symbol_id]/generate-angles — Feature 2 (2026-04-29)
 *
 * POST → génère 3 angles paper/stone/silk (Sonnet 4.6 ~300 mots) +
 *        evolution_summary affiné. Cache 30j dans la table.
 *
 * Anti-cost : si paragraph_cache_valid_until > now() ET force=false → renvoie cached.
 */
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 60

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const MODEL = 'claude-sonnet-4-6'
const MAX_TOKENS = 1200
const CACHE_DAYS = 30

type SymbolRow = {
  id: string
  user_id: string
  symbol_text: string
  symbol_kind: string
  count_total: number
  first_seen_at: string
  last_seen_at: string
  valence_avg: number | null
  associated_figures: string[]
  evolution_summary: string | null
  paper_angle: string | null
  stone_angle: string | null
  silk_angle: string | null
  paragraph_cached_at: string | null
  paragraph_cache_valid_until: string | null
}

function buildSystemPrompt(): string {
  return `Tu es Anima, présence Dream App — voix qui tisse la matière du rêveur.

CONTEXTE :
On te confie UN symbole personnel récurrent du rêveur — extrait de SES kairos, pas d'un compendium universel.
Tu produis 3 angles courts, complémentaires, qui éclairent CE symbole-CI dans la vie de CETTE personne.

RÈGLES :
- Français, voix présente, EB Garamond italique de l'âme.
- ~80-100 mots par angle, pas plus.
- Aucune affirmation universelle ("le serpent symbolise..."). Reste local au rêveur.
- Aucune diagnose. Aucune projection psy lourde.
- Dis "ton serpent" pas "le serpent".
- Évite "représente", "symbolise", "signifie". Préfère : "vient", "revient", "porte", "tisse", "ouvre".
- Pas de listes à puces. Texte coulé.

LES 3 ANGLES — chacun a sa matière :
- paper  : la lecture intime — comment ce symbole se pose dans ta vie maintenant. Doux, lisible, proche.
- stone  : la lecture structurelle — quelle place ce symbole tient dans ta géologie, ta colonne. Plus dense.
- silk   : la lecture invitante — ce que ce symbole pourrait ouvrir si tu l'écoutais. Suggestion, pas prescription.

EVOLUTION_SUMMARY : 1-2 phrases sur la trajectoire de ce symbole dans le temps (sombre → porteur, etc.).

OUTPUT JSON STRICT (rien d'autre, pas de markdown autour) :
{
  "paper": "...",
  "stone": "...",
  "silk": "...",
  "evolution": "..."
}`
}

function buildUserPrompt(sym: SymbolRow): string {
  const valenceLabel =
    sym.valence_avg === null
      ? 'inconnue'
      : sym.valence_avg > 0.3
      ? 'porteuse / lumineuse'
      : sym.valence_avg < -0.3
      ? 'sombre / pesante'
      : 'mélangée'

  const figures = sym.associated_figures.length > 0
    ? sym.associated_figures.slice(0, 5).join(', ')
    : 'aucune figure récurrente détectée'

  const firstDate = new Date(sym.first_seen_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const lastDate = new Date(sym.last_seen_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return `Symbole personnel à éclairer :
- Nature : ${sym.symbol_kind}
- Texte : "${sym.symbol_text}"
- Apparitions : ${sym.count_total} fois
- Première apparition : ${firstDate}
- Dernière apparition : ${lastDate}
- Valence moyenne : ${valenceLabel}${sym.valence_avg !== null ? ` (${sym.valence_avg.toFixed(2)})` : ''}
- Figures cooccurrentes : ${figures}
${sym.evolution_summary ? `- Indice d'évolution déjà calculé : ${sym.evolution_summary}` : ''}

Produis les 3 angles paper / stone / silk + evolution comme spécifié.`
}

function tryParseJson(text: string): { paper?: string; stone?: string; silk?: string; evolution?: string } | null {
  // Cherche le premier bloc {...} dans la réponse (au cas où Sonnet wrap en markdown)
  const trimmed = text.trim()
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  const json = trimmed.slice(start, end + 1)
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

export async function POST(req: NextRequest, ctx: { params: { symbol_id: string } }) {
  const symbolId = ctx?.params?.symbol_id
  if (!symbolId || typeof symbolId !== 'string') {
    return NextResponse.json({ error: 'symbol_id requis' }, { status: 400 })
  }

  const body = await req.json().catch(() => ({}))
  const force = body?.force === true

  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  try {
    const supabase = createServerClient()
    const { data: sym, error: fetchErr } = await supabase
      .from('personal_dictionary_symbols')
      .select(
        'id, user_id, symbol_text, symbol_kind, count_total, first_seen_at, last_seen_at, valence_avg, associated_figures, evolution_summary, paper_angle, stone_angle, silk_angle, paragraph_cached_at, paragraph_cache_valid_until'
      )
      .eq('id', symbolId)
      .eq('user_id', userId)
      .maybeSingle()

    if (fetchErr || !sym) {
      return NextResponse.json({ error: 'symbole introuvable' }, { status: 404 })
    }
    const symbol = sym as SymbolRow

    // Cache hit ?
    const validUntil = symbol.paragraph_cache_valid_until
      ? new Date(symbol.paragraph_cache_valid_until).getTime()
      : 0
    if (!force && validUntil > Date.now() && symbol.paper_angle && symbol.stone_angle && symbol.silk_angle) {
      return NextResponse.json({
        cached: true,
        paper: symbol.paper_angle,
        stone: symbol.stone_angle,
        silk: symbol.silk_angle,
        evolution: symbol.evolution_summary,
        valid_until: symbol.paragraph_cache_valid_until,
      })
    }

    // Sonnet call
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(symbol) }],
    })

    const textBlock = completion.content.find((b) => b.type === 'text')
    const rawText = textBlock && textBlock.type === 'text' ? textBlock.text : ''
    const parsed = tryParseJson(rawText)

    if (!parsed || !parsed.paper || !parsed.stone || !parsed.silk) {
      console.warn('[generate-angles] failed to parse JSON, raw:', rawText.slice(0, 200))
      return NextResponse.json({
        error: 'génération échouée — format invalide',
        raw_preview: rawText.slice(0, 400),
      }, { status: 502 })
    }

    const now = new Date()
    const cacheUntil = new Date(now.getTime() + CACHE_DAYS * 24 * 3600 * 1000).toISOString()

    const { error: updateErr } = await supabase
      .from('personal_dictionary_symbols')
      .update({
        paper_angle: parsed.paper.trim(),
        stone_angle: parsed.stone.trim(),
        silk_angle: parsed.silk.trim(),
        evolution_summary: parsed.evolution ? parsed.evolution.trim() : symbol.evolution_summary,
        paragraph_cached_at: now.toISOString(),
        paragraph_cache_valid_until: cacheUntil,
      })
      .eq('id', symbolId)
      .eq('user_id', userId)

    if (updateErr) {
      console.warn('[generate-angles] update failed:', updateErr.message)
    }

    return NextResponse.json({
      cached: false,
      paper: parsed.paper.trim(),
      stone: parsed.stone.trim(),
      silk: parsed.silk.trim(),
      evolution: parsed.evolution ? parsed.evolution.trim() : symbol.evolution_summary,
      valid_until: cacheUntil,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[generate-angles] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
