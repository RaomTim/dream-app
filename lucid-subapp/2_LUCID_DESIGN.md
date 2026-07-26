# 2_LUCID_DESIGN — Sub-app Lucid Dreaming, l'Expérience

> **Doc canonique** de l'expérience de la sub-app Lucid Dreaming.
> **Date** : 2026-04-28, Bali.
> **Auteur** : Yeshua, recherche épistémique (Forêt + connaissances Claude + étude marché).
> **Subordination** : sub-canonique sous `dream-alpha-app/2_DESIGN.md`. Hérite tous les patterns primitifs Dream App globaux. Si conflit avec patterns globaux, doc global prime.
> **Promesse** : si un designer ouvre ce doc, il doit savoir comment câbler la chambre Lucid sans dériver vers Awoken ou Lucidity.

---

## §0 — Position du document

Ce doc dit comment l'**expérience** de la sub-app Lucid se cristallise dans des écrans, des flows, du vocabulaire, des micro-interactions. Il s'inscrit dans la grammaire Pattern Language déjà posée dans `2_DESIGN.md` global. Il ajoute **10-15 patterns primitifs spécifiques au lucid** et 1 nouveau flow ritualisé.

Lecture :
- §1 — Posture racine de la sub-app (héritée 2_DESIGN §1, précisée pour lucid)
- §2 — Patterns primitifs Lucid (10-15 nouveaux, complètent les ~46 globaux)
- §3 — Onboarding Lucid 3 écrans rituels FR
- §4 — Architecture nav : 5 onglets sub-app
- §5 — Détail des 5 onglets (Profil / Reality Checks / Dream Signs / WBTB / Statistiques)
- §6 — Vocabulaire FR ritualisé + glossaire tap-long
- §7 — Animations, palette, matter system
- §8 — Anti-patterns spécifiques Lucid (à rejeter)
- §9 — Bridges vers Dream App principale
- §10 — Cercle Lucid (V2 — placeholder)
- §11 — Flows ritualisés Lucid

---

## §1 — Posture racine

### §1.1 — Hérité de 2_DESIGN §1

P-Zéro (profonde simplicité) prime. P-Inversion (instrument oraculaire pas oracle) prime. JOUR/NUIT inversion s'applique : la chambre Lucid vit en **NUIT** (matter `silk-gold` prédominant pour le moment lucide, `ash-deep` pour le sommeil, `night-floor` pour le fond). Pas de palette JOUR ici — la pratique lucide est nocturne par nature.

### §1.2 — Posture spécifique Lucid : "présence éveillée DANS le rêve"

Cohérent §2.2 du 1_LUCID_BIBLE. Tous les écrans, toutes les copies, toutes les invitations honorent cette posture. Si une copie suggère "tu peux faire ce que tu veux" en lucide, refuser. Si une copie suggère "explore, observe, dialogue", OK.

### §1.3 — Sub-app activable, pas onglet permanent

La chambre Lucid n'est **pas** dans la nav principale par défaut (cohérent §1.6 1_BIBLE rêve = porte d'entrée). Elle se découvre :
- Via Explorer hub ("◐ Mode Lucid — pour pratiquer le rêve lucide")
- Via prompt automatique après détection 3+ markers lucid en 30j
- Via opt-in onboarding global ("pratiques-tu déjà le rêve lucide ?")

Une fois activée, elle peut apparaître comme **5e onglet de la nav principale** (toggle dans paramètres user — ou rester en accès via Explorer si user préfère).

### §1.4 — Discoverable depth

Comme partout dans Dream App, profondeur invisible jusqu'à ce qu'elle apparaisse. La sub-app Lucid expose 3 voies en écran d'accueil :
- **Présence éveillée** (default INFUSE)
- **Pratique technique** (LaBerge sourcé)
- **Voies contemplatives** (pointe externe, pas de pratique interne)

Aucune "vous avez débloqué le niveau 2 oneironaute". Aucun screen "voici toutes nos features".

---

## §2 — Patterns primitifs Lucid (15 nouveaux)

Format strict (Alexander) : **Nom** · Contexte · Problème invariant · Cœur de solution · Connectés · Confidence (`**` forte, `*` probable).

### §2.1 LUCID_PRESENCE_NOT_CONTROL `**`
- **Contexte** : tout, partout dans la chambre Lucid.
- **Problème invariant** : les apps lucid mainstream (Awoken, Lucidity) traitent la lucidité comme un terrain de jeu où le rêveur "fait ce qu'il veut". Cela atrophie l'oeil oraculaire (P-Inversion), encourage le bypass spirituel, alimente le narcissisme onirique.
- **Cœur de solution** : Therefore — chaque écran, chaque copie, chaque suggestion **honore la présence éveillée plutôt que le pilotage**. Verbes mis en avant : observer, reconnaître, demander, dialoguer, tendre. Verbes évités : contrôler, piloter, faire apparaître, faire disparaître, vaincre.
- **Patterns connectés** : P-INVERSION (global), LUCID_THREE_PATHS, ANTI_GAMIFICATION_LUCID.
- **Propriétés Alexander** : Strong Centers (rêveur), Not-Separateness, The Void, Roughness.

### §2.2 LUCID_THREE_PATHS `**`
- **Contexte** : écran d'accueil chambre Lucid après onboarding.
- **Problème invariant** : présenter une seule voie (LaBerge MILD/WBTB) discrimine les rêveurs contemplatifs (persona Yann). Présenter "tout faire en même temps" noie les débutants (persona Léa).
- **Cœur de solution** : Therefore — 3 voies sobrement présentées sur l'accueil chambre Lucid, le user choisit son entrée :
  1. **Présence éveillée** (default INFUSE) — Tholey-Moss laïcisé
  2. **Pratique technique** (induction MILD/WBTB/SSILD)
  3. **Voies contemplatives** (lien externe Ligmincha, pas pratique interne)
- **Patterns connectés** : LUCID_PRESENCE_NOT_CONTROL, EXTERNAL_LINEAGE_POINTER.
- **Propriétés** : Levels of Scale, Gradients, Boundaries, Echoes.

