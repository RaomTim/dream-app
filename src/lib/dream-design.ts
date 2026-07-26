/**
 * DREAM DESIGN SYSTEM — « NUIT BLEUE VIVANTE »
 * ────────────────────────────────────────────
 * Source de vérité unique. Étalon : l'export Claude Design du 26/07,
 * `_designs_from_claude/nuit-bleue-vivante-2026-07-26/` — direction 4,
 * « palette du 2, mouvement du 3 », six panneaux (accueil · ton rêve ·
 * comprendre · groupe · mur · tokens). Le 6ᵉ panneau EST la spec ci-dessous.
 *
 * CE QUI A CHANGÉ LE 26/07, ET POURQUOI CE N'EST PAS UN RECOLORIAGE
 * ─────────────────────────────────────────────────────────────────
 * La nuit passe du BRUN-AMBRE au BLEU-VIOLET (#221d29, oklch .24 .022 305).
 * Ça contredit frontalement la règle écrite du 11/07 (« JAMAIS bleu-gris ») :
 * c'est assumé, c'est l'étalon que Tim a envoyé, et la contradiction est
 * signalée dans RAPPORT-D1 plutôt que masquée.
 *
 * Mais la bascule n'est pas qu'une teinte de fond. Elle sépare deux familles
 * qui étaient confondues :
 *   · LA LUMIÈRE reste CHAUDE — la lune, l'or, les titres (#f1e8d7, #e0c087).
 *   · L'AMBIANCE devient FROIDE — corps, secondaire, méta virent au violet
 *     grisé (#ddd4de, #b9b0bd, #a49aad).
 * C'est ce contraste de température qui fait « vivante ». Avant, tout était
 * de la crème à des opacités différentes : un seul matériau, donc du plat.
 *
 * Et les SURFACES cessent d'être teintées d'or : cartes et liserés passent au
 * blanc translucide (rgba(255,255,255,.045) / .08). C'est ce qui laisse le
 * violet du fond remonter à travers les cartes au lieu de le réchauffer.
 *
 * DEUX ÉCARTS DÉLIBÉRÉS À L'ÉTALON (assumés, documentés, réversibles)
 * ───────────────────────────────────────────────────────────────────
 * 1. `#8f8698` (le méta de l'étalon) TOMBE À 4,26:1 sur le haut du dégradé
 *    (#2b2534) — sous la barre AA de 4,5:1. On prend `#a49aad`, l'autre méta
 *    de l'étalon (celui de « lundi 25 mai »), qui tient à 5,51:1 au pire.
 *    `#8f8698` survit sous le nom `mute`, réservé au NON-texte.
 * 2. Rayons et durées repassent par φ/Fibonacci (loi INFUSE,
 *    DESIGN-MATHEMATIQUES-SACREES.md) : 13/21 au lieu de 15/16, 89 s de
 *    dérive au lieu de 84, 34 ms/caractère au lieu de 42. Écarts < 10 %,
 *    invisibles à l'œil, et la loi reste tenue.
 *
 * Règles dures inchangées :
 *  - corps de texte ≥ 17px (méta/labels ≥ 13px) — c'est du contenu, pas du décor
 *  - contraste AA réel, VÉRIFIÉ aux deux bouts du dégradé (#2b2534 ET #191521)
 *  - fondus 377ms, respiration 5000ms — reduced-motion coupe tout
 *  - un seul élément respire par écran (la lune / la braise)
 */

/* ─────────── NUIT — « la nuit bleue, le feu qui veille » ───────────
 * Le dégradé est LINÉAIRE (168°) et non plus radial : l'étalon fait descendre
 * la nuit du haut vers le bas, elle ne rayonne plus d'un centre. Conséquence
 * voulue : la seule chose qui rayonne à l'écran, c'est la lune. */
