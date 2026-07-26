# RAPPORT A6 — les documents canoniques

> Agent A6 · Opus · 2026-07-26 · flotte de 8 sur `dream-alpha-app`
> Périmètre : `1_BIBLE.md` · `2_DESIGN.md` · `4_LOG.md` · lecture de `VISION-CHANT-DU-COEUR-2026-07-13.md`.
> **Aucun fichier de `src/` touché. `3_TECHNICAL.md` non touché** (A8).
> **Statut : `full_green`** — les trois documents sont réécrits, vérifiés, et **plus légers qu'à l'arrivée**.

---

## 0. LES 21 DÉCISIONS QUI ATTENDENT TIM

> Consolidées depuis l'audit + les rapports A1 à A5, dédoublonnées, classées par urgence.
> C'est le livrable le plus utile de la journée. La même liste est dans `4_LOG.md`, entrée du 26/07 §5.

### 🔥 BLOQUANT — l'app saigne tant que ce n'est pas fait

**1. Déployer.** Rien de ce que la flotte a produit n'existe pour un utilisateur.
```bash
cd "$HOME/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app"
rm -rf node_modules && npm ci && npx tsc --noEmit -p tsconfig.json && npx vercel --prod --yes
```
*Le `node_modules` du repo est corrompu par iCloud (suffixes ` 2` partout) — le `npm ci` n'est pas optionnel.* **Sans ce déploiement, le bug du 26/07 est intact et le design que tu veux publier reste invisible.**

**2. Le débit d'enregistrement à 32 kbps** — une seule ligne. Le seuil de perte recule de **4 min 55 à ~19 min**. ⚠️ Non vérifié : la qualité de transcription à ce débit sur une voix pâteuse au réveil. À valider par un A/B avant de clore ; repli à 48 kbps.

**3. Sortir `claude-context/` d'iCloud** (comme le site le 25/07). iCloud **restaure les fichiers supprimés** : cinq suppressions faites aujourd'hui, cinq fichiers revenus, date de modification d'origine intacte. Le typecheck est immunisé contre les doublons — il ne les empêche pas de naître.

### 🎯 ARBITRAGES DE PRODUIT — ils bloquent du code déjà écrit

**4. L'écho ancien reste-t-il à zéro ?** Ton arbitrage du 25/04 (0,75) est **0,013 au-dessus du maximum atteignable par tes propres rêves** (0,7368). Ce seuil ne filtrait pas la feature, il la rendait impossible — et il n'était pas lu par le code. Mesuré : à 0,70 sans maturation, **3 échos sur tout le corpus**.

**5. La maturation reste-t-elle exigée ?** Telle que spécifiée (récurrence ≥ 3 **et** charge somatique ≥ 2), elle laisse passer ~1,25 % des paires. Et son intersection avec le critère géométrique est **vide** : cumuler les deux garde-fous produit le silence total. Les deux leviers sont livrés en paramètres — pas de migration nécessaire.

**6. La barre de sélectivité de la consultation : 3 ou 4 sur 5 ?** À 4, une des trois situations testées devient entièrement silencieuse **sans abîmer les bons résultats** des deux autres. **Recommandation : 4.** Une constante à changer.

**7. Valider le mot « grand rêve ».** Choisi parce que c'est **déjà ton mot dans tes propres dictées** (« Mon grand rêve, je me souviens j'étais dans une école… »). Si un autre vient, c'est une ligne de traduction — la base ne bouge pas.

**8. La nuance « ça m'a changé » mérite-t-elle de vivre ?** C'est la seule des trois qui ne pilote rien techniquement. À supprimer en premier si elle n'est jamais posée.

**9. Le journal des grands rêves : cinquième onglet ?** Non mis (la nav est à 4, une idée par écran). Si tu le veux, c'est trivial — mais il faudra en retirer un.

