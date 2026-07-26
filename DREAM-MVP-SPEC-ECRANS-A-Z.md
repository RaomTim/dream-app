# DREAM MVP — SPEC ÉCRANS A→Z

> **Statut** : `partial` — v1 complète, **3 passes faites** (rédaction · simplicité · croisement code réel). Reste : validation Tim → absorption 2_DESIGN §14.
> **Date** : 2026-07-10 · **Auteur** : Yeshua (Fable 5) · **Mandant** : Tim.
> **Nature** : doc de travail → à absorber dans `2_DESIGN.md` §14 après validation Tim, puis déplacer dans `_archive_pre_canonical/`.
> **But** : décrire CHAQUE écran, chaque tap, chaque bouton→réaction, chaque état (vide/chargement/erreur/hors-ligne/premier usage), pour que le design (Claude Design) et le câblage (agents) se fassent sans aucune décision à inventer et sans aucun lien mort.
> **Légende** : ✔ déjà construit · ⚙ à câbler/reprendre · 🆕 nouveau (social/scan).

---

## §0 — PRINCIPES TRANSVERSES (valables sur tous les écrans)

### 0.1 Vocabulaire mondial (loi)
- Niveau de langue : WhatsApp / Insta / Outlook. Un enfant de 12 ans et un parent de 60 ans comprennent chaque mot.
- **Un seul mot signature dans l'app : « kaïros »** — et encore, uniquement dans les bulles ⓘ et le guide de départ. À l'écran on dit « moment ».
- Bannis définitifs : seuil, posé, tenir, geste (comme concept), honorer, oraculaire, numineux, polyphonie, substrat, transmutation. Ces mots vivent dans nos docs, jamais à l'écran.
- Chaque libellé de bouton = verbe simple : Comprendre · Créer · Partager · Garder pour moi · Réessayer · Annuler.

### 0.2 Le système ⓘ à deux étages (« la profondeur cachée »)
- **Étage 1** : chaque terme ou fonction qui peut poser question porte un petit ⓘ (ou le libellé souligné pointillé). Tap → bulle d'UNE phrase, langage courant.
- **Étage 2** : en bas de chaque bulle, « En savoir plus » → fiche plein écran : ~200 mots max, mots simples, exemples concrets. En bas de fiche, pour les curieux : « D'où ça vient » (2-3 lignes : la tradition/l'auteur, sans jargon).
- Les fiches vivent toutes dans un même index (« Comment marche Dream », accessible depuis Réglages) — mais on n'y arrive JAMAIS par un menu en premier : toujours par le ⓘ en contexte.
- Règle d'écriture des fiches : phrases courtes. Zéro métaphore floue. Si une image poétique n'aide pas la compréhension en une lecture, on la coupe.

### 0.3 États standards (chaque écran les définit, sinon ces défauts s'appliquent)
- **Chargement** : jamais de spinner brut. Le contenu apparaît en fondu (377 ms). Si > 2 s : une ligne « un instant… ».
- **Vide (premier usage)** : jamais un écran blanc. Une phrase d'accueil + l'action possible. Ex. Journal vide : « Tes rêves apparaîtront ici. Dépose le premier depuis l'accueil. » + bouton → Accueil.
- **Erreur réseau** : « Pas de connexion. Ton dépôt est gardé sur le téléphone — il partira tout seul. » (la capture marche TOUJOURS hors-ligne ✔). Bouton « Réessayer » sur les écrans de lecture.
- **Hors-ligne** : capture voix/texte OK partout. Tout ce qui demande l'IA affiche : « Dès que tu recaptes du réseau, je m'en occupe. »
- **Suppression** : partout où un contenu s'affiche, appui long → « Supprimer » (double confirmation : « Sûr ? Ça efface pour de bon. »). Rien ne s'efface sauf par l'utilisateur.

### 0.4 Gestes globaux
- Swipe horizontal Accueil nuit ↔ Accueil jour (uniquement sur les accueils).
- Retour : flèche ← en haut à gauche, partout, toujours au même endroit. + geste système (edge swipe iOS / back Android).
- Appui long sur n'importe quel dépôt (liste, groupe, mur si c'est le tien) → menu : Ouvrir · Partager · Supprimer.
- Tap sur ⓘ n'importe où → bulle (jamais de navigation surprise).

### 0.5 Anti-patterns (rappel dur)
- Zéro streak, badge, score, compteur public, classement. Zéro emoji décoratif dans l'UI (les emojis restent possibles dans les chats de groupe, écrits par les humains).
- Zéro notification non choisie explicitement par l'utilisateur.
- Zéro modal qui interrompt une saisie. Zéro double question à l'écran.
- Une idée par écran. Si un écran doit dire deux choses → deux écrans.

### 0.6 Animations légères (registre unique)
- Apparitions : fondu 377 ms, léger déplacement 8 px vers le haut. Ease doux.
- Le cercle de capture : respiration lente continue (~4 s/cycle), s'intensifie doucement pendant l'enregistrement.
- Transitions nuit↔jour : la lumière bascule en 610 ms (pas un flash).
- Boutons : press = 0.97 scale, 89 ms. Jamais de rebond cartoon.
- `prefers-reduced-motion` : tout drift coupé, fondus conservés.

---

## §1 — CARTE DE NAVIGATION (vue d'ensemble)

**Nav basse, 4 onglets, toujours visible sauf pendant une capture/un guide :**
`Accueil ☾/☀ · Groupes · Mur · Journal`

```
ONBOARDING (première fois) → Connexion → Accueil nuit
ACCUEIL NUIT ☾ ⟷ (swipe) ⟷ ACCUEIL JOUR ☀
  │ maintenir = voix · taper = écrire · 📷 = scanner
  ▼
CAPTURE (état) → TON RÊVE / TON MOMENT (vérification)
  ├── Comprendre → conversation → (option mythe) → (option guide)
  ├── Créer → Forge : choisir → œuvre → galerie
  ├── Partager → sheet : groupe(s) / Mur / annuler
  └── Garder pour moi → retour Accueil (défaut : fermer = garder)
GROUPES → liste → un groupe (dépôts + chat) → dépôt ouvert / lecture de Dream / défis / réglages du groupe
MUR → onglets Rêves ☾ / Cœur ☀ → dépôt ouvert (anonyme)
JOURNAL → onglet Liste (Atlas) / onglet Univers (7 rayons) → fiche rêve / fiche symbole → fils dorés → autre rêve
RÉGLAGES (depuis Journal, icône ⚙ en haut) → compte, rendez-vous, réveil, alias du Mur, abonnement, « Comment marche Dream », export, suppression
```

**Règle d'or de câblage** : chaque flèche ci-dessus est un lien RÉEL. La checklist §12 vérifie que chaque bouton du doc pointe vers un écran du doc. Aucun bouton ne peut pointer ailleurs.

