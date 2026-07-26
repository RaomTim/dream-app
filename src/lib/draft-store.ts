'use client'

/**
 * DRAFT-STORE — le brouillon écrit ne s'évapore plus.
 * ════════════════════════════════════════════════════════════════════════════
 * Constat du 26/07 : `const [text, setText] = useState('')` — état React nu.
 * Aucun `beforeunload`, aucun `localStorage`. Écrire un rêve puis basculer
 * d'application, recevoir un appel, ou laisser l'OS tuer l'onglet = tout perdu.
 *
 * Et il y avait pire : `page.tsx:1280` écrivait `dream_pending_<timestamp>` en
 * dernier recours… **clé jamais relue par une seule ligne du code.** Des textes
 * de rêveurs dorment donc dans le localStorage de leur téléphone, inaccessibles.
 * Ce module les récupère (`listOrphanDrafts`) avant de les nettoyer — on ne
 * supprime jamais un texte de rêveur sans l'avoir d'abord proposé à la lecture.
 *
 * Yeshua (Opus), agent A1, 2026-07-26.
 */
import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'dream.draft.'
/** l'ancienne clé morte de page.tsx:1280 — écrite, jamais relue. */
const ORPHAN_PREFIX = 'dream_pending_'
/** au-delà, un brouillon n'est plus un brouillon : c'est un vestige. */
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
const DEBOUNCE_MS = 400
/** on ne garde pas un brouillon d'un caractère : ça ferait du bruit, pas un filet. */
const MIN_CHARS = 3

export interface Draft {
  text: string
  /** ISO — l'instant de la dernière frappe. */
  at: string
  /** d'où il vient : brouillon normal, ou clé orpheline récupérée. */
  origin?: 'draft' | 'orphan'
  /** clé de stockage réelle (utile pour purger un orphelin précis). */
  key?: string
}

function ls(): Storage | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

/* ─────────── brouillon courant ─────────── */

/** Écrit le brouillon d'un emplacement (`orbe`, `coeur`, `postDepot`…). */
export function saveDraft(slot: string, text: string): void {
  const store = ls()
  if (!store) return
  try {
    const clean = (text || '').trim()
    if (clean.length < MIN_CHARS) { store.removeItem(PREFIX + slot); return }
    store.setItem(PREFIX + slot, JSON.stringify({ text, at: new Date().toISOString() }))
  } catch {
    // quota plein : on ne casse jamais la saisie pour ça.
  }
}

/** Relit le brouillon d'un emplacement. `null` si absent, vide ou périmé. */
export function loadDraft(slot: string): Draft | null {
  const store = ls()
  if (!store) return null
  try {
    const raw = store.getItem(PREFIX + slot)
    if (!raw) return null
    const j = JSON.parse(raw)
    if (typeof j?.text !== 'string' || j.text.trim().length < MIN_CHARS) return null
    const at = typeof j?.at === 'string' ? j.at : new Date().toISOString()
    if (Date.now() - new Date(at).getTime() > MAX_AGE_MS) { store.removeItem(PREFIX + slot); return null }
    return { text: j.text, at, origin: 'draft', key: PREFIX + slot }
  } catch {
    return null
  }
}

/** Efface le brouillon — à appeler UNE FOIS le dépôt réellement enregistré. */
export function clearDraft(slot: string): void {
  const store = ls()
  if (!store) return
  try { store.removeItem(PREFIX + slot) } catch {}
}

/* ─────────── récupération des clés orphelines `dream_pending_*` ─────────── */

/**
 * Les textes écrits par l'ancien dernier recours (page.tsx:1280), qu'aucune
 * ligne du code ne relisait. Les plus récents d'abord.
 */
export function listOrphanDrafts(): Draft[] {
  const store = ls()
  if (!store) return []
  const out: Draft[] = []
  try {
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i)
      if (!key || key.indexOf(ORPHAN_PREFIX) !== 0) continue
      const text = store.getItem(key) || ''
      if (text.trim().length < MIN_CHARS) continue
      const ts = Number(key.slice(ORPHAN_PREFIX.length))
      const at = Number.isFinite(ts) && ts > 0 ? new Date(ts).toISOString() : new Date().toISOString()
      out.push({ text, at, origin: 'orphan', key })
    }
  } catch {
    return out
  }
  return out.sort((a, b) => (a.at < b.at ? 1 : -1))
}

