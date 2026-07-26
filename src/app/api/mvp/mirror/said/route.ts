import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import {
  buildThreads,
  type MirrorReading,
  type MirrorThread,
} from '@/lib/mirror/what-i-said'

/**
 * /api/mvp/mirror/said — le miroir, mode « ce que j'en ai dit ».
 *
 * GET  → les fils. Zéro appel de modèle, zéro phrase générée : la route lit la
 *        couche `lecture` du rêveur (B4), la déduplique, et rend des montages.
 * POST → { anchor_slug, anchor_label, body, cited_layer_ids } : le rêveur pose
 *        une lecture d'AUJOURD'HUI à côté des anciennes. Elle rejoindra les
 *        montages suivants, à sa date.
 * DELETE → { id } : il la retire. Aucune question, aucune trace.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LES TROIS GARANTIES QUE CETTE ROUTE TIENT (DOCTRINE-MIROIR §7)
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * · INTERDIT 1 — traçabilité. Chaque citation rendue porte son `id` de couche,
 *   son `kairos_id` et sa date. Il n'existe aucun chemin par lequel une phrase
 *   sorte d'ici sans sa source : la charge utile EST la matière.
 *
 * · INTERDIT 7 — un seul corpus. Toutes les requêtes sont bornées par
 *   `user_id = <l'appelant vérifié>`. Aucune jointure vers une table globale,
 *   aucune lecture de `global_meaning_clusters`, aucune comparaison entre
 *   rêveurs. C'est vérifiable en lisant les quatre `.eq('user_id', userId)`
 *   ci-dessous, et il n'y a pas de cinquième requête.
 *
 * · INTERDIT 12 — le silence. `threads: []` est une réponse à 200, pas une
 *   erreur. La route ne fabrique jamais un fil de repli pour éviter l'écran
 *   vide. `reason` dit pourquoi il n'y a rien, et c'est tout.
 *
 * ⚠️ CE QUE CETTE ROUTE N'A PAS LE DROIT DE DEVENIR. Le jour où quelqu'un
 * voudra « améliorer » ce mode en faisant écrire une phrase de liaison par un
 * modèle, ce sera un autre mode, avec un autre nom. La valeur de celui-ci est
 * exactement son abstinence : la beauté vient du MONTAGE, la glose l'abîme
 * (§9). Il n'y a pas d'import d'Anthropic ni d'OpenAI dans ce fichier, et il
 * ne doit jamais y en avoir.
 *
 * Yeshua (Opus, G2), 2026-07-26. Voir RAPPORT-G2.md.
 */
export const maxDuration = 30

export async function OPTIONS() { return corsOptions() }

/** Deux rêves différents peuvent être le même enregistrement importé deux fois
 *  (4 doublons octet pour octet chez Tim — E2 §1.1). On garde le plus ancien. */
