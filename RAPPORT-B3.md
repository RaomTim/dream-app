# RAPPORT B3 — l'app propose, le rêveur review

> **Agent B3** (Opus) · flotte de 5 · 2026-07-26.
> **Statut : `full_green` côté livraison, `partial` côté vérité d'usage.**
> Code livré, migration appliquée et vérifiée en prod, typecheck à 0 erreur, détection testée sur les 64 rêves de Tim. **Rien n'a été marqué, rien n'a été écrit dans les données de Tim** (vérifié §6).
> Ce qui reste inconnu et le restera jusqu'à ce que Tim s'en serve : est-ce que ces propositions-là sont les siennes. Personne n'a jamais marqué un grand rêve dans cette app — il y en a exactement **un** en base, hérité de la V1.

---

## 0 — Les deux demandes, et ce que j'en ai fait

**(1) « Il faut que l'app propose de trouver et identifier les grands rêves elle-même, et que l'utilisateur les reviews. »**
→ Livré. Un détecteur en deux couches, une table de *propositions* qui ne marque jamais rien, un geste de review à trois réponses (oui / non / ne rien faire), et un parcours de première review sur tout l'historique. Testé en réel : **6 propositions sur les 64 rêves de Tim**, listées §3.

**(2) « Pour le seuil, passe le plus bas alors. »**
→ Appliqué — et le résultat est que **il n'y avait rien à changer, et j'ai la mesure qui le prouve**. `KEEP_THRESHOLD` est déjà à 3, qui est **le plus bas seuil qui change quelque chose** : à 2, la sortie est **identique, sur les trois situations, rêve pour rêve** (§4). Ce que la demande de Tim tranche vraiment, c'est **de ne PAS monter à 4** comme A3 le recommandait. C'est fait, c'est mesuré, et la mesure lui donne raison.
→ Sur l'**autre** seuil (l'écho ancien, 0.75) : je ne l'ai pas touché, **mais mon désaccord n'est pas celui qu'on m'avait annoncé** — la peur des « 183 échos » est périmée. Chiffres et recommandation §5.

---

## 1 — LA MÉTHODE, et ce qui la fonde

### 1.1 La Forêt, réellement lue en session

Quatre digests lus intégralement dans cette session (`forest/digests_canonical/`). Aucun autre n'est cité.

**Bulkeley, _Big Dreams_ (2016)** — `bulkeley-big-dreams.md`. Deux idées portent tout le détecteur.

1. **Le « Black Swan Approach »** : la science du rêve étudie la moyenne du contenu onirique et jette les extrêmes comme du bruit ; Bulkeley fait exactement l'inverse et soutient que ce sont les outliers rares qui comptent. **Conséquence directe et non négociable** : on ne cherche pas un seuil absolu de « grandeur ». On cherche **l'écart au corpus de CE rêveur**. Tout est z-scoré par rêveur ; deux rêveurs ne sont jamais comparés.
2. **Continuité / discontinuité** : les rêves ordinaires prolongent les préoccupations de la veille (continuité) ; les grands rêves **rompent avec ses normes, et de façon structurée** (discontinuité) — et Bulkeley insiste : c'est *cette rupture* qui est repérable. C'est ce que mesure la composante `discontinuite` (synesthésie, atemporalité, effondrement du temps, prototypes).
   Les **4 prototypes** (aggressive / sexual / gravitational / mystical) servent de signal, **jamais d'étiquette affichée** — `1_BIBLE` §4.1 : « classification soft jamais imposée », backend only.
3. **Carry-over effects** : l'effet mesurable qui persiste au réveil. C'est le seul signal du lot qui ne juge pas un texte mais **observe ce que le rêve a fait**. Il est câblé (`carryover`) et il est **vide aujourd'hui** — j'y reviens §2.4, parce que c'est un aveu, pas un détail.

