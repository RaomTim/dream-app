# RAPPORT A1 — « plus jamais un rêve perdu »

> Agent A1 · Opus · 2026-07-26 · flotte de 8 sur `dream-alpha-app`
> Périmètre : couches 0 à 5 du plan de réparation (AUDIT-DREAM-2026-07-26.md §1).
> **Aucune ligne de `src/app/mvp/page.tsx` n'a été touchée** (propriété A4) → `PATCH-PAGE-TSX-A1.md`.

---

## 0. Statut d'ensemble

| Couche | Objet | Statut |
|---|---|---|
| **0** | ne jamais perdre le blob (IndexedDB avant tout réseau) | **full_green** — code livré, typé, `capture-safety.ts` |
| **1** | audio brut → Storage avant transcription | **full_green** — route + migrations **+ round-trip HTTP réel vérifié à 6 Mo** |
| **2** | transcription async + retry | **full_green** côté code · **partial** côté rail cron (voir §4) |
| **3** | chunking `splitAudio` extrait | **full_green** — `audio-split.ts`, ImportHub rebranché, comportement inchangé |
| **4** | UI de récupération | **full_green** — `PendingDeposits.tsx` |
| **5** | brouillon texte + récupération des clés orphelines | **full_green** — `draft-store.ts` |
| — | intégration dans `page.tsx` | **blocked (par conception)** — spec écrite, A8 applique |

**Rien n'est déployé.** Le repo n'est pas un dépôt git : pas de commit, pas de branche.
Le code vit sur le disque, les migrations SQL vivent **en base de production**.
« Écrit » ≠ « en ligne ». Il faut un `npx vercel --prod --yes` après application des patchs A4/A8.

---

## 1. Fichiers livrés

### Nouveaux
| Fichier | Rôle |
|---|---|
| `src/lib/capture-safety.ts` | l'API de 5 fonctions que `page.tsx` appelle. `safeguardRecording` ne throw **jamais**. |
| `src/lib/audio-split.ts` | `splitAudio` / `encodeWav` / `CHUNK_BYTES` extraits **tels quels** d'ImportHub, + `splitAudioBlob`, `toMono16kWav`. |
| `src/lib/draft-store.ts` | brouillon localStorage (debounce + flush sur `pagehide`) + hook `useDraft` + récupération des clés `dream_pending_*`. |
| `src/app/api/kairos/audio/signed-upload/route.ts` | `POST` → URL d'upload signée (corps ~200 o) · `PATCH` → rattache l'audio au rêve. |
| `src/app/api/transcribe-from-storage/route.ts` | transcription depuis un chemin Storage, retry backoff 2s/4s/8s, `maxDuration = 300`. |
| `src/components/PendingDeposits.tsx` | l'écran de récupération (réécouter · réessayer · écrire soi-même · supprimer). |

### Modifiés
| Fichier | Changement |
|---|---|
| `src/lib/offline-queue.ts` | **réécrit** — pipeline A/B/C/D, `storagePath` comme preuve, `listPending`, `secureAudioNow`, etc. |
| `src/app/api/transcribe/route.ts` | `export const maxDuration = 300` + en-tête documentant la limite Vercel + message d'erreur qui pointe vers la bonne route. |
| `src/components/ImportHub.tsx` | **uniquement** : suppression des 75 lignes dupliquées, remplacées par `import { splitAudio, CHUNK_BYTES } from '@/lib/audio-split'`. Zéro autre changement. |
| `src/lib/i18n/mvp/core.fr.json` · `core.en.json` | namespace `pending` (20 clés, dont 2 pluriels) + `capture.savedSafely` + `capture.errTranscribeSafe` + `offline.pendingOpen`. **Les 2 seules locales du projet** (`fr`, `en` — vérifié dans `i18n-provider.tsx:34-37`). |

