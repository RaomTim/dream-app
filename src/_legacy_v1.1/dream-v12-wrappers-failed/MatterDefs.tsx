'use client'

/**
 * MatterDefs — V1.2
 *
 * Injecte les 9 SVG noise filters (matters) + le gradient aurore au root.
 * Référencés par <Surface matter="…" /> via filter="url(#noise-{matter})".
 *
 * Doit être monté UNE FOIS dans app/layout.tsx (au début du body).
 *
 * Source : Dream V1.html lignes 14-32 (post-patch V5).
 */

import React from 'react'

export default function MatterDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
      focusable={false}
    >
      <defs>
        <filter id="noise-linen">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={2} />
          <feColorMatrix values="0 0 0 0 0.75  0 0 0 0 0.72  0 0 0 0 0.68  0 0 0 0.06 0" />
        </filter>
        <filter id="noise-paper">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={5} />
          <feColorMatrix values="0 0 0 0 0.72  0 0 0 0 0.68  0 0 0 0 0.62  0 0 0 0.08 0" />
        </filter>
        <filter id="noise-stone">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves={2} seed={9} />
          <feColorMatrix values="0 0 0 0 0.52  0 0 0 0 0.55  0 0 0 0 0.6   0 0 0 0.10 0" />
        </filter>
        <filter id="noise-ash">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={1} />
          <feColorMatrix values="0 0 0 0 0.4   0 0 0 0 0.4   0 0 0 0 0.4   0 0 0 0.03 0" />
        </filter>
        <filter id="noise-water">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={3} seed={3} />
          <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.55  0 0 0 0 0.66  0 0 0 0.07 0" />
        </filter>
        <filter id="noise-ember">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={7} />
          <feColorMatrix values="0 0 0 0 0.7   0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0.06 0" />
        </filter>
        <filter id="noise-silk">
          <feTurbulence type="fractalNoise" baseFrequency="0.006" numOctaves={2} seed={4} />
          <feColorMatrix values="0 0 0 0 0.78  0 0 0 0 0.7   0 0 0 0 0.5   0 0 0 0.05 0" />
        </filter>
        <filter id="noise-earth">
          <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves={3} seed={6} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0 0.35  0 0 0 0.08 0" />
        </filter>
        <filter id="noise-bone">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={2} seed={11} />
          <feColorMatrix values="0 0 0 0 0.78  0 0 0 0 0.72  0 0 0 0 0.62  0 0 0 0.05 0" />
        </filter>

        <linearGradient id="aurore-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.70 0.080 80)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.70 0.080 80)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="oklch(0.70 0.080 80)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
