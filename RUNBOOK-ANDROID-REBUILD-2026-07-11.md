# RUNBOOK — Rebuild Android Dream (fix écran figé) — 2026-07-11

**Pourquoi ce rebuild** : l'AAB installé sur ton téléphone (buildé le 15/05) a été compilé quand `capacitor.config.ts` pointait vers `/v8/index.html` (page statique gelée). Le 11/06, la config web a switché vers `/mvp` (la vraie app live) — mais **personne n'a rebuild+reuploadé l'AAB depuis**. En mode Capacitor "remote URL", l'URL cible est figée DANS le binaire au moment du build : changer le fichier de config ou redéployer sur Vercel ne suffit pas, il faut un nouveau `.aab`.

Ce runbook te fait rebuilder et reposter cet AAB en ~10 min de commandes (hors temps de compilation Gradle et review Play Console).

**Statut de ce doc** : préparé par un agent (pas de build réel possible en sandbox — pas de Gradle/SDK Android là-bas). Tout ce qui suit a été vérifié statiquement (syntaxe, cohérence des fichiers) mais **pas exécuté**. Premier run réel = sur ton Mac.

---

## 0. Ce qui a changé dans le repo (déjà fait, rien à toucher)

| Fichier | Changement |
|---|---|
| `capacitor.config.ts` | Bug de syntaxe corrigé (voir §8) + commentaires `/v8` nettoyés. `server.url` confirmé sur `https://dream-alpha-bice.vercel.app/mvp` (déjà la bonne valeur, vérifiée live). |
| `android/app/build.gradle` | `versionCode` 1→2, `versionName` "1.0"→"1.1". Ajout d'un signing config CLI (lit `android/keystore.properties`, à créer — §1). |
| `android/app/src/main/AndroidManifest.xml` | Ajout permission `CAMERA` + features caméra (pour l'écran Scan). `allowBackup` true→false (durcissement — voir §8). |
| `android/.gitignore` | Ajout de `keystore.properties` (le vrai fichier avec mot de passe ne doit jamais être commit). |
| `android/keystore.properties.example` | Nouveau template pour le signing CLI. |
| `package.json` | **Inchangé** — `@capacitor/local-notifications` était déjà présent (dep + câblage natif Android déjà en place, voir §7). |

---

## 1. Setup signing (UNE FOIS seulement)

Le keystore existe déjà (`_keystores/dream-release.jks`, créé le 15/05 — ne PAS en recréer un, ça casserait les mises à jour). Il manque juste le fichier local qui dit à Gradle où le trouver et avec quel mot de passe.

```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android" && cp keystore.properties.example keystore.properties && open -e keystore.properties
```

Dans le fichier qui s'ouvre, remplace les deux `CHANGE_ME` :
- `storePassword` = mot de passe du keystore → **NordPass, entrée "Dream — Android Keystore"**
- `keyPassword` = en général le même mot de passe (choisi à la création du keystore le 15/05). Si tu avais mis un mot de passe de clé différent à l'époque, utilise celui-là.

Sauvegarde. Ce fichier est gitignored — il ne part jamais nulle part, il reste sur ta machine.

*(Cette étape ne se refait plus jamais, sauf si tu changes de Mac.)*

---

## 2. Rebuild — commandes dans l'ordre

```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npm install
```

```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap sync android
```

Ce que fait cette 2e commande : relit `capacitor.config.ts`, régénère `android/app/src/main/assets/capacitor.config.json` (l'URL `/mvp` embarquée), et confirme que les 7 plugins Capacitor (dont `local-notifications`) sont bien référencés côté natif. Tu dois voir en sortie un résumé du style `√ Sync finished` et la liste des plugins.

```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android" && ./gradlew bundleRelease
```

Compilation : 2-6 min la première fois. Si tout va bien, tu vois `BUILD SUCCESSFUL` à la fin.

### Si `./gradlew bundleRelease` râle sur Java

AGP 8.13 veut un JDK 17+. Si ton Terminal utilise un vieux JDK système (pas celui embarqué dans Android Studio), tu auras une erreur du style `Unsupported class file major version` ou `JAVA_HOME is not set`. Fix — utilise le JDK embarqué d'Android Studio pour cette seule commande :

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" && cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android" && ./gradlew bundleRelease
```

### Si Gradle dit "keystore not found" ou signature échoue

→ Vérifie que `android/keystore.properties` existe bien (étape 1) et que le chemin `storeFile=../_keystores/dream-release.jks` est correct (il doit pointer vers un fichier qui existe réellement à cet endroit).

### Si tu préfères la UI Android Studio (fallback, pas la méthode principale)

`Build → Generate Signed App Bundle / APK → Android App Bundle → Choose existing... → _keystores/dream-release.jks → alias "dream-release"`. C'est le même keystore que la méthode CLI, juste un autre chemin pour y arriver.

---

## 3. Récupérer l'AAB signé

```
android/app/build/outputs/bundle/release/app-release.aab
```

Si tu veux le sortir du dossier pour l'uploader plus facilement :

```bash
cp "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android/app/build/outputs/bundle/release/app-release.aab" ~/Desktop/dream-1.1.aab
```

---

## 4. Upload sur Play Console (mise à jour, pas création — l'app existe déjà)

1. https://play.google.com/console → **Dream** (l'app existe déjà, ne PAS refaire "Créer une application")
2. Menu gauche : **Test → Tests internes**
3. Onglet **Versions** → **Créer une version**
4. Glisser-déposer `dream-1.1.aab` (ou le fichier direct depuis `android/app/build/outputs/bundle/release/`)
5. **Notes de version** : par exemple *"1.1 — fix : l'app pointe maintenant vers l'expérience MVP au lieu de l'ancien écran figé V8. Ajout notifs rendez-vous."*
6. **Enregistrer** → **Vérifier la version** → **Lancer le déploiement vers les tests internes**

Review Google automatique : quelques minutes à ~1h en général pour une mise à jour (plus rapide qu'une première soumission).

---

## 5. Les testeurs — rien à refaire de leur côté

Les 3 testeurs déjà inscrits (liste "Dream Alpha Inner Circle") reçoivent la mise à jour **via le même lien d'opt-in déjà utilisé** :

```
https://play.google.com/apps/internaltest/4700912902485442479
```

Pas besoin de renvoyer ce lien — Play Store leur pousse la mise à jour automatiquement (ou ils la voient en ouvrant Play Store → Mes apps → Mises à jour disponibles). Tu peux juste leur signaler que ça arrive, si tu veux.

---

## 6. Vérifs post-install (à faire sur un device réel, toi ou un testeur)

- [ ] L'app s'ouvre sur la **home actuelle du MVP** (pas l'écran figé /v8 d'avant)
- [ ] Connexion magic link fonctionne, reste logué après fermeture/réouverture de l'app
- [ ] **Notifs rendez-vous** (matin/soir, si activées dans les réglages) : elles se déclenchent aux heures configurées, le tap ouvre le bon écran (capture voix le matin, guide Intention le soir)
- [ ] Popup de permission notifications apparaît au premier lancement (Android 13+) — sinon vérifier que `LN.requestPermissions()` a bien été appelé (déjà câblé dans `src/lib/appointments.ts`)
- [ ] Écran **Scan** ("scanner une page") : le bouton caméra ouvre bien l'appareil photo natif (pas juste un sélecteur de fichiers générique) — c'est le point que la permission `CAMERA` ajoutée cette session doit débloquer
- [ ] Capture vocale : popup permission micro apparaît, transcription fonctionne
- [ ] Bouton retour Android : navigue normalement dans l'historique de l'app

---

## 7. Notifications — déjà câblé, rien à ajouter

Vérifié cette session : `@capacitor/local-notifications` était **déjà** dans `package.json` (`^8.2.0`), déjà installé dans `node_modules`, et déjà référencé côté natif Android (`android/capacitor.settings.gradle` + `android/app/capacitor.build.gradle` incluent tous les deux `capacitor-local-notifications`). Côté JS, `src/lib/appointments.ts` fait l'import dynamique + appelle `LN.requestPermissions()` avant de planifier — c'est le bon pattern pour la permission runtime `POST_NOTIFICATIONS` (Android 13+, déjà déclarée dans le Manifest). Donc : `npx cap sync android` suffit à embarquer le plugin natif, aucune dépendance à ajouter.

---

## 8. Pièges trouvés et corrigés cette session

1. **`capacitor.config.ts` avait une virgule perdue dans un commentaire** (ligne `url: '...'  // SWITCH MVP 2026-06-11 (V8 gelé sur /v8/),` — la virgule qui devait séparer `url` de `cleartext` était à l'intérieur du commentaire `//`, donc invisible pour le compilateur). **Vérifié empiriquement avec `tsc`** : `Line 45, Col 5: ',' expected`. Nuance honnête : le parser TypeScript récupère de cette erreur précise (il "devine" la virgule manquante et continue), donc `npx cap sync` avait probablement continué à marcher malgré tout jusqu'ici — mais c'est un fichier objectivement invalide, fragile au moindre futur edit à proximité, et qui ferait échouer un `tsc --noEmit` strict. Corrigé + vérifié que le fichier compile proprement maintenant.
2. **Permission `CAMERA` manquante** dans `AndroidManifest.xml` alors que `src/components/ScanScreen.tsx` utilise `<input type="file" capture="environment">` pour ouvrir l'appareil photo — sur certaines WebView Android, sans cette permission déclarée, l'intent caméra ne se lance pas et l'app retombe sur un sélecteur de fichiers générique. Ajoutée (+ `uses-feature` caméra en `required="false"`, donc pas de restriction d'installation sur les devices sans caméra).
3. **`android:allowBackup="true"`** — l'app gère un token de session (auth magic-link) + journal de rêves. Avec `allowBackup=true` et aucune règle d'exclusion, Android peut inclure ces données dans une sauvegarde auto (Google Drive). Passé à `false` (durcissement standard pour ce type de données ; réversible facilement si un jour vous voulez du backup sélectif via `dataExtractionRules`).
4. **Pas de signing config CLI** — `android/app/build.gradle` n'avait aucun `signingConfigs`, donc `./gradlew bundleRelease` en ligne de commande aurait produit un AAB **non signé** (la doc existante ne documentait que la signature via l'assistant graphique Android Studio). Ajouté un signing config standard qui lit `android/keystore.properties` (gitignored), pour que la commande CLI demandée fonctionne de bout en bout.
5. **Incohérence de chemin keystore** : `CAPACITOR-ANDROID-BUILD.md` (doc du 15/05) décrivait la création du keystore à `android/dream-release.keystore`, mais le fichier réel vit à `_keystores/dream-release.jks` (probablement déplacé/réorganisé après coup). Le runbook et le signing config ci-dessus pointent vers l'emplacement RÉEL (`_keystores/dream-release.jks`), pas l'ancien chemin documenté.

**minSdk/compileSdk/targetSdk** (24/36/36) : vérifiés conformes à la doc existante, aucun changement nécessaire.

---

## 9. Vérif de cohérence (fait), build réel (pas fait)

Cette session n'a pas de Gradle ni de SDK Android disponibles (sandbox). Vérifié à la place :
- `capacitor.config.ts` : compile proprement via le compilateur TypeScript du repo (`node_modules/typescript`) — confirmé avant/après fix.
- `android/app/build.gradle` : accolades et blocs `if` comptés/équilibrés à la relecture.
- `AndroidManifest.xml` : XML bien formé, balises fermées.
- URL cible (`https://dream-alpha-bice.vercel.app/mvp`) : **fetchée en direct depuis cette session** — répond 200, HTML valide, titre "Dream". La cible du wrap est donc bien vivante.

Le premier test réel de tout ça sera le `./gradlew bundleRelease` sur ton Mac — si ça casse quelque part, c'est probablement un souci d'environnement local (JDK, SDK path dans `local.properties`) plutôt que les fichiers modifiés ici.
