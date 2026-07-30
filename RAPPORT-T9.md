# RAPPORT T9 — les sept principes au canon

> 2026-07-30. Branche `yeshua/canon-sept-principes`, commit `f07baa7`. **Non poussé** (pas de clé SSH depuis cet agent).
> Quatre documents touchés, **aucune ligne de `src/`**. Trois agents travaillaient en parallèle sur le code pendant cette session ; rien de ce qui suit ne croise leur chemin.

---

## 1. CE QUI A ÉTÉ ÉCRIT, ET OÙ

### La souche est au-dessus, pas à côté

Le principe 1 n'est pas entré dans la liste des principes structurants (§5) ni dans une nouvelle section. Il est entré **au-dessus des trois méta-principes**, en `1_BIBLE` **§2.0**, avec une ligne qui change la hiérarchie du document :

> *Quand un principe inférieur entre en tension avec les méta-principes, ils priment. **Quand les trois entrent en tension avec la souche, la souche prime.***

C'est ce que Tim demandait en disant *« ça résume très profondément la nature de l'app »*. Un principe qui résume la nature d'une chose ne se range pas à côté des autres. §2.0 porte la citation de Hillman, le tableau **RENDRE / RELIER / CONCLURE**, la porte lexicale qui le rend opposable, et un dernier paragraphe qui montre comment chacun des six autres en découle ou le sert — parce que sans ça, « principe-souche » n'aurait été qu'un adjectif.

### Les six autres

`1_BIBLE` **§3.15**, une section neuve après la double lecture. Chacun porte **sa source lue** et **sa vérification qui échoue** — la règle du 26/07 appliquée sans exception.

| # | Principe | Source | Test qui échoue |
|---|---|---|---|
| 2 | Biais d'ascension | Weller p. 21 | assertion de schéma (aucun champ de progression) + porte lexicale |
| 3 | L'insistance | mesure du corpus 26/07 + Kalsched | détection sur `recit_only_text`, jamais sur `motif_tags` |
| 4 | Loi des 16 fruits | code des 16 fruits, vérifié entrée par entrée | test de navigation : le miroir n'a pas d'onglet |
| 5 | Beau par montage | Bachelard + §0.1 | toute phrase est soit citation datée, soit auto-limitation |
| 6 | Sortie vers un humain | Weller p. 74 / p. 116 · Kalsched p. 214 | test de route : ressource dans la même charge utile |
| 7 | Le 18ᵉ fruit, « Le Fil » | méta-plénière du 19/04 | aucun producteur de Fil dans la table des tâches |

Plus **§3.15.7**, les quatre arbitrages : traçabilité · porte somatique · « qu'il repose » · le fil « rêve ».

### Le reste

- **`1_BIBLE`** — durcissements §8.2 (le biais d'ascension ajoute la raison clinique à la raison éthique), §8.3 (« qu'il repose »), §8.7 (la sortie humaine dans le même écran sur la matière lourde). Glossaire enrichi de six entrées : *Biais d'ascension · Le Courant · Le Fil · L'insistance · Qu'il repose · Weave*.
- **`2_DESIGN`** — **§17** neuf, neuf sous-sections : le miroir comme document et non comme écran · l'ouverture par une image · le montage et sa mise en page · l'insistance sans couleur ni taille proportionnelle · la porte somatique dans le même écran · la sortie humaine · « qu'il repose » · **le nommage** · ce que ce §17 ne dit pas. Plus **cinq anti-patterns** (26 à 30) au §9.
- **`4_LOG`** — entrée du 30/07 **en haut**, cinq parties : les sept principes · le virage du 27/07 · les sept contradictions · la compression · ce qui reste ouvert.
- **`DOCTRINE-MIROIR`** — quatre corrections de source, deux arbitrages intégrés, §13 refondu en trois blocs (ouvertes · closes le 30/07 · neuves depuis le 27/07).

---

## 2. LE BILAN DE LIGNES, PAR DOCUMENT

