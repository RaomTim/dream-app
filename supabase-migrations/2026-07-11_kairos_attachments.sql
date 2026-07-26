-- 2026-07-11 : kairos_attachments — pièces jointes des kairos (photo scannée, etc.)
--
-- WHAT
-- Table d'attachements liés à un kairos. V1 : uniquement kind='photo' — la photo
-- d'origine d'une page de carnet scannée (écran A5 « Scanner », voir
-- DREAM-MVP-SPEC-ECRANS-A-Z.md §A5 : « la photo d'origine gardée en pièce jointe
-- du dépôt »).
--
-- WHY
-- /api/mvp/scan uploade la photo dans le bucket Storage `kairos-attachments`
-- (best-effort) AVANT que le kairos existe. Une fois le kairos créé (finalisation
-- côté client, /api/kairos POST), le storage_path est lié ici.
--
-- ⚠️ NON COUVERT PAR CETTE MIGRATION :
--   - Le bucket Storage `kairos-attachments` lui-même n'est PAS créé ici (une
--     migration SQL ne crée pas de bucket de façon fiable/portable). À créer
--     manuellement (dashboard Supabase → Storage → New bucket, PRIVÉ — cohérent
--     avec le RLS owner-only ci-dessous) avant tout déploiement de l'écran Scanner.
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260711011500_kairos_attachments_scan_photos`
--          (vérifiée 2026-07-26, flotte A5 — table kairos_attachments existe ; le CHECK
--          kind a depuis été étendu à 'audio' par 2026-07-22_kairos_audio.sql, elle aussi
--          appliquée). Entête corrigée : elle disait « NON appliquée », c'était faux.

CREATE TABLE IF NOT EXISTS kairos_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kairos_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'photo' CHECK (kind IN ('photo')),
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kairos_attachments_kairos_id ON kairos_attachments(kairos_id);

COMMENT ON TABLE kairos_attachments IS
'Pièces jointes d''un kairos (V1 : photo de page scannée — écran A5). Owner-only via jointure sur kairos.user_id.';

-- =============================================================================
-- RLS — owner-only (pattern : supabase/migrations/20260420_120000_enable_rls.sql)
-- =============================================================================

ALTER TABLE kairos_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "kairos_attachments_select_own"
  ON kairos_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM kairos
      WHERE kairos.id = kairos_attachments.kairos_id
        AND kairos.user_id = auth.uid()
    )
  );

CREATE POLICY "kairos_attachments_insert_own"
  ON kairos_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kairos
      WHERE kairos.id = kairos_attachments.kairos_id
        AND kairos.user_id = auth.uid()
    )
  );

CREATE POLICY "kairos_attachments_update_own"
  ON kairos_attachments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM kairos
      WHERE kairos.id = kairos_attachments.kairos_id
        AND kairos.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM kairos
      WHERE kairos.id = kairos_attachments.kairos_id
        AND kairos.user_id = auth.uid()
    )
  );

CREATE POLICY "kairos_attachments_delete_own"
  ON kairos_attachments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM kairos
      WHERE kairos.id = kairos_attachments.kairos_id
        AND kairos.user_id = auth.uid()
    )
  );

-- NB : /api/mvp/scan et /api/kairos (POST) utilisent le service role côté serveur
-- (createServerClient), qui bypass RLS. Le RLS ci-dessus protège tout accès
-- direct futur depuis le client (anon/authenticated key).
