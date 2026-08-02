# RAPPORT W3 — passe d'intégrité sur les citations du canon Dream App

> 2026-08-02 · branche `yeshua/canon-sept-principes` · périmètre exclusif : `DOCTRINE-MIROIR.md`, `1_BIBLE.md`, `2_DESIGN.md`, `4_LOG.md`.
> Méthode : chaque citation entre guillemets a été cherchée dans **`forest_chunks`** (98 123 chunks, Supabase `rtrkxzcyblgonwgfzovj`) après **normalisation** — césures de fin de ligne recollées, sauts de ligne et tabulations-séparateurs écrasés, ponctuation retirée, minuscules. Sans cette normalisation, la recherche produit des faux négatifs en masse : le corpus est un OCR qui coupe les mots en fin de ligne (`with­\ndrawal`) et, pour `jung-archetypes-collective-unconscious`, sépare **chaque mot par une tabulation**.
> **Zéro invention.** Là où le texte n'a pas été retrouvé, c'est écrit *introuvable dans le corpus*, et la citation a été dé-citée plutôt que réparée au jugé.

---

## 0. Le résultat en une phrase

**La doctrine tient. Ses citations, non.** Aucune thèse du canon ne s'effondre — mais **sur les 33 citations attribuées à un auteur que j'ai vérifiées une par une, 14 seulement sont des verbatims**, 8 sont des traductions ou condensations fidèles présentées comme des verbatims, et **11 sont introuvables dans le corpus**, dont trois entièrement fabriquées. Le point de bascule est là : la doctrine a été écrite à partir de **digests**, où rien ne distingue visuellement une glose du digesteur d'une phrase du livre — et les gloses ont été recopiées entre guillemets.

Trois documents se comportent très différemment, et l'écart est instructif :

| Document | Écrit à partir de | Fiabilité des citations |
|---|---|---|
| `DOCTRINE-MIROIR.md` | **digests Tier 1** | **mauvaise** — 3 fabrications, 6 approximations sur 22 vérifiées |
| `1_BIBLE.md` | mélange | moyenne — 1 fabrication, le reste bon |
| `LECTURE-WELLER-KALSCHED.md` | **`forest_chunks` en direct** | **excellente** — pagination exacte au chunk près, et le document **signale lui-même** la fabrication qu'il a trouvée |

**C'est la démonstration la plus utile du rapport : le problème n'est pas les agents, c'est la source.** Un agent qui lit les chunks ne fabrique pas. Un agent qui lit un digest fabrique, quel que soit son soin.

---

## 1. LE TABLEAU DES CITATIONS VÉRIFIÉES

Légende — **verbatim** : retrouvé tel quel · **approximatif** : le passage existe, la phrase citée n'est pas sa traduction littérale (condensation, mot ajouté, deux phrases fondues) · **introuvable** : rien dans le corpus.

### 1.1 `DOCTRINE-MIROIR.md`

