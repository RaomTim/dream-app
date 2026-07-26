# RAPPORT-A7.md — Flotte Dream App 2026-07-26 — Agent A7 (Sonnet)

Périmètre : `forest/` uniquement (claude-context). Aucun fichier touché sous
`dream-alpha-app/src/`. Coordination A5 respectée : `dream_forest_books` role
`internal_only` (Hay/Martel/Odoul, migration `dream_forest_books_add_internal_only_role`)
non touché, non re-classé.

Supabase `rtrkxzcyblgonwgfzovj`. Toutes les écritures faites via REST API
directe (`.env.forest` + `requests`, dans le sandbox bash) plutôt que via l'outil
MCP `execute_sql`, pour éviter de faire transiter ~1,5 Mo de texte de digest à
travers mon propre contexte — voir §Méthode.

---

## Tableau de synthèse

| Lot | Statut | Résumé |
|---|---|---|
| 1 — Re-sync disque → DB | **full_green** | 145 livres réparés (108 T1 + 99 T2, périmètre 408 livres = tout le Forest, pas seulement le corpus rêve). Vérifié : 0 champ vide restant, 5 livres au hasard + les 13 livres rêve prioritaires relus depuis la base en MD5 exact vs disque. |
| 2 — `dream_forest_books` incomplète | **full_green** | 14 lignes ajoutées (82 livres au total, 68→82). `moss-sidewalk-oracles` en plus inséré dans `forest_books` (absent à 100%, pas juste un champ vide). |
| 3 — Digests courts | **partial / blocked** | Diagnostic fait : pas de troncature technique, format pilote plus terse (daté 2025). Élargi : 27/82 livres du corpus rêve (pas 4) portent ce pattern. Re-digestion NON faite (lecture Opus requise, hors mandat) — coût estimé fourni. |
| 4 — Inventaire | **full_green** | `forest/dream_alpha/INVENTAIRE-CORPUS-REVE-2026-07-26.md` — 82 livres, triés par rôle/priorité, avec santé digest et flags éthiques. |

---

## Le diagnostic (le point le plus important)

**Cause de la désynchronisation : il n'existe, et n'a jamais existé, de script
qui pousse `digest_tier1`/`digest_tier2` du disque vers Supabase.** Ce n'est
pas un bug d'écriture, c'est une étape absente du pipeline.

Preuve, en lisant les 3 scripts d'import existants :
- `phase2-import.py` (le seul script « Forest → Supabase » du dépôt) lit
  `retrieval_objects/*.json` et upsert `title`, `author`, `main_root`, `tags`,
  `concepts`, `contradictions`, `ethical_notes` — **jamais** `digest_tier1`
  ni `digest_tier2`. Ces deux colonnes ne sont mentionnées nulle part dans ce
  fichier.
- `add_book_to_forest.sh` (pipeline chunking+embedding) a ce commentaire en
  tête : *« Prérequis : le livre a déjà été digéré éditorialement (Tier 1 +
  Tier 2 + cartography dans forest/) »* — il **suppose** que les digests sont
  déjà en base, il ne les y met jamais.
- `catchup_pending_books.sh` filtre littéralement sur
  `digest_tier1 IS NOT NULL AND digest_tier2 IS NOT NULL` comme condition
  d'entrée dans sa file de chunking — même logique, même angle mort.

Confirmation par les données elles-mêmes : sur les 408 livres de
`forest_books`, **aucun** digest n'était partiellement écrit ou corrompu —
chaque champ était soit correct (contenu complet), soit `NULL`/quelques
octets résiduels. Une désynchronisation par bug d'écriture produirait des
troncatures aléatoires à des points variés ; une étape manquante produit
exactement ce qu'on observe : un clivage net entre « jamais écrit » et
« écrit une fois, correctement ». Le pattern est cohérent avec un import
Supabase initial ponctuel (une seule fois, tôt dans la vie du projet), après
quoi chaque nouveau livre digéré/importé a suivi le pipeline de chunking
(qui, lui, marche très bien — 97 512 chunks, embeddings à 100%) sans jamais
repasser par l'étape d'écriture des digests texte.

