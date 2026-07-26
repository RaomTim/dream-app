/**
 * OFFLINE-FIRST — file d'attente des dépôts (§0.3 · §10 A3 · chantier C « ABSOLUMENT » Tim).
 * ────────────────────────────────────────────────────────────────────────────
 * LE cas sacré : 3 h du matin, mode avion, un rêve qui s'évapore. La capture doit
 * réussir SANS réseau, et le dépôt (texte éventuel + blob audio + type + marqueurs
 * + horodatages) doit survivre à la fermeture de l'app, puis partir tout seul dès
 * que le réseau revient. ZÉRO perte.
 *
 * ══ RÉVISION A1 — 2026-07-26, après la perte d'un rêve de 8 min ══════════════
 * Trois défauts structurels ont été corrigés ici. Ils sont écrits en clair pour
 * qu'on ne les réintroduise jamais.
 *
 * 1. ON NE DISTINGUE PLUS « panne réseau » et « panne serveur ».
 *    L'ancienne version ne mettait le rêve à l'abri que si `e instanceof TypeError`
 *    (rejet de `fetch`). Un 413/500/504 lève un `Error` ordinaire → le filet ne
 *    se déclenchait JAMAIS sur panne serveur. Or c'est exactement ce qui est
 *    arrivé : Vercel a renvoyé 413 (corps > 4,5 Mo) et le blob est parti au GC.
 *    Désormais : **toute exception mène à la file.** `isNetworkError` ne sert
 *    plus qu'à décider s'il faut ARRÊTER la boucle de flush — jamais à décider
 *    si l'on conserve un audio.
 *
 * 2. `entry.audioBlob = null` NE PEUT PLUS ARRIVER SANS PREUVE.
 *    L'ancienne version effaçait la seule copie de l'audio sur un simple 413 ou
 *    400 (l.332-337). La preuve, maintenant, est `entry.storagePath` : un chemin
 *    Storage rendu par le serveur. Un code HTTP ne prouve rien ; un chemin, si.
 *    Tant que `storagePath` est nul, le blob RESTE, indéfiniment, quitte à ce que
 *    la file ne se vide jamais. Une file qui ne se vide pas est un problème.
 *    Un rêve effacé n'en est plus un.
 *
 * 3. L'AUDIO PART EN STORAGE AVANT LA TRANSCRIPTION.
 *    Vercel refuse tout corps > 4,5 Mo. On ne fait donc plus transiter le blob
 *    par une route Vercel : upload client → Supabase Storage direct via URL
 *    signée, puis transcription à partir du chemin (corps de 200 octets).
 *
 * Persistance : IndexedDB (les Blobs audio y sont stockés tels quels, contrairement
 * à localStorage). Un seul object store `deposits`, clé = `id` (= client_dedup_id).
 *
 * Pipeline par dépôt (idempotent, REPRENABLE là où ça a lâché) :
 *   A. storage    — audio pas encore en Storage → signed-upload + PUT direct
 *   B. transcribe — pas de texte → /api/transcribe-from-storage (ou /api/transcribe
 *                   si l'audio est petit et que le Storage a échoué)
 *   C. kairos     — pas encore de kairosId → POST /api/kairos (client_dedup_id)
 *   D. rattache   — PATCH /api/kairos/audio/signed-upload (audio ↔ rêve)
 *   → dépôt complet → purge.
 * Comme chaque étape persiste son résultat, un ré-essai ne rejoue jamais ce qui a
 * réussi (pas de doublon). Le serveur dé-double aussi sur client_dedup_id.
 *
 * FILET DE DERNIER RECOURS : `entry.id` == `client_dedup_id` (kairos) ==
 * `local_id` (capture_audio). Même si le rattachement D n'a jamais lieu, un
 * script serveur peut recoller audio et rêve sur cette seule clé.
 *
 * Réseau : on passe par `authFetch` (Bearer + X-Dream-Lang injectés). getSession()
 * lit la session Supabase persistée → fonctionne hors-ligne (session en cache).
 * Exception : le PUT vers l'URL signée Storage se fait en `fetch` NU — cette URL
 * porte son propre jeton, y ajouter un Bearer applicatif la ferait échouer.
 *
 * Yeshua (Opus), 2026-07-22 · durci par l'agent A1, 2026-07-26.
 */
import { authFetch } from '@/lib/api-client'

/* ─────────── modèle ─────────── */
export type QueueKind = 'dream' | 'day'

