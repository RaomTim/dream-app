import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, LANG_NAME, type DreamLang } from '@/lib/req-lang'

/**
 * POST /api/mvp/scan — Scanner le carnet (écran A5).
 *
 * Body: { image: string (base64, avec ou sans préfixe data:), mime?: string }
 * Succès (200): { text, confidence: 'high'|'low', storage_path: string|null }
 * Échec de lecture (422): { error } — l'écriture manuscrite n'a pas pu être lue.
 *
 * Flow : vision (claude sonnet, même pattern que mvp/interpret) → transcription
 * fidèle (JSON strict) → upload best-effort de la photo dans Storage (bucket
 * `kairos-attachments` — à créer manuellement, non couvert par cette route ni
 * par la migration SQL associée).
 *
 * Yeshua (Sonnet), 2026-07-11 — DREAM-MVP-SPEC-ECRANS-A-Z.md §A5.
 */
export const maxDuration = 45

const MAX_BYTES = 8 * 1024 * 1024 // 8MB décodé — largement suffisant pour une photo de page
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

/**
 * ⚠️ Route de FIDÉLITÉ — elle ne traduit JAMAIS.
 * Une page de carnet est le TEXTE DU RÊVEUR : on la restitue dans la langue où elle a
 * été écrite, même si le rêveur lit l'app dans une autre langue. La langue de l'UI ne
 * sert que d'indice quand une écriture est ambiguë.
 * (Avant le 2026-07-11, ce prompt annonçait « texte manuscrit français » — un carnet
 * anglais était donc lu de travers. Corrigé : la langue n'est plus présupposée.)
 */
const systemFor = (lang: DreamLang) => `Tu transcris fidèlement une page manuscrite — un carnet de rêves. La page peut être écrite dans n'importe quelle langue.

RÈGLES (non négociables) :
- Transcris EXACTEMENT ce qui est écrit, DANS LA LANGUE OÙ C'EST ÉCRIT. Ne traduis JAMAIS.
- Ne corrige jamais l'orthographe, la ponctuation ou le style.
- Ne devine jamais un mot illisible : utilise […] pour un passage vraiment illisible.
- Ignore ce qui n'est pas du texte (marges, taches, numéros de page, dessins).
- Réponds UNIQUEMENT avec un JSON strict, rien autour : {"text": "...", "confidence": "high"|"low"}.
- "confidence":"low" si une partie significative est difficile à lire, ou si l'écriture est très dense/rapide.
- Si la page est illisible dans son ensemble (flou, trop sombre, pas de texte visible) : {"text": "", "confidence": "low"}.

INDICE (jamais une contrainte) : ce rêveur utilise l'app en ${LANG_NAME[lang]}. En cas de doute sur un mot ambigu, penche pour le ${LANG_NAME[lang]} — mais si la page est manifestement écrite dans une autre langue, respecte-la.`

export async function OPTIONS() {
  return corsOptions()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const lang = reqLang(req)

    const rawImage = typeof body.image === 'string' ? body.image : ''
    const image = rawImage.replace(/^data:[^;]+;base64,/, '')
    if (!image) {
      return corsify(NextResponse.json({
        error: lang === 'en' ? 'image required' : 'image requise',
      }, { status: 400 }))
    }
    const mime = ALLOWED_MIME.includes(body.mime) ? body.mime : 'image/jpeg'

    const approxBytes = Math.ceil((image.length * 3) / 4)
    if (approxBytes > MAX_BYTES) {
      return corsify(NextResponse.json({
        error: lang === 'en' ? 'photo too heavy (max 8MB)' : 'photo trop lourde (max 8MB)',
      }, { status: 413 }))
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: systemFor(lang),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mime as any, data: image } },
            { type: 'text', text: 'Transcris cette page.' },
          ] as any,
        },
      ],
    })

    const raw = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
    let parsed: { text?: string; confidence?: string } = {}
    try {
      parsed = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1))
    } catch {
      parsed = {}
    }
    const text = (parsed.text || '').trim()

    if (text.length < 3) {
      return corsify(NextResponse.json({
        error: lang === 'en' ? 'couldn’t read this page' : 'lecture impossible',
      }, { status: 422 }))
    }
    const confidence = parsed.confidence === 'low' ? 'low' : 'high'

    // Upload best-effort de la photo (pattern forge/generate : buffer → storage.from(bucket)).
    // Non bloquant : si l'upload échoue, la lecture reste utilisable — juste sans pièce jointe.
    let storagePath: string | null = null
    try {
      const supabase = createServerClient()
      const buf = Buffer.from(image, 'base64')
      const ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg'
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('kairos-attachments')
        .upload(path, buf, { contentType: mime, upsert: false })
      if (!upErr) storagePath = path
      else console.error('[mvp.scan] storage upload failed:', upErr.message)
    } catch (e: any) {
      console.error('[mvp.scan] storage upload error:', e.message)
    }

    return corsify(NextResponse.json({ text, confidence, storage_path: storagePath }))
  } catch (e: any) {
    console.error('[mvp.scan]', e)
    return corsify(NextResponse.json({ error: e.message || 'la lecture a échoué' }, { status: 500 }))
  }
}
