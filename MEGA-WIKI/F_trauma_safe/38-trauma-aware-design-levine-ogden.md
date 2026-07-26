---
title: "Trauma-aware design : ce que Levine et Ogden exigent de l'interface"
slug: "38-trauma-aware-design-levine-ogden"
category: "F"
words: 3050
sources_primaires:
  - Peter A. Levine, "In an Unspoken Voice: How the Body Releases Trauma and Restores Goodness", 2010
  - Pat Ogden / Kekuni Minton / Clare Pain, "Trauma and the Body: A Sensorimotor Approach to Psychotherapy", 2006
sources_secondaires:
  - Bessel van der Kolk (foreword + contribution, "Trauma and the Body")
  - Eugene Gendlin, "Focusing", 1978
  - Stephen Porges, théorie polyvagale (citée par Ogden)
  - Peter Levine, "Waking the Tiger", 1997
status: "draft"
seo_keywords:
  - trauma-aware design
  - trauma-informed UX
  - window of tolerance app
  - somatic experiencing design
  - titration UX
  - pendulation design
  - dream app trauma safe
infuse_concepts:
  - titration
  - pendulation
  - fenêtre de tolérance
  - bottom-up processing
  - ressource somatique
  - trauma-safe by default
---

# Trauma-aware design : ce que Levine et Ogden exigent de l'interface

## Ouverture

Sophie a 34 ans. Elle utilise Dream App depuis trois semaines. Une nuit, elle saisit un rêve qui met en scène sa mère — décédée deux ans plus tôt, dans des circonstances difficiles. Elle écrit. L'app reçoit, traite, propose une analyse symbolique immédiatement. Le texte généré est juste, dans un sens — il fait des liens archétypaux, nomme des figures du deuil. Mais Sophie pose son téléphone et ne revient pas sur l'app pendant neuf jours. Elle n'a pas de mot pour ce qui s'est passé, mais dans son corps, quelque chose s'est contracté.

Ce n'est pas un bug. C'est un problème de design.

Le rêve de Sophie a touché quelque chose qui n'était pas stabilisé. L'app n'avait aucun moyen de le savoir — et aucun moyen de ralentir. Elle a traité le rêve comme elle traiterait le souvenir d'un repas. Peter Levine écrit que "the body initiates the trauma response, and the mind follows; therefore, 'talking cures' that engage only the intellect or emotions often fail to reach the deep biological root of the injury." Une app qui analyse les contenus sans écouter le corps répète la même erreur que cinquante ans de thérapies exclusivement verbales.

Cet article pose une question concrète : qu'est-ce que Levine et Ogden exigent réellement d'une interface qui veut accueillir la vie onirique des humains ? Pas de compliance réglementaire. Pas de page "à propos" rassurante. Une exigence de structure — de câblage profond qui rend le trauma-aware non pas une option mais une architecture.

---

## La voix de la Forêt

### Levine — le trauma n'est pas dans l'événement, il est dans le gel

Peter Levine, dans *In an Unspoken Voice* (2010), pose une thèse qui renverse l'ordre habituel : le trauma n'est pas ce qui s'est passé. C'est ce qui reste coincé.

> "Trauma is not what happens to us, but what we hold inside in the absence of an empathetic witness." — Gabor Maté, préface à Levine, *In an Unspoken Voice*

