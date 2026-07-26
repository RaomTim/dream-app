# 3_TECHNICAL.md — Dream App INFUSE

**Document canonique de LA RECONSTRUCTION.**
Architecture, DB, API, code, pipelines, deploy, privacy-by-architecture, scaling planétaire.

> Si Tim disparaît demain, tout dev compétent (humain ou IA codeuse) doit pouvoir reconstruire Dream App from scratch avec ce document, plus le repo, plus les credentials Supabase/Vercel.

---

> **Mis à jour 2026-04-24 soir** avec : moteur de résonance 4 vecteurs spécialisés + graph layer Postgres + 16 types de pattern echoing (vs 9), pipeline d'extraction CALIBRÉ 16 dimensions (vs 5) avec inhibition rules par kairos_type, workflow synthèse 6 tiers (Big Dream / Pattern Rich / Standard / Somatic Delicate / Image Tending / Reverie), schemas Cercles V1 (spontané + intentionnel) + Anima Mundi V1 (météo + annales + polyphonie) + Couche d'apprentissage personnelle (user_meaning_layer, validations, annotations) + Persistance zero-perte 4 couches. **Refonte du moteur de résonance AVANT launch publique décidée par Tim** (sections §35–§42 ci-dessous).

---

## §0 — Avant-propos

Dream App est l'organe quotidien d'INFUSE. Vision Tim 2026-04-24 : application **mondiale** pour l'émergence d'une Dream Society planétaire — pas un sanctuaire de niche pour 1 000 personnes. L'architecture doit pouvoir scaler jusqu'à des centaines de millions d'humains tout en respectant une **privacy-by-architecture** absolue (zero-knowledge, pas de Lat/Long, k-anonymity stricte, EXIF strip).

Deux contraintes co-existent en permanence :

1. **Ce qui existe déjà et tourne en prod** (`dream-alpha-bice.vercel.app`) — tables `dreams`, `conversations`, `circles`, pipeline 3 passes Haiku→Sonnet→Embedding, RPC `match_forest_chunks`, Bearer auth Tier 2 shippé 2026-04-23. Ce code n'est **jamais** jeté.
2. **Ce qui doit naître** — table `kairos` comme primitive unifiée, journal de vie comme substrat central, schema invariant V1 sans Lat/Long, RLS Tier 3 surgical, zero-knowledge encryption client-side. Greffé sur l'existant, pas en rupture.

Le projet Supabase `rtrkxzcyblgonwgfzovj` est **mutualisé** entre Forêt App, Dream App, infrastructure ambassadeurs, plénières. Toute migration touche un seul project_id mais doit rester **chirurgicale** sur les tables Dream pour ne pas casser les autres apps.

---

## §1 — Stack

### §1.1 Next.js 14 App Router

- `next@^14.2.0`, `react@^18.3.0`, TypeScript 5.5
- **App Router** (`src/app/`) — serveur par défaut, `'use client'` opt-in
- **Server Components** pour les pages, **Route Handlers** (`src/app/api/*/route.ts`) pour les endpoints
- `src/components/` — composants client (DreamChat, AuthScreen, VoiceRecorder, ModeSelector, AuthProvider, DreamList, dream/ui, dream/screens)
- `src/lib/` — code partagé (auth, supabase, ai-router, forest-retrieval, sse-client, api-client, i18n, dream/protocols, dream/tokens, dream/theme-provider, dream/useVoiceRecorder)
- `src/prompts/` — system prompts versionnés (dream-alpha-system.ts)
- `src/styles/`, Tailwind CSS 3.4
- `src/types/` — types TS partagés

### §1.2 Vercel — deploy `npx vercel --prod` uniquement

> ⚠️ **Section partiellement legacy (avant 25/04/26)** — la liste `maxDuration` ci-dessous référence les routes `/api/dreams/extract`, `/api/dreams/extract-deep`, `/api/dreams/embed` qui sont remplacées en V1.2 par le **pipeline 8 phases async sur `kairos`** (cf. §38, §47, §48). Ces routes legacy restent câblées pour la table `dreams` archivée mais ne sont plus l'orchestration active. Conservée pour traçabilité.

- **Aucun git push, jamais.** Tim ne fait pas push CI/CD. Tous les deploys passent par `npx vercel --prod` directement depuis `dream-alpha-app/` (cf. `feedback_deploy_vercel_only.md`).
- Région Vercel : auto (edge global), serverless functions Node.js
- `maxDuration` par route :
  - `/api/dreams/extract` : 60 s
  - `/api/dreams/extract-deep` : 45 s
  - `/api/dreams/embed` : 15 s
  - `/api/echoes`, `/api/oracle-corps`, `/api/figures`, `/api/chat` : 30–60 s
- **Streaming SSE** activé via header `X-Accel-Buffering: no` (cf. `/api/chat/route.ts`).

### §1.3 Supabase

- Project ID : `rtrkxzcyblgonwgfzovj` (cf. `reference_supabase_forest_credentials.md`)
- URL : `https://rtrkxzcyblgonwgfzovj.supabase.co`
- Postgres 15 + extensions : `uuid-ossp`, `vector` (pgvector), `pg_net` (HTTP côté DB pour pipelines Forêt)
- Auth Supabase native (email/password) — JWT bearer côté client
- Storage Supabase pour audios > 10 Mo (`/api/dreams/import-from-storage`)
- **Service role key** côté serveur uniquement (`SUPABASE_SERVICE_ROLE_KEY`) — bypass RLS pour les routes
- **Anon key** côté client + côté serveur pour `getUser(token)` (vérification bearer)

### §1.4 Modèles IA

- **Anthropic** (`@anthropic-ai/sdk@^0.30.0`) avec `beta.promptCaching.messages` pour réduire le coût de 90 % sur les system prompts longs :
  - `claude-haiku-4-5-20251001` — Passe 1 extraction (titre, mood, entités), Oracle extraction
  - `claude-sonnet-4-6` — Passe 2 deep extraction, chat, synthèses (échos, figures, body), patterns
  - `claude-opus-4-6` — exploration profonde uniquement (`deepExploration`). PAS pour CONTE (cf. §5.4).
- **OpenAI** (`openai@^4.60.0`) :
  - `text-embedding-3-small` — 1536 dims, multilingue natif (FR/EN/ES dans le même espace)
  - `gpt-4o-transcribe` — transcription voix (Whisper successor), `language: 'fr'`

### §1.5 Capacitor (planifié, post-Apple Dev approval)

- Wrap natif iOS + Android sur le même Next.js code
- DUNS 282628520 obtenu 2026-04-19 (cf. `project_duns_apple_dev.md`)
- À l'install : `npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android`
- `npx cap init "Dream" "earth.infuse.dream"` puis `npx cap add ios && npx cap add android`
- `next.config.js` doit exporter en static (`output: 'export'`) pour Capacitor → adapter le code serveur en endpoints dépendants d'une URL Vercel (le wrap natif appelle l'API Vercel à distance, le client est statique)
- Tant que pas wrappé : PWA via "Ajouter à l'écran d'accueil" sur Safari iOS

### §1.6 ADMIN_EMAILS allowlist

- Variable env `ADMIN_EMAILS` = liste CSV (`gestion@infuse.earth,timote@…`)
- Utilisée pour : push humain admin fast-path (Big Dreams pré-seuil), accès dashboards patterns, opérations de maintenance
- `profiles.is_admin` boolean miroir DB pour les checks RLS

---

## §2 — Tables Supabase critiques (état actuel + cible V1)

État réel observé sur `rtrkxzcyblgonwgfzovj` au 2026-04-24. Tables marquées **NEW** = à créer pour V1 selon vision.

### §2.1 `dreams` (existante, 38 colonnes)

> ⚠️ **Section partiellement legacy (avant 25/04/26)** — depuis la migration `20260425_120100_kairos_substrate.sql` (D1 Tim 25/04 : reset accepté, 13 rêves perso archivés), la table active est **`kairos`** (cf. §47 + §35.2). La table `dreams` reste en lecture pour archive ; toute nouvelle écriture passe par `kairos` (4 vecteurs spécialisés + 16 scalars + statuts révisables). Conservée pour traçabilité du schéma legacy 38 colonnes.

Source de vérité actuelle de toute entrée onirique. À conserver en l'état le temps de la migration vers `kairos` (§2.2) — éventuellement renommée en `kairos` plus tard, ou garder en miroir.

| Colonne | Type | Notes |
|---|---|---|
| `id` | uuid PK, default `uuid_generate_v4()` | |
| `user_id` | text, default `'alpha-tester-1'` | **DEFAULT À RETIRER en migration cleanup** — vestige solo, dangereux post-RLS. Devient `uuid` not null référencé `auth.users(id)`. |
| `title` | text | rempli par Haiku ou Sonnet, jamais écrasé si déjà présent |
| `raw_text` | text NOT NULL | contenu brut |
| `audio_url` | text | si voice |
| `source` | text default `'text'` | check `('text','voice','transcription','oracle','journal')` |
| `entry_type` | text default `'dream'` | check `('dream','day','oracle','tale','forest')` — devient `kairos.type` enrichi en V1 |
| `oracle_data` | jsonb | tirage cartes/positions/deck pour entrées oracle |
| `dream_date` | date default `current_date` | |
| `mood` | text | felt sense global |
| `tags` | text[] default `'{}'` | |
| `notes` | text | annotations user post-conversation |
| `entities` | jsonb default `'{}'` | sortie Passe 1 Haiku |
| `patterns` | jsonb default `'{}'` | détection Sonnet |
| `prophetic_suspect` | boolean default false | flag historique, remplacé par `prophetic_status` |
| `prophetic_status` | text default `'dormant'` | `dormant` → `awakened` quand un écho s'allume |
| `embedding` | vector(1536) | OpenAI text-embedding-3-small |
| `archetypal_process` | text | descent / threshold-crossing / shadow-encounter / death-rebirth / coniunctio / call / return-with-boon / flight / pursuit / transformation / initiation / dissolution |
| `archetypal_trajectory` | text | ascending / descending / cyclical / open / spiral |
| `dream_asks` | text | ce que le rêve demande, 1-2 phrases |
| `soul_wish` | text | vœu profond — **NE JAMAIS exposer en collectif** (cf. commentaire `collective_optin`) |
| `numinosity` | int | 1-5, von Franz |
| `intensity_score` | real | 0-1, densité sensorielle + charge émotionnelle |
| `root_dream_patterns` | text[] | flight, water, teeth_falling, pursuit, nudity, death_rebirth, house_unknown_rooms, falling, exam_unprepared, animal_encounter |
| `figure_types` | jsonb | `[{name, type, confidence, recurring_signal, description}]` (Seth backend, max 5) |
| `body_symbolism` | jsonb | `{zones, polarity, message, present}` |
| `framework_level` | text default `'unknown'` | F1 (mundane/linéaire) ou F2 (onirique pur, Seth) |
| `double_dream` | boolean default false | rêve dans le rêve / lucidité / changement de couche |
| `somatic_location` | text | zone corporelle explicite |
| `honoring_action` | text | engagement intérieur (pas tracking — design D-015) |
| `honoring_status` | text | |
| `honoring_note` | text | |
| `forest_sources` | jsonb | `[{book_id, book_title, book_author, page_start, page_end, chunk_index, similarity}]` — traçabilité chunks Sonnet (migration `2026-04-20-dreams-forest-sources.sql`) |
| `collective_optin` | boolean NOT NULL default false | fail-closed pour `/api/dreams/collective` (migration `20260420_add_collective_optin.sql`) |
| `source_filename` | text | nom de fichier d'origine si import |
| `created_at`, `updated_at` | timestamptz default `now()` | |
| `fts` | tsvector generated | full-text search FR sur title + raw_text |

**Index** :
```sql
idx_dreams_created_at (created_at desc)
idx_dreams_dream_date (dream_date desc)
idx_dreams_entry_type (entry_type)
idx_dreams_prophetic (prophetic_suspect) WHERE prophetic_suspect = true
idx_dreams_fts (fts GIN)
idx_dreams_collective_optin (collective_optin) WHERE collective_optin = TRUE
-- À ajouter en V1 :
idx_dreams_user_id (user_id) -- requis pour RLS performance
idx_dreams_embedding_hnsw USING hnsw (embedding vector_cosine_ops) -- échos rapides
```

### §2.2 `kairos` — NEW table V1 (substrat unifié des 6 sources de sens)

**Inversion architecturale Tim 2026-04-24** (cf. `project_dream_journal_de_vie_substrat.md`) : le journal de vie n'est PAS un kairos, c'est le **substrat vivant** que les 6 kairos viennent chanter. Les 6 kairos = sources de sens qui éclairent le quotidien :

1. Rêve nocturne
2. Sidewalk oracle (signe diurne)
3. Rêverie éveillée
4. Hypnagogie
5. Synchronicité
6. Frisson somatique

```sql
-- Migration: 20260424_create_kairos_substrate.sql
CREATE TYPE kairos_type AS ENUM (
  'reve_nocturne',
  'sidewalk_oracle',
  'reverie_eveillee',
  'hypnagogie',
  'synchronicite',
  'frisson_somatique'
);

CREATE TABLE kairos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occurred_at timestamptz NOT NULL DEFAULT now(),

  -- Type unifié (remplace dreams.entry_type quand on migrera)
  type kairos_type NOT NULL,

  -- Contenu chiffré client-side (zero-knowledge)
  body_text_ciphertext bytea NOT NULL,            -- AES-GCM, key derived from passphrase
  body_text_iv bytea NOT NULL,                    -- IV par enregistrement
  body_text_preview text,                         -- 200 char max, OPTIONNEL, pour list views — chiffré aussi en V1.5

  -- Toponyme user-defined OPAQUE pour le serveur
  toponym_user_defined_ciphertext bytea,          -- ex: « la cuisine », « le sentier de papa », chiffré
  toponym_iv bytea,
  -- AUCUNE colonne geo_lat / geo_lng / geo_precision / geocoded_address. Jamais.

  -- Champ frisson somatique (zone, intensité subjective)
  somatic_field_ciphertext bytea,
  somatic_field_iv bytea,

  -- Consentement à l'agrégation (default false, fail-closed)
  consent_to_aggregation boolean NOT NULL DEFAULT false,

  -- Lien optionnel au journal de vie (substrat)
  life_journal_entry_id uuid REFERENCES life_journal_entries(id) ON DELETE SET NULL,

  -- Métadonnées non-sensibles (pour analyses serveur — embedding, archetypes)
  -- Calculées après déchiffrement éphémère côté serveur si user a opt-in IA, sinon NULL
  embedding vector(1536),
  archetypal_process text,
  intensity_score real,
  prophetic_status text DEFAULT 'dormant',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_kairos_user_occurred ON kairos(user_id, occurred_at DESC);
CREATE INDEX idx_kairos_type ON kairos(type);
CREATE INDEX idx_kairos_embedding ON kairos USING hnsw (embedding vector_cosine_ops);
CREATE INDEX idx_kairos_consent ON kairos(consent_to_aggregation) WHERE consent_to_aggregation = true;
```

### §2.3 `life_journal_entries` — NEW table V1 (substrat central)

> ⚠️ **Section partiellement legacy (avant 25/04/26)** — le schéma simplifié 8 colonnes (`body_text_ciphertext` + `life_domains` + `triggering_kairos_id`) ci-dessous a été remplacé par le schéma **16 colonnes** appliqué le 25/04 (catégorisation Sonnet auto + 4 vecteurs spécialisés + flags pending + linked_kairos_id + somatic/affective/numinosity scalars). Voir §47 (table des migrations du 25/04) pour la version actuelle, et le fichier SQL sur disque. Conservée pour traçabilité.

```sql
CREATE TABLE life_journal_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date date NOT NULL DEFAULT current_date,

  -- Contenu chiffré client-side
  body_text_ciphertext bytea NOT NULL,
  body_text_iv bytea NOT NULL,

  -- Tags non-sensibles (catégorie large) — choisis dans une enum, pas free text
  life_domains text[] DEFAULT '{}',  -- ex: ['relation','work','health','spiritual','family']

  -- Lien optionnel à un kairos déclencheur
  triggering_kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_life_journal_user_date ON life_journal_entries(user_id, entry_date DESC);
```

Le journal de vie est ce que les kairos viennent **éclairer**. Toute consultation `/api/oracle-quotidien` croise un (ou plusieurs) life_journal_entry avec les kairos pertinents (rêve récent, frisson somatique du jour, synchronicité notable…).

### §2.4 Tables existantes secondaires

**`conversations`** — messages chat liés à un rêve.
- `id uuid`, `dream_id uuid → dreams(id) ON DELETE CASCADE`, `user_id text` (à migrer en uuid), `role text ('user'|'assistant')`, `content text`, `model_used text`, `mode text`, `created_at`
- Index : `idx_conversations_dream_id`

**`personal_forest`** — dictionnaire symbolique récurrent par user.
- `id`, `user_id text`, `name text` (lowercase), `category text` (person/place/object/situation/emotion/animal/plant/threshold/symbol/character/theme/action), `description text`, `occurrence_count int`, `first_seen_at`, `last_seen_at`, `dream_ids uuid[]`, `evolution_notes text`, `associations jsonb`, `created_at`, `updated_at`
- Index : `idx_personal_forest_category`, `idx_personal_forest_name`
- Logique : `updatePersonalForest(client, userId, entities, dreamId)` dans `lib/supabase.ts` — incrémente ou crée

**`circles`** — cercles d'âmes.
- `id uuid`, `name text`, `description text`, `created_by text` (gardien), `invite_code text` (6 hex chars), `max_members int`, `frequency text`, `is_active boolean`, `created_at`, `updated_at`
- Pas de `user_id` direct — RLS via `circle_members`

**`circle_members`** — `id`, `circle_id`, `user_id text`, `role text` (`guardian`|`member`), `display_name text`, `joined_at`

**`circle_sessions`** — `id`, `circle_id`, `started_by text`, `phase text`, `focus_dream_id uuid`, `started_at`, `completed_at`

**`circle_shares`** — `id`, `circle_id`, `session_id`, `user_id text`, `dream_id uuid`, `share_type text`, `content text`, `created_at`

**`tales`** — sous-forêt contes (curated).
- `id uuid`, `title`, `tradition`, `source_book_slug`, `summary`, `full_text`, `motif_tags text[]`, `structural_phase`, `emotional_register`, `figures text[]`, `key_objects text[]`, `embedding vector(1536)`, `ethics_flag text` (`'open'` requis pour user), `created_at`, `updated_at`
- **Règle CONTE 100% sous-forêt** : aucun conte généré IA. `/api/tales/match` fait du score-match sur ce dataset (cf. `feedback_conte_redefinition.md`).

**`forest_books`** — métadonnées 326 livres digérés (mutualisé avec Forêt App).
- `id text`, `title`, `author`, `main_root`, `secondary_roots text[]`, `tags text[]`, `concepts jsonb`, `contradictions jsonb`, `ethical_notes text`, `consultation_count int`, `schema_version int`, `digest_tier1 text`, `digest_tier2 text`, `plenary_compact text`, `plenary_compact_model`, `plenary_compact_tokens`, `plenary_compact_generated_at`, `author_gender`, `author_ethnicity_region`, `tradition_category`, `created_at`

**`forest_chunks`** — ~61 000 chunks embeddings (mutualisé).
- `id bigint`, `book_id text`, `chunk_text text`, `page_start int`, `page_end int`, `chunk_index int`, `word_count int`, `embedding vector(1536)`
- Index HNSW sur `embedding`, B-tree sur `book_id`

**`dream_forest_books`** — sous-ensemble Dream-pertinent (~65 livres).
- `id text`, `book_id text`, `dream_role text` (`protocol`|`archetype`|`tradition`|`interpretation`|`ecology`|`narrative`|`lucid`|`safety`|`depth`), `priority int`, `notes text`, `created_at`

**`forest_retrieval_logs`** — observabilité du retrieval pgvector.
- `id bigint`, `user_id text` (nullable), `app text` (`'dream-alpha'`), `mode text`, `query_preview text` (300 chars max), `fallback_level smallint` (0/1/2), `avg_similarity real`, `chunks_count smallint`, `books_hit text[]`, `roles_requested text[]`, `latency_ms int`, `created_at`

**`master_events`** — collective intelligence (infrastructure préservée, activation post-MVP).
- 25 colonnes : `event_type`, `severity`, `title`, `description`, `converging_processes text[]`, `converging_figures text[]`, `converging_themes text[]`, `converging_moods text[]`, `scope text`, `scope_value text`, `dreamer_count int`, `dream_count int`, `numinous_count int`, `numinous_ratio real`, `signal_strength real`, `window_start`, `window_end`, `status text`, `confirmed_at`, `confirmation_note text`, `raw_data jsonb`, `geographic_breakdown jsonb`, `created_at`

**`collective_digests`** — bulletins 3 niveaux (Signal jour / Bulletin lunaire / Oracle cyclique).
- `id`, `digest_type text`, `lunar_phase text`, `period_start`, `period_end`, `stats jsonb`, `content text`, `forest_consultation jsonb`, `model_used text`, `geographic_signals jsonb`, `created_at`

**`profiles`** — miroir auth.users + segmentation démographique.
- `id uuid` (= auth.uid()), `email`, `display_name`, `avatar_url`, `language`, `is_ambassador`, `ambassador_code`, `commission_rate numeric`, `profile_type`, `status_level`, `woo_coupon_id`, `is_admin boolean`, `metadata jsonb`, `timezone text`, `country text`, `region text`, `birth_year int`, `created_at`, `updated_at`
- Migration 20/04 : ajout `timezone, country, region, birth_year` pour les 3 segments démographiques Oracle (statut rêveur, fuseaux synchrones, phase de vie)

### §2.5 RPC functions

#### `match_forest_chunks(query_embedding, match_count, filter_book_ids, min_similarity)`

Recherche sémantique sur `forest_chunks` (~61 000 chunks) via cosine similarity. Branche dynamiquement entre HNSW (sans filtre, ~100 ms) et bitmap scan (avec filtre, évite la pathologie HNSW qui retourne 0 résultats in-scope quand le filtre est restrictif).

```sql
CREATE OR REPLACE FUNCTION match_forest_chunks(
  query_embedding vector(1536),
  match_count int DEFAULT 8,
  filter_book_ids text[] DEFAULT NULL,
  min_similarity float DEFAULT 0.2
) RETURNS TABLE(...)  -- voir migration 2026-04-20-match-forest-chunks.sql
LANGUAGE plpgsql STABLE AS $$
BEGIN
  IF filter_book_ids IS NULL THEN
    -- HNSW fast path
    RETURN QUERY SELECT ... FROM forest_chunks fc ... ORDER BY fc.embedding <=> query_embedding LIMIT match_count;
  ELSE
    -- CTE MATERIALIZED → force bitmap scan sur idx_chunks_book
    RETURN QUERY WITH filtered AS MATERIALIZED (
      SELECT ... WHERE fc.book_id = ANY(filter_book_ids)
    ) SELECT ... ORDER BY f.dist LIMIT match_count;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION match_forest_chunks TO anon, authenticated, service_role;
```

#### `find_dream_echoes(p_user_id, p_embedding, p_exclude_id, p_match_threshold, p_max_results)`

À écrire (utilisée par `/api/echoes`). Cosine distance sur `dreams.embedding` filtré par `user_id`. Threshold typique 0.35.

#### `update_dream_embedding(p_dream_id, p_embedding)`

Wrapper pour update du type `vector` qui pose souvent problème avec PostgREST. Fallback : `UPDATE dreams SET embedding = jsonb::vector` directement (cf. `/api/dreams/embed/route.ts`).

---

## §3 — Schema kairos invariant V1 (NON-NÉGOCIABLE)

Source : `PLENIERE-OUVERTE-TERRITOIRE-SONGLINES-2026-04-24.md` Conséquence 1+2+11.

### §3.1 Pas de Lat/Long — JAMAIS

Aucune colonne `geo_lat`, `geo_lng`, `geo_precision`, `geocoded_address`, ni en clair, ni chiffrée, ni en V1, ni en V3.

> *"Si user veut géocoder son toponyme pour son usage personnel, uniquement côté client dans son navigateur, avec service tier (OpenStreetMap, jamais Google), serveur reste aveugle."* — Plénière Territoire

### §3.2 Toponyme user-defined opaque

Le toponyme est un **nom relationnel** (« la cuisine », « le sentier de papa », « chez mémé », « la grotte du Garn »), pas une adresse. Il est :
- **chiffré at rest** côté client avant envoi (AES-GCM, clé dérivée de la passphrase user via PBKDF2/Argon2id)
- **opaque** pour le serveur — aucun algo serveur ne tente de le résoudre en POI
- jamais autocomplété depuis Google Places ni équivalent

