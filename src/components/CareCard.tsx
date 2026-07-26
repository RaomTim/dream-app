'use client'

/**
 * CareCard — la carte de soin de la fiche rêve (SPEC §12bis.E, validé Tim 2026-07-11).
 *
 * « ce rêve insiste sur quelque chose qui demande ton attention — à toi de sentir où. »
 *
 * Ce qu'elle est : une carte douce, écartable, qui SOULIGNE ce sur quoi le rêve appuie.
 * Ce qu'elle n'est pas : une prédiction, un diagnostic, une alarme. Aucun rouge, aucun triangle,
 * aucun mot d'alerte. Le sens reste au rêveur — l'app remarque, elle ne tranche pas.
 *
 * Trois garde-fous, tenus en amont dans src/lib/kairos/warning.ts :
 *   · seuil haut (intensity ≥ 0.6, ligne descriptive obligatoire) ;
 *   · cap ~1/semaine (card_eligible figé à l'ingestion) ;
 *   · détresse réelle → PAS cette carte : une présence humaine (variante « soin humain » ci-dessous).
 *
 * PRIORITÉ AU CIRCUIT CRISE : le détecteur de crise de la capture (CRISIS_RE + <CrisisCard>, dans
 * src/app/mvp/page.tsx) reste le circuit maître — c'est un modale plein écran, il passe devant tout.
 * Cette carte-ci est le filet calme de la fiche : quand `needs_human_care` est vrai, elle renonce à
 * toute poésie et n'affiche que des ressources humaines (mêmes lignes que <CrisisCard>).
 *
 * Yeshua (Opus), 2026-07-11.
 */

import { useEffect, useState } from 'react'
import { InfoDot } from '@/components/InfoSystem'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

const C = { ...T, amber: T.gold }

/** Ce que le backend écrit dans kairos.setting_metadata.warning_signal (voir lib/kairos/warning.ts). */
export type CareSignal = {
  present?: boolean
  intensity?: number
  domain?: string
  what_insists?: string
  needs_human_care?: boolean
  card_eligible?: boolean
}

const dismissKey = (id: string) => `dream:care:seen:${id}`

