import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'
import { createServerClient } from '@/lib/supabase'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { ATTACHMENT_BUCKET } from '@/lib/kairos-attachments'
import { runKairosEnrichmentPipeline } from '@/lib/kairos/pipeline'
import type { DreamLang } from '@/lib/req-lang'
import {
  splitForTranscription,
  PART_MAX_BYTES,
  PART_MAX_SECONDS,
  TRANSCRIBE_MAX_BYTES,
  TRANSCRIBE_MAX_SECONDS,
} from '@/lib/audio-split'

/**
 * /api/mvp/repair-capture-audio — LE RAIL DE REPRISE **SERVEUR** (§A1 couche 2, reste A8).
 * ══════════════════════════════════════════════════════════════════════════════════════
 * CE QU'IL RÉPARE, ET POURQUOI IL A FALLU L'ÉCRIRE.
 * `safeguardRecording` met la voix en Storage et crée une ligne `capture_audio`
 * AVANT que le rêve n'existe. Si le chemin rapide échoue (transcription en panne,
 * app tuée, batterie morte), la reprise existante est **entièrement côté client** :
 * `startAutoFlush` relance toutes les 30 s… mais seulement si le rêveur rouvre l'app.
 *
 * `/api/mvp/enrich-batch` — le seul filet serveur du projet — ne regarde QUE
 * `kairos.numinosity_pending`. Il ne connaît pas `capture_audio` : un audio dont
 * aucun kairos n'est né lui est invisible. Résultat, sans cette route : un rêveur
 * qui ne rouvre jamais l'app garde sa voix en sécurité (elle est en Storage,
 * référencée, avec sa clé) mais **aucun rêve n'apparaît jamais dans son journal**.
 *
 * CE QU'ELLE FAIT, dans cet ordre, pour chaque ligne éligible :
 *   1. télécharge l'audio depuis le Storage (service role) ;
 *   2. transcrit (retry 2s/4s/8s) si `transcript` est vide ;
 *   3. crée le kairos avec `client_dedup_id = local_id` ;
 *   4. rattache l'audio (`kairos_attachments` kind='audio') et pose `kairos_id`.
 *
 * POURQUOI IL N'Y A AUCUN RISQUE DE DOUBLON. `client_dedup_id = local_id`, et
 * `POST /api/kairos` dé-duplique sur cette clé. Si le rêveur rouvre l'app plus
 * tard et que sa file locale reposte le même dépôt, il retombe sur le même kairos.
 * La clé qui recolle tout : `entry.id` (IndexedDB) == `kairos.client_dedup_id`
 * == `capture_audio.local_id`. Ici on insère en direct (service role, pas de
 * session HTTP disponible dans un cron) : la dé-duplication est donc refaite à la
 * main avant l'insert, sur la même colonne.
 *
 * ÉLIGIBILITÉ — délibérément étroite :
 *   `kairos_id IS NULL`  ET  `created_at < now() - 15 min`  ET
 *   `transcription_status IN ('pending','failed')`.
 * Les 15 minutes laissent au chemin rapide et au flush client tout le temps de
 * gagner : on ne veut pas créer un rêve pendant que le rêveur est encore sur
 * l'écran de vérification. `abandoned` (8 tentatives épuisées) est exclu — c'est
 * le rêveur qui reprend la main depuis `<PendingDeposits>`, pas la machine.
 *
 * LES DEUX INDEX PARTIELS SONT DÉJÀ EN BASE (migration
 * `a1_capture_audio_registry_and_transcription_status`, A1) :
 *   (transcription_status, created_at) WHERE status IN ('pending','failed')
 *   (created_at)                       WHERE kairos_id IS NULL
 * Ils ont été créés POUR cette requête. Elle est la raison de leur existence.
 *
 * ┌─ CONTRAT ───────────────────────────────────────────────────────────────────┐
 * │ GET  ?cron_secret=…&limit=5   → cron Vercel, toutes les 10 min              │
 * │ POST { secret, limit }        → opératoire / debug                          │
 * │   → 200 { scanned, repaired[], failed[], skipped[], remaining }             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ⚠️ CE QU'ELLE NE FAIT JAMAIS : supprimer un audio, vider un champ, ou marquer
 * une ligne `abandoned`. Elle n'écrit que pour AJOUTER. Un rêve à demi réparé
 * vaut infiniment mieux qu'un rêve nettoyé.
 *
 * Yeshua (Opus), agent A8, 2026-07-26 — le reste explicite de A1 §4.1.
 */
