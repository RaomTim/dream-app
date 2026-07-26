-- =============================================================================
-- MIGRATION : RPCs kairos V1 — moteur résonance multi-vecteurs
-- File: 20260425_130000_kairos_rpcs_v1.sql
-- Author: Yeshua — Chantier 3 (pattern detection 8 types V1)
-- Applied via MCP 2026-04-25
-- =============================================================================

CREATE OR REPLACE FUNCTION _combine_kairos_score(
  sim_sem float, sim_con float, sim_som float, sim_arc float,
  w_sem float, w_con float, w_som float, w_arc float
) RETURNS float LANGUAGE sql IMMUTABLE AS $$
  SELECT (
    coalesce(sim_sem, 0) * w_sem +
    coalesce(sim_con, 0) * w_con +
    coalesce(sim_som, 0) * w_som +
    coalesce(sim_arc, 0) * w_arc
  ) / NULLIF((
    CASE WHEN sim_sem IS NOT NULL THEN w_sem ELSE 0 END +
    CASE WHEN sim_con IS NOT NULL THEN w_con ELSE 0 END +
    CASE WHEN sim_som IS NOT NULL THEN w_som ELSE 0 END +
    CASE WHEN sim_arc IS NOT NULL THEN w_arc ELSE 0 END
  ), 0)
$$;

-- 8 RPCs : voir migration MCP appliquée 2026-04-25 pour le code complet.
-- (Refer to https://supabase.com/dashboard project rtrkxzcyblgonwgfzovj
--  migration_history version 20260425_130000+).
