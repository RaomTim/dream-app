'use client'

/**
 * ImportHub.tsx — l'Import Hub rebranché (§12bis.G, Tim 2026-07-11).
 *
 * Ce que ça fait :
 *  - plusieurs fichiers d'un coup (audio + texte) + glisser-déposer + texte collé
 *  - gros audios : décodage natif du navigateur → ré-échantillonnage 16 kHz mono
 *    → encodage WAV linéaire → découpe en segments (repris tel quel du legacy
 *    `_legacy_v1.1/dream-screens-legacy/screens/ImportHubScreen.tsx`).
 *    Un M4A est un conteneur MP4 : on ne peut pas byte-slicer, d'où le passage par du PCM.
 *  - file de fond : le moteur vit en scope module (hors React), donc elle CONTINUE
 *    quand l'utilisateur navigue ailleurs dans l'app. Elle ne survit PAS à un
 *    rechargement de page — c'est dit à l'écran, pas caché.
 *
 * Chemin backend :
 *  - audio → /api/transcribe (gpt-4o-transcribe, champ `audio`, cap 10 Mo) pour la
 *    transcription, puis /api/mvp/import-audio pour créer le kairos + GARDER le mémo
 *    original (bucket kairos-attachments) — le mémo n'est plus jeté après lecture.
 *  - rêves collés/texte → /api/mvp/import (batch, capture_method='import_hub').
 *  - texte d'un TYPE non-rêve (récolte « autres IA » = note de jour / cœur) →
 *    /api/mvp/import-audio (accepte un `type`).
 *  Enrichissement différé par /api/mvp/enrich-batch dans tous les cas.
 *  NB : /api/dreams/import-batch et /api/dreams/import-from-storage écrivent dans
 *  la table LEGACY `dreams`, invisible de la MVP → volontairement pas utilisées ici.
 *
 * §12ter.E (braindump Tim juillet) — « Dream = hub qui aspire le matériau intérieur,
 * pas un silo » : deux portes (mémos vocaux · récolte depuis les autres IA) + collage.
 *
 * Yeshua (Opus), 2026-07-11 · rebranché Import Hub+ 2026-07-23.
 */

import { useRef, useState, useSyncExternalStore } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'
/* A1 2026-07-26 — `splitAudio` / `encodeWav` / `CHUNK_BYTES` vivent désormais dans
   `@/lib/audio-split` (extraction TELLE QUELLE, zéro changement de comportement).
   La capture live en avait besoin aussi : le rêve dit au réveil ne bénéficiait
   d'AUCUNE de ces protections, d'où la perte du 26/07. */
import { splitAudio, CHUNK_BYTES } from '@/lib/audio-split'

/* ───────── tokens locaux — miroir « encre vivante » de mvp/page.tsx (non exportés là-bas) ───────── */
const RED = T.emberLive

const AUDIO_EXT = ['.m4a', '.mp3', '.wav', '.webm', '.ogg', '.mp4']
const TEXT_EXT = ['.txt', '.md']
const ACCEPTED = [...AUDIO_EXT, ...TEXT_EXT].join(',')

/* CHUNK_BYTES (3,6 Mo/segment) est importé de `@/lib/audio-split` — voir l'en-tête. */
/* file SÉQUENTIELLE douce : un mémo à la fois (§12ter.E). On n'assaille pas le
   téléphone ni l'API — la progression « 3/12 » se lit posément. */
const MAX_PARALLEL = 1

/* plafond du mémo GARDÉ en pièce jointe. Au-delà : on transcrit quand même
   (découpe locale), mais on ne conserve pas l'original — message doux à l'écran. */
const KEEP_AUDIO_CAP = 25 * 1024 * 1024

/* les types de dépôt proposés à l'import (sous-ensemble de la whitelist serveur).
   « rêve » par défaut ; « note de jour » = la voix du cœur / matériau de jour. */
export type ImportType = 'reve' | 'note_jour' | 'signe'

/* ═════════ WAV + découpe — déplacés dans `@/lib/audio-split.ts` (A1, 2026-07-26) ═════════
   `writeString` / `encodeWav` / `splitAudio` ont été extraits SANS changement de
   comportement (mono, 16 kHz, segments de 3,6 Mo) pour que la capture live puisse
   s'en servir elle aussi. Le comportement de l'import est strictement identique. */

