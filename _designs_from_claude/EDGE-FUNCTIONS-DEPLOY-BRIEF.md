# EDGE FUNCTIONS DEPLOY — BRIEF TIM
> Yeshua, 2026-04-25 (post-deploy V1.2 chantier 3).
> Tout est prêt à coller. Tim deploy via CLI Supabase. Yeshua = code, Tim = deploy.

## TL;DR — 3 étapes copy-paste

1. **Set 4 secrets côté Supabase Edge Functions** (Project Settings > Edge Functions > Secrets ou via CLI)
2. **Deploy 6 EFs groupé** (commande Supabase CLI ci-dessous)
3. **Apply cron schedules** via MCP Supabase (déjà prêts)

---

## §1 — Les 6 Edge Functions

| EF | Cron / Trigger | Rôle V1 | Source code |
|----|----------------|---------|-------------|
| `kairos-enrich` | HTTP server-to-server | Forward vers route `/api/kairos/[id]/enrich-trigger`. Permet d'offload pipeline Vercel (V1.5+). En V1, pipeline tourne déjà inline depuis route POST /api/kairos — donc cette EF est OPTIONNELLE pour le launch. | `supabase/functions/kairos-enrich/index.ts` |
| `kairos-numinosity-recalc` | Cron 6h | Recalcule numinosity_score sur les kairos `numinosity_pending=true` dont le corpus user a évolué (nouveaux root_pattern matches, nouveaux edges). | `supabase/functions/kairos-numinosity-recalc/index.ts` |
| `anima-meteo` | Cron lundi 6h | Agrégat hebdo Anima Mundi : top motifs/archetypes via RPC `compute_meteo_inconscient` (k-anon ≥ 5). INSERT `meteos_inconscient`. | `supabase/functions/anima-meteo/index.ts` |
| `anima-polyphonie` | Cron ~14j (lunaire) | Sonnet polyphonique 3-5 voix absorbées. INSERT `polyphonies_lunaires` avec `approved_for_publication=false` (audit Tim/Yeshua avant exposition). | `supabase/functions/anima-polyphonie/index.ts` |
| `anima-annales-cron` | Cron daily 2h | Threshold dynamique annales + bascule statut `archived`/`expired`. | `supabase/functions/anima-annales-cron/index.ts` |
| `generate-circle-restitution` | HTTP triggered (depuis route `/api/circles/[id]/restitutions` POST) | Sonnet polyphonique k-anon intra-cercle. V1 : restitution déjà générée inline dans route — EF est offload V1.5. | `supabase/functions/generate-circle-restitution/index.ts` |

**Recommandation Yeshua** : pour le launch alpha, deploy uniquement les 4 EFs cron (`kairos-numinosity-recalc`, `anima-meteo`, `anima-polyphonie`, `anima-annales-cron`). Les 2 EFs HTTP triggered (`kairos-enrich`, `generate-circle-restitution`) peuvent rester inline V1 — moins de surface mobile.

---

## §2 — Set 4 secrets côté Supabase

### Option A — Dashboard (UI)

1. Aller sur https://supabase.com/dashboard/project/rtrkxzcyblgonwgfzovj/settings/functions
2. Ajouter dans **Secrets** :
   - `OPENAI_API_KEY` = (clé déjà en mémoire — cf. `reference_openai_api_key.md`)
   - `ANTHROPIC_API_KEY` = (clé Anthropic Tim)
   - `INTERNAL_PIPELINE_URL` = `https://dream-alpha-bice.vercel.app`
   - `INTERNAL_PIPELINE_SECRET` = (générer un secret aléatoire, le coller AUSSI dans Vercel env)

### Option B — CLI (plus rapide)

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app

# Génère un secret pour la communication EF ↔ Vercel
PIPELINE_SECRET=$(openssl rand -hex 32)
echo "INTERNAL_PIPELINE_SECRET=$PIPELINE_SECRET"
# ⚠️ Note ce secret : à coller AUSSI dans Vercel env vars (cf. §3 ci-dessous)