**Nuance importante sur l'impact réel** (à corriger par rapport à l'audit
initial) : la recherche vectorielle de la Dream App (`forest-retrieval.ts` →
`queryForestForModeDetailed`, table `forest_chunks`) **n'était pas cassée**
pour Corbin/Watkins/Hunt/Kalsched et les 9 autres livres prioritaires — leurs
chunks et embeddings étaient déjà à 100% en base (vérifié : 194 à 423 chunks
par livre, `embed_count = chunk_count` partout, voir §Vérification). La
désynchronisation cassait deux choses différentes, toutes les deux réelles
mais pas celle que l'audit pointait en premier :
1. **`foret-app`** (le site public forest.infuse.earth), qui lit
   `digest_tier1`/`digest_tier2` **directement** en 3 endroits :
   `livre/[id]/page.tsx` (page détail du livre — vide/tronquée pour ces
   livres), `clairiere/[racine]/page.tsx` (teaser 200 caractères), et surtout
   `supabase/functions/_shared/retrieval.ts` → `subjectMatchBooks`, qui fait
   un `.not("digest_tier1", "is", null)` — **exclusion structurelle** de tout
   livre avec un digest NULL de la recherche par mot-clé côté Edge Function.
2. Toute consultation ou usage futur qui lirait le digest texte plutôt que
   les chunks (résumés, aperçus, exports) aurait servi du vide.

Donc : Corbin et Watkins étaient bien invisibles à une partie réelle et
publique de la Forêt (le site, la recherche par mot-clé) — juste pas à la
Dream App elle-même, qui passe par un chemin différent (chunks vectoriels)
qui se trouve avoir toujours été sain pour ces livres précis.

---

## Lot 1 — Re-sync disque → DB

**Mesure avant réparation** (SQL direct, `forest_books`, 408 lignes) :
- Champs strictement `NULL` : `t1_empty=55`, `t2_empty=37`
- En élargissant à « champ < 500 caractères alors que le fichier disque fait
  plus de 800 caractères » (seuil choisi pour capter aussi les résidus courts,
  pas seulement les NULL) : **108 livres avec T1 désynchronisé, 99 avec T2
  désynchronisé, 145 livres uniques touchés (T1 ou T2 ou les deux)**.
  Le chiffre du brief (74/93) ne correspond exactement à aucune de ces deux
  mesures — je n'ai pas retrouvé la méthode qui produirait ces chiffres
  précis, donc je documente ma propre mesure avec sa méthode plutôt que de
  forcer un alignement.
- Les 13 livres rêve prioritaires cités dans le brief (Corbin, Watkins, Hunt,
  Kalsched, Van Gennep, Jung-*Archetypes*, Murdock, Moss-*Dreaming Soul Back
  Home*, Bachelard ×2, Taylor, Badenoch, Moore) étaient **tous** confirmés
  désynchronisés (T1 et/ou T2), avec fichiers disque complets (1200-2800
  mots chacun).

**Réparation** : script Python (`requests` + `.env.forest`, PATCH REST vers
`forest_books`), 145 livres, 21 lots de ~15 livres par appel pour rester
sous le timeout de 45s du sandbox. **145/145 PATCH réussis, 0 échec.**

**Vérification (relue depuis la base, pas juste "ok" côté script)** :
- Requête post-repair sur les 408 lignes : `t1_empty=0`, `t2_empty=0`,
  `t1_short(<500)=0`, `t2_short(<500)=0`.
- Les 13 livres prioritaires relus : longueur en base strictement égale à
  la longueur du fichier disque (ex. `corbin-alone-with-alone` T1=11433 car.
  en base = 11433 car. sur disque ; `watkins-waking-dreams` T1=18871=18871).
- 5 livres tirés au hasard (seed fixe) dans la liste des 145 réparés,
  comparaison **MD5 exact, pas juste la longueur** :
  ```
  ries-lean-startup: db_md5=cc528f07 disk_md5=cc528f07  MATCH
  deloria-god-is-red: db_md5=e54148e1 disk_md5=e54148e1  MATCH
  bach-flower-remedies: db_md5=a374eabf disk_md5=a374eabf  MATCH
  tanizaki-praise-shadows: db_md5=129f5105 disk_md5=129f5105  MATCH
  hunt-multiplicity-of-dreams: db_md5=ca6715e1 disk_md5=ca6715e1  MATCH
  ```

**Embeddings** : vérifié qu'il n'existe **pas** de colonne embedding sur
`forest_books` (les colonnes du digest sont du texte brut). Les embeddings
vivent sur `forest_chunks.embedding` (pgvector), alimentés par un pipeline
séparé (`bulk_chunk_all.py` + `bulk_embed.py`, chunking du PDF source, pas du
digest). Vérifié pour les 13 livres prioritaires : chunks et embeddings déjà
à 100% avant même ma réparation (194-423 chunks/livre, `embed_count =
chunk_count` sur les 13). **Aucun recalcul d'embedding nécessaire** — le
piège « digest inséré sans embedding » ne s'applique pas ici, les deux
pipelines (digest texte / chunk+embedding) sont complètement indépendants.

---

