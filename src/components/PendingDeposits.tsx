'use client'

/**
 * PendingDeposits — l'écran de récupération (§A1 couche 4).
 * ════════════════════════════════════════════════════════════════════════════
 * Avant le 26/07, la seule trace d'un dépôt bloqué était `PendingSyncLine` :
 * un compteur non cliquable. « 1 rêve en attente de réseau » — et rien à faire.
 * Si la file butait, le rêveur regardait un chiffre.
 *
 * Ce composant REMPLACE cette ligne. Il garde exactement la même discrétion
 * (rien à l'écran quand il n'y a rien en attente), mais la ligne devient une
 * porte. Derrière : chaque dépôt, sa voix réécoutable, et trois gestes —
 * réessayer · l'écrire soi-même en écoutant · supprimer (explicitement).
 *
 * Le geste de suppression est le seul endroit de l'app où un rêve peut
 * disparaître, et il demande confirmation. Tout le reste du système préfère
 * une file qui ne se vide jamais à un rêve effacé.
 *
 * Yeshua (Opus), agent A1, 2026-07-26.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { useT } from '@/lib/i18n'
import { T, SCALE } from '@/lib/dream-design'
import {
  listPending,
  getAudioBlob,
  retryEntry,
  setEntryText,
  discardEntry,
  subscribe as subscribeQueue,
  ensurePersistentStorage,
  type PendingView,
  type StorageSafety,
} from '@/lib/offline-queue'
import { exportRecording } from '@/lib/capture-safety'

const S = T

/* ─────────── B2 2026-07-26 — libellés locaux, volontairement PAS dans i18n ───
   Trois libellés seulement, et `core.fr.json` / `core.en.json` sont des fichiers
   PARTAGÉS qu'une flotte d'agents édite en parallèle aujourd'hui. Une clé
   manquante s'affiche en clair à l'écran (`resolve()` rend la clé nue) : le
   risque d'un écran laid dépasse le bénéfice. À fondre dans le namespace
   `core.pending` au prochain passage calme sur i18n. */
const L = {
  fr: {
    export: 'sortir du téléphone',
    exporting: 'un instant…',
    exported: 'sorti — garde-le ailleurs',
    exportFailed: 'impossible ici — réécoute puis « partager »',
    fragile: "le navigateur peut effacer ce qui n'est encore que sur ce téléphone. Sors les rêves qui comptent.",
  },
  en: {
    export: 'save off the phone',
    exporting: 'one moment…',
    exported: 'saved — keep it somewhere',
    exportFailed: 'not possible here — play it, then “share”',
    fragile: 'the browser can erase what still lives only on this phone. Export the dreams that matter.',
  },
} as const

