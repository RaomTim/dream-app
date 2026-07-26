'use client'

/**
 * GlobalDepositFAB — V1.2
 *
 * Wrapper du DepositFAB monté globalement dans layout.tsx.
 * Dispatch un CustomEvent("dream:open-capture") que la page racine peut écouter
 * pour router vers l'écran capture sans avoir besoin du router Next dans le layout.
 *
 * Caché si :
 *  - utilisateur non authentifié (l'event listener côté page route alors vers AuthScreen)
 *  - on est déjà sur l'écran capture (signalé via localStorage flag éphémère)
 *
 * La page racine (`src/app/page.tsx`) écoute :
 *   useEffect(() => {
 *     const h = () => setScreen('capture')
 *     window.addEventListener('dream:open-capture', h)
 *     return () => window.removeEventListener('dream:open-capture', h)
 *   }, [])
 */

import React, { useEffect, useState } from 'react'
import DepositFAB from './DepositFAB'

export default function GlobalDepositFAB() {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    // On affiche après mount client (évite mismatch SSR + bouton qui apparaît avant la page)
    const t = setTimeout(() => setHidden(false), 350)

    // Permettre à un écran (ex. capture) de masquer temporairement le FAB
    const onHide = () => setHidden(true)
    const onShow = () => setHidden(false)
    window.addEventListener('dream:fab-hide', onHide)
    window.addEventListener('dream:fab-show', onShow)

    return () => {
      clearTimeout(t)
      window.removeEventListener('dream:fab-hide', onHide)
      window.removeEventListener('dream:fab-show', onShow)
    }
  }, [])

  const onDeposit = () => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('dream:open-capture'))
  }

  return <DepositFAB onDeposit={onDeposit} hidden={hidden} />
}