export interface QueueEntry {
  /** client_dedup_id — clé d'idempotence, voyage jusqu'au serveur (kairos ET capture_audio). */
  id: string
  kind: QueueKind
  /** texte du rêve. null tant que la transcription n'a pas eu lieu (capture voix hors-ligne). */
  text: string | null
  /** repli de texte si la transcription rend du vide (le rêve — l'audio — n'est jamais perdu pour autant). */
  fallbackText: string
  /** blob audio d'origine (mémo vocal). null pour un dépôt écrit. */
  audioBlob: Blob | null
  mime: string
  kairosType: string
  captureMethod: string
  markNuminous?: boolean
  /** date de dépôt réelle (l'instant où le rêveur a parlé, pas l'instant du sync). */
  createdAtISO: string
  /** override explicite de created_at (scanner « choisir une date »). */
  createdAtOverride?: string | null
  nightGroupId?: string | null
  markers?: number[]
  durationSec?: number
  attachmentStoragePaths?: string[]
  /** rempli une fois le POST kairos réussi → l'étape n'est jamais rejouée. */
  kairosId: string | null
  /** true une fois l'audio réglé (rattaché au rêve, ou absent dès le départ). */
  audioDone: boolean

  /* ── A1 2026-07-26 ── */
  /**
   * LA PREUVE. Chemin rendu par le serveur une fois l'audio réellement en
   * Storage. C'est la SEULE condition qui autorise à libérer `audioBlob`.
   * Un code HTTP ne prouve rien ; ce chemin, si.
   */
  storagePath: string | null
  storageAttempts: number
  /**
   * Sauvegarde PRÉVENTIVE : le blob est à l'abri mais le chemin live (page.tsx)
   * a encore la main. Le flush n'y touche pas tant que le hold n'est pas levé.
   */
  held: boolean
  /**
   * Le chemin live a abouti : le texte et le kairos sont gérés ailleurs. La file
   * ne doit PLUS créer de kairos — seulement finir de mettre l'audio en sécurité.
   */
  handoff: boolean

  queuedAt: number
  attempts: number
  transcribeAttempts: number
  lastError?: string
}

export interface EnqueueInput {
  kind: QueueKind
  text?: string | null
  fallbackText?: string
  audioBlob?: Blob | null
  mime?: string
  kairosType: string
  captureMethod: string
  markNuminous?: boolean
  createdAtISO?: string
  createdAtOverride?: string | null
  nightGroupId?: string | null
  markers?: number[]
  durationSec?: number
  attachmentStoragePaths?: string[]
  /** sauvegarde préventive : mise à l'abri immédiate, le chemin live garde la main. */
  held?: boolean
}

/* ─────────── garde-fous ─────────── */
const DB_NAME = 'dream-offline'
const STORE = 'deposits'
const DB_VERSION = 1
/**
 * Plafond cumulé des blobs audio en file (~200 Mo). Relevé de 50 Mo : un plafond
 * bas transformait le garde-fou en destructeur. Et de toute façon, on n'évince
 * plus JAMAIS un audio qui n'est pas déjà en Storage (voir enforceAudioBudget).
 */
const AUDIO_BUDGET_BYTES = 200 * 1024 * 1024
const MAX_TRANSCRIBE_ATTEMPTS = 6
const RETRY_INTERVAL_MS = 30_000
/**
 * Vercel refuse tout corps de requête > 4,5 Mo. On garde une marge : au-delà,
 * l'audio NE PEUT PAS emprunter une route Vercel, point final.
 * ⚠️ B2 2026-07-26 — CE SEUIL EST UN AIGUILLAGE, PAS UN BUDGET DE QUALITÉ.
 * Il décide quelle ROUTE emprunte un enregistrement, jamais à quel débit on
 * l'enregistre. Le 26/07 au matin on avait baissé le débit de capture pour
 * rester en dessous : erreur — le chemin Storage n'a aucune limite de taille.
 * Repère au débit d'archive : 4 Mo ≈ 8 min 20 d'Opus 64 kbps, ≈ 4 min 10 d'AAC
 * 128 kbps. Au-delà : Storage. Rien d'autre ne change.
 */
export const DIRECT_BODY_MAX = 4 * 1024 * 1024

/* ─────────── uuid (miroir de page.tsx, autonome) ─────────── */
function uuid(): string {
  try {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID()
  } catch {}
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

/* ─────────── IndexedDB ─────────── */
function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('no-indexeddb')); return }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function reqP<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result)
    r.onerror = () => reject(r.error)
  })
}

/**
 * Les entrées écrites par la version d'avant le 26/07 n'ont pas les nouveaux
 * champs. On les complète à la lecture plutôt que de migrer le schéma : une
 * migration ratée sur ce store coûterait des rêves.
 */
