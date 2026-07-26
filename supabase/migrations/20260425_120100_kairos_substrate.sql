-- =============================================================================
-- MIGRATION: Kairos substrate (4 vecteurs spécialisés + scalars 16D + edges)
-- File: 20260425_120100_kairos_substrate.sql
-- Author: Yeshua — QW4 backend Dream App refonte 2026-04-25
-- =============================================================================
--
-- WHAT
-- Substrate principal de la nouvelle Dream App. Remplace la table `dreams`
-- comme source de vérité pour les "saisies d'instant" (rêves + sidewalk +
-- rêveries + hypnagogies + synchronicités + frissons + notes du jour).
--
-- WHY
-- 1. user_id en UUID (pas text comme legacy dreams) — propre dès le départ
-- 2. 4 vecteurs spécialisés :
--    - embedding_semantic (1536d)   : texte natif (text-embedding-3-small)
--    - embedding_concept   (1536d)  : LLM-extracted concepts → embed
--    - embedding_somatic   (768d)   : marqueurs corporels → embed
--    - embedding_archetypal (768d)  : tags archétypaux → embed
-- 3. 16 scalars enrichis (numinosity, valence, intensité, figures, motifs,
--    somatic, archetypal, temporal, setting, narrative, sensoriel, seuils,
--    parole/silence, pouvoir, paradoxes, métaphores)
-- 4. dream_ask + root_dream_patterns (Moss Ondinnonk + Forêt absorbée)
-- 5. Statuts révisables (numinosity_pending, prophetic_status)
-- 6. Lien optionnel vers soul_seasons (V2)
--
-- D1 TIM 2026-04-25 : Migration totale dreams → kairos.
-- Tim a OK pour recommencer (13 rêves perso, aucune perte).
-- → On crée kairos vierge. dreams reste en lecture pour archive.
--
-- =============================================================================

-- =============================================================================
-- TABLE: kairos
-- =============================================================================

CREATE TABLE IF NOT EXISTS kairos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,

  -- Contenu
  raw_text text NOT NULL,
  raw_text_lang text,                 -- 'fr', 'en', etc.
  capture_method text,                -- 'voice', 'text'
  kairos_type text,                   -- 'reve', 'sidewalk', 'reverie', 'hypnagogie', 'synchronicite', 'frisson', 'note_jour'

  -- 4 vecteurs spécialisés
  embedding_semantic    vector(1536), -- texte natif
  embedding_concept     vector(1536), -- concepts LLM-extracted → embed
  embedding_somatic     vector(768),  -- somatic_markers → embed
  embedding_archetypal  vector(768),  -- archetypes → embed

  -- Scalars enrichis (16 dimensions)
  numinosity_score      float NOT NULL DEFAULT 0,
  affective_valence     float NOT NULL DEFAULT 0,
  affective_intensity   float NOT NULL DEFAULT 0,
  dominant_emotion      text,
  figures               jsonb NOT NULL DEFAULT '{}'::jsonb,
  motif_tags            text[] NOT NULL DEFAULT ARRAY[]::text[],
  somatic_markers       jsonb NOT NULL DEFAULT '{}'::jsonb,
  archetypal_tags       text[] NOT NULL DEFAULT ARRAY[]::text[],
  temporal_signature    jsonb NOT NULL DEFAULT '{}'::jsonb,
  setting_metadata      jsonb NOT NULL DEFAULT '{}'::jsonb,
  narrative_dynamics    jsonb NOT NULL DEFAULT '{}'::jsonb,
  sensorial_qualities   jsonb NOT NULL DEFAULT '{}'::jsonb,
  thresholds_passages   jsonb NOT NULL DEFAULT '{}'::jsonb,
  parole_silence        jsonb NOT NULL DEFAULT '{}'::jsonb,
  power_relations       jsonb NOT NULL DEFAULT '{}'::jsonb,
  paradoxes_unresolved  jsonb NOT NULL DEFAULT '{}'::jsonb,
  metaphors_extrapolated jsonb NOT NULL DEFAULT '{}'::jsonb,
  dream_ask             text,                                            -- Moss Ondinnonk
  root_dream_patterns   text[] NOT NULL DEFAULT ARRAY[]::text[],

  -- Statuts (révisables rétroactivement)
  prophetic_status text NOT NULL DEFAULT 'dormant',
  numinosity_pending boolean NOT NULL DEFAULT true,
  user_first_reading_submitted boolean NOT NULL DEFAULT false,

  -- Soul season link (V2)
  soul_season_id uuid REFERENCES soul_seasons(id) ON DELETE SET NULL,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Maintenant on peut ajouter la FK depuis soul_seasons.threshold_marker_kairos_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'soul_seasons_threshold_marker_kairos_fk'
  ) THEN
    ALTER TABLE soul_seasons
      ADD CONSTRAINT soul_seasons_threshold_marker_kairos_fk
      FOREIGN KEY (threshold_marker_kairos_id)
      REFERENCES kairos(id) ON DELETE SET NULL;
  END IF;
