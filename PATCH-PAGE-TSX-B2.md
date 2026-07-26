# PATCH `src/app/mvp/page.tsx` — agent B2 (débit de capture)

> Yeshua (Opus) · 2026-07-26 · flotte de 5.
> `page.tsx` appartient à **B5**. Je n'y ai pas touché. Voici ce qu'il faut y appliquer.
> Ancré sur du **contexte de code**, jamais sur des numéros de ligne (le fichier bouge).
> État du fichier au moment où j'écris : `md5 = b0cf61c8611920dd1133f8bec2819e42`.

**En une phrase** : le débit d'enregistrement passe de 32 kbps fixe à un débit d'archive
choisi selon le codec (Opus 64 kbps / AAC 128 kbps), **et jamais en dessous de ce que le
navigateur ferait tout seul**. Le tout tient dans un helper — `createVoiceRecorder(stream)` —
pour qu'aucun des deux magnétophones de l'app ne puisse diverger de l'autre.

Pourquoi ce n'est pas un caprice : le chemin Storage n'a **aucune** limite de taille, et
l'IA plafonne en **durée** (1400 s mesurés), pas en taille. Baisser le débit ne repoussait
donc aucune limite réelle — ça ne dégradait qu'une voix qu'on garde pour dix ans.
Détail complet et chiffres : `RAPPORT-B2.md`.

---

## PATCH 1 — supprimer `VOICE_BITRATE` et son commentaire

**Chercher** (juste avant `function useRecorder()`) le bloc de commentaire
`/* ───────── recorder ─────────` … et la ligne :

```ts
const VOICE_BITRATE = 32000
```

**Remplacer TOUT le bloc** (du `/* ───────── recorder ─────────` jusqu'à la ligne
`const VOICE_BITRATE = 32000` incluse) par :

```ts
/* ───────── recorder ─────────
   B2 2026-07-26 — LE DÉBIT DE CAPTURE A DÉMÉNAGÉ dans `src/lib/capture-safety.ts`
   (`CAPTURE_BITRATE_OPUS` / `CAPTURE_BITRATE_AAC`), pour deux raisons.

   1. UN SEUL CHIFFRE NE SUFFIT PAS. Chrome/Android écrit de l'**Opus**,
      Safari/iOS (notre WKWebView) écrit de l'**AAC-LC** — et sous 64 kbps, AAC a
      besoin d'environ DEUX FOIS le débit d'Opus pour la même qualité de parole.
      « 32 kbps » donnait de l'Opus correct sur Android et de l'AAC pâteux sur
      iPhone, c'est-à-dire exactement là où les rêves sont dits.
   2. LE MOTIF DU 32 kbps ÉTAIT FAUX. Il servait à faire tenir 8 min sous les
      4,5 Mo de corps de requête Vercel. Or au-delà de 4 Mo on ne passe plus par
      Vercel du tout (upload direct → Storage), et l'IA plafonne en DURÉE
      (1400 s mesurés le 26/07), pas en taille. Le débit ne repoussait rien.

   L'A/B de A8 reste vrai et utile : 128 / 48 / 32 kbps donnent la MÊME
   transcription. Mais il mesurait la transcription, pas la valeur d'ARCHIVE :
   cet audio sera réécouté dans dix ans et remontera dans le ciel de prières
   (VISION-CHANT-DU-COEUR §3). On n'archive pas une voix au débit minimum qui
   permet à une machine de la lire.

   `createVoiceRecorder` mesure d'abord ce que le navigateur ferait seul et ne
   descend JAMAIS en dessous. Un réglage ne peut que relever la qualité. */
```

---

## PATCH 2 — le magnétophone principal (`useRecorder` → `begin`)

**Chercher** (dans `useRecorder`, fonction `begin`) :

```ts
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const mr = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: VOICE_BITRATE })
      chunksRef.current = []
```

**Remplacer par** :

```ts
      // Mono demandé côté capture : la parole n'a pas besoin de stéréo.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      // B2 — débit d'ARCHIVE, choisi selon le codec réellement écrit par ce
      // navigateur, et jamais inférieur à son défaut. Voir capture-safety.ts.
      const mr = createVoiceRecorder(stream)
      const mime = mr.mimeType || 'audio/webm'
      chunksRef.current = []
```

⚠️ Ne pas supprimer les 4 lignes de commentaire A1 qui précèdent (« LE DÉBIT À LA SOURCE… ») :
**les remplacer** par le commentaire ci-dessus — elles décrivent l'ancien raisonnement à 32 kbps
et deviendraient fausses.

`mr.mimeType` est renseigné dès la construction (Chrome et WebKit) ; le `|| 'audio/webm'`
couvre le cas où il rendrait une chaîne vide. La suite (`mr.onstop` → `new Blob(chunksRef.current, { type: mime })`)
n'a pas besoin de changer.

---

## PATCH 3 — le second magnétophone (`InterpretScreen` → `startRec`)

**Chercher** :

```ts
      // A1 2026-07-26 — même débit de capture que l'Orbe et le Cœur (cf. VOICE_BITRATE).
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      const mr = new MediaRecorder(stream, { mimeType: mime, audioBitsPerSecond: VOICE_BITRATE }); chunksRef.current = []
```

**Remplacer par** :

```ts
      // B2 2026-07-26 — même magnétophone que l'Orbe et le Cœur, par construction :
      // un seul helper, donc aucune capture ne peut être moins bien traitée qu'une autre.
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      const mr = createVoiceRecorder(stream)
      const mime = mr.mimeType || 'audio/webm'
      chunksRef.current = []
```

