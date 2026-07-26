-- =============================================================================
-- MIGRATION: Tier 3 RLS surgical finalisation
-- File: 20260425_120300_tier3_rls_surgical.sql
-- Author: Yeshua — QW2 backend Dream App refonte 2026-04-25
-- =============================================================================
--
-- AUDIT INITIAL (2026-04-25)
-- ---------------------------
-- TABLES AVEC RLS POSE MAIS POLICIES TROP OUVERTES (qual = true) :
--   - circles, circle_members, circle_sessions, circle_shares
--     → toutes les policies SELECT/UPDATE/DELETE laissent passer "true"
--     → INSERT sans WITH CHECK
--
-- POLICIES DANGEREUSES SUR dreams :
--   - "Allow reading imported dreams" : SELECT (source IN ('import-audio','import-text'))
--     → permet à n'importe qui de lire les imports d'autrui
--   - "Allow import inserts" : INSERT sans WITH CHECK
--
-- POLICIES INCOMPLETES :
--   - personal_forest : manque DELETE
--   - conversations  : manque UPDATE + DELETE
--
-- PATTERN LEGACY :
--   - dreams.user_id, conversations.user_id, personal_forest.user_id, circle_members.user_id,
--     circle_shares.user_id sont TEXT (pas uuid) → cast (auth.uid())::text dans policies
--   - On garde le pattern (pas de migration uuid sur legacy — kairos est uuid propre)
--
-- =============================================================================
-- NOTE TIER 3 LEGACY FALLBACK
-- ---------------------------
-- src/lib/auth-server.ts conserve LEGACY_FALLBACK_ENABLED = true (tier 2 transition).
-- Ce SQL durcit RLS mais service_role bypass → pas de regression côté API routes.
-- Tim peut flipper LEGACY_FALLBACK_ENABLED=false quand il décide.
-- =============================================================================


-- =============================================================================
-- FIX 1 — DREAMS : retirer les policies open dangereuses
-- =============================================================================

DROP POLICY IF EXISTS "Allow reading imported dreams" ON dreams;
DROP POLICY IF EXISTS "Allow import inserts" ON dreams;

-- Si Tim veut un import via service_role : pas de policy nécessaire (bypass).
-- Si import doit rester possible côté client (route API utilise service_role) : OK.


-- =============================================================================
-- FIX 2 — PERSONAL_FOREST : ajouter DELETE
-- =============================================================================

DROP POLICY IF EXISTS "personal_forest_delete_own" ON personal_forest;
CREATE POLICY "personal_forest_delete_own"
  ON personal_forest FOR DELETE
  USING (user_id = (auth.uid())::text);


-- =============================================================================
-- FIX 3 — CONVERSATIONS : ajouter UPDATE + DELETE + WITH CHECK sur INSERT
-- conversations.user_id est text (legacy)
-- =============================================================================

-- INSERT : ajouter WITH CHECK explicite
DROP POLICY IF EXISTS "Users can insert own conversations" ON conversations;
CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (user_id = (auth.uid())::text);

DROP POLICY IF EXISTS "conversations_update_own" ON conversations;
CREATE POLICY "conversations_update_own"
  ON conversations FOR UPDATE
  USING (user_id = (auth.uid())::text)
  WITH CHECK (user_id = (auth.uid())::text);

DROP POLICY IF EXISTS "conversations_delete_own" ON conversations;
CREATE POLICY "conversations_delete_own"
  ON conversations FOR DELETE
  USING (user_id = (auth.uid())::text);


-- =============================================================================
-- FIX 4 — DREAMS : compléter WITH CHECK sur INSERT
-- =============================================================================

DROP POLICY IF EXISTS "Users can insert own dreams" ON dreams;
CREATE POLICY "Users can insert own dreams"
  ON dreams FOR INSERT
  WITH CHECK (user_id = (auth.uid())::text);


-- =============================================================================
-- FIX 5 — PERSONAL_FOREST : compléter WITH CHECK sur INSERT
-- =============================================================================

DROP POLICY IF EXISTS "Users can insert own symbols" ON personal_forest;
CREATE POLICY "Users can insert own symbols"
  ON personal_forest FOR INSERT
  WITH CHECK (user_id = (auth.uid())::text);


-- =============================================================================
-- FIX 6 — CIRCLES : surgical
-- circles a created_by uuid (pas user_id)
-- Visibilité : membre du cercle (via circle_members) → lecture
-- Création : authentifié → INSERT (le créateur s'ajoute via circle_members en suite)
-- Update/Delete : créateur seul
-- =============================================================================

DROP POLICY IF EXISTS "circles_select" ON circles;
CREATE POLICY "circles_select_member"
  ON circles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circles.id
        AND cm.user_id = (auth.uid())::text
    )
    OR created_by = (auth.uid())::text
  );

DROP POLICY IF EXISTS "circles_insert" ON circles;
CREATE POLICY "circles_insert_authenticated"
  ON circles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND (created_by IS NULL OR created_by = (auth.uid())::text));

DROP POLICY IF EXISTS "circles_update" ON circles;
CREATE POLICY "circles_update_creator"
  ON circles FOR UPDATE
  USING (created_by = (auth.uid())::text)
  WITH CHECK (created_by = (auth.uid())::text);