**von Franz, _The Way of the Dream_** — `von-franz-way-of-the-dream.md`. Le grand rêve y est « qualitativement différent », d'une intensité exceptionnelle, souvent vécu comme *plus réel que la veille*, et il **marque une transition majeure de la vie du rêveur**. D'où le poids le plus fort sur `charge` (intensité affective + charge somatique) et la composante `seuils` (les passages explicitement relevés dans le récit). Le Soi s'y manifeste en figures divines et images cosmiques — d'où les marqueurs archétypaux du divin dans la détection du prototype mystique.

**Hillman, _The Dream and the Underworld_** — `hillman-dream-and-the-underworld.md`. C'est le garde-fou, et il a changé deux décisions concrètes.

- **L'erreur d'Hercule** : Hercule descend aux Enfers en matraquant et remonte les figures au grand jour *par la force de l'interprétation*. C'est très exactement ce qu'un détecteur bavard ferait. D'où : le modèle ne dit **jamais** ce que le rêve veut dire — il **nomme l'image** (l'*épistrophè* : on revient à l'image, on ne la développe pas en signification). C'est pour ça que ce qui s'affiche est une phrase descriptive et rien d'autre.
- **Le moi-rêvant est une ombre** : chez Hillman, l'impuissance du rêveur dans le rêve — ne pas pouvoir courir, fuir, frapper — n'est **pas** une pathologie, c'est le comportement juste dans le monde d'en bas. **Conséquence** : `dream_ego_stance` **n'entre pas dans le score**, alors que la colonne existe et était tentante. La scorer aurait fait remonter les rêves héroïques (« je combats, j'aime et je protège ») et couler les rêves de paralysie — l'inverse de ce qu'il faut. Le meilleur candidat trouvé sur le corpus de Tim est précisément un rêve de chute et de paralysie (§3).

**Aizenstat, _Tending the Dream Is Tending the World_** — `aizenstat-dream-tending.md`. On *tend* l'image, on ne la fixe pas : laisser les figures « marcher sur leurs propres jambes », ne pas les réduire à un sens arrêté. Les quatre capacités (curiosité, patience, compassion, sensation) sont traduites en règles de rythme — jamais au dépôt, jamais en rafale, jamais de relance — et en forme d'écran : on pose l'image, et on se tait.

### 1.2 L'architecture, en une image

```
corpus du rêveur (≥ 12 rêves, sinon silence total)
   ↓ nettoyage : fragments < 300 car. + doublons d'import (6 écartés sur 64)
   ↓ 7 composantes brutes, tirées de l'extraction déjà en base
   ↓ RÉSIDUALISATION sur log(longueur)  ← le geste qui compte, §2.1
   ↓ z-score par composante, somme pondérée, puis z-score du total
   ↓ = LE RELIEF, en écarts-types du corpus de CE rêveur
   ↓ coupe : relief ≥ 1.3σ · rêve ≥ 30 jours · non déjà marqué · jamais déjà proposé
   ↓ LECTEUR (Sonnet) — nomme l'image, et peut tout refuser
   ↓ → des CANDIDATS. Jamais une marque.
```

### 1.3 La règle dure, tenue par la structure et pas par la consigne

`POST /api/great-dreams/candidates` écrit **uniquement** dans `great_dream_candidates`. Le seul code du dépôt qui touche `kairos.user_marked_numinous` est le `PATCH`, déclenché par un tap. Un candidat non reviewé n'est pas un grand rêve, n'apparaît pas dans le journal, et ne compte nulle part. C'est `1_BIBLE` §3.13.3, appliqué comme une contrainte d'architecture — pas comme une intention.

---

## 2 — CE QUI MARCHE, ET CE QUI NE MARCHE PAS

### 2.1 Le piège de la longueur : il était réel, et il est neutralisé

Le corpus est de la dictée vocale. Une entrée longue contient mécaniquement plus de motifs, plus d'archétypes, plus de seuils. **Mesuré avant de coder** :

