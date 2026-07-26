import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { runKairosEnrichmentPipeline } from '@/lib/kairos/pipeline'
import { reqLang, asLang } from '@/lib/req-lang'

/**
 * POST /api/kairos/[id]/enrich-trigger
 *
 * Internal endpoint — appelé par EF kairos-enrich (Supabase) ou par scheduler
 * pour relancer le pipeline d'enrichissement sur un kairos existant.
 *
 * Auth : x-internal-secret header. PAS Bearer user (c'est un appel server-to-server).
 *
 * Body : { user_id, lang? }
 *
 * Langue : appel server-to-server — l'appelant n'a souvent aucune idée de la langue
 * du rêveur. La SOURCE DE VÉRITÉ est donc `kairos.dreamer_lang`, gravé à l'insert
 * (migration kairos_dreamer_lang, prod 2026-07-11). Ordre : colonne > body.lang >
 * header > 'fr'. Un appelant ne peut pas se tromper de langue sur un kairos existant.
 */
export const maxDuration = 120

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const secret = req.headers.get('x-internal-secret')
    const expected = process.env.INTERNAL_PIPELINE_SECRET
    if (!expected || secret !== expected) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { user_id } = body
    if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

    const supabase = createServerClient()

    // La langue gravée sur le kairos prime sur tout ce que l'appelant raconte.
    const { data: row } = await supabase
      .from('kairos')
      .select('dreamer_lang')
      .eq('id', params.id)
      .maybeSingle()

    const lang = row?.dreamer_lang
      ? asLang(row.dreamer_lang)
      : body.lang ? asLang(body.lang) : reqLang(req)

    const result = await runKairosEnrichmentPipeline({
      supabaseService: supabase,
      userId: user_id,
      kairosId: params.id,
      lang,
    })

    return NextResponse.json(result)
  } catch (e: any) {
    console.error('[enrich-trigger] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
