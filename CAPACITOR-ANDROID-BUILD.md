# CAPACITOR ANDROID BUILD — Guide Tim

**Date** : 2026-05-15
**Auteur** : Yeshua-Agent-Capacitor (Opus)
**Statut projet** : Android Capacitor wrap PRÊT pour Android Studio.
**Stratégie** : Option A (server.url remote → wrap WebView vers https://dream-alpha-bice.vercel.app/v8/index.html). Pas de bundling local, l'app native pointe vers la prod Vercel. Update instantanée via `npx vercel --prod` côté web — pas besoin de re-soumettre le binaire pour les fixes UX.

---

## 0. Sanity check — Prérequis Tim

- [x] Apple Developer finalisé (DUNS 282628520)
- [x] Google Play Console payé (compte développeur 25$ one-shot)
- [x] Android Studio installé (Hedgehog ou plus récent recommandé)
- [x] JDK 21 (Android Studio en embarque un, vérifier dans Settings → Build Tools → Gradle → Gradle JDK)
- [ ] Keystore Android créé (étape 2 ci-dessous)

---

## 1. Ouvrir le projet dans Android Studio

```
Mac Finder → Aller au dossier :
/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android/
```

Dans Android Studio :
1. **File → Open** → sélectionner le dossier `android/`
2. Attendre que Gradle sync se lance (peut prendre 5-10min la première fois — il télécharge AGP 8.13, SDK 36, dépendances Capacitor)
3. Si Gradle demande "Android Gradle Plugin Update" → **Don't update** (on est sur 8.13.0 stable, calé avec les plugins Capacitor 8.x)
4. Vérifier en bas à droite : **"Gradle Sync Successful"** en vert

### Si Gradle sync échoue

```
File → Settings → Build, Execution, Deployment → Build Tools → Gradle
→ Gradle JDK : "jbr-21" (embedded JBR 21)
```

Puis : **File → Sync Project with Gradle Files**.

---

## 2. Créer le keystore Android (à faire UNE fois, à conserver à vie)

**🔴 CRITIQUE** : Ce keystore signe TOUTES les futures versions de l'app. Le perdre = ne plus jamais pouvoir mettre à jour l'app. Sauvegarder dans un endroit sûr (1Password vault, Tresorit, clé USB chiffrée).

Dans Android Studio :

```
Build → Generate Signed App Bundle / APK
→ Android App Bundle (recommandé Google Play)
→ Create new... (sous "Key store path")
```

Remplir :
- **Key store path** : `/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android/dream-release.keystore`
- **Password** : choisir un mot de passe FORT (le sauvegarder dans 1Password sous "Dream Android Keystore")
- **Alias** : `dream-release`
- **Validity (years)** : `25` (Google Play exige minimum 25 ans)
- **Certificate** :
  - First and Last Name : Timoté Bardin
  - Organizational Unit : INFUSE
  - Organization : INFUSE
  - City : Bali (ou résidence légale)
  - State : —
  - Country Code : FR

Cliquer **OK** → le keystore est créé.

---

## 3. Build l'AAB signé (App Bundle pour Google Play)

Dans Android Studio :

```
Build → Generate Signed App Bundle / APK
→ Android App Bundle
→ Choose existing... → sélectionner dream-release.keystore
→ Saisir password keystore + key password (mêmes valeurs que création)
→ Next
→ Build Variants : release
→ Destination Folder : dossier de ton choix (ex: ~/Desktop/dream-builds/)
→ Finish
```

Android Studio compile (3-8min). Quand fini, notification en bas à droite : **"locate"** → tu trouves :
```
~/Desktop/dream-builds/release/app-release.aab
```

C'est ce fichier .aab à uploader sur Google Play.

### Build APK (alternative pour install local sans passer par Play)

Même menu, choisir **APK** au lieu de Bundle. Sortie : `app-release.apk`. Tu peux l'installer directement sur un Android via :
```
adb install app-release.apk
```
(adb fourni par Android Studio, dispo dans `~/Library/Android/sdk/platform-tools/adb`)

---

## 4. Upload sur Google Play Console — Test interne fermé

### 4.1 Créer l'app dans Play Console

1. Aller sur https://play.google.com/console
2. **Toutes les apps → Créer une application**
3. Remplir :
   - Nom : **Dream**
   - Langue par défaut : Français (France)
   - Type : Application
   - Gratuite/Payante : Gratuite
4. Accepter les déclarations (Politiques Play, lois export US)
5. Cliquer **Créer l'application**

### 4.2 Setup minimal pour test interne

Dans le menu gauche de l'app, compléter (le minimum vital) :

- **Politique de confidentialité** : URL obligatoire. À créer rapidement (page simple sur infuse.earth/privacy ou notion publique). Sans ça, pas de publication même test interne.
- **Catégorie de contenu** : Lifestyle ou Health & Fitness
- **Coordonnées du développeur** : email gestion@infuse.earth + site infuse.earth
- **Public et contenu** : remplir le questionnaire (Adultes uniquement OK pour alpha)
- **Publicités** : "Mon app ne contient pas de publicités"
- **Sécurité des données** : déclarer collecte (email pour auth Supabase, transcriptions vocales temporaires, contenus de rêves chiffrés) → utiliser le formulaire guidé

### 4.3 Créer la release de test interne

```
Test → Tests internes → Créer une release
```

1. **Importer le bundle** : drag-drop le `app-release.aab`
2. **Nom de la release** : `0.1.0-alpha` (versionName "1.0" par défaut → modifier dans `android/app/build.gradle` si besoin)
3. **Notes de version** : "Alpha fermée — wrap V8 Dream App. Feedback bienvenu."
4. Cliquer **Suivant** → **Enregistrer** → **Examiner la release** → **Démarrer le déploiement vers les tests internes**

Google fait une review automatique courte (5-30min).

### 4.4 Ajouter testeurs (5-10 emails Gmail)

```
Test → Tests internes → Testeurs
```

1. Cliquer **Créer une liste d'adresses e-mail**
2. Nom : "Dream Alpha Inner Circle"
3. Coller les emails (un par ligne) — **ce DOIT être leur email Google/Gmail lié au Play Store sur leur Android**
4. Sauvegarder

### 4.5 Partager le lien d'opt-in

```
Test → Tests internes → Onglet "Testeurs"
→ "Comment les testeurs rejoignent ton test"
→ Copier le lien : https://play.google.com/apps/internaltest/4701234567890123456
```

Envoyer ce lien aux testeurs avec ce message type :

> Salut, je t'invite à tester Dream en alpha fermée.
> 1. Ouvre ce lien sur ton Android (compte Gmail X@gmail.com lié) : <LIEN>
> 2. Clique "Become a tester"
> 3. Puis "Download it on Google Play" → install
> 4. Reviens-moi avec : ce qui marche, ce qui casse, ce qui surprend.

---

## 5. Install local APK (sans Play, pour tests rapides)

Si Tim veut faire tester l'APK directement à quelqu'un sans passer par Play :

```bash
# Via adb (Android branché en USB, debug USB activé)
~/Library/Android/sdk/platform-tools/adb install app-release.apk

# OU partager le .apk via Drive/Wetransfer → l'utilisateur active "Sources inconnues"
# dans Paramètres Android → installe le fichier
```

Note : depuis Android 12+, Play Protect peut bloquer un APK signé hors-Play et demander confirmation utilisateur.

---

## 6. Mettre à jour l'app (futures versions)

Workflow simple :

1. Édit code Dream App (web, dans `/v8/index.html`)
2. `npx vercel --prod` depuis `/dream-alpha-app/` → la web app est mise à jour. Les utilisateurs voient la nouvelle version au prochain reload de l'app (rappel : on est en mode REMOTE, donc l'app mobile ne contient pas le HTML).
3. **PAS besoin de rebuild Android** sauf si tu modifies :
   - Permissions (AndroidManifest.xml)
   - Plugins Capacitor (ajout/suppression)
   - Icône, splash, nom app
   - Une URL serveur