function normalize(e: any): QueueEntry {
  return {
    ...e,
    storagePath: typeof e?.storagePath === 'string' ? e.storagePath : null,
    storageAttempts: typeof e?.storageAttempts === 'number' ? e.storageAttempts : 0,
    held: e?.held === true,
    handoff: e?.handoff === true,
    attempts: typeof e?.attempts === 'number' ? e.attempts : 0,
    transcribeAttempts: typeof e?.transcribeAttempts === 'number' ? e.transcribeAttempts : 0,
  } as QueueEntry
}

async function allEntries(): Promise<QueueEntry[]> {
  const db = await idb()
  const store = db.transaction(STORE, 'readonly').objectStore(STORE)
  const rows = (await reqP(store.getAll())) as any[]
  // Plus ancien d'abord (ordre de dépôt).
  return rows.map(normalize).sort((a, b) => a.queuedAt - b.queuedAt)
}

async function readEntry(id: string): Promise<QueueEntry | null> {
  try {
    const db = await idb()
    const row = await reqP(db.transaction(STORE, 'readonly').objectStore(STORE).get(id))
    return row ? normalize(row) : null
  } catch {
    return null
  }
}

async function putEntry(e: QueueEntry): Promise<void> {
  const db = await idb()
  await reqP(db.transaction(STORE, 'readwrite').objectStore(STORE).put(e) as unknown as IDBRequest)
}

async function delEntry(id: string): Promise<void> {
  const db = await idb()
  await reqP(db.transaction(STORE, 'readwrite').objectStore(STORE).delete(id) as unknown as IDBRequest)
}

/* ─────────── abonnement UI (compteur « en attente ») ─────────── */
const listeners: Array<() => void> = []
function notify() {
  listeners.forEach((fn) => { try { fn() } catch {} })
}
/** S'abonner aux changements de la file (retourne un désabonnement). */
export function subscribe(cb: () => void): () => void {
  listeners.push(cb)
  return () => {
    const i = listeners.indexOf(cb)
    if (i >= 0) listeners.splice(i, 1)
  }
}

/**
 * Nombre de dépôts en attente. On ne compte QUE ce qui demande de la patience au
 * rêveur : les sauvegardes préventives (`held`) sont invisibles — elles seront
 * effacées dans la seconde si le chemin live aboutit, les afficher serait mentir.
 */
export async function getPendingCount(): Promise<number> {
  try {
    const rows = await allEntries()
    return rows.filter((r) => !r.held).length
  } catch {
    return 0
  }
}

/* ─────────── lecture pour l'UI de récupération (PendingDeposits) ─────────── */
export interface PendingView {
  id: string
  kind: QueueKind
  kairosType: string
  /** texte transcrit, ou null si le rêve n'existe encore que sous forme de voix. */
  text: string | null
  hasAudio: boolean
  audioBytes: number
  mime: string
  durationSec?: number
  createdAtISO: string
  queuedAt: number
  attempts: number
  transcribeAttempts: number
  storageAttempts: number
  /** l'audio est-il en sécurité côté serveur ? */
  audioSafeRemote: boolean
  /** le chemin Storage confirmé (LA preuve), ou null. */
  storagePath: string | null
  kairosId: string | null
  held: boolean
  handoff: boolean
  lastError?: string
}

function toView(e: QueueEntry): PendingView {
  return {
    id: e.id,
    kind: e.kind,
    kairosType: e.kairosType,
    text: e.text,
    hasAudio: !!e.audioBlob,
    audioBytes: e.audioBlob ? e.audioBlob.size : 0,
    mime: e.mime,
    durationSec: e.durationSec,
    createdAtISO: e.createdAtISO,
    queuedAt: e.queuedAt,
    attempts: e.attempts,
    transcribeAttempts: e.transcribeAttempts,
    storageAttempts: e.storageAttempts,
    audioSafeRemote: !!e.storagePath,
    storagePath: e.storagePath,
    kairosId: e.kairosId,
    held: e.held,
    handoff: e.handoff,
    lastError: e.lastError,
  }
}

/**
 * Liste les dépôts en attente pour l'écran de récupération.
 * `allEntries` reste privé : on n'expose que des vues, jamais le store.
 */
export async function listPending(includeHeld = false): Promise<PendingView[]> {
  try {
    const rows = await allEntries()
    return rows.filter((r) => includeHeld || !r.held).map(toView)
  } catch {
    return []
  }
}

/** Le Blob audio d'un dépôt — pour le réécouter (URL.createObjectURL). */
export async function getAudioBlob(id: string): Promise<Blob | null> {
  const e = await readEntry(id)
  return e?.audioBlob || null
}