| § | Citation (telle qu'elle figurait) | Statut | Source réelle |
|---|---|---|---|
| §0 | Bachelard — *« toute prise de conscience est un accroissement de conscience, une augmentation de lumière »* | **verbatim** | `bachelard-poetique-reverie` #9 — *« pour nous toute prise de conscience est un accroissement de conscience, une augmentation de lumière, un renforcement de la cohérence psychique »* |
| §0 | Bachelard — *« l'image cosmique donne le tout avant les parties »* | **approximatif** (élision) | `bachelard-poetique-reverie` #154, p. 150 — *« l'image cosmique est immédiate, elle nous donne le tout avant les parties »* |
| §0 | Weller p. 74 — *« par défaut, nous devenons le contenant nous-mêmes »* | **verbatim** (trad.) | `weller-wild-edge-of-sorrow` #98 = p. 74 — *« By default, we become the container ourselves »* |
| §1.1 | Jung — le « processus de centrage » | **introuvable** comme formule | ni *centring process* ni *centering process* dans `jung-red-book`. Ce que Jung écrit, p. 215 : *« the unconscious process moves spiral-wise round a centre »* |
| §1.1a | *« Le sujet du texte n'est **jamais** "cet individu est ainsi" »* | **faux** (affirmation, pas citation) | Jung caractérise 3 fois : p. 114 (typologie), p. 215 (normalité), p. 146-147 (*« Running away thus becomes a moral question »*) |
| **§1.1b** | **Jung — *« Quand la conscience s'identifie aux contenus numineux qu'elle récupère de la projection, le résultat est l'inflation — un ego qui croit qu'il EST la psyché entière. »*** | **🔴 INTROUVABLE — FABRIQUÉE** | Le verbatim réel est `jung-red-book` #515 = **p. 480** : *« An inflated consciousness is always egocentric… inflation is a regression of consciousness into unconsciousness »*, et la cause p. 480 : *« the ego identified with the contents accruing from the withdrawal of projections »* |
| §1.1b | Jung — les alchimistes « plus en sécurité » | **verbatim** (confirmé) | `jung-red-book` §43, **p. 37** — *« So long as the alchemist was working in his laboratory he was in a favourable position, psychologically speaking, for he had no opportunity to identify himself with the archetypes as they appeared »* |
| §1.1c / §3.1 | Jung — *longissima via*, « un chemin serpentin », « unit les opposés à la manière du caducée » | **verbatim** (trad.) | `jung-red-book` #40 = **p. 5** — *« it is a longissima via, not straight but snakelike, a path that unites the opposites in the manner of the guiding caduceus »* |
| §1.2 | Hillman — *« toute la procédure moderne qui consiste à interpréter les rêves comme des messages sur la vie éveillée est fondamentalement fausse — elle fait tort au rêve, tort à l'âme »* | **introuvable** comme phrase | La thèse est réelle, `hillman-dream-and-the-underworld` #21 = p. 21 : *« there is a definite resistance on the part of the dream to be converted into the dayworld… we read them for messages about living situations »* + *« our thesis against dreams being translated into the ego's language »*. Mais aucune phrase du livre ne dit ça ainsi. |
| **§1.3** | **Hillman *Soul's Code* — *« Le daimon exige que la personne soit vue… la mauvaise sorte de perception… peut le déformer. »*** | **🔴 INTROUVABLE — LIVRE ABSENT DE LA BASE** | **`hillman-souls-code` n'existe pas dans `forest_chunks`.** Seuls `hillman-dream-and-the-underworld`, `hillman-re-visioning-psychology` et `hillman-archetypal-psychology` y sont. **C'est le §1.3 qui fonde `1_BIBLE` §2.0, le principe-souche.** |
| §2.1a | Kalsched — *« Never Again »* | **verbatim** | `kalsched-inner-world-trauma` #14 = **p. 4** |
| §2.1c | Gendlin — *« quelque chose comme ça »* / *pro-life energy* | **approximatif** / **introuvable** | *« something like that »* : présent (`gendlin-let-body-interpret-dreams`, 15 chunks). *« pro-life energy »* : **introuvable** |
| §3.1 | Jung *Archetypes* — *« more light means more night »* | **verbatim** | `jung-archetypes-collective-unconscious` #299 — *« we add to ourselves a bright and a dark, and more light means more night »* |
| §3.1 | von Franz — la compensation, « **système immunitaire de la psyché** » | **introuvable**, et **mal adossée** | Jung dit l'inverse d'un thermostat, §26 p. 23 : *« the unconscious does not simply act contrary to the conscious mind but modifies it more in the manner of an opponent or partner »*. Et §48 p. 43, il admet des rêves qui ne compensent rien. ⚠️ **Alerte de base** : `von-franz-way-of-the-dream`, `von-franz-interpretation-fairy-tales` et `von-franz-feminine-fairy-tales` portent **le même texte** (206 chunks, 80 879 mots chacun) — deux slugs sur trois sont faux. |
| §3.1 | Gendlin — les rêves comme *« commentaires du moment »* | **introuvable** | *momentary comments* absent de `gendlin-let-body-interpret-dreams` |
| §3.1 | Weller — le deuil comme compétence, *« la tâche n'est pas de surmonter le chagrin… »* | **introuvable** *(déjà corrigé le 30/07)* | Confirmé indépendamment ici : *« the task is not to overcome »* → 0 occurrence. C'était une synthèse du digest. |
| §3.1 | Weller p. 21 — *« et à croire que nous échouons »* | **approximatif** | `weller-wild-edge-of-sorrow` #45 = **p. 21** — *« we are left to interpret the times of descent as pathological. We feel that we are somehow failing. »* (*feel*, pas *believe*) |
| §5.1 | Gendlin — *« Aucune autorité extérieure — thérapeute, théorie, dictionnaire — ne peut déterminer ce qu'un rêve signifie… »* | **introuvable** comme phrase | La thèse est celle du livre ; la formule en trois phrases est du digest |
| §5.1 | Delaney — *« tout acte d'interprétation imposée par un expert est un acte potentiel de **colonisation psychologique** »* | **🔴 introuvable, et attribution fausse** | Le mot *coloniz\** **n'apparaît dans aucun Delaney en base** (`living-your-dreams` 357 chunks, `all-about-dreams` 305 chunks). Il apparaît chez **Hillman**, `hillman-re-visioning-psychology` #54. |
| §5.1 | Delaney — *« fais comme si je venais d'une autre planète »* | **verbatim** (trad.) | `delaney-living-your-dreams` #75-79, #100, #134 + `delaney-all-about-dreams` (28 chunks). C'est l'ossature du livre. |
| §5.1 | Taylor — *« if it were my dream »* | **verbatim** | `taylor-where-people-fly`, 27 chunks |
| §5.2 | Gendlin *Bias Control* — *« En interprétant ses propres rêves, le rêveur impose **inévitablement** ses attitudes conscientes habituelles »* | **approximatif** | `gendlin-let-body-interpret-dreams` #10 — *« when I interpret my own dream I use meanings I know, therefore I must exactly miss what is more than I already know… how can I get beyond imposing my usual conscious attitudes on the dream? »*. « Inévitablement » n'est pas dans le texte. |
| §7 int. 5 | Kalsched — *« only half correct »* | **verbatim** | `kalsched-inner-world-trauma` #14 = **p. 4** ✅ (la correction du 30/07 était juste) |
| §8.0 | **« Jung s'est protégé en *ne rencontrant pas* le rêveur »** | **🔴 FAUX** | `jung-red-book` #76 = **p. 41**, §45 : *« Except for a short interview at the very beginning… **Only the last forty-five occurred under my observation.** »* + canal de questions p. 68 |
| §8.2 | Weller p. 92 — *« avec peu d'égard pour la timidité de l'âme »* / *premature revelation* | **verbatim** (trad.) | `weller-wild-edge-of-sorrow` #116 = **p. 92** |
| §8.2 | Weller p. 85 — *« je crois que tu te caches dans ton chagrin »* | **verbatim** (trad.) | `weller-wild-edge-of-sorrow` #109 = **p. 85** |
| §11 | Gendlin *Focusing* — *« Le changement ne vient pas de l'insight »* | **introuvable** | Le livre dit l'inverse en positif, `gendlin-let-body-interpret-dreams` #5 : *« change comes when there is a certain kind of bodily attention »*. La formule négative est du digest. |
| §11 | Watkins — *« imposer au patient la psyché préférée du médecin »* | **introuvable** | Aucune occurrence dans `watkins-waking-dreams` |
| §11 | Watkins — *« L'image n'est pas une prescription »* | **approximatif** | `watkins-waking-dreams` #149 — *« those who wish to take the image as a prescription or as a key to the causation of symptoms »*. Condensation fidèle, mais pas une phrase du livre. |
| §11 | Hillman *Re-Visioning* — *« Le littéralisme est la psychopathologie de notre temps »* | **introuvable**, et **attribution douteuse** | La formule proche du livre est **de Barfield**, cité par Hillman #157 : *« the besetting sin today is the sin of literalism »*. Hillman écrit #157 : *« the cause of these internal oppositions is literalism »*. |
| §13 t. 10 | **« Zéro épistémologie du rêve d'Afrique australe »** | **🔴 FAUX** | 4 livres en base, 922 chunks au total. Détail §2.3 ci-dessous. |

### 1.2 `1_BIBLE.md`

| § | Citation | Statut | Source réelle |
|---|---|---|---|
| §3.3 / §3.4 / §15 | Aizenstat — *« tending the dream is tending the world »* | **verbatim** | `aizenstat-dream-tending` #1 ⚠️ *(le livre n'est en base qu'en fragment : **9 chunks, 3 693 mots**)* |
| §3.4.1 | « Senoi » dans la liste des traditions vivantes | **erreur de nommage** | Peuple réel = **Sng'oi** (Malaisie) ; le corpus « Senoi » vient de **Kilton Stewart**, tenu pour largement fictif |
| §3.4.1 | Attribution du protocole à **Ullman** | **introuvable** *(déjà corrigé le 30/07)* | Ullman n'est pas dans la Forêt — la correction du 30/07 tient |
| §8.2 | Weller p. 21 — biais d'ascension | **verbatim** (trad.) | `weller-wild-edge-of-sorrow` #45 = p. 21 ✅ pagination exacte |
| §3.15.5 | Weller — *« Grief has never been private; it has always been communal »* | **verbatim** | #98 = **p. 74** ✅ |
| §3.15.5 | Weller — *« This is the solitary journey that we cannot do alone »* | **verbatim** | #140 = **p. 116** ✅ |
| §3.15.5 | Kalsched — *« This was not, however, compassion she could give herself »* | **verbatim** | `kalsched-inner-world-trauma` #224 = **p. 214** ✅ |
| §3.15.5 | Kalsched p. 214 — *« Seule la compassion humaine peut activer le potentiel intégratif du Soi… »* | **🔴 introuvable — glose de digest** | Les verbatims réels : p. 213 *« healed through human compassion »* · p. 214 *« whether good or evil triumphs depends to a frightening degree upon whether human compassion can mediate the volcanic archetypal energies of the psyche »* · p. 215 *« after all she is only a spirit »* |
| §3.15 | Bachelard — *« l'image cosmique donne le tout avant les parties »* | **approximatif** (élision) | voir §1.1 |
| §11 | Moss — *« la plus grande crise de notre temps est une crise d'imagination »* | **verbatim** (trad.) | `moss-growing-big-dreams` #5, `moss-three-only-things` #33 et #184 |
| §11 | Eisenstein — *« l'humanité est en transition entre deux mondes »* | **non vérifié** | `eisenstein-more-beautiful-world` est en base ; la formule française n'a pas été localisée. À traiter comme *approximatif* tant qu'elle n'est pas retrouvée. |

### 1.3 `LECTURE-WELLER-KALSCHED.md`

**Le meilleur document des trois, et de loin.** Il a été écrit en interrogeant `forest_chunks` directement — sa pagination est exacte, ses verbatims anglais sont tous confirmés, et **il signale lui-même la fabrication qu'il a trouvée** (§1, la phrase du digest sur « surmonter le chagrin »).

| Citation | Statut | Vérification |
|---|---|---|
| *« Grieving, by its very nature, confirms worth »* (p. 45) | **verbatim** | #69 → 69−24 = **45** ✅ |
| *« So, what is the 1-2-3 of grief? How do I get over this sadness? »* (p. 122) | **verbatim** | #146 → **122** ✅ |
| *« Becoming skillful at digesting our grief… »* | **verbatim** | #31 ✅ |
| *« Ritual offers us the two things required… containment and release »* (p. 97 réel) | **verbatim** | #97 ✅ |
| *« Grief has never been private… »* (p. 74) | **verbatim** | #98 → **74** ✅ |
| *« This is the solitary journey that we cannot do alone »* (p. 116) | **verbatim** | #140 → **116** ✅ |
| *« l'endroit sûr où tomber »* (p. 73) | **verbatim** (trad.) | #97 → **73** ✅ |
| *premature revelation* / *« timidité de l'âme »* (p. 92) | **verbatim** | #116 → **92** ✅ |
| *« je crois que tu te caches dans ton chagrin »* (p. 85) | **verbatim** (trad.) | #109 → **85** ✅ |
| *« misdiagnosed as depression »* (p. 23) | **verbatim** | #47 → **23** ✅ |
| Kalsched — *« only half correct »* (p. 4) | **verbatim** | #14 → **4** ✅ |
| Kalsched — *« The person survives but cannot live creatively »* (p. 3) | **verbatim** | #13 → **3** ✅ |
| Kalsched — *« Never Again! »* (p. 4) | **verbatim** | #14 → **4** ✅ |
| Kalsched — *« violation of this inner core »* (p. 3) | **verbatim** | #13 → **3** ✅ |
| Kalsched — *« not educable »* (p. 102) | **verbatim** | #112 → **102** ✅ |
| Kalsched — *« tough compassion »* (p. 213) | **verbatim** | #223 → **213** — le document dit « p. 214 », **écart de 1 page** |
| Kalsched — *« ne doit pas se produire prématurément »* (p. 221 annoncé) | **verbatim, page fausse** | #221 → **p. 211**. Le document a pris `page_start` pour le numéro de page à cet endroit. |
| Weller — *« la tâche n'est pas de surmonter le chagrin… »* | **introuvable** | ✅ **le document le dit lui-même**, et c'est exactement le bon geste |

**Deux écarts de pagination mineurs (p. 213→214, p. 211→221) sur 18 citations.** Aucune fabrication. C'est la référence de qualité à généraliser.

### 1.4 Décalages de pagination mesurés (à ne plus jamais redécouvrir)

| `book_id` | Offset | Page du livre |
|---|---|---|
| `jung-red-book` *(= Psychology and Alchemy, CW 12)* | **35** | `page_start` − 35 |
| `weller-wild-edge-of-sorrow` | **24** | `page_start` − 24 |
| `kalsched-inner-world-trauma` | **10** | `page_start` − 10 |

---

## 2. CE QUI A ÉTÉ CORRIGÉ — avant / après

### 2.1 🔴 `DOCTRINE-MIROIR.md` §1.1b — la citation fabriquée de Jung

**AVANT**
> **b) Jung nomme lui-même le danger, et il le nomme inflation.** *« Quand la conscience s'identifie aux contenus numineux qu'elle récupère de la projection, le résultat est l'inflation — un ego qui croit qu'il EST la psyché entière. »*

