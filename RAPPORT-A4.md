# RAPPORT A4 — passe design Dream (Orbe · Cœur · écrans) · 2026-07-26

**Statut : `full_green` sur le périmètre design + `tsc --noEmit` → EXIT=0.**
Livrables : `AUDIT-DESIGN-CD-2026-07-26.md` · `APERCU-DESIGN-CD-2026-07-26.html` (à ouvrir en premier) · le code.

---

## 1. La question posée — tranchée

**Hypothèse (a) : le build déployé n'est pas celui du 23/07. CONFIRMÉE, preuve au bundle.**
Le chunk de prod (`app/mvp/page-e8f5b16bab3ac3f4.js`) ne contient **aucune** des clés de l'épure (`core.home.word`, `core.home.micro`, `core.home.heart`, `core.animus.orb`) et contient toujours `holdToTell` = « Maintenir pour raconter », le CTA en pilule que §14.2 bannit nommément. Tim juge un écran d'il y a deux semaines.

**Hypothèse (b) : l'épure du 23/07 était insuffisante. VRAIE aussi, au second ordre** — elle avait traité la densité, pas la composition. Détail §2 de l'audit.

**🔴 Découverte non prévue, et c'est la plus importante pour la flotte :**
le travail du 23/07 n'était pas seulement non-déployé, **il était non-déployable**. `tsc --noEmit` échouait sur 4 erreurs, dont une TS2322 dans `CareCard 2.tsx` — un doublon iCloud daté du **23/07 01:05**, la minute même de la passe d'épure. `next.config.js` ne porte pas `ignoreBuildErrors`, donc `next build` refusait de builder. **Réparé** (§4).

---

## 2. Fichiers touchés

| Fichier | Nature |
|---|---|
| `src/app/mvp/page.tsx` | **le gros du travail** — primitives d'épure, HomeScreen, AnimusScreen, PostDepot, `FAM_BY_KIND` |
| `src/lib/dream-design.ts` | `moonStyle` — le foyer de JOUR (la braise) redessiné |
| `src/components/TranscriptCheck.tsx` | ⚠️ **hors de mon périmètre annoncé** — 3 erreurs TS bloquantes, cf. §4 |
| `tsconfig.json` | ⚠️ **fichier partagé** — exclusion du motif de doublon iCloud, cf. §4 |
| `_icloud_dups_2026-07-26/` | quarantaine (inopérante, iCloud restaure — cf. §4) |

---

## 3. ⚠️ POUR A8 — ce qui a bougé dans `page.tsx`

**Aucun patch A1/A2/A3 n'était déposé quand j'ai commencé** (vérifié : `ls PATCH-PAGE-TSX-A*.md` → rien). J'ai donc travaillé sans pouvoir m'aligner sur leurs ancres. Voici précisément ce qui pourrait les gêner.

### ✅ Intact — les ancres probables de A1 (audio)
- **`processBlob` n'a PAS été touché**, ni dans `HomeScreen` ni dans `AnimusScreen`. Le corps entier (le `try`, le `catch`, `networkDown`, `enqueueDeposit`, `rec.reset()`) est **byte-identique**. Les commentaires-repères `// LE cas sacré (§10 A3)` et `// Hors-ligne : la voix du cœur…` sont en place.
- `useRecorder`, `enqueueDeposit`, les imports d'`offline-queue` : intacts.
- Les clés `core.capture.*` et `core.offline.*` : intactes.

### ⚠️ Modifié — 3 lignes ajoutées dans les handlers de maintien
Dans **`onOrbDown` / `onOrbUp` / `onOrbLeave`**, des deux écrans, j'ai ajouté **une ligne chacun** (`setHolding(true)` / `setHolding(false)`) et déclaré `const [holding, setHolding] = useState(false)` juste au-dessus. La logique de capture est inchangée — `holding` ne sert qu'à dessiner l'anneau de maintien. **Un patch qui remplace ces fonctions en entier écrasera l'affordance** ; qu'il conserve les 3 appels `setHolding`.

