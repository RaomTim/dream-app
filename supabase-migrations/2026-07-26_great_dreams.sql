-- ═══════════════════════════════════════════════════════════════════════
-- LES GRANDS RÊVES — taxonomie de marquage + consultation à double lecture
-- Agent A3, 2026-07-26.  Réf : TAXONOMIE-GRANDS-REVES.md
-- APPLIQUÉE en prod le 2026-07-26 (migration `great_dreams_taxonomy_a3`).
-- Copie de référence — ne pas rejouer à l'aveugle (idempotente malgré tout).
--
-- PRINCIPE : on ÉTEND le modèle existant. La marque « grand rêve » EST
-- `kairos.user_marked_numinous` (déjà en base, déjà lue partout). Aucun nouveau
-- booléen — deux colonnes pour la même vérité divergent toujours.
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE public.kairos
  ADD COLUMN IF NOT EXISTS marked_great_at    timestamptz,
  ADD COLUMN IF NOT EXISTS great_dream_facets text[] NOT NULL DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS great_dream_note   text;

ALTER TABLE public.kairos DROP CONSTRAINT IF EXISTS kairos_great_dream_facets_chk;
ALTER TABLE public.kairos ADD CONSTRAINT kairos_great_dream_facets_chk
  CHECK (great_dream_facets <@ ARRAY['change','force','ouvert']::text[]);
ALTER TABLE public.kairos DROP CONSTRAINT IF EXISTS kairos_great_dream_note_len_chk;
ALTER TABLE public.kairos ADD CONSTRAINT kairos_great_dream_note_len_chk
  CHECK (great_dream_note IS NULL OR char_length(great_dream_note) <= 600);

CREATE OR REPLACE FUNCTION public.kairos_track_marked_great()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.user_marked_numinous IS TRUE
     AND (OLD.user_marked_numinous IS DISTINCT FROM TRUE)
     AND NEW.marked_great_at IS NULL THEN
    NEW.marked_great_at := now();
  ELSIF NEW.user_marked_numinous IS NOT TRUE
        AND OLD.user_marked_numinous IS TRUE THEN
    NEW.marked_great_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_kairos_track_marked_great ON public.kairos;
CREATE TRIGGER trg_kairos_track_marked_great
  BEFORE UPDATE OF user_marked_numinous ON public.kairos
  FOR EACH ROW EXECUTE FUNCTION public.kairos_track_marked_great();

-- Backfill des lignes marquées avant le trigger. `updated_at` est une
-- APPROXIMATION assumée : la vraie date de marquage n'existait pas.
UPDATE public.kairos SET marked_great_at = COALESCE(updated_at, created_at)
 WHERE user_marked_numinous IS TRUE AND marked_great_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_kairos_great
  ON public.kairos (user_id, created_at DESC) WHERE user_marked_numinous IS TRUE;

CREATE TABLE IF NOT EXISTS public.great_dream_consultations (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  situation_text text NOT NULL,
  reading_great  jsonb NOT NULL DEFAULT '[]'::jsonb,
  reading_all    jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_gdc_user_created
  ON public.great_dream_consultations (user_id, created_at DESC);

ALTER TABLE public.great_dream_consultations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gdc_own_select ON public.great_dream_consultations;
CREATE POLICY gdc_own_select ON public.great_dream_consultations
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS gdc_own_insert ON public.great_dream_consultations;
CREATE POLICY gdc_own_insert ON public.great_dream_consultations
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS gdc_own_delete ON public.great_dream_consultations;
CREATE POLICY gdc_own_delete ON public.great_dream_consultations
  FOR DELETE TO authenticated USING (user_id = auth.uid());
-- RLS + GRANT ENSEMBLE : un GRANT manquant sous RLS fait échouer les lectures
-- EN SILENCE (cf. les 11 tables du schéma `community`, juillet 2026).
GRANT SELECT, INSERT, DELETE ON public.great_dream_consultations TO authenticated;

-- Rappel LARGE pour la consultation. Nom DISTINCT des RPC de résonance
-- réécrites par A2. N'utilise VOLONTAIREMENT PAS numinosity_score (52/64 à 0.00).
CREATE OR REPLACE FUNCTION public.find_great_dreams_for_situation(
  p_user_id uuid, p_embedding vector, p_scope text DEFAULT 'great',
  p_limit integer DEFAULT 12, p_min_sim double precision DEFAULT 0.05,
  p_exclude_great boolean DEFAULT false
)
RETURNS TABLE (
  id uuid, title text, raw_text text, kairos_type text, created_at timestamptz,
  marked_great_at timestamptz, user_marked_numinous boolean, great_dream_facets text[],
  great_dream_note text, numinosity_score double precision, similarity double precision
)
LANGUAGE sql STABLE AS $$
  SELECT k.id, k.title, k.raw_text, k.kairos_type, k.created_at, k.marked_great_at,
         k.user_marked_numinous, k.great_dream_facets, k.great_dream_note, k.numinosity_score,
         1 - (k.embedding_semantic <=> p_embedding) AS similarity
  FROM public.kairos k
  WHERE k.user_id = p_user_id
    AND k.embedding_semantic IS NOT NULL
    AND (p_scope <> 'great' OR k.user_marked_numinous IS TRUE)
    AND (NOT p_exclude_great OR k.user_marked_numinous IS NOT TRUE)
    AND (1 - (k.embedding_semantic <=> p_embedding)) >= p_min_sim
  ORDER BY k.embedding_semantic <=> p_embedding
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.find_great_dreams_for_situation(uuid, vector, text, integer, double precision, boolean)
  TO authenticated, service_role;
