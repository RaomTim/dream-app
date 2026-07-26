import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/onboarding
 *
 * Persona qualification + base settings. Crée/upsert lucid_user_profile.
 * Active la chambre Lucid (enabled=true) ET marque onboarding_completed=true.
 *
 * Body :
 *   {
 *     experience_level: 'curieux' | 'praticien' | 'contemplatif',
 *     chosen_path: 'presence_eveillee' | 'pratique_technique' | 'voies_contemplatives',
 *     trauma_aware?: boolean,           // si true → désactive WBTB/SSILD agressifs
 *     layout_preference?: 'tabs_5' | 'dream_ambient',
 *     preferred_technique?: 'mild' | 'wbtb_mild' | 'ssild' | 'wild' | 'fild' | 'spontane'
 *   }
 *
 * Returns : { profile, gateway_unlocked: boolean }
 *
 * Cohérent 2_LUCID_DESIGN §3 onboarding 3 écrans + 1_LUCID_BIBLE §4.4 garde-fous.
 *
 * Auteur : Yeshua, 2026-04-28.
 */

const VALID_LEVELS = ['curieux', 'praticien', 'contemplatif']
const VALID_PATHS = ['presence_eveillee', 'pratique_technique', 'voies_contemplatives']
const VALID_LAYOUT = ['tabs_5', 'dream_ambient']
const VALID_TECHNIQUE = ['mild', 'wbtb_mild', 'ssild', 'wild', 'fild', 'spontane', 'MILD', 'WBTB', 'WILD', 'SSILD', 'DILD']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const experience_level = VALID_LEVELS.includes(body.experience_level)
      ? body.experience_level
      : null
    const chosen_path = VALID_PATHS.includes(body.chosen_path) ? body.chosen_path : null

    if (!experience_level || !chosen_path) {
      return NextResponse.json(
        { error: 'experience_level + chosen_path required' },
        { status: 400 }
      )
    }

    const trauma_aware = body.trauma_aware === true
    const layout = VALID_LAYOUT.includes(body.layout_preference)
      ? body.layout_preference
      : 'tabs_5'

    // Si chosen_path = voies_contemplatives → on n'active PAS les techniques
    // d'induction agressives (cohérent 1_LUCID_BIBLE §3.3 Yann persona)
    const isContemplative = chosen_path === 'voies_contemplatives'
    const preferred_technique = VALID_TECHNIQUE.includes(body.preferred_technique)
      ? String(body.preferred_technique).toLowerCase()
      : null

    // Trauma-aware caps (cohérent §4.4 red lines)
    const wbtb_weekly_max = trauma_aware ? 0 : 4
    const rc_daily_max = trauma_aware ? 3 : 5

    const supabase = createServerClient()

    const patch: any = {
      user_id: userId,
      enabled: true,
      experience_level,
      chosen_path,
      trauma_aware_mode: trauma_aware,
      preferred_layout: layout,
      ui_mode: layout === 'dream_ambient' ? 'dream_ambient' : 'tabs_5',
      preferred_technique: isContemplative ? null : preferred_technique,
      onboarding_completed: true,
      wbtb_weekly_max,
      rc_daily_max,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('lucid_user_profile')
      .upsert(patch, { onConflict: 'user_id' })
      .select('*')
      .single()

    if (error) throw error

    return NextResponse.json({
      profile: data,
      gateway_unlocked: true,
      trauma_caps_applied: trauma_aware,
      voies_contemplatives_redirect:
        isContemplative
          ? 'Pour le dream yoga, voir lignées vivantes — Ligmincha (Wangyal Rinpoché) ou Namkhai Norbu Sangha. Dream App offre un cadre laïc complémentaire.'
          : null,
    })
  } catch (e: any) {
    console.error('[lucid.onboarding.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
