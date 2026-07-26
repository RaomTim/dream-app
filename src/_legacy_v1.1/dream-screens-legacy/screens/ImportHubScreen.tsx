'use client'

import React, { useState, useRef, useCallback } from 'react'
import { createBrowserClient } from '@/lib/auth'
import { Glyph, SerifHeading, BtnGhost, Diamond, Rule } from '@/components/dream/ui/primitives'
import { authFetch } from '@/lib/api-client'

// ═══════════════════════════════════════════════════════════
// IMPORT HUB — Écran 0
// "Tu as des rêves anciens ? Importe-les et l'app prend vie."
//
// Accepte : fichiers audio (m4a, mp3, wav, webm, ogg),
//           fichiers texte (txt, md),
//           copier-coller de texte brut
// Chaque import déclenche le pipeline 3 passes (Haiku → Sonnet → Embedding)
//
// GROS FICHIERS (>24MB) :
// Le M4A est un conteneur MP4 — on ne peut pas byte-slice.
// Fix : le browser décode nativement, on split en segments WAV
// (header linéaire + PCM brut), upload chaque chunk séparément.
// ═══════════════════════════════════════════════════════════

type ImportResult = {
  filename: string
  status: 'success' | 'error'
  dreamId?: string
  transcript?: string
  error?: string
}

type ImportState = 'idle' | 'uploading' | 'done'

export type ImportHubScreenProps = {
  userId: string
  onClose: () => void
  onComplete?: (importedCount: number) => void
}

const ACCEPTED_EXTENSIONS = '.m4a,.mp3,.wav,.webm,.ogg,.mp4,.txt,.md'
const AUDIO_EXT = ['.m4a', '.mp3', '.wav', '.webm', '.ogg', '.mp4']
const WHISPER_MAX_SIZE = 24 * 1024 * 1024 // 24MB safe limit for Whisper (hard limit 25MB)

// ═══════════════════════════════════════════════════════════
// WAV ENCODING — convert raw PCM to valid WAV file
// WAV is linear: header (44 bytes) + raw PCM data.
// No container structure = byte-slicing always works.
// ═══════════════════════════════════════════════════════════

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1 // mono — speech doesn't need stereo
  const bitsPerSample = 16
  const bytesPerSample = bitsPerSample / 8
  const blockAlign = numChannels * bytesPerSample
  const dataSize = samples.length * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  // RIFF header
  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')

  // fmt chunk
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // chunk size
  view.setUint16(20, 1, true) // PCM format
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true) // byte rate
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)

  // data chunk
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  // Convert float32 samples to int16
  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    offset += 2
  }

  return new Blob([buffer], { type: 'audio/wav' })
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}

// ═══════════════════════════════════════════════════════════
// CLIENT-SIDE AUDIO SPLITTING
// Browser decodes any audio format → split AudioBuffer → WAV chunks
// ═══════════════════════════════════════════════════════════

async function splitAudioClientSide(
  file: File,
  maxChunkBytes: number = WHISPER_MAX_SIZE,
): Promise<{ chunks: Blob[]; chunkNames: string[] }> {
  const arrayBuffer = await file.arrayBuffer()
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()

  let audioBuffer: AudioBuffer
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
  } finally {
    audioCtx.close()
  }

  const sampleRate = Math.min(audioBuffer.sampleRate, 16000) // 16kHz is plenty for speech
  const totalSamples = Math.floor(audioBuffer.duration * sampleRate)

  // Estimate samples per chunk: 16-bit mono WAV = 2 bytes per sample + 44 byte header
  const samplesPerChunk = Math.floor((maxChunkBytes - 44) / 2)

  // Resample to mono + target sample rate
  const originalData = audioBuffer.getChannelData(0) // mono from first channel
  const resampleRatio = audioBuffer.sampleRate / sampleRate
  const resampledLength = Math.floor(originalData.length / resampleRatio)

  const resampled = new Float32Array(resampledLength)
  for (let i = 0; i < resampledLength; i++) {
    const srcIndex = Math.floor(i * resampleRatio)
    resampled[i] = originalData[Math.min(srcIndex, originalData.length - 1)]
  }

  const chunks: Blob[] = []
  const chunkNames: string[] = []
  const baseName = file.name.replace(/\.[^.]+$/, '')

  if (resampled.length <= samplesPerChunk) {
    // File fits in one chunk after resampling
    chunks.push(encodeWav(resampled, sampleRate))
    chunkNames.push(`${baseName}.wav`)
  } else {
    // Split into chunks
    let offset = 0
    let chunkIndex = 0
    while (offset < resampled.length) {
      const end = Math.min(offset + samplesPerChunk, resampled.length)
      const segment = resampled.subarray(offset, end)
      chunks.push(encodeWav(segment, sampleRate))
      chunkNames.push(`${baseName}_chunk${chunkIndex}.wav`)
      offset = end
      chunkIndex++
    }
  }

  return { chunks, chunkNames }
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════