### §3.3 Champ frisson somatique chiffré

Même traitement que `body_text` et `toponym` — chiffré client-side. Le serveur stocke un blob `bytea`.

### §3.4 `consent_to_aggregation` boolean default false

Fail-closed. L'agrégation collective (master_events, collective_digests) ne peut jamais inclure un kairos sans opt-in explicite, granulaire et révocable.

### §3.5 Cohérence avec `dreams.collective_optin`

Le pattern existe déjà sur `dreams.collective_optin` (migration `20260420_add_collective_optin.sql`). Reproduit à l'identique pour `kairos.consent_to_aggregation`.

---

## §4 — 7 verrous architecturaux territoire

Source : Plénière Territoire Conséquence 4. Tous V1 invariants.

1. **Maille minimale = bioregion** (jamais quartier, jamais ville). L'agrégation ne se fait qu'à l'échelle d'une bio-région choisie explicitement par l'utilisateur (« Méditerranée occidentale », « Bassin amazonien », « Hauts-plateaux d'Asie centrale »). Liste finie, pré-définie, en partenariat avec gardiens locaux (V2+).
2. **N ≥ 100 minimum** pour qu'une agrégation existe. N ≥ 500 pour stats fines. K-anonymity 5 = insuffisant.
3. **Aucune statistique temps réel.** Latence minimum 30 jours, idéalement 90 jours. La vue agrégée est recalculée à la demande, pas snapshotée.
4. **Aucune cartographie comparative entre lieux.** Pas de heatmap, pas de top 10, pas de « les villes qui rêvent le plus ».
5. **Toponyme user-defined opaque** (cf. §3.2).
6. **Pas de "songlines" comme mot.** Appropriation. Termes acceptables : *pulsation*, *voix*, *tisserie*, *hospitalité*, *climat onirique*, *saison du lieu*.
7. **Géoloc = acte chamanique.** Pas une permission iOS qui pop. Un rite d'entrée explicite, conscient, optionnel (Plénière Territoire Conséquence 8).

Implémentation table d'agrégation :

```sql
CREATE TABLE territorial_aggregates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bioregion_id text NOT NULL REFERENCES bioregions(id),  -- liste finie
  computed_at timestamptz NOT NULL,
  window_start date NOT NULL,
  window_end date NOT NULL,
  n_dreamers int NOT NULL CHECK (n_dreamers >= 100),
  -- ne jamais stocker les user_id sources
  -- ne jamais permettre de remonter aux kairos individuels
  payload jsonb NOT NULL  -- agrégats numériques uniquement, pas de raw text
);
```

---

## §5 — Pipelines IA

### §5.1 Pipeline 3 passes Haiku → Sonnet → Embedding (SHIPPÉ)

Chemin canonique d'un nouveau rêve/entrée :

```
POST /api/dreams        → insert dans dreams (user_id Bearer)
POST /api/dreams/extract → orchestrateur synchrone (~6-8s)
   ├─ PASSE 1 : Haiku extract → title, mood, dream_date, entities
   │            updatePersonalForest(entities) en parallèle
   └─ runDeepPipeline (Promise.allSettled)
       ├─ PASSE 2 : POST /api/dreams/extract-deep
       │            Sonnet + Forêt FIRST (8 chunks, 41 livres dream-pertinents)
       │            → archetypal_process, dream_asks, figure_types,
       │              body_symbolism, root_dream_patterns, intensity_score,
       │              framework_level, double_dream, prophetic_signals,
       │              forest_sources (traçabilité)
       └─ PASSE 3 : POST /api/dreams/embed
                    OpenAI text-embedding-3-small sur (title + raw_text +
                    archetypal_process + dream_asks + soul_wish)
                    → dreams.embedding (vector 1536)
```

**Pourquoi synchrone** : le pattern fire-and-forget précédent était tué par Vercel avant completion → 11 rêves orphelins sans embedding. Le synchrone dure ~6-8 s, présenté à l'UX comme « je lis ton rêve… » (latence rituelle assumée, Tarkovsky).

**Coûts** : Haiku ~$0.001 + Sonnet ~$0.005-0.01 + embedding ~$0.00002 = **~$0.01 / entrée** all-in.

### §5.2 Workflow Forêt FIRST universel

Source : `feedback_digestion_pipeline_must_embed.md` + Plénière Territoire.

**Toute consultation IA non-triviale** consulte d'abord la Forêt :
- Oracle Corps : `/api/oracle-corps?synthesis=true` → query Forêt mode `body` puis Sonnet
- Échos : `/api/echoes?synthesis=true` → query Forêt mode `day` puis Sonnet
- Figures : `/api/figures?synthesis=true` → query Forêt mode `dream` puis Sonnet
- Chat : injection `forestContext` selon `mode` du chat
- Extract-deep : injection 8 chunks pour Sonnet

**MODE_TO_ROLES** (`lib/forest-retrieval.ts`) :

```ts
dream   → ['protocol','interpretation','archetype','safety']
day     → ['interpretation','depth','ecology']
oracle  → ['archetype','tradition','narrative']
tale    → ['narrative','tradition','archetype','ecology']
ritual  → ['protocol','lucid','tradition','safety']
reentry → ['protocol','interpretation','lucid','safety']
body    → ['interpretation','ecology','safety']
```

### §5.3 Fallback retrieval 3 tours

`queryForestForModeDetailed()` :
- **T1** scope strict du mode (~10-20 livres). Si `chunks ≥ 4` ET `avg_sim ≥ 0.35` → retour.
- **T2** Dream Forest entière (~65 livres tous rôles). Même règle.
- **T3** tous les ~326 livres Forest. Best effort.

Chaque retrieval est loggé dans `forest_retrieval_logs` (fire-and-forget) avec `fallback_level`, `avg_similarity`, `latency_ms`.

### §5.4 Voix absorbée, jamais bibliographie

`FOREST_ABSORB_LABEL` (`lib/ai-router.ts`) — règle absolue : Sonnet/Opus reçoit les chunks Forêt mais ne les cite **jamais nommément**. Pas de « selon Hillman », pas de « page 142 », pas de marqueurs `[GENDLIN]`. Profondeur dans le tissu, source invisible. Les sources vivent en backend (`dreams.forest_sources`) et peuvent être affichées via toggle UI.

> *« Synthèse = ce qui a mangé ces pages. Jamais bibliographie. »* — Tim 2026-04-20

### §5.5 CONTE = sous-forêt contes réels uniquement

`generateTale()` dans `ai-router.ts` est un **stub qui throw** :

```ts
throw new Error('generateTale is deprecated — CONTE must score-match real tales from tales table. Use /api/tales/match instead.')
```

Tout consommateur doit appeler `/api/tales/match` (POST avec `dreamId` + `context` → contes scorés depuis `tales` WHERE `ethics_flag='open'`).

### §5.6 Anthropic prompt caching

Tous les system prompts longs (chat, extract-deep) sont marqués `cache_control: { type: 'ephemeral' }` (`@anthropic-ai/sdk/resources/beta/prompt-caching/messages`) → coût input divisé par 10 sur les 5 minutes suivantes.

### §5.7 Streaming SSE

`/api/chat` retourne un SSE stream :

```ts
data: {"type":"chunk","content":"..."}\n\n
data: {"type":"chunk","content":"..."}\n\n
data: {"type":"done","metadata":{entities,patterns,oracleData}}\n\n
data: {"type":"error","message":"..."}\n\n
```

Headers : `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `X-Accel-Buffering: no` (essentiel pour Vercel).

Côté client : `lib/sse-client.ts` → `streamSSE(url, init)` → async generator typé.

### §5.8 Parallélisation Passe 2 + Passe 3

`runDeepPipeline()` lance les deux fetch en `Promise.allSettled` → ~300 ms gagnés sur le total.

---

## §6 — 7 dimensions vectorielles (BACKEND uniquement)

Justification : 7 angles morts du keyword matching (Seth modèle 11 livres).

| ID | Dimension | Use case |
|---|---|---|
| D1 | Logique associative multilingue | incendie ≈ noyade si même charge |
| D2 | Échos inverses | fuite ↔ poursuite, perte ↔ don |
| D3 | Échos prophétiques temporels | rêve ancien s'allume face à un jour récent |
| D4 | Échos de complétion | une figure attend dialogue depuis 6 mois |
| D5 | Root dreams (patterns universels) | flight, water, teeth_falling, falling… |
| D6 | Charge / intensité | numinosity ≥ 4 pondéré différemment |
| D7 | Multilingue | FR/EN/ES dans le même espace 1536 dims |

**Règle P-Zéro** : ces 7 dimensions ne sont JAMAIS visibles côté user. Pas de « swipe entre 7 plans », pas de score cosine 0.87 affiché. L'IA les utilise pour générer ses suggestions ; le user voit « voici une résonance qui s'allume », point.

Implémentation : tout passe par l'embedding 1536D unique (`dreams.embedding`) + post-traitement applicatif (cf. `/api/echoes/route.ts` pour la logique d'inversion archétypale).

---

## §7 — 6 figures Seth (BACKEND uniquement)

Stockées dans `dreams.figure_types jsonb` :

```jsonc
[
  {
    "name": "la femme au châle",
    "type": "probable_self|counterpart|entity_fragment|consciousness_cousin|post_mortem|inner_ego_projection|archetypal|unknown",
    "confidence": 0.7,
    "recurring_signal": false,
    "description": "brève explication"
  }
]
```

Max 5 figures par rêve. Côté user : « une figure t'attend » / « cette figure est revenue » — jamais la typologie technique exposée. Dialogue figure désactivé par défaut sur rêves marqués intenses, précédé d'un check : *« tu te sens stable et dans ton corps en ce moment ? »* (cf. trauma-safe Pilier 3).

Endpoint : `GET /api/figures?synthesis=true&locale=fr` agrège, calcule co-occurrences (edges entre figures partageant ≥1 rêve), retourne motifs triés par fréquence + `synthesis` Sonnet (200-350 mots, voix absorbée).

---

## §8 — 4 algorithmes Master Events (préservés, activation post-MVP)

Code shippé 20/04 dans Oracle Collectif V2 (cf. `project_dream_app_session_20apr.md`) :

1. **`process_convergence`** — détection de pic d'un même `archetypal_process` chez ≥ N rêveurs sur fenêtre M
2. **`figure_convergence`** — détection de figures nommées partagées (matching fuzzy sur `figure_types[].name`)
3. **`theme_surge`** — surge sur `entities` ou `root_dream_patterns`
4. **`numinous_cluster`** — cluster de rêves avec `numinosity ≥ 4` pondéré (×2.5) ou `≥ 5` (×4) — pondération von Franz

Trigger Forêt Total (cf. §9) :
- Numinosité moyenne `> 4` sur la fenêtre
- Pic processus inhabituel `> +40%` vs baseline
- Convergence massive thème négatif

**Activation reportée post-MVP** mais code et tables conservés (`master_events`, `collective_digests`). Ne jamais supprimer.

---

## §9 — Bulletins collectifs 3 niveaux (préservés, reportés)

Endpoints à câbler (existent partiellement) :

1. **Signal jour** — Opus prompt court daily, 1 bulletin / jour / bioregion
2. **Bulletin lunaire** — Opus moyen, à chaque phase lunaire, enrichi des `concept_nodes` Forêt
3. **Oracle cyclique** — Opus TOTAL avec Forêt Total, déclenché par `numinous_cluster` ou trigger §8

Stockage : `collective_digests` (table existante). `lunar_phase`, `digest_type`, `forest_consultation jsonb` (chunks utilisés), `geographic_signals jsonb`, `model_used text`.

---

## §10 — Architecture trauma-safe (substrat, 7 piliers)

Source : `PLENIERE-OUVERTE-TRAUMA-SAFE-2026-04-24.md` section 6. **Pas un module séparé**, un substrat qui irrigue toute l'app.

1. **Pilier 1 — Ancrage avant capture** (toujours, 30s, skippable post-régulation). Composant `<SomaticAnchor />` à insérer avant tout flux de capture (rêve, kairos, journal).
2. **Pilier 2 — Posture par défaut = témoin, pas oracle.** Tous les system prompts portent cette consigne (cf. cohérence Inversion Oraculaire B-002).
3. **Pilier 3 — Fenêtre de tolérance partout.** Bouton stop universel (`<EmergencyExit />`), portes pas escaliers (transitions douces, jamais lock-in).
4. **Pilier 4 — Co-régulation.** Voix prosodique (Porges polyvagal), rythme lent, pauses, mention discrète des présences accessibles.
5. **Pilier 5 — Privacy radicale comme acte de soin.** Chiffrement bout-en-bout (cf. §14), mode rêve éphémère (`ephemeral_only: true` → pas d'`embedding`, suppression auto J+1), effacement immédiat sans questionnement, audit annuel public.
6. **Pilier 6 — Détection silencieuse + ajustement silencieux.** Signaux cliniques §11, ajustement posture (température prompt, longueur réponse, proposition pont humain) sans jamais exposer les catégories au user.
7. **Pilier 7 — Sortie vers humain toujours présente** (2 clics max). Footer permanent : « parler à un humain » → `/ressources` (cf. §19).

---

## §11 — Détection signaux cliniques

Source : Plénière Trauma-safe section 3.

Trois catégories, analysées en arrière-plan :

**§11.1 Contenu narratif** — récurrence (≥ 3 occurrences sur 14j d'un même thème terrifiant), terreur sans narrative, impuissance/paralysie/dissociation. Détection via embedding similarity + pattern NLP.

**§11.2 Comportement d'usage** — capture entre 3h-5h du matin (insomnie post-cauchemar), pattern abandon-reprise, alexithymie progressive (vocabulaire émotionnel qui s'appauvrit).

**§11.3 Réponse à l'app** — refus systématique des invitations à explorer, hyper-compliance (clique tout sans intention), dépendance (ouvre l'app > X fois / jour).

**§11.4 Logique de seuil** :
- 1 signal isolé = rien
- Convergence sur 2-3 signaux = ajustement silencieux posture
- Convergence forte + période prolongée = proposition douce de pont vers humain (jamais alarme, jamais diagnostic)

Implémentation : table `clinical_signals` (chiffrée user-side, déchiffrée éphémèrement côté serveur si user opt-in monitoring). **L'app n'expose JAMAIS les catégories au user.**

---

## §12 — Détection saturation anti-paranoïa

- Détecteur : `> X kairos/jour pendant > Y jours` → mode « monde silencieux » opt-in 7 jours (l'app cesse de proposer des résonances, journal-only)
- Alerte mots-déclencheurs (« tout le monde me veut du mal », « le système me parle ») → message court non-pathologisant + pont humain proposé
- Refus dur de tout prompt qui pourrait dériver en « tu es spécial » / « tu es l'élu »

---

## §13 — Sécurité (4 tiers — DREAM-BREACH-REMEDIATION-PLAN)

Contexte : 14 routes API sans scoping `user_id` détectées 2026-04-20 (BUG-2 brèche P0 : `/api/dreams/collective` exposait tous les rêves de tous les users sans opt-in). Plan 4 tiers :

### §13.1 Tier 1 — Hotfix code (FAIT)

`user_id` obligatoire dans chaque query `dreams`. Plus de fallback `'alpha-tester-1'`. `collective_optin` boolean fail-closed.

### §13.2 Tier 2 — Bearer auth (FAIT 2026-04-23)

`lib/auth-server.ts` :

```ts
export async function requireAuth(req: NextRequest, body?: any): Promise<AuthOk | AuthFail> {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim()
    const supabase = createClient(URL, ANON_KEY, { auth: { persistSession: false } })
    const { data, error } = await supabase.auth.getUser(token)
    if (!error && data?.user?.id) return { userId: data.user.id, via: 'bearer' }
    return { error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }) }
  }
  // Fallback legacy temporaire — flag LEGACY_FALLBACK_ENABLED
  if (LEGACY_FALLBACK_ENABLED) { ... }
  return { error: NextResponse.json({ error: 'Authentication required' }, { status: 401 }) }
}
```

Côté client : `lib/api-client.ts → authFetch()` injecte `Authorization: Bearer <session.access_token>` automatiquement.

**Migration en cours** : flipper `LEGACY_FALLBACK_ENABLED = false` une fois zéro `[auth-server] LEGACY_AUTH used` dans les logs Vercel.

### §13.3 Tier 3 — RLS Supabase (planifié, condition launch)

Migration prête : `supabase/migrations/20260420_120000_enable_rls.sql`. Active RLS sur **uniquement les tables Dream App** (chirurgical, le projet est mutualisé) :

- `dreams` — `auth.uid() = user_id` (select/insert/update/delete own) + `dreams_select_collective_optin` (select WHERE `collective_optin = true AND auth.uid() IS NOT NULL`)
- `conversations` — via subquery EXISTS dreams.user_id
- `personal_forest` — own
- `circles` — visible aux membres via `circle_members`
- `circle_members` — visible aux co-membres
- `circle_sessions` — visible aux membres
- `circle_shares` — visible aux membres
- `tales` — `auth.uid() IS NOT NULL AND ethics_flag = 'open'`
- `forest_books` — public read
- `dream_forest_books` — public read
- `forest_chunks` — `auth.uid() IS NOT NULL`
- `forest_retrieval_logs` — own
- `profiles` — own
- `master_events` — `auth.uid() IS NOT NULL`

**Condition deploy RLS** : avoir flippé `LEGACY_FALLBACK_ENABLED=false` ET vérifié zéro orphan dans le sanity-check SQL en bas de migration. Sinon les rêves orphelins (user_id NULL ou pointant vers un user supprimé) deviennent invisibles définitivement.

### §13.4 Tier 4 — rate-limit + audit logs + security headers + tests

- Rate-limit : middleware Vercel Edge ou `@upstash/ratelimit` (10 req/s par IP, 60 req/min sur `/api/transcribe`)
- Audit logs : table `audit_logs(user_id, route, method, status, latency_ms, ip_hash, ts)`
- Security headers (`next.config.js`) : `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=()`, CSP stricte
- Tests non-régression : Playwright suite qui rejoue toutes les brèches connues

**Condition launch publique : Tier 2 + Tier 3 obligatoires.**

---

## §14 — Privacy by architecture (pas by policy)

### §14.1 Zero-knowledge encryption client-side

Tout contenu sensible (`body_text`, `toponym_user_defined`, `somatic_field`) est chiffré **côté client** avant envoi. Le serveur stocke des `bytea`. Il **ne peut pas** lire, même sous mandat.

```ts
// Clé dérivée de la passphrase (jamais transmise)
const masterKey = await deriveKey(passphrase, salt, { iterations: 600_000, hash: 'SHA-256' })
const iv = crypto.getRandomValues(new Uint8Array(12))
const ciphertext = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv },
  masterKey,
  new TextEncoder().encode(rawText)
)
// → POST /api/kairos { body_text_ciphertext, body_text_iv }
```

Conséquences :
- L'IA ne peut traiter le contenu qu'**en éphémère** côté serveur (déchiffrement avec une clé temporaire `wrapped_key` envoyée par le client lors de l'opt-in IA pour cette entrée)
- Embeddings et métadonnées archétypales calculés au moment de l'opt-in IA, puis stockés
- Le user peut révoquer l'opt-in IA → l'embedding est wipé, l'archétype reste (déjà calculé) ou est wipé selon le palier choisi

### §14.2 EXIF strip systématique

Tout audio uploadé (transcription voice) ou image (future feature « captures sensorielles ») passe par un strip metadata serveur **avant** stockage Supabase Storage :

```ts
// /api/transcribe — exemple voice
const audioBuffer = await audioFile.arrayBuffer()
const stripped = await stripAudioMetadata(audioBuffer)  // ffmpeg -map_metadata -1
```

Pour images : `sharp().withMetadata({}).toBuffer()`.

### §14.3 K-anonymity stricte

Toute agrégation collective (`master_events`, `collective_digests`, `territorial_aggregates`) a `dreamer_count >= 100` (jamais 5). Vérifié en check constraint (`CHECK (n_dreamers >= 100)`).

### §14.4 Aucun analytics tiers sur le contenu

Sentry, PostHog, Mixpanel, GA4 : autorisés uniquement sur **erreurs techniques** et **événements UX anonymes** (navigation, durée, crashes). **Jamais de body_text** dans un payload externe. `lib/sentry.ts` (à créer) maintient une `denylist` de paths.

### §14.5 Politique de retention

- User peut effacer son archive entière à tout moment (RGPD + acte rituel)
- Aucune copie « anonymisée » conservée après effacement
- Backups chiffrés avec la passphrase user, irrécupérables sans elle

### §14.6 Politique d'export

- Export RGPD côté client : déchiffrement local complet, dump JSON
- Aucune export serveur vers tiers (Facebook SDK, Mixpanel, Sentry payload, etc.) ne contient de body_text

---

## §15 — Streaming SSE (latence rituelle assumée)

Pas de spinner « loading… ». Le streaming SSE révèle le texte au rythme où il est généré (Sonnet ~30 tokens/sec), ce qui pose un cadre **temporel rituel** (Tarkovsky) au lieu d'imposer la vitesse fast-food.

Côté UX :
- Pendant `extract` 6-8s : message « je lis ton rêve… » + animation discrète
- Pendant chat streaming : texte qui apparaît mot par mot
- Pendant synthesis (`?synthesis=true` sur echoes/figures/oracle-corps) : skeleton + révélation au bout de ~3-5s

---

## §16 — Intégration Forêt (326 livres digérés)

### §16.1 Sources

- 326 livres total dans `forest_books` (mutualisé Forêt App)
- ~65 livres dans `dream_forest_books` (sous-ensemble Dream-pertinent)
- ~61 000 chunks dans `forest_chunks` avec embeddings 1536D

### §16.2 Pipeline digestion (côté Forêt App, mais consommé par Dream App)

```
PDF/EPUB → upload Supabase Storage
        → digest Tier 1 canonical (Opus) → forest_books.digest_tier1
        → digest Tier 2 INFUSE translation (Opus) → forest_books.digest_tier2
        → chunking (~500 tokens) → forest_chunks
        → embedding (text-embedding-3-small) → forest_chunks.embedding
        → status full_green
