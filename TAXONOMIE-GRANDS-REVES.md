# TAXONOMIE — LES GRANDS RÊVES

> **Statut** : arbitrage livré, à valider par Tim.
> **Date** : 2026-07-26 · **Auteur** : Yeshua (Opus, agent A3 / flotte de 8).
> **Mandat** : Tim — « il faut absolument pouvoir flag des rêves comme des "grands rêves" "rêves initiatiques" ou je sais pas comment les nommer, ou combien de flag créer différent ».
> **Nature** : doc de travail. À absorber dans `2_DESIGN.md` (§ marquage) + `1_BIBLE.md` (§3.1.ter voisin) après validation, puis `_archive_pre_canonical/`.

---

## 0 — La question posée

Tim ne sait pas combien de flags créer ni comment les nommer, et il le dit. Ce doc tranche.
Deux contraintes gouvernent l'arbitrage, et elles tirent en sens opposé :

- **Tim veut de la nuance** — « grands rêves », « rêves initiatiques », et des rêves « d'une puissance symbolique incroyable que je suis loin d'avoir fini d'intégrer ». Trois choses différentes dans une seule phrase.
- **Le rêveur au réveil ne classe pas.** Il est 6 h, il a 40 secondes de mémoire du rêve avant qu'elle s'efface. Toute taxonomie présentée à ce moment-là est une taxe.

La sortie de la tension n'est pas un compromis sur le nombre de flags. Elle est **temporelle** :
**le marquage n'a pas lieu au réveil.** Un grand rêve ne se reconnaît pas au dépôt — il se reconnaît à la relecture, parfois des années après. Le geste vit donc sur la **fiche du rêve**, jamais dans le flux de dépôt. Une fois ce déplacement fait, la contrainte « 6 h du matin » tombe, et on peut se permettre une nuance — à condition qu'elle reste **optionnelle et postérieure**.

---

## 1 — L'ARBITRAGE : une marque, trois nuances facultatives, zéro nouveau flag pour l'interprétation

### 1.1 La marque — UNE, binaire, un tap

> **« un grand rêve »**

- **Colonne** : `kairos.user_marked_numinous` — **celle qui existe déjà**. Aucun nouveau booléen.
- **Geste** : un tap sur la fiche du rêve. Réversible par un second tap. Pas de modale, pas de confirmation, pas de question.
- **Effet** : le rêve entre dans le journal à part. C'est tout.

**Pourquoi ce mot.**
- C'est **le mot de Tim**, verbatim dans le brief — et, ce qui a emporté la décision, **c'est déjà son mot à lui dans ses propres dépôts** : « Mon grand rêve, je me souviens j'étais dans une école… » (rêve du 24/04), « Le rêve d'une exprès, un grand grand rêve, une sorte de voyage » (Fuite du Mexique). Le vocabulaire de l'app doit être celui du rêveur, pas celui qu'on lui apprend. Il l'est déjà.
- Il passe la **loi §0.1** (`DREAM-MVP-SPEC-ECRANS-A-Z.md`) : niveau WhatsApp/Insta/Outlook, compris par un enfant de 12 ans et un parent de 60 ans. Deux mots courants, zéro jargon.
- Il ne viole aucun banni. Rappel de la liste : *seuil, posé, tenir, geste (comme concept), honorer, oraculaire, **numineux**, polyphonie, substrat, transmutation*.

**L'ambiguïté assumée** : en français, « mon grand rêve » peut vouloir dire « mon ambition ». Le contexte la dissout entièrement (on est sur la fiche d'un rêve de nuit, dans un journal de rêves). Signalée ici pour qu'on ne la redécouvre pas dans six mois comme un bug.

### 1.2 Les nuances — TROIS, facultatives, jamais au moment de marquer

Elles n'apparaissent **qu'après** que le rêve est marqué, repliées sous la marque. Ne rien choisir est un état normal et définitif — le rêve est un grand rêve, point.

| Valeur DB | À l'écran | Ce que ça capte |
|---|---|---|
| `change` | **« ça m'a changé »** | le rêve qui fait un avant/après — ce que Tim appelle « initiatique » |
| `force` | **« ça me donne de la force »** | celui vers lequel on revient quand c'est dur — le rêve qui « illumine le chemin au quotidien » |
| `ouvert` | **« je n'ai pas fini de le comprendre »** | Tim, verbatim : « d'une puissance symbolique incroyable que je suis loin d'avoir fini d'intégrer » |

