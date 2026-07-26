/**
 * src/lib/alarm-sounds.ts — Réveil doux (Dream)
 *
 * Trois ambiances de réveil 100% GÉNÉRÉES en Web Audio — aucun fichier binaire,
 * aucun enregistrement. Départ TRÈS doux, montée progressive (spec §7/§14 +
 * braindump §12ter.F « alarme native stylée »).
 *
 * Honnêteté (red line) : ces sons sont SYNTHÉTISÉS, pas de la nature captée.
 * Les libellés le disent — « Pluie douce (générée) ». On ne ment jamais sur
 * l'origine.
 *
 * Fiabilité native : quand l'app est wrappée Capacitor, la vraie alarme (même
 * app fermée) passe par @capacitor/local-notifications côté ReveilScreen. Le
 * Web Audio ci-dessous ne sonne QUE si l'onglet/app est actif. Le son custom
 * natif (Carillon/Pluie/Aube en .wav) exige des assets bundlés au build —
 * voir docs/ALARM-NATIVE-SOUNDS.md.
 */

export type AmbianceId = 'carillon' | 'pluie' | 'aube'

export interface Ambiance {
  id: AmbianceId
  /** clé i18n du nom affiché (core.reveil.amb*) */
  nameKey: string
}

export const AMBIANCES: Ambiance[] = [
  { id: 'carillon', nameKey: 'core.reveil.ambCarillon' },
  { id: 'pluie', nameKey: 'core.reveil.ambPluie' },
  { id: 'aube', nameKey: 'core.reveil.ambAube' },
]

export interface AlarmHandle {
  stop: () => void
}

const NOOP: AlarmHandle = { stop: () => {} }

function makeCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || (window as any).webkitAudioContext
  if (!AC) return null
  const ctx: AudioContext = new AC()
  // les navigateurs modernes démarrent le contexte suspendu tant qu'aucun geste
  // n'a eu lieu — un tap sur « écouter »/« armer » suffit à le réveiller.
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

/* ─── CARILLON : cloches douces, partiels légèrement inharmoniques ─── */
function carillon(ctx: AudioContext, out: GainNode, loop: boolean): () => void {
  const notes = [392, 523.25, 659.25, 783.99] // sol · do · mi · sol
  const timers: number[] = []
  const strike = (f: number, at: number) => {
    // fondamentale + 2 partiels façon cloche (decay long)
    const parts: [number, number][] = [[1, 0.5], [2.01, 0.26], [3.94, 0.12]]
    parts.forEach(([mult, amp]) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f * mult
      o.connect(g)
      g.connect(out)
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(amp, at + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 3.4)
      o.start(at)
      o.stop(at + 3.6)
    })
  }
  const phrase = (base: number) => notes.forEach((f, i) => strike(f, base + i * 0.9))
  phrase(ctx.currentTime + 0.05)
  if (loop) {
    timers.push(window.setInterval(() => phrase(ctx.currentTime + 0.05), notes.length * 900 + 1600))
  }
  return () => timers.forEach(id => clearInterval(id))
}

/* ─── PLUIE DOUCE (générée) : nappe de bruit filtré + gouttes ponctuelles ─── */
function pluie(ctx: AudioContext, out: GainNode, loop: boolean): () => void {
  const dur = 2
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 320
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1400
  lp.Q.value = 0.3
  const hiss = ctx.createGain()
  hiss.gain.value = 0.45
  src.connect(hp)
  hp.connect(lp)
  lp.connect(hiss)
  hiss.connect(out)
  src.start()

  const timers: number[] = []
  const drop = () => {
    const t0 = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.value = 900 + Math.random() * 1400
    o.connect(g)
    g.connect(out)
    g.gain.setValueAtTime(0, t0)
    g.gain.linearRampToValueAtTime(0.1, t0 + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12)
    o.start(t0)
    o.stop(t0 + 0.14)
  }
  if (loop) {
    const tick = () => {
      drop()
      if (Math.random() > 0.5) drop()
      timers.push(window.setTimeout(tick, 220 + Math.random() * 520))
    }
    tick()
  } else {
    for (let k = 0; k < 6; k++) timers.push(window.setTimeout(drop, 200 + k * 300 + Math.random() * 150))
  }
  return () => {
    try { src.stop() } catch {}
    timers.forEach(id => clearTimeout(id))
  }
}