```

**Règle absolue** (`feedback_digestion_pipeline_must_embed.md`) : aucun livre `chunked only` sans embedding. Crée des orphelins invisibles à l'Oracle Corps.

### §16.3 `lib/forest-retrieval.ts` — point d'entrée Dream

```ts
// Pour les routes synthesis
const forestContext = await queryForestForMode(supabase, queryText, mode, 8)
// Pour extract-deep (avec traçabilité)
const chunks = await queryForestChunks(supabase, dream.raw_text, {
  bookIds: await getDreamForestBookIds(supabase, ['protocol','interpretation','archetype','safety','depth']),
  limit: 8, minSimilarity: 0.25, raw: true,
}) as ForestChunkMatch[]
```

### §16.4 Forest API v13 (`/retrieve` + prefer-embedded)

Edge Function externe (Forêt App) — Dream App peut soit :
- appeler le RPC SQL direct (`match_forest_chunks`) — actuel, pas de saut réseau supplémentaire
- appeler l'EF `/retrieve` v13 (cf. `project_forest_api_v13.md`) — utile pour les futures couches Mycelium

---

## §17 — Architecture admin (push humain fast-path)

Big Dream workflow — 2 voies de push :

1. **Voie IA auto** : seuil momentum élevé déclenche notification user
2. **Voie admin fast-path humain** (`/admin/dashboard`) : Tim voit les patterns émergentes AVANT le seuil IA, peut faire un push manuel

Dashboard admin (gated par `profiles.is_admin = true`) :
- Vue patterns pré-seuil (rêves intenses des 7 derniers jours, convergences faibles, figures émergentes)
- Bouton « push to dreamer » → notification + message templaté
- Vue saturation user (signaux cliniques §11)

---

## §18 — Import Hub (RÉVISÉ trauma-safe)

Source : `project_dream_import_hub.md` + Plénière Trauma-safe section 8.4.

### §18.1 4 canaux

1. **Texte brut** — paste manuel
2. **Fichiers** — `.txt`, `.doc`, `.pdf`, exports Notion, Evernote, Google Keep
3. **Vocaux WhatsApp** — upload + Whisper batch (`/api/dreams/import-batch`)
4. **Apps tierces** — DreamJournal, Lucidity, etc. via export JSON

### §18.2 Pipeline batch

`/api/dreams/import-from-storage` ingère depuis Supabase Storage, parse, insert en batch dans `dreams` (toutes en `entry_type='dream'` par défaut, modifiable). ~100 rêves traités en quelques minutes pour ~$1.

### §18.3 Traitement IA différé et opt-in explicite

**Pas d'écho prophétique automatique sur import.** Le user navigue son archive, marque ce qu'il veut explorer, décide quand l'IA peut commencer. Risque retraumatisation massif si tous les vieux rêves sont resservis par échos.

### §18.4 Anti-pattern

« Jour 1 oracle » sur l'import = faux objectif si coût trauma-unsafe. À déplacer vers J+7 minimum, opt-in explicite.

---

## §19 — Pont vers humain V1 minimum (NON-NÉGOCIABLE)

Source : Plénière Trauma-safe Pilier 7 + section 4.

Page `/ressources` (jamais popup) avec 3 niveaux :

1. **Lignes d'écoute / urgence** par pays (filtre selon `profiles.country`)
   - France : 3114 (suicide), 3919 (violences), SOS Amitié 09 72 39 40 50
   - USA : 988 (Suicide & Crisis Lifeline), Crisis Text Line `HOME` to 741741
   - UK : 116 123 (Samaritans)
   - Liste maintenue dans `lib/emergency-resources.ts`

2. **Annuaires existants** trauma-spécialisés
   - SE International (Somatic Experiencing) — `traumahealing.org/practitioner-directory`
   - IFS Institute — `ifs-institute.com/practitioners`
   - EMDR France/Europe — `emdr-france.org/annuaire`
   - AFTD (Analyse Transactionnelle) — `aftd.fr`

3. **Marketplace praticiens vetted** — V2+ via INFUSE

**Quand proposer** : pas immédiatement post-session difficile. Plus tard, moment de calme relatif. Conditions :
- 3+ rêves marqués intenses sur 14 jours
- Pattern récurrent > 3 occurrences
- Mention directe événement trauma + récurrence
- Demande explicite

**Comment** : message court, factuel, non-pathologisant. Jamais alarme.

---

## §20 — Couches démographiques Oracle (3 segments)

Source : `project_dream_app_session_20apr.md`. Migration 20/04 appliquée (`profiles +timezone +country +region +birth_year`).

3 segments validés Tim 20/04 :

1. **Statut rêveur** : `novice` / `intermediaire` / `lucide` / `oneironaut` (enum dans `profiles.metadata.dreamer_status`)
2. **Fuseaux synchrones** : groupement par `timezone` (qui dort en même temps)
3. **Phase de vie** : `adolescence` / `parentalite` / `menopause` / `deuil` / `transition` (enum, choisie au profil — pas calculée depuis `birth_year`)

Utilisé pour : `master_events.scope='demographic'`, segmentation des `collective_digests`, propositions de cercles.

---

## §21 — CGU + audit éthique annuel + assurance

Source : Plénière Trauma-safe section 5.

- **CGU** rédigées par avocat santé mentale + tech (français + anglais)
- **Audit éthique annuel** par tiers indépendant — rapport public
- **Lecture par 3 praticiens trauma** (SE / IFS / Jungien) avant chaque release majeure
- **Assurance RC pro tech** avec extension santé mentale

---

## §22 — Ledger rêveur + restitution 7j

Mécanisme essentiel pour traçabilité trauma-safe.

```sql
CREATE TABLE dreamer_ledger (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ts timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL,             -- 'kairos_captured', 'consented_aggregation', 'opted_in_ai', 'shared_in_circle', 'dream_used_in_master_event'
  resource_type text NOT NULL,
  resource_id uuid,
  metadata jsonb,
  reversible boolean DEFAULT true
);

CREATE INDEX idx_dreamer_ledger_user_ts ON dreamer_ledger(user_id, ts DESC);
```

Restitution sous 7 jours (cron Supabase) : « ton rêve a contribué à ce pattern collectif » avec lien et bouton de retrait rétroactif. Si retrait → contribution wipée des agrégats prochains.

---

## §23 — Variables d'environnement

`.env.local` (jamais commit, gitignore) :

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI (Whisper + embeddings)
OPENAI_API_KEY=sk-...

# Supabase (project rtrkxzcyblgonwgfzovj)
NEXT_PUBLIC_SUPABASE_URL=https://rtrkxzcyblgonwgfzovj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Auth (NextAuth legacy, à retirer post-migration Supabase auth pure)
NEXTAUTH_SECRET=

# Admin allowlist
ADMIN_EMAILS=gestion@infuse.earth

# Dev only
NODE_ENV=development
```

Sur Vercel : Settings → Environment Variables → Production + Preview + Development.

---

## §24 — Deploy

### §24.1 Setup initial

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app/
npm install
cp .env.example .env.local   # remplir les clés
npm run dev                  # http://localhost:3000
```

### §24.2 Deploy production

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app/
npx vercel --prod
```

URL production : `https://dream-alpha-bice.vercel.app/` (cf. `reference_dream_app_url.md`).

### §24.3 Migrations Supabase

Yeshua peut appliquer via MCP :
```
mcp__65f7be16-...__apply_migration({ project_id: 'rtrkxzcyblgonwgfzovj', name: '...', query: '...' })
```

Tim côté CLI si besoin :
```bash
supabase db push --project-ref rtrkxzcyblgonwgfzovj
```

### §24.4 Edge Functions (Forêt API v13)

Tim CLI uniquement (Yeshua via MCP impossible) :
```bash
supabase functions deploy retrieve --project-ref rtrkxzcyblgonwgfzovj
```

Cf. `reference_deploy_paths.md` pour la canonical des paths.

### §24.5 Capacitor (planifié)

```bash
npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "Dream" "earth.infuse.dream"
# Adapter next.config.js → output: 'export' OU pointer vers l'API Vercel distante
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios     # Xcode
npx cap open android # Android Studio
```

---