/** Suppression EXPLICITE par le rêveur. Le seul endroit du code qui a le droit d'effacer un rêve. */
export async function discardEntry(id: string): Promise<void> {
  await delEntry(id)
  notify()
}

/** Pose un texte écrit à la main (« j'écris à la place en écoutant ») et relance. */
export async function setEntryText(id: string, text: string): Promise<void> {
  const e = await readEntry(id)
  if (!e) return
  e.text = text.trim() || e.fallbackText
  e.held = false
  e.lastError = undefined
  await putEntry(e)
  notify()
  void flushQueue()
}

/** « Réessayer » depuis l'UI : on relâche les compteurs et on relance tout de suite. */
export async function retryEntry(id: string): Promise<void> {
  const e = await readEntry(id)
  if (!e) return
  e.held = false
  e.attempts = 0
  e.transcribeAttempts = 0
  e.storageAttempts = 0
  e.lastError = undefined
  await putEntry(e)
  notify()
  void flushQueue()
}

/* ─────────── garde-fou taille ───────────
   ⚠️ A1 : on n'évince QUE des audios déjà en Storage. Avant, on évinçait dès que
   `text != null` — c'est-à-dire qu'un rêve transcrit dont l'audio n'était monté
   NULLE PART perdait sa voix. On préfère désormais une file grosse à une voix
   perdue. Si rien n'est évinçable, on ne fait rien et on le dit. */
async function enforceAudioBudget(): Promise<void> {
  const rows = await allEntries()
  let total = rows.reduce((s, r) => s + (r.audioBlob ? r.audioBlob.size : 0), 0)
  if (total <= AUDIO_BUDGET_BYTES) return

  const evictable = rows
    .filter((r) => r.audioBlob && r.storagePath) // PREUVE d'upload obligatoire
    .sort((a, b) => a.queuedAt - b.queuedAt)

  for (const r of evictable) {
    if (total <= AUDIO_BUDGET_BYTES) break
    const freed = r.audioBlob ? r.audioBlob.size : 0
    r.audioBlob = null // légitime : l'audio est en Storage, chemin connu
    // ⚠️ B2 : on NE pose PAS `audioDone` ici. `audioDone` veut dire « l'audio est
    // RATTACHÉ à son rêve », pas « le blob local est libéré ». Le poser coupait
    // l'étape D (PATCH kairos_attachments) et laissait une voix orpheline côté
    // serveur — récupérable par local_id, mais invisible dans le rêve.
    await putEntry(r)
    total -= freed
  }

  if (total > AUDIO_BUDGET_BYTES) {
    console.warn(
      `[offline-queue] budget audio dépassé (${Math.round(total / 1024 / 1024)} Mo) mais rien n'est évinçable : ` +
      'aucun de ces audios n\'est confirmé en Storage. On garde tout — un rêve vaut plus qu\'un quota.'
    )
  }
}

/* ─────────── persistance du stockage local (B2 2026-07-26) ───────────
   IndexedDB n'est PAS un coffre-fort : par défaut une origine est en mode
   « best-effort », et WebKit efface ses données EN BLOC sous pression de
   stockage ou après une longue absence d'interaction (politique de stockage
   WebKit, iOS 17+ ; quota par origine : 15 % du disque pour une app qui n'est
   pas un navigateur — notre cas en WKWebView Capacitor).
   `navigator.storage.persist()` fait sortir l'origine de l'éviction. WebKit
   l'accorde sur heuristiques et peut REFUSER dans une WebView embarquée. On le
   demande donc, et on RAPPORTE la réponse — on ne fait pas semblant. */

export interface StorageSafety {
  /** l'API Storage existe-t-elle ici ? */
  supported: boolean
  /** l'origine est-elle en mode persistant (à l'abri de l'éviction) ? */
  persisted: boolean
  /** a-t-on demandé la persistance pendant cet appel ? */
  requested: boolean
  /** réponse à la demande (null = pas demandé). */
  granted: boolean | null
  quotaBytes: number | null
  usageBytes: number | null
  /** poids des voix encore présentes UNIQUEMENT sur le téléphone. */
  unsafeLocalBytes: number
  /** en clair, pour les logs et pour le rêveur. */
  note: string
}

let lastStorageSafety: StorageSafety | null = null
/** Le dernier état connu (sans re-solliciter le navigateur). */
export function storageSafetyReport(): StorageSafety | null { return lastStorageSafety }

