-- ────────────────────────────────────────────────────────────────────────────
-- Migration : Big Dreams Workflow + Mode Rêve Récurrent (Re-entry Aizenstat)
-- Date      : 2026-04-29
-- Auteur    : Yeshua, agent code 1M
-- Specs     :
--   - 4_LOG.md entrée 2026-04-29 (Feature 3 — Big Dreams Workflow + Push humain)
--   - 4_LOG.md entrée 2026-04-29 (Feature 4 — Mode rêve récurrent + Re-entry)
--
-- Crée 4 tables nouvelles + RLS owner-only + indexes.
-- Aucune mutation sur tables existantes (zéro breaking change).
-- Réutilise lucid_re_entry_sessions (déjà existante depuis Lucid V1).
-- ────────────────────────────────────────────────────────────────────────────

-- ════════════════════════════════════════════════════════════════════════════
-- §1 — Big Dreams Workflow (3 tables)
-- ════════════════════════════════════════════════════════════════════════════

-- ── bigdream_workflows ─────────────────────────────────────────────────────
-- Tient un Big Dream sur 7 jours (1 rituel par jour). Une seule instance vivante
-- par (user, kairos). Une instance close peut être archivée.
CREATE TABLE IF NOT EXISTS bigdream_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kairos_id uuid NOT NULL REFERENCES kairos(id) ON DELETE CASCADE,

  started_at timestamptz NOT NULL DEFAULT now(),
  closed_at timestamptz,
  current_day int DEFAULT 1 CHECK (current_day BETWEEN 1 AND 7),

  closing_letter text,
  closing_letter_generated_at timestamptz,

  archived_at timestamptz,

  UNIQUE(user_id, kairos_id)
);

CREATE INDEX IF NOT EXISTS idx_bigdream_workflows_user_open
  ON bigdream_workflows(user_id, started_at DESC)
  WHERE closed_at IS NULL AND archived_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_bigdream_workflows_kairos
  ON bigdream_workflows(kairos_id);

-- ── bigdream_workflow_steps ────────────────────────────────────────────────
-- Une ligne par jour J1..J7. PK composite (workflow_id, day).
CREATE TABLE IF NOT EXISTS bigdream_workflow_steps (
  workflow_id uuid NOT NULL REFERENCES bigdream_workflows(id) ON DELETE CASCADE,
  day int NOT NULL CHECK (day BETWEEN 1 AND 7),
  step_kind text NOT NULL CHECK (step_kind IN (
    'silence',
    'image_or_drawing',
    'dialogue_personnage',
    'polyphonie_3_voix',
    'correlations_foret',
    'oracle_corps',
    'letter_to_self'
  )),
  completed_at timestamptz,
  user_capture text,
  user_capture_voice boolean DEFAULT false,
  PRIMARY KEY (workflow_id, day)
);

CREATE INDEX IF NOT EXISTS idx_bigdream_workflow_steps_completed
  ON bigdream_workflow_steps(workflow_id)
  WHERE completed_at IS NOT NULL;

-- ── bigdream_human_pushes ──────────────────────────────────────────────────
-- Push payant vers un praticien humain (MVP : Stripe stub, vraie intégration plus tard).
CREATE TABLE IF NOT EXISTS bigdream_human_pushes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES bigdream_workflows(id) ON DELETE SET NULL,
  kairos_id uuid REFERENCES kairos(id) ON DELETE SET NULL,
  praticien_id uuid REFERENCES auth.users(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'delivered', 'refunded')),
  amount_eur numeric(8, 2) DEFAULT 30.00,
  stripe_payment_intent_id text,
  user_request_text text,
  praticien_response_text text,
  requested_at timestamptz DEFAULT now(),
  delivered_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_bigdream_human_pushes_user_status
  ON bigdream_human_pushes(user_id, status, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_bigdream_human_pushes_praticien
  ON bigdream_human_pushes(praticien_id, status)
  WHERE praticien_id IS NOT NULL;

-- ════════════════════════════════════════════════════════════════════════════
-- §2 — Recurring Dream Patterns (Mode rêve récurrent — Aizenstat)
-- ════════════════════════════════════════════════════════════════════════════

-- ── recurring_dream_patterns ───────────────────────────────────────────────
-- Détecté par scan kairos sur 60j : motif/figure/lieu/situation revenu ≥5 fois.
CREATE TABLE IF NOT EXISTS recurring_dream_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  pattern_text text NOT NULL,
  pattern_kind text CHECK (pattern_kind IN ('motif', 'figure', 'lieu', 'situation')),

  first_seen_at timestamptz NOT NULL,
  last_seen_at timestamptz NOT NULL,
  count_total int NOT NULL,
  valence_avg real,
  kairos_ids uuid[] DEFAULT '{}',

  -- valence_avg < -0.6 → trauma_flag = true → re-route Sanctuaire (PAS Re-entry)
  trauma_flag boolean DEFAULT false,

  acknowledged_at timestamptz,   -- user a accepté la proposition
  archived_at timestamptz,

  UNIQUE(user_id, pattern_text, pattern_kind)
);

CREATE INDEX IF NOT EXISTS idx_recurring_dream_patterns_user
  ON recurring_dream_patterns(user_id, last_seen_at DESC)
  WHERE archived_at IS NULL;

-- ════════════════════════════════════════════════════════════════════════════
-- §3 — RLS — owner-only (cohérent §13.3 global Dream)
-- ════════════════════════════════════════════════════════════════════════════

ALTER TABLE bigdream_workflows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bigdream_workflows_self ON bigdream_workflows;
CREATE POLICY bigdream_workflows_self ON bigdream_workflows
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

ALTER TABLE bigdream_workflow_steps ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bigdream_workflow_steps_self ON bigdream_workflow_steps;
-- Les steps héritent l'ownership du workflow parent.
CREATE POLICY bigdream_workflow_steps_self ON bigdream_workflow_steps
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bigdream_workflows w
      WHERE w.id = bigdream_workflow_steps.workflow_id
        AND w.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bigdream_workflows w
      WHERE w.id = bigdream_workflow_steps.workflow_id
        AND w.user_id = auth.uid()
    )
  );

ALTER TABLE bigdream_human_pushes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bigdream_human_pushes_self ON bigdream_human_pushes;
-- L'user voit ses propres pushes ; le praticien voit ceux qui lui sont assignés.
CREATE POLICY bigdream_human_pushes_self ON bigdream_human_pushes
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = praticien_id);

DROP POLICY IF EXISTS bigdream_human_pushes_user_write ON bigdream_human_pushes;
CREATE POLICY bigdream_human_pushes_user_write ON bigdream_human_pushes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS bigdream_human_pushes_praticien_update ON bigdream_human_pushes;
CREATE POLICY bigdream_human_pushes_praticien_update ON bigdream_human_pushes
  FOR UPDATE TO authenticated
  USING (auth.uid() = praticien_id)
  WITH CHECK (auth.uid() = praticien_id);

ALTER TABLE recurring_dream_patterns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS recurring_dream_patterns_self ON recurring_dream_patterns;
CREATE POLICY recurring_dream_patterns_self ON recurring_dream_patterns
  FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