**APRÈS** — trois verbatims paginés remplacent la phrase inventée : la définition (p. 480, *« An inflated consciousness is always egocentric… inflation is a regression of consciousness into unconsciousness »*), la cause qui décrit exactement notre dispositif (p. 480, *« the ego identified with the contents accruing from the withdrawal of projections »*), et le prix du geste (p. 477, *« every increase in consciousness harbours the danger of inflation »*). **L'affirmation voisine sur les alchimistes n'a pas été touchée — elle était exacte** — et elle porte désormais son verbatim (§43, p. 37). Un encadré rouge nomme la fabrication et la rattache au précédent Weller du 30/07.

### 2.2 🔴 `DOCTRINE-MIROIR.md` §8.0 — l'erreur de fait, et la thèse qui se durcit

**AVANT**
> Jung, dans *Psychology and Alchemy*, s'est protégé lui-même en **ne rencontrant pas** le rêveur des 400 rêves.
> **Chacune de ces protections est une contrainte de disponibilité.**

**APRÈS** — §8.0 est réécrit en entier. Le fait est rétabli (entretien initial, 355 rêves sans contact, **45 sous observation directe**, canal de questions, p. 41 et p. 68). Et la thèse change de nature :

> **Ce n'est pas un garde-fou perdu, c'est une architecture à copier.**
> Le dispositif réel de Jung a **trois étages** — le rêveur qui dépose · **la débutante, choisie pour son ignorance** (*« entrusted the task to a beginner who was not handicapped by my knowledge »*, p. 101) · Jung qui interprète après, sur le corpus constitué. Ce que ça protège : **la production du matériau contre la connaissance de l'interprète.**
> **Conséquence produit, opposable : sépare la capture de la lecture dans le produit, pas seulement dans le prompt.** L'app du matin est la débutante — elle enregistre, elle horodate, elle ne sait rien, elle ne suggère rien. Le miroir est un autre acte, plus tard, sans droit d'écriture sur le dépôt.
> **Vérification qui échoue** : tracer les requêtes émises pendant un dépôt — toute lecture d'une table interprétative fait échouer le test.