/* ═════════ utilitaires ═════════ */

const extOf = (name: string) => '.' + (name.split('.').pop() || '').toLowerCase()
const isAudio = (f: File) => AUDIO_EXT.includes(extOf(f.name))
const isText = (f: File) => TEXT_EXT.includes(extOf(f.name))

/** Sépare un texte en rêves : ligne `---` / `***` / deux lignes vides. */
export function segmentDreams(text: string): string[] {
  return text
    .split(/\n\s*(?:---+|===+|\*\*\*+)\s*\n|\n\s*\n\s*\n/)
    .map(b => b.trim())
    .filter(b => b.length >= 10)
}

/** Date approximative depuis le nom de fichier (2024-03-15, 20240315, MyRec_0315_0620…). */
function dateFromFilename(filename: string): string | undefined {
  const iso = filename.match(/(\d{4})[-_](\d{2})[-_](\d{2})/)
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  const compact = filename.match(/(\d{4})(\d{2})(\d{2})/)
  if (compact && +compact[1] > 2000 && +compact[1] < 2100) {
    const d = new Date(`${compact[1]}-${compact[2]}-${compact[3]}T06:00:00Z`)
    if (!isNaN(d.getTime())) return d.toISOString()
  }
  return undefined
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

/** Une seule reprise, sur les pannes réseau / serveur surchargé. */
async function withRetry<R>(fn: () => Promise<R>): Promise<R> {
  try {
    return await fn()
  } catch (e: any) {
    const msg = String(e?.message || '')
    const retryable = /fetch|network|réseau|timeout|429|500|502|503|504/i.test(msg)
    if (!retryable) throw e
    await sleep(1600)
    return await fn()
  }
}

/* ═════════ la file — moteur en scope module (survit à la navigation entre écrans) ═════════ */

export type QueueStatus = 'queued' | 'reading' | 'splitting' | 'listening' | 'saving' | 'done' | 'error'

export type QueueItem = {
  id: string
  name: string
  kind: 'audio' | 'text' | 'paste'
  status: QueueStatus
  part?: number
  parts?: number
  count?: number   // nombre de rêves gardés
  error?: string
}

type Job = { id: string; file?: File; text?: string; token: string; kind_type: ImportType; gdate?: string }

let ITEMS: QueueItem[] = []
const JOBS = new Map<string, Job>()
const LISTENERS = new Set<() => void>()
let ACTIVE = 0
let SEQ = 0

function emit() {
  ITEMS = [...ITEMS]
  LISTENERS.forEach(l => l())
}
function subscribe(l: () => void) {
  LISTENERS.add(l)
  return () => { LISTENERS.delete(l) }
}
const getSnapshot = () => ITEMS
const getServerSnapshot = () => ITEMS

function patch(id: string, p: Partial<QueueItem>) {
  ITEMS = ITEMS.map(i => (i.id === id ? { ...i, ...p } : i))
  LISTENERS.forEach(l => l())
}

/** Le hook public : la file, vue de n'importe quel écran. */
export function useImportQueue(): QueueItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function clearFinishedImports() {
  ITEMS = ITEMS.filter(i => i.status !== 'done' && i.status !== 'error')
  emit()
}

/* ─── appels serveur ─── */

async function saveDreams(dreams: Array<{ text: string; date?: string }>, token: string): Promise<number> {
  let total = 0
  for (let i = 0; i < dreams.length; i += 50) {
    const res = await fetch('/api/mvp/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ dreams: dreams.slice(i, i + 50) }),
    })
    if (!res.ok) {
      const e = await res.json().catch(() => ({} as any))
      throw new Error(e.error || `${res.status}`)
    }
    total += (await res.json()).imported || 0
  }
  return total
}

/** Un bloc de texte d'un TYPE non-rêve (récolte « autres IA ») → un kairos. */
async function saveTyped(text: string, type: ImportType, date: string | undefined, token: string): Promise<number> {
  const res = await fetch('/api/mvp/import-audio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text, type, date }),
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({} as any))
    throw new Error(e.error || `${res.status}`)
  }
  return (await res.json()).imported || 0
}

