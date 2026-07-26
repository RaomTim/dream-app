-- ════════════════════════════════════════════════════════════════════════════
-- LE MUR — schéma `wall` (feature sociale signature : public MAIS anonyme)
-- 2026-07-11 · Yeshua (Opus) · SPEC : DREAM-MVP-SPEC-ECRANS-A-Z.md §5 (M1/M2/P1)
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260711011443_wall_schema_mur_anonyme`
-- (vérifiée 2026-07-26, flotte A5 — schéma wall + posts/touches/reports existent).
-- Entête corrigée : elle disait « ne pas appliquer directement en prod, staging d'abord »,
-- c'est fait, en prod, depuis le 2026-07-11.
--
-- RÈGLE D'OR (architecturale, pas cosmétique) :
--   Aucune lecture publique n'expose JAMAIS user_id ni aucun identifiant d'auteur.
--   Le feed public est servi par le service_role, qui sélectionne à la main
--   UNIQUEMENT (id, body, created_at). La RLS ci-dessous est une défense en
--   profondeur : un client anon/authenticated qui taperait la table directement
--   ne verrait QUE ses propres lignes (jamais celles des autres).
--
-- ⚠️ EXPOSITION API REQUISE après application (sinon supabase-js `.schema('wall')`
--    renvoie 404 — PostgREST ne touche que les schémas exposés) :
--    (a) Dashboard → Project Settings → API → "Exposed schemas" : ajouter `wall`.
--    (b) OU en SQL (self-hosted / CLI) :
--          ALTER ROLE authenticator SET pgrst.db_schemas = 'public, graphql_public, wall';
--          NOTIFY pgrst, 'reload config';
-- ════════════════════════════════════════════════════════════════════════════

create schema if not exists wall;

grant usage on schema wall to authenticated, service_role;

-- ─────────────────────────── wall.posts ───────────────────────────
-- Un dépôt sur le Mur. `body` = SNAPSHOT du texte du kairos au moment du partage
-- (figé : si le kairos change ou est supprimé plus tard, le Mur reste cohérent).
-- `kairos_id` en ON DELETE SET NULL : la trace Mur survit à la suppression du kairos.
create table if not exists wall.posts (
  id          uuid primary key default gen_random_uuid(),
  kairos_id   uuid references public.kairos(id) on delete set null,
  user_id     uuid not null references auth.users(id) on delete cascade,
  tab         text not null check (tab in ('nuit', 'jour')),
  body        text not null,
  created_at  timestamptz not null default now(),
  status      text not null default 'published' check (status in ('published', 'removed'))
);

-- ─────────────────────────── wall.touches ───────────────────────────
-- « Ça me touche ». Une trace par (post, personne). Le COMPTE n'est jamais public :
-- il n'est révélé qu'à l'auteur du post (via l'API, service_role, comparaison serveur).
create table if not exists wall.touches (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references wall.posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (post_id, user_id)
);

-- ─────────────────────────── wall.reports ───────────────────────────
-- Signalement (drapeau, appui long). Lu UNIQUEMENT par la modération (service_role).
create table if not exists wall.reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references wall.posts(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  reason      text,
  created_at  timestamptz not null default now(),
  status      text not null default 'open' check (status in ('open', 'handled'))
);

-- ─────────────────────────── index ───────────────────────────
create index if not exists posts_feed_idx  on wall.posts (tab, status, created_at desc);
create index if not exists posts_user_idx  on wall.posts (user_id);
-- un seul post « publié » par kairos (on peut retirer puis re-déposer)
create unique index if not exists posts_one_live_per_kairos
  on wall.posts (kairos_id) where status = 'published' and kairos_id is not null;
create index if not exists touches_post_idx on wall.touches (post_id);
create index if not exists reports_post_idx on wall.reports (post_id);

-- ═══════════════════════════ RLS (défense en profondeur) ═══════════════════════════
-- Les routes API utilisent le service_role (bypass RLS) et appliquent la règle d'or
-- par sélection de colonnes + contrôle de propriété. Ces policies garantissent qu'AUCUN
-- accès direct (anon/authenticated) ne peut fuiter l'identité d'un autre rêveur.

alter table wall.posts   enable row level security;
alter table wall.touches enable row level security;
alter table wall.reports enable row level security;

-- posts : l'auteur lit/écrit/retire SES posts ; personne ne lit ceux des autres en direct.
create policy posts_select_own on wall.posts
  for select to authenticated using (user_id = auth.uid());
create policy posts_insert_own on wall.posts
  for insert to authenticated with check (user_id = auth.uid());
create policy posts_update_own on wall.posts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
-- pas de DELETE pour l'utilisateur : le retrait = UPDATE status='removed' (soft delete,
-- préserve l'intégrité des touches/reports et disparaît du feed).

-- touches : chacun ne voit/gère QUE ses propres « ça me touche ».
-- (Le compte agrégé pour l'auteur passe par le service_role, jamais par la RLS.)
create policy touches_select_own on wall.touches
  for select to authenticated using (user_id = auth.uid());
create policy touches_insert_own on wall.touches
  for insert to authenticated with check (user_id = auth.uid());
create policy touches_delete_own on wall.touches
  for delete to authenticated using (user_id = auth.uid());

-- reports : on peut déposer un signalement, on ne lit jamais ceux de la file (modération = service_role).
create policy reports_insert_own on wall.reports
  for insert to authenticated with check (user_id = auth.uid());

-- privilèges de table (RLS reste le garde-fou fin)
grant select, insert, update on wall.posts   to authenticated;
grant select, insert, delete on wall.touches to authenticated;
grant insert                 on wall.reports to authenticated;
grant all on all tables in schema wall to service_role;

comment on schema wall is 'LE MUR — mur public anonyme. Anonymat ARCHITECTURAL : aucune lecture publique n''expose user_id.';
comment on column wall.posts.body is 'Snapshot figé du texte du kairos au moment du partage.';
comment on table  wall.touches is 'Compte jamais public — révélé à l''auteur du post uniquement, via service_role.';
