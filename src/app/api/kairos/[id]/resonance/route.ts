import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createServerClient } from '@/lib/supabase'
import { requireAuth } from '@/lib/auth-server'
import { corsify, corsOptions } from '@/lib/mvp-cors'
import { rerankResonanceCandidates, RERANK_POOL } from '@/lib/kairos/resonance-rerank'

/**
 * GET /api/kairos/[id]/resonance — « CE QUI RÉSONNE » (DREAM-MVP-SPEC-ECRANS-A-Z §12bis.A).
 *
 * UN seul payload qui mêle les 3 registres de la résonance autour d'un kairos :
 *   1. rêves reliés       — find_kairos_echoes_multilayer (kairos↔kairos, type ≠ note_jour)
 *   2. moments de jour     — « resonate à l'envers » : embed du texte source → match_kairos_for_wisdom,
 *                            filtré aux note_jour (les notes de JOUR proches sémantiquement)
 *   3. écho ancien         — find_kairos_prophetic (un rêve ancien qui semble avoir préparé celui-ci)
 *
 * Chaque lien porte SA RAISON en une ligne, calculée côté serveur depuis les données
 * d'extraction déjà présentes sur les deux kairos (motifs communs, figures communes,
 * même émotion), ou l'écart temporel pour l'écho ancien. Défaut : « proche par le sens ».
 *
 * Les liens que le rêveur a écartés (« pas vraiment » → resonance_feedback.verdict='dismissed')
 * ne remontent plus. La table est optionnelle : si elle n'existe pas encore, on dégrade en douceur.
 *
 * Intégrité : on n'affiche jamais un score, on ne fabrique jamais une raison. La raison est
 * l'intersection RÉELLE des motifs/figures extraits, sinon une formule sobre non-affirmative.
 *
 * Yeshua (Opus), 2026-07-11 — vague MAGIE.
 *
 * ── 2026-07-26, agent A2 (AUDIT-DREAM-2026-07-26 §3) ──────────────────────────
 * Cette route affichait TOUJOURS exactement 4 rêves reliés, quelle que soit la
 * proximité réelle : `p_min_combined` était passé aux RPC et lu par aucune, et
 * un `break` en dur remplissait le bucket jusqu'à 4.
 *
 * Ce qui change ici :
 *   • plafond 4, PLANCHER 0 — « aucune résonance » est désormais une réponse
 *     possible et fréquente (1_BIBLE:365, SILENCE_AS_FEATURE). Sur le corpus de
 *     Tim, 14 rêves sur 64 n'ont plus aucun lien. C'est le correctif, pas un bug ;
 *   • le filtrage réel vit dans les RPC (seuil appliqué, garde-doublon, correction
 *     de hubness, z-score par source calibré) — cf. migrations du 26/07 ;
 *   • re-ranking LLM optionnel sur les finalistes, dégradable : s'il échoue on
 *     retombe sur le tri par score filtré, jamais sur rien ;
 *   • `corpus_size` est renvoyé pour que l'écran distingue « ton sol est encore
 *     peu peuplé » de « ce rêve se tient seul pour l'instant ». Ce ne sont pas
 *     les mêmes phrases et ce ne sont pas les mêmes situations.
 */
export const maxDuration = 30

/** plafond, jamais un quota : le plancher est 0. */
const MAX_DREAM_LINKS = 4
const MAX_DAY_LINKS = 3
const MAX_PROPHETIC = 2

/**
 * Seuil du bucket « moments de jour ». NON VALIDÉ, et il faut le dire : Tim n'a
 * AUCUN `note_jour` en base (0 sur 64 kairos), ce bucket est donc structurellement
 * vide et n'a jamais pu être mesuré. La valeur est le p90 de la similarité
 * sémantique du corpus de rêves (0.7115 au 26/07) — un point de départ défendable,
 * à recalibrer dès qu'il existera de vraies notes de jour.
 */
const DAY_MIN_SIMILARITY = 0.71

const norm = (s: string) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

/** noms de figures, défensif : figures peut être un array [{name}] ou un objet. */
function figureNames(figures: any): string[] {
  if (Array.isArray(figures)) return figures.map((f: any) => (typeof f === 'string' ? f : f?.name)).filter(Boolean)
  if (figures && typeof figures === 'object') {
    const out: string[] = []
    for (const v of Object.values(figures)) {
      if (Array.isArray(v)) for (const it of v) { const n = typeof it === 'string' ? it : (it as any)?.name; if (n) out.push(n) }
    }
    return out
  }
  return []
}