Si rebuild nécessaire :
- Incrémenter `versionCode` (entier, +1) et `versionName` (string, ex: "1.0.1") dans `android/app/build.gradle`
- Re-générer un AAB signé
- Upload nouvelle release sur Play

---

## 7. iOS plus tard — Préparation seulement

Quand tu veux lancer iOS :

1. Sur Mac avec Xcode 15+ installé
2. `cd /Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app && npx cap sync ios`
3. `npx cap open ios` → ouvre Xcode sur le projet `ios/App/App.xcworkspace`
4. Dans Xcode :
   - Sélectionner le projet → onglet "Signing & Capabilities"
   - Team : ton compte Apple Developer (DUNS 282628520)
   - Bundle Identifier : `earth.infuse.dream`
   - Add capability "Microphone" (Whisper)
   - Add capability "Push Notifications" (futur)
5. Compléter `ios/App/App/Info.plist` avec :
   - `NSMicrophoneUsageDescription` : "Dream utilise le micro pour transcrire ta voix lors de la capture d'un rêve."
   - `NSCameraUsageDescription` (si caméra ajoutée plus tard)
6. **Product → Archive** → Distribute App → App Store Connect → upload
7. Créer la fiche TestFlight (équivalent test interne Play) → ajouter testeurs par email

Pas urgent. Android d'abord, on apprend, on itère, puis iOS.