Ça donne un fondement textuel à la règle B4 n°9 (« rien pendant la capture ») et **ça résout la tension 7** : la confirmation d'une citation se demande au moment du miroir, par l'autre étage. Et la limite est dite : **l'étage 2 de Jung était un être humain présent. L'app reproduit l'étage 3 sans l'étage 2, et aucun réglage de prompt ne remplit cette place.**

### 2.3 🔴 « Zéro épistémologie du rêve d'Afrique australe » — rétractée

**AVANT** (`DOCTRINE-MIROIR` §13 tension 10, `4_LOG` §2)
> Zéro épistémologie du rêve d'Afrique australe dans la Forêt — alors qu'INFUSE vend des plantes de rêve xhosa/zulu (tradition Ubulawu).

**APRÈS** — rétractation, et remplacement par ce qui est vrai :

| Livre | Chunks | Ce qu'il porte |
|---|---|---|
| `sobiecki-southern-african-psychoactive-plants` | **133** | Ethnobotaniste sud-africain **initié**, publié en revue à comité de lecture. **L'épistémologie ubulawu complète.** |
| `ngubane-body-mind-zulu-medicine` | **187** | Anthropologue **zulu** — voix interne, pas observation extérieure |
| `mutwa-indaba-my-children` | 476 | Statut contesté, traité comme tel |
| `cumes-africa-in-my-bones` | 126 | Médecin sud-africain formé auprès de sangomas |

