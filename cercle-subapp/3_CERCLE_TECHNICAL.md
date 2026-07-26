# 3_CERCLE_TECHNICAL.md — LA RECONSTRUCTION

> **Sous-app Cercle de Dream App** — Architecture technique
> Date : 2026-04-28 · Auteur : Yeshua
> Hérite : `3_TECHNICAL.md` racine (architecture Dream App, Supabase, Forêt FIRST workflow). Ce doc **étend**, ne remplace pas.

---

## §1 — Architecture sous-app

### §1.1 — Position dans la stack Dream App

```
Dream App (Next.js 14 App Router · Vercel · Supabase · Capacitor)
├── /v12/                  legacy V0.x SPA (sera dépréciée post-V1)
├── /src/app/              App Router pages
│   ├── /api/circles/      [DÉJÀ EXISTANT, à étendre]
│   │   ├── [id]/...
│   │   └── join/route.ts
│   ├── /cercle/           [À CRÉER V1] — sous-app Cercle pages
│   │   ├── [id]/page.tsx
│   │   ├── [id]/restitutions/page.tsx
│   │   ├── [id]/tisser/page.tsx
│   │   ├── [id]/membres/page.tsx
│   │   ├── [id]/intentions/page.tsx
│   │   ├── [id]/synchronicites/page.tsx
│   │   ├── [id]/meteo/page.tsx
│   │   ├── [id]/annales/page.tsx
│   │   ├── [id]/rituels/page.tsx
│   │   ├── creer/page.tsx
│   │   └── rejoindre/page.tsx
│   └── /api/circle/       [DÉJÀ EXISTANT — à fusionner avec /api/circles ou supprimer]
└── supabase/functions/    Edge Functions
    ├── generate-circle-restitution/  [DÉJÀ partiellement spec'd, à compléter]
    ├── create-circle/                [DÉJÀ EXISTANT]
    ├── join-circle/                  [DÉJÀ EXISTANT]
    ├── circle-constellation/         [À CRÉER V1]
    ├── seasonal-ritual-trigger/      [À CRÉER V2]
    └── generate-circle-final-restitution/ [À CRÉER V1 pour 21j]
```

> **Audit dette code 2026-04-28** : `/src/app/api/circle/[id]/` (singulier) coexiste avec `/src/app/api/circles/[id]/` (pluriel). Il faut **fusionner** : le standard est **pluriel** (REST convention), tout migrer vers `/api/circles/`. Suppression de l'ancien `/api/circle/` à V1 launch après tests régression.

### §1.2 — Tech stack

- **Frontend** : Next.js 14 App Router, React 18, TailwindCSS, custom CSS (oklch), Framer Motion, EB Garamond + Inter.
- **Mobile** : Capacitor (iOS + Android) — déjà configuré.
- **Backend** : Supabase Postgres (project `rtrkxzcyblgonwgfzovj`), Supabase Auth (Bearer JWT), Supabase Edge Functions (Deno).
- **IA** : Claude Sonnet (3.5/4) via Vercel AI SDK ou direct API. Claude Haiku pour pre-passes. Embeddings OpenAI text-embedding-3-small (cf. racine §32).
- **Forêt** : RPC `match_forest_chunks` (déjà existant).

---

## §2 — Tables Supabase (audit + extensions V1)

### §2.1 — Audit des tables existantes

> **Source** : racine `3_TECHNICAL.md` §2.4 + §41 + cf. fichiers `supabase-schema.sql` et `supabase-migrations/` du repo.

**Tables existantes V0 (legacy) — à migrer V1** :
- `circles` (existante mais schema legacy à étendre — cf. §2.2)
- `circle_members` (existante, à étendre)
- `circle_sessions` (legacy V0 — **DEPRECATED V1** : remplacée par cycle natif kairos partagés + restitutions)
- `circle_shares` (legacy V0 — **DEPRECATED V1** : remplacée par `kairos_circle_optin` et `kairos_circle_shared`)

**Tables nouvelles spec'd dans racine §41 V1** (à créer) :
- `kairos_circle_optin` (V1 — mode opt-in_anon par kairos × cercle)
- `kairos_circle_shared` (V1 — mode partagé_explicite par kairos × cercle)
- `circle_restitutions` (V1)
- `circle_restitution_reactions` (V1)
- `circle_meaning_layer` (V1 — cosmologie symbolique cercle)