/** Poids des audios qui ne sont NULLE PART ailleurs que sur ce téléphone. */
async function unsafeLocalBytes(): Promise<number> {
  try {
    const rows = await allEntries()
    return rows.reduce((s, r) => s + (r.audioBlob && !r.storagePath ? r.audioBlob.size : 0), 0)
  } catch { return 0 }
}

/**
 * Demande la persistance du stockage local et rend l'état réel.
 * Idempotent, ne throw jamais. À appeler au démarrage de l'app.
 */
export async function ensurePersistentStorage(): Promise<StorageSafety> {
  const base: StorageSafety = {
    supported: false, persisted: false, requested: false, granted: null,
    quotaBytes: null, usageBytes: null, unsafeLocalBytes: await unsafeLocalBytes(),
    note: '',
  }
  try {
    const st: any = typeof navigator !== 'undefined' ? (navigator as any).storage : null
    if (!st || typeof st.persisted !== 'function') {
      base.note = "API Storage absente : impossible de demander la persistance. Les rêves restent en IndexedDB, exposés à l'éviction du navigateur — l'export manuel est le seul filet garanti."
      lastStorageSafety = base
      return base
    }
    base.supported = true
    base.persisted = await st.persisted().catch(() => false)
    if (!base.persisted && typeof st.persist === 'function') {
      base.requested = true
      base.granted = await st.persist().catch(() => false)
      base.persisted = base.granted === true
    }
    if (typeof st.estimate === 'function') {
      const e = await st.estimate().catch(() => null)
      if (e) { base.quotaBytes = e.quota ?? null; base.usageBytes = e.usage ?? null }
    }
    base.note = base.persisted
      ? 'stockage local PERSISTANT : le navigateur ne peut plus évincer les rêves en attente.'
      : "stockage local en mode best-effort (persistance refusée) : sous forte pression de stockage, le navigateur PEUT effacer la file. C'est pour ça que l'audio monte en Storage tout de suite, et que l'export existe."
    console.log('[offline-queue] stockage :', JSON.stringify(base))
  } catch (e: any) {
    base.note = `état du stockage indéterminé : ${String(e?.message || e)}`
  }
  lastStorageSafety = base
  return base
}

/* ─────────── enqueue ─────────── */
/**
 * Dépose un rêve dans la file locale. Retourne l'id (client_dedup_id).
 * Déclenche un flush immédiat si en ligne (la file vide dès que possible),
 * SAUF si le dépôt est `held` (sauvegarde préventive : le chemin live a la main).
 */
export async function enqueueDeposit(input: EnqueueInput): Promise<string> {
  const entry: QueueEntry = {
    id: uuid(),
    kind: input.kind,
    text: input.text != null && input.text.trim() ? input.text.trim() : null,
    fallbackText: (input.fallbackText || '').trim() || '·',
    audioBlob: input.audioBlob || null,
    mime: input.mime || (input.audioBlob ? input.audioBlob.type : '') || 'audio/webm',
    kairosType: input.kairosType,
    captureMethod: input.captureMethod,
    markNuminous: input.markNuminous,
    createdAtISO: input.createdAtISO || new Date().toISOString(),
    createdAtOverride: input.createdAtOverride ?? null,
    nightGroupId: input.nightGroupId ?? null,
    markers: input.markers,
    durationSec: input.durationSec,
    attachmentStoragePaths: input.attachmentStoragePaths,
    kairosId: null,
    audioDone: !input.audioBlob, // pas d'audio → étape audio déjà « faite »
    storagePath: null,
    storageAttempts: 0,
    held: input.held === true,
    handoff: false,
    queuedAt: Date.now(),
    attempts: 0,
    transcribeAttempts: 0,
  }
  try {
    await putEntry(entry)
  } catch (e: any) {
    // Quota plein. On ne renonce pas à un rêve pour une histoire de place : on
    // libère ce qui est DÉJÀ en sécurité côté serveur (et rien d'autre), puis
    // on retente une fois. Si ça échoue encore, l'appelant le saura — mais
    // `safeguardRecording` ne casse jamais la capture pour autant.
    console.warn('[offline-queue] écriture refusée (quota ?) :', e?.message || e)
    const rows = await allEntries().catch(() => [] as QueueEntry[])
    for (const r of rows) {
      if (r.audioBlob && r.storagePath) {
        r.audioBlob = null // preuve exigée : un chemin Storage, jamais un code HTTP
        try { await putEntry(r) } catch {}
      }
    }
    await putEntry(entry) // seconde et dernière tentative
  }
  await enforceAudioBudget()
  notify()
  // Flush opportuniste (ne bloque pas l'appelant : l'UI confirme déjà « gardé »).
  if (!entry.held && (typeof navigator === 'undefined' || navigator.onLine)) {
    void flushQueue()
  }
  return entry.id
}

