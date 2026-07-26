'use client'

/**
 * Onboarding.tsx — les 4 écrans O1-O4 + le système de rendez-vous côté UI.
 * Source de vérité : DREAM-MVP-SPEC-ECRANS-A-Z.md §8 (O1-O4, copie EXACTE) + §9.
 *
 * Ce fichier ne contient QUE de l'UI. Toute la logique (réglages, planification des
 * notifs, drapeaux persistants, déclencheurs) vit dans src/lib/appointments.ts.
 *
 * Toute la copie visible passe par screens.*.json (useT). Les corps de notification
 * (APPT_*_BODY) restent la propriété de src/lib/appointments.ts : on les passe à t(),
 * qui rend la traduction si la constante est devenue une clé, et la chaîne telle quelle
 * sinon. Aucun texte n'est dupliqué ici.
 *
 * Exports :
 *  - default Onboarding        → les 4 écrans, fondus simples (premier login sans kairos)
 *  - AppointmentChooser        → les 3 cartes matin/soir/jamais + aperçu réel + heures
 *                                (réutilisé par O3, la re-proposition, et Réglages R1)
 *  - ApptChooserSheet          → même chooser en bottom-sheet (re-proposition / 1re semaine)
 *  - ReproposeLine             → ligne douce sous l'accueil, après le 3e dépôt (re-propo #1)
 *  - FirstWeekCard             → carte « Ta première semaine » au 7e jour (re-propo #2, in-app)
 *
 * Yeshua (Opus), 2026-07-11.
 */

import { useEffect, useState } from 'react'
import {
  APPT_MORNING_BODY, APPT_EVENING_BODY,
  getSettings, saveSettings, markOnboardingDone, hasActiveAppointment,
  shouldShowRepropose, dismissRepropose,
  shouldShowFirstWeek, markFirstWeekShown, firstKairosAt,
  type AppointmentSettings,
} from '@/lib/appointments'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

/* ───────── tokens locaux — miroir « encre vivante » de mvp/page.tsx (non exportés là-bas ;
   dupliqués ici à dessein pour garder ce fichier autonome, edits page.tsx additifs). ───────── */

const Moon = ({ c = T.gold, s = 18 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>
)

const primaryBtn: React.CSSProperties = {
  width: '100%', padding: 15, borderRadius: 999, border: 'none', cursor: 'pointer',
  background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', color: '#2a160e',
  fontFamily: T.sans, fontSize: 15, fontWeight: 600,
}
const ghostBtn: React.CSSProperties = {
  width: '100%', padding: 14, borderRadius: 999, cursor: 'pointer', background: 'transparent',
  border: '1px solid rgba(242,232,213,0.18)', color: T.dim, fontSize: 14, fontWeight: 500, fontFamily: T.sans,
}

/* ═════════════════════════════════════════════════════════════════════
   Aperçu RÉEL d'une notification (mini-mockup) — l'utilisateur voit
   EXACTEMENT ce qui arrivera (Loi §9 : aperçu réel au moment du choix).
   ═════════════════════════════════════════════════════════════════════ */
function NotifPreview({ body, sub }: { body: string; sub?: boolean }) {
  const { t } = useT()
  return (
    <div style={{
      display: 'flex', gap: 11, alignItems: 'center',
      padding: '11px 13px', borderRadius: 15,
      background: sub ? 'rgba(242,232,213,0.04)' : 'rgba(20,16,10,0.55)',
      border: '0.5px solid rgba(242,232,213,0.10)',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
        background: 'radial-gradient(120% 120% at 40% 30%, #241a12, #1a1310)',
        border: `0.5px solid ${T.gold}44`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Moon c={T.goldLit} s={17} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: T.sans, fontSize: 11.5, fontWeight: 600, letterSpacing: '0.02em', color: 'rgba(242,232,213,0.75)' }}>Dream</span>
          <span style={{ fontSize: 10.5, color: T.faint }}>{t('screens.onboarding.notifNow')}</span>
        </div>
        <div style={{ marginTop: 2, fontFamily: T.sans, fontSize: 13, color: T.cream, lineHeight: 1.32 }}>{body}</div>
      </div>
    </div>
  )
}

/* Carte d'option sélectionnable (matin / soir / jamais) */
function OptionCard({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', textAlign: 'left', cursor: 'pointer',
      padding: 14, borderRadius: 20,
      background: active ? 'rgba(201,168,106,0.10)' : 'rgba(201,168,106,0.03)',
      border: active ? `1px solid ${T.gold}66` : '0.5px solid rgba(201,168,106,0.14)',
      transition: 'all .25s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <span style={{
          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
          border: active ? `5px solid ${T.gold}` : '1.5px solid rgba(242,232,213,0.3)',
          background: active ? T.goldLit : 'transparent', transition: 'all .2s ease',
        }} />
        <span style={{ fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: active ? T.cream : T.dim }}>{label}</span>
      </div>
      {children}
    </button>
  )
}

