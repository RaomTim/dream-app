-- ════════════════════════════════════════════════════════════════════════════
-- Migration : deletion_requests
-- Écran Réglages → Mes données → « Supprimer mon compte » (SPEC §8 R1)
--
-- On NE supprime jamais immédiatement. On enregistre une DEMANDE avec un délai
-- de sept jours (fiche « Tes données »). L'utilisateur peut annuler pendant ce
-- délai. Un job/cron serveur (hors périmètre de cette migration) exécutera
-- l'effacement réel des demandes 'pending' dont scheduled_for est dépassé.
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260711011540_deletion_requests_7_jours`
--          (vérifiée 2026-07-26, flotte A5 — table deletion_requests existe).
--          Entête corrigée : elle disait « NON appliquée », c'était faux. À vérifier
--          séparément (hors périmètre A5) si POST /api/user/delete-request répond
--          toujours 503 par défensivité alors que la table existe désormais.
--
-- Yeshua (Opus), 2026-07-11.
-- ════════════════════════════════════════════════════════════════════════════

create table if not exists public.deletion_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null unique,
  requested_at  timestamptz not null default now(),
  scheduled_for timestamptz not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'cancelled', 'done')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists deletion_requests_status_due_idx
  on public.deletion_requests (status, scheduled_for);

-- RLS : le serveur agit en service_role (bypass RLS). On active RLS et on
-- n'ajoute AUCUNE policy pour les rôles anon/authenticated → l'accès direct
-- client est fermé par défaut ; seules les routes serveur (service_role)
-- écrivent ici. Cohérent avec le durcissement RLS 2026-05-21.
alter table public.deletion_requests enable row level security;

-- touch updated_at
create or replace function public.touch_deletion_requests_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_deletion_requests_updated_at on public.deletion_requests;
create trigger trg_deletion_requests_updated_at
  before update on public.deletion_requests
  for each row execute function public.touch_deletion_requests_updated_at();
