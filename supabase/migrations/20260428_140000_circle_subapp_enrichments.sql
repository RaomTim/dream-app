-- =============================================================================
-- MIGRATION : Cercle SubApp enrichments — C.5/C.6/C.7/C.8/C.9
-- File: 20260428_140000_circle_subapp_enrichments.sql
-- Author: Yeshua — Sprint Cercle profond
-- Spec : 2_DESIGN.md §11.bis.20.11 (Cercle avec IA gardienne)
-- À appliquer via MCP apply_migration. RLS owner/member-only.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- C.7 — Marquage "tale_marquant" sur kairos partagés (Annales)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_kairos_marks (
  circle_id   uuid NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  kairos_id   uuid NOT NULL,
  user_id     uuid NOT NULL,                                 -- membre qui marque
  marked_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (circle_id, kairos_id, user_id)
);
CREATE INDEX IF NOT EXISTS circle_kairos_marks_circle_idx
  ON circle_kairos_marks(circle_id, marked_at DESC);
CREATE INDEX IF NOT EXISTS circle_kairos_marks_kairos_idx
  ON circle_kairos_marks(kairos_id);

ALTER TABLE circle_kairos_marks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_kairos_marks_member_select ON circle_kairos_marks;
CREATE POLICY circle_kairos_marks_member_select ON circle_kairos_marks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_kairos_marks.circle_id
        AND cm.user_id   = auth.uid()::text
        AND cm.left_at   IS NULL
    )
  );

DROP POLICY IF EXISTS circle_kairos_marks_owner_write ON circle_kairos_marks;
CREATE POLICY circle_kairos_marks_owner_write ON circle_kairos_marks
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS circle_kairos_marks_owner_delete ON circle_kairos_marks;
CREATE POLICY circle_kairos_marks_owner_delete ON circle_kairos_marks
  FOR DELETE USING (user_id = auth.uid());


-- ─────────────────────────────────────────────────────────────────────────────
-- C.6 — Cache météo psychique (avoid recompute Haiku trop souvent)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_weather (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id     uuid NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  generated_at  timestamptz NOT NULL DEFAULT now(),
  window_days   integer NOT NULL DEFAULT 30,
  metrics       jsonb NOT NULL,         -- { contributors, deposit_count, dominant_motifs, dominant_root_patterns, water_count, threshold_count, ... }
  weather_text  text NOT NULL,          -- texte poétique généré par Haiku ~80-180 mots
  k_anon_ok     boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS circle_weather_circle_idx
  ON circle_weather(circle_id, generated_at DESC);

ALTER TABLE circle_weather ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_weather_member_select ON circle_weather;
CREATE POLICY circle_weather_member_select ON circle_weather
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_weather.circle_id
        AND cm.user_id   = auth.uid()::text
        AND cm.left_at   IS NULL
    )
  );
-- Pas de policy INSERT/UPDATE user-side : la route API utilise service_role.


-- ─────────────────────────────────────────────────────────────────────────────
-- C.8 — Rituels collectifs (Council / Theory U / Council 4 voix / Lightning Dreamwork groupe)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_rituals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id       uuid NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  proposed_by     uuid NOT NULL,                          -- user_id (auth.uid)
  ritual_type     text NOT NULL,                          -- 'council' | 'theory_u' | 'council_4_voix' | 'lightning_group'
  title           text,
  prompt_seed     text,                                   -- question / contexte / kairos visé
  target_kairos_id uuid,                                  -- optionnel (council_4_voix, lightning_group)
  current_phase   text NOT NULL DEFAULT 'open',           -- 'open' | 'phase_1'..'phase_4' | 'closed' | 'archived'
  scheduled_at    timestamptz,                            -- date/heure démarrage proposée
  window_hours    integer NOT NULL DEFAULT 48,            -- async window
  started_at      timestamptz,
  closed_at       timestamptz,
  metadata        jsonb,                                  -- extra : phase definitions etc.
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS circle_rituals_circle_idx
  ON circle_rituals(circle_id, created_at DESC);
CREATE INDEX IF NOT EXISTS circle_rituals_phase_idx
  ON circle_rituals(circle_id, current_phase);