| | corrélation avec log(longueur) |
|---|---|
| `numinosity_score` (le score de l'IA existant) | **0.532** |
| nombre d'archétypes extraits | **0.499** |
| **relief, version naïve** (z-scores simples, sans correction) | **0.742** |
| **relief, tel que livré** (composantes résidualisées) | **0.000** |

Un détecteur naïf aurait donc capturé **la longueur à 74 %**, et ça ne se serait vu nulle part. Chaque composante est régressée sur `log(longueur)` et seul le résidu est conservé.

**La contre-épreuve, qui vaut mieux qu'une corrélation :**

```
top 8 du relief  ∩  top 8 des rêves les plus longs   =  0 / 8
top 8 du relief  ∩  top 8 de la numinosité IA        =  2 / 8
```

**Zéro recouvrement avec la longueur.** Et concrètement : le 6ᵉ candidat retenu fait **892 caractères** — le plus court de la sélection, contre une moyenne de corpus à 3 191. Le rêve le plus long du corpus (10 895 car.) tombe **26ᵉ sur 58**.

**Corollaire qui n'était pas dans mon mandat mais qui compte** : `numinosity_score`, tel qu'il existe aujourd'hui, est corrélé à **0.532** avec la longueur du texte. Après le rattrapage d'A2, ce n'est plus « le pipeline n'a pas tourné » — c'est que **le score mesure en bonne partie combien le rêveur a parlé**. Son n°1 absolu (« Les masques tombent à Hellfest », 0.98, 6 243 car.) est, à la lecture, un rêve où Tim commente surtout son propre talent d'orateur (« faire des speechs, c'est vraiment mon fort », répété deux fois). Le relief le classe **32ᵉ sur 58**, et je pense qu'il a raison. **À ne pas utiliser comme sélecteur ailleurs dans l'app.**

### 2.2 La seule validation externe disponible, et elle est faible

Tim a marqué **un** rêve dans toute la V1 : « L'école des dieux et la royauté incarnée ». Le relief le classe **8ᵉ sur 58** — top 14 %, sans que rien dans le calcul ne le sache.
C'est encourageant. **C'est aussi n = 1, et je ne vais pas prétendre que ça valide quoi que ce soit.** C'est le seul point de contrôle qui existe, il est du bon côté, point.

### 2.3 Le lecteur est bon pour nommer, discutable pour juger — mesuré

Le lecteur (Sonnet) a été lancé sur trois tailles de lot. Résultat :

| lot envoyé | gardés | ce qu'il garde |
|---|---|---|
| 6 (le lot de production) | **2** | stable — **3 exécutions sur 3 donnent exactement le même verdict** |
| 12 | 3 | en garde deux qu'il n'avait pas vus, **lâche celui qu'il avait gardé à 6** |
| 20 | 4 | garde des rêves classés 0.43σ, très bas au relief |

**Le verdict du lecteur est relatif au lot, pas absolu.** Il garde ~20 % de ce qu'on lui montre, quoi qu'on lui montre. C'est une vraie faiblesse et je ne la maquille pas.

**Deux conséquences, et la seconde a changé la conception :**

1. Le lot doit être **déterministe** — c'est le plancher de relief qui le fixe, pas le hasard. Il l'est, et la stabilité 3/3 le confirme.
2. **La sévérité du lecteur est juste dans un cas et fausse dans l'autre.** Pour la proposition hebdomadaire **non sollicitée**, on dérange quelqu'un : le faux positif coûte cher, le lecteur garde son droit de veto et refuse le plus souvent. Pour la **première review**, que le rêveur a lui-même demandée, **c'est lui le filtre** — et le faux négatif coûte plus cher, parce qu'un rêve jamais montré ne sera jamais reconnu. Dans ce mode, le lecteur ne juge plus la grandeur : il nomme l'image et n'écarte que ce qui **n'est pas un rêve** (commentaire sur le journal, fragment). Deux prompts, deux questions, un seul module.

**Aveu de méthode** : mes trois exemples de « bonne image » dans le premier prompt étaient tirés du corpus de Tim — j'avais amorcé le modèle sur les rêves que je voulais qu'il trouve. Je les ai remplacés par des exemples étrangers au corpus et **relancé : verdict identique**. La fuite n'avait pas produit le résultat, mais elle aurait pu, et sans la relance je n'en saurais rien.

### 2.4 Le meilleur signal du système est vide, et c'est structurel

Le *carry-over effect* de Bulkeley — ce que le rêveur a **refait** avec le rêve — est le seul signal qui n'est pas un jugement sur du texte. Sur le compte de Tim : **1 interprétation écrite, 1 protocole terminé, sur 64 rêves.** Z-scorer un signal présent une fois sur 58 produit un outlier à **+7σ qui écrase tout le reste** — c'est ce qui s'est passé à mon premier essai, et un seul rêve remontait pour la seule raison que Tim y avait écrit quelque chose une fois.

La composante est donc **neutralisée sous 5 observations** (`MIN_CARRYOVER_OBSERVATIONS`). Même raisonnement qu'A2 sur les 30 verdicts : calibrer sur une observation, c'est refaire l'erreur qu'on répare. Elle s'activera d'elle-même à l'usage. **En attendant, le détecteur juge du texte, et c'est sa limite la plus profonde.**

### 2.5 Ce qui reste faible, sans maquillage

- **Le détecteur ne lit pas les rêves, il lit une extraction faite par une autre IA.** `paradoxes_unresolved`, `thresholds_passages`, `affective_intensity` sont des jugements de modèle déjà en base. Si cette extraction est biaisée, le relief l'est aussi, et rien dans mon dispositif ne peut le voir. Le lecteur (qui, lui, lit le texte brut) est le seul contre-pouvoir.
- **Le corpus contient des doublons non exacts** que mon nettoyage ne prend pas. « L'enfant alien » (3 211 car.) et « La communauté contre les forces obscures » (3 251 car.) sont deux transcriptions de la même nuit, à 40 caractères près. Elles partagent tous leurs motifs, ce qui écrase leur `singularite` à −3.6σ et −4.2σ. Effet : elles coulent au classement. **Ça ne crée pas de faux positif, mais ça peut créer un faux négatif**, et un vrai dédoublonnage sémantique (les embeddings existent) serait mieux que mon hachage de texte.
- **Les entrées à plusieurs rêves ne sont pas découpées.** C'est le chantier n°1 identifié par A2 et A3, il n'est toujours pas fait, et il limite ce détecteur comme il limite la consultation.
- **Un seul rêveur mesuré.** Tout ce rapport porte sur un corpus de 64 rêves, d'une seule personne, à forte coloration mystique. Le détecteur est portable par construction (tout est relatif au rêveur), il n'est **pas vérifié** comme tel.

---

## 3 — LE TEST RÉEL : ce que Tim verrait

Compte `gestion@infuse.earth`, 64 rêves → 58 éligibles (6 fragments/doublons écartés). Pipeline complet, mode `first_review`.
**Six propositions.** Pour chacune : l'image montrée à l'écran, l'extrait du rêve, et les chiffres internes qui, eux, ne s'affichent jamais.

```
▸ Le chant sacré des maîtres du feu — 19/04/2026        [relief 1.96σ · 3120 car. · IA 0.70]
  IMAGE : « La balançoire dépasse le mur, l'enfant disparaît de l'autre côté,
            et on la retrouve seule dans une cave où elle s'est initiée par elle-même. »
  EXTRAIT : « A la voilà Vauté, A la voilà Vauté […] Ce chant sacré, ce chant guerrier
    qui invoque la puissance du clan des brûlés, des maîtres du feu […] Cette nuit j'ai
    rêvé que j'avais une enfant […] c'était une sorte de créature, une déesse, magique,
    ultra puissante […] et là je pense qu'elle a été prise par Seth »

▸ Les Nages vers l'île oubliée — 19/04/2026             [relief 1.66σ · 2099 car. · IA 0.75]
  IMAGE : « Il nage loin du bateau familial, remonte sur une dune, entend des chacals,
            et la police ferme les portes juste après son arrivée à cause de vagues
            à soixante kilomètres. »
  EXTRAIT : « je reviens de faire de grands rêves au bord de l'océan. J'étais à l'île
    du Dieu Moitié […] il y avait une sorte de grotte, il fallait rentrer, c'était tout
    noir […] il y avait des gens qui flippaient d'aller dans la grotte »

▸ Les créatures du dialogue et de la lumière — 19/04/2026 [relief 1.57σ · 3607 car. · IA 0.72]
  IMAGE : « La tribu survit sur la montagne, des membres de la tribu veulent tuer
            le guerrier du dedans, et un livre vert aux motifs aztèques apparaît
            dans le réfectoire. »

▸ Les Voyageurs Engloutis dans la Mémoire — 19/04/2026   [relief 1.40σ · 2794 car. · IA 0.97]
  IMAGE : « Des voyageurs envoyés dans le passé s'y ancrent en mangeant, certains
            s'y perdent, et à la sortie du cinéma il prend sa mère par le cou
            et lui renvoie toute sa violence. »

▸ L'envol lucide entre deux mondes — 18/04/2026          [relief 1.40σ · 1279 car. · IA 0.85]
  IMAGE : « Il vole au-dessus de l'océan, s'élève à travers plusieurs dimensions,
            et un grand dragon de feu apparaît. »

▸ La chute du ballon en Europe de l'Est — 16/09/2024      [relief 1.33σ ·  892 car. · IA 0.63]
  IMAGE : « Le ballon lâche au-dessus de l'Europe de l'Est, il tombe dans un trou
            plein de serpents, sait qu'il ne faut pas bouger, panique, et se fait piquer. »
```

### 3.1 Mon jugement, sans complaisance

**Ça attrape des rêves puissants, pas des rêves longs. C'est établi, pas espéré.** Les six s'étalent de 892 à 3 607 caractères ; quatre sont sous la moyenne du corpus. Zéro recouvrement avec le top-8 des rêves longs. Le point que je trouve le plus probant est le sixième : **892 caractères, le score IA le plus bas de la sélection (0.63), et c'est un rêve de chute et de paralysie** — « je savais qu'il ne fallait pas que je bouge, en même temps je n'avais aucune idée de comment m'en sortir, j'ai paniqué ». C'est le prototype *gravitationnel* de Bulkeley à l'état pur, et c'est le moi-rêvant impuissant de Hillman. Un détecteur qui suit la longueur ou l'agentivité héroïque ne l'aurait jamais fait remonter.

**Deux confirmations que je n'avais pas cherchées.** Le rêve n°2 s'ouvre littéralement sur *« je reviens de faire de grands rêves au bord de l'océan »* — **Tim emploie lui-même les mots « grands rêves » dans le rêve que le détecteur propose**, sans que rien dans le calcul ne lise cette phrase. Et le n°1 contient un chant reçu, transcrit phonétiquement et répété quatre fois avant que le récit commence : si « chargé de symbole et d'initiation » veut dire quelque chose, c'est là.

**Les images sont propres.** Aucune des six ne dit ce que le rêve veut dire. Pas un « symbolise », pas un « ton inconscient », pas une question. Elles nomment ce qui se passe, et s'arrêtent. C'est la ligne Hillman/Aizenstat tenue — sur ce lot, à 6/6.

**Ce dont je doute, et que Tim tranchera en trente secondes de lecture** : le n°3 (« Les créatures du dialogue ») est le plus faible des six à mes yeux. C'est une longue aventure de jeu vidéo, riche en péripéties ; son relief vient surtout d'une densité archétypale élevée (+2.7σ), c'est-à-dire du signal le plus proche de la longueur malgré la correction. **S'il y a un faux positif dans ce lot, c'est lui.** Et c'est exactement le genre de rêve que Tim écartera d'un tap — ce qui est le fonctionnement normal du dispositif, pas son échec.

**Ce que le test ne dit PAS**, et il faut l'écrire : je juge la sortie d'un détecteur que j'ai écrit, sur les rêves de quelqu'un d'autre. Que je trouve ces six-là puissants n'a aucune autorité. **Le seul verdict qui compte est celui de Tim, et il n'a pas encore eu lieu.**

---

## 4 — LE SEUIL DE CONSULTATION : mesuré, et il n'y avait rien à baisser

Protocole : le prompt de production de `consult/route.ts`, **inchangé sauf la ligne de coupe** (le modèle note tout de 1 à 5 au lieu de filtrer lui-même), sur les 3 situations d'A3, lecture B (corpus entier). Les seuils sont ensuite appliqués aux mêmes notes — une seule exécution, donc pas de variance entre les colonnes.

| Situation | notes obtenues (10 candidats) | **seuil 2** | **seuil 3** *(en prod)* | **seuil 4** |
|---|---|---|---|---|
| « je me sens jamais assez dans ma relation » | 4, 3, 3, 2, 2, 2, 1, 1, 1, 1 | **3 servis** | **3 servis** | 1 servi |
| « je ne sais plus où je vais professionnellement » | 4, 4, 4, 3, 3, 2, 2, 2, 1, 1 | **3 servis** | **3 servis** | 3 servis |
| « j'ai peur de décevoir » | 4, 4, 3, 3, 2, 2, 1, 1, 1, 1 | **3 servis** | **3 servis** | 2 servis |

**Le résultat, net : seuil 2 et seuil 3 rendent exactement la même chose. Les trois mêmes rêves, dans le même ordre, sur les trois situations.** Aucun rêve noté 2 n'est jamais servi, parce que `MAX_KEPT_PER_READING = 3` mord avant le seuil : il y a toujours au moins trois rêves à 3 ou plus.

**Donc : `KEEP_THRESHOLD = 3` EST « le plus bas ».** Descendre à 2 est un no-op sur ce corpus ; descendre à 1 servirait des rêves que le barème lui-même définit comme « aucun rapport réel ». Ce que la demande de Tim tranche réellement, c'est **le refus de monter à 4** — et c'est ce refus que j'exécute. La mesure lui donne raison : à 4, la situation 1 tombe de 3 résultats à 1, et la situation 3 de 3 à 2. **A3 recommandait 4 ; sur ces chiffres, Tim a eu le meilleur jugement.**

**Aucune ligne de code changée sur ce point.** La valeur en production est déjà la bonne.

**Ce qu'il faut savoir en revanche** : le silence que Tim trouve trop fréquent ne vient pas de ce seuil, il vient de la **lecture A**. Elle ne cherche que parmi les rêves marqués — et il y en a **un**. Un candidat examiné, presque toujours zéro retenu. **La vraie réparation du silence, c'est de remplir le journal**, et c'est précisément ce que la première review livrée ici sert à faire. Les deux demandes de Tim n'en font qu'une.

---

## 5 — L'ÉCHO ANCIEN : je ne l'ai pas baissé, mais la raison n'est plus la bonne

On m'a mis en garde : baisser le seuil de l'écho ancien (0.75) ramènerait « exactement le bruit qu'on vient de supprimer — 183 échos, un même rêve servi 59 fois ». **J'ai vérifié moi-même sur la base plutôt que de le reprendre. C'est faux aujourd'hui.**

Ces 183 échos datent d'**avant** le filtre `z ≥ 2.0` posé par A2. Ce filtre est maintenant en amont et il fait le vrai travail : il ne laisse passer que **22 paires sur tout le corpus**, quel que soit le seuil absolu. Le seuil absolu n'est plus le gardien — il ne fait plus que raboter les 22.

Mesuré en direct (`find_kairos_prophetic`, `p_require_ripening=false`, `p_min_z=2.0`, tout le corpus) :

| seuil absolu | échos affichés | rêves concernés | **exposition max d'un même rêve** |
|---|---|---|---|
| **0.75** *(arbitrage actuel de Tim)* | **0** | 0 | 0 |
| 0.70 | 3 | 3 | 1 |
| **0.65** ← ma recommandation | **9** | 9 | **3** |
| 0.60 | 17 | 17 | 6 |
| 0.30 (« le plus bas ») | 22 | 21 | 7 |

**Le score maximum atteignable sur tout le corpus de Tim est 0.7159.** Son arbitrage à 0.75 est au-dessus du plafond que ses propres rêves peuvent produire : ce seuil ne filtre pas la fonction, **il la rend structurellement impossible**. (A2 mesurait 0.7368 ; l'écart vient du filtre z, désormais appliqué. La conclusion est la même, en plus net.)

**Ma recommandation : 0.65, pas « le plus bas ».** Neuf échos sur 64 rêves — environ un rêve sur sept en affiche un — avec une exposition maximale de 3. C'est assez rare pour qu'une phrase qui affirme une causalité (« un rêve ancien semble avoir préparé celui-ci ») garde son poids. « Le plus bas » (22 échos, exposition 7) ne serait plus la catastrophe qu'on redoutait, mais un rêve sur trois, ce n'est plus un événement.

**Je n'ai pas appliqué ce changement.** C'est un paramètre d'appel (`p_min_combined`), une ligne, aucune migration — et c'est l'arbitrage de Tim, pas le mien. Décision 4 ci-dessous.

---

## 6 — VÉRIFICATIONS

### Typecheck
```
$ cd ~/tscheck && node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json
EXIT=0 — zéro erreur
```
Mes 4 fichiers sont bien dans l'ensemble compilé (vérifié par `--listFilesOnly`) :
`great-dream-detect.ts` · `great-dream-reader.ts` · `api/great-dreams/candidates/route.ts` · `GreatDreamCandidates.tsx`, plus `GreatDreamsJournal.tsx` que j'ai modifié.

*Note pour Tim, en suivi du §2 d'A3* : l'`exclude` du `tsconfig.json` a été **resserré** depuis. Il n'exclut plus que des doublons iCloud (`CareCard 2.tsx`, `core.en 2.json`, `**/* ?.ts`). `AuthScreen.tsx`, `FeedbackButton.tsx` et `demo-night-tokens.ts` sont **revenus dans le typecheck**. Le signalement d'A3 est traité.

### Base de données
Migration `great_dream_candidates_b3` **appliquée en prod et vérifiée** :
```
colonnes=10 · rls=true · policies=3 · GRANT authenticated=7 ✅
```
Le GRANT est posé **en même temps** que la RLS — c'est la leçon du schéma `community`, où 11 tables avaient la RLS sans GRANT et où les lectures échouaient **en silence**.

### ⚠️ Les données de Tim n'ont pas été touchées — vérifié après coup
Contrairement à A3, **je n'ai marqué aucun rêve pour tester** : le dispositif se mesure sans écrire. Contrôle final en base :
```
candidats en base ......... 0
rêves marqués ............. 1  →  « L'école des dieux et la royauté incarnée »  (le sien, hérité V1)
dates de reconnaissance ... 1
corpus .................... 64
```
Aucune écriture. Les trois scripts de mesure (`scripts/_b3_*.mjs`) sont en lecture seule et laissés en place comme preuve reproductible ; ils sont supprimables.

---

## 7 — CE QUI ATTEND TIM

1. **Le mot « ressort ».** L'écran ne dit jamais « ce rêve est un grand rêve » — l'app n'a pas cette autorité. Il dit **« ceux qui ressortent »** : un fait sur le corpus (il se détache), pas un verdict sur le rêve. Si un autre mot vient, c'est une ligne d'i18n.
2. **La sélectivité : 6 propositions, c'est le bon nombre ?** Le plancher est à **1.3σ** (`MIN_RELIEF`, une constante). À 1.5σ il en resterait 3 ; à 1.0σ, une dizaine. Mon avis : 6 est juste pour une première review de 64 rêves — assez pour remplir le journal, assez peu pour être fait en une fois. **À réévaluer après qu'il aura vraiment reviewé** : s'il en écarte 5 sur 6, il faut monter.
3. **La proposition hebdomadaire doit-elle se déclencher toute seule ?** Elle est **livrée mais sans appelant** (`PATCH-PAGE-TSX-B3.md`, patch 2, optionnel). Ça ferait travailler un modèle au montage de l'app une fois par semaine, sans que personne l'ait demandé — c'est exactement ce que Tim a demandé (« que l'app propose elle-même »), et ça mérite quand même son oui. En attendant, **tout passe par la première review, qui est sollicitée.**
4. **L'écho ancien : 0.75 → 0.65 ?** Aujourd'hui : zéro écho, pour toujours, structurellement. Ma recommandation chiffrée est §5. **Une ligne, aucune migration.**
5. **`numinosity_score` corrélé à 0.532 avec la longueur du texte.** Ce n'est pas mon périmètre, mais c'est un score utilisé ailleurs dans l'app (la mention « ce rêve rayonne », le gate `≥ 0.4`, `/api/echoes/prophetic`). **Il mesure en partie combien le rêveur a parlé.** À traiter comme une dette, pas comme un détail.
6. **Le découpage des entrées en unités de rêve** reste le chantier n°1, signalé par A2 puis A3, toujours pas fait. Il limite la consultation, l'écho ancien et ce détecteur, tous les trois.

---

## 8 — LIVRÉ

| Fichier | État |
|---|---|
| `src/lib/kairos/great-dream-detect.ts` | ✅ nouveau — le relief. Pur, sans I/O, donc mesurable directement |
| `src/lib/kairos/great-dream-reader.ts` | ✅ nouveau — le lecteur, deux modes (juger / nommer) |
| `src/app/api/great-dreams/candidates/route.ts` | ✅ nouveau — GET / POST / PATCH |
| `src/components/GreatDreamCandidates.tsx` | ✅ nouveau — la review, 3 réponses |
| `src/components/GreatDreamsJournal.tsx` | ✅ modifié — montage des propositions + `reload` après acceptation |
| Migration `great_dream_candidates_b3` | ✅ **appliquée en prod**, vérifiée (RLS **+ GRANT**) |
| `supabase-migrations/2026-07-26_great_dream_candidates.sql` | ✅ copie de référence |
| `src/lib/i18n/mvp/screens.{fr,en}.json` | ✅ 8 clés sous `screens.great.cand*` |
| `PATCH-PAGE-TSX-B3.md` | ✅ **rien d'obligatoire** — la fonction marche sans |
| `scripts/_b3_{measure_detect,test_reader,test_reader_wide,threshold,first_review}.mjs` | ✅ mesures, lecture seule, reproductibles |

**Non touché** : `src/app/mvp/page.tsx` (B5) · `capture-safety.ts`, `offline-queue.ts`, routes de transcription (B2) · `core.{fr,en}.json` · toute RPC existante · `consult/route.ts` (§4 : rien à y changer).

**Coordination**
- **B5** : `PATCH-PAGE-TSX-B3.md`. Rien d'obligatoire ; le patch 1 (une pastille sur l'entrée du journal) est le seul qui manque vraiment, sinon la proposition hebdomadaire ne sera jamais vue.
- **B2** : aucun recouvrement. Je ne touche ni la capture ni la transcription.
- Nom de table vérifié libre avant migration. Aucune RPC existante modifiée.

---
*Agent B3 (Opus), 2026-07-26. Toutes les mesures refaites en direct sur la base de production. Rien n'est déclaré « marche » sans le chiffre qui le prouve — et rien n'est déclaré « juste » : ça, c'est à Tim.*
