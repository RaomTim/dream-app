'use client'

/**
 * InfoSystem — le système ⓘ « profondeur cachée » (SPEC §0.2, deux étages).
 *
 *   <InfoDot id="kairos" />     petit ⓘ (cible 44px). Tap → bulle 1 phrase + « En savoir plus ».
 *   <InfoSheet id="kairos" />   la fiche plein écran (étage 2).
 *   <HowDreamWorks />           l'index des fiches (H1), atteint depuis Réglages seulement.
 *
 * Chaque composant est AUTONOME : InfoDot gère lui-même sa bulle et l'ouverture de la fiche.
 * On peut donc déposer <InfoDot id="…" /> n'importe où (page.tsx, ShareSheet, WallScreen…)
 * sans câbler d'état dans le parent.
 *
 * Loi SPEC : le tap sur ⓘ ouvre une bulle, JAMAIS une navigation surprise. On n'arrive
 * jamais à l'index par un menu en premier — toujours par le ⓘ en contexte.
 *
 * Yeshua (Opus), 2026-07-11.
 *
 * ── C1 · 2026-07-26 — LE MOTIF DEVIENT PARTAGEABLE, ET BILINGUE EN LUMIÈRE ──
 * Tim : « la solution comme d'hab est cette petite bulle qui permet d'avoir + d'info ».
 * « Comme d'hab » = ce fichier. Pour que la bulle des kaïros SOIT la même bulle (et
 * pas une copie qui dérivera au premier ajustement), la coquille est extraite ici :
 *   · `SKIN` / `skinOf(day)`  — les deux jeux de couleurs (nuit · jour)
 *   · `InfoGlyph` · `InfoStyle` — exportés
 *   · `BubbleFrame` / `SheetFrame` — la géométrie exacte (rayons, scrim, boutons)
 * `InfoDot` et `InfoSheet` les CONSOMMENT désormais : si la coquille bouge, tout bouge.
 *
 * 🔴 Le jour n'est pas un détail cosmétique. Poser la coquille nuit (panneau #1a1310)
 * sur la face Cœur — du parchemin — refait exactement le défaut corrigé le 26/07 sur
 * la nav (RAPPORT-B5 §3.1) : un bloc peint dans la lumière de l'autre face.
 */

import { useState } from 'react'
import { getInfoSheet, INFO_INDEX, INFO_SHEETS } from '@/lib/infoSheets'
import { useT } from '@/lib/i18n'
import { T, DT } from '@/lib/dream-design'

/* ═════════ LA PEAU — nuit & jour, mêmes rôles, deux lumières ═════════ */
export type InfoSkin = {
  panel: string; scrim: string; scrimSoft: string
  border: string; borderTop: string; grabber: string; rule: string
  kicker: string; cream: string; ink: string; dim: string; gold: string
  glyph: string; ghostBorder: string; moreBg: string; moreBorder: string
  serif: string; sans: string; display: string
  card: string; cardBorder: string
}

const NIGHT_SKIN: InfoSkin = {
  panel: T.bgFlat, scrim: 'rgba(20,14,10,0.82)', scrimSoft: 'rgba(20,14,10,0.5)',
  border: `${T.gold}3a`, borderTop: `${T.gold}33`, grabber: 'rgba(242,232,213,0.2)',
  rule: 'rgba(242,232,213,0.12)',
  kicker: T.gold, cream: T.cream, ink: T.ink, dim: T.dim, gold: T.gold,
  glyph: 'rgba(242,232,213,0.5)', ghostBorder: 'rgba(242,232,213,0.16)',
  moreBg: 'rgba(201,168,106,0.12)', moreBorder: `${T.gold}55`,
  serif: T.serif, sans: T.sans, display: T.display,
  card: T.card, cardBorder: T.cardBorder,
}

/* ⚠️ Deux valeurs de cette peau sont des DÉCISIONS, pas des équivalents :
 *  · `scrim` prend le premier stop de `T.bg` (rgba(36,26,18,…)) et non un noir neutre —
 *    c'est le sol du monde nocturne, la même matière que le liseré de seuil (§3.2 B5).
 *  · `dim` vaut `DT.inkSoft` et NON `DT.dim` : mesuré, `DT.dim` sur le parchemin donne
 *    3,79:1, sous la barre AA de 4,5:1 (§3.3 B5). Sur le jour, la hiérarchie se fait par
 *    la typo et l'échelle, jamais par le contraste. Même raison pour `kicker` : `DT.gold`
 *    sur `#f4ead1` mesure 3,79:1 — inutilisable pour un libellé de 11 px. */
