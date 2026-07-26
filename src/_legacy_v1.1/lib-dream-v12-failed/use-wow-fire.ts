'use client'

/**
 * useWowFire — V1.2
 *
 * Hook React : abonne un composant à un Wow event spécifique.
 * Le callback est appelé chaque fois que `wowRegistry.fire(name)` ou
 * `wowRegistry.demo(name)` est invoqué.
 *
 * Usage :
 *   useWowFire('premier-kairos', (detail) => {
 *     setShowSpiraleOverlay(true)
 *   })
 */

import { useEffect } from 'react'
import type { WowName, WowFireDetail } from './wow-registry'

export function useWowFire(name: WowName, callback?: (detail: WowFireDetail) => void): void {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const handler = (e: Event) => {
      const ce = e as CustomEvent<WowFireDetail>
      if (ce.detail?.name === name) callback?.(ce.detail)
    }
    window.addEventListener('wow:fire', handler)
    return () => window.removeEventListener('wow:fire', handler)
  }, [name, callback])
}
