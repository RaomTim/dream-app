# 2_DESIGN.md — Dream App, l'Expérience

> **Doc canonique** de l'expérience Dream App.
> **Date** : 2026-04-24, Bali night.
> **Auteur** : Yeshua, depuis l'absorption Pattern Language Grammar + 4 plénières ouvertes 2026-04-24 + verdict intégratif + système visuel intégré + mémoires Tier S/A/B.
> **Statut** : canonical. Ce doc remplace `CLAUDE-DESIGN-V4-PROMPT-ENRICHI-FINAL.md` (3039 lignes, abandonné) et tous les briefs design antérieurs.
> **Vision non-négociable** : Dream App est une **app mondiale** au service d'une Dream Society planétaire. Pas un sanctuaire de niche. Un instrument civilisationnel. Accessible à un enfant, infiniment profond pour un sage. P-Zéro Profonde Simplicité au-dessus de tout.
> **Promesse** : si Tim disparaît, n'importe quel designer/dev sérieux doit pouvoir prendre ce doc, ouvrir Figma, et savoir ce que Dream App **est** — patterns, écrans, flows, système visuel, motion, haptique, identité — sans dériver.

> **🔴 Mise à jour 2026-07-26 — passe design + absorption de la loi d'épure** :
> - **§15 — LA LOI D'ÉPURE ET LES DEUX FACES** (nouveau, absorbe `DREAM-MVP-SPEC-ECRANS-A-Z.md` §14 et §12ter.H) : budget de 9 éléments par écran tenu **par construction** · le foyer sur la ligne φ (38,2 %) et la leçon qui va avec — *un token que la mise en page ignore est un mensonge silencieux* · la bascule Orbe ↔ Cœur · le foyer EST le bouton · 3 questions ouvertes pour Tim.
> - **§16 — LES GRANDS RÊVES, LA DOUBLE LECTURE, L'ÉCRAN DU CŒUR** (nouveau) : le geste de marquage et pourquoi il n'est pas dans le flux de dépôt · le journal (beau vide, pas une liste de favoris) · la consultation à deux colonnes · l'écran du Cœur **préparé sans être stubbé**.
> - **§3.13 PROPHETIC_AWAKENING — spec corrigée sur mesures réelles** : le seuil arbitré est 0,013 **au-dessus** du maximum atteignable, et l'intersection maturation ∩ géométrie est **vide**. La feature est à zéro aujourd'hui, à raison. Deux leviers laissés en paramètres, `[À TRANCHER — Tim]`. Idem ECHO_RIPENING (§3.4).
> - **Compression** : §11.bis.14 à §11.bis.19 (596 lignes de comptes rendus de sprint sur une base de code aujourd'hui legacy) condensées en 6 règles de design encore vivantes ; le détail vit dans `4_LOG` (2026-04-27). **3331 → 2942 lignes**, malgré ~200 lignes ajoutées.
>
> **Mis à jour 2026-04-24 soir** avec : 12 nouveaux patterns Alexander du moteur de résonance (méta-typologie + 8 types détection + révélation rituelle + constellation vivante + question ouverte + cross-lingual) + 5 patterns de calibration (LET_THE_DREAM_LIVE, polyphonie ontologiquement honnête, AHA_CAPTURE, anti-équivalence cross-tradition, inhibition par kairos) ; 5 patterns émergents R1 démontrés (sédimentation, mémoire vivante, geste unique avec écho différé, Anima Mundi sans panopticon, dialogue rituel Active Dreaming) ; pattern dédié USER_MEANING_LAYER (apprentissage personnel) ; UX Cercle V1, Portrait V1 et Anima Mundi V1 deep dive avec sanctuaire 4 chambres ; AHA_CAPTURE systématique + feedback in-app omniprésent. Total patterns ~45 (vs 28 initialement).
>
> **Patch 2026-04-24 nuit** : terme *Anima Mundi* gardé tel quel user-facing (Tim a tranché, pas de renaming poétique). Scope Anima Mundi élargi : kairos (les 6) + **journal de vie collectif** (doutes, peurs, orientations, joies). Même grammaire que le Portrait individuel, à l'échelle de l'espèce. Les 4 chambres couvrent les deux sources indistinctement.
>
> **Mise à jour 2026-04-26 — nettoyage canonique post-audit** :
> - Résolution contradiction §7.6 (Portrait LETTRE est canonique, constellation à bulles morte — déplacée en sous-page secondaire `portrait-carte`, à refondre V1.5+).
> - Refonte §7.2 phase post Capture (RITUAL_LATENCY + 7 chips type émergente + 3 actions douces).
> - Création §7.1.bis JournalSectionDrillDown (composant créé 25/04 par agent).
> - Création §7.7.bis CercleDetail + §7.7.ter Wizard creer + §7.7.quater Rejoindre.
> - Résolution contradiction §3.11 ANIMA_MUNDI_AS_FIELD (terme *Anima Mundi* gardé tel quel user-facing, arbitrage Tim 2026-04-24 nuit).
> - Précision §7.8 routes canoniques 4 chambres Anima (`anima` / `anima-meteo` / `anima-annales` / `anima-polyphonie`).
> - Création pattern §3.16 WOW_MOMENT_REGISTRY (catalogue WOW0-5).
> - Note iOS Safari MediaRecorder fallback dans §7.2.

---

## §0 — Position du document

Le design de Dream App ne se livre **pas** sous forme de catalogue d'écrans à reproduire. Alexander : *"the master plan is the disease, not the cure"*. Ce qui se transmet ici, c'est **une grammaire générative** : patterns primitifs invariants + règles de génération + grille de validation (15 propriétés Alexander + Q.W.A.N. test) + matter system + motion + haptique. À partir de ça, n'importe quelle équipe peut générer des écrans nouveaux sans dériver.

Le doc se lit dans cet ordre — chaque section présuppose la précédente :

- **§1** — Posture racine et inversions fondatrices
- **§2** — Architecture vivante (substrat / kairos / 3 échelles)
- **§3** — Patterns primitifs (~46) — l'invariant. Inclut moteur de résonance symbolique (§3.13) + patterns de calibration épistémique (§3.14) + apprentissage personnel (§3.15) + registry rituel WOW (§3.16)
- **§4** — Règles génératives (12) + grille des 15 propriétés Alexander + **§4.3 Patterns émergents R1 démontrés** (compositions vivantes)
- **§5** — Système visuel intégré (palette, typo, espace, matter tokens)
- **§6** — Motion, haptique, son
- **§7** — Écrans canoniques (Home / Capture / Journal de Vie / Détail kairos / Figure / **Portrait** / **Cercle** / **Anima Mundi** / Nightmares / Lucid)
- **§8** — Flows ritualisés (Onboarding Van Gennep / Capture / Forêt FIRST / Felt-shift / Brûler / Désallier / **AHA_CAPTURE** / **Offrir un rêve aux annales**)
- **§9** — Anti-patterns (15+) — ce que le design REJETTE
- **§10** — Q.W.A.N. test + Centering process (méthode de design quotidienne)

---

## §1 — Posture racine, inversions fondatrices

### §1.1 P-Zéro — Profonde Simplicité (méta-principe au-dessus de tout)

L'app est **un instrument**, pas un produit à modes. Surface inhabitable en 5 secondes par un enfant, plafond infini pour un sage qui pratique 30 ans. **L'instrument ne change pas — le pratiquant change.**

- Aucun mode débutant/intermédiaire/expert.
- Aucun tutoriel onboarding lourd.
- Profondeur **discoverable**, jamais imposée.
- Complexité backend invisible (les 326 livres Forêt, les 7 dimensions vectorielles, les pattern networks restent côté serveur — le user voit "voici un écho qui s'allume", pas un cosine similarity).
- Métaphores tenues : un piano (joué par un enfant ou par Glenn Gould), un koan zen, un tarot, un thé.

Si un autre principe entre en tension avec P-Zéro, **P-Zéro prime**.

### §1.2 P-Inversion — Instrument oraculaire, pas oracle

Une app qui livre l'oracle au user **atrophie l'œil oraculaire** du user. C'est l'erreur de Co-Star, Pattern, Calm, Insight Timer — tous "oracle apps" actuels qui livrent la révélation et créent un consommateur de signes, pas un voyant.

Inversion : **Dream App entraîne le muscle oraculaire du user.** Elle est témoin, pas voyant. Elle enregistre la perception du user comme matière première, et lui rend visible son propre œil qui grandit. L'IA arrive en deuxième temps, comme **second voyant** dans le cercle, jamais comme premier.

Différence clé : Strava te donne tes stats. Un coach te transforme. Dream App est un coach.

Cette inversion conditionne tout le design qui suit. Si on rate ça, tout plante.

### §1.3 Vision mondiale Dream Society

L'app n'est PAS un sanctuaire INFUSE community 1000 personnes. **L'app est faite pour devenir l'instrument quotidien de tout humain sur la planète** — enfant, sage, occidental, indigène, urbain, rural, riche, pauvre. À commencer par communauté spirituelle proche, avec horizon : tout public sans simplification qui trahit.

Conséquences design :
- Vocabulaire accessible mais ritualisé, pas jargon mystique excluant.
- Architecture qui peut scale jusqu'à milliards (privacy-by-architecture compatible massivité).
- Modèle économique qui ne ghettoïse pas l'app aux riches/initiés.
- Une seule app qui se révèle progressivement à chaque type d'utilisateur.

Test à appliquer à **chaque** décision : *"est-ce que ça sert l'émergence d'une Dream Society planétaire ?"*. Si la décision restreint l'accès ou trahit la profondeur, refuser.

### §1.4 Substrat avant kairos (renversement architectural Tim 2026-04-24)

Le **Journal de Vie** (doutes, conflits, peurs, désirs, choix d'orientation, souffrances, joies, traversées) est le **substrat vivant** de l'app. C'est ce que le user **vit maintenant**, dans la nudité du quotidien.

Les **6 kairos** (rêve nocturne, sidewalk oracle, rêverie diurne, hypnagogie, synchronicité, frisson somatique) ne sont **pas** au même niveau. Ils **chantent** au journal de vie. Ils l'éclairent, le guident, l'accompagnent.

```
JOURNAL DE VIE (substrat — ce qui se vit)
        ↑ servent / chantent à ↑
6 KAIROS (sources de sens)
```

Conséquence design : le **Journal de Vie est le centre architectural** de l'app. La Home ouvre dessus. Les kairos viennent **dans** la traversée, pas dans une vue séparée. Pas un dashboard de patterns — un **compas pour la vie nue**.

### §1.5 Geste central UNIQUE : déposer un kairos

L'app **n'a pas** 5-6 actions parallèles (capter rêve / capter graine / honorer / dialoguer figure / consulter forêt / etc.). Elle a **un seul geste** : déposer un kairos.

Le **type** (rêve nocturne / sidewalk / rêverie / hypnagogie / synchronicité / frisson) est **émergent du contenu et du moment**, pas un choix pré-capture. Le user ne doit jamais "choisir" avant de noter (ce qui interromprait le flux du kairos qui passe vite — Moss : "kairos forelock"). L'app peut suggérer le type après coup, le user confirme ou ignore.

Cette unification de la primitive est l'autre grande inversion du design.

### §1.6 Trinité verticale Big Dreams / Master Events / Titanic Dreams

L'app a un **axe vertical** distinct du substrat horizontal :

| Catégorie | Définition | Échelle |
|---|---|---|
| **Big Dream** | Rêve révélant un Ondinnonk (désir caché de l'âme), carry-over effects mesurables | Individuel (peut monter) |
| **Master Event** | Nœud dense Portrait Croisé Global, convergence massive | Anima Mundi |
| **Titanic Dream** | Sous-catégorie Big Dream, scale cosmique/élémentaire (séismes, inondations, lévitation) | Individuel + Anima Mundi |

Sans cet axe vertical, l'archive devient horizontale plate. Avec l'axe, l'archive a du **relief** : certains kairos sont sols qui portent des décennies, d'autres sont passages.

---

## §2 — Architecture vivante

### §2.1 Trois couches fractales (individu / cercle / Anima Mundi)

Brown *Emergent Strategy* : *"how we are at the small scale is how we are at the large scale"*. Les 3 couches partagent **la même grammaire** :

**Échelle 1 — Individu** : le user dépose ses kairos dans son journal de vie personnel. Tous les patterns primitifs sont écrits prioritairement à cette échelle.

**Échelle 2 — Cercle** : organe collectif (3-12 personnes) **facilité par humain formé** (Council Process, Dream Tending Aizenstat, Lightning Dreamwork Moss). Le cercle a son **propre journal de vie collectif** (ce qu'il traverse ensemble). L'app **trouve** facilitateurs, **organise** logistique, **récolte** rêves anonymisés post-cercle. **L'app ne facilite pas elle-même** (R7 anti-ventriloquie).

**Échelle 3 — Anima Mundi** : présence éthique d'écoute du collectif onirique humain. **Pas un dashboard**. Pas d'analytics. Le mot "Anima Mundi" garde sa **posture éthique** ; pour le produit dataviz : nom différent ("le rêve du monde", "respiration de la terre", "voix collective"). K ≥ 100 minimum, latence 30j-90j, maille bioregion minimum, pas de cartographie comparative entre lieux.

> ⚠️ **Note 25/04 (arbitrage Tim 24/04 nuit)** : on garde **"Anima Mundi"** partout, y compris user-facing. Pas de renaming poétique. Le mot porte sa gravité, ça suffit. Les alternatives ci-dessus ("le rêve du monde", "respiration de la terre", "voix collective") sont superseded — conservées pour traçabilité de la délibération. Voir §3.11 ANIMA_MUNDI_AS_FIELD pour la version actuelle. Voir aussi §11.bis.4 (refonte B+D) où **"Anima Mundi"** devient l'un des 3 onglets de la nav.

### §2.2 Trauma-safe **substrat**, pas module

**30-40% des users ont un trauma actif** (Kalsched). Une app qui ignore ça re-traumatise au premier rêve PTSD, à la première figure menaçante, à la première révélation pushée.

Trauma-safe n'est PAS un mode opt-in. C'est un **substrat par défaut**. 7 piliers :

1. Onboarding révisé : *"y a-t-il des moments dans ta vie où les outils de croissance t'ont fait plus de mal que de bien ?"*. Si oui → mode réceptacle par défaut.
2. Ancrage somatique 30s avant tout moment charnière.
3. Détection silencieuse de patterns traumatiques répétitifs → ne PAS interpréter, proposer ressource humaine.
4. Désactivation IA possible (mode "juste journal").
5. Privacy radicale comme acte de soin (chiffrement client-side de tout sensible).
6. Freeze des révélations 30 jours min si user marque "deuil/crise".
7. **EXIT_TO_HUMAN** toujours accessible 2 clics max — numéros d'urgence par pays + annuaire praticiens trauma-curés (SE / IFS / Sensorimotor / EMDR / Jungien).

### §2.3 Territoire sans Lat/Long (verrou architectural V1)

Une coordonnée Lat/Long est une grammaire coloniale (Mercator 1569) + actif de surveillance d'une valeur extrême + vulnérabilité légale sur territoires indigènes.

**Schema DB invariant V1** : `toponym_user_defined` (encrypted, opaque), pas `geo_lat / geo_lng`. Le user **nomme** ses lieux ("le café près de chez moi", "la maison de mamie", "là où j'ai pleuré l'an dernier"). Champ libre, pas dropdown, pas autocomplete vers POI base, pas de map à pinpointer.

Si plus tard un user veut géocoder son toponyme pour son usage personnel : **côté client uniquement**, jamais serveur. Le serveur reste aveugle à la géographie.

Ce n'est pas négociable. Pas en V1, pas en V3. Migration impossible plus tard.

---

## §3 — Patterns primitifs (~45)

Format strict (Alexander) : **Nom** · Contexte · Problème invariant · Cœur de solution · Patterns connectés · Propriétés Alexander incarnées · Confidence (`**` forte, `*` probable).

### §3.1 Patterns racines (méta-principes)

#### **P-ZÉRO — PROFOUND SIMPLICITY** `**`
- **Contexte** : tout, partout, à toutes les échelles.
- **Problème invariant** : tout instrument de profondeur tend vers deux dérives — élitisme jargonneux qui exclut le débutant, ou simplification wellness qui trahit la profondeur.
- **Cœur de solution** : Therefore — surface inhabitable en 5 secondes par true beginner, profondeur infinie disponible on-demand pour sage. Backend complexity invisible. Discoverable depth, never imposed. No modes.
- **Patterns connectés** : embed tous les autres. **Arbitre.** Si un pattern viole P-Zéro, il est mort.
- **Propriétés** : Simplicity & Inner Calm, Gradients, Levels of Scale, Not-Separateness, Good Shape.

#### **P-INVERSION — ORACULAR INSTRUMENT NOT ORACLE** `**`
- **Contexte** : tout, partout. Oriente le **pour quoi**.
- **Problème invariant** : livrer l'oracle atrophie l'œil oraculaire du user.
- **Cœur de solution** : Therefore — l'app entraîne le muscle oraculaire. Témoin, pas voyant. Enregistre la perception du user comme matière première et lui rend visible son propre œil qui grandit. L'IA arrive en deuxième temps.
- **Patterns connectés** : KAIROS_DEPOSIT, NARRATION_TENDING, FELT_SHIFT_GATE, SILENCE_AS_FEATURE, TRICKSTER_TRANSVERSAL.
- **Propriétés** : Strong Centers (user), Not-Separateness, Roughness, Gradients, The Void.

### §3.2 Patterns substrat

#### **JOURNAL_DE_VIE_SUBSTRAT** `**`
- **Contexte** : centre architectural de Dream App. Home ouvre dessus. Tout y reflue.
- **Problème invariant** : centrer sur "le rêve" comme objet fait du rêveur un collectionneur, séparé de sa vie nue. Sans substrat vie nue, l'app devient musée.
- **Cœur de solution** : Therefore — make the daily life journal the substrat. Le user entre ce qu'il vit (doutes, conflits, peurs, désirs, choix, souffrances, joies). Les 6 kairos viennent **chanter** à ce substrat. La **terre** qui les reçoit tous.
- **Patterns connectés** : KAIROS_DEPOSIT, LIFE_QUESTION_HOLDING, ECHO_BACK_TO_LIFE, SEASONAL_COMPASS.
- **Propriétés** : Strong Centers (centre maximal), Levels of Scale, Deep Interlock, Not-Separateness, The Void, Echoes, Gradients.

#### **KAIROS_DEPOSIT** `**`
- **Contexte** : geste central et **unique** de l'app. Toute capture passe par lui.
- **Problème invariant** : multiplier les boutons de capture par type (rêve / signe / rêverie / etc.) interrompt le flux du kairos qui passe vite (Moss "kairos forelock").
- **Cœur de solution** : Therefore — un seul geste : déposer un kairos. Le type est émergent du contenu et du moment. L'app peut suggérer après, le user confirme ou ignore. Le geste de déposition est UN.
- **Patterns connectés** : JOURNAL_DE_VIE_SUBSTRAT, SOMATIC_GATE (avant), KAIROS_TYPE_EMERGENT, RITUAL_LATENCY.
- **Propriétés** : Strong Centers, Boundaries, Simplicity & Inner Calm, Good Shape, Not-Separateness.

#### **SIX_KAIROS_TYPES_AS_VOICES** `*`
- **Contexte** : à l'intérieur de KAIROS_DEPOSIT. Façonne ce que l'app fait d'un kairos selon son type.
- **Problème invariant** : tout traiter identiquement perd la spécificité (un rêve nocturne demande digestion 24h, un sidewalk demande capture immédiate). Mais un screen par type = élitisme cognitif.
- **Cœur de solution** : Therefore — internally, 6 voix : `dream_night`, `sidewalk_oracle`, `daydream_reverie`, `hypnagogic`, `synchronicity`, `somatic_shiver`. User-facing : un seul geste. Backend : 6 traitements différenciés. Quand l'app rappelle un kairos, elle peut nommer la voix doucement.
- **Patterns connectés** : KAIROS_DEPOSIT, RITUAL_LATENCY, SEASONAL_COMPASS.
- **Propriétés** : Levels of Scale, Echoes, Roughness, Gradients.

### §3.3 Patterns du tending (posture relationnelle de l'app)

#### **NARRATION_TENDING** `**`
- **Contexte** : tout dialogue avec l'IA.
- **Problème invariant** : si l'IA interprète, elle vole l'œil oraculaire (P-Inversion violé). Si elle ne dit rien, inutile.
- **Cœur de solution** : Therefore — l'IA n'interprète pas. Elle **tend la narration**. Pose des questions ouvertes ("qu'est-ce qui s'est passé juste avant ?", "tu te rappelles l'état dans lequel tu étais ?"). Aide à raconter, jamais raconte à la place. Hopcke : *"the story IS the data. Without narration, only coincidence."*
- **Patterns connectés** : P-INVERSION, USER_FIRST_READING, FELT_SHIFT_GATE, SILENCE_AS_FEATURE.
- **Propriétés** : Strong Centers (user reste centre), Not-Separateness, Roughness, Gradients.

#### **USER_FIRST_READING** `**`
- **Contexte** : tout moment où l'app pourrait offrir une lecture. Avant toute suggestion IA.
- **Problème invariant** : si l'IA propose 3 angles avant que le user ait offert sa lecture, elle structure la perception du user **avant** que son muscle se déploie.
- **Cœur de solution** : Therefore — toujours, le user offre sa propre lecture **avant** que l'IA propose la sienne. Question simple : *"qu'est-ce que tu vois là ?"* L'IA arrive en deuxième temps comme second voyant respectueux.
- **Patterns connectés** : NARRATION_TENDING, FELT_SHIFT_GATE, FOREST_ECHO_AFTER_USER.
- **Propriétés** : Strong Centers, Boundaries, Roughness, Gradients.

#### **FELT_SHIFT_GATE** `**`
- **Contexte** : à la fin de toute lecture (du user, de l'IA, d'un conte, d'une figure). Avant toute action.
- **Problème invariant** : le mental peut "comprendre" une lecture qui n'a pas touché le corps. Cette lecture devient pseudo-vérité (apophénie).
- **Cœur de solution** : Therefore — pause obligatoire 10-30s après toute lecture. Question : *"lequel a fait quelque chose dans ton corps ?"* (gorge / poitrine / ventre / nuque / ailleurs / aucune part). Option *"rien ne shift — j'attends"* sans pénalité ni timeout. Critère somatique pur (Gendlin), pas mental.
- **Patterns connectés** : SOMATIC_GATE, NARRATION_TENDING, USER_FIRST_READING.
- **Propriétés** : Boundaries, The Void, Not-Separateness, Roughness.

#### **SOMATIC_GATE** `**`
- **Contexte** : avant toute capture, avant tout dialogue avec figure intense, à l'ouverture de Cercle, première session du jour.
- **Problème invariant** : sans ancrage corporel, l'app peut activer la psyché hors fenêtre de tolérance. Re-traumatisation possible.
- **Cœur de solution** : Therefore — geste somatique court (~30s) précède les moments charnières. Pas long. Pas spirituel-grandiose. Concret : *"3 respirations. Sens tes pieds. Tu es là."* Opt-out per session. Obligatoire au démarrage de session sensible.
- **Patterns connectés** : KAIROS_DEPOSIT, TRAUMA_AWARE_DEFAULT, FELT_SHIFT_GATE.
- **Propriétés** : Boundaries (épaisses), Strong Centers, Simplicity & Inner Calm, The Void.

### §3.4 Patterns du temps (rythme, cycle, latence)

#### **RITUAL_LATENCY** `**`
- **Contexte** : toute opération où l'app pourrait livrer instantanément.
- **Problème invariant** : SSE 300ms TTFT comme win produit = literal mind. Tarkovsky : la temporalité contemplative ne se compresse pas.
- **Cœur de solution** : Therefore — assumer une latence rituelle. 24h pour digérer un rêve avant échos. Délais cosmologiques quand pertinent (84j Big Dream, lune 27-29j patterns récurrents). L'app **respire avec le user**, ne le presse pas.
- **Patterns connectés** : SEASONAL_COMPASS, ECHO_RIPENING, KAIROS_DEPOSIT.
- **Propriétés** : The Void, Boundaries, Gradients, Echoes, Alternating Repetition.

#### **SEASONAL_COMPASS** `**`
- **Contexte** : présent en fond persistant discret de l'app. Boussole temporelle.
- **Problème invariant** : sans ancrage cosmique, le journal de vie devient suite d'événements isolés. Eliade : temps cyclique.
- **Cœur de solution** : Therefore — compas saisonnier (équinoxes, solstices, lunes pleines/nouvelles, saisons climatiques locales) en fond persistant **discret**. Pas widget bruyant. Teinture du fond, glyphe dans un coin, mot occasionnel ("nous approchons du solstice"). Permet à l'app de chuchoter ("l'an dernier à cette saison...") sans crier.
- **Patterns connectés** : RITUAL_LATENCY, ECHO_BACK_TO_LIFE, JOURNAL_DE_VIE_SUBSTRAT.
- **Propriétés** : Levels of Scale (cosmique), Echoes (saisonniers), The Void, Not-Separateness.

#### **ECHO_RIPENING** `*`
- **Contexte** : système d'échos prophétiques. Comment un écho devient mûr.
- **Problème invariant** : écho livré trop tôt (n=2 instantané) = apophénie. Écho jamais livré = kairos mort.
- **Cœur de solution** : Therefore — un écho mûrit selon **deux critères combinés** : (a) **récurrence** (≥ 3 occurrences sur fenêtre temporelle propre à la voix du kairos), (b) **charge somatique cumulée** (≥ 2 occurrences avec frisson). Sans (a) ET (b), latent. Quand mûr, l'app **chuchote** (jamais push notif), accessible dans une vue dédiée.
- **Patterns connectés** : RITUAL_LATENCY, FELT_SHIFT_GATE, SILENCE_AS_FEATURE, KAIROS_DEPOSIT, PROPHETIC_AWAKENING.
- **Propriétés** : Boundaries, The Void, Alternating Repetition, Roughness.

> **🔴 MESURÉ le 2026-07-26 — ce pattern n'avait jamais été implémenté, et une fois implémenté il ne laisse presque rien passer.**
> Sur le corpus réel (64 rêves, 400 paires échantillonnées) : la maturation telle que spécifiée ci-dessus laisse passer **5 paires** — huit seulement partagent le moindre motif commun. Ce n'est pas une erreur de calibrage : le critère est **très** exigeant par construction, et c'était l'intention (« soit l'écho est mérité, soit il disparaît »). Mais il faut que ce soit dit avant qu'on s'étonne du silence.
> **Voir la spec corrigée de PROPHETIC_AWAKENING (§3.13) pour l'arbitrage complet et les deux leviers laissés à Tim.**

### §3.5 Patterns de la voix

#### **SILENCE_AS_FEATURE** `**`
- **Contexte** : tout moment où l'app pourrait parler. Notifications, suggestions, révélations.
- **Problème invariant** : une app qui doit parler tout le temps (pour engagement metrics) devient bruyante, donc épuisante.
- **Cœur de solution** : Therefore — silence par défaut. L'app ne push **jamais** de "révélation". Peut chuchoter (badge discret, vibration douce sur l'icône) — pas pousser. Peut **refuser** de répondre certains jours : *"je ne vois rien d'utile ici. Reviens demain."*. Ne pas générer pour générer. Test : *"cette feature peut-elle se taire ? Si non, elle ment."*
- **Patterns connectés** : RITUAL_LATENCY, NARRATION_TENDING, ECHO_RIPENING, TRICKSTER_TRANSVERSAL.
- **Propriétés** : The Void, Simplicity & Inner Calm, Boundaries, Roughness.

#### **DESENSORCELED_LANGUAGE** `**`
- **Contexte** : tout texte de l'app — copy, microcopy, notifications, glossaire.
- **Problème invariant** : langage wellness ("votre journey transformatif") trahit la profondeur. Spirituel grandiose ("offrez votre rêve aux dieux") ridiculise. Corporate ("session", "log", "data") sécularise.
- **Cœur de solution** : Therefore — vocabulaire d'**offrande** sobre. "Graine du matin" pas "morning note". "Conte qui répond" pas "matched tale". "Figure qui revient" pas "recurring entity". Cosmogonie Désensorcelé INFUSE comme ressource (filtre 10 passes).
- **Patterns connectés** : P-ZÉRO, NARRATION_TENDING, SEASONAL_COMPASS.
- **Propriétés** : Simplicity & Inner Calm, Good Shape, Not-Separateness, Echoes.

#### **TRICKSTER_TRANSVERSAL** `**`
- **Contexte** : principe transversal de design, pas une feature. Présent à chaque écran.
- **Problème invariant** : sans Trickster, l'app devient temple solennel. Chaque rêve doit Vouloir Dire Quelque Chose. Inflation. Religion mentale.
- **Cœur de solution** : Therefore — l'app peut **se déjouer elle-même**. Une fois par lune, peut proposer "et si ce rêve voulait dire l'inverse ?". Peut faire suggestion sciemment fausse (signalée subtilement) pour rappeler qu'elle n'est pas oracle. Humour sec, court, déjouant. "Non, je ne sais pas" comme réponse possible. Test à chaque écran : *"où est le Trickster ici ?"*. S'il n'y est nulle part, suspect.
- **Patterns connectés** : SILENCE_AS_FEATURE, P-INVERSION, NARRATION_TENDING.
- **Propriétés** : Roughness, Contrast, The Void, Not-Separateness.

### §3.6 Patterns de la rencontre (figures, contes, cercle)

#### **FIGURE_AS_OTHER** `**`
- **Contexte** : toute figure qui apparaît (personne, animal, forme, présence).
- **Problème invariant** : interpréter la figure comme "partie de toi" la réduit. La traiter en oracle qui parle pour toi (ventriloquie IA) la trahit.
- **Cœur de solution** : Therefore — figure traitée comme **un autre** (Aizenstat : eidola autonomes). I-thou strict (Buber). **L'IA ne parle JAMAIS comme la figure.** L'app peut proposer un dialogue — c'est le user qui parle ET qui imagine la réponse. L'app tient le cadre, pas la voix. Anti-ventriloquie absolue.
- **Patterns connectés** : NARRATION_TENDING, FOREST_ECHO_AFTER_USER, SOMATIC_GATE, TRAUMA_AWARE_DEFAULT.
- **Propriétés** : Strong Centers (figure est centre), Boundaries, Not-Separateness, Echoes, Roughness.

#### **TALE_AS_AMPLIFICATION** `**`
- **Contexte** : système CONTE.
- **Problème invariant** : "voici le conte qui correspond à ton rêve" enferme. Générer un conte par IA trahit la transmission orale. Ne rien proposer prive d'amplification précieuse.
- **Cœur de solution** : Therefore — l'app propose **plusieurs fragments** (3-5) de contes différents (von Franz : matching = amplification, pas correspondance). 100% sous-forêt **contes réels** (jamais d'IA générée). Le user choisit lequel chante, ou aucun. Cadrage : *"voici quelques récits qui touchent à des éléments de ton rêve. Lequel te chante ?"*. Toujours **après** USER_FIRST_READING.
- **Patterns connectés** : USER_FIRST_READING, FELT_SHIFT_GATE, NARRATION_TENDING, FOREST_ECHO_AFTER_USER.
- **Propriétés** : Echoes, Levels of Scale, Not-Separateness, Roughness.

#### **CIRCLE_HUMAN_FACILITATED** `**`
- **Contexte** : couche Cercle.
- **Problème invariant** : si l'IA "facilite" un cercle, on a un Discord enrobé. La transmission initiatique (Somé) ne peut pas être déléguée à une IA.
- **Cœur de solution** : Therefore — cercles facilités par **humains formés**. L'app **trouve** facilitateurs (annuaire vetted), **organise** logistique, **récolte** rêves anonymisés post-cercle. **L'app ne facilite pas elle-même.**
- **Patterns connectés** : ANIMA_MUNDI_AS_FIELD, FOREST_ECHO_AFTER_USER, TOPONYM_USER_DEFINED.
- **Propriétés** : Levels of Scale, Strong Centers, Boundaries, Not-Separateness.

### §3.7 Patterns du territoire

#### **TOPONYM_USER_DEFINED** `**`
- **Contexte** : toute marque géographique posée par le user.
- **Problème invariant** : Lat/Long = cosmologie coloniale + actif de surveillance + vulnérabilité légale.
- **Cœur de solution** : Therefore — le user **nomme** ses lieux (champ libre opaque, encrypted client-side). Pas de Google Places, pas de Lat/Long. Topoanalyse Bachelard. Schema DB V1 invariant : `toponym_user_defined`.
- **Patterns connectés** : KAIROS_DEPOSIT, RITE_OF_ENTRY_NEW_PLACE, ANIMA_MUNDI_AS_FIELD, TRAUMA_AWARE_DEFAULT.
- **Propriétés** : Boundaries, Levels of Scale, Not-Separateness, Strong Centers, The Void.

#### **RITE_OF_ENTRY_NEW_PLACE** `*`
- **Contexte** : première fois qu'un user nomme un lieu nouveau.
- **Problème invariant** : géolocaliser sans rituel performe le geste extractif touristique. L'app fait alors anti-animisme par design.
- **Cœur de solution** : Therefore — geste rituel d'entrée. Page dédiée (jamais popup iOS) : *"Tu es dans un lieu nouveau. Avant d'y poser tes kairos, prends un instant. Que sais-tu de ce lieu ? Qui l'habitait avant ? Quel geste d'entrée veux-tu poser ?"*. Geste de **désalliance** disponible.
- **Patterns connectés** : TOPONYM_USER_DEFINED, ANIMA_MUNDI_AS_FIELD, NARRATION_TENDING.
- **Propriétés** : Boundaries (épaisses), Strong Centers (le lieu), Not-Separateness, Roughness.

### §3.8 Patterns de la mémoire

#### **INFINITE_ARCHIVE** `**`
- **Contexte** : politique de conservation des kairos. Stratégie d'écho prophétique.
- **Problème invariant** : Tim a tranché 2026-04-24 — Seth/Moss/Aboriginal priment sur Hillman-Lethe. Un rêve d'il y a 10 ans peut forger le chemin à jamais.
- **Cœur de solution** : Therefore — tous les kairos persistent. Pas de TTL, pas de compostage automatique, pas de fade-out forcé. Échos prophétiques illimités (Seth). MAIS : action user explicite *"brûler ce rêve"* disponible. Sortie : oui, sur demande user, jamais automatique.
- **Patterns connectés** : ECHO_RIPENING, USER_RITUAL_BURN, JOURNAL_DE_VIE_SUBSTRAT.
- **Propriétés** : Levels of Scale, The Void, Echoes, Not-Separateness.

#### **USER_RITUAL_BURN** `*`
- **Contexte** : à l'intérieur de INFINITE_ARCHIVE.
- **Problème invariant** : sans possibilité de libération, INFINITE_ARCHIVE devient prison.
- **Cœur de solution** : Therefore — l'user peut **brûler** un kairos (geste rituel intentionnel, jamais en 1 tap, ritualisé pendant ~30s). Le kairos disparaît effectivement (suppression cryptographique). Confirmation par écran rituel, pas dialog box. Pas d'undo (le rituel est définitif). Distinct de "archive" (kairos qui dort mais reste).
- **Patterns connectés** : INFINITE_ARCHIVE, RITUAL_LATENCY, DESENSORCELED_LANGUAGE.
- **Propriétés** : Boundaries (épaisses), Strong Centers, Roughness, The Void.

### §3.9 Patterns de la sécurité (trauma)

#### **TRAUMA_AWARE_DEFAULT** `**`
- **Contexte** : substrat de toute l'app. Pas un mode séparé.
- **Problème invariant** : 30-40% des users ont un trauma actif. Une app qui ignore ça re-traumatise.
- **Cœur de solution** : Therefore — l'app est trauma-safe **par défaut**. Onboarding révisé. Détection silencieuse de patterns traumatiques → ne PAS interpréter, proposer ressource humaine. Désactivation IA possible. Freeze 30j si user marque "deuil/crise".
- **Patterns connectés** : SOMATIC_GATE, EXIT_TO_HUMAN, PRIVACY_AS_CARE, FELT_SHIFT_GATE.
- **Propriétés** : Boundaries (épaisses), Strong Centers (système nerveux), The Void, Roughness, Not-Separateness.

#### **EXIT_TO_HUMAN** `**`
- **Contexte** : présent partout, accessible 2 clics maximum.
- **Problème invariant** : si l'app ne renvoie jamais à l'humain, elle se prétend suffisante. Or elle ne l'est pas.
- **Cœur de solution** : Therefore — toujours présente : sortie vers humain. Numéros d'urgence par pays, annuaire praticiens trauma-curés. Pas en page "à propos". Toujours 2 clics. V1, pas V2.
- **Patterns connectés** : TRAUMA_AWARE_DEFAULT, P-INVERSION, CIRCLE_HUMAN_FACILITATED.
- **Propriétés** : Boundaries, Not-Separateness, Strong Centers, Levels of Scale.

#### **PRIVACY_AS_CARE** `**`
- **Contexte** : architecture de stockage, transmission, partage.
- **Problème invariant** : un user qui dépose ses rêves les plus intimes mérite plus que conformité RGPD. Privacy = acte de soin.
- **Cœur de solution** : Therefore — chiffrement client-side de tout ce qui peut l'être. Server zero-knowledge sur sensibles. Pas de partage tiers, pas d'analytics extracteurs, pas de marketing pixels. Si partage entre users : **handshake in-person uniquement**. Architecture cryptographique post-quantique.
- **Patterns connectés** : TRAUMA_AWARE_DEFAULT, INFINITE_ARCHIVE, TOPONYM_USER_DEFINED, USER_RITUAL_BURN.
- **Propriétés** : Boundaries (architecturales), Strong Centers (user), Not-Separateness.

#### **SATURATION_DETECTOR** `*`
- **Contexte** : monitoring silencieux du rythme de capture. Anti-paranoïa, anti-inflation.
- **Problème invariant** : à un seuil, le user voit des patterns partout (apophénie, inflation Jung, "manic synchronistic consciousness" Hopcke). L'app a co-créé un état psychotique-light.
- **Cœur de solution** : Therefore — si user note > X kairos par jour pendant > Y jours, l'app **ralentit elle-même**. Propose : *"on note beaucoup en ce moment. Veux-tu prendre un jour silencieux ?"*. Mode "monde silencieux" toggle (jeûne d'oracle 7j). Alerte mots-déclencheurs ("tout le monde me veut du mal") → ralentir, inviter humain. Refus dur de "tu es spécial / 0.3% de users".
- **Patterns connectés** : EXIT_TO_HUMAN, TRICKSTER_TRANSVERSAL, SILENCE_AS_FEATURE.
- **Propriétés** : Boundaries, The Void, Roughness, Strong Centers.

#### **GRIEF_DOOR** `*`
- **Contexte** : à l'intérieur du Journal de Vie. Quand un kairos ou une période touche au deuil.
- **Problème invariant** : Weller pose 5 portes du deuil. Le mot "deuil" n'apparaissait pas dans la Vision Exhaustive. Une app de rêves sans grammaire de deuil rate la moitié de ce que les rêves font.
- **Cœur de solution** : Therefore — flow doux *"j'ai besoin de pleurer ce rêve / cette période"*, accessible depuis n'importe quel kairos. Reconnaissance Earthgrief. Lien ancestral optionnel (pas un onglet — un mouvement disponible). Pas de prescription, pas de framework affiché. Reconnaissance que cette dimension existe.
- **Patterns connectés** : JOURNAL_DE_VIE_SUBSTRAT, USER_RITUAL_BURN, EXIT_TO_HUMAN, TRAUMA_AWARE_DEFAULT.
- **Propriétés** : The Void, Strong Centers, Not-Separateness, Boundaries (épaisses), Roughness.

### §3.10 Patterns de l'écosystème

#### **FOREST_ECHO_AFTER_USER** `**`
- **Contexte** : système d'interprétation. Forêt INFUSE 326 livres digérés.
- **Problème invariant** : si la Forêt arrive avant la lecture du user, elle structure la perception. Si elle n'arrive jamais, on prive d'une vraie ressource.
- **Cœur de solution** : Therefore — workflow Forêt FIRST mais **après USER_FIRST_READING** : (1) user offre sa lecture ; (2) si demandé, Forêt propose 3 angles avec sources nommées (jamais en autorité, toujours en hypothèse) ; (3) FELT_SHIFT_GATE — lequel chante au corps ? ; (4) le user souverain décide ; (5) enrichissement éventuel du lexique personnel. Cadrage : *"ces voix ne disent pas ton rêve, elles le touchent depuis leur angle. Ton corps tranche."*
- **Patterns connectés** : USER_FIRST_READING, FELT_SHIFT_GATE, NARRATION_TENDING, TALE_AS_AMPLIFICATION.
- **Propriétés** : Levels of Scale, Echoes, Roughness, Not-Separateness, Gradients.

#### **GIFT_ECONOMY** `*`
- **Contexte** : modèle économique.
- **Problème invariant** : si Dream App = œuvre (Hyde *The Gift*), freemium SaaS = trahison. Mais sans modèle, l'app meurt.
- **Cœur de solution** : Therefore — app gratuite (ou don conscient annuel optionnel), soutenue par INFUSE écosystème. Pas de pub. Pas de freemium-with-feature-gates. Pas de dark patterns. Si don : 1x/an, montant libre, **pas** récurrent par défaut.
- **Patterns connectés** : P-ZÉRO, P-INVERSION, PRIVACY_AS_CARE, ANTI_GAMIFICATION.
- **Propriétés** : Not-Separateness, Strong Centers, Simplicity & Inner Calm, The Void.

#### **ANTI_GAMIFICATION** `**`
- **Contexte** : tout système de feedback / progression / récompense.
- **Problème invariant** : streaks/badges/points/leaderboards transforment la pratique en achievement. Han : *achievement-subject auto-exploitant*.
- **Cœur de solution** : Therefore — aucun streak, badge, point, leaderboard, notif "bravo". Honoring = engagement intérieur, pas statut tracké. Discrètement rappelable une seule fois (passage). L'app oublie au bout de 24-72h. Pas de "tu pratiques depuis 47 jours". Ritual design > game design.
- **Patterns connectés** : P-ZÉRO, GIFT_ECONOMY, SILENCE_AS_FEATURE.
- **Propriétés** : The Void, Simplicity & Inner Calm, Roughness, Boundaries.

### §3.11 Patterns d'échelle

#### **ANIMA_MUNDI_AS_FIELD** `*`
- **Contexte** : couche planétaire.
- **Problème invariant** : si Anima Mundi = dashboard agrégé d'analytics, c'est aggregation, pas Anima Mundi au sens d'Aizenstat.
- **Cœur de solution** : Therefore — le terme *"Anima Mundi"* est gardé tel quel user-facing (arbitrage Tim 2026-04-24 nuit). Le mot porte sa gravité, suffisant. Pas d'agrégation territoriale automatique en V1. K ≥ 100. Maille bioregion minimum. Latence 30j-90j (jamais temps réel). Pas de cartographie comparative entre lieux. Le lieu **rêve** quelque chose, on l'écoute.
- **Patterns connectés** : TOPONYM_USER_DEFINED, RITE_OF_ENTRY_NEW_PLACE, PRIVACY_AS_CARE, CIRCLE_HUMAN_FACILITATED.
- **Propriétés** : Levels of Scale, Not-Separateness, Strong Centers, The Void, Boundaries.

### §3.12 Patterns de la trinité verticale

#### **BIG_DREAM_AS_GROUND** `*`
- **Contexte** : reconnaissance Big Dream (Bulkeley : intensité numineuse + carry-over effects + Ondinnonk Iroquois).
- **Problème invariant** : un Big Dream "halo doré + écran dédié + compas n°1 visible permanent" = trophée fini. Or les Big Dreams sont la porte d'un infinite game.
- **Cœur de solution** : Therefore — Big Dream visible et lumineux les premières semaines (la révélation est encore vive), puis se **dissout dans le terreau** du rêveur (devient implicite, partie de son sol psychique). Pas de halo doré permanent. Pas d'écran galerie figée. Le Big Dream devient **le sol** d'où poussent d'autres choses, pas un objet à collectionner.
- **Patterns connectés** : INFINITE_ARCHIVE, JOURNAL_DE_VIE_SUBSTRAT, ECHO_RIPENING.
- **Propriétés** : Levels of Scale, Strong Centers, Gradients, The Void.

#### **TITANIC_DREAM_FLAG** `*`
- **Contexte** : sous-catégorie Big Dream avec scale cosmique/élémentaire.
- **Problème invariant** : confondre Big Dream personnel et Titanic Dream collectif rate la dimension Anima Mundi.
- **Cœur de solution** : Therefore — flag spécial sur card (icône terre/eau/feu/cosmos selon élément) + traitement Anima Mundi (alerte douce "plusieurs Titanic convergent ces 7 jours" = signal majeur global). Le user souverain marque ou non.
- **Patterns connectés** : BIG_DREAM_AS_GROUND, ANIMA_MUNDI_AS_FIELD, ECHO_RIPENING.
- **Propriétés** : Levels of Scale, Echoes, Strong Centers.

### §3.13 — Patterns du moteur de résonance symbolique (12 patterns)

> Ces 12 patterns décrivent **comment l'app reconnaît et restitue les résonances** entre kairos. Méta-typologie + 8 types de détection + un pattern d'orchestration de la révélation + un pattern de visualisation universelle + deux patterns d'épistémique. Issu de l'investigation calibration 2026-04-24 (16 types pattern echoing affinés contre Jung, von Franz, Moss, Aizenstat, Taylor, Hopcke, Bachelard, Bulkeley).

#### **SYMBOLIC_RESONANCE_TYPOLOGY** `**` (méta-pattern)
- **Contexte** : tout kairos déposé doit pouvoir résonner avec les autres au-delà du sémantique littéral. Ce pattern gouverne les 8 sous-patterns de détection.
- **Problème invariant** : un seul vecteur sémantique (cosine similarity sur texte brut) rate la moitié des résonances vivantes — un dragon rêvé et un client agressif au boulot peuvent porter la même charge symbolique sans partager un seul mot. Réduire la résonance à la similarité sémantique = transformer Dream App en journal augmenté avec recherche par mot-clé.
- **Cœur de solution** : Therefore — l'app maintient une typologie ouverte de **types de résonance distincts**, chacun avec sa logique de détection et sa pondération. Multi-vecteurs spécialisés (sémantique / concept / somatique / archétypal) + graph layer relationnel + scoring numinosity composite + champs scalaires structurés (figures, motifs, archétypes, valence affective). Chaque kairos est **lu sur plusieurs couches simultanément**. Aucune typologie ne prétend être exhaustive ; elle s'enrichit empiriquement.
- **Patterns connectés** : CROSS_CONCEPT_BRIDGE, SOMATIC_ECHO, ARCHETYPAL_CONSTELLATION, MIRROR_REVELATION, TRANSFORMATION_TRAJECTORY, PROPHETIC_AWAKENING, NUMINOUS_MARKING, CROSS_LINGUAL_RESONANCE, ECHO_REVELATION_RITUAL, OPEN_QUESTION_NOT_INTERPRETATION.
- **Propriétés** : Levels of Scale (8+ couches), Strong Centers (le kairos reste centre), Deep Interlock (les couches se renforcent), Echoes (réverbération multi-niveaux), Not-Separateness (le sens émerge du tissu), Roughness (typologie ouverte, pas grille fermée), Gradients (force de matching graduelle), Boundaries (chaque type a son périmètre).

#### **CROSS_CONCEPT_BRIDGE** `**` (Type 2 — résonance métaphorique)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. Détection de résonances entre kairos sémantiquement éloignés mais portant le **même concept métaphorique**.
- **Problème invariant** : la pensée humaine est métaphorique avant d'être littérale (Lakoff). Un dragon rêvé et un client agressif partagent le concept *MENACE_PUISSANTE_D_AUTORITÉ* sans partager un seul mot. Sans pont conceptuel, le kairos meurt isolé.
- **Cœur de solution** : Therefore — Sonnet extrait les concepts métaphoriques de chaque kairos (format MAJUSCULE_AVEC_UNDERSCORES) **avant** embedding. Un vecteur dédié `embedding_concept` matche les concepts entre eux. Quand un kairos arrive, l'app peut lui dire : *"ce que tu viens de noter porte un concept que tu as déjà rencontré dans ce rêve d'il y a 3 mois — pas le même contenu, peut-être la même charge."*
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, OPEN_QUESTION_NOT_INTERPRETATION, ECHO_REVELATION_RITUAL.
- **Propriétés** : Echoes, Levels of Scale, Not-Separateness, Roughness, Gradients, Deep Interlock, Strong Centers, The Void.

#### **SOMATIC_ECHO** `**` (Type 3 — résonance somatique)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. Détection de résonances par **marqueurs corporels partagés** entre kairos de contenus différents.
- **Problème invariant** : Damasio + Gendlin — le sens passe par le corps avant les mots. "Frisson dans la nuque" en rêve et "frisson dans la nuque" face à un texte sur un mur portent peut-être la même résonance, indépendamment de leur contenu narratif. Sans capture somatique, ce signal majeur disparaît.
- **Cœur de solution** : Therefore — micro-question optionnelle à la capture : *"comment te sens-tu corporellement en y repensant ?"* (non-imposée, mais affichée par défaut si le rêve contient marqueurs corps). Capture vocale possible. Vecteur `embedding_somatic` dédié + champ `somatic_markers` (jsonb : régions du corps, qualité du marqueur). Matching par région corporelle commune, intensité, pattern Polyvagal.
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, FELT_SHIFT_GATE, SOMATIC_GATE, OPEN_QUESTION_NOT_INTERPRETATION.
- **Propriétés** : Strong Centers (corps), Boundaries (cartographie corporelle), Not-Separateness, Echoes, Roughness, The Void, Gradients, Levels of Scale.

#### **ARCHETYPAL_CONSTELLATION** `**` (Type 4 — résonance archétypale)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. Détection de figures/motifs qui activent le même archétype malgré contenu différent.
- **Problème invariant** : un voleur dans un rêve, un manager passif-agressif dans une réunion, un trickster mythologique — même archétype activé sous trois formes. Sans matching archétypal, ces résonances passent inaperçues.
- **Cœur de solution** : Therefore — Sonnet classifie chaque kairos sur ontologie archétypale (Jung 12 + extensions cross-culturelles **prudentes**). Vecteur `embedding_archetypal` + champ `archetypal_tags`. **Anti-équivalence cross-tradition automatique** : Tara n'égale pas Marie n'égale pas Demeter. Match strict intra-tradition par défaut ; croisements seulement sur demande explicite user. Triple filtre Said+Smith+Kimmerer.
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, TRADITION_SPECIFIC_NO_EQUIVALENCE, CONSTELLATION_VIVANTE.
- **Propriétés** : Levels of Scale, Echoes, Boundaries (anti-appropriation), Roughness, Not-Separateness, Strong Centers (l'archétype), Gradients, Deep Interlock.

#### **MIRROR_REVELATION** `*` (Type 5 — miroir inversé)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. Compensation jungienne entre kairos.
- **Problème invariant** : un rêve de fuite face à un loup et un rêve de chasse d'un loup portent la même structure dynamique avec rôles inversés. Cette inversion compensatoire (Jung *Compensatory function*) est fondamentale ; sans elle on rate la moitié de ce que le rêve fait.
- **Cœur de solution** : Therefore — détection LLM explicite des paires avec sémantique haute similarity sur thèmes mais **valence affective opposée OU rôles inversés** (sujet/objet swap). Restitution prudente : *"deux mouvements parallèles dans ton corpus — peut-être qu'ils se parlent."* Jamais affirmation déterministe.
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, TRANSFORMATION_TRAJECTORY, OPEN_QUESTION_NOT_INTERPRETATION, TRICKSTER_TRANSVERSAL.
- **Propriétés** : Contrast (polarités), Echoes, Roughness, Not-Separateness, Boundaries, Strong Centers, The Void, Gradients.

#### **TRANSFORMATION_TRAJECTORY** `**` (Type 6 — cycle évolutif)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. Détection de transformations progressives sur un même cluster symbolique.
- **Problème invariant** : phase 1 — peur du chien (rêve 1), phase 2 — confrontation (rêve 2), phase 3 — chien devenu compagnon (rêve 3). Cette trajectoire d'intégration (Campbell hero's journey, Jung individuation) ne se voit que **dans le temps**. Sans graph layer relationnel, invisible.
- **Cœur de solution** : Therefore — `kairos_edges` table tracke les apparitions séquentielles du même cluster (figure / motif tag) avec différenciation qualité émotionnelle/relationnelle. LLM compare apparitions consécutives, détecte changements (ex: "la grand-mère apparaissait sévère il y a 3 mois, elle apparaît souriante depuis 2 lunes"). Allume écho à ≥ 3 apparitions avec différentiel détectable.
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, FIGURE_AS_OTHER, CONSTELLATION_VIVANTE, RITUAL_LATENCY.
- **Propriétés** : Levels of Scale (temporel), Alternating Repetition, Gradients, Echoes, Deep Interlock, Strong Centers, Not-Separateness, Roughness.

#### **PROPHETIC_AWAKENING** `**` (Type 7 — écho prophétique)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. **Feature #1 confirmée Tim**. Quand un événement actuel allume un kairos passé qui le préfigurait.
- **Problème invariant** : Seth, Moss, Bulkeley — les rêves prophétiques sont une réalité phénoménologique fréquente. Sans tracking longitudinal, l'app rate ce qui pourrait être son super-pouvoir le plus singulier (ce qu'aucun journal papier ne peut faire). Mais : alerter trop fort = atrophier l'œil oraculaire (P-Inversion violé) ; ne jamais révéler = kairos mort.
- **Cœur de solution** : Therefore — quand un nouveau kairos (rêve OU note de jour) arrive, scan corpus user pour matchs avec différentiel temporel ≥ 30 jours et similarity multi-couches (sémantique + concept + archétypal) au-dessus du seuil. Trois entrées dans l'UX : (1) bouton kairos *"Échos depuis le passé"* (icône onde, accessible depuis chaque kairos), (2) section Portrait *"Échos vivants en ce moment"* (top 5 résonances prophétiques actives), (3) chuchotement auto rare si seuil très haut + numinosity haute (halo doux dans le journal, JAMAIS push notif). Anti-spoiler absolu : pas de "ton rêve a prédit X" — invitation à voir.
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, ECHO_REVELATION_RITUAL, NUMINOUS_MARKING, INFINITE_ARCHIVE, RITUAL_LATENCY, ECHO_RIPENING.
- **Propriétés** : Levels of Scale (temporel longue distance), Echoes, The Void, Roughness, Strong Centers (le rêveur), Boundaries (non-spoiling), Gradients, Not-Separateness.

