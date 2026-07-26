'use client'

/**
 * SettingsScreen — Écran R1 « Réglages » (DREAM-MVP-SPEC-ECRANS-A-Z.md §8).
 *
 * Sections EXACTES de R1 :
 *   Compte · Langue · Rendez-vous · Réveil · Le Mur · Notifications ·
 *   Abonnement & crédits · Comment marche Dream · Mes données · Version.
 *
 * Autonome (pas d'import depuis page.tsx pour ne pas alourdir le fichier partagé) :
 *   - Compte : le changement de mot de passe et la déconnexion sont délégués au parent
 *     (callbacks onChangePassword / onSignOut) qui agit sur le MÊME client Supabase que
 *     l'app (sb() dans page.tsx) — on évite un second client d'auth.
 *   - Langue (§12bis.F) : FR / EN, via useT().setLocale — effet immédiat, persisté en
 *     localStorage par le provider. La ligne sous le choix dit la vérité : la langue
 *     change l'app ET la langue des réponses de Dream ; les rêves déjà écrits ne sont
 *     PAS traduits.
 *   - Rendez-vous : lit/écrit via src/lib/appointments.ts (getSettings / saveSettings).
 *   - Réveil : relie l'écran existant (onGoReveil).
 *   - Le Mur : GET/DELETE /api/wall/mine (mes partages → retirer).
 *   - Abonnement & crédits : relie la Forge (onGoForge).
 *   - Comment marche Dream : ouvre HowDreamWorks (index des fiches ⓘ).
 *   - Mes données : GET /api/user/export (télécharge tout) · POST /api/user/delete-request
 *     (demande de suppression, délai 7 jours, annulable). Code défensif si la table n'est
 *     pas encore là (503 « bientôt »).
 *
 * Yeshua (Opus), 2026-07-11.
 */

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { HowDreamWorks, InfoDot } from '@/components/InfoSystem'
import * as Appointments from '@/lib/appointments'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'


const APP_VERSION = 'Dream · alpha'
const NOTIF_PREFS_KEY = 'dream_notif_prefs'

async function authFetch(path: string, opts: RequestInit, session: Session | null): Promise<Response> {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  return fetch(path, { ...opts, headers })
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontFamily: T.display, fontSize: 10.5, letterSpacing: '0.26em', textTransform: 'uppercase', color: T.gold, marginBottom: 12, paddingLeft: 4 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>{children}</div>
    </div>
  )
}

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12, padding: '15px 16px', borderRadius: 16,
  background: T.card, border: T.cardBorder, width: '100%', textAlign: 'left', cursor: 'pointer',
  fontFamily: T.sans, color: T.cream,
}

function Row({ label, sub, right, onClick, danger }: { label: React.ReactNode; sub?: string; right?: React.ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} style={{ ...rowStyle, cursor: onClick ? 'pointer' : 'default', color: danger ? T.emberLive : T.cream, border: danger ? '0.5px solid rgba(199,115,75,0.4)' : T.cardBorder }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ marginTop: 3, fontSize: 12, color: T.dim, lineHeight: 1.4 }}>{sub}</div>}
      </div>
      {right}
    </button>
  )
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <span
      onClick={e => { e.stopPropagation(); onClick() }}
      role="switch"
      aria-checked={on}
      style={{ width: 44, height: 26, borderRadius: 999, background: on ? 'rgba(201,168,106,0.55)' : 'rgba(242,232,213,0.12)', border: `1px solid ${on ? T.gold : 'rgba(242,232,213,0.2)'}`, position: 'relative', flexShrink: 0, cursor: 'pointer', transition: 'background .2s ease' }}
    >
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: on ? '#f6ecd6' : 'rgba(242,232,213,0.6)', transition: 'left .2s ease' }} />
    </span>
  )
}

