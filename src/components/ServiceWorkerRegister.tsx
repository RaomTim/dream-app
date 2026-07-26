'use client'

/**
 * Enregistre le service worker offline-first (public/sw.js) et démarre l'auto-flush
 * de la file d'attente des dépôts. Monté une seule fois, dans le layout /mvp :
 * le SW ne s'installe donc que quand le rêveur entre dans l'app (pas sur les pages
 * marketing). Scope par défaut '/' (sw.js à la racine) — même origine que le
 * wrapper Capacitor, donc il contrôle bien /mvp et ses assets.
 *
 * Yeshua (Opus), 2026-07-22.
 */
import { useEffect } from 'react'
import { startAutoFlush } from '@/lib/offline-queue'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').catch(() => { /* silencieux : l'app marche sans SW */ })
      }
      // Après le 'load' pour ne pas concurrencer le premier rendu.
      if (document.readyState === 'complete') register()
      else window.addEventListener('load', register, { once: true })
    }
    // Rattrape tout dépôt resté en file (online event + visibilité + intervalle doux).
    const stop = startAutoFlush()
    return () => { try { stop() } catch {} }
  }, [])
  return null
}
