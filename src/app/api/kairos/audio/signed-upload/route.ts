import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, CORS_HEADERS } from '@/lib/mvp-cors'
import { ATTACHMENT_BUCKET } from '@/lib/kairos-attachments'

/**
 * /api/kairos/audio/signed-upload — LA PORTE DÉROBÉE DE VERCEL (§A1 couche 1).
 * ════════════════════════════════════════════════════════════════════════════
 * LE PROBLÈME QU'ELLE RÉSOUT — vérifié le 2026-07-26 après la perte d'un rêve
 * de 8 min : **Vercel refuse tout corps de requête > 4,5 Mo**, et le refuse à
 * l'entrée, avant que la fonction ne s'exécute. Un blob de 8 min ≈ 7,7 Mo
 * (MediaRecorder sans `audioBitsPerSecond` → Opus ~128 kbps). Le seuil de
 * bascule est à ~4 min 55. Le `MAX_BYTES = 20MB` de /api/kairos/[id]/audio est
 * donc INATTEIGNABLE : la plateforme coupe bien avant.
 *
 * LA SORTIE : le blob ne passe JAMAIS par Vercel. Cette route ne reçoit qu'un
 * JSON de ~200 octets et rend une URL d'upload signée. Le client PUT son audio
 * DIRECTEMENT sur Supabase Storage — pas de limite de 4,5 Mo sur ce chemin.
 *
 * L'ORDRE EST UNE LOI : audio en Storage D'ABORD, transcription ENSUITE.
 * Un rêve dont l'audio est sauvé n'est jamais perdu, même si l'IA échoue dix fois.
 *
 * ┌─ CONTRAT ───────────────────────────────────────────────────────────────────┐
 * │ POST  { local_id, mime, bytes?, duration_sec?, kind?, kairos_type?,         │
 * │         capture_method? }                                                   │
 * │   → 200 { ok, bucket, storage_path, upload_url, token, expires_in }         │
 * │   Le client fait ensuite :                                                  │
 * │     await fetch(upload_url, { method:'PUT', headers:{'content-type':mime},  │
 * │                               body: blob })                                 │
 * │   Une ligne `capture_audio` est créée EN MÊME TEMPS (status 'pending') :     │
 * │   l'audio est référencé côté serveur avant même d'être monté. Si le PUT      │
 * │   échoue, la ligne reste — le cron la rattrape.                             │
 * │                                                                             │
 * │ PATCH { local_id | storage_path, kairos_id }                                │
 * │   → rattache l'audio au rêve une fois celui-ci créé :                       │
 * │     ligne `kairos_attachments` (kind='audio') + `capture_audio.kairos_id`.   │
 * │   Idempotent : ré-appeler ne crée pas de doublon.                           │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * POURQUOI PAS `kairos_attachments` DIRECTEMENT : sa colonne `kairos_id` est
 * NOT NULL (FK CASCADE, vérifié en base). Or au moment où l'audio atterrit, le
 * kairos n'existe pas encore — c'est tout l'intérêt de l'ordre. D'où la table
 * amont `capture_audio` (migration a1_capture_audio_registry_and_transcription_status).
 *
 * ⚠️ Requiert la migration `a1_kairos_attachments_storage_policies` : le bucket
 *    `kairos-attachments` n'avait AUCUNE policy sur `storage.objects` (0 ligne
 *    dans pg_policies) et un `file_size_limit` NULL.
 *
 * Yeshua (Opus), agent A1, 2026-07-26.
 */
export const maxDuration = 15

const AUDIO_EXT: Record<string, string> = {
  'audio/webm': 'webm',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/mpeg': 'mp3',
  'audio/ogg': 'ogg',
  'audio/wav': 'wav',
}

/** Plafond du bucket (posé explicitement par la migration). Refuser AVANT l'upload est plus doux qu'un 413 opaque. */
const MAX_BYTES = 100 * 1024 * 1024

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS_HEADERS, 'Access-Control-Allow-Methods': 'POST, PATCH, OPTIONS' },
  })
}