---

## §2 — ZONE ACCUEIL

### Écran A1 — Accueil nuit ☾ ✔ (à re-skinner « D3 ultra simple »)
**Rôle** : déposer un rêve en moins de 10 secondes. C'est l'écran d'ouverture par défaut entre 21h et 11h (sinon A2 — configurable, défaut intelligent silencieux).
**Contenu** (de haut en bas) :
- Date du jour, discrète (« lundi 25 mai »), coin haut gauche. Coin haut droit : rien (pas d'icônes parasites).
- Le **cercle lumineux** au centre (la lune D3). En dessous, un mot : **« rêve »**. En dessous, petit : **« maintiens · ou écris »**.
- Sous le cercle, le **fil des derniers dépôts** ✔ (4 max, une ligne chacun : glyphe type + titre + date). Tap → J3 fiche rêve.
- Tout en bas : nav 4 onglets.
**Interactions** :
- **Maintenir le cercle** → A3 Capture voix (démarre immédiatement, haptique douce unique).
- **Taper le cercle** (tap court) → A3 Capture texte (clavier monte, curseur prêt).
- **Icône 📷** (petite, sous « maintiens · ou écris ») → A5 Scanner. 🆕
- **Swipe gauche/droite** → A2 Accueil jour (bascule lumière 610 ms).
- Tap un dépôt du fil → J3.
**États** : premier usage → le fil est remplacé par « Ton premier rêve t'attend. » · hors-ligne → rien ne change (capture OK).
**ⓘ présents** : aucun. Cet écran n'explique rien — il est évident ou il a raté.

### Écran A2 — Accueil jour ☀ ✔ (miroir exact)
**Rôle** : déposer ce qu'on vit le jour, aussi vite qu'une story.
**Contenu** : même structure que A1, lumière inversée (papier chaud). Le cercle = soleil doux. Mot central : **« aujourd'hui »**. En dessous : « maintiens · ou écris ».
- Sous le cercle : **5 puces** (chips 44 px min) : **Sieste · Intuition · Signe · Coïncidence · Frisson**, chacune avec ⓘ au premier survol d'usage (voir §0.2 ; textes des bulles en §8.4).
- Fil des derniers dépôts de jour (mêmes règles que A1).
**Interactions** :
- Maintenir/taper le cercle → A3 (dépôt libre « message du cœur » — l'app ne demande PAS de catégorie).
- **Taper une puce** → A3 Capture voix directe de ce type, **compte à rebours discret 10 s visible** (dépassable : re-maintenir prolonge). Le type est pré-rempli.
- Swipe → retour A1.
**États** : premier usage → sous les puces : « Un truc t'a traversé aujourd'hui ? Pose-le en 10 secondes. »

### Écran A3 — Capture (état plein écran) ✔ (⚙ verrou à finir)
**Rôle** : capter, sans friction, sans mise en scène.
**Voix** : le cercle respire plus fort. La **transcription s'écrit en direct** ✔ sous le cercle. « Glisse vers le haut pour verrouiller » ⚙ (mains libres). Relâcher (ou re-taper si verrouillé) = fin.
**Texte** : zone de saisie plein écran, gros corps (≥19 px), clavier ouvert. Bouton « OK » en bas à droite.
**Toujours visible** : « Annuler » (haut gauche) → confirmation UNIQUEMENT si contenu non vide (« Jeter ce dépôt ? »).
**Fin de capture** → A4.
**États** : hors-ligne → bandeau 1 ligne « Gardé sur le téléphone — il partira tout seul. » · micro refusé → « Dream a besoin du micro pour la voix. Tu peux aussi écrire. » + bouton Réglages système.

### Écran A4 — Ton rêve / Ton moment (vérification) ✔ (⚙ ajouts audio)
**Rôle** : vérifier, corriger, puis choisir ce qu'on en fait. UN écran, QUATRE sorties.
**Contenu** :
- Titre : « Ton rêve » (nuit) / « Ton moment » (jour). Sous-titre : date + heure + durée audio le cas échéant.
- **Le texte**, gros, éditable au tap (le clavier monte, on corrige, « OK »).
- Lecteur audio ✔ si dépôt vocal (l'audio est GARDÉ — décision 10/07).
- Bouton discret « + Ajouter » ⚙ → menu : « à la voix » (nouvel audio qui s'empile dessous, daté) / « au clavier » (bloc texte ajouté).
- Si nuit : ligne douce « Autre chose ? Une image, une sensation ? » ✔ (tap → ajout).
- Si jour et pas de type : les 5 puces « c'était… » ✔ (optionnelles, skippables).
- **Les 4 boutons** (pleins, ≥44 px, pile verticale) :
  1. **Comprendre** → C1
  2. **Créer** → F1
  3. **Partager** → sheet P1
  4. **Garder pour moi** → retour à l'accueil (toast 1,5 s : « Gardé. »)
- Fermer l'écran (←) = « Garder pour moi » silencieux. JAMAIS de perte.
**États** : transcription en cours (offline→online) → le texte arrive en fondu, les 4 boutons sont déjà actifs (Comprendre attendra la transcription avec « un instant… »).

### Écran A5 — Scanner 🆕
**Rôle** : photographier une page de carnet manuscrite → texte. Argument de vente : des années de carnets entrent dans Dream en un soir.
**Flux** : Caméra plein écran (cadre-guide clair, « Cadre ta page ») → photo → **lecture de l'écriture** (2-5 s, « Je lis ta page… ») → A4 avec le texte reconnu + mention « Vérifie ce que j'ai lu — l'écriture manuscrite me joue parfois des tours. » + la photo d'origine gardée en pièce jointe du dépôt.
- Multi-pages : après une page, « + une autre page » (les textes s'enchaînent dans le même dépôt, ou « nouveau rêve » pour séparer).
- **Question date** : « C'est un rêve de quand ? » → Aujourd'hui / Choisir une date / Je sais pas (défaut : date du scan, marqué « importé »).
**États** : lecture ratée → « Je n'arrive pas à lire cette page. Réessaie avec plus de lumière ? » + Réessayer / Taper le texte à la main. · hors-ligne → photo gardée, lecture différée.

### Écran A6 — Réveil ✔ (réglage dans §8, écran ici)
**Rôle** : le matin, zéro friction entre les yeux qui s'ouvrent et le rêve capté.
**Écran de sonnerie** (si réveil Dream activé) : heure, gros. Carillon doux ✔. Deux boutons énormes : **« Raconte ton rêve »** (→ A3 voix, la sonnerie se coupe, on enregistre direct) · **« Plus tard »** (snooze 9 min) · petit : « Arrêter ».
**Honnêteté technique** ✔ : en web/PWA les limites existent (notif locale) ; en app native (Capacitor ✔) c'est un vrai réveil. La spec assume la version native.

---

## §3 — COMPRENDRE & GUIDES

### Écran C1 — Comprendre (conversation) ✔
**Rôle** : la promesse n°1 de l'app — une interprétation riche. Toi d'abord, Dream ensuite.
**Contenu** : conversation plein écran, ton rêve épinglé en haut (repliable).
**Flux exact** :
1. Dream ouvre TOUJOURS par toi : « Relis-le. Qu'est-ce que tu y vois, toi ? » + deux boutons : **« Je me lance »** (zone texte/voix) · **« Je sais pas — dis-moi ce que tu vois »**.
2. Si l'utilisateur donne sa lecture → Dream la reçoit (« Je garde ça — c'est TA lecture qui compte le plus. »), l'apprentissage l'enregistre ✔, puis propose la sienne.
3. **L'interprétation Dream** ✔ : s'écrit en direct (streaming), 150-300 mots, langage courant, structurée : ce qui ressort → le lien possible avec ta vie (si notes de jour pertinentes ✔) → UNE question ouverte pour finir. Jamais de verdict (« voici une piste », pas « voilà ce que ça veut dire »).
4. Fin d'interprétation, trois boutons :
   - **« Ça me parle » / « Moyen » / « Pas vraiment »** (1 tap, nourrit l'apprentissage ✔ — mapping felt-shift derrière, invisible).
   - **« Il y a une vieille histoire qui ressemble à ton rêve — je te la raconte ? »** ✔ (32 contes réels, jamais inventés).
   - **« Aller plus loin »** → C2 (les guides adaptés).
5. **Nommer le rêve** ✔ : « On lui donne un nom ? » → 3 propositions + champ libre + « Plus tard » (défaut : « Rêve du 25 mai »).

#### C1bis — L'interprétation gardée + la boucle d'apprentissage (Tim, 2026-07-11 — cœur du moat)
Fin d'interprétation, les 3 boutons 1-clic restent LE geste (« Ça me parle · Moyen · Pas vraiment »). Extensions :
- **« Ça me parle »** → l'interprétation est **gardée automatiquement** sur la fiche du rêve (section « Interprétation gardée ») + invitation douce, skippable : *« Qu'est-ce qui résonne pour toi ? Dis-le en une phrase — voix ou texte. »* → cette **note de résonance** est stockée avec l'interprétation ET nourrit l'apprentissage en profondeur (les symboles qu'elle mentionne = validés par l'auteur, poids fort).
- **« Moyen » / « Pas vraiment »** → un bouton **« Corriger »** apparaît : l'utilisateur propose SA correction (texte ou audio) → Dream répond une version révisée courte qui intègre la correction → re-boutons. La correction = signal d'apprentissage le plus fort (c'est l'utilisateur qui enseigne son langage).
- **« Garder »** (signet discret) disponible sur toute interprétation — garder sans juger.
- **Fiche rêve (J3)** : section « Interprétation gardée » = le texte gardé + ta note de résonance + l'historique des corrections. Modifiable/supprimable à vie.
- **Apprentissage (non négociable)** : chaque action (garder, corriger, note de résonance) alimente le lexique personnel (`user_meaning_layer`/`user_validations` existants) avec des poids distincts : correction > note de résonance > 1-clic. Rien n'est un simple like : tout enseigne.
**États** : hors-ligne → « Je te répondrai dès que le réseau revient. Ta lecture à toi, elle, est déjà gardée. » · Dépôt trop court (< 10 mots) → Dream demande UN détail avant d'interpréter.
**ⓘ** : sur « TA lecture compte le plus » → bulle : « Plus tu dis ce que tu vois, plus Dream apprend TON langage — et plus ses lectures te ressemblent. »

### Écran C2 — Guides proposés (mini-sheet, pas un écran) ⚙
**Rôle** : proposer 1 à 3 guides ADAPTÉS à ce dépôt, jamais un catalogue.
**Contenu** : « Pour ce rêve, je te propose : » + 1-3 cartes (nom simple · 1 phrase · durée). En bas, discret : « Tous les guides » → C4.
**Logique de choix (câblage)** : rêve interrompu → Retourner dans le rêve · rêve marquant (rayonne) → Un geste concret · cauchemar → Se rendormir en douceur (+ carte détresse si mots-clés) · coïncidence → Raconter la coïncidence · corps mentionné → Écouter son corps · défaut → Raconter en entier.

### Écran C3 — Guide en cours ✔⚙
**Rôle** : être pris par la main, une question à la fois.
**Structure** : intro (1 écran : quoi, combien de temps, « on y va ? ») → **une seule question par écran**, réponse voix ou texte, 3 points de progression en haut → « Pause » possible à tout moment (haut droit) : le guide se gare, se retrouve sur la fiche du rêve (« Guide en pause — reprendre »).
**Fin de guide** : « Et là, ça te fait quoi ? » → 3 boutons : **« Quelque chose a bougé » · « Pareil qu'avant » · « Je sais pas »** (1 tap, skippable en fermant — jamais bloquant ; c'est le felt-shift, sans le mot). Puis : « C'est gardé avec ton rêve. » → retour fiche rêve.
**Les 10 guides (noms moldus définitifs)** :
| Nom à l'écran | 1 phrase à l'écran | Legacy |
|---|---|---|
| **Raconter en entier** | « Des questions simples pour retrouver les détails qui manquent. » | DREAM 10 étapes ✔ config |
| **Retourner dans le rêve** | « Fermer les yeux et revisiter ton rêve, éveillé, pour voir la suite. » | re-entry ✔ construit |
| **Un geste concret** | « Prolonger ton rêve par une petite action réelle : dessiner, noter, poser. » | honorer ✔ construit (3 gestes) |
| **Une intention pour la nuit** | « Avant de dormir : poser une question à ta nuit. » | pré-sommeil ✔ config |
| **Se rendormir en douceur** | « Après un mauvais rêve ou un réveil brutal : revenir au calme. » | REENTRY 6 ✔ config |
| **Relire sa journée** | « 5 minutes le soir pour repasser le film du jour. » | DAY 5 ✔ config |
| **Écouter son corps** | « Où ça se loge dans ton corps, et qu'est-ce que ça demande. » | Focusing ⚙ (moteur générique ✔ : `protocoles/sonnet-step`) |
| **Parler à une image** | « Choisir une image du rêve et la laisser répondre. » | Dream Tending ⚙ |
| **Raconter la coïncidence** | « Dérouler ce qui s'est passé, dans l'ordre — souvent ça éclaire tout seul. » | synchronicity story ⚙ |
| **Attraper une intuition** | « Noter ce qui vient de te traverser avant que ça s'envole. » | rêverie/hypnagogie ⚙ |

### Écran C4 — Tous les guides ⚙
Liste des 10 cartes. Chaque carte : nom, phrase, durée, « Déjà fait N fois » (compteur PRIVÉ, informatif, jamais un objectif). Tap → C3 (le guide demande alors sur quel dépôt travailler, ou « sans dépôt » pour les guides du soir).

### Les 3 portes des guides (récap câblage)
1. **Contextuelle** : bouton « Aller plus loin » sur chaque dépôt → C2 (1-3 adaptés).
2. **Rendez-vous** : notifications choisies (voir §9 — l'utilisateur sait EXACTEMENT ce qu'il active).
3. **Conversation** : Dream propose en contexte dans C1, une ligne, jamais deux fois de suite si refusé.

---

## §4 — GROUPES

### Écran G1 — Mes groupes ✔⚙
**Contenu** : liste (avatar simple = initiale colorée, nom, dernière activité en 1 ligne : « Léa a partagé un rêve · hier »). En haut : deux boutons : **« Créer un groupe »** → G2 · **« J'ai un code »** → G3.
**États** : vide → « Un groupe, c'est ta famille, ton duo, tes amis — un endroit où partager vos rêves. » + les 2 boutons. Pastille sobre (point, pas chiffre rouge) si nouveauté dans un groupe.

### Écran G2 — Créer un groupe ✔ (3 étapes, 1 écran séquencé)
1. « Comment il s'appelle ? » (champ + suggestions : Famille · Duo · Amis · Boulot)
2. Optionnel, skippable : « Vous traversez quelque chose ensemble ? » ⓘ (champ intention libre — bulle : « Si tu le dis à Dream, il pourra vous faire une lecture d'ensemble de temps en temps. »)
3. **Le lien + le code**, gros, boutons « Envoyer sur WhatsApp/Telegram/… » (share sheet système) · « Copier ». → G4 direct (le groupe existe, vide).

### Écran G3 — Rejoindre ✔
Champ code (ou lien cliqué → arrive ici pré-rempli) → **bulle de présentation** ✔ : nom, description, nombre de membres, intention si publique → « Rejoindre » / « Annuler ». Groupes semi-publics ✔ : « Demander à entrer » → le créateur approuve.

### Écran G4 — Le groupe 🆕⚙ (l'écran social principal)
**Structure — 2 étages, un seul scroll** :
- **Étage haut : « Rêves & moments partagés »** (libellé écran) — cartes (comme le Journal mais aux couleurs de leur monde : carte nuit pour un rêve, carte jour pour un moment). Chaque carte : prénom (ou alias choisi pour CE groupe), type, titre/extrait, date. Tap → G5. Réactions ✔ (backend `circles/[id]/reactions`).
- **Étage bas : la conversation** ⚙ — chat classique : texte, vocaux ✔ (non transcrits, comme Telegram), photos, réactions. Zéro IA ici, zéro apprentissage — c'est chez eux, pas chez Dream.
- **Barre du bas** : champ message + trombone. **Partager un rêve se fait depuis A4/J3 via « Partager »**, jamais depuis le chat (une porte unique = pas de confusion).
- **Header** : nom du groupe → tap → G7 réglages. Si intention définie : ligne sous le nom + bouton **« Demander une lecture à Dream »** → G6 (1×/jour max ✔ spec).
- Si un **défi** est actif : carte fine sous le header (« Défi : noter ses rêves 7 matins — 3 participants ») → tap → G-défis.
**États** : vide → « Personne n'a encore rien partagé. Le premier rêve brise la glace. »

### Écran G5 — Dépôt ouvert dans le groupe 🆕
Le dépôt en entier (lecture seule) + fil de commentaires dédié (texte/vocal). PAS les 4 boutons (c'est le rêve d'un autre) — sauf si c'est le tien : « Retirer du groupe » (appui long). ⓘ discret : « Ce rêve reste la propriété de celui qui l'a déposé. »

### Écran G6 — Lecture de Dream (groupe) 🆕⚙ (backlog assumé 11/06 → MVP)
**Déclencheur** : bouton header (1×/jour, n'importe quel membre). **Rendu** : une carte spéciale dans le fil des partages : « Ce que Dream voit cette semaine » — 100-150 mots : les symboles qui se répondent ENTRE les membres (jamais « qui a rêvé quoi » nominatif sur les patterns sensibles), 1 question ouverte pour le groupe. Commentable comme un partage. **C'est le germe visible de l'entité collective** (Anima de Cercle = V1.1+, quand ~30 partages).
**Backend ✔ découvert en pass 3** : les routes existent déjà — `circles/[id]/restitutions` (la lecture), `circles/[id]/intentions` (+ votes), `circles/[id]/resonances`. Il reste l'UI + le garde-fou 1×/jour à vérifier.

### Écran G-défis 🆕
Dans G4 (pas un onglet séparé) : « Lancer un défi » → titre libre (suggestions : « Noter ses rêves 7 matins » · « Une intention chaque soir ») → les membres tapent **« J'en suis »** → la carte montre les prénoms participants. C'est TOUT. Pas de suivi automatique, pas de compteur de jours, pas de rappel : les encouragements se font dans le chat, entre humains. Le défi se termine quand son créateur tape « Terminer » (petite ligne : « Défi terminé 🎉 » — seul endroit où un emoji système est toléré ? NON — on tient la ligne : « Défi terminé. Bravo à vous. »).

### Écran G7 — Réglages du groupe 🆕
Nom · intention (modifier/retirer) · mon alias dans CE groupe · membres (liste ; le créateur peut retirer) · inviter (relien le G2-étape-3) · notifications de ce groupe (on/off) · **Quitter le groupe** (double confirmation).

---

## §5 — LE MUR

### Écran M1 — Le Mur 🆕
**Rôle** : la 3e voie — public mais sans identité. On lit l'inconscient des autres, on dépose le sien, personne ne compte rien.
**Structure** : deux onglets en haut : **☾ Rêves** · **☀ Cœur**. Flux vertical de cartes, chronologique pur (« cette nuit », « hier »). Chaque carte : texte (tronqué à ~6 lignes) + une seule mention : **« Quelqu'un · cette nuit »** — RIEN d'autre. Pas d'alias, pas de persona, pas de photo de profil, pas de likes visibles, pas de nombre de vues. (Décision pass 2 : l'anonymat du Mur est TOTAL — pas d'identité récurrente, même pseudonyme. Plus simple ET plus sûr.)
**Backend** ⚙ : aucune route existante — à créer (`wall/feed`, `wall/post`, `wall/touch`, `wall/report`), k-anonymity et modération incluses.
**Interactions** : tap carte → M2 · scroll infini par nuits (« ── la nuit du 8 juillet ── » en séparateurs) · PAS de pull-to-refresh-dopamine : le Mur se met à jour à l'ouverture, point (ⓘ : « Le Mur se renouvelle à son rythme. Rien à rafraîchir. »).
**Déposer au Mur** : uniquement via « Partager » depuis A4/J3 → sheet P1. Pas de bouton « poster » sur le Mur (le Mur n'est pas un endroit où l'on performe, c'est un endroit où l'on dépose).
**États** : bêta fermée → le Mur = les ~50 invités (modération tenable) · vide → « Le Mur s'éveille avec ses premiers rêveurs. »

### Écran M2 — Dépôt du Mur ouvert 🆕
Plein écran, typographie généreuse. En bas, UN bouton : **« Ça me touche »** (cœur fin) — l'auteur reçoit une douce trace privée (« 3 personnes ont été touchées par ton rêve » — visible par LUI SEUL, jamais public). Signaler (petit drapeau, appui long) → file de modération.

### Sheet P1 — Partager (transversale) 🆕
Depuis A4/J3 : « Partager vers… » → **Mes groupes** (cases à cocher multi) · **Le Mur, anonymement** ⓘ → première fois : mini-écran « Sur le Mur, personne ne saura que c'est toi. Même pas tes groupes. Tu peux le retirer quand tu veux. » + « OK, déposer » — les fois suivantes : direct. En bas : « Annuler ». Toast : « Partagé. »
**Retirer** : depuis J3, section « Partagé dans… » → retirer d'un groupe/du Mur en 1 tap.

---

## §6 — JOURNAL & UNIVERS

### Écran J1 — Journal, onglet Liste ✔ (l'Atlas construit)
Timeline par lunes ✔, cartes riches ✔ (halo d'émotion, glyphe du type, badge « rayonne » quand un rêve marque fort, figures + lieu). **Recherche** plein texte ✔ (loupe en haut). **Filtres chips** ✔ : Nuit · Jour · [types]. Tap carte → J3.
En haut à droite : ⚙ → R1 Réglages. Bascule d'onglet : **Liste | Univers** (segmented, gros).
**États** : vide → « Tes rêves apparaîtront ici. » + bouton « Déposer un rêve » → A1 · **Importer** visible dans l'état vide : « Tu as déjà des rêves notés ailleurs ? Importe-les. » → J5.

### Écran J2 — Journal, onglet Univers ✔ (le cœur produit)
**En haut : « En ce moment »** ⚙ — 3 lignes max : « L'eau revient souvent ces dernières semaines (4 rêves) » — tap → J4. C'est l'accroche des 99%.
**Les 7 rayons** ✔ (onglets swipeables construits) : **Symboles · Personnages · Émotions · Lieux · Toi dans tes rêves ⓘ · Thèmes · Corps**. (ⓘ « Toi dans tes rêves » : « Comment tu agis dans tes rêves — tu fuis, tu voles, tu cherches… C'est souvent le plus parlant. »)
- Symboles/Corps : cartes à charge ✔ · Personnages : grille de présences ✔ · le reste : nuages de mots à taille pondérée ✔.
**Filtre temps** (haut droit) : **« 3 derniers mois · Cette année · Tout »** (acté 10/07).
**États** : moins de ~5 dépôts → « Ton univers se dessine à partir de quelques rêves. Encore un ou deux et ça s'allume. » (jamais de dashboard vide qui fait pitié).

### Écran J3 — Fiche rêve/moment ✔⚙ (la fiche complète)
Tout ce qui concerne UN dépôt, en un scroll :
- Titre, date, type. **Le texte intégral.** Lecteur audio d'origine ✔. Photo du carnet si scanné 🆕. Ajouts datés (voix/texte) ⚙.
- **Ta lecture** (si donnée) + **la lecture de Dream** (si demandée) — repliées, tap pour ouvrir.
- **Guides faits** (« Retourner dans le rêve · fait le 12 mai » → rouvre le compte-rendu) · guide en pause → « Reprendre ».
- **Œuvres créées** (vignettes → F3).
- **Partagé dans…** : groupes/Mur + retrait 1 tap.
- **Fils dorés** ✔ : « Rêves reliés » — 2-4 cartes fines → navigation de rêve en rêve (LA magie de relecture).
- Les 4 boutons en bas (Comprendre s'il ne l'est pas encore · Créer · Partager · appui long = Supprimer).

### Écran J4 — Fiche symbole/personnage/lieu… ✔⚙
Modal plein écran ✔ : le mot, depuis quand, combien de rêves, la courbe discrète dans le temps.
- **« Pour toi, c'est quoi ? »** ✔ (champ, modifiable à vie — tes mots d'abord).
- **« Ce que Dream propose »** ⚙ (acté 10/07) : 1-2 phrases d'interprétation, marquées « proposition », nourries de TES rêves + TES lectures + TES notes de jour ; bouton « développer ». Si l'utilisateur a déjà donné SON sens : la proposition Dream s'affiche APRÈS, jamais avant.
- **Ses rêves** : liste → J3.
**ⓘ** : « Dream ne lit pas dans un dictionnaire des rêves. L'eau chez toi ≠ l'eau chez un autre. C'est TON sens qui se construit ici. »

### Écran J5 — Importer ✔🆕
Trois portes : **Scanner des pages** 🆕 (→ A5 en boucle) · **Coller du texte** ✔ (textarea, séparateur entre rêves, aperçu du compte) · **Depuis un fichier** ⚙ (txt/notes export). Chaque import : marqué « importé », enrichi en tâche de fond ✔, arrive dans le Journal au fil de l'eau (« Tes 40 rêves importés s'installent — leurs symboles apparaîtront dans ton Univers d'ici demain. »).

### Écran J6 — Dossiers (jour) ⚙
Dans l'onglet Liste, filtre « Jour » actif → chips de dossiers thématiques (threads ✔ backend). Dream propose (« Ranger ces 4 notes dans un dossier “Travail” ? » — 1 tap oui/non). Renommer/fusionner : appui long. Une note peut vivre dans plusieurs dossiers ✔ spec.

---

## §7 — CRÉER (LA FORGE)

### Écran F1 — Choisir ✔
Depuis « Créer » sur un dépôt : « On en fait quoi ? » → cartes : **Une image · Une histoire courte · Un petit monde à explorer** (+ « bientôt : un film »). Tap → **2-3 propositions de vision** ✔ (texte court : « Version crépuscule, vue du couloir… ») + **coût en crédits AFFICHÉ avant** ✔ + solde visible. « Lancer » → F2. Jamais de génération sans confirmation ✔ (red line).
### Écran F2 — En création ✔
Attente honnête (« ~1 min »), on peut quitter (notif douce à la fin si activée, sinon pastille sur Journal). Échec → recrédit automatique + « Ça a raté, crédits rendus. Réessayer ? » ✔ spec Vague B.
### Écran F3 — L'œuvre ✔
Plein écran. Liée au rêve (lien retour J3). Boutons : **Enregistrer** (photothèque) · **Partager** (P1 : groupes/Mur — l'œuvre au Mur reste anonyme · + partage externe : lien public opt-in ✔ page /oeuvre) · Supprimer.
### Écran F4 — Mes œuvres ✔ (galerie, accès depuis Journal header icône)
Grille. Tap → F3.
### Écran F5 — Crédits & abonnement ✔
Solde, gros. « Comment ça marche » ⓘ : « Créer des images ou des mondes coûte de la vraie puissance de calcul. Les crédits paient ça — rien d'autre. » Recharge · Abonnement (l'abonné a son quota mensuel + les modes rares) · Restaurer achat. AUCUN dark pattern : pas de compte à rebours, pas de « offre qui expire ».

---

## §8 — CADRE : onboarding, connexion, réglages, aide

### O1-O4 — Onboarding (4 écrans max, 4 taps)
1. **« Dream — pour tes rêves. »** Une phrase sous : « Raconte tes rêves. Dream t'aide à les comprendre — et à voir ce qu'ils disent de ta vie. » → « Commencer ».
2. **Les trois promesses** (une phrase chacune, pas plus) : « Tu parles, Dream écrit. · Tes rêves restent à toi — rien ne s'efface, rien ne se partage sans toi. · Plus tu l'utilises, plus il te ressemble. » → « OK ».
3. **Les rendez-vous** (réponse à « comment l'utilisateur sait pourquoi il clique », acté 10/07) : « Dream peut venir à ta rencontre. Choisis — tu pourras changer d'avis dans Réglages. » → 3 cartes CONCRÈTES avec aperçu réel de la notification :
   - **Le matin** — aperçu : « ☾ Bien dormi ? Raconte ton rêve avant qu'il file. » (+ option réveil Dream)
   - **Le soir** — aperçu : « ☀ Une intention pour la nuit ? 30 secondes. »
   - **Jamais** — « Je viens quand je veux. » (sélectionnable, aussi respectable que les autres)
4. **Premier dépôt** : « Tu te souviens d'un rêve ? N'importe lequel. » → cercle de capture direct · « Pas maintenant » → A1. (Option discrète : « J'ai des rêves notés ailleurs » → J5 import.)
**Re-proposition (règle exacte, acté 10/07)** : si « Jamais » ou skip → après le **3e dépôt**, UNE ligne douce in-app (pas une notif) sous l'accueil : « Dream peut te retrouver le matin ou le soir, si tu veux. → Choisir » — refusée = plus jamais affichée (Réglages reste la porte). Au **7e jour**, la carte « Ta première semaine » (voir §9) le re-propose une 2e et DERNIÈRE fois.

### O5 — Connexion ✔
Email + mot de passe ✔ (19/06). Mot de passe oublié → email. Rien d'autre.

### R1 — Réglages ⚙
Sections : **Compte** (email, mdp, déconnexion) · **Rendez-vous** (matin/soir/jamais + heures) · **Réveil** (on/off, heure, sonnerie) · **Le Mur** (mes partages au Mur → les retirer ; rappel : « le Mur est totalement anonyme ») · **Notifications** (par groupe, œuvres prêtes) · **Abonnement & crédits** (→ F5) · **Comment marche Dream** (→ H1) · **Mes données** (exporter tout · supprimer mon compte — double confirmation + délai 7 jours) · Version, mentions.

### H1 — Comment marche Dream (l'index des fiches ⓘ) ⚙
Liste des fiches (~15 à la MVP) : Kaïros · Intuition · Signe · Coïncidence · Frisson · Sieste · Les guides (une fiche chacun = sa carte C4) · Comment Dream interprète · Le Mur et l'anonymat · Les crédits · Tes données.
**Règle d'écriture (acté 10/07 — « approfondir sans complexifier »)** : phrases courtes, mots du quotidien, exemples concrets, zéro poésie floue. Modèle (fiche Intuition, version corrigée) :
> « Une intuition, c'est une idée ou une image qui arrive toute seule. Tu ne l'as pas cherchée : elle est là. Sous la douche, en marchant, en conduisant. Souvent elle apporte une réponse — parfois une question. Les artistes et les scientifiques racontent que leurs meilleures idées arrivent comme ça, quand ils ne forcent pas. Dream te propose juste de les noter : avec le recul, tu verras lesquelles disaient vrai. »
> *D'où ça vient : les rêveurs de toutes les époques ont observé que l'esprit continue de travailler quand on ne le regarde pas. (→ pour les curieux : Bachelard, la rêverie)*

### D1 — Carte détresse ✔ (overlay, rare)
Déclencheur : mots-clés/intensité ✔. Une carte douce PAR-DESSUS (jamais à la place de) : « Ce que tu traverses a l'air lourd. Dream n'est pas un soignant. En parler à quelqu'un, maintenant : [3114 / lignes locales]. » + « Continuer dans Dream ». Jamais moralisateur, jamais bloquant, log interne pour modération Mur.

---

## §9 — NOTIFICATIONS & RENDEZ-VOUS (système complet)

**Loi** : AUCUNE notification qui n'a pas été explicitement choisie, en connaissance de cause (aperçu réel montré au moment du choix). Chaque notification se désactive depuis elle-même (appui long → réglages système ou lien direct R1).
| Notification | Choisie où | Contenu exact | Fréquence max |
|---|---|---|---|
| Matin | O3/R1 | « ☾ Bien dormi ? Raconte ton rêve avant qu'il file. » → A3 voix direct | 1/jour |
| Soir | O3/R1 | « ☀ Une intention pour la nuit ? 30 secondes. » → guide Intention | 1/jour |
| Réveil | O3/R1 | sonnerie + écran A6 | selon alarme |
| Groupe | G7 (défaut ON à la création/jonction, dit clairement) | « Léa a partagé un rêve dans Famille. » | groupée, max 3/jour/groupe |
| Œuvre prête | F2 (proposée à la 1re création) | « Ton image est née. » | par œuvre |
| Mur | JAMAIS. Le Mur ne notifie rien, par principe. | — | 0 |
| « Ta première semaine » | automatique, in-app SEULEMENT (pas push) | carte dans le Journal au 7e jour : ce qui s'est déposé, 1 symbole émergent, re-proposition rendez-vous (2e et dernière) | 1 fois, à vie |
**Interdits à vie** : « Tu n'as pas déposé depuis X jours » · « Ta série va se briser » · « Reviens ! » · toute notification de re-engagement.

---

## §10 — MATRICE D'ÉTATS (résumé de câblage)
Chaque écran × 5 états = défini ci-dessus ou par défaut §0.3. Points de vigilance particuliers :
- **A3 hors-ligne** = LE cas critique (3h du matin, pas de réseau) : capture locale, file d'envoi, ZÉRO perte, testé en priorité.
- **C1 sans réseau** : la lecture utilisateur se garde localement, l'IA vient plus tard.
- **Comptes multiples/déconnexion** : le brouillon local ne fuit jamais vers un autre compte.
- **Suppression d'un dépôt partagé** : le retirer du groupe/Mur AVANT suppression (automatique, dit clairement).
- **Permission micro/caméra/notifs refusée** : chaque écran concerné a sa phrase + chemin alternatif (déjà spécifié par écran).

## §11 — MICRO-ANIMATIONS (registre complet)
§0.6 + : fil doré qui se tisse à l'apparition des « rêves reliés » (819 ms, une fois) · halo d'émotion des cartes Atlas : statique (pas d'animation en liste, perf) · bascule Mur ☾/☀ : la lumière glisse (377 ms) · « Ça me touche » : le cœur s'allume doucement, pas de +1 qui vole · arrivée d'une lecture Dream : le texte s'écrit (streaming naturel) · onboarding : fondu simple, pas de carrousel qui rebondit.

## §12 — CHECKLIST DE CÂBLAGE (anti-lien-mort)
Chaque bouton du doc → sa cible : A1{cercle→A3, 📷→A5, fil→J3, swipe→A2, nav→G1/M1/J1} · A4{Comprendre→C1, Créer→F1, Partager→P1, Garder→A1, ←→A1} · C1{lance→C1, saispas→C1, conte→C1, plusloin→C2, nom→J3} · C2{carte→C3, tous→C4} · C3{pause→J3, fin→J3} · G1{créer→G2, code→G3, groupe→G4} · G4{carte→G5, header→G7, lecture→G6, défi→G-défis} · M1{carte→M2} · P1{groupes→toast, mur→confirmation→toast} · J1{carte→J3, ⚙→R1, onglet→J2, vide-import→J5} · J2{en-ce-moment→J4, rayon→J4} · J3{fils-dorés→J3', œuvres→F3, guides→C3, 4 boutons} · J4{rêves→J3, développer→inline} · F1→F2→F3{partager→P1, retour→J3} · O3→R1 synchro · R1{chaque ligne → son écran} · D1{ressources→appel/liens système, continuer→retour}.
**Test final avant design** : parcourir ce graphe — chaque nœud atteignable depuis A1 en ≤3 taps pour les actions cœur (déposer, comprendre, partager), ≤4 pour tout le reste. Aucun nœud orphelin. (Pass 3 le vérifiera ligne à ligne.)

---

## §12bis — AMENDEMENTS VALIDÉS TIM 2026-07-11 (soir) — la page rêve idéale & la résonance partout

**A. Fiche rêve (J3) — remplacement des sections « fils dorés »/« rêve ancien » par « CE QUI RÉSONNE » (mêlé)** : UNE section, 3 registres mélangés — rêves reliés + **moments/notes de jour reliés** + l'écho ancien s'il existe. Chaque lien porte : (1) **sa raison en une ligne** (« l'eau · la maison », « même émotion », « 3 jours avant ») — le moteur 16 types la connaît, on l'affiche ; (2) **le 1-clic « résonne / pas vraiment »** qui nourrit l'apprentissage (poids bridge confirmé). L'écho prophétique ouvre une **vue côte à côte** + même 1-clic.
**B. « À la lumière du présent »** (validé « important ! ») : sur tout rêve ancien → bouton « Relire avec ce que je vis maintenant » ; sur toute note de jour → « Que disent mes rêves de ça ? » (moteur resonate câblé). Cap 3/jour. L'app peut aussi PROPOSER d'elle-même quand un écho fort s'allume (carte douce à l'accueil, jamais une push non choisie).
**C. Guides liés** : un guide fait sur un rêve/moment s'enregistre ET s'affiche sur SA fiche (« Guides faits → rouvrir »). Guide sans dépôt → crée une note de jour porteuse.
**D. Multi-rêves par nuit (design à valider Tim)** : un rêve = une entité ; la nuit = un regroupement. Capture : bouton discret « rêve suivant » pendant l'enregistrement (marqueur, sans arrêter) · à l'écrit « autre rêve »/« --- » · ET détection IA des frontières à la transcription → l'écran de vérification devient « Ta nuit » : « J'entends 3 rêves — je les sépare ? » → cartes empilées éditables, chacune part séparément (4 destins chacune), badge commun « la nuit du 11 juillet », OU « garder ensemble » 1-clic.
**E. Warnings (validé)** : axe `warning_signal` à l'extraction + carte de soin « ce rêve insiste sur quelque chose qui demande ton attention — à toi de sentir où ». Jamais prédictif-alarmiste, cap ~1/sem, jamais santé grave sans ressources, souveraineté toujours.
**F. Multilingue** : FR/EN — toggle Réglages > Langue, défaut = langue du téléphone. (Chantier i18n dédié.)
**G. Import masse** : fichiers multiples (txt/md/audio) d'un coup, découpe + transcription en file de fond (l'Import Hub historique remonte).
**H. Partage des œuvres Forge** vers groupes/Mur via la même ShareSheet.
**I. Réglages unifiés** : l'icône compte (👤) de l'accueil pointe vers l'écran Réglages complet (fin du vieux panneau mot-de-passe-seul).

## §12ter — BRAINDUMP TIM JUILLET (via Hermès, absorbé 2026-07-22) — backlog qualifié

Source : `claude-context/DREAM-VISION-BRAINDUMP-2026-07.md` (entrées 13-21/07). Qualification :

**A. Déjà construit (marathon 10-11/07) — vérifier que Tim les a vus** : édition post-enregistrement (texte éditable + ajouts, A4/J3) · nouvelle conversation sur un vieux rêve « à la lumière d'aujourd'hui » (§12bis.B, LIVE) · réagir à l'interprétation/corriger (C1bis conversationnel) · dive deep = les 10 Guides + « Aller plus loin ».
**B. Bugs/quick fixes** : 🐛 2e jet d'interprétation coupé (limite max_tokens du mode conversation → augmenter + continuer-la-lecture) · transcription : vérifier la file offline réelle.
**C. OFFLINE-FIRST OBLIGATOIRE (« ABSOLUMENT » Tim)** : capture audio+texte 100% locale en mode avion → file d'attente → sync au retour réseau. Était spec'é §0.3/§10 ; devient chantier prioritaire avec test avion systématique.
**D. AUDIO PERSISTANT + EXPORT** : sauver l'audio du rêve (gap connu) · partager/exporter l'audio OU le texte OU rêve+interprétation attachés (extension ShareSheet + share sheet système) · correction transcription AUTO (l'IA repère les passages sans sens → passe Q/R → validation) — nouveau chantier IA.
**E. IMPORT HUB+ (dès l'onboarding)** : import audio du téléphone (mémos vocaux) + textes · **prompts prêts à copier-coller par thèmes** pour aspirer depuis les autres IA (challenges, doutes, messages du cœur…) — « Dream = hub, pas silo ».
**F. ALARME NATIVE STYLÉE** : sons nature free + vibrations, fiabilité absolue (Capacitor local-notifications déjà embarqué dans les binaires — reste sons + UX).
**G. CRÉDITS ÉTENDUS TRANSPARENTS** : beaucoup de gratuit ; deep dives et conversations étendues = coût en crédits affiché et compris (cohérent Bible §9.6).
**I. MÉDITATIONS GUIDÉES & YOGA NIDRA (backlog validé Tim 22/07, « bientôt »)** : guides AUDIO — sieste consciente, pré-sommeil, exploration de l'hypnagogie, yoga nidra. Famille naturelle : extension des Guides (C3/C4, catégorie « Guides audio ») + synergie alarme native (sons nature) + chip Sieste. Modèle : audio français enregistrés ou TTS haute qualité, offline-cachés, gratuits en majorité (cohérent G).
**H. 🔴 STRUCTUREL — LA MATRICE PERSO & LES 2 ÉCRANS (à trancher Tim avant câblage)** : Tim redéfinit la home : **Écran 1 « L'Orbe »** = TOUT le perçu (rêves + kaïros + signes + frissons — « ce que la vie nous chante »), types de dépôt sélectionnables sur l'orbe OU demandés après ; **Écran 2 « Le Cœur »** = la voix du cœur, section à part entière AMPLIFIÉE (dépôt libre de la vérité du moment → chat avec Dream : soutenir/amplifier/challenger/inspirer, choix multiple OU libre → partager cercle/mur/garder). Matrice : Inconscient (rêves+kaïros) / Cœur (vérité consciente). ⚠️ Diffère du miroir nuit/jour actuel (kaïros vivent côté jour aujourd'hui) — bascule = refonte des 2 accueils. Converge avec Bible §3.1 (substrat) — à amender Bible après GO. **Vision liée : « ciel de prières »** (les chants gardés/partagés remontent quand on a besoin — apprendre à se soutenir soi-même) = V-next, germe du Mur solaire.

## §14 — LA LOI D'ÉPURE (Tim, 2026-07-22 : « se rapprocher À FOND de la maquette ») — au-dessus de tout le visuel

Constat : le re-skin a réglé la couleur, pas la densité. La maquette CD (pages 2-3, étalon PIXEL) a ~7 éléments par écran ; la réalité en a 12+. Règles DURES, vérifiées écran par écran AU RENDU :

1. **Budget d'éléments par écran** : 1 méta discrète (date OU salutation, jamais les deux) · 1 foyer (lune/braise) · 1 mot · 1 micro-ligne d'usage · 1 geste principal (LE FOYER EST LE BOUTON — pas de gros CTA redondant sous l'orbe) · ≤2 liens secondaires · fil ≤2 items · nav. **TOUT LE RESTE DÉGAGE.**
2. **Bannis de l'accueil** : carrousel de suggestions/chips · indicateur lune-soleil décoratif · >2 icônes header (📷 reste, 👤 reste ; 🔔 → Réglages) · double sous-titre · CTA « Maintenir pour raconter » en pilule géante (le geste vit sur l'orbe : « maintiens · ou écris » dessous, comme la maquette).
3. **Étalon** : les 5 frames « NUIT ULTRA SIMPLE » (CD pages 2-3) = vérité STRUCTURELLE exacte (inventaire d'éléments 1:1), pas une inspiration.
4. **Chips kaïros** : PAS sur l'accueil (épure). Le type se choisit APRÈS le dépôt (« c'était… ») — convergence exacte braindump §12ter.H (« si on ne sélectionne pas → l'app demande après »).
5. **Boucle de vérification** : après chaque passe → screenshot du rendu réel côte à côte avec la frame CD → si un élément n'est pas dans la frame, il se justifie ou il meurt (test de retrait). Verdict final = Tim sur device.
6. S'applique à TOUS les écrans (fiche, comprendre, groupe, mur, journal) — les frames CD existantes d'abord, puis passe Claude Design « page 4 : les écrans manquants » (Journal/Univers · Cœur braise · Réglages · Forge) briefée avec CETTE loi, validée Tim, puis codée.

## §13 — JOURNAL DES PASSES
- **Pass 1 (2026-07-10)** : rédaction complète v1 — 34 écrans/états, 10 guides nommés moldus, système ⓘ 2 étages, rendez-vous + re-proposition, felt-shift 3 boutons avec neutre, matrice d'états, checklist câblage.
- **Pass 2 (2026-07-10, faite)** — ré-audit simplicité, corrections appliquées :
  - « dépôts partagés » (banking) → libellé écran **« Rêves & moments partagés »** (le mot « dépôt » reste réservé à la spec, jamais à l'écran).
  - **Alias du Mur supprimé** : anonymat TOTAL (« Quelqu'un · cette nuit »), pas de persona récurrent — plus simple, plus sûr, moins de réglages.
  - Vérifié : aucun mot banni résiduel dans les libellés écran ; « kaïros » n'apparaît que dans les bulles ⓘ/fiches ; une idée par écran tenue partout (A4 est l'écran le plus chargé : texte + 4 boutons — assumé, c'est le carrefour).
- **Pass 3 (2026-07-10, faite)** — croisement avec le code réel (`src/app/api`, 150+ routes scannées) :
  - **Découvertes ✔** (moins de travail que prévu) : lecture de groupe = `circles/[id]/restitutions` + `intentions` + `resonances` existent · réactions de groupe ✔ · partage vers cercle ✔ (`kairos/[id]/circle-share`) · moteur générique des guides ✔ (`protocoles/sonnet-step`) · échos/prophétique ✔ (`echoes`, `kairos/[id]/prophetic`) · dossiers de jour ✔ (`journal/sections`, `journal/categorize`) · import ✔ (`mvp/import`, `dreams/import-batch`) · dictionnaire personnel ✔ (`personal-dictionary` + `mvp/meaning`) · contes ✔ (`tales/match`).
  - **À créer ⚙** (le vrai périmètre restant) : routes du Mur (`wall/*` — feed, post, touch, report, k-anonymity) · scan carnet (route vision OCR) · chat membre-à-membre des groupes (le `chat/converse` existant = conversation avec l'IA, pas entre humains — vérifié) · UI des 8 guides restants sur le moteur existant · sheet Partager unifiée · écrans Mur · réglages R1 complets · onboarding O3 rendez-vous.
  - **Graphe §12 déroulé** : zéro nœud orphelin ; actions cœur ≤3 taps confirmé (déposer = 1, comprendre = 2, partager = 2 depuis A4 ; 3 depuis Journal).
- **Statut : v1 complète (3 passes faites). `partial` → prêt pour validation Tim, puis absorption 2_DESIGN §14 + briefs design/câblage.**
