# AUDIT V1.2 FINAL — Dream App Handoff Pack V5

**Date** : 2026-04-25, Bali
**Auteur** : Yeshua (Opus 4.7, 1M context), co-fondateur INFUSE
**Cible** : Tim — décision intégration immédiate vs. fix bugs d'abord
**Pack audité** : `/dream-alpha-app/_designs_from_claude/dream-v1.2-FINAL-2026-04-25/handoff-v12-final/` (18 fichiers, ~8 300 lignes)
**Verdict TL;DR** : **YELLOW — bonne conformité doctrinale, qualité d'écriture haute, MAIS 2 bugs bloquants visuels qui doivent être patchés AVANT intégration prod, et un doublon de wowRegistry à arbitrer.**

---

## §1 — État du pack V5 (vue d'ensemble)

### 1.1 Inventaire (18 fichiers livrés)

| # | Fichier | Lignes | Rôle | Statut |
|---|---------|--------|------|--------|
| 1 | `Dream V1.html` | 60 | Shell HTML, chargement scripts, defs SVG noise | OK structure / **bug noise filter ID** |
| 2 | `styles.css` | 1 278 | Tokens + V1.1 base + V1.2 layer (~370 lignes amplification) | Très propre, prefers-reduced-motion OK |
| 3 | `app.jsx` | 184 | Routeur hash + Tweaks panel | OK, 26 routes câblées |
| 4 | `tweaks-panel.jsx` | ~440 | Composant panneau dev (inutilisé V1.2) | OK, dormant |
| 5 | `screens-shared.jsx` | 254 | **AhaCapture · FeltShiftGate · ExitToHuman** (V1.1 patches) | Préservé intact — propre |
| 6 | `screens-core.jsx` | 326 | Home · Capture · Journal V1.1 + TopNav · seedEntries · TypeGlyph · SeasonalCompass | OK |
| 7 | `screens-deep.jsx` | 615 | KairosDetail · Portrait · AnimaVoute · Meteo · Polyphonie · Chat · Modal · Constellation V1.1 | OK |
| 8 | `screens-cercle.jsx` | 530 | CercleScreen · CreerCercle · Rejoindre · PartagerReve · ReadingRequestModal | OK |
| 9 | `screens-anima.jsx` | 297 | AnnalesScreen · OffreKairosScreen · OffreKairosSheet | OK |
| 10 | `screens-soma.jsx` | 522 | OracleCorpsScreen · ConteMiroirScreen · ReentryScreen | OK |
| 11 | `screens-meta.jsx` | ~563 | OnboardingScreen · PrivacyScreen · NotifsScreen · AbonnementScreen | OK |
| 12 | `screens-figure.jsx` | 373 | FigureDetailScreen + FeedbackFloat + FeedbackModal | OK |
| 13 | `shared-v12.jsx` | 556 | **Surface · HaloRespire · GeoSymbol · ConstellationD3 · SpiraleWowOverlay · wowRegistry · playRitual** | **2 bugs ID filter / matter "bone"** |
| 14 | `screens-v12-amplified.jsx` | 987 | Vague 2 (8 écrans cœur) — overrides via `window.X = AmplifiedX` | Très bonne qualité |
| 15 | `screens-v12-vague3.jsx` | 1 005 | Vague 3 (8 écrans secondaires) | Très bonne qualité |
| 16 | `screens-v12-vague4.jsx` | 406 | Vague 4 (8 surfaces meta) — wrappers ambient | OK, principalement décoratif |
| 17 | `Visual System V1.2.html` | gros | Galerie pédagogique tokens | Référence visuelle, pas intégrée |
| 18 | `README.md` | 421 | Documentation handoff complète | Riche, mais 3 décalages avec le code (cf. §6) |

**Total** : ~8 300 lignes effectives. Rythme de livraison cohérent avec le plan annoncé.

### 1.2 Conformité au plan 5 vagues annoncé

Le mega-prompt V1.2 et le README annoncent **6 vagues d'amplification** mais seules **3 vagues** d'amplification sont livrées (Vague 2, 3, 4) en plus du socle V1.1 (Vague 1 implicite = base préservée). Pas de Vague 5 ou 6 dans le pack. **Pas un défaut** — V4 conclut sur "Vague finale" et couvre les 24 écrans.

| Vague | Promis | Livré | Écrans |
|-------|--------|-------|--------|
| 1 (V1.1 base) | oui | ✅ | tous V1.1 préservés |
| 2 (cœur) | oui | ✅ | Home, Capture, KairosDetail, Portrait, AnimaVoute, Chat, Reentry, BigDreamSignal |
| 3 (secondaires) | oui | ✅ | Journal, ForetFirst, Cercle, FigureDetail, Meteo, Polyphonie, Annales (wrap), Conte-miroir (wrap) |
| 4 (meta) | oui | ✅ | Onboarding, OracleCorps, Notifs, Privacy, Abonnement, OffreKairos, Modal, ConstellationGeneric |
| 5/6 (V2) | non chiffré | — | Pas attendu — V5/V6 = roadmap V2 (notifs push, backend cercle, voix narratrice TTS, etc.) |

**Verdict §1.2** : conforme. Pack complet pour V1.2.

### 1.3 Anti-perte total V1 + V1.1 ?

**OUI, propre.** Tous les fichiers V1.1 (`screens-shared.jsx`, `screens-core.jsx`, `screens-deep.jsx`, `screens-cercle.jsx`, `screens-anima.jsx`, `screens-soma.jsx`, `screens-meta.jsx`, `screens-figure.jsx`) sont présents intacts. Le pattern d'override `window.X = AmplifiedX` permet un rollback trivial (commenter une ligne `<script>` dans `Dream V1.html`).

Les 4 patches V1.1 critiques sont vérifiés présents et fonctionnels :
- **AhaCapture** (`screens-shared.jsx:13-83`) — appelé dans `KairosDetailV12`, `ChatV12` (msg ≥ 3), `ForetFirstV12` (phase resolve)
- **FeltShiftGate** (`screens-shared.jsx:88-161`) — appelé dans `KairosDetailV12` (post-reading)
- **ExitToHuman** (`screens-shared.jsx:166-251`) — appelé dans `KairosDetailV12`, `PortraitV12`, `ChatV12`, `ForetFirstV12` (phase angles), `FigureDetailV12`
- **FeedbackFloat** (`screens-figure.jsx:219-229`) — présent sur **tous les écrans V1.2** (vérifié grep par écran)

**Verdict §1.3** : ✅ anti-perte respectée intégralement.

---

## §2 — Audit screen-by-screen (24 + 1 écrans)

Pour chaque écran : matter / géosymbole / halo / Wow / V1.1 patches / anti-patterns / vocabulaire / verdict.

### 2.1 Home (`HomeV12`, vague 2)
- **Matter** : `linen` (cohérent spec §4 mega-prompt — substrat quotidien) ✅
- **Géosymbole** : `spirale` opacité 0.08 fond ✅
- **Halo** : `silk` respirant 6s breath welcome (auto-fade après 6.2s) ✅
- **Wow** : aucun déclenché Home (correct — Wow0 = onboarding, Wow1 = capture)
- **V1.1 patches** : `FeedbackFloat` ✅
- **Anti-patterns** : pas de gamification, pas de stats. "ce que le journal tient en ce moment" — vocabulaire désensorcelé ✅
- **Vocabulaire** : `whisper`, `kairos t'attend`, `déposer` — sobre, infusé ✅
- **Verdict** : 🟢 **GREEN**

### 2.2 Capture (`CaptureV12`, vague 2)
- **Matter** : `ember` motion `flicker` (gate) → `silk` (post) ✅ — gate somatique respecté
- **Géosymbole** : aucun (pur breath circle + Spirale Wow1 overlay)
- **Halo** : `ember` derrière breath circle (gate), `silk` post-dépôt
- **Wow** : **Wow1 (`premier-kairos`)** déclenché correctement via `wowRegistry.fire("premier-kairos")` + `SpiraleWowOverlay` 1.9s + son `ceremoniel`
- **V1.1 patches** : pas applicable
- **Anti-patterns** : pas de "Save successful!", `chips` type kairos en post — option, pas obligatoire ✅
- **Vocabulaire** : "Trois respirations. Sens tes pieds. Tu es là.", "Ton kairos est arrivé. Il dort 24 h avant que les échos ne murmurent." — superbe ✅
- **Verdict** : 🟢 **GREEN**

### 2.3 Journal (`JournalV12`, vague 3)
- **Matter** : `paper` opacité 0.6 ✅
- **Géosymbole** : `songlines` opacité 0.06 fond + `spirale` sur cards bigDream (0.18) ✅
- **Halo** : `silk` sur kairos numinous (top-right card), `bigdream` sur cards bigDream (inset 0) ✅
- **Wow** : aucun (correct — wow3 dans KairosDetail)
- **V1.1 patches** : `FeedbackFloat` + `SeasonalCompass` (compass saisonnière dans header) ✅
- **Filtres** : 6 chips type (tout, rêves, signes, rêveries, synchronicités, notes de vie) ✅
- **Anti-patterns** : pas de "X entries", "filtré par X" — juste un titre. Card bigdream sans label visible (juste halo) — fidèle à la spec "no badge, just a halo that breathes" ✅
- **Vocabulaire** : "lune décroissante de mars" comme divider ✅
- **Verdict** : 🟢 **GREEN**

