import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/user/export
 *   → Renvoie un JSON complet des données de l'utilisateur : ses kaïros (rêves + moments),
 *     ses notes de jour, et ses annotations/sens personnels.
 *
 * Sert Réglages → Mes données → « Exporter tout » (SPEC §8 R1).
 * Principe (fiche « Tes données ») : tu peux tout emporter, quand tu veux, sans permission.
 *
 * Best-effort par table : si une table optionnelle n'existe pas encore ou renvoie une
 * erreur, on l'ignore et on exporte le reste plutôt que de planter l'export entier.
 *
 * Le fichier est renvoyé avec un Content-Disposition d'attachement pour que le
 * navigateur/wrapper propose directement l'enregistrement.
 *
 * Yeshua (Opus), 2026-07-11.
 */
export const maxDuration = 60

async function safeSelect(
  supabase: ReturnType<typeof createServerClient>,
  table: string,
  columns: string,
  userId: string,
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) {
      console.warn(`[user/export] table "${table}" ignorée:`, error.message)
      return []
    }
    return data || []
  } catch (e: any) {
    console.warn(`[user/export] table "${table}" exception:`, e?.message)
    return []
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const [kairos, dayNotes, annotations, meanings] = await Promise.all([
      safeSelect(
        supabase,
        'kairos',
        'id, title, kairos_type, raw_text, raw_text_lang, created_at, numinosity_score, user_marked_numinous, motif_tags, archetypal_tags, figures, place_label, dominant_emotion, affective_valence, dream_ego_stance, life_themes, synthesis_text',
        userId,
      ),
      safeSelect(supabase, 'life_journal_entries', '*', userId),
      safeSelect(supabase, 'kairos_user_annotations', '*', userId),
      safeSelect(supabase, 'user_meaning_layer', '*', userId),
    ])

    const payload = {
      export_version: 1,
      generated_at: new Date().toISOString(),
      app: 'Dream',
      note:
        'Ceci est l’intégralité de tes dépôts Dream. Tout t’appartient. Garde ce fichier où tu veux.',
      user: { id: userId },
      counts: {
        kairos: kairos.length,
        notes_de_jour: dayNotes.length,
        annotations: annotations.length,
        sens_personnels: meanings.length,
      },
      kairos,
      notes_de_jour: dayNotes,
      annotations,
      sens_personnels: meanings,
    }

    const body = JSON.stringify(payload, null, 2)
    const stamp = new Date().toISOString().slice(0, 10)
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="dream-export-${stamp}.json"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e: any) {
    console.error('[user/export] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
