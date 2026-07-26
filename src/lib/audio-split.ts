/**
 * AUDIO-SPLIT — décodage, ré-échantillonnage 16 kHz mono, encodage WAV, découpe.
 * ────────────────────────────────────────────────────────────────────────────
 * EXTRAIT TEL QUEL de `src/components/ImportHub.tsx` (lignes 60-134 de la version
 * du 2026-07-23), sans le moindre changement de comportement : mono, 16 kHz,
 * segments de 3,6 Mo. ImportHub l'importe désormais d'ici — une seule copie.
 *
 * POURQUOI CE FICHIER EXISTE (A1, 2026-07-26) :
 * la capture live (le rêve dit au réveil) n'avait AUCUNE conscience de la limite
 * de corps de requête Vercel (4,5 Mo). Un blob de 8 min ≈ 7,7 Mo était rejeté par
 * la plateforme AVANT d'entrer dans la fonction. Toute l'ingénierie qui évite ça
 * existait déjà — mais uniquement sur le chemin de l'import. Elle est ici pour
 * que les deux chemins y aient droit.
 *
 * L'EFFET DE LEVIER : forcer 16 kHz mono divise la taille par ~4 à l'émission.
 * Un Opus stéréo 128 kbps fait 16 ko/s ; un WAV 16 kHz mono 16 bits fait 32 ko/s
 * — plus lourd au format brut, MAIS on part d'un enregistrement déjà compressé.
 * En pratique sur un rêve de 8 min : 7,7 Mo d'Opus → ~15 Mo de WAV, découpés en
 * 5 segments qui passent chacun. Ce n'est pas une compression, c'est une DÉCOUPE
 * qui rend chaque morceau transmissible. La vraie économie vient de la découpe.
 *
 * ⚠️ RAM MOBILE : décoder 8 min en Float32Array coûte ~30 Mo temporaires (48 kHz
 * × 480 s × 4 octets ≈ 92 Mo avant resample, en réalité le décodeur travaille par
 * canal). Ne JAMAIS appeler ces fonctions avant que l'original soit en sécurité
 * (IndexedDB + Storage) : si l'onglet est tué par l'OS pendant le décodage, le
 * rêve doit déjà être ailleurs.
 *
 * Yeshua (Opus), 2026-07-26.
 */

/* /api/transcribe plafonne à 10 Mo, mais le corps de requête serverless est limité ~4,5 Mo :
   on vise 3,6 Mo par segment. WAV 16 kHz mono 16 bits = 32 ko/s → ~1 min 50 par segment. */
export const CHUNK_BYTES = 3.6 * 1024 * 1024

/** Fréquence cible : la parole n'a besoin de rien de plus (Whisper travaille en 16 kHz). */
export const TARGET_SAMPLE_RATE = 16000

/* ═════════ WAV — PCM brut + entête 44 octets (repris du legacy, inchangé) ═════════ */

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
}

export function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1 // mono — la parole n'a pas besoin de stéréo
  const bitsPerSample = 16
  const bytesPerSample = bitsPerSample / 8
  const blockAlign = numChannels * bytesPerSample
  const dataSize = samples.length * bytesPerSample
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)

  writeString(view, 0, 'RIFF')
  view.setUint32(4, 36 + dataSize, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)

  let offset = 44
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    offset += 2
  }
  return new Blob([buffer], { type: 'audio/wav' })
}

/**
 * Décode un blob/fichier audio et rend le PCM mono ré-échantillonné + sa fréquence.
 * Étape commune à `splitAudio` et `splitAudioBlob` — isolée pour n'ouvrir qu'un
 * seul AudioContext par appel (un contexte non fermé fuit sur iOS).
 */
async function decodeMono(source: Blob): Promise<{ samples: Float32Array; sampleRate: number }> {
  const arrayBuffer = await source.arrayBuffer()
  const Ctor = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext
  const audioCtx = new Ctor()
  let audioBuffer: AudioBuffer
  try {
    audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
  } finally {
    audioCtx.close()
  }

  const sampleRate = Math.min(audioBuffer.sampleRate, TARGET_SAMPLE_RATE)

  const original = audioBuffer.getChannelData(0)
  const ratio = audioBuffer.sampleRate / sampleRate
  const resampledLength = Math.floor(original.length / ratio)
  const resampled = new Float32Array(resampledLength)
  for (let i = 0; i < resampledLength; i++) {
    const srcIndex = Math.floor(i * ratio)
    resampled[i] = original[Math.min(srcIndex, original.length - 1)]
  }
  return { samples: resampled, sampleRate }
}