/** Sauve les blocs de texte selon leur type : rêve → batch ; autre → un par un. */
async function persistBlocks(blocks: string[], type: ImportType, date: string | undefined, token: string): Promise<number> {
  if (type === 'reve') {
    return saveDreams(blocks.map(t => ({ text: t, date })), token)
  }
  let total = 0
  for (const b of blocks) total += await withRetry(() => saveTyped(b, type, date, token))
  return total
}

/** Crée le kairos audio ET garde le mémo original en pièce jointe (best-effort côté serveur). */
async function saveAudioKairos(file: File, text: string, type: ImportType, date: string | undefined, token: string): Promise<number> {
  const fd = new FormData()
  fd.append('text', text)
  fd.append('type', type)
  if (date) fd.append('date', date)
  // on ne joint l'original que s'il tient sous le plafond — sinon le mémo est transcrit
  // mais pas conservé (le client l'a déjà signalé doucement).
  if (file.size <= KEEP_AUDIO_CAP) fd.append('audio', file)
  const res = await fetch('/api/mvp/import-audio', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({} as any))
    throw new Error(e.error || `${res.status}`)
  }
  return (await res.json()).imported || 0
}

async function transcribe(blob: Blob, name: string, token: string): Promise<string> {
  const fd = new FormData()
  fd.append('audio', new File([blob], name, { type: blob.type || 'audio/wav' }))
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  })
  if (!res.ok) {
    const e = await res.json().catch(() => ({} as any))
    throw new Error(e.error || `${res.status}`)
  }
  const { text } = await res.json()
  return typeof text === 'string' ? text : ''
}

/* ─── le moteur ─── */

async function runJob(id: string) {
  const job = JOBS.get(id)
  const item = ITEMS.find(i => i.id === id)
  if (!job || !item) return

  try {
    // texte collé (ou contenu déjà lu)
    if (job.text != null) {
      const blocks = segmentDreams(job.text)
      if (!blocks.length) throw new Error('screens.import.err.nothingHere')
      patch(id, { status: 'saving' })
      const n = await persistBlocks(blocks, job.kind_type, job.gdate, job.token)
      patch(id, { status: 'done', count: n })
      return
    }

    const file = job.file!

    // fichier texte
    if (isText(file)) {
      patch(id, { status: 'reading' })
      const raw = await file.text()
      const blocks = segmentDreams(raw)
      if (!blocks.length) throw new Error('screens.import.err.nothingInFile')
      const date = dateFromFilename(file.name) || job.gdate
      patch(id, { status: 'saving' })
      const n = await persistBlocks(blocks, job.kind_type, date, job.token)
      patch(id, { status: 'done', count: n })
      return
    }

    // audio : découpe → écoute segment par segment → un seul rêve
    patch(id, { status: 'splitting' })
    let parts: Blob[]
    try {
      parts = await splitAudio(file)
    } catch {
      if (file.size <= CHUNK_BYTES) parts = [file] // audio exotique mais léger : on tente tel quel
      else throw new Error('screens.import.err.unreadableAudio')
    }

    const base = file.name.replace(/\.[^.]+$/, '')
    const heard: string[] = []
    for (let i = 0; i < parts.length; i++) {
      patch(id, { status: 'listening', part: i + 1, parts: parts.length })
      const name = parts.length > 1 ? `${base}_${i + 1}.wav` : `${base}.wav`
      const text = await withRetry(() => transcribe(parts[i], name, job.token))
      if (text && text.trim()) heard.push(text.trim())
    }

    const full = heard.join('\n\n').trim()
    if (full.length < 10) throw new Error('screens.import.err.nothingHeard')

    // on garde le mémo ORIGINAL en pièce jointe (§12ter.E) + on crée le kairos du type choisi
    patch(id, { status: 'saving' })
    const date = dateFromFilename(file.name) || job.gdate
    const n = await withRetry(() => saveAudioKairos(file, full, job.kind_type, date, job.token))
    patch(id, { status: 'done', count: n })
  } catch (e: any) {
    // le moteur vit hors React : on garde une CLÉ (ou le message brut du serveur), traduite au rendu.
    patch(id, { status: 'error', error: String(e?.message || 'screens.import.err.generic') })
  } finally {
    JOBS.delete(id)
  }
}

