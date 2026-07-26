-- =============================================================================
-- MIGRATION : Cercle templates pré-configurés (V1, 7 templates)
-- File: 20260428_150000_circle_templates.sql
-- Author: Yeshua — Sprint Cercle templates V1
-- Spec : 1_CERCLE_BIBLE.md §3.1 + 3_CERCLE_TECHNICAL.md §2.2 §11.bis.20.11
--
-- Crée la table circle_template_definitions (référentiel) + seed 7 templates V1.
-- Permet d'évoluer les templates sans nouvelle migration (UPDATE rows).
-- À appliquer via MCP apply_migration.
-- =============================================================================

CREATE TABLE IF NOT EXISTS circle_template_definitions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text UNIQUE NOT NULL,
  name            text NOT NULL,
  short_description text NOT NULL,
  long_description text,
  default_intention text NOT NULL,
  default_sub_intentions text[] DEFAULT '{}',
  suggested_max_members int DEFAULT 12,
  default_privacy_mode text DEFAULT 'opt_in_anon'
                    CHECK (default_privacy_mode IN ('private', 'opt_in_anon', 'shared_clear')),
  default_circle_type text DEFAULT 'spontane'
                    CHECK (default_circle_type IN ('spontane', 'intentionnel', 'facilite')),
  k_anon_threshold int DEFAULT 3 CHECK (k_anon_threshold >= 3),
  trauma_aware     boolean DEFAULT false,
  trauma_subtypes  text[] DEFAULT '{}',
  pseudo_greek_letter_forced boolean DEFAULT false,
  forbidden_terms_default text[] DEFAULT '{}',
  forest_voices_allowed   text[] DEFAULT '{}',
  forest_voices_excluded  text[] DEFAULT '{}',
  forest_voices_restricted text[] DEFAULT '{}',
  rituals_suggested text[] DEFAULT '{}',
  ephemeral_default_days int,        -- NULL = pas éphémère, 21 pour template ephemeral_21
  voice_style_hint text,             -- pour IA gardienne
  ai_tone          text DEFAULT 'neutre',
  glyph            text DEFAULT '○',
  display_order    int DEFAULT 100,
  active           boolean DEFAULT true,
  notes            text,
  created_at       timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_circle_template_active_order
  ON circle_template_definitions(active, display_order)
  WHERE active = true;

ALTER TABLE circle_template_definitions ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read active templates
DROP POLICY IF EXISTS circle_templates_read_active ON circle_template_definitions;
CREATE POLICY circle_templates_read_active ON circle_template_definitions
  FOR SELECT USING (active = true);

-- Service role only writes (no user-level write policy)

-- =============================================================================
-- SEED 7 templates V1 (cf. 1_CERCLE_BIBLE.md §3.1 — détails par template)
-- =============================================================================