export default function SettingsScreen({
  session, onBack, onGoReveil, onGoForge, onChangePassword, onSignOut,
}: {
  session: Session
  onBack: () => void
  onGoReveil: () => void
  onGoForge: () => void
  onChangePassword: (pw: string) => Promise<string | null> // renvoie un message d'erreur ou null
  onSignOut: () => Promise<void>
}) {
  const { t } = useT()
  const [view, setView] = useState<'main' | 'how'>('main')

  if (view === 'how') return <HowDreamWorks onClose={() => setView('main')} />

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 80 }}>
      <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="rgba(242,232,213,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div style={{ fontFamily: T.serif, fontSize: 24, fontStyle: 'italic', color: T.cream }}>{t('screens.settings.title')}</div>
      </div>

      <div style={{ margin: '8px 20px 0' }}>
        <AccountSection session={session} onChangePassword={onChangePassword} onSignOut={onSignOut} />
        <LanguageSection />
        <AppointmentsSection />
        <Section title={t('screens.settings.wakeup.title')}>
          <Row label={t('screens.settings.wakeup.soft')} sub={t('screens.settings.wakeup.softSub')} onClick={onGoReveil} right={<Chevron />} />
        </Section>
        <WallSection session={session} />
        <NotificationsSection />
        <Section title={t('screens.settings.credits.title')}>
          <Row label={t('screens.settings.credits.row')} sub={t('screens.settings.credits.sub')} onClick={onGoForge} right={<Chevron />} />
        </Section>
        <Section title={t('screens.settings.help.title')}>
          <Row label={t('screens.settings.help.how')} sub={t('screens.settings.help.howSub')} onClick={() => setView('how')} right={<Chevron />} />
        </Section>
        <DataSection session={session} />

        <div style={{ marginTop: 34, textAlign: 'center', fontFamily: T.sans, fontSize: 12, color: T.faint, lineHeight: 1.7 }}>
          <div>{APP_VERSION}</div>
          <div style={{ marginTop: 4 }}>
            <a href="/privacy" style={{ color: T.dim, textDecoration: 'none' }}>{t('screens.settings.privacy')}</a>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
            <a href="/data-deletion" style={{ color: T.dim, textDecoration: 'none' }}>{t('screens.settings.legal')}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Chevron() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="rgba(242,232,213,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Check() {
  return <svg width={18} height={18} viewBox="0 0 24 24" fill="none"><path d="M4 12.5 9.5 18 20 6" stroke="#c9a86a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/* ───────── Compte ───────── */
