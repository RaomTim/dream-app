import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-04-25 — Yeshua (refonte)
 * 3 modes de partage d'un kairos vers un cercle (Bible §3.4.1) :
 *
 *   - 'private'       → defaut. Aucune trace dans le cercle. On RETIRE des deux tables.
 *   - 'optin_anon'    → INSERT kairos_circle_optin (anonymisé, agrégé pour patterns/restitution).
 *                        On RETIRE de kairos_circle_shared (cleartext) si présent.
 *   - 'shared_clear'  → INSERT kairos_circle_shared (cleartext, visible aux membres).
 *                        On INSERT AUSSI kairos_circle_optin (le shared compte aussi pour patterns).
 *
 * POST /api/kairos/[id]/circle-optin
 * Body: { circle_id: uuid, mode: 'private'|'optin_anon'|'shared_clear', pseudonym?: string }
 *
 * Backward-compat : si `mode` absent → comporte comme avant (insert kairos_circle_optin).
 */

const VALID_MODES = new Set(['private', 'optin_anon', 'shared_clear'])

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const { circle_id, mode: rawMode, pseudonym } = body || {}

    if (!circle_id) {
      return NextResponse.json({ error: 'circle_id required' }, { status: 400 })
    }
    const mode = rawMode || 'optin_anon' // backward-compat
    if (!VALID_MODES.has(mode)) {
      return NextResponse.json(
        { error: "mode must be one of 'private', 'optin_anon', 'shared_clear'" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Vérifier propriété kairos + membership cercle
    const [kairosCheck, memberCheck] = await Promise.all([
      supabase
        .from('kairos')
        .select('id')
        .eq('id', params.id)
        .eq('user_id', userId)
        .maybeSingle(),
      supabase
        .from('circle_members')
        .select('id')
        .eq('circle_id', circle_id)
        .eq('user_id', userId)
        .is('left_at', null)
        .maybeSingle(),
    ])
    if (!kairosCheck.data) {
      return NextResponse.json({ error: 'Kairos not yours' }, { status: 403 })
    }
    if (!memberCheck.data) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    // ─── Mode 'private' : retirer les deux ─────────────────────
    if (mode === 'private') {
      await Promise.all([
        supabase
          .from('kairos_circle_optin')
          .delete()
          .eq('kairos_id', params.id)
          .eq('circle_id', circle_id),
        supabase
          .from('kairos_circle_shared')
          .delete()
          .eq('kairos_id', params.id)
          .eq('circle_id', circle_id),
      ])
      return NextResponse.json({ ok: true, mode: 'private' })
    }

    // ─── Mode 'optin_anon' : insert optin, retirer shared ──────
    if (mode === 'optin_anon') {
      await supabase
        .from('kairos_circle_shared')
        .delete()
        .eq('kairos_id', params.id)
        .eq('circle_id', circle_id)

      const { error } = await supabase
        .from('kairos_circle_optin')
        .upsert(
          { kairos_id: params.id, circle_id, user_id: userId },
          { onConflict: 'kairos_id,circle_id' }
        )
      if (error && !String(error.message || '').toLowerCase().includes('duplicate')) {
        throw error
      }
      return NextResponse.json({ ok: true, mode: 'optin_anon' })
    }

    // ─── Mode 'shared_clear' : insert dans les DEUX ────────────
    // shared_clear inclut anonyme dans patterns + version visible cleartext
    if (mode === 'shared_clear') {
      const [optinRes, sharedRes] = await Promise.all([
        supabase
          .from('kairos_circle_optin')
          .upsert(
            { kairos_id: params.id, circle_id, user_id: userId },
            { onConflict: 'kairos_id,circle_id' }
          ),
        supabase
          .from('kairos_circle_shared')
          .upsert(
            {
              kairos_id: params.id,
              circle_id,
              user_id: userId,
              pseudonym: pseudonym || null,
            },
            { onConflict: 'kairos_id,circle_id' }
          ),
      ])
      if (
        optinRes.error &&
        !String(optinRes.error.message || '').toLowerCase().includes('duplicate')
      ) {
        throw optinRes.error
      }
      if (
        sharedRes.error &&
        !String(sharedRes.error.message || '').toLowerCase().includes('duplicate')
      ) {
        throw sharedRes.error
      }
      return NextResponse.json({ ok: true, mode: 'shared_clear' })
    }

    return NextResponse.json({ error: 'unreachable' }, { status: 500 })
  } catch (e: any) {
    console.error('circle-optin POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * GET /api/kairos/[id]/circle-optin?circle_id=...
 * Renvoie le mode actuel du kairos pour ce cercle.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const circle_id = searchParams.get('circle_id')
    if (!circle_id) {
      return NextResponse.json({ error: 'circle_id required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // Vérifier propriété kairos
    const { data: kairos } = await supabase
      .from('kairos')
      .select('id')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()
    if (!kairos) {
      return NextResponse.json({ error: 'Kairos not yours' }, { status: 403 })
    }

    const [optin, shared] = await Promise.all([
      supabase
        .from('kairos_circle_optin')
        .select('opted_at')
        .eq('kairos_id', params.id)
        .eq('circle_id', circle_id)
        .maybeSingle(),
      supabase
        .from('kairos_circle_shared')
        .select('shared_at, pseudonym')
        .eq('kairos_id', params.id)
        .eq('circle_id', circle_id)
        .maybeSingle(),
    ])

    let mode: 'private' | 'optin_anon' | 'shared_clear' = 'private'
    if (shared.data) mode = 'shared_clear'
    else if (optin.data) mode = 'optin_anon'

    return NextResponse.json({
      mode,
      opted_at: optin.data?.opted_at || null,
      shared_at: shared.data?.shared_at || null,
      pseudonym: shared.data?.pseudonym || null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * DELETE /api/kairos/[id]/circle-optin?circle_id=...
 * Backward-compat : retire des DEUX tables → équivalent mode 'private'.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const { searchParams } = new URL(req.url)
    const circle_id = searchParams.get('circle_id')
    if (!circle_id) {
      return NextResponse.json({ error: 'circle_id required' }, { status: 400 })
    }

    const supabase = createServerClient()
    await Promise.all([
      supabase
        .from('kairos_circle_optin')
        .delete()
        .eq('kairos_id', params.id)
        .eq('circle_id', circle_id)
        .eq('user_id', userId),
      supabase
        .from('kairos_circle_shared')
        .delete()
        .eq('kairos_id', params.id)
        .eq('circle_id', circle_id)
        .eq('user_id', userId),
    ])
    return NextResponse.json({ ok: true, mode: 'private' })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