const DAY_SKIN: InfoSkin = {
  panel: DT.paperFlat, scrim: 'rgba(36,26,18,0.55)', scrimSoft: 'rgba(36,26,18,0.34)',
  border: 'rgba(143,113,52,0.34)', borderTop: 'rgba(143,113,52,0.24)', grabber: 'rgba(43,33,21,0.20)',
  rule: 'rgba(43,33,21,0.14)',
  kicker: DT.inkSoft, cream: DT.ink, ink: DT.inkSoft, dim: DT.inkSoft, gold: DT.gold,
  glyph: 'rgba(43,33,21,0.55)', ghostBorder: 'rgba(143,113,52,0.30)',
  moreBg: 'rgba(143,113,52,0.13)', moreBorder: 'rgba(143,113,52,0.55)',
  serif: T.serif, sans: T.sans, display: T.display,
  card: DT.card, cardBorder: DT.cardBorder,
}

export const skinOf = (day?: boolean): InfoSkin => (day ? DAY_SKIN : NIGHT_SKIN)

const C = { ...T, panel: T.bgFlat, scrim: 'rgba(20,14,10,0.82)' }

/** glyphe ⓘ — cercle + i, tracé fin, zéro emoji */
export function InfoGlyph({ c, s = 16 }: { c: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.4" />
      <circle cx="12" cy="8" r="1.05" fill={c} />
      <path d="M12 11.2v5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function InfoStyle() {
  return (
    <style>{`
      @keyframes infoFade { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }
      @keyframes infoScrim { from { opacity:0;} to { opacity:1;} }
      @media (prefers-reduced-motion: reduce) { .infoAnim { animation: none !important; } }
    `}</style>
  )
}

/* ═════════ LA COQUILLE — étage 1 : la bulle centrée ═════════
 * Géométrie figée (elle était en dur dans InfoDot) : 380 max, rayon 22, padding 20/22,
 * deux boutons en bas — le refus à gauche (flex 1), l'approfondissement à droite (1.5).
 * `lead` est l'élément à gauche du contenu (le ⓘ doré) ; `children` est le corps.       */
export function BubbleFrame({
  skin, onClose, onMore, moreLabel, closeLabel, lead, children,
}: {
  skin: InfoSkin
  onClose: () => void
  onMore?: () => void
  moreLabel?: string
  closeLabel: string
  lead?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onClose() }}
      style={{ position: 'fixed', inset: 0, zIndex: 230, background: skin.scrimSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 26, animation: 'infoScrim .18s ease' }}
      className="infoAnim"
    >
      <InfoStyle />
      <div
        onClick={e => e.stopPropagation()}
        className="infoAnim"
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', maxWidth: 380, maxHeight: '80dvh', overflowY: 'auto', background: skin.panel, border: `0.5px solid ${skin.border}`, borderRadius: 22, padding: '20px 22px', animation: 'infoFade .25s ease', boxShadow: '0 18px 60px rgba(0,0,0,0.5)' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
          {lead && <span style={{ marginTop: 2, flexShrink: 0 }}>{lead}</span>}
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', gap: 9 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, minHeight: 44, padding: 11, borderRadius: 999, background: 'transparent', border: `1px solid ${skin.ghostBorder}`, color: skin.dim, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: skin.sans }}
          >
            {closeLabel}
          </button>
          {onMore && (
            <button
              onClick={onMore}
              style={{ flex: 1.5, minHeight: 44, padding: 11, borderRadius: 999, background: skin.moreBg, border: `1px solid ${skin.moreBorder}`, color: skin.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: skin.sans }}
            >
              {moreLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═════════ LA COQUILLE — étage 2 : la feuille montante ═════════ */
export function SheetFrame({
  skin, onClose, closeLabel, children,
}: {
  skin: InfoSkin
  onClose: () => void
  closeLabel: string
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 240, background: skin.scrim, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'infoScrim .2s ease' }}
      className="infoAnim"
    >
      <InfoStyle />
      <div
        onClick={e => e.stopPropagation()}
        className="infoAnim"
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', maxWidth: 560, maxHeight: '88dvh', overflowY: 'auto', background: skin.panel, borderTop: `0.5px solid ${skin.borderTop}`, borderRadius: '26px 26px 0 0', padding: '18px 24px max(30px, env(safe-area-inset-bottom))', animation: 'infoFade .3s ease' }}
      >
        <div style={{ width: 38, height: 4, borderRadius: 2, background: skin.grabber, margin: '0 auto 20px' }} />
        {children}
        <button
          onClick={onClose}
          style={{ marginTop: 24, width: '100%', minHeight: 44, padding: 14, borderRadius: 999, background: 'transparent', border: `1px solid ${skin.ghostBorder}`, color: skin.dim, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: skin.sans }}
        >
          {closeLabel}
        </button>
      </div>
    </div>
  )
}

/* ═════════ Étage 2 — la fiche plein écran ═════════ */
export function InfoSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useT()
  const skin = skinOf(false)
  const sheet = getInfoSheet(id)
  if (!sheet) return null
  return (
    <SheetFrame skin={skin} onClose={onClose} closeLabel={t('screens.common.close')}>
      <div style={{ fontFamily: skin.display, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: skin.kicker, textAlign: 'center' }}>{sheet.term}</div>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 13 }}>
        {sheet.body.map((p, i) => (
          <p key={i} style={{ margin: 0, fontFamily: skin.serif, fontSize: 17.5, lineHeight: 1.5, color: skin.ink }}>{p}</p>
        ))}
      </div>
      {sheet.source && (
        <div style={{ marginTop: 22, paddingTop: 16, borderTop: `0.5px solid ${skin.rule}` }}>
          <p style={{ margin: 0, fontFamily: skin.sans, fontSize: 13, lineHeight: 1.55, color: skin.dim, fontStyle: 'italic' }}>{sheet.source}</p>
        </div>
      )}
    </SheetFrame>
  )
}

