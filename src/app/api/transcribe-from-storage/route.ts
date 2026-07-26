import { NextRequest, NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, CORS_HEADERS } from '@/lib/mvp-cors'
import { reqLang } from '@/lib/req-lang'
import { ATTACHMENT_BUCKET } from '@/lib/kairos-attachments'
import {
  splitForTranscription,
  PART_MAX_BYTES,
  PART_MAX_SECONDS,
  TRANSCRIBE_MAX_BYTES,
  TRANSCRIBE_MAX_SECONDS,
} from '@/lib/audio-split'

/**
 * /api/transcribe-from-storage — TRANSCRIRE SANS JAMAIS PORTER L'AUDIO.
 * ════════════════════════════════════════════════════════════════════════════════
 * Le corps de cette requête fait ~200 octets : un chemin Storage. Aucune limite
 * de 4,5 Mo ne s'y applique. C'est le SERVEUR qui va chercher l'audio, dans une
 * fonction qui a 300 s pour travailler.
 *
 * ┌─ LA DURÉE MAXIMALE, DITE UNE FOIS POUR TOUTES (B2, 2026-07-26) ─────────────┐
 * │                                                                             │
 * │ CHEMIN RAPIDE  /api/transcribe (le blob traverse Vercel)                    │
 * │   plafond = 4,5 Mo de CORPS DE REQUÊTE, imposé par la plateforme.           │
 * │   → Opus 64 kbps mono (8 ko/s)  : 4,5 Mo ÷ 8 ko/s  ≈ **9 min 20**           │
 * │   → AAC 128 kbps mono (16 ko/s) : 4,5 Mo ÷ 16 ko/s ≈ **4 min 40**           │
 * │   Ce chemin n'est qu'un raccourci de confort pour les captures courtes.     │
 * │                                                                             │
 * │ CHEMIN D'ARCHIVE  Storage → cette route                                     │
 * │   plafond de taille  : AUCUN (l'audio ne passe jamais par Vercel ;          │
 * │                        le bucket est plafonné à 100 Mo par fichier).        │
 * │   plafond de l'IA    : 25 Mo ET **1400 s** par APPEL — mesuré le 26/07 :    │
 * │                        « audio duration 2400.0 seconds is longer than 1400  │
 * │                          seconds which is the maximum for this model ».     │
 * │   → on ne lui envoie donc JAMAIS le fichier : on lui envoie des morceaux    │
 * │     de 19 min découpés dans le conteneur (`splitForTranscription`).         │
 * │   → **DURÉE MAXIMALE : illimitée** pour webm/opus, mp4 fragmenté et wav.    │
 * │     1 h = 4 morceaux. 3 h = 10 morceaux. Le seul vrai plafond devient les   │
 * │     300 s d'exécution de la fonction : à ~13 s par morceau de 19 min et 3   │
 * │     morceaux en parallèle, ça tient très au-delà de 3 h. Et si ça ne tient  │
 * │     pas : la ligne reste `pending`, l'audio est intact, le cron reprend.    │
 * │                                                                             │
 * │   Conteneur inconnu (mp4 NON fragmenté, codec exotique) : on ne bricole     │
 * │   pas. Plafond = min(25 Mo, 1400 s) et on le DIT. L'original reste entier.  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ⚠️ RÈGLE : on ne ré-encode JAMAIS, on ne dégrade JAMAIS ce qu'on envoie à l'IA.
 * Les morceaux contiennent les octets audio d'origine, bit pour bit ; seules les
 * horloges du conteneur sont réécrites. L'original en Storage n'est jamais touché.
 *
 * Modèle de départ : `/api/dreams/import-from-storage` (téléchargement, retry
 * backoff 2s/4s/8s). Différences ASSUMÉES :
 *   1. bucket `kairos-attachments` (privé, owner-only) et non `dream-imports` ;
 *   2. la LANGUE n'est pas forcée — on restitue ce qui a été DIT ;
 *   3. l'audio n'est PAS supprimé après transcription : c'est le mémo vocal du
 *      rêveur, il reste.
 *
 * ┌─ CONTRAT ───────────────────────────────────────────────────────────────────┐
 * │ POST { storage_path, local_id? }                                            │
 * │   → 200 { ok:true, text, status:'done', attempts, parts, duration_sec }      │
 * │   → 200 { ok:false, status:'failed'|'abandoned'|'in_progress', error, … }    │
 * │        200 VOLONTAIRE : l'échec de transcription N'EST PAS une perte.        │
 * │   → 4xx uniquement pour auth / chemin invalide / audio absent.               │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Yeshua (Opus) — A1 le 2026-07-26, refondu par B2 le même jour.
 */
export const maxDuration = 300

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

/** Au-delà, on cesse de retenter automatiquement : le rêveur reprend la main (UI de récupération). */
const MAX_TOTAL_ATTEMPTS = 8
/** Morceaux transcrits de front. 3 = ~13 s de mur pour 57 min d'audio. */
const CONCURRENCY = 3
/**
 * Verrou anti-double-dépense : si une tentative a commencé il y a moins de ça,
 * un second appel (client qui réessaie + cron qui passe) ne repaie pas l'IA.
 */
