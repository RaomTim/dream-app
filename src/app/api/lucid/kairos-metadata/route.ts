import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/kairos-metadata
 *
 * POST → attach lucidity metadata to an existing kairos.
 *   body: {
 *     kairos_id, lucidity_score, lucidity_technique, rem_cycle_estimate,
 *     awakening_time, hours_slept, stability_score, control_score,
 *     false_awakening_count, signs_recognized?, reality_check_performed?,
 *     pre_sleep_intention?, notes_technique?
 *   }
 *
 * Side-effect : si lucidity_score >= 1, increment user_profile.total_lucid_dreams
 * et bump occurrence_count des signs_recognized + triggered_lucidity_count.
 *
 * Auteur : Yeshua, 2026-04-26.
 */

const VALID_TECHNIQUES = ['DILD', 'MILD', 'WILD', 'SSILD', 'WBTB', 'spontaneous', 'none']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.kairos_id) {
      return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })
    }
    const lucidity_score = clampInt(body.lucidity_score, 0, 5)
    const stability_score = clampInt(body.stability_score, 0, 5)
    const control_score = clampInt(body.control_score, 0, 5)
    const technique = VALID_TECHNIQUES.includes(body.lucidity_technique)
      ? body.lucidity_technique
      : 'none'

    const supabase = createServerClient()

    // Vérifier que le kairos appartient bien à l'user
    const { data: kairos, error: kErr } = await supabase
      .from('kairos')
      .select('id, user_id')
      .eq('id', body.kairos_id)
      .eq('user_id', userId)
      .maybeSingle()
    if (kErr) throw kErr
    if (!kairos) {
      return NextResponse.json({ error: 'kairos not found' }, { status: 404 })
    }

    // Upsert : si déjà metadata pour ce kairos, on update
    const { data: existing } = await supabase
      .from('lucid_kairos_metadata')
      .select('id')
      .eq('kairos_id', body.kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    const row: any = {
      kairos_id: body.kairos_id,
      user_id: userId,
      lucidity_score,
      lucidity_technique: technique,
      rem_cycle_estimate: numOrNull(body.rem_cycle_estimate),
      awakening_time: body.awakening_time || null,
      hours_slept: numOrNull(body.hours_slept),
      stability_score,
      control_score,
      false_awakening_count: numOrNull(body.false_awakening_count) || 0,
      signs_recognized: Array.isArray(body.signs_recognized) ? body.signs_recognized : null,
      reality_check_performed: body.reality_check_performed === true,
      pre_sleep_intention: body.pre_sleep_intention || null,
      notes_technique: body.notes_technique || null,
    }

    let saved: any
    if (existing) {
      const { data, error } = await supabase
        .from('lucid_kairos_metadata')
        .update(row)
        .eq('id', existing.id)
        .select('*')
        .single()
      if (error) throw error
      saved = data
    } else {
      const { data, error } = await supabase
        .from('lucid_kairos_metadata')
        .insert(row)
        .select('*')
        .single()
      if (error) throw error
      saved = data
    }

    // Update profile counters (best-effort, swallow errors)
    if (lucidity_score >= 1) {
      try {
        const { data: prof } = await supabase
          .from('lucid_user_profile')
          .select('total_lucid_dreams')
          .eq('user_id', userId)
          .maybeSingle()
        const total = (prof?.total_lucid_dreams || 0) + (existing ? 0 : 1)
        await supabase
          .from('lucid_user_profile')
          .upsert(
            { user_id: userId, total_lucid_dreams: total, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' }
          )
      } catch (e) {
        console.warn('[lucid.kairos-metadata] profile bump failed', e)
      }

      // Bump signs triggered_lucidity_count
      const signs = Array.isArray(body.signs_recognized) ? body.signs_recognized : []
      for (const sLabel of signs) {
        try {
          const { data: s } = await supabase
            .from('lucid_dream_signs')
            .select('id, triggered_lucidity_count')
            .eq('user_id', userId)
            .eq('sign_label', String(sLabel).toLowerCase().trim())
            .maybeSingle()
          if (s) {
            await supabase
              .from('lucid_dream_signs')
              .update({ triggered_lucidity_count: (s.triggered_lucidity_count || 0) + 1 })
              .eq('id', s.id)
          }
        } catch (e) {
          console.warn('[lucid.kairos-metadata] sign bump failed', e)
        }
      }
    }

    return NextResponse.json({ metadata: saved }, { status: existing ? 200 : 201 })
  } catch (e: any) {
    console.error('[lucid.kairos-metadata.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const kairosId = searchParams.get('kairos_id')
    const supabase = createServerClient()

    let q = supabase
      .from('lucid_kairos_metadata')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100)
    if (kairosId) q = q.eq('kairos_id', kairosId)

    const { data, error } = await q
    if (error) throw error
    return NextResponse.json({ metadata: data || [] })
  } catch (e: any) {
    console.error('[lucid.kairos-metadata.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

function clampInt(v: any, lo: number, hi: number): number {
  const n = Number(v)
  if (!Number.isFinite(n)) return 0
  return Math.max(lo, Math.min(hi, Math.round(n)))
}
function numOrNull(v: any): number | null {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
