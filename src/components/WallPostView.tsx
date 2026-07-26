'use client'

/**
 * WallPostView — Écran M2 : un dépôt du Mur, ouvert en plein écran (SPEC §5 · M2).
 *
 * Typographie généreuse (≥17px). UN seul bouton : « Ça me touche » (cœur fin qui
 * s'allume doucement). Appui long → « Signaler ». Anonymat total : aucune identité,
 * aucun compteur public.
 *
 * Tokens mirroir de src/app/mvp/page.tsx (dark chaud) — re-skin plus tard.
 * Yeshua (Opus), 2026-07-11.
 */
import { useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'


export type WallPost = { id: string; body: string; created_at: string; when: string }

async function call(path: string, session: Session | null, opts: RequestInit = {}) {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body) headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || `${res.status}`)
  }
  return res.json()
}

function Back({ c = 'rgba(242,232,213,0.6)', s = 20 }: { c?: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Heart({ on }: { on: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" style={{ transition: 'all .5s cubic-bezier(.22,.61,.36,1)' }}>
      <path
        d="M12 20s-7-4.5-9.2-9C1.4 8 2.6 5 5.6 5c1.9 0 3.1 1.1 3.9 2.3l.5.8.5-.8C11.3 6.1 12.5 5 14.4 5c3 0 4.2 3 2.8 6-2.2 4.5-9.2 9-9.2 9z"
        transform="translate(2 -1)"
        fill={on ? 'rgba(201,168,106,0.85)' : 'none'}
        stroke={on ? T.goldLit : 'rgba(242,232,213,0.55)'}
        strokeWidth="1.4"
        strokeLinejoin="round"
        style={{ transition: 'fill .5s ease, stroke .5s ease' }}
      />
    </svg>
  )
}

export default function WallPostView({
  post,
  session,
  onBack,
}: {
  post: WallPost
  session: Session | null
  onBack: () => void
}) {
  const { t } = useT()
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const [sheet, setSheet] = useState(false) // menu « Signaler »
  const [toast, setToast] = useState('')
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (m: string) => {
    setToast(m)
    setTimeout(() => setToast(''), 1800)
  }

  const toggleTouch = async () => {
    if (busy) return
    setBusy(true)
    const next = !touched
    setTouched(next) // optimiste — le cœur s'allume tout de suite
    try {
      const r = await call('/api/wall/touch', session, { method: 'POST', body: JSON.stringify({ post_id: post.id }) })
      setTouched(!!r.touched)
    } catch {
      setTouched(!next) // rollback discret
    } finally {
      setBusy(false)
    }
  }

  const startPress = () => {
    pressTimer.current = setTimeout(() => setSheet(true), 500)
  }
  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
    pressTimer.current = null
  }

  const report = async () => {
    setSheet(false)
    try {
      await call('/api/wall/report', session, { method: 'POST', body: JSON.stringify({ post_id: post.id }) })
      showToast(t('screens.wall.reported'))
    } catch {
      showToast(t('screens.wall.reportFailed'))
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'radial-gradient(120% 72% at 50% 40%, #241a12 0%, #1a1310 56%, #140e0a 100%)', color: T.ink, fontFamily: T.sans, display: 'flex', flexDirection: 'column', maxWidth: 560, margin: '0 auto' }}>
      {/* header : retour + signature anonyme */}
      <div style={{ paddingTop: 'max(56px, env(safe-area-inset-top))', paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} aria-label={t('screens.common.backCap')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <Back />
        </button>
        <div style={{ fontFamily: T.sans, fontSize: 13, color: T.faint, letterSpacing: '0.02em' }}>{t('screens.wall.signature', { when: post.when })}</div>
      </div>

      {/* corps — typographie généreuse, appui long = signaler */}
      <div
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onContextMenu={(e) => e.preventDefault()}
        style={{ flex: 1, overflowY: 'auto', padding: '28px 26px 20px', WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        <div style={{ fontFamily: T.serif, fontSize: 20, lineHeight: 1.62, color: T.cream, whiteSpace: 'pre-wrap' }}>{post.body}</div>
      </div>

      {/* un seul bouton : Ça me touche */}
      <div style={{ padding: '14px 24px calc(24px + env(safe-area-inset-bottom))', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={toggleTouch}
          disabled={busy}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 26px', borderRadius: 999, cursor: 'pointer', fontFamily: T.sans, fontSize: 15, fontWeight: 500, color: touched ? T.cream : T.ink, background: touched ? 'rgba(201,168,106,0.14)' : 'rgba(201,168,106,0.06)', border: `1px solid ${touched ? T.gold + '66' : 'rgba(201,168,106,0.22)'}`, transition: 'all .4s ease' }}
        >
          <Heart on={touched} />
          {t('screens.wall.touch')}
        </button>
      </div>

      {/* menu Signaler (appui long) */}
      {sheet && (
        <div onClick={() => setSheet(false)} style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(20,14,10,0.72)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: 560, padding: '18px 20px calc(24px + env(safe-area-inset-bottom))', background: '#1a1310', borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTop: '0.5px solid rgba(201,168,106,0.16)' }}>
            <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, marginBottom: 14 }}>{t('screens.wall.reportTitle')}</div>
            <button onClick={report} style={{ width: '100%', padding: 14, borderRadius: 14, cursor: 'pointer', fontFamily: T.sans, fontSize: 14.5, fontWeight: 600, color: T.cream, background: 'rgba(201,168,106,0.10)', border: `1px solid ${T.gold}44`, marginBottom: 10 }}>{t('screens.wall.report')}</button>
            <button onClick={() => setSheet(false)} style={{ width: '100%', padding: 14, borderRadius: 14, cursor: 'pointer', fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.dim, background: 'transparent', border: '1px solid rgba(242,232,213,0.18)' }}>{t('screens.common.cancelCap')}</button>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 60, pointerEvents: 'none' }}>
          <div style={{ padding: '9px 18px', borderRadius: 999, background: 'rgba(20,14,10,0.9)', border: '0.5px solid rgba(242,232,213,0.12)', fontFamily: T.sans, fontSize: 13.5, color: T.dim }}>{toast}</div>
        </div>
      )}
    </div>
  )
}
