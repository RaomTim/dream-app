/**
 * CAPTURE-SAFETY — le premier geste, avant tout le reste.
 * ════════════════════════════════════════════════════════════════════════════
 * Le 26 juillet 2026, un rêve de 8 minutes a été perdu. Pas corrompu, pas
 * dégradé : effacé. Le blob est parti au ramasse-miettes pendant qu'un `catch`
 * décidait, à tort, qu'un 413 n'était « pas une panne réseau ».
 *
 * Ce module existe pour qu'aucune ligne de code n'ait plus jamais à prendre
 * cette décision. Son contrat est court, et volontairement impossible à mal
 * utiliser :
 *
 *   const mr = createVoiceRecorder(stream)                 // ← le débit d'ARCHIVE
 *   const localId = await safeguardRecording(blob, meta)   // ← AVANT tout fetch
 *   …
 *   await markTranscribed(localId, texte)   // le chemin rapide a gagné
 *   await markFailed(localId, raison)       // il a perdu : la file prend le relais
 *
 * TROIS PROMESSES :
 *
 * 1. `safeguardRecording` ne throw JAMAIS. Un échec de persistance est loggé,
 *    jamais propagé — on ne casse pas une capture pour un problème de stockage.
 *    Si elle rend `null`, l'appelant continue exactement comme avant : on ne
 *    fait jamais MOINS bien qu'avant, seulement mieux.
 *
 * 2. Elle rend la main IMMÉDIATEMENT. L'écriture IndexedDB est attendue (elle
 *    prend quelques millisecondes et c'est elle qui sauve le rêve) ; la montée
 *    vers Supabase Storage est lancée en parallèle, jamais attendue.
 *
 * 3. L'ordre est une loi : **l'audio est mis à l'abri avant qu'un seul octet ne
 *    parte vers une IA.** Un rêve dont l'audio est sauvé n'est jamais perdu,
 *    même si la transcription échoue dix fois.
 *
 * ══ RÉVISION B2 — 2026-07-26 : LA QUALITÉ NE SE NÉGOCIE PAS ═════════════════
 * Le 26/07 au matin, on avait baissé le débit d'enregistrement à 32 kbps pour
 * faire tenir 8 min sous la limite de corps de requête de Vercel. C'était une
 * erreur de raisonnement : **le chemin Storage n'a aucune limite de taille**, et
 * l'IA plafonne de toute façon en DURÉE (1400 s) bien avant de plafonner en
 * taille. Autrement dit, baisser le débit ne repoussait aucune limite réelle —
 * ça ne faisait que dégrader une voix qu'on garde pour dix ans.
 *
 * Ce qu'on enregistre ici, ce n'est pas un fichier de travail : c'est quelqu'un
 * qui, au réveil, raconte son rêve. Cet audio sera réécouté, il remontera dans
 * le « ciel de prières » (VISION-CHANT-DU-COEUR §3). On archive une voix.
 *
 * Yeshua (Opus), agent A1 puis B2, 2026-07-26.
 */
import {
  enqueueDeposit,
  markHandoff,
  releaseHold,
  attachToKairos,
  secureAudioNow,
  peekEntry,
  getAudioBlob,
  ensurePersistentStorage,
  storageSafetyReport,
  DIRECT_BODY_MAX,
  type QueueKind,
  type StorageSafety,
} from '@/lib/offline-queue'
import { TRANSCRIBE_MAX_SECONDS } from '@/lib/audio-split'
import { authFetch } from '@/lib/api-client'

