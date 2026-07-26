# RAPPORT A2 — le moteur de résonance

> Agent A2 (Opus), 2026-07-26. Corpus de mesure : `gestion@infuse.earth`
> (`342cf663-…`), 64 kairos, 4032 paires ordonnées. Toutes les mesures ci-dessous
> ont été refaites en direct sur la base de production, avant et après correctif.
> Migrations appliquées. `npx tsc --noEmit -p tsconfig.json` : **0 erreur**.

---

## 0. Résumé en dix lignes

Le seuil était du code mort : confirmé. Mais le vrai résultat de cette mission est
ailleurs, et il est plus dérangeant que le diagnostic de départ.

**Aucun seuil absolu ne peut fonctionner sur ce corpus.** La seule paire vérifiée
« vraie résonance » score **0.6228**. Une paire vérifiée « bruit » score **0.6230**.
Identiques à la troisième décimale. Poser un seuil à 0.55, 0.685 ou 0.75 revient à
tirer à pile ou face sur les deux.

Ce qui sépare, mesuré : le **z-score par source** sur un score corrigé de la
hubness — **2.776** pour la vraie, **0.185** pour le bruit. C'est ce que j'ai câblé.

Résultat : **256 liens → 75**. **14 rêves sur 64 n'ont plus aucune résonance.**
L'exposition maximale d'un seul rêve tombe de **25 à 4**. Les 5 doublons d'import
disparaissent. **L'écho ancien tombe à zéro** — et il le mérite.

Deux pistes recommandées par l'audit ont été testées et **échouent** : monter le
poids `concept` aggrave la hubness, et nettoyer les préambules détruit la
discrimination. Elles sont documentées §6 pour qu'on ne les retente pas.

Et j'ai trouvé un bug que l'audit n'avait pas vu : **`match_kairos_for_wisdom`
levait une exception à chaque appel depuis toujours** (§7).

---

## 1. La distribution des scores, AVANT / APRÈS

### Toutes les paires (4032), poids inchangés 0.30/0.30/0.20/0.20

| | moyenne | σ | p50 | p90 | p95 | p99 | max |
|---|---|---|---|---|---|---|---|
| **Score brut** (= avant) | 0.5767 | 0.0825 | 0.5913 | 0.6660 | 0.6813 | 0.7112 | 0.9603 |
| **Score ajusté** (hubness corrigée) | 0.5759 | 0.0616 | 0.5875 | 0.6390 | 0.6504 | 0.6722 | — |

La correction de hubness **resserre** la distribution (σ 0.0825 → 0.0616). C'est
attendu : on retire à chaque candidat sa similarité moyenne au corpus, donc on
retire précisément la composante « ce texte est proche de tout ».

### Ce qui est réellement servi

| | AVANT | APRÈS | |
|---|---|---|---|
| Liens « rêves reliés » affichés (total corpus) | **256** | **75** | −71 % |
| Rêves avec 0 résonance | **0** | **14** | ← le correctif |
| Candidats distincts servis | 49 | 40 | |
| **Exposition max d'un même kairos** | **25** | **4** | −84 % |
| Concentration (max ÷ moyenne) | 4.8× | 2.1× | |
| Score moyen des liens servis | 0.6700 (brut) | 0.6660 (ajusté) | |
| Score min des liens servis | **0.4262** | **0.6080** | |
| z minimal des liens servis | *non calculé* | **2.003** | |
| **Doublons d'import servis** | **5 paires, en position 1** | **0** | |
| Échos anciens affichés | **183** | **0** | §4 |

Le chiffre qui compte le plus est le score minimum : **0.4262 → 0.6080**. Avant, on
pouvait afficher comme « résonance » une paire à 0.43, très en dessous de la
moyenne du corpus (0.577). Ça ne peut plus arriver.

---

## 2. Le nombre de résonances par rêve — la distribution, pas la moyenne

| Résonances affichées | AVANT | APRÈS |
|---|---|---|
| **0** | **0 rêve** | **14 rêves** |
| 1 | 0 | **30** |
| 2 | 0 | 16 |
| 3 | 0 | 3 |
| 4 | **64 rêves** | 1 |

Avant : une barre unique à 4. Ce n'était pas une mesure, c'était une constante.

Après : **médiane 1**, et 22 % des rêves ne renvoient rien. C'est la bonne
nouvelle demandée — `1_BIBLE:365` (« pas de génération si vide : si aucun ne
résonne sérieusement, la polyphonie le dit doucement ») est enfin exécutable.

