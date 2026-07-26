'use client'

/**
 * ExportSheet — export / partage EXTERNE d'un rêve (§12ter.D).
 *
 * Distinct de ShareSheet (qui partage vers les groupes / le Mur, à l'intérieur de Dream).
 * Ici on SORT de l'app : partage système (navigator.share) ou copie presse-papier.
 *
 * Trois portes :
 *   1. Le texte        → le rêve en mots (titre, date, texte)
 *   2. La voix         → le fichier audio du rêve (si gardé) — partage/téléchargement système
 *   3. Le rêve + sa lecture → le texte + l'interprétation gardée (« Lecture de Dream : … »)
 *
 * Vocabulaire mondial, zéro mot banni (§0.1). Composant autonome (pas d'import page.tsx)
 * pour ne pas alourdir le fichier partagé. Yeshua (Opus), 2026-07-22.
 */

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

const S = T

async function call(path: string, opts: RequestInit, session: Session | null): Promise<Response> {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) throw new Error(String(res.status))
  return res
}

// Partage système si dispo, sinon copie presse-papier. Renvoie 'shared' | 'copied' | 'cancelled'.
async function shareOrCopy(text: string, title?: string): Promise<'shared' | 'copied' | 'cancelled'> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try { await navigator.share({ title, text }); return 'shared' }
    catch (e: any) { if (e?.name === 'AbortError') return 'cancelled' /* l'utilisateur a fermé la feuille système */ }
  }
  try { await navigator.clipboard.writeText(text); return 'copied' }
  catch { return 'copied' }
}

// Partage/télécharge le fichier audio depuis son URL signée. Renvoie 'shared' | 'saved' | 'cancelled'.
async function shareAudio(audioUrl: string, filename: string): Promise<'shared' | 'saved' | 'cancelled'> {
  try {
    const resp = await fetch(audioUrl)
    const blob = await resp.blob()
    const file = new File([blob], filename, { type: blob.type || 'audio/webm' })
    const nav: any = typeof navigator !== 'undefined' ? navigator : null
    if (nav && typeof nav.share === 'function' && typeof nav.canShare === 'function' && nav.canShare({ files: [file] })) {
      try { await nav.share({ files: [file] }); return 'shared' }
      catch (e: any) { if (e?.name === 'AbortError') return 'cancelled' }
    }
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = filename
    document.body.appendChild(a); a.click(); a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 4000)
    return 'saved'
  } catch {
    if (typeof window !== 'undefined') window.open(audioUrl, '_blank')
    return 'saved'
  }
}

export default function ExportSheet({
  session,
  kairos,
  audioUrl,
  open,
  onClose,
}: {
  session: Session | null
  kairos: { id: string; title?: string | null; raw_text?: string | null; created_at?: string | null; kairos_type?: string | null } | null
  audioUrl: string | null
  open: boolean
  onClose: () => void
}) {
  const { t, locale } = useT()
  const [interpBody, setInterpBody] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!open || !kairos?.id) return
    setToast(''); setInterpBody(null)
    call(`/api/mvp/interpretations?kairos_id=${encodeURIComponent(kairos.id)}`, {}, session)
      .then(r => r.json())
      .then(j => {
        const kept = (Array.isArray(j.interpretations) ? j.interpretations : []).filter((i: any) => i.status === 'kept')
        setInterpBody(kept[0]?.body || null)
      })
      .catch(() => setInterpBody(null))
  }, [open, kairos?.id, session])

  if (!open) return null

  const dateStr = kairos?.created_at ? new Date(kairos.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const title = kairos?.title || t(kairos?.kairos_type === 'note_jour' ? 'core.journal.fallbackNote' : 'core.journal.fallbackDream', { date: dateStr })
  const raw = (kairos?.raw_text || '').trim()

  const textBody = [title, dateStr, '', raw].join('\n')
  const fullBody = [title, dateStr, '', raw, '', '—', '', `${t('core.export.readingLabel')} : ${interpBody || ''}`].join('\n')

  const flash = (msg: string, close = true) => {
    setToast(msg)
    setTimeout(() => { setToast(''); if (close) onClose() }, close ? 1100 : 1600)
  }

  const doText = async () => {
    if (busy) return; setBusy(true)
    const r = await shareOrCopy(textBody, title)
    setBusy(false)
    if (r === 'cancelled') return
    flash(r === 'shared' ? t('core.export.shared') : t('core.export.copied'))
  }
  const doFull = async () => {
    if (busy) return; setBusy(true)
    const r = await shareOrCopy(fullBody, title)
    setBusy(false)
    if (r === 'cancelled') return
    flash(r === 'shared' ? t('core.export.shared') : t('core.export.copied'))
  }
  const doAudio = async () => {
    if (busy || !audioUrl) return; setBusy(true)
    const safe = (title || 'dream').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'dream'
    const r = await shareAudio(audioUrl, `${safe}.webm`)
    setBusy(false)
    if (r === 'cancelled') return
    flash(r === 'shared' ? t('core.export.shared') : t('core.export.saved'))
  }

  const Option = ({ onClick, disabled, label, sub }: { onClick: () => void; disabled?: boolean; label: string; sub: string }) => (
    <button
      onClick={onClick}
      disabled={disabled || busy}
      style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '15px 16px', borderRadius: 16, background: 'rgba(202,191,206,0.03)', border: '1px solid rgba(202,191,206,0.1)', cursor: disabled ? 'default' : 'pointer', textAlign: 'left', width: '100%', opacity: disabled ? 0.4 : 1 }}
    >
      <span style={{ fontFamily: S.sans, fontSize: 15.5, fontWeight: 600, color: S.cream }}>{label}</span>
      <span style={{ fontFamily: S.sans, fontSize: 12.5, color: S.faint }}>{sub}</span>
    </button>
  )

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t('core.export.title')}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(20,14,10,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 480, maxHeight: '82dvh', overflowY: 'auto', background: '#221d29', borderTopLeftRadius: 26, borderTopRightRadius: 26, border: '0.5px solid rgba(255,255,255,0.22)', borderBottom: 'none', padding: '22px 20px calc(22px + env(safe-area-inset-bottom))', animation: 'exportSheetUp .28s cubic-bezier(0.32,0.04,0.25,1)' }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(202,191,206,0.2)', margin: '0 auto 18px' }} />

        {toast ? (
          <div style={{ padding: '30px 10px', textAlign: 'center', fontFamily: S.serif, fontStyle: 'italic', fontSize: 19, color: S.cream }}>{toast}</div>
        ) : (
          <>
            <div style={{ fontFamily: S.serif, fontSize: 21, fontStyle: 'italic', color: S.cream, marginBottom: 18 }}>{t('core.export.title')}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Option onClick={doText} label={t('core.export.optText')} sub={t('core.export.optTextSub')} />
              {audioUrl && <Option onClick={doAudio} label={t('core.export.optAudio')} sub={t('core.export.optAudioSub')} />}
              <Option onClick={doFull} disabled={!interpBody} label={t('core.export.optFull')} sub={interpBody ? t('core.export.optFullSub') : t('core.export.optFullNone')} />
            </div>
            <button onClick={onClose} style={{ marginTop: 20, width: '100%', padding: 14, borderRadius: 999, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: S.dim, fontSize: 14, fontWeight: 500, fontFamily: S.sans }}>{t('screens.common.cancelCap')}</button>
          </>
        )}
      </div>
      <style>{`
        @keyframes exportSheetUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}