### 🔴 Déplacé — le point d'attention principal
Dans **`HomeScreen`**, quatre composants ambiants ont **changé de place** : ils étaient entre le bandeau et le foyer, ils sont maintenant dans la zone basse, à l'intérieur d'un `<AmbientSlot>` :

```
AVANT (23/07)                          APRÈS
  <PasswordNudge/>                       … le foyer …
  <PendingSyncLine/>                     <PendingSyncLine/>
  <ReproposeLine/>                       <AmbientSlot>
  <EchoOfTheDayCard/>                      <div><EchoOfTheDayCard/></div>
  … le foyer …                             <div><PasswordNudge/></div>
                                           <div><ReproposeLine/></div>
                                         </AmbientSlot>
```

- **Pour A2 (résonance)** : `EchoOfTheDayCard` est **le composant le plus susceptible d'être patché** par A2 (c'est l'écho proactif, §12bis.B). Sa **définition n'a pas bougé d'une ligne** — seul son **site d'appel** a changé (déplacé + enveloppé dans un `<div>`). Un patch qui modifie le composant passe sans friction. Un patch qui cherche le site d'appel à l'ancienne place ne le trouvera plus.
- L'enveloppe `<div>` est **structurellement nécessaire** : le plafond « une seule voix ambiante » repose sur `.ambientSlot > div:not(:has(*))` / `> div:has(*) ~ div`. Retirer les `<div>` casse le plafond §14.
- **`ReproposeLine`** rend un Fragment (ligne + `ApptChooserSheet`) : c'est pour ça que chaque enfant est enveloppé plutôt que ciblé en `nth-child` — sinon la feuille se faisait masquer.

### Autres blocs restructurés (moins probablement ciblés)
- `Orb` — signature élargie : `{ rec, size, day, holding? }`. `holding` est **optionnel**, tous les appels existants compilent sans changement.
- `PostDepotScreen`, phase `ways` : les 4 boutons de sortie sont passés de 4 dalles identiques à 1 carte + 2 lignes + 1 lien. **Les handlers (`onInterpret`, `onCreate`, `setShareOpen`, `onKeep`) et les clés i18n sont inchangés** ; seule la présentation change. La clé `core.postDepot.keepForMeSub` n'est plus affichée (elle reste en base i18n).
- Nouveaux symboles au niveau module, insérés après `RingDivider` : `PHI_FOCUS`, `phiFocusTop`, `AmbientSlot`, `ThresholdEdge`. Nouvelles règles CSS dans `Shell` (`.oHold`, `.oAura`, `.gSeuil`, `.ambientSlot`, `:focus-visible`).

---

## 3bis. 🔴 RÉCONCILIATION DES PATCHS — vérifiée après leur dépôt

Les quatre `PATCH-PAGE-TSX-A*.md` (A1, A2, A3, A5) ont été déposés **pendant** ma passe. Je les ai relus et confronté chaque ancre à l'état réel du fichier. Résultat :

