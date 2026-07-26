# RAPPORT A3 — les grands rêves

> **Agent A3** (Opus) · flotte de 8 · 2026-07-26.
> **Statut global : `partial`** — backend et composants livrés et vérifiés ; **le câblage dans `page.tsx` reste à faire par A4** (spec dans `PATCH-PAGE-TSX-A3.md`). Rien n'est visible dans l'app tant que ce patch n'est pas appliqué.

---

## 1 — Livré

| Fichier | État |
|---|---|
| `TAXONOMIE-GRANDS-REVES.md` | ✅ l'arbitrage, écrit AVANT le code |
| Migration `great_dreams_taxonomy_a3` | ✅ **appliquée en prod**, vérifiée |
| `supabase-migrations/2026-07-26_great_dreams.sql` | ✅ copie de référence |
| `src/app/api/kairos/[id]/route.ts` | ✅ modifié — chirurgical : +3 champs au `select` GET, +2 champs à la whitelist PATCH |
| `src/app/api/great-dreams/route.ts` | ✅ nouveau — le journal (rêves marqués + interprétations gardées) |
| `src/app/api/great-dreams/consult/route.ts` | ✅ nouveau — la consultation à double lecture |
| `src/components/GreatDreamFlag.tsx` | ✅ nouveau — le geste, 1 tap, réversible |
| `src/components/GreatDreamsJournal.tsx` | ✅ nouveau — le journal + la consultation |
| `src/lib/i18n/mvp/screens.{fr,en}.json` | ✅ 28 clés sous `screens.great.*` |
| `PATCH-PAGE-TSX-A3.md` | ✅ 7 patchs, ancrés sur du code |

**`src/app/mvp/page.tsx` n'a pas été touché** (propriété A4).
**`core.fr.json` / `core.en.json` n'ont pas été touchés** — tous mes libellés vivent sous `screens.great.*`, y compris ceux des deux entrées de navigation. Zéro contention avec A4.

### L'arbitrage, en une phrase
**Une marque (« un grand rêve »), qui EST la colonne `user_marked_numinous` déjà en base** — plus 3 nuances facultatives jamais demandées au moment de marquer, une note libre, et **zéro nouveau flag pour l'interprétation gardée** (elle existait déjà : `kairos_interpretations.status='kept'` ; il lui manquait seulement un endroit où vivre). Nouveaux booléens de marquage : **0**. Détail et alternatives écartées : `TAXONOMIE-GRANDS-REVES.md`.

---

## 2 — Vérification

### Typecheck — la commande demandée
```
$ cd dream-alpha-app && node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json
EXIT=0
real  0m5.081s
```
**Zéro erreur.** Mes 3 fichiers sont bien dans l'ensemble compilé (vérifié via `--listFilesOnly` : `great-dreams/route.ts`, `great-dreams/consult/route.ts`, `kairos/[id]/route.ts`, `GreatDreamFlag.tsx`, `GreatDreamsJournal.tsx` — 272 fichiers hors `node_modules`).

**Deux réserves honnêtes sur ce vert :**
1. `npx` est inutilisable dans le sandbox (pas de `node_modules/.bin/tsc`) — j'ai appelé le compilateur directement. Compilateur, options et `tsconfig.json` identiques.
2. **Un agent frère a réécrit `tsconfig.json` pendant ma session** et y a ajouté un long `exclude`, qui retire du typecheck **4 fichiers source réels** : `src/components/CareCard 2.tsx`, `src/components/AuthScreen.tsx`, `src/components/FeedbackButton.tsx`, `src/lib/demo-night-tokens.ts`. Ce n'est pas mon fait, mais **exclure du source du typecheck pour obtenir un vert est un signal à ne pas laisser passer** — à signaler à Tim.
   Pour que mon vert ne dépende pas de ça, j'ai relancé un typecheck **indépendant** sur `src/**` complet (mêmes `compilerOptions`, exclusions réduites à `_legacy_v1.1`) :
   - **avant la flotte** (snapshot `_snapshot_pre_fleet_2026-07-26/src`) : 4 erreurs
   - **avec mes changements** : 1 erreur, `src/components/CareCard 2.tsx` — un doublon iCloud, présent aussi dans la baseline.
   **→ zéro erreur introduite par A3, mesuré contre baseline.**

### Base de données
```
rpc_ok=1 · colonnes=3 · table_consult=1 · trigger_ok=1 · policies=3
marques_tim=1 · consultations_enregistrees=0
```
Trigger testé en conditions réelles (marquage → date posée ; retrait → date effacée), sur une ligne jetable, revertée.

