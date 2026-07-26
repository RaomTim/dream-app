import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * POST /api/tales/match
 *
 * Matching contes réels (Bible §17.4) — sous-Forêt CONTES, 100% domaine public.
 * Refonte 2026-04-26 : RPC vector cosine on dreams.embedding (or kairos.embedding_semantic),
 * fallback heuristique score-based si pas d'embedding.
 *
 * Body: { dreamId, top_k?: number = 5 }
 * Returns: { tales: TaleCard[], dreamContext: { ... }, mode: 'vector' | 'heuristic' | 'recency' }
 *
 * RED LINE Bible §17.4 : aucun conte généré par IA. Tous viennent de tales.full_text
 * peuplé manuellement depuis sources documentées (Grimm, Perrault, Estés, Campbell, Attar, Andersen, etc.).
 */

interface TaleScore {
  tale: any
  score: number
  reasons: string[]
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { dreamId } = body
    const top_k = Math.max(1, Math.min(10, parseInt(String(body.top_k ?? 5), 10) || 5))

    if (!dreamId) {
      return NextResponse.json({ error: 'dreamId required' }, { status: 400 })
    }

    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    // Try RPC vector match first (works against dreams.embedding OR kairos.embedding_semantic)
    const { data: rpcRows, error: rpcErr } = await supabase
      .rpc('match_tales_for_kairos', { p_kairos_id: dreamId, p_top_k: top_k })

    if (!rpcErr && Array.isArray(rpcRows) && rpcRows.length > 0 && rpcRows.some((r: any) => (r.similarity || 0) > 0)) {
      // Vector mode
      const taleCards = rpcRows.map((t: any) => ({
        id: t.id,
        title: t.title,
        tradition: t.tradition,
        source_book_slug: t.source_book_slug,
        source: t.source_book_slug, // alias for UI
        summary: t.summary,
        full_text: t.full_text,
        text: t.summary || (t.full_text || '').slice(0, 600),
        motif_tags: t.motif_tags || [],
        structural_phase: t.structural_phase,
        emotional_register: t.emotional_register,
        figures: t.figures || [],
        similarity: t.similarity,
        match_reasons: buildReasonsFromMotifs(t.motif_tags || []),
      }))
      return NextResponse.json({
        tales: taleCards,
        mode: 'vector',
        total_matched: taleCards.length,
      })
    }

    // Fallback : heuristic score-based on dreams metadata
    // Try legacy dreams table first
    const { data: dream } = await supabase
      .from('dreams')
      .select('id, tags, entities, mood, archetypal_process, figure_types, root_dream_patterns')
      .eq('id', dreamId)
      .eq('user_id', userId)
      .maybeSingle()

    let dreamTagsArr: string[] = []
    let dreamFigureNames: string[] = []
    let archProcess: string | null = null
    let mood: string | null = null

    if (dream) {
      dreamTagsArr = [
        ...(dream.tags || []),
        ...(Array.isArray(dream.entities) ? (dream.entities as any[]).map((e: any) => typeof e === 'string' ? e : e?.name) : []),
        ...(dream.root_dream_patterns || []),
      ].filter(Boolean).map(String)
      dreamFigureNames = (dream.figure_types || []).map((f: any) =>
        (typeof f === 'string' ? f : f?.name || '').toString()
      ).filter(Boolean)
      archProcess = dream.archetypal_process
      mood = dream.mood
    } else {
      // Try new kairos table
      const { data: kairos } = await supabase
        .from('kairos')
        .select('id, motif_tags, root_dream_patterns, archetypal_tags, figures, dominant_emotion')
        .eq('id', dreamId)
        .eq('user_id', userId)
        .maybeSingle()
      if (!kairos) return NextResponse.json({ error: 'Kairos not found' }, { status: 404 })
      dreamTagsArr = [
        ...(kairos.motif_tags || []),
        ...(kairos.root_dream_patterns || []),
        ...(kairos.archetypal_tags || []),
      ]
      dreamFigureNames = Array.isArray(kairos.figures)
        ? (kairos.figures as any[]).map((f: any) => (typeof f === 'string' ? f : f?.name || '')).filter(Boolean)
        : []
      mood = kairos.dominant_emotion
    }

