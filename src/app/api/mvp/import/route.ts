import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * POST /api/mvp/import — Import Hub MVP (onboarding killer).
 * Body: { dreams: [{ text, title?, date? }] } — max 50 par appel.
 * Crée les kairos en batch (capture_method='import_hub') SANS pipeline immédiate :
 * l'enrichissement (motifs/figures → univers onirique) se fait en différé
 * via /api/mvp/enrich-batch — même chemin que l'import legacy.
 * Yeshua, 2026-06-11 (demande Tim : import + extraction pour les futurs users).
 */
export const maxDuration = 30

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const dreams = Array.isArray(body.dreams) ? body.dreams.slice(0, 50) : []
    const rows = dreams
      .map((d: any) => ({
        text: typeof d?.text === 'string' ? d.text.trim() : '',
        title: typeof d?.title === 'string' ? d.title.trim().slice(0, 120) || null : null,
        date: d?.date && !isNaN(Date.parse(d.date)) ? new Date(d.date).toISOString() : null,
      }))
      .filter((d: any) => d.text.length >= 10)
    if (!rows.length) {
      return corsify(NextResponse.json({ error: 'aucun rêve valide (min 10 caractères chacun)' }, { status: 400 }))
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos')
      .insert(
        rows.map((d: any) => ({
          user_id: userId,
          raw_text: d.text,
          title: d.title,
          kairos_type: 'reve',
          capture_method: 'import_hub',
          figures: [],
          ...(d.date ? { created_at: d.date } : {}),
        }))
      )
      .select('id')
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))

    return corsify(
      NextResponse.json({
        imported: data?.length || 0,
        message: 'tes rêves sont déposés — leur lecture profonde se tisse en arrière-plan',
      })
    )
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
