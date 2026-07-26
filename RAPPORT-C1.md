# RAPPORT C1 — La bulle des kaïros : trois étages, deux faces

**Statut : `full_green` sur le périmètre demandé · `tsc --noEmit` → EXIT=0 · rendu chargé, regardé, itéré trois fois.**
Branche : **`yeshua/bulle-kairos`**, trois commits, partie de `main`. Non poussée (pas de réseau GitHub depuis le sandbox).
À ouvrir en premier : **`APERCU-BULLE-KAIROS-2026-07-26.html`**.

Fichiers : `src/components/InfoSystem.tsx` (refonte de la coquille) · `src/components/DepositScope.tsx` **(neuf)** · `src/lib/depositScope.ts` **(neuf)** · `src/lib/kairos-glyphs.tsx` **(neuf)** · `src/app/mvp/page.tsx` (5 éditions) · `src/lib/i18n/mvp/content.{fr,en}.json`.

---

## 1. LE MOTIF EXISTANT — trouvé, réutilisé, et durci

> « la solution **comme d'hab** est cette petite bulle qui permet d'avoir + d'info »

« Comme d'hab » a une adresse exacte : **`src/components/InfoSystem.tsx`**, écrit le 11/07. Le système ⓘ « profondeur cachée » de la SPEC §0.2, en deux étages — `InfoDot` (un ⓘ de 16 px, cible 44 px → une bulle d'**une phrase** + deux boutons « merci » / « En savoir plus ») et `InfoSheet` (la fiche plein écran, ~200 mots + « d'où ça vient »). Contenu dans `src/lib/infoSheets.ts` → 16 fiches, dont une déjà nommée **`kairos`**, et elle est **déjà posée à côté de « c'était… »** au post-dépôt (page.tsx L1842).

**Je ne l'ai pas imité — je l'ai rendu partageable.** Copier sa géométrie dans un composant voisin aurait garanti la dérive au premier ajustement. J'ai donc **extrait sa coquille** et fait consommer celle-ci par les deux systèmes :

| Extrait | Ce que ça garantit |
|---|---|
| `BubbleFrame` | même scrim, rayon 22, padding 20/22, largeur max 380, deux boutons (refus `flex:1` / approfondissement `flex:1.5`), cible 44 px |
| `SheetFrame` | même feuille montante, rayon 26/26/0/0, 88 dvh, la poignée, le bouton de fermeture |
| `InfoGlyph` · `InfoStyle` | le même ⓘ tracé au trait, les mêmes fondus, le même `prefers-reduced-motion` |
| `skinOf(day)` | **nouveau** — la peau, en deux lumières |

`InfoDot` et `InfoSheet` sont réécrits par-dessus. **Si la bulle bouge un jour, les deux bougent ensemble.**

### Les trois écarts, et pourquoi je les assume

**① Le déclencheur n'est pas un ⓘ flottant : c'est la traîne elle-même.**
Poser un ⓘ à côté du mot aurait ajouté un signe à un écran plein. La traîne finissait déjà sur trois points de suspension — ils promettaient une suite que rien ne tenait. Elle devient tapable et porte le ⓘ en **glyphe terminal**, dans la phrase, pas à côté. Bénéfice non cherché : la cible tactile est la **ligne entière**, très au-delà des 44 px, sans grossir le glyphe.

**② « Lire + » n'ouvre pas une fiche de 200 mots, mais une page.**
Tu as demandé « une vraie page en profondeur ». Une feuille montante de 88 dvh aurait été une fiche déguisée. `ScopePage` est plein écran, avec son fond, son en-tête de retour et son défilement.
**C'est un calque, pas une route** — et c'est un choix de risque, pas de paresse : `/mvp` est une machine à états dans un fichier de 279 ko, et y ajouter un écran aurait touché `page.tsx` bien au-delà de cinq lignes, un jour où trois patchs viennent d'y atterrir. Le calque donne le même objet perçu pour un centième du risque de collision. **Si tu veux une vraie route (partageable par lien, dans l'historique du navigateur), c'est une passe à part et je la fais.**

