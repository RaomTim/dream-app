# PROMPT V1.2 — APPLIQUE CE QUE TU AS DÉJÀ SPEC

> À coller dans la session Claude Design existante (continue) ou nouvelle.

---

## Le constat brutal

Tu as livré V1.1 fonctionnel et éthiquement carré. Bravo. **Mais tu as appliqué environ 40% du §4 Système visuel du mega-prompt V1.** Les 60% manquants sont précisément ce qui rend l'app **vivante, dense, sensuelle** au lieu de tiède.

Ce round n'ajoute RIEN à la spec. Il te demande juste d'**appliquer pleinement ce qui est déjà spec'd** dans le mega-prompt V1 que tu as en contexte.

**Re-lis maintenant les sections suivantes du mega-prompt V1 que tu as déjà** :
- **§0 Posture** (Bachelard, Tarkovsky, Pallasmaa, Tanizaki, Zumthor, Albers — pas du SaaS)
- **§4.1 Posture visuelle** (atmosphère vivante au sens Zumthor, Q.W.A.N. Alexander)
- **§4.3 Accents matter-couleurs** (les 7 dimensions avec leurs couleurs précises)
- **§4.7 Les 8 matter tokens** (linen, silk, stone, paper, ash, water, ember, earth — chacun avec son pattern noise et usage Bachelard explicites)

C'est tout. La doctrine est là. Tu ne l'as pas pleinement incarnée.

---

## Ce qui est sous-appliqué (priorisé)

### ❌ 4 matter tokens absents ou timides — à RÉVEILLER (§4.7)

Le V1 spécifie 8 matter tokens. Tu en utilises 4. **Active les 4 manquants** selon spec V1 §4.7 :

1. **`silk-gold`** : timide actuellement. Doit être **PRÉSENT et RESPIRANT** sur :
   - Tous les kairos numinous (halo qui pulse 6s, opacity 0.6 → 1.0 → 0.6)
   - Marqueurs Big Dream (spec §4.3 + halo ember-soft V1 §3 Écran 4)
   - Étoiles de la Voûte Anima Mundi
   - Moments Aha capture
   - Edges de la Constellation Cercle (filaments dorés ondulants, pas droits)

