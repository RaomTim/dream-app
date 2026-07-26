# FAISABILITÉ — le miroir de la psyché

> **Agent E2** (Opus) · 2026-07-26 · lecture seule sur la base, aucune écriture, aucune table de travail créée.
> Mandat : est-ce que le miroir est **possible aujourd'hui, avec les données réelles** ? Pas le concevoir — savoir de quoi il serait fait.
> Corpus mesuré : `gestion@infuse.earth`, user_id `342cf663…c998b9`. Les 64 rêves ont été **lus intégralement**, pas résumés.

---

## VERDICT EN TROIS LIGNES

**Le miroir est possible — mais pas celui que Tim a décrit.** La moitié de ce qu'il veut y mettre n'existe pas en base : les messages du cœur (0 ligne), le journal de vie (**1 ligne dans toute la base, 29 caractères**), les motifs récurrents (**table vide, tous utilisateurs confondus**), ses interprétations gardées (1). Ce qui existe et qui est riche, c'est **le texte brut des rêves** — et il est excellent.

**La conclusion contre-intuitive : la couche d'extraction sur laquelle l'app compte est moins fiable que les récits eux-mêmes.** J'ai la preuve qu'elle invente (§2.2). Le portrait qui touche juste est celui qui **lit les rêves** ; les deux qui s'appuient sur les agrégats produisent de l'horoscope.

**Et la machine à portrait existe déjà, elle a tourné 18 fois, et elle démontre exactement le danger** : 18 lettres lyriques de ~1 900 signes, générées à partir de **608 caractères** de matière réelle (§5.1). C'est le pire résultat possible et il est déjà en production.

---

## §1 — LE MATÉRIAU RÉEL

Tout est compté, rien n'est repris d'un rapport précédent.

### 1.1 Le corpus lui-même

| Fait | Mesure |
|---|---|
| Lignes `kairos` | **64** |
| Textes **distincts** (md5) | **60** — 4 doublons octet pour octet |
| Quasi-doublons (cos ≥ 0.92) | **2 paires de plus** → ~58 nuits distinctes |
| Dont : non-rêves | placeholder `[Rituel pré-sommeil] — en cours` (×2), note « j'ai vu un oiseau » (78 c.), 2 notes de veille (packagings, message quotidien aux employés) |
| **Récits de rêve réels** | **≈ 54** |
| Volume distinct | 187 181 caractères ≈ **52 000 tokens** |
| Longueur moyenne | 3 120 c. (min 31, max 10 895) |

Les 4 doublons exacts : *Zoé la déesse* = *L'archive secrète de mes nuits futures* (10 895 c.), *Les créatures de l'entente nocturne* = *Les créatures du dialogue et de la lumière* (3 607 c.), *Les eaux thermales du dix-huit* = *Les Eaux Chaudes du Dix-Huit* (2 537 c.), *Les jardins oubliés* = *Les portes du silence* (31 c.). **Ils ont chacun reçu deux titres différents, deux extractions différentes, et comptent deux fois partout.**

### 1.2 Chaque source, comptée

| Source | Lignes (Tim) | Couverture | Fiabilité | Ce qu'elle peut porter dans un portrait |
|---|---|---|---|---|
| `kairos.raw_text` | 64 / 60 distincts | 100 % | **Haute** — c'est sa voix | **Tout.** C'est le seul matériau de premier ordre |
| `recit_only_text` | 59 | 92 % | Bonne (142 751 c.) | Alternative propre au brut, −24 % de volume |
| `lecture_text` | 49 | 77 % | Non vérifiée | Complément |
| `numinosity_score` | 64 > 0 | 100 % | **Faible** — corrèle **0.615** avec log(longueur) | **Ne pas s'en servir comme sélecteur.** Mesure surtout combien Tim a parlé |
| `motif_tags` | 64 | 100 % | **Faible** — non normalisé, confabule (§2.2) | Recherche floue, jamais du comptage |
| `life_themes` | 64 | 100 % | **Très faible** — 2 thèmes seulement se répètent sur tout le corpus | Presque rien |
| `archetypal_tags` | 61 | 95 % | **Faible** — `trickster` sur 28/60 rêves | Rien de discriminant |
| `dream_ego_stance` | 63 | 98 % | Inexploitable — **59 valeurs distinctes sur 60 rêves** | Rien (agrégation impossible) |
| `affective_valence` / `intensity` | 64 | 100 % | Moyenne | Climat général, grain trop gros |
| 4 embeddings | 64 / 64 / 60 / 62 | 94-100 % | **Haute** | Rappel, détection de doublons (a marché : 4 dups trouvés) |
| `personal_dictionary_symbols` | **1 485** | — | **Trompeuse** (§2.3) | Seulement `sensation` et `figure` |
| `kairos_edges` | **1 169** | — | Non validée par un humain | Rappel candidat, pas une affirmation |
| `kairos_text_layers` | 242 | — | OK | Support |
| `synthesis_text` | 12 | **19 %** | — | Trop peu |
| `kairos_interpretations` | **1** (2 en base) | **1,6 %** | — | Rien |
| `user_meaning_layer` | **4** — toutes dérivées de cette unique interprétation, le 12/07 | — | Haute mais minuscule | 4 symboles |
| `marked_great` / `user_marked_numinous` | **2** | 3 % | Haute | 2 points d'ancrage |
| `protocol_completed_at` | 1 | 1,6 % | — | Rien |
| `recurring_dream_patterns` | **0** | **0 %** | — | **Rien. La table est vide pour tous les utilisateurs.** |
| `life_journal_entries` | **0** | **0 %** | — | **Rien** (1 seule ligne dans toute la base, chez un autre compte) |
| `resonance_feedback` | 0 | 0 % | — | Rien |
| `kairos_user_annotations` | 0 | 0 % | — | Rien |
| `soul_seasons` | 0 | 0 % | — | Rien |
| `great_dream_candidates` | 0 (toutes personnes) | — | — | Le détecteur B3 n'a jamais écrit |
| `portrait_readings` | **0 pour Tim** (18 pour 1 autre compte) | 0 % | Voir §5.1 | — |