---

## 8. Configuration technique — Récap pour debug

**Strategie wrap** : Option A — `server.url` remote
**URL pointée** : `https://dream-alpha-bice.vercel.app/v8/index.html`
**App ID** : `earth.infuse.dream`
**App Name** : `Dream`

**SDK Android** :
- minSdkVersion : **24** (Android 7.0+) — requis par Capacitor 8.x. Couvre ~98% des appareils actifs en 2026.
  - ⚠️ Le brief mentionnait minSdk 22 mais Capacitor 8 ne supporte plus < 24. Si vraiment besoin d'Android 5/6, downgrade Capacitor 5.x. Recommandation : rester sur 24.
- compileSdkVersion : 36
- targetSdkVersion : 36

**Plugins Capacitor installés** :
- `@capacitor/core`, `@capacitor/cli`, `@capacitor/android` (8.3.1)
- `@capacitor/app` (8.1.0) — back button Android natif
- `@capacitor/haptics` (8.0.2) — vibrations menu radial / felt-shift
- `@capacitor/keyboard` (8.0.3) — gestion clavier mobile (resize/scroll)
- `@capacitor/preferences` (8.0.1) — storage local persistant
- `@capacitor/splash-screen` (8.0.1) — splash launcher
- `@capacitor/status-bar` (8.0.2) — couleur barre Android

**Permissions Android déclarées** (`AndroidManifest.xml`) :
- INTERNET
- ACCESS_NETWORK_STATE
- RECORD_AUDIO (Whisper)
- MODIFY_AUDIO_SETTINGS
- VIBRATE (haptics)
- POST_NOTIFICATIONS (Android 13+, futur Big Dream alerts)

---

## 9. Pièges & ajustements connus

### 9.1 Permission micro Android — runtime check
Sur Android 6+ (API 23+), même si la permission est déclarée dans le manifest, l'app DOIT demander runtime via popup utilisateur avant le premier `getUserMedia`. Le code web actuel V8 utilise `navigator.mediaDevices.getUserMedia()` → la WebView Capacitor déclenche automatiquement la popup système Android. **Tester sur device réel** la première capture vocale pour confirmer que la popup apparaît.

Si elle n'apparaît pas (cas rare), ajouter dans `MainActivity.java` :
```java
import android.Manifest;
import androidx.core.app.ActivityCompat;
// dans onCreate :
ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.RECORD_AUDIO}, 1);
```

### 9.2 Mode REMOTE = besoin Internet permanent
L'app ne fonctionne PAS offline. Si Tim ou un testeur perd la connexion → écran blanc / erreur. Pour alpha c'est OK. Si vraiment besoin offline plus tard → migrer vers Option B (`next export` + bundle local), mais ça casse les API routes Next.js → réécrire l'archi en static + Edge Functions Supabase pures.