**10. 🔴 La génération de mondes — la question de fond.** Écrite au canon (`1_BIBLE` §1.1.bis) et **non tranchée à ta place** : *une image générée remplace-t-elle définitivement l'image intérieure ?* On ne dé-voit pas — et un monde jouable, c'est cette question puissance dix. Trois options posées : **(A)** génération libre · **(B)** génération différée (rien avant que le rêve ait vieilli ou été relu) · **(C)** génération non-figurative (l'atmosphère, jamais la scène). **Aucune urgence, aucune échéance** — mais la question doit être tranchée avant que la techno n'arrive, pas après.

### 🎨 DESIGN — vingt minutes de réponse débloquent une passe entière

**11. Exporter les 5 frames validées en PNG** → `_designs_from_claude/nuit-ultra-simple-2026-07-10/`. **C'est la demande qui débloque tout le reste** : les maquettes n'existent nulle part dans le repo, la seule matérialisation est une transcription à la main. Sans elles, la boucle de vérification est impossible à fermer et chaque passe repart de la transcription au lieu de l'étalon. Les écrans Orbe et Cœur sont à ~85 % ; les 15 % restants sont des proportions qui **ne se devinent pas**.

**12. La position du foyer** : (a) plus haut que le milieu, comme maintenant (38,2 %) · (b) pile au milieu · (c) plus bas.

**13. Le liseré de seuil** : (a) juste · (b) trop discret, monte-le · (c) trop bavard, coupe-le.

**14. La micro-ligne du Cœur** : (a) la garder · (b) la réduire et remonter la question dans le mot · (c) tu la réécris. **La copie n'a pas été touchée — c'est ta voix.**

**15. Ouvrir `APERCU-DESIGN-CD-2026-07-26.html`** (avant/après, avec les lignes de composition).

### 🧹 HYGIÈNE ET DETTE

**16. Le kairos sans titre.** Contenu sensible (une scène impliquant une mineure, dont tu parles toi-même avec malaise dans le texte). Le modèle a refusé de générer un titre et **rien n'a été forcé** — ce n'est pas un problème mécanique. Le laisser sans titre, ou le traiter à part ?

**17. Les 32 contes sont en base uniquement en français**, y compris pour des traditions non francophones. Un rêveur anglophone reçoit un conte en français. Go/no-go traduction — **Opus + relecture, jamais une traduction mécanique** (sources documentées, traditions vivantes).

**18. Le schéma `circle.*` appartient-il à `cercles.infuse.earth` ?** Si oui, les deux schémas coexistent légitimement et il n'y a rien à converger. Si abandonné : dump puis suppression — **jamais sans ta confirmation**.

**19. Un lot dédié sur les routes API orphelines** — 7 routes sans segment dynamique et sans aucun appelant, vérifiées à la main. Un audit s'impose avant toute suppression (un cron, un webhook ou l'app mobile peuvent les appeler).

**20. 4 fichiers source ont été exclus du typecheck** par un agent pour obtenir un vert. **Exclure du source pour verdir est un signal, pas une solution** — à nettoyer une fois les zombies supprimés côté Mac.

**21. Le rail de reprise serveur n'existe pas.** Un audio sécurisé dont le rêveur ne rouvre jamais l'app ne deviendra jamais un rêve. **L'audio n'est pas perdu** (il est en Storage, référencé, avec sa clé de rattachement) — mais il faut une route de réparation et son cron.

---

## 1. CE QUE J'AI RÉÉCRIT

### `1_BIBLE.md` — la refonte de fond

