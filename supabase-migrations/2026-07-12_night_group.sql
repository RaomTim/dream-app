-- 2026-07-12 — PLUSIEURS RÊVES PAR NUIT (DREAM-MVP-SPEC-ECRANS-A-Z.md §12bis.D)
--
-- Modèle : un rêve = une entité (une ligne `kairos`). La nuit = un regroupement.
-- Quand l'écran « Ta nuit » (A4 multi) sépare N rêves, chacun devient un kairos
-- distinct portant le MÊME `night_group_id` (uuid) + le même `created_at` de nuit.
-- L'Atlas (déjà groupé par lunes) affiche alors un badge commun « la nuit du … »
-- dès que ≥2 kairos partagent un `night_group_id`.
--
-- Audio (§12bis.D) : PAS de découpe audio en MVP (trop lourd). L'audio complet de
-- la nuit reste porté par le PREMIER rêve du groupe — celui dont `capture_method`
-- vaut 'mvp_voice' (les autres : 'mvp_night_split'). La fiche des rêves suivants
-- retrouve ce premier via `night_group_id` pour offrir un lien « audio de la nuit ».
-- (NB : la persistance de l'audio vocal elle-même n'est pas encore câblée — voir
-- rapport ; cette colonne prépare le lien sans le bloquer.)
--
-- STATUT : APPLIQUÉE EN PROD. Migration trackée `20260711165310_kairos_night_group_multi_reves`
--    (vérifiée 2026-07-26, flotte A5 — colonne night_group_id existe sur kairos). Entête
--    corrigée : elle disait « NON appliquée », c'était faux. NB : le nom trackée porte un
--    horodatage 2026-07-11 alors que ce fichier est daté 2026-07-12 — écart mineur, probablement
--    la migration a été écrite le 11 tard et appliquée/renommée le 12, ou fuseau horaire.
-- Rétrocompatible : colonne nullable, aucun backfill, zéro impact sur l'existant
-- (les rêves isolés — ~90 % des nuits — gardent night_group_id = NULL).

alter table public.kairos
  add column if not exists night_group_id uuid null;

-- Lecture groupée rapide : retrouver les rêves d'une même nuit (Atlas + « audio de la nuit »).
create index if not exists kairos_night_group_id_idx
  on public.kairos (night_group_id)
  where night_group_id is not null;

comment on column public.kairos.night_group_id is
  'Regroupe les rêves séparés d''une même nuit (§12bis.D). NULL = rêve isolé (cas courant). Le 1er rêve du groupe (capture_method = mvp_voice) porte l''audio de la nuit.';