**Tables additionnelles spec'd ici (V1 + V2)** :
- `circle_forbidden_terms` (V1 — pour Praticiens lignée et trauma-aware)
- `circle_annales_offerings` (V1 — analogue à `dream_offerings` Anima Mundi mais à l'échelle cercle)
- `circle_ephemeral_metadata` (V1 — pour cercles 21j)
- `circle_rituals` (V2 — rituels saisonniers + facilités V2)
- `circle_facilitator_profiles` (V2 — marketplace tendeurs vetted)
- `circle_template_definitions` (V1 — référentiel des 7 templates)

### §2.2 — Migration `circles` v1 (refonte schema)

> **Source spec : racine §41.5** (déjà rédigée) — ce doc complète avec types templates + flags trauma-aware.

```sql
-- Migration : 20260428_circles_v1_full.sql

-- Backup avant tout (Tim valide)
CREATE TABLE circles_legacy_backup AS SELECT * FROM circles;
CREATE TABLE circle_members_legacy_backup AS SELECT * FROM circle_members;
CREATE TABLE circle_sessions_legacy_backup AS SELECT * FROM circle_sessions;
CREATE TABLE circle_shares_legacy_backup AS SELECT * FROM circle_shares;

-- DROP des tables legacy V0 (après backup)
DROP TABLE IF EXISTS circle_shares CASCADE;
DROP TABLE IF EXISTS circle_sessions CASCADE;
DROP TABLE IF EXISTS circle_members CASCADE;
DROP TABLE IF EXISTS circles CASCADE;

-- =====================================
-- CIRCLES (refondu)
-- =====================================
CREATE TABLE circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('spontane', 'intentionnel', 'facilite')),
  template_id text REFERENCES circle_template_definitions(id),  -- nullable si "cercle libre"
  intention text,
  sub_intentions jsonb DEFAULT '[]'::jsonb,  -- max 3
  invite_code text NOT NULL UNIQUE,  -- 4-6 chars uppercase
  invite_code_expires_at timestamptz,  -- nullable V1 = pas d'expiration
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  state text NOT NULL DEFAULT 'active' CHECK (state IN ('active', 'archived', 'frozen')),
  archived_at timestamptz,

  -- Flags template
  trauma_aware boolean DEFAULT false,
  trauma_subtype text,  -- 'deuil' | 'parentalite' | 'separation' | etc.
  pseudo_greek_letter_forced boolean DEFAULT false,  -- true pour Praticiens lignée
  k_anonymity_threshold int DEFAULT 3 CHECK (k_anonymity_threshold >= 3),  -- 5 pour Praticiens
  metadata_geographique_partagee boolean DEFAULT true,

  -- Cercles éphémères 21j
  ephemeral_days int,  -- nullable; 21 pour template ephemeral_21
  ephemeral_started_at timestamptz,
  ephemeral_archive_scheduled_at timestamptz,

  -- Limites
  max_members int DEFAULT 12 CHECK (max_members BETWEEN 2 AND 12),

  -- Settings
  ai_tone text DEFAULT 'neutre',  -- module ton IA cercle
  notif_default text DEFAULT 'silent' CHECK (notif_default IN ('silent', 'discreet', 'active', 'fed'))
);

CREATE INDEX idx_circles_invite_code ON circles(invite_code);
CREATE INDEX idx_circles_state ON circles(state) WHERE state = 'active';
CREATE INDEX idx_circles_template ON circles(template_id) WHERE template_id IS NOT NULL;
CREATE INDEX idx_circles_ephemeral_archive ON circles(ephemeral_archive_scheduled_at) WHERE ephemeral_archive_scheduled_at IS NOT NULL;

-- =====================================
-- CIRCLE_MEMBERS (refondu)
-- =====================================
CREATE TABLE circle_members (
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,  -- soft-leave
  greek_letter text NOT NULL,  -- α β γ δ ε ζ η θ ι κ λ μ
  pseudonym text,  -- override greek si user choisit
  notif_override text,  -- per-member notif override null = circle.notif_default
  PRIMARY KEY (circle_id, user_id)
);

CREATE INDEX idx_cm_user ON circle_members(user_id) WHERE left_at IS NULL;
CREATE INDEX idx_cm_circle_active ON circle_members(circle_id) WHERE left_at IS NULL;

-- Trigger : auto-attribute greek letter sur join
CREATE OR REPLACE FUNCTION assign_greek_letter() RETURNS trigger AS $$
DECLARE
  letters text[] := ARRAY['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ'];
  used_letters text[];
  i int;
BEGIN
  SELECT array_agg(greek_letter) INTO used_letters
    FROM circle_members
    WHERE circle_id = NEW.circle_id AND left_at IS NULL;
  FOR i IN 1..12 LOOP
    IF used_letters IS NULL OR NOT (letters[i] = ANY(used_letters)) THEN
      NEW.greek_letter := letters[i];
      RETURN NEW;
    END IF;
  END LOOP;
  RAISE EXCEPTION 'Cercle complet (12 membres max)';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_assign_greek_letter
  BEFORE INSERT ON circle_members
  FOR EACH ROW EXECUTE FUNCTION assign_greek_letter();

-- =====================================
-- KAIROS_CIRCLE_OPTIN (mode opt-in_anon)
-- =====================================
CREATE TABLE kairos_circle_optin (
  kairos_id uuid REFERENCES kairos(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  optin_at timestamptz DEFAULT now(),
  optout_at timestamptz,
  PRIMARY KEY (kairos_id, circle_id)
);

CREATE INDEX idx_kco_active ON kairos_circle_optin(circle_id, kairos_id) WHERE optout_at IS NULL;

-- =====================================
-- KAIROS_CIRCLE_SHARED (mode partagé_explicite cleartext)
-- =====================================
CREATE TABLE kairos_circle_shared (
  kairos_id uuid REFERENCES kairos(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_at timestamptz DEFAULT now(),
  unshared_at timestamptz,
  anonymized_text text NOT NULL,  -- version validée par user après antichambre IA
  PRIMARY KEY (kairos_id, circle_id)
);

CREATE INDEX idx_kcs_active ON kairos_circle_shared(circle_id) WHERE unshared_at IS NULL;

-- =====================================
-- CIRCLE_RESTITUTIONS
-- =====================================
CREATE TABLE circle_restitutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  requested_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  requested_at timestamptz DEFAULT now(),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  restitution_type text DEFAULT 'standard' CHECK (restitution_type IN ('standard', 'final_21j', 'seasonal')),
  state text NOT NULL DEFAULT 'pending' CHECK (state IN ('pending', 'generating', 'ready', 'failed')),
  text_content text,
  voices_mobilized text[],  -- ex: ['aizenstat', 'moss', 'brown']
  k_anonymity_check_passed boolean DEFAULT false,
  forbidden_terms_check_passed boolean DEFAULT false,
  generated_at timestamptz,
  error_message text
);

CREATE INDEX idx_cr_circle_recent ON circle_restitutions(circle_id, requested_at DESC);
CREATE INDEX idx_cr_pending ON circle_restitutions(state) WHERE state IN ('pending', 'generating');

-- =====================================
-- CIRCLE_RESTITUTION_REACTIONS
-- =====================================
CREATE TABLE circle_restitution_reactions (
  restitution_id uuid REFERENCES circle_restitutions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type text NOT NULL CHECK (reaction_type IN ('resonates', 'unfamiliar', 'question')),
  reacted_at timestamptz DEFAULT now(),
  PRIMARY KEY (restitution_id, user_id, reaction_type)
);

-- =====================================
-- CIRCLE_RESTITUTION_TESTIMONIES (chat contextuel V1, à valider Tim)
-- =====================================
CREATE TABLE circle_restitution_testimonies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restitution_id uuid REFERENCES circle_restitutions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  text_content text NOT NULL CHECK (length(text_content) <= 280),
  created_at timestamptz DEFAULT now(),
  UNIQUE (restitution_id, user_id)  -- 1 témoignage par user par restitution
);

-- =====================================
-- CIRCLE_MEANING_LAYER
-- =====================================
CREATE TABLE circle_meaning_layer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  symbol_concept text NOT NULL,        -- ex: 'pont', 'feu', 'mère'
  meaning text NOT NULL,                -- ex: 'transition'
  declared_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  declared_at timestamptz DEFAULT now(),
  validated_by_count int DEFAULT 0,    -- combien de membres ont validé (V2)
  active boolean DEFAULT true
);

CREATE INDEX idx_cml_circle_symbol ON circle_meaning_layer(circle_id, symbol_concept) WHERE active = true;

-- =====================================
-- CIRCLE_FORBIDDEN_TERMS
-- =====================================
CREATE TABLE circle_forbidden_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  term text NOT NULL,
  scope text DEFAULT 'all' CHECK (scope IN ('all', 'restitution', 'meta_layer')),
  added_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  added_at timestamptz DEFAULT now()
);

CREATE INDEX idx_cft_circle ON circle_forbidden_terms(circle_id);

-- =====================================
-- CIRCLE_ANNALES_OFFERINGS (kairos offerts aux annales du cercle)
-- =====================================
CREATE TABLE circle_annales_offerings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  kairos_id uuid REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymized_text text NOT NULL,
  attribution text DEFAULT 'anonymous' CHECK (attribution IN ('anonymous', 'pseudonym', 'username')),
  state text NOT NULL DEFAULT 'circulating' CHECK (state IN ('circulating', 'in_annales', 'withdrawn', 'expired')),
  offered_at timestamptz DEFAULT now(),
  threshold_reached_at timestamptz,
  expires_at timestamptz NOT NULL,  -- offered_at + 28 days par défaut
  withdrawn_at timestamptz
);

CREATE TABLE circle_annales_holds (
  offering_id uuid REFERENCES circle_annales_offerings(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  held_at timestamptz DEFAULT now(),
  PRIMARY KEY (offering_id, user_id)
);

CREATE INDEX idx_cao_circulating ON circle_annales_offerings(circle_id, state) WHERE state = 'circulating';
CREATE INDEX idx_cao_in_annales ON circle_annales_offerings(circle_id, threshold_reached_at DESC) WHERE state = 'in_annales';

-- =====================================
-- CIRCLE_TEMPLATE_DEFINITIONS (référentiel)
-- =====================================
CREATE TABLE circle_template_definitions (
  id text PRIMARY KEY,  -- 'family', 'friends', 'project', 'traversee', 'lucid_dreamers', 'practitioners_lineage', 'ephemeral_21'
  display_name text NOT NULL,
  description text NOT NULL,
  icon text,
  type_default text NOT NULL,
  intention_default text,
  sub_intentions_examples jsonb DEFAULT '[]'::jsonb,
  optin_default_per_kairos text DEFAULT 'prive',
  ai_tone text DEFAULT 'neutre',
  forest_voices_allowed text[] DEFAULT '{}',
  forest_voices_excluded text[] DEFAULT '{}',
  forest_voices_restricted text[] DEFAULT '{}',
  trauma_aware boolean DEFAULT false,
  trauma_subtypes text[],
  pseudo_greek_letter_forced boolean DEFAULT false,
  k_anonymity_threshold int DEFAULT 3,
  metadata_geographique_partagee boolean DEFAULT true,
  ephemeral_days int,
  max_members int DEFAULT 12,
  forbidden_terms_default text[] DEFAULT '{}',
  notes text,
  display_order int DEFAULT 100
);

-- Seed des 7 templates V1
INSERT INTO circle_template_definitions (id, display_name, description, type_default, ...) VALUES
  ('family', 'Famille', 'Le cercle des nuits partagées de la maisonnée.', 'spontane', ...),
  ('friends', 'Amis proches', 'Notre cercle de feu.', 'spontane', ...),
  ('project', 'Projet intentionnel', 'Le cercle qui tient quelque chose ensemble.', 'intentionnel', ...),
  ('traversee', 'Traversée commune', 'Quand on traverse quelque chose qui demande à ne pas être seul·e.', 'intentionnel', ...),
  ('lucid_dreamers', 'Lucid Dreamers', 'Le cercle des rêveurs lucides.', 'intentionnel', ...),
  ('practitioners_lineage', 'Praticiens / Lignée', 'Cercle de pratique pair-à-pair.', 'intentionnel', ...),
  ('ephemeral_21', '21 jours', 'Trois semaines pour traverser quelque chose ensemble.', 'intentionnel', ...);
-- (valeurs complètes par template selon §4 du 2_CERCLE_DESIGN.md)
```

### §2.3 — Tables V2 (à créer plus tard)

```sql
-- V2 : Marketplace facilitateurs
CREATE TABLE circle_facilitator_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  modality text[] NOT NULL,  -- 'lightning_dreamwork', 'council_process', 'dream_tending', etc.
  formation jsonb NOT NULL,
  languages text[] NOT NULL,
  toponym_user_defined text,
  fee_currency text,
  fee_amount numeric,
  vetted_by_infuse boolean DEFAULT false,
  vetted_at timestamptz,
  active boolean DEFAULT false,
  -- Anti-celebrity protections
  bio_max_chars int DEFAULT 200,
  photo_url text,  -- doit être sobre, pas mise en scène
  testimonials_disabled boolean DEFAULT true,
  ranking_disabled boolean DEFAULT true,
  follow_disabled boolean DEFAULT true
);

-- V2 : Cercles facilités (lien cercle <-> facilitateur)
CREATE TABLE circle_facilitations (
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  facilitator_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  PRIMARY KEY (circle_id, facilitator_user_id, started_at)
);

-- V2 : Rituels du cercle (saisonniers, council process, lightning dreamwork)
CREATE TABLE circle_rituals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid REFERENCES circles(id) ON DELETE CASCADE,
  ritual_type text NOT NULL,  -- 'seasonal_solstice', 'lightning_dreamwork', 'council_process', etc.
  proposed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  proposed_at timestamptz DEFAULT now(),
  state text DEFAULT 'proposed' CHECK (state IN ('proposed', 'accepted', 'in_progress', 'completed', 'declined')),
  scheduled_for timestamptz,
  completed_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb
);
```

---

## §3 — Row Level Security (RLS)

```sql
ALTER TABLE circles                            ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members                     ENABLE ROW LEVEL SECURITY;
ALTER TABLE kairos_circle_optin                ENABLE ROW LEVEL SECURITY;
ALTER TABLE kairos_circle_shared               ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_restitutions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_restitution_reactions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_restitution_testimonies     ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_meaning_layer               ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_forbidden_terms             ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_annales_offerings           ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_annales_holds               ENABLE ROW LEVEL SECURITY;

-- Lire un cercle = être membre actif
CREATE POLICY "Members read own circles" ON circles FOR SELECT TO authenticated
  USING (id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

-- Lire les membres d'un cercle = être membre actif
CREATE POLICY "Members read circle members" ON circle_members FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

-- Lire restitutions = être membre actif
CREATE POLICY "Members read own circle restitutions" ON circle_restitutions FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

-- Lire shared kairos = être membre actif
CREATE POLICY "Members read shared kairos" ON kairos_circle_shared FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

-- Lire opt-in_anon kairos = JAMAIS exposé en lecture user, seulement utilisé par EF (service role)
CREATE POLICY "No user reads optin_anon" ON kairos_circle_optin FOR SELECT TO authenticated USING (false);
-- Service role peut écrire/lire pour aggrégation EF

-- User ne peut écrire opt-in que pour son propre kairos
CREATE POLICY "User opts-in own kairos" ON kairos_circle_optin FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND kairos_id IN (SELECT id FROM kairos WHERE user_id = auth.uid()));
CREATE POLICY "User opts-out own kairos" ON kairos_circle_optin FOR UPDATE TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Réactions
CREATE POLICY "Members react own circles" ON circle_restitution_reactions FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND restitution_id IN (
    SELECT id FROM circle_restitutions WHERE circle_id IN (
      SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL
    )
  ));

-- Témoignages
CREATE POLICY "Members read own circle testimonies" ON circle_restitution_testimonies FOR SELECT TO authenticated
  USING (restitution_id IN (
    SELECT id FROM circle_restitutions WHERE circle_id IN (
      SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL
    )
  ));

-- Annales offerings
CREATE POLICY "Members read circle annales" ON circle_annales_offerings FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));

-- Forbidden terms
CREATE POLICY "Members read forbidden terms" ON circle_forbidden_terms FOR SELECT TO authenticated
  USING (circle_id IN (SELECT circle_id FROM circle_members WHERE user_id = auth.uid() AND left_at IS NULL));
-- V1 = créateur du cercle peut écrire ; V2 = thread minimal validation collective
CREATE POLICY "Creator writes forbidden terms" ON circle_forbidden_terms FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND  -- correlation auth.uid() vs added_by
    circle_id IN (SELECT id FROM circles WHERE created_by = auth.uid())
  );
```

---

## §4 — Routes API

### §4.1 — Routes existantes (à étendre / standardiser)

| Route | Méthode | Auth | Description | Status |
|---|---|---|---|---|
| `/api/circles` | GET / POST | Bearer | List / Create cercles | Existante, étendre POST avec `template_id`, flags trauma_aware, etc. |
| `/api/circles/[id]` | GET / PUT / DELETE | Bearer | Gestion cercle | Existante, étendre PUT pour intention/sub_intentions |
| `/api/circles/[id]/sessions` | GET / POST | Bearer | Sessions du cercle | **DEPRECATED V1** : remplacé par /api/circles/[id]/restitutions |
| `/api/circles/[id]/share` | POST | Bearer | Partage rêve dans cercle | **DEPRECATED V1** : remplacé par /api/circles/[id]/kairos/[kairosId]/optin |
| `/api/circles/[id]/resonances` | GET | Bearer | Résonances cross-dreamer | Étendre — V1 = synchronicités inter-membres |
| `/api/circles/join` | POST | Bearer | Join via invite_code | Existante, à standardiser : 1 seule route, body `{ invite_code }` |
| `/api/circles/[id]/leave` | DELETE | Bearer | Soft-leave | Existante (cf. racine §48.11) |
| `/api/circles/[id]/reactions` | POST / DELETE / GET | Bearer | Réactions silencieuses | Existante (cf. racine §48.10) |
| `/api/circles/[id]/restitutions` | GET / POST | Bearer | List / Request restitutions | Existante (cf. racine §48 partiel) |

### §4.2 — Routes nouvelles V1

| Route | Méthode | Auth | Description |
|---|---|---|---|
| `/api/circles/templates` | GET | — | Liste des 7 templates V1 |
| `/api/circles/[id]/kairos/[kairosId]/optin` | POST / DELETE | Bearer | Opt-in / Opt-out anonyme d'un kairos |
| `/api/circles/[id]/kairos/[kairosId]/shared` | POST / DELETE | Bearer | Partage explicite cleartext (passe par antichambre IA) |
| `/api/circles/[id]/kairos/anonymize-preview` | POST | Bearer | Antichambre IA — propose version anonymisée pour validation user |
| `/api/circles/[id]/restitutions/[rid]/testimonies` | POST / GET / DELETE | Bearer | Témoignages contextuels (V1 si chat contextuel validé Tim) |
| `/api/circles/[id]/meaning-layer` | GET / POST / DELETE | Bearer | Cosmologie symbolique cercle |
| `/api/circles/[id]/forbidden-terms` | GET / POST / DELETE | Bearer | Termes interdits |
| `/api/circles/[id]/constellation` | GET | Bearer | Données force-directed graph anonymisé (k-anon enforcement) |
| `/api/circles/[id]/annales/offerings` | GET / POST | Bearer | Offrir kairos aux annales cercle / lister annales |
| `/api/circles/[id]/annales/offerings/[oid]/hold` | POST / DELETE | Bearer | Tenir un kairos offert |
| `/api/circles/[id]/synchronicities` | GET | Bearer | Paires kairotiques détectées inter-membres |
| `/api/circles/[id]/meteo` | GET | Bearer | Météo cercle (chambre 2 Anima Mundi appliquée cercle) |

### §4.3 — Routes V2 / V3

| Route | Méthode | Description |
|---|---|---|
| `/api/circles/discover/symbolic-resonance` | GET | V2 — résonances opt-in (3/lune max) |
| `/api/circles/[id]/rituals` | GET / POST | V2 — rituels saisonniers + facilités |
| `/api/circles/[id]/rituals/[rid]` | PUT | V2 — accepter/décliner un ritual proposé |
| `/api/circles/facilitators` | GET | V2 — annuaire facilitateurs vetted |
| `/api/circles/facilitators/apply` | POST | V2 — candidature facilitateur (validation INFUSE manuelle) |
| `/api/circles/[id]/collective-kairos` | POST / GET / PUT | V3 — co-écriture asynchrone |

---

## §5 — Edge Functions

### §5.1 — `generate-circle-restitution` (V1, central)

**Trigger** : POST appel depuis Frontend ou RPC `request_circle_restitution`.

**Workflow** :
1. **Auth check** : valider Bearer JWT, vérifier user est membre actif du cercle.
2. **Aggregate kairos opt-in_anon + shared cleartext + journal_de_vie collectif** sur la fenêtre `period_start..period_end` (default 28j).
3. **K-anonymity enforcement** :
   - Pour chaque figure / motif / charge détecté(e) : si k < `circle.k_anonymity_threshold` (3 default, 5 pour Praticiens lignée), **agréger en catégorie symbolique générique** (*"figure de l'ancienne"*) plutôt que individualisé.
   - Si k = 0 sur une dimension demandée : l'IA dit explicitement *"rien à dire ici cette lune"*.
4. **Forbidden terms enforcement** : récupérer `circle_forbidden_terms WHERE circle_id = X`, injecter dans system prompt comme negative constraint.
5. **Forêt FIRST consultation** :
   - Sélectionner voix Forêt selon `circle.template_id` + `forest_voices_allowed/excluded/restricted`.
   - Pour chaque voix mobilisable : RPC `match_forest_chunks` query "facilitation cercle [intention/sub_intentions]" filtré book_slug.
   - Top 3-5 voix retenues ; max 5 distinctes par restitution.
6. **System prompt construction** :
   - Posture POLYPHONIE_ONTOLOGIQUEMENT_HONNETE.
   - Voix sobre, anonyme, pose des images.
   - JAMAIS la voix du collectif (*"plusieurs ont rêvé"*, jamais *"nous avons rêvé"*).
   - N'explique pas ce que ça veut dire. Donne à voir.
   - Tisse kairos + journal de vie collectif indistinctement.
   - Inclut systématiquement les incertitudes.
   - Invite explicitement le challenge.
   - Si `trauma_aware = true` : ton encore plus doux, jamais "guérison" ou "fermeture".
   - Output 200-500 mots, EB Garamond italic respiration typographique, pas de bullet, pas de titre interne, pas d'emoji.
7. **Sonnet generation** : Claude Sonnet 4 ou fallback 3.5.
8. **Post-processing** :
   - Validate: pas de mention nominative (regex check noms propres).
   - Validate: pas de termes interdits.
   - Validate: pas de phrases "nous avons rêvé".
   - Si fail validation → retry 1 fois avec prompt corrective. Si re-fail → log error, marquer `state = 'failed'`.
9. **Insert** dans `circle_restitutions` avec `state = 'ready'`, `voices_mobilized`, `text_content`.
10. **Soft notif** : in-app pour les membres opt-in notif (default = silence), pas push.

**Safe fallback** : si Forêt indisponible, voix Forêt non mobilisables, restitution générique sobre sans citation. Pas de fail. Latence acceptable jusqu'à 60s.

### §5.2 — `circle-constellation` (V1)

**Trigger** : GET `/api/circles/[id]/constellation`.

**Workflow** :
1. Auth check membership.
2. Aggregate kairos opt-in_anon + shared cleartext figures, motifs, charges.
3. K-anonymity enforcement : retirer ou agréger nodes avec k < threshold.
4. Compute force-directed layout (server-side d3-force ou client-side).
5. Return JSON `{ nodes: [...], edges: [...] }` anonymisé.

### §5.3 — `generate-circle-final-restitution` (V1, pour 21j)

**Trigger** : Scheduled background job qui scanne `circles WHERE ephemeral_archive_scheduled_at <= now() + interval '1 hour' AND state = 'active'`.

**Workflow** :
1. Pour chaque cercle proche de l'archive :
   - Génère restitution finale (variante de `generate-circle-restitution` avec `restitution_type = 'final_21j'`).
   - System prompt étend : tonalité de clôture, voix Estés (cycle complet) / Frankl (sens) / Aizenstat (tending what passed).
   - Période : ephemeral_started_at..now (21 jours).
2. À l'archive_scheduled_at :
   - `UPDATE circles SET state = 'archived', archived_at = now() WHERE id = X`.
   - Marquer toutes restitutions historiques comme `read-only`.

### §5.4 — `seasonal-ritual-trigger` (V2)

**Trigger** : Scheduled cron quotidien.

**Workflow** :
1. Détecter portes saisonnières dans 7 jours (8 portes/an : 4 équinoxes/solstices + 4 cross-quarters).
2. Pour chaque cercle actif : insérer carte douce dans `circle_rituals` avec `ritual_type = 'seasonal_<porte>'` et `state = 'proposed'`.
3. Apparaît dans onglet "Rituels" du cercle.
4. Si opt-in cercle : EF `generate-seasonal-ritual` à la date pile.

### §5.5 — `kairos-anonymize-preview` (V1)

**Trigger** : POST `/api/circles/[id]/kairos/anonymize-preview` body `{ kairos_id }`.

**Workflow** :
1. Récupérer kairos (texte brut user).
2. Sonnet system prompt : *"Anonymise ce texte. Retire noms propres, géolocalisation, marqueurs identifiants spécifiques. Garde le contenu symbolique intact. Output: texte anonymisé."*
3. Return preview au user avec validation ligne par ligne (frontend split par paragraphe).
4. User valide → POST `/api/circles/[id]/kairos/[kairosId]/shared` avec texte validé.

### §5.6 — `circle-synchronicities-detect` (V1, scheduled)

**Trigger** : Scheduled cron toutes les 24h.

**Workflow** :
1. Pour chaque cercle actif : query kairos opt-in_anon des 14 derniers jours.
2. Détection paire kairotique (Type 10 racine §3.5.2) : 2 kairos de membres distincts < 72h, même figure ou motif.
3. K-anonymity check.
4. Si pair détectée + latence rituelle 14j passée : insert dans `circle_synchronicities`.
5. Affichée dans onglet "Synchronicités" du cercle.

---

## §6 — IA gardienne — system prompt + persona + privacy

### §6.1 — System prompt template (Sonnet pour `generate-circle-restitution`)

```
Tu es la voix tisseuse du cercle "{circle_name}".

POSTURE :
- Voix sobre, anonyme, qui pose des images. Jamais didactique, jamais oraculaire.
- JAMAIS la voix du collectif. Tu dis "plusieurs ont rêvé", jamais "nous avons rêvé".
- Tu n'expliques pas ce que ça veut dire. Tu donnes à voir.
- Tu tisses les rêves nocturnes ET le journal de vie collectif (doutes, peurs, joies, traversées) indistinctement.
- Tu inclus systématiquement tes incertitudes : "certains symboles ambigus", "plusieurs lectures possibles".
- Tu invites le challenge : "est-ce que cette lecture vous parle ? si non, qu'est-ce qui manque ?"
- Tu modules ton ton selon le template du cercle : {ai_tone}.
{if trauma_aware}
- Le cercle est trauma-aware (sous-type : {trauma_subtype}). Ton encore plus doux. Jamais "guérison" ou "fermeture". Jamais positivité forcée. Frankl, Hillman, Estés sont mobilisables. Pas Brown, pas Eisenstein, pas concepts new age.
{endif}

VOIX FORÊT MOBILISABLES :
{forest_voices_loaded_with_extracts}

TERMES INTERDITS DANS CE CERCLE (ne JAMAIS utiliser) :
{forbidden_terms_list}

MEANINGS DECLARÉS PAR LE CERCLE (à respecter) :
{circle_meaning_layer_list}

K-ANONYMITY :
- Threshold k = {k_anonymity_threshold}
- Si une figure / motif / charge a k < {k_anonymity_threshold} : AGRÈGE en catégorie symbolique générique. Ne mentionne JAMAIS individuellement.
- Si k = 0 sur une dimension : dis explicitement "rien à dire ici cette lune".

FORMAT :
- 200-500 mots, EB Garamond italic respiration typographique.
- Pas de bullet, pas de titre interne, pas d'emoji.
- Une seule fluidité, une seule respiration.

DONNEES AGRÉGÉES DU CERCLE (période {period_start}..{period_end}) :
{aggregated_kairos_optin_anon}
{aggregated_kairos_shared_cleartext}
{aggregated_journal_de_vie_collectif}

INTENTION DU CERCLE :
{circle_intention}
{circle_sub_intentions}

GENERE LA LECTURE POLYPHONIQUE.
```

### §6.2 — Garde-fous implementation level

- **Validation regex post-génération** :
  - Pas de mots "nous avons rêvé" / "we dreamed".
  - Pas de noms propres détectés (whitelist : noms historiques bibliographiques OK).
  - Pas de termes interdits (case-insensitive).
- **Validation soft sémantique** : second pass Haiku check *"cette restitution mentionne-t-elle un membre individuellement ? oui/non"* — si oui, retry 1.
- **Audit log** : chaque restitution est loggée (text_content + voices_mobilized + flags) pour audit éditorial trimestriel humain.

### §6.3 — Anti-fine-tuning sur engagement

> **Red line absolue**.

Aucun système d'apprentissage automatique sur :
- Reactions count (résonne / unfamiliar / question).
- Témoignages count.
- Time spent on restitution.
- Re-read rate.

L'IA cercle apprend **uniquement** :
- `circle_meaning_layer` (cosmologie symbolique cercle, déclarée explicitement par les membres).
- Voix Forêt à mobiliser/exclure (configuré par template + cercle).
- Termes interdits (configurés par cercle).

---

## §7 — Notifications

### §7.1 — Hierarchy (cohérent racine §50)

4 niveaux respiration, héritage Dream main :
- **silence** (default cercle)
- **discreet** (notif in-app uniquement, pas push système)
- **active** (push système opt-in, 1×/jour max)
- **fed** (push système, ~3×/jour max)

### §7.2 — Mapping events → niveaux

| Event | Default | Override possible user |
|---|---|---|
| Nouvelle restitution prête | silent | discreet / active |
| Nudge lunaire ("3 lunes sans restitution") | silent | discreet |
| Nouveau membre rejoint | silent | discreet |
| Réaction sur ma restitution / kairos shared | silent | NEVER active (anti-engagement) |
| Témoignage sur restitution à laquelle j'ai réagi | silent | discreet |
| Rituel saisonnier proposé | silent | discreet |
| Cercle 21j archive demain | silent | discreet |
| Tension symbolique détectée (suggestion exit-to-human) | silent | discreet — toujours opt-in spécifique |
| Synchronicité détectée | silent | discreet |

**Pas de "active/fed" auto-pushed pour aucun event cercle**. Anti-extraction attention.

### §7.3 — Implementation

- Table `circle_member_notification_overrides` (user × circle × event_type → niveau).
- Per-user global override possible : *"je veux silence sur tous mes cercles, sauf restitution prête"*.

---

## §8 — K-anonymity policies enforcement

### §8.1 — Application au niveau RPC

```sql
-- RPC : aggregate kairos opt-in pour un cercle, k-anonymity safe
CREATE OR REPLACE FUNCTION get_circle_aggregate_safe(
  p_circle_id uuid,
  p_period_start timestamptz,
  p_period_end timestamptz,
  p_k_threshold int DEFAULT 3
) RETURNS jsonb AS $$
DECLARE
  result jsonb;
BEGIN
  -- Query kairos opt-in_anon dans la période
  WITH kairos_in_period AS (
    SELECT k.id, k.figures, k.motifs, k.charges, kco.user_id
    FROM kairos_circle_optin kco
    JOIN kairos k ON k.id = kco.kairos_id
    WHERE kco.circle_id = p_circle_id
      AND kco.optout_at IS NULL
      AND k.created_at BETWEEN p_period_start AND p_period_end
  ),
  -- Agrégation par figure
  figure_agg AS (
    SELECT figure, COUNT(DISTINCT user_id) as k
    FROM kairos_in_period, unnest(figures) figure
    GROUP BY figure
  ),
  -- Filter par k_threshold
  figure_safe AS (
    SELECT figure, k FROM figure_agg WHERE k >= p_k_threshold
  ),
  figure_aggregated AS (
    SELECT 'figure_categorique' as figure_label, SUM(k) as k
    FROM figure_agg WHERE k < p_k_threshold
  )
  -- Compose result jsonb
  SELECT jsonb_build_object(
    'figures_safe', (SELECT jsonb_agg(jsonb_build_object('figure', figure, 'k', k)) FROM figure_safe),
    'figures_aggregated', (SELECT jsonb_build_object('count_below_threshold', COALESCE(SUM(k), 0)) FROM figure_aggregated)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### §8.2 — Application au niveau EF

L'EF `generate-circle-restitution` consomme `get_circle_aggregate_safe` puis ne peut accéder qu'aux figures/motifs k ≥ threshold. Pas de bypass possible.

### §8.3 — Tests automatisés

- Test unit : générer cercle de 4 membres, opt-in 1 seul kairos, vérifier que figure du kairos n'apparaît PAS dans restitution mais est agrégée en "figure générique".
- Test unit : 5 membres, 3 opt-in figure X, 2 opt-in figure Y. Vérifier figure X présent (k=3), figure Y absent (k=2), figure Y agrégée.
- Test unit : Praticiens lignée k_threshold = 5, vérifier figures k=3 et k=4 toutes agrégées.

---

## §9 — Migration plan V0 → V1

### §9.1 — Pré-launch (avant V1 release)

1. **Backup tables legacy V0** (déjà couvert §2.2 backup tables).
2. **Migrate users existants** :
   - `circle_members.user_id text` → `uuid` (cf. racine §2.4 dette technique).
   - Create greek_letter pour chaque member existant.
3. **Migrate circle_shares legacy** vers `kairos_circle_shared` (avec anonymisation rétro si nécessaire).
4. **Drop circle_sessions** (legacy V0, pas utilisée selon racine).
5. **Tests régression** sur tous les endpoints legacy.

### §9.2 — V1 release

1. Deploy frontend `/cercle/*` routes.
2. Deploy EF `generate-circle-restitution`, `circle-constellation`, `kairos-anonymize-preview`, `circle-synchronicities-detect`.
3. Seed `circle_template_definitions` avec 7 templates.
4. Soft launch interne (Tim + Olga + 2-3 testeurs INFUSE) pendant 14j.
5. Audit éthique trimestriel premier passage avant ouverture publique.

### §9.3 — Post-launch monitoring

- Dashboard interne (Tim + Yeshua) :
  - Nombre de cercles actifs / archivés / éphémères.
  - Nombre de restitutions générées / mois.
  - Distribution k-anonymity (audit que k_threshold tient).
  - Distribution voix Forêt mobilisées / mois.
  - Taux d'usage des templates.
  - Reactions count / restitution (interne audit, **JAMAIS exposé user**).
  - Soft-leave rate.
- Audit trimestriel humain : 5 restitutions random reviewées par Tim + Yeshua pour qualité Q.W.A.N. + violations red lines.

---

## §10 — Supabase Edge Functions deploy

> Source canonique : reference_deploy_paths.md memory racine. **Tim deploy EF** via Supabase CLI. **Yeshua applique migrations SQL** via MCP.

### §10.1 — Workflow standard

```bash
# Tim côté local repo dream-alpha-app
cd ~/code/dream-alpha-app

# Déployer une EF
npx supabase functions deploy generate-circle-restitution --no-verify-jwt

# Déployer toutes les EF cercle
npx supabase functions deploy create-circle
npx supabase functions deploy join-circle
npx supabase functions deploy generate-circle-restitution
npx supabase functions deploy circle-constellation
npx supabase functions deploy kairos-anonymize-preview
npx supabase functions deploy circle-synchronicities-detect
npx supabase functions deploy generate-circle-final-restitution
```

### §10.2 — Migrations SQL

Yeshua crée fichier `supabase-migrations/20260428_circles_v1_full.sql` puis applique via MCP `mcp__65f7be16-...__apply_migration`.

### §10.3 — Frontend deploy

```bash
# Tim
cd ~/code/dream-alpha-app
npx vercel --prod
```

---

## §11 — Tests, QA, audits

### §11.1 — Tests unit (Vitest ou Jest)

- Tests RLS policies (chaque table).
- Tests k-anonymity enforcement (RPC `get_circle_aggregate_safe`).
- Tests trigger `assign_greek_letter`.
- Tests forbidden_terms enforcement.
- Tests trauma-aware flags propagation.

### §11.2 — Tests E2E (Playwright)

- Flow création cercle complet (template Famille).
- Flow rejoindre cercle via lien.
- Flow opt-in_anon kairos × cercle.
- Flow demande restitution + lecture.
- Flow réaction silencieuse.
- Flow soft-leave.
- Flow auto-archive cercle 21j.

### §11.3 — Audits éthiques

- **Audit trimestriel humain** : 5 restitutions random + 5 cercles random reviewés par Tim + Yeshua.
- **Audit semestriel triple filtre** : Said / Smith / Kimmerer applied à toute évolution Forêt voices mobilisables.
- **Audit annuel privacy** : auditeur tiers RGPD-spécialisé.

---

## §12 — Gaps techniques / décisions arbitrées par Yeshua

> Liste des choix pris par Yeshua faute de directive Tim explicite. À valider/réviser.

1. **Chat contextuel V1 = OUI minimaliste** (1 témoignage par membre par restitution, max 280 chars). À valider Tim.
2. **Wizard 4 steps** au lieu de 3 (ajout Step 4 — premier dépôt rituel doux). À valider.
3. **9 onglets cercle, fallback 5** si Tim juge trop riche V1.
4. **Templates pré-configurés en table SQL** (`circle_template_definitions`) au lieu de hardcoded const. Permet évolution sans migration.
5. **k_anonymity_threshold = 5** pour Praticiens lignée (vs 3 default). Conservatif.
6. **Cercle éphémère 21j limit = 1/90j en gratuit, illimité payant**. À valider.
7. **Greek letter limite = 12** = max members. Cohérent.

---

**Fin de 3_CERCLE_TECHNICAL.md**
