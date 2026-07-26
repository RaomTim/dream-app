/**
 * /api/circles/[id]/rituals — Liste & création de rituels collectifs (C.8)
 *
 * Spec : 2_DESIGN.md §11.bis.20.11 (rituels collectifs proposables)
 *        Bible 1_BIBLE.md §3.4.1 sources Forêt :
 *          - Council Process (Coyle/Zimmerman) — talking stick async
 *          - Theory U (Scharmer) — 4 mouvements suspending/redirecting/letting_go/letting_come
 *          - Council 4 voix (Aizenstat) sur un rêve commun (dreamer/protector/soul/shadow)
 *          - Lightning Dreamwork (Moss) en groupe sur un rêve d'un membre
 *
 * Async-first : window_hours par défaut 48h, chacun contribue à son rythme.
 *
 * GET   → liste rituels du cercle (open + active + closed récents)
 * POST  { ritual_type, title?, prompt_seed?, target_kairos_id?, window_hours? }
 *       → créer un rituel proposé. proposed_by = userId.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-server'
import { createServerClient } from '@/lib/supabase'

const VALID_TYPES = new Set(['council', 'theory_u', 'council_4_voix', 'lightning_group'])

const RITUAL_PHASES: Record<string, string[]> = {
  council: ['open', 'phase_1', 'closed'],                           // 1 phase de tour de parole
  theory_u: ['open', 'phase_1', 'phase_2', 'phase_3', 'phase_4', 'closed'],
  council_4_voix: ['open', 'phase_1', 'phase_2', 'phase_3', 'phase_4', 'closed'],
  lightning_group: ['open', 'phase_1', 'phase_2', 'phase_3', 'closed'],
}

const PHASE_DEFINITIONS: Record<string, { phase: string; title: string; prompt: string }[]> = {
  council: [
    {
      phase: 'phase_1',
      title: 'Tour de parole',
      prompt:
        "Chacun·e prend la parole à son tour. Pas de réponse aux autres — on dépose, on écoute en silence ce que les autres déposent. On peut passer son tour.",
    },
  ],
  theory_u: [
    {
      phase: 'phase_1',
      title: 'Suspending — voir avec des yeux nouveaux',
      prompt: 'Quel jugement tiens-tu sur ce qui se passe ? Mets-le à distance. Décris la situation comme si tu la voyais pour la première fois.',
    },
    {
      phase: 'phase_2',
      title: 'Redirecting — voir depuis le tout',
      prompt: "Si tu te déplaces d'un cran, vers le tout du système, qu'est-ce que tu vois ? Quel rôle joue le cercle dans cela ?",
    },
    {
      phase: 'phase_3',
      title: 'Letting go — laisser tomber le contrôle',
      prompt: "Qu'est-ce qui voudrait s'en aller ? Quelle vieille forme demande à mourir ?",
    },
    {
      phase: 'phase_4',
      title: 'Letting come — laisser émerger',
      prompt: 'Qu\'est-ce qui voudrait advenir si on faisait silence ? Quelle question, quelle image, quel acte ?',
    },
  ],
  council_4_voix: [
    {
      phase: 'phase_1',
      title: 'Voix du rêveur',
      prompt: 'Décris le rêve comme tu l\'as vécu, à la première personne. Qu\'est-ce qui s\'est passé pour toi ?',
    },
    {
      phase: 'phase_2',
      title: 'Voix du protecteur',
      prompt: "Quelque chose dans le rêve protège. Que dirait-elle, cette part qui veille ?",
    },
    {
      phase: 'phase_3',
      title: 'Voix de l\'âme',
      prompt: "Si l'âme du rêve avait une parole — pas une explication, une parole — quelle serait-elle ?",
    },
    {
      phase: 'phase_4',
      title: "Voix de l'ombre",
      prompt: "Ce qui n'a pas été dit, ce qui a été refusé, ce qui résiste à être nommé — que dit cela ?",
    },
  ],
  lightning_group: [
    {
      phase: 'phase_1',
      title: 'Le rêve déposé',
      prompt: 'Le rêveur partage le rêve à voix nue. Pas d\'analyse, pas de commentaire. Juste les images, les figures, les sensations.',
    },
    {
      phase: 'phase_2',
      title: 'Si c\'était mon rêve',
      prompt: '"Si c\'était mon rêve…" — chaque autre membre prend le rêve comme s\'il était le sien et dit ce qu\'il y trouverait. Pas de "tu devrais", uniquement "moi je".',
    },
    {
      phase: 'phase_3',
      title: 'Le rêveur reprend',
      prompt: 'Le rêveur dit ce qu\'il garde — pas par politesse, par résonance. Et peut-être un acte qui honore le rêve.',
    },
  ],
}

async function isMember(
  supabase: ReturnType<typeof createServerClient>,
  circleId: string,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const { data: rituals, error } = await supabase
      .from('circle_rituals')
      .select(
        'id, circle_id, proposed_by, ritual_type, title, prompt_seed, target_kairos_id, current_phase, scheduled_at, window_hours, started_at, closed_at, metadata, created_at, updated_at'
      )
      .eq('circle_id', params.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Récupère les counts participants en bulk
    const ids = (rituals || []).map((r: any) => r.id)
    let participantsMap = new Map<string, number>()
    let myParticipationMap = new Map<string, boolean>()
    if (ids.length > 0) {
      const { data: parts } = await supabase
        .from('circle_ritual_participants')
        .select('ritual_id, user_id, status')
        .in('ritual_id', ids)
      for (const p of parts || []) {
        const r = String((p as any).ritual_id)
        participantsMap.set(r, (participantsMap.get(r) || 0) + 1)
        if (String((p as any).user_id) === String(userId)) myParticipationMap.set(r, true)
      }
    }

    const enriched = (rituals || []).map((r: any) => ({
      ...r,
      phases_definition: PHASE_DEFINITIONS[r.ritual_type] || [],
      participant_count: participantsMap.get(String(r.id)) || 0,
      i_joined: myParticipationMap.get(String(r.id)) || false,
    }))

    return NextResponse.json({ rituals: enriched })
  } catch (e: any) {
    console.warn('[circle/rituals GET] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const ritualType = typeof body.ritual_type === 'string' ? body.ritual_type : ''
    if (!VALID_TYPES.has(ritualType)) {
      return NextResponse.json(
        { error: "ritual_type invalide. attendu: 'council' | 'theory_u' | 'council_4_voix' | 'lightning_group'" },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    if (!(await isMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Non membre de ce cercle' }, { status: 403 })
    }

    const title = typeof body.title === 'string' ? body.title.trim().slice(0, 200) : null
    const promptSeed = typeof body.prompt_seed === 'string' ? body.prompt_seed.trim().slice(0, 1500) : null
    const targetKairosId = typeof body.target_kairos_id === 'string' ? body.target_kairos_id : null
    const windowHours = Number.isFinite(body.window_hours) ? Math.min(Math.max(parseInt(body.window_hours, 10), 1), 168) : 48
    const scheduledAt = typeof body.scheduled_at === 'string' && body.scheduled_at ? body.scheduled_at : null

    // Pour council_4_voix + lightning_group on s'attend à un kairos cible
    if ((ritualType === 'council_4_voix' || ritualType === 'lightning_group') && !targetKairosId) {
      return NextResponse.json(
        { error: `${ritualType} requiert un target_kairos_id (rêve cible)` },
        { status: 400 }
      )
    }

    const { data: ritual, error } = await supabase
      .from('circle_rituals')
      .insert({
        circle_id: params.id,
        proposed_by: userId,
        ritual_type: ritualType,
        title,
        prompt_seed: promptSeed,
        target_kairos_id: targetKairosId,
        current_phase: 'open',
        scheduled_at: scheduledAt,
        window_hours: windowHours,
        metadata: { phases: RITUAL_PHASES[ritualType] || [] },
      })
      .select(
        'id, circle_id, proposed_by, ritual_type, title, prompt_seed, target_kairos_id, current_phase, scheduled_at, window_hours, started_at, closed_at, metadata, created_at, updated_at'
      )
      .single()

    if (error) throw error

    // Le proposeur est auto-joined
    await supabase
      .from('circle_ritual_participants')
      .insert({ ritual_id: ritual.id, user_id: userId, status: 'joined' })
      .then(undefined, () => {
        /* idempotent ignore */
      })

    return NextResponse.json(
      {
        ritual: {
          ...ritual,
          phases_definition: PHASE_DEFINITIONS[ritualType] || [],
          participant_count: 1,
          i_joined: true,
        },
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.warn('[circle/rituals POST] failed:', e?.message)
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
