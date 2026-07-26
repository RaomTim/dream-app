/**
 * warning_signal — l'axe « ce sur quoi le rêve INSISTE » (SPEC §12bis.E, validé Tim 2026-07-11).
 *
 * Le rêve porte parfois un avertissement naturel (conflit, casse, épuisement, perte). L'app le
 * SOULIGNE sans devenir une machine à paranoïa. Trois garde-fous, tenus ICI (pas seulement dans
 * le prompt) :
 *
 *   1. SEUIL HAUT — mieux vaut manquer un signal qu'en inventer un. `present` seul ne suffit pas :
 *      il faut une intensité ≥ CARD_MIN_INTENSITY et une ligne descriptive non vide.
 *   2. CAP ~1/SEMAINE — un kairos ne devient « carte de soin » que si AUCUN autre kairos de ce
 *      rêveur n'a été rendu éligible dans les 7 jours précédents. L'éligibilité est figée à
 *      l'ingestion (comme le score de numinosité), donc la fiche est stable à la relecture.
 *   3. DÉTRESSE RÉELLE ≠ CARTE POÉTIQUE — si `needs_human_care`, la carte de soin s'efface :
 *      c'est le circuit crise (CrisisCard, page.tsx) qui prime, avec des ressources humaines.
 *
 * PERSISTANCE — aucune migration. Le signal est écrit dans `kairos.setting_metadata` (jsonb déjà
 * existant, déjà renvoyé par GET /api/kairos/[id]) sous la clé `warning_signal`. Le cap se lit par
 * filtre jsonb (`setting_metadata->warning_signal->>card_eligible`).
 *
 * Yeshua (Opus), 2026-07-11.
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import type { KairosExtraction } from './extraction'

export const WARNING_DOMAINS = ['relation', 'corps', 'materiel', 'direction', 'autre'] as const
export type WarningDomain = (typeof WARNING_DOMAINS)[number]

export interface WarningSignal {
  present: boolean
  /** 0-1 — à quel point le rêve insiste. Pas une probabilité d'événement. */
  intensity: number
  domain: WarningDomain
  /** UNE ligne descriptive de ce qui insiste DANS LE RÊVE. Jamais prédictive. */
  what_insists: string
  /** détresse réelle (idées noires, violence subie, santé grave) → circuit crise, pas carte. */
  needs_human_care: boolean
}

/** Ce qui est réellement stocké : le signal + le verdict du cap, figé à l'ingestion. */
export interface StoredWarningSignal extends WarningSignal {
  card_eligible: boolean
  stamped_at: string
}

/** Seuil HAUT — en dessous, le signal existe pour le backend mais ne devient jamais une carte. */
export const CARD_MIN_INTENSITY = 0.6
/** Cap ~1/semaine. */
export const CARD_COOLDOWN_DAYS = 7

/**
 * Nettoie ce que le modèle a renvoyé. Aucune confiance aveugle : on borne, on whitelist, on coupe.
 * Retourne null si le signal est absent ou vide de sens.
 */
export function normalizeWarningSignal(extraction: KairosExtraction): WarningSignal | null {
  const raw: any = (extraction as any)?.warning_signal
  if (!raw || typeof raw !== 'object') return null
  if (raw.present !== true) return null

  const intensityRaw = typeof raw.intensity === 'number' ? raw.intensity : 0
  const intensity = Math.max(0, Math.min(1, intensityRaw))

  const domain: WarningDomain = WARNING_DOMAINS.includes(raw.domain) ? raw.domain : 'autre'

  const what_insists =
    typeof raw.what_insists === 'string'
      ? raw.what_insists.replace(/\s+/g, ' ').trim().slice(0, 180)
      : ''

  const needs_human_care = raw.needs_human_care === true

  if (!what_insists && !needs_human_care) return null

  return { present: true, intensity, domain, what_insists, needs_human_care }
}

/** Le signal est-il assez net pour mériter une carte de soin ? (seuil haut, détresse exclue) */
export function isCareCardCandidate(w: WarningSignal | null): boolean {
  if (!w || !w.present) return false
  if (w.needs_human_care) return false // ressources humaines, pas une carte poétique
  if (!w.what_insists) return false
  return w.intensity >= CARD_MIN_INTENSITY
}

/**
 * Le cap ~1/semaine, tenu pour de vrai : on ne rend éligible que si aucun autre kairos de ce
 * rêveur n'a été rendu éligible dans les 7 jours qui précèdent. Zéro migration — on compte via
 * le filtre jsonb sur setting_metadata.
 *
 * Best-effort : si la requête échoue, on N'AFFICHE PAS de carte (le silence est le défaut sûr).
 */
export async function resolveCareCardEligibility(opts: {
  supabaseService: SupabaseClient
  userId: string
  kairosId: string
  warning: WarningSignal | null
}): Promise<StoredWarningSignal | null> {
  const { supabaseService, userId, kairosId, warning } = opts
  if (!warning) return null

  const base: StoredWarningSignal = {
    ...warning,
    card_eligible: false,
    stamped_at: new Date().toISOString(),
  }

  if (!isCareCardCandidate(warning)) return base

  const since = new Date(Date.now() - CARD_COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
  try {
    const { count, error } = await supabaseService
      .from('kairos')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('id', kairosId)
      .gte('created_at', since)
      .eq('setting_metadata->warning_signal->>card_eligible', 'true')

    if (error) return base // défaut sûr : pas de carte
    return { ...base, card_eligible: (count || 0) === 0 }
  } catch {
    return base
  }
}