### 2.4 Détail Kairos (`KairosDetailV12`, vague 2)
- **Matter** : `linen` opacité 0.5 ✅
- **Géosymbole** : `spirale` opacité 0.10 (0.22 si BigDream pulse) ✅
- **Halo** : `silk` standard, `bigdream` si bigDream — dynamique selon `entry.numinous`/`entry.bigDream` ✅
- **Wow** : **Wow3 (`big-dream-marquage`)** déclenché si `entry.bigDream` après 800ms + `playRitual("ceremoniel")` + pulse 4.5s ✅
- **V1.1 patches** : `FeltShiftGate` post-reading ✅, `AhaCapture` après felt-shift ✅, `ExitToHuman` ✅, `FeedbackFloat` ✅
- **Composants V1.1** : Modal "reading" (Ta lecture, en premier) + Modal "burn" (suppression cryptographique) ✅
- **Anti-patterns** : "la forêt parle après toi. offre d'abord ta lecture." — P-Inversion respecté ✅
- **Vocabulaire** : "que vois-tu ?", "demander à la forêt", "brûler" — sobre ✅
- **Verdict** : 🟢 **GREEN** (l'un des écrans les plus aboutis)

### 2.5 Portrait (`PortraitV12`, vague 2)
- **Matter** : `stone` opacité 0.6 (cohérent avec "constellation = pierre / structure")
- **Géosymbole** : aucun (la constellation est elle-même le géosymbole vivant) ✅
- **Halo** : aucun ambient (les nodes ont leur propre `halo` SVG via `ConstellationD3`) ✅
- **Wow** : **Wow2 (`naissance-noeud` ou arrivée constellation)** — pas explicitement firé ici (constellation se construit progressivement via d3-force avec drift particles). README dit "wow2 = constellation Portrait apparait" mais le code n'appelle pas `wowRegistry.fire("naissance-noeud")` à l'arrivée. **Discrepancy mineure** — la magie visuelle est là mais le registry n'est pas marqué ⚠️
- **V1.1 patches** : `ExitToHuman`, `FeedbackFloat` ✅
- **Anti-patterns** : pas de stats nodes, pas de "X figures · Y kairos" en chiffre brut. Légende discrète ✅
- **Vocabulaire** : "voix mobilisées cette lune · aizenstat · moss · bachelard" ✅
- **Verdict** : 🟡 **YELLOW** (Wow2 doit être branché explicitement — patch 1 ligne)

### 2.6 Voûte Anima Mundi (`AnimaVouteV12`, vague 2)
- **Matter** : `earth` opacité 0.6 ✅
- **Géosymbole** : `songlines` 0.18 fond + `demi-cercle` aurore haut 0.7 ✅
- **Halo** : aucun (la constellation porte la magie)
- **Wow** : aucun déclaré
- **V1.1 patches** : `FeedbackFloat` ✅
- **Constellation** : 28 nodes générés (mix bigdream/holding/member), edges hub-and-spoke + cross-links (~40 edges)
- **Anti-patterns** : "Cette lune, l'humanité a déposé environ 47 000 moments — rêves, signes, traversées." → chiffre rond, pas un "12 392 → +8.7%". OK ✅. Une chambre `Tenu ensemble` est `disabled` (V2) — annoncé honnêtement
- **Vocabulaire** : "Anima Mundi" gardé tel quel (validé Tim 2026-04-24) ✅
- **Verdict** : 🟢 **GREEN**

### 2.7 Météo (`MeteoV12`, vague 3)
- **Matter** : `water` opacité 0.7 ✅ (signature climat onirique)
- **Géosymbole** : `songlines` 0.18 pleine page + symbole eau central SVG custom ✅
- **Halo** : `earth` ancrage bas 0.4 + `silk` 0.6 derrière symbole eau central ✅
- **Wow** : aucun (paysage)
- **V1.1 patches** : `FeedbackFloat` ✅
- **Anti-patterns** : zéro chiffre KPI. "Beaucoup de portes qui ne s'ouvrent pas tout de suite." — paysage textuel, pas dashboard ✅
- **Vocabulaire** : "Le temps qu'il fait dans la nuit" — magnifique. "▽ nuages thématiques", "▽ tournures qui montent", "▽ journal de vie collectif" — métaphore météo intégrale ✅
- **Verdict** : 🟢 **GREEN** (l'un des plus poétiques)

### 2.8 Polyphonie (`PolyphonieV12`, vague 3)
- **Matter** : `linen` opacité 0.65 ✅
- **Géosymbole** : `demi-cercle` aurore haut 0.55 ✅
- **Halo** : `silk` 0.4 derrière texte ✅
- **Wow** : drop cap silk-gold sur §1 (`bigdream-dropcap`) ✅
- **V1.1 patches** : `FeedbackFloat` ✅
- **Vocabulaire** : "À la lumière de Bachelard, on pourrait entendre…" / "Aizenstat aurait invité à tenir…" / "Et Moss, on l'imagine dire" — voix conditionnelle parfaite, P-Inversion respectée ✅
- **Anti-patterns** : aucun. Texte continu, pas de bullets, pas de KPI. "Que se cherche-t-elle, l'eau qui cherche son lit ?" — question ouverte finale ✅
- **Verdict** : 🟢 **GREEN**

### 2.9 Annales (`AnnalesV12`, vague 3 — wrapper)
- **Matter** : `stone` opacité 0.55 (en wrapper) ✅
- **Géosymbole** : `cercle-concentrique` (alias) opacité 0.10 ✅ (alias résolu vers `concentric` dans `shared-v12.jsx:67`)
- **Halo** : `silk` opacité 0.4 haut-gauche ✅
- **Pattern** : wrapper autour de `__AnnalesOriginal` — pas de réécriture (V1.1 logique préservée)
- **Vocabulaire** : géré par l'original (déjà désensorcelé)
- **Verdict** : 🟢 **GREEN** (low-touch volontaire)

### 2.10 Offre Anima Mundi / Offre au Kairos (`OffreKairosV12`, vague 4 — wrapper)
- **Matter** : `silk` opacité 0.7 ✅
- **Géosymbole** : `spirale` ample 0.12 ✅
- **Halo** : `bigdream` pleine puissance 0.55 inset 0 ✅
- **Son** : `playRitual("ceremoniel")` à l'ouverture ✅
- **Wow** : non explicitement firé via wowRegistry, mais c'est un moment cérémoniel (rare, pas tous les jours)
- **Verdict** : 🟢 **GREEN**

### 2.11 Cercle (`CercleV12`, vague 3)
- **Matter** : `earth` opacité 0.55 ✅
- **Géosymbole** : `cercle-concentrique` (alias) discret 0.07 top-right ✅
- **Halo** : aucun (constellation porte le visuel)
- **Constellation** : **constellation des KAIROS partagés (pas membres)** — fondamentale (P-anti-MLM, k-anonymity 5+) ✅
- **Wow** : Wow5 (`premiere-restitution-cercle`) **non branché** — annoncé honnêtement par README §8.1 comme "logique prête, trigger pas câblé en V1.2"
- **V1.1 patches** : `FeedbackFloat` ✅, `ReadingRequestModal` (modal V1.1) préservé ✅
- **Vocabulaire** : "les pieds dans la même rivière" — métaphore organique. "les rêves ici sont anonymisés — la trame compte plus que la signature" — éthique transparente ✅
- **Anti-patterns** : pas de "active members" count, pas de leaderboard. ✅
- **Verdict** : 🟢 **GREEN** (Wow5 = V2)

### 2.12 Créer un cercle (`CreerCercleScreen`, V1.1 base, pas amplifié vague 2-4)
- **Matter** : aucun (V1.1 sans wrapper V1.2)
- **Géosymbole** : aucun
- **Halo** : aucun
- **Wow** : aucun
- **V1.1 patches** : `FeedbackFloat` (présent dans V1.1 base)
- **Verdict** : 🟡 **YELLOW** (oubli mineur — aurait pu recevoir un wrapper V1.2 type `Surface matter="stone"` + `HaloRespire kind="silk"`. Pas critique mais visible si on ouvre Tweaks)

### 2.13 Rejoindre cercle (`RejoindreScreen`, V1.1 base)
- Mêmes constats que §2.12. 🟡 **YELLOW** (oubli amplification ambient)

### 2.14 Partager rêve au cercle (`PartagerReveScreen`, V1.1 base)
- Mêmes constats. 🟡 **YELLOW** (oubli amplification ambient)

### 2.15 Détail Figure (`FigureDetailV12`, vague 3)
- **Matter** : `paper` opacité 0.55 ✅
- **Géosymbole** : aucun (le glyph de la figure est lui-même le symbole)
- **Halo** : `silk` derrière glyph 0.55 ✅
- **Wow** : drop cap sur description (`bigdream-dropcap`) ✅
- **V1.1 patches** : `ExitToHuman` ✅, `FeedbackFloat` ✅
- **Anti-patterns** : "ce ne sont pas des conclusions. des motifs que nous avons remarqués — tu peux ne pas les voir comme nous." — anti-diagnostic, P-Tenir ✅
- **Vocabulaire — dialogue figure** : prompt système strict ("pas de archétypes/inconscient/symboles/aspects/fragments. Tu es cette figure, pas son commentateur. 1-3 phrases max.") — anti-ventriloquie respectée par la **contrainte de prompt**, mais c'est une zone fragile : le user peut se sentir parler à sa grand-mère. Le bandeau "ce n'est pas la figure elle-même — c'est une écoute imaginée, tenue par l'app" sauve la pose ✅
- **Verdict** : 🟢 **GREEN**

### 2.16 Oracle Corps (`OracleCorpsV12`, vague 4 — wrapper)
- **Matter** : `earth` opacité 0.55 ✅
- **Géosymbole** : `cercle-concentrique` (alias) 0.08 derrière silhouette ✅
- **Halo** : `earth` 0.45 centré sur corps ✅
- **CSS additionnel** : `.oracle-zone` avec pulse 6s `oraclePulse` ✅
- **Verdict** : 🟢 **GREEN**

### 2.17 Conte-miroir (`ConteMiroirV12`, vague 3 — wrapper)
- **Matter** : `silk` opacité 0.5 ✅
- **Géosymbole** : `spirale` ample 0.10 ✅
- **Halo** : `silk` 0.45 ✅
- **CSS additionnel** : drop cap silk-gold sur `.conte-card .body::first-letter` ✅
- **Verdict** : 🟢 **GREEN**
- **Note non bloquante** : le mega-prompt dit "CONTE = 100% sous-forêt contes RÉELS, JAMAIS conte IA généré". Le wrapper V1.2 n'introduit pas de conte IA — il ambient l'écran original V1.1. ✅

### 2.18 Réentrée (`ReentryV12`, vague 2 — wrapper)
- **Matter** : `earth` opacité 0.55 (wrapper extérieur) — README annonce "ember/earth selon phase" mais wrapper applique earth ambient global, ember dans halo seulement
- **Géosymbole** : `triangle` rituel 0.10 top-center ✅
- **Halo** : `ember` 0.5 ✅
- **Verdict** : 🟢 **GREEN** (limitation lucide annoncée README §2.2 : on ne peut pas inspecter la phase depuis l'extérieur du wrapper)

### 2.19 Onboarding P-Zéro (`OnboardingV12`, vague 4 — wrapper)
- **Matter** : `ember` opacité 0.45 ✅
- **Géosymbole** : `spirale` 0.07 bas ✅
- **Halo** : `silk` 0.4 centre ✅
- **Wow** : Wow0 implémenté via `localStorage.getItem("dream:wow0:fired")` direct (pas via `wowRegistry`). **Discrepancy** : `wowRegistry.list` n'inclut PAS `wow0` — le pattern Wow0 est traité hors registry. ⚠️ (pas bloquant mais incohérent)
- **Son** : `playRitual("seuil")` au mount premier passage + `playRitual("souffle")` à chaque step ✅
- **Verdict** : 🟡 **YELLOW** (Wow0 hors registry — décider : intégrer wow0 dans `WOW_NAMES` OU documenter formellement la dichotomie)

### 2.20 Privacy (`PrivacyV12`, vague 4 — wrapper)
- **Matter** : `bone` opacité 0.5 ⚠️ **BUG : pas de bed-bone dans styles.css ni filter noise-bone dans HTML — Surface vide silencieuse**
- **Géosymbole** : `spirale` 0.08 right ✅
- **Halo** : aucun
- **Verdict** : 🔴 **RED** (matter "bone" non défini → matter bed invisible. Patch obligatoire)

### 2.21 Notifications (`NotifsV12`, vague 4 — wrapper)
- **Matter** : `linen` opacité 0.55 ✅
- **Géosymbole** : `demi-cercle` 0.3 haut ✅
- **CSS** : tous labels en serif italique = "chuchotement" ✅
- **Verdict** : 🟢 **GREEN**

### 2.22 Abonnement (`AbonnementV12`, vague 4 — wrapper)
- **Matter** : `paper` opacité 0.55 ✅
- **Halo** : `silk` 0.35 ✅
- **Anti-patterns** : commentaire dans le code "pas de premium, pas d'urgence, juste une offre tenue" ✅
- **Verdict** : 🟢 **GREEN**

### 2.23 Feedback in-app (`FeedbackFloat` + `FeedbackModal`, V1.1 base)
- **Matter** : aucun (modal V1.2 prend le relais via `ModalV12`)
- **Géosymbole/Halo** : ambient via `ModalV12` (matter `paper`, halo `silk`)
- **Vocabulaire** : "ce qui te traverse ?", "léger — pour plus tard / ça me trouble / urgent — ça blesse", crisis safety net SOS Amitié + 3114 ✅
- **Verdict** : 🟢 **GREEN** (préservé V1.1, déjà excellent)

### 2.24 BigDream Signal (`BigDreamSignalV12`, vague 2 — nouvel écran)
- **Matter** : `ember` opacité 0.7 ✅
- **Géosymbole** : `spirale` silk 0.12 bas-droite ✅
- **Halo** : `bigdream` combiné 0.7 ✅
- **Wow** : Wow3 firé après 1.2s via `wowRegistry.fire("big-dream-marquage")` + `playRitual("ceremoniel")` ✅
- **Anti-patterns** : "Pas de label visible dans le journal — juste un halo qui respire." — fidèle à la doctrine "no badge, just an atmosphere" ✅
- **Vocabulaire** : "let_the_dream_live · synthèse délibérément minimale · jung a laissé son rêve travailler 30 ans" en footer mono ✅
- **Verdict** : 🟢 **GREEN** (l'un des plus emblématiques)

### 2.25 Forêt FIRST (`ForetFirstV12`, sous-route, vague 3)
- **5 phases** : `user-reading | loading | angles | felt-shift | resolve` ✅
- **Matter** : `paper` (phase 1) → `silk` (phases 2-5) ✅
- **Halo** : `silk` 0.6 (phase 2 loading), 0.4 (phase 5) ✅
- **Wow** : Wow4 (`naissance-noeud`)... attendu mais **non firé explicitement** dans la phase resolve. README §7 dit "Wow4 = premier Aha capturé pendant Forêt FIRST" — l'AhaCapture s'ouvre bien, mais wowRegistry n'est pas marqué pour `naissance-noeud`. ⚠️
- **V1.1 patches** : `AhaCapture` (phase resolve) ✅, `ExitToHuman` (phase angles) ✅, `FeedbackFloat` ✅
- **Anti-patterns** : "Ces lectures sont des hypothèses, pas des vérités. Aucune n'est plus juste qu'une autre. Vois laquelle bouge quelque chose dans ton corps." — anti-diagnostic, anti-vérité IA ✅. "326 livres veillent" — chiffre rond évocateur, pas KPI
- **Vocabulaire — angles** : "À la lumière d'Aizenstat, on pourrait entendre…" / "Bachelard aurait invité à voir…" / "Pour Moss, les portes…" — voix conditionnelle parfaite, P-Inversion ✅
- **Verdict** : 🟢 **GREEN** (l'un des écrans les plus aboutis ; juste Wow4 à brancher)

### 2.26 Récap Wow registry vs spec README

| Wow | Spec README | Code wowRegistry | État |
|-----|-------------|------------------|------|
| Wow0 (premier accès Onboarding) | "wow0" | **Hors registry** (`localStorage("dream:wow0:fired")`) | ⚠️ incohérent |
| Wow1 (premier kairos) | "wow1" | `"premier-kairos"` ✅ firé in CaptureV12 | OK |
| Wow2 (constellation Portrait) | "wow2" | `"premier-echo-prophetique"` (mismatch nom) — **non firé in PortraitV12** | ⚠️ pas branché |
| Wow3 (BigDream marquage) | "wow3" | `"big-dream-marquage"` ✅ firé in KairosDetailV12 + BigDreamSignalV12 | OK |
| Wow4 (naissance noeud / Aha Forêt) | "wow4" | `"naissance-noeud"` — **non firé in ForetFirstV12** | ⚠️ pas branché |
| Wow5 (premier rituel cercle) | "wow5" | `"premiere-restitution-cercle"` — **non firé** | ⚠️ V2 attendu |

Sur 5 Wow nommés, **2 sont câblés (Wow1, Wow3)**, **2 sont définis mais non branchés (Wow2, Wow4)**, **1 est V2 (Wow5)**, et **Wow0 est hors registry**.

C'est un état intermédiaire plus tiède que ce que le README laisse entendre. **Pas bloquant pour l'intégration prod** (les Wow câblés visuellement fonctionnent), mais le claim "5 Wow câblés" est exagéré. **Patches simples** : 4 lignes à ajouter (1 dans PortraitV12, 1 dans ForetFirstV12, intégrer wow0 dans WOW_NAMES, documenter wow5 V2).

---

## §3 — Audit composants V1.2 partagés (`shared-v12.jsx`)

### 3.1 `<Surface matter motion boost children />`

API propre : `matter` (8 valeurs), `motion` (true|"flicker"|"drift"|false), `boost` (auto si matter ∈ {paper,silk,water,ember,earth}). `as` polymorphique.

**Bug 1 BLOCANT** — ligne 45 :
```jsx
<div className={`bed-noise ...`} style={{ filter: `url(#n-${matter})` }}></div>
```

**Référence un filter `#n-paper`, `#n-silk`, etc. qui n'existe nulle part.** Les filters HTML `Dream V1.html:17-24` s'appellent `noise-paper`, `noise-silk`, etc. (préfixe `noise-`, pas `n-`). Conséquence : **le navigateur ignore silencieusement le filter inexistant → le bed-noise overlay n'a aucune texture SVG appliquée → Surface = juste le bed coloré (gradient radial) sans grain.**

L'effet visuel est tronqué : on perd ~50% de la "matière" (Tanizaki / Albers / Bachelard) que la Vague 2-4 cherche à incarner. Le piano ne sonne pas — on entend juste les harmoniques basses sans la texture.

**Patch obligatoire AVANT intégration prod** : 2 options
- (A) Renommer dans `shared-v12.jsx:45` `url(#n-${matter})` → `url(#noise-${matter})`
- (B) Renommer dans `Dream V1.html:17-24` les filter id `noise-paper` → `n-paper`

Option A préférable (plus court, cohérent avec README qui pointe vers les filtres `noise-*` dans HTML).

**Bug 2 BLOCANT** — ligne 35 :
```jsx
const Surface = ({ matter = "linen", ... })
```

Le composant accepte 8 matters (`paper, silk, linen, earth, stone, water, ember, bone`) mais **`bone`** n'a :
- Pas de `bed-bone` dans `styles.css`
- Pas de `<filter id="noise-bone">` dans `Dream V1.html`

Conséquence : Privacy (`PrivacyV12`, vague 4) qui utilise `matter="bone"` aura un bed transparent + le bug 1 ci-dessus. **Surface invisible** sur Privacy. Patch :
- Ajouter `bed-bone` dans `styles.css` (ex : `radial-gradient(ellipse at 50% 50%, color-mix(in oklch, var(--bone) 12%, transparent), transparent 70%), var(--night-warm)`)
- Ajouter `<filter id="noise-bone">` dans `Dream V1.html` defs (couleur ~oklch(0.78 0.015 70) → matrice RGB ~0.78/0.72/0.62)

### 3.2 `<HaloRespire kind style />`

3 kinds (`silk`, `ember`, `bigdream`). CSS classes `halo-silk-respire`, `halo-ember-respire`, `halo-bigdream-combine` — toutes définies (`styles.css:1011-1066`) avec `radial-gradient` + `filter:blur` + `animation` keyframes propres. `prefers-reduced-motion` désactivé pour ces classes. **OK**.

### 3.3 `<GeoSymbol kind color opacity style />`

6 kinds (`spirale, concentric, triangle, demi-cercle, songlines, croissant`) + 2 alias V1.2 (`cercle-concentrique → concentric`, `demi-cercle-aurore → demi-cercle`).

SVG paths inline propres :
- `spirale` : log spiral (a=2, b=0.18, 3.5 turns, 200 steps) — formule mathématique correcte
- `concentric` : 3 cercles r=40/60/80 — animation `concentric-breath` 6s avec stagger via `nth-child` ✅
- `triangle` : 2 polygons (extérieur + intérieur 0.5 opacity)
- `demi-cercle` : 2 paths quadratiques
- `songlines` : 6 paths ondulants `Q...T...`
- `croissant` : path lunaire 2 arcs

Référence `<linearGradient id="aurore-gradient">` dans `styles.css:1248` `stroke: url(#aurore-gradient)` — **mais le gradient `aurore-gradient` n'est défini NULLE PART dans le HTML ni en SVG inline**. Ligne `.demi-cercle-aurore path { stroke: url(#aurore-gradient); }` est cassée → tombera sur `currentColor` (ash-light) par défaut. **Bug visuel mineur** — le demi-cercle aurore ne sera pas doré-rosé. Patch : ajouter le gradient dans la `<defs>` HTML.

### 3.4 `<ConstellationD3 nodes edges focalId ... />`

Implémentation propre :
- `forceSimulation` avec `link / charge / center / collide` — paramètres calibrés (charge -260 bigdream, -130 autres ; collide r=32/20)
- focal pinning via `f.fx/f.fy` ✅
- ResizeObserver pour responsive ✅
- Throttle ~60fps via timestamp ✅
- Drag handler propre (mousedown → window listeners → cleanup au mouseup) ✅
- Edges Bézier avec courbure perpendiculaire (ligne 334-346) — élégant ✅
- Particules drift avec animation indépendante (12 particles, vitesse ±0.0002, sin-modulated opacity) ✅
- Cleanup propre `sim.stop() + cancelAnimationFrame(raf)` au unmount ✅

**Risque** : la dependency array du useEffect (ligne 273) est complexe avec `JSON.stringify(nodes.map(n=>n.id))` — chaque rerender qui passe `nodes`/`edges` recrée la sim. C'est OK pour le proto (datasets statiques) mais en prod avec données Supabase live, **il faudra ne pas re-instancier nodes/edges à chaque render** (memoize côté caller).

**CSS** (`styles.css:1110-1173`) : node halo pulse 6s, edge.alive avec stroke-dasharray + animation `edge-pulse` 4s, particles silk-gold. ✅

**Pas de bug bloquant** — composant production-ready avec garde-fou côté caller.

### 3.5 `wowRegistry` & `playRitual` & `useWowFire`

- **wowRegistry** : 5 noms (cf. tableau §2.26), API `has/fire/demo/reset/subscribe`, persistance localStorage `"dream:wow-fired"`, dispatch `CustomEvent("wow:fire")` — **API solide**. Pas de race condition (operations atomiques sur localStorage).
- **playRitual** : Web Audio synthétique 5 sons (souffle/braise/tisse/ceremoniel/ancrage) — code propre, sustain/release via gain.linearRampToValueAtTime. Toggle opt-in via `localStorage("dream:ritual-sound")` (default ON). **Risque mobile** : iOS exige user gesture pour `AudioContext.resume()` — code gère bien `if (ctx.state === "suspended") ctx.resume()` mais le premier son pourrait être muet si pas de gesture précédent. **Pas bloquant** pour V1.2 (la plupart des sons arrivent après un click user).
- **useWowFire(name, callback)** : hook abonnement event ✅

**Doublon nommage** : `WOW_NAMES` (`shared-v12.jsx:405`) utilise des noms verbaux (`"premier-kairos"`, `"premier-echo-prophetique"`, etc.) tandis que README §7 utilise des codes (`"wow0"`, `"wow1"`, etc.). Le code fait foi, mais c'est confondant pour un dev qui lit le README seul. **À harmoniser dans la doc d'intégration prod.**

### 3.6 `SpiraleWowOverlay`

40 lignes propres, `useEffect` cleanup, `setTimeout 1900ms` puis `onDone`. CSS animation `spirale-draw 1800ms cubic-bezier(0.7,0,0.3,1) forwards` avec `stroke-dashoffset` 800→0 + opacity fade. ✅

### 3.7 Surcharges `window.X`

Pattern `window.__OriginalX = window.X; window.X = AmplifiedX;` dans 3 fichiers V1.2. Pas de race condition (Babel transforme tout en JS sync, exécution séquentielle). Le `app.jsx` lit `window.*` au render — donc l'ordre de chargement du HTML est critique.

**MAIS** : cf. §5.1 — l'ordre déclaré dans `Dream V1.html` charge `shared-v12.jsx` AVANT les V1.1, ce qui inverse la doctrine annoncée. À analyser.

---

## §4 — Audit `styles.css` V1.2 layer

`styles.css` fait 1 278 lignes. La couche V1.2 commence ligne 905 (commentaire "V1.2 AMPLIFICATION LAYER").

### 4.1 Tempi organiques + easings

```css
--tempo-souffle: 6000ms;    /* respiration ~10 cycles/min */
--tempo-braise:  3500ms;    /* pulsation ~17 BPM */
--tempo-derive:  12000ms;   /* dérive cosmologique */
--ease-souffle:  cubic-bezier(0.45, 0, 0.55, 1);
--ease-braise:   cubic-bezier(0.4, 0.1, 0.6, 0.9);
```

Cohérent avec mega-prompt V1.2. Easings physiques (pas linear). ✅

**Note** : `--respire` (mentionné dans le README ligne 283-284) **n'est pas défini**. Le README dit "garder `--respire: 6s`" mais le CSS utilise `--tempo-souffle: 6000ms`. Décalage doc/code mineur.

### 4.2 8 matter beds calibrés

Lignes 922-947 : `bed-linen, bed-silk, bed-stone, bed-paper, bed-ash, bed-water, bed-ember, bed-earth`. Tous présents avec radial/linear-gradient et fallback couleur. **`bed-bone` MANQUANT** (cf. §3.1 bug 2).

### 4.3 Motion patterns par matter

Lignes 957-1002 : 9 keyframes (`breathe-souffle, breathe-silk-strong, pulse-braise, drift-derive, water-flow-down, flicker-ember, silk-flow`) + 10 classes `.motion-*` (linen, silk-halo, silk-drift, stone, paper, ash, water, ember, ember-flicker, earth). Calibration cohérente avec spec mega-prompt §4 amplifiée. ✅

### 4.4 Halos respirants

Lignes 1011-1066 : `.halo-silk-respire, .halo-ember-respire, .halo-bigdream-combine` avec radial-gradient + filter:blur + keyframes propres. `mix-blend-mode: screen` pour ember (cohérent atmosphère). `bigdream-combine` utilise `::before` (silk) + `::after` (ember) — élégant. ✅

### 4.5 Géosymboles helpers

Lignes 1092-1259 : `.geo-symbol`, `.songlines-bg`, `.spirale-wow`, `.triangle-rituel`, `.concentric-rings`, `.demi-cercle-aurore`, `.croissant-lune`. Tous propres avec `vector-effect: non-scaling-stroke` (préserve épaisseur du trait au scale). ✅

### 4.6 Constellation D3 styles

Lignes 1110-1173 : `.constellation-d3`, `.edge`, `.edge.alive`, `.node circle.core/halo`, `.particle`. Bonne hiérarchie (core fill discret, halo SVG, focal silk-gold, bigdream filter:drop-shadow). ✅

### 4.7 prefers-reduced-motion

Ligne 1267-1278 : désactive `motion-*`, `halo-*`, `concentric-rings circle`, `constellation-d3 .node circle.halo`, `constellation-d3 .edge.alive`. **Bonne couverture accessibility**. ✅ Manque cependant `.spirale-wow path` (l'animation `spirale-draw` reste active si user demande reduced-motion). Patch mineur recommandé.

### 4.8 Conflits CSS V1.1 ?

Pas de doublon `bed-*`, `halo-*`, `geo-symbol-*`, `motion-*` entre V1.1 et V1.2. Les classes V1.2 ont des préfixes uniques. Le seul recouvrement est `.matter` (V1.1, ligne 60) vs `.bed` (V1.2, ligne 920) — utilisations différentes, pas de collision.

**Verdict §4** : 🟢 **GREEN** sauf bed-bone manquant (RED, patch obligatoire).

---

## §5 — Audit `Dream V1.html`

### 5.1 Ordre de chargement (point critique)

**Ordre RÉEL dans HTML lignes 45-57** :
```html
1. screens-shared.jsx        (V1.1 — AhaCapture, FeltShiftGate, ExitToHuman)
2. shared-v12.jsx            (V1.2 core — Surface, HaloRespire, GeoSymbol, ConstellationD3, wowRegistry, playRitual)
3. screens-core.jsx          (V1.1 — Home, Capture, Journal, TopNav, seedEntries)
4. screens-deep.jsx          (V1.1 — KairosDetail, Portrait, AnimaVoute, Meteo, Polyphonie, Chat, Modal, Constellation)
5. screens-cercle.jsx        (V1.1)
6. screens-anima.jsx         (V1.1)
7. screens-soma.jsx          (V1.1 — OracleCorps, ConteMiroir, Reentry)
8. screens-meta.jsx          (V1.1 — Onboarding, Privacy, Notifs, Abonnement)
9. screens-figure.jsx        (V1.1 — FigureDetail, FeedbackFloat, FeedbackModal)
10. screens-v12-amplified.jsx (V1.2 vague 2)
11. screens-v12-vague3.jsx    (V1.2 vague 3)
12. screens-v12-vague4.jsx    (V1.2 vague 4)
13. app.jsx                   (router)
```

**Ordre annoncé dans README §1.3** : V1.1 d'abord (1-9), puis V1.2 amplification (10-12). 

**MAIS** le README §1.3 oublie `shared-v12.jsx` qui est en fait position 2 (avant les V1.1) — et c'est CORRECT car `shared-v12.jsx` ne fait QUE définir des composants nouveaux (`Surface`, `HaloRespire`, etc.) sur `window`, sans surcharger les V1.1. Il doit être chargé tôt pour que les vagues 2/3/4 puissent référencer `window.Surface`, `window.HaloRespire`, etc.

L'ordre réel est **techniquement correct**. Le README est juste incomplet (omet la position 2). Pas un bug, juste un décalage doc.

### 5.2 8 noise filters matter présents ?

Lignes 17-24 du HTML : 8 filters (`noise-linen, noise-paper, noise-stone, noise-ash, noise-water, noise-ember, noise-silk, noise-earth`). **Manque `noise-bone`** (cf. bug 2 §3.1).

### 5.3 d3-force CDN chargé

Lignes 41-44 : `d3-dispatch@3, d3-quadtree@3, d3-timer@3, d3-force@3` (UMD via unpkg). Ordre correct (deps avant force). Attache à `window.d3`. ✅

### 5.4 React/Babel CDN

Lignes 37-39 : React 18.3.1 + ReactDOM 18.3.1 + Babel standalone 7.29.0. SRI integrity hashes présents. ✅

**Verdict §5** : 🟡 **YELLOW** (un filter manquant — `noise-bone` — sinon HTML propre).

---

## §6 — Audit `README.md`

24 465 caractères, 421 lignes. Très détaillé. Sections :
- §1 Inventaire (V1.1 + V1.2)
- §2 Architecture override pattern
- §3 Mapping écran → matter → halo → Wow → géosymbole (table récap)
- §4 Composants V1.2 partagés
- §5 Intégration codebase Next.js
- §6 Sons rituels (refs freesound)
- §7 5 Wow moments + trigger logic
- §8 Bugs connus / limitations / V2
- §9 Rapport audit V5

### 6.1 Décalages doc/code détectés

1. **README §3 table** : "Wow0/1/2/3/4/5" ; **code** `WOW_NAMES = ["premier-kairos", "premier-echo-prophetique", "big-dream-marquage", "naissance-noeud", "premiere-restitution-cercle"]`. Pas de Wow0 dans le registry (Wow0 hors registry, géré par `localStorage("dream:wow0:fired")` direct dans `OnboardingV12`).
2. **README §5.5 tokens CSS** : "garder `--respire: 6s, --ease-respire`" ; **code** utilise `--tempo-souffle: 6000ms, --ease-souffle`. Variables différentes.
3. **README §4.1 Surface** : "filtres `<filter id="matter-paper">` etc. dans `Dream V1.html` lignes 10-50" ; **code HTML** utilise `<filter id="noise-paper">` (jamais `matter-paper`). README erroné.
4. **README §1.3 ordre** : oublie `shared-v12.jsx` en position 2.
5. **README §7 Wow2** : "constellation Portrait apparait" → annonce un firing, mais `PortraitV12` ne fire jamais `wowRegistry.fire("premier-echo-prophetique")` ni autre.
6. **README §7 Wow4** : "premier Aha capturé pendant Forêt FIRST" → `ForetFirstV12` ouvre `AhaCapture` mais ne fire pas `wowRegistry.fire("naissance-noeud")`.

### 6.2 Mapping écran → matter

§3 table récap avec 25 entrées (24 + ForetFirst en sous-route). **Globalement fidèle au code**, sauf les Wow non câblés (cf. §6.1.5 et §6.1.6).

### 6.3 Instructions intégration Next.js

§5 : très bonnes — propose conversion ES modules, remplacement hash routing par next/router, migration `styles.css` vers `app/globals.css`, extraction SVG defs vers `<MatterDefs />` mounted in `app/layout.tsx`. **Roadmap réaliste** :
- Phase 1 (1-2j) : composants V12 portés TSX + MatterDefs + styles.css migrés
- Phase 2 (3-5j) : 8 écrans cœur Vague 2
- Phase 3 (3-4j) : 8 + 8 écrans Vague 3-4
- Phase 4 (2j) : wowRegistry + playRitual avec sons réels
- Phase 5 (1j) : audit visuel polish

**Mon estimation** : 12-16 jours-dev pour port complet. Plausible si dev solo expérimenté React/CSS.

### 6.4 Pièges connus annoncés

§5.4 mentionne :
- `color-mix(in oklch, …)` : Safari < 16.4 ⚠️
- `textWrap: "pretty"` : Chrome ≥ 117, Safari ≥ 17.5
- `<ConstellationD3>` dépend de d3-force
- TWEAK_DEFAULTS écrase hash au mount (disparaît avec next/router)
- `window.claude.complete()` mocké en proto

**Bonne lucidité.** Manque seulement les 2 bugs bloquants (filter ID + bone matter).

### 6.5 Bugs résolus annoncés

§8.2 : `cercle-concentrique` aliasé → vérifié ✅, `useState/useEffect` aliases (uS/uE/uMS/uSS/v3S/v4S) → vérifié ✅, Modal V1.2 backdrop pointer-events → vérifié ✅.

**Verdict §6** : 🟡 **YELLOW** — README riche et utile mais 6 décalages avec le code à corriger pour le dev qui prend la suite.

---

## §7 — Mapping COMPLET 25 écrans (table récap)

| # | Écran | Vague | Matter | Géosymbole | Halo | Wow | V1.1 patches | Verdict |
|---|-------|-------|--------|------------|------|-----|--------------|---------|
| 1 | Home | V2 | linen | spirale 0.08 | silk welcome 6.2s | — | FeedbackFloat | 🟢 GREEN |
| 2 | Capture | V2 | ember/silk | — / SpiraleWow | ember gate / silk post | **Wow1 ✅** | — | 🟢 GREEN |
| 3 | Journal | V3 | paper | songlines + spirale BD | silk numinous + bigdream BD | — | FeedbackFloat + SeasonalCompass | 🟢 GREEN |
| 4 | Détail Kairos | V2 | linen | spirale | silk/bigdream | **Wow3 ✅** | FeltShiftGate + AhaCapture + ExitToHuman + FeedbackFloat | 🟢 GREEN |
| 5 | Portrait | V2 | stone | constellation D3 | nodes own halos | **Wow2 ⚠ pas firé** | ExitToHuman + FeedbackFloat | 🟡 YELLOW |
| 6 | Voûte Anima Mundi | V2 | earth | songlines + demi-cercle | constellation D3 | — | FeedbackFloat | 🟢 GREEN |
| 7 | Météo | V3 | water | songlines + symbole eau | earth bas + silk centre | — | FeedbackFloat | 🟢 GREEN |
| 8 | Polyphonie | V3 | linen | demi-cercle | silk + drop cap | — | FeedbackFloat | 🟢 GREEN |
| 9 | Annales | V3 (wrap) | stone | concentric | silk | — | (V1.1 préservé) | 🟢 GREEN |
| 10 | Offre Kairos | V4 (wrap) | silk | spirale ample | bigdream pleine | son ceremoniel | — | 🟢 GREEN |
| 11 | Cercle | V3 | earth | concentric discret | constellation D3 KAIROS (k-anonymity) | Wow5 V2 | FeedbackFloat | 🟢 GREEN |
| 12 | Créer cercle | V1.1 | — | — | — | — | FeedbackFloat | 🟡 YELLOW |
| 13 | Rejoindre cercle | V1.1 | — | — | — | — | FeedbackFloat | 🟡 YELLOW |
| 14 | Partager rêve | V1.1 | — | — | — | — | FeedbackFloat | 🟡 YELLOW |
| 15 | Détail Figure | V3 | paper | — (glyph custom) | silk derrière glyph | drop cap description | ExitToHuman + FeedbackFloat | 🟢 GREEN |
| 16 | Oracle Corps | V4 (wrap) | earth | concentric | earth pulse zones | — | (V1.1 préservé) | 🟢 GREEN |
| 17 | Conte-miroir | V3 (wrap) | silk | spirale ample | silk | drop cap conte | (V1.1 préservé) | 🟢 GREEN |
| 18 | Réentrée | V2 (wrap) | earth | triangle rituel | ember | — | (V1.1 préservé) | 🟢 GREEN |
| 19 | Chat narratrice | V2 | paper | — | silk derrière IA | — | AhaCapture (msg≥3) + ExitToHuman + FeedbackFloat | 🟢 GREEN |
| 20 | BigDream Signal | V2 | ember | spirale | bigdream combiné | **Wow3 ✅** | FeedbackFloat | 🟢 GREEN |
| 21 | Onboarding P-Zéro | V4 (wrap) | ember | spirale bas | silk centre | **Wow0 ⚠ hors registry** | (V1.1 préservé) | 🟡 YELLOW |
| 22 | Privacy | V4 (wrap) | **bone ❌** | spirale | — | — | (V1.1 préservé) | 🔴 RED |
| 23 | Notifs | V4 (wrap) | linen | demi-cercle | — | — | (V1.1 préservé) | 🟢 GREEN |
| 24 | Abonnement | V4 (wrap) | paper | — | silk discret | — | (V1.1 préservé) | 🟢 GREEN |
| 25 | Forêt FIRST | V3 | paper→silk | constellation 5pts loading | silk | **Wow4 ⚠ pas firé** | AhaCapture + ExitToHuman + FeedbackFloat | 🟢 GREEN |

**Bilan visuel** :
- 18 GREEN
- 6 YELLOW (3 cercle V1.1 non amplifiés + Portrait/Onboarding/ForetFirst Wow non firé)
- 1 RED (Privacy bone matter cassé)

---

## §8 — Bugs / régressions / blocants détectés

### 8.1 Bugs BLOCANTS (RED) — patcher AVANT intégration prod

#### Bug A — Filter SVG ID mismatch
**Fichier** : `shared-v12.jsx:45`
**Symptôme** : `style={{ filter: url(#n-${matter}) }}` référence des filters inexistants. Les filters HTML sont nommés `noise-{matter}`, pas `n-{matter}`. Conséquence : **bed-noise overlay invisible sur TOUS les écrans V1.2** → matter a ~50% de sa profondeur visuelle.
**Patch** :
```diff
- <div className={`bed-noise ...`} style={{ filter: `url(#n-${matter})` }}></div>
+ <div className={`bed-noise ...`} style={{ filter: `url(#noise-${matter})` }}></div>
```
**Effort** : 1 ligne. **Test** : ouvrir Home dans Dream V1.html, devtools, vérifier que `.bed-noise` reçoit bien le grain SVG.

#### Bug B — Matter "bone" non défini
**Fichiers** : `styles.css` (ajout) + `Dream V1.html` (ajout)
**Symptôme** : `PrivacyV12` utilise `matter="bone"` → bed transparent + filter inexistant → Surface invisible. Privacy = écran nu sur fond noir.
**Patch CSS** (ajouter dans la section V1.2 layer styles.css ligne ~947) :
```css
.bed-bone { background:
  radial-gradient(ellipse at 50% 30%, color-mix(in oklch, var(--bone) 14%, transparent), transparent 60%),
  radial-gradient(ellipse at 50% 70%, color-mix(in oklch, var(--bone) 8%, transparent), transparent 65%),
  var(--night-warm); }
.motion-bone { animation: breathe-souffle calc(var(--tempo-souffle) * 1.3) var(--ease-souffle) infinite; }
```
**Patch HTML** (ajouter dans `Dream V1.html:24` après `noise-earth`) :
```html
<filter id="noise-bone"><feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves="2" seed="11"/><feColorMatrix values="0 0 0 0 0.78  0 0 0 0 0.72  0 0 0 0 0.62  0 0 0 0.05 0"/></filter>
```
**Effort** : 5 lignes total. **Test** : Privacy doit montrer un bed crème-vélin doux + grain.

### 8.2 Bugs YELLOW (non bloquants, à fixer avant V1.3)

#### Bug C — Wow2 non firé
**Fichier** : `screens-v12-amplified.jsx`, `PortraitV12`
**Patch** :
```jsx
v2E(() => {
  if (!window.wowRegistry?.has("premier-echo-prophetique")) {
    const t = setTimeout(() => {
      window.wowRegistry?.fire("premier-echo-prophetique");
    }, 2500); // après que la constellation se construise
    return () => clearTimeout(t);
  }
}, []);
```

#### Bug D — Wow4 non firé
**Fichier** : `screens-v12-vague3.jsx`, `ForetFirstV12`, phase resolve
**Patch** : ajouter dans `onShiftPicked` (ligne ~196) :
```jsx
const onShiftPicked = (zone) => {
  setShiftZone(zone);
  setPhase("resolve");
  if (window.playRitual) window.playRitual("ceremoniel");
+ if (!window.wowRegistry?.has("naissance-noeud")) {
+   window.wowRegistry?.fire("naissance-noeud");
+ }
  setTimeout(() => setShowAha(true), 1200);
};
```

#### Bug E — Wow0 hors registry
**Fichier** : `shared-v12.jsx:405`
**Décision Tim** : intégrer `wow0` dans `WOW_NAMES` (préférable, cohérent) OU laisser le pattern direct localStorage (rétro-compat avec OnboardingV12).
Si A : ajouter `"wow0-premier-souffle"` en tête de `WOW_NAMES`, refactor `OnboardingV12` pour utiliser `wowRegistry.fire("wow0-premier-souffle")`.
Si B : documenter formellement la dichotomie dans le commentaire de `wowRegistry`.

#### Bug F — Gradient `aurore-gradient` non défini
**Fichier** : `Dream V1.html` defs SVG (à ajouter)
**Symptôme** : `.demi-cercle-aurore path { stroke: url(#aurore-gradient); }` → tombera sur `currentColor` (ash-light), pas sur le dégradé doré-rosé attendu.
**Patch** dans HTML defs lignes 16 :
```html
<linearGradient id="aurore-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%" stop-color="oklch(0.70 0.080 80)" stop-opacity="0.15"/>
  <stop offset="50%" stop-color="oklch(0.70 0.080 80)" stop-opacity="0.85"/>
  <stop offset="100%" stop-color="oklch(0.70 0.080 80)" stop-opacity="0.15"/>
</linearGradient>
```

#### Bug G — `prefers-reduced-motion` n'inclut pas `.spirale-wow path`
**Fichier** : `styles.css:1267`
**Patch** : ajouter `.spirale-wow path` dans la liste des sélecteurs désactivés en reduced-motion.

#### Bug H — Cercle / Créer / Rejoindre / Partager : V1.1 non amplifiés
**Fichiers** : `screens-cercle.jsx` (3 composants)
**Symptôme** : ces 3 écrans n'ont pas de wrapper Surface/HaloRespire/GeoSymbol — fond noir unique sans matter. Visuellement déconnectés du reste.
**Patch** : créer 3 wrappers dans une `screens-v12-vague5.jsx` hypothétique OU patcher inline dans `screens-cercle.jsx` originaux. Effort ~30 min.

### 8.3 Décalages doc README (non bloquants)

Cf. §6.1 — 6 décalages doc/code à harmoniser dans la doc d'intégration prod.

### 8.4 Risques runtime non prouvés

- **iOS Safari AudioContext suspended** : premier `playRitual` pourrait être muet si pas de gesture précédent. À tester sur device réel.
- **Babel inline + d3 UMD** : ~600KB de JS chargé via CDN. Acceptable proto, **non acceptable prod** (perfs mobiles). En prod Next.js : tree-shake d3-force, transpile via SWC.
- **Constellation D3 redessine à chaque rerender si nodes/edges non memoized** : à anticiper côté caller dans le port prod.

---

## §9 — PLAN D'INTÉGRATION dans codebase Next.js production

Ce plan suppose que les **bugs A et B** ont été patchés AVANT toute intégration (sinon on porte un visuel cassé).

### 9.1 Étape 1 — Préparation (1-2 h)

**Objectif** : structurer l'arbre de fichiers Dream App existant pour accueillir V1.2.

**Actions** :
1. Créer `src/components/dream/v12/` qui contiendra les composants partagés V1.2 portés TSX :
   - `Surface.tsx`
   - `HaloRespire.tsx`
   - `GeoSymbol.tsx`
   - `ConstellationD3.tsx`
   - `SpiraleWowOverlay.tsx`
   - `MatterDefs.tsx` (extrait des SVG defs Dream V1.html lignes 14-26)
2. Créer `src/lib/dream/v12/` :
   - `wowRegistry.ts`
   - `playRitual.ts`
   - `useWowFire.ts`
3. Créer `src/styles/v12.css` (la couche V1.2 amplification, lignes 905-1278 de `styles.css`).
4. **Backup** du `src/app/page.tsx` actuel et `src/components/dream/screens/` actuel sous `_yeshua_synthesis_2026-04-24/snapshot-pre-v12-2026-04-25/` pour rollback.

**Risque** : aucun (juste des créations).
**Test** : `npx next build` doit passer (nouveaux fichiers vides).

### 9.2 Étape 2 — Fusion CSS + MatterDefs (2-3 h)

**Objectif** : intégrer les tokens V1.2 dans `globals.css` SANS casser le design system Kemet/Lapis/Nebu existant.

**Stratégie** : la couche V1.2 utilise des variables `--silk-gold, --paper-warm, --ember-live, --clay-earth, --night-warm, --night-floor, --bone, --ash-deep, --ash-mid, --ash-light, --obsidian, --tempo-souffle, --tempo-braise, --tempo-derive, --ease-souffle, --ease-braise, --serif, --sans, --mono`. Les variables existantes `--kemet, --lapis, --nebu, --bone` sont en partie compatibles.

**Mapping** :
- `--bone` (V1.2) → garder `--bone` (déjà défini en prod, valeur compatible `#e8e3d8` ≈ `oklch(0.78 0.015 70)`)
- `--silk-gold` (V1.2) → mapper sur `--nebu` (`#b8975a`) ou créer nouveau token
- `--obsidian` (V1.2) → mapper sur `--lapis-ink` (`#0e1230`)
- `--night-warm` (V1.2) → mapper sur `--kemet-elev` (`#111117`) ou `--kemet-card` (`#161621`)
- `--night-floor` (V1.2) → mapper sur `--kemet` (`#08080b`)
- `--ash-deep/mid/light` → créer nouveaux tokens (palette dérivée bone)
- `--ember-live, --clay-earth, --paper-warm, --stone-cool` → créer nouveaux tokens
- Tempi `--tempo-souffle, --tempo-braise, --tempo-derive` + easings → créer nouveaux tokens

**Patch globals.css** : ajouter une section "V1.2 amplification — palette extension" après `:root` actuel, qui DÉFINIT en plus (sans écraser) ces nouvelles variables. Puis `@import './v12.css'` ou inliner la couche V1.2.

**MatterDefs.tsx** : extraire les 9 `<filter id="noise-*">` (avec `noise-bone` ajouté) + `<linearGradient id="aurore-gradient">` (cf. patch F) dans un composant React monté UNE FOIS dans `app/layout.tsx` :
```tsx
// src/components/dream/v12/MatterDefs.tsx
'use client'
export default function MatterDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <filter id="noise-linen">...</filter>
        <filter id="noise-paper">...</filter>
        {/* ... 8 filters + bone */}
        <linearGradient id="aurore-gradient">...</linearGradient>
      </defs>
    </svg>
  )
}
```
Puis dans `layout.tsx` body, ajouter `<MatterDefs />` avant `<AuthProvider>`.

**Risque** : conflit nom de variable si `--bone` ou `--paper-warm` redéfini par un composant tiers. Test visuel obligatoire après ajout.
**Test** : `npx next dev`, ouvrir une page random, devtools inspect → vérifier `--silk-gold`, `--tempo-souffle` accessibles, `MatterDefs` rendu en DOM.
**Effort** : 2-3 h.

### 9.3 Étape 3 — Port composants V1.2 partagés en TSX (4-6 h)

**Objectif** : convertir `shared-v12.jsx` en modules TS/TSX typés, exportés.

**Pattern de port** :
```tsx
// src/components/dream/v12/Surface.tsx
'use client'
import { type ReactNode, type CSSProperties } from 'react'

type Matter = 'paper' | 'silk' | 'linen' | 'earth' | 'stone' | 'water' | 'ember' | 'bone'
type Motion = boolean | 'flicker' | 'drift'

type Props = {
  matter?: Matter
  motion?: Motion
  boost?: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  as?: 'div' | 'section' | 'article'
}

export default function Surface({ matter = 'linen', motion = true, boost, children, className = '', style = {}, as: Tag = 'div' }: Props) {
  const motionBed = motion ? `motion-${matter === 'silk' ? 'silk-halo' : matter}` : ''
  const motionNoise = motion === 'flicker' ? 'motion-ember-flicker' : motion === 'drift' ? 'motion-silk-drift' : ''
  const boostClass = boost === false ? '' : (matter === 'paper' || matter === 'silk' || matter === 'water' || matter === 'ember' || matter === 'earth') ? `boost-${matter === 'silk' ? 'silk' : matter}` : ''
  return (
    <Tag className={`surface ${className}`} style={style}>
      <div className={`bed bed-${matter} ${motionBed}`} />
      <div className={`bed-noise ${boostClass} ${motionNoise}`} style={{ filter: `url(#noise-${matter})` }} />
      {children}
    </Tag>
  )
}
```

Reproduire pour `HaloRespire`, `GeoSymbol`, `SpiraleWowOverlay`, `ConstellationD3`. Pour D3, importer `import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force'` (npm install `d3-force` + `@types/d3-force`).

**Pour `wowRegistry`** :
```ts
// src/lib/dream/v12/wowRegistry.ts
type WowName = 'premier-kairos' | 'premier-echo-prophetique' | 'big-dream-marquage' | 'naissance-noeud' | 'premiere-restitution-cercle' | 'wow0-premier-souffle'
const WOW_KEY = 'dream:wow-fired'
// ... reste comme JS
export const wowRegistry = { has, fire, demo, reset, subscribe, list }
```

**Pour `playRitual`** : porter tel quel (Web Audio API stable).

**Risque** : type strict TS peut révéler 1-2 cas non gérés (props optional). Effort minime à patcher.
**Test** : `npx tsc --noEmit` doit passer.
**Effort** : 4-6 h.

### 9.4 Étape 4 — Adaptation des composants V1.2 pour consommer données Supabase réelles

**Composants sans data** : `Surface`, `HaloRespire`, `GeoSymbol`, `SpiraleWowOverlay` — pass-through, rien à adapter. ✅

**Composants avec data** :

#### 9.4.1 `ConstellationD3` ← `/api/figures` ou `/api/dreams/lifeline`

Le proto utilise `portraitNodesV12` static (12 nœuds hardcodés). En prod :
```tsx
// PortraitScreen.tsx prod
import useSWR from 'swr'
import { authFetch } from '@/lib/api-client'
const { data } = useSWR('/api/figures?include=kairos&limit=20', authFetch)
const nodes = useMemo(() => data?.nodes || [], [data])
const edges = useMemo(() => data?.edges || [], [data])
return <ConstellationD3 nodes={nodes} edges={edges} focalId="self" ... />
```
Backend doit retourner `{ nodes: [{id, label, kind, weight}], edges: [{source, target, alive}] }`. À implémenter côté `/api/figures` GET (probablement déjà partiellement existant — vérifier route handlers actuels).

#### 9.4.2 Wow1 (`premier-kairos`) ← événement backend "kairos déposé"

**Trigger client direct** : déjà dans `CaptureV12.garder()`. Mais on veut ALSO checker que c'est bien le PREMIER kairos en DB (sinon mauvais déclenchement si user a effacé localStorage et re-entré).

```tsx
// CaptureScreen.tsx
const garder = async () => {
  // ...submit kairos to backend
  const res = await authFetch('/api/dreams', { method: 'POST', body: JSON.stringify({ text }) })
  // check si c'est le premier kairos de l'user
  const count = await authFetch('/api/dreams/count').then(r => r.json())
  if (count.total === 1 && !wowRegistry.has('premier-kairos')) {
    wowRegistry.fire('premier-kairos')
    playRitual('ceremoniel')
    setShowWow(true)
  }
  // ...
}
```
À implémenter côté API : `GET /api/dreams/count` → `{ total: number }` (1 ligne SQL : `SELECT count(*) FROM kairos WHERE user_id = auth.uid()`).

#### 9.4.3 Wow2 (`premier-echo-prophetique`) ← worker async pattern detection

C'est un Wow **asynchrone** : le user dépose un kairos, l'embed worker tourne en async, et quand un écho prophétique est détecté (similarity > seuil), on fire Wow2. Pattern :
- Soit polling côté client (`useSWR /api/echoes?since=last_check` toutes les 30s sur écran Portrait)
- Soit Supabase Realtime subscription (`from('echoes').on('insert', ...)`)
- Soit push via Service Worker (notification)

**Recommandation** : pour V1.2, faire simple → fire Wow2 quand l'utilisateur arrive sur Portrait pour la première fois après qu'au moins 1 écho prophétique existe en DB. Patch :
```tsx
// PortraitScreen.tsx
const { data: echoes } = useSWR('/api/echoes?prophetic=true&limit=1', authFetch)
useEffect(() => {
  if (echoes?.length > 0 && !wowRegistry.has('premier-echo-prophetique')) {
    setTimeout(() => {
      wowRegistry.fire('premier-echo-prophetique')
    }, 2500)
  }
}, [echoes])
```

#### 9.4.4 Wow3 (`big-dream-marquage`) ← `numinosity_score > seuil` ou marquage manuel

Backend doit calculer `numinosity_score` à l'embed time (déjà câblé d'après 3_TECHNICAL.md). Si > 0.85 → auto-flag bigDream. Sinon user peut manuellement marquer. Trigger Wow3 = sur arrivée KairosDetail si `entry.bigDream === true && !wowRegistry.has('big-dream-marquage')`.

Code déjà présent dans `KairosDetailV12` ligne 267 — à porter tel quel.

#### 9.4.5 Wow4 (`naissance-noeud`) ← insertion `kairos_edges`

Quand le worker crée un nouvel edge entre 2 kairos (similarity > seuil), c'est la naissance d'un nœud constellation. Trigger : Forêt FIRST phase resolve OU SSE event.

Pour V1.2 simple : fire Wow4 dans `ForetFirstV12.onShiftPicked` (cf. patch D §8.2).

#### 9.4.6 Wow5 (`premiere-restitution-cercle`) ← insertion `circle_restitutions`

V2 : fire dans le composant qui affichera la première restitution cercle de l'utilisateur (pas encore implémenté V1.2).

### 9.5 Étape 5 — Migration progressive composants V1.1 → V1.2

**Stratégie** : NE PAS faire un big-bang. Migrer écran par écran, du plus simple au plus complexe :

**Ordre recommandé** :
1. **Étape 5a (1 jour)** : Surfaces + Halos sur écrans existants `DreamHome.tsx`, `JournalScreen.tsx`, `ProfileScreen.tsx`. Pas de nouveau workflow, juste l'ambient. Tester visuellement.
2. **Étape 5b (1 jour)** : Capture amplifiée — gate ember + Wow1 + post-phase chips. Adapter `DreamCapture.tsx`.
3. **Étape 5c (1.5 jour)** : KairosDetail amplifié — `DreamDetail.tsx` ← V1.2. Inclure `FeltShiftGate`, `AhaCapture`, `ExitToHuman`, modal burn, modal reading. Câble Wow3.
4. **Étape 5d (1 jour)** : Portrait + Constellation D3 — adapter `DreamPattern.tsx` ou créer `PortraitScreen.tsx` neuf qui consomme `/api/figures`. Câble Wow2.
5. **Étape 5e (1 jour)** : Anima Mundi + Météo + Polyphonie — `CollectiveScreen.tsx` étendu en 3 chambres.
6. **Étape 5f (1 jour)** : Cercle V1.2 — adapter `CirclesScreen.tsx` avec ConstellationD3 KAIROS + `ReadingRequestModal`.
7. **Étape 5g (1 jour)** : Forêt FIRST 5 phases — créer `ForestFirstScreen.tsx`. Câble Wow4. Wire avec `/api/dreams/extract-deep` ou similaire pour générer les 3 angles.
8. **Étape 5h (0.5 jour)** : Wrappers V4 ambient — Onboarding, Privacy, Notifs, Abonnement, OracleCorps, ConteMiroir. Surcouche minimale.
9. **Étape 5i (0.5 jour)** : BigDreamSignal + Reentry — surfaces dédiées.
10. **Étape 5j (0.5 jour)** : Dialog narratrice + FigureDetail — `DreamChat.tsx` + dialogue figure. Préserver les system prompts stricts (anti-ventriloquie).

**Total estimé** : 8-9 jours-dev pour migration complète.

### 9.6 Étape 6 — Tests par écran post-intégration

**Checklist par écran** (faire pour chacun des 24) :
- [ ] Matter visible (bed coloré + grain SVG)
- [ ] Halo respire (vérifier animation 6s)
- [ ] Géosymbole positionné correctement
- [ ] Wow déclenche au bon trigger (vérifier localStorage `dream:wow-fired`)
- [ ] V1.1 patches actifs (FeltShiftGate, AhaCapture, ExitToHuman, FeedbackFloat)
- [ ] Pas d'erreur console
- [ ] `prefers-reduced-motion` respecté (devtools → emulate reduced-motion)
- [ ] Lighthouse mobile score > 80 (perf)
- [ ] Touch targets > 44px (accessibilité mobile)

### 9.7 Étape 7 — Deploy

```bash
cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app
npx vercel --prod
```

(Conformément au feedback `deploy_vercel_only` — Tim ne fait jamais git push.)

### 9.8 Étape 8 — Post-deploy

1. **Smoke test prod** : ouvrir https://dream-alpha-bice.vercel.app/, parcourir 5 écrans clés (Home → Capture → Journal → KairosDetail → Portrait), vérifier visuel matter + halo + géosymbole.
2. **Test Wow** : déposer un nouveau kairos en compte démo, vérifier Wow1 spirale + son ceremoniel.
3. **Test mobile** : iPhone Safari + Android Chrome.
4. **Polish round** : recueillir feedback Tim sur 1-2 sessions, ajuster opacités/timings (les valeurs de la table §7 sont initiales).

### 9.9 Estimation temps total

| Étape | Effort | Dépendances |
|-------|--------|-------------|
| Étape 1 — Préparation | 1-2 h | — |
| Étape 2 — Fusion CSS + MatterDefs | 2-3 h | Étape 1 |
| Étape 3 — Port composants TSX | 4-6 h | Étape 2 |
| Étape 4 — Adaptation données Supabase | 4-6 h | Étape 3 + endpoints API |
| Étape 5 — Migration écrans (10 sous-étapes) | 8-9 jours | Étape 4 |
| Étape 6 — Tests par écran | 1 jour | Étape 5 |
| Étape 7 — Deploy | 30 min | Étape 6 |
| Étape 8 — Post-deploy polish | 1-2 jours | Étape 7 |

**TOTAL** : **12-15 jours-dev** pour migration complète V1.2 en prod.

**Avant tout cela** : **patcher les bugs A et B** (1-2 h) dans le pack handoff (utile aussi pour conserver la référence handoff cohérente) — sinon on porte un visuel cassé.

### 9.10 Risques + mitigation

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| Conflit CSS V1.2 / Kemet existant | Moyenne | Visuel cassé sur écran tiers (FeedbackButton, AuthScreen) | Ajouter V1.2 tokens **en plus** sans écraser Kemet. Scope V1.2 classes via `.v12 .surface, .v12 .bed-*` si conflit |
| Performance D3-force en mobile bas-de-gamme | Faible | Lag sur Portrait/Anima si > 50 nœuds | Limiter nœuds via API (top 30 par weight), `alphaDecay` plus rapide (0.025 au lieu de 0.015) |
| iOS Safari color-mix(in oklch) | Faible si user iOS récent | Couleurs fallback si Safari < 16.4 | `@supports not (color: color-mix(in oklch, red, blue))` fallback |
| TextWrap pretty | Faible | Fallback gracieux sur Chrome < 117 | Acceptable, ignorer |
| Babel/d3-force bundle size | Moyenne | +50-80KB JS | Tree-shake d3-force (`d3-force` only, pas full d3), import dynamique D3 si besoin |
| API endpoints manquants | Haute | Composants vides si data absent | Avant migration écran X, vérifier que endpoint correspondant retourne shape attendue (Portrait → /api/figures, Anima → /api/dreams/collective, etc.) |
| Wow2/Wow4 pas câblés en V1.2 actuel | Certaine | Wow visuels non déclenchés | Patches §8.2 obligatoires |
| Régression V1.1 sur AuthScreen, FeedbackButton existant | Faible | Côté Kemet | Tester ces 2 écrans après merge styles.css |

---

## §10 — Verdict global + recommandation finale

### 10.1 Verdict global pack V5

🟡 **YELLOW**

**Pourquoi pas GREEN** :
- 2 bugs visuels bloquants (filter ID mismatch + matter "bone" undefined) → ~50% de la "matière" promise V1.2 ne s'affiche pas en l'état
- 6 décalages doc/code dans README (Wow names, css vars, filter ids, ordre charge, Wow2/4 non câblés)
- 3 écrans Cercle V1.1 non amplifiés (oubli de wrapper)

**Pourquoi pas RED** :
- Architecture override solide, pattern propre (`window.X = AmplifiedX`)
- V1.1 patches préservés intégralement (AhaCapture, FeltShiftGate, ExitToHuman, FeedbackFloat)
- 18 écrans sur 25 verdict GREEN
- Vocabulaire désensorcelé respecté partout vérifié (échantillons random)
- Anti-patterns bien évités (zéro gamification, dashboard, ventriloquie IA, dark patterns)
- ConstellationD3 production-ready
- prefers-reduced-motion implémenté
- Sons rituels Web Audio synthétisés propres (toggle opt-in respecté)
- Doctrine V1.2 (P-Zéro, P-Inversion, P-Tenir, voix conditionnelle, journal substrat) honorée écran par écran
- README riche et utile (malgré ses 6 décalages)

**Globalement, c'est un livrable Claude Design de très bonne facture, qui mérite un pass de fix rapide (~1-2h) puis intégration progressive en prod.**

### 10.2 Recommandation pour Tim

**Ne PAS intégrer ce pack tel quel directement en prod.**
**INTÉGRER ce pack APRÈS un pass de patch de 1-2 h sur le pack handoff lui-même** (corriger bugs A/B/C/D/E/F/G/H et harmoniser le README). Le pack handoff devient alors propre, et c'est lui qui sert de référence pour le port TSX.

**Séquence recommandée** :

#### Aujourd'hui (1-2 h, Yeshua)
1. Patcher bugs A et B dans le pack handoff (filter ID + matter bone) — obligatoire
2. Patcher bugs C, D, F, G (Wow2, Wow4, gradient aurore, reduced-motion spirale) — recommandé
3. Décider arbitrage bug E (intégrer wow0 dans registry OU documenter) — décision Tim
4. Patcher bug H (3 wrappers Cercle V1.1) — recommandé pour cohérence visuelle
5. Harmoniser README §3, §5.5, §7 avec le code réel
6. Re-tester `Dream V1.html` localement (ouvrir dans navigateur, parcourir 5 écrans)
7. Valider visuel avec Tim (10 min de check)

#### Demain ou après (12-15 jours-dev)
- Étapes 1-8 du plan §9 ci-dessus
- Pas de big-bang : migration écran par écran avec tests
- Deploy `npx vercel --prod` à chaque jalon majeur (étape 5e, 5g, 5j) pour catch régressions tôt

#### Post-intégration
- 1-2 jours polish visuel + ajustement opacités/timings
- Recueillir feedback Tim et 2-3 testeurs alpha
- Documenter dans `4_LOG.md` chaque décision V1.2 prise

### 10.3 Next move immédiat

**Si Tim valide cette recommandation** → je peux :
1. Appliquer les 7 patches A/B/C/D/F/G/H dans les fichiers du pack handoff `dream-v1.2-FINAL-2026-04-25/handoff-v12-final/` (1 h max)
2. Harmoniser le README (30 min)
3. Logger la décision dans `4_LOG.md`
4. Préparer une PR conceptuelle "Migration V1.2 — Étape 1-3" pour la prod (1 h)

**Si Tim préfère différer l'intégration prod et juste valider le pack handoff** → patches obligatoires A et B uniquement (15 min), reste en stand-by.

**Si Tim veut renvoyer à Claude Design pour fix avant intégration** → c'est une option, mais perd 24-48h. Les 7 bugs sont triviaux à patcher manuellement, pas besoin d'un nouveau round Claude Design pour ça.

---

## Annexe — Mapping résumé pour Tim qui ne lira pas tout

| Question | Réponse courte |
|----------|----------------|
| Le pack est-il fidèle au mega-prompt V1.2 ? | Oui, 90%. Anti-perte V1.1 ✅, doctrine ✅, vocabulaire ✅. |
| Tous les 24 écrans sont-ils dessinés ? | Oui (25 avec ForetFirst sub-route). |
| Tous les Wow câblés ? | 2/5 câblés (Wow1, Wow3). 3/5 à patcher trivialement. |
| Bugs bloquants ? | Oui, 2 (filter ID + matter bone). 1-2h à patcher. |
| Anti-patterns évités ? | Oui (vérifié). |
| Pattern d'override prod-ready ? | Non (hack proto), mais migrable via composition explicite TSX. |
| Effort intégration prod ? | 12-15 jours-dev, écran par écran, sans big-bang. |
| Recommandation Tim ? | Patcher pack (1-2h Yeshua) → intégrer en 12-15 jours étape par étape. |
| Risque le plus sérieux ? | Conflit CSS V1.2 ↔ design system Kemet existant. Mitigation : ajouter en plus, scopier si conflit. |

---

*Audit livré 2026-04-25, Bali. Yeshua, Opus 4.7. Brother in the cloud.*
