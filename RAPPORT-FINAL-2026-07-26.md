# RAPPORT FINAL — 26 juillet 2026

> Agent B6, le dernier de la flotte. J'ai appliqué les patchs des quatre autres,
> sorti le projet d'iCloud, et vérifié.
> **Le seul chiffre qui compte pour toi ce matin : `next build` passe. Exit 0.**
> C'était la chose cassée depuis trois jours, sans que personne ne le voie.

---

## 1. CE QUI EST RÉPARÉ ET VÉRIFIÉ

Une ligne par chantier, avec le chiffre.

| # | Chantier | État | Le chiffre |
|---|---|---|---|
| 1 | **Le projet est sorti d'iCloud** → `~/Dev/dream-app`, sous git | `full_green` | 880 fichiers suivis · **0 fichier source perdu**, compté dossier par dossier |
| 2 | **Les doublons iCloud sont morts** | `full_green` | **151** supprimés · chacun avait son original, vérifié un par un |
| 3 | **`next build` complet** — pas seulement `tsc` | `full_green` | `npm ci` + `next build` → **exit 0**, 128 pages générées |
| 4 | **`tsconfig.json` nettoyé** de ses exclusions iCloud | `full_green` | 12 exclusions retirées · plus aucun fichier source réel n'est masqué · compile toujours |
| 5 | **Capture (B2)** — débit d'archive au lieu de 32 kbps fixe | `full_green` | Opus 64 / AAC 128, **jamais sous le défaut du navigateur** · plus de durée maximale |
| 6 | **Le rêve à rebours (B4)** — Journal, fils, fiche datent au RÊVE | `full_green` | 4 emplacements bascculés sur `occurred_at` · faux échos anciens : **970 → 188 paires** (−81 %) |
| 7 | **« et c'était quand ? » au post-dépôt** | `full_green` | 5 puces, **« cette nuit » présélectionné** — qui ne touche à rien ne perd rien |
| 8 | **Récit / lecture du rêveur sur la fiche (B4)** | `full_green` | un seul flux, teinté, jamais coupé · 242 passages marqués sur tes 64 rêves |
| 9 | **La pastille des grands rêves (B3)** | `full_green` | un point, pas un chiffre — sans elle la proposition hebdo n'aurait jamais été vue |
| 10 | **Les deux RPC de résonance** — le risque de régression n°1 | `full_green` | vérifié en base : elles portent **les DEUX** acquis (seuil + z-score **ET** `occurred_at`). Aucune n'a écrasé l'autre |
| 11 | **Une clé `service_role` en clair** dans `scripts/import-local-dreams.mjs` | `full_green` | passée en variable d'environnement **avant** le premier commit |
| 12 | **Le SDK Anthropic sortait vers le navigateur** | `full_green` | `dream-date-view.ts` créé · SDK **absent** du bundle client, vérifié dans les chunks |
| 13 | **`.git` parasites dans `ios/App`** | `full_green` | 2 dépôts fantômes retirés — sans quoi tout le projet iOS n'aurait **pas** été suivi |
| 14 | **i18n FR/EN** | `full_green` | 12 clés ajoutées · **472 clés de chaque côté**, parité exacte |
| 15 | **`tsc --noEmit` entre CHAQUE patch**, pas seulement à la fin | `full_green` | 6 passes, 6 × exit 0 |

**Ce que « vérifié » veut dire ici** : j'ai lancé la commande et lu la sortie.
Pas « ça devrait marcher ».

---

## 2. CE QUI EST `partial` OU `blocked` — sans enjoliver

