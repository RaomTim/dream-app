-- =============================================================================
-- MIGRATION: Enable Row Level Security — Dream Alpha App
-- File: 20260420_120000_enable_rls.sql
-- Author: Yeshua (draft) — Tim reviews & applies manually
-- =============================================================================
--
-- WHAT THIS FILE DOES
-- -------------------
-- Enables RLS on all user-owned tables and creates granular per-table policies.
-- The service_role key bypasses RLS automatically — no changes needed for any
-- server-side route that already uses createServerClient() with SUPABASE_SERVICE_ROLE_KEY.
--
-- DEPLOY ORDER (DO NOT SKIP STEPS)
-- ---------------------------------
-- 1. Merge and deploy Tier 2 code (Bearer auth working end-to-end).
--    Every API route must send Authorization: Bearer <token> — not userId query-param.
--    Verify by checking server logs: zero occurrences of "[auth-server] LEGACY_AUTH used".
--
-- 2. Flip LEGACY_FALLBACK_ENABLED=false in src/lib/auth-server.ts and redeploy.
--    This ensures all traffic goes through bearer tokens before RLS locks things down.
--
-- 3. Apply THIS migration.
--    Run the "Sanity check" SELECT block at the bottom FIRST to detect orphans.
--
-- 4. Verify in Supabase dashboard or via psql:
--    a) List a dream via anon key with no auth header → should return 0 rows.
--    b) List a dream via service_role key → should return full set.
--    c) List a dream via user's bearer token → should return only that user's rows.
--
-- =============================================================================


-- =============================================================================
-- TABLE: dreams
-- user_id column: YES (confirmed in schema + all routes use .eq('user_id', userId))
-- =============================================================================

ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

-- User can read their own dreams
CREATE POLICY "dreams_select_own"
  ON dreams FOR SELECT
  USING (auth.uid() = user_id);

-- User can insert dreams they own (prevents forging other users' rows)
CREATE POLICY "dreams_insert_own"
  ON dreams FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User can update only their own dreams
CREATE POLICY "dreams_update_own"
  ON dreams FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User can delete only their own dreams
CREATE POLICY "dreams_delete_own"
  ON dreams FOR DELETE
  USING (auth.uid() = user_id);

-- Public collective feed: opt-in dreams readable by any authenticated user (anonymized view)
-- NOTE: collective_optin column is not yet in production schema as of 2026-04-20.
-- This policy references it but will be a no-op (returns 0 rows) until the column
-- is added via the planned migration 20260420_add_collective_optin.sql.
-- Once that migration runs and users opt in, this policy enables the /api/dreams/collective feed.
CREATE POLICY "dreams_select_collective_optin"
  ON dreams FOR SELECT
  USING (
    collective_optin = true
    AND auth.uid() IS NOT NULL
  );


-- =============================================================================
-- TABLE: conversations
-- user_id column: NO direct column — linked to dreams via dream_id (CASCADE)
-- Ownership model: conversation belongs to whoever owns the dream.
-- Pattern: all routes first verify dream ownership via dreams.user_id, then
-- access conversations by dream_id. Under RLS we mirror this with a subquery.
-- =============================================================================

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- User can read conversations for their own dreams
CREATE POLICY "conversations_select_own"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = conversations.dream_id
        AND dreams.user_id = auth.uid()
    )
  );

-- User can insert conversations only into their own dreams
CREATE POLICY "conversations_insert_own"
  ON conversations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = conversations.dream_id
        AND dreams.user_id = auth.uid()
    )
  );

-- User can update conversations in their own dreams
CREATE POLICY "conversations_update_own"
  ON conversations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = conversations.dream_id
        AND dreams.user_id = auth.uid()
    )
  );

-- User can delete conversations in their own dreams
CREATE POLICY "conversations_delete_own"
  ON conversations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dreams
      WHERE dreams.id = conversations.dream_id
        AND dreams.user_id = auth.uid()
    )
  );


-- =============================================================================
-- TABLE: personal_forest
-- user_id column: YES (confirmed in supabase.ts: .eq('user_id', userId))
-- =============================================================================

ALTER TABLE personal_forest ENABLE ROW LEVEL SECURITY;

-- User can read only their own personal symbols
CREATE POLICY "personal_forest_select_own"
  ON personal_forest FOR SELECT
  USING (auth.uid() = user_id);

-- User can insert only their own personal symbols
CREATE POLICY "personal_forest_insert_own"
  ON personal_forest FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- User can update only their own personal symbols
CREATE POLICY "personal_forest_update_own"
  ON personal_forest FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User can delete only their own personal symbols
CREATE POLICY "personal_forest_delete_own"
  ON personal_forest FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: circles
-- user_id column: NO direct column — has created_by (the circle guardian)
-- Visibility model: a circle is visible to its members (via circle_members table).
-- Pattern: routes always gate on circle_members membership first, then read circles.
-- =============================================================================

ALTER TABLE circles ENABLE ROW LEVEL SECURITY;

