import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/journal/sections
 * Liste des sections (catégories) du Journal de Vie pour l'user, avec :
 *  - count d'entrées par section
 *  - dernière entrée preview
 *  - sub-categories pour 'relations'
 * Bible §3.1.bis.
 */

const CATEGORIES_META: Record<string, { label: string; glyph: string }> = {
  travail: { label: 'travail & vocation', glyph: '◇' },
  relations: { label: 'relations', glyph: '○' },
  corps_sante: { label: 'corps & santé', glyph: '◐' },
  passions: { label: 'passions & création', glyph: '✶' },
  argent: { label: 'argent & matériel', glyph: '⌬' },
  spiritualite: { label: 'spiritualité & sens', glyph: '☉' },
  transitions: { label: 'transitions & seuils', glyph: '⌒' },
}

const RELATIONS_SUB_META: Record<string, string> = {
  amour: 'amour',
  famille: 'famille',
  amis: 'amis',
  collegues: 'collègues',
  rencontres: 'rencontres',
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const userId = auth.userId

    const supabase = createServerClient()

    // Aggregate count + last entry per category
    const { data: rows, error } = await supabase
      .from('life_journal_entries')
      .select('id, raw_text, created_at, category, sub_category')
      .eq('user_id', userId)
      .eq('user_archived', false)
      .not('category', 'is', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group in JS (Supabase doesn't have native group_by easy)
    const byCategory: Record<string, {
      category: string
      label: string
      glyph: string
      count: number
      last_entry?: { id: string; raw_text: string; created_at: string }
      sub_categories?: Array<{ key: string; label: string; count: number; last_entry?: any }>
    }> = {}

    for (const row of rows || []) {
      const cat = row.category!
      if (!byCategory[cat]) {
        byCategory[cat] = {
          category: cat,
          label: CATEGORIES_META[cat]?.label || cat,
          glyph: CATEGORIES_META[cat]?.glyph || '○',
          count: 0,
        }
        if (cat === 'relations') byCategory[cat].sub_categories = []
      }
      byCategory[cat].count++
      if (!byCategory[cat].last_entry) {
        byCategory[cat].last_entry = {
          id: row.id,
          raw_text: row.raw_text.slice(0, 120),
          created_at: row.created_at,
        }
      }

      // Sub-categories for relations
      if (cat === 'relations' && row.sub_category) {
        const subs = byCategory[cat].sub_categories!
        let sub = subs.find(s => s.key === row.sub_category)
        if (!sub) {
          sub = {
            key: row.sub_category,
            label: RELATIONS_SUB_META[row.sub_category] || row.sub_category,
            count: 0,
          }
          subs.push(sub)
        }
        sub.count++
        if (!sub.last_entry) {
          sub.last_entry = {
            id: row.id,
            raw_text: row.raw_text.slice(0, 120),
            created_at: row.created_at,
          }
        }
      }
    }

    // Always include canonical categories even if empty (for UX consistency)
    for (const key of Object.keys(CATEGORIES_META)) {
      if (!byCategory[key]) {
        byCategory[key] = {
          category: key,
          label: CATEGORIES_META[key].label,
          glyph: CATEGORIES_META[key].glyph,
          count: 0,
        }
        if (key === 'relations') byCategory[key].sub_categories = []
      }
    }

    // Order : canonical order
    const ordered = Object.keys(CATEGORIES_META).map(k => byCategory[k])

    return NextResponse.json({ sections: ordered })
  } catch (e: any) {
    console.error('[journal/sections GET] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