2. **`water`** : absent actuellement. Doit être **fond vivant** sur :
   - Anima Mundi Voûte (sinusoidal flowfield + caustics, 60s/cycle — c'est dans ta spec V1 §4.7)
   - Réentrée onirique (passage à l'intériorité)
   - Background Détail Kairos rêve nocturne
   - Transitions vers chat narratrice (le contenu actuel coule vers le bas comme de l'eau)

3. **`ember`** : presque absent. Doit **PULSER** (spec V1 §4.7 : "flicker très lent 8-12s") sur :
   - Card EXITHumanFooter / numéro 3114 (urgence empathique, pas alarme)
   - Refus doux Réentrée gating
   - Détail Figure si archétype shadow / unwelcome_intrusion
   - Pastille Numinosity 4-5 (V1 §4.7 explicite)

4. **`earth`** : absent. Doit chauffer :
   - Silhouette Oracle du Corps
   - Cards de fond du Cercle (chaleur communautaire)
   - Détail Kairos resolved (V1 §4.7 explicite)

→ **Implémente les 8 SVG `<feTurbulence>` filters réellement appliqués** (Dream V1.html en a 4 sur 8 — ajoute water, ember, silk-gold, earth selon les patterns spec V1 §4.7).

### ❌ Motion organique au lieu d'animations CSS plates

Tu as les tokens (`tempo-tisse 380ms`, `tempo-ceremoniel 920ms`, `ease-respire`, `ease-tenue`). **Mais tu les appliques à du fade-in linéaire plat.** Tarkovsky n'est pas lent ; Tarkovsky est TENSE.

Ajoute ces patterns de mouvement (qui découlent de ta spec V1) :
- **Halos respirants** : opacity sin-wave 6s sur silk-gold numinous (spec V1 implique : "halo ember-soft à 8% opacity" Écran 1, à étendre numinous)
- **Pulsation cardiaque** : opacity 0.7 → 0.95 → 0.7 sur 3-4s pour ember-live (spec V1 §4.7 "flicker très lent 8-12s")
- **Water flow descendant** : ultra-lent 12-15s linear, particules water qui glissent (spec V1 §4.7 "sinusoidal flowfield + caustics 60s/cycle")
- **Ash drift** : particules cendre qui dérivent horizontalement très subtil (spec V1 §4.7 "Gaussian noise très fin")

Pas besoin de nouveaux tokens. Juste **applique les existants à du mouvement organique**.

### ❌ Constellation Cercle + Portrait — VIVANTE (force-directed réelle)

Ta propre note V1 : *"Constellation est hand-laid, pas force-directed. Pour V2 j'aurais wired d3-force."*

V2 = maintenant. **Implémente d3-force** (CDN `d3-force@3` from cdn.jsdelivr.net). Particules silk-gold drift en background. Edges Bézier qui ondulent doucement (1-2px amplitude, 8s cycle). Halo respirant sur noeud focus.

Sur Cercle : la constellation montre les **kairos partagés** (figures, motifs, symboles chauds), pas les visages des membres. Liste membres = pseudonymes en sidebar discrète. C'est déjà demandé en V1.1 — confirme la refonte.

### ❌ Moments seuils — calibrer 5 moments "wow"

Spec V1 implique mais ne calibre pas explicitement les seuils initiatiques. Ajoute-les :

1. **Premier kairos déposé** (à vie) : post-capture spirale silk-gold + sol qui devient water 1.2s + texte spécial *"Ton premier kairos. Quelque chose vient de commencer."*
2. **Premier écho prophétique** (à vie) : kairos source halo silk-gold + ouverture spéciale "deux kairos côte-à-côte avec arc silk-gold qui les relie"
3. **Big Dream marquage** : halo silk-gold respirant permanent + drop cap EB Garamond 48px + bouton revisit J+7/30/365 (spec V1 §3 Écran 4 mention `LET_THE_DREAM_LIVE`)
4. **Nouveau noeud constellation** : naissance avec drift vers position D3, edges qui se forment progressivement
5. **Première restitution cercle** : eau qui coule de bas en haut (inversion de gravité, moment liminaire) sur 2400ms, paragraphes apparaissent un par un (1500ms gap)

Chacun = un seuil initiatique, pas une récompense gamifiée. Sobre, sacré, sans jingle.

### ❌ Sons rituels (manquant total)

Toggle dans Paramètres > Notifications : *"Sons rituels ▢"* (default OFF). Si activé : drone ambient au launch, cloche cristal au moment Wow 1 et Wow 3, texture papier au tap, pluie distante sur écrans nuit (loop), vent dans feuilles sur Oracle du Corps.

Sources : freesound.org curated. **Aucune musique mélodique. Aucun gong wellness.** Sobre, naturel, court.

### ❌ Imagery géosymbolique (manquant)

Pas d'illustrations literal. Pas d'animaux dessinés. Mais ajoute ces formes pures inline SVG :
- **Spirale logarithmique** silk-gold (nautilus, fibonacci) → Wow 1, Big Dream
- **Cercles concentriques** linen → silk-gold gradient → Portrait centre, Aha capture
- **Triangle équilatéral** water alpha 0.4 → écrans rituels
- **Demi-cercle horizontal** silk-gold → en haut Anima Mundi (aurore subtile)
- **Lignes ondulantes parallèles** water → backgrounds nuit
- **Croissant lunaire fin** silk-gold → polyphonies lunaires

Ces formes existent déjà dans la culture sacrée millénaire. Pas d'invention. Juste application.

---

## Ce qui reste à NE PAS toucher

- Architecture des 24 écrans : OK
- Vocabulaire désensorcelé : OK
- Anti-patterns évités : OK
- Composants V1.1 (AhaCapture, FeltShiftGate, TraumaGate, EXITHumanFooter, Cercle k-anonymity refonte, Abonnement no-feature-gating, Détail Figure trauma gate) : à GARDER tels quels

---

## Posture

Tu n'as pas besoin de réinventer. **La doctrine est dans le V1 que tu as déjà**. Ce round = **incarnation, pas conception**.

Avant chaque décision visuelle, demande-toi :
- *Bachelard reconnaîtrait-il sa philosophie de la matière dans ce que je fais ?*
- *Tarkovsky ne couperait-il pas cette transition au montage ?*
- *Tanizaki accepterait-il cette intensité de doré sur sombre ?*

Si oui → continue. Si non → refonde.

Tim n'est pas convaincu par l'esthétique actuelle. Pas parce que c'est mauvais, mais parce que c'est **TIÈDE**. Tu as le talent (silk-gold respire, water coule, ember pulse, constellation respire). Sors-le.

Livre handoff bundle V1.2 quand fait. Pas de nouveaux écrans. Juste **les 24 existants RÉVEILLÉS** selon §4 V1.

— Yeshua, 2026-04-25, Bali. Ne refais pas. Réveille.
