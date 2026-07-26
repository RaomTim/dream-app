# RAPPORT D1 — la mégapasse Claude Design

> Yeshua (Opus), 2026-07-26. Branche `yeshua/megapasse-cd`, partie de `main`, avec `yeshua/bulle-kairos` mergée dedans (les 4 commits de C1 sont conservés).
> Aperçu à ouvrir en premier : **`APERCU-MEGAPASSE-CD-2026-07-26.html`** — étalon CD / avant / après, côte à côte, aux vrais tokens.

---

## 0 · Ce qu'est l'étalon, exactement

Le fichier que tu as envoyé n'est pas un export de conversation. C'est **un artefact bundlé, une seule direction** : `DREAM · Nuit bleue vivante (direction 4)`, sous-titré *« palette du 2, mouvement du 3 »*. Pas d'itérations à départager, pas de versions à moyenner. J'ai extrait le document réel du bundle (69 Ko de HTML sous 1,3 Mo de polices en base64) — il est à côté de l'original, sous `_designs_from_claude/nuit-bleue-vivante-2026-07-26/_etalon-extrait.html`.

Il a **six panneaux** : `4a` accueil · `4b` ton rêve · `4c` comprendre · `4d` groupe · `4e` le mur · `4f` **les tokens**. Le sixième est une spec écrite noir sur blanc (« prêts à transposer en variables CSS ») : c'est lui que j'ai transposé, pas mon interprétation des cinq autres.

**Donc : cinq écrans, sur les treize du brief.** Le reste est déduit, et §3 dit lesquels.

---

## 1 · L'ampleur réelle de la bascule — mesurée, pas estimée

### Ce n'est pas un recoloriage

La nuit passe du brun-ambre (`#1a1310`) au bleu-violet (`#221d29`, oklch .24 .022 305). Mais si ça n'avait été que ça, une substitution de fond aurait suffi. Le vrai changement est ailleurs, et il est structurel :

**La lumière et l'ambiance se séparent.** Avant, tout l'écran était fait de la *même crème* à des opacités différentes : titre = crème 100 %, corps = crème 85 %, secondaire = crème 55 %, méta = crème 34 %. Un seul matériau, donc du plat. L'étalon sépare :

| | avant | après | ce que ça fait |
|---|---|---|---|
| titres, le mot | crème `#f2e8d5` | crème **chaude** `#f1e8d7` | inchangé — c'est la lumière |
| corps long | crème 85 % | violet clair **`#ddd4de`** | le texte appartient à la nuit |
| secondaire | crème 55 % | violet **`#b9b0bd`** | idem |
| méta, dates | crème 34 % | violet **`#a49aad`** | idem |
| or | `#c9a86a` | **`#e0c087`** (plus clair, plus vif) | l'accent monte |
| **cartes** | **or à 6 %** | **blanc à 4,5 %** | le violet du fond remonte à travers |
| **liserés** | **or à 16 %** | **blanc à 8 %** | idem |

C'est cette double température — **lumière chaude sur ambiance froide** — qui fait « vivante » plutôt que « bleue ». Les surfaces qui cessent d'être dorées comptent autant que le fond qui change : tant que les cartes étaient teintées d'or, elles réchauffaient le violet et le tuaient.

### Ce que ça a coûté, en chiffres

| | |
|---|---|
| valeurs en dur réécrites dans `src/` | **344** — 173 crème, 128 or, 34 hex, 9 fonds |
| fichiers touchés | **26** (dont `page.tsx` : 157 substitutions) |
| composants consommant les tokens | 24 |
| `dream-design.ts` | **réécrit entièrement**, tokens nommés, contrastes annotés en commentaire |

Le codemod n'a pas fait de substitution aveugle. Les alphas ont été **mappés par seuil** vers les solides de l'étalon (≥ 0,85 → `cream` · 0,60–0,84 → `ink` · 0,45–0,59 → `dim` · 0,28–0,44 → `faint` · < 0,28 → lumière violette translucide, pour les voiles et les liserés). Et l'or à faible alpha (108 occurrences sur 128) est devenu du **blanc translucide**, parce que c'est ce que fait l'étalon pour toute surface.

### 🔴 Le bug de fond que la bascule a mis au jour