END$$;

-- Indexes scalaires
CREATE INDEX IF NOT EXISTS idx_kairos_user
  ON kairos(user_id);

CREATE INDEX IF NOT EXISTS idx_kairos_user_created
  ON kairos(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kairos_user_kairos_type
  ON kairos(user_id, kairos_type);

CREATE INDEX IF NOT EXISTS idx_kairos_user_season
  ON kairos(user_id, soul_season_id);

CREATE INDEX IF NOT EXISTS idx_kairos_prophetic_status
  ON kairos(user_id, prophetic_status)
  WHERE prophetic_status <> 'dormant';

-- Indexes vectoriels HNSW (cosine distance)
CREATE INDEX IF NOT EXISTS idx_kairos_emb_semantic_hnsw
  ON kairos USING hnsw (embedding_semantic vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_kairos_emb_concept_hnsw
  ON kairos USING hnsw (embedding_concept vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_kairos_emb_somatic_hnsw
  ON kairos USING hnsw (embedding_somatic vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_kairos_emb_archetypal_hnsw
  ON kairos USING hnsw (embedding_archetypal vector_cosine_ops);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION kairos_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_kairos_updated_at ON kairos;
CREATE TRIGGER trg_kairos_updated_at
  BEFORE UPDATE ON kairos
  FOR EACH ROW EXECUTE FUNCTION kairos_set_updated_at();

-- RLS surgical
ALTER TABLE kairos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kairos_select_own" ON kairos;
CREATE POLICY "kairos_select_own"
  ON kairos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "kairos_insert_own" ON kairos;
CREATE POLICY "kairos_insert_own"
  ON kairos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "kairos_update_own" ON kairos;
CREATE POLICY "kairos_update_own"
  ON kairos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "kairos_delete_own" ON kairos;
CREATE POLICY "kairos_delete_own"
  ON kairos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE kairos IS
  'Substrate principal Dream App (refonte 2026-04-25). Remplace dreams. user_id uuid + 4 vecteurs + 16 scalars + statuts revisables.';


-- =============================================================================
-- TABLE: kairos_edges (graph layer)
-- =============================================================================

CREATE TABLE IF NOT EXISTS kairos_edges (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  kairos_a_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  kairos_b_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  edge_type text NOT NULL CHECK (edge_type IN (
    'resonance_directe',
    'resonance_metaphorique',
    'resonance_somatique',
    'resonance_archetypale',
    'inverse_mirror',
    'cycle_step',
    'echo_prophetique',
    'co_occurrence_constellation',
    'symbolic_resonance_lateral',
    'numinous_signal',
    'transformation_marker',
    'cross_lingual_resonance',
    'compagnon_constellation',
    'tradition_specific_match',
    'figure_evolution',
    'image_monde_link'
  )),
  edge_weight float NOT NULL CHECK (edge_weight >= 0 AND edge_weight <= 1),
  detection_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT kairos_edges_distinct_endpoints CHECK (kairos_a_id <> kairos_b_id)
);

CREATE INDEX IF NOT EXISTS idx_kairos_edges_a   ON kairos_edges(kairos_a_id);
CREATE INDEX IF NOT EXISTS idx_kairos_edges_b   ON kairos_edges(kairos_b_id);
CREATE INDEX IF NOT EXISTS idx_kairos_edges_user ON kairos_edges(user_id);
CREATE INDEX IF NOT EXISTS idx_kairos_edges_type ON kairos_edges(edge_type);
CREATE INDEX IF NOT EXISTS idx_kairos_edges_user_type ON kairos_edges(user_id, edge_type);

ALTER TABLE kairos_edges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kairos_edges_select_own" ON kairos_edges;
CREATE POLICY "kairos_edges_select_own"
  ON kairos_edges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "kairos_edges_insert_own" ON kairos_edges;
CREATE POLICY "kairos_edges_insert_own"
  ON kairos_edges FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "kairos_edges_update_own" ON kairos_edges;
CREATE POLICY "kairos_edges_update_own"
  ON kairos_edges FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "kairos_edges_delete_own" ON kairos_edges;
CREATE POLICY "kairos_edges_delete_own"
  ON kairos_edges FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

COMMENT ON TABLE kairos_edges IS
  'Graph layer kairos. 16 edge_types couvrant resonances, cycles, prophetie, transformation, cross-lingual, etc.';

-- =============================================================================
-- END
-- =============================================================================