### §2.3 LUCID_TYPE_TAG_EMERGENT `**`
- **Contexte** : capture d'un kairos rêve nocturne (sub-flow Quick).
- **Problème invariant** : forcer un user à pré-déclarer "ce rêve est lucide" avant capture interrompt le flux du kairos (Moss "kairos forelock"). Forcer après chaque rêve "était-ce lucide ?" est anxiogène.
- **Cœur de solution** : Therefore — détection NLP côté serveur (post-extraction Sonnet) de markers lucid ("j'ai su que je rêvais", "j'ai pris conscience", "RC dans le rêve", "j'étais lucide"). Si détecté, proposer discrètement post-capture : *"As-tu reconnu le rêve cette nuit ?"* avec 3 options : *Oui* / *Pas sûr* / *Non*. Tap *Oui* → tag `is_lucid=true` + propose détail méthode/dreamsign. Tap *Pas sûr* / *Non* → silence respectueux, kairos reste rêve standard.
- **Patterns connectés** : KAIROS_DEPOSIT (global), KAIROS_TYPE_EMERGENT (global), RITUAL_LATENCY.
- **Propriétés** : Strong Centers, Simplicity & Inner Calm, Boundaries.

### §2.4 REALITY_CHECK_CONTEXTUAL `**`
- **Contexte** : utilisation des reality checks dans la pratique éveillée.
- **Problème invariant** : Awoken propose RC "every 4h" — uniforme, brutal, déconnecté du contexte. Soit il devient ignoré (notif spam), soit il devient OCD (compulsif).
- **Cœur de solution** : Therefore — RC suggérés dans des **moments contextuels** définis par le user lors de l'onboarding RC : matin (au réveil de la nuit), pause déjeuner, transitions (sortir du métro, passer une porte), pré-sommeil. Max 5/jour suggérés. Le user choisit ses moments. Pattern adaptable au temps de l'année (heure d'été/hiver). Vibration courte douce, badge in-app, jamais push notification stressant.
- **Patterns connectés** : ANTI_OCD_PLAFOND, JOUR_NUIT_INVERSION (global).
- **Propriétés** : Levels of Scale, Boundaries, Roughness.

### §2.5 DREAMSIGN_PERSONAL_NOT_GENERIC `**`
- **Contexte** : tracker dreamsigns dans la chambre Lucid.
- **Problème invariant** : Awoken/Lucidity proposent des dreamsigns génériques ("tes mains avec 6 doigts", "lire un texte qui change") qui ne correspondent pas aux signes propres au user. Le user copie une liste, ne reconnaît rien, abandonne.
- **Cœur de solution** : Therefore — les dreamsigns sont **émergents du journal lucid du user**. L'IA détecte (post-Sonnet extraction) les éléments anomaux récurrents dans les rêves du user (pas seulement lucides — TOUS rêves). Ex : *"3 fois ce mois tu rêves d'une horloge dont les chiffres ne tiennent pas en place"*. Suggestion douce : *"veux-tu marquer 'horloge déformée' comme un dreamsign personnel ?"*. User confirme/refuse. Liste de 10 dreamsigns persistants max V1, extensible V2.
- **Patterns connectés** : USER_MEANING_LAYER (global §3.7 1_BIBLE), KAIROS_TYPE_EMERGENT (global).
- **Propriétés** : Strong Centers, Echoes, Roughness, Levels of Scale.

### §2.6 MILD_INTENTION_RITUAL `*`
- **Contexte** : pré-sommeil, user veut pratiquer MILD.
- **Problème invariant** : Awoken/Lucidity présentent MILD comme un mantra à répéter mécaniquement. LaBerge lui-même note (Tier 1) que MILD demande **prospective memory** intense + visualisation d'un rêve récent. Un mantra plat sans visualisation ne marche pas.
- **Cœur de solution** : Therefore — protocole MILD INFUSE en 4 temps doux (~3-5 min) :
  1. **Choisir un rêve récent** (de la liste journal lucid). Liste affichée si 3+ rêves récents disponibles.
  2. **Visualiser le moment** où tu serais devenu lucide dans ce rêve. Audio voix contemplative douce qui guide (~30s, optionnel).
  3. **Composer ton intention** en libre — texte court ou voix. *"La prochaine fois que je rêverai, je reconnaîtrai que je rêve."* est suggéré comme template, le user adapte.
  4. **Silence rituel** ~60s — fond `night-floor`, glyphe lune. Pas de bouton "j'ai fini" — le silence se prolonge jusqu'à la fermeture de l'app par le user (ou auto-close 90s).
- **Patterns connectés** : RITUAL_LATENCY, SILENCE_AS_FEATURE (global).
- **Propriétés** : Strong Centers, The Void, Boundaries, Good Shape.

### §2.7 WBTB_SMART_ALARM `*`
- **Contexte** : user veut pratiquer WBTB (réveil intentionnel ~5h après endormissement).
- **Problème invariant** : alarmes WBTB classiques (Awoken) sont toutes les nuits, agressives, fragmentent chronique le sommeil → iatrogène.
- **Cœur de solution** : Therefore — WBTB INFUSE :
  - User configure : heure de coucher habituelle + heures cible WBTB (ex : ~5h après endormissement, fenêtre 4h-6h).
  - Plafond strict V1 : **max 1 fois par nuit, max 4 fois par semaine** (calendrier lunaire-style — pas tous les soirs). Le user ne peut pas désactiver le plafond.
  - L'alarme est **douce** : son personnalisé (cloche, pluie, gong tibétain laïc — le user choisit, max 30s), pas agressive comme une alarme de réveil. Vibration accompagne.
  - Post-alarme : écran s'ouvre directement sur l'**intention pré-WBTB** que le user a préparée la veille au coucher — pas de scroll, pas de notif spam.
  - User peut snooze/désactiver pour la nuit en 1 tap. Pas de "vous avez raté votre WBTB" guilt-trip.
- **Patterns connectés** : ANTI_OCD_PLAFOND, JOUR_NUIT_INVERSION (global), MILD_INTENTION_RITUAL.
- **Propriétés** : Boundaries, Good Shape, Simplicity, Roughness.

### §2.8 ANTI_OCD_PLAFOND `**`
- **Contexte** : tout système de répétition (RC, WBTB) qui peut déclencher OCD.
- **Problème invariant** : sans plafond, les techniques d'induction lucid renforcent les patterns OCD chez profils vulnérables.
- **Cœur de solution** : Therefore — plafonds invisibles mais stricts :
  - **Reality Checks** : suggestion max 5/jour. Au-delà, le système n'envoie plus de rappel.
  - **WBTB** : 1 nuit / 4 par semaine max. Configurable plus bas, pas plus haut.
  - **MILD** : pas de plafond (rituel pré-sommeil bénin) mais detection — si user ouvre MILD ritual 7 nuits/7 pendant 4 semaines + augmente l'angoisse perçue, propose pause douce.
- **Patterns connectés** : SILENCE_AS_FEATURE (global), TRAUMA_SAFE_SUBSTRAT (global).
- **Propriétés** : Boundaries, Levels of Scale.

### §2.9 LUCIDITY_INDEX_INVISIBLE `*`
- **Contexte** : l'app a besoin de stats internes (pour ajuster suggestions, débogage), mais l'user ne doit JAMAIS voir une "métrique de réussite".
- **Problème invariant** : afficher "tu as eu X lucides ce mois", "ton lucidity index est de 0.34" → gamification. Cohérent §8.2 1_BIBLE anti-gamification stricte.
- **Cœur de solution** : Therefore — backend calcule `lucidity_index` (count × intensity × recall_quality), backend l'utilise pour suggestions internes (ex : si index baisse de 50% en 14j, propose pause sans dramatisation). **Jamais affiché user.** L'user voit son journal lucide narrativement (cf. §5.5), pas dataviz.
- **Patterns connectés** : ANTI_GAMIFICATION_LUCID, NUMINOSITY_BACKEND (global).
- **Propriétés** : The Void, Boundaries, Simplicity.

### §2.10 EXTERNAL_LINEAGE_POINTER `*`
- **Contexte** : user demande pratique contemplative profonde (dream yoga, milam).
- **Problème invariant** : reproduire dream yoga en app = appropriation culturelle. Ignorer la demande = abandonner persona Yann.
- **Cœur de solution** : Therefore — écran sobre qui pointe vers **lignées vivantes** :
  - Ligmincha Institute (Wangyal, Bön)
  - Namkhai Norbu Dzogchen Community
  - Naropa University
  - + ressources livresques (Norbu *Dream Yoga and the Practice of Natural Light* mentionné explicitement, lien achat externe)
  - Message clair : *"Dream App ne propose pas cette pratique. Si tu veux l'explorer, voici des lignées."*
- **Patterns connectés** : KIMMERER_RECIPROCITY (global P6), EXIT_TO_HUMAN (global).
- **Propriétés** : Boundaries, Not-Separateness, The Void.

### §2.11 LUCID_FOREST_RETRIEVE `*`
- **Contexte** : user a un kairos `is_lucid=true` et demande la sagesse Forêt sur ce kairos.
- **Problème invariant** : la Forêt globale (332 livres) inclut beaucoup de contenu non-lucid pertinent pour rêves standards. Pour un kairos lucide, certaines sources sont **plus pertinentes** (LaBerge, Moss *Conscious Dreaming*, Tholey-via-Claude, Aizenstat re-entry, Mavromatis hypnagogia). D'autres restent **secondairement pertinentes** (Bachelard reverie, Jung individuation, Hopcke synchronicity).
- **Cœur de solution** : Therefore — quand `is_lucid=true`, le retrieve Forêt boost les sources avec `dream_role IN ('lucid','protocol')` (tag dans `book_root_assignments` cf. 3_TECHNICAL §32.0). Wangyal a tag `lucid` mais avec advisory `do_not_cite_user_facing` (cohérent §6.2 1_BIBLE). Les 3 angles polyphoniques restent (paper/stone/silk) mais le contenu source est pondéré pour le lucide.
- **Patterns connectés** : FOREST_FIRST_WORKFLOW (global), VOIX_ABSORBÉE_PAS_BIBLIOGRAPHIE (global).
- **Propriétés** : Levels of Scale, Echoes, Strong Centers.

### §2.12 LUCID_DREAM_REENTRY_AIZENSTAT `*`
- **Contexte** : user a un lucide où il a vécu un dialogue inachevé OU une figure marquante, post-réveil.
- **Problème invariant** : l'envie naturelle est de "y retourner" en rêvant à nouveau. Mais la nuit suivante n'est jamais garantie. Aizenstat propose **re-entry consciente éveillée** comme méthode profonde pour continuer le travail.
- **Cœur de solution** : Therefore — sur KairosDetail d'un lucide (ou d'un rêve standard avec figure marquante), action 🪷 *"Re-entrée éveillée"*. Sub-flow 5-10 min :
  1. Ancrage somatique (~30s, SOMATIC_GATE renforcé)
  2. Re-évocation guidée du rêve (le user lit / écoute son propre récit)
  3. *"Tu peux fermer les yeux et reprendre le rêve où il s'est interrompu. Reste avec ce qui surgit. Si une figure parle, tu écoutes. Si tu veux poser une question, tu peux. La figure répond elle-même — pas l'app."*
  4. Silence ~5-10 min (timer optionnel)
  5. Capture libre post-re-entry — texte ou voix. Stockée comme suite du kairos initial.
  6. AHA_CAPTURE post.