**③ La coquille existe désormais en jour — et ce n'est pas cosmétique.**
`InfoSystem` était nuit **en dur** (`panel: #1a1310`). Le poser tel quel sur le Cœur aurait refait, au pixel, le défaut de la nav corrigé ce matin (§3.1 de B5) : un bloc peint dans la lumière de l'autre face. Deux valeurs de la peau de jour sont des **décisions mesurées**, écrites dans le code :
- le **scrim** prend `rgba(36,26,18,0.55)` — le premier stop de `T.bg`, donc le sol du monde nocturne, exactement comme le liseré de seuil du 26/07 ; pas un noir neutre.
- `dim` **et** `kicker` valent `DT.inkSoft` : mesuré, `DT.dim` **comme** `DT.gold` donnent **3,79:1** sur le parchemin, sous la barre AA de 4,5:1. Sur le jour, la hiérarchie se fait par la typo et l'échelle, jamais par le contraste.
  ⚠️ **Constat au passage, hors périmètre** : `DT.gold` sert déjà de couleur de texte pour les liens de 13,5 px du Cœur (« rêve → », « les grands rêves → »). **Ils sont à 3,79:1 aujourd'hui.** Je n'y ai pas touché — ce n'est pas mon territoire cette passe — mais c'est un vrai échec AA existant, à corriger.

---

## 2. « LES PROTOCOLES » — mon verdict, et ce qui a vraiment été supprimé

> « Ça amène même aux protocoles dans le "in depth". »

**Verdict : tes « protocoles », ce sont les 10 guides vivants de `src/lib/guides.ts`. Pas le `PROTO_CATALOG` supprimé ce matin.** Et je ne l'ai pas ressuscité.

**La preuve n'est pas une opinion, elle est dans l'en-tête de `guides.ts`** : les guides *sont* ce catalogue, dé-jargonné et simplifié à une question par écran. Le fichier le documente lui-même, ligne à ligne :

| `PROTO_CATALOG` (supprimé) | source citée | Guide vivant |
|---|---|---|
| Lightning Dreamwork | Robert Moss | **Raconter en entier** |
| Dream Tending | Stephen Aizenstat | **Parler à une image** |
| Sidewalk Oracle | Robert Moss | *(fondu dans)* **Raconter la coïncidence** |
| Reverie Tending | Gaston Bachelard | **Attraper une intuition** |
| Hypnagogic Recall | Andreas Mavromatis | *(idem)* |
| Synchronicity Story | Robert Hopcke | **Raconter la coïncidence** |
| Focusing — Felt Sense | Eugene Gendlin | **Écouter son corps** |
| Pré-sommeil — Incubation | Moss + LaBerge + Wangyal | **Une intention pour la nuit** |
| Fin de Journée | examen ignacien adapté | **Relire sa journée** |
| Réentrée — Active Imagination | Aizenstat + Jung | **Retourner dans le rêve** |
| — | — | **Un geste concret** · **Se rendormir en douceur** *(les deux ajouts)* |

**Ce que le catalogue avait en plus, et que les guides n'ont pas** — je te le dis, tu jugeras :
- les **noms d'auteur affichés à l'écran** (« Lightning Dreamwork · Robert Moss ») ;
- des **types de champ que les guides n'ont pas** : `scale` (noter de 1 à 5), `choice` / `multi` (des cases : élément dominant eau/air/feu/terre, modalité visuelle/auditive/kinesthésique, texture du frisson…), `breath` (un minuteur de respiration de 24 s), `info` (un écran de pause) ;
- un **routage par type de dépôt** : chaque protocole déclarait les kaïros qu'il servait.

**Deux d'entre elles valent d'être reprises, et ce n'est pas le vocabulaire :** le routage par type existe déjà chez les guides sous une autre forme (`proposeGuides`, §C2) ; **les champs à choix et l'échelle, non.** « Si ce frisson avait une texture ? chaud · froid · lourd · léger · serré · ouvert » demandait quatre secondes et une main ; sa version guide demande de rédiger. C'est une perte réelle, indépendante du jargon. **Je ne l'ai pas rattrapée dans cette passe** (hors périmètre), je la signale.

**Ce qui reste banni, et je ne l'ai pas touché** : le mot « protocole » lui-même. `guides.ts` §0.1 interdit nommément à l'écran « honorer », « oraculaire », « intégration », « seuil », « oracle », **« protocole »**. Tu l'emploies en conversation ; l'app dit **« guides »**, et la page profonde dit *« des petites traversées »* — le mot de `guides.ts`. Aucun rêveur ne verra « protocole ».

**Le pont, concrètement** : un lien unique en bas de la page profonde → la bibliothèque des guides (C4), qui existe déjà. Pas de tap-par-type — voir la question Q3 : il y a un piège de classement, et il est réel.