> ⚠️ Ces 14 rêves affichent aujourd'hui un **trou muet**, pas une phrase douce :
> `ResonanceSection` retourne `null` quand `emptyHint` est faux. Une ligne à
> changer dans `page.tsx`, propriété de A4 → **`PATCH-PAGE-TSX-A2.md`**. Sans ce
> patch, le correctif est à moitié livré.

---

## 3. Pourquoi le seuil absolu ne pouvait pas marcher

C'est le cœur du rapport. Trois paires, jugées à la main (deux viennent de l'audit) :

| Paire | score brut | score ajusté | **z par source** |
|---|---|---|---|
| **VRAIE** — « je lisais le monde qu'ils avaient créé, leur aventure de chevaliers » → « un festival de rêves… se faire enfermer dans des mondes » | 0.6324 | **0.6228** | **2.776** |
| **BRUIT** — chant d'initiation guerrière → « j'ai rêvé de crypto, Jade était là » | 0.6062 | **0.6230** | **0.185** |
| **BRUIT** — rêve du 8 août (mort, drama) → même rêve crypto | 0.6115 | 0.6283 | 0.645 |

**Le score ajusté classe le bruit AU-DESSUS de la vraie résonance.** 0.6230 > 0.6228.
Aucun seuil absolu, où qu'il soit posé, ne peut trancher entre ces deux lignes.

Le z par source les sépare d'un facteur 15.

J'ai aussi vérifié le seuil « p90 du corpus » recommandé par l'audit : la vraie
paire se situe au **percentile 0.8005** de la distribution ajustée. Un seuil p90
— ou même p85 — **l'aurait tuée**. C'est pourquoi je n'ai pas implémenté la
calibration par percentile telle que demandée, et j'explique pourquoi ci-dessous.

### Ce que j'ai implémenté à la place

Trois filtres cumulés, tous calibrés par rêveur, stockés dans
`user_resonance_calibration` :

1. **plancher absolu** = p50 des scores ajustés du rêveur (Tim : 0.5875). Garde
   faible et assumée — la mesure dit qu'un seuil absolu ne discrimine pas, donc
   il ne fait que barrer l'absurde ;
2. **z ≥ 2.0 par source**, sur le score corrigé de la hubness. **C'est lui qui trie** ;
3. **garde-doublon** sur `sim_sem ≥ 0.97` (§5).

### Le paramètre XX et le paramètre N, justifiés

**Le percentile XX** : je l'ai remplacé par un z, parce que la mesure ci-dessus
montre qu'un percentile global ne sépare pas. Pour information, voici quand même
la courbe complète que j'ai mesurée, si Tim veut arbitrer autrement :

| Seuil (percentile des ajustés) | liens totaux | rêves à 0 |
|---|---|---|
| p85 (0.6302) | 173 | 9 |
| p90 (0.6390) | 154 | 13 |
| p92.5 (0.6442) | 141 | 18 |
| p95 (0.6504) | 118 | 24 |
| p97 (0.6582) | 85 | 29 |

Toutes ces lignes tuent la seule vraie résonance connue (elle est à p80). Le
z ≥ 2.0 donne 75 liens **en la gardant**.

**N = 10 dépôts.** Justification arithmétique : la correction de hubness repose
sur `mean_sim(candidat)`, une moyenne sur n paires. Ajouter k rêves déplace cette
moyenne d'au plus `k·(max−moyenne)/(n+k)`. Avec n = 64, max = 0.96, moyenne = 0.577
et k = 10 : **0.052**, soit **0.84 σ** de la distribution ajustée (σ = 0.0616).
À k = 20 on serait à ~1.5 σ — trop. D'où 10. Le recalcul se déclenche seul
(`_resonance_calibration`, appelée par les deux RPC).

**Corpus trop petit — ce que je tranche.** La borne mathématique décide à ma
place : sur n candidats, le z maximal atteignable est `(n−1)/√n`. Pour n = 4
(5 kairos) c'est **1.5** — le seuil 2.0 est **inatteignable**. Il faut ~7 kairos
pour qu'il soit seulement franchissable, et ~20 pour que l'écart-type soit stable.
Je n'ai donc **pas dilué la barre** pour les petits corpus ; j'ai limité ce qu'on
ose en tirer, en m'ancrant sur `1_BIBLE:365` (« moins de 5 kairos ») :