## §25 — Routes API — récapitulatif complet

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/dreams` | GET | Bearer | List user dreams (pagination, search) |
| `/api/dreams` | POST | Bearer | Create dream (raw_text required) |
| `/api/dreams/[id]` | GET / PUT / DELETE | Bearer | CRUD individuel |
| `/api/dreams/extract` | POST | Bearer | Pipeline 3 passes synchrone (~6-8s) |
| `/api/dreams/extract-deep` | POST | Bearer | Passe 2 (Sonnet + Forêt FIRST) |
| `/api/dreams/embed` | POST | Bearer | Passe 3 (OpenAI 1536D embedding) |
| `/api/dreams/batch-titles` | POST | Bearer | Génération batch titres (Haiku) |
| `/api/dreams/collective` | GET | Bearer | Anonymisé `collective_optin=true` only |
| `/api/dreams/embed` | POST | Bearer | (cf. ci-dessus) |
| `/api/dreams/import-batch` | POST | Bearer | Import multi-rêves text |
| `/api/dreams/import-from-storage` | POST | Bearer | Import depuis Supabase Storage |
| `/api/dreams/lifeline` | GET | Bearer | Timeline « lifeline » du user |
| `/api/dreams/similar` | GET | Bearer | k-NN sur dreams.embedding |
| `/api/echoes` | GET | Bearer | Échos prophétiques 3 phases (vectoriel + archétypal + root) |
| `/api/oracle-corps` | GET | Bearer | Agrégation somatique par zone |
| `/api/figures` | GET | Bearer | Agrégation peuple de rêve + co-occurrences |
| `/api/circles` | GET / POST | Bearer | List / Create cercles |
| `/api/circles/[id]` | GET / PUT / DELETE | Bearer | Gestion cercle |
| `/api/circles/[id]/sessions` | GET / POST | Bearer | Sessions du cercle |
| `/api/circles/[id]/share` | POST | Bearer | Partage rêve dans cercle |
| `/api/circles/[id]/resonances` | GET | Bearer | Résonances cross-dreamer |
| `/api/circles/join` | POST | Bearer | Join via invite_code |
| `/api/tales/match` | POST | Bearer | Score-match contes réels (`tales` WHERE `ethics_flag='open'`) |
| `/api/chat` | POST | Bearer | SSE streaming chat (modes: dream/day/oracle/tale/ritual/reentry/body) |
| `/api/transcribe` | POST | Bearer | Whisper voice → text (max 10MB) |
| `/api/auth/change-password` | POST | Bearer | Change password Supabase auth |

**À créer V1** :
- `POST /api/kairos` — capture kairos (avec ciphertext)
- `GET /api/kairos` — list (déchiffrement client-side)
- `POST /api/life-journal` — capture entry journal de vie
- `GET /api/oracle-quotidien?life_journal_id=...` — orchestration : prend une entrée journal de vie, query les 6 kairos pertinents (rêve récent, frisson, synchronicité…), retourne synthesis Sonnet « voici ce que tes 6 kairos chantent à ce que tu vis »
- `GET /api/territorial/:bioregion_id` — agrégat (avec checks N≥100, latence ≥30j)

---

## §26 — Conventions de code

- **TypeScript strict** (`tsconfig.json` `strict: true`)
- Imports absolus via `@/*` → `src/*` (cf. `tsconfig.json` paths)
- Routes : un fichier `route.ts` par endpoint, `export async function GET/POST`
- **Toujours** : `const auth = await requireAuth(req, body); if ('error' in auth) return auth.error; const { userId } = auth`
- **Toujours** : `createServerClient()` côté serveur (jamais le browser client `supabase` exporté)
- **Toujours** : double filtre `.eq('id', dreamId).eq('user_id', userId)` sur tous les UPDATE
- Errors : `console.error('Route name:', error)` + `NextResponse.json({ error: error.message }, { status: 500 })`
- Pas de `any` dans le code core (sauf jsonb dynamiques inévitables — annoter `// eslint-disable-next-line`)

---

## §27 — Performance

- **Anthropic prompt caching** : tous les system prompts longs marqués `cache_control: { type: 'ephemeral' }` → coût input ÷10 sur 5 min
- **Parallélisation** Passes 2+3 via `Promise.allSettled`
- **HNSW pgvector** sur `forest_chunks.embedding` (sans filtre) + bitmap scan + CTE MATERIALIZED (avec filtre)
- **Edge runtime envisagé** pour `/api/transcribe` et `/api/chat` quand Anthropic SDK sera Edge-compatible
- **ISR / cache** pour pages publiques (landing, /ressources, /about)
- **Image optimization** Next.js (`<Image>`)
- **Code splitting** automatique App Router

---

## §28 — Observabilité

- `forest_retrieval_logs` : déjà en place, log chaque retrieval Forêt (latency, fallback level, books hit)
- À ajouter : `audit_logs` (Tier 4 sécurité)
- Vercel Analytics (anonyme, autorisé) pour navigation
- Pas de Sentry sur le contenu des rêves — uniquement sur erreurs runtime sans payload sensible

---

## §29 — Roadmap migration vers schema kairos V1

Ordre d'exécution non négociable :

1. ✅ Tier 2 Bearer auth (FAIT 2026-04-23)
2. ⏳ Flipper `LEGACY_FALLBACK_ENABLED=false`, redeploy
3. ⏳ Apply `20260420_120000_enable_rls.sql` (Tier 3)
4. 🆕 Créer `life_journal_entries` + `kairos` tables (`20260424_create_kairos_substrate.sql`)
5. 🆕 RLS sur `kairos` et `life_journal_entries` (`auth.uid() = user_id`)
6. 🆕 Implémenter chiffrement client-side (`lib/encryption.ts` — Web Crypto API)
7. 🆕 Endpoints `/api/kairos`, `/api/life-journal`, `/api/oracle-quotidien`
8. 🆕 UI Substrat (Journal de Vie central + 6 Kairos qui chantent)
9. 🆕 Migration progressive : nouveaux rêves → `kairos.type='reve_nocturne'` ; `dreams` reste pour rétrocompat ; vue SQL `dreams_unified` qui UNION les deux
10. 🆕 `dreamer_ledger` + restitution 7j
11. 🆕 Tier 4 sécurité (rate-limit, audit logs, security headers, Playwright tests)
12. 🆕 Apple Dev wrap Capacitor

---

## §30 — Comment reconstruire from scratch

Scénario : Tim disparaît. Un dev compétent (humain ou IA codeuse) reçoit ce document + accès aux secrets.

### Étape 1 — Cloner le code

Le code vit dans `/sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app/`. Si perdu :
- Reconstruire la structure depuis §1.1 + §25
- Stack : `npm init` puis `npm i next@^14.2.0 react@^18.3.0 react-dom@^18.3.0 @supabase/supabase-js@^2.45.0 @anthropic-ai/sdk@^0.30.0 openai@^4.60.0`
- Devs : `npm i -D typescript @types/node @types/react tailwindcss postcss autoprefixer`

### Étape 2 — Recréer Supabase

```bash
# Soit récupérer le projet existant rtrkxzcyblgonwgfzovj
# Soit en créer un nouveau et appliquer dans l'ordre :
psql $DATABASE_URL < supabase-schema.sql
psql $DATABASE_URL < supabase-migrations/2026-04-20-dreams-forest-sources.sql
psql $DATABASE_URL < supabase-migrations/2026-04-20-match-forest-chunks.sql
psql $DATABASE_URL < supabase/migrations/20260420_add_collective_optin.sql
psql $DATABASE_URL < supabase/migrations/20260420_120000_enable_rls.sql
# Puis migrations V1 décrites §29
```

### Étape 3 — Restaurer la Forêt

`forest_books` + `forest_chunks` + `dream_forest_books` proviennent du pipeline Forêt App. Sans eux, Dream App fonctionne en dégradé (pas de chunks, prompts plats). Restaurer depuis backup Supabase ou re-digérer les 326 livres via le pipeline Forêt App (`/sessions/.../foret-app/`).

### Étape 4 — Configurer les credentials

Variables d'env §23. Comptes nécessaires :
- Anthropic (claude.ai/api console)
- OpenAI (platform.openai.com)
- Supabase (déjà existant ou nouveau)
- Vercel (linker le projet : `npx vercel link`)

### Étape 5 — Deploy

```bash
cd dream-alpha-app/
npx vercel --prod
```

### Étape 6 — Vérification end-to-end

- Créer un user via `/auth` → vérifier que `profiles` row existe
- Créer un rêve test → vérifier `dreams` row + Bearer header sur la requête
- Attendre ~8s → vérifier que `dreams.title`, `archetypal_process`, `embedding`, `forest_sources` sont remplis
- `GET /api/echoes?synthesis=true` → vérifier que la synthesis Sonnet revient

### Étape 7 — Activer la suite

Suivre la roadmap §29 dans l'ordre.

---

## §31 — Incohérences détectées entre code actuel et vision actée

À résoudre durant la migration V1 :

1. **`dreams.user_id`** est `text` avec default `'alpha-tester-1'`. Vision V1 : `uuid NOT NULL REFERENCES auth.users(id)`. Migration nécessaire avant RLS Tier 3 — sinon les anciens rêves orphelins deviennent invisibles. Le sanity-check de `20260420_120000_enable_rls.sql` détecte ce cas, doit être exécuté avant le ALTER.
2. **`circles.created_by`, `circle_members.user_id`, `circle_shares.user_id`, `circle_sessions.started_by`** sont tous `text` au lieu de `uuid`. Même migration nécessaire.
3. **Mémoire `project_dream_relational_geolocated_vision.md`** liste `dreams.geo_lat / geo_lng / geo_precision (nullable, optionnels)` comme « structure DB doit être prête dès V1 ». **OBSOLÈTE** : Plénière Territoire 2026-04-24 a tranché — **jamais de Lat/Long, jamais**. Mémoire à marquer obsolete.
4. **`generateTale()`** dans `ai-router.ts` ligne ~169 est un stub qui throw. Vérifier qu'aucun caller actif ne l'invoque (le stub est intentionnel mais visible dans la base de code — laisse trace pour faire surfacer toute régression).
5. **Mode `forest`** retiré de `AppMode` (commentaire `lib/ai-router.ts` ligne 25-26) mais `lib/supabase.ts` ligne 49 a encore `forest: []` dans `roleWeights`. Cohérence à nettoyer.
6. **`dreams.collective_optin`** présent en prod (default false), mais l'opt-in UI n'est pas câblé côté client — donc `/api/dreams/collective` retourne actuellement 0 résultats. C'est le comportement voulu (fail-closed) tant que l'UI n'est pas faite.
7. **`LEGACY_FALLBACK_ENABLED = true`** dans `auth-server.ts` — la route accepte encore `?userId=` query param. À flipper false dès que les logs Vercel ne montrent plus de `[auth-server] LEGACY_AUTH used`. Sans ça, RLS Tier 3 va casser tous les clients pas migrés.
8. **Profil de chiffrement** : aucun chiffrement client-side actuellement. Le contenu des rêves est en clair côté DB. C'est le gap le plus important entre l'état actuel et la vision V1 (zero-knowledge non-négociable Tim 2026-04-24). 1-2 mois de travail focalisé.
9. **Capacitor** : pas encore intégré. Aujourd'hui l'app est PWA-only. Apple Dev en attente d'approbation.

---

## §32 — Risques de scaling à milliards d'humains (réflexion préalable)

Anticiper pour ne pas bloquer la croissance :

- **pgvector HNSW** scale jusqu'à ~10M vecteurs sur Postgres single-node. Au-delà : sharding par `user_id` (partition table) ou migration vers Pinecone/Qdrant managed.
- **Anthropic rate limits** : actuellement Tier 4 ~10k req/min. Au million d'utilisateurs actifs : passer en Bedrock AWS multi-region OU négocier custom enterprise tier.
- **Supabase** : free tier OK pour 500 users actifs. Pro = 8GB DB, ~50k MAU. Au-delà : self-hosted Postgres + auth Supabase OSS, ou migration vers RDS + Cognito.
- **Storage audios** : 1 vocal/jour × 1M users × 30 jours = 30M fichiers. Supabase Storage = $0.021/GB/mois. À ~5MB/audio = 150 TB → ~$3k/mois. Mitigation : transcription puis suppression de l'audio (option par défaut).
- **Coûts LLM** : pipeline 3 passes ~$0.01/rêve. 1M rêves/jour = $10k/jour = $300k/mois. Mitigation : Haiku-only pour Passe 2 sur entrées non opt-in IA Sonnet, batching, embedding cache cross-user pour les rêves quasi-identiques.
- **Privacy + scale** : zero-knowledge devient critique à scale. Sans ça, breach exposing 1M cleartext dreams est juridiquement et éthiquement intenable.

---

## §33 — Checklist finale V1 (avant launch publique)

- [ ] Tier 2 Bearer auth (FAIT)
- [ ] `LEGACY_FALLBACK_ENABLED = false` + redeploy
- [ ] Tier 3 RLS appliqué + sanity check zéro orphan
- [ ] `dreams.user_id` migré en `uuid REFERENCES auth.users(id)`
- [ ] Chiffrement client-side sur `kairos.body_text`, `kairos.toponym`
- [ ] Tables `kairos` + `life_journal_entries` créées + RLS
- [ ] EXIF strip systématique sur uploads audio/image
- [ ] K-anonymity ≥100 vérifié via CHECK constraints sur agrégats
- [ ] Page `/ressources` avec lignes d'urgence par pays
- [ ] CGU avocat santé mentale + tech (FR + EN)
- [ ] Audit éthique annuel programmé
- [ ] Lecture par 3 praticiens trauma (SE / IFS / Jungien)
- [ ] Assurance RC pro tech extension santé mentale
- [ ] Tier 4 : rate-limit, audit_logs, security headers, Playwright suite
- [ ] `dreamer_ledger` + cron restitution 7j
- [ ] `<EmergencyExit />` accessible 2 clics depuis n'importe quelle page
- [ ] `<SomaticAnchor />` sur tous les flux de capture
- [ ] Mode « monde silencieux » opt-in 7j câblé
- [ ] Détection signaux cliniques §11 active (silencieuse)
- [ ] Backup chiffré users avec passphrase exportable
- [ ] Bug `generateTale` callers vérifiés (zéro)
- [ ] Mémoire `project_dream_relational_geolocated_vision.md` marquée obsolète sur la partie geo_lat/lng
- [ ] Domaine choisi (`dreaming.app` vs `dream.infuse.earth`) + DNS
- [ ] Capacitor wrap iOS/Android (post Apple Dev approval)

---

## §34 — Glossaire technique

| Terme | Définition |
|---|---|
| **Kairos** | Source de sens (rêve, signe diurne, rêverie, hypnagogie, synchronicité, frisson somatique) qui chante au journal de vie |
| **Substrat** | Le journal de vie, ce que l'on traverse au quotidien — ce que les 6 kairos viennent éclairer |
| **Forêt FIRST** | Workflow où toute consultation IA non-triviale interroge la Forêt en premier, avant la génération |
| **Voix absorbée** | Sonnet/Opus parle depuis ce qu'il a digéré, sans citer nommément ses sources |
| **CONTE 100% sous-forêt** | Aucun conte généré par IA. Score-match sur `tales` table uniquement |
| **Privacy-by-architecture** | Privacy garantie par la structure même du code/DB, pas par une politique légale |
| **Zero-knowledge** | Le serveur ne peut pas lire le contenu, même sous mandat (chiffrement client-side) |
| **K-anonymity** | Garantie qu'un agrégat ne permet pas de remonter à un individu (N≥100 minimum chez Dream) |
| **Toponyme opaque** | Nom de lieu user-defined chiffré et jamais résolu en coordonnées par le serveur |
| **Bioregion** | Maille minimale d'agrégation territoriale (jamais quartier, jamais ville) |
| **Bearer auth** | Authentication via header `Authorization: Bearer <token>` Supabase JWT (Tier 2) |
| **RLS surgical** | Row Level Security activée uniquement sur les tables Dream App (projet Supabase mutualisé) |
| **Latence rituelle** | Délai assumé côté UX (Tarkovsky), pas spinné, pas masqué |
| **Pont humain** | Sortie permanente vers ressources humaines (lignes d'urgence, praticiens) à 2 clics max |

---

## §35 — Moteur de résonance multi-vecteurs (refonte décidée 2026-04-24)

Source : `_yeshua_synthesis_2026-04-24/SYNTHESE-A-PATTERN-ECHOING.md` + `INVESTIGATION-CALIBRATION-PATTERN-ECHOING.md`. **Décision Tim 2026-04-24 : refonte du moteur de résonance AVANT launch publique.** Le moteur actuel (cosine simple sur `dreams.embedding` 1536D) est plat. Il rate la moitié des résonances vivantes que les maîtres (Jung, von Franz, Moss, Aizenstat, Hopcke, Bachelard, Larsen) savent capter. Sans refonte, Dream App reste un journal augmenté avec recherche par mot-clé.

### §35.1 Pourquoi 4 vecteurs spécialisés (au lieu de 1)

Un vecteur unique = compromis. Il fond sémantique + concept + soma + archétype dans 1536 dims, ce qui dilue chaque couche. Plusieurs vecteurs spécialisés = précision par couche de signification.

| Vecteur | Dim | Source | Use case principal |
|---|---|---|---|
| `embedding_semantic` | 1536 | `text-embedding-3-small` sur texte brut (déjà câblé) | Type 1 résonance directe, multilingue natif (FR/EN/ES…) |
| `embedding_concept` | 1536 | LLM (Sonnet) extrait concepts métaphoriques → embed | Type 2 résonance métaphorique (dragon ≈ client agressif) |
| `embedding_somatic` | 768 | embed sur `somatic_markers` extraits | Type 3 résonance somatique (frisson nuque ↔ frisson nuque) |
| `embedding_archetypal` | 768 | embed sur `archetypal_tags` extraits | Type 4 résonance archétypale (voleur ↔ trickster manager) |

Stockage Postgres + pgvector. Coût : ~6 KB/kairos pour les 4 vecteurs + index HNSW. Négligeable vs valeur.

### §35.2 Migration SQL (vecteurs spécialisés + scalars)

```sql
-- Migration : 20260425_kairos_multi_vector_engine.sql
ALTER TABLE kairos
  ADD COLUMN embedding_concept vector(1536),
  ADD COLUMN embedding_somatic vector(768),
  ADD COLUMN embedding_archetypal vector(768),
  ADD COLUMN numinosity_score float DEFAULT 0,
  ADD COLUMN affective_valence float DEFAULT 0,        -- -1 à +1
  ADD COLUMN affective_intensity float DEFAULT 0,      -- 0 à 1
  ADD COLUMN dominant_emotion text,
  ADD COLUMN somatic_markers jsonb DEFAULT '{}',       -- {zone, intensity, marker_text}
  ADD COLUMN archetypal_tags text[] DEFAULT '{}',
  ADD COLUMN temporal_signature jsonb DEFAULT '{}',    -- {lunar_phase, season, time_of_day, anachronism}
  ADD COLUMN quality_lang text;                        -- ISO langue détectée

CREATE INDEX idx_kairos_emb_concept_hnsw    ON kairos USING hnsw (embedding_concept    vector_cosine_ops);
CREATE INDEX idx_kairos_emb_somatic_hnsw    ON kairos USING hnsw (embedding_somatic    vector_cosine_ops);
CREATE INDEX idx_kairos_emb_archetypal_hnsw ON kairos USING hnsw (embedding_archetypal vector_cosine_ops);
CREATE INDEX idx_kairos_numinosity ON kairos(numinosity_score) WHERE numinosity_score > 0.7;
CREATE INDEX idx_kairos_archetypal_tags ON kairos USING gin(archetypal_tags);
```

Note : champs `figures jsonb`, `motif_tags text[]`, `kairos_type enum`, `prophetic_status` sont déjà présents (cf. §2.2 ou table `dreams` migrée). Si pas encore, les ajouter en même temps.

### §35.3 Champs scalaires + structurés (en plus des vecteurs)

- `numinosity_score` (float 0-1) — composite (cf. §35.6) — Type 8 + pondération échos
- `affective_valence` (float -1 à +1) — pour Type 5 (inversion)
- `affective_intensity` (float 0-1) — pondération du poids dans agrégats
- `dominant_emotion` (text) — tag catégorique
- `figures` (jsonb) — `[{name, type_seth, qualities, action}]` — Type 4, Constellation
- `motif_tags` (text[]) — Type 9 co-occurrences
- `somatic_markers` (jsonb) — `{zones[], polarity, intensity, marker_text}` — Type 3
- `archetypal_tags` (text[]) — Type 4
- `temporal_signature` (jsonb) — `{lunar_phase, season, time_of_day, anachronism}` — Type 7, cycles
- `kairos_type` (enum) — déjà §2.2
- `quality_lang` (text ISO) — multilingue tracking

### §35.4 Graph layer Postgres — `kairos_edges`

pgvector seul = similarity search. Insuffisant pour les Types 6 (cycle évolutif), 9 (co-occurrence constellation) et 15 (turning point) qui nécessitent **relations explicites entre kairos**. Décision Tim 2026-04-24 (vote A3) : **Postgres edges layer V1, pas Neo4j séparé.**

```sql
-- Migration : 20260425_kairos_edges.sql
CREATE TABLE kairos_edges (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kairos_a_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  kairos_b_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  edge_type text NOT NULL CHECK (edge_type IN (
    'resonance_directe',          -- Type 1
    'resonance_metaphorique',     -- Type 2
    'resonance_somatique',        -- Type 3
    'resonance_archetypale',      -- Type 4
    'inverse_mirror',             -- Type 5
    'cycle_step',                 -- Type 6
    'echo_prophetique',           -- Type 7
    'numinous_marking',           -- Type 8 (auto-edge sur kairos seul)
    'co_occurrence_constellation',-- Type 9
    'paire_kairotique_inner_outer',-- Type 10
    'aha_recurrence',             -- Type 11
    'reincidence_moss',           -- Type 12
    'convergence_mystique_collective', -- Type 13 (V2 collectif)
    'somatic_recurrence',         -- Type 14
    'turning_point_narratif',     -- Type 15
    'hypnagogic_seed'             -- Type 16
  )),
  edge_weight float NOT NULL CHECK (edge_weight BETWEEN 0 AND 1),
  detection_metadata jsonb DEFAULT '{}',  -- contient algo, similarity, voix invoquées, fenêtre temporelle
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_edges_a    ON kairos_edges(kairos_a_id);
CREATE INDEX idx_edges_b    ON kairos_edges(kairos_b_id);
CREATE INDEX idx_edges_user ON kairos_edges(user_id);
CREATE INDEX idx_edges_type ON kairos_edges(edge_type);

ALTER TABLE kairos_edges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User reads own edges" ON kairos_edges FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Service writes edges" ON kairos_edges FOR INSERT TO service_role WITH CHECK (true);
```

Edges calculés à l'insertion d'un nouveau kairos (background job, pas latence UX). Garbage collection : edges avec `edge_weight < 0.5` purgés après 90 j (cron) pour contenir la croissance N²-ish.

### §35.5 Les 16 types de pattern echoing (vs 9 initiaux)

Source : `INVESTIGATION-CALIBRATION-PATTERN-ECHOING.md` §5.1. L'investigation des 14 cas (Jung scarabée, von Franz cure, Moss porte rouge, Aizenstat chêne, Hopcke portable, Bachelard feuille, Bulkeley typologie, Mavromatis hypnagogie, Gendlin felt-shift, Larsen mythogem, Taylor groupe, Tara mystical, etc.) a révélé **7 types manquants** dans la typologie initiale.

| # | Type | Détection | Quand allumer |
|---|---|---|---|
| 1 | RÉSONANCE DIRECTE | cosine sur `embedding_semantic` | récurrence ≥ 3 / lune |
| 2 | RÉSONANCE MÉTAPHORIQUE | cosine sur `embedding_concept` | récurrence ≥ 2 + numinosity haute |
| 3 | RÉSONANCE SOMATIQUE | cosine sur `embedding_somatic` + même région | récurrence ≥ 3 |
| 4 | RÉSONANCE ARCHÉTYPALE | cosine sur `embedding_archetypal` + tag exact, **strict intra-tradition** | récurrence ≥ 2 |
| 5 | INVERSE MIRROR | LLM check valence opposée + sémantique haute | présence dans cluster récurrent |
| 6 | CYCLE ÉVOLUTIF | graph traversal séquentiel + LLM transformation check | ≥ 3 apparitions avec différentiel |
| 7 | ÉCHO PROPHÉTIQUE | scan corpus avec différentiel temporel ≥ 30 j + similarity multi-couches | seuil très haut + numinosity haute → chuchotement |
| 8 | SYMBOLE CHAUD / NUMINOSITY SIGNAL | `numinosity_score` > seuil | marquage discret journal |
| 9 | CO-OCCURRENCE CONSTELLATION | graph co-occurrence query | co-occurrence > 60 % sur ≥ 3 instances |
| 10 | PAIRE KAIROTIQUE INNER/OUTER | rêve + sidewalk/note jour < 72 h, similarity multi-couches haute | détection auto background |
| 11 | AHA RECURRENCE | tracking `user_validations.validation` cluster par type d'aha | ≥ 5 aha de même type |
| 12 | REINCIDENCE MOSS | plusieurs sidewalk_oracles ≤ 24 h sur même thème | ≥ 2 dans la fenêtre |
| 13 | CONVERGENCE MYSTIQUE COLLECTIVE | clusters cross-users k-anonymity > 100 | V2 collectif uniquement |
| 14 | SOMATIC RECURRENCE | même `somatic_markers.zone` répété sur N kairos | ≥ 3 occurrences |
| 15 | TURNING POINT NARRATIF | edge rétroactif quand cluster impasse + transformation + cluster nouveau | détection à J+30/90/180 |
| 16 | HYPNAGOGIC SEED | fragment hypnagogique resurgissant en sidewalk/création | détection auto |

**Phasage Tim** : V1 = Types 1, 2, 3, 6, 7, 8, 10, 14 (8 essentiels). V1.5 = 4, 5, 9, 11, 12, 15, 16. V2 = 13 collectif (k-anon 100+).

### §35.6 Algorithme `numinosity_score` — ⚠️ SUPERSÉDÉ, voir §54

Le pseudo-code de pondération à 10 termes écrit le 24/04 n'a jamais été implémenté tel quel.
Ce qui tourne en prod depuis le 26/07 est **déterministe et rejouable** (migrations
`numinosity_deterministic_recompute` + `_backfill_from_persisted_extraction`). Ce qui a
survécu de la spec d'avril, et qui tient toujours :

- **Règle P-Zéro absolue** : `numinosity_score` n'est **JAMAIS affiché au rêveur**. Pas de
  « ce rêve a un score 0,87 ». L'app peut chuchoter « ce rêve me semble important pour toi »
  si le seuil est très haut, ou se taire. Backend uniquement.
- Flag `numinosity_pending` sur les rêves courts portant un objet ou une figure singulière —
  révision rétroactive autorisée (cas du scarabée de Jung).

⚠️ **Mesure du 26/07** : le gate de numinosité ne filtre plus rien — **91 % du corpus le passe.**
Le calibrer est l'un des arbitrages qui attendent Tim.

### §35.7 RPCs à créer / mettre à jour

```sql
-- find_kairos_echoes_multilayer(user_id, kairos_id, weights)
-- Combine 4 vecteurs avec pondération configurable. Retourne top-K edges potentiels.

-- find_kairos_inverse_mirrors(user_id, kairos_id) -- Type 5
-- find_kairos_cycles(user_id, motif_tag, days)    -- Type 6
-- find_kairos_prophetic(user_id, kairos_id, min_days_back) -- Type 7
-- get_constellation_graph(user_id, days, filters) -- pour Portrait + Constellation Figures
```

### §35.8 Multilingue par pivot ontologique anglais

`text-embedding-3-small` est multilingue natif → bon pour Type 1 directement. Pour Types 2-5 (concept/soma/archétype/inversion), l'extraction LLM **standardise en anglais** (langue d'ontologie pivot — vote Tim A4) avant embedding. Conséquence : un rêveur FR et un rêveur ID dans le même cercle qui rêvent le "même rêve" (concepts/archétypes) matchent parfaitement, peu importe la langue source.

User voit toujours le texte dans sa langue. L'IA narratrice répond dans sa langue. Le matching backend est trans-langue.

**Exception garde-fou** : pour `tradition_figure` (Tara, Krishna, Wakan Tanka, etc.), garder le **mot dans la langue de la tradition** + glose dans la langue user. Pas d'équivalence automatique cross-tradition (red line — vote Tim A2).

### §35.9 Coûts compute & latence

Par kairos déposé :
- Whisper transcription (si voix) : ~$0.006-0.01
- Sonnet phase 1 extraction (~2K in / 1K out) : ~$0.01
- 4 embeddings (text-embedding-3-small) : ~$0.0001
- Pattern detection (queries DB + 1 LLM check Type 5 éventuel) : ~$0.005
- Sonnet phase 6 synthesis : ~$0.01
- **Total ~$0.03 / kairos**

Latence UX perçue : **< 2 s** (capture + insert). Enrichissement background : ~30-50 s (4 embeddings parallèles + pattern detection + synthesis). User n'attend rien.

### §35.10 Scaling

- pgvector + HNSW tient à ~10 M vecteurs single-node, ~100 M+ avec sharding par `user_id` (cf. §32)
- `kairos_edges` croît rapidement (N²-ish dans le worst case) → GC sur `edge_weight < 0.5` après 90 j
- Cache aggressif sur Anima Mundi (recalcul lunaire, pas live)
- Pipeline IA totalement async — aucune latence UX

---

## §36 — Pipeline IA d'extraction CALIBRÉ (16 dimensions)

Source : `INVESTIGATION-CALIBRATION-PATTERN-ECHOING.md` §3. Le prompt d'extraction Sonnet actuel sort 5 dimensions (archetypal_process, dream_asks, figure_types, body_symbolism, root_dream_patterns). L'investigation contre 14 cas littéraires révèle qu'il faut **16 dimensions affinées avec inhibition rules par `kairos_type`**.

### §36.1 Les 16 dimensions

1. **setting** — lieu, atmosphère, géographie. Tag familier/inconnu.
2. **figures** — liste avec **type Seth élargi à 8** (cf. §36.3).
3. **motifs** — objets/animaux/éléments. Tag rare vs courant.
4. **dynamique_narrative** — arc en 3-7 mots (descente, poursuite, impasse, rencontre, dissolution…).
5. **sensoriel** — 6 modalités tagées (vue/son/odeur/toucher/goût/proprioception). Marquer absentes.
6. **temporalite** — jour/nuit/saison/durée/anachronisme/atemporalité. Inclut **collapse temporel**.
7. **seuils** — portes/frontières/passages explicites OU implicites (réveil = seuil, identification subjet→objet = seuil identitaire).
8. **parole_silence** — qui parle, mots EXACTS string si rapportés (Ondinnonk Moss). Le silence est aussi un champ.
9. **relations_pouvoir** — asymétries, ambigüités, réciprocités.
10. **numinosity** — score composite 0-1 + flag `NUMINOSITY_PENDING` si rêve court mais objet/figure singulier précieux.
11. **archetypal_tags** — Jung 12 + ontologie cross-cultural prudente (triple filtre Said+Smith+Kimmerer). Ne JAMAIS forcer Marie ↔ Demeter ↔ Tara dans même tag.
12. **compensation_jung_possible** — si attitude consciente diurne du rêveur connue (note jour récente), proposer compensation possible. Sinon NULL.
13. **dream_ask** — UNE question ouverte au rêveur, à la von Franz, en lien avec le matériel extrait. Question, pas affirmation (Moss).
14. **root_patterns_match** — matchs avec corpus rêves antérieurs (motifs/figures/archétypes récurrents). Pour chaque match : `kairos_id` + force.
15. **paradoxes** — contradictions internes signifiantes du rêve.
16. **metaphores_extrapolees** — concepts métaphoriques au-delà du littéral (Lakoff). Format `MAJUSCULE_AVEC_UNDERSCORES`.

### §36.2 Flags backend (jamais affichés user)

- `somatic_alert_candidate` — animaux noirs immobiles grossissants + organe malmené + maison dégradée sans cause narrative
- `big_dream` — numinosity > 0.7 + densité sensorielle haute + unforgettable user
- `tradition_specific` — bool + `nom_tradition` (active prudence anti-équivalence absolue)
- `image_tending_candidate` — figure non-humaine majeure + somatic_marker fort + tactile présent → déclenche `IMAGE_TENDING_MODE`
- `hypnagogic_seed` — fragment court qui pourrait nourrir création future

### §36.3 8 types de figure (vs 6 initiaux)

Investigation a ajouté **`tradition_figure`** (cas Tara) et **`image_monde`** (cas feuille Bachelard). Les 6 Seth restent fondamentaux mais incomplets seuls.

```
type_figure ∈ (
  'probable_self',        -- autre version possible du sujet (Seth)
  'counterpart',          -- figure parallèle, même structure rôle (Seth)
  'fragment',             -- aspect dissocié de soi (Seth/Jung shadow)
  'consciousness_cousin', -- non-humain autonome (Aizenstat, Buhner)
  'post_mortem',          -- défunt en transition (Seth/Moss/Larsen)
  'ego_projection',       -- projection ego (Jung)
  'tradition_figure',     -- panthéon nommé (Tara/Krishna/Christ/Wakan Tanka…) — NOM exact + tradition source, ANTI-équivalence cross-tradition
  'image_monde'           -- image cosmique bachelardienne sans personnification
)
```

`figures jsonb` enrichi : `{name, type, qualities, action, tradition_source}`.

### §36.4 Inhibition rules par kairos_type

Une rêverie n'est PAS un rêve. Un felt-shift n'est PAS une synchronicité. Le prompt extraction module ses dimensions actives selon `kairos_type` :

| `kairos_type` | Inhibition |
|---|---|
| `reverie` (Bachelard) | Pas d'interprétation symbolique forte. Output : qualités sensorielles + monde ouvert + augmentation conscience + identification subjet→objet si présente. Pas de "ça signifie X". |
| `hypnagogie` (Mavromatis) | Pas de narration. Liste paratactique de fragments tagués (visual / auditory_verbal / auditory_musical / olfactory / kinetic / tactile). Pas de causalité imposée. |
| `sidewalk_oracle` (Moss) | Capture obligatoire `inner_question`, `confirmations_count`, `somatic_marker` (frisson nuque ?). Pas d'interprétation profonde — focus signe-réponse. |
| `frisson_somatique` (Gendlin) | Focus `somatic_markers` + `handle` (mot/image qui matche le felt sense) + `shift` observé. Ne pas conceptualiser au-delà. |
| `synchronicite` (Hopcke/Cambray) | Narrative compacte + impasse précédente captée si possible + domaine Hopcke (work/love/illness/loss/creative). |
| `note_jour_symbolique` | Court. Geste/moment/résonance. Pas de psychologisation. |
| `reve_nocturne` | Extraction complète 16 dimensions. |

### §36.5 Règles d'or du prompt

1. **Pas d'interprétation à l'extraction** — Sonnet extrait, ne juge pas.
2. **Inhibition par kairos_type** — strict.
3. **Type figure élargi à 8** — validation cross-tradition stricte.
4. **Flags backend** — pas user.
5. **Numinosity révisable rétroactivement** (PENDING).
6. **Tradition specifique = anti-équivalence absolue** par défaut (red line).
7. **Output JSON strict.**

Le template complet est versionné dans `src/prompts/dream-alpha-extract-calibrated.ts` (à créer en remplacement de l'extraction Sonnet actuelle).

---

## §37 — Workflow synthèse 6 tiers

Source : `INVESTIGATION-CALIBRATION-PATTERN-ECHOING.md` §4. Pas un prompt générique mais **6 workflows distincts** selon la nature du kairos. La synthèse Sonnet adapte tier, voix mobilisées, longueur, dream_ask, ouverture.

### §37.1 Détection du tier

```
ÉTAPE 1 — TIER DETECTION

TIER_BIG_DREAM       : numinosity > 0.85 + first of its kind + tradition_specific
                       OR archetypal_tags fortes
                       → synthèse minimale + dream_ask + invitation à laisser vivre
                         + revisit_schedule J+7 / J+30 / J+365
                         (pattern LET_THE_DREAM_LIVE)

TIER_PATTERN_RICH    : matches multiples (>= 3 types pattern echoing détectés)
                       → synthèse polyphonique riche 4-5 voix + visualisation cluster

TIER_STANDARD        : extraction normale
                       → synthèse polyphonique modérée 2-3 voix

TIER_SOMATIC_DELICATE: somatic_alert_candidate OR felt_shift saisi
                       → ton spécifique délicat, jamais médical, attention au corps soft

TIER_IMAGE_TENDING   : image_tending_candidate true
                       → mode Aizenstat, pas d'interprétation, série de questions
                         tending + invitation à rester avec l'image

TIER_REVERIE         : kairos_type=reverie
                       → amplification phénoménologique pure (Bachelard),
                         pas de symbolisation
```

### §37.2 Étapes du workflow (toutes tiers)

```
ÉTAPE 2 — CONSULTATION FORÊT (multi-passes)
  Pour chaque archetypal_tag, root_pattern, métaphore, kairos_type :
    - Top-K chunks via queryForestChunks (déjà câblé)
    - Filtrer pertinence > seuil
    - Diversifier voix (pas tout Jung) : Jung/von Franz/Aizenstat/Moss/
      Bachelard/Larsen/Bulkeley/Hopcke/Cambray/Gendlin/Taylor/
      Eliade/Hillman/Buhner/Damasio
    - Si tradition_specific : chunks de la tradition source SEULEMENT

ÉTAPE 3 — POLYPHONIE (3-5 voix sélectionnées)
  Pour chaque voix :
    - 1-3 phrases d'invitation à entendre (pas affirmation)
    - Citation Forêt si chunk fort (voix absorbée — cf. §5.4)
    - Phrasé honnête : "à la lumière de [auteur], on pourrait entendre…"
    - JAMAIS "Jung te dit…" ou "Bachelard pense que…"

ÉTAPE 4 — DREAM ASK
  UNE question ouverte au rêveur (von Franz style), qui :
    - Ne suggère pas de réponse
    - Pointe vers le cœur (paradoxe / silence / seuil / image-monde)
    - Reste dans le langage du rêveur
    - Si Big Dream : question minimale, déposée comme un caillou

ÉTAPE 5 — OUVERTURE
  - TIER_BIG_DREAM       : "ce rêve veut peut-être un cercle. (a) partager / (b) garder solo / (c) revisiter J+7"
  - TIER_IMAGE_TENDING   : "veux-tu rester avec [figure] ? Audio guidé Aizenstat dispo."
  - TIER_SOMATIC_DELICATE: "comment ton corps va-t-il en ce moment ? Audio Focusing dispo."
  - PATTERN ECHOING fort : "veux-tu voir ce qui dans tes rêves passés résonne ?"
  - Si user a saisi > N kairos sans aha tracé : invitation à marquer aha
```

### §37.3 Anti-patterns explicites (Sonnet system prompt)

- **JAMAIS** "ce rêve signifie X" → toujours "on pourrait entendre / Jung lirait / une lecture possible…"
- **JAMAIS** d'équivalence cross-tradition automatique pour figures spécifiques
- **JAMAIS** push notif / alerte / "découverte importante !"
- **JAMAIS** diagnostic médical ni psychiatrique
- **JAMAIS** plus de 5 voix polyphoniques (saturation)
- **JAMAIS** synthèse > 600 mots pour un kairos seul (charge cognitive)
- **JAMAIS** d'interprétation pour `TIER_REVERIE` (Bachelard interdit)

### §37.4 Tone book

- **Sobre.** Pas de "wow", "puissant", "transformateur". Le rêveur juge.
- **Phénoménologique.** "Ce qui apparaît…", "ce qui demande peut-être ton attention…"
- **Conditionnel.** "On pourrait", "il se peut que".
- **Multilingue préservé.** Voix Bachelard en français même pour user anglophone si user opte.
- **Pas de filler spirituel.** Pas de soupe new-age — citations seulement si l'auteur l'a vraiment dit.

### §37.5 Capture de l'AHA (autorité rêveur)

Après chaque synthèse, micro-question discrète :
- 3 niveaux : `aha` (résonne fort) / `peut-être` / `non`
- Sur quelle proposition : choix multiple parmi voix proposées + zone texte libre
- Tracking : alimente cluster `aha_recurrence` du rêveur (Type 11) → quel type d'interprétation lui parle (Jung/Moss/phénoménologique/somatique). Permet **personnalisation polyphonique** dans le temps.

Stockage dans `user_validations` (cf. §39).

### §37.6 Test de calibration empirique POST-V1 (mandatory)

Sur 50-100 premiers users (incluant Tim, Yeshua) :
1. Saisir 10 rêves classiques de la littérature (les 14 cas analysés)
2. Comparer output Dream App vs lecture du maître
3. Mesurer : couverture extraction (16 dimensions), tact synthèse, tone honnêteté, justesse dream ask
4. Ajuster prompts, seuils, voix polyphonique

Sans ce test, on ne peut pas claim "instrument oraculaire vivant". On reste à "journal augmenté".

---

## §38 — Pipeline IA 8 phases async (extraction → synthesis)

Refonte du pipeline `/api/dreams/extract` actuel (3 passes synchrones ~6-8 s) vers un pipeline 8 phases dont seules les phases 1-2 sont synchrones (UX < 2 s) et les phases 3-8 tournent en background async.

```
PHASE 1 — Capture & extraction (~3-5 s, synchrone perçu)
  ├─ Whisper si voix → texte (gpt-4o-transcribe)
  ├─ Détection langue (ISO)
  ├─ Sonnet extraction CALIBRÉE 16 dimensions (cf. §36)
  │   - Pivot ontologique anglais pour archetypal_tags / metaphores
  │   - Inhibition rules par kairos_type
  └─ User confirmation/correction (optionnel, async)

PHASE 2 — Embeddings (parallélisé, ~2 s)
  ├─ embedding_semantic    (sur texte brut)
  ├─ embedding_concept     (sur metaphores_extrapolees + archetypal_tags)
  ├─ embedding_somatic     (sur somatic_markers)
  └─ embedding_archetypal  (sur archetypal_tags)

PHASE 3 — Numinosity scoring (~0.5 s)
  └─ Algorithme composite §35.6 (pas LLM, fast)

PHASE 4 — Forest consultation (~5-10 s, background)
  ├─ queryForestChunks pour archetypal_tags / root_patterns / kairos_type
  └─ Enrichissement archétypal + amplification mythologique (voix absorbée §5.4)

PHASE 5 — Pattern detection multi-types (~5-15 s, background)
  ├─ Type 1  : pgvector cosine sur embedding_semantic
  ├─ Type 2  : pgvector cosine sur embedding_concept
  ├─ Type 3  : pgvector cosine sur embedding_somatic
  ├─ Type 4  : cosine archetypal + tag exact match (intra-tradition)
  ├─ Type 5  : LLM check pairs valence opposée + sémantique haute
  ├─ Type 6  : graph traversal + LLM transformation check
  ├─ Type 7  : pgvector temporal range (Δt ≥ 30j)
  ├─ Type 8  : numinosity_score check
  ├─ Type 9  : graph co-occurrence query
  ├─ Type 10 : inner/outer pair check (< 72h, multi-couches)
  ├─ Type 14 : somatic recurrence query
  └─ ... (Types 11/12/15/16 phasés V1.5)
  → INSERT dans kairos_edges

PHASE 6 — Synthesis (~5-10 s, background)
  ├─ Tier detection (cf. §37.1)
  ├─ Polyphonie 3-5 voix (cf. §37.2)
  └─ Sonnet narration — output stocké dans kairos.synthesis_text

PHASE 7 — Storage & persistence (~1 s)
  ├─ kairos UPDATE (vecteurs + scalars + synthesis_text)
  ├─ kairos_edges INSERT
  └─ Trigger : si opt-in cercle/global, propage à agrégation

PHASE 8 — Notification douce (chuchotement)
  └─ Si kairos chaud OU écho fort → marquage discret journal
     JAMAIS push notif. Toujours latence rituelle 24h.
```

**Latence UX perçue : < 2 s** (kairos déposé, "je lis ton rêve…"). Enrichissement total background : ~30-50 s.

Implémentation : route `POST /api/kairos` synchrone phases 1-2, puis trigger Edge Function `kairos-enrich` async pour phases 3-8.

---

## §39 — Couche d'apprentissage personnelle (HYPER IMPORTANT — Tim 2026-04-24)

Source : `SESSION-LOG-2026-04-24-AFTERNOON.md` §3. Validé Tim. La feedback loop globale d'apprentissage est l'une des décisions structurelles les plus importantes de la session : **l'IA apprend de TOUS les users (anonymisés) et cela inspire chacune de ses interactions**, sans jamais imposer.

### §39.1 Niveaux d'apprentissage

| Signal | Action user | Stockage |
|---|---|---|
| Correction extraction | "non, cette figure c'est ma sœur" | `user_corrections` |
| Validation lecture IA | "oui exactement" / "pas du tout" / "presque" | `user_validations` |
| Meaning personnel | "pour moi loup = colère envers papa" | `user_meaning_layer` |
| Marquage numinous | "ce rêve m'a marqué" | flag `kairos.user_marked_numinous` |
| Annotation marginale | note interprétative écrite | `kairos_user_annotations` |
| Refus suggestion | skip d'un écho | `user_skips` |
| Exploration approfondie | clic "explorer figure" | `user_engagement` |
| Auto-classification figure | confirme/change type Seth | `figures.seth_type_user_confirmed` |
| Re-lecture vieux kairos | revisit ancien | signal résurgence |

### §39.2 Schemas SQL

```sql
-- Migration : 20260425_meaning_layers.sql

-- Couche personnelle (private user)
CREATE TABLE user_meaning_layer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol_concept text NOT NULL,           -- ex: "loup", "porte rouge", "grand-mère"
  user_meaning text NOT NULL,             -- ex: "colère envers papa"
  context_tags text[] DEFAULT '{}',
  weight float DEFAULT 1.0,               -- pondération apprentissage
  first_declared_at timestamp DEFAULT now(),
  last_reinforced_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_uml_user_symbol ON user_meaning_layer(user_id, symbol_concept);

-- Validations user sur lectures IA
CREATE TABLE user_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type text NOT NULL,             -- 'extraction' | 'synthesis' | 'echo' | 'figure_typing' | 'pattern_match'
  context_id text NOT NULL,               -- id du kairos / edge / synthesis
  validation text NOT NULL CHECK (validation IN ('aha', 'maybe', 'no')),
  proposition_voix text,                  -- voix concernée (Jung / von Franz / Moss / …) si polyphonie
  user_note text,                         -- zone libre
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_uv_user_context ON user_validations(user_id, context_type, context_id);

-- Annotations marginales
CREATE TABLE kairos_user_annotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kairos_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  annotation_text text NOT NULL,
  type text DEFAULT 'note' CHECK (type IN ('note', 'meaning', 'aha', 'question', 'correction')),
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_kua_kairos ON kairos_user_annotations(kairos_id);

-- Couche cercle (cosmologie symbolique partagée du cercle)
CREATE TABLE circle_meaning_layer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  symbol_concept text NOT NULL,
  collective_meaning text NOT NULL,
  contributed_by uuid NOT NULL,
  acknowledged_by uuid[] DEFAULT '{}',    -- membres qui acquiescent
  declared_at timestamp DEFAULT now()
);
CREATE INDEX idx_cml_circle_symbol ON circle_meaning_layer(circle_id, symbol_concept);

-- Couche globale (cross-users anonymisés, k-anon 100+)
CREATE TABLE global_meaning_clusters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol_concept text NOT NULL,
  meaning_cluster_text text NOT NULL,
  user_count int NOT NULL CHECK (user_count >= 100),
  language_code text,
  first_emerged_at timestamp DEFAULT now(),
  last_recomputed_at timestamp DEFAULT now()
);
CREATE INDEX idx_gmc_symbol_lang ON global_meaning_clusters(symbol_concept, language_code);

-- Skips (refus suggestion)
CREATE TABLE user_skips (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type text NOT NULL,             -- 'echo' | 'voice_proposal' | 'tier_offer' | 'invitation_circle'
  context_id text,
  skip_reason text,                       -- optionnel
  created_at timestamp DEFAULT now()
);

-- RLS surgical
ALTER TABLE user_meaning_layer       ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_validations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE kairos_user_annotations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_meaning_layer     ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skips               ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User own meaning"     ON user_meaning_layer       FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "User own validations" ON user_validations         FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "User own annotations" ON kairos_user_annotations  FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "User own skips"       ON user_skips               FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Members read circle meaning" ON circle_meaning_layer FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));
-- global_meaning_clusters : pas de RLS user, lecture service_role pour pipeline IA
```

### §39.3 Application apprentissage

**Niveau personnel** :
- Prompt Sonnet enrichi avec `user_meaning_layer` du user pour extractions futures (passé en system prompt : "ce user a déclaré : loup ≈ colère envers papa")
- Lectures futures : éviter angles rejetés (`user_validations.validation = 'no'`), amplifier "aha" (`= 'aha'`)
- Échos pondération : `edge_weight` ajusté selon résonance user (×1.2 si type d'aha récurrent, ×0.8 si type récurremment skipped)

**Niveau cercle** :
- Cercle annonce collectivement les meanings (workflow UX : un membre déclare "dans notre cercle, le pont = transition", autres acquiescent)
- IA cercle apprend la **cosmologie symbolique du cercle** — synthesis cercle utilise ces meanings dans le tissage polyphonique
- Stocké dans `circle_meaning_layer`

**Niveau global (Anima Mundi)** — VALIDÉ TIM 2026-04-24 :
- Patterns de meaning émergents cross-users anonymisés (k-anonymity 100+)
- L'IA peut **proposer** ces meanings dominants comme alternatives ("d'autres rêveurs voient souvent ce symbole comme…"), JAMAIS imposer
- Stocké dans `global_meaning_clusters`, recalculé lunaire
- Pipeline cron : aggregate `user_meaning_layer.symbol_concept` + `meaning` clusters → générer `meaning_cluster_text` poétique via Sonnet → stocker

> *"L'IA apprend de TOUS les users (anonymisés) et cela inspire chacune de ses interactions."* — Tim 2026-04-24

---

## §40 — Persistance zero-perte 4 couches

Source : `SESSION-LOG-2026-04-24-AFTERNOON.md` §4. Validé Tim ("superbe"). 4 couches complémentaires pour qu'aucun savoir produit ne disparaisse.

### §40.1-2/§40.4 — DÉPLACÉES le 2026-07-26 (archivage sessions · digest post-session · user testing)

Ces trois couches ne décrivent pas l'architecture de Dream App : elles décrivent le **système
de mémoire de Yeshua** (archivage des transcripts `.claude/projects/*.jsonl`, agent de digest
post-session, protocole d'interview utilisateur). Leur place est dans `claude-context`
(`MEMORY.md`, `HOW-WE-WORK-MASTER.md`), pas dans le doc de reconstruction technique — un dev
qui reconstruit l'app from scratch n'en a aucun usage. Rien n'est perdu : le contenu vit dans
`SESSION-LOG-2026-04-24-AFTERNOON.md` §4 et dans les crons de claude-context.

**Ce qui RESTE ici, parce que c'est bien de l'architecture Dream** : la couche 3, le feedback
in-app (table + RLS + composant), ci-dessous.

### §40.3 Couche 3 — Feedback Dream App in-app

Table Supabase + bouton omniprésent V1.

```sql
-- Migration : 20260425_dream_app_feedback.sql
CREATE TABLE dream_app_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type text,                       -- 'screen' | 'feature' | 'general' | 'bug' | 'idea'
  context_id text,                         -- ex: 'portrait', '/api/kairos', 'echo_xxx'
  feedback_text text NOT NULL,
  severity text DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_email_for_followup text,            -- optionnel, opt-in
  app_version text,
  device_info jsonb,
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_daf_severity_recent ON dream_app_feedback(severity, created_at DESC);
CREATE INDEX idx_daf_user            ON dream_app_feedback(user_id);

ALTER TABLE dream_app_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User insert own feedback" ON dream_app_feedback FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "User read own feedback"   ON dream_app_feedback FOR SELECT TO authenticated
  USING (user_id = auth.uid());
-- service_role pour Yeshua review hebdo
```

UX : composant `<FeedbackButton />` flottant subtil, accessible depuis n'importe quel écran (corner discret). 2 taps : ouvre overlay → contexte auto-rempli (screen courant) + zone texte + send.

L'IA in-app encourage subtilement à partager expérience (jamais intrusif).

Review hebdo Yeshua → intègre dans `4_LOG.md`.

## §41 — Cercles V1 (schemas + RPCs + Edge Functions)

Source : `SYNTHESE-B-CERCLE.md` §7. Refonte des tables `circles*` existantes (cf. §2.4) pour supporter les types `spontane` / `intentionnel` / `facilite` (vote Tim : V1 = spontané + intentionnel ensemble), avec `intention_text`, `pseudonym` cercle, opt-in granulaire `kairos × cercle` séparé du partage cleartext.

### §41.1 Tables

```sql
-- Migration : 20260425_circles_v1.sql

CREATE TABLE circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('spontane', 'intentionnel', 'facilite')),
  intention_text text,                                -- nullable, only if intentionnel
  intention_history jsonb DEFAULT '[]',               -- snapshots historiques
  created_by uuid NOT NULL REFERENCES auth.users(id),
  invite_token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  cadence_hint text DEFAULT 'on_demand'               -- 'on_demand' | 'lunar'
    CHECK (cadence_hint IN ('on_demand', 'lunar')),
  created_at timestamp DEFAULT now(),
  archived_at timestamp                                -- soft archive si tous membres partis
);

CREATE TABLE circle_members (
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudonym text,                                      -- pseudo cercle (default = username global)
  role text DEFAULT 'member' CHECK (role IN ('member', 'creator', 'facilitator')),
  joined_at timestamp DEFAULT now(),
  left_at timestamp,                                   -- soft delete
  PRIMARY KEY (circle_id, user_id)
);

-- OPT-IN anonyme (participe à l'agrégation cercle)
CREATE TABLE kairos_circle_optin (
  kairos_id uuid REFERENCES kairos(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  opted_at timestamp DEFAULT now(),
  PRIMARY KEY (kairos_id, circle_id)
);

-- SHARED cleartext (visible aux membres)
-- DISTINCT du opt-in : opt-in = anonyme dans agrégation
--                     shared = visible cleartext aux membres du cercle
CREATE TABLE kairos_circle_shared (
  kairos_id uuid REFERENCES kairos(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  shared_at timestamp DEFAULT now(),
  PRIMARY KEY (kairos_id, circle_id)
);

CREATE TABLE circle_restitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES auth.users(id),
  requested_at timestamp DEFAULT now(),
  period_start timestamp NOT NULL,
  period_end timestamp NOT NULL,
  narrative_text text,                                 -- Sonnet generated
  patterns_detected jsonb,
  intention_at_time text,                              -- snapshot intention au moment
  metadata jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'failed'))
);
CREATE INDEX idx_cr_circle_recent ON circle_restitutions(circle_id, requested_at DESC);

CREATE TABLE circle_restitution_reactions (
  restitution_id uuid REFERENCES circle_restitutions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text CHECK (reaction_type IN ('resonates', 'unfamiliar', 'question')),
  comment text,
  created_at timestamp DEFAULT now(),
  PRIMARY KEY (restitution_id, user_id, reaction_type)
);
```

### §41.2 RLS surgical

```sql
ALTER TABLE circles                       ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members                ENABLE ROW LEVEL SECURITY;
ALTER TABLE kairos_circle_optin           ENABLE ROW LEVEL SECURITY;
ALTER TABLE kairos_circle_shared          ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_restitutions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_restitution_reactions  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members read own circles" ON circles FOR SELECT TO authenticated
  USING (id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

CREATE POLICY "Members read own circle restitutions" ON circle_restitutions FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

CREATE POLICY "Members read shared kairos" ON kairos_circle_shared FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

CREATE POLICY "User opts-in own kairos" ON kairos_circle_optin FOR INSERT TO authenticated
  WITH CHECK (kairos_id IN (SELECT id FROM kairos WHERE user_id = auth.uid()));
-- etc. (DELETE pour révocation, etc.)
```

### §41.3 RPC functions

```sql
-- Génère restitution sur demande (insert pending + trigger EF)
CREATE OR REPLACE FUNCTION request_circle_restitution(
  p_circle_id uuid,
  p_requested_by uuid,
  p_period_days int DEFAULT 28
) RETURNS uuid LANGUAGE plpgsql AS $$
DECLARE
  v_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM circle_members
    WHERE circle_id = p_circle_id AND user_id = p_requested_by AND left_at IS NULL
  ) THEN RAISE EXCEPTION 'Not a member'; END IF;

  INSERT INTO circle_restitutions (circle_id, requested_by, period_start, period_end)
  VALUES (p_circle_id, p_requested_by, now() - (p_period_days || ' days')::interval, now())
  RETURNING id INTO v_id;

  PERFORM net.http_post(
    url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/generate-circle-restitution',
    headers := jsonb_build_object('Authorization', 'Bearer [service_role_key]', 'Content-Type', 'application/json'),
    body := jsonb_build_object('restitution_id', v_id)
  );
  RETURN v_id;
END $$;

-- Détection patterns cercle (utilisée par EF generate-circle-restitution)
CREATE OR REPLACE FUNCTION get_circle_patterns(
  p_circle_id uuid,
  p_period_start timestamp,
  p_period_end timestamp
) RETURNS jsonb LANGUAGE plpgsql AS $$
-- Aggregate kairos_circle_optin + apply k-anonymity intra-cercle (cf. §41.5)
-- Run pattern detection (16 types) sur le corpus agrégé
-- Return structured patterns
$$;
```

### §41.4 Edge Functions à créer

- `POST /functions/v1/create-circle` — création cercle + invite link
- `POST /functions/v1/join-circle` — rejoint via token
- `POST /functions/v1/generate-circle-restitution` — Sonnet narration polyphonique (workflow §37 adapté pour cercle, contextualisation intention si intentionnel)
- `POST /functions/v1/circle-constellation` — graph visualization data (force-directed)

### §41.5 Privacy intra-cercle

- L'IA voit les vecteurs et patterns agrégés, **jamais "qui a rêvé quoi"**
- Si k < 3 (moins de 3 membres ont des éléments similaires) : ne pas mentionner figures identifiables individuellement → agréger par catégorie ("la figure de l'ancienne" pas "vieille femme inconnue")
- Omettre détails biographiques (pas "maison à Lyon" → "maison familière")
- Détection mention nominative d'un autre membre → propose anonymisation auto avant publication
- Créateur cercle = pas plus de droits qu'un membre standard. Pas de "owner mode" pour voir les rêves individuels. Cercle horizontal.

---

## §42 — Anima Mundi V1 (schemas + 4 pipelines)

Source : `ANIMA-MUNDI-VISION-POETIQUE.md` §7. Vision Tim 2026-04-24 : *"chaîne de télé de la psyché de tous les utilisateurs de l'app"* + *"météo de l'inconscient"* + annales de Big Dreams collectifs sur approbation. Critère ultime : **BEAU, PROFOND, POÉTIQUE.** Pas dashboard analytique.

**Patch 2026-04-24 nuit — scope élargi (Tim)** : les tables `kairos_global_optin` + agrégations Anima Mundi couvrent **kairos (les 6 types : rêve nocturne, sidewalk, rêverie, hypnagogie, synchronicité, frisson) ET notes de journal de vie** (substrat éveillé : doutes, peurs, orientations, joies). C'est l'application à l'échelle planétaire des mêmes principes que le Portrait + Journal de Vie individuel. Conséquence schema : `kairos_global_optin.kairos_id` réfère à la table unifiée des dépôts (kairos OU note de jour), pas seulement aux rêves. Les 4 pipelines (Météo / Polyphonie / Annales / Polarités) consomment indistinctement les deux sources, avec tag `entry_kind` (kairos_type ∈ {dream, sidewalk, reverie, hypnagogic, synchronicity, somatic} OR life_note) pour que la synthèse Sonnet puisse tisser les deux registres.

### §42.1 K-anonymity 250 conservatif V1

K-anonymity stricte 100+ insuffisante au début (avant 1000 users actifs) → **seuil V1 conservatif = 250** sur tout cluster Anima Mundi. Relaxé à 100 quand base utilisateurs stabilisée.

CHECK constraints sur agrégats :
```sql
CHECK (user_count >= 250)  -- V1
-- À assouplir post-stabilisation : CHECK (user_count >= 100)
```

### §42.2 Pas de Lat/Long, V1 sans bioregion

V1 Anima Mundi est **non-territoriale**. Bioregion + agrégation territoriale différées V2+ (partenariats locaux requis). V1 = signal global anonyme uniquement.

Cf. §3.1 et §4 (verrous architecturaux territoire) — restent valides pour quand on activera le territorial.

### §42.3 Tables

```sql
-- Migration : 20260425_anima_mundi_v1.sql

-- Opt-in global granulaire par kairos
CREATE TABLE kairos_global_optin (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kairos_id uuid REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  opt_in_date timestamp DEFAULT now(),
  withdrawal_date timestamp,
  share_for_aggregation boolean DEFAULT true,        -- contribuer aux clusters globaux
  share_for_annales boolean DEFAULT false,           -- offrir comme rêve aux annales
  attribution_mode text CHECK (attribution_mode IN ('anonymous', 'pseudonym', 'username')),
  pseudonym text,
  curated_text text,                                 -- version anonymisée + condensée validée user
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_kgo_user    ON kairos_global_optin(user_id);
CREATE INDEX idx_kgo_kairos  ON kairos_global_optin(kairos_id);
CREATE INDEX idx_kgo_annales ON kairos_global_optin(share_for_annales) WHERE withdrawal_date IS NULL;

-- Rêves en circulation (offerts, en attente de seuil)
CREATE TABLE annales_circulation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kairos_global_optin_id bigint REFERENCES kairos_global_optin(id) ON DELETE CASCADE,
  entered_circulation_at timestamp DEFAULT now(),
  expires_at timestamp NOT NULL,                     -- now + 28j initial, +28j si pas seuil
  state text CHECK (state IN ('circulating', 'archived', 'expired', 'withdrawn')),
  threshold_required int NOT NULL,                   -- calculé selon opt-in actif
  current_held_count int DEFAULT 0,
  passed_threshold_at timestamp,
  archived_in_lune text,                              -- ex: "lune-2026-03"
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_circ_state ON annales_circulation(state);
CREATE INDEX idx_circ_lune  ON annales_circulation(archived_in_lune);

-- Geste "TENIR" (anti-popularity, Brown Holding Change)
CREATE TABLE annales_tenir (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  circulation_id uuid REFERENCES annales_circulation(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  held_at timestamp DEFAULT now(),
  UNIQUE (circulation_id, user_id)
);
CREATE INDEX idx_tenir_circ ON annales_tenir(circulation_id);

-- Polyphonies générées (synthèse IA lunaire)
CREATE TABLE polyphonies_lunaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lune text NOT NULL UNIQUE,                         -- ex: "2026-03"
  generated_at timestamp DEFAULT now(),
  text_content text NOT NULL,
  voices_mobilized text[] NOT NULL,                  -- ex: ['aizenstat','moss','larsen']
  signal_data jsonb NOT NULL,                        -- agrégats Phase 1
  pattern_types_used text[],                         -- ex: ['type_2_metaphorique','type_5_miroir']
  edit_log jsonb DEFAULT '[]',                       -- traçabilité réajustements humains
  approved_for_publication boolean DEFAULT false,
  approved_by text,
  approved_at timestamp,
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_polyph_lune ON polyphonies_lunaires(lune);

-- Météo poétique (court format hebdo / lunaire)
CREATE TABLE meteos_inconscient (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_at timestamp DEFAULT now(),
  effective_window_days int NOT NULL,                -- 14 ou 28
  main_phrase text NOT NULL,
  thematic_clouds text[] NOT NULL,                   -- 3-5 nuages
  rising_motifs text[] NOT NULL,
  dominant_matter text,                              -- 'water'|'fire'|'earth'|'air'|'stone'|'mist'|'ember'
  signal_data jsonb NOT NULL,
  approved boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_meteo_recent ON meteos_inconscient(generated_at DESC);

-- Polarités vivantes détectées
CREATE TABLE polarites_lunaires (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lune text NOT NULL,
  pole_a_motif text NOT NULL,
  pole_b_motif text NOT NULL,
  intensity float CHECK (intensity BETWEEN 0 AND 1),
  detection_metadata jsonb,
  created_at timestamp DEFAULT now()
);

-- Initiations collectives (V1 affichage si signal très net, k-anon 250+)
CREATE TABLE initiations_collectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lune text NOT NULL,
  shift_distance float NOT NULL,                     -- centroïde 14j vs 84j
  threshold_motif text,
  numinosity_avg float NOT NULL,
  detection_window_days int NOT NULL,
  comparison_window_days int NOT NULL,
  description text,                                  -- restitution Sonnet
  approved boolean DEFAULT false,
  created_at timestamp DEFAULT now()
);

-- RLS
ALTER TABLE annales_circulation     ENABLE ROW LEVEL SECURITY;
ALTER TABLE annales_tenir            ENABLE ROW LEVEL SECURITY;
ALTER TABLE polyphonies_lunaires     ENABLE ROW LEVEL SECURITY;
ALTER TABLE meteos_inconscient       ENABLE ROW LEVEL SECURITY;
ALTER TABLE kairos_global_optin      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read circulating"   ON annales_circulation FOR SELECT TO authenticated
  USING (state IN ('circulating', 'archived'));
CREATE POLICY "User can hold"              ON annales_tenir FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "Public read approved poly"  ON polyphonies_lunaires FOR SELECT TO authenticated
  USING (approved_for_publication = true);
CREATE POLICY "Public read approved meteo" ON meteos_inconscient FOR SELECT TO authenticated
  USING (approved = true);
CREATE POLICY "User own optin"             ON kairos_global_optin FOR ALL TO authenticated
  USING (user_id = auth.uid());
```

### §42.4 Pipeline 1 — Météo de l'inconscient (hebdo)

```
PIPELINE METEO LUNAIRE — cron 1×/semaine, ~3-5 min

PHASE 1 — Collecte signaux (~30 s)
  ├─ Query agrégat global opt-in last 14 + 28 jours
  ├─ Vérification k-anonymity ≥ 250 sur chaque cluster
  ├─ Extraction motif_tags top 30 (fréquence × numinosity)
  ├─ Extraction archetypal_tags top 12
  ├─ Extraction matter dominant (clustering embedding_concept
  │   vers ['water','fire','earth','air','stone','mist','ember'])
  ├─ Calcul rising motifs (delta 14j vs 84j antérieurs > seuil)
  └─ Calcul polarités (paires opposées détectées)

PHASE 2 — Génération texte Sonnet (~30 s)
  ├─ Prompt système simplifié pour météo (court, image)
  └─ Output : main_phrase, thematic_clouds, rising_motifs, dominant_matter

PHASE 3 — Audit (~20 s)
  ├─ Filter Cosmogonie INFUSE (10 passes de désensorcellement)
  ├─ Red lines check (pas de %, pas de "trending", pas de classement)
  └─ Si OK → approved=true. Sinon → human_review_flag

PHASE 4 — Publication
  └─ INSERT meteos_inconscient
```

### §42.5 Pipeline 2 — Polyphonie lunaire (mensuel)

```
PIPELINE POLYPHONIE LUNAIRE — cron 1×/lune, ~5-10 min

PHASE 1 — Collecte signaux (élargie, fenêtre lunaire 28j)
  ├─ Idem Phase 1 météo + edges kairos détectés cross-users
  ├─ Pattern types V2 collectif (Type 13 convergence mystique si applicable)
  └─ K-anon ≥ 250 strict

PHASE 2 — Sélection voix Forêt (3-5)
  ├─ Voix pertinentes selon clusters dominants
  └─ Diversité (jamais all-Jung)

PHASE 3 — Génération Sonnet (~2-5 min, prompt long contemplatif)
  ├─ Workflow §37 adapté collectif
  ├─ Polyphonie ontologiquement honnête ("à la lumière de…")
  └─ Output : 200-500 mots contemplatif

PHASE 4 — Audit éditorial trimestriel (humain Tim/Yeshua)
  └─ Approval manuel avant publication

PHASE 5 — INSERT polyphonies_lunaires
```

### §42.6 Pipeline 3 — Annales (quotidien)

```
PIPELINE ANNALES — cron quotidien

PHASE 1 — Calcul seuils dynamiques
  ├─ users_optin_actifs = COUNT(DISTINCT user_id) FROM kairos_global_optin
  │                       WHERE withdrawal_date IS NULL
  ├─ threshold_required = MAX(50, MIN(300, 0.10 × users_optin_actifs))
  └─ UPDATE annales_circulation SET threshold_required = ...

PHASE 2 — Vérification passages de seuil
  ├─ Pour chaque circulation 'circulating' :
  │   ├─ count = SELECT COUNT(*) FROM annales_tenir WHERE circulation_id=...
  │   └─ Si count >= threshold_required :
  │       ├─ state = 'archived'
  │       ├─ archived_in_lune = current_lune (ex: "2026-04")
  │       ├─ passed_threshold_at = now()
  │       └─ Notif douce in-app à l'offrant (PAS push)

PHASE 3 — Vérification expirations
  ├─ Pour chaque circulation expires_at < now() :
  │   ├─ Si current_held_count > 0 mais < threshold_required ET première expiration :
  │   │   └─ expires_at += 28 jours (prolongation unique)
  │   └─ Sinon : state = 'expired'
```

### §42.7 Pipeline 4 — Polarités lunaires

Détection des paires opposées (ex: motif "monter" vs motif "descendre" actifs simultanément cross-users) au calcul lunaire. Phase 1 du pipeline polyphonie alimente directement `polarites_lunaires`. Pas de cron séparé, embedded dans pipeline polyphonie.

### §42.8 Stratégie multilingue Anima Mundi

- Extraction LLM en anglais pivot (cf. §35.8)
- Embeddings sur l'anglais → matching cross-lingual
- Polyphonie générée par défaut en anglais, traduite par Sonnet vers la langue de chaque user en lecture
- Exception : mythogems culturels spécifiques → garder mot dans langue tradition + glose dans langue user

### §42.9 Coûts compute Anima Mundi V1

| Item | Fréquence | Coût unitaire | Coût annuel (cohorte 1000 actifs) |
|---|---|---|---|
| Pipeline météo | hebdo | $0.15 | $7.80 |
| Pipeline polyphonie | mensuel | $0.40 | $4.80 |
| Pipeline annales | quotidien | $0.05 (queries DB) | $18.25 |
| Forêt consultations annexes | ~50/lune | $0.02 | $12.00 |
| Audit éditorial trimestriel | 4×/an | $0 (humain) | $0 |
| Anonymisation+condensation rêves offerts | ~100/mois (10K users) | $0.02 | $24.00 |
| **Total estimé / cohorte 1000 actifs** | | | **~$70/an** |

Négligeable. Le moteur de résonance individuel coûte 10 000× plus.

### §42.10 Scaling Anima Mundi

Agrégations calculées **hors-ligne** (cron, batch). Pas de calcul live à chaque pageload. Frontend lit dans tables matérialisées (`polyphonies_lunaires`, `meteos_inconscient`, `annales_circulation`). Très scalable.

Phase 1 (collecte signaux) scan tous les kairos opt-in last 84j :
- 100K users × 5 kairos/sem × 12 sem = 6 M kairos → pgvector + index OK
- 1 M users → 60 M → OK avec partitioning par mois
- 100 M users → sharding nécessaire (problème V3+)

### §42.11 Pipeline architecturalement séparé (anti-panopticon)

Les agrégats Anima Mundi **ne nourrissent pas** le pipeline individuel. Aucune feature "rétro-injection" du collectif vers l'individuel à l'insu du user. Si un user opte pour voir "ce que les autres rêvent autour de ce symbole" (cf. couche apprentissage globale §39), c'est explicite et user-initiated.

---

## §43 — Initiatic Threshold (V2 pré-cablé V1)

Source : `SYNTHESE-C-PORTRAIT-FIGURES-INITIATIC.md` §3. Vote Tim C9 : V2, pas V1 (risques iatrogènes, faux positifs). Mais **architecture pré-cablée V1** pour ne pas casser V2.

### §43.1 Concept

Détection algorithmique de "saisons d'âme" — quand le corpus onirique d'un user **bascule** dans un champ lexical/symbolique différent (Grof psychospiritual emergence, Campbell threshold crossing, Jung individuation, van Gennep rites de passage).

### §43.2 Schema (V1 créé, V2 exposé)

```sql
-- Migration : 20260425_soul_seasons.sql (V1, exposé V2)

CREATE TABLE soul_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,                                         -- nullable, user can name later
  description text,
  start_date timestamp NOT NULL,
  end_date timestamp,                                -- nullable if current season
  threshold_marker_kairos_id uuid REFERENCES kairos(id), -- optional: kairos qui marque le seuil
  archetypal_signature_centroid vector(768),         -- embedding moyen de la saison
  detection_metadata jsonb,                          -- algo, distance, confidence
  user_marked boolean DEFAULT true,                  -- user marked vs auto-detected
  created_at timestamp DEFAULT now()
);
CREATE INDEX idx_ss_user        ON soul_seasons(user_id);
CREATE INDEX idx_ss_user_dates  ON soul_seasons(user_id, start_date, end_date);

-- Lien optionnel kairos → saison
ALTER TABLE kairos ADD COLUMN soul_season_id uuid REFERENCES soul_seasons(id);

ALTER TABLE soul_seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User own seasons" ON soul_seasons FOR ALL TO authenticated USING (user_id = auth.uid());
```

V1 : table créée, pas exposée UX. V2 : UX activée, détection auto + suggestion + marquage manuel.

### §43.3 Algorithme V2 (moving window vector cluster shift)

```python
def detect_threshold_shift(user_id, current_window_days=14, comparison_window_days=84):
    current_centroid = compute_centroid(
        user_id,
        date_range=(now() - current_window_days, now()),
        vector_field='embedding_archetypal'
    )
    historical_centroid = compute_centroid(
        user_id,
        date_range=(now() - comparison_window_days, now() - current_window_days),
        vector_field='embedding_archetypal'
    )
    distance = cosine_distance(current_centroid, historical_centroid)
    if distance > THRESHOLD and recent_avg_numinosity > 0.7:
        return {'detected': True, 'distance': distance, 'confidence': 'low'}  # toujours low
    return {'detected': False}
```

Faux positifs attendus. Confidence toujours `low`. Suggestion douce au user, jamais affirmation. Pas de gamification, pas de récompense pour avoir marqué un seuil.

---

## §44 — Forêt câblage existant — confirmation

Vérification 2026-04-24 : **TOUS les endpoints utilisent `queryForestForMode`** :
- `/api/chat` (mode chat)
- `/api/echoes?synthesis=true` (mode `day`)
- `/api/figures?synthesis=true` (mode `dream`)
- `/api/oracle-corps?synthesis=true` (mode `body`)
- `/api/dreams/extract-deep` (mode `dream`, 8 chunks injectés Sonnet)

Le câblage Forêt FIRST n'est pas dépassé — c'est le **cœur** de Dream App. À conserver tel quel pour la refonte du moteur de résonance. Les nouveaux endpoints (`/api/kairos`, `/api/oracle-quotidien`, `/functions/v1/generate-circle-restitution`, pipelines Anima Mundi) doivent **tous** consulter la Forêt en première intention via `queryForestChunks` ou son successor.

---

## §45 — Plan séquentiel refonte AVANT launch publique

Décision Tim 2026-04-24. Estimation : **2-3 semaines de dev focalisé.**

Ordre d'exécution :

1. **Migration schema** — vecteurs spécialisés (`embedding_concept`, `_somatic`, `_archetypal`) + scalars (`numinosity_score`, `affective_*`, `figures`, `motif_tags`, `somatic_markers`, `archetypal_tags`, `temporal_signature`, `quality_lang`) + table `kairos_edges` (cf. §35.2 + §35.4)
2. **Refonte `extract-deep` pipeline** — prompt Sonnet 16 dimensions CALIBRÉ avec inhibition rules par `kairos_type` (cf. §36)
3. **Implémentation détection 16 types pattern** — phasage V1 = Types 1, 2, 3, 6, 7, 8, 10, 14 (8 essentiels). Background async (cf. §38 Phase 5)
4. **Workflow synthèse 6 tiers** — refonte Sonnet narration avec tier detection + polyphonie ontologiquement honnête (cf. §37)
5. **Pipeline Cercle** — tables (`circles` refactorisées, `kairos_circle_optin`, `kairos_circle_shared`, `circle_restitutions`, `circle_restitution_reactions`), RPCs, Edge Functions `create-circle`, `join-circle`, `generate-circle-restitution`, `circle-constellation` (cf. §41)
6. **Pipeline Anima Mundi** — 4 sous-pipelines (météo, polyphonie, annales, polarités), tables + crons + audit éditorial (cf. §42)
7. **Couche apprentissage personnelle** — tables `user_meaning_layer`, `user_validations`, `kairos_user_annotations`, `circle_meaning_layer`, `global_meaning_clusters`, `user_skips` + intégration dans system prompt Sonnet (cf. §39)
8. **Tests calibration** — sur les 14 cas de l'Investigation Calibration. Mesurer couverture extraction, tact synthèse, tone honnêteté, justesse dream_ask. Ajuster prompts/seuils/voix.

Parallélisable : 1 + 2 + 5 (table circles) en S1 ; 3 + 4 + 7 en S2 ; 6 + 8 en S3.

---

## §46 — Mise à jour checklist V1 (avant launch publique)

Ajouts à §33 :

- [ ] Migration `20260425_kairos_multi_vector_engine.sql` (4 vecteurs + scalars)
- [ ] Migration `20260425_kairos_edges.sql` (graph layer)
- [ ] Refonte `src/prompts/dream-alpha-extract-calibrated.ts` (16 dimensions + inhibition rules)
- [ ] 8 types pattern echoing essentiels implémentés (V1) avec tests sur cas littéraires
- [ ] Workflow synthèse 6 tiers fonctionnel (`extract-deep` + nouvelle EF synth)
- [ ] Tables Cercles V1 + RLS surgical + Edge Functions
- [ ] Tables Anima Mundi V1 + 4 pipelines cron + audit éditorial
- [ ] Couche apprentissage personnelle (5 tables + intégration prompt Sonnet)
- [ ] Persistance 4 couches (cron backups, agent post-session, table `dream_app_feedback`, template user testing)
- [ ] Bouton `<FeedbackButton />` omniprésent
- [ ] Table `soul_seasons` créée (V1 non exposée)
- [ ] Test calibration sur 14 cas de l'Investigation passé avec succès
- [ ] Forêt FIRST confirmé sur TOUS nouveaux endpoints

---

## §47 — Migrations Supabase du 25/04 (project `rtrkxzcyblgonwgfzovj`)

⚠️ **Le SQL exact vit sur disque, pas ici** : `supabase/migrations/20260425_*.sql`. Il y était
recopié intégralement — ~200 lignes de doublon d'un fichier versionné juste à côté. Un document
de reconstruction doit dire **quoi et pourquoi** ; le **comment** exact est le fichier lui-même,
qui ne peut pas diverger de lui-même. Ne recopier du SQL ici que s'il n'existe nulle part ailleurs.

Toutes appliquées en prod le 25/04, toutes en RLS Tier 3 surgical
(`auth.uid() = user_id` en USING **et** WITH CHECK).

| Fichier | Ce qu'il crée, et pourquoi |
|---|---|
| `20260425_120100_kairos_substrate.sql` | le substrat `kairos` + `kairos_edges` — la base de tout (détail §35.2 et §35.4) |
| `…_life_journal_entries` | **16 colonnes** : le journal de vie passe d'un schéma chiffré client-side simple à une **catégorisation Sonnet automatique** + les 4 vecteurs spécialisés + les scalaires somatiques/affectifs. Le journal devient le **substrat lisible** que les kairos viennent éclairer (geste secondaire `summon-kairos-wisdom`). Catégorisation **silencieuse en background, jamais imposée au rêveur.** |
| RPC `match_kairos_for_wisdom(query_embedding, target_user, match_count)` | rappelle les kairos qui éclairent une entrée de journal. ⚠️ **Levait une exception à chaque appel depuis sa création** — réparé le 26/07, cf. §54.5 |
| `portrait_readings` | cache 24 h des lettres narratives (une lettre coûte cher, elle ne change pas dans la journée) |
| `user_validations` étendue | `felt_shift_location`, `aha_level`, `aha_note`, `forest_reading_angles`, `reading_kind` — la matière de la **boucle de retour**, qui vaut mieux que tout réglage de seuil (§54) |
| `20260425_120200_dream_app_feedback.sql` | la table de feedback in-app (§40.3) |
| `20260425_120000_soul_seasons.sql` · `…_130100_circles_v1_extended` · `…_130200_anima_mundi_v1_schemas` · `…_130300_user_meaning_layer_v1` · `…_130400_kairos_synthesis_columns` | cf. §41, §42, §39-apprentissage, §37 |

> **La colonne qui compte pour un repreneur** : la catégorisation du journal est faite par un
> LLM en tâche de fond et n'est **jamais** présentée comme une vérité au rêveur. Si un jour on
> l'affiche, ce n'est plus la même application.

## §48 — Routes API V1.2 nouvelles (avril 25)

13 routes ajoutées le 25/04. Toutes derrière `requireAuth(req[, body])` (Bearer obligatoire — Tier 2 shippé 23/04, cf. §13.2). Source canonique : `src/app/api/`.

### §48.1 `POST /api/journal/entries`

Crée une entrée de Journal de Vie + déclenche `categorize` async (fire-and-forget).

```bash
curl -X POST https://dream-alpha-bice.vercel.app/api/journal/entries \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"raw_text":"Je doute de quitter ce travail qui m éteint.","voice_url":null,"linked_kairos_id":null}'
```

Output : `{ entry: <full row life_journal_entries> }` avec `categorize_pending: true`. Side-effect : `triggerCategorize(entryId, rawText)` fait un POST interne (`X-Internal-Service: $INTERNAL_SERVICE_TOKEN`) sur `/api/journal/categorize`.

### §48.2 `GET /api/journal/entries?category=&sub_category=&limit=&offset=`

Liste paginated (limit max 200, default 50). Filtre `user_archived = false`. Output projection légère : `id, raw_text, created_at, category, sub_category, somatic_markers, affective_valence, numinosity_score, linked_kairos_id, user_archived`.

### §48.3 `POST /api/journal/categorize` (internal)

Sonnet routing silencieux (`claude-haiku-4-5-20251001`, 200 max_tokens). Auth : header `X-Internal-Service: $INTERNAL_SERVICE_TOKEN`. Body : `{ entry_id, raw_text }`. Update `life_journal_entries.{category, sub_category, category_confidence, categorize_pending=false}`. Fallback `transitions` + confidence 0.3 si parse JSON échoue.

### §48.4 `GET /api/journal/sections`

Retourne les 7 sections canoniques (toujours présentes, même vides) avec `count`, `last_entry: { id, raw_text(120 chars), created_at }`, et pour `relations` un array `sub_categories: [{ key, label, count, last_entry }]`. Métadonnées (label/glyph) dans la route :

```js
travail: '◇' / 'travail & vocation'
relations: '○' / 'relations'        // sub: amour | famille | amis | collegues | rencontres
corps_sante: '◐' / 'corps & santé'
passions: '✶' / 'passions & création'
argent: '⌬' / 'argent & matériel'
spiritualite: '☉' / 'spiritualité & sens'
transitions: '⌒' / 'transitions & seuils'
```

### §48.5 `POST /api/journal/summon-kairos-wisdom`

**Geste secondaire central** (Bible §3.1.ter). Rate-limit **3 appels/jour user** (préservation du rituel). Body :
```json
{ "entry_id": "<uuid>" }       // appel sur entrée individuelle
// OU
{ "category": "transitions", "sub_category": null }  // appel sur section globale
```

Pipeline :
1. Vérif rate-limit `kairos_wisdom_summons` count >= 3 sur 24h → 429
2. Build `triggerText` (entry.raw_text OU agrégat top-5 entries de la section)
3. OpenAI `text-embedding-3-small` sur triggerText
4. RPC `match_kairos_for_wisdom(queryVec, userId, 5)` (§47). Fallback : top 5 kairos récents avec `synthesis_text`.
5. Sonnet `claude-sonnet-4-6` (max_tokens 600) tisse polyphonie 100-200 mots avec system prompt strict (Bible §2.2 P-Inversion : phrasé conditionnel obligatoire, 1-3 voix Forêt en cadrage doux, jamais d'autorité finale, terminer par UNE dream ask)
6. INSERT `kairos_wisdom_summons` avec `resonance_types: ['semantic']` (V1)

Output : `{ summon_id, polyphony_text, voices_mobilisees, resonant_kairos: [...], remaining_today }`.

### §48.6 `PATCH /api/journal/summons/[id]`

Update AHA_CAPTURE feedback. Champs autorisés (whitelist stricte) :
- `felt_shift_location` ∈ `gorge|poitrine|ventre|nuque|ailleurs|aucune`
- `aha_level` ∈ `fort|peut-etre|non`
- `aha_note` (max 1000 chars trim)

`aha_note` clampé à 1000 chars. RLS surgical via `.eq('user_id', userId)`.

### §48.7 `POST /api/portrait/narrative-reading`

**Lettre du moment IA narratrice** (Design §7.6 — refonte narrative vivante, pas dataviz).

Body : `{ toggle: "day"|"night"|"crossed", period: "lune"|"saison"|"annee"|"always", force?: bool }`.

Pipeline :
1. Cache check : si `portrait_readings` row pour (user, toggle, period) avec `created_at > now() - 24h` ET `force !== true` → renvoie cached
2. Selon toggle, fetch jusqu'à 30 `life_journal_entries` (toggle day|crossed) + 20 `kairos` triés `numinosity_score DESC` (toggle night|crossed) sur la fenêtre `period` (lune=28j, saison=90j, annee=365j, always=9999j)
3. Empty path : si rien → texte "Pas encore assez de matière déposée pour tisser une lettre ici. Le sol respire en silence." (variante par toggle)
4. Sonnet `claude-sonnet-4-6` max_tokens 1500 → JSON `{ lettre, voix_mobilisees, figures_dominantes, echos_actifs, tensions_ouvertes }`
5. INSERT cache `portrait_readings`

Output : `{ lettre, voix_mobilisees: string[], figures_dominantes: [{nom, occurrences, qualite}], echos_actifs: [{kairos_id, preview, resonance}], tensions_ouvertes: string[], cached: bool }`.

### §48.8 `POST /api/kairos/[id]/forest-reading`

Bouton "demander à la forêt" du KairosDetail. Bible §2.2 : la Forêt arrive en **second temps**, jamais en autorité finale. Body : `{ user_first_reading?: string }` (ce que le rêveur a déjà tenu en mots).

Pipeline :
1. Fetch kairos (RLS owner check) — refus si `raw_text < 4 chars`
2. Build `retrievalQuery` = `raw_text + user_first_reading + motif_tags + archetypal_tags + dream_ask` (clamp 4000 chars)
3. `queryForestForModeDetailed(supabase, query, 'dream', 8, userId)` (cf. §16.3 + §16.4 v13 prefer-embedded)
4. Sonnet `claude-sonnet-4-6` max_tokens 800 → JSON 3 angles polyphoniques DISTINCTS (matter `paper`/`stone`/`silk`), chaque angle : `{ source: "Nom (Livre)", citation: "<15 mots", angle: "≤30 mots conditionnel", matter }`

Output : `{ angles: [...], framing: "ces voix ne disent pas ton rêve — elles le touchent depuis leur angle. ton corps tranche.", sources_preview, retrieval_meta: { fallback_level, avg_similarity, books_hit } }`.

### §48.9 `POST /api/kairos/[id]/aha-feedback`

Stocke FELT_SHIFT_GATE + AHA_CAPTURE après une lecture. Body :
```json
{
  "reading_kind": "forest"|"echo"|"tale"|"user_first",
  "felt_shift_location": "gorge|poitrine|ventre|nuque|ailleurs|aucune|rien",
  "aha_level": "fort|peut-etre|non",
  "aha_note": "...",
  "forest_reading_angles": { /* snapshot 3 angles touchés */ },
  "proposition_voix": "..."
}
```
INSERT `user_validations` avec `context_type = 'kairos:' + reading_kind`, `context_id = kairos_id`. Whitelist stricte sur tous les champs (cf. `aha-feedback/route.ts:26-28`). Validation default `peut-etre` si `aha_level` absent.

### §48.10 Cercles : reactions (POST/DELETE/GET)

```bash
# POST — toggle/upsert idempotent
curl -X POST https://dream-alpha-bice.vercel.app/api/circles/$CIRCLE_ID/reactions \
  -H "Authorization: Bearer $ACCESS_TOKEN" -H "Content-Type: application/json" \
  -d '{"restitution_id":"<uuid>","reaction_type":"resonates"}'

