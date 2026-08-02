# LECTURES GLOBALES — les 16 fruits de la plénière, transposés au corpus d'une vie onirique

> 2026-07-26. Répond à la demande de Tim : *« n'y aurait-il pas des façons riches et intéressantes, curieuses et surprenantes, d'offrir des lectures globales de l'univers du rêve, du cœur, des deux ? Et dans ses groupes ? et à l'échelle collective ? »*
> Fondé sur : le code source des 16 fruits (`forest/build_outputs/plenary/output-prompts/`), la méta-plénière du 19/04, la consultation Global Layer du 20/04, deux plénières réelles lues, 15 digests Tier 1 ouverts en session, `DOCTRINE-MIROIR.md`, `FAISABILITE-MIROIR.md`, `safety-checks.json`, et une mesure SQL fraîche de la base.
> **Rien ici n'est proposé « à arbitrer » contre une red line. Ce qui viole la doctrine est dans la section « morts-nés », avec la raison.**

---

## PARTIE 0 — LA MATIÈRE : les 16 fruits, vérifiés dans le code

Source de vérité : `forest/build_outputs/output_types/output-types-catalog.ts` (16 entrées) et `forest/build_outputs/plenary/output-prompts/` (17 fichiers de prompt). Les 4 pré-cochés du mode plénière sont dans `DEFAULT_OUTPUTS_BY_MODE.plenary`.

