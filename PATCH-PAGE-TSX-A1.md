# PATCH-PAGE-TSX-A1 — spec d'application pour `src/app/mvp/page.tsx`

> **Agent A1 (couche 0-5, « plus jamais un rêve perdu ») · 2026-07-26**
> `page.tsx` appartient à **A4**. A1 n'y a touché à AUCUN moment. Ce document est la
> spec que **A8** appliquera mécaniquement, sur une version de `page.tsx` qui aura
> été restructurée par A4.
>
> ⚠️ **Les numéros de ligne sont indicatifs et déjà périmés** — ils ont bougé de
> ~140 lignes pendant la rédaction de ce doc (A4 travaille en parallèle). **Ancre-toi
> sur le texte de code, jamais sur la ligne.** Chaque bloc `CHERCHER` est unique dans
> le fichier au moment de l'écriture ; si A4 a réécrit le bloc, applique l'INTENTION
> décrite en tête de chaque patch.

## Table

| # | Site | Ligne (indicative, état 26/07 10h20) | Nature |
|---|---|---|---|
| 0 | imports | ~11-37 | ajout |
| 1 | `HomeScreen.processBlob` — l'Orbe / la nuit | ~980-1014 | **critique** |
| 2 | `AnimusScreen.processBlob` — le Cœur / la voix du jour | ~1171-1198 | **critique** |
| 3 | `startRec.onstop` — note de résonance | ~1964-1981 | important |
| 4 | `PendingSyncLine` → `PendingDeposits` | déf. ~943 · usage ~1099 | important |
| 5 | brouillon texte (3 `useState`) | ~970 · ~1155 · ~1314 | important |
| 6 | `PostDepotScreen.finalize` — rattacher l'audio | ~1441-1478 | recommandé |
| 7 | `useRecorder` — le débit à la source | ~284 | **le plus rentable** |

---

## Patch 0 — imports

**Intention** : rendre disponibles `capture-safety`, `draft-store` et `PendingDeposits`.

### CHERCHER
```tsx
/* Offline-first : file d'attente des dépôts (IndexedDB) + auto-flush au retour réseau. */
import { enqueueDeposit, getPendingCount, subscribe as subscribeQueue } from '@/lib/offline-queue'
```

### REMPLACER PAR
```tsx
/* Offline-first : file d'attente des dépôts (IndexedDB) + auto-flush au retour réseau. */
import { enqueueDeposit, getPendingCount, subscribe as subscribeQueue } from '@/lib/offline-queue'
/* A1 2026-07-26 — le rêve est mis à l'abri AVANT le moindre appel réseau.
   `safeguardRecording` ne throw jamais ; `transcribeSafely` choisit la route
   selon la taille (Vercel refuse tout corps > 4,5 Mo). Voir src/lib/capture-safety.ts. */
import { safeguardRecording, markTranscribed, markFailed, transcribeSafely, linkCaptureAudio } from '@/lib/capture-safety'
import { useDraft } from '@/lib/draft-store'
import PendingDeposits from '@/components/PendingDeposits'
```

> `getPendingCount` et `subscribeQueue` deviennent inutilisés une fois le patch 4
> appliqué → les retirer de l'import à ce moment-là (sinon : warning lint, pas d'erreur TS).

---

## Patch 1 — `HomeScreen.processBlob` (L'ORBE) ★ le site de la perte

**Intention.** Trois changements, dans cet ordre :
1. **mettre le blob à l'abri AVANT le `try`** (une ligne, jamais bloquante) ;
2. **choisir la route de transcription selon la taille** (`transcribeSafely`) — l'ancien code postait 7,7 Mo sur `/api/transcribe`, que Vercel refuse à l'entrée ;
3. **supprimer le test `networkDown`** : toute exception mène désormais à la file.

