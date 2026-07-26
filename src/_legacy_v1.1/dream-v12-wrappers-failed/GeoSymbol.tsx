'use client'

/**
 * GeoSymbol — V1.2
 *
 * Symbole géométrique sacré, statique ou animé.
 *
 * 6 kinds :
 *   - spirale       : log spirale 3.5 tours (BigDream marquage)
 *   - concentric    : cercles concentriques (Portrait centre, Aha capture)
 *                     aliases : "cercle-concentrique", "cercles-concentriques"
 *   - triangle      : triangle équilatéral (rituel — Réentrée, gates)
 *   - demi-cercle   : demi-cercle aurore (Anima Mundi, Polyphonies)
 *                     alias : "demi-cercle-aurore"
 *   - songlines     : lignes ondulantes parallèles (backgrounds nuit)
 *   - croissant     : croissant lunaire (Polyphonies)
 */

import React, { type CSSProperties } from 'react'

export type GeoKind =
  | 'spirale'
  | 'concentric' | 'cercle-concentrique' | 'cercles-concentriques'
  | 'triangle'
  | 'demi-cercle' | 'demi-cercle-aurore'
  | 'songlines'
  | 'croissant'

export type GeoColor = 'silk' | 'ember' | 'bone'

export interface GeoSymbolProps {
  kind: GeoKind
  color?: GeoColor
  opacity?: number
  style?: CSSProperties
  className?: string
}

export function computeLogSpiral(opts: { cx: number; cy: number; a: number; b: number; turns: number; steps: number }): string {
  const { cx, cy, a, b, turns, steps } = opts
  const tMax = turns * 2 * Math.PI
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax
    const r = a * Math.exp(b * t)
    const x = cx + r * Math.cos(t)
    const y = cy + r * Math.sin(t)
    d += (i === 0 ? 'M ' : 'L ') + x.toFixed(2) + ' ' + y.toFixed(2) + ' '
  }
  return d
}

export default function GeoSymbol({ kind, color = 'silk', opacity, style, className = '' }: GeoSymbolProps) {
  // Aliases tolérés
  let resolvedKind: GeoKind = kind
  if (kind === 'cercle-concentrique' || kind === 'cercles-concentriques') resolvedKind = 'concentric'
  if (kind === 'demi-cercle-aurore') resolvedKind = 'demi-cercle'

  const colorClass = color === 'ember' ? 'geo-symbol--ember' : color === 'bone' ? 'geo-symbol--bone' : ''
  const wrapStyle: CSSProperties = { ...(style || {}), ...(opacity != null ? { opacity } : {}) }

  if (resolvedKind === 'spirale') {
    const path = computeLogSpiral({ cx: 100, cy: 100, a: 2, b: 0.18, turns: 3.5, steps: 200 })
    return (
      <div className={`geo-symbol ${colorClass} ${className}`.trim()} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200"><path d={path} /></svg>
      </div>
    )
  }

  if (resolvedKind === 'concentric') {
    return (
      <div className={`geo-symbol ${colorClass} concentric-rings ${className}`.trim()} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="40" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="80" />
        </svg>
      </div>
    )
  }

  if (resolvedKind === 'triangle') {
    return (
      <div className={`geo-symbol ${colorClass} triangle-rituel ${className}`.trim()} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <polygon points="100,20 180,170 20,170" />
          <polygon points="100,50 153,158 47,158" opacity="0.5" />
        </svg>
      </div>
    )
  }

  if (resolvedKind === 'demi-cercle') {
    return (
      <div className={`demi-cercle-aurore ${className}`.trim()} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d="M 0 180 Q 500 -40, 1000 180" />
          <path d="M 50 180 Q 500 0, 950 180" opacity="0.5" />
        </svg>
      </div>
    )
  }

  if (resolvedKind === 'songlines') {
    return (
      <div className={`songlines-bg ${colorClass} ${className}`.trim()} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <path key={i} d={`M 0 ${100 + i * 80} Q 250 ${60 + i * 80}, 500 ${100 + i * 80} T 1000 ${100 + i * 80}`} />
          ))}
        </svg>
      </div>
    )
  }

  if (resolvedKind === 'croissant') {
    return (
      <div className={`croissant-lune ${colorClass} ${className}`.trim()} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <path d="M 100 20 A 80 80 0 1 0 100 180 A 60 60 0 1 1 100 20 Z" />
        </svg>
      </div>
    )
  }

  return null
}