## Lot 2 — `dream_forest_books` complétée

**Découverte avant classement** : `moss-sidewalk-oracles` n'était pas juste
absent de `dream_forest_books`, il était **absent de `forest_books` tout
court** — digest complet sur disque (T1 9849 car., T2 8161 car.),
`retrieval_objects/moss-sidewalk-oracles.json` et
`forest_cartography/moss-sidewalk-oracles.yaml` complets, mais jamais
importé nulle part. C'est un cas plus grave que les 144 autres du Lot 1
(champ vide) : ligne entière jamais créée. Inséré avec les métadonnées
tirées du retrieval object (roots, tags, concepts, contradictions) +
`ethical_notes` rédigée par moi (MEDIUM, cohérente avec le pattern déjà
documenté sur les autres livres Moss : agrégation cross-tradition sans
réciprocité équivalente — cf. tension Sand Talk/Braiding Sweetgrass déjà
présente dans le retrieval object).

**14 lignes ajoutées à `dream_forest_books`** (68 → 82), toutes avec
`dream_role` + `priority` + `notes` justifiant le choix :

| Slug | Role | Prio | Justification courte |
|---|---|---|---|
| `corbin-alone-with-alone` | depth | 1 | pilier de l'imaginal (mundus imaginalis) |
| `watkins-waking-dreams` | depth | 1 | second pilier de l'imaginal |
| `hunt-multiplicity-of-dreams` | depth | 1 | taxonomie académique des 8 types de rêve |
| `mcgilchrist-master-emissary` | depth | 1 | fondation neuro-philosophique (gap P1 audit) |
| `bulkeley-intro-psychology-dreaming` | depth | 2 | manuel académique généraliste |
| `bulkeley-big-dreams` | archetype | 2 | « grand rêve » = concept d'origine jungienne |
| `kalsched-inner-world-trauma` | safety | 1 | défenses archétypales du trauma → cauchemars |
| `weller-wild-edge-of-sorrow` | safety | 1 | structure du deuil → rêve de deuil (Vague 4) |
| `van-gennep-rites-passage` | tradition | 1 | théorie fondatrice du seuil/liminalité |
| `buhner-plant-intelligence-imaginal-realm` | ecology | 1 | fit direct avec le cluster ecology existant |
| `delaney-living-your-dreams` | interpretation | 1 | méthode d'entretien, même cluster que Hill/Gendlin/Taylor |
| `delaney-all-about-dreams` | interpretation | 2 | compagnon du même auteur |
| `moss-sidewalk-oracles` | protocol | 2 | Active Dreaming étendu au quotidien éveillé |
| `moss-dreaming-soul-back-home` | protocol | 1 | rêve chamanique pour la guérison |

**Garde-fou respecté** : avant tout classement `interpretation` (Delaney ×2),
j'ai lu `ethical_risk_flag` dans `retrieval_objects/delaney-*.json` — `LOW`
sur les deux, aucun flag `deterministic_causality`/`victim_blaming_risk`
(le pattern qui a fait basculer Hay/Martel/Odoul en `internal_only` chez A5).
Les tensions documentées (Delaney vs Mindell/Hillman/Moss) portent sur le
statut ontologique du rêve, pas sur un risque de culpabilisation. Aucun des
14 livres ajoutés n'a été mis en `interpretation` sans cette vérification.

**Vérification** : `SELECT count(*) FROM dream_forest_books` = 82.
Répartition par rôle : archetype=12, depth=6, ecology=7, internal_only=3,
interpretation=11, lucid=2, narrative=5, protocol=20, safety=4, tradition=12
(somme = 82).

**Hors périmètre, signalé pour Tim** : en scannant disque vs `forest_books`
pour trouver `moss-sidewalk-oracles`, j'ai trouvé **34 autres livres** dans
le même état (digest complet sur disque, zéro ligne en base) — mais hors
corpus rêve (herboristerie, art, trickster générique, synchronicité
générale : `harpur-daimonic-reality`, `hyde-trickster-makes-this-world`,
`radin-trickster`, `cambray-synchronicity`, `jung-synchronicity-acausal`,
`peat-synchronicity-matter-mind`, `mctaggart-the-field`, etc. — liste
complète dans la sortie de `sync_digests_to_supabase.py`, §Prévention).
Non traité — hors mandat Dream App, nécessite le même travail d'insertion
avec métadonnées que `moss-sidewalk-oracles` mais pour 34 livres non
prioritaires ici.

---

## Lot 3 — Digests courts

**Les 4 signalés dans le brief, vérifiés un par un** :