- **Patterns connectés** : KAIROS_DEPOSIT (global), AHA_CAPTURE (global), ANTI_VENTRILOQUIE (global red line §8.6).
- **Propriétés** : Strong Centers, The Void, Roughness, Echoes.

### §2.13 LUCID_NIGHTMARE_DETOUR `**`
- **Contexte** : user marque un kairos cauchemar AND `is_lucid=true`.
- **Problème invariant** : l'instinct des apps lucid (Awoken) est de proposer "résoudre le cauchemar en lucide" (confronter, transformer, vaincre la figure menaçante). Cliniquement risqué — peut renforcer dissociation, activer Protector Kalsched sans containment.
- **Cœur de solution** : Therefore — détection auto (cauchemar + lucid) → **detour vers Sanctuaire Cauchemars/Deuil** (cf. 2_DESIGN §7.9 global). Message : *"Cette nuit, tu as touché à quelque chose de dur. La Sanctuaire est là pour ça. Tu peux y aller maintenant ou plus tard."* + EXIT_TO_HUMAN visible. La chambre Lucid n'invite **pas** à "essayer un IRT (Imagery Rehearsal Therapy)" ou similaire — ces pratiques cliniques requièrent accompagnement humain.
- **Patterns connectés** : SANCTUAIRE_FLOW (global §7.9), EXIT_TO_HUMAN (global), TRAUMA_SAFE_SUBSTRAT (global).
- **Propriétés** : Boundaries, Not-Separateness, The Void.