| Corpus | Comportement |
|---|---|
| **< 5 kairos** | **silence total**, les RPC retournent vide |
| 5 – 20 | z ≥ 2.0, **plafond 2 liens** |
| > 20 | z ≥ 2.0, plafond 4 liens |

---

## 4. L'écho ancien : la promesse tombe à zéro

« Un rêve ancien semble avoir préparé celui-ci » est la seule phrase de l'app qui
affirme une causalité. Voici l'entonnoir complet, mesuré :

| Étape | Candidats restants |
|---|---|
| Toutes les paires éligibles | 3969 |
| après Δt ≥ 30 jours | 990 |
| après numinosité ≥ 0.4 *(post-rattrapage §5)* | 970 |
| après garde-doublon | 969 |
| **après le seuil 0.75 arbitré par Tim (4_LOG:3297)** | **0** |

**Le score maximum atteignable sur tout le corpus est 0.7368.** L'arbitrage de Tim
est 0.013 au-dessus du plafond que ses propres rêves peuvent produire. Ce seuil ne
filtrait pas la feature : il la rendait structurellement impossible. Personne ne
s'en était aperçu parce qu'il n'était **pas lu**.

Et le second verrou tombe indépendamment : la maturation `ECHO_RIPENING`
(`2_DESIGN:247` — récurrence ≥ 3 **ET** charge somatique ≥ 2), que j'ai
implémentée telle que spécifiée, ne laisse passer que **5 paires sur 400
échantillonnées** (8 seulement partagent le moindre motif).

| Combinaison de verrous | Échos affichés |
|---|---|
| **Avant le correctif (aucun verrou actif)** | **183** |
| seuil 0.75 + maturation + z (**livré**) | **0** |
| seuil 0.75 + z, sans maturation | 0 |
| seuil 0.70 + z, sans maturation | 3 |
| maturation + z, sans seuil absolu | 0 |
| maturation seule | 9 |
| z seul | 22 |

Détail notable : **maturation ∩ z = ∅**. Les paires qui partagent un motif
récurrent et somatiquement chargé ne sont **pas** celles qui ressortent
géométriquement. Les deux garde-fous écrits dans les docs mesurent des choses
différentes ; les cumuler produit le silence. C'est cohérent avec l'intention
(« soit elle est méritée, soit elle disparaît »), mais Tim doit le savoir : **en
l'état, l'écho ancien ne s'affichera jamais.**

J'ai livré les deux leviers en paramètres (`p_require_ripening`, `p_min_combined`)
pour qu'il arbitre sans nouvelle migration. **Je ne l'ai pas fait à sa place.**

---

## 5. Ce qui a été réparé au passage

**Le garde-doublon de l'audit était mal ciblé.** Il recommandait d'exclure
`combined_score ≥ 0.97`. Mesuré : les 5 doublons d'import de Tim ont
`sim_sem ∈ [0.980, 1.000]` mais un **score combiné de 0.896 à 0.960** — le garde
proposé en aurait laissé passer **4 sur 5**. Je filtre sur `sim_sem ≥ 0.97`, ce qui
les prend tous les 5 ; l'écart est net (la 6ᵉ paire est à 0.90).

**La numinosité : 52 rêves à 0.00 → 0.** Le pipeline existe et tourne ; il écrivait
0 parce que l'extraction échouait en amont alors que les colonnes extraites étaient
déjà persistées. J'ai recalculé la **composante déterministe** de la formule de
`numinosity.ts` (composantes 1–6) depuis ces colonnes.