function chunkSamples(resampled: Float32Array, sampleRate: number): Blob[] {
  const samplesPerChunk = Math.floor((CHUNK_BYTES - 44) / 2)
  const chunks: Blob[] = []
  if (resampled.length <= samplesPerChunk) {
    chunks.push(encodeWav(resampled, sampleRate))
  } else {
    let offset = 0
    while (offset < resampled.length) {
      const end = Math.min(offset + samplesPerChunk, resampled.length)
      chunks.push(encodeWav(resampled.subarray(offset, end), sampleRate))
      offset = end
    }
  }
  return chunks
}

/** Décode l'audio dans le navigateur, le ramène en mono 16 kHz, le coupe en segments WAV. */
export async function splitAudio(file: File): Promise<Blob[]> {
  const { samples, sampleRate } = await decodeMono(file)
  return chunkSamples(samples, sampleRate)
}

/**
 * Même chose pour un Blob de capture live (pas de nom de fichier).
 * Retourne 1 segment si l'enregistrement tient sous le seuil — l'appelant n'a
 * donc pas à traiter deux cas.
 */
export async function splitAudioBlob(blob: Blob): Promise<Blob[]> {
  const { samples, sampleRate } = await decodeMono(blob)
  return chunkSamples(samples, sampleRate)
}

/**
 * Ramène un enregistrement à UN seul WAV 16 kHz mono, sans découpe.
 * Utile quand on veut juste alléger avant l'envoi et qu'on sait que ça tiendra.
 * Retourne `null` si le décodage échoue (codec exotique, mémoire) — l'appelant
 * DOIT alors retomber sur le blob d'origine, jamais renoncer à l'envoi.
 */
export async function toMono16kWav(blob: Blob): Promise<Blob | null> {
  try {
    const { samples, sampleRate } = await decodeMono(blob)
    return encodeWav(samples, sampleRate)
  } catch (e: any) {
    console.warn('[audio-split] decode failed, keeping original:', e?.message || e)
    return null
  }
}

/** Estimation de durée (s) d'un WAV 16 kHz mono 16 bits, entête déduite. */
export function wavDurationSec(bytes: number, sampleRate = TARGET_SAMPLE_RATE): number {
  return Math.max(0, (bytes - 44) / 2 / sampleRate)
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PARTIE SERVEUR — DÉCOUPER SANS DÉCODEUR, SANS PERDRE UNE SECONDE
   ═══════════════════════════════════════════════════════════════════════════════
   Ajouté par l'agent B2, 2026-07-26.

   CE QUI A CHANGÉ DANS LA COMPRÉHENSION DU PROBLÈME.
   `gpt-4o-transcribe` a DEUX plafonds, pas un :
     · 25 Mo par fichier ;
     · **1400 secondes (23 min 20) de DURÉE** — mesuré le 26/07/2026 contre
       l'API réelle (cf. TRANSCRIBE_MAX_SECONDS). Un fichier de 30 Mo est refusé,
       mais un fichier de 9,9 Mo qui dure 40 min l'est AUSSI.
   Conséquence directe : à tout débit raisonnable (≤ 143 kbps), **c'est la durée
   qui plafonne, jamais la taille** (25 Mo / 1400 s = 143 kbps : en dessous, on
   atteint 1400 s avant 25 Mo). **Baisser le débit ne repousse donc RIEN** — c'est
   toute la raison pour laquelle le débit de capture a été remonté (B2).

   ET LE PIÈGE : découper un conteneur AUX OCTETS ne marche pas.
     · les morceaux 2..n ne sont plus des conteneurs valides (ni entête ni pistes) ;
     · le morceau 1 garde les métadonnées de durée de l'ORIGINAL → l'API refuse
       avec « audio duration … is longer than 1400 seconds » alors que le morceau
       ne dure que quelques minutes. Mesuré : une découpe naïve de 20 Mo prise
       dans un fichier d'1 h est refusée « Audio file might be corrupted or
       unsupported ».
   C'est exactement ce que faisait `splitAudioBuffer` (hérité de l'import).

   CE QUE FAIT CE MODULE À LA PLACE : une découpe qui respecte le conteneur.
     · WebM/Matroska (Chrome, Android — Opus) : on recopie l'entête (EBML + Info
       + Tracks) devant chaque paquet de Clusters, et on **réécrit le Timecode de
       chaque Cluster** pour qu'il reparte de zéro. Chaque morceau est un vrai
       fichier WebM qui déclare sa vraie (courte) durée.
     · MP4 fragmenté (Safari, iOS — AAC) : on recopie l'init (ftyp + moov) devant
       chaque paquet de fragments moof/mdat, et on **rebase le `baseMediaDecodeTime`
       de chaque `tfdt`** pour la même raison.
     · WAV : trivial (entête 44 octets + PCM).
     · Tout le reste : **on ne bricole pas**. On rend le fichier entier avec
       `splittable: false`, l'appelant le dit honnêtement, et l'ORIGINAL reste en
       Storage. Un rêve non transcrit est un problème ; un rêve massacré en est un
       pire, parce qu'il fait croire qu'on l'a.

   AUCUN RÉ-ENCODAGE, JAMAIS. Les octets audio sortent d'ici **bit pour bit**
   identiques à ceux qui sont entrés — on ne touche qu'aux horloges du conteneur.
   La qualité d'archive et la qualité envoyée à l'IA ne divergent donc pas : c'est
   le même son. Le jour où il faudrait alléger pour l'IA, on allégerait une COPIE.

   Isomorphe (Uint8Array pur, zéro DOM, zéro Node) : testable en ligne de commande,
   utilisable dans une route serverless.
   ═══════════════════════════════════════════════════════════════════════════════ */