# DELETE — retirer un geste
curl -X DELETE "https://dream-alpha-bice.vercel.app/api/circles/$CIRCLE_ID/reactions?restitution_id=$RID&reaction_type=resonates" \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# GET — counts agrégés + mes propres réactions
curl "https://dream-alpha-bice.vercel.app/api/circles/$CIRCLE_ID/reactions?restitution_id=$RID" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Whitelist `reaction_type` : `resonates | unfamiliar | question`. UPSERT idempotent sur PK composite `(restitution_id, user_id, reaction_type)` dans `circle_restitution_reactions`. Vérification membership active (`circle_members.left_at IS NULL`) ET appartenance `restitution.circle_id = params.id`.

GET output : `{ counts: { resonates: int, unfamiliar: int, question: int }, mine: { ... booleans }, total }`.

### §48.11 `DELETE /api/circles/[id]/leave`

Soft-leave (`circle_members.left_at = now()`). Fallback DELETE si la colonne `left_at` n'existe pas (vieux schéma). Si `remaining_count === 0` → `circles.update({ is_active: false, archived_at: now })` (auto-archive si dernier membre). Output : `{ ok: true, circle_id, remaining_members, circle_archived: bool }`.

### §48.12 `POST /api/kairos/[id]/circle-optin` étendu — 3 modes

