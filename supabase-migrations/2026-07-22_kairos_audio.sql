-- 2026-07-22 : kairos_attachments — ouvrir kind='audio' (audio persistant du rêve)
--
-- WHAT
-- Étend le CHECK de kairos_attachments.kind de ('photo') à ('photo','audio').
-- Permet de garder l'audio d'origine d'un rêve (mémo vocal du dépôt) en pièce jointe,
-- au même titre que la photo d'une page de carnet scannée.
--
-- WHY (§12ter.D — AUDIO PERSISTANT + EXPORT)
-- Aujourd'hui le blob vocal du dépôt est jeté après transcription. On veut le conserver :
--   - /api/kairos/[id]/audio POST  → upload du blob dans le bucket privé `kairos-attachments`
--     + insert d'une ligne kind='audio' (appelé best-effort par le flux de capture, après
--       création du kairos).
--   - /api/kairos/[id]/audio GET   → URL signée pour rejouer l'audio sur la fiche rêve (J3).
--
-- Le bucket Storage `kairos-attachments` (privé) et la table kairos_attachments
-- existent déjà (migration 2026-07-11). Cette migration ne touche QUE la contrainte kind.
-- Les policies RLS owner-only (SELECT/INSERT/UPDATE/DELETE via jointure kairos.user_id)
-- restent inchangées et couvrent déjà le nouveau kind.
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260722180344_kairos_attachments_kind_audio`
--          (vérifiée 2026-07-26, flotte A5 — le CHECK inclut bien 'audio').
--          Entête corrigée : elle disait « NON appliquée », c'était faux.

ALTER TABLE kairos_attachments DROP CONSTRAINT IF EXISTS kairos_attachments_kind_check;
ALTER TABLE kairos_attachments
  ADD CONSTRAINT kairos_attachments_kind_check CHECK (kind IN ('photo', 'audio'));

COMMENT ON COLUMN kairos_attachments.kind IS
  'Type de pièce jointe : ''photo'' (page de carnet scannée, §A5) · ''audio'' (mémo vocal du rêve, §12ter.D).';