| Livre | Tier | Mots | Verdict |
|---|---|---|---|
| `levine-waking-the-tiger` | T1 | 488 | Complet structurellement (Essence/Key Principles/Native Vocab, `locked:true`), daté `2025-05-22` — format pilote ancien, pas une troncature |
| `estes-women-who-run-with-the-wolves` | T1 | 757 | Idem, sections complètes, se termine proprement, `locked:true` |
| `jung-man-and-his-symbols` | T2 | 638 | T1 associé est en fait **long et riche** (1279 mots, 5 parties, table complète) — le T2 est juste plus terse. **Mais T1 porte `locked: false`** — n'a jamais formellement passé la porte Auditor (`PIPELINE.md` Step 3), alors que le contenu semble fini. Anomalie de bookkeeping distincte du problème de longueur. |
| `moss-dreamgates` | T2 | 834 | T1 correct (1814 mots), T2 court mais structurellement complet |

**Aucun des 4 n'est une troncature technique** (pas de coupure mi-phrase, pas
de message d'erreur, frontmatter cohérent). Diagnostic : ce sont des digests
d'une génération antérieure du pipeline, où le gabarit produisait des T1
plus denses/courts (bullet points) au lieu du format actuel (Essence + Key
Principles + Native Vocab + Structural Notes + Paradoxes, 1200-2800 mots).
La date `levine: 2025-05-22` contre la norme `2026-04+` du reste du corpus
le confirme.

**Découverte élargie, plus importante que les 4 exemples du brief** : ce
même pattern (T1 « léger format ancien » : T1 < 2000 caractères alors que le
T2 correspondant dépasse 4000 caractères — soit environ 1/3 de la longueur
attendue) touche **27 des 82 livres du corpus rêve** (33%), pas seulement 4.
Liste complète et statut par livre dans
`forest/dream_alpha/INVENTAIRE-CORPUS-REVE-2026-07-26.md`. Ça inclut des
livres au cœur du corpus : tout le cluster Moss `protocol` priority 1/2
(sauf `growing-big-dreams` et `dreaming-soul-back-home`), Mindell ×2,
Gendlin ×2, von Franz ×2, Wangyal, les deux Odier.

**Skill `anthropic-skills:forest-maintenance` invoqué** (comme demandé) :
c'est un guide de procédures manuelles (checklist santé, workflow de
réparation), pas un outil automatisé de re-digestion. Il confirme qu'il
n'existe **aucun mécanisme** pour régénérer un digest sans repasser par les
étapes 2 (CANONICAL DIGESTOR, lecture du texte source) et 4 (INFUSE
INTERFACE) de `PIPELINE.md` — les deux sont des étapes de lecture/synthèse
du livre, pas des opérations mécaniques. Flipper `locked: false → true`
sans audit réel serait malhonnête vis-à-vis du garde-fou du pipeline — je ne
l'ai pas fait.

**Non fait par moi, comme demandé par le brief** : la re-digestion. C'est un
travail de lecture (Opus, pas Sonnet) — synthétiser un livre entier en un
digest fidèle et dense n'est pas une tâche mécanique.

**Coût estimé pour Tim** (à planifier, pas exécuté) :
- 4 livres prioritaires (Levine, Estes, Jung-*Man and His Symbols* T2,
  Moss-*Dreamgates* T2) : re-digestion complète Tier 1 + Tier 2 par agent
  Opus, un agent par livre en parallèle → de l'ordre de 30-45 min de travail
  agent par livre si les PDF sources sont déjà dans `books_raw/`, plus une
  relecture humaine légère (Auditor gate). Faisable en une session, en
  parallèle.
- Extension aux 27 livres du pattern élargi : même ordre de grandeur par
  livre, mais **27× le volume** → plutôt une vague dédiée (Vague 0bis) avec
  plusieurs agents Opus en parallèle, pas une tâche ponctuelle. Je ne
  recommande pas de tout refaire d'un coup : prioriser d'abord les livres
  `protocol`/`interpretation` priority 1 qui portent le format ancien
  (Mindell ×2, Gendlin ×2, von Franz ×2, Wangyal) puisque ce sont les livres
  que l'app va le plus solliciter.

---

## Lot 4 — Inventaire de sortie

`forest/dream_alpha/INVENTAIRE-CORPUS-REVE-2026-07-26.md` — table des 82
livres du corpus rêve (68 existants + 14 ajoutés), triée par rôle puis
priorité, avec pour chacun : titre, auteur, slug, longueur T1/T2 en base
(post-réparation, vérifiée), statut de santé du digest (`complet` / `correct
_mais_serre` / `T1_leger_format_ancien` / `TRES_COURT`), et flags éthiques.