/** Plafond dur de l'API OpenAI (transcriptions) — octets. */
export const TRANSCRIBE_MAX_BYTES = 25 * 1024 * 1024
/**
 * Plafond dur de l'API OpenAI (gpt-4o-transcribe) — **MESURÉ le 2026-07-26**
 * sur le compte d'INFUSE, pas lu quelque part :
 *   POST /v1/audio/transcriptions, fichier de 40 min (9,9 Mo, sous les 25 Mo)
 *   → 400 « audio duration 2400.0 seconds is longer than **1400 seconds** which
 *     is the maximum for this model »
 * La documentation publique annonce 1500 s ; la vraie valeur servie est 1400 s
 * (23 min 20). C'est celle-ci qui fait loi ici.
 */
export const TRANSCRIBE_MAX_SECONDS = 1400
/** Cible par morceau : 20 Mo (5 Mo de marge). */
export const PART_MAX_BYTES = 20 * 1024 * 1024
/**
 * Cible par morceau : 19 min — le chiffre que Tim voulait voir écrit. 260 s de
 * marge sous les 1400 s de l'API, assez pour absorber l'imprécision de
 * l'estimation de durée du dernier cluster/fragment.
 * Mesuré : un morceau de 19 min (9,1 Mo webm/opus) est accepté en 12,7 s ;
 * un morceau de 19 min (17,7 Mo mp4/aac) en 12,0 s.
 */
export const PART_MAX_SECONDS = 19 * 60

export type ContainerKind = 'webm' | 'mp4-fragmented' | 'mp4' | 'wav' | 'unknown'

export interface AudioPart {
  bytes: Uint8Array
  /** position du morceau dans l'enregistrement d'origine (s). */
  startSec: number
  /** durée du morceau (s), ou null si le conteneur ne permet pas de la connaître. */
  durationSec: number | null
}

export interface SplitForTranscriptionResult {
  container: ContainerKind
  parts: AudioPart[]
  /** false ⇒ un seul morceau, rendu tel quel : on n'a PAS su découper. */
  splittable: boolean
  totalSeconds: number | null
  /** dit en français ce qui s'est passé — finit dans les logs et dans l'erreur rendue au client. */
  note: string
}

/* ─────────────────────── outils binaires communs ─────────────────────── */

function readUintBE(b: Uint8Array, pos: number, len: number): number {
  let v = 0
  for (let i = 0; i < len; i++) v = v * 256 + b[pos + i]
  return v
}

function writeUintBE(b: Uint8Array, pos: number, len: number, value: number): void {
  let v = Math.max(0, Math.round(value))
  for (let i = len - 1; i >= 0; i--) { b[pos + i] = v % 256; v = Math.floor(v / 256) }
}

/** Réécrit une taille EBML sur une largeur imposée (marqueur inclus). */
function writeEbmlSize(b: Uint8Array, pos: number, len: number, value: number): void {
  let v = Math.max(0, Math.round(value))
  for (let i = len - 1; i >= 0; i--) { b[pos + i] = v % 256; v = Math.floor(v / 256) }
  b[pos] |= 0x80 >> (len - 1)
}

function fourCC(b: Uint8Array, pos: number): string {
  return String.fromCharCode(b[pos], b[pos + 1], b[pos + 2], b[pos + 3])
}

/* ═════════════════════════════ WebM / Matroska ═════════════════════════════ */

const ID_EBML = 0x1a45dfa3
const ID_SEGMENT = 0x18538067
const ID_CLUSTER = 0x1f43b675
const ID_INFO = 0x1549a966
const ID_TIMECODE_SCALE = 0x2ad7b1
const ID_DURATION = 0x4489
const ID_CLUSTER_TIMECODE = 0xe7

/** Enfants légitimes d'un Cluster — sert à retrouver sa fin quand sa taille est « inconnue ». */
const CLUSTER_CHILD_IDS = new Set<number>([
  0xe7,   // Timecode
  0xa3,   // SimpleBlock
  0xa0,   // BlockGroup
  0xab,   // PrevSize
  0xa7,   // Position
  0xaf,   // EncryptedBlock
  0xec,   // Void
  0xbf,   // CRC-32
  0x5854, // SilentTracks
])

