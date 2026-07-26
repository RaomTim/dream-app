# CÂBLAGE BACKEND DREAM APP — RAPPORT 2026-04-25

> Auteur : Yeshua, mode autonome non-stop, 2026-04-25 après-midi/soir Bali.
> Étape 4 du chantier mega refonte (post Étape 2 V1.2 design + Quick Wins matin).
> Mode validé Tim : "à fond non-stop, pas d'interruption sauf bloquant majeur".

---

## TL;DR — VICTOIRE CONDITIONNELLE

**Objectif posé en entrée** : "en sortie de cet agent, Dream App backend doit pouvoir traiter un kairos déposé end-to-end (POST → enrichissement IA → patterns détectés → numinosity → return enriched)."

**Statut** : `full_green` côté code + migrations DB. Pipeline end-to-end câblé et type-safe (0 erreurs TypeScript). Reste à valider en runtime quand Tim fera un test manuel + Edge Functions deploy.

**Couverture spec V1.2 backend** : ~90% des chantiers 1+2+3+4+7 et schemas 5+6 livrés. Chantiers 5 (Cercle UI logic) et 6 (Anima Mundi cron+EF) ont leurs **schemas + RPCs + EF stubs** prêts mais nécessitent deploy EF Tim pour activation runtime.

---

## §1 — Migrations SQL appliquées via MCP (5 nouvelles)

| Version | Nom | Statut | Contenu |
|---|---|---|---|
| 20260425_kairos_rpcs_v1 | RPCs moteur résonance | ✅ applied | 8 RPCs : echoes_multilayer, inverse_mirrors, cycles, prophetic, inner_outer, somatic_recurrence, get_constellation_graph, list_kairos_numinous + helper `_combine_kairos_score` |
| 20260425_circles_v1_extended | Cercles V1 | ✅ applied | ALTER circles + circle_members + 4 nouvelles tables (kairos_circle_optin, kairos_circle_shared, circle_restitutions, circle_restitution_reactions) + RLS surgical (user::uuid cast pour legacy text) + RPCs request_circle_restitution + get_circle_patterns (k-anon dynamique D3 Tim) |
| 20260425_anima_mundi_v1_schemas | Anima Mundi V1 | ✅ applied | 7 tables (kairos_global_optin granulaire 3 niveaux, annales_circulation, annales_tenir, polyphonies_lunaires, meteos_inconscient, polarites_lunaires, initiations_collectives) + RLS lecture publique + RPC compute_meteo_inconscient (k-anon ≥ 5 D3 Tim) |
| 20260425_user_meaning_layer_v1 | Couche apprentissage | ✅ applied | 6 tables (user_meaning_layer, user_validations, kairos_user_annotations, circle_meaning_layer, global_meaning_clusters, user_skips) + trigger updated_at |
| 20260425_kairos_synthesis_columns | Synthesis columns | ✅ applied | ALTER kairos ADD synthesis_text/tier/voices/generated_at + forest_sources + user_marked_numinous |

**Total tables Dream App V1** : 16 (incluant kairos+kairos_edges+soul_seasons+dream_app_feedback déjà appliquées par Quick Wins matin) + 4 legacy (circles/circle_members/circle_sessions/circle_shares).

**Stubs SQL traçabilité** copiés dans `supabase/migrations/20260425_13*.sql` (placeholders pointant vers MCP).

---

## §2 — Code écrit

### 2.1 Lib helpers (`src/lib/kairos/`) — NEW

```
src/lib/kairos/
  ├── extraction.ts       Sonnet 16 dimensions (chantier 2)
  ├── embeddings.ts       4 vecteurs spécialisés (chantier 1)
  ├── numinosity.ts       Scoring composite révisable (chantier 1)
  ├── pattern-detection.ts 8 RPCs detection → kairos_edges (chantier 3)
  ├── synthesizer.ts      Polyphonie 6 tiers (chantier 4)
  ├── user-context.ts     Build context user_meaning + AHA voices (chantier 7)
  └── pipeline.ts         Orchestrateur 8 phases end-to-end
```

### 2.2 Prompts (`src/prompts/`) — NEW

```
src/prompts/
  ├── dream-alpha-extract-calibrated.ts  Prompt Sonnet 16 dims + INHIBITION rules par kairos_type
  └── synthesis-tiers.ts                 6 prompts (big_dream/pattern_rich/standard/somatic_delicate/image_tending/reverie) + detectSynthesisTier()
```