const IN_PROGRESS_LOCK_MS = 6 * 60_000

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS, 'Access-Control-Allow-Methods': 'POST, OPTIONS' },
  })
}

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

/** Transcrit un morceau avec retry + backoff exponentiel — 3 tentatives, 2s/4s/8s. */
async function transcribeBuffer(
  buffer: Uint8Array,
  name: string,
  mime: string,
  hint: string,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const audioFile = await toFile(Buffer.from(buffer), name, { type: mime })
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'gpt-4o-transcribe',
        prompt: hint,
        response_format: 'text',
      })
      const text = typeof transcription === 'string'
        ? transcription
        : (transcription as any).text || String(transcription)
      console.log(`[transcribe-from-storage] OK ${name} (essai ${attempt}) : ${text.length} car.`)
      return text
    } catch (err: any) {
      const isRetryable = err.message?.includes('Connection error')
        || err.message?.includes('ECONNRESET')
        || err.message?.includes('timeout')
        || err.message?.includes('ETIMEDOUT')
        || err.status === 429
        || err.status === 503
        || err.status === 500

      console.error(`[transcribe-from-storage] essai ${attempt}/${maxRetries} ÉCHOUÉ pour ${name}:`, err.message, err.status)

      if (!isRetryable || attempt === maxRetries) {
        throw new Error(`Whisper a échoué après ${attempt} tentative(s) : ${err.message}`)
      }
      await sleep(Math.pow(2, attempt) * 1000)
    }
  }
  throw new Error(`Whisper : retries épuisés pour ${name}`)
}

/** Transcrit les morceaux par vagues de CONCURRENCY, en conservant leur ORDRE. */
async function transcribeParts(
  parts: { bytes: Uint8Array }[],
  ext: string,
  mime: string,
  hint: string
): Promise<string> {
  const out: string[] = new Array(parts.length).fill('')
  for (let i = 0; i < parts.length; i += CONCURRENCY) {
    const wave = parts.slice(i, i + CONCURRENCY)
    const done = await Promise.all(
      wave.map((p, k) => transcribeBuffer(p.bytes, `capture_${i + k}.${ext}`, mime, hint))
    )
    done.forEach((txt, k) => { out[i + k] = (txt || '').trim() })
  }
  return out.filter(Boolean).join('\n\n')
}