---

## §2 — LES TROUS, NOMMÉS

### 2.1 Ce que Tim veut y mettre et qui n'existe pas

| Ce qu'il a demandé | État réel |
|---|---|
| « pondéré par ce que je traverse en ce moment » | `life_journal_entries` = **0**. `kairos_type='note_jour'` = **0**. L'écran Cœur n'a jamais servi |
| « l'interprétation que je se donne » | **1** interprétation gardée, le 12/07/2026 → 4 entrées de sens |
| « surtout mes grands rêves » | **2** marqués — dont un posé aujourd'hui à 18h51 (facette `force`), l'autre le 12/06 (facette `change`) |
| « et ceux qui reviennent » | `recurring_dream_patterns` : **table vide**. Aucun motif récurrent n'a jamais été calculé, pour personne |
| « ce qui est encore vrai, ce qui a changé » | 42 rêves sur 64 sont datés « inconnu » (§6) |

**Le portrait d'aujourd'hui ne peut se faire que d'une chose : le texte brut des 54 récits.** Tout le reste est décoratif ou vide.

### 2.2 🔴 La preuve que l'extraction invente

Deux lignes de `kairos` contiennent **exactement la même chaîne de 31 caractères** — un placeholder d'interface, pas un rêve :

```
[Rituel pré-sommeil] — en cours
```

Voici ce que l'extraction a produit, **deux fois, sur cette entrée identique** :

| | ligne A | ligne B |
|---|---|---|
| titre | « Les jardins oubliés du sommeil » | « Les portes du silence s'entrouvrent » |
| `motif_tags` | soif · rituel_pre_sommeil · incubation · seuil · descente | soif · seuil · éveil · descente · rituel · **conscience · guérison · gratitude · révolte · fuite du corps** |
| `life_themes` | soif intarissable · seuil à franchir · **voix intérieure vs attente extérieure** | soif non étanchée · seuil à franchir · **fuite ou réveil** |
| `numinosity_score` | 0.33 | 0.35 |

**Entrée identique, sorties divergentes.** 10 motifs tirés de 31 caractères dont aucun ne figure dans le texte. « Guérison », « gratitude », « révolte », « fuite du corps » sont inventés de toutes pièces, et ils sont en base au même titre que les motifs des vrais rêves.

Conséquence directe : **tout portrait qui compte des `motif_tags` ou des `life_themes` compte partiellement du bruit généré.** Ce n'est pas un défaut de couverture, c'est un défaut de véracité — et il est invisible tant qu'on ne regarde pas le texte source.

Deux autres pollutions du même ordre, trouvées à la lecture :
- **Artefact Whisper** : `Sous-titres réalisés par la communauté d'Amara.org` et `Abonnez-vous ! ❤️ par SousTitreur.com` terminent au moins 5 récits. C'est une hallucination du modèle de transcription, stockée comme contenu de rêve.
- **Deux notes de veille traitées en rêves** : « Clarté matinale et packagings créatifs » (une to-do list sur les étiquettes) et « L'essence quotidienne partagée avec les miens » (un plan de communication interne) ont reçu motifs, archétypes et thèmes de vie.

### 2.3 🔴 Le dictionnaire personnel est un mur de hapax

1 485 lignes — le chiffre impressionne. Le détail le détruit :

| type | lignes | dont ≥ 2 occurrences | dont ≥ 3 | dont ≥ 5 | max |
|---|---|---|---|---|---|
| motif | **843** | 35 (4 %) | 5 | **0** | 4 |
| figure | 248 | 26 | 7 | 1 | 15 |
| theme | 176 | 4 | 2 | 2 | 8 |
| **sensation** | 94 | 20 | 10 | **5** | **23** |
| dream_ego | 63 | **0** | 0 | 0 | 1 |
| lieu | 61 | **0** | 0 | 0 | 1 |

**808 motifs sur 843 n'apparaissent qu'une fois. Aucun motif n'atteint 5 occurrences. Les 61 lieux et les 63 postures sont tous uniques.** Un dictionnaire dont chaque entrée est un hapax n'est pas un dictionnaire, c'est un index.

De plus il n'est pas normalisé : `poitrine` (23) / `zone poitrine` (2) / `gorge-poitrine` (2) / `zone thorax` (3) sont quatre entrées pour une zone ; `corps entier` (21) / `corps global` (8) / `zone corps entier` (2) / `corps-entier` (2) / `corps général` (2) en font cinq pour une autre. Et `evolution_summary`, `paper_angle`, `stone_angle`, `silk_angle` sont **vides à 100 %**.

