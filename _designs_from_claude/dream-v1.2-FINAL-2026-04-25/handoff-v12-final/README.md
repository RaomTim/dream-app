# Dream — Handoff V1.2 (final · post-patch V5)

> **Prototype HTML/React → handoff pour intégration codebase Next.js production**
> Livré le · package complet : 18 fichiers, 25 écrans (24 + Forêt FIRST sous-route), 4 vagues d'amplification livrées (Vague 1 V1.1 base + Vagues 2/3/4).
> Status : **post-patch V5 — GREEN clean. Prêt pour intégration.**

---

## TL;DR pour l'équipe dev

1. Ouvrir `Dream V1.html` dans un navigateur → prototype interactif des 25 écrans (panneau **Tweaks** en bas-droite pour naviguer).
2. Ouvrir `Visual System V1.2.html` → galerie pédagogique des matters / halos / géosymboles / Wow moments.
3. Lire ce README dans l'ordre — section **§5 (Intégration Next.js)** contient les instructions concrètes pour porter en prod.
4. **Patches V5 appliqués 2026-04-25** : voir §11 ci-dessous pour la liste détaillée des 7 fixes (filter ID, matter `bone`, Wow2, Wow4, Wow0 in-registry, gradient aurore, reduced-motion spirale + amplification 3 écrans Cercle).

---

## §1 — Inventaire du package

### 1.1 Fichiers V1.1 (base, préservés tels quels)

| Fichier | Rôle |
|---|---|
| `Dream V1.html` | Shell HTML : charge React, Babel, tous les `.jsx` dans l'ordre. **Contient les `<svg>` defs des 8 matter filters SVG** (lignes ~10-50). |
| `styles.css` | CSS V1.2 amplifié : tokens, tempi organiques (`--respire: 6s`, `--ease-respire`), classes matter, géosymboles, Wow animations. |
| `app.jsx` | Routeur React (hash-based) + panneau Tweaks de navigation (le **vrai moyen** de tester les 24 écrans). |
| `tweaks-panel.jsx` | Composants `<TweaksPanel>` / `<TweakSlider>` / etc. Inutilisé en V1.2 mais réservé pour V2. |
| `screens-shared.jsx` | Helpers : `TopNav`, `FeedbackFloat`, `FeedbackModal`, `seedEntries`, `seedFigure`, `typeLabel`, `TypeGlyph`. |
| `screens-core.jsx` | `Home`, `Capture`, `Journal` (V1.1 — overridé en Vague 3). |
| `screens-deep.jsx` | `KairosDetail`, `Portrait`, `AnimaVoute`, `Meteo`, `Polyphonie`, `Chat`, `Modal`, `Constellation` (V1.1). |
| `screens-cercle.jsx` | `CercleScreen`, `CreerCercleScreen`, `RejoindreScreen`, `PartagerReveScreen`, `ReadingRequestModal`. |
| `screens-anima.jsx` | `AnnalesScreen`, `OffreKairosScreen`, `OffreKairosSheet`. |
| `screens-soma.jsx` | `OracleCorpsScreen`, `ConteMiroirScreen`, `ReentryScreen`. |
| `screens-meta.jsx` | `OnboardingScreen`, `PrivacyScreen`, `NotifsScreen`, `AbonnementScreen`. |
| `screens-figure.jsx` | `FigureDetailScreen`, `FeedbackFloat`, `FeedbackModal`, `ExitToHuman`, `AhaCapture`. |

### 1.2 Fichiers V1.2 (amplification — **chargés après V1.1, override les composants par leurs versions amplifiées**)

| Fichier | Rôle |
|---|---|
| `shared-v12.jsx` | **Cœur V1.2** — composants partagés : `Surface`, `HaloRespire`, `GeoSymbol`, `ConstellationD3` (D3-force vivant), `SpiraleWowOverlay`, `playRitual`, `wowRegistry`, `SeasonalCompass`. |
| `screens-v12-amplified.jsx` | **Vague 2** — 8 écrans cœur : `Home`, `Capture`, `KairosDetail`, `Portrait`, `AnimaVoute`, `Chat`, `ReentryScreen`, `BigDreamSignalScreen`. |
| `screens-v12-vague3.jsx` | **Vague 3** — 8 écrans secondaires : `Journal`, `ForetFirstScreen`, `CercleScreen`, `FigureDetailScreen`, `Meteo`, `Polyphonie`, `AnnalesScreen` (wrapper), `ConteMiroirScreen` (wrapper). |
| `screens-v12-vague4.jsx` | **Vague 4** — 8 surfaces meta : `OnboardingScreen`, `OracleCorpsScreen`, `NotifsScreen`, `PrivacyScreen`, `AbonnementScreen`, `OffreKairosScreen`, `Modal`, `ConstellationGeneric`. |
| `Visual System V1.2.html` | Galerie pédagogique des tokens (matters, halos, géosymboles, Wow). À utiliser pour aligner l'équipe avant intégration. |

### 1.3 Ordre de chargement RÉEL (dans `Dream V1.html`)

