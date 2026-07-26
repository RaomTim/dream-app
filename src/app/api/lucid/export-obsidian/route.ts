import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/export-obsidian
 *
 * GET → returns a single .md file containing all kairos (dreams) joined with
 * lucid_kairos_metadata, in Obsidian-friendly format with frontmatter.
 *
 * One file = one big markdown stream. User downloads, splits in Obsidian.
 *
 * Auteur : Yeshua, 2026-04-26.
 */

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const supabase = createServerClient()

    const { data: kairos, error: kErr } = await supabase
      .from('kairos')
      .select('id, raw_text, kairos_type, created_at, motif_tags, archetypal_tags')
      .eq('user_id', userId)
      .eq('kairos_type', 'reve')
      .order('created_at', { ascending: false })
      .limit(1000)
    if (kErr) throw kErr

    const { data: meta } = await supabase
      .from('lucid_kairos_metadata')
      .select('*')
      .eq('user_id', userId)
    const metaByKid = new Map<string, any>()
    for (const m of meta || []) metaByKid.set(m.kairos_id, m)

    const blocks: string[] = []
    blocks.push(`# Dream Journal — Lucid Export\n\nExported: ${new Date().toISOString()}\nTotal dreams: ${(kairos || []).length}\n\n---\n\n`)

    for (const k of kairos || []) {
      const m = metaByKid.get(k.id)
      const date = (k.created_at || '').slice(0, 10)
      const tags = [
        'dream',
        m?.lucidity_score >= 1 ? 'lucid' : '',
        ...(k.motif_tags || []).map((t: string) => `motif/${t}`),
      ].filter(Boolean)

      const fm: string[] = ['---']
      fm.push(`id: ${k.id}`)
      fm.push(`date: ${date}`)
      fm.push(`type: ${k.kairos_type}`)
      if (m) {
        fm.push(`lucidity_score: ${m.lucidity_score ?? 0}`)
        fm.push(`technique: ${m.lucidity_technique || 'none'}`)
        if (m.rem_cycle_estimate) fm.push(`rem_cycle: ${m.rem_cycle_estimate}`)
        if (m.stability_score != null) fm.push(`stability: ${m.stability_score}`)
        if (m.control_score != null) fm.push(`control: ${m.control_score}`)
        if (m.signs_recognized?.length) fm.push(`signs: [${m.signs_recognized.join(', ')}]`)
      }
      fm.push(`tags: [${tags.join(', ')}]`)
      fm.push('---')

      blocks.push(fm.join('\n'))
      blocks.push(`\n## ${date} — Dream\n`)
      blocks.push(k.raw_text || '*(empty)*')
      if (m?.notes_technique) blocks.push(`\n### Technique notes\n\n${m.notes_technique}`)
      if (m?.pre_sleep_intention) blocks.push(`\n### Pre-sleep intention\n\n${m.pre_sleep_intention}`)
      blocks.push('\n\n---\n\n')
    }

    const md = blocks.join('\n')
    return new NextResponse(md, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="dream-lucid-export-${new Date().toISOString().slice(0, 10)}.md"`,
      },
    })
  } catch (e: any) {
    console.error('[lucid.export-obsidian.GET]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
