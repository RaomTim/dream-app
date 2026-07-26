/**
 * DREAM DESIGN SYSTEM — « NUIT ULTRA SIMPLE »
 * ────────────────────────────────────────────
 * Source de vérité unique du re-skin validé par Tim (Claude Design, pages 2-3
 * du projet « DREAM exploration MVP », 2026-07-10) : la nuit d'un feu qui
 * s'éteint — brun-ambre chaud, JAMAIS noir pur, JAMAIS bleu-gris. Un seul
 * foyer lumineux par écran. Grain imperceptible. Rien ne claque.
 *
 * Écrit par Yeshua (lead), 2026-07-11 — chantier H.
 * Les clés reprennent EXACTEMENT l'API de l'ancien objet T/DT de page.tsx :
 * remplacer l'import suffit, zéro refactor d'appel.
 *
 * Règles dures (spec §0.6 + accessibilité) :
 *  - corps de texte ≥ 17px (méta/labels ≥ 13px) — c'est du contenu, pas du décor
 *  - contraste AA sur cream/ink vs bg (vérifié : #f2e8d5 sur #1a1310 ≈ 12:1)
 *  - fondus 377ms, respiration 5000ms, ease douce — reduced-motion coupe tout
 *  - un seul élément respire par écran (la lune / le soleil)
 */

/* ─────────── NUIT — « le feu qui s'éteint » ─────────── */
export const T = {
  // fond radial : cœur légèrement plus chaud que les bords, jamais noir pur
  bg: 'radial-gradient(120% 72% at 50% 38%, #241a12 0%, #1a1310 58%, #140e0a 100%)',
  bgDay: 'radial-gradient(120% 72% at 50% 38%, #241a12 0%, #1a1310 58%, #140e0a 100%)', // legacy alias (écrans nuit)
  bgFlat: '#1a1310',            // pour les surfaces sans radial (modals, sheets)
  gold: '#c9a86a',              // or désaturé chaud (l'accent — boutons, liens, glyphes)
  goldLit: '#e4cf9e',           // or éclairé (hover/actif, lueur de la lune)
  cream: '#f2e8d5',             // la lumière : titres, texte principal, la lune
  ink: '#e5d8bd',               // corps de texte long (à peine plus doux que cream)
  dim: 'rgba(242,232,213,0.55)',   // texte secondaire
  faint: 'rgba(242,232,213,0.34)', // méta, placeholders, séparateurs texte
  card: 'rgba(201,168,106,0.06)',            // fond de carte
  cardBorder: '0.5px solid rgba(201,168,106,0.16)', // liseré de carte
  line: 'rgba(201,168,106,0.14)',  // séparateurs
  // typographie (familles conservées — c'est la voix du design validé)
  serif: '"EB Garamond", "Cormorant Garamond", Georgia, serif',
  display: '"EB Garamond", "Cormorant Garamond", Georgia, serif', // Cinzel retiré : la simplicité prime
  sans: '"Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',
  // matter-accents (sémantiques, alignés sur la chaleur — jamais saturés)
  silkGold: 'oklch(0.72 0.075 85)',   // prophétique · écho · Wow
  emberLive: 'oklch(0.64 0.120 45)',  // numinosité forte · attention
  paperWarm: 'oklch(0.64 0.045 75)',  // carnet · notes
  clayEarth: 'oklch(0.52 0.055 55)',  // résolu · complétion
  stoneCool: 'oklch(0.58 0.020 90)',  // l'envers (réchauffé : plus jamais bleu)
} as const

/* ─────────── JOUR — « le papier au soleil » (miroir exact) ─────────── */
export const DT = {
  paper: 'radial-gradient(122% 78% at 50% 32%, #faf3e2 0%, #f4ead1 56%, #ecdfbe 100%)',
  paperFlat: '#f4ead1',
  ink: '#2b2115',                    // encre brune profonde (contraste AA+ sur papier)
  inkSoft: '#4a3b28',                // corps de texte
  dim: 'rgba(43,33,21,0.58)',        // secondaire
  faint: 'rgba(43,33,21,0.36)',      // méta
  gold: '#8f7134',                   // or dense (tient sur le clair)
  goldLit: '#b3924f',
  sun: '#f0dfae',                    // le disque du soleil
  sunGlow: 'rgba(240,223,174,0.55)', // son halo
  card: 'rgba(143,113,52,0.07)',
  cardBorder: '0.5px solid rgba(143,113,52,0.20)',
  line: 'rgba(143,113,52,0.18)',
} as const

