import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import {
  scoreCorpus, selectCandidates,
  FIRST_REVIEW_MAX, WEEKLY_MAX, WEEKLY_COOLDOWN_DAYS, SHORTLIST, MIN_CORPUS,
  type DetectRow,
} from '@/lib/kairos/great-dream-detect'
import { readCandidates, nameCandidates } from '@/lib/kairos/great-dream-reader'

/**
 * /api/great-dreams/candidates — L'APP PROPOSE, LE RÊVEUR DÉCIDE.
 *
 * Tim : « il faut que l'app propose de trouver et identifier les grands rêves
 * elle-même, et que l'utilisateur les reviews. »
 *
 * ── LA RÈGLE, tenue par la structure et pas seulement par la consigne ───────
 * Rien ici ne marque un rêve. POST écrit uniquement dans
 * `great_dream_candidates` (des propositions). Le seul endroit du fichier qui
 * touche `kairos.user_marked_numinous` est le PATCH, et il ne s'exécute que sur
 * une décision explicite du rêveur reçue depuis l'écran. Un candidat non reviewé
 * n'est pas un grand rêve et n'apparaît jamais dans le journal
 * (1_BIBLE §3.13.3 · TAXONOMIE-GRANDS-REVES §1.5).
 *
 * ── DEUX RÉGIMES, parce que le coût de l'erreur n'est pas le même ───────────
 *   • `first_review` — SOLLICITÉ. Le rêveur ouvre son historique et demande.
 *     C'est lui le filtre : on montre ce qui ressort (jusqu'à 7), le lecteur ne
 *     sert qu'à nommer l'image et à écarter ce qui n'est pas un rêve. Ici le
 *     faux négatif coûte plus cher que le faux positif — un rêve jamais montré
 *     ne sera jamais reconnu.
 *   • `weekly` — NON SOLLICITÉ. On dérange quelqu'un : le faux positif coûte
 *     cher. Double barrière (relief + lecteur qui a le droit de tout refuser),
 *     au plus 1, jamais deux fois dans la semaine, et le plus souvent : rien.
 *
 * ── LE RYTHME ───────────────────────────────────────────────────────────────
 * Aucune proposition sur un rêve de moins de 30 jours : jamais au réveil,
 * jamais pendant le dépôt (§3.13.1 — « un rêve devient grand plus tard »).
 * Aucune relance : un rêve écarté ne revient jamais de lui-même. Il reste
 * marquable à la main sur sa fiche, pour toujours.
 *
 * Yeshua (Opus, agent B3), 2026-07-26.
 */

export const maxDuration = 60

const SELECT_COLS =
  'id, created_at, title, raw_text, kairos_type, user_marked_numinous, numinosity_score, ' +
  'affective_intensity, motif_tags, archetypal_tags, life_themes, root_dream_patterns, ' +
  'somatic_markers, sensorial_qualities, temporal_signature, thresholds_passages, ' +
  'paradoxes_unresolved, narrative_dynamics, protocol_completed_at'

/** Ce qui part à l'écran. Volontairement pauvre : une image, un rêve, une date.
 *  Ni score, ni pourcentage, ni rang — §0.5 interdit score et classement, et un
 *  chiffre transformerait une proposition en verdict. */
function toCard(c: any, k: any) {
  return {
    id: c.id,
    kairos_id: c.kairos_id,
    image: c.image,
    title: k?.title ?? null,
    excerpt: (k?.raw_text || '').replace(/\s+/g, ' ').trim().slice(0, 280),
    created_at: k?.created_at ?? null,
    status: c.status,
  }
}