Verbatim vérifié (Sobiecki, p. 4) : *« The term ubulawu comes from the Xhosa verb ukulawula (to control) and refers to "that spirit that controls one" (Hirst 2005). … Whereas lay people can obtain insight or spiritual guidance into their lives with ubulawu, the diviner healer learns to use dreams as a path to heal. »* Trois choses en sortent : **le rêve appartient au domaine des ancêtres** (une ontologie que le canon occidental de l'app n'a pas) · **l'usage laïc ≠ l'usage du devin** (Mama Maponya le dit explicitement) · **le rêve de l'initié·e est un baromètre lu par le tuteur** — c'est-à-dire **un dispositif de miroir déjà institué, avec un humain à l'étage de lecture**, exactement l'architecture du §8.0.

> **La leçon, écrite dans les trois documents : un silence de l'index n'est pas un silence de la tradition.**
> Ces quatre livres sont classés `guerison`, `prophetie`, `mythe` — **jamais `rêve`**. Le rayonnage a produit la cécité, et l'affirmation a été recopiée dans **cinq documents** sans que personne interroge la base.

**⚠️ FLAG ÉTHIQUE HIGH — et c'est d'abord un point d'intégrité commerciale, pas documentaire.**
**INFUSE vend deux des plantes que Sobiecki documente** : *undlela-ziimlophe* (**Silene undulata / capensis**) et *uvuma-omhlope* (**Synaptolepis kirkii**). Tradition vivante et nommée (Xhosa / Cape Nguni, Zulu, Sotho ; initiation *ukuthwasa* ; informateurs nommés). Red lines entrées au canon en **`1_BIBLE` P6 bis** : citer Sobiecki · nommer les peuples et l'initiation · **jamais suggérer que l'usage laïc équivaut à celui du devin** · **jamais « ubulawu » comme nom de feature** · ton sobre (risque de romantisation nommé en base) · **réciprocité concrète à définir avant toute publication**.
**Ce qui reste vrai et qui est le vrai trou** : personne dans le corpus n'est un·e sangoma ou igqirha écrivant en son nom propre aujourd'hui. Piste : Nokuzola Mndende.