**Le geste de design qui compte ici** : ce ne sont **pas trois catégories de rêve**. Ce sont trois **effets sur le rêveur**. La différence n'est pas cosmétique — elle est la red line n°5 de `safety-checks.json` (« jamais de dictionnaire de symboles plat ») appliquée à la taxonomie elle-même. L'app ne dit jamais *ce qu'un rêve est*. Elle enregistre *ce qu'il fait à celui qui l'a rêvé*. Un rêve « initiatique » serait un verdict de l'app sur le rêve ; « ça m'a changé » est un témoignage du rêveur sur lui-même. Seul le second est légitime.

**Multi-sélection** : un rêve peut à la fois avoir changé quelqu'un et lui donner de la force. D'où `text[]`, pas un `enum` unique.

**Justification du nombre — je dois défendre chacune.** La règle que je me suis donnée : *une nuance ne survit que si elle change ce que l'app fait, pas seulement ce qu'elle affiche.*
- `force` **pilote la consultation** : sur un chant du cœur en détresse, ces rêves-là remontent en premier (bonus explicite au re-ranking). Fonctionnelle. Gardée.
- `ouvert` **pilote la relecture** : c'est le seul marqueur qui dit « ce rêve a encore du travail à faire sur moi » — il alimente la relecture « à la lumière du présent » (§12bis.B, déjà câblée) et justifie qu'un vieux rêve remonte sans être « pertinent » au sens sémantique. Fonctionnelle. Gardée.
- `change` **ne pilote rien** techniquement — et je la garde quand même, en assumant l'exception : c'est la seule qui nomme ce que Tim a demandé en premier (« rêves initiatiques »), et un journal de grands rêves où l'on ne peut pas distinguer les 3 rêves fondateurs des 30 rêves forts n'est plus un journal de grands rêves. Elle sert le tri et la lecture, pas le moteur. Si à l'usage elle n'est jamais posée, c'est elle qu'on supprime en premier.

### 1.3 La note — les mots du rêveur

`great_dream_note text` (≤ 600 caractères) — **« pourquoi celui-là »**.

Facultative, éditable à vie. Deux fonctions, et la seconde n'est pas décorative :
1. C'est ce que le rêveur veut se rappeler quand il rouvrira ce rêve dans dix ans.
2. **C'est le meilleur signal de tout le système pour la consultation.** Le texte brut d'un rêve est du récit ; la note est déjà de l'interprétation vécue, dans les mots du rêveur. Au re-ranking, elle pèse plus lourd que le corps du rêve.

### 1.4 L'interprétation gardée — ZÉRO nouveau flag

Tim : « il faut un système de "flag" où même une interprétation de rêve peut être enregistrée et gardée en note spéciale ».

**Ça existe déjà et c'est câblé.** `kairos_interpretations` a `status` (`'proposed' | 'kept'`) et `kept_at`. L'écriture passe par `/api/mvp/interpretations`, l'affichage par `src/components/KeptInterpretation.tsx` sur la fiche du rêve. 1 interprétation gardée en base sur le compte de Tim.

Ce qui manque n'est pas un flag : **c'est que la chose gardée ne vit nulle part ailleurs que sur son rêve.** On la garde, puis on ne la revoit que si on rouvre exactement ce rêve-là. Le journal des grands rêves lui donne sa seconde section. Aucune colonne ajoutée — une colonne l'aurait dupliquée.

### 1.5 L'asymétrie IA / rêveur — rendue visible

C'est le point où le système se salit facilement. Aujourd'hui il est **déjà sali** : `page.tsx` écrit trois fois `(k.numinosity_score ?? 0) >= 0.7 || k.user_marked_numinous`. Les deux sont traités comme la même chose. Ils ne le sont pas.

| | Origine | Mot à l'écran | Autorité |
|---|---|---|---|
| `numinosity_score ≥ 0.7` | calculé par l'IA | **« rayonne »** (déjà en place) | **suggestion** |
| `user_marked_numinous` | tap du rêveur | **« un grand rêve »** | **décision** |