| Patch | Ancre | État |
|---|---|---|
| **A1** patchs 1-2 (`processBlob` ×2) | corps complet des fonctions | ✅ **intact au byte près** |
| **A1** patch 4 (`PendingSyncLine` → `PendingDeposits`) | déf. ~943 · usage ~1099 | ⚠️ déf. **intacte** (maintenant L947) · **usage DÉPLACÉ** → L1103, dans la zone basse |
| **A1** patch 6 (`PostDepotScreen.finalize`) | ~1441-1478 | ✅ `finalize` non touché (j'ai touché la phase `ways`, pas `finalize`) |
| **A2** (`emptyHint` de `<ResonanceSection>`) | ligne unique dans `ReadScreen` | ✅ **intacte au byte près** (L2686) — `ReadScreen` non touché |
| **A3** patch 5 (entrée depuis le Cœur) | bloc `marginTop: 18` + bouton `goAnima` | 🔴 **CASSÉE par ma passe** — correctif fourni ci-dessous |
| **A3** autres ancres (signature `AnimusScreen`, appel dans `MvpAppInner`) | signatures | ✅ intactes |
| **A5** (supprimer `PROTO_CATALOG`) | lignes 1653-1904 | ⚠️ **numéros périmés** → la plage est maintenant **1668 → 1920** |

### 🔴 A3 patch 5 — bloc de remplacement prêt à appliquer

L'ancre citée par A3 n'existe plus : j'ai passé ce bloc à `marginTop: 21` et ajouté le filet du seuil. **Voici le bloc actuel** (`AnimusScreen`, L1291-1296) :

```tsx
                <div style={{ marginTop: 21, textAlign: 'center' }}>
                  <button onClick={goAnima} style={{ background: 'none', border: 'none', color: DT.gold, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: '8px 13px', display: 'inline-flex', alignItems: 'center', gap: 8, letterSpacing: '0.02em' }}>
                    <span aria-hidden style={{ display: 'inline-block', width: 21, height: 1, background: `linear-gradient(270deg, transparent, ${DT.gold})` }} />
                    {t('core.animus.orb')}
                  </button>
                </div>
```

**Et voici la fusion des deux intentions** — l'entrée A3 conservée, le filet du seuil conservé :

```tsx
                <div style={{ marginTop: 21, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {/* A3 — demander à ses rêves depuis le Cœur (double lecture) */}
                  <button onClick={onGreatConsult} style={{ background: 'none', border: 'none', color: DT.inkSoft, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: '8px 13px' }}>{t('screens.great.entryFromHeart')} →</button>
                  <button onClick={goAnima} style={{ background: 'none', border: 'none', color: DT.gold, fontWeight: 600, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans, padding: '8px 13px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, letterSpacing: '0.02em' }}>
                    <span aria-hidden style={{ display: 'inline-block', width: 21, height: 1, background: `linear-gradient(270deg, transparent, ${DT.gold})` }} />
                    {t('core.animus.orb')}
                  </button>
                </div>
```

Deux détails qui comptent : `justifyContent: 'center'` est **nécessaire** sur le second bouton (en colonne flex, un `inline-flex` ne se centre plus tout seul — sans ça le filet et le libellé partent à gauche), et `gap: 5` au lieu de 4 (Fibonacci).

**Côté loi d'épure, c'est bon** : le Cœur passe à 2 liens secondaires, soit la limite exacte de §14.1 (« ≤2 liens »). Élément n° 9 sur 9. **Il n'y a plus de place — le prochain ajout sur cet écran devra en retirer un.**

---

## 4. ⚠️ Deux incursions hors périmètre — assumées et justifiées

**1. `src/components/TranscriptCheck.tsx`** (non listé dans mon périmètre) — 3× TS2339 : le fichier lisait `T.radius` / `T.radiusPill`, qui n'existent pas (`T` porte la couleur et la typo ; la géométrie vit sur `SCALE`). **Le projet entier ne compilait pas.** J'ai importé `SCALE` et corrigé les 3 références, plus les `fontSize: 16` → `SCALE.body` (17 — plancher dur déclaré dans `dream-design.ts`) et ajouté `minHeight: SCALE.touch`. Si A1 possède ce fichier (il est lié à `transcript-check`), le conflit se règle en gardant l'import `SCALE`.

**2. `tsconfig.json`** (fichier partagé) — un autre agent y avait déjà ajouté les exclusions nommées `CareCard 2.tsx` / `core.en 2.json`. **Je les ai laissées** et ajouté trois motifs génériques :

```json
"**/* ?.ts", "**/* ?.tsx", "**/* ?.json"
```

Raison : j'avais d'abord déplacé les doublons en quarantaine — **iCloud les a re-matérialisés dans `src/` dans les minutes qui ont suivi.** Le rangement ne tient pas ; l'exclusion, si. Le build est désormais immunisé contre les doublons futurs.

⚠️ **Piège vérifié, à ne pas refaire** : ma première tentative était `**/* [0-9].tsx`. **Elle ne marche pas** — les globs `exclude` de TypeScript ne gèrent que `*`, `?` et `**/`, pas les classes de caractères. Je l'ai testée isolément et elle laissait passer l'erreur. Le motif `?` a été vérifié seul, exclusions nommées retirées.

---

## 5. Vérification

```
cd dream-alpha-app && npx tsc --noEmit -p tsconfig.json     →  EXIT=0, 0 erreur
```

⚠️ **Ne tourne pas tel quel sur la machine de Tim** : `node_modules/typescript/` est corrompu par iCloud (plus de `lib/`, donc plus de binaire `tsc` ; il ne reste que `LICENSE 2.txt`, `package 2.json`…). Le typecheck a été fait sur une copie propre (`src/` + `tsconfig.json` + `package.json`, `npm install` neuf, 270 paquets). **Avant tout déploiement : `rm -rf node_modules && npm ci`.**

Le rendu a été **regardé**, pas seulement écrit : l'aperçu a été chargé dans Chrome et screenshoté. Deux défauts n'existaient qu'au pixel et ont été corrigés après coup — le liseré de seuil était **invisible** (13 px × alphas trop faibles : la correction principale ne servait à rien), et la braise du Cœur était un **disque jaune plat** sur le parchemin. Les deux sont réparés et re-vérifiés au rendu.

---

## 6. Mon jugement honnête sur la distance restante

**Réglé** : la composition (foyer sur la ligne φ, aligné sur l'ancre de sa propre lumière — `at 50% 38%` était dans le token depuis le 11/07, la mise en page l'ignorait), la densité (budget §14 tenu par construction), l'affordance du geste, la découvrabilité des deux faces, la hiérarchie du carrefour, la conformité φ de tout ce qui a été touché, et `DAY_FAMILIES` enfin branchée sur l'axe `theme` (+ mots-clés EN ajoutés : c'était la seule famille sans anglais, un rêveur EN ne voyait rien se classer).

**Non réglé, et je ne peux pas le régler seul** : **je n'ai jamais vu la maquette Claude Design.** Elle n'existe nulle part dans le repo — `_designs_from_claude/` ne contient que les packs V1.x d'avril. Je travaille sur `dream-design.ts`, une **transcription à la main**. Je peux certifier qu'aucune règle écrite n'est violée sur les écrans traités ; je ne peux pas certifier « on est au niveau CD ».

**Mon estimation** : Orbe et Cœur à ~85 % de la maquette. Les 15 % restants sont des proportions et des respirations qui ne se devinent pas (taille exacte du foyer, hauteur du mot, air entre les blocs). **Vingt minutes avec les PNG sous les yeux ; impossible sans.** → Demande n°1 à Tim, §6 de l'audit : exporter les 5 frames en PNG dans `_designs_from_claude/nuit-ultra-simple-2026-07-10/`.

**Le plus loin de tout** : Journal · Univers · Réglages · Forge · Mur · Groupes n'ont **jamais eu de maquette**. Bonne palette, bon grain, mais aucun étalon. Une passe d'épure ne peut pas inventer un étalon inexistant — il faut la session Claude Design « page 4 » prévue par §14.6, briefée avec la loi d'épure.

**Et la mise en perspective qui compte** : le plus grand gain de cette passe n'est aucun geste de design. **C'est que le projet compile à nouveau, donc qu'il peut enfin être déployé.** Sans ça, la plus belle épure du monde restait invisible — ce qui est précisément ce qui est arrivé pendant trois jours.

---

## 7. Ce qui attend Tim

1. **Ouvrir `APERCU-DESIGN-CD-2026-07-26.html`** (avant / après, bouton en bas à droite pour les lignes de composition).
2. **Exporter les 5 frames CD en PNG** → `_designs_from_claude/nuit-ultra-simple-2026-07-10/`. C'est la demande qui débloque tout le reste.
3. **Répondre aux 3 questions fermées** (§6 de l'audit) : position du foyer · force du liseré de seuil · micro-ligne du Cœur.
4. **`rm -rf node_modules && npm ci`** avant le prochain build, puis déployer — c'est le déploiement, pas le code, qui manquait.
