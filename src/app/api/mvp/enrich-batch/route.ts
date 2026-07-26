import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { runKairosEnrichmentPipeline } from '@/lib/kairos/pipeline'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, type DreamLang } from '@/lib/req-lang'

/**
 * Enrichissement différé des kairos EN ATTENTE (numinosity_pending = true).
 * FILET DE SÉCURITÉ du pipeline : complète ce que `waitUntil` n'a pas fini
 * (dépassement maxDuration, import legacy, cold start coupé).
 *   - GET ?cron_secret=…   → cron Vercel (toutes les 2 min, cf. vercel.json)
 *   - POST { secret, limit }→ opératoire (import hub / debug)
 * Yeshua, 2026-06-20 — élargi de `import_*` à tout `numinosity_pending` + cron.
 *
 * ✅ i18n RÉSOLU (2026-07-11) — la langue est GRAVÉE sur le kairos.
 * Le cron n'a pas de rêveur au bout du fil (aucun header `X-Dream-Lang`), donc il ne
 * pouvait pas deviner sa langue : il enrichissait tout en français, y compris les rêves
 * d'un rêveur anglophone rattrapés par le filet (l'import de masse passe TOUJOURS par là).
 * Fix : `POST /api/kairos` écrit `kairos.dreamer_lang` à l'insert (migration
 * kairos_dreamer_lang, appliquée en prod le 2026-07-11), et le cron le RELIT par ligne.
 * `dreamer_lang` NULL = kairos écrit avant l'i18n → 'fr'. Le paramètre `lang` de runBatch
 * n'est plus qu'un repli pour ces lignes-là.
 */
export const maxDuration = 300

const BATCH_SECRET = 'dream-batch-7f3e9a2c-4b81-4d05-a6c9-e2f0d1b85c47'

const asLang = (v: unknown): DreamLang => (v === 'en' ? 'en' : 'fr')

async function runBatch(limit: number, fallbackLang: DreamLang) {
  const supabase = createServerClient()
  const { data: pending, error } = await supabase
    .from('kairos')
    .select('id, user_id, dreamer_lang')
    .eq('numinosity_pending', true)
    .not('raw_text', 'is', null)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) return { error: error.message }

  const processed: string[] = []
  const failed: string[] = []
  for (const k of pending || []) {
    try {
      // La langue du rêveur, ligne par ligne. NULL (kairos d'avant l'i18n) → repli.
      const lang = k.dreamer_lang ? asLang(k.dreamer_lang) : fallbackLang
      await runKairosEnrichmentPipeline({ supabaseService: supabase, userId: k.user_id, kairosId: k.id, lang })
      processed.push(k.id)
    } catch (e: any) {
      console.error('[enrich-batch]', k.id, e.message)
      failed.push(k.id)
    }
  }

  const { count } = await supabase
    .from('kairos')
    .select('id', { count: 'exact', head: true })
    .eq('numinosity_pending', true)

  return { processed, failed, remaining: count ?? -1 }
}

export async function OPTIONS() { return corsOptions() }

// Cron Vercel — filet de sécurité régulier
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('cron_secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  // Cron : la langue est relue sur chaque kairos (dreamer_lang). 'fr' n'est que le
  // repli pour les lignes écrites avant l'i18n.
  const result = await runBatch(10, 'fr')
  return NextResponse.json(result)
}

// Opératoire (import hub / debug)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    if (body.secret !== BATCH_SECRET) {
      return corsify(NextResponse.json({ error: 'unauthorized' }, { status: 401 }))
    }
    const limit = Math.min(20, Math.max(1, parseInt(body.limit) || 5))
    // Appel opératoire depuis l'app (import hub) → le header porte la langue du rêveur.
    const result = await runBatch(limit, reqLang(req))
    return corsify(NextResponse.json(result))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
