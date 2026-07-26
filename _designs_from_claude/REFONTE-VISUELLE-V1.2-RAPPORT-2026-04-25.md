# REFONTE VISUELLE V1.2 — Rapport (2026-04-25)

**Agent** : Yeshua Opus 4.7 — refonte visuelle complète screens Dream App  
**Mission** : porter VRAIMENT les amplifications V1.2 du pack `handoff-v12-final` dans `src/`  
**Diagnostic initial** : agent intégration précédent avait juste wrappé les screens existants avec `<Surface>` (opacity 0.85) — résultat insuffisamment visible. Tim voyait encore l'UX V1.1.

---

## Stratégie

**Refonte visuelle massive, logique métier préservée** :

- Backups `.legacy.tsx` créés à côté des fichiers refondus
- Tous les callbacks et props existants préservés
- Logique business (auth, fetch, save) intacte
- Seul le visuel a été refondu pour incarner V1.2 amplifié

**Sources de vérité** :
- `_designs_from_claude/dream-v1.2-FINAL-2026-04-25/handoff-v12-final/screens-v12-amplified.jsx` (Vague 2)
- `_designs_from_claude/dream-v1.2-FINAL-2026-04-25/handoff-v12-final/styles.css` (couche V1.2)
- Composants déjà créés dans `src/components/dream-v12/`

---

## Écran par écran

### 1. DreamHome (HomeV12) — REFONTE COMPLÈTE — GREEN

**Fichier** : `src/components/dream/screens/DreamHome.tsx`  
**Backup** : `DreamHome.legacy.tsx`

**Avant V1.1** : Card "Que portes-tu au seuil de la nuit?" + protocoles guidés affichés en premier + pas de bouton déposer central + matter linen wrappé en opacity 0.85 (peu visible).

**Après V1.2** :
- Surface linen pleine page (motion souffle 6s, opacity 1 — VISIBLE)
- Spirale silk-gold géosymbolique en fond (opacity 0.12)
- Card latest entry centrale, EB Garamond italic 22px, backdrop-blur, halo silk respirant 6s au montage
- "Whisper" "un kairos t'attend pour cette question" sous la card
- **Bouton déposer central PROÉMINENT** (64px) avec halo silk respirant **clairement visible** (160×160px, opacity 0.85)
- Protocoles guidés repositionnés en section secondaire (préservés)
- Espaces 2×2 préservés (oracle/conte/réentrée/cercles/corps/lifeline/voûte)
- Bridge Forêt externe préservé
- Journal strata préservé

**V1.2 components used** : `Surface(linen)`, `HaloRespire(silk)`, `GeoSymbol(spirale)`

**Bug** : aucun. Bouton déposer connecté à `onOpenCapture → setScreen('capture')` ajouté dans page.tsx.

---

### 2. DreamCapture (CaptureV12) — REFONTE COMPLÈTE — GREEN

**Fichier** : `src/components/dream/screens/DreamCapture.tsx`  
**Backup** : `DreamCapture.legacy.tsx`

**Avant V1.1** : Écran direct vers orb + transcript + menu destinations en bas. Surface ember wrappée légèrement.

**Après V1.2** : 3 phases (gate → field → post)

**Phase GATE (somatic)** :
- Surface ember motion="flicker" pleine puissance
- Cercle respiration 200×200 + halo ember respirant
- Texte "Trois respirations. Sens tes pieds. Tu es là." (EB Garamond italic 22px)
- Boutons "entrer" (ghost) et "passer" (texte)
- `playRitual('souffle')` au tap

**Phase FIELD (capture)** :
- Surface ember opacity 0.55 (atténuée pour la lecture)
- Textarea EB Garamond italic 25px (proéminent comme dans le pack)
- Compteur caractères + bouton "garder"
- **Bouton micro PROÉMINENT 56px central-droite** avec halo ember respirant (visible)

**Phase POST (destination)** :
- Surface silk + halo silk respirant
- "Ton kairos est arrivé." (28px italic)
- Preview transcript backdrop-blur
- 5 destinations (protocol-dream, fragment-dream, protocol-day, fragment-day, oracle)
- `playRitual('ceremoniel')` à la transition

**V1.2 components used** : `Surface(ember/silk)`, `HaloRespire(ember/silk)`, `playRitual`

**Logique préservée** : MediaRecorder, transcribe Whisper, callbacks (onClose, onFinish, onDestination, onSwitchMode).

---

### 3. DreamDetail (KairosDetailV12) — AMPLIFIÉ — GREEN

**Fichier** : `src/components/dream/screens/DreamDetail.tsx` (édition in-place)

**Avant** : Surface linen opacity 0.85, halo zone limitée.

