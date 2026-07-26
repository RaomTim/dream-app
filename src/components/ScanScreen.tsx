'use client'

/**
 * ScanScreen — écran A5 « Scanner » (DREAM-MVP-SPEC-ECRANS-A-Z.md §A5).
 *
 * Rôle : photographier une page de carnet manuscrite → texte, puis remettre la
 * main au flux de vérification EXISTANT (PostDepotScreen dans src/app/mvp/page.tsx,
 * écran "postdepot" = A4). Ce composant ne fait QUE la partie caméra → lecture :
 * - succès → onDone(text, meta) ; le parent bascule vers 'postdepot' avec le
 *   texte pré-rempli (mention + question de date + boutons multi-pages vivent
 *   là-bas, sur l'écran de vérification, pas ici).
 * - échec de lecture → état interne (Réessayer / Taper le texte à la main),
 *   jamais transmis au parent tant que rien de lisible n'existe.
 *
 * Vocabulaire écran (loi §0.1) : jamais « OCR » / « reconnaissance textuelle » —
 * toujours « je lis ta page ». Zéro emoji UI — l'icône caméra est un SVG trait.
 *
 * Yeshua (Sonnet), 2026-07-11.
 */

import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

/* ───────── tokens locaux — miroir de la palette « encre vivante » de mvp/page.tsx
   (non exportée depuis page.tsx ; dupliqués ici à dessein pour garder ce fichier
   autonome et les changements sur page.tsx additifs/minimaux). ───────── */

const CameraIcon = ({ c = T.gold, s = 26 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.6A1.5 1.5 0 0 1 9.8 4.7h4.4a1.5 1.5 0 0 1 1.3.7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="3.4" stroke={c} strokeWidth="1.5" />
  </svg>
)
const BackIcon = ({ c = 'rgba(242,232,213,0.6)', s = 20 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)

/* ───────── fetch auth minimal — miroir de api() dans page.tsx, dupliqué pour
   garder ScanScreen autonome (page.tsx n'exporte pas api()). ───────── */
async function scanApi(path: string, opts: RequestInit, session: Session | null) {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    const err: any = new Error(e.error || `${res.status}`)
    err.status = res.status
    throw err
  }
  return res
}

function readFileAsBase64(file: File): Promise<{ data: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const commaIdx = result.indexOf(',')
      resolve({ data: commaIdx >= 0 ? result.slice(commaIdx + 1) : result, mime: file.type || 'image/jpeg' })
    }
    reader.onerror = () => reject(reader.error || new Error('lecture du fichier impossible'))
    reader.readAsDataURL(file)
  })
}

type Step = 'guide' | 'reading' | 'failed' | 'manual'