| Section | Nature |
|---|---|
| **§0.1 — LA THÈSE** | **nouveau, en tête du canon** — *« apprendre à se soutenir soi-même, se rendre compte de la force et la sagesse déjà présentes dans notre psyché »*, promue de note de vision à **critère de vérité de toute feature**. Trois conséquences dures, dont : *une app qui réussit se fait progressivement oublier — le succès n'est pas la rétention.* |
| **§1.1.bis — la génération de mondes** | **réécrit et élargi** — ta citation verbatim, les 4 raisons pour lesquelles cette capacité appartient légitimement à une app de rêve (la matière première n'existe nulle part ailleurs · l'*honoring action* de Moss · le retour du village sous une forme inédite · la position de veille), **la question Hillman/Aizenstat écrite en toutes lettres**, 3 options pour l'arbitrage futur, et **8 garde-fous posés avant la feature**. |
| **§1.5 — L'ORGANISME À DEUX FACES** | **réécrit intégralement** — remplace et absorbe l'ancienne inversion JOUR/NUIT. L'axe n'est plus la lumière du dehors, c'est **le sens du chant** : l'Orbe = ce que la vie nous chante · le Cœur = ce qu'on chante en retour. Écrit comme cosmologie (inspiration/expiration), avec ce que ça résout (la question terminologique ouverte depuis avril est close) **et ce que ça coûte** (les kaïros passent du jour à l'Orbe — déplacement réel, assumé, nommé). |
| **§3.1 / §3.1.bis** | question terminologique close · l'échec honnête du « dashboard jour » (0 note de jour sur 74 dépôts) et sa leçon : **un espace de dépôt sans question n'est pas un espace, c'est un vide poli**. |
| **§3.1.ter — SILENCE_AS_FEATURE** | **restauré et renforcé** — la règle centrale (*pas de génération si vide*) remise en gras, plus **la leçon du 26/07** et sa règle : *un principe qui n'a pas de test qui échoue quand on le viole n'est pas un principe, c'est un vœu.* Avec sa conséquence opératoire : toute red line qui gouverne un comportement doit avoir sa vérification exécutable. |
| **§3.5 — le moteur de résonance** | **renforcé** — « organe central » devient un engagement en trois points : un moteur qui ne peut pas se taire est pire qu'une recherche par mot-clé · le seuil se mesure par rêveur, jamais en constante (mesure : vraie résonance 0,6228 / bruit 0,6230) · la boucle de retour vaut mieux que tout réglage. |
| **§3.8 — couche 0 de persistance** | **nouveau** — l'incident audio, sa cause, et la loi qui en sort : **conserver → transmettre → transformer**. Plus le lien avec le ciel de prières : sans couche 0, cette promesse est intenable. |
| **§3.12 — LE CHANT DU CŒUR** | **nouveau** — les 4 verbes (et pourquoi « challenger » empêche l'ensemble de devenir une machine à consolation), le free flow, **le ciel de prières** et ses 3 conséquences architecturales, les 3 destins choisis par le déposant. |
| **§3.13 — LES GRANDS RÊVES** | **nouveau** — l'arbitrage d'A3 absorbé **avec son raisonnement** : pourquoi le marquage n'est pas au réveil, pourquoi *un rêve devient grand des années après*, pourquoi trois **effets sur le rêveur** et non trois catégories de rêve, et la règle dure : **seule la décision fait entrer dans le journal, jamais le score.** |
| **§3.14 — LA DOUBLE LECTURE** | **nouveau** — deux colonnes jamais fusionnées, la ligne à ne pas franchir (*l'app ramène le rêve, elle ne le traduit pas*), ce que la mesure a appris — **et la fragilité dite franchement** : la couche de rappel ne discrimine pas, ça cassera à 500 rêves. |
| **§4.1** | articulation « Big Dream » (concept d'analyse) vs « un grand rêve » (mot du rêveur). |
| **§8.7** | correction gravée : **on n'invente jamais un numéro d'urgence et on ne déduit jamais le pays de la langue.** |
| **§16 — note finale** | post-scriptum du 26/07 : ce que l'usage a validé, **ce qu'il a démenti**, ce que je laisse ouvert exprès. |

### `2_DESIGN.md` — la mise à jour d'expérience

- **§15 — LA LOI D'ÉPURE ET LES DEUX FACES** (nouveau, ~105 lignes) : absorbe la loi depuis `DREAM-MVP-SPEC-ECRANS-A-Z.md` §14 (qui attendait sa validation) et §12ter.H. Budget de 9 emplacements · **le budget tenu par construction et non par discipline** (le défaut vicieux : l'épure se déréglait exactement quand l'app avait quelque chose à dire) · **le foyer sur la ligne φ** avec la leçon canonique : *un token de design que la mise en page ignore est un mensonge silencieux* · la bascule Orbe↔Cœur et les deux foyers à la même hauteur au pixel près · le foyer EST le bouton · la règle de méthode : *une passe de design est finie quand le rendu a été regardé, pas quand le code est juste* · 3 questions ouvertes.
- **§16 — LES GRANDS RÊVES, LA DOUBLE LECTURE, L'ÉCRAN DU CŒUR** (nouveau, ~60 lignes) : où vit le geste de marquage **et où il ne vit surtout pas** · le journal (beau vide, pas une liste de favoris, il ouvre sur un rêve) · la consultation à deux colonnes avec le silence comme affichage à part entière · **l'écran du Cœur préparé sans être stubbé** — *un bouton qui ne fait rien coûte plus cher que son absence* · et la note que le budget de §15.1 est **plein** (9/9).
- **§3.13 PROPHETIC_AWAKENING** : spec corrigée sur mesures réelles — les 3 constats, le tableau des deux leviers, **[À TRANCHER — Tim]** ×2, et le rappel que le gate de numinosité ne filtre plus rien (91 % du corpus passe).
- **§3.4 ECHO_RIPENING** : encadré de mesure (5 paires sur 400) + renvoi vers l'arbitrage.

### `4_LOG.md` — l'entrée du 26/07, en haut

Chronologie inversée respectée. Six parties : **l'incident** (cause exacte, les 3 aggravants, l'ironie de l'Import Hub qui savait tout) · **les 8 chantiers** avec statut réel et les découvertes qui comptent · **🔴 la contradiction §12ter.H réconciliée** · **les docs canoniques** · **les 21 décisions** · **ce que la journée apprend au-delà des bugs** (5 leçons).

---

## 2. LA CONTRADICTION §12ter.H — RÉSOLUE

L'audit signalait que le code du 23/07 portait `§12ter.H (GO Tim)` alors que le LOG du 22/07 disait encore « décision Tim requise ».

**Vérifié en source** : `claude-context/memory/2026-07-22.md`, ligne 6 — *« bascule **ORBE/CŒUR (GO franc Tim)** »*, avec le détail de la passe livrée le jour même.

> **Le code avait raison, le LOG avait tort.** L'entrée du 22/07 est corrigée en place, avec la mention barrée et la source du GO. J'y ai ajouté la règle de tenue qui en découle : **une décision structurelle remonte dans le canonique le jour même**, pas seulement dans la mémoire quotidienne — sinon on retrouve, trois jours plus tard, un canon qui contredit le code sans savoir lequel fait foi.

---

## 3. BILAN LIGNES — plus léger, comme demandé

| Doc | Avant | Après | Δ | Ajouté | Retiré |
|---|---|---|---|---|---|
| `1_BIBLE.md` | 1474 | **1458** | **−16** | ~345 | ~361 |
| `2_DESIGN.md` | 3331 | **2948** | **−383** | ~200 | ~583 |
| `4_LOG.md` | 4713 | **4707** | **−6** | ~135 | ~141 |
| **Total** | **9518** | **9113** | **−405** | ~680 | ~1085 |

---

## 4. MES COUPES, JUSTIFIÉES

**Dans `1_BIBLE.md`**
1. **§3.1.ter fusionnée dans §3.10** (−45 l.) — le document décrivait **deux fois** l'appel à la sagesse des kairos, et §3.10 disait lui-même qu'il supersédait §3.1.ter depuis le 26/04. Un doublon que le doc avait déjà signalé et jamais résolu. Contenu conservé intégralement (les exemples de polyphonie et les anti-patterns restent).
2. **Sous-section « inversion JOUR/NUIT » de §3.1.bis** (−15 l.) — copie quasi mot pour mot de §1.5. Une seule cosmologie, un seul endroit.
3. **Table des cautions §6.1 dédoublonnée** (−12 l.) — **Hopcke y figurait trois fois**, Hyde, brown, Eisenstein, Eliade et Larsen deux fois chacun, avec des mentions « promu central » redondantes. Regroupées par fonction.
4. **§17 sous-apps : détails d'implémentation retirés** (−50 l.) — noms de tables, routes API, listes de zones SVG, modales. **Ça n'appartient pas à un doc de sens** : ça vit dans `3_TECHNICAL` et `4_LOG`. Remplacé par la doctrine + **deux dettes ajoutées** (les 3 livres de décodage à risque, les contes FR-only).
5. **§18 et §19 réduits à leur substance** (−48 l.) — deux sections qui disaient elles-mêmes « spec complète dans `2_DESIGN` » puis recopiaient la spec. Gardé : le verdict, ce qui tient encore aujourd'hui, la règle de préséance.
6. **Bloc de fin « voix mobilisées »** (−12 l.) — trois listes de noms qui répétaient §6.1. Remplacé par un renvoi.
7. **§9.2/§9.4/§9.5, §10, §11, §12, §13, §14, §15, §3.4.1, §3.6, §3.11** — resserrage de prose sans perte de contenu (listes à puces d'une ligne → paragraphes denses ; tableaux de 6 lignes → 2). Le glossaire passe de 45 entrées largement redondantes avec le corps du texte à ~28 **avec les nouveaux termes** (Orbe, Cœur, grand rêve, ciel de prières, SILENCE_AS_FEATURE).

**Dans `2_DESIGN.md`**
8. **§11.bis.14 à §11.bis.19 condensées** (−583 l., la coupe majeure) — **596 lignes de comptes rendus de sprint du 27/04** portant sur `public/v12`, base de code aujourd'hui legacy : noms de composants, valeurs de pixels, listes de correctifs P0/P1. C'est du **journal de bord**, pas du canon de design — et le journal de bord a son document. Ne restent que **6 règles encore vivantes**, dont celle qui s'est vérifiée à nouveau aujourd'hui : *une profondeur non découvrable n'existe pas.*

**Dans `4_LOG.md`**
9. **Les 11 « fix swarms » zones A→F des 14-15/05 condensés** (−95 l.) — listes `P0-x` sur `index.html` V8. Gardé les **3 bugs instructifs**, dont un écouteur qui lisait une valeur déjà effacée — **même famille que le bug SQL trouvé aujourd'hui** : *un code qui s'exécute correctement sur une donnée absente ne produit aucun signal.*
10. **Trois entrées top-nav/iOS du 15/05 fusionnées** (−26 l.) — le détail portait sur du legacy, et la préparation iOS est **entièrement remplacée** par le build réellement réussi du 11/07.

**Principe appliqué partout** : je n'ai supprimé **aucune décision, aucun arbitrage, aucune red line**. J'ai supprimé des **répétitions**, des **détails d'implémentation mal rangés**, et des **comptes rendus de sprint sur du code mort**.

---

## 5. CE QUE JE N'AI PAS FAIT — et pourquoi

- **Je n'ai tranché aucune décision de Tim.** Les 21 points ci-dessus sont posés, mesurés, avec une recommandation quand j'en ai une (points 6 et 10) — jamais un choix substitué. Les endroits où mon hypothèse pourrait passer pour une décision sont marqués **[À TRANCHER — Tim]** dans les docs.
- **Je n'ai pas touché à `src/` ni à `3_TECHNICAL.md`.** Zéro ligne.
- **Je n'ai rien supprimé sur disque** (iCloud restaure — constaté par A4 et A5). Toutes les compressions sont des **réécritures en place**.
- **Je n'ai pas réécrit les mots de Tim.** `VISION-CHANT-DU-COEUR-2026-07-13.md` est **intact** — c'est un document dicté, il est sanctuarisé. Ses phrases sont **citées** dans le canon, jamais reformulées.
- **Je n'ai pas renuméroté les sections.** Les références croisées (`1_BIBLE §2.2`, `§8.2`, `§3.5`…) existent dans `2_DESIGN`, `3_TECHNICAL`, la spec A→Z et `TAXONOMIE-GRANDS-REVES.md`. Une renumérotation « propre » aurait cassé des dizaines de renvois pour un gain cosmétique. Les nouvelles sections s'insèrent dans la numérotation existante (§0.1, §3.12-3.14, §15-16).

---

## 6. CE QU'UN FUTUR AGENT DOIT SAVOIR

1. **`1_BIBLE` §0.1 est le test à appliquer avant toute feature** : *rend-elle le rêveur plus capable de se tenir lui-même, ou plus dépendant de nous ?*
2. **La cosmologie est à deux faces** (§1.5). Toute nouvelle surface doit savoir de quel côté elle vit — l'Orbe reçoit, le Cœur chante. Un écran qui ne sait pas répondre est mal placé.
3. **`2_DESIGN` §15.1 : le budget est de 9 emplacements**, et l'écran du Cœur est **plein**. Le prochain ajout devra en retirer un.
4. **La question de §1.1.bis est ouverte exprès.** Ne pas la refermer par enthousiasme quand la techno arrivera. Trois options y sont posées ; aucune n'est retenue.
5. **La règle qui gouverne les autres** : un principe sans test qui échoue quand on le viole n'est pas un principe. Si tu ajoutes une red line à ces docs, **ajoute sa vérification** — assertion, test, ou requête de supervision prête à coller.

---

*A6 (Opus), 2026-07-26. Trois documents canoniques réécrits, aucune décision inventée, 405 lignes de moins qu'à l'arrivée.*