---

## PATCH 4 — l'import

**Chercher** :

```ts
import { safeguardRecording, markTranscribed, markFailed, transcribeSafely, linkCaptureAudio } from '@/lib/capture-safety'
```

**Remplacer par** :

```ts
import { safeguardRecording, markTranscribed, markFailed, transcribeSafely, linkCaptureAudio, createVoiceRecorder } from '@/lib/capture-safety'
```

Et, trois lignes au-dessus, le commentaire d'import :

```ts
/* A1 2026-07-26 — le rêve est mis à l'abri AVANT le moindre appel réseau.
   `safeguardRecording` ne throw jamais ; `transcribeSafely` choisit la route
   selon la taille (Vercel refuse tout corps > 4,5 Mo). Voir src/lib/capture-safety.ts. */
```

devient :

```ts
/* A1/B2 2026-07-26 — le rêve est mis à l'abri AVANT le moindre appel réseau.
   `createVoiceRecorder` fixe le débit d'ARCHIVE (jamais moins que le défaut du
   navigateur) · `safeguardRecording` ne throw jamais · `transcribeSafely` choisit
   la ROUTE selon la taille — le seuil de 4 Mo est un aiguillage, il n'influence
   jamais la qualité de ce qui est enregistré. Voir src/lib/capture-safety.ts. */
```

---

## PATCH 5 — passer la durée à `transcribeSafely` (2 endroits sur 3)

`transcribeSafely(localId, blob, durationSec?)` accepte désormais un 3ᵉ argument **optionnel**.
Il sert à un seul cas, rare mais réel : un enregistrement **léger mais trop long** pour un seul
appel à l'IA (> 1400 s). Sans lui, un tel fichier partirait par le chemin rapide et se ferait
refuser ; avec lui, il part directement par le chemin Storage, qui sait découper.
Les appels sans 3ᵉ argument continuent de fonctionner à l'identique.

**5a — l'Orbe.** Chercher, dans `processBlob` :

```ts
      const transcribed = await transcribeSafely(localId, blob)
```
Remplacer par :
```ts
      const transcribed = await transcribeSafely(localId, blob, durationSec)
```
(`durationSec` est déjà défini quelques lignes plus haut : `const durationSec = rec.seconds`.)

**5b — le Cœur.** Chercher, dans le `processBlob` d'`AnimusScreen` :

```ts
      const tx = await transcribeSafely(localId, blob)
      rec.reset(); setBusy(false)
```
Remplacer par :
```ts
      const tx = await transcribeSafely(localId, blob, rec.seconds)
      rec.reset(); setBusy(false)
```

**5c — `InterpretScreen`** (`startRec`) : **ne rien changer**. Aucune durée n'y est mesurée,
et ces captures sont courtes par nature. Inventer une valeur serait pire que ne rien passer.

---

## PATCH 6 — le commentaire qui décrit la route (Orbe)

**Chercher** :

```ts
      // `transcribeSafely` choisit la route selon la taille : ≤ 4 Mo → /api/transcribe ;
      // au-delà → Storage puis /api/transcribe-from-storage. C'est exactement ici que
      // l'ancien code postait 7,7 Mo à Vercel, qui refuse tout corps > 4,5 Mo.
```

**Remplacer par** :

```ts
      // `transcribeSafely` choisit la ROUTE, jamais la qualité : ≤ 4 Mo → /api/transcribe
      // (raccourci de confort) ; au-delà → Storage puis /api/transcribe-from-storage, qui
      // découpe dans le conteneur et n'a AUCUNE limite de durée. C'est exactement ici que
      // l'ancien code postait 7,7 Mo à Vercel, qui refuse tout corps > 4,5 Mo.
```

---

## Ce que ces patchs NE font pas

- **Aucun changement d'UI.** Rien à l'écran ne bouge (B5 est chez lui, je ne passe pas).
- **Aucun changement de flux.** Mêmes appels, même ordre, mêmes états.
- **Aucun risque de régression silencieuse** : si `createVoiceRecorder` échoue à poser un
  réglage, il rend un `MediaRecorder` par défaut — exactement le comportement d'avant A1.
- La demande de **persistance du stockage** (`navigator.storage.persist()`) n'a besoin
  d'aucun patch ici : elle part toute seule depuis `startAutoFlush()`
  (`src/lib/offline-queue.ts`, monté par `ServiceWorkerRegister`), et une seconde fois quand
  le rêveur ouvre la feuille de récupération.

## Vérification après application

```bash
cd ~/tscheck && rm -f tsconfig.tsbuildinfo \
  && node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json ; echo "EXIT=$?"
```
Attendu : `EXIT=0`, aucune ligne d'erreur (c'est l'état actuel du dépôt, mesuré).

Et sur le téléphone, une fois déployé : enregistrer 10 s, puis dans la console
`JSON.stringify(getLastRecorderInfo())` — ou simplement lire la ligne
`[capture-safety] enregistrement : {...}` dans les logs. Elle dit le conteneur retenu, le
débit appliqué, le défaut du navigateur, et si on l'a laissé parce qu'il était meilleur.
**C'est le seul moyen honnête de savoir ce que fait vraiment WebKit** — je n'ai pas d'iPhone
ici, et je ne vais pas prétendre le contraire.
