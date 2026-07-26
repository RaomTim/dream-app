/**
 * wowRegistry — V1.2
 *
 * Registry localStorage des Wow déjà déclenchés (idempotents).
 * Permet de garantir qu'un Wow ne se déclenche qu'une seule fois par utilisateur.
 *
 * Wow 0 : "first-launch"               — premier accès Onboarding
 * Wow 1 : "premier-kairos"             — premier kairos (rêve) déposé
 * Wow 2 : "premier-echo-prophetique"   — premier écho prophétique détecté
 * Wow 3 : "big-dream-marquage"         — Big Dream marqué (signal permanent)
 * Wow 4 : "naissance-noeud"            — naissance d'un noeud constellation
 * Wow 5 : "premiere-restitution-cercle" — première restitution cercle
 *
 * API :
 *   wowRegistry.has(name)     → boolean
 *   wowRegistry.fire(name)    → marque + dispatch CustomEvent("wow:fire"). Idempotent.
 *   wowRegistry.demo(name)    → démontre sans persister (Tweaks/preview).
 *   wowRegistry.reset(name?)  → reset un nom, ou tout si pas d'arg.
 *   wowRegistry.subscribe(fn) → abonne un listener (renvoie un unsubscribe).
 *   wowRegistry.list          → tous les noms valides.
 */

export const WOW_KEY = 'dream:wow-fired'

export const WOW_NAMES = [
  'first-launch',
  'premier-kairos',
  'premier-echo-prophetique',
  'big-dream-marquage',
  'naissance-noeud',
  'premiere-restitution-cercle',
] as const

export type WowName = typeof WOW_NAMES[number]

export interface WowFireDetail {
  name: WowName
  real: boolean
}

type Listener = (state: Record<string, number>) => void
const wowListeners = new Set<Listener>()

const _readWow = (): Record<string, number> => {
  if (typeof window === 'undefined') return {}
  try { return JSON.parse(localStorage.getItem(WOW_KEY) || '{}') } catch { return {} }
}

const _writeWow = (state: Record<string, number>) => {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(WOW_KEY, JSON.stringify(state)) } catch {}
  wowListeners.forEach(fn => { try { fn(state) } catch {} })
}

export const wowRegistry = {
  has(name: WowName): boolean { return !!_readWow()[name] },
  fire(name: WowName): boolean {
    if (!WOW_NAMES.includes(name)) return false
    const s = _readWow()
    if (s[name]) return false // idempotent
    s[name] = Date.now()
    _writeWow(s)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<WowFireDetail>('wow:fire', { detail: { name, real: true } }))
    }
    return true
  },
  demo(name: WowName): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent<WowFireDetail>('wow:fire', { detail: { name, real: false } }))
    }
  },
  reset(name?: WowName): void {
    const s = _readWow()
    if (name) delete s[name]
    else WOW_NAMES.forEach(n => delete s[n])
    _writeWow(s)
  },
  subscribe(fn: Listener): () => void {
    wowListeners.add(fn)
    return () => wowListeners.delete(fn)
  },
  list: WOW_NAMES,
}
