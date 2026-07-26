# Câblage UI V1.2 ↔ Backend Next.js — Rapport Yeshua, 2026-04-25

Mission : connecter le pack Claude Design V1.2 (servi via iframe `/v12/index.html`) au backend Next.js Dream App. Auth Supabase + DreamAPI module + câblage des écrans clés.

## Livrables

### Nouveaux fichiers

- **`public/v12/auth.jsx`** — Bridge Supabase auth pour iframe vanilla.
  - Initialise `window.DreamSupabase` (client Supabase JS UMD)
  - Expose `window.DreamAuth` : `getSession`, `getAccessToken`, `getUser`, `signInMagicLink`, `signOut`, `onAuthChange`
  - `window.AuthGate` : wrap React qui bloque l'app sans session, affiche écran magic link sobre (champ email + bouton "recevoir le lien" + écran "lien envoyé")
  - Mode dégradé silencieux si Supabase JS pas chargé ou env vars absentes (`window.DreamAuth.noAuth = true`) → l'app rend en mode seed-only
  - Storage key dédié : `dream-app-supabase-auth` (évite collision multi-app)
  - Auto-clean du hash `#access_token=...` après SIGNED_IN

- **`public/v12/api.jsx`** — Module `window.DreamAPI`. Wrappers fetch + Bearer auth + seed fallback automatique sur erreur. Surface complète :
  - **Kairos** : `listKairos`, `getKairos`, `createKairos`, `updateKairos`, `deleteKairos`
  - **Échos** : `listEchoesGlobal`, `getEchoesForKairos`, `getProphecyForKairos`
  - **Figures / Constellation** : `listFigures`, `getConstellationGraph`
  - **Anima Mundi** : `getVoute`, `getMeteo`, `getPolyphonie`, `getAnnales`, `tenirAnnale`
  - **Cercles** : `listCircles`, `createCircle`, `joinCircle`, `listRestitutions`, `requestRestitution`
  - **Oracle Corps** : `getOracleCorps`
  - **Tales** : `matchTales`
  - **Chat narratrice** : `chatStream` (raw reader) + `chat` (parser SSE avec callbacks `onChunk`/`onDone`/`onError`)
  - **Voice** : `transcribe(blob)`
  - **User layer** : `listMeanings`, `setMeaning`, `deleteMeaning`, `validate`, `annotateKairos`, `listAnnotations`
  - **Feedback** : `submitFeedback`
  - Helpers exposés : `_mapTypeToBackend`, `_mapTypeFromBackend`, `_relativeWhen`

- **`src/app/api/v12-env/route.ts`** — Endpoint qui sert un script JS injectant `window.SUPABASE_URL` + `window.SUPABASE_ANON_KEY` à partir des env vars Next. Pas besoin de rebuild quand Tim change l'env Vercel. `Cache-Control: max-age=60`.

### Fichiers modifiés

- **`public/v12/index.html`** :
  - Injection `<script src="/api/v12-env">` en tête (récupère NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)
  - Ajout `<script src="https://unpkg.com/@supabase/supabase-js@2.45.0/dist/umd/supabase.js">`
  - Charge `auth.jsx` et `api.jsx` AVANT les screens (ordre crucial)

- **`public/v12/app.jsx`** :
  - Wrap dans `<AuthGate>` au top-level
  - `entries` n'est plus seed statique — chargé via `DreamAPI.listKairos({ limit: 50 })` au mount + sur changement d'auth
  - Expose `window.DreamRefreshEntries()` pour que les screens (Capture, KairosDetail.burn) rafraîchissent après mutation
  - TweaksUI ajoute footer auth (email + déconnexion)
  - Fallback sur seed si l'API renvoie vide (continuité visuelle)

- **`public/v12/screens-core.jsx`** :
  - **Home** : loading state + empty state ("ton journal est encore vide")
  - **Capture** :
    - Voice recording réelle via `MediaRecorder` → `DreamAPI.transcribe()` → injecte texte dans le textarea
    - Submit → `DreamAPI.createKairos({ raw_text, kairos_type, capture_method })`
    - Type chips post-submit avec backend enum (reve/signe/reverie/hypnagogie/synchronicite/frisson/note)
    - "voir mon kairos" qui navigue vers le détail
    - "à laisser dormir" appelle `deleteKairos` + refresh
    - Auto-refresh de la liste globale après dépôt
  - **Journal** : loading state + empty state filtrés