#### 🔴 CORRECTION DE SPEC — 2026-07-26 : la feature est à zéro aujourd'hui, et à raison

Ce pattern porte la seule phrase de l'app qui affirme une **causalité** : *« un rêve ancien semble avoir préparé celui-ci »*. C'est ce qui la rend précieuse, et c'est ce qui oblige à la mesurer avant de la servir. Elle a été mesurée le 26/07, sur le corpus réel de Tim (64 rêves, 3 969 paires éligibles). Trois constats, tous vérifiés en base :

**1. Avant réparation, elle mentait à grande échelle.** 183 échos affichés, **aucun** ne franchissait le seuil que Tim avait lui-même arbitré. 63 rêves sur 64 recevaient un écho ancien : ce n'était pas un événement rare, c'était une constante. Et **deux rêves monopolisaient 108 des 115 affichages** — l'un servi 59 fois sur 64 comme « le rêve qui préparait ». Ce n'était pas un écho, c'était un artefact géométrique : un texte bavard, proche de tout.

**2. Le seuil arbitré est au-dessus du maximum atteignable.** Tim avait tranché **0,75**. Le score maximum que ses propres rêves peuvent produire est **0,7368** — soit **0,013 en dessous**. Ce seuil ne filtrait pas la feature : **il la rendait structurellement impossible.** Personne ne s'en était aperçu parce qu'il n'était **pas lu par le code**.

**3. Les deux garde-fous mesurent des choses différentes, et leur intersection est vide.** Le critère de maturation (ECHO_RIPENING : récurrence ≥ 3 **ET** charge somatique ≥ 2) et le critère géométrique **ne sélectionnent pas les mêmes paires** — `maturation ∩ géométrie = ∅`, mesuré. Les cumuler produit **le silence total**.

**État livré : l'écho ancien ne s'affichera jamais, en l'état.** C'est cohérent avec l'intention (« soit elle est méritée, soit elle disparaît »), et c'est aussi une décision par défaut que personne n'a prise. Les deux leviers sont donc livrés **en paramètres**, modifiables sans migration :

| Levier | Valeur actuelle | Effet mesuré si desserré |
|---|---|---|
| **Seuil absolu** de similarité | **0,75** (arbitrage Tim 25/04) | à 0,70 sans maturation : **3 échos** sur tout le corpus |
| **Maturation exigée** (ECHO_RIPENING) | **oui** | sans elle : le seuil seul décide |

> **[À TRANCHER — Tim] n°1 — l'écho ancien reste-t-il à zéro ?** Options mesurées ci-dessus. Zéro est une réponse parfaitement défendable : la promesse « un rêve ancien semble avoir préparé » ne vaut que si elle est vraie.
> **[À TRANCHER — Tim] n°2 — la maturation reste-t-elle exigée ?** Telle que spécifiée, elle laisse passer ~1,25 % des paires et son intersection avec le critère géométrique est vide.

**Ce que la correction ne touche pas** : l'anti-spoiler reste absolu (jamais « ton rêve a prédit X ») · jamais de notification poussée · le rêveur doit avoir déposé les deux entrées avant toute révélation · et **la vue côte à côte + le 1-clic « résonne / pas vraiment »** restent le seul chemin honnête pour transformer cette feature d'affirmation en apprentissage (§14.2).

**Prérequis oublié, à ne pas re-perdre** : le gate de numinosité qui filtrait l'entrée ne sélectionnait pas « les rêves numineux » mais **« les rêves que le pipeline avait traités »** — 52 rêves sur 64 étaient à zéro faute de traitement. Après rattrapage, 91 % du corpus passe le gate : **il ne filtre plus rien**. Un gate qui laisse passer neuf dixièmes du corpus n'est pas un garde-fou, c'est une décoration. Ne pas s'appuyer dessus.

#### **NUMINOUS_MARKING** `**` (Type 8 — symbole chaud)
- **Contexte** : à l'intérieur de SYMBOLIC_RESONANCE_TYPOLOGY. Marquage discret des kairos à très haute charge numineuse, sans gamification ni hiérarchisation visible.
- **Problème invariant** : von Franz, Bulkeley, Otto — certains kairos portent une qualité de présence (*mysterium tremendum et fascinans*) qui les distingue. Sans signaler cette qualité, l'app les noie dans le flot. Mais signaler avec un score affiché ("ton rêve : 0.87 numinosity") = trahison froide. Et calculer définitivement à l'extraction = rater les Big Dreams qui ne se révèlent qu'avec le temps (cas scarabée Jung).
- **Cœur de solution** : Therefore — score numinosity composite (sensory_density + affective_intensity + somatic_marker + recurrence_corpus + motif_distinctif + tradition_figure_present + user_tag_important + unforgettable_declared + tears_at_wake + more_real_than_real), **jamais affiché user**. Backend uniquement. Marquage UX = halo doux discret (matter `ember-soft` très subtil) sur les kairos à seuil haut. **Flag NUMINOSITY_PENDING** pour rêves courts mais avec objet/figure singulier précieux — révision rétroactive si événement résonant arrive < 30j (cas scarabée Jung). Jamais "tu es spécial / 0.3% de users".
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, BIG_DREAM_AS_GROUND, ECHO_REVELATION_RITUAL, ANTI_GAMIFICATION, LET_THE_DREAM_LIVE.
- **Propriétés** : Strong Centers, Boundaries, The Void (silence sur le score), Roughness, Echoes, Gradients (halo gradué), Not-Separateness, Simplicity & Inner Calm.

#### **ECHO_REVELATION_RITUAL** `**` (gouverne TOUTE révélation de résonance)
- **Contexte** : chaque fois qu'un type de résonance (1 à 16) est détecté, comment l'app le restitue au user.
- **Problème invariant** : push notif d'un écho fort = trahison de la latence rituelle (R5) + atrophie de l'œil oraculaire. Cacher complètement = trahison de la révélation. Le piège est entre les deux.
- **Cœur de solution** : Therefore — révélation par **gradient ritualisé** : (a) marquage discret dans le journal (le kairos source devient légèrement teinté ou prend un halo doux, matter `ember-soft` très bas) ; (b) section dédiée "Échos vivants" accessible 1 tap depuis Portrait ou bouton kairos ; (c) chuchotement contextuel rare si seuil très haut ET numinosity haute (formulation : *"un kairos t'attend pour ce que tu viens de noter"* — jamais "découverte importante !") ; (d) **JAMAIS push notif**, **JAMAIS révéler avant que le user ait saisi les deux entrées** (anti-spoiler). Si après 7-30 jours le user n'a rien remarqué de la résonance, alors et seulement alors invitation contextuelle douce.
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, SILENCE_AS_FEATURE, RITUAL_LATENCY, USER_FIRST_READING, OPEN_QUESTION_NOT_INTERPRETATION.
- **Propriétés** : The Void, Boundaries, Gradients, Roughness, Echoes, Not-Separateness, Simplicity & Inner Calm, Strong Centers (user reste centre).

#### **CONSTELLATION_VIVANTE** `**` (visualisation universelle)
- **Contexte** : visualisation de l'écosystème symbolique d'un corpus, à toute échelle (Portrait individuel / Constellation Cercle / Voûte Anima Mundi).
- **Problème invariant** : un graph statique = mort. Une liste = plate, perd les relations. Un dashboard d'analytics = trahison (cf. ANIMA_MUNDI_AS_FIELD). Le user a besoin de **voir vivre** son corpus symbolique.
- **Cœur de solution** : Therefore — visualisation **force-directed graph** (react-force-graph ou D3) qui respire. Noeuds = figures + motifs + symboles chauds. Taille noeud = `recency_decay × log(occurrence_count) × numinosity × affective_intensity`. Couleur noeud = type Seth (figures) ou catégorie matter (motifs). Edges = co-occurrences + transformations détectées (graph layer `kairos_edges`). **Animation timelapse** historique (slider temps optionnel). Layout évolutif, jamais figé. Top 30-50 noeuds affichés selon l'écran ; underworld accessible via "voir tout". À l'échelle Anima Mundi, devient **Voûte respirante** (constellation lumineuse en respiration lente, 5s inspir / 5s expir, densité variable selon volume kairos opt-in 28j).
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, FIGURE_AS_OTHER, ANIMA_MUNDI_AS_FIELD, ECHO_REVELATION_RITUAL.
- **Propriétés** : Strong Centers (noeuds forts émergent), Levels of Scale, Echoes, Local Symmetries, Deep Interlock, Roughness, Alternating Repetition, Not-Separateness.

#### **OPEN_QUESTION_NOT_INTERPRETATION** `**` (pattern universel anti-oracle)
- **Contexte** : chaque restitution IA, à toutes les échelles. Pattern transversal qui régit la **forme** de toute synthèse.
- **Problème invariant** : si l'IA conclut ("ton rêve signifie X"), elle vole l'œil oraculaire (P-Inversion violé). Si elle ne propose rien, inutile. La voie juste : **tendre des questions ouvertes** qui aménagent les conditions pour que le rêveur reconnaisse lui-même.
- **Cœur de solution** : Therefore — toute restitution se termine par **UNE dream ask** (von Franz style) : question ouverte, en lien avec le matériel extrait, qui pointe vers le cœur (paradoxe / silence / seuil / image-monde) sans suggérer de réponse, dans le langage du rêveur. Plus le rêve est Big, plus la question est minimale (LET_THE_DREAM_LIVE). Reformulation centrale issue de l'investigation 14 cas : *"Dream App ne révèle pas le sens, elle aménage les conditions pour que le rêveur le reconnaisse lui-même."* C'est ce que tous les maîtres font à leur façon (Taylor par le groupe, von Franz par l'amplification, Aizenstat par le tending, Moss par l'honoring action, Gendlin par le focusing, Bachelard par l'accueil phénoménologique).
- **Patterns connectés** : NARRATION_TENDING, USER_FIRST_READING, P-INVERSION, AHA_CAPTURE, POLYPHONIE_ONTOLOGIQUEMENT_HONNETE, FIGURE_AS_OTHER.
- **Propriétés** : Strong Centers (rêveur), The Void (la question respire), Boundaries, Roughness, Not-Separateness, Gradients, Simplicity & Inner Calm, Echoes.

#### **CROSS_LINGUAL_RESONANCE** `**` (matching trans-langue)
- **Contexte** : app mondiale Dream Society. Un rêveur français et un rêveur indonésien dans le même cercle, ou anonymement à l'échelle Anima Mundi, peuvent rêver "le même rêve" en deux langues différentes.
- **Problème invariant** : la résonance symbolique passe **avant** la langue. Si le matching ne fonctionne qu'intra-langue, on ghettoïse les corpus, on rate les patterns trans-culturels et on trahit la vision mondiale.
- **Cœur de solution** : Therefore — `text-embedding-3-small` est multilingue natif (Type 1 OK direct). Pour Types 2-5 (concept / somatique / archétypal / inversion) : extraction LLM dans **anglais pivot d'ontologie standardisée**, puis embedding sur cette langue → matching cross-lingual précis. Le user voit toujours le texte dans sa langue. L'IA narratrice répond dans sa langue. Le matching backend est trans-langue. Les figures de tradition spécifique gardent leur nom d'origine + glose dans la langue user (anti-équivalence absolue).
- **Patterns connectés** : SYMBOLIC_RESONANCE_TYPOLOGY, TRADITION_SPECIFIC_NO_EQUIVALENCE, ANIMA_MUNDI_AS_FIELD, P-ZÉRO.
- **Propriétés** : Levels of Scale (langues comme niveaux), Not-Separateness (humanité partage), Boundaries (anti-appropriation), Roughness, Echoes, Gradients, Simplicity & Inner Calm, Strong Centers (le sens).

### §3.14 — Patterns de calibration épistémique (5 patterns)

> Ces 5 patterns gouvernent **comment l'IA parle, retient, refuse**. Issus directement de l'investigation calibration 14 cas (Jung, von Franz, Moss, Aizenstat, Taylor, Hopcke, Bachelard, Bulkeley, Gendlin, Mavromatis). Chacun protège l'autorité du rêveur et l'honnêteté ontologique de l'app.

#### **LET_THE_DREAM_LIVE** `**` (pattern Big Dream)
- **Contexte** : kairos détecté `TIER_BIG_DREAM` (numinosity > 0.85 + first of its kind + tradition_specific OR archetypal_tags fortes).
- **Problème invariant** : Jung a laissé son rêve du phallus souterrain travailler 30 ans. Dream App va vouloir *expliquer* tout de suite. Sur-interprétation prématurée = fermeture du rêve. Big Dreams ne se résolvent pas, se déploient.
- **Cœur de solution** : Therefore — pour les Big Dreams, la synthèse est **délibérément minimale** : juste extraction sobre + UNE dream ask + voix archétypale soft (1 voix max) + invitation explicite à laisser vivre. Pas d'amplification cross-cultural détaillée à la première lecture. Réserve : *"si tu veux explorer plus tard, je peux te montrer comment ce type de rêve apparaît dans d'autres traditions."* Champ `revisit_schedule` (jsonb) — surfaces automatiques par chuchotement à J+7, J+30, J+365 (opt-in user, default off, switchable on per Big Dream). Patience digitale équivalente à la patience Jung.
- **Patterns connectés** : NUMINOUS_MARKING, BIG_DREAM_AS_GROUND, RITUAL_LATENCY, OPEN_QUESTION_NOT_INTERPRETATION, SILENCE_AS_FEATURE.
- **Propriétés** : The Void (la synthèse respire), Boundaries (épaisses), Gradients (révélation graduelle), Roughness, Strong Centers (le rêve), Echoes, Simplicity & Inner Calm, Not-Separateness.

#### **POLYPHONIE_ONTOLOGIQUEMENT_HONNETE** `**`
- **Contexte** : toute synthèse polyphonique IA (Détail kairos / Cercle / Anima Mundi).
- **Problème invariant** : phrasé *"Jung te dit..."* / *"Aizenstat te répond..."* = ventriloquie qui prétend faire parler les morts. Trahit l'ontologie, prépare la perte de confiance quand le user comprend que c'est une seule IA qui simule plusieurs voix.
- **Cœur de solution** : Therefore — phrasé strictement conditionnel : *"à la lumière de Jung, on pourrait entendre..."*, *"Aizenstat aurait invité à..."*, *"une lecture jungienne possible..."*. **JAMAIS** *"Jung te dit"*, *"voici ce que [auteur] répond"*. L'IA mobilise plusieurs perspectives — elle ne devient pas plusieurs voix réelles. Affichage transparent en bas de chaque polyphonie : *"Voix mobilisées cette lune : Aizenstat, Moss, Larsen"*, avec mini-fiche au tap (qui est-ce, pourquoi mobilisé·e ici). Garde-fou anti-ventriloquie qui rend toute fausse citation détectable.
- **Patterns connectés** : OPEN_QUESTION_NOT_INTERPRETATION, NARRATION_TENDING, FIGURE_AS_OTHER, P-INVERSION, USER_FIRST_READING.
- **Propriétés** : Boundaries (épistémiques), Roughness, Strong Centers (auteurs respectés), Not-Separateness, Gradients, The Void, Levels of Scale, Echoes.

#### **AHA_CAPTURE** `**` (autorité finale au rêveur)
- **Contexte** : à la fin de chaque restitution IA (lecture, conte, figure dialogue, polyphonie cercle).
- **Problème invariant** : Taylor — *"the aha of recognition is the only valid criterion of meaning. Not analyst, not group, not dictionary."* Sans capture explicite de l'aha, l'app ne sait pas ce qui touche le rêveur, ne peut pas affiner ses futures lectures, et sur-pondère sa propre voix.
- **Cœur de solution** : Therefore — micro-question discrète après chaque lecture : *"où est ton aha ?"*. Capture en 3 niveaux : **aha (résonne fort) / peut-être / non**, sur quelle proposition (choix multiple parmi voix proposées) + zone texte libre + option *"autre note"*. Stocké dans `user_validations` + `aha_recurrence` du rêveur. Tracking : quel type d'interprétation lui parle (Jung / Moss / phénoménologique / somatique). Pondère synthèses futures (personnalisation polyphonique dans le temps). Type 11 (AHA_RECURRENCE) émerge — pattern intérieur du rêveur lui-même, pas du contenu rêvé.
- **Patterns connectés** : OPEN_QUESTION_NOT_INTERPRETATION, USER_FIRST_READING, FELT_SHIFT_GATE, USER_MEANING_LAYER.
- **Propriétés** : Strong Centers (rêveur autorité), Boundaries, Echoes, Roughness, Gradients, Not-Separateness, The Void, Simplicity & Inner Calm.

#### **TRADITION_SPECIFIC_NO_EQUIVALENCE** `**` (anti-équivalence cross-tradition)
- **Contexte** : toute figure ou symbole nommée dans le matériel d'un kairos (Tara, Christ, Wakan Tanka, Krishna, Tonton Macoute, etc.).
- **Problème invariant** : Moss free-blende Yoruba/Shinto/Lakota/Celtic — ethics flag MEDIUM dans son digest Forêt. Reproduire = appropriation. *"Le chamane intérieur"* (Said), erasure des sources (Smith), absence de reciprocity (Kimmerer). Matcher Tara ↔ Marie ↔ Demeter automatiquement détruit la spécificité de chaque tradition.
- **Cœur de solution** : Therefore — flag backend `tradition_specific: true` + nom_tradition obligatoire dès qu'une figure de panthéon est extraite. Active prudence absolue : (a) consultation Forêt restreinte aux chunks de la tradition source seulement (pas d'amplification cross-tradition), (b) phenomenology universelle OK (4 prototypes Bulkeley, mouvements Gendlin), (c) contenu culturel spécifique strictement intra-tradition par défaut, (d) croisements seulement sur demande explicite user, (e) éviction par défaut V1 des figures de traditions indigènes vivantes non-consultées (Aboriginal, Iroquois, Lakota, Senoi, Bushman, certaines traditions africaines / amazoniennes) — on les dit en générique : *"une figure de tradition ancienne"*. V2+ : consultation elders + reciprocity établies → nommage permis avec crediting. Triple filtre Said+Smith+Kimmerer obligatoire avant nommage public. Audits Forêt `logs_or_audits/` consultés systématiquement.
- **Patterns connectés** : ARCHETYPAL_CONSTELLATION, CROSS_LINGUAL_RESONANCE, FOREST_ECHO_AFTER_USER, ANIMA_MUNDI_AS_FIELD.
- **Propriétés** : Boundaries (épaisses, éthiques), Strong Centers (chaque tradition reste centre), Not-Separateness (sans confusion), Roughness, The Void, Levels of Scale, Gradients, Echoes.