function vintLength(first: number): number {
  if (first === 0) return 0
  let len = 1
  let mask = 0x80
  while (!(first & mask)) { mask >>= 1; len++ }
  return len
}

/** Lit un ID EBML (marqueur conservé — c'est ainsi que les IDs sont notés). */
function readEbmlId(b: Uint8Array, pos: number): { id: number; next: number } | null {
  if (pos >= b.length) return null
  const len = vintLength(b[pos])
  if (len === 0 || len > 4 || pos + len > b.length) return null
  return { id: readUintBE(b, pos, len), next: pos + len }
}

/** Lit une taille EBML (marqueur retiré). `unknown` = tous les bits à 1 (mode live). */
function readEbmlSize(b: Uint8Array, pos: number): { size: number; unknown: boolean; next: number } | null {
  if (pos >= b.length) return null
  const len = vintLength(b[pos])
  if (len === 0 || len > 8 || pos + len > b.length) return null
  let value = b[pos] & (0xff >> len)
  let allOnes = value === (0xff >> len)
  for (let i = 1; i < len; i++) {
    value = value * 256 + b[pos + i]
    if (b[pos + i] !== 0xff) allOnes = false
  }
  return { size: value, unknown: allOnes, next: pos + len }
}

interface WebmCluster {
  /** début de l'octet d'ID du Cluster. */
  start: number
  end: number
  /** offset ABSOLU de la valeur du Timecode, et sa largeur en octets. */
  tcOffset: number
  tcLen: number
  /** valeur du Timecode, en unités de TimecodeScale. */
  timecode: number
}

interface WebmParse {
  clusters: WebmCluster[]
  initEnd: number
  /** champ « taille » du Segment : on le corrige dans chaque morceau (sinon le
   *  morceau annonce la taille de l'original et le décodeur crie « file ended
   *  prematurely »). `unknown` = mode live, rien à corriger. */
  segment: { sizeOffset: number; sizeLen: number; unknown: boolean; contentStart: number }
  timecodeScaleNs: number
  /** champ Info>Duration, s'il existe (il est absent des enregistrements live). */
  durationField: { offset: number; len: number } | null
}

/** Cherche un élément à UN niveau donné, entre deux bornes. */
function findChild(b: Uint8Array, start: number, end: number, id: number): { valueOffset: number; size: number } | null {
  let p = start
  while (p < end) {
    const idr = readEbmlId(b, p)
    if (!idr) return null
    const szr = readEbmlSize(b, idr.next)
    if (!szr || szr.unknown) return null
    if (idr.id === id) return { valueOffset: szr.next, size: szr.size }
    p = szr.next + szr.size
  }
  return null
}

function parseWebm(b: Uint8Array): WebmParse | null {
  const hdr = readEbmlId(b, 0)
  if (!hdr || hdr.id !== ID_EBML) return null
  const hdrSize = readEbmlSize(b, hdr.next)
  if (!hdrSize || hdrSize.unknown) return null

  const seg = readEbmlId(b, hdrSize.next + hdrSize.size)
  if (!seg || seg.id !== ID_SEGMENT) return null
  const segSize = readEbmlSize(b, seg.next)
  if (!segSize) return null

  const segEnd = segSize.unknown ? b.length : Math.min(b.length, segSize.next + segSize.size)
  const clusters: WebmCluster[] = []
  let initEnd = -1
  let p = segSize.next

  while (p < segEnd) {
    const idr = readEbmlId(b, p)
    if (!idr) break
    const szr = readEbmlSize(b, idr.next)
    if (!szr) break

    if (idr.id === ID_CLUSTER) {
      if (initEnd < 0) initEnd = p
      const contentStart = szr.next
      const declaredEnd = szr.unknown ? -1 : Math.min(segEnd, contentStart + szr.size)

      // Un seul balayage des enfants : il donne le Timecode ET, en mode live
      // (taille inconnue), la fin réelle du Cluster.
      let tcOffset = -1
      let tcLen = 0
      let timecode = 0
      let q = contentStart
      const scanLimit = declaredEnd >= 0 ? declaredEnd : segEnd
      while (q < scanLimit) {
        const cid = readEbmlId(b, q)
        if (!cid) break
        if (declaredEnd < 0 && !CLUSTER_CHILD_IDS.has(cid.id)) break // début de l'élément suivant
        const csz = readEbmlSize(b, cid.next)
        if (!csz || csz.unknown) break
        if (cid.id === ID_CLUSTER_TIMECODE && tcOffset < 0) {
          tcOffset = csz.next
          tcLen = csz.size
          timecode = readUintBE(b, csz.next, csz.size)
        }
        q = csz.next + csz.size
        if (declaredEnd >= 0 && q >= declaredEnd) break
      }
      const end = declaredEnd >= 0 ? declaredEnd : q
      if (end <= p || tcOffset < 0) return null // conteneur non conforme → on ne bricole pas
      clusters.push({ start: p, end, tcOffset, tcLen, timecode })
      p = end
    } else {
      if (szr.unknown) break
      p = szr.next + szr.size
    }
  }

  if (!clusters.length || initEnd <= 0) return null

  let timecodeScaleNs = 1_000_000 // défaut Matroska : 1 ms
  let durationField: { offset: number; len: number } | null = null
  const segContentStart = segSize.next
  const infoEl = findChild(b, segContentStart, initEnd, ID_INFO)
  if (infoEl) {
    const ts = findChild(b, infoEl.valueOffset, infoEl.valueOffset + infoEl.size, ID_TIMECODE_SCALE)
    if (ts && ts.size > 0 && ts.size <= 8) timecodeScaleNs = readUintBE(b, ts.valueOffset, ts.size)
    const dur = findChild(b, infoEl.valueOffset, infoEl.valueOffset + infoEl.size, ID_DURATION)
    if (dur && (dur.size === 4 || dur.size === 8)) durationField = { offset: dur.valueOffset, len: dur.size }
  }

  return {
    clusters,
    initEnd,
    timecodeScaleNs,
    durationField,
    segment: { sizeOffset: seg.next, sizeLen: segSize.next - seg.next, unknown: segSize.unknown, contentStart: segSize.next },
  }
}

