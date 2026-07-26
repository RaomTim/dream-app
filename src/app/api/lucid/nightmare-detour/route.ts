import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/lucid/nightmare-detour
 *
 * Si un kairos est marqué is_lucid=true ET valence_at_recognition < -0.6
 * (forte détresse), redirige le user vers le Sanctuaire Cauchemars/Deuil
 * AU LIEU de proposer "résoudre cauchemar en lucide" (red line absolue
 * 1_LUCID_BIBLE §4.2 anti-spiritual-bypass).
 *
 * Body : { kairos_id, valence?: number, intention_was_to_resolve?: bool }
 *
 * Returns :
 *   {
 *     detour_required: bool,
 *     redirect_to: 'sanctuaire' | null,
 *     carry_over_context: { kairos_id, raw_excerpt, motif_tags },
 *     exit_to_human_visible: bool
 *   }
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairos_id = body.kairos_id
    if (!kairos_id) {
      return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })
    }

    const supabase = createServerClient()

    const { data: k } = await supabase
      .from('kairos')
      .select('id, raw_text, motif_tags, archetypal_tags')
      .eq('id', kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    if (!k) return NextResponse.json({ error: 'kairos not found' }, { status: 404 })

    // Vérifier valence dans metadata (si déjà détectée par pipeline) OU body
    const { data: meta } = await supabase
      .from('lucid_kairos_metadata')
      .select('is_lucid, valence_at_recognition, sleep_paralysis_anxiety')
      .eq('kairos_id', kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    const isLucid = meta?.is_lucid === true
    const valence = body.valence !== undefined ? Number(body.valence) : meta?.valence_at_recognition
    const spAnxiety = meta?.sleep_paralysis_anxiety || 0

    // Conditions de detour (cohérent §4.2 + §8.3 1_LUCID_BIBLE) :
    // - kairos lucide ET valence très négative
    // - OU sleep paralysis avec anxiety >= 7
    // - OU motif cauchemar dans tags
    const motifs = Array.isArray(k.motif_tags) ? k.motif_tags : []
    const isNightmareTagged = motifs.some(
      (t: string) =>
        /cauchemar|nightmare|terreur|menace|deuil|grief/i.test(String(t || ''))
    )

    const valenceNegative = typeof valence === 'number' && valence < -0.6
    const intentionToResolve = body.intention_was_to_resolve === true

    const detour_required =
      (isLucid && (valenceNegative || isNightmareTagged)) ||
      spAnxiety >= 7 ||
      (intentionToResolve && (valenceNegative || isNightmareTagged))

    // Carry-over context : juste le minimum, anti-extraction
    const excerpt = (k.raw_text || '').slice(0, 300)

    return NextResponse.json({
      detour_required,
      redirect_to: detour_required ? 'sanctuaire' : null,
      carry_over_context: detour_required
        ? {
            kairos_id: k.id,
            raw_excerpt: excerpt,
            motif_tags: motifs,
          }
        : null,
      exit_to_human_visible: detour_required,
      message: detour_required
        ? 'Ce rêve porte une charge. La chambre Lucid se met en silence ici. Le Sanctuaire est plus juste — avec sortie vers humain visible.'
        : null,
    })
  } catch (e: any) {
    console.error('[lucid.nightmare-detour.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