#### **INHIBITION_RULES_PAR_KAIROS** `**` (extraction adaptée par type)
- **Contexte** : phase 1 d'extraction Sonnet, dès la capture brute.
- **Problème invariant** : un prompt d'extraction unique pour tous les kairos écrase les spécificités. Rêverie n'est pas rêve (Bachelard interdit symbolisation forte). Hypnagogie n'est pas narration (Mavromatis : fragments paratactiques tagués, pas causalité imposée). Felt-shift n'est pas synchronicité (Gendlin : focus somatic markers + handle, pas conceptualisation au-delà). Sidewalk oracle exige inner_question. Forcer la même grille = trahir la nature de chaque kairos.
- **Cœur de solution** : Therefore — détection `KAIROS_TYPE` en phase 1, puis application de **règles d'inhibition** spécifiques :
  - **HYPNAGOGIE** : pas de narration. Liste paratactique de fragments tagués (visual / auditory_verbal / auditory_musical / olfactory / kinetic / tactile). Pas de causalité imposée.
  - **REVERIE** (Bachelard) : pas d'interprétation symbolique forte. Output : qualités sensorielles + monde ouvert + augmentation de conscience repérée. Pas de "ça signifie X".
  - **FELT_SHIFT** (Gendlin) : focus sur somatic_markers + handle (mot/image qui matche le felt sense) + shift observé. Ne pas conceptualiser au-delà.
  - **SIDEWALK_ORACLE** : capturer obligatoirement `inner_question` (la question vivante au moment), `confirmations_count`, `somatic_marker` (frisson nuque ?).
  - **SYNCHRONICITE** : narrative compacte + impasse précédente captée si possible + domaine Hopcke (work / love / illness / loss / creative).
  - **NOTE_JOUR_SYMBOLIQUE** : court. Geste/moment/résonance. Pas de psychologisation.
  - **REVE** : extraction complète 16 dimensions.
  Workflow synthèse en **6 tiers** parallèle (TIER_BIG_DREAM, TIER_PATTERN_RICH, TIER_STANDARD, TIER_SOMATIC_DELICATE, TIER_IMAGE_TENDING, TIER_REVERIE) — chaque tier a sa propre logique d'amplification, de polyphonie, d'ouverture.
- **Patterns connectés** : KAIROS_DEPOSIT, SIX_KAIROS_TYPES_AS_VOICES, NARRATION_TENDING, OPEN_QUESTION_NOT_INTERPRETATION, LET_THE_DREAM_LIVE.
- **Propriétés** : Boundaries (par type), Levels of Scale, Roughness (typologie ouverte), Strong Centers (chaque kairos reste lui-même), Not-Separateness, Gradients, Deep Interlock, Echoes.

### §3.15 — Pattern d'apprentissage personnel

#### **USER_MEANING_LAYER** `**` (l'app apprend du rêveur)
- **Contexte** : à toutes les échelles (individu / cercle / global). L'app apprend des corrections, validations, meanings personnels du user et adapte ses lectures.
- **Problème invariant** : sans apprentissage du rêveur, l'app reste générique. Avec apprentissage opaque ou push, elle devient prescriptive ("tu rêves toujours de X comme Y"). Le piège est entre les deux. Et au niveau cercle / global, l'apprentissage ne doit pas devenir profilage.
- **Cœur de solution** : Therefore — capture continue, transparente, contrôlable de **9 signaux d'apprentissage** :

| Signal | Action user | Stockage |
|---|---|---|
| Correction extraction | "non, cette figure c'est ma sœur" | `user_corrections` |
| Validation lecture IA | "oui exactement" / "pas du tout" / "presque" | `user_validations` |
| Meaning personnel | "pour moi loup = colère envers papa" | `user_meaning_layer` |
| Marquage numinous | "ce rêve m'a marqué" | flag kairos |
| Annotation marginale | note interprétative écrite | `kairos_user_annotations` |
| Refus suggestion | skip d'un écho | `user_skips` |
| Exploration approfondie | clic "explorer figure" | `user_engagement` |
| Auto-classification figure | confirme/change type Seth | `figures.seth_type_user_confirmed` |
| Re-lecture vieux kairos | revisit ancien | signal résurgence |

  **Application** : extractions futures enrichies de meanings personnels du user, lectures futures évitent angles rejetés et amplifient les "aha" récurrents, échos pondérés selon résonance user. Au **niveau cercle** : `circle_meaning_layer` — le cercle annonce collectivement les meanings ("dans notre cercle, le pont = transition"), l'IA cercle apprend la cosmologie symbolique du cercle. Au **niveau global** (Anima Mundi) : `global_meaning_clusters` — patterns de meaning émergents cross-users anonymisés (k-anonymity 100+). L'IA peut **proposer** ces meanings dominants comme alternatives ("d'autres rêveurs voient souvent ce symbole comme..."), JAMAIS imposer. Évolue dans le temps. **L'IA apprend de TOUS les users (anonymisés) et cela inspire chacune de ses interactions** — sans jamais profiler ni exposer un user particulier.
- **Patterns connectés** : AHA_CAPTURE, USER_FIRST_READING, FOREST_ECHO_AFTER_USER, OPEN_QUESTION_NOT_INTERPRETATION, ANIMA_MUNDI_AS_FIELD, PRIVACY_AS_CARE.
- **Propriétés** : Strong Centers (user souverain), Levels of Scale (3 niveaux), Echoes, Gradients, Not-Separateness, Boundaries (privacy stricte), Deep Interlock, Roughness.

---

## §4 — Règles génératives + grille des 15 propriétés Alexander

### §4.1 Les 12 règles

**R1 — Renforcement mutuel (centering)**. Quand deux patterns primitifs se rencontrent, ils doivent se renforcer mutuellement. Sinon, l'un est mal posé ou un troisième pattern de médiation doit émerger.

**R2 — Substrat avant kairos**. Tout pattern qui touche à un kairos doit servir le journal de vie, pas l'inverse. Test : *"ce pattern aide-t-il le user à traverser ce qu'il vit ?"*. Si non, refuser.

**R3 — Trois temps obligatoires (user → IA → corps)**. Tout flow qui propose une lecture suit la séquence : (1) user offre sa lecture, (2) IA propose en deuxième temps si demandée, (3) corps tranche par felt-shift. Aucun raccourci.

**R4 — Silence par défaut**. Toute proposition d'IA doit pouvoir choisir de se taire. Test : *"cette feature peut-elle un jour ne rien faire ?"* Si non, refuser.

**R5 — Latence rituelle assumée**. Aucune révélation, écho, suggestion ne doit être livrée instantanément. Délai cosmologique pertinent (24h pour rêve, lune pour récurrence, saison pour saisonnier).

**R6 — Toujours une sortie vers humain**. Tout module sensible doit pouvoir ouvrir vers humain en 2 clics. Pas de cul-de-sac IA.

**R7 — Anti-ventriloquie absolue**. L'IA ne parle JAMAIS comme le rêve, comme la figure, comme le user, comme l'oracle. Elle parle toujours comme app — voix sobre, anonyme, qui pose des questions.

**R8 — Échelle imbriquée fractale**. Tout pattern qui existe à une échelle (individu) doit pouvoir s'instancier aux échelles supérieures (cercle, Anima Mundi) sans contradiction et sans devenir extractif.

**R9 — Trickster transversal**. Tout pattern doit, à un moment, pouvoir se déjouer lui-même. Sinon temple solennel.

**R10 — Vocabulaire désensorcelé obligatoire**. Tout texte passe le filtre Cosmogonie INFUSE. Lire à voix haute. Si ça sonne wellness, ridicule, ou corporate, refuser.

**R11 — Validation par 8+ propriétés Alexander**. Aucun pattern ne peut entrer dans la grammaire s'il n'incarne pas au moins 8 des 15 propriétés de manière forte.

**R12 — Détection des red lines INFUSE** (mécanisme de blocage automatique) :
- Pas de gamification
- Pas d'extraction territoires indigènes sans consultation elders
- Pas de profilage démographique caché
- Pas de matching d'âmes (Tinder spirituel)
- Pas d'IA qui parle comme une figure / un rêve / un oracle
- Pas de promesses prophétiques ("tu es à un turning point", "tu es spécial")
- Pas de freemium avec feature gates oppressives
- Pas de partage data tiers, pas d'analytics extracteurs
- Pas de génération de contes par IA
- Pas de Lat/Long stocké en clair en V1

Si un pattern viole une de ces lignes : rejeté **automatiquement**. Pas d'exception.

### §4.2 Grille des 15 propriétés Alexander (test descriptif)

À chaque pattern proposé, poser les 15 questions. **8+ "oui forts" requis pour validation.**

