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
 */

import { useState } from 'react'
import { getInfoSheet, INFO_INDEX, INFO_SHEETS } from '@/lib/infoSheets'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

const C = { ...T, panel: T.bgFlat, scrim: 'rgba(20,14,10,0.82)' }

/** glyphe ⓘ — cercle + i, tracé fin, zéro emoji */
function InfoGlyph({ c, s = 16 }: { c: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.4" />
      <circle cx="12" cy="8" r="1.05" fill={c} />
      <path d="M12 11.2v5" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function InfoStyle() {
  return (
    <style>{`
      @keyframes infoFade { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }
      @keyframes infoScrim { from { opacity:0;} to { opacity:1;} }
      @media (prefers-reduced-motion: reduce) { .infoAnim { animation: none !important; } }
    `}</style>
  )
}

/* ═════════ Étage 2 — la fiche plein écran ═════════ */
export function InfoSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const { t } = useT()
  const sheet = getInfoSheet(id)
  if (!sheet) return null
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 240, background: C.scrim, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', animation: 'infoScrim .2s ease' }}
      className="infoAnim"
    >
      <InfoStyle />
      <div
        onClick={e => e.stopPropagation()}
        className="infoAnim"
        style={{ width: '100%', maxWidth: 560, maxHeight: '88dvh', overflowY: 'auto', background: C.panel, borderTop: `0.5px solid ${C.gold}33`, borderRadius: '26px 26px 0 0', padding: '18px 24px max(30px, env(safe-area-inset-bottom))', animation: 'infoFade .3s ease' }}
      >
        <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(242,232,213,0.2)', margin: '0 auto 20px' }} />
        <div style={{ fontFamily: C.display, fontSize: 11, letterSpacing: '0.28em', textTransform: 'uppercase', color: C.gold, textAlign: 'center' }}>{sheet.term}</div>
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 13 }}>
          {sheet.body.map((p, i) => (
            <p key={i} style={{ margin: 0, fontFamily: C.serif, fontSize: 17.5, lineHeight: 1.5, color: C.ink }}>{p}</p>
          ))}
        </div>
        {sheet.source && (
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: '0.5px solid rgba(242,232,213,0.12)' }}>
            <p style={{ margin: 0, fontFamily: C.sans, fontSize: 13, lineHeight: 1.55, color: C.dim, fontStyle: 'italic' }}>{sheet.source}</p>
          </div>
        )}
        <button
          onClick={onClose}
          style={{ marginTop: 24, width: '100%', padding: 14, borderRadius: 999, background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: C.dim, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: C.sans }}
        >
          {t('screens.common.close')}
        </button>
      </div>
    </div>
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
        <div
          onClick={e => { e.stopPropagation(); setMode('closed') }}
          style={{ position: 'fixed', inset: 0, zIndex: 230, background: 'rgba(20,14,10,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 26, animation: 'infoScrim .18s ease' }}
          className="infoAnim"
        >
          <InfoStyle />
          <div
            onClick={e => e.stopPropagation()}
            className="infoAnim"
            style={{ width: '100%', maxWidth: 380, background: C.panel, border: `0.5px solid ${C.gold}3a`, borderRadius: 22, padding: '20px 22px', animation: 'infoFade .25s ease', boxShadow: '0 18px 60px rgba(0,0,0,0.5)' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
              <span style={{ marginTop: 2, flexShrink: 0 }}><InfoGlyph c={C.gold} s={17} /></span>
              <p style={{ margin: 0, fontFamily: C.serif, fontSize: 18, lineHeight: 1.45, color: C.cream }}>{sheet.bubble}</p>
            </div>
            <div style={{ marginTop: 18, display: 'flex', gap: 9 }}>
              <button
                onClick={() => setMode('closed')}
                style={{ flex: 1, padding: 11, borderRadius: 999, background: 'transparent', border: '1px solid rgba(242,232,213,0.16)', color: C.dim, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: C.sans }}
              >
                {t('screens.info.thanks')}
              </button>
              <button
                onClick={() => setMode('sheet')}
                style={{ flex: 1.5, padding: 11, borderRadius: 999, background: 'rgba(201,168,106,0.12)', border: `1px solid ${C.gold}55`, color: C.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: C.sans }}
              >
                {t('screens.info.more')}
              </button>
            </div>
          </div>
        </div>
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