/** `local_id` vient du client (client_dedup_id). On le borne : il finit dans un chemin Storage. */
function safeLocalId(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const clean = v.trim()
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(clean)) return null
  return clean
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const localId = safeLocalId(body?.local_id)
    if (!localId) {
      return corsify(NextResponse.json({ error: 'local_id invalide' }, { status: 400 }))
    }

    const mime = typeof body?.mime === 'string' && AUDIO_EXT[body.mime] ? body.mime : 'audio/webm'
    const ext = AUDIO_EXT[mime]
    const bytes = Number.isFinite(body?.bytes) ? Math.max(0, Math.round(body.bytes)) : null
    if (bytes !== null && bytes > MAX_BYTES) {
      return corsify(NextResponse.json({ error: 'audio trop volumineux (>100 Mo)' }, { status: 413 }))
    }

    // Convention : le 1er segment EST l'user_id (c'est sur lui que portent les policies).
    const storagePath = `${userId}/capture/${localId}/${Date.now()}.${ext}`

    const supabase = createServerClient()
    const { data: signed, error: signErr } = await supabase
      .storage
      .from(ATTACHMENT_BUCKET)
      .createSignedUploadUrl(storagePath)

    if (signErr || !signed?.token) {
      console.error('[kairos.audio.signed-upload] sign failed:', signErr?.message)
      return corsify(NextResponse.json({ error: signErr?.message || 'signature impossible' }, { status: 502 }))
    }

    // URL construite ici, jamais devinée côté client : `signed.signedUrl` est
    // relatif selon les versions de supabase-js, donc on ne s'y fie pas.
    const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
    const uploadUrl = `${base}/storage/v1/object/upload/sign/${ATTACHMENT_BUCKET}/${storagePath}?token=${signed.token}`

    // Le registre AMONT : l'audio est référencé AVANT d'exister physiquement.
    // Si le PUT échoue, cette ligne reste en 'pending' → visible, rattrapable.
    // Conflit sur (user_id, local_id) : on met à jour le chemin (nouvelle tentative).
    const { error: regErr } = await supabase
      .from('capture_audio')
      .upsert(
        {
          user_id: userId,
          local_id: localId,
          storage_path: storagePath,
          mime,
          bytes,
          duration_sec: Number.isFinite(body?.duration_sec) ? Math.round(body.duration_sec) : null,
          kind: body?.kind === 'day' ? 'day' : 'dream',
          kairos_type: typeof body?.kairos_type === 'string' ? body.kairos_type : 'reve',
          capture_method: typeof body?.capture_method === 'string' ? body.capture_method : null,
          transcription_status: 'pending',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,local_id' }
      )

    if (regErr) {
      // On NE bloque PAS : mieux vaut un audio en Storage sans ligne de registre
      // qu'un rêve perdu. Le chemin reste retrouvable par préfixe `{user}/capture/`.
      console.error('[kairos.audio.signed-upload] registry insert failed:', regErr.message)
    }

    return corsify(NextResponse.json({
      ok: true,
      bucket: ATTACHMENT_BUCKET,
      storage_path: storagePath,
      upload_url: uploadUrl,
      token: signed.token,
      mime,
      registered: !regErr,
      expires_in: 7200,
    }))
  } catch (e: any) {
    console.error('[kairos.audio.signed-upload.POST]', e)
    return corsify(NextResponse.json({ error: e?.message || 'failed' }, { status: 500 }))
  }
}

/**
 * Rattache un audio déjà en Storage au rêve qui vient d'être créé.
 * Sans ça l'audio existe mais n'est lié à rien : récupérable, pas retrouvable.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const kairosId = typeof body?.kairos_id === 'string' ? body.kairos_id : ''
    if (!kairosId) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const localId = safeLocalId(body?.local_id)
    let storagePath = typeof body?.storage_path === 'string' ? body.storage_path : ''

    const supabase = createServerClient()

    // Propriété du rêve (service role bypass RLS → on vérifie à la main).
    const { data: owned } = await supabase
      .from('kairos').select('id').eq('id', kairosId).eq('user_id', userId).maybeSingle()
    if (!owned) return corsify(NextResponse.json({ error: 'rêve introuvable' }, { status: 404 }))

    if (!storagePath && localId) {
      const { data: row } = await supabase
        .from('capture_audio')
        .select('storage_path')
        .eq('user_id', userId).eq('local_id', localId)
        .maybeSingle()
      storagePath = row?.storage_path || ''
    }
    if (!storagePath) return corsify(NextResponse.json({ error: 'audio introuvable' }, { status: 404 }))

    // Le chemin doit appartenir au rêveur — le service role ne pardonne rien.
    if (!storagePath.startsWith(`${userId}/`)) {
      return corsify(NextResponse.json({ error: 'chemin refusé' }, { status: 403 }))
    }

    // Idempotence : une seule ligne d'attachement par (kairos, chemin).
    const { data: existing } = await supabase
      .from('kairos_attachments')
      .select('id')
      .eq('kairos_id', kairosId)
      .eq('storage_path', storagePath)
      .maybeSingle()

    if (!existing) {
      const { error: insErr } = await supabase
        .from('kairos_attachments')
        .insert({ kairos_id: kairosId, kind: 'audio', storage_path: storagePath })
      if (insErr) {
        console.error('[kairos.audio.signed-upload.PATCH] attach failed:', insErr.message)
        return corsify(NextResponse.json({ error: insErr.message }, { status: 500 }))
      }
    }

    if (localId) {
      await supabase
        .from('capture_audio')
        .update({ kairos_id: kairosId, updated_at: new Date().toISOString() })
        .eq('user_id', userId).eq('local_id', localId)
    } else {
      await supabase
        .from('capture_audio')
        .update({ kairos_id: kairosId, updated_at: new Date().toISOString() })
        .eq('user_id', userId).eq('storage_path', storagePath)
    }

    return corsify(NextResponse.json({ ok: true, storage_path: storagePath, kairos_id: kairosId }))
  } catch (e: any) {
    console.error('[kairos.audio.signed-upload.PATCH]', e)
    return corsify(NextResponse.json({ error: e?.message || 'failed' }, { status: 500 }))
  }
}