export default function ImportHubScreen({ userId, onClose, onComplete }: ImportHubScreenProps) {
  const [files, setFiles] = useState<File[]>([])
  const [pasteText, setPasteText] = useState('')
  const [state, setState] = useState<ImportState>('idle')
  const [progress, setProgress] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  const [results, setResults] = useState<ImportResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)
  const [dragOver, setDragOver] = useState(false)

  // ── File handling ──────────────────────────────────────

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter(f => {
      const ext = '.' + f.name.split('.').pop()?.toLowerCase()
      return ACCEPTED_EXTENSIONS.split(',').includes(ext)
    })
    setFiles(prev => [...prev, ...arr])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }, [])

  // ── Drag & Drop ────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }, [addFiles])

  // ── Upload & Process ───────────────────────────────────
  // For big audio files (>24MB): decode → split → WAV chunks → upload each
  // For normal files: upload directly to Storage → API processes

  const handleImport = async () => {
    if (files.length === 0 && pasteText.trim().length < 10) return

    setState('uploading')
    setError(null)
    setResults([])

    const supabase = createBrowserClient()
    const allResults: ImportResult[] = []
    const total = files.length + (pasteText.trim().length >= 10 ? 1 : 0)
    setTotalFiles(total)
    let completed = 0

    try {
      // ── Process files one by one ──
      for (const file of files) {
        const isAudio = AUDIO_EXT.some(ext => file.name.toLowerCase().endsWith(ext))
        const isBigAudio = isAudio && file.size > WHISPER_MAX_SIZE

        try {
          if (isBigAudio) {
            // ═══ BIG AUDIO: client-side split → WAV chunks ═══
            setStatusMessage(`Découpe de ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)...`)

            const { chunks, chunkNames } = await splitAudioClientSide(file)
            console.log(`[Import] Split ${file.name} into ${chunks.length} WAV chunks`)

            const chunkTranscripts: string[] = []
            let chunkErrors = 0

            for (let ci = 0; ci < chunks.length; ci++) {
              setStatusMessage(`${file.name} — chunk ${ci + 1}/${chunks.length}`)

              const chunk = chunks[ci]
              const chunkName = chunkNames[ci]
              const storagePath = `${userId}/${Date.now()}-${chunkName}`

              // Upload chunk to Storage
              const { error: uploadError } = await supabase.storage
                .from('dream-imports')
                .upload(storagePath, chunk, { upsert: false })

              if (uploadError) {
                console.error(`[Import] Chunk upload failed: ${uploadError.message}`)
                chunkErrors++
                continue
              }

              // Process chunk via API
              const res = await authFetch('/api/dreams/import-from-storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  storagePath,
                  filename: chunkName,
                  // Tell the API this is a chunk — don't create separate dream entries
                  isChunk: true,
                  originalFilename: file.name,
                  chunkIndex: ci,
                  totalChunks: chunks.length,
                }),
              })

              if (res.ok) {
                const data = await res.json()
                if (data.transcript) {
                  chunkTranscripts.push(data.transcript)
                }
              } else {
                chunkErrors++
              }
            }

            // Combine all chunk transcripts into one dream
            if (chunkTranscripts.length > 0) {
              const fullTranscript = chunkTranscripts.join('\n\n')
              const dateFromName = extractDateFromFilename(file.name)

              // Insert the combined dream
              const insertRes = await authFetch('/api/dreams/import-from-storage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  userId,
                  // Special mode: raw transcript, no Storage file
                  rawTranscript: fullTranscript,
                  filename: file.name,
                  dateOverride: dateFromName,
                }),
              })

              if (insertRes.ok) {
                const data = await insertRes.json()
                allResults.push({
                  filename: file.name, status: 'success',
                  dreamId: data.dreamId,
                  transcript: fullTranscript.substring(0, 100) + '...',
                })
              } else {
                let errMsg = `Erreur ${insertRes.status}`
                try { const d = await insertRes.json(); errMsg = d.error || errMsg } catch {}
                allResults.push({ filename: file.name, status: 'error', error: errMsg })
              }
            } else {
              allResults.push({
                filename: file.name, status: 'error',
                error: `Transcription échouée (${chunkErrors} chunks en erreur)`,
              })
            }
          } else {
            // ═══ NORMAL FILE: upload to Storage → API processes ═══
            setStatusMessage(`Import de ${file.name}...`)
            const storagePath = `${userId}/${Date.now()}-${file.name}`

            const { error: uploadError } = await supabase.storage
              .from('dream-imports')
              .upload(storagePath, file, { upsert: false })

            if (uploadError) {
              allResults.push({
                filename: file.name, status: 'error',
                error: uploadError.message.includes('Payload too large')
                  ? 'Fichier trop volumineux (max 50MB)'
                  : uploadError.message,
              })
              completed++
              setProgress(Math.round((completed / total) * 100))
              setResults([...allResults])
              continue
            }

            const res = await authFetch('/api/dreams/import-from-storage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, storagePath, filename: file.name }),
            })

            if (!res.ok) {
              let errMsg = `Erreur ${res.status}`
              try { const d = await res.json(); errMsg = d.error || errMsg } catch {}
              allResults.push({ filename: file.name, status: 'error', error: errMsg })
            } else {
              const data = await res.json()
              allResults.push({
                filename: file.name, status: 'success',
                dreamId: data.dreamId,
                transcript: data.transcriptPreview,
              })
            }
          }
        } catch (err: any) {
          allResults.push({ filename: file.name, status: 'error', error: err.message })
        }

        completed++
        setProgress(Math.round((completed / total) * 100))
        setResults([...allResults])
      }

      // ── Process paste text ──
      if (pasteText.trim().length >= 10) {
        setStatusMessage('Import du texte...')
        try {
          const formData = new FormData()
          formData.append('userId', userId)
          formData.append('textEntries', JSON.stringify([{ text: pasteText.trim() }]))

          const res = await authFetch('/api/dreams/import-batch', {
            method: 'POST',
            body: formData,
          })

          if (res.ok) {
            const data = await res.json()
            if (data.results) allResults.push(...data.results)
          } else {
            allResults.push({ filename: 'text-paste', status: 'error', error: `Erreur ${res.status}` })
          }
        } catch (err: any) {
          allResults.push({ filename: 'text-paste', status: 'error', error: err.message })
        }
        completed++
        setProgress(100)
        setResults([...allResults])
      }

      setState('done')
      setStatusMessage('')
      const succeeded = allResults.filter(r => r.status === 'success').length
      if (onComplete) onComplete(succeeded)
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion')
      setState('idle')
    }
  }

  // ── Render helpers ─────────────────────────────────────

  const audioCount = files.filter(f => AUDIO_EXT.some(ext => f.name.toLowerCase().endsWith(ext))).length
  const textCount = files.filter(f => f.name.toLowerCase().endsWith('.txt') || f.name.toLowerCase().endsWith('.md')).length
  const bigCount = files.filter(f => AUDIO_EXT.some(ext => f.name.toLowerCase().endsWith(ext)) && f.size > WHISPER_MAX_SIZE).length
  const succeededCount = results.filter(r => r.status === 'success').length
  const failedCount = results.filter(r => r.status === 'error').length

  // ══════════════════════════════════════════════════════
  // DONE STATE
  // ══════════════════════════════════════════════════════

  if (state === 'done') {
    return (
      <div className="grain screen-enter-fade" style={{
        minHeight: '100dvh', background: 'var(--bg-wash)',
        paddingTop: 'env(safe-area-inset-top, 12px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 24px',
      }}>
        <Diamond size={10} />
        <SerifHeading size={28} italic style={{ marginTop: 24, textAlign: 'center' }}>
          {succeededCount} rêve{succeededCount > 1 ? 's' : ''} importé{succeededCount > 1 ? 's' : ''}
        </SerifHeading>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
          color: 'var(--fg-mute)', marginTop: 12, textAlign: 'center', lineHeight: 1.6,
        }}>
          Le pipeline d'analyse travaille en arrière-plan.
          <br />
          Chaque rêve sera enrichi, relié, cartographié.
        </div>

        {failedCount > 0 && (
          <div style={{
            marginTop: 20, padding: '10px 14px', borderRadius: 2,
            background: 'rgba(122, 36, 24, 0.12)', border: '1px solid rgba(122, 36, 24, 0.3)',
            fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)',
          }}>
            {failedCount} fichier{failedCount > 1 ? 's' : ''} non importé{failedCount > 1 ? 's' : ''}
            {results.filter(r => r.status === 'error').map((r, i) => (
              <div key={i} style={{ marginTop: 6, fontSize: 9, opacity: 0.8, wordBreak: 'break-word' }}>
                {r.filename}: {r.error}
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          <BtnGhost onClick={onClose}>Continuer</BtnGhost>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════
  // UPLOADING STATE
  // ══════════════════════════════════════════════════════

  if (state === 'uploading') {
    return (
      <div className="grain" style={{
        minHeight: '100dvh', background: 'var(--bg-wash)',
        paddingTop: 'env(safe-area-inset-top, 12px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '0 32px',
      }}>
        <SerifHeading size={22} italic>
          Import en cours...
        </SerifHeading>

        {statusMessage && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-mute)',
            marginTop: 12, textAlign: 'center',
          }}>
            {statusMessage}
          </div>
        )}

        {/* Progress bar */}
        <div style={{
          width: '100%', maxWidth: 280, height: 2, marginTop: 20,
          background: 'var(--border)', borderRadius: 1, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'var(--accent)',
            transition: 'width 0.5s ease',
          }} />
        </div>

        <Glyph size={9} color="var(--fg-mute)" style={{ marginTop: 14 }}>
          {succeededCount} / {totalFiles} traité{totalFiles > 1 ? 's' : ''}
          {failedCount > 0 && ` · ${failedCount} erreur${failedCount > 1 ? 's' : ''}`}
        </Glyph>

        {/* Live results */}
        {results.length > 0 && (
          <div style={{
            marginTop: 28, width: '100%', maxWidth: 340, maxHeight: 200,
            overflowY: 'auto',
          }}>
            {results.slice(-5).map((r, i) => (
              <div key={i} style={{
                padding: '6px 0', borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-mute)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '70%',
                }}>
                  {r.filename}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  color: r.status === 'success' ? '#22c55e' : 'var(--accent)',
                }} title={r.error || ''}>
                  {r.status === 'success' ? '✓' : '✗'}
                </span>
                {r.error && (
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent)',
                    opacity: 0.8, marginTop: 2, width: '100%',
                    lineHeight: 1.4, wordBreak: 'break-word', whiteSpace: 'normal',
                  }}>
                    {r.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ══════════════════════════════════════════════════════
  // IDLE STATE — Main form
  // ══════════════════════════════════════════════════════

  return (
    <div className="grain screen-enter-fade" style={{
      minHeight: '100dvh', background: 'var(--bg-wash)',
      paddingTop: 'env(safe-area-inset-top, 12px)',
      paddingBottom: 100,
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Glyph size={10}>← Retour</Glyph>
        </button>
        <Glyph size={10}>Import</Glyph>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', padding: '24px 24px 0' }}>
        <SerifHeading size={26} italic>
          Tes rêves anciens
        </SerifHeading>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
          color: 'var(--fg-mute)', marginTop: 12, lineHeight: 1.6,
        }}>
          Importe tes notes vocales, journaux, carnets de rêves.
          <br />
          Chaque rêve importé sera analysé, relié, cartographié.
          <br />
          <span style={{ color: 'var(--accent)' }}>
            Plus tu importes, plus les échos se réveillent.
          </span>
        </div>
      </div>

      <Rule style={{ margin: '28px 20px' }} />

      {/* ── Drop zone ─────────────────────────── */}
      <div style={{ padding: '0 20px' }}>
        <Glyph size={9} color="var(--fg-mute)" style={{ marginBottom: 10 }}>
          FICHIERS AUDIO & TEXTE
        </Glyph>

        <div
          ref={dropRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%', minHeight: 120, borderRadius: 2,
            border: `1px dashed ${dragOver ? 'var(--accent)' : 'var(--border)'}`,
            background: dragOver ? 'rgba(184,151,90,0.06)' : 'var(--bg-card)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s ease',
            padding: 20,
          }}
        >
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
            color: dragOver ? 'var(--accent)' : 'var(--fg-mute)',
          }}>
            {dragOver ? 'Dépose ici...' : 'Glisse tes fichiers ici'}
          </div>
          <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 8 }}>
            ou touche pour parcourir
          </Glyph>
          <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 4 }}>
            m4a · mp3 · wav · txt · md
          </Glyph>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          multiple
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
          style={{ display: 'none' }}
        />

        {/* File list */}
        {files.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <Glyph size={9} color="var(--fg-mute)">
              {files.length} FICHIER{files.length > 1 ? 'S' : ''} SÉLECTIONNÉ{files.length > 1 ? 'S' : ''}
              {audioCount > 0 && ` · ${audioCount} audio`}
              {textCount > 0 && ` · ${textCount} texte`}
            </Glyph>
            {bigCount > 0 && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--accent)',
                marginTop: 4, letterSpacing: 0.5,
              }}>
                {bigCount} gros fichier{bigCount > 1 ? 's' : ''} — seront découpés automatiquement
              </div>
            )}
            <div style={{ marginTop: 8, maxHeight: 180, overflowY: 'auto' }}>
              {files.map((f, i) => {
                const isBig = AUDIO_EXT.some(ext => f.name.toLowerCase().endsWith(ext)) && f.size > WHISPER_MAX_SIZE
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: '1px solid var(--border)',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-mute)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      maxWidth: '65%',
                    }}>
                      {AUDIO_EXT.some(ext => f.name.toLowerCase().endsWith(ext)) ? '🎙 ' : '📝 '}
                      {f.name}
                      {isBig && (
                        <span style={{ color: 'var(--accent)', marginLeft: 4, fontSize: 8 }}>
                          ({Math.round(f.size / 1024 / 1024)}MB)
                        </span>
                      )}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                      style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--fg-mute)',
                        padding: '4px 8px',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <Rule style={{ margin: '28px 20px' }} />

      {/* ── Paste zone ─────────────────────────── */}
      <div style={{ padding: '0 20px' }}>
        <Glyph size={9} color="var(--fg-mute)" style={{ marginBottom: 10 }}>
          OU COLLE TES RÊVES ICI
        </Glyph>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--fg-mute)',
          marginBottom: 8, lineHeight: 1.4,
        }}>
          Sépare chaque rêve par --- ou une date (15/03/2024)
        </div>
        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={"15/03/2024\nJ'étais dans une forêt immense, les arbres parlaient...\n\n---\n\n22/03/2024\nUne maison que je ne reconnaissais pas..."}
          style={{
            width: '100%', minHeight: 140, padding: '14px 16px',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 2, color: 'var(--fg)',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
            lineHeight: 1.6, outline: 'none', resize: 'vertical',
          }}
        />
        {pasteText.trim().length > 0 && (
          <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 6 }}>
            {pasteText.trim().length} caractères
          </Glyph>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          margin: '20px 20px 0', padding: '10px 14px', borderRadius: 2,
          background: 'rgba(122, 36, 24, 0.15)', border: '1px solid rgba(122, 36, 24, 0.4)',
          fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--accent)',
        }}>
          {error}
        </div>
      )}

      {/* Import button */}
      <div style={{ padding: '28px 20px' }}>
        <button
          onClick={handleImport}
          disabled={files.length === 0 && pasteText.trim().length < 10}
          style={{
            width: '100%', padding: '16px', borderRadius: 2,
            background: (files.length > 0 || pasteText.trim().length >= 10)
              ? 'var(--structural-bg)' : 'var(--bg-card)',
            border: '1px solid var(--structural-line)',
            color: (files.length > 0 || pasteText.trim().length >= 10)
              ? 'var(--accent)' : 'var(--fg-mute)',
            cursor: (files.length > 0 || pasteText.trim().length >= 10)
              ? 'pointer' : 'default',
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: (files.length > 0 || pasteText.trim().length >= 10) ? 1 : 0.4,
            transition: 'all 0.2s ease',
          }}
        >
          {files.length > 0
            ? `Importer ${files.length} fichier${files.length > 1 ? 's' : ''}`
            : pasteText.trim().length >= 10
            ? 'Importer le texte'
            : 'Ajoute des rêves pour commencer'}
        </button>

        {files.length > 0 && (
          <div style={{
            marginTop: 10, textAlign: 'center',
            fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--fg-mute)',
            letterSpacing: 1, textTransform: 'uppercase',
          }}>
            coût estimé : ~${(audioCount * 0.006 + (audioCount + textCount) * 0.01).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Utility ──────────────────────────────────────────────

function extractDateFromFilename(filename: string): string | null {
  const mmddMatch = filename.match(/(\d{4})_(\d{4})/)
  if (mmddMatch) {
    const mmdd = mmddMatch[1]
    const mm = mmdd.substring(0, 2)
    const dd = mmdd.substring(2, 4)
    const year = 2024
    const d = new Date(`${year}-${mm}-${dd}T06:00:00Z`)
    if (!isNaN(d.getTime()) && d.getMonth() + 1 === parseInt(mm)) return d.toISOString()
  }
  const isoMatch = filename.match(/(\d{4})[-_](\d{2})[-_](\d{2})/)
  if (isoMatch) {
    const d = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  const compactMatch = filename.match(/(\d{4})(\d{2})(\d{2})/)
  if (compactMatch && parseInt(compactMatch[1]) > 2000) {
    const d = new Date(`${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  return null
}
