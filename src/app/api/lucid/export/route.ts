import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * GET /api/lucid/export?format=json|markdown
 *
 * Export complet du journal lucid pour Obsidian (markdown) ou pour audit (JSON).
 *
 * Distinct de /api/lucid/export-obsidian (legacy 2026-04-26, single-file md).
 * Cette route est plus complète :
 *   - Inclut dream_signs, mild_sessions, re_entry_sessions, rc_events
 *   - Format JSON propre (pour future ré-importation, debug user data)
 *   - Format markdown sectionné (pour Obsidian — _INDEX.md + sections)
 *
 * Cohérent 3_LUCID_TECHNICAL §7.5 export Obsidian.
 *
 * Auteur : Yeshua, 2026-04-28.
 */

export const maxDuration = 30

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') === 'json' ? 'json' : 'markdown'

    const supabase = createServerClient()

    // Fetch tout en parallèle
    const [
      { data: profile },
      { data: kairos },
      { data: meta },
      { data: dreamSigns },
      { data: rcs },
      { data: rcEvents },
      { data: mildSessions },
      { data: reEntrySessions },
      { data: wbtbAlarms },
      { data: wbtbEvents },
    ] = await Promise.all([
      supabase.from('lucid_user_profile').select('*').eq('user_id', userId).maybeSingle(),
      supabase
        .from('kairos')
        .select('id, raw_text, kairos_type, created_at, motif_tags, archetypal_tags, title')
        .eq('user_id', userId)
        .eq('kairos_type', 'reve')
        .order('created_at', { ascending: false })
        .limit(2000),
      supabase.from('lucid_kairos_metadata').select('*').eq('user_id', userId),
      supabase
        .from('lucid_dream_signs')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .order('occurrences_count', { ascending: false }),
      supabase.from('lucid_reality_checks').select('*').eq('user_id', userId).eq('active', true),
      supabase
        .from('lucid_reality_check_events')
        .select('*')
        .eq('user_id', userId)
        .order('event_at', { ascending: false })
        .limit(1000),
      supabase
        .from('lucid_mild_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('session_at', { ascending: false })
        .limit(500),
      supabase
        .from('lucid_re_entry_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('started_at', { ascending: false })
        .limit(500),
      supabase.from('lucid_wbtb_alarms').select('*').eq('user_id', userId),
      supabase
        .from('lucid_wbtb_events')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_at', { ascending: false })
        .limit(500),
    ])

    if (format === 'json') {
      const payload = {
        export_version: 1,
        exported_at: new Date().toISOString(),
        user_id: userId,
        profile,
        kairos: kairos || [],
        kairos_lucid_metadata: meta || [],
        dream_signs: dreamSigns || [],
        reality_checks: rcs || [],
        reality_check_events: rcEvents || [],
        mild_sessions: mildSessions || [],
        re_entry_sessions: reEntrySessions || [],
        wbtb_alarms: wbtbAlarms || [],
        wbtb_events: wbtbEvents || [],
      }
      return new NextResponse(JSON.stringify(payload, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="dream-lucid-export-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      })
    }

    // Markdown — single file with sections (Obsidian-friendly)
    const metaByKid = new Map((meta || []).map((m: any) => [m.kairos_id, m]))
    const lines: string[] = []

    lines.push('# Journal Lucid — Export INFUSE Dream')
    lines.push('')
    lines.push(`Exporté le : ${new Date().toISOString().slice(0, 10)}`)
    lines.push(`Total rêves : ${(kairos || []).length}`)
    lines.push(
      `Rêves lucides marqués : ${(meta || []).filter((m: any) => m.is_lucid === true || (m.lucidity_score || 0) >= 1).length}`
    )
    lines.push(`Dream signs personnels : ${(dreamSigns || []).length}`)
    lines.push('')
    lines.push('---')
    lines.push('')

    // Section : dream signs
    lines.push('## Dream signs personnels')
    lines.push('')
    if ((dreamSigns || []).length === 0) lines.push('*(aucun encore)*')
    for (const ds of dreamSigns || []) {
      lines.push(`- **${ds.sign_label}** _(${ds.sign_category || '—'})_ — ${ds.occurrences_count || 0}× rencontré`)
    }
    lines.push('')
    lines.push('---')
    lines.push('')

    // Section : kairos rêve avec lucid metadata
    lines.push('## Kairos — rêves nocturnes')
    lines.push('')
    for (const k of kairos || []) {
      const m: any = metaByKid.get(k.id)
      const date = (k.created_at || '').slice(0, 10)
      const isLucid = m?.is_lucid === true || (m?.lucidity_score || 0) >= 1
      const tags = ['dream', isLucid ? 'lucid' : '', ...(k.motif_tags || []).map((t: string) => `motif/${t}`)].filter(Boolean)

      lines.push(`### ${date} — ${k.title || '(sans titre)'}`)
      lines.push('')
      lines.push('```yaml')
      lines.push(`id: ${k.id}`)
      lines.push(`date: ${date}`)
      lines.push(`is_lucid: ${isLucid}`)
      if (m?.recognition_category) lines.push(`recognition_category: ${m.recognition_category}`)
      if (m?.technique_used) lines.push(`technique: ${m.technique_used}`)
      if (m?.posture) lines.push(`posture: ${m.posture}`)
      if (m?.hypnagogic_entry) lines.push(`hypnagogic: true`)
      if (m?.sleep_paralysis_experienced) lines.push(`sleep_paralysis: true`)
      lines.push(`tags: [${tags.join(', ')}]`)
      lines.push('```')
      lines.push('')
      lines.push(k.raw_text || '*(empty)*')
      if (m?.recognition_text) {
        lines.push('')
        lines.push('**Reconnaissance :**')
        lines.push(`> ${m.recognition_text}`)
      }
      lines.push('')
      lines.push('---')
      lines.push('')
    }

    // Section : MILD sessions
    if ((mildSessions || []).length > 0) {
      lines.push('## Sessions MILD (rituel pré-sommeil)')
      lines.push('')
      for (const m of mildSessions || []) {
        const d = (m.session_at || '').slice(0, 10)
        lines.push(`- ${d} — *« ${(m.intention_text || '').slice(0, 200)} »*`)
      }
      lines.push('')
    }

    // Section : Re-entry
    if ((reEntrySessions || []).length > 0) {
      lines.push('## Re-entrées éveillées')
      lines.push('')
      for (const r of reEntrySessions || []) {
        const d = (r.started_at || '').slice(0, 10)
        const aha = r.aha_level ? ` — AHA: ${r.aha_level}` : ''
        lines.push(`- ${d}${aha}`)
        if (r.capture_text) {
          lines.push(`  > ${r.capture_text.slice(0, 400)}`)
        }
      }
      lines.push('')
    }

    const md = lines.join('\n')
    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="dream-lucid-export-${new Date().toISOString().slice(0, 10)}.md"`,
      },
    })
  } catch (e: any) {
    console.error('[lucid.export.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
