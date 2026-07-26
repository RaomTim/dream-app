-- 2026-07-22 — OFFLINE-FIRST : IDEMPOTENCE DES DÉPÔTS (chantier C, « ABSOLUMENT » Tim)
--
-- La file d'attente offline (src/lib/offline-queue.ts) peut ré-émettre un dépôt après
-- une reconnexion (ex. le POST /api/kairos a réussi côté serveur mais la réponse s'est
-- perdue avant que le client persiste l'id). Pour ne JAMAIS créer de doublon, le client
-- attache un `client_dedup_id` (uuid généré à la capture) et le serveur, s'il retrouve
-- déjà un kairos avec ce couple (user_id, client_dedup_id), renvoie l'existant.
--
-- Rétrocompatible : colonne nullable, aucun backfill. Les dépôts en ligne classiques
-- (flux happy-path) n'envoient pas de client_dedup_id → colonne NULL, zéro impact.
-- L'index UNIQUE partiel garantit l'unicité PAR RÊVEUR sans gêner les NULL.
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260722184014_kairos_client_dedup_offline_first`
--          (vérifiée 2026-07-26, flotte A5 — colonne + index uniques présents).
--          Entête corrigée : elle disait « NON appliquée », c'était faux.

alter table public.kairos
  add column if not exists client_dedup_id text null;

-- Un même rêveur ne peut pas avoir deux kairos avec le même client_dedup_id.
create unique index if not exists kairos_user_client_dedup_uidx
  on public.kairos (user_id, client_dedup_id)
  where client_dedup_id is not null;

comment on column public.kairos.client_dedup_id is
  'Clé d''idempotence offline-first (§0.3/§10 A3). Fournie par la file d''attente locale pour dé-doubler un dépôt ré-émis à la reconnexion. NULL pour les dépôts en ligne classiques.';
