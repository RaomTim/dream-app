-- ════════════════════════════════════════════════════════════════════════════
-- Migration : 20260428_lucid_subapp_v1_complete
-- Auteur    : Yeshua, 2026-04-28
-- But       : Compléter la sub-app Lucid V1 — schéma DB cohérent avec
--             3_LUCID_TECHNICAL.md §2 + 1_LUCID_BIBLE §2.2/§4.4 (anti-iatrogène,
--             trauma-aware, posture présence-pas-pilotage, anti-gamification).
--
-- Audit pré-migration (5 tables existantes) :
--   - lucid_user_profile           ✓ existe (manque : chosen_path, trauma_aware_mode, plafonds)
--   - lucid_reality_checks          ✓ existe (manque : category, moments_of_day, archived_at)
--   - lucid_dream_signs             ✓ existe (manque : triggered_in_kairos[], active, source)
--   - lucid_kairos_metadata         ✓ existe (manque : is_lucid bool, recognition_category,
--                                              posture, stabilization_*, hypnagogic_*, sleep_paralysis_*)
--   - lucid_wbtb_alarms             ✓ existe (manque : this_week_count, scheduled_for_tonight,
--                                              fall_asleep_estimate, wbtb_window_*)
--
-- Tables nouvelles à créer :
--   - lucid_reality_check_events    (journal RC effectués — anti-leaderboard)
--   - lucid_wbtb_events              (journal WBTB)
--   - lucid_re_entry_sessions        (Aizenstat dream-tending re-entry)
--   - lucid_mild_sessions            (rituels MILD)
--   - lucid_practice_letters         (cache lettres narratives mensuelles)
--   - lucid_session_events           (table générique session lucide complète)
-- ════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- §1 — ALTER TABLE : compléter les 5 existantes
-- ────────────────────────────────────────────────────────────────────────────

