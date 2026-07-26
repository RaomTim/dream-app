/**
 * POST /api/bigdream/human-push/request
 *
 * Spec : 4_LOG.md 2026-04-29 (Feature 3 — Push humain payant 30€).
 *
 * Body : { kairos_id?: string, workflow_id?: string, user_request_text: string }
 *
 * Crée une bigdream_human_pushes en status='pending' + génère un Stripe
 * payment_intent_id (MVP : stub, juste un id local préfixé "stub_pi_…").
 * V1.5 : vraie intégration Stripe (PaymentIntent, webhook capture).
 *
 * Auteur : Yeshua, 2026-04-29.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

const PRICE_EUR = 30.0

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const userRequestText: string =
      typeof body.user_request_text === 'string' ? body.user_request_text.trim().slice(0, 4000) : ''
    if (userRequestText.length < 10) {
      return NextResponse.json(
        { error: 'user_request_text requis (min 10 caractères)' },
        { status: 400 }
      )
    }

    const kairosId: string | null = typeof body.kairos_id === 'string' ? body.kairos_id : null
    const workflowId: string | null =
      typeof body.workflow_id === 'string' ? body.workflow_id : null

    const supabase = createServerClient()

    // Vérification optionnelle d'ownership si kairos/workflow fournis
    if (kairosId) {
      const { data: k } = await supabase
        .from('kairos')
        .select('id')
        .eq('id', kairosId)
        .eq('user_id', userId)
        .maybeSingle()
      if (!k) return NextResponse.json({ error: 'kairos introuvable' }, { status: 404 })
    }
    if (workflowId) {
      const { data: w } = await supabase
        .from('bigdream_workflows')
        .select('id')
        .eq('id', workflowId)
        .eq('user_id', userId)
        .maybeSingle()
      if (!w) return NextResponse.json({ error: 'workflow introuvable' }, { status: 404 })
    }

    // MVP Stripe stub — V1.5 : remplacer par vraie call Stripe.paymentIntents.create()
    const stubPaymentIntentId = `stub_pi_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`

    const { data: created, error: cErr } = await supabase
      .from('bigdream_human_pushes')
      .insert({
        user_id: userId,
        workflow_id: workflowId,
        kairos_id: kairosId,
        status: 'pending',
        amount_eur: PRICE_EUR,
        stripe_payment_intent_id: stubPaymentIntentId,
        user_request_text: userRequestText,
      })
      .select('id, status, amount_eur, stripe_payment_intent_id, requested_at')
      .single()

    if (cErr || !created) {
      return NextResponse.json({ error: cErr?.message || 'create failed' }, { status: 500 })
    }

    return NextResponse.json(
      {
        push: created,
        payment: {
          stub: true,
          payment_intent_id: stubPaymentIntentId,
          amount_eur: PRICE_EUR,
          note: 'MVP : Stripe stub — la vraie intégration arrive en V1.5',
        },
      },
      { status: 201 }
    )
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    console.error('[bigdream.human-push.request] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