/* ═══════════════════════════════════════════════════════════════════════════
   1. LE DÉBIT DE CAPTURE — la matière première
   ═══════════════════════════════════════════════════════════════════════════
   POURQUOI CES DEUX VALEURS, ET PAS UNE SEULE.
   Le même `audioBitsPerSecond` ne veut pas dire la même chose selon le codec,
   et les deux plateformes n'utilisent PAS le même codec :
     · Chrome / Android → `audio/webm` = **Opus** ;
     · Safari / iOS (et donc notre WKWebView Capacitor) → `audio/mp4` = **AAC-LC**
       (WebKit n'écrit ni Opus ni WebM).
   Or, sous 64 kbps, AAC-LC a besoin d'environ **deux fois** le débit d'Opus pour
   la même qualité de parole. Appliquer 32 kbps « parce que WhatsApp le fait »
   donnait donc de l'Opus correct sur Android et de l'AAC bouillie sur iPhone —
   c'est-à-dire précisément là où les rêves sont enregistrés.

   LES CHIFFRES QUI JUSTIFIENT LE CHOIX (débit → poids → durée avant un plafond) :
     Opus 64 kbps mono = 8 ko/s  → 1 min = 480 ko · 10 min = 4,8 Mo · 1 h = 28,7 Mo
       (mesuré : 1 h encodée en CBR 64k = 30 084 075 octets)
     AAC 128 kbps mono = 16 ko/s → 1 min = 960 ko · 10 min = 9,6 Mo · 1 h = 57,6 Mo
       (mesuré : 1 h encodée en 128k = 58 573 033 octets)
   Coût réel d'un rêve moyen (2 min) : 960 ko en Opus, 1,9 Mo en AAC. Le stockage
   d'une voix pour dix ans à ce prix-là ne se discute pas.

   POURQUOI PAS PLUS ? Opus au-dessus de ~64 kbps mono n'apporte plus rien
   d'audible sur de la parole (il est déjà considéré comme transparent autour de
   32 kbps en mono) : on stockerait du bruit d'encodeur. 64 kbps, c'est le double
   du point de transparence — de la marge, pas du gaspillage. Idem pour AAC à
   128 kbps mono. Et surtout :

   ⚠️ ON NE DESCEND JAMAIS EN DESSOUS DU DÉFAUT DU NAVIGATEUR. `createVoiceRecorder`
   commence par mesurer ce que le navigateur ferait tout seul ; si son défaut est
   supérieur à notre cible, on ne touche à rien. Un réglage ne doit jamais pouvoir
   DÉGRADER une capture — seulement la relever.

   RIEN DE TOUT CELA N'INFLUENCE LA TRANSCRIPTION. La copie envoyée à l'IA est
   découpée dans le conteneur, sans ré-encodage : mêmes octets audio. Le jour où
   il faudrait alléger pour l'IA, on allégerait CETTE copie, jamais l'original. */

/** Opus mono, ~2× le point de transparence pour la parole. Chrome / Android. */
export const CAPTURE_BITRATE_OPUS = 64_000
/** AAC-LC mono. Safari / iOS : AAC a besoin d'environ 2× le débit d'Opus. */
export const CAPTURE_BITRATE_AAC = 128_000

/** Ce que le navigateur a réellement fait — lisible dans les logs et le debug. */
export interface RecorderInfo {
  mimeType: string
  /** débit finalement en vigueur (0 si le navigateur ne le dit pas). */
  bitrate: number
  /** ce que le navigateur aurait fait sans nous (0 = inconnu). */
  browserDefault: number
  /** true si on a laissé le défaut du navigateur parce qu'il était meilleur. */
  keptBrowserDefault: boolean
}
let lastRecorderInfo: RecorderInfo | null = null
export function getLastRecorderInfo(): RecorderInfo | null { return lastRecorderInfo }

/** Le conteneur que ce navigateur sait écrire. WebKit ne connaît que mp4/AAC. */
export function pickRecorderMime(): string {
  try {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus'
      if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm'
      if (MediaRecorder.isTypeSupported('audio/mp4')) return 'audio/mp4'
    }
  } catch {}
  return 'audio/webm'
}