Honnêteté sur ce recalcul — **ce n'est pas un minorant**, contrairement à ce que
j'avais d'abord écrit et corrigé après validation. Contre les 12 rêves scorés par
le pipeline complet : écart absolu moyen **0.065**, et le recalcul **dépasse** le
score pipeline dans **7 cas sur 12** (jusqu'à +0.112), le sous-estime dans 5
(jusqu'à −0.183). Raison : le pipeline blende 60/40 avec un score Sonnet souvent
plus bas, non persisté ; à l'inverse le bonus `tradition_specific` m'échappe.
**À lire comme 0.4 ± 0.07, pas comme une frontière nette.** Les 12 scores produits
par le pipeline complet n'ont **pas** été écrasés, et la provenance est tracée dans
`setting_metadata.numinosity_recompute`.

Effet : moyenne 0.648, médiane 0.65, **58 des 64 rêves passent désormais le gate
≥ 0.4** (contre 12 avant). Autrement dit **ce gate ne sélectionne plus rien** : il
laisse passer 91 % du corpus. Il ne peut pas servir de garde-fou, et l'audit avait
raison sur la cause — il ne mesurait que « le pipeline a-t-il tourné ».

**`prophetic_status = 'awakened'` est enfin écrit sur `kairos`.** Le seul writer
existant visait la table legacy `dreams`, donc `/api/echoes/prophetic/matured` ne
s'était jamais déclenché. **Je n'ai pas supprimé la route** : vérification faite,
`public/v12` est **toujours servi en production** (`globals.css` importe
`/v12/styles.css`, et `circle-invite` redirige vers `/v12/index.html#auth`). La
supprimer aurait cassé une surface vivante. L'écriture se fait maintenant dans
`pattern-detection.ts`, au moment de l'enrichissement, sur les échos qui
franchissent les cinq verrous — ce qui est exactement la définition que la route
documente depuis 2026-04-27.

**La boucle de validation est fermée.** Le 1-clic écrivait déjà dans
`resonance_feedback` (vérifié : GRANT ok, contrainte unique conforme au
`onConflict`, upsert testé en direct → 0 ligne = jamais cliqué, pas cassé). Mais
un « pas vraiment » ne faisait que **masquer** : rien du score n'était conservé,
donc aucun verdict ne pouvait corriger quoi que ce soit. J'ai ajouté
`z_at_serve` / `adjusted_at_serve`, remontés du SQL → route → composant → retour,
et `calibrate_z_from_feedback()` qui, **à partir de 30 verdicts**, lit le seuil
dans les données (p10 des « résonne », borné [1.0, 3.0]) au lieu de le poser.
En dessous de 30, elle ne fait rien — ajuster un seuil sur 5 verdicts serait
refaire l'erreur qu'on répare.

---

## 6. Les deux pistes de l'audit qui échouent (ne pas les retenter)

### a. Monter le poids de l'embedding `concept` — **échec**

L'audit la présentait comme « gratuite, à faire en premier ». Mesurée :

| Poids sem/con/som/arc | candidats distincts (top-4) | **exposition max** | z p99 |
|---|---|---|---|
| **0.30/0.30/0.20/0.20 (actuel)** | 49 | **25** | 1.630 |
| 0.20/**0.50**/0.15/0.15 | 45 | **31** | 1.732 |
| 0.10/0.60/0.15/0.15 | 48 | 29 | 1.758 |
| 0.00/1.00/0.00/0.00 | 51 | 24 | 1.999 |

Monter `concept` à 0.50 **aggrave la hubness** (exposition max 25 → 31). Le léger
gain de séparation ne compense pas. **Poids inchangés.**

### b. Nettoyer les préambules parlés avant d'embedder — **échec, et instructif**

Fait pour de vrai : les 64 rêves ré-embeddés sur texte nettoyé (Haiku isole le
récit onirique, ~70 % du texte conservé, coupes verbatim vérifiées), dans une
table de travail `_a2_clean_embeddings` — **la production n'a pas été touchée**.

L'hypothèse de l'audit est **confirmée comme phénomène** : le plancher de bruit
tombe bien.

| | moyenne | σ | p50 | p95 | z p99 |
|---|---|---|---|---|---|
| Brut (prod) | 0.5867 | 0.1144 | 0.6102 | 0.7307 | 1.540 |
| Nettoyé | **0.5208** | 0.1355 | 0.5508 | 0.7001 | 1.689 |

Mais sur la tâche réelle, c'est **pire** :

| Paire | z brut | z nettoyé |
|---|---|---|
| **VRAIE** (chevaliers → festival) | **1.91** | **0.29** ← serait rejetée |
| BRUIT (chant guerrier → crypto) | 0.05 | **1.69** ← serait affichée |
| Hubness (exposition max) | 18 | **22** |

*(z sur embedding sémantique seul, d'où l'échelle différente du §3 qui porte sur
les 4 couches combinées.)*

Le préambule porte le **cadrage du rêveur** — « j'ai fait des cauchemars »,
« je me demandais à m'autoriser dans mes rêves » — qui est souvent le registre
psychique du rêve. Le couper retire de l'information utile. **Ne pas re-embedder.**
Le script et la table de travail restent comme preuve (`scripts/a2-clean-reembed-experiment.mjs`,
table `_a2_clean_embeddings`, supprimable).

---

## 7. Un bug que l'audit n'avait pas vu

`match_kairos_for_wisdom` **déclare** `motif_tags jsonb` et `archetypal_tags jsonb`.
Les colonnes de `kairos` sont des `text[]`. PL/pgSQL refuse :

```
ERROR: structure of query does not match function result type
DETAIL: Returned type text[] does not match expected type jsonb in column 5
```

**Cette fonction levait une exception à chaque appel, depuis toujours.** Personne ne
l'a vu parce que ses trois appelants avalent l'erreur en silence :

| Appelant | Conséquence réelle |
|---|---|
| `/api/mvp/resonate` (ANIMUS) | renvoie `{ resonances: [] }` sur erreur RPC → **n'a jamais rien fait remonter** |
| `/api/kairos/[id]/resonance` | `catch` → bucket « moments de jour » **toujours vide** |
| `/api/dream-chat/converse` | « fallback to recent » **à chaque tour** |

L'audit conclut à un « top-K nu », ce qui supposait qu'elle renvoyait quelque
chose. Elle ne renvoyait rien. Corrigé (`to_jsonb()`), signature déclarée conservée.

J'ai aussi failli livrer une régression du même genre : `CREATE OR REPLACE` avec un
paramètre en plus **crée une surcharge** au lieu de remplacer, rendant la fonction
ambiguë (`function is not unique`) pour les appels à 3 arguments. Détecté en
testant chaque signature d'appelant en direct, ancienne surcharge supprimée.
**Les 5 signatures utilisées en production sont retestées et passent.**

---

## 8. Relecture qualitative — 6 rêves échantillonnés

Tirage systématique (rangs 3, 12, 21, 34, 47, 58 par date), 8 liens survivants
relus un par un. Même sévérité que l'audit.

| # | Source → survivant | z | Verdict |
|---|---|---|---|
| 1 | communauté « rainbow » attaquée par des forces obscures → « je donnerai mon intégrité à ma propre vérité… je me protège de l'espoir des autres » | 2.18 | **Plausible.** Même axe (protéger son intégrité sous pression extérieure), mais le second texte est une incantation, pas un rêve |
| 2 | cauchemars, « des trucs qui me suivaient, voulaient pas me lâcher » → « festival de rêves… se faire enfermer dans des mondes, histoires qui finissent mal » | 2.48 | **PROFONDE.** Être pris dans un monde onirique qui ne lâche pas |
| 3 | même source → « nuit entière de rêves lucides, conscience de mon corps endormi, j'ai beaucoup volé » | 2.32 | **PROFONDE.** La source dit littéralement « je me demandais à m'autoriser dans mes rêves » — c'est la même question, répondue à l'envers |
| 4 | même source → « rêves famille, enfant, vieille peur, adolescence » | 2.07 | **Plausible.** Vieille peur qui revient |
| 5 | « famille, enfant, vieille peur, adolescence » → « une jeune fille, elle était enfant… envie de vivre des choses sexuelles » | **3.03** | **PROFONDE, et inconfortable.** Charge adolescente ancienne, figure enfantine, désir interdit. Le z le plus haut de l'échantillon tombe sur le lien le plus juste |
| 6 | rêve du 8 août (une personne décédée, drama) → course/nage dans une rivière rapide, « je prenais le devant » | 2.23 | **BRUIT.** Aucun nœud commun |
| 7 | « maître du combat, arts martiaux, superstars » → « premier rêve de mes 30 ans, intention d'enregistrer un rêve par jour » | 2.20 | **BRUIT.** Le second est un méta-commentaire sur le journal, pas un rêve |
| 8 | « premier rêve de mes 30 ans » → « fête d'anniversaire chez moi… j'ai envie de ma mamie, ma mamie à l'hôpital » | 2.42 | **Plausible.** Seuil des 30 ans et mortalité de la grand-mère : même horloge, mais le lien est thématique (anniversaire) plus que nodal |

### Est-ce vraiment mieux ? Oui, mais pas transformé.

| | AVANT (audit, 40 liens) | APRÈS (8 liens) |
|---|---|---|
| Profonde | 20 % | **37,5 %** |
| Superficielle / plausible | 30 % | 37,5 % |
| **Bruit** | **40 %** | **25 %** |
| **Doublon d'import** | **10 %** | **0 %** |

En proportion, le bruit passe de 40 % à 25 % — réel, mais pas spectaculaire.
**Le vrai gain est en volume absolu** : ~102 liens de bruit affichés avant
(40 % de 256) contre **~19** après (25 % de 75). **Cinq fois moins de bruit
présenté à Tim**, et le point le plus haut de l'échantillon (z = 3.03) tombe sur
le lien le plus juste — signe que le classement a du sens.

**Ce qui reste cassé, et je le dis franchement :** les 2 liens de bruit survivants
partagent une signature. Ils impliquent tous deux les **longs enregistrements
méta** (« Premier rêve de mes 30 ans » fait 10 895 caractères, largement du
commentaire sur le projet de journal). Le problème des préambules identifié par
l'audit est **réel et non résolu** — et les deux remèdes proposés échouent (§6).

C'est précisément ce que le **re-ranking LLM** doit attraper : un modèle lit
immédiatement que « je veux enregistrer 3560 rêves d'ici mes 40 ans » n'est pas un
rêve. C'est livré (`src/lib/kairos/resonance-rerank.ts`, `claude-sonnet-4-6`,
consigne stricte, « aucun » autorisé, cache dans `kairos_edges`, dégradable).

> **Non vérifié :** le re-ranking n'a **pas** été testé en conditions réelles — il
> s'exécute dans la route Next, que je ne peux pas lancer ici. Le code compile, le
> cache a sa contrainte unique, `edge_type = 'llm_rerank'` est autorisé par le
> CHECK. Mais **les chiffres du §1 et du §2 sont mesurés SANS lui.** Il ne peut que
> réduire davantage.

---

## 9. Livré

**Migrations appliquées** (projet `rtrkxzcyblgonwgfzovj`) :
`resonance_calibration_infra` · `resonance_calibration_functions` ·
`rewrite_find_kairos_echoes_multilayer` · `numinosity_deterministic_recompute` ·
`numinosity_floor_comment_correction` · `numinosity_backfill_from_persisted_extraction` ·
`rewrite_find_kairos_prophetic_with_ripening` · `match_kairos_for_wisdom_min_similarity` ·
`kairos_edges_llm_rerank_cache` · `resonance_feedback_closes_the_loop` ·
`a2_clean_embeddings_scratch` · `drop_ambiguous_match_kairos_for_wisdom_3args` ·
`fix_match_kairos_for_wisdom_type_mismatch`

**Code** : `src/app/api/kairos/[id]/resonance/route.ts` ·
`src/app/api/mvp/resonate/route.ts` · `src/components/ResonanceSection.tsx` ·
`src/lib/kairos/resonance-rerank.ts` *(nouveau)* · `src/lib/kairos/pattern-detection.ts` ·
`src/app/api/mvp/learn-deep/route.ts` · `src/lib/i18n/mvp/screens.{fr,en}.json`
*(`fr` et `en` sont les deux seules locales de l'app — `Locale = 'fr' | 'en'`)*

**Scripts** : `scripts/a2-recalibrate-resonance.mjs` (recalibration + rattrapage
numinosité, exécuté sur les 5 rêveurs) · `scripts/a2-clean-reembed-experiment.mjs`
(expérience §6b, non destructif)

**En attente de A4** : `PATCH-PAGE-TSX-A2.md` — une ligne, sans elle 14 rêves
affichent un trou muet.

**Non fait, assumé** : `/api/echoes/prophetic/matured` conservée (v12 est vivant) ·
production non re-embeddée (§6b) · re-ranking non testé en conditions réelles ·
arbitrage de Tim non pris à sa place sur le seuil 0.75 de l'écho ancien (§4).

---

## 10. Ce que Tim doit trancher

1. **L'écho ancien reste-t-il à zéro ?** Son arbitrage 0.75 est au-dessus du
   maximum atteignable (0.7368). Options mesurées §4. À 0.70 sans maturation :
   3 échos sur tout le corpus.
2. **La maturation `ECHO_RIPENING` reste-t-elle exigée ?** Telle que spécifiée
   elle ne laisse passer que ~1,25 % des paires, et son intersection avec le
   critère géométrique est **vide**.
3. **Faut-il un bouton « ce lien compte » plus visible ?** Le 1-clic existe,
   fonctionne, et a **0 verdict**. Il faut ~30 verdicts pour que le seuil cesse
   d'être une devinette. C'est le chemin le plus court, et il ne dépend que de lui.

---
*Agent A2 (Opus), 2026-07-26. Toutes les mesures refaites en direct sur la base de
production. Rien n'est déclaré « réparé » sans le chiffre qui le prouve.*