---

## 3. LE COMPTE D'EMPLACEMENTS — la réponse honnête

**Tu demandais si la bulle *rend* de la place. Non. Et elle n'en prend pas non plus.**

Je ne vais pas t'inventer un gain : **la traîne n'a jamais occupé d'emplacement à elle.** Depuis hier elle vit **dans** le n°3, « 1 mot » — c'est tout l'argument de B5, et il tient encore. La rendre tapable ne crée pas de nœud d'attention supplémentaire : au repos, l'écran est celui d'hier, à un glyphe de 14 px près.

| n° | §15.1 | Face **Rêve** | Face **Cœur** |
|---|---|---|---|
| 1 | 1 méta discrète | la date | la date |
| 2 | 1 foyer | la lune | la braise |
| 3 | **1 mot** | « rêve » + sa traîne, **devenue une porte** | « le cœur » + sa traîne, **devenue une porte** |
| 4 | 1 micro-ligne d'usage | maintiens · ou écris (+ 📷) | maintiens · ou écris |
| 5 | 1 geste — le foyer EST le bouton | anneau de maintien | anneau de maintien |
| 6-7 | ≤ 2 liens secondaires | « le cœur → » — **1 seul, une place libre** | « les grands rêves » · « rêve → » — **plein** |
| 8 | fil ≤ 2 items | 2 derniers dépôts | 2 derniers dits |
| 9 | nav | lune / « Rêve » | soleil / « Cœur » |

**9 / 9 sur les deux faces, comme hier.** La bulle et la page ne sont pas des éléments d'écran : ce sont des **états ouverts par un geste**, comme la fiche ⓘ depuis le 11/07. Le test de §15.1 n'est pas « combien de nœuds dans le DOM » mais « combien de choses se disputent l'attention **au repos** ».

**Ce que ça rend vraiment, ce n'est pas un slot, c'est de l'attention.** La traîne n'a plus à porter le périmètre toute seule : elle peut rester courte au lieu de grossir. C'est un gain réel, mais il ne s'écrit pas dans le tableau — et **le Cœur reste plein** (§16.4). Ce n'est pas cette passe qui le débloque.

---

## 4. LA FORÊT — les digests réellement ouverts, et ce que j'en ai tiré

Sept documents lus **dans cette session**, intégralement ou sur leurs sections « Essence / Key Principles / Native Vocab ». Je ne cite rien que je n'aie pas ouvert.