/** Supprime une clé orpheline précise (après que le rêveur l'a récupérée ou écartée). */
export function purgeOrphanDraft(key: string): void {
  const store = ls()
  if (!store || key.indexOf(ORPHAN_PREFIX) !== 0) return
  try { store.removeItem(key) } catch {}
}

/**
 * Nettoie les orphelins VIDES ou périmés uniquement.
 * ⚠️ Ne supprime jamais un texte encore lisible : ce sont des rêves.
 */
export function purgeStaleOrphans(): number {
  const store = ls()
  if (!store) return 0
  let removed = 0
  try {
    const doomed: string[] = []
    for (let i = 0; i < store.length; i++) {
      const key = store.key(i)
      if (!key || key.indexOf(ORPHAN_PREFIX) !== 0) continue
      const text = store.getItem(key) || ''
      const ts = Number(key.slice(ORPHAN_PREFIX.length))
      const tooOld = Number.isFinite(ts) && ts > 0 && Date.now() - ts > MAX_AGE_MS
      if (text.trim().length < MIN_CHARS || tooOld) doomed.push(key)
    }
    for (const k of doomed) { store.removeItem(k); removed++ }
  } catch {}
  return removed
}

/**
 * Le brouillon à proposer au montage : celui de l'emplacement, sinon le plus
 * récent des orphelins récupérables. Un texte écrit un jour se retrouve.
 */
export function loadDraftOrOrphan(slot: string): Draft | null {
  const own = loadDraft(slot)
  if (own) return own
  const orphans = listOrphanDrafts()
  return orphans.length ? orphans[0] : null
}

/* ─────────── le hook — une ligne dans page.tsx ─────────── */

/**
 * Remplace `useState('')` sur un champ de saisie de rêve.
 *
 *   const [text, setText, clear] = useDraft('orbe')
 *
 * · restauration au montage (brouillon du même emplacement, sinon orphelin) ;
 * · sauvegarde debounce (400 ms) à chaque frappe ;
 * · sauvegarde immédiate si l'onglet passe en arrière-plan ou se ferme —
 *   c'est le cas qui compte : l'OS tue les WebViews sans prévenir ;
 * · `clear()` à appeler une fois le dépôt enregistré.
 */
export function useDraft(slot: string, initial = ''): [string, (v: string) => void, () => void] {
  const [text, setTextState] = useState(initial)
  const latest = useRef(initial)
  const timer = useRef<any>(null)
  const restored = useRef(false)

  // restauration — une seule fois, et jamais par-dessus une saisie en cours.
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    const d = loadDraftOrOrphan(slot)
    if (d && d.text.trim() && !latest.current.trim()) {
      latest.current = d.text
      setTextState(d.text)
      // un orphelin récupéré a rempli son office : il devient un brouillon normal.
      if (d.origin === 'orphan' && d.key) { saveDraft(slot, d.text); purgeOrphanDraft(d.key) }
    }
    purgeStaleOrphans()
  }, [slot])

  const setText = useCallback((v: string) => {
    latest.current = v
    setTextState(v)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => saveDraft(slot, v), DEBOUNCE_MS)
  }, [slot])

  const clear = useCallback(() => {
    clearTimeout(timer.current)
    latest.current = ''
    setTextState('')
    clearDraft(slot)
  }, [slot])

  // Le filet qui compte vraiment : l'app part en arrière-plan, l'OS la tue.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const flush = () => { clearTimeout(timer.current); saveDraft(slot, latest.current) }
    const onHide = () => { if (document.visibilityState === 'hidden') flush() }
    window.addEventListener('pagehide', flush)
    window.addEventListener('beforeunload', flush)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      flush()
      window.removeEventListener('pagehide', flush)
      window.removeEventListener('beforeunload', flush)
      document.removeEventListener('visibilitychange', onHide)
      clearTimeout(timer.current)
    }
  }, [slot])

  return [text, setText, clear]
}
