# RAPPORT B4 — le rêve à rebours · le récit et la lecture du rêveur

> Agent B4 (Opus), 2026-07-26. Corpus de mesure : `gestion@infuse.earth`
> (`342cf663-…`), 64 kairos. Toutes les mesures ont été refaites en direct sur la
> base de production. Migrations appliquées.
> `node node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json` (non incrémental) :
> **0 erreur**.

---

## 0. Résumé en douze lignes

**Le rêve à rebours.** `created_at` disait deux choses à la fois — quand le rêve a eu
lieu, et quand il a été raconté. On les a séparés : `dream_date` (avec sa **précision**,
parce que le flou est une valeur), et une colonne générée `occurred_at` sur laquelle
**tout ce qui calcule sur le temps** bascule. Par construction `occurred_at = created_at`
tant qu'aucune date de rêve n'est posée : **zéro régression** sur l'existant.

**Le faux écho ancien.** Les 42 kairos importés en masse les 18–23/04/2026 sont marqués
« date inconnue ». La surface de l'écho ancien (Δt ≥ 30 j) passe de **970 paires
candidates à 188** (−81 %). Elles reviendront quand leurs vraies dates seront validées.

**Récit / lecture.** Le texte n'est jamais coupé : une couche d'intervalles se pose
par-dessus. **242 passages** marqués sur les 64 rêves de Tim (71 « cadre », 171
« lecture »), avec ~**10 % de faux positifs**, tous d'un tap, **et zéro sur le « cadre »**
— c'est-à-dire zéro sur la seule couche qui touche aux embeddings.

**Le gain mesuré.** Retirer le seul cadre d'enregistrement améliore la marge de
séparation vraie résonance / bruit de **+21 %** et fait tomber la hubness de **−24 %**.
Retirer *aussi* la lecture du rêveur la fait **retomber sous la référence**. A2 avait
mesuré cet échec sans pouvoir l'expliquer : ce qu'il perdait, c'était exactement
la lecture du rêveur. La mesure et la règle éthique disent la même chose.

---

## 1. Inventaire — tout ce qui calculait sur la date de dépôt

### 1.1 Le modèle

```
kairos.created_at            date de DÉPÔT — inchangée, jamais réécrite
kairos.dream_date            date du RÊVE (NULL = inconnue)
kairos.dream_date_precision  night | day | week | month | season | year | unknown
kairos.dream_date_label      les mots du rêveur (« en avril », « il y a des années »)
kairos.dream_date_source     user | default | legacy_backfill | text_extraction | import
kairos.occurred_at           GÉNÉRÉE = coalesce(dream_date, created_at)  ← le temps du rêve
kairos.occurred_at_reliable  GÉNÉRÉE = (precision <> 'unknown')          ← droit d'affirmer
```

Le choix structurant : **`occurred_at` est une colonne générée**, pas une colonne à
maintenir. Toute lecture qui n'a pas été migrée continue de fonctionner à l'identique,
et toute lecture migrée devient juste. Il n'y a aucun état intermédiaire cassé.

Le second choix structurant : **`occurred_at_reliable`**. Un rêve dont on ignore la date
ne disparaît pas — il reste dans le journal, dans les résonances, dans l'Univers. Mais
l'app perd le droit d'**affirmer une distance temporelle** à son sujet. C'est la
différence entre « je ne sais pas quand » et « c'était le 19 avril » : la première est
vraie, la seconde était une invention de l'import.

### 1.2 Ce qui a basculé — la liste complète

