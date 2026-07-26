import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/user/delete-request
 *   → Enregistre une DEMANDE de suppression de compte, avec un délai de sept jours
 *     avant l'effacement définitif (SPEC §8 R1, fiche « Tes données »).
 *
 *   On NE supprime RIEN immédiatement. On marque une demande dans la table
 *   `deletion_requests`, avec la date d'effacement prévue (+7 jours). L'utilisateur
 *   peut annuler pendant ce délai (DELETE ci-dessous). L'effacement réel sera exécuté
 *   par un job/cron côté serveur (hors périmètre de cette route).
 *
 *   Migration NON APPLIQUÉE : supabase-migrations/2026-07-11_deletion_requests.sql
 *   → si la table n'existe pas encore, la route répond 503 « bientôt » plutôt que de
 *     planter, pour que l'UI puisse afficher un message honnête.
 *
 * GET    → l'état de ma demande en cours (le cas échéant).
 * POST   → créer/rafraîchir ma demande (délai 7 jours).
 * DELETE → annuler ma demande (« je change d'avis »).
 *
 * Yeshua (Opus), 2026-07-11.
 */

const DELAY_DAYS = 7

function tableMissing(msg?: string) {
  const m = (msg || '').toLowerCase()
  return m.includes('does not exist') || m.includes('could not find') || m.includes('relation') || m.includes('schema cache')
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('deletion_requests')
      .select('id, requested_at, scheduled_for, status')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .maybeSingle()

    if (error) {
      if (tableMissing(error.message)) return NextResponse.json({ pending: false, unavailable: true })
      throw error
    }
    return NextResponse.json({ pending: !!data, request: data ?? null })
  } catch (e: any) {
    console.error('[user/delete-request.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    const now = new Date()
    const scheduledFor = new Date(now.getTime() + DELAY_DAYS * 24 * 60 * 60 * 1000)

    const { data, error } = await supabase
      .from('deletion_requests')
      .upsert(
        {
          user_id: userId,
          requested_at: now.toISOString(),
          scheduled_for: scheduledFor.toISOString(),
          status: 'pending',
        },
        { onConflict: 'user_id' },
      )
      .select('id, requested_at, scheduled_for, status')
      .maybeSingle()

    if (error) {
      if (tableMissing(error.message)) {
        return NextResponse.json(
          { error: 'La suppression de compte arrive bientôt. Écris-nous en attendant et on s’en occupe à la main.' },
          { status: 503 },
        )
      }
      throw error
    }

    return NextResponse.json({ ok: true, delay_days: DELAY_DAYS, request: data })
  } catch (e: any) {
    console.error('[user/delete-request.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    const { error } = await supabase
      .from('deletion_requests')
      .update({ status: 'cancelled' })
      .eq('user_id', userId)
      .eq('status', 'pending')

    if (error && !tableMissing(error.message)) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[user/delete-request.DELETE] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