/* ─────────── transitions pilotées par capture-safety ─────────── */

/** Le chemin live a réussi : plus de kairos à créer ici, mais l'audio doit finir en Storage. */
export async function markHandoff(id: string, text: string | null): Promise<void> {
  const e = await readEntry(id)
  if (!e) return
  if (text && text.trim()) e.text = text.trim()
  e.handoff = true
  e.held = false
  await putEntry(e)
  notify()
  void flushQueue()
}

/** Le chemin live a échoué : la file prend TOUT en charge (le hold est levé). */
export async function releaseHold(id: string, reason?: string): Promise<void> {
  const e = await readEntry(id)
  if (!e) return
  e.held = false
  if (reason) e.lastError = reason
  await putEntry(e)
  notify()
  void flushQueue()
}

/**
 * Monte l'audio d'un dépôt en Storage TOUT DE SUITE, sans attendre le flush et
 * sans lever le hold. C'est ce qui court en parallèle de la transcription live :
 * quoi qu'il arrive au chemin rapide, la voix grimpe vers le serveur.
 * Retourne le storage_path, ou null si ça n'a pas abouti (jamais d'exception).
 */
export async function secureAudioNow(id: string): Promise<string | null> {
  const e = await readEntry(id)
  if (!e) return null
  if (e.storagePath) return e.storagePath
  if (!e.audioBlob) return null
  try {
    await ensureStorage(e)
    return e.storagePath
  } catch (err: any) {
    e.lastError = `storage: ${String(err?.message || err)}`
    try { await putEntry(e) } catch {}
    notify()
    return null
  }
}

/** L'état courant d'un dépôt (vue seule) — pour l'UI et pour capture-safety. */
export async function peekEntry(id: string): Promise<PendingView | null> {
  const e = await readEntry(id)
  return e ? toView(e) : null
}

/** Rattache après coup l'audio au rêve créé par le chemin live. */
export async function attachToKairos(id: string, kairosId: string): Promise<void> {
  const e = await readEntry(id)
  if (!e) return
  e.kairosId = kairosId
  e.audioDone = false // il reste à écrire la ligne kairos_attachments
  await putEntry(e)
  notify()
  void flushQueue()
}

/* ─────────── flush ─────────── */
let flushing = false

/**
 * Sert UNIQUEMENT à décider s'il faut arrêter la boucle de flush (le réseau est
 * tombé, inutile d'insister sur les dépôts suivants).
 * ⚠️ NE JAMAIS s'en servir pour décider si l'on conserve un audio : c'est
 * exactement l'erreur qui a coûté un rêve de 8 min le 26/07.
 */
function isNetworkError(e: any): boolean {
  return e instanceof TypeError || (typeof navigator !== 'undefined' && !navigator.onLine)
}

/** Vide la file : traite chaque dépôt dans l'ordre, purge ceux qui aboutissent. */
export async function flushQueue(): Promise<void> {
  if (flushing) return
  if (typeof navigator !== 'undefined' && !navigator.onLine) return
  flushing = true
  try {
    const rows = await allEntries()
    for (const entry of rows) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) break
      if (entry.held) continue // sauvegarde préventive : le chemin live a la main
      try {
        const done = await processEntry(entry)
        if (done) {
          await delEntry(entry.id)
          notify()
        }
      } catch (e: any) {
        entry.attempts += 1
        entry.lastError = String(e?.message || e)
        try { await putEntry(entry) } catch {}
        notify()
        if (isNetworkError(e)) break // réseau retombé : on arrête, on reprendra plus tard
        // erreur applicative sur CE dépôt : on passe au suivant (il sera re-tenté au prochain flush)
      }
    }
  } finally {
    flushing = false
  }
}

/**
 * L'audio est-il réglé ?
 * Un seul état autorise à considérer que oui quand un blob existe : un
 * `storagePath` rendu par le serveur. Pas un 200, pas un 413 — un chemin.
 */
function audioSecured(e: QueueEntry): boolean {
  if (!e.audioBlob && !e.storagePath) return e.audioDone
  return !!e.storagePath
}

