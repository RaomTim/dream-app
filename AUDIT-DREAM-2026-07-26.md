# AUDIT DREAM APP — 2026-07-26

> Audit 4 volets lancé après la perte d'un enregistrement de 8 min (Tim, 26/07).
> Statut : **audit terminé, zéro réparation appliquée.** Tout ce qui suit est vérifié en code/DB, avec fichiers:lignes. Ce qui n'a pas pu l'être est marqué NON VÉRIFIÉ.
> Prochaine action attendue : arbitrage Tim sur l'ordre d'attaque (§6).

---

## 1. LA PERTE AUDIO — verdict

### Ce qui s'est passé
Le blob de 8 min pesait ~7,7 Mo (MediaRecorder sans `audioBitsPerSecond` → défaut Opus ≈128 kbps = 16 ko/s). **La limite de corps de requête Vercel est de 4,5 Mo.** La requête a été rejetée par la plateforme avant même d'entrer dans la fonction → 413.

Contrôle inverse : pour que 4 min passe et 8 min échoue, il faut un débit entre 78 et 157 kbps. Le défaut Chromium (128) tombe pile dedans. Le seuil de bascule est à **~4 min 55**.

| Durée | Taille estimée | vs 4,5 Mo | Observé |
|---|---|---|---|
| 1 min | 0,96 Mo | passe | ✅ |
| 4 min | 3,84 Mo | passe (marge 0,9 Mo) | ✅ |
| **4 min 55** | **4,72 Mo** | **bascule** | — |
| 8 min | 7,68 Mo | +63 % | ❌ |

**Aucun chemin du code actuel ne peut sauvegarder un enregistrement de plus de ~4 min 40.**

### Où sont les audios : nulle part
- `public.kairos_attachments` → **0 ligne**, tous kinds confondus.
- Bucket `kairos-attachments` → **1 objet orphelin** de 58 Ko (11/07), référencé par rien.
- Aucun bucket d'audio de capture live n'existe.
- Le blob vit dans `chunksRef.current` (RAM), devient un `Blob`, part en `FormData`, et disparaît au retour de `processBlob`.
- Pas de `@capacitor/filesystem` : l'app est une WebView pointant sur Vercel (`capacitor.config.ts:35-46`). Aucune couche de stockage natif.

### Les trois aggravants
1. **Le filet existe et ne se déclenche jamais.** `enqueueDeposit` (IndexedDB, persiste les blobs) n'est appelé que si `networkDown` est vrai — `page.tsx:862`. Or `networkDown = !navigator.onLine || e instanceof TypeError`. Un 413/500/504 traverse `page.tsx:153` qui fait `throw new Error(...)` → objet `Error`, pas `TypeError`. **Le filet ne couvre que la panne réseau, pas la panne serveur.** Le commentaire d'intention ligne 859-861 (« LE cas sacré… on ne perd JAMAIS le rêve ») est factuellement contredit par la ligne 862.
2. **`rec.reset()` (`page.tsx:858`) tourne avant tout**, dans le `catch`. Le blob n'est plus référencé par personne, éligible au GC.
3. **Le message ment.** `core.capture.errTranscribe` = « la transcription a échoué — réessaie ou écris-le. » Il n'y a rien à réessayer. Le seul conseil applicable est « reconstruis de mémoire un rêve de 8 minutes ».

### L'ironie
**Toute l'ingénierie nécessaire existe déjà, sur l'autre flux.** `ImportHub.tsx:45-47` porte le commentaire : *« le corps de requête serverless est limité ~4,5 Mo : on vise 3,6 Mo par segment »*, avec `splitAudio()` (WAV mono 16 kHz, découpe à 3,6 Mo), `withRetry()`, et conservation de l'original jusqu'à 25 Mo dans `kairos-attachments`.

| | Capture live (le rêve dit au réveil) | Import |
|---|---|---|
| Découpe | aucune | 3,6 Mo/segment |
| Conscience de la limite 4,5 Mo | **aucune** | explicite |
| Retry | aucun | oui |
| Audio original gardé | **non** | oui |
| `maxDuration` déclaré | **non** (seule route lourde sans) | 60-300 s |