**Règle dure : seule la décision fait entrer dans le journal.** Aucun rêve n'y entre par le score. Sur un rêve où l'IA a mis ≥ 0.7 sans que le rêveur ait marqué, la commande de marquage porte une mention basse et grise — « ce rêve rayonne » — et rien d'autre ne se passe. **Une invitation, jamais une entrée.**

Note d'état honnête : sur le compte de Tim, **52 rêves sur 64 ont un `numinosity_score` à 0.00** (le pipeline n'est jamais passé sur l'import — c'est le chantier de l'agent A2). L'invitation ne se déclenchera donc quasiment jamais aujourd'hui. Ce n'est pas grave : c'est un ornement, pas un rouage. **Rien dans ce que je livre ne dépend de `numinosity_score`** — ni le flag, ni le journal, ni le classement de la consultation. C'était une condition de conception, pas une conséquence.

### 1.6 Quand la marque arrive tard

`marked_great_at timestamptz` — posé automatiquement par trigger au passage `false → true`, remis à `NULL` au retrait.

Sans lui, un rêve de 2019 marqué en 2026 est indiscernable d'un rêve de 2019 marqué en 2019, et le journal ne peut pas raconter le seul truc intéressant : **le moment où on a compris**. Avec lui, la fiche peut dire « rêvé en mars 2019 · reconnu en juillet 2026 ». C'est exactement le cas que Tim décrit.

Le journal se trie **par date de rêve** par défaut (c'est un journal, pas un flux d'activité), avec bascule sur la date de reconnaissance.

---

## 2 — CE QUE J'AI ÉCARTÉ, ET POURQUOI

| Écarté | Raison |
|---|---|
| **Une table `kairos_flags`** (N flags extensibles par rêve) | Il y a exactement **une** marque. Une table impose une jointure à chaque lecture, duplique `user_id`, exige ses propres RLS **et GRANTs** — et l'historique récent du projet est sans appel là-dessus : 11 tables du schéma `community` ont la RLS sans GRANT `SELECT`, et les lectures échouaient **en silence**. Surtout : une table de flags *invite* la prolifération de flags. C'est le mode d'échec exact qu'on veut éviter. Des colonnes sur `kairos` sont 1-à-1, gratuites à lire, et impossibles à faire proliférer sans migration. |
| **Un nouveau booléen `is_great_dream`** | Deux colonnes pour la même vérité divergent, toujours. `user_marked_numinous` est déjà lu par `page.tsx` (×3), par le PATCH `/api/kairos/[id]`, et par la RPC `list_kairos_numinous`. Construire dessus = le badge s'allume partout dès le premier tap, sans toucher à une ligne de l'existant. |
| **5 catégories** (initiatique / guérison / prophétique / rencontre / avertissement) | C'est l'app qui classe le rêve. Red line `safety-checks.json` : « jamais de dictionnaire de symboles plat », « jamais d'interprétation autoritaire top-down ». Et c'est 5 décisions à un moment où le rêveur en veut zéro. |
| **« favori » / une étoile** | Fait du corpus une médiathèque. Une étoile appelle une échelle de notation, et §0.5 interdit score et classement. Le mot est plat là où l'objet ne l'est pas. |
| **« rêve initiatique » comme mot d'écran** | Échoue §0.1 (jargon). Et c'est une affirmation lourde à porter sur son propre rêve au moment où on le marque — beaucoup s'abstiendront par humilité. Le mot survit comme *nuance* (« ça m'a changé »), pas comme *porte d'entrée*. |
| **Réutiliser « rayonne » pour la marque du rêveur** | « rayonne » est déjà le mot de l'IA (score ≥ 0.7), affiché en Forge et en Journal. Le réutiliser détruit l'asymétrie du §1.5, qui est le cœur éthique de la fonction. |
| **Une échelle (1–3 étoiles, « grand » / « très grand »)** | §0.5 : zéro score, zéro classement. Et hiérarchiser ses propres rêves entre eux est une opération que personne ne veut faire. |
| **Marquer au moment du dépôt** (chip dans PostDépôt) | À 6 h on ne sait pas encore. On produirait des faux positifs — et pire : ne pas marquer deviendrait un jugement porté sur son propre rêve, chaque matin. Le marquage vit **uniquement** sur la fiche, là où la relecture a lieu. |
| **Le mot « numineux »** | Banni définitif, §0.1. Il reste en base (`user_marked_numinous`, `numinosity_score`) — invisible du rêveur, c'est sa place. |

