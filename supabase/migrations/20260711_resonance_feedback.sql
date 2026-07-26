-- ============================================================================
-- resonance_feedback — mémoire du 1-clic « résonne / pas vraiment » sur les liens
-- de « CE QUI RÉSONNE » (DREAM-MVP-SPEC-ECRANS-A-Z §12bis.A).
--
-- Un verdict par (rêveur, kairos source, kairos relié). Les « dismissed » ne
-- remontent plus dans /api/kairos/[id]/resonance ni dans /api/mvp/echo-of-the-day.
-- Les « resonates » sont, en plus, réinjectés dans la détection perso par
-- /api/mvp/learn-deep (renforcement des symboles réellement communs — voir la route).
--
-- Migration NON appliquée automatiquement — à lancer par Tim (SQL MCP / dashboard).
-- Les routes dégradent en douceur tant que la table n'existe pas (try/catch).
--
-- Cohérent avec le durcissement RLS 2026-05-21 : RLS ON + policies propriétaire.
-- (Les routes serveur passent par la service_role qui bypass RLS ; les policies
--  sont là pour la cohérence et un éventuel accès client direct.)
--
-- Yeshua (Opus), 2026-07-11 — vague MAGIE.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.resonance_feedback (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_kairos_id  uuid NOT NULL REFERENCES public.kairos(id) ON DELETE CASCADE,
  other_kairos_id   uuid NOT NULL REFERENCES public.kairos(id) ON DELETE CASCADE,
  register          text,                       -- 'dream' | 'day' | 'prophetic' (indicatif)
  verdict           text NOT NULL CHECK (verdict IN ('resonates', 'dismissed')),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, source_kairos_id, other_kairos_id)
);

CREATE INDEX IF NOT EXISTS idx_resonance_feedback_source
  ON public.resonance_feedback (user_id, source_kairos_id);
CREATE INDEX IF NOT EXISTS idx_resonance_feedback_dismissed
  ON public.resonance_feedback (user_id, verdict) WHERE verdict = 'dismissed';

ALTER TABLE public.resonance_feedback ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'resonance_feedback' AND policyname = 'resonance_feedback_owner_all'
  ) THEN
    CREATE POLICY resonance_feedback_owner_all
      ON public.resonance_feedback
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

COMMENT ON TABLE public.resonance_feedback IS
  'Verdicts 1-clic « résonne / pas vraiment » sur les liens de résonance (§12bis.A). dismissed = ne plus remonter.';