function pump() {
  while (ACTIVE < MAX_PARALLEL) {
    const next = ITEMS.find(i => i.status === 'queued')
    if (!next) return
    patch(next.id, { status: 'reading' })
    ACTIVE++
    runJob(next.id).finally(() => {
      ACTIVE--
      pump()
    })
  }
}

function enqueue(item: Omit<QueueItem, 'status'>, job: Omit<Job, 'id'>) {
  JOBS.set(item.id, { id: item.id, ...job })
  ITEMS = [...ITEMS, { ...item, status: 'queued' }]
  LISTENERS.forEach(l => l())
}

/** Point d'entrée : jette des fichiers et/ou du texte collé dans la file. */
export function startImport(files: File[], pasted: string, token: string, opts: { type: ImportType; gdate?: string }) {
  const { type, gdate } = opts
  for (const f of files) {
    const id = `f${++SEQ}`
    enqueue({ id, name: f.name, kind: isAudio(f) ? 'audio' : 'text' }, { file: f, token, kind_type: type, gdate })
  }
  if (pasted.trim().length >= 10) {
    const id = `p${++SEQ}`
    // le nom du lot collé n'est pas un nom de fichier : il est rendu depuis la clé (kind === 'paste')
    enqueue({ id, name: '', kind: 'paste' }, { text: pasted, token, kind_type: type, gdate })
  }
  pump()
}

/* ═════════ UI ═════════ */

/* Le moteur est hors React : il ne stocke que des CLÉS. Tout se résout au rendu. */
const STATUS_KEY: Record<QueueStatus, string> = {
  queued: 'screens.import.status.queued',
  reading: 'screens.import.status.reading',
  splitting: 'screens.import.status.splitting',
  listening: 'screens.import.status.listening',
  saving: 'screens.import.status.saving',
  done: 'screens.import.status.done',
  error: '',
}

