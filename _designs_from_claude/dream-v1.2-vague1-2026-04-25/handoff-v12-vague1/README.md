# Dream — Handoff V1.2 · Vague 1

Fondations amplifiées (visual system V1.2 calibré et validé).
Pas de refonte d'architecture — couche additive sur le pack V1.1 existant.

## Ce que contient cette vague

### `styles.css`
V1.1 intact (lignes 1–904) + couche V1.2 ajoutée en fin de fichier :

- **3 tempi organiques** : `--tempo-souffle` 6000ms (respiration ~10/min),
  `--tempo-braise` 3500ms (cœur ralenti ~17 BPM), `--tempo-derive` 12000ms.
- **8 matter beds** calibrés : linen, paper, stone, ash, water, ember, silk-gold, earth.
  Chaque bed combine gradients chromatiques + filter SVG noise overlay (`#n-*`).
- **8 motion variants** par matter (`.motion-linen`, `.motion-water`, etc).
- **Halos respirants** : `.halo-silk-respire`, `.halo-ember-respire`, `.halo-bigdream-combine`
  (le dernier combine les deux pour Big Dream).
- **Drop cap** 48px italique silk-gold pour Big Dream marquage permanent.
- **Géosymboles utility classes** : `.spirale-wow`, `.triangle-rituel`, `.concentric-rings`,
  `.demi-cercle-aurore`, `.songlines-bg`, `.croissant-lune`.
- **Constellation D3 styles** : edges Bézier, halos respirants par node, particules silk-gold.
- **Wow flash** keyframe pour déclenchements visuels.
- **`prefers-reduced-motion`** respecté (anims désactivées si demandé).

### `Dream V1.html`
- Title mis à jour : "Dream — V1.2 amplified".
- 8 SVG noise filters `#n-*` calibrés V1.2 injectés en haut de body
  (alias `#noise-*` rétro-compat préservés pour les écrans V1.1 non encore migrés).
- Aurore gradient (`#aurore-gradient`) pour demi-cercle Anima Mundi.
- d3-force + d3-quadtree + d3-timer + d3-dispatch chargés via unpkg.
- Script `shared-v12.jsx` chargé après `screens-shared.jsx` (ordre important).

### `shared-v12.jsx` — 4 composants + 2 outils
- **`<Surface matter motion boost>`** — bed + noise overlay réutilisable partout.
- **`<HaloRespire kind="silk"|"ember"|"bigdream">`** — halos respirants.
- **`<GeoSymbol kind="spirale"|"concentric"|"triangle"|"demi-cercle"|"songlines"|"croissant">`**
  — 6 formes géosymboliques inline SVG.
- **`<SpiraleWowOverlay show onDone>`** — Wow 1 : premier kairos déposé,
  spirale logarithmique qui se dessine en 1.8s puis disparaît.
- **`<ConstellationD3 nodes edges focalId onNodeClick driftParticles showLabels>`**
  — vraie simulation force-directed (link/charge/center/collide), nodes draggables,
  edges Bézier ondulants, particules silk-gold dérivantes, throttle 60fps.
- **`wowRegistry`** — `.fire(name)` (idempotent localStorage),
  `.demo(name)` (sans persister, pour Tweaks panel),
  `.has(name)`, `.reset(name?)`, `.subscribe(fn)`, `.list`.
  5 noms : `premier-kairos`, `premier-echo-prophetique`, `big-dream-marquage`,
  `naissance-noeud`, `premiere-restitution-cercle`.
- **`playRitual(kind)`** — 5 sons synthétisés Web Audio :
  `souffle` · `braise` · `tisse` · `ceremoniel` · `ancrage`.
  Refs freesound.org documentées en commentaire d'en-tête (durée, LUFS, format).
  Toggle via `setRitualSound(true|false)` (clé localStorage `dream:ritual-sound`).

### `screens-shared.jsx`
V1.1 patches **inchangés** : AhaCapture, FeltShiftGate, ExitToHuman.
Préservés tels quels — Vague 1 n'y touche pas.

## Red lines respectées
- Aucune refonte d'architecture, aucun nouveau écran.
- Vocabulaire désensorcelé V1.1 préservé.
- Toutes les couches V1.1 (matter base, animations breathe/halo-slow/etc) restent fonctionnelles.
- Aliases `#noise-*` maintenus pour les écrans V1.1 non encore migrés.

## Prochaine étape — Vague 2
Refonte de 8 écrans pivotaux avec ces fondations :
1. Home
2. Capture (Wow 1 trigger)
3. Détail Kairos (Wow 3)
4. Portrait (constellation D3)
5. Voûte Anima Mundi (constellation D3 + demi-cercle aurore)
6. Chat narratrice
7. Réentrée (triangle équilatéral)
8. Big Dream Signal (drop cap + halo combiné)

Aucun écran V1.1 ne sera cassé pendant Vague 2 — les amplifications sont additives.