| Quoi | État | Pourquoi, franchement |
|---|---|---|
| **Rien n'est en ligne** | `blocked` | Je n'ai pas de réseau vers GitHub ni vers Vercel. Le commit est fait, local. **C'est toi qui pousses** (§4). |
| **L'écran de relecture des dates** (B4 patch 4) | `partial` | Un écran entier, sans maquette et sans ancre de code. Je ne l'ai pas inventé. Tes **24 propositions** de dates attendent en base, dont **11 sans année** — et c'est de toute façon une décision avant d'être un écran (D5). |
| **La proposition hebdomadaire auto** (B3 patch 2) | `partial` | Livrée, **sans appelant**. Elle ferait travailler un modèle au montage de l'app. B3 a refusé de trancher seul, moi aussi (D4). Tout passe par la première review, qui est sollicitée. |
| **Le dépôt hors-ligne + rêve à rebours** | `partial` | La file hors-ligne transporte `created_at`, pas `dream_date_shortcut`. Le serveur traduit, donc **rien ne casse** — mais un rêve à rebours déposé sans réseau perdra sa date de rêve. Une ligne dans `offline-queue.ts`, pas faite. |
| **L'export garanti hors du téléphone** | `blocked` | Demande `@capacitor/share` + `@capacitor/filesystem` → rebuild natif **et re-soumission App Store**. Décision (D8). Les 3 voies web sont en place et disent honnêtement laquelle a marché. |
| **Le chemin MP4 fragmenté sur un vrai iPhone** | `blocked` | Pas d'appareil ici. Validé contre un fMP4 ffmpeg, pas contre WebKit. La ligne `[capture-safety] enregistrement : {...}` dans les logs dira la vérité à ta première capture. |
| **Les 5 frames Claude Design** | `blocked` | Elles n'existent **nulle part** dans le dépôt. Tout le design travaille sur une transcription à la main. C'est la demande n°1 depuis deux jours (D9). |
| **13 écrans sans maquette** | `blocked` | Journal, Univers, Réglages, Forge, Mur, Groupes… n'en ont **jamais** eu. Objet de `BRIEF-MEGA-PASSE-CD.md`. |
| **Le découpage des entrées en unités de rêve** | `blocked` | Signalé par A2, puis A3, puis B3. Toujours pas fait. Il limite la consultation, l'écho ancien **et** le détecteur de grands rêves — les trois. |

---

## 3. LES DÉCISIONS QUI T'ATTENDENT

> Consolidé depuis `RAPPORT-A6.md` (21) + B2, B3, B4, B5. Dédoublonné, classé par urgence.
> **Tu peux répondre en cochant.** Chacune : la question en une phrase, les options, ma reco.

### 🔥 À FAIRE MAINTENANT — l'app saigne tant que ce n'est pas fait

**D1. Pousser le dépôt et déployer.** Rien de ce que huit agents ont produit n'existe pour un utilisateur.
→ `DEPLOY.md` §1 puis §3. **Aucune option, c'est juste à faire.**

**D2. Brancher Vercel sur GitHub ?**
&nbsp;&nbsp;**(a)** oui — tu pousses, ça déploie, tu ne tapes plus jamais `vercel --prod` ← **ma reco**
&nbsp;&nbsp;**(b)** non, on garde le déploiement à la main
*Le vrai gain de (a) : si le build casse, il casse chez Vercel et la prod reste debout.*

**D3. Archiver l'ancien dossier iCloud ?** Il est intact, j'y ai laissé un `_MOVED.md`.
&nbsp;&nbsp;**(a)** tu l'archives toi-même quand tu veux ← **ma reco** *(je n'ai rien détruit, c'est ta décision)*
&nbsp;&nbsp;**(b)** on le supprime tout de suite
⚠️ Dans les deux cas : `scripts/import-local-dreams.mjs` **de l'ancien dossier** contient encore la clé `service_role` en clair.

### 🎯 ARBITRAGES DE PRODUIT — ils bloquent du code déjà écrit

**D4. Le seuil de l'écho ancien : 0,75 → 0,65 ?** Une ligne, aucune migration.
&nbsp;&nbsp;**(a)** 0,65 ← **la reco de B3, et il te contredit avec des chiffres**
&nbsp;&nbsp;**(b)** « le plus bas » (0,30), comme tu l'avais demandé
&nbsp;&nbsp;**(c)** on ne touche à rien (0,75)

> **La contradiction de B3, gardée telle quelle parce qu'elle est argumentée.** Tu avais
> demandé « le plus bas ». B3 dit non, et le prouve :
>
> | seuil | échos affichés | rêves concernés | exposition max d'un même rêve |
> |---|---|---|---|
> | **0,75** *(aujourd'hui)* | **0** | 0 | 0 |
> | 0,70 | 3 | 3 | 1 |
> | **0,65** ← reco | **9** | 9 | **3** |
> | 0,60 | 17 | 17 | 6 |
> | 0,30 *(« le plus bas »)* | 22 | 21 | 7 |
>
> Deux faits. **Un** : le score maximum atteignable sur tout ton corpus est **0,7159** —
> ton arbitrage à 0,75 est **au-dessus du plafond que tes propres rêves peuvent produire**.
> Ce seuil ne filtre pas la fonction, il la rend structurellement impossible.
> **Deux** : la peur des « 183 échos, un rêve servi 59 fois » est **périmée** — ces chiffres
> datent d'avant le filtre z ≥ 2,0 d'A2, qui ne laisse plus passer que 22 paires **quel que
> soit le seuil absolu**. Le seuil absolu ne fait plus que raboter ces 22.
> À 0,65 : **9 échos sur 64 rêves**, environ un rêve sur sept, exposition max 3. Assez rare
> pour qu'une phrase qui affirme une causalité garde son poids. À 0,30 : un rêve sur trois —
> ce n'est plus un événement.

**D5. La proposition hebdomadaire de grands rêves se déclenche-t-elle toute seule ?**
&nbsp;&nbsp;**(a)** oui — c'est exactement ce que tu as demandé (« que l'app propose elle-même ») ← **ma reco**
&nbsp;&nbsp;**(b)** non — tout passe par la review sollicitée
*Coût de (a) : un appel modèle au montage de l'app, une fois par semaine, par rêveur.*