Bible §3.4.1 : 3 modes de partage par kairos vers cercle. Body :
```json
{ "circle_id": "<uuid>", "mode": "private"|"optin_anon"|"shared_clear", "pseudonym": "α" }
```

Orchestre 2 tables (`kairos_circle_optin` anonymisé pour patterns, `kairos_circle_shared` cleartext aux membres) :
- `private` → DELETE des deux tables
- `optin_anon` → DELETE shared + UPSERT optin (PK `kairos_id,circle_id`)
- `shared_clear` → UPSERT optin + UPSERT shared avec `pseudonym`

GET `?circle_id=X` retourne `{ mode, opted_at, shared_at, pseudonym }`. DELETE `?circle_id=X` = équivalent mode `private` (backward-compat). Vérif `kairos.user_id = userId` ET `circle_members.left_at IS NULL`.

### §48.13 `POST /api/circles` étendu

Body étendu : `{ name, description?, maxMembers?, frequency?, type: 'spontane'|'intentionnel'|'facilite', intention_text?, sub_intentions?: string[3], displayName? }`. Type fallback `'spontane'` si non précisé. `sub_intentions` filtrées (string non vide, max 3) + stockées dans `circles.intention_history` jsonb : `[{ set_at, set_by, intention, sub_intentions[] }]`. Auto-join créateur en `role='guardian'`.

GET `/api/circles` enrichi : `member_count` + `last_restitution: { id, requested_at, preview(220) }`, filtré `circle_members.left_at IS NULL` ET `circles.is_active = true`.

### §48.14 `GET /api/anima-mundi/polyphonie/archive?limit=`