Anti-patterns intégrés dans CHAQUE prompt synthèse :
- JAMAIS "ce rêve signifie X" → "on pourrait entendre"
- JAMAIS d'équivalence cross-tradition
- JAMAIS > 600 mots
- JAMAIS de noms d'auteur (Forêt absorbée, jamais citée)

### 2.3 Routes API Next.js — NEW (15 routes)

**Kairos core** :
- `POST /api/kairos` — créer kairos + trigger pipeline async fire-and-forget
- `GET  /api/kairos` — list paginé cursor-based + filtres
- `GET  /api/kairos/[id]` — détail full scalars + synthesis
- `PATCH /api/kairos/[id]` — toggle user_marked_numinous + prophetic_status
- `DELETE /api/kairos/[id]` — burn (V1 simple, V1.5 crypto wipe)

**Pattern detection wrappers** :
- `GET /api/kairos/[id]/echoes` — multilayer (Types 1-4)
- `GET /api/kairos/[id]/edges` — tous edges du kairos
- `GET /api/kairos/[id]/mirrors` — Type 5 inverse mirror
- `GET /api/kairos/[id]/prophetic` — Type 7 (D4 Tim seuils 0.75/0.4 + sensitive_notice)
- `GET /api/kairos/cycles?motif=X` — Type 6
- `GET /api/kairos/numinous` — Type 8
- `GET /api/constellation` — graph nodes+edges force-directed

**Circle granulaire opt-in** :
- `POST/DELETE /api/kairos/[id]/circle-optin` — agrégation k-anon anonyme
- `POST/DELETE /api/kairos/[id]/circle-share` — partage cleartext identifiable
- `POST/DELETE /api/kairos/[id]/global-optin` — Anima Mundi 3 niveaux

**User learning layer** (chantier 7) :
- `GET/POST/DELETE /api/user/meaning` — déclarer cosmologie symbolique
- `POST /api/user/validate` — micro-question AHA
- `GET/POST /api/user/annotate` — annotations marginales
- `POST /api/user/skip` — skip d'écho/voix

**Anima Mundi consultation** :
- `GET /api/anima-mundi/voute` — agrégat (météo + polyphonie + annales count + optin count)
- `GET /api/anima-mundi/meteo`
- `GET /api/anima-mundi/polyphonie`
- `GET /api/anima-mundi/annales`
- `POST /api/anima-mundi/tenir` — tenir une annale

**Circle restitutions** :
- `GET/POST /api/circles/[id]/restitutions` — list + request (RPC + inline gen V1, EF V1.5)

**Internal** :
- `POST /api/kairos/[id]/enrich-trigger` — endpoint server-to-server (x-internal-secret) pour EF kairos-enrich

**Total** : ~26 endpoints. Tous protégés Bearer auth Tier 2 via `requireAuth()`.

### 2.4 Edge Functions Supabase (Deno) — NEW (5 EFs prêtes pour deploy Tim)

```
supabase/functions/
  ├── kairos-enrich/index.ts                Stub V1 → forward vers route /api/kairos/[id]/enrich-trigger
  ├── kairos-numinosity-recalc/index.ts     Cron 6h, recalcule numinosity pending (root_pattern matches + edges count)
  ├── anima-meteo/index.ts                  Cron lundi 6h, Sonnet pas appelé V1 (juste agrégation), insert meteos_inconscient
  ├── anima-polyphonie/index.ts             Cron lunaire ~14j, Sonnet polyphonique 3-5 voix absorbées, insert avec approved_for_publication=false (audit Tim/Yeshua manual)
  ├── anima-annales-cron/index.ts           Cron daily 2h, threshold dynamique + bascule archived/expired
  └── generate-circle-restitution/index.ts  Triggered par route restitutions POST (V1.5), Sonnet polyphonique k-anon intra-cercle
```

### 2.5 Modifs existantes

- `tsconfig.json` : exclude `supabase/functions/**/*` (Deno runtime, pas Node).

---

## §3 — Fonctionnement end-to-end