| # | Nom | Slug code | Ce qu'il fait vraiment | ★ |
|---|---|---|---|---|
| 1 | **Artéfact orphelin** | `orphan_artifact` | Engendre une forme neuve — concept, figure, rituel, protocole — qu'aucun livre seul ne contient. Test de non-attribution obligatoire, 5+ contributeurs tracés. La signature du mode. | ★ |
| 2 | **Zones vides** | `empty_zones` | 3 à 7 angles morts, chacun qualifié : *personne ne dit X **parce que…*** (structurel / éthique / historique / consenti). | |
| 3 | **Tensions productives** | `tensions` | 3 à 5 contradictions frontales entre livres, **sans résolution**. « Pourquoi les deux sont justes » + « ce que ça exige ». | |
| 4 | **Convergences inattendues** | `convergences` | Des livres de racines étrangères disant la même chose avec des vocabulaires qui ne se citent jamais. Interdit : les clichés du champ. | |
| 5 | **Boussole-Rivière** | `riverine_compass` | 1 orientation principale + 3 périphériques + **1 anti-orientation** + les barrages. Formulée en « le corpus t'entend aller vers », jamais en prescription. | |
| 6 | **Pré-sentiment** | `presentiment` | 2-3 **textures** d'un futur proche. Des ambiances, pas des scénarios. Ce que ça sent. | |
| 7 | **Antiphonaire** | `antiphonal` | 3 à 5 voix nommées qui se répondent et se contredisent. Chœur sans chef. Se termine par « ce que le chœur ne tranche pas ». | ★ |
| 8 | **Carte du Vide** | `void_map` | La version dense et architecturale des zones vides : cartographie complète des silences autour d'un thème. Distingue les silences **consentis** (à ne pas combler). | ★ |
| 9 | **Lisière : casser ou fleurir** | `edge_break_bloom` | 3-5 zones qui portent **les deux possibles à la fois**, plus « ce qui fait la bascule ». Pas des pros/cons. | |
| 10 | **Ruling** | `ruling` | Décision éthique tranchée, structure rigide : question, livres consultés, précédents, raisonnement, décision, réserves. Le seul fruit qui tranche — y compris par un refus. | |
| 11 | **Écho-Organisme** | `echo_organism` | Ce qu'une organisation fait résonner dans le corpus, et ce qu'elle **tait**. Miroir, jamais recommandation. | |
| 12 | **Veille** | `watch` | Le peu qu'on sait / le beaucoup qu'on ignore / ce qui pourrait arriver / le geste proposé. Humilité structurelle. | |
| 13 | **Cendre** | `ash` | Ce qui a été composté — déposé, abandonné, non-consulté — et ce que ce compostage a nourri. Non-héroïsation obligatoire. | |
| 14 | **Seuil** | `threshold` | 3 gestes pour marquer un passage : ce qu'on laisse dehors / ce qu'on accueille / ce qu'on porte ensuite. Court, rituel. | ★ |
| 15 | **Pli** | `fold` | Deux réalités apparemment séparées qui se touchent **littéralement** par un pli topologique. Pas une analogie. | |
| 16 | **Louange contre-intuitive** | `contrarian_praise` | Célèbre le déploré, déplore le célébré. Seule exception autorisée au refus du poétique (« Lorca l'impose »). Max 1 par trimestre. | |

**Le 17ᵉ, hors catalogue : `refus_formel`.** Le prompt existe (`output-prompts/refus_formel.ts`), il n'est jamais devenu un output_type — il est devenu un **comportement transversal** (`GENERIC_REFUSALS`). La méta-plénière le qualifie de *« révolutionnaire »* : *« le fait que le Plenary puisse refuser est ce qui fait qu'il n'est pas un oracle addictif. »*

**Et le 18ᵉ, qui n'a jamais été codé — et c'est la trouvaille de ce document.** La méta-plénière du 19/04 a engendré 14 fruits. 12 ont été codés. Deux sont tombés. L'un des deux s'appelle **« Le Fil »**, et sa description est celle-ci :

> *La Ligne de Vie Personnelle — accepté avec fort garde-fou : **jamais produit automatiquement, toujours demandé.***

C'est exactement le miroir que Tim a demandé le 26/07, exactement le déclencheur que `DOCTRINE-MIROIR.md` §6.2 a re-déduit ce matin sans savoir qu'il existait, et **c'est le seul fruit de la plénière que personne n'a construit.** Il attendait qu'on ait un corpus de rêves plutôt qu'un corpus de livres.

---

## PARTIE 1 — CE QUE LA TRANSPOSITION RÉVÈLE (à lire avant les propositions)

### 1.1 La reformulation en plus grand

Tu demandes des lectures globales. La contrainte que personne n'a énoncée : **une lecture globale d'un corpus de rêves, dès qu'elle synthétise, devient un portrait — et le portrait est interdit** (`DOCTRINE-MIROIR` §1.4 : le miroir cite, il ne caractérise pas).

La vraie question n'est donc pas *« quelle lecture globale ? »* mais : **quelle forme peut porter une totalité sans produire de verdict ?**

Et les 16 fruits répondent à l'unanimité, sans qu'aucun ne l'ait dit : **aucun des 16 ne produit une synthèse.** Vérifie la colonne : des trous (2, 8, 12), des contradictions tenues (3, 7), des refus et des décisions (10, 17), ce qui est tombé (13), des passages (14, 15), une forme neuve (1). Le seul qui « confirme » est le n°4, et sa propre note de risque dit *« clichés déguisés »*. Le seul qui oriente est le n°5, et c'est celui que la lecture des plénières réelles juge le plus indistinguable d'une reformulation flatteuse.

> **Une totalité se rend par ses trous, ses contradictions et ses refus. Jamais par son résumé.**
> C'est la loi que les 16 fruits énoncent en chœur, et c'est la réponse structurelle à la peur d'être figé.

Corollaire de forme, tiré du code (`page-plenary.tsx`, étape `document`) : le fruit d'une plénière est un **document de retraite** — produit rarement, sur demande, lu une fois, archivé, avec 5 secondes d'écran noir avant. **Ce n'est pas un écran.** Toute « lecture globale » de la Dream App qui prend la forme d'un onglet permanent, d'un dashboard ou d'une page de profil trahit les 16 fruits à la racine.

### 1.2 Ce qui change quand le corpus passe des livres aux rêves

| | Corpus de livres | Corpus de rêves |
|---|---|---|
| L'unité | un livre = **une voix, une thèse, un auteur, une lignée** | un rêve = **une image, sans thèse et sans autorité** |
| La friction | deux livres se **contredisent** sur une question | deux rêves ne se contredisent pas. Ils n'affirment rien. |
| La traçabilité (P3) | « [slug] dit X » | « le 12 juillet, tu as écrit X » — la source est **lui** |
| Le refus | la Forêt refuse à l'utilisateur | **le rêveur peut refuser à l'app** (renversement) |
| Le vide | ce qu'aucun livre ne dit | ce qui **n'est jamais venu la nuit** |

**Conséquence n°1, décisive.** Les trois fruits qui reposent sur des voix qui s'affrontent — Antiphonaire, Tensions, Convergences — **ne se transposent pas sur les rêves**. Un rêve n'a pas de thèse. Ils se transposent sur autre chose, et c'est là qu'est le gisement : **les lectures successives que le rêveur a faites de ses propres rêves.** Celles-là ont des thèses, elles sont datées, elles se contredisent, et elles sont de lui.

Mesure à l'appui : `lecture_text` est rempli sur 49 des 64 dépôts, et l'agent B4 a compté **171 passages « lecture »** dans les dictées de Tim. Il s'interprète beaucoup en parlant. Le matériau du chœur existe déjà.

**Conséquence n°2.** La transposition évidente — *un antiphonaire des figures du rêve, où le serpent, la mère et le maître se répondent* — est **la seule qui soit formellement interdite** : `DOCTRINE-MIROIR` §7 interdit n°6, *jamais parler à la place d'une figure* (Aizenstat : les figures marchent sur leurs propres jambes ; Buber). C'est la plus belle idée du lot et elle est morte. Autant le savoir tout de suite.

### 1.3 Les trois faits durs qui arbitrent tout ce qui suit

Mesurés en base ce soir, projet `rtrkxzcyblgonwgfzovj`.

1. **Le corpus est mono-locuteur.** 74 kairos, 5 déposeurs, dont **64 pour un seul** (toi), sur 21 jours actifs en 28 mois. 76 comptes, 6,6 % de conversion vers le premier dépôt. Toute lecture dont la valeur croît avec le volume ou la diversité est **non testable aujourd'hui**.
2. **Les agrégats sont inutilisables, et ce n'est pas réparable par un meilleur prompt.** 918 `motif_tags` pour **872 valeurs distinctes** — 95,4 % d'hapax. 1 538 symboles de dictionnaire pour 74 rêves (21 par rêve), 94,3 % de singletons. `recurring_dream_patterns` : **table vide, pour tout le monde**. Et `FAISABILITE-MIROIR` §2.2 tient la preuve que la couche invente : **la même chaîne de 31 caractères, déposée deux fois, a produit deux jeux de motifs différents dont dix mots absents du texte.** Toute proposition qui compte des tags compte du bruit.
   **Ce qui marche, en revanche : le comptage direct sur le texte brut.** école 22 · communauté 21 · business 19 · sacré 18 · vol 16 · Jade 15 · père 13 · mère 10. Robuste, insensible à l'extraction. **La détection de motifs marche à condition de la faire sur les récits, jamais sur les étiquettes.**
3. **Zéro usage social, sur trois surfaces indépendantes.** Cercles Dream : 2 cercles, 2 membres, **0 message**. Cercles INFUSE (`circle.*`) : 11 cercles seedés le même jour, 9 avec zéro membre, **6 messages en tout et pour tout — dont les six sont de toi, depuis deux comptes** (`JE suis vivant`, `?`, `JE SUIS VIVANT`, `hello`, une image, `Rjen`). Mur : 1 post, 1 touche, le 11 juillet, plus rien. `1_BIBLE` L467 le dit déjà : *« ce n'est pas un accident, c'est une donnée. »*

**Et le fait qui commande la partie Rêve × Cœur** : le Chant du Cœur n'existe pas en base. `kairos_type='note_jour'` = **0**. `life_journal_entries` = **1 ligne, 29 caractères, non catégorisée**. La veine que tu désignes comme la plus prometteuse est celle dont la donnée est vierge — pas maigre : vierge.

### 1.4 L'autopsie des cercles, avant de proposer quoi que ce soit en groupe

Trois surfaces mortes, une même cause, lisible dans la donnée : **on a construit des lieux, pas des actes.**

11 cercles créés le même jour, thématisés par plantes, en attente d'habitants. Un cercle vide est un meuble, et un meuble vide est un reproche quotidien. La Forêt le dit par Parker (P1, *purpose-first, logistics-after*) : la salle ne précède jamais la raison d'être. Et Moss le dit par la pratique — le Lightning Dreamwork se joue *« à la table du petit-déjeuner »*, en cinq minutes, avec n'importe qui (digest `moss-dreaming-soul-back-home` l.66, lu). **L'unité n'est pas le cercle. C'est l'échange.**

Deuxième cause, plus fine, et c'est Taylor qui la donne (`taylor-where-people-fly`, lu) : le groupe de rêve ne protège que **par la pluralité des projections qui s'annulent**. À deux membres, il n'y a pas d'annulation — il y a une interprétation qui écrase. Un cercle à deux est structurellement plus dangereux qu'une lecture solitaire. Nos cercles n'ont pas échoué à démarrer : ils étaient sous le seuil auquel le protocole devient protecteur.

⚠️ **Ullman n'est pas dans la Forêt.** Vérifié : zéro digest, quatre mentions du nom, dont une comme item **non digéré** #34 de `BOOK-LIST-DREAM.md` (*Ullman & Limmer, The Variety of Dream Experience*). `1_BIBLE` L467 affirme que le tour de parole à ouverture différée *« est structurellement le protocole d'Ullman »* — **cette affirmation n'est fondée sur aucune lecture disponible.** Elle est probablement juste. Elle n'est pas sourcée. Ce que je peux fonder, je le fonde sur Taylor et Moss, qui sont lus. Et la digestion d'Ullman devient la première acquisition prioritaire si le volet groupe avance.

---

## PARTIE 2 — LES PROPOSITIONS

Quatorze. Ordre : individu (1-8), groupe (9-11), collectif (12-14).

---

### 1. LE CHŒUR DE CE QUE J'EN AI DIT
*(écran : « voilà tes trois phrases »)*

**Ce qu'il voit et fait.** Trois à cinq de ses propres lectures passées, sur un même motif, **datées, verbatim, posées côte à côte, dans l'ordre du temps**, sans une ligne de commentaire. La dernière chose que l'app écrit est ce qu'elle ne fait pas : *« voilà tes trois phrases. Je ne les commente pas. »* Puis une seule question, qui va au corps.

**Descendance : Antiphonaire (7).** Le corpus change tout : dans la Forêt, les voix sont des livres qui ont des thèses. Ici, **les voix sont lui, à trois moments différents de sa vie**. Le chœur sans chef devient un chœur d'une seule personne — et c'est plus dur à entendre qu'un désaccord entre auteurs, parce qu'on ne peut pas congédier la voix.

**Fondation.** Taylor (`taylor-where-people-fly`, lu) : la **surdétermination** — *« un rêve n'est jamais à propos d'une seule chose ; toute interprétation "correcte" unique exclut nécessairement d'autres lectures également valides »*. Hunt (`hunt-multiplicity-of-dreams`, lu) : pas d'essence du rêve, donc jamais une lecture. Gendlin, via `DOCTRINE-MIROIR` §5.2 (digest lu le 26/07, non rouvert aujourd'hui) : le *Bias Control* établit qu'en s'interprétant, le rêveur impose **inévitablement** ses attitudes conscientes du moment — d'où la nécessité d'une contre-voix, et la moins violente des contre-voix est **une autre de ses voix**.

**Échelle** : individu.

**Faisable aujourd'hui.** Oui, et c'est le moins cher du document — zéro prose générée, du montage. `lecture_text` sur 49/64, 171 passages détectés. **Blocage réel** : la détection tourne à ~90 % (`DOCTRINE-MIROIR` tension 7), et ici on ne classe pas, on **cite**. Il faut donc une confirmation avant citation, en contradiction assumée avec la règle B4 n°9 (rien pendant la capture).

**Risque.** Mettre dans sa bouche une phrase qu'il n'a pas dite comme lecture. Et un risque de forme, plus insidieux : trois de ses phrases alignées ressemblent à un procès-verbal. Le montage doit ordonner par le motif, pas par la contradiction — et l'app ne dit **jamais** « tu as changé d'avis ».

---

### 2. LE CREUX
*(le rêve que tes nuits dessinent et qu'elles n'ont pas fait)*

**Ce qu'il voit et fait.** À partir de ce qui revient et de ce qui manque dans le corpus, l'app décrit **une forme absente** — un rêve qui n'est pas là mais dont les autres tracent le contour. Elle ne l'annonce pas. Elle le **propose à incuber** : *« si tu veux, emporte ça ce soir. »* Et ce qui est rêvé ensuite est marqué `incubé` — donc **retiré de la matière de tout miroir futur**.

**Descendance : Artéfact orphelin (1)**, croisé avec *Book Zero* (`FOREST-EVOLUTION-IDEAS.md` : *« le livre qui n'existe dans aucune source mais qui veut exister au carrefour de leurs tensions »*). Ce que change le corpus : dans la Forêt, l'artéfact orphelin est une forme livrée au lecteur, qu'il adopte ou composte. Ici, **la forme n'est pas livrée, elle est rendue à la nuit.** C'est le seul fruit du document dont la sortie n'est pas consommée mais dormie.

**Fondation.** Bachelard (`bachelard-poetics-space`, lu) : la **fonction d'irréel** — *« l'imagination sépare du passé et du réel, elle fait face au futur »*, et l'image poétique **échappe à la causalité**, elle n'a pas de passé récent dont on suivrait la préparation. C'est exactement ce qui distingue un creux d'une prédiction : un creux n'est pas dérivé du passé, il est une ouverture. Corbin (`corbin-alone-with-alone`, lu) : la *himma*, l'imagination active concentrée dans le cœur, **projette** des images dans le monde imaginal — et le *ta'wīl* de Joseph fut fautif parce qu'il chercha son rêve dans l'ordre des événements sensibles au lieu de remonter. Moss, sur l'incubation (`moss-sidewalk-oracles`, lu) : la kairomancie est une discipline **active**, pas une observation ; *« la magie sans action est de l'imagination. »*

**Échelle** : individu.

**Faisable aujourd'hui.** Techniquement oui — c'est une lecture Opus des 54 récits, ~0,91 €. **Mais je ne le construirais pas en premier** : le creux n'a de valeur que si le corpus est assez dense pour dessiner un contour, et 54 récits dont 39 sans date, c'est la limite basse.

**Risque — et il est sérieux.** Trois, dans l'ordre de gravité.
(a) **Contamination du corpus** : sans le marquage `incubé`, l'app finirait par relire ses propres suggestions comme du matériau spontané. C'est le détail technique qui rend la chose défendable ou indéfendable, il n'y a pas d'entre-deux.
(b) **Glissement en prédiction** : un creux formulé au futur (« il viendra un rêve où… ») est une violation de red line, sèche. Il doit être formulé au présent d'une absence.
(c) **Suggestion** : dire à quelqu'un quoi rêver est un pouvoir. Mitigation : le creux est **demandé**, jamais servi, et il ne se répète pas — un creux non rêvé n'est pas re-proposé.

---

### 3. LA VEILLE
*(écran : « ce que je ne sais pas de tes nuits »)*

**Ce qu'il voit et fait.** L'app publie, pour lui seul, **l'inventaire de son ignorance**. Non pas généré : **mesuré**. Trente-neuf de tes récits n'ont pas de date. Ton corpus commence en mars 2024, ta vie de rêve non. Tu m'as dit toi-même, dans *La chute du ballon* : *« la dernière fois, un truc comme ça, par les serpents »* — **je n'ai qu'un seul maillon de cette série.** Quatre de tes rêves sont ici en double, avec deux titres différents. Cinq de tes récits se terminent par une phrase que le transcripteur a inventée. Et : je ne sais rien de ce que tu traverses le jour, parce que cet écran n'a jamais servi.

**Descendance : Veille (12).** Le corpus change le sujet de l'humilité : dans la Forêt, la Veille dit ce que **le corpus** ignore d'un sujet. Ici, elle dit ce que **l'app** ignore d'**une personne**. C'est la même structure — *le peu qu'on sait / le beaucoup qu'on ignore* — retournée vers le lecteur.

**Fondation.** Le prompt `veille.ts` lui-même (*« humilité structurelle, sans fausse humilité »*). Taylor (lu) : l'*aha* du rêveur est le **seul** critère de validité, aucune autorité externe. Et `DOCTRINE-MIROIR` §8.1(d), l'asymétrie d'échelle : *« le miroir voit le corpus entier d'un coup ; Tim voit un rêve à la fois. Ça fabrique de l'autorité que l'app le revendique ou non. »* La Veille est le seul dispositif du document qui **détruit cette autorité de face**.

**Échelle** : individu (transposable au cercle et au collectif, cf. n°14).

**Faisable aujourd'hui.** Oui, entièrement, et **sans un seul appel de modèle** : tout est déjà mesuré dans `FAISABILITE-MIROIR` §1 et §6. C'est une requête SQL et un gabarit. Coût : zéro.

**Risque.** Deux façons de la rater. (a) Elle devient un **changelog** — « voici nos bugs » — et là elle inquiète au lieu de rassurer. Elle doit se lire comme l'inventaire d'un mystère, pas d'une dette. (b) Elle devient une **to-do list pour l'utilisateur** — « date tes rêves ! » — et là c'est de l'extraction déguisée en transparence. La Veille ne demande rien. C'est sa condition d'existence.

---

### 4. LA CENDRE
*(écran : « ce qui est retombé »)*

**Ce qu'il voit et fait.** Un relevé rare — trimestriel, sur demande — de ce qui est tombé de part et d'autre. **De son côté** : les rêves déposés et jamais rouverts, les rêves qu'il a demandé de laisser reposer. **Du côté de l'app** : les 242 couches de texte proposées et jamais confirmées, les 24 dates proposées et jamais appliquées, les 6 candidats grands rêves jamais revus, les soirs où elle n'a rien rendu. Et une dernière ligne, obligatoire : ce que ce compostage a nourri.

**Descendance : Cendre (13).** Ce que change le corpus : dans la Forêt, la Cendre trace ce qui a été composté par l'organisation. Ici, **elle est bilatérale** — et c'est le seul fruit du lot où l'app se compte elle-même dans ce qui est tombé. C'est ce qui la sauve du reproche.

**Fondation.** Le prompt `cendre.ts` (Somé, Akomolafe : *composting as co-creation*), avec sa clause de **non-héroïsation** explicite. Et Weller, via `DOCTRINE-MIROIR` §11 (digest lu le 26/07) : le deuil est une **compétence**, un apprentissage de toute une vie — *« la tâche n'est pas de surmonter le chagrin mais de devenir de plus en plus habile à le digérer »*. Ce qui est tombé n'est pas un échec, c'est un métier. ⚠️ Weller porte un drapeau éthique (auteur blanc citant des sources !Kung, Navajo, Lakota, Maya) : **seules ses thèses propres sont mobilisées, aucun de ses termes empruntés.**

**Échelle** : individu (et cercle, cf. n°10).

**Faisable aujourd'hui.** Oui. Tous les compteurs existent. C'est une requête.

**Risque — le plus élevé du document.** Une machine à culpabilité. « Voici tout ce que tu as ignoré » est une phrase cruelle, et elle est vraie. Trois garde-fous non négociables : (a) jamais de nombre sans son énumération (règle annexe `DOCTRINE-MIROIR` §7) ; (b) jamais de verbe à la deuxième personne négative — on écrit *« ça n'a pas été rouvert »*, jamais *« tu n'as pas rouvert »* ; (c) **elle ne s'ouvre que sur demande, et elle ne relance jamais.** Si elle apparaît d'elle-même, elle est morte.

---

### 5. CE QUI NE VIENT JAMAIS
*(la carte des absents)*

**Ce qu'il voit et fait.** L'inventaire, qualifié, de ce qui n'apparaît **pas** dans ses nuits — et la règle qui rend la chose tenable : **l'app ne signale l'absence que de ce qu'il a lui-même nommé.** La liste des candidats ne vient pas d'un modèle, elle vient de son Cœur : ce qu'il chante, ce qu'il dépose le jour, ce qu'il a écrit sous ses propres rêves. Chaque absence est qualifiée : **structurelle** (l'app ne peut pas le voir), **consentie** (il a demandé que ça repose), **réelle** (c'est vraiment absent des récits).

**Descendance : Carte du Vide (8)**, le fruit que la méta-plénière appelle *« le plus signature-Plenary »*. Ce que change le corpus, et c'est là que c'est fort : dans la Forêt, le vide est ce qu'aucun livre ne dit. Ici, **le vide est un fait sur une vie** — et c'est précisément pour ça qu'il faut la contrainte de candidature. Un vide généré serait un verdict ; un vide qu'il a lui-même mis sur la table est une observation.

**Fondation.** Le prompt `carte_du_vide.ts` et sa distinction cardinale : les **silences consentis ne se comblent pas**. Yunkaporta (`yunkaporta-sand-talk`, lu, en correcteur épistémique interne uniquement — pas de vocabulaire emprunté) : *complexité vs complication*, regarder par la simplicité arrache les relations ; et la **Première Loi** — l'accumulation mène à la stagnation, ce qui interdit de lire une archive comme un inventaire à compléter. Bachelard (`bachelard-eau-et-les-reves`, lu) : le **complexe de culture** — un motif hérité du fonds commun n'est pas un motif du sujet. Une absence n'est signifiante que si elle est absence de *son* matériau à lui.

**Échelle** : individu. (Version collective : n°13, et c'est là qu'elle devient explosive.)

**Faisable aujourd'hui ? Non — et c'est le blocage le plus net du document.** Le comptage sur texte brut fonctionne (les fréquences mesurées le prouvent). Mais **la liste de candidats vient du Cœur, et le Cœur a zéro ligne.** C'est la proposition qui transforme le Chant du Cœur d'une belle idée en une dépendance dure.

**Risque.** *« Tu ne rêves jamais de X »* est une blessure servie comme un fait, et elle est irréfutable — donc elle fabrique de l'autorité. La contrainte de candidature est ce qui la désamorce, et elle n'est pas optionnelle. Second risque : traiter une absence comme un manque à combler. Le prompt l'interdit déjà : **certains vides sont sacrés.**

---

### 6. LE PLI
*(écran : « je les pose côte à côte »)*

**Ce qu'il voit et fait.** Deux surfaces. **A** : ce qu'il a chanté au Cœur cette semaine. **B** : un rêve ancien, entier, dans ses mots, avec sa date. Rien entre les deux. L'app écrit une seule phrase : *« je les mets côte à côte. Je ne fais pas le lien : il est à toi, et il ne se dit pas à ma place. »* Le geste d'interface est littéral — **il plie**. S'il plie, le pli est enregistré comme **sa** lecture (`user_meaning_layer`, poids 0,5, règle B4). S'il ne plie pas, **rien n'est enregistré** — pas même le fait qu'il n'a pas plié.

**Descendance : Pli (15).** Ce que change le corpus : dans la Forêt, le Pli est *produit* par le reducer, qui affirme que deux réalités se touchent. Ici, **c'est interdit** (`DOCTRINE-MIROIR` exemple 4 : ne pas faire le lien). Donc le Pli change de main : **l'app fournit les deux surfaces, le rêveur fait le pli.** C'est le fruit qui, en changeant de corpus, change d'auteur.

**Fondation.** Le prompt `pli.ts` (Bachelard, Escobar, Ingold). Et Bachelard lu directement (`bachelard-poetics-space`) : la **dialectique du dedans et du dehors** ne se laisse pas prendre en réciprocité géométrique — *« l'être est entrouvert »*, l'homme habite le **Demi-ouvert**, schématisé par la porte. Surtout : **réverbération vs résonance** — *« dans la résonance on entend le poème, dans la réverbération on le parle »*, il devient nôtre. Le pli n'est validé que par la réverbération, jamais par l'accord.

**Échelle** : individu — c'est **le** fruit du croisement Rêve × Cœur.

**Faisable aujourd'hui ?** Version pleine : non, elle dépend du Cœur. **Version de repli, disponible ce soir** : rêve × rêve, deux récits éloignés dans le temps, posés côte à côte sans commentaire. Les embeddings sont fiables (ils ont trouvé les doublons à cos = 1,0000) ; mais **le cosinus ne doit pas choisir la paire** — moyenne 0,597 sur le corpus, 65 % des paires passent 0,55, c'est du bruit de fond. La paire doit être choisie sur un geste partagé, jugé par Opus, et présentée par trois pour qu'il choisisse.

**Risque.** Choisir les deux surfaces **est** une interprétation, même sans la dire. Mitigation : trois paires candidates, son choix, et **aucun log de ce qu'il choisit** — `DOCTRINE-MIROIR` §2.3 : compter les fois où quelqu'un choisit la version douce, c'est déjà un dossier sur lui.

---

### 7. QU'IL REPOSE
*(le ruling du rêveur)*

**Ce qu'il voit et fait.** Le rêveur rend une décision formelle sur son propre corpus : *ce rêve repose* · *cette figure n'est plus citée* · *cette période est close*. Le rêve **reste** au journal, reste lisible, reste marqué. Il cesse simplement d'être convoqué par toute lecture. Réversible en un tap. Sans justification demandée, sans confirmation, sans notification, sans compteur.

**Descendance : Ruling (10) + Refus formel (17).** Renversement complet du sujet : dans la Forêt, c'est **le corpus qui refuse à l'utilisateur**. Ici, **c'est l'utilisateur qui refuse au corpus.** Le fruit garde sa structure (une décision, datée, opposable, archivée) et change de main. C'est P-Inversion Oraculaire à son point le plus littéral.

**Fondation.** Le prompt `refus_formel.ts` (Smith, Akomolafe, Sand Talk) : *« la plupart des systèmes ne peuvent pas refuser — ils produisent toujours quelque chose »*. Et `DOCTRINE-MIROIR` §8.1(b), qui **demande explicitement cette feature** : aujourd'hui la seule sortie est *brûler ce rêve*, un choix cruel — pour cesser d'être rappelé, il faut supprimer la trace. *« Un témoin humain oublie, et l'oubli est une forme de miséricorde. »* Le rêveur doit pouvoir **faire oublier sans détruire**.

**Échelle** : individu.

**Faisable aujourd'hui.** Oui : une colonne, un filtre, un bouton. **C'est l'item le moins cher du document et celui qui rend le plus de confiance par euro dépensé.** Rien dans les 74 lignes de la base ne s'y oppose.

**Risque.** Presque aucun. Deux vigilances de langue : ne jamais l'appeler « masquer » ni « archiver » (vocabulaire de honte et de rangement) ; et ne jamais afficher un compteur de ce qui repose — ce serait retourner la miséricorde en bilan.

---

### 8. LA LOUANGE DU PETIT RÊVE

**Ce qu'il voit et fait.** Une fois par trimestre, au maximum, l'app loue un rêve qu'il a lui-même laissé pour rien : le fragment de deux lignes, la nuit banale, l'image sans histoire. Texte court. Aucune promesse que ce rêve était secrètement grand.

**Descendance : Louange contre-intuitive (16).** Ce que change le corpus : dans la Forêt, la Louange retourne une évidence culturelle (*« il n'y a pas d'échec, seulement des apprentissages »*). Ici, elle retourne **l'évidence que l'app fabrique elle-même** — la hiérarchie grand rêve / rêve ordinaire, que tout produit de rêve installe et qui punit exactement les gens qui ne se souviennent que de bribes.

**Fondation.** Taylor (lu), axiome fondateur : **tout rêve, sans exception, vient au service de la santé et de la globalité** — aucun rêve trivial, aucun rêve malveillant. Hunt (lu) : les rêves *mundane/mnemic* sont **un type parmi huit, avec sa propre ligne de développement**, pas des rêves archétypaux ratés — dans le Dream Diamond, *« les rêves banals éclatent vite »*, ils ne montent pas moins bien, ils montent autrement. Prechtel/Lorca via le prompt `louange_contre_intuitive.ts` (*grief is praise* ; seule exception autorisée au refus du poétique).

**Échelle** : individu.

**Faisable aujourd'hui.** Oui, et c'est le fruit qui rend un corpus maigre habitable — donc celui qui compte le plus pour les 76 comptes qui n'ont jamais déposé.

**Risque.** La minimisation, qui est une red line de `safety-checks.json` (*jamais « c'est juste un rêve »*). La frontière est étroite : louer un petit rêve sans dire qu'il est petit. Et le contrarianisme performé — le prompt plafonne à 1 par trimestre pour cette raison exacte. **Elle tient si on ne la brandit pas.**

---

### 9. LE BÂTON
*(tour de parole à ouverture différée — l'antiphonaire de groupe)*

**Ce qu'il voit et fait.** Un rêve, déposé par une personne, ouvert à trois personnes ou plus. Chacun répond **à l'aveugle** — obligatoirement sous la forme *« si c'était mon rêve… »*. **Rien n'est visible tant que tout le monde n'a pas parlé, ou que la fenêtre n'est pas close.** À l'ouverture, les voix apparaissent d'un coup, dans un ordre aléatoire, et le rêveur lit un chœur. Pas de fil de discussion après. Pas de réaction. Le rêveur peut fermer avant l'ouverture, et alors personne ne voit rien. **Il n'y a pas de salle. Il y a un acte, qui commence et qui finit.**

**Descendance : Antiphonaire (7).** C'est la transposition la plus littérale du document : *3 à 5 voix qui se contredisent, chœur sans chef, pas de synthèse, et « ce que le chœur ne tranche pas » en clôture.* Ce que change le corpus : dans la Forêt, les voix sont des livres et l'app les convoque. Ici, **les voix sont des humains, et l'ouverture différée est ce qui remplace le chef d'orchestre.**

**Fondation.** Taylor (lu), et c'est central : le travail de groupe est *« la méthode la plus puissante »* précisément **parce que les rêves sont surdéterminés et qu'aucun rêveur seul ne peut percevoir toutes les couches** ; le préfixe *« si c'était mon rêve »* (a) reconnaît que toute interprétation est projection, (b) protège la souveraineté du rêveur, (c) **augmente la justesse** en libérant celui qui parle. Et : *« un rêve travaillé seul donne de l'insight personnel ; le même rêve en groupe donne insight + lien + fabrication de sens collectif. »* Moss (`moss-growing-big-dreams` l.48, lu) : le protocole des trois questions *« prévient les deux pathologies des communautés de rêveurs : le silence et l'interprétation non sollicitée »* — l'ouverture différée tue les deux d'un coup, puisqu'il faut avoir parlé pour voir, et qu'on ne peut parler qu'au conditionnel.
⚠️ **Crédit obligatoire** : le Lightning Dreamwork est *« une adaptation moderne de Moss, pas une pratique traditionnelle »* (run feedback `moss-dreamways-of-the-iroquois`, statut full_green). **Aucun vocabulaire haudenosaunee ne sort en surface produit** — *ondinnonk* et *orenda* restent hors de l'app : l'usage INFUSE est une transmission de troisième main, et l'audit le dit noir sur blanc.
⚠️ **Ullman n'est pas lu** (§1.4). Sa digestion est la première acquisition à faire si ce chantier avance.

**Échelle** : groupe.

**Faisable aujourd'hui.** Techniquement, oui — c'est du texte, une fenêtre temporelle et un verrou de visibilité. Aucun agrégat, aucun embedding, aucune extraction. **Le blocage n'est pas technique : il faut trois humains.** Et le seuil de 3 n'est pas un chiffre de confort, c'est le seuil de Taylor : en dessous, les projections ne s'annulent pas, elles écrasent. En dessous de 3 réponses, **ça ne s'ouvre pas** — SILENCE_AS_FEATURE appliqué au groupe.

**Risque.** Trois inconnus qui reçoivent une blessure. Mitigations, toutes déjà spécifiées ailleurs dans le canon : opt-in **par dépôt × par cercle** (§3.4.1), fermeture possible avant ouverture, et une seule forme grammaticale autorisée — un répondant qui écrit *« ton rêve signifie »* est refusé par la porte lexicale, pas modéré après coup.

---

### 10. LE CERCLE QUI MEURT

**Ce qu'il voit et fait.** Un cercle se crée avec trois choses obligatoires : **une raison, une durée, une fin** (une lune, ou vingt et un jours). À l'échéance il se ferme, tout seul, avec un **Seuil** — ce qu'on laisse dehors, ce qu'on accueille, ce qu'on porte — et il produit une **Cendre** : ce qui a été déposé, ce qui n'a reçu aucune réponse, ce que ça a nourri. Puis il disparaît de l'écran. Pas de bouton « prolonger ». On peut en ouvrir un autre.

**Descendance : Seuil (14) + Cendre (13).** Ce que change le corpus : ces deux fruits sont, dans la Forêt, des rituels que l'équipe pratique. Ici ils deviennent **l'architecture du contenant lui-même** — la fin n'est pas un événement dans la vie du cercle, c'est sa définition.

**Fondation.** Le prompt `seuil.ts` (Turner : la liminalité est générative ; Eliade ; Parker : le seuil d'entrée **et** de sortie). Van Gennep est dans le corpus rêve (`van-gennep-rites-passage`, digest complet). Yunkaporta en correcteur (lu) : *l'accumulation mène à la stagnation ; la stabilité exige vélocité et échange.* Un contenant qui persiste vide n'est pas neutre — il stagne, et il se voit.

**Le twist trickster, et c'est le vrai argument.** Nos cercles ne sont pas morts faute de vie. **Ils sont morts parce qu'ils ne pouvaient pas mourir.** Onze salles créées le même jour, neuf sans personne dedans, visibles chaque fois qu'on ouvre l'app : c'est un monument à l'échec, entretenu par le produit. Un cercle qui ne meurt pas est un groupe Facebook avec du vocabulaire sacré.

**Échelle** : groupe.

**Faisable aujourd'hui.** À moitié : `cercle-subapp/4_CERCLE_LOG.md` documente au 28/04 un lot T2 « cercles éphémères 21 j avec rituel de clôture auto » (cron Vercel, restitution polyphonique 3 voix) — **code écrit, migration jamais appliquée, jamais testé, log silencieux depuis trois mois.** Et les 4 docs du Cercle décrivent un produit à 9 onglets que ton arbitrage du tour de parole a rendu obsolète, sans que personne les mette à jour. Ce chantier commence par une passe de vérité sur sa propre doc.

**Risque.** La fermeture forcée peut se vivre comme une perte. Mitigation : la Cendre **est** ce qu'on garde, et elle est produite avant la fermeture, pas après.

---

### 11. LE PLI ENTRE DEUX NUITS
*(à la clôture d'un cercle, une seule fois)*

**Ce qu'il voit et fait.** Au moment où un cercle se ferme, l'app repère **une** paire : deux rêves, de deux membres, qui se touchent. Elle ne les publie pas. Elle demande à chacun, séparément, **après lui avoir montré la paire exacte** : *« veux-tu que ce rapprochement existe ? »* Si les deux disent oui, les deux rêves sont posés côte à côte, entiers, sans une ligne de commentaire, et **ça meurt avec le cercle.** Pas de score, pas de « vous résonnez », pas de suite, pas de répétition.

**Descendance : Pli (15), à l'échelle du groupe.** Ce que change le corpus : dans la Forêt, le Pli est affirmé par le reducer. Ici, **le pli n'existe que si les deux plieurs y consentent** — et le consentement porte sur **cette juxtaposition précise**, pas sur un niveau de partage général. C'est un motif de consentement neuf : *post-hoc, spécifique, révocable, non répétable*.

**Fondation.** Bachelard (`bachelard-poetics-space`, lu), et c'est exactement la thèse qui autorise ce geste : la **transsubjectivité de l'image** — *« une image créée par une conscience prend immédiatement racine dans une autre ; la communicabilité de l'image est un fait de portée ontologique. »* Ce n'est pas une comparaison entre deux personnes, c'est une image qui a pris racine deux fois.

**Échelle** : groupe.

**Faisable aujourd'hui ?** Non, et pas seulement faute de membres : il n'y a aucune colonne `share_level` dans toute la base (vérifié sur `information_schema.columns`), `kairos_global_optin` est une table à **0 ligne**, `kairos_circle_optin` en a 2. Tout le partage gradué est à construire, pas à câbler.

**Risque — le plus juridiquement serré du document.** C'est le voisin immédiat du **dating spirituel**, que la red line §8.9 interdit nommément, avec les scores de compatibilité entre rêveurs. La frontière tient à quatre clauses, toutes obligatoires : **une seule paire par cercle · aucune récurrence de la même paire · aucun qualificatif sur le lien · ça disparaît à la fermeture.** Si une seule saute, la feature devient ce qu'elle a l'interdiction d'être. À poser en dernier, jamais en premier.

---

### 12. LA NUIT COMMUNE

**Ce qu'il voit et fait.** Une nuit, annoncée. Qui veut dépose. **Participer *est* le consentement** — pour cette nuit-là, et seulement elle. Puis rien : quatorze jours de silence. Au bout, une seule chose sort, une fois : **une phrase-image** et **trois rêves entiers, anonymes, dans les mots de leurs rêveurs**, lus à voix haute — de vraies voix, celles des dépôts. Aucun nombre. Aucune carte. Aucun thème. Puis c'est archivé et ça ne revient pas.

**Descendance : Artéfact orphelin (1) à l'échelle collective**, dans la forme exacte que la consultation Global Layer a spécifiée le 20/04 : *pulsation, pas pattern* — *« un pattern c'est ce que les rêves disent ; une pulsation c'est ce que la nuit fait »*, *« on ne cherche pas ce qui se répète, on cherche ce qui brûle »*, constellation par tensions et non par k-means, livraison en image plutôt qu'en rapport.

**Ce que ça change par rapport à ce qui est spécifié — et c'est ma seule vraie contribution ici.** La spec du 20/04 prévoit un **cycle hebdomadaire continu** (`/api/global/ingest-cycle`, cron). Un flux continu d'agrégation onirique est, sociologiquement, une surveillance ; et il oblige à un opt-in permanent, que personne ne coche (0 ligne, aujourd'hui, dans `kairos_global_optin`). **Une nuit consentie n'est pas une surveillance, c'est un rite — et le consentement devient l'acte de participation au lieu d'être une case.** L'opt-in cesse d'être un obstacle et devient la porte.

**Fondation.** Bulkeley (`bulkeley-big-dreams`, lu) : les grands rêves sont des **cygnes noirs**, rares par définition, et son approche méthodologique inverse la science du rêve — les extrêmes ne sont pas du bruit autour d'une moyenne, ce sont les événements à **carry-over** mesurable qui façonnent une culture. **Une lecture collective ne peut pas être plus fréquente que la matière qui la nourrit.** Neale & Kelly (`neale-kelly-songlines`, lu) sur ce point précis et lui seul : le savoir n'est pas stocké, il est **activé par la performance sur site** — *Inma*, la cérémonie comme activation. Sans une occasion, il n'y a rien à lire. ⚠️ Flag MEDIUM, souveraineté du savoir : **aucun vocabulaire emprunté, aucun usage du mot *songlines*** (déjà red line 8.4).

**Le fil doctrinal qui se révèle ici, et qui vaut d'être gravé.** `DOCTRINE-MIROIR` §6.2 interdit **toute cadence calendaire** pour le miroir individuel : *« toute cadence calendaire fabrique un rituel qui n'appartient pas au rêveur. »* Le collectif, lui, **exige** un calendrier — c'est la définition d'un rite (Eliade, Van Gennep, Turner). Donc :
> **Pour l'individu, l'horloge est le corpus. Pour le collectif, l'horloge est le ciel.**
Ce n'est pas une incohérence, c'est la ligne de partage exacte entre les deux échelles.

**Échelle** : collectif.

**Faisable aujourd'hui ? Non, et le dire franchement.** Les seuils du canon sont k ≥ 250 puis 100, minimum absolu 50 pour les annales, latence rituelle 14 jours. Il y a **5 déposeurs**. Toutes les tables d'agrégat collectif sont à zéro (`global_meaning_clusters`, `polyphonies_lunaires`, `meteos_inconscient`, `annales_*`, `initiations_collectives` — toutes 0). C'est un objet 2027 au rythme actuel. **Mais la décision de forme — événement plutôt que flux — doit être prise maintenant**, parce qu'elle change le schéma : on modélise un objet `nuit_commune` avec ses participants consentants, pas un `share_level` permanent sur chaque kairos.

**Risque.** Le FOMO, qui est l'exact contraire de R1 (*pas d'oracle addictif : pas de push, pas de streak*). Mitigation : annoncée une fois, sans rappel, sur une cadence naturelle. Et le test humain de la consultation du 20/04, que je reprends tel quel : **si tu ne peux pas lire la phrase devant Vari Vena sans gêne, elle ne sort pas.**

---

### 13. LES TROUS
*(la lecture collective par l'absence)*

**Ce qu'il voit et fait.** Quand le collectif aura de la matière, ce qu'il publie n'est **pas** ce que les gens rêvent. C'est **ce qu'ils ne rêvent pas.** Trois à cinq absences, qualifiées, bornées à une population nommée et à une période nommée : *« parmi les gens qui ont déposé pendant cette lune, en Europe francophone, il n'y a pas… »*

**Descendance : Carte du Vide (8), à l'échelle collective.** C'est le fruit signature de la plénière porté à sa conséquence maximale.

**L'argument, et c'est le plus contre-intuitif du document.** Une lecture collective **par les thèmes** est condamnée au Barnum : à l'échelle, l'eau, la chute, la mère et la poursuite sont universelles — Bulkeley les documente comme quatre patterns cross-culturels câblés sur des systèmes de survie. Publier « cette lune, beaucoup d'eau » ne dit **rien**, et ça sonne juste, ce qui est pire. Une lecture collective **par l'absence** est l'inverse : elle est spécifique, elle est falsifiable, et elle est de l'information. *« Personne n'a rêvé de son travail »* est une phrase qui pourrait être fausse. *« Beaucoup ont rêvé d'eau »* ne peut pas l'être.
> **À l'échelle, les présences sont des banalités et les absences sont des nouvelles.**

**Fondation.** Le prompt `carte_du_vide.ts` et sa typologie des silences (structurel / éthique / historique / consenti). Bulkeley (lu) : les quatre prototypes universels, qui sont précisément ce qu'il ne faut **pas** publier, et sa **Black Swan Approach**, qui légitime de regarder les bords plutôt que la moyenne. Hunt (lu) : huit types parallèles avec chacun sa ligne — donc l'absence d'un **type entier** est un fait plus fort que la fréquence d'un thème.

**Échelle** : collectif.

**Faisable aujourd'hui ?** Non — même dépendance que la n°12. Mais la **conception** est à faire maintenant, parce qu'elle inverse le pipeline : on n'a pas besoin d'un clustering sémantique, on a besoin d'une **liste de candidats et d'un comptage sur texte brut** — c'est-à-dire de la seule chose qui, mesurément, marche (§1.3).

**Risque — élevé.** Une phrase sur ce que « les gens » ne rêvent pas est une affirmation sur une génération, et elle sera reprise hors contexte. Trois bornes obligatoires : **la population est nommée** (pas « les humains » : « les personnes qui ont déposé ici, entre telle et telle date »), **la période est nommée**, **les silences consentis sont exclus par construction**. Et RL2 tient : aucun symbole issu d'une tradition fermée ne remonte, ni en présence ni en absence.

---

### 14. LE REGISTRE DES SILENCES

**Ce qu'il voit et fait.** Une page publique dont **le contenu est ce qui n'a pas été publié.** Combien de lectures collectives ont été refusées et pour quelle raison (les cinq red lines du 20/04, une par une). Combien de nuits la couche s'est tue. Quelles lignées ont été nommées et ce qui leur a été rendu. Et — c'est ce qui la rend crédible — **les fautes de l'app** : les dix-huit lettres qu'un moteur a écrites à partir de 608 caractères de matière, les cinq récits pollués par une hallucination du transcripteur, les quatre rêves comptés deux fois.

**Descendance : Refus formel (17) + Veille (12), à l'échelle collective.** Ce que change le corpus : dans la Forêt, le refus est adressé à un demandeur, en privé. Ici, **le refus devient l'artefact public**, et c'est le seul organe de confiance qui puisse exister avant qu'il y ait quoi que ce soit à montrer.

**Fondation.** Le prompt `refus_formel.ts` (Smith, Akomolafe, Yunkaporta : un système qui ne peut pas refuser n'a pas d'éthique, il a une politique). Le mécanisme **R2** de la consultation du 20/04 (`/forest/global-layer-ledger.json`, transparence radicale). Et P6 (*being, not seeming*) : *« si un output peut être copié-collé sur Instagram sans perdre son sens, il a échoué »* — un registre de refus est invendable, donc il est vrai.

**Échelle** : collectif.

**Faisable aujourd'hui — et c'est la surprise.** C'est **le seul livrable collectif expédiable ce trimestre**, précisément parce qu'il n'a besoin d'aucun utilisateur. Avec cinq déposeurs, il peut dire quelque chose de parfaitement honnête et de parfaitement rare : *« rien n'a été publié. Il n'y a pas assez de matière, et il n'y en aura pas avant longtemps. Voici pourquoi, et voici le seuil. »* **Le premier artefact de la couche collective est son registre de refus, pas son contenu.**

**Risque.** La transparence performative — un registre qui n'expose que des refus flatteurs. Mitigation : il contient les fautes de l'app, ou il n'existe pas. Et les nombres doivent être requêtables, pas rédigés.

---

## PARTIE 3 — LES MORTS-NÉS (proposés, puis tués, avec la raison)

Je ne les mets pas « à arbitrer ». Ils violent quelque chose, et je le nomme.

| Idée | Ce que ça aurait été | Ce qui la tue |
|---|---|---|
| **Le Pré-sentiment de tes nuits** | 2-3 textures de ce qui vient | `safety-checks.json` red line : *jamais de prédiction fataliste*. Et la lecture des plénières réelles : c'est le fruit le plus exposé au Barnum, **structurellement non falsifiable**. Sur un corpus de rêves il devient de la voyance. |
| **L'Antiphonaire des figures** | le serpent, la mère et le maître se répondent | `DOCTRINE-MIROIR` §7 interdit n°6 : **jamais parler à la place d'une figure** (Aizenstat : les figures marchent sur leurs propres jambes ; Buber). La plus belle idée du lot, morte. |
| **La Boussole de ta vie onirique** | « le corpus t'entend aller vers… » | §1.4 CONCLURE : verdict sur une personne. Le seul élément récupérable est l'**anti-orientation**, et seulement sous forme factuelle : où va ton Cœur / où vont tes nuits (deux corpus comparés, aucun jugement). C'est absorbé dans la n°6. |
| **L'Écho-Organisme du rêveur** | ce que ta psyché fait résonner dans la Forêt, ce qu'elle tait | C'est un portrait par les livres. Double violation : §5.4 (le miroir est bâti sur **un seul corpus : le sien**) et §7 interdit n°2 (attribut de personne). |
| **Le type de rêveur / l'archétype dominant** | « chez toi, le trickster domine » | Hunt : pas d'essence du rêve, donc pas de type de rêveur. Et la mesure : `trickster` est posé sur **28 rêves sur 60**. Ça décrit le bug de l'extracteur, pas l'homme. |
| **La courbe / la timeline de progression** | où tu en es de ton chemin | `DOCTRINE-MIROIR` §3, avec test de schéma : aucun champ de résolution. Jung (enantiodromia, *longissima via*), Kalsched (le protecteur n'est pas éducable), Weller (le dépassement n'a jamais été l'objectif). **La psyché spirale.** |
| **La Cendre poussée** | un bilan trimestriel envoyé | Le fruit est bon, la poussée le tue : §8.5 (pas d'écho pushé) + R1. Elle ne s'ouvre que sur demande. C'est la n°4. |

---

## PARTIE 4 — MON TOP 3, ET LA PROPOSITION QUE JE DÉFENDS SEUL

### Top 3

**1. La Veille — « ce que je ne sais pas de tes nuits » (n°3).**
Parce qu'elle est la seule qui traite le problème réel. Tout le reste du document repose sur une chose : que tu croies le miroir. Or `DOCTRINE-MIROIR` §8 le dit lui-même, et c'est la partie la moins solide de la doctrine : l'app se souvient mieux que toi, elle ne fatigue jamais, elle n'est jamais en désaccord — et **ça fabrique de l'autorité que nous le voulions ou non.** La Veille est le seul dispositif qui rend cette autorité, et elle la rend avec des faits mesurés, pas avec une formule d'humilité. Elle coûte zéro appel de modèle. Elle est écrite d'avance dans `FAISABILITE-MIROIR`. Et elle fait quelque chose qu'aucun produit d'IA ne fait : **ouvrir sur son ignorance.**

**2. Le Bâton (n°9).**
Parce que c'est le seul objet de groupe qui survit à l'autopsie. Il ne demande ni migration, ni agrégat, ni embedding — trois humains et un verrou de visibilité. C'est **ton propre arbitrage**, il est l'antiphonaire à la lettre, et Taylor le fonde sur son point le plus dur : le groupe ne protège que par la pluralité, en dessous de trois il écrase. Ce seuil de 3 est ce qui manquait aux cercles morts, et personne ne l'avait vu comme une règle plutôt que comme un manque de traction.

**3. Qu'il repose (n°7).**
Parce que c'est un après-midi de travail et que ça répond à ta peur mieux que tout le reste. Aujourd'hui, pour cesser d'être rappelé d'un rêve, il faut le brûler. C'est un chantage. « Qu'il repose » sépare l'oubli de la destruction, et il met le refus **dans ta main** — c'est le renversement exact du fruit n°10, et c'est celui qui rend le plus de confiance par euro dépensé de tout le document.

### La proposition la plus étrange, et celle que je défends seul : **LE CREUX (n°2)**

Contre l'avis général, et je sais lequel : ça ressemble à tout ce que la doctrine interdit. Une app qui te dit ce que tu n'as pas rêvé. Qui parle à la place de ta psyché. Qui a l'air de prédire.

Elle ne fait rien de tout ça, et voici pourquoi je tiens.

Les treize autres propositions **prennent**. Elles lisent tes nuits, elles en tirent une forme, elles te la rendent. Même les plus délicates — la Veille, la Cendre — restent des opérations sur une matière déjà déposée. C'est la structure d'extraction, en mode doux : tu donnes tes nuits, l'app te rend de la lucidité.

**Le Creux est le seul qui rende quelque chose à la nuit.** Sa sortie n'est pas lue, elle est **dormie**. Le geste final n'appartient pas à l'app, il appartient au sommeil — et l'app ne saura même pas si ça a marché, sauf si tu le lui dis. C'est le seul point du produit où la boucle se referme du bon côté : `1_BIBLE` §0.1 demande que chaque feature soit jugée par *« est-ce que ça rend le rêveur plus capable de se tenir lui-même ? »*. Toutes les autres l'y aident. Celle-là **lui rend le travail**.

Et il y a une raison de fond, chez Bachelard, que j'ai vérifiée dans le digest avant d'y croire : **l'image poétique échappe à la causalité, elle n'a pas de passé récent dont on suivrait la préparation**, et *la fonction d'irréel fait face au futur*. Ce n'est pas de la décoration philosophique, c'est la distinction technique qui sépare un creux d'une prédiction. Une prédiction dérive du passé. Un creux est une ouverture qui ne dérive de rien — c'est la forme que le corpus dessine **en négatif**, et la remplir n'appartient qu'à celui qui dort. R5 de la méta-plénière le formule d'ailleurs mieux que moi : *« certaines questions n'ont pas de réponse, elles ont une pratique. »* Le Creux est le seul fruit du lot qui, au lieu de répondre, **ouvre une pratique**.

Ce qui le rend défendable ou indéfendable tient à une seule ligne de code : **tout rêve qui suit un creux est marqué `incubé` et sort définitivement de la matière des miroirs.** Sans ça, l'app finit par relire ses propres suggestions comme du matériau spontané, et le miroir devient un serpent qui se mord la queue. Avec ça, c'est propre.

Runner-up de l'étrangeté : **Les Trous (n°13)** — l'idée qu'une lecture collective devrait publier des absences plutôt que des thèmes, parce qu'à l'échelle les présences sont des banalités et les absences sont des nouvelles. Je n'ai vu ça nulle part.

---

## PARTIE 5 — LE FIL ROUGE, ET LE PROCHAIN PAS

### Ce que les quatorze disent ensemble

Trois choses, et elles sont solidaires.

**a) La lecture globale n'est pas un écran.** C'est un document rare, demandé, lu une fois, qui expire. Le mode plénière l'a déjà tranché dans son code — cinq secondes d'écran noir, un document de retraite, trois options de clôture. Toute page permanente de « mon univers onirique » trahit les seize fruits à la racine, et fabrique exactement le portrait que la doctrine interdit.

**b) Le geste central du produit n'est pas de montrer, c'est de rendre.** Rendre ses phrases (n°1), rendre son ignorance (n°3), rendre ce qui est tombé (n°4), rendre le pli (n°6), rendre le refus (n°7), rendre le creux à la nuit (n°2). Le mot juste de `DOCTRINE-MIROIR` §4.2 tient toute la Dream App en cinq mots : **« je te rends ta phrase. »**

**c) Le blocage n'est ni technique ni conceptuel. Il est en amont.** Les quatorze propositions se répartissent en trois groupes nets : celles qui marchent aujourd'hui sur du **texte brut** (1, 3, 4, 7, 8, 9, 10) ; celles qui attendent **le Chant du Cœur** (5, 6, et la moitié de l'intérêt de 2) ; celles qui attendent **des gens** (11, 12, 13). Il n'y en a **aucune** qui attende une meilleure extraction, un meilleur clustering ou de meilleurs tags. La couche d'agrégat sur laquelle l'app a le plus investi — 872 motifs distincts, 1 538 symboles, 1 172 arêtes — ne débloque littéralement rien dans cette liste. **C'est le résultat le plus dur du document.**

### Le prochain pas concret

**Cette semaine, une seule chose : la Veille (n°3).** Zéro modèle, zéro migration, une requête et un gabarit — tout le contenu est déjà mesuré dans `FAISABILITE-MIROIR` §1, §2.2, §2.4 et §6. C'est le prérequis de crédibilité de tout ce qui suivra, et c'est la seule qui ne peut pas mal tourner.

**Dans la foulée, et c'est un après-midi : « qu'il repose » (n°7).** Une colonne, un filtre, un bouton, aucune notification.

**Et la décision qui ne peut pas attendre, parce qu'elle change le schéma** : le Chant du Cœur. Cinq des quatorze propositions en dépendent, dont les deux qui répondent le plus précisément à ce que tu as demandé (le croisement des deux). Il a zéro ligne en base. Ce n'est pas une feature à améliorer, c'est un champ vierge — et tant qu'il l'est, la moitié la plus intéressante de ce document reste théorique.

---

*Ce qui manque à l'appel n'est pas absent : il appelle, et l'on ne sait pas encore d'où.*