### CHERCHER
```tsx
  const processBlob = async (blob: Blob | null) => {
    if (!blob) { rec.reset(); return }
    setBusy(true); setErr(''); setSavedOffline(false)
    // §12bis.D — on capte les marqueurs « rêve suivant » AVANT reset (la détection
    // multi-rêves se fait ensuite sur l'écran de vérification A4 via split-night).
    const markers = rec.markers.slice()
    const durationSec = rec.seconds
    try {
      const fd = new FormData()
      fd.append('audio', new File([blob], 'dream.webm', { type: blob.type }))
      const res = await api('/api/transcribe', { method: 'POST', body: fd }, session)
      const { text: transcribed } = await res.json()
      rec.reset(); setBusy(false)
      if (transcribed && transcribed.trim().length > 2) onCaptured(transcribed.trim(), { markers, durationSec })
      else setErr(t('core.capture.errNothing'))
    } catch (e: any) {
      rec.reset(); setBusy(false)
      // LE cas sacré (§10 A3) : hors-ligne / réseau tombé → on ne perd JAMAIS le rêve.
      // L'audio complet part dans la file locale (IndexedDB) : transcribe → kairos →
      // upload audio se feront tout seuls au retour du réseau.
      const networkDown = (typeof navigator !== 'undefined' && !navigator.onLine) || e instanceof TypeError
      if (networkDown) {
        try {
          await enqueueDeposit({
            kind: 'dream', audioBlob: blob, mime: blob.type,
            kairosType: 'reve', captureMethod: markers.length ? 'mvp_voice' : 'mvp',
            markers, durationSec, fallbackText: t('core.offline.voiceFallback'),
          })
          setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
        } catch { setErr(t('core.capture.errTranscribe')) }
      } else {
        setErr(t('core.capture.errTranscribe'))
      }
    }
  }
```

### REMPLACER PAR
```tsx
  const processBlob = async (blob: Blob | null) => {
    if (!blob) { rec.reset(); return }
    setBusy(true); setErr(''); setSavedOffline(false)
    // §12bis.D — on capte les marqueurs « rêve suivant » AVANT reset (la détection
    // multi-rêves se fait ensuite sur l'écran de vérification A4 via split-night).
    const markers = rec.markers.slice()
    const durationSec = rec.seconds

    // ══ A1 2026-07-26 · LE PREMIER GESTE ══════════════════════════════════════
    // Le rêve est mis à l'abri (IndexedDB) et sa voix commence à monter vers le
    // Storage AVANT le moindre appel d'IA. Cette ligne ne throw jamais et ne
    // bloque rien : à partir d'ici, quoi qu'il arrive ensuite, rien n'est perdu.
    const localId = await safeguardRecording(blob, {
      kind: 'dream', kairosType: 'reve',
      captureMethod: markers.length ? 'mvp_voice' : 'mvp',
      fallbackText: t('core.offline.voiceFallback'),
      markers, durationSec,
    })

    try {
      // `transcribeSafely` choisit la route selon la taille : ≤ 4 Mo → /api/transcribe ;
      // au-delà → Storage puis /api/transcribe-from-storage. C'est exactement ici que
      // l'ancien code postait 7,7 Mo à Vercel, qui refuse tout corps > 4,5 Mo.
      const transcribed = await transcribeSafely(localId, blob)
      rec.reset(); setBusy(false)
      if (transcribed && transcribed.trim().length > 2) {
        // Le chemin rapide a gagné : la file cesse de vouloir créer un rêve en double,
        // elle finit juste de mettre la voix en lieu sûr.
        await markTranscribed(localId, transcribed.trim())
        onCaptured(transcribed.trim(), { markers, durationSec, localId })
      } else {
        // Rien de transcrit : on NE laisse PAS le dépôt en suspens, la file reprend.
        await markFailed(localId, 'transcription vide')
        setErr(t('core.capture.errNothing'))
      }
    } catch (e: any) {
      rec.reset(); setBusy(false)
      // ══ PLUS DE TEST `networkDown` ══════════════════════════════════════════
      // C'était LE bug : `e instanceof TypeError` n'est vrai que si `fetch` rejette.
      // Un 413/500/504 lève un `Error` ordinaire → le filet ne se déclenchait jamais
      // sur panne serveur, et c'est précisément ce qui est arrivé le 26/07.
      // Désormais : TOUTE exception mène à la file, sans exception.
      await markFailed(localId, String(e?.message || e))
      if (localId) {
        setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
      } else {
        // même IndexedDB est indisponible — dernier recours : l'ancien chemin
        try {
          await enqueueDeposit({
            kind: 'dream', audioBlob: blob, mime: blob.type,
            kairosType: 'reve', captureMethod: markers.length ? 'mvp_voice' : 'mvp',
            markers, durationSec, fallbackText: t('core.offline.voiceFallback'),
          })
          setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
        } catch { setErr(t('core.capture.errTranscribeSafe')) }
      }
    }
  }
```