```
Frontend          Next.js API                     Supabase                          Anthropic + OpenAI
   │                   │                              │                                       │
   │ POST /api/kairos  │                              │                                       │
   ├─raw_text+type────►│                              │                                       │
   │                   │ INSERT kairos (raw)─────────►│                                       │
   │                   │ ◄── kairos_id                │                                       │
   │ ◄──{kairos_id}────│ [response 201 < 1s]          │                                       │
   │                   │                              │                                       │
   │                   │ runKairosEnrichmentPipeline (fire-and-forget)                        │
   │                   │   ├─Phase 1.5: build user_context (meaning + AHA voices)             │
   │                   │   ├─Phase 5  : queryForestForMode (8 chunks)                         │
   │                   │   ├─Phase 3  : extractKairos16Dims (Sonnet) ────────────────────────►│
   │                   │   ├─Phase 4  : computeKairosEmbeddings (4 || OpenAI calls)──────────►│
   │                   │   ├─Phase 4.5: UPDATE kairos (extraction + embeddings)               │
   │                   │   ├─Phase 7  : runPatternDetection (8 RPCs → INSERT kairos_edges)    │
   │                   │   ├─Phase 6  : computeNuminosityScore (composite)                    │
   │                   │   ├─Phase 8  : detectSynthesisTier + synthesizeKairos (Sonnet/Opus) ►│
   │                   │   └─Phase 9  : UPDATE final (synthesis_text + numinosity_pending=f)  │
   │                   │                              │                                       │
   │ GET /api/kairos/{id} (polling 3s)                │                                       │
   ├─────────────────►  │ SELECT kairos ──────────────►│                                       │
   │ ◄──{kairos avec synthesis}                       │                                       │
```

**Latence target** :
- POST → response < 1s (UX)
- Pipeline complet → 8-15s (parallèle où possible)
- Frontend polling toutes les 3s révèle synthesis_text quand prêt

---

## §4 — Edge Functions à deployer par Tim (commande groupée)

**Une fois tous les EFs validés** (5×), commande groupée :

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app

supabase functions deploy kairos-enrich --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy kairos-numinosity-recalc --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy anima-meteo --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy anima-polyphonie --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy anima-annales-cron --project-ref rtrkxzcyblgonwgfzovj && \
supabase functions deploy generate-circle-restitution --project-ref rtrkxzcyblgonwgfzovj
```

**Secrets EF requis** (via Supabase dashboard Project Settings > Edge Functions) :
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `INTERNAL_PIPELINE_URL` = `https://dream-alpha-bice.vercel.app`
- `INTERNAL_PIPELINE_SECRET` = secret aléatoire (à set côté Vercel ET Supabase Function en même temps)

**Cron schedules à ajouter post-deploy** (via apply_migration) :

```sql
SELECT cron.schedule(
  'kairos-numinosity-recalc-6h', '0 */6 * * *',
  $$ SELECT net.http_post(
       url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/kairos-numinosity-recalc',
       headers := jsonb_build_object('Authorization', 'Bearer SERVICE_ROLE_KEY')
     ) $$
);

SELECT cron.schedule(
  'anima-meteo-weekly', '0 6 * * 1',
  $$ SELECT net.http_post(
       url := 'https://rtrkxzcyblgonwgfzovj.supabase.co/functions/v1/anima-meteo',
       headers := jsonb_build_object('Authorization', 'Bearer SERVICE_ROLE_KEY')
     ) $$
);

-- anima-polyphonie : appelée manuellement nouvelle/pleine lune par Yeshua jusqu'à V1.5
-- anima-annales-cron : '0 2 * * *'
```

---

## §5 — Décisions Tim respectées

| ID | Décision Tim 2026-04-25 | Implémentation |
|---|---|---|
| D1 | Migration totale dreams → kairos | ✅ kairos vierge créée. dreams legacy reste lisible mais nouveaux dépôts → kairos. Tim a OK pour recommencer (13 rêves perso). |
| D2 | Cleartext + RLS strict V1 | ✅ kairos.raw_text cleartext. RLS user_id = auth.uid() partout. Crypto V1.5. |
| D3 | K-anon 5 dynamique Anima Mundi | ✅ compute_meteo_inconscient param `p_kanon_min=5`. get_circle_patterns dynamique `MAX(3, 0.20 × member_count)`. |
| D4 | Type 7 prophétique sensible 0.75/0.4 + transparence | ✅ find_kairos_prophetic seuils 0.75 combined / 0.4 numinosity_past. /api/kairos/[id]/prophetic ajoute `sensitive_notice` dans la réponse. Edge metadata `flagged_sensitive: true`. |
| D5 | Deploy EF groupé 2×/jour Tim | ✅ Toutes les 6 EFs sont écrites mais NON deployées (Tim deploy via CLI). Commande groupée fournie §4. |
| D6 | Budget OK + cache + batch + traitement allégé notes jour | ✅ note_jour → extraction allégée Haiku via EXTRACT_LIGHT_NOTE_SYSTEM (pas Sonnet 16 dims). Embeddings parallèles. RPCs pgvector HNSW indexed. |