/* ─── AUBE : drone chaleureux qui monte (loudness + brillance croissantes) ─── */
function aube(ctx: AudioContext, out: GainNode, loop: boolean, rampSec: number): () => void {
  void loop // le drone est continu par nature — le loop est géré par le sustain
  const root = 110 // La2
  const partials = [1, 1.5, 2, 3] // fondamentale · quinte · octave · douzième
  const nodes: OscillatorNode[] = []
  // un lowpass qui s'ouvre lentement = la lumière qui monte
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(280, ctx.currentTime)
  lp.frequency.linearRampToValueAtTime(2200, ctx.currentTime + rampSec)
  lp.connect(out)
  partials.forEach((mult, i) => {
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = i === 0 ? 'triangle' : 'sine'
    o.frequency.value = root * mult
    o.detune.value = (i - 1.5) * 4 // léger désaccord chaud
    g.gain.value = 0.3 / (i + 1)
    o.connect(g)
    g.connect(lp)
    o.start()
    nodes.push(o)
  })
  // shimmer très lent sur la quinte (mouvement vivant, pas statique)
  const lfo = ctx.createOscillator()
  const lfoG = ctx.createGain()
  lfo.frequency.value = 0.08
  lfoG.gain.value = 3
  lfo.connect(lfoG)
  lfoG.connect(nodes[1].detune)
  lfo.start()
  nodes.push(lfo)
  return () => nodes.forEach(o => { try { o.stop() } catch {} })
}

function playAmbiance(id: AmbianceId, opts: { attackSec: number; peak: number; loop: boolean }): AlarmHandle {
  const ctx = makeCtx()
  if (!ctx) return NOOP
  const master = ctx.createGain()
  master.gain.setValueAtTime(0.0001, ctx.currentTime)
  // départ très doux : montée linéaire vers le pic sur attackSec
  master.gain.linearRampToValueAtTime(opts.peak, ctx.currentTime + opts.attackSec)
  master.connect(ctx.destination)

  let cleanup: () => void
  if (id === 'pluie') cleanup = pluie(ctx, master, opts.loop)
  else if (id === 'aube') cleanup = aube(ctx, master, opts.loop, Math.max(opts.attackSec, 12))
  else cleanup = carillon(ctx, master, opts.loop)

  let stopped = false
  return {
    stop() {
      if (stopped) return
      stopped = true
      try {
        const now = ctx.currentTime
        master.gain.cancelScheduledValues(now)
        master.gain.setValueAtTime(master.gain.value, now)
        master.gain.linearRampToValueAtTime(0.0001, now + 0.4) // fondu de sortie, pas de clic
      } catch {}
      try { cleanup() } catch {}
      window.setTimeout(() => { try { ctx.close() } catch {} }, 600)
    },
  }
}

/** Test d'écoute (1 tap) : court (~6 s), montée rapide mais douce, ne boucle pas. */
export function previewAmbiance(id: AmbianceId): AlarmHandle {
  const h = playAmbiance(id, { attackSec: 0.8, peak: 0.5, loop: false })
  const to = window.setTimeout(() => h.stop(), 6000)
  return {
    stop() {
      clearTimeout(to)
      h.stop()
    },
  }
}

/** Alarme réelle : montée TRÈS progressive, boucle jusqu'à stop(). */
export function startAlarm(id: AmbianceId): AlarmHandle {
  return playAmbiance(id, { attackSec: id === 'aube' ? 30 : 18, peak: 0.85, loop: true })
}

/* ─── VIBRATION progressive (crescendo) — navigator.vibrate ─── */
let vibrateTimer: number | null = null

export function startVibration(): () => void {
  if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return () => {}
  // patterns croissants : buzz de plus en plus long et insistant
  const patterns: number[][] = [
    [120, 400],
    [200, 300, 200, 400],
    [300, 250, 300, 250, 400],
    [500, 200, 500, 200, 500],
  ]
  let step = 0
  const pulse = () => {
    const p = patterns[Math.min(step, patterns.length - 1)]
    try { navigator.vibrate(p) } catch {}
    step++
    const total = p.reduce((a, b) => a + b, 0)
    vibrateTimer = window.setTimeout(pulse, total + 600)
  }
  pulse()
  return stopVibration
}

export function stopVibration(): void {
  if (vibrateTimer !== null) {
    clearTimeout(vibrateTimer)
    vibrateTimer = null
  }
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(0)
  } catch {}
}
