import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/kairos/[id]/aha-feedback
 *
 * Refonte KairosDetail (2026-04-25) — stocke le retour FELT_SHIFT_GATE +
 * AHA_CAPTURE après une lecture de la Forêt / un écho / un conte.
 *
 * Bible §3.5 (FELT_SHIFT_GATE) + §3.7 (AHA_CAPTURE → couche d'apprentissage
 * personnelle qui pondère lectures futures).
 *
 * Body :
 *   {
 *     reading_kind: "forest" | "echo" | "tale" | "user_first",
 *     felt_shift_location?: "gorge" | "poitrine" | "ventre" | "nuque" | "ailleurs" | "aucune" | "rien",
 *     aha_level?: "fort" | "peut-etre" | "non",
 *     aha_note?: string,
 *     forest_reading_angles?: jsonb (snapshot des 3 angles touchés)
 *   }
 *
 * Persiste dans `user_validations` (extended 2026-04-25).
 */

const FELT_SHIFT_VALUES = ['gorge', 'poitrine', 'ventre', 'nuque', 'ailleurs', 'aucune', 'rien'] as const
const AHA_LEVELS = ['fort', 'peut-etre', 'non'] as const
const READING_KINDS = ['forest', 'echo', 'tale', 'user_first'] as const

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const reading_kind = body.reading_kind
    if (!READING_KINDS.includes(reading_kind)) {
      return NextResponse.json(
        { error: `reading_kind invalide (attendu : ${READING_KINDS.join(' | ')})` },
        { status: 400 },
      )
    }

    const validation = body.aha_level && AHA_LEVELS.includes(body.aha_level)
      ? body.aha_level
      : 'peut-etre'

    const insert: Record<string, any> = {
      user_id: userId,
      context_type: 'kairos:' + reading_kind,
      context_id: params.id,
      validation,
      reading_kind,
    }

    if (typeof body.felt_shift_location === 'string' &&
      FELT_SHIFT_VALUES.includes(body.felt_shift_location)) {
      insert.felt_shift_location = body.felt_shift_location
    }
    if (typeof body.aha_level === 'string' && AHA_LEVELS.includes(body.aha_level)) {
      insert.aha_level = body.aha_level
    }
    if (typeof body.aha_note === 'string' && body.aha_note.trim()) {
      insert.aha_note = body.aha_note.trim().slice(0, 1000)
    }
    if (body.forest_reading_angles && typeof body.forest_reading_angles === 'object') {
      insert.forest_reading_angles = body.forest_reading_angles
    }
    if (typeof body.proposition_voix === 'string' && body.proposition_voix.trim()) {
      insert.proposition_voix = body.proposition_voix.trim().slice(0, 500)
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('user_validations')
      .insert(insert)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ validation: data, ok: true })
  } catch (e: any) {
    console.error('[kairos/aha-feedback POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