export const T = {
  bg: 'linear-gradient(168deg, #2b2534 0%, #221d29 55%, #191521 100%)',
  bgDay: 'linear-gradient(168deg, #2b2534 0%, #221d29 55%, #191521 100%)', // legacy alias (écrans nuit)
  bgFlat: '#221d29',            // surfaces sans dégradé (modals, sheets, thème système)
  bgTop: '#2b2534',             // le haut du dégradé — c'est LUI qui décide des contrastes
  bgDeep: '#191521',            // le bas
  gold: '#e0c087',              // l'accent — boutons pleins, liens, glyphes
  goldLit: '#eed6a5',           // or éclairé (hover/actif)
  onGold: '#241f18',            // texte POSÉ SUR l'or plein (9,39:1 — jamais du crème)
  cream: '#f1e8d7',             // titres, le mot, la lumière            13,53:1
  text: '#ece3d4',              // UI forte (libellés de boutons fantômes) 12,94:1
  ink: '#ddd4de',               // corps de texte long, violet clair      11,40:1
  dim: '#b9b0bd',               // texte secondaire                        7,84:1
  faint: '#a49aad',             // méta, dates, kickers                    6,12:1 (5,51 au pire)
  mute: '#8f8698',              // ⚠️ NON-TEXTE uniquement (glyphes de séparation) — échoue AA
  card: 'rgba(255,255,255,0.045)',                    // fond de carte, neutre
  cardBorder: '1px solid rgba(255,255,255,0.08)',     // liseré de carte
  cardBorderLit: '1px solid rgba(255,255,255,0.11)',  // liseré de bouton fantôme
  line: 'rgba(255,255,255,0.08)',                     // séparateurs
  moonGlyph: '#e9dcbc',         // le ☾ dans les listes
  sunGlyph: '#e8b563',          // le ☀ dans les listes
  // typographie — l'étalon nomme trois familles, une par fonction
  serif: '"Newsreader", "EB Garamond", Georgia, serif',                    // corps long
  display: '"Cormorant Garamond", "EB Garamond", Georgia, serif',          // titres & le mot
  sans: '"Hanken Grotesk", "Inter", system-ui, sans-serif',                // UI
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", monospace',            // chiffres techniques
  // matter-accents (sémantiques) — retempérés sur la nuit bleue
  silkGold: 'oklch(0.82 0.075 82)',   // prophétique · écho · Wow (= l'or de l'étalon)
  emberLive: 'oklch(0.70 0.115 45)',  // numinosité forte · attention
  paperWarm: 'oklch(0.72 0.045 75)',  // carnet · notes
  clayEarth: 'oklch(0.62 0.055 55)',  // résolu · complétion
  stoneCool: 'oklch(0.75 0.018 310)', // l'envers — désormais violet, comme l'ambiance
} as const

/* ─────────── JOUR — « le papier patiné » ───────────
 * ⚠️ L'ÉTALON NE COUVRE PAS LA FACE JOUR. Rien de ce qui suit n'a été dessiné
 * par Claude Design : c'est une déduction, signalée comme telle.
 * Le raisonnement tenu : la nuit et le jour ne sont plus un miroir de teinte
 * (ils l'étaient quand la nuit était brune), ils sont un miroir de STRUCTURE.
 * Le sol change de température — plombé violet la nuit, parchemin le jour —
 * mais la LUMIÈRE reste la même chaleur des deux côtés. C'est elle qui fait
 * l'unité, pas le fond. */
export const DT = {
  paper: 'radial-gradient(122% 78% at 50% 32%, #faf3e2 0%, #f4ead1 56%, #ecdfbe 100%)',
  paperFlat: '#f4ead1',
  ink: '#2b2115',                    // encre brune profonde              13,17:1
  inkSoft: '#4a3b28',                // corps de texte                     9,01:1
  dim: '#4a3b28',                    // secondaire — ⚠️ ÉTAIT rgba(43,33,21,0.58) = 3,79:1, ÉCHOUAIT AA
  faint: 'rgba(43,33,21,0.50)',      // méta NON-critique uniquement
  gold: '#7a5f27',                   // or dense — ⚠️ ÉTAIT #8f7134 = 3,83:1, ÉCHOUAIT AA. Ici 5,02:1
  goldLit: '#8f7134',                // l'ancien or, relégué au décor (jamais du texte)
  onGold: '#f7f0dd',                 // texte posé sur un aplat d'or de jour
  sun: '#f0dfae',                    // le disque de la braise
  sunGlow: 'rgba(240,223,174,0.55)', // son halo
  card: 'rgba(43,33,21,0.045)',      // même grammaire que la nuit : neutre, pas doré
  cardBorder: '1px solid rgba(43,33,21,0.10)',
  cardBorderLit: '1px solid rgba(43,33,21,0.14)',
  line: 'rgba(43,33,21,0.10)',
} as const

/* ─────────── ÉCHELLE ───────────
 * Étalon : Cormorant 27–44 · Newsreader 16,5–17,5/1,6 · Hanken 11–16.
 * On garde `bodyLg: 19` pour le corps du RÊVE : c'est une contrainte produit
 * écrite (BRIEF §4.1, « le corps du rêve se lit en 19px, ligne 1.618 »), et
 * elle prime sur le 17,5 de l'étalon — l'étalon montre un extrait, pas un
 * rêve de quarante lignes relu trois ans après. */
export const SCALE = {
  body: 17,        // plancher du corps de texte — jamais en dessous
  bodyLg: 19,      // lecture longue (texte du rêve), interligne 1.618
  meta: 13,        // plancher absolu (dates, labels)
  small: 14,       // secondaire
  title: 28,       // titres d'écran
  titleLg: 34,     // titre d'un rêve
  display: 40,     // le mot de l'accueil (« rêve », « aujourd'hui »)
  kicker: 11,      // intertitre capitales espacées (Hanken 600, letterSpacing .2em)
  radius: 13,      // cartes (Fibonacci — l'étalon dit 16)
  radiusSm: 8,
  radiusLg: 21,    // sheets, modals
  radiusPill: 999, // chips
  touch: 44,       // cible tactile minimum
  gutter: 34,      // marge d'écran (Fibonacci — l'étalon dit 30)
  gapCard: 13,     // entre deux cartes (l'étalon dit 11–12)
  moon: 89,        // le foyer (Fibonacci — l'étalon dit 96)
  moonHalo: 233,   // son halo — 89/233 = φ², exactement la proportion de l'étalon
} as const