---

## 3 — LE JOURNAL À PART

**Nom d'écran : « Les grands rêves ».** Deux sections, un seul défilement.

1. **Les rêves marqués** — chacun avec son titre, sa date de rêve, sa note s'il y en a une, ses nuances s'il y en a.
2. **Ce que j'ai gardé** — les interprétations `status='kept'`, chacune reliée à son rêve.

**Contraintes tenues** (elles viennent du brief) :
- **Beau vide.** L'état vide n'est pas une erreur, c'est l'état normal des premières semaines. Il ne montre ni bouton d'action ni tutoriel — une phrase, et le silence. Le journal ne se remplit pas sur commande.
- **Pas une liste de favoris Spotify.** Pas de vignettes en grille, pas de compteur, pas de « 12 rêves », pas de tri par popularité. Une colonne, du texte, beaucoup d'air. Chaque rêve occupe la largeur — on n'en survole pas 40, on en relit un.
- **Ça doit donner envie d'y revenir.** Le levier retenu n'est pas visuel, il est temporel : le journal ouvre sur **un** rêve, tiré au sort parmi les marqués, avec sa date. Pas un « rêve du jour » gamifié — juste : la première chose qu'on voit en entrant est un rêve, pas une liste. C'est le seul mouvement de l'écran.
- φ/Fibonacci (`DESIGN-MATHEMATIQUES-SACREES.md`) et les tokens de `src/lib/dream-design.ts` — à la lettre, aucune valeur inventée.

---

## 4 — LA CONSULTATION À DOUBLE LECTURE

Le rêveur dépose une difficulté (un « chant du cœur »). L'app rend **deux lectures séparées, jamais fusionnées** :

- **Lecture A — les grands rêves** : parmi les rêves marqués uniquement.
- **Lecture B — tout le reste** : rêves + kaïros, sans filtre de grandeur, excluant ce qui est déjà en A.

Deux colonnes distinctes parce que ce sont deux natures de réponse : A est ce que le rêveur a lui-même désigné comme important ; B est ce que le corpus propose. Les mélanger reviendrait à laisser l'algorithme diluer la décision du rêveur.

### 4.1 Le critère d'acceptation, littéral

Tim : *« il faudrait juste que l'IA soit vraiment bonne à ne pas me ramener du bruit mais du contenu de très haute qualité pour me soutenir. »*

Traduit en règle d'ingénierie : **mieux vaut 1 rêve juste que 4 rêves plausibles. Zéro est une réponse valide.** (`1_BIBLE.md` SILENCE_AS_FEATURE : « Ton sol est encore peu peuplé sur cette question. »)

### 4.2 Pourquoi l'embedding seul ne suffira pas — mesuré, pas supposé

Le corpus de Tim est de la transcription vocale brute. Les rêves commencent par de la méta-narration : *« Je viens de passer dix minutes à raconter mon rêve mais ça n'a pas enregistré »*, *« J'ai un effort pour essayer de raconter les rêves, donc ça fait trop longtemps que je ne le fais plus »*, *« Journale de rêve, 13 janvier »*. Plusieurs entrées contiennent **plusieurs rêves** (jusqu'à 10 895 caractères). Un embedding de document entier mélange le récit, le bruit de cadrage et trois rêves distincts en un seul vecteur. Le cosinus ne peut pas séparer ça — c'est aussi ce que mesure A2 de son côté.

### 4.3 L'architecture retenue : rappel large, puis coupe franche

```
chant du cœur
   ↓ embedding (text-embedding-3-small, comme le reste de l'app)
   ↓ RPC find_great_dreams_for_situation  ← rappel LARGE, seuil bas (0.05)
   ↓   scope 'great' → uniquement les marqués   (Lecture A)
   ↓   scope 'all'   → tout le corpus            (Lecture B)
   ↓ re-ranking LLM (Sonnet), consigne stricte, JSON
   ↓ COUPE : garde ≤ 3 par lecture, et UNIQUEMENT ce que le LLM note ≥ 3/5
   ↓ 0 retenu → silence explicite, pas de repli sur le meilleur mauvais
```

Points non négociables du re-ranking :
- Le LLM reçoit la consigne d'**ignorer la méta-narration** (« ça n'a pas enregistré », « journal de rêve du 13 janvier ») et de juger sur la matière du rêve.
- Il doit pouvoir répondre **liste vide**. La consigne le dit explicitement, avec un exemple.
- Il rend, pour chaque rêve retenu, **une ligne de raison factuelle** — ce qui est *dans* le rêve et qui touche la situation. Pas une interprétation.
- La note de grand rêve (§1.3) et la nuance `force` (§1.2) lui sont fournies et pèsent dans son jugement.