### Deux ajustements liés

**(a) `onCaptured` porte maintenant un `localId`.** Signature de `HomeScreen` :

CHERCHER `onCaptured: (text: string, meta?: { markers?: number[]; durationSec?: number }) => void`
REMPLACER `onCaptured: (text: string, meta?: { markers?: number[]; durationSec?: number; localId?: string | null }) => void`

Puis **la même chose sur le handler racine** qui alimente `setDraft` (chercher l'implémentation de `onCaptured` passée à `<HomeScreen …>`) : y ajouter `localId` au draft, pour que le patch 6 puisse rattacher l'audio.
Si A4 a supprimé ou renommé `meta`, **le patch 6 devient optionnel** — l'audio reste retrouvable côté serveur via `capture_audio.local_id == kairos.client_dedup_id` (voir RAPPORT-A1 §5).

**(b) le message qui mentait.** Partout où `processBlob` affichait `t('core.capture.errTranscribe')`
(« la transcription a échoué — **réessaie ou écris-le** » : il n'y avait rien à réessayer,
le blob était détruit), utiliser `t('core.capture.errTranscribeSafe')` :
« je n'ai pas réussi à le transcrire — **ta voix est gardée, rien n'est perdu.** »
Clé déjà ajoutée en `fr` **et** `en`.

---

## Patch 2 — `AnimusScreen.processBlob` (LE CŒUR)

**Intention** : strictement la même que le patch 1, avec `kind: 'day'` / `kairosType: 'note_jour'` / `captureMethod: 'mvp_jour'`.

### CHERCHER
```tsx
  const processBlob = async (blob: Blob | null) => {
    if (!blob) { rec.reset(); return }
    setBusy(true); setErr(''); setSavedOffline(false)
    try {
      const fd = new FormData(); fd.append('audio', new File([blob], 'day.webm', { type: blob.type }))
      const res = await api('/api/transcribe', { method: 'POST', body: fd }, session)
      const { text: tx } = await res.json()
      rec.reset(); setBusy(false)
      if (tx && tx.trim().length > 2) onCaptured(tx.trim())
      else setErr(t('core.capture.errNothing'))
    } catch (e: any) {
      rec.reset(); setBusy(false)
      // Hors-ligne : la voix du cœur part aussi dans la file (note_jour) — rien n'est perdu.
      const networkDown = (typeof navigator !== 'undefined' && !navigator.onLine) || e instanceof TypeError
      if (networkDown) {
        try {
          await enqueueDeposit({
            kind: 'day', audioBlob: blob, mime: blob.type,
            kairosType: 'note_jour', captureMethod: 'mvp_jour',
            fallbackText: t('core.offline.voiceFallback'),
          })
          setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
        } catch { setErr(t('core.capture.errTranscribe')) }
      } else {
        setErr(t('core.capture.errTranscribe'))
      }
    }
  }
```

### REMPLACER PAR
```tsx
  const processBlob = async (blob: Blob | null) => {
    if (!blob) { rec.reset(); return }
    setBusy(true); setErr(''); setSavedOffline(false)
    // A1 — la voix du cœur est mise à l'abri avant tout appel réseau (cf. l'Orbe).
    const localId = await safeguardRecording(blob, {
      kind: 'day', kairosType: 'note_jour', captureMethod: 'mvp_jour',
      fallbackText: t('core.offline.voiceFallback'),
      durationSec: rec.seconds,
    })
    try {
      const tx = await transcribeSafely(localId, blob)
      rec.reset(); setBusy(false)
      if (tx && tx.trim().length > 2) {
        await markTranscribed(localId, tx.trim())
        onCaptured(tx.trim())
      } else {
        await markFailed(localId, 'transcription vide')
        setErr(t('core.capture.errNothing'))
      }
    } catch (e: any) {
      rec.reset(); setBusy(false)
      // Toute exception mène à la file — plus de distinction réseau/serveur.
      await markFailed(localId, String(e?.message || e))
      if (localId) {
        setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
      } else {
        try {
          await enqueueDeposit({
            kind: 'day', audioBlob: blob, mime: blob.type,
            kairosType: 'note_jour', captureMethod: 'mvp_jour',
            fallbackText: t('core.offline.voiceFallback'),
          })
          setSavedOffline(true); setTimeout(() => setSavedOffline(false), 4500)
        } catch { setErr(t('core.capture.errTranscribeSafe')) }
      }
    }
  }
```

---

## Patch 3 — note de résonance (`startRec` → `mr.onstop`)

**Intention** : une note de résonance est courte, mais rien ne l'y oblige. Aujourd'hui,
si la transcription échoue, le `catch` est **vide** (« la voix reste gardée même sans
transcription ») — or la voix n'est gardée nulle part tant que `resonanceAudio.current`
n'est pas posé, et pour `which === 'correct'` elle n'est **jamais** gardée.

### CHERCHER
```tsx
        setRecBusy(true)
        try {
          const fd = new FormData(); fd.append('audio', new File([blob], 'note.webm', { type: blob.type }))
          const res = await api('/api/transcribe', { method: 'POST', body: fd }, session)
          const { text: tx } = await res.json()
          if (tx && tx.trim()) {
            if (which === 'resonance') setResonanceText(p => (p ? `${p} ${tx.trim()}` : tx.trim()))
            else setCorrectionText(p => (p ? `${p} ${tx.trim()}` : tx.trim()))
          }
        } catch { /* la voix reste gardée même sans transcription */ }
        if (which === 'resonance') { try { resonanceAudio.current = { b64: await blobToB64(blob), mime } } catch {} }
        setRecBusy(false)
```

### REMPLACER PAR
```tsx
        setRecBusy(true)
        // A1 — la voix d'abord, l'IA ensuite. Le commentaire « la voix reste gardée »
        // était faux pour `which === 'correct'` : elle n'était gardée nulle part.
        const localId = await safeguardRecording(blob, {
          kind: 'day', kairosType: 'note_jour', captureMethod: `mvp_${which}`,
          fallbackText: t('core.offline.voiceFallback'),
        })
        try {
          const tx = await transcribeSafely(localId, blob)
          if (tx && tx.trim()) {
            if (which === 'resonance') setResonanceText(p => (p ? `${p} ${tx.trim()}` : tx.trim()))
            else setCorrectionText(p => (p ? `${p} ${tx.trim()}` : tx.trim()))
            await markTranscribed(localId, tx.trim())
          } else {
            await markFailed(localId, 'transcription vide')
          }
        } catch (e: any) {
          // La voix est réellement gardée, cette fois : elle est dans la file et
          // réécoutable depuis « en attente ».
          await markFailed(localId, String(e?.message || e))
        }
        if (which === 'resonance') { try { resonanceAudio.current = { b64: await blobToB64(blob), mime } } catch {} }
        setRecBusy(false)
```

---

## Patch 4 — `PendingSyncLine` → `PendingDeposits`

**Intention** : la ligne « N rêve(s) en attente » n'était **pas cliquable**. Si la file
butait, le rêveur regardait un chiffre. `PendingDeposits` garde exactement la même
discrétion (rien à l'écran quand la file est vide) mais devient une porte :
réécouter la voix · réessayer · l'écrire soi-même en écoutant · supprimer (avec confirmation).

### 4a — supprimer la définition

**SUPPRIMER** tout le bloc, du commentaire à l'accolade fermante :
```tsx
/* ───────── offline — ligne fine « N rêve(s) en attente de réseau, rien n'est perdu » (§10 A3) ─────────
   Honnête et discrète : n'apparaît que si la file locale contient un dépôt ; disparaît
   d'elle-même dès que la sync a vidé la file (abonnement à offline-queue). */
function PendingSyncLine() {
```
… jusqu'à la `}` qui ferme `function PendingSyncLine()` (≈ 19 lignes, se termine juste avant `function HomeScreen(`).

### 4b — remplacer l'usage

CHERCHER
```tsx
              {/* la promesse offline — ligne fine, jamais une carte, jamais masquée */}
              <PendingSyncLine />
```
REMPLACER PAR
```tsx
              {/* A1 — la promesse offline, devenue une PORTE : réécouter, réessayer,
                  écrire soi-même, supprimer. Même discrétion : rien quand la file est vide. */}
              <PendingDeposits />
```

> `PendingDeposits` est autonome (pas de prop, pas de session : tout vit en local).
> Il peut aussi être posé **une seconde fois** sur l'écran Cœur si A4 le souhaite —
> il ne s'affiche que s'il y a quelque chose à montrer.

---

## Patch 5 — brouillon texte (`useDraft`)

**Intention** : `useState('')` nu → tout perdu si l'OS tue la WebView. `useDraft`
restaure au montage, sauvegarde en debounce 400 ms, **et flush immédiatement sur
`pagehide` / `visibilitychange`** — le cas qui compte sur mobile. Il récupère aussi
les clés `dream_pending_*` orphelines écrites par l'ancien dernier recours et que
**aucune ligne du code ne relisait**.

Trois sites, tous du même modèle. Le 3ᵉ argument est le `clear()` à appeler **une fois
le dépôt réellement enregistré** (pas avant).

### 5a — `HomeScreen` (l'Orbe)
CHERCHER `  const [text, setText] = useState('')` *(le premier, dans `HomeScreen`)*
REMPLACER `  const [text, setText, clearDraftText] = useDraft('orbe')`

CHERCHER `  const submitText = () => { const v = text.trim(); if (v.length >= 3) { onCaptured(v); setText('') } }` *(le premier)*
REMPLACER `  const submitText = () => { const v = text.trim(); if (v.length >= 3) { onCaptured(v); clearDraftText() } }`

### 5b — `AnimusScreen` (le Cœur)
CHERCHER `  const [text, setText] = useState('')` *(le second, dans `AnimusScreen`)*
REMPLACER `  const [text, setText, clearDraftText] = useDraft('coeur')`

CHERCHER `  const submitText = () => { const v = text.trim(); if (v.length >= 3) { onCaptured(v); setText('') } }` *(le second)*
REMPLACER `  const submitText = () => { const v = text.trim(); if (v.length >= 3) { onCaptured(v); clearDraftText() } }`

> ⚠️ Les deux `CHERCHER` de 5a et 5b sont **identiques** : les appliquer dans l'ordre
> d'apparition (`HomeScreen` d'abord, `AnimusScreen` ensuite), pas en `replace_all`.

### 5c — `PostDepotScreen`
CHERCHER `  const [text, setText] = useState(draft.text)`
REMPLACER
```tsx
  // A1 — le texte relu/corrigé avant dépôt est lui aussi un brouillon à ne pas perdre.
  const [text, setText, clearDraftText] = useDraft('postDepot', draft.text)
```
Puis, dans `finalize()`, **après** `setSavedId(id)` (donc une fois le rêve réellement
créé côté serveur), ajouter `clearDraftText()`.

> Si `useDraft('postDepot', draft.text)` entre en conflit avec la logique de
> `setDraft` de A4 (texte piloté depuis la racine), **ne pas appliquer 5c** :
> 5a et 5b couvrent déjà le cas où l'on perd le plus (la saisie initiale).

### 5d — la clé morte
CHERCHER `        try { localStorage.setItem(\`dream_pending_${Date.now()}\`, text) } catch {}`
REMPLACER
```tsx
        // A1 — écrit dans un emplacement RELU au montage (`draft-store`). L'ancienne
        // clé `dream_pending_*` n'était relue par aucune ligne du code : les textes
        // y dormaient, inaccessibles. `draft-store` les récupère aussi.
        try { saveDraft('postDepot', text) } catch {}
```
… et ajouter `saveDraft` à l'import du patch 0 :
`import { useDraft, saveDraft } from '@/lib/draft-store'`

---

## Patch 6 — rattacher l'audio au rêve (recommandé)

**Intention** : quand le chemin rapide crée le rêve, l'audio est en Storage mais pas
encore relié à lui. Une ligne suffit. **Si le `localId` n'a pas pu être propagé
jusqu'ici (voir patch 1a), sauter ce patch** : l'audio reste retrouvable côté serveur
(`capture_audio.local_id` == `kairos.client_dedup_id`).

Dans `PostDepotScreen.finalize`, CHERCHER
```tsx
      setSavedId(id); setBusy(false); setPhase('ways')
      setDraft({ text, kairosId: id })
```
REMPLACER PAR
```tsx
      setSavedId(id); setBusy(false); setPhase('ways')
      // A1 — la voix rejoint le rêve (kairos_attachments kind='audio'). Best-effort :
      // si ça rate, l'audio reste retrouvable par client_dedup_id côté serveur.
      void linkCaptureAudio(draft.localId || null, id)
      setDraft({ text, kairosId: id })
```

---

## Patch 7 — `useRecorder` : le débit à la source ★ le meilleur rapport effort/effet

**Intention.** Une ligne, et le problème disparaît à 95 % pour les durées usuelles.
`new MediaRecorder(stream, { mimeType: mime })` **sans `audioBitsPerSecond`** laisse le
défaut du navigateur : Opus ~128 kbps = 16 ko/s. D'où 7,68 Mo pour 8 min, et le seuil
de bascule à 4 min 55.

En 32 kbps mono — le régime standard de la voix (WhatsApp, Discord) — on passe à
4 ko/s : **8 min = 1,92 Mo**, largement sous les 4,5 Mo. Le seuil de bascule recule de
**4 min 55 à ~19 min**. Coût CPU : nul. Coût RAM : nul. Latence : nulle.

> ⚠️ **À valider par un A/B** sur un vrai enregistrement de Tim (voix pâteuse au
> réveil) avant de considérer l'affaire close — je n'ai pas pu tester la qualité de
> transcription à 32 kbps. Si le rendu déçoit, monter à 48 kbps (8 min = 2,88 Mo,
> toujours sous la limite). **NON VÉRIFIÉ.**

### CHERCHER
```tsx
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const mr = new MediaRecorder(stream, { mimeType: mime })
```
### REMPLACER PAR
```tsx
      // A1 2026-07-26 — LE DÉBIT À LA SOURCE. Sans `audioBitsPerSecond`, le navigateur
      // choisit ~128 kbps : 8 min = 7,7 Mo, au-dessus de la limite de corps de requête
      // Vercel (4,5 Mo) — c'est l'origine directe de la perte du 26/07. En 32 kbps mono
      // (régime standard de la voix), 8 min = 1,9 Mo et le seuil recule à ~19 min.
      // Mono demandé aussi côté capture : la parole n'a pas besoin de stéréo.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const mr = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: 32000 })
```

> Idem pour le **second** `new MediaRecorder` du fichier (celui de `startRec`, note de
> résonance) : même remplacement, même justification.
>
> `audioBitsPerSecond` est ignoré silencieusement par les navigateurs qui ne le
> supportent pas — aucun risque de régression. Les couches 0-4 restent indispensables :
> ce patch réduit la fréquence du problème, il ne le supprime pas (un rêve de 40 min
> repasse au-dessus).

---

## Ordre d'application conseillé

1. **Patch 7** (1 ligne × 2, aucun risque, effet immédiat)
2. **Patch 0**, puis **1**, **2** (le cœur du sujet)
3. **Patch 4** (rend les blocages visibles et actionnables)
4. **Patch 5**, **3**, **6**

Après application : `npx tsc --noEmit` doit rendre **exactement une** erreur,
`src/components/CareCard 2.tsx(134,17)` — préexistante, fichier doublon iCloud,
étrangère à A1 comme à A4 (voir RAPPORT-A1 §7).
