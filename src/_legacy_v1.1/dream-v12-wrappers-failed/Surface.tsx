'use client'

/**
 * Surface — V1.2
 *
 * Bed visuel : couleur de fond (`bed-{matter}`) + texture SVG via filtre `noise-{matter}`.
 * 9 matters disponibles : linen, paper, stone, ash, water, ember, silk, earth, bone.
 *
 * Usage typique :
 *   <Surface matter="linen" motion style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
 *
 * Pour un wrapper plein écran d'un screen :
 *   <div className="relative">
 *     <Surface matter="silk" />
 *     <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
 *   </div>
 */

import React, { type ElementType, type ReactNode, type CSSProperties } from 'react'

export type Matter = 'linen' | 'paper' | 'stone' | 'ash' | 'water' | 'ember' | 'silk' | 'earth' | 'bone'
export type SurfaceMotion = boolean | 'flicker' | 'drift'

export interface SurfaceProps {
  matter?: Matter
  motion?: SurfaceMotion
  /** boost = false désactive l'overlay boost (sinon auto pour paper/silk/water/ember/earth) */
  boost?: boolean
  className?: string
  style?: CSSProperties
  as?: ElementType
  children?: ReactNode
}

export default function Surface({
  matter = 'linen',
  motion = true,
  boost,
  className = '',
  style,
  as: Tag = 'div',
  children,
}: SurfaceProps) {
  const motionBed = motion ? `motion-${matter === 'silk' ? 'silk-halo' : matter}` : ''
  const motionNoise =
    motion === 'flicker' ? 'motion-ember-flicker' :
    motion === 'drift' ? 'motion-silk-drift' : ''

  const autoBoost = matter === 'paper' || matter === 'silk' || matter === 'water' || matter === 'ember' || matter === 'earth'
  const boostClass = boost === false ? '' : autoBoost ? `boost-${matter === 'silk' ? 'silk' : matter}` : ''

  const Component = Tag as ElementType

  return (
    <Component className={`surface ${className}`.trim()} style={style}>
      <div className={`bed bed-${matter} ${motionBed}`.trim()} />
      <div
        className={`bed-noise ${boostClass} ${motionNoise}`.trim()}
        style={{ filter: `url(#noise-${matter})` }}
      />
      {children}
    </Component>
  )
}