function AccountSection({ session, onChangePassword, onSignOut }: { session: Session; onChangePassword: (pw: string) => Promise<string | null>; onSignOut: () => Promise<void> }) {
  const { t } = useT()
  const [pwOpen, setPwOpen] = useState(false)
  const [pw, setPw] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const save = async () => {
    if (pw.length < 6) { setErr(t('screens.settings.account.tooShort')); return }
    setBusy(true); setErr(''); setMsg('')
    const e = await onChangePassword(pw)
    setBusy(false)
    if (e) setErr(e)
    else { setMsg(t('screens.settings.account.saved')); setPw(''); setPwOpen(false) }
  }

  return (
    <Section title={t('screens.settings.account.title')}>
      <div style={{ ...rowStyle, cursor: 'default' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: T.dim }}>{t('screens.settings.account.signedInAs')}</div>
          <div style={{ marginTop: 2, fontSize: 14.5, fontWeight: 500, color: T.cream, wordBreak: 'break-all' }}>{session.user?.email || '—'}</div>
        </div>
      </div>

      {!pwOpen ? (
        <Row label={t('screens.settings.account.changePassword')} onClick={() => { setPwOpen(true); setMsg(''); setErr('') }} right={<Chevron />} />
      ) : (
        <div style={{ padding: '15px 16px', borderRadius: 16, background: T.card, border: T.cardBorder }}>
          <input type="password" autoComplete="new-password" placeholder={t('screens.settings.account.newPassword')} value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()} style={{ width: '100%', padding: '13px 15px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: T.cardBorder, color: T.cream, fontSize: 16, fontFamily: T.sans }} />
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button onClick={() => { setPwOpen(false); setPw(''); setErr('') }} style={{ flex: 1, padding: 11, borderRadius: 999, background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: T.dim, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.common.cancel')}</button>
            <button onClick={save} disabled={busy} style={{ flex: 1.4, padding: 11, borderRadius: 999, background: 'linear-gradient(180deg, #f2e6c6, #d8c39a)', border: 'none', color: '#241a09', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{busy ? t('screens.common.working') : t('screens.common.save')}</button>
          </div>
        </div>
      )}

      {msg && <div style={{ fontSize: 13, color: T.gold, textAlign: 'center', fontFamily: T.sans }}>{msg} ✦</div>}
      {err && <div style={{ fontSize: 12.5, color: T.emberLive, textAlign: 'center', fontFamily: T.sans }}>{err}</div>}

      <Row label={t('screens.settings.account.signOut')} danger onClick={() => onSignOut()} />
    </Section>
  )
}

/* ───────── Langue (§12bis.F) ─────────
   Le changement est immédiat : setLocale re-rend tout l'arbre sous le provider.
   La ligne du bas ne cache rien : Dream répondra dans cette langue, mais les rêves
   déjà écrits restent tels quels — on ne traduit pas ce que le rêveur a posé. */
function LanguageSection() {
  const { t, locale, setLocale } = useT()
  /* Les notifications déjà planifiées portent le texte de la langue d'ALORS :
     elles sont posées dans l'OS, pas re-rendues par React. Sans ce rappel, un
     rêveur qui passe en anglais recevrait encore ses rendez-vous en français.
     `relocalizeNotifications()` ne peut RIEN créer (elle sort tôt si aucun
     rendez-vous n'est actif) — elle ne fait que réécrire l'existant. */
  const choose = (l: 'fr' | 'en') => {
    if (l === locale) return
    setLocale(l)
    void Appointments.relocalizeNotifications().catch(() => {})
  }
  return (
    <Section title={t('screens.settings.language.title')}>
      <Row label={t('screens.settings.language.fr')} onClick={() => choose('fr')} right={locale === 'fr' ? <Check /> : undefined} />
      <Row label={t('screens.settings.language.en')} onClick={() => choose('en')} right={locale === 'en' ? <Check /> : undefined} />
      <div style={{ padding: '2px 4px', fontFamily: T.sans, fontSize: 11.5, color: T.faint, lineHeight: 1.5 }}>
        {t('screens.settings.language.note')}
      </div>
    </Section>
  )
}

/* ───────── Rendez-vous ───────── */
function AppointmentsSection() {
  const { t } = useT()
  const [s, setS] = useState<Appointments.AppointmentSettings | null>(null)
  useEffect(() => { try { setS(Appointments.getSettings()) } catch { setS({ morning: false, evening: false, morningTime: '07:30', eveningTime: '22:00' }) } }, [])

  const update = (patch: Partial<Appointments.AppointmentSettings>) => {
    setS(prev => {
      const next = { ...(prev as Appointments.AppointmentSettings), ...patch }
      try { Appointments.saveSettings(next) } catch {}
      return next
    })
  }
  if (!s) return null

  return (
    <Section title={t('screens.settings.appointments.title')}>
      <div style={{ padding: '4px 4px 10px', fontFamily: T.sans, fontSize: 12.5, color: T.dim, lineHeight: 1.5 }}>
        {t('screens.settings.appointments.intro')}
      </div>

      <div style={{ ...rowStyle, cursor: 'default', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>{t('screens.settings.appointments.morning')}</div>
            <div style={{ marginTop: 3, fontSize: 12, color: T.dim, lineHeight: 1.4 }}>« {t(Appointments.APPT_MORNING_BODY)} »</div>
          </div>
          <Toggle on={s.morning} onClick={() => update({ morning: !s.morning })} />
        </div>
        {s.morning && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: T.dim }}>{t('screens.settings.appointments.at')}</span>
            <input type="time" value={s.morningTime} onChange={e => update({ morningTime: e.target.value })} style={timeInput} />
          </div>
        )}
      </div>

      <div style={{ ...rowStyle, cursor: 'default', flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14.5, fontWeight: 500 }}>{t('screens.settings.appointments.evening')}</div>
            <div style={{ marginTop: 3, fontSize: 12, color: T.dim, lineHeight: 1.4 }}>« {t(Appointments.APPT_EVENING_BODY)} »</div>
          </div>
          <Toggle on={s.evening} onClick={() => update({ evening: !s.evening })} />
        </div>
        {s.evening && (
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: T.dim }}>{t('screens.settings.appointments.at')}</span>
            <input type="time" value={s.eveningTime} onChange={e => update({ eveningTime: e.target.value })} style={timeInput} />
          </div>
        )}
      </div>

      {!s.morning && !s.evening && (
        <div style={{ padding: '10px 4px 0', fontFamily: T.serif, fontSize: 15, fontStyle: 'italic', color: T.dim }}>
          {t('screens.settings.appointments.none')}
        </div>
      )}
    </Section>
  )
}

const timeInput: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '0.5px solid rgba(201,168,106,0.16)',
  color: '#c9a86a', fontSize: 17, fontFamily: 'ui-monospace, monospace',
}

/* ───────── Le Mur ───────── */
function WallSection({ session }: { session: Session }) {
  const { t, tp } = useT()
  const [posts, setPosts] = useState<any[] | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await authFetch('/api/wall/mine', {}, session)
      if (!res.ok) { setUnavailable(true); setPosts([]); return }
      const j = await res.json()
      setPosts(Array.isArray(j.posts) ? j.posts : [])
    } catch { setUnavailable(true); setPosts([]) }
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (postId: string) => {
    setRemoving(postId)
    try {
      const res = await authFetch(`/api/wall/mine?post_id=${encodeURIComponent(postId)}`, { method: 'DELETE' }, session)
      if (res.ok) setPosts(p => (p || []).filter(x => x.id !== postId))
    } catch {}
    setRemoving(null)
  }

  return (
    <Section title={t('screens.settings.wall.title')}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '2px 4px 8px' }}>
        <div style={{ flex: 1, fontFamily: T.sans, fontSize: 12.5, color: T.dim, lineHeight: 1.5 }}>
          {t('screens.settings.wall.intro')}
        </div>
        <InfoDot id="wall-anon" color="rgba(201,168,106,0.7)" />
      </div>

      {posts === null ? (
        <div style={{ padding: '14px 16px', fontFamily: T.serif, fontSize: 15, fontStyle: 'italic', color: T.dim }}>{t('screens.common.aMoment')}</div>
      ) : unavailable ? (
        <div style={{ padding: '14px 16px', borderRadius: 16, background: T.card, border: T.cardBorder, fontFamily: T.sans, fontSize: 13, color: T.dim, lineHeight: 1.5 }}>
          {t('screens.settings.wall.soon')}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ padding: '14px 16px', borderRadius: 16, background: T.card, border: T.cardBorder, fontFamily: T.serif, fontSize: 16, fontStyle: 'italic', color: T.dim, lineHeight: 1.5 }}>
          {t('screens.settings.wall.empty')}
        </div>
      ) : (
        posts.map(p => (
          <div key={p.id} style={{ padding: '14px 16px', borderRadius: 16, background: T.card, border: T.cardBorder }}>
            <div style={{ fontFamily: T.serif, fontSize: 15.5, color: T.ink, lineHeight: 1.45 }}>
              {(p.body || '').slice(0, 140) || t('screens.settings.wall.untitled')}{(p.body || '').length > 140 ? '…' : ''}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: T.sans, fontSize: 11.5, color: T.faint }}>
                {typeof p.touch_count === 'number' && p.touch_count > 0
                  ? tp('screens.settings.wall.touched', p.touch_count)
                  : t('screens.settings.wall.notTouched')}
              </span>
              <button onClick={() => remove(p.id)} disabled={removing === p.id} style={{ background: 'none', border: 'none', color: T.emberLive, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans, padding: 4 }}>
                {removing === p.id ? t('screens.common.working') : t('screens.settings.wall.remove')}
              </button>
            </div>
          </div>
        ))
      )}
    </Section>
  )
}

