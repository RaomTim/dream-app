-- 2026-07-11 : kairos_interpretations — l'interprétation Dream GARDÉE + la boucle d'apprentissage
-- (DREAM-MVP-SPEC-ECRANS-A-Z.md §C1bis, dicté par Tim — cœur du moat)
--
-- WHAT
-- Une interprétation Dream que le rêveur a choisi de garder. Porte :
--   - body : le texte de l'interprétation. Généré/streamé par /api/mvp/interpret,
--     il ne vivait jusqu'ici QUE dans le state React de InterpretScreen (il
--     disparaissait à la fermeture de l'écran). On le fige ici au moment de la garde.
--   - status : 'kept' (gardé, « ça me parle » ou signet) — 'proposed' réservé à un
--     éventuel brouillon serveur (non utilisé par le flux C1bis actuel qui garde direct).
--   - resonance_note / resonance_audio_path : « qu'est-ce qui résonne pour toi ? »
--     (§C1bis) — une phrase, voix et/ou texte, skippable. L'audio est GARDÉ
--     (bucket kairos-attachments), la transcription (si dispo) sert l'apprentissage.
--   - corrections : historique des corrections (« Corriger » sur Moyen / Pas vraiment).
--     Chaque entrée jsonb = { at, user_correction, revised_body }.
--
-- WHY
-- Aujourd'hui l'interprétation n'est stockée NULLE PART. Le moat de l'app —
-- l'interprétation gardée, relue sur la fiche du rêve (J3), corrigée à vie, et qui
-- enseigne le langage symbolique personnel — a besoin d'une table durable.
--
-- ⚠️ NON COUVERT PAR CETTE MIGRATION :
--   - Le bucket Storage `kairos-attachments` (déjà requis par l'écran A5 Scanner)
--     doit exister et être PRIVÉ. `resonance_audio_path` y pointe. Les routes
--     signent l'URL de lecture côté serveur (service role). Si le bucket manque,
--     l'upload audio échoue en best-effort (la note texte et l'apprentissage
--     restent fonctionnels).
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260711014559_kept_interpretations`
-- (vérifiée 2026-07-26, flotte A5 — table kairos_interpretations existe).
-- Entête corrigée : elle disait « NON appliquée », c'était faux.

CREATE TABLE IF NOT EXISTS kairos_interpretations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kairos_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'kept' CHECK (status IN ('proposed', 'kept')),
  resonance_note text,
  resonance_audio_path text,
  corrections jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  kept_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_kairos_interpretations_kairos
  ON kairos_interpretations (kairos_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kairos_interpretations_user_kept
  ON kairos_interpretations (user_id, kept_at DESC);

COMMENT ON TABLE kairos_interpretations IS
'Interprétations Dream gardées + boucle d''apprentissage (§C1bis, cœur du moat). Owner-only via user_id dénormalisé.';

-- =============================================================================
-- RLS — owner-only
-- (pattern : supabase-migrations/2026-07-11_kairos_attachments.sql ; ici user_id
--  est dénormalisé sur la table → check direct user_id = auth.uid(), pas de jointure)
-- =============================================================================

ALTER TABLE kairos_interpretations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kairos_interpretations_select_own"
  ON kairos_interpretations FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "kairos_interpretations_insert_own"
  ON kairos_interpretations FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "kairos_interpretations_update_own"
  ON kairos_interpretations FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "kairos_interpretations_delete_own"
  ON kairos_interpretations FOR DELETE
  USING (user_id = auth.uid());

-- NB : les routes /api/mvp/interpretations* et /api/mvp/interpret-correct utilisent
-- le service role côté serveur (createServerClient), qui bypass RLS. Le RLS ci-dessus
-- protège tout accès direct futur depuis le client (anon/authenticated key).