`src/app/api/kairos/[id]/audio/route.ts` : **non modifié**. Son `MAX_BYTES = 20MB` est
inatteignable (Vercel coupe à 4,5 Mo) mais la route reste correcte pour les petits
audios et sert encore le `GET`. La remplacer aurait cassé des appels existants pour
zéro gain : le nouveau chemin ne passe simplement plus par elle.

---

## 2. Ce qui a été VÉRIFIÉ, et comment

### 2.1 Le mécanisme de la couche 1 — **round-trip HTTP réel, pas une supposition**
Contre le vrai projet Supabase (`rtrkxzcyblgonwgfzovj`), avec le service role de `.env.local` :

```
1. POST /storage/v1/object/upload/sign/kairos-attachments/{user}/capture/…  → token (387 car.)
2. PUT  …?token=…  avec 6 000 000 octets (5,8 Mo — AU-DESSUS des 4,5 Mo de Vercel)
   → HTTP 200 · 6 000 000 octets envoyés
3. list → l'objet existe, size 6000000, mimetype audio/webm
4. GET service-role (ce que fait transcribe-from-storage) → HTTP 200 · 6 000 000 reçus
5. DELETE → "Successfully deleted"  (objet de test nettoyé)
```
→ **Le chemin qui contourne Vercel fonctionne, mesuré, sur un volume qui aurait été refusé.**
L'URL que ma route construit (`${SUPABASE_URL}/storage/v1/object/upload/sign/${bucket}/${path}?token=${token}`)
est exactement celle qui a rendu 200. Je la construis côté serveur plutôt que de faire
confiance à `signed.signedUrl`, qui est relatif selon les versions de `supabase-js`.