La réponse traumatique est biologique avant d'être psychologique. Face à un danger mortel quand le combat et la fuite ont échoué, l'organisme active la **tonic immobility (TI)** — gel, dissociation, paralysie. Ce mécanisme est conservateur : il réduit la douleur (libération d'endorphines) et l'agitation. Chez les animaux, la TI se résout spontanément : tremblement, secouement, sortie du gel. Chez les humains, la sortie est souvent bloquée — par honte, par contexte social, par intervention médicale qui supprime les tremblements ("signes de choc à éliminer"). L'énergie de survie reste piégée.

> "Spontaneous trembling and shaking are core innate processes that 'reset' the nervous system and discharge immense survival energy." — Levine, *In an Unspoken Voice*

Ce qui en résulte n'est pas une maladie mentale. C'est une **blessure physiologique** : le système nerveux reste en posture de survie même quand le danger est passé. Les symptômes (hypervigilance, flashbacks, dissociation, évitement) sont des expressions de cette énergie non-déchargée, pas des signes de faiblesse psychologique.

La méthode de soin — **Somatic Experiencing** — repose sur deux principes qui s'importent directement en design :

**La titration.** On n'entre pas dans le matériel traumatique en entier. On en approche par toutes petites doses — "titrating (gradually accessing) physiological reactions to ensure the client is not overwhelmed or retraumatized." La titration chimique (ajouter goutte à goutte un acide dans une base pour ne pas déclencher une réaction explosive) est une métaphore exacte. En thérapie comme en UX, la dose fait le poison.

**La ressource avant l'activation.** On ne touche pas au matériel traumatique sans d'abord établir une ressource — un point de stabilité, un ancrage somatique, un lieu intérieur de sécurité relative. La ressource précède toujours l'exploration. Cet ordre n'est pas optionnel. C'est la condition de possibilité d'une exploration sûre.

Levine distingue aussi cinq réponses de survie — les "A et quatre F" : Arrest (vigilance), Flight (fuite), Fight (combat), Freeze (gel), Fold (effondrement). Chacune a une signature somatique propre. Ce qui est important pour le design : ces réponses s'activent **avant** la cognition. Un utilisateur peut entrer dans un état de Freeze ou de Flight en lisant une révélation symbolique sur son rêve — et ne pas savoir pourquoi il a envie de fermer l'app. Il ne le "décide" pas. Son système nerveux décide avant lui.

### Ogden — la fenêtre de tolérance comme critère structurel

Pat Ogden, dans *Trauma and the Body* (2006), formalise ce que Levine pose de manière clinique. Le concept central est la **fenêtre de tolérance** — introduit par Daniel Siegel, développé par Ogden comme outil de travail clinique :

> "The window of tolerance [is] the zone of arousal between hyperarousal (too much activation) and hypoarousal (too little) within which information can be processed, emotions experienced, narrative maintained, and cognition stay online." — Ogden, *Trauma and the Body*, ch. 2

À l'intérieur de la fenêtre : on pense, on ressent, on construit du sens. En dehors : soit **hyperarousal** (panique, images intrusives, système sympathique dominant — "too much"), soit **hypoarousal** (engourdissement, passivité, effondrement, dissociation — "not enough"). Dans les deux cas, l'intégration échoue. Le matériel exposé ne peut pas être traité — il ne fait que traverser ou écraser.

Les personnes traumatisées ont une fenêtre étroite. Les stimuli qui n'affecteraient pas une personne non-traumatisée suffisent à les faire basculer hors de la fenêtre. Ogden note un pattern crucial :

> "Many traumatized clients do not rest in one state; they swing between hyper- and hypoarousal, each triggered by different cues, without returning to the optimal zone." — Ogden, *Trauma and the Body*, ch. 2

Ce swing — trop présent / trop absent, trop intense / effondré — est précisément ce qu'une app peut déclencher si elle n'est pas conçue avec la fenêtre en tête.

Ogden distingue **traitement top-down et bottom-up** :

> "Bottom-up hijacking [occurs] when sensorimotor reactions override cognition; arousal exceeds the window; thinking goes offline." — Ogden, *Trauma and the Body*, ch. 1

Les approches top-down (cognition, narration, analyse symbolique) sont les seules que la plupart des apps déploient. Ogden est sans ambiguïté : elles ne suffisent pas. Le corps doit être adressé — pas après, pas en option, mais en premier.

> "Trauma lives in the body, not only in the mind. Traumatic experience is encoded at a subcortical, sensorimotor level — in posture, movement, breath, autonomic arousal, involuntary gestures." — Ogden, *Trauma and the Body*, Essence §1

Un troisième principe : la **pendulation**. L'alternance entre contact avec le matériel difficile et retour à la ressource. Pas un plongeon soutenu dans le contenu traumatique. Un aller-retour rythmique. La pendulation maintient le système dans la fenêtre en évitant l'accumulation d'activation.

### La théorie polyvagale — pourquoi une app ne peut pas remplacer un humain

Ogden s'appuie sur la théorie polyvagale de Stephen Porges. Le point essentiel pour le design : le système nerveux humain a trois niveaux hiérarchiques :

1. **Système d'engagement social (ventral vagal)** — le plus récent, corrèle avec la zone optimale, la coopération, la parole, les expressions faciales.
2. **Système sympathique (combat/fuite)** — corrèle avec l'hyperarousal.
3. **Système dorsal vagal (immobilisation)** — le plus primitif, corrèle avec l'hypoarousal, le gel, l'effondrement.

La propriété critique : le **système d'engagement social régule le système nerveux plus efficacement que toute technique intrapsychique**. Une présence humaine calme, une voix régulée, un regard sûr — c'est ce qui ramène quelqu'un hors de l'hyperarousal ou de l'effondrement. Ogden appelle cela "le thérapeute comme cortex auxiliaire" (expression de Diamond, développée par Schore).

Une app n'a pas de cortex. Elle ne peut pas faire ce qu'un humain régulé fait par sa seule présence. Mais elle peut ne pas aggraver. Et elle peut pointer vers l'humain au bon moment.

### Phase 1 — non-négociable

Le traitement en trois phases (Herman 1992, formalisé par Ogden) : (1) stabilisation et construction de ressources, (2) traitement des mémoires, (3) intégration. Ogden est catégorique :

> "Phase 1 is not optional prelude; it is where most chronic trauma work remains. Jumping to Phase 2 without stabilization re-traumatizes." — Ogden, *Trauma and the Body*, structure du livre

En termes d'app : la plupart des utilisateurs qui arrivent sur une app de rêve sont, à des degrés divers, en phase 1. L'app ne peut pas savoir où se trouve chaque utilisateur. La seule réponse architecturale cohérente : **concevoir comme si la phase 1 était le cas par défaut**, et laisser la profondeur se déverrouiller progressivement, par choix, à l'initiative de l'utilisateur.

---

## L'enjeu pour Dream App

Dream App accueille du matériel potentiellement très chargé. Les rêves ne sont pas anodins — ils peuvent porter des contenus traumatiques, des figures de deuil non-intégrés, des replays de violences passées. Un utilisateur ne le sait pas toujours avant de commencer à saisir. Le contenu émerge en écrivant.

Il y a un paradoxe structurel : l'app veut aller en profondeur (c'est sa proposition de valeur) et doit simultanément s'assurer que la profondeur n'écrase pas. Cette tension ne se résout pas en ajoutant un disclaimer. Elle se résout en câblant la titration, la pendulation et la fenêtre de tolérance dans l'architecture même de l'expérience.

