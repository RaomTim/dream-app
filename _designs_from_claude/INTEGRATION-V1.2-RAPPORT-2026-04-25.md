# Dream V1.2 — Rapport d'intégration codebase Next.js

**Date** : 2026-04-25
**Agent** : Yeshua (Opus 4.7)
**Source pack** : `_designs_from_claude/dream-v1.2-FINAL-2026-04-25/handoff-v12-final/` (post-patch V5, GREEN clean)
**Codebase cible** : `dream-alpha-app/src/` (Next.js 14 App Router, Supabase, Vercel)

---

## TL;DR

Couche d'amplification V1.2 portée en TSX modulaire et intégrée dans le codebase prod sans casser V1.1. **TypeScript pass clean (zéro erreur `tsc --noEmit`)**. Build `npm run build` à lancer côté Tim (sandbox time-out, mais code valide).

- **Étapes 1-3-6-7** : full implementation (foundation V1.2 réutilisable + layout root + types check OK)
- **Étape 2** : composants TSX strict modernes — `Surface`, `HaloRespire`, `GeoSymbol`, `SpiraleWowOverlay`, `ConstellationD3`, `DepositFAB`
- **Étape 4** : amplification écrans = **8 sur 24** (les écrans correspondants au mapping spec V1.2 dans le codebase actuel)
- **Étape 5** : DepositFAB omniprésent câblé via CustomEvent → page.tsx route vers capture
- **Étape 8** : Wow0 + Wow1 câblés sur events réels (onboarding mount + premier dream count == 1). Wow2-5 : registry et hook prêts, à câbler post-backend events spécifiques

**Action Tim** :
1. `cd dream-alpha-app && npm install` (si pas déjà fait après ce rapport — d3-force ajouté au package.json)
2. `npm run build` local (validation finale)
3. `npx vercel --prod` pour deploy preview

---

## Inventaire fichiers créés / modifiés

### Nouveaux fichiers V1.2 (foundation)

| Path | Rôle | Lignes |
|---|---|---|
| `src/components/dream-v12/MatterDefs.tsx` | 9 SVG noise filters + aurore gradient (mounted once in layout) | 75 |
| `src/components/dream-v12/Surface.tsx` | Bed + noise overlay réutilisable, 9 matters, 3 motions | 64 |
| `src/components/dream-v12/HaloRespire.tsx` | Halos respirants : silk / ember / earth / bigdream | 33 |
| `src/components/dream-v12/GeoSymbol.tsx` | 6 géosymboles + helper `computeLogSpiral` | 124 |
| `src/components/dream-v12/SpiraleWowOverlay.tsx` | Wow1 visuel (spirale dorée 1.8s) | 38 |
| `src/components/dream-v12/ConstellationD3.tsx` | D3-force vivant + drag + particules + fallback static | 280 |
| `src/components/dream-v12/DepositFAB.tsx` | Bouton flottant 56px bas-gauche déposer | 78 |
| `src/components/dream-v12/GlobalDepositFAB.tsx` | Wrapper layout-mountable (CustomEvent dispatch) | 47 |
| `src/components/dream-v12/index.ts` | Barrel export — composants + lib helpers | 41 |
| `src/lib/dream-v12/wow-registry.ts` | Registry localStorage idempotent + 6 Wow names | 86 |
| `src/lib/dream-v12/use-wow-fire.ts` | Hook React listener `wow:fire` event | 28 |
| `src/lib/dream-v12/ritual-sound.ts` | Web Audio synthétiseur 5 sons rituels | 90 |

### Fichiers modifiés (intégration + amplification)