/* ───────── Notifications ───────── */
function NotificationsSection() {
  const { t } = useT()
  const [prefs, setPrefs] = useState<{ groups: boolean; works: boolean }>({ groups: true, works: true })
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTIF_PREFS_KEY)
      if (raw) { const p = JSON.parse(raw); setPrefs({ groups: p.groups !== false, works: p.works !== false }) }
    } catch {}
  }, [])
  const set = (patch: Partial<{ groups: boolean; works: boolean }>) => {
    setPrefs(prev => { const next = { ...prev, ...patch }; try { localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(next)) } catch {}; return next })
  }
  return (
    <Section title={t('screens.settings.notifications.title')}>
      <Row label={t('screens.settings.notifications.groups')} sub={t('screens.settings.notifications.groupsSub')} right={<Toggle on={prefs.groups} onClick={() => set({ groups: !prefs.groups })} />} />
      <Row label={t('screens.settings.notifications.works')} sub={t('screens.settings.notifications.worksSub')} right={<Toggle on={prefs.works} onClick={() => set({ works: !prefs.works })} />} />
      <div style={{ padding: '2px 4px', fontFamily: T.sans, fontSize: 11.5, color: T.faint, lineHeight: 1.5 }}>
        {t('screens.settings.notifications.wallNever')}
      </div>
    </Section>
  )
}

