/**
 * /api/circles/templates — GET liste des 7 templates V1 actifs
 *
 * Spec : 1_CERCLE_BIBLE.md §3.1 + 3_CERCLE_TECHNICAL.md §4.2
 * Public lecture (auth required Tier 2 mais aucune logique user).
 *
 * Renvoie : { templates: TemplateDefinition[] } triés par display_order asc.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('circle_template_definitions')
      .select(
        `slug, name, short_description, long_description,
         default_intention, default_sub_intentions,
         default_circle_type, default_privacy_mode,
         suggested_max_members, k_anon_threshold,
         trauma_aware, trauma_subtypes, pseudo_greek_letter_forced,
         rituals_suggested, ephemeral_default_days,
         voice_style_hint, ai_tone, glyph, display_order, notes`
      )
      .eq('active', true)
      .order('display_order', { ascending: true })

    if (error) throw error

    return NextResponse.json({ templates: data || [] })
  } catch (e: any) {
    console.error('[circles/templates GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