### §2.14 PRACTICE_NOT_SCORE_NARRATIVE `*`
- **Contexte** : user veut "voir où il en est" dans sa pratique lucide.
- **Problème invariant** : Awoken/Lucidity proposent dataviz : count, calendar heatmap, lucidity score, charts. Gamification.
- **Cœur de solution** : Therefore — écran "Où en est ta pratique" présenté comme **lettre narrative** (cohérent Portrait LETTRE 2_DESIGN §7.6). 200-400 mots tissés par Sonnet à partir de l'archive lucid du user. Ex : *"Depuis 3 lunes, tu rêves plus souvent de pièces inconnues. Ta pratique du reality check des mains est devenue presque silencieuse — tu n'as plus besoin de te le rappeler. La nuit du 18, tu as reconnu le rêve dans une scène de marché. Tu as choisi d'observer plutôt que de partir voler — c'est une posture qui s'approfondit."* Pas de chiffres, pas de %, pas de graphique. Si user demande explicitement (V2) accès aux chiffres bruts pour son usage personnel → mode connaisseur opt-in (Marcus persona).
- **Patterns connectés** : PORTRAIT_LETTRE (global §7.6), ANTI_GAMIFICATION (global §8.2 1_BIBLE), AHA_CAPTURE (global).
- **Propriétés** : Echoes, Strong Centers, Good Shape, Roughness.

### §2.15 ANTI_GAMIFICATION_LUCID `**`
- **Contexte** : tout pattern de répétition / pratique / induction.
- **Problème invariant** : la pratique lucide est précisément celle où la gamification est la plus tentante (induction = quantifiable, lucide = oui/non, count facile). Awoken/Lucidity y succombent.
- **Cœur de solution** : Therefore — application stricte de §8.2 1_BIBLE :
  - Pas de count visible (lucide cumulé / weekly / monthly)
  - Pas de calendar heatmap
  - Pas de "streak"
  - Pas de leaderboard, jamais
  - Pas de badges (oneironaut bronze/argent/or)
  - Pas de "défi 30 jours"
  - Pas de notification "tu es à 5 jours sans lucide, essaie WBTB ce soir"
- **Patterns connectés** : tous.
- **Propriétés** : The Void, Simplicity, Boundaries.

---

## §3 — Onboarding Lucid 3 écrans rituels FR

L'onboarding Lucid se déclenche **uniquement** si user clique pour activer la chambre Lucid (depuis Explorer hub ou prompt contextuel). Pas dans l'onboarding global Dream App (qui reste 3 écrans rituels génériques cf. 2_DESIGN §8.1).

### §3.1 — Écran 1 : Qualifier le rapport au lucide (sans badge)

Fond `night-floor`, glyphe ☾ + ✦, titre sobre.

> **La chambre Lucid**
>
> Ici, on apprend à reconnaître le rêve pendant qu'il a lieu.
>
> Pas pour le contrôler. Pour y être pleinement présent.
>
> Cette chambre n'est pas le sommet de Dream App. C'est une chapelle latérale. Tu peux y entrer, en sortir, y revenir quand tu veux.

[Continuer →]

Avant la transition, micro-question (3 boutons) :

> **Tu y arrives avec…**
>
> ◇ une curiosité — je n'ai jamais reconnu un rêve, ou très rarement
>
> ◐ une pratique — je connais MILD, RC, dreamsigns, j'ai déjà des lucides
>
> ◑ une recherche d'éveil — je viens du yoga, méditation, traditions contemplatives

Tap → tag interne `lucid_experience_level` (curieux / praticien / contemplatif). **Pas de badge user-facing** (`badge_displayed = false`). Sert seulement à orienter les suggestions de la chambre Lucid.

### §3.2 — Écran 2 : Trauma-aware question (cohérent global §8.1)

Fond `night-floor`, ton doux.

> **Avant d'entrer**
>
> La pratique lucide peut interagir avec certains états — sleep paralysis chronique, dissociation, troubles du sommeil sévères, OCD, certaines fragilités psychiques.
>
> *Pour rester en sécurité* :
>
> ◇ As-tu un diagnostic de trouble dissociatif, psychotique, ou un trouble du sommeil sévère ?
>
> [○ Non]   [○ Oui]   [○ Pas sûr — je préfère ne pas dire]

Si **Oui** ou **Pas sûr** : la chambre Lucid s'ouvre en **mode contemplatif** par défaut (pas d'induction technique forte — RC OK, dreamsigns OK, MILD OK light, **WBTB désactivé**, **SSILD désactivé**). Message : *"Bienvenue. Pour ta sécurité, certaines techniques ne sont pas activées par défaut. Tu peux les explorer avec un thérapeute si tu le souhaites — ressources disponibles à tout moment."* + EXIT_TO_HUMAN visible.

Si **Non** : pleine palette disponible (mais plafonds §2.8 toujours actifs).

### §3.3 — Écran 3 : Choisir une voie d'entrée

Cohérent §2.2 LUCID_THREE_PATHS.

> **Trois voies pour commencer**
>
> ◇ **Présence éveillée** — observer, reconnaître, dialoguer. Sans piloter. *Voie INFUSE par défaut. Inspiré de Moss, Aizenstat, Tholey.*
>
> ◐ **Pratique technique** — reality checks, dreamsigns, MILD. *L'approche scientifique de LaBerge (Stanford). Empirique et structurée.*
>
> ◑ **Voies contemplatives** — dream yoga, milam. *Dream App ne propose pas ces voies. Voici des lignées vivantes pour explorer.*

Le user tap. Le tag interne `lucid_chosen_path` est posé. **Le user peut changer à tout moment dans Profil.** Aucun engagement.

Tap **Présence éveillée** → ouvre la chambre Lucid sur l'onglet "Pratique" avec tutorial doux du reality check des mains (3 paragraphes).

Tap **Pratique technique** → ouvre la chambre Lucid sur l'onglet "Pratique" avec présentation des 4 piliers : recall, RC, dreamsigns, MILD.