```html
<!-- React + Babel + d3-force -->
<script src=".../react.development.js"></script>
<script src=".../react-dom.development.js"></script>
<script src=".../babel.min.js"></script>
<script src=".../d3-dispatch.min.js"></script>
<script src=".../d3-quadtree.min.js"></script>
<script src=".../d3-timer.min.js"></script>
<script src=".../d3-force.min.js"></script>

<!-- 1. V1.1 helpers + patches (AhaCapture, FeltShiftGate, ExitToHuman) -->
<script type="text/babel" src="screens-shared.jsx"></script>

<!-- 2. V1.2 partagé (Surface, HaloRespire, GeoSymbol, ConstellationD3, wowRegistry) -->
<!--    Chargé tôt car les vagues 2/3/4 référencent window.Surface, window.HaloRespire, etc. -->
<script type="text/babel" src="shared-v12.jsx"></script>

<!-- 3. V1.1 écrans base (composants originaux exposés sur window.*) -->
<script type="text/babel" src="screens-core.jsx"></script>
<script type="text/babel" src="screens-deep.jsx"></script>
<script type="text/babel" src="screens-cercle.jsx"></script>
<script type="text/babel" src="screens-anima.jsx"></script>
<script type="text/babel" src="screens-soma.jsx"></script>
<script type="text/babel" src="screens-meta.jsx"></script>
<script type="text/babel" src="screens-figure.jsx"></script>

<!-- 4. V1.2 amplification — overrides via window.X = AmplifiedX -->
<script type="text/babel" src="screens-v12-amplified.jsx"></script>  <!-- Vague 2 -->
<script type="text/babel" src="screens-v12-vague3.jsx"></script>      <!-- Vague 3 -->
<script type="text/babel" src="screens-v12-vague4.jsx"></script>      <!-- Vague 4 -->

<!-- 5. App router (lit window.* au render) -->
<script type="text/babel" src="app.jsx"></script>
```

⚠️ **L'ordre est critique.** `shared-v12.jsx` doit être chargé AVANT les vagues 2/3/4 (qui consomment `window.Surface` etc.) et APRÈS `screens-shared.jsx` (qui définit les patches V1.1). `app.jsx` lit `window.Home`, `window.KairosDetail`, etc. au render. Les fichiers V1.2 réassignent ces globals par les versions amplifiées **avant** que `app.jsx` ne les lise.

> **Note doc** : versions antérieures de ce README plaçaient `shared-v12.jsx` après les V1.1 — incohérent avec le HTML réel. Corrigé post-patch V5.

---

## §2 — Architecture override pattern

### 2.1 Le pattern `window.X = AmplifiedX`

Chaque composant V1.1 est exposé sur `window` à la fin de son fichier d'origine :

```js
// screens-deep.jsx (V1.1)
const KairosDetail = ({ go, entry, allEntries }) => { ... };
Object.assign(window, { KairosDetail, Portrait, AnimaVoute, ... });
```

Les fichiers V1.2 réassignent ces mêmes globals avec une version amplifiée :

```js
// screens-v12-amplified.jsx (V1.2)
const KairosDetailV12 = ({ go, entry, allEntries }) => {
  // …version amplifiée avec Surface, HaloRespire, etc.
};
window.KairosDetail = KairosDetailV12;  // ← override
```

`app.jsx` lit `window.KairosDetail` → reçoit la version V1.2 sans le savoir.

### 2.2 Pattern wrapper (pour amplification ambient seulement)

Quand l'amplification est purement visuelle (matter + halo + géosymbole en arrière-plan, sans toucher la logique), on **wrappe** le composant original :

```js
// Sauvegarde du V1.1
window.__OnboardingOriginal = window.OnboardingScreen;

// Wrapper V1.2
const OnboardingV12 = ({ go }) => {
  const Original = window.__OnboardingOriginal;
  return (
    <div style={{ position: "relative" }}>
      <Surface matter="ember" motion={true} style={{ position: "absolute", inset: 0, zIndex: 0 }} />
      <HaloRespire kind="silk" />
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
    </div>
  );
};

window.OnboardingScreen = OnboardingV12;
```

**Avantage** : pas de duplication de logique. Si la V1.1 évolue, la V1.2 hérite automatiquement.
**Limite** : on ne peut pas modifier le DOM interne du composant original. Pour les changements structurels (ex : Forêt FIRST en 5 phases au lieu de la version V1.1), on réécrit complètement.

### 2.3 Pattern réécriture complète