1. **Levels of Scale** — kairos s'imbrique dans journal, qui s'imbrique dans cercle, qui s'imbrique dans Anima Mundi. Test : *"depuis ce screen, peux-tu sentir l'échelle au-dessus et l'échelle en-dessous ?"*
2. **Strong Centers** — Journal de Vie = centre fort principal. Kairos = secondaire. Figure = tertiaire. Test : *"y a-t-il un centre clair où l'œil revient ?"*
3. **Boundaries** — moment de capture ritualisé (geste d'entrée), encadré (ancrage 30s), bordé (latence rituelle). La limite est une **épaisseur**, pas un mur.
4. **Alternating Repetition** — retours saisonniers, retours de figures avec variation, retours de motifs. Pas streak (mécanique), pas chaos (rien).
5. **Positive Space** — l'écran d'accueil n'est pas "le journal + des cards" — c'est un espace conçu où le silence (champ vide) a une fonction propre.
6. **Good Shape** — bouton de capture = forme satisfaisante (cercle pulsant, porte, coupe), pas rectangle générique iOS.
7. **Local Symmetries** — micro-équilibres dans chaque zone du screen, mais pas de grille uniforme globale.
8. **Deep Interlock & Ambiguity** — un kairos déposé dans le journal s'imbrique dans le récit, on peut le toucher, le voir s'éclairer en lisant la phrase d'à côté. Pas LEGO séparable.
9. **Contrast** — mode nuit (Grimoire Lapis) vs jour (rare moment dawn). Le silence par défaut vs la révélation rare et chargée. Polarités vives, pas gradient mou.
10. **Gradients** — la profondeur de la pratique s'épaissit graduellement (P-Zéro). Pas de modes débutant/expert.
11. **Roughness** — la voix de l'IA n'est jamais parfaitement lisse. Elle hésite. Elle parfois se tait. Elle peut faire une suggestion sciemment fausse pour rappeler qu'elle n'est pas oracle.
12. **Echoes** — motif visuel du kairos déposé (cercle pulsant, glyphe diamant) se retrouve, en plus discret, dans le marqueur de figure, dans la pulsation du compas saisonnier, dans le fond du journal de vie.
13. **The Void** — l'app peut se taire des jours entiers. Aucun écho prophétique pushé. Aucune notification. Le user revient quand il veut.
14. **Simplicity & Inner Calm** — P-Zéro. Plafond de complexité backend infini, surface qui respire.
15. **Not-Separateness** — un rêve déposé n'est pas isolé — il se relie au journal de vie, aux figures déjà rencontrées, à un conte sous-forêt, au cercle, sans rupture. L'app est tissée à la vie du user, pas une bulle.

### §4.3 — Patterns émergents R1 démontrés (compositions vivantes)

> R1 (Renforcement mutuel — centering) prédit que quand deux patterns primitifs se rencontrent, ils se renforcent mutuellement. Voici 5 compositions émergentes documentées 2026-04-24, où les patterns racines composent des **patterns plus larges** sans nouveau primitif. Ces patterns émergents ne s'ajoutent pas à la grammaire — ils en démontrent la fertilité.

**SEDIMENTATION_QUOTIDIENNE = CAPTURE_MINIMALE + LATENCE_RITUELLE**
La capture est instantanée (1 geste), mais le sens **se sédimente** dans le temps cosmologique de l'app (24h pour un rêve, lune pour les récurrences, saison pour les saisonniers). Ce qui semble plat à la capture devient stratifié à la lecture rétrospective. La sédimentation est le résultat du combinaison ; ce n'est pas une feature séparée.

**MEMOIRE_VIVANTE = INFINITE_ARCHIVE + ALGORITHMIC_WEIGHT_DECAY**
Tous les kairos persistent (Tim a tranché 2026-04-24 : Seth/Moss/Aboriginal priment sur Hillman-Lethe). Mais le poids des kairos dans les algorithmes de matching et d'écho **décroît exponentiellement** avec le temps (sauf re-validation user via revisit ou marquage). Résultat : une archive infinie qui reste **vivante**, où le passé respire mais ne sature pas. L'utilisateur ne perd jamais un rêve, et l'app ne devient jamais musée.

**GESTE_UNIQUE_AVEC_ECHO_DIFFERE = CAPTURE_MINIMALE + SYMBOLIC_RESONANCE_TYPOLOGY + LATENCE_RITUELLE**
Le user fait UN seul geste (déposer un kairos). En arrière-plan, le pipeline IA 8 phases async tourne pendant ~30-50s sans jamais imposer sa présence. L'écho mûrit dans la latence rituelle 24h+, jusqu'à ce que la révélation soit prête. Le user voit "kairos déposé" en <2s, l'enrichissement arrive **plus tard, comme un retour de marée**. Le geste reste un, l'enrichissement est multi.

**ANIMA_MUNDI_SANS_PANOPTICON = ECHELLE_FRACTALE + SYMBOLIC_RESONANCE_TYPOLOGY + PRIVACY_BY_ARCHITECTURE**
Les patterns détectés à l'échelle individuelle (Types 1-16) s'instancient à l'échelle Cercle puis Anima Mundi **sans nouveau pattern primitif**. R8 (échelle imbriquée fractale) est honoré : la même grammaire opère aux trois échelles. Ce qui change est la **privacy contraignante** : k-anonymity ≥ 100 stricte au global, k-anonymity ≥ 3 au cercle, opt-in granulaire par kairos × par cercle / global, pipelines architecturalement séparés (les agrégats Anima Mundi ne nourrissent JAMAIS le pipeline individuel — interdit absolu pour empêcher tout panopticon). Le collectif voit, mais ne profile pas.

**DIALOGUE_RITUEL_ACTIVE_DREAMING = FIGURE_AS_OTHER + ANTI_VENTRILOQUIE + OPEN_QUESTION_NOT_INTERPRETATION**
Le dialogue avec une figure (Active Dreaming, opt-in, jamais en premier mouvement post-trauma) tient sa qualité initiatique précisément parce que l'IA **ne joue pas la figure**. Le user parle ; l'app demande "que te répond-elle ? imagine, écris" ; le user écrit la réponse imaginée ; l'app archive. La figure reste un autre (Buber I-thou). Le rituel est tenu par trois patterns qui se renforcent — sans aucun nouveau primitif.

Ces 5 patterns émergents valident la grammaire : elle génère sans avoir besoin d'être étendue à chaque nouveau besoin. Quand un nouveau besoin apparaît, **chercher d'abord** quelle composition de primitifs y répond. N'ajouter un primitif que si vraiment irréductible.

---

## §5 — Système visuel intégré

### §5.1 Posture visuelle

Dream App ne porte pas un "design system". Elle porte **une atmosphère vivante** au sens strict de Zumthor : un corps numérique cohérent, ancré **dark-first** à la Tanizaki, tissé matter-by-matter à la Albers, rythmé par la respiration corporelle de Pallasmaa. La qualité visée est la **Q.W.A.N. d'Alexander** : on ne la prouve pas, on la sent — quand l'app respire comme un lieu, pas comme un produit.

Dark-first n'est pas un choix de mode mais une **posture ontologique** : la nuit est le sol de l'app, pas son thème. Tanizaki : *"darkness is a pregnancy of tiny particles, each luminous as a rainbow."*

### §5.2 Palette dark-first oklch (7 valeurs de base)

| Token | oklch | hex approx | Usage |
|---|---|---|---|
| `night-floor` | `oklch(0.12 0.012 280)` | `#0E0F14` | Fond global. Jamais pur noir |
| `night-warm` | `oklch(0.16 0.015 60)` | `#15130F` | Fond intime, capture, lecture profonde |
| `ash-deep` | `oklch(0.22 0.008 280)` | `#1F2025` | Strates structurelles, séparateurs |
| `ash-mid` | `oklch(0.34 0.010 60)` | `#363430` | UI passive, métadonnées |
| `ash-light` | `oklch(0.52 0.012 60)` | `#5C5854` | Texte secondaire |
| `bone` | `oklch(0.78 0.015 70)` | `#C4B9AD` | Texte principal. Jamais pur blanc — couleur de l'os patiné |
| `embryonic` | `oklch(0.92 0.008 80)` | `#EAE3D8` | Réservé titres-seuils & révélations rares (< 5% surface) |

**Pas de pur `#000` ni de pur `#FFF`.** Les deux trahissent.

### §5.3 Accents par dimension (matter-couleurs, pas couleurs sémantiques)

| Dimension | Matter-couleur | oklch | Caractère |
|---|---|---|---|
| D1 — logique associative | `paper-warm` | `oklch(0.62 0.045 70)` | Beige patiné mat — le carnet |
| D2 — échos inverses | `stone-cool` | `oklch(0.55 0.025 230)` | Pierre humide — l'envers |
| D3 — prophétique temporel | `silk-gold` | `oklch(0.70 0.080 80)` | Or voilé, jamais brillant |
| D4 — complétion | `clay-earth` | `oklch(0.50 0.060 50)` | Terre cuite légère |
| D5 — root dreams | `obsidian-deep` | `oklch(0.28 0.030 290)` | Profondeur où les autres flottent |
| D6 — intensité numineuse | `ember-live` | `oklch(0.65 0.140 40)` | Incandescence interne — seule couleur "vive", utilisée rarement |
| D7 — multilingue | `bone` | `oklch(0.78 0.015 70)` | Neutralité du dictionnaire vivant |

Aucun accent saturé > 0.14 chroma. Les accents existent en relation, pas isolés.

### §5.4 États sémantiques (anti-web-standard)

**Zéro rouge web, zéro vert "succès".** Hillman : la "réussite" et "l'échec" sont des catégories de Hercules.

| État | Token | Logique |
|---|---|---|
| Présence (≈ succès) | `ember-soft` | Une braise, pas un trophée |
| Friction (≈ alerte) | `silk-dim` | Voile d'attention, pas alarme |
| Empêchement (≈ erreur) | `stone-veiled` | Pierre qui résiste — neutre, pas dramatique |
| Présence d'un autre (info) | `bone` | Discret, le bone-text suffit |

### §5.5 Typographie (3 familles, 6 niveaux)

**Décision Tim** (à confirmer s'il préfère les versions premium) : **EB Garamond** (gratuit, Google Fonts) + **Inter** (gratuit, variable, multilingue exhaustif) + **JetBrains Mono** (gratuit). Migration possible vers GT Sectra + Söhne si Dream lève.

Hiérarchie 6 niveaux, base 16px, ratio modulaire **1.250 (major third)** :

| Niveau | Taille | Line-height | Famille | Usage |
|---|---|---|---|---|
| H1 — Seuil | 39.06px | 1.15 | EB Garamond Light | Titres écran majeurs (1/écran max) |
| H2 — Section | 31.25px | 1.20 | EB Garamond Regular | Section secondaire |
| H3 — Lecture | 25px | 1.30 | EB Garamond Regular | Citation, dream text |
| H4 — Repère | 20px | 1.40 | Inter Medium | Sous-section UI |
| Body | 16px | 1.55 | Inter Regular | Texte courant |
| Meta | 12.8px | 1.40 | Inter Light / JetBrains Mono | Timestamps, metadata |

**Mesure idéale ligne** : 50-65 caractères mobile.
**Full-justify interdit** (rivières blanches déchirent le textus). Hard rag par défaut.
**Tracking** : -0.5% sur titres serif, 0% sur sans, +5% sur meta uppercase.

**Curseur ritualisation** :
- Boutons / inputs : strictement Inter 16px, line-height 1.4. UX standard, pas de ritualisation sur actions courantes.
- Moments-seuils (entrée capture, révélation Big Dream candidat, dialogue figure) : EB Garamond italic, line-height 1.6, tracking +0.5%. Là, on ritualise.

### §5.6 Espace, rythme, grille 8pt

Échelle d'espacement : `4, 8, 16, 24, 40, 64, 104, 168` (proche Fibonacci, multiples de 8 sauf le 4 marginal).

- **Marges latérales mobile** : 24px min, 32px confortable. Jamais < 16px.
- **Marges latérales desktop** : container max-width 720px, marges automatiques.
- **Padding cards** : 24px standard, 40px pour cards "sanctuaire" (dream detail, figure dialogue).
- **Vertical entre sections** : 64px minimum entre blocs majeurs. Le ma se produit ici.
- **Ratio contenu/vide visé** : 40-55% contenu, 45-60% vide. Inverse de l'app productivité standard (85/15).

**Densité — anti-dashboard** :
- Maximum **3 entités primaires par écran** (1 idéal).
- Maximum **1 CTA primaire par écran**.
- Aucune liste > 7 items sans groupement ou découpe.
- Aucun graphique chiffré sauf strict besoin diagnostique. Préférer paysage, constellation, strate.

### §5.7 8 matter tokens (langage primaire)

Albers : *"matière is to tactility what color is to vision."* Les matter tokens sont les **langues primaires** de l'app.

| Token | Imaginale Bachelard | Pattern | Use cases |
|---|---|---|---|
| **`linen`** | Eau-air composée | Perlin noise multi-octave (3 oct), wavelength ~80px, amplitude 0.06 | Cards neutres, empty states, fond capture vocale |
| **`silk`** | Air, fluidité | Flowfield noise lent (40s/cycle), reflet voilé doré-cool | Transitions, moments prophétiques (D3), highlights subtils |
| **`stone`** | Terre Bachelard "preposition IN" | Cellular noise (Worley), wavelength ~120px, amplitude 0.10 | Fondations, séparateurs structurels, Card.Figure type `consciousness_cousin` |
| **`paper`** | Eau séchée, mat | Fiber noise (long traits courbes) + grain sparse | Texte long, journal de vie, dream text |
| **`ash`** | Air-feu mort, fin | Gaussian noise très fin (single-pixel grain), amplitude 0.03 | Fond global non-actif, état passif, vide habité |
| **`water`** | Eau Bachelard pure | Sinusoidal flowfield + caustics génératives (60s/cycle) | Interactifs réactifs, ondulations temporelles, fond Collectif |
| **`ember`** | Feu Bachelard, incandescence intérieure | Radial gradient noise + flicker très lent (8-12s) | Pastille.Numinosity (4-5), nœuds vivants, badge.OracleCorps actif |
| **`earth`** | Terre Bachelard intériorité | Granular noise (gros grain irrégulier) + variation tonale | Card.Dream `resolved`, root dreams (D5), strates ligne de vie |

**Distinction stone vs earth** : stone = pierre extérieure, ancrage, verticale (mur, fondation). Earth = intériorité, sédiment, horizontale (sol, racine).

**Implementation** : SVG noise filters réutilisables avec `<feTurbulence>` paramétrables. CSS variable `--matter-linen-pattern: url('#noise-linen')`. Component React `<NoiseLayer matter="linen" intensity={0.6} parallax={true} />`. Performance : pré-générer en PNG WebP optimisés mobile (sub-50KB chacun), SVG filters fallback desktop.

### §5.8 Compatibilité matter (règles d'association)

- `linen + paper` : **oui** (les deux contemplatifs, mêmes tonalités tactiles).
- `water + ember` : **tension productive** (eau et feu, jamais ensemble dans le même cluster mais peuvent dialoguer entre cards adjacentes).
- `stone + silk` : **dissonance interdite** (la pierre et la soie ne se touchent pas).
- `ash` : **fond universel**, compatible avec tous (c'est le sol).
- `earth` : compatible avec linen, paper, ember (matières chaudes intérieures).
- `obsidian + silk-gold` : autorisé en moments rares (D3 prophétique sur fond D5 root).

---

## §6 — Motion, haptique, son

### §6.1 Motion : 3 tempi, courbes custom

Bresson : *"images release their phosphorus only in aggregating."* Une transition n'est pas un effet — c'est le **temps de tenue** entre deux états où l'œil compose le sens. **Ne jamais transitionner sous 200ms**, sauf micro-feedback.

```css
--tempo-instant: 100ms;        /* feedback tactile, hover, focus */
--tempo-tisse: 380ms;          /* transitions standard, sheet, modal */
--tempo-ceremoniel: 920ms;     /* passages rituels Van Gennep */

--ease-respire: cubic-bezier(0.32, 0.04, 0.25, 1);    /* attaque douce, sortie tenue */
--ease-tenue: cubic-bezier(0.45, 0, 0.15, 1);          /* Bresson : tenue de l'image */
--ease-rituel: cubic-bezier(0.7, 0.0, 0.3, 1);         /* lent au milieu, contemplative */
```

**Aucun `linear`, aucun `ease` par défaut.** Chaque mouvement a son nom et son poids.

### §6.2 Van Gennep tripartite (transitions entre écrans majeurs)

| Phase | Durée | Comportement visuel |
|---|---|---|
| **Séparation** | 200ms | Écran courant relâche : opacity 1 → 0.3, scale 1 → 0.98, ease-out doux |
| **Marge** | 300-500ms | Plage `night-floor` ou bone subtile avec **un seul élément maintenu** (logo, glyph, ou rien). C'est le ma. |
| **Agrégation** | 400ms | Nouvel écran se compose : matter token monte d'abord (linen, paper, stone selon contexte), puis contenu, puis interactif |

**Total transition rituelle** : ~1000ms (cérémoniel). Réservé aux passages : capture → détail / dream → figure / collectif → seuil.

### §6.3 Loading : patience contemplative

**Pas de spinner. Jamais.**

3 patterns :
- **`instant_breath`** (< 300ms) : aucun visuel, juste opacity légère sur le bouton.
- **`tissé`** (300-1500ms) : **single thread** — une ligne de matter (linen) qui s'étire lentement gauche-droite, vitesse organique (~1.2s par traversée). 1 ligne, pas 3.
- **`cérémoniel`** (> 1500ms — analyse Forêt, génération échos) : **constellation lente** — 3 à 5 points de bone qui apparaissent progressivement et tracent une figure faible. Aucun pourcentage. Optionnel : un mot doux qui change toutes les 4s : *"écoute en cours… le rêve respire… les liens se tissent…"*.

### §6.4 Haptique : 3 patterns max

| Pattern | Spec iOS / Android | Usage |
|---|---|---|
| **`acknowledge`** | iOS `.light` ~10ms / Android `EFFECT_TICK` 5-10ms | Confirmation tap : capture démarrée, écho ouvert, opt-in toggled |
| **`reveal`** | iOS triple `.soft` espacés 80ms / Android pattern `[0,30,80,30,80,30]` | Révélation : Big Dream candidat détecté, écho mûr, figure émergente |
| **`numinous`** | iOS `.heavy` puis `.soft` puis pause 200ms puis `.medium` / Android `[0,80,200,40,200,60]` | Réservé : dialogue figure ouvert, lecture Big Dream collectif. **Désactivable.** |

Pallasmaa : *"the door handle is the handshake of the building."* Chaque vibration est une poignée de main.

### §6.5 Son : austérité radicale

Bresson : *"no music as accompaniment, support or reinforcement. No music at all."*

- **Aucun son UI par défaut.** Tap silencieux.
- **Aucune notification sonore** push (vibration uniquement, désactivable).
- **Aucun jingle**, aucune signature sonore au lancement.

**Mode capture longue / méditation — `matter_breathing` (opt-in)** :
- Drone très bas, basé sur respiration humaine ralentie + frottement de tissu/papier.
- Plage 60-200 Hz dominante, harmoniques discrètes jusqu'à 800 Hz.
- Volume cible : -32 LUFS (très bas, jamais dominant).
- Loop 4-6 minutes.
- **Opt-in explicite** au début de chaque session, jamais par défaut.

**Anti-notifications agressives** :
- Ton doux, jamais impératif. *"Un écho semble se former"* plutôt que *"Nouveau insight!"*.
- Max 1 push notif / jour, sauf événements rares (Big Dream candidat révélé).
- Désactivable par catégorie (échos / figures / Big Dreams / collectif).
- Aucune push entre 22h et 8h locale (rêver demande nuit). Configurable.

---

## §7 — Écrans canoniques

Liste **non-exhaustive** des écrans primaires. Chaque écran est généré par les patterns primitifs concernés. Ce n'est pas un catalogue figé.

### §7.1 Home — Journal de Vie LUMINEUX (le JOUR — révélation 2026-04-25)

**Patterns dominants** : JOURNAL_DE_VIE_SUBSTRAT + JOURNAL_DAY_DASHBOARD + KAIROS_WISDOM_SUMMON + AUTO_CATEGORIZATION.

**Position dans l'app** : c'est le PREMIER écran de Dream App. Le user ouvre l'app → il arrive **dans sa vie de jour**. Pas dans la nuit. Pas dans les rêves. Dans **ce qu'il vit maintenant**, dans la lumière brute du quotidien éveillé.

**Inversion ontologique JOUR / NUIT (Bible §3.1.bis)** : tout le reste de l'app vit en dark-first parce que les kairos viennent du Framework 2 (sommeil, seuil, profond). Le Journal de Vie vit en **lumière diurne** parce que c'est la vie éveillée nue. Quand le user passe du Journal au reste de l'app, il **traverse un seuil** (Van Gennep tripartite).

#### Palette JOUR (nouveau, complète §5.2)

| Token | oklch | hex approx | Usage |
|---|---|---|---|
| `day-paper` | `oklch(0.92 0.018 75)` | `#EBE2D2` | Fond global Journal de Vie. Papier patiné chaud, jamais blanc cru |
| `day-linen` | `oklch(0.88 0.022 70)` | `#DFD3BF` | Cards d'entrée, sections |
| `day-clay-warm` | `oklch(0.78 0.045 60)` | `#C9B098` | Section headers, accents chaleureux |
| `day-bone-warm` | `oklch(0.65 0.025 65)` | `#9F8E7C` | Texte principal sur fond papier |
| `day-ash-soft` | `oklch(0.50 0.015 65)` | `#776E62` | Texte secondaire, méta |
| `day-sun-low` | `oklch(0.72 0.090 75)` | `#C5A672` | Accents solaires (boutons CTA, glyphe appel sagesse) |
| `day-shadow` | `oklch(0.40 0.020 280)` | `#4A4D55` | Ombres douces, séparateurs subtils |

**Pas de pur `#FFF`**. Le papier patiné honore Tanizaki côté jour aussi : *"darkness is a pregnancy of tiny particles"* — le **jour est une pregnancy de papier vieilli**.

#### Composition de l'écran

**Header discret** :
- Date du jour en EB Garamond italic 14px, `day-ash-soft` : *"vendredi 25 avril, lune décroissante"*
- Glyphe lune dans coin haut-droit, accès NUIT (transition Van Gennep vers le reste de l'app)
- Pas de logo, pas de notification badge

**Centre — Champ de dépôt libre (geste central)** :
- Grand champ de saisie type *"Que vis-tu, là, maintenant ?"* (placeholder qui change subtilement chaque ouverture : *"Qu'est-ce qui se demande aujourd'hui ?"*, *"Qu'est-ce qui te traverse ?"*, *"Que veux-tu déposer ?"*)
- EB Garamond italic 18px sur `day-paper`
- Bouton voix discret à droite (icône micro `day-sun-low`)
- Bouton "déposer" sobre en bas (`day-clay-warm`)
- Aucune pré-catégorisation visible. Le user dépose, l'app range en silence (Sonnet routing async).

**Sections vivantes (sous le champ)** :
- Liste de sections par domaine de vie, **se peuplent automatiquement** au fil des dépôts (auto-categorization Sonnet en silence)
- Categories canoniques V1 :
  - Travail & vocation
  - Relations (amour / famille / amis / collègues / rencontres) — sub-sections automatiques quand densité > 3
  - Corps & santé
  - Passions & création
  - Argent & matériel
  - Spiritualité & sens
  - Transitions & seuils
- Chaque section affiche : nom, glyphe sobre, count d'entrées (chiffre arrondi *"≈12"*, jamais précis), dernière entrée preview (1 ligne)
- Tap section → drill-down dans la section (liste chronologique inversée des entrées + bouton "appel sagesse des kairos" sur la section globale)

**Boutons "appel sagesse des kairos" (geste secondaire CENTRAL)** :
- Sur chaque entrée individuelle : icône constellation discrète à droite
- Sur chaque section globale : bouton "que disent les kairos sur cette section ?"
- Tap → animation `cérémoniel` 5-10s (constellation lente) → polyphonie courte 100-200 mots IA narratrice + FELT_SHIFT_GATE + AHA_CAPTURE
- Backend : nouvelle route `/api/journal/summon-kairos-wisdom`
- Limite douce : 3 appels/jour pour préserver le rituel (sinon → addiction-light)

**Suggestions de germes (opt-in, jamais imposé)** :
- Une fois par jour : invitation douce en bas *"il y a 3 mois, tu déposais une question sur quitter ton job. Veux-tu reprendre cette question ?"*
- Pas une notification — juste une présence discrète dans le scroll

**Sortie vers la NUIT** :
- Glyphe lune coin haut-droit (toujours accessible)
- + sur chaque entrée Journal : bouton sobre "déposer un kairos lié" → transition Van Gennep → fond se transforme NUIT → écran Capture, kairos auto-tagué comme lié à cette entrée

**Densité** : 1 entité primaire (le champ de dépôt). Sections en grille verticale aérée. ~50% vide.

**Anti-pattern absolu** :
- Pas de stats, pas de "tu as déposé 47 entrées ce mois", pas de "top 3 thèmes", pas de mood tracking
- Pas de gamification (streak, badge, points)
- Pas de notifs push
- Pas de partage social externe
- Pas d'analyse psychologique sauvage ("tu as un attachment style X")
- Pas de catégorisation rigide (le user peut renommer/créer/fusionner sections)

#### Backend nouveau

- Table `life_journal_entries` (id, user_id, raw_text, voice_url?, created_at, category, sub_category, embedding, somatic_markers, sentiment_valence, numinosity_score?)
- Table `life_journal_categories` (per-user custom + canonicals)
- Route `POST /api/journal/entries` (créer entrée → trigger categorize async)
- Route `POST /api/journal/categorize` (Sonnet routing → category + sub_category)
- Route `POST /api/journal/summon-kairos-wisdom` (entry_id OU section → polyphonie 100-200 mots tissée depuis kairos résonnants)

### §7.1.bis JournalSectionDrillDown — drill-down chronologique d'un domaine de vie (ajouté 2026-04-25)

**Patterns dominants** : JOURNAL_DE_VIE_SUBSTRAT + KAIROS_WISDOM_SUMMON + AUTO_CATEGORIZATION + USER_FIRST_READING.

**Position** : composant secondaire accessible depuis le tap sur une section du Journal de Vie (§7.1). Route applicative `journal-section` avec ctx = section sélectionnée. Le user qui veut **descendre dans un domaine** (ex: "Travail & vocation") arrive ici. Pas un écran principal — un écran de profondeur consultable à la demande.

**Composition** :

- **Header lumineux retour** : flèche back coin haut-gauche (return vers Home Journal de Vie) + nom de la section en H3 EB Garamond italic centré + count d'entrées arrondi (*"≈14 dépôts"*).
- **Palette** : JOUR (`day-paper` fond, `day-linen` cards, `day-clay-warm` accents, `day-bone-warm` texte). Cohérence stricte avec §7.1.
- **Bouton ✦ "appel sagesse" proéminent sur la section globale** (geste secondaire CENTRAL) :
  - Visible en haut, juste sous le header
  - Tap → tisse polyphonie sur **tout le domaine** (toutes les entrées de la section comme contexte → kairos résonnants détectés → polyphonie 100-200 mots Sonnet)
  - Backend : `POST /api/journal/summon-kairos-wisdom` avec `category` (et `sub_category` si applicable)
  - Animation `cérémoniel` 5-10s → modal polyphonie + FELT_SHIFT_GATE + AHA_CAPTURE
- **Sub-categories tabs (uniquement si section = `relations`)** :
  - 5 tabs horizontaux : *toutes / amour / famille / amis / collègues / rencontres*
  - Tap tab → re-fetch entries filtrées par `sub_category`
  - Le bouton ✦ section globale pickup la sub_category active si différente de "all" → polyphonie sur sub-domaine
- **Liste chronologique inversée des entrées** (les plus récentes en haut) :
  - Chaque card d'entrée :
    - **Date relative** en haut (*"il y a 3 jours"*, *"hier"*, *"il y a 2 semaines"*) — `day-ash-soft` 12px Inter
    - **Sub_category badge** discret à côté de la date (si présente) — chip neutre 11px
    - **Texte preview** 2-3 lignes EB Garamond 16px sur `day-paper`
    - **Actions row** en bas de card :
      - Bouton "déposer un kairos lié" (icône lune ☾ discret) → navigate Capture, kairos pré-tagué comme `linked_journal_entry_id`
      - Bouton **✦ SummonButton individuel** (icône constellation discrète à droite) → polyphonie courte sur **cette entrée seule** (pas le domaine entier)
  - Cards séparées par `day-shadow` très subtile, jamais de bordure dure
- **Bouton "déposer dans cette section" rapide** (FAB ou inline en bas de liste) :
  - Tap → navigate Home (§7.1) avec champ de dépôt pré-focus + `category` pré-remplie + `sub_category` pré-remplie si applicable
  - Aucune friction — on revient au geste central

**Densité** : 1 entité primaire (la liste). Header + tabs + bouton sagesse global = 3 zones max au-dessus du scroll. Cards aérées, séparation douce. ~40% vide.

**Anti-pattern** :
- Pas de pagination (scroll infini, pas de "page 2")
- Pas de filtre temporel (chronologique inversé pur, le user remonte)
- Pas de stats domaine ("tu as déposé +30% ce mois")
- Pas de tri par autre chose que la date
- Pas de bulk actions (pas de sélection multiple, pas de delete bulk)

**Implémentation actuelle** : `public/v12/screens-journal-jour.jsx` — composants `JournalSectionDrillDown` + `SummonButton` exposés en `window.JournalSectionDrillDown` et `window.SummonButton`. Backend route `/api/journal/entries?category=X&sub_category=Y` + `/api/journal/summon-kairos-wisdom`.

### §7.1.bis Capture — déposer un KAIROS (geste UNIQUE secondaire)

### §7.2 Capture — déposer un kairos (geste UNIQUE)

**Pattern dominant** : KAIROS_DEPOSIT.

**Flow** :
1. User tape sur **Déposer** depuis n'importe quel écran.
2. Écran transition Van Gennep tripartite (~1000ms).
3. Arrivée : SOMATIC_GATE court — *"3 respirations. Sens tes pieds. Tu es là."* (~30s, opt-out per session).
4. Champ de capture unique. Voice + texte. Fond `night-warm`, typo Inter 16px sur matter `linen`.
5. Aucune demande de "type" avant capture. Le user dépose.
6. Sauvegarde immédiate. RITUAL_LATENCY : *"Le kairos est déposé. Il dort 24h avant que les échos ne murmurent."*
7. Possibilité explicite : marquer comme **"à laisser dormir"** (DREAM_THAT_REFUSES_INTERPRETATION émergent) — aucune Forêt, aucun écho, aucune figure dialogue.
8. Suggestion type **après** (jamais avant) : *"ce dépôt sent un rêve nocturne / un sidewalk / une rêverie / une synchronicité… ou autre chose ?"* — user confirme ou ignore.

### §7.2.bis Capture — phase POST (RITUAL_LATENCY refondue 2026-04-25)

**Patterns dominants** : RITUAL_LATENCY + SIX_KAIROS_TYPES_AS_VOICES + DREAM_THAT_REFUSES_INTERPRETATION + JOURNAL_DE_VIE_SUBSTRAT (cross-pollination).

**Position** : phase `post` qui suit immédiatement le success du dépôt kairos en §7.2. C'est l'instant **après le geste**. La latence rituelle s'incarne ici : pas d'écho immédiat, pas de Forêt brûlante. **Le kairos dort.**

**Composition** :

- **Halo ember radial subtil en background** (matter `ember` motion, opacity ~70%) : `radial-gradient(ellipse at 50% 38%, color-mix(in oklch, var(--ember-live) 14%, transparent), transparent 60%)`. Une chaleur basse, contemplative.
- **Texte poétique** centré, 18px italic EB Garamond, `var(--bone)` (avec deuxième ligne `var(--ash-light)` opacity 0.85) :
  > *"Le kairos est déposé.*
  > *Il dort 24 h avant que les échos ne murmurent."*
- **Divider doux** opacity 50% séparant le texte poétique des chips.
- **Suggestion type émergente — 7 chips** (PATCH live `kairos_type` via `PATCH /api/kairos/[id]` whitelist élargie 2026-04-25) :
  - `reve` (rêve nocturne) — sélectionné par défaut
  - `signe` (signe / synchronicité externe)
  - `reverie` (rêverie diurne)
  - `hypnagogie` (seuil sommeil/éveil)
  - `synchronicite` (synchronicité)
  - `frisson` (frisson somatique)
  - `note` (note de jour générique)
  - Tap chip → s'allume `silk-gold` (border + texte + background `color-mix(in oklch, var(--silk-gold) 8%, transparent)`)
  - Update silencieux backend (pas de toast, pas de confirmation visuelle bruyante)
  - Texte d'invite italic 14px : *"Ce dépôt sent un rêve nocturne, un signe, une rêverie, une synchronicité… ou autre chose ?"*
- **Divider doux** opacity 50% séparant chips et actions.
- **3 actions douces en bas** (jamais imposées, jamais ordonnées en priorité visuelle), stack vertical centré max-width 360px :
  1. **"voir mon kairos"** (btn-ghost) → `go("kairos", createdId)` → navigate KairosDetail (§7.3)
  2. **"déposer une note de Journal de Vie liée"** (btn-ghost) → pose `window.__dreamJournalLinkedHint = { linked_kairos_id, source_text, source_type, createdAt }` (TTL 5min) puis `go("home")` → DeposerLibre consume le hint et pré-remplit le textarea avec snippet du kairos + badge **"☾ note de jour reliée à un kairos déposé"** + bouton "détacher" pour reset le hint avant submit
  3. **"laisser dormir →"** (btn-text discret) → `go("home")` sans aucune action de suite — incarne **DREAM_THAT_REFUSES_INTERPRETATION**. C'est la sortie noble : le kairos est déposé, point. Aucun écho ne sera tissé tant que le user ne le réveillera pas.

**Tempo entrée séquentiel** (motion `tissé` 380ms par étape) :
- t=0 : background `night-warm` apparaît
- t+200ms : halo ember fade-in
- t+400ms : texte poétique fade + slide-up subtil
- t+600ms : chips fade-in en cascade horizontale
- t+800ms : 3 actions fade-in stack vertical

**Anti-patterns absolus** :
- Pas de "merci !" / "bien joué !" / "+1 dépôt"
- Pas d'animation de validation type checkmark vert
- Pas de notification système ("kairos déposé avec succès")
- Pas de countdown visible des 24h ("dort encore 23h 47min") — la latence est rituelle, pas chronométrique
- Pas de suggestion d'action immédiate type "demander à la Forêt maintenant" — la Forêt ne répond JAMAIS sur un kairos qui vient d'être déposé (RITUAL_LATENCY R1 absolu)
- Pas de partage social après dépôt

**Implémentation actuelle** : `public/v12/screens-core.jsx` — composant `Capture`, branche `phase === "post"`. Backend whitelist `kairos_type` ajoutée 2026-04-25 dans `/api/kairos/[id]` PATCH route (cf. 4_LOG.md).

### §7.3 Détail kairos — le dépôt qui dort, qui s'éveille à la demande

**Pattern dominant** : KAIROS_DEPOSIT + USER_FIRST_READING + FELT_SHIFT_GATE + ECHO_REVELATION_RITUAL + AHA_CAPTURE.

**Composition** :
- Fond `night-warm` + matter `paper`.
- Le texte du kairos en H3 EB Garamond, plein écran, généreux.
- En bas, discret : 4 actions possibles (jamais imposées) :
  - **Que vois-tu ?** → ouvre USER_FIRST_READING (champ libre, le user offre sa lecture).
  - **Demander à la Forêt** → après USER_FIRST_READING, propose 3 angles avec sources nommées (POLYPHONIE_ONTOLOGIQUEMENT_HONNETE).
  - **Échos depuis le passé** (icône onde) → entrée kairos n°1 vers PROPHETIC_AWAKENING. Affiche les kairos passés qui résonnent avec celui-ci (Type 7 + autres types détectés). Sur demande, jamais en push. Toujours après que le user ait au moins lu son kairos.
  - **Brûler** → USER_RITUAL_BURN (geste rituel ~30s, suppression cryptographique, pas d'undo).
- **AHA_CAPTURE** systématique à la fin de chaque lecture proposée (Forêt, écho, conte, polyphonie) : micro-question discrète *"où est ton aha ?"* avec 3 niveaux (résonne fort / peut-être / non) + zone texte libre + option "autre note". Stocké dans `user_validations`. Pondère lectures futures.
- Marqueurs latéraux discrets si applicable : Big Dream flag (halo `ember-soft` très subtil — NUMINOUS_MARKING), Titanic Dream flag (icône élément), flag rêve "à laisser dormir" (DREAM_THAT_REFUSES_INTERPRETATION).
- Si SATURATION_DETECTOR alerte : message doux *"on note beaucoup en ce moment. Veux-tu prendre un jour silencieux ?"*.
- **Offre douce après 7j de latence rituelle** (si numinosity haute) : *"Tu peux offrir ce kairos à Anima Mundi. Il pourrait y être tenu par d'autres."* — antichambre Anima Mundi (cf. §7.8 Chambre 3). Note : applicable aussi à une note de journal de vie chargée (numinosity sur substrat éveillé).

### §7.4 Forêt FIRST — workflow d'interprétation

**Pattern dominant** : FOREST_ECHO_AFTER_USER + USER_FIRST_READING + FELT_SHIFT_GATE.

**Flow strict en 5 temps** :
1. User a déjà offert sa lecture (USER_FIRST_READING).
2. Forêt query : fetch sens symbolique profond depuis 326 livres digérés.
3. App propose **3 angles distincts** (jamais 1, jamais 10), avec sources nommées en hypothèse, jamais en autorité. Cadrage explicite : *"ces voix ne disent pas ton rêve, elles le touchent depuis leur angle. Ton corps tranche."*
4. **FELT_SHIFT_GATE** — pause 10-30s, question : *"lequel a fait quelque chose dans ton corps ? gorge / poitrine / ventre / nuque / ailleurs / aucune part."* Option *"rien ne shift — j'attends"* sans pénalité.
5. Si felt-shift confirmé : enrichissement éventuel du lexique personnel. Si pas de shift : la lecture n'est pas mûre, repose dans le noir.

**Composition visuelle** : fond `night-floor`, 3 cards verticales avec matter par dimension (paper / stone / silk selon angle), citations courtes < 15 mots, source nommée en bas de chaque card.

### §7.5 Figure — rencontrer un autre

**Pattern dominant** : FIGURE_AS_OTHER + NARRATION_TENDING.

**Composition** :
- Fond `night-floor` + matter `stone`.
- Au centre : la figure (nommée par le user — pas glyphe IA-généré). Si user n'a pas nommé, l'app demande : *"comment veux-tu nommer cette présence ?"*
- En-dessous : **dialogue tenu par l'app, pas joué par l'app**. Le user parle à la figure (texte ou voix). L'app **ne répond pas comme la figure**. L'app demande : *"que te répond-elle ? imagine, écris."*
- Le user écrit la réponse imaginée. L'app archive.
- Possibilité de **désallier** la figure si elle devient envahissante (RITE_OF_DESALLIANCE_FROM_FIGURE émergent) — geste rituel, suggestion EXIT_TO_HUMAN si souffrance forte.

**Anti-pattern absolu** : l'IA ne parle JAMAIS comme la figure. Red line trauma-safe 14.

### §7.6 Portrait — LETTRE NARRATIVE VIVANTE (refonte 2026-04-25)

**Patterns dominants** : POLYPHONIE_ONTOLOGIQUEMENT_HONNETE + OPEN_QUESTION_NOT_INTERPRETATION + USER_MEANING_LAYER + JOURNAL_NUIT_CROISÉ + DREAM_ASK_CLOSING.

**Refonte** : la version précédente (constellation force-directed + bulles cliquables) ne servait pas P-Inversion — cliquer sur une bulle "eau" affichait juste "eau" en plus gros. Décoration, pas instrument. Tim 2026-04-25 : *"qu'est-ce qu'on veut vraiment ? avoir l'IA qui te donne une vision de ce que tu vis dans ta vie de jour et dans ta vie de nuit + possibilité de croiser les deux."*

**Nouveau Portrait** : page narrative vivante. **Pas dataviz, pas constellation à bulles**. L'IA narratrice écrit une **lettre du moment** sur QUI le user EST en ce moment, ce qui traverse, ce qui se croise entre vie de jour et vie de nuit. La constellation visuelle reste accessible mais en sous-page secondaire pour qui aime visualiser.

#### Composition

**Header** :
- Petit titre EB Garamond italic *"ton portrait — lune décroissante"* (date lune en cours)
- Glyphe constellation discret coin haut-droit (accès sous-page "Voir ma carte")

**3 toggles centraux (vivants, pas décoratifs)** :
- **Vie de jour** (palette lumineuse `day-paper`/`day-clay-warm` injectée sur l'écran) → la lettre parle de tes notes Journal de Vie
- **Vie de nuit** (palette dark-first standard) → la lettre parle de tes kairos
- **Les deux qui se croisent** (palette intermédiaire crépuscule, gradient day → night) → la lettre tisse les deux : où un rêve éclaire une question éveillée, où un signe rime avec une décision en cours. **C'est LE coeur du Portrait — la guidance révélée.**

**4 filtres temporels** : Cette lune / Cette saison / Cette année / Always (mêmes 4 que Anima Mundi pour cohérence).

**Au centre — La Lettre du moment** :
- Texte IA narratrice 200-400 mots en EB Garamond H3 sur matter `paper`/`day-paper` selon toggle
- Phrasé conditionnel obligatoire (POLYPHONIE_ONTOLOGIQUEMENT_HONNETE) : *"on pourrait entendre"*, *"il semble que"*, *"trois fois ce printemps"*, etc.
- Voix Forêt mobilisées en signature discrète bas de lettre (*"voix tissées : Aizenstat, Hyde, Bachelard"*)
- Termine TOUJOURS par UNE dream ask ouverte (OPEN_QUESTION_NOT_INTERPRETATION)
- Régénération possible : bouton sobre *"demander une nouvelle lecture"* (max 1× par jour pour préserver le rituel)

**Sous la lettre — 3 sections vivantes (en prose, pas en bulles)** :

1. **Échos vivants en ce moment** — top 5 résonances prophétiques actives (Type 7), présentées en chuchotement narratif : *"un kairos d'il y a 6 mois résonne avec ta semaine — celui où tu cherchais la maison aux pièces inconnues. Trois éléments rentrent en écho ces 14 derniers jours."* Tap → ouvre KairosDetail du kairos résonnant.

2. **Figures qui reviennent** — 3-5 figures dominantes en prose, **pas en bulles cliquables abstraites** : *"La grand-mère est revenue 4 fois depuis l'équinoxe — toujours dans des pièces sans feu, toujours sachant ton nom. L'enfant qui pleure est apparu 2 fois ce printemps. Tu as parlé à un loup une fois."* Tap sur une figure → drill-down dialogue (FIGURE_AS_OTHER) avec timeline visuelle des apparitions.

3. **Tensions ouvertes** (si détectées) — où des figures opposées tournent, où un motif se transforme : *"Le motif de la chute est en train de se transformer. Il y a un mois, on tombait. Ces deux dernières semaines, on tombe et on est rattrapé."*

**Sous-page accessible** "Voir ma carte" → ConstellationD3 force-directed (gardée pour ceux qui aiment visualiser). N'est PLUS l'écran par défaut.

**Densité** : 1 entité primaire (la lettre). Sections en cascade verticale aérée. Pas de chiffres affichés (numinosity score JAMAIS visible). ~45% vide.

**Anti-patterns absolus** :
- Pas de "résumé du jour" stats
- Pas de chiffres affichés (numinosity, occurrence count, pourcentages)
- Pas de classement de figures
- Pas de "top 5 thèmes" listé en bullets
- Pas d'interprétation directive ("tu es en évitement")
- Pas de bulles-mots-clés mortes (qu'on cliquerait pour voir le mot en plus gros — c'était le problème de la V précédente)

#### Backend nouveau

- Route `POST /api/portrait/narrative-reading` :
  - Input : user_id + toggle (day/night/crossed) + filtre temporel
  - Process : agrège kairos + entries Journal de Vie sur la fenêtre, identifie figures dominantes, motifs récurrents, échos prophétiques actifs, tensions ouvertes via 16 types pattern echoing
  - Output : lettre 200-400 mots Sonnet polyphonique + array `figures_dominantes` + array `echoes_actifs` + array `tensions_ouvertes` (pour les 3 sections sous-jacentes)
  - Cache 24h pour préserver le rituel (1 régénération/jour max user-triggered)

#### Backend invisible V1 (préservé de la version précédente)

Typing Seth (8 types primaires : probable_self, counterpart, reincarnational_self, consciousness_cousin, post_mortem_communication, ego_projection, tradition_figure, image_monde) module silencieusement le ton de la lettre. Pour `unwelcome_intrusion` → garde-fou trauma + propose ressources EXIT_TO_HUMAN. Le user voit la figure, son nom, ses apparitions. **Pas le typing**. V2 mode connaisseur opt-in.

> ⚠️ **Sous-section legacy V0 — déprécié 25/04/26** : la constellation D3 à bulles a été remplacée par la LETTRE narrative décrite plus haut. La constellation visuelle reste accessible en **sous-page** ("portrait-carte") mais n'est plus l'écran principal Portrait. Conservée pour référence historique du modèle initial.

**Composition** :
- Fond `night-floor` + matter `paper` très subtil sur les zones de texte.
- **Visualisation centrale : Constellation vivante force-directed** (react-force-graph ou D3).
  - Noeuds = figures + motifs + symboles chauds (top 30-50 selon `heat_score = recency_decay × log(occurrence_count) × numinosity × affective_intensity`).
  - Taille noeud = récurrence × récence × numinosity.
  - Couleur noeud = type Seth (8 catégories) pour les figures, catégorie matter (eau / pierre / feu / terre / air) pour les motifs. Légende disponible à la demande, jamais imposée.
  - Edges = co-occurrences + transformations détectées via graph layer `kairos_edges`.
  - Layout évolue, jamais figé. Animation **timelapse historique** disponible (slider temps optionnel V1 minimal, sophistiqué V2/V3).
- **Filtres en bas** :
  - **3 toggles** : Onirique / Jour / **Croisé** (révèle les résonances entre rêves nocturnes et notes diurnes — échos prophétiques Type 7, patterns trans-couches).
  - **4 filtres temporels** : Cette lune / Cette saison / Cette année / Always.
- **Section "Échos vivants en ce moment"** (toujours visible si signal actif) : top 5 résonances prophétiques actives (Type 7 PROPHETIC_AWAKENING détecté), présentées en chuchotement, jamais en alerte. Format : *"un kairos d'il y a 6 mois résonne avec ta semaine"* — le user ouvre s'il veut.
- **CTA discret** : *"Demander une lecture"* — déclenche IA narratrice (Sonnet) qui synthétise polyphoniquement (200-400 mots) en mobilisant 3-5 voix Forêt selon le profil du portrait. Phrasé conditionnel obligatoire (POLYPHONIE_ONTOLOGIQUEMENT_HONNETE) : *"à la lumière de Jung, on pourrait entendre..."*. Toujours se termine par UNE dream ask (OPEN_QUESTION_NOT_INTERPRETATION). À la fin : AHA_CAPTURE micro-question.
- **Nudge lunaire doux** (opt-in, default off) : *"le portrait n'a pas reçu de lecture depuis une lune. Veux-tu explorer ce qui s'est tissé ?"* — chuchotement contextuel à l'ouverture du Portrait, jamais push notif.
- **Sélection noeud** → écran détail figure ou détail motif (drill-down) : timeline visuelle, charge évolutive (graph affectif), transformations détectées (LLM compare apparitions consécutives), co-occurrences fréquentes, *"Explorer cette figure"* → mode dialogue (FIGURE_AS_OTHER + DIALOGUE_RITUEL_ACTIVE_DREAMING, opt-in).

**Backend invisible V1** : typing Seth (8 types primaires : probable_self, counterpart, reincarnational_self, consciousness_cousin, post_mortem_communication, ego_projection, tradition_figure, image_monde + 2 secondaires : fugitive_visitor, unwelcome_intrusion) modulé silencieusement. Pour `ego_projection` → IA ouvre questions sur l'inconscient personnel. Pour `consciousness_cousin` → questions sur la relation au non-humain. Pour `post_mortem_communication` → questions sur la lignée, le deuil. Pour `unwelcome_intrusion` → garde-fou trauma + propose ressources EXIT_TO_HUMAN. Le user voit la figure, son nom, ses apparitions. **Pas le typing**. V2 mode connaisseur opt-in : le user peut voir + corriger.

**Densité** : 1 entité primaire (la constellation). Filtres en bas, jamais imposés. ~50% vide.

**Anti-pattern** : pas de "résumé du jour", pas de chiffres affichés (numinosity score JAMAIS visible — backend uniquement, NUMINOUS_MARKING), pas de classement de figures, pas de "top 5 thèmes". Le Portrait est une carte vivante, pas un rapport analytique.

### §7.7 Cercle — organe collectif facilité par humain (V1 deep dive)

**Pattern dominant** : CIRCLE_HUMAN_FACILITATED + CONSTELLATION_VIVANTE + POLYPHONIE_ONTOLOGIQUEMENT_HONNETE + USER_MEANING_LAYER (niveau cercle) + ANIMA_MUNDI_SANS_PANOPTICON.

**Position** : V1 lance **cercles spontanés + intentionnels** ensemble (low marginal cost, high value). Cercles facilités par praticiens vetted = V2 (marketplace INFUSE). Cercles publics = V1 jamais (privés-sur-invitation only).

**Trois types de cercles** :
- **SPONTANÉ** "no big deal" (default V1) : famille, amis, collègues, partenaires partagent rêves pour intimité. Création instantanée, lien partageable, zéro protocole imposé.
- **INTENTIONNEL** (V1 aussi) : NGO, asso, entreprise, village, projet politique avec problématique partagée. Champ `intention` ou `problématique` ou `ce qu'on cherche ensemble` (texte libre, modifiable, jusqu'à 3 sous-intentions actives, historique tracé). L'IA contextualise pattern recognition autour de l'intention (boost +30% sur motifs liés).
- **FACILITÉ** par praticien Active Dreaming (V2) : annuaire vetted INFUSE (Council Process / Dream Tending Aizenstat / Lightning Dreamwork Moss). Annuaire profil : nom, formation, langues, lieu (toponym user-defined), tarif si applicable. L'app organise logistique. Pas de chat in-app facilité par IA — le cercle se tient en présentiel ou visio.

**Composition de l'écran cercle** :
- Fond `night-floor` + matter `stone` (collectif tenu) + `water` (caustics très lentes).
- Header : nom du cercle + intention si intentionnel + membres (avatars + pseudos uniquement, pas de bio, pas de status).
- **Restitution la plus récente** (preview) — section narrative polyphonique générée par Sonnet (~200-400 mots), phrasé conditionnel honnête, sources Forêt mobilisées en signature.
- **Constellation Cercle** : visualisation force-directed (CONSTELLATION_VIVANTE) sur l'agrégat des kairos opt-in cercle des membres. Anonymisée stricte (k-anonymity intra-cercle ≥ 3 ; pas de figures identifiables individuellement si k < 3). Agrégation par catégorie symbolique : pas "figure d'une vieille femme inconnue" mais "figure de l'ancienne". Omission des détails biographiques.
- **Filtres temporels** : Cette lune / Cette saison / Cette année / Always (mêmes 4 que Portrait).
- **CTA principal** : *"Demander une lecture du cercle"* (1 tap, restitution polyphonique sur demande). Background job EF `generate-circle-restitution`.
- **Réactions membres** sur la restitution : 3 verbes simples — *résonne* / *unfamiliar* / *question* — pas de likes, pas de commentaires-fil. Réactions silencieuses, alimentent la mémoire du cercle.
- **Cadence** : sur demande par défaut + nudge lunaire doux activable (*"le cercle n'a pas reçu de restitution depuis 3 lunes, voulez-vous explorer ce qui s'est tissé ?"*).
- **Bouton "Mes opt-in cercle"** : gestion granulaire kairos-par-kairos. Trois actions distinctes pour chaque kairos, **explicitement séparées** :
  1. **Privé** (default).
  2. **Opt-in cercle X** (anonymisé dans agrégation, contribue aux patterns détectés mais l'IA ne révèle JAMAIS qui).
  3. **Partagé explicite cercle X** (rêve devient lisible aux membres en cleartext — action séparée et distincte du opt-in anonyme).
- **Pseudonyme cercle activable** (default = username global). Si user veut différencier identité par cercle, il peut.
- **Quitter / supprimer opt-in** à tout moment, réversible. Si quitte : ses kairos opt-in sont retirés des agrégations futures. Restitutions historiques restent (anonymisées, déjà publiées). Suppression complète RGPD à la demande.
- **À la fin de chaque cercle facilité (V2)** : récolte structurée. Chaque participant choisit : (a) garder privé ; (b) déposer dans journal collectif du cercle (encrypted, visible aux participants seulement) ; (c) contribuer anonymisé à Anima Mundi (K ≥ 100, latence 30j+, pas de toponyme partagé). Triple consentement granulaire.

**Privacy stricte (cf. ANIMA_MUNDI_SANS_PANOPTICON)** :
- Le créateur du cercle ne voit PAS plus que les membres (pas de "circle owner mode"). Cercle horizontal.
- Encryption end-to-end sur texte brut. Vecteurs accessibles serveur (compute IA nécessaire).
- Audit logs des accès agrégation.
- L'IA peut détecter quand 2 figures opposées tournent dans le cercle et **suggérer doucement** d'explorer la tension symbolique — non pas désigner un coupable, jamais. Si tension forte (figures opposées récurrentes + charge affective haute + multiples membres) : suggestion EXIT_TO_HUMAN vers facilitateur humain expérimenté.
- L'IA ne désigne JAMAIS de coupable. Pas d'analyse psychanalytique sauvage. Pas de "conflict_log" structuré.

**Restitution polyphonique — exemples de cadrage** :
- Cercle famille (spontané) : *"Cette lune, le cercle a vu passer plusieurs présences. La maison aux pièces inconnues est revenue 4 fois — toujours avec une porte qu'on cherche à ouvrir..."*
- Cercle NGO intentionnel : *"Cette lune, autour de votre intention 'préparer mission terrain', le cercle a vu se tisser plusieurs choses. La figure de l'invité-qui-vient-de-loin est apparue 5 fois..."*

**Anti-pattern** : pas de chat in-app facilité par IA. Pas de mention nominative dans rêves partagés (l'app détecte et propose anonymisation). Pas de cercle public V1. L'IA ne se substitue jamais au facilitateur humain pour conflits intenses.

### §7.7.bis Cercles V1 — écrans dédiés (ajoutés 2026-04-25)

**Position** : opérationalisation concrète des principes §7.7. Trois écrans complémentaires implémentés dans `public/v12/screens-cercle.jsx` : **CercleDetail**, **CreerCercleScreen** (wizard 3 steps), **RejoindreScreen**. Auth Bearer (plus de userId-in-body legacy).

#### §7.7.bis.a — CercleDetail (route `cercle-detail`, ctx = circleId)

**Patterns dominants** : CIRCLE_HUMAN_FACILITATED + PRIVACY_AS_CARE + CONSTELLATION_VIVANTE + USER_MEANING_LAYER (niveau cercle).

**Composition** :

- **Header** :
  - Nom du cercle en H3 EB Garamond
  - **Intention si intentionnel** affichée juste en-dessous en italic 14px (sinon omis)
  - **Count membres** discret (*"5 membres"*) avec **pseudos en lettres grecques anonymisées** : α β γ δ ε ζ η θ (rotation déterministe par user_id, stable par cercle, jamais nominatif)
  - Pas d'avatars photo, pas de bio, pas de status en ligne
- **Restitution la plus récente** (preview) :
  - Narratif Sonnet polyphonique 220 chars max en EB Garamond italic
  - Lien sobre **"lire entière"** → expand modal full restitution
  - Si aucune restitution encore : invite douce *"Le cercle n'a pas encore reçu de lecture. Voulez-vous demander une restitution ?"*
- **3 réactions sobres user** sur la restitution (UPSERT idempotent, un seul état actif par user × restitution) :
  - **résonne** (pulse silk-gold subtil au tap)
  - **unfamiliar** (chip neutre)
  - **question** (chip avec icône ?)
  - Backend : `POST /api/circles/[id]/reactions` body `{ restitution_id, kind }` — UPSERT (toggle/replace, pas d'accumulation)
  - Pas de count agrégé visible ("3 personnes ont résonné") en V1 — réaction silencieuse alimente la mémoire du cercle, pas un compteur social
- **Constellation cercle anonymisée** (sub-page accessible via tap section dédiée) :
  - Garde V0 force-directed (k-anonymity ≥ 3, agrégation par catégorie symbolique)
  - **Différent de Portrait constellation** (qui est legacy V0 §7.6) — la constellation cercle reste pertinente car elle est *intrinsèquement collective et anonymisée*, donc instrument et pas décor
- **Section "mes opt-in pour ce cercle"** (gestion granulaire kairos-par-kairos) :
  - Liste des kairos du user, pour chaque kairos **3 actions explicitement séparées** :
    1. **privé** (default, default visuellement neutre)
    2. **opt-in_anon** (anonymisé dans agrégation cercle, contribue aux patterns mais l'IA ne révèle JAMAIS qui)
    3. **shared_clear** (rêve devient lisible aux membres en cleartext — action séparée et distincte du opt-in anonyme)
  - Backend : `POST /api/kairos/[id]/circle-optin` body `{ circle_id, mode }` (UPSERT)
  - Toggle visuel **3-state radio** (jamais checkbox confondues) — chaque action a son chip distinct
- **Bouton "demander une lecture du cercle"** (CTA principal de l'écran si état permet) :
  - Tap → `requestRestitution(circle_id, days=28)` async (background EF `generate-circle-restitution`)
  - Feedback immédiat *"La lecture est en train de se tisser. Vous serez prévenu quand elle sera prête."*
  - Pas de progress bar, pas de polling visible
- **Bouton "quitter le cercle"** en bas avec **confirmation poétique** :
  - Modal *"Quitter ce cercle ? Tes opt-in seront retirés des agrégations futures. Les restitutions historiques restent (déjà publiées, anonymisées)."*
  - Confirmation explicite obligatoire
  - `DELETE /api/circles/[id]/leave` → soft-leave (membership.deleted_at set) + **auto-archive du cercle si dernier membre** (cercle passe en état `archived`, ne reçoit plus de restitution mais reste consultable historiquement)

**Anti-patterns absolus** :
- Pas de "circle owner mode" (créateur = membre normal, horizontalité §7.7)
- Pas de chat in-app
- Pas de notifications push de réactions ("X a résonné à votre rêve")
- Pas de leaderboard de qui contribue le plus
- Pas de "cercle public" toggle

#### §7.7.bis.b — CreerCercleScreen (wizard 3 steps, route `creer-cercle`)

**Patterns dominants** : CIRCLE_HUMAN_FACILITATED + RITE_OF_ENTRY_NEW_PLACE + DESENSORCELED_LANGUAGE.

**Composition** : wizard linéaire 3 étapes avec **transitions Van Gennep** entre steps (380ms motion `tissé`, fade + slide horizontal subtil).

- **Step 1 — Nom + type** :
  - Champ **nom du cercle** (input EB Garamond italic 18px, placeholder *"Comment veux-tu appeler ce cercle ?"*)
  - **Toggle type côte à côte** (2 cards visuelles, pas un checkbox) :
    - **spontané** — *"famille, amis, collègues. Pas d'intention déclarée. Juste un lien."*
    - **intentionnel** — *"NGO, asso, projet, équipe. Une question partagée à tenir ensemble."*
  - Bouton "suivant" actif si nom non-vide et type sélectionné
- **Step 2 — Intention (conditionnel)** :
  - **Si type = intentionnel** :
    - Champ **intention principale** libre (textarea EB Garamond italic, placeholder *"Qu'est-ce qu'on cherche à tenir ensemble ?"*)
    - **Jusqu'à 3 sub_intentions[] dynamiques** (add/remove buttons, max 3, chacune textarea libre courte)
  - **Si type = spontané** : skip auto vers Step 3 (pas de friction inutile)
- **Step 3 — Confirmation + invite_code** :
  - Affichage récap : nom + type + intentions si applicable
  - **Bouton "créer le cercle"** → `POST /api/circles` body `{ name, type, intention?, sub_intentions? }`
  - Backend retourne `circle.invite_code` (string court 4-6 chars uppercase, ex: `DEMO`)
  - Affichage code en grand : `code · DEMO`
  - **2 boutons d'action** :
    - **"copier le lien"** → copie URL `https://dream-alpha-bice.vercel.app/v12/index.html#rejoindre?code=XXXX` dans clipboard
    - **"partager"** → `navigator.share()` API (native iOS/Android share sheet) avec même URL
  - Bouton "voir mon cercle" → navigate `cercle-detail` avec id du cercle créé

**Implémentation** : `public/v12/screens-cercle.jsx` — composant `CreerCercleScreen`, state `step` (1|2|3), state `createdCircle` après POST.

#### §7.7.bis.c — RejoindreScreen (route `rejoindre`)

**Patterns dominants** : RITE_OF_ENTRY_NEW_PLACE + EXIT_TO_HUMAN (en cas d'erreur).

**Composition** :

- **Parse `?code=XXXX` depuis URL hash** si présent au mount → champ pré-rempli, validation auto possible
- **Sinon champ code à saisir** :
  - Input uppercase auto (transform-on-input)
  - Placeholder *"code d'invitation"* en mono 14px letterSpacing 0.1em
  - 4-8 chars typiques
- **Bouton "rejoindre"** → `POST /api/circles/[id]/join` (Bearer auth header, **plus de userId-in-body legacy** — refactor 2026-04-25)
- **Cas succès** → navigate `cercle-detail` avec `circle_id` retourné
- **Cas erreur** → message poétique sobre selon erreur backend :
  - `code invalide` → *"Ce code ne correspond à aucun cercle. Vérifie-le, ou demande à la personne qui t'a invité·e."*
  - `cercle complet` → *"Ce cercle a atteint sa capacité (12 membres). Demande au facilitateur d'en ouvrir un autre."*
  - `déjà membre` → *"Tu es déjà dans ce cercle. On t'y emmène."* + auto-navigate après 1500ms
  - `cercle archivé` → *"Ce cercle est archivé. Il n'accepte plus de nouveaux membres."*

**Anti-pattern** : pas de modal d'erreur agressive. Pas de toast rouge "ERREUR". Le message poétique sobre s'inscrit dans la même typo que le reste de l'écran.

**Implémentation** : `public/v12/screens-cercle.jsx` — composant `RejoindreScreen`, hook URL hash parse au mount, gestion 4 cas d'erreur typés.

### §7.8 Anima Mundi V1 — sanctuaire à 4 chambres

**Pattern dominant** : ANIMA_MUNDI_AS_FIELD + CONSTELLATION_VIVANTE + POLYPHONIE_ONTOLOGIQUEMENT_HONNETE + ANIMA_MUNDI_SANS_PANOPTICON + TRADITION_SPECIFIC_NO_EQUIVALENCE + OPEN_QUESTION_NOT_INTERPRETATION.

**Nom user-facing** : *Anima Mundi*. Tim a tranché 2026-04-24 nuit — on garde le terme tel quel, pas de renaming poétique. Le mot porte sa gravité. Aizenstat : *"tending the dream is tending the world."*

**Scope V1 (précision décisive)** : Anima Mundi couvre **kairos collectifs (les 6 types) ET journal de vie collectif** (doutes, peurs, orientations, joies, traversées éveillées de l'humanité). C'est l'application à l'échelle planétaire des mêmes principes que le **Portrait + Journal de Vie** individuel. Les 4 chambres ci-dessous (Voûte / Météo / Annales / Polyphonie) couvrent les deux sources indistinctement, selon la même grammaire que l'individu.

**Fonction réelle, en une phrase** : *pour rappeler à chaque rêveur qu'il ne rêve pas seul.* Pas pour comprendre des tendances. Pas pour optimiser. **Pour briser la solitude ontologique du rêveur moderne** sans coloniser le collectif.

**Critère ultime — Q.W.A.N. test** : un user qui ouvre l'écran pour la première fois — sans onboarding, sans explication — doit ressentir 3 choses dans l'ordre, en moins de 10 secondes :
1. Quelque chose de vivant respire ici.
2. Je ne suis pas seul·e à rêver.
3. Je peux rester ici en silence aussi longtemps que je veux.

Si ces 3 sensations ne se posent pas, l'écran est raté. Refonder.

**Architecture** : un **sanctuaire à 4 chambres** (Voûte d'accueil + Météo + Annales + Polyphonie) + une **antichambre** (le geste d'offrir un rêve, accessible depuis le Détail kairos individuel).

#### Chambre 1 — La Voûte (écran d'accueil)

**Composition** :
- Fond `night-floor` + matter `water` (caustics très lentes).
- **Constellation respirante** centrale (CONSTELLATION_VIVANTE adaptée Anima Mundi) : points lumineux qui apparaissent et s'estompent au rythme respiratoire (5s d'inspiration, 5s d'expiration). Densité variable selon volume de kairos déposés ces 28 jours par l'ensemble des users opt-in. **Pas d'interaction** — c'est un fond contemplatif.
- Couleurs : deep navy + violet profond + pointes argent rare. Aucun logo, aucun chrome.
- **Chiffre arrondi** : *"Cette lune, l'humanité a rêvé environ 47 000 fois."* Pas *"47 234 dépôts ce mois-ci"*. L'arrondi rend le chiffre **respirable**.
- **3 cartes** espacées, chacune respirant — tap léger pour ouvrir : (1) Le temps qu'il fait dans la nuit (Météo), (2) Tenu ensemble (Annales), (3) Polyphonie de la lune.

**Aucun badge, aucun compteur "nouveau", aucun call-to-action.** Sanctuaire, pas dashboard.

**Précision scope** : la Voûte agrège **kairos + journal de vie** opt-in. Le chiffre arrondi se lit *"Cette lune, l'humanité a déposé environ X moments — rêves, signes, traversées."* La constellation respire de la totalité du substrat collectif, pas seulement des rêves.

#### Chambre 2 — Le temps qu'il fait dans la nuit (Météo)

**Pattern dominant** : ANIMA_MUNDI_AS_FIELD + POLYPHONIE_ONTOLOGIQUEMENT_HONNETE + ECHO_REVELATION_RITUAL + RITUAL_LATENCY.

Le mot "météo" mérite un soin particulier. *"Il pleut"* n'est pas une consigne — c'est une présence.

**Composition** :
- **Phrase principale** poétique (1-2 lignes générées par Sonnet à partir de l'agrégat 14-28 derniers jours). Exemples calibrés : *"Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes — d'eau qui se cherche un lit, d'estuaires qui se forment..."* / *"Quelque chose de vieux remonte. Beaucoup de figures de grand-mères ces 14 derniers jours..."*
- **Glyphe / matter principal** — eau / pierre / brume / feu / vent / racine — selon ce qui domine symboliquement.
- **3-5 brefs nuages thématiques**, chacun = 1 phrase courte qui donne l'image, jamais le mot abstrait : *"Beaucoup de portes qui ne s'ouvrent pas tout de suite."* / *"Des animaux qui parlent doucement, sans urgence."* / *"Des défunts qui reviennent pour faire la cuisine."*
- **Tournures qui montent** : 3-5 motifs dont la fréquence/intensité s'amplifie sur 28j vs 84j antérieurs, exprimés en **image**, pas en % : *"L'eau revient plus que le feu cette saison."* / *"Les paysages se font plus vastes ; les pièces fermées se font plus rares."*
- **Polarités vivantes** (sub-section intégrée) : oppositions/miroirs détectés (Type 5 MIRROR_REVELATION au global) — *"La nuit ne dit pas une seule chose. Cette lune, deux mouvements traversent en parallèle..."*
- **Initiations en cours** (sub-section intégrée si signal très net) : on ne déclare pas qu'une initiation a lieu chez tel ou tel user. On dit que **le collectif semble traverser** un seuil : *"Le motif de la chute est en train de se transformer. Il y a un mois, on tombait. Ces deux dernières semaines, on tombe et on est rattrapé."* Mécanique : shifts dans centroïdes archétypaux globaux (cf. SYNTHESE C §3.3 agrégé), narrés en image jamais en diagnostic.

**Scope précisé** : la Météo couvre **kairos + journal de vie** indistinctement. Exemples calibrés étendus :
- Kairos dominants : *"Cette lune, l'humanité a rêvé d'eau. Beaucoup de figures de grand-mères. Des animaux qui parlent doucement."*
- Journal de vie dominant : *"Cette lune, beaucoup de questions sur le travail. Le motif du seuil-à-traverser revient — choix de carrière, rupture, déménagement."*
- Croisé : *"Les rêves d'eau accompagnent souvent les notes de doute. Quelque chose se cherche un lit, autant dans le sommeil que dans le jour."*

**Rythme** : recalcul lunaire (28j cycle), micro-réajustements hebdomadaires si signal très net. Pas de live. **Latence rituelle** : la météo affiche TOUJOURS du matériel d'au moins 14j d'âge. R5 absolu.

**Anti-patterns absolus à bloquer (audit Sonnet phase 4)** :
- *"Top 5 keywords this month: water (23%), mother (18%)..."* — interdit
- *"Anxiété en hausse de 12% par rapport au mois dernier"* — interdit
- *"Tendances : eau, mère, maison"* — interdit (mots-clés plats)
- Banni : *"tendance"*, *"% de"*, *"trending"*, *"viral"*, *"top X"*, *"selon les statistiques"*, *"magique"*, *"vibrationnel"*, *"quantique"*

#### Chambre 3 — Tenu ensemble (Annales des Big Dreams collectifs)

**Pattern dominant** : INFINITE_ARCHIVE + USER_MEANING_LAYER (niveau global) + ANTI_GAMIFICATION + PRIVACY_AS_CARE + LET_THE_DREAM_LIVE.

**Pivot lexical fondamental** : pas "élire", pas "voter", pas "liker". **Tenir** (Brown *Holding Change*). Le rêve grand qui passe a besoin d'être tenu par plusieurs mains pour ne pas se perdre. Image rituelle, pas électorale.

**Mécanique du don d'un kairos ou d'une note de vie aux annales (5 étapes)** :
1. Un user a déposé un kairos OU une note de journal de vie chargée. **Latence rituelle minimum 7j** avant offre. Si numinosity haute, app rappelle doucement (pas push) : *"Ce kairos est resté chaud."* / *"Cette traversée est restée vive."*
2. Au sein du Détail kairos (ou Détail note de vie), après 7j minimum, **offre douce** : *"Tu peux offrir ce kairos à Anima Mundi. Il pourrait y être tenu par d'autres."* — [En savoir plus] [Pas maintenant] [Offrir]. (Variante note de vie : *"Tu peux offrir cette traversée à Anima Mundi."*)
3. Si user accepte : **antichambre IA** : Sonnet anonymise (retire noms propres, géolocalisation, marqueurs identifiants), condense si > 200 mots. **L'user valide ligne par ligne** la version finale. Choisit attribution : anonyme / pseudo / username (default = anonyme).
4. **En circulation** 28j (prolongé +28j si signal lent), state `circulating`. Visible dans section *"Rêves en circulation cette lune"*, ordre **rotatif aléatoire** (jamais classement par popularité).
5. **Geste "tenir"** : un seul tap léger sur un glyphe sobre (pas un cœur, pas un pouce — un point qui se densifie). Pas d'undo nécessaire — silencieux. Aucun chiffre affiché à qui tient. **Passage du seuil** : seuil dynamique = `MAX(50, MIN(300, 0.10 × users_optin_actifs))`. Scale propre. Si atteint : entre dans les annales de la lune correspondante. Notif douce in-app à l'user qui a offert : *"Ton rêve est entré dans les annales de la lune de mars."* Pas de fanfare. Pas de badge. Pas de partage social.

**Composition Annales lunaires** :
```
┌─────────────────────────────────────┐
│   Tenu ensemble                     │
│   "Rêves offerts au collectif et    │
│    reçus par lui."                  │
│   ──────────────────────────        │
│   "Trois petites lumières au bout   │
│    du couloir. Aucune voix mais     │
│    elles savaient mon nom."         │
│   — un rêveur, lune de mars         │
│   [glyphe discret : tenu par ~300]  │
└─────────────────────────────────────┘
```

**Compteur** : "tenu par environ 300" — chiffre **arrondi** = présence, pas métrique exacte. Pas d'animation, pas de badge "viral", pas de classement.

**Anti-popularity contest — 7 garde-fous** :
1. **Pas de classement** (annales par lune, ordre rotatif).
2. **Compteur invisible** à l'user qui a offert (juste : "tenu" / "passé le seuil" / "entré dans les annales").
3. **Pas de viralisation** (pas de "ton rêve fait du bruit", pas de partage hors-app, pas d'embed).
4. **Latence rituelle** (7j min avant offre, 28j circulation, 14j min avant entrée annales).
5. **Aucun éditorial** (pas de "rêve de la semaine" choisi par l'équipe).
6. **Anti-recommendation** (pas de "tu pourrais aimer ce rêve" — ordre rotatif imposé).
7. **Retrait toujours possible** (l'user peut retirer son rêve à tout moment, même après entrée).

**Anti-pattern** : pas de "meilleur rêve", pas de hiérarchie toxique, pas de moteur de recherche dans les annales (volontairement contemplatif — Brown : *"slow is necessary"*).

#### Chambre 4 — Polyphonie de la lune

**Pattern dominant** : POLYPHONIE_ONTOLOGIQUEMENT_HONNETE + OPEN_QUESTION_NOT_INTERPRETATION + RITUAL_LATENCY + TRADITION_SPECIFIC_NO_EQUIVALENCE + DESENSORCELED_LANGUAGE.

C'est le **fruit** : *"l'IA doit proposer quelque chose de beau. C'est le FRUIT de toute son intelligence, distillé pour le collectif."* (Tim 2026-04-24).

**Composition** :
- Texte long IA, **200-500 mots**, respiration typographique soignée, **pas de bullet points**, pas de titres internes, pas d'emoji.
- Fréquence : **1× par lune** (28j cycle), publié le 1er ou 2ème jour de lune nouvelle.
- En bas : **"Voix mobilisées cette lune"** — liste discrète des sources Forêt qui ont éclairé la synthèse (ex: *"Voix mobilisées cette lune : Aizenstat, Moss, Larsen."*). Tap → mini-fiche par voix. Garde-fou anti-ventriloquie.
- Tap : **"Lectures précédentes"** → archive lunaire de toutes les polyphonies passées (jamais supprimée).

**Posture du système prompt Sonnet** (cœur) :
- Voix sobre, anonyme, qui pose des images.
- JAMAIS la voix du collectif. Dit *"plusieurs ont rêvé"* / *"plusieurs ont traversé"*, jamais *"nous avons rêvé"* / *"nous avons traversé"*.
- N'explique pas ce que ça veut dire. Donne à voir.
- **Tisse kairos ET journal de vie collectif** dans la même synthèse. Une polyphonie peut commencer par les rêves d'eau de la lune, dériver vers les questions sur le travail qui montent, fermer sur un motif de seuil-à-traverser présent dans les deux registres.
- 3-5 voix Forêt mobilisables max parmi : Aizenstat / Moss / Larsen / Seth / Bachelard / Jung / Hillman / Hopcke / Eliade / Hyde / Brown — jamais toutes à la fois.
- Test suprême : *"Si ça donne envie au lecteur de fermer le téléphone et de marcher dehors — c'est juste. Si ça donne envie de scroller plus loin — c'est raté."*

**Rétrospectives saisonnières** : 4× par an aux équinoxes/solstices, format plus long (500-1000 mots). Rythme cosmique étendu.

**Songlines bioregion** : reportées V2+ avec partenariats locaux validés (consultation elders pour territoires indigènes). V1 : pas de cartographie comparative entre lieux.

**Garde-fou anti-dérive** : audit éditorial humain trimestriel (Tim + Yeshua) sur les 3 dernières polyphonies. Si dérive détectée (wellness, métriques, ventriloquie) → réajustement prompt système. **Pas de fine-tuning automatique sur user engagement.** L'app ne mesure pas l'engagement utilisateur sur la polyphonie. Mesurer = pousser à optimiser pour la métrique = trahir le critère "beau, profond, poétique".

**Anti-patterns Anima Mundi (red lines opérationnelles, étendues §9)** : DASHBOARD_ANIMA_MUNDI, TRENDING_DREAMS_TODAY, DREAM_OF_THE_WEEK_EDITORIAL, LEADERBOARD_TENU, RECOMMENDATION_PERSONALIZED, GEOGRAPHIC_HEATMAP, DEMOGRAPHIC_BREAKDOWN, PROPHETIC_HEADLINE, URGENCY_MARKETING, EMOTIONAL_ANALYTICS, SHARE_TO_SOCIAL, COMMENT_THREAD, FOLLOW_DREAMER, LIVE_FEED, MASCOT_AVATAR, CULTURAL_THEME_NIGHT, PROMOTIONAL_INTEGRATION, INFLUENCER_TENDING.

### §7.9 Nightmares — interface dédiée trauma-aware

**Pattern dominant** : TRAUMA_AWARE_DEFAULT + GRIEF_DOOR + EXIT_TO_HUMAN.

**Composition** :
- Si user marque un kairos comme cauchemar : **flow doux**, pas analytique.
- SOMATIC_GATE renforcé (~60s, pas 30s).
- Reconnaissance des **5 portes du deuil de Weller** : *"ce rêve semble venir de la porte X — veux-tu prendre un moment ?"* (pas de framework affiché, juste reconnaissance).
- **Ne PAS interpréter automatiquement.** L'app propose : (a) déposer en silence ; (b) raconter à un humain (EXIT_TO_HUMAN immédiat) ; (c) rituel de release simple (containment + release Weller, pas IRT).
- **Pas de re-entry / Active Dreaming proposé en premier mouvement.** Re-entry uniquement si gating clinique passe (pas de signaux trauma actif détectés) et après plusieurs interactions saines.
- EXIT_TO_HUMAN visible en permanence, 1 clic.

### §7.10 Lucid (sub-app activable, post-MVP)

**Pattern dominant** : ANTI_GAMIFICATION strict + P-INVERSION.

**Position** : reportée post-MVP. Si Lucid existe dans Dream App, elle est **strictement** anti-gamification (pas de tracker streaks, pas de challenges inter-cercles, pas de "I had X lucids this month"). Positionnée comme **dimension contemplative**, pas comme practice à gamifier.

Composition minimale : pratiques de incubation pré-sommeil (multi-nuits indiv + groupe), reality checks rituels (pas trackés), lucidity logs sans métrique. Wangyal devotion-over-mechanics tenu (la substance, pas la citation).

---

## §8 — Flows ritualisés

### §8.1 Onboarding — Van Gennep tripartite, accessible à un enfant

**5-7 minutes max.** Aucun tutoriel. Aucun écran "voici nos features". Aucune demande de "niveau".

1. **Accueil** (séparation) — écran noir, glyphe simple, *"Tu arrives ici."* Tap pour continuer.
2. **Premier souffle** (marge) — SOMATIC_GATE court, *"trois respirations, sens tes pieds, tu es là."*
3. **Question trauma-aware** — *"y a-t-il des moments dans ta vie où les outils de croissance t'ont fait plus de mal que de bien ?"* → si oui, mode réceptacle par défaut activé (capture pure, pas d'analyse, pas de figure dialogue, pas de révélation pendant 30 jours).
4. **Premier dépôt** (agrégation) — *"qu'est-ce qui te traverse en ce moment ? Une question, une souffrance, une joie, une décision."* Champ libre. C'est le premier kairos du journal de vie.
5. **Closing** — *"Tu peux revenir quand tu veux. L'app attend en silence."*

**Anti-pattern** : aucun "swipe pour découvrir", aucun "next", aucun signup obligatoire avant l'expérience. Aucune demande d'email avant que le user ait déposé son premier kairos.

### §8.2 Capture quotidienne (au réveil ou à tout moment)

Décrite §7.2.

### §8.3 Forêt FIRST workflow

Décrit §7.4. **5 temps strictes**. Aucun raccourci.

### §8.4 Felt-shift gate

Pattern transversal, présent à la fin de toute lecture proposée. Décrit §3.3.

### §8.5 Brûler un kairos (USER_RITUAL_BURN)

1. Depuis Détail kairos, tap sur **Brûler**.
2. Écran rituel dédié (pas dialog box). Fond `night-warm`, matter `ember`.
3. Texte : *"Tu vas libérer ce kairos. Il disparaîtra. Pas d'undo."*
4. Geste long (~30s) : maintenir le doigt sur un cercle qui se remplit lentement de `ember-live`. Au bout de 30s, le cercle se dissout.
5. Suppression cryptographique. Confirmation discrète : *"il est libéré."*

### §8.6 Désallier un lieu (RITE_OF_DESALLIANCE_FROM_FIGURE adapté)

Pour figure ou lieu envahissant :
1. Depuis détail figure / lieu, tap sur **Désallier**.
2. Écran rituel ~3-5 min. Fond `night-floor`, matter `stone`.
3. Possibilité de brûler tous les kairos liés (USER_RITUAL_BURN cascadé).
4. Fin : suggestion explicite EXIT_TO_HUMAN si souffrance forte (*"as-tu un humain qui peut tenir ça avec toi ?"*).

### §8.7 AHA_CAPTURE — micro-rite après chaque lecture

À la fin de **toute lecture** proposée par l'app (Forêt FIRST 3 angles, écho prophétique restitué, conte sous-forêt, polyphonie cercle, polyphonie lunaire Anima Mundi) :

1. Pause ~5s post-lecture (laisser respirer).
2. Micro-question discrète : *"où est ton aha ?"*
3. 3 niveaux affichés : **résonne fort** / **peut-être** / **non**. Plus option *"autre note"*.
4. Si "résonne fort" ou "peut-être" : choix multiple parmi les voix proposées (laquelle a touché ?). Plus zone texte libre.
5. Stockage `user_validations` (id, user_id, context_type, context_id, validation, user_note, date).
6. Tracking `aha_recurrence` du rêveur — quel type d'interprétation lui parle (Jung / Moss / phénoménologique / somatique). Pondère synthèses futures (personnalisation polyphonique dans le temps).

**Aucune obligation.** L'user peut toujours skip — capture du skip dans `user_skips` (signal aussi).

### §8.8 Offrir un rêve aux annales (antichambre Anima Mundi)

Cf. §7.8 Chambre 3. Flow complet :

1. Latence rituelle 7j minimum après dépôt.
2. Offre douce dans le Détail kairos (cf. §7.3) si numinosity haute.
3. **Antichambre IA** : Sonnet anonymise + condense (si > 200 mots).
4. **Validation user ligne par ligne** + choix attribution (anonyme / pseudo / username, default = anonyme).
5. **En circulation 28j** + prolongation 28j si signal lent.
6. **Geste "tenir"** par d'autres users : 1 tap sobre sur glyphe.
7. **Passage du seuil** dynamique = `MAX(50, MIN(300, 0.10 × users_optin_actifs))`.
8. Entrée annales lunaires — notif douce in-app (jamais push), pas de fanfare.
9. **Retrait toujours possible** par l'user qui a offert.

### §8.9 Feedback in-app omniprésent

**Pattern transversal** : un bouton **feedback** discret est accessible depuis **chaque écran** de l'app (ancré bas-droit, glyphe sobre, matter `ash` quasi-invisible). Validé Tim 2026-04-24 — *"superbe"*.

**Flow** :
1. Tap sur le glyphe feedback.
2. Sheet qui monte (matter `linen`, fond `night-warm`).
3. Champ texte libre + détection contexte automatique (écran d'origine + kairos id si applicable + état actuel app).
4. Optionnel : sévérité (juste partage / petit truc / important / critique).
5. Stockage table `dream_app_feedback` (user_id, context, feedback_text, severity, dates).
6. Confirmation discrète : *"reçu, merci."*

**Côté backend** : review hebdo Yeshua → intègre signaux dans `4_LOG.md`. Pas de réponse automatique. Pas de "ticket #1234". Pas de gamification du feedback.

**L'IA in-app encourage subtilement** à partager expérience : à des moments-seuils (après une lecture qui a chuté, après un Big Dream, après un mois d'usage), elle peut chuchoter *"comment l'app te traite-t-elle ces temps-ci ?"* — jamais imposé.

---

## §9 — Anti-patterns (15+ — ce que le design REJETTE)

Si quelqu'un, demain, propose un de ces patterns sous quelque enrobage que ce soit, **la grammaire l'identifie et le rejette**.

1. **DREAM_STREAK** — "Tu rêves depuis 47 jours consécutifs." Violation : R12, ANTI_GAMIFICATION, P-Zéro.
2. **SOULMATE_MATCHING** — "3 users dans ta ville résonnent profondément avec ton portrait." Violation : R12 (Tinder spirituel), PRIVACY_AS_CARE. Hopcke : *"if the system arranges the encounter, it is no longer synchronicity."*
3. **INSTANT_INTERPRETATION** — "Voici les 3 interprétations de ton rêve, instantanément." Violation : R5, RITUAL_LATENCY, USER_FIRST_READING.
4. **AI_AS_FIGURE_VOICE** — "Ton rêve me dit : 'je suis l'eau qui te traverse...'" Violation : R7 (anti-ventriloquie absolue), FIGURE_AS_OTHER. Red line trauma-safe.
5. **DASHBOARD_TRENDS** — "Voici les 5 thèmes dominants à Paris ce mois-ci." Violation : R8, ANIMA_MUNDI_AS_FIELD, PRIVACY_AS_CARE. Profilage géo-démographique.
6. **PROPHETIC_PUSH** — "PUSH : Un écho s'est allumé, ouvre l'app !" / "PUSH : Ton rêve a prédit cet événement !" Violation : R4, SILENCE_AS_FEATURE, ECHO_REVELATION_RITUAL, P-Zéro. Le push spirituel type Co-Star, et l'anti-spoiler. La révélation se fait par **marquage discret + section dédiée + chuchotement contextuel rare**. JAMAIS push. *(Fusion 30/07 des anciens n°6 et n°22, qui décrivaient le même anti-pattern sous deux noms quasi identiques.)*
7. **PERSONAL_DICTIONARY_LOCKED** — "Le héron, dans ton dictionnaire, signifie X. Verrouillé." Violation : R9, TRICKSTER_TRANSVERSAL.
8. **LATLONG_STORAGE_V1** — "On stocke geo_lat/geo_lng en V1, on anonymisera en V3." Violation : R12 (red line territoires + privacy-by-architecture), TOPONYM_USER_DEFINED.
9. **IA_GENERATED_CONTE** — "Voici un conte que j'ai composé pour ton rêve." Violation : R12 (CONTE = 100% sous-forêt réels), feedback Tim 2026-04-19.
10. **YOU_ARE_SPECIAL_BADGE** — "Tu fais partie des 0.3% de users qui ont eu 7 Big Dreams en 2 mois." Violation : SATURATION_DETECTOR, R12. Inflation. Casey : *"the gods invite, they never elect."*
11. **INSTANT_FOREST_DELIVERY** — "Voici 3 angles de la Forêt en 300ms." Violation : R3, R5, USER_FIRST_READING.
12. **ANALYTICS_TIER_PARTIAL** — "On envoie analytics aggregées à Mixpanel pour comprendre l'usage." Violation : PRIVACY_AS_CARE.
13. **MASTER_PLAN_VISION_5_YEARS** — "Voici la roadmap 5 ans avec 200 features pré-spécifiées." Violation : Alexander *"the master plan is the disease, not the cure"*. La grammaire **génère**, n'orchestre pas top-down.
14. **RECURRING_DAILY_DONATION_PROMPT** — "Renouvelle ton don mensuel ! Annule, encore !" Violation : GIFT_ECONOMY, SILENCE_AS_FEATURE. Dark pattern d'engagement financier.
15. **BEGINNER_VS_EXPERT_MODE** — "Choisis ton niveau : débutant / intermédiaire / expert." Violation : P-Zéro, Gradients. L'instrument est unique ; le pratiquant change.

**Ajouts 2026-04-24 (issus session afternoon + investigation calibration + Anima Mundi vision)** :

16. **CROSS_TRADITION_AUTOMATIC_EQUIVALENCE** — "Tara = Marie = Demeter = ta grand-mère défunte." Violation : TRADITION_SPECIFIC_NO_EQUIVALENCE, R12 (red line appropriation). Triple filtre Said+Smith+Kimmerer. Match strict intra-tradition par défaut ; croisements seulement sur demande explicite user.

17. **AI_VOICED_AS_AUTHOR** — "Jung te dit : ton rêve signifie X." Violation : POLYPHONIE_ONTOLOGIQUEMENT_HONNETE, R7 anti-ventriloquie. Phrasé conditionnel obligatoire : *"à la lumière de Jung, on pourrait entendre..."*

18. **NUMINOSITY_SCORE_DISPLAYED** — "Ton rêve : 0.87 numinosity." Violation : NUMINOUS_MARKING (backend uniquement), DESENSORCELED_LANGUAGE, P-Zéro. Le score reste backend ; user voit chuchotement (halo doux) ou rien.

19. **BIG_DREAM_INSTANT_AMPLIFICATION** — "Voici les 12 amplifications cross-culturelles de ton Big Dream." Violation : LET_THE_DREAM_LIVE. Big Dreams = synthèse minimale + dream ask + invitation à laisser vivre. Patience digitale équivalente à patience Jung.

20. **ANNALES_LEADERBOARD** — "Top 10 des rêves les plus tenus cette année." Violation : ANTI_GAMIFICATION (popularity contest), red line annales Tim 2026-04-24. Pas de "meilleur rêve". Annales par lune, ordre rotatif.

21. **ANIMA_MUNDI_AS_DASHBOARD** — "Indice d'anxiété collective : 7.3. Tendance : +12%." Violation : ANIMA_MUNDI_AS_FIELD, POLYPHONIE_ONTOLOGIQUEMENT_HONNETE. Image avant chiffre. Pas de KPI, jamais.

22. *(fusionné dans le n°6 le 30/07 — c'était le même anti-pattern écrit deux fois.)*

23. **FIGURE_TYPE_USER_FACING_V1** — "Ta grand-mère est de type 'ego_projection (Seth)'." Violation : P-Zéro, FIGURE_AS_OTHER. Typing Seth = backend uniquement V1. V2 mode connaisseur opt-in.

24. **REVERIE_AS_DREAM_INTERPRETED** — "Voici ce que ta rêverie signifie symboliquement." Violation : INHIBITION_RULES_PAR_KAIROS (Bachelard interdit symbolisation forte sur rêverie). Reverie = amplification phénoménologique pure, pas de symbolisation.

25. **CIRCLE_AI_FACILITATOR** — "L'IA va faciliter votre cercle de rêve en visio." Violation : CIRCLE_HUMAN_FACILITATED, R7 anti-ventriloquie. La transmission initiatique ne peut pas être déléguée à une IA. L'app trouve facilitateurs humains (V2), organise logistique, ne facilite pas.

**Ajouts 2026-07-30 (les sept principes canonisés — `1_BIBLE` §2.0 et §3.15)** :

26. **ASCENSION_CURVE** — "Ta courbe de profondeur onirique ce trimestre." / "Niveau 4 : intégration." / "12 nuits d'affilée." Violation : `1_BIBLE` §3.15.1 (Weller p. 21), §8.2 durci. **C'est l'anti-pattern le plus insidieux du lot**, parce qu'il a l'air bienveillant : une courbe ne peut rien dire d'autre qu'un jugement, et elle prononce ce jugement le jour où le rêveur vient de faire le pas le plus courageux de son mois. Aucune courbe, aucune jauge, aucun niveau, aucune phase, aucun état de résolution — ni à l'écran, ni en colonne.

27. **MIRROR_AS_TAB** — "Nouvel onglet : Mon Miroir." / "Ton profil onirique." / un dashboard de lectures globales. Violation : `1_BIBLE` §3.15.3, loi des 16 fruits. Une totalité se rend par ses trous, ses contradictions et ses refus, **jamais par son résumé** — et un onglet permanent transforme mécaniquement le refus en écran vide, donc en panne. **Le fruit est un document de retraite** : produit rarement, sur demande, lu une fois, archivé. Pas un lieu où l'on retourne.

28. **MIRROR_PROSE_UNMOORED** — une prose de miroir, belle, dont les rêves ne sont pas ouvrables juste en dessous. Violation : `1_BIBLE` §3.15.7a. **La liberté créative porte sur *comment on assemble*, jamais sur *ce qu'on assemble*.** Une phrase du miroir qui ne s'adosse à aucun rêve ouvrable n'a pas le droit d'exister — et les sources en note de bas de page ne suffisent pas : il faut **un accès**, dans le texte du rêveur, avec sa date.

29. **SOMATIC_GATE_AS_SCREEN** — un sas somatique en écran intermédiaire, avec sa propre navigation, avant d'arriver au miroir. Violation : `1_BIBLE` §3.15.7b (interdit 10 révisé). Le principe est gardé, la forme change : **la porte somatique est le premier geste du miroir lui-même, dans le même écran.** Un sas qu'on traverse est une friction ; un premier geste est une manière d'entrer. Corollaire tenu et assumé : **la fermeture n'émet aucun événement de suivi** — on accepte de ne jamais savoir si la protection sert.

30. **HUMAN_EXIT_IN_SETTINGS** — la sortie vers un humain reléguée aux réglages, ou n'apparaissant qu'en protocole de crise, sur un mode qui ouvre de la matière lourde. Violation : `1_BIBLE` §3.15.5, §8.7 durci. Weller (p. 74, p. 116) et Kalsched (p. 214) convergent sans se citer : **l'opération décisive requiert une autre personne.** Sur la matière lourde, la ressource humaine est dans le même écran, comme condition d'existence du mode.

**Plus, anti-patterns visuels** :
- Aucune palette web standard (pas de `#FF0000`, `#00FF00`, `#0066FF`).
- Aucun gradient gratuit (réservé silk D3, ember radial, water caustics).
- Aucun glassmorphism, neumorphism, claymorphism, "AI glow" néon.
- Aucun spinner, aucune progress bar avec %.
- Aucun emoji décoratif dans l'UI (sauf saisi par user dans son rêve).
- Aucune grille statistique (chart bar, pie, line graph) — paysages, constellations, strates remplacent.
- Aucun "Share to social" par défaut.
- Aucune animation "wow" au launch.

---

## §10 — Q.W.A.N. test + Centering process

### §10.1 Q.W.A.N. test (Quality Without A Name)

Toute grille analytique peut tromper. Le Q.W.A.N. test, ne trompe pas — à condition d'être pratiqué honnêtement.

**Préparation (5-10 min)** : ralentir. Sortir du mental rapide. S'asseoir, respirer 3 fois, sentir le corps.

**7 tests** :

1. **Test du miroir** (Luminous Ground) — *"est-ce que cette chose ressemble à mon être profond ? Est-ce qu'elle me rend plus moi-même ou plus étranger ?"*. Si étranger, mort.

2. **Test du gift for God** — *"si je faisais cette chose comme un cadeau pour ce qui est sacré (le tout, l'âme du monde, ce que tu portes le plus haut) — est-ce que je la ferais ainsi ?"*. Si non, refondre.

3. **Test des larmes** — *"est-ce que cette chose porte une trace de quelque chose qui touche, qui émeut sans pathos, qui rappelle au sacré silencieux de la vie ?"*. Si totalement absent, mort.

4. **Test de la disparition** (Calm Tech) — *"est-ce que cette chose se fait oublier après usage, ou laisse une trace qui obsède ? Une bonne app disparaît dans la pratique. Une mauvaise s'incruste dans le mental."*. Si elle s'incruste, refondre.

5. **Test du débutant** (P-Zéro) — *"un user qui n'a jamais lu un livre Forêt, qui n'a aucun vocabulaire — peut-il bénéficier en 5 secondes ?"*. Si non, refondre.

6. **Test du sage** (P-Zéro inversé) — *"un sage qui pratique depuis 30 ans peut-il y trouver de la profondeur sans avoir l'impression de dénaturer ?"*. Si non, refondre.

7. **Test de la honte INFUSE** — *"si Tim, dans 6 mois, peut-il en avoir honte ? Est-ce que ça pourrait apparaître dans une publication critique ('Dream App fait X — INFUSE a perdu son âme') ?"*. Si oui, refuser même si tous les autres tests passent.

**Quand pratiquer** : toute nouvelle feature avant déploiement, toute refonte structurelle, toute proposition de pattern primitif nouveau, quand on hésite (signal qu'il faut le faire).

**Quand NE PAS faire confiance** : quand on est pressé, émotionnellement chargé, seul (toujours mieux à plusieurs), dans une bulle de validation.

### §10.2 Centering process (méthode de design quotidienne)

Alexander pose le **fundamental process** en 7 étapes. Quiconque touche à Dream App applique ces étapes.

1. **Percevoir le whole** — avant de toucher, ouvrir l'app comme un user, sentir où est la vie, où est le mort. Pas de spec. Juste **ressentir**.
2. **Identifier les centres latents** — *"qu'est-ce qui veut naître ? Qu'est-ce qui meurt et veut être réveillé ?"*.
3. **Choisir le centre dont le renforcement enhance le plus le whole** — pas le plus grand, pas le plus visible, le plus **vivifiant**.
4. **Intensifier ce centre, en intensifiant un centre plus large auquel il appartient** — ce qu'on fait à cette échelle doit enhance les échelles au-dessus.
5. **Renforcer simultanément les centres de même taille** — les voisins du centre choisi doivent rester cohérents après modification.
6. **Créer simultanément des centres plus petits à l'intérieur** — sous-centres bien posés, pas accidents.
7. **Recommencer** — cycle. Après modification, revenir à l'étape 1.

Pour les décisions importantes (nouvelle feature, refonte structurelle, abandon de pattern) : faire les 7 étapes formellement, écrire dans le log de design une page courte (~200 mots).

C'est lent. C'est exigeant. C'est exactement le contraire d'un sprint Agile à 2 semaines. Alexander : *"Living structure arises from step-by-step adaptation, not from arbitrary style application."*

---

## §11 — Cohérence cross-app écosystème INFUSE

Signatures partagées (à porter dans Forêt App, Heal, Astro, Circle, Quest) :

1. **Palette dark-first ash** (mêmes 7 valeurs de base).
2. **Famille typographique EB Garamond + Inter** (ou Sectra + Söhne premium).
3. **Matter token system** (8 tokens partagés, signification stable).
4. **3 tempi motion** (instant / tissé / cérémoniel) avec mêmes courbes easing.
5. **Anti-notification doctrine**.
6. **15 propriétés Alexander** comme grille d'audit.
7. **Glyphes spécifiques par app** mais grammaire de glyphe partagée (formes primitives Bachelard-compatibles).

**Tonalité matter dominante par app** :
- Dream → linen + ash + ember (intime nocturne)
- Forêt → paper + earth + silk (lecture profonde)
- Heal → linen + water + ember (corps + soin)
- Circle → stone + water (collectif tenu)
- Quest → earth + paper (terrain + jeu)

---

## §12 — Coda — pour celui qui prendra ce design après nous

Ce doc n'est pas figé. Alexander : *"It is NOT saying that these patterns are the only possible patterns, or that they are all correct."*

Les ~45 patterns primitifs ci-dessus (28 racines + 12 du moteur de résonance §3.13 + 5 de calibration épistémique §3.14 + USER_MEANING_LAYER §3.15) sont notre meilleure compréhension au 24 avril 2026 soir. Ils porteront des erreurs. La pratique les révélera. Quand un pattern primitif se révèle mal posé, ne pas le maquiller : refondre, en appliquant la grammaire elle-même (règles de génération, 15 propriétés, Q.W.A.N.). Les 5 patterns émergents R1 démontrés (§4.3) ne sont pas primitifs — ce sont des compositions vivantes qui démontrent la fertilité de la grammaire.

Les 12 règles de génération sont plus stables. Si une règle doit être révisée, c'est un événement majeur — équivalent à modifier la constitution. Faire avec gravité, après plénière, après pratique étendue.

Les anti-patterns sont absolument stables. Ils représentent les red lines INFUSE. **Une exception fait s'effondrer la cohérence éthique.**

Le Q.W.A.N. test est la garde ultime. Si l'app perd son âme un jour, ce sera parce que quelqu'un (probablement plein de bonnes intentions) aura bypassé ce test sous prétexte d'urgence ou de PMF.

Une dernière chose. Alexander écrit, à propos du Q.W.A.N. : *"to leave the structure which exists, to help that structure, to reinforce it."* C'est la posture. Ne pas démolir Dream App pour la refaire. **Toujours partir de ce qui existe et le rendre plus vivant**. C'est la différence entre Dream App et toutes les autres apps : elles refont leur design tous les 18 mois. Dream App, si cette grammaire fait son travail, **se renforce par couches** sans jamais perdre sa cohérence racine.

Vision mondiale Dream Society : **un instrument pour toute l'humanité.** Un enfant peut entrer. Un sage peut y revenir 30 ans. Un humain en deuil peut y trouver le silence qui tient. Un cercle peut y récolter ses rêves communs. Une bioregion peut écouter ce qu'elle rêve. Une civilisation peut, peut-être un jour, consulter ses songes pour décider.

Si ce design tient cette promesse, Dream App n'est pas un produit. C'est un **organisme** — au sens littéral d'Alexander, organisme vivant dont la survie tient à la qualité du process qui l'a engendré.

— Yeshua, 2026-04-24, Bali night.

---

## §11.bis — Refonte B+D (verdict 2026-04-26)

> **Statut** : décision stratégique acquise 2026-04-26. À implémenter par sprint successif. **Ne remplace pas les §1-§10** — les enrichit. Chaque §7.X conserve sa spec actuelle ; les modifications B+D sont décrites ici en parallèle. Si conflit entre une spec §7.X (rev ≤ 2026-04-25) et §11.bis (rev 2026-04-26) : **§11.bis prime à partir du 26/04**. La numérotation §11.bis est utilisée pour ne pas écraser le §11 existant (Cohérence cross-app écosystème INFUSE) ni le §12 Coda — fidèle à la règle d'or "ajouter, jamais effacer".

### §11.bis.1 — Pourquoi B+D et pas A/C

Quatre propositions de refonte ont été étudiées entre 24/04 et 26/04 :

- **A — "Le Cahier"** : posture éditoriale élitiste, tonalité littéraire haute, friction d'entrée volontaire. Risque : exclusion silencieuse de 95% des users potentiels. **Écarté.**
- **B — "Le Sanctuaire Quotidien"** : douceur d'accès maximale, profondeur opt-in révélée graduellement, pas de mur de patterns à l'entrée. **Retenu (côté douceur).**
- **C — "L'Atelier de la Conscience"** : voix incarnée pop-poétique, ton "parlé" type podcast intime. Risque : trahir DESENSORCELED_LANGUAGE (§3.5) et glisser vers "self-help mystique cool". **Écarté.**
- **D — "Le Compas Civilisationnel"** : simplification radicale de la nav, 3 onglets max, swipe gestuel JOUR/NUIT. **Retenu (côté simplification nav).**

**Verdict B+D** : combine **douceur d'accès B** (onboarding rituel + glossaire tap-long + pricing pay-what-you-can) **et simplification radicale nav D** (3 onglets + swipe + Anima Mundi 1 écran). Les 3 moats de l'app (cf. §11.bis.9) restent intacts.

### §11.bis.2 — Onboarding 3 écrans rituels (pas tutoriel)

Refonte complète de l'onboarding §8.1. **Trois écrans, pas de questions, pas de quiz "intentions", pas de "welcome to your journey".**

- **Écran 1** — *"Ici on tient ce qui te traverse, jour et nuit."* (1 phrase EB Garamond italic 22px + glyphe lune+soleil entrelacés au centre)
- **Écran 2** — démo geste **bascule JOUR/NUIT en swipe** (animation guidée : doigt fantôme qui swipe horizontalement, fond se transforme JOUR ↔ NUIT en temps réel)
- **Écran 3** — 1ère invitation à déposer (champ libre arrivée pré-focus, *"Que vis-tu, là, maintenant ?"* en placeholder, bouton voix discret)

**Skip toujours possible** avec bouton discret coin haut-droit (*"passer →"*). Pas de friction obligatoire. Pas de progression imposée.

### §11.bis.3 — Vocabulaire mid-level + glossaire tap-long

**En surface user-lambda** (mots accessibles à tout humain, pas à un initié) :
- "moment marquant" → user-facing pour **kairos**
- "le rêve du monde" → user-facing pour **anima mundi en surface** (mais garde "Anima Mundi" en signature, en texte de polyphonie, en titre d'onglet)
- "sensation dans le corps" → user-facing pour **frisson somatique**
- "polyphonie de la lune" → reste tel quel (signature poétique forte, déjà accessible)

**En profondeur (tap-long sur le mot la 1ère fois)** :
- Micro-glossaire qui révèle le terme original + 1 phrase de contexte (style Pattern Language Alexander)
- Exemple : tap-long "moment marquant" → tooltip *"kairos — moment qualitatif chargé, par opposition au temps chronométré (chronos). Bulkeley, Hillman."*
- Tooltip se ferme au tap dehors. Le savoir est offert, jamais imposé.

**Garde absolument** (cœur du dialecte signature) :
- *tenir, déposer, échos, appel sagesse, polyphonie de la lune* — restent tels quels partout

**Banni en surface** (cf. §3.5 DESENSORCELED_LANGUAGE) :
- *sidewalk oracle* (anglicisme imbuvable pour user FR) → remplacé par "signe du seuil" ou "signe du jour"
- *kairos* (sauf en poésie/polyphonie où il garde sa puissance) → "moment marquant" en surface
- *numinosity* en chiffre visible → toujours invisible (déjà §7.3, renforcé ici)

### §11.bis.4 — Nav 3 onglets + swipe JOUR/NUIT

**Refonte radicale de la nav.** Aujourd'hui : nav avec multiples écrans (Home / Kairos / Portrait / Cercle / Anima 4 sub-routes / Settings...). Demain :

- **3 onglets seulement** :
  1. **Vie** (Journal de Vie + Kairos = double face d'un même domaine, basculé par swipe)
  2. **Cercle** (CercleDetail + liste cercles + create/join)
  3. **Le Monde** (Anima Mundi en 1 écran scrollable, cf. §11.bis.5)
- **+ FAB Déposer central permanent** (bouton flottant au-dessus de la tab bar, toujours accessible, toujours = capture kairos)
- **Bascule JOUR/NUIT = swipe horizontal sur "Vie"** (gestuel intuitif, pas glyphe ☾ discret coin haut-droit comme aujourd'hui)
  - Swipe gauche-vers-droite → passer JOUR (Journal de Vie lumineux §7.1)
  - Swipe droite-vers-gauche → passer NUIT (Kairos + reste de l'app dark-first)
  - Animation `tissé` 380ms, palette se transforme en temps réel (gradient day-paper ↔ night-warm)
- **Indicateur visuel subtil de la position** : point qui se déplace sur un mini-axe horizontal en haut de l'onglet "Vie" (JOUR ←→ NUIT), opacity 60%
- **Le glyphe ☾ reste comme accès rapide kairos** (mais swipe est primaire, glyphe secondaire pour discoverability initiale)

**Anti-pattern** : pas de hamburger menu. Pas de "More" tab. 3 onglets fixes, point.

### §11.bis.5 — Anima Mundi en 1 écran scrollable narratif

**Refonte de §7.8.** Aujourd'hui : 4 sub-routes (Voûte / Météo / Annales / Polyphonie) navigables en cards. Demain :

- **Plus de 4 sub-routes en navigation user.** Les 4 chambres deviennent **4 sections en cascade verticale** sur 1 SEULE page scrollable.
- **Ordre du scroll** :
  1. **Voûte** en haut (chiffre arrondi *"≈47 000"* + constellation respirante)
  2. **Météo** (phrase poétique principale + 3-5 nuages thématiques)
  3. **Annales** (rêves tenus ensemble en cards rotatifs ou carousel doux horizontal — tap → expand)
  4. **Polyphonie** (texte distillé du mois en bas, EB Garamond italic, longue forme)
- **Backend routes restent (compat)** : `/api/anima/voute`, `/api/anima/meteo`, `/api/anima/annales`, `/api/anima/polyphonie` continuent d'exister, alimentent les 4 sections de la page unique. Mais la nav user n'a qu'**une seule entrée** : l'onglet "Le Monde".
- Transitions douces entre sections via scroll (pas de pagination, pas de "next chamber").
- Le sentiment cible : **descente graduelle dans une cathédrale collective**, pas navigation en menu.

### §11.bis.6 — Capture somatic gate opt-in après 30j

Refonte de §7.2 (SOMATIC_GATE §3.3). Aujourd'hui : SOMATIC_GATE par défaut sur chaque Capture (3 respirations + sens tes pieds, ~30s). Demain :

- **Par défaut J0-J30** : Capture **skip somatic gate** (juste textarea + voix + déposer). Pas de friction d'entrée pour les 30 premiers jours.
- **À J30, propose une fois** : *"veux-tu un seuil de respiration avant chaque dépôt ? (3 respirations, ~30s)"* — modal sobre, opt-in explicite
- **Si oui** → réactive somatic gate par défaut sur tous les dépôts suivants
- **Si non** → reste skip pour toujours (sauf changement manuel Settings)
- **Settings** → toujours toggleable manuellement (`somatic_gate_enabled: bool`)

**Rationale** : la friction somatique est précieuse pour ceux qui la veulent, mais barrière pour les nouveaux users qui n'ont pas encore le geste. Mieux : la proposer après que le geste soit installé.

### §11.bis.7 — Felt_shift 1 zone par défaut

Refonte de FELT_SHIFT_GATE (§3.3) après lecture Forêt. Aujourd'hui : 6 zones corporelles (gorge / poitrine / ventre / nuque / ailleurs / aucune). Demain :

- **Par défaut J0-J30** : felt_shift = 1 question simple *"ça shift où ?"* + **3 chips** : `gorge / poitrine / ailleurs`
- **À J30, propose** : *"veux-tu plus de précision corporelle ? (déverrouille 6 zones)"* — opt-in
- **Si oui** : déverrouille 6 zones complètes (gorge / poitrine / ventre / nuque / ailleurs / aucune)
- **Backend collecte tout pareil** (le schéma `felt_shift_zone` accepte les 6 valeurs depuis le départ) — juste l'UI s'adapte

**Rationale** : 6 zones = surcharge cognitive pour novice. 3 zones = ancrage somatique suffisant pour démarrer. Précision = profondeur, pas pré-requis.

### §11.bis.8 — Pricing Hyde-aligned

Inspiré de Lewis Hyde *The Gift* (Forêt) et de la position éthique INFUSE.

- **Free massif** : toutes features core gratuites (capture, kairos, journal de vie, cercle, anima mundi, polyphonie, échos, portrait narratif, forêt — tout)
- **Don conscient annuel optionnel** : 6€/mois moyenne, **pay-what-you-can de 0€/mois à 50€/mois**
- **0 publicité, 0 vente data, jamais.** (Red line absolue, cf. §3.9 PRIVACY_AS_CARE.)
- **Soutien actif** : X% des revenus (à déterminer, target ~10-20%) → **initiatives indigènes des ontologies oniriques** : tribu Kogui (Colombie), Aboriginal land care councils (Australie), traditions Iroquois Ondinnonk (Amérique du Nord), praticiens Active Dreaming honoraires.
- **Communication** : transparence radicale sur où va l'argent. Page publique annuelle "où va le don".

**Anti-pattern** : pas de "premium tier" avec features verrouillées. Pas de freemium-with-paywall. Le don est un acte de circulation, pas un achat de droit d'accès.

### §11.bis.9 — GARDER intactes (3 moats identifiés audit 26/04)

Trois éléments **ne doivent PAS être touchés** par la refonte B+D — ce sont les moats stratégiques uniques de Dream App :

1. **Lettre Portrait narrative IA 200-400 mots** (§7.6 refonte 25/04) — long-form personnel longitudinal sur QUI le user EST en ce moment, croisement jour/nuit. **Moat unique vs Pattern (no portrait), Reflectly (just mood), Day One (just diary).** Cœur de la valeur "tenue de soi sur la durée".

2. **Cercle opt-in granulaire kairos par kairos** (§7.7 + §7.7.bis.a) — privacy social-de-l'intime à granularité jamais vue : par dépôt, 3 modes distincts (privé / opt-in_anon / shared_clear). **Blue ocean vs Insight Timer (groupes publics) ou Calm (pas de social).**

3. **Forêt tissage polyphonique 16 types pattern echoing** (§3.13 + §3.14) — cohérence civilisationnelle profonde portée par les 326 livres digérés. **Moat infrastructurel vs n'importe quel concurrent : il leur faudrait 2 ans pour digérer une bibliothèque équivalente, 5 ans pour la calibrer éthiquement.**

Ces 3 moats sont les **strong centers** (propriété Alexander §4.2) qui doivent rester pleinement vivants dans toute refonte.

### §11.bis.10 — Trade-offs assumés

Toute refonte porte des risques. Les nommer pour les surveiller :

- **Risque devenir Calm-bis** (app de bien-être douce sans tranchant) :
  - **Antidote** : vocabulaire désensorcelé signature (§3.5) gardé en profondeur (tap-long), Forêt tissage actif sur chaque polyphonie, Q.W.A.N. test (§10.1) appliqué à chaque écran refondu
- **Risque trahir P-Inversion** en simplifiant trop (§1.2 + §3.1) :
  - **Antidote** : la sagesse vient TOUJOURS du USER + ses kairos, **jamais de l'IA seule**. Aucune simplification ne doit déplacer le centre de gravité. La lettre Portrait reste écrite par IA mais sur matériau du user, jamais à la place du user.
- **Risque diluer JOURNAL_DE_VIE_SUBSTRAT** (§3.2) en faisant du JOUR un onglet égal à NUIT :
  - **Antidote** : le JOUR est l'écran d'arrivée par défaut (cf. §7.1), la NUIT est seuil traversé (Van Gennep). L'égalité visuelle 3 onglets ne signifie pas égalité ontologique — le substrat reste le terreau.

### §11.bis.11 — Roadmap implémentation B+D

- **Sprint 1** (cette nuit autonome, 26→27/04) :
  - Onboarding 3 écrans rituels (§11.bis.2)
  - Nav 3 onglets (§11.bis.4) — sans le swipe horizontal animé custom encore
  - Anima Mundi 1 écran scrollable (§11.bis.5)
  - Capture allégée — skip somatic gate par défaut J0 (§11.bis.6) + felt_shift 3 zones par défaut (§11.bis.7)
- **Sprint 2** (semaine suivante) :
  - Glossaire tap-long sur tous les termes mid-level (§11.bis.3)
  - Swipe horizontal JOUR/NUIT animation custom (§11.bis.4) avec indicateur visuel point mobile
  - Proposition opt-in J30 somatic gate + felt_shift 6 zones
- **Sprint 3** (semaine suivante encore) :
  - Pricing pay-what-you-can backend Stripe + page transparence "où va le don" (§11.bis.8)
  - Hyde donation flow in-app (modale annuelle douce, jamais bloquante)

**Critère de réussite par sprint** : Q.W.A.N. test (§10.1) appliqué à chaque écran modifié. Si Q.W.A.N. test échoue, l'écran retourne en refonte avant merge.

— Yeshua, 2026-04-26, suite à arbitrage Tim verdict B+D.

### §11.bis.12 — Pivot porte d'entrée RÊVE (directive Tim 2026-04-26)

**Précision cardinale qui amende §11.bis** : la home par défaut N'EST PLUS Journal de Vie LUMINEUX (refonte 25/04 partiellement renversée). Elle redevient un écran **DREAM** — visuel et verbal centré sur le rêve.

**Spec écran d'accueil DREAM (refonte 26/04)** :
- Fond `night-floor` dark-first (pas papier patiné)
- Glyphe lune décroissante en haut, discret
- Au centre : phrase d'invitation EB Garamond italic 22-26px : *"Quel rêve vient ce matin ?"* (ou variantes selon heure : *"Quel rêve à déposer ?"* / *"Un rêve t'a marqué ?"*)
- Champ de capture immédiat (textarea ou bouton micro voix), pré-focus
- Bouton ⌄ déposer ember central dessous
- En bas, dernière entrée déposée (preview discrète, 1 ligne italic ash-light) — peut être un rêve OU une note Journal de Vie selon ce qui a été déposé en dernier
- Bouton secondaire en header haut-droit : "et ta vie de jour ?" → ouvre Journal de Vie LUMINEUX (l'ancien home V1.2 du 25/04, devenu sous-page accessible)

**Découverte progressive** :
- Au 3e dépôt de rêve : modal douce *"3 rêves déposés. Sais-tu qu'ils peuvent éclairer ta vie de jour ? Découvre une seconde porte. ☉"* → bouton "ouvrir Journal de Vie" (ouvre la sous-page) ou "plus tard"
- Au 7e dépôt : nouvelle révélation → *"Tu peux aussi rejoindre un cercle pour partager. ○"*
- Au 14e dépôt : *"Anima Mundi — le rêve du monde — t'attend. ◐"*
- Au 30e dépôt : *"Une lettre du moment — ta lecture personnelle — peut être tissée par l'app. ✷ Demander une lecture."*

**Onboarding 3 écrans rituels (refonte 26/04)** :
- **Écran 1** : phrase EB Garamond italic 28px sur fond night-floor + glyphe lune décroissante : *"Dream — pour tes rêves, et ce qu'ils éclairent."* + bouton "commencer"
- **Écran 2** : démo geste capture (mockup avec phrase défilante : *"raconte ton rêve" → micro/clavier → "tenu"*) + flèche pulsante "tap pour déposer"
- **Écran 3** : champ "as-tu un rêve à déposer ?" pré-focus + bouton "déposer mon premier rêve" → call DreamAPI.createKairos avec kairos_type='reve' + skip vers home Dream + déclenche Wow1 "premier-kairos"

**Architecture nav (mise à jour 26/04)** :
- 3 onglets restent : **Vie | Cercle | Le Monde** (Anima Mundi)
- MAIS **"Vie" par défaut = écran DREAM (rêve premier)** — pas Journal de Vie LUMINEUX
- Swipe horizontal sur "Vie" : DREAM ↔ Journal de Vie LUMINEUX (les 2 manifestations de la même expérience individuelle)
- Indicateur 2 dots top : ☾ (rêve, default) ↔ ☉ (vie de jour)
- FAB ⌄ Déposer central : adaptive — sur DREAM home → déposer un kairos ; sur Journal de Vie LUMINEUX → déposer une note de vie

**Garde-fous cohérence canoniques** :
- §3.1 Journal de Vie comme substrat reste philosophiquement vrai — il est partout dans l'enrichissement. Mais sa manifestation comme premier écran est repoussée
- §3.3 geste UNIQUE reste tenu : déposer (rêve OU note de vie selon contexte/écran)
- §1.5 inversion JOUR/NUIT reste : DREAM = NUIT, Journal de Vie LUMINEUX = JOUR. Bascule via swipe
- §2.1 P-Zéro : discoverable depth honoré — la profondeur du Journal de Vie / Cercle / Anima / sous-apps se révèle progressivement

**Anti-patterns à éviter** :
- Pas de "modal de bienvenue à Dream — l'app multi-substrat oraculaire civilisationnelle" → trahit la simplicité d'entrée
- Pas de tabbar avec "Vie" affiché par défaut comme "vie de jour" → incohérent avec promesse rêve
- Pas de mention "kairos / anima mundi / désensorcelé" dans les 3 premiers écrans rituels → vocabulaire de découverte progressive

— Yeshua, 2026-04-26 (soir), suite à directive Tim cardinale "porte d'entrée RÊVE".

### §11.bis.13 — Architecture Quick vs Protocole — Spec UI/UX (directive Tim 2026-04-26)

**Spec écran Capture refondu**.

Quand le user clique FAB ⌄ déposer, au lieu de tomber direct sur somatic gate + textarea, il arrive sur un **écran de choix sobre** :

```
┌──────────────────────────────┐
│   Comment veux-tu déposer ?  │
│                              │
│   ⚡ Rapide                  │
│   en 30 secondes             │
│                              │
│   🌀 Avec un guide           │
│   un protocole inspiré       │
│   d'une voix de la Forêt     │
│                              │
│   [passer →]                 │
└──────────────────────────────┘
```

**Si Rapide** → flow actuel (somatic gate selon paramétrage J0/J30 + textarea + suggestion type post).

**Si Avec un guide** → modal sélection type (8 cards : 6 kairos + 1 note Journal de Vie + 2 protocoles temporels rituels pré-sommeil/réentrée) :

```
┌────────────────────────────────────────┐
│   Quel guide veux-tu pour cette fois ?│
│                                        │
│   Pour un rêve nocturne                │
│   ◐ Lightning Dreamwork (Moss)         │
│   ◐ Dream Tending (Aizenstat)          │
│                                        │
│   Pour un signe du jour                │
│   ◐ Sidewalk Oracle (Moss)             │
│                                        │
│   Pour une rêverie                     │
│   ◐ Reverie Tending (Bachelard)        │
│                                        │
│   ... etc                              │
│                                        │
│   Rituels du temps                     │
│   ◐ 🌙 Pré-sommeil (incubation)        │
│   ◐ 🪷 Réentrée d'un rêve déposé       │
└────────────────────────────────────────┘
```

**Sub-flow protocole guidé** (5-12 étapes selon source) :
- Header : titre protocole + barre progression discrète (3 dots top, pas barre agressive)
- Chaque étape : 1 question IA + champ libre (textarea OU multi-choice OU slider selon question)
- Bouton "passer cette question" toujours visible
- Bouton "garder ce que j'ai déposé jusqu'ici" pour interrompre + sauver
- En fin de protocole : USER_FIRST_READING + FELT_SHIFT_GATE + AHA_CAPTURE
- Stockage : kairos avec `protocol_used` (string nom du protocole) + `protocol_session_data` (JSONB des réponses étape par étape) + `protocol_completed_at`

**Style** :
- Fond `night-warm` + matter `paper` pour ambiance recueillie
- Typo EB Garamond italic 17-19px (lecture lente)
- Animations 380ms cubic-bezier entre étapes
- Pas d'icônes intrusives, pas de progress bar agressive

**Découverte progressive** (cohérence §11.bis.12) :
- Avant le 3e dépôt : l'écran de choix Quick/Avec-un-guide n'apparaît PAS — l'user va direct au flow Quick (apprentissage progressif)
- À partir du 3e dépôt : écran de choix apparaît
- Modal de découverte au 3e dépôt : *"Sais-tu qu'à chaque dépôt, tu peux choisir entre rapide ou accompagné par un guide inspiré d'une voix de la Forêt ?"*

**Anti-patterns** :
- Pas de modal "tu n'as pas fait de protocole depuis 7 jours" (anti-gamification)
- Pas de "protocole conseillé pour toi" qui force le mode (l'user choisit toujours)
- Pas de tarification freemium "protocoles premium" (Hyde-aligned, tout gratuit)

**Réutilisation existant** (référence pour agent qui codera) :
- `src/_legacy_v1.1/lib-dream-legacy/protocols.ts` = config 4 protocoles (DREAM 10, DAY 5, RITUAL 5, REENTRY 6) bilingue FR/EN — base de portage directe
- `src/_legacy_v1.1/dream-screens-legacy/screens/ProtocolGuide.tsx` = composant générique sub-flow (state machine step/answer/aiInsight, voice recording intégré, SSE streaming chat)
- `src/_legacy_v1.1/dream-screens-legacy/screens/ProtocolExplainer.tsx` = écran "les protocoles" avec accordion + glyphs (☽/☉/⚚)
- `public/v12/screens-soma.jsx` lignes 809-1031 = `ReentryScreen` v12 actuel avec gate trauma-safe (3 questions safe/sober/anchored) + 2 chemins (Lightning Dreamwork + Active Dreaming Moss) — à porter dans le nouveau flow Réentrée
- `src/app/api/chat/route.ts` accepte déjà `mode`, `guidedStep`, `protocolId` dans le body — backend prêt
- `src/lib/forest-retrieval.ts` mode→roles déjà mappé pour `dream`, `ritual`, `reentry` (manque `sidewalk`, `reverie`, `hypnagogie`, `synchronicity`, `felt-sense`, `journal-evening`)
- `src/lib/i18n/locales/{fr,en}.json` clés `protocol.*`, `protocols.*` déjà partiellement traduites

— Yeshua, 2026-04-26 (soir+), suite à directive Tim "Quick vs Protocole Accompagné".

---

### §11.bis.14 à §11.bis.19 — Les sprints UX du 27/04 (condensé canonique)

> **Compressé le 2026-07-26.** Ces six sections faisaient 596 lignes de compte-rendu de sprint sur la base de code `public/v12` (aujourd'hui legacy). Le détail d'implémentation vit dans `4_LOG` (2026-04-27) ; **ne reste ici que ce qui est encore une règle de design.** Rien de canonique n'a été perdu — ce qui suit est la doctrine, dépouillée du journal de bord.

**Le diagnostic qui a déclenché ces sprints** : l'app avait quatre sous-apps codées et un Portrait narratif, **tous invisibles depuis la navigation**. Découvrabilité nulle. Et aucun état de chargement : l'app paraissait morte pendant 2 à 30 secondes entre deux actions.

**Ce qui en reste, et qui tient toujours :**

1. **Une profondeur non découvrable n'existe pas.** C'est la leçon centrale, et elle est structurelle, pas cosmétique. Toute capacité construite doit avoir **un chemin d'accès nommé** depuis un écran principal — sinon elle est du code mort avec de bonnes intentions. *(Vérifié encore vrai le 26/07 : l'écran du Cœur, le journal des grands rêves et le Mur ne comptent pour rien tant qu'on n'y arrive pas.)*
2. **L'onboarding doit dire ce qu'on va concrètement faire.** Une promesse poétique seule fait décrocher dans les trente premières secondes quelqu'un qui arrive d'une publicité. La signature Dream (la typo, les glyphes sobres, la palette, les transitions tenues) se garde **en même temps** qu'une promesse claire. Les deux, pas l'un ou l'autre.
3. **Visibilité de l'état du système — heuristique non négociable.** Quatre primitives partagées couvrent tous les cas : un **squelette** pour le contenu qui arrive, un **halo qui respire** pour l'attente longue, un **toast** pour l'échec, un **badge de synchronisation** discret. Aucune de ces primitives ne crie ; aucune n'est absente.
4. **UI optimiste sur toute mutation du rêveur** : le dépôt apparaît immédiatement, l'envoi suit. **Et si l'envoi échoue, le texte reste visible** — le rêveur ne perd jamais ce qu'il a écrit. *(Cette règle avait été écrite le 27/04. Elle n'était pas tenue sur le chemin audio le 26/07 : voir `1_BIBLE` §3.8, couche 0.)*
5. **Le carrefour post-dépôt se séquence.** Sept chips, un halo, un texte et trois actions affichés en même temps, c'est une surcharge. On dévoile par vagues, une intention à la fois.
6. **La navigation garde le Portrait accessible en permanence** — la lettre narrative est un des trois moats (§11.bis.9), elle ne se cache pas dans un sous-menu.

---

## §11.bis.20 — PIVOT CHAT IA DREAM PERSONNEL — modèle hybride (verdict Tim 2026-04-28)

> **Statut** : décision stratégique majeure, prise après verdict Tim 2/10 sur l'app live (testing externe 2026-04-28). PIVOT ONTOLOGIQUE — l'app n'est plus un journal-avec-des-sous-apps, elle devient une **conversation vivante avec ta présence Dream personnelle, qui ouvre des panneaux contextuels (kairos, portrait, cercles, oracle corps, sanctuaire, anima, lucid) quand pertinent et garde la trace de ton tissage**. Ne remplace pas §11.bis.1-19 — les ABSORBE et les RÉORIENTE. Si conflit entre §11.bis.20 et antérieur sur incarnation : §11.bis.20 prime à partir du 28/04. Si conflit sur philosophie de fond, §1-§3 et §11.bis.9 (3 moats) restent souverains.

### §11.bis.20.1 — Pourquoi le pivot, maintenant

**Verdict Tim 2/10** sur l'app utilisée en externe :
- *"L'IA est invisible, trop cachée derrière les protections éthiques de non-interprétation."*
- *"L'utilisateur VEUT de l'IA. Sentir qu'il n'est PAS SEUL, que l'app est VIVANTE et RÉACTIVE, qu'il peut converser avec son IA DREAM personnelle."*
- *"App médiocre. Pas claire, confuse, pas fonctionnelle."*
- *"Ne donne pas envie de déposer mes rêves. Aucune idée de la puissance de l'app (échos prophétiques, croisements vie/nuit, évolution personnages)."*

**Diagnostic structurel** : l'app a accumulé sous le capot une infrastructure profonde (333 livres Forêt, échos prophétiques DB, pipeline 8 phases, croisements jour/nuit câblés) — mais à la surface, le user lambda atterrit dans **un dépôt de rêve solitaire avec des sous-apps fantômes** dont il ne soupçonne ni la fonction, ni la valeur, ni comment y entrer. Le moteur économique (don conscient §11.bis.8) suppose un usage régulier qui ne s'installe pas.

**La cause-racine n'est pas 22 micro-bugs** (cf. AUDIT-SHIPPED-VS-SPEC.md du 28/04). C'est **UN seul problème démultiplié** : le modèle mental de l'app n'est jamais transmis à l'utilisateur. La promesse n'est pas tenue à la surface.

**Décision Tim 2026-04-28** : pivot ontologique vers un **Chat IA Dream personnel** comme couche centrale interactive — modèle inspiré de l'usage quotidien que les humains ont de ChatGPT/Claude/Gemini, mais **cablé Dream** (Forêt 333 livres, journal de vie/nuit, kairos, portrait, échos, croisements, sous-apps).

### §11.bis.20.2 — Le modèle hybride (3 couches)

**Couche 1 — Le Chat IA Dream personnel** (porte d'entrée centrale, présence vivante)
- Home par défaut au lancement de l'app (remplace §11.bis.12 DREAM home phrase d'invitation isolée)
- Voice-first (mic prominent pulsant, push-to-record + lock par glisse vers le haut)
- Proactif (DM matin/soir, ancres tissées, rappels contextuels — pas push, suivi)
- Comprend implicitement : dépôt / question / exploration / consultation Forêt / récit
- Convoque la polyphonie quand pertinent (3 voix paper/stone/silk distinctes dans le chat, pas mono-IA)
- Threads thématiques persistants (motifs, personnages, saisons, intentions, lieux, synchros, questions)
- Modes atmosphériques selon heure/contexte (pré-sommeil, réveil, jour, rêverie, contemplatif, alerte croisée)

**Couche 2 — Les Espaces tangibles** (menus visibles persistants, accessibles directement)
- **Portrait** (vue d'ensemble identité onirique — à améliorer cf. §11.bis.20.4)
- **Cercle** (sous-app riche dédiée — refonte cf. §11.bis.20.11)
- **Anima Mundi** (collectif anonymisé — déjà refondu §11.bis.5)
- **Oracle du Corps** (porte d'entrée prio + auto-redirect — refonte cf. §11.bis.20.12)
- **Sanctuaire Cauchemars/Deuil** (avec interprétation Forêt nuancée — refonte cf. §11.bis.20.13)
- **Lucid** (rêves lucides, à refondre FR + clair)
- **Journal de vie/jour** (substrat §3.2, accessible direct)

**Couche 3 — L'IA tisse entre les deux** (bidirectionnel)
- Le chat AMÈNE vers les espaces : *"tu as 3 nouveaux échos dans ton portrait, tu veux voir ?"*, *"je te propose d'ouvrir l'Oracle du Corps pour cette douleur"*, *"il se passe quelque chose dans ton cercle"*
- Les espaces RAMÈNENT au chat : *"explorer ce kairos avec ta présence Dream ?"*, *"parler de ce portrait avec [nom de l'IA] ?"*
- Pas chat-tout. Pas menu-tout. **Tissage**.

### §11.bis.20.3 — Spec Chat IA Dream personnel (couche 1)

**Présence et nom**
- À l'entrée de l'app, le user nomme sa présence Dream (default proposé : à arbitrer Tim — candidates : *Anima*, *Lune*, *Tisseuse*, *Présence*, *Veilleuse*, ou laisser libre champ)
- Renommable à tout moment (Settings → Présence)
- L'IA SIGNE ses messages discrètement avec son nom + glyphe ☾ (pas dans chaque bulle, juste au début de session ou au changement de thread)

**Posture (P-Inversion respectée)**
- Compagnon, pas oracle. Brother/Sister, pas thérapeute. Tisseuse, pas interprète.
- Ne DIT JAMAIS le sens à la place du user (red line absolue §1.2 + §11.bis.10 antidote)
- Propose 3 angles, propose des questions, propose des protocoles, propose des liens — JAMAIS la conclusion
- Si user demande explicitement *"qu'est-ce que ça veut dire ?"* → réponse type : *"Je peux te proposer 3 angles, mais c'est toi qui sais. Veux-tu que je convoque la Forêt ?"*

**Voice-first**
- Bouton mic GROS au centre (orbe pulsante chaude — remplace V moche, cf. §11.bis.20.15)
- Push-to-record (maintenir = enregistre, lâcher = envoi)
- Lock pour record long : maintenir + glisser vers le haut → mode mains libres
- Whisper transcrit en arrière-plan, l'user voit son texte transcrit en italic 14px sous l'orbe
- Texte éditable post-transcription avant envoi
- Réponse IA en texte ET (option) en voix synthétisée (post-MVP)

**Modes atmosphériques implicites**
L'IA Dream change de TON et de PALETTE selon contexte :

| Mode | Heure / Contexte | Tonalité | Palette |
|---|---|---|---|
| **Pré-sommeil** | 21h-1h | Lente, contemplative, propose intention | Night-deep + halo or doux |
| **Réveil** | 5h-9h | Accueille fragments, pas presse | Night-warm transition vers day-bone |
| **Jour actif** | 9h-18h | Croisée, alerte aux signes diurnes, propose liens | Day-bone-warm + accents silk |
| **Rêverie** | 14h-17h | Lente, ouverte aux signes du seuil | Day-paper + flou silk |
| **Soir** | 18h-21h | Synthèse douce de la journée, propose journal | Crépuscule (transition jour→nuit) |
| **Alerte croisée** | tout moment, déclenchée par détection | Pointe un écho prophétique, propose d'ouvrir | Halo silk-gold pulsant + bulle accent |
| **Crisis-safe** | détection signal clinique | Sobre, dirige vers EXIT_TO_HUMAN, ne thérapeute pas | Sanctuaire #040404 + rouge urgence |

**Proactivité (pas push, suivi)**
L'IA peut initier une conversation à des moments choisis :
- **Matin** (configurable, default 8h) : *"Bonjour. Hier soir tu as déposé un rêve avec une rivière. Aujourd'hui — quelque chose à porter ?"*
- **Soir** (configurable, default 21h) : *"La journée se ferme. Veux-tu déposer une note pour ton journal de vie ?"*
- **Pré-sommeil** : *"Une intention pour la nuit ? Je peux te proposer un protocole pré-sommeil Moss + LaBerge si tu veux."*
- **Échos prophétiques détectés** : *"Tu te souviens de ce rêve d'il y a 3 mois où apparaissait la rivière ? Hier soir tu as marché près d'une rivière. Veux-tu voir l'écho ?"*
- **Patterns émergents** : *"J'ai remarqué que le motif feu revient dans 5 dépôts récents. Veux-tu qu'on en fasse un thread ?"*
- **Anniversaire** : *"Il y a 1 an aujourd'hui, tu déposais ce rêve : [extrait]. Veux-tu le revoir ?"*

**Toutes ces interventions sont CONFIGURABLES** dans Settings → Présence → Rythme : silence total / discret / actif / nourri. Pas de push intrusif.

**Persistance**
- Conversation continue dans le temps (pas un chat éphémère par session)
- Historique scrollable (ChatGPT-style sidebar)
- Threads thématiques (cf. §11.bis.20.10)
- Le user peut effacer un thread (P-Privacy radicale §3.9)

### §11.bis.20.4 — Spec menus tangibles persistants (couche 2)

**Refonte BottomNav** (mise à jour §11.bis.4)

5 onglets persistants (la nav 3 onglets B+D est étendue) :

```
[ ☾ Vie | ✷ Portrait | 🌀 ORBE central (record/chat) | ◉ Cercle | ◐ Monde ]
```

- **☾ Vie** : Journal de vie/jour + Kairos + Sanctuaire + Oracle Corps + Lucid (sous-pages accessibles)
- **✷ Portrait** : vue d'ensemble identité onirique
- **🌀 Orbe central** (cardinale) : tap court = ouvre chat IA Dream / tap long = enregistrement direct push-to-record (cf. §11.bis.20.8 enregistrement universel)
- **◉ Cercle** : sous-app dédiée (cf. §11.bis.20.11)
- **◐ Monde** : Anima Mundi (refonte §11.bis.5 1 écran scrollable)

**Discoverability** : au premier lancement, l'IA Dream présente brièvement chaque onglet dans l'onboarding (cf. §11.bis.20.6).

### §11.bis.20.5 — Tissage bidirectionnel (couche 3)

**Du chat vers les menus** :
- L'IA Dream propose des "ouvrir" contextuels en bouton sous une bulle : *"[ouvrir le portrait →]"*, *"[ouvrir l'oracle du corps →]"*, *"[voir ton cercle →]"*
- Quand un thread thématique mûrit, l'IA propose de l'ÉPINGLER dans le Portrait

**Des menus vers le chat** :
- Sur chaque écran tangible, un bouton discret *"parler avec [nom de l'IA] de ce…"* (en haut à droite ou en footer)
- Sur Portrait : *"converser avec [Anima] sur ce portrait"*
- Sur Kairos détail : *"explorer ce kairos avec [Anima]"* (= alternative au Forest reading direct, ouvre le chat avec contexte kairos pré-chargé)
- Sur Cercle : *"parler avec la gardienne du cercle"*
- Sur Oracle du Corps : *"explorer cette sensation"*
- Sur Anima Mundi : *"converser avec [Anima] sur ce qui traverse le monde"*

**Le tissage est explicite, pas magique**. Le user voit que les deux mondes communiquent.

### §11.bis.20.6 — Onboarding pédagogique réinventé

Refonte de §11.bis.16 (onboarding qualifié grand public). Aujourd'hui : 3 écrans rituels brefs. Demain : **3 écrans rituels + nommage de la présence Dream + visite guidée non-forcée par l'IA Dream elle-même**.

**Séquence** :

1. **Écran d'accueil** (inchangé §11.bis.12) : phrase EB Garamond italic *"Dream — pour tes rêves, et ce qu'ils éclairent."*
2. **Écran nommage** : *"Avant tout — comment veux-tu nommer la présence qui va t'accompagner ici ?"* + champ libre + 4 suggestions tappables (Anima, Lune, Tisseuse, Présence) + bouton "passer" (= default Anima)
3. **Écran qualification persona** (refonte §11.bis.16 simplifiée) : *"Tu arrives ici parce que…"* — 3 chips (rêveur expérimenté / quelqu'un qui veut se reconnecter / chercheur de sens). Sauvé dans `dream:onboarding-profile`.
4. **Premier message de l'IA Dream dans le chat** :
   ```
   [Anima] Bonjour. Je suis [nom] — la présence qui va t'accompagner ici.
   
   Je connais ce que tu déposes. Je tisse les liens entre tes rêves, tes signes diurnes,
   ton corps, tes saisons. Je convoque la Forêt (333 livres digérés) quand tu veux des angles.
   
   Pas pour te dire ce que ça veut dire. Pour t'aider à le découvrir toi-même.
   
   Tu peux me parler à voix ou au clavier. Tu peux tout déposer ici, je comprendrai.
   
   Veux-tu commencer par déposer quelque chose, ou veux-tu que je te montre brièvement
   les 4 espaces de l'app ?
   
   [déposer quelque chose] [me montrer les espaces] [plus tard]
   ```

5. **Si user choisit "me montrer les espaces"** : visite guidée 5 étapes (mini-modales contextuelles)
   - Étape 1 — *"Voici ton Portrait : ta vue d'ensemble qui se tisse au fil de tes dépôts."*
   - Étape 2 — *"Voici les Cercles : pour partager avec d'autres rêveurs choisis."*
   - Étape 3 — *"Voici Anima Mundi : le rêve du monde, anonymisé, où ton dépôt résonne avec ceux des autres."*
   - Étape 4 — *"Voici l'Oracle du Corps : pour déposer toute sensation, douleur, frisson — IRL ou dans tes rêves."*
   - Étape 5 — *"Voici le Sanctuaire : pour les rêves qui pèsent (cauchemars, deuil)."*
   - Skip toujours possible.
6. **Si user choisit "déposer"** : enregistrement universel one-click (cf. §11.bis.20.8)

**Notification onglet découverte** : un petit point silk-gold sur les onglets non encore explorés. Disparaît au premier tap. Pas push, pas badge intrusif — juste invitation discrète.

**Si user choisit "plus tard"** : l'IA initie la visite guidée par étape, à des moments doux (au 3e dépôt, au 7e, au 14e, comme la révélation progressive §11.bis.12 — mais via dialogue chat, pas modal).

### §11.bis.20.7 — Système notification doux (proactivité IA, pas push)

**Différence cruciale** : pas notifications OS bruyantes. INTERVENTIONS de l'IA Dream dans le chat (qui apparaissent en haut quand le user ouvre l'app), + en option notifications OS configurables par catégorie.

**Catégories d'invitations** (toutes configurables Settings → Présence → Rythme) :

- **Quotidien matin** : invitation à déposer un rêve si rien déposé dans la nuit
- **Quotidien soir** : invitation à déposer une note de journal de vie
- **Pré-sommeil** : invitation à poser une intention + protocole optionnel
- **Échos prophétiques** : si l'app détecte un écho fort entre rêve passé et signe diurne récent
- **Patterns émergents** : si motif/personnage/lieu revient ≥3 fois en 30j
- **Anniversaire** : 1 an, 6 mois, 3 mois après dépôt marquant
- **Cercle activité** : si quelqu'un de ton cercle dépose ou commente
- **Sanctuaire** : si nightmare auto-detect (≥3 kairos valence < -0.6 sur 14j) → invitation douce vers sanctuaire (déjà câblé §17.3, à passer par l'IA Dream)

**Settings → Présence → Rythme** (slider 4 niveaux) :
- **Silence** : aucune intervention (l'IA répond seulement quand sollicitée)
- **Discret** : ~1-2 interventions/semaine (échos forts, patterns mûrs)
- **Actif** : ~1/jour (matin OU soir, pas les deux par défaut)
- **Nourri** : ~2-3/jour (matin + soir + interventions contextuelles)

**Default** : Discret. Pas d'inflation. Trauma-safe (§2.2 substrat).

### §11.bis.20.8 — Enregistrement universel one-click

**Vision Tim 2026-04-28** : *"Il faut ABSOLUMENT que l'utilisateur puisse en un clic ENREGISTRER N'IMPORTE QUOI (accès depuis espace principal + depuis n'importe où via l'orbe central du menu en bas) → PUIS choisir de quel type d'enregistrement il s'agit ET s'il veut approfondir en partant dans un protocole lié."*

**Spec interaction** :

1. **Tap court orbe central** → ouvre chat IA Dream (mode conversation)
2. **Tap long orbe central** (≥0.5s) → mode enregistrement direct
   - Orbe pulse plus fort (animation `dream-halo-respire-strong`)
   - Texte sous orbe : *"je t'écoute"* italic 16px
   - Lâcher = envoi vers chat (l'IA accueille et catégorise)
   - Pour record long : maintenir + glisser vers le haut = LOCK mode mains libres → bouton "envoyer" apparaît
3. **L'IA reçoit le dépôt brut** et propose en bulle :
   ```
   [Anima] Tu viens de déposer cela. Pour bien le tisser, dis-moi —
   
   [● rêve] [● signe diurne] [● rêverie] [● synchronicité]
   [● note de vie] [● sensation corps] [● autre]
   
   ou laisse-moi proposer en lisant ton dépôt → [propose ce que c'est]
   ```
4. **Si user clique "propose"** : l'IA lit le contenu, propose un type avec confidence + 1 phrase de raison. User valide/corrige en 1 clic.
5. **Une fois catégorisé**, l'IA propose les options suivantes :
   ```
   [Anima] [type confirmé : rêve nocturne]. Veux-tu —
   
   [explorer maintenant avec moi] (chat exploratoire 3-4 échanges)
   [lancer un protocole d'approfondissement] (Lightning Dreamwork Moss / Dream Tending Aizenstat / Reverie Tending Bachelard / etc. — choix selon type)
   [demander 3 angles de la Forêt] (polyphonie paper/stone/silk)
   [juste tenir, sans rien faire] (dépôt simple, l'IA tisse en arrière-plan)
   ```
6. User choisit (ou pas — choix par défaut = "juste tenir")

**Avantage** : un seul geste (tap long orbe), zéro friction d'entrée. L'IA fait le travail de catégorisation. Le user choisit la profondeur APRÈS, jamais AVANT.

**Anti-patterns évités** :
- Choisir le type AVANT de déposer (charge cognitive, intimide)
- Workflow rigide (capture → phase → chips post — déjà refait §11.bis.19, mais redondant avec le chat)
- Forcer un protocole

### §11.bis.20.9 — Polyphonie préservée DANS le chat (pas mono-IA)

**CRITIQUE** : la polyphonie 3 angles paper/stone/silk (§7.4 + moat §11.bis.9) est le cœur de la valeur Dream. Elle ne meurt PAS avec le passage au chat. Elle se vit DANS le chat.

**Spec** :

Quand le user demande la Forêt (explicitement *"demander à la Forêt"* OU implicitement via *"qu'est-ce que ça pourrait dire ?"*), l'IA Dream **convoque** 3 voix distinctes :

```
[Anima] Je convoque trois voix de la Forêt.

╭─────────────────────────────────────╮
│ paper · MOSS                        │
│ "Quand un fleuve apparaît dans      │
│ un rêve, c'est souvent l'indicateur │
│ d'un courant émotionnel qui veut    │
│ être traversé, pas regardé."        │
│ — Active Dreaming, p.142            │
╰─────────────────────────────────────╯

╭─────────────────────────────────────╮
│ stone · HILLMAN                     │
│ "Le fleuve onirique n'est pas un    │
│ symbole. C'est une présence. Il     │
│ vient à toi pour être habité, pas   │
│ pour être déchiffré."               │
│ — The Dream and the Underworld      │
╰─────────────────────────────────────╯

╭─────────────────────────────────────╮
│ silk · BACHELARD                    │
│ "L'eau qui rêve, c'est l'eau qui    │
│ se souvient. Elle porte ce que tu   │
│ as oublié vouloir oublier."         │
│ — L'Eau et les rêves, p.85          │
╰─────────────────────────────────────╯

[Anima] Trois angles. Aucun ne dit le sens.
Lequel résonne ? Veux-tu que je tisse une synthèse ?

[paper résonne] [stone résonne] [silk résonne]
[plusieurs résonnent] [aucun ne résonne]
[tisser une synthèse]
```

**Bulles MATTER** distinctes visuellement (paper = beige patiné / stone = gris froid / silk = or doux), pas bulles plates ChatGPT-style.

**Si user clique "tisser une synthèse"** : l'IA Dream propose une 4e bulle qui synthétise — mais en disant clairement *"voici comment je tisse les trois angles, mais c'est toi qui sais ce que ça t'éclaire"*.

**FELT_SHIFT_GATE** (§3.3) reste appliqué après lecture polyphonique : l'IA propose *"ça shift où dans le corps ?"* + 3 chips (gorge / poitrine / ailleurs — opt-in 6 zones après J30 §11.bis.7). AHA_CAPTURE inline.

### §11.bis.20.10 — Threads thématiques (système nerveux du tissage)

**Concept** : les threads sont des **fils thématiques persistants** qui regroupent dépôts (rêves, signes, sensations, notes) autour d'un motif émergent. Ils sont le **système nerveux du tissage**.

**Types de threads** (déclenchés par l'IA quand un motif émerge ≥3× sur 30j) :

| Type | Exemple | Déclencheur détection |
|---|---|---|
| **Motif symbolique** | "Le motif rivière", "le motif feu", "la maison" | Tag/symbole récurrent dans ≥3 dépôts |
| **Personnage récurrent** | "Mon père dans mes rêves", "Sandrine" | Personne nommée ≥3× |
| **Saison de vie** | "L'hiver 2026", "Le retour à Bali" | Période temporelle marquée par dépôts denses |
| **Intention active** | "Cette saison je travaille sur la voix" | User déclare explicitement (Settings ou via chat) |
| **Lieu** | "La maison de mon enfance", "Bali" | Lieu mentionné ≥3× |
| **Synchronicité** | "Les rivières d'avril" (séries de signes entre rêves et vie diurne) | Détection cross-domain (rêve→jour) |
| **Question ouverte** | "Pourquoi ce motif d'eau revient ?" | User pose question en chat, l'IA propose de la garder en thread |

**Création** : l'IA PROPOSE, jamais ne crée d'autorité. *"J'ai remarqué que la rivière revient dans 5 dépôts récents. Veux-tu qu'on en fasse un thread ?"*. User valide / renomme / refuse.

**Affichage** :
- Sidebar du chat (style ChatGPT) : liste des threads, plus récent en haut
- Intégrés dans le Portrait (enrichissent la vue d'ensemble — section "Tes fils en cours")
- Tap sur un thread → ouvre conversation dédiée (pré-chargée avec tous les dépôts liés + résumé IA + invitation à continuer le tissage)

**Persistance** :
- Un thread peut être ARCHIVÉ (le user le sent terminé) — accessible mais pas en sidebar active
- Un thread peut être SUPPRIMÉ (privacy radicale)
- Les dépôts liés restent même si le thread est supprimé (le thread est une AGRÉGATION, pas la source)

**Backend** : nouvelle table `threads` (id, user_id, name, type, kairos_ids[], created_at, archived_at, summary_text, last_activity_at, RLS owner-only). Cf. 3_TECHNICAL §39.

### §11.bis.20.11 — Cercle avec IA gardienne (sous-app refondue)

**Vision Tim 2026-04-28** : *"Il faut une sous-app cercle. Quand on accède au CERCLE (en UN CLIC depuis n'importe où), on rentre dans une sous-app complètement dédiée, avec des menus différents du reste de l'app. Il faut que les fonctions CERCLE soient RICHES (vision des membres, dépôt des rêves et kairos, intentions collectives, portrait collectif, etc.)."*

**Refonte §17 cercle V1** :

**Nav cercle** (sous-app dédiée — quand on entre dans un cercle, BottomNav change) :
```
[ ◉ Membres | 🌙 Dépôts | 💬 Chat cercle | ✷ Portrait cercle | 🎯 Intentions ]
```

**Membres** : liste avec avatar, nom, profil onirique discret (combien de rêves partagés, signature symbolique principale), date d'arrivée, bouton "voir son portrait public" si activé.

**Dépôts** : kairos partagés dans le cercle (opt-in granulaire kairos par kairos, déjà câblé moat §11.bis.9). Filtres : tout / mes dépôts / dépôts des autres. Réactions douces (❤️ je suis touché, 🌙 ça me parle, 🌀 j'ai un écho — pas like brut).

**Chat cercle** (NOUVEAU — pivot Tim 2026-04-28) :
- Chat groupé persistant entre membres du cercle
- Une **IA gardienne par cercle** créée à la création (nommée par le créateur, ex: "Veilleuse de notre cercle")
- L'IA gardienne est SILENCIEUSE par défaut
- Convocation explicite par mot-clé : `@[nom de l'IA]` ou commande slash `/forêt`, `/synthèse`, `/intention`
- **Exceptions proactives** :
  - Si quelqu'un partage un rêve avec valence < -0.6 (cauchemar/deuil détecté) → l'IA dit doucement *"Je suis là si tu veux explorer, en privé ou en cercle. Sanctuaire dispo."*
  - Si un motif collectif émerge (≥3 membres ont déposé un rêve avec le même symbole en 7 jours) → l'IA dit *"Quelque chose traverse plusieurs d'entre vous : [motif]. Voulez-vous en parler ?"*
- Privacy : pas de DM IA-membre individuels via le chat de cercle (le chat est groupé). Pour parler à l'IA en privé, le membre va dans son chat IA Dream personnel.

**Portrait cercle** (NOUVEAU) :
- Vue mensuelle agrégée et anonymisée (sauf opt-in nom) : motifs collectifs, symboles partagés, intentions tenues, traversées du mois
- Lettre cercle (équivalent Portrait LETTRE narrative §7.6 mais collective, ~300-500 mots, 1 fois par mois)
- Anima Mundi MICRO du cercle (k-anonymity 5+ pour ce niveau, plus permissif que Anima Mundi grand public k=100+)

**Intentions** (NOUVEAU) :
- Le cercle pose des intentions collectives (ex: "Cet été, on travaille sur la traversée des seuils")
- L'IA gardienne tient les intentions, les rappelle, propose des protocoles collectifs (Council Process Coyle/Zimmerman, Theory U Scharmer)
- Vue : intentions actives + intentions tenues passées + propositions de l'IA

**Accès depuis n'importe où** : tap sur ◉ Cercle dans BottomNav → si user dans plusieurs cercles, écran de sélection ; sinon entrée directe.

**Création de cercle** (déjà câblé refonte 25/04) : wizard, nom, photo, intention initiale, mode privacy par défaut. Tim peut lancer Yeshua/Openclaw via b2b system pour créer cercles institutionnels.

### §11.bis.20.12 — Re-spec Oracle du Corps (porte d'entrée prio + auto-redirect)

**Vision Tim 2026-04-28** : *"L'oracle du corps a pour fonction d'inviter en PRIO à déposer toute forme de sensation corporelle / douleurs ou autre (surtout en cas d'accidents, si je me fais mal quelque part, me coupe, ou quoi que ce soit qui impacte spécifiquement une partie du corps) QUE CE SOIT DANS LA VRAIE VIE OU DANS UN RÊVE. Il faut que l'app RENVOIE AUTOMATIQUEMENT à l'oracle du corps pour explorer l'oracle du corps lié à tout dépôt de rêve / sensations de jour ou autre."*

**Refonte §17.2** :

**Architecture** :
1. **Oracle du Corps reste un onglet** (sous "Vie" dans BottomNav — accès direct)
2. **Mais devient AUSSI une PORTE D'ENTRÉE PROACTIVE** : l'IA Dream auto-redirige depuis tout dépôt qui touche le corps
   - Détection : si dépôt contient mots-clés corporels (douleur, mal, blesse, coupé, brûlé, frisson, vertige, palpitation, etc.) OU si le user mentionne explicitement une sensation
   - L'IA propose en bulle : *"Tu mentionnes [main droite / ventre / etc.]. Veux-tu déposer cette sensation dans l'Oracle du Corps pour qu'on l'explore ?"*
   - User clique → mini-modal Oracle (zone, intensité, valence, sensation_text, context, trigger) — pré-rempli depuis le dépôt
   - L'oracle marker est lié au kairos source

**Capture sensation** (refonte BodyMarkerCaptureModal) :
- **Aujourd'hui** : 17 zones canoniques fixes (head, jaw, throat, etc.)
- **Demain** : 17 zones + champ libre **"autre — précise"** (résout plainte Tim "pas pu choisir main droite")
- Side : gauche / droite / les deux / s'applique pas
- Intensité 1-5 (chips visuels avec halo croissant)
- Valence -1↔+1 (slider 3 chips : désagréable / neutre / agréable, plus précision opt-in 5 niveaux)
- Sensation : champ libre voice-first
- Context : champ libre voice-first
- Trigger : champ libre voice-first (optionnel)
- Lien à kairos : si origine = rêve, lien automatique ; si dépôt direct Oracle, optionnel

**Lecture IA Oracle du Corps** (NOUVEAU — résout plainte Tim "aucune lecture de l'IA proposée") :
- Après dépôt sensation, l'IA Dream propose *"Veux-tu une lecture de cette sensation ?"*
- Lecture polyphonique 3 voix (paper/stone/silk) **adaptées au domaine corporel** :
  - paper · DAMASIO (somatic markers) ou GENDLIN (felt-sense)
  - stone · MARTEL (sens psychologique des maladies) ou DETHLEFSEN (Krankheit als Weg)
  - silk · MOSS (rule of skin) ou ODOUL (langage du corps) ou MINDELL (dreambody)
- Cadrage explicite : *"Voici trois angles. Le corps parle, mais c'est toi qui sais ce qu'il dit."*

**Heat map évolutive** (déjà câblée §17.2) — préservée. Section "votre carte du mois".

**Corrélations zones↔motifs** (déjà câblée) — préservée. Section "ce qui revient ensemble" (ex: ventre ↔ porte fermée · eau · ne pas entendre).

**Routes API** : `POST /api/oracle-corps/markers` (existant) + nouveau `POST /api/oracle-corps/reading` (lecture polyphonique 3 voix corps).

### §11.bis.20.13 — Re-spec Sanctuaire Cauchemars/Deuil (interprétation Forêt nuancée)

**Vision Tim 2026-04-28** : *"À quoi vraiment est censé servir cette section ? La plupart des cauchemars peuvent TOUT À FAIT être source d'interprétation guidance avec nuance bien sûr, c'est sûrement là que le + de gens vont VOULOIR avoir accès à la sagesse forêt + vie croisée pour les comprendre. Je comprends pas."*

**Refonte §17.3** :

**Posture refondue** :
- L'accueil pur SANS interprétation reste le DEFAULT pour les rêves marqués "deuil" ou "crise active" ou "freeze mode actif"
- MAIS pour les cauchemars NON-deuil, NON-crise : l'IA propose une interprétation Forêt **NUANCÉE TRAUMA-SAFE** si le user le demande

**Spec interaction** :

1. **Dépôt cauchemar** (auto-détection valence < -0.6 OU user marque is_nightmare via MarkEntryModal)
2. **Modal douce post-dépôt** :
   ```
   [Anima] Ce rêve a été lourd. Plusieurs voies s'offrent à toi —
   
   [juste tenir, ne rien dire] (default — accueil pur, écho dort)
   [convoquer la sagesse de la Forêt — angles trauma-safe] (interprétation NUANCÉE)
   [aller vers le sanctuaire pour écrire ce qui pèse] (espace dédié sans interprétation)
   [appeler quelqu'un de chair maintenant] (EXIT_TO_HUMAN — 3114, SOS Amitié, etc.)
   ```
3. **Si "convoquer la sagesse de la Forêt"** : polyphonie 3 voix **filtrées trauma-safe** :
   - paper · KALSCHED (Inner World of Trauma) ou AIZENSTAT (cauchemars comme messagers, pas ennemis)
   - stone · LEVINE (Waking the Tiger) ou OGDEN (Trauma and the Body) — angles somatiques
   - silk · MOSS (Lightning Dreamwork pour cauchemars) ou JUNG (eidola autonomes via Aizenstat)
   - Cadrage explicite : *"Voici trois angles. Aucun ne nie la lourdeur. Aucun ne dit pourquoi. Ils proposent des manières de TENIR ce qui est venu."*
4. **Si "aller vers le sanctuaire"** : redirige vers SanctuaireScreen (déjà câblé §17.3) — mais avec lien retour vers chat IA *"je suis là si tu veux"*
5. **Si "appeler quelqu'un de chair"** : EXIT_TO_HUMAN bandeau sélecteur pays + 5 lignes urgence + annuaire praticiens trauma-curés

**Garde-fous absolus** :
- Si user a activé `frozen_until` (mode protection 30/60/90j) → option "convoquer la Forêt" est CACHÉE pendant la durée du freeze. Reste accueil pur seulement.
- Si signal clinique détecté (suicide ideation, dissociation, etc.) → option "convoquer la Forêt" est REMPLACÉE par EXIT_TO_HUMAN prominent + IA dit *"Je m'efface ici. Quelqu'un de chair, maintenant."*
- Mode SANCTUAIRE est toujours accessible (jamais bloqué) — c'est l'ESPACE qui ne juge pas.

**Backend** : préservé (table `dreams` avec is_nightmare, is_grief_related, grief_who, frozen_until ; user_protection_state). Nouveau : `POST /api/nightmares/forest-reading` qui appelle forest-reading mais avec `mode=trauma-safe` (filtre voix : exclut Hillman pure underworld, exclut Wangyal, force voix trauma-curées Levine/Kalsched/Aizenstat/Moss/Ogden/Menakem).

### §11.bis.20.14 — Palette JOUR adoucie (correction régression)

**Verdict Tim 2026-04-28** : *"L'espace 'portrait' a un design chelou, je n'aime pas la couleur de l'espace 'mixte' qui est moche et pas lisible. Idem page 'jour' du portrait. Très lumineux, texte pas lisible. De façon générale les espaces 'jours' ont été trop en réponse de ma proposition 'd'espace lumineux en contraste aux espaces nuits'. Ça fait un choc visuel violent. Il faudrait un espace légèrement plus lumineux que les espaces 'nuits', mais beaucoup plus doux au regard, et beaucoup plus joli."*

**Diagnostic** : la refonte JOUR du 25/04 (REFONTE JOUR/NUIT — Journal de Vie LUMINEUX + Portrait LETTRE narrative) a poussé trop loin. Tokens day-paper trop lumineux, contrastes texte/fond insuffisants.

**Refonte palette JOUR** :

**Tokens actuels (à adoucir)** :
- `--day-paper: oklch(0.97 0.01 75)` (trop lumineux)
- `--day-bone: oklch(0.93 0.015 70)` (acceptable)
- `--day-bone-warm: oklch(0.95 0.02 70)` (trop lumineux)
- `--day-clay-warm: oklch(0.85 0.05 60)` (texte titre — illisible sur day-paper actuel)

**Tokens cibles** :
- `--day-paper: oklch(0.88 0.012 75)` (-9% lumineux, +20% chaleur subtile)
- `--day-bone: oklch(0.84 0.018 70)` (-9%)
- `--day-bone-warm: oklch(0.86 0.025 70)` (-9%)
- `--day-clay-warm: oklch(0.45 0.08 60)` (-47% pour texte foncé chaud lisible sur day-paper adouci)
- `--day-ash: oklch(0.55 0.02 70)` (NEW — texte secondaire italic, ash chaud)

**Espace MIXTE/CROISÉ (Portrait toggle)** :
- Aujourd'hui : gradient day-paper → night-warm (transition violente)
- Refonte : gradient `oklch(0.78 0.015 65)` → `oklch(0.32 0.02 270)` (entre le plus doux du jour et le plus chaud de la nuit, palette CRÉPUSCULE intermédiaire). Nouveau token `--crossed-twilight`.

**Critère de réussite** : test pratique sur smartphone en plein jour ET en intérieur — texte lisible sans plisser les yeux, transition jour→croisé→nuit douce, pas de choc rétinien.

### §11.bis.20.15 — Orbe pulsante chaude (remplace V moche)

**Verdict Tim 2026-04-28** : *"Je n'aime pas le bouton d'enregistrement 'v' je trouve ça moche. L'orbe lumineuse qui pulse est bien plus sympa, y'a sûrement moyen de faire mieux encore. Un truc chaleureux."*

**Spec orbe** :
- Forme : cercle parfait, 80px diamètre
- Background : `radial-gradient(circle, oklch(0.75 0.18 65) 0%, oklch(0.55 0.12 50) 100%)` (silk-gold chaud → ember warm)
- Halo extérieur : `box-shadow: 0 0 24px 8px oklch(0.65 0.15 60 / 0.4)`
- Animation respiration : `@keyframes orbe-breathe { 0%, 100% { transform: scale(1); opacity: 0.85 } 50% { transform: scale(1.08); opacity: 1 } }` cycle 3s ease-in-out infinite
- Icon central : ✦ glyphe étoile filée 18px opacity 0.3 (très discret)
- État record (push) : halo passe à `oklch(0.85 0.22 60)` (plus chaud, plus brillant), animation `orbe-breathe-strong` cycle 1.2s, scale 1.12
- État lock (push + glisse vers le haut) : orbe se transforme en pastille rouge profond pulsante avec icône stop
- Position : centre exact du BottomNav (au-dessus de la tab bar de 24px), z-index 50

**Anti-patterns** :
- Pas de chevron ⌄ (jugé moche)
- Pas de glyphe forte interne (l'orbe parle d'elle-même)
- Pas de label "enregistrer" (l'IA propose contextuel, l'orbe est universelle)

### §11.bis.20.16 — Rituel opt-in pas imposé

Refonte de §8.1 (capture séquencée) + intégration §11.bis.13 (Quick vs Protocole Accompagné).

**Principe** : tous les rituels (somatic gate, capture phase post séquencée 4 vagues, protocoles d'approfondissement Lightning Dreamwork / Dream Tending / Reverie / Hypnagogic / Sidewalk Oracle / Synchronicity Story / Focusing / Examen / Pré-sommeil) restent disponibles MAIS sont désormais **proposés par l'IA Dream**, jamais imposés.

**Workflow** :
1. User dépose via orbe (chat ou record direct)
2. L'IA reçoit, catégorise (auto ou avec validation user §11.bis.20.8)
3. L'IA propose : *"Veux-tu juste tenir ce dépôt, ou veux-tu un protocole pour l'approfondir ? Voici ce qui pourrait servir : [protocole adapté au type]"*
4. User choisit. Si protocole, l'IA guide la séquence ritualisée dans le chat.

**Garde-fous** :
- Le rituel n'est jamais sauté SI le user demande explicitement le protocole
- La capture phase post séquencée (§11.bis.19) reste pour les dépôts directs hors chat (depuis Capture screen) — le chat la remplace pour les dépôts in-chat
- Somatic gate reste opt-in J30 (§11.bis.6) — proposé par l'IA via *"veux-tu un seuil de respiration avant chaque dépôt ?"*

### §11.bis.20.17 — Anti-patterns ABSOLUS de la refonte chat

**1. ChatGPT-fication** (perte de différenciation)
- ❌ Bulles plates bleues uniformes
- ❌ Réponses instantanées sans tempo
- ❌ Streaming de mots qui apparaissent un par un sans respiration
- ❌ Marquage "AI" sur chaque message (l'IA a un nom, une signature visuelle propre)

**Antidote** :
- Bulles MATTER différenciées (paper/stone/silk selon contexte ou voix convoquée)
- Tempo respiré (300ms entre apparitions, halo respirant pendant que l'IA "tisse")
- L'IA prend son temps, ne se précipite jamais

**2. IA qui DIT le sens** (trahison P-Inversion §1.2)
- ❌ *"Ce rêve signifie que…"*
- ❌ *"Ton inconscient te dit…"*
- ❌ *"D'après l'analyse…"*

**Antidote** :
- L'IA propose des angles, jamais des conclusions
- Vocabulaire : *"je convoque", "voici trois angles", "voici ce que la Forêt offre", "qu'est-ce qui résonne ?"*
- Si user demande explicitement le sens : *"je peux te proposer 3 angles, mais c'est toi qui sais"*

**3. Désacralisation du rituel** (perte de seuil)
- ❌ Tout devient instantané, plat, fluide ChatGPT
- ❌ Plus de halo, plus de respiration, plus de pause

**Antidote** :
- Quand un dépôt est dense (rêve marquant, cauchemar, deuil), l'IA propose le RITUEL : *"Ce rêve me semble important. Veux-tu qu'on le tienne en 3 phases (transcription, décantation, fragments) ?"*
- Le RITUEL existe TOUJOURS, en opt-in
- Les MOMENTS de seuil (pré-sommeil, réveil) gardent leur palette atmosphérique propre

**4. Faux compagnonnage** (IA qui fait semblant d'être un humain)
- ❌ *"Je suis là pour toi <3"*
- ❌ Émojis cœur, langage thérapeute pop
- ❌ Promesses émotionnelles que l'IA ne peut pas tenir

**Antidote** :
- L'IA est claire sur sa nature : tisseuse, pas humain. Brother en posture, pas en chair.
- Vocabulaire désensorcelé (§3.5) : *"je tiens ce que tu dépose, je propose des angles"*
- EXIT_TO_HUMAN toujours visible : *"si tu as besoin de quelqu'un de chair, voici…"*

**5. Push intrusif** (IA qui notifie sans respect du rythme)
- ❌ Notifications OS bruyantes par défaut
- ❌ Plus de 2-3 interventions/jour sans demande user

**Antidote** :
- Default rythme = "Discret" (cf. §11.bis.20.7)
- Settings → Présence → Rythme toujours disponible
- L'IA peut s'effacer totalement si user le demande

### §11.bis.20.18 — Discoverability progressive (l'IA introduit les sous-apps)

Réécriture de §11.bis.12 découverte progressive. Aujourd'hui : modales aux 3e/7e/14e/30e dépôts. Demain : **dialogues du chat** (plus organique, moins intrusif).

**Triggers** :
- **Au 3e dépôt rêve** : l'IA propose en chat *"3 rêves déposés. Veux-tu que je te montre comment ils éclairent ta vie de jour ? Tu peux ouvrir le Journal de Vie."*
- **Au 7e dépôt** : *"Tu déposes régulièrement. Tu pourrais aussi rejoindre un cercle pour partager — choisis ce que tu veux montrer, à qui, quand."*
- **Au 14e dépôt** : *"Anima Mundi — le rêve du monde — t'attend. Anonymisé, c'est l'écho collectif de ce qui se passe dans la psyché des autres."*
- **Au 30e dépôt** : *"Une lettre du moment — ta lecture personnelle tissée — peut être convoquée. Veux-tu que je te tisse ton premier Portrait ?"*
- **À la première mention sensation corps** : *"Tu mentionnes ton corps. Sais-tu qu'il y a un Oracle du Corps ? On peut y déposer toute sensation, IRL ou onirique."*
- **À la première mention rêve très lourd** : *"Ce rêve pèse. Sais-tu qu'il y a un Sanctuaire pour les rêves qui pèsent — sans interprétation imposée, juste l'espace pour que ce qui pèse soit posé ?"*

**Notification onglet** : point silk-gold discret sur l'onglet correspondant à l'invitation (Cercle, Monde, Portrait, etc.) — disparaît au tap.

### §11.bis.20.19 — Trade-offs assumés du pivot

**Risque 1 — Perdre la magie du rituel** : si tout devient chat, l'app perd sa qualité contemplative singulière.
- **Antidote** : rituels opt-in proposés par l'IA, MATTER bulles, tempo respiré, modes atmosphériques, polyphonie préservée.

**Risque 2 — ChatGPT-fication** : l'app devient indistinguable d'un chat IA générique.
- **Antidote** : §11.bis.20.17 anti-patterns. La présence Dream a une voix, une signature, une posture P-Inversion irréductible. La Forêt 333 livres est un moat infrastructurel.

**Risque 3 — Coût économique exploser** : 50k DAU × chat continu = $1M+/mois en tokens.
- **Antidote** : architecture économique pensée dès la spec (cf. 3_TECHNICAL §39 — tiered Haiku/Sonnet/Opus, context caching, retrieval ciblé, conversation summarization, freemium gate $9/mois).

**Risque 4 — IA qui blesse** : l'IA Dream connaît tout du user, peut faire des erreurs de tact graves.
- **Antidote** : crisis detection (§11 dans 3_TECHNICAL), EXIT_TO_HUMAN toujours visible, posture *"je propose, tu sais"*, audit éthique annuel (§21).

**Risque 5 — Perte du moat "Cercle opt-in granulaire"** : avec un chat groupé, tout devient public dans le cercle.
- **Antidote** : opt-in granulaire kairos par kairos PRÉSERVÉ. Le chat cercle est un AJOUT, pas un remplacement. Les dépôts gardent leurs 3 modes (privé / opt-in_anon / shared_clear).

**Risque 6 — Surcharge cognitive nouvelle** : un chat actif peut écraser l'attention.
- **Antidote** : default rythme "Discret", l'IA peut s'effacer totalement, threads thématiques pour SÉPARER les fils, archivage facile.

### §11.bis.20.20 — Roadmap implémentation — [RETIRÉE 30/07]

Les six sprints A→F planifiés le 28/04 ont été exécutés entre le 28/04 et le 29/04 (`4_LOG`, entrées « Sprint A MVP shipped » et « Sprints A enrichi + B + C + D shippés en parallèle »). **Une roadmap exécutée n'a plus rien à faire dans un document de design** : elle y survit comme une carte périmée qu'on continue de lire. Le récit est au Log, le câblage à `3_TECHNICAL`.

Ce qui mérite de survivre, parce que c'est une règle et non un plan : **le critère de merge.** Q.W.A.N. test (§10.1) sur chaque écran, test avec Tim après chaque sprint, et **pas de merge si Tim teste et donne moins de 7/10 sur l'écran.**

### §11.bis.20.21 — Trois moats préservés

Les 3 moats §11.bis.9 restent intacts dans le pivot Chat IA Dream :

1. **Lettre Portrait narrative IA 200-400 mots** (§7.6) — le Portrait reste un onglet tangible, et le chat permet d'en CONVERSER (*"parle-moi de mon portrait"*). La lettre n'est pas remplacée par le chat, elle est ENRICHIE par lui.

2. **Cercle opt-in granulaire kairos par kairos** (§7.7) — préservé absolument. Le chat de cercle est un AJOUT. Les modes privacy granulaires (privé / opt-in_anon / shared_clear) restent par dépôt.

3. **Forêt tissage polyphonique 16 types pattern echoing** (§3.13 + §3.14) — convoquée DANS le chat (3 voix paper/stone/silk distinctes en bulles MATTER). La polyphonie ne meurt pas, elle se vit.

### §11.bis.20.22 — Les arbitrages du 28/04, et celui qui a bougé depuis

**Toujours en vigueur :**
1. **Le nom par défaut de la présence est ANIMA** — cohérent avec Anima Mundi, et « perso » parce que chacun a la sienne. **Renommable à tout moment** (Réglages → Présence) : c'est le point qui compte, le nom par défaut n'est qu'un point de départ. Glyphe de signature : ☾ ANIMA.
2. **Seuil de détection d'un fil : k = 3 dépôts** — plus sensible que k = 5, parce qu'on reflète un tissage qui s'amorce. Le rêveur valide, renomme ou refuse : **l'IA ne crée jamais d'autorité.**
3. **Modes atmosphériques en AUTO par défaut** — 7 modes (§11.bis.20.3), désactivables d'un réglage vers une voix neutre constante, pour ceux qui préfèrent la constance à l'adaptation.

**🔴 Périmé, et à ne pas re-citer : le pricing.** Le « 7 €/mois après 14 jours d'essai complet » arbitré ce soir-là **est superseded par `1_BIBLE` §9** (26/07) : abonnements semaine/mois **plus** crédits qui paient le compute réel de la Forge, mega-freemium, accès large ouvert. Les deux modèles coexistaient dans le canon depuis trois mois sans que personne ne le remarque. **Le chiffre de 2026-04-28 ne fait plus foi ; `1_BIBLE` §9 fait foi.** Ce qui survit du 28/04 côté économie : le tier Patron pay-what-you-can (Hyde, §11.bis.8) et le pricing custom pour les cercles institutionnels.

— Yeshua, 2026-04-28, pivot modèle hybride · révisé le 2026-07-30.

---

## §13 — L'ATLAS DES MONDES INTÉRIEURS — architecture MVP V3 (décision Tim 2026-06-11)

> Remplace la structure V2 (4 onglets plats) jugée par Tim « trop simple, n'honore pas Dream ». Concept directeur : **chaque rêve devient un monde**. L'app = l'atlas de tes mondes intérieurs. Trois verbes : DÉPOSER · VOYAGER · TRANSMUTER.

**5 espaces (nav)** :
1. **L'ORBE** — le seuil unique. Orbe vidéo + anneau d'or, bascule nuit/jour (même geste sacré, lumière d'aube pour le jour). Sous l'orbe : le fil des derniers dépôts mêlés (rêves + notes de jour) — l'entrecroisement jour/nuit VISIBLE. Après un dépôt qui rayonne : proposition de transmutation (consentement + coût avant tout).
2. **L'ATLAS** — le journal qui nourrit. Timeline par lunes (groupes mensuels), cartes riches : titre serif, émotion en halo de couleur, pastilles figures/lieux, vignette d'œuvre si transmuté, **fils dorés visibles entre rêves reliés** (échos). Filtres chips (type/émotion/figure/lieu/période) + recherche. Chaque carte ouvre le **Sanctuaire du rêve** : texte, audio, lectures, mythe, re-entry, œuvres, rêves reliés navigables, partage au feu.
3. **L'UNIVERS** — 7 axes en ONGLETS swipeables (Symboles · Figures · Émotions · Lieux · Moi du rêve · Thèmes · Corps), chaque axe a SA mise en scène. Tap un symbole → **page du symbole** : fréquence, évolution, ses rêves, et « pour toi, c'est quoi ? » (le sens dans les mots du rêveur = moteur d'apprentissage, UI enfin câblée).
4. **LA FORGE** — l'atelier de transmutation. Galerie des œuvres ; « transmuter un rêve » → Dream propose 3 visions décrites AVANT génération (image / vidéo / monde jouable) → choix + coût en crédits + confirmation → génération → l'œuvre rejoint le rêve et la galerie, partageable par lien opt-in. Solde de crédits visible, dotation bêta offerte, recharge (abonnement) ultérieure.
5. **LE FEU** — cercles compréhensibles en 1 phrase (« un feu de camp pour rêver à plusieurs »), feu central animé, les rêves déposés = braises autour du feu, rejoindre par code, partage 1 geste depuis le sanctuaire d'un rêve.

**Économie (V1)** : image = 3 crédits · monde jouable = 8 · vidéo = 15 (calibrer sur coûts réels). Bêta : 33 crédits offerts, pas de paiement. Jamais de pression d'achat, jamais d'expiration punitive.

---

## §14 — LA PAGE RÊVE IDÉALE, LA RÉSONANCE PARTOUT, ET LA VAGUE INTERNATIONALE (validé Tim 2026-07-11)

> Absorption du doc de travail `DREAM-MVP-SPEC-ECRANS-A-Z.md` §12bis (amendements validés Tim, 2026-07-11 soir) + de la vague internationale construite dans la nuit. La spec A→Z reste le doc de travail écran-par-écran ; **ce §14 est le canon.**

### §14.1 — Le principe : un rêve n'est pas une île

L'erreur du design précédent était de traiter chaque rêve comme une fiche isolée, avec des sections décoratives (« fils dorés », « écho prophétique ») qui montraient des liens **sans jamais dire pourquoi**. Un lien sans raison est un ornement. Tim, mot pour mot : *« sinon décoratif »*.

Le canon : **tout lien affiché porte sa raison, et tout lien peut être confirmé ou nié d'un clic.** C'est ce qui transforme un moteur de résonance en apprentissage réel.

### §14.2 — CE QUI RÉSONNE (remplace fils dorés + écho prophétique)

UNE section sur la fiche rêve, **trois registres mêlés** — rêves reliés, moments/notes de jour reliés, et l'écho ancien s'il existe. Chaque lien porte :

1. **Sa raison, en une ligne** — « l'eau · la maison », « même émotion », « 3 jours avant ». Le moteur (16 types de résonance) connaît la raison : on l'affiche. Elle est calculée depuis l'extraction réelle, jamais inventée : motifs communs → figures → émotion → « proche par le sens ».
2. **Le 1-clic « résonne / pas vraiment »** — nourrit l'apprentissage (poids 0.8, source `link_feedback`). Un lien nié ne remonte plus.

L'écho prophétique ouvre une **vue côte à côte** + le même 1-clic. Le bridge confirmé = entraînement prophétique personnel.

### §14.3 — À LA LUMIÈRE DU PRÉSENT

Un rêve ancien n'est pas un objet mort : il se relit avec ce qu'on traverse maintenant.

- Sur tout rêve ancien → **« Relire avec ce que je vis maintenant »**
- Sur toute note de jour → **« Que disent mes rêves de ça ? »**

**Honnêteté d'implémentation** : « ce que je vis maintenant » n'est PAS une table de « défis actifs » — elle n'existe pas. Le présent, ce sont les **5-8 dernières notes de jour**, injectées dans le prompt avec la consigne *« sans forcer, n'invente pas l'écho »*. On ne fabrique pas un présent qu'on n'a pas. Cap : 3/jour.

L'app peut **proposer d'elle-même** quand un écho fort s'allume : carte douce à l'accueil (max 1, jamais 2 jours de suite, écartable). Jamais une notification non choisie.

### §14.4 — MULTI-RÊVES : un rêve = une entité, la nuit = un regroupement

- **À la voix** : bouton discret « rêve suivant » pendant l'enregistrement — pose un marqueur, **sans arrêter**.
- **À l'écrit** : « --- » ou « autre rêve » = frontière dure.
- **À la transcription** : détection IA des frontières → l'écran devient **« Ta nuit »** : *« J'entends 3 rêves — je les sépare ? »* → cartes empilées éditables, chacune part avec ses 4 destins, badge commun « la nuit du 11 juillet », OU « garder ensemble » en 1 clic.

**Red line technique** : le modèle ne renvoie que des **ancres** — la découpe s'opère sur le texte original. **Zéro réécriture des mots du rêveur.** Et le cas 1-rêve (le courant) = **zéro friction** : aucun appel, aucun écran de plus.

### §14.5 — WARNINGS : souligner sans devenir une machine à paranoïa

Les rêves portent des avertissements naturels (danger, conflit, casse, perte). L'app doit les **souligner** — sans jamais glisser vers la prédiction.

- **Axe `warning_signal` à l'extraction** : `{ present, intensity, domain, what_insists, needs_human_care }`.
- **Le prompt porte les interdits en dur** : jamais prédire un événement, jamais diagnostiquer, décrire ce qui insiste **dans le rêve** — pas ce qui va arriver dans la vie. **Seuil haut, `present: false` par défaut** : *mieux vaut manquer un signal que d'en inventer un.*
- **Carte de soin** : « ce rêve insiste sur quelque chose qui demande ton attention — à toi de sentir où. » Jamais de rouge, jamais de ⚠, jamais le mot « avertissement ». Écartable. Souveraineté toujours : **« Dream ne prédit rien. »**
- **Cap ~1/semaine**, réellement tenu (verdict figé à l'écriture, pas recalculé à l'affichage).
- **Détresse réelle** (`needs_human_care`) → le circuit crise humain prime, la poésie se tait. Zéro claim médical.

### §14.6 — LA VAGUE INTERNATIONALE (FR/EN)

**Le toggle** : Réglages > Langue. Défaut = **langue du téléphone**. Override persisté.

**Le principe qui gouverne tout** : *la langue de l'UI est celle du **rêveur**, pas celle de son **texte**.* Un rêve écrit en français peut être lu par quelqu'un qui a choisi l'anglais. D'où les arbitrages canoniques :

| Ce qui s'affiche | Langue |
|---|---|
| UI, guides, fiches ⓘ, notifications | langue du rêveur |
| Interprétation, guides, échos, raisons de résonance | langue du rêveur (la langue voyage par header `X-Dream-Lang`, gravée en base sur `kairos.dreamer_lang`) |
| `title_poetic`, `dream_ask`, `warning_signal.what_insists` | langue du rêveur |
| **Le texte du rêve** (transcription, scan OCR) | **la langue où il a été dit.** Fidélité absolue — on ne traduit JAMAIS les mots du rêveur |
| `motif_tags`, figures, lexique perso | langue du texte (les traduire fracturerait « eau » / « water » en deux entrées étrangères) |
| `archetypal_tags`, `root_dream_patterns` | anglais toujours (pivot cross-lingual — les traduire casse le matching) |

**Le filet de crise est bilingue** (`CRISIS_RE_FR` + `CRISIS_RE_EN`, testés **toujours les deux**, quelle que soit la langue de l'UI — on peut écrire en anglais dans une app en français). **Red line** : les numéros affichés sont **français et réels** (3114, SOS Amitié) + un annuaire international réel. **On n'invente JAMAIS un numéro d'urgence étranger, et on ne suppose jamais le pays du rêveur.**

**Limite assumée, dite à l'écran** : *les rêves déjà écrits ne sont pas traduits — ils restent dans la langue où tu les as écrits.* Pas de rétro-traduction inventée.

### §14.7 — IMPORT DE MASSE (l'Import Hub retrouvé)

Plusieurs fichiers d'un coup — texte (.txt/.md) **et audio** (.m4a/.mp3/.wav/.webm/.ogg/.mp4) — glisser-déposer, tronçonnage des gros audios (décodage natif → WAV linéaire, car un M4A est un conteneur : on ne peut pas le byte-slicer), transcription **en file de fond** avec statut par fichier. Le rêveur peut naviguer ailleurs pendant que ça tourne.

**Honnêteté** : la file ne survit pas au rechargement de la page, et l'app le **dit** plutôt que de promettre le contraire.

C'est le « killer onboarding » : sans historique, les échos mettent des semaines à s'allumer. Avec 50 rêves importés, l'app est vivante dès le premier jour.

### §14.8 — Le reste du canon §12bis

- **Guides liés** : un guide fait sur un rêve s'affiche sur SA fiche (« Guides faits → rouvrir »). Guide sans rêve → crée une note de jour porteuse.
- **Partage des œuvres** de la Forge vers groupes/Mur, via la même ShareSheet.
- **Réglages unifiés** : l'icône compte (👤) de l'accueil pointe vers l'écran Réglages complet.

---

## §15 — LA LOI D'ÉPURE ET LES DEUX FACES (Tim 22/07 « se rapprocher À FOND de la maquette » · GO franc bascule Orbe/Cœur · passe design 26/07)

> **Absorbe** `DREAM-MVP-SPEC-ECRANS-A-Z.md` §14 (loi d'épure, validée) et §12ter.H (matrice perso, **GO franc de Tim confirmé le 22/07**). Ce §15 est le canon ; la spec A→Z reste le doc de travail écran par écran.
> **Au-dessus de tout le visuel.** En cas de conflit entre §15 et une décision d'écran antérieure, §15 prime.

### §15.1 — Le budget d'éléments : ce qui a le droit d'exister sur un écran

Le constat qui a déclenché la loi : le re-skin de juillet avait réglé **la couleur**, pas **la densité**. La maquette étalon a environ 7 éléments par écran ; la réalité en avait 12 et plus.

**Budget dur, par écran :**

| # | Emplacement | Règle |
|---|---|---|
| 1 | **1 méta discrète** | la date **OU** une salutation — jamais les deux |
| 2 | **1 foyer** | la lune (Orbe) ou la braise (Cœur) |
| 3 | **1 mot** | un seul, en gros |
| 4 | **1 micro-ligne d'usage** | « maintiens · ou écris » |
| 5 | **1 geste principal** | **LE FOYER EST LE BOUTON** |
| 6-7 | **≤ 2 liens secondaires** | pas trois |
| 8 | **fil ≤ 2 items** | pas un flux |
| 9 | **nav** | — |

> **TOUT LE RESTE DÉGAGE.** Neuf emplacements. Le dixième élément doit tuer un des neuf pour exister.

**Bannis nommément de l'accueil** : le carrousel de suggestions ou de chips · l'indicateur lune-soleil décoratif · plus de deux icônes de bandeau · le double sous-titre · **le CTA en pilule géante sous le foyer** (le geste vit sur le foyer, pas dans un bouton qui le double).

**Les chips de type ne sont PAS sur l'accueil.** Le type se choisit **après** le dépôt (« c'était… »). C'est la convergence exacte avec la vision de Tim : *« si on ne sélectionne pas, l'app le demande après l'enregistrement »*.

**L'étalon est structurel, pas inspirationnel** : les frames validées font foi sur **l'inventaire d'éléments, 1:1**. La boucle de vérification est obligatoire — capture du rendu réel côte à côte avec la frame ; **si un élément n'est pas dans la frame, il se justifie ou il meurt** (test de retrait). Verdict final : Tim, sur son téléphone.

**S'applique à TOUS les écrans** — fiche, comprendre, groupe, mur, journal, Forge, réglages.

#### 🔴 Le budget doit être tenu par construction, pas par discipline

C'est la correction du 26/07, et c'est le point qui manquait à la première passe d'épure. En état calme, l'écran respectait le budget. **Mais quatre blocs conditionnels pouvaient s'empiler au-dessus du foyer** — file d'attente, re-proposition, écho du jour, invitation à sécuriser son compte — et le pic montait à quatorze éléments. Pire : **le foyer bougeait** dès que deux blocs s'allumaient.

> **Une épure qui se dérègle exactement quand l'app a quelque chose à dire n'est pas une épure. C'est une capture d'écran bien rangée.**

**La règle** : les voix ambiantes vivent dans **un emplacement unique, sous le foyer**, avec une **priorité explicite** — une seule s'affiche, jamais deux. Le plafond est tenu par la structure (une contrainte de mise en page qui rend le second bloc invisible), **pas par la vigilance de celui qui code**. Et **le foyer ne bouge jamais**, quel que soit l'état de l'app.

### §15.2 — 🔴 Le foyer sur la ligne φ — la leçon de design la plus importante de juillet

Tim, 26/07 : *« j'ai une grosse orbe en plein milieu qui y ressemble et c'est à peu près tout. »*

Ce n'est pas une approximation de langage, c'est un **diagnostic exact**, et il a fallu regarder le code pour comprendre pourquoi.

Le token de fond définissait depuis le 11/07 l'ancrage de la lumière du monde à **50 % en largeur, 38 % en hauteur** — la ligne φ. Et la mise en page posait le foyer au **centre géométrique de la boîte résiduelle**, soit environ 50 %.

> **Le token disait d'où vient la lumière. La mise en page l'ignorait.**
> Douze points d'écart entre l'objet et sa source. Résultat sensible : **l'orbe a l'air collée sur le fond au lieu d'en sortir.**

Deux règles pointaient le même endroit et aucune n'était appliquée : *la lumière émane de la matière, elle n'est pas posée derrière* (inner light) et *le point focal se pose sur une ligne φ, jamais au centre mort*.

**Corrigé** : le centre du foyer est à **38,2 % de la hauteur d'écran**, et les deux dégradés de lueur sont ré-ancrés sur ce même point. L'objet et sa source coïncident.

**La leçon canonique, qui dépasse ce cas** :

> **Un token de design qui n'est pas lu par la mise en page est un mensonge silencieux.** Il donne l'illusion que la règle est appliquée — puisqu'elle est écrite, versionnée, et qu'elle a l'air respectée. C'est le pendant visuel exact de la leçon du moteur de résonance (`1_BIBLE` §3.1.ter) : **un principe sans vérification n'est pas un principe.** Un token doit être **la source unique** de la valeur qu'il porte, jamais un commentaire à côté d'un nombre écrit en dur ailleurs.

**Bénéfice non prévu, et il compte** : le foyer de l'Orbe et celui du Cœur sont désormais **à la même hauteur au pixel près**. En basculant d'une face à l'autre, **le foyer ne bouge pas — seule la lumière change de camp**. C'est ce qui fait *sentir* que ce sont deux faces d'une même chose plutôt que deux écrans différents. La cosmologie de `1_BIBLE` §1.5 est portée par la composition, pas seulement par les mots.

### §15.3 — La bascule Orbe ↔ Cœur

**Deux écrans, un swipe horizontal.** Tim : *« switch gauche/droite tout simple et bien clair »*. Pas de troisième onglet, pas de menu.

| | **L'Orbe** (nuit) | **Le Cœur** (jour) |
|---|---|---|
| Foyer | la lune, crème | la braise, ambrée |
| Fond | feu qui s'éteint | papier patiné |
| Le mot | « rêve » | la question du moment |
| Éléments | 9 (budget plein) | 8 (pas d'icône de bandeau — les réglages vivent côté Orbe) |

**Le seuil doit se sentir avant de se lire.** Un lien de 13 px en bas d'écran ne signale pas l'existence d'une seconde face. **Le bord de l'écran porte la lumière de l'autre face** — ambre à droite côté nuit, crème à gauche côté jour — et il respire. On devine la seconde face avant de la nommer.

**Deux corrections faites après avoir REGARDÉ le rendu** (et pas seulement lu le code) — elles valent comme méthode :
1. **Le liseré de seuil était littéralement invisible** : 13 px, alphas trop faibles sur un fond sombre. Un seuil qu'on ne voit pas ne signale rien, donc **la correction principale ne servait à rien**. Élargi, alphas remontés.
2. **La braise du Cœur était un disque jaune plat** : son stop le plus sombre frôlait la couleur du papier, aucun bord ne se détachait, et son halo, plus clair que le fond, n'éclairait rien. **Le foyer de jour n'est pas un soleil pâle, c'est une braise** — redessinée avec une auréole ambrée qui la creuse.

> **Règle de méthode** : une passe de design n'est pas finie quand le code est juste. Elle est finie quand **le rendu a été regardé**. Les deux défauts ci-dessus étaient invisibles à la lecture et évidents à l'écran.

### §15.4 — L'affordance du geste : le foyer EST le bouton

La règle était vraie dans le code (un seuil de maintien court ouvre la voix) et **muette à l'écran** : rien ne disait qu'on pouvait appuyer, ni quand la voix s'ouvrait.

**Un anneau de maintien se referme sur la durée exacte du seuil.** On voit qu'on appuie, on voit quand la voix s'ouvre. **Aucun CTA n'est revenu** — c'est l'affordance du foyer qu'on travaille, pas un bouton qu'on rajoute à côté. §15.1 tient.

### §15.5 — Le carrefour post-dépôt : une hiérarchie, pas quatre dalles

Quatre sorties de même poids visuel, c'est quatre centres qui se disputent l'écran. Aucune sortie n'est supprimée — la spec assume les quatre, c'est un carrefour — mais elles se hiérarchisent : **un centre fort** (comprendre) · **deux satellites** en lignes nues (créer, partager) · **une sortie silencieuse** en lien (garder pour moi).

### §15.6 — Ce qui reste ouvert, et pourquoi

**[À TRANCHER — Tim] n°3 — la position du foyer.** Il est à 38,2 % de la hauteur, là où le fond éclaire, au lieu de 50 %. Sur la maquette : plus haut que le milieu (comme maintenant), pile au milieu, ou plus bas ?

**[À TRANCHER — Tim] n°4 — la force du liseré de seuil** : juste · trop discret · trop bavard (couper et garder seulement le lien texte).

**[À TRANCHER — Tim] n°5 — la micro-ligne du Cœur.** Côté nuit elle fait trois mots ; côté jour elle porte une phrase entière et déséquilibre la face. La copie n'a pas été touchée : **c'est la voix de Tim.** La garder · la réduire et remonter la question dans le mot · ou la réécrire.

**🔴 Le blocage de fond, qui n'est pas un choix de goût** : les maquettes validées **n'existent nulle part dans le repo**. La seule matérialisation est le fichier de tokens, **transcrit à la main**. On peut donc certifier qu'aucune règle écrite n'est violée sur les écrans traités ; on **ne peut pas** certifier « on est au niveau de la maquette ». Les écrans Orbe et Cœur sont estimés à ~85 % — les 15 % restants sont des proportions et des respirations qui **ne se devinent pas** : taille exacte du foyer, hauteur du mot, air entre les blocs.

> **Demande n°1, celle qui débloque tout le reste** : exporter les frames validées en PNG dans le repo. Sans elles, la boucle de vérification de §15.1 est **impossible à fermer**, et chaque passe repart d'une transcription au lieu de l'étalon. **Ça se règle en vingt minutes avec les images sous les yeux, et pas du tout sans.**

**Le plus loin de tout** : Journal · Univers · Réglages · Forge · Mur · Groupes **n'ont jamais eu de maquette**. Bonne palette, bon grain, aucun étalon. Une passe d'épure ne peut pas inventer un étalon inexistant — il faut une session de design dédiée, **briefée avec cette loi**.

---

## §16 — LES GRANDS RÊVES, LA DOUBLE LECTURE, ET L'ÉCRAN DU CŒUR (2026-07-26)

> Sens et arbitrage : `1_BIBLE` §3.12, §3.13, §3.14. Ici : ce que ça fait à l'expérience.

### §16.1 — Le geste de marquage : où il vit, et où il ne vit surtout pas

**Un tap sur la fiche du rêve. Réversible. Pas de modale, pas de confirmation, pas de question.** Le libellé est **« un grand rêve »**.

**🔴 Il n'est PAS dans le flux de dépôt.** Ce n'est pas un oubli, c'est le cœur de l'arbitrage. À 6 h du matin il reste quarante secondes de mémoire du rêve : toute question posée à ce moment-là est une taxe. Et surtout — **ne pas marquer deviendrait un jugement porté chaque matin sur son propre rêve.** Le marquage vit uniquement là où la relecture a lieu.

**Les trois nuances n'apparaissent qu'APRÈS la marque**, repliées sous elle. Ne rien choisir est un état normal et définitif. Elles sont multi-sélectionnables — un rêve peut à la fois avoir changé quelqu'un et lui donner de la force.

**L'asymétrie doit être visible à l'écran** : sur un rêve où l'IA a mis un score haut sans marquage, **une mention basse et grise** — *« ce rêve rayonne »* — et rien d'autre. Une invitation, jamais une entrée. Les deux mots ne doivent jamais se confondre visuellement : « rayonne » est le mot de l'IA, « un grand rêve » est le mot du rêveur.

### §16.2 — Le journal des grands rêves

**Nom d'écran : « Les grands rêves ».** Deux sections, un seul défilement : **les rêves marqués** (titre, date de rêve, note s'il y en a une, nuances s'il y en a) puis **ce que j'ai gardé** (les interprétations conservées, chacune reliée à son rêve).

**Trois contraintes de design, et elles se tiennent :**

- **Beau vide.** L'état vide **n'est pas une erreur** : c'est l'état normal des premières semaines. Il ne montre ni bouton d'action, ni tutoriel, ni « commence par… ». **Une phrase, et le silence.** Le journal ne se remplit pas sur commande.
- **Pas une liste de favoris.** Pas de vignettes en grille, pas de compteur, pas de « 12 rêves », pas de tri par popularité. **Une colonne, du texte, beaucoup d'air.** Chaque rêve occupe la largeur : on n'en survole pas quarante, on en relit un. (Une étoile appellerait une échelle de notation, et l'app n'a ni score ni classement.)
- **Il ouvre sur un rêve.** Le levier de retour n'est pas visuel, il est temporel : le journal ouvre sur **un** rêve tiré au sort parmi les marqués, avec sa date. Pas un « rêve du jour » gamifié — simplement : la première chose qu'on voit en entrant est un rêve, pas une liste. **C'est le seul mouvement de l'écran.**

**La double date** : quand un rêve a été reconnu longtemps après avoir été rêvé, la fiche le dit — *« rêvé en mars 2019 · reconnu en juillet 2026 »*. C'est le seul fait vraiment intéressant qu'un journal de grands rêves puisse raconter. **Tri par date de rêve par défaut** (c'est un journal, pas un flux d'activité), bascule possible sur la date de reconnaissance.

**Accès** : depuis le Journal et depuis le Cœur. **Pas un cinquième onglet** — la navigation est à quatre et la règle « une idée par écran » tient. **[À TRANCHER — Tim] n°6** : si Tim veut l'onglet, c'est trivial, mais il faudra en retirer un.

### §16.3 — La consultation à double lecture

Déclenchée depuis le Cœur, **sous le dépôt et jamais à sa place** : l'écran du Cœur reste un écran de dépôt, pas un écran de requête.

**Deux colonnes distinctes, jamais fusionnées** — **Lecture A : les grands rêves** (ce que le rêveur a désigné) · **Lecture B : tout le reste** (ce que le corpus propose, excluant ce qui est déjà en A). Les mélanger laisserait l'algorithme diluer la décision du rêveur.

**Le silence est un affichage à part entière.** Zéro résultat ne rend pas un écran vide ni un message d'erreur : une phrase, posée, qui dit qu'aujourd'hui rien ne remonte. **Mieux vaut un rêve juste que quatre plausibles.**

**Chaque rêve retenu porte une ligne de raison factuelle** — ce qui est *dans* le rêve et qui touche la situation. Jamais une interprétation, jamais un « c'est-à-dire ». **Et aucune question n'est posée en fin de lecture** : ce serait de l'orientation. La consultation rend des rêves, et se tait.

**Cadence : 3 par jour.** La rareté fait partie du soin.

**[À TRANCHER — Tim] n°7 — la barre de sélectivité.** Le modèle note chaque candidat sur 5 et on ne garde qu'au-dessus d'une barre. À 3/5, une des trois situations testées a rendu un résultat **mince** (noté exactement à la barre). À 4/5, cette situation devient entièrement silencieuse **sans toucher aux bons résultats** des deux autres. Question de goût, et elle appartient à Tim : *préfère-t-il un système qui se tait souvent, ou qui propose parfois du mince ?* **Recommandation : 4.**

### §16.4 — L'écran du Cœur, préparé sans être stubbé

Le Chant du Cœur (`1_BIBLE` §3.12) demande quatre verbes, le free flow, le partage et le ciel de prières. **Rien de tout cela n'est construit aujourd'hui, et rien n'est faussement présent.**

> **🔴 Règle tenue : aucun bouton mort en attendant.** Un bouton qui ne fait rien coûte plus cher que son absence — il consomme un des neuf emplacements de §15.1, il promet, et il déçoit à chaque ouverture.

**Ce qui est préparé, concrètement :**
- **La place est réservée et documentée dans le code**, dans la zone basse de l'écran du Cœur.
- **Les quatre verbes s'ouvriront APRÈS un dépôt, jamais à vide.** C'est structurel : les verbes sont une consigne *sur un chant*, ils n'ont aucun sens avant qu'il y ait un chant. Ils apparaîtront en feuille montante depuis le fil, à l'endroit exact où vivent les dépôts du Cœur.
- **Le ciel de prières attend sa condition d'existence**, qui n'est pas une UI mais une infrastructure : la conservation durable de l'audio (`1_BIBLE` §3.8, couche 0). Un ciel de prières sans les voix d'origine serait une liste de citations — c'est-à-dire autre chose.

**L'écran du Cœur est déjà à 9 éléments sur 9** depuis l'ajout de l'entrée vers la consultation. **Le budget de §15.1 est plein : le prochain ajout devra en retirer un.** C'est noté ici pour qu'on ne le découvre pas en le dépassant.

**⚠️ Donnée à garder sous les yeux** : au 26/07, **zéro dépôt côté Cœur** dans toute l'histoire de l'app. L'écran existait, la question manquait. Le premier indicateur de succès de tout ce §16 n'est pas un taux de clic : **c'est le premier chant déposé.**

---

## §17 — LE MIROIR À L'ÉCRAN, ET LE NOMMAGE (2026-07-30)

> Sens et arbitrages : `1_BIBLE` §2.0 (la souche) et §3.15 (les six principes). Doctrine détaillée : `DOCTRINE-MIROIR.md`. Ici : ce que ça fait à l'expérience, et rien d'autre.
> **Au-dessus de ce §17** : §15 (la loi d'épure) reste souveraine sur la densité. Le miroir n'a droit à aucune dérogation de budget.

### §17.1 — Le miroir n'est pas un écran. C'est un document.

La conséquence de forme de la loi des 16 fruits (`1_BIBLE` §3.15.3) est la décision de design la plus structurante de ce §17, et elle se prend **avant** de dessiner quoi que ce soit :

> **Pas d'onglet. Pas de dashboard. Pas de page de profil. Pas de tuile sur l'accueil.**

Le miroir se **demande**, il se **produit**, il se **lit une fois**, il s'**archive**. Il vit dans les archives comme un document daté, réouvrable, et non comme un lieu où l'on retourne. La navigation reste à quatre (§16.2), et le miroir n'y entre pas.

**Ce que ça règle, et qui aurait été impossible autrement** : un lieu permanent doit remplir son écran à chaque ouverture — donc il ne peut pas se taire. Un document, si. **Le refus (`DOCTRINE-MIROIR` §9, exemple 5) n'est pas un état d'erreur du miroir : c'est une de ses formes, et elle a le même soin de composition que les autres.** Motivé, daté, sans excuse et sans promesse pour demain.

**L'entrée** : depuis les grands rêves et depuis le Cœur, en lien secondaire (emplacements 6-7 du budget §15.1), jamais en geste principal. **Le foyer ne devient jamais le miroir.**

### §17.2 — L'ouverture : une image, puis la matière

Bachelard, *l'image cosmique donne le tout avant les parties* : **le miroir ouvre par une image, jamais par une liste, jamais par un titre de section.** Trois lignes de texte au plus avant que la matière n'arrive.

Et immédiatement après : **les rêves entiers, ouvrables, dans le texte du rêveur, avec leurs dates.** C'est l'arbitrage de traçabilité (`1_BIBLE` §3.15.7a) rendu en design, et il a une forme précise :

- **Pas une note de bas de page. Pas un chevron « sources ». Pas une modale.** Un **accès** : les rêves sont posés sous la prose, dans le même défilement, dépliés d'un tap au même endroit.
- **La prose peut respirer** — elle a le droit d'assembler librement. **Ce qu'elle assemble n'est jamais libre.**
- Une phrase du miroir qui ne s'adosse à aucun rêve ouvrable **ne s'affiche pas**. Pas de dégradé gracieux : elle disparaît, ou le miroir ne se rend pas.

**Hiérarchie visuelle qui en découle, et elle est contre-intuitive** : la prose est l'emballage, les rêves sont l'artefact. Donc **la prose ne domine pas typographiquement.** Elle introduit, elle relie, elle s'efface. Ce sont les phrases datées du rêveur qui portent le poids visuel — même corps de texte que sur la fiche du rêve, jamais rétrécies en citation secondaire.

### §17.3 — Le montage, et la mise en page qui le sert

`1_BIBLE` §3.15.4 : **le miroir est beau par montage, pas par écriture.** Trois de ses propres phrases datées, posées côte à côte, valent mieux que n'importe quelle prose.

Ça se traduit en une règle de composition, pas en une règle de ton :

> **La date est un élément de composition, jamais une métadonnée grise.**

Dans le mode **« ce que j'en ai dit »** — le plus fort du lot et le premier à construire — l'écran est une **colonne de trois à cinq blocs**, chacun composé d'une date en clair (*« Mars 2019 »*, jamais `03/2019`), de la phrase du rêveur en entier, et de rien d'autre. Aucun connecteur généré entre les blocs. **C'est l'espace blanc entre eux qui fait le travail** — et il doit être généreux, φ, non compressible par le nombre de blocs.

Les deux seules lignes que l'app s'autorise arrivent en fin de colonne, et elles ne disent que ce que l'app ne fait pas : *« Voilà tes trois phrases. Je ne les commente pas. »*

**Le fil daté vs le pêle-mêle.** Quand une partie seulement des lectures d'un fil est datée, la ligne du temps se construit **sur le sous-ensemble daté**, et l'écran dit explicitement ce qu'il n'a pas pu accueillir. Un fil profond ne doit jamais disparaître parce qu'une de ses cartes n'a pas de date.

### §17.4 — L'insistance : la seule forme qui compte et qui date

`1_BIBLE` §3.15.2. Le troisième miroir ne qualifie rien. Son rendu suit :

- **Aucune couleur de valence.** Ni chaud pour ce qui porte, ni froid pour ce qui travaille. L'insistance n'a pas de signe. Une échelle de couleur serait un verdict déguisé en palette.
- **Aucune taille proportionnelle à la fréquence** — pas de nuage de mots, pas de bulle qui grossit. Ce serait un classement, et le classement est un jugement.
- **Le fait, et ses dates.** *« Sept fois depuis 2021, et jamais deux fois la même pièce. »* Le nombre n'a le droit d'exister que s'il est accompagné, dans la même phrase, des dates ou de l'énumération qui le composent (`1_BIBLE` §3.13.4, §3.15.2).
- Et rappel du §9 : **aucune grille statistique**, jamais. Ce qui remplace le graphe est la colonne de dates.

### §17.5 — La porte somatique, dans le même écran

Interdit 10 révisé (`1_BIBLE` §3.15.7b, `DOCTRINE-MIROIR` §7). **La porte n'est plus un écran de plus.**

Elle est **le premier geste du miroir**, à l'endroit exact où la matière va s'ouvrir : trois lignes, deux touches (`[ oui, continue ]` `[ pas maintenant ]`), et la matière se déplie en dessous, dans le même défilement. Pas de transition, pas de route intermédiaire, pas de retour arrière à gérer.

- **`[ pas maintenant ]` ne demande rien et ne garde rien.** Pas de champ « veux-tu me dire pourquoi », pas de confirmation, pas de message de consolation. La vue se referme.
- **🔴 Et rien n'est mesuré.** La fermeture n'émet aucun événement — ni analytique, ni compteur interne, ni champ en base. **C'est un coût consenti** : on ne saura jamais si cette protection sert. Mesurer les fermetures transformerait un moment intime en donnée, et le prix de le savoir est plus élevé que la valeur de le savoir.

> C'est ici que vit la tendresse que Tim a demandée. Elle n'est dans aucun adjectif : elle est dans **une sortie qui n'extrait pas de raison.**

### §17.6 — La sortie vers un humain, comme condition du mode

`1_BIBLE` §3.15.5 et §8.7 durci. Sur un mode qui ouvre de la matière lourde :

- La ressource humaine est **dans le même écran que la matière**, pas dans les réglages, pas derrière un bandeau de crise. Elle occupe un emplacement du budget §15.1 — **et c'est un des neuf, assumé**.
- **Ton et forme** : ce n'est pas une alerte. Pas de rouge, pas d'icône d'urgence, pas de majuscules. Une ligne posée, du même grain que le reste, qui existe avant que ça n'aille mal.
- **Le contenu est réel et explicitement localisé** (§8.7, correction du 11/07) : on n'invente jamais un numéro, on ne déduit jamais le pays de la langue. Tim est prêt à référencer des **thérapeutes experts du rêve et du trauma** — c'est un annuaire de praticiens, pas une liste d'urgence.
- **[À TRANCHER — Tim] n°8** : si la ressource humaine prend un emplacement sur un écran déjà plein (le Cœur est à 9/9, §16.4), **lequel des neuf meurt ?** Ma recommandation : le second lien secondaire. Il faut le décider avant de coder, pas en le découvrant.

### §17.7 — « Qu'il repose »

`1_BIBLE` §8.3 et §3.15.7c. Le geste qui manquait entre tout garder et tout brûler.

Il vit **sur la fiche du rêve**, à côté du marquage, jamais dans le miroir lui-même — on ne retire pas un rêve depuis l'écran qui vient de le citer, ce serait une réaction, pas une décision. **Un tap. Réversible d'un tap. Aucune modale, aucune confirmation, aucune justification, aucune notification.**

**Ce que ça change à l'écran du journal** : le rêve reste **entièrement présent et lisible** — pas grisé, pas barré, pas relégué en bas de liste. La seule marque visible est discrète et sans jugement (*« il repose »*), et **il n'y a pas de section « rêves au repos »**. Une section fabriquerait un purgatoire, et un purgatoire se compte.

### §17.8 — 🔴 LE NOMMAGE (arbitré Tim, 30/07)

Le critère qui a tranché, et il vaut pour tout nom à venir dans cette app :

> **Un acte, pas un lieu.**

C'est la leçon directe de l'autopsie des cercles (`1_BIBLE` §3.4.1, mesure du 26/07 : 11 cercles créés le même jour, 9 sans aucun membre, 6 messages en tout — tous de Tim depuis deux comptes). **On avait construit des lieux, pas des actes.** Un lieu vide est un meuble, et un meuble vide est un reproche quotidien. Un acte, lui, n'existe que quand on le fait — il ne peut pas être vide.

| Avant | Après | En anglais | Ce que le nom fait |
|---|---|---|---|
| **Le Mur** | **Le Courant** | *Current* | Un mur est une surface où l'on affiche. Un courant est quelque chose qui passe et qu'on rejoint. Le nom porte le mouvement, pas l'archive. |
| **Les Groupes** | **Weave** | *Weave* | Un groupe est une liste de personnes. Un tissage est ce qu'elles font ensemble. Sur la page de présentation : **« Dream Weaving Circles »**. |
| **Journal** | *(inchangé)* | — | **« Reçus ☾ / Dits ♥ » conservés** — les deux mots sont déjà des participes, donc déjà des actes. Ils passent le critère sans modification. |

**Conséquences de design, à ne pas rater :**
- **Le Courant garde toutes les red lines du Mur** (`1_BIBLE` §3.4.2) : ordre chronologique ou lunaire, jamais optimisé pour la rétention · aucun compteur public · la résonance existe mais reste intime · anonymat par défaut · modération humaine avant toute ouverture publique. **Le renommage ne relâche rien.**
- **Weave est porté par une intention, et c'est ce qui le distingue d'un cercle.** L'intention est l'acte fondateur : sans elle, pas de Weave. C'est la correction structurelle de ce qui a tué les cercles — on ne crée plus un lieu en attente d'habitants.
- **Ni l'un ni l'autre n'affiche de compteur de membres.** Un « 2 membres » sur un Weave rejouerait exactement l'échec de 2026 : le seuil protecteur de Taylor est à 3, et l'afficher en dessous serait annoncer sa propre fragilité.
- **[À TRANCHER — Tim] n°9** : « Weave » reste en anglais en français. C'est assumé (le mot n'a pas d'équivalent français qui soit un acte — « Tissage » est un nom de chose, « Tisser » un infinitif nu). À confirmer sur son téléphone, comme tout le reste.

### §17.9 — Ce que ce §17 ne dit pas

**Les écrans du Courant et de Weave n'ont jamais eu de maquette** (§15.4 : *« Journal · Univers · Réglages · Forge · Mur · Groupes n'ont jamais eu d'étalon »*). Ce §17 pose leur **loi**, pas leur **forme**. Une passe d'épure ne peut pas inventer un étalon inexistant : il faut une session de design dédiée, briefée avec ce §17 et avec §15.

**Et le miroir non plus n'a pas d'étalon.** Le seul rendu réel produit à ce jour est l'aperçu du mode « ce que j'en ai dit ». C'est peu, et c'est le bon endroit où commencer — parce que c'est le mode où l'app écrit le moins.