export const MOTION = {
  fade: 377,        // apparitions : opacité + 8px de montée
  rise: 8,          // les 8px en question
  swap: 610,        // bascule nuit↔jour
  breathe: 5000,    // respiration lune/braise — scale 1 → 1.015
  halo: 5000,       // le halo — opacité .46 → .60, scale 1 → 1.055
  grainDrift: 89000, // dérive du grain, accueil SEUL (Fibonacci ; l'étalon dit 84s)
  type: 34,         // ms par caractère quand Dream écrit (Fibonacci ; l'étalon dit 42)
  caret: 987,       // clignotement du curseur (Fibonacci ; l'étalon dit 1,1s)
  ease: 'cubic-bezier(0.382, 0, 0.618, 1)',
  easeOut: 'cubic-bezier(0.22, 0.61, 0.36, 1)', // la montée de 8px de l'étalon
} as const

/* ─────────── GRAIN — la matière ───────────
 * Étalon : 2,5 % sur l'accueil (et il DÉRIVE, 84 s), 2 % sur tout le reste
 * (et il ne bouge pas). La différence est le point : l'accueil est le seul
 * écran vivant, les écrans de lecture sont immobiles. */
export const GRAIN_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export const GRAIN_HOME = 0.025
export const GRAIN_QUIET = 0.02

/** Style prêt à poser en overlay plein écran (pointer-events none).
 *  `drift` : réservé à l'accueil — nulle part ailleurs. */
export const grainOverlay = (opacity = GRAIN_QUIET, drift = false): React.CSSProperties => ({
  position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
  backgroundImage: GRAIN_DATA_URI, backgroundRepeat: 'repeat', opacity,
  mixBlendMode: 'overlay',
  ...(drift ? { animation: `dream-grain-drift ${MOTION.grainDrift}ms linear infinite` } : {}),
})

/* ─────────── LA LUNE / LA BRAISE — le foyer unique ───────────
 * Étalon 4a : disque 96px, `radial-gradient(circle at 38% 34%, #f7eed6, #ecd9ac
 * 60%, #dcbc84)`, lueur `0 0 48px rgba(240,224,182,.4)`, respiration 5 s à
 * scale 1,015. On garde le dessin exact, à la taille φ (89px).
 *
 * Le foyer de JOUR reste une BRAISE et non un soleil pâle (correction du
 * 26/07, trouvée au rendu) : posée sur du parchemin, elle doit être PLUS
 * DENSE que le papier, sinon aucun bord ne se détache et son halo, plus clair
 * que le fond, n'éclaire rien. Cette face n'est toujours pas dans l'étalon. */
export const moonStyle = (size: number = SCALE.moon, day = false): React.CSSProperties => ({
  width: size, height: size, borderRadius: '50%',
  background: day
    ? `radial-gradient(circle at 38% 32%, #fdf4d8 0%, ${DT.sun} 42%, #e0bf78 78%, #cfa456 100%)`
    : 'radial-gradient(circle at 38% 34%, #f7eed6 0%, #ecd9ac 60%, #dcbc84 100%)',
  boxShadow: day
    ? `0 0 ${Math.round(size * 0.45)}px ${Math.round(size * 0.12)}px ${DT.sunGlow}, 0 0 ${Math.round(size * 0.89)}px ${Math.round(size * 0.21)}px rgba(197,138,52,0.24)`
    : `0 0 ${Math.round(size * 0.5)}px rgba(240,224,182,0.40)`,
  animation: `dream-breathe ${MOTION.breathe}ms ease-in-out infinite`,
})

/** Le halo du foyer — un calque SÉPARÉ, derrière la lune, qui respire en
 *  contretemps (opacité, pas échelle du disque). C'est lui qui fait « vivante ». */
export const haloStyle = (size: number = SCALE.moonHalo, day = false): React.CSSProperties => ({
  position: 'absolute', top: '50%', left: '50%', width: size, height: size,
  borderRadius: '50%', pointerEvents: 'none', transform: 'translate(-50%,-50%)',
  background: day
    ? 'radial-gradient(circle, rgba(197,138,52,0.20), transparent 66%)'
    : 'radial-gradient(circle, rgba(240,222,178,0.30), transparent 66%)',
  animation: `dream-halo ${MOTION.halo}ms ease-in-out infinite`,
})

/** Keyframes globales (à injecter une fois — <style>{DREAM_KEYFRAMES}</style>). */
export const DREAM_KEYFRAMES = `
@keyframes dream-breathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.015); } }
@keyframes dream-halo {
  0%,100% { opacity: 0.46; transform: translate(-50%,-50%) scale(1); }
  50%     { opacity: 0.60; transform: translate(-50%,-50%) scale(1.055); }
}
@keyframes dream-grain-drift { 0% { background-position: 0 0; } 100% { background-position: 130px 170px; } }
@keyframes dream-fade-in { from { opacity: 0; transform: translateY(${MOTION.rise}px); } to { opacity: 1; transform: none; } }
@keyframes dream-caret { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.15s !important; }
  [data-dream-grain] { animation: none !important; }
}`

import type React from 'react'
