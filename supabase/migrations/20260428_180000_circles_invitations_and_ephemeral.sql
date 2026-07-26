-- =============================================================================
-- MIGRATION : Circle invitations magiques + cercles éphémères 21j auto-clôture
-- File: 20260428_180000_circles_invitations_and_ephemeral.sql
-- Author: Yeshua — Sprint Cercle Niveau 3 (carte blanche)
-- Spec : cercle-subapp/2_CERCLE_DESIGN.md §5 (invitations) + §6 (éphémère 21j)
--        cercle-subapp/3_CERCLE_TECHNICAL.md (T1 + T2)
--
-- À appliquer via MCP apply_migration (Yeshua) une fois Tim valide.
-- circle_members.user_id est TEXT legacy → tous casts auth.uid()::text dans RLS.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- T1 — circle_invitations (lien magique partageable)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS circle_invitations (
  token            text PRIMARY KEY,                     -- urlsafe ~43 chars (32 bytes base64url)
  circle_id        uuid NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  created_by       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at       timestamptz NOT NULL DEFAULT now(),
  expires_at       timestamptz NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  uses_remaining   int NOT NULL DEFAULT 12,
  uses_total       int NOT NULL DEFAULT 0,
  revoked_at       timestamptz
);

CREATE INDEX IF NOT EXISTS circle_invitations_circle_idx
  ON circle_invitations(circle_id);
CREATE INDEX IF NOT EXISTS circle_invitations_active_idx
  ON circle_invitations(expires_at) WHERE revoked_at IS NULL;

ALTER TABLE circle_invitations ENABLE ROW LEVEL SECURITY;

-- Creator full access (read/update/revoke)
DROP POLICY IF EXISTS circle_inv_creator ON circle_invitations;
CREATE POLICY circle_inv_creator ON circle_invitations
  FOR ALL
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Public preview : SELECT autorisé pour anon/authenticated (pas de données sensibles
-- — uniquement métadonnées invitation. Le payload preview reste contrôlé côté API).
DROP POLICY IF EXISTS circle_inv_public_preview ON circle_invitations;
CREATE POLICY circle_inv_public_preview ON circle_invitations
  FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- T2 — circles.ephemeral_until + closed_at + closure_restitution_id
-- ─────────────────────────────────────────────────────────────────────────────

-- circle_restitutions doit exister AVANT le FK closure_restitution_id ;
-- on l'assume créée dans 20260425_130100_circles_v1_extended.sql.
ALTER TABLE circles
  ADD COLUMN IF NOT EXISTS ephemeral_until         timestamptz,
  ADD COLUMN IF NOT EXISTS closed_at               timestamptz,
  ADD COLUMN IF NOT EXISTS closure_restitution_id  uuid;

-- FK ajouté en 2 temps (évite échec si table circle_restitutions absente)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_name = 'circle_restitutions')
     AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                     WHERE constraint_name = 'circles_closure_restitution_fk') THEN
    ALTER TABLE circles
      ADD CONSTRAINT circles_closure_restitution_fk
      FOREIGN KEY (closure_restitution_id) REFERENCES circle_restitutions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Index pour scanner efficacement les cercles éphémères encore vivants
CREATE INDEX IF NOT EXISTS circles_ephemeral_active_idx
  ON circles(ephemeral_until)
  WHERE closed_at IS NULL AND ephemeral_until IS NOT NULL;

-- circle_restitutions : flag is_closure_restitution si pas déjà présent
ALTER TABLE circle_restitutions
  ADD COLUMN IF NOT EXISTS is_closure_restitution boolean NOT NULL DEFAULT false;

-- ─────────────────────────────────────────────────────────────────────────────
-- pending_proactive_messages : best-effort si la table existe (non bloquant).
-- Les notifications de clôture seront insérées par la cron route si dispo.
-- ─────────────────────────────────────────────────────────────────────────────
-- (pas de DDL ici — la cron lit/écrit best-effort selon présence table.)
