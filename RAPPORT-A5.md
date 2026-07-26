# RAPPORT-A5.md — Flotte Dream App 2026-07-26 — Agent A5 (Sonnet)

Repo travaillé : `dream-alpha-app/` (bash sandbox, host path miroir
`/Users/timote/Desktop/eBOOKS/CLAUDE CONTEXTE/claude-context/dream-alpha-app/`).
Snapshot pré-flotte : `_snapshot_pre_fleet_2026-07-26/`. Supabase `rtrkxzcyblgonwgfzovj`.

**⚠️ À lire avant tout le reste — anomalie d'environnement rencontrée** (voir §0).

---

## §0 — Anomalie d'environnement : les suppressions de fichiers ne tiennent pas

Tous les `rm` de fichiers effectués pendant cette session (`demo-night-tokens.ts`,
`AuthScreen.tsx`, `FeedbackButton.tsx`, `core.en 2.json`, `CareCard 2.tsx`) ont
**réussi sur le moment** (confirmé par `ls` juste après) puis les fichiers sont
**revenus tout seuls**, avec leur date de modification ORIGINALE intacte (pas une
recréation — une restauration). Confirmé en fin de session : les 5 fichiers sont
de nouveau présents.

Cause quasi certaine : éviction/resync iCloud sur `claude-context`, déjà documentée
(`reference_icloud_eviction.md` — « cause racine confirmée 07-25 : disque plein →
macOS évince, libérer de l'espace RÉSOUT l'éviction »). Preuve additionnelle trouvée
en cours de route : l'agent **A4** (parallèle) a lui aussi identifié `CareCard 2.tsx`
et `core.en 2.json` comme morts et les avait déjà déplacés dans
`_icloud_dups_2026-07-26/` (avec un `README.txt` daté d'aujourd'hui) — **et pourtant
les originaux sont revenus dans `src/` malgré ce déplacement**. Ce n'est donc pas un
problème d'agent, c'est l'environnement qui restaure des chemins depuis le cloud.

**Ce qui a tenu, en revanche** : toutes les éditions de contenu (Edit tool) sur des
fichiers existants — `pipeline.ts`, `forest-retrieval.ts`, `tsconfig.json`,
`vercel.json`, les 11 en-têtes de migrations `.sql` — sont **intactes**, vérifiées
a posteriori. Seules les suppressions pures ne survivent pas.