export const maxDuration = 300

const REPAIR_SECRET = 'dream-repair-9c41be07-2f6a-4a13-8f5e-7d0c34ab9e12'

/** Laisser au chemin rapide et au flush client le temps de gagner. */
const MIN_AGE_MINUTES = 15
/** Au-delà, la machine cesse d'insister : le rêveur reprend la main (<PendingDeposits>). */
const MAX_TOTAL_ATTEMPTS = 8

/** Morceaux transcrits de front (cf. /api/transcribe-from-storage). */
const CONCURRENCY = 3

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
const asLang = (v: unknown): DreamLang => (v === 'en' ? 'en' : 'fr')

/** Retry + backoff 2s/4s/8s — même modèle que /api/transcribe-from-storage. */
async function transcribeBuffer(buffer: Uint8Array, name: string, mime: string, hint: string, maxRetries = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const audioFile = await toFile(Buffer.from(buffer), name, { type: mime })
      const tr = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'gpt-4o-transcribe',
        prompt: hint,
        response_format: 'text',
      })
      return typeof tr === 'string' ? tr : ((tr as any).text || String(tr))
    } catch (err: any) {
      const retryable = err.message?.includes('Connection error')
        || err.message?.includes('ECONNRESET')
        || err.message?.includes('timeout')
        || err.message?.includes('ETIMEDOUT')
        || err.status === 429 || err.status === 503 || err.status === 500
      if (!retryable || attempt === maxRetries) {
        throw new Error(`Whisper a échoué après ${attempt} tentative(s) : ${err.message}`)
      }
      await sleep(Math.pow(2, attempt) * 1000)
    }
  }
  throw new Error(`Whisper : retries épuisés pour ${name}`)
}

