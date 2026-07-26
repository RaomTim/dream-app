-- =============================================================================
-- MIGRATION: Soul Seasons V1 (pré-câblé, pas d'UI V2 noté)
-- File: 20260425_120000_soul_seasons.sql
-- Author: Yeshua — QW3 backend Dream App refonte 2026-04-25
-- =============================================================================
--
-- WHAT
-- Schema pré-câblé pour les "saisons d'âme" (Initiatic Threshold V2).
-- Un user marque ou laisse le système détecter des saisons : phases initiatiques
-- de plusieurs semaines/mois, regroupant N kairos sous une signature archetypale.
--
-- WHY
-- Permet plus tard (V2) de :
--   - relire les kairos d'une saison comme un arc narratif
--   - détecter automatiquement les seuils (centroid drift sur embedding_archetypal)
--   - exposer la temporalité longue dans Lifeline
--
-- USAGE V1
-- Pas d'UI. Schema + RLS surgical + colonne soul_season_id sur kairos.
-- =============================================================================

CREATE TABLE IF NOT EXISTS soul_seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text,
  description text,
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  threshold_marker_kairos_id uuid, -- FK ajoutée plus tard via ALTER (kairos pas encore créée)
  archetypal_signature_centroid vector(768),
  detection_metadata jsonb DEFAULT '{}'::jsonb,
  user_marked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_soul_seasons_user
  ON soul_seasons(user_id);

CREATE INDEX IF NOT EXISTS idx_soul_seasons_user_dates
  ON soul_seasons(user_id, start_date DESC, end_date DESC);

-- RLS surgical : user lit/écrit uniquement ses propres saisons
ALTER TABLE soul_seasons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "soul_seasons_select_own" ON soul_seasons;
CREATE POLICY "soul_seasons_select_own"
  ON soul_seasons FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "soul_seasons_insert_own" ON soul_seasons;
CREATE POLICY "soul_seasons_insert_own"
  ON soul_seasons FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "soul_seasons_update_own" ON soul_seasons;
CREATE POLICY "soul_seasons_update_own"
  ON soul_seasons FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "soul_seasons_delete_own" ON soul_seasons;
CREATE POLICY "soul_seasons_delete_own"
  ON soul_seasons FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE soul_seasons IS
  'Saisons d''âme V1 (pré-câblé) — phases initiatiques regroupant des kairos. UI V2.';
