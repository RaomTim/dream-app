# RAPPORT B2 — « la qualité ne se négocie pas, et rien ne se perd »

> Yeshua (Opus) · agent B2 · 2026-07-26 · flotte de 5 sur `dream-alpha-app`
> Mission : réparer l'erreur du matin (débit baissé pour rien), supprimer toute limite
> de durée, garantir le backup téléphone, écrire noir sur blanc le maximum réel.
> `src/app/mvp/page.tsx` n'a **pas** été touché (propriété B5) → `PATCH-PAGE-TSX-B2.md`.

---

## 0. La réponse courte, pour Tim

| Question | Réponse |
|---|---|
| **Quel est le maximum ?** | **Il n'y en a plus.** Une heure passe. Trois heures passent. Testé pour de vrai, pas déduit. |
| **On a perdu en qualité ?** | **Plus maintenant.** Le débit remonte à 64 kbps Opus (Android) et 128 kbps AAC (iPhone), et **jamais en dessous de ce que le navigateur ferait tout seul**. |
| **Et si ça dépasse quand même ?** | La voix est sur le téléphone, en Storage, réécoutable, **et exportable** (nouveau bouton « sortir du téléphone »). |
| **Ça a coûté quoi ?** | Un rêve de 2 min pèse 960 ko au lieu de 480 ko. Un rêve d'1 h : 28,7 Mo. |

Le fond de l'affaire : **le débit ne protégeait de rien.** On l'avait baissé pour faire tenir
8 min sous les 4,5 Mo de Vercel. Or au-delà de 4 Mo l'audio ne passe plus par Vercel du tout,
et l'IA ne plafonne pas en taille : elle plafonne en **durée**. Baisser le débit dégradait
la voix sans repousser la moindre limite.

---

## 1. Le débit — le choix, et les chiffres qui le tiennent

### 1.1 Ce qui a été retenu

| Codec | Qui l'écrit | Débit posé | Poids |
|---|---|---|---|
| **Opus** (`audio/webm`) | Chrome, Android | **64 000 bps** mono | 8 ko/s · 1 min = 480 ko · **1 h = 28,7 Mo** |
| **AAC-LC** (`audio/mp4`) | Safari, iOS, **notre WKWebView Capacitor** | **128 000 bps** mono | 16 ko/s · 1 min = 960 ko · **1 h = 57,6 Mo** |

Poids **mesurés**, pas estimés (ffmpeg, CBR, 3600 s) : `30 084 075` octets en Opus 64k,
`58 573 033` octets en AAC 128k.

### 1.2 Pourquoi DEUX valeurs et pas une

