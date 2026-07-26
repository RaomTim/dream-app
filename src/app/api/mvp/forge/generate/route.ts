import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, LANG_NAME } from '@/lib/req-lang'

/**
 * POST /api/mvp/forge/generate — la création, APRÈS consentement.
 * Body: { kairos_id, kind: 'image'|'game'|'video', vision_title, vision_brief }
 * Débit atomique (échec si solde insuffisant) → génération → Storage → œuvre.
 * Remboursement automatique si la génération échoue. Yeshua, 2026-06-11 (Vague B).
 */
export const maxDuration = 60
const COSTS: Record<string, number> = { image: 3, game: 8, video: 15 }
const ADMIN_IDS = new Set(['342cf663-eed3-40c9-9327-4bf1c3c998b9']) // gestion@infuse.earth (Tim) — Forge illimitée

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  let charged = 0
  let userIdRef: string | null = null
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    userIdRef = userId
    const lang = reqLang(req)
    const en = lang === 'en'

    const kind = body.kind as string
    if (!body.kairos_id || !['image', 'game', 'video'].includes(kind)) return corsify(NextResponse.json({ error: 'kairos_id et kind requis' }, { status: 400 }))
    if (kind === 'video' && !process.env.HIGGSFIELD_API_KEY) {
      return corsify(NextResponse.json({
        error: en ? 'video is coming soon — the forge is waiting for its key' : 'la vidéo arrive bientôt — la forge attend sa clé',
      }, { status: 501 }))
    }

    const { data: k } = await supabase.from('kairos').select('id, raw_text, title').eq('id', body.kairos_id).eq('user_id', userId).single()
    if (!k) return corsify(NextResponse.json({ error: en ? 'dream not found' : 'rêve introuvable' }, { status: 404 }))

    // Forge gating (2026-06-17) : Tim (admin) illimité ; autres = paywall "bientôt" (maîtrise du coût compute)
    const isAdmin = ADMIN_IDS.has(userId)
    if (!isAdmin) {
      return corsify(NextResponse.json({
        error: en ? 'the Forge opens soon — just a little more patience' : 'la Forge s\'ouvre bientôt — encore un peu de patience',
      }, { status: 403 }))
    }
    const cost = COSTS[kind] // admin : pas de débit (illimité)

    const slug = `${kind}-${Math.random().toString(36).slice(2, 10)}`
    const brief = (body.vision_brief || '').slice(0, 500)
    const dreamTxt = (k.raw_text || '').slice(0, 2200)
    let assetUrl = ''

    if (kind === 'image') {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
      const prompt = `Dreamlike fine-art image, warm ember-and-gold palette on deep darkness, painterly, intimate, no text. Scene from a real dream: ${brief}\nDream excerpt (mood reference): ${dreamTxt.slice(0, 700)}`
      const img = await openai.images.generate({ model: 'gpt-image-1', prompt, size: '1024x1024' } as any)
      const b64 = (img.data?.[0] as any)?.b64_json
      if (!b64) throw new Error('image vide')
      const buf = Buffer.from(b64, 'base64')
      const path = `${userId}/${slug}.png`
      const { error: upErr } = await supabase.storage.from('forge').upload(path, buf, { contentType: 'image/png', upsert: true })
      if (upErr) throw upErr
      assetUrl = supabase.storage.from('forge').getPublicUrl(path).data.publicUrl
    }

    if (kind === 'game') {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
      const res = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 14000,
        system: `Tu génères un mini-jeu HTML self-contained (UN seul fichier, AUCUNE dépendance externe sauf Google Fonts Fraunces+Inter) à partir d'un rêve réel. Canvas 2D, mobile-first (tap) + desktop (clic/espace), ~340x560. Esthétique : near-black chaud (#1a1310→#160d0a), braise/or #e8a865, crème #fbeeda, Fraunces italique pour les textes. Structure : écran-titre (titre du jeu + 1 phrase du rêve + une invite du type "toucher pour entrer") → mécanique SIMPLE et fidèle aux images du rêve (timing, rythme, traversée…) en 2-3 étapes nommées avec les mots du rêve → fin contemplative (citation courte du rêve, une invite du type "rêver encore" = reload). INTERDITS : score chiffré, game over punitif, emoji, éléments absents du rêve. Réponds UNIQUEMENT le HTML complet (<!DOCTYPE html>…), aucun markdown.

LANGUE DU JEU : TOUS les textes affichés dans le jeu (titre, invites, noms d'étapes, fin) sont en ${LANG_NAME[lang]} — c'est la langue du RÊVEUR, pas celle du texte du rêve. Si le rêve est écrit dans une autre langue, tu rends ses images en ${LANG_NAME[lang]}. Mets aussi lang="${lang}" sur la balise <html>.`,
        messages: [{ role: 'user', content: `La quête choisie : ${body.vision_title || ''} — ${brief}\n\nLe rêve :\n${dreamTxt}` }],
      })
      const html = res.content[0]?.type === 'text' ? res.content[0].text : ''
      if (!html.toLowerCase().includes('<!doctype') && !html.toLowerCase().includes('<html')) throw new Error('jeu invalide')
      const path = `${userId}/${slug}.html`
      const { error: upErr } = await supabase.storage.from('forge').upload(path, Buffer.from(html, 'utf-8'), { contentType: 'text/html; charset=utf-8', upsert: true })
      if (upErr) throw upErr
      assetUrl = supabase.storage.from('forge').getPublicUrl(path).data.publicUrl
    }

    const { data: work, error: wErr } = await supabase.from('forge_works').insert({
      user_id: userId, kairos_id: k.id, kind, status: 'done',
      vision_title: body.vision_title || null, vision_brief: brief || null,
      asset_url: assetUrl, share_slug: slug, cost,
    }).select('id, share_slug, asset_url, kind, vision_title').single()
    if (wErr) throw wErr

    const { data: cred } = await supabase.from('dream_credits').select('balance').eq('user_id', userId).single()
    return corsify(NextResponse.json({ work, balance: cred?.balance ?? 0 }))
  } catch (e: any) {
    // remboursement si débit effectué
    if (charged > 0 && userIdRef) { try { await supabase.rpc('dream_grant_credits', { p_user_id: userIdRef, p_amount: charged }) } catch {} }
    console.error('[forge.generate]', e)
    return corsify(NextResponse.json({ error: 'la forge n’a pas pu achever l’œuvre — tes crédits sont rendus' }, { status: 500 }))
  }
}