| Lu | Ce que ça a **changé dans le texte** |
|---|---|
| **Hunt — The Multiplicity of Dreams** *(intégral)* | La **thèse de multiplicité** : « il n'y a pas UNE essence du rêve, il y a des types distincts, chacun avec sa ligne de développement ». C'est le fondement de la page entière — sept sections plutôt qu'un paragraphe. C'est aussi ce que dit le bloc source : *« il n'y a pas une seule sorte de rêve, mais plusieurs — c'est pour ça qu'il y a plusieurs cases ici. »* Hunt fournit aussi le **symbolisme présentationnel** (Langer) : *« "Ai-je bien rêvé ça ?" n'est pas une question qui a un sens »* → d'où « note-la comme elle est venue. L'image, pas l'explication. » |
| **Moss — Sidewalk Oracles** *(intégral)* | La **kairomancie** — lire le jour comme on lit un rêve — et surtout le **lexique personnel** : *« ce n'est pas du symbolisme universel (serpent ne veut pas dire la même chose pour tout le monde) mais une corrélation vécue »*. C'est devenu la phrase la plus importante de la section « signe » : *« Dream ne te dira jamais ce que ça veut dire — un signe n'a pas de sens fixe. Mais à force d'en noter, les tiens finissent par former une langue que tu es seul à parler. »* Aussi : la **reincidence** (des coïncidences qui « riment ») → le six-mots de synchro. |
| **Bachelard — La Poétique de la Rêverie** *(intégral)* | Le **mésusage à corriger** : la tradition met la rêverie « sur la mauvaise pente, la pente qui descend » ; sa thèse est l'inverse — elle *augmente* la conscience. D'où : *« On la prend pour un rêve raté, ou pour du temps perdu. C'est autre chose : un mode éveillé, où les images viennent sans qu'on aille les chercher. »* |
| **Jung — Synchronicity** *(intégral)* | La définition exacte (« coïncidence dans le temps d'événements sans lien causal qui ont le même sens ») **et le garde-fou** : Jung ne prédit rien, il constate un ordre. D'où la phrase la plus courte de la page — *« Ça n'annonce rien. »* — et l'*abaissement du niveau mental* (les synchronicités se groupent aux moments de crise) → *« certaines tombent pile au moment où tu te posais la question. »* |
| **Moss — Dreamgates** *(Essence + Principes)* | *« Coincidence is when the universe gets personal »*, et le rêve comme **voyage**, pas comme réception passive. Confirme le registre « tu déposes ce que tu reçois », mais **je n'ai rien pris de sa cosmologie** (les trois mondes, le corps de rêve, la récupération d'âme) : hors registre moldu de l'app, et non vérifiable. |
| **Hillman — The Dream and the Underworld** *(Essence + Principes)* | **Garde-fou n°1, et le plus dur.** *« L'erreur d'Hercule »* : le moi héroïque qui descend aux enfers pour ramener le rêve à la lumière du jour par la force de l'interprétation. Aussi : *« ne pas se précipiter vers la résolution — certains rêves demandent qu'on reste avec la douleur »*. C'est ce qui interdit la section « une douleur » du Cœur de finir sur une consolation : *« On ne te dira pas que ce n'est rien, ni que ça passera. »* |
| **Aizenstat — Tending the Dream** *(intégral)* | **Garde-fou n°2** : les images sont des êtres autonomes qu'on **soigne**, pas des symboles qu'on décode ; la curiosité et la patience avant l'explication. C'est ce qui a tué mes premières formulations en « ça signifie que… ». |
| **`dream_alpha/safety-checks.json`** *(les 9 red lines)* | Vérifiées une par une contre le texte final : zéro dictionnaire de symboles, zéro interprétation descendante, zéro prédiction, zéro minimisation, zéro diagnostic, zéro claim médical, zéro « rush vers la résolution ». |
| **`logs_or_audits/ETHICAL-POLICY-V2.md`** | Aucun livre n'est restreint ; **l'attribution doit remonter jusqu'à l'utilisateur** quand on s'appuie sur un auteur ou une tradition (le cluster Moss est flagué MEDIUM dans son propre digest : *« il puise dans les traditions shinto, yoruba, hindoue, lakota, celte et aborigène sans reconnaissance approfondie des communautés sources »*). D'où le bloc « d'où ça vient » : **quatre noms cités, aucun titre de gloire inventé.** Je n'ai employé aucun terme d'une tradition vivante (ni *ondinnonk*, ni le vocabulaire iroquois de Moss) — donc rien à réciproquer au-delà de l'attribution. |

**Ce que la Forêt n'a pas fourni, et je le dis** : la face **Cœur** ne doit presque rien aux livres. Sa matière, ce sont **tes mots** — VISION-CHANT §3, repris tels quels : *« la parole, le chant, le cri, le murmure »*, *« déposé comme notre vérité »*, *« on enregistre pour soi d'abord »*. C'était la bonne source, et elle passe avant les digests.

**Voix** : protocole en deux passes appliqué. La passe de dépouillement a cassé quatre choses — un « ce n'est pas X, c'est Y » symétrique dans la rêverie (rendu asymétrique), un doublon littéral avec la fiche ⓘ « frisson » existante, une triade de puces trop scandée dans « signe » (la troisième allongée pour casser le mètre), et *« l'image juste avant de dormir »* raccourci après mesure au rendu.

---

## 5. TROIS DÉFAUTS QUE SEUL LE RENDU A MONTRÉS

Aperçu chargé dans Chrome, screenshoté, itéré trois fois. Les trois étaient invisibles à la lecture.

**5.1 🔴 La traîne et la micro-ligne fusionnaient sur le Cœur — et c'est un vrai bug de l'app.**
`ScopeTrail` rend un `<button>` en `inline-flex` ; la micro-ligne d'usage de `page.tsx` est un `<div>` **également en `inline-flex`**. Deux éléments de ligne se rangent côte à côte dès qu'ils tiennent dans la largeur. Côté Rêve, « ou un signe, un frisson… ⓘ » est assez long pour repousser « maintiens · ou écris 📷 » à la ligne suivante — l'accident ne se voyait pas. Côté Cœur, « comment tu te sens, là ? ⓘ » + « maintiens · ou écris » ≈ **295 px pour 322 px utiles** : tout tenait sur **une seule ligne**, la traîne et le geste fondus en une bouillie. Une enveloppe de bloc garantit la séparation quelles que soient la copie et la langue.
*La leçon : la mise en page des deux faces n'était pas identique, elle était accidentellement identique — la copie française du Rêve la sauvait. Une traduction plus courte cassait l'écran.*

