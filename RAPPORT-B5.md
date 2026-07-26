# RAPPORT B5 — « Rêve et Cœur », et le périmètre rendu clair sans un élément de plus

**Statut : `full_green` sur le périmètre design · `tsc --noEmit` → EXIT=0 (vérifié après chaque édition).**
Livrables : **`APERCU-REVE-ET-COEUR-2026-07-26.html`** (à ouvrir en premier) · `BRIEF-MEGA-PASSE-CD.md` · le code.
Fichiers touchés : `src/app/mvp/page.tsx` · `src/lib/i18n/mvp/core.fr.json` · `src/lib/i18n/mvp/core.en.json`.
`md5 page.tsx = ebbf26852bc8064ae9daa1d633485dc4` (à l'heure où j'écris — pour B6).

---

## 1. LA DEMANDE, ET COMMENT ELLE EST RÉSOLUE

> « le nouveau double écran c'est **Rêve et Cœur**, mais Rêve c'est donc aussi Kaïros etc… faut que ce soit clair. Sans pour autant alourdir l'écran. Chai pas comment faire, fais-le. »

Deux contraintes qui se contredisent : **rendre un périmètre évident** et **ne rien ajouter**, sur un écran dont le budget §15.1 est plein à 9 sur 9. Il n'y avait donc qu'une sortie possible : trouver un emplacement existant capable d'en dire plus sans devenir un second élément.

### 1.1 — Le geste : **le mot respire une ligne de plus**

L'emplacement n°3 de §15.1 s'appelle « **1 mot** ». Il portait « rêve », seul. Il porte maintenant le mot **et sa traîne** :

```
              rêve                    ← 40 px, serif italique, crème
    ou un signe, un frisson…          ← 17 px, serif italique, dim, collé à 5 px
        maintiens · ou écris  📷      ← 13 px, sans
```

Ce n'est **pas** un sous-titre — §15.1 bannit nommément « le double sous-titre ». C'est **une phrase**, cassée sur deux lignes typographiques : *rêve — ou un signe, un frisson…* Même famille, même italique, même voix, collée à 5 px, et un seul cran plus bas sur l'échelle φ (40 → 17, soit ≈ φ²). L'œil lit une utterance, pas deux blocs.

**Pourquoi c'est légal**, et je ne veux pas que ça passe pour de la ruse : le test de §15.1 n'est pas « combien de nœuds dans le DOM », c'est **combien de choses se disputent l'attention**. La traîne ne se dispute rien : elle est la fin de la phrase commencée par le mot. Le test de retrait le confirme — on l'enlève, il ne manque pas un élément, il manque **la moitié d'une phrase**.

**Trois bénéfices que je n'avais pas cherchés :**

- **§1.6 est tenu au pixel.** *« la porte d'entrée reste le RÊVE »* — le mot « rêve » n'a pas bougé d'un pixel, il est toujours seul en gros. C'était la contrainte que je risquais de casser en cherchant un mot-valise ; la traîne l'évite entièrement.
- **La face Cœur reçoit exactement le même traitement**, ce qui règle ta **question ouverte n°5** (§15.6) — voir §1.2.
- **Les deux faces ont désormais la même anatomie** : `mot · traîne · geste`. Elles ne se *ressemblent* plus, elles sont **le même organe vu de deux côtés**. C'est ce que dit 1_BIBLE §1.5, et jusqu'ici les mots le disaient tout seuls.

### 1.2 — Ta question n°5, réglée par le même geste

Tu avais trois options sur la micro-ligne du Cœur (« comment tu te sens, là ? — maintiens · ou écris », qui déséquilibrait la face jour). **Ton option (b) est appliquée** : la question remonte dans le mot, la ligne d'usage redevient le geste nu — **la même sur les deux faces**.

| | avant | après |
|---|---|---|
| Rêve | mot « rêve » · *(rien)* · « maintiens · ou écris » | mot « rêve » · **« ou un signe, un frisson… »** · « maintiens · ou écris » |
| Cœur | mot « le cœur » · *(rien)* · « comment tu te sens, là ? — maintiens · ou écris » | mot « le cœur » · **« comment tu te sens, là ? »** · « maintiens · ou écris » |

**Aucun mot de ta copie n'a été réécrit.** Ta phrase du Cœur a changé d'étage, c'est tout. La seule copie que j'ai proposée est la traîne du Rêve, et elle est en une clé (§4, question Q1).

