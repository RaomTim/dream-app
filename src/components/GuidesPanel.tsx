'use client'

/**
 * GuidesSheet (C2) + GuidesLibrary (C4) — SPEC-ECRANS §3.
 * Chantier D · 2026-07-11 · Yeshua (Opus).
 *
 * C2 : mini-sheet « Pour ce rêve, je te propose : » → 1 à 3 cartes adaptées
 *      (proposeGuides) + lien discret « Tous les guides » → C4.
 * C4 : liste des 10 cartes (nom · phrase · durée · « Déjà fait N fois » privé).
 *      Les guides du soir sont lançables sans dépôt.
 */

import { useEffect, useState } from 'react'
import { GUIDES, Guide, proposeGuides, getGuideCount } from '@/lib/guides'
import { GT, GuideBackHeader } from '@/components/guide-ui'
import { useT } from '@/lib/i18n'

function GuideCard({ guide, onPick, showCount }: { guide: Guide; onPick: (g: Guide) => void; showCount?: boolean }) {
  const { tp } = useT()
  const [count, setCount] = useState(0)
  useEffect(() => { setCount(getGuideCount(guide.id)) }, [guide.id])
  return (
    <button
      onClick={() => onPick(guide)}
      style={{ width: '100%', padding: '16px 18px', borderRadius: 20, background: GT.card, border: GT.cardBorder, cursor: 'pointer', textAlign: 'left' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: GT.sans, fontSize: 16.5, fontWeight: 600, color: GT.cream }}>{guide.name}</span>
        <span style={{ fontSize: 11, color: GT.faint, whiteSpace: 'nowrap' }}>{guide.duration}</span>
      </div>
      <div style={{ marginTop: 5, fontSize: 13.5, color: GT.dim, fontFamily: GT.sans, lineHeight: 1.4 }}>{guide.phrase}</div>
      {showCount && count > 0 && (
        <div style={{ marginTop: 8, fontSize: 11.5, color: GT.faint, fontFamily: GT.sans }}>{tp('screens.guide.count', count)}</div>
      )}
    </button>
  )
}

/** C2 — proposition contextuelle (overlay bas). */
export function GuidesSheet({
  open,
  type,
  text,
  radiant,
  onPick,
  onAll,
  onClose,
}: {
  open: boolean
  type?: string
  text?: string
  radiant?: boolean
  onPick: (g: Guide) => void
  onAll: () => void
  onClose: () => void
}) {
  const { t } = useT() // hook AVANT toute sortie anticipée (règle des hooks)
  if (!open) return null
  const proposed = proposeGuides({ type, text, radiant })
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(20,14,10,0.62)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'lFadeUp .25s ease' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 560, background: 'linear-gradient(180deg, #241a12, #1a1310)', borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTop: '0.5px solid rgba(201,168,106,0.18)', padding: '22px 18px calc(30px + env(safe-area-inset-bottom))', animation: 'lFadeUp .3s ease' }}
      >
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(242,232,213,0.16)', margin: '0 auto 18px' }} />
        <div style={{ fontFamily: GT.serif, fontSize: 20, fontStyle: 'italic', color: GT.cream, marginBottom: 16, paddingLeft: 4 }}>{t('screens.guide.sheetTitle')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {proposed.map((g) => <GuideCard key={g.id} guide={g} onPick={onPick} />)}
        </div>
        <button onClick={onAll} style={{ marginTop: 16, width: '100%', background: 'none', border: 'none', color: GT.dim, fontSize: 13.5, fontWeight: 500, fontFamily: GT.sans, cursor: 'pointer', padding: 8 }}>{t('screens.guide.allGuides')}</button>
      </div>
    </div>
  )
}

/** C4 — bibliothèque des 10 guides (écran plein). */
export function GuidesLibrary({
  onPick,
  onBack,
}: {
  onPick: (g: Guide) => void
  onBack: () => void
}) {
  const { t } = useT()
  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60 }}>
      <GuideBackHeader onBack={onBack} title={t('screens.guide.libraryTitle')} />
      <div style={{ margin: '10px 24px 0', fontSize: 13.5, color: GT.dim, fontFamily: GT.sans, lineHeight: 1.5 }}>
        {t('screens.guide.libraryIntro')}
      </div>
      <div style={{ margin: '22px 18px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GUIDES.map((g) => <GuideCard key={g.id} guide={g} onPick={onPick} showCount />)}
      </div>
    </div>
  )
}