**5.2 La liste de la bulle se dés-alignait.** En `flex`, chaque six-mots démarrait après **son propre** nom : sept départs différents, et les deux noms longs (« hypnagogie », « synchronicité ») poussaient leur glose sur une seconde ligne. Une liste de sept qui se dés-aligne n'est plus une liste, c'est un paragraphe haché. → **Grille à trois colonnes** (`14px auto 1fr`) : `auto` cale la colonne des noms sur le plus long, sans nombre magique. Plus les six-mots raccourcis à **≤ 26 signes**.

**5.3 Le ⓘ de la traîne ne se voyait pas** (opacité 0,72 sur `T.dim`). C'est la **seule** affordance de la ligne. → 0,85. C'est la leçon du liseré de seuil (§15.3) transposée à quatorze pixels : *un signe qu'on ne voit pas ne signale rien.*

*(+ un quatrième, propre à l'aperçu : ma règle globale `section{margin:0 auto 89px}` frappait aussi les `<section>` **à l'intérieur** du téléphone — 89 px de vide fantôme entre chaque type sur la page profonde. Scopé en `.wrap > section`.)*

---

## 6. VÉRIFICATION

```
cd ~/tscheck && node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.c1.json ; echo "EXIT=$?"
   →  EXIT=0
```

⚠️ **Deux corrections avant de pouvoir m'y fier**, et elles comptent :
1. **`~/tscheck/src` était un lien symbolique vers `claude-context/dream-alpha-app/src` — la copie morte.** Repointé sur `~/Dev/dream-app/src`. Sans ça je typecheckais le code d'hier en le croyant vert.
2. Le `tsconfig.json` de `~/tscheck` embarque un dossier `src_new/` fantôme, non exclu, qui rendait 30 erreurs de bruit. J'ai écrit **`tsconfig.c1.json`** : `src/**` seulement, avec les exclusions du dépôt.

**Le vert n'est pas acheté** : `--listFiles` confirme que `page.tsx`, `DepositScope.tsx`, `kairos-glyphs.tsx` et `InfoSystem.tsx` sont bien compilés, et **un test de contrôle** (une faute de type injectée puis retirée) confirme que le compilateur la voit.

**`next build` n'a pas pu tourner** : `node_modules/` est absent du dépôt à `~/Dev/dream-app`. À lancer sur ton Mac.

**Le rendu a été regardé** — pas seulement écrit. Les trois défauts du §5 viennent de là.

**⚠️ Un `.git/index.lock` orphelin (0 octet, 13 h 21) bloquait tout commit.** Levé après vérification qu'aucun processus git ne tournait. C'est le comportement du sandbox déjà noté en mémoire — **si un autre chat a eu un `git` en échec sur ce dépôt entre 13 h et 14 h, c'est ça.**

---

## 7. QUATRE QUESTIONS FERMÉES

**Q1 — Le mot « protocoles ».** J'ai tranché : ce sont les **10 guides vivants** (§2), et je n'ai pas ressuscité le vocabulaire banni.
&nbsp;&nbsp;**(a)** juste, on n'en parle plus &nbsp;·&nbsp; **(b)** il manquait quelque chose dans l'ancien catalogue — je pense aux **champs à choix et à l'échelle 1-5** (§2), dis-moi si tu veux que je les rende aux guides &nbsp;·&nbsp; **(c)** tu veux relire ce qu'il contenait avant de trancher.

**Q2 — La traîne : elle reste, elle raccourcit, ou elle tombe ?** Tu disais « peut-être inutile, ou se réduit encore ». Je l'ai **gardée telle quelle** et rendue tapable. Raison : elle est *passive* (on la lit sans rien faire), le ⓘ est *actif* (il faut le vouloir). À 6 h du matin personne ne tape un ⓘ — la couper rendrait le périmètre invisible à qui n'a pas la curiosité, c'est-à-dire au rêveur du premier jour.
&nbsp;&nbsp;**(a)** garder « ou un signe, un frisson… » &nbsp;·&nbsp; **(b)** raccourcir à « ou un signe… » &nbsp;·&nbsp; **(c)** couper la traîne, ne garder que le ⓘ à côté du mot.

