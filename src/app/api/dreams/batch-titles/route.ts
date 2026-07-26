import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { requireAuth } from '@/lib/auth-server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export const maxDuration = 300

/**
 * POST /api/dreams/batch-titles
 * One-shot: génère les titres pour tous les rêves sans titre DE L'USER.
 * Utilise Haiku pour garder les coûts bas (~$0.0005 par rêve).
 *
 * 🔒 2026-04-20 FIX BRECHE : userId OBLIGATOIRE, scope user-only.
 * TODO (P0 structurel) : session Supabase server-side (cf. BREACH-2026-04-20.md)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Récupérer uniquement les rêves SANS TITRE DE L'USER
    const { data: dreams, error } = await supabase
      .from('dreams')
      .select('id, raw_text, figure_types')
      .eq('user_id', userId)
      .or('title.is.null,title.eq.')
      .not('raw_text', 'is', null)
      .limit(100)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    if (!dreams || dreams.length === 0) {
      return NextResponse.json({ ok: true, count: 0, message: 'All dreams already have titles' })
    }

    // Parallelize all Haiku title calls — Haiku is fast and cheap, no reason to serialize.
    // Concurrency cap at 10 to avoid Anthropic rate-limit on large batches.
    const CONCURRENCY = 10
    const results: Array<{ id: string; title: string }> = []
    let generated = 0

    for (let i = 0; i < dreams.length; i += CONCURRENCY) {
      const batch = dreams.slice(i, i + CONCURRENCY)
      const batchResults = await Promise.allSettled(
        batch.map(async (dream) => {
          const textPreview = dream.raw_text.substring(0, 500)
          const figures = Array.isArray(dream.figure_types)
            ? dream.figure_types.slice(0, 3).map((f: any) => f.name).join(', ')
            : ''

          const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 50,
            messages: [{
              role: 'user',
              content: `Donne un titre poétique et évocateur (3-8 mots, en français) pour ce rêve. Juste le titre, rien d'autre.

${figures ? `Figures principales : ${figures}\n` : ''}
Texte : ${textPreview}`,
            }],
          })

          const title = response.content[0].type === 'text'
            ? response.content[0].text.trim().replace(/^["«]|["»]$/g, '')
            : null

          if (title && title.length > 2 && title.length < 100) {
            // 🔒 Double filtre id + user_id au update
            await supabase
              .from('dreams')
              .update({ title, updated_at: new Date().toISOString() })
              .eq('id', dream.id)
              .eq('user_id', userId)

            return { id: dream.id, title }
          }
          return null
        })
      )

      for (const r of batchResults) {
        if (r.status === 'fulfilled' && r.value) {
          results.push(r.value)
          generated++
        } else if (r.status === 'rejected') {
          console.error(`[BatchTitles] Failed:`, r.reason?.message)
        }
      }
    }

    return NextResponse.json({ ok: true, total: dreams.length, generated, results })
  } catch (error: any) {
    console.error('[BatchTitles] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