---

## §6 — Anti-patterns INFUSE respectés

- **PAS d'équivalence cross-tradition** : embed dans tous les prompts synthesis-tiers + dans EXTRACT_CALIBRATED_SYSTEM (`tradition_specific = ANTI-ÉQUIVALENCE ABSOLUE`).
- **PAS de citation directe Forêt** : FOREST_ABSORB_LABEL réutilisé. Jamais de "selon Jung", "Hopcke écrit".
- **PAS d'interpretation à l'extraction** : EXTRACT_CALIBRATED_SYSTEM répète "Tu nommes, tu ne juges pas".
- **PAS de prescription médicale** : SYNTHESIS_SOMATIC_DELICATE_SYSTEM explicite.
- **CHALLENGE not flatter** : pas de "Great question!", pas de servilité dans tone synthesis.
- **VISION MONDIALE** respectée : pipeline scale-ready (HNSW indexes, batch RPCs, k-anon dynamique).

---

## §7 — Tests sanity passés

```sql
-- 16 tables Dream App V1 toutes en place avec RLS
SELECT 'kairos' AS t, COUNT(*) FROM kairos UNION ALL ... → 16 rows, all 0 rows (vierge)

-- 11 RPCs disponibles
SELECT routine_name FROM information_schema.routines WHERE ... → 11 rows

-- Test get_constellation_graph empty user → {edges:[], nodes:[]} ✅
-- Test compute_meteo_inconscient empty corpus → {k_count:0, top_motifs:[], top_archetypes:[]} ✅
```

```bash
# TypeScript strict pass
cd dream-alpha-app && tsc --noEmit → 0 errors
```

---

## §8 — Bugs / blocants identifiés

### B1 — Variable env INTERNAL_PIPELINE_SECRET à set par Tim avant deploy EF kairos-enrich

**Statut** : `partial` — la route `/api/kairos/[id]/enrich-trigger` exige `x-internal-secret` header. Si Tim ne set pas cette env var côté Vercel + Supabase Function, l'EF kairos-enrich rejette tout appel.

**Mitigation V1** : route POST /api/kairos appelle déjà `runKairosEnrichmentPipeline` inline (fire-and-forget) — donc Dream App fonctionne sans EF. L'EF est juste un offload V1.5 quand le backend devient chargé.

**Action Tim** : générer secret + set dans Vercel env (`INTERNAL_PIPELINE_SECRET=...`) + dans Supabase EF secrets (même valeur) AVANT de deploy kairos-enrich EF.

### B2 — Vercel serverless cuts after response → fire-and-forget pipeline pourrait être interrompu

**Statut** : `partial` — En théorie, Next.js `void runKairosEnrichmentPipeline(...).catch(...)` continue après le `return NextResponse.json(...)`, mais Vercel serverless peut couper l'instance dès que la response est flushed.

**Mitigation V1** : `export const maxDuration = 60` au top de la route POST → Vercel garde l'instance vivante 60s. Suffisant pour pipeline 8 phases (~10-15s).

**V1.5** : déplacer définitivement vers EF kairos-enrich pour offload propre.

### B3 — Forest retrieval consume 8 chunks par kairos × 2 calls (extract + synthesis) → cost moderate

**Statut** : `acceptable` — chaque kairos = 2 embeddings Forêt + 8 chunks formatés. Coût ≈ $0.001/kairos pour Forêt seule. Sonnet extract 3000 tokens out + synthesis 1500 tokens out = ~$0.03/kairos. Total ~$0.03-0.04 par kairos enrichi.