**Seule la couche `sensation` est exploitable** — c'est la plus petite (94 lignes) et la seule qui porte une vraie récurrence : poitrine 23×, corps entier 21×, gorge 16×, ventre 11×.

### 2.4 Ce que Tim sait de lui et que la base ignore

Dans *La chute du ballon*, Tim dit lui-même : « je suis tombé dans un trou avec plein de serpents […] **La dernière fois, un truc comme ça. Par les serpents.** » Il constate une récurrence. **Le mot « serpent » apparaît dans 1 rêve sur 60 du corpus.** Sa mémoire de rêveur porte des séries dont l'app n'a qu'un maillon. C'est structurel : le corpus commence en mars 2024, sa vie de rêve non.

---

## §3 — LES TROIS PORTRAITS

Écrits pour de vrai, depuis les données. À lire dans l'ordre : l'écart entre eux est le résultat.

---

### ▸ PORTRAIT (a) — depuis les 6 candidats « grand rêve » de B3, et rien d'autre

> **(a1)** Dans les six rêves que la détection a fait remonter, il n'y en a pas un seul où tu restes avec le groupe.
>
> **(a2)** Tu nages loin du bateau où sont ton père et tes frères, et tu ressors du mauvais côté de l'océan. **(a3)** Tu voles avec des gens et tu décides d'aller plus loin que l'Italie, jusqu'en Europe de l'Est — et c'est exactement là que le ballon lâche. **(a4)** Tu es le guerrier d'une tribu assiégée dont une partie veut ta mort, et tu la protèges quand même. **(a5)** Tu t'élèves à travers plusieurs dimensions pendant que les amis que tu invitais à te suivre restent en bas. **(a6)** Et quand ce n'est pas toi qui pars devant, c'est ton enfant : la balançoire dépasse le mur, elle disparaît de l'autre côté, et tu la retrouves seule dans une cave où elle s'est initiée sans toi.
>
> **(a7)** Le second fil est plus dur, et il court dans les six : la protection ne fonctionne jamais comme prévu.
>
> **(a8)** Ta femme lâche l'enfant sur la balançoire sans la moindre inquiétude, et c'est elle qui a raison — l'enfant s'en sort seule. **(a9)** Tu protèges une tribu qui te déteste. **(a10)** Dans le trou aux serpents tu sais exactement ce qu'il faut faire — ne pas bouger — et tu paniques quand même, et tu te fais piquer. **(a11)** Dans le voyage temporel tu gardes ta tête pendant que les autres se perdent dans le passé, et c'est au retour que tu la perds, sur ta mère, à la sortie du cinéma.
>
> **(a12)** Ce que ces six-là ont en commun, ce n'est pas la puissance. C'est le moment précis où elle ne suffit plus.

---

### ▸ PORTRAIT (b) — depuis les agrégats seuls (motifs récurrents + dictionnaire), sans lire un seul récit

*Note d'honnêteté avant de commencer : `recurring_dream_patterns` étant vide, la moitié du matériau prévu pour cette version n'existe pas. Ce qui suit est construit sur ce qui reste — dictionnaire personnel, archétypes, thèmes de vie, valences.*

> **(b1)** Ce qui revient le plus dans ton corps de rêve, c'est la poitrine — vingt-trois fois — et c'est la seule zone dont la charge moyenne est franchement négative.
>
> **(b2)** Viennent ensuite le corps entier, la gorge, le ventre.
>
> **(b3)** Deux thèmes seulement se répètent assez pour faire motif : « un seuil à franchir » et « apprivoiser sa puissance ».
>
> **(b4)** Les figures qui reviennent sont peu nombreuses : Jade domine largement, puis Zoé, la mère, le père, Marine, Adi, Jacques.
>
> **(b5)** La mère et le père portent tous deux une charge négative ; Jade, une charge légèrement positive.
>
> **(b6)** Côté archétypes, le trickster domine nettement, suivi de l'ombre, du gardien du seuil, de l'anima et de la grande mère.
>
> **(b7)** L'intensité affective est élevée et la valence légèrement positive : quarante-deux rêves du bon côté, dix-huit de l'autre.
>
> **(b8)** On peut en tirer l'image d'un homme au seuil, dont la puissance cherche sa juste mesure, sous le regard d'une figure féminine centrale et de parents chargés.

---

### ▸ PORTRAIT (c) — depuis une lecture réelle des 54 récits

