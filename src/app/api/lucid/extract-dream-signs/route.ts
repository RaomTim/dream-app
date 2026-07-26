import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'

/**
 * /api/lucid/extract-dream-signs
 *
 * POST { kairos_id }
 *  → loads kairos.raw_text
 *  → asks Sonnet for dream sign candidates with category
 *    (character|location|object|action|emotion)
 *  → upserts signs into lucid_dream_signs (reinforce if exists)
 *  → returns the list of extracted signs
 *
 * Bible §17 — backbone du training lucid : reconnaître les signes récurrents.
 *
 * Auteur : Yeshua, 2026-04-26.
 */

export const maxDuration = 30

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const VALID_CATEGORIES = ['character', 'location', 'object', 'action', 'emotion']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    if (!body.kairos_id) {
      return NextResponse.json({ error: 'kairos_id required' }, { status: 400 })
    }

    const supabase = createServerClient()
    const { data: kairos, error: kErr } = await supabase
      .from('kairos')
      .select('id, raw_text, raw_text_lang, user_id')
      .eq('id', body.kairos_id)
      .eq('user_id', userId)
      .maybeSingle()

    if (kErr) throw kErr
    if (!kairos) return NextResponse.json({ error: 'kairos not found' }, { status: 404 })
    if (!kairos.raw_text || kairos.raw_text.length < 5) {
      return NextResponse.json({ dream_signs: [], reason: 'text too short' })
    }

    // Sonnet extraction
    const lang = kairos.raw_text_lang || 'fr'
    const sysPrompt = `You extract DREAM SIGNS from a single dream report — recurring elements that, when noticed, can trigger lucidity (LaBerge / Waggoner method).

A dream sign is a discrete element that the dreamer might recognize as a personal recurring marker. Examples : a specific person ("father", "boss"), a place ("Berlin", "stairs"), an object ("clock", "phone"), an action ("flying", "falling"), an emotion ("anxiety chase", "ecstatic awe").

Categorize each as one of : character, location, object, action, emotion.

Return STRICT JSON :
{ "signs": [ { "label": "<2-3 word lowercase>", "category": "<one of the 5>" }, ... ] }

Maximum 8 signs. Be concise. No commentary outside JSON.`

    const completion = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: sysPrompt,
      messages: [
        {
          role: 'user',
          content: `Dream text (lang=${lang}):\n\n${kairos.raw_text}`,
        },
      ],
    })

    const txt = completion.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('\n')
      .trim()

    let parsed: any = null
    try {
      const jsonMatch = txt.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : txt)
    } catch (e) {
      console.warn('[lucid.extract] JSON parse failed', e, txt.slice(0, 200))
      return NextResponse.json({ dream_signs: [], raw: txt, error: 'parse failed' })
    }

    const candidates: { label: string; category: string }[] = (parsed?.signs || [])
      .filter((s: any) => s && typeof s.label === 'string')
      .slice(0, 8)
      .map((s: any) => ({
        label: String(s.label).toLowerCase().trim(),
        category: VALID_CATEGORIES.includes(s.category) ? s.category : 'object',
      }))
      .filter((s: any) => s.label.length >= 2)

    const upserted: any[] = []
    for (const c of candidates) {
      const { data: existing } = await supabase
        .from('lucid_dream_signs')
        .select('id, occurrences_count')
        .eq('user_id', userId)
        .eq('sign_label', c.label)
        .maybeSingle()

      if (existing) {
        const { data: u } = await supabase
          .from('lucid_dream_signs')
          .update({
            occurrences_count: (existing.occurrences_count || 0) + 1,
            last_occurred_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select('*')
          .single()
        if (u) upserted.push({ ...u, _reinforced: true })
      } else {
        const { data: c2 } = await supabase
          .from('lucid_dream_signs')
          .insert({
            user_id: userId,
            sign_label: c.label,
            sign_category: c.category,
            detection_source: 'nlp_auto',
            occurrences_count: 1,
          })
          .select('*')
          .single()
        if (c2) upserted.push(c2)
      }
    }

    return NextResponse.json({ dream_signs: upserted, extracted_count: candidates.length })
  } catch (e: any) {
    console.error('[lucid.extract.POST]', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