const TimeField = ({ value, onChange, atLabel }: { value: string; onChange: (v: string) => void; atLabel: string }) => (
  <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 9 }} onClick={e => e.stopPropagation()}>
    <span style={{ fontSize: 12.5, color: T.dim, fontFamily: T.sans }}>{atLabel}</span>
    <input type="time" value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '8px 14px', borderRadius: 12, background: T.card, border: T.cardBorder, color: T.gold, fontSize: 17, fontFamily: 'ui-monospace, monospace' }} />
  </div>
)

/* ═════════════════════════════════════════════════════════════════════
   AppointmentChooser — les 3 cartes. Réutilisé partout (O3, Réglages, re-propo).
   Matin et Soir sont indépendants (on peut prendre les deux). « Jamais » efface les deux.
   ═════════════════════════════════════════════════════════════════════ */
export function AppointmentChooser({ onConfirm, confirmLabel }: { onConfirm?: () => void; confirmLabel?: string }) {
  const { t } = useT()
  const init = getSettings()
  const [s, setS] = useState<AppointmentSettings>(init)
  const [busy, setBusy] = useState(false)
  const none = !s.morning && !s.evening
  const atLabel = t('screens.onboarding.chooser.at')

  const confirm = async () => {
    setBusy(true)
    await saveSettings(s) // écrit + (re)planifie les notifs natives (fallback silencieux web)
    setBusy(false)
    onConfirm?.()
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {/* LE MATIN */}
        <OptionCard active={s.morning} label={t('screens.onboarding.chooser.morning')} onClick={() => setS(v => ({ ...v, morning: !v.morning }))}>
          <NotifPreview body={t(APPT_MORNING_BODY)} />
          {s.morning && <TimeField value={s.morningTime} atLabel={atLabel} onChange={v => setS(p => ({ ...p, morningTime: v }))} />}
          {s.morning && <div style={{ marginTop: 8, fontSize: 11.5, color: T.faint, fontFamily: T.sans }}>{t('screens.onboarding.chooser.softWake')}</div>}
        </OptionCard>

        {/* LE SOIR */}
        <OptionCard active={s.evening} label={t('screens.onboarding.chooser.evening')} onClick={() => setS(v => ({ ...v, evening: !v.evening }))}>
          <NotifPreview body={t(APPT_EVENING_BODY)} />
          {s.evening && <TimeField value={s.eveningTime} atLabel={atLabel} onChange={v => setS(p => ({ ...p, eveningTime: v }))} />}
        </OptionCard>

        {/* JAMAIS — aussi respectable visuellement que les autres (§8) */}
        <OptionCard active={none} label={t('screens.onboarding.chooser.never')} onClick={() => setS(v => ({ ...v, morning: false, evening: false }))}>
          <NotifPreview sub body={t('screens.onboarding.chooser.neverBody')} />
        </OptionCard>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={confirm} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>
          {busy ? t('screens.common.working') : (confirmLabel ?? t('screens.onboarding.chooser.confirm'))}
        </button>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   Onboarding — 4 écrans, 4 taps, fondus simples (pas de carrousel — §11).
   Déclenché par la racine au premier login sans kairos.
   ═════════════════════════════════════════════════════════════════════ */
export default function Onboarding({ onFinish, onStartCapture, onImport }: {
  onFinish: () => void        // → accueil A1
  onStartCapture: () => void  // O4 « Raconte-le » → capture directe
  onImport: () => void        // O4 « notés ailleurs » → import J5
}) {
  const { t } = useT()
  const [step, setStep] = useState(1)

  // à la sortie (peu importe la voie), l'onboarding est vu → ne réapparaît plus
  const done = () => { markOnboardingDone() }

  const Dot = ({ i }: { i: number }) => (
    <span style={{ width: 6, height: 6, borderRadius: '50%', background: i === step ? T.gold : 'rgba(242,232,213,0.2)', transition: 'background .3s ease' }} />
  )

  const promises = [
    t('screens.onboarding.o2.p1'),
    t('screens.onboarding.o2.p2'),
    t('screens.onboarding.o2.p3'),
  ]

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', padding: '0 26px', maxWidth: 560, margin: '0 auto' }}>
      {/* progression */}
      <div style={{ paddingTop: 58, display: 'flex', justifyContent: 'center', gap: 8 }}>
        {[1, 2, 3, 4].map(i => <Dot key={i} i={i} />)}
      </div>

      <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', animation: 'lFadeUp .5s ease' }}>
        {/* ── O1 ── */}
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: T.display, fontSize: 12, fontWeight: 500, letterSpacing: '0.5em', color: T.gold, paddingLeft: '0.5em', marginBottom: 30 }}>DREAM</div>
            <div style={{ fontFamily: T.serif, fontSize: 34, fontStyle: 'italic', color: T.cream, lineHeight: 1.1 }}>{t('screens.onboarding.o1.title')}</div>
            <div style={{ margin: '18px auto 0', maxWidth: 340, fontSize: 15, color: T.dim, lineHeight: 1.5 }}>
              {t('screens.onboarding.o1.body')}
            </div>
            <div style={{ marginTop: 40 }}>
              <button onClick={() => setStep(2)} style={primaryBtn}>{t('screens.onboarding.o1.cta')}</button>
            </div>
          </div>
        )}

        {/* ── O2 : les trois promesses ── */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {promises.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                  <span style={{ marginTop: 6, flexShrink: 0 }}><Moon c={T.goldLit} s={16} /></span>
                  <span style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.cream, lineHeight: 1.35 }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40 }}>
              <button onClick={() => setStep(3)} style={primaryBtn}>{t('screens.onboarding.o2.cta')}</button>
            </div>
          </div>
        )}

        {/* ── O3 : les rendez-vous ── */}
        {step === 3 && (
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 24, fontStyle: 'italic', color: T.cream, lineHeight: 1.25, textAlign: 'center' }}>
              {t('screens.onboarding.o3.title')}
            </div>
            <div style={{ margin: '10px auto 22px', maxWidth: 330, fontSize: 13.5, color: T.dim, lineHeight: 1.45, textAlign: 'center' }}>
              {t('screens.onboarding.o3.sub')}
            </div>
            <AppointmentChooser confirmLabel={t('screens.onboarding.chooser.confirm')} onConfirm={() => setStep(4)} />
          </div>
        )}

        {/* ── O4 : premier dépôt ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: T.serif, fontSize: 27, fontStyle: 'italic', color: T.cream, lineHeight: 1.2 }}>
              {t('screens.onboarding.o4.line1')}<br />{t('screens.onboarding.o4.line2')}
            </div>
            <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => { done(); onStartCapture() }} style={primaryBtn}>{t('screens.onboarding.o4.tell')}</button>
              <button onClick={() => { done(); onFinish() }} style={ghostBtn}>{t('screens.onboarding.o4.later')}</button>
              <button onClick={() => { done(); onImport() }} style={{ background: 'none', border: 'none', color: T.faint, fontSize: 13, cursor: 'pointer', fontFamily: T.sans, padding: '6px 0' }}>
                {t('screens.onboarding.o4.elsewhere')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   ApptChooserSheet — le chooser en bottom-sheet (re-proposition / 1re semaine).
   ═════════════════════════════════════════════════════════════════════ */
export function ApptChooserSheet({ onClose, onSaved, title }: { onClose: () => void; onSaved?: () => void; title?: string }) {
  const { t } = useT()
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(20,14,10,0.72)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, background: 'linear-gradient(180deg, #241a12, #1a1310)', borderTop: `0.5px solid ${T.gold}33`, borderRadius: '26px 26px 0 0', padding: '20px 22px max(26px, env(safe-area-inset-bottom))', maxHeight: '88dvh', overflowY: 'auto', animation: 'lFadeUp .3s ease' }}>
        <div style={{ width: 38, height: 4, borderRadius: 2, background: 'rgba(242,232,213,0.2)', margin: '0 auto 16px' }} />
        <div style={{ fontFamily: T.display, fontSize: 11, letterSpacing: '0.3em', color: T.gold, textAlign: 'center', textTransform: 'uppercase' }}>{title ?? t('screens.onboarding.sheet.title')}</div>
        <div style={{ marginTop: 4, marginBottom: 18, fontSize: 12.5, color: T.dim, textAlign: 'center' }}>{t('screens.onboarding.o3.sub')}</div>
        <AppointmentChooser confirmLabel={t('screens.onboarding.chooser.validate')} onConfirm={() => { onSaved?.(); onClose() }} />
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   ReproposeLine — re-proposition #1 (§8). UNE ligne douce sous l'accueil,
   après le 3e dépôt. Refusée = plus jamais. In-app SEULEMENT (jamais une notif).
   ═════════════════════════════════════════════════════════════════════ */