/* ─────────── étape A : l'audio en Storage, hors de Vercel ─────────── */
async function ensureStorage(entry: QueueEntry): Promise<void> {
  if (!entry.audioBlob || entry.storagePath) return
  entry.storageAttempts += 1
  await putEntry(entry)

  // 1. jeton d'upload (corps JSON minuscule → aucune limite de taille)
  const res = await authFetch('/api/kairos/audio/signed-upload', {
    method: 'POST',
    body: JSON.stringify({
      local_id: entry.id,
      mime: entry.mime,
      bytes: entry.audioBlob.size,
      duration_sec: entry.durationSec,
      kind: entry.kind,
      kairos_type: entry.kairosType,
      capture_method: entry.captureMethod,
    }),
  })
  if (!res.ok) throw new Error(`signed-upload ${res.status}`)
  const j = await res.json().catch(() => ({} as any))
  if (!j?.upload_url || !j?.storage_path) throw new Error('signed-upload: réponse incomplète')

  // 2. PUT direct client → Supabase Storage. `fetch` NU : l'URL signée porte son
  //    propre jeton, un Bearer applicatif en plus la ferait échouer.
  const put = await fetch(j.upload_url, {
    method: 'PUT',
    headers: { 'content-type': j.mime || entry.mime || 'audio/webm' },
    body: entry.audioBlob,
  })
  if (!put.ok) throw new Error(`storage PUT ${put.status}`)

  // 3. LA PREUVE. À partir d'ici, et seulement à partir d'ici, le blob local
  //    devient une copie de confort et non plus la seule copie au monde.
  entry.storagePath = j.storage_path
  await putEntry(entry)
  notify()
}

/* ─────────── étape B : la transcription ─────────── */
async function ensureTranscript(entry: QueueEntry): Promise<void> {
  if (entry.text != null) return
  if (!entry.audioBlob && !entry.storagePath) return

  entry.transcribeAttempts += 1
  await putEntry(entry)

  // Chemin PRINCIPAL : l'audio est en Storage → le corps de la requête fait
  // 200 octets, la taille de l'enregistrement n'entre plus en jeu.
  if (entry.storagePath) {
    const res = await authFetch('/api/transcribe-from-storage', {
      method: 'POST',
      body: JSON.stringify({ storage_path: entry.storagePath, local_id: entry.id }),
    })
    if (!res.ok) throw new Error(`transcribe-from-storage ${res.status}`)
    const j = await res.json().catch(() => ({} as any))
    if (j?.ok && typeof j.text === 'string' && j.text.trim().length > 2) {
      entry.text = j.text.trim()
      await putEntry(entry)
      return
    }
    // Échec de transcription — PAS une perte : l'audio est en Storage.
    if (entry.transcribeAttempts >= MAX_TRANSCRIBE_ATTEMPTS || j?.retryable === false) {
      entry.text = entry.fallbackText
      entry.lastError = j?.error ? String(j.error).slice(0, 200) : 'transcription impossible'
      await putEntry(entry)
      return
    }
    throw new Error(String(j?.error || 'transcription échouée'))
  }

  // Chemin de SECOURS : le Storage n'a pas voulu de nous, mais l'audio est assez
  // petit pour traverser Vercel (< 4 Mo). Au-delà, on n'essaie même pas : ce
  // serait un 413 garanti, et l'ancienne version en profitait pour jeter le blob.
  // (Ce seuil n'a JAMAIS à influencer le débit d'enregistrement — cf. DIRECT_BODY_MAX.)
  if (entry.audioBlob && entry.audioBlob.size <= DIRECT_BODY_MAX) {
    const fd = new FormData()
    const ext = entry.mime.includes('mp4') || entry.mime.includes('m4a') ? 'm4a' : 'webm'
    fd.append('audio', new File([entry.audioBlob], `dream.${ext}`, { type: entry.mime }))
    const res = await authFetch('/api/transcribe', { method: 'POST', body: fd })
    if (res.ok) {
      const j = await res.json().catch(() => ({} as any))
      const tx = typeof j?.text === 'string' ? j.text.trim() : ''
      entry.text = tx.length > 2 ? tx : entry.fallbackText
      await putEntry(entry)
      return
    }
    if (entry.transcribeAttempts >= MAX_TRANSCRIBE_ATTEMPTS) {
      entry.text = entry.fallbackText
      entry.lastError = `transcribe ${res.status}`
      await putEntry(entry)
      return
    }
    throw new Error(`transcribe ${res.status}`)
  }

  // Trop gros pour Vercel et pas encore en Storage : on ATTEND. On ne pose surtout
  // pas le texte de repli — ce serait déclarer le rêve « traité » alors que sa
  // voix n'est nulle part. L'étape A retentera au prochain flush.
  throw new Error('audio > 4 Mo et pas encore en Storage — on attend, rien n\'est perdu')
}