function webmTotalSeconds(b: Uint8Array, parsed: WebmParse): number | null {
  const tickSec = parsed.timecodeScaleNs / 1e9
  if (parsed.durationField) {
    const dv = new DataView(b.buffer, b.byteOffset, b.byteLength)
    const raw = parsed.durationField.len === 4
      ? dv.getFloat32(parsed.durationField.offset)
      : dv.getFloat64(parsed.durationField.offset)
    if (isFinite(raw) && raw > 0) return raw * tickSec
  }
  const cl = parsed.clusters
  if (cl.length < 2) return null
  // Dernier Cluster : on ne connaît que son début. On lui prête la durée moyenne
  // des précédents — l'erreur se compte en secondes, la marge en minutes.
  const last = cl[cl.length - 1].timecode * tickSec
  const avg = last / Math.max(1, cl.length - 1)
  return last + avg
}

function splitWebm(b: Uint8Array, maxBytes: number, maxSeconds: number): SplitForTranscriptionResult | null {
  const parsed = parseWebm(b)
  if (!parsed) return null
  const { clusters, initEnd } = parsed
  const tickSec = parsed.timecodeScaleNs / 1e9
  const totalSeconds = webmTotalSeconds(b, parsed)

  // Groupes de Clusters : on ferme dès qu'un ajout dépasserait l'un des deux plafonds.
  const groups: WebmCluster[][] = []
  let current: WebmCluster[] = []
  let groupBytes = initEnd
  for (const c of clusters) {
    const size = c.end - c.start
    const elapsed = current.length ? (c.timecode - current[0].timecode) * tickSec : 0
    if (current.length && (groupBytes + size > maxBytes || elapsed >= maxSeconds)) {
      groups.push(current)
      current = []
      groupBytes = initEnd
    }
    current.push(c)
    groupBytes += size
  }
  if (current.length) groups.push(current)

  const init = b.subarray(0, initEnd)
  const parts: AudioPart[] = groups.map((g, gi) => {
    const from = g[0].start
    const to = g[g.length - 1].end
    const out = new Uint8Array(initEnd + (to - from))
    out.set(init, 0)
    out.set(b.subarray(from, to), initEnd)

    // Le Segment doit annoncer SA taille, pas celle de l'original.
    if (!parsed.segment.unknown) {
      writeEbmlSize(
        out,
        parsed.segment.sizeOffset,
        parsed.segment.sizeLen,
        (initEnd - parsed.segment.contentStart) + (to - from)
      )
    }

    // Réécriture des horloges : chaque morceau repart de zéro. C'est CE geste qui
    // évite le « audio duration … is longer than 1400 seconds » sur les morceaux 2..n.
    const base = g[0].timecode
    for (const c of g) {
      const outTc = initEnd + (c.tcOffset - from)
      writeUintBE(out, outTc, c.tcLen, c.timecode - base)
    }

    const nextStart = gi + 1 < groups.length ? groups[gi + 1][0].timecode : null
    const spanTicks = nextStart != null
      ? nextStart - base
      : (totalSeconds != null ? Math.max(0, totalSeconds / tickSec - base) : null)
    const durationSec = spanTicks != null ? spanTicks * tickSec : null

    if (parsed.durationField && durationSec != null) {
      const dv = new DataView(out.buffer, out.byteOffset, out.byteLength)
      const ticks = durationSec / tickSec
      if (parsed.durationField.len === 4) dv.setFloat32(parsed.durationField.offset, ticks)
      else dv.setFloat64(parsed.durationField.offset, ticks)
    }

    return { bytes: out, startSec: base * tickSec, durationSec }
  })

  return {
    container: 'webm',
    parts,
    splittable: true,
    totalSeconds,
    note: `webm : ${clusters.length} clusters → ${parts.length} morceau(x), horloges remises à zéro`,
  }
}

