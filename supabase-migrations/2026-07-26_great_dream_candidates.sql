-- ═══════════════════════════════════════════════════════════════════════════
-- great_dream_candidates — ce que l'app PROPOSE. Copie de référence de la
-- migration `great_dream_candidates_b3`, APPLIQUÉE EN PROD le 2026-07-26.
-- Agent B3 (Opus). Voir RAPPORT-B3.md.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.great_dream_candidates (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  kairos_id    uuid not null references public.kairos(id) on delete cascade,
  image        text,
  relief       double precision,
  components   jsonb,
  source       text not null default 'weekly'
                 check (source in ('first_review', 'weekly')),
  status       text not null default 'pending'
                 check (status in ('pending', 'accepted', 'dismissed')),
  proposed_at  timestamptz not null default now(),
  reviewed_at  timestamptz,
  constraint great_dream_candidates_unique unique (user_id, kairos_id)
);

create index if not exists great_dream_candidates_pending_idx
  on public.great_dream_candidates (user_id, status, proposed_at desc);

alter table public.great_dream_candidates enable row level security;

-- RLS SANS GRANT = lectures qui échouent en silence (incident schéma `community`).
grant select, insert, update on public.great_dream_candidates to authenticated;

drop policy if exists gdc_select_own on public.great_dream_candidates;
create policy gdc_select_own on public.great_dream_candidates
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists gdc_insert_own on public.great_dream_candidates;
create policy gdc_insert_own on public.great_dream_candidates
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists gdc_update_own on public.great_dream_candidates;
create policy gdc_update_own on public.great_dream_candidates
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
