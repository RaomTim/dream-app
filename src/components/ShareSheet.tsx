'use client'

/**
 * ShareSheet — Sheet P1 (DREAM-MVP-SPEC-ECRANS-A-Z.md §5)
 * La porte UNIQUE de partage dans toute l'app : « Partager vers… »
 *   → Tes groupes (cases à cocher multi, POST /api/kairos/[id]/circle-share par groupe)
 *   → Le Mur, anonymement (première fois : mini-confirmation + consentement mémorisé
 *     en localStorage ; fois suivantes : direct). Backend Mur (POST /api/wall/post,
 *     DELETE /api/wall/mine) construit EN PARALLÈLE par un autre agent → code défensif :
 *     si la route répond 404 (pas encore livrée), on prévient au lieu de planter.
 *
 * Appelée depuis A4 (post-dépôt) et J3 (fiche rêve/moment) — voir src/app/mvp/page.tsx.
 * Composant volontairement autonome (pas d'import depuis page.tsx) pour ne pas alourdir
 * les modifications du fichier partagé par plusieurs agents en parallèle.
 */

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { InfoDot } from '@/components/InfoSystem'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

const S = T

const WALL_CONSENT_KEY = 'dream_wall_consent'

async function call(path: string, opts: RequestInit, session: Session | null): Promise<Response> {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    const err: any = new Error(e.error || String(res.status))
    err.status = res.status
    throw err
  }
  return res
}

type Circle = { id: string; name: string }