/**
 * LE MAGNÉTOPHONE. Une seule porte d'entrée pour toutes les captures de l'app
 * (l'Orbe, le Cœur, le Scanner) — pour qu'aucune ne puisse enregistrer moins
 * bien qu'une autre par oubli.
 *
 * Ne throw jamais : en dernier recours il rend un `MediaRecorder` par défaut,
 * exactement ce que le code faisait avant. On ne casse pas une capture pour un
 * réglage de qualité.
 */
export function createVoiceRecorder(stream: MediaStream): MediaRecorder {
  const mimeType = pickRecorderMime()
  const target = mimeType.includes('mp4') ? CAPTURE_BITRATE_AAC : CAPTURE_BITRATE_OPUS

  // 1. Ce que le navigateur ferait tout seul. On ne le devine pas : on le lit.
  let browserDefault = 0
  try {
    const probe = new MediaRecorder(stream, { mimeType })
    browserDefault = Number((probe as any).audioBitsPerSecond) || 0
  } catch {}

  // 2. On ne descend JAMAIS. On ne monte que si le défaut est plus bas (ou muet).
  const keptBrowserDefault = browserDefault > target
  try {
    const mr = keptBrowserDefault
      ? new MediaRecorder(stream, { mimeType })
      : new MediaRecorder(stream, { mimeType, audioBitsPerSecond: target })
    lastRecorderInfo = {
      mimeType,
      bitrate: Number((mr as any).audioBitsPerSecond) || (keptBrowserDefault ? browserDefault : target),
      browserDefault,
      keptBrowserDefault,
    }
    console.log('[capture-safety] enregistrement :', JSON.stringify(lastRecorderInfo))
    return mr
  } catch (e: any) {
    console.warn('[capture-safety] MediaRecorder par défaut (réglage refusé) :', e?.message || e)
    const mr = new MediaRecorder(stream)
    lastRecorderInfo = { mimeType: mr.mimeType || mimeType, bitrate: Number((mr as any).audioBitsPerSecond) || 0, browserDefault, keptBrowserDefault: true }
    return mr
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. LA MISE À L'ABRI
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SafeguardMeta {
  /** 'dream' (l'Orbe, la nuit) ou 'day' (le Cœur, la voix consciente). */
  kind: QueueKind
  /** type de kaïros visé côté serveur ('reve', 'note_jour', 'signe'…). */
  kairosType: string
  captureMethod: string
  /** texte affiché si la transcription ne rend rien — le rêve, lui, reste la voix. */
  fallbackText: string
  markers?: number[]
  durationSec?: number
  createdAtISO?: string
  nightGroupId?: string | null
  markNuminous?: boolean
}

/**
 * MET LE REVE À L'ABRI. À appeler dès que le Blob existe, AVANT le moindre fetch.
 *
 * Ce qu'elle fait, dans cet ordre :
 *   1. écrit le blob en IndexedDB (attendu — c'est le geste qui sauve) ;
 *   2. lance en tâche de fond la montée vers Supabase Storage (jamais attendu).
 *
 * @returns l'identifiant local (== client_dedup_id == capture_audio.local_id),
 *          ou `null` si même IndexedDB est indisponible. Ne throw jamais.
 */
export async function safeguardRecording(blob: Blob, meta: SafeguardMeta): Promise<string | null> {
  if (!blob || blob.size < 800) return null
  try {
    const localId = await enqueueDeposit({
      kind: meta.kind,
      audioBlob: blob,
      mime: blob.type || 'audio/webm',
      kairosType: meta.kairosType,
      captureMethod: meta.captureMethod,
      fallbackText: meta.fallbackText,
      markers: meta.markers,
      durationSec: meta.durationSec,
      createdAtISO: meta.createdAtISO,
      nightGroupId: meta.nightGroupId,
      markNuminous: meta.markNuminous,
      // Sauvegarde PRÉVENTIVE : le chemin live garde la main. Sans ce drapeau,
      // la file créerait un second rêve en parallèle du premier.
      held: true,
    })
    // La course commence : la voix grimpe vers le serveur pendant que l'IA
    // travaille. Jamais attendu — la capture ne doit pas ralentir d'un pouce.
    void secureAudioNow(localId)
    return localId
  } catch (e: any) {
    // On ne casse JAMAIS la capture pour un problème de stockage local.
    console.error('[capture-safety] safeguardRecording a échoué (la capture continue) :', e?.message || e)
    return null
  }
}

/**
 * Le chemin rapide a gagné : on a le texte, le rêve va être créé par l'écran de
 * post-dépôt. La file cesse donc de vouloir créer un kairos — elle finit
 * seulement de mettre l'audio en lieu sûr, puis s'efface.
 */
export async function markTranscribed(localId: string | null, text: string): Promise<void> {
  if (!localId) return
  try {
    await markHandoff(localId, text)
  } catch (e: any) {
    console.error('[capture-safety] markTranscribed :', e?.message || e)
  }
}

/**
 * Le chemin rapide a perdu — peu importe pourquoi (413, 500, 504, timeout,
 * avion, batterie). On lève le hold : la file reprend TOUT en charge, avec
 * l'audio qu'elle a déjà. Aucune raison d'échec n'est traitée différemment.
 */
export async function markFailed(localId: string | null, reason: string): Promise<void> {
  if (!localId) return
  try {
    await releaseHold(localId, reason)
  } catch (e: any) {
    console.error('[capture-safety] markFailed :', e?.message || e)
  }
}

/**
 * Une fois le rêve créé (POST /api/kairos), on relie l'audio au rêve.
 * Best-effort : si ça n'aboutit pas, l'audio reste retrouvable côté serveur —
 * `capture_audio.local_id` == `kairos.client_dedup_id` == ce `localId`.
 */
export async function linkCaptureAudio(localId: string | null, kairosId: string): Promise<void> {
  if (!localId || !kairosId) return
  try {
    await attachToKairos(localId, kairosId)
  } catch (e: any) {
    console.error('[capture-safety] linkCaptureAudio :', e?.message || e)
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. LA TRANSCRIPTION
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Au-delà, on rend la main au rêveur : la file finira toute seule, et le
 * serveur a de toute façon posé son verrou (`transcription_started_at`), donc
 * la reprise retombera sur le texte en cache au lieu de repayer l'IA.
 * 4 min : très au-delà des ~13 s par morceau de 19 min mesurées, mais en deçà
 * de ce qu'un humain accepte de fixer en attendant.
 */
const LIVE_WAIT_MS = 240_000

/**
 * TRANSCRIRE SANS SE FAIRE COUPER PAR VERCEL.
 *
 * DEUX CHEMINS, ET **AUCUN DES DEUX N'INFLUENCE LA QUALITÉ DE CAPTURE** :
 *
 *   ≤ 4 Mo  → POST /api/transcribe. Un raccourci de CONFORT, rien d'autre :
 *             une seconde ou deux de moins pour la capture courte du matin.
 *             (Opus 64 kbps : jusqu'à ~9 min 20. AAC 128 kbps : ~4 min 40.)
 *   sinon   → l'audio monte en Storage (client → Supabase, hors Vercel, aucune
 *             limite de taille), puis POST /api/transcribe-from-storage avec un
 *             corps de 200 octets. Le serveur découpe dans le conteneur si
 *             nécessaire : **aucune limite de durée**.
 *
 * Le seuil de 4 Mo est celui de la PLATEFORME (Vercel refuse tout corps > 4,5 Mo).
 * Il n'a jamais à influencer le débit d'enregistrement : quand on le dépasse, on
 * change de route, on ne change pas la voix.
 *
 * Si l'audio n'arrive pas à monter en Storage, on ne tente RIEN d'impossible :
 * on lève une erreur, l'appelant appelle `markFailed`, et la file reprend avec
 * le blob intact. Le rêve attend, il n'est pas perdu.
 *
 * @throws en cas d'échec — l'appelant DOIT enchaîner sur `markFailed(localId, …)`.
 */
export async function transcribeSafely(localId: string | null, blob: Blob, durationSec?: number): Promise<string> {
  const fitsInARequestBody = blob.size <= DIRECT_BODY_MAX
  // Un enregistrement peut être léger ET trop long pour l'IA d'un seul tenant
  // (1400 s). Dans ce cas aussi il faut le chemin Storage : lui sait découper.
  const tooLongForOneCall = !!durationSec && durationSec > TRANSCRIBE_MAX_SECONDS

  if (fitsInARequestBody && !tooLongForOneCall) {
    const fd = new FormData()
    const mime = blob.type || 'audio/webm'
    const ext = mime.includes('mp4') || mime.includes('m4a') ? 'm4a' : 'webm'
    fd.append('audio', new File([blob], `dream.${ext}`, { type: mime }))
    const res = await authFetch('/api/transcribe', { method: 'POST', body: fd })
    if (!res.ok) {
      const e = await res.json().catch(() => ({} as any))
      throw new Error(e?.error || `transcribe ${res.status}`)
    }
    const j = await res.json().catch(() => ({} as any))
    return typeof j?.text === 'string' ? j.text.trim() : ''
  }

  // ── Chemin d'archive : la voix passe par Storage, jamais par Vercel. ──
  if (!localId) {
    throw new Error("enregistrement long et non sauvegardé localement — on n'envoie rien à l'aveugle")
  }

  // `safeguardRecording` a déjà lancé la montée ; on la relance ici de façon
  // idempotente (si elle est finie, `secureAudioNow` rend le chemin sans rien refaire).
  let storagePath = await secureAudioNow(localId)
  if (!storagePath) {
    // La course lancée par `safeguardRecording` a pu aboutir entre-temps.
    const view = await peekEntry(localId)
    storagePath = view?.storagePath || null
  }
  if (!storagePath) {
    throw new Error("l'audio n'a pas encore pu être mis en sécurité — il est gardé sur le téléphone")
  }

  // Garde-temps : au-delà, la file prend le relais et le rêveur récupère sa vie.
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timer = ctl ? setTimeout(() => ctl.abort(), LIVE_WAIT_MS) : null
  let res: Response
  try {
    res = await authFetch('/api/transcribe-from-storage', {
      method: 'POST',
      body: JSON.stringify({ storage_path: storagePath, local_id: localId }),
      ...(ctl ? { signal: ctl.signal } : {}),
    })
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      throw new Error('la transcription prend plus longtemps que prévu — ta voix est en sécurité, elle continue en arrière-plan')
    }
    throw e
  } finally {
    if (timer) clearTimeout(timer)
  }

  if (!res.ok) throw new Error(`transcribe-from-storage ${res.status}`)
  const j = await res.json().catch(() => ({} as any))
  if (j?.ok && typeof j.text === 'string') return j.text.trim()
  throw new Error(String(j?.error || 'transcription échouée'))
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. LE BACKUP TÉLÉPHONE — la demande explicite de Tim
   ═══════════════════════════════════════════════════════════════════════════
   « IL FAUT UN BACKUP même si ça fait plus de 19min, au moins que ça enregistre
     l'audio dans le téléphone de l'utilisateur !! »

   CE QUI EST VRAI, ET CE QUI NE L'EST PAS, sur le stockage local d'une WebView
   iOS (source : WebKit, « Updates to Storage Policy », politique en vigueur
   depuis iOS 17) :
     · quota par origine : jusqu'à **15 %** du disque pour une app qui n'est pas
       un navigateur — c'est notre cas (Capacitor/WKWebView). 60 % pour Safari.
       Sur un iPhone de 128 Go à moitié plein, ça reste des gigaoctets : la file
       de rêves ne remplira jamais ça.
     · **l'éviction existe** : sous pression de stockage, ou après une longue
       période sans interaction (ITP), WebKit efface les données d'une origine
       **en bloc**. Le mode par défaut est « best-effort » : aucune garantie.
     · **`navigator.storage.persist()`** fait sortir l'origine de l'éviction.
       WebKit l'accorde sur des heuristiques (app ajoutée à l'écran d'accueil,
       historique d'interaction). Dans une WKWebView embarquée, il peut refuser.
       → on le DEMANDE au démarrage, et on RAPPORTE la réponse au lieu de faire
         comme si de rien n'était.

   D'où le troisième filet, celui qui ne dépend d'aucune politique de navigateur :
   **l'export**. Le rêveur peut sortir sa voix de l'app (partage natif iOS/Android
   ou téléchargement). Si tout casse — l'app, le compte, le réseau, le serveur —
   le fichier est dans son téléphone, et il peut se l'envoyer.

   ⚠️ LIMITE CONNUE, DITE SANS ENROBAGE : dans une WKWebView, `navigator.share`
   avec des FICHIERS et `<a download>` sont capricieux selon les versions d'iOS.
   Le chemin garanti est natif : plugins `@capacitor/share` + `@capacitor/filesystem`
   — **ni l'un ni l'autre n'est installé** (cf. package.json) et les ajouter
   impose un rebuild natif et une re-soumission sur les stores. C'est une
   décision de Tim, pas une improvisation de ma part. En attendant, on tente les
   trois voies web dans l'ordre et on dit honnêtement laquelle a marché. */

export type ExportOutcome = 'shared' | 'downloaded' | 'opened' | 'failed'

/**
 * Sort l'audio d'un dépôt hors de l'app — partage natif si possible, sinon
 * téléchargement, sinon ouverture dans un onglet (au pire, une lecture d'où
 * l'on peut faire « partager »). Ne throw jamais.
 */
export async function exportRecording(localId: string, filename?: string): Promise<ExportOutcome> {
  try {
    const blob = await getAudioBlob(localId)
    if (!blob) return 'failed'
    const mime = blob.type || 'audio/webm'
    const ext = mime.includes('mp4') || mime.includes('m4a') ? 'm4a' : mime.includes('wav') ? 'wav' : 'webm'
    const name = filename || `reve-${new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-')}.${ext}`

    // 1. Partage natif (iOS/Android) — le seul geste qui met vraiment le fichier
    //    ailleurs que dans l'app : Fichiers, Messages, mail, Drive…
    try {
      const nav: any = typeof navigator !== 'undefined' ? navigator : null
      if (nav?.share && nav?.canShare) {
        const file = new File([blob], name, { type: mime })
        if (nav.canShare({ files: [file] })) {
          await nav.share({ files: [file], title: name })
          return 'shared'
        }
      }
    } catch (e: any) {
      // L'utilisateur a pu simplement annuler la feuille de partage : on ne
      // retombe pas sur un téléchargement qu'il n'a pas demandé.
      if (e?.name === 'AbortError') return 'failed'
    }

    // 2. Téléchargement classique.
    const url = URL.createObjectURL(blob)
    try {
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
      return 'downloaded'
    } catch {}

    // 3. Dernier recours : l'ouvrir. Mieux qu'un bouton qui ne fait rien.
    try {
      window.open(url, '_blank')
      return 'opened'
    } catch {}
    return 'failed'
  } catch (e: any) {
    console.error('[capture-safety] exportRecording :', e?.message || e)
    return 'failed'
  }
}

/**
 * À appeler UNE FOIS au démarrage de l'app (à côté de `startAutoFlush`).
 * Demande la persistance et rend l'état réel du stockage — à afficher au rêveur
 * si la persistance est refusée ET que la file contient des rêves non montés.
 */
export async function primeLocalSafety(): Promise<StorageSafety> {
  return ensurePersistentStorage()
}

export { storageSafetyReport, type StorageSafety }