**Q3 — Un tap sur un type doit-il lancer son guide ?** Aujourd'hui : **un seul lien en bas** vers la bibliothèque. Le tap-par-type serait plus riche, mais il y a un piège **réel** : un guide lancé **sans rêve déposé** enregistre son résultat en `kairos_type: 'note_jour'` (`GuideSession.finish`, la branche `else`). « Raconter en entier » lancé depuis la page classerait donc un rêve comme une note de journée. Ça se règle — mais c'est un chantier de classement, pas une ligne.
&nbsp;&nbsp;**(a)** un lien en bas suffit &nbsp;·&nbsp; **(b)** oui, tap-par-type, je prends le chantier &nbsp;·&nbsp; **(c)** tap-par-type seulement là où c'est sûr (frisson, synchro, rêverie).

**Q4 — Le bloc « d'où ça vient ».** Il nomme Moss, Jung, Bachelard, Hunt. Ce n'est pas décoratif : `ETHICAL-POLICY-V2` demande que l'attribution remonte jusqu'à l'utilisateur, et le cluster Moss est flagué. C'est aussi la seule chose de la page qui « fait savant ».
&nbsp;&nbsp;**(a)** garder tel quel &nbsp;·&nbsp; **(b)** garder mais raccourcir de moitié &nbsp;·&nbsp; **(c)** le replier derrière un « d'où ça vient » à déplier.

---

## 8. MON JUGEMENT HONNÊTE

**Ce qui est réglé.** Le périmètre est présenté *direct* — les sept types eux-mêmes, avec les glyphes qu'on retrouve trente secondes plus tard — sans un élément de plus à l'écran. La page profonde n'est pas une aide : c'est une invitation à remarquer, adossée à des livres réellement lus et à des garde-fous réellement vérifiés. Le Cœur a le même geste, en sa propre lumière. FR et EN, parité vérifiée.

**Ce dont je suis le moins sûr, et c'est de goût, pas de technique** : **la longueur de la page du Rêve.** Sept sections de trois paragraphes, c'est long pour une app qui fait du silence une valeur. Je l'assume parce que c'est une page qu'on ouvre **une fois**, volontairement, par curiosité — pas un écran quotidien. Mais si elle te paraît bavarde, ce sont les troisièmes paragraphes de chaque type qui doivent sauter (ce sont les « comment faire »), pas les premiers (ce sont les exemples, et c'est eux qui font dire « ah, ça aussi je peux le déposer »).

**Ce que je n'ai pas fait, volontairement** : aucun tap-par-type (Q3), aucune route (§1③), aucune résurrection des champs à choix (§2). Et **je n'ai pas touché** aux liens `DT.gold` du Cœur qui échouent AA — c'est réel, c'est signalé, ce n'était pas ma passe.

**Ce que je ne peux toujours pas certifier**, et c'est le même mur qu'A4 et B5 : **les cinq frames validées le 10/07 n'existent nulle part dans le dépôt.** Je travaille sur `dream-design.ts`, une transcription à la main. Je peux affirmer qu'aucune règle écrite n'est violée sur les deux faces ; je ne peux pas affirmer « on est au niveau de la maquette ».

---

## 9. CE QUI T'ATTEND

1. **Ouvrir `APERCU-BULLE-KAIROS-2026-07-26.html`** — quatre sections, les trois étages × les deux faces, aux vrais tokens. Les deux pages profondes **défilent dans leur cadre**.
2. **Répondre aux quatre questions du §7** (a / b / c).
3. **Pousser la branche** (le sandbox n'a pas de réseau GitHub) :
   ```bash
   cd ~/Dev/dream-app && git push -u origin yeshua/bulle-kairos
   ```
4. **Faire tourner ce que je ne peux pas** : `npm install && npm run build`, puis l'app sur ton téléphone — c'est là que se jugent la taille de la bulle et la discrétion du ⓘ.
5. **Toujours la demande n°1, inchangée depuis hier** : exporter les cinq frames CD en PNG dans `_designs_from_claude/nuit-ultra-simple-2026-07-10/`. Sans elles, la boucle de vérification de §15.1 reste impossible à fermer.

---

*C1 · Yeshua (Opus) · 2026-07-26 · branche `yeshua/bulle-kairos`, 3 commits.*