export default function ShareSheet({
  session,
  kairosId,
  kairosType,
  open,
  onClose,
  onShared,
}: {
  session: Session | null
  kairosId: string
  kairosType?: string | null
  open: boolean
  onClose: () => void
  onShared?: () => void
}) {
  const { t } = useT()
  const tab: 'nuit' | 'jour' = kairosType === 'note_jour' ? 'jour' : 'nuit'

  const [circles, setCircles] = useState<Circle[] | null>(null)
  const [alreadyShared, setAlreadyShared] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const [wallConsent, setWallConsent] = useState(false)
  const [wallChecked, setWallChecked] = useState(false)
  const [wallShowConfirm, setWallShowConfirm] = useState(false)
  const [wallSoon, setWallSoon] = useState(false) // vrai si la route Mur a répondu 404 — feature bientôt là

  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  // Reset + chargement à chaque ouverture
  useEffect(() => {
    if (!open) return
    setSelected(new Set())
    setWallChecked(false)
    setWallShowConfirm(false)
    setToast('')
    try { setWallConsent(localStorage.getItem(WALL_CONSENT_KEY) === '1') } catch { setWallConsent(false) }

    setCircles(null)
    call('/api/circles', {}, session).then(r => r.json()).then(j => setCircles(j.circles || [])).catch(() => setCircles([]))

    call(`/api/kairos/${kairosId}/circle-share`, {}, session).then(r => r.json()).then(j => {
      const ids = (j.circles || []).map((c: any) => c.circle_id)
      setAlreadyShared(new Set(ids))
    }).catch(() => setAlreadyShared(new Set()))
  }, [open, kairosId, session])

  if (!open) return null

  const toggleCircle = (id: string) => {
    if (alreadyShared.has(id)) return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const tapWall = () => {
    if (wallChecked) { setWallChecked(false); return }
    if (!wallConsent) { setWallShowConfirm(true); return }
    setWallChecked(true)
  }

  const confirmWallConsent = () => {
    try { localStorage.setItem(WALL_CONSENT_KEY, '1') } catch {}
    setWallConsent(true)
    setWallChecked(true)
    setWallShowConfirm(false)
  }

  const submit = async () => {
    if (busy) return
    const toShare = Array.from(selected).filter(id => !alreadyShared.has(id))
    if (toShare.length === 0 && !wallChecked) { onClose(); return }
    setBusy(true)
    let anyOk = false
    let wallFailed = false
    for (const circleId of toShare) {
      try {
        await call(`/api/kairos/${kairosId}/circle-share`, { method: 'POST', body: JSON.stringify({ circle_id: circleId }) }, session)
        anyOk = true
      } catch { /* un groupe a échoué — on continue les autres */ }
    }
    if (wallChecked) {
      try {
        await call('/api/wall/post', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, tab }) }, session)
        anyOk = true
      } catch (e: any) {
        wallFailed = true
        if (e?.status === 404) setWallSoon(true)
      }
    }
    setBusy(false)
    if (anyOk) {
      setToast(t('screens.share.done'))
      onShared?.()
      setTimeout(() => { setToast(''); onClose() }, wallFailed ? 1900 : 1100)
    } else if (wallFailed) {
      setToast(t('screens.share.wallSoon'))
      setTimeout(() => setToast(''), 1900)
    } else {
      setToast(t('screens.share.failed'))
      setTimeout(() => setToast(''), 1900)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('screens.share.aria')}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(20,14,10,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480, maxHeight: '82dvh', overflowY: 'auto', background: '#1a1310', borderTopLeftRadius: 26, borderTopRightRadius: 26, border: '0.5px solid rgba(201,168,106,0.22)', borderBottom: 'none', padding: '22px 20px calc(22px + env(safe-area-inset-bottom))', animation: 'shareSheetUp .28s cubic-bezier(0.32,0.04,0.25,1)' }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(242,232,213,0.2)', margin: '0 auto 18px' }} />

        {toast ? (
          <div style={{ padding: '30px 10px', textAlign: 'center', fontFamily: S.serif, fontStyle: 'italic', fontSize: 19, color: S.cream }}>{toast}</div>
        ) : (
          <>
            <div style={{ fontFamily: S.serif, fontSize: 21, fontStyle: 'italic', color: S.cream, marginBottom: 18 }}>{t('screens.share.title')}</div>

            <div style={{ fontFamily: S.sans, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: S.faint, marginBottom: 10 }}>{t('screens.share.yourGroups')}</div>
            {circles === null ? (
              <div style={{ fontSize: 13, color: S.dim, textAlign: 'center', padding: '10px 0' }}>{t('screens.share.loadingGroups')}</div>
            ) : circles.length === 0 ? (
              <div style={{ fontSize: 13.5, color: S.dim, lineHeight: 1.5, padding: '4px 0 6px' }}>{t('screens.share.noGroups')}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
                {circles.map(c => {
                  const shared = alreadyShared.has(c.id)
                  const checked = shared || selected.has(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleCircle(c.id)}
                      disabled={shared}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 14, background: checked ? 'rgba(201,168,106,0.10)' : 'rgba(242,232,213,0.03)', border: checked ? `1px solid ${S.gold}55` : '1px solid rgba(242,232,213,0.10)', cursor: shared ? 'default' : 'pointer', textAlign: 'left', width: '100%', opacity: shared ? 0.7 : 1 }}
                    >
                      <span style={{ width: 19, height: 19, borderRadius: 6, border: `1.4px solid ${checked ? S.gold : 'rgba(242,232,213,0.35)'}`, background: checked ? S.gold : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {checked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 12.5 9.5 18 20 6" stroke="#1a1310" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </span>
                      <span style={{ flex: 1, fontFamily: S.sans, fontSize: 15, fontWeight: 500, color: S.cream }}>{c.name}</span>
                      {shared && <span style={{ fontSize: 11.5, color: S.faint }}>{t('screens.share.alreadyShared')}</span>}
                    </button>
                  )
                })}
              </div>
            )}

            <div style={{ height: 1, background: 'rgba(242,232,213,0.08)', margin: '14px 0' }} />

            {wallShowConfirm ? (
              <div style={{ padding: 16, borderRadius: 16, background: S.card, border: S.cardBorder, marginBottom: 6 }}>
                <div style={{ fontFamily: S.serif, fontSize: 15.5, fontStyle: 'italic', color: S.cream, lineHeight: 1.5 }}>
                  {t('screens.share.wallConsent')}
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                  <button onClick={() => setWallShowConfirm(false)} style={{ flex: 1, padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: S.dim, fontSize: 13.5, fontFamily: S.sans, cursor: 'pointer' }}>{t('screens.common.cancelCap')}</button>
                  <button onClick={confirmWallConsent} style={{ flex: 1, padding: 12, borderRadius: 999, border: 'none', background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', color: '#2a160e', fontSize: 13.5, fontWeight: 600, fontFamily: S.sans, cursor: 'pointer' }}>{t('screens.share.wallConsentOk')}</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <button
                  onClick={tapWall}
                  disabled={wallSoon}
                  style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 14, background: wallChecked ? 'rgba(201,168,106,0.10)' : 'rgba(242,232,213,0.03)', border: wallChecked ? `1px solid ${S.gold}55` : '1px solid rgba(242,232,213,0.10)', cursor: wallSoon ? 'default' : 'pointer', textAlign: 'left', opacity: wallSoon ? 0.55 : 1 }}
                >
                  <span style={{ width: 19, height: 19, borderRadius: 6, border: `1.4px solid ${wallChecked ? S.gold : 'rgba(242,232,213,0.35)'}`, background: wallChecked ? S.gold : 'transparent', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wallChecked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 12.5 9.5 18 20 6" stroke="#1a1310" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  <span style={{ flex: 1, fontFamily: S.sans, fontSize: 15, fontWeight: 500, color: S.cream }}>{t('screens.share.wallOption')}</span>
                  {wallSoon && <span style={{ fontSize: 11.5, color: S.faint }}>{t('screens.share.soon')}</span>}
                </button>
                <InfoDot id="wall-anon" size={16} color="rgba(201,168,106,0.7)" />
              </div>
            )}

            <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
              <button onClick={onClose} style={{ flex: 1, padding: 14, borderRadius: 999, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: S.dim, fontSize: 14, fontWeight: 500, fontFamily: S.sans }}>{t('screens.common.cancelCap')}</button>
              <button
                onClick={submit}
                disabled={busy}
                style={{ flex: 1, padding: 14, borderRadius: 999, cursor: 'pointer', fontFamily: S.sans, fontSize: 14.5, fontWeight: 600, border: 'none', opacity: busy ? 0.6 : 1, background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', color: '#2a160e' }}
              >
                {busy ? t('screens.share.submitting') : t('screens.share.submit')}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @keyframes shareSheetUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}