Tap **Voies contemplatives** → écran EXTERNAL_LINEAGE_POINTER (§2.10) avec Ligmincha + Norbu + Naropa + livres. Bouton "Revenir à la chambre Lucid pour la voie laïque" reste visible.

---

## §4 — Architecture nav : 5 onglets sub-app

Quand user entre dans la chambre Lucid (route `/lucid`), la BottomNav globale Dream App **change** en BottomNav sub-app Lucid (cohérent §11.bis.20.11 global pour Cercle sub-app dédiée).

```
┌─────────────────────────────────────────────────────┐
│  ◇  ◆  ◐  🌙  ✦                                    │
│ Profil RC Signs WBTB Pratique                       │
└─────────────────────────────────────────────────────┘
```

5 onglets :

1. **Profil** (◇) — config, état, voie choisie, paramètres
2. **Reality Checks** (◆) — config + historique
3. **Dream Signs** (◐) — liste personnelle, ajout, archivage
4. **WBTB** (🌙) — config alarmes, historique
5. **Pratique** (✦) — écran principal narratif (lettre, journal lucid, MILD ritual, re-entry)

Bouton retour `← Dream` toujours visible top-left, ramène à la nav globale.

---

## §5 — Détail des 5 onglets

### §5.1 — Onglet Profil (◇)

Fond `night-floor` léger.

```
✦ Chambre Lucid

Ta voie : Présence éveillée
[Changer de voie →]

Ton expérience : Praticien
[Préciser →]

Sécurité :
✓ Plafonds RC/WBTB actifs (recommandé)
○ Désactiver les plafonds (déconseillé)

Ressources externes :
→ Ligmincha (dream yoga Bön)
→ Lignées contemplatives

Désactiver la chambre Lucid
[bouton sobre, demande confirmation]

Export Obsidian (journal lucid uniquement)
[bouton, génère .md zip]
```