type KRow = {
  id: string
  raw_text: string | null
  title: string | null
  kairos_type: string | null
  created_at: string
  motif_tags: string[] | null
  figures: any
  dominant_emotion: string | null
}

/** raison d'un lien, depuis l'extraction des deux kairos. Jamais inventée. */
function reasonFor(src: KRow, other: KRow): { reason: string; kind: string } {
  const sMot = new Map<string, string>()
  for (const m of src.motif_tags || []) { const n = norm(m); if (n) sMot.set(n, m) }
  const sharedMot: string[] = []
  for (const m of other.motif_tags || []) { const n = norm(m); if (sMot.has(n) && !sharedMot.includes(sMot.get(n)!)) sharedMot.push(sMot.get(n)!) }
  if (sharedMot.length) return { reason: sharedMot.slice(0, 3).join(' · '), kind: 'motif' }

  const sFig = new Map<string, string>()
  for (const f of figureNames(src.figures)) { const n = norm(f); if (n) sFig.set(n, f) }
  const sharedFig: string[] = []
  for (const f of figureNames(other.figures)) { const n = norm(f); if (sFig.has(n) && !sharedFig.includes(sFig.get(n)!)) sharedFig.push(sFig.get(n)!) }
  if (sharedFig.length) return { reason: sharedFig.slice(0, 2).join(' · '), kind: 'figure' }

  if (src.dominant_emotion && other.dominant_emotion && norm(src.dominant_emotion) === norm(other.dominant_emotion)) {
    return { reason: 'même émotion', kind: 'emotion' }
  }
  return { reason: 'proche par le sens', kind: 'semantic' }
}

const daysBetween = (a: string, b: string) =>
  Math.max(0, Math.round(Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86400000))