### 4.4 Le garde-fou de sens — la ligne à ne pas franchir

**L'app RAMÈNE le rêve. Elle ne le traduit pas.**

Interdit au modèle, en dur dans le prompt système (`safety-checks.json`, red lines 5 et 6) :
- dire ce que le rêve **veut dire** pour la situation,
- relier symbole et situation par un « c'est-à-dire », « cela symbolise », « ton inconscient te dit »,
- psychologiser le rêveur (« tu es en évitement », « tu projettes »),
- diagnostiquer, prédire, rassurer par un verdict.

Autorisé : nommer **ce qui est dans le rêve** (« il y a une école, une course pour retrouver quelqu'un, et tu n'y arrives pas ») et **s'arrêter là**. Le rapprochement est fait par le rêveur, pas énoncé par la machine. C'est P-Inversion (`1_BIBLE.md` §2.2) : l'app rappelle au rêveur ce qu'il a déjà perçu, elle ne lui apprend rien sur lui.

Aucune question posée non plus en fin de lecture : ce serait de l'orientation. La consultation rend des rêves, et se tait.

### 4.5 Cadence

3 consultations par jour (`1_BIBLE.md` §3.1.ter : « pas d'illimitisme… sinon addiction-light, dépendance à la révélation »). Constante unique en tête de fichier, changeable en une ligne.

---

## 5 — CE QUE ÇA DONNE, EN UNE PAGE

| Objet | Où c'est stocké | Qui décide | Mot à l'écran |
|---|---|---|---|
| La marque | `kairos.user_marked_numinous` *(existant)* | le rêveur, 1 tap | **un grand rêve** |
| Quand elle est arrivée | `kairos.marked_great_at` *(nouveau)* | trigger | *rêvé en… · reconnu en…* |
| La nuance | `kairos.great_dream_facets text[]` *(nouveau)* | le rêveur, facultatif | ça m'a changé · ça me donne de la force · je n'ai pas fini de le comprendre |
| Les mots du rêveur | `kairos.great_dream_note` *(nouveau)* | le rêveur, facultatif | **pourquoi celui-là** |
| L'interprétation gardée | `kairos_interpretations.status='kept'` *(existant)* | le rêveur | **ce que j'ai gardé** |
| La suggestion de l'IA | `kairos.numinosity_score` *(existant)* | l'IA | *ce rêve rayonne* — invitation, jamais entrée |

**Nouvelles colonnes : 3. Nouveaux booléens de marquage : 0. Nouvelles tables : 1** (`great_dream_consultations`, pour la cadence et la mémoire des consultations — pas pour les flags).

---

## 6 — CE QUI RESTE OUVERT (pour Tim)

1. **« grand rêve » ou autre chose ?** J'ai tranché pour le mot que Tim emploie déjà spontanément en dictant ses rêves. Si un autre mot vient, c'est une ligne d'i18n — la base ne bouge pas.
2. **La nuance `change` mérite-t-elle de vivre ?** C'est la seule des trois qui ne pilote rien techniquement (§1.2). À supprimer en premier si elle n'est jamais posée.
3. **Le journal doit-il être un 5ᵉ onglet de nav ?** Je ne l'ai pas mis : la nav est à 4 et §0.5 dit une idée par écran. Il est proposé en entrée depuis le Journal. Si Tim veut l'onglet, c'est trivial — mais il faudra en retirer un.
4. **La consultation depuis l'écran Cœur** est proposée sous le dépôt, pas à la place. L'écran Cœur reste un écran de dépôt, pas un écran de requête.
