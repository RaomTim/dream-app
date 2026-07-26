import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServerClient } from '@/lib/supabase'

/**
 * Auto-categorize une entrée Journal de Vie via Sonnet.
 * Bible §3.1.bis : 7 catégories canoniques + sub_category Relations.
 * Silencieux côté user. Trigger automatique post-POST entry.
 */

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const CATEGORIES = [
  'travail',           // carrière, mission, sens du travail, projet
  'relations',         // sub: amour | famille | amis | collegues | rencontres
  'corps_sante',       // douleurs, énergie, sommeil, alimentation, mouvement
  'passions',          // art, écriture, création, jeu, projets perso
  'argent',            // finances, achats, sécurité matérielle
  'spiritualite',      // sens, foi, doutes existentiels, pratique
  'transitions',       // changements, deuils, ruptures, naissances, déménagements, seuils
] as const

const RELATIONS_SUB = ['amour', 'famille', 'amis', 'collegues', 'rencontres'] as const

const SYSTEM_PROMPT = `Tu es un classifieur silencieux pour Dream App. Tu reçois une note de Journal de Vie d'un utilisateur (ce qu'il vit éveillé : doute, joie, conflit, désir, décision, peur, gratitude). Tu dois la classer dans UNE catégorie + UNE sub_category si applicable.

Catégories disponibles :
- travail : carrière, mission, projet professionnel, sens du travail
- relations : tout lien à autrui (sub-category obligatoire : amour | famille | amis | collegues | rencontres)
- corps_sante : douleur, énergie, sommeil, alimentation, mouvement, mal-être physique, oracle du corps
- passions : art, écriture, musique, jeu, création, projet personnel
- argent : finances, choix d'achat, sécurité matérielle, abondance, manque
- spiritualite : sens, foi, doutes existentiels, pratique, retraite, mystique
- transitions : changement de vie, deuil, rupture, naissance, déménagement, seuil initiatique

Règle :
- TOUJOURS choisir UNE catégorie principale (la plus saillante)
- Si "relations" : TOUJOURS préciser sub_category
- Sinon sub_category = null
- Confidence : 0.0 (incertain) à 1.0 (évident)

Réponds STRICTEMENT en JSON valide, rien d'autre :
{"category": "...", "sub_category": "..." | null, "confidence": 0.0-1.0}`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { entry_id, raw_text } = body

    // Internal service auth (call from /api/journal/entries POST)
    const internalToken = req.headers.get('X-Internal-Service')
    const isInternal = internalToken === (process.env.INTERNAL_SERVICE_TOKEN || 'dev')

    if (!entry_id || !raw_text) {
      return NextResponse.json({ error: 'entry_id + raw_text requis' }, { status: 400 })
    }

    const result = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: raw_text }],
    })

    const textContent = result.content.find(c => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Sonnet')
    }

    let parsed: { category: string; sub_category: string | null; confidence: number }
    try {
      // Extract JSON from response (Sonnet sometimes wraps in markdown)
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('No JSON found in response')
      parsed = JSON.parse(jsonMatch[0])
    } catch (e: any) {
      console.warn('[categorize] parse failed:', textContent.text.slice(0, 200))
      // Fallback: marquer transitions par défaut + low confidence
      parsed = { category: 'transitions', sub_category: null, confidence: 0.3 }
    }

    // Validate
    const validCategory = CATEGORIES.includes(parsed.category as any)
      ? parsed.category
      : 'transitions'
    let validSubCategory: string | null = null
    if (validCategory === 'relations' && parsed.sub_category) {
      validSubCategory = RELATIONS_SUB.includes(parsed.sub_category as any)
        ? parsed.sub_category
        : null
    }
    const validConfidence = Math.max(0, Math.min(1, parsed.confidence || 0.5))

    // Update DB
    const supabase = createServerClient()
    const { error } = await supabase
      .from('life_journal_entries')
      .update({
        category: validCategory,
        sub_category: validSubCategory,
        category_confidence: validConfidence,
        categorize_pending: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', entry_id)

    if (error) throw error

    return NextResponse.json({
      ok: true,
      category: validCategory,
      sub_category: validSubCategory,
      confidence: validConfidence,
    })
  } catch (e: any) {
    console.error('[journal/categorize] error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