-- User can see circles they're a member of
CREATE POLICY "circles_select_member"
  ON circles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circles.id
        AND circle_members.user_id = auth.uid()
    )
  );

-- Any authenticated user can create a circle (they become guardian via circle_members insert)
CREATE POLICY "circles_insert_authenticated"
  ON circles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only the creator (guardian) can update circle metadata
CREATE POLICY "circles_update_creator"
  ON circles FOR UPDATE
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Only the creator (guardian) can delete the circle
CREATE POLICY "circles_delete_creator"
  ON circles FOR DELETE
  USING (created_by = auth.uid());


-- =============================================================================
-- TABLE: circle_members
-- user_id column: YES (confirmed: .eq('user_id', userId) in all circle routes)
-- Nuanced model: a member can see the membership list of circles they belong to.
-- =============================================================================

ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

-- Member can see all membership rows for circles they're already in
-- (needed for resonances cross-dreamer analysis and member count)
CREATE POLICY "circle_members_select_in_circle"
  ON circle_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members AS cm2
      WHERE cm2.circle_id = circle_members.circle_id
        AND cm2.user_id = auth.uid()
    )
  );

-- Any authenticated user can join a circle (insert their own membership row)
CREATE POLICY "circle_members_insert_own"
  ON circle_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Member can update only their own membership row (e.g., display_name)
CREATE POLICY "circle_members_update_own"
  ON circle_members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Member can remove themselves; guardian can remove anyone in their circle
CREATE POLICY "circle_members_delete_own_or_guardian"
  ON circle_members FOR DELETE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM circle_members AS cm2
      WHERE cm2.circle_id = circle_members.circle_id
        AND cm2.user_id = auth.uid()
        AND cm2.role = 'guardian'
    )
  );


-- =============================================================================
-- TABLE: circle_sessions
-- user_id column: NO direct column — has started_by (uuid of initiating member)
-- Nuanced model: sessions are visible to members of the circle, not the general public.
-- =============================================================================

ALTER TABLE circle_sessions ENABLE ROW LEVEL SECURITY;

-- Member can see sessions for circles they belong to
CREATE POLICY "circle_sessions_select_member"
  ON circle_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_sessions.circle_id
        AND circle_members.user_id = auth.uid()
    )
  );

-- Member can start a session in their circle
CREATE POLICY "circle_sessions_insert_member"
  ON circle_sessions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_sessions.circle_id
        AND circle_members.user_id = auth.uid()
    )
  );

-- Only the session starter (or guardian) can update a session
CREATE POLICY "circle_sessions_update_starter_or_guardian"
  ON circle_sessions FOR UPDATE
  USING (
    started_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_sessions.circle_id
        AND circle_members.user_id = auth.uid()
        AND circle_members.role = 'guardian'
    )
  );

-- Only the guardian can delete a session
CREATE POLICY "circle_sessions_delete_guardian"
  ON circle_sessions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_sessions.circle_id
        AND circle_members.user_id = auth.uid()
        AND circle_members.role = 'guardian'
    )
  );


-- =============================================================================
-- TABLE: circle_shares
-- user_id column: YES (confirmed in share route: user_id: userId)
-- Nuanced model: shares in a circle are visible to all members of that circle.
-- =============================================================================

ALTER TABLE circle_shares ENABLE ROW LEVEL SECURITY;

-- Circle member can see all shares in their circle
CREATE POLICY "circle_shares_select_member"
  ON circle_shares FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_shares.circle_id
        AND circle_members.user_id = auth.uid()
    )
  );

-- Member can share into their own circle
CREATE POLICY "circle_shares_insert_own"
  ON circle_shares FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM circle_members
      WHERE circle_members.circle_id = circle_shares.circle_id
        AND circle_members.user_id = auth.uid()
    )
  );

-- User can update only their own share
CREATE POLICY "circle_shares_update_own"
  ON circle_shares FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User can delete only their own share
CREATE POLICY "circle_shares_delete_own"
  ON circle_shares FOR DELETE
  USING (auth.uid() = user_id);


-- =============================================================================
-- TABLE: tales
-- user_id column: NO — tales are a curated reference dataset (editorial content)
-- Access model: any authenticated user can read tales filtered by ethics_flag.
-- No user writes to this table — it's populated by Tim/admin via service_role.
-- =============================================================================

ALTER TABLE tales ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read tales that are flagged as open
-- (tales with ethics_flag != 'open' are invisible to end users — internal-only)
CREATE POLICY "tales_select_open"
  ON tales FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND ethics_flag = 'open'
  );

-- No INSERT/UPDATE/DELETE policies — only service_role (bypasses RLS) can write tales


-- =============================================================================
-- TABLE: forest_books
-- user_id column: NO — global reference library, not user-owned
-- Access model: public read (any anon/auth user can read book metadata)
-- No user writes — populated exclusively via service_role pipeline
-- =============================================================================

ALTER TABLE forest_books ENABLE ROW LEVEL SECURITY;

