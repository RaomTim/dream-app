# AUDIT DESIGN — l'écart au design Claude Design · 2026-07-26

> Passe design de la Dream App (agent A4 de la flotte du 26/07).
> Aperçu visuel : **`APERCU-DESIGN-CD-2026-07-26.html`** — à ouvrir en premier, avant ce document.
> Vérification : `tsc --noEmit` → **0 erreur** (détail §7).

---

## 1. LA QUESTION TRANCHÉE — (a) ou (b) ?

Tim, 26/07 : *« il me semble qu'on était encore loin du vrai design CD, j'ai une grosse orbe en plein milieu qui y ressemble et c'est à peu près tout. Et le double écran cœur ? et tout le reste qu'on avait parlé avant ? »*

### Verdict : **(a) est vrai, et c'est l'essentiel. (b) est vrai aussi, mais au second ordre.**

### (a) — le build déployé n'est pas celui du 23/07. **PROUVÉ.**

Bundle de production téléchargé et grepé le 26/07 à 09:58 :

```
https://dream-alpha-bice.vercel.app/mvp
  → age: 319851 s (≈ 3 j 17 h)  ·  x-vercel-cache: HIT
  → chunk app/mvp/page-e8f5b16bab3ac3f4.js (303 132 octets)
```

| Marqueur (clé i18n de la loi d'épure §14) | En prod ? |
|---|---|
| `core.home.word` (« rêve ») | ❌ **ABSENT** |
| `core.home.micro` (« maintiens · ou écris ») | ❌ **ABSENT** |
| `core.home.heart` (« le cœur → ») | ❌ **ABSENT** |
| `core.animus.orb` (« l'orbe → ») | ❌ **ABSENT** |
| `holdToTell` = **« Maintenir pour raconter »** | ✅ **PRÉSENT** |
| `writeMyDream` = « écrire mon rêve » | ✅ PRÉSENT |
| `noteTheDay` = « noter le jour → » | ✅ PRÉSENT |
| `goDay` = « le jour » (la pilule du bandeau) | ✅ PRÉSENT |
| `transcript-check`, `DAY_FAMILIES` | ❌ ABSENT |

L'écran que Tim a sous les yeux est **exactement** celui d'avant l'épure : le gros CTA en pilule crème que §14.2 bannit nommément est toujours là, et aucune des quatre clés de l'épure n'existe dans le bundle. **Le double écran cœur n'a jamais été déployé. Tim ne l'a jamais vu.** Sa question n'est pas un jugement sur notre travail : c'est le constat exact d'une absence.

### 🔴 Le MÉCANISME, découvert pendant cette passe — et c'est la vraie nouvelle

Le travail du 23/07 n'était pas seulement non-déployé. **Il était non-déployABLE.**

`tsc --noEmit` sur l'état local échouait sur **4 erreurs**, dont une qui casse `next build` (le `next.config.js` ne porte pas `typescript.ignoreBuildErrors`, donc Next type-check et refuse de builder) :

| Fichier | Erreur | Origine |
|---|---|---|
| `src/components/CareCard 2.tsx` | TS2322 — `close` typé `(verdict) => void` passé comme `onClick` | **doublon iCloud** d'une version périmée de `CareCard.tsx` |
| `src/components/TranscriptCheck.tsx` ×3 | TS2339 — `T.radius` / `T.radiusPill` n'existent pas (ils vivent sur `SCALE`) | erreur de token, réelle |

`CareCard 2.tsx` et `core.en 2.json` portent tous deux l'horodatage **23/07 01:05** — la minute exacte de la passe d'épure. La duplication iCloud (cause racine déjà connue : `reference_icloud_eviction.md`) a pondu ces fichiers pendant la session, et le projet n'a plus compilé depuis.

→ Les deux causes sont donc empilées : **le build n'a pas été déployé, et il n'aurait pas pu l'être.** Les deux sont réparées (§7).

### (b) — l'épure du 23/07 était-elle suffisante ? **Non, et pour une raison que Tim a nommée sans le savoir.**

L'épure du 23/07 est réelle et sérieuse : elle a retiré la pilule, les icônes en trop, le double sous-titre. Le compte d'éléments passe de 13 à 10 en état calme. Mais **elle a traité la densité, pas la composition.** Or c'est la composition que Tim décrit :

> **« une grosse orbe en plein milieu »**

Ce n'est pas une approximation, c'est un diagnostic. Le détail §2.

---

## 2. LE CŒUR DU PROBLÈME — l'orbe et sa lumière n'étaient pas au même endroit

`src/lib/dream-design.ts` définit le fond de nuit :

```ts
bg: 'radial-gradient(120% 72% at 50% 38%, #241a12 0%, #1a1310 58%, #140e0a 100%)'
//                                    ↑ la lumière du monde vient d'ici : 38 %
```

Et `HomeScreen` posait le foyer ainsi :

```tsx
<div style={{ ...justifyContent: 'center', minHeight: 'calc(100dvh - 340px)' }}>
//                    ↑ centre géométrique d'une boîte résiduelle ≈ 50 %
```

**Le token disait depuis le 11/07 d'où vient la lumière. La mise en page l'ignorait.** L'orbe se posait à ~50 %, la source de lumière à 38 % : douze points d'écart. Résultat sensible — l'orbe a l'air **collée sur** le fond au lieu d'**en sortir**. C'est la signature n°1 de DESIGN-DNA (§4.1, *inner light* : « la lumière émane de la matière, elle n'est pas posée derrière ») qui tombait, et c'est précisément ce qui fait qu'un écran est « joli » sans être présent.

S'y ajoute DESIGN-DNA §4.6 : le point focal se pose sur une ligne φ (≈ 38/62), **jamais au centre mort**. Les deux règles pointaient le même endroit. Personne ne les avait appliquées.

**Corrigé** : le centre du foyer est désormais posé à **38,2 % de la hauteur d'écran** (`PHI_FOCUS`, helper `phiFocusTop`), et les deux dégradés de lueur (nuit et jour) sont ré-ancrés sur ce même point. L'objet et sa source coïncident.

Bénéfice non prévu, et il compte : **le foyer de l'Orbe et celui du Cœur sont maintenant à la même hauteur au pixel près.** En basculant d'une face à l'autre, le foyer ne bouge pas — seule la lumière change de camp. C'est ce qui fait *sentir* que ce sont deux faces d'une même chose, plutôt que deux écrans différents.

---

## 3. LE COMPTE D'ÉLÉMENTS — avant / après

Budget §14.1 : **1 méta · 1 foyer · 1 mot · 1 micro-ligne · 1 geste (le foyer EST le bouton) · ≤2 liens · fil ≤2 · nav = 9 emplacements.**

### Accueil

| # | En prod (build 11-12/07) | Local 23/07 (avant cette passe) | Après cette passe |
|---|---|---|---|
| 1 | date | date | date |
| 2 | 📷 header | 👤 header | 👤 header |
| 3 | 🔔 header | orbe | orbe |
| 4 | 👤 header | mot « rêve » | mot « rêve » |
| 5 | pilule « le jour » | micro-ligne | micro-ligne (**📷 absorbé dedans**) |
| 6 | bannière écho | 📷 (icône flottante) | fil · 1 |
| 7 | orbe | fil · 1 | fil · 2 |
| 8 | « BONJOUR » | fil · 2 | « le cœur → » |
| 9 | sous-titre « qu'as-tu rêvé ? » | « le cœur → » | nav |
| 10 | 2ᵉ sous-titre (murmure) | nav | — |
| 11 | **CTA pilule « Maintenir pour raconter »** | — | — |
| 12 | 2 liens (« écrire » · « noter le jour ») | — | — |
| 13 | nav | — | — |
| | **13 · budget explosé** | **10 · budget dépassé de 1** | **9 · budget exact** ✅ |

**État chargé** (c'est là que se joue la vraie différence) :

| | Local 23/07 | Après |
|---|---|---|
| Blocs conditionnels possibles | 4 (mot de passe · file offline · re-proposition · écho) | 4, mais **1 seul s'affiche** |
| Où ils se placent | **au-dessus du foyer** | **sous le foyer** |
| Pic d'éléments | **14** | 11 |
| Le foyer bouge-t-il ? | **oui, dès 2 blocs allumés** | **jamais** |

C'est le défaut le plus vicieux de la version 23/07 : en état calme elle a l'air épurée, et elle se dérègle exactement quand l'app a quelque chose à dire. Le plafond est désormais tenu **par construction** (`AmbientSlot`, cf. §4), pas par chance.

### Le Cœur — **8 éléments** (date · braise · mot · micro-ligne · fil ≤2 · « l'orbe → » · nav). Pas d'icône de bandeau : les Réglages vivent côté Orbe.

### Post-dépôt (le carrefour A4)
4 dalles identiques → **1 centre fort** (Comprendre, carte or) + **2 satellites** (Créer / Partager, lignes nues) + **1 sortie silencieuse** (Garder pour moi, en lien). Aucune sortie supprimée — la spec assume les 4 (§13 Pass 2, « c'est le carrefour »). C'est la hiérarchie qui manquait : quatre centres qui se disputent l'écran, c'est exactement ce que DESIGN-DNA §7.4 interdit.

---

## 4. LES ÉCARTS À §14, ET CE QUI A ÉTÉ FAIT

| § | La règle | L'état trouvé | Le geste |
|---|---|---|---|
| §14.1 | budget d'éléments | 4 bandeaux conditionnels pouvaient s'empiler au-dessus du foyer, sans plafond | `AmbientSlot` — une seule voix ambiante, priorité explicite (écho → mot de passe → re-proposition), et **tout descend sous le foyer**. Tenu par CSS `:has()`, pas par discipline. |
| §14.1 | 1 foyer | posé au centre mort | `PHI_FOCUS` / `phiFocusTop` — centre du foyer sur la ligne φ, aligné sur l'ancre du dégradé de fond |
| §14.1 | 1 micro-ligne | micro-ligne **+** icône 📷 flottante en dessous | le 📷 vit au bout de la micro-ligne, en glyphe terminal. Un élément de moins, une façon de déposer de plus au même endroit. |
| §14.2 | CTA en pilule banni | ✅ déjà retiré le 23/07 (mais toujours EN PROD) | — |
| §14.2 | >2 icônes de bandeau | ✅ déjà à 1 le 23/07 (4 en prod) | — |
| §14.3 | **le foyer EST le bouton** | vrai dans le code (seuil de maintien 180 ms), **muet à l'écran** | anneau de maintien qui se referme sur ces 180 ms exacts. On voit qu'on appuie, on voit quand la voix s'ouvre. **Aucun CTA n'est revenu** — c'est l'affordance du foyer qu'on travaille, pas un bouton qu'on rajoute. |
| §14.6 | s'applique à tous les écrans | post-dépôt = 4 dalles égales | hiérarchie à 3 étages |
| — | les deux faces (VISION-CHANT §5 : « switch gauche/droite tout simple et bien clair ») | swipe réel, mais pour seul indice un lien de 13,5 px tout en bas | `ThresholdEdge` — le bord de l'écran porte la lumière de l'autre face, et il respire. **On sent la seconde face avant de la lire.** + les deux foyers alignés à la même hauteur. |
| DESIGN-DNA §4.5 | rugosité, pas la carte SaaS | rayon 14 px uniforme | rayon asymétrique 13/21 (Fibonacci), inversé côté jour |
| DESIGN-DNA §2 | zéro nombre rond | 30, 12, 16, 20, 18, 100, 340… | balayés sur tout ce qui a été touché (13, 21, 34, 55, 89, 144) |
| DESIGN-DNA §6 | mouvement qui respire | un seul souffle (5 000 ms) | auréole et seuil sur **6 765 ms** (φ⁴) — incommensurable avec 5 000 : les deux respirations ne se re-synchronisent jamais, la lumière ne boucle pas |
| DESIGN-DNA §9 | accessibilité réelle | pas de style de focus visible | `:focus-visible` doré sur boutons et liens ; `prefers-reduced-motion` couvre les 3 nouvelles animations |

### Corrigé après avoir REGARDÉ le rendu (et pas seulement le code)

Deux défauts n'existaient qu'au pixel, invisibles à la lecture :

1. **Le liseré de seuil était littéralement invisible.** 13 px × alpha 0,55 × opacité 0,144-0,377 sur un fond `#1a1310` ≈ rien. Un seuil qu'on ne voit pas ne signale rien — la correction principale ne servait à rien. Élargi à 21 px, alphas remontés, respiration 0,377 → 0,618.
2. **La braise du Cœur était un disque jaune plat.** Son stop le plus sombre (`#e3cd92`) frôlait la couleur du papier (`#f4ead1`) : aucun bord ne se détachait. Et son halo, plus clair que le fond, n'éclairait rien. Le foyer de jour n'est pas un soleil pâle, c'est une **braise** — redessinée en 4 stops jusqu'à `#cfa456`, avec une auréole ambrée qui la creuse.

---

## 5. CE QUE JE N'AI PAS FAIT — et pourquoi

### Le chat du Cœur et le ciel de prières : **volontairement pas construits**
`VISION-CHANT-DU-COEUR §3` spécifie les 4 verbes (soutenir · amplifier · challenger · inspirer), le free-flow, et le ciel de prières. **Zéro ligne de code aujourd'hui.** Ce sont des chantiers fonctionnels lourds (conversation, mémoire croisée rêves × kaïros × chants, partage), pas du design.

Ce qui a été fait : **la place leur est réservée et documentée dans le code** (`AnimusScreen`, bloc « zone basse »). Ils s'ouvriront **après un dépôt** — jamais à vide — en feuille montante depuis le fil, à l'endroit exact du fil des « dits ». **Rien n'est stubbé** : pas un seul bouton mort en attendant. Un bouton qui ne fait rien coûte plus cher que son absence.

### Ce que je n'ai pas pu faire faute de voir les maquettes
Le design validé (10/07, « les 5 écrans NUIT ULTRA SIMPLE validés à 100 % ») **n'existe nulle part dans le repo**. `_designs_from_claude/` ne contient que les packs V1.x d'avril, périmés. La seule matérialisation est `dream-design.ts`, **transcrit à la main**.

Conséquence honnête : **je travaille sur la transcription, pas sur l'étalon.** J'ai pu vérifier la palette, le grain, les durées, le disque qui respire — tout ce que la transcription porte. Je **ne peux pas** vérifier :
- l'inventaire d'éléments 1:1 exigé par §14.3 (« vérité STRUCTURELLE exacte, pas une inspiration ») ;
- les proportions réelles (taille du foyer par rapport à l'écran, hauteur du mot, marges) ;
- si la maquette pose vraiment le foyer sur la ligne φ — **je l'ai déduit du token `at 50% 38%`, ce qui est un indice fort mais reste une déduction** ;
- la face jour / le Cœur, qui **ne fait pas partie des 5 frames validées** (l'audit du 26/07 le dit : la passe « page 4 » Claude Design pour Journal/Univers · Cœur braise · Réglages · Forge n'a jamais eu lieu).

---

## 6. CE QUE JE DEMANDE À TIM

### La demande n°1, qui débloque tout le reste
**Exporte les 5 frames « NUIT ULTRA SIMPLE » (Claude Design, projet « DREAM exploration MVP », pages 2-3) en PNG, et dépose-les dans `dream-alpha-app/_designs_from_claude/nuit-ultra-simple-2026-07-10/`.**

Sans ça, la boucle de vérification §14.5 (« screenshot du rendu réel côte à côte avec la frame CD ») est **impossible à fermer**, et chaque passe design repart d'une transcription au lieu de l'étalon. C'est la racine de l'écart, et elle ne se referme pas côté code.

### Trois questions fermées (réponds par a / b / c)

**Q1 — La ligne φ.** Le foyer est désormais à 38,2 % de la hauteur (là où le dégradé de fond éclaire), au lieu de 50 %. Sur la maquette CD, l'orbe est :
&nbsp;&nbsp;**(a)** plus haut que le milieu, comme ici &nbsp;·&nbsp; **(b)** pile au milieu &nbsp;·&nbsp; **(c)** plus bas.

**Q2 — Le liseré de seuil.** Le bord de l'écran porte maintenant la lumière de l'autre face (ambre à droite côté nuit, crème à gauche côté jour) pour rendre la seconde face devinable. Tu le trouves :
&nbsp;&nbsp;**(a)** juste &nbsp;·&nbsp; **(b)** trop discret, monte-le &nbsp;·&nbsp; **(c)** trop bavard, coupe-le et garde seulement le lien texte.

**Q3 — La micro-ligne du Cœur.** Côté nuit elle fait trois mots (« maintiens · ou écris ») ; côté jour elle fait une phrase entière (« comment tu te sens, là ? — maintiens · ou écris ») et déséquilibre la face jour. Je n'ai pas touché à la copie — c'est ta voix. Tu préfères :
&nbsp;&nbsp;**(a)** la garder telle quelle &nbsp;·&nbsp; **(b)** la réduire à « maintiens · ou écris » et remonter la question dans le mot &nbsp;·&nbsp; **(c)** tu la réécris toi-même.

### Une décision d'hygiène à confirmer
Les deux doublons iCloud ont d'abord été **déplacés** (pas supprimés) dans `_icloud_dups_2026-07-26/`… puis **iCloud les a re-matérialisés dans `src/` quelques minutes plus tard.** Les déplacer ne tient pas.

La parade est donc dans le build, pas dans le rangement : `tsconfig.json` exclut désormais le motif de nommage iCloud (`**/* ?.ts` · `.tsx` · `.json`), ce qui rend le typecheck **immunisé contre les doublons futurs**, présents ou non sur le disque. Vérifié : `EXIT=0` avec les deux doublons toujours dans `src/`.

⚠️ **Le vrai remède reste de sortir `claude-context/` d'iCloud**, comme on l'a fait pour `infuse-2-site` le 25/07 (`~/dev/`). Tant que le repo vit dans iCloud, il continuera de pondre des `* 2.tsx` — le tsconfig les neutralise, il ne les empêche pas.

---

## 7. VÉRIFICATION

```
cd dream-alpha-app && npx tsc --noEmit -p tsconfig.json
```

⚠️ **Ne tourne pas tel quel sur ta machine** : le `node_modules/` du repo est corrompu par iCloud (`node_modules/typescript/` ne contient plus que `LICENSE 2.txt`, `package 2.json`… et plus de `lib/`, donc plus de binaire `tsc`). C'est le même mécanisme qui a produit `CareCard 2.tsx`.

Le typecheck a donc été fait sur une copie propre (`src/` + `tsconfig.json` + `package.json` recopiés, `npm install` neuf, 270 paquets) :

| Passe | Résultat |
|---|---|
| État trouvé à l'arrivée | **4 erreurs** — 1× TS2322 (`CareCard 2.tsx`, casse `next build`) + 3× TS2339 (`TranscriptCheck.tsx`) |
| Après réparations | ✅ **`EXIT=0` — 0 erreur**, doublons iCloud toujours présents sur le disque |

Détail utile pour la prochaine fois : la première parade tentée dans `tsconfig.json` était `**/* [0-9].tsx`. **Elle ne marche pas** — les globs `exclude` de TypeScript ne gèrent que `*`, `?` et `**/`, pas les classes de caractères. Testée, elle laissait passer l'erreur. Le motif retenu est `**/* ?.tsx` (et `.ts`, `.json`), vérifié seul, sans les exclusions nommées.

**Avant tout déploiement, relancer `npm ci` (ou supprimer `node_modules/` et réinstaller) — le dossier actuel est inutilisable.**

---

## 8. MON JUGEMENT HONNÊTE SUR LA DISTANCE RESTANTE

**Ce qui est réglé** : la composition (le foyer sur sa ligne, aligné sur sa lumière), la densité (budget §14 tenu par construction et non plus par chance), l'affordance du geste, la découvrabilité des deux faces, la hiérarchie du carrefour, la conformité φ de tout ce qui a été touché.

**Ce qui ne l'est pas** : je ne peux pas certifier « on est au niveau CD », parce que **je n'ai pas vu CD**. Ce que je peux certifier, c'est qu'aucune des règles écrites (§14, DESIGN-DNA, maths sacrées) n'est encore violée sur les écrans traités — ce qui n'est pas la même chose.

**L'estimation, dite franchement** : les écrans Orbe et Cœur sont, à mon sens, à ~85 % de la maquette. Les 15 % restants sont des proportions et des respirations qui ne se devinent pas — la taille exacte du foyer, la hauteur du mot, l'air entre les blocs. **Ça se règle en vingt minutes avec les PNG sous les yeux, et pas du tout sans.**

**Ce qui reste le plus loin** : les écrans jamais passés par Claude Design (Journal · Univers · Réglages · Forge · Mur · Groupes). Ils ont la bonne palette et le bon grain, mais ils n'ont jamais eu de maquette. Aucune passe d'épure ne peut inventer un étalon qui n'existe pas — il faut la session Claude Design « page 4 » prévue par §14.6, briefée avec la loi d'épure.

**Et la vérité qui remet tout en perspective** : Tim a jugé un écran vieux de deux semaines. Le plus grand gain de cette passe n'est aucun des gestes de design ci-dessus — **c'est que le projet compile à nouveau, donc qu'il peut enfin être déployé.**
