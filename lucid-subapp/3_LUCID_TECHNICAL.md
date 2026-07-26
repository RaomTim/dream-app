# 3_LUCID_TECHNICAL — Sub-app Lucid Dreaming, la Reconstruction

> **Doc canonique** technique de la sub-app Lucid Dreaming.
> **Date** : 2026-04-28, Bali.
> **Auteur** : Yeshua, recherche épistémique + audit code existant.
> **Subordination** : sub-canonique sous `dream-alpha-app/3_TECHNICAL.md`. Hérite stack global (Next.js 14 / Vercel / Supabase / Sonnet+Haiku / Capacitor planifié). Si conflit, doc global prime.
> **Promesse** : un dev sérieux peut prendre ce doc, retrouver les routes API existantes, identifier ce qui manque, et reconstruire la sub-app Lucid intégrée à Dream App.

---

## §0 — Avant-propos

Ce doc dit comment la sub-app Lucid se câble dans Dream App. Il s'appuie sur :
- `3_TECHNICAL.md` global (stack, conventions, deploy, privacy by architecture)
- L'audit du code existant : 8 routes API Lucid déjà créées (`/api/lucid/*`), aucune table Supabase Lucid encore migrée, aucune page React Lucid (pas de `/lucid/*` dans `src/app`)
- Les patterns DB de 1_BIBLE et 3_TECHNICAL global (encryption client-side, k-anonymity, anti-Lat/Long, opt-in granulaire)

Lecture :
- §1 — État actuel du code
- §2 — Tables Supabase Lucid à migrer
- §3 — Routes API (existantes + à créer)
- §4 — Détection NLP markers lucid (extension pipeline 8 phases)
- §5 — Forêt retrieval ciblé lucid
- §6 — Push notifications (RC contextuels, WBTB) — Capacitor wrap
- §7 — Privacy spécifique Lucid
- §8 — Migration plan (étapes ordonnées)
- §9 — Roadmap implémentation

---

## §1 — État actuel du code

### §1.1 — Routes API existantes (8 routes, créées 2026-04-26)

Localisation : `src/app/api/lucid/`

| Route | Méthode | Status |
|---|---|---|
| `/api/lucid/profile` | GET / POST | Code écrit, **table absente** — endpoint renvoie profil défaut non-persisté |
| `/api/lucid/reality-checks` | GET / POST | Code écrit, **table absente** |
| `/api/lucid/reality-checks/[id]` | GET / PUT / DELETE | Code écrit, **table absente** |
| `/api/lucid/dream-signs` | GET / POST | Code écrit, **table absente** |
| `/api/lucid/dream-signs/[id]` | GET / PUT / DELETE | Code écrit, **table absente** |
| `/api/lucid/wbtb-alarms` | GET / POST | Code écrit, **table absente** |
| `/api/lucid/wbtb-alarms/[id]` | GET / PUT / DELETE | Code écrit, **table absente** |
| `/api/lucid/extract-dream-signs` | POST | Code écrit — appel Sonnet sur kairos batch pour extraction dream signs |
| `/api/lucid/kairos-metadata` | GET / POST | Code écrit — métadonnées lucides liées à un kairos (`is_lucid`, `lucid_method`, `dreamsign_triggered_id`) |
| `/api/lucid/stats` | GET | Code écrit — backend stats (`lucidity_index`) **JAMAIS exposées user**, usage interne |
| `/api/lucid/export-obsidian` | POST | Code écrit — génère .md zip du journal lucid |

**Diagnostic** : routes prêtes, mais **les tables Supabase Lucid n'ont jamais été migrées**. Aucun `CREATE TABLE lucid_user_profile` dans `supabase/migrations/`. Toute requête en prod échouera silencieusement (handlers retournent 500 ou défauts). **Première priorité : migration SQL des tables Lucid.**

### §1.2 — Pages React absentes

Pas de `src/app/lucid/`, pas de `src/app/lucid-profile/`. Les routes API existent mais **aucune UI ne les consomme**. La nav Explorer (§11.bis.20 global) référence `/lucid-profile` mais cette route 404.

**Conséquence** : la sub-app Lucid est **non-shippée même partiellement**. C'est une bonne chose : on peut câbler proprement sans dette technique d'UI à débugger.

### §1.3 — Documents existants à honorer

- `src/_legacy_v1.1/lib-dream-legacy/protocols.ts` contient déjà 4 protocoles : DREAM 10 étapes, DAY 5 étapes, **RITUAL pré-sommeil 5 étapes** (base directe pour MILD ritual), **REENTRY 6 étapes** (base directe pour Re-entrée éveillée Aizenstat). Réutilisables.
- Cohérent avec §3.11 1_BIBLE Architecture Quick vs Protocole Accompagné.

---

## §2 — Tables Supabase Lucid à migrer

### §2.1 — `lucid_user_profile`

