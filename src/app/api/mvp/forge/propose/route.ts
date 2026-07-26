import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { reqLang, langDirectiveShort } from '@/lib/req-lang'

/**
 * POST /api/mvp/forge/propose — la Forge lit le rêve et propose 3 visions.
 * AUCUNE génération ici : consentement d'abord (1_BIBLE §1.1.bis).
 * Body: { kairos_id } → { visions: [{kind, title, brief, cost}], balance }
 * Coûts V1 : image=3 · game=8 · video=15. Yeshua, 2026-06-11 (Vague B).
 */
export const maxDuration = 30
// COSTS local (non exporté) — Next interdit les exports non-handler dans un route file
const COSTS: Record<string, number> = { image: 3, game: 8, video: 15 }

export async function OPTIONS() { return corsOptions() }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const lang = reqLang(req)
    if (!body.kairos_id) return corsify(NextResponse.json({ error: 'kairos_id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { data: k } = await supabase.from('kairos').select('id, raw_text, title, motif_tags, figures, dominant_emotion').eq('id', body.kairos_id).eq('user_id', userId).single()
    if (!k) {
      return corsify(NextResponse.json({
        error: lang === 'en' ? 'dream not found' : 'rêve introuvable',
      }, { status: 404 }))
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
    const res = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      // « transmuter » est banni à l'écran (§0.1) — on dit : ce que ce rêve peut DEVENIR.
      system: `Tu es la Forge de Dream : tu proposes ce qu'un rêve peut devenir — une image, un petit monde jouable, une scène en mouvement. Réponds UNIQUEMENT un JSON strict :
{"visions":[
 {"kind":"image","title":"3-6 mots, minuscules, poétique sobre","brief":"2 phrases : ce que l'image montrera — l'image CENTRALE du rêve, son atmosphère, sa lumière. Fidèle au rêve, jamais inventé."},
 {"kind":"game","title":"3-6 mots","brief":"2 phrases : la traversée jouable tirée du rêve — quel geste le joueur accomplit, ce que ça accomplit du rêve."},
 {"kind":"video","title":"3-6 mots","brief":"2 phrases : la scène en mouvement — quel plan, quel souffle."}
]}
Règles : minuscules naturelles, AUCUN élément absent du rêve, ton calme et incarné — pas de marketing. N'emploie jamais les mots « transmuter », « protocole », « seuil ».${langDirectiveShort(lang)}`,
      messages: [{ role: 'user', content: `Le rêve${k.title ? ` « ${k.title} »` : ''} :\n${(k.raw_text || '').slice(0, 2500)}` }],
    })
    const txt = res.content[0]?.type === 'text' ? res.content[0].text : '{}'
    let visions: any[] = []
    try { visions = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1)).visions || [] } catch {}
    visions = visions.filter(v => ['image', 'game', 'video'].includes(v.kind)).map(v => ({ ...v, cost: COSTS[v.kind] }))

    // dotation bêta + solde (le grant initial est posé par dream_spend_credits au premier passage — ici on lit)
    await supabase.rpc('dream_grant_credits', { p_user_id: userId, p_amount: 0 })
    const { data: cred } = await supabase.from('dream_credits').select('balance').eq('user_id', userId).single()

    return corsify(NextResponse.json({ visions, balance: cred?.balance ?? 0, video_available: !!process.env.HIGGSFIELD_API_KEY }))
  } catch (e: any) {
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
