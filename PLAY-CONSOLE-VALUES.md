# Play Console — Valeurs à remplir pour Dream

Document de référence pour les 7 sections obligatoires Google Play.

---

## 1. Politique de confidentialité

**URL Privacy Policy** : `https://dream-alpha-bice.vercel.app/privacy`
(quand custom domain : `https://dream.infuse.earth/privacy`)

→ Section "App content" → "Privacy Policy" → coller URL → Save

---

## 2. Accès aux applications

**Question** : "Toutes les fonctionnalités sont-elles disponibles sans restriction d'accès ?"

**Réponse** : ⚠️ **Non, certaines fonctionnalités requièrent un identifiant** (l'app demande un email pour magic link auth).

**Identifiants test pour Google reviewer** :
- Username/email : `play-review@infuse.earth` (créer ce compte avant submit)
- Password : N/A — magic link
- Instructions :
  > "L'application utilise une authentification sans mot de passe (magic link). Pour tester :
  > 1. Lancer l'app
  > 2. Entrer l'email `play-review@infuse.earth` à l'écran d'accueil
  > 3. Click 'recevoir le lien'
  > 4. Le lien magique sera reçu sur cette boîte mail
  > 5. Cliquer le lien depuis le navigateur du device de test
  > 6. L'app ouvre le compte test pré-rempli avec données démo"

---

## 3. Annonces

**Réponse** : ❌ **Non, l'application ne contient PAS d'annonces tierces**

(Pas de Google AdMob, pas de bannières, rien.)

---

## 4. Classification du contenu (IARC)

**Email à fournir** : `gestion@infuse.earth`

**Catégorie** : `Référence, actualités ou éducation` (le plus proche de "outil personnel/spirituel")

**Questionnaire** — réponses :
- Violence : Non
- Contenu sexuel : Non
- Langage grossier : Non
- Substances : Non (l'app parle de psyché/rêves mais pas de drogues)
- Drogues : Non
- Jeux d'argent : Non
- Localisation utilisateur partagée : Non
- Achats utilisateurs : Non (pour l'instant)
- Génère contenu utilisateur : **Oui** (les utilisateurs déposent leurs propres rêves)
- Permet aux utilisateurs d'interagir : Oui (Anima IA + Cercles avec autres users)
- Partage informations personnelles : Non
- Partage avec autres utilisateurs : Optionnel (Cercles)
- Liens vers contenus externes : Non

**Avertissements éthiques particuliers** :
- ⚠️ Contenu lié à la santé mentale : si demandé → **Oui** (l'app aide à explorer rêves/intuitions, propose des ressources de soutien crisis-safe)
- → "L'application inclut un système crisis-safe qui détecte automatiquement les expressions de détresse et propose des ressources de soutien (3114 prévention suicide France, SOS Amitié, SOS Phénix). L'application n'est pas un dispositif médical et ne remplace pas un suivi professionnel."

**Classification attendue** : PEGI 12 ou ESRB Teen (contenu spirituel/réflexif, pas d'éléments choquants)

---

## 5. Cible (Target audience)

**Tranches d'âge cibles** : ☑️ **18 ans et plus uniquement**

(Justification : contenu introspectif/spirituel + crisis-safe → adulte uniquement, pas adapté aux mineurs)

**Application destinée aux enfants** : ❌ Non

---

## 6. Sécurité des données (Data Safety form)

### Données collectées :

| Type de donnée | Collectée ? | Partagée ? | Optionnelle ? | Pourquoi |
|---|---|---|---|---|
| **Adresse email** | Oui | Non | Non | Authentification (magic link) |
| **Contenu généré par utilisateur** (texte, audio) | Oui | Non | Non | Cœur du service : journal onirique |
| **Enregistrements vocaux** | Oui (temporaire) | Oui (OpenAI Whisper, transcription seule) | Oui | Transcription voix→texte. Audio supprimé immédiatement après transcription. |
| **Messages dans l'app** | Oui | Non | Non | Conversations avec Anima |

### Pratiques de sécurité :

- ☑️ **Données chiffrées en transit** (HTTPS/TLS)
- ☑️ **Données chiffrées au repos** (Supabase encryption)
- ☑️ **L'utilisateur peut demander suppression de ses données** → URL : `https://dream-alpha-bice.vercel.app/data-deletion`
- ❌ Pas de partage avec des tiers à des fins publicitaires
- ❌ Pas d'utilisation de tes données pour entraîner des modèles IA
- ☑️ Pratiques de sécurité auditées (oui — RLS Supabase + auth magic link)

### Pas collecté :

- Localisation GPS
- Identifiants d'appareil
- Contacts
- Photos/médias
- Fichiers et documents
- Historique web ou app
- Performances de l'app
- Diagnostics

---

## 7. Applis gouvernementales

**L'application est-elle développée pour ou au nom d'un gouvernement ?**

**Réponse** : ❌ **Non**

---

## ORDRE recommandé pour remplir

1. **Pays cibles** (Production → Pays/régions) → ajouter France + tous les pays UE + US
2. **Annonces** (rapide, 1 question)
3. **Cible** (1 question : 18+)
4. **Applis gouvernementales** (1 question : Non)
5. **Accès aux applications** (créer compte test play-review@infuse.earth d'abord)
6. **Sécurité des données** (~10 min — formulaire long)
7. **Classification du contenu** (~5 min — questionnaire IARC)
8. **Politique de confidentialité** (URL privacy après deploy Vercel)

Total temps : ~30-45 min.

---

## Après remplissage

**Lien opt-in tests internes (correct) :** `https://play.google.com/apps/internaltest/4700912902485442479`

Note : `https://play.google.com/apps/testing/earth.infuse.dream` = lien open testing (ne pas utiliser pour internal testing — affiche "App not available" à tort).

Le lien internaltest est accessible dans Play Console → Tests internes → Testeurs → "Copier le lien".

**Statut vérifié 2026-05-16 :** Le lien fonctionne ✅ — affiche "You're invited to test earth.infuse.dream (unreviewed)" avec bouton "Accept invite".

---

## Action immédiate

1. ✅ Privacy Policy page créée : `src/app/privacy/page.tsx`
2. ✅ Data Deletion page créée : `src/app/data-deletion/page.tsx`
3. ✅ Toutes les déclarations Play Console remplies (2026-05-16)
4. ✅ Lien opt-in tests internes fonctionnel : `https://play.google.com/apps/internaltest/4700912902485442479`