```sql
-- Migration: 20260429_create_lucid_subapp_tables.sql (à créer)
CREATE TABLE lucid_user_profile (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  enabled boolean NOT NULL DEFAULT false,
  -- false = chambre Lucid désactivée (sub-app pas dans nav)
  -- true = chambre Lucid activée (sub-app accessible)

  experience_level text CHECK (experience_level IN ('curieux', 'praticien', 'contemplatif')),
  -- posé via onboarding §3.1 du 2_LUCID_DESIGN

  chosen_path text CHECK (chosen_path IN ('presence_eveillee', 'pratique_technique', 'voies_contemplatives')),
  -- posé via onboarding §3.3 du 2_LUCID_DESIGN

  preferred_technique text CHECK (preferred_technique IN ('mild', 'wbtb_mild', 'ssild', 'wild', 'fild', 'spontane')),
  -- ce que le user déclare préférer pour induction (peut être null = pas de préférence)

  -- Drapeau trauma-aware (depuis onboarding §3.2)
  trauma_aware_mode boolean NOT NULL DEFAULT false,
  -- true → WBTB désactivé, SSILD désactivé, MILD light only

  ui_mode text DEFAULT 'dream_ambient',
  -- 'dream_ambient' = nav globale Dream + lucid via Explorer
  -- 'tabs_5' = nav sub-app Lucid avec 5 onglets quand dans /lucid

  obsidian_export_enabled boolean DEFAULT false,
  onboarding_completed boolean DEFAULT false,
  preferred_layout text DEFAULT 'tabs_5',

  -- Plafonds (verrous § 2.8 du 2_LUCID_DESIGN)
  rc_daily_max int DEFAULT 5 CHECK (rc_daily_max BETWEEN 1 AND 5),
  wbtb_weekly_max int DEFAULT 4 CHECK (wbtb_weekly_max BETWEEN 0 AND 4),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_user_profile_enabled ON lucid_user_profile(enabled) WHERE enabled = true;
```

### §2.2 — `lucid_reality_checks`

```sql
CREATE TABLE lucid_reality_checks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  pattern text NOT NULL,
  -- 'mains_doigts', 'texte_lire_deux_fois', 'horloge_verifier', 'custom'

  custom_label text,
  -- si pattern='custom', le user nomme le RC

  category text CHECK (category IN ('inner_awareness', 'action', 'form', 'context')),
  -- LaBerge 4 catégories

  active boolean NOT NULL DEFAULT true,
  archived_at timestamptz,

  -- Moments contextuels (max 5/jour)
  moments_of_day text[] DEFAULT ARRAY['matin', 'apres_midi', 'soir']::text[],
  -- enum-like, choisi par user dans onglet RC

  vibration_enabled boolean DEFAULT true,
  sound_enabled boolean DEFAULT false,
  custom_sound text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_rc_user_active ON lucid_reality_checks(user_id, active) WHERE active = true;

-- Plafond enforcement (anti-OCD § 2.8)
CREATE OR REPLACE FUNCTION lucid_rc_count_active(p_user_id uuid)
RETURNS int LANGUAGE sql STABLE AS $$
  SELECT count(*)::int FROM lucid_reality_checks
  WHERE user_id = p_user_id AND active = true;
$$;
```

### §2.3 — `lucid_reality_check_events`

Historique des RC effectués (eveillé / douteux / jeune lucide). Pas de heatmap, juste journal.

```sql
CREATE TABLE lucid_reality_check_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rc_id uuid NOT NULL REFERENCES lucid_reality_checks(id) ON DELETE CASCADE,

  event_at timestamptz NOT NULL DEFAULT now(),
  result text CHECK (result IN ('eveille_clair', 'douteux', 'jeune_lucide')),
  triggered_kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,
  -- si user marque que ce RC a déclenché reconnaissance dans un rêve récent

  notes text
);

CREATE INDEX idx_lucid_rc_events_user_time ON lucid_reality_check_events(user_id, event_at DESC);
```

### §2.4 — `lucid_dream_signs`

```sql
CREATE TABLE lucid_dream_signs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  label text NOT NULL,
  -- ex: "horloge déformée", "pièce inconnue dans maison familière", "mains avec 6 doigts"

  category text NOT NULL CHECK (category IN ('inner_awareness', 'action', 'form', 'context')),
  -- LaBerge 4 cat

  source text NOT NULL CHECK (source IN ('user_added', 'ia_suggested', 'ia_promoted')),
  -- 'user_added' = ajout manuel
  -- 'ia_suggested' = suggéré par IA (post-Sonnet extraction), pas encore confirmé
  -- 'ia_promoted' = suggéré par IA puis confirmé par user

  occurrence_count int DEFAULT 1,
  first_seen_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now(),

  -- kairos_ids où ce dreamsign est apparu (pour traçabilité)
  triggered_in_kairos uuid[] DEFAULT ARRAY[]::uuid[],

  active boolean NOT NULL DEFAULT true,
  archived_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_dream_signs_user_active ON lucid_dream_signs(user_id, active) WHERE active = true;
```

### §2.5 — `lucid_kairos_metadata`

Extension métadonnées Lucid pour un kairos. **Lien 1-1 avec `kairos`**.