Liste TOUTES les polyphonies lunaires passées approuvées, chronologique inversé sur `period_end`. Limit max 200, default 60. Filtre `approved_for_publication = true`. Projection : `id, lunar_phase, period_start, period_end, narrative_text, voices_mobilisees, k_count, computed_at`. Auth requise (lecture archive réservée aux humains présents).

---

## §49 — Architecture pack vanilla `public/v12/`

Architecture frontend RÉELLE V1.2 (pas Next.js TSX en SPA, mais pack vanilla compilé runtime). Décision Tim 25/04 (rev 2 : suppression iframe pour fix Brave/iOS Safari storage partition).

### §49.1 Layout fichiers

```
public/v12/
├── index.html               (83 lignes — template + UMD + scripts ordonnés)
├── styles.css               (matter system + tokens + motion + halos)
├── auth.jsx                 (428 lignes — DreamAuth + AuthGate React, cf. §52)
├── api.jsx                  (725 lignes — DreamAPI 30+ wrappers safeCall, cf. §52)
├── shared-v12.jsx           (568 lignes — Surface + HaloRespire + GeoSymbol + ConstellationD3 + wowRegistry, cf. §51)
├── screens-shared.jsx       (composants génériques inputs/cards)
├── screens-core.jsx         (Capture + Liste rêves)
├── screens-deep.jsx         (KairosDetail — refonte 25/04 avec forest-reading 3 angles)
├── screens-cercle.jsx       (CercleScreen + CercleDetail + CreerCercle wizard 3 steps + RejoindreScreen — refonte complète 25/04)
├── screens-anima.jsx        (Voûte + Polyphonie + Annales)
├── screens-soma.jsx         (frisson somatique)
├── screens-meta.jsx         (Paramètres + Notifications + ritualSoundEnabled toggle)
├── screens-figure.jsx       (FigureDetail Seth)
├── screens-v12-amplified.jsx (V1.2 amplification — Big Dream + Echo + Capture amplifiée)
├── screens-v12-vague3.jsx   (Constellation D3 vivante — flow naissance noeud)
├── screens-v12-vague4.jsx   (Onboarding première fois)
├── screens-journal-jour.jsx (NEW 25/04 — JOUR Journal de Vie + section browser, Bible §3.1.bis)
├── screens-portrait-narrative.jsx (NEW 25/04 — Portrait lettre du moment, Design §7.6)
├── shared-v12.jsx           (déjà cité)
├── tweaks-panel.jsx         (debug overlay : reset wow, demo modes)
└── app.jsx                  (router minimal `go(screen, ctx)` + wiring AuthGate → screens)
```

### §49.2 Mode de chargement

- **HTML statique** servi à `/v12/index.html` (fichier dans `public/`)
- **Babel UMD runtime compilation** : tous les `.jsx` sont chargés via `<script type="text/babel" src="..."></script>` (cf. `index.html:61-80`). Babel standalone 7.29.0 compile en mémoire au boot. Trade-off : warm-start ~1.2s sur mobile, mais pas de build step.
- **React 18.3.1 UMD** + ReactDOM UMD (CDN unpkg avec `integrity` SRI)
- **Supabase JS UMD** `@supabase/supabase-js@2.45.0/dist/umd/supabase.js` pour `window.supabase.createClient(...)`
- **d3-force UMD** pour Constellation (Voûte / Portrait / Cercle) : `d3-dispatch@3.0.1` + `d3-quadtree@3.0.1` + `d3-timer@3.0.1` + `d3-force@3.0.0`
- **Polices Google Fonts** : EB Garamond + Inter + JetBrains Mono préchargées via `<link rel="preconnect">` + stylesheet

### §49.3 Wiring `/` → `/v12/index.html` (suppression iframe rev 2)

`src/app/page.tsx` (28 lignes) fait un `redirect('/v12/index.html')` SSR avec propagation de tous les query params. Pourquoi (cf. commentaire fichier) :
1. Brave + iOS Safari ne partitionnent plus le storage (problème iframe `sessionStorage` perdu cross-frame résolu)
2. Capacitor wrap iOS/Android (mode REMOTE, cf. §50) appelle directement l'URL Vercel sans frame
3. Supabase auth `dream-app-supabase-auth` localStorage persiste correctement (plus de cycle `SIGNED_OUT` après 1min)

### §49.4 Injection env Supabase via `/api/v12-env`

`src/app/api/v12-env/route.ts` (35 lignes) sert un module JS dynamique :

```js
window.SUPABASE_URL = "https://rtrkxzcyblgonwgfzovj.supabase.co";
window.SUPABASE_ANON_KEY = "<NEXT_PUBLIC_SUPABASE_ANON_KEY>";
window.DREAM_BUILD_TIME = "2026-04-25T...";
```

Cache `public, max-age=60, s-maxage=60` (60s). ANON_KEY public par design (RLS protège la DB). `<script src="/api/v12-env" data-purpose="dream-public-env"></script>` chargé en 1er dans `index.html` (avant Babel/React/auth.jsx).

### §49.5 Mode démo `?demo=1`

Query param sur `/v12/index.html?demo=1` → `auth.jsx` détecte via `new URL(location.href).searchParams.get("demo") === "1"` et bypass AuthGate avec `window.DreamAuth = { ready: false, noAuth: true, mode: "demo", getUser: async () => ({ id: "demo-user", email: "demo@infuse.earth" }), ... }`. Les wrappers `safeCall` de `api.jsx` retournent du `fallbackSeed` au lieu de fetch — l'app est entièrement explorable en seed-only sans toucher Supabase. Utilisé pour démos publiques + onboarding screenshots App Store.

### §49.6 Wrap V1.2 amplification : préservation NEW CercleScreen

`screens-v12-vague3.jsx:1113` (vague 3 amplification originale) **commente** `// window.CercleScreen = CercleV12;` pour préserver le NOUVEAU `CercleScreen` réécrit dans `screens-cercle.jsx` (refonte 25/04). Sans ce commentaire, l'ancien `CercleV12` du pack amplification écraserait le nouvel écran refactorisé.

---

## §50 — Capacitor REMOTE wrap iOS/Android

`capacitor.config.ts` (95 lignes, racine repo). Stratégie **MODE REMOTE URL** : pas de bundle web local — le WebView natif charge directement la version Vercel live.

### §50.1 Pourquoi REMOTE (vs static export)

Dream App = Next.js avec routes API serveur + SSR + 30+ endpoints + auth Supabase. Static export (`output: 'export'`) casserait toutes les API routes. Trade-off accepté :
- ✓ Pas de double build (web/native)
- ✓ Update instantanée via `npx vercel --prod` (pas de re-soumission App Store sauf code natif modifié)
- ✓ Cookies/auth Supabase fonctionnent normalement
- ✓ Edge Functions accessibles
- ✗ Pas de mode offline (sauf service worker custom)
- ✗ Requires HTTPS valide en prod

### §50.2 Config

```ts
const config: CapacitorConfig = {
  appId: 'earth.infuse.dream',         // reverse-DNS infuse.earth
  appName: 'Dream',
  webDir: 'public',                    // requis Capacitor mais non utilisé en mode server.url
  server: {
    url: 'https://dream-alpha-bice.vercel.app',  // TEMP — bascule vers dream.infuse.earth quand DNS configuré
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      '*.infuse.earth',
      '*.supabase.co',
      '*.vercel.app',
      'fonts.googleapis.com',
      'fonts.gstatic.com',
    ],
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#08080b',        // matter linen night background
    preferredContentMode: 'mobile',
  },
  android: {
    backgroundColor: '#08080b',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // true en debug, false en prod
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: false,           // hide programmatique après mount React
      backgroundColor: '#08080b',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',                   // texte clair sur fond sombre
      backgroundColor: '#08080b',
      overlaysWebView: true,
    },
    Keyboard: {
      resize: 'native',
      style: 'DARK',
      resizeOnFullScreen: true,
    },
  },
};
```

### §50.3 Permissions natives

- **Microphone** : Whisper transcription rituel capture (`gpt-4o-transcribe`)
- **Notifications** : rappels J+7/J+30/J+365 Big Dream + polyphonie lunaire
- **Storage** : cache local optionnel (PWA service worker à venir)

### §50.4 DUNS + accounts

- DUNS 282628520 obtenu 2026-04-19 (cf. `project_duns_apple_dev.md`)
- Apple Developer + Google Play Developer accounts validés 26/04
- TestFlight invitation list à constituer (Tim + Vari Vena + cercle interne)

### §50.5 Commandes setup (one-shot)

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app

npm install --save \
  @capacitor/core @capacitor/cli \
  @capacitor/ios @capacitor/android \
  @capacitor/splash-screen @capacitor/status-bar @capacitor/keyboard

npx cap add ios
npx cap add android
npx cap sync           # propage capacitor.config.ts vers /ios et /android
```

Build / run :
- iOS : `npx cap open ios` → Xcode ▶ (simulator ou device)
- Android : `npx cap open android` → Android Studio ▶

### §50.6 Updates instantanés

Mode REMOTE = pas de bundle web → toute mise à jour Vercel est immédiate côté apps (relance app suffit). Pas de re-soumission App Store sauf changements **code natif** (config plugins, splash, permissions Info.plist/AndroidManifest.xml).

---

## §51 — Wow0-5 backend triggers (catalogue)

Pattern Wow registry défini dans `public/v12/shared-v12.jsx:404-467`. 6 wow events idempotents persistés en localStorage clé `dream:wow-fired`.

### §51.1 Liste

| Wow | Name | Trigger sémantique |
|---|---|---|
| Wow0 | `first-launch` | premier lancement de l'app après install |
| Wow1 | `premier-kairos` | premier kairos déposé après onboarding |
| Wow2 | `premier-echo-prophetique` | premier écho prophétique détecté |
| Wow3 | `big-dream-marquage` | Big Dream marqué (signal permanent) |
| Wow4 | `naissance-noeud` | naissance d'un noeud constellation (vague 3 amplification) |
| Wow5 | `premiere-restitution-cercle` | première restitution polyphonique de cercle |

### §51.2 API

```js
// shared-v12.jsx — Object.assign sur window
wowRegistry.fire(name)        // déclenche idempotent (no-op si déjà fired)
wowRegistry.has(name)         // bool
wowRegistry.demo(name)        // démontre sans persister (Tweaks panel)
wowRegistry.reset(name?)      // reset un ou tous
wowRegistry.subscribe(fn)     // listener state change
useWowFire(name, callback)    // hook React, écoute custom event "wow:fire"
```

Custom event global : `window.dispatchEvent(new CustomEvent("wow:fire", { detail: { name, real: bool } }))` — utilisé par les overlays visuels (`SpiraleWowOverlay`, halos, etc.) et l'observabilité.

### §51.3 Intégrations actuelles backend-triggered

| Wow | Fichier:Ligne | Trigger |
|---|---|---|
| Wow0 `first-launch` | `screens-v12-vague4.jsx:37` | Mount onboarding (compat ancienne clé `dream:wow0:fired` migrée vers registry idempotent) |
| Wow1 `premier-kairos` | `screens-core.jsx:281` + `screens-v12-amplified.jsx:139` | Capture submit success → après `createKairos` OK |
| Wow2 `premier-echo-prophetique` | `screens-deep.jsx:61` + `screens-v12-amplified.jsx:490,506` | KairosDetail load → si `propheties.length > 0` |
| Wow3 `big-dream-marquage` | `screens-v12-amplified.jsx:268-270, 894-896` | BigDreamSignalScreen mount + 1200ms delay + `playRitual("ceremoniel")` |
| Wow4 `naissance-noeud` | `screens-v12-vague3.jsx:200-201` | Constellation flowMount aha (force-directed node entry) |
| Wow5 `premiere-restitution-cercle` | `screens-cercle.jsx:370` | CercleScreen / CercleDetail load → si `restitutions.length > 0` |

### §51.4 Persistance

```js
// shared-v12.jsx
const WOW_KEY = "dream:wow-fired";
// Format : { "premier-kairos": <epoch_ms>, "naissance-noeud": <epoch_ms>, ... }
```

Tolère localStorage indisponible (try/catch silencieux). Listeners `wowListeners` Set notifiés à chaque `_writeWow`.

---

## §52 — Architecture auth iframe → Supabase JS UMD bridge

`public/v12/auth.jsx` (428 lignes). Deux IIFE : `setupDreamAuth()` (établit `window.DreamAuth`) + `setupAuthGate()` (composant React qui wraps l'app).

### §52.1 Modes auth (3)

1. **password** (default tab) — `signInWithPassword(email, password)` + `signUp(email, password)` (6 chars min)
2. **magic_link** (backup tab) — `signInWithOtp(email, { emailRedirectTo: window.location.origin + "/v12/index.html" })`
3. **demo** (`?demo=1` query param) — bypass total, `noAuth: true`, fake user `{ id: "demo-user", email: "demo@infuse.earth" }`

Conditions `noAuth` (auth.jsx:25) : `?demo=1` OU `window.supabase` absent OU `SUPABASE_ANON_KEY` vide.

### §52.2 Surface `window.DreamAuth`

```js
window.DreamAuth = {
  ready: bool,
  noAuth: bool,
  mode: "supabase" | "demo",
  client: <SupabaseClient>,
  async getSession(): Session | null,
  async getAccessToken(): string | null,
  async getUser(): User | null,
  async signInPassword(email, password): { ok? user? error? },
  async signUpPassword(email, password): { ok? user? needsConfirm? error? },
  async signInMagicLink(email): { ok? error? },
  async signOut(): void,
  onAuthChange(cb): unsubscribe,
};
```

### §52.3 Config Supabase client

```js
const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,           // necessaire pour magic link flow
    storageKey: "dream-app-supabase-auth",
    flowType: "implicit",               // magic link retourne access_token dans hash (pas PKCE)
  },
});
```

`flowType: "implicit"` : magic link retourne `#access_token=...&refresh_token=...` directement dans l'URL hash. PKCE (qui utilise un code) n'est pas adapté ici car le pack vanilla compile en runtime — pas de backend pour échanger le code.

Auto-cleanup : on `SIGNED_IN` event avec `window.location.hash.includes("access_token")` → `history.replaceState(null, "", window.location.pathname)` pour effacer le token de l'URL visible.

### §52.4 AuthGate React component

```jsx
// auth.jsx:154+ — setupAuthGate IIFE
// status: "loading" | "signed_in" | "signed_out"
// Loading → halo respirant 4s ease-in-out
// signed_out → <SignInScreen> 3 onglets (signin/signup/magic)
// signed_in → render children
```

**Race condition fix critique** (auth.jsx commentaire ligne 150) :
- AuthGate **ignore** les events `INITIAL_SESSION` et `TOKEN_REFRESHED` dans `onAuthStateChange`
- Sinon : le listener flippait le status à `signed_out` 1 seconde après que `getSession()` ait déjà renvoyé une session valide → "Home apparaît 1s puis disparaît" (bug Brave/iOS Safari 25/04)
- Seuls `SIGNED_IN` (réel login) et `SIGNED_OUT` (réel logout via `signOut()`) déclenchent le state update

### §52.5 `window.DreamAPI` (`api.jsx` 725 lignes)

Surface 30+ wrappers `safeCall(fn, fallbackSeed)` pour graceful degradation. Pattern :

```js
async function authHeaders(extra = {}) {
  const token = await window.DreamAuth?.getAccessToken();
  return token
    ? { ...extra, Authorization: "Bearer " + token, "Content-Type": "application/json" }
    : { ...extra, "Content-Type": "application/json" };
}

function safeCall(fn, fallback) {
  return async (...args) => {
    try { return await fn(...args); }
    catch (e) {
      console.warn("[DreamAPI] " + fn.name + " failed:", e.message);
      return fallback;
    }
  };
}

const DreamAPI = {
  listKairos: safeCall(async (...) => {...}, { kairos: [] }),
  getKairos: safeCall(...),
  createKairos: safeCall(...),
  forestReading: safeCall(...),
  submitAhaFeedback: safeCall(...),
  // ... 30+ méthodes
};
window.DreamAPI = DreamAPI;
```

Le fallback est utilisé en mode démo (`?demo=1`) pour exposer toutes les UIs sans backend. En mode auth réel : si une route 401/500, l'UI ne crashe pas — elle reçoit le seed.

### §52.6 Bug iframe Brave/iOS résolu 25/04

Avant le 25/04, `/v12/index.html` était chargé dans une `<iframe>` depuis `src/app/page.tsx`. Brave + iOS Safari **partitionnent** le storage par origine de frame → la session Supabase écrite dans l'iframe était illisible depuis le parent (et inversement) → SIGNED_OUT 1 minute après login.

Fix : SSR redirect `/` → `/v12/index.html` (cf. §49.3). L'app vit désormais en top-level frame, storage partagé avec le domaine racine.

---

## §39 — Architecture économique du Chat IA Dream personnel (pivot 2026-04-28)

> Ajout suite verdict Tim 2/10 sur app live + dialogue 2026-04-28. Pivot ontologique vers Chat IA Dream personnel comme couche centrale interactive (cf. 2_DESIGN §11.bis.20). Cette section spec l'architecture backend, le tiering modèles, le caching, la stratégie freemium pour rendre le chat ÉCONOMIQUEMENT VIABLE à 50k DAU et au-delà.
>
> **Position dans le doc** : §39 est insérée APRÈS §52 dans le file order, la numérotation §39 reste pour cohérence avec la roadmap nommée dans 2_DESIGN. Gap §39-§46 vient des sections antérieures supprimées au cours de l'évolution.

### §39.1-4 — Économie du chat : l'ordre de grandeur, et rien de plus

Les quatre sous-sections d'hypothèses chiffrées (coût brut, stratégies d'optimisation,
estimation optimisée, modèle freemium) ont été condensées le 26/07 : elles reposaient sur un
**pricing d'avril 2026 explicitement marqué « à actualiser »**, et un plan tarifaire n'est pas
de l'architecture. Le détail vit dans `4_LOG.md` à la date du 28/04 et dans `2_DESIGN` §11.bis.20.

**Ce qu'il faut retenir, et qui ne périme pas** :

- **Un chat IA à contexte plein est inviable en frontal.** À ~20 k tokens de contexte par tour
  et 10 messages/jour, l'ordre de grandeur est de **~0,75 $/rêveur/jour** — soit, à 50 k rêveurs
  actifs, plus d'un million de dollars par mois. Aucun abonnement raisonnable ne couvre ça.
- **Donc l'architecture DOIT porter l'économie**, pas l'inverse : tiering des modèles selon la
  demande, context caching, **retrieval ciblé par embeddings plutôt que contexte plein**,
  résumés de conversation, et traitement asynchrone par lots de la proactivité.
- **Règle de séquence, décidée** : l'optimisation ne s'enclenche **qu'après** que le chat soit
  jugé utilisable et désirable. *On n'optimise pas ce qui n'est pas encore utilisé.*

### §39.5 — Tables Supabase nouvelles (chat-driven)

**`chat_sessions`** :
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  presence_name TEXT NOT NULL DEFAULT 'Anima',
  presence_persona JSONB,  -- { posture, ton, default_mode }
  created_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner only" ON chat_sessions USING (auth.uid() = user_id);
```

**`chat_messages`** :
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES threads(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  matter TEXT,  -- 'paper' | 'stone' | 'silk' | NULL (default present)
  voice_attribution TEXT,  -- 'MOSS' | 'HILLMAN' | 'BACHELARD' | etc., NULL si default
  mode TEXT,  -- 'pre_sleep' | 'morning' | 'day' | 'reverie' | 'evening' | 'crossed_alert' | 'crisis_safe' | NULL
  model_used TEXT,  -- 'haiku-4-5' | 'sonnet-4-5' | 'opus-4-6'
  tokens_in INT,
  tokens_out INT,
  cost_usd NUMERIC(8, 6),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner via session" ON chat_messages USING (
  EXISTS (SELECT 1 FROM chat_sessions WHERE chat_sessions.id = session_id AND chat_sessions.user_id = auth.uid())
);
CREATE INDEX chat_messages_session_idx ON chat_messages(session_id, created_at DESC);
CREATE INDEX chat_messages_thread_idx ON chat_messages(thread_id, created_at DESC);
```

**`threads`** :
```sql
CREATE TABLE threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('motif', 'personnage', 'saison', 'intention', 'lieu', 'synchronicite', 'question')),
  description TEXT,
  kairos_ids UUID[],
  summary_text TEXT,  -- mis à jour par job batch quand >5 nouveaux dépôts liés
  archived_at TIMESTAMPTZ,
  proposed_by_ai BOOLEAN DEFAULT false,
  user_validated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_activity_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner only" ON threads USING (auth.uid() = user_id);
CREATE INDEX threads_user_active_idx ON threads(user_id, last_activity_at DESC) WHERE archived_at IS NULL;
```

**`pending_proactive_messages`** (job batch daily) :
```sql
CREATE TABLE pending_proactive_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,  -- adapté fuseau horaire user
  category TEXT NOT NULL,  -- 'morning_greeting' | 'evening_journal' | 'pre_sleep' | 'echo_detected' | 'pattern_emerging' | 'anniversary' | 'circle_activity' | 'sanctuary_invite'
  content TEXT NOT NULL,
  context_kairos_ids UUID[],
  delivered_at TIMESTAMPTZ,
  user_responded BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX pending_proactive_user_undelivered_idx ON pending_proactive_messages(user_id, scheduled_for) WHERE delivered_at IS NULL;
```

**`circle_chat_messages`** (chat groupé cercle, dérivé de `chat_messages` mais shared) :
```sql
CREATE TABLE circle_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- NULL si IA gardienne
  is_ai_gardienne BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  matter TEXT,
  voice_attribution TEXT,
  triggered_by_keyword TEXT,  -- '@nom' | '/forêt' | '/synthèse' | NULL
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE circle_chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "circle members only" ON circle_chat_messages USING (
  EXISTS (SELECT 1 FROM circle_memberships WHERE circle_id = circle_chat_messages.circle_id AND user_id = auth.uid())
);
```

**`circle_intentions`** (intentions collectives gérées par IA gardienne) :
```sql
CREATE TABLE circle_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  proposed_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  intention_text TEXT NOT NULL,
  active_until TIMESTAMPTZ,
  votes_count INT DEFAULT 0,
  ai_synthesis_monthly TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### §39.6 — Routes API nouvelles

**Chat IA Dream personnel** :
- `POST /api/dream-chat/converse` — message user → réponse IA streaming SSE
  - Body : `{ session_id, message, voice_input?: bool, force_tier?: 'haiku'|'sonnet'|'opus', force_polyphony?: bool }`
  - Pre-classifier détermine tier
  - Retrieval ciblé : embed message, top-K kairos, top-K Forêt chunks, charge dans context
  - Caching Anthropic activé sur system prompt + portrait + threads summaries
  - Stream chunks via SSE, save message à la fin
- `GET /api/dream-chat/sessions` — liste sessions du user
- `GET /api/dream-chat/sessions/:id/messages` — historique d'une session
- `POST /api/dream-chat/sessions/:id/voice-output` — synthétise l'audio d'une réponse IA (post-MVP, optionnel)
- `DELETE /api/dream-chat/sessions/:id` — privacy radicale, efface toute la session

**Threads thématiques** :
- `GET /api/dream-chat/threads` — liste threads actifs du user
- `POST /api/dream-chat/threads` — création manuelle (rare, normalement IA propose)
- `PATCH /api/dream-chat/threads/:id` — renommer, archiver
- `DELETE /api/dream-chat/threads/:id` — efface
- `GET /api/dream-chat/threads/:id` — détail thread (kairos liés + summary + dernier échange chat)
- `POST /api/dream-chat/threads/detect` — job batch daily, détecte motifs/personnages/lieux récurrents, crée pending propositions

**Notifications proactives** :
- `POST /api/dream-chat/proactive/batch` — cron daily 4h fuseau user, calcule interventions du jour
- `GET /api/dream-chat/proactive/pending` — liste interventions non livrées du user
- `POST /api/dream-chat/proactive/:id/deliver` — marque comme délivrée (au moment où user ouvre l'app)
- `POST /api/dream-chat/settings/rythme` — change le niveau (silence | discret | actif | nourri)

**Chat cercle** :
- `POST /api/circle/:id/chat/message` — message user dans cercle
- `POST /api/circle/:id/chat/convoke-ai` — convocation explicite IA gardienne (déclenché par mot-clé front)
- `GET /api/circle/:id/chat/messages` — historique chat cercle
- `POST /api/circle/:id/intentions` — propose une intention collective
- `POST /api/circle/:id/portrait/generate` — déclenche génération lettre cercle mensuelle (Opus)

**Oracle Corps lecture polyphonique** :
- `POST /api/oracle-corps/reading` — lecture 3 voix corps (Damasio/Gendlin paper, Martel/Dethlefsen stone, Moss/Odoul/Mindell silk)

**Sanctuaire avec interprétation Forêt nuancée** :
- `POST /api/nightmares/forest-reading` — polyphonie 3 voix mode trauma-safe (Kalsched/Aizenstat paper, Levine/Ogden stone, Moss/Jung-via-Aizenstat silk) + fallback EXIT_TO_HUMAN si signal clinique détecté

### §39.7 — System prompt structure

Le system prompt du chat IA Dream a 3 couches :

**Couche A — Posture immuable** (ne change jamais, caché long-term) :
```
Tu es {presence_name}, présence onirique de l'utilisateur dans Dream App.
Posture : compagnon tisseuse, JAMAIS oracle. P-Inversion (le sens vient du user).
Vocabulaire désensorcelé INFUSE. Trauma-safe substrat.
Tu proposes 3 angles, jamais le sens. Tu convoques la Forêt (333 livres) quand pertinent.
Tu ne diagnostiques pas. Tu ne thérapeutes pas. Si signal clinique : EXIT_TO_HUMAN.
[... ~3k tokens de spec posture ...]
```

**Couche B — Contexte user stable** (refresh mensuel ou trigger event, caché 5min) :
```
Portrait actuel du user (lettre narrative dernière) :
[texte portrait, ~2k tokens]