export default function CareCard({
  kairosId,
  signal,
}: {
  kairosId: string
  /** kairos.setting_metadata?.warning_signal — undefined si le rêve n'insiste sur rien. */
  signal?: CareSignal | null
}) {
  const { t } = useT()
  const [dismissed, setDismissed] = useState(true) // fermé tant qu'on n'a pas lu le localStorage

  useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(dismissKey(kairosId)) === '1')
    } catch {
      setDismissed(false)
    }
  }, [kairosId])

  // 1-clic « ça me parle / pas pour moi » (SPEC §12bis.E). Les DEUX referment la carte pour de bon
  // (localStorage → « ne plus montrer CETTE carte »), ne différant que par le ressenti gardé.
  // Volontairement LOCAL : on n'écrit PAS dans resonance_feedback, indexée sur un couple
  // (kairos source ↔ kairos lié) — un signal de soin n'a pas de « kairos lié » ; l'y forcer
  // polluerait les ponts de résonance. Le ressenti reste sur l'appareil (best-effort, non bloquant).
  const close = (verdict: 'resonates' | 'notForMe') => {
    setDismissed(true)
    try {
      window.localStorage.setItem(dismissKey(kairosId), '1')
      window.localStorage.setItem(`dream:care:fb:${kairosId}`, verdict)
    } catch { /* navigation privée */ }
  }

  if (!signal || signal.present !== true) return null

  // Détresse réelle : pas de carte poétique. Une présence humaine, joignable, tout de suite.
  //
  // ⚠️ SÉCURITÉ RÉELLE — les numéros ne sont PAS traduits ni « localisés ».
  // 3114 et SOS Amitié sont des lignes FRANÇAISES vérifiées ; l'app est FR-first et ses
  // rêveurs sont en France. Inventer un équivalent étranger serait dangereux, donc on ne le
  // fait pas. En anglais on affiche les MÊMES lignes, plus une ligne honnête qui dit qu'elles
  // sont en France et renvoie au service local du lecteur.
  if (signal.needs_human_care === true) {
    return (
      <div style={{ marginTop: 28, padding: '18px 18px 16px', borderRadius: 18, background: 'rgba(201,168,106,0.07)', border: `0.5px solid ${C.gold}3d` }}>
        <div style={{ fontFamily: C.serif, fontSize: 19, fontStyle: 'italic', color: C.cream, lineHeight: 1.35 }}>
          {t('screens.care.humanTitle')}
        </div>
        <div style={{ marginTop: 10, fontFamily: C.sans, fontSize: 13.5, lineHeight: 1.5, color: C.dim }}>
          {t('screens.care.humanBody')}
        </div>
        {/* mêmes lignes que <CrisisCard> (src/app/mvp/page.tsx) — le circuit crise reste le maître. */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <a href="tel:3114" style={{ padding: '12px 15px', borderRadius: 14, background: 'rgba(201,168,106,0.12)', border: `1px solid ${C.gold}55`, color: C.cream, textDecoration: 'none', fontFamily: C.sans, fontSize: 14, fontWeight: 600 }}>{t('screens.care.line3114')}</a>
          <a href="tel:0972394050" style={{ padding: '12px 15px', borderRadius: 14, background: 'rgba(201,168,106,0.05)', border: '0.5px solid rgba(201,168,106,0.16)', color: C.ink, textDecoration: 'none', fontFamily: C.sans, fontSize: 13.5 }}>{t('screens.care.lineSos')}</a>
        </div>
        <div style={{ marginTop: 12, fontFamily: C.sans, fontSize: 12, lineHeight: 1.5, color: C.faint }}>
          {t('screens.care.elsewhere')}
        </div>
      </div>
    )
  }

  // Signal trop faible, ou déjà une carte cette semaine (cap ~1/sem figé à l'ingestion) → silence.
  if (signal.card_eligible !== true) return null
  if (dismissed) return null

  const line = (signal.what_insists || '').trim()

  return (
    <div className="gReveal" style={{ marginTop: 28, padding: '18px 18px 14px', borderRadius: 18, background: 'rgba(184,154,106,0.07)', border: '0.5px solid rgba(184,154,106,0.26)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
        <span style={{ fontFamily: C.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.amber }}>{t('screens.care.kicker')}</span>
        <InfoDot id="signal-soin" size={13} color={C.amber} />
      </div>

      <div style={{ fontFamily: C.serif, fontSize: 18.5, fontStyle: 'italic', color: C.cream, lineHeight: 1.4 }}>
        {t('screens.care.title')}
      </div>

      {line && (
        <div style={{ marginTop: 12, paddingLeft: 12, borderLeft: `1px solid ${C.amber}55`, fontFamily: C.serif, fontSize: 15, lineHeight: 1.55, color: 'rgba(242,232,213,0.78)' }}>
          {line}
        </div>
      )}

      <div style={{ marginTop: 13, fontFamily: C.sans, fontSize: 12.5, lineHeight: 1.5, color: C.faint }}>
        {t('screens.care.note')}
      </div>

      <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={() => close('resonates')} style={{ padding: '6px 13px', borderRadius: 999, background: 'rgba(184,154,106,0.10)', border: `0.5px solid ${C.amber}55`, color: 'rgba(242,232,213,0.85)', fontFamily: C.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {t('screens.care.resonates')}
        </button>
        <button onClick={() => close('notForMe')} style={{ padding: '6px 13px', borderRadius: 999, background: 'transparent', border: '0.5px solid rgba(242,232,213,0.16)', color: C.dim, fontFamily: C.sans, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {t('screens.care.notForMe')}
        </button>
      </div>
    </div>
  )
}