export async function OPTIONS() { return corsOptions() }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req)
    if ('error' in auth) return auth.error
    const { userId } = auth
    const supabase = createServerClient()

    // Kairos source (+ extraction pour les raisons)
    const { data: src, error: srcErr } = await supabase
      .from('kairos')
      .select('id, raw_text, title, kairos_type, created_at, motif_tags, figures, dominant_emotion')
      .eq('id', params.id)
      .eq('user_id', userId)
      .maybeSingle()
    if (srcErr) throw srcErr
    if (!src) return corsify(NextResponse.json({ error: 'kairos introuvable' }, { status: 404 }))

    // Liens déjà écartés par le rêveur → on ne les remonte plus. (table optionnelle)
    const dismissed = new Set<string>()
    try {
      const { data: fb } = await supabase
        .from('resonance_feedback')
        .select('other_kairos_id, verdict')
        .eq('user_id', userId)
        .eq('source_kairos_id', params.id)
        .eq('verdict', 'dismissed')
      for (const r of (fb || []) as any[]) if (r.other_kairos_id) dismissed.add(r.other_kairos_id)
    } catch { /* table pas encore migrée → aucun écarté */ }

    // ── 1) rêves reliés : find_kairos_echoes_multilayer (kairos↔kairos) ──
    // La RPC applique désormais RÉELLEMENT : seuil absolu, garde-doublon (sim_sem
    // < 0.97), correction de hubness et z-score par source calibré sur le corpus
    // du rêveur. Elle peut légitimement ne rien renvoyer.
    const echoIds: string[] = []
    // z et score ajusté au moment de l'affichage : conservés pour que le verdict
    // du rêveur puisse, à terme, remplacer le seuil deviné (resonance_feedback).
    const scoreById = new Map<string, { z: number | null; adjusted: number | null }>()
    try {
      const { data: echoes } = await supabase.rpc('find_kairos_echoes_multilayer', {
        p_user_id: userId,
        p_kairos_id: params.id,
        p_w_sem: 0.30, p_w_con: 0.30, p_w_som: 0.20, p_w_arc: 0.20,
        p_min_combined: 0.55,
        p_limit: RERANK_POOL, // vivier des finalistes soumis au re-ranking
      })
      for (const e of (echoes || []) as any[]) {
        const oid = e.other_id || e.id
        if (!oid) continue
        echoIds.push(oid)
        scoreById.set(oid, {
          z: typeof e.z_score === 'number' ? e.z_score : null,
          adjusted: typeof e.adjusted_score === 'number' ? e.adjusted_score : null,
        })
      }
    } catch { /* moteur echoes indisponible → on continue sur le sémantique */ }

    // ── 2) moments de jour reliés : « resonate à l'envers » (embed du texte source → note_jour) ──
    const daySemIds: string[] = []
    try {
      const text = (src.raw_text || '').trim().slice(0, 2000)
      if (text.length >= 5) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
        const emb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
        // `match_kairos_for_wisdom` était un top-K nu, sans aucun seuil : il
        // renvoyait toujours ses 12 plus proches, même à similarité de bruit.
        // Le paramètre existe désormais (migration 26/07) et est utilisé ici.
        const { data: matches } = await supabase.rpc('match_kairos_for_wisdom', {
          query_embedding: emb.data[0].embedding,
          target_user: userId,
          match_count: 12,
          min_similarity: DAY_MIN_SIMILARITY,
        })
        for (const m of (matches || []) as any[]) {
          if (m.id && m.id !== params.id && (m.kairos_type || 'reve') === 'note_jour') daySemIds.push(m.id)
        }
      }
    } catch { /* embedding indisponible → pas de moments de jour, non bloquant */ }

    // ── 3) écho ancien (prophétique) ──
    // Cinq verrous désormais réellement appliqués côté RPC : seuil de proximité,
    // z par source, correction de hubness, maturation ECHO_RIPENING (récurrence
    // ≥ 3 ET charge somatique ≥ 2, 2_DESIGN:247) et plafond d'exposition sur
    // 30 jours.
    //
    // Le seuil : arbitré à 0.75 par Tim le 25/04 (D4) mais JAMAIS appliqué
    // jusqu'au 26/07 — `p_min_combined` était passé à la RPC et lu par aucune.
    // Une fois appliqué pour de vrai, il s'est révélé inatteignable : le score
    // maximum du corpus de Tim est 0.7159, soit 0.034 SOUS son propre seuil.
    // Ce n'était donc pas un filtre, c'était une extinction — invisible tant
    // que la feature affichait quand même.
    //
    // Ramené à 0.65 le 26/07 (arbitrage Tim, sur mesure) : 9 échos sur tout le
    // corpus, exposition maximale d'un même rêve = 3. Le « tout en bas » testé
    // en donnait 22 avec une exposition de 7 — un rêve sur trois, ce qui n'est
    // plus un événement. La phrase « un rêve ancien semble avoir préparé
    // celui-ci » est la seule de l'app qui affirme une causalité : elle se
    // mérite, mais elle ne doit pas être impossible.
    const PROPHETIC_MIN_COMBINED = 0.65
    const propheticRows: { id: string; days_diff: number }[] = []
    try {
      const { data: proph } = await supabase.rpc('find_kairos_prophetic', {
        p_user_id: userId,
        p_kairos_id: params.id,
        p_min_days_back: 30,
        p_min_combined: PROPHETIC_MIN_COMBINED,
        p_min_numinosity_past: 0.4,
        p_limit: 3,
      })
      for (const p of (proph || []) as any[]) {
        const pid = p.past_id || p.id
        if (!pid) continue
        propheticRows.push({ id: pid, days_diff: 0 })
        scoreById.set(pid, {
          z: typeof p.z_score === 'number' ? p.z_score : null,
          adjusted: typeof p.adjusted_score === 'number' ? p.adjusted_score : null,
        })
      }
    } catch { /* pas d'écho ancien */ }

    // Résoudre toutes les entités en une seule requête (extraction pour les raisons + preview)
    const propheticSet = new Set(propheticRows.map(p => p.id))
    const wantIds = Array.from(new Set([...echoIds, ...daySemIds, ...propheticRows.map(p => p.id)]))
      .filter(id => id && id !== params.id && !dismissed.has(id))
    const rowById = new Map<string, KRow>()
    if (wantIds.length) {
      const { data: rows } = await supabase
        .from('kairos')
        .select('id, raw_text, title, kairos_type, created_at, motif_tags, figures, dominant_emotion')
        .eq('user_id', userId)
        .in('id', wantIds)
      for (const r of (rows || []) as any[]) rowById.set(r.id, r as KRow)
    }

    const previewOf = (r: KRow, n = 160) => (r.raw_text || '').slice(0, n)
    const labelOf = (r: KRow) => r.title || (r.raw_text || '').replace(/\s+/g, ' ').trim().slice(0, 60) || 'un moment'

    // Liens mêlés : rêves reliés (echoes, type ≠ note_jour, hors prophétique) + moments de jour (sémantique)
    const links: any[] = []
    const usedInLinks = new Set<string>()

    // Finalistes « rêves reliés », déjà filtrés par la RPC. Peut être vide.
    const dreamFinalists = echoIds
      .filter(id => !propheticSet.has(id))
      .map(id => rowById.get(id))
      .filter((r): r is KRow => !!r && (r.kairos_type || 'reve') !== 'note_jour')

    // Re-ranking LLM : garde ou écarte, n'ajoute jamais rien. Peut répondre « aucun ».
    // null = indisponible → on garde l'ordre par score filtré (dégradation, jamais rien).
    let ordered = dreamFinalists
    if (dreamFinalists.length > 0) {
      const kept = await rerankResonanceCandidates({
        supabase,
        userId,
        sourceId: params.id,
        sourceText: src.raw_text || '',
        candidates: dreamFinalists.map(r => ({ id: r.id, text: r.raw_text || '' })),
      })
      if (kept !== null) {
        const byId = new Map(dreamFinalists.map(r => [r.id, r]))
        ordered = kept.map(id => byId.get(id)).filter((r): r is KRow => !!r)
      }
    }

    for (const r of ordered) {
      if (usedInLinks.has(r.id)) continue
      const { reason, kind } = reasonFor(src as KRow, r)
      const sc = scoreById.get(r.id)
      links.push({ id: r.id, kind: 'dream', title: r.title, label: labelOf(r), excerpt: previewOf(r), created_at: r.created_at, kairos_type: r.kairos_type, reason, reason_kind: kind, z: sc?.z ?? null, adjusted: sc?.adjusted ?? null })
      usedInLinks.add(r.id)
      if (links.length >= MAX_DREAM_LINKS) break // plafond — le plancher, lui, est 0
    }

    let dayCount = 0
    for (const id of daySemIds) {
      if (usedInLinks.has(id) || propheticSet.has(id)) continue
      const r = rowById.get(id)
      if (!r) continue
      const { reason, kind } = reasonFor(src as KRow, r)
      links.push({ id: r.id, kind: 'day', title: r.title, label: labelOf(r), excerpt: previewOf(r), created_at: r.created_at, kairos_type: r.kairos_type, reason, reason_kind: kind })
      usedInLinks.add(id)
      if (++dayCount >= MAX_DAY_LINKS) break
    }

    // Écho ancien : côte-à-côte → on renvoie le texte plus complet + l'écart en jours + la raison
    const prophetic: any[] = []
    for (const p of propheticRows) {
      const r = rowById.get(p.id)
      if (!r) continue
      const { reason, kind } = reasonFor(src as KRow, r)
      prophetic.push({
        id: r.id,
        title: r.title,
        excerpt: (r.raw_text || '').slice(0, 420),
        created_at: r.created_at,
        reason, reason_kind: kind,
        days_diff: daysBetween(src.created_at, r.created_at),
        z: scoreById.get(r.id)?.z ?? null,
        adjusted: scoreById.get(r.id)?.adjusted ?? null,
      })
      if (prophetic.length >= MAX_PROPHETIC) break
    }

    // Plafond d'exposition : un rêve ancien servi ne peut pas l'être indéfiniment.
    // (L'audit relevait UN rêve servi 59 fois sur 64 comme « celui qui préparait ».)
    // Best-effort — un échec d'écriture ne doit jamais casser l'affichage.
    if (prophetic.length) {
      try {
        await supabase.from('kairos_exposure_log').insert(
          prophetic.map(p => ({ user_id: userId, kairos_id: p.id, register: 'prophetic' })),
        )
      } catch { /* le plafond dégrade en douceur */ }
      // Un écho ancien qui franchit TOUS les verrous (seuil D4, z, maturation
      // ECHO_RIPENING) est, par définition, l'écho « mûr » que /api/echoes/
      // prophetic/matured attend depuis toujours sans que personne ne l'écrive.
      try {
        await supabase
          .from('kairos')
          .update({ prophetic_status: 'awakened' })
          .eq('user_id', userId)
          .eq('prophetic_status', 'dormant')
          .in('id', prophetic.map(p => p.id))
      } catch { /* non bloquant */ }
    }

    // Taille du corpus : l'écran ne doit pas dire la même chose à quelqu'un qui
    // vient d'arriver et à quelqu'un dont ce rêve, précisément, se tient seul.
    let corpusSize = 0
    try {
      const { count } = await supabase
        .from('kairos')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
      corpusSize = count ?? 0
    } catch { /* non bloquant */ }

    return corsify(NextResponse.json({
      source: {
        id: src.id,
        kairos_type: src.kairos_type,
        created_at: src.created_at,
        excerpt: (src.raw_text || '').slice(0, 420),
      },
      links,
      prophetic,
      corpus_size: corpusSize,
    }))
  } catch (e: any) {
    console.error('[kairos/resonance.GET]', e)
    return corsify(NextResponse.json({ error: e.message || 'failed' }, { status: 500 }))
  }
}
