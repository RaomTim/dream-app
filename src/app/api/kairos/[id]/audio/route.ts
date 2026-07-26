import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, CORS_HEADERS } from '@/lib/mvp-cors'
import { ATTACHMENT_BUCKET, signAttachment } from '@/lib/kairos-attachments'

/**
 * /api/kairos/[id]/audio — AUDIO PERSISTANT du rêve (§12ter.D).
 *
 * Garde le mémo vocal d'origine d'un rêve en pièce jointe (bucket privé
 * `kairos-attachments`, table kairos_attachments kind='audio'). Owner-only :
 * le service role bypass RLS → on vérifie kairos.user_id à la main.
 *
 * ┌─ CONTRAT POUR LE FLUX DE CAPTURE (agent J2) ────────────────────────────────┐
 * │ Après avoir créé le kairos (POST /api/kairos), appeler CETTE route en        │
 * │ best-effort — jamais bloquant : si elle échoue, le rêve (texte + transcription)│
 * │ reste intact. Le blob vocal ne doit PLUS être jeté après transcription.      │
 * │                                                                              │
 * │ POST /api/kairos/{kairosId}/audio                                            │
 * │   Deux formats acceptés :                                                    │
 * │   1) multipart/form-data, champ `audio` = le Blob/File (webm ou m4a)  ← reco │
 * │        const fd = new FormData()                                             │
 * │        fd.append('audio', new File([blob], 'dream.webm', { type: blob.type }))│
 * │        await api(`/api/kairos/${id}/audio`, { method:'POST', body: fd }, session)│
 * │   2) application/json { audio: <base64 data-uri ou brut>, mime?: string }    │
 * │   → 200 { ok:true, storage_path, audio_url }                                 │
 * │                                                                              │
 * │ Un seul audio « canonique » par rêve suffit (le dépôt). Ré-appeler ajoute    │
 * │ une nouvelle ligne ; GET renvoie toujours la plus récente.                   │
 * └──────────────────────────────────────────────────────────────────────────────┘
 *
 * GET  /api/kairos/{kairosId}/audio → { audio_url, mime, storage_path } | { audio_url:null }
 *      (URL signée 1h pour rejouer l'audio sur la fiche rêve J3).
 *
 * ⚠️ Requiert la migration 2026-07-22_kairos_audio.sql (CHECK kind IN ('photo','audio'))
 *    appliquée — sinon l'INSERT kind='audio' est rejeté par la contrainte.
 *
 * Yeshua (Opus), 2026-07-22.
 */
export const maxDuration = 30

const AUDIO_EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
}
const MAX_BYTES = 20 * 1024 * 1024 // ~20MB : un rêve dit à voix, pas un fichier

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: { ...CORS_HEADERS, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' } })
}

// Vérifie que le kairos appartient bien au rêveur (service role bypass RLS)
async function ownsKairos(supabase: ReturnType<typeof createServerClient>, kairosId: string, userId: string): Promise<boolean> {
  const { data } = await supabase.from('kairos').select('id').eq('id', kairosId).eq('user_id', userId).single()
  return !!data
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const kairosId = params.id
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    // Récupère l'audio (multipart de préférence, sinon base64 JSON) + auth.
    let buf: Buffer | null = null
    let mime = 'audio/webm'
    let bodyForAuth: any = undefined

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const file = form.get('audio')
      if (file && typeof file !== 'string') {
        mime = file.type || 'audio/webm'
        const ab = await file.arrayBuffer()
        buf = Buffer.from(ab)
      }
    } else {
      bodyForAuth = await req.json().catch(() => ({}))
      const b64 = typeof bodyForAuth?.audio === 'string' ? bodyForAuth.audio.replace(/^data:[^;]+;base64,/, '') : ''
      if (b64) buf = Buffer.from(b64, 'base64')
      if (typeof bodyForAuth?.mime === 'string') mime = bodyForAuth.mime
    }

    const auth = await requireAuth(req, bodyForAuth)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!buf || buf.length < 800) return corsify(NextResponse.json({ error: 'audio manquant ou vide' }, { status: 400 }))
    if (buf.length > MAX_BYTES) return corsify(NextResponse.json({ error: 'audio trop volumineux' }, { status: 413 }))

    const supabase = createServerClient()
    if (!(await ownsKairos(supabase, kairosId, userId))) {
      return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))
    }

    const ext = AUDIO_EXT[mime] || 'webm'
    const contentTypeUp = AUDIO_EXT[mime] ? mime : 'audio/webm'
    const storagePath = `${userId}/kairos/${kairosId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const { error: upErr } = await supabase.storage.from(ATTACHMENT_BUCKET).upload(storagePath, buf, { contentType: contentTypeUp, upsert: false })
    if (upErr) {
      console.error('[kairos.audio.POST] upload failed:', upErr.message)
      return corsify(NextResponse.json({ error: 'upload échoué' }, { status: 502 }))
    }

    const { error: insErr } = await supabase
      .from('kairos_attachments')
      .insert({ kairos_id: kairosId, kind: 'audio', storage_path: storagePath })
    if (insErr) {
      // La contrainte CHECK rejette 'audio' si la migration n'est pas appliquée → on le signale clairement.
      console.error('[kairos.audio.POST] attachment insert failed:', insErr.message)
      return corsify(NextResponse.json({ error: insErr.message }, { status: 500 }))
    }

    const audio_url = await signAttachment(supabase, storagePath)
    return corsify(NextResponse.json({ ok: true, storage_path: storagePath, audio_url }))
  } catch (e: any) {
    console.error('[kairos.audio.POST]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const kairosId = params.id
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    if (!(await ownsKairos(supabase, kairosId, userId))) {
      return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))
    }

    const { data } = await supabase
      .from('kairos_attachments')
      .select('storage_path, created_at')
      .eq('kairos_id', kairosId)
      .eq('kind', 'audio')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!data?.storage_path) return corsify(NextResponse.json({ audio_url: null }))

    const audio_url = await signAttachment(supabase, data.storage_path)
    const ext = data.storage_path.split('.').pop() || 'webm'
    const mime = Object.entries(AUDIO_EXT).find(([, e]) => e === ext)?.[0] || 'audio/webm'
    return corsify(NextResponse.json({ audio_url, mime, storage_path: data.storage_path }))
  } catch (e: any) {
    console.error('[kairos.audio.GET]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