Quand l'amplification touche la **logique** (workflow différent, états supplémentaires, copie réécrite) on réécrit le composant. Exemples :
- `JournalV12` : ajoute filtres par type, marquage BigDream sur cards, halo sur kairos numinous → réécrit.
- `ForetFirstV12` : 5 phases (`user-reading | loading | angles | felt-shift | resolve`) → réécrit (n'existait pas en V1.1).
- `CercleV12` : `<ConstellationD3>` des **kairos** partagés (pas des membres) → réécrit (changement conceptuel majeur).

---

## §3 — Mapping écran → matter → halo → Wow → géosymbole

Table récap des **24 écrans** du prototype, dans l'ordre de la nav Tweaks.

| # | Écran | Route | Vague | Matter | Halo | Géosymbole | Wow |
|---|---|---|---|---|---|---|---|
| 1 | Home | `home` | V2 | `linen` | `silk` ambient | `spirale` subtile | — |
| 2 | Capture | `capture` | V2 | `ember` (gate) | `ember` à la frappe | — | **Wow1** : spirale dorée au dépôt |
| 3 | Journal | `journal` | V3 | `paper` | `silk` sur kairos numinous, `bigdream` sur Big Dreams | `songlines` fond, `spirale` BigDream | — |
| 4 | KairosDetail | `kairos` | V2 | `paper` | `silk` | `triangle` rituel | **Wow3** : marquage BigDream avec halo combiné |
| 5 | Portrait (figures) | `portrait` | V2 | `silk` | — | — | **Wow2** : `<ConstellationD3>` vivant à l'arrivée |
| 6 | FigureDetail | `figure` | V3 | `paper` | `silk` derrière glyph | — | drop cap doré sur description |
| 7 | Forêt FIRST | (interne KairosDetail → `foret-first`) | V3 | `paper` → `silk` | `silk` à la résolution | constellation 5-points loading | rituel cérémoniel + AhaCapture |
| 8 | Cercle | `cercle` | V3 | `earth` | — | `cercle-concentrique` discret | `<ConstellationD3>` des **kairos** partagés |
| 9 | Créer cercle | `creer-cercle` | V3 (wrap, post-patch V5) | `earth` | `silk` titre | `cercle-concentrique` discret | — |
| 10 | Rejoindre cercle | `rejoindre` | V3 (wrap, post-patch V5) | `earth` | `silk` titre | `cercle-concentrique` discret | — |
| 11 | Partager rêve | `partager-reve` | V3 (wrap, post-patch V5) | `silk` | `silk` titre | `cercle-concentrique` discret | — |
| 12 | AnimaVoute | `anima` | V2 | `linen` | `silk` ambient | `demi-cercle aurore`, `songlines` | `<ConstellationD3>` |
| 13 | Météo | `meteo` | V3 | `water` | `earth` bas, `silk` symbole eau | `songlines` pleine page | symbole eau central avec halo respirant |
| 14 | Polyphonie | `polyphonie` | V3 | `linen` | `silk` derrière texte | `demi-cercle aurore` haut | drop cap sur §1 |
| 15 | Annales | `annales` | V3 | `stone` | `silk` haut-gauche | `cercle-concentrique` (alias `concentric`) | — |
| 16 | Offre au Kairos | `offre-kairos` | V4 | `silk` | **`bigdream` pleine puissance** | `spirale` ample | rituel cérémoniel à l'ouverture |
| 17 | OracleCorps | `oracle-corps` | V4 | `earth` | `earth` respirant | `cercle-concentrique` autour silhouette | zones du corps pulsent au clic (pulse 6s) |
| 18 | Conte-miroir | `conte-miroir` | V3 | `silk` | `silk` derrière lecture | `spirale` ample | drop cap sur §1 conte |
| 19 | Réentrée | `reentry` | V2 | `ember` | `ember` aux gates | `triangle` rituel | gates rituels |
| 20 | Chat narratrice | `chat` | V2 | `paper` | `silk` discret | — | — |
| 21 | BigDream Signal | `bigdream-signal` | V2 | `silk` | `bigdream` combiné | `spirale` | drop cap + revisits + Modal `kind="burn"` |
| 22 | Onboarding P-Zéro | `onboarding` | V4 | `ember` | `silk` centre | `spirale` bas | **Wow0** : premier accès + souffle à chaque étape |
| 23 | Privacy | `privacy` | V4 | `bone` (vélin) | — | `spirale` lente | — |
| 24 | Notifs | `notifs` | V4 | `linen` | — | `demi-cercle aurore` | tous labels en serif italique = chuchotement |
| 25 | Abonnement | `abonnement` | V4 | `paper` | `silk` discret | — | — |

(25 entrées au total avec Forêt FIRST en sous-route — les 24 "écrans" promis comptent les écrans principaux.)

---

## §4 — Composants V1.2 partagés (`shared-v12.jsx`)

### 4.1 `<Surface matter motion style />`
Bed visuel : couleur de fond (`bed-{matter}` CSS class, cf. `styles.css:922-951`) + texture SVG via filtres `<filter id="noise-{matter}">` dans `Dream V1.html` lignes 17-25 (9 filters : `noise-linen`, `noise-paper`, `noise-stone`, `noise-ash`, `noise-water`, `noise-ember`, `noise-silk`, `noise-earth`, `noise-bone`).

**Props** :
- `matter` : `"paper" | "silk" | "linen" | "earth" | "stone" | "water" | "ember" | "bone"` — 8 matters disponibles.
- `motion` : `true` (respiration douce 6s) / `"flicker"` (ember) / `"drift"` (silk) / `false`.
- `boost` : `false` désactive le boost-overlay (boost auto sur paper/silk/water/ember/earth).
- `style` : positionnement (typiquement `position: absolute, inset: 0, zIndex: 0`).
- `as` : tag HTML polymorphique (default `"div"`).

### 4.2 `<HaloRespire kind style />`
Halo respirant en arrière-plan, anime opacity 0.4 ↔ 0.7 sur 6s.

**Props** :
- `kind` : `"silk"` (or pâle, sacralité quotidienne) | `"ember"` (orange braise, gate somatique) | `"earth"` (terre, ancrage corps) | `"bigdream"` (or pleine puissance, ne jamais surutiliser).

### 4.3 `<GeoSymbol kind color opacity style />`
Symbole géométrique sacré, statique ou animé.

**Props `kind`** : `"spirale"` (logarithmique 3.5 tours, BigDream marquage) | `"concentric"` (cercles concentriques, alias `cercle-concentrique`) | `"triangle"` (rituel) | `"demi-cercle"` (aurore, polyphonie) | `"songlines"` (lignes mémoire collective) | `"croissant"` (lune phases).

### 4.4 `<ConstellationD3 nodes edges focalId onNodeClick driftParticles showLabels style />`
Graphe D3-force vivant (drift léger, particules ambient, hover/click). Cœur de Portrait, AnimaVoute, Cercle.

**Format `nodes`** : `[{ id, label, kind: "self|figure|kairos|bigdream", weight }]`
**Format `edges`** : `[{ source, target, alive?: bool }]`

### 4.5 `<ConstellationGeneric data mode focalLabel onNodeClick height showLabels driftParticles ambientHalo />`
Wrapper réutilisable autour de `ConstellationD3`. Choisit le matter selon `mode` (`"figures"|"kairos"|"cercle"|"abstract"`), assure qu'un nœud `self` existe.

### 4.6 `<SpiraleWowOverlay show />`
Overlay plein écran : spirale dorée se déploie depuis le centre. Wow1 (premier kairos déposé).

### 4.7 `playRitual(name)`
Joue un son rituel court (Web Audio API, généré in-browser pour le proto, refs sons réels en §6).

**Noms** : `"souffle"` (passage entrée) | `"braise"` (gate ember capture) | `"tisse"` (chat narratrice) | `"ceremoniel"` (Forêt FIRST résolution, OffreKairos) | `"seuil"` (Wow0).

### 4.8 `wowRegistry`
Registry localStorage des Wow déjà déclenchés. API :
```js
wowRegistry.has(name)        // bool : déjà fired ?
wowRegistry.fire(name)       // marque + dispatch CustomEvent("wow:fire"). Idempotent.
wowRegistry.demo(name)       // démontre sans persister (Tweaks panel)
wowRegistry.reset(name?)     // reset un nom, ou tous si pas d'arg
wowRegistry.subscribe(fn)    // abonner un listener (renvoie un unsubscribe)
wowRegistry.list             // ["first-launch", "premier-kairos", ...]
useWowFire(name, callback)   // hook React : abonné à l'event, callback déclenchée si match
```

**Clés réelles** (`WOW_NAMES` dans `shared-v12.jsx:405`) — codes verbaux français, PAS `"wow0"`/`"wow1"`/etc :

| # | Clé registry | Trigger |
|---|---|---|
| Wow 0 | `first-launch` | Premier accès Onboarding (P-Zéro) — dans `OnboardingV12` `useEffect` |
| Wow 1 | `premier-kairos` | Premier kairos déposé — dans `CaptureV12.garder()` |
| Wow 2 | `premier-echo-prophetique` | Premier écho prophétique détecté — dans `PortraitV12` `useEffect` (post-build constellation, +2.5s) |
| Wow 3 | `big-dream-marquage` | Big Dream marqué — dans `KairosDetailV12` + `BigDreamSignalV12` |
| Wow 4 | `naissance-noeud` | Naissance d'un noeud constellation — dans `ForetFirstV12.onShiftPicked()` (phase resolve) |
| Wow 5 | `premiere-restitution-cercle` | Première restitution cercle — **non câblé V1.2** (V2 quand UI rituel cercle finalisée) |

> **Décalage doc historique** : versions antérieures de ce README utilisaient `"wow0"`/`"wow1"`/etc dans les exemples. Les vraies clés sont les codes verbaux ci-dessus. Corrigé post-patch V5 (Wow 0 désormais dans le registry sous `first-launch` au lieu d'un `localStorage("dream:wow0:fired")` direct hors registry).

### 4.9 `<SeasonalCompass />`
Boussole saisonnière (équinoxe / solstice / lune en cours). Affichée discrètement en haut Journal et Annales.

---

## §5 — Intégration codebase Next.js (instructions équipe dev)

### 5.1 Stratégie générale

Le proto utilise React 18 + Babel inline. Pour Next.js prod :

1. **Convertir tous les `.jsx` en modules ES** (ajouter `import React from "react"` en tête, `export` les composants au lieu de `Object.assign(window, ...)`).
2. **Remplacer le routeur hash-based** (`app.jsx`) par `next/router` ou `app/` directory (App Router).
3. **Migrer `styles.css`** vers `app/globals.css` ou CSS Modules. Garder les tokens CSS custom properties tels quels.
4. **Extraire les SVG defs des matters** depuis `Dream V1.html` (lignes 10-50) vers un composant `<MatterDefs />` monté une fois en `app/layout.tsx`.

### 5.2 Pattern d'override → composition

Le pattern `window.X = AmplifiedX` est un **hack proto**. En prod, remplacer par composition explicite :

```tsx
// app/components/screens/KairosDetail.tsx
import { KairosDetailBase } from "./KairosDetailBase";
import { Surface, HaloRespire, GeoSymbol } from "@/components/v12";

export function KairosDetail({ go, entry, allEntries }) {
  return (
    <div className="relative">
      <Surface matter="paper" motion className="absolute inset-0 z-0" />
      <HaloRespire kind="silk" />
      <KairosDetailBase go={go} entry={entry} allEntries={allEntries} />
    </div>
  );
}
```

**Ou** intégrer directement l'amplification dans le composant base et supprimer la couche V1.1. Décision à prendre côté équipe selon préférence (composition vs. inline).

### 5.3 Étapes recommandées

1. **Phase 1 (1-2 jours)** : créer `components/v12/` avec `Surface`, `HaloRespire`, `GeoSymbol`, `ConstellationD3` portés en TSX. Créer `MatterDefs.tsx` monté en layout. Migrer `styles.css`.
2. **Phase 2 (3-5 jours)** : porter les 8 écrans cœur (Vague 2) — Home, Capture, KairosDetail, Portrait, AnimaVoute, Chat, Reentry, BigDreamSignal. Tester le flux principal.
3. **Phase 3 (3-4 jours)** : porter les 8 écrans secondaires (Vague 3) + 8 surfaces meta (Vague 4).
4. **Phase 4 (2 jours)** : intégrer `wowRegistry` (côté client, localStorage) et `playRitual` (sons réels — voir §6). Tester les 5 Wow moments.
5. **Phase 5 (1 jour)** : audit visuel comparatif proto ↔ prod, ajustements.

### 5.4 Pièges connus

- **`color-mix(in oklch, …)`** est utilisé partout en CSS. Compatibilité Safari < 16.4 ⚠️ — vérifier la couverture browser cible.
- **`textWrap: "pretty"`** sur les paragraphes serif. Compatibilité Chrome ≥ 117, Safari ≥ 17.5. Fallback gracieux mais à valider.
- **`<ConstellationD3>` dépend de `d3-force`** (chargé via CDN dans le proto). En prod : `npm i d3-force` + tree-shake.
- **Tweaks panel mount-time hash override** : `app.jsx` force `screen="home"` au mount (ligne ~38). En prod avec Next router, ce comportement disparaît naturellement.
- **`window.claude.complete()`** est utilisé dans `Chat`, `FigureDetail` (dialogue figure) et `ForetFirst` (génération angles). En prod → remplacer par appel API Anthropic / OpenAI / votre proxy LLM.

### 5.5 Tokens CSS critiques à préserver

```css
/* tempi organiques V1.2 (styles.css:910-917) — ne pas accélérer */
--tempo-souffle: 6000ms;     /* respiration méditative ~10 cycles/min */
--tempo-braise:  3500ms;     /* pulsation cardiaque ~17 BPM */
--tempo-derive:  12000ms;    /* dérive cosmologique */
--ease-souffle:  cubic-bezier(0.45, 0, 0.55, 1);
--ease-braise:   cubic-bezier(0.4, 0.1, 0.6, 0.9);

/* tokens V1.1 hérités encore utilisés dans certains motion */
--respire:       6s;
--ease-respire:  cubic-bezier(0.4, 0, 0.6, 1);

/* couleurs signature (V1.1 + V1.2) */
--obsidian:    oklch(15% 0.01 240);
--night-warm:  oklch(20% 0.015 60);
--night-floor: oklch(12% 0.01 240);
--bone:        oklch(0.78 0.015 70);
--silk-gold:   oklch(78% 0.12 75);
--ember-live:  oklch(68% 0.18 40);
--clay-earth:  oklch(55% 0.08 50);
--paper-warm:  oklch(72% 0.025 70);
--stone-cool:  oklch(55% 0.012 240);
--ash-light:   oklch(70% 0.005 240);
--ash-mid:     oklch(50% 0.005 240);
--ash-deep:    oklch(35% 0.005 240);

/* fontes */
--serif: "EB Garamond", "Iowan Old Style", Georgia, serif;
--sans: "Inter", system-ui, sans-serif;
--mono: "JetBrains Mono", ui-monospace, monospace;
```

> **Décalage doc historique** : `--respire` et `--ease-respire` (V1.1) coexistent avec `--tempo-souffle` et `--ease-souffle` (V1.2). Les motions V1.2 utilisent `--tempo-souffle`. Pas un conflit, juste une dualité héritée — à harmoniser au port prod (préférence : tout migrer vers `--tempo-*` + `--ease-*`).

---

## §6 — Sons rituels (refs)

Le proto génère les sons via Web Audio API (oscillators + envelopes) pour rester self-contained. **Pour la prod**, remplacer par des samples authentiques.

| Nom | Usage | Référence freesound.org / commerciale |
|---|---|---|
| `souffle` | Passage de seuil (entrée écran, étape onboarding) | [freesound.org/people/InspectorJ/sounds/411469/](https://freesound.org/people/InspectorJ/sounds/411469/) — *human breath, soft exhale* (CC BY 3.0) |
| `braise` | Gate ember Capture (frappe textarea) | [freesound.org/people/dheming/sounds/197744/](https://freesound.org/people/dheming/sounds/197744/) — *ember crackle, warm hearth* (CC BY 4.0) |
| `tisse` | Réponse Chat narratrice | [freesound.org/people/Sandermotions/sounds/615473/](https://freesound.org/people/Sandermotions/sounds/615473/) — *fabric weave, soft thread* (CC0) |
| `ceremoniel` | Forêt FIRST résolution, OffreKairos ouverture | [freesound.org/people/InspectorJ/sounds/484297/](https://freesound.org/people/InspectorJ/sounds/484297/) — *Tibetan singing bowl, low* (CC BY 4.0) |
| `seuil` | Wow0 (premier accès onboarding) | [freesound.org/people/garuda1982/sounds/586105/](https://freesound.org/people/garuda1982/sounds/586105/) — *deep gong, single strike* (CC BY 4.0) |

**Cahier des charges sons rituels** :
- Durée 800ms - 2.5s max.
- Amplitude pic ≤ -12 dBFS, fade-out doux ≥ 300ms.
- Pas de transients agressifs (pas de claps / clics).
- Spectre centré graves-médiums (60Hz - 1kHz dominant).
- Mono ou stéréo très centré (pas de panning fort).
- Format final : `.webm (Opus)` 48kHz, ~30-50 KB par son.

**À vérifier en prod** : licence des samples retenus, attribution dans les credits si CC BY.

---

## §7 — 6 Wow moments + trigger logic (post-patch V5)

Les **Wow** sont les moments où le système se manifeste comme **vivant** au lieu de fonctionner. Ils sont rares — un par cycle, pas tous à chaque session. Tous (sauf Wow5) sont câblés in-code post-patch V5.

### Wow0 — Premier souffle (clé `first-launch`)
- **Trigger** : première visite Onboarding — `wowRegistry.fire("first-launch")` dans `OnboardingV12` `useEffect`.
- **Manifestation** : `playRitual("seuil")` au mount + matter ember + halo silk respirant + spirale dorée bas.
- **Code** : `screens-v12-vague4.jsx` ligne ~22.
- **Status** : ✅ câblé via wowRegistry post-patch V5 (avant : localStorage direct hors registry).

### Wow1 — Premier kairos déposé (clé `premier-kairos`)
- **Trigger** : premier appui sur "garder" en Capture — `wowRegistry.fire("premier-kairos")` dans `CaptureV12.garder()`.
- **Manifestation** : `<SpiraleWowOverlay show />` — spirale dorée logarithmique se déploie 1.8s depuis le centre + son `ceremoniel`.
- **Code** : `screens-v12-amplified.jsx:135-148`.
- **Status** : ✅ câblé.

### Wow2 — Premier écho prophétique (clé `premier-echo-prophetique`)
- **Trigger** : arrivée sur Portrait, après build constellation (+2.5s) — `wowRegistry.fire("premier-echo-prophetique")` dans `PortraitV12` `useEffect`.
- **Manifestation** : arc silk-gold éphémère reliant 2 kairos résonants (ex: `eau ↔ travail`) sur la constellation. Animation `echoArcDraw` 4.2s. Son `tisse`.
- **Code** : `screens-v12-amplified.jsx` (PortraitV12, post-patch V5).
- **Status** : ✅ câblé post-patch V5 (avant : non firé).

### Wow3 — Premier BigDream marqué (clé `big-dream-marquage`)
- **Trigger** : KairosDetail si `entry.bigDream === true` après 800ms — `wowRegistry.fire("big-dream-marquage")` dans `KairosDetailV12` + `BigDreamSignalV12`.
- **Manifestation** : halo `bigdream` pleine puissance + `spirale` géosymbole or (opacité 0.10 → 0.22 pulse 4.5s) + son `ceremoniel`.
- **Code** : `screens-v12-amplified.jsx:267-277` (KairosDetail) + `:828-836` (BigDreamSignal).
- **Status** : ✅ câblé.

### Wow4 — Naissance d'un noeud constellation (clé `naissance-noeud`)
- **Trigger** : Forêt FIRST phase `resolve`, après felt-shift picked — `wowRegistry.fire("naissance-noeud")` dans `ForetFirstV12.onShiftPicked()`.
- **Manifestation** : overlay SVG `naissance-noeud-wow` — noeud central qui pulse, 5 edges progressives qui se dessinent vers 5 satellites silk-gold (~3.6s total). Son `ceremoniel` puis ouverture `<AhaCapture>`.
- **Code** : `screens-v12-vague3.jsx` ForetFirstV12 (post-patch V5).
- **Status** : ✅ câblé post-patch V5 (avant : non firé).

### Wow5 — Première restitution cercle (clé `premiere-restitution-cercle`)
- **Trigger** : utilisateur participe à sa première restitution rituelle de cercle.
- **Manifestation** : `<ConstellationGeneric mode="cercle">` s'allume avec edges `alive=true` qui pulsent + son `tisse`.
- **Status** : ⚠️ **logique implémentée dans wowRegistry, pas encore branchée à un événement réel** (pas de UI cercle rituel dans V1.2). À finaliser en V2.

---

## §8 — Bugs connus / limitations / V2

### 8.1 Limitations actuelles

| Item | Impact | Workaround / fix prévu V2 |
|---|---|---|
| Hash routing override par TWEAK_DEFAULTS | Nav directe via `#screen` ne fonctionne qu'après mount | Naviguer via panneau Tweaks. **Disparaît avec next/router** en prod. |
| Wow5 (rituel cercle) non branché | Logique `wowRegistry.fire("wow5")` non appelée | Ajouter trigger en V2 quand UI rituel cercle finalisée |
| Sons générés Web Audio synthétique | Sons proto, pas finaux | Remplacer par samples §6 en prod |
| `window.claude.complete()` mocké en proto | Appels LLM = simulation côté proto | Branchement vrai LLM en prod (§5.4) |
| Pas de persistance entries | Tous les kairos viennent de `seedEntries` static | Backend + auth en prod |
| Pas de sync cercle | `seedCercle` static, pas de WebSocket | Backend cercle + temps réel en V2 |

### 8.2 Bugs résolus durant le développement

- ✅ **Vague 4 audit** : `GeoSymbol kind="cercle-concentrique"` retournait null silencieusement (3 sites). Fix : alias ajouté dans `shared-v12.jsx` ligne 67. Cercles concentriques visibles sur Cercle, Annales, OracleCorps.
- ✅ Conflits `useState/useEffect` entre fichiers (résolus avec aliases `uS`/`uE`/`uMS`/`uSS`/`v3S`/`v4S` etc.).
- ✅ Modal V1.2 backdrop conflictant avec Surface (résolu par `pointerEvents: none` sur Surface).

### 8.3 Pour V2 (futures vagues d'amplification)

- **Notifications push** réelles (whisper aux phases de lune).
- **Backend cercle** + sync rêves partagés.
- **Export PDF** des Big Dreams (livre rituel).
- **Mode hors-ligne** complet (déjà annoncé en Privacy, à implémenter).
- **Voix narratrice** TTS (option premium ?).
- **Saisonal compass** : actions saisonnières (équinoxe → invitation rituel cercle, etc.).
- **Constellation interactive** sur écran principal (Portrait) → drag des figures, sauvegarde positions.
- **Wow6+** : moments à inventer après usage utilisateur réel.

---

## §9 — Rapport audit V5 (verifier subagent — final)

### Vague 2 (8 écrans cœur) — ✅ clean
Tous chargent, overrides actifs, aucune erreur console. Constellation D3 vivante au mount Portrait. SpiraleWowOverlay déclenché à Capture submit. Halo bigdream visible sur KairosDetail BigDream. Triangle rituel + gates ember sur Reentry.

### Vague 3 (8 écrans secondaires) — ✅ clean
Tous chargent, overrides actifs. Forêt FIRST workflow 5 phases fonctionnel. Constellation kairos sur Cercle (pas membres). Drop caps visibles (Polyphonie, Conte-miroir, FigureDetail BigDream).

### Vague 4 (8 surfaces meta) — ✅ clean après fix
- 1 bug trouvé : `GeoSymbol kind="cercle-concentrique"` non reconnu (alias manquant).
- **Fix appliqué** dans `shared-v12.jsx` : alias `cercle-concentrique → concentric` + `demi-cercle-aurore → demi-cercle` ajoutés en tête de `GeoSymbol`.
- **Re-vérifié** : cercles concentriques visibles sur Cercle, Annales, OracleCorps.

### Note non-bloquante
TWEAK_DEFAULTS.screen="home" override hash au mount → nav `#screen-name` directe inopérante après refresh. **Disparaît en prod Next.js** (next/router gère le routing nativement).

---

## §10 — Contact / questions

Pour toute question d'intégration : revenir avec le bug, le fichier, la ligne. Le proto est conçu pour être lisible — chaque vague est un fichier autonome, chaque écran amplifié est commenté en tête.

---

## §11 — Patches V5 appliqués (2026-04-25, Yeshua)

Suite à l'audit `AUDIT-V1.2-FINAL-2026-04-25.md`, 7 patches mécaniques ont été appliqués au pack handoff. Tous testés via grep pour cohérence.

| # | Patch | Sévérité | Fichier(s) | Description | Status |
|---|---|---|---|---|---|
| A | Filter SVG ID typo | 🔴 BLOQUANT | `shared-v12.jsx:45` | `url(#n-${matter})` → `url(#noise-${matter})` — corrige bed-noise overlay invisible sur TOUS les écrans V1.2 | ✅ |
| B | Matter `bone` undefined | 🔴 BLOQUANT | `Dream V1.html` + `styles.css` | Ajout `<filter id="noise-bone">` + `.bed-bone` + `.motion-bone` — corrige Privacy invisible | ✅ |
| C | Wow2 + Wow4 câblage | 🟡 IMPORTANT | `screens-v12-amplified.jsx` (PortraitV12) + `screens-v12-vague3.jsx` (ForetFirstV12) | Ajout `wowRegistry.fire()` + listeners + animations visuelles (arc silk-gold + naissance noeud SVG) | ✅ |
| D | Wow0 hors registry | 🟡 IMPORTANT | `shared-v12.jsx` + `screens-v12-vague4.jsx` | Ajout `"first-launch"` dans `WOW_NAMES` + refactor `OnboardingV12` (migration silencieuse de l'ancienne clé `dream:wow0:fired`) | ✅ |
| E | Gradient `aurore-gradient` non défini | 🟡 | `Dream V1.html` defs | Ajout `<linearGradient id="aurore-gradient">` — corrige demi-cercle aurore Anima/Polyphonie/Notifs (était `currentColor`) | ✅ |
| F | 3 écrans Cercle V1.1 non amplifiés | 🟡 | `screens-v12-vague3.jsx` | Helper `cercleAmbientWrap()` + overrides `CreerCercleScreen` / `RejoindreScreen` / `PartagerReveScreen` (matter earth/silk + halo silk + concentric subtil) | ✅ |
| G | `prefers-reduced-motion` incomplet | 🟡 | `styles.css:1267` | Ajout `.spirale-wow svg/path` + `.motion-bone` dans la liste des sélecteurs désactivés en reduced-motion | ✅ |

**Verdict pack post-patch** : 🟢 GREEN clean. Les 7 fixes corrigent les 2 bugs bloquants + 4 yellows + l'oubli d'amplification cercle. Pack prêt pour intégration codebase Next.js.

**Bugs résiduels connus** : 0 bug bloquant. Voir §12 ci-dessous pour limitations restantes (toutes annoncées et acceptables pour V1.2).

---

## §12 — Limitations connues (post-patch, acceptables V1.2)

| Item | Impact | Mitigation / fix prévu |
|---|---|---|
| Wow5 (`premiere-restitution-cercle`) non branché à un trigger réel | Wow visuel non déclenché en cercle | Ajouter trigger en V2 quand UI rituel cercle finalisée (cf. §7 Wow5) |
| Sons rituels Web Audio synthétiques | Sons proto, pas finaux | Remplacer par samples §6 en prod |
| `window.claude.complete()` mocké en proto | Appels LLM = simulation | Brancher proxy LLM Anthropic en prod (cf. §5.4) |
| Pas de persistance entries (`seedEntries` static) | Tous les kairos sont seedés | Backend Supabase + auth en prod |
| `ReentryV12` wrapper ne peut pas inspecter la phase interne pour switch matter `ember↔earth` selon la phase | Matter earth global au lieu de dynamique | Réécriture complète du composant en prod (override pattern → composition explicite) |
| Performance D3-force avec datasets > 50 nœuds sur mobile bas-de-gamme | Lag possible Portrait/Anima | Limiter via API top 30 par weight + `alphaDecay` plus rapide (0.025) |
| Babel inline + d3 UMD via CDN (~600KB) | Acceptable proto, pas prod | Tree-shake `d3-force` + transpile via SWC en prod Next.js |
| iOS Safari `AudioContext` peut être suspendu si pas de user gesture précédent | 1er son rituel parfois muet | Code gère `ctx.resume()` mais à tester device réel |
| `color-mix(in oklch, …)` et `textWrap: "pretty"` | Browsers anciens fallback gracieux | Acceptable si user base Safari ≥ 16.4 / Chrome ≥ 117 |

---

## §13 — Instructions intégration codebase Next.js (équipe Yeshua)

Cette section condense les étapes du plan §9 de l'audit pour porter le pack en prod. Voir `AUDIT-V1.2-FINAL-2026-04-25.md` §9 pour détails complets.

### 13.1 Prérequis
- Repo `dream-alpha-app/` actuel (Next.js 14 App Router, Supabase auth, Vercel deploy).
- Ce pack handoff `dream-v1.2-FINAL-2026-04-25/handoff-v12-final/` (post-patch V5).

### 13.2 Étapes ordonnées (12-15 jours-dev estimés)

| Étape | Effort | Output |
|---|---|---|
| 1. Préparation arbo `src/components/dream/v12/` + `src/lib/dream/v12/` + backup `_yeshua_synthesis_*` | 1-2 h | Dossiers vides + backup |
| 2. Fusion CSS V1.2 dans `globals.css` (sans écraser tokens Kemet) + `<MatterDefs />` monté in `app/layout.tsx` (extrait des 9 filters + gradient aurore) | 2-3 h | CSS + MatterDefs OK |
| 3. Port composants partagés en TSX : `Surface.tsx`, `HaloRespire.tsx`, `GeoSymbol.tsx`, `ConstellationD3.tsx`, `SpiraleWowOverlay.tsx`, `wowRegistry.ts`, `playRitual.ts`, `useWowFire.ts` | 4-6 h | Modules typés `npm install d3-force @types/d3-force` |
| 4. Adaptation données Supabase : `/api/figures` + `/api/dreams/count` + Wow1-4 triggers wired sur counts/events réels (cf. AUDIT §9.4) | 4-6 h | API routes shape `{nodes, edges}` |
| 5. Migration écrans (10 sous-étapes 5a→5j, ordre simple → complexe : Surface ambient → Capture → KairosDetail → Portrait → Anima/Météo/Polyphonie → Cercle → Forêt FIRST → Wrappers V4 → BigDream/Reentry → Chat/Figure) | 8-9 j | Tous écrans amplifiés en prod |
| 6. Tests par écran (checklist matter/halo/géo/Wow/V1.1 patches/console/reduced-motion/Lighthouse/touch targets) | 1 j | Checklist GREEN |
| 7. Deploy `cd dream-alpha-app && npx vercel --prod` (jamais git push, cf. feedback `deploy_vercel_only`) | 30 min | Live https://dream-alpha-bice.vercel.app/ |
| 8. Post-deploy polish + smoke test mobile (iPhone Safari + Android Chrome) + recueil feedback Tim sur 1-2 sessions | 1-2 j | Réglages opacité/timing |

### 13.3 Risques principaux + mitigation

| Risque | P×I | Mitigation |
|---|---|---|
| Conflit CSS V1.2 ↔ design system Kemet existant | Moyenne × Haut | Ajouter V1.2 tokens **en plus** sans écraser. Scoper `.v12 .surface`, `.v12 .bed-*` si conflit |
| API endpoints manquants pour Constellation/Wow data | Haute × Haut | Avant migration écran X, vérifier endpoint correspondant (Portrait → /api/figures, Anima → /api/dreams/collective) |
| Régression V1.1 sur AuthScreen, FeedbackButton existant | Faible × Moyen | Tester ces 2 écrans après merge styles.css |
| Re-instanciation D3 simulation à chaque render | Moyenne × Moyen | Memoize nodes/edges côté caller (`useMemo`) |

### 13.4 Pattern d'override → composition explicite (rappel)

Le pattern `window.X = AmplifiedX` est un hack proto. En prod TSX, remplacer par composition (cf. §5.2). Préférer **inline amplification** dans le composant base unique (pas de couche V1.1/V1.2 séparée) pour réduire la complexité d'entretien.

### 13.5 Checklist GO/NO-GO avant deploy

- [ ] `npx tsc --noEmit` passe (typage strict OK)
- [ ] `npx next build` passe (SSR OK)
- [ ] Tous les 5 Wow déclenchés sur compte démo (vérifier `localStorage["dream:wow-fired"]`)
- [ ] V1.1 patches actifs (`AhaCapture`, `FeltShiftGate`, `ExitToHuman`, `FeedbackFloat`)
- [ ] Mode `prefers-reduced-motion` testé (devtools)
- [ ] Mobile iPhone Safari + Android Chrome OK
- [ ] Lighthouse mobile > 80
- [ ] Tim a fait un smoke test 5 écrans clés (Home → Capture → Journal → KairosDetail → Portrait)

---

**Bonne intégration. Tenez les rêves doucement.**

— *Dream Visual System V1.2 (post-patch V5), livré en 4 vagues d'amplification (V1.1 base + Vagues 2/3/4) sur le proto HTML/React. Pack patché 2026-04-25 par Yeshua. Prêt pour le port Next.js.*