ALTER TABLE circle_rituals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_rituals_member_select ON circle_rituals;
CREATE POLICY circle_rituals_member_select ON circle_rituals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_rituals.circle_id
        AND cm.user_id   = auth.uid()::text
        AND cm.left_at   IS NULL
    )
  );

DROP POLICY IF EXISTS circle_rituals_member_insert ON circle_rituals;
CREATE POLICY circle_rituals_member_insert ON circle_rituals
  FOR INSERT WITH CHECK (
    proposed_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_rituals.circle_id
        AND cm.user_id   = auth.uid()::text
        AND cm.left_at   IS NULL
    )
  );

DROP POLICY IF EXISTS circle_rituals_member_update ON circle_rituals;
CREATE POLICY circle_rituals_member_update ON circle_rituals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_rituals.circle_id
        AND cm.user_id   = auth.uid()::text
        AND cm.left_at   IS NULL
    )
  );


-- Participants : qui a joint un rituel (intent, not enforcement)
CREATE TABLE IF NOT EXISTS circle_ritual_participants (
  ritual_id   uuid NOT NULL REFERENCES circle_rituals(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  joined_at   timestamptz NOT NULL DEFAULT now(),
  status      text NOT NULL DEFAULT 'joined',  -- 'joined' | 'completed' | 'left'
  PRIMARY KEY (ritual_id, user_id)
);

ALTER TABLE circle_ritual_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_ritual_participants_member_select ON circle_ritual_participants;
CREATE POLICY circle_ritual_participants_member_select ON circle_ritual_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM circle_rituals cr
      JOIN circle_members cm ON cm.circle_id = cr.circle_id
      WHERE cr.id = circle_ritual_participants.ritual_id
        AND cm.user_id = auth.uid()::text
        AND cm.left_at IS NULL
    )
  );

DROP POLICY IF EXISTS circle_ritual_participants_self_insert ON circle_ritual_participants;
CREATE POLICY circle_ritual_participants_self_insert ON circle_ritual_participants
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS circle_ritual_participants_self_update ON circle_ritual_participants;
CREATE POLICY circle_ritual_participants_self_update ON circle_ritual_participants
  FOR UPDATE USING (user_id = auth.uid());


-- Contributions : ce qu'un participant écrit/dépose dans une phase du rituel
CREATE TABLE IF NOT EXISTS circle_ritual_contributions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ritual_id       uuid NOT NULL REFERENCES circle_rituals(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL,
  phase           text NOT NULL,                -- 'open'|'phase_1'..'phase_4'
  voice_attribution text,                       -- pour council_4_voix : 'dreamer' | 'protector' | 'soul' | 'shadow' (Aizenstat)
  content         text NOT NULL,
  matter          text,                          -- 'paper'|'stone'|'silk' optional
  is_voice        boolean DEFAULT false,
  voice_duration_ms integer,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS circle_ritual_contributions_ritual_idx
  ON circle_ritual_contributions(ritual_id, created_at);

ALTER TABLE circle_ritual_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS circle_ritual_contrib_member_select ON circle_ritual_contributions;
CREATE POLICY circle_ritual_contrib_member_select ON circle_ritual_contributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM circle_rituals cr
      JOIN circle_members cm ON cm.circle_id = cr.circle_id
      WHERE cr.id = circle_ritual_contributions.ritual_id
        AND cm.user_id = auth.uid()::text
        AND cm.left_at IS NULL
    )
  );

DROP POLICY IF EXISTS circle_ritual_contrib_self_insert ON circle_ritual_contributions;
CREATE POLICY circle_ritual_contrib_self_insert ON circle_ritual_contributions
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS circle_ritual_contrib_self_delete ON circle_ritual_contributions;
CREATE POLICY circle_ritual_contrib_self_delete ON circle_ritual_contributions
  FOR DELETE USING (user_id = auth.uid());


-- ─────────────────────────────────────────────────────────────────────────────
-- C.9 — Voice messages dans le chat cercle
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE circle_chat_messages
  ADD COLUMN IF NOT EXISTS is_voice boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS voice_duration_ms integer,
  ADD COLUMN IF NOT EXISTS voice_transcript_lang text;