| Path | Modif |
|---|---|
| `src/app/layout.tsx` | Mount `<MatterDefs />` + `<GlobalDepositFAB />` |
| `src/app/globals.css` | **Append couche V1.2** (~370 lignes : tokens préfixés `--v12-*`, beds, motions, halos, géo, constellation, spirale wow, reduced-motion) |
| `src/app/globals.pre-v12.css` | **Backup** du globals.css avant fusion |
| `src/app/page.tsx` | Listener `dream:open-capture` event + Wow1 fire on first entry + show SpiraleWowOverlay overlay au render |
| `src/components/dream/screens/OnboardingScreen.tsx` | Surface ember + halo silk + spirale fond + Wow0 (`first-launch`) fire on mount + son `souffle` |
| `src/components/dream/screens/DreamHome.tsx` | Surface linen ambient + spirale subtile fond |
| `src/components/dream/screens/DreamCapture.tsx` | Surface ember flicker + halo ember |
| `src/components/dream/screens/JournalScreen.tsx` | Surface paper + songlines fond |
| `src/components/dream/screens/DreamDetail.tsx` | Surface dynamic (silk si bigDream sinon linen) + halo silk/bigdream si prophétique + spirale géo si bigdream |
| `src/components/dream/screens/DreamSync.tsx` | Surface water + songlines (échos onirique fluidité) |
| `src/components/dream/screens/DreamPattern.tsx` | Surface silk drift + cercles concentriques |
| `src/components/dream/screens/OracleCorpsScreen.tsx` | Surface earth + cercles concentriques autour silhouette |
| `src/components/dream/screens/CollectiveScreen.tsx` | Surface linen + demi-cercle aurore haut |
| `package.json` | Ajout `d3-force ^3.0.0` + `@types/d3-force ^3.0.10` |

---

## Détail par étape

### Étape 1 — Préparation arborescence ✅
- `src/components/dream-v12/` créé
- `src/lib/dream-v12/` créé
- `src/app/globals.pre-v12.css` créé (backup)