export async function POST(req: NextRequest) {
  let supabase: ReturnType<typeof createServerClient> | null = null
  let storagePath = ''
  let userId = ''
  let attempts = 0

  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    userId = auth.userId

    storagePath = typeof body?.storage_path === 'string' ? body.storage_path.trim() : ''
    if (!storagePath) {
      return corsify(NextResponse.json({ error: 'storage_path requis' }, { status: 400 }))
    }
    // Le 1er segment du chemin EST l'user_id (convention du bucket). Le service
    // role bypasse la RLS : cette vérification est la seule barrière.
    if (!storagePath.startsWith(`${userId}/`) || storagePath.includes('..')) {
      return corsify(NextResponse.json({ error: 'chemin refusé' }, { status: 403 }))
    }

    supabase = createServerClient()

    const { data: row } = await supabase
      .from('capture_audio')
      .select('id, transcription_attempts, transcript, transcription_status, transcription_started_at, mime, duration_sec')
      .eq('user_id', userId)
      .eq('storage_path', storagePath)
      .maybeSingle()

    // Déjà transcrit : on rend le texte, on ne repaie pas l'IA.
    if (row?.transcription_status === 'done' && row?.transcript) {
      return corsify(NextResponse.json({ ok: true, text: row.transcript, status: 'done', attempts: row.transcription_attempts, cached: true }))
    }

    // Une transcription est déjà en cours ailleurs (le client réessaie pendant
    // que le cron travaille) : on ne paie pas deux fois le même rêve.
    const startedAt = row?.transcription_started_at ? Date.parse(row.transcription_started_at) : 0
    if (startedAt && Date.now() - startedAt < IN_PROGRESS_LOCK_MS) {
      return corsify(NextResponse.json({
        ok: false,
        status: 'in_progress',
        error: 'transcription déjà en cours — rien n\'est perdu, ça arrive',
        attempts: row?.transcription_attempts || 0,
        retryable: true,
      }))
    }

    attempts = (row?.transcription_attempts || 0) + 1
    if (row?.id) {
      await supabase.from('capture_audio')
        .update({
          transcription_attempts: attempts,
          transcription_started_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', row.id)
    }

    // ═══ Téléchargement ═══
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(ATTACHMENT_BUCKET)
      .download(storagePath)

    if (downloadError || !fileData) {
      return corsify(NextResponse.json(
        { error: `Téléchargement impossible : ${downloadError?.message || 'aucune donnée'}` },
        { status: 404 }
      ))
    }

    const audioBytes = new Uint8Array(await fileData.arrayBuffer())
    if (audioBytes.length < 800) {
      if (row?.id) {
        await supabase.from('capture_audio')
          .update({ transcription_status: 'failed', transcription_error: 'audio vide', transcription_started_at: null, updated_at: new Date().toISOString() })
          .eq('id', row.id)
      }
      return corsify(NextResponse.json({ ok: false, status: 'failed', error: 'audio vide', attempts }))
    }

    const mime = row?.mime || 'audio/webm'
    const ext = storagePath.split('.').pop() || 'webm'
    const lang = reqLang(req)
    const hint = lang === 'en'
      ? 'Dream told on waking, voice sometimes slurred. English or French — detect the language actually spoken and transcribe it faithfully, never translate. Do not fix the style. If unsure between two languages, lean English.'
      : 'Récit de rêve au réveil, voix parfois pâteuse. Français ou anglais — détecte la langue réellement parlée et transcris-la fidèlement, jamais de traduction. Ne corrige pas le style. Dans le doute entre deux langues, penche pour le français.'

    // ═══ DÉCOUPE DANS LE CONTENEUR — jamais aux octets, jamais de ré-encodage ═══
    const split = splitForTranscription(audioBytes, { maxBytes: PART_MAX_BYTES, maxSeconds: PART_MAX_SECONDS })
    console.log(
      `[transcribe-from-storage] ${(audioBytes.length / 1048576).toFixed(1)} Mo · ${split.note}` +
      (split.totalSeconds ? ` · ${Math.round(split.totalSeconds)} s` : '')
    )

    // Le seul cas où l'on ne peut rien faire : conteneur non découpable ET
    // au-dessus d'un plafond de l'API. On le dit, on ne massacre pas le rêve.
    const tooBig = audioBytes.length > TRANSCRIBE_MAX_BYTES
    const tooLong = (split.totalSeconds ?? 0) > TRANSCRIBE_MAX_SECONDS
    if (!split.splittable && (tooBig || tooLong)) {
      const detail = tooBig
        ? `${Math.round(audioBytes.length / 1048576)} Mo (max 25 Mo)`
        : `${Math.round((split.totalSeconds || 0) / 60)} min (max ${Math.round(TRANSCRIBE_MAX_SECONDS / 60)} min)`
      const msg = `enregistrement de ${detail} dans un conteneur que je ne sais pas découper (${split.container}) — ta voix est intacte et gardée, mais je ne peux pas la transcrire d'un bloc`
      if (row?.id) {
        await supabase.from('capture_audio')
          .update({ transcription_status: 'failed', transcription_error: msg.slice(0, 500), transcription_started_at: null, updated_at: new Date().toISOString() })
          .eq('id', row.id)
      }
      return corsify(NextResponse.json({ ok: false, status: 'failed', error: msg, attempts, retryable: false, container: split.container }))
    }

    // La durée mesurée pendant la découpe vaut mieux que celle annoncée par le
    // client (qui peut mentir si l'app a été tuée pendant l'enregistrement).
    if (row?.id && split.totalSeconds && !row.duration_sec) {
      await supabase.from('capture_audio')
        .update({ duration_sec: Math.round(split.totalSeconds) })
        .eq('id', row.id)
    }

    let transcript = ''
    try {
      transcript = await transcribeParts(split.parts, ext, mime, hint)
    } catch (whisperErr: any) {
      const exhausted = attempts >= MAX_TOTAL_ATTEMPTS
      if (row?.id) {
        await supabase.from('capture_audio').update({
          transcription_status: exhausted ? 'abandoned' : 'failed',
          transcription_error: String(whisperErr?.message || whisperErr).slice(0, 500),
          transcription_started_at: null,
          updated_at: new Date().toISOString(),
        }).eq('id', row.id)
      }
      // 200 volontaire : l'audio est intact, ce n'est pas une perte.
      return corsify(NextResponse.json({
        ok: false,
        status: exhausted ? 'abandoned' : 'failed',
        error: String(whisperErr?.message || whisperErr),
        attempts,
        parts: split.parts.length,
        retryable: !exhausted,
      }))
    }

    const clean = (transcript || '').trim()
    if (clean.length < 3) {
      if (row?.id) {
        await supabase.from('capture_audio').update({
          transcription_status: 'failed',
          transcription_error: 'transcription vide',
          transcription_started_at: null,
          updated_at: new Date().toISOString(),
        }).eq('id', row.id)
      }
      return corsify(NextResponse.json({ ok: false, status: 'failed', error: 'transcription vide', attempts, retryable: true }))
    }

    if (row?.id) {
      await supabase.from('capture_audio').update({
        transcript: clean,
        transcription_status: 'done',
        transcription_error: null,
        transcription_started_at: null,
        updated_at: new Date().toISOString(),
      }).eq('id', row.id)
    }

    return corsify(NextResponse.json({
      ok: true,
      text: clean,
      status: 'done',
      attempts,
      parts: split.parts.length,
      container: split.container,
      duration_sec: split.totalSeconds ? Math.round(split.totalSeconds) : null,
    }))
  } catch (e: any) {
    console.error('[transcribe-from-storage]', e)
    return corsify(NextResponse.json({ error: e?.message || 'failed', attempts }, { status: 500 }))
  }
}
