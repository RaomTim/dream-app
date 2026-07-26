'use client'

/**
 * HaloRespire — V1.2
 *
 * Halo respirant en arrière-plan. Anime opacity 0.4 → 0.7 sur 6s (souffle).
 *
 * 4 kinds :
 *   - silk      : or pâle, sacralité quotidienne (Big Dream, écho prophétique, Aha)
 *   - ember     : orange braise (gate somatique)
 *   - earth     : terre, ancrage corps
 *   - bigdream  : silk + ember combinés, pleine puissance — ne jamais surutiliser
 */

import React, { type CSSProperties } from 'react'

export type HaloKind = 'silk' | 'ember' | 'earth' | 'bigdream'

export interface HaloRespireProps {
  kind?: HaloKind
  style?: CSSProperties
  className?: string
}

export default function HaloRespire({ kind = 'silk', style, className = '' }: HaloRespireProps) {
  const cls =
    kind === 'bigdream' ? 'halo-bigdream-combine' :
    kind === 'ember'    ? 'halo-ember-respire'    :
    /* silk + earth utilisent la même base silk pour le V1.2 ; earth = aliasé */
                          'halo-silk-respire'

  return <div className={`${cls} ${className}`.trim()} style={style} aria-hidden="true" />
}
