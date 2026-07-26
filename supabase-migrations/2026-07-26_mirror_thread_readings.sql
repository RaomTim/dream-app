-- ═══════════════════════════════════════════════════════════════════════════
-- mirror_thread_readings — « ce que j'en ai dit », la lecture d'AUJOURD'HUI.
--
-- Ce que cette table est : l'endroit où le rêveur pose une lecture neuve à côté
-- de ses anciennes, quand un montage lui en donne envie. Elle rend le dispositif
-- vivant plutôt que muséal — sans elle, « ce que j'en ai dit » est une vitrine.
--
-- Ce que cette table N'EST PAS, et ne sera jamais :
--   · un registre de ce qui est réglé. `DOCTRINE-MIROIR.md` §3.3 pose un TEST DE
--     SCHÉMA : aucune colonne n'exprime un état de résolution — pas de
--     `is_resolved`, pas de `progress`, pas de `stage`, pas de `healed`, pas
--     d'enum de guérison. La contrainte `mtr_no_resolution_columns` ci-dessous
--     fait échouer toute migration future qui en ajouterait une.
--   · une note de l'app. `body` ne contient QUE les mots du rêveur.
--
-- Une lecture d'aujourd'hui rejoint le fil et sera citée dans les montages
-- suivants, à sa date. Elle ne clôt rien : le motif pourra revenir sans que
-- l'app fasse remarquer qu'il revient (§4.4).
--
-- Yeshua (Opus, G2), 2026-07-26. Voir RAPPORT-G2.md.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.mirror_thread_readings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  -- le fil auquel il répond : le MOT, pas un thème (cf. what-i-said.ts, décision ①)
  anchor_slug  text not null,
  anchor_label text not null,
  -- ses mots, entiers, jamais réécrits
  body         text not null check (length(btrim(body)) > 0),
  -- les lectures qu'il avait sous les yeux en écrivant — traçabilité (§1.5)
  cited_layer_ids uuid[] not null default '{}',
  created_at   timestamptz not null default now()
);

create index if not exists mirror_thread_readings_user_anchor_idx
  on public.mirror_thread_readings (user_id, anchor_slug, created_at desc);

alter table public.mirror_thread_readings enable row level security;

-- RLS SANS GRANT = lectures qui échouent EN SILENCE (incident schéma `community`,
-- 2026-07-25). On n'oublie plus le grant.
grant select, insert, delete on public.mirror_thread_readings to authenticated;

drop policy if exists mtr_select_own on public.mirror_thread_readings;
create policy mtr_select_own on public.mirror_thread_readings
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists mtr_insert_own on public.mirror_thread_readings;
create policy mtr_insert_own on public.mirror_thread_readings
  for insert to authenticated with check (auth.uid() = user_id);

-- Il peut retirer une lecture qu'il a posée. Aucune trace, aucune question.
drop policy if exists mtr_delete_own on public.mirror_thread_readings;
create policy mtr_delete_own on public.mirror_thread_readings
  for delete to authenticated using (auth.uid() = user_id);

-- ── LE TEST DE SCHÉMA DU §3.3, EXÉCUTABLE ──────────────────────────────────
-- Échoue si quelqu'un ajoute un jour une colonne d'état de résolution.
-- À rejouer dans la suite de tests : `select public.mirror_assert_no_resolution_columns();`
create or replace function public.mirror_assert_no_resolution_columns()
returns void language plpgsql as $$
declare offending text;
begin
  select string_agg(column_name, ', ') into offending
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'mirror_thread_readings'
    and (
      column_name ~* '(resolved|resolution|progress|stage|healed|healing|phase|closed|done|overcome|depasse)'
    );
  if offending is not null then
    raise exception
      'DOCTRINE-MIROIR §3.3 — le miroir ne tient pas le registre de ce qui est réglé. Colonnes interdites : %',
      offending;
  end if;
end $$;

select public.mirror_assert_no_resolution_columns();
