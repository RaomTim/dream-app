import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * GET /api/mvp/symbol-book?window=season|year|all
 * Écran "univers onirique" MVP — wrap de la RPC dream_symbol_book (learning v2)
 * + agrégat émotions depuis kairos (l'axe émotions ne vit pas dans le dict).
 * Yeshua, 2026-06-10 (Vague 1 MVP).
 */
export async function OPTIONS() { return corsOptions() }

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const window = ['season', 'year', 'all'].includes(searchParams.get('window') || '')
      ? (searchParams.get('window') as string)
      : 'season'

    const supabase = createServerClient()

    const { data: symbols, error } = await supabase.rpc('dream_symbol_book', {
      p_user_id: userId,
      p_window: window,
    })
    if (error) {
      console.error('[mvp.symbol-book] rpc error:', error.message)
      return corsify(NextResponse.json({ error: error.message }, { status: 500 }))
    }

    // Axe émotions : agrégat depuis kairos (fenêtre alignée)
    const since =
      window === 'season'
        ? new Date(Date.now() - 92 * 864e5).toISOString()
        : window === 'year'
          ? new Date(Date.now() - 365 * 864e5).toISOString()
          : '1970-01-01'
    // 2026-07-26 (B4) — la fenêtre saison/année compte les rêves à la date où ils
    // ont EU LIEU (occurred_at), pas à celle où ils ont été déposés. Un rêve d'avril
    // raconté en juillet appartient au printemps. `occurred_at` est une colonne
    // générée qui vaut created_at tant qu'aucune date de rêve n'est posée.
    let emoRows: any[] | null = null
    {
      const q = () =>
        supabase
          .from('kairos')
          .select('dominant_emotion, affective_valence')
          .eq('user_id', userId)
          .not('dominant_emotion', 'is', null)
      let res = await q().gte('occurred_at', since)
      if (res.error && /occurred_at|column .* does not exist|42703/i.test(`${res.error.message} ${(res.error as any).code || ''}`)) {
        res = await q().gte('created_at', since)
      }
      emoRows = res.data as any[] | null
    }

    const emoMap: Record<string, { n: number; valenceSum: number }> = {}
    for (const r of emoRows || []) {
      const k = (r.dominant_emotion || '').trim().toLowerCase()
      if (!k) continue
      if (!emoMap[k]) emoMap[k] = { n: 0, valenceSum: 0 }
      emoMap[k].n += 1
      emoMap[k].valenceSum += typeof r.affective_valence === 'number' ? r.affective_valence : 0
    }
    const emotions = Object.entries(emoMap)
      .map(([label, v]) => ({ label, count: v.n, valence_avg: v.n ? v.valenceSum / v.n : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)

    // Sens du user (mots du rêveur) pour les symboles affichés
    const terms = (symbols || []).map((s: any) => s.symbol_text).slice(0, 40)
    let meanings: any[] = []
    if (terms.length) {
      const { data: lex } = await supabase.rpc('dream_lexicon_for_terms', {
        p_user_id: userId,
        p_terms: terms,
      })
      meanings = lex || []
    }
    const meaningByTerm: Record<string, string> = {}
    for (const m of meanings) {
      const k = (m.symbol_concept || '').toLowerCase()
      if (k && m.user_meaning) meaningByTerm[k] = m.user_meaning
    }

    return corsify(NextResponse.json({
      window,
      symbols: (symbols || []).map((s: any) => ({
        kind: s.symbol_kind,
        text: s.symbol_text,
        count: s.count_total,
        valence: s.valence_avg,
        first_seen: s.first_seen_at,
        last_seen: s.last_seen_at,
        user_meaning: meaningByTerm[(s.symbol_text || '').toLowerCase()] || null,
      })),
      emotions,
    }))
  } catch (e: any) {
    console.error('[mvp.symbol-book]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