> **(c1)** Tu n'as pas un journal de rêves. Tu as un enregistrement du matin où le rêve, ce que tu en comprends, ta to-do list et ton plan business coulent dans le même souffle, sans césure.
>
> **(c2)** Le rêve de l'arbre géant coupé — celui où tu tombes à genoux et tu pleures devant le champ d'énergie qui en sort, celui où tu écris que la Terre se réveille et que l'humanité est sauvée — se termine sur l'intention « de faire des prières à voix haute ou écrites, mais régulièrement, **qui pourront être retransmises comme des newsletters ou des posts pour ma communauté, Infuse** ». Et le rêve des ancêtres, celui qui s'ouvre sur « il fallait aller prendre soin de mes ancêtres », bascule à mi-parcours dans un plan à sept mois : « d'abord il faut que tout tourne bien, le magasin en ligne, et la marketing… ensuite packaging… c'est à ce moment-là seulement qu'on peut commencer à avoir des ambassadeurs ». **(c3)** Ce n'est pas une distraction, c'est ta forme : je ne trouve presque aucune entrée du corpus qui s'arrête à l'image.
>
> **(c4)** Deuxième chose, et c'est celle que je n'attendais pas : depuis au moins deux ans, tu essaies de construire cette application à l'intérieur de tes propres enregistrements.
>
> **(c5)** Le 16 septembre : « il faut vraiment que j'enregistre mes rêves tous les jours ». Le 4 avril : « c'est important que je prenne le temps de les enregistrer tous les jours ». Le 22 juin : « j'aimerais bien développer un système d'enregistrement de mes rêves efficace… acheter un petit portable second hand… j'y brancherais un petit micro, parce que c'est quand même important la qualité du micro ». Le matin de l'arbre géant : « je vais me trouver mon téléphone à rêve ». **(c6)** Et le matin de tes trente ans, avant de raconter quoi que ce soit : « ma première intention de cette nouvelle décennie, c'est d'avoir un enregistrement, un rêve, tous les jours, jusqu'à mes 40 ans. Ce qui fait 3 560 rêves. » Puis, plus loin dans le même enregistrement : « je pourrais mettre un titre au moins… avoir un journal de rêve qui parle du titre et des éléments forts… et qui mappe les gens, les lieux, les thèmes ». **Tu as écrit le cahier des charges de la Dream App le matin de tes trente ans, à la fin d'un rêve.**
>
> **(c7)** Troisième chose : le motif n'est pas le vol, c'est l'atterrissage.
>
> **(c8)** Tu voles dans seize rêves — mais ce que les rêves travaillent, systématiquement, c'est la reprise de contact. **(c9)** Dans le gymnase tu t'envoles, tu chantes, la foule reprend ton chant, et le rêve ne s'arrête pas là : « je commençais à devenir un peu self-conscious une fois qu'ils avaient répondu… il y avait peut-être un peu d'ego qui venait… du coup je chantais un petit peu moins bien ». Puis tu t'entraînes à atterrir, tu déploies ta conscience, tu ralentis au dernier moment, tu touches le sol doucement — et tu écris : « j'étais fier de moi. Du coup j'ai remaîtrisé le flying. » **(c10)** Le maître de la cité médiévale ne t'apprend pas à voler : il t'apprend le salto, à lancer ta tête en avant. **(c11)** Et dans le trou aux serpents, tout le rêve tient dans une immobilité qu'il faut tenir et que tu ne tiens pas.
>
> **(c12)** Quatrième chose : ta mère apparaît dix fois, et jamais depuis la même place.
>
> **(c13)** Une fois tu l'étrangles à la sortie du cinéma, tu lui mets des claques, tu lui renvoies toute la violence — et l'enregistrement bascule immédiatement dans la généalogie de cette violence à elle : « c'est cette violence qu'elle avait contre les gens, contre le monde. La dureté de la vie. Ces gens à qui on ne peut pas faire confiance, cette méfiance. » **(c14)** Une fois, sur le parking, elle ramène l'attention sur elle au moment où tu allais enfin consoler l'amie du mort ; tu poses ta limite, tu pars la chercher quand même, et tu lui dis « je t'aime » en partant. **(c15)** Une fois, le bateau du contrôle fiscal chavire, tu es éjecté, tu atterris parfaitement sur un mur — et tu retournes dans l'eau la chercher, « et je sais que tout le monde est sain et sauf ». **Rage, limite, sauvetage : trois positions distinctes sur le même nœud.** C'est la seule figure du corpus dont je peux montrer une trajectoire.
>
> **(c16)** Ton père, lui, est surtout absent, et son absence est le sujet. Dans ton rêve du 26 juillet — le plus récent récit substantiel du corpus — il devait tenir « un élément assez fondamental de l'équipe », il n'est là à aucune partie, vous perdez à chaque fois à cause de ça. Et tu finis par optimiser sans lui, gagner, « j'étais comme un roi ». Tu écris toi-même, dans l'enregistrement : « je me demande si ce n'est pas un rêve lié à un endroit où je galère à travailler en équipe, coopérer, travailler en mode de famille. »
>
> **(c17)** Ton corps a une carte, et elle est nette : la poitrine vingt-trois fois, et c'est là que ça se serre ; la gorge seize fois, et c'est là que le chant arrive.
>
> **(c18)** Dernière chose, et c'est celle qu'un portrait qui cherche à être beau laisserait tomber : la matière la plus insistante de ce corpus est sexuelle et honteuse. **(c19)** Le rêve de l'épée est un rêve de guérison explicite — « j'ai revisualisé mes traumas sexuels de mon adolescence », la honte, la masturbation solitaire, le pardon nommé, l'épée qui peut enfin descendre. **(c20)** Chez le gardien singe, tu t'arrêtes en plein récit pour écrire : « je me suis rendu compte que j'étais sorti de mon intégrité ici pour lui faire plaisir, il fallait surtout pas le faire, jamais ». **(c21)** Et le dernier récit de rêve entier que tu aies déposé avant aujourd'hui — le 12 juillet, celui qui n'a même pas de titre — est un rêve de honte, avec une enfant, un secret, un filtre à eau, et cette phrase pour finir : « je sentais que je faisais ça en secret, j'avais honte. » **(c22)** Cette veine traverse le corpus du 2 août 2023 à ce mois-ci.

