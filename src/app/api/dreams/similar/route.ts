import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/dreams/similar
 *
 * Trouve les rêves les plus similaires via pgvector cosine similarity.
 * Utilise l'embedding du rêve source pour trouver les voisins proches.
 *
 * Body: { dreamId, userId, limit? }
 * Returns: { similar: Dream[] }
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dreamId, limit = 5 } = body

    if (!dreamId) {
      return NextResponse.json({ error: 'dreamId required' }, { status: 400 })
    }

    // 🔒 2026-04-23 TIER 2 : Bearer auth migration
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // 🔒 2026-04-20 FIX BRECHE : le rêve source doit appartenir à userId
    // (sinon on pouvait pivoter sur l'embedding du rêve d'autrui)
    const { data: source, error: sourceError } = await supabase
      .from('dreams')
      .select('id, embedding')
      .eq('id', dreamId)
      .eq('user_id', userId)
      .maybeSingle()

    if (sourceError || !source) {
      return NextResponse.json({ error: 'Dream not found' }, { status: 404 })
    }

    if (!source.embedding) {
      return NextResponse.json({
        similar: [],
        message: 'Ce rêve n\'a pas encore d\'embedding. Il sera disponible après le pipeline.',
      })
    }

    // Use RPC to find similar dreams by cosine similarity
    try {
      const { data, error } = await supabase.rpc('find_similar_dreams', {
        p_embedding: source.embedding,
        p_user_id: userId,
        p_exclude_id: dreamId,
        p_limit: limit,
      })

      if (error) {
        // RPC might not exist yet — fallback to basic tag matching
        console.warn('[Similar] RPC find_similar_dreams not found, falling back to tag matching:', error.message)
        return await fallbackTagMatch(supabase, dreamId, userId, limit)
      }

      return NextResponse.json({ similar: data || [] })
    } catch {
      // Fallback if RPC doesn't exist
      return await fallbackTagMatch(supabase, dreamId, userId, limit)
    }
  } catch (error: any) {
    console.error('Similar dreams error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * Fallback: find similar dreams by overlapping tags/entities/patterns
 * when pgvector RPC is not yet available.
 */
async function fallbackTagMatch(
  supabase: ReturnType<typeof createServerClient>,
  dreamId: string,
  userId: string,
  limit: number
) {
  // 🔒 Double filtre : source dream n'est lu que s'il appartient à userId
  const { data: source } = await supabase
    .from('dreams')
    .select('tags, entities, root_dream_patterns, archetypal_process, mood')
    .eq('id', dreamId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!source) {
    return NextResponse.json({ similar: [], message: 'Dream not found' })
  }

  // Get all other dreams for this user
  const { data: others } = await supabase
    .from('dreams')
    .select('id, title, created_at, tags, entities, root_dream_patterns, archetypal_process, mood, entry_type, numinosity')
    .eq('user_id', userId)
    .neq('id', dreamId)
    .in('entry_type', ['dream', 'reve', 'reentry'])
    .order('created_at', { ascending: false })
    .limit(100)

  if (!others || others.length === 0) {
    return NextResponse.json({ similar: [], message: 'Pas assez de rêves pour comparer' })
  }

  const sourceTags = new Set([
    ...(source.tags || []),
    ...(source.entities || []),
    ...(source.root_dream_patterns || []),
  ].map((s: string) => s.toLowerCase()))

  // Score each dream
  const scored = others.map(dream => {
    let score = 0
    const dreamTags = [
      ...(dream.tags || []),
      ...(dream.entities || []),
      ...(dream.root_dream_patterns || []),
    ].map((s: string) => s.toLowerCase())

    for (const tag of dreamTags) {
      if (sourceTags.has(tag)) score += 2
    }

    if (dream.archetypal_process && dream.archetypal_process === source.archetypal_process) {
      score += 3
    }
    if (dream.mood && dream.mood === source.mood) {
      score += 1
    }

    return { ...dream, similarity_score: score }
  })

  scored.sort((a, b) => b.similarity_score - a.similarity_score)

  return NextResponse.json({
    similar: scored.filter(s => s.similarity_score > 0).slice(0, limit),
    method: 'tag_fallback',
  })
}