/**
 * Traite un dépôt. Retourne true s'il est complet (à purger d'IndexedDB).
 * Chaque étape ne s'exécute que si elle n'a pas déjà réussi → reprise sûre.
 */
async function processEntry(entry: QueueEntry): Promise<boolean> {
  // ── A. L'audio d'abord, toujours. C'est la loi. ──
  if (entry.audioBlob && !entry.storagePath) {
    try {
      await ensureStorage(entry)
    } catch (e: any) {
      // Le Storage a refusé. On NE jette RIEN et on continue : peut-être que la
      // transcription directe passera (petit audio), peut-être pas. Dans tous
      // les cas le blob reste en IndexedDB, visible dans l'UI de récupération.
      entry.lastError = `storage: ${String(e?.message || e)}`
      await putEntry(entry)
      if (isNetworkError(e)) throw e
    }
  }

  // ── B. Transcription ──
  await ensureTranscript(entry)

  const rawText = (entry.text || entry.fallbackText).trim()

  // ── C. Création du kairos (jamais si le chemin live s'en est chargé) ──
  if (!entry.kairosId && !entry.handoff) {
    const payload: any = {
      raw_text: rawText,
      kairos_type: entry.kairosType,
      capture_method: entry.captureMethod,
      client_dedup_id: entry.id, // idempotence côté serveur (dé-double)
    }
    if (entry.markNuminous) payload.mark_numinous = true
    if (entry.createdAtOverride) payload.created_at = entry.createdAtOverride
    else payload.created_at = entry.createdAtISO
    if (entry.nightGroupId) payload.night_group_id = entry.nightGroupId
    if (entry.attachmentStoragePaths && entry.attachmentStoragePaths.length) {
      payload.attachment_storage_paths = entry.attachmentStoragePaths
    }
    const res = await authFetch('/api/kairos', { method: 'POST', body: JSON.stringify(payload) })
    if (!res.ok) throw new Error(`kairos ${res.status}`)
    const j = await res.json().catch(() => ({} as any))
    const id = j?.id || j?.kairos?.id
    if (!id) throw new Error('kairos: no id')
    entry.kairosId = id
    await putEntry(entry)
  }

  // ── D. Rattachement audio ↔ rêve (best-effort, jamais bloquant) ──
  // Si ça rate, l'audio reste retrouvable : `capture_audio.local_id` == `entry.id`
  // == `kairos.client_dedup_id`. Un script serveur peut recoller sur cette clé.
  if (entry.storagePath && entry.kairosId && !entry.audioDone) {
    try {
      const res = await authFetch('/api/kairos/audio/signed-upload', {
        method: 'PATCH',
        body: JSON.stringify({ local_id: entry.id, storage_path: entry.storagePath, kairos_id: entry.kairosId }),
      })
      if (res.ok) {
        entry.audioDone = true
        // Le blob local n'est plus la seule copie : on peut le libérer.
        entry.audioBlob = null
        await putEntry(entry)
      } else {
        entry.lastError = `attach ${res.status}`
        await putEntry(entry)
      }
    } catch (e: any) {
      if (isNetworkError(e)) throw e
      entry.lastError = `attach: ${String(e?.message || e)}`
      await putEntry(entry)
    }
  }

  // ── Complétion ──
  // handoff : le rêve vit déjà côté serveur ; il ne reste qu'à savoir l'audio en lieu sûr.
  if (entry.handoff) return audioSecured(entry)
  return !!entry.kairosId && audioSecured(entry)
}

/* ─────────── auto-flush : online + visibilité + intervalle doux ─────────── */
let autoStarted = false
/** À monter une fois (au boot de l'app). Idempotent. Retourne un stop() de nettoyage. */
export function startAutoFlush(): () => void {
  if (autoStarted || typeof window === 'undefined') return () => {}
  autoStarted = true
  const kick = () => { void flushQueue() }
  const onOnline = () => kick()
  const onVisible = () => { if (document.visibilityState === 'visible') kick() }
  window.addEventListener('online', onOnline)
  document.addEventListener('visibilitychange', onVisible)
  const interval = window.setInterval(() => {
    if (typeof navigator === 'undefined' || navigator.onLine) kick()
  }, RETRY_INTERVAL_MS)
  // Le stockage local demande à être protégé de l'éviction — une fois, au boot.
  void ensurePersistentStorage()
  // Premier passage au démarrage (rattrape ce qui restait d'une session précédente).
  kick()
  return () => {
    window.removeEventListener('online', onOnline)
    document.removeEventListener('visibilitychange', onVisible)
    window.clearInterval(interval)
    autoStarted = false
  }
}