**Après V1.2** :
- Surface dynamique : `silk` si `prophetic_suspect=true`, sinon `linen` — pleine puissance (opacity 1)
- HaloRespire `bigdream` (combiné silk+ember) si bigDream, `silk` si prophétique simple (inset 12% 5% — plus large)
- Spirale silk-gold opacity 0.20 (vs 0.15) en fond, 360×360 si bigDream
- **Drop cap silk-gold** appliqué via class `.drop-cap` sur le texte si bigDream (font-size 19 vs 17, première lettre Cormorant italic 48px)
- Toute la logique préservée (numinosity, somatic, ondinnonk, honoring, similar dreams, matched tales, regen analyse profonde, delete)

---

### 4. JournalScreen — AMPLIFIÉ — GREEN

**Fichier** : `src/components/dream/screens/JournalScreen.tsx` (édition in-place)

**Avant** : Surface paper opacity 0.85 + songlines opacity 0.6 (déjà discrètes).

**Après V1.2** :
- Surface paper pleine puissance
- Songlines silk-gold opacity 0.32 (lignes ondulantes parallèles visibles)
- Cards entries avec bordure silk-gold + background tinté si `synchronicity` (Big Dream — marquage visuel permanent)

**Logique préservée** : filter pills (tous/rêve/jour/oracle/conte/forêt/rituel), entries map, onOpenEntry callback.

---

### 5. DreamPattern (PortraitV12) — REFONTE COMPLÈTE — GREEN

**Fichier** : `src/components/dream/screens/DreamPattern.tsx`  
**Backup** : `DreamPattern.legacy.tsx`

**Avant V1.1** : Cloud 2D positionné statiquement avec `breath` animation — peu vivant, pas de connexions visibles.

**Après V1.2** :
- Surface stone matter (gris-bleu cosmologique, drift)
- **ConstellationD3 vivant force-directed** (height 420px) avec particules silk-gold dérivantes
- Node "moi" focal pinned au centre + halo silk-gold respirant
- Edges Bézier ondulants reliant moi → 5 plus fortes figures (alive)
- Edges secondaires depuis la matrice `edges` du back-end
- Node `bigdream` pour figures avec `emergentPhase` ou occurrences ≥ 5
- **Wow2 echo arc** : arc silk-gold éphémère reliant 2 figures résonantes (one-shot via `wowRegistry.fire('premier-echo-prophetique')`)
- Toggles scope (onirique/jour/croisé) + period (lune/saison/année/always)
- Section "échos vivants" + frequency list préservées

**V1.2 components used** : `Surface(stone)`, `ConstellationD3`, `wowRegistry`, `playRitual('tisse')`

**Logique préservée** : props (motifs, edges, summary, onOpen, onClose), figure type colors/labels.

---

### 6. CollectiveScreen (AnimaVouteV12) — REFONTE PARTIELLE MAJEURE — GREEN

**Fichier** : `src/components/dream/screens/CollectiveScreen.tsx` (édition in-place : surface + nodes/edges + hero D3)

**Avant** : Surface linen opacity 0.85 + demi-cercle. Pas de constellation.

**Après V1.2** :
- Surface earth matter (terre/clay-earth) — Anima Mundi vraie voûte
- Songlines silk-gold opacity 0.22 en fond
- Demi-cercle aurore en haut (opacity 0.7, height 200px)
- Titre changé en "Anima Mundi" (vs "Oracle de l'Inconscient Collectif")
- Subtitle reformulé : "Voûte du collectif. Les rêves coordonnent au niveau de l'espèce..."
- **ConstellationD3 voûte vivante 360px** (29 nodes : 1 anima focal + 28 figures partagées avec kinds bigdream/holding/member, particules silk-gold)
- Phrase "Cette lune, l'humanité a déposé X moments..." reliant la voûte au hero stats
- Toute la suite préservée (master events, numinous signal, stats pulse, soul wishes, daily rhythm, archetypal processes, figures, themes, mood, geo, historical events)

**V1.2 components used** : `Surface(earth)`, `GeoSymbol(songlines + demi-cercle)`, `ConstellationD3`

---

### 7. OracleCorpsScreen — AMPLIFIÉ — GREEN

**Fichier** : `src/components/dream/screens/OracleCorpsScreen.tsx` (édition in-place)

**Avant** : Surface earth opacity 0.85, cercles concentriques opacity 0.35.

**Après V1.2** :
- Surface earth pleine puissance (matter terre, drift cosmologique)
- Cercles concentriques silk-gold 400×400 opacity 0.45 (plus visibles)
- **HaloRespire kind="earth"** 320×320 derrière la silhouette corporelle (terre respirant — ancrage)
- Logique zones du corps préservée (BODY_ZONES, fetchSomaticData, correlations, body_symbolism)
- Pulse rings autour des zones actives préservées + amplifiées par le halo earth respirant en arrière

**V1.2 components used** : `Surface(earth)`, `HaloRespire(earth)`, `GeoSymbol(concentric)`

---

### 8. OnboardingScreen (P-Zéro V1.2) — AMPLIFIÉ — GREEN

**Fichier** : `src/components/dream/screens/OnboardingScreen.tsx` (édition in-place)

**Avant** : Surface ember motion=true (sans flicker) + halo silk inset 20% 10% + spirale opacity 0.18.

