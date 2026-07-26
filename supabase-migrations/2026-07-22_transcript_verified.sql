-- 2026-07-22 : kairos.transcript_verified — le rêveur a relu/corrigé sa transcription voix
--
-- WHAT
-- Ajoute une colonne booléenne NULLABLE `transcript_verified` sur la table `kairos`.
--   - NULL / false → la transcription n'a pas (encore) été vérifiée par le rêveur.
--   - true          → le rêveur a passé la relecture Q/R et validé (§12ter.D, correction transcription AUTO).
--
-- WHY (§12ter.D — correction transcription AUTO)
-- Un rêve dicté au réveil, d'une voix pâteuse, est parfois mal transcrit. Sur la fiche
-- rêve (J3), une ligne discrète « Vérifier la transcription » lance une relecture par
-- l'IA (route /api/mvp/transcript-check) qui repère les passages sans sens et pose des
-- questions douces. Une fois le texte validé, on veut MÉMORISER que c'est fait — pour
-- ne plus reproposer la vérification sur ce rêve. Ce drapeau porte cette mémoire.
--
-- COMMENT ÇA S'ÉCRIT
-- Le composant TranscriptCheck valide via PATCH /api/kairos/[id] :
--     { raw_text?: <texte corrigé si changé>, transcript_verified: true }
-- ⚠️ WIRING RESTANT (une ligne, hors périmètre de cet agent) : ajouter
--    `transcript_verified` à la whitelist du PATCH dans src/app/api/kairos/[id]/route.ts :
--        if (typeof body.transcript_verified === 'boolean') allowed.transcript_verified = body.transcript_verified
--    Tant que ce n'est pas fait, le drapeau ne persiste pas (le raw_text corrigé, lui,
--    passe déjà par la whitelist existante). Le composant masque malgré tout la ligne
--    en local après validation, donc l'UX reste propre dès aujourd'hui.
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260722231010_kairos_transcript_verified`
--          (vérifiée 2026-07-26, flotte A5 — colonne présente, nullable boolean).
--          Entête corrigée : elle disait « NON appliquée », c'était faux.
--          Le point « WIRING RESTANT » ci-dessus reste à vérifier séparément (territoire A3,
--          non touché par cet agent).

ALTER TABLE kairos
  ADD COLUMN IF NOT EXISTS transcript_verified boolean;

COMMENT ON COLUMN kairos.transcript_verified IS
  'true = le rêveur a relu et validé la transcription voix via la relecture Q/R (§12ter.D). NULL/false = non vérifiée.';
