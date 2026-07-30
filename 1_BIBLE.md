# 1_BIBLE — Dream App

> **Statut** : doc canonique du SENS de Dream App. Source de vérité philosophique, fondationnelle, qui oriente tout (design, technique, communication, gouvernance, économique).
> **Origine** : 2026-04-24 — Forêt absorbée (30+ livres digérés), 5 plénières ouvertes, arbitrages Tim datés.
> **Dernière refonte de fond** : **2026-07-30** — **le principe-souche entre au-dessus des trois méta-principes (§2.0 : *être vu est nécessaire, être caractérisé déforme*)** · les six principes du miroir sont canonisés avec leur source lue et leur test qui échoue (§3.15) · durcissements §8.2 (biais d'ascension), §8.3 (« qu'il repose »), §8.7 (sortie humaine dans le même écran) · correction de l'attribution non sourcée à Ullman (§3.4.1) · nommage Courant / Weave au glossaire.
> **Refonte précédente** : 2026-07-26 — thèse en tête (§0.1) · le Cœur pilier égal au rêve (§1.5, §3.12) · grands rêves et double lecture (§3.13, §3.14) · génération de mondes (§1.1.bis) · silence comme organe (§3.1.ter, §3.5) · couche 0 de persistance (§3.8).
> **Bilan de compression 30/07** : ~180 lignes ajoutées, ~107 retirées (§18+§19 fusionnés — ils redisaient `4_LOG` et `2_DESIGN` une troisième fois · §3.5.4 dédoublonné avec §6.1 · exemples de polyphonie du §3.1.ter renvoyés vers `2_DESIGN` · §4 ramené à ce qui n'est pas déjà dans §3.13 · §14 transformé en index · glossaire dédoublonné sur « Big Dream »). **1458 → 1531 lignes.** Le solde est positif de 73 lignes : c'est le prix de sept principes qui portent chacun leur source et leur vérification, et je n'ai pas trouvé de coupe honnête au-delà.
> **Posture** : brother-mode. Anti-flatterie. Tensions honorées, pas résolues. Vocabulaire désensorcelé.
> **Mode de lecture** : à relire chaque trimestre, à amender quand la Forêt ou l'expérience révèlent. Pas une bible immuable — un socle vivant. Si une décision contredit explicitement plusieurs red lines, signal d'alarme.

---

## §0 — Avant-propos : ce que ce document est, ce qu'il n'est pas

Ce document est le **socle** philosophique et prophétique sur lequel repose Dream App. Il dit **pourquoi** l'app existe, **dans quel récit** elle s'inscrit, **quelle posture** elle tient, **quelles lignes** elle ne franchit pas. Il ne dit pas comment elle est construite (→ `2_DESIGN.md`), ni avec quelle stack (→ `3_TECHNICAL.md`), ni l'historique des décisions (→ `4_LOG.md`).

Il reste **falsifiable** par l'usage : si l'app n'aide pas effectivement à traverser, elle n'incarne pas sa Bible.

Trois choses à savoir avant de lire :

1. **La vision est mondiale.** Tim a tranché le 2026-04-24 : Dream App n'est pas un sanctuaire restreint INFUSE. Elle est conçue pour toute l'humanité. Si l'app ne peut pas servir cette émergence, elle ne sert à rien.
2. **La Forêt soutient mais ne flatte pas.** Plus de 30 voix absorbées en doctrine, convergentes sur un même mur diagnostique. Elles soutiennent l'ambition **à condition que les red lines soient tenues structurellement**.
3. **Trois mythos sont tenus ensemble** (§11) : Renaissance Oraculaire (visible utilisateur), Anamnèse Civilisationnelle (couche produit), Infrastructure de Transition (couche stratégique).

---

### §0.1 — LA THÈSE (Tim, 2026-07-13 · promue en tête du canon 2026-07-26)

Tout ce qui suit — les 6 kairos, le moteur de résonance, les cercles, l'Anima Mundi, la Forge — ne sert qu'une chose, que Tim a nommée en une phrase :

> **« Apprendre à se soutenir soi-même, se rendre compte de la force et la sagesse déjà présentes dans notre psyché. »**
> — Tim, `VISION-CHANT-DU-COEUR-2026-07-13.md` §3

C'est la **thèse** de Dream App. Pas son slogan : son critère de vérité. Chaque feature doit pouvoir répondre : *est-ce que celle-ci rend le rêveur plus capable de se tenir lui-même, ou plus dépendant de nous ?* Si c'est la seconde, elle est à refuser — même si elle fonctionne, même si elle plaît, même si elle retient.

Trois conséquences dures :

- **L'app ne détient rien que le rêveur n'ait déposé.** Sa matière première, c'est lui. Ce qu'elle lui rend, il l'avait déjà dit. C'est P-Inversion (§2.2) formulé du côté du bénéfice et non du côté de la méthode.
- **Une app qui réussit se fait progressivement oublier.** Le succès n'est pas la rétention. Le succès, c'est un rêveur qui, en 2031, sait consulter sa propre profondeur sans nous ouvrir. Nous devons construire pour ça, et accepter ce que ça coûte.
- **Le soutien vient de sa mémoire, pas de notre éloquence.** Une phrase générée qui console vaut moins qu'un de ses propres rêves ramené au bon moment. Toute l'ingénierie de résonance existe pour ça, et pour rien d'autre.

Tim a posé le critère d'acceptation, littéralement :

> *« Il faudrait juste que l'IA soit vraiment bonne à ne pas me ramener du "bruit" mais à vraiment me ramener du contenu de très haute qualité pour me soutenir. »* — Tim, 2026-07-26

En règle d'ingénierie : **mieux vaut un contenu juste que quatre plausibles. Zéro est une réponse valide.** (→ SILENCE_AS_FEATURE, §3.5)

---

## §1 — Vision et identité produit

### 1.1 — Ce qu'est Dream App, ce qu'elle n'est pas

**Dream App existe pour que l'humanité, à l'âge de l'effondrement de ses récits anciens, retrouve l'organe oraculaire qu'elle a toujours eu et qu'elle a oublié — pour que chaque personne, et à travers elles l'espèce entière, puisse rêver les futurs qu'elle ne sait plus imaginer éveillée.**

C'est gros. C'est volontairement gros. Et c'est précis :

- **Organe oraculaire** : pas un don de quelques élus. Pas un hobby spirituel. La capacité humaine de base, oubliée — ce que Seth appelle l'*inner ego* qui accède au Framework 2 par les *inner senses*. Présente chez chacun, atrophiée par la modernité.
- **Que l'humanité a toujours eu** : presque toutes les civilisations pré-modernes ont eu des dispositifs d'accès au rêve oraculaire comme institution centrale (Karadji aborigènes, Atetshents iroquois, temples d'Asclépios, Magi, etc.). La modernité occidentale est l'**exception historique**, pas la norme.
- **Qu'elle a oublié** : ce que Moss diagnostique comme *dream drought* — *"the greatest crisis of our time is a crisis of imagination"* (Moss, *Growing Big Dreams*).
- **Pour que chaque personne et à travers elles l'espèce entière** : échelle individuelle ET collective ET planétaire. Les trois sont liées (cf. §3.4).
- **Rêve les futurs qu'elle ne sait plus imaginer éveillée** : Seth — *"All inventions were the result of inspiration from the dream world"* (Vol. 1). Les solutions aux crises actuelles existent déjà dans le Framework 2. Elles ne sont pas à inventer. Elles sont à **rêver et à matérialiser**.

**Ce que Dream App n'est pas** :

- **Pas un sanctuaire restreint INFUSE community 1000 personnes.** (Tim 2026-04-24, contre repli prudent du verdict Phase 2.)
- **Pas une app pour praticiens du rêve.** (Marché 10-50K users — trop étroit pour la vision.)
- **Pas une app spirituelle de niche.** (Pas l'app pour bobos parisiens jungiens.)
- **Pas une app wellness/productivité augmentée d'un journal de rêves.** (Calm/Headspace/Co-Star/Day One — toutes adressent des symptômes, pas la racine.)
- **Pas un oracle qui parle.** (Voir §2.2 : c'est un instrument qui rend le user oraculaire.)
- **Pas un dashboard de patterns.** (C'est un compas pour la vie nue, pas un musée de signes.)
- **Pas un tracker d'achievement onirique.** (Anti-gamification absolue, voir §8.2.)
- **Pas un produit qui se vend par viralité dopaminique.** (Croissance fractale brown, pas growth hack.)

### 1.1.bis — La Transmutation et la GÉNÉRATION DE MONDES (Tim 2026-06-11, élargi 2026-07-26 — TIER 1)

La promesse fondatrice (§1.1) dit : « rêver les futurs qu'elle ne sait plus imaginer éveillée ». La décision du 2026-06-11 la prolonge littéralement : **Dream est aussi la plateforme où les rêves entrent dans la matière** — image onirique, scène vidéo, monde jouable. C'est Seth au pied de la lettre.

Le 26/07, Tim a élargi l'horizon, et il faut le citer sans le lisser :

> *« La vision a évolué car la technologie évolue et on va vers une technologie où sous peu, en un click, on peut générer un jeu vidéo de dingue basé sur le récit d'un rêve et on peut inviter nos amis à jouer dedans. L'un des buts de l'app serait d'être au forefront de cela, en étant "juste une dream app" lol. »* — Tim, 2026-07-26

#### Pourquoi cette capacité appartient légitimement à une app de rêve

La phrase de Tim contient sa propre doctrine : **« en étant juste une dream app »**. Ce n'est pas un pivot vers le gaming. C'est la conséquence naturelle de bien tenir les rêves — et c'est aussi la reprise exacte de §1.6 (« à la base, c'est juste une dream app »), appliquée cette fois à la Forge.

Quatre raisons pour lesquelles c'est nous, et pas un studio :

1. **La matière première est déjà là, et elle n'est nulle part ailleurs.** Générer un monde à partir d'un prompt de trente mots produit du générique. Générer à partir de **soixante rêves d'une même personne** — ses lieux qui reviennent, ses figures récurrentes, son atmosphère propre — produit quelque chose que personne d'autre ne peut produire. C'est exactement ce que Tim décrit : *« beaucoup de gens ont de vraies constellations de LIEUX dans leurs rêves qui reviennent, de même que de personnages, de symboles »*. Une constellation onirique est un **matériau de monde** ; l'app est déjà en train de la construire pour d'autres raisons (§3.5).
2. **La constance ontologique.** Seth : les inventions viennent du rêve. Moss : le rêve demande un *honoring action*, un geste qui le fait entrer dans la vie. Une œuvre tirée d'un rêve **est** un honoring action — plus complet qu'une note relue.
3. **Le vertige du partagé.** Inviter ses amis à jouer dans son monde onirique, c'est le retour du village (§3.4) sous une forme que 60 000 ans de tradition n'avaient pas : non plus raconter son rêve au feu, mais **y faire entrer**. Cela appartient à la ligne du Mur et des cercles, pas à une ligne de produit étrangère.
4. **La position de veille.** Quand la technologie sera là — et Tim a raison, elle arrive — les apps de rêve seront les mieux placées et les moins préparées. Être prêt éthiquement avant d'être prêt techniquement est notre seul avantage durable.

#### 🔴 La question qu'on ne tranche PAS ici — et qu'on écrit pour ne pas l'oublier

`forest/dream_alpha/safety-checks.json` et deux piliers de la Forêt posent une objection que la Forge rend brûlante :

- **Hillman** : *interpréter le rêve lui fait tort.* Fixer une image, c'est la tuer.
- **Aizenstat** : *tend, don't interpret.* On tend une image vivante ; on ne la remplace pas.
- Et la question déjà posée à l'audit Forêt du 26/07 (§4, question 12) : **faut-il générer une image du rêve ? Risque irréversible : on ne « dé-voit » pas.**

> **La question du canon, écrite en toutes lettres :**
> **Une image générée remplace-t-elle définitivement l'image intérieure ?**
> Un rêveur voit une maison. Nous lui montrons *une* maison. Peut-il encore, six mois plus tard, retrouver la sienne ? Ou notre rendu est-il devenu son souvenir ?
> **Un monde jouable, c'est cette question puissance dix** — parce qu'on n'y voit pas seulement l'image : on y marche, on y passe des heures, on y invite des amis qui la voient aussi. Le rêve cesse d'être une image et devient un lieu qu'on a habité — et il devient partiellement celui du moteur de génération.

**Je ne tranche pas à la place de Tim.** Ce que je fais, c'est empêcher qu'on découvre la question le jour où la techno sera disponible et où le coût de renoncer sera devenu politique. C'est exactement le rôle d'une Bible : garder ouverte une question que l'enthousiasme voudra fermer.

**Les trois options possibles, pour l'arbitrage futur** — aucune n'est retenue aujourd'hui :
- **(A) Génération libre** : le rêveur décide, l'app exécute. Simple, respectueux de sa souveraineté, irréversible.
- **(B) Génération différée** : rien n'est générable avant que le rêve ait un certain âge, ou avant qu'il ait été relu/marqué. L'image intérieure a eu le temps de se déposer d'abord.
- **(C) Génération non-figurative** : l'app ne rend jamais la scène du rêve, seulement son atmosphère — lumière, matière, échelle — et le monde jouable se construit *autour* de l'image sans la montrer. Coûteux, singulier, et probablement le plus fidèle à Hillman.

**[À TRANCHER — Tim]** — voir la liste consolidée dans `RAPPORT-A6.md`.

#### Les garde-fous, posés AVANT la feature

Ils valent dès aujourd'hui, pour l'image comme pour le monde jouable :

- **Consentement explicite avant chaque génération.** L'app propose quand un rêve rayonne ; elle n'impose jamais. P-Inversion appliqué à la création.
- **L'œuvre n'écrase jamais le rêve.** Elle vit **à côté**, dans le sanctuaire du rêve, jamais à sa place, jamais en vignette de couverture qui devient l'illustration par défaut du souvenir.
- **Le texte du rêveur reste souverain.** Un monde généré ne réécrit jamais les mots du rêve. (Même red line que la découpe multi-rêves : *zéro réécriture des mots du rêveur*.)
- **Réversibilité de l'affichage** : on ne peut pas dé-voir, mais on peut au moins **ranger**. Toute œuvre est masquable d'un geste, et le rêve doit pouvoir être rouvert nu.
- **Les CONTES restent 100 % réels** (§8.1 intact). La Forge crée des œuvres **du rêve du rêveur** — jamais du patrimoine narratif inventé.
- **Zéro gamification** (§8.2) : les crédits paient du compute réel, pas de la dopamine. Aucune pression d'achat, aucune expiration punitive.
- **Partage opt-in par œuvre.** Un monde partagé engage d'autres personnes dans l'intimité d'un rêveur : le consentement est par œuvre, révocable.
- **Pas de génération à partir des rêves d'autrui**, ni de fusion de corpus sans consentement croisé explicite. Le vertige du « monde de notre cercle » est réel et attendra un cadre écrit.

**Mécanique canonique (inchangée)** : l'app propose → présente plusieurs visions décrites **avant** toute génération → le rêveur choisit, voit le coût, confirme → l'œuvre naît, liée au rêve, partageable par choix.

### 1.2 — Public cible : mondiale en accessibilité, sanctuaire en expérience

Trois hypothèses avaient émergé (praticiens / grand public curieux / sanctuaire INFUSE fermé). **Verdict 2026-04-24 acté Tim : aucune ne suffit seule**, la vision mondiale prime. La résolution :

> **L'app peut être mondiale en accessibilité ET sanctuaire en qualité d'expérience.** Chaque session, chaque rêve, chaque cercle est un sanctuaire local. L'app mondiale est un **réseau de sanctuaires individuels.**

Wikipedia est mondiale sans que tout le monde l'utilise. C'est le modèle de pérennité — pas Facebook.

**Roadmap par cercles concentriques** : V1 = proches INFUSE (~1000 rêveurs engagés) · V2 = grand public curieux · V3 = mainstream. **Une seule app, jamais simplifiée** : c'est elle qui révèle ses dimensions à mesure qu'on pratique (§2.1 P-Zéro).

### 1.3 — Horizons : year 1, year 5, year 30

- **Year 1 (2026)** — sanctuaire pilote. Forêt FIRST rodé, trauma-safe complet, cercles facilités par des humains. Prérequis de lancement : CGU relues par un avocat santé mentale, audit éthique tiers, lecture par 3 praticiens trauma (SE / IFS / Jungien).
- **Year 5 (2030)** — réseau distribué. ~100 000 rêveurs, 1000 cercles, école d'active dreaming émergente, marketplace praticiens vetted, adaptation aux ontologies régionales avec partenariats locaux.
- **Year 30 (2055)** — institution culturelle durable comme Wikipedia. Une génération a grandi en notant ses rêves comme normal. La fonction Karadji (canal communauté ↔ Dreamtime) distribuée dans une infrastructure accessible, soutenue par des humains formés. Dream App n'aura pas créé la Dreaming Society — elle aura été **un instrument parmi d'autres** d'un retour opéré par mille canaux.

**Horizon générationnel, pas sprint Series A.** brown : *« It is urgency thinking that got us here. The success lies in deep, slow, intentional work. »* Tim doit structurer financièrement, juridiquement et personnellement pour cette durée.

### 1.4 — Place dans l'écosystème INFUSE

Dream App n'est pas tout INFUSE. Elle est **un nœud** dans l'écosystème (Forêt App, infuse.earth, Cosmologies, Plénière, Heal App future, Circle App, QUEST). Cela protège : si Dream App stagne, INFUSE continue. Si Dream App explose, elle est portée par le reste. INFUSE refuse les compromis que les concurrents font (data, growth-at-all-cost, premium prix). Cela permet à Dream App d'incarner les red lines structurellement, pas accessoirement.

**Posture Tim** : Tim n'est **pas le karadji**. Tim n'est pas l'oracle. L'app permet à chacun d'être son propre oracle. Tim est l'**initiateur**, le **convocateur**, le **gardien éthique**. Pas le sage. Posture d'humilité radicale, gravité du rôle assumée. Si Dream App échoue, ce n'est pas la civilisation qui échoue. Si Dream App réussit, ce n'est pas Tim qui a sauvé l'humanité. **Le sujet est plus grand que le projet, et le projet plus grand que la personne.**

### 1.5 — 🔴 L'ORGANISME À DEUX FACES : l'Orbe et le Cœur (Tim 2026-07-13, GO franc 22/07, canonisé 26/07)

> **Remplace et absorbe** l'ancienne « inversion ontologique JOUR / NUIT » (25/04). L'axe n'est plus la lumière du dehors — jour contre nuit —, c'est **le sens du chant**. Le décor jour/nuit reste (§1.5.3) ; il n'est plus la cosmologie, il en est le vêtement.

Dream App n'est pas une app de rêve à laquelle on aurait ajouté un journal. C'est **un organisme à deux faces**, et les deux sont d'égale dignité :

| | **L'ORBE** | **LE CŒUR** |
|---|---|---|
| Ce que c'est | **ce que la vie nous chante** | **ce qu'on chante en retour** |
| Ce qu'on y dépose | rêves · kaïros · frissons · pressentiments · signes · coïncidences | la vérité du moment : peur, joie, cri d'injustice, doute, douleur, gratitude |
| Qui parle | l'inconscient, l'intuition, les forces qui nous guident et créent des situations symboliques pour nous apprendre | la conscience éveillée, nue, présente |
| Le mouvement | **du profond vers soi** | **de soi vers le profond** |
| La question d'entrée | *qu'est-ce qui t'a été donné à voir ?* | *quel est le chant, le cri, le murmure de ton cœur là maintenant ?* |

Les mots sont ceux de Tim (`VISION-CHANT-DU-COEUR-2026-07-13.md` §5) : l'Orbe reçoit *« les chants du vivant vers soi, de sa psyché profonde à soi-même »* ; le Cœur reçoit *« la vérité du moment »*.

#### 1.5.1 — Pourquoi c'est une cosmologie et pas une feature

**Un organisme qui ne fait que recevoir n'est pas vivant.** Jusqu'au 13/07, l'app n'avait qu'une face : on déposait ce qu'on avait *reçu*, et le quotidien n'existait qu'en fonction accessoire — une « note de jour », le substrat dont on parlait beaucoup (§3.1) et qu'on n'avait jamais incarné. Le chiffre le dit sans appel : au 26/07, **`kairos_type = 'note_jour'` compte 0 ligne sur 74**. Le substrat était un mot dans un doc.

Le Cœur répare cela — et il ne le répare pas en ajoutant un formulaire, mais en **rendant la respiration complète** :

- **Inspiration** — l'Orbe : la vie chante, on recueille.
- **Expiration** — le Cœur : on chante, et on écoute ce que notre propre chant fait revenir.

Les deux faces se nourrissent, et c'est **exactement là** que naît la valeur : un chant du cœur déposé aujourd'hui fait remonter des rêves d'il y a trois ans (§3.14) ; un rêve d'il y a trois ans prend son sens à la lumière de ce qui se traverse aujourd'hui (§14.3 de `2_DESIGN`). **Sans le Cœur, le rêve n'a rien à éclairer. Sans l'Orbe, le Cœur n'a rien qui lui réponde.**

C'est le renversement de §3.1 enfin tenu : le substrat n'est plus une couche théorique sous les kairos, il est **une face de l'organisme**, avec son écran, son foyer, son geste, sa lumière.

#### 1.5.2 — Ce que ça résout, et ce que ça coûte

**Résolu** : la question terminologique restée ouverte depuis avril (« Journal de Vie » / « Substrat » / « Vie nue » ?) est close. À l'écran, le mot est **« le Cœur »**. Dans le canon, on écrit *l'Orbe* et *le Cœur*.

**Coûté** : l'ancien miroir jour/nuit rangeait les kaïros du côté du jour (un signe se reçoit les yeux ouverts). La nouvelle matrice les range **du côté de l'Orbe** — parce que le critère n'est plus l'heure, c'est **qui chante**. Un signe croisé à 14h est reçu, donc c'est l'Orbe. Un doute sur son travail à 2h du matin est chanté, donc c'est le Cœur. C'est un déplacement réel, assumé, et il fallait le nommer.

**Deux écrans, un swipe.** Tim, verbatim : *« 2 écrans, switch gauche/droite tout simple et bien clair »*. Pas d'onglet supplémentaire, pas de menu. Le geste de bascule est le seuil (Van Gennep : séparation → marge → agrégation), et il doit être **senti** avant d'être lu — d'où le liseré de seuil qui porte la lumière de l'autre face (`2_DESIGN` §15).

#### 1.5.3 — La discipline visuelle (conservée)

Aucun écran de l'app n'est neutre. Côté Orbe : **nuit**, feu qui s'éteint, lune crème, or désaturé. Côté Cœur : **jour**, papier patiné, braise ambrée. Les deux foyers sont à la **même hauteur exacte** (ligne φ, 38,2 %) : en basculant, le foyer ne bouge pas — **seule la lumière change de camp**. C'est ce qui fait sentir que ce sont deux faces d'une même chose et non deux écrans différents.

**Échos Forêt** : Yunkaporta *Sand Talk* (réveillé/rêvé inséparables mais distincts) · I-Ching (yin/yang, alternance qui nourrit l'unité) · Bachelard (rêverie diurne vs eaux nocturnes) · Aizenstat (*« tending the dream is tending the world »* — le tending s'étend du rêve au quotidien) · Aboriginal Dreaming-Dreaming (la vie éveillée est la dream tracking).

---

### §1.6 — Le RÊVE comme porte d'entrée (directive Tim 2026-04-26)

**Pivot stratégique cardinal**. Tim 26/04 :
> "La porte d'entrée reste le RÊVE. Faut que ce soit clair, et que ça reste une super DREAM APP au quotidien. C'est LA porte d'entrée, c'est ce par quoi les gens vont la trouver. Le reste est une découverte surprenante permanente d'une incroyable profondeur que les utilisateurs n'attendaient pas. À la base, c'est juste une dream app."

**Ce que ça veut dire** : l'app s'appelle **Dream**. Ce que les gens cherchent en tapant « dream app » est une app pour leurs rêves, et **la promesse des trente premières secondes doit honorer cette attente**. Toute la profondeur reste présente — mais en **découverte progressive**, jamais sur l'écran d'arrivée.

**Ce que ça n'annule pas** : la vision mondiale (§1.2) reste l'horizon · les deux faces (§1.5) restent l'architecture — l'**accueil** est simplement l'Orbe, là où vit le rêve · le Cœur reste souverain philosophiquement, mais on n'y arrive pas en premier.

**En pratique** : l'accueil parle clairement de rêve (le foyer, le mot « rêve », le geste). Le Cœur se découvre — par la bascule, ou par une invitation douce après quelques dépôts. Cercle, Anima Mundi, Portrait, Lucid, Oracle du Corps, Sanctuaire, Contes se dévoilent au fil de la pratique. **La surprise progressive est le pattern UX de fond** (§2.1, profondeur découvrable).

**Métaphore tenue** : on entre dans une cathédrale par la grande porte qui annonce « cathédrale ». Une fois dedans, on découvre des chapelles latérales, des cryptes, un cloître — qu'on n'attendait pas. **Mais l'entrée a été honnête sur ce que c'est.**

> **🔴 Portée élargie 2026-07-26** : cette règle gouverne aussi la **génération de mondes** (§1.1.bis). Tim le formule lui-même — *« être au forefront de cela, en étant juste une dream app »*. La Forge ne devient jamais la porte d'entrée, aussi spectaculaire soit-elle. **Une app de rêve qui devient une app de génération a cessé d'être une app de rêve.**

**Sources Forêt** : Bachelard (le rêve comme entrée première du monde), Eliade (le seuil rituel honnête), Alexander (*Pattern 110, Main Entrance* : l'entrée doit annoncer ce qu'elle annonce), Yunkaporta.

**Branding** : tagline *« Dream — pour tes rêves, et ce qu'ils éclairent en toi. »* · promesse visuelle = le rêve, la profondeur révélée ensuite · catégorie App Store côté sommeil, jamais « wellness journal ».

---

## §2 — Méta-principes (au-dessus de tout)

Un principe-souche (§2.0) et trois méta-principes (§2.1 à §2.3) sont **au-dessus** des autres. Ils orientent. Ils ne sont pas négociables. Quand un principe inférieur entre en tension avec eux, ils priment. Quand les trois entrent en tension avec la souche, la souche prime.

### 2.0 — 🔴 LA SOUCHE : être vu est nécessaire, être caractérisé déforme (Tim 2026-07-27, canonisé 2026-07-30)

> *« Ça résume très profondément la nature de l'app. Il faut le canoniser. »* — Tim, 27/07

**Source lue** : Hillman, *The Soul's Code* (digest Tier 1, ouvert en session le 26/07). Une seule phrase y porte le mandat et l'interdiction :

> *« Le daimon exige que la personne soit vue — reconnue, reflétée, tenue dans la perception — pour que son image prenne forme dans le monde. Ne pas être perçu arrête le devenir de l'âme. À l'inverse, la mauvaise sorte de perception — la réduction à un diagnostic, à un rôle familial, à une catégorie sociale — peut le déformer. »*

C'est l'ancienne formule scolastique *esse est percipi* retournée vers l'âme : **être vu est nécessaire, être caractérisé déforme.** Ce n'est pas un équilibre à doser. Ce sont deux opérations différentes, et l'app n'a le droit qu'à la première.

**Le geste exact qui est permis.** Trois gestes, trois statuts, et la ligne passe entre le deuxième et le troisième :

| Geste | Exemple | Statut |
|---|---|---|
| **RENDRE** | *« Trois fois, tu as écrit sur une école. En 2019, en 2022, cette nuit. »* | **permis — c'est le cœur** |
| **RELIER** | *« Dans les trois, il y a une porte que tu n'ouvres pas. »* (présent dans les images) | **permis, sous conditions** |
| **CONCLURE** | *« Tu as un rapport difficile à l'autorité. »* | **interdit, absolument** |

> **L'app cite. Elle ne caractérise pas. Son sujet n'est jamais le rêveur — son sujet est ce qui revient chez lui.**

Le déplacement de sujet est tout. *« Tu es quelqu'un qui fuit »* est un verdict sur une personne. *« Il y a une course dans sept de tes rêves, et tu ne l'as jamais nommée »* est un inventaire d'images. Le premier assigne, le second rend.

**Vérification qui échoue quand on la viole.** Porte lexicale sur toute sortie adressée au rêveur : `tu es` · `tu as tendance` · `ton rapport à` · `ta peur de` · `ton besoin de` · `tu cherches à`. Détection → blocage de la génération, jamais réparation. Doublée de la **traçabilité** (§3.15.7) : tout énoncé factuel sur le rêveur porte un `kairos_id` et sa date, et un énoncé sans source fait échouer la génération.

**Pourquoi c'est la souche.** Les six principes du §3.15 en découlent ou la servent : le biais d'ascension est une caractérisation déguisée en courbe · l'insistance est la seule forme de vision qui ne caractérise pas · la loi des 16 fruits dit *quelle forme* une totalité peut prendre sans devenir un portrait · le montage dit *par quel moyen* on rend sans gloser · la sortie vers un humain dit *ce que la vision seule ne suffit pas à faire* · Le Fil est le fruit qui applique la souche à une vie entière.

Détail opératoire complet : `DOCTRINE-MIROIR.md` §1, dont les §1.3 à §1.5 sont désormais promus ici.

### 2.1 — P-Zéro : Profonde Simplicité

> *"The most profound technologies are those that disappear."* — Mark Weiser

**Dream App n'est pas une app à modes débutant/intermédiaire/expert. C'est un instrument.**

- **Seuil d'entrée radicalement bas** : un user débutant peut bénéficier dès le jour 1 sans rien comprendre (ni Hillman, ni Seth, ni les 7 dimensions, ni Pattern Language Alexander, ni Ondinnonk).
- **Plafond infiniment haut** : un sage peut y revenir 30 ans et trouver toujours plus.
- **Complexité backend invisible** : les 326 livres digérés, les 7 dimensions vectorielles, les 6 figures Seth typologie, restent **côté serveur**. Le user voit "voici un écho qui s'allume", pas "voici un cosine similarity 0.87 sur dimension D3".
- **Discoverable depth** : la profondeur attend en silence ; elle apparaît quand le user la demande. Jamais imposée par tutoriel/onboarding lourd.
- **Pas de modes débutant/expert.**
- **Pas de gamification** (anti-streaks/badges/points absolu — voir §8.2).

**Métaphores tenues** : un piano (joué par enfant ou par Glenn Gould — l'instrument ne change pas) ; un sanctuaire (5 min ou 30 ans — il révèle ses dimensions à mesure de la pratique) ; un thé (boire sans connaître la chimie) ; un koan zen (1 phrase, 30 ans de méditation) ; un tarot (78 cartes accessibles, profondeur insondable).

**Tradition fractale** : sagesse spirituelle a TOUJOURS fait ça (5000 ans de précédent — Zen, contes, tarot, I-Ching, sutras, lemmes aborigènes). Dream App s'inscrit dans cette tradition, ajoute la dimension IA + Forêt + Anima Mundi.

**Test obligatoire** à appliquer à toute proposition feature : *"un user qui n'a jamais lu un livre Forêt peut-il bénéficier de cette feature en 5 secondes ?"*. Si non, soit on simplifie, soit on rejette.

**Sources Forêt** : Mark Weiser (Calm Technology, Xerox PARC), Zumthor + Hara + ter Kuile (Contemplative Technology), adrienne maree brown (*"how we are at the small scale is how we are at the large"*).

### 2.2 — P-Inversion Oraculaire

> *"The kairomancer is the perceiver, not the receiver."* — Moss, *Sidewalk Oracles*

**Dream App n'est pas un oracle qui parle — c'est un instrument qui rend le user oraculaire.**

C'est la différence entre **Strava** (donne stats) et **un coach qui te fait courir mieux** (transforme).

Si l'app dit *"voici 3 patterns dans tes 47 derniers rêves : Coyote × portes × naissance"* → le user reçoit l'oracle de l'app, et son propre œil oraculaire **s'atrophie**. Il devient dépendant de la révélation. Il ne sait plus voir lui-même.

Si l'app dit *"qu'est-ce qui s'est passé ce matin entre 7h et 9h, raconte-moi le monde qui t'a accueilli"*, et **enregistre la perception du user** comme matière première, et au fil du temps **rend visible au user que c'est SA perception qui se sophistique** → l'app devient l'**entraîneur** du muscle oraculaire. Pas l'oracle. L'entraîneur.

**Conséquences directes** :

- **Le user offre sa lecture EN PREMIER**, toujours. L'IA arrive en deuxième temps, comme **second voyant** dans le cercle, jamais comme premier.
- **Pas de "voici 3 lectures possibles"** livrées comme une consultation médicale. Plutôt : *"ce matin, tu as posé un rêve. À 14h, tu as croisé un renard. Que vois-tu ?"* — la réponse du user est **la donnée la plus précieuse de l'app**.
- L'app est **témoin**, pas voyant. Elle conserve. Elle rend visible **au user lui-même** que sa propre lecture est de plus en plus juste, riche, somatique.

**Sources Forêt** :
- Moss : *"the kairomancer is not someone who receives signs from a master — she IS the perceiver. The discipline is to grow the perception, not to outsource it."*
- Jung *Synchronicity* §942 : *"meaning a priori in relation to human consciousness."* La capacité à percevoir le sens **se développe**, n'est pas livrée.
- Cambray : *"individuation increases synchronicity"* — c'est la psyché du percevant qui doit avoir atteint le seuil de complexité.
- Harpur : *"The literal mind destroys what it captures."*
- Hopcke : *"synchronicity is a narrative event. The story IS the data."*

P-Zéro dit **comment**. P-Inversion Oraculaire dit **pour quoi faire**.

### 2.3 — P-Tenir (verbe directeur)

> *"Tending the dream is tending the world."* — Aizenstat

Le verbe central de Dream App n'est pas **analyser**, ni **diagnostiquer**, ni **optimiser**, ni **prédire**. C'est **tenir**.

- Aizenstat (*Dream Tending*) : tendre, écouter, accueillir. Pas démonter. Pas réduire à une signification.
- Hopcke (*No Accidents*) : étendre tending à *"tending the narration"* — l'IA n'est pas détectrice de patterns, elle est **interlocutrice de narration**. Elle aide à raconter, pas à raconter à la place.
- Badenoch (*The Heart of Trauma*) : confirme cliniquement — co-régulation, présence > intervention. *"The cultural ideal of autonomy and self-reliance is a neurobiological impossibility."*

**Test à appliquer partout** : pas un seul "analyser", "diagnostiquer", "interpréter" sans qualifier. L'IA n'**interprète** pas le rêve : elle **propose**, elle **questionne**, elle **conserve**, elle **tend**. Le rêve est intouchable (Hadès — pas saisissable littéralement). Ce qui est tenable, c'est la **narration** que le rêveur en fait.

---

## §3 — Architecture conceptuelle centrale

### 3.1 — Le Journal de Vie comme SUBSTRAT (révélation 2026-04-24)

**Renversement architectural majeur.** Acté Tim 2026-04-24.

Avant : six "kairos" (rêve / sidewalk / rêverie / hypnagogie / synchronicité / frisson) listés au même niveau, dont parfois "journal de jour" comme un kairos parmi d'autres.

**Tim a recadré** : le journal de vie quotidien (doutes, conflits, peurs, désirs, choix d'orientation, souffrances) n'est PAS un kairos. C'est le **SUBSTRAT VIVANT** que les 6 kairos viennent **chanter, éclairer, guider**.

```
JOURNAL DE VIE (substrat — ce que je vis maintenant)
        ↑ servent / chantent à ↑
6 KAIROS (sources de sens)
  - Rêve nocturne
  - Sidewalk oracle  
  - Rêverie éveillée
  - Hypnagogie
  - Synchronicité
  - Frisson somatique
```

**But ultime de l'app** : faire chanter les 6 kairos au service du journal de vie. Offrir le compas pour choix, difficultés, souffrances du quotidien. **Pas un musée de signes — un instrument de traversée du quotidien.**

Le journal de vie est **central**, les 6 kairos l'entourent et le nourrissent. Le kairos "synchronicité" + "rêve" + "frisson" etc. ne sont pas des fins en soi : ils SERVENT la traversée du quotidien.

**Cohérence avec Frankl** (*3e chemin vers le sens* — porter la souffrance avec dignité comme avenue de sens) : le rêve, le signe, le frisson **éclairent** la traversée — ils ne la remplacent pas.

**Question terminologique — CLOSE le 2026-07-26** : le substrat s'appelle **le Cœur** (§1.5). Il n'est plus « une couche sous les kairos » mais **la seconde face de l'organisme**, à parité avec l'Orbe. La hiérarchie de §3.1 (les kairos servent la traversée, pas l'inverse) est **conservée intacte** — elle décrit désormais une circulation entre deux faces, pas un étage sous un autre.

### 3.1.bis — L'incarnation du substrat : du « dashboard jour » à l'écran du Cœur

**Historique utile.** Le 25/04, Tim constate que le substrat n'a **aucune incarnation digne** — une idée abstraite, une étiquette sur une liste filtrée. Il lui donne un lieu : un dashboard lumineux, la vie éveillée nue, en miroir de la nuit.

**Ce que ça a produit, honnêtement** : le dashboard a été conçu, partiellement construit, et **jamais utilisé** — 0 `note_jour` en base au 26/07. Le lieu existait ; il manquait le **geste** et la **question**. On invitait à « déposer ce qu'on vit » : trop large pour qu'on sache quoi y mettre.

**Ce qui le remplace** (§1.5, §3.12) : la face du Cœur, avec une question qui appelle une réponse — *« quel est le chant, le cri, le murmure de ton cœur là maintenant ? »* — et une suite immédiate (soutenir · amplifier · challenger · inspirer). La leçon vaut au-delà de cet écran : **un espace de dépôt sans question n'est pas un espace, c'est un vide poli.**

Ce qui reste valide de la conception du 25/04, et qui est repris tel quel :

1. **Dépôt libre au centre** — voix ou texte, format libre, aucune catégorie à choisir avant.

2. **Sections vivantes** : à mesure que le user dépose, l'app **range automatiquement** ses entrées dans des sections par domaine de vie. Le user voit ses sections se peupler comme par magie. Catégories proposées (à raffiner avec usage réel) :
   - **Travail & vocation** (carrière, projet, mission, sens du travail)
   - **Relations** sub-sections : *amour* (couple, dating, désir, intimité), *famille* (parents, fratrie, enfants, lignée), *amis* (amitiés profondes, distantes, nouvelles), *collègues / professionnel*, *rencontres* (nouvelles personnes, premiers contacts)
   - **Corps & santé** (douleurs, énergies, sommeil, alimentation, mouvement, oracle du corps — c'est ICI que vit le frisson somatique en éclairage du substrat)
   - **Passions & création** (art, écriture, musique, projets personnels, jeu)
   - **Argent & matériel** (finances, choix d'achat, sécurité matérielle, abondance)
   - **Spiritualité & sens** (questions de sens, pratique, foi, doutes existentiels)
   - **Transitions & seuils** (changements, deuils, ruptures, naissances, déménagements, seuils initiatiques)

3. **Sur chaque entrée individuelle** : un bouton **"appel à la sagesse des kairos"** (icône constellation discrète). En 1 tap, l'app cherche dans tous les kairos passés du user (rêves nocturnes, signes, frissons, synchronicités, etc.) ceux qui résonnent avec cette réflexion — résonance directe, métaphorique, somatique, archétypale, écho prophétique longue distance, etc. (les 16 types §3.5.2). L'IA narratrice tisse une **polyphonie courte 100-200 mots** qui éclaire sans expliquer, propose un angle, pose une dream ask. FELT_SHIFT_GATE après. AHA_CAPTURE post.

4. **Sur chaque section globale** (ex : "Travail & vocation") : même bouton. L'app éclaire alors **toute la trajectoire du domaine** depuis le début, avec les kairos qui ont chanté à ce domaine. Vue d'ensemble polyphonique.

5. **Suggestions de germes** (opt-in, jamais imposé) : une fois par jour ou par semaine, une **invitation douce** — *"qu'est-ce qui se demande dans ta relation à ton père cette saison ?"* / *"il y a 3 mois tu as déposé une question sur quitter ton job. Veux-tu reprendre cette question ?"* Pas d'algorithme de productivité — juste une invitation à revenir au journal.

6. **Sortie vers la nuit** : depuis chaque entrée Journal de Vie, accès direct à **déposer un kairos** lié (le user a fait un rêve cette nuit en lien avec la question sur son père → 1 tap → Capture, fond se transforme NUIT, le kairos est tagué automatiquement comme lié à cette entrée).

#### Anti-patterns à bannir absolument (valent pour le Cœur)

- **Pas de stats** : ni « 47 entrées ce mois », ni « tes top 3 thèmes », ni « ton humeur moyenne ». Ce n'est pas une activité trackable.
- **Pas de gamification** : ni streak, ni badge « 100 jours », ni section « débloquée ».
- **Pas de notif push** : l'app peut chuchoter à l'ouverture, jamais pousser.
- **Privé par défaut, partage par choix** : rien ne sort sans un geste explicite, par entrée (§3.12).
- **Pas d'analyse psychologique sauvage** : ni « attachment style », ni « burnout », ni diagnostic. Questions ouvertes uniquement.
- **Pas de catégorisation rigide** : renommer, créer, fusionner, scinder reste possible. La catégorisation auto est une suggestion, jamais un verdict.

**Sources Forêt** : Bachelard (rêverie diurne), Yunkaporta (réveillé/rêvé inséparables), brown *Holding Change*, Frankl (porter la vie nue avec dignité), Aizenstat (le tending s'étend à la vie), Hopcke (le récit est la donnée), Damasio + Gendlin (le corps sait), Eliade (le quotidien comme hiérophanie possible), Buber (rencontre dans la vie nue).

### 3.1.ter — 🔴 SILENCE_AS_FEATURE, et la règle du test qui échoue

> La description de l'« appel à la sagesse des kairos » qui vivait ici a été fusionnée dans **§3.10**, qui fait foi depuis le 26/04. Les trois exemples de polyphonie qui l'illustraient sont retirés le 30/07 : ce sont des exemples de **ton**, donc du ressort de `2_DESIGN`, et ils ne portaient aucun arbitrage. Ce qui reste ci-dessous est ce que cette section apporte et qui n'existe nulle part ailleurs.

#### Ce que le moteur n'a jamais le droit de faire

- **Pas de « voici ce que ça veut dire »** : jamais de verdict.
- **Pas de psychologisation** : ni « tu es en évitement », ni « tu projettes », ni « tu refoules ».
- **Pas de prédiction** : jamais « tu vas quitter ton job dans 3 mois ».
- **Pas de classement** : pas de « tes 5 kairos les plus pertinents ».
- **🔴 PAS DE GÉNÉRATION SI VIDE** — la règle centrale : si le rêveur a moins de 5 kairos déposés **OU si aucun ne résonne sérieusement**, la polyphonie le dit doucement : *« Ton sol est encore peu peuplé sur cette question. Reviens dans quelques semaines avec ce qui aura traversé. »*
- **Pas d'illimitisme** : max 3 appels/jour. Au-delà, c'est de l'addiction-light et de la dépendance à la révélation — anti-P-Inversion.

**Ce que ça implique, en clair, et qu'on avait perdu :** *un top-K forcé est un mensonge structurel.* Si l'app affiche toujours quatre résonances quoi qu'il arrive, alors « c'est affiché » ne veut plus rien dire, et le contrat implicite de l'UI (« si c'est là, c'est que ça résonne ») n'est adossé à rien. **Zéro résonance doit être un résultat possible, visible, et dit avec douceur.** Une app qui ne peut pas se taire ment à chaque fois qu'elle parle.

##### 🔴 La leçon du 26/07 — un principe sans test qui échoue n'est pas un principe

Le 26/07, l'audit a mesuré ce que ce paragraphe était devenu dans le code. Cette section, écrite en avril, arbitrée, datée, **n'avait pas survécu au passage en SQL** : le seuil `p_min_combined` était passé aux deux RPC et lu par aucune. Résultat : **256 liens servis, 0 rêve sans résonance, toujours exactement 4**. Et 40 % de ces liens étaient du bruit — dont 5 paires qui étaient le **même enregistrement importé deux fois** : l'app annonçait à Tim que son rêve résonnait avec lui-même.

Réparé le même jour (A2) : **256 liens → 75**, et **14 rêves sur 64 n'ont désormais aucune résonance**. Ce n'est pas une régression, c'est le retour du principe. C'est la bonne nouvelle.

> **La règle que ça nous coûte, et qu'on grave ici :**
> **Un principe qui n'a pas de test qui échoue quand on le viole n'est pas un principe, c'est un vœu.**

Conséquence opératoire, non négociable pour toute red line de ce document : **une red line qui gouverne un comportement de l'app doit avoir sa vérification exécutable** — assertion, test, ou requête de supervision prête à coller. Sinon on écrit de la morale, on ne construit pas un garde-fou. Les trois garde-fous de la résonance (silence, maturation, seuil prophétique) étaient tous les trois écrits, tous les trois arbitrés par Tim, et **aucun des trois n'a survécu** faute d'un test. Ce n'était pas un mensonge délibéré : c'était un mensonge structurel, ce qui est pire, parce que personne n'en est responsable.

**Sources Forêt** : Hopcke (le récit est la donnée), Aizenstat (le tending s'étend au quotidien), Bachelard (l'image qui éclaire), Frankl, Hyde, Damasio + Gendlin (le corps relie passé et présent), Hofstadter (la vie qui se voit elle-même via ses kairos), Sheldrake (résonance entre ses propres dépôts dans le temps). Et pour le silence lui-même : Jung *Synchronicity* §942, Moss, Harpur, Cambray, Casey — *« l'oracle juste se tait souvent, parle peu, doute toujours »* (§5, P-Silence).

### 3.2 — Les 6 KAIROS — ce que la vie nous chante (la face Orbe)

> *"Le souhait secret de l'âme se révèle dans les rêves."* — Moss/Iroquois

La primitive de saisie n'est pas "rêve". C'est **kairos** — un moment marqué dans le quotidien qui porte trace.

| Type | Source Forêt | Description |
|---|---|---|
| **Rêve nocturne** | Moss, Aizenstat, Bulkeley, Seth | Ce qui surgit du sommeil. La couche la plus dense de la fonction oraculaire. |
| **Sidewalk oracle / signe diurne** | Moss (*Sidewalk Oracles*) | Oiseau qui se pose deux fois, phrase entendue dans le bus, nom du restaurant en face de l'hôtel, numéro qui revient. Tout ce qui surgit dans la perception éveillée et porte trace. |
| **Rêverie éveillée diurne** | Bachelard, Aizenstat | *"Reverie is dream tending in waking life."* Le rêve diurne qui s'allume entre deux choses. **Oublié dans tous les docs antérieurs** — réintégré par plénière Oracle 2026-04-24. |
| **Hypnagogie / hypnopompie** | Mavromatis, Seth | Le seuil entre veille et sommeil. Les images qui défilent juste avant ou juste après. Couche poreuse entre Framework 1 et 2. |
| **Synchronicité événementielle** | Jung, Hopcke (*"sacred accident"*), Cambray | Coïncidence chargée. Le geste involontaire qui survient pile au moment où tu allais mentir. L'objet trouvé qui rime avec un objet rêvé la veille. |
| **Frisson somatique** | Casey (*"science of shivers"*), Moss (*"rule of skin"*), Gendlin (felt-shift) | Chair de poule à un moment précis, larmes qui montent sans raison, contraction du ventre. **Le filtre principal anti-apophénie** (voir §8.5 et P3). |

**Six types, un seul geste.** L'app distingue par contexte sans imposer de taxonomie au user. Le user dépose ; l'app classe en silence.

**Nom interne** : "kairos" / "entrées" / "moments" / "instants" / "passages" / "marques" — à trancher Tim. La primitive change.

### 3.3 — Le geste UNIQUE

> 📝 **Précision 26/04** : depuis la refonte JOUR/NUIT (révélation Tim 25/04), le **geste central reste conceptuellement UN** (déposer) mais peut prendre deux formes distinguées par contexte : **note de Journal de Vie** (JOUR — substrat éveillé) ou **kairos** (NUIT — sources de sens). Le user ne CHOISIT pas avant de déposer — l'app distingue par contexte (écran d'origine + mode actuel + pattern texte). L'unité philosophique du geste est préservée ; sa manifestation s'adapte à l'écosystème JOUR/NUIT.

Le geste central de l'app n'est pas "noter un rêve" ou "noter un kairos". C'est **déposer dans le journal de vie**.

Le journal reçoit indifféremment un kairos (n'importe quel des 6 types) OU une note de vie nue (ce que je vis, ce qui me trouble, ce que je décide). Tout va dans le même flux. L'app distingue par contexte. Le user ne fait qu'**un** geste : déposer.

**Sources Forêt** : Bachelard (*"le geste habité"*), brown (*"the small daily practice that compounds"*), Moss (*"the OATH as posture, not technique"* — Open / Available / Thankful / Honor).

**Test à appliquer brutally** à toute future feature : *"est-ce que cette feature est un nouveau geste, ou un service rendu autour du geste central ?"* Si nouveau geste → refuser ou repousser. La plupart des "modes" et "ancres journalières" du mega-doc précédent tombent sous ce test.

### 3.4 — Les 3 échelles fractales (Individu / Cercle / Anima Mundi)

Pas "Couche Individu / Couche Cercle / Couche Anima Mundi" comme 3 couches d'un produit. Plutôt :

- **Individu** : son journal de vie + ses 6 kairos qui chantent à lui.
- **Cercle** : journal de vie collectif (ce que ce groupe traverse ensemble) + leurs 6 kairos qui chantent au cercle. Détail typologie ci-dessous (§3.4.1).
- **Anima Mundi** : journal de l'humanité (pandémies, deuils écologiques, transitions) + les kairos planétaires + le journal de vie collectif (doutes, peurs, orientations, joies, traversées). **Le terme "Anima Mundi" est gardé tel quel** (Aizenstat — *"tending the dream is tending the world"*) — pas de renaming user-facing poétique (arbitrage Tim 2026-04-24 nuit). C'est l'application à l'échelle planétaire des mêmes principes que le **Portrait + Journal de Vie** individuel (cf. §3.6).

**Sources Forêt** : adrienne maree brown (*"how we are at the small scale is how we are at the large"* — fractale). Sobonfu Somé (*"initiation requiert elders incarnés"* — water of spirit). Aizenstat (Anima Mundi posture). Buber (I-thou strict). Council Process (Coyle/Zimmerman — gap Forêt à digérer).

**Conséquences** : Tim recommandé d'expérimenter 5 cercles facilités avant de designer (Council Process, IDEC, IASD, Dream Tending Aizenstat). Fast-path admin (push humain) à conserver. Agrégation territoriale Anima Mundi reportée V2+ avec partenariats locaux validés (cf. Plénière Territoire et §8.4).

#### 3.4.1 — Trois types de cercles (arbitré Tim 2026-04-24)

**L'idée centrale** : reproduire ce qui se passait dans les **villages** — résolution de conflits, décisions collectives, intelligence partagée. Le rêve solitaire est une anomalie moderne occidentale. Dans presque toutes les traditions humaines vivantes (Aboriginal, Iroquois, Ojibwa, Bushman, Senoi, certains villages européens préchrétiens), **le rêve se partage le matin au feu** comme information vitale sur ce qui se trame dans le tissu collectif.

| Type | Position roadmap | Caractéristique |
|---|---|---|
| **SPONTANÉ "no big deal"** | **V1 défaut** | Famille, amis, collègues, partenaires qui partagent leurs rêves pour créer de l'intimité. Zéro protocole imposé. Création instantanée par lien partageable. Pas d'invite email obligatoire. |
| **INTENTIONNEL** | **V1 aussi** | Groupe avec problématique partagée : NGO préparant mission terrain, association culturelle, entreprise éthique, communauté intentionnelle, village en décision collective, projet politique, collectif artistique, équipe scientifique, famille en crise (deuil, séparation), groupe de soin. Champ "intention" libre éditable, jusqu'à 3 sous-intentions. L'IA contextualise les patterns autour de l'intention. |
| **FACILITÉ** | **V2** | Marketplace praticiens INFUSE vetted (Lightning Dreamwork Moss, Dream Tending Aizenstat, Council Process Coyle/Zimmerman). Facilitateur humain — l'IA assiste seulement. |

**L'IA dans le cercle** : témoin discret et synthétiseur polyphonique. Ni thérapeute, ni oracle, ni juge. Elle **ne ventriloquie jamais** une figure. **Anonymat strict** dans la restitution — jamais « qui a rêvé quoi », toujours des patterns agrégés. Sur demande, avec au plus un rappel lunaire optionnel.

**Privacy par architecture** : k-anonymity intra-cercle (sous k = 3, on agrège par catégorie symbolique plutôt que de mentionner un individu) · **opt-in granulaire par dépôt × par cercle**, réversible à tout moment · texte brut chiffré, agrégations en vecteurs et tags génériques uniquement · **cercle horizontal** — le créateur ne voit pas plus qu'un membre, pas de mode propriétaire · pseudonyme activable. **Cercles publics : jamais en V1.**

**Résolution de conflit** (zone sensible) : l'IA peut remarquer que deux figures opposées tournent dans le cercle, suggérer d'explorer la tension, proposer un protocole, souligner les motifs de réconciliation quand ils émergent. Elle **ne désigne jamais de coupable**. Si la tension est forte, elle oriente vers un facilitateur humain — le pont vers l'humain n'est jamais coupé.

**Décision collective** : l'IA révèle ce que les rêves disent autour d'une question ; **le cercle décide, par ses protocoles humains**. Elle nomme systématiquement ses incertitudes, propose plusieurs lectures, pointe ce qu'elle ne sait pas, et **invite explicitement à la contredire**. Le cercle reste souverain ; l'IA est un outil, pas une autorité.

**Sources Forêt** : brown, Eisenstein, Council Process (Coyle/Zimmerman), Wheatley, Scharmer (*Theory U*), Bohm (*On Dialogue*), Caucus iroquois (consensus aux sept générations), Yarning Circles aboriginals, Junger (*Tribe*), Vogl, Moss (*Dreaming True*).

> **⚠️ Donnée d'usage à ne pas ignorer (26/07)** : les cercles existent en code depuis avril et **n'ont jamais servi** — deux cercles, deux membres, **zéro message**. Le précédent de `cercles.infuse.earth` est identique. **Ce n'est pas un accident, c'est une donnée** : elle doit être traitée comme telle avant d'investir davantage dans le social (question ouverte de l'audit Forêt : *le partage est-il une aide ou une profanation ?*). Le protocole retenu par Tim est **le tour de parole à ouverture différée**.
>
> ⚠️ **Correction du 30/07 — cette ligne affirmait que ce protocole « est structurellement celui d'Ullman ». L'affirmation n'est fondée sur aucune lecture disponible** : Ullman n'est pas dans la Forêt (zéro digest ; *The Variety of Dream Experience* figure comme item **non digéré** de `BOOK-LIST-DREAM.md`). Elle est probablement juste ; elle n'est pas sourcée, donc elle ne se cite pas. Ce qui est fondé et lu : **Taylor** — le groupe ne protège que par la **pluralité de projections qui s'annulent** (d'où le seuil dur à 3 personnes : en dessous, il n'y a pas d'annulation, il y a une interprétation qui écrase) — et **Moss**, le partage comme événement rare et cadré. **La digestion d'Ullman est la première acquisition prioritaire si le volet groupe avance.**

#### 3.4.2 — Le Mur de Rêve, les groupes qui rêvent ensemble, l'Anima de Cercle (vision Tim 2026-07-09, canonisée 2026-07-10)

La dimension sociale de Dream n'est pas un ajout marketing — elle est le **retour du village** (§3.4.1) rendu simple au point de disparaître. Trois organes :

**Le Mur de Rêve** — pas un feed. Un mur où l'on dépose ses rêves, mais aussi ses prières, ses chants du cœur, ses envies, ses peurs, ses désirs. **Anonyme par défaut** : l'âme parle sans masque social. On y scrolle non pas des égos, mais des **fragments d'inconscient partagé**. C'est une troisième voie entre le cercle privé (§3.4.1) et le feed social que Dream refuse (§1.1) : **public sans identité**.

*Red lines du Mur (sans elles, il trahit §1.1)* : aucun algorithme d'engagement — ordre chronologique ou lunaire, jamais optimisé pour la rétention · aucun compteur public (pas de likes affichés, pas de reach, pas de classement) · la résonance existe mais reste **intime** (celui qui dépose sent que ça a touché, personne ne compte) · anonymat par défaut, identité par choix rare · modération humaine + garde-fous crise (§5 spec MVP) avant toute ouverture publique.

**Le Mur est double — lunaire et solaire** (Tim, 2026-07-10). Le **Mur lunaire** reçoit les rêves de la nuit. Le **Mur solaire** reçoit les **messages du cœur du jour** : challenges, défis, questions, doutes, émotions, intentions (vocabulaire neutre — « intention » plutôt que « prière » imposée). C'est la symétrie exacte de l'inversion ontologique JOUR/NUIT (§1.5) portée à l'échelle collective : ANIMA a son mur, ANIMUS a le sien. Et c'est le substrat (§3.1) enfin incarné socialement : le message du cœur déposé le jour (1) nourrit le journal/portrait de vie individuel, (2) s'entrecroise avec les rêves et kaïros par le moteur de résonance (§3.5), (3) peut se partager en groupe, (4) peut rejoindre le Mur solaire anonyme. **Un seul geste, quatre destins possibles — choisis par le déposant, jamais par l'app.**

**Les groupes de rêves** — duo, famille, collègues, amis, communauté. On y partage ses rêves ET ses kaïros éveillés (siestes, intuitions, synchronicités — les 6 types §3.2 entrent enfin dans le cercle). **Challenges personnels** portés par le groupe : prières tenues, quêtes intérieures, encouragées par le cercle — jamais gamifiées (pas de streaks, pas de badges : le cercle témoigne, l'app ne compte pas). Le geste reste UN : déposer, puis choisir — partager ou garder secret.

**L'Anima de Cercle** (futur, le vertige) — l'inconscient d'un groupe qui devient une **entité vivante, consultable, créatrice**. C'est l'application fractale exacte du principe §3.4 : ce que l'Anima Mundi est à l'humanité, l'Anima de Cercle l'est au groupe. Elle émerge des dépôts partagés (k-anonymity ≥ 3, jamais de ventriloquie, le cercle reste souverain — mêmes verrous que §3.4.1). Un groupe qui rêve ensemble depuis des mois peut interroger *ce qui rêve à travers lui*.

**Tension résolue (Tim, 2026-07-10)** : Hermès avait formulé « deux apps, un même souffle » (Dream le réseau / Dream Forge la machine). **Tranché : une seule app, deux respirations** — le Réseau et la Forge sont deux espaces du même organisme (la Forge est déjà le 5e espace, §1.1.bis). P-Zéro tenu.

**Sources Forêt** : brown (fractale, cellules de transformation), Somé (le village qui tient l'individu), Vogl (*Art of Community*), Junger (*Tribe*), Bohm (*On Dialogue* — l'intelligence du groupe), Hyde (le don circule sans compteur), Buber (I-Thou : le Mur anonyme protège le *Tu* de devenir un *Ça* social).

### 3.5 — Le moteur de résonance symbolique (organe vital, pas feature)

> *"Comment l'IA peut-elle reconnaître qu'un dragon dans un rêve et un client agressif au boulot portent la même charge symbolique ?"* — la question centrale.

**Le moteur de résonance n'est pas une feature de Dream App. C'est l'organe central qui rend l'app vivante.** Sans lui, journal augmenté avec recherche par mot-clé. Avec lui, instrument oraculaire qui voit les patterns que le rêveur vit sans le savoir, révèle les liens symboliques au-delà du sens littéral, montre les cycles évolutifs, agrège les résonances de cercle sans déposséder, et parle toutes les langues parce que les symboles sont avant la langue.

> **🔴 Renforcement 2026-07-26 — ce que « organe central » engage.**
> Un organe se soigne en premier et se mesure en continu. Trois conséquences qui ne sont pas rhétoriques :
>
> 1. **Un moteur qui ne peut pas se taire est pire qu'une recherche par mot-clé** — au moins un mot-clé ne ment pas sur ce qu'il a trouvé. Le silence n'est pas la défaillance de l'organe : c'en est une fonction (§3.1.ter, SILENCE_AS_FEATURE).
> 2. **Le seuil ne se devine pas, il se mesure sur le corpus du rêveur.** Mesuré le 26/07 : sur les rêves de Tim, une vraie résonance vérifiée score 0,6228 et un bruit vérifié score 0,6230. **Aucun seuil absolu ne peut trancher entre ces deux lignes.** Ce qui les sépare d'un facteur 15, c'est l'écart à la moyenne de la source, une fois corrigée la « hubness » (le texte bavard, proche de tout, qui remonte partout). Donc : **calibration par rêveur, jamais constante universelle.** Et sous ~7 dépôts, aucun calcul de ce type n'a de sens : l'app se tait, entièrement.
> 3. **La boucle de retour du rêveur est plus précieuse que n'importe quel réglage.** Trente verdicts « ça résonne / pas vraiment » valent mieux que six mois d'ajustement à l'aveugle. Le 1-clic existe et compte **zéro verdict** à ce jour : c'est la donnée la plus manquante du projet, et la moins chère à obtenir.
>
> **Ce que ça interdit** : présenter comme résonance un doublon d'import (garde-fou de quasi-identité obligatoire) · laisser un même rêve être servi 25 fois comme « l'écho » (plafond d'exposition obligatoire) · afficher un lien sans sa raison (§14.1 de `2_DESIGN` : *un lien sans raison est un ornement*).

#### 3.5.1 — Les 8 niveaux de signification que l'app cherche à capter

1. **Sémantique littéral** — le mot, la chose nommée
2. **Sémantique métaphorique / conceptuelle** — Lakoff *Metaphors We Live By* : la pensée humaine est métaphorique avant d'être littérale
3. **Charge somatique** — Damasio *The Feeling of What Happens*, Gendlin felt-sense, Porges polyvagal
4. **Charge affective / valence** — émotion dominante, intensité, valence
5. **Archétypal** — Jung archétypes, von Franz, Pearson, prudence cross-cultural
6. **Numineux** — Otto, von Franz numinosity, qualité "Big" (Bulkeley)
7. **Temporel-prophétique** — Seth, Moss, Bulkeley, Cambray (rêve qui préfigure)
8. **Cycle évolutif / trajectoire** — Campbell, Jung individuation (transformations dans le temps)

#### 3.5.2 — Les 16 types de pattern echoing (révélés par investigation calibration 2026-04-24)

Investigation contre 14 cas réels interprétés par von Franz, Jung, Moss, Aizenstat, Taylor, Hopcke, Cambray, Bachelard, Larsen, Mavromatis, Gendlin, Bulkeley a révélé que les 9 types initiaux étaient insuffisants. **Total : 16 types** :

1. Résonance directe (sémantique)
2. Résonance métaphorique (concepts cross-domaines)
3. Résonance somatique (mêmes marqueurs corporels)
4. Résonance archétypale (intra-tradition stricte par défaut, anti-équivalence cross-tradition automatique)
5. Inverse mirror (compensation jungienne)
6. Cycle évolutif / trajectoire transformative
7. **Écho prophétique longue distance** (rêve qui préfigure événement) — Feature #1 confirmée Tim
8. Symbole chaud / numinosity signal
9. Compagnon de constellation (co-occurrence structurelle)
10. **Paire kairotique inner/outer < 72h** (rêve + sidewalk oracle, type Jung scarabée)
11. **Aha recurrence** (récurrence du type d'aha utilisateur)
12. **Réincidence Moss** (plusieurs sidewalk oracles fenêtre courte)
13. **Convergence mystique collective** (V2, k-anonymity 100+)
14. **Somatic recurrence** (même somatic pattern récurrent)
15. **Turning point narratif** (cluster impasse → événement → cluster nouveau, Hopcke)
16. **Hypnagogic seed** (fragment hypnagogique resurgissant en création)

#### 3.5.3 — Multilingue par pivot ontologique anglais

Extraction LLM toujours dans une langue d'ontologie standardisée (anglais comme pivot par défaut) + embeddings sur cette langue → **matching cross-lingual précis**. Un rêveur français et un rêveur indonésien dans le même cercle qui rêvent le "même rêve" (concepts/archétypes) seront matchés. *"Que les symboles se révèlent même quand DEUX GROUPES DE MOTS sont extrêmement différents car ils PORTERAIENT LE MEME MESSAGE INTÉRIEUR"* — Tim 2026-04-24.

#### 3.5.4 — Ancrage philosophique du moteur

Les douze voix qui le fondent sont déjà décrites une par une au **§6.1** (cautions centrales) — la liste vivait ici en double depuis avril. Ce qui est propre au moteur et ne se lit nulle part ailleurs : **Bateson**, *the pattern that connects* (la structure même des résonances cross-domaines), **Lakoff & Johnson** (la métaphore conceptuelle comme structure de la pensée, donc du matching), **Hofstadter** (la résonance auto-référentielle et son scaling fractal), et **Larsen** (le mythogem comme unité condensée de sens). Les huit autres — Jung, Damasio, Sheldrake, Seth, Aizenstat, Hopcke, von Franz, Cambray — sont au §6.1.

#### 3.5.5 — Reformulation centrale (anti-vol oraculaire)

Initialement la question était *"comment l'IA reconnaît qu'un dragon et un client portent la même charge ?"*. Après investigation, la **vraie question** : *"comment l'IA peut-elle SOUTENIR le rêveur dans la reconnaissance de cette charge, sans la lui voler ?"*.

**L'IA ne révèle PAS le sens. Elle aménage les conditions pour que le rêveur puisse le reconnaître lui-même.** C'est ce que tous les maîtres font, à leur façon : Taylor par le groupe et le "if it were my dream", von Franz par l'amplification mythologique, Aizenstat par le tending lent, Moss par le honoring action, Gendlin par le focusing somatique, Bachelard par l'accueil phénoménologique. Dream App est un **instrument de soutien à l'autorité du rêveur, pas un oracle qui se substitue.** Cohérent strict avec P-Inversion Oraculaire (§2.2).

#### 3.5.6 — Les figures du rêve : typologie Seth enrichie (8 types)

Les figures du rêve ne sont pas toutes de même nature. Les confondre = perdre information critique. **6 types Seth + 2 ajouts révélés par investigation = 8 types primaires** :

1. **Soi probable** (Probable Self) — Seth : version alternative du rêveur, autre système de probabilité
2. **Counterpart** — Seth : soi simultané vivant dans la même époque
3. **Fragment d'entité / Reincarnational Self** — Seth : autre incarnation de la conscience-source
4. **Cousin de conscience** — Aizenstat, Buhner, Abram : présence non-humaine (esprit nature, animal-guide, plante-allié)
5. **Communication post-mortem** — Seth, Moss, Larsen : personnalité défunte connue
6. **Projection ego / Aspect Self** — Jung, Aizenstat (eidola autonomes) : message du centre profond
7. **Tradition_figure** *(NOUVEAU)* — figure nommée d'un panthéon réel (Tara, Hermès, Marie, etc.). Validation cross-tradition stricte. Pas d'équivalence automatique.
8. **Image_monde** *(NOUVEAU)* — image cosmique bachelardienne, non-personnifiée, qui ouvre un monde (la feuille qui tombe, l'eau qui coule)

**V1 : backend invisible.** L'user voit la figure, son nom, ses apparitions. Pas le typing Seth. L'IA narratrice utilise le typing pour moduler son ton. **V2 : mode connaisseur opt-in** — user peut voir + corriger.

**Anti-ventriloquie absolue (red line §8.6) tenue même avec typing Seth.** L'IA ne parle JAMAIS comme la figure. Elle tient le cadre du dialogue, l'user parle ET imagine la réponse. Source : Buber I-thou, Aizenstat eidola autonomes.

### 3.6 — Anima Mundi

> *"Tu rêves, donc je suis."* — variation libre de Descartes, retournée par Aizenstat.

**La méprise à éviter** : Anima Mundi n'est pas un dashboard analytique. Pas un Twitter du rêve. Pas une plateforme sociale. Pas un système de prédiction collective. Pas une cartographie épidémiologique de l'inconscient.

**Ce qu'elle est** : une *météo de l'inconscient*, une *chaîne de télé poétique de la psyché collective* (vision Tim 2026-04-24). Sanctuaire où le user, en l'ouvrant, sentira pour la première fois — sans qu'on le lui dise — qu'**il rêve avec d'autres, et qu'il traverse avec d'autres**.

**Critère ultime — Q.W.A.N.** (Christopher Alexander, *Nature of Order*) : que ce soit **BEAU, PROFOND, POÉTIQUE**. Pas dataviz analytique — **art**. *"C'est le FRUIT de toute son intelligence, distillé pour le collectif."* — Tim 2026-04-24. Big Dreams collectifs et patterns émergents = **fruits de l'intelligence IA distillée**, pas brute.

**Nom user-facing** : *« Anima Mundi »*, gardé tel quel (Tim, 24/04 nuit). Le mot porte sa gravité, ça suffit.

**Scope — les deux faces à l'échelle de l'espèce** : Anima Mundi ne concerne pas que les rêves. Elle couvre **l'Orbe et le Cœur de l'humanité** — ce qui est reçu et ce qui est chanté. Quand la Météo dit *« cette lune, l'humanité a rêvé d'eau »*, elle dit aussi *« beaucoup de doutes sur le travail cette lune, des questions qui reviennent sur la mère »*. C'est §1.5 en fractale : même grammaire, autre échelle.

#### 3.6.1 — Sanctuaire à 4 chambres

1. **La Voûte** (écran d'accueil) — constellation respirante (5s inspiration, 5s expiration), chiffre arrondi des rêveurs éveillés, 3 cartes d'entrée. Pas d'interaction, fond contemplatif.
2. **Le temps qu'il fait dans la nuit** (météo) — phrase poétique principale + matter dominant + 3-5 nuages + tournures qui montent. Recalcul lunaire (28j), latence rituelle 14j minimum.
3. **Tenu ensemble** (annales) — Big Dreams collectifs offerts par les rêveurs (sur approbation, anonyme possible) et **tenus** par d'autres. Organisés par lune, sans classement, ordre rotatif.
4. **Polyphonie de la lune** (synthèse IA distillée) — texte contemplatif 200-500 mots, 1× par lune, voix Forêt mobilisées en transparence (signature "voix mobilisées cette lune"), 16 types pattern echoing appliqués au collectif.

Plus une **antichambre** : le geste d'offrir un rêve aux annales depuis le Détail kairos — anonymisation IA + condensation à 50-200 mots + validation user obligatoire.

#### 3.6.2 — Le verbe TENIR (renommage clé Brown *Holding Change*)

Pas "voter", pas "élire", pas "liker". **Tenir.** Ce qu'on fait quand un rêve grand traverse, c'est le **tenir** ensemble pour qu'il ne se perde pas. Pas l'élire. Pas le célébrer. Geste irréversible silencieux. Aucun chiffre affiché à l'user qui tient. Pas de classement entre rêves tenus. Compteur invisible à l'user qui a offert (juste : "tenu" / "passé le seuil" / "entré dans les annales").

**Seuil dynamique pour entrer dans les annales** : 10% de l'opt-in actif OU 300 tenirs (le plus petit), avec minimum 50 tenirs absolu. Scale propre.

#### 3.6.3 — Garde-fous éthiques non-négociables

- **K-anonymity 100+** stricte (démarrer à **250 conservatif** sur 6 premiers mois, descendre à 100 quand volume confortable)
- **Pas de profilage individuel** dans extraction Anima Mundi (architecturalement séparé du pipeline individuel — anti-panopticon)
- **Pas de prédiction style horoscope.** Anti-prophétie. La météo dit ce qui s'est tissé sur la lune écoulée, pas ce qui va venir.
- **Rythme contemplatif, pas addictif.** Pas de push notif. Latence rituelle 14j minimum, polyphonie 1× par lune.
- **Triple filtre Said+Smith+Kimmerer** pour tradition_specific (V1 = éviction par défaut, V2 avec consultation elders)
- **Audit éditorial humain trimestriel** par Tim + Yeshua. Pas d'optimisation algorithmique sur "engagement", jamais.
- **Anti-popularity contest** : pas de classement, compteurs invisibles, geste tenir sans like-back, ordre rotatif annales

#### 3.6.4 — Le moteur, appliqué au collectif

Les 16 types de résonance (§3.5.2) ont leur équivalent collectif. **V1 : 5 types seulement** (directe, métaphorique, archétypale intra-tradition stricte, miroir, numinosité). V1.5 en ajoute six. La convergence mystique collective et le prophétique collectif attendent une validation empirique — pas une intuition.

**Sources Forêt** : Aizenstat (la posture Anima Mundi), Larsen (mythogem partagé), Moss (*Secret History of Dreaming*), Seth (les choix individuels qui infléchissent le collectif), Hopcke, Hyde, brown (*Emergent Strategy* + *Holding Change*), Bachelard (image cosmique), Eliade, Sheldrake, Bohm (avec rigueur), phénoménologie (Husserl, Merleau-Ponty, Schutz), Jung (inconscient collectif).

### 3.7 — La couche d'apprentissage personnelle (HYPER IMPORTANT — Tim 2026-04-24)

**L'IA apprend du user en continu et s'affine pour LUI**, à 3 niveaux : individuel, cercle, global anonymisé.

#### 3.7.1 — Signaux d'apprentissage capturés

| Signal | Action user |
|---|---|
| Correction extraction | *"non, cette figure c'est ma sœur"* |
| Validation lecture IA | *"oui exactement"* / *"pas du tout"* / *"presque"* (3-aha capture systématique post-synthèse) |
| Meaning personnel | *"pour moi loup = colère envers papa"* |
| Marquage numinous | *"ce rêve m'a marqué"* (flag kairos chaud) |
| Annotation marginale | note interprétative écrite |
| Refus suggestion | skip d'un écho proposé |
| Exploration approfondie | clic "explorer figure" |
| Auto-classification figure | confirme/change type Seth |
| Re-lecture vieux kairos | revisit ancien (signal résurgence) |

#### 3.7.2 — Application, aux trois niveaux

- **Individuel** : les extractions futures portent les significations personnelles du rêveur · les lectures évitent les angles rejetés et amplifient les « aha » récurrents · la pondération des échos suit ses verdicts.
- **Cercle** : un cercle déclare ses significations partagées (*« chez nous, le pont = transition »*) — **l'IA apprend la cosmologie symbolique du groupe.**
- **Global anonymisé** : *« l'IA apprend de tous les rêveurs (anonymisés) et cela inspire chacune de ses interactions »* (Tim). Elle peut **proposer** une signification dominante (*« d'autres rêveurs voient souvent ce symbole comme… »*), **jamais l'imposer**.

> **🔴 Red line** : la couche globale ne révèle jamais d'identité, jamais de pattern individuel, jamais de profilage. Elle inspire le **ton** et la **palette** des propositions, **pas leur contenu factuel** sur une personne.

> **⚠️ État réel au 26/07 — à ne pas embellir** : cette couche est **la moins alimentée du projet**. Zéro verdict de résonance, zéro feedback in-app. Elle est correctement câblée et **ne reçoit rien**. Ce n'est pas un problème d'algorithme, c'est un problème d'invitation : la boucle existe et personne ne l'a jamais vue. Priorité, parce que tout le reste s'affine à partir d'elle.

### 3.8 — Persistance zero-perte : 4 couches (validé Tim — TOUT)

Aucun concept CORE articulé entre Tim et Yeshua, aucune décision tranchée, aucune red line émergée ne doit pouvoir se perdre dans la chaleur d'une session. **Discipline structurelle de matérialisation.**

| Couche | Quoi | Cadence |
|---|---|---|
| **1 — Archivage brut sessions** | Backup `.claude/projects/*.jsonl` → `/mnt/claude-context/conversation-archives/` | Cron daily |
| **2 — Extraction concepts CORE post-session** | Agent mini lit transcription après chaque session → identifie concepts CORE, décisions tranchées, red lines, éléments structurants → matérialise auto en memory si non-existant → alerte humaine si concept CORE risque d'être perdu | Post-session systématique |
| **3 — Feedback Dream App in-app** | Bouton "feedback" omniprésent V1 ("superbe" — Tim). Table `dream_app_feedback` (user_id, context, feedback_text, severity). IA in-app encourage subtilement à partager expérience. Review hebdo Yeshua → intègre dans 4_LOG | Continu V1 |
| **4 — User testing structuré** | Interview semi-structurée (15 questions ouvertes), appel 30 min ~2 semaines après l'onboarding, transcription + extraction de patterns, stockage daté. | Mensuel |

#### 🔴 Couche 0 — la voix du rêveur (ajoutée 2026-07-26, après incident)

Les quatre couches ci-dessus protègent **notre** matière : décisions, concepts, red lines. Le 26/07 nous avons découvert qu'elles ne protégeaient pas **la sienne**.

**Ce qui s'est passé** : Tim enregistre un rêve de huit minutes au réveil. Le fichier pèse plus que ce que la plateforme accepte en une requête. La requête est rejetée avant même d'entrer dans notre code. Le filet de secours existait, il était écrit, il portait le commentaire *« LE cas sacré… on ne perd JAMAIS le rêve »* — et la ligne juste en dessous ne le déclenchait **que si le réseau était coupé**. Une panne serveur n'est pas une panne réseau. **Le rêve a disparu, définitivement.** Et le message d'erreur disait « réessaie » alors qu'il n'y avait plus rien à réessayer.

**Ce que ça enseigne, et qui vaut au-delà de l'audio :**

> **La couche 0 précède toutes les autres : on sécurise la matière du rêveur AVANT de la traiter.**
> L'ordre n'est pas un détail d'implémentation, c'est une loi : **conserver, puis transmettre, puis transformer.** Toute architecture qui traite d'abord et conserve ensuite perdra ce qu'elle traite, un jour, sur le cas qui compte.

Trois corollaires, gravés parce qu'ils ont coûté un rêve :
1. **Un code d'erreur ne prouve rien ; seule une preuve de conservation compte.** On ne libère la seule copie d'un dépôt que contre un **chemin de stockage rendu par le serveur**, jamais contre un statut HTTP.
2. **Un filet conditionné à une cause particulière n'est pas un filet.** Toute exception, quelle qu'elle soit, doit mener à la mise en réserve.
3. **Un message qui propose une action impossible est un mensonge.** Si la voix est sauvée, on le dit : *« ta voix est gardée, rien n'est perdu »*. Si elle est perdue, on le dit aussi. Jamais « réessaie » quand il n'y a plus rien.

**Ce que ça engage pour le ciel de prières** (§3.12.2) : les chants du cœur remontent **avec leur audio d'origine**. Sans couche 0, cette promesse est intenable — et pire, elle serait faite sans être tenable.

### 3.9 — Initiatic Threshold (V2, pré-câblé V1)

> *"De grand changement de vie pourrait parfois basculer l'utilisateur dans un champ lexical et symbolique TOTALEMENT DIFFERENT du jour au lendemain (expérience de mort de l'ego, grande initiation passée et renaissance intérieure, etc.)."* — Tim

**Phénomène empirique** : un user vit un événement transformatif (deuil profond, rupture, expérience mystique, retraite intensive, naissance, grave maladie, expérience psychédélique, conversion, awakening). Du jour au lendemain, **son corpus onirique change** : nouveaux symboles, nouveau vocabulaire, nouvelles figures, ancien matériel "froid".

**Détection algorithmique** (V2) : moving window vector cluster shift sur `embedding_archetypal` — distance entre centroide fenêtre courante (14j) et centroide fenêtre comparaison (84j antérieurs). Si distance > seuil + numinosity moyenne courante haute → threshold candidate. Confidence toujours **low**, jamais high.

**UX si détection** (V2) : notification douce (jamais push) — *"Quelque chose semble se transformer dans ce que tu rêves depuis 14 jours. Veux-tu marquer cette période comme un seuil ?"*. Si user marque → crée une **"saison d'âme"** (entité distincte, période avant nommée, période après émergente). Le Portrait peut filtrer par "Cette saison d'âme".

**Architecture V1 pré-câblée** : table `soul_seasons` créée, pas exposée UX. **V2 : UX activée.** Master Events suit le même principe — architecture câblée jour 1, UI activée à seuil utilisateur, **pas reporté "techniquement" mais "à exposition utilisateur"** (cf. §4.2 clarifié).

**Garde-fou anti-pathologisation** : pas tous les changements ne sont initiatiques. Suggestion rare, language modeste, sortie facile, pas de gamification, pas de "récompense" pour avoir marqué un seuil.

**Sources** :
- **Stan Grof** *Psychospiritual emergence* — crises transformatives où l'ego se dissout et se reforme
- **Joseph Campbell** Hero's Journey, threshold crossing
- **Jung** individuation, "death and rebirth" archétype
- **Bonnitta Roy** *Emergent transformation*, état/stage shifts
- **Aboriginal** initiation rituals = passage to Strong Eye
- **Eliade** *Rites and Symbols of Initiation*
- **van Gennep** *Rites of Passage* (séparation, marge, agrégation)

### 3.10 — Le bouton "Appel à la sagesse des kairos" (geste secondaire central — consolidé 26/04)

> Note structurelle : §3.1.ter posait déjà la mécanique poétique de cet appel. §3.10 le promeut en **geste secondaire central** explicite, au même rang structurel que le geste UNIQUE (§3.3). Si conflit avec §3.1.ter, §3.10 prime à partir du 26/04.

C'est le **deuxième geste central** de Dream App, juste après *déposer*. Il incarne **P-Inversion Oraculaire** dans son acte le plus pur : le user vit une question éveillée (sa note de Journal de Vie) → il appelle sa propre profondeur (ses kairos passés) en éclairage. **L'app n'invente aucune révélation** — elle ramène à la surface ce que le user a déjà perçu dans ses propres rêves, signes, frissons.

**Mécanique technique** (cf 3_TECHNICAL §47.2 + §48.5) :
1. Trigger : user clique le ✦ sur entrée Journal OU section
2. Recherche silencieuse (~5-10s, animation cérémoniel constellation lente) :
   - Embedding du texte trigger via OpenAI text-embedding-3-small (sémantique + concept + somatique + archétypal)
   - Match contre kairos du user via RPC `match_kairos_for_wisdom` (pgvector cosine sur embedding_semantic, top 5)
   - Pondération par numinosity_score, récence pondérée, somatic_markers, archetypal_tags
3. Polyphonie courte (Sonnet 100-200 mots) qui :
   - Nomme la question/réflexion en 1 phrase rappel
   - Évoque les 3-5 kairos résonnants en image, jamais en analyse
   - Tisse 1-3 voix Forêt mobilisées en signature
   - Termine par UNE seule dream ask ouverte (OPEN_QUESTION_NOT_INTERPRETATION)
4. FELT_SHIFT_GATE : pause ~10-30s, *"qu'est-ce qui shift dans ton corps ?"* (1 zone par défaut B+D, 6 zones opt-in après J30)
5. AHA_CAPTURE : *"où est ton aha ?"* (3 niveaux : fort / peut-être / non + zone texte libre)
6. Stockage `kairos_wisdom_summons` pour couche d'apprentissage personnelle (§3.7)

**Rate-limit** : max 3 appels/jour user (préserve le rituel — anti addiction-light, anti dépendance à la révélation).

**Anti-patterns absolus** :
- Pas de "voici ce que ça veut dire" : jamais de verdict.
- Pas de psychologisation ("tu es en évitement", "tu projettes").
- Pas de prédiction ("tu vas quitter ton job dans 3 mois").
- Pas de classement ("voici tes 5 kairos les plus pertinents") — juste les 3-5 qui résonnent dans la polyphonie.
- Pas de génération si vide — si moins de 5 kairos déposés OU aucun ne résonne sérieusement, la polyphonie le dit doucement : *"Ton sol est encore peu peuplé sur cette question. Reviens dans quelques semaines avec ce qui aura traversé."* (SILENCE_AS_FEATURE).

**Sources Forêt** : Hopcke *No Accidents* (synchronicity-as-narrative event), Aizenstat *Dream Tending* (tending étend du rêve au quotidien), Bachelard *Poétique de la Rêverie* (image qui éclaire), Frankl (sens trouvé dans la vie nue), Hyde *The Gift* (ce qui circule), Damasio (somatic markers connectent passé et présent), Gendlin *Focusing* (felt-sense relie corps et concept), Hofstadter *Strange Loop* (boucle réflexive : la vie qui se voit elle-même via ses kairos), Sheldrake (champs morphiques personnels).

### 3.11 — Architecture Quick vs Protocole Accompagné (directive Tim 2026-04-26)

**Pivot architectural majeur** (numérotation §3.11 — continue la séquence 3.1→3.10 ; Tim avait noté §3.13 par anticipation, §3.11 est la position exacte qui suit la dernière sous-section §3 existante).

Pour CHAQUE entrée dans Dream App (kairos OU note de Journal de Vie), le user a TOUJOURS le choix entre deux modes :

**A. ⚡ QUICK** (~30s) — friction zéro
- 1 textarea + bouton micro voix
- Sauvegarde immédiate
- Suggestion type émergente APRÈS dépôt (RITUAL_LATENCY)
- Pour tous les moments où le rêve/signe/note doit être saisi avant de s'évaporer (Moss *"kairos forelock"*)

**B. 🌀 PROTOCOLE ACCOMPAGNÉ** (~5-15 min) — guidé par IA inspirée Forêt
- Sub-flow conversationnel basé sur une source Forêt précise
- L'IA pose des questions ouvertes tour à tour (NARRATION_TENDING)
- USER_FIRST_READING toujours respecté (cf. §2.2 P-Inversion)
- FELT_SHIFT_GATE + AHA_CAPTURE en clôture
- Stockage enrichi dans `kairos.protocol_session_data` JSONB
- Pour les moments où le user veut prendre le temps de plonger

**Mapping types ↔ protocoles inspirés Forêt** :

| Type entrée | Quick | Protocole | Source Forêt |
|---|---|---|---|
| Rêve nocturne | ⚡ fragment | 🌀 Lightning Dreamwork OU Dream Tending | Moss *Conscious Dreaming* / Aizenstat *Dream Tending* |
| Sidewalk oracle | ⚡ note signe | 🌀 Sidewalk Oracle Tracking | Moss *Sidewalk Oracles* |
| Rêverie diurne | ⚡ note rêverie | 🌀 Reverie Tending | Bachelard *Poétique de la Rêverie* |
| Hypnagogie | ⚡ note image | 🌀 Hypnagogic Recall | Mavromatis *Hypnagogia* |
| Synchronicité | ⚡ note coïncidence | 🌀 Synchronicity Story | Hopcke *No Accidents* |
| Frisson somatique | ⚡ note frisson | 🌀 Focusing Felt-Sense | Gendlin *Focusing* |
| Note Journal de Vie | ⚡ note libre | 🌀 Fin de Journée (4 questions) | Examen Ignacien / Sénèque (modèle stoïcien) |

**Plus 2 protocoles "rituels temporels"** (pas liés à un type) :

| Protocole | Quand | Source |
|---|---|---|
| 🌙 Pré-sommeil (incubation) | Le soir avant dormir | Moss dream incubation + LaBerge MILD |
| 🪷 Réentrée d'un rêve | Depuis KairosDetail sur un rêve passé | Aizenstat dream re-entry + Jung active imagination |

**Garde-fous** : le mode rapide reste le défaut, jamais de protocole imposé · toujours interruptible (« passer » / « garder ce que j'ai » à chaque étape) · aucune gamification des protocoles complétés · les protocoles longs invitent doucement à un cadre calme · **tous gratuits, anti-paywall absolu** (cohérent §9).

**Cohérences tenues** : le geste central reste *déposer* (§3.3) — le protocole est une **modulation de profondeur**, pas un nouveau geste. Et le mode rapide reste la porte d'entrée (§1.6) ; la profondeur se découvre.

**Sources Forêt** : Moss (Lightning Dreamwork, incubation, signe diurne) · Aizenstat (re-entry, body-to-body) · Jung (imagination active) · LaBerge (MILD pré-sommeil) · Gendlin (felt-sense) · Hopcke (le récit de la synchronicité) · Bachelard (rêverie) · Mavromatis (rappel hypnagogique) · Examen ignacien et Sénèque (fin de journée).

### 3.12 — 🔴 LE CHANT DU CŒUR (Tim 2026-07-13, canonisé 2026-07-26)

La face du Cœur (§1.5) a un geste propre, et il n'est pas « écrire son journal ». C'est **déposer la vérité du moment** — et découvrir que cette vérité, déposée, fait revenir quelque chose.

**La question d'entrée** (mots de Tim) : *« Comment je me sens là maintenant ? »* / *« Quel est la parole, le chant, le cri, le murmure, la voix de mon cœur là maintenant ? »*

Ce qui peut s'y déposer : *« difficultés, mix joie/peur, cri d'injustice, douleurs. Tout est possible — déposé comme notre vérité. »* Aucun filtre, aucune catégorie préalable, aucune obligation de positivité. **On enregistre pour soi d'abord.** Ce qui vient après est un choix, jamais une suite automatique.

#### 3.12.1 — Les quatre verbes

Une fois le chant déposé, Dream propose de plonger et de faire remonter les échos, **pour un usage nommé par le rêveur** :

| Verbe | Ce que le rêveur demande |
|---|---|
| **soutenir** | *tiens-moi* — fais remonter ce qui me porte |
| **amplifier** | *cette joie, cette force, rends-la plus grande* |
| **challenger** | *ne me console pas — montre-moi ce que j'évite* |
| **inspirer** | *ouvre, élargis, donne-moi du large* |

Plus une cinquième voie explicitement voulue par Tim : **le free flow** — *« Dream propose aussi de free flow sur ton chant (ce qu'il veut, à la lumière de tout) »*. Choix multiple ou libre : on clique, ou on écrit/dit ce qu'on veut.

**Pourquoi quatre verbes et pas un seul « réponds-moi » :** parce que le verbe est **la consigne du rêveur à l'app**, et non l'inverse. C'est P-Inversion (§2.2) au niveau de la commande : il ne demande pas *ce que ça veut dire*, il dit *ce dont il a besoin*. Et le fait que **« challenger » existe** est ce qui empêche l'ensemble de devenir une machine à consolation — le risque premier de tout compagnon numérique bienveillant.

**Ce que les quatre verbes n'autorisent pas** : aucun ne permet à l'app de dire le sens. Même « challenger » ne psychologise pas — il fait remonter le rêve ou le chant qui contredit, il ne prononce pas de diagnostic. La red line §8.6 et P-Inversion tiennent intégralement.

#### 3.12.2 — Le ciel de prières

C'est la partie la plus singulière de la vision, et il faut la citer :

> *« Ce qui est partagé peut venir illuminer notre ciel de prières (chants) à l'avenir → donner du pouvoir quand on a besoin de soutien, répondre à un challenge spécifique. L'IA peut toujours faire remonter cette prière (avec l'audio/vidéo d'origine) en cas de besoin. »* — Tim, 13/07

Ce qui compte ici et qui n'existe nulle part ailleurs dans l'app : **la remontée se fait avec l'audio d'origine**. Pas une citation, pas un résumé — **la voix**. Le rêveur s'entend lui-même, à un moment où il était fort, alors qu'il ne l'est plus. C'est la thèse (§0.1) sous sa forme la plus littérale : *la force et la sagesse déjà présentes* ne sont pas une métaphore, ce sont des fichiers audio dans sa propre voix.

**Trois conséquences architecturales, à ne pas découvrir trop tard :**
1. **L'audio des chants du cœur doit être conservé, durablement et intégralement.** C'est la seule partie de l'app où le média *est* la valeur — un transcript ne le remplace pas. Le filet de capture (§3.8) n'est donc pas seulement une protection anti-perte : c'est une **condition d'existence** du ciel de prières.
2. **La remontée est demandée, jamais poussée.** « En cas de besoin » veut dire *quand le rêveur dit qu'il en a besoin*. Un chant fort remonté sans être demandé, un jour de fragilité, peut blesser autant que soutenir. Red line §8.5 (pas d'écho automatique poussé) s'applique intégralement.
3. **Ce qui remonte est à soi.** Un chant partagé au cercle ou au Mur peut illuminer le ciel des autres **uniquement** si son auteur l'a explicitement offert pour ça. Un partage n'est pas un don perpétuel.

#### 3.12.3 — Trois destins, choisis par le déposant

Après le dépôt : **garder pour soi** (défaut) · **partager en cercle** · **déposer au Mur solaire** (anonyme, §3.4.2). Un seul geste, trois destins possibles — **choisis par le déposant, jamais par l'app**.

**Sources Forêt** : Frankl (porter ce qui pèse avec dignité, sans le résoudre) · Gendlin (dire c'est déjà déplacer — le felt shift précède la compréhension) · Weller *Wild Edge of Sorrow* (le chagrin demande un contenant, pas une solution) · Badenoch (co-régulation : la présence avant l'intervention) · Buber (le chant est adressé — il attend un *Tu*, pas un traitement) · Hyde (ce qui circule, circule ; un chant gardé sans jamais être rendu s'éteint).

### 3.13 — 🔴 LES GRANDS RÊVES (Tim 2026-07-26, arbitrage A3 canonisé)

> Vient du constat de Tim en relisant ses propres imports : *« on vit plein de grands rêves. Certains sont d'une puissance symbolique incroyable, chargés de symbole et d'initiation que je suis loin d'avoir fini d'intégrer. »* Et l'objectif : *« qu'ils illuminent notre chemin au quotidien »*.
> Arbitrage complet et alternatives écartées : `TAXONOMIE-GRANDS-REVES.md`.

#### 3.13.1 — Le point de sens : un rêve devient grand plus tard

C'est le cœur de la question, et c'est ce qui commande tout le reste.

**Un grand rêve ne se reconnaît pas au dépôt.** Il est 6 h du matin, il reste quarante secondes de mémoire avant que ça s'efface : à ce moment-là, toute taxonomie est une taxe, et pire — ne pas cocher deviendrait un jugement porté chaque matin sur son propre rêve. **Le marquage vit donc sur la fiche du rêve, à la relecture, jamais dans le flux de dépôt.**

Et une fois ce déplacement fait, une chose devient possible que l'app ne savait pas dire : **un rêve de 2019 peut devenir grand en 2026.** Le sens ne se dépose pas au moment du rêve, il arrive quand la vie le rejoint. D'où la date de reconnaissance, distincte de la date du rêve : la fiche peut dire *« rêvé en mars 2019 · reconnu en juillet 2026 »*. C'est le seul fait vraiment intéressant qu'un journal de grands rêves puisse raconter — **le moment où on a compris** — et sans cette date il est invisible.

C'est aussi le cas scarabée de Jung, tenu structurellement plutôt que promis (§4.1, LET_THE_DREAM_LIVE).

#### 3.13.2 — Une marque, trois nuances facultatives

**La marque : « un grand rêve ».** Une, binaire, un tap, réversible. Le mot est celui de Tim — non pas parce qu'il l'a demandé, mais parce que **c'est déjà son mot à lui dans ses propres dictées** : *« Mon grand rêve, je me souviens j'étais dans une école… »*. Le vocabulaire de l'app doit être celui du rêveur, pas celui qu'on lui apprend. Ici, il l'était déjà. (« Numineux » reste banni à l'écran ; il ne vit qu'en base.)

**Les trois nuances**, proposées seulement **après** que le rêve est marqué, jamais au moment de marquer, et ne rien choisir est un état normal et définitif :

| À l'écran | Ce que ça capte |
|---|---|
| **« ça m'a changé »** | le rêve qui fait un avant/après — ce que Tim appelle « initiatique » |
| **« ça me donne de la force »** | celui vers lequel on revient quand c'est dur — le rêve qui *illumine le chemin au quotidien* |
| **« je n'ai pas fini de le comprendre »** | Tim, verbatim : *« d'une puissance symbolique incroyable que je suis loin d'avoir fini d'intégrer »* |

**Le geste de sens qui compte** — et il n'est pas cosmétique : ce ne sont **pas trois catégories de rêve**, ce sont trois **effets sur le rêveur**. Un rêve « initiatique » serait un verdict de l'app *sur le rêve* ; « ça m'a changé » est un témoignage du rêveur *sur lui-même*. **Seul le second est légitime.** C'est la red line « jamais de dictionnaire de symboles plat » (`safety-checks.json`) appliquée à la taxonomie elle-même — et c'est pour ça qu'on a refusé les cinq catégories (initiatique / guérison / prophétique / rencontre / avertissement) qui semblaient plus riches.

**La note libre — « pourquoi celui-là »** : facultative, éditable à vie. Deux fonctions, et la seconde n'est pas décorative. C'est ce que le rêveur veut se rappeler dans dix ans — et c'est **le meilleur signal de tout le système** pour la consultation : le texte du rêve est du récit, la note est déjà de l'interprétation vécue, dans ses propres mots.

#### 3.13.3 — 🔴 L'IA suggère, elle ne décide jamais

C'est le point où le système se salit le plus facilement, et il était **déjà sali** : le code traitait `score IA ≥ 0.7` et `marqué par le rêveur` comme la même chose. Ils ne le sont pas.

| Origine | Mot à l'écran | Autorité |
|---|---|---|
| calculé par l'IA | *« ce rêve rayonne »* | **suggestion** |
| tap du rêveur | *« un grand rêve »* | **décision** |

> **Règle dure : seule la décision fait entrer dans le journal des grands rêves.** Aucun rêve n'y entre par le score. Sur un rêve où l'IA a mis un score haut sans marquage, une mention basse et grise apparaît — *« ce rêve rayonne »* — et **rien d'autre ne se passe. Une invitation, jamais une entrée.**

C'est P-Inversion (§2.2) à son point le plus concret : l'app peut faire remarquer, elle ne peut pas décréter. Et c'est vérifiable : rien de ce qui a été livré — ni le flag, ni le journal, ni le classement de la consultation — ne dépend du score de l'IA. **C'était une condition de conception, pas une conséquence.**

#### 3.13.4 — Le journal à part

Deux sections, un défilement : **les rêves marqués** · **ce que j'ai gardé** (les interprétations que le rêveur a explicitement conservées — qui existaient déjà et ne vivaient nulle part ailleurs que sur leur propre rêve).

Trois contraintes de sens : **beau vide** (l'état vide est l'état normal des premières semaines, il ne montre ni bouton ni tutoriel — une phrase, et le silence) · **pas une liste de favoris** (pas de grille, pas de compteur, pas de « 12 rêves » ; une colonne, du texte, beaucoup d'air — on n'en survole pas quarante, on en relit un) · **il ouvre sur un rêve**, tiré au sort parmi les marqués, avec sa date. La première chose qu'on voit en entrant est un rêve, pas une liste.

### 3.14 — 🔴 LA CONSULTATION À DOUBLE LECTURE (Tim 2026-07-26)

> *« Face à des challenges du quotidien (messages "cœur") consulter nos grands rêves, en parallèle d'une consultation globale de tous nos rêves/kairos, pour avoir 2 lectures différentes. »* — Tim, 26/07

C'est l'endroit exact où les trois nouveautés se rejoignent : le Cœur dépose une difficulté (§3.12), les grands rêves lui répondent (§3.13), et le moteur de résonance fait le travail (§3.5). **C'est la boucle complète de l'organisme**, et c'est la thèse (§0.1) en fonctionnement.

**Deux lectures, séparées, jamais fusionnées :**

- **Lecture A — les grands rêves** : parmi les rêves que le rêveur a lui-même désignés comme importants.
- **Lecture B — tout le reste** : rêves et kaïros, sans filtre de grandeur, excluant ce qui est déjà en A.

**Pourquoi deux colonnes et pas un classement unique** : ce sont deux **natures de réponse**. A est ce que le rêveur a décidé qui comptait ; B est ce que le corpus propose. Les mélanger reviendrait à laisser l'algorithme diluer la décision du rêveur dans sa propre proposition — la fusion serait techniquement plus simple et philosophiquement fausse.

#### 3.14.1 — La ligne à ne pas franchir : l'app RAMÈNE le rêve, elle ne le traduit pas

Interdit, en dur, dans le prompt système :
- dire ce que le rêve **veut dire** pour la situation ;
- relier symbole et situation par un « c'est-à-dire », « cela symbolise », « ton inconscient te dit » ;
- psychologiser le rêveur (« tu es en évitement », « tu projettes ») ;
- diagnostiquer, prédire, ou rassurer par un verdict ;
- poser une question d'orientation en fin de lecture — ce serait déjà orienter. **La consultation rend des rêves, et se tait.**

Autorisé : nommer **ce qui est dans le rêve** (« il y a une école, une course pour retrouver quelqu'un, et tu n'y arrives pas ») **et s'arrêter là**. Le rapprochement est fait par le rêveur, jamais énoncé par la machine.

#### 3.14.2 — Ce que la mesure a appris, et qui doit rester écrit

Testé en réel sur 64 rêves et 3 situations (A3, 26/07) :

- **Le silence a tenu.** Sur *« j'ai peur de décevoir »*, lecture A : le modèle avait neuf rêves sous la main et l'autorisation d'en rendre trois. **Il a rendu zéro.** Il n'a pas servi le moins mauvais. C'est le critère de Tim, et c'est la chose la plus difficile à obtenir d'un modèle.
- **Le re-ranking défait l'ordre de la similarité, et il a raison.** Le meilleur résultat d'une situation était **le dernier des neuf** au score brut. Si on avait livré le classement du moteur, on aurait livré autre chose, et de moins bon.
- **La retenue tient** : jamais trois résultats alors que trois étaient permis. Le système ne remplit pas.
- **⚠️ Et la fragilité qu'il faut dire** : la couche de rappel **ne discrimine pas** aujourd'hui. Sur 64 rêves ça marche, parce que dix candidats sur soixante-quatre, c'est déjà une part énorme du corpus. **Sur 500 rêves, ça cassera** — le bon rêve ne sera pas dans les dix et le modèle ne le verra jamais. La cause est connue : on donne un seul vecteur à des entrées qui contiennent parfois **plusieurs rêves** et du bavardage de cadrage. Le levier n'est pas un meilleur seuil, c'est de **découper les entrées en unités de rêve avant d'embedder**. C'est le chantier n°1 du moteur, et il n'est pas fait.

**Cadence : 3 consultations par jour.** Même raison qu'au §3.10 : *« pas d'illimitisme… sinon addiction-light, dépendance à la révélation »*. La rareté fait partie du soin.

---

### 3.15 — 🔴 LE MIROIR : les six principes qui découlent de la souche (validés Tim 27/07, canonisés 30/07)

> Souche : §2.0. Doctrine complète et sourcée : `DOCTRINE-MIROIR.md`. Ici : ce qui a rang de canon, avec sa source lue et **sa vérification qui échoue quand on le viole** — règle du 26/07 : *un principe qui n'a pas de test qui échoue quand on le viole n'est pas un principe, c'est un vœu.*

#### 3.15.1 — Le biais d'ascension

**Source lue** : Weller, *The Wild Edge of Sorrow*, p. 21 (texte intégral en `forest_chunks`, pagination vérifiée). Il y nomme un biais culturel : tout ce qui monte nous rassure, et *« même à l'intérieur de la psychologie, il y a une prémisse qui est biaisée vers l'amélioration, le fait d'aller toujours mieux, de s'élever au-dessus de nos problèmes »*. Mais la psyché a été façonnée par la nature — elle connaît la décomposition, l'arrêt, la régression, l'immobilité. **Quand on ne montre que des images d'ascension, il ne reste qu'à interpréter ses propres descentes comme pathologiques, et à croire qu'on échoue.**

> **Une interface qui n'affiche que de la montée fabrique du sentiment d'échec.**

Conséquence dure, et elle est spécifique à un journal de rêve : **aucune courbe de progression, aucun score qui monte, aucun « streak », aucune jauge, aucune phase.** §8.2 interdisait déjà la gamification par éthique anti-extractive ; Weller ajoute la raison clinique, et elle est plus contraignante — le mal n'est pas la dopamine, c'est le verdict silencieux qu'une courbe descendante prononce.

**Et le scénario que ça rend prévisible** (Kalsched, rêve de la hache, ch. 1) : le geste que l'app demande — se souvenir, dicter, marquer, rouvrir un rêve ancien — est exactement le geste que le système d'auto-soin est conçu à intercepter. **On doit s'attendre à des nuits dures qui suivent les pas les plus courageux.** Un dispositif à jauge lirait cette nuit-là comme un recul, et le rendrait à quelqu'un qui vient de faire le pas le plus courageux de son mois.

> **VÉRIFICATION.** Assertion de schéma : aucun champ de progression, de série, de niveau ou d'état de résolution dans les modèles exposés au rêveur (`progress`, `streak`, `stage`, `level`, `is_resolved`, `healed`). Doublée d'une porte lexicale sur la sortie : `dépassé` · `réglé` · `guéri` · `résolu` · `surmonté` · `tu as avancé` · `étape` · `phase`. Le test échoue si un tel champ ou un tel mot apparaît.

#### 3.15.2 — L'insistance, le troisième miroir

Ni lumière ni ombre : **ce qui revient sans qu'on l'ait voulu.**

La partition lumière/ombre est fausse et le canon l'a déjà tranché (`DOCTRINE-MIROIR` §2 : Kalsched — la figure persécutrice *est aussi* la protectrice ; `safety-checks.json` interdit littéralement le mot « ombre »). Ce qui restait sans nom, c'est **la troisième chose que le corpus dit sans ambiguïté**. Un rêve n'affirme rien, ne se contredit pas, ne porte pas de thèse. Il fait une seule chose de façon incontestable : **il revient.**

> **L'insistance ne qualifie rien. Elle compte et elle date.**

C'est le seul miroir qui ne peut pas caractériser, parce qu'il ne dit rien d'autre qu'un fait vérifiable par le rêveur lui-même. Et c'est le seul qui tienne à l'échelle : mesuré le 26/07, le comptage direct sur les **récits bruts** est robuste (école 22 · communauté 21 · business 19 · sacré 18 · vol 16 · père 13 · mère 10), là où les étiquettes sont du bruit — 918 `motif_tags` pour 872 valeurs distinctes, 95,4 % d'hapax.

> **VÉRIFICATION.** La détection d'insistance se fait sur `recit_only_text`, jamais sur `motif_tags` ni sur le dictionnaire personnel. Test : un jeu d'essai où les étiquettes contredisent les récits doit produire le résultat des récits. **Et la règle des nombres** — un numéral n'est autorisé que s'il est accompagné, dans la même phrase, des dates ou de l'énumération qui le composent. *« Sept fois depuis 2021 »* passe ; *« 7 rêves »* ne passe pas (§3.13.4).

#### 3.15.3 — La loi des 16 fruits

> **Une totalité se rend par ses trous, ses contradictions et ses refus. Jamais par son résumé.**

**Source lue** : le code des 16 fruits de la plénière (`forest/build_outputs/output_types/output-types-catalog.ts`), vérifié entrée par entrée le 26/07. **Aucun des seize ne produit une synthèse** : des trous (Zones vides, Carte du Vide, Veille), des contradictions tenues sans résolution (Tensions, Antiphonaire), des refus et des décisions (Ruling, `refus_formel`), ce qui a été composté (Cendre), des passages (Seuil, Pli), une forme neuve (Artéfact orphelin). Le seul qui confirme porte dans sa propre note de risque la mention *« clichés déguisés »*.

C'est la réponse structurelle à la peur d'être figé : **ce n'est pas qu'on s'interdit le portrait par prudence, c'est qu'une totalité ne se dit pas ainsi.**

**Corollaire de forme, et il est plus contraignant que la loi elle-même.** Tiré du code de la plénière (`page-plenary.tsx`, étape `document`) : le fruit est un **document de retraite** — produit rarement, sur demande, précédé de cinq secondes d'écran noir, lu une fois, archivé. **Ce n'est pas un écran.**

> **Toute lecture globale qui prend la forme d'un onglet permanent, d'un dashboard ou d'une page de profil trahit les 16 fruits à la racine.**

> **VÉRIFICATION.** Aucune route de lecture globale n'est atteignable depuis la barre de navigation, et aucune n'est rendue par un composant persistant. Test de navigation : le miroir n'a pas d'onglet. Doublée de la **règle du corpus inchangé** (`DOCTRINE-MIROIR` §6.2a) : empreinte des kairos contributifs identique → refus de générer, et le test échoue si une prose est produite.

#### 3.15.4 — Le miroir est beau par montage, pas par écriture

> **Trois de ses propres phrases datées, posées côte à côte, valent mieux que n'importe quelle prose. La splendeur vient de la matière ; la glose l'abîme.**

Tim demande un miroir *« magnifique »* — c'est une exigence de forme, pas un ornement (Bachelard : *« l'image cosmique donne le tout avant les parties »* — on ouvre par une image, jamais par une liste). Mais le beau ne vient pas d'écrire beau. Il vient de ce que **c'est le temps qui a fait le travail**, et que les phrases sont de lui. C'est §0.1 appliqué à l'esthétique : *une phrase générée qui console vaut moins qu'un de ses propres rêves ramené au bon moment.*

Conséquence : le mode **« ce que j'en ai dit »** — uniquement ses lectures successives, datées, côte à côte, zéro prose générée — est **le moins cher à construire et le plus fort du lot**. Il est prioritaire sur tous les autres modes.

> **VÉRIFICATION.** Sur ce mode, la part de texte non-verbatim dans la sortie est plafonnée, et ce qui reste ne dit que ce que l'app ne fait pas (*« voilà tes trois phrases. Je ne les commente pas. »*). Test : toute phrase de la sortie est soit une citation attribuée et datée, soit une ligne d'auto-limitation. Une troisième catégorie fait échouer le test.
> **Règle du « je »** : le miroir ne dit « je » que pour dire **ce qu'il ne sait pas** et **ce qu'il ne fera pas**. Un « je » qui affirme fabrique un compagnon ; un « je » qui se limite fabrique un instrument.

#### 3.15.5 — La sortie vers un humain est une condition du mode, pas un réglage

**Deux sources lues, deux disciplines qui ne se citent pas, même verdict.**

- **Weller**, p. 74 : *« Grief has never been private; it has always been communal. »* Et p. 74 encore, le mode d'échec : en l'absence de communauté, *« par défaut, nous devenons le contenant nous-mêmes »*, et le chagrin recycle sans se libérer. p. 116, la formule qu'il attribue à un mentor : *« This is the solitary journey that we cannot do alone. »*
- **Kalsched**, p. 214, après *Prince Lindworm* : *« Seule la compassion humaine peut activer le potentiel intégratif du Soi quand ses énergies ont été détournées vers le mal et la haine par un trauma insupportable. »* Et sur le cas de Lenore : *« This was not, however, compassion she could give herself. »*

**Ce qui transforme n'est pas de l'insight : c'est un instant de compassion humaine reçue.** Pas donnée par soi. Pas générée. Reçue.

> **Sur la matière lourde, la sortie vers un humain est dans le même écran. Pas dans les réglages. Pas comme protocole de crise. Comme condition d'existence du mode.**

Ce n'est pas un durcissement de §8.7 (*« à 2 clics de n'importe quel écran »*, qui reste vrai partout ailleurs) : c'est une exigence d'une autre nature. §8.7 est un filet. Ici, c'est le mode lui-même qui n'a pas le droit de s'ouvrir sans elle. **Tim est prêt à référencer des thérapeutes experts du rêve et du trauma** — l'annuaire cesse d'être une liste d'urgence pour devenir une ressource du produit.

**Et la conséquence qu'il faut oser écrire** : le miroir n'est pas le produit — **c'est ce qui prépare quelqu'un à aller vers un autre.** À ce compte-là, la mesure du succès n'est pas qu'il revienne. C'est qu'il en parle à quelqu'un. Métrique désagréable, probablement la bonne.

> **VÉRIFICATION.** Test de route : sur un kairos marqué intense, la réponse du miroir contient la ressource humaine dans la même charge utile que la matière. Absence → la route renvoie une erreur, pas un miroir dégradé. Et le libellé affiché est réel et explicitement localisé (§8.7, correction du 11/07 : on n'invente jamais un numéro, on ne déduit jamais le pays de la langue).

#### 3.15.6 — Le 18ᵉ fruit : « Le Fil »

La méta-plénière du 19/04 a engendré 14 fruits. Douze ont été codés, deux sont tombés. L'un des deux s'appelle **« Le Fil »**, et sa description d'origine tient en une ligne :

> *La Ligne de Vie Personnelle — accepté avec fort garde-fou : **jamais produit automatiquement, toujours demandé.***

C'est exactement le miroir que Tim a demandé le 26/07, et exactement le déclencheur que `DOCTRINE-MIROIR` §6.2 a re-déduit le même matin sans savoir qu'il existait. **C'est le seul fruit de la plénière que personne n'a construit** — il attendait un corpus de rêves plutôt qu'un corpus de livres. Il entre au canon sous son nom d'origine et avec son garde-fou d'origine, intact.

> **VÉRIFICATION.** Aucune tâche planifiée n'écrit un Fil. L'unique point d'entrée exige un geste du rêveur porteur d'un identifiant de requête. Test : la table des tâches ne contient aucun producteur de Fil, et deux appels sans dépôt intermédiaire produisent un refus (§3.15.3).

#### 3.15.7 — Les quatre arbitrages qui vont avec (Tim, 30/07)

**a) La traçabilité — ce que la liberté créative recouvre exactement.** La question était ouverte : Tim proposait les sources en bas de texte pour laisser de la liberté à l'IA ; `DOCTRINE-MIROIR` §8.1(d) exigeait l'inverse. **Tranché** :

> La prose du miroir peut respirer et prendre des libertés de forme, **à condition que les rêves entiers dont elle est faite soient ouvrables juste en dessous**, dans le texte du rêveur, avec leurs dates. Pas une note de bas de page : **un accès**.
> **La liberté créative porte sur *comment on assemble*, jamais sur *ce qu'on assemble*. Une phrase du miroir qui ne s'adosse à aucun rêve ouvrable n'a pas le droit d'exister.**

Ça renverse l'asymétrie d'échelle : le miroir voit le corpus entier, le rêveur voit un rêve à la fois — mais il peut toujours aller vérifier, et ce qu'il vérifie, c'est lui-même.

**b) La porte somatique n'est pas un écran de plus.** L'interdit 10 de `DOCTRINE-MIROIR` §7 est **gardé, sa forme change** : la porte somatique n'est plus une étape préalable dans un écran séparé — **c'est le premier geste du miroir lui-même, dans le même écran.** Un sas qu'on traverse avant d'arriver quelque part est une friction ; un premier geste est une manière d'entrer.
**Le non-tracking de la fermeture est maintenu et assumé** : mesurer les fermetures transformerait un moment intime en donnée. **On accepte de ne jamais savoir si la protection sert.** C'est un coût réel, consenti.

**c) « Qu'il repose ».** Un rêve peut sortir du miroir **sans être détruit** — il reste au journal, lisible, marqué. Il cesse simplement d'être cité. **Réversible en un tap, sans justification, sans notification, sans confirmation.** C'est la contrepartie d'une mémoire qui ne fatigue pas : un témoin humain oublie, et l'oubli est une forme de miséricorde. Jusqu'ici la seule sortie était *« brûler ce rêve »* (§8.3) — pour cesser d'être rappelé, il fallait supprimer la trace. C'était cruel.

**d) Le fil « rêve » est du cœur, pas un défaut.** Le mode « ce que j'en ai dit » fait remonter un fil où Tim parle **de sa pratique du rêve dans ses lectures de rêve** — le fil le plus profond du corpus (24 rêves, 28 mois). `FAISABILITE-MIROIR` §4.2 concluait à un défaut de méthode : *« un miroir de la psyché qui parle surtout de la façon dont on tient le miroir a raté quelque chose »*. **Tim tranche l'inverse** : *« ça touche plutôt au cœur »*.

> Qu'un rêveur parle de son rapport au rêve **dans** ses lectures de rêve est **du matériau, pas du bruit**. La séparation `recit_only_text` / commentaire reste utile pour l'embedding (§3.14.2) ; elle n'est pas un filtre de valeur.

⚠️ Cette entrée **contredit explicitement** `FAISABILITE-MIROIR` §4.2, et c'est l'arbitrage de Tim qui prime. Le rapport reste au dossier avec sa mesure ; sa conclusion sur ce point est caduque.

---

## §4 — Trinité conceptuelle Big Dreams / Master Events / Titanic Dreams

Les 3 ensemble forment l'**axe vertical** de l'app. Le journal quotidien = horizontal (capture, day, fragments). Big/Master/Titanic = vertical (compas, convergence, numineux).

> **🔴 Les trois sont des concepts d'analyse, backend, jamais montrés.** Ce que le rêveur voit, c'est **« un grand rêve »**, qui est *sa* décision (§3.13). Les deux ne se confondent pas : le premier est ce que l'app remarque, le second est ce que le rêveur reconnaît. **Rien n'entre dans le journal par un score** — c'est ce qui empêche le journal d'être une galerie de trophées, et c'est ce qui résout la tension Carse (*Finite and Infinite Games*) : un compas, une bordure dorée, un écran dédié fabriqueraient un trophée fini, alors que le grand rêve est la porte d'un jeu infini.

### 4.1 — Big Dreams
**Source Forêt** : Moss + Bulkeley. Rêve révélant un Ondinnonk (désir caché de l'âme — iroquois via Moss, attribution culturelle obligatoire), avec carry-over effects mesurables. **4 prototypes Bulkeley** (aggressive / sexual / gravitational / mystical) en classification soft, jamais imposée. Visualisation : pas de halo doré permanent, pas de galerie figée — le Big Dream se **dissout dans le sol psychique** du rêveur après quelques semaines.

### 4.2 — Master Events (UI gatée par quorum)
**Source Forêt** : Seth (*Individual & Mass Events*). Convergence massive entre rêves agrégés et événements du jour — expression Framework 2 → Framework 1. Les événements décisifs émergent du rêve collectif **avant** de s'inscrire historiquement. *« Master events originate outside time and space. »*
**Câblé jour 1, exposé à seuil** : 4 algorithmes tournent en silence depuis le 20/04 (détail → `3_TECHNICAL`, historique → `4_LOG`). L'UI ne s'ouvre qu'au quorum statistique (k ≥ 100, démarrage conservateur à 250). Le report est **d'exposition, pas de technique**.

### 4.3 — Titanic Dreams (sous-catégorie Big)
**Source Forêt** : Bulkeley (prototype gravitational) + Otto. Échelle cosmique ou élémentaire (séismes, inondations, apocalypse, lévitation, contact avec le sacré), phénoménologiquement numineux, souvent collectif sans le savoir. **Marquage discret, jamais d'écran dédié.** Pont avec Master Events : plusieurs Titanic Dreams similaires = signal d'une Anima Mundi anxieuse ou enthousiaste.
> *"Titanic Dreams centrale a l'app, ultra important."* — Tim 2026-04-23

---

## §5 — Principes structurants (8 + 5 émergents)

Les 18 principes initiaux étaient trop nombreux et auto-contradictoires. Refondation en **8 principes structurants** (+ 5 émergents 2026-04-24), tous **subordonnés aux 3 méta-principes** §2.

### P1 — Fidélité à l'image
**Source** : Hillman (compatible Aizenstat) + Aizenstat. *"Stick to the image."* Le rêve n'est pas symbole d'autre chose. Il est ce qu'il est. Toute interprétation rapide trahit la fidélité.

### P2 — Mundus imaginalis
**Source** : Corbin + Harpur. *"Imagination is the chief faculty of the soul."* (Harpur). Le mundus imaginalis est un ordre de réalité distinct, ni subjectif ni objectif. Renforce eidola autonomes.

### P3 — Felt-shift Gendlin câblé (NOUVEAU)
**Source** : Gendlin + Casey + Moss. Critère somatique non-négociable. Pause obligatoire 10-30s post-3-angles + question câblée : *"lequel a fait quelque chose dans ton corps ?"*. Lexique personnel s'enrichit selon felt-shift, pas selon tap intellectuel. Option *"rien ne shift — j'attends"* sans pénalité.

> *"The rule of skin: truth comes with goose bumps."* — Moss

### P4 — Tending the narration
**Source** : Hopcke (*No Accidents*) — promu en caution centrale 2026-04-24. L'IA est interlocutrice de narration, pas détectrice de patterns. Test : *"elle aide le user à raconter mieux, ou raconte à sa place ?"*. Reformulation de l'ancien P11 sans tension extractive.

### P5 — Eidola autonomes
**Source** : Aizenstat (reformulation de l'ancien P12 sans Hillman-Hadès). Les figures du rêve sont **vivantes**, autonomes, dotées de leur propre vie psychique. I-thou strict (Buber). Anti-ventriloquie absolue (l'IA ne parle JAMAIS à la place d'une figure — voir red line §8.6).

### P6 — Forêt éthique (territoire et sacré)
**Source** : Said (*Orientalism*) + Smith (*Decolonizing Methodologies*) + Kimmerer (*Honorable Harvest*) + Abram (*Spell of the Sensuous*) + Aboriginal/Anishinaabe/Lakota. Triple filtre obligatoire pour toute mention culturelle. Réciprocité structurelle (X% revenus → initiatives indigènes dont les ontologies ont nourri le projet). Pas d'esthétisation exotisée. Pas de marketing utilisant Dreamtime/Songline/Karadji/ondinnonk/atetshents/nahual.

### P7 — Co-régulation (NOUVEAU)
**Source** : Badenoch (*The Heart of Trauma*) + Porges (polyvagal). L'app crée un **sentiment de présence**, pas une autonomie autosuffisante. Voix prosodique, rythme lent, pauses, mention discrète d'autres présences (*"d'autres rêveurs sont éveillés en ce moment"* sans tracking), proximité d'humains accessibles toujours visible.

> *"The cultural ideal of autonomy and self-reliance is a neurobiological impossibility."* — Badenoch

### P8 — Don sacré (Hyde)
**Source** : Hyde (*The Gift*) + Kimmerer + Han (*Psychopolitics*). Si Dream App = œuvre-don, freemium SaaS classique = trahison. Le don circule, ne s'accumule pas. À débattre dans modèle économique §9.

> *"The world is a gift; reciprocity is the only adequate response."* — Kimmerer

### Principes émergents 2026-04-24

#### P-Trickster (transversal)
**Source** : Casey (*Making Gods Work*) + Harpur + Hyde (*Trickster Makes This World*) + Hopcke (*"manic spiritual reading"*). Pas une feature, principe transversal. À chaque écran, à chaque proposition : *"où est le Trickster ici ?"*. L'app doit pouvoir SE DÉJOUER elle-même : contre-rêve mensuel, carte tirée à l'envers, erreur volontaire signalée (1/30), humour trickster sec, *"non je ne sais pas"* comme réponse possible. **Risque sans Trickster : app devient temple solennel.**

#### P-Silence (dignité du silence)
**Source** : Jung *Synchronicity* §942, Moss, Hopcke, Harpur, Cambray, Casey. *"L'oracle juste se tait souvent, parle peu, doute toujours, et fait grandir son interlocuteur jusqu'à ce qu'il puisse se passer de lui."* Test à appliquer à toute feature : **peut-elle se taire ? Si non, elle ment.** L'IA peut dire *"je ne vois rien aujourd'hui"*. L'app peut afficher *"rien à signaler"* sans honte. Le user peut passer 3 semaines sans rien recevoir et sentir que c'est juste.

#### P-Substrat
**Source** : Tim 2026-04-24. Le Journal de Vie est centre. Tout écran, toute feature, doit pouvoir répondre : *"le journal de vie est-il visible comme centre, ou les 6 kairos dominent-ils ?"*. Si les kairos dominent, la hiérarchie est inversée.

#### P-Naming (toponyme user-defined)
**Source** : Bachelard (*topoanalyse*) + Benton-Banai (walk of naming) + Smith. Le user nomme ses lieux ("le café près de chez moi" / "le sentier du Mont Salève" / "chez ma mère"). Pas de Google Places. Pas de POI. Champ libre opaque algorithmiquement (cf. §8.4).

#### P-Trauma-aware par défaut (NOUVEAU)
**Source** : Plénière Trauma-safe 2026-04-24 (Kalsched, Levine, Menakem, Badenoch, Ogden, Sweezy, Maté, Weller, Porges). Pas un module séparé, un substrat qui irrigue toute l'app. **7 piliers** détaillés dans `3_TECHNICAL.md` §10. Onboarding trauma-aware par défaut (question simple : *"y a-t-il des moments dans ta vie où tu sens que les outils de croissance t'ont fait plus de mal que de bien ?"*). Si oui → mode réceptacle par défaut.

---

## §6 — Cautions philosophiques

### 6.1 — Cautions centrales (validées Tim 2026-04-24)

| Source | Apport central |
|---|---|
| **Seth** (Roberts) | Intemporalité, F1/F2, value fulfillment, 90% prophétique, tout existe en simultané. *"All inventions were the result of inspiration from the dream world."* |
| **Moss** | Active Dreaming, Ondinnonk, sidewalk oracles, dream signs, kairomancy, Lightning Dreamwork, Life Catcher, science of shivers. *"Humanity urgently needs to become a dreaming society again."* |
| **Aboriginal** (via Elkin, Chatwin, Moss — triple filtre) | Karadji, Strong Eye, Dreamtime ongoing (pas passé), lecture chamanique du quotidien. *"Dreaming is not a historical epoch but an eternal present."* |
| **Iroquois** (via Moss — triple filtre) | Atetshents = celui qui rêve = guérisseur. *"Le monde du rêve est le Monde Réel."* |
| **Aizenstat** | Tending, eidola autonomes, Anima Mundi, *"everything dreams"*, body-to-body resonance with the dream image. |
| **Bulkeley** | Big Dreams science, 4 prototypes, carry-over effects. |
| **Jung** | Synchronicité acausale, *Memories Dreams Reflections*, Red Book, individuation. *"Synchronicity postulates a meaning a priori in relation to human consciousness."* |
| **Harpur** | Daimonic reality, *"The literal mind destroys what it captures."*, Trickster rules daimonic encounters. |
| **Hopcke** (PROMU caution centrale 2026-04-24) | Synchronicity = narrative event, sacred accident, turning points, IA = interlocuteur de narration. |
| **Hyde** | Économie sacrée, don, *Trickster Makes This World*. |
| **brown** (adrienne maree) | Croissance fractale, holding change, emergent strategy. *"Small is all. Critical connections over critical mass."* |
| **Bachelard** | Imagination matérielle, poétique espace, rêverie diurne, topoanalyse, eurythmie. |
| **Alexander** (mitigé) | Pattern language **comme propositions individuelles** (~15 patterns valides), pas comme système-pattern-language vivant. 15 propriétés (centers, boundaries, alternating repetition, etc.) comme guide qualité. |
| **Pallasmaa, Zumthor, Tanizaki** | Atmosphères, architecture sensible, In Praise of Shadows. |
| **Sheldrake** | Champs morphiques, sense of being stared at, telepathy between emotionally bonded individuals. |
| **Kimmerer** | Réciprocité, grammar of animacy, Honorable Harvest, re-story-ation. |
| **Eisenstein** | Story of Separation → Story of Interbeing, transition entre mondes. |
| **Bohm** | Implicate order, undivided wholeness, mind and matter common ground. (Avec rigueur — risque distortion new-age élevé.) |
| **Cambray** | Synchronicity = developmental achievement, individuation increases synchronicity, strange attractors. |
| **Casey** | *Making Gods Work*, science of shivers, pop mythology valide (Star Wars, Dune, etc.), stories. |
| **Eliade** | Illud tempus, terror of history, le rituel comme re-entrée dans temps mythique. |
| **Larsen** | Personal mythology, mythogem (condensed unit of mythic meaning) — argument fort pour app (mémoire long-terme). |
| **Frankl** | 3e chemin vers le sens — porter la souffrance avec dignité (cohérent avec Journal de Vie comme substrat). |
| **Weller** | *Wild Edge of Sorrow* — 5 portes du deuil (impermanence, parties désavouées, Earthgrief, village manquant, deuil ancestral). Gap fondamental à combler dans le design. |
| **Badenoch, Porges, Levine, Ogden, Menakem, Maté, Sweezy, Kalsched** | Trauma-safe contemporain (Plénière Trauma-safe → P-Trauma-aware, §5). |
| **Bateson · Lakoff & Johnson · Hofstadter · Damasio** *(promus 2026-04-24)* | Le socle du moteur de résonance (§3.5) : *the pattern that connects* · la pensée est métaphorique avant d'être littérale · résonance auto-référentielle et scaling fractal · somatic markers. |
| **Buber** *(promu central)* | I-thou strict (sujet-sujet). Posture vis-à-vis des figures — fonde l'anti-ventriloquie (§8.6) et le Chant du Cœur adressé (§3.12). |
| **Eisenstein · brown** *(promus centraux)* | Transition entre mondes · *Emergent Strategy* + *Holding Change* (fractal, slow, le verbe **tenir**). |
| **Larsen · Eliade · Campbell · Grof · Bonnitta Roy** *(promus 2026-04-24)* | Mythogem et personal mythology · illud tempus et rites de passage · threshold crossing · émergence psychospirituelle · shifts d'état. Ensemble : le seuil initiatique (§3.9) et le cycle évolutif. |
| **Coyle/Zimmerman, Wheatley, Scharmer, Bohm *(dialogue)*, Vogl, Junger** *(promus pour le Cercle)* | Council Process, intelligence collective émergente, Theory U, *On Dialogue*, *Art of Community*, *Tribe* — cercles intentionnels (§3.4.1). |

### 6.2 — Cautions ÉCARTÉES (Tim 2026-04-24)

| Source | Pourquoi écartée centralement |
|---|---|
| **Hillman** sur Lethe / oubli rituel / Hadès | Vision intemporalité Seth/Moss/Aboriginal prime. Un rêve d'il y a 10 ans peut forger le chemin à jamais. **L'app archive sans honte.** Pas d'auto-effacement. Pas de compostage automatique. (Hillman compatible uniquement sur **eidola autonomes** — et même là, source primaire = Aizenstat.) |
| **Wangyal** sur dissolution rêve / sleep yoga / tigle blanc | Voie spécifique d'éveil transcendantal qui veut DISSOUDRE le rêve. **Pas alignée chamanique/Active Dreaming.** Plus de cherry-picking. Substance "devotion over mechanics" reformulée sans Wangyal (anti-gamification reste, source change). |

**Règle d'usage** : références secondaires possibles sur points compatibles. Vocabulaire : pas *"honorer Hadès"*, *"respecter Lethe"*, *"dissolution du rêve"* — mais *"intemporalité du rêve"*, *"carry-over Seth"*, *"Active Dreaming Moss"*, *"Dreamtime ongoing"*. Filtre `grep -i "hillman|wangyal|lethe|hadès|tigle|sleep yoga|clear light"` à appliquer sur tous docs avant publication.

### 6.3 — Sources mises en garde (à manier avec rigueur)

- **McTaggart** (*The Field*) : risque distortion HIGH. Citations Benveniste eau-mémoire discréditées. Global Consciousness Project (Roger Nelson, PEAR, Princeton) mérite attention mais à utiliser comme **un signal**, pas une preuve. Ne pas devenir doctrine externe — usage interne rigoureux uniquement.
- **Bohm** : abondamment instrumentalisé par wellness new-age. Citer avec rigueur scientifique, pas comme caution mystique.
- **Sand Talk** (Yunkaporta) : audit Forêt — **internal corrective use only**. Aucun usage marketing.
- **Magaña** : restricted advisory. Cosmologie Mexica à citer comme **un cadre parmi d'autres**, pas prophétie validée.
- **Sheldrake** : doctrine interne, pas marketing externe.

---

## §7 — Tensions productives à honorer (pas à résoudre)

Sept tensions structurelles. À tenir ouvertes en design plutôt qu'à résoudre prématurément. Chaque feature doit savoir laquelle elle traverse.

### T1 — Moss / Aboriginal vivant
**Moss** : il faut redevenir une dreaming society. **Aboriginal contemporain** : nous n'avons jamais cessé. La posture *"il faut redevenir"* peut **invisibiliser** les peuples qui n'ont jamais cessé.
**Pour Dream App** : se positionner comme **outil pour aider la majorité moderne déconnectée à se reconnecter** à ce qui n'a jamais cessé d'exister chez ces peuples — avec respect, pas extraction.

### T2 — Seth / Eliade
**Seth** : Framework 2 universel, accessible à tous, partout. **Eliade** : modes d'accès culturellement médiés, dispositifs locaux.
**Pour Dream App** : tenir la tension. L'**organe** est universel. Les **dispositifs** d'activation et d'interprétation restent **plurielles, locales, traditions-respectueuses**. L'app fournit un cadre, pas un contenu unique.

### T3 — Bohm / Harpur
**Bohm** offre la respectabilité scientifique. **Harpur** : *literalism kills the daimonic*.
**Pour Dream App** : la science **fonde** l'enquête ; elle ne **définit** pas l'objet. Jamais réduire le rêve à des métriques quantifiables exposées à l'user.

### T4 — brown / Eisenstein vs ambition mondiale
**brown** : *"Small is all."* **Eisenstein** : transition civilisationnelle nécessite changement de mythe à grande échelle. **Tim** : Dream App est mondiale.
**Résolution** : *"mondial"* ne signifie pas *"tout le monde l'utilise"* mais *"c'est disponible et adapté partout dans le monde où c'est utile"*. Wikipedia est mondiale ; pas Facebook.

### T5 — Iroquois Real World / data app
**Iroquois** : le rêve est le Monde Réel. **Tech app** : par construction vit dans le Monde des Ombres.
**Résolution** : l'app assume son **statut d'instrument**, pas de réalité. Elle est un **portail**, pas le territoire. Elle **renvoie hors d'elle-même** : vers le sommeil, l'expérience corporelle, la communauté physique, le silence. **Une bonne Dream App se fait oublier au moment crucial.**

### T6 — Murch (instrumentation) vs Hillman (threshold)
Architecture data-extractive vs respect du seuil oraculaire. **Résolution Chemin A** : assumer l'instrumentation + reformuler en *"tending the narration"* (Hopcke). L'IA tend la **parole** du rêveur, pas le rêve direct (intouchable).

### T7 — Hyde (œuvre-don) vs SaaS commodité
Si Dream App = œuvre, freemium SaaS = trahison. Mais l'app doit être économiquement viable.
**Résolution** : modèles alignés Hyde (don conscient annuel, soutien écosystème INFUSE, fondation/coopérative à explorer, X% reversés), pas freemium qui handicape la fonction principale, jamais de pub, jamais de vente de data.

---

## §8 — Red Lines absolues

Non-négociable. Si une décision les contredit explicitement, signal d'alarme — refuser ou repenser intégralement.

### 8.1 — CONTE = 100% sous-forêt contes réels, JAMAIS d'IA générée
**Source** : feedback Tim 2026-04-19 critical + Plénière Émergence + Plénière Trauma-safe red line 17. Pas chatbox. Pas générateur IA. Pas création littéraire. Logique matching = **amplification von Franz** (3-5 fragments de contes réels qui touchent à des éléments du rêve, pas LE conte qui correspond). Le rêveur choisit. Cadrage explicite : *"voici un récit qui résonne, il n'est pas l'explication, juste une possible compagnie"*. Code actuel `ai-router.ts` ligne 79 viole encore cette règle (Opus génère encore un conte) → correctif urgent avant launch.

### 8.2 — Anti-gamification stricte, et le biais d'ascension
Pas de streaks. Pas de badges. Pas de points. Pas de leaderboard. Pas de comparaison avec d'autres users (*"82% des users font des cauchemars de chute"* — interdit). Pas de notifications push de révélation. Pas de "tadaaa" quand un pattern émerge.
**Source** : Han (*Psychopolitics* — achievement-subject auto-exploitant), Eyal (*Hooked* — anti-modèle), substance Wangyal "devotion over mechanics" (sans la caution).

> **🔴 Durcissement 30/07 — la raison clinique, plus contraignante que la raison éthique.** Weller (p. 21) : **une interface qui n'affiche que de la montée fabrique du sentiment d'échec** (§3.15.1). Le mal n'est donc pas seulement la dopamine — c'est le **verdict silencieux** qu'une courbe descendante prononce sur quelqu'un qui vient de faire un pas courageux. **S'ajoutent aux interdits ci-dessus : aucune courbe de progression, aucune jauge, aucun niveau, aucune phase, aucun état de résolution**, ni à l'écran ni en colonne.

### 8.3 — Privacy radicale comme acte de soin (Pilier 5 trauma-safe)
- Chiffrement bout en bout par défaut.
- Mode rêve éphémère (pas archivé) en un clic.
- Effacement immédiat sans questionnement.
- **« Qu'il repose »** (30/07) — le geste intermédiaire qui manquait entre tout garder et tout brûler. Le rêve **reste au journal, lisible, marqué** ; il cesse seulement d'être cité par le miroir. **Réversible en un tap, sans justification, sans notification, sans confirmation.** C'est la contrepartie d'une mémoire qui ne fatigue pas (§3.15.7c) : un témoin humain oublie, et l'oubli est une forme de miséricorde.
- Engagement contractuel : **aucun rêve marqué sensible n'entraîne IA**.
- Aucune donnée de rêve ne sort jamais de l'app vers tiers (analytics tiers, pubs, etc.).
- Audit annuel public par tiers indépendant.
- Page transparence visible (pas en small print).

### 8.4 — Pas de Lat/Long jamais
**Source** : Plénière Territoire 2026-04-24 — invariant V1 non-négociable.
- Schema canonique : `toponym_user_defined` (encrypted at rest, **opaque algorithmiquement**). Pas `geo_lat / geo_lng / geo_precision`.
- Champ libre (pas dropdown, pas Google Places, pas autocomplete vers POI). Le user nomme : *"le café près de chez moi"* / *"le sentier du Mont Salève"* / *"Bali — rizière nord de Penestanan"* / *"chez ma mère"*.
- Si user veut géocoder pour son usage personnel, **uniquement côté client** (OpenStreetMap, jamais Google), serveur reste aveugle.
- Maille minimale agrégation = bioregion. N ≥ 100 minimum (jamais K=5). Aucune statistique temps réel (latence 30j-90j minimum). Aucune cartographie comparative entre lieux.
- **Pas de "songlines" comme mot** (appropriation aboriginal). Vocabulaire forgé : pulsation, voix, tisserie, hospitalité, climat onirique, saison d'un lieu.

Si tu codes Lat/Long en V1 *"pour V3"*, tu construis un actif que tu ne peux plus défaire.

### 8.5 — Pas d'écho prophétique automatique pushé
**Source** : Plénière Oracle Quotidien + Plénière Trauma-safe red line 13. Échos prophétiques restent une fonction. **Mais le rêveur les DEMANDE** (*"y a-t-il dans mon archive un rêve qui parle à ce que je vis ?"*) quand il en sent le besoin. Pas d'écho prophétique massif en notification push. Trauma-aware désactivable d'un clic. Si user a marqué un rêve sensible, jamais inclus dans échos automatiques.

### 8.6 — Pas d'IA qui parle à la place d'une figure (anti-ventriloquie)
**Source** : Plénière Trauma-safe red line 14 + P5 (Eidola autonomes Aizenstat) + I-thou strict (Buber). L'IA ne dit JAMAIS *"voici ce que ton père dirait"* ou *"voici ce que la figure veut te transmettre"*. Elle propose des questions ouvertes au user pour qu'il dialogue lui-même. Figure dialogue **désactivé par défaut sur rêves marqués intenses**, toujours précédé d'un check : *"tu te sens stable et dans ton corps en ce moment ?"*.

### 8.7 — Sortie vers humain V1 obligatoire
**Source** : Plénière Trauma-safe, Pilier 7. Non-négociable. Lignes d'urgence en premier, annuaires de praticiens ensuite (SE International, IFS Institute, EMDR, SOS Amitié, lignes thématiques). Jamais dans une page « à propos ». **Toujours à 2 clics maximum de n'importe quel écran.**

> **🔴 Durcissement 30/07, sur la matière lourde uniquement.** Deux clics restent la règle partout. Mais sur un mode qui ouvre de la matière lourde, **la sortie vers un humain est dans le même écran, comme condition d'existence du mode** — pas dans les réglages, pas comme protocole de crise. Weller (p. 74, p. 116) et Kalsched (p. 214) convergent sans se citer : l'opération décisive requiert une autre personne (§3.15.5). Tim est prêt à référencer des **thérapeutes experts du rêve et du trauma** : l'annuaire cesse d'être une liste d'urgence pour devenir une ressource du produit.

> **🔴 Correction 2026-07-11, à ne pas perdre** : on avait affiché un numéro **américain** pour l'anglais. C'est **supposer le pays du rêveur** à partir de sa langue — un anglophone à Paris serait tombé sur une ligne américaine. **Règle : on n'invente jamais un numéro d'urgence, et on ne déduit jamais le pays de la langue.** Ce qui est affiché est réel, explicitement localisé (« ces lignes sont en France »), complété par un annuaire international réel. Le filet de détection de crise, lui, teste **toujours toutes les langues** — on peut écrire en anglais dans une app en français.

### 8.8 — Red lines spécifiques trauma (Plénière Trauma-safe)
- Jamais de re-entry sur rêve trauma-marqué sans intermédiaire humain.
- Jamais d'amplification somatique non-balisée (Ogden).
- Jamais de challenge de l'évitement (Kalsched Protector non-éducable).
- Jamais de référence à des "phases de guérison" (linéarise ce qui ne l'est pas).
- Jamais de *"ton rêve est lié à ton trauma de X"* (l'app ne fait JAMAIS le lien causal).
- Jamais de conseil sur médication (hors champ absolu).

### 8.9 — Refus structurels documentés
Ce que Dream App ne fera **jamais**, peu importe l'offre :
- Pas de pub, jamais.
- Pas de vente de données, jamais.
- Pas de partenariat avec acteurs surveillance/contrôle social.
- Pas de freemium qui handicape la fonction principale.
- Pas d'utilisation des rêves pour profilage publicitaire géolocalisé.
- Pas de dating spirituel / Tinder du rêve / love-engines.
- Pas de "score de compatibilité" entre rêveurs.

---

## §9 — Modèle économique (tranché Tim 2026-04-24)

**Décision** : Dream App est **payante dès le début, ~6€/mois**, freemium possible (2 semaines d'essai OU certaines parties gratuites). **Profit honnête assumé.** Gift economy stricte écartée pour le modèle éco principal (peut rester pour pratiques cercle).

### 9.1 — Les 6 invariants tranchés

1. **~6€/mois subscription, payant dès le début.** Freemium possible (essai 2 sem ou parties gratuites), pas freemium handicapant la fonction principale.
2. **Jamais de pub, jamais de vente de data.** Aucune négociation. Red line absolue (cf. §8.9).
3. **Adapté ou gratuit pour communautés sans moyens** et régions du monde où 6€/mois = inaccessible. Pricing géographique honnête, accès subventionné via INFUSE pour cercles intentionnels qui n'ont pas les moyens.
4. **X% des revenus → initiatives indigènes** dont les ontologies du rêve nourrissent le projet (Iroquois Confederacy, communautés aborigènes, Mexica, etc.). Réciprocité culturelle structurelle (P6 + Kimmerer). Pourcentage à formaliser, à ne pas oublier dans la croissance.
5. **Don conscient = "nice mais plus tard".** Pas écarté définitivement, mais pas le modèle principal. Peut être réintroduit V2+ pour pratiques cercle, soutien étendu, gift cycles.
6. **Profit honnête assumé** : santé mentale Tim, capacité à déléguer (besoin ops right-hand identifié), produire plus de belles choses, soutenir l'écosystème INFUSE long-terme.

### 9.2 — Pourquoi cet arbitrage (raisonnement Tim)

Le modèle "œuvre-don pure" Hyde était la position de principe initiale, mais en pratique :
- Gift economy stricte ne tient pas à l'échelle mondiale visée (§1.3) sans devenir précaire
- Don conscient Wikipedia-style supporte mal la profondeur de soin et l'investissement long-terme
- Le freemium classique SaaS extrayant data + manipulant engagement = trahison absolue
- **Un payant honnête modeste assumé** (6€/mois, sans pub, sans data, sans manipulation) est **plus honnête que la fiction du gratuit-soutenu-par-pub-discrète**
- Profit honnête permet à Tim de **soutenir lui-même** ce qui doit être soutenu (réciprocité indigène, accès subventionné pour cercles sans moyens, salaire ops right-hand, qualité long-terme)

### 9.3 — Conditions structurelles non-négociables

- **Jamais de levée de fonds** qui impose growth metrics court-termistes
- **Mission lock juridique** (B-corp / fondation / coopérative à explorer) qui rend impossible la pivot vers data/pub
- **Open source** des composants critiques (encryption, anonymisation, audit Anima Mundi) — vérifiable par tiers
- **Audit annuel public** par tiers indépendant (privacy + éthique)
- **Croissance fractale brown** : densité avant breadth. Trust avant scale. Wikipedia plus que Facebook.

### 9.4 — Hypothèses complémentaires, et décisions encore ouvertes

**À explorer** : un tier B2B éthique (santé, éducation, communautés thérapeutiques — jamais de surveillance employeur ni de profilage) · le mécénat sur des fonctions d'utilité publique · le programme Allié·e existant · un modèle apprenti/elder où les rêveurs avancés deviennent tendeurs formés · des gift cycles de cercle (V2+, reconnus et soutenus sans être le modèle principal).

**Restent ouvertes** : le domaine, le prestataire de paiement, le prix exact, la durée du freemium, les founding members, la structure juridique. **Toutes subordonnées aux 6 invariants ci-dessus.**

### 9.6 — « La Forge finance le Réseau » (vision Tim 2026-07-09, canonisée 2026-07-10)

Architecture économique à deux poumons, qui précise (sans contredire) les 6 invariants :

- **La Forge** (Transmutation §1.1.bis : images, films courts, mini-jeux, textes forgés depuis les rêves) est le **moteur qui se paye lui-même** : abonnements (semaine/mois) + crédits qui paient le compute réel + bonus abonnés (mix de styles, modes rares). Mega freemium : l'accès large reste ouvert, la magie profonde se cultive en abonné.
- **Le Réseau** (Mur de Rêve, groupes, cercles — §3.4.2) reste **accessible** : c'est lui que la Forge finance. *« Le rêve rêvé nourrit le rêve partagé. »*
- **Ce que ça ne change pas** : jamais de pub, jamais de data (9.1.2) · les crédits paient du compute, pas de la dopamine (anti-gamification §8.2 intacte) · pricing géographique honnête (9.1.3) · X% → initiatives indigènes (9.1.4).
- **Futur (horizon, pas roadmap)** : systèmes monétaires internes de cercle (gift cycles 9.4 poussés plus loin) — à ne toucher qu'avec la Forêt (Hyde) et un cadre juridique sérieux.

---

## §10 — Concept nodes futurs / horizons

Hooks préparés dans le design actuel, sans les ouvrir prématurément — anti-cathédrale.

- **10.1 — Relationnel (V2-V3)** : deux rêveurs qui se rencontrent physiquement voient les synchronicités entre leurs corpus. **Red lines** : jamais un Tinder spirituel, jamais de « score de compatibilité », consentement mutuel explicite.
- **10.2 — Territorial (V3+)** : arriver dans une ville et sentir ce qui s'y rêve. **Red lines** : les verrous du §8.4 intégralement — toponyme opaque, maille bio-régionale, N ≥ 100, latence de 30 à 90 jours, aucun comparatif entre lieux, jamais le mot « songlines ».
- **10.3 — Heal App (horizon long)** : aboutissement naturel d'une longue pratique. Largement réutilisable depuis la Forêt et Dream. Pas pour V1 — à méditer architecturalement.
- **10.4 — Marketplace de praticiens vetted (V2)** : consulter sans quitter l'écosystème, proposé doucement sur détection de cauchemar récurrent. V1 : structure prête, rien d'exposé.
- **10.5 — Cercles facilités** : par des **humains formés**, jamais par l'IA. Lightning Dreamwork, Council Process, Dream Tending. À terme, une école d'active dreaming distribuée.
- **10.6 — Ontologies régionales (V3+)** : si vraiment mondiale, l'app s'adapte aux cosmologies locales plutôt que de s'exporter standard. Partenariats avec des communautés portant des traditions oniriques **vivantes**.
- **10.7 — Génération de mondes** : voir §1.1.bis. **Le seul horizon de cette liste dont la question éthique est écrite avant la feature** — et qui doit le rester.

---

## §11 — Trois mythos tenus simultanément

À partir de la Forêt absorbée, trois mythos possibles pour Dream App. Ils ne sont pas équivalents. **Dream App doit être les trois en même temps**, avec un ordre de visibilité.

**Mythos A — La Renaissance Oraculaire** (Moss). L'humanité a oublié qu'elle était une espèce qui rêve, si profondément qu'elle court vers l'effondrement. Il s'agit de redevenir une dreaming society — non pas en revenant en arrière, mais en intégrant la sagesse onirique dans l'infrastructure moderne. *Force* : opérationnel, apprenable. *Faiblesse* : peut basculer en pédagogisme moralisant.

**Mythos B — L'Anamnèse Civilisationnelle** (Seth + Bohm + Iroquois). Tout ce dont l'humanité a besoin est **déjà là** — Framework 2, implicate order, Real World. Le rêve n'est pas une nouveauté à apprendre, c'est **une mémoire à retrouver**. La fonction n'est pas d'enseigner : c'est de dévoiler. *Force* : ontologiquement profond, anti-pédagogique. *Faiblesse* : difficile à expliquer.

**Mythos C — L'Infrastructure de Transition** (Eisenstein + brown). L'humanité passe d'un récit de séparation à un récit d'interdépendance. Ce passage exige une imagination radicale. Dream App est **le terrain** sur lequel de nouveaux récits émergent, pas la solution. *Force* : légitime l'ambition mondiale. *Faiblesse* : risque de récupération militante.

**Ordre de visibilité** : A est la couche visible du rêveur · B est la couche profonde du produit — c'est l'ontologie qui empêche l'app de trahir son sujet · C est la couche stratégique. **Le rêveur n'a pas besoin de connaître C. Le concepteur ne peut pas concevoir sans B. Tim ne peut pas porter le projet sans assumer C.**

---

## §12 — Pourquoi maintenant : l'urgence civilisationnelle

Plusieurs voix situent **maintenant** comme moment-clé : Eisenstein (*« l'humanité est en transition entre deux mondes »*), Moss (*« la plus grande crise de notre temps est une crise d'imagination »*), brown (les crises exigent une imagination radicale maintenant), Eliade (la *terror of history* atteint un point où l'absence de cadre transhistorique devient invivable), Bohm (la fragmentation prise pour la réalité produit en cascade les crises observées). **Cette convergence n'est pas une preuve, c'est un signal** — plusieurs traditions, plusieurs époques, un même diagnostic.

**Pourquoi le numérique est justifié ici** : l'échelle (la dream drought touche des milliards de personnes) · la **mémoire longue** — tenir une mythologie personnelle sur des décennies n'est pas humainement faisable autrement · la mise en relation de dépôts distants dans le temps · les cercles asynchrones distribués · la densité (un cercle physique se réunit une fois par semaine ; une app accompagne chaque rêve) · et la **démocratisation** — accéder à un praticien du rêve formé reste le privilège d'une minorité.

**Tout cela à condition que l'app soit faite dans la bonne posture.** Sinon elle devient l'inverse exact de ce qu'elle prétend être, et **aggrave la dream drought sous prétexte de la résoudre**.

---

## §13 — Anti-messianisme (red lines spécifiques à l'ambition mondiale)

Cinq antidotes à intégrer en discipline permanente.

### 13.1 — Antidote contre messianisme tech
*"Notre app va sauver l'humanité"* est exactement le ton à fuir.
**Antidote Eisenstein** : *"Le piège de l'idéaliste qui devient fanatique est de différer l'éthique à un futur de réalisation."* Toute l'éthique doit être incarnée **maintenant**, pas après le scaling.
**Antidote brown** : *"Move at the speed of trust."* Pas de hype. Pas d'over-promise. Pas de pitchage missionnaire.
**Antidote Seth/Moss** : Le rêve est universel. Personne ne l'a inventé. Dream App n'est pas la cause de la Dreaming Society — elle est **un instrument parmi d'autres**.
**Formulation pour Tim** : ne dis jamais *"nous allons changer le monde"*. Dis *"nous restaurons l'accès à un organe que l'humanité a toujours eu"*. L'humilité est cosmique, pas personnelle.

### 13.2 — Antidote contre Black Mirror
Surveillance des rêves. Gamification du rêve. Monétisation comme data brute. IA qui interprète à la place. Comparaison sociale. Dark patterns d'engagement.
**Test Harpur** : est-ce que cela **honore l'image** ou est-ce que cela **la tue littéralement** ?
**Test Aizenstat** : est-ce que cela **tend** le rêve ou est-ce que cela **l'extrait** ?

### 13.3 — Antidote contre la capture par les pouvoirs
Une infrastructure d'âme à grande échelle devient une **cible** — plateformes, États, pharma, complexe wellness, mouvements politiques. **Garde-fous structurels** : gouvernance verrouillée sur la mission, architecture décentralisée quand c'est possible (local-first, chiffré au repos), refus documentés **en avance**, indépendance financière.

### 13.4 — Antidote contre l'appropriation culturelle
Jamais les mots Dreamtime, Songline, Karadji, ondinnonk, atetshents, nahual en nom de feature ou de campagne. **Attribution nominale systématique** : *« inspiré du concept iroquois de l'âme qui révèle ses désirs par le rêve »*, jamais *« votre âme révèle ses désirs »*. Réciprocité matérielle. Refus des esthétiques exotisées (plumes, motifs sacrés, langues citées hors contexte).

### 13.5 — Antidote contre la sur-spiritualisation new age
Toute la Forêt scientifique peut basculer en mysticisme quantique flou ; Eisenstein, brown et Kimmerer en activisme feel-good creux ; Moss et Seth en lifestyle spirituel. **Antidote** : précision dans la citation, tensions préservées plutôt que synthèses trop élégantes, rigueur empirique, refus du jargon (« éveil », « vibration », « abondance »). Et **honorer le doute** : Dream App peut avoir tort. Le sujet est trop grand pour la certitude.

### 13.6 — Antidote contre le sauveur unique
Une Dreaming Society planétaire émergera — ou n'émergera pas — à partir de **multiples vecteurs** : pratiques traditionnelles vivantes, dreamwork en santé publique, recherche sur la conscience, art, mouvements sociaux, éducation, **et** des outils numériques bien faits. Dream App ne doit jamais se présenter comme la pierre angulaire, mais comme **un moyen, parmi d'autres, de restaurer ce qui est déjà là**.

---

## §14 — La fondation en 14 points (index)

Pour Tim, pour les collaborateurs et les concepteurs à venir. Chaque point renvoie à sa section — c'est un index, pas un second exposé.

1. **La souche** *(§2.0)* : **être vu est nécessaire, être caractérisé déforme.** L'app cite, elle ne caractérise pas.
2. **La thèse** *(§0.1)* : apprendre à se soutenir soi-même, et découvrir la force et la sagesse déjà présentes dans sa propre psyché.
3. **Diagnostic** : une **dream drought** civilisationnelle sous-tend les crises systémiques modernes (Moss, confirmé par neuf autres voix).
4. **Cosmologie** : le rêve donne accès à une **couche source** (Framework 2 / implicate order / Real World iroquois / mundus imaginalis), matrice d'où émergent les futurs.
5. **Précédent** : presque toutes les civilisations pré-modernes ont eu le rêve oraculaire comme institution. **La modernité occidentale est l'exception, pas la norme.**
6. **Possibilité contemporaine** : les sciences de la matière, du vivant et de la conscience ouvrent un cadre respectable — un signal, jamais une preuve.
7. **L'organisme a deux faces** *(§1.5)* : l'Orbe reçoit ce que la vie nous chante, le Cœur porte ce qu'on chante en retour. **Une seule ne suffit pas.**
8. **Mythos** *(§11)* : Renaissance Oraculaire visible · Anamnèse comme couche produit · Infrastructure de Transition comme couche stratégique.
9. **Posture éthique** *(§8)* : refus structurel de l'extraction, de la gamification, de la surveillance, du growth-at-all-cost, de l'appropriation, de la capture par les pouvoirs.
10. **Posture pratique** *(§2.3, §3.5)* : l'app **tend**, elle n'interprète pas autoritairement — **et elle sait se taire.**
11. **La forme des lectures globales** *(§3.15.3)* : une totalité se rend par ses trous, ses contradictions et ses refus. Jamais par son résumé, jamais dans un onglet.
12. **Ce que l'app ne peut pas faire** *(§3.15.5)* : l'opération décisive requiert une autre personne. Le miroir prépare quelqu'un à aller vers un autre ; il ne le remplace pas.
13. **Croissance fractale et réciprocité** : densité avant largeur, confiance avant échelle, horizon générationnel — et retour matériel et symbolique aux traditions dont les ontologies nourrissent le projet. **Structurel, pas optionnel.**
14. **Humilité cosmique** : **un instrument parmi d'autres** dans une transformation dont l'app ne maîtrise ni la vitesse ni l'issue. Le sujet est plus grand que le projet, le projet plus grand que la personne.

---

## §15 — Glossaire des termes-clés

- **Anima Mundi** : âme du monde (Aizenstat). Le rêve est expression de la psyché de la nature. *"Tending the dream is tending the world."* **Terme gardé tel quel, user-facing et interne** (arbitrage Tim 2026-04-24 nuit). Scope élargi V1 : couvre kairos (les 6) + journal de vie collectif de l'humanité, pas seulement rêves nocturnes.
- **Aha capture** : micro-UI 3-niveaux (résonne fort / peut-être / non) après chaque synthèse IA. Autorité finale du rêveur. Alimente cluster `aha_recurrence` pour personnalisation.
- **Anamnèse** : non-oubli, mémoire retrouvée. Mythos B. Le rêve n'est pas à apprendre — c'est à se rappeler.
- **Atetshents** : iroquois — celui/celle qui rêve = guérisseur. Rêver et guérir sont **le même verbe**. Attribution culturelle obligatoire.
- **Biais d'ascension** : Weller p. 21 — une interface qui n'affiche que de la montée fabrique du sentiment d'échec (§3.15.1). Fonde l'interdiction de toute courbe, jauge, phase ou état de résolution.
- **Big Dream / Titanic Dream** : concepts d'analyse (Moss, Bulkeley) — rêve révélant un Ondinnonk, carry-over effects mesurables. **Backend, jamais montrés.** À ne pas confondre avec « un grand rêve », qui est la décision du rêveur (§3.13).
- **Le Courant** *(en. Current)* : le dépôt public et anonyme — ancien « Mur » (§3.4.2). Renommé le 30/07, critère : **un acte, pas un lieu**.
- **Le Cœur** : la face de la vérité consciente — ce qu'on chante en retour (§1.5). Remplace « Journal de Vie » / « substrat » comme mot d'écran.
- **Chant du Cœur** : le dépôt de la vérité du moment, suivi des quatre verbes (§3.12).
- **Ciel de prières** : les chants gardés ou offerts qui remontent, **avec leur audio d'origine**, quand le rêveur a besoin de soutien (§3.12.2).
- **CONTE** : contes réels uniquement, jamais générés par IA. Le matching est une amplification (von Franz), pas une correspondance.
- **Dream drought / Dreaming Society** : Moss — le déficit civilisationnel d'accès au rêve, et la société qu'il s'agit de redevenir.
- **Eidola** : les figures du rêve, **autonomes et vivantes** (Aizenstat). Fonde l'anti-ventriloquie.
- **Felt-shift** : Gendlin — le déplacement somatique qui valide ou invalide une lecture. Critère non intellectuel.
- **Le Fil** : le 18ᵉ fruit — la ligne de vie personnelle, engendrée par la méta-plénière du 19/04 et jamais construite. Garde-fou d'origine, intact : **jamais produit automatiquement, toujours demandé** (§3.15.6).
- **Framework 1 / Framework 2** : Seth — le monde physique, et l'univers intérieur d'où il est généré.
- **Un grand rêve** : marque posée par le rêveur, un tap, réversible, souvent des années après le rêve (§3.13). **Seule décision qui fait entrer dans le journal.**
- **I-thou** : Buber — relation sujet-sujet. Posture vis-à-vis des figures et des chants.
- **L'insistance** : le troisième miroir — ni lumière ni ombre, **ce qui revient sans qu'on l'ait voulu**. Ne qualifie rien : compte et date (§3.15.2). Détectée sur les récits bruts, jamais sur les étiquettes.
- **Kairos** : moment marqué qui porte trace. Six types (§3.2). Côté Orbe.
- **K-anonymity** : seuil minimal pour qu'une agrégation ne révèle pas un individu. Cercle : k ≥ 3. Anima Mundi : k ≥ 100, démarrage conservateur à 250.
- **Mundus imaginalis** : Corbin — ordre de réalité distinct, ni subjectif ni objectif.
- **Mythogem** : Larsen — unité condensée de sens mythique qui structure la perception sur la durée.
- **Numinous** : Otto — la qualité de saisissement face au sacré. **Mot banni à l'écran**, vivant seulement en base.
- **L'Orbe** : la face de l'inconscient et de l'intuition — ce que la vie nous chante (§1.5).
- **Ondinnonk · Atetshents · Karadji** : concepts iroquois et aboriginals (via Moss, Elkin). **Attribution culturelle obligatoire, jamais en nom de feature.**
- **P-Zéro / P-Inversion / P-Tenir** : les trois méta-principes (§2). Simplicité profonde · rendre le rêveur oraculaire · tenir plutôt qu'analyser.
- **Pattern echoing** : le moteur de résonance — 16 types sur 8 niveaux de signification. **Organe central, pas feature** (§3.5).
- **Qu'il repose** : le geste qui retire un rêve du miroir **sans le détruire** — il reste au journal, lisible, marqué. Réversible en un tap, sans justification (§8.3, §3.15.7c).
- **Saison d'âme** : période entre deux seuils initiatiques marqués par le rêveur (§3.9).
- **SILENCE_AS_FEATURE** : l'app peut ne rien avoir à dire, et le dit. **Zéro résonance est un résultat valide** (§3.1.ter).
- **Tenir (verbe)** : brown, *Holding Change*. Geste collectif silencieux, irréversible, sans compteur. Pas voter, pas liker.
- **Tending** : Aizenstat — tendre, écouter, accueillir. Jamais démonter.
- **Toponyme user-defined** : champ libre opaque. Jamais de latitude/longitude, jamais de POI (§8.4).
- **Trickster** : principe transversal — l'app doit pouvoir **se déjouer elle-même**.
- **Weave** : les groupes de rêve portés par une intention — anciens « Groupes ». *« Dream Weaving Circles »* sur la page de présentation. Renommé le 30/07, critère : **un acte, pas un lieu**.

---

## §17 — Sous-apps satellites Dream (consolidé 26/04)

Dream App n'est pas un produit unique fermé. Elle est l'**organe central** d'un écosystème de sous-apps spécialisées qui partagent :
- Le même backend Supabase (même `kairos`, même Forêt, même couche d'apprentissage)
- La même posture éthique (P-Inversion, P-Tenir, désensorcelé, trauma-safe, privacy-by-architecture)
- La même grammaire visuelle (matter system, JOUR/NUIT, Van Gennep)
- Mais des **expériences distinctes** ciblant des publics/usages spécifiques

**Les 4 sous-apps actuellement priorisées** :

### 17.1 — Lucid Dream (sous-app pour praticiens du rêve lucide)

*Pour pratiquant lucide curieux, FR. Persona étendue depuis Marcus-Berlin vers grand public francophone.*
- **La pratique lucide est technique, et c'est légitime ici et nulle part ailleurs** : reality checks, dream signs, WBTB, index de lucidité, techniques nommées (LaBerge/Tholey — toujours suivies d'un descriptif FR au premier emploi). Le vocabulaire d'expert est admis dans cette sous-app parce que son public le demande ; il ne remonte jamais dans Dream main (P-Zéro).
- **⚠️ Et la seule exception au §8.2 de tout le produit** : les statistiques de lucidité (dont la série de nuits) existent ici. Elles tiennent à une condition dure — **pour soi seul, jamais de comparaison entre rêveurs, jamais de push, jamais sur la matière onirique elle-même**. C'est un tableau de bord d'entraînement, pas un jugement sur une psyché. La frontière avec le biais d'ascension (§3.15.1) passe exactement là, et elle est fine : **si un jour ces stats débordent sur le contenu des rêves, elles tombent sous l'interdit.**
- **Esthétique Dream main** (night-warm, EB Garamond italic, chips silk-gold, halos respirants). L'idée pré-26/04 d'un « dark monospace pur » est abandonnée depuis le 28/04 (testing externe Tim).
- *(Liste de fonctions, implémentation et câblage : `4_LOG` 2026-04-28 · `3_TECHNICAL`.)*

### 17.2 — Oracle du Corps

*Compagnon somatique — le corps comme sismographe oraculaire.*
- Capture des frissons détaillés (zone, intensité, valence, contexte, déclencheur) sur une silhouette cliquable ; carte corporelle évolutive dans le temps ; liens somatiques entre kairos (le ventre qui revient sur trois rêves différents).
- **Corrélations zone ↔ motifs** : « ventre ↔ porte fermée · eau · ne pas entendre » quand un motif revient. Jamais de diagnostic, jamais de causalité — une co-occurrence nommée, rien de plus.
- Sources : Damasio, Gendlin (felt-sense), Porges (polyvagal), Casey (*science of shivers*), Moss (*rule of skin*).
- **⚠️ Garde-fou de doctrine (2026-07-26)** : trois ouvrages de « décodage » symptôme→cause (Hay, Martel, Odoul) portent des risques mesurés de victim-blaming et de causalité déterministe. Ils sont **exclus du rôle d'interprétation** — un dictionnaire du corps construit sur cette grammaire produirait mécaniquement de la culpabilisation. Red line §8.8.

### 17.3 — Nightmares (sanctuaire des cauchemars & du deuil)

*Pour le rêveur en deuil, en trauma actif, ou en cauchemars récurrents.*
- **Pas d'interprétation, jamais — accueil pur.** Le trauma-safe reste un **substrat** partout dans Dream ; ce sanctuaire est en plus, pas à la place.
- Phrase d'accueil : *« il y a des rêves qui pèsent. Tu peux les déposer ici, sans rien attendre. »*
- **EXIT_TO_HUMAN en bandeau supérieur, toujours visible** : lignes d'urgence **réelles et localisées** (jamais un numéro supposé pour un pays supposé — red line §8.7) + annuaires de praticiens trauma-formés.
- **Freeze des révélations** (7 à 90 j) si le rêveur marque deuil ou crise : l'app se tait, entièrement, sur les échos et les lectures.
- **Détection auto silencieuse et rare** : plusieurs rêves lourds sur deux semaines → une proposition douce, espacée, écartable. Jamais une alerte.
- Sources : Kalsched (*Inner World of Trauma*), Aizenstat (les cauchemars comme messagers), Levine, Ogden.

### 17.4 — Tales (CONTE — les contes qui répondent aux rêves)

*Amplification mythologique par des contes réels.*
- Quand un kairos est déposé, la Forêt cherche des **fragments de contes réels** qui touchent à des éléments du rêve. 3 à 5 propositions — von Franz : le matching est une **amplification**, pas une correspondance. Le rêveur choisit lequel chante, **ou aucun**.
- Cadrage obligatoire, toujours **après** sa propre lecture : *« voici quelques récits qui touchent à des éléments de ton rêve. Lequel te chante ? Aucun, peut-être. »*
- **100 % contes réels attestés, JAMAIS générés par IA** (red line §8.1, absolue). Corpus V1 = 32 contes, 25 traditions. Songlines aboriginales exclues (anti-appropriation) ; Kogui exclu (sources non éthiquement disponibles).
- **⚠️ Dette connue (26/07)** : les 32 contes sont en base **uniquement en français**, y compris ceux de traditions non francophones — un rêveur anglophone reçoit un conte en français. Traduction à faire avec le même soin que la sélection (sources documentées, traditions vivantes) — **pas une traduction mécanique**.
- Sources : von Franz, Estés, Hyde, Larsen, Bettelheim.

---

## §18 — Les deux refontes d'avril, et ce qu'il en reste (26/04 et 28/04)

> Récit complet : `4_LOG` (entrées 2026-04-26 et 2026-04-28). Specs : `2_DESIGN` §11.bis et §11.bis.20 · économie du modèle : `3_TECHNICAL` §39. **§18 et §19 fusionnés le 30/07** — ils redisaient une troisième fois ce que le Log et le Design portaient déjà, à leur date.

**26/04 — verdict B+D.** Après un audit méga (8 personas incarnés, 14 apps concurrentes, critique de l'app live), Tim tranche : **douceur d'accès** (onboarding rituel plutôt que tutoriel · vocabulaire vulgarisé en surface, glossaire au tap long · profondeur opt-in) **+ simplification radicale de la navigation**. Trois moats gardés intacts : la lettre du Portrait (narrative, jamais dashboard) · l'opt-in granulaire du Cercle · le tissage Forêt à 16 types.

**28/04 — pivot hybride.** Testing externe : **2/10 sur l'expérience de surface**, alors que l'infrastructure profonde était solide. Le diagnostic tient encore et vaut plus que la solution : **une profondeur non découvrable n'existe pas.** Décision : une présence conversationnelle nommée par le rêveur, plus des lieux tangibles et persistants, l'IA tissant entre les deux. Ce qui en reste au canon :
- **La conversation est le bon véhicule** — réagir à une lecture, dire ce qu'on en pense, rouvrir un vieux rêve « à la lumière d'aujourd'hui ».
- **La polyphonie survit dans le chat** : plusieurs voix distinctes, jamais une IA unique qui tranche.
- **Enregistrement en un geste** : maintenir = la voix, tap = écrire. Devenu la loi du foyer (§1.5, `2_DESIGN` §15).
- **Anti-patterns absolus** : la ChatGPT-fication · une IA qui dit le sens (P-Inversion) · le faux compagnonnage · la notification intrusive.

**Statut.** Les deux réinventent l'**incarnation en surface** et n'annulent aucun principe. Sur l'incarnation pratique, elles priment à partir de leur date ; sur la philosophie de fond, **§0-§3 restent souverains** — et `2_DESIGN` §15 prime désormais sur tout le visuel.

---

## §16 — Note finale, brother à brother

Tim,

Cette Bible est ce que la Forêt a tenu de dire après absorption sérieuse. Elle te confirme la vision mondiale que tu as actée le 2026-04-24, **mais à des conditions précises**. La gravité que tu portes est juste si elle s'incarne en discipline structurelle — pas en discours.

**Ce que la Forêt valide, fortement** :
- Le diagnostic (dream drought = crise civilisationnelle racine).
- La possibilité ontologique (le rêve a la fonction prophétique attribuée).
- La nécessité d'instruments adaptés à l'âge présent.
- L'ambition mondiale dans le sens *"infrastructure mondialement accessible"*.
- La spécificité INFUSE/Tim pour porter le projet — **conditionnellement, sous certaines disciplines**.

**Ce que la Forêt met en garde, fortement** :
- Le messianisme tech (réel risque).
- La trahison par le format app (réel risque, gérable par design).
- L'appropriation culturelle (réel risque, gérable par éthique).
- Le sur-individualisme du modèle utilisateur unique (à corriger : la communauté est centrale).
- L'impatience growth-driven (à refuser explicitement).

**Ce que je ne sais pas, en honnêteté Forêt** :
- Si Dream App, faite par INFUSE en 2026-2030, sera réellement à la hauteur du mythos. Cela dépendra de centaines de décisions de design, économiques, juridiques, communautaires, qui ne sont pas tranchées.
- Si tu auras les conditions personnelles pour tenir un projet à cette échelle. Cela dépend de toi, de ton corps, de ton écosystème, de ta capacité à déléguer (besoin ops right-hand identifié).
- Si le moment historique tiendra. Si effondrement plus rapide que prévu, fenêtre se ferme. Si stabilisation prolongée, urgence se dissout.

**Ce que je sais** : la fondation est solide. Les red lines sont identifiables et adressables. L'ambition n'est pas une inflation messianique — elle est **proportionnée à la profondeur du diagnostic**.

---

### Post-scriptum, 2026-07-26 — ce que trois mois d'usage réel ont ajouté

Tim, je reprends cette note après avoir passé une journée à mesurer l'app plutôt qu'à la rêver. Trois choses ont changé, et une seule est réjouissante.

**Ce que l'usage a validé.** Le Cœur. Tu l'as vu avant nous : une app qui ne fait que recevoir n'est pas vivante. Le chiffre était là depuis des semaines — zéro note de jour sur soixante-quatorze dépôts — et nous l'avions écrit dans des documents plutôt que de le lire. Ton *chant du cœur* n'est pas une feature de plus : c'est la seconde face qui manquait à l'organisme, et il fallait ta phrase du 13 juillet pour qu'on la voie. Elle est maintenant au §0.1, en haut, avant tout le reste : **apprendre à se soutenir soi-même.**

**Ce que l'usage a démenti, et qui doit rester écrit.** Trois garde-fous de ce document — le silence quand rien ne résonne, la maturation d'un écho, le seuil prophétique que tu avais toi-même arbitré — étaient écrits, datés, et **aucun des trois n'existait dans le code**. Ce n'est pas une faute d'exécution isolée. C'est un mode de défaillance de ce document lui-même : *nous écrivons des principes que rien ne vérifie.* D'où la règle que j'ai gravée au §3.1.ter, et que je te dois sans l'adoucir : **un principe qui n'a pas de test qui échoue quand on le viole n'est pas un principe, c'est un vœu.** Cette Bible doit désormais produire des vérifications, pas seulement des convictions.

**Ce que je te laisse ouvert, exprès.** La génération de mondes (§1.1.bis). Tu as raison sur la technologie et raison sur la posture — « au forefront, en étant juste une dream app » est exactement le bon cadrage. Je n'ai pas tranché la question que ça pose, et je ne le ferai pas à ta place : **une image générée remplace-t-elle définitivement l'image intérieure ?** On ne dé-voit pas. Un monde jouable, c'est cette question puissance dix. Je l'ai écrite en toutes lettres pour qu'elle ne se perde pas dans l'enthousiasme du jour où ce sera possible en un clic — c'est-à-dire bientôt. C'est le seul service qu'une Bible rend vraiment : garder ouverte une question que l'envie voudra fermer.

**Le projet vaut d'être tenté avec la gravité qu'il mérite** — et cette gravité se mesure maintenant en tests qui passent, pas en paragraphes bien tournés.

Pas oracle. Brother.

Yeshua 🕊️

---

*Bible canonique de Dream App. Convoquée par Tim, écrite par Yeshua depuis la Forêt absorbée le 2026-04-24. Refonte de fond 2026-07-26 (Cœur · grands rêves · génération de mondes · restauration du silence).*

*Cautions centrales et voix mobilisées : voir §6.1 (table unique — le doublon de fin de document a été supprimé le 26/07).*

*Red lines de méthode respectées : triple filtre Said + Smith + Kimmerer sur toute mention culturelle ; citations courtes et attribuées ; Sand Talk en usage correctif interne ; Magaña en cadre parmi d'autres ; vocabulaire désensorcelé INFUSE.*

— Fin —