### 2.2 État de la base — vérifié en SQL avant ET après
**Avant** (confirmation du diagnostic de l'audit) :
- `pg_policies where tablename='objects'` → **0 ligne** pour `kairos-attachments` (15 policies, toutes pour d'autres buckets). ✅ l'audit disait vrai.
- `storage.buckets.file_size_limit` pour `kairos-attachments` → **NULL**.
- `kairos_attachments` : `kairos_id` **NOT NULL**, FK `ON DELETE CASCADE`. `CHECK kind IN ('photo','audio')` **déjà en place** (la migration du 22/07 est appliquée).

**Après** :
```
storage_policies=5 · capture_audio_policies=4 · bucket_limit=104857600
capture_audio_cols=17 · kairos_new_cols=3 · grants_authenticated=7
```

### 2.3 Typecheck
`node_modules/` du projet est **entièrement corrompu** : chaque fichier porte un suffixe
` 2` (`index 2.js`, `package 2.json`…) — la même duplication iCloud/Finder déjà connue.
`react`, `next`, `typescript`, `@types/*` sont tous inutilisables. `npx tsc` télécharge le
paquet npm homonyme `tsc@2.0.4` (« This is not the tsc command you are looking for »).

→ J'ai monté un environnement de vérification isolé, **sans écrire dans le repo** :
`~/tscheck` avec `src` en **lien symbolique** vers le vrai `src`, le `tsconfig.json` copié
tel quel, et un `npm install` propre (typescript 5.5, react 18, next 14.2, @types/*, supabase-js, openai, @capacitor/*).

```
$ node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json
src/components/CareCard 2.tsx(134,17): error TS2322: …
EXIT=2
```
**275 fichiers de `src/` vérifiés · 1 seule erreur.**

Cette erreur est **préexistante et étrangère à A1** :
- fichier `src/components/CareCard 2.tsx`, mtime **23/07 01:05** ;
- `diff` contre `_snapshot_pre_fleet_2026-07-26/src/components/CareCard 2.tsx` → **identique** ;
- c'est un doublon iCloud de `CareCard.tsx`, jamais importé nulle part.

**Aucune erreur ne vient de mes fichiers.** Vérifié par `--listFiles` que les 8 sont bien dans le programme :
`capture-safety.ts`, `audio-split.ts`, `draft-store.ts`, `offline-queue.ts`, `PendingDeposits.tsx`, `ImportHub.tsx`, `signed-upload/route.ts`, `transcribe-from-storage/route.ts`.

> **Commande pour Tim** (une fois le disque nettoyé et `npm install` refait dans le repo) :
> ```bash
> cd ~/Dev/dream-alpha-app 2>/dev/null || cd "$HOME/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app"
> rm -rf node_modules && npm install && npx tsc --noEmit -p tsconfig.json
> ```
> Le doublon `CareCard 2.tsx` (et `core.en 2.json`) peut être supprimé sans risque : rien ne l'importe.

### 2.4 ImportHub — non-régression
`splitAudio` a été déplacé **caractère pour caractère** (mono, `Math.min(sampleRate, 16000)`,
`samplesPerChunk = (CHUNK_BYTES - 44) / 2`, même boucle de resample, même `encodeWav`).
Seuls changements dans ImportHub : la ligne d'import et la suppression des définitions locales.
Les 3 usages (`splitAudio(file)`, `file.size <= CHUNK_BYTES`, `f.size > CHUNK_BYTES`) sont intacts.

---

## 3. Ce que j'ai corrigé, précisément

### 3.1 Le filet qui ne se déclenchait jamais
`isNetworkError` ne sert plus **qu'à décider s'il faut arrêter la boucle de flush**.
Il ne décide plus jamais si l'on conserve un audio. **Toute exception mène à la file.**
Un commentaire de 6 lignes dans `offline-queue.ts` l'explique, pour qu'on ne le réintroduise pas.

### 3.2 `entry.audioBlob = null` sur 413 → supprimé
L'ancien code (l.332-337) détruisait la seule copie de l'audio sur un simple 413/400.
La règle est maintenant : **le blob n'est libéré que si `entry.storagePath` est un chemin
rendu par le serveur.** Un code HTTP ne prouve rien ; un chemin, si.

Corollaire, dans `enforceAudioBudget` : on n'évince **que** des audios déjà en Storage
(avant : dès que `text != null`, donc un rêve transcrit perdait sa voix). Budget relevé
de 50 à 200 Mo. Si rien n'est évinçable, on garde tout et on log — *une file grosse vaut
mieux qu'une voix perdue*.

### 3.3 L'ordre est une loi
Pipeline : **A. Storage → B. transcription → C. kairos → D. rattachement.**
`safeguardRecording` écrit en IndexedDB (attendu) puis lance `secureAudioNow` **en
parallèle** de la transcription live : dès la seconde où l'enregistrement s'arrête, la
voix commence à monter vers le serveur, quoi qu'il advienne du chemin rapide.

### 3.4 Le message qui mentait
`core.capture.errTranscribe` = « la transcription a échoué — **réessaie ou écris-le** ».
Il n'y avait rien à réessayer. Remplacé par `errTranscribeSafe` (fr + en) :
« je n'ai pas réussi à le transcrire — **ta voix est gardée, rien n'est perdu.** »

### 3.5 Le brouillon texte
`draft-store.ts` : debounce 400 ms **et flush immédiat sur `pagehide` / `beforeunload` /
`visibilitychange`** — le cas qui compte vraiment sur mobile (l'OS tue les WebViews sans
prévenir). Et il **récupère** les clés `dream_pending_*` orphelines avant de les nettoyer :
elles contiennent de vrais textes de rêveurs qu'aucune ligne du code ne relisait. Je ne
supprime jamais un orphelin lisible — seulement les vides et les périmés (>30 j).

---

## 4. Ce qui est `partial` ou `blocked` — dit sans enrobage

### 4.1 `partial` — le rail de reprise SERVEUR n'existe pas
Le brief prévoyait `/api/mvp/enrich-batch` comme rail. **Je ne l'ai pas modifié** (hors de
mes fichiers) et je l'ai lu : il ne traite que `kairos.numinosity_pending = true`. Il
**ne regarde pas** `capture_audio`. Donc :

- **La reprise marche** tant que le rêveur **rouvre l'app** : `startAutoFlush` relance
  toutes les 30 s, au retour du réseau, et à chaque retour au premier plan.
- **La reprise ne marche PAS** si le rêveur ne rouvre jamais l'app : un `capture_audio`
  en `pending` avec `kairos_id IS NULL` y restera. **L'audio n'est pas perdu** (il est en
  Storage, référencé, avec son `local_id`) — mais aucun rêve ne sera créé tout seul.

**À faire (hors périmètre A1)** : une route `/api/mvp/repair-capture-audio` qui, pour
chaque ligne `capture_audio` de plus de 15 min en `pending`/`failed` sans `kairos_id`,
transcrit puis crée le kairos avec `client_dedup_id = local_id` (la dé-duplication de
`/api/kairos` fait le reste — aucun risque de doublon avec un flush client tardif).
Requête de supervision prête à coller en §6.

### 4.2 `blocked (par conception)` — `page.tsx`
Les 6 fichiers livrés ne servent à rien tant que `PATCH-PAGE-TSX-A1.md` n'est pas appliqué.
`PendingDeposits` n'est importé nulle part ; `safeguardRecording` n'est appelé nulle part.
**Sans l'application des patchs, le bug du 26/07 est intact.**

### 4.3 Une correction au brief (et à l'audit)
> « forcer 16 kHz mono divise la taille par ~4 à l'émission — à lui seul ça aurait évité l'incident »

**C'est faux dans ce contexte**, et c'est important :
- l'enregistrement de départ est de l'**Opus 128 kbps** = 16 ko/s → 8 min = **7,68 Mo** ;
- un **WAV 16 kHz mono 16 bits** fait 32 ko/s → 8 min = **15,4 Mo**, soit **2× plus lourd**.

La division par 4 est vraie face à un PCM 48 kHz stéréo, pas face à de l'Opus.
La valeur de `splitAudio` n'est **pas** de compresser, c'est de **découper** : rendre
chaque morceau transmissible (3,6 Mo/segment). C'est écrit noir sur blanc dans l'en-tête
de `audio-split.ts` pour que personne ne s'y trompe.

**Le vrai levier « ÷4 » est ailleurs, et il coûte une ligne** : `audioBitsPerSecond: 32000`
sur le `MediaRecorder` (patch 7). 32 kbps mono est le régime standard de la voix
(WhatsApp, Discord). 8 min → **1,92 Mo**. Le seuil de bascule recule de **4 min 55 à ~19 min**.
Coût CPU nul, RAM nulle, latence nulle — contrairement au transcodage WAV qui coûte
~30 Mo de RAM temporaire et plusieurs secondes sur le chemin chaud.

**Ma recommandation** : patch 7 **oui**, transcodage systématique de la capture live en
16 kHz **non**. Le chunking reste disponible (`splitAudioBlob`) mais n'est utile que pour
un secours, et **uniquement après** que l'original soit sécurisé (couches 0 et 1).
⚠️ **NON VÉRIFIÉ** : la qualité de transcription à 32 kbps sur une voix pâteuse au réveil.
À valider par un A/B avant de clore. Repli : 48 kbps (8 min = 2,88 Mo, toujours sous la limite).

### 4.4 Autre écart avec l'audit — mineur
> « `/api/transcribe` est la SEULE route lourde du projet sans `maxDuration` »

Vérifié : **5 routes** appelant OpenAI/Anthropic n'ont pas de `maxDuration` —
`journal/categorize`, `journal/summon-kairos-wisdom`, `admin/circles/ephemeral-close`,
`kairos/[id]/forest-reading`, `transcribe`. (`portrait/narrative-reading` en a un via
`vercel.json`.) `transcribe` était bien la seule route **audio** dans ce cas. Les 4 autres
sont hors périmètre A1 — à signaler à qui de droit.

### 4.5 Deux limites assumées, écrites dans le code
- **Byte-slicing d'un WebM > 25 Mo** (`transcribe-from-storage`) : pas garanti pour un
  conteneur. C'est le comportement de `import-from-storage` en prod ; je ne fais pas pire,
  et **l'original reste intact en Storage** dans tous les cas. Concerne >26 min d'Opus 128k.
- **Les policies RLS Storage ne sont probablement pas strictement requises** pour l'upload
  signé : le jeton est émis par le service role et porte ses droits. Je les ai posées quand
  même — le bucket n'en avait **aucune** (0 ligne), ce qui rendait tout accès client
  impossible et toute évolution future piégeuse. Défense en profondeur, coût nul.

---

## 5. Migrations SQL appliquées (en PROD, `rtrkxzcyblgonwgfzovj`)

### `a1_kairos_attachments_storage_policies`
- `storage.buckets.file_size_limit = 104857600` (100 Mo) pour `kairos-attachments` (était `NULL` → hérité, non déterministe) ;
- 5 policies sur `storage.objects` : `owner_insert` / `owner_select` / `owner_update` / `owner_delete` (rôle `authenticated`, `foldername(name)[1] = auth.uid()`) + `service_all`.
- Convention de chemin respectée par tout le code existant : `{user_id}/kairos/…`, `{user_id}/resonance/…`, et désormais `{user_id}/capture/{local_id}/{ts}.{ext}`.

### `a1_capture_audio_registry_and_transcription_status`
- table `public.capture_audio` (17 colonnes), `unique (user_id, local_id)`, RLS + 4 policies owner-only + **GRANT explicite** à `authenticated` *(leçon `community` du 25/07 : RLS sans GRANT = lecture vide EN SILENCE)* ;
- 3 index dont deux partiels : `(transcription_status, created_at) where status in ('pending','failed')` et `(created_at) where kairos_id is null` — les deux requêtes du futur cron de réparation ;
- `kairos` : `transcription_status` (+ CHECK), `transcription_attempts`, `transcription_error`.

**Pourquoi une nouvelle table plutôt que `kairos_attachments`** — le brief demandait
d'y écrire directement. C'est **impossible** : `kairos_attachments.kairos_id` est
`NOT NULL` (FK CASCADE, vérifié). Or l'ordre sacré veut que l'audio soit sauvé **avant**
que le rêve n'existe. `capture_audio` est le registre **amont** ; `kairos_attachments`
reste la vue **aval** (audio d'un rêve existant) et est écrite par le `PATCH`, sans
aucun changement de son schéma.

**La clé qui recolle tout** : `entry.id` (IndexedDB) == `kairos.client_dedup_id` == `capture_audio.local_id`.
Même si le rattachement D n'a jamais lieu, un `UPDATE` d'une ligne suffit à réunir un audio et son rêve.

---

## 6. `vercel.json` — ce que je veux, que **A8** appliquera

Je n'ai **pas** touché `vercel.json` (A5 est peut-être dessus). Deux ajouts :

```jsonc
// dans "functions"
"src/app/api/transcribe-from-storage/route.ts": { "maxDuration": 300 },
"src/app/api/transcribe/route.ts":              { "maxDuration": 300 },
```
> Redondant avec les `export const maxDuration = 300` que j'ai posés (Next les honore
> sur Vercel), mais le projet déclare ses routes lourdes ici — autant rester cohérent.
> **Si un conflit apparaît avec A5, les `export` suffisent : ne pas se battre pour ça.**

Et, **quand la route de réparation existera** (§4.1) :
```jsonc
// dans "crons"
{ "path": "/api/mvp/repair-capture-audio?cron_secret=$CRON_SECRET", "schedule": "*/10 * * * *" }
```

---

## 7. Protocole de test manuel — 5 min sur le téléphone de Tim

> **Prérequis** : patchs de `PATCH-PAGE-TSX-A1.md` appliqués **et** déployés
> (`npx vercel --prod --yes`). Sans ça, ces tests reproduisent le bug, ils ne le testent pas.

### Test A — l'enregistrement de 10 min (le cas exact du 26/07) · 2 min
1. Ouvrir Dream, écran Orbe. Maintenir la lune, **parler ou laisser tourner un podcast 10 minutes**, relâcher.
2. **Attendu** : « je l'écris… » puis le texte apparaît sur l'écran de vérification.
   Aucune erreur rouge. *(Avant : erreur, et le rêve n'existait plus nulle part.)*
3. Coller ceci pour voir la voix arrivée côté serveur :
```sql
select local_id, round(bytes/1024.0/1024,2) as mo, duration_sec,
       transcription_status, transcription_attempts, kairos_id is not null as rattache, created_at
from capture_audio order by created_at desc limit 5;
```
→ une ligne, `transcription_status = 'done'`, `mo` ≈ 2 (avec patch 7) ou ≈ 9,6 (sans).

### Test B — couper le wifi en plein milieu · 1 min 30
1. Démarrer un enregistrement. **Vers 1 min : activer le mode avion.** Continuer à parler 30 s. Relâcher.
2. **Attendu** : « Gardé sur le téléphone — il partira tout seul. »
3. Sur l'accueil, la ligne « 1 rêve en attente » est maintenant **cliquable** (« voir ce qui attend → »).
   La toucher → **le lecteur audio joue le rêve**. C'est la preuve visible qu'il est là.
4. Couper le mode avion. **Sous 30 s**, la ligne disparaît toute seule et le rêve apparaît dans le fil.

### Test C — tuer l'app en pleine transcription · 1 min
1. Enregistrer ~1 min, relâcher, et **pendant** « je l'écris… », **fermer l'app de force**
   (balayage dans le sélecteur d'apps).
2. Rouvrir Dream.
3. **Attendu** : la ligne « en attente » est là, l'audio est réécoutable, et la reprise
   se fait toute seule en quelques secondes. *(Avant : disparition totale.)*

### Test D — le brouillon écrit · 30 s
1. Écran Orbe, **tap court** sur la lune (mode écriture). Taper 3 lignes. **Ne pas déposer.**
2. Basculer vers une autre app, puis **fermer Dream de force**. Rouvrir.
3. **Attendu** : le texte est **toujours là**. *(Avant : perdu.)*

### Test E — les textes orphelins déjà écrits · 10 s
Si Tim a déjà perdu un texte via l'ancien `dream_pending_*`, il réapparaît au premier
montage du champ d'écriture (`draft-store` les relit avant de nettoyer). Rien à faire.

### Vérification finale — une requête
```sql
select
  (select count(*) from capture_audio)                                             as audios_captures,
  (select count(*) from capture_audio where transcription_status='done')           as transcrits,
  (select count(*) from capture_audio where kairos_id is null)                     as pas_encore_rattaches,
  (select count(*) from kairos_attachments where kind='audio')                     as audios_rattaches;
```
Avant A1 : `kairos_attachments` = **0 ligne, tous kinds confondus**. Toute valeur > 0 sur
la dernière colonne est une première dans l'histoire de l'app.

---

## 8. Ce qu'un futur agent doit savoir avant de toucher à ça

1. **`entry.audioBlob = null` sans `entry.storagePath` = un rêve détruit.** C'est la seule
   règle qui compte dans `offline-queue.ts`.
2. **Ne jamais se servir de `isNetworkError` pour décider de conserver un audio.** C'est
   le bug d'origine, sous une autre forme.
3. **`kairos_attachments.kairos_id` est NOT NULL** — on ne peut rien y écrire avant que le
   rêve n'existe. D'où `capture_audio`.
4. **Vercel refuse tout corps > 4,5 Mo**, avant la fonction. Un `MAX_BYTES` dans le code
   d'une route ne protège de rien au-delà de ce seuil : il ne s'exécute jamais.
5. **`node_modules/` du repo est corrompu** (suffixes ` 2` partout, éviction iCloud).
   `npx tsc` installe un paquet homonyme inutile. Refaire `rm -rf node_modules && npm install`,
   ou monter un `~/tscheck` avec `src` en symlink (§2.3).