Ce que l'app ne doit pas faire :
- Analyser immédiatement tout contenu marqué "intense" sans pause.
- Exposer une révélation symbolique forte sans signal somatique confirmant que l'utilisateur est dans sa fenêtre.
- Pousser des notifications de patterns quand l'utilisateur n'a pas initié la demande.
- Laisser l'utilisateur seul avec un matériel qui l'a fait sortir de sa fenêtre.

Ce que l'app doit être structurellement :
- Un espace qui **ralentit** avant de révéler.
- Un espace qui **offre la ressource avant** l'exploration profonde.
- Un espace qui **détecte les signaux de débordement** et propose des sorties, pas des analyses supplémentaires.
- Un espace qui **pointe vers l'humain** quand le contenu dépasse ce qu'une app peut tenir.

---

## Câblage actuel

En l'état (alpha), Dream App ne dispose d'aucun mécanisme trauma-aware structurel. La saisie d'un rêve entraîne directement son traitement symbolique. Il n'y a pas de détection de marqueurs de détresse dans le texte, pas de pause entre saisie et analyse, pas de question d'état corporel préalable à l'exploration profonde, pas de protocole de sortie vers humain à moins de 2 clics, pas de mode "pas ce soir" accessible depuis n'importe quel écran. Ces absences sont architecturales — elles exigent un câblage de fond, pas une feature additionnelle.

---

## Câblage à faire

**1. Pause de titration post-saisie (priorité 1).**
Après toute saisie de rêve, un écran de transition de 10-15 secondes avant l'analyse. Fond sombre, animation respiratoire discrète, pas de texte analytique immédiat. La pause n'est pas une friction — c'est une dose. Elle permet au système nerveux de décharger légèrement l'activation produite par l'écriture du contenu difficile avant d'exposer une interprétation. Référence : Levine — la sortie du gel passe par des micro-mouvements et un espace de non-urgence. Le contenu a été reçu. L'app peut attendre.

**2. Question d'état pré-exploration profonde (priorité 1).**
Avant d'afficher une synthèse profonde (figures récurrentes, échos prophétiques, arcs de vie), l'app pose une question simple : "Comment tu te sens en ce moment — dans ton corps ?" avec quatre options : "ancré·e / neutre / agité·e / absent·e / autre". Si l'utilisateur répond "agité·e" ou "absent·e" : "Tu veux qu'on y revienne plus tard ?" avec option "dans 2 heures" ou "demain matin". Si l'utilisateur choisit d'attendre, le contenu profond est mis en file d'attente, pas effacé. Référence Ogden : "Collaboration and internal locus of control — the client decides what to explore, how long to stay, when to stop."

**3. Marquage somatique des rêves (priorité 2).**
À chaque saisie, après le texte du rêve, un champ optionnel : "Ce rêve laisse une trace dans le corps ?" avec localisation (gorge, poitrine, ventre, nuque, aucune, autre). Sans intensité. Ce signal est stocké dans `dream_entries` et utilisé pour moduler la profondeur de l'analyse. Rêve avec marquage somatique fort + état "agité·e" → analyse proposée avec pause longue et question de retour. Référence Levine : "Bottom-up processing — addressing bodily sensations first — is essential for restorative work."