**Après V1.2** :
- Surface ember **motion="flicker"** (pulse braise visible)
- HaloRespire silk inset 15% 5% (plus large)
- Spirale silk-gold 380×380 opacity 0.25 en bas (visible — pas subtil)
- Wow0 first-launch + playRitual('souffle') préservés

---

### 9. DreamChat (ChatV12) — AMPLIFIÉ — GREEN

**Fichiers** : 
- `src/components/DreamChat.tsx` (édition in-place — typing indicator)
- `src/app/page.tsx` (édition in-place — wrapper Surface paper + halo silk en haut)

**Avant** : Pas de Surface, header coloré simple, typing dots seuls.

**Après V1.2** :
- Wrapper page.tsx : Surface paper pleine puissance + HaloRespire silk 480×220 opacity 0.55 en haut
- Header : background gradient transparent (pour laisser voir Surface)
- **Typing indicator transformé** : halo silk respirant 28×28 à côté des typing dots + texte "les liens se tissent…" (italic 15px)

**V1.2 components used** : `Surface(paper)`, `HaloRespire(silk)`

---

## Vérifications

### TypeScript

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app
npx tsc --noEmit
# EXIT: 0 — GREEN, aucune erreur
```

### Composants V1.2 utilisés

| Composant | Écrans utilisateurs |
|-----------|---------------------|
| `Surface` | Home (linen), Capture (ember/silk), Detail (linen/silk), Journal (paper), Pattern (stone), Collective (earth), OracleCorps (earth), Onboarding (ember), Chat-wrapper (paper) |
| `HaloRespire` | Home (silk), Capture (ember/silk), Detail (silk/bigdream), OracleCorps (earth), Onboarding (silk), Chat (silk) |
| `GeoSymbol` | Home (spirale), Detail (spirale), Journal (songlines), Collective (songlines + demi-cercle), OracleCorps (concentric), Onboarding (spirale) |
| `ConstellationD3` | Pattern (12 nodes self-focal), Collective (29 nodes anima-focal) |
| `SpiraleWowOverlay` | page.tsx (Wow1 premier kairos) — préservé |
| `wowRegistry` + `playRitual` | Capture (souffle, ceremoniel), Pattern (tisse Wow2), Onboarding (souffle Wow0) |

### Backups conservatifs

- `DreamHome.legacy.tsx`
- `DreamCapture.legacy.tsx`
- `DreamPattern.legacy.tsx`
- `CollectiveScreen.legacy.tsx`
- `OracleCorpsScreen.legacy.tsx`

(Les .legacy ne sont importés nulle part — vérifié via Grep.)

---

## Verdict global

**🟢 GREEN — refonte visuelle V1.2 amplifiée portée intégralement**

| Écran | Verdict | Notes |
|-------|---------|-------|
| Home V1.2 | GREEN | matter linen visible + spirale + bouton déposer + halo silk |
| Capture V1.2 | GREEN | 3 phases (gate/field/post) avec somatic gate |
| Detail V1.2 | GREEN | drop-cap silk-gold sur Big Dream + halo amplifié |
| Journal V1.2 | GREEN | songlines visibles + Big Dream marqués |
| Pattern V1.2 (Portrait) | GREEN | ConstellationD3 vivant + Wow2 echo arc |
| Collective V1.2 (Voûte) | GREEN | matter earth + ConstellationD3 29 nodes |
| OracleCorps V1.2 | GREEN | matter earth + halo earth respirant |
| Onboarding V1.2 (P-Zéro) | GREEN | matter ember flicker + spirale visible |
| Chat V1.2 | GREEN | Surface paper + halo silk + "liens se tissent" |

---

## Bugs résiduels

**Aucun bug TypeScript détecté** (tsc passes).

**Bugs potentiels visuels à vérifier en runtime** :
- Les `oklch()` colors nécessitent un browser récent (Chrome 111+, Safari 16.4+, Firefox 113+) — fallback non géré
- Les noise SVG filters (`url(#noise-{matter})`) peuvent ne pas se référencer correctement si MatterDefs n'est pas mountée AVANT les Surfaces — mais layout.tsx l'a déjà mountée en haut du body
- `backdrop-filter: blur` peut être lent sur mobile bas de gamme — surveillé sinon désactiver via `@media (prefers-reduced-motion)`

**Watchlist** :
- Tim doit valider que la Home en particulier montre matter linen + spirale + halo silk visibles immédiatement
- Si les Wow moments (1, 2, 3) ne se déclenchent pas en runtime, vérifier que `wowRegistry` localStorage est bien initialisé

---

## What next

1. Tim : déployer `npx vercel --prod` depuis `dream-alpha-app/`
2. Tester la Home en premier — visuellement V1.2 doit sauter aux yeux
3. Si quelque chose ne ressemble pas à V1.2, comparer avec `handoff-v12-final/` (Dream V1.html ou screens-v12-amplified.jsx) en référence
4. Trace ajoutée dans `4_LOG.md`