**Décisions** :
- Pas de "stats" sur ce screen.
- Désactiver la chambre Lucid possible à tout moment (préserve les données mais retire l'onglet de la nav).
- Export Obsidian dédié au journal lucid (différent de l'export global Dream App).

### §5.2 — Onglet Reality Checks (◆)

Fond `night-floor`.

#### Section "Tes RC" (top)

Liste verticale des RC actifs du user. Default 3 patterns :
- 🤚 *Regarder mes mains et compter les doigts*
- 📖 *Lire un texte deux fois — voir si les mots tiennent*
- 🕰 *Vérifier l'heure deux fois*

Chaque RC est éditable (pattern, moments contextuels, vibration on/off, son).

Bouton ➕ *Ajouter un RC personnel* — texte libre, max 6 RC simultanés (anti-OCD).

#### Section "Moments contextuels"

Configuration : à quels moments les RC sont rappelés (badge silencieux + vibration).

Default : matin (au réveil), après-midi (~14h), soir (~22h pré-sommeil). Max 5/jour suggérés. Si user veut plus, message doux : *"Au-delà de 5 rappels par jour, la pratique tend à devenir compulsive. Tu peux toujours faire un RC par toi-même quand tu y penses."*

#### Section "Historique" (bottom, pliable)

Liste des RC effectués (timestamp + résultat *éveillé* / *douteux* / *jeune lucide*). User peut tagger un RC comme ayant déclenché reconnaissance dans un rêve récent — lien vers le kairos.

**Pas de heatmap calendar.** Pas de "% de RC effectués cette semaine". Juste la liste.

### §5.3 — Onglet Dream Signs (◐)

Fond `night-floor`.

#### Section "Tes signes personnels" (top)

Liste des dreamsigns que le user a marqués. Chaque dreamsign affiche :
- Nom (texte libre user-defined)
- Catégorie (LaBerge 4 cat : *intérieur*, *action*, *forme*, *contexte*)
- Nombre d'apparitions dans son journal (count interne, affichage discret en chiffre uniquement, pas dataviz)
- Dernier kairos où il est apparu (date)
- Bouton *Archiver* (le retire des suggestions actives, garde la donnée)

#### Section "Suggestions de l'app" (middle)

L'IA propose des dreamsigns émergents du journal du user (cf. §2.5 DREAMSIGN_PERSONAL_NOT_GENERIC). Card style :

> *3 fois ce mois, tu rêves d'une pièce inconnue dans une maison familière.*
>
> [Marquer comme dreamsign personnel ✦]   [Ignorer]

L'app propose **max 3 nouveaux dreamsigns/mois** (anti-overwhelm).

#### Section "Glossaire des catégories" (bottom, tap-long)

Définit Inner Awareness / Action / Form / Context (LaBerge), avec FR ritualisé : *intérieur* / *action* / *forme* / *contexte*. Glossaire INFUSE.

### §5.4 — Onglet WBTB (🌙)

Fond `night-floor` foncé (palette nocturne profonde, c'est l'onglet du sommeil).

#### Section "Configuration" (top)

```
Heure de coucher habituelle : 22:30  [éditer]
Heure d'endormissement estimée : 22:50

Fenêtre WBTB cible : 04:00 — 05:30
[ slider sur ligne ]

Son d'alarme : 🔔 Cloche tibétaine douce
Vibration : ✓
Durée : 30 secondes max

Plafond : 1 nuit, 4 fois/semaine max
[ ◇ verrouillé pour ta sécurité — pas modifiable ]
```

#### Section "Cette nuit" (middle)

Toggle ON/OFF pour activer WBTB cette nuit. Si ON, l'alarme sera émise.

> WBTB cette nuit : ◐ ON
> Tu seras réveillé doucement vers 04:30.
>
> Intention pré-sommeil :
> [ champ texte / bouton micro voix ]
> *La prochaine fois que je rêverai, je reconnaîtrai que je rêve.*
>
> [ Confirmer pour cette nuit ]

#### Section "Historique" (bottom, pliable)

Liste des WBTB effectués : date, heure réveil effectif, intention, lucide ou pas (si déclaré). Pas de stats agrégées.

### §5.5 — Onglet Pratique (✦)

Fond `night-floor` avec accent `silk-gold` (la pratique est le coeur).

#### Section "Où en est ta pratique" (top)

Lettre narrative tissée (cf. §2.14 PRACTICE_NOT_SCORE_NARRATIVE). 200-400 mots, recalculée 1×/lune, accessible à la demande aussi (rate-limited 1 fois / 14j).

> *Depuis 3 lunes, tu rêves plus souvent de pièces inconnues. Ta pratique du reality check des mains est devenue presque silencieuse — tu n'as plus besoin de te le rappeler. La nuit du 18, tu as reconnu le rêve dans une scène de marché. Tu as choisi d'observer plutôt que de partir voler — c'est une posture qui s'approfondit. Ce mois, deux dialogues inachevés t'attendent peut-être en re-entry. (...)*
>
> [ Lire la version longue → ]

#### Section "Rituels" (middle)

Cards rituels disponibles :

🌀 **Intention pré-sommeil (MILD)** — *3-5 min*
Un rituel pour préparer ta nuit. Tu choisis un rêve récent, tu visualises où tu serais devenu lucide, tu composes ton intention.

🪷 **Re-entrée éveillée d'un rêve** — *5-10 min*
Pour continuer un rêve où la conversation n'est pas finie, sans attendre la nuit.

🛏 **Silence rituel zhine** *(facultatif, voie Présence éveillée)* — *5-15 min*
Calm abiding pré-sommeil. Posture, respiration, présence. Pas de mantra ni visualisation. *Inspiré du shamatha bouddhique sans cadre dogmatique.*

#### Section "Journal lucid" (bottom)

Liste des kairos `is_lucid=true` chronologique inversée. Tap → KairosDetail standard (avec bandeau visuel `silk-gold` discret indiquant qu'il est lucid).

Bouton *Voir tout le journal lucid* → vue plein écran filtrée.

---

## §6 — Vocabulaire FR ritualisé + glossaire tap-long

Hérité 2_DESIGN §3 glossaire global, étendu pour Lucid.

### §6.1 — Termes affichés user (FR ritualisé)

| Anglais standard | FR INFUSE Lucid |
|---|---|
| Lucid dream | Rêve lucide / **rêve reconnu** |
| Lucidity | Lucidité / **reconnaissance** |
| Reality check | Reality check / **vérification éveillée** |
| Dream sign | Dream sign / **signe de rêve** |
| MILD | MILD (préservé, technique LaBerge nommée explicitement) |
| WBTB | WBTB / **réveil intentionnel** |
| WILD | WILD (préservé, rare en pratique INFUSE) |
| Stabilization | Stabilisation / **rester présent** |
| Sleep paralysis | Paralysie du sommeil / **seuil immobile** |
| Hypnagogic | Hypnagogique / **seuil descendant** (cohérent kairos hypnagogie 1_BIBLE) |
| Oneironaut | Oneironaute / **voyageur du rêve** |

**Règle** : le terme technique anglais reste primaire (pour cohérence avec littérature et persona Marcus). L'alternative FR ritualisée apparaît en italique ou en glossaire tap-long. Pas de masquage du jargon — le contextuel fait le pont.

### §6.2 — Glossaire tap-long Lucid (15 termes)

Long-press sur n'importe quel terme technique → bulle 200-400 mots, sourcée, qui définit + propose alternative INFUSE. Termes :

1. **Lucide** — recognition consciente du rêve pendant qu'il a lieu. Document. par LaBerge à Stanford.
2. **Reality check (RC)** — geste éveillé répété qui devient habitude et passe dans le rêve.
3. **Dream sign (signe de rêve)** — élément anomal récurrent qui peut signaler le rêve.
4. **MILD** — Mnemonic Induction of Lucid Dreams. Technique LaBerge. ~20% efficacité méta-analyse Stumbrys.
5. **WBTB** — Wake Back To Bed. Réveil intentionnel ~5h après endormissement. Plafonné INFUSE.
6. **WILD** — Wake-Initiated Lucid Dream. Entrer dans le rêve directement depuis l'éveil.
7. **DILD** — Dream-Initiated Lucid Dream. Lucide depuis un rêve déjà en cours (le plus commun).
8. **SSILD** — Senses Initiated Lucid Dream. Cyclique attention sensorielle.
9. **Hypnagogie** — état liminal entre veille et sommeil. Mavromatis.
10. **Sleep paralysis** — atonie REM consciente. Harmless si comprise.
11. **Stabilization** — techniques pour rester présent dans le rêve (tourner, frotter mains).
12. **Oneironaute** — terme LaBerge "voyageur des rêves".
13. **Présence éveillée** — terme INFUSE — posture de lucidité contemplative.
14. **Re-entrée éveillée** — Aizenstat — reprendre un rêve les yeux fermés en éveillé.
15. **ADA / All Day Awareness** — pratique d'attention soutenue éveillée. Compatible POSTURE INFUSE.

---

## §7 — Animations, palette, matter system

### §7.1 — Palette dédiée chambre Lucid

Cohérent avec palette globale Dream App (cf. 2_DESIGN §5).

| Token | Couleur | Usage |
|---|---|---|
| `night-floor` | `oklch(0.18 0.012 270)` | Fond principal (default global NUIT) |
| `silk-gold` | `oklch(0.78 0.10 80)` | Accent moment lucide / RC déclenché / aha |
| `ash-deep` | `oklch(0.22 0.008 260)` | Fond cards / sections |
| `ember-live` | `oklch(0.62 0.18 35)` | Alerte douce / WBTB alarm visual |
| `water-cool` | `oklch(0.55 0.06 230)` | Fond MILD ritual, presence éveillée |
| `bone-warm` | `oklch(0.85 0.04 75)` | Texte primaire / titres |

**Pas de palette JOUR ici** — la chambre Lucid est entièrement nocturne.

### §7.2 — Motion (cohérent 2_DESIGN §6)

- **MILD ritual entrée** : 920ms Van Gennep tripartite (séparation 280ms / marge 360ms / agrégation 280ms)
- **RC déclenchement** : pulse `silk-gold` 600ms doux
- **WBTB alarm visual** : ondulation `ember-live` 2s, ralentit puis stabilise
- **Re-entry** : zoom-in lent vers fond `night-floor` profond, glyphe lune apparaît à 1.2s

### §7.3 — Haptique

- **MILD intention compose** : haptique très légère (touch début seulement)
- **RC vibration** : double-tap court (60ms × 2)
- **WBTB alarm** : pattern doux qui s'intensifie progressivement (anti-réveil-shock)
- **Re-entry** : pas d'haptique pendant le silence

### §7.4 — Son

- **WBTB sons** : 5 options — Cloche tibétaine, pluie douce, voix bourdon (low om), gong sobre, oiseau matinal. Le user choisit. Tous max 30s avant cut. Pas de sons synthétiques pop.
- **MILD ritual** (optionnel) : voix contemplative douce qui guide la visualisation. ~30s. FR par défaut. Voix à enregistrer (Tim ? freelance INFUSE-aligned ?).

---

## §8 — Anti-patterns spécifiques Lucid (à rejeter)

Liste explicite de ce qu'on ne fait **jamais** dans la chambre Lucid.

### 8.1 — Anti-pattern : Lucid count visible
*"Tu as eu 12 lucides ce mois !"* — refusé. Cf. §2.15.

### 8.2 — Anti-pattern : Streak induction
*"7 jours sans manquer ton WBTB — continue !"* — refusé. Cf. §8.2 1_BIBLE.

### 8.3 — Anti-pattern : Leaderboard cercle
Pas en V1, pas en V2 même si Cercle Lucid s'ouvre. Cf. §4.6 1_LUCID_BIBLE.

### 8.4 — Anti-pattern : Comparaison vs autres
*"82% des oneironautes utilisent MILD"* — refusé.

### 8.5 — Anti-pattern : Badges
Pas de "Bronze Oneironaut → Silver Oneironaut → Gold Oneironaut".

### 8.6 — Anti-pattern : Notification push lucid
*"On dirait que tu n'as pas eu de lucide depuis 5 jours, essaie SSILD ce soir"* — refusé. Notification = invitation in-app silencieuse, jamais push.

### 8.7 — Anti-pattern : Quiz "what's your lucid level"
Pas de quiz qui range le user. Le tag `lucid_experience_level` est posé en onboarding (§3.1) sans badge user-facing.

### 8.8 — Anti-pattern : "Lucid pour résoudre cauchemar"
Cf. §2.13 LUCID_NIGHTMARE_DETOUR + §4.2 1_LUCID_BIBLE.

### 8.9 — Anti-pattern : "Lucid pour fly / lucid sex / lucid superpowers"
Pas de contenu mis en avant qui suggère pilotage du rêve. Cf. §4.5 1_LUCID_BIBLE.

### 8.10 — Anti-pattern : Tigle / 4 watches / clear light
Pas de cherry-picking dream yoga. Cf. §4.7 1_LUCID_BIBLE.

### 8.11 — Anti-pattern : "Premium Lucid Course"
Pas de paywall sur fonctions lucid. Cf. §7 1_LUCID_BIBLE.

### 8.12 — Anti-pattern : Marketing "boost créativité avec rêves lucides"
Claim non prouvé. Cf. §4.3 1_LUCID_BIBLE anti-revendications neuro.

---

## §9 — Bridges vers Dream App principale

### §9.1 — Bridge depuis chambre Lucid → Dream App principal

À chaque écran de la chambre Lucid, le bouton retour `← Dream` ramène à la BottomNav globale. Plus :

- **Sur un kairos lucide marqué important** : bouton secondaire *"Tendre ce rêve avec ta présence Anima"* → ouvre KairosDetail standard avec Forêt FIRST 3 angles (cohérent §3.10 1_BIBLE).
- **Après pratique lucide longue (1+ mois)** : la lettre narrative §5.5 mentionne *"tes lucides résonnent avec ta vie de jour — explore la connexion dans ton portrait"* → tap ouvre Portrait LETTRE.
- **Si Anima Mundi opt-in** : *"Cette lune, l'Anima Mundi a tissé des résonances avec tes lucides. Veux-tu voir ?"* — invitation occasionnelle, jamais imposée.

### §9.2 — Bridge depuis Dream App principal → chambre Lucid

- **NLP markers détectés** sur kairos rêve nocturne : prompt *"As-tu reconnu le rêve cette nuit ?"* (§2.3 LUCID_TYPE_TAG_EMERGENT).
- **Pattern récurrent** (3+ kairos `is_lucid=true` en 30j chez user qui n'a pas activé chambre Lucid) : invitation douce *"Tu as reconnu le rêve plusieurs fois ce mois. La chambre Lucid t'est ouverte si tu veux."* — 1 fois, refusable.
- **Onboarding global** : question optionnelle écran 3 (avant le premier dépôt) : *"Pratiques-tu déjà le rêve lucide ?"*. Si oui → chambre Lucid pré-activée à la fin onboarding.

### §9.3 — Bridge avec Sanctuaire Cauchemars/Deuil

Cf. §2.13 LUCID_NIGHTMARE_DETOUR. Détection auto cauchemar + lucid → Sanctuaire prend le pas, pas de "résoudre en lucide".

### §9.4 — Bridge avec Oracle du Corps

Si lucide + sensation somatique forte (vol, paralysie, vibration) → la chambre Lucid propose lien vers Oracle du Corps pour explorer la sensation indépendamment.

---

## §10 — Cercle Lucid (V2 — placeholder)

Décision §8.5 1_LUCID_BIBLE : pas de Cercle Lucid en V1. V2 placeholder.

Quand V2 ouvre :
- Cercle dédié 4-7 oneironautes
- Facilité par humain formé (lineage Lucidity Institute, Aizenstat-trained, ou équivalent)
- Pratiques partagées : intentions hebdomadaires, rapports lucides, dialogues figures
- Pas de lucid leaderboard, pas de comparaison
- K-anonymity 100+ (cohérent globale)
- Triple filtre Said/Smith/Kimmerer

---

## §11 — Flows ritualisés Lucid

### §11.1 — Flow 1 : Activation chambre Lucid (premier accès)

1. Trigger : user clique "◐ Mode Lucid" depuis Explorer hub OU prompt contextuel.
2. **Onboarding 3 écrans rituels** §3 (qualifier expérience, trauma-aware question, choisir voie).
3. Tag interne posé. Chambre Lucid devient accessible. Onglet Lucid disponible (toggle dans paramètres).
4. Atterrissage : onglet **Pratique** avec lettre d'accueil *"Bienvenue dans la chambre Lucid. Voici trois gestes pour commencer."*

### §11.2 — Flow 2 : Capture d'un kairos lucide (sub-flow Quick)

1. User capture rêve nocturne en mode Quick global (cohérent §3.11 1_BIBLE).
2. Sonnet extraction post-capture (silencieux, ~3-6s) détecte markers lucid.
3. Si détecté : propose post-capture *"As-tu reconnu le rêve cette nuit ?"* avec 3 boutons : *Oui* / *Pas sûr* / *Non*.
4. Si **Oui** → tag `is_lucid=true` posé. Sub-question *"Comment as-tu reconnu ?"* avec 4 options émergentes (Inner Awareness / Action / Form / Context — LaBerge 4 cat) + texte libre. Sub-question *"Quelle technique avais-tu utilisée hier soir ?"* (MILD / WBTB / SSILD / Spontané / Autre). Tout optionnel — user peut skip.
5. Le kairos est sauvé dans le journal lucid de la chambre Lucid.
6. AHA_CAPTURE post (cohérent global).

### §11.3 — Flow 3 : Rituel MILD pré-sommeil

Cohérent §2.6.

1. Trigger : user tap card *"Intention pré-sommeil (MILD)"* depuis onglet Pratique.
2. Étape 1 : choisir un rêve récent (de la liste 5 derniers du journal lucid OR rêves standards si journal lucid trop court).
3. Étape 2 : visualiser. Voix optionnelle (~30s) qui guide. *"Ferme les yeux. Reviens dans la scène de [titre du rêve]. Vois le moment où tu aurais pu reconnaître que c'était un rêve. Que ressens-tu, dans ton corps ?"*
4. Étape 3 : composer intention (texte ou voix). Template suggéré, modifiable.
5. Étape 4 : silence rituel ~60s. Pas de bouton "j'ai fini". Auto-close 90s OU user ferme app.

### §11.4 — Flow 4 : Re-entrée éveillée d'un rêve (Aizenstat)

Cohérent §2.12.

1. Trigger : depuis KairosDetail d'un rêve (lucid ou standard avec figure marquante), tap action 🪷 *"Re-entrée éveillée"*.
2. Ancrage somatique 30s (SOMATIC_GATE renforcé, cohérent global).
3. Re-évocation : user lit son propre récit OU écoute (TTS du raw_text).
4. Texte guide : *"Tu peux fermer les yeux et reprendre le rêve où il s'est interrompu. Reste avec ce qui surgit. Si une figure parle, tu écoutes. Si tu veux poser une question, tu peux. La figure répond elle-même — pas l'app."*
5. Silence ~5-10 min (timer optionnel).
6. Capture libre post — texte ou voix. Stockée comme `re_entry_session` du kairos initial.
7. AHA_CAPTURE post.

### §11.5 — Flow 5 : WBTB nuit ON

Cohérent §2.7.

1. User active WBTB pour ce soir (toggle dans onglet WBTB).
2. App vérifie plafond hebdo (max 4×/sem). Si dépassé → message doux refus + propose autre nuit cette semaine.
3. User compose son intention pré-sommeil.
4. Heure cible : alarme douce (cloche/pluie/etc., 30s max).
5. Réveil → écran s'ouvre direct sur l'intention pré-WBTB (pas de scroll, pas de notif spam).
6. User fait sa pratique (rêvasserie, respiration, marche courte) ~20-40 min hors app (pas de tracking).
7. Retour au lit. Pas d'écran "as-tu fait ton rêvasserie 20 min ?" — pas de surveillance.
8. Lendemain matin : user capture son rêve normalement. Si lucide → tag automatique méthode `wbtb_mild`.

### §11.6 — Flow 6 : Pratique du Reality Check (rappel contextuel)

Cohérent §2.4.

1. Heure contextuelle configurée. App envoie badge in-app + vibration courte. **Pas de push notification** (anti-stress).
2. User regarde notifs in-app, voit *"✦ Reality check — vérifie tes mains"*.
3. User effectue le geste éveillé (regarder mains, lire texte, etc.).
4. Tap retour app : option discrète *"Comment c'était ?"* avec 3 boutons : *éveillé clair* / *douteux* / *jeune lucide* (très rare). Skip OK.
5. Ledger discret en historique.

### §11.7 — Flow 7 : Désactivation chambre Lucid

1. User va Profil → bouton sobre *"Désactiver la chambre Lucid"*.
2. Confirmation : *"Ta pratique est conservée. La chambre Lucid sera retirée de ta nav. Tu pourras la réactiver à tout moment dans l'Explorer."*
3. Flag `lucid_user_profile.enabled = false`. Onglet retiré de la nav. Données préservées.
4. Pas de pop-up "tu vas perdre tout ton progrès !" — c'est anti-gamification.

---

## §12 — Cohérence checklist (auto-test)

Tests à appliquer mentalement avant de valider tout nouveau composant Lucid :

- [ ] **Pattern LUCID_PRESENCE_NOT_CONTROL respecté** : verbes utilisés sont-ils observer/dialoguer/tendre, ou contrôler/piloter/vaincre ?
- [ ] **Pattern ANTI_GAMIFICATION_LUCID respecté** : pas de count visible, pas de streak, pas de badge, pas de leaderboard ?
- [ ] **P-Inversion Oraculaire global** : l'IA propose-t-elle des révélations à la place du user, ou aide-t-elle le user à observer son propre rêve ?
- [ ] **Anti-spiritual bypass** : si le contexte est cauchemar, le détour Sanctuaire est-il pris ?
- [ ] **Plafonds anti-OCD respectés** : RC max 5/jour, WBTB max 1/nuit + 4/sem ?
- [ ] **Triple filtre Said/Smith/Kimmerer** : pas d'esthétisation orientaliste, pas d'essentialisation indigène, réciprocité tracée ?
- [ ] **EXIT_TO_HUMAN visible** depuis tout écran de la chambre Lucid ?
- [ ] **Vocabulaire technique avec glossaire tap-long** ?

Si une case échoue → refondre.

---

> *"On entre dans la chambre Lucid par la grande porte qui dit clairement 'chambre Lucid'. Une fois dedans, on découvre que ce n'est pas un terrain de jeu — c'est un espace de présence."*
> — formulation INFUSE, 2026-04-28.
