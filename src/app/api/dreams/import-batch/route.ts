import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import OpenAI from 'openai'
import { requireAuth } from '@/lib/auth-server'

// Vercel: increase body size limit (default 4.5MB) and function timeout
export const maxDuration = 120 // seconds (Pro plan)

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

/**
 * POST /api/dreams/import-batch
 *
 * IMPORT HUB — Importer des rêves anciens en masse.
 *
 * Accepte :
 * - Fichiers audio (m4a, mp3, wav, webm, ogg) → Whisper transcription
 * - Fichiers texte (txt, md) → parsing direct
 * - JSON structuré → import direct
 *
 * Chaque rêve importé est sauvé en DB puis le pipeline 3 passes
 * (Haiku → Sonnet → Embedding) est déclenché en fire-and-forget.
 *
 * Pourquoi c'est essentiel :
 * Les échos prophétiques (feature #1) ont besoin de profondeur temporelle.
 * Sans historique, il faut des semaines. Avec un import de 50 rêves,
 * l'app peut réveiller des échos dès le premier jour.
 *
 * Coût : ~$0.006/min (Whisper) + ~$0.01/rêve (pipeline) = ~$1 pour 50 vocaux
 */

const AUDIO_TYPES = ['audio/mp4', 'audio/m4a', 'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/webm', 'audio/ogg']
const TEXT_TYPES = ['text/plain', 'text/markdown']
const AUDIO_EXTENSIONS = ['.m4a', '.mp3', '.wav', '.webm', '.ogg', '.mp4']