Le chemin sacré ne bénéficie d'aucune ligne de ce travail.

### Bonus : le brouillon texte est perdu aussi
`const [text, setText] = useState('')` — état React nu. Aucun `beforeunload`, aucun `localStorage`. Le seul écrit (`dream_pending_*`, `page.tsx:1280`) n'est **relu par aucune ligne du code**. Écrire un rêve puis quitter = tout perdre. Correctif : ~30 min.

### Plan de réparation en couches

| Couche | Quoi | Effort | Bloqueur |
|---|---|---|---|
| **0** | `enqueueDeposit(blob)` **avant** le fetch + supprimer le test `networkDown` (toute exception → file) | ~1 h | aucun — l'infra IndexedDB existe |
| **1** | Upload audio brut → Storage **avant** transcription, client→Supabase direct (pas via Vercel) | 3-4 h | **aucune policy RLS sur `storage.objects` pour `kairos-attachments`** (0 ligne dans `pg_policies`) → route JSON minuscule renvoyant une `createSignedUploadUrl` |
| **2** | `maxDuration = 300` sur `/api/transcribe` (5 min de travail) + route `transcribe-from-storage` + retry backoff + `transcription_status` | 4-6 h | aucun ; le cron `enrich-batch` (2 min) est le rail |
| **3** | Chunking : extraire `splitAudio()` de `ImportHub.tsx:99-134` vers `lib/audio-split.ts` | ~2 h | RAM mobile sur le décode (~30 Mo temporaire) ; forcer 16 kHz mono divise déjà la taille par 4 à l'émission |
| **4** | UI « brouillons audio en attente » — `PendingSyncLine` (`page.tsx:805`) existe, affiche un compteur non cliquable | 2-3 h | `offline-queue.ts:332-337` fait `entry.audioBlob = null` sur 413 → **destruction silencieuse de la seule copie**, à corriger d'abord |
| **5** | Brouillon texte en `localStorage` avec restauration | ~30 min | aucun |

**NON VÉRIFIÉ** : les logs Vercel de la requête échouée (413 vs 504) ; l'activation de Fluid compute ; le bitrate réel sur l'appareil de Tim ; la plateforme (iOS/Android).

---

## 2. ÉTAT DES LIEUX — un build entier d'écart

**Prod** = `dream-alpha-bice.vercel.app/mvp`, build du **11-12/07**.
**Repo local** : `src/app/mvp/page.tsx` modifié le **23/07 01:05**. `4_LOG.md` s'arrête au 22/07.

→ **Tout le travail du 22-23/07 est codé, non loggé, non déployé.** Vérifié par marqueurs dans le bundle de prod :

| Marqueur | En prod ? |
|---|---|
| `waysKicker`, `nextDream`, `split-night`, `echo-of-the-day`, `wall/feed` | ✅ (build 11/07) |
| `core.home.word`, `core.home.micro`, `core.home.heart`, `core.animus.orb` | ❌ **loi d'épure §14 + bascule Orbe/Cœur non déployées** |
| `transcript-check` (route → 404 en prod) | ❌ |
| `/api/kairos/[id]/audio` (→ 404 en prod) | ❌ |

⚠️ Le dossier monté n'est pas un repo git (`not a git repository`) → impossible de distinguer commité/non-commité. NON VÉRIFIÉ.

### Le double écran cœur
`VISION-CHANT-DU-COEUR-2026-07-13.md` : Écran 1 « L'Orbe » (inconscient : rêves, kaïros, frissons, signes) ↔ Écran 2 « Le Cœur » (vérité consciente : le chant/cri/murmure du cœur maintenant).

| Brique | Statut |
|---|---|
| 2 écrans + swipe G/D (`useSwipe` p.838 et p.991) | **CODÉ NON DÉPLOYÉ** |
| L'orbe EST le bouton (maintenir 180 ms = voix, tap = écrire) §14.3 | **CODÉ NON DÉPLOYÉ** |
| Type de dépôt demandé **après** l'enregistrement (`waysKicker`) | **LIVE** ✅ |
| Chat du Cœur : soutenir / amplifier / challenger / inspirer | **DOC ONLY** — zéro occurrence dans `src/` |
| Ciel de prières | **DOC ONLY** |