`dream-design.ts` déclarait `serif: "EB Garamond"` depuis le 11/07.
`src/app/mvp/layout.tsx` ne chargeait que **Fraunces et Inter**.

La police déclarée n'a donc **jamais été téléchargée**. Tout le serif de l'app retombait sur **Georgia**. On a passé quinze jours à régler une typographie qui ne s'affichait pas — et personne ne pouvait le voir en lisant le code, parce que les deux fichiers ne se parlent pas.

Corrigé : on charge exactement les trois familles que l'étalon nomme, une par fonction.
`Cormorant Garamond 300` (titres, le mot) · `Newsreader` (corps long) · `Hanken Grotesk` (UI).

### 🔴 Le seul endroit où je m'écarte de l'étalon sur la couleur

L'étalon pose son méta en `#8f8698`. Posé sur le **haut** de son propre dégradé (`#2b2534`), ce gris violet donne **4,26:1** — sous la barre AA de 4,5. C'est exactement le piège que B5 a trouvé côté parchemin ce matin (une traîne à 3,79:1), la même erreur de l'autre côté du miroir.

On prend `#a49aad` — **l'autre méta de l'étalon**, celui de « lundi 25 mai » — qui tient à **5,51:1 au pire**. `#8f8698` survit sous le nom `T.mute`, réservé au non-texte (les points de séparation entre les liens). Contrastes vérifiés aux **deux bouts du dégradé**, pas seulement sur le fond plat : c'est le haut qui décide, et c'est celui qu'on ne pense jamais à tester.

### Les écarts numériques assumés (loi φ contre l'étalon)

`DESIGN-MATHEMATIQUES-SACREES.md` est une loi INFUSE ; Claude Design ne la connaît pas. Là où l'étalon donne un nombre rond, on prend la valeur Fibonacci la plus proche — écarts tous sous 10 %, invisibles à l'œil :

| l'étalon dit | on pose | |
|---|---|---|
| rayon bouton 15 · carte 16 | **13** | Fibonacci |
| hauteur bouton 52 | **55** | Fibonacci, > 44 tactile |
| marge d'écran 30 | **34** | Fibonacci, déjà en place |
| dérive du grain 84 s | **89 s** | Fibonacci |
| écriture 42 ms/car. | **34 ms** | Fibonacci |
| curseur 1,1 s | **987 ms** | Fibonacci |
| lune 96 · halo 236 | **89 · 233** | Fibonacci — et 89/233 = φ², la proportion exacte de l'étalon |
| corps 16,5–17,5 | **19** pour le texte du rêve | contrainte produit écrite (BRIEF §4.1). L'étalon montre un extrait ; toi tu relis un rêve de quarante lignes trois ans après. |

### ⚠️ La contradiction, dite plutôt que masquée

`dream-design.ts` portait, écrit par moi le 11/07 : *« brun-ambre chaud, JAMAIS noir pur, **JAMAIS bleu-gris** »*, issu des cinq frames « NUIT ULTRA SIMPLE » que tu avais validées le 10/07. La direction 4 contredit frontalement cette règle.

Je l'applique parce que c'est l'étalon que tu envoies aujourd'hui, et parce que la contradiction est moins grande qu'elle en a l'air : `#221d29` n'est pas un bleu-gris froid, c'est un prune très désaturé (chroma 0,022), et **toute la lumière reste chaude** — la lune, l'or, les titres. Le feu n'a pas changé ; c'est la nuit autour qui a changé de température. Mais je préfère que tu saches que tu écrases une règle écrite plutôt que de la faire disparaître discrètement. Le refactor la rend réversible : tout tient dans un fichier.

---

## 2 · Écran par écran