/* ═════════════════════════ MP4 fragmenté (iOS/Safari) ═════════════════════ */

interface Mp4Box { type: string; start: number; end: number; bodyStart: number }

function readBox(b: Uint8Array, pos: number, limit: number): Mp4Box | null {
  if (pos + 8 > limit) return null
  const size32 = readUintBE(b, pos, 4)
  const type = fourCC(b, pos + 4)
  let size = size32
  let bodyStart = pos + 8
  if (size32 === 1) {
    if (pos + 16 > limit) return null
    size = readUintBE(b, pos + 8, 8)
    bodyStart = pos + 16
  } else if (size32 === 0) {
    size = limit - pos
  }
  if (size < 8 || pos + size > limit) return null
  return { type, start: pos, end: pos + size, bodyStart }
}

function topBoxes(b: Uint8Array): Mp4Box[] | null {
  const out: Mp4Box[] = []
  let p = 0
  while (p < b.length) {
    const box = readBox(b, p, b.length)
    if (!box) return out.length ? out : null
    out.push(box)
    p = box.end
  }
  return out
}

/** Descend dans les boîtes conteneurs pour trouver toutes les occurrences d'un type. */
function findBoxes(b: Uint8Array, start: number, end: number, path: string[]): Mp4Box[] {
  const found: Mp4Box[] = []
  let p = start
  while (p < end) {
    const box = readBox(b, p, end)
    if (!box) break
    if (box.type === path[0]) {
      if (path.length === 1) found.push(box)
      else found.push(...findBoxes(b, box.bodyStart, box.end, path.slice(1)))
    }
    p = box.end
  }
  return found
}

interface Tfdt { valueOffset: number; len: number; value: number }

function tfdtsOf(b: Uint8Array, moof: Mp4Box): Tfdt[] {
  return findBoxes(b, moof.bodyStart, moof.end, ['traf', 'tfdt']).map(box => {
    const version = b[box.bodyStart]
    const len = version === 1 ? 8 : 4
    const valueOffset = box.bodyStart + 4
    return { valueOffset, len, value: readUintBE(b, valueOffset, len) }
  })
}

function mediaTimescale(b: Uint8Array, moov: Mp4Box): number | null {
  const mdhds = findBoxes(b, moov.bodyStart, moov.end, ['trak', 'mdia', 'mdhd'])
  if (!mdhds.length) return null
  const box = mdhds[0]
  const version = b[box.bodyStart]
  const off = version === 1 ? box.bodyStart + 4 + 8 + 8 : box.bodyStart + 4 + 4 + 4
  const ts = readUintBE(b, off, 4)
  return ts > 0 ? ts : null
}