`page.tsx:977-979` porte le commentaire `§12ter.H (GO Tim)` — mais `4_LOG.md:44` (22/07) dit encore « décision Tim requise ». **À réconcilier : soit le GO a été donné hors-log, soit du code a devancé la décision.**

⚠️ L'écran Cœur n'a **jamais servi** : `select count(*) from kairos where kairos_type='note_jour'` = **0**.

### L'écart avec Claude Design
Le design validé (10/07, « les 5 écrans NUIT ULTRA SIMPLE validés à 100% ») vit **uniquement dans le projet Claude Design**. Aucun export dans le repo — `_designs_from_claude/` ne contient que les packs V1.x d'avril. La seule matérialisation = `src/lib/dream-design.ts`, tokens **transcrits à la main**.

Le re-skin (couleurs, grain, disque qui respire) est **LIVE**. **L'écart restant est structurel, pas chromatique** : la maquette CD a ~7 éléments par écran, la réalité en a 12+. La loi d'épure §14 (1 méta · 1 foyer · 1 mot · 1 micro-ligne · le foyer EST le bouton · ≤2 liens · fil ≤2 items) est **codée le 23/07, non déployée**.

### Volumétrie réelle (26/07)

| | |
|---|---|
| Comptes `auth.users` | **76** (44 créés en 30 j) |
| Utilisateurs ayant déposé ≥1 kairos | **5** |
| `kairos` total | **74** (73 rêves, **0 note_jour**) |
| Dépôts en juillet | 4 — dont **3 ce matin même** (26/07, 06:18-06:29) |
| Symboles du dictionnaire perso | 1538 |
| `kairos_edges` (liens de résonance) | 1690 |
| `wall.posts` / touches | 1 / 1 |
| `circles` / membres / **messages** | 2 / 2 / **0** |
| `resonance_feedback` | **0** |
| `dream_app_feedback` | **0** |

**76 comptes, 5 rêveurs réels, zéro usage social.**

### 🐛 Anomalie non loggée
Les **4 kairos de juillet ont `title = NULL`** (62/74 en ont un). Motifs et embeddings sont bien là → l'enrichissement tourne, mais **l'auto-titre ne se pose plus**. Ces rêves s'affichent avec 40 caractères bruts (`page.tsx:947`). La route `dreams/batch-titles` existe, branchée sur aucun cron.

### Autres dettes
- 2e jet d'interprétation coupé (limite `max_tokens`) — bug d'usage n°1 signalé par Tim.
- `DAY_FAMILIES` déclarée jamais branchée (`page.tsx:2623` vs `:2632`) → l'écran Univers ne classe rien côté jour.
- Deux schémas de cercles coexistent (`public.circle_*` et `circle.*`) — NON VÉRIFIÉ lequel fait foi.
- Les 4 migrations `2026-07-22_*.sql` portent l'entête « ⚠️ NON APPLIQUÉE » — **c'est faux, les 4 sont en prod**. Entêtes à corriger.
- Contes en base **uniquement en français** → un rêveur EN verra des contes FR.
- Gate bêta (`PLAN-CABLAGE §0.3`) non franchie : modération du Mur, carte détresse testée, parcours du graphe sans lien mort. Aucune trace de ces 3 vérifs.

---

## 3. RÉSONANCES — le verdict cash