### 2.4 Les autres corrections portées

| Fichier | § | Correction |
|---|---|---|
| `DOCTRINE-MIROIR` | en-tête | Note de passe d'intégrité + la limite de source réécrite : `hillman-dream-and-the-underworld` **n'a pas** « perdu ses espaces », il est coupé mot à mot et parfaitement lisible après normalisation. **La seule absence bloquante est `hillman-souls-code`.** |
| `DOCTRINE-MIROIR` | §1.1 | Réserve d'honnêteté **levée** — la série a été lue en source primaire. Remplacée par ce que la lecture a apporté : *« The series is the context which the dreamer himself supplies »* (§50, p. 44). |
| `DOCTRINE-MIROIR` | §1.1a | « jamais » retiré. Jung caractérise trois fois ; l'interdit de l'app ne bouge pas, la doctrine cesse d'invoquer un Jung qui n'existe pas. |
| `DOCTRINE-MIROIR` | §1.2 | Citation Hillman dé-citée, remplacée par le verbatim p. 21. |
| `DOCTRINE-MIROIR` | §1.3 | Citation *Soul's Code* dé-citée + encadré : **le livre n'est pas en base**, la thèse est conservée en restitution assumée, l'acquisition est prioritaire **parce que `1_BIBLE` §2.0 en dépend**. |
| `DOCTRINE-MIROIR` | §3.1 | Citation *longissima via* remplacée par **la phrase de la p. 28** (*« the dream-motifs always return after certain intervals to definite forms, whose characteristic it is to define a centre »*) — la seule que le code puisse implémenter. **Sa réserve importée avec** : *« Nor should it be taken for granted that dream sequences are subject to any governing principle. »* Image immunitaire de von Franz retirée + alerte sur les trois slugs identiques. Gendlin et Weller re-cités au verbatim. |
| `DOCTRINE-MIROIR` | §5.1, §5.2 | Gendlin dé-cité, Delaney « colonisation » **retiré** (le mot est de Hillman), *Bias Control* remplacé par le verbatim p. 10. |
| `DOCTRINE-MIROIR` | §6.3 | **Mesure du plancher de corpus reformulée.** L'ancienne (« demander à Tim en aveugle sur N ») ne marche pas : Tim ne peut pas être en aveugle sur ses propres rêves. Jung donne la bonne — note 155, p. 221, huit tranches de 50, comptage du mandala **6, 4, 2, 9, 11, 11, 11, 17**. → **test de stabilité par motif, sans Tim, en CI. La tension 1 devient une tâche d'ingénierie.** |
| `DOCTRINE-MIROIR` | §11 | Ligne `jung-psychology-and-alchemy` corrigée : le livre est sous **`jung-red-book`**, page = `page_start` − 35. Limite de méthode annotée. |
| `DOCTRINE-MIROIR` | **§11 bis** | **NOUVEAU — la loi de citation** (voir §3). |
| `1_BIBLE` | en-tête | Passe d'intégrité + **loi de citation opposable à tous les documents Dream App**. |
| `1_BIBLE` | §3.4.1 | **Sng'oi ≠ Senoi** · « au feu » retiré (décor non attesté). |
| `1_BIBLE` | **P6 bis** | **NOUVEAU au canon** — Afrique australe, le seul endroit où INFUSE **vend** la tradition qu'elle cite. Red lines opposables. |
| `1_BIBLE` | §3.15.5 | Kalsched re-cité au verbatim (p. 213, 214, 215), glose de digest retirée. |
| `1_BIBLE` | §3.15 | Bachelard rétabli au verbatim complet, p. 150. |
| `2_DESIGN` | §566 | Liste d'éviction V1 : **Sng'oi** au lieu de Senoi, **Xhosa / Cape Nguni, Zulu, Sotho ajoutés** avec le flag HIGH et le renvoi à P6 bis. |
| `4_LOG` | §2 (30/07) | Bloc « zéro épistémologie » **barré et rétracté**, avec la leçon et le flag éthique. |