interface ImportResult {
  filename: string
  status: 'success' | 'error'
  dreamId?: string
  transcript?: string
  error?: string
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]
    const textEntries = formData.get('textEntries') as string | null // JSON array of {text, date?}

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration
    const legacyBody = { userId: formData.get('userId') as string | null }
    const auth = await requireAuth(req, legacyBody)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (files.length === 0 && !textEntries) {
      return NextResponse.json({ error: 'No files or text entries provided' }, { status: 400 })
    }

    const supabase = createServerClient()
    const results: ImportResult[] = []
    const baseUrl = req.nextUrl.origin

    // ═══════════════════════════════════════════
    // TRAITEMENT DES FICHIERS AUDIO
    // Whisper transcription → save → pipeline
    // ═══════════════════════════════════════════

    for (const file of files) {
      const isAudio = AUDIO_TYPES.includes(file.type)
        || AUDIO_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))
      const isText = TEXT_TYPES.includes(file.type)
        || file.name.toLowerCase().endsWith('.txt')
        || file.name.toLowerCase().endsWith('.md')

      if (isAudio) {
        try {
          // Transcription Whisper
          const transcription = await openai.audio.transcriptions.create({
            file: file,
            model: 'gpt-4o-transcribe',
            language: 'fr', // Français par défaut, Whisper détecte aussi auto
            response_format: 'text',
          })

          const transcript = typeof transcription === 'string'
            ? transcription
            : (transcription as any).text || String(transcription)

          if (!transcript || transcript.trim().length < 10) {
            results.push({ filename: file.name, status: 'error', error: 'Transcription trop courte' })
            continue
          }

          // Extraire une date approximative du nom de fichier si possible
          const dateFromName = extractDateFromFilename(file.name)

          // Sauvegarder en DB
          const { data: dream, error } = await supabase
            .from('dreams')
            .insert({
              user_id: userId,
              raw_text: transcript,
              entry_type: 'dream',
              source: 'import-audio',
              source_filename: file.name,
              created_at: dateFromName || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single()

          if (error || !dream) {
            results.push({ filename: file.name, status: 'error', error: error?.message || 'DB insert failed' })
            continue
          }

          // Déclencher le pipeline 3 passes (fire-and-forget)
          triggerPipeline(dream.id, userId, baseUrl)

          results.push({
            filename: file.name,
            status: 'success',
            dreamId: dream.id,
            transcript: transcript.substring(0, 100) + (transcript.length > 100 ? '...' : ''),
          })
        } catch (err: any) {
          results.push({ filename: file.name, status: 'error', error: err.message })
        }
      } else if (isText) {
        try {
          const text = await file.text()
          // Segmenter le texte en rêves individuels
          const dreams = segmentTextIntoDreams(text)

          for (const dream of dreams) {
            const { data: saved, error } = await supabase
              .from('dreams')
              .insert({
                user_id: userId,
                raw_text: dream.text,
                entry_type: 'dream',
                source: 'import-text',
                source_filename: file.name,
                created_at: dream.date || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select('id')
              .single()

            if (!error && saved) {
              triggerPipeline(saved.id, userId, baseUrl)
              results.push({ filename: file.name, status: 'success', dreamId: saved.id })
            }
          }
        } catch (err: any) {
          results.push({ filename: file.name, status: 'error', error: err.message })
        }
      } else {
        results.push({ filename: file.name, status: 'error', error: `Type non supporté: ${file.type}` })
      }
    }

    // ═══════════════════════════════════════════
    // TRAITEMENT DES ENTRÉES TEXTE (copier-coller)
    // ═══════════════════════════════════════════

    if (textEntries) {
      try {
        const entries: Array<{ text: string; date?: string }> = JSON.parse(textEntries)

        for (const entry of entries) {
          if (!entry.text || entry.text.trim().length < 10) continue

          const { data: saved, error } = await supabase
            .from('dreams')
            .insert({
              user_id: userId,
              raw_text: entry.text.trim(),
              entry_type: 'dream',
              source: 'import-text-paste',
              created_at: entry.date || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select('id')
            .single()

          if (!error && saved) {
            triggerPipeline(saved.id, userId, baseUrl)
            results.push({
              filename: 'text-paste',
              status: 'success',
              dreamId: saved.id,
              transcript: entry.text.substring(0, 80),
            })
          }
        }
      } catch (err: any) {
        results.push({ filename: 'textEntries', status: 'error', error: `Invalid JSON: ${err.message}` })
      }
    }

    const succeeded = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'error').length

    return NextResponse.json({
      ok: true,
      imported: succeeded,
      failed,
      total: results.length,
      results,
      pipeline: 'All imported dreams will be processed (entities → deep analysis → embedding)',
      estimatedCost: `~$${(succeeded * 0.01).toFixed(2)} for AI pipeline`,
    })
  } catch (error: any) {
    console.error('Import batch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Fire-and-forget : déclenche le pipeline d'extraction sur un rêve importé.
 */
function triggerPipeline(dreamId: string, userId: string, baseUrl: string) {
  fetch(`${baseUrl}/api/dreams/extract`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dreamId, userId }),
  }).catch(err => console.error(`[Import] Pipeline trigger failed for ${dreamId}:`, err.message))
}

/**
 * Tente d'extraire une date d'un nom de fichier.
 * Patterns courants : 2024-03-15, 15-03-2024, 20240315, etc.
 */
function extractDateFromFilename(filename: string): string | null {
  // ISO-like: 2024-03-15 or 2024_03_15
  const isoMatch = filename.match(/(\d{4})[-_](\d{2})[-_](\d{2})/)
  if (isoMatch) {
    const d = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }

  // European: 15-03-2024 or 15_03_2024
  const euMatch = filename.match(/(\d{2})[-_](\d{2})[-_](\d{4})/)
  if (euMatch) {
    const d = new Date(`${euMatch[3]}-${euMatch[2]}-${euMatch[1]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }

  // Compact: 20240315
  const compactMatch = filename.match(/(\d{4})(\d{2})(\d{2})/)
  if (compactMatch) {
    const d = new Date(`${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}T06:00:00Z`)
    if (!isNaN(d.getTime()) && d.getFullYear() > 2000 && d.getFullYear() < 2030) return d.toISOString()
  }

  return null
}

/**
 * Segmente un texte brut en rêves individuels.
 * Détecte les séparateurs courants : dates, lignes vides doubles, "---", "***"
 */
function segmentTextIntoDreams(text: string): Array<{ text: string; date: string | null }> {
  // Essayer de séparer par dates
  const datePattern = /(?:^|\n)(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\s*[\n:]/gm
  const dateMatches: RegExpExecArray[] = []
  let match: RegExpExecArray | null
  while ((match = datePattern.exec(text)) !== null) {
    dateMatches.push(match)
  }

  if (dateMatches.length >= 2) {
    // Le texte contient des dates — segmenter par dates
    const segments: Array<{ text: string; date: string | null }> = []
    for (let i = 0; i < dateMatches.length; i++) {
      const start = dateMatches[i].index! + dateMatches[i][0].indexOf(dateMatches[i][1])
      const end = i < dateMatches.length - 1 ? dateMatches[i + 1].index! : text.length
      const content = text.substring(start + dateMatches[i][1].length, end).trim()
      if (content.length >= 10) {
        segments.push({ text: content, date: parseFuzzyDate(dateMatches[i][1]) })
      }
    }
    return segments
  }

  // Séparer par "---" ou "***" ou double ligne vide
  const blocks = text.split(/\n\s*(?:---+|===+|\*\*\*+)\s*\n|\n\n\n+/)
    .map(b => b.trim())
    .filter(b => b.length >= 10)

  if (blocks.length >= 2) {
    return blocks.map(b => ({ text: b, date: null }))
  }

  // Sinon, traiter comme un seul rêve
  return text.trim().length >= 10 ? [{ text: text.trim(), date: null }] : []
}

function parseFuzzyDate(dateStr: string): string | null {
  // Try DD/MM/YYYY
  const parts = dateStr.split(/[\/\-\.]/)
  if (parts.length === 3) {
    const [a, b, c] = parts.map(Number)
    // If c > 100, it's a year
    if (c > 100) {
      const d = new Date(`${c}-${String(b).padStart(2, '0')}-${String(a).padStart(2, '0')}T06:00:00Z`)
      if (!isNaN(d.getTime())) return d.toISOString()
    }
    // If a > 100, it's YYYY-MM-DD
    if (a > 100) {
      const d = new Date(`${a}-${String(b).padStart(2, '0')}-${String(c).padStart(2, '0')}T06:00:00Z`)
      if (!isNaN(d.getTime())) return d.toISOString()
    }
  }
  return null
}