| Doc | Avant | Après | Ajoutées | Retirées | Solde |
|---|---|---|---|---|---|
| `1_BIBLE.md` | 1458 | **1531** | 180 | 107 | **+73** |
| `2_DESIGN.md` | 2948 | **3004** | 132 | 76 | **+56** |
| `4_LOG.md` | 4707 | **4820** | 113 | 0 | **+113** |
| `DOCTRINE-MIROIR.md` | 591 | **632** | 60 | 19 | **+41** |

**Je n'ai pas tenu la parité, et je préfère le dire que le maquiller.** Le détail est au §4 ci-dessous.

---

## 3. LES COUPES, JUSTIFIÉES UNE PAR UNE

**`1_BIBLE`**

- **§18 et §19 fusionnés** (−35 lignes environ). Les deux refontes d'avril étaient racontées **une troisième fois**, après `4_LOG` (qui a les entrées datées) et après `2_DESIGN` (qui a les specs). Elles ne portaient aucun arbitrage propre. Ce qui survit du 28/04 est ce qui est encore une règle : *une profondeur non découvrable n'existe pas*, la polyphonie dans le chat, le geste unique, les quatre anti-patterns.
- **§3.5.4 dédoublonné avec §6.1** (−12). Douze voix décrites deux fois dans le même document. Ne restent que les quatre qui sont **propres au moteur** et qu'on ne lit nulle part ailleurs : Bateson, Lakoff, Hofstadter, Larsen.
- **§3.1.ter, les trois exemples de polyphonie** (−22). Ce sont des exemples de **ton**, donc du ressort de `2_DESIGN`, et ils ne portaient aucun arbitrage. J'en ai profité pour corriger le titre : la section était intitulée `[ABSORBÉ] → voir §3.10`, ce qui était trompeur — elle porte SILENCE_AS_FEATURE et la règle du test qui échoue, deux choses qui n'existent nulle part ailleurs. Elle n'était pas absorbée du tout.
- **§4** ramené à ce qui n'est pas déjà dans §3.13 (−25), l'articulation promue en tête de section.
- **§14** transformé de synthèse en **index** — 14 renvois d'une ligne au lieu de 13 paragraphes qui redisaient §0.1, §1.5, §8 et §11.
- **Glossaire** : deux entrées « Big Dream » fusionnées.

**`2_DESIGN`**

- **§11.bis.20.20, la roadmap des sprints A→F** (−48). Exécutée entre le 28 et le 29/04, et racontée dans `4_LOG`. *Une roadmap exécutée survit dans un document de design comme une carte périmée qu'on continue de lire.* Seul le critère de merge est gardé, parce que c'est une règle et non un plan : **pas de merge si Tim teste et donne moins de 7/10.**
- **§11.bis.20.22** compressé (−22), dont le pricing marqué périmé sur place plutôt que supprimé.
- **Anti-patterns 6 et 22 fusionnés** — c'était deux fois le même. Le 22 garde une ligne qui dit où il est parti : un anti-pattern qui disparaît sans trace revient six mois plus tard sous un autre nom.

**`DOCTRINE-MIROIR`**

- **§9, exemple 3** (−12) : il reproduisait §4.2 **mot pour mot**. Un exemple recopié dans le même document se met à diverger dès la première retouche.

---

## 4. POURQUOI JE N'AI PAS TENU LA PARITÉ

La consigne était de sortir plus léger ou à taille égale. Je sors **+283 lignes sur quatre documents**, dont 113 pour l'entrée de log.

Ce que j'ai à dire là-dessus, sans me défendre plus que nécessaire :