-- Public read — forest book metadata is not sensitive
CREATE POLICY "forest_books_select_public"
  ON forest_books FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies — service_role only


-- =============================================================================
-- TABLE: dream_forest_books
-- user_id column: NO — join table linking dream-relevant books (editorial)
-- Access model: public read (used by Dream App to scope forest queries)
-- =============================================================================

ALTER TABLE dream_forest_books ENABLE ROW LEVEL SECURITY;

-- Public read — this is a curated editorial mapping, not sensitive
CREATE POLICY "dream_forest_books_select_public"
  ON dream_forest_books FOR SELECT
  USING (true);

-- No INSERT/UPDATE/DELETE policies — service_role only


-- =============================================================================
-- TABLE: forest_chunks
-- user_id column: NO — embedding chunks of forest books, editorial data
-- Access model: readable by authenticated users (needed for semantic retrieval RPCs)
-- =============================================================================

ALTER TABLE forest_chunks ENABLE ROW LEVEL SECURITY;

-- Authenticated users can query chunks (for match_forest_chunks RPC and direct queries)
CREATE POLICY "forest_chunks_select_authenticated"
  ON forest_chunks FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- No INSERT/UPDATE/DELETE policies — service_role only (embedding pipeline)


-- =============================================================================
-- TABLE: forest_retrieval_logs
-- user_id column: YES (fire-and-forget insert in forest-retrieval.ts, nullable)
-- Access model: users should NOT read each other's retrieval logs.
--   Logs are operational/analytics data written by service_role in production.
--   Under RLS, users can only see their own logs (if they ever need to).
-- =============================================================================

ALTER TABLE forest_retrieval_logs ENABLE ROW LEVEL SECURITY;

-- User can see only their own retrieval logs (user_id is nullable — NULLs hidden from all users)
CREATE POLICY "forest_retrieval_logs_select_own"
  ON forest_retrieval_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Logs are written exclusively by service_role (bypasses RLS) — no user INSERT policy needed


-- =============================================================================
-- TABLE: profiles
-- user_id column: inferred as id (Supabase auth pattern — profiles.id = auth.uid())
-- Access model: used in /api/dreams/collective for geographic scoping.
--   Users own their profile row. Collective route reads via service_role.
-- NOTE: profiles table structure not in schema SQL — inferred from usage:
--   .select('id, timezone, country, region').in('id', userIds)
--   This is the standard Supabase auth.users mirror pattern.
-- =============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- User can read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- User can insert their own profile (typically done at signup via trigger)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User can update their own profile
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- No DELETE policy — profiles are not self-deleted (account deletion handled server-side)


-- =============================================================================
-- TABLE: master_events
-- user_id column: NO — collective intelligence events, not user-owned
-- Access model: any authenticated user can read master events (public signal board).
--   Writes happen exclusively via service_role (fire-and-forget in collective route).
-- =============================================================================

ALTER TABLE master_events ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read collective master events
CREATE POLICY "master_events_select_authenticated"
  ON master_events FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- No INSERT/UPDATE/DELETE user policies — service_role writes these (bypasses RLS)


-- =============================================================================
-- SANITY CHECK — Run these BEFORE applying the migration above.
-- They detect rows with NULL user_id (would become invisible under RLS)
-- and orphaned user references (user deleted from auth.users but rows remain).
-- Uncomment and run in Supabase SQL editor.
-- =============================================================================

-- SELECT 'dreams' AS table_name, count(*) AS null_user_id_rows
--   FROM dreams WHERE user_id IS NULL
-- UNION ALL
-- SELECT 'personal_forest', count(*)
--   FROM personal_forest WHERE user_id IS NULL
-- UNION ALL
-- SELECT 'circle_members', count(*)
--   FROM circle_members WHERE user_id IS NULL
-- UNION ALL
-- SELECT 'circle_shares', count(*)
--   FROM circle_shares WHERE user_id IS NULL
-- UNION ALL
-- SELECT 'forest_retrieval_logs (nullable ok)', count(*)
--   FROM forest_retrieval_logs WHERE user_id IS NULL;

-- Orphaned user references (rows whose user_id no longer exists in auth.users):
-- SELECT 'dreams_orphaned' AS check_name, count(*)
--   FROM dreams d
--   LEFT JOIN auth.users u ON u.id = d.user_id
--   WHERE d.user_id IS NOT NULL AND u.id IS NULL
-- UNION ALL
-- SELECT 'personal_forest_orphaned', count(*)
--   FROM personal_forest pf
--   LEFT JOIN auth.users u ON u.id = pf.user_id
--   WHERE pf.user_id IS NOT NULL AND u.id IS NULL
-- UNION ALL
-- SELECT 'circle_members_orphaned', count(*)
--   FROM circle_members cm
--   LEFT JOIN auth.users u ON u.id = cm.user_id
--   WHERE cm.user_id IS NOT NULL AND u.id IS NULL;

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