async function runRepair(limit: number) {
  const supabase = createServerClient()
  const cutoff = new Date(Date.now() - MIN_AGE_MINUTES * 60_000).toISOString()

  const { data: rows, error } = await supabase
    .from('capture_audio')
    .select('id, user_id, local_id, storage_path, mime, kind, kairos_type, capture_method, transcript, transcription_status, transcription_attempts, duration_sec')
    .is('kairos_id', null)
    .in('transcription_status', ['pending', 'failed'])
    .lt('created_at', cutoff)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) return { error: error.message }

  const repaired: string[] = []
  const failed: { local_id: string; reason: string }[] = []
  const skipped: { local_id: string; reason: string }[] = []

  for (const row of rows || []) {
    try {
      if ((row.transcription_attempts || 0) >= MAX_TOTAL_ATTEMPTS) {
        skipped.push({ local_id: row.local_id, reason: 'tentatives épuisées — au rêveur de reprendre' })
        continue
      }

      // ── Le rêve existe peut-être déjà (flush client tardif) : on ne recrée rien,
      //    on se contente de recoller le lien manquant. C'est le cas le plus fréquent.
      const { data: already } = await supabase
        .from('kairos')
        .select('id')
        .eq('user_id', row.user_id)
        .eq('client_dedup_id', row.local_id)
        .maybeSingle()

      let kairosId: string | null = already?.id || null
      let transcript = (row.transcript || '').trim()

      // La langue du rêveur. Un cron n'a personne au bout du fil (pas de header
      // `X-Dream-Lang`) : la seule source honnête est le `dreamer_lang` déjà gravé
      // sur ses rêves précédents (migration kairos_dreamer_lang, 2026-07-11).
      // Sans ça on enrichirait en français le rêve d'un rêveur anglophone — c'est
      // exactement l'erreur qu'`enrich-batch` avait faite avant le fix du 11/07.
      const { data: langRow } = await supabase
        .from('kairos')
        .select('dreamer_lang')
        .eq('user_id', row.user_id)
        .not('dreamer_lang', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      const lang = asLang(langRow?.dreamer_lang)

      if (!kairosId) {
        // ── 1-2. transcrire si nécessaire ────────────────────────────────────
        if (transcript.length < 3) {
          const attempts = (row.transcription_attempts || 0) + 1
          await supabase.from('capture_audio')
            .update({ transcription_attempts: attempts, transcription_started_at: new Date().toISOString(), updated_at: new Date().toISOString() })
            .eq('id', row.id)

          const { data: file, error: dlErr } = await supabase.storage
            .from(ATTACHMENT_BUCKET)
            .download(row.storage_path)
          if (dlErr || !file) throw new Error(`téléchargement impossible : ${dlErr?.message || 'aucune donnée'}`)

          const buf = new Uint8Array(await file.arrayBuffer())
          if (buf.length < 800) {
            await supabase.from('capture_audio')
              .update({ transcription_status: 'failed', transcription_error: 'audio vide', transcription_started_at: null, updated_at: new Date().toISOString() })
              .eq('id', row.id)
            skipped.push({ local_id: row.local_id, reason: 'audio vide' })
            continue
          }

          const hint = lang === 'en'
            ? 'Dream told on waking, voice sometimes slurred. English or French — detect the language actually spoken and transcribe it faithfully, never translate. Do not fix the style.'
            : 'Récit de rêve au réveil, voix parfois pâteuse. Français ou anglais — détecte la langue réellement parlée et transcris-la fidèlement, jamais de traduction. Ne corrige pas le style.'

          const ext = row.storage_path.split('.').pop() || 'webm'
          const mime = row.mime || 'audio/webm'

          // B2 2026-07-26 — DÉCOUPE DANS LE CONTENEUR, plus jamais aux octets.
          // Avant : tout ce qui dépassait 25 Mo était « reprise manuelle », donc
          // abandonné en silence. Un rêve d'1 h est maintenant transcrit en 4
          // morceaux de 19 min dont les horloges repartent de zéro. Aucun
          // ré-encodage : les octets audio partent tels quels.
          const split = splitForTranscription(buf, { maxBytes: PART_MAX_BYTES, maxSeconds: PART_MAX_SECONDS })
          if (!split.splittable && (buf.length > TRANSCRIBE_MAX_BYTES || (split.totalSeconds ?? 0) > TRANSCRIBE_MAX_SECONDS)) {
            // On ne bricole pas un conteneur qu'on ne sait pas lire. L'audio reste
            // en Storage, réécoutable et exportable par le rêveur.
            skipped.push({ local_id: row.local_id, reason: `conteneur ${split.container} non découpable, ${Math.round(buf.length / 1048576)} Mo — la voix est gardée, transcription impossible d'un bloc` })
            continue
          }
          if (split.totalSeconds && !row.duration_sec) {
            await supabase.from('capture_audio')
              .update({ duration_sec: Math.round(split.totalSeconds) })
              .eq('id', row.id)
          }

          const pieces: string[] = new Array(split.parts.length).fill('')
          for (let i = 0; i < split.parts.length; i += CONCURRENCY) {
            const wave = split.parts.slice(i, i + CONCURRENCY)
            const done = await Promise.all(
              wave.map((part, k) => transcribeBuffer(part.bytes, `capture_${i + k}.${ext}`, mime, hint))
            )
            done.forEach((txt, k) => { pieces[i + k] = (txt || '').trim() })
          }
          transcript = pieces.filter(Boolean).join('\n\n').trim()

          if (transcript.length < 3) {
            await supabase.from('capture_audio')
              .update({ transcription_status: 'failed', transcription_error: 'transcription vide', transcription_started_at: null, updated_at: new Date().toISOString() })
              .eq('id', row.id)
            failed.push({ local_id: row.local_id, reason: 'transcription vide' })
            continue
          }

          await supabase.from('capture_audio').update({
            transcript,
            transcription_status: 'done',
            transcription_error: null,
            transcription_started_at: null,
            updated_at: new Date().toISOString(),
          }).eq('id', row.id)
        }

        // ── 3. créer le rêve ─────────────────────────────────────────────────
        // `client_dedup_id = local_id` : si le rêveur rouvre l'app et que sa file
        // reposte, POST /api/kairos retombera sur CE kairos. Aucun doublon possible.
        const { data: created, error: insErr } = await supabase
          .from('kairos')
          .insert({
            user_id: row.user_id,
            raw_text: transcript,
            kairos_type: row.kairos_type || 'reve',
            capture_method: row.capture_method || (row.kind === 'day' ? 'mvp_jour' : 'mvp'),
            numinosity_pending: true,
            client_dedup_id: row.local_id,
            dreamer_lang: lang,
          })
          .select('id')
          .single()
        if (insErr || !created) throw new Error(`création du rêve impossible : ${insErr?.message || 'aucun id'}`)
        kairosId = created.id
      }

      // ── 4. rattacher l'audio (idempotent) ──────────────────────────────────
      const { data: existingAttach } = await supabase
        .from('kairos_attachments')
        .select('id')
        .eq('kairos_id', kairosId)
        .eq('storage_path', row.storage_path)
        .maybeSingle()
      if (!existingAttach) {
        await supabase.from('kairos_attachments')
          .insert({ kairos_id: kairosId, kind: 'audio', storage_path: row.storage_path })
      }
      await supabase.from('capture_audio')
        .update({ kairos_id: kairosId, updated_at: new Date().toISOString() })
        .eq('id', row.id)

      // ── 5. enrichir — best-effort. Le cron enrich-batch reprendra de toute façon,
      //      `numinosity_pending` reste true tant que le pipeline n'a pas fini.
      try {
        await runKairosEnrichmentPipeline({
          supabaseService: supabase,
          userId: row.user_id,
          kairosId: kairosId!,
          lang,
        })
      } catch (e: any) {
        console.warn('[repair-capture-audio] enrichissement différé pour', kairosId, e?.message || e)
      }

      repaired.push(row.local_id)
    } catch (e: any) {
      const reason = String(e?.message || e).slice(0, 300)
      console.error('[repair-capture-audio]', row.local_id, reason)
      await supabase.from('capture_audio')
        .update({ transcription_status: 'failed', transcription_error: reason, transcription_started_at: null, updated_at: new Date().toISOString() })
        .eq('id', row.id)
      failed.push({ local_id: row.local_id, reason })
    }
  }

  const { count } = await supabase
    .from('capture_audio')
    .select('id', { count: 'exact', head: true })
    .is('kairos_id', null)
    .in('transcription_status', ['pending', 'failed'])
    .lt('created_at', cutoff)

  return { scanned: (rows || []).length, repaired, failed, skipped, remaining: count ?? -1 }
}

export async function OPTIONS() { return corsOptions() }

/** Cron Vercel — toutes les 10 min (vercel.json). */
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('cron_secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const limit = Math.min(10, Math.max(1, parseInt(req.nextUrl.searchParams.get('limit') || '5') || 5))
  return NextResponse.json(await runRepair(limit))
}

/** Opératoire / debug. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    if (body.secret !== REPAIR_SECRET) {
      return corsify(NextResponse.json({ error: 'unauthorized' }, { status: 401 }))
    }
    const limit = Math.min(20, Math.max(1, parseInt(body.limit) || 5))
    return corsify(NextResponse.json(await runRepair(limit)))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e?.message || 'failed' }, { status: 500 }))
  }
}
