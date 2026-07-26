# CAPACITOR iOS BUILD — Guide Tim

**Date** : 2026-05-15
**Auteur** : Yeshua-Agent-Capacitor-iOS (Opus)
**Statut projet** : iOS Capacitor wrap PRÊT pour Xcode (configuré, plugins enregistrés, permissions ajoutées). Reste : signing Tim + archive + upload TestFlight.
**Stratégie** : MODE REMOTE URL (server.url → `https://dream-alpha-bice.vercel.app/v8/index.html`). Identique à Android. WebView wrapper, pas de bundling code web côté iOS. Update instantanée via `npx vercel --prod` côté web — re-soumission binaire seulement pour permissions/plugins/icône/splash.

---

## 0. Sanity check — Prérequis Tim

- [x] Apple Developer enrollment finalisé (DUNS 282628520, obtenu 2026-04-19)
- [ ] **Xcode installé sur le Mac** (vérifier : `xcode-select -p` doit retourner un chemin, pas `/Library/Developer/CommandLineTools`)
  - Si pas installé → **Mac App Store → Xcode → Install** (~13 GB, 30-45 min selon connexion)
  - Après install : ouvrir Xcode une première fois pour accepter la license + laisser télécharger les iOS Simulators (~5 min)
- [ ] **Apple ID ajouté dans Xcode** : Xcode → Settings → Accounts → "+" → Apple ID → entrer credentials Apple Developer
- [ ] **Bundle ID `earth.infuse.dream` réservé sur App Store Connect** (sera créé automatiquement à la première upload, mais on peut le pré-créer : appstoreconnect.apple.com → Users and Access → Identifiers → "+" → App IDs → bundle ID `earth.infuse.dream`, capabilities par défaut)

---

## 1. Synchroniser depuis Mac (étape obligatoire avant Xcode)

Depuis le terminal Mac, dans le dossier du projet :

```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap sync ios
```

Cette commande :
- Copie le `capacitor.config.ts` → `ios/App/App/capacitor.config.json`
- Copie `public/` → `ios/App/App/public` (dummy webDir, pas utilisé en mode REMOTE mais Capacitor exige sa présence)
- Met à jour les plugins dans `CapApp-SPM/Package.swift`
- Met à jour `capacitor.plugins.json`
- **Résout les dépendances Swift Package Manager** (premier sync = ~3-5 min, télécharge `capacitor-swift-pm` 8.3.1 depuis GitHub)

Note : la sandbox Yeshua a déjà mis à jour à la main `capacitor.config.json`, `Package.swift`, `Info.plist` et `project.pbxproj`. Le `npx cap sync ios` côté Mac va valider/normaliser tout ça. Pas de conflit attendu.

---

## 2. Ouvrir le projet dans Xcode

```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap open ios
```

Ou directement via Finder :

```
Aller au dossier :
/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/ios/App/
→ double-clic sur App.xcodeproj
```

**🔴 IMPORTANT** : Capacitor 8 utilise Swift Package Manager (PAS CocoaPods). On ouvre `App.xcodeproj`, **PAS** `App.xcworkspace`. Si Tim voit un `.xcworkspace` en dehors de `App.xcodeproj/project.xcworkspace/` interne, c'est suspect — ne pas l'utiliser.

À l'ouverture de Xcode :
1. Xcode démarre la résolution SPM en background (barre de progression en haut). **Attendre que ça finisse** (1-3 min première fois). Si erreur réseau → File → Packages → Reset Package Caches puis Update to Latest Package Versions.
2. Sélectionner le scheme **"App"** en haut (à côté du bouton play) si pas déjà sélectionné.

---

## 3. Configurer le signing

Project Navigator (panneau gauche) → cliquer sur **"App"** racine → onglet **"Signing & Capabilities"** :