export default function ScanScreen({
  session,
  onBack,
  onDone,
}: {
  session: Session
  onBack: () => void
  onDone: (text: string, meta: { confidence?: 'high' | 'low'; storagePath: string | null }) => void
}) {
  const { t } = useT()
  const [step, setStep] = useState<Step>('guide')
  const [manualText, setManualText] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const aliveRef = useRef(true)

  const openCamera = () => fileRef.current?.click()

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // permet de re-choisir le même fichier au prochain essai
    if (!file) return
    setStep('reading')
    try {
      const { data, mime } = await readFileAsBase64(file)
      const res = await scanApi('/api/mvp/scan', { method: 'POST', body: JSON.stringify({ image: data, mime }) }, session)
      const j = await res.json()
      if (!aliveRef.current) return
      onDone((j.text || '').trim(), { confidence: j.confidence, storagePath: j.storage_path || null })
    } catch {
      if (!aliveRef.current) return
      setStep('failed')
    }
  }

  const submitManual = () => {
    const t = manualText.trim()
    if (t.length < 3) return
    onDone(t, { storagePath: null })
  }

  // garde contre setState après démontage (navigation pendant la lecture)
  useEffect(() => () => { aliveRef.current = false }, [])

  return (
    <div style={{ minHeight: '100dvh', position: 'relative', background: T.bg, fontFamily: T.sans, color: T.cream }}>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: 'none' }} />

      {step !== 'reading' && (
        <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20 }}>
          <button onClick={onBack} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><BackIcon /></button>
        </div>
      )}

      {step === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 100px)', padding: '0 28px', textAlign: 'center' }}>
          <div style={{ width: 210, height: 280, borderRadius: 20, border: `1.5px dashed ${T.gold}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {[['0', '0', '0 0'], ['auto', '0', '0 0'], ['0', 'auto', '0 0'], ['auto', 'auto', '0 0']].map((_, i) => {
              const corner: React.CSSProperties = { position: 'absolute', width: 22, height: 22, borderColor: T.gold }
              if (i === 0) Object.assign(corner, { top: -1, left: -1, borderTop: '2px solid', borderLeft: '2px solid', borderTopLeftRadius: 8 })
              if (i === 1) Object.assign(corner, { top: -1, right: -1, borderTop: '2px solid', borderRight: '2px solid', borderTopRightRadius: 8 })
              if (i === 2) Object.assign(corner, { bottom: -1, left: -1, borderBottom: '2px solid', borderLeft: '2px solid', borderBottomLeftRadius: 8 })
              if (i === 3) Object.assign(corner, { bottom: -1, right: -1, borderBottom: '2px solid', borderRight: '2px solid', borderBottomRightRadius: 8 })
              return <div key={i} style={corner} />
            })}
            <CameraIcon s={34} />
          </div>
          <div style={{ marginTop: 26, fontFamily: T.serif, fontSize: 24, fontStyle: 'italic', color: T.cream }}>{t('screens.scan.frameTitle')}</div>
          <div style={{ marginTop: 8, fontSize: 13.5, color: T.dim, lineHeight: 1.5 }}>{t('screens.scan.frameSub')}</div>
          <button onClick={openCamera} style={{ marginTop: 30, width: '100%', maxWidth: 320, padding: '16px 22px', borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(180deg, #f2e6c6, #d8c39a)', color: '#241a09', fontSize: 15.5, fontWeight: 600, fontFamily: T.sans, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
            <CameraIcon c="#241a09" s={19} /> {t('screens.scan.takePhoto')}
          </button>
          <button onClick={() => setStep('manual')} style={{ marginTop: 16, background: 'none', border: 'none', color: T.faint, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.scan.typeInstead')}</button>
        </div>
      )}

      {step === 'reading' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100dvh', padding: '0 28px', textAlign: 'center', animation: 'sFade .4s ease' }}>
          <CameraIcon s={40} />
          <div style={{ marginTop: 22, fontFamily: T.serif, fontSize: 22, fontStyle: 'italic', color: T.cream }}>{t('screens.scan.reading')}</div>
          <div style={{ marginTop: 8, fontSize: 13, color: T.dim }}>{t('screens.scan.readingSub')}</div>
        </div>
      )}

      {step === 'failed' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100dvh - 100px)', padding: '0 28px', textAlign: 'center' }}>
          <div style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.cream, lineHeight: 1.4 }}>{t('screens.scan.failedTitle')}</div>
          <div style={{ marginTop: 8, fontSize: 14, color: T.dim, lineHeight: 1.5 }}>{t('screens.scan.failedSub')}</div>
          <div style={{ marginTop: 26, width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={openCamera} style={{ padding: 14, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'linear-gradient(180deg, #f2e6c6, #d8c39a)', color: '#241a09', fontSize: 14.5, fontWeight: 600, fontFamily: T.sans }}>{t('screens.common.retry')}</button>
            <button onClick={() => setStep('manual')} style={{ padding: 14, borderRadius: 999, background: 'rgba(201,168,106,0.10)', border: `1px solid ${T.gold}44`, color: T.cream, fontSize: 14.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.scan.typeIt')}</button>
          </div>
        </div>
      )}

      {step === 'manual' && (
        <div style={{ padding: '20px 20px 40px' }}>
          <div style={{ fontFamily: T.serif, fontSize: 22, fontStyle: 'italic', color: T.cream, textAlign: 'center' }}>{t('screens.scan.manualTitle')}</div>
          <textarea
            autoFocus
            value={manualText}
            onChange={e => setManualText(e.target.value)}
            placeholder={t('screens.scan.manualPlaceholder')}
            style={{ marginTop: 20, width: '100%', minHeight: 240, padding: 20, borderRadius: 22, background: T.card, border: T.cardBorder, color: T.cream, fontSize: 16.5, lineHeight: 1.55, fontFamily: T.serif, fontStyle: 'italic', resize: 'vertical' }}
          />
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button onClick={() => setStep('guide')} style={{ flex: 1, padding: 14, borderRadius: 999, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: T.dim, fontSize: 14, fontWeight: 500, fontFamily: T.sans }}>{t('screens.scan.backToPhoto')}</button>
            <button onClick={submitManual} disabled={manualText.trim().length < 3} style={{ flex: 1, padding: 14, borderRadius: 999, cursor: 'pointer', border: 'none', background: 'linear-gradient(180deg, #f2e6c6, #d8c39a)', color: '#241a09', fontSize: 14.5, fontWeight: 600, fontFamily: T.sans, opacity: manualText.trim().length < 3 ? 0.45 : 1 }}>{t('screens.common.ok')}</button>
          </div>
        </div>
      )}

      <style>{`@keyframes sFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
