import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/profile
 *
 * GET  → fetch user lucid profile (creates default if not exists)
 * POST → upsert profile (toggle enabled, change technique, ui_mode, etc.)
 *
 * Lucid sub-app — Bible §17 (sous-apps satellites). Opt-in strict.
 * Auteur : Yeshua, 2026-04-26.
 */

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from('lucid_user_profile')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    // Pas de profil → renvoyer un profil "défaut" non-persisté
    if (!data) {
      return NextResponse.json({
        profile: {
          user_id: userId,
          enabled: false,
          experience_level: null,
          preferred_technique: null,
          total_lucid_dreams: 0,
          total_dreams_recalled: 0,
          current_streak_lucid_per_week: 0,
          best_streak: 0,
          ui_mode: 'dream_ambient',
          obsidian_export_enabled: false,
          onboarding_completed: false,
          preferred_layout: 'tabs_5',
          _exists: false,
        },
      })
    }

    return NextResponse.json({ profile: { ...data, _exists: true } })
  } catch (e: any) {
    console.error('[lucid.profile.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const allowed = [
      'enabled',
      'experience_level',
      'preferred_technique',
      'ui_mode',
      'obsidian_export_enabled',
      'onboarding_completed',
      'preferred_layout',
    ]
    const patch: Record<string, any> = {}
    for (const k of allowed) {
      if (k in body) patch[k] = body[k]
    }
    patch.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('lucid_user_profile')
      .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ profile: data })
  } catch (e: any) {
    console.error('[lucid.profile.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