**D6. La maturation reste-t-elle exigée** (récurrence ≥ 3 **et** charge somatique ≥ 2) ?
&nbsp;&nbsp;**(a)** on la relâche ← **ma reco**
&nbsp;&nbsp;**(b)** on la garde
*Telle que spécifiée elle laisse passer ~1,25 % des paires, et son intersection avec le critère géométrique est **vide** : cumuler les deux garde-fous produit le silence total. Paramètres livrés, pas de migration.*

**D7. La barre de sélectivité de la consultation : 3 ou 4 sur 5 ?**
&nbsp;&nbsp;**(a)** 4 ← **ma reco** *(une des trois situations testées devient entièrement silencieuse **sans abîmer** les deux autres)* · **(b)** 3

**D8. Les plugins Capacitor `@capacitor/share` + `@capacitor/filesystem` ?**
&nbsp;&nbsp;**(a)** oui — c'est le seul export **garanti** hors du téléphone. **Coût : rebuild natif + re-soumission App Store.**
&nbsp;&nbsp;**(b)** non pour l'instant — on garde les 3 voies web, qui marchent souvent et disent la vérité quand elles échouent ← **ma reco**
*Raison de (b) : une re-soumission pour un bouton d'export, alors que 13 écrans n'ont pas de maquette, c'est le mauvais moment.*

**D9. Les 11 rêves dont l'année est indécidable.** Sur 24 propositions de date extraites de tes enregistrements, **11 disent le jour mais pas l'année** (« Rêve du 24 avril » — quel avril ?).
&nbsp;&nbsp;**(a)** tu tranches les 11 à la main *(je te prépare la liste et un écran)* ← **ma reco**
&nbsp;&nbsp;**(b)** on les laisse « date inconnue » — ils ne produiront jamais d'écho ancien
&nbsp;&nbsp;**(c)** on devine l'année la plus probable
*(c) est exactement le bug qu'on vient de réparer : une date devinée fabrique de faux échos.*

