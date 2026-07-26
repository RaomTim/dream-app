import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, updatePersonalForest } from '@/lib/supabase'
import { extractEntities } from '@/lib/ai-router'
import { requireAuth } from '@/lib/auth-server'

// Garantir que la serverless function a le temps de finir les 3 passes
// Hobby = max 10s (trop court), Pro = max 60s. Cap à 60 pour safety.
export const maxDuration = 60

/**
 * POST /api/dreams/extract
 * Pipeline d'intelligence en 3 passes — SYNCHRONE depuis 2026-04-20.
 *
 * PASSE 1 — Haiku : titre + date + mood + entités (~$0.001, ~1s)
 * PASSE 2 — Sonnet (analyse profonde archétypale) (~4-6s)
 * PASSE 3 — OpenAI embedding (vecteur 1536 dims) (~300ms)
 *
 * ~6-8s total. Passé en synchrone car le pattern fire-and-forget précédent
 * était tué par Vercel avant completion (cause root des 11 rêves sans embedding).
 *
 * UX : afficher "je lis ton rêve..." pendant l'attente. C'est désirable — ça
 * sacralise le dépôt et garantit que les échos sont immédiatement disponibles.
 */

async function runDeepPipeline(dreamId: string, entryType: string, baseUrl: string, userId: string) {
  const headers = { 'Content-Type': 'application/json' }
  const result = { passe2: false, passe3: false, errors: [] as string[] }

  // Passes 2 (Sonnet deep analysis) and 3 (OpenAI embedding) are independent —
  // run them in parallel to cut ~300ms off the pipeline.
  const [deepResult, embResult] = await Promise.allSettled([
    fetch(`${baseUrl}/api/dreams/extract-deep`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ dreamId, entryType, userId }),
    }),
    fetch(`${baseUrl}/api/dreams/embed`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ dreamId, userId }),
    }),
  ])

  if (deepResult.status === 'fulfilled') {
    if (deepResult.value.ok) {
      result.passe2 = true
    } else {
      result.errors.push(`passe2 ${deepResult.value.status}`)
      console.error(`[Pipeline] Passe 2 failed for ${dreamId}: ${deepResult.value.status}`)
    }
  } else {
    result.errors.push(`passe2 ${deepResult.reason?.message}`)
    console.error(`[Pipeline] Passe 2 error for ${dreamId}:`, deepResult.reason?.message)
  }

  if (embResult.status === 'fulfilled') {
    if (embResult.value.ok) {
      result.passe3 = true
    } else {
      result.errors.push(`passe3 ${embResult.value.status}`)
      console.error(`[Pipeline] Passe 3 failed for ${dreamId}: ${embResult.value.status}`)
    }
  } else {
    result.errors.push(`passe3 ${embResult.reason?.message}`)
    console.error(`[Pipeline] Passe 3 error for ${dreamId}:`, embResult.reason?.message)
  }

  if (result.passe2 && result.passe3) {
    console.log(`[Pipeline] 3 passes terminées pour ${dreamId}`)
  }
  return result
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dreamId } = body

    if (!dreamId) {
      return NextResponse.json({ error: 'dreamId required' }, { status: 400 })
    }

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 Récupérer le rêve SEULEMENT s'il appartient à userId
    const { data: dream, error } = await supabase
      .from('dreams')
      .select('id, raw_text, entry_type, title')
      .eq('id', dreamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !dream?.raw_text) {
      return NextResponse.json({ error: 'Dream not found or empty' }, { status: 404 })
    }

    // ═══════════════════════════════════════════
    // PASSE 1 — Haiku : titre + date + mood + entités (~$0.001)
    // ═══════════════════════════════════════════
    const extraction = await extractEntities(dream.raw_text)

    if (extraction && Object.keys(extraction).length > 0) {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }

      // Titre — seulement si pas déjà un
      if (extraction.title && !dream.title) {
        updateData.title = extraction.title
      }

      // Mood
      if (extraction.mood) {
        updateData.mood = extraction.mood
      }

      // Date extraite du contenu ("cette nuit", "mardi dernier", etc.)
      if (extraction.dream_date) {
        updateData.dream_date = extraction.dream_date
      }

      // Entités
      if (extraction.entities && Object.keys(extraction.entities).length > 0) {
        updateData.entities = extraction.entities

        // Mettre à jour la personal_forest
        if (userId) {
          await updatePersonalForest(supabase, userId, extraction.entities, dreamId)
        }
      }

      // 🔒 Double filtre id + user_id au update
      await supabase
        .from('dreams')
        .update(updateData)
        .eq('id', dreamId)
        .eq('user_id', userId)
    }

    // ═══════════════════════════════════════════
    // PASSES 2+3 — SYNCHRONE (Sonnet + embedding)
    // ═══════════════════════════════════════════
    const baseUrl = req.nextUrl.origin
    const pipelineResult = await runDeepPipeline(dreamId, dream.entry_type || 'dream', baseUrl, userId)

    return NextResponse.json({
      ok: true,
      extraction,
      pipeline: pipelineResult,
    })
  } catch (error: any) {
    console.error('Extract error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