function splitFragmentedMp4(b: Uint8Array, maxBytes: number, maxSeconds: number): SplitForTranscriptionResult | null {
  const boxes = topBoxes(b)
  if (!boxes) return null
  const firstMoof = boxes.findIndex(x => x.type === 'moof')
  const moov = boxes.find(x => x.type === 'moov')
  if (firstMoof < 0 || !moov) return null

  const timescale = mediaTimescale(b, moov)
  if (!timescale) return null

  const initEnd = boxes[firstMoof].start

  // Un fragment = un moof + tout ce qui le suit jusqu'au moof suivant.
  interface Frag { start: number; end: number; tfdts: Tfdt[]; time: number }
  const frags: Frag[] = []
  for (let i = firstMoof; i < boxes.length; i++) {
    if (boxes[i].type === 'moof') {
      const tfdts = tfdtsOf(b, boxes[i])
      if (!tfdts.length) return null
      frags.push({ start: boxes[i].start, end: boxes[i].end, tfdts, time: tfdts[0].value })
    } else if (frags.length) {
      frags[frags.length - 1].end = boxes[i].end
    }
  }
  // Un seul fragment : on ne peut ni mesurer la durée (pas de second tfdt) ni
  // découper quoi que ce soit. On rend `null` → l'appelant enverra le fichier
  // entier et le dira. Aucun enregistrement long de Safari n'a cette forme
  // (MediaRecorder émet un fragment par `timeslice`).
  if (frags.length < 2) return null

  const lastDelta = frags.length > 1 ? frags[frags.length - 1].time - frags[frags.length - 2].time : 0
  const totalSeconds = (frags[frags.length - 1].time + lastDelta) / timescale

  const groups: Frag[][] = []
  let current: Frag[] = []
  let groupBytes = initEnd
  for (const f of frags) {
    const size = f.end - f.start
    const elapsed = current.length ? (f.time - current[0].time) / timescale : 0
    if (current.length && (groupBytes + size > maxBytes || elapsed >= maxSeconds)) {
      groups.push(current); current = []; groupBytes = initEnd
    }
    current.push(f)
    groupBytes += size
  }
  if (current.length) groups.push(current)

  const init = b.subarray(0, initEnd)
  const mehds = findBoxes(b, moov.bodyStart, moov.end, ['mvex', 'mehd'])
  const mvhds = findBoxes(b, moov.bodyStart, moov.end, ['mvhd'])

  const parts: AudioPart[] = groups.map((g, gi) => {
    const from = g[0].start
    const to = g[g.length - 1].end
    const out = new Uint8Array(initEnd + (to - from))
    out.set(init, 0)
    out.set(b.subarray(from, to), initEnd)

    // Rebase des horloges de décodage : sans ça, le morceau 3 prétend commencer
    // à 40 min et l'API compte 40 min + sa durée → refus à 1400 s.
    const base = g[0].time
    for (const f of g) {
      for (const t of f.tfdts) {
        writeUintBE(out, initEnd + (t.valueOffset - from), t.len, t.value - base)
      }
    }

    const nextTime = gi + 1 < groups.length ? groups[gi + 1][0].time : frags[frags.length - 1].time + lastDelta
    const durationSec = (nextTime - base) / timescale

    // mehd/mvhd déclarent parfois la durée totale : on la ramène à celle du morceau.
    for (const mehd of mehds) {
      const version = b[mehd.bodyStart]
      const len = version === 1 ? 8 : 4
      if (readUintBE(b, mehd.bodyStart + 4, len) > 0) {
        writeUintBE(out, mehd.bodyStart + 4, len, durationSec * timescale)
      }
    }
    for (const mvhd of mvhds) {
      const version = b[mvhd.bodyStart]
      const tsOff = version === 1 ? mvhd.bodyStart + 4 + 16 : mvhd.bodyStart + 4 + 8
      const durOff = version === 1 ? tsOff + 4 : tsOff + 4
      const durLen = version === 1 ? 8 : 4
      const movieTs = readUintBE(b, tsOff, 4)
      if (movieTs > 0 && readUintBE(b, durOff, durLen) > 0) {
        writeUintBE(out, durOff, durLen, durationSec * movieTs)
      }
    }

    return { bytes: out, startSec: base / timescale, durationSec }
  })

  return {
    container: 'mp4-fragmented',
    parts,
    splittable: true,
    totalSeconds,
    note: `mp4 fragmenté : ${frags.length} fragments → ${parts.length} morceau(x), tfdt rebasés`,
  }
}

/* ═════════════════════════════════ WAV ═════════════════════════════════ */

function splitWav(b: Uint8Array, maxBytes: number, maxSeconds: number): SplitForTranscriptionResult | null {
  if (b.length < 44 || fourCC(b, 0) !== 'RIFF' || fourCC(b, 8) !== 'WAVE') return null
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength)
  let p = 12
  let fmtOffset = -1
  let dataOffset = -1
  let dataSize = 0
  while (p + 8 <= b.length) {
    const id = fourCC(b, p)
    const size = dv.getUint32(p + 4, true)
    if (id === 'fmt ') fmtOffset = p + 8
    if (id === 'data') { dataOffset = p + 8; dataSize = Math.min(size, b.length - dataOffset); break }
    p += 8 + size + (size % 2)
  }
  if (fmtOffset < 0 || dataOffset < 0) return null

  const channels = dv.getUint16(fmtOffset + 2, true)
  const sampleRate = dv.getUint32(fmtOffset + 4, true)
  const byteRate = dv.getUint32(fmtOffset + 8, true) || sampleRate * channels * 2
  const bits = dv.getUint16(fmtOffset + 14, true) || 16
  const blockAlign = dv.getUint16(fmtOffset + 12, true) || (channels * bits) / 8
  if (!byteRate) return null

  const perPartRaw = Math.min(maxBytes - 44, Math.floor(maxSeconds * byteRate))
  const perPart = Math.max(blockAlign, Math.floor(perPartRaw / blockAlign) * blockAlign)
  const parts: AudioPart[] = []
  for (let off = 0; off < dataSize; off += perPart) {
    const len = Math.min(perPart, dataSize - off)
    const out = new Uint8Array(44 + len)
    const odv = new DataView(out.buffer)
    out.set(b.subarray(0, 44), 0) // entête d'origine, puis on corrige les tailles
    // Certains WAV ont des chunks entre fmt et data : on réécrit un entête canonique.
    for (let i = 0; i < 4; i++) out[i] = 'RIFF'.charCodeAt(i)
    odv.setUint32(4, 36 + len, true)
    for (let i = 0; i < 4; i++) out[8 + i] = 'WAVE'.charCodeAt(i)
    for (let i = 0; i < 4; i++) out[12 + i] = 'fmt '.charCodeAt(i)
    odv.setUint32(16, 16, true)
    odv.setUint16(20, 1, true)
    odv.setUint16(22, channels, true)
    odv.setUint32(24, sampleRate, true)
    odv.setUint32(28, byteRate, true)
    odv.setUint16(32, blockAlign, true)
    odv.setUint16(34, bits, true)
    for (let i = 0; i < 4; i++) out[36 + i] = 'data'.charCodeAt(i)
    odv.setUint32(40, len, true)
    out.set(b.subarray(dataOffset + off, dataOffset + off + len), 44)
    parts.push({ bytes: out, startSec: off / byteRate, durationSec: len / byteRate })
  }
  return {
    container: 'wav',
    parts,
    splittable: true,
    totalSeconds: dataSize / byteRate,
    note: `wav : ${parts.length} morceau(x) de ${Math.round(perPart / byteRate)} s`,
  }
}