const Spark = ({ c = T.gold, s = 13 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="8" stroke={c} strokeWidth="1.3" opacity="0.7" />
    <circle cx="12" cy="12" r="2.2" fill={c} />
  </svg>
)

/* ─── petites icônes (lignes fines, jamais criardes) ─── */
const IconMic = ({ c = T.gold, s = 22 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="3" width="6" height="11" rx="3" stroke={c} strokeWidth="1.4" />
    <path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)
const IconHarvest = ({ c = T.gold, s = 22 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M12 3l1.6 4.2L18 8.8l-3.4 2.6L15.4 16 12 13.4 8.6 16l.8-4.6L6 8.8l4.4-1.6L12 3z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" />
    <circle cx="18.5" cy="18.5" r="1.4" fill={c} opacity="0.8" />
    <circle cx="5.5" cy="17.5" r="1" fill={c} opacity="0.6" />
  </svg>
)
const IconBack = ({ c = T.dim, s = 18 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
const IconCopy = ({ c = T.gold, s = 15 }: { c?: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <rect x="9" y="9" width="11" height="11" rx="2.4" stroke={c} strokeWidth="1.4" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

/* ─── sélecteur de type de dépôt (« c'était… ») ─── */
const IMPORT_TYPES: ImportType[] = ['reve', 'note_jour', 'signe']
function TypeChips({ value, onChange }: { value: ImportType; onChange: (t: ImportType) => void }) {
  const { t } = useT()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {IMPORT_TYPES.map(kt => {
        const on = kt === value
        return (
          <button
            key={kt} onClick={() => onChange(kt)}
            style={{
              padding: '8px 15px', borderRadius: 999, cursor: 'pointer',
              fontFamily: T.sans, fontSize: 13, fontWeight: on ? 600 : 500,
              background: on ? 'rgba(201,168,106,0.14)' : 'rgba(201,168,106,0.04)',
              border: on ? `1px solid ${T.gold}77` : '0.5px solid rgba(201,168,106,0.16)',
              color: on ? T.cream : T.dim, transition: 'all .2s ease',
            }}
          >{t(`screens.import.type.${kt}`)}</button>
        )
      })}
    </div>
  )
}

/* ─── la file, avec la progression globale « 3/12 — … » (§12ter.E) ─── */
function QueueRow({ i }: { i: QueueItem }) {
  const { t, tp } = useT()
  const live = i.status !== 'done' && i.status !== 'error'
  const color = i.status === 'error' ? RED : i.status === 'done' ? T.gold : T.dim

  // erreur : `i.error` est soit une de nos clés, soit un message brut du serveur.
  // t() rend la traduction si la clé existe, et la chaîne telle quelle sinon.
  const statusText = (() => {
    if (i.status === 'listening' && i.parts && i.parts > 1) return t('screens.import.status.listeningPart', { part: i.part ?? 1, parts: i.parts })
    if (i.status === 'done') {
      const n = i.count ?? 0
      return n > 1 ? tp('screens.import.status.savedCount', n) : t('screens.import.status.done')
    }
    if (i.status === 'error') return t(i.error || 'screens.import.err.generic')
    return t(STATUS_KEY[i.status])
  })()

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 0', borderBottom: '0.5px solid rgba(242,232,213,0.08)' }}>
      <span style={{ marginTop: 2, flexShrink: 0, opacity: live ? 1 : 0.55, animation: live ? 'lBlink 1.6s ease-in-out infinite' : undefined }}>
        <Spark c={i.status === 'error' ? RED : T.goldLit} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.sans, fontSize: 13.5, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.kind === 'paste' ? t('screens.import.pastedName') : i.name}</div>
        <div style={{ marginTop: 3, fontFamily: T.sans, fontSize: 12, color, lineHeight: 1.4 }}>{statusText}</div>
      </div>
    </div>
  )
}

function QueuePanel() {
  const { t } = useT()
  const queue = useImportQueue()
  if (queue.length === 0) return null

  const working = queue.some(i => i.status !== 'done' && i.status !== 'error')
  const finished = queue.filter(i => i.status === 'done' || i.status === 'error').length
  const current = queue.find(i => i.status !== 'done' && i.status !== 'error')
  const currentName = current ? (current.kind === 'paste' ? t('screens.import.pastedName') : current.name) : ''

  return (
    <div style={{ margin: '26px 18px 0', padding: '4px 18px 16px', borderRadius: 22, background: 'rgba(201,168,106,0.04)', border: T.cardBorder }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 14 }}>
        <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream }}>
          {working ? t('screens.import.working') : t('screens.import.workingDone')}
        </div>
        {finished > 0 && !working && (
          <button onClick={clearFinishedImports} style={{ background: 'none', border: 'none', color: T.gold, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: T.sans, padding: 0 }}>
            {t('screens.import.clearList')}
          </button>
        )}
      </div>

      {/* progression globale « 3/12 — Le rêve du bateau… » */}
      {working && current && (
        <div style={{ marginTop: 6, fontFamily: T.sans, fontSize: 13, color: T.gold }}>
          {t('screens.import.progress', { n: finished + 1, total: queue.length })}
          {currentName ? ` — ${currentName}` : ''}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        {queue.map(i => <QueueRow key={i.id} i={i} />)}
      </div>

      <div style={{ marginTop: 14, fontFamily: T.sans, fontSize: 12, color: T.faint, lineHeight: 1.45 }}>
        {working ? t('screens.import.footerWorking') : t('screens.import.footerDone')}
      </div>
    </div>
  )
}

/* ─── PORTE 1 — Mes mémos vocaux (audio + carnets) ─── */
function AudioDoor({ session, onBack }: { session: Session; onBack: () => void }) {
  const { t, tp } = useT()
  const [files, setFiles] = useState<File[]>([])
  const [over, setOver] = useState(false)
  const [note, setNote] = useState('')
  const [type, setType] = useState<ImportType>('reve')
  const [when, setWhen] = useState('') // 'YYYY-MM-DD' ou ''
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | File[]) => {
    const keep = Array.from(list).filter(f => AUDIO_EXT.includes(extOf(f.name)) || TEXT_EXT.includes(extOf(f.name)))
    const skipped = Array.from(list).length - keep.length
    setNote(skipped > 0 ? tp('screens.import.skipped', skipped) : '')
    setFiles(prev => [...prev, ...keep])
  }

  const ready = files.length > 0
  const go = () => {
    const token = session?.access_token
    if (!token || !ready) return
    startImport(files, '', token, { type, gdate: when || undefined })
    setFiles([]); setNote('')
  }

  const audioCount = files.filter(isAudio).length
  const bigCount = files.filter(f => isAudio(f) && f.size > CHUNK_BYTES).length
  const overCapCount = files.filter(f => isAudio(f) && f.size > KEEP_AUDIO_CAP).length

  return (
    <div style={{ animation: 'lFadeUp .35s ease' }}>
      <DoorHeader title={t('screens.import.doors.audioTitle')} onBack={onBack} />

      <div style={{ margin: '0 18px' }}>
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setOver(true) }}
          onDragLeave={() => setOver(false)}
          onDrop={e => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files) }}
          style={{
            padding: '26px 20px', borderRadius: 22, cursor: 'pointer', textAlign: 'center',
            background: over ? 'rgba(201,168,106,0.10)' : T.card,
            border: over ? `1px dashed ${T.gold}88` : '0.5px dashed rgba(201,168,106,0.28)',
            transition: 'all .25s ease',
          }}
        >
          <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: over ? T.cream : T.ink, lineHeight: 1.35 }}>
            {over ? t('screens.import.dropOver') : t('screens.import.dropIdle')}
          </div>
          <div style={{ marginTop: 7, fontFamily: T.sans, fontSize: 12.5, color: T.dim }}>{t('screens.import.dropSub')}</div>
          <div style={{ marginTop: 5, fontFamily: T.sans, fontSize: 11.5, color: T.faint }}>{t('screens.import.dropFormats')}</div>
        </div>
        <input ref={inputRef} type="file" accept={ACCEPTED} multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files) addFiles(e.target.files); e.target.value = '' }} />

        {note && <div style={{ marginTop: 8, fontSize: 12, color: T.faint, fontFamily: T.sans }}>{note}</div>}

        {files.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.dim }}>
              {tp('screens.import.filesCount', files.length)}{audioCount > 0 ? t('screens.import.toListen', { n: audioCount }) : ''}
            </div>
            {bigCount > 0 && (
              <div style={{ marginTop: 4, fontFamily: T.sans, fontSize: 12, color: T.faint, lineHeight: 1.4 }}>
                {bigCount > 1 ? t('screens.import.bigMany') : t('screens.import.bigOne')}
              </div>
            )}
            {overCapCount > 0 && (
              <div style={{ marginTop: 4, fontFamily: T.sans, fontSize: 12, color: T.faint, lineHeight: 1.4 }}>
                {overCapCount > 1 ? t('screens.import.tooBigMany') : t('screens.import.tooBigOne')}
              </div>
            )}
            <div style={{ marginTop: 8, maxHeight: 190, overflowY: 'auto' }}>
              {files.map((f, idx) => (
                <div key={`${f.name}-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '0.5px solid rgba(242,232,213,0.08)' }}>
                  <span style={{ flex: 1, minWidth: 0, fontFamily: T.sans, fontSize: 13, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <span style={{ flexShrink: 0, fontFamily: T.sans, fontSize: 11.5, color: T.faint }}>
                    {f.size > 1024 * 1024
                      ? t('screens.import.mb', { n: Math.round(f.size / 1024 / 1024) })
                      : t('screens.import.kb', { n: Math.max(1, Math.round(f.size / 1024)) })}
                  </span>
                  <button onClick={e => { e.stopPropagation(); setFiles(prev => prev.filter((_, i) => i !== idx)) }}
                    aria-label={t('screens.import.removeFile', { name: f.name })}
                    style={{ flexShrink: 0, background: 'none', border: 'none', color: T.faint, fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '2px 3px' }}>×</button>
                </div>
              ))}
            </div>

            {/* c'était… (type) */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.dim, marginBottom: 9 }}>{t('screens.import.type.q')}</div>
              <TypeChips value={type} onChange={setType} />
            </div>

            {/* à peu près quand ? (date de repli si les fichiers n'en portent pas) */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.dim, marginBottom: 4 }}>{t('screens.import.when.label')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="date" value={when} max={new Date().toISOString().slice(0, 10)} onChange={e => setWhen(e.target.value)}
                  style={{ padding: '9px 13px', borderRadius: 12, background: T.card, border: T.cardBorder, color: T.gold, fontSize: 15, fontFamily: 'ui-monospace, monospace' }} />
                {when && (
                  <button onClick={() => setWhen('')} style={{ background: 'none', border: 'none', color: T.faint, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.import.when.clear')}</button>
                )}
              </div>
              <div style={{ marginTop: 6, fontFamily: T.sans, fontSize: 11.5, color: T.faint, lineHeight: 1.4 }}>{t('screens.import.when.hint')}</div>
            </div>

            <button onClick={go} disabled={!ready}
              style={{
                marginTop: 18, width: '100%', padding: 15, borderRadius: 999, border: 'none', cursor: ready ? 'pointer' : 'default',
                background: ready ? 'linear-gradient(180deg, #fbeeda, #ecd4b4)' : 'rgba(242,232,213,0.08)',
                color: ready ? '#2a160e' : T.faint, fontFamily: T.sans, fontSize: 15, fontWeight: 600, transition: 'all .25s ease',
              }}>
              {t('screens.import.cta')}
            </button>
          </div>
        )}
      </div>

      <QueuePanel />
    </div>
  )
}

/* ─── PORTE 2 — Récolter depuis tes autres IA (prompts prêts à copier) ─── */
type PromptCard = { title: string; prompt: string }
function HarvestDoor({ onBack, onGoPaste }: { onBack: () => void; onGoPaste: () => void }) {
  const { t, tRaw } = useT()
  const [copied, setCopied] = useState<number | null>(null)
  const raw = tRaw('screens.import.harvest.prompts')
  const prompts: PromptCard[] = Array.isArray(raw) ? raw : []

  const copy = async (p: string, idx: number) => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(p)
      else {
        const ta = document.createElement('textarea')
        ta.value = p; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta)
      }
      setCopied(idx)
      setTimeout(() => setCopied(c => (c === idx ? null : c)), 2000)
    } catch { /* silencieux : l'utilisateur peut sélectionner à la main */ }
  }

  return (
    <div style={{ animation: 'lFadeUp .35s ease' }}>
      <DoorHeader title={t('screens.import.doors.harvestTitle')} onBack={onBack} />

      <div style={{ margin: '0 22px 4px', fontFamily: T.sans, fontSize: 13.5, color: T.dim, lineHeight: 1.5 }}>
        {t('screens.import.harvest.intro')}
      </div>

      <div style={{ margin: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {prompts.map((p, idx) => (
          <div key={idx} style={{ padding: 16, borderRadius: 20, background: T.card, border: T.cardBorder }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.cream, lineHeight: 1.3 }}>{p.title}</div>
              <button onClick={() => copy(p.prompt, idx)}
                style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
                  background: copied === idx ? 'rgba(201,168,106,0.18)' : 'rgba(201,168,106,0.08)', border: `1px solid ${T.gold}55`,
                  color: copied === idx ? T.cream : T.gold, fontFamily: T.sans, fontSize: 12.5, fontWeight: 600 }}>
                {copied === idx ? t('screens.import.harvest.copied') : <><IconCopy /> {t('screens.import.harvest.copy')}</>}
              </button>
            </div>
            <div style={{ marginTop: 10, fontFamily: T.sans, fontSize: 13, color: T.ink, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{p.prompt}</div>
          </div>
        ))}
      </div>

      <div style={{ margin: '20px 22px 0', fontFamily: T.sans, fontSize: 12.5, color: T.faint, lineHeight: 1.5 }}>
        {t('screens.import.harvest.pasteHint')}
      </div>
      <div style={{ margin: '14px 18px 0' }}>
        <button onClick={onGoPaste}
          style={{ width: '100%', padding: 14, borderRadius: 999, cursor: 'pointer', background: 'rgba(201,168,106,0.10)', border: `1px solid ${T.gold}55`, color: T.cream, fontFamily: T.sans, fontSize: 14.5, fontWeight: 600 }}>
          {t('screens.import.harvest.goPaste')}
        </button>
      </div>

      <QueuePanel />
    </div>
  )
}

/* ─── en-tête de porte (retour + titre) ─── */
function DoorHeader({ title, onBack }: { title: string; onBack: () => void }) {
  const { t } = useT()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 18px 16px' }}>
      <button onClick={onBack} aria-label={t('screens.import.back')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: T.dim, cursor: 'pointer', fontFamily: T.sans, fontSize: 13, padding: '4px 2px' }}>
        <IconBack /> {t('screens.import.back')}
      </button>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.cream }}>{title}</div>
    </div>
  )
}

/* ─── carte de porte (l'entrée du hub) ─── */
function DoorCard({ icon, title, sub, onClick }: { icon: React.ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '17px 18px', borderRadius: 20, background: T.card, border: T.cardBorder, cursor: 'pointer', textAlign: 'left', transition: 'all .2s ease' }}>
      <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,106,0.08)', border: `0.5px solid ${T.gold}33` }}>{icon}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: T.serif, fontSize: 19, fontStyle: 'italic', color: T.cream, lineHeight: 1.25 }}>{title}</span>
        <span style={{ display: 'block', marginTop: 3, fontFamily: T.sans, fontSize: 12.5, color: T.dim, lineHeight: 1.4 }}>{sub}</span>
      </span>
    </button>
  )
}

/* ═════════ le HUB — deux portes + collage direct ═════════ */
type View = 'home' | 'audio' | 'harvest'

export default function ImportHub({ session }: { session: Session }) {
  const { t, tp } = useT()
  const [view, setView] = useState<View>('home')
  const [text, setText] = useState('')
  const [pasteType, setPasteType] = useState<ImportType>('reve')
  const pasteRef = useRef<HTMLTextAreaElement>(null)

  const blocks = segmentDreams(text)
  const ready = blocks.length > 0

  const go = () => {
    const token = session?.access_token
    if (!token || !ready) return
    startImport([], text, token, { type: pasteType })
    setText('')
  }

  const goPasteFromHarvest = () => {
    setView('home')
    setPasteType('note_jour')
    setTimeout(() => { pasteRef.current?.focus(); pasteRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 60)
  }

  if (view === 'audio') return <AudioDoor session={session} onBack={() => setView('home')} />
  if (view === 'harvest') return <HarvestDoor onBack={() => setView('home')} onGoPaste={goPasteFromHarvest} />

  return (
    <div>
      {/* les deux portes */}
      <div style={{ margin: '0 18px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <DoorCard icon={<IconMic />} title={t('screens.import.doors.audioTitle')} sub={t('screens.import.doors.audioSub')} onClick={() => setView('audio')} />
        <DoorCard icon={<IconHarvest />} title={t('screens.import.doors.harvestTitle')} sub={t('screens.import.doors.harvestSub')} onClick={() => setView('harvest')} />
      </div>

      {/* collage direct (l'existant, gardé) */}
      <div style={{ margin: '24px 24px 0', fontSize: 13.5, color: T.dim, lineHeight: 1.5 }}>
        {t('screens.import.pasteHelp1')}{' '}
        <span style={{ color: T.gold, fontFamily: 'ui-monospace, monospace' }}>---</span> {t('screens.import.pasteHelp2')}
      </div>
      <div style={{ margin: '14px 18px 0' }}>
        <textarea
          ref={pasteRef}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={t('screens.import.pastePlaceholder')}
          style={{
            width: '100%', minHeight: 200, padding: 18, borderRadius: 22,
            background: T.card, border: T.cardBorder, color: T.cream,
            fontSize: 15, lineHeight: 1.5, fontFamily: T.serif, fontStyle: 'italic', resize: 'vertical',
          }}
        />

        {/* ce que tu colles, c'est… */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: T.sans, fontSize: 12.5, color: T.dim, marginBottom: 9 }}>{t('screens.import.pasteAs')}</div>
          <TypeChips value={pasteType} onChange={setPasteType} />
        </div>

        <div style={{ marginTop: 12, fontSize: 12.5, color: T.faint, textAlign: 'center', fontFamily: T.sans }}>
          {blocks.length > 0 ? tp('screens.import.detected', blocks.length) : t('screens.import.nothingYet')}
        </div>

        <button
          onClick={go}
          disabled={!ready}
          style={{
            marginTop: 12, width: '100%', padding: 15, borderRadius: 999, border: 'none',
            cursor: ready ? 'pointer' : 'default',
            background: ready ? 'linear-gradient(180deg, #fbeeda, #ecd4b4)' : 'rgba(242,232,213,0.08)',
            color: ready ? '#2a160e' : T.faint,
            fontFamily: T.sans, fontSize: 15, fontWeight: 600,
            transition: 'all .25s ease',
          }}
        >
          {t('screens.import.cta')}
        </button>
      </div>

      <QueuePanel />
    </div>
  )
}
