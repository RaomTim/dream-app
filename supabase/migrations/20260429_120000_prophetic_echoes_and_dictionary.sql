-- =============================================================================
-- MIGRATION: Prophetic echoes (life→kairos similarity) + Personal Dictionary
-- File: 20260429_120000_prophetic_echoes_and_dictionary.sql
-- Author: Yeshua — 2026-04-29 (moats philosophique + épistémique)
-- =============================================================================
--
-- WHAT
-- 1. Garantit que life_journal_entries.embedding_semantic existe (déjà §47.1
--    mais on ALTER IF NOT EXISTS pour les bases qui auraient skippé).
-- 2. RPC `match_kairos_for_life_echo(query_embedding, target_user, before_date,
--    match_count, min_similarity)` — récupère les kairos passés du même user
--    avec cosine similarity sur embedding_semantic, *strictement antérieurs*
--    à before_date (pour qualifier de prophétique).
-- 3. Table `personal_dictionary_symbols` — agrégat vivant des symboles
--    personnels (motif/figure/lieu/sensation/synchronicite) reconstruit
--    depuis kairos par job batch quotidien.
--
-- WHY
-- - Feature 1 (moat philosophique) : détection automatique d'échos
--   prophétiques. Quand une note de jour résonne avec un rêve passé > 7j,
--   on propose au user de voir le miroir, JAMAIS de l'affirmer.
-- - Feature 2 (moat épistémique) : un dictionnaire qui ne cesse de
--   s'enrichir des symboles propres au rêveur, sortis de SES kairos,
--   pas d'un compendium universel.
--
-- =============================================================================

-- ── 1. life_journal_entries embedding (filet de sécurité) ────────────────────
ALTER TABLE life_journal_entries
  ADD COLUMN IF NOT EXISTS embedding_semantic vector(1536);

CREATE INDEX IF NOT EXISTS idx_lje_emb_sem_hnsw_v2
  ON life_journal_entries USING hnsw (embedding_semantic vector_cosine_ops);

-- ── 2. RPC match_kairos_for_life_echo ────────────────────────────────────────
CREATE OR REPLACE FUNCTION match_kairos_for_life_echo(
  query_embedding vector(1536),
  target_user uuid,
  before_date timestamptz,
  match_count int DEFAULT 5,
  min_similarity float DEFAULT 0.85
)
RETURNS TABLE (
  id uuid,
  raw_text text,
  kairos_type text,
  created_at timestamptz,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.id,
    k.raw_text,
    k.kairos_type,
    k.created_at,
    1 - (k.embedding_semantic <=> query_embedding) AS similarity
  FROM kairos k
  WHERE k.user_id = target_user
    AND k.embedding_semantic IS NOT NULL
    AND k.created_at < before_date
    AND (1 - (k.embedding_semantic <=> query_embedding)) >= min_similarity
  ORDER BY k.embedding_semantic <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

GRANT EXECUTE ON FUNCTION match_kairos_for_life_echo TO authenticated, service_role;

COMMENT ON FUNCTION match_kairos_for_life_echo IS
  'Detect prophetic echoes : pour une note de jour (vector embedding), retourne les kairos passés du même user > before_date avec cosine similarity >= min_similarity. Utilisé par /api/dream-chat/prophetic/detect.';

-- ── 3. Table personal_dictionary_symbols ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS personal_dictionary_symbols (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  symbol_text text NOT NULL,
  symbol_kind text NOT NULL CHECK (symbol_kind IN (
    'motif', 'figure', 'lieu', 'sensation', 'synchronicite'
  )),

  -- Comptage et fenêtre temporelle
  first_seen_at timestamptz NOT NULL,
  last_seen_at  timestamptz NOT NULL,
  count_total   int NOT NULL DEFAULT 1,

  -- Affect agrégé
  valence_avg real,                                  -- moyenne sur kairos.affective_valence (-1..+1)

  -- Cooccurrences
  associated_figures text[] NOT NULL DEFAULT ARRAY[]::text[],

  -- Synthèse temporelle (« était sombre, devient porteur »)
  evolution_summary text,

  -- 3 angles Anima cachés (Sonnet ~300 mots, cache 30j)
  paper_angle text,
  stone_angle text,
  silk_angle  text,
  paragraph_cached_at         timestamptz,
  paragraph_cache_valid_until timestamptz,

  -- Soft-delete user (n'efface pas les kairos liés)
  archived_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, symbol_text, symbol_kind)
);

CREATE INDEX IF NOT EXISTS idx_pds_user_last_seen
  ON personal_dictionary_symbols (user_id, last_seen_at DESC)
  WHERE archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_pds_user_count
  ON personal_dictionary_symbols (user_id, count_total DESC)
  WHERE archived_at IS NULL;

-- Trigger updated_at
CREATE OR REPLACE FUNCTION pds_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pds_updated_at ON personal_dictionary_symbols;
CREATE TRIGGER trg_pds_updated_at
  BEFORE UPDATE ON personal_dictionary_symbols
  FOR EACH ROW EXECUTE FUNCTION pds_set_updated_at();

-- RLS owner-only
ALTER TABLE personal_dictionary_symbols ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pds_select_own" ON personal_dictionary_symbols;
CREATE POLICY "pds_select_own" ON personal_dictionary_symbols
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "pds_insert_own" ON personal_dictionary_symbols;
CREATE POLICY "pds_insert_own" ON personal_dictionary_symbols
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "pds_update_own" ON personal_dictionary_symbols;
CREATE POLICY "pds_update_own" ON personal_dictionary_symbols
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "pds_delete_own" ON personal_dictionary_symbols;
CREATE POLICY "pds_delete_own" ON personal_dictionary_symbols
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE personal_dictionary_symbols IS
  'Dictionnaire vivant des symboles personnels (re-aggregé depuis kairos par job batch quotidien). Moat épistémique Dream App 2026-04-29.';
