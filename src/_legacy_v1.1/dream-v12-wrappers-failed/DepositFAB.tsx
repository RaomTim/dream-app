'use client'

/**
 * DepositFAB — V1.2
 *
 * Bouton flottant 56px en bas-gauche pour déposer un kairos depuis n'importe quel écran.
 * Halo silk respirant en arrière-plan, glyphe coupe centrée.
 *
 * Le FeedbackButton existant est en bas-droite — DepositFAB est à 18px du bord gauche.
 *
 * Comportement :
 *   - Sur mobile/desktop : tap → callback `onDeposit` (route vers /capture ou ouvre modal)
 *   - Si `hidden` true : ne s'affiche pas (utile sur l'écran capture lui-même)
 */

import React from 'react'
import HaloRespire from './HaloRespire'

export interface DepositFABProps {
  onDeposit: () => void
  hidden?: boolean
}

export default function DepositFAB({ onDeposit, hidden = false }: DepositFABProps) {
  if (hidden) return null

  return (
    <button
      type="button"
      onClick={onDeposit}
      aria-label="déposer un kairos"
      style={{
        position: 'fixed',
        bottom: 18,
        left: 18,
        zIndex: 145,
        width: 56,
        height: 56,
        borderRadius: '50%',
        border: '1px solid var(--border-strong, #3a3840)',
        background: 'color-mix(in oklch, var(--bg-elev, #111117) 90%, transparent)',
        backdropFilter: 'blur(8px)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        padding: 0,
        transition: 'transform 380ms cubic-bezier(0.32,0.04,0.25,1), border-color 380ms ease',
        overflow: 'visible',
      }}
    >
      <span style={{
        position: 'absolute',
        inset: -8,
        pointerEvents: 'none',
        borderRadius: '50%',
        overflow: 'hidden',
      }}>
        <HaloRespire kind="silk" style={{ inset: 0, position: 'absolute' }} />
      </span>

      <svg
        width={22}
        height={22}
        viewBox="0 0 28 28"
        style={{ position: 'relative', zIndex: 1 }}
        aria-hidden="true"
        focusable={false}
      >
        <path
          d="M4 10 Q14 22 24 10"
          fill="none"
          stroke="var(--accent, #b8975a)"
          strokeWidth={1}
          strokeLinecap="round"
        />
        <line
          x1={14} y1={2} x2={14} y2={10}
          stroke="var(--accent, #b8975a)"
          strokeWidth={1}
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