/* ═════════ Étage 1 — le petit ⓘ + sa bulle ═════════ */
export function InfoDot({ id, size = 16, color, style }: { id: string; size?: number; color?: string; style?: React.CSSProperties }) {
  const { t } = useT()
  const [mode, setMode] = useState<'closed' | 'bubble' | 'sheet'>('closed')
  const sheet = getInfoSheet(id)
  if (!sheet) return null

  return (
    <>
      <button
        type="button"
        aria-label={t('screens.info.about', { term: sheet.term })}
        onClick={e => { e.stopPropagation(); e.preventDefault(); setMode('bubble') }}
        style={{
          // cible tactile 44px, glyphe centré ~16px — SPEC §0.2 / A2
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 44, height: 44, margin: -14, padding: 0,
          background: 'none', border: 'none', cursor: 'pointer', verticalAlign: 'middle',
          WebkitTapHighlightColor: 'transparent', flexShrink: 0, ...style,
        }}
      >
        <InfoGlyph c={color || 'rgba(242,232,213,0.5)'} s={size} />
      </button>

      {mode === 'bubble' && (
        <BubbleFrame
          skin={skinOf(false)}
          onClose={() => setMode('closed')}
          onMore={() => setMode('sheet')}
          moreLabel={t('screens.info.more')}
          closeLabel={t('screens.info.thanks')}
          lead={<InfoGlyph c={C.gold} s={17} />}
        >
          <p style={{ margin: 0, fontFamily: C.serif, fontSize: 18, lineHeight: 1.45, color: C.cream }}>{sheet.bubble}</p>
        </BubbleFrame>
      )}

      {mode === 'sheet' && <InfoSheet id={id} onClose={() => setMode('closed')} />}
    </>
  )
}

/* ═════════ H1 — l'index des fiches (« Comment marche Dream ») ═════════ */
export function HowDreamWorks({ onClose }: { onClose: () => void }) {
  const { t } = useT()
  const [openId, setOpenId] = useState<string | null>(null)
  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60 }}>
      <InfoStyle />
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onClose} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="rgba(242,232,213,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontFamily: C.serif, fontSize: 19, fontStyle: 'italic', color: C.cream }}>{t('screens.info.howTitle')}</div>
      </div>

      <div style={{ margin: '10px 20px 0', fontFamily: C.sans, fontSize: 13, color: C.dim, lineHeight: 1.5 }}>
        {t('screens.info.howIntro')}
      </div>

      <div style={{ margin: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 26 }}>
        {INFO_INDEX.map(group => (
          <div key={group.title}>
            <div style={{ fontFamily: C.display, fontSize: 10.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>{group.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {group.ids.map(fid => {
                const s = INFO_SHEETS[fid]
                if (!s) return null
                return (
                  <button
                    key={fid}
                    onClick={() => setOpenId(fid)}
                    style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 16, background: C.card, border: C.cardBorder, cursor: 'pointer', fontFamily: C.sans, width: '100%' }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.cream }}>{s.term}</div>
                    <div style={{ marginTop: 3, fontSize: 12.5, color: C.dim, lineHeight: 1.4 }}>{s.bubble}</div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {openId && <InfoSheet id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}