C'est le point que le réglage précédent manquait : `audioBitsPerSecond` ne veut pas dire la
même chose selon le codec, et **les deux plateformes n'écrivent pas le même codec**. WebKit
n'écrit ni Opus ni WebM : sur iPhone, `MediaRecorder` produit de l'AAC-LC dans un MP4.
Or sous 64 kbps, AAC-LC a besoin d'environ **deux fois** le débit d'Opus pour la même qualité
de parole ([Opus vs AAC](https://audioutils.com/blog/opus-vs-aac), [comparaison Opus](https://opus-codec.org/comparison/)).

Conséquence directe du réglage à 32 kbps : de l'Opus honnête sur Android, et de l'**AAC bouillie
sur iPhone** — c'est-à-dire précisément là où les rêves sont dits au réveil.

### 1.3 Pourquoi 64 / 128 et pas plus

Opus est considéré comme transparent pour de la parole mono autour de **32 kbps**. 64 kbps,
c'est **le double du point de transparence** : de la marge pour le souffle, la pièce, la voix
pâteuse, une éventuelle ré-analyse par un modèle futur. Au-delà, on stockerait du bruit
d'encodeur, pas de la voix. Même raisonnement pour AAC-LC à 128 kbps mono.

Coût de cette marge : **480 ko de plus** pour un rêve de deux minutes. Pour une voix qu'on
garde dix ans et qui remontera dans le ciel de prières (`VISION-CHANT-DU-COEUR` §3), ça ne se
discute pas.

### 1.4 Pourquoi je ne reprends pas l'A/B de A8, sans le contredire

A8 a mesuré, pour de vrai, que 128 / 48 / 32 kbps donnent une transcription **identique au mot
près**, et que la dégradation apparaît à 24 kbps. Cette mesure est bonne et je la garde.
Mais elle répond à la question « à partir de quel débit la machine lit-elle mal ? », pas à
« à partir de quel débit **l'humain** perd-il sa voix ? ». Ce sont deux questions différentes,
et pour un journal de rêves c'est la seconde qui compte. Le fichier archivé n'est pas un
fichier de travail : c'est un enregistrement de quelqu'un au réveil.

### 1.5 La garantie qui rend le débat sans risque

`createVoiceRecorder(stream)` (`src/lib/capture-safety.ts`) :

1. choisit le conteneur que ce navigateur sait écrire ;
2. **construit un magnétophone témoin sans réglage et lit `audioBitsPerSecond`** — ce que le
   navigateur ferait tout seul, mesuré au lieu d'être supposé ;
3. si ce défaut est **supérieur** à notre cible, il ne touche à rien ;
4. sinon il pose la cible ;
5. si le navigateur refuse le réglage, il rend un `MediaRecorder` nu (comportement d'avant A1).

**Un réglage ne peut donc plus jamais DÉGRADER une capture, seulement la relever.** C'est ce
qui permet de trancher sans avoir d'iPhone sous la main : je ne sais pas ce que WebKit fait par
défaut, et je ne le prétends pas — le code, lui, le saura à l'exécution et l'écrira dans les logs
(`[capture-safety] enregistrement : {...}`, `getLastRecorderInfo()`).

### 1.6 Qualité d'archive ≠ qualité de transcription

Elles sont **découplées par construction** : la copie envoyée à l'IA est découpée *dans le
conteneur*, sans le moindre ré-encodage. Mêmes octets audio, bit pour bit. Le jour où il
faudrait alléger pour l'IA, on allégerait cette copie, jamais l'original.
Vérifié : la partie décodée d'un morceau se retrouve **bit à bit** dans l'original.

---

## 2. La durée maximale — le chiffre que Tim demandait

### 2.1 La découverte, mesurée aujourd'hui contre l'API réelle

`gpt-4o-transcribe` a **deux** plafonds, et le second n'était nulle part dans le code :

```
POST https://api.openai.com/v1/audio/transcriptions   (fichier de 40 min, 9,9 Mo)
→ 400 {"error":{"message":"audio duration 2400.0 seconds is longer than 1400 seconds
   which is the maximum for this model","type":"invalid_request_error"}}
```

**1400 secondes = 23 min 20.** (La doc publique annonce 1500 s ; la valeur réellement servie
est 1400. C'est celle-ci qui fait loi dans le code.)

Conséquence qui change tout : `25 Mo / 1400 s = 143 kbps`. **En dessous de 143 kbps, c'est
toujours la durée qui plafonne, jamais la taille.** Baisser le débit ne repousse donc
strictement rien. C'était l'erreur du matin, et elle est démontrée, pas argumentée.

### 2.2 Et le découpage aux octets ne marche pas

L'ancien `splitAudioBuffer` (hérité de l'import) coupait le fichier tous les 24 Mo. Testé :

```
$ head -c 20971520 opus64_1h.webm > naive.webm      # 20 Mo pris dans un fichier d'1 h
$ curl … -F file=@naive.webm
→ 400 {"error":{"message":"Audio file might be corrupted or unsupported"}}
```

Un morceau d'octets n'est pas un fichier : ni entête, ni pistes, et le morceau n° 1 garde
la durée de l'original (3600 s) donc se fait refuser au titre des 1400 s.

### 2.3 Ce qui a été construit à la place

`splitForTranscription()` dans `src/lib/audio-split.ts` — une découpe qui respecte le conteneur,
**sans décodeur, sans ré-encodage** (isomorphe, `Uint8Array` pur, testable en ligne de commande) :

- **WebM / Matroska** (Chrome, Android) : l'entête (EBML + Info + Tracks) est recopié devant
  chaque paquet de Clusters, **le Timecode de chaque Cluster est réécrit** pour repartir de zéro,
  la taille du Segment est corrigée. Gère aussi les fichiers « live » à tailles inconnues
  (ce que produit `MediaRecorder`).
- **MP4 fragmenté** (Safari, iOS) : l'init (`ftyp` + `moov`) est recopié devant chaque paquet de
  `moof`/`mdat`, **le `baseMediaDecodeTime` de chaque `tfdt` est rebasé**, `mehd`/`mvhd` corrigés.
- **WAV** : trivial.
- **Tout le reste** (MP4 non fragmenté, codec exotique) : **on ne bricole pas.** Le fichier part
  entier avec `splittable: false`, et si un plafond est dépassé la route le **dit** au lieu
  d'envoyer une bouillie. L'original reste intact en Storage.

### 2.4 LE TABLEAU — durée maximale par chemin, au débit retenu

| Chemin | Plafond réel | Opus 64 kbps | AAC 128 kbps |
|---|---|---|---|
| `/api/transcribe` (le blob traverse Vercel) | **4,5 Mo de corps de requête**, imposé par la plateforme | **≈ 9 min 20** | **≈ 4 min 40** |
| Storage → `/api/transcribe-from-storage` | aucune limite de taille ; l'IA plafonne à 25 Mo **et 1400 s** par appel, donc on découpe en morceaux de 19 min | **aucune limite de durée** | **aucune limite de durée** |
| idem, conteneur **non découpable** | `min(25 Mo ÷ débit, 1400 s)` | **23 min 20** | **23 min 20** |
| Bucket `kairos-attachments` | 100 Mo par fichier (posé par A1) | **≈ 3 h 30** | **≈ 1 h 45** |
| Fonction Vercel | 300 s d'exécution ; ~13 s par morceau de 19 min, 3 morceaux en parallèle | tient très au-delà de 3 h | idem |

Calculs : Opus 64 kbps = 8 ko/s → 4,5 Mo ÷ 8 = 562 s = 9 min 22 · 100 Mo ÷ 8 = 12 800 s = 3 h 33.
AAC 128 kbps = 16 ko/s → 4,5 Mo ÷ 16 = 281 s = 4 min 41 · 100 Mo ÷ 16 = 6 400 s = 1 h 47.

**La bonne réponse à « c'est quoi le max ? » est donc : il n'y a plus de limite pratique de
durée.** Le premier vrai mur est le plafond de 100 Mo du bucket (3 h 30 sur Android, 1 h 45 sur
iPhone), et il se relève d'une ligne de SQL le jour où quelqu'un raconte un rêve de quatre heures.

Ces chiffres sont écrits **dans le code**, en tête de `/api/transcribe-from-storage/route.ts`,
de `/api/transcribe/route.ts` et de `audio-split.ts` — pas seulement ici.

---

## 3. Le test « une heure », en vrai

### 3.1 Fabrication du matériau

```bash
ffmpeg -y -f lavfi -i "anoisesrc=d=3600:c=pink:r=48000:a=0.3" \
       -ac 1 -c:a libopus -b:a 64k -vbr off -f webm opus64_1h.webm
# → 30 084 075 octets (28,7 Mo), 3600 s
ffmpeg -y -f lavfi -i "anoisesrc=d=3600:c=pink:r=48000:a=0.3" \
       -ac 1 -c:a aac -b:a 128k -movflags +empty_moov+default_base_moof \
       -frag_duration 5000000 -f mp4 aac128_1h_frag.mp4
# → 58 573 033 octets (55,9 Mo), 3600 s, 719 fragments
```

### 3.2 Le pipeline serveur, de bout en bout, contre la VRAIE infra

Script `e2e.ts` : upload signé client→Storage, téléchargement service-role (ce que fait la
route), découpe par le code de production, transcription des morceaux par l'API réelle.

```
$ node --experimental-strip-types e2e.ts up
1. upload signé client→Storage : 30084075 octets (28.7 Mo) → HTTP 200 en 4.8 s
2. téléchargement service-role (ce que fait la route) : HTTP 200 · 30084075 octets en 4.6 s
   identique à l'original : true

$ node --experimental-strip-types e2e.ts tx
3. découpe : webm : 721 clusters → 4 morceau(x), horloges remises à zéro · durée totale 3600 s · 14 ms
4. transcription des 4 morceaux EN PARALLÈLE : 14.1 s de mur
   morceau 0 · 9.12 Mo · 1145 s → HTTP 200
   morceau 1 · 9.08 Mo · 1140 s → HTTP 200
   morceau 2 · 9.08 Mo · 1140 s → HTTP 200
   morceau 3 · 1.39 Mo · 175 s  → HTTP 200
   TOUS ACCEPTÉS : true

$ node --experimental-strip-types e2e.ts clean
5. nettoyage de l'objet de test : HTTP 200 {"message":"Successfully deleted"}
```

**Une heure d'audio : montée en 4,8 s, découpée en 14 ms, transcrite en 14,1 s.**
(Les textes rendus sont du charabia : c'est du bruit rose, pas une voix. Ce qui est prouvé
ici, c'est que **l'API accepte nos morceaux** — le seul point qui était en doute.)

### 3.3 Les morceaux sont-ils de vrais fichiers ?

```
$ ffprobe -show_entries format=duration  →  1144.981 · 1140.000 · 1140.000 · 175.027
$ ffmpeg -i part.webm -f null -           →  aucun avertissement, aucune erreur
$ somme des durées décodées               →  3600.008 s  (original : 3600 s)
```
Idem pour le MP4 fragmenté (4 morceaux, 1143,04 s × 3 + 170,9 s, zéro avertissement) et pour
un WAV de 40 min (4 morceaux).

### 3.4 L'audio est-il intact ?

Décodage de l'original et des morceaux, comparaison PCM échantillon par échantillon :

- **identique bit à bit jusqu'à la première coupe** (54 958 728 échantillons) ;
- une fenêtre prise à +60 s et à +300 s dans le morceau 2 se **retrouve bit à bit dans
  l'original** (décalage constant de 48 échantillons, soit 1 ms) ;
- l'ensemble reconstitué fait 936 échantillons de moins que l'original, soit exactement
  **3 coupes × 312 échantillons (6,5 ms)** : le pre-skip Opus, réappliqué à chaque redémarrage
  du décodeur.

Autrement dit : **19 ms perdues sur une heure, aux seules coutures, et uniquement dans la copie
envoyée à l'IA.** L'original en Storage, lui, n'est jamais découpé ni touché.

### 3.5 Ce que ce test n'a PAS couvert (dit franchement)

- Il ne passe pas par le serveur **Next.js** : `node_modules` du dépôt est corrompu (iCloud) et
  je ne peux pas lever le serveur. Ce qui est exercé pour de vrai : Storage signé, téléchargement
  service-role, le code de découpe **de production**, l'API OpenAI. Ce qui ne l'est pas : le
  plombage HTTP de la route (auth, CORS, `UPDATE capture_audio`), qui est du code linéaire et
  typé, vérifié par `tsc`.
- Le matériau est du bruit rose, pas une voix. La qualité de transcription n'est donc **pas**
  mesurée ici (elle l'a été par A8) ; ce test mesure l'**acceptation** et l'**intégrité**.
- Rien n'a été testé sur un vrai iPhone. Le chemin MP4 fragmenté est validé contre un fichier
  produit par ffmpeg, pas par WebKit. C'est la limite honnête de ce rapport.

---

## 4. Le backup téléphone

### 4.1 Les limites réelles, sourcées

Politique de stockage WebKit en vigueur (iOS 17+), source : [WebKit — Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/) :

- **Quota par origine** : jusqu'à **60 %** du disque pour une app navigateur, **15 %** pour les
  autres apps. Notre WKWebView Capacitor est dans le second cas. Sur un iPhone de 128 Go à
  moitié plein, ça reste plusieurs gigaoctets : la file de rêves ne remplira jamais ça.
- **Éviction** : elle existe, et elle efface les données d'une origine **en bloc**. Trois
  déclencheurs : dépassement du quota global, pression de stockage système, et absence
  d'interaction prolongée. Ce dernier point relève d'[ITP](https://webkit.org/tracking-prevention/),
  dont la règle documentée est l'effacement du stockage écrit par script après **7 jours**
  sans interaction avec le site. Le billet ci-dessus cite ITP comme déclencheur d'éviction
  mais ne redonne pas le chiffre : je le rapporte donc comme venant d'ITP, pas de la
  politique de stockage.
- **Mode par défaut** : « best-effort ». Aucune garantie.
- **`navigator.storage.persist()`** fait sortir l'origine de l'éviction. WebKit l'accorde sur
  heuristiques (app ajoutée à l'écran d'accueil, historique d'interaction) et **peut refuser**
  dans une WebView embarquée. L'API Storage complète (`persist`, `persisted`, `estimate`) est
  supportée depuis **Safari 17 / iOS 17**.

### 4.2 Ce qui a été fait

1. **On demande la persistance**, deux fois, aux deux moments où elle a le plus de chances
   d'être accordée : au démarrage (`startAutoFlush`) et quand le rêveur **ouvre** la feuille de
   récupération (interaction réelle). `ensurePersistentStorage()` rend un état complet
   (`persisted`, `granted`, `quotaBytes`, `usageBytes`, `unsafeLocalBytes`) et le **log**.
2. **On le dit au rêveur** quand c'est vrai *et* que ça le concerne : si la persistance est
   refusée **et** qu'un audio n'est encore que sur le téléphone, une ligne apparaît dans la
   feuille : « le navigateur peut effacer ce qui n'est encore que sur ce téléphone. Sors les
   rêves qui comptent. » Jamais affichée sinon.
3. **L'export** — le filet qui ne dépend d'aucune politique de navigateur. Bouton « sortir du
   téléphone » sur chaque dépôt : partage natif (`navigator.share` avec fichier) si disponible,
   sinon téléchargement, sinon ouverture. Le rêveur peut se l'envoyer, le mettre dans Fichiers,
   dans Drive. Si tout casse — l'app, le compte, le réseau, le serveur — le fichier est à lui.
4. **La quota-résilience** : si IndexedDB refuse une écriture (quota plein), on libère
   **uniquement** les audios déjà confirmés en Storage, puis on retente une fois. On ne renonce
   jamais à un rêve pour une histoire de place.

### 4.3 Ce qui reste `blocked`, et qui décide

**Le chemin d'export vraiment garanti est natif.** Dans une WKWebView, `navigator.share` avec
des **fichiers** et `<a download>` sont capricieux selon les versions d'iOS
([discussion Capacitor](https://github.com/ionic-team/capacitor/discussions/3213)). La voie sûre
est `@capacitor/share` + `@capacitor/filesystem` — **ni l'un ni l'autre n'est dans
`package.json`**, et les ajouter impose un rebuild natif **et une re-soumission App Store**.

C'est une décision de Tim, pas une improvisation de ma part. En attendant, les trois voies web
sont tentées dans l'ordre et l'UI dit honnêtement laquelle a marché (« sorti — garde-le
ailleurs » / « impossible ici — réécoute puis “partager” »).

### 4.4 La purge : vérifiée ligne à ligne

Mission : *« l'audio local ne doit être supprimé QUE lorsque l'upload Storage est confirmé par
une preuve »*. Audit des **cinq** endroits qui peuvent faire disparaître un audio :

| Endroit | Condition | Verdict |
|---|---|---|
| `enforceAudioBudget` | `r.audioBlob && r.storagePath` | ✅ preuve exigée |
| `processEntry` étape D | `entry.storagePath && entry.kairosId` **et** `res.ok` | ✅ |
| `flushQueue` → `delEntry` | `audioSecured()` = `!!storagePath` dès qu'un blob a existé | ✅ |
| `enqueueDeposit` (récupération quota, **nouveau**) | `r.audioBlob && r.storagePath` | ✅ |
| `discardEntry` | geste explicite du rêveur, avec confirmation | ✅ voulu |

**Un défaut trouvé et corrigé au passage** : `enforceAudioBudget` posait `audioDone = true` en
libérant le blob. Or `audioDone` ne veut pas dire « blob libéré », il veut dire « audio
**rattaché** à son rêve ». Le poser coupait l'étape D (`PATCH kairos_attachments`) : la voix
restait sur le serveur mais **orpheline**, récupérable par `local_id` seulement, invisible dans
le rêve. Et le cron de réparation ne l'aurait pas rattrapée (il ne regarde que les statuts
`pending`/`failed`, or celui-ci serait `done`). Corrigé aux deux endroits.

---

## 5. Fichiers livrés

### Modifiés
| Fichier | Ce qui change |
|---|---|
| `src/lib/audio-split.ts` | **+ 640 lignes** : `splitForTranscription`, découpe WebM (clusters + réécriture des Timecodes + taille de Segment), MP4 fragmenté (fragments + rebase `tfdt` + `mehd`/`mvhd`), WAV, `detectContainer`, `maxTranscribableSeconds`, constantes `TRANSCRIBE_MAX_*` / `PART_MAX_*`. Les fonctions navigateur d'origine (`splitAudio`, `encodeWav`…) sont **inchangées** : ImportHub n'est pas affecté. |
| `src/lib/capture-safety.ts` | `CAPTURE_BITRATE_OPUS` / `CAPTURE_BITRATE_AAC`, `pickRecorderMime`, **`createVoiceRecorder`** (sonde le défaut, ne descend jamais), `exportRecording`, `primeLocalSafety`, `getLastRecorderInfo` ; `transcribeSafely` accepte `durationSec` et pose un garde-temps de 4 min. |
| `src/lib/offline-queue.ts` | `StorageSafety` + `ensurePersistentStorage` + `storageSafetyReport` ; persistance demandée au boot ; `enqueueDeposit` résiste au quota plein ; correction du `audioDone` (§4.4) ; commentaire de `DIRECT_BODY_MAX` réécrit (aiguillage ≠ budget de qualité). |
| `src/app/api/transcribe-from-storage/route.ts` | Découpe par conteneur au lieu du byte-slicing · transcription des morceaux **par vagues de 3** en gardant l'ordre · verrou anti-double-dépense · refus honnête et explicite pour un conteneur non découpable · durée réelle écrite en base · le tableau des durées maximales en tête de fichier. |
| `src/app/api/mvp/repair-capture-audio/route.ts` | Le cron ne laisse plus tomber les fichiers > 25 Mo (« reprise manuelle ») : il les découpe comme la route live. Pose et lève le même verrou. |
| `src/app/api/transcribe/route.ts` | Commentaires : durées réelles par codec, et la règle « on change de route, pas de voix ». |
| `src/components/PendingDeposits.tsx` | Bouton **« sortir du téléphone »** par dépôt · bandeau de fragilité affiché seulement quand la persistance est refusée ET qu'une voix n'est encore que locale · demande de persistance à l'ouverture. |

### Base de données
`b2_capture_audio_transcription_lock` (appliquée en **prod**, `rtrkxzcyblgonwgfzovj`) :
colonne `capture_audio.transcription_started_at` + index partiel. Le client (flush) et le cron
peuvent viser le même audio ; sans marqueur de début, **les deux paient l'IA pour le même rêve**.
Vérifié : PostgREST expose bien la colonne (pas de cache périmé), la table contient 0 ligne
(rien n'est encore déployé).

### Documents
`PATCH-PAGE-TSX-B2.md` (6 patchs pour B5, ancrés sur du contexte de code) · ce rapport.

---

## 6. Vérification

```
$ cd ~/tscheck && rm -f tsconfig.tsbuildinfo \
  && node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json
src/app/mvp/page.tsx(1395,24): error TS1005: ')' expected.
… 9 erreurs, TOUTES dans src/app/mvp/page.tsx
EXIT=2
```

Ces 9 erreurs sont des erreurs de **syntaxe JSX** dans `page.tsx` — le fichier de **B5**, en
cours d'écriture pendant que je compilais. Aucune ne vient de mes fichiers. Contrôle avec
`page.tsx` exclu (`tsconfig.b2.json`, hors dépôt) :

```
$ node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.b2.json ; echo "EXIT=$?"
EXIT=0        (aucune sortie)
```

Et `--listFiles` confirme que **mes 7 fichiers sont bien dans le programme** compilé :
`audio-split.ts`, `capture-safety.ts`, `offline-queue.ts`, `PendingDeposits.tsx`,
`transcribe/route.ts`, `transcribe-from-storage/route.ts`, `repair-capture-audio/route.ts`.

> ⚠️ **À revérifier une fois que B5 a fini** : `rm -f ~/tscheck/tsconfig.tsbuildinfo && node ~/tscheck/node_modules/typescript/lib/tsc.js --noEmit -p ~/tscheck/tsconfig.json`.

---

## 7. Statut, sans enrobage

| Objet | Statut |
|---|---|
| Débit d'archive codec-conscient, jamais inférieur au défaut navigateur | **full_green** (code + typecheck) — *dépend du PATCH B5 pour être actif* |
| Découpe conteneur WebM / MP4 fragmenté / WAV | **full_green** — testé sur 1 h dans les trois familles |
| 1 h transcrite de bout en bout | **full_green** — mesuré, 14,1 s |
| Aucune limite de durée sur le chemin d'archive | **full_green** jusqu'au plafond de 100 Mo du bucket |
| Verrou anti-double-dépense | **full_green** (migration appliquée en prod) |
| Purge sur preuve | **full_green** — audité, un défaut corrigé |
| Persistance IndexedDB demandée + rapportée | **full_green** côté code · **inconnu** côté réponse iOS réelle (à lire dans les logs sur le téléphone de Tim) |
| Export hors de l'app | **partial** — les trois voies web sont en place et disent la vérité ; le chemin **garanti** demande `@capacitor/share` + `@capacitor/filesystem`, donc un rebuild natif et une re-soumission → **décision de Tim** |
| Chemin MP4 fragmenté validé sur un vrai iPhone | **blocked** — pas d'appareil ici. Validé contre un fMP4 ffmpeg. |
| `page.tsx` | **blocked (par conception)** — `PATCH-PAGE-TSX-B2.md`, appliqué par B5 |
| Déploiement | **rien n'est déployé.** Le code est sur le disque, la migration est en base. « écrit » ≠ « en ligne ». |

### Les trois choses à savoir avant de retoucher à ça

1. **`gpt-4o-transcribe` plafonne à 1400 s de DURÉE**, pas seulement à 25 Mo. Tout raisonnement
   qui ne tient pas compte de ça est faux. Ne jamais couper un audio aux octets.
2. **Le débit d'enregistrement ne protège d'aucune limite.** Si quelqu'un propose de le baisser
   « pour que ça passe », c'est qu'il confond aiguillage de route et budget de qualité.
3. **`audioDone` veut dire « rattaché au rêve », pas « blob libéré ».** Le confondre laisse des
   voix orphelines côté serveur, sans erreur visible.

### Le pas suivant

Que **B5 applique `PATCH-PAGE-TSX-B2.md`** (6 patchs, aucun changement d'UI), puis
`npx vercel --prod --yes`. Et à la première capture sur le téléphone de Tim : lire la ligne
`[capture-safety] enregistrement : {...}` — elle dira ce que WebKit fait vraiment, la seule
chose que je n'ai pas pu mesurer d'ici.
