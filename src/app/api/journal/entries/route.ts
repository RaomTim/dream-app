import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * Journal de Vie LUMINEUX — entries CRUD
 * Bible §3.1.bis (révélation Tim 2026-04-25).
 *
 * POST  : créer entrée libre + trigger categorize async (Sonnet)
 * GET   : liste entries paginated, filter par category/sub_category
 */

// ── POST : créer une entrée ────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const { raw_text, voice_url, linked_kairos_id } = body
    if (!raw_text || typeof raw_text !== 'string' || raw_text.trim().length < 1) {
      return NextResponse.json({ error: 'raw_text requis' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('life_journal_entries')
      .insert({
        user_id: userId,
        raw_text: raw_text.trim(),
        voice_url: voice_url || null,
        linked_kairos_id: linked_kairos_id || null,
        categorize_pending: true,
        embeddings_pending: true,
      })
      .select()
      .single()

    if (error) throw error

    // Fire-and-forget categorize (don't block user)
    triggerCategorize(data.id, raw_text.trim()).catch(e =>
      console.warn('[journal/entries POST] categorize trigger failed:', e.message)
    )

    return NextResponse.json({ entry: data })
  } catch (e: any) {
    console.error('[journal/entries POST] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ── GET : liste entries ────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const subCategory = searchParams.get('sub_category')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const offset = parseInt(searchParams.get('offset') || '0')

    const supabase = createServerClient()
    let query = supabase
      .from('life_journal_entries')
      .select('id, raw_text, created_at, category, sub_category, somatic_markers, affective_valence, numinosity_score, linked_kairos_id, user_archived')
      .eq('user_id', userId)
      .eq('user_archived', false)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) query = query.eq('category', category)
    if (subCategory) query = query.eq('sub_category', subCategory)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ entries: data || [] })
  } catch (e: any) {
    console.error('[journal/entries GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// ── Helper : trigger categorize via internal call ──────────────
async function triggerCategorize(entryId: string, rawText: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/journal/categorize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Internal-Service': process.env.INTERNAL_SERVICE_TOKEN || 'dev',
      },
      body: JSON.stringify({ entry_id: entryId, raw_text: rawText }),
    })
  } catch (e) {
    // silent — categorize_pending stays true, scheduled task can pick up
  }
}