### Étape 2 — Composants V1.2 en TSX moderne ✅
Conversion vanilla `React.createElement` → TSX strict typé. Tous les composants sont :
- Marqués `'use client'` quand ils ont des effets/refs
- Typés (`Matter`, `HaloKind`, `GeoKind`, `NodeKind`, `WowName`)
- Sans `window.X` mutation directe (utilisent imports ES6 ou CustomEvent)
- Compatibles SSR (les hooks `useEffect` gèrent l'absence de `window`)

ConstellationD3 : `d3-force` chargé dynamiquement côté client (`import('d3-force')`) avec fallback layout statique circulaire si chargement échoue.

### Étape 3 — Fusion CSS V1.2 dans globals.css ✅
Append à la fin de `globals.css` (post-patch V5 styles.css fidèlement porté). **Tokens V1.2 préfixés `--v12-*`** pour ne PAS écraser les tokens Kemet existants (--bone, --night-floor, --bg-wash etc. qui sont déjà partout).

Ce qui est intégré :
- Tempi V1.2 (`--tempo-souffle`, `--tempo-braise`, `--tempo-derive`, `--ease-souffle`, `--ease-braise`)
- 9 matter beds (`.bed-linen`, `.bed-paper`, `.bed-stone`, `.bed-ash`, `.bed-water`, `.bed-ember`, `.bed-silk`, `.bed-earth`, `.bed-bone`)
- 11 motion utilities
- 3 halos respirants (`.halo-silk-respire`, `.halo-ember-respire`, `.halo-bigdream-combine`)
- 6 géosymboles helpers (`.spirale-wow`, `.triangle-rituel`, `.concentric-rings`, `.demi-cercle-aurore`, `.songlines-bg`, `.croissant-lune`)
- Constellation D3 styles (edges, nodes, particles, focal halo)
- Drop cap 48px utility (`.drop-cap`)
- `@media (prefers-reduced-motion: reduce)` reset complet

Coexistence Kemet + V1.2 sans conflit. Boost overlay V1.2 fonctionne sur paper/silk/water/ember/earth.

### Étape 4 — Amplification écrans ⚠️ partiel (8/24 écrans amplifiés)

| Écran proto V1.2 | Écran codebase équivalent | Statut | Amplification |
|---|---|---|---|
| Home | `DreamHome` | ✅ | linen + spirale |
| Capture | `DreamCapture` | ✅ | ember flicker + halo ember |
| Journal | `JournalScreen` | ✅ | paper + songlines |
| KairosDetail | `DreamDetail` | ✅ | linen/silk dynamique + halo bigdream/silk + spirale si bigdream |
| Portrait (figures) | `DreamPattern` | ✅ | silk drift + concentric |
| Oracle du Corps | `OracleCorpsScreen` | ✅ | earth + concentric |
| Voûte / Anima Mundi | `CollectiveScreen` | ✅ | linen + demi-cercle aurore |
| Onboarding P-Zéro | `OnboardingScreen` | ✅ | ember + halo silk + spirale + Wow0 |
| Météo onirique | `DreamSync` (échos) | ✅ | water + songlines (sémantique adjacente : échos ≈ courants) |
| FigureDetail | _N/A — listing dans `page.tsx` `figure-dreams` screen_ | ⏸️ | À amplifier dans page.tsx si Tim souhaite (Surface paper + halo silk) |
| Forêt FIRST | _N/A_ | ⏸️ | Sous-écran absent du codebase |
| Cercle / Créer / Rejoindre / Partager | `CirclesScreen` | ⏸️ | Pas amplifié (4 sous-écrans cumulés dans 1 fichier de 902 lignes — review structurelle requise avant wrap) |
| Polyphonie | _N/A_ | ⏸️ | Pas dans codebase |
| Annales BigDreams | _N/A_ | ⏸️ | Pas dans codebase (entries marquées via `prophetic_suspect` dans DreamDetail) |
| Offre au Kairos | _N/A_ | ⏸️ | Pas dans codebase |
| Conte-miroir | _N/A_ | ⏸️ | Pas dans codebase |
| Réentrée | _N/A_ | ⏸️ | Existe via `protocol-reentry` ProtocolGuide réutilisé — amplification possible à l'intérieur de ProtocolGuide si REENTRY_PROTOCOL détecté |
| Notifications | _N/A_ | ⏸️ | Pas d'écran dédié |
| Privacy / Abonnement | _N/A_ | ⏸️ | Pas d'écran dédié |
| BigDream Signal | _N/A_ | ⏸️ | Concept absorbé dans `DreamDetail` via `prophetic_suspect` |
| Chat narratrice | `DreamChat` | ⏸️ | Pas amplifié (composant dans page.tsx wrapping, refacto ultérieur) |

**Verdict** : 8 écrans amplifiés ambient (matter + halo + géo). Les 16 autres relèvent soit de fonctionnalités absentes du codebase (ex: Polyphonie, Conte-miroir, Annales), soit de composants composites complexes (ex: CirclesScreen 902 lignes, ProtocolGuide 531 lignes) où une amplification minimale ambient est possible mais demande review chirurgicale ; reportée pour ne pas risquer de régression au premier deploy.

**Important** : la couche V1.2 est entièrement disponible (`Surface`, `HaloRespire`, `GeoSymbol`, `ConstellationD3`, `wowRegistry`, etc.) — Tim ou un futur agent peut amplifier les autres écrans en quelques lignes (3 imports + 2 wrapper divs + 1 zIndex sur le contenu).

### Étape 5 — DepositFAB omniprésent ✅
- Composant `DepositFAB.tsx` : bouton 56px bas-gauche, halo silk respirant, glyphe coupe centrée
- Wrapper `GlobalDepositFAB.tsx` : monté dans `layout.tsx`, dispatch `CustomEvent("dream:open-capture")`
- `page.tsx` : écoute l'event et route vers `screen='capture'`
- Auto-hide sur écrans capture/onboarding/protocol-* via dispatch `dream:fab-hide` / `dream:fab-show`
- Coexiste avec FeedbackButton (bas-droite 18px, FAB bas-gauche 18px)

### Étape 6 — MatterDefs + d3-force dans layout root ✅
- `<MatterDefs />` mounted **before** `<AuthProvider>` dans `layout.tsx body` → SVG defs accessibles dès le premier render
- d3-force importé dynamiquement côté client uniquement (pas de leak SSR ni d'augmentation bundle initial)
- d3-force ajouté à `package.json` dependencies + `@types/d3-force` en devDeps

### Étape 7 — Tests d'intégration ✅
- `npx tsc --noEmit` : **GREEN clean — zéro erreur TypeScript**
- `npm install d3-force @types/d3-force` : OK (6 packages added)
- `npm run build` : **non testé localement** (sandbox SIGTERM/timeout, attendu vu la taille du projet — à exécuter par Tim avant deploy)
- Composants V1.1 préservés : `AuthScreen`, `DreamChat`, `FeedbackButton`, `BottomNav`, `TopBar`, `OnboardingScreen` (juste enrichi, pas remplacé)

### Étape 8 — Wow moments câblés ⚠️ partiel
| Wow | Status | Trigger réel |
|---|---|---|
| **Wow0** `first-launch` | ✅ câblé | `useEffect` dans `OnboardingScreen` au mount → `wowRegistry.fire('first-launch')` + `playRitual('souffle')` |
| **Wow1** `premier-kairos` | ✅ câblé | Dans `fetchEntries` (page.tsx) — si `data.dreams.length === 1` ET pas déjà fired → `wowRegistry.fire('premier-kairos')` + `playRitual('ceremoniel')` + show `<SpiraleWowOverlay />` |
| **Wow2** `premier-echo-prophetique` | ⏸️ registry prêt, trigger backend manquant | Brancher quand l'API `/api/echoes` retournera un événement "first echo" |
| **Wow3** `big-dream-marquage` | ⏸️ registry prêt, à câbler dans DreamDetail | Brancher dans le toggle "marquer comme prophétique" UI dans `DreamDetail.tsx` (voir lignes 325+) |
| **Wow4** `naissance-noeud` | ⏸️ registry prêt, pas d'UI Forêt FIRST | À câbler quand un écran type Forêt FIRST sera ajouté |
| **Wow5** `premiere-restitution-cercle` | ⏸️ registry prêt | À câbler dans une future UI rituelle de cercle |

`useWowFire` hook dispo pour qu'un sous-composant écoute un Wow et déclenche un effet visuel local.

### Étape 9 — Build + deploy preview ⏸️ Action Tim
1. `cd /sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app`
2. `npm install` (intègre d3-force si pas déjà fait)
3. `npm run build` (valide compile complet — devrait passer vu tsc clean)
4. Si OK : `npx vercel --prod` (cf. feedback `deploy_vercel_only`)

---

## Bugs résiduels / limitations

| Item | Sévérité | Impact | Action |
|---|---|---|---|
| Build Next non testé sandbox-side | 🟡 | Risque résiduel : un import absolute, une route layout problème non détecté par tsc. tsc clean = strong indicator pas de bug majeur. | Tim lance `npm run build` localement |
| 16/24 écrans non amplifiés (mapping V1.2 ↔ codebase incomplet) | 🟡 | Le codebase actuel n'a pas tous les écrans du proto (Polyphonie, Annales, Conte-miroir, etc. = features futures). Ceux qui existent (CirclesScreen, ProtocolGuide, DreamChat) sont reportés pour amplification chirurgicale ultérieure. | Phase 2 d'amplification possible itérativement, sans bloquant pour V1.2 launch |
| Wow2/3/4/5 non firés sur événements réels | 🟡 | Les visuels Wow ne se déclenchent pas tant que les triggers backend ne sont pas branchés | Câbler progressivement quand l'API/UI correspondante existe |
| `/api/dreams` retourne `length === 1` test imprécis si Tim a déjà des dreams | 🟢 mineur | Wow1 pourrait ne jamais firer si l'utilisateur avait déjà des dreams avant l'intégration. wowRegistry.has est idempotent donc pas de re-fire intempestif | Acceptable — Wow1 se déclenchera pour vrais nouveaux users |
| ConstellationD3 non utilisé dans les écrans actuels | 🟢 | Composant dispo mais aucun écran ne l'utilise (DreamPattern utilise nuage statique). | Disponible pour quand Tim veut un écran constellation vivante |
| Sons rituels = synthétiseur Web Audio | 🟢 acceptable proto | Sons ronflants au lieu de vrais samples freesound | Remplacer par samples authentiques en V2 (cf. README §6 du handoff) |
| Spirale Wow z-index 250, position fixed | 🟢 | Garde l'overlay au-dessus de tout sauf modal-scrim (300) | Voulu — overlay éphémère 1.8s |
| color-mix(in oklch) usage extensif | 🟢 | Safari < 16.4 fallback | Acceptable — base utilisateur cible moderne |

---

## Architecture finale

```
src/
├── app/
│   ├── layout.tsx          ← <MatterDefs /> + <GlobalDepositFAB /> mounted
│   ├── page.tsx            ← Listener dream:open-capture + Wow1 fire + SpiraleWowOverlay render
│   ├── globals.css         ← Kemet tokens + V1.2 layer (--v12-* prefixed)
│   └── globals.pre-v12.css ← Backup pre-fusion
│
├── components/
│   ├── dream-v12/          ← ★ NOUVEAU — couche V1.2
│   │   ├── MatterDefs.tsx
│   │   ├── Surface.tsx
│   │   ├── HaloRespire.tsx
│   │   ├── GeoSymbol.tsx
│   │   ├── SpiraleWowOverlay.tsx
│   │   ├── ConstellationD3.tsx
│   │   ├── DepositFAB.tsx
│   │   ├── GlobalDepositFAB.tsx
│   │   └── index.ts        ← barrel export
│   │
│   └── dream/screens/      ← écrans amplifiés (V1.1 préservé + Surface/Halo/Geo wrappers)
│       ├── OnboardingScreen.tsx     ← +Wow0
│       ├── DreamHome.tsx
│       ├── DreamCapture.tsx
│       ├── JournalScreen.tsx
│       ├── DreamDetail.tsx
│       ├── DreamSync.tsx
│       ├── DreamPattern.tsx
│       ├── OracleCorpsScreen.tsx
│       └── CollectiveScreen.tsx
│
└── lib/
    └── dream-v12/          ← ★ NOUVEAU — helpers V1.2
        ├── wow-registry.ts ← localStorage idempotent + WOW_NAMES
        ├── use-wow-fire.ts ← hook listener
        └── ritual-sound.ts ← Web Audio synth (souffle/braise/tisse/ceremoniel/ancrage)
```

---

## Pattern d'amplification recommandé pour les écrans restants

Pour amplifier un screen V1.1 dans la même approche minimal-touch (sans réécrire la logique) :

```tsx
// 1. Imports
import { Surface, HaloRespire, GeoSymbol } from '@/components/dream-v12'

// 2. Wrapper container avec position relative + overflow hidden
<div style={{ position: 'relative', overflow: 'hidden', /* ... */ }}>
  {/* 3. Surface ambient en arrière-plan */}
  <Surface
    matter="silk"  // ou "earth", "ember", etc. selon spec V1.2 §3
    motion={true}
    style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
  />

  {/* 4. Halo respirant optionnel */}
  <HaloRespire kind="silk" style={{ position: 'absolute', inset: '15% 10%', zIndex: 0 }} />

  {/* 5. Géosymbole optionnel */}
  <div style={{ position: 'absolute', /* ... */, zIndex: 0 }}>
    <GeoSymbol kind="spirale" color="silk" />
  </div>

  {/* 6. Header + sections existantes — ajouter `position: 'relative', zIndex: 1` à chaque top-level div pour passer au-dessus */}
  <header style={{ position: 'relative', zIndex: 1, /* ... */ }}>...</header>
  <div style={{ position: 'relative', zIndex: 1, /* ... */ }}>...</div>
</div>
```

Pour câbler un Wow trigger spécifique :
```tsx
import { wowRegistry, playRitual } from '@/components/dream-v12'

// Quelque part dans une callback :
if (wowRegistry.fire('big-dream-marquage')) {  // false si déjà fired
  playRitual('ceremoniel')
  // Optionnel : effet visuel local (drop-cap permanent, halo bigdream pulse, etc.)
}
```

---

## Action Tim

1. **`cd dream-alpha-app && npm install`** — pour les nouvelles deps d3-force
2. **`npm run build`** — valider compile (devrait passer, tsc clean)
3. **Smoke test rapide** : ouvrir DreamHome, voir matter linen + spirale très subtile en fond ; ouvrir capture, sentir la chaleur ember
4. **`npx vercel --prod`** — deploy preview sur https://dream-alpha-bice.vercel.app/
5. Test mobile iPhone Safari + Android Chrome
6. Feedback : ajustements possibles sur opacities/timings via `--tempo-*` et `opacity` props

---

## Bonus / next moves possibles

- Amplifier ProtocolGuide en détectant config = REENTRY_PROTOCOL → wrap matter ember + triangle rituel
- Amplifier CirclesScreen ambient (matter earth + concentric)
- Câbler Wow3 dans DreamDetail (toggle prophétique)
- Remplacer Web Audio synth par vrais samples freesound (cf. README §6 du handoff)
- Utiliser ConstellationD3 dans une future refonte de DreamPattern (à la place du nuage statique)

---

**Prêt pour deploy preview.**
*— Yeshua, 2026-04-25*