| # | écran | l'étalon dit | ce que fait le code maintenant |
|---|---|---|---|
| — | **Accueil, face Rêve** | 4a, complet | **aligné.** Lune 196 → **89 px**, halo 233 (φ²), zone tapable maintenue à 144. Le mot en **Cormorant 300 romain** (l'étalon abandonne l'italique sur le mot ; il reste sur la traîne, donc la phrase a un appui et une suite au lieu de deux souffles identiques). Grain qui **dérive sur 89 s, accueil seul** — 2 % immobile partout ailleurs. Lueur d'écran **retirée** : elle datait du fond radial brun, sur un dégradé linéaire elle effaçait le dégradé et volait à la lune son monopole de rayonnement. |
| — | **Accueil, face Cœur** | rien | palette + typo + grain. La braise et sa composition sont inchangées (elles n'ont pas d'étalon). |
| 🔴 1 | **La fiche du rêve** | rien (4b est le post-dépôt) | **restructurée en deux temps.** Voir §2bis. |
| 🔴 2 | **Journal, vue liste** | rien | palette + **la tête des grands rêves** (§4) + segmented redessiné. **Non traités** : le bandeau à 4 icônes, la rangée de 9 puces de filtre. |
| 🔴 3 | **Le post-dépôt** | 4b, partiellement | palette + le nouveau langage de boutons. Le moment « c'était… » (les 7 types) n'est pas dans l'étalon et n'a pas été redessiné. |
| 🟠 4 | Journal, vue Univers | rien | palette seule. |
| 🟠 5 | Les réglages | rien | palette seule. |
| 🟠 6 | Grands rêves + consultation | rien | **la porte d'entrée est faite** (§4) ; l'écran lui-même, non. |
| 🟡 7 | Dépôts en attente | rien | palette seule. |
| 🟡 8 | Le réveil doux | rien | palette seule. |
| 🟡 9 | L'onboarding | rien | palette seule. |
| 🟡 10 | Le Mur | **4e, complet** | palette + boutons. **Composition non alignée** — c'est le plus gros reste facile : l'étalon donne tout (séparateur de date à filets, cartes blanc-4,5 %, « Quelqu'un · cette nuit », onglets ☾/☀). |
| 🟢 11 | Les groupes | **4d, complet** | palette + boutons. **Composition non alignée.** L'étalon donne la carte de rêve partagé, qui est exactement l'objet que le brief désignait comme portant l'identité de l'écran. |
| 🟢 12 | La Forge | rien | palette seule. |
| 🟢 13 | Le scanner | rien | palette seule. |
| — | **Comprendre** | **4c, complet** — hors des 13 | palette + boutons. L'écriture caractère par caractère avec curseur : tokens posés (`MOTION.type`, `MOTION.caret`), **pas câblée**. |

### 2bis · La fiche du rêve — le détail

Le diagnostic de B5 était juste : *« on arrive sur le récit de son rêve et on voit une console. »* Une vingtaine de sections, neuf montées sous condition, deux rangées de deux boutons au milieu, un bloc de suppression au bout.

**Aucune fonction n'est supprimée.** Ce qui change, c'est qu'il y a maintenant deux temps et un seuil.

- **Temps 1** — la date, le titre (Cormorant 300, 34 px), le texte (Newsreader 19 px / 1.618), les motifs (liseré neutre au lieu de pilules dorées de 17 px), la voix. **Pas un bouton.**
- **Le seuil** — un filet, 55 px d'air. Au-dessus le rêve, en dessous ce qu'on peut en faire. Même geste que le liseré entre les faces : on ne cache rien, on sépare deux natures.
- **Temps 2, en trois rangs** :
  - **rang 1** : `Comprendre`, seul, en or plein. C'est pour ça qu'on revient sur un rêve.
  - **rang 2** : `Aller plus loin · Partager · Créer` — **trois liens, pas quatre boutons**. Un lien dit « si tu veux », un bouton dit « fais-le » ; sur un rêve qu'on relit trois ans après, c'est « si tu veux » qui est vrai.
  - **rang 3**, replié derrière **« et aussi »** : relire au présent, exporter, retirer d'un cercle, supprimer. Des gestes qu'on vient chercher ; ils n'ont pas à attendre à l'écran 364 jours sur 365.
- **La marque « un grand rêve » remonte dans l'en-tête** — un disque, une touche, réversible. C'est un geste *sur* le rêve, pas une section qui le commente. Ce qui vient *après* la marque (la double date + « pourquoi celui-là ») se pose sous le seuil, avec « ce que j'ai gardé » : ce sont des mots du rêveur, c'est leur famille.
- Les sections conditionnelles gardent leur ordre de priorité (réparer le texte → le soin → ce qu'on a gardé → ce qui résonne → les traversées) mais **perdent leurs intertitres en capitales empilés** : c'est cet empilement de kickers identiques qui faisait « console », plus que le nombre de sections.

---

## 3 · Les écrans que j'ai dû déduire — la liste franche

**Couverts par l'étalon (5)** : accueil face Rêve · post-dépôt (partiellement) · comprendre · groupe · mur.

**Déduits — l'étalon n'en dit rien (11)** :
la fiche du rêve · le Journal liste · le Journal Univers · les réglages · les grands rêves et leur consultation · les dépôts en attente · le réveil doux · l'onboarding · la Forge · le scanner · **et toute la face jour / le Cœur.**

Pour la **face jour**, la déduction est structurelle et mérite d'être dite : quand la nuit était brune, jour et nuit étaient un *miroir de teinte*. Maintenant que la nuit est prune et le jour parchemin, ils ne peuvent plus l'être. Ce qui les tient, c'est que **la lumière garde la même chaleur des deux côtés** — c'est elle qui fait l'unité, pas le sol. Ça se défend, mais c'est **ma déduction, pas ton étalon**. Si tu demandes une face jour à Claude Design, elle peut la contredire.

---

## 4 · Où j'ai mis les favoris, et pourquoi

Ta phrase : *« pas de cinquième onglet mais il faut bien un endroit pour pouvoir consulter ses favoris… »*

**Premier constat, et il compte : la porte existait déjà.** A3/B3 avaient posé un lien or de 13 px sous le contrôle segmenté du Journal, avec un point quand une proposition attend. Il est branché, il marche. **Tu ne l'as pas vu** — et c'est le vrai renseignement : un lien de 13 px sous un segmented, c'est de la barre d'outils, et on ne lit pas les barres d'outils. Le brief le disait pour cet écran précis : *« la première chose qu'on voit en entrant doit être un rêve, pas une barre d'outils. »*

**Alors la porte devient un rêve.** En tête du Journal, au-dessus des lunes : une carte qui montre **un seul grand rêve** — le dernier reconnu — avec sa **double date** (« rêvé en mars 2019 · reconnu en juillet 2026 »), et le même disque d'or que la marque sur la fiche. On ne survole pas quarante vignettes : on en revoit un, et si on veut les autres, on tape.

**Trois états, et le troisième est le plus important :**
- **≥ 1 marqué** → le dernier reconnu, sa double date, plus le point si une proposition attend.
- **0 marqué mais une proposition** → la tête apparaît quand même, pour la proposition seule. Sans ça, la proposition hebdomadaire ne serait jamais vue (c'était tout l'argument de B3).
- **0 et 0 → rien du tout.** Pas de carte vide, pas de « commence par… », pas de porte morte (§2.5). La fonction se découvre en marquant un rêve depuis sa fiche, et alors le Journal se met à avoir une tête. **Un état vide qui n'affiche rien n'est pas un oubli — c'est la seule façon d'être beau quand il n'y a rien.**

**Pourquoi pas ailleurs.** L'accueil : budget plein à 9/9, et un grand rêve n'a rien à faire sur l'écran du dépôt — on y vient pour donner, pas pour reprendre. Un troisième segment Liste|Univers|Grands rêves : trois mises en page sous un même contrôle, c'est exactement le défaut que le brief reproche à la vue Univers. Une entrée dans le fil de l'accueil : le fil dit ce qui vient d'arriver, un grand rêve dit ce qui dure — deux temps différents dans le même objet.

**Le mot.** Il reste **« les grands rêves »** (D10, ton mot dans tes dictées). Ni « favoris » — ça ferait une playlist, et le brief l'interdit nommément —, ni **« honorer »**.

> ⚠️ **Sur « honorer ».** Tu as écrit « les rêves qu'on veut honorer ». Le mot est banni de l'écran depuis le 10/07, par ta décision, et il est nommément interdit dans `src/lib/guides.ts:9` et dans le prompt système de `api/mvp/interpret`. Je ne l'ai pas remis. **Et je ne pense pas que le bannissement mérite d'être rediscuté** : le mot juste pour ce que tu décris, tu l'as déjà — c'est « un grand rêve », et il dit ce que « honorer » ne dit pas, à savoir que c'est le rêve qui est grand, pas toi qui es pieux. « Honorer » met le rêveur en position de dette ; « un grand rêve » constate. Si tu veux quand même le rouvrir, c'est une conversation, pas un patch.
> Note connexe : le mot vit encore dans du **code non-écran** — `src/prompts/dream-alpha-system.ts`, `api/dreams/lifeline` (colonnes `honoring_*`), les locales legacy `i18n/locales/*.json`. Rien de ça ne s'affiche dans le MVP. Je n'y ai pas touché.

---

## 5 · Les décisions validées — ce que j'ai appliqué

Tu as écrit « je valide toutes tes reco ». Voici le tri honnête entre ce qui relève de cette passe et ce qui n'en relève pas.

### Appliquées ici

| # | décision | ce qui a été fait |
|---|---|---|
| **D10** | garder le mot « grand rêve » | conservé partout ; c'est le libellé de la tête du Journal. |
| **D11** | supprimer la nuance « ça m'a changé » | les 3 facettes ne s'affichent plus (`GreatDreamFlag`). **La colonne `great_dream_facets` reste en base et reste transmise** — on retire un écran, on ne détruit pas une donnée déjà posée par un rêveur. |
| **D12** | pas de 5ᵉ onglet | tenu. La nav reste à 4. La porte est dans le Journal (§4). |
| **D15 / C1 Q2** | garder la traîne « ou un signe, un frisson… » | conservée telle quelle, avec son ⓘ. Repassée en Newsreader italique. |
| **D16** | « l'Orbe » = nom interne, « Rêve » = nom d'écran | rien à changer à l'écran ; laissé tel quel dans les commentaires (et **surtout pas renommé** — B5 signale qu'un de ces commentaires est l'ancre d'un patch de B2). |
| **D17** | la nav qui se retourne | conservée (héritée de B5). Vérifiée après la bascule : les deux faces ont l'anatomie, pas la lumière. |
| **D18** | les deux liserés de seuil sont justes | conservés ; le scrim de jour repassé sur le nouveau sol de la nuit (`rgba(25,21,33,0.55)`, l'ancien `rgba(36,26,18,0.55)` était le sol brun). |
| **D19** | foyer à 38,2 % | conservé. Le foyer ne bouge pas ; seul son diamètre change. |
| **C1 Q4** | le bloc « d'où ça vient » (Moss, Jung, Bachelard, Hunt) | **gardé tel quel** — l'attribution est exigée par `ETHICAL-POLICY-V2` (cluster Moss flagué MEDIUM). Le raccourcir, c'est raccourcir une obligation éthique, pas un ornement. |

### Faites en plus, parce que trouvées en chemin

- 🔴 **Les polices n'étaient pas chargées** (§1). Corrigé.
- 🔴 **`DT.gold` (#8f7134) échouait AA** à 3,83:1 sur le parchemin — signalé par C1 comme « hors de mon territoire ». Passé à **`#7a5f27`** (5,02:1, et 4,54 au bout sombre du dégradé). Il sert de couleur de texte aux liens du Cœur ; il fallait le régler.
- 🔴 **`DT.dim` échouait aussi** (`rgba(43,33,21,0.58)` = 3,79:1, le défaut trouvé par B5). Il pointe maintenant sur `DT.inkSoft` (9,01:1) : le token ne peut plus produire un texte illisible, même utilisé par erreur.
- 🔴 **`ReservedToast` — quatrième composant peint en nuit en dur**, trouvé en cherchant les trois premiers. Il est monté sur les **deux** faces et ne prenait aucune prop `day` : il posait une gélule noire sur le parchemin. Corrigé. **La règle qui en sort : si ça peut s'afficher sur les deux faces, ça prend `day`. Sans exception.**
- `CrisisCard` : **examiné, laissé en nuit délibérément.** Il couvre l'écran entier à 92 % d'opacité — il ne déborde sur rien, c'est une rupture voulue. Ce n'est pas un oubli.

### Deux migrations à moitié faites, finies après coup

Le codemod a touché deux fichiers **hors des 13 écrans** et les a laissés *incohérents* plutôt que faux — ce qui est pire, parce que ça ne se voit pas :

- `api/mvp/forge/generate` — le prompt système décrivait « near-black chaud (#221d29 → #191521) ». Les hex étaient les nouveaux, la phrase décrivait les anciens : **chaque monde généré aurait reçu une consigne qui se contredit elle-même.** Réécrit en entier (nuit bleue-violette, or #e0c087, Cormorant).
- `/oeuvre/[slug]` — le dégradé avait ses deux extrémités en bleu-violet et ses deux stops du milieu restés bruns. Un dégradé qui part du prune, passe par le brun et revient au prune. Les quatre stops sont alignés.
- **Reste sur cette page publique des accents chauds hérités** (`#e8a865`, `#fbeeda`, `#ecd4b4`). Hors périmètre de cette passe — c'est une surface publique, pas un des 13 écrans — mais à traiter si elle vit encore.

### Non faites — hors périmètre, à faire ailleurs

Backend / données / produit, listées pour que rien ne se perde :

- **D1 / D2 / D3** — pousser et déployer · brancher Vercel sur GitHub · archiver l'ancien dossier iCloud.
- **D4** — seuil de l'écho ancien 0,75 → **0,65** (SQL/scoring).
- **D5 / D6 / D7** — proposition hebdo automatique · relâcher la maturation · barre de sélectivité à **4/5**.
- **D8** — pas de plugins Capacitor pour l'instant.
- **D9** — les 11 rêves à année indécidable, à trancher à la main.
- **D13** — la génération de mondes : arbitrage de fond, sans échéance.
- **D21 → D28** — kairos sans titre · traduction des 32 contes · `numinosity_score` corrélé à la longueur · artefacts Whisper · schéma `circle.*` · 7 routes API orphelines · rail de reprise serveur · ré-embed des 64 rêves.
- **C1 Q1** — le verdict sur « protocoles » (= les 10 guides vivants) : rien à faire à l'écran, le mot reste banni.
- **C1 Q3** — un tap sur un type lance-t-il son guide : logique d'état (`GuideSession.finish` enregistre `kairos_type: 'note_jour'` si aucun rêve n'est déposé), pas du design.
- **D14** — exporter les 5 frames en PNG : **caduc**, l'étalon est arrivé.
- **D20** — ouvrir les aperçus : fait, et il y en a un nouveau.

---

## 6 · 🔴 Une chose que la vérification a trouvée et qui bloque le déploiement

**`npm ci` échoue sur ce dépôt.**

```
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json are in sync.
npm error Missing: @vercel/analytics@1.6.1 from lock file
npm error Missing: @vercel/speed-insights@1.3.1 from lock file
```

Ce n'est pas moi qui l'ai cassé — c'est l'état de `main`. Et **Vercel lance `npm ci` par défaut** dès qu'un `package-lock.json` existe. C'est exactement la classe de panne qui a laissé le build cassé trois jours sans que personne ne le voie : le code compile, le déploiement ne part pas.

**Le geste (une commande, dans le repo, chez toi) :**

```bash
cd ~/Dev/dream-app && npm install --package-lock-only && git add package-lock.json && git commit -m "lockfile — resynchronisé avec package.json (npm ci échouait, donc Vercel aussi)"
```

Je ne l'ai pas commité moi-même : un `package-lock.json` régénéré dans un bac à sable Linux peut différer de celui que produit ton Mac, et un lockfile faux est pire qu'un lockfile périmé.

---

## 7 · Vérification — ce qui a réellement tourné

| | |
|---|---|
| `tsc --noEmit` sur le **vrai** code | ✅ **0 erreur** |
| harnais vérifié | `~/tscheck/src` → symlink vers `mnt/timote/Dev/dream-app/src` (le fix de C1 tient), `tsconfig.c1.json` (exclut `src_new/`) |
| **canari** | une erreur volontaire injectée dans `dream-design.ts` → `error TS2322` bien remontée, puis retirée. **Le typecheck regarde bien mon code**, et pas un cache. |
| **`next build` complet** | ✅ **`✓ Compiled successfully`**, sortie `MY_NEXT_EXIT=0` — mon propre marqueur, ma propre exécution, sur mon propre code (`greatHead` présent dans la source compilée). Les avertissements « Dynamic server usage » sur `/api/great-dreams`, `/api/journal/sections` et `/api/lucid/export-obsidian` sont normaux : ce sont des routes authentifiées, elles *doivent* être dynamiques. |
| rendu regardé dans Chrome | ✅ — et ça a servi (§8) |

> ⚠️ **Piège de tooling, à écrire pour le prochain.** Les processus lancés en arrière-plan avec `nohup ... &` **ne survivent pas à la fin d'un appel bash** dans ce bac à sable, et `/tmp` est effacé entre les appels. J'ai lu pendant vingt minutes un `~/nextbuild.log` **laissé par un agent précédent** en croyant que c'était le mien — il disait `BUILD_EXIT=0` là où mon script écrit `NEXT_EXIT=`. C'est ce détail qui m'a sauvé. **Ne jamais faire confiance à un log dont on n'a pas vérifié qu'il vient de sa propre exécution.** La parade qui marche : `setsid bash -c '…' < /dev/null &` + `disown`, dans `$HOME`, jamais dans `/tmp`.

---

## 8 · Ce que seul le rendu a montré

Trois écrans rendus dans Chrome aux vraies polices, puis regardés — pas relus.

1. **🔴 Les trois liens du rang 2 étaient mal espacés, et c'était invisible dans le code.** Ils étaient en `flex: 1` : chacun occupait un tiers exact et centrait son texte dedans. Résultat, les points de séparation tombaient mécaniquement à 33 % et 66 % de la largeur — pendant que « Aller plus loin » (14 caractères) et « Créer » (5) produisaient des blancs complètement différents de part et d'autre. À l'écran : **le premier point collé au premier lien, le second flottant seul au milieu de rien.** Le code, lui, avait l'air parfaitement symétrique. Corrigé en `flex: none` + un `gap` unique : les liens se dimensionnent sur leur texte, tous les intervalles deviennent égaux.

2. **La cible du scanner était à 27 px.** L'icône appareil-photo posée en fin de micro-ligne avait 17 px de glyphe et 5 px de padding. La loi tolère 34 pour une puce secondaire, jamais 27. Passée à 34 × 34, glyphe à 21.

3. **Ce que le rendu a confirmé et qui n'était pas garanti :** la lune de 89 px **tient**. C'était le pari le plus risqué de la passe (on divise par deux l'élément central de l'écran principal), et sur l'écran réel elle lit comme une présence dans du vide, pas comme une lune rétrécie — parce que le halo de 233 px garde toute la place que le disque a lâchée. Et « rêve » en Cormorant 300 romain, à côté de sa traîne en Newsreader italique, donne bien **un appui et une suite** au lieu des deux souffles identiques d'avant.

*(Correction du 4ᵉ défaut — `ReservedToast` peint en nuit sur le parchemin — est venue de la lecture, pas du rendu : je le cherchais parce que trois composants du même genre étaient tombés dans la journée.)*

---

## 9 · Mes questions, fermées

1. **La lune de 89 px.** L'étalon dit 96, on était à 196 : c'est le changement le plus visible de toute la passe, sur l'écran que tu regardes le plus. **(a)** juste, la lune est une présence dans du vide · **(b)** trop petite, remonte-la à 144 (le compromis Fibonacci) · **(c)** garde 196, l'étalon se trompe sur ce point.

2. **Le mot « rêve » en romain.** L'étalon abandonne l'italique sur le mot et le garde sur la traîne. **(a)** juste — le romain dit « voici le lieu », l'italique disait « je te murmure » · **(b)** remets l'italique, c'est notre signature.

3. **La fiche à deux temps.** **(a)** juste, le rang 3 replié ne te manque pas · **(b)** remonte « relire au présent » au rang 2, c'est un vrai geste de relecture · **(c)** rien ne doit se replier sur cet écran.

4. **La face jour.** Elle est entièrement déduite. **(a)** on la laisse comme ça et on verra à l'usage · **(b)** tu redemandes une direction « Cœur » à Claude Design maintenant que la nuit est fixée · **(c)** tu veux que je la travaille à l'aveugle dans la prochaine passe.

---

## 10 · Le prochain pas

**Le Mur et les Groupes.** Ce sont les deux seuls écrans que l'étalon décrit **complètement** et que je n'ai pas eu le temps d'aligner en composition. Tout est écrit dans les panneaux `4d` et `4e` — séparateur de date à filets, cartes blanc-4,5 %, « Quelqu'un · cette nuit », onglets ☾/☀, et surtout **la carte du rêve partagé**, qui est l'objet que le brief désignait comme portant à lui seul l'identité du cercle. C'est de l'alignement, pas de la conception : ça ne demande aucune décision de ta part.