/* ───────── Mes données ───────── */
function DataSection({ session }: { session: Session }) {
  const { t, locale } = useT()
  const [exporting, setExporting] = useState(false)
  const [exportErr, setExportErr] = useState('')
  const [delStep, setDelStep] = useState<0 | 1 | 2>(0)
  const [delBusy, setDelBusy] = useState(false)
  const [delMsg, setDelMsg] = useState('')
  const [delErr, setDelErr] = useState('')
  const [pending, setPending] = useState<{ scheduled_for?: string } | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/user/delete-request', {}, session)
        if (res.ok) { const j = await res.json(); if (j.pending && j.request) setPending(j.request) }
      } catch {}
    })()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const exportAll = async () => {
    setExporting(true); setExportErr('')
    try {
      const res = await authFetch('/api/user/export', {}, session)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dream-export-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 4000)
    } catch { setExportErr(t('screens.settings.data.exportError')) }
    setExporting(false)
  }

  const requestDelete = async () => {
    setDelBusy(true); setDelErr(''); setDelMsg('')
    try {
      const res = await authFetch('/api/user/delete-request', { method: 'POST' }, session)
      const j = await res.json().catch(() => ({}))
      if (!res.ok) { setDelErr(j.error || t('screens.settings.data.deleteError')); setDelBusy(false); setDelStep(0); return }
      setPending(j.request || { })
      setDelMsg(t('screens.settings.data.requested'))
      setDelStep(0)
    } catch { setDelErr(t('screens.settings.data.deleteError')); setDelStep(0) }
    setDelBusy(false)
  }

  const cancelDelete = async () => {
    setDelBusy(true); setDelErr('')
    try {
      await authFetch('/api/user/delete-request', { method: 'DELETE' }, session)
      setPending(null); setDelMsg(''); setDelStep(0)
    } catch {}
    setDelBusy(false)
  }

  const fmt = (iso?: string) => { if (!iso) return ''; try { return new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long' }) } catch { return '' } }

  return (
    <Section title={t('screens.settings.data.title')}>
      <Row label={exporting ? t('screens.settings.data.exporting') : t('screens.settings.data.export')} sub={t('screens.settings.data.exportSub')} onClick={exporting ? undefined : exportAll} right={<Chevron />} />
      {exportErr && <div style={{ fontSize: 12.5, color: T.emberLive, textAlign: 'center', fontFamily: T.sans }}>{exportErr}</div>}

      {pending ? (
        <div style={{ padding: '15px 16px', borderRadius: 16, background: 'rgba(199,115,75,0.06)', border: '0.5px solid rgba(199,115,75,0.4)' }}>
          <div style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.cream }}>
            {pending.scheduled_for
              ? t('screens.settings.data.deleteScheduledOn', { date: fmt(pending.scheduled_for) })
              : t('screens.settings.data.deleteScheduledSoon')}
          </div>
          <div style={{ marginTop: 4, fontSize: 12.5, color: T.dim, lineHeight: 1.5 }}>{t('screens.settings.data.deletePending')}</div>
          <button onClick={cancelDelete} disabled={delBusy} style={{ marginTop: 12, padding: '10px 16px', borderRadius: 999, background: 'rgba(201,168,106,0.12)', border: `1px solid ${T.gold}55`, color: T.cream, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{delBusy ? t('screens.common.working') : t('screens.settings.data.cancelDelete')}</button>
        </div>
      ) : delStep === 0 ? (
        <Row label={t('screens.settings.data.delete')} danger onClick={() => { setDelStep(1); setDelErr(''); setDelMsg('') }} />
      ) : delStep === 1 ? (
        <div style={{ padding: '16px', borderRadius: 16, background: 'rgba(199,115,75,0.06)', border: '0.5px solid rgba(199,115,75,0.4)' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, color: T.cream, lineHeight: 1.4 }}>{t('screens.settings.data.confirm1Title')}</div>
          <div style={{ marginTop: 6, fontSize: 13, color: T.dim, lineHeight: 1.5 }}>{t('screens.settings.data.confirm1Body')}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button onClick={() => setDelStep(0)} style={{ flex: 1, padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.common.cancel')}</button>
            <button onClick={() => setDelStep(2)} style={{ flex: 1, padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(199,115,75,0.5)', color: T.emberLive, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.common.continue')}</button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '16px', borderRadius: 16, background: 'rgba(199,115,75,0.06)', border: '0.5px solid rgba(199,115,75,0.4)' }}>
          <div style={{ fontFamily: T.serif, fontSize: 17, color: T.cream, lineHeight: 1.4 }}>{t('screens.settings.data.confirm2Title')}</div>
          <div style={{ marginTop: 6, fontSize: 13, color: T.dim, lineHeight: 1.5 }}>{t('screens.settings.data.confirm2Body')}</div>
          <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
            <button onClick={() => setDelStep(0)} style={{ flex: 1, padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.settings.data.keepAccount')}</button>
            <button onClick={requestDelete} disabled={delBusy} style={{ flex: 1, padding: 12, borderRadius: 999, background: 'rgba(199,115,75,0.16)', border: '1px solid rgba(199,115,75,0.6)', color: T.emberLive, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{delBusy ? t('screens.common.working') : t('screens.settings.data.yesDelete')}</button>
          </div>
        </div>
      )}
      {delMsg && <div style={{ fontSize: 12.5, color: T.gold, textAlign: 'center', fontFamily: T.sans }}>{delMsg}</div>}
      {delErr && <div style={{ fontSize: 12.5, color: T.emberLive, textAlign: 'center', fontFamily: T.sans }}>{delErr}</div>}
    </Section>
  )
}
