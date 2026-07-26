# 2_CERCLE_DESIGN.md — L'EXPÉRIENCE

> **Sous-app Cercle de Dream App** — Pattern language + spec UX
> Date : 2026-04-28 · Auteur : Yeshua
> Hérite : `2_DESIGN.md` racine (28 patterns + 12 règles génératives + matter system + Q.W.A.N. test). Ce doc **étend**, ne remplace pas.

---

## §1 — Pattern Language Cercle (17 patterns dédiés)

> Méthode Christopher Alexander : nom · contexte · problème invariant · cœur de solution. **17 patterns Cercle qui s'ajoutent aux 28 patterns racines** (cf. 2_DESIGN.md §3).

### §1.1 — CIRCLE_HUMAN_FACILITATED (R7-aligned)

- **Contexte** : couche Cercle V2 (facilité par praticien vetted).
- **Problème invariant** : si l'IA "facilite" un cercle, on a un Discord enrobé. La transmission initiatique (Somé *water of spirit*) ne peut pas être déléguée à une IA.
- **Cœur de solution** : Therefore — cercles facilités par **humains formés** (V2). L'app **trouve** facilitateurs (annuaire vetted), **organise** logistique, **récolte** rêves anonymisés post-cercle. **L'app ne facilite pas elle-même.**
- **Source Forêt** : Brown *Holding Change* (anti-celebrity facilitation), Aizenstat (4 voix tendues par humain), Somé (initiation = elders incarnés).

### §1.2 — CIRCLE_HORIZONTAL

- **Contexte** : tout cercle V1+.
- **Problème invariant** : créateurs de cercle qui deviennent gourous, owner mode qui crée hiérarchie cachée, conflits d'autorité.
- **Cœur de solution** : Therefore — créateur du cercle = membre standard. Pas de UI différenciée. Pas de "circle owner mode". Pas de role escalation. Pas de transfer of ownership. Cercle horizontal absolu structurellement encodé.
- **Anti-pattern** : Slack workspace owner, Discord server admin, Geneva creator role.
- **Source Forêt** : Brown *Holding Change* (boundaries are love), Junger *Tribe* (avoid charismatic-leader cult), Vogl (transparency on power).

### §1.3 — OPT_IN_GRANULAIRE_KAIROS_X_CERCLE