### 1.3 — Le moment qui enseigne vraiment : le post-dépôt

La traîne **annonce** le périmètre en six mots. Ce qui l'**enseigne**, c'est le moment « c'était… », juste après un dépôt — la seule seconde de la journée où lister *rêve · signe · rêverie · hypnagogie · frisson · synchro · jour* sert à quelque chose.

Il était traité comme un champ de formulaire : intertitre mono 10,5 px en capitales espacées (le registre du code, adressé à personne) et puces de 12 px dans **une rangée à défilement horizontal** — dont trois seulement tenaient à l'écran. **Un périmètre à moitié hors du cadre ne s'enseigne pas.** Trois gestes, zéro élément ajouté :

- l'intertitre passe au **serif italique 17** — **exactement le registre de la traîne**. Dans toute l'app, « ce qui appartient à cet endroit » n'a plus qu'une typographie ;
- les puces montent au plancher de lisibilité (13 px, cible 34 px, contre 12 px / 28 px) ;
- **le défilement horizontal saute.** Les sept se voient. C'était le vrai bug.

### 1.4 — Le renommage, partout où il compte

| Où | Avant | Après |
|---|---|---|
| nav, onglet 1 | « Accueil » + lune, **même sur le Cœur** | **« Rêve » + lune** côté nuit · **« Cœur » + soleil** côté jour |
| lien depuis le Cœur | « l'orbe → » | **« rêve → »** |
| maintien mains libres (nuit) | « touche **l'orbe** pour clore » | « touche **la lune** pour clore » |
| maintien mains libres (jour) | « touche **le soleil** pour clore » | « touche **la braise** pour clore » *(le foyer de jour est une braise depuis le 26/07 — le mot avait été oublié)* |
| notification du réveil | « l'orbe t'attend » | « Dream t'attend » |

**La nav ne se dédouble pas, elle se retourne** : même emplacement, l'onglet nomme la face sur laquelle on se tient. Zéro élément ajouté, et la bascule devient lisible depuis n'importe quel écran. C'est le seul endroit de la chrome où les deux faces sont enfin nommées.

