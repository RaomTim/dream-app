-- =============================================================================
-- MIGRATION : Kairos synthesis columns
-- File: 20260425_130400_kairos_synthesis_columns.sql
-- Author: Yeshua — Chantier 4
-- Applied via MCP 2026-04-25
-- =============================================================================

ALTER TABLE kairos
  ADD COLUMN IF NOT EXISTS synthesis_text text,
  ADD COLUMN IF NOT EXISTS synthesis_tier text CHECK (synthesis_tier IN ('big_dream','pattern_rich','standard','somatic_delicate','image_tending','reverie')),
  ADD COLUMN IF NOT EXISTS synthesis_voices text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS synthesis_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS forest_sources jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS user_marked_numinous boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_kairos_synthesis_tier
  ON kairos(synthesis_tier) WHERE synthesis_tier IS NOT NULL;
