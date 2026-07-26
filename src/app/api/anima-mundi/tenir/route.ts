import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/anima-mundi/tenir
 * Body: { annales_id }
 *
 * User "tient" une annale en circulation. Quand hold_count >= threshold_required,
 * l'annale passe à state='archived' (cron anima-annales-cron).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const annalesId = body.annales_id
    if (!annalesId) return NextResponse.json({ error: 'annales_id required' }, { status: 400 })

    const supabase = createServerClient()

    const { error: insErr } = await supabase
      .from('annales_tenir')
      .insert({ annales_id: annalesId, user_id: userId })
    if (insErr && !String(insErr.message || '').includes('duplicate')) {
      throw insErr
    }

    // Increment hold_count atomically (best-effort V1 — race possible mais bénin)
    const { data: annale } = await supabase
      .from('annales_circulation')
      .select('hold_count, threshold_required, state')
      .eq('id', annalesId)
      .maybeSingle()

    if (annale) {
      const newCount = (annale.hold_count || 0) + 1
      const newState = newCount >= annale.threshold_required ? 'archived' : annale.state
      const updateRow: any = { hold_count: newCount }
      if (newState === 'archived' && annale.state !== 'archived') {
        updateRow.state = 'archived'
        updateRow.archived_at = new Date().toISOString()
      }
      await supabase.from('annales_circulation').update(updateRow).eq('id', annalesId)
    }

    return NextResponse.json({ ok: true, tenu: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