function dedupeDreams<T extends { id: string; raw_hash: string | null; created_at: string }>(rows: T[]): T[] {
  const byHash = new Map<string, T>()
  const out: T[] = []
  for (const r of [...rows].sort((a, b) => a.created_at.localeCompare(b.created_at))) {
    const h = r.raw_hash
    if (!h) { out.push(r); continue }
    if (byHash.has(h)) continue
    byHash.set(h, r)
    out.push(r)
  }
  return out
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    // ── 1. Les rêves du rêveur, et EUX SEULS. ──
    const { data: dreams, error: dErr } = await supabase
      .from('kairos')
      .select('id, title, raw_text, occurred_at, occurred_at_reliable, created_at')
      .eq('user_id', userId)
    if (dErr) throw dErr

    const withHash = (dreams || []).map((d: any) => ({
      ...d,
      // hash léger : on ne veut que détecter l'import en double, pas signer.
      raw_hash: typeof d.raw_text === 'string' && d.raw_text.length > 0
        ? `${d.raw_text.length}:${d.raw_text.slice(0, 160)}`
        : null,
    }))
    const kept = dedupeDreams(withHash)
    const dreamById = new Map(kept.map((d: any) => [d.id, d]))

    // ── 2. La couche « lecture » — ce qu'il a dit de ses rêves. ──
    const { data: layers, error: lErr } = await supabase
      .from('kairos_text_layers')
      .select('id, kairos_id, quote')
      .eq('user_id', userId)
      .eq('kind', 'lecture')
    if (lErr) throw lErr

    const readings: MirrorReading[] = []
    for (const l of layers || []) {
      const d: any = dreamById.get((l as any).kairos_id)
      if (!d) continue // lecture d'un rêve écarté comme doublon
      readings.push({
        id: (l as any).id,
        kairosId: (l as any).kairos_id,
        dreamTitle: d.title ?? null,
        quote: (l as any).quote || '',
        occurredAt: d.occurred_at,
        dated: d.occurred_at_reliable === true,
        depositedAt: d.created_at ?? null,
        source: 'dictee',
        match: null,
      })
    }

    // ── 3. Ses lectures d'aujourd'hui — elles entrent dans les fils, datées. ──
    const { data: todays } = await supabase
      .from('mirror_thread_readings')
      .select('id, anchor_slug, anchor_label, body, created_at')
      .eq('user_id', userId)
    for (const t of todays || []) {
      readings.push({
        id: (t as any).id,
        kairosId: null,
        dreamTitle: null,
        quote: (t as any).body || '',
        occurredAt: (t as any).created_at,
        dated: true, // il l'a écrite aujourd'hui : cette date-là, on la connaît
        depositedAt: (t as any).created_at,
        source: 'today',
        match: null,
      })
    }

    const threads: MirrorThread[] = buildThreads({ readings })

    // ── 4. Le silence, motivé et daté (§9, exemple 5). ──
    if (threads.length === 0) {
      return corsify(NextResponse.json({
        threads: [],
        reason: readings.length === 0 ? 'no_readings' : 'no_recurrence',
        readingsCount: readings.length,
        dreamsCount: kept.length,
      }))
    }

    return corsify(NextResponse.json({
      threads,
      readingsCount: readings.length,
      dreamsCount: kept.length,
      // combien de rêves n'ont pas de date — sert à expliquer le pêle-mêle,
      // et à proposer le geste qui le répare. Jamais présenté comme un défaut
      // du rêveur.
      undatedDreams: kept.filter((d: any) => d.occurred_at_reliable !== true).length,
    }))
  } catch (e: any) {
    console.error('[mvp.mirror.said GET]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth

    const text = typeof body.body === 'string' ? body.body.trim() : ''
    const anchorSlug = typeof body.anchor_slug === 'string' ? body.anchor_slug.trim() : ''
    const anchorLabel = typeof body.anchor_label === 'string' ? body.anchor_label.trim() : anchorSlug
    if (!text) return corsify(NextResponse.json({ error: 'body requis' }, { status: 400 }))
    if (!anchorSlug) return corsify(NextResponse.json({ error: 'anchor_slug requis' }, { status: 400 }))

    const cited = Array.isArray(body.cited_layer_ids)
      ? body.cited_layer_ids.filter((x: any) => typeof x === 'string').slice(0, 12)
      : []

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('mirror_thread_readings')
      .insert({
        user_id: userId,
        anchor_slug: anchorSlug,
        anchor_label: anchorLabel,
        body: text,
        cited_layer_ids: cited,
      })
      .select('id, created_at')
      .single()
    if (error) throw error

    // On ne répond RIEN d'autre que l'accusé. Pas de « c'est noté », pas de
    // « belle intuition » (interdit 11). L'écran affichera sa phrase, datée.
    return corsify(NextResponse.json({ id: data.id, created_at: data.created_at }))
  } catch (e: any) {
    console.error('[mvp.mirror.said POST]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const auth = await requireAuth(req, body)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const id = typeof body.id === 'string' ? body.id : ''
    if (!id) return corsify(NextResponse.json({ error: 'id requis' }, { status: 400 }))

    const supabase = createServerClient()
    const { error } = await supabase
      .from('mirror_thread_readings')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
    if (error) throw error
    return corsify(NextResponse.json({ ok: true }))
  } catch (e: any) {
    console.error('[mvp.mirror.said DELETE]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