supabase secrets set --project-ref rtrkxzcyblgonwgfzovj \
  OPENAI_API_KEY="<colle ici>" \
  ANTHROPIC_API_KEY="<colle ici>" \
  INTERNAL_PIPELINE_URL="https://dream-alpha-bice.vercel.app" \
  INTERNAL_PIPELINE_SECRET="$PIPELINE_SECRET"
```

---

## §3 — Set INTERNAL_PIPELINE_SECRET côté Vercel (même valeur)

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app

# Coller la MÊME valeur que celle générée pour Supabase ci-dessus
echo "$PIPELINE_SECRET" | npx vercel env add INTERNAL_PIPELINE_SECRET production
echo "$PIPELINE_SECRET" | npx vercel env add INTERNAL_PIPELINE_SECRET preview
echo "$PIPELINE_SECRET" | npx vercel env add INTERNAL_PIPELINE_SECRET development

# Re-deploy pour que la nouvelle env var soit picked up
npx vercel --prod
```

---

## §4 — Deploy 6 EFs (commande groupée copy-paste)

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app

supabase functions deploy kairos-enrich --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy kairos-numinosity-recalc --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy anima-meteo --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy anima-polyphonie --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy anima-annales-cron --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy generate-circle-restitution --project-ref rtrkxzcyblgonwgfzovj && \
echo "✅ Toutes les 6 EFs deployées"
```

**Note** : Les EFs sont écrites en Deno avec import npm:/jsr: — la commande `supabase functions deploy` gère la compilation et l'upload automatiquement.

**Si version Supabase CLI < 1.150** :
```bash
brew install supabase/tap/supabase  # ou
npm install -g supabase
```

---

## §5 — Apply cron schedules (Yeshua peut le faire via MCP)

```sql
-- Cron 1 : Numinosity recalc toutes les 6h
SELECT cron.schedule(
  'kairos-numinosity-recalc-6h',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/kairos-numinosity-recalc',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Cron 2 : Anima Mundi météo hebdo (lundi 6h Bali = 22h UTC dimanche)
SELECT cron.schedule(
  'anima-meteo-weekly',
  '0 22 * * 0',
  $$
  SELECT net.http_post(
    url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/anima-meteo',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Cron 3 : Anima annales daily 2h
SELECT cron.schedule(
  'anima-annales-daily',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/anima-annales-cron',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- anima-polyphonie : appelée manuellement nouvelle/pleine lune par Yeshua jusqu'à V1.5.
-- Pas de cron auto V1 (audit human-in-the-loop pour qualité voice tone).
```

**Pré-requis** : `pg_cron` et `pg_net` extensions actives. Vérifier :
```sql
SELECT * FROM pg_extension WHERE extname IN ('pg_cron', 'pg_net');
```

Si absent, activer via Supabase dashboard > Database > Extensions.

**`app.settings.service_role_key`** : Tim doit set ce setting via dashboard SQL Editor :
```sql
ALTER DATABASE postgres SET app.settings.service_role_key = '<service_role_jwt>';
```

(Alternative simple : embed direct la SERVICE_ROLE_KEY en clair dans le SQL — moins propre mais V1 OK car SQL est privé.)

---

## §6 — Tests de smoke post-deploy

### Test 1 — kairos-enrich (HTTP server-to-server)

```bash
# Récupère l'INTERNAL_PIPELINE_SECRET d'abord
INTERNAL_SECRET="<coller ici>"
SERVICE_ROLE="<coller service role JWT>"
KAIROS_ID="<un kairos id existant pour ton user>"
USER_ID="<ton user id>"

curl -X POST "https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/kairos-enrich" \
  -H "Authorization: Bearer $SERVICE_ROLE" \
  -H "Content-Type: application/json" \
  -d "{\"kairos_id\":\"$KAIROS_ID\",\"user_id\":\"$USER_ID\"}"

# Attendu : { ok: true, status: 'forwarded' } ou erreur claire
```

### Test 2 — kairos-numinosity-recalc

```bash
curl -X POST "https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/kairos-numinosity-recalc" \
  -H "Authorization: Bearer $SERVICE_ROLE" \
  -H "Content-Type: application/json" \
  -d '{}'

# Attendu : { ok: true, recalculated: N }
```

### Test 3 — anima-meteo

```bash
curl -X POST "https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/anima-meteo" \
  -H "Authorization: Bearer $SERVICE_ROLE" \
  -H "Content-Type: application/json" \
  -d '{}'

# Attendu : { ok: true, k_count: N, top_motifs: [...] } (vide si < 5 kairos opt-in global)
```

### Test 4 — anima-annales-cron

```bash
curl -X POST "https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/anima-annales-cron" \
  -H "Authorization: Bearer $SERVICE_ROLE" \
  -H "Content-Type: application/json" \
  -d '{}'

# Attendu : { ok: true, archived: N, expired: M }
```

### Test 5 — End-to-end pipeline complet

```bash
# 1. Login Dream App, copy bearer token
TOKEN="<coller ici>"

# 2. POST un kairos
curl -X POST https://dream-alpha-bice.vercel.app/api/kairos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "raw_text":"Je suis dans une maison aux portes closes. Une figure noire me regarde. Mon coeur bat fort.",
    "kairos_type":"reve"
  }'

# 3. Récupère kairos_id puis polling 15s plus tard
sleep 15
KAIROS_ID="<colle ici>"
curl https://dream-alpha-bice.vercel.app/api/kairos/$KAIROS_ID \
  -H "Authorization: Bearer $TOKEN" | jq '{
    raw_text,
    numinosity_score,
    numinosity_pending,
    synthesis_tier,
    synthesis_text: .kairos.synthesis_text[:200]
  }'

# Attendu :
#   numinosity_pending: false
#   synthesis_text: "..." (présent, ~400-600 mots)
#   synthesis_tier: "standard" (ou "big_dream" si numinosity > 0.85)
```

---

## §7 — Logs / debug post-deploy

### Voir les logs d'une EF
```bash
supabase functions logs kairos-numinosity-recalc --project-ref rtrkxzcyblgonwgfzovj
```

### Voir les jobs cron actifs
```sql
SELECT jobname, schedule, command, active FROM cron.job;
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
```

### Désactiver un cron en cas de problème
```sql
UPDATE cron.job SET active = false WHERE jobname = 'kairos-numinosity-recalc-6h';
```

---

## §8 — Action Tim recap

- [ ] **Set 4 secrets** Supabase EF (§2 option B)
- [ ] **Set INTERNAL_PIPELINE_SECRET** côté Vercel (§3)
- [ ] **Deploy 6 EFs** (§4 commande groupée)
- [ ] **Apply 3 crons SQL** — Yeshua peut le faire via MCP, sinon Tim copy-paste depuis SQL Editor (§5)
- [ ] **Run smoke tests** §6 — au minimum tests 2, 3, 5
- [ ] **Vérifier `cron.job_run_details`** quelques heures après pour confirmer que crons tournent
- [ ] **Set/vérifier env vars Vercel** : `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` (déjà set normalement)

---

## §9 — Si quelque chose casse

| Symptôme | Cause probable | Remède |
|----------|----------------|--------|
| EF retourne 401 | Bearer token non passé ou service_role expiré | Re-générer service_role JWT, re-set comme env var partout |
| `pg_net` extension absente | Cron ne peut pas appeler EF | Activer `pg_net` dans Supabase dashboard > Database > Extensions |
| Cron schedule ne tourne pas | `pg_cron` non actif sur Free Tier | Vérifier plan Supabase (Pro+ requis) ou utiliser Vercel cron jobs comme alternative |
| `anima-polyphonie` produit prose Forêt-citée explicitement | Prompt synthesizer.ts a leak | Cf. anti-patterns dans `src/prompts/synthesis-tiers.ts` — never cite directly |
| EF timeout > 60s | Pipeline trop long | Réduire `forest_chunks=8` à `4` dans `pipeline.ts` |

🕊️