**Pour 1000 users × 1 kairos/jour** : ~$30-40/jour, soit ~$1000/mois Forêt + Sonnet pipeline. Acceptable selon budget Tim (D6 OK).

**Optimisation V1.5** : cache Forest chunks par cluster sémantique similaire (cosine > 0.95 réutilisable).

### B4 — Type checking warnings mineurs sur Edge Functions Deno

**Statut** : `non-blocking` — TypeScript strict mode ne reconnaît pas les imports Deno (ESM URLs) ni la global Deno. Solution : tsconfig exclut `supabase/functions/**`. Les EFs s'exécutent en runtime Deno côté Supabase, pas en Node.

---

## §9 — Couverture spec V1.2 backend

| Chantier | Statut | Notes |
|---|---|---|
| 1. Moteur résonance multi-vecteurs | `full_green` code + DB | 4 vecteurs + 16 scalars + 8 RPCs + helpers + RLS. End-to-end testable. |
| 2. Extract calibré 16 dims | `full_green` code | EXTRACT_CALIBRATED_SYSTEM + EXTRACT_LIGHT_NOTE_SYSTEM (note_jour) + integration dans pipeline. |
| 3. 16 types pattern echoing V1=8 | `full_green` code + DB | RPCs + runPatternDetection + insert kairos_edges avec dédoublonnage. |
| 4. Workflow synthèse 6 tiers | `full_green` code | 6 prompts dédiés + detectSynthesisTier + synthesizeKairos. Big Dream → Opus, autres → Sonnet. |
| 5. Pipeline cercle V1 | `full_green` schemas + RPCs + routes; `partial` UI | Tables + RPCs + 4 routes API + EF generate-circle-restitution + inline V1 fallback. UI restitution screen pas dans scope cet agent. |
| 6. Pipeline Anima Mundi | `full_green` schemas + EF stubs; `blocked` cron | Tables + RPC compute + 5 routes consultation + 3 EF cron. Cron schedules à ajouter post-deploy EF Tim. K-anon 5 dynamique. |
| 7. Couche apprentissage | `full_green` code + DB | 6 tables + 4 routes + buildUserMeaningContext intégré dans pipeline phase 1.5. |
| 8. Persistance zero-perte | `full_green` (déjà fait Quick Wins matin) | dream_app_feedback + FeedbackButton (chantier 8 livré matin). |

**Score global** : ~90% spec V1.2 backend câblé. Restant : UI components (chantier hors scope agent), deploy EF (Tim), cron schedules (post deploy).

---

## §10 — Décisions à arbitrer Tim (post lecture)

### A1 — Confirmation B1 secret

Tim, tu génères le `INTERNAL_PIPELINE_SECRET` avant deploy ou tu préfères que je laisse l'EF kairos-enrich désactivée et qu'on garde uniquement le pipeline inline V1 ?

→ **Recommandation Yeshua** : laisse inline V1 jusqu'à ce que ça scale. Tu deploy juste les 5 autres EFs (numinosity-recalc + anima-meteo + anima-polyphonie + anima-annales-cron + generate-circle-restitution).

### A2 — Quand tester end-to-end ?

Une fois les EFs deployées + secrets set, tu fais un test manuel :

```bash
# 1. Login Dream App, copy token
TOKEN="<bearer>"
curl -X POST https://dream-alpha-bice.vercel.app/api/kairos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"raw_text":"Je suis dans une maison aux portes closes. Une figure noire me regarde. Mon cœur bat fort.", "kairos_type":"reve"}'

# Récupère kairos_id puis polling
sleep 15
curl https://dream-alpha-bice.vercel.app/api/kairos/{kairos_id} \
  -H "Authorization: Bearer $TOKEN" | jq '.kairos.synthesis_text'
```

→ **Recommandation Yeshua** : refais ce test avec UN de tes 13 rêves "réels" pour calibrer tone + tier detection sur cas vivant.

### A3 — Designs UI manquants

Pour chantier 5 (Cercle Restitution UI) + chantier 6 (Voûte/Météo/Annales/Polyphonie UI), je n'ai pas câblé les composants React (hors scope agent backend). Quand tu veux que j'attaque la couche UI ?

→ **Recommandation Yeshua** : on garde les routes API en place, tu testes le backend brut via curl/Postman cette semaine, et la prochaine session on attaque les composants UI Détail Kairos + Constellation + Cercle restitution + Voûte Anima Mundi (sur la base des designs Claude V1.2 déjà intégrés Étape 2).

