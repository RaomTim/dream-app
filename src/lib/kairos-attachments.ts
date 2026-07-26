/**
 * Helpers Storage pour les pièces jointes des kairos (bucket privé `kairos-attachments`).
 *
 * Utilisé par :
 *   - /api/mvp/scan (photo de page manuscrite — écran A5)
 *   - /api/mvp/interpretations (audio de la note de résonance — §C1bis)
 *
 * Le bucket doit exister et être PRIVÉ (RLS owner-only côté DB ; lecture via URL
 * signée server-side). S'il manque, l'upload échoue en best-effort : l'appelant
 * décide (ici, jamais bloquant — la note texte + l'apprentissage restent OK).
 *
 * Yeshua (Opus), 2026-07-11.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

export const ATTACHMENT_BUCKET = 'kairos-attachments'
const SIGNED_TTL = 60 * 60 // 1h

const AUDIO_EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
}

/**
 * Uploade un audio base64 (data: préfixe toléré) dans le bucket, sous
 * `${userId}/resonance/…`. Retourne le storage_path, ou null si échec (best-effort).
 */
export async function uploadAudioAttachment(
  supabase: SupabaseClient,
  userId: string,
  base64: string,
  mime: string
): Promise<string | null> {
  try {
    const clean = (base64 || '').replace(/^data:[^;]+;base64,/, '')
    if (!clean) return null
    // borne raisonnable (~7MB décodé) — une note d'une phrase, pas un fichier
    if (Math.ceil((clean.length * 3) / 4) > 7 * 1024 * 1024) return null
    const buf = Buffer.from(clean, 'base64')
    const ext = AUDIO_EXT[mime] || 'webm'
    const contentType = AUDIO_EXT[mime] ? mime : 'audio/webm'
    const path = `${userId}/resonance/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage.from(ATTACHMENT_BUCKET).upload(path, buf, { contentType, upsert: false })
    if (error) {
      console.error('[kairos-attachments] upload audio failed:', error.message)
      return null
    }
    return path
  } catch (e: any) {
    console.error('[kairos-attachments] upload audio error:', e?.message)
    return null
  }
}

/** URL signée (lecture) pour un storage_path, ou null. Best-effort. */
export async function signAttachment(
  supabase: SupabaseClient,
  path: string | null | undefined,
  ttl: number = SIGNED_TTL
): Promise<string | null> {
  if (!path) return null
  try {
    const { data } = await supabase.storage.from(ATTACHMENT_BUCKET).createSignedUrl(path, ttl)
    return data?.signedUrl || null
  } catch {
    return null
  }
}