**Conséquence concrète et grave, trouvée en vérifiant** : `CareCard 2.tsx` (copie
périmée, un seul bouton au lieu de resonates/notForMe) casse `next build` avec une
vraie erreur TypeScript (TS2322), et `next.config.js` n'a pas
`typescript.ignoreBuildErrors` → **le projet ne compile plus depuis le 23/07**
(déjà documenté par A4). Comme la suppression ne tient pas, j'ai neutralisé le
risque autrement : **`tsconfig.json` exclut désormais explicitement ces 5 fichiers
zombies** (ils restent sur disque, mais ne sont plus des racines de compilation —
s'ils étaient un jour réellement importés, TS les type-checkerait quand même comme
dépendance, donc rien n'est masqué). `npx tsc --noEmit` passe maintenant à zéro erreur
(§Vérification).

**Action pour Tim** : supprimer ces 5 fichiers **directement sur le Mac** (pas via
Cowork) une fois l'espace disque libéré (cf. `reference_disque_mac_nettoyage.md`) —
la suppression locale a de meilleures chances de tenir puisque la source du problème
est le sync cloud, pas le sandbox :
```bash
cd ~/Desktop/eBOOKS/CLAUDE\ CONTEXTE/claude-context/dream-alpha-app
rm "src/lib/demo-night-tokens.ts" "src/components/AuthScreen.tsx" \
   "src/components/FeedbackButton.tsx" "src/lib/i18n/mvp/core.en 2.json" \
   "src/components/CareCard 2.tsx"
```
Une fois fait, retirer les 5 lignes correspondantes de `tsconfig.json` → `exclude`
(elles n'auront plus lieu d'être).

---

## Tableau de synthèse

| Lot | Statut | Résumé |
|---|---|---|
| 1 — Titres NULL | **full_green** | Bug diagnostiqué et corrigé dans le pipeline, 11/12 kairos backfillés, 1 laissé volontairement (contenu sensible) |
| 2 — Entêtes migrations mensongères | **full_green** | 11 fichiers corrigés (4 demandés + 7 trouvés en plus) |
| 3 — Livres à risque (interpretation) | **full_green** (routage) / **à surveiller** (T3 fallback) | Reclassés `internal_only`, trou de fallback T2 colmaté |
| 4 — Code mort | **partial** (bloqué par §0) | 5 fichiers identifiés+neutralisés (tsconfig), 1 patch écrit pour A8, liste d'orphelins API pour Tim |
| 5 — Contes FR only | **à décider par Tim** | Ampleur mesurée et chiffrée, aucune traduction faite (hors mandat Sonnet) |
| 6 — Doublon schémas cercles | **à décider par Tim** | Verdict rendu avec preuves, aucune migration exécutée |

---

## Lot 1 — Titres NULL

**Diagnostic (la vraie cause)** : `src/lib/kairos/extraction.ts` calcule bien
`title_poetic` (extraction Sonnet 16 dims **et** `extractLightNote` pour les
`note_jour`). Mais `src/lib/kairos/pipeline.ts` — le pipeline d'enrichissement
appelé par le cron `enrich-batch` (toutes les 2 min) et par tout dépôt live — ne
l'écrivait **jamais** dans la colonne `kairos.title`. Ni dans l'update de phase 4.5
(`updateExtraction`), ni dans le finalUpdate de phase 9. Le champ était calculé puis
jeté au sol. Ce n'est pas une régression de juillet spécifiquement : la mesure SQL
(`kairos` groupé par mois) montre que le taux de titre est tombé à quasi 0% dès
**mai 2026** (46 titrés / 4 non-titrés en avril, contre 0/3 en mai, 1/1 en juin,
0/4 en juillet) — avril doit son bon score aux imports en masse qui portaient déjà
un titre à l'insertion (`mvp/import`, `mvp/import-audio`), pas à un auto-titrage qui
aurait fonctionné puis cassé. Le vrai bug : le pipeline n'a **jamais** posé de titre
tout seul depuis sa réécriture du 25/04 (« chantier 1+2+3+4 »).

`src/app/api/dreams/batch-titles/route.ts` — la route citée dans le brief comme
« jamais branchée sur aucun cron » — est en plus **cassée à la racine** : elle lit/écrit
la table `dreams` (legacy, 63 lignes, table séparée qui existe encore mais n'est plus
celle utilisée par le flux courant), pas `kairos`. La brancher sur un cron sans la
réécrire n'aurait rien réparé (silencieusement, sur la mauvaise table). Je l'ai laissée
telle quelle (hors périmètre de rewrite, et le fix pipeline rend la question caduque) —
signalé comme code mort/dangereux, voir Lot 4.

**Fix choisi (le plus propre, comme demandé)** : intégré dans le pipeline existant,
pas de nouveau cron. `src/lib/kairos/pipeline.ts` :
- le `select` de phase 1 charge désormais aussi `title`
- `updateExtraction` (phase 4.5) inclut `title: extraction.title_poetic.trim().slice(0,120)`
  **uniquement si `!kairos.title`** — jamais d'écrasement d'un titre déjà posé
  (manuellement via `mvp/name`, ou par import).

**Backfill** : 12 kairos avaient `title IS NULL` en base (confirmé exact, correspond au
« 12 max » du brief). Génération de titres via Haiku (même prompt que `batch-titles`,
un script Node ponctuel utilisant la clé `ANTHROPIC_API_KEY` du `.env.local`), puis
`UPDATE` SQL un par un.
- **11/12 backfillés** avec succès.
- **1/12 volontairement laissé `NULL`** : `id = 3d7ef4ee-0dc8-4d12-a6b7-2bf08086baad`.
  Le contenu de ce rêve décrit une scène impliquant une mineure et un contenu sexuel
  explicite (le rêveur en parle lui-même avec un malaise clair dans le texte). Haiku a
  **refusé** de générer un titre (safety refusal côté API). Je n'ai **pas** forcé de
  contournement ni inventé de titre — ce n'est pas un problème mécanique, c'est un rêve
  qui mérite un regard humain/Opus, pas un Sonnet qui bricole une réponse. **Décision
  pour Tim** : soit laisser ce rêve sans titre (l'app dégrade proprement, 40 caractères
  de texte brut), soit le traiter à part.

**Vérification finale** : `select count(*) filter (where title is null) from kairos` →
**1** (contre 12 avant), sur 74 lignes totales.

---

## Lot 2 — Entêtes de migrations mensongères

Vérifié en SQL (`pg_constraint`, `pg_indexes`, `information_schema.columns`,
`list_migrations`) **chacun des 4 fichiers demandés + tous les autres fichiers de
`supabase-migrations/`**. Résultat : **11 fichiers sur 13 avaient une entête « NON
appliquée » alors qu'ils sont TOUS en prod.** Seuls les 2 fichiers d'avril
(`2026-04-20-dreams-forest-sources.sql`, `2026-04-20-match-forest-chunks.sql`)
n'avaient pas d'entête à corriger.

| Fichier | Vérifié via | Migration trackée / date |
|---|---|---|
| `2026-07-22_kairos_audio.sql` | `pg_get_constraintdef` (CHECK inclut `audio`) | `20260722180344_kairos_attachments_kind_audio` |
| `2026-07-22_kairos_client_dedup.sql` | `pg_indexes` (index unique présent) | `20260722184014_kairos_client_dedup_offline_first` |
| `2026-07-22_transcript_verified.sql` | colonne existe | `20260722231010_kairos_transcript_verified` |
| `2026-07-22_warning_signal.sql` | `pg_indexes` (index présent, `DESC` en plus vs fichier) | **non trackée** — appliquée entre le 22/07 23:10 et le 23/07 22:25, probablement via `execute_sql` direct (date exacte non retrouvable) |
| `2026-07-11_circle_chat_defis.sql` | 3 tables existent | `20260711011525_circle_chat_defis` |
| `2026-07-11_deletion_requests.sql` | table existe | `20260711011540_deletion_requests_7_jours` |
| `2026-07-11_kairos_attachments.sql` | table existe | `20260711011500_kairos_attachments_scan_photos` |
| `2026-07-11_kairos_dreamer_lang.sql` | colonne existe | `20260711175607_kairos_dreamer_lang` |
| `2026-07-11_kept_interpretations.sql` | table existe | `20260711014559_kept_interpretations` |
| `2026-07-11_wall.sql` | schéma `wall` + 3 tables existent | `20260711011443_wall_schema_mur_anonyme` |
| `2026-07-12_night_group.sql` | colonne existe | `20260711165310_kairos_night_group_multi_reves` (⚠️ horodatage trackée = 11/07, fichier daté 12/07 — écart mineur non résolu) |

Toutes les entêtes corrigées en place (statut + preuve + référence migration trackée).
Le point « wiring restant » dans `2026-07-11_transcript_verified.sql` (whitelister
`transcript_verified` dans le PATCH de `kairos/[id]/route.ts`) n'a **pas** été vérifié
côté code — territoire A3, signalé dans l'entête pour que ça ne se perde pas.

---

## Lot 3 — Livres à risque (Hay / Martel / Odoul)

**Vérifié en SQL** — les 3 entrées exactes dans `dream_forest_books` :

| slug (`book_id`) | `dream_role` avant | `priority` | flags éthiques (`forest_books.ethical_notes`) |
|---|---|---|---|
| `hay-heal-your-body` | `interpretation` | 1 | MEDIUM — victim-blaming si cadre « you-created-this » repris |
| `odoul-dis-moi-ou-tu-as-mal` | `interpretation` | 1 | MEDIUM — biologie totale francophone, jamais pour diagnostic |
| `martel-grand-dictionnaire-malaises` | `interpretation` | 1 | **HIGH** `deterministic_causality` + **HIGH** `victim_blaming_risk` + MEDIUM `medical_substitution_risk` + MEDIUM `gendered_essentialism` |

Ces flags entrent frontalement en collision avec `forest/dream_alpha/safety-checks.json`
→ `red_lines` : « Jamais de dictionnaire de symboles plat », « Jamais de prédiction
fataliste ». Les 9 autres livres du rôle `interpretation` (Mindell, Hill, Gendlin,
Taylor, von Franz…) n'ont **aucun** flag de ce type — je ne les ai pas touchés.

**Reclassement effectué** : nouveau rôle `internal_only` (pas de rôle existant ne
convenait). Le CHECK constraint `dream_forest_books_dream_role_check` ne l'autorisait
pas → migration `dream_forest_books_add_internal_only_role` appliquée (ajoute
`internal_only` à l'enum, commente la colonne). Puis `UPDATE` ciblé sur les 3 lignes
uniquement (par `book_id`, jamais un rewrite de table — coordination A7 respectée,
**aucun `RAPPORT-A7.md` trouvé** au moment de l'action, donc pas de conflit détectable).
Les `notes` de chaque ligne portent désormais une trace de la décision et sa date.

**Vérification du routage app (au-delà de la simple reclassification)** — j'ai lu
`src/lib/forest-retrieval.ts` en entier : `queryForestForModeDetailed` a un fallback à
3 niveaux (T1 rôles scopés du mode → T2 « Dream Forest entière, tous rôles » → T3
« 299 livres Forest, aucune restriction »). **T1 est safe** (aucun `MODE_TO_ROLES`
n'inclut `internal_only`). **T2 avait un trou** : `getDreamForestBookIds(client)` sans
argument `roles` ne filtrait par AUCUN rôle → si le T1 scopé ne rendait pas assez de
chunks, le fallback T2 réinjectait quand même Hay/Martel/Odoul. **Corrigé** :
`getDreamForestBookIds` exclut désormais `internal_only` par défaut quand aucun rôle
n'est demandé explicitement. T3 (299 livres, aucune restriction) n'a **pas** été touché
— il est déjà comme ça pour TOUS les livres Forest, ce n'est pas spécifique à ces 3, et
c'est cohérent avec « la Forêt éduque, aucun livre n'est restreint » — c'est le
fallback ultime documenté, pas un trou nouveau.

Grep de sécurité : aucun des 3 slugs n'apparaît en dur nulle part dans `src/`.

**⚠️ À surveiller (pas un lot, une note)** : le T3 (tous livres Forest, sans
restriction de rôle) reste un canal théorique par lequel ces 3 livres peuvent revenir
si le T1+T2 scopés Dream échouent tous les deux (peu de chunks / similarité faible).
C'est le comportement voulu de la Forêt globale, mais si Tim veut un blocage plus dur
même en dernier recours pour ces 3-là spécifiquement, ça demande une décision de
politique, pas un fix mécanique.

---

## Lot 4 — Code mort

| Élément | Statut | Détail |
|---|---|---|
| `demo-night-tokens.ts` | **partial** — identifié mort, `rm` fait mais ne tient pas (§0) | Exclu de `tsconfig.json` en attendant |
| `PROTO_CATALOG` + `ProtocolRunner` + `ProtocolScreen` (page.tsx, ~252 lignes) | **identifié, patch écrit** | Voir `PATCH-PAGE-TSX-A5.md` — territoire A4/A8 |
| `CareCard 2.tsx` | **partial** — cassait `next build`, neutralisé via tsconfig exclude (§0) | Doublon d'A4 (déjà repéré, même diagnostic) |
| `core.en 2.json` | **partial** — mort, exclu (§0) | idem |
| `AuthScreen.tsx` | **partial** — mort, exclu (§0) | page.tsx a sa propre fonction `AuthScreen()` interne (ligne 742), n'importe pas le composant |
| `FeedbackButton.tsx` | **partial** — mort, exclu (§0) | zéro référence hors `_legacy_v1.1` (exclu du build) |
| `src/lib/supabase.ts` → `queryDreamForest()` | **listé, non touché** — confiance haute | Fonction exportée jamais importée nulle part (grep). Remplacée par `forest-retrieval.ts` (le commentaire du fichier le dit lui-même : « le muscle qui faisait défaut »). Je ne l'ai pas supprimée — appartient à un fichier plus large, pas eu le temps de vérifier l'impact des autres exports du même fichier. |
| Routes API sans appelant trouvé dans `src/` | **listé, non touché, confiance BASSE-MOYENNE** | Voir ci-dessous. |

**VoiceRecorder.tsx (demandé par le brief, territoire A1)** — vérifié directement :
1. **Le brief se trompe sur l'usage** : `VoiceRecorder` EST utilisé, via
   `src/components/GuideSession.tsx` (ligne 180), lui-même importé et rendu par
   `src/app/mvp/page.tsx` (ligne 633, `screen === 'guide'`). Ce n'est donc **pas** un
   composant mort de l'écran MVP — l'écran « guide » y mène.
2. **Le catch « totalement vide lignes ~75-79 » n'existe pas** dans le fichier actuel
   (117 lignes). Les 2 blocs `catch` du fichier (lignes 49 et 75) font tous les deux
   `console.error(...)` — aucun n'est vide. Soit le brief décrivait une version
   antérieure du fichier, soit une confusion de fichier. À vérifier par A1 si le souci
   visé était ailleurs.

**Orphelins API — mesure honnête de la méthode** : un grep systématique des chemins de
route contre `src/` trouve ~110 routes « 0 référence directe » (liste complète dans
l'historique de session si besoin). **Cette méthode est peu fiable pour les routes à
segment dynamique** (`[id]`) car les appels réels utilisent des template literals
(`` `/api/kairos/${id}/mirrors` ``) que le grep littéral ne matche pas — la quasi-totalité
de la liste brute est donc du faux positif. J'ai vérifié à la main les routes **sans**
segment dynamique, qui elles sont fiables :

- `api/v12-env`, `api/journal/sections`, `api/journal/summon-kairos-wisdom`,
  `api/user/validate`, `api/user/annotate`, `api/user/skip`, `api/feedback`
  (celle-ci était appelée par `FeedbackButton.tsx`, lui-même mort — double mort) —
  **zéro appel trouvé dans `src/`**, seulement leur propre commentaire d'en-tête.

Je **ne les ai pas supprimées** : je ne peux pas exclure un appelant externe
(cron/webhook hors `vercel.json`, app mobile Capacitor native, autre repo type
`healer-app`/`anaconda`). C'est un signal fort de fonctionnalités abandonnées
(journal, oracle-corps, anima-mundi, bigdream, lucid, `circle` singulier vs
`circles` pluriel, nightmares, echoes, dream-chat, personal-dictionary,
protocoles) — mais un audit dédié serait nécessaire avant toute suppression.
**Décision pour Tim** : vaut le coup d'un lot dédié si ce n'est pas déjà couvert
ailleurs dans la flotte.

---

## Lot 5 — Contes en français seulement

**Ampleur mesurée** : table `public.tales`, **32 contes au total**, tous
`ethics_flag = 'open'`, **aucune colonne `lang`** dans le schéma. Les titres et
`full_text`/`summary` sont 100% en français **même pour des traditions non
francophones** (Soufi/persan, Inuit, Andersen/danois, vietnamien, sumérien, japonais,
mongol, etc. — 25 traditions différentes, toutes écrites en français). L'app ne
supporte que 2 locales actuellement (`src/lib/i18n/locales/{fr,en}.json`,
`mvp/{content,core,screens}.{fr,en}.json`) — donc le besoin réel est **32 contes → 1
locale cible (EN)**, pas une explosion multi-langues.

Volume : `full_text` moyen ~876 caractères (total ~28 000 caractères pour les 32),
`summary` moyen ~172 caractères. Petit corpus, traduction bornée.

**Confirmé dans le code** : `POST /api/tales/match` (appelé une fois dans `page.tsx`
ligne 2047) ne reçoit et ne transmet **aucun paramètre de langue**. La RPC
`match_tales_for_kairos` et le fallback heuristique renvoient toujours le
`full_text`/`summary` stocké — donc un rêveur `dreamer_lang='en'` reçoit
systématiquement un conte en français, sans aucun moyen de le savoir côté requête.

**Bonus trouvé en lisant la RPC** (pas le sujet du lot, mais lié) : les 32 tales ont
`embedding IS NULL` à 100%. La branche vectorielle de `match_tales_for_kairos` a un
`WHERE t.embedding IS NOT NULL` — elle ne renvoie donc **jamais rien** actuellement ;
le matching tombe systématiquement sur le fallback heuristique/recency de la route.
Pas fixé (hors mandat), juste signalé — pertinent si un ré-embedding est fait en même
temps qu'une traduction.

**Plan de correction proposé (chiffré, non exécuté)** :
1. **Schéma** — pattern identique à `kairos.dreamer_lang` déjà en place : ajouter
   `tales.lang text NOT NULL DEFAULT 'fr' CHECK (lang IN ('fr','en'))`, marquer les 32
   lignes existantes `lang='fr'`, puis **insérer 32 nouvelles lignes** `lang='en'`
   (même structure, `title`/`summary`/`full_text` traduits, `tradition`/`motif_tags`/
   `structural_phase`/`emotional_register`/`figures` recopiés à l'identique — ce sont
   des métadonnées structurelles, pas du texte à traduire).
2. **Traduction** — 32 contes × ~876 car. de `full_text` + ~172 car. de `summary` =
   petit volume, mais **contenu sensible** : sources documentées (Grimm, Perrault,
   Estés, Campbell, Attar, Andersen…) et au moins 2 traditions orales/autochtones
   (Senoi/Malaisie via Stewart, San/Bushman du Kalahari via Bleek-Lloyd, Iroquois,
   Amérindienne) où une traduction mécanique risquerait de perdre le respect de source
   déjà travaillé en français. **Recommandation : Opus, pas Sonnet**, avec relecture
   humaine — cohérent avec la red line Bible §17.4 (« aucun conte généré par IA », qui
   vise la création, mais la traduction d'un texte déjà sourcé mérite la même exigence
   de fidélité).
3. **Code** — `route.ts` (`/api/tales/match`) : ajouter un filtre `lang` (lu via
   `reqLang(req)` comme le fait déjà `enrich-batch`), avec repli `fr` si absent.
   RPC `match_tales_for_kairos` : ajouter un paramètre `p_lang` et filtrer
   `WHERE t.lang = p_lang` (ou repli `fr` si aucune ligne EN ne matche pour ce
   `tale_id` groupe — à décider selon si on préfère « pas de conte » ou « conte FR »
   en dernier recours pour un anglophone, c'est un choix produit).
4. **Effort estimé** : migration schéma = quelques minutes ; traduction 32 contes
   (Opus + relecture Tim) = la vraie variable, pas mécanisable de façon fiable en
   quelques minutes vu la sensibilité culturelle ; câblage route = petit, une fois le
   schéma et les données EN posés.

**Rien traduit, rien migré** — décision de Tim sur le go/no-go et le prestataire
(Opus dédié).

---

## Lot 6 — Doublon de schémas cercles

**Verdict : `public.circle_*` fait foi pour cette app. `circle.*` (schéma séparé) est
étranger au code de `dream-alpha-app`.**

Preuves :
- **Code** : `grep -rn "\.schema('circle')\|\.from('circle\." src/` → **zéro résultat**.
  Aucune ligne de ce repo n'interroge le schéma `circle.*`. À l'inverse,
  `.from('circle_...')` (tables `public.circle_*`) apparaît dans **36 fichiers**
  (dont le G4 chat + défis vérifié appliqué en Lot 2).
- **Données** : `public.circles`/`circle_members` = 2/2, créés organiquement depuis le
  19/04. `circle.circles` = 11 lignes, **toutes créées à la même seconde exacte**
  (`2026-05-23 01:00:57`) — signature d'un seed/scaffold en masse via migration
  (`circle_phase0_foundation`, 23/05), pas d'usage réel. `circle.members` = 5,
  `circle.messages` = 6 — ces chiffres **correspondent exactement** à ce que
  `MEMORY.md` documente déjà pour **cercles.infuse.earth** (« 5 membres = Tim ×2
  comptes, 6 messages = ses tests, dernier 21/06 ») : c'est très probablement le
  schéma qui sert un **autre produit/repo** (cercles.infuse.earth), pas cette app.

**Plan de convergence proposé (non exécuté)** :
1. Confirmer avec Tim si `circle.*` (schéma) appartient bien à un autre repo/déploiement
   (cercles.infuse.earth). Si oui → rien à « converger », les deux schémas servent deux
   produits différents et coexistent légitimement dans le même projet Supabase.
2. Si `circle.*` est confirmé abandonné (usage = zéro comme documenté) : sauvegarder
   (dump) puis `DROP SCHEMA circle CASCADE` — mais **uniquement après confirmation
   explicite de Tim**, aucune donnée n'a de valeur connue (2 cercles = comptes de test
   Tim lui-même par sa propre note).
3. Ne rien migrer entre les deux schémas : `public.circle_*` (celui de cette app) est
   déjà la version vivante et alimentée par le code actuel.

---

## Vérification — `npx tsc --noEmit -p tsconfig.json`

**Résultat final : 0 erreur, exit code 0.**

Chemin pour y arriver (transparence complète) :
1. `typescript` n'était **pas installé** dans `node_modules` (dossier présent mais
   vide/corrompu — `npm ls` le confirmait `invalid`). Réinstallé en local
   (`npm install typescript@5.5.4 --no-save`) pour pouvoir vérifier.
2. Premier run : **~60 erreurs**, mais presque toutes venaient de
   `_snapshot_pre_fleet_2026-07-26/` et `_icloud_dups_2026-07-26/` — deux dossiers de
   sauvegarde/quarantaine **non exclus par `tsconfig.json`** (son `exclude` ne couvrait
   que `src/_legacy_v1.1`, pas les dossiers `_`-préfixés à la racine). `tsc` compilait
   donc **298 fichiers de snapshot en plus des vrais fichiers `src/`**, y compris une
   copie de `_legacy_v1.1` imbriquée dans le snapshot qui référence des modules qui
   n'existent plus. **Corrigé** : `tsconfig.json` → `exclude` étendu à tous les
   dossiers `_`-préfixés de sauvegarde/audit/livrables présents à la racine (aucun ne
   contient de code source réellement utilisé — vérifié : 0 fichier `.ts/.tsx` dans
   14 des 16 dossiers ajoutés, seuls `_snapshot_pre_fleet_2026-07-26` et
   `_icloud_dups_2026-07-26` en contenaient, à raison de simples copies/doublons).
3. Restait 1 vraie erreur : `CareCard 2.tsx` (TS2322, cf. §0) — exclue explicitement
   (elle et les 4 autres zombies) le temps que Tim la supprime pour de bon côté Mac.

Ce fix `tsconfig.json` est indépendant de mes 6 lots mais **débloque potentiellement
un `next build` qui échouait depuis le 23/07** (déjà documenté par A4) — je le signale
comme la trouvaille la plus importante de cette session côté infra.

---

## Fichiers touchés (chemins absolus, host)

- `.../dream-alpha-app/src/lib/kairos/pipeline.ts` — fix Lot 1 (persist title_poetic)
- `.../dream-alpha-app/src/lib/forest-retrieval.ts` — fix Lot 3 (fallback T2 role leak)
- `.../dream-alpha-app/tsconfig.json` — exclude snapshot/quarantaine + 5 zombies
- `.../dream-alpha-app/vercel.json` — +2 entrées `functions` (demande A1, transcribe*)
- `.../dream-alpha-app/supabase-migrations/2026-07-*.sql` (11 fichiers) — entêtes corrigées
- `.../dream-alpha-app/PATCH-PAGE-TSX-A5.md` — demande à A8 (PROTO_CATALOG)
- Supabase (`rtrkxzcyblgonwgfzovj`) : migration `dream_forest_books_add_internal_only_role`
  appliquée ; UPDATE ciblé 3 lignes `dream_forest_books` ; UPDATE `kairos.title` × 11 ;
  UPDATE `pipeline.ts` (code, pas SQL)

## Ce qui attend Tim

1. Supprimer localement (Mac, pas Cowork) les 5 fichiers zombies (§0), puis nettoyer
   `tsconfig.json` → `exclude` des 5 lignes correspondantes.
2. Décider quoi faire du kairos sans titre restant (contenu sensible, §Lot 1).
3. Go/no-go traduction contes EN (Lot 5) — recommandation Opus + relecture.
4. Confirmer si `circle.*` (schéma) appartient à cercles.infuse.earth (Lot 6) → sinon
   plan de drop après backup.
5. Whitelist `transcript_verified` dans le PATCH de `kairos/[id]/route.ts` (signalé,
   territoire A3).
6. Cron `/api/mvp/repair-capture-audio` (demande A1) — route pas encore créée, à
   ajouter dans `vercel.json` une fois livrée (je n'ai ajouté que les 2 `maxDuration`
   demandées, celles-là non conditionnelles).
7. Lot dédié possible sur les routes API orphelines (Lot 4, liste non-dynamique fournie).
