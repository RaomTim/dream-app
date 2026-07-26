-- Migration: add collective_optin to dreams table
-- Date: 2026-04-20
-- Context: Privacy fix for /api/dreams/collective (P0 breach).
--   The collective endpoint now filters on collective_optin = true.
--   Default is false (fail-closed) — no dream is included in collective
--   analysis until the user explicitly opts in.
--
-- After deploying this migration, expose a UI toggle (e.g. in settings or
-- DreamDetail) that sets collective_optin = true for the current user's dreams,
-- or per-dream. Only then will the collective screen show data.
--
-- DO NOT apply this migration without also wiring up the opt-in UI.

ALTER TABLE dreams
  ADD COLUMN IF NOT EXISTS collective_optin BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for fast filtering on the collective endpoint
CREATE INDEX IF NOT EXISTS idx_dreams_collective_optin
  ON dreams (collective_optin)
  WHERE collective_optin = TRUE;

COMMENT ON COLUMN dreams.collective_optin IS
  'User opt-in for collective/anonymous dream analysis. Default false. Must be set explicitly via UI. Never expose soul_wish or raw personal content regardless of this flag.';