    const dreamTags = new Set(dreamTagsArr.map((t) => String(t).toLowerCase()))
    const figSet = new Set(dreamFigureNames.map((f) => f.toLowerCase()))

    // Fetch all tales (open ethics)
    const { data: tales } = await supabase
      .from('tales')
      .select('*')
      .eq('ethics_flag', 'open')

    if (!tales || tales.length === 0) {
      return NextResponse.json({ tales: [], mode: 'recency', total_matched: 0 })
    }

    const scored: TaleScore[] = tales.map((tale: any) => {
      let score = 0
      const reasons: string[] = []
      // Motif overlap
      const taleMotifs = (tale.motif_tags || []).map((t: string) => t.toLowerCase())
      const dreamTagsArr2 = Array.from(dreamTags)
      for (const motif of taleMotifs) {
        if (dreamTags.has(motif)) {
          score += 2
          reasons.push(motif)
        } else {
          for (const dt of dreamTagsArr2) {
            if (dt !== motif && dt.length > 3 && (dt.includes(motif) || motif.includes(dt))) {
              score += 1
              reasons.push(`${motif}≈${dt}`)
              break
            }
          }
        }
      }
      // Structural phase ↔ archetypal_process
      if (tale.structural_phase && archProcess) {
        const a = tale.structural_phase.toLowerCase().replace(/[- ]/g, '')
        const b = archProcess.toLowerCase().replace(/[- ]/g, '')
        if (a.includes(b) || b.includes(a)) {
          score += 5
          reasons.push(`structure: ${tale.structural_phase}`)
        }
      }
      // Emotional register ↔ mood
      if (tale.emotional_register && mood) {
        const r = tale.emotional_register.toLowerCase()
        const m = mood.toLowerCase()
        const emotionMap: Record<string, string[]> = {
          numineux: ['mystique', 'spirituel', 'profound', 'awe', 'numinous'],
          sombre: ['dark', 'anxious', 'fear', 'nightmare', 'cauchemar', 'angoisse'],
          initiatique: ['challenging', 'growth', 'transformation', 'épreuve'],
          tragique: ['sad', 'loss', 'grief', 'triste', 'deuil'],
          espiègle: ['playful', 'funny', 'absurd', 'léger'],
          contemplatif: ['calm', 'peaceful', 'serene', 'paisible'],
          épique: ['intense', 'powerful', 'grand', 'vivid'],
          mélancolique: ['nostalgic', 'bittersweet', 'wistful', 'mélancolie'],
          rédempteur: ['hopeful', 'healing', 'redemption', 'espoir'],
        }
        if (r === m || emotionMap[r]?.some((e) => m.includes(e))) {
          score += 3
          reasons.push(`emotion: ${tale.emotional_register}`)
        }
      }
      // Figures
      const taleFig = (tale.figures || []).map((f: string) => String(f).toLowerCase())
      for (const f of taleFig) {
        if (figSet.has(f)) {
          score += 3
          reasons.push(`figure: ${f}`)
        }
      }
      return { tale, score, reasons }
    })

    scored.sort((a, b) => b.score - a.score)
    const top = scored.filter((s) => s.score > 0).slice(0, top_k)
    if (top.length === 0) {
      // No score → fallback recency
      const recent = (tales as any[])
        .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
        .slice(0, top_k)
      return NextResponse.json({
        tales: recent.map((t: any) => ({
          ...t,
          source: t.source_book_slug,
          text: t.summary || (t.full_text || '').slice(0, 600),
          match_reasons: ['proximité atmosphérique'],
        })),
        mode: 'recency',
        total_matched: 0,
      })
    }
    return NextResponse.json({
      tales: top.map((s) => ({
        ...s.tale,
        source: s.tale.source_book_slug,
        text: s.tale.summary || (s.tale.full_text || '').slice(0, 600),
        match_score: s.score,
        match_reasons: s.reasons.slice(0, 5),
      })),
      mode: 'heuristic',
      total_matched: top.length,
    })
  } catch (error: any) {
    console.error('[tales.match]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function buildReasonsFromMotifs(motifs: string[]): string[] {
  return motifs.slice(0, 3)
}
