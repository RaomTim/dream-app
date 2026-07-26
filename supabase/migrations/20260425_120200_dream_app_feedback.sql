-- =============================================================================
-- MIGRATION: dream_app_feedback (FeedbackButton omniprésent)
-- File: 20260425_120200_dream_app_feedback.sql
-- Author: Yeshua — QW1 backend Dream App refonte 2026-04-25
-- =============================================================================
--
-- WHAT
-- Table de feedback utilisateur omniprésent dans l'app. Bouton discret
-- 30px en bas de chaque écran. Modal 3-step : context (auto-détecté) +
-- severity (low/medium/high) + texte libre. user_email nullable (anonyme OK).
-- Severity high → carte SOS/3114 visible dans l'UI.
--
-- WHY
-- Tim "superbe" — capture-flux user feedback au plus près du moment.
-- Source de vérité pour itération produit.
--
-- =============================================================================

CREATE TABLE IF NOT EXISTS dream_app_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,                             -- nullable : permet feedback anon
  context_type text NOT NULL,               -- 'screen', 'feature', 'oracle', 'capture', etc.
  context_id text,                          -- e.g. 'JournalScreen', 'kairos:<uuid>'
  feedback_text text NOT NULL,
  severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high')),
  user_email text,                          -- nullable : si user veut être recontacté
  user_agent text,                          -- captured server-side optional
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user
  ON dream_app_feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_severity_created
  ON dream_app_feedback(severity, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_context
  ON dream_app_feedback(context_type, context_id);

-- RLS surgical : user lit/écrit ses propres feedbacks uniquement
-- (Tim/admin lira via service_role pour dashboard interne)
ALTER TABLE dream_app_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "feedback_select_own" ON dream_app_feedback;
CREATE POLICY "feedback_select_own"
  ON dream_app_feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "feedback_insert_own" ON dream_app_feedback;
CREATE POLICY "feedback_insert_own"
  ON dream_app_feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Pas d'UPDATE/DELETE user-side : un feedback est immutable une fois envoyé.

COMMENT ON TABLE dream_app_feedback IS
  'Feedback omnipresent FeedbackButton. severity high -> carte SOS/3114. Service_role pour read admin.';