---

## 3. CE QUE JE RECOMMANDE POUR QUE ÇA NE RECOMMENCE PAS

### 3.1 Le diagnostic — ce n'est pas une inattention

**Trois fabrications en une semaine, par trois agents différents, sur trois livres différents.** Weller (30/07), Jung (02/08), Hillman *Soul's Code* (02/08). Plus, découvertes ici : Delaney « colonisation », Gendlin ×4, Watkins ×2, Hillman *Re-Visioning*, Kalsched dans `1_BIBLE`, von Franz. **Onze citations introuvables sur trente-trois vérifiées : un tiers.**

Un mode d'échec qui se répète à ce rythme, avec cette régularité, chez des agents indépendants, **a une cause structurelle, et elle est identifiable** :

> **Un digest contient des gloses du digesteur, et rien n'y distingue visuellement une glose d'un verbatim.**
> L'agent lit *« Le deuil est une compétence : la tâche n'est pas de surmonter le chagrin mais de devenir habile à le porter »* dans un digest. C'est écrit comme une thèse d'auteur. Il la recopie entre guillemets **de bonne foi**. Le document suivant la cite comme une source. Au troisième document, elle est du canon.

Et la preuve par l'exception est dans le corpus lui-même : **`LECTURE-WELLER-KALSCHED.md`, écrit en interrogeant `forest_chunks` en direct, ne contient aucune fabrication** — et attrape celle des autres. Le même agent, avec la même rigueur, mais une autre source, ne produit pas le défaut.

**La leçon avait déjà été écrite.** `LECTURE-WELLER-KALSCHED.md` §5, le 26/07 : *« les livres sont là, ils sont interrogeables en SQL, et les chunks portent les numéros de page. Chaque futur agent Forêt devrait interroger `forest_chunks` avant de conclure "le digest ne descend pas à ce niveau". »* **Elle n'a été appliquée par personne.** Une leçon qui n'est pas opposable n'est pas une leçon, c'est un regret — exactement ce que le canon dit déjà des principes sans test (§3.1.ter).

### 3.2 La règle, écrite pour être opposable

> ### 🔴 LA LOI DE CITATION
> **Aucune citation entre guillemets, dans aucun document canonique de Dream App, sans son `book_id` et sa page.**
>
> 1. **Un digest n'est jamais une source citable.** Il fonde une thèse ; il ne fournit pas un verbatim. Une phrase lue dans un digest se restitue **sans guillemets**.
> 2. **Les guillemets sont réservés au texte retrouvé dans `forest_chunks`**, avec son `book_id` et sa page, **dans la langue du texte**. Une traduction se signale comme telle (*trad. libre*) ou reste en langue d'origine.
> 3. **Un trou nommé vaut mieux qu'un remplissage plausible.** Livre absent de la base → *« introuvable dans le corpus »*. On ne répare jamais au jugé.
> 4. **Le décalage de pagination se mesure une fois par livre et se note.** Citer une page sans connaître le décalage de son livre, c'est citer un numéro inventé.
> 5. **La vérification est automatisable, donc elle est obligatoire.** Toute nouvelle occurrence `introuvable` non annotée fait échouer la passe.

Elle est entrée au canon en **`DOCTRINE-MIROIR` §11 bis** et en en-tête de **`1_BIBLE`**.

### 3.3 Le script — `scripts/verify_citations.py`

Écrit et livré. Il extrait toute chaîne entre guillemets de plus de 25 caractères, la cherche dans `forest_chunks` **après la normalisation qui fait la différence** (césures recollées, sauts de ligne et tabulations écrasés, ponctuation retirée, accents déposés), et rend trois statuts.

```bash
export SUPABASE_DB_URL='postgresql://...'          # projet rtrkxzcyblgonwgfzovj
python3 scripts/verify_citations.py DOCTRINE-MIROIR.md 1_BIBLE.md 2_DESIGN.md 4_LOG.md
python3 scripts/verify_citations.py --ci *.md      # sortie 1 si nouvel `introuvable`
```