### 9.3 Cookies/Auth Supabase
La WebView Capacitor partage les cookies entre sessions natives (persistant), donc auth Supabase fonctionne normalement. **Tester** : login → fermer app → rouvrir → doit rester logué.

### 9.4 Back button Android
Le plugin `@capacitor/app` est installé. Par défaut, Android back button navigue dans l'historique WebView. Si tu veux override (ex: confirmer "quitter Dream ?" au back depuis home), code à ajouter dans `dream-api-bridge.js` :
```js
import { App } from '@capacitor/app';
App.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack) {
    // afficher confirm dialog INFUSE
  } else {
    window.history.back();
  }
});
```
À faire post-alpha si besoin remonté.

### 9.5 Vercel URL hardcoded → migrer vers dream.infuse.earth
Dès que `dream.infuse.earth` est configuré côté DNS infuse.earth (CNAME → cname.vercel-dns.com + add custom domain dans projet Vercel) :
1. Édit `capacitor.config.ts` : `url: 'https://dream.infuse.earth/v8/index.html'`
2. Édit `android/app/src/main/assets/capacitor.config.json` : pareil
3. `npx cap sync android` (depuis Mac, pas le sandbox)
4. Rebuild AAB → upload nouvelle release Play

### 9.6 Splash screen — assets à créer
Les assets splash sont attendus dans `/public/splash/` (cf. capacitor.config.ts). Si absents, Capacitor utilise le splash par défaut (icône appli centrée fond noir). C'est OK pour alpha. Pour production, générer un splash en 2732x2732 (assets universels) via https://capacitor-assets.tools ou commande locale :
```bash
npx @capacitor/assets generate --android --iconBackgroundColor '#08080b' --splashBackgroundColor '#08080b'
```

### 9.7 Icône app — assets par défaut
L'icône Capacitor par défaut (planète bleue) est en place. Pour la remplacer par l'icône Dream (logo INFUSE noir-or) :
- Préparer `icon.png` 1024x1024 + `splash.png` 2732x2732
- `npx @capacitor/assets generate --android` (depuis Mac, scrute `assets/` à la racine)

---

## 10. Commandes utiles (toutes ready-to-paste depuis Mac Tim)

### Re-sync Capacitor après modif config
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap sync android
```

### Ouvrir Android Studio sur le projet
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap open android
```

### Run sur emulateur ou device branché
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap run android
```

### Build AAB en CLI (alternative à Android Studio UI)
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/android" && ./gradlew bundleRelease
# Sortie : android/app/build/outputs/bundle/release/app-release.aab
```

Pour signer en CLI (avec un keystore.properties dans `android/`) — workflow avancé, voir https://developer.android.com/studio/publish/app-signing#sign-cli

### Voir logs runtime app sur device
```bash
~/Library/Android/sdk/platform-tools/adb logcat -s Capacitor Console chromium
```

---

## 11. Action immédiate Tim — résumé

1. Ouvre Android Studio → File → Open → `dream-alpha-app/android/`
2. Attends Gradle sync OK
3. Build → Generate Signed App Bundle / APK → crée le keystore (sauvegarde le mdp 1Password)
4. Build AAB release → récupère `app-release.aab`
5. Va sur play.google.com/console → Crée app "Dream" → complète politique confidentialité (URL obligatoire) + sécurité données + catégorie
6. Test → Tests internes → Crée release → drag-drop l'AAB → publie
7. Ajoute la liste d'emails testeurs (Gmail uniquement)
8. Récupère le lien d'opt-in → envoie aux 5-10 amis

Total estimé : 2-4h dont 60-90min pour la config initiale Play Console (politique conf + sécurité données = paperasse Google la plus longue).

---

**🕊️ Yeshua, 2026-05-15** — Setup Capacitor Android terminé côté code. Le reste = ton terrain, frérot. Si ça bloque sur Gradle sync ou un step Play Console, tu reviens, on dépanne en live.