/* ═══════════════════════════ point d'entrée unique ═══════════════════════ */

export function detectContainer(b: Uint8Array): ContainerKind {
  if (b.length < 12) return 'unknown'
  if (readUintBE(b, 0, 4) === ID_EBML) return 'webm'
  if (fourCC(b, 4) === 'ftyp') {
    const boxes = topBoxes(b)
    return boxes && boxes.some(x => x.type === 'moof') ? 'mp4-fragmented' : 'mp4'
  }
  if (fourCC(b, 0) === 'RIFF' && fourCC(b, 8) === 'WAVE') return 'wav'
  return 'unknown'
}

/**
 * DÉCOUPE POUR LA TRANSCRIPTION — sans jamais ré-encoder, sans jamais toucher à
 * l'original (l'entrée n'est pas modifiée : tout est écrit dans des copies).
 *
 * Rend TOUJOURS quelque chose d'exploitable :
 *   · un seul morceau si le fichier tient déjà sous les deux plafonds ;
 *   · N morceaux valides si le conteneur est connu ;
 *   · le fichier entier avec `splittable: false` sinon — à l'appelant de le dire
 *     honnêtement plutôt que d'envoyer une bouillie d'octets.
 */
export function splitForTranscription(
  input: Uint8Array,
  opts: { maxBytes?: number; maxSeconds?: number } = {}
): SplitForTranscriptionResult {
  const maxBytes = opts.maxBytes ?? PART_MAX_BYTES
  const maxSeconds = opts.maxSeconds ?? PART_MAX_SECONDS
  const container = detectContainer(input)

  let result: SplitForTranscriptionResult | null = null
  try {
    if (container === 'webm') result = splitWebm(input, maxBytes, maxSeconds)
    else if (container === 'mp4-fragmented') result = splitFragmentedMp4(input, maxBytes, maxSeconds)
    else if (container === 'wav') result = splitWav(input, maxBytes, maxSeconds)
  } catch (e: any) {
    result = null
  }

  if (!result) {
    return {
      container,
      parts: [{ bytes: input, startSec: 0, durationSec: null }],
      splittable: false,
      totalSeconds: null,
      note: `conteneur ${container} non découpable ici — envoyé entier, l'original reste intact`,
    }
  }
  return result
}

/**
 * DURÉE MAXIMALE RÉELLEMENT TRANSCRIPTIBLE, à un débit donné.
 * ────────────────────────────────────────────────────────────
 * · conteneur découpable (webm, mp4 fragmenté, wav) → **aucune limite de durée**
 *   tant que la fonction a le temps de traiter les morceaux (voir la route).
 * · conteneur non découpable → min(25 Mo / débit, 1400 s).
 * Exemple, Opus 64 kbps mono = 8 ko/s : 25 Mo = 3276 s, mais 1400 s plafonne
 * d'abord → **23 min 20**. C'est le chiffre à afficher au rêveur si jamais on tombe
 * sur un conteneur inconnu.
 */
export function maxTranscribableSeconds(bitsPerSecond: number, splittable: boolean): number | null {
  if (splittable) return null // pas de limite pratique
  const bytesPerSec = Math.max(1, bitsPerSecond / 8)
  return Math.min(TRANSCRIBE_MAX_BYTES / bytesPerSec, TRANSCRIBE_MAX_SECONDS)
}