/* ─────────── ÉCHELLE & MOUVEMENT ─────────── */
export const SCALE = {
  body: 17,        // plancher du corps de texte — jamais en dessous
  bodyLg: 19,      // lecture longue (texte du rêve)
  meta: 13,        // plancher absolu (dates, labels)
  small: 14,       // secondaire
  title: 28,       // titres d'écran
  display: 40,     // le mot de l'accueil (« rêve », « aujourd'hui »)
  radius: 13,      // cartes
  radiusLg: 21,    // sheets, modals
  radiusPill: 999, // boutons pilule, chips
  touch: 44,       // cible tactile minimum
} as const

export const MOTION = {
  fade: 377,        // apparitions (ms)
  swap: 610,        // bascule nuit↔jour
  breathe: 5000,    // respiration lune/soleil
  ease: 'cubic-bezier(0.382, 0, 0.618, 1)',
} as const

/* ─────────── GRAIN — la matière (2.5%, on le sent plus qu'on ne le voit) ─────────── */
export const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Style prêt à poser en overlay plein écran (pointer-events none). */
export const grainOverlay = (opacity = 0.025): React.CSSProperties => ({
  position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
  backgroundImage: GRAIN_DATA_URI, backgroundRepeat: 'repeat', opacity,
})

/* ─────────── LA LUNE / LE SOLEIL — le foyer unique (remplace la fleur de vie) ───────────
 * Un simple disque lumineux qui respire. C'est l'identité du design validé (D3) :
 * pas de géométrie sacrée affichée — la présence suffit.
 * Usage : <MoonStyles/> une fois par écran porteur, puis un <div style={moonStyle(size, day)}/>.
 */
/* 2026-07-26 — correction du foyer DE JOUR (constatée au rendu, pas au code).
 * Côté nuit, la lune crème sur fond brun-noir a une vraie présence : elle émet.
 * Côté jour, le même dessin posé sur du parchemin devenait un disque jaune PLAT :
 * son stop le plus sombre (#e3cd92) frôlait la couleur du papier (#f4ead1), donc
 * aucun bord ne se détachait, et son halo (crème très clair) était plus clair que
 * le fond — il ne pouvait rien éclairer.
 * Le foyer de jour n'est pas un soleil pâle, c'est une BRAISE : plus chaude et
 * plus dense que le papier, avec une auréole ambrée qui la creuse.
 * ⚠️ À noter : la face jour ne fait PAS partie des 5 frames « NUIT ULTRA SIMPLE »
 * validées par Tim le 10/07 — c'est une transcription. Elle attend son œil. */
export const moonStyle = (size = 180, day = false): React.CSSProperties => ({
  width: size, height: size, borderRadius: '50%',
  background: day
    ? `radial-gradient(circle at 38% 32%, #fdf4d8 0%, ${DT.sun} 42%, #e0bf78 78%, #cfa456 100%)`
    : `radial-gradient(circle at 38% 32%, #fbf4e3 0%, ${T.cream} 55%, #dfd0b0 100%)`,
  boxShadow: day
    ? `0 0 ${size * 0.45}px ${size * 0.12}px ${DT.sunGlow}, 0 0 ${size * 0.89}px ${size * 0.21}px rgba(197,138,52,0.24)`
    : `0 0 ${size * 0.5}px ${size * 0.13}px rgba(242,232,213,0.22), 0 0 ${size * 1.1}px ${size * 0.3}px rgba(201,168,106,0.10)`,
  animation: 'dream-breathe 5s ease-in-out infinite',
})

/** Keyframes globales (à injecter une fois — <style>{DREAM_KEYFRAMES}</style>). */
export const DREAM_KEYFRAMES = `
@keyframes dream-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.015); } }
@keyframes dream-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.15s !important; }
}`

import type React from 'react'
