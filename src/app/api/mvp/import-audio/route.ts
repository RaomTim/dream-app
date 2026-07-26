import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { ATTACHMENT_BUCKET } from '@/lib/kairos-attachments'

/**
 * POST /api/mvp/import-audio — Import Hub+ (§12ter.E, braindump Tim juillet).
 *
 * Crée UN kairos importé, du TYPE choisi, avec (optionnellement) le mémo vocal
 * d'origine gardé en pièce jointe. Sœur de /api/mvp/import (qui reste le chemin
 * batch pour les rêves collés), mais elle :
 *   1. accepte un `type` (rêve par défaut) — le lot audio ou la récolte « autres IA »
 *      n'est pas toujours du rêve (note de jour / cœur, signe…) ;
 *   2. persiste l'audio original (bucket privé `kairos-attachments`, kind='audio'),
 *      même pattern que /api/kairos/[id]/audio — le mémo n'est plus jeté après
 *      transcription. Best-effort : si l'upload échoue, le kairos texte reste intact.
 *
 * L'enrichissement (motifs/figures → univers onirique) se fait en différé via
 * /api/mvp/enrich-batch, exactement comme l'import texte.
 *
 * Deux formes de corps :
 *   • multipart/form-data : champ `audio` (File, facultatif) + `text` + `type` + `date?` + `title?`
 *   • application/json     : { text, type, date?, title? }  (récolte « autres IA », sans audio)
 *
 * → 200 { id, imported: 1, audio_saved: boolean }
 *
 * Yeshua (Opus), 2026-07-23 — chantier Import Hub+.
 */
export const maxDuration = 60

// même whitelist que /api/kairos/[id] (post-submit chips) — la source de vérité des types
const KAIROS_TYPES = ['reve', 'signe', 'reverie', 'hypnagogie', 'synchronicite', 'frisson', 'note_jour']

const AUDIO_EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
}
// cap l'audio persisté à 25 Mo (le client filtre déjà en amont ; garde-fou serveur)
const MAX_AUDIO_BYTES = 25 * 1024 * 1024

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    let text = ''
    let title: string | null = null
    let type = 'reve'
    let dateRaw = ''
    let audioBuf: Buffer | null = null
    let audioMime = 'audio/webm'
    let bodyForAuth: any = undefined

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const f = form.get('audio')
      if (f && typeof f !== 'string') {
        audioMime = f.type || 'audio/webm'
        // borne AVANT de matérialiser le buffer (best-effort si trop gros : on garde le texte)
        if (f.size <= MAX_AUDIO_BYTES) {
          audioBuf = Buffer.from(await f.arrayBuffer())
        }
      }
      text = String(form.get('text') || '')
      title = form.get('title') ? String(form.get('title')).trim().slice(0, 120) || null : null
      type = String(form.get('type') || 'reve')
      dateRaw = String(form.get('date') || '')
    } else {
      bodyForAuth = await req.json().catch(() => ({}))
      text = typeof bodyForAuth?.text === 'string' ? bodyForAuth.text : ''
      title = typeof bodyForAuth?.title === 'string' ? bodyForAuth.title.trim().slice(0, 120) || null : null
      type = typeof bodyForAuth?.type === 'string' ? bodyForAuth.type : 'reve'
      dateRaw = typeof bodyForAuth?.date === 'string' ? bodyForAuth.date : ''
    }

    const auth = await requireAuth(req, bodyForAuth)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const clean = text.trim()
    if (clean.length < 10) {
      return corsify(NextResponse.json({ error: 'texte trop court (min 10 caractères)' }, { status: 400 }))
    }

    const kairosType = KAIROS_TYPES.includes(type) ? type : 'reve'
    const date = dateRaw && !isNaN(Date.parse(dateRaw)) ? new Date(dateRaw).toISOString() : null

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('kairos')
      .insert({
        user_id: userId,
        raw_text: clean,
        title,
        kairos_type: kairosType,
        capture_method: 'import_hub',
        figures: [],
        ...(date ? { created_at: date } : {}),
      })
      .select('id')
      .single()
    if (error || !data?.id) {
      return corsify(NextResponse.json({ error: error?.message || 'insert échoué' }, { status: 500 }))
    }
    const kairosId = data.id

    // ── pièce jointe audio (best-effort — jamais bloquant, cf. contrat /api/kairos/[id]/audio) ──
    let audioSaved = false
    if (audioBuf && audioBuf.length >= 800) {
      try {
        const ext = AUDIO_EXT[audioMime] || 'webm'
        const upMime = AUDIO_EXT[audioMime] ? audioMime : 'audio/webm'
        const storagePath = `${userId}/kairos/${kairosId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from(ATTACHMENT_BUCKET)
          .upload(storagePath, audioBuf, { contentType: upMime, upsert: false })
        if (!upErr) {
          const { error: insErr } = await supabase
            .from('kairos_attachments')
            .insert({ kairos_id: kairosId, kind: 'audio', storage_path: storagePath })
          audioSaved = !insErr
          if (insErr) console.error('[mvp.import-audio] attachment insert failed:', insErr.message)
        } else {
          console.error('[mvp.import-audio] upload failed:', upErr.message)
        }
      } catch (e: any) {
        console.error('[mvp.import-audio] attachment error:', e?.message)
      }
    }

    return corsify(NextResponse.json({ id: kairosId, imported: 1, audio_saved: audioSaved }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
