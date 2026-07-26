/**
 * ritualSound — V1.2
 *
 * Sons rituels Web Audio synthétisés (stub V1.2).
 * Refs samples freesound.org pour upgrade prod (cf. README §6 du handoff).
 *
 * Toggle utilisateur via clé localStorage "dream:ritual-sound".
 *
 * 5 noms supportés :
 *   - "souffle"     — passage de seuil, ~6s, voile basse fréquence
 *   - "braise"      — pulsation cardiaque ralentie ~1.6s (gate ember)
 *   - "tisse"       — fil bref tissé ~400ms, plink feutré (chat narratrice)
 *   - "ceremoniel"  — gong feutré ~1.2s (passages rituels, Wow)
 *   - "ancrage"     — drone earth ~2s, basse profonde
 */

export type RitualSoundKind = 'souffle' | 'braise' | 'tisse' | 'ceremoniel' | 'ancrage'

const RITUAL_KEY = 'dream:ritual-sound'

export function ritualSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const v = localStorage.getItem(RITUAL_KEY)
    return v === null ? true : v === 'true' // ON par défaut
  } catch { return true }
}

export function setRitualSound(on: boolean): void {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(RITUAL_KEY, String(!!on)) } catch {}
}

let _audioCtx: AudioContext | null = null
const _ctx = (): AudioContext | null => {
  if (typeof window === 'undefined') return null
  if (!_audioCtx) {
    try {
      const Ctor = (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext
        || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      _audioCtx = new Ctor()
    } catch { return null }
  }
  return _audioCtx
}

export function playRitual(kind: RitualSoundKind): void {
  if (!ritualSoundEnabled()) return
  const ctx = _ctx()
  if (!ctx) return
  if (ctx.state === 'suspended') ctx.resume()
  const t = ctx.currentTime

  if (kind === 'souffle') {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 110
    const g = ctx.createGain(); g.gain.value = 0
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 380
    o.connect(f); f.connect(g); g.connect(ctx.destination)
    g.gain.linearRampToValueAtTime(0.045, t + 1.5)
    g.gain.linearRampToValueAtTime(0.06, t + 3)
    g.gain.linearRampToValueAtTime(0, t + 6)
    o.start(t); o.stop(t + 6)
  } else if (kind === 'braise') {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 65
    const g = ctx.createGain(); g.gain.value = 0
    o.connect(g); g.connect(ctx.destination)
    g.gain.linearRampToValueAtTime(0.08, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)
    g.gain.linearRampToValueAtTime(0.06, t + 1.0)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    o.start(t); o.stop(t + 1.6)
  } else if (kind === 'tisse') {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 880
    const g = ctx.createGain(); g.gain.value = 0
    o.connect(g); g.connect(ctx.destination)
    g.gain.linearRampToValueAtTime(0.06, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38)
    o.frequency.exponentialRampToValueAtTime(660, t + 0.38)
    o.start(t); o.stop(t + 0.4)
  } else if (kind === 'ceremoniel') {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 220
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = 330 // 5th
    const g = ctx.createGain(); g.gain.value = 0
    o.connect(g); o2.connect(g); g.connect(ctx.destination)
    g.gain.linearRampToValueAtTime(0.07, t + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
    o.start(t); o.stop(t + 1.3)
    o2.start(t); o2.stop(t + 1.3)
  } else if (kind === 'ancrage') {
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 55
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 220
    const g = ctx.createGain(); g.gain.value = 0
    o.connect(f); f.connect(g); g.connect(ctx.destination)
    g.gain.linearRampToValueAtTime(0.05, t + 0.3)
    g.gain.linearRampToValueAtTime(0, t + 2)
    o.start(t); o.stop(t + 2)
  }
}