### Bug racine : deux `WHERE` manquants
`p_min_combined` est passé aux deux RPC (`0.55` pour les rêves reliés, `0.75` pour l'écho ancien) et **n'est lu par aucune des deux fonctions**. Le corps est :

```sql
WHERE k.user_id = p_user_id AND k.id <> p_kairos_id AND (embedding IS NOT NULL)
ORDER BY combined_score DESC LIMIT p_limit;
```

Le seuil est du **code mort**. Le résultat est un top-K nu.

### Pourquoi toujours 4
Tim a 63 rêves + 1 intuition, **zéro `note_jour`** → le bucket « moments de jour » est structurellement vide. Il ne reste que le bucket rêves, plafonné à 4 par un `break` en dur (`resonance/route.ts:184`), alimenté par 16 candidats non filtrés. Il y aura **toujours exactement 4**, quelle que soit la proximité réelle.

### Le seuil n'aurait rien filtré non plus
Sur les 2 016 paires possibles du corpus de Tim : moyenne **0,597**, médiane 0,61, p95 0,685. **65 % de toutes les paires passent 0,55.** Un top-4 à 0,67 est à peine au-dessus du bruit de fond — signature d'un corpus mono-locuteur avec des préambules récurrents (« Rêve du 24 avril, bon déjà j'ai bien dormi… ») que l'embedding capte autant que le contenu onirique.

### Qualité mesurée — 40 liens jugés sur 10 rêves tirés au hasard

| Verdict | Nb | % |
|---|---|---|
| Résonance **profonde** (même nœud symbolique) | 8 | 20 % |
| **Superficielle** (mot/thème partagé, pas de nœud) | 12 | 30 % |
| **Bruit** (aucun lien lisible) | 16 | 40 % |
| **Doublon d'import** présenté comme résonance | 4 | 10 % |

La base contient **5 paires quasi-identiques** (cosinus ≥ 0,97) — le même enregistrement importé deux fois. Elles arrivent mécaniquement en position 1. L'app annonce à Tim que son rêve résonne avec lui-même.

### L'écho ancien : 100 % sous le seuil que Tim a lui-même posé
- **63 sources sur 64** reçoivent un écho ancien. C'est systématique.
- **115 lignes affichées, 115 sous 0,75.** Max **0,646**, moyenne 0,547, min 0,361.
- **Deux rêves monopolisent 108 des 115 affichages** : l'un est servi **59 fois sur 64** comme « le rêve qui préparait ». Ce n'est pas un écho, c'est une constante.

Cause mécanique : **52 des 64 rêves ont `numinosity_score = 0.00`** (pipeline de numinosité jamais passé sur l'import). Le gate `≥ 0.4` ne sélectionne pas les rêves numineux — il sélectionne **les rêves qui ont été traités**. Combiné à `Δt ≥ 30 j` (45 rêves portent la date d'import du 18-23/04 et ne peuvent donc pas se précéder), le vivier tombe à 2-3 vieux enregistrements de 2024. Le plus court et le plus générique gagne : c'est un **hub** géométrique, un texte bavard proche de tout.

**Exemple réel.** Source : un chant d'initiation guerrière (« A la voilà Vauté… le clan des brûlés, les maîtres du feu, Seth, le royaume des morts, initié avant d'être ressoufflé »). Écho ancien proposé, score 0,600, Δt 749 jours : *« Mes petits rêves du 31… j'ai rêvé de crypto. Jade était là… j'ai reçu mes livres. »*

**Contre-exemple — le moteur trouve de vraies choses.** Rêve A : « je lisais le monde qu'ils avaient créé, leur aventure de chevaliers ». Rêve B : « un festival de rêves qui m'emmène dans des mondes étranges… se faire enfermer dans des mondes… des histoires qui ne me regardent pas ». Même nœud exact : **entrer dans le récit d'un autre, y séjourner, ne pas savoir si on a le droit d'y être.** Score : 0,632 — **plus bas que la moyenne des liens jugés bruit.** Le score ne sépare rien.

### L'intention d'origine, trahie en trois points

| Doc | Exigence | Réalité |
|---|---|---|
| `1_BIBLE.md:365-366` | *« Pas de génération si vide : si aucun ne résonne sérieusement, la polyphonie le dit doucement. »* SILENCE_AS_FEATURE | Top-4 forcé. « Aucune résonance » n'est jamais possible |
| `2_DESIGN.md:247` | Maturation = récurrence ≥ 3 **ET** charge somatique ≥ 2. Sans les deux : latent | Aucun des deux implémenté |
| `4_LOG.md:3297` — arbitrage Tim D4 du 25/04 | *« D4 prophétique 0.75/0.4 »* | 0,4 appliqué. **0,75 jamais appliqué** |