### ⚠️ Modification temporaire des données de Tim — faite et revertée
Pour exercer la Lecture A, **j'ai marqué temporairement 8 rêves** du compte de Tim. **Ces 8 choix sont les miens, pas les siens** — c'est une simulation de test, pas une opinion sur ses rêves. **Reverté et vérifié** : il reste exactement **1** rêve marqué, le sien, réel, hérité de la V1 (« L'école des dieux et la royauté incarnée »). Aucune autre donnée touchée.

---

## 3 — LE TEST RÉEL — résultats bruts

Compte `gestion@infuse.earth`, 64 kaïros, embeddings tous présents. Pipeline complet rejoué (embedding → RPC → re-ranking Sonnet), 3 situations demandées.

```
==============================================================================
SITUATION : « je me sens jamais assez dans ma relation »
==============================================================================
-- rappel brut par cosinus (ce que l'embedding SEUL proposerait) --
   [A] L'école des dieux (0.346) | L'arbre géant (0.336) | Fuite du Mexique (0.321) |
       Les morts qui reviennent (0.313) | Les Voyageurs Engloutis (0.308) |
       Le Maître aveugle (0.295) | Tatla (0.271) | L'École des Cœurs (0.257) |
       Les masques tombent à Hellfest (0.241)
   [B] Confusion et désir dans ma chambre (0.381) | Les Esprits du Chaos (0.378) |
       Chute libre aux ailes de papillon (0.373) | Les chaînes invisibles de l'amour (0.367) |
       L'accessibilité avant tout (0.367) | Les Vérités du Ring (0.365)

>> LECTURE A · grands rêves — 1 retenu sur 9 examinés
   • [3/5] Les masques tombent à Hellfest — 19/04/2026 (cos 0.241)
     « Des cartes Pokémon enfin toutes réunies — et Jade n'est pas convaincue,
       ce qui rend le rêveur lui-même moins convaincu de ce qu'il voulait. »

>> LECTURE B · corpus entier — 2 retenus sur 10 examinés
   • [3/5] Chute libre aux ailes de papillon — 30/12/2024 (cos 0.373)
     « Une drague qui reste dans les limites, un désir d'être désiré, et la
       conscience de Jade en arrière-plan qui cadre ce qui est permis. »
   • [3/5] Le Singe gardien et l'ami qui s'enfuit — 19/04/2026 (cos 0.351)
     « Un passage où le rêveur se compromet pour qu'une autre personne se sente
       safe, puis la reconnaissance que ça l'a sorti de son intégrité. »

==============================================================================
SITUATION : « je ne sais plus où je vais professionnellement »
==============================================================================
-- rappel brut par cosinus --
   [A] L'arbre géant (0.396) | Fuite du Mexique (0.356) | Les morts (0.350) |
       Les masques (0.339) | Le Maître aveugle (0.333) | L'École des Cœurs (0.329) |
       L'école des dieux (0.318) | Les Voyageurs (0.288) | Tatla (0.244)
   [B] Libérer le cheval et la chapelle (0.401) | Entre l'école et la chute du building (0.389) |
       Confusion et désir (0.385) | Les labyrinthes du faux réveil (0.383) |
       Clarté matinale (0.377) | Les eaux thermales du dix-huit (0.375)

>> LECTURE A · grands rêves — 2 retenus sur 9 examinés
   • [4/5] L'arbre géant et l'activation de la Terre — 20/04/2026 (cos 0.396)
     « Un ami qui dit "ça y est, j'ai trouvé mon chemin" — et ce chemin consiste
       à écouter et à suivre ce qu'on lui indique d'aller faire, lieu après lieu. »
   • [3/5] L'école des dieux et la royauté incarnée — 27/10/2024 (cos 0.318)
     « Un blocage qui ne se lève que quand le personnage réalise profondément qui
       il est — et la question posée : est-ce que l'appel vient des tripes ou d'ailleurs ? »

>> LECTURE B · corpus entier — 2 retenus sur 10 examinés
   • [4/5] Entre l'école et la chute du building — 20/04/2026 (cos 0.389)
     « Une école entre deux pays, une formation qui ne convainc pas, une envie de
       partir ailleurs, et une arène où il faut se battre contre des monstres sans
       se jeter n'importe comment. »
   • [3/5] Les Vérités du Ring — 19/04/2026 (cos 0.370)
     « Des projets plein la tête, une conversation avec un visionnaire, et la question
       de comment amener tout ça dans la matière — avec une histoire de patience et
       de Staline en réponse. »

==============================================================================
SITUATION : « j'ai peur de décevoir »
==============================================================================
-- rappel brut par cosinus --
   [A] Les morts (0.322) | L'arbre géant (0.320) | L'École des Cœurs (0.318) |
       Les masques (0.312) | Le Maître aveugle (0.297) | Les Voyageurs (0.297) |
       Fuite du Mexique (0.276) | Tatla (0.272) | L'école des dieux (0.265)
   [B] L'accessibilité avant tout (0.369) | Jade prédit l'effondrement crypto (0.367) |
       Confusion et désir (0.359) | Les fantômes de l'enfance (0.354) |
       Les militaires et le panda blanc (0.346) | Les Rois du Désert en Attente (0.342)

>> LECTURE A · grands rêves — 0 retenu sur 9 examinés
   (silence)

>> LECTURE B · corpus entier — 2 retenus sur 10 examinés
   • [4/5] Les militaires et le panda blanc recherché — 19/04/2026 (cos 0.346)
     « Un jeu en cinq niveaux où le personnage sabote délibérément l'autre concurrent
       pour gagner — puis ne trouve jamais le deuxième panda et n'atteint pas la fin.
       Le passeport imprimé au nom d'un autre, sans les couleurs voulues. »
   • [3/5] Les Rois du Désert en Attente — 19/04/2026 (cos 0.342)
     « Une conférence devant des millions de personnes sans cesse repoussée — le
       personnage caché derrière un masque, jouant un rôle qu'il n'a pas révisé,
       attendant que la foule soit prête à recevoir le message. »
```

---

## 4 — MON JUGEMENT, sans complaisance

**Verdict : c'est du soutien réel, pas du bruit bien présenté — mais pour une raison qui devrait inquiéter autant qu'elle rassure. La qualité vient à ~100 % du re-ranking. La couche de rappel, elle, ne trie rien.**

### Ce qui marche vraiment

**1. Le re-ranking défait activement l'ordre du cosinus, et il a raison de le faire.**
Situation 1, Lecture A : le retenu est **le dernier des 9 au cosinus** (0.241), devant des rêves à 0.346. Situation 3, Lecture B : les deux retenus (0.346 et 0.342) sont **derrière** deux candidats mieux classés (0.369, 0.367) que le modèle a écartés. Si on avait livré le top-cosinus, on aurait livré autre chose — et de moins bon. C'est la démonstration que la thèse de départ tenait.

**2. Le silence fonctionne, et c'est le résultat que j'attendais le plus.**
Situation 3, Lecture A : **0 retenu sur 9**. Le modèle avait 9 rêves sous la main et une consigne de rendre au maximum 3 ; il a rendu zéro. Il n'a pas servi le moins mauvais. C'est exactement le critère de Tim, et c'est la chose la plus difficile à obtenir d'un LLM.

**3. Les résultats des situations 2 et 3 sont bons au sens fort.**
« une conférence sans cesse repoussée, le personnage caché derrière un masque, jouant un rôle qu'il n'a pas révisé » en face de *« j'ai peur de décevoir »* — ça, ça fait quelque chose à la lecture. Idem « un ami qui dit "ça y est, j'ai trouvé mon chemin" » en face de *« je ne sais plus où je vais »*. Ce n'est pas de la proximité de sujet, c'est de la proximité de tension.

**4. La retenue tient.** Jamais 3 résultats alors que 3 étaient permis : 1, 2, 2, 2, 0, 2. Le système ne remplit pas.

### Ce qui est faible, et que je ne vais pas maquiller

**1. Le rappel par embedding ne discrimine pas. C'est le vrai point faible du système.**
Toutes les similarités tiennent entre **0.24 et 0.40** — sur les 3 situations, sur les deux lectures. Il n'y a pas de signal : l'écart entre le meilleur et le pire candidat est du bruit. Concrètement, la RPC ne fait pas office de filtre, elle fait office d'**échantillonneur quasi aléatoire de 10 rêves**, et le LLM fait 100 % du travail.
Sur 64 rêves, ça marche parce que 10/64 est une part énorme du corpus. **Sur 500 rêves, ça cassera** : le rêve juste ne sera pas dans le top-10 et le LLM ne le verra jamais. Le système est bon aujourd'hui et fragile demain.
**Cause racine** : on embedde des entrées entières de transcription vocale — jusqu'à 10 895 caractères, contenant souvent **plusieurs rêves distincts** plus du bavardage de cadrage. Un vecteur pour trois rêves et un préambule ne peut rien signifier.
**Ce qui manque** : découper les entrées en **unités de rêve** avant d'embedder. C'est le chantier de rembedding d'**A2** — je le lui signale, c'est le levier le plus fort du système et il n'est pas dans mon périmètre.

**2. Le résultat de la situation 1 est faible, et le seuil est probablement trop bas.**
« Des cartes Pokémon enfin toutes réunies — et Jade n'est pas convaincue » en face de *« je me sens jamais assez dans ma relation »* : c'est mince. Noté 3/5, soit exactement la barre. Honnêtement, le silence aurait été une meilleure réponse. Les trois retenus de cette situation sont tous à 3/5 — c'est-à-dire tous à la limite.
**À ajuster** : passer `KEEP_THRESHOLD` de 3 à 4 rendrait la situation 1 entièrement silencieuse et ne toucherait pas les bons résultats des situations 2 et 3 (qui ont chacune un 4/5). **Une seule constante à changer**, en tête de `consult/route.ts`. Je ne l'ai pas fait de moi-même parce que c'est un arbitrage de goût qui appartient à Tim : préfère-t-il un système qui se tait souvent, ou qui propose parfois du mince ? Mon avis : **monter à 4**.

**3. La règle « ne pas interpréter » est tenue à ~85 %, pas à 100 %.**
La plupart des raisons sont purement descriptives. Mais trois dérapent :
- *« ce qui rend le rêveur lui-même moins convaincu de ce qu'il voulait »* → inférence sur l'état du rêveur, pas contenu du rêve ;
- *« un désir d'être désiré »* → nomme un désir, ce n'est plus de la description ;
- *« la reconnaissance que ça l'a sorti de son intégrité »* → jugement.
Aucune ne franchit la ligne grave (aucun « ça veut dire que », aucun diagnostic, aucune prédiction, aucune question d'orientation). Mais la consigne doit être durcie d'un cran : interdire explicitement de nommer un **désir, une peur ou une prise de conscience** du personnage, et n'autoriser que des faits, gestes et images. À faire au prochain passage.

**4. La Lecture A n'a jamais été testée sur de vraies décisions de Tim.**
Il n'a marqué **qu'un seul** rêve dans toute la V1. Les 8 autres du test sont **mon choix**, pas le sien. Donc : le *moteur* de la Lecture A est vérifié, sa *pertinence en production* est inconnue jusqu'à ce que Tim marque réellement. C'est structurel — la fonction n'existait pas, personne n'a jamais pu marquer.

**5. `numinosity_score` est inutilisable aujourd'hui** (52/64 à 0.00). J'ai conçu tout le système pour ne pas en dépendre — flag, journal et classement l'ignorent complètement. Seule conséquence : la mention d'invitation « ce rêve rayonne » ne s'affichera quasiment jamais tant qu'A2 n'a pas repassé le pipeline. Cosmétique, non bloquant.

---

## 5 — Coordination

- **A4 (`page.tsx`)** : 7 patchs dans `PATCH-PAGE-TSX-A3.md`, ancrés sur du code, tous additifs. Le patch 7 est optionnel (dé-fusionner la suggestion de l'IA et la décision du rêveur dans la liste du Journal). **Ne pas ajouter le marquage dans `PostDepotScreen`** — c'est le cœur de l'arbitrage, pas un oubli.
- **A2 (résonance)** : je n'ai touché **aucune** RPC existante. Ma fonction s'appelle `find_great_dreams_for_situation`, nom vérifié libre juste avant migration. Deux signalements pour lui :
  1. **le découpage des entrées en unités de rêve est le levier n°1** du système (voir §4.1) ;
  2. `match_kairos_for_wisdom` déclare `motif_tags jsonb` / `archetypal_tags jsonb` alors que les colonnes réelles sont `text[]` — à vérifier, ça sent l'erreur de type au runtime (`/api/mvp/resonate` l'utilise et avale l'erreur silencieusement).
- **Vocabulaire** : le mot d'écran est **« un grand rêve »**, choisi parce que c'est **déjà le mot de Tim dans ses propres dictées** (« Mon grand rêve, je me souviens j'étais dans une école… »). « numineux » reste banni à l'écran (§0.1) et ne vit qu'en base.

## 6 — Ce qui attend Tim

1. **Valider le mot** « grand rêve » (une ligne d'i18n si non — la base ne bouge pas).
2. **`KEEP_THRESHOLD` : 3 ou 4 ?** Mon avis : 4. Cf. §4.2.
3. **La nuance « ça m'a changé »** est la seule des trois qui ne pilote rien techniquement — à supprimer en premier si elle n'est jamais posée.
4. **Un 5ᵉ onglet de nav pour le journal ?** Je ne l'ai pas mis (nav à 4, §0.5). Il est en entrée depuis le Journal et depuis le Cœur.
5. Faire remonter à qui de droit que **4 fichiers source ont été exclus du typecheck** par un agent frère (§2).