---

## §11 — Trace fichiers créés/modifiés

```
NEW:
  supabase/migrations/20260425_130000_kairos_rpcs_v1.sql        (stub)
  supabase/migrations/20260425_130100_circles_v1_extended.sql   (stub)
  supabase/migrations/20260425_130200_anima_mundi_v1_schemas.sql (stub)
  supabase/migrations/20260425_130300_user_meaning_layer_v1.sql (stub)
  supabase/migrations/20260425_130400_kairos_synthesis_columns.sql

  src/prompts/dream-alpha-extract-calibrated.ts
  src/prompts/synthesis-tiers.ts

  src/lib/kairos/extraction.ts
  src/lib/kairos/embeddings.ts
  src/lib/kairos/numinosity.ts
  src/lib/kairos/pattern-detection.ts
  src/lib/kairos/synthesizer.ts
  src/lib/kairos/user-context.ts
  src/lib/kairos/pipeline.ts

  src/app/api/kairos/route.ts
  src/app/api/kairos/[id]/route.ts
  src/app/api/kairos/[id]/echoes/route.ts
  src/app/api/kairos/[id]/edges/route.ts
  src/app/api/kairos/[id]/mirrors/route.ts
  src/app/api/kairos/[id]/prophetic/route.ts
  src/app/api/kairos/[id]/circle-optin/route.ts
  src/app/api/kairos/[id]/circle-share/route.ts
  src/app/api/kairos/[id]/global-optin/route.ts
  src/app/api/kairos/[id]/enrich-trigger/route.ts
  src/app/api/kairos/cycles/route.ts
  src/app/api/kairos/numinous/route.ts
  src/app/api/constellation/route.ts
  src/app/api/user/meaning/route.ts
  src/app/api/user/validate/route.ts
  src/app/api/user/annotate/route.ts
  src/app/api/user/skip/route.ts
  src/app/api/circles/[id]/restitutions/route.ts
  src/app/api/anima-mundi/voute/route.ts
  src/app/api/anima-mundi/meteo/route.ts
  src/app/api/anima-mundi/polyphonie/route.ts
  src/app/api/anima-mundi/annales/route.ts
  src/app/api/anima-mundi/tenir/route.ts

  supabase/functions/kairos-enrich/index.ts
  supabase/functions/kairos-numinosity-recalc/index.ts
  supabase/functions/anima-meteo/index.ts
  supabase/functions/anima-polyphonie/index.ts
  supabase/functions/anima-annales-cron/index.ts
  supabase/functions/generate-circle-restitution/index.ts

MODIFIED:
  tsconfig.json (exclude supabase/functions)
```

**Total** : 5 migrations DB + 2 prompts + 7 lib helpers + 26 routes API + 6 EFs + 1 tsconfig.

---

## §12 — Posture finale

**Backend Dream App V1** : prêt en production code-side. Pipeline 8 phases câblé, type-safe, fire-and-forget. Tables + RPCs + RLS en place.

**Reste pour qu'un user dépose son premier kairos enrichi end-to-end** :
1. Tim set INTERNAL_PIPELINE_SECRET (Vercel + Supabase) si on veut activer kairos-enrich EF
2. Tim deploy 5 EFs Supabase (commande §4)
3. Tim ajoute cron schedules SQL (§4)
4. Tim deploy frontend Vercel (`npx vercel --prod` depuis dream-alpha-app/)
5. Test manuel curl POST /api/kairos avec un rêve réel
6. Itération calibration tone/tier sur 14 cas Investigation (chantier futur)

**Mode Yeshua sortie d'agent** : `full_green` code, `partial` runtime (en attente deploy + test Tim).

---

## §13 — Suite logique

- **Cette semaine** : Tim teste backend brut. Si ok → **Étape 5** = composants UI manquants (Détail Kairos avec synthesis affichée, Constellation graph, Cercle restitution screen, Voûte Anima Mundi).
- **Semaine prochaine** : tests calibration sur 14 cas Investigation + ajustement seuils prophétique D4 selon retours.
- **Mois prochain** : Tier 4 sécurité (rate limit, security headers, audit logs) avant launch publique.

🕊️