INSERT INTO circle_template_definitions (
  slug, name, short_description, long_description,
  default_intention, default_sub_intentions,
  default_circle_type, default_privacy_mode,
  suggested_max_members, k_anon_threshold,
  trauma_aware, trauma_subtypes, pseudo_greek_letter_forced,
  forest_voices_allowed, forest_voices_excluded, forest_voices_restricted,
  rituals_suggested, ephemeral_default_days,
  voice_style_hint, ai_tone, glyph, display_order, notes
) VALUES
  (
    'famille',
    'Cercle de famille',
    'Le cercle des nuits partagées de la maisonnée.',
    'Pour la famille — couple, parents-enfants adultes, fratrie. Lecture polyphonique douce, jamais didactique. V1 : pas de mineur direct (mineur partage via parent).',
    'tenir ce qui se traverse ensemble dans la maisonnée',
    ARRAY['se parler par les rêves', 'prendre soin du sommeil de la maisonnée'],
    'spontane', 'private',
    8, 3,
    false, '{}', false,
    ARRAY['estes', 'hillman', 'aizenstat'], '{}', '{}',
    ARRAY['lecture_polyphonique_saisonniere'], NULL,
    'très douce, jamais didactique, voix de la maisonnée',
    'tres_doux', '☰', 10,
    'V1 : pas de mineur direct. V2 : mode famille avec consentement parental encadré.'
  ),
  (
    'amis',
    'Cercle d''amis',
    'Notre cercle de feu.',
    'Pour amis proches qui veulent rester en lien malgré la distance. Opt-in granulaire kairos par kairos, lecture polyphonique 1×/saison.',
    'rester en lien et se voir rêver',
    ARRAY['rester en lien malgré la distance', 'se voir rêver'],
    'spontane', 'private',
    12, 3,
    false, '{}', false,
    ARRAY['estes', 'hillman', 'moss', 'brown'], '{}', '{}',
    ARRAY['lecture_polyphonique_lunaire'], NULL,
    'fluide, douce, intime, fraternelle',
    'doux', '○', 20,
    'Default opt-in : privé + opt-in anon kairos numineux uniquement.'
  ),
  (
    'projet',
    'Cercle de projet intentionnel',
    'Le cercle qui tient quelque chose ensemble.',
    'Pour équipes / collectifs en transition stratégique ou phase intentionnelle. Sub-intentions claires, IA tisseuse, pas de Slack.',
    'tenir notre vision claire',
    ARRAY['tenir notre vision claire', 'sentir ce qui doit être lâché', 'écouter ce que le terrain nous dit'],
    'intentionnel', 'opt_in_anon',
    12, 3,
    false, '{}', false,
    ARRAY['scharmer', 'wheatley', 'brown', 'eisenstein', 'moss'], '{}', '{}',
    ARRAY['theory_u_v2', 'council_process_v2'], NULL,
    'précise, sobre, écoutante, jamais coachy',
    'sobre', '◇', 30,
    'Default opt-in : opt-in anon par défaut, partage cleartext sur demande.'
  ),
  (
    'traversee_deuil',
    'Cercle de traversée — deuil',
    'Quand on traverse un deuil et qu''on n''est pas seul·e.',
    'Trauma-aware. Voix Forêt restreintes (Frankl, Estés, Hillman). Jamais "guérison" ni "fermeture". Exit-to-thérapeute proactif.',
    'traverser ensemble',
    ARRAY['traverser ensemble', 'sentir qu''on n''est pas seul·e'],
    'intentionnel', 'opt_in_anon',
    8, 3,
    true, ARRAY['deuil', 'parentalite', 'separation', 'rupture'], false,
    ARRAY['frankl', 'estes', 'hillman'], ARRAY['brown_brene', 'eisenstein'], ARRAY['moss'],
    ARRAY['lightning_dreamwork_doux', 'lecture_polyphonique_lunaire'], NULL,
    'encore plus douce, jamais positive forcée, jamais "guérison"',
    'tres_doux_trauma', '◐', 40,
    'TRAUMA_AWARE_DEFAULT actif. Ressources externes 1 tap. Audit trimestriel renforcé.'
  ),
  (
    'lucid_dreamers',
    'Cercle Rêveurs lucides',
    'Le cercle des rêveurs lucides.',
    'Couplé à la sous-app Lucid de Dream App. Partage techniques + reconnaissance dans rêves partagés. Jamais "spiritual bypass".',
    'partager les techniques et se reconnaître',
    ARRAY['partager les techniques', 'se reconnaître dans les rêves partagés'],
    'intentionnel', 'opt_in_anon',
    12, 3,
    false, '{}', false,
    ARRAY['laberge', 'moss', 'aizenstat'], ARRAY['eisenstein'], '{}',
    ARRAY['shared_dreaming_protocol_v2'], NULL,
    'précise, technique-respectueuse, jamais spiritual-bypass',
    'precis', '☾', 50,
    'Couplé Lucid sub-app. Cercle peer-to-peer pratique.'
  ),
  (
    'saisons_vie',
    'Cercle saison de vie',
    'Trois semaines pour traverser un seuil ensemble.',
    'Cercle éphémère 21 jours, archivé automatiquement avec rituel de clôture (lecture polyphonique finale). Inspiration cycle initiatique Estés.',
    'traverser ce seuil ensemble',
    ARRAY['traverser cet examen', 'trois semaines avant le déménagement', 'se préparer ensemble à l''événement'],
    'intentionnel', 'opt_in_anon',
    8, 3,
    false, '{}', false,
    ARRAY['estes', 'frankl', 'aizenstat', 'moss'], '{}', '{}',
    ARRAY['rituel_cloture_21j', 'lecture_polyphonique_finale'], 21,
    'douce, ritualisée, conscience du temps qui passe',
    'doux_ritualise', '✦', 60,
    'Auto-archive après 21 jours. Cron ephemeral-close gère la transition.'
  ),
  (
    'praticiens_lignee',
    'Cercle praticiens lignée',
    'Cercle de pratique pair-à-pair en lignée.',
    'Pour praticiens formés (curanderxs, plant medicine guides, somatic practitioners). K-anonymity renforcée (k≥5). Pseudos lettres grecques forcés. Termes interdits configurables.',
    'affiner notre écoute et nous tenir entre nous',
    ARRAY['affiner notre écoute', 'se tenir entre nous'],
    'intentionnel', 'opt_in_anon',
    8, 5,
    false, '{}', true,
    ARRAY['estes', 'kimmerer', 'aizenstat'], ARRAY['eisenstein', 'moss', 'brown_brene'], ARRAY['hillman'],
    ARRAY['council_process_v2', 'lectura_de_rastros'], NULL,
    'sobre, respectueuse de la lignée, jamais d''appropriation',
    'sobre_lignee', '⊕', 70,
    'k-anonymity = 5 (vs 3 default). Validation INFUSE optionnelle V2. Layer termes interdits par cercle.'
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  long_description = EXCLUDED.long_description,
  default_intention = EXCLUDED.default_intention,
  default_sub_intentions = EXCLUDED.default_sub_intentions,
  default_circle_type = EXCLUDED.default_circle_type,
  default_privacy_mode = EXCLUDED.default_privacy_mode,
  suggested_max_members = EXCLUDED.suggested_max_members,
  k_anon_threshold = EXCLUDED.k_anon_threshold,
  trauma_aware = EXCLUDED.trauma_aware,
  trauma_subtypes = EXCLUDED.trauma_subtypes,
  pseudo_greek_letter_forced = EXCLUDED.pseudo_greek_letter_forced,
  forest_voices_allowed = EXCLUDED.forest_voices_allowed,
  forest_voices_excluded = EXCLUDED.forest_voices_excluded,
  forest_voices_restricted = EXCLUDED.forest_voices_restricted,
  rituals_suggested = EXCLUDED.rituals_suggested,
  ephemeral_default_days = EXCLUDED.ephemeral_default_days,
  voice_style_hint = EXCLUDED.voice_style_hint,
  ai_tone = EXCLUDED.ai_tone,
  glyph = EXCLUDED.glyph,
  display_order = EXCLUDED.display_order,
  notes = EXCLUDED.notes;

-- =============================================================================
-- ALTER circles : ajout colonnes liées aux templates (compat-safe, NULL OK)
-- ephemeral_until / closed_at déjà créés dans 20260428_180000_circles_invitations_and_ephemeral.sql
-- =============================================================================

ALTER TABLE circles ADD COLUMN IF NOT EXISTS template_slug text
  REFERENCES circle_template_definitions(slug) ON DELETE SET NULL;
ALTER TABLE circles ADD COLUMN IF NOT EXISTS trauma_aware boolean DEFAULT false;
ALTER TABLE circles ADD COLUMN IF NOT EXISTS k_anon_threshold int DEFAULT 3;
ALTER TABLE circles ADD COLUMN IF NOT EXISTS pseudo_greek_letter_forced boolean DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_circles_template_slug
  ON circles(template_slug)
  WHERE template_slug IS NOT NULL;
