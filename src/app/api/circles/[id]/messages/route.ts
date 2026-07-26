import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * 2026-07-11 — Yeshua (Opus) — SPEC §4 G4 (chat humain de groupe)
 *
 * Le chat entre humains d'un groupe : texte + vocaux + photos.
 * ⚠️ ZÉRO IA, ZÉRO transcription, ZÉRO apprentissage — c'est chez eux, pas chez Dream.
 * (À NE PAS confondre avec circles/[id]/chat/converse = conversation avec l'IA.)
 *
 * Les vocaux sont uploadés dans le storage privé `circle-media` façon Telegram
 * (audio brut, jamais transcrit) et servis via signed URL courte.
 *
 * GET  /api/circles/[id]/messages?cursor=<iso>&limit=30
 *      → page de messages (les plus récents d'abord côté requête, renvoyés en ordre
 *        chronologique croissant), + author_name résolu + media_url signé.
 * POST /api/circles/[id]/messages
 *      · JSON       { kind:'text', body:'...' }
 *      · multipart  kind=audio|photo + file=<blob>  (upload storage, pas de transcription)
 */

const SIGNED_TTL = 60 * 60 // 1h

async function assertMember(supabase: any, circleId: string, userId: string) {
  const { data } = await supabase
    .from('circle_members')
    .select('id')
    .eq('circle_id', circleId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}

// Résout un libellé d'auteur : alias du membre dans CE groupe, sinon fallback court.
async function buildAuthorMap(supabase: any, circleId: string): Promise<Record<string, string>> {
  const { data: members } = await supabase
    .from('circle_members')
    .select('user_id, display_name, pseudonym')
    .eq('circle_id', circleId)
  const map: Record<string, string> = {}
  for (const m of members || []) {
    map[m.user_id] = (m.display_name || m.pseudonym || '').trim() || 'Un rêveur'
  }
  return map
}

async function signMedia(supabase: any, path: string | null): Promise<string | null> {
  if (!path) return null
  const { data } = await supabase.storage.from('circle-media').createSignedUrl(path, SIGNED_TTL)
  return data?.signedUrl || null
}

// GET — page de messages (cursor = created_at ISO ; renvoie les plus anciens que le curseur)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()
    if (!(await assertMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const cursor = searchParams.get('cursor')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '30', 10) || 30, 1), 80)

    let q = supabase
      .from('circle_messages')
      .select('id, circle_id, user_id, kind, body, storage_path, created_at')
      .eq('circle_id', params.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (cursor) q = q.lt('created_at', cursor)

    const { data: rows, error } = await q
    if (error) throw error

    const authorMap = await buildAuthorMap(supabase, params.id)

    // signer les media en parallèle
    const withMedia = await Promise.all(
      (rows || []).map(async (m: any) => ({
        id: m.id,
        user_id: m.user_id,
        kind: m.kind,
        body: m.body,
        created_at: m.created_at,
        is_me: m.user_id === userId,
        author_name: authorMap[m.user_id] || 'Un rêveur',
        media_url: m.kind === 'text' ? null : await signMedia(supabase, m.storage_path),
      }))
    )

    // ordre chronologique croissant pour l'affichage
    const messages = withMedia.reverse()
    const nextCursor = (rows && rows.length === limit) ? rows[rows.length - 1].created_at : null

    return NextResponse.json({ messages, nextCursor })
  } catch (e: any) {
    console.error('[circle/messages GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// POST — texte (JSON) ou audio/photo (multipart, upload storage sans transcription)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contentType = req.headers.get('content-type') || ''
    const supabase = createServerClient()

    // ── Branche MULTIPART : audio / photo ──────────────────────────────────
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      const userIdFromForm = (form.get('userId') as string) || undefined
      const auth = await requireAuth(req, { userId: userIdFromForm })
      if ('error' in auth) return auth.error
      const { userId } = auth

      if (!(await assertMember(supabase, params.id, userId))) {
        return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
      }

      const kind = (form.get('kind') as string) || 'audio'
      if (kind !== 'audio' && kind !== 'photo') {
        return NextResponse.json({ error: "kind must be 'audio' or 'photo' for uploads" }, { status: 400 })
      }
      const file = form.get('file') as File | null
      if (!file) {
        return NextResponse.json({ error: 'file required' }, { status: 400 })
      }

      const mime = file.type || (kind === 'audio' ? 'audio/webm' : 'image/jpeg')
      const ext =
        mime.includes('mp4') ? 'mp4'
        : mime.includes('mpeg') ? 'mp3'
        : mime.includes('ogg') ? 'ogg'
        : mime.includes('webm') ? 'webm'
        : mime.includes('png') ? 'png'
        : mime.includes('webp') ? 'webp'
        : kind === 'audio' ? 'webm' : 'jpg'
      const path = `${params.id}/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const buf = Buffer.from(await file.arrayBuffer())
      const { error: upErr } = await supabase.storage
        .from('circle-media')
        .upload(path, buf, { contentType: mime, upsert: false })
      if (upErr) throw upErr

      const { data: inserted, error: insErr } = await supabase
        .from('circle_messages')
        .insert({ circle_id: params.id, user_id: userId, kind, storage_path: path })
        .select('id, user_id, kind, body, created_at')
        .single()
      if (insErr) throw insErr

      const authorMap = await buildAuthorMap(supabase, params.id)
      return NextResponse.json({
        message: {
          ...inserted,
          is_me: true,
          author_name: authorMap[userId] || 'Un rêveur',
          media_url: await signMedia(supabase, path),
        },
      }, { status: 201 })
    }

    // ── Branche JSON : texte ───────────────────────────────────────────────
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!(await assertMember(supabase, params.id, userId))) {
      return NextResponse.json({ error: 'Not member of circle' }, { status: 403 })
    }

    const text = typeof body.body === 'string' ? body.body.trim() : ''
    if (!text) {
      return NextResponse.json({ error: 'body required for a text message' }, { status: 400 })
    }
    if (text.length > 4000) {
      return NextResponse.json({ error: 'message trop long (max 4000)' }, { status: 400 })
    }

    const { data: inserted, error: insErr } = await supabase
      .from('circle_messages')
      .insert({ circle_id: params.id, user_id: userId, kind: 'text', body: text })
      .select('id, user_id, kind, body, created_at')
      .single()
    if (insErr) throw insErr

    const authorMap = await buildAuthorMap(supabase, params.id)
    return NextResponse.json({
      message: {
        ...inserted,
        is_me: true,
        author_name: authorMap[userId] || 'Un rêveur',
        media_url: null,
      },
    }, { status: 201 })
  } catch (e: any) {
    console.error('[circle/messages POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
