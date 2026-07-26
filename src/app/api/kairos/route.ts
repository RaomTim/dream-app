import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { runKairosEnrichmentPipeline } from '@/lib/kairos/pipeline'
import { waitUntil } from '@vercel/functions'
import { reqLang } from '@/lib/req-lang'
import { normalizeDreamDateInput } from '@/lib/kairos/dream-date'

/**
 * POST /api/kairos
 *
 * Body: { raw_text, kairos_type?, capture_method?, mark_numinous? }
 *
 * Crée un kairos avec raw_text + métadonnées initiales.
 * Le pipeline d'enrichissement est lancé EN ARRIÈRE-PLAN (fire-and-forget).
 * Le kairos_id est retourné immédiatement (UX < 2s, latence rituelle assumée
 * pour le reste).
 *
 * Le client peut polling GET /api/kairos/[id] toutes les ~3s pour voir
 * synthesis_text apparaître.
 *
 * Auteur : Yeshua, 2026-04-25.
 */
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.raw_text || typeof body.raw_text !== 'string' || body.raw_text.trim().length < 3) {
      return NextResponse.json({ error: 'raw_text required (min 3 chars)' }, { status: 400 })
    }

    const supabase = createServerClient()

    // 2026-07-22 (offline-first) — IDEMPOTENCE. La file d'attente offline (offline-queue.ts)
    // peut ré-émettre un dépôt après une reconnexion : si le même `client_dedup_id` a déjà
    // créé un kairos, on renvoie l'existant au lieu d'un doublon. Dégrade proprement si la
    // colonne n'est pas encore en base (migration 2026-07-22_kairos_client_dedup.sql) : le
    // SELECT échoue → on ignore la dé-duplication et l'insert suit son cours normal.
    const clientDedupId =
      typeof body.client_dedup_id === 'string' && /^[0-9a-f-]{8,}$/i.test(body.client_dedup_id)
        ? body.client_dedup_id
        : null
    if (clientDedupId) {
      try {
        const { data: dup } = await supabase
          .from('kairos')
          .select('id, created_at, kairos_type, raw_text')
          .eq('user_id', userId)
          .eq('client_dedup_id', clientDedupId)
          .maybeSingle()
        if (dup?.id) {
          return NextResponse.json(
            {
              kairos: {
                id: dup.id,
                created_at: dup.created_at,
                kairos_type: dup.kairos_type,
                raw_text: dup.raw_text,
                enrichment_status: 'pending',
              },
              deduplicated: true,
            },
            { status: 200 }
          )
        }
      } catch {
        /* colonne absente : on ignore la dé-duplication */
      }
    }

    const kairosType = body.kairos_type || 'reve'
    const captureMethod = body.capture_method || 'text'

    // Insert kairos minimal — pipeline va le compléter
    const insertRow: any = {
      user_id: userId,
      raw_text: body.raw_text.trim(),
      kairos_type: kairosType,
      capture_method: captureMethod,
      user_marked_numinous: body.mark_numinous === true,
      numinosity_pending: true,
    }

    // 2026-07-26 (B4 — le rêve à rebours) : la DATE DU RÊVE, distincte de la date
    // de dépôt. `dream_date_shortcut` porte le geste courant (« cette nuit » par
    // défaut, un tap pour dire autre chose) ; le couple dream_date/precision porte
    // le cas rare. `created_at` n'est JAMAIS dérivé de là : le dépôt reste le dépôt.
    Object.assign(insertRow, normalizeDreamDateInput(body))

    // 2026-07-11 — Scanner (A5) : override de date facultatif (« Choisir une date »).
    // ⚠️ DÉPRÉCIÉ depuis B4 : réécrire created_at faisait mentir la date de dépôt et
    // c'est exactement ce qui a produit les faux échos anciens. On le traduit
    // désormais en dream_date, et on laisse created_at tranquille. Le champ reste
    // accepté pour ne casser aucun client déjà déployé.
    if (typeof body.created_at === 'string' && !isNaN(Date.parse(body.created_at)) && !insertRow.dream_date) {
      const d = new Date(body.created_at)
      insertRow.dream_date = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
      insertRow.dream_date_precision = 'night'
      insertRow.dream_date_source = 'user'
    }

    // 2026-07-12 — Plusieurs rêves par nuit (§12bis.D) : quand l'écran « Ta nuit »
    // sépare une nuit, chaque rêve est posté avec le MÊME night_group_id (uuid) et
    // le même created_at. Rêve isolé (cas courant) = pas de champ → colonne NULL.
    // ⚠️ Requiert la migration supabase-migrations/2026-07-12_night_group.sql.
    if (typeof body.night_group_id === 'string' && /^[0-9a-f-]{8,}$/i.test(body.night_group_id)) {
      insertRow.night_group_id = body.night_group_id
    }

    // 2026-07-11 (i18n) — on GRAVE la langue du rêveur sur le kairos. Sans ça, le cron
    // de rattrapage (enrich-batch) n'a aucun moyen de la connaître : pas de header, pas
    // de rêveur au bout du fil → il enrichirait en français un rêve anglophone.
    // Colonne appliquée en prod le 2026-07-11 (migration kairos_dreamer_lang).
    insertRow.dreamer_lang = reqLang(req)

    // Grave la clé d'idempotence (si fournie). Voir dé-duplication plus haut.
    if (clientDedupId) insertRow.client_dedup_id = clientDedupId

    let { data: created, error: insErr } = await supabase
      .from('kairos')
      .insert(insertRow)
      .select('id, created_at, kairos_type, raw_text')
      .single()

    // Filet migration : si `client_dedup_id` ou les colonnes B4 (dream_date…)
    // n'existent pas encore en base, on réinsère SANS ces champs plutôt que de
    // bloquer le dépôt du rêveur. Un rêve perdu est irrattrapable ; une colonne
    // manquante se rattrape.
    if (
      insErr &&
      /client_dedup_id|dream_date|column .* does not exist|42703|PGRST204/i.test(`${insErr.message} ${(insErr as any).code || ''}`)
    ) {
      const {
        client_dedup_id, dream_date, dream_date_precision, dream_date_label, dream_date_source,
        ...minimal
      } = insertRow
      ;({ data: created, error: insErr } = await supabase
        .from('kairos')
        .insert(minimal)
        .select('id, created_at, kairos_type, raw_text')
        .single())
    }

    if (insErr || !created) {
      console.error('[kairos.POST] insert failed:', insErr?.message)
      return NextResponse.json({ error: insErr?.message || 'insert failed' }, { status: 500 })
    }

    // 2026-07-11 — Scanner (A5) : lie la/les photo(s) déjà uploadées par /api/mvp/scan
    // à ce kairos, une fois qu'il existe. Best-effort — une pièce jointe manquante
    // ne doit jamais faire échouer la création du dépôt.
    const attachmentPaths: string[] = Array.isArray(body.attachment_storage_paths)
      ? body.attachment_storage_paths.filter((p: any) => typeof p === 'string' && p)
      : typeof body.attachment_storage_path === 'string' && body.attachment_storage_path
        ? [body.attachment_storage_path]
        : []
    if (attachmentPaths.length) {
      const { error: attErr } = await supabase
        .from('kairos_attachments')
        .insert(attachmentPaths.map((storage_path) => ({ kairos_id: created.id, kind: 'photo', storage_path })))
      if (attErr) console.error('[kairos.POST] attachment link failed (non bloquant):', attErr.message)
    }

    // Enrichissement en arrière-plan — waitUntil garde la fonction vivante jusqu'à la fin
    // du pipeline (survit au cut serverless Vercel). Filet de sécurité : cron enrich-batch
    // rattrape ceux qui dépassent maxDuration (numinosity_pending reste true).
    // La langue du rêveur voyage jusqu'à l'extraction : le titre, la question du rêve et
    // la ligne « ce qui insiste » sortent dans SA langue, pas dans celle de son texte.
    waitUntil(runKairosEnrichmentPipeline({
      supabaseService: supabase,
      userId,
      kairosId: created.id,
      lang: reqLang(req),
    }).catch((err) => {
      console.error('[kairos.POST] enrichment failed:', err)
    }))

    return NextResponse.json(
      {
        kairos: {
          id: created.id,
          created_at: created.created_at,
          kairos_type: created.kairos_type,
          raw_text: created.raw_text,
          enrichment_status: 'pending',
        },
      },
      { status: 201 }
    )
  } catch (e: any) {
    console.error('[kairos.POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

/**
 * GET /api/kairos
 *
 * List user's kairos with pagination + filters.
 *
 * Query params:
 *   - kairos_type (optional)
 *   - from / to (ISO date)
 *   - limit (default 30, max 100)
 *   - cursor (created_at ISO, for pagination)
 *   - numinous_only=true → numinosity_score >= 0.7
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    const { searchParams } = new URL(req.url)
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '30'))
    const cursor = searchParams.get('cursor')
    const kairosType = searchParams.get('kairos_type')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const numinousOnly = searchParams.get('numinous_only') === 'true'

    // 2026-07-12 — night_group_id est ajouté au select (badge « nuit du … », §12bis.D).
    // Filet de sécurité : si la migration 2026-07-12_night_group.sql n'est pas encore
    // appliquée (colonne absente), on relit SANS elle plutôt que de casser tout le
    // Journal. Aucun deploy gate dur — le badge apparaîtra une fois la migration passée.
    // 2026-07-26 (B4 — le rêve à rebours) : le journal est ordonné et filtré sur
    // `occurred_at` (= quand le rêve a EU LIEU), plus sur `created_at` (= quand il
    // a été déposé). Un rêve d'avant-hier déposé ce matin se range avant-hier.
    // `occurred_at` est une colonne GÉNÉRÉE qui vaut created_at tant qu'aucune date
    // de rêve n'est posée → aucun changement pour les rêves déjà en base.
    // Tri secondaire sur created_at : deux rêves de la même nuit gardent l'ordre
    // dans lequel ils ont été racontés (occurred_at est à minuit pour les deux).
    const BASE_COLS = 'id, title, kairos_type, raw_text, raw_text_lang, created_at, numinosity_score, numinosity_pending, synthesis_tier, motif_tags, archetypal_tags, soul_season_id, user_marked_numinous, figures, place_label, dominant_emotion, affective_valence, dream_ego_stance, life_themes'
    const DATE_COLS = 'occurred_at, occurred_at_reliable, dream_date, dream_date_precision, dream_date_label'
    const buildQuery = (cols: string, sortCol: string) => {
      let q = supabase
        .from('kairos')
        .select(cols, { count: 'exact' })
        .eq('user_id', userId)
        .order(sortCol, { ascending: false })
        .limit(limit + 1) // +1 to detect next cursor
      if (sortCol !== 'created_at') q = q.order('created_at', { ascending: false })
      if (cursor) q = q.lt(sortCol, cursor)
      if (kairosType) q = q.eq('kairos_type', kairosType)
      if (from) q = q.gte(sortCol, from)
      if (to) q = q.lte(sortCol, to)
      if (numinousOnly) q = q.gte('numinosity_score', 0.7)
      return q
    }

    const missingCol = (e: any) =>
      /occurred_at|dream_date|night_group_id|column .* does not exist|42703/i.test(`${e?.message} ${e?.code || ''}`)

    let { data, error, count } = await buildQuery(`${BASE_COLS}, night_group_id, ${DATE_COLS}`, 'occurred_at')
    if (error && missingCol(error)) {
      // Filet migration : tant que les colonnes B4 ne sont pas en base, on retombe
      // sur l'ancien tri par date de dépôt plutôt que de casser tout le Journal.
      ;({ data, error, count } = await buildQuery(`${BASE_COLS}, night_group_id`, 'created_at'))
    }
    if (error && missingCol(error)) {
      ;({ data, error, count } = await buildQuery(BASE_COLS, 'created_at'))
    }
    if (error) throw error

    const rows: any[] = (data as any[]) || []
    const items = rows.slice(0, limit)
    const last = items[items.length - 1]
    const nextCursor = rows.length > limit ? (last?.occurred_at ?? last?.created_at) : null

    return NextResponse.json({
      kairos: items,
      total: count,
      next_cursor: nextCursor,
    })
  } catch (e: any) {
    console.error('[kairos.GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
