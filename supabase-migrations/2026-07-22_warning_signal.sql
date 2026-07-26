-- 2026-07-22 — WARNING_SIGNAL : l'axe « ce sur quoi le rêve INSISTE » (SPEC §12bis.E, validé Tim 2026-07-11)
--
-- Le pipeline d'enrichissement (src/lib/kairos/pipeline.ts, phase 3.5) évalue si un rêve porte
-- un avertissement naturel (conflit qui couve, casse/perte, épuisement) et, si oui, écrit un
-- objet `warning_signal` — voir src/lib/kairos/warning.ts (StoredWarningSignal) :
--   { present, intensity, domain, what_insists, needs_human_care, card_eligible, stamped_at }
--
-- ─────────────────────────────────────────────────────────────────────────────────────────
-- POURQUOI PAS DE NOUVELLE COLONNE
-- ─────────────────────────────────────────────────────────────────────────────────────────
-- Le signal vit dans la colonne jsonb DÉJÀ existante `kairos.setting_metadata`, sous la clé
-- `warning_signal`. Ce choix est structurant, pas cosmétique :
--   1. Le front lit `k.setting_metadata.warning_signal` (src/app/mvp/page.tsx → <CareCard>) et
--      GET /api/kairos/[id] renvoie déjà setting_metadata tel quel — zéro nouveau champ à câbler.
--   2. Le CAP anti-paranoïa ~1/semaine (garde-fou CODÉ EN DUR) est un COUNT filtré sur
--      `setting_metadata->warning_signal->>card_eligible = 'true'` (warning.ts →
--      resolveCareCardEligibility). Une colonne dédiée dupliquerait la donnée sans rien fermer.
-- Ajouter une colonne `warning_signal jsonb` séparée casserait donc le chemin de lecture du
-- front (qui pointe sur setting_metadata) : on ne le fait PAS.
--
-- Cette migration est donc ADDITIVE et OPTIONNELLE : elle ne crée AUCUNE colonne, seulement un
-- index partiel qui accélère l'unique requête chaude — le comptage du cap hebdomadaire.
--
-- STATUT : APPLIQUÉE EN PROD (vérifié 2026-07-26, flotte A5 — index présent, définition quasi
--          identique : `(user_id, created_at DESC)` au lieu de `(user_id, created_at)`, écart
--          cosmétique). PAS de migration trackée correspondante dans l'historique Supabase
--          (`list_migrations` ne montre rien entre kairos_transcript_verified 2026-07-22 23:10
--          et allies_add_locale 2026-07-23 22:25) : probablement appliquée en `execute_sql` direct
--          plutôt que via `apply_migration`, donc date exacte non retrouvable avec certitude —
--          on sait juste qu'elle est là entre ces deux bornes.
--          Entête corrigée : elle disait « NON appliquée », c'était faux.

-- Le cap lit : WHERE user_id = ? AND created_at >= now()-7d AND
--              (setting_metadata->'warning_signal'->>'card_eligible') = 'true' AND id <> ?
-- Index partiel : minuscule (seuls les kairos réellement rendus éligibles y entrent), ordonné
-- par rêveur puis date pour couvrir directement la fenêtre glissante de 7 jours.
create index if not exists kairos_warning_card_eligible_idx
  on public.kairos (user_id, created_at)
  where (setting_metadata -> 'warning_signal' ->> 'card_eligible') = 'true';