```sql
CREATE TABLE lucid_kairos_metadata (
  kairos_id uuid PRIMARY KEY REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  is_lucid boolean NOT NULL DEFAULT false,

  -- Comment la lucidité est venue (LaBerge 4 cat + free)
  recognition_category text CHECK (recognition_category IN ('inner_awareness', 'action', 'form', 'context')),
  recognition_text text,
  -- ex: "j'ai senti que la respiration était bizarre", texte libre

  -- Technique utilisée la veille (si info)
  technique_used text CHECK (technique_used IN ('mild', 'wbtb_mild', 'ssild', 'wild', 'fild', 'spontane', 'autre', 'non_pratique')),

  -- Dreamsigns déclencheurs (FK array)
  triggered_by_dream_signs uuid[] DEFAULT ARRAY[]::uuid[],

  -- Stabilization tentée (et résultat)
  stabilization_attempted boolean DEFAULT false,
  stabilization_method text CHECK (stabilization_method IN ('spinning', 'hand_rubbing', 'verbal_command', 'autre')),
  stabilization_result text CHECK (stabilization_result IN ('success', 'partial', 'failed', 'not_attempted')),

  -- Posture (cohérent §2 1_LUCID_BIBLE)
  posture text CHECK (posture IN ('observation', 'dialogue', 'demand_gift', 'tend', 'pilote_active', 'mixed')),
  -- 'pilote_active' déclenche peut-être un nudge contemplatif ultérieur (pattern LUCID_PRESENCE_NOT_CONTROL)

  -- Sleep paralysis ou liminal pré-rêve
  hypnagogic_entry boolean DEFAULT false,
  sleep_paralysis_experienced boolean DEFAULT false,
  sleep_paralysis_anxiety int CHECK (sleep_paralysis_anxiety BETWEEN 0 AND 10),

  -- Backend lucidity index components (NEVER exposed user)
  lucidity_index_components jsonb,
  -- { count: 1, intensity: 0.7, recall_quality: 0.9, ...}

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_kairos_metadata_user ON lucid_kairos_metadata(user_id);
CREATE INDEX idx_lucid_kairos_metadata_lucid ON lucid_kairos_metadata(user_id) WHERE is_lucid = true;
```

### §2.6 — `lucid_wbtb_alarms`

```sql
CREATE TABLE lucid_wbtb_alarms (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Configuration permanente
  bedtime_habitual time DEFAULT '22:30:00',
  fall_asleep_estimate_min int DEFAULT 20,
  -- temps moyen entre coucher et endormissement

  wbtb_window_start time DEFAULT '04:00:00',
  wbtb_window_end time DEFAULT '05:30:00',
  -- fenêtre cible

  alarm_sound text DEFAULT 'cloche_tibetaine_douce',
  alarm_vibration boolean DEFAULT true,
  alarm_max_seconds int DEFAULT 30 CHECK (alarm_max_seconds <= 30),

  -- État dynamique
  scheduled_for_tonight boolean DEFAULT false,
  scheduled_for date,
  intention_for_tonight text,

  -- Ledger compliance (anti-iatrogène §2.7)
  this_week_count int DEFAULT 0,
  -- reset par cron Supabase chaque lundi 00:00 user timezone

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_lucid_wbtb_user ON lucid_wbtb_alarms(user_id);

-- RPC : peut-on programmer WBTB ce soir ?
CREATE OR REPLACE FUNCTION lucid_wbtb_can_schedule(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_count int;
  v_max int;
BEGIN
  SELECT this_week_count INTO v_count FROM lucid_wbtb_alarms WHERE user_id = p_user_id;
  SELECT wbtb_weekly_max INTO v_max FROM lucid_user_profile WHERE user_id = p_user_id;
  RETURN COALESCE(v_count, 0) < COALESCE(v_max, 4);
END;
$$;
```

### §2.7 — `lucid_wbtb_events`

Historique des WBTB effectués.

```sql
CREATE TABLE lucid_wbtb_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  scheduled_at timestamptz NOT NULL,
  woke_at timestamptz,
  -- timestamp du dismiss alarm

  intention text,
  led_to_lucid boolean DEFAULT false,
  led_to_kairos uuid REFERENCES kairos(id) ON DELETE SET NULL,

  notes text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_wbtb_events_user_time ON lucid_wbtb_events(user_id, scheduled_at DESC);
```

### §2.8 — `lucid_re_entry_sessions`

Sessions Re-entrée éveillée (Aizenstat).

```sql
CREATE TABLE lucid_re_entry_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin_kairos_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,

  started_at timestamptz NOT NULL DEFAULT now(),
  duration_seconds int,

  -- Capture libre post-re-entry (chiffrée client-side)
  capture_text_ciphertext bytea,
  capture_text_iv bytea,

  capture_method text CHECK (capture_method IN ('text', 'voice')),

  -- AHA capture
  aha_level text CHECK (aha_level IN ('fort', 'peut_etre', 'non')),
  aha_note text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_re_entry_user_time ON lucid_re_entry_sessions(user_id, started_at DESC);
CREATE INDEX idx_lucid_re_entry_origin ON lucid_re_entry_sessions(origin_kairos_id);
```

### §2.9 — `lucid_mild_sessions`

Pour ledger des rituels MILD effectués (input pour pondération Forêt et lettre narrative).

```sql
CREATE TABLE lucid_mild_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  session_at timestamptz NOT NULL DEFAULT now(),
  rehearsed_kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,
  intention_text text,
  -- ce que le user a écrit/dit pour intention

  voice_guide_played boolean DEFAULT false,
  silence_duration_seconds int,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_lucid_mild_sessions_user ON lucid_mild_sessions(user_id, session_at DESC);
```

### §2.10 — RLS Surgical (cohérent §13.3 global)