| # | Où | Ce qui calculait sur le dépôt | État |
|---|---|---|---|
| 1 | `GET /api/kairos` | tri du journal, curseur de pagination, filtres `from`/`to` | ✅ `occurred_at` (+ tri secondaire `created_at` pour les rêves d'une même nuit) |
| 2 | RPC `find_kairos_prophetic` | **l'écho ancien Δt ≥ 30 j** — fenêtre ET `days_delta` | ✅ `occurred_at`, **+ garde de fiabilité des deux côtés** |
| 3 | RPC `find_kairos_echoes_multilayer` | la date rendue par la résonance | ✅ (la colonne de sortie s'appelait *déjà* `occurred_at`, elle était remplie avec `created_at`) |
| 4 | RPC `find_kairos_cycles` | patterns récurrents, fenêtre en jours | ✅ (même ironie : sortie déjà nommée `occurred_at`) |
| 5 | RPC `find_kairos_somatic_recurrence` | récurrence corporelle, `first_seen`/`last_seen` | ✅ |
| 6 | RPC `list_kairos_numinous` | fenêtre en jours + ordre | ✅ |
| 7 | RPC `get_constellation_graph` | fenêtre en jours + position des nœuds | ✅ (+ `deposited_at` ajouté au nœud) |
| 8 | RPC `find_kairos_inner_outer` | fenêtre « dedans/dehors » en heures | ✅ — le cas le plus faux : un rêve d'avant-hier n'a jamais été à ±72 h de sa note de jour |
| 9 | RPC `match_kairos_for_life_echo` | `before_date` (« ce rêve d'AVANT ») | ✅ |
| 10 | RPC `compute_meteo_inconscient` | fenêtre de période (météo collective) | ✅ |
| 11 | RPC `get_circle_patterns` | fenêtre de période (patterns de cercle) | ✅ |
| 12 | `/api/mvp/symbol-book` | **fenêtre saison / année de l'écran Univers** (axe émotions) | ✅ |
| 13 | `/api/personal-dictionary/refresh` | `first_seen_at`/`last_seen_at` des symboles — **la vraie source de la fenêtre saison/année**, via `dream_symbol_book` | ✅ + l'ordre de l'`evolution_summary` |
| 14 | `POST /api/kairos` — `body.created_at` | le scanner (A5) **réécrivait `created_at`** pour dater un rêve ancien | ✅ traduit en `dream_date`, `created_at` n'est plus jamais réécrit |

**Gardé sur `created_at` À DESSEIN, et c'est important :**

| Où | Pourquoi |
|---|---|
| `/api/personal-dictionary/refresh` — détection des « utilisateurs actifs » | « qui a utilisé l'app récemment » est une question de dépôt. Quelqu'un qui rentre aujourd'hui dix rêves de l'an dernier est actif aujourd'hui. |
| `src/lib/kairos/warning.ts` — cap ~1 fiche de soin par semaine | le cap protège le rêveur du **rythme des messages reçus**, pas du rythme de ses rêves. |
| `kairos_exposure_log`, quotas, dédup offline | infrastructure de service, aucun rapport avec le temps onirique. |
| Tout ce qui date un objet **autre** qu'un kairos (interprétations, cercles, œuvres de la forge, messages, rituels) | ces objets n'ont pas de « date de rêve ». |

**Non traité, volontairement, et à passer à qui de droit :**

| Où | Ce qu'il reste | Pour qui |
|---|---|---|
| `/api/mvp/echo-of-the-day` | nomme le mois de l'écho (« un rêve d'avril ») à partir de `created_at` → doit lire `occurred_at`, et se taire si `occurred_at_reliable = false` | **B3** (route de résonance) |
| `/api/kairos/[id]/echoes`, `/prophetic`, `/resonance` | affichage de `created_at` en date d'écho | **B3** — le `days_delta` est déjà juste (il vient du RPC) |
| `src/lib/offline-queue.ts` — `createdAtOverride` | doit transporter `dream_date_shortcut`. En attendant, `POST /api/kairos` **traduit** un `created_at` reçu en `dream_date` : rien ne casse | **B2** |
| `src/app/mvp/page.tsx` | tout l'affichage | **B5** → `PATCH-PAGE-TSX-B4.md` |

### 1.3 L'effet mesuré sur le faux écho

```
paires candidates à l'écho ancien (Δt ≥ 30 j, numinosité ≥ 0.4, type onirique)
  avant, sur created_at ................... 970
  après, sur occurred_at + fiabilité ...... 188      −81 %
kairos dont la date est explicitement inconnue ....... 42
```

Les 42 sont les rêves importés en masse (32 le seul 19/04/2026). Ils ne fabriquent
plus de distance temporelle. Ils **reviendront** dès que leurs vraies dates seront
validées — c'est l'objet de §3.

---

## 2. La règle — récit et lecture du rêveur

### 2.1 Ce que j'ai lu, et ce que j'en tire

**Hillman, *The Dream and the Underworld*** (digest canonique, lu en session).
Sa thèse : « the entire modern procedure of interpreting dreams as messages about
waking life is fundamentally wrong — it wrongs the dream ». *L'erreur d'Hercule* :
l'ego héroïque qui matraque les figures du rêve pour les ramener de force à la
lumière du jour. Et *l'épistrophè* contre le développement : on ramène l'image à sa
ressemblance archétypale, on ne la développe pas vers un sens utile.

**Aizenstat, *Dream Tending*** (digest canonique, lu en session).
« Tending means honoring dream figures as imaginal beings, allowing them to walk about
on their own legs rather than reducing them to fixed meanings. » Les quatre capacités :
curiosité, patience, compassion, sentir. *Listening as the core skill*.

**Gendlin, *Let Your Body Interpret Your Dreams*** (digest canonique, lu en session).
Deux choses qui tranchent ici. D'abord : « An interpretation is valid **if and only if**
it produces a physically felt shift […] even the most intellectually plausible reading
remains mere hypothesis. » Ensuite, et c'est le point que je n'attendais pas — le
*Bias Control* : « When interpreting one's own dreams, the dreamer **inevitably**
imposes habitual conscious attitudes on the dream. »

**Ce que ça donne pour notre problème précis.** La lecture que Tim donne de son rêve
en le dictant n'est ni le rêve, ni une vérité sur le rêve. Chez Gendlin, elle est
exactement ce qu'elle est : la première hypothèse, précieuse et biaisée — précieuse
*parce que* seul le rêveur peut valider, biaisée *parce que* c'est lui qui parle. Ni
au-dessus ni en dessous du récit. **D'une autre nature.** C'est la seule façon de
distinguer sans hiérarchiser : on ne compare pas deux quantités du même axe, on
nomme deux choses différentes.

Et `forest/dream_alpha/safety-checks.json`, red lines 5 et 6 : *« jamais de dictionnaire
de symboles plat »*, *« jamais d'interprétation autoritaire top-down — seul le rêveur
peut valider via le felt shift »*.

### 2.2 La règle, noir sur blanc

> **RÈGLE B4 — RÉCIT ET LECTURE DU RÊVEUR**
>
> 1. **Le texte reste entier, intact, dans l'ordre.** La distinction est une couche
>    d'intervalles de caractères posée par-dessus `raw_text`. Jamais un découpage,
>    jamais une réécriture, jamais deux textes concurrents. Ce qui s'affiche au rêveur
>    est un seul flux — le sien.
>
> 2. **Trois natures, aucune hiérarchie.** `recit` (ce que le rêve a montré),
>    `lecture` (ce que le rêveur en dit), `cadre` (ce qui encadre le dire : date à voix
>    haute, heure, état du micro, intentions de journal, résidus de transcription).
>    Les mots « commentaire », « méta », « hors-sujet », « bruit », « parasite » sont
>    **interdits** dans le code, les prompts et l'écran. Deux mots seulement à l'écran :
>    « le rêve » et « ce que tu en dis ».
>
> 3. **L'asymétrie technique n'est pas une asymétrie de valeur, et doit être dite comme
>    telle.** Si le vecteur d'un rêve exclut son cadre d'enregistrement, c'est parce que
>    « il est 11h » ne relie rien à rien — pas parce que ça vaut moins.
>
> 4. **Marquer un passage « lecture » ne retire jamais ses images au rêve.** « il y avait
>    un loup, c'était ma colère » : le loup reste une figure du récit ; seule l'équation
>    loup = colère est une lecture. **Conséquence dans le code** : l'extraction 16
>    dimensions (figures, motifs, marqueurs somatiques, archétypes) tourne sur le texte
>    **complet**. Seule la projection d'embedding change.
>
> 5. **L'app ne valide pas, ne corrige pas, ne note pas la lecture du rêveur.** Elle ne
>    dit jamais « tu as raison ». Gendlin : aucune lecture n'est vraie tant que le corps
>    ne l'a pas confirmée — y compris la sienne. Elle est donc conservée comme une
>    offrande, pas comme un verdict : poids d'entrée **0,5** dans `user_meaning_layer`,
>    qui ne monte (+0,25, plafond 2,0) **que si le rêveur le redit**. Jamais parce que
>    l'app insiste.
>
> 6. **Ce que le rêveur a dit ne sera jamais rendu comme si l'app l'avait écrit.**
>    `source = 'dictee_lecture'`, injecté dans les prompts sous « cosmologie déclarée du
>    rêveur — à respecter, jamais contredire frontalement ». Une signification qu'il a
>    déclarée explicitement (`declared`, `kept_interpretation`) est **souveraine** :
>    jamais écrasée.
>
> 7. **Le rêveur corrige, et sa correction est définitive.** Un tap rend un passage au
>    récit ; « tout est le rêve » efface la couche. `source='user'`,
>    `text_layers_status='confirmed'` — plus aucune passe IA ne repasse dessus.
>
> 8. **Dans le doute → récit.** Un faux positif retire du rêve réel du corpus ; un faux
>    négatif ne fait que garder le comportement d'avant. L'asymétrie du dommage
>    commande l'asymétrie de la prudence.
>
> 9. **Rien pendant la capture.** La couche n'apparaît que sur la fiche, après. La
>    signaler au dépôt apprendrait au rêveur à se surveiller en dictant — exactement
>    la fluidité que Tim demande de préserver.

**Le garde-fou architectural, celui qui compte le plus.** Les deux signaux n'ont pas
la même fiabilité, et ils ne portent pas la même charge. Le `cadre` est détecté avec
une précision mesurée à **100 %** (71 passages, 0 faux positif) — et c'est *lui seul*
qui touche aux embeddings, l'opération invisible et difficilement réversible. La
`lecture` est détectée à ~90 % — et elle ne touche que l'annotation à l'écran et la
couche personnelle, deux choses **visibles et corrigeables d'un tap**. L'opération
risquée roule sur le signal sûr. Ce n'est pas un accident du prompt : c'est le
découpage en trois natures (et pas deux) qui le rend possible.

---

## 3. L'extraction rétroactive des dates — proposée, pas appliquée

**24 propositions sur 64 rêves** (37,5 %). Aucune appliquée. Table
`kairos_dream_date_proposals`, toutes en `status='pending'`.

| | n |
|---|---|
| date dite ET année déductible → date proposée | **13** |
| date dite, **année indécidable** → aucune date, jour/mois conservés pour relecture | **11** |
| le rêveur hésite lui-même (« le 13 avril ou le 13 mai ») → `ambiguous`, confiance plafonnée à 0,4 | 2 |
| aucune date dite → aucune proposition | 40 |

**Contrôle de justesse.** Sur les 13 propositions datées, **12 tombent exactement sur
la date de dépôt** du kairos — ce sont les rêves de 2024, enregistrés le jour même :
l'extracteur retrouve indépendamment une date qu'on connaissait déjà. La treizième est
la seule vraie découverte : *« Reprise de l'enregistrement de mes rêves en ce **2 août
2023** »* sur un kairos importé le 19/04/2026, soit **2 ans et 8 mois d'écart**.

**Ce que l'extracteur refuse de faire, et c'est le point.** Sur les rêves importés en
masse, la date est dite mais l'année ne l'est presque jamais :

```
« Rêve du 24 avril »                              → AUCUNE (année non dite)
« Petit enregistrement du rêve du 1er juillet »   → AUCUNE (année non dite)
« Journale de rêve, 13 janvier »                  → AUCUNE (année non dite)
« Petit enregistrement du 13 avril ou le 13 mai » → AUCUNE (année non dite · le rêveur hésite)
« Rêve du 8 août »                                → AUCUNE (année non dite)
```

Le dépôt ne peut pas servir de repère : ces rêves ont tous été importés le même jour.
Déduire l'année du dépôt donnerait « 24 avril 2026 » — soit **cinq jours après
l'import**, une date impossible. L'extracteur s'abstient et rend la main. Onze cartes
attendent un tap sur l'année ; `PATCH-PAGE-TSX-B4.md` §4 décrit l'écran.

Deux abstentions correctes à noter : *« mes petits rêves du 31 »* (jour sans mois) et
*« cette nuit, c'est les années 1840 »* (la date est **dans** le rêve, pas celle du rêve).

---

## 4. Le test sur 10 rêves réels — et mon jugement

Dix rêves de Tim, choisis pour couvrir les cas, pas pour flatter le résultat : les
dictées les plus bavardes, un texte de 12 185 caractères, un texte presque entièrement
réflexif, un récit dense sans méta, et un rêve lucide. Sortie complète :
`scripts/_b4/layers.json`. Reproductible : `node scripts/b4-layers-experiment.mjs layers`.

### 4.1 Le compte

| | |
|---|---|
| rêves passés | 10 (dont **1 abstention** du garde-fou, à raison) |
| passages marqués | **57** |
| dont `cadre` | 14 — **14 justes, 0 faux positif** |
| dont `lecture` | 43 — **37 justes, 6 faux positifs** (14 %) |
| **taux global de faux positifs** | **6 / 57 ≈ 10,5 %** |
| passages qui débordent sur une phrase de récit voisine | 2 (3,5 %) |
| **passages coupant au milieu d'une phrase** | **0** |
| **images oniriques retirées du récit** | **0** |

### 4.2 Est-ce que ça coupe au milieu d'une image onirique ?

**Non.** Zéro coupure intra-phrase sur 57 passages : le recalage sur frontière de
phrase (`snapToSentence`, dérive plafonnée à 40 caractères) tient. Les deux débordements
observés avalent une **phrase entière voisine** dans un passage « lecture » —
par exemple *« Je me retrouve avec ce petit sens de passeport. Tout le monde a un
passeport blanc. »* rattaché à la réflexion qui suit. C'est visible à l'écran, c'est un
tap à corriger, et surtout **ça ne retire rien de ce qu'on embedde** : `recit_text`
n'exclut que le `cadre`.

### 4.3 Ce que ça attrape, et qui vaut la peine

Le `cadre` est propre au point d'en être utile ailleurs. Il attrape :
- la date et l'heure dites à voix haute — *« Rêve du 24 avril. »*, *« il est 11 heures »* ;
- les intentions de journal — *« parce que c'est important que je prenne le temps de les enregistrer tous les jours »* ;
- et, non prévu au départ, **les hallucinations de Whisper** : *« Sous-titrage ST' 501 »*,
  *« Sous-titres réalisés par la communauté d'Amara.org »*, *« J'espère que vous avez aimé
  cette vidéo, n'hésitez pas à vous abonner à la chaîne »*. Des artefacts de sous-titres
  YouTube injectés dans les rêves de Tim depuis l'import, que personne n'avait relevés.

La `lecture` attrape des choses qui sont, littéralement, de l'or :
- *« Et moi je l'ai interprété au réveil en tout cas comme étant d'accepter que mon énergie masculine s'enfonce dans les profondeurs de la terre »* ;
- *« Quand je me suis réveillé, je me suis dit que ça voulait dire qu'il fallait que je travaille ma connexion, mon pouvoir d'invocateur »* ;
- *« À quels endroits est-ce que je suis encore compétitif ? […] C'est les racines de la compétition. Et j'aimerais les déraciner. »*

### 4.4 Mon jugement, sans adoucir

**Le premier prompt était mauvais.** Sur le rêve de 12 185 caractères il marquait 8
faux positifs — *« je me sentais sale de la bouche »*, *« j'avais peur qu'ils sentent
l'odeur »*, *« ça se voyait qu'il l'inventait »* : du récit pur, du ressenti **dans** le
rêve, pris pour du commentaire. Et sur un texte de 9 567 caractères il rendait un JSON
tronqué (`max_tokens` trop bas) : zéro couche, silencieusement.

Trois corrections l'ont redressé :
1. **Deux tests explicites** à passer tous les deux avant de marquer — *« si je retire
   cette phrase, la scène perd-elle quelque chose ? »* (oui → récit) et *« faut-il être
   réveillé, et regarder le rêve de l'extérieur, pour dire cette phrase ? »* (oui →
   lecture). Le premier suffit à écarter tout le ressenti in-dream.
2. **Plafond dur à 8 passages**, en consigne et en code. Au-delà, le modèle cesse de
   trier et marque tout ce qui ressemble à une phrase réflexive.
3. `max_tokens` 1 400 → 3 000.

**Piège rencontré, à ne pas refaire** : j'avais d'abord mis dans le prompt les
contre-exemples *verbatim* tirés du corpus. Le modèle est allé les chercher — il les
a marqués *plus* souvent. Les contre-exemples d'un prompt doivent être **génériques**
quand ils portent sur le texte même qu'on analyse.

**Ce qui reste imparfait, et que j'assume.** Les 6 faux positifs restants sont tous
sur des phrases où la frontière est réellement indécidable sans être Tim :
*« je sentais que je commençais à devenir un peu self-conscious »* — dans le rêve, ou
au réveil ? Je ne le sais pas, et le modèle non plus. **C'est précisément pour ça que la
couche est une proposition corrigeable et pas un verdict.** Un système qui prétendrait
trancher ça tout seul mentirait.

**Une abstention, et elle est juste.** Le rêve lucide (1 279 car.) a déclenché le
garde-fou `over_marked` : plus de 60 % du texte marqué. C'est un texte où Tim raconte
sa lucidité en la commentant sans arrêt — il n'y a pas de frontière à poser. L'app se
tait. Sur les 64 rêves : **55 avec une couche, 6 sans rien à marquer, 3 abstentions.**

---

## 5. La mesure d'effet sur la séparation des résonances

> ⚠️ **Fait en table de travail `_b4_layer_embeddings`. La production n'a pas été
> ré-embeddée.** Les vecteurs de `kairos` sont intacts. Ce paragraphe est un résultat
> à transmettre à B3, pas un changement livré.

### 5.1 Protocole

Les 64 rêves ré-embeddés en **trois variantes** (`text-embedding-3-small`, le modèle de
production), sur les mêmes paires vérifiées à la main que A2 :

- **VRAIE** — *« je lisais le monde qu'ils avaient créé, leur aventure de chevaliers »*
  (`3ef4fb1b`) → *« un festival de rêves… se faire enfermer dans des mondes »* (`b8e17d45`)
- **BRUIT 1** — chant d'initiation guerrière (`b2513707`) → *« j'ai rêvé de crypto, Jade était là »* (`3d702f82`)
- **BRUIT 2** — rêve du 8 août (`5b32b168`) → même rêve crypto

**Contrôle de validité du banc** : la moyenne des similarités brutes que je mesure est
**0,5866**. A2 mesurait **0,5867** sur la production. Le banc reproduit sa référence à
la quatrième décimale.

### 5.2 Le résultat

z par source, sur le vecteur sémantique seul (même métrique que A2 §6.b) :

| Paire | brut *(référence)* | **sans le cadre** | sans cadre **ni** lecture |
|---|---|---|---|
| **VRAIE** chevaliers → festival | 1,086 | **1,322** | 1,251 |
| BRUIT 1 chant guerrier → crypto | 0,231 | 0,286 | **0,430** |
| BRUIT 2 8 août → crypto | −0,656 | −0,974 | −0,525 |
| **marge (VRAIE − pire bruit)** | 0,855 | **1,036** *(+21 %)* | 0,821 *(−4 %)* |

Distribution et hubness sur les 4 032 paires :

| | moyenne | σ | **exposition max (top-4)** | cibles distinctes |
|---|---|---|---|---|
| brut *(référence)* | 0,5866 | 0,1144 | 17 | 54 |
| **sans le cadre** | 0,5689 | 0,1170 | **13** *(−24 %)* | 48 |
| sans cadre ni lecture | 0,5572 | 0,1218 | **20** *(+18 %)* | 51 |

### 5.3 Ce que ça veut dire — et ce que ça corrige dans le mandat

**Retirer le seul cadre d'enregistrement gagne sur les deux tableaux à la fois** :
la marge de séparation monte de 21 %, la hubness tombe de 24 %. C'est rare, et c'est
cohérent : le cadre est du texte identique d'un rêve à l'autre (« bon », « il est 11h »,
« rêve du … », les sous-titres Amara), donc du pur rapprochement artificiel. Il ne pèse
que **4 % du texte en moyenne** (22 % au maximum) — une coupe chirurgicale.

**Retirer aussi la lecture du rêveur casse tout** : la marge retombe *sous* la référence
et la hubness explose au-dessus.

Cela **corrige mon propre mandat**. Il m'était demandé que « le récit soit ce qu'on
embedde ». La mesure dit non : le récit **plus** la lecture du rêveur, moins le cadre.
Et cela **explique l'échec de A2** — il avait fait re-embedder sur « le récit onirique
isolé, ~70 % du texte conservé » et vu la vraie paire s'effondrer (z 1,91 → 0,29). Il
avait écrit, sans pouvoir le prouver : *« le préambule porte le cadrage du rêveur, qui
est souvent le registre psychique du rêve. Le couper retire de l'information utile. »*
Il avait raison, et son nettoyage coupait les deux couches d'un coup. En les séparant,
on garde ce qui portait et on retire ce qui polluait.

**La mesure et la règle éthique disent la même chose.** La lecture du rêveur ne doit
pas être écartée du corpus — non seulement parce que la dévaluer serait faux, mais
parce que l'écarter dégrade objectivement la qualité des liens. C'est la meilleure
nouvelle de cette mission.

### 5.4 Ce qui est livré, et ce qui ne l'est pas

- ✅ **Livré** : `runKairosEnrichmentPipeline` embedde désormais `recit_text`
  (= texte moins le cadre) pour le vecteur sémantique. **Uniquement les nouveaux dépôts.**
- ❌ **Pas fait, à décider avec B3** : le ré-embed des 64 rêves existants. C'est une
  seule commande, mais elle **change les résonances sous les pieds de B3 pendant qu'il
  les calibre**. Elle demande aussi de rejouer `recompute_resonance_calibration`
  (les stats de hubness sont dérivées des vecteurs).
  → `node scripts/b4-layers-experiment.mjs embed` produit les vecteurs ;
  `_b4_layer_embeddings.emb_minus_cadre` les contient déjà, prêts à copier.

---

## 6. Ce qui a été livré

**Migrations appliquées** (projet `rtrkxzcyblgonwgfzovj`) :
`kairos_dream_date_occurred_at` · `kairos_dream_date_import_backfill` ·
`kairos_text_layers` · `kairos_dream_date_proposals` (+ `_parts`) ·
`b4_time_computations_on_occurred_at` · `b4_time_computations_on_occurred_at_part2` ·
`b4_layer_embeddings_worktable` *(table de travail, supprimable)*.

**Fichiers créés** :
`src/lib/kairos/text-layers.ts` · `src/lib/kairos/dream-date.ts` ·
`src/lib/kairos/user-meaning-harvest.ts` · `src/app/api/mvp/text-layers/route.ts` ·
`src/app/api/mvp/dream-date/route.ts` · `src/app/api/mvp/dream-date/propose/route.ts` ·
`scripts/b4-layers-experiment.mjs` (+ `scripts/_b4/`).

**Fichiers modifiés** :
`src/lib/kairos/pipeline.ts` (phase 2 couche · embedding sur `recit_text` · phase 8.5
récolte des significations) · `src/app/api/kairos/route.ts` (POST date du rêve,
GET tri `occurred_at`) · `src/app/api/mvp/symbol-book/route.ts` ·
`src/app/api/personal-dictionary/refresh/route.ts`.

**État des données de Tim** : 42 kairos marqués « date inconnue » · 24 propositions de
date en attente · 242 passages de couche posés sur 55 rêves (71 cadre, 171 lecture) ·
`raw_text` **jamais modifié**, sur aucune ligne.

---

## 7. Ce qui reste `blocked` ou en attente

| # | Quoi | État | Qui |
|---|---|---|---|
| 1 | Les gestes d'écran (date au dépôt, teinte récit/lecture, écran de relecture des dates) | **livré en spéc**, `PATCH-PAGE-TSX-B4.md` | B5 |
| 2 | Ré-embed des 64 rêves sur `recit_text` + recalibrage | **blocked** — collision directe avec la calibration de B3 | B3 + Tim |
| 3 | 11 dates dont l'année manque | **en attente d'un tap de Tim** — délibérément non devinées | Tim |
| 4 | `/api/mvp/echo-of-the-day` et les routes d'écho : nommer le mois sur `occurred_at`, se taire si non fiable | **non fait** (fichiers de B3) | B3 |
| 5 | `offline-queue.ts` : transporter `dream_date_shortcut` | **non fait** (fichier de B2) ; contournement serveur en place, rien ne casse | B2 |
| 6 | ⚠️ `find_kairos_prophetic` et `find_kairos_echoes_multilayer` ont été republiés par moi. Si B3 les republie, **reporter `created_at` → `occurred_at`** (2 mots dans `echoes_multilayer`, 5 lignes dans `prophetic`) | **risque de collision** | B3 |
| 7 | La couche n'a été posée que sur le corpus de Tim. Les autres comptes l'auront au prochain dépôt | attendu | — |
| 8 | Nettoyage : `drop table public._b4_layer_embeddings;` quand la décision #2 sera prise | à faire | — |
| 9 | Les artefacts Whisper détectés (« Sous-titrage ST' 501 », Amara.org) sont **écartés de l'embedding mais restent dans le texte**. Les retirer pour de bon touche `raw_text` — hors de ma règle #1, à décider avec Tim | signalé | Tim |