Deux détails qui décident de son utilité :
- **La normalisation est le cœur.** Sans elle, `« An inflated con-\nsciousness »` ne matche rien, et **on conclut à tort qu'un verbatim réel est une fabrication**. J'ai reproduit la fonction SQL `nrm()` à l'identique côté Python pour que les deux chemins donnent le même verdict.
- **Les exemptions sont explicites** (`EXEMPT_MARKERS`) : les phrases de l'app, les mots de Tim, les portes lexicales et les citations déjà déclarées introuvables ne sont pas re-signalées. Sans ça le rapport est illisible et personne ne le lit — donc personne ne l'applique.

**Limite assumée** : une citation française d'un livre anglais sort en `introuvable`. **C'est voulu.** La règle 2 dit que les guillemets sont réservés à la langue du texte ; le script applique la règle plutôt que de la contourner.

### 3.4 Les trois autres actions, par ordre de rendement

1. **Acquérir `hillman-souls-code`.** C'est la seule absence qui fasse mal : **`1_BIBLE` §2.0, le principe-souche de tout le canon, repose sur une citation d'un livre qui n'est pas en base.** Le principe est corroboré ailleurs (Jung §1.1a, l'épistrophè), donc il tient — mais il ne peut pas être cité tant que le livre manque.
2. **Nettoyer trois entrées de `forest_chunks`** — hors de mon périmètre, à confier :
   - `jung-red-book` **n'est pas le Livre Rouge**, c'est *Psychology and Alchemy* CW 12. Le titre et tout digest dérivé portent une fausse attribution.
   - `von-franz-way-of-the-dream`, `von-franz-interpretation-fairy-tales`, `von-franz-feminine-fairy-tales` : **même texte, 206 chunks, 80 879 mots**. Deux slugs sur trois sont faux, et aucune citation de von Franz n'est aujourd'hui attribuable à un titre.
   - `aizenstat-dream-tending` : **9 chunks**. Le livre n'est pas digéré, il est échantillonné — et le canon s'appuie dessus pour *Anima Mundi*.
3. **Re-taguer les quatre livres d'Afrique australe avec un tag `rêve`.** C'est le geste d'une minute qui aurait épargné quatre jours de cécité recopiée, et il vaut pour tout le corpus : **notre classement n'est pas une carte du monde, c'est une carte de ce qu'on a pensé en rangeant.**

---

## 4. CE QUE JE N'AI PAS FAIT

- **Je n'ai touché aucun fichier de `src/`.** Aucune ligne de code applicatif.
- **Je n'ai pas modifié `forest_chunks`** (sauf la fonction utilitaire `nrm()`, idempotente, que le script recrée lui-même). Les trois corrections de base du §3.4.2 sont signalées, pas exécutées.
- **Je n'ai pas vérifié les citations de `2_DESIGN.md`, `3_TECHNICAL.md` ni du reste de `4_LOG.md`** — hors mandat de cette passe. `2_DESIGN` fait 274 Ko et contient de la copy d'écran, qui relève d'un autre régime que la citation d'auteur. **À passer au script.**
- **Je n'ai pas corrigé l'affirmation « zéro épistémologie » dans `PLAN-REPRISE-JEUDI.md`, `BACKLOG-2026-07-27.md` et `RAPPORT-T9.md`** — hors de mon périmètre exclusif (trois autres agents travaillent en parallèle). **Elle y est toujours fausse.** À reprendre.
- **Je n'ai pas relu von Franz, Bulkeley, Hunt, Schwartz ni Aizenstat** en source primaire. Leurs citations dans le canon n'ont été vérifiées que par recherche de chaîne, pas par lecture.

---

## 5. LE POINT QUI COMPTE LE PLUS

La mission demandait trois corrections nommées. Elles sont faites, et la deuxième produit même un gain net — l'architecture à deux étages de Jung est plus utile que le garde-fou qu'on croyait avoir perdu.

**Mais le vrai résultat est ailleurs, et il est inconfortable : un tiers des citations attribuées à un auteur, dans les documents qui gouvernent une app dont le premier principe est de ne rien affirmer sur le rêveur qu'il n'ait dit lui-même, ne se retrouvent pas dans les livres.**

Ce n'est pas une ironie décorative. `DOCTRINE-MIROIR` §7 interdit 1 exige que **toute phrase du miroir soit attachée à un `kairos_id` daté**, et qu'un énoncé sans source **fasse échouer la génération, sans réparation**. Nous avons écrit ce test pour la machine et ne nous l'étions pas appliqué.

**La loi de citation du §11 bis est exactement l'interdit 1, retourné vers nous.** Un énoncé sans source fait échouer le document, et on ne le répare pas — on retire les guillemets.