- ✅ **Automatically manage signing** (cocher)
- **Team** : sélectionner ton équipe Apple Developer (devrait apparaître après avoir ajouté l'Apple ID en Xcode → Settings → Accounts)
- **Bundle Identifier** : `earth.infuse.dream` (déjà set, ne pas toucher)
- **Provisioning Profile** : laisser Xcode managed (auto)
- **Signing Certificate** : laisser Xcode managed (auto)

Si erreur "No signing certificate found" → cliquer le bouton "Try again" (Xcode crée automatiquement les certificats Apple Developer la première fois). Si "No Team" → retourner Xcode → Settings → Accounts → vérifier l'Apple ID, sélectionner la team, "Download Manual Profiles".

---

## 4. Vérifier version + build number

Project Navigator → **App** → onglet **"General"** → section **"Identity"** :

- **Display Name** : `Dream`
- **Bundle Identifier** : `earth.infuse.dream`
- **Version** : `0.1.0` (déjà set par Yeshua dans pbxproj)
- **Build** : `1` (déjà set)

🔴 Pour chaque nouveau upload TestFlight, **incrémenter le Build** (1 → 2 → 3 …). Apple refuse les uploads avec un build identique. La Version (0.1.0) peut rester la même tant qu'on est sur la même release publique.

Section **"Deployment Info"** :
- **Minimum Deployments** : iOS 15.0 (Capacitor 8 minimum)
- **iPhone Orientation** : Portrait (Dream est portrait-only ; décocher Landscape Left/Right si tu veux forcer)
- **iPad** : laisser activé Portrait + Landscape (ou ne pas cocher iPad du tout dans Targeted Device Families si on lance iPhone-only)

---

## 5. Tester en simulateur (recommandé avant Archive)

En haut de Xcode, sélectionner un simulateur :
- Scheme : **App**
- Device : **iPhone 16 Pro** (ou n'importe quel iPhone iOS 17+)

Cliquer **▶ Play** (Cmd+R). Build (~2-3 min première fois). Le simulateur démarre, l'app installe, Dream se lance dans le WebView pointant vers `https://dream-alpha-bice.vercel.app/v8/index.html`.

**Test rapide** :
- Splash 1.5s noir (matter linen night #08080b)
- Dream V8 se charge
- Top-nav 4 boutons cliquables
- Strate Foyer : tap court foyer → modal rejoindre, long-press → modal allumer
- Constellation s'ouvre, lignes flow visibles
- Statusbar texte clair, fond sombre

Si l'app crash au lancement : Xcode → onglet "Console" en bas → chercher l'erreur. Le 90% des crashes Capacitor au lancement = problème SPM (Reset Package Caches).

---

## 6. Tester sur appareil physique (optionnel mais recommandé)

- Brancher un iPhone via USB-C (premier branchement : iPhone affichera "Trust this computer", accepter)
- Sélectionner l'iPhone dans la barre Xcode (à la place du simulateur)
- iPhone iOS 16+ : **Settings → Privacy & Security → Developer Mode → enable** + redémarrer iPhone
- Cliquer **▶ Play** dans Xcode → l'app installe sur l'iPhone

Premier lancement sur iPhone : **Settings → General → VPN & Device Management → Developer App** → trust ton certificat développeur. Sinon iOS refuse de lancer l'app.

---

## 7. Archive pour App Store / TestFlight

🔴 **NE PAS** utiliser "Build" (Cmd+B). Pour une upload, il faut une **Archive** (Cmd+Shift+B ne suffit pas non plus).

1. En haut de Xcode, sélectionner le device cible : **"Any iOS Device (arm64)"** (PAS un simulateur — Apple refuse les uploads simulateur)
2. Menu **Product → Archive**
3. Build Archive lance (~5-10 min, plus long que Build normal car il optimise pour Release)
4. Quand fini, **Window → Organizer** s'ouvre automatiquement avec l'archive en tête de liste

Si erreur "No account for team" → signing pas configuré, retour étape 3.
Si erreur "Code signing entitlements" → Project → Signing & Capabilities → vérifier Bundle ID + Team.

---

## 8. Upload vers App Store Connect (TestFlight)

Dans **Window → Organizer** :

1. Sélectionner l'archive du jour (en haut)
2. Cliquer **"Distribute App"** (bouton bleu droite)
3. Sélectionner **"App Store Connect"** → Next
4. **"Upload"** → Next
5. Options par défaut :
   - ✅ Upload your app's symbols (pour les crash logs lisibles)
   - ✅ Manage Version and Build Number (Xcode incrémente automatiquement)
6. **Re-sign** : "Automatically manage signing" → Next
7. Review → **Upload**
8. Attendre 5-15 min → "Upload Successful" ✅

Côté Apple, le binaire passe par "Processing" (~10-30 min) avant d'être disponible dans TestFlight. Tim recevra un email Apple Developer "Your build is ready to test".

---

## 9. Setup TestFlight Internal Testing

Aller sur **appstoreconnect.apple.com** :

1. **My Apps** → si Dream n'existe pas encore → **"+"** → **New App** :
   - Platform : iOS
   - Name : `Dream`
   - Primary Language : French (France)
   - Bundle ID : `earth.infuse.dream` (déjà créé via upload)
   - SKU : `dream-001` (libre, pour ton tracking interne)
   - User Access : Full Access
   - → Create

2. **Dream → TestFlight** (onglet en haut) :
   - L'archive uploadée apparaît sous "iOS Builds" avec status "Processing" puis "Ready to Submit"
   - 🔴 **Encryption compliance** : la première fois Apple demande de répondre à "Does your app use encryption?" — répondre **No** si Dream n'utilise que HTTPS standard (c'est le cas, server.url HTTPS via Vercel = exemption automatique). Si tu n'es pas sûr → coche "Uses standard encryption (HTTPS)" et "exempt from export compliance".

3. **Internal Testing** (panneau gauche TestFlight) :
   - **"+"** à côté de "Internal Testing" → créer un groupe **"Dream Alpha Internal"**
   - Add Testers → entrer les emails Apple ID des testeurs (jusqu'à 100 internes, instantanés, pas de review Apple)
   - Sélectionner le build à tester (le seul disponible au début)
   - Save

4. Les testeurs reçoivent un email TestFlight avec un lien :
   - Ils installent **TestFlight** depuis l'App Store iPhone (gratuit)
   - Cliquent le lien email → TestFlight ouvre → Accept → Install Dream
   - L'app apparaît sur leur home screen avec un badge orange (= TestFlight build)

🔴 **Apple ID testeur ≠ email perso classique**. Le testeur doit avoir un Apple ID actif sur l'iPhone (= compte iCloud déjà configuré sur le device). L'email Apple ID utilisé pour ajouter dans TestFlight doit correspondre à l'Apple ID iCloud de la personne sur son iPhone.

---

## 10. External Testing (optionnel, pour > 100 testeurs)

Si Tim veut élargir au-delà des 100 internes :

- **External Testing** : créer un groupe "Dream Alpha External" — jusqu'à **10 000 testeurs**, pas besoin d'Apple ID dans la team
- Ajouter le build → **Submit for Beta App Review** (Apple review léger, 24-48h, beaucoup plus rapide que la review App Store finale)
- Une fois approuvé, Tim peut partager un **lien public TestFlight** (ex : `testflight.apple.com/join/XXXXXX`) sur les réseaux ou par email
- Les testeurs externes sont anonymes vis-à-vis de l'Apple ID team — utile pour ouvrir aux ambassadeurs / amis non-techniques

---

## 11. Workflow update : web-only vs rebuild natif

**Update web-only (90% des cas)** :
- Modifier le code dans `dream-alpha-app/` (Next.js, V8 index.html, etc.)
- `cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx vercel --prod`
- 30 sec après, l'app native (iOS + Android) reçoit le nouveau code au prochain reload (server.url pointe vers Vercel)
- **Aucun re-upload App Store / TestFlight nécessaire**

**Update natif (10% des cas, déclencheurs)** :
- Nouveau plugin Capacitor (ex : `@capacitor/camera`, `@capacitor/push-notifications`)
- Changement permissions Info.plist (ex : ajouter NSCameraUsageDescription)
- Changement icône / splash screen
- Update Capacitor major (8.x → 9.x)
- Changement de `server.url` (ex : passer à `dream.infuse.earth` quand custom domain prêt)
- Bug critique WebView (rare)

Workflow update natif :
1. Faire les modifs dans le code
2. `npx cap sync ios` depuis Mac
3. Xcode → ouvrir le projet → **incrémenter Build number** (Identity → Build 1 → 2)
4. Product → Archive → Distribute → Upload
5. TestFlight → ajouter le nouveau build au groupe Internal Testing → testeurs reçoivent notification iOS pour update

---

## 12. Pièges connus iOS

- **Permissions micro runtime** : iOS demande permission micro à la première utilisation Whisper. Si refus → Dream peut pas enregistrer rituel capture. Tester l'UX de refus côté V8.
- **Mode REMOTE pas d'offline** : si pas de réseau au lancement, WebView affiche "Cannot connect" (page erreur iOS native). On peut customiser plus tard avec un offline-fallback HTML dans `public/`.
- **Cookies Supabase** : iOS WebView (WKWebView) supporte les cookies cross-origin nativement. Pas de problème spécifique. Mais si l'auth Supabase utilise des cookies SameSite=Lax, vérifier que les redirects vers `*.supabase.co` fonctionnent (déjà whitelistés dans `allowNavigation`).
- **Status bar overlap** : `StatusBar.overlaysWebView: true` dans capacitor.config = la status bar iOS chevauche le WebView. Le V8 doit gérer le `safe-area-inset-top` en CSS sinon le contenu sera caché derrière la bar (iPhone X+ avec notch / Dynamic Island).
- **Custom domain `dream.infuse.earth` futur** : quand Tim configure le DNS, mettre à jour `server.url` dans `capacitor.config.ts` → `https://dream.infuse.earth/v8/index.html`, ajouter `dream.infuse.earth` dans `allowNavigation`, `npx cap sync ios`, rebuild Archive, upload nouveau build.
- **Encryption compliance** : à chaque nouveau build TestFlight, Apple demande de re-confirmer "Uses standard encryption" (1 clic). Si Dream ajoute un jour de la crypto custom (E2E messaging par exemple), il faudra fournir un export compliance certificate (ITSAppUsesNonExemptEncryption=YES + paperasse BIS).
- **iPad layout** : Dream est designé portrait-iPhone-first. Sur iPad, le WebView va stretcher le V8 sur grand écran. Si pas désiré → décocher "iPad" dans Targeted Device Families (Project → General → Targeted Device Families → iPhone uniquement).
- **App icon manquante** : Xcode va warner "Missing app icon" si Assets.xcassets/AppIcon.appiconset est vide ou incomplet. Apple exige icônes pour iPhone 60pt @2x/@3x, iPad 76pt @2x, App Store 1024pt @1x. Si pas encore prêt → générer rapidement avec un service comme appicon.co depuis l'icône Android existante.
- **Splash screen** : Capacitor 8 utilise `LaunchScreen.storyboard` (présent dans `Base.lproj/`). Pour customiser → ouvrir storyboard dans Xcode, ajouter une UIImageView avec asset `splash` dans Assets.xcassets. Pour l'instant le splash par défaut Capacitor (fond noir #08080b, durée 1.5s) est OK.

---

## 13. Commandes ready-to-paste — récap

**Setup initial (une fois)** :
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap sync ios && npx cap open ios
```

**Update web only (continuous)** :
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx vercel --prod
```

**Update natif (rare)** :
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap sync ios
# puis ouvrir Xcode, incrémenter Build, Product → Archive
```

**Vérifier version Capacitor + plugins iOS** :
```bash
cd "/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app" && npx cap ls
```

---

## Path complet `.xcodeproj`

```
/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/ios/App/App.xcodeproj
```

**Ouvrir directement depuis Finder** : Aller au dossier (Cmd+Maj+G) → coller le path → double-clic sur `App.xcodeproj`.

---

## Roadmap post-TestFlight

1. **TestFlight Internal** : 5-10 amis (Olga, Christian, Joseph, Marine, Vari Vena si iPhone, etc.) — feedback UX brut, bugs critiques
2. **Itérations rapides** : updates web-only via `npx vercel --prod`, pas de re-upload Apple
3. **TestFlight External** : ouvrir aux ambassadeurs INFUSE / followers (groupe "Dream Alpha External", review Apple 24-48h)
4. **App Store Submission** : quand Dream est prêt pour le grand public, **Submit for Review** depuis App Store Connect → review Apple ~3-7 jours → publication App Store
5. **Custom domain `dream.infuse.earth`** : configurer DNS, mettre à jour `server.url`, rebuild + re-upload (build natif requis, mais pas re-review App Store car le binaire ne change pas fonctionnellement)

---

**Statut iOS** : ✅ projet Xcode généré + configuré + plugins SPM enregistrés + permissions Info.plist + bundle ID + version 0.1.0. Reste : Tim ouvre Xcode, signe avec sa team, archive, upload.