/* ─────────────────────────── GET : ce qui attend ─────────────────────────── */

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    const { data: cands, error } = await supabase
      .from('great_dream_candidates')
      .select('id, kairos_id, image, status, proposed_at, source')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('proposed_at', { ascending: false })
      .limit(20)
    if (error) throw error

    const ids = (cands || []).map(c => c.kairos_id)
    let byId: Record<string, any> = {}
    if (ids.length) {
      const { data: ks } = await supabase
        .from('kairos').select('id, title, raw_text, created_at')
        .eq('user_id', userId).in('id', ids)
      for (const k of ks || []) byId[k.id] = k
    }

    // A-t-on déjà fait la première review ? L'écran ne doit pas la reproposer
    // en boucle : on la propose une fois, elle se fait, on n'en reparle plus.
    const { count: everProposed } = await supabase
      .from('great_dream_candidates')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('source', 'first_review')

    const { count: corpus } = await supabase
      .from('kairos').select('id', { count: 'exact', head: true }).eq('user_id', userId)

    return NextResponse.json({
      candidates: (cands || []).map(c => toCard(c, byId[c.kairos_id])),
      first_review_done: (everProposed ?? 0) > 0,
      corpus_ready: (corpus ?? 0) >= MIN_CORPUS,
    })
  } catch (e: any) {
    console.error('[great-dreams.candidates.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/* ────────────── POST : chercher. Ne marque rien, jamais. ────────────── */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const mode: 'first_review' | 'weekly' = body?.mode === 'first_review' ? 'first_review' : 'weekly'
    const supabase = createServerClient()

    // 1 — le corpus. Les rêves déjà marqués RESTENT dans le calcul (ils font
    //     partie de la moyenne du rêveur) ; ils sont retirés des candidats.
    const { data: rows, error } = await supabase
      .from('kairos').select(SELECT_COLS).eq('user_id', userId).limit(2000)
    if (error) throw error
    if (!rows || rows.length < MIN_CORPUS) {
      // « Ton sol est encore peu peuplé. » Pas une erreur : un état.
      return NextResponse.json({ candidates: [], silence: true, reason: 'corpus' })
    }

    // 2 — le carry-over (Bulkeley) : ce que le rêveur a REFAIT avec le rêve.
    const { data: interps } = await supabase
      .from('kairos_interpretations').select('kairos_id').eq('user_id', userId)
    const icount = new Map<string, number>()
    for (const i of interps || []) icount.set(i.kairos_id, (icount.get(i.kairos_id) ?? 0) + 1)

    const detectRows: DetectRow[] = rows.map((r: any) => ({
      ...r,
      interpretation_count: icount.get(r.id) ?? 0,
      protocol_done: !!r.protocol_completed_at,
    }))

    // 3 — ce qui a déjà été proposé. On ne repropose JAMAIS, ni un accepté ni
    //     un écarté : pas de relance, pas de culpabilité.
    const { data: seenRows } = await supabase
      .from('great_dream_candidates').select('kairos_id').eq('user_id', userId)
    const alreadySeen = new Set((seenRows || []).map(s => s.kairos_id))

    // 4 — la cadence de croisière
    if (mode === 'weekly') {
      const since = new Date(Date.now() - WEEKLY_COOLDOWN_DAYS * 86400000).toISOString()
      const { count } = await supabase
        .from('great_dream_candidates')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('source', 'weekly').gte('proposed_at', since)
      if ((count ?? 0) >= WEEKLY_MAX) {
        return NextResponse.json({ candidates: [], silence: true, reason: 'cadence' })
      }
    }

    // 5 — le relief, puis la coupe
    const { scored, diagnostics } = scoreCorpus(detectRows)
    const shortlist = selectCandidates(scored, { alreadySeen, limit: SHORTLIST })
    if (!shortlist.length) {
      return NextResponse.json({ candidates: [], silence: true, reason: 'relief', diagnostics })
    }

    const verdicts = mode === 'first_review'
      ? await nameCandidates(shortlist)
      : await readCandidates(shortlist)

    // Panne du lecteur → on ne propose RIEN. Jamais de repli sur le classement
    // brut : un candidat non lu n'est pas un candidat, et le silence est sûr.
    if (verdicts === null) {
      return NextResponse.json({ candidates: [], silence: true, reason: 'reader_unavailable' })
    }

    const cap = mode === 'first_review' ? FIRST_REVIEW_MAX : WEEKLY_MAX
    const byId = new Map(shortlist.map(s => [s.row.id, s]))
    const chosen = verdicts
      .filter(v => byId.has(v.id))
      .sort((a, b) => (byId.get(b.id)!.relief) - (byId.get(a.id)!.relief))
      .slice(0, cap)

    if (!chosen.length) {
      return NextResponse.json({ candidates: [], silence: true, reason: 'reader' })
    }

    const payload = chosen.map(v => {
      const s = byId.get(v.id)!
      return {
        user_id: userId,
        kairos_id: v.id,
        image: v.image,
        relief: Number(s.relief.toFixed(4)),
        components: s.z as any,
        source: mode,
        status: 'pending',
      }
    })

    const { data: inserted, error: iErr } = await supabase
      .from('great_dream_candidates')
      .upsert(payload, { onConflict: 'user_id,kairos_id', ignoreDuplicates: true })
      .select('id, kairos_id, image, status')
    if (iErr) throw iErr

    const kById = new Map(rows.map((r: any) => [r.id, r]))
    return NextResponse.json({
      candidates: (inserted || []).map(c => toCard(c, kById.get(c.kairos_id))),
      silence: (inserted || []).length === 0,
      // Diagnostic, jamais affiché : permet de vérifier que le détecteur
      // n'attrape pas simplement les rêves longs (corrLengthAfter ≈ 0).
      diagnostics,
    })
  } catch (e: any) {
    console.error('[great-dreams.candidates.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/* ───────── PATCH : la décision du rêveur. Le SEUL endroit qui marque. ────── */

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const id = typeof body?.id === 'string' ? body.id : null
    const decision = body?.decision
    if (!id || (decision !== 'accepted' && decision !== 'dismissed')) {
      return NextResponse.json({ error: 'id + decision requis' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: cand, error: cErr } = await supabase
      .from('great_dream_candidates')
      .update({ status: decision, reviewed_at: new Date().toISOString() })
      .eq('id', id).eq('user_id', userId)
      .select('id, kairos_id, status')
      .maybeSingle()
    if (cErr) throw cErr
    if (!cand) return NextResponse.json({ error: 'introuvable' }, { status: 404 })

    // C'est ICI, et seulement ici, qu'un rêve entre dans le journal — sur un
    // geste explicite. Même colonne, même trigger (`marked_great_at`) que le tap
    // sur la fiche : une seule vérité, deux chemins humains vers elle.
    if (decision === 'accepted') {
      const { error: kErr } = await supabase
        .from('kairos')
        .update({ user_marked_numinous: true })
        .eq('id', cand.kairos_id).eq('user_id', userId)
      if (kErr) throw kErr
    }

    // « dismissed » ne ferme rien : on ne re-propose plus, mais le rêve reste
    // marquable à la main sur sa fiche. Un rêve peut devenir grand dans dix ans.
    return NextResponse.json({ ok: true, id: cand.id, status: cand.status })
  } catch (e: any) {
    console.error('[great-dreams.candidates.PATCH]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