DROP POLICY IF EXISTS "circles_delete" ON circles;
CREATE POLICY "circles_delete_creator"
  ON circles FOR DELETE
  USING (created_by = (auth.uid())::text);


-- =============================================================================
-- FIX 7 — CIRCLE_MEMBERS : surgical
-- user_id text (legacy). Membre voit les autres membres du même cercle.
-- =============================================================================

DROP POLICY IF EXISTS "circle_members_select" ON circle_members;
CREATE POLICY "circle_members_select_in_circle"
  ON circle_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm2
      WHERE cm2.circle_id = circle_members.circle_id
        AND cm2.user_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "circle_members_insert" ON circle_members;
CREATE POLICY "circle_members_insert_self"
  ON circle_members FOR INSERT
  WITH CHECK (user_id = (auth.uid())::text);

DROP POLICY IF EXISTS "circle_members_delete" ON circle_members;
CREATE POLICY "circle_members_delete_self_or_guardian"
  ON circle_members FOR DELETE
  USING (
    user_id = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM circle_members cm2
      WHERE cm2.circle_id = circle_members.circle_id
        AND cm2.user_id = (auth.uid())::text
        AND cm2.role = 'guardian'
    )
  );

DROP POLICY IF EXISTS "circle_members_update_own" ON circle_members;
CREATE POLICY "circle_members_update_own"
  ON circle_members FOR UPDATE
  USING (user_id = (auth.uid())::text)
  WITH CHECK (user_id = (auth.uid())::text);


-- =============================================================================
-- FIX 8 — CIRCLE_SESSIONS : surgical
-- circle_sessions n'a pas user_id direct (started_by uuid).
-- Visibilité : membres du cercle.
-- =============================================================================

DROP POLICY IF EXISTS "circle_sessions_select" ON circle_sessions;
CREATE POLICY "circle_sessions_select_member"
  ON circle_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_sessions.circle_id
        AND cm.user_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "circle_sessions_insert" ON circle_sessions;
CREATE POLICY "circle_sessions_insert_member"
  ON circle_sessions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_sessions.circle_id
        AND cm.user_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "circle_sessions_update" ON circle_sessions;
CREATE POLICY "circle_sessions_update_starter_or_guardian"
  ON circle_sessions FOR UPDATE
  USING (
    started_by = (auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_sessions.circle_id
        AND cm.user_id = (auth.uid())::text
        AND cm.role = 'guardian'
    )
  );

DROP POLICY IF EXISTS "circle_sessions_delete" ON circle_sessions;
CREATE POLICY "circle_sessions_delete_guardian"
  ON circle_sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_sessions.circle_id
        AND cm.user_id = (auth.uid())::text
        AND cm.role = 'guardian'
    )
  );


-- =============================================================================
-- FIX 9 — CIRCLE_SHARES : surgical
-- user_id text. Membre voit les shares de son cercle.
-- =============================================================================

DROP POLICY IF EXISTS "circle_shares_select" ON circle_shares;
CREATE POLICY "circle_shares_select_member"
  ON circle_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_shares.circle_id
        AND cm.user_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "circle_shares_insert" ON circle_shares;
CREATE POLICY "circle_shares_insert_own"
  ON circle_shares FOR INSERT
  WITH CHECK (
    user_id = (auth.uid())::text
    AND EXISTS (
      SELECT 1 FROM circle_members cm
      WHERE cm.circle_id = circle_shares.circle_id
        AND cm.user_id = (auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "circle_shares_update_own" ON circle_shares;
CREATE POLICY "circle_shares_update_own"
  ON circle_shares FOR UPDATE
  USING (user_id = (auth.uid())::text)
  WITH CHECK (user_id = (auth.uid())::text);

DROP POLICY IF EXISTS "circle_shares_delete_own" ON circle_shares;
CREATE POLICY "circle_shares_delete_own"
  ON circle_shares FOR DELETE
  USING (user_id = (auth.uid())::text);


-- =============================================================================
-- FIX 10 — collective_digests : ajouter UPDATE/DELETE service_role only (cleanup)
-- collective_digests a 2 policies : SELECT public + INSERT service_role.
-- Pas besoin d'UPDATE/DELETE user-side (digests immutables).
-- =============================================================================
-- (no-op — déjà OK)


-- =============================================================================
-- FIX 11 — TABLES SANS RLS (Forêt mutualisée)
-- Décision : laisser sans RLS — lecture publique éditoriale, écriture service_role only.
-- Tables concernées :
--   forest_books, forest_chunks, forest_concepts, forest_edges, forest_tensions,
--   forest_chunking_jobs, forest_products, forest_book_suggestions, forest_api_users,
--   master_events, _t2_staging
-- forest_retrieval_logs : log analytics, RLS désactivé volontairement (insert via service_role).
-- =============================================================================
-- (no-op — décision documentée)


-- =============================================================================
-- SANITY CHECK (commenté — à exécuter si besoin)
-- =============================================================================

-- SELECT tablename, count(*) AS n_policies
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- GROUP BY tablename
-- ORDER BY tablename;

-- =============================================================================
-- END
-- =============================================================================