- **Contexte** : à chaque kairos déposé, à chaque cercle.
- **Problème invariant** : un user veut partager un kairos avec son cercle Famille mais pas avec son cercle Pro. Toggle binaire = perd le contexte. Tag = hier un kairos était privé, demain partagé, friction.
- **Cœur de solution** : Therefore — 3 modes EXPLICITEMENT séparés par kairos × cercle :
  1. **privé** (default, ne participe à aucune agrégation cercle)
  2. **opt-in_anon** (anonymisé dans agrégation cercle, contribue aux patterns mais l'IA ne révèle JAMAIS qui)
  3. **partagé_explicite** (rêve devient lisible aux membres en cleartext — action séparée et distincte)
- Réversible à tout moment. UI : 3 boutons distincts, jamais 1 toggle.
- **Anti-pattern** : Discord channel-level visibility, Slack thread visibility, Geneva room sharing.

### §1.4 — PSEUDO_GREEK_LETTER_DEFAULT

- **Contexte** : tout cercle privacy-first.
- **Problème invariant** : un user qui veut un cercle profond mais ne veut pas exposer son identité même au cercle (parents-enfants, traversée intime, lignée chamanique).
- **Cœur de solution** : Therefore — pseudos lettres grecques (α β γ δ ε ζ η θ ι κ λ μ — 12 max alignés sur cercle 12 max) attribués déterministiquement par user_id × circle_id (stable mais jamais nominatif). Default. Username global activable cercle par cercle. Pseudo cercle activable.
- **Pourquoi grec** : neutralité culturelle (vs prénoms qui exposent genre/origine), identifiable individuellement par membre (vs "membre 1" générique), beauté typographique.
- **Source Forêt** : Bohm (langage non-fragmentaire), Brown (boundaries are love).

### §1.5 — K_ANONYMITY_INTRA_CERCLE

- **Contexte** : toute agrégation IA pour le cercle (constellation, restitution polyphonique).
- **Problème invariant** : avec 4 membres dans un cercle, "1 membre a rêvé d'X" = identification triviale. Anonymat default sans seuil = faux anonymat.
- **Cœur de solution** : Therefore — k-anonymity intra-cercle ≥ 3 (≥ 5 pour Praticiens lignée). Si k < seuil sur un élément (figure, motif, charge), l'IA agrège par catégorie symbolique générique (*"figure de l'ancienne"*) plutôt que mention individualisée. **Si k = 0 dans une dimension demandée, l'IA dit explicitement "rien à dire ici cette lune"** plutôt que halluciner.
- **Source Forêt** : Bohm (don't fragment what is whole = don't pseudo-anonymize), Yunkaporta (relational subjectivity, no objective expert).

### §1.6 — RESTITUTION_LUNAIRE_ON_DEMAND

- **Contexte** : CTA principal du cercle.
- **Problème invariant** : push automatique = extraction attention. Pas de restitution = cercle stagne.
- **Cœur de solution** : Therefore — lecture polyphonique sur demande explicite par n'importe quel membre + nudge lunaire optionnel (1×/lune douce, *"le cercle n'a pas reçu de restitution depuis 3 lunes"*). Background EF `generate-circle-restitution`. Pas de polling visible. Notif silencieuse à tous les membres quand prête.
- **Anti-pattern** : Slack auto-summary daily, Discord weekly digest pushed, Geneva activity report.
- **Source Forêt** : Brown (slow is necessary), Vogl (rituals are intentional, not automatic).

### §1.7 — REACTIONS_3_VERBES_SILENCIEUSES

- **Contexte** : sur chaque restitution polyphonique + sur chaque kairos partagé_explicite cleartext.
- **Problème invariant** : likes hiérarchisent voix, emoji-reactions deviennent gamification, comments-fil deviennent Slack.
- **Cœur de solution** : Therefore — 3 verbes simples et ontologiquement plats :
  - **résonne** (j'ai senti quelque chose)
  - **unfamiliar** (je ne connais pas ce territoire mais je tiens)
  - **question** (j'ai une question, pas un jugement)
- Réactions silencieuses (compteur invisible à l'auteur, alimentent la mémoire du cercle pour l'IA, jamais affichées comme social proof).
- **Anti-pattern** : like/heart, emoji-reactions, vote up/down.

### §1.8 — CHAT_CONTEXTUEL_PAS_LIBRE (à valider Tim)

- **Contexte** : zone de témoignage post-restitution + post-partage cleartext.
- **Problème invariant** : 0 chat = froid. Chat libre = Slack-shaped.
- **Cœur de solution** : Therefore — **chat contextuel** ancré à un objet rituel (lecture polyphonique ou kairos cleartext). 1 commentaire textuel court par membre par objet (pas thread, pas reply, pas @mentions, pas typing indicators, pas read receipts). Latence rituelle 24h opt-in. Position fallback : 0 chat V1, contextuel V2.

### §1.9 — INVITATION_MAGIQUE

- **Contexte** : lien partagé externe vers un cercle.
- **Problème invariant** : "join my Slack workspace" = friction OAuth + branding. Lien crypto = froid. Image preview marketing = anti-INFUSE.
- **Cœur de solution** : Therefore — lien partageable `https://dream-alpha-bice.vercel.app/v12/index.html#rejoindre?code=DEMO` avec **OG meta minimal poétique** (pas image, juste 1 ligne *"Quelqu'un t'invite à tenir un cercle de rêves"*) + code court 4-6 chars uppercase. Si destinataire pas inscrit Dream App, redirige vers signup avec code en QS ; auto-rejoint après création compte.
- **Source Forêt** : Vogl (rite of welcome, first threshold crossing).

### §1.10 — CERCLE_EPHEMERE_21J

- **Contexte** : template 7 V1.
- **Problème invariant** : engagement open-ended = cercles fantômes. Engagement long terme = pression. Engagement 7j trop court (pas de cycle), 30j trop long (épuisement).
- **Cœur de solution** : Therefore — cercle éphémère 21 jours (cycle initiatique mythologique Vasalisa Estés, 3 semaines = 1 traversée d'épreuve, sub-cycle lunaire). Auto-archive jour 21 + rituel de clôture (lecture polyphonique finale + restitution synthétisée). User peut rouvrir ou créer continuation.
- **Source Forêt** : Estés (cycles initiatiques Vasalisa Bluebeard descente Hécate), Moss (incubation rituelle).

### §1.11 — RITUEL_CLOTURE_DOUX

- **Contexte** : fin de cercle éphémère 21j + soft-leave dernier membre.
- **Problème invariant** : death silencieuse = traumatique. Notification "votre cercle est fermé" = froide. Bouton "fermer le cercle" rouge = violent.
- **Cœur de solution** : Therefore — rituel de clôture 3 étapes :
  1. **Veille (J-1)** : in-app marker doux *"le cercle s'archive demain"*. Pas de modal, pas de push. Juste présence.
  2. **Jour J** : lecture polyphonique finale (200-500 mots) automatiquement générée + restitution synthétique 21 jours.
  3. **Au-delà de J+1** : cercle passe en `archived`, reste consultable (lectures historiques accessibles), pas de nouveau dépôt possible. Membres conservent leurs kairos perso.

### §1.12 — RESEAU_DOUX_PAR_SYMBOLES (V2-V3)

- **Contexte** : V2 — découverte sociale opt-in très restreinte.
- **Problème invariant** : recommandation algo de cercle = dopamine engagement. Découverte par humain seul = friction. Comment proposer doucement la connexion sans devenir Discord ?
- **Cœur de solution** : Therefore — V2 : un user peut opt-in à l'écran "résonances symboliques" — l'IA propose **3 fois max par lune** des cercles dont la signature symbolique a un fort overlap avec son journal de vie individuel (k ≥ 5 sur les figures partagées). Présentation contemplative : 1 carte par cercle, intention déclarée + 3 figures symboliques en commun, **pas de bouton "rejoindre"** — juste *"si tu veux écrire à ce cercle, voici comment"* + email du tendeur ou form INFUSE-vetted. Découverte = humain au final.
- **Anti-pattern** : "trending circles", "tu pourrais aimer", recommendation feed.

### §1.13 — TENSIONS_DETECTION_SYMBOLIQUE_NEUTRE

- **Contexte** : IA cercle détecte 2 figures opposées récurrentes + charge affective haute + multiples membres impactés.
- **Problème invariant** : désigner un coupable = trahison de l'horizontalité. Ignorer = tension qui pourrit. Modérer comme un Slack admin = remplacer humain.
- **Cœur de solution** : Therefore — l'IA peut **suggérer doucement** d'explorer la tension symbolique :
  - *"Une tension symbolique se tisse dans le cercle ces dernières lunes. Voulez-vous lire ce qu'elle dit ?"* — accepte/refuse explicite.
  - Si accepte : présentation des 2 figures opposées (anonymisées strict, jamais "untel a rêvé X et untel Y", toujours *"deux figures se tiennent en miroir cette lune"*), highlighter motifs de réconciliation si présents.
  - Si tension forte persistante (multiples lunes) : EXIT_TO_HUMAN proposé doucement vers facilitateur INFUSE-vetted V2. Pont jamais coupé.
  - **Jamais désigne de coupable.** Jamais "X est en conflit avec Y".
- **Source Forêt** : Brown *Holding Change* (principled struggle), Coyle/Zimmerman (Council Process), Aizenstat (eidola autonomes — figures parlent par elles-mêmes).

### §1.14 — LAYER_TERMES_INTERDITS_CONFIGURABLE

- **Contexte** : cercles Praticiens lignée chamanique, traversée trauma-aware spécifique, sensibilités culturelles.
- **Problème invariant** : voix Forêt mobilisée par défaut peut introduire termes non-désirés (ex: cercle Praticiens Huni Kuin ne veut pas "ondinnonk" Iroquois).
- **Cœur de solution** : Therefore — table `circle_forbidden_terms` (configurable par tendeur ou décision collective), liste de termes/concepts/voix Forêt que l'IA ne mobilisera **jamais** dans ce cercle. Enforcement au niveau system prompt EF `generate-circle-restitution`.
- **Source Forêt** : Yunkaporta (Smith Test), Moss (sacred names protected).

### §1.15 — CONSTELLATION_CERCLE_K_ANONYMISEE

- **Contexte** : visualisation force-directed du cercle, sub-page accessible via tap section dédiée.
- **Problème invariant** : Portrait constellation individuel = légitime (mes propres figures). Constellation cercle = exposition collective sensible.
- **Cœur de solution** : Therefore — constellation cercle force-directed sur l'agrégat des kairos opt-in. Anonymisée stricte (k ≥ 3). Agrégation par catégorie symbolique : pas "figure d'une vieille femme inconnue" mais "figure de l'ancienne". Omission des détails biographiques. **Différent de Portrait constellation V0** — la constellation cercle reste pertinente car intrinsèquement collective et anonymisée, instrument et pas décor.
- **Source Forêt** : Bohm (interpenetrating orders, not fixed objects).

### §1.16 — TRAUMA_AWARE_TEMPLATE_FLAGS

- **Contexte** : templates Traversée trauma-aware (deuil, post-rupture, séparation, maladie, etc.).
- **Problème invariant** : cercle deuil traité comme cercle famille = catastrophe. Modulation manuelle = friction et oublis.
- **Cœur de solution** : Therefore — flags DB sur le cercle (`trauma_aware_flag`, `trauma_subtype`) qui modulent automatiquement :
  - System prompt IA : ton encore plus doux, jamais didactique, jamais "guérison/fermeture", voix Forêt restreintes (Frankl, Estés, Hillman, Aizenstat — pas Brown, pas Eisenstein, pas concepts new age).
  - GRIEF_DOOR pattern (cf. racine 2_DESIGN §6.5) à l'entrée du cercle.
  - EXIT_TO_HUMAN proposé proactivement à charge somatique haute détectée.
  - Ressources externes (numéros vert pays user, associations spécialisées) accessibles 1 tap depuis tout écran cercle.
  - Lecture polyphonique 1×/lune **pas plus** (pas de surcharge).
- **Source Forêt** : Frankl, Estés, Hillman, Aizenstat. Anti-source : new age positivity, manifestation marketing.

### §1.17 — ANTI_GAMIFICATION_STRUCTURELLE

- **Contexte** : meta-pattern, applicable à toute UI cercle.
- **Problème invariant** : mécaniques Octalysis subtiles glissent dans tout produit communautaire (badges discrets, streaks discrets, leaderboards internes).
- **Cœur de solution** : Therefore — checklist enforcement à tout merge cercle :
  - [ ] Pas de points/XP/levels
  - [ ] Pas de badges (même "discrets")
  - [ ] Pas de leaderboards (même "internes au cercle")
  - [ ] Pas de streaks
  - [ ] Pas d'achievement notifications
  - [ ] Pas de progress bars sauf wizard contemplatif
  - [ ] Pas de collection complete
  - [ ] Pas de scarcity FOMO
- **Test** : *"si on retirait cette mécanique, le sens partagé du cercle disparaîtrait-il ?"* (cf. 1_BIBLE §6.4).
- **Source Forêt** : Carse (infinite games), Brown (satisfiability), Eyal (banni — anti-source).

---

## §2 — Spec détaillée des 9 onglets cercle (V1)

> **Position** : Cercle est sous-app dédiée accessible depuis menu principal Dream App. Naviguée par `BottomTabs` interne au cercle (9 onglets ne sont pas tous Bottom Tab — voir architecture §2.0).

### §2.0 — Architecture navigation

**Écran d'arrivée Cercle** (`/cercle/[id]`) : header + onglet par défaut "Vue" (synthèse).

**4 onglets BottomTab visibles** (mobile) :
1. **Vue** (home cercle, default)
2. **Restitutions** (lectures polyphoniques)
3. **Tisser** (CTA pour partager / opt-in)
4. **Membres**

**5 onglets latéraux accessibles via menu hamburger ou tabs étendus desktop** :
5. **Intentions** (intentions du cercle)
6. **Synchronicités** (paires kairotiques inter-membres)
7. **Météo cercle** (ce qui souffle dans le cercle, équivalent §3.6.2 racine appliqué cercle)
8. **Annales** (rêves "tenus" du cercle, équivalent §7.7 racine appliqué cercle)
9. **Rituels** (proposés / actifs / archivés)

> Si Tim trouve 9 onglets trop riches V1, fallback : V1 = Vue + Restitutions + Tisser + Membres + Annales (5 onglets), reste reporté V2.

### §2.1 — Onglet "Vue" (default)

**Patterns dominants** : CIRCLE_HORIZONTAL + RESTITUTION_LUNAIRE_ON_DEMAND + ANTI_GAMIFICATION_STRUCTURELLE.

**Composition** :
- Header : nom du cercle + intention (si intentionnel) + count membres discret (*"5 membres"*).
- **Section "Dernière restitution"** :
  - Si existe : extrait poétique 80 mots + tap pour ouvrir restitution complète. Voix mobilisées en transparence.
  - Si jamais : invite douce *"Le cercle n'a pas encore reçu de lecture. Voulez-vous demander une restitution ?"* avec bouton *"demander une restitution"*.
- **Section "Constellation cercle"** (preview) : aperçu visuel low-fidelity de la constellation (k-anonymisée), tap → fullscreen.
- **Section "Ce qui souffle"** : 3-5 mots-glyphes silencieux résumant la lune. Exemples : *"eau · seuil · ancienne"*. Pas plus.
- **Section "Mes opt-in pour ce cercle"** : status synthétique (*"3 kairos opt-in_anon, 1 partagé cleartext"*) avec tap vers gestion granulaire kairos par kairos.
- **Quitter le cercle** : tout en bas, sobre, modal de confirmation poétique (cf. racine 2_DESIGN §7.7.bis.a).

**Anti-patterns** : pas de timeline d'activité, pas de "untel a rejoint", pas de "untel a déposé", pas de feed.

### §2.2 — Onglet "Restitutions"

**Patterns dominants** : RESTITUTION_LUNAIRE_ON_DEMAND + POLYPHONIE_ONTOLOGIQUEMENT_HONNETE + USER_MEANING_LAYER (niveau cercle) + REACTIONS_3_VERBES_SILENCIEUSES + CHAT_CONTEXTUEL_PAS_LIBRE.

**Composition** :
- **Liste des restitutions** par lune décroissante. Chacune = card avec :
  - Date lunaire (*"Lune de Mars 2026"*).
  - Première phrase de la restitution comme tease.
  - Voix mobilisées (badges discrets : Aizenstat / Moss / Brown).
  - Status reactions : "5 résonances · 1 question" (compteur agrégé visible POUR le cercle, pas pour l'auteur d'un kairos individuel — c'est la restitution qui est l'objet).
- **Tap restitution** → fullscreen :
  - Texte complet 200-500 mots, EB Garamond italic, respiration typographique.
  - 3 boutons réactions silencieuses (résonne / unfamiliar / question). Tap = soft toggle sans confirmation visible.
  - Section "témoignages" (CHAT_CONTEXTUEL) : 1 dépôt textuel court par membre, max ~280 chars, EB Garamond italic. Latence rituelle 24h opt-in (toggle).
  - Footer : "voix mobilisées cette lune" liste avec mini-fiches au tap.
- **Bouton "demander une nouvelle restitution"** en haut si pas de restitution depuis 14j+ ou sur tap user.
- **Loading state** : *"La lecture est en train de se tisser. Vous serez prévenu·e quand elle sera prête."* — pas de spinner.

### §2.3 — Onglet "Tisser" (CTA central)

**Patterns dominants** : OPT_IN_GRANULAIRE_KAIROS_X_CERCLE + RITE_OF_ENTRY_NEW_PLACE.

**Composition** :
- **Section "Tes kairos récents"** (derniers 14 jours) :
  - Liste des kairos individuels du user (depuis Journal de Vie main).
  - Pour chaque kairos × ce cercle : 3 boutons explicitement séparés (privé / opt-in_anon / partagé_explicite). Status courant en surbrillance.
  - Tap "partagé_explicite" → modal : *"Avant de partager ce kairos en clair dans le cercle, l'IA en propose une version anonymisée (sans noms propres ni géolocalisation). Tu valides ligne par ligne avant publication."* → écran validation antichambre IA → confirmation.
- **Section "Annoncer un meaning du cercle"** (V2 — V1 backlog) :
  - *"Dans notre cercle, le pont = transition"* — annoncer une convention symbolique cercle. Décision collective via thread minimal (chacun valide ou propose alt). Stocké dans `circle_meaning_layer`.
- **Section "Inviter quelqu'un"** :
  - Bouton "copier le lien" + "partager" (native share).
  - Code court visible large.
  - **Limite 12 membres** : si atteint, message *"Le cercle est complet. Pour un cercle de plus de 12, le tissage devient autre chose. Crée un nouveau cercle ou fais évoluer celui-ci en cercle facilité (V2)."*

### §2.4 — Onglet "Membres"

**Patterns dominants** : PSEUDO_GREEK_LETTER_DEFAULT + CIRCLE_HORIZONTAL.

**Composition** :
- Liste des membres avec **pseudo (lettre grecque ou username choisi cercle-par-cercle)** + date d'arrivée silencieuse + status (*"présent·e"* / *"silence depuis 30j+"*) discret.
- **Pas de bio**, **pas de photo** (sauf opt-in user "afficher ma photo dans ce cercle"), **pas de status texte**.
- **Pas de "online now"**, pas de presence indicator.
- **Tap membre** → écran minimal : pseudo, date d'arrivée, **rien d'autre**. Pas de "rêves de ce membre", pas de "kairos partagés par ce membre" (anti-extraction inter-membres).
- En bas : si admin tendeur (V2), pas de bouton "kick member" — au contraire, conseil texte : *"Si la tension est trop forte, propose une lecture cercle qui l'explore, ou contacte un facilitateur INFUSE-vetted."* Pas de modération admin solo.

### §2.5 — Onglet "Intentions"

**Patterns dominants** : USER_MEANING_LAYER (niveau cercle).

**Composition** :
- **Intention principale** du cercle (textarea EB Garamond italic, éditable par décision collective — V1 = éditable par le créateur, V2 = thread minimal de validation collective).
- **Sub_intentions** (jusqu'à 3, ajout/retrait possible).
- **Historique des intentions** (les versions précédentes, archivées avec date).
- **Pour cercles spontanés** : section vide, juste *"Ce cercle n'a pas d'intention déclarée. C'est un cercle spontané — un lien."* Pas pression d'en déclarer.
- Pour cercles éphémères 21j : timer doux *"Il reste 14 jours dans ce cercle"* en haut. Pas FOMO.

### §2.6 — Onglet "Synchronicités"

**Patterns dominants** : ECHO_REVELATION_RITUAL (niveau cercle) + RITUAL_LATENCY.

**Composition** :
- **Paires kairotiques inter-membres** détectées par l'IA cercle (cf. 16 types pattern echoing racine §3.5.2, type 10 : paire kairotique inner/outer < 72h).
- Présentation anonymisée stricte. Exemple : *"Cette lune, deux membres du cercle ont rêvé de la même figure (l'enfant qui marche dans la forêt) à 48h d'écart, sans s'être parlé. L'image revient."*
- **Pas de "untel et untel"**. Pas de matching privé entre 2 membres (anti-Tinder de la psyché).
- **Latence rituelle 14j minimum** avant affichage.
- Tap → expansion poétique ; pas de bouton "matcher" / "se contacter" — synchronicité reste mystère, pas connection feature.

### §2.7 — Onglet "Météo cercle"

**Patterns dominants** : ANIMA_MUNDI_AS_FIELD (échelle cercle) + POLYPHONIE_ONTOLOGIQUEMENT_HONNETE.

**Composition** : application de la chambre 2 d'Anima Mundi (cf. racine §7.8 chambre 2) à l'échelle cercle.
- Phrase principale poétique (1-2 lignes, IA cercle Sonnet sur agrégat 14-28 derniers jours).
- Glyphe / matter principal (eau / pierre / brume / feu / vent / racine).
- 3-5 brefs nuages thématiques.
- Tournures qui montent (motifs amplifiés sur 28j vs 84j antérieurs).
- **Couvre kairos + journal de vie collectif** indistinctement (cohérent racine §7.8).
- Recalcul lunaire (28j cycle), latence rituelle 14j minimum.

### §2.8 — Onglet "Annales"

**Patterns dominants** : INFINITE_ARCHIVE + USER_MEANING_LAYER (niveau cercle) + ANTI_GAMIFICATION + PRIVACY_AS_CARE + LET_THE_DREAM_LIVE.

**Composition** : application de la chambre 3 d'Anima Mundi (cf. racine §7.8 chambre 3) à l'échelle cercle.
- **Pivot lexical** : "tenir" pas "élire" (Brown).
- **Mécanique du don d'un kairos aux annales du cercle** (5 étapes simplifiées vs Anima Mundi) :
  1. Latence rituelle minimum 7j avant offre.
  2. Au sein du Détail kairos individuel, après 7j, offre douce *"Tu peux offrir ce kairos aux annales du cercle X. Il pourrait y être tenu par d'autres."*
  3. Antichambre IA : Sonnet anonymise (sauf si user choisit attribution pseudo).
  4. En circulation 28j (prolongé +28j si signal lent), state `circulating`. Ordre **rotatif aléatoire**.
  5. Geste "tenir" silencieux. Seuil dynamique = `MAX(2, ROUND(0.30 × members_count))` — soit ~30% des membres pour entrer dans les annales du cercle (proportionnel, pas absolu comme Anima Mundi).
- **Compteur invisible à l'auteur** : juste "tenu" / "entré dans les annales".
- **Anti-popularity contest** : pas de classement, pas d'éditorial, pas de recommandation, ordre rotatif imposé.

### §2.9 — Onglet "Rituels"

**Patterns dominants** : RITUEL_CLOTURE_DOUX + CIRCLE_HUMAN_FACILITATED (V2).

**Composition** :
- **Section "Rituels actifs"** :
  - Si cercle éphémère 21j : timer + jour courant.
  - Si rituel saisonnier suggéré (V2, équinoxes/solstices) : carte avec invitation *"Le solstice approche. Veux-tu que le cercle reçoive une lecture saisonnière ?"*. Opt-in cercle (vote silencieux interne ou tendeur — V1 = créateur).
- **Section "Rituels proposés"** (V2) :
  - Lightning Dreamwork groupe (Moss).
  - Council Process (Coyle/Zimmerman).
  - 4 voix Aizenstat.
  - Senoi morning circle.
  - Clic = description du protocole + voix Forêt mobilisable + bouton "proposer au cercle".
- **Section "Rituels archivés"** : historique des rituels passés du cercle avec restitutions associées.

---

## §3 — Onboarding création cercle (3 écrans rituels)

> Hérite §7.7.bis.b racine — wizard 3 steps. Ce sous-doc **étend** avec rituel symbolique de seuil.

### §3.1 — Pré-Step — Choix du template

> **Nouveau V1** : avant d'arriver au wizard 3 steps existant, on présente les 7 templates pré-configurés.

**Composition** :
- Header sobre : *"Quel cercle veux-tu tisser ?"*
- 7 cards visuelles (3×3 sur tablette/desktop, scroll vertical sur mobile) :
  1. **Famille** (icône glyphe maison-feu)
  2. **Amis proches** (icône glyphe deux mains)
  3. **Projet intentionnel** (icône glyphe étoile à 3 branches)
  4. **Traversée commune** (icône glyphe vague qui passe une porte) — **drapeau "trauma-aware"** discret
  5. **Lucid Dreamers** (icône glyphe œil ouvert dans le sommeil)
  6. **Praticiens** (icône glyphe arbre à racines profondes)
  7. **21 jours** (icône glyphe lune + clepsydre)
- 8e option : **"Cercle libre — sans template"** (tout reste éditable, défauts génériques).

Tap card → présentation détail template (intention type, sub_intentions exemples, défauts opt-in, voix Forêt mobilisées, ton IA) + bouton *"démarrer ce cercle"*.

### §3.2 — Step 1 — Nom + type

Inchangé vs racine §7.7.bis.b.a.
- Nom du cercle (input EB Garamond italic 18px, placeholder *"Comment veux-tu appeler ce cercle ?"*) — pré-rempli selon template.
- Type côte à côte (Spontané / Intentionnel) — pré-sélectionné selon template.

### §3.3 — Step 2 — Intention

Inchangé vs racine §7.7.bis.b.b. + pré-rempli selon template.

### §3.4 — Step 3 — Confirmation + invite_code

Inchangé vs racine §7.7.bis.b.c. + ajout :
- **Pré-loader IA cercle** : *"L'IA cercle initialise les voix Forêt qui seront mobilisables pour ce template (Aizenstat, Moss, Brown...). Tu pourras toujours configurer les voix exclues plus tard."* — silencieux background.
- Bouton "voir mon cercle" → CercleDetail.

### §3.5 — Step 4 (NOUVEAU V1) — Premier dépôt rituel doux

> Inspiration : Vogl *Art of Community* (rite of welcome, first threshold crossing) + Moss (gatekeeper invocation).

Après création, écran intermédiaire :
- *"Ce cercle vient d'être tissé. Veux-tu y déposer une première intention silencieuse, un premier mot ?"*
- Textarea **optionnel** (skip possible).
- Si textarea rempli : devient le premier objet du cercle, anonymisé pseudo, visible aux futurs membres.
- **Pas obligatoire**. Skip = direct vers CercleDetail.

---

## §4 — Templates de cercles pré-configurés (détails complets)

### §4.1 — Famille (Spontané pré-configuré)

```yaml
template_id: family
display_name: Famille
description: Le cercle des nuits partagées de la maisonnée.
icon: glyph_house_fire
type_default: spontane
intention_default: ""
sub_intentions_examples:
  - "se parler par les rêves"
  - "prendre soin du sommeil de chacun·e"
  - "tenir ce qu'on traverse ensemble"
optin_default_per_kairos: prive
ai_tone: tres_douce_jamais_didactique
forest_voices_allowed:
  - aizenstat
  - estes
  - kimmerer
  - bachelard
  - hyde
forest_voices_excluded:
  - junger  # militaire métaphorique inadapté
  - eyal  # banni global
trauma_aware: false
ephemeral_days: null
max_members: 12
visibility: invite_only
notes: |
  Pour parents-enfants, V1 = pas de mineur direct. Mineur partage via parent.
  V2 = mode famille avec consentement parental encadré.
```

### §4.2 — Amis proches (Spontané pré-configuré)

```yaml
template_id: friends
display_name: Amis proches
description: Notre cercle de feu.
icon: glyph_two_hands
type_default: spontane
intention_default: ""
sub_intentions_examples:
  - "rester en lien malgré la distance"
  - "se voir rêver"
  - "continuer la conversation des âmes"
optin_default_per_kairos: prive_avec_optin_anon_kairos_numineux
ai_tone: chaleureuse_intime
forest_voices_allowed:
  - aizenstat
  - moss_active_dreaming
  - brown
  - eisenstein
  - bachelard
  - hyde
trauma_aware: false
ephemeral_days: null
max_members: 12
```

### §4.3 — Projet intentionnel

```yaml
template_id: project
display_name: Projet intentionnel
description: Le cercle qui tient quelque chose ensemble.
icon: glyph_star_3_branches
type_default: intentionnel
intention_default: "Tenir notre [vision/mission/projet] claire pendant la traversée."
sub_intentions_examples:
  - "sentir ce qui doit être lâché"
  - "écouter ce que le terrain nous dit"
  - "prendre soin de la fatigue collective"
optin_default_per_kairos: optin_anon
ai_tone: claire_strategique_jamais_corporate
forest_voices_allowed:
  - brown_emergent_strategy
  - brown_holding_change
  - scharmer_theory_u
  - wheatley
  - bohm_dialogue
  - eisenstein
  - vogl
forest_voices_excluded:
  - eyal
  - octalysis_ref
trauma_aware: false
ephemeral_days: null
max_members: 12
exit_to_human_threshold: 2_lunes_tension_persistante
```

### §4.4 — Traversée commune (TRAUMA_AWARE)

```yaml
template_id: traversee
display_name: Traversée commune
description: Quand on traverse quelque chose qui demande à ne pas être seul·e.
icon: glyph_wave_through_door
type_default: intentionnel
trauma_aware: true
trauma_subtypes:
  - deuil
  - parentalite_post_partum
  - grossesse
  - separation
  - maladie_chronique
  - transition_carriere
  - transition_genre
  - post_rupture
  - conversion_spirituelle
intention_default: "Traverser cette [traversée] ensemble, sans être seul·e."
sub_intentions_examples:
  - "tenir ensemble"
  - "sentir qu'on n'est pas seul·e"
  - "ne pas exiger de fermeture"
optin_default_per_kairos: optin_anon
ai_tone: encore_plus_douce_jamais_guerison_jamais_fermeture
forest_voices_allowed_by_subtype:
  deuil: [frankl, estes_descente_hecate, hillman, aizenstat]
  parentalite: [estes_les_meres, kimmerer, aizenstat]
  separation: [hillman, brown_holding_change, frankl]
  default: [frankl, hillman, aizenstat]
forest_voices_excluded:
  - new_age_positivity
  - manifestation_marketing
  - eyal
exit_to_human_proactive: true
external_resources: numeros_vert_par_pays + associations_specialisees
restitution_max_per_lune: 1
ephemeral_days: null  # mais soft-suggestion 90j renouvelable
max_members: 8  # plus restreint que défaut
notes: |
  Cercle deuil V1 = création limitée à invitation directe ou via thérapeute INFUSE-vetted V2.
  Pas d'invite ouverte spam.
```

### §4.5 — Lucid Dreamers

```yaml
template_id: lucid_dreamers
display_name: Lucid Dreamers
description: Le cercle des rêveurs lucides.
icon: glyph_open_eye_in_sleep
type_default: intentionnel
intention_default: "Cultiver la pratique lucide ensemble."
sub_intentions_examples:
  - "partager les techniques"
  - "se reconnaître dans les rêves partagés"
  - "explorer la lucidité comme pratique"
optin_default_per_kairos: optin_anon
ai_tone: precise_technique_respectueuse_jamais_spiritual_bypass
forest_voices_allowed:
  - moss_active_dreaming
  - moss_dreamgates
  - aizenstat
  - bulkeley_big_dreams
  - cambray  # synchronicité
forest_voices_excluded:
  - new_age_lucid_marketing
  - eyal
trauma_aware: false
ephemeral_days: null
max_members: 12
linked_subapp: lucid_subapp_dream_main
```

### §4.6 — Praticiens chamaniques

```yaml
template_id: practitioners_lineage
display_name: Praticiens / Lignée
description: Cercle de pratique pair-à-pair, pour praticien·nes formé·es.
icon: glyph_tree_deep_roots
type_default: intentionnel
intention_default: "Tenir notre pratique entre nous, dans le respect des lignées."
sub_intentions_examples:
  - "affiner notre écoute"
  - "se tenir entre nous"
  - "honorer les lignées qui nous traversent"
optin_default_per_kairos: optin_anon_strict
ai_tone: sobre_respectueuse_voix_foret_restreintes
forest_voices_allowed_default:
  - bachelard
  - hillman
  - bohm
  - aizenstat
forest_voices_restricted:  # nécessitent permission cercle
  - moss_dreamways_iroquois
  - kimmerer
  - yunkaporta
  - any_indigenous_named_tradition
forest_voices_excluded:
  - eyal
  - new_age_extraction
trauma_aware: false  # mais layer_termes_interdits actif
pseudo_greek_letter_forced: true  # pas username override
k_anonymity_threshold: 5  # plus strict que défaut 3
forbidden_terms_default:
  - ondinnonk
  - ayyu
  - shamanic
  - any_sacred_tradition_term
ephemeral_days: null
max_members: 12
metadata_geographique_partagee: false
notes: |
  V1 launch validation Vari Vena (Noke Koi) ou équivalent.
  Si validation pas obtenue, ce template reporté V2.
  Cercle PEUT débloquer voix indigènes via thread minimal de validation collective.
```

### §4.7 — Cercle éphémère 21 jours

```yaml
template_id: ephemeral_21
display_name: 21 jours
description: Trois semaines pour traverser quelque chose ensemble.
icon: glyph_moon_clepsydre
type_default: intentionnel
intention_default: "Trois semaines pour [traverser X]."
sub_intentions_examples:
  - "se préparer ensemble à l'événement"
  - "traverser cet examen / cette transition"
  - "21 jours d'écoute partagée"
optin_default_per_kairos: optin_anon
ai_tone: rythme_intentionnel_traversee_initiatique
forest_voices_allowed:
  - estes_cycles_initiatiques
  - moss_growing_big_dreams
  - brown_holding_change
  - frankl
ephemeral_days: 21
auto_archive_at_end: true
ritual_de_cloture: true
ritual_de_cloture_format: lecture_polyphonique_finale_plus_restitution_synthetique_21j
max_members: 12
notes: |
  Limite: 1 cercle éphémère 21j créable par 90j en tier gratuit.
  Illimité tier payant.
```

---

## §5 — Invitations magiques (lien partageable)

### §5.1 — Format URL

```
https://dream-alpha-bice.vercel.app/v12/index.html#rejoindre?code=DEMO
```

- Code : 4-6 chars uppercase, généré côté EF `create-circle`, garanti unique.
- Stocké dans `circles.invite_code`.
- Réutilisable jusqu'à expiration (V1 = pas d'expiration ; V2 = optionnelle 7j/30j configurable).

### §5.2 — OG meta tags (preview link sharing)

```html
<meta property="og:title" content="Dream App · Cercle">
<meta property="og:description" content="Quelqu'un t'invite à tenir un cercle de rêves.">
<meta property="og:image" content="">  <!-- intentionnellement vide ou glyphe minimaliste -->
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
```

**Pas d'image marketing.** Texte sobre. Anti-marketing : on ne "vend" pas le cercle au lien preview.

### §5.3 — Flux destinataire

1. **Tap lien** :
   - Si user authentifié + déjà membre cercle → redirect direct CercleDetail.
   - Si user authentifié + pas membre → écran *"Tu es invité·e à rejoindre [nom du cercle]. [Intention si déclarée]. Veux-tu rejoindre ?"* + bouton "rejoindre" → POST /api/circles/[id]/join → CercleDetail.
   - Si user pas authentifié → écran signup avec code en localStorage → après signup, auto-rejoindre cercle.
2. **Première arrivée dans le cercle** : Step 4 onboarding §3.5 réplique côté joiner — *"Tu viens d'arriver dans ce cercle. Veux-tu y déposer une première intention silencieuse ?"* — optionnel.

### §5.4 — Anti-pattern lien

- Pas de "rejoignez 1000+ rêveurs" social proof.
- Pas de FOMO ("plus que 2 places").
- Pas de tracking pixel.
- Pas de UTM source attribution agressive.

---

## §6 — Cercles éphémères 21 jours (UX flow complet)

### §6.1 — Création

Choix template "21 jours" → wizard pré-rempli `ephemeral_days = 21`. Pas de configuration de durée alt en V1 (forçage rituel — Estés, Vasalisa).

### §6.2 — Vie du cercle (jour 1 → jour 20)

- Onglet "Rituels" affiche timer doux *"Jour 5 sur 21"*.
- Restitution polyphonique automatique proposée (pas push) au jour 7 et jour 14 (mid-traversée).
- IA ton : rythme initiatique — au jour 7 voix possible mobilisée Estés (descente), au jour 14 voix possible mobilisée Brown (holding the dynamic field), au jour 21 voix possible mobilisée Frankl (sens dans la traversée).

### §6.3 — Veille jour 20 (J-1)

- Marker doux in-app sur l'écran Vue : *"Le cercle s'archive demain. Une lecture finale sera tissée."*
- Pas de modal, pas de push (sauf opt-in user).

### §6.4 — Jour 21 — Rituel de clôture

- Background EF `generate-circle-final-restitution` automatiquement déclenchée.
- Restitution finale 200-500 mots + restitution synthétique 21 jours (résumé contemplatif).
- Voix Forêt mobilisables : Estés (cycle complet), Frankl (sens), Aizenstat (tending what passed).
- État cercle passe à `archived`.

### §6.5 — Au-delà de J+1

- Cercle reste consultable (lectures historiques accessibles).
- **Aucun nouveau dépôt possible**.
- **Aucun nouveau membre admis**.
- Bouton *"Continuer cette traversée dans un nouveau cercle ?"* (option) — crée un nouveau cercle 21j avec mêmes membres et intention héritée, état neuf.

### §6.6 — Anti-pattern

- Pas de "ressuscitation" du cercle archivé après J+30.
- Pas de "rappel : votre cercle approche de la fin" en push.
- Pas de "extend by 7 more days" pay-to-extend.

---

## §7 — Réseau social DOUX (V2-V3)

> V1 = pas de réseau inter-cercles. V2 = patron RESEAU_DOUX_PAR_SYMBOLES (cf. §1.12). V3 = enrichissements.

### §7.1 — V2 — Résonances symboliques opt-in

- User opt-in à l'écran "résonances symboliques" (default OFF).
- IA propose 3 fois max par lune des cercles dont la signature symbolique a un fort overlap.
- Présentation contemplative : 1 carte par cercle, intention déclarée + 3 figures symboliques en commun, **pas de bouton "rejoindre"**, juste *"si tu veux écrire à ce cercle, voici comment"* + email du tendeur ou form INFUSE-vetted.
- Découverte = humain au final.

### §7.2 — V3 — Cercles cross-traditions (uniquement avec validation conseils respectifs)

- Cercles tibétain dream yoga + Sufi + Senoi + Lakota — pas avant validation conseils respectifs et contrepartie financière.
- Pas en V2.

---

## §8 — Co-écriture kairos collectif (V3)

> Vision long-terme : un kairos écrit à plusieurs en temps réel asynchrone.

- 1 kairos collectif par cercle (max 1 actif à la fois).
- Chaque membre peut ajouter 1 paragraphe par 24h. Latence rituelle.
- Asynchrone strict : pas de Google Docs collaboratif live.
- Texte final = polyphonie réelle, pas synthèse IA.
- Stocké dans `kairos_collective`.
- V3+. Pas en V1/V2.

---

## §9 — Rituels saisonniers automatiques (V2)

### §9.1 — Calendrier

- 4 équinoxes/solstices : 20 mars, 21 juin, 22 sept, 21 déc.
- 4 cross-quarters : Imbolc 1 fév, Beltane 1 mai, Lugnasadh 1 août, Samhain 1 nov.
- Total 8 portes saisonnières par an.

### §9.2 — Trigger

- Background scheduler EF `seasonal-ritual-trigger` détecte porte saisonnière dans 7 jours.
- Pour chaque cercle actif : insertion d'une carte douce dans onglet "Rituels" : *"Le solstice approche. Veux-tu que le cercle reçoive une lecture saisonnière ?"*
- Opt-in cercle (V1 = créateur, V2 = vote silencieux interne).
- Si opt-in : EF `generate-seasonal-ritual` génère lecture polyphonique 500-1000 mots à la date pile, voix Forêt saison-aware (printemps = Brown emergence, été = Eisenstein interbeing, automne = Estés descente, hiver = Frankl sens).

### §9.3 — Anti-pattern

- Pas de push notif "C'est l'équinoxe ! Ouvre Dream App !".
- Pas de FOMO calendaire.

---

## §10 — Cercles parents-enfants (V2 encadré)

### §10.1 — Pré-conditions V2

- Validation conseil pédopsychiatrique avant launch.
- Validation legal counsel COPPA/RGPD mineur.
- Pas avant V2.

### §10.2 — Mode famille mineur

- Profil mineur "lite" (compte créé par parent, pas autonome).
- Mineur partage **uniquement à son parent** (cercle 1-1 parent-enfant).
- Pas de cercle multi-parents-multi-enfants V2 (V3+ avec garde-fous additionnels).
- Garde-fous trauma forts : signaux de parentification, abus, négligence détectables → exit-to-human pédopsychiatre INFUSE-vetted.

### §10.3 — Anti-pattern

- Pas de "monitoring parental" surveillance des rêves de l'enfant.
- L'enfant peut retirer son opt-in parent à tout moment (à partir d'un âge à arbitrer, probablement 10+).

---

## §11 — Anti-patterns absolus (à bloquer en code review)

> Liste exhaustive — checklist pour tout PR cercle.

- [ ] Pas de Slack/Discord chat-fil-thread libre comme couche centrale.
- [ ] Pas de likes / heart / emoji-reactions.
- [ ] Pas de leaderboard.
- [ ] Pas de "circle owner mode" UI différenciée.
- [ ] Pas de transfer of ownership.
- [ ] Pas de role escalation interne au cercle (V1).
- [ ] Pas de membre élevé / co-fondateur / privilégié.
- [ ] Pas de typing indicators.
- [ ] Pas de read receipts.
- [ ] Pas de @mentions.
- [ ] Pas de threading multi-niveaux.
- [ ] Pas de notif push commentaire (sauf opt-in user explicite).
- [ ] Pas de notif push "untel a déposé" (sauf opt-in user explicite).
- [ ] Pas d'unread count agressif (pastille rouge).
- [ ] Pas de presence indicator ("online now").
- [ ] Pas de "kick member" admin solo.
- [ ] Pas de moderation queue admin.
- [ ] Pas de "trending circles" / "popular this week".
- [ ] Pas de search engine cercles publics.
- [ ] Pas de découverte algo recommandation cercle.
- [ ] Pas de "tu pourrais aimer ce cercle" feed.
- [ ] Pas de partage hors-app d'un kairos d'un autre membre.
- [ ] Pas de capture d'écran "facilitée".
- [ ] Pas de embed widget public.
- [ ] Pas de "share to Twitter/Instagram".
- [ ] Pas de "un ami viendra si tu shares" game mechanic.
- [ ] Pas de tier paid pour accéder à plus de features cercle.
- [ ] Pas de sponsored cercles / influencer / brand cercles.
- [ ] Pas de IA ventriloquie d'une figure du rêve.
- [ ] Pas de voix sacrées non-créditées.
- [ ] Pas de "ondinnonk" / "ayyu" / "shamanic" en interface (sauf cercle praticiens validé).
- [ ] Pas de mention nominative dans rêve partagé (auto-anonymisation).
- [ ] Pas de cercle public V1.
- [ ] Pas de progress bar gamifiée.
- [ ] Pas de streaks.
- [ ] Pas de XP/levels/badges.
- [ ] Pas de achievement notifications.
- [ ] Pas de FOMO ("offre limitée", "il reste 2 places").
- [ ] Pas de fine-tuning IA cercle sur engagement metric.
- [ ] Pas de scoring émotionnel individuel.
- [ ] Pas de profil comportemental membre.
- [ ] Pas de reporting facilitateur sur dynamiques internes.

---

## §12 — Q.W.A.N. test pour Cercle V1

> Quality Without A Name (Christopher Alexander).

Un user qui ouvre Cercle pour la première fois — sans onboarding, sans explication — doit ressentir 4 choses dans l'ordre, en moins de 10 secondes :

1. **Quelque chose de vivant existe ici, qui n'existe pas ailleurs.** (Différenciation immédiate vs Slack/Discord/Geneva.)
2. **Je peux entrer doucement, sans m'exposer.** (Pseudo grec default + opt-in granulaire évidents.)
3. **Le cercle ne me demande rien tout de suite.** (Pas de prompt "présente-toi", pas de quiz, pas d'invite agressive.)
4. **Je sens que ce qui sera tissé ici sera respecté.** (Voix mobilisées en transparence + privacy radicale visible.)

Si ces 4 sensations ne se posent pas, l'écran est raté. Refonder.

---

## §13 — Voix de la sous-app (UX copy)

> Hérite glossaire 1_BIBLE §14. Tone calibré : sobre, EB Garamond, jamais wellness, jamais corporate.

### §13.1 — Microcopy approuvée

- Création cercle CTA : *"Tisser un cercle"* (jamais "Créer un groupe").
- Rejoindre CTA : *"Rejoindre le cercle"* (jamais "Join").
- Quitter : *"Quitter ce cercle"* + modal poétique sobre.
- Restitution CTA : *"Demander une lecture du cercle"* (jamais "Generate report").
- Loading : *"La lecture est en train de se tisser. Vous serez prévenu·e quand elle sera prête."*
- Empty state cercle vide : *"Le cercle vient d'être tissé. Il attend ses voix."*
- Code complet : *"Le cercle a atteint sa capacité (12 membres). Demande au tendeur d'en ouvrir un autre."*
- Code invalide : *"Ce code ne correspond à aucun cercle. Vérifie-le, ou demande à la personne qui t'a invité·e."*
- Auto-archive : *"Ce cercle s'est archivé. Il reste consultable, et ses lectures aussi."*
- Réactions : *"résonne"* / *"unfamiliar"* / *"question"* (3 verbes).
- Opt-in 3 modes : *"privé"* / *"opt-in anonyme"* / *"partagé en clair"*.
- Pseudo grec : juste la lettre. Pas "Member α" ou "User α". Juste **α**.

### §13.2 — Microcopy bannie

- "Group", "channel", "thread", "feed", "stream", "post" — vocabulaire Slack/Discord.
- "Join", "leave", "kick", "ban", "moderate" — vocabulaire admin.
- "Trending", "popular", "viral", "engagement" — vocabulaire growth.
- "Connect", "match", "discover" — vocabulaire dating/social.
- "Achievement", "level up", "unlock", "badge" — vocabulaire gamification.
- "Wellness journey", "healing path", "transformation" — vocabulaire wellness.
- "Insights", "analytics", "metrics" — vocabulaire dashboard.

---

## §14 — Roadmap UX (synthèse)

| Version | Templates | Onglets | Chat | Marketplace | Découverte |
|---|---|---|---|---|---|
| **V1** | 7 (incl. Praticiens si validation Vari Vena) | 4-9 (configurable) | Contextuel ou 0 (à valider Tim) | Non | Invite-only |
| **V2** | 7 + cercles thématiques + B2B + parents-enfants encadré | 9 complet + Rituels | Contextuel | Oui (vetted) | Annuaire opt-in restreint + Résonances symboliques opt-in |
| **V3** | + co-écriture + cercles cross-tradition validés | + co-écriture | + Council Process asynchrone | + Restorative Circles | + cercles régionaux Anima Mundi |
| **V4-V5** | + écosystème Iroquois Caucus si invitation | — | — | + école active dreaming distribuée | + adaptations ontologies oniriques régionales |

---

**Fin de 2_CERCLE_DESIGN.md**