1. **Le log est additif par construction.** Sa règle propre est *ANTI-PERTE TOTAL*. Compresser une entrée ancienne pour financer une entrée neuve serait une contorsion comptable, pas de la compression.
2. **Sept principes qui portent chacun leur source lue et sa vérification exécutable coûtent ce qu'ils coûtent.** Un principe sans son test est un vœu — c'est la règle du 26/07. Écrire les sept sans leurs tests aurait tenu le compte de lignes en produisant exactement ce que cette règle interdit : de la morale au lieu d'un garde-fou.
3. **Les vraies réserves restantes demandent Tim, pas un agent.** Elles sont identifiées et je les laisse en l'état :
   - **`2_DESIGN` §7.7.bis** — 103 lignes de spec d'écrans de cercles **qui n'ont jamais servi** (0 message mesuré) et qui vont être refondus sous Weave avec un principe fondateur différent (l'intention). C'est la coupe la plus rentable du dépôt et c'est un arbitrage produit.
   - **`2_DESIGN` §7.8** — 128 lignes sur Anima Mundi V1.
   - **`1_BIBLE` §3.5.2** — les 16 types de pattern echoing, un catalogue qui a probablement sa place dans `3_TECHNICAL`.

J'ai préféré rendre un canon complet et signaler trois coupes possibles, plutôt que de rendre un canon amputé et un beau chiffre.

---

## 5. LES CONTRADICTIONS TROUVÉES ENTRE CANONIQUES

Sept, toutes nées de l'écriture en parallèle du 26/07. Aucune n'est laissée ouverte sans le dire.

**1. `1_BIBLE` §3.4.1 citait une source que personne n'a lue.** La ligne affirmait que le tour de parole à ouverture différée *« est structurellement le protocole d'Ullman »*. **Ullman n'est pas dans la Forêt** — zéro digest, quatre mentions du nom, dont une comme item *non digéré* de `BOOK-LIST-DREAM.md`.
→ **Affirmation retirée**, avec la raison écrite sur place. Elle est probablement juste ; elle n'est pas sourcée, donc elle ne se cite pas. Refondée sur **Taylor** (le groupe ne protège que par la pluralité de projections qui s'annulent — d'où le seuil dur à 3) et **Moss** (le partage comme événement rare et cadré), qui sont lus tous les deux.

**2. `DOCTRINE-MIROIR` §0 s'était sur-vendue sur Weller.** Elle écrivait *« une app peut faire la contenance, elle ne peut pas faire la libération »*. Le texte intégral dit l'inverse : chez Weller (p. 73-74) la contenance est **ce qui permet de lâcher**, un endroit où tomber. Une app ne rattrape personne — elle produit exactement le mode d'échec qu'il nomme p. 74, *« par défaut, nous devenons le contenant nous-mêmes »*.
→ **Corrigé, et un troisième terme inventé honnêtement plutôt qu'emprunté** : l'app ne fait ni l'une ni l'autre, **elle garde et elle rend**. C'est déjà ce que dit `1_BIBLE` §0.1. C'est aussi ce qui fonde le principe 6.

**3. `DOCTRINE-MIROIR` §8.2 était trop sévère avec elle-même.** Elle disait *« aucun livre de la Forêt ne fonde ce §8 »*. Faux pour l'asymétrie (a) : **Weller p. 92** la fonde textuellement, avec la *premature revelation*.
→ **Allégée d'un cran, sur ce point seulement.** Les trois autres asymétries restent non mesurées et le disent.

**4. `DOCTRINE-MIROIR` §3.1 mettait entre guillemets une phrase de Weller qui n'en est pas une.**
→ **Guillemets retirés**, thèse restituée avec sa page. Dans un document qui interdit d'inventer une source, une citation fabriquée était l'erreur la plus coûteuse possible.

**5. `1_BIBLE` §17.1 contredisait §8.2 depuis avril, sur un mot.** La sous-app Lucid Dream listait un **« streak »** dans ses statistiques. §8.2 interdit les streaks, absolument, sans exception écrite.
→ **Exception nommée et bornée plutôt que niée.** Les stats de lucidité sont un tableau de bord d'**entraînement** — pour soi seul, jamais comparatif, jamais de push, **jamais sur la matière onirique elle-même**. Et la frontière est écrite noir sur blanc : *si elles débordent un jour sur le contenu des rêves, elles tombent sous l'interdit.* C'est exactement là que passe la ligne avec le biais d'ascension, et elle est fine.

**6. Deux modèles économiques coexistaient depuis trois mois.** `2_DESIGN` §11.bis.20.22 (7 €/mois après 14 jours d'essai, 28/04) contre `1_BIBLE` §9 (abonnements + crédits Forge, mega-freemium, 26/07).
→ **`1_BIBLE` §9 fait foi.** Le chiffre d'avril est **marqué périmé sur place, pas supprimé** — pour que personne ne le recite en le retrouvant. ⚠️ **Ce n'est pas un arbitrage de ma part** : c'est l'application de la règle de préséance par date. Si Tim voulait garder le modèle d'avril, c'est à lui de le dire.

**7. `2_DESIGN` §9 portait deux fois le même anti-pattern.** `PROPHETIC_NOTIFICATION_PUSH` (n°6) et `PROPHETIC_PUSH_NOTIFICATION` (n°22).
→ **Fusionnés dans le n°6**, le n°22 garde une ligne de renvoi.

**Et une contradiction que Tim a lui-même tranchée, que je consigne comme telle** : `FAISABILITE-MIROIR` §4.2 concluait que le fil « rêve » était un **défaut de méthode** (*« un miroir de la psyché qui parle surtout de la façon dont on tient le miroir a raté quelque chose »*). Tim dit *« ça touche plutôt au cœur »*. **C'est du matériau, pas du bruit.** Écrit en `1_BIBLE` §3.15.7d avec la mention explicite que ça contredit le rapport, qui reste au dossier avec sa mesure.

---

## 6. LE VIRAGE DU 27/07, CONSIGNÉ

`4_LOG` §2 de l'entrée du 30/07. Écrit sans l'adoucir, parce que c'est la critique la plus utile reçue sur ce projet depuis avril.

- **Le reproche est fondé et vérifiable** : les 18 digests de `DOCTRINE-MIROIR` §11 sont tous de la clinique occidentale du XXᵉ. Les traditions ont été traitées comme un risque éthique à gérer, jamais comme une source de sagesse de design. **Aucun des huit agents du 26/07 ne l'a remarqué.**
- **La raison structurelle est écrite parce qu'elle commande la suite** : toute la psychologie des profondeurs occidentale **suppose que le rêve appartient à une psyché individuelle**. C'est l'hypothèse qui casse dès qu'on veut du rêve partagé en groupe avec une intention — c'est-à-dire dès qu'on veut Weave. Ce n'est pas une bibliographie à compléter, **c'est une ontologie qui manque**, et ça explique rétrospectivement pourquoi les cercles n'ont jamais démarré : on a essayé de construire du collectif avec une doctrine bâtie sur l'individu.
- **Le trou d'intégrité** : zéro épistémologie du rêve d'Afrique australe, alors qu'INFUSE vend des plantes de rêve xhosa/zulu (Ubulawu). Problème d'intégrité avant d'être une lacune.
- **La correction sur les Senoi** : matériel de **Kilton Stewart**, académiquement tenu pour largement fictif. Moss, c'est l'Active Dreaming adossé à l'iroquois avec bénédiction d'aîné — que nous n'avons pas, étant source secondaire. Ne jamais les citer comme un même adossement.
- **Ce que le virage ne remet pas en cause, et je le défends** : les sept principes tiennent, parce qu'ils portent tous sur ce que l'app **n'a pas le droit de faire** à un rêveur. Sur ce terrain précis, la clinique occidentale est la source la plus qualifiée qui soit — c'est elle qui a produit les dégâts qu'elle décrit. **Ce que le virage ouvre, c'est le versant collectif, sur lequel le canon actuel est muet.**

---

## 7. CE QUE JE LAISSE OUVERT POUR TIM

1. **[À TRANCHER n°8] — l'écran du Cœur est plein.** 9 éléments sur 9 (§16.4). Le principe 6 exige que la sortie vers un humain soit dans le même écran sur la matière lourde. **Lequel des neuf meurt ?** Ma recommandation : le second lien secondaire. À décider **avant** de coder, pas en le découvrant.
2. **[À TRANCHER n°9] — « Weave » reste en anglais** dans l'app française. Je l'ai assumé faute d'équivalent français qui soit un acte (« Tissage » est une chose, « Tisser » un infinitif nu). Mais c'est ton oreille qui tranche, sur ton téléphone.
3. **Le pricing (contradiction n°6).** J'ai appliqué la préséance par date, pas un jugement. Si le modèle d'avril doit revivre, dis-le.
4. **Le plancher de corpus** reste sans mesure. La piste du 27/07 le résout mieux qu'un chiffre : **un parcours initiatique avant les miroirs**. Ce n'est plus un seuil arbitraire, c'est une aventure traversée. Reste à concevoir.
5. **La grande recherche sur le rêve collectif est bloquée par un préalable** : plusieurs livres majeurs sont en base sous une forme illisible (`hillman-dream-and-the-underworld` : 231 chunks, **254 mots au total**). **⚠️ Ce que ça fait à la doctrine, précisément : rien.** Elle est fondée sur les **digests**, qui sont sains — pas sur `forest_chunks`. Ce qui est bloqué, c'est l'**amplification future** depuis le texte intégral. Je l'ai écrit dans l'en-tête de `DOCTRINE-MIROIR` pour que personne n'en déduise que la doctrine est fragilisée.
6. **La question de Kalsched que la doctrine n'a jamais regardée en face** (nouvelle tension 11) : il donne une séquence en deux temps — honorer l'esprit prisonnier, **puis l'incarner** — et il avertit que beaucoup font l'étape 1 et jamais l'étape 2. **Une app de journal de rêves est un dispositif d'étape 1 par construction.** C'est peut-être un problème plus grand que le miroir. Je n'ai pas de réponse et je ne fais pas semblant d'en avoir une.

---

## 8. LE POINT GIT, ET UN REFUS QUE JE DOIS T'EXPLIQUER

**La consigne était de brancher depuis `main`. Je ne l'ai pas fait, et voici pourquoi.**

`git diff main..HEAD` sur ce dépôt donne **4 009 insertions dans `src/`** et un fait décisif : **`DOCTRINE-MIROIR.md` n'existe pas sur `main`.** Un `checkout -b` depuis `main` dans cet arbre aurait donc (a) supprimé de l'arbre de travail le document que j'étais chargé d'éditer, et (b) rembobiné 4 000 lignes de travail vif sous les mains de trois agents en train de coder. C'est très exactement l'accident déjà documenté en mémoire (`reference_arbre_git_partage_collision`).

**Ce que j'ai fait à la place** : `git checkout -b yeshua/canon-sept-principes` **au commit courant** (`cefc7c0`). Zéro fichier déplacé, zéro agent perturbé — vérifié par `git status` avant et après. La branche existe, elle porte le bon nom, et elle contient tout.

**Commit `f07baa7`**, quatre fichiers, 485 insertions / 202 suppressions. Je ne peux pas pousser.

```bash
cd ~/Dev/dream-app && git push -u origin yeshua/canon-sept-principes
```

**Ce que tu dois savoir sur l'état de l'arbre** : les trois autres agents commitent désormais sur `yeshua/canon-sept-principes` au lieu de `yeshua/miroir-ce-que-jen-ai-dit`. Le contenu est identique (même commit de départ), seul le nom de la branche a changé. Aucun travail n'est en danger — mais si un autre chat te parle de « sa » branche, c'est celle-ci.

**Et le rappel qui va avec** : rien de tout ça n'est déployé, et rien ne tourne. Ce sont des documents.
