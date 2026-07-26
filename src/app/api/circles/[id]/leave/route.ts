import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-04-25 — Yeshua
 * DELETE /api/circles/[id]/leave
 *
 * Quitter un cercle. Pattern soft : on ne supprime pas la ligne circle_members
 * (pour préserver l'historique de tenue) — on pose `left_at = now()`.
 * Si jamais la colonne n'est pas présente (vieux schéma), on tombe sur DELETE.
 *
 * Si l'user est gardien (créateur) ET qu'il est le dernier membre actif,
 * on archive le cercle (`is_active = false`) au lieu de juste partir.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const circleId = params.id

    // Vérifier la membership active
    const { data: member, error: memErr } = await supabase
      .from('circle_members')
      .select('id, role')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .is('left_at', null)
      .maybeSingle()

    if (memErr) throw memErr
    if (!member) {
      return NextResponse.json({ error: 'Not a member of this circle' }, { status: 404 })
    }

    // Soft-leave : poser left_at
    const nowIso = new Date().toISOString()
    const { error: updateErr } = await supabase
      .from('circle_members')
      .update({ left_at: nowIso })
      .eq('id', member.id)

    if (updateErr) {
      // Fallback : si la colonne left_at n'existe pas → DELETE
      if (
        String(updateErr.message || '').toLowerCase().includes('column') &&
        String(updateErr.message || '').toLowerCase().includes('left_at')
      ) {
        const { error: delErr } = await supabase
          .from('circle_members')
          .delete()
          .eq('id', member.id)
        if (delErr) throw delErr
      } else {
        throw updateErr
      }
    }

    // Compter les membres actifs restants
    const { count: remainingCount } = await supabase
      .from('circle_members')
      .select('id', { count: 'exact', head: true })
      .eq('circle_id', circleId)
      .is('left_at', null)

    // Si plus personne, archiver le cercle (soft, préserve les restitutions)
    let archived = false
    if (!remainingCount || remainingCount === 0) {
      await supabase
        .from('circles')
        .update({ is_active: false, archived_at: nowIso })
        .eq('id', circleId)
      archived = true
    }

    return NextResponse.json({
      ok: true,
      circle_id: circleId,
      remaining_members: remainingCount || 0,
      circle_archived: archived,
    })
  } catch (e: any) {
    console.error('Circle leave error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