export function ReproposeLine({ fetchTotal }: { fetchTotal: () => Promise<number> }) {
  const { t } = useT()
  const [show, setShow] = useState(false)
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    let alive = true
    fetchTotal().then(total => { if (alive && shouldShowRepropose(total)) setShow(true) }).catch(() => {})
    return () => { alive = false }
  }, [fetchTotal])

  if (!show) return null
  return (
    <>
      <div style={{ margin: '14px 20px 0', padding: '12px 14px', borderRadius: 16, background: 'rgba(201,168,106,0.05)', border: '0.5px solid rgba(201,168,106,0.14)', display: 'flex', alignItems: 'center', gap: 10, animation: 'lFadeUp .4s ease' }}>
        <span style={{ flexShrink: 0 }}><Moon c={T.goldLit} s={15} /></span>
        <span style={{ flex: 1, fontFamily: T.sans, fontSize: 13, color: T.dim, lineHeight: 1.4 }}>{t('screens.onboarding.repropose.line')}</span>
        <button onClick={() => setSheet(true)} style={{ flexShrink: 0, padding: '7px 13px', borderRadius: 999, background: 'rgba(201,168,106,0.12)', border: `1px solid ${T.gold}55`, color: T.cream, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.onboarding.repropose.choose')}</button>
        <button onClick={() => { dismissRepropose(); setShow(false) }} aria-label={t('screens.onboarding.repropose.dismiss')} style={{ flexShrink: 0, background: 'none', border: 'none', color: T.faint, fontSize: 19, cursor: 'pointer', padding: '2px 3px', lineHeight: 1 }}>×</button>
      </div>
      {sheet && <ApptChooserSheet onClose={() => setSheet(false)} onSaved={() => { if (hasActiveAppointment()) setShow(false) }} />}
    </>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   FirstWeekCard — carte « Ta première semaine » (§9). Dans le Journal, au 7e jour,
   1 fois À VIE. Récap DOUX (jamais un score) + 1 symbole émergent si dispo +
   re-proposition rendez-vous (2e et DERNIÈRE).
   ═════════════════════════════════════════════════════════════════════ */
export function FirstWeekCard({ count, fetchSymbol }: { count: number; fetchSymbol: () => Promise<string | null> }) {
  const { t, tp, locale } = useT()
  const [show, setShow] = useState(false)
  const [symbol, setSymbol] = useState<string | null>(null)
  const [sheet, setSheet] = useState(false)

  useEffect(() => {
    if (!shouldShowFirstWeek()) return
    setShow(true)
    markFirstWeekShown() // vue → jamais ré-affichée (la re-propo #2 est bien la dernière)
    fetchSymbol().then(setSymbol).catch(() => {})
  }, [fetchSymbol])

  if (!show) return null
  const first = firstKairosAt()
  const started = first ? new Date(first).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) : null

  return (
    <>
      <div style={{ margin: '0 18px 22px', padding: 20, borderRadius: 22, background: 'rgba(201,168,106,0.06)', border: `0.5px solid ${T.gold}3a`, animation: 'lFadeUp .5s ease' }}>
        <div style={{ fontFamily: T.display, fontSize: 10.5, fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: T.gold }}>{t('screens.onboarding.firstWeek.kicker')}</div>
        <div style={{ marginTop: 10, fontFamily: T.serif, fontSize: 20, fontStyle: 'italic', color: T.cream, lineHeight: 1.35 }}>
          {t('screens.onboarding.firstWeek.title')}
        </div>
        <div style={{ marginTop: 8, fontSize: 13.5, color: T.dim, lineHeight: 1.5 }}>
          {count > 0
            ? (started
              ? tp('screens.onboarding.firstWeek.countWithDate', count, { date: started })
              : tp('screens.onboarding.firstWeek.count', count))
            : t('screens.onboarding.firstWeek.nothing')}
        </div>
        {symbol && (
          <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 13px', borderRadius: 999, background: 'rgba(201,168,106,0.08)', border: `0.5px solid ${T.gold}33` }}>
            <Moon c={T.goldLit} s={14} />
            <span style={{ fontSize: 13, fontFamily: T.sans, color: T.cream, fontWeight: 500 }}>{t('screens.onboarding.firstWeek.symbol', { symbol })}</span>
          </div>
        )}
        {!hasActiveAppointment() && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '0.5px solid rgba(242,232,213,0.1)' }}>
            <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.45 }}>{t('screens.onboarding.repropose.line')}</div>
            <button onClick={() => setSheet(true)} style={{ marginTop: 10, padding: '9px 15px', borderRadius: 999, background: 'rgba(201,168,106,0.12)', border: `1px solid ${T.gold}55`, color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.onboarding.firstWeek.chooseAppts')}</button>
          </div>
        )}
      </div>
      {sheet && <ApptChooserSheet onClose={() => setSheet(false)} />}
    </>
  )
}
