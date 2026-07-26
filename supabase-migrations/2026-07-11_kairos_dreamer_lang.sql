-- ════════════════════════════════════════════════════════════════════════════
-- 2026-07-11 · i18n — la langue du RÊVEUR, portée par le kairos
-- Yeshua (Opus). STATUT : APPLIQUÉE EN PROD. Migration trackée `20260711175607_kairos_dreamer_lang`
-- (vérifiée 2026-07-26, flotte A5 — colonne dreamer_lang existe sur kairos). Entête corrigée :
-- elle disait « ÉCRITE, NON APPLIQUÉE », c'était faux. Le câblage décrit ci-dessous (3 endroits)
-- est bien en place dans le code actuel (vérifié : dreamer_lang lu dans pipeline.ts/enrich-batch).
--
-- POURQUOI
-- L'app est désormais bilingue (FR/EN). Les 3 champs d'extraction qui finissent à
-- l'écran — title_poetic (→ kairos.title), dream_ask, warning_signal.what_insists —
-- doivent sortir dans la langue du RÊVEUR, pas dans celle de son texte.
--
-- Le chemin normal marche déjà sans SQL : POST /api/kairos lit le header
-- `X-Dream-Lang` et le passe au pipeline (waitUntil).
--
-- LE TROU QUE CETTE MIGRATION BOUCHE
-- Le cron `GET /api/mvp/enrich-batch` (filet de sécurité, toutes les 2 min) rattrape
-- les kairos dont le pipeline n'a pas fini (dépassement maxDuration, import, cold start).
-- Ce cron n'a AUCUN rêveur au bout du fil : pas de header, et la langue du rêveur
-- n'existe nulle part en base. Il enrichit donc en `fr`, toujours.
-- Conséquence réelle et actuelle : un rêveur anglophone dont le rêve tombe dans le
-- filet reçoit un titre français. Ce n'est pas un cas de bord théorique — l'import de
-- masse passe systématiquement par ce chemin.
--
-- LE FIX : on grave la langue sur le kairos au moment où il est écrit.
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.kairos
  ADD COLUMN IF NOT EXISTS dreamer_lang text
  CHECK (dreamer_lang IN ('fr', 'en'));

COMMENT ON COLUMN public.kairos.dreamer_lang IS
  'Langue de l''app du rêveur au moment où il a écrit ce kairos (header X-Dream-Lang). '
  'Pilote la langue de title_poetic / dream_ask / warning_signal.what_insists. '
  'NULL = écrit avant l''i18n → traité en fr. Jamais la langue du TEXTE (voir lang_detected).';

-- ── CÂBLAGE APRÈS APPLICATION (3 endroits, 3 lignes) ────────────────────────
-- 1. src/app/api/kairos/route.ts — à l'insert :
--        insertRow.dreamer_lang = reqLang(req)
--
-- 2. src/app/api/mvp/enrich-batch/route.ts — dans runBatch(), au select :
--        .select('id, user_id, dreamer_lang')
--    puis dans la boucle :
--        lang: asLang(k.dreamer_lang)
--    (et runBatch n'a plus besoin de son paramètre `lang` global)
--
-- 3. src/app/api/kairos/[id]/enrich-trigger/route.ts — idem : lire dreamer_lang
--    sur la ligne avant de lancer le pipeline, plutôt que de le recevoir en body.
--
-- Tant que ce n'est PAS appliqué, ne PAS ajouter dreamer_lang à un select ni à un
-- insert : la requête échouerait (colonne inconnue). Le code actuel ne la touche pas.
-- ────────────────────────────────────────────────────────────────────────────