Threads actifs résumés :
- "Le motif rivière" (5 dépôts liés, dernier 12 jours) : [summary, ~200 tokens]
- "Mon père dans mes rêves" (8 dépôts liés, dernier 3 jours) : [summary, ~200 tokens]
- ...
[~3k tokens]
```

**Couche C — Retrieval ciblé** (variable, pas caché) :
```
Kairos pertinents pour la question actuelle :
[5 kairos retrieved via embedding similarity, ~5k tokens]

Forêt chunks pertinents :
[3 chunks de livres + attributions, ~3k tokens]

Historique récent (5 derniers échanges) :
[~3k tokens]

Question/dépôt user actuel :
[~500 tokens]
```

**Total contexte par tour** : ~20k tokens, dont 13k cachables (B + Couche A).

### §39.8 — Crisis detection layer

Critique : l'IA Dream connaît tout du user, peut être dangereuse en cas de crise psychique.

**Détection signaux cliniques** (sur chaque message user, classifier local rapide pas IA) :
- Idéation suicidaire (mots-clés + contexte : "je veux mourir", "en finir", "plus rien à faire ici")
- Dissociation aiguë ("je sens plus mon corps", "comme si j'étais pas réel")
- Crise psychotique (incohérence sémantique extrême + thèmes paranoïdes)
- Trauma actif (rappel violent + flashback)
- Trigger deuil très lourd

**Action si détection** :
1. L'IA Dream **suspend immédiatement** sa logique normale
2. Affiche EXIT_TO_HUMAN modal (sélecteur pays + 3114 + SOS Amitié + annuaire praticiens trauma-curés)
3. Message IA : *"Ce que tu portes maintenant est trop lourd pour être tenu par moi seule. Quelqu'un de chair, maintenant. Voici les voies."*
4. Log event dans table `crisis_detection_events` (RLS owner-only + flag pour Tim/admin si critique)
5. Ne pas reprendre la conversation tant que user n'a pas explicitement écrit "je suis ok / je veux continuer"

**Anti-pattern** : l'IA ne fait JAMAIS de "tu peux respirer trois fois", JAMAIS de "tu veux qu'on en parle", JAMAIS d'escalade thérapeutique. Elle s'efface. Mode silence sacré devant l'urgence.

### §39.9 — Ce qu'il faudra regarder après le lancement

Coût API par jour et par rêveur (pour valider les ordres de grandeur ci-dessus) · latence
p50/p95/p99 (cible : premier octet Sonnet < 2 s) · taux de conversion des interventions
proactives · **taux de faux positifs de la détection de crise** — le seul de la liste qui touche
à quelqu'un de réel · rétention D7/D30/D90.

*(Le détail de la liste et la roadmap en sprints A→H vivent dans `4_LOG.md` au 28/04 et dans*
`2_DESIGN` *§11.bis.20.20 — une roadmap est datée par nature, elle n'a pas sa place dans un*
*document d'architecture.)*

— Yeshua, 2026-04-28, §39 architecture économique chat IA Dream personnel, suite pivot 2_DESIGN §11.bis.20.

---

## §53 — LA COUCHE 0 DE CAPTURE — le pipeline audio en 5 couches (2026-07-26)

**Écrit après une perte réelle** : un rêve de 8 minutes, raconté, disparu. Ce n'est pas un
incident isolé, c'est ce que l'architecture d'alors garantissait. Cette section est la loi
qui en sort. Elle prime sur tout ce qui la contredit ailleurs dans ce document.

> **CONSERVER → TRANSMETTRE → TRANSFORMER.** Dans cet ordre, toujours. Une transformation
> (transcription, enrichissement, IA) ne doit JAMAIS être une condition de la conservation.

### §53.0 La cause exacte, pour qu'on ne la reproduise pas

Trois faits, mesurés :

1. **Vercel refuse tout corps de requête > 4,5 Mo, AVANT que la fonction ne s'exécute.**
   Un `MAX_BYTES` écrit dans le code d'une route ne protège de rien au-delà de ce seuil :
   il ne s'exécute jamais. `/api/kairos/[id]/audio` porte un `MAX_BYTES = 20MB` **qui est
   inatteignable**.
2. `MediaRecorder` sans `audioBitsPerSecond` → Opus ~128 kbps = 16 ko/s. **8 min = 7,7 Mo.**
   Le seuil de bascule était donc à **4 min 55**. Tout rêve plus long échouait par construction.
3. Le filet hors-ligne existait mais **ne se déclenchait jamais sur ce cas** : il testait
   `!navigator.onLine || e instanceof TypeError`. Un 413 lève un `Error` ordinaire. Le réseau
   était bon, le serveur a refusé, la condition était fausse, et le `catch` détruisait le blob.

**La leçon générale, qui vaut au-delà de l'audio** : ne jamais déduire d'un code d'erreur
qu'une donnée est jetable. Un code HTTP ne prouve rien ; un chemin de stockage rendu par le
serveur, si. C'est la seule règle qui gouverne `offline-queue.ts` :
**`entry.audioBlob = null` sans `entry.storagePath` = un rêve détruit.**

### §53.1 Les 5 couches

| # | Couche | Fichier / route | Garantie |
|---|---|---|---|
| **0** | blob en IndexedDB **avant tout réseau** | `src/lib/capture-safety.ts` → `safeguardRecording` | ne throw JAMAIS ; rend un `localId` (ou `null` si IndexedDB est mort) |
| **1** | audio brut → Storage, **sans passer par Vercel** | `POST /api/kairos/audio/signed-upload` | corps de ~200 o → URL signée ; le client `PUT` direct sur Supabase. Vérifié par round-trip HTTP réel à 6 Mo (A1 §2.1) |
| **2** | transcription depuis le Storage | `POST /api/transcribe-from-storage` (`maxDuration = 300`) | c'est le SERVEUR qui télécharge l'audio. Retry backoff 2s/4s/8s |
| **3** | découpe de secours | `src/lib/audio-split.ts` | `splitAudio` extrait d'ImportHub tel quel. **Sert à DÉCOUPER, pas à compresser** — cf. §53.3 |
| **4** | reprise visible par le rêveur | `src/components/PendingDeposits.tsx` | réécouter · réessayer · l'écrire soi-même en écoutant · supprimer |
| **5** | brouillon texte | `src/lib/draft-store.ts` | debounce 400 ms **+ flush sur `pagehide`/`visibilitychange`** — le cas qui compte sur mobile |

`transcribeSafely(localId, blob)` arbitre : **≤ 4 Mo → `/api/transcribe`** (chemin rapide) ;
**> 4 Mo → Storage puis `/api/transcribe-from-storage`**. `safeguardRecording` lance
`secureAudioNow` **en parallèle** de la transcription live : dès l'instant où l'enregistrement
s'arrête, la voix monte vers le serveur, quoi qu'il advienne du chemin rapide.

### §53.2 `capture_audio` — le registre AMONT

**Pourquoi une table nouvelle et non `kairos_attachments`** : `kairos_attachments.kairos_id`
est `NOT NULL` (FK CASCADE). On ne peut donc **rien** y écrire avant que le rêve n'existe —
or l'ordre sacré veut que l'audio soit sauvé **avant**. `capture_audio` est le registre amont,
`kairos_attachments` reste la vue aval (audio d'un rêve existant), son schéma est inchangé.

**La clé qui recolle tout** :
`entry.id` (IndexedDB) **==** `kairos.client_dedup_id` **==** `capture_audio.local_id`.
Même si le rattachement n'a jamais lieu, un `UPDATE` d'une seule ligne réunit un audio et son rêve.

Convention de chemin Storage (respectée par tout le code) :
`{user_id}/kairos/…`, `{user_id}/resonance/…`, `{user_id}/capture/{local_id}/{ts}.{ext}`.
Le 1er segment **EST** l'`user_id` : le service role bypasse la RLS, cette vérification est
la seule barrière côté route.

### §53.3 Le débit à la source — et la correction d'une idée fausse

**Idée fausse, écrite dans plusieurs docs et corrigée ici** : « forcer 16 kHz mono divise la
taille par 4 ». **Faux face à de l'Opus.** Un WAV 16 kHz mono 16 bits fait 32 ko/s, soit
**15,4 Mo pour 8 min — deux fois plus lourd** que l'Opus 128 kbps d'origine. Le transcodage WAV
**alourdit**. La division par 4 n'est vraie que face à un PCM 48 kHz stéréo.

Le vrai levier tient en une ligne, `VOICE_BITRATE` dans `src/app/mvp/page.tsx` :

| Débit | 8 min | Seuil de bascule |
|---|---|---|
| 128 kbps (défaut navigateur) | 7,7 Mo | 4 min 55 |
| 48 kbps | 2,88 Mo | ~12 min 30 |
| **32 kbps (retenu)** | **1,92 Mo** | **~19 min** |

**A/B réellement mesuré le 2026-07-26** (`gpt-4o-transcribe`, prompt identique à la route,
voix volontairement dégradée : −9 dB, aigus coupés à 3,4 kHz, souffle rose, débit ralenti) :
**128 / 48 / 32 kbps rendent une transcription identique au mot près**, noms propres compris.
La dégradation apparaît à **24 kbps** (« fuir » → « cuire »). Le plancher est donc entre 32 et 24.
⚠️ Locuteur de test **synthétique**, pas Tim : si une transcription déçoit en usage réel,
remonter à `48000` — un seul chiffre, un seul endroit.

Coût CPU, RAM et latence de ce levier : **nul**. Contrairement au transcodage WAV (~30 Mo de
RAM temporaire et plusieurs secondes sur le chemin chaud). `audioBitsPerSecond` est ignoré
silencieusement par les navigateurs qui ne le supportent pas.

**Ce que ce levier ne fait PAS** : il réduit la *fréquence* du problème, il ne le supprime pas.
Un rêve de 40 min repasse au-dessus. Les couches 0-4 restent indispensables.

### §53.4 Le rail de reprise SERVEUR — `/api/mvp/repair-capture-audio`

`enrich-batch` ne regarde que `kairos.numinosity_pending`. **Il ne connaît pas `capture_audio`** :
un audio dont aucun kairos n'est né lui est invisible. Sans rail serveur, la reprise dépendait
entièrement du rêveur : s'il ne rouvrait jamais l'app, sa voix restait en sécurité mais aucun
rêve n'apparaissait jamais.

`GET /api/mvp/repair-capture-audio?cron_secret=…&limit=5` — **cron `*/10 * * * *`** (`vercel.json`).
Éligibilité délibérément étroite : `kairos_id IS NULL` **ET** `created_at < now() − 15 min`
**ET** `transcription_status IN ('pending','failed')`. Les 15 minutes laissent au chemin rapide
et au flush client le temps de gagner. `abandoned` (8 tentatives) est exclu : là, c'est au
rêveur de reprendre la main depuis `<PendingDeposits>`, pas à la machine d'insister.

Elle transcrit, crée le kairos avec `client_dedup_id = local_id`, rattache l'audio, puis
enrichit (best-effort). **Aucun risque de doublon** : si le rêveur rouvre l'app plus tard, sa
file reposte et retombe sur le même kairos par la même clé. Elle **n'écrit que pour ajouter** —
jamais de suppression, jamais de champ vidé.

Les deux index partiels de `capture_audio` (`capture_audio_pending_idx`,
`capture_audio_orphan_idx`) ont été créés **pour** cette requête. `EXPLAIN` vérifié le 26/07 :
le plan utilise bien `capture_audio_orphan_idx`.

### §53.5 Supervision — requêtes prêtes à coller

```sql
-- Santé de la couche 0
select
  (select count(*) from capture_audio)                                   as audios_captures,
  (select count(*) from capture_audio where transcription_status='done')  as transcrits,
  (select count(*) from capture_audio where kairos_id is null)            as pas_encore_rattaches,
  (select count(*) from kairos_attachments where kind='audio')            as audios_rattaches;

-- Ce que le cron de réparation va prendre au prochain passage
select local_id, round(bytes/1024.0/1024,2) as mo, duration_sec,
       transcription_status, transcription_attempts, created_at
from capture_audio
where kairos_id is null
  and transcription_status in ('pending','failed')
  and created_at < now() - interval '15 minutes'
order by created_at limit 20;
```

**Repère historique** : avant le 26/07, `kairos_attachments` contenait **0 ligne, tous kinds
confondus**. Toute valeur > 0 sur `audios_rattaches` est une première dans l'histoire de l'app.

---

## §54 — MOTEUR DE RÉSONANCE — l'état RÉEL (2026-07-26) · supersède §35.6

§35 (avril) décrit les **4 vecteurs spécialisés**, qui sont toujours l'architecture. Ce qui a
changé, et qui rend §35.6 caduc, c'est **la façon de décider ce qu'on sert**.

### §54.1 Le résultat mesuré qui invalide tout seuil absolu

Corpus de mesure : 64 kairos, 4032 paires ordonnées, compte réel.

| Paire jugée à la main | score brut | score ajusté (hubness) | **z par source** |
|---|---|---|---|
| **VRAIE résonance** | 0,6324 | **0,6228** | **2,776** |
| **BRUIT** | 0,6062 | **0,6230** | **0,185** |

**Le score ajusté classe le bruit AU-DESSUS de la vraie résonance** (0,6230 > 0,6228). Aucun
seuil absolu, où qu'on le pose, ne peut trancher entre ces deux lignes. Le z par source les
sépare d'un facteur 15. La calibration par percentile (p85→p97) a aussi été testée : **toutes
ces lignes tuent la seule vraie résonance connue**, qui se situe au percentile 0,80.

### §54.2 Ce qui est câblé

Trois filtres cumulés, **tous calibrés par rêveur** (table `user_resonance_calibration`,
recalcul automatique tous les 10 dépôts) :

1. **plancher absolu** = p50 des scores ajustés du rêveur — garde faible et assumée, elle ne
   fait que barrer l'absurde ;
2. **z ≥ 2,0 par source**, sur le score **corrigé de la hubness** (on retire à chaque candidat
   sa similarité moyenne au corpus, donc la composante « ce texte est proche de tout ») —
   **c'est lui qui trie** ;
3. **garde-doublon** sur `sim_sem ≥ 0,97` (les imports en double).

**Petits corpus — la borne mathématique décide** : sur *n* candidats, le z maximal atteignable
est `(n−1)/√n`. Pour n = 4, c'est **1,5** : le seuil 2,0 est *inatteignable*. On n'a donc pas
dilué la barre, on a limité ce qu'on ose en tirer : **< 5 kairos → silence total** ;
5-20 → z ≥ 2,0 avec plafond 2 liens ; > 20 → z ≥ 2,0 avec plafond 4 liens.

### §54.3 Ce que ça change à l'écran

| | AVANT | APRÈS |
|---|---|---|
| Liens servis (corpus entier) | 256 | **75** (−71 %) |
| Rêves avec 0 résonance | **0** | **14** ← le correctif |
| Exposition max d'un même kairos | 25 | **4** (−84 %) |
| Score minimum servi | **0,4262** | **0,6080** |
| Doublons d'import servis en position 1 | 5 | **0** |

Avant, la distribution était une barre unique à 4 résonances par rêve : **ce n'était pas une
mesure, c'était une constante.** Le seuil était du code mort.

> **Conséquence produit, non négociable** : puisque 22 % des rêves ne renvoient plus rien,
> `<ResonanceSection>` doit recevoir `emptyHint` **toujours vrai**. Sinon elle renvoie `null`
> et le rêveur voit un trou muet au lieu de la phrase douce. Un moteur qui ne peut pas se taire
> est pire qu'une recherche par mot-clé — mais un silence non dit ressemble à une panne.

### §54.4 Deux pistes testées qui ÉCHOUENT — ne pas les retenter

1. **Monter le poids de l'embedding `concept`** → aggrave la hubness.
2. **Nettoyer les préambules parlés avant d'embedder** → détruit la discrimination.

### §54.5 Un bug de fond, trouvé au passage

`match_kairos_for_wisdom` **levait une exception à chaque appel, depuis toujours** (mismatch de
type). Corrigé par `drop_ambiguous_match_kairos_for_wisdom_3args` +
`fix_match_kairos_for_wisdom_type_mismatch`. Même famille que le bug de la couche 0 :
**un code qui échoue en silence sur une donnée absente ne produit aucun signal.**

---

## §55 — LES GRANDS RÊVES (2026-07-26)

Migration `great_dreams_taxonomy_a3`. **Nouveaux booléens de marquage : zéro.** La marque
« un grand rêve » **EST** la colonne `kairos.user_marked_numinous`, déjà en base. S'y ajoutent
`marked_great_at` (posé par un trigger DB — **jamais whitelisté en écriture**),
`great_dream_facets` et `great_dream_note` (whitelistés au `PATCH`).

- `GET /api/great-dreams` — le journal : rêves marqués + interprétations gardées
  (`kairos_interpretations.status = 'kept'`, qui existait déjà et n'avait pas d'endroit où vivre).
- `GET /api/great-dreams/consult` — la consultation à **double lecture**, deux colonnes jamais fusionnées.
- Composants : `GreatDreamFlag.tsx` (le geste, 1 tap, réversible) · `GreatDreamsJournal.tsx`.

**La règle dure** : seule la décision du rêveur fait entrer dans le journal, **jamais le score**.
`radiant` (suggestion de l'IA, `numinosity_score ≥ 0,7`) ne doit **jamais** être écrit
`|| user_marked_numinous` : l'asymétrie IA/rêveur est le cœur de la fonction.
Le marquage n'apparaît **pas** dans `PostDepotScreen` — c'est délibéré : un rêve devient grand
des années après, pas au réveil.

**Fragilité dite franchement** : la couche de rappel de la consultation ne discrimine pas
assez ; elle cassera vers 500 rêves.

---

## §56 — FORÊT — le chaînon manquant du pipeline (2026-07-26)

**Diagnostic** : il n'a jamais existé de script poussant `digest_tier1`/`digest_tier2` du disque
vers Supabase. Ce n'est pas un bug d'écriture, c'est **une étape absente du pipeline**.
`phase2-import.py` n'a jamais mentionné ces deux colonnes ; `add_book_to_forest.sh` les *suppose*
déjà en base ; `catchup_pending_books.sh` filtre dessus comme condition d'entrée.

Preuve par les données : sur 408 livres, **aucun** digest n'était partiellement écrit — chaque
champ était soit complet, soit `NULL`. Un bug d'écriture produit des troncatures aléatoires ;
une étape manquante produit exactement ce clivage net.

**Réparé** : 145 livres re-synchronisés (vérifiés en MD5 exact contre le disque, pas en longueur),
`moss-sidewalk-oracles` inséré (absent de `forest_books` tout court), `dream_forest_books`
complétée de 68 → 82 lignes.

**Prévention, en place** : `forest/pipelines/sync_digests_to_supabase.py` — idempotent,
**dry-run par défaut** (`--apply` pour écrire), ne touche jamais un champ déjà rempli (> 500 car.),
et **liste sans y toucher** les livres totalement absents de `forest_books` (ils ont besoin d'une
vraie insertion avec métadonnées, pas d'un PATCH). À adopter comme **Step 8 de `PIPELINE.md`** —
c'est le chaînon manquant. Cron hebdomadaire recommandé **en dry-run**, alerte si compte > 0 :
un champ vide peut légitimement signaler un digest pas encore prêt. Pas de contrainte `NOT NULL`.

**Nuance sur l'impact, contre le diagnostic initial** : la recherche vectorielle de la Dream App
(`forest_chunks`, embeddings) **n'était pas cassée** — chunks et embeddings étaient à 100 %. Ce
qui était cassé, c'est **`foret-app`** (le site public), qui lit les digests texte en 3 endroits,
dont un `.not("digest_tier1","is",null)` = **exclusion structurelle** de la recherche par mot-clé.

---

## §57 — MIGRATIONS DU 2026-07-26 (projet `rtrkxzcyblgonwgfzovj`)

17 migrations Dream appliquées **en production** ce jour-là, dans l'ordre :

| Migration | Objet |
|---|---|
| `a1_kairos_attachments_storage_policies` | `file_size_limit = 100 Mo` sur `kairos-attachments` (était `NULL`) + 5 policies `storage.objects` — le bucket n'en avait **aucune** |
| `a1_capture_audio_registry_and_transcription_status` | table `capture_audio` (17 col.), unique `(user_id, local_id)`, RLS + 4 policies + **GRANT explicite**, 2 index partiels ; `kairos` : `transcription_status/attempts/error` |
| `great_dreams_taxonomy_a3` | §55 |
| `dream_forest_books_add_internal_only_role` | rôle `internal_only` (Hay/Martel/Odoul — risque de culpabilisation) |
| `resonance_calibration_infra` · `resonance_calibration_functions` | `user_resonance_calibration` + recalcul auto |
| `rewrite_find_kairos_echoes_multilayer` | §54 — le z-score par source |
| `numinosity_deterministic_recompute` · `_floor_comment_correction` · `_backfill_from_persisted_extraction` | numinosité déterministe et rejouable |
| `rewrite_find_kairos_prophetic_with_ripening` | écho ancien + maturation, **paramétrés** |
| `match_kairos_for_wisdom_min_similarity` · `drop_ambiguous_..._3args` · `fix_..._type_mismatch` | §54.5 |
| `kairos_edges_llm_rerank_cache` | cache de re-ranking |
| `resonance_feedback_closes_the_loop` | la boucle de retour du rêveur |
| `a2_clean_embeddings_scratch` | nettoyage |

> **RÈGLE DE TENUE, apprise le 26/07** : *RLS sans GRANT = lecture vide EN SILENCE* (leçon
> `community` du 25/07, ré-appliquée ici). Toute nouvelle table porte son GRANT explicite dans
> la migration qui la crée, jamais dans une migration suivante.

> **ET LA RÈGLE QUI GOUVERNE LES AUTRES** : un principe qui n'a pas de test qui échoue quand on
> le viole n'est pas un principe, c'est un vœu. Toute red line ajoutée à ce document doit venir
> avec sa vérification exécutable — assertion, test, ou requête de supervision prête à coller.

---

**Fin du document canonique 3_TECHNICAL.md.**
*Dernière mise à jour : **2026-07-26** (agent A8, flotte de 8) — ajout §53 (couche 0 de capture :
le pipeline audio en 5 couches, `capture_audio`, le débit à la source mesuré, le rail de reprise
serveur), §54 (moteur de résonance réel : z-score par source sur score corrigé de la hubness,
calibration par rêveur — supersède §35.6), §55 (les grands rêves), §56 (Forêt : le chaînon
manquant du pipeline digests), §57 (les 17 migrations du jour). Coupes compensatoires : §40.1-2
et §40.4 renvoyées vers `claude-context` (mémoire Yeshua, pas architecture Dream), §35.6 réduit à
ce qui tient encore. **Le document sort plus léger qu'il n'est entré.***

*Historique des versions antérieures : v1.3 du 2026-04-28 (§39 économie du chat IA), v1.2 du
2026-04-26 (§47-§52), v1.1 du 2026-04-24 (§35-§46). Le détail de chaque version vit dans*
`4_LOG.md`*, à sa date — un changelog n'a pas à être recopié dans le document qu'il décrit.*