-- ── lucid_user_profile ──────────────────────────────────────────────────────
ALTER TABLE lucid_user_profile
  ADD COLUMN IF NOT EXISTS chosen_path text
    CHECK (chosen_path IN ('presence_eveillee', 'pratique_technique', 'voies_contemplatives')),
  ADD COLUMN IF NOT EXISTS trauma_aware_mode boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS rc_daily_max int DEFAULT 5
    CHECK (rc_daily_max BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS wbtb_weekly_max int DEFAULT 4
    CHECK (wbtb_weekly_max BETWEEN 0 AND 4),
  ADD COLUMN IF NOT EXISTS preferred_voice text DEFAULT 'silk_gold'
    CHECK (preferred_voice IN ('silk_gold', 'aizenstat_tend', 'moss_voyageur', 'minimal'));

CREATE INDEX IF NOT EXISTS idx_lucid_user_profile_enabled
  ON lucid_user_profile(enabled) WHERE enabled = true;

-- ── lucid_reality_checks ────────────────────────────────────────────────────
ALTER TABLE lucid_reality_checks
  ADD COLUMN IF NOT EXISTS category text
    CHECK (category IN ('inner_awareness', 'action', 'form', 'context')),
  ADD COLUMN IF NOT EXISTS moments_of_day text[] DEFAULT ARRAY['matin', 'apres_midi', 'soir']::text[],
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_lucid_rc_user_active
  ON lucid_reality_checks(user_id, active) WHERE active = true;

-- ── lucid_dream_signs ───────────────────────────────────────────────────────
ALTER TABLE lucid_dream_signs
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'user_added'
    CHECK (source IN ('user_added', 'ia_suggested', 'ia_promoted', 'nlp_auto', 'user_manual')),
  ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS triggered_in_kairos uuid[] DEFAULT ARRAY[]::uuid[],
  ADD COLUMN IF NOT EXISTS first_seen_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_lucid_dream_signs_user_active
  ON lucid_dream_signs(user_id, active) WHERE active = true;

-- ── lucid_kairos_metadata ───────────────────────────────────────────────────
ALTER TABLE lucid_kairos_metadata
  ADD COLUMN IF NOT EXISTS is_lucid boolean,
  ADD COLUMN IF NOT EXISTS recognition_category text
    CHECK (recognition_category IN ('inner_awareness', 'action', 'form', 'context')),
  ADD COLUMN IF NOT EXISTS recognition_text text,
  ADD COLUMN IF NOT EXISTS technique_used text
    CHECK (technique_used IN ('mild', 'wbtb_mild', 'ssild', 'wild', 'fild', 'spontane', 'autre', 'non_pratique')),
  ADD COLUMN IF NOT EXISTS triggered_by_dream_signs uuid[] DEFAULT ARRAY[]::uuid[],
  ADD COLUMN IF NOT EXISTS stabilization_attempted boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS stabilization_method text
    CHECK (stabilization_method IN ('spinning', 'hand_rubbing', 'verbal_command', 'autre', NULL)),
  ADD COLUMN IF NOT EXISTS stabilization_result text
    CHECK (stabilization_result IN ('success', 'partial', 'failed', 'not_attempted')),
  ADD COLUMN IF NOT EXISTS posture text
    CHECK (posture IN ('observation', 'dialogue', 'demand_gift', 'tend', 'pilote_active', 'mixed')),
  ADD COLUMN IF NOT EXISTS hypnagogic_entry boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sleep_paralysis_experienced boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sleep_paralysis_anxiety int
    CHECK (sleep_paralysis_anxiety BETWEEN 0 AND 10),
  ADD COLUMN IF NOT EXISTS lucidity_index_components jsonb,
  ADD COLUMN IF NOT EXISTS valence_at_recognition real
    CHECK (valence_at_recognition BETWEEN -1 AND 1),
  ADD COLUMN IF NOT EXISTS detection_confidence real
    CHECK (detection_confidence BETWEEN 0 AND 1),
  ADD COLUMN IF NOT EXISTS detection_signals text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS user_confirmed boolean,
  ADD COLUMN IF NOT EXISTS false_positive_detection boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_lucid_kairos_metadata_lucid
  ON lucid_kairos_metadata(user_id) WHERE is_lucid = true;
CREATE INDEX IF NOT EXISTS idx_lucid_kairos_metadata_pending
  ON lucid_kairos_metadata(user_id) WHERE user_confirmed IS NULL AND is_lucid IS NULL;

-- ── lucid_wbtb_alarms ───────────────────────────────────────────────────────
-- Note : la table existante n'est pas unique-per-user. Le brief technique
-- veut un enregistrement par-user (config permanente). On garde la flexibilité
-- d'avoir plusieurs alarmes (jours différents) MAIS on ajoute le ledger.
ALTER TABLE lucid_wbtb_alarms
  ADD COLUMN IF NOT EXISTS fall_asleep_estimate_min int DEFAULT 20,
  ADD COLUMN IF NOT EXISTS wbtb_window_start time DEFAULT '04:00:00',
  ADD COLUMN IF NOT EXISTS wbtb_window_end time DEFAULT '05:30:00',
  ADD COLUMN IF NOT EXISTS alarm_max_seconds int DEFAULT 30
    CHECK (alarm_max_seconds <= 30),
  ADD COLUMN IF NOT EXISTS scheduled_for_tonight boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_for date,
  ADD COLUMN IF NOT EXISTS intention_for_tonight text,
  ADD COLUMN IF NOT EXISTS this_week_count int DEFAULT 0,
  ADD COLUMN IF NOT EXISTS week_resets_at timestamptz DEFAULT (date_trunc('week', now()) + interval '7 days'),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ────────────────────────────────────────────────────────────────────────────
-- §2 — TABLES NOUVELLES
-- ────────────────────────────────────────────────────────────────────────────

-- ── lucid_reality_check_events ──────────────────────────────────────────────
-- Journal des RC effectués (eveillé / douteux / jeune lucide). Pas de heatmap.
CREATE TABLE IF NOT EXISTS lucid_reality_check_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rc_id uuid REFERENCES lucid_reality_checks(id) ON DELETE SET NULL,

  event_at timestamptz NOT NULL DEFAULT now(),
  result text CHECK (result IN ('eveille_clair', 'douteux', 'jeune_lucide')),
  triggered_kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,

  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucid_rc_events_user_time
  ON lucid_reality_check_events(user_id, event_at DESC);

-- ── lucid_wbtb_events ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lucid_wbtb_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alarm_id uuid REFERENCES lucid_wbtb_alarms(id) ON DELETE SET NULL,

  scheduled_at timestamptz NOT NULL,
  woke_at timestamptz,
  intention text,
  led_to_lucid boolean DEFAULT false,
  led_to_kairos uuid REFERENCES kairos(id) ON DELETE SET NULL,
  notes text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucid_wbtb_events_user_time
  ON lucid_wbtb_events(user_id, scheduled_at DESC);

-- ── lucid_re_entry_sessions ─────────────────────────────────────────────────
-- Re-entry consciente (Aizenstat) sur kairos passé. Capture chiffrée client-side.
CREATE TABLE IF NOT EXISTS lucid_re_entry_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  origin_kairos_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,

  started_at timestamptz NOT NULL DEFAULT now(),
  duration_seconds int,

  -- Capture libre post-re-entry (V1 : peut être plain texte ; V1.5 : ciphertext+iv)
  capture_text text,
  capture_text_ciphertext bytea,
  capture_text_iv bytea,
  capture_method text CHECK (capture_method IN ('text', 'voice')),

  -- AHA capture (cohérent /api/journal/summons feedback pattern)
  aha_level text CHECK (aha_level IN ('fort', 'peut_etre', 'non')),
  aha_note text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucid_re_entry_user_time
  ON lucid_re_entry_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_lucid_re_entry_origin
  ON lucid_re_entry_sessions(origin_kairos_id);

-- ── lucid_mild_sessions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lucid_mild_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  session_at timestamptz NOT NULL DEFAULT now(),
  rehearsed_kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,
  intention_text text,
  voice_guide_played boolean DEFAULT false,
  silence_duration_seconds int,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucid_mild_sessions_user
  ON lucid_mild_sessions(user_id, session_at DESC);

-- ── lucid_session_events ────────────────────────────────────────────────────
-- Table générique pour tracking sessions lucides complètes (induction → réveil).
-- Distinct des ledgers MILD/WBTB/RC : capture une SESSION complète.
CREATE TABLE IF NOT EXISTS lucid_session_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  session_started_at timestamptz NOT NULL DEFAULT now(),
  session_ended_at timestamptz,
  duration_minutes int,

  -- Technique utilisée
  technique text CHECK (technique IN ('mild', 'wbtb_mild', 'ssild', 'wild', 'fild', 'spontane', 'autre', 'non_pratique')),

  -- Lien éventuel kairos (si la session a produit un rêve)
  resulted_kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,

  -- Lien WBTB / MILD / Re-entry origines
  wbtb_event_id uuid REFERENCES lucid_wbtb_events(id) ON DELETE SET NULL,
  mild_session_id uuid REFERENCES lucid_mild_sessions(id) ON DELETE SET NULL,

  -- Awareness narratif (anti-score : pas exposé user, sert lettre + pondération Forêt)
  awareness_level text CHECK (awareness_level IN ('present', 'flux', 'dialogue', 'observation', 'piloted', 'lost')),

  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucid_session_events_user_time
  ON lucid_session_events(user_id, session_started_at DESC);

-- ── lucid_practice_letters ──────────────────────────────────────────────────
-- Cache des lettres narratives mensuelles (Sonnet 200-400 mots, anti-gamification).
CREATE TABLE IF NOT EXISTS lucid_practice_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Période couverte (typiquement 90 derniers jours)
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,

  letter_text text NOT NULL,
  word_count int,
  -- Inputs résumés (pour traçabilité, pas exposé user)
  input_kairos_count int DEFAULT 0,
  input_rc_events_count int DEFAULT 0,
  input_dreamsigns_count int DEFAULT 0,
  input_mild_sessions_count int DEFAULT 0,

  model text DEFAULT 'claude-sonnet-4-6',
  cache_valid_until timestamptz NOT NULL DEFAULT (now() + interval '14 days'),

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lucid_practice_letters_user_recent
  ON lucid_practice_letters(user_id, created_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- §3 — RPC FUNCTIONS (cohérent §2.6 + §2.2)
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION lucid_rc_count_active(p_user_id uuid)
RETURNS int LANGUAGE sql STABLE AS $$
  SELECT count(*)::int FROM lucid_reality_checks
  WHERE user_id = p_user_id AND active = true;
$$;

CREATE OR REPLACE FUNCTION lucid_wbtb_can_schedule(p_user_id uuid)
RETURNS boolean LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_count int;
  v_max int;
BEGIN
  SELECT COALESCE(MAX(this_week_count), 0) INTO v_count
    FROM lucid_wbtb_alarms WHERE user_id = p_user_id;
  SELECT COALESCE(wbtb_weekly_max, 4) INTO v_max
    FROM lucid_user_profile WHERE user_id = p_user_id;
  RETURN COALESCE(v_count, 0) < COALESCE(v_max, 4);
END;
$$;

-- Reset hebdo (à appeler par cron Supabase chaque lundi 00:00)
CREATE OR REPLACE FUNCTION lucid_wbtb_reset_weekly()
RETURNS void LANGUAGE sql AS $$
  UPDATE lucid_wbtb_alarms
    SET this_week_count = 0,
        week_resets_at = date_trunc('week', now()) + interval '14 days'
    WHERE week_resets_at < now();
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- §4 — RLS — owner-only, cohérent §2.10 + §13.3 global
-- ────────────────────────────────────────────────────────────────────────────

ALTER TABLE lucid_reality_check_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_rc_events_self ON lucid_reality_check_events;
CREATE POLICY lucid_rc_events_self ON lucid_reality_check_events
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_wbtb_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_wbtb_events_self ON lucid_wbtb_events;
CREATE POLICY lucid_wbtb_events_self ON lucid_wbtb_events
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_re_entry_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_re_entry_self ON lucid_re_entry_sessions;
CREATE POLICY lucid_re_entry_self ON lucid_re_entry_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_mild_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_mild_sessions_self ON lucid_mild_sessions;
CREATE POLICY lucid_mild_sessions_self ON lucid_mild_sessions
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_session_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_session_events_self ON lucid_session_events;
CREATE POLICY lucid_session_events_self ON lucid_session_events
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_practice_letters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_practice_letters_self ON lucid_practice_letters;
CREATE POLICY lucid_practice_letters_self ON lucid_practice_letters
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sécuriser aussi les 5 existantes (idempotent)
ALTER TABLE lucid_user_profile ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_user_profile_self ON lucid_user_profile;
CREATE POLICY lucid_user_profile_self ON lucid_user_profile
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_reality_checks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_rc_self ON lucid_reality_checks;
CREATE POLICY lucid_rc_self ON lucid_reality_checks
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_dream_signs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_dream_signs_self ON lucid_dream_signs;
CREATE POLICY lucid_dream_signs_self ON lucid_dream_signs
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_kairos_metadata ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_kairos_metadata_self ON lucid_kairos_metadata;
CREATE POLICY lucid_kairos_metadata_self ON lucid_kairos_metadata
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE lucid_wbtb_alarms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lucid_wbtb_alarms_self ON lucid_wbtb_alarms;
CREATE POLICY lucid_wbtb_alarms_self ON lucid_wbtb_alarms
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════════
-- FIN MIGRATION 20260428_lucid_subapp_v1_complete
-- ════════════════════════════════════════════════════════════════════════════