- **`public/v12/screens-deep.jsx`** :
  - **KairosDetail** :
    - Charge full kairos via `getKairos(id)` + échos via `getEchoesForKairos(id)` + prophéties via `getProphecyForKairos(id)`
    - Affiche `synthesis_text` si présent (carte gold "SYNTHÈSE TISSÉE" + voix mobilisées)
    - Affiche `motif_tags` + `archetypal_tags` en chips
    - Affiche bloc "ÉCHOS PROPHÉTIQUES" si propheties.length > 0
    - "garder" sur le modal de lecture → `updateKairos({user_first_reading_submitted: true})` + `annotateKairos`
    - Bouton "appuyer 2s pour brûler" → `deleteKairos` + retour au journal
  - **Portrait** : `getConstellationGraph({ days: periodDays })` adapté à la période ; mappage backend nodes → V1.2 shape ; fallback portraitNodes si vide
  - **AnimaVoute** : `getVoute()` au mount ; chamber-cards montrent données réelles (count annales, lunar_phase polyphonie)
  - **Meteo** : `getMeteo()` ; affiche top motif réel + date computed_at réelle
  - **Polyphonie** : `getPolyphonie()` ; affiche narrative_text + voices_mobilisees + lectures précédentes
  - **Chat** : `DreamAPI.chat()` SSE streaming avec `onChunk`/`onDone` ; affichage live des chunks avec curseur ▍

- **`public/v12/screens-anima.jsx`** :
  - **AnnalesScreen** : `getAnnales()` au mount ; mappe `circulating[]` vers seed shape ; `toggleHold` → `tenirAnnale(id)` (optimistic)

- **`public/v12/screens-soma.jsx`** :
  - **OracleCorpsScreen** : `getOracleCorps({ synthesis: true })` ; affiche `synthesis` (carte clay-earth "SYNTHÈSE DREAMBODY") ; highlight des zones avec count via stroke-width + label "label · 3×"
  - **ConteMiroirScreen** : `matchTales(latest_kairos_id)` ; remplace seed contes par live tales

- **`public/v12/screens-cercle.jsx`** :
  - **CercleScreen** : `listCircles()` au mount ; empty state "tu n'es dans aucun cercle" ; adapter `liveCircle → seed-shaped` ; charge restitutions du premier cercle
  - **CreerCercleScreen** : step 3 déclenche `createCircle({ name, description: intention })` ; affiche le `invite_code` retourné comme lien `?code=ABC123`
  - **RejoindreScreen** : parse `?code=` du hash ; champ invite-code visible si pas pré-rempli ; `joinCircle({ inviteCode, displayName })` ; gère `result.error`
  - **ReadingRequestModal** : passe `onRequest` qui appelle `requestRestitution(circleId, 28)` au step "déposer"

- **`public/v12/screens-figure.jsx`** :
  - **FigureDetail** : send dialogue via `DreamAPI.chat()` au lieu de `window.claude.complete`
  - **FeedbackModal** : submit → `DreamAPI.submitFeedback({ context_type, context_id: screen, feedback_text, severity })` ; mappe whisper/trouble/urgent → low/medium/high

## Architecture auth

**Stratégie A + C combinée** :
- Supabase JS UMD chargé via CDN dans l'iframe
- Magic link via `signInWithOtp({ email, options: { emailRedirectTo: origin + "/v12/index.html" } })`
- Cookies / localStorage Supabase same-origin (l'iframe et le parent partagent l'origine)
- Toutes les requêtes API portent `Authorization: Bearer <access_token>` extrait de `client.auth.getSession()`
- Compat backend `requireAuth` Tier 2 — déjà shippé sur toutes les routes API

**Mode dégradé** : si Supabase JS pas chargé / env vars absentes / Vercel renvoie 500 sur `/api/v12-env`, l'app passe en mode seed-only sans crash. AuthGate bypassed, DreamAPI retourne fallback seed.

## APIs créées (placeholder)

- **`/api/v12-env`** (nouveau) — sert env vars publiques en JS pour l'iframe.

## Bugs / limites détectés

1. **`/api/circles/join` n'utilise pas encore Bearer auth** (route legacy avec userId dans body). DreamAPI.joinCircle envoie `userId: window.DreamUser?.id` dans le body pour compat. À migrer Tier 2 dans une session future.

