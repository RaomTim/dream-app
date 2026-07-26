/**
 * /api/circles/templates/[slug]/use — POST crée un cercle pré-rempli depuis template
 *
 * Spec : 1_CERCLE_BIBLE.md §3.1 + 3_CERCLE_TECHNICAL.md §4.2 §11.bis.20.11
 *
 * Body :
 *   {
 *     customName?: string,         // override template.name (sinon "Cercle <name>")
 *     customIntention?: string,    // override template.default_intention
 *     customSubIntentions?: string[],  // override sub_intentions (max 3)
 *     displayName?: string,        // pseudonyme du créateur dans circle_members
 *   }
 *
 * Effets :
 *   - INSERT circles (template_slug, trauma_aware, k_anon_threshold,
 *     pseudo_greek_letter_forced, ephemeral_until si template éphémère, ...)
 *   - INSERT circle_members (créateur = guardian, fondateur)
 *
 * Renvoie 201 { circle, template_slug }.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import crypto from 'crypto'

function generateInviteCode(): string {
  return crypto.randomBytes(3).toString('hex').toUpperCase() // 6 hex chars
}

type TemplateRow = {
  slug: string
  name: string
  default_intention: string
  default_sub_intentions: string[] | null
  default_circle_type: string
  suggested_max_members: number
  k_anon_threshold: number
  trauma_aware: boolean
  pseudo_greek_letter_forced: boolean
  ephemeral_default_days: number | null
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const slug = (params.slug || '').toLowerCase().trim()
    if (!slug) {
      return NextResponse.json({ error: 'slug required' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 1. Charge le template
    const { data: tplData, error: tplErr } = await supabase
      .from('circle_template_definitions')
      .select(
        `slug, name, default_intention, default_sub_intentions,
         default_circle_type, suggested_max_members, k_anon_threshold,
         trauma_aware, pseudo_greek_letter_forced, ephemeral_default_days`
      )
      .eq('slug', slug)
      .eq('active', true)
      .maybeSingle()

    if (tplErr) throw tplErr
    if (!tplData) {
      return NextResponse.json({ error: 'template inconnu ou inactif' }, { status: 404 })
    }
    const tpl = tplData as TemplateRow

    // 2. Construit le payload cercle
    const customName = typeof body.customName === 'string' ? body.customName.trim() : ''
    const customIntention = typeof body.customIntention === 'string' ? body.customIntention.trim() : ''
    const customSubArr = Array.isArray(body.customSubIntentions)
      ? body.customSubIntentions.filter((s: any) => typeof s === 'string' && s.trim()).slice(0, 3)
      : []

    const finalName = customName || tpl.name
    const finalIntention = customIntention || tpl.default_intention
    const finalSubIntentions =
      customSubArr.length > 0 ? customSubArr : tpl.default_sub_intentions || []

    const ephemeralUntil = tpl.ephemeral_default_days
      ? new Date(Date.now() + tpl.ephemeral_default_days * 86400000).toISOString()
      : null

    const intentionHistory =
      tpl.default_circle_type === 'intentionnel'
        ? [
            {
              set_at: new Date().toISOString(),
              set_by: userId,
              intention: finalIntention,
              sub_intentions: finalSubIntentions,
              source: 'template',
              template_slug: tpl.slug,
            },
          ]
        : null

    const inviteCode = generateInviteCode()

    const insertPayload: Record<string, unknown> = {
      name: finalName,
      created_by: userId,
      invite_code: inviteCode,
      max_members: tpl.suggested_max_members,
      type: tpl.default_circle_type,
      intention_text: tpl.default_circle_type === 'intentionnel' ? finalIntention : null,
      intention_history: intentionHistory,
      template_slug: tpl.slug,
      trauma_aware: tpl.trauma_aware,
      k_anon_threshold: tpl.k_anon_threshold,
      pseudo_greek_letter_forced: tpl.pseudo_greek_letter_forced,
      ephemeral_until: ephemeralUntil,
    }

    const { data: circle, error: createErr } = await supabase
      .from('circles')
      .insert(insertPayload)
      .select()
      .single()

    if (createErr) throw createErr

    // 3. Auto-join créateur (gardien fondateur)
    const { error: joinErr } = await supabase
      .from('circle_members')
      .insert({
        circle_id: circle.id,
        user_id: userId,
        role: 'guardian',
        display_name: typeof body.displayName === 'string' ? body.displayName : null,
      })

    if (joinErr) {
      // rollback : drop le cercle pour éviter orphan
      await supabase.from('circles').delete().eq('id', circle.id)
      throw joinErr
    }

    return NextResponse.json(
      {
        circle: { ...circle, my_role: 'guardian', member_count: 1 },
        template_slug: tpl.slug,
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error('[circles/templates/use POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
