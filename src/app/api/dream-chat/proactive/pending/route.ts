/**
 * /api/dream-chat/proactive/pending — F.1 (2026-04-28)
 *
 * Spec : 2_DESIGN.md §11.bis.20.7 + boucle ouverte L4 du LOG soir 2026-04-28.
 *
 * GET → liste les pending_proactive_messages non délivrés (delivered_at IS NULL)
 *       du user authentifié, scheduled_for <= now(), ordre chronologique.
 *
 * Le frontend (DreamChatHome) appelle cette route au mount EN PARALLÈLE
 * de GET /converse pour récupérer toute intervention proactive en attente
 * (thread_proposed, discoverability, sanctuaire, etc.) et l'afficher en HEAD
 * du chat avec boutons d'action.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req)
  if ('error' in auth) return auth.error
  const { userId } = auth

  try {
    const supabase = createServerClient()
    const nowIso = new Date().toISOString()

    const { data, error } = await supabase
      .from('pending_proactive_messages')
      .select('id, category, content, context_kairos_ids, context_thread_id, scheduled_for, created_at')
      .eq('user_id', userId)
      .is('delivered_at', null)
      .lte('scheduled_for', nowIso)
      .order('scheduled_for', { ascending: true })
      .limit(20)

    if (error) {
      // Table peut-être pas existante — fallback gracieux
      return NextResponse.json({ messages: [], _warning: error.message })
    }

    return NextResponse.json({ messages: data || [] })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ messages: [], _error: msg }, { status: 200 })
  }
}

// ════════════════════════════════════════════════════════════════════
// POST — Sprint F (2026-04-28) — mark delivered OR check discoverability
// ════════════════════════════════════════════════════════════════════
// Modes :
//   POST { id: string } → marque ce message comme delivered (au moment où user le voit)
//   POST { check_discoverability: true } → check seuils 3/7/14/30 dépôts
//                                          + crée pending si nouveau seuil franchi
//                                          (à appeler post-dépôt kairos)

const DISCOVERY_THRESHOLDS = [
  { count: 3, content_prefix: 'Tu as déposé 3 fois maintenant', content: "Tu as déposé 3 fois maintenant. Sais-tu que tu peux aussi tenir un Journal de Vie en parallèle ? Le jour éclaire la nuit, la nuit éclaire le jour. Veux-tu y jeter un œil ?" },
  { count: 7, content_prefix: 'Sept dépôts. Une régularité', content: "Sept dépôts. Une régularité s'installe. Tu peux maintenant rejoindre un Cercle pour partager — choisis ce que tu veux montrer, à qui, quand. Cercles d'amis, de famille, de traversée commune." },
  { count: 14, content_prefix: 'Quatorze dépôts. L\'Anima Mundi', content: "Quatorze dépôts. L'Anima Mundi t'attend — c'est l'écho collectif anonymisé de ce qui traverse les psychés des autres rêveurs. Pas pour te perdre dans les autres. Pour sentir que tu n'es pas seul." },
  { count: 30, content_prefix: 'Trente dépôts. Tu as un terreau', content: "Trente dépôts. Tu as un terreau maintenant. Veux-tu que je tisse ton premier Portrait — une lettre qui dit qui tu es en ce moment, depuis ce que tu déposes ?" },
]

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  const supabase = createServerClient()

  // Mode 1 — mark delivered
  if (typeof body.id === 'string') {
    const { error } = await supabase
      .from('pending_proactive_messages')
      .update({ delivered_at: new Date().toISOString() })
      .eq('id', body.id)
      .eq('user_id', userId)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ marked: true })
  }

  // Mode 2 — check discoverability seuils
  if (body.check_discoverability === true) {
    const { count } = await supabase
      .from('kairos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    const kairosCount = count || 0

    const created: number[] = []
    for (const t of DISCOVERY_THRESHOLDS) {
      if (kairosCount < t.count) continue
      // Anti-doublon : check si on a déjà créé un pending pour ce seuil
      const { data: existing } = await supabase
        .from('pending_proactive_messages')
        .select('id')
        .eq('user_id', userId)
        .ilike('content', t.content_prefix + '%')
        .limit(1)
      if (existing && existing.length > 0) continue

      await supabase.from('pending_proactive_messages').insert({
        user_id: userId,
        scheduled_for: new Date().toISOString(),
        category: 'pattern_emerging',
        content: t.content,
      })
      created.push(t.count)
    }
    return NextResponse.json({ kairos_count: kairosCount, thresholds_triggered: created })
  }

  return NextResponse.json({ error: 'invalid action — use { id } or { check_discoverability: true }' }, { status: 400 })
}