```sql
ALTER TABLE lucid_user_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_user_profile_self ON lucid_user_profile
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_reality_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_rc_self ON lucid_reality_checks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_reality_check_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_rc_events_self ON lucid_reality_check_events
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_dream_signs ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_dream_signs_self ON lucid_dream_signs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_kairos_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_kairos_metadata_self ON lucid_kairos_metadata
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_wbtb_alarms ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_wbtb_alarms_self ON lucid_wbtb_alarms
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_wbtb_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_wbtb_events_self ON lucid_wbtb_events
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_re_entry_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_re_entry_self ON lucid_re_entry_sessions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_mild_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY lucid_mild_sessions_self ON lucid_mild_sessions
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

---

## §3 — Routes API

### §3.1 — Routes existantes (à câbler aux tables une fois migrées)

| Route | Méthode | Tables | Status post-migration |
|---|---|---|---|
| `/api/lucid/profile` | GET / POST | `lucid_user_profile` | Fonctionnel |
| `/api/lucid/reality-checks` | GET / POST | `lucid_reality_checks` | Fonctionnel + ajouter check `rc_count <= max` |
| `/api/lucid/reality-checks/[id]` | GET / PUT / DELETE | `lucid_reality_checks` | Fonctionnel |
| `/api/lucid/dream-signs` | GET / POST | `lucid_dream_signs` | Fonctionnel |
| `/api/lucid/dream-signs/[id]` | GET / PUT / DELETE | `lucid_dream_signs` | Fonctionnel |
| `/api/lucid/wbtb-alarms` | GET / POST | `lucid_wbtb_alarms` | Fonctionnel + check `lucid_wbtb_can_schedule` |
| `/api/lucid/wbtb-alarms/[id]` | GET / PUT / DELETE | `lucid_wbtb_alarms` | Fonctionnel |
| `/api/lucid/extract-dream-signs` | POST | Sonnet + `lucid_dream_signs` | Fonctionnel |
| `/api/lucid/kairos-metadata` | GET / POST | `lucid_kairos_metadata` | Fonctionnel |
| `/api/lucid/stats` | GET | `lucid_kairos_metadata` agrégé | Fonctionnel — **interne uniquement, pas exposé UI globale** |
| `/api/lucid/export-obsidian` | POST | `kairos` + `lucid_kairos_metadata` | Fonctionnel |

### §3.2 — Routes nouvelles à créer

#### `POST /api/lucid/onboarding`

Body : `{ experience_level, chosen_path, trauma_aware, layout_preference }`. Crée `lucid_user_profile` row, set `enabled=true` + `onboarding_completed=true`.

#### `POST /api/lucid/disable`

Pas de delete. Set `enabled=false`. Données préservées. RLS reste actif.

#### `POST /api/lucid/rc-event`

Body : `{ rc_id, result, triggered_kairos_id?, notes? }`. Insert dans `lucid_reality_check_events`. Trigger lucidity_index recompute (background).

#### `POST /api/lucid/wbtb/schedule-tonight`

Body : `{ intention }`. Avant insert, RPC `lucid_wbtb_can_schedule(user_id)`. Si `false` → 403 avec message *"Plafond hebdo atteint pour ta sécurité"*. Si `true` → set `scheduled_for_tonight=true`, increment `this_week_count`.

#### `POST /api/lucid/wbtb/dismiss`

Réveil par alarme. Insert `lucid_wbtb_events` (`woke_at=now()`, `intention=...`). Décrément `scheduled_for_tonight`.

#### `POST /api/lucid/re-entry/start`

Body : `{ origin_kairos_id }`. Crée `lucid_re_entry_sessions` row.

#### `POST /api/lucid/re-entry/[id]/complete`

Body : `{ capture_text_ciphertext, capture_text_iv, capture_method, aha_level?, aha_note? }`. Update row.

#### `POST /api/lucid/mild/log`

Body : `{ rehearsed_kairos_id?, intention_text, voice_guide_played, silence_duration_seconds }`. Insert `lucid_mild_sessions`.

#### `POST /api/lucid/practice-letter`

Génère lettre narrative (cohérent §2.14 PRACTICE_NOT_SCORE_NARRATIVE). Sonnet ~200-400 mots. Cache 14j.

```typescript
// Pseudocode handler
export async function POST(req) {
  const auth = await requireAuth(req)
  const { userId } = auth

  // Cache check
  const cached = await getCachedLucidPracticeLetter(userId, maxAgeDays: 14)
  if (cached) return NextResponse.json(cached)

  // Fetch journal lucid (last 90 days, ~50 kairos max)
  const lucidKairos = await fetchLucidKairos(userId, { since: '90d', limit: 50 })

  // Fetch RC events recent
  const rcEvents = await fetchRcEvents(userId, { since: '90d', limit: 200 })

  // Fetch dreamsigns recurrents
  const dreamsigns = await fetchActiveDreamsigns(userId)

  // Fetch MILD sessions
  const mildSessions = await fetchMildSessions(userId, { since: '90d' })

  // Compose Sonnet prompt — system: anti-gamification strict, no count visible
  // user: condensed input ~2000 tokens
  const letter = await sonnetCompose({
    systemPrompt: LUCID_PRACTICE_LETTER_SYSTEM,
    inputs: { lucidKairos, rcEvents, dreamsigns, mildSessions },
    maxTokens: 800
  })

  // Cache + return
  await cacheLucidPracticeLetter(userId, letter)
  return NextResponse.json({ letter })
}
```

#### `POST /api/lucid/forest-reading`

Forêt FIRST sur kairos lucide avec retrieve ciblé (cf. §5).

Body : `{ kairos_id }`. Vérifie que `lucid_kairos_metadata.is_lucid=true`. Retrieve avec `dream_role IN ('lucid','protocol','interpretation')`. 3 angles polyphoniques (paper/stone/silk) cohérent global Forêt FIRST.

#### `GET /api/lucid/dreamsigns/suggestions`

Suggère nouveaux dreamsigns basés sur extraction silencieuse Sonnet du journal (lucid + non-lucid). Max 3/mois proposés. Si user n'a pas marqué de dreamsign suggéré pendant 30j, decay du score.

```typescript
// Pseudocode
async function suggestDreamsigns(userId) {
  const recentKairos = await fetchKairos(userId, { since: '30d', limit: 30 })
  // Sonnet pass: extract anomalies récurrentes
  const candidates = await sonnetExtractAnomalies(recentKairos)
  // Filter against existing dream_signs (avoid duplicates)
  const existingLabels = await fetchActiveDreamsigns(userId).map(d => d.label)
  const novelCandidates = candidates.filter(c => !duplicateOf(c, existingLabels))
  // Pick top 3 by occurrence_count
  return novelCandidates.sort((a, b) => b.occurrence_count - a.occurrence_count).slice(0, 3)
}
```

### §3.3 — Pipeline extension : détection NLP markers lucid

Cohérent §4 ci-dessous. Voir détail.

---

## §4 — Détection NLP markers lucid (extension pipeline 8 phases)

Cohérent §38 global Pipeline 8 phases async.

### §4.1 — Position dans le pipeline

Après Passe 2 Sonnet extraction enrichie (`/api/dreams/extract-deep` ou équivalent kairos pipeline) → **nouvelle Phase 3.5 : `detect-lucid-markers`** (parallélisable).

```
Phase 1: Capture user (raw_text)
Phase 2: Haiku passe 1 (titre + structure courte)
Phase 3: Sonnet passe 2 (extraction enrichie + Forêt FIRST)
Phase 3.5: Sonnet passe 2.5 detect-lucid-markers (NEW)
Phase 4: OpenAI embedding
Phase 5: Synthesis cross-portrait (si multi-kairos)
Phase 6+: aggregations (V2)
```

### §4.2 — Algorithme `detect-lucid-markers`

```typescript
// Markers patterns FR + EN (regex souples + Sonnet semantic detection)
const LUCID_MARKERS_PATTERNS = [
  // explicit
  /j'ai (?:su|réalisé|compris|pris conscience) (?:que|qu')(?:c'?était| j'étais en train de) (?:un )?rêv(?:e|ais)/i,
  /j'(?:étais|ai été) lucide/i,
  /(?:devenir|devenu|été) lucide (?:dans|en)/i,
  /(?:reality check|RC).{0,40}(?:dans|pendant) (?:le |mon )?rêve/i,
  /j'ai (?:regardé|vérifié) (?:mes|les) mains.{0,50}(?:c'?était un rêve)/i,
  // implicit
  /soudain (?:j'ai|je) (?:su|compris|réalisé)/i,
  /je (?:savais|avais conscience) (?:que|qu')je rêvais/i,
  // EN
  /\bI (?:realized|knew|understood) (?:I was )?dreaming/i,
  /\bbecame lucid\b/i,
  /\bdid a reality check\b/i
]

async function detectLucidMarkers(rawText: string): Promise<{ is_lucid_candidate: boolean, confidence: number, evidence: string[] }> {
  // Pass 1 — regex
  const regexMatches = LUCID_MARKERS_PATTERNS.filter(p => p.test(rawText))

  if (regexMatches.length >= 1) {
    return {
      is_lucid_candidate: true,
      confidence: regexMatches.length >= 2 ? 0.95 : 0.85,
      evidence: regexMatches.map(p => extractMatch(rawText, p))
    }
  }

  // Pass 2 — Sonnet semantic detection (more nuanced)
  // Catches: "je flottais en sachant que c'était imaginaire", "j'avais conscience de la fabrique du rêve"
  const sonnetResult = await sonnetClassify({
    systemPrompt: 'You are a dream phenomenology expert. Determine if this dream report contains markers of lucidity (the dreamer recognizing they were dreaming during the dream itself). Respond with JSON: {is_lucid_candidate: boolean, confidence: 0-1, evidence: string[]}',
    userText: rawText,
    maxTokens: 300
  })

  return sonnetResult
}
```

### §4.3 — Action post-détection

Si `is_lucid_candidate = true` AND `confidence >= 0.7` :

1. Insert dans `lucid_kairos_metadata` row avec `is_lucid = NULL` (pas confirmé encore — attente confirmation user).
2. Émet event vers UI (via Supabase realtime ou polling) : *"As-tu reconnu le rêve cette nuit ?"*. Cohérent §2.3 `LUCID_TYPE_TAG_EMERGENT`.
3. Si user confirm `Oui` → set `is_lucid=true`, propose sub-questions (technique, dreamsign, posture).
4. Si user confirm `Non` → set `is_lucid=false`, **flag `false_positive_detection=true`** pour fine-tuning future regex.
5. Si user `Pas sûr` → garder `is_lucid=NULL`. Réinviter dans 7 jours si pas répondu.

### §4.4 — Coût et latence

- Phase 3.5 supplémentaire : 1 appel Sonnet ~300 tokens output × 0.5-1 cent USD = ~0.5-1 cent/kairos. Négligeable.
- Latence : ~1-2s (parallélisable avec Phase 4 embedding).
- Optimisation : skip Phase 3.5 si Phase 2 Sonnet a déjà classé `framework_level='F2'` AND détecté `double_dream=true`. Dans ce cas, lucid_candidate inféré direct.

---

## §5 — Forêt retrieval ciblé lucid

### §5.1 — Tagging des sources Forêt pour lucid

Cohérent global `book_root_assignments` (§16.2 ou équivalent). Ajouter / vérifier `dream_role` tag pour les livres lucid-pertinents :

| Source | dream_role | Notes |
|---|---|---|
| `laberge-a-course-in-lucid-dreaming` | `protocol`, `lucid` | Source primaire technique. priority = 5 |
| `moss-dreamgates` | `lucid`, `protocol`, `tradition` | Voyage conscient, voix INFUSE primaire. priority = 5 |
| `moss-dreamways-of-the-iroquois` | `lucid`, `tradition` | Conscious dreaming Iroquois. priority = 4 |
| `moss-mysterious-realities` | `lucid`, `tradition` | Active dreaming étendu. priority = 4 |
| `moss-secret-history-dreaming` | `lucid`, `tradition` | Histoire des pratiques. priority = 4 |
| `aizenstat-dream-tending` | `lucid`, `interpretation`, `safety` | Re-entry, eidola autonomes. priority = 5 |
| `kaplan-williams-jungian-senoi` | `lucid`, `interpretation` | Senoi (advisory smith), Jungian dreamwork. priority = 3 |
| `wangyal-tibetan-yogas` | `lucid`, `safety` | **DO NOT CITE USER-FACING** (advisory). priority = 0 user-facing, 5 internal corrective only. Special flag : `do_not_cite_user_facing = true` dans `book_root_assignments.notes`. |
| `mavromatis-hypnagogia` *(si digéré, sinon gap)* | `lucid`, `interpretation` | Hypnagogie. À vérifier digest. priority = 3 |
| `bachelard-poetique-reverie` | `lucid` (secondary), `interpretation` | Reverie diurne, soutien posture. priority = 3 |
| `jung-memories-dreams-reflections` | `lucid` (secondary), `interpretation` | Active imagination, individuation. priority = 3 |
| `delaney-all-about-dreams` | `lucid` (secondary), `interpretation` | Dreamwork cognitif, peu lucid-direct. priority = 2 |

### §5.2 — Modifier RPC `match_kairos_for_wisdom` pour lucid

Cohérent §47.2 global. Variante :

```sql
CREATE OR REPLACE FUNCTION match_lucid_forest_chunks(
  p_query_embedding vector(1536),
  p_user_id uuid,
  p_match_count int DEFAULT 12,
  p_lucid_only boolean DEFAULT true
)
RETURNS TABLE(
  chunk_id bigint,
  book_id text,
  book_title text,
  book_author text,
  chunk_text text,
  page_start int,
  page_end int,
  similarity real,
  do_not_cite boolean
)
LANGUAGE plpgsql STABLE AS $$
BEGIN
  RETURN QUERY
  SELECT
    fc.id,
    fc.book_id,
    fb.title,
    fb.author,
    fc.chunk_text,
    fc.page_start,
    fc.page_end,
    (1 - (fc.embedding <=> p_query_embedding))::real as similarity,
    COALESCE((bra.notes->>'do_not_cite_user_facing')::boolean, false) as do_not_cite
  FROM forest_chunks fc
  JOIN forest_books fb ON fb.id = fc.book_id
  LEFT JOIN book_root_assignments bra ON bra.book_id = fc.book_id AND bra.dream_role = 'lucid'
  WHERE
    (NOT p_lucid_only OR bra.dream_role IN ('lucid','protocol','interpretation','safety'))
  ORDER BY fc.embedding <=> p_query_embedding
  LIMIT p_match_count;
END;
$$;
```

### §5.3 — Filtrage user-facing

Dans le pipeline Forêt FIRST 3 angles : si `do_not_cite_user_facing = true` (Wangyal), on **utilise** le chunk pour **inspirer** la voix absorbée (cf. §5.4 global VOIX_ABSORBÉE_PAS_BIBLIOGRAPHIE) mais on **n'attribue jamais** Wangyal en signature. La voix peut être attribuée à Moss ou Aizenstat ou laissée anonyme.

```typescript
function buildPolyphonyAttributions(chunks: ForestChunk[]): string[] {
  return chunks
    .filter(c => !c.do_not_cite_user_facing)
    .map(c => `${c.book_author}, *${c.book_title}*`)
    .slice(0, 3)
}
```

---

## §6 — Push notifications (RC contextuels, WBTB) — Capacitor wrap

### §6.1 — Architecture

Cohérent §1.5 global Capacitor planifié post-Apple Dev approval (DUNS obtenue 2026-04-19, Apple Dev account en attente).

Push natifs requis :
- **Reality Checks** : badge in-app + vibration (anti-stress, pas de push notif system)
- **WBTB alarm** : push notif système + son + vibration (réveil)

### §6.2 — Capacitor plugins requis

```json
{
  "@capacitor/local-notifications": "^5.0.0",
  "@capacitor/haptics": "^5.0.0",
  "@capacitor/push-notifications": "^5.0.0"
}
```

### §6.3 — Reality Check trigger natif

```typescript
// src/lib/lucid-rc-scheduler.ts
import { LocalNotifications } from '@capacitor/local-notifications'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

export async function scheduleRcRemindersForToday(userId: string) {
  const profile = await fetchLucidProfile(userId)
  const rcs = await fetchActiveRcs(userId)

  // Map moments_of_day to specific times
  const momentTimes = {
    matin: '07:30',
    apres_midi: '14:00',
    soir: '21:30',
    transitions: ['08:30', '13:00', '18:30'] // user can configure
  }

  const notifications = []
  let count = 0

  for (const rc of rcs) {
    for (const moment of rc.moments_of_day) {
      if (count >= profile.rc_daily_max) break // §2.8 plafond
      const time = resolveTime(moment, momentTimes)
      notifications.push({
        title: '✦ Reality check',
        body: `${rc.custom_label || rc.pattern}`,
        id: hashRcId(rc.id, moment),
        schedule: { at: time, repeats: true, on: { hour: time.h, minute: time.m } },
        // Pas de "actionTypeId" qui force user à interagir
        // Badge in-app, pas notif lock-screen invasive
        sound: rc.sound_enabled ? 'default' : 'silent',
        attachments: undefined,
        smallIcon: 'ic_lucid_rc',
      })
      count++
    }
  }

  await LocalNotifications.schedule({ notifications })
}
```

### §6.4 — WBTB alarm trigger natif

```typescript
export async function scheduleWbtbForTonight(userId: string, intention: string) {
  // Server check: lucid_wbtb_can_schedule
  const canSchedule = await api('/api/lucid/wbtb/schedule-tonight', { method: 'POST', body: { intention } })
  if (!canSchedule.ok) {
    showToast('Plafond hebdo atteint pour ta sécurité')
    return
  }

  const config = await fetchWbtbConfig(userId)
  const target = computeWbtbTime(config) // ~5h après endormissement estimé

  await LocalNotifications.schedule({
    notifications: [{
      title: 'WBTB',
      body: 'Doucement. Reviens à ton intention.',
      id: hashWbtbId(userId, target),
      schedule: { at: target },
      sound: config.alarm_sound + '.mp3',
      smallIcon: 'ic_lucid_wbtb',
      // CRITICAL: pas de "ongoing: true" qui ferait alarme persistante
      // User peut dismiss en 1 tap
    }]
  })

  // Hook : on dismiss, ouvrir directement écran intention
  LocalNotifications.addListener('localNotificationActionPerformed', async (action) => {
    if (action.notification.id === hashWbtbId(userId, target)) {
      // POST /api/lucid/wbtb/dismiss
      // Open route /lucid/wbtb-intention
    }
  })
}
```

### §6.5 — Permissions à demander

- `notifications` : pour LocalNotifications
- `vibrate` : Haptics
- iOS : `criticalAlerts` non demandé (réveil n'est pas critique au sens médical)

---

## §7 — Privacy spécifique Lucid

Cohérent §14 global Privacy by architecture.

### §7.1 — Lucid sensitive data (chiffrement client-side)

Champs sensibles à chiffrer client-side (cohérent global zero-knowledge) :
- `lucid_re_entry_sessions.capture_text` (déjà ciphertext + iv dans schema §2.8)
- `lucid_wbtb_alarms.intention_for_tonight` — **à chiffrer en V1.5** (V1 plain pour itérer pédagogie)
- `lucid_mild_sessions.intention_text` — idem
- `lucid_kairos_metadata.recognition_text` — idem

V1 launch : chiffrement client-side **uniquement** sur re_entry capture (le plus sensible). Reste plain mais RLS strict. V1.5 : étendre.

### §7.2 — Freeze mode pour lucid

Cohérent §10 global trauma-safe Pilier 4 (mode "juste journal" sans IA). Pour Lucid :
- `lucid_user_profile.trauma_aware_mode = true` → no IA letter, no dreamsign suggestions, no NLP detect-lucid-markers (le user marque manuellement).
- En cas de pattern à risque détecté (3+ sleep paralysis anxiogènes en 14j) → propose freeze automatique 30j.

### §7.3 — Pas de Lat/Long jamais

Cohérent §3.1 global. Aucune table Lucid n'a `geo_lat / geo_lng`. Si user veut tagger un lieu de pratique, `toponym_user_defined` opaque (pas dans schema V1, optionnel V2).

### §7.4 — Anti-panopticon Anima Mundi

Si Anima Mundi V1+ inclut dimension lucid (V2+), pipeline architecturalement séparé (cohérent §42.11 global). K-anonymity 250 conservatif. Aucune signature individuelle.

### §7.5 — Export Obsidian

`/api/lucid/export-obsidian` génère un .zip avec :
- `_INDEX.md` (overview practice, pas de stats)
- `kairos/YYYY-MM-DD-titre.md` pour chaque kairos lucide (raw_text + metadata)
- `dream_signs.md` (liste personnelle)
- `re_entry_sessions/YYYY-MM-DD-titre.md`
- `mild_sessions.md` (intention log, sans timestamp précis pour préserver privacy si export partagé)

Decryption client-side avant zip. Server ne voit jamais texte clair.

---

## §8 — Migration plan (étapes ordonnées)

### Étape 1 — Migration DB (priorité immédiate)

```bash
# Yeshua via MCP Supabase
mcp__65f7be16-...__apply_migration({
  project_id: 'rtrkxzcyblgonwgfzovj',
  name: '20260429_create_lucid_subapp_tables',
  query: '...' // SQL §2 entier
})
```

Vérification : `mcp__list_tables` confirme 9 tables `lucid_*` + `mp_lucid_*` indexes.

### Étape 2 — Câblage routes API existantes

Routes Lucid existantes (§3.1) pointaient vers tables absentes. Ajouter checks supplémentaires :
- `/api/lucid/wbtb-alarms` POST → vérifier `lucid_wbtb_can_schedule` RPC
- `/api/lucid/reality-checks` POST → vérifier count actif < 6

### Étape 3 — Routes API nouvelles

Implémenter §3.2 (~10 nouvelles routes).

### Étape 4 — Pipeline NLP detect-lucid-markers

Phase 3.5 du pipeline 8 phases (§4). Ajouter dans `/api/dreams/extract-deep` ou créer `/api/dreams/detect-lucid` séparé.

### Étape 5 — Forêt retrieval ciblé

Tagger les 12 livres en `book_root_assignments` (§5.1). Créer RPC `match_lucid_forest_chunks` (§5.2).

### Étape 6 — UI React (sub-app frontend)

Créer pages :
- `src/app/lucid/page.tsx` (default redirect → onglet Pratique)
- `src/app/lucid/profile/page.tsx`
- `src/app/lucid/reality-checks/page.tsx`
- `src/app/lucid/dream-signs/page.tsx`
- `src/app/lucid/wbtb/page.tsx`
- `src/app/lucid/practice/page.tsx`

Components partagés :
- `src/components/lucid/LucidNav.tsx` (BottomNav 5 onglets)
- `src/components/lucid/RcCard.tsx`
- `src/components/lucid/DreamSignCard.tsx`
- `src/components/lucid/WbtbConfig.tsx`
- `src/components/lucid/MildRitual.tsx`
- `src/components/lucid/ReEntrySession.tsx`
- `src/components/lucid/PracticeLetter.tsx`

### Étape 7 — Capacitor wrap (post-Apple Dev)

Implémenter §6 push notifications natifs.

### Étape 8 — Onboarding Lucid

Sub-flow 3 écrans (§3 du 2_LUCID_DESIGN). Composant `src/components/lucid/LucidOnboarding.tsx`. Trigger : tap "◐ Mode Lucid" depuis Explorer.

### Étape 9 — Bridge auto Dream App principal → Lucid

Détecter `is_lucid_candidate` dans le flow capture, prompt user, opt-in douce.

### Étape 10 — Test + audit éthique

Avant launch publique sub-app Lucid :
- Lecture par 1 thérapeute trauma + 1 lucid researcher (Stumbrys-aligned ou équivalent)
- Test d'usage par 5 oneironautes externes (range : Léa débutante / Marcus expérimenté / Yann contemplatif)
- Validation des plafonds anti-iatrogène
- Validation copies anti-pilotage

---

## §9 — Roadmap implémentation (estimation effort)

| Étape | Effort dev | Status |
|---|---|---|
| Migration DB | 1h | ⏳ |
| Câblage routes existantes (vérifications) | 2h | ⏳ |
| Routes nouvelles (10 routes) | 6-8h | ⏳ |
| Pipeline NLP detect-lucid-markers | 3-4h | ⏳ |
| Forêt retrieval ciblé | 2h | ⏳ |
| UI React 5 onglets | 12-16h | ⏳ |
| Onboarding 3 écrans | 3h | ⏳ |
| Bridge auto Dream App ↔ Lucid | 2h | ⏳ |
| MILD ritual (composant + voix audio) | 4h | ⏳ |
| Re-entry Aizenstat (composant) | 3h | ⏳ |
| Practice letter (Sonnet pipeline + cache) | 3h | ⏳ |
| Capacitor wrap (post-Apple Dev) | 6-8h | ⏳ post-DUNS Apple |
| Test + audit | 4h | ⏳ |
| **Total V1** | **~50-60h dev** | |

V2 (Cercle Lucid + voies contemplatives expansion) : +30h.

---

## §10 — Glossaire technique Lucid

- **`is_lucid`** : flag boolean dans `lucid_kairos_metadata` (NULL = pas encore confirmé, true/false = user-validated)
- **`is_lucid_candidate`** : flag inféré par NLP detect-lucid-markers (Phase 3.5), avant confirmation user
- **`lucidity_index`** : score backend composite count × intensity × recall_quality. Jamais exposé user. Sert : suggérer pause si chute brutale, pondérer practice letter
- **`recognition_category`** : LaBerge 4 cat (Inner Awareness / Action / Form / Context)
- **`technique_used`** : MILD / WBTB+MILD / SSILD / WILD / FILD / Spontané / Autre / Non pratiqué
- **`posture`** : observation / dialogue / demand_gift / tend / pilote_active / mixed (cohérent §2.2 1_LUCID_BIBLE)
- **`do_not_cite_user_facing`** : flag dans `book_root_assignments.notes` qui empêche attribution Wangyal user-facing tout en utilisant le chunk en interne
- **`trauma_aware_mode`** : mode dégradé (WBTB désactivé, SSILD désactivé) déclenché par onboarding §3.2 ou détection pattern à risque
- **`ledger`** : table d'évènements (RC events, WBTB events, MILD sessions, re-entry sessions). Cohérent §22 global ledger.

---

## §11 — Roadmap migration vers V1.5

Quand sub-app Lucid V1 est shippée stable (après ~60h dev + 2 sem testing) :

1. **Chiffrement étendu** : `wbtb_alarms.intention`, `mild_sessions.intention_text`, `kairos_metadata.recognition_text`
2. **Mode connaisseur opt-in** (Marcus persona) : accès dataviz dans Profil section "Mode données brutes" — graphes, count, lucidity_index visible. Strict opt-in, default off.
3. **Voix MILD audio** : enregistrement FR pro (~30s) — Tim ou freelance INFUSE-aligned
4. **Affinement detect-lucid-markers** via fine-tuning sur false_positive_detection collectées V1
5. **Tracker du sommeil opt-in** (heure coucher / heure levée déclarées par user) pour ajuster suggestions WBTB. Pas de tracker passif.

---

> *"L'infrastructure est petite, la posture est tout. 9 tables et 20 routes ne font pas une chambre Lucid. La cohérence avec 1_BIBLE et 2_DESIGN la fait."*
> — formulation INFUSE, 2026-04-28.