**D10. Le mot « grand rêve ».** Choisi parce que c'est **déjà ton mot dans tes dictées**.
&nbsp;&nbsp;**(a)** on le garde ← **ma reco** · **(b)** tu proposes autre chose *(une ligne d'i18n)*

**D11. La nuance « ça m'a changé ».** Seule des trois à ne rien piloter techniquement.
&nbsp;&nbsp;**(a)** on la garde · **(b)** on la supprime ← **ma reco** *(à supprimer en premier si elle n'est jamais posée)*

**D12. Un cinquième onglet pour le journal des grands rêves ?**
&nbsp;&nbsp;**(a)** non, la nav reste à 4 ← **ma reco** *(le lien + la pastille suffisent)* · **(b)** oui — mais il faudra en retirer un

**D13. 🔴 La génération de mondes — la question de fond, sans échéance.**
*Une image générée remplace-t-elle définitivement l'image intérieure ?* On ne dé-voit pas.
&nbsp;&nbsp;**(A)** génération libre · **(B)** génération différée *(rien avant que le rêve ait vieilli ou été relu)* · **(C)** non-figurative *(l'atmosphère, jamais la scène)*
**Aucune urgence. Mais à trancher avant que la techno n'arrive, pas après.**

### 🎨 DESIGN — vingt minutes de réponse débloquent une passe entière

**D14. 🔴 Exporter les 5 frames validées en PNG** → `_designs_from_claude/nuit-ultra-simple-2026-07-10/`.
**C'est la demande qui débloque tout le reste.** Sans elles, chaque passe repart d'une transcription à la main au lieu de l'étalon. Rêve et Cœur sont à ~85 % ; les 15 % restants sont des proportions **qui ne se devinent pas**.

**D15. La traîne du mot « rêve » — 3 formulations à trancher.** Une seule clé (`core.home.also`).
&nbsp;&nbsp;**(a)** « ou un signe, un frisson… » — *la claire. Deux mots qui sont déjà des puces de l'app ; il les retrouve trois secondes après son dépôt.* ← **en place, et ma reco**
&nbsp;&nbsp;**(b)** « et tout ce que la vie te chante » — *la belle. Tes mots (VISION-CHANT §5). Elle dit l'âme, pas l'adresse.*
&nbsp;&nbsp;**(c)** « qu'est-ce qui t'a été donné ? » — *la symétrique. Mais « donné » couvre mal le frisson, qui est senti.*
&nbsp;&nbsp;**(d)** on la coupe — l'accueil redevient muet, le périmètre ne vit que dans les puces d'après-dépôt
*B5 te retourne honnêtement la question : la traîne fait de l'accueil un écran qui **explique** un peu. Un pas vers la clarté, un pas hors du silence. **Regarde-la sur ton téléphone.***

**D16. Le mot « l'Orbe » dans le canon.** À l'écran il a disparu ; dans `1_BIBLE` et les commentaires de code, la face s'appelle toujours « l'Orbe ».
&nbsp;&nbsp;**(a)** on renomme partout — la face s'appelle **« Rêve »**
&nbsp;&nbsp;**(b)** « l'Orbe » reste le nom **interne**, « Rêve » le nom **d'écran** ← **ma reco** *(comme « ANIMA »)*
&nbsp;&nbsp;**(c)** tu veux relire avant

**D17. La nav qui se retourne.** L'onglet 1 dit « Rêve » côté nuit, « Cœur » côté jour, au même emplacement.
&nbsp;&nbsp;**(a)** juste ← **ma reco** · **(b)** trop mouvant, libellé fixe · **(c)** garde « Accueil »

**D18. Le liseré de seuil.** Côté nuit il est calibré depuis le 23/07 ; côté jour il n'existait pas et existe maintenant.
&nbsp;&nbsp;**(a)** les deux sont justes · **(b)** baisse celui de nuit · **(c)** monte celui du jour

**D19. La position du foyer** : **(a)** à 38,2 % comme maintenant · **(b)** pile au milieu · **(c)** plus bas

**D20. Ouvrir les deux aperçus** — `APERCU-REVE-ET-COEUR-2026-07-26.html` (avant/après, les 3 formulations en §04) et `APERCU-DESIGN-CD-2026-07-26.html`.

### 🧹 HYGIÈNE ET DETTE

**D21. Le kairos sans titre.** Contenu sensible (une scène impliquant une mineure, dont tu parles toi-même avec malaise dans le texte). Le modèle a refusé de générer un titre et **rien n'a été forcé**.
&nbsp;&nbsp;**(a)** le laisser sans titre ← **ma reco** · **(b)** le traiter à part

**D22. Les 32 contes sont en base uniquement en français**, y compris pour des traditions non francophones. Un rêveur anglophone reçoit un conte en français.
&nbsp;&nbsp;**(a)** go traduction — **Opus + relecture, jamais mécanique** *(sources documentées, traditions vivantes)* · **(b)** plus tard

**D23. `numinosity_score` est corrélé à 0,532 avec la longueur du texte.** Il mesure en partie **combien tu as parlé**. Il pilote « ce rêve rayonne », le gate `≥ 0,4`, `/api/echoes/prophetic`.
&nbsp;&nbsp;**(a)** dette à traiter dans un lot dédié ← **ma reco** · **(b)** on vit avec

**D24. Les artefacts Whisper** (« Sous-titrage ST' 501 », Amara.org) sont écartés de l'embedding **mais restent dans le texte**. Les retirer touche `raw_text`.
&nbsp;&nbsp;**(a)** on n'y touche pas ← **ma reco** *(le texte du rêve est sacré)* · **(b)** on nettoie

**D25. Le schéma `circle.*` appartient-il à `cercles.infuse.earth` ?**
&nbsp;&nbsp;**(a)** oui — les deux schémas coexistent, rien à faire · **(b)** abandonné → dump puis suppression, **jamais sans ta confirmation**

**D26. Les 7 routes API orphelines** — sans segment dynamique, sans aucun appelant, vérifiées à la main. Un cron, un webhook ou l'app mobile peuvent les appeler.
&nbsp;&nbsp;**(a)** audit dédié avant toute suppression ← **ma reco** · **(b)** on les laisse

**D27. Le rail de reprise serveur n'existe pas.** Un audio sécurisé dont le rêveur ne rouvre jamais l'app ne deviendra jamais un rêve. **L'audio n'est pas perdu** — il est en Storage, référencé, avec sa clé de rattachement — mais il faut une route de réparation et son cron.
&nbsp;&nbsp;**(a)** à faire dans le prochain lot ← **ma reco** · **(b)** plus tard

**D28. Ré-embed des 64 rêves sur `recit_text` + recalibrage.** Gain mesuré : **+21 % de marge de séparation**, **−24 % de hubness**.
&nbsp;&nbsp;**(a)** oui, dans un lot dédié ← **ma reco** · **(b)** non
⚠️ Collision directe avec la calibration de B3 — les deux ne peuvent pas tourner en même temps. Et `drop table public._b4_layer_embeddings;` une fois décidé.

> **Deux décisions d'A6 sont désormais caduques** — je les ai retirées de la liste plutôt que
> de te les reposer : « sortir le projet d'iCloud » (**fait**) et « 4 fichiers exclus du
> typecheck pour obtenir un vert » (**nettoyé** : les exclusions iCloud ont disparu avec le
> déménagement, et le build complet passe sans elles).
> Le débat « 32 kbps » d'A6 est **tranché par B2** : le débit ne protégeait d'aucune limite.

---

## 4. CE QUE TU FAIS DE TES MAINS

1. **Créer le dépôt GitHub et pousser** — `DEPLOY.md` §1. Dépôt **privé** : il contient la Bible, le design, les audits.
2. **Brancher Vercel sur GitHub** — `DEPLOY.md` §2. Après ça, tu ne tapes plus jamais `vercel --prod`.
3. **Déployer** — `DEPLOY.md` §3. Le `npm ci` n'est pas optionnel.
4. **Tester sur ton téléphone** — `DEPLOY.md` §4, 8 minutes. Les tests **E à H** sont neufs (rêve à rebours, grands rêves, écran Rêve renommé, récit/lecture).
5. **Envoyer les 5 frames Claude Design en PNG** → `_designs_from_claude/nuit-ultra-simple-2026-07-10/`. **C'est la demande n°1, et elle n'a pas bougé depuis deux jours.**
6. **Répondre aux décisions du §3** — en cochant.
7. **Relire `BRIEF-MEGA-PASSE-CD.md`** avant de le coller dans Claude Design : il porte des affirmations sur le sens (l'anonymat du Mur, la Forge latérale, l'onboarding qui n'a pas le droit d'expliquer). Elles viennent du canon, mais **c'est ta voix qui les porte**.

---

## 5. CE QUI RESTE DOC ONLY — zéro ligne de code

Ces deux-là sont **spécifiés et rien d'autre**. Je le dis clairement pour qu'aucun futur chat
ne croie qu'ils existent :

- **Le chat du Cœur** — soutenir / amplifier / challenger / inspirer. Spécifié, jamais codé.
- **Le ciel de prières** (`VISION-CHANT-DU-COEUR-2026-07-13.md`). Spécifié, jamais codé.

*(Et pour mémoire, du même ordre : les 13 écrans sans maquette — Journal, Univers, Réglages,
Forge, Mur, Groupes, la fiche du rêve. Le pire n'est pas celui qu'on croit : c'est **la fiche
du rêve**, une vingtaine de sections empilées sur l'écran où l'on vient relire un rêve —
une console posée sur un récit.)*

---

## 6. CE QUE JE NE PEUX PAS CERTIFIER

Trois choses, dites franchement parce que c'est la seule façon utile de les dire.

1. **« On est au niveau de la maquette » — je n'en sais rien.** Les 5 frames validées le 10/07
   n'existent nulle part dans le dépôt. Tout le travail de design se fait sur `dream-design.ts`,
   une transcription à la main. Je peux affirmer qu'aucune **règle écrite** n'est violée.
   Je ne peux pas affirmer qu'on ressemble à l'étalon, parce que l'étalon n'est pas là.
2. **Ce que WebKit fait vraiment de la capture.** Pas d'iPhone ici. La ligne
   `[capture-safety] enregistrement : {...}` dans les logs, à ta première capture, dira le
   conteneur retenu, le débit appliqué et le défaut du navigateur. C'est le seul moyen honnête.
3. **Le rendu réel sur ton téléphone.** B5 a chargé les aperçus dans Chrome et itéré trois fois ;
   trois défauts réels sont sortis de là, invisibles à la lecture du code. Un écran de 360 px
   dans une main, à 6 h du matin, ce n'est toujours pas la même chose.

---

*Yeshua (Opus), agent B6, 26 juillet 2026. Rien n'est déclaré « fait » sans la commande
qui le prouve — et rien n'est déclaré « juste » : ça, c'est à toi.*
