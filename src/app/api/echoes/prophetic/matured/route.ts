import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/echoes/prophetic/matured — Sprint P1 (2026-04-27)
 *
 * Notification douce sur DreamHome quand un écho prophétique mûrit
 * (récurrence ≥ 3 + charge somatique cumulée ≥ 2 — déjà calculé backend
 * Type 7, marqué via `kairos.prophetic_status='awakened'`).
 *
 * Critères de sélection :
 *   - kairos.user_id = caller
 *   - kairos.prophetic_status = 'awakened'
 *   - kairos.prophetic_notified_at IS NULL  (jamais notifié)
 *   - kairos.prophetic_dismissed_at IS NULL (jamais dismiss user)
 *
 * Retourne max 1 (le plus récent par created_at DESC).
 *
 * Side-effect : marque `prophetic_notified_at = now()` après lecture
 * (idempotent — si on rappelle juste après, retournera vide).
 *
 * Note : la table canonique est `kairos` (pas `propheties` — qui n'existe
 * pas dans le schéma actuel ; le statut prophétique vit sur le kairos lui-même
 * via la colonne `prophetic_status`). Migration Sprint P1 a ajouté les
 * colonnes `prophetic_notified_at` + `prophetic_dismissed_at`.
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // Trouve le plus récent kairos awakened non-notifié non-dismiss
    const { data: rows, error: selErr } = await supabase
      .from('kairos')
      .select('id, raw_text, created_at, kairos_type, numinosity_score, prophetic_status')
      .eq('user_id', userId)
      .eq('prophetic_status', 'awakened')
      .is('prophetic_notified_at', null)
      .is('prophetic_dismissed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)

    if (selErr) throw selErr
    const row = rows && rows[0]

    if (!row) {
      return NextResponse.json({ echoes: [] })
    }

    // Side-effect : marque notified_at pour qu'on ne le re-propose pas (sauf
    // si user clique pour ouvrir le détail → là on peut le considérer "vu").
    const { error: updErr } = await supabase
      .from('kairos')
      .update({ prophetic_notified_at: new Date().toISOString() })
      .eq('id', row.id)
      .eq('user_id', userId)

    if (updErr) {
      // Non-bloquant — on retourne quand même l'écho (pire cas : ré-affichage)
      console.warn('[echoes/prophetic/matured] notified_at update failed:', updErr.message)
    }

    // Préview court (88 chars suffisent au chuchotement)
    const preview = (row.raw_text || '').slice(0, 88) + ((row.raw_text || '').length > 88 ? '…' : '')

    // Compute days_ago for the whisper string
    const ageMs = Date.now() - new Date(row.created_at).getTime()
    const daysAgo = Math.floor(ageMs / (24 * 3600 * 1000))

    return NextResponse.json({
      echoes: [
        {
          id: row.id,
          kairos_id: row.id,
          preview,
          created_at: row.created_at,
          kairos_type: row.kairos_type,
          numinosity_score: row.numinosity_score,
          days_ago: daysAgo,
          // Phrase pré-calculée côté serveur pour cohérence (le client peut surcharger)
          whisper: humanWhisper(daysAgo),
        },
      ],
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// Génère une formulation poétique douce du temps écoulé
function humanWhisper(daysAgo: number): string {
  if (daysAgo < 30) return "un kairos d'il y a quelques semaines résonne avec ta semaine"
  if (daysAgo < 90) {
    const months = Math.round(daysAgo / 30)
    return `un kairos d'il y a ${months === 1 ? 'un mois' : months + ' mois'} résonne avec ta semaine`
  }
  if (daysAgo < 365) {
    const months = Math.round(daysAgo / 30)
    return `un kairos d'il y a ${months} mois résonne avec ta semaine`
  }
  const years = Math.round(daysAgo / 365)
  return `un kairos d'il y a ${years === 1 ? 'un an' : years + ' ans'} résonne avec ta semaine`
}
