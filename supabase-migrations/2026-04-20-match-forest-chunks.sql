-- 2026-04-20 : RPC match_forest_chunks (v3)
--
-- Branche Dream App sur les ~61 000 chunks embeddings de la Forêt.
-- Auparavant l'app ne lisait que la METADATA des livres (titre/auteur/tags) ;
-- désormais elle cite des passages exacts via pgvector cosine similarity.
--
-- v3 : branche selon la présence d'un filtre book_ids.
--   - Sans filtre  → HNSW (rapide, ~100ms sur 60 983 chunks)
--   - Avec filtre  → bitmap scan via idx_chunks_book + sort
--     (évite la pathologie HNSW qui renvoyait 0 candidats in-scope quand
--      le filtre est restrictif)
--
-- Appliquée en prod 2026-04-20 via MCP Supabase.
-- Consommateurs :
--   - src/lib/forest-retrieval.ts (queryForestChunks)
--   - /api/dreams/extract-deep (injection chunks dans prompt Sonnet)
--   - /api/chat (injection chunks selon mode)
--   - futurs : /api/oracle-corps, /api/tale, /api/figures

CREATE OR REPLACE FUNCTION match_forest_chunks(
  query_embedding vector(1536),
  match_count int DEFAULT 8,
  filter_book_ids text[] DEFAULT NULL,
  min_similarity float DEFAULT 0.2
)
RETURNS TABLE(
  id bigint,
  book_id text,
  book_title text,
  book_author text,
  book_main_root text,
  chunk_text text,
  page_start int,
  page_end int,
  chunk_index int,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  IF filter_book_ids IS NULL THEN
    -- Pas de scoping : HNSW joue son rôle.
    RETURN QUERY
    SELECT
      fc.id, fc.book_id,
      fb.title AS book_title,
      fb.author AS book_author,
      fb.main_root AS book_main_root,
      fc.chunk_text, fc.page_start, fc.page_end, fc.chunk_index,
      (1 - (fc.embedding <=> query_embedding))::float AS similarity
    FROM forest_chunks fc
    LEFT JOIN forest_books fb ON fb.id = fc.book_id
    WHERE fc.embedding IS NOT NULL
      AND (1 - (fc.embedding <=> query_embedding)) >= min_similarity
    ORDER BY fc.embedding <=> query_embedding
    LIMIT match_count;
  ELSE
    -- Scoping : CTE MATERIALIZED pour forcer bitmap scan sur idx_chunks_book
    -- et éviter que le planner tente HNSW (qui donne 0 résultat en filtré).
    RETURN QUERY
    WITH filtered AS MATERIALIZED (
      SELECT
        fc.id, fc.book_id, fc.chunk_text, fc.page_start, fc.page_end, fc.chunk_index,
        (fc.embedding <=> query_embedding) AS dist
      FROM forest_chunks fc
      WHERE fc.embedding IS NOT NULL
        AND fc.book_id = ANY(filter_book_ids)
    )
    SELECT
      f.id, f.book_id,
      fb.title AS book_title,
      fb.author AS book_author,
      fb.main_root AS book_main_root,
      f.chunk_text, f.page_start, f.page_end, f.chunk_index,
      (1 - f.dist)::float AS similarity
    FROM filtered f
    LEFT JOIN forest_books fb ON fb.id = f.book_id
    WHERE (1 - f.dist) >= min_similarity
    ORDER BY f.dist
    LIMIT match_count;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION match_forest_chunks TO anon, authenticated, service_role;