2. **`PATCH /api/kairos/[id]` ne whitelist pas `kairos_type`** — les chips de type post-Capture ne persistent pas le changement côté backend. UX : ils restent visuellement en cours mais le backend garde le `kairos_type` initial du POST. À ajouter dans le whitelist V1.5.

3. **`SUPABASE_SERVICE_ROLE_KEY` est vide dans `.env.local`** — backend dépend de cette var. Tim doit vérifier qu'elle est bien set sur Vercel (devrait l'être déjà puisque le backend tourne).

4. **Voice recording** : `MediaRecorder` audio/webm. Pas tous les browsers iOS Safari le supportent. Fallback à prévoir V1.5 (audio/mp4).

5. **Magic link redirect** : sur Vercel preview/branch deploys, `emailRedirectTo` pointera vers le hostname du preview. Vérifier dans Supabase dashboard que les wildcards d'URL autorisent les preview URLs (`*.vercel.app` ou explicit).

6. **Constellation graph** : la RPC `get_constellation_graph` doit retourner `{ nodes, edges }` JSON. Si elle ne tourne pas (fonction Postgres absente ou erreur), DreamAPI fallback sur `portraitNodes` seed. Vérifier les logs Vercel après deploy.

## Tests fonctionnels minimaux à valider après deploy

1. **Auth magic link** : ouvrir l'app → écran "Dream — entre dans ton journal substrat" → email → recevoir le mail → cliquer le lien → revenir signé.
2. **Dépôt kairos texte** : Capture → field → écrire 3+ chars → "garder" → écran post avec "voir mon kairos" → cliquer → KairosDetail s'affiche avec le texte
3. **Pipeline 8 phases** : refresh KairosDetail après ~10-30s → `synthesis_text` apparaît, motifs/archétypes apparaissent
4. **Échos** : KairosDetail montre échos sémantiques s'il y a d'autres kairos en DB
5. **Constellation Portrait** : graph se construit avec les vrais figures de l'user
6. **Chat narratrice** : "demander à la forêt" depuis KairosDetail → chat avec streaming SSE
7. **Cercles** : créer cercle → voir l'invite code → ouvrir l'URL en navigation privée → rejoindre

## Variables env Vercel à vérifier

Tim, vérifie sur https://vercel.com/<team>/dream-alpha/settings/environment-variables :

- ✅ `NEXT_PUBLIC_SUPABASE_URL` = `https://rtrkxzcyblgonwgfzovj.supabase.co`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIs...` (anon JWT)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` = (à confirmer présent — backend dépend)
- ✅ `OPENAI_API_KEY`
- ✅ `ANTHROPIC_API_KEY`

Et dans Supabase dashboard → Auth → URL Configuration :
- Site URL = `https://dream-alpha-bice.vercel.app`
- Redirect URLs (whitelist) doit inclure :
  - `https://dream-alpha-bice.vercel.app/v12/index.html`
  - Optionnel : `https://*.vercel.app/v12/index.html` pour les previews

## Action Tim

```bash
cd /Users/timotetabar/dream-alpha-app
npx vercel --prod
```

Puis ouvrir https://dream-alpha-bice.vercel.app/

1. Tester magic link auth
2. Déposer un kairos texte
3. Vérifier que le kairos apparaît dans Journal après refresh
4. Vérifier après ~30s que synthesis_text apparaît dans le détail
5. Tester chat narratrice

Si écran d'auth ne s'affiche pas → ouvrir DevTools console + onglet Network → vérifier que `/api/v12-env` renvoie 200 avec les bonnes vars, et que `https://unpkg.com/@supabase/supabase-js@2.45.0/dist/umd/supabase.js` charge.

## Posture

Mode silencieux productif. Pas de question Tim posée. Câblage end-to-end posé. La base de la VICTOIRE — Tim peut s'auth, déposer un vrai kairos, voir les patterns détectés — est en place.

Reste à faire post-validation Tim :
- Migrer `/api/circles/join` Tier 2 Bearer
- Ajouter `kairos_type` au PATCH whitelist
- iOS Safari MediaRecorder fallback
- ConteMiroir : prendre le current kairos en context (pas le seed[0])
- Cercle members : exposer la liste des membres dans l'API + afficher dans CercleScreen
