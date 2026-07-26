/**
 * /api/dream-chat/discoverability/check — F.4 (2026-04-28)
 *
 * Spec : 2_DESIGN.md §11.bis.20.18 (discoverability progressive via dialogue chat,
 *        plus de modales aux 3e/7e/14e/30e dépôts).
 *
 * POST → vérifie le count de kairos du user authentifié.
 *   Si count atteint un palier (3, 7, 14, 30) ET qu'aucun pending_proactive_message
 *   de la category correspondante n'a été délivré, crée une intervention proactive.
 *
 *   3  → 'discoverability_journal'   → propose Journal de Vie
 *   7  → 'discoverability_cercle'    → propose Cercle
 *   14 → 'discoverability_anima'     → propose Anima Mundi
 *   30 → 'discoverability_portrait'  → propose Portrait (Lettre du moment)
 *
 * Appelé au mount du chat (best-effort, fail-soft) ET disponible en batch via
 * forwarding from threads/detect cron job.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

export const maxDuration = 30

type Tier = {
  threshold: number
  category: string
  content: string
}

const TIERS: Tier[] = [
  {
    threshold: 3,
    category: 'discoverability_journal',
    content:
      "3 dépôts. Veux-tu que je te montre comment ils éclairent ta vie de jour ? Tu peux ouvrir le Journal de Vie — un espace lumineux pour tisser tes signes diurnes avec tes rêves de la nuit.",
  },
  {
    threshold: 7,
    category: 'discoverability_cercle',
    content:
      "Tu déposes régulièrement. Tu pourrais aussi rejoindre un cercle pour partager — choisis ce que tu veux montrer, à qui, quand. Rien n'est jamais public par défaut.",
  },
  {
    threshold: 14,
    category: 'discoverability_anima',
    content:
      "Anima Mundi — le rêve du monde — t'attend. Anonymisé, c'est l'écho collectif de ce qui se passe dans la psyché des autres.",
  },
  {
    threshold: 30,
    category: 'discoverability_portrait',
    content:
      "Une lettre du moment — ta lecture personnelle tissée — peut être convoquée. Veux-tu que je te tisse ton premier Portrait ?",
  },
]

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const auth = await requireAuth(req, body)
  if ('error' in auth) return auth.error
  const { userId } = auth

  try {
    const supabase = createServerClient()

    // 1️⃣ Compte le total de kairos du user
    const { count, error: countErr } = await supabase
      .from('kairos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countErr) {
      return NextResponse.json({ proposed: 0, error: countErr.message }, { status: 200 })
    }
    const total = count || 0

    // 2️⃣ Pour chaque palier ATTEINT (>= threshold), vérifier qu'il n'a pas déjà été
    //     proposé (delivered_at IS NOT NULL OR pending). On crée la 1re intervention
    //     non encore proposée pour ce user (1 par appel, pour ne pas spam au mount).
    let proposedCategory: string | null = null

    for (const tier of TIERS) {
      if (total < tier.threshold) continue

      const { data: existing } = await supabase
        .from('pending_proactive_messages')
        .select('id')
        .eq('user_id', userId)
        .eq('category', tier.category)
        .limit(1)

      if (existing && existing.length > 0) continue // déjà proposé (delivered ou pending)

      // Crée l'intervention
      const { error: insertErr } = await supabase
        .from('pending_proactive_messages')
        .insert({
          user_id: userId,
          scheduled_for: new Date().toISOString(),
          category: tier.category,
          content: tier.content,
          context_kairos_ids: [],
        })

      if (!insertErr) {
        proposedCategory = tier.category
        break // 1 seule intervention nouvelle par check
      }
    }

    return NextResponse.json({
      total_kairos: total,
      proposed: proposedCategory ? 1 : 0,
      proposed_category: proposedCategory,
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ proposed: 0, _error: msg }, { status: 200 })
  }
}
