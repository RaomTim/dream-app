import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import OpenAI, { toFile } from 'openai'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/dreams/import-from-storage
 *
 * Traite UN fichier déjà uploadé dans Supabase Storage.
 * Le client upload d'abord vers storage/dream-imports/{userId}/{filename},
 * puis appelle cette route avec le chemin.
 *
 * Flow:
 * 1. Télécharge le fichier depuis Storage
 * 2. Si audio >25MB → split en chunks de 24MB (byte-slicing)
 * 3. Envoie à Whisper pour transcription (audio) ou lit directement (texte)
 * 4. Insère en DB via RPC (bypass RLS)
 * 5. Déclenche le pipeline 3 passes
 * 6. Supprime le fichier de Storage (cleanup)
 *
 * Body: { userId, storagePath, filename }
 */

export const maxDuration = 300 // Pro plan: gros fichiers = split + multi-Whisper

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

const AUDIO_EXTENSIONS = ['.m4a', '.mp3', '.wav', '.webm', '.ogg', '.mp4']
const WHISPER_MAX_SIZE = 25 * 1024 * 1024 // 25MB — Whisper API hard limit
const CHUNK_SIZE = 24 * 1024 * 1024 // 24MB par chunk (marge de sécurité)

/**
 * Split un gros fichier audio en chunks de 24MB par byte-slicing.
 * Whisper gère bien les coupures mid-stream — pas besoin de ffmpeg.
 */
function splitAudioBuffer(audioBuffer: Buffer): Buffer[] {
  const chunks: Buffer[] = []
  for (let offset = 0; offset < audioBuffer.length; offset += CHUNK_SIZE) {
    chunks.push(audioBuffer.subarray(offset, Math.min(offset + CHUNK_SIZE, audioBuffer.length)))
  }
  return chunks
}

/**
 * Pause utilitaire pour retry
 */
function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

/**
 * Transcrit un buffer audio via Whisper avec retry + exponential backoff.
 * 3 tentatives max, délai 2s → 4s → 8s entre chaque.
 */
async function transcribeBuffer(buffer: Buffer, name: string, maxRetries = 3): Promise<string> {
  console.log(`[Import] Whisper: transcribing ${name} (${Math.round(buffer.length / 1024)}KB)...`)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const audioFile = await toFile(buffer, name, { type: 'audio/mp4' })
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: 'gpt-4o-transcribe',
        language: 'fr',
        response_format: 'text',
      })
      const text = typeof transcription === 'string'
        ? transcription
        : (transcription as any).text || String(transcription)
      console.log(`[Import] Whisper OK for ${name} (attempt ${attempt}): ${text.length} chars`)
      return text
    } catch (err: any) {
      const isRetryable = err.message?.includes('Connection error')
        || err.message?.includes('ECONNRESET')
        || err.message?.includes('timeout')
        || err.message?.includes('ETIMEDOUT')
        || err.status === 429
        || err.status === 503
        || err.status === 500

      console.error(`[Import] Whisper attempt ${attempt}/${maxRetries} FAILED for ${name}:`, err.message, err.status, err.code)

      if (!isRetryable || attempt === maxRetries) {
        throw new Error(`Whisper transcription failed after ${attempt} attempts: ${err.message}`)
      }

      const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
      console.log(`[Import] Retrying ${name} in ${delay}ms...`)
      await sleep(delay)
    }
  }

  throw new Error(`Whisper transcription failed: max retries exceeded for ${name}`)
}