**FR et EN traités** — ce sont les deux seules langues du dépôt (`core.fr.json`, `core.en.json` ; les six autres locales de `MEMORY.md` concernent le site, pas l'app). **Il ne reste aucun « orbe » visible par un rêveur** : les deux dernières occurrences (`capture.press_orb`) vivent dans `src/lib/i18n/locales/{fr,en}.json` et ne sont lues que par `src/_legacy_v1.1/`, exclu du build.

**En revanche j'ai délibérément laissé « l'Orbe » dans une dizaine de commentaires de code** (`page.tsx`, `capture-safety.ts`). Raison : l'un d'eux est **l'ancre exacte du PATCH 3 de B2** (`// A1 2026-07-26 — même débit de capture que l'Orbe et le Cœur (cf. VOICE_BITRATE).`). Les renommer aujourd'hui aurait cassé un patch en vol — exactement ce qu'A4 a fait la dernière fois. Ça se fera en une passe, après les fusions.

---

## 2. LE COMPTE D'EMPLACEMENTS — TOUJOURS 9 SUR 9

| n° | §15.1 | Face **Rêve** | Face **Cœur** |
|---|---|---|---|
| 1 | 1 méta discrète | la date | la date |
| 2 | 1 foyer | la lune | la braise |
| 3 | **1 mot** | « rêve » **+ sa traîne** | « le cœur » **+ sa traîne** |
| 4 | 1 micro-ligne d'usage | maintiens · ou écris (+ 📷) | maintiens · ou écris |
| 5 | 1 geste — le foyer EST le bouton | anneau de maintien | anneau de maintien |
| 6-7 | ≤ 2 liens secondaires | « le cœur → » — **1 seul, il reste une place** | « les grands rêves » · « rêve → » |
| 8 | fil ≤ 2 items | 2 derniers dépôts | 2 derniers dits |
| 9 | nav | lune / « Rêve » | soleil / « Cœur » |

**9 / 9 sur les deux faces. Rien n'a été tué, parce que rien n'a été ajouté.**
À noter pour la suite : **la face Rêve garde une place de lien libre, la face Cœur non.** Le prochain ajout côté Cœur devra en retirer un — c'est déjà écrit dans §16.4, et c'est toujours vrai.

---

## 3. TROIS DÉFAUTS QUE SEUL LE RENDU A MONTRÉS

J'ai chargé l'aperçu dans Chrome et je l'ai regardé, à chaque itération. Trois choses étaient invisibles à la lecture du code et évidentes à l'écran. Les trois sont corrigées, les trois sont dans l'aperçu.

### 3.1 🔴 — La nav était peinte en nuit **en dur**, sur la face jour aussi

`QuietNav` portait `background: linear-gradient(…, rgba(22,13,10,0.9))` et du texte crème, sans condition. Sur le Cœur — du parchemin clair — ça posait **une barre sombre au bas d'un écran de papier**. On ne peut pas dire « deux faces d'une même chose, seule la lumière change de camp » et laisser un cinquième de l'écran peint dans la lumière de l'autre. Corrigé : fond parchemin, encre `DT.ink`, transition sur `MOTION.swap`. C'est le changement le plus visible de la passe, et il ne coûte rien.

### 3.2 🔴 — Le liseré de seuil du **jour** était littéralement invisible

`ThresholdEdge` posait, côté jour, `rgba(242,232,213,0.92)` — **de la crème sur du parchemin `#f4ead1`**. Deux clairs quasi identiques : aucun bord ne se détache. C'est *exactement* le défaut trouvé et corrigé le 23/07 côté nuit… et on avait réparé une moitié du seuil en laissant l'autre morte.

La crème venait d'une bonne intention (« la lune est crème »), mais elle repose sur une erreur de raisonnement qui vaut la peine d'être notée : **ce qu'on devine par le bord, ce n'est pas l'astre de l'autre face, c'est son monde.** Côté nuit on devine l'ambre du jour ; côté jour on doit deviner l'obscur de la nuit. Le liseré porte désormais `rgba(36,26,18,0.55)` — le premier stop de `T.bg` lui-même, donc le sol du monde nocturne, qui tranche sur le papier et redit au passage que le fond de nuit et ce liseré sont la même matière.

### 3.3 🔴 — La traîne du Cœur échouait au contraste AA

Mesuré : `DT.dim` (`rgba(43,33,21,0.58)`) sur le parchemin donne **3,79:1** — sous la barre AA de 4,5:1 pour du 17 px. Passée à `DT.inkSoft` : **9,04:1**. Côté nuit, `T.dim` donne 5,27:1 et reste tel quel.

La leçon dépasse ce cas : **je cherchais à créer la hiérarchie par le contraste, ce qui la paie en lisibilité.** Elle se fait par la typo et l'échelle — serif italique 17 pour la traîne, sans 13 pour le geste. Deux registres, même encre.

---

## 4. CE QUE J'AI ÉCARTÉ

Quatre pistes prises au sérieux, quatre refus argumentés. Si tu n'es pas d'accord sur l'une, dis-le : chacune est à une heure de travail.

| La piste | Pourquoi non |
|---|---|
| **Une rangée de puces de type sur l'accueil** | §15.1 la bannit nommément (« le carrousel de suggestions ou de chips »). Et le type se choisit **après** le dépôt — ta décision du 13/07, et elle est juste : à 6 h du matin il reste quarante secondes de mémoire, aucune question ne doit précéder le geste. |
| **Charger la micro-ligne** (« un signe, un frisson · maintiens ou écris ») | **Mesuré** : 44 caractères + le glyphe photo débordent sur un écran de 360 px. Ça passe sur deux lignes — et deux lignes de 13 px sous un mot de 40 px, c'est le « double sous-titre » interdit. Et la ligne d'usage enseigne le **geste**, plus urgent que le périmètre. |
| **Le porter dans l'onboarding** | C'est **§1.6 qui l'interdit** : *« on entre dans une cathédrale par la grande porte qui annonce cathédrale »*, le reste étant « une découverte surprenante permanente ». Déclarer six types de kaïros à l'écran O1 ferait de la porte d'entrée une notice. |
| **Renommer les filtres « Reçus ☾ / Dits ♥ » du Journal** | Vérifié : **ils tiennent mieux que jamais.** « Reçus » ne nomme pas l'écran, il nomme le **contenu** — c'est la vérité littérale de 1_BIBLE §1.5. Les passer à « Rêve / Cœur » réintroduirait le rétrécissement qu'on répare : un filtre « Rêve » suggérerait *rien que des rêves*. |

**Et une piste que j'ai vraiment failli faire** : poser les glyphes des sept types en filigrane autour du foyer, à l'angle d'or, opacité 0,089. C'est joli, c'est dans l'ADN (« géométrie infusée en filigrane »)… et c'est **illisible**. Tu as demandé *clair*. Un signe à 9 % d'opacité est une atmosphère, pas une information.

---

## 5. COLLISIONS AVEC B2 · B3 · B4 — **vérifiées une par une, aucune n'est cassée**

Les trois patchs étaient déposés à l'heure où j'écris. J'ai confronté **chaque ancre** à l'état réel du fichier.

| Patch | Ancre | État |
|---|---|---|
| **B2** 1 (`VOICE_BITRATE`) | bloc `/* ── recorder ──` + `const VOICE_BITRATE = 32000` | ✅ intact, 1 occurrence |
| **B2** 2 (`useRecorder.begin`) | `getUserMedia` + `new MediaRecorder(…)` | ✅ intact |
| **B2** 3 (`InterpretScreen.startRec`) | commentaire `// A1 … (cf. VOICE_BITRATE).` | ✅ intact — **et c'est pour lui que je n'ai pas renommé « l'Orbe » dans les commentaires** |
| **B2** 4 (import `capture-safety`) | ligne d'import | ✅ intact |
| **B2** 5a (`transcribeSafely` Orbe) | `const transcribed = await transcribeSafely(localId, blob)` | ✅ intact, unique (L1070) |
| **B2** 5b (`transcribeSafely` Cœur) | `const tx = …` **suivi de** `rec.reset(); setBusy(false)` | ✅ intact, **unique grâce à la 2ᵉ ligne** (L1293) — ⚠️ sans elle, `const tx = await transcribeSafely(localId, blob)` existe **deux fois** (L1293 et L1907, cette dernière étant `InterpretScreen`, que B2 dit explicitement de ne pas toucher) |
| **B2** 6 (commentaire de route) | bloc de 3 lignes | ✅ intact |
| **B3** 1 (pastille « les grands rêves ») | `onClick={onGreatDreams}` dans `JournalScreen` | ✅ intact, unique — `JournalScreen` non touché |
| **B3** 2 (recherche hebdomadaire) | effet de montage du composant racine | ✅ intact |
| **B4** 1 (date du rêve, carte du Journal) | `new Date(k.created_at).toLocaleDateString(…)` | ✅ intact (L2452) — ⚠️ **voir la note ci-dessous, il y en a une seconde** |
| **B4** 1bis (`relDay` du fil) | `relDay(k.created_at, locale)` | ✅ intactes, **2 occurrences** : L1228 (fil du Rêve) · L1422 (fil du Cœur) — les deux dans des blocs que j'ai édités **autour**, jamais dedans |
| **B4** 2 (pastilles de date au post-dépôt) | phase `review`, sous le texte | ✅ intact — **voir §5.1, il y a une question de design** |
| **B4** 3 (récit / lecture sur la fiche) | `ReadScreen` | ✅ intact — écran non touché |

### ⚠️ Deux avertissements pour B6, qui appliquera

**(a) B4 patch 1 — l'ancre n'est pas unique.**
`new Date(k.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short' })` apparaît **deux fois** :
- **L2452** — la carte du Journal. **C'est celle que B4 vise.**
- **L3009** — la liste de choix de rêve **dans la Forge**, que B4 ne mentionne pas.

Les deux `<span>` diffèrent (`fontSize: 11` vs `10.5`, et L3009 porte `whiteSpace: 'nowrap'`). **Un remplacement global casserait la Forge.** Discriminer sur `fontSize: 11, color: 'rgba(242,232,213,0.4)'`.
*(Et une question ouverte pour B4 : la liste de la Forge devrait probablement dater au rêve elle aussi. Ce n'est pas à moi de trancher.)*

**(b) B4 patch 2 — deux rangées de puces sur le même écran ? Non, et voici pourquoi.**
J'ai retouché les puces `KTYPES` du post-dépôt le même jour où B4 propose d'y ajouter une rangée « cette nuit / la nuit d'avant / … ». **Vérifié : elles ne se rencontrent jamais.** Le post-dépôt a deux phases exclusives — `phase === 'review'` (relire le texte, où B4 pose ses pastilles de date) et `phase === 'ways'` (nommer le type + les quatre sorties). **Une seule est montée à la fois.** Le patch de B4 est donc sûr côté densité.

Mais pour que les deux rangées se ressemblent (elles vivent sur le même écran, à dix secondes d'intervalle), **voici le style exact à donner au `chip()` que B4 laisse en pseudo-code** — c'est celui que je viens de poser sur les puces de type :

```tsx
const chip = (on: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 5,
  minHeight: 34, padding: '8px 13px', borderRadius: 999,
  fontSize: SCALE.meta, fontFamily: T.sans, cursor: 'pointer',
  background: on ? 'rgba(201,168,106,0.16)' : 'transparent',
  border: on ? `1px solid ${T.gold}66` : '1px solid rgba(242,232,213,0.14)',
  color: on ? T.cream : T.dim,
})
```

Et **`gap: 8` sur le conteneur, `flexWrap: 'wrap'`, PAS de `overflowX: 'auto'`** — c'est précisément le défilement horizontal qui rendait la moitié des types invisibles (§1.3). Le pseudo-code de B4 dit `gap: 6, marginTop: 12` : ni l'un ni l'autre n'est Fibonacci, **passer à `gap: 8, marginTop: 13`**.

Enfin, l'intertitre de la rangée de dates devrait prendre le même registre que « c'était… » — **serif italique 17, `T.dim`** — et pas de mono en capitales. C'est la règle posée en §1.3 : dans toute l'app, « ce qui appartient à cet endroit » a une seule typographie.

---

## 6. VÉRIFICATION

```
cd ~/tscheck && rm -f tsconfig.tsbuildinfo \
  && node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json ; echo "EXIT=$?"
   →  EXIT=0, zéro erreur
```

⚠️ **J'ai dû corriger `~/tscheck/tsconfig.json` avant de pouvoir m'y fier** : il ne portait **pas** les exclusions de doublons iCloud du `tsconfig.json` du dépôt, et faisait donc échouer le typecheck sur `CareCard 2.tsx` — un fichier fantôme. Je l'ai aligné sur celui du dépôt, à l'identique.

**Et j'ai vérifié la mise en garde du brief** : aucun fichier source réel n'est masqué par ces exclusions. Les seules entrées qui touchent `src/` sont `src/_legacy_v1.1/**` (code mort de la v1.1, aucun import depuis le code vivant), `src/components/CareCard 2.tsx` et `src/lib/i18n/mvp/core.en 2.json` — deux doublons iCloud dont les originaux (`CareCard.tsx`, `core.en.json`) sont, eux, bien vérifiés. **Le vert n'est pas acheté.**

Croisé en cours de route : `src/lib/kairos/great-dream-detect.ts` était en erreur à 12:03 (`TS2802`, puis une erreur de syntaxe) — B3 l'écrivait pendant que je typecheckais. **Résolu de son côté, EXIT=0 depuis.** Je n'y ai pas touché : le fichier avait une minute d'âge, le corriger aurait provoqué exactement la collision qu'on cherche à éviter.

**Le rendu a été regardé**, pas seulement écrit : aperçu chargé dans Chrome, screenshoté, itéré trois fois. Les trois défauts de §3 viennent de là — aucun n'était visible dans le code.

---

## 7. QUATRE QUESTIONS FERMÉES

**Q1 — La traîne du Rêve.** La structure, je l'ai décidée ; **la copie est ta voix**. (A) est en place, et changer se fait sur **une seule clé** (`core.home.also`). Elles sont toutes les trois côte à côte, en grand, dans l'aperçu §04.
&nbsp;&nbsp;**(a)** « ou un signe, un frisson… » — *la claire. Deux mots qui sont déjà des puces de l'app ; il les retrouvera trois secondes après son dépôt.*
&nbsp;&nbsp;**(b)** « et tout ce que la vie te chante » — *la belle. Tes mots (VISION-CHANT §5). Elle dit l'âme ; elle ne dit pas l'adresse.*
&nbsp;&nbsp;**(c)** « qu'est-ce qui t'a été donné ? » — *la symétrique. Une question, comme le Cœur. Mais « donné » couvre mal le frisson, qui est senti.*

**Q2 — Le mot « l'Orbe » dans le canon.** À l'écran, il a disparu. Dans `1_BIBLE` (§1.5, glossaire §15) et dans nos commentaires de code, la face s'appelle toujours **« l'Orbe »**.
&nbsp;&nbsp;**(a)** on renomme partout, canon compris — la face s'appelle **« Rêve »** &nbsp;·&nbsp; **(b)** « l'Orbe » reste le nom **interne** de la face (comme « ANIMA »), « Rêve » est son nom **d'écran** &nbsp;·&nbsp; **(c)** tu veux relire avant.

**Q3 — La nav qui se retourne.** L'onglet 1 devient lune/« Rêve » côté nuit et soleil/« Cœur » côté jour, au même emplacement.
&nbsp;&nbsp;**(a)** juste &nbsp;·&nbsp; **(b)** trop mouvant — garde un libellé fixe (« Rêve », même sur le Cœur) &nbsp;·&nbsp; **(c)** garde « Accueil », neutre pour les deux.

**Q4 — Le liseré de seuil.** Ta question ouverte n°4 de §15.6 est toujours ouverte, et l'aperçu te donne enfin de quoi trancher : **côté nuit** il est calibré depuis le 23/07 (à mon œil, au sommet de l'acceptable — il se voit franchement) ; **côté jour** il n'existait pas du tout et il existe maintenant, discret.
&nbsp;&nbsp;**(a)** les deux sont justes &nbsp;·&nbsp; **(b)** baisse celui de nuit au niveau de celui du jour &nbsp;·&nbsp; **(c)** monte celui du jour au niveau de celui de nuit.

---

## 8. MON JUGEMENT HONNÊTE

**Ce qui est réglé.** Le périmètre est dit sur l'écran quotidien sans un élément de plus, et enseigné à l'endroit où ça sert. Les deux faces ont la même anatomie, la même nav, deux seuils vivants. Le renommage est complet côté rêveur, FR et EN. Ta question n°5 est fermée. Trois défauts réels ont été trouvés en regardant, pas en lisant.

**Ce que je ne peux toujours pas certifier**, et c'est le même mur qu'A4 : **les cinq frames validées le 10/07 n'existent nulle part dans le dépôt.** Je travaille sur `dream-design.ts`, une transcription à la main. Je peux affirmer qu'aucune règle écrite n'est violée sur les deux faces. Je ne peux pas affirmer « on est au niveau de la maquette ».

**La question que je te retourne, et je préfère la poser que la cacher.** La traîne fait de l'accueil un écran qui **explique** un peu. C'est un pas vers la clarté et un pas hors du silence — et le silence est une valeur de cette app. **Regarde-la sur ton téléphone.** Si elle bavarde, on la coupe en une clé, et le périmètre vit alors uniquement dans les puces d'après-dépôt, qui sont désormais lisibles. Ce serait défendable aussi, et plus austère.

**Ce qui reste le plus loin, de très loin** : les treize écrans qui n'ont **jamais** eu de maquette. C'est l'objet de `BRIEF-MEGA-PASSE-CD.md`, écrit pendant que j'avais le code en tête. Le pire n'est pas celui qu'on croit — ce n'est ni la Forge ni les Groupes, c'est **la fiche du rêve** : une vingtaine de sections empilées sur l'écran où l'on vient relire un rêve, c'est-à-dire une console posée sur un récit. C'est le premier écran de la passe, et de loin.

---

## 9. CE QUI ATTEND TIM

1. **Ouvrir `APERCU-REVE-ET-COEUR-2026-07-26.html`.** Six sections, avant/après, aux vrais tokens. Les trois formulations de la traîne sont en §04, côte à côte, en grand.
2. **Répondre aux quatre questions de §7** (a / b / c).
3. **Exporter les cinq frames CD en PNG** dans `_designs_from_claude/nuit-ultra-simple-2026-07-10/`. C'est toujours la demande n°1, et elle n'a pas bougé depuis hier.
4. **Relire `BRIEF-MEGA-PASSE-CD.md`** avant de le coller dans Claude Design — j'y ai mis des affirmations sur le sens (l'anonymat du Mur, la Forge qui reste latérale, l'onboarding qui n'a pas le droit d'expliquer). Elles viennent toutes du canon, mais **c'est ta voix qui les porte**, et c'est toi qui parles à CD.
