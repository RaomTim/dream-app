import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'

/**
 * GET /api/mvp/forge/works — galerie + solde.
 * POST { work_id, is_public } — bascule du partage public d'une œuvre.
 * Yeshua, 2026-06-11 (Vague B).
 */
export async function OPTIONS() { return corsOptions() }

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()
    await supabase.rpc('dream_grant_credits', { p_user_id: userId, p_amount: 0 })
    const [{ data: works }, { data: cred }] = await Promise.all([
      supabase.from('forge_works').select('id, kairos_id, kind, status, vision_title, asset_url, share_slug, is_public, cost, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(60),
      supabase.from('dream_credits').select('balance, granted_total').eq('user_id', userId).single(),
    ])
    return corsify(NextResponse.json({ works: works || [], balance: cred?.balance ?? 0 }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    if (!body.work_id) return corsify(NextResponse.json({ error: 'work_id requis' }, { status: 400 }))
    const supabase = createServerClient()
    const { error } = await supabase.from('forge_works').update({ is_public: body.is_public === true }).eq('id', body.work_id).eq('user_id', userId)
    if (error) return corsify(NextResponse.json({ error: error.message }, { status: 500 }))
    return corsify(NextResponse.json({ ok: true }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