export async function POST(req: NextRequest) {
  let storagePath: string | null = null
  let supabase: ReturnType<typeof createServerClient> | null = null

  try {
    const body = await req.json()
    const { filename } = body
    storagePath = body.storagePath

    // ═══ MODE 1: isChunk — transcribe only, return transcript (no DB insert) ═══
    // No userId needed for chunk transcription — just audio processing
    if (body.isChunk && storagePath) {
      supabase = createServerClient()
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('dream-imports')
        .download(storagePath)

      if (downloadError || !fileData) {
        return NextResponse.json({ error: `Download failed: ${downloadError?.message}` }, { status: 500 })
      }

      const audioBuffer = Buffer.from(await fileData.arrayBuffer())
      const chunkName = body.originalFilename ? `${body.originalFilename}_chunk${body.chunkIndex}.wav` : filename
      const transcript = await transcribeBuffer(audioBuffer, chunkName)

      // Cleanup the chunk from Storage
      await supabase.storage.from('dream-imports').remove([storagePath])

      return NextResponse.json({ ok: true, transcript })
    }

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration (Modes 2 and 3 need auth)
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    // ═══ MODE 2: rawTranscript — skip transcription, just insert in DB ═══
    if (body.rawTranscript) {
      supabase = createServerClient()
      const baseUrl = req.nextUrl.origin
      const dateFromName = body.dateOverride || extractDateFromFilename(filename || 'import')

      const { data: dreamId, error: insertError } = await supabase
        .rpc('insert_imported_dream', {
          p_user_id: userId,
          p_raw_text: body.rawTranscript,
          p_entry_type: 'dream',
          p_source: 'import-audio-split',
          p_source_filename: filename || 'chunked-import',
          p_created_at: dateFromName || new Date().toISOString(),
          p_updated_at: new Date().toISOString(),
        })

      if (insertError || !dreamId) {
        return NextResponse.json(
          { error: `DB insert failed: ${insertError?.message || 'No dreamId returned'}` },
          { status: 500 }
        )
      }

      // Trigger pipeline
      fetch(`${baseUrl}/api/dreams/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamId, userId }),
      }).catch(err => console.error(`[Import] Pipeline failed for ${dreamId}:`, err.message))

      return NextResponse.json({
        ok: true,
        dreamId,
        filename,
        transcriptPreview: body.rawTranscript.substring(0, 100) + (body.rawTranscript.length > 100 ? '...' : ''),
        source: 'whisper-chunked',
      })
    }

    // ═══ MODE 3: Normal — download from Storage, transcribe, insert ═══
    if (!storagePath || !filename) {
      return NextResponse.json(
        { error: 'storagePath and filename are required' },
        { status: 400 }
      )
    }

    supabase = createServerClient()
    const baseUrl = req.nextUrl.origin
    const isAudio = AUDIO_EXTENSIONS.some(ext => filename.toLowerCase().endsWith(ext))

    // ═══ Step 1: Download from Storage ═══
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('dream-imports')
      .download(storagePath)

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: `Download failed: ${downloadError?.message || 'No data'}` },
        { status: 500 }
      )
    }

    let transcript: string

    if (isAudio) {
      const audioBuffer = Buffer.from(await fileData.arrayBuffer())
      const fileSize = audioBuffer.length

      if (fileSize > WHISPER_MAX_SIZE) {
        // ═══ Step 2a: GROS FICHIER → split par byte-slicing ═══
        console.log(`[Import] ${filename} is ${Math.round(fileSize / 1024 / 1024)}MB — splitting into ${Math.ceil(fileSize / CHUNK_SIZE)} chunks...`)
        const chunks = splitAudioBuffer(audioBuffer)
        console.log(`[Import] Split into ${chunks.length} chunks`)

        // Transcrire chaque chunk séquentiellement
        const parts: string[] = []
        for (let i = 0; i < chunks.length; i++) {
          const chunkName = `${filename.replace(/\.[^.]+$/, '')}_chunk${i}.m4a`
          const part = await transcribeBuffer(chunks[i], chunkName)
          if (part && part.trim().length > 0) {
            parts.push(part.trim())
          }
        }
        transcript = parts.join('\n\n')
      } else {
        // ═══ Step 2b: Fichier normal → Whisper direct ═══
        transcript = await transcribeBuffer(audioBuffer, filename)
      }
    } else {
      // ═══ Step 2c: Read text directly ═══
      transcript = await fileData.text()
    }

    if (!transcript || transcript.trim().length < 10) {
      console.error(`[Import] REJECTED ${filename}: transcript too short (${transcript?.length || 0} chars). Content: "${(transcript || '').substring(0, 100)}"`)
      await supabase.storage.from('dream-imports').remove([storagePath])
      return NextResponse.json(
        { error: `Transcription trop courte (${transcript?.trim().length || 0} caractères). Le fichier audio est peut-être silencieux ou corrompu.`, filename },
        { status: 400 }
      )
    }

    // ═══ Step 3: Extract date from filename ═══
    const dateFromName = extractDateFromFilename(filename)

    // ═══ Step 4: Insert in DB via RPC (bypasses RLS) ═══
    const { data: dreamId, error: insertError } = await supabase
      .rpc('insert_imported_dream', {
        p_user_id: userId,
        p_raw_text: transcript,
        p_entry_type: 'dream',
        p_source: 'import-audio',
        p_source_filename: filename,
        p_created_at: dateFromName || new Date().toISOString(),
        p_updated_at: new Date().toISOString(),
      })

    if (insertError || !dreamId) {
      console.error(`[Import] DB INSERT FAILED for ${filename}:`, insertError?.message, insertError?.details, insertError?.hint)
      await supabase.storage.from('dream-imports').remove([storagePath])
      return NextResponse.json(
        { error: `DB insert failed: ${insertError?.message || 'No dreamId returned'}`, filename },
        { status: 500 }
      )
    }

    const dream = { id: dreamId }

    // ═══ Step 5: Trigger pipeline (fire-and-forget) ═══
    fetch(`${baseUrl}/api/dreams/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dreamId: dream.id, userId }),
    }).catch(err => console.error(`[Import] Pipeline failed for ${dream.id}:`, err.message))

    // ═══ Step 6: Cleanup Storage ═══
    await supabase.storage.from('dream-imports').remove([storagePath])

    return NextResponse.json({
      ok: true,
      dreamId: dream.id,
      filename,
      transcriptPreview: transcript.substring(0, 100) + (transcript.length > 100 ? '...' : ''),
      source: isAudio ? 'whisper' : 'text',
    })
  } catch (error: any) {
    console.error('[Import from storage] Error:', error)
    // ═══ ALWAYS cleanup Storage on crash ═══
    if (storagePath && supabase) {
      try {
        await supabase.storage.from('dream-imports').remove([storagePath])
      } catch (cleanupErr) {
        console.error('[Import] Cleanup also failed:', cleanupErr)
      }
    }
    return NextResponse.json({ error: error.message, filename: storagePath?.split('/').pop() }, { status: 500 })
  }
}

function extractDateFromFilename(filename: string): string | null {
  // Pattern: MyRec_MMDD_HHMM or similar
  const mmddMatch = filename.match(/(\d{4})_(\d{4})/)
  if (mmddMatch) {
    const mmdd = mmddMatch[1]
    const mm = mmdd.substring(0, 2)
    const dd = mmdd.substring(2, 4)
    const year = 2024 // reasonable default for dream recordings
    const d = new Date(`${year}-${mm}-${dd}T06:00:00Z`)
    if (!isNaN(d.getTime()) && d.getMonth() + 1 === parseInt(mm)) return d.toISOString()
  }

  // ISO-like: 2024-03-15
  const isoMatch = filename.match(/(\d{4})[-_](\d{2})[-_](\d{2})/)
  if (isoMatch) {
    const d = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }

  // Compact: 20240315
  const compactMatch = filename.match(/(\d{4})(\d{2})(\d{2})/)
  if (compactMatch && parseInt(compactMatch[1]) > 2000) {
    const d = new Date(`${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }

  return null
}