---

## §4 — LE JUGEMENT, CHIFFRÉ

Chaque affirmation classée : **ancrée** (je peux citer le rêve exact) · **plausible** (dérivée, mais non vérifiable phrase par phrase) · **Barnum** (irait à n'importe quel rêveur).

| Version | Phrases | Ancrées | Plausibles | **Barnum** | Verdict |
|---|---|---|---|---|---|
| **(a)** 6 grands rêves | 12 | **10** (83 %) | 2 (a7, a12) | **0** | Touche juste, mais étroit |
| **(b)** agrégats seuls | 8 | **0** | 5 | **3** (b3, b7, b8) | **Horoscope** |
| **(c)** lecture réelle | 22 | **19** (86 %) | 3 (c3, c7, c18) | **0** | Le seul qui dit quelque chose de réfutable |

### 4.1 Test de falsifiabilité

**(a) passe.** *« Il n'y a pas un seul de ces six rêves où tu restes avec le groupe »* est vérifiable et pourrait être faux — il suffirait d'un rêve où il reste. Ce n'est pas le cas : les six le montrent partant devant, seul, ou séparé.

**(b) échoue.** Aucune phrase de (b) ne peut être fausse. « Un homme au seuil dont la puissance cherche sa juste mesure sous le regard d'une figure féminine centrale » irait à n'importe qui — et surtout, **Tim ne peut rien vérifier** : il ne peut pas confronter « poitrine, vingt-trois fois » à son souvenir. Une statistique ne produit pas de reconnaissance, elle produit de l'autorité. C'est le mode de défaillance le plus dangereux, parce qu'il est indiscernable de la justesse.

**Pire encore, (b6) est un artefact présenté comme un trait.** `trickster` est posé sur **28 rêves sur 60** — près de la moitié. Ça ne dit rien de Tim, ça dit que l'extracteur sur-applique l'étiquette. Un portrait qui annonce « le trickster domine chez toi » décrit le bug, pas l'homme.

**(c) passe, franchement.** Presque tout y est réfutable. *« Je ne trouve presque aucune entrée qui s'arrête à l'image »* — un contre-exemple suffirait. *« Ta mère apparaît dix fois et jamais depuis la même place »* — falsifiable. *« Le motif n'est pas le vol, c'est l'atterrissage »* est la plus risquée des trois plausibles : c'est une interprétation, et Tim peut légitimement dire non.

### 4.2 La critique que je fais à (c), et elle est réelle

**Une part de (c1)-(c6) décrit sa pratique d'enregistrement, pas sa psyché.** Que Tim mélange rêve et business plan, qu'il rêve de construire un dispositif de captation de rêves — c'est vrai, c'est spécifique, c'est frappant, et **ce n'est pas le portrait d'une âme, c'est le portrait d'un rapport au matériau**. Un miroir de la psyché qui parle surtout de la façon dont on tient le miroir a raté quelque chose.

C'est aussi, honnêtement, l'observation la plus utile pour le produit : si Tim veut un miroir, il faudra d'abord séparer le récit du commentaire — et `recit_only_text` existe déjà (59/64 lignes) pour ça.

**Et (a) est étroit par construction.** Six rêves sur cinquante-quatre. Il rate entièrement la mère, le père, la gorge, la honte. Il touche juste sur ce qu'il voit et il ne voit presque rien.

---

## §5 — LE CONTRE-TEST

### 5.1 🔴 Le contre-test que je n'ai pas eu à fabriquer : 18 portraits déjà en production

Les 4 autres comptes ont 5, 2, 2 et 1 kairos, de 29 à 178 caractères de moyenne — trop peu pour un portrait comparatif. **Mais l'un d'eux a déjà reçu 18 portraits générés par `/api/portrait/narrative-reading`.**

Voici **la totalité de sa matière**, les 5 kairos et l'unique entrée de journal :

```
1. « Jao rêve de 2 grands serpents »                                        (29 c.)
2. le rêve du cercle de 300 personnes et de la prière                      (550 c.)
3. « Tu as des protocoles à me proposer pour avant de me coucher? »         (60 c.)
4. « Qu'est-ce que je dois faire, je vais me coucher dans pas longtemps? »  (67 c.)
5. « Est-ce que tu m'entends? »                                             (24 c.)
journal : « Je suis heureux d'être en vie »                                 (29 c.)
```

Trois des cinq « rêves » sont des messages adressés à l'app. **Matière réelle totale : 608 caractères.** Sortie : **18 lettres, ~1 900 caractères chacune, ≈ 34 000 caractères — une amplification × 56.**

Extrait de la dernière :

> « Aizenstat dirait que la figure du prophète blessé qui prend la parole dans le cercle n'est pas une métaphore de toi — elle est une présence qui a choisi cette nuit-là de traverser. »

Et le champ `figures_dominantes` de cette même lettre :

```json
[{"nom": "Le prophète blessé", "occurrences": 1},
 {"nom": "Les deux serpents",  "occurrences": 1},
 {"nom": "Le cercle de trois cents", "occurrences": 1}]
```

**« Figure dominante », occurrences : 1.** La machine consigne dans son propre champ de sortie qu'elle n'a aucune récurrence, et appelle ça une dominante. Elle produit aussi une « tension ouverte » — *« les deux serpents non nommés : une énergie double en attente de forme »* — à partir de sept mots.

C'est beau. C'est fluide. Ça mobilise Damasio, Hillman, Buber, Eliade, Aizenstat. **Et ça ne repose sur rien.** Les 18 lettres, générées depuis la même matière, disent toutes des choses différentes — ce qui est la définition opérationnelle de la confabulation.

### 5.2 Le contre-test demandé : 20 rêves tirés au hasard chez Tim

Tirage déterministe (`md5(id||'e2seed')`), 20 sur 60. Le tirage inclut le placeholder de 31 caractères, la note « j'ai vu un oiseau » et une note de veille — soit **15 % de déchet, ce qui est représentatif du corpus réel**.

Portrait écrit depuis ces 20 seuls :

> Tu enregistres tes rêves le matin, à voix haute, et le récit ne tient jamais seul : il glisse vers ce qu'il faudrait faire aujourd'hui. Le 23 septembre, ce que tu appelles un rêve est en réalité une liste — rendre le site accessible, envoyer la newsletter, écrire à Evan — et tu finis par nommer toi-même ce que tu vois : « c'est du self-sabotage de haut niveau… c'est la peur du jugement ».
>
> Tu montes et tu tombes, et c'est la chute qui est travaillée. Le ballon lâche au-dessus de l'Europe de l'Est et tu passes le rêve immobile dans un trou. Le bateau du contrôle fiscal chavire et tu es éjecté — mais tu atterris « juste comme il faut », et tu retournes chercher ta mère.
>
> Et il y a une veine que tu ne lâches pas : la honte et le sexe. L'épée qui doit pouvoir redescendre dans la terre après le pardon des traumas d'adolescence. L'ascenseur du palais nordique, où tu juges un ami qui gaspille son énergie sexuelle. Le rêve du 12 juillet, sans titre, avec une enfant, un secret, et la honte pour dernier mot.

**Ce que le sous-échantillon retrouve** : la forme de l'enregistrement (c1-c6), le motif de l'atterrissage (c7-c11), la veine de honte (c18-c22), la centralité de Jade. **Trois des cinq axes de (c) survivent au tirage.**

**Ce qu'il perd** : la trajectoire de la mère (1 des 3 occurrences est dans le tirage — impossible de voir un arc), l'absence du père (le rêve du 26 juillet n'est pas tiré), la gorge et le chant (ni *La voix retrouvée* ni *Les fantômes du parking* ne sont tirés).

**Conclusion du contre-test.** La méthode « lecture réelle » n'est pas un générateur de banalités : elle produit des axes **stables** sur un tiers du corpus. Mais **les affirmations les plus précieuses — celles qui décrivent une trajectoire, pas un thème — sont exactement les plus fragiles au sous-échantillonnage.** Elles demandent que le corpus soit complet. À 54 rêves, un arc à trois positions repose sur trois rêves : c'est le minimum absolu, et la moindre lacune le fait disparaître.

---

## §6 — LE CHANGEMENT DANS LE TEMPS : non, pas aujourd'hui

### 6.1 La profondeur temporelle réelle

| Période | Rêves distincts | Longueur moyenne |
|---|---|---|
| 2024 (31/03 → 30/12) | **15** | 3 127 c. |
| **DATE INCONNUE** (import en bloc, `occurred_at` = 18-20 avril 2026, `reliable=false`) | **39** | **3 446 c.** |
| 2026 (21/04 → 26/07) | **6** | **980 c.** |

**Les deux tiers du corpus — et la part la plus substantielle — flottent hors du temps.** Ce qui est daté de façon fiable, c'est 15 rêves de 2024 et 6 entrées récentes qui sont pour l'essentiel des notes courtes.

Et même les dates « fiables » mentent parfois : *Les ailes du maître dans les pierres* porte `occurred_at = 2026-07-26`, alors que Tim dit dans l'enregistrement : « **c'était le rêve de l'année dernière** ». C'est aussi celui qu'il a marqué grand rêve aujourd'hui.

### 6.2 Le piège, démontré

Si on comparait naïvement les deux blocs datés :

| motif | 2024 (15 rêves) | 2026 (6 rêves) |
|---|---|---|
| guerrier / combat | 1 | **0** |
| sacré / temple / dieu / prière | 5 | **0** |
| Jade | 5 | **0** |
| business / Infuse / festival | 0 | 2 |

Un portrait lirait là-dedans : *« le guerrier s'est tu, le sacré s'est retiré, Jade a quitté tes nuits, le monde du travail a pris la place. »* **C'est faux.** C'est l'effet mécanique de 6 entrées de 980 caractères contre 15 de 3 127 : un texte trois fois plus court contient trois fois moins de tout. Ce serait exactement le genre d'affirmation qui sonne juste, qui touche, et qui n'est qu'un artefact de longueur.

### 6.3 « Un nouveau rêve réveille-t-il un motif ancien ? »

Testé sur les axes disponibles.

**Sur `life_themes` : le signal n'existe pas.** Sur tout le corpus, **deux thèmes seulement** apparaissent plus d'une fois : « seuil à franchir » (7, dont 3 datés) et « apprivoiser sa puissance » (6, dont **1** daté). Tous les autres sont uniques. On ne peut pas dater une résurgence sur 1 point.

**Sur le texte brut : le signal existe, et il est bon.** Comptage direct sur les 60 récits : école 22 · communauté/tribu 21 · business 19 · sacré 18 · vol 16 · jeu/niveau 16 · Jade 15 · pouvoirs 14 · père 13 · mère 10 · guerrier 10. Ce sont des fréquences robustes, portées par le texte réel, insensibles à l'extraction. **La détection de motifs marche — à condition de la faire sur les récits, pas sur les tags.**

**Mais on ne peut pas la situer dans le temps**, puisque 39 des 60 récits n'ont pas de date.

### 6.4 La bonne nouvelle : les dates sont récupérables

Tim date ses rêves **dans sa voix**, en ouverture. Sur les 42 entrées marquées « date inconnue », **11 portent une date en clair** dans les 400 premiers caractères :

```
Les créatures de l'entente nocturne  → « Journale de rêve, 13 janvier »
Les créatures du dialogue…           → « 13 janvier »        (le doublon)
L'épée de Jade                       → « en ce 2 août 2023 » (avec l'année)
Les militaires et le panda blanc     → « rêve du 4 avril »
Les larmes… sous le regard de mamie  → « du 5 avril »
Les Rois du Désert en Attente        → « On dirait le 6 avril »
Les secrets chuchotés sous le lit    → « du 13 avril »
Les fantômes du parking              → « Rêve du 8 août »
Les morts qui reviennent à l'aube    → « Rêve du 22 juin, 11h11 »
La voix retrouvée…                   → « Enregistrement du 23 juin »
L'École des Cœurs en Compétition     → « Rêve du 24 avril »
```

**Une passe d'extraction de date sur le texte récupère au moins 26 % des rêves non datés, sans rien demander à Tim.** L'année reste ambiguë sur 10 des 11 — mais l'ordre relatif et la saison sont retrouvables, et `kairos_dream_date_proposals` (24 lignes) existe déjà pour porter ce genre de proposition à valider.

**Réponse nette : non, on ne peut rien dire aujourd'hui sur ce qui a changé. Oui, on le pourra — après récupération des dates, et après quelques mois de dépôt régulier.**

---

## §7 — LE COÛT

### 7.1 Aujourd'hui, 54 rêves

Corpus distinct : 187 181 caractères ≈ **52 000 tokens** (français, ~3,6 c./token). Avec `recit_only_text` : 142 751 c. ≈ **40 000 tokens** (−24 %).

| Configuration | Entrée | Sortie | Coût / portrait | Latence estimée |
|---|---|---|---|---|
| Sonnet 4.6, corpus brut | 53,5 k tok | 1,5 k | **≈ 0,18 €** | 25-45 s |
| Sonnet 4.6, `recit_only_text` | 41,5 k tok | 1,5 k | **≈ 0,15 €** | 20-35 s |
| **Opus**, corpus brut | 53,5 k tok | 1,5 k | **≈ 0,91 €** | 45-90 s |
| **Sonnet + prompt caching** (corpus stable) | 53,5 k tok en cache | 1,5 k | **≈ 0,04 €** | idem |

*Latences estimées, non mesurées — je n'ai pas appelé l'API dans cette mission.*

Le portrait existant, lui, coûte **~0,02 €** — parce qu'il n'envoie que 1 027 tokens. C'est précisément le problème.

**Recommandation coût court terme : Opus, sans hésiter.** À 0,91 € par génération pour un rituel journalier voire hebdomadaire, sur un utilisateur, le coût est nul face à l'enjeu. C'est exactement le cas décrit dans `CLAUDE.md` : Opus pour le sensible.

### 7.2 Le mur, et il arrive avant 500

**La lecture intégrale casse à ~230 rêves, pas à 500.** À la longueur moyenne de Tim (3 120 c.), la fenêtre de 200 k tokens (≈ 720 000 c.) est saturée à **231 rêves**. Avec `recit_only_text` (2 379 c./rêve), à **~300 rêves**.

À 500 rêves : ~1 560 000 caractères ≈ **433 000 tokens**. **Deux fois la fenêtre.** La méthode (c) devient littéralement impossible, pas seulement chère.

### 7.3 Ce qui passe à l'échelle

Résumé hiérarchique en deux passes :

1. **Passe 1 (une fois par rêve, définitive)** : condenser chaque récit en ~150 tokens denses — figures nommées, gestes, seuils, la phrase du rêveur qui compte. 500 rêves × (850 tok in + 150 tok out) → **≈ 2,40 € en Sonnet, une seule fois**. Incrémental ensuite : ~0,005 € par nouveau rêve.
2. **Passe 2 (à chaque portrait)** : 500 × 150 = **75 k tokens**, plus les 10-15 rêves marqués grands **en texte intégral** (parce que ce sont eux qui doivent garder leur chair). → **≈ 0,30 € en Sonnet, ≈ 1,50 € en Opus.**

**Ça tient jusqu'à ~1 200 rêves.** Au-delà, il faudra une troisième couche (résumés de périodes).

**Avertissement de qualité, qui compte plus que le coût** : la passe 1 fait exactement ce que fait déjà l'extraction actuelle — poser un jugement de modèle sur un texte — et §2.2 montre où ça mène. Si on résume, **il faut vérifier les résumés** : passer le même rêve deux fois et comparer. Si les deux résumés divergent comme divergent les deux extractions du placeholder, la couche est bonne à jeter. C'est un test de 5 minutes, à faire avant de bâtir dessus.

---

## §8 — RECOMMANDATION

### Ce que je recommande : **une version réduite, tout de suite, et le remplissage en parallèle.**

Pas « on remplit d'abord » — il y a déjà assez de matière pour un vrai miroir, la démonstration est (c). Pas non plus « on construit le miroir décrit » — la moitié de ses entrées n'existe pas.

**Le miroir possible aujourd'hui, en une phrase : un portrait écrit par Opus depuis la lecture intégrale des 54 récits, qui ne cite que des rêves et qui n'affiche aucun agrégat.**

### Les cinq règles que la mesure impose

1. **Lire les récits, pas les tags.** Le corpus brut est excellent, la couche d'extraction confabule (§2.2). Toute affirmation du portrait doit pouvoir citer un rêve. Aucun comptage de `motif_tags`, `life_themes` ou `archetypal_tags` ne doit apparaître à l'écran.
2. **Ne jamais afficher une statistique comme un fait sur lui.** « Le trickster domine chez toi » décrit un bug. « La poitrine, vingt-trois fois » est vrai mais invérifiable pour Tim : ça produit de l'autorité, pas de la reconnaissance. Le seul agrégat que je défendrais est la carte du corps (poitrine / gorge / ventre), et encore — accompagné des rêves où ça se passe.
3. **Interdire la génération quand le corpus est maigre.** Le portrait existant a produit 18 lettres depuis 608 caractères. Il faut un plancher dur — je proposerais 12 récits d'au moins 800 caractères — et en dessous, le silence, pas une belle lettre.
4. **Dédoublonner avant de compter.** 4 doublons octet pour octet, 2 quasi-doublons. `Zoé la déesse` compte deux fois, avec deux titres. Les embeddings sont là et ils les trouvent (cos = 1.0000) : c'est une requête, pas un chantier.
5. **Ne pas promettre le temps.** Tant que 39 des 60 récits n'ont pas de date, le portrait ne doit dire ni « ce qui a changé », ni « ce qui est encore vrai », ni « il y a six mois ». Le faire sur ce corpus, c'est produire l'artefact du §6.2 — une phrase juste-sonnante et fausse.

### Les trois chantiers qui remplissent le miroir, par ordre de rendement

| # | Chantier | Débloque | Effort |
|---|---|---|---|
| 1 | **Extraction de date depuis le texte** (11 dates en clair déjà repérables ; `kairos_dream_date_proposals` existe) | Toute la dimension temporelle — le « ce qui a changé » | Faible |
| 2 | **Séparer récit et commentaire** (`recit_only_text` existe déjà sur 59/64) | Un portrait qui parle de sa psyché et non de sa pratique d'enregistrement (§4.2) ; −24 % de tokens | Faible |
| 3 | **Faire marquer les grands rêves** — la première review de B3, livrée et jamais lancée | La pondération que Tim demande. Aujourd'hui : 2 marqués sur 54 | Faible — c'est un parcours déjà écrit |

Les trois écrans vides — Cœur (0), Journal de vie (**1 ligne dans toute la base**), interprétations (1) — ne se remplissent pas par un chantier technique. Ils se remplissent par l'usage, ou pas du tout. **Le portrait ne doit pas les attendre, et il ne doit pas faire semblant de les avoir.**

### Ce que je ne recommande pas

**Ne pas rebrancher `/api/portrait/narrative-reading` en l'état.** Trois défauts mesurés :
- il lit `created_at` et non `occurred_at` — pour Tim, la fenêtre « lune » verrait **4 rêves**, la fenêtre « saison » aussi **4**, parce que 42 imports portent la date d'import ;
- ses toggles `day` et `crossed` interrogent `life_journal_entries`, qui compte **1 ligne dans toute la base** ;
- il trie par `numinosity_score`, qui corrèle **0.615** avec la longueur du texte : il sélectionne les rêves les plus bavards.

C'est la route qui a produit les 18 lettres du §5.1. Elle marche parfaitement. C'est le problème.

---

## ANNEXE — ce que la mesure a corrigé dans le brief

- **`numinosity_score` n'est plus à 0.00 sur 52/64.** Les 64 lignes ont désormais un score > 0 (rattrapage A2). Mais il corrèle **0.615** avec log(longueur) sur les 60 distincts — plus haut encore que les 0.532 mesurés par B3 sur son échantillon nettoyé. Il reste inutilisable comme sélecteur.
- **`title` n'est plus NULL que sur 1 ligne** (le rêve du 12/07), pas sur « les récents ».
- **`personal_dictionary_symbols` = 1 485 pour Tim** (1 538 en base, tous comptes).
- **`kairos_edges` = 1 169 pour Tim** (1 171 en base) — pas 1 690.
- **`recurring_dream_patterns` = 0** — la table est vide pour tout le monde, pas seulement peu remplie.
- **`user_marked_numinous` = 2**, pas 1 : un second grand rêve a été marqué aujourd'hui à 18h51 (*Les ailes du maître dans les pierres*, facette `force`), après la remise du rapport B3.
- **`great_dream_candidates` = 0** : le détecteur B3 n'a effectivement jamais rien écrit.

**Aucune écriture n'a été faite. Aucune table `_e2_` n'a été créée.**
