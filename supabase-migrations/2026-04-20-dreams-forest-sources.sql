-- 2026-04-20 : colonne dreams.forest_sources
--
-- Traçabilité des chunks Forêt utilisés par Sonnet lors de extract-deep.
-- Permet à l'UX de montrer "cette analyse s'est appuyée sur : Hillman p.42,
-- von Franz p.87..." et à l'opérateur de vérifier qu'aucune hallucination
-- ne traîne.

ALTER TABLE dreams ADD COLUMN IF NOT EXISTS forest_sources jsonb;
COMMENT ON COLUMN dreams.forest_sources IS
'Traçabilité : liste des chunks Forêt cités dans l''analyse Sonnet (book_id, title, author, pages, similarity).';
