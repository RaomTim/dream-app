-- =============================================================================
-- MIGRATION : Chat humain de groupe (G4) + défis (G-défis)
-- File   : supabase-migrations/2026-07-11_circle_chat_defis.sql
-- Author : Yeshua (Opus) — 2026-07-11
-- Spec   : DREAM-MVP-SPEC-ECRANS-A-Z.md §4 (G4 chat, G-défis, G7)
-- Statut : APPLIQUÉE EN PROD. Migration trackée `20260711011525_circle_chat_defis`
--          (vérifiée 2026-07-26, flotte A5 — circle_messages/circle_challenges/
--          circle_challenge_members existent). Entête corrigée : elle disait
--          « NON appliquée », c'était faux.
--
-- Contexte schéma existant (vérifié en live) :
--   circle_members.user_id  = TEXT (legacy) → tout le RLS caste auth.uid()::text
--   circles / circle_members / circle_shares existent déjà.
--   Les routes serveur utilisent la service-role key (bypass RLS) : le RLS
--   ci-dessous est une DÉFENSE en profondeur contre tout accès anon direct.
--
-- Ce que fait ce fichier :
--   1. circle_messages          — le chat humain (texte / audio / photo)
--   2. circle_challenges        — un défi lancé dans le groupe
--   3. circle_challenge_members — « j'en suis » (prénoms, jamais des chiffres)
--   4. RLS membres-du-cercle-seulement sur les 3 tables
--   5. Bucket storage privé `circle-media` (audio/photo, signed URLs)
--   6. Realtime : ajout de circle_messages à la publication supabase_realtime
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. circle_messages — le chat humain (zéro IA, zéro transcription)
-- -----------------------------------------------------------------------------
create table if not exists public.circle_messages (
  id           uuid primary key default gen_random_uuid(),
  circle_id    uuid not null references public.circles(id) on delete cascade,
  user_id      text not null,
  kind         text not null default 'text' check (kind in ('text', 'audio', 'photo')),
  body         text,                 -- rempli pour kind='text' (ou légende éventuelle)
  storage_path text,                 -- rempli pour kind='audio'|'photo' (bucket circle-media)
  created_at   timestamptz not null default now(),
  -- garde-fou d'intégrité : texte => body, media => storage_path
  constraint circle_messages_payload_chk check (
    (kind = 'text'  and body is not null and length(btrim(body)) > 0)
    or (kind in ('audio', 'photo') and storage_path is not null)
  )
);

create index if not exists idx_circle_messages_circle_created
  on public.circle_messages (circle_id, created_at desc);

-- -----------------------------------------------------------------------------
-- 2. circle_challenges — un défi (statut open/done ; pas de compteur de jours)
-- -----------------------------------------------------------------------------
create table if not exists public.circle_challenges (
  id         uuid primary key default gen_random_uuid(),
  circle_id  uuid not null references public.circles(id) on delete cascade,
  creator_id text not null,
  title      text not null,
  status     text not null default 'open' check (status in ('open', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists idx_circle_challenges_circle_status
  on public.circle_challenges (circle_id, status, created_at desc);

-- -----------------------------------------------------------------------------
-- 3. circle_challenge_members — « j'en suis » (un membre = une ligne, unique)
-- -----------------------------------------------------------------------------
create table if not exists public.circle_challenge_members (
  challenge_id uuid not null references public.circle_challenges(id) on delete cascade,
  user_id      text not null,
  joined_at    timestamptz not null default now(),
  constraint circle_challenge_members_unique unique (challenge_id, user_id)
);

create index if not exists idx_circle_challenge_members_challenge
  on public.circle_challenge_members (challenge_id);

-- -----------------------------------------------------------------------------
-- 4. RLS — membres du cercle uniquement (defense-in-depth ; routes = service role)
-- -----------------------------------------------------------------------------
alter table public.circle_messages          enable row level security;
alter table public.circle_challenges        enable row level security;
alter table public.circle_challenge_members enable row level security;

-- circle_messages : lire si membre actif ; écrire ses propres messages si membre actif
drop policy if exists circle_messages_select on public.circle_messages;
create policy circle_messages_select on public.circle_messages
  for select using (
    exists (
      select 1 from public.circle_members m
      where m.circle_id = circle_messages.circle_id
        and m.user_id = auth.uid()::text
        and m.left_at is null
    )
  );

drop policy if exists circle_messages_insert on public.circle_messages;
create policy circle_messages_insert on public.circle_messages
  for insert with check (
    user_id = auth.uid()::text
    and exists (
      select 1 from public.circle_members m
      where m.circle_id = circle_messages.circle_id
        and m.user_id = auth.uid()::text
        and m.left_at is null
    )
  );

-- circle_challenges : lire si membre ; créer si membre ; passer done si créateur
drop policy if exists circle_challenges_select on public.circle_challenges;
create policy circle_challenges_select on public.circle_challenges
  for select using (
    exists (
      select 1 from public.circle_members m
      where m.circle_id = circle_challenges.circle_id
        and m.user_id = auth.uid()::text
        and m.left_at is null
    )
  );

drop policy if exists circle_challenges_insert on public.circle_challenges;
create policy circle_challenges_insert on public.circle_challenges
  for insert with check (
    creator_id = auth.uid()::text
    and exists (
      select 1 from public.circle_members m
      where m.circle_id = circle_challenges.circle_id
        and m.user_id = auth.uid()::text
        and m.left_at is null
    )
  );

drop policy if exists circle_challenges_update on public.circle_challenges;
create policy circle_challenges_update on public.circle_challenges
  for update using (creator_id = auth.uid()::text)
  with check (creator_id = auth.uid()::text);

-- circle_challenge_members : lire/écrire si membre du cercle du défi ; s'inscrire soi-même
drop policy if exists circle_challenge_members_select on public.circle_challenge_members;
create policy circle_challenge_members_select on public.circle_challenge_members
  for select using (
    exists (
      select 1
      from public.circle_challenges ch
      join public.circle_members m on m.circle_id = ch.circle_id
      where ch.id = circle_challenge_members.challenge_id
        and m.user_id = auth.uid()::text
        and m.left_at is null
    )
  );

drop policy if exists circle_challenge_members_insert on public.circle_challenge_members;
create policy circle_challenge_members_insert on public.circle_challenge_members
  for insert with check (
    user_id = auth.uid()::text
    and exists (
      select 1
      from public.circle_challenges ch
      join public.circle_members m on m.circle_id = ch.circle_id
      where ch.id = circle_challenge_members.challenge_id
        and m.user_id = auth.uid()::text
        and m.left_at is null
    )
  );

drop policy if exists circle_challenge_members_delete on public.circle_challenge_members;
create policy circle_challenge_members_delete on public.circle_challenge_members
  for delete using (user_id = auth.uid()::text);

-- -----------------------------------------------------------------------------
-- 5. Storage : bucket privé pour les audios/photos du chat (signed URLs only)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('circle-media', 'circle-media', false)
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- 6. Realtime : le chat s'abonne aux INSERT de circle_messages
--    (fallback polling 15s côté client si la publication n'est pas dispo)
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1
    from pg_publication p
    join pg_publication_rel pr on pr.prpubid = p.oid
    join pg_class c on c.oid = pr.prrelid
    where p.pubname = 'supabase_realtime' and c.relname = 'circle_messages'
  ) then
    execute 'alter publication supabase_realtime add table public.circle_messages';
  end if;
end $$;

-- FIN
