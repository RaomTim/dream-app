'use client'

/**
 * SpiraleWowOverlay — V1.2
 *
 * Wow1 visuel : spirale logarithmique dorée se déploie depuis le centre.
 * Affichée 1.8s puis appelle onDone après 1.9s.
 *
 * Usage typique :
 *   const [showWow, setShowWow] = useState(false)
 *   ...
 *   {showWow && <SpiraleWowOverlay show onDone={() => setShowWow(false)} />}
 */

import React, { useEffect } from 'react'
import { computeLogSpiral } from './GeoSymbol'

export interface SpiraleWowOverlayProps {
  show: boolean
  onDone?: () => void
}

export default function SpiraleWowOverlay({ show, onDone }: SpiraleWowOverlayProps) {
  useEffect(() => {
    if (!show) return
    const t = setTimeout(() => onDone?.(), 1900)
    return () => clearTimeout(t)
  }, [show, onDone])

  if (!show) return null

  const path = computeLogSpiral({ cx: 140, cy: 140, a: 2.5, b: 0.20, turns: 3.5, steps: 240 })

  return (
    <div className="spirale-wow" aria-hidden="true">
      <svg viewBox="0 0 280 280"><path d={path} /></svg>
    </div>
  )
}