const fmtDur = (s?: number) => {
  if (!s || s <= 0) return ''
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.round(s % 60)).padStart(2, '0')}`
}
const fmtSize = (b: number) => (b > 0 ? `${(b / 1024 / 1024).toFixed(1)} Mo` : '')

/* ─────────── une carte de dépôt ─────────── */
function DepositCard({ d, onChanged }: { d: PendingView; onChanged: () => void }) {
  const { t, tp, locale } = useT()
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [writing, setWriting] = useState(false)
  const [draft, setDraft] = useState(d.text || '')
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const urlRef = useRef<string | null>(null)

  // L'objet URL est révoqué au démontage : sinon le blob reste en mémoire.
  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current) }, [])

  const listen = useCallback(async () => {
    if (audioUrl) return
    const blob = await getAudioBlob(d.id)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    urlRef.current = url
    setAudioUrl(url)
  }, [audioUrl, d.id])

  const lang = (locale === 'en' ? 'en' : 'fr') as 'fr' | 'en'
  const [exported, setExported] = useState<'idle' | 'busy' | 'ok' | 'ko'>('idle')

  // Le filet de DERNIER recours : la voix quitte l'app. Si tout casse — compte,
  // réseau, serveur, navigateur — le fichier est dans le téléphone du rêveur.
  const doExport = async () => {
    setExported('busy')
    const r = await exportRecording(d.id)
    setExported(r === 'failed' ? 'ko' : 'ok')
  }

  const doRetry = async () => { setBusy(true); await retryEntry(d.id); setBusy(false); onChanged() }
  const doSave = async () => {
    const v = draft.trim()
    if (v.length < 3) return
    setBusy(true); await setEntryText(d.id, v); setBusy(false); setWriting(false); onChanged()
  }
  const doDiscard = async () => { setBusy(true); await discardEntry(d.id); setBusy(false); onChanged() }

  const dateStr = new Date(d.createdAtISO).toLocaleDateString(locale, { day: 'numeric', month: 'long' })
  const timeStr = new Date(d.createdAtISO).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

  // L'état de la voix, dit honnêtement — c'est l'information qui compte.
  const stateLabel = !d.hasAudio && !d.audioSafeRemote
    ? t('core.pending.noAudio')
    : d.audioSafeRemote
      ? t('core.pending.audioSafe')
      : t('core.pending.audioLocal')

  return (
    <div style={{ padding: '14px 15px', borderRadius: 16, background: 'rgba(202,191,206,0.03)', border: '1px solid rgba(202,191,206,0.1)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: S.sans, fontSize: SCALE.meta, color: S.dim }}>{dateStr} · {timeStr}</span>
        {!!d.durationSec && <span style={{ fontFamily: S.mono, fontSize: SCALE.meta, color: S.faint }}>{fmtDur(d.durationSec)}</span>}
        <span style={{ flex: 1 }} />
        <span style={{ fontFamily: S.sans, fontSize: SCALE.meta, color: d.audioSafeRemote ? S.gold : S.faint }}>{stateLabel}</span>
      </div>

      <div style={{ fontFamily: S.serif, fontSize: SCALE.body, fontStyle: 'italic', color: S.ink, lineHeight: 1.45 }}>
        {d.text
          ? (d.text.length > 180 ? d.text.slice(0, 180) + '…' : d.text)
          : <span style={{ color: S.faint, fontStyle: 'normal', fontFamily: S.sans, fontSize: SCALE.small }}>{t('core.pending.untranscribed')}</span>}
      </div>

      {(d.transcribeAttempts > 0 || d.storageAttempts > 1) && (
        <div style={{ fontFamily: S.sans, fontSize: 12, color: S.faint }}>
          {tp('core.pending.attempts', Math.max(d.transcribeAttempts, d.storageAttempts), { n: Math.max(d.transcribeAttempts, d.storageAttempts) })}
          {d.audioBytes > 0 ? ` · ${fmtSize(d.audioBytes)}` : ''}
        </div>
      )}

      {/* la voix, réécoutable — la preuve, pour le rêveur, que rien n'est perdu */}
      {d.hasAudio && (
        audioUrl
          ? <audio controls src={audioUrl} style={{ width: '100%', height: 34 }} />
          : (
            <button onClick={listen} style={ghostBtn}>
              {t('core.pending.listen')}
            </button>
          )
      )}

      {writing ? (
        <>
          <textarea
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={t('core.pending.writePlaceholder')}
            style={{ width: '100%', minHeight: 130, padding: 14, borderRadius: 14, background: 'rgba(202,191,206,0.04)', border: '1px solid rgba(202,191,206,0.12)', color: S.cream, fontSize: SCALE.body, lineHeight: 1.5, fontFamily: S.serif, fontStyle: 'italic', resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setWriting(false)} style={ghostBtn}>{t('core.pending.cancel')}</button>
            <button onClick={doSave} disabled={busy || draft.trim().length < 3} style={{ ...primaryBtn, opacity: draft.trim().length < 3 ? 0.45 : 1 }}>{t('core.pending.save')}</button>
          </div>
        </>
      ) : confirming ? (
        <>
          <div style={{ fontFamily: S.sans, fontSize: SCALE.small, color: S.emberLive, lineHeight: 1.4 }}>{t('core.pending.discardConfirm')}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setConfirming(false)} style={ghostBtn}>{t('core.pending.cancel')}</button>
            <button onClick={doDiscard} disabled={busy} style={{ ...ghostBtn, color: S.emberLive, borderColor: 'rgba(216,120,60,0.4)' }}>{t('core.pending.discard')}</button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={doRetry} disabled={busy} style={primaryBtn}>{busy ? t('core.pending.retrying') : t('core.pending.retry')}</button>
          <button onClick={() => { setWriting(true); void listen() }} style={ghostBtn}>{t('core.pending.writeInstead')}</button>
          {d.hasAudio && (
            <button onClick={doExport} disabled={exported === 'busy'} style={ghostBtn}>
              {exported === 'busy' ? L[lang].exporting
                : exported === 'ok' ? L[lang].exported
                : exported === 'ko' ? L[lang].exportFailed
                : L[lang].export}
            </button>
          )}
          <span style={{ flex: 1 }} />
          <button onClick={() => setConfirming(true)} style={{ ...ghostBtn, color: S.faint, border: 'none' }}>{t('core.pending.discard')}</button>
        </div>
      )}
    </div>
  )
}

const ghostBtn: React.CSSProperties = {
  padding: '9px 14px', borderRadius: SCALE.radiusPill, background: 'transparent',
  border: '1px solid rgba(202,191,206,0.16)', color: S.dim, fontSize: 13.5,
  fontWeight: 500, fontFamily: S.sans, cursor: 'pointer', minHeight: 38,
}
const primaryBtn: React.CSSProperties = {
  padding: '9px 16px', borderRadius: SCALE.radiusPill, border: 'none',
  background: 'rgba(255,255,255,0.16)', color: S.goldLit, fontSize: 13.5,
  fontWeight: 600, fontFamily: S.sans, cursor: 'pointer', minHeight: 38,
}

/* ─────────── la ligne + la feuille ─────────── */

/**
 * Remplace `PendingSyncLine` dans page.tsx : même discrétion (rien quand la file
 * est vide), mais la ligne s'ouvre. Le compteur `getPendingCount` ignore les
 * sauvegardes préventives — ne s'affiche donc que ce qui demande vraiment de la
 * patience au rêveur.
 */
export default function PendingDeposits() {
  const { t, tp, locale } = useT()
  const [rows, setRows] = useState<PendingView[]>([])
  const [open, setOpen] = useState(false)
  const [safety, setSafety] = useState<StorageSafety | null>(null)
  const lang = (locale === 'en' ? 'en' : 'fr') as 'fr' | 'en'

  const refresh = useCallback(() => {
    listPending().then(setRows).catch(() => setRows([]))
  }, [])

  useEffect(() => {
    refresh()
    const unsub = subscribeQueue(refresh)
    const onOnline = () => refresh()
    if (typeof window !== 'undefined') window.addEventListener('online', onOnline)
    return () => { unsub(); if (typeof window !== 'undefined') window.removeEventListener('online', onOnline) }
  }, [refresh])

  // On (re)demande la persistance quand le rêveur ouvre la feuille : c'est le
  // moment où le navigateur est le plus enclin à l'accorder (interaction réelle).
  useEffect(() => { if (open) ensurePersistentStorage().then(setSafety).catch(() => {}) }, [open])

  const n = rows.length
  useEffect(() => { if (n === 0) setOpen(false) }, [n])
  if (n <= 0) return null

  return (
    <>
      <div style={{ textAlign: 'center', padding: '6px 24px 0' }}>
        <button
          onClick={() => setOpen(true)}
          style={{ background: 'none', border: 'none', padding: 6, cursor: 'pointer', fontFamily: S.sans, fontSize: 12.5, color: S.dim, lineHeight: 1.4 }}
        >
          {tp('core.offline.pending', n, { n })}
          <span style={{ color: S.gold, marginLeft: 7 }}>{t('core.offline.pendingOpen')} →</span>
        </button>
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(12,9,6,0.72)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 520, maxHeight: '86dvh', overflowY: 'auto', background: S.bgFlat, borderRadius: `${SCALE.radiusLg}px ${SCALE.radiusLg}px 0 0`, border: '1px solid rgba(255,255,255,0.16)', borderBottom: 'none', padding: '22px 18px 34px', display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ fontFamily: S.serif, fontSize: SCALE.title, fontStyle: 'italic', color: S.cream, lineHeight: 1.1 }}>{t('core.pending.title')}</div>
            <div style={{ fontFamily: S.sans, fontSize: SCALE.small, color: S.dim, lineHeight: 1.45, marginBottom: 4 }}>{t('core.pending.subtitle')}</div>

            {/* Dit seulement quand c'est vrai ET que ça concerne une voix réelle. */}
            {safety && !safety.persisted && rows.some(r => r.hasAudio && !r.audioSafeRemote) && (
              <div style={{ fontFamily: S.sans, fontSize: 12.5, color: S.emberLive, lineHeight: 1.45, opacity: 0.9 }}>
                {L[lang].fragile}
              </div>
            )}

            {rows.length === 0
              ? <div style={{ fontFamily: S.sans, fontSize: SCALE.small, color: S.faint }}>{t('core.pending.empty')}</div>
              : rows.map(d => <DepositCard key={d.id} d={d} onChanged={refresh} />)}

            <button onClick={() => setOpen(false)} style={{ ...ghostBtn, marginTop: 6, alignSelf: 'center' }}>{t('core.pending.close')}</button>
          </div>
        </div>
      )}
    </>
  )
}