**4. Protocole EXIT_TO_HUMAN câblé (priorité absolue — cf. article 37).**
Disponible depuis tout écran, en 2 clics maximum : icône discrète permanente → page de ressources humaines (ligne d'écoute nationale, numéro d'urgence, annuaire de praticiens certifiés). L'app ne retient pas. L'app ne pose pas de question. L'app ne dit pas "tu veux en parler avec moi d'abord ?". La sortie est immédiate et non-commentée.

**5. Mode pendulation (priorité 3 — V2).**
Pour les utilisateurs qui veulent travailler activement un rêve difficile : mode guidé en 4 temps — (a) nomme une ressource somatique présente maintenant ; (b) entre en contact avec un élément du rêve difficile — 30 secondes ; (c) reviens à la ressource — 30 secondes ; (d) note ce qui a changé. Pas plus de 3 cycles. Proposé uniquement sur demande explicite de l'utilisateur. Référence : pendulation comme pratique centrale de la Somatic Experiencing.

**6. Détecteur de débordement (priorité 2).**
L'analyse NLP de la saisie peut être dirigée vers la détection de marqueurs de détresse aiguë (embeddings entraînés sur patterns de détresse, pas de liste préfabriquée). Si détection positive + état "agité·e" + heure tardive (après 23h) → l'app ne propose pas d'analyse. Elle propose : "Ce que tu viens d'écrire semble avoir du poids. Tu veux laisser ça reposer ce soir et y revenir demain, ou parler à quelqu'un maintenant ?" Pas de diagnostic. Pas d'interprétation. Pas de "tu sembles en détresse". Juste une invitation à ralentir ou à trouver une présence humaine.

---

## Test d'application

À 3 mois en alpha :
- Taux d'abandon de session après analyse profonde immédiate (sans pause) vs avec pause de titration. Cible : réduction de 30% des abandons sur rêves marqués "intense".
- Proportion d'utilisateurs qui utilisent volontairement la question d'état avant exploration profonde. Cible : 40% l'utilisent au moins une fois.
- Temps moyen de retour sur l'app après saisie d'un rêve difficile. Cible : délai de retour réduit — signe que l'app n'a pas expulsé l'utilisateur hors de sa fenêtre de tolérance.
- Nombre d'activations d'EXIT_TO_HUMAN. Cible : faible, mais existant.

---

## Citations clés

> "Trauma is not what happens to us, but what we hold inside in the absence of an empathetic witness." — Gabor Maté, préface à Levine, *In an Unspoken Voice* (2010)

> "The body initiates the trauma response, and the mind follows; therefore, 'talking cures' that engage only the intellect or emotions often fail to reach the deep biological root of the injury." — Levine, *In an Unspoken Voice*

> "Recovery involves 'titrating' (gradually accessing) physiological reactions to ensure the client is not overwhelmed or retraumatized." — Levine, *In an Unspoken Voice*

> "The window of tolerance [is] the zone of arousal within which information can be processed, emotions experienced, narrative maintained, and cognition stay online." — Ogden, *Trauma and the Body* (2006)

> "Trauma lives in the body, not only in the mind. Traumatic experience is encoded at a subcortical, sensorimotor level." — Ogden, *Trauma and the Body*, Essence §1

> "Phase 1 is not optional prelude; it is where most chronic trauma work remains. Jumping to Phase 2 without stabilization re-traumatizes." — Ogden, *Trauma and the Body*

> "Collaboration and internal locus of control — the client decides what to explore, how long to stay, when to stop." — Ogden, *Trauma and the Body*, principes de traitement

---

## Pour aller plus loin

- **Peter Levine — *Waking the Tiger* (1997)** : version antérieure et narrative de la Somatic Experiencing. Meilleure entrée pour comprendre la TI et le cycle de l'énergie de survie.
- **Bessel van der Kolk — *The Body Keeps the Score* (2014)** : panorama scientifique du trauma somatique. Synthèse sur neurosciences + EMDR + yoga + théâtre comme modalités de soin.
- **Bonnie Badenoch — *The Heart of Trauma* (2018)** : application de la théorie polyvagale aux relations thérapeutiques. Utile pour câbler le "système d'engagement social" dans des interactions IA-utilisateur.
- **Stephen Porges — *The Polyvagal Theory* (2011)** : source primaire de la théorie des trois niveaux nerveux. Dense et clinique, mais incontournable pour comprendre pourquoi la régulation passe par le corps social.
- **Judith Herman — *Trauma and Recovery* (1992)** : fondation clinique des trois phases. Contexte historique et clinique indispensable pour comprendre pourquoi la phase 1 est non-négociable.