Trois garde-fous, écrits, datés, arbitrés par Tim. Aucun n'a survécu au passage en SQL. Ce n'est pas un mensonge délibéré — c'est un mensonge **structurel** : une UI dont le contrat implicite (« si c'est affiché, c'est que ça résonne ») n'est adossé à rien.

`1_BIBLE.md:471` : *« Le moteur de résonance n'est pas une feature. C'est l'organe central qui rend l'app vivante. »* En l'état il est moins fiable qu'une recherche par mot-clé — au moins un mot-clé ne ment pas sur ce qu'il a trouvé.

### Code mort
`/api/echoes/prophetic/matured` (chuchotement d'accueil) filtre sur `prophetic_status = 'awakened'`. **Les 74 kairos sont `dormant`, sans exception** — et le seul code qui écrit `awakened` cible la table `dreams` (legacy), pas `kairos`. Ce chuchotement ne s'est jamais déclenché et ne se déclenchera jamais.

### Réparations
| Prio | Quoi | Effort |
|---|---|---|
| **P0** | Les deux `WHERE combined_score >= p_min_combined` + garde-doublon `< 0.97` | 30 min |
| **P0** | Calibrer sur la distribution réelle : ≥ 0,685 (rêves) / ≥ 0,72 (écho ancien). Mieux : seuil par utilisateur = p90 de son corpus, recalculé tous les 20 dépôts | 2 h |
| **P0** | Top-K variable, plancher 0. `ResonanceSection` gère déjà le cas vide — c'est l'API qui refuse de se taire. **5 lignes** | 30 min |
| **P1** | Casser la hubness : `score_ajusté = sim(a,b) − mean_sim(b,·)` + plafond d'exposition (un kairos servi max N fois / 30 j) | 2 h |
| **P1** | Nettoyer les préambules parlés avant d'embedder. Essai à 5 min : monter le poids de l'embedding `concept` (motifs extraits, déjà propre) à 0,5 | 5 min → 2 h |
| **P1** | Relancer la numinosité sur le corpus importé (52/64 à 0,00) avant de parler de prophétie | 1 h |
| **P2** | Re-ranking LLM sur les 8 finalistes : *« lesquels partagent le même nœud, pas le même mot ? jamais plus de 3, réponds "aucun" si aucun »*. Cache dans `kairos_edges` (la table est faite pour ça) | 4 h |
| **P2** | Implémenter la maturation spécifiée (`somatic_markers` + `motif_tags` sont déjà extraits) **ou retirer la promesse** « semble avoir préparé » | 4 h |
| **Boucle** | Câbler `resonance_feedback` (le 1-clic existe, `dismissed` ne fait que masquer). 200 verdicts de Tim = le seuil empirique exact au lieu de le deviner | 2 h |

---

## 4. GRANDS RÊVES — ce qui existe déjà

**`kairos.user_marked_numinous` (boolean) existe en base.** Le PATCH `/api/kairos/[id]` l'accepte (`route.ts:57-60`, met aussi `numinosity_pending=true`). La MVP le **lit** (badge « rayonnant », `page.tsx:2279`, `:2956`, guides radiants `:2505`). La RPC `list_kairos_numinous` existe.

**Il manque uniquement le geste.** Aucun bouton de l'UI ne l'écrit — grep de tous les `PATCH` du MVP : seuls `kairos_type`, `raw_text`, `transcript_verified`, interprétations et guides sont écrits. **1 seule ligne marquée en base**, héritée de la V1.x.

→ Un « épingler » d'un tap sur la fiche rêve = **zéro migration**. Colonne, route, RPC et affichage sont tous en place.

Ce qui n'existe pas : `is_significant`, `pinned`, favori, tag libre, et surtout **une taxonomie de flags** (grand rêve / initiatique / prémonitoire / rêve de deuil…) et le journal à part.

### Ancres journalières : ABANDONNÉ
`AnchorScreen.tsx` + protocole `anchoring` existent **uniquement dans `src/_legacy_v1.1/`**. Le vocabulaire porteur (« honorer ») a été explicitement banni le 10/07. Ce qui a pris sa place, tout LIVE : rendez-vous (notifs Capacitor), Réveil, écho du jour (max 1/jour, jamais 2 jours de suite, écartable), carte de soin (cap ~1/semaine).

### Constellations : LIVE
Écran **Univers** (`page.tsx:2567-2760`), **7 axes** : motif · figure · emotion · lieu · dream_ego · theme · sensation. 1538 symboles réels en base. Un symbole vu **≥3 fois** devient « éveillé » (halo doré). Trou connu : `DAY_FAMILIES` non branchée.

---

## 5. FORÊT — corpus rêve

### Ce qui est déjà là
**68 livres** mappés dans `dream_forest_books` avec un `dream_role`. Le noyau dur est solide et lu : Hillman (*Dream and the Underworld*), Aizenstat (*Dream Tending*), Gendlin (felt shift), Hill (3 phases), Delaney ×2, von Franz, Taylor (« if it were my dream »), Watkins, Hunt (*Multiplicity* — 8 types de rêve distincts), Bulkeley ×2, Kalsched, Mindell, LaBerge, Tenzin Wangyal, Corbin, Bachelard ×4, Van Gennep, Weller, Moss ×7.

`forest/dream_alpha/safety-checks.json` (v1.1) contient **déjà** le protocole somatic-first, 5 signatures SNA et **9 red lines**. Ne pas reconstruire.

### 3 défauts d'infra à réparer d'abord (Vague 0)
1. **74 T1 et 93 T2 vides en DB alors que les fichiers existent sur disque.** Touchés côté rêve : Corbin, Watkins, Hunt, Kalsched, Van Gennep, Jung-*Archetypes*, Murdock, Bachelard ×2, Taylor, Badenoch. **Corbin et Watkins — deux piliers de l'imaginal — sont invisibles à l'API.**
2. `dream_forest_books` incomplète : ~14 livres décisifs absents (Corbin, Watkins, Hunt, Kalsched, Bulkeley ×2, Delaney ×2, Van Gennep, Weller, McGilchrist, Buhner-imaginal, Sidewalk Oracles, Larsen).
3. Digests anormalement courts : `levine-waking-the-tiger` **488 mots**, `estes-women-who-run-with-the-wolves` 757, `jung-man-and-his-symbols` T2 638, `moss-dreamgates` T2 834.

### Les 10 gaps P0
| # | Livre | Auteur | Pourquoi c'est bloquant |
|---|---|---|---|
| 1 | Why We Sleep | Walker | **Aucune science du sommeil dans la Forêt.** Sans elle, la feature « geste du réveil » n'a aucune base |
| 2 | Dreaming Souls / Dreaming | Flanagan / Hobson | **La critique.** Sans contrepoint, la Forêt est un chœur de croyants — violation de l'intégrité-vérité |
| 3 | Dreaming: A Conceptual Framework | Windt | Qu'est-ce qu'un rapport de rêve *rapporte* ? Fonde le design du champ de saisie |
| 4 | The Committee of Sleep | Barrett | Incubation validée empiriquement — la seule promesse utilitaire honnête |
| 5 | Dreaming: An Anthropological… | **Tedlock** | **Le trou le plus grave.** Le partage du rêve comme acte social situé, pas besoin universel |
| 6 | Appropriating Images (Kagwahiv) | Kracke | À quoi ressemble un partage quotidien réel du rêve, hors marché |
| 7 | Working with Dreams | **Ullman** | Le protocole de groupe le plus rigoureux jamais écrit. Taylor donne l'esprit, Ullman l'ingénierie |
| 8 | Lucid Dreaming: Gateway | Waggoner | L'éthique de la lucidité : manipuler son propre rêve = violence ? |
| 9 | Exploring the World of Lucid Dreaming | LaBerge & Rheingold | Le manuel de référence |
| 10 | Inner Work | R. A. Johnson | Le seul qui convertit Jung en exercice de 15 min — donc en écran |

P1 (10 titres) : Solms, Domhoff, Faraday, Krakow (IRT — seul protocole cauchemar validé), Barrett *Trauma and Dreams*, Morley, Holecek, Barasch, Ullman & Limmer, Buhner *Ensouling Language*.
P2 (10 titres) : Corbin t.II, Binswanger/Foucault, Hufford, Van de Castle, Bulkeley *World's Religions*, Varela, sources autochtones à rééquilibrer, Lynne Kelly, Ranganath, Stickgold & Zadra.

**Règle d'acquisition pour les traditions vivantes : auteur issu de la tradition, ou ethnographie académique citant ses sources, ou rien.** Aucun « manuel de rêve Senoi » ni « dreamwork amazonien pour Occidentaux ».

### Les 5 vagues de lecture
Question directrice : **qu'est-ce que les gens cherchent VRAIMENT en tenant un journal de rêves, et qu'est-ce qui les fait revenir ?**
Hypothèse à tester : *ils ne cherchent pas le sens, ils cherchent une continuité — la preuve qu'une vie intérieure existe et les concerne. Ils reviennent quand le geste est plus court que l'oubli, et quand quelque chose leur est rendu qu'ils n'avaient pas donné.*

| Vague | Objet | Livrable produit | Parallélisable |
|---|---|---|---|
| **0** | Réparation infra Forêt | Corbin & Watkins consultables par l'API | oui — 3 agents Sonnet |
| **1** | Le geste du réveil, et pourquoi 90 % abandonnent (6 livres) | Spec du **premier écran du matin** : combien de secondes, quelle modalité, quel comportement quand on ne se souvient de rien (le cas majoritaire, le vrai tueur de rétention) | oui — 4 agents |
| **2** | Que fait-on du rêve une fois écrit (7 livres) | **Matrice de permission** : pour chaque geste de l'app, la source qui l'autorise ou l'interdit, et la formulation exacte autorisée | partiellement — **l'arbitrage doctrinal reste en une seule tête** |
| **3** | Le partage : aide ou profanation (5 livres) | Go/no-go argumenté sur la surface sociale, croisé avec le verdict des Cercles INFUSE (jamais utilisés) | oui — 3 agents |
| **4** | Le rêve qui fait mal (5 livres) | Durcir `safety-checks.json` sur cauchemar récurrent, rêve de deuil, prophétie auto-réalisatrice | oui — 3 agents, **relecture Opus obligatoire** |
| **5** | Profondeur & cosmologie | La **voix** de l'app — ce qui la rend INFUSE et pas Dream Journal #47 | **non** |

**La Vague 2 contient un conflit irréconciliable déjà présent dans la Forêt** : Hillman/Aizenstat/Watkins/Bachelard disent *ne jamais interpréter* ; Delaney/Hill/Gendlin/Taylor disent *faire découvrir, jamais dire*. Il faut trancher, pas moyenner.

### Les questions produit à trancher
1. Interpréter ou jamais — **existe-t-il un troisième geste, refléter sans questionner ?**
2. Que fait l'app quand l'utilisateur ne se souvient de rien ? (cas majoritaire, vrai point de churn — Hillman : Léthé, ce n'est pas un échec de l'utilisateur)
3. Combien de secondes dure le geste du matin, quelle modalité ?
4. Peut-on éditer un rêve après coup ? (la mémoire est reconstructive : écrire un rêve le modifie)
5. Où commence la statistique ? « Tu as rêvé d'eau 7 fois ce mois » — Domhoff l'autorise, Hillman dirait que compter les images les tue
6. À quel moment proposer une résonance sans casser le rêve ? (le sens émerge **entre** les rêves, pas dans un rêve)
7. Le partage social : aide ou profanation ? Le précédent des Cercles est une donnée, pas un accident
8. Si social : temps réel ou différé ? (le tour de parole à ouverture différée retenu par Tim **est** structurellement le protocole d'Ullman)
9. Cauchemar récurrent : IRT réécrit le rêve et marche cliniquement ; Hillman interdit de héroïser. **Conflit non résolu**
10. Rêve de mort / de deuil : Weller donne la structure, mais la contenance est communautaire par nature
11. Comment refuser la prophétie sans nier l'expérience ?
12. Faut-il générer une image du rêve ? **Risque irréversible : on ne « dé-voit » pas**
13. Le rêve lucide : mode de l'app ou app séparée ? (risque de cannibaliser la posture contemplative)
14. Proposer l'incubation ? Promesse la plus solide empiriquement, mais elle instrumentalise le rêve
15. Qui possède le rêve ? Moss : le monde onirique est une **économie du don**. Quelle est la réciprocité d'une app ?
16. Bonus : faire une place au **sommeil sans rêve** ? Aucune app au monde ne le propose. Différenciation radicale

### Garde-fous éthiques
**Correction de doctrine** : la restriction sur Sand Talk est **obsolète**. `logs_or_audits/ETHICAL-POLICY-V2.md` (13/04, décision Tim) : *« Aucun livre n'est restreint. La Forêt ne censure pas. Elle éduque. »* Le mécanisme est une alerte advisory. **Ce que ça change : pas de mur, mais obligation de nommer — l'attribution doit remonter jusqu'à l'utilisateur.**

**🔴 Bombe identifiée** : Hay, Martel et Odoul sont dans `dream_forest_books` avec `dream_role='interpretation'` et `priority=1`. Ils portent des flags HIGH en base (*victim-blaming*, *deterministic_causality* : « il est impossible que… sans… »). Un dictionnaire des rêves construit sur cette grammaire produirait mécaniquement de la culpabilisation. **À sortir du rôle `interpretation` ou reclasser `internal_only`.**

**Le cas « Senoi »** : les pratiques attribuées aux Senoi sont académiquement contestées, le récit de Kilton Stewart largement considéré comme **fictif**. La ruling en base dit : *« INFUSE should not amplify "Senoi dreamwork" as a brand reference. »* Cas d'école d'une tradition inventée vendue 40 ans comme ancestrale.

**Cluster Moss (7 livres)** : *ondinnonk* est un concept haudenosaunee **vivant** — jamais un nom de feature. Moss a une bénédiction d'aîné ; INFUSE en source secondaire n'en a pas. Cadrage : *inspiré de*, jamais *transmis par*.

**Déséquilibre Dreamtime** : le corpus aborigène repose sur Lawlor et Elkin, deux auteurs non-autochtones. Seuls Neale et Skuthorpe portent une voix interne. **Ne pas construire de feature « Dreamtime » sur cette base.**

**Le garde-fou qui n'existe pas encore** : aucun livre de la Forêt ne traite de **l'asymétrie IA–rêveur**. Delaney a écrit sur le pouvoir de l'interprète humain ; personne n'a écrit sur un interprète disponible 24/7, infatigable, jamais en désaccord, et qui se souvient de tous vos rêves mieux que vous. Gap théorique qu'aucune acquisition ne comblera — **à écrire, pas à lire.**

---

## 6. ORDRE D'ATTAQUE PROPOSÉ

| # | Chantier | Effort | Pourquoi maintenant |
|---|---|---|---|
| **1** | Filet audio couches 0 + 5 + `maxDuration` | ~2 h | Ça saigne. Chaque rêve enregistré d'ici là au-delà de 5 min est perdu |
| **2** | Déployer le build du 23/07 (épure §14 + Orbe/Cœur + TranscriptCheck + route audio) | déploiement | **Déjà écrit.** Le design que Tim veut publier existe |
| **3** | Les deux `WHERE` + top-K variable + garde-doublon | 30 min | Intégrité. La feature #1 ment aujourd'hui |
| **4** | Bouton « grand rêve » (`user_marked_numinous`) | ~1 h | Zéro migration, tout est câblé sauf le geste |
| **5** | Couches audio 1-4 (Storage, async, chunking, UI récupération) | ~12 h | Le vrai filet |
| **6** | Vague 0 Forêt + lancement Vagues 1-2 | agents | Fonde la vision et la MAJ des 4 canoniques |
| **7** | MAJ `1_BIBLE` / `2_DESIGN` / `3_TECHNICAL` / `4_LOG` | — | **Après** les arbitrages, pas avant |

---

*Audit produit par 4 agents Opus en parallèle, 26/07/2026. Toutes les affirmations sont sourcées en code ou en SQL sauf mention NON VÉRIFIÉ.*