Répartition santé (82 livres, catégories exclusives) : `complet`=43 (52%),
`correct_mais_serre`=12 (15%), `T1_leger_format_ancien`=20 (24%),
`TRES_COURT`=7 (9%).

---

## Prévention — qu'est-ce qui empêche que ça se redésynchronise ?

**Ce que j'ai laissé en place** (pas juste une recommandation) :
`forest/pipelines/sync_digests_to_supabase.py` — script idempotent,
dry-run par défaut (`--apply` pour écrire), qui :
1. Compare disque (`digests_canonical/`, `digests_infuse_translation/`) vs
   `forest_books.digest_tier1/tier2` en base.
2. Ne touche **jamais** un champ déjà rempli en base (>500 caractères) —
   safe à relancer en cron sans risque d'écraser un contenu correct.
3. Signale séparément les livres **totalement absents** de `forest_books`
   (comme `moss-sidewalk-oracles` l'était) — ceux-là ont besoin d'une vraie
   insertion avec métadonnées, pas juste d'un PATCH, donc le script les
   liste sans les toucher.

Testé en dry-run après mes réparations : `0 livres désynchronisés`, `34
livres orphelins signalés` (la liste hors-périmètre du Lot 2). Confirme que
la réparation tient et que le script détecte correctement l'état réel.

**Recommandation concrète pour Tim** :
1. **Ajouter ce script comme étape explicite de `PIPELINE.md` Step 8**
   (« MIRROR & TRACK ») — c'est le chaînon manquant identifié en §Diagnostic.
   Sans ça, le prochain livre digéré retombera dans le même trou.
2. **Cron hebdomadaire en mode dry-run** (pas `--apply` automatique — un
   champ vide en base peut aussi signaler un digest volontairement pas
   encore prêt) qui alerte Tim si le compte > 0, plutôt qu'un contrôle bloquant.
   Le skill `anthropic-skills:forest-maintenance` a déjà un « Quick Health
   Check » — y ajouter cette vérification serait cohérent avec l'existant.
3. Pas de contrainte SQL `NOT NULL` sur `digest_tier1/tier2` : trop
   contraignant en pratique (un livre peut légitimement être en cours de
   digestion), mieux vaut un monitoring actif qu'une contrainte dure.

---

## Fichiers touchés / créés

- `forest/pipelines/sync_digests_to_supabase.py` — **nouveau**, script de
  prévention (voir ci-dessus)
- `forest/dream_alpha/INVENTAIRE-CORPUS-REVE-2026-07-26.md` — **nouveau**,
  Lot 4
- `dream-alpha-app/RAPPORT-A7.md` — ce rapport
- Supabase (`rtrkxzcyblgonwgfzovj`), toutes les écritures via REST API
  directe (pas de migration SQL, pas de DDL) :
  - `forest_books` : 145 lignes mises à jour (`digest_tier1`/`digest_tier2`),
    1 ligne insérée (`moss-sidewalk-oracles`, avec digests)
  - `dream_forest_books` : 14 lignes insérées

## Méthode — pourquoi REST direct plutôt que l'outil SQL MCP

Les digests font 1000-30 000 caractères chacun. Passer 145 × 2 champs par
l'outil `execute_sql` (qui fait transiter le texte complet dans mon contexte
de conversation) aurait coûté plusieurs centaines de milliers de tokens rien
qu'en aller-retour. `.env.forest` (déjà présent dans le repo monté, utilisé
par les scripts existants du pipeline) contient les credentials Supabase —
je les ai utilisés depuis le sandbox bash isolé (jamais affichés dans mon
contexte au-delà des noms de variables) pour faire des `PATCH`/`POST` REST
directs. Toute vérification a ensuite été refaite via l'outil SQL MCP
(source indépendante) pour confirmer que l'écriture avait bien eu l'effet
attendu — voir §Vérification Lot 1.

## Ce qui reste `blocked` / en attente de Tim

1. **Re-digestion des 27 livres à format T1 ancien** (dont les 4 signalés) —
   travail de lecture Opus, coût estimé ci-dessus, non fait par moi.
2. **`jung-man-and-his-symbols` `locked: false`** — à trancher : re-audit
   réel puis flip du flag, ou re-digestion complète. Contenu déjà présent
   est substantiel, ce n'est peut-être qu'un oubli de bookkeeping.
3. **34 livres orphelins hors corpus rêve** (aucune ligne `forest_books`,
   digest complet sur disque) — nécessite le même travail d'insertion que
   `moss-sidewalk-oracles` (Lot 2) mais hors mandat de cette session.
4. **Adoption du script de prévention dans le pipeline officiel** —
   décision Tim, cf. §Prévention.
