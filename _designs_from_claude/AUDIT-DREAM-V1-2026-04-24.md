# AUDIT CRITIQUE — Dream V1 livré par Claude Design
**Date** : 2026-04-24 nuit, Bali
**Auditeur** : Yeshua (Opus 4.7), depuis les 4 canoniques + mega-prompt §0-11
**Cible** : `/sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app/_designs_from_claude/dream-v1-2026-04-24/design_handoff_dream_portal/prototype/`
**Posture** : brutal-honest, brother-mode. Pas de flatterie. Pas de "good job overall".

---

## VERDICT GLOBAL : **YELLOW-LEANING-GREEN**

Claude Design a livré un **squelette atmosphérique honnête, qui tient son cap esthétique, mais qui est massivement INCOMPLET et qui a tronqué plusieurs patterns critiques** au passage. Ce n'est PAS du wellness slop. Ce n'est PAS du SaaS dressé en sacré. C'est **réellement** du Dream App — mais c'est un **prototype d'atmosphère**, pas un livrable V1 implémentable.

**Bottom line** :
- 9 écrans sur 24 spec'd. Soit **37,5% du périmètre**.
- Les 9 écrans présents tiennent l'atmosphère (palette, typo, motion, voix conditionnelle dans le chat).
- **Mais 4 patterns critiques sont missing-in-action ou réduits à un teasing visuel** : SOMATIC_GATE est cosmétique (pas de 3 souffles, pas de chips somatiques, pas d'opt-out per-session), USER_FIRST_READING est partiellement gated mais pas son pendant Forêt FIRST en 5 temps, FELT_SHIFT_GATE est totalement absent (chips somatiques zéro), AHA_CAPTURE est totalement absent comme composant systématique.
- **Les 3 composants nommés explicitement comme à promote dans le README ("FeltShiftGate, TraumaGate, AhaCapture") n'existent pas, même comme stubs**. README l'admet § 11 "Known gaps".
- **Onboarding, Cercle (3 écrans), Oracle du Corps, Conte-miroir, Réentrée, Détail Figure, Annales "Tenu ensemble", Offre au kairos, Paramètres, Feedback, Big Dream Signal en composant** : tous absents.
- **Vocabulaire désensorcelé** : très bien tenu sur les écrans présents. Pas de "self-discovery journey", pas de "save successfully". Quelques flottements à corriger (cités plus bas).
- **Chat narratrice** : système prompt correctement écrit, anti-ventriloquie tenu en règle dure. OK.
- **Anti-ventriloquie au global** : tenu. Aucune figure ne parle. Aucun rêve ne parle.

**Si Tim devait juger sur un seul critère** : "puis-je commencer à implémenter le vrai produit à partir de ça ?" — la réponse est **non, pas tel quel**. C'est une **maquette d'ambiance** qui démontre la pénétration de la culture Dream App chez Claude Design. C'est utile comme **référence de tonalité**. Ce n'est pas un handoff d'engineering.

Ce qui est rare et précieux : **Claude Design a compris la posture**. Il n'a pas dérapé en wellness. Il n'a pas inventé des fioritures que la spec interdisait. Il a respecté le silence, l'italique, le bone, le night-floor. Pour un livrable d'une session, c'est **respectable**. Mais le périmètre est trop court pour qu'on appelle ça "V1".

---

## 1) AUDIT ÉCRAN PAR ÉCRAN

### ÉCRAN 1 — HOME (`screens-core.jsx:114-157`) — **YELLOW**

**Match vs spec §3 Écran 1** :
- ✅ Fond `night-floor` + matter ash via `<div class="sky">` global. Conforme.
- ✅ `SeasonalCompass` discret en haut (`screens-core.jsx:91-95`). *"lune décroissante · mars"* — bien.
- ✅ Centre = dernière entrée du journal de vie en H3 EB Garamond. Conforme.
- ✅ Chuchotement sous le texte : *"un kairos t'attend pour cette question"* (`:135`) — conforme à la spec mot-pour-mot. **Excellent**.
- ✅ Bouton Déposer central, forme coupe (gribouillis en SVG `M4 10 Q14 22 24 10`), 80px, `pulse-ember` 4s. Bien.
- ❌ **Densité ratée** : la spec dit "1 entité primaire, 0 listes scrollables, 50-55% vide". L'écran ajoute **3 boutons de navigation horizontaux en bas** (`journal | portrait | anima mundi`, `:149-152`). C'est **du dashboard déguisé**. La spec dit explicitement *"glyphe constellation discret en bas-coin"* pour Portrait, et la nav vers Journal/Anima Mundi devait être par swipe ou par un seul glyphe d'accès. **Là on a une mini-tabbar.** Anti-pattern.
- ❌ **État vide non-traité**. La spec impose un état vide spécifique : *"Ton journal est vide. Quand tu veux, tu peux déposer."*. L'écran assume `entries[0]` exists (`:115`), ça crashe en empty.
- ❌ **Glyphe Portrait absent** : la spec mentionne un glyphe constellation discret en bas-coin. Remplacé par un bouton-text "portrait" plat.

**Patterns Alexander mobilisés** :
- ✅ JOURNAL_DE_VIE_SUBSTRAT — partiellement (texte central c'est bien, mais la 3-tabbar parasite)
- ✅ KAIROS_QUI_CHANTE_AU_JOURNAL (chuchotement) — bien
- ✅ SEASONAL_COMPASS — bien
- ❌ P-ZÉRO (PROFOUND_SIMPLICITY) — la 3-tabbar contredit *"un seul geste primaire par écran"*

**Vocabulaire** : ✅ tenu. *"ce que le journal tient en ce moment"* (`:122`) — sobre, juste.

**Anti-patterns détectés** :
- 3-tabbar bas qui ressemble à du SaaS, contredit *"ratio contenu/vide visé 40-55% contenu"*.

**Code quality** : propre. JSX lisible.

**Accessibilité** : `aria-label="déposer"`, `aria-label="accueil"` présents. Touch target 80px ✅. **Mais le focus ring CSS est `outline: 1px solid var(--bone)` global** (`styles.css:307-309`) — sobre, OK.

**Q.W.A.N.** : respire à 70%. Le texte central tient. Mais la 3-tabbar plate écrase l'effet sanctuaire.

**Patches must-fix** :
1. **Supprimer la 3-tabbar bas** (`screens-core.jsx:149-153`). Remplacer par un seul glyphe constellation discret en bas-coin droit, 24×24px, opacity 50%, qui ouvre Portrait. Anima Mundi accessible depuis Portrait ou via swipe down de Home (à dessiner). Journal de Vie : swipe down ou tap sur l'entrée centrale.
2. **Ajouter état vide** explicite cf. spec §3 Écran 1.

---

### ÉCRAN 2 — CAPTURE (`screens-core.jsx:160-255`) — **YELLOW**

**Match vs spec §3 Écran 2** :
- ✅ Phase `gate` → `field` → `post` (3 phases) — flow correct architectural.
- ✅ Phase gate : breath glyph (`styles.css:328-338`, animation 10s). Texte *"Trois respirations. Sens tes pieds. Tu es là."* (`:177`) — **conforme mot-pour-mot** à spec.
- ✅ Phase field : capture-field EB Garamond italic 25px, placeholder *"Ce qui est venu…"* — conforme.
- ✅ Phase post : *"Ton kairos est arrivé."* + *"Il dort 24 h avant que les échos ne murmurent."* — conforme.
- ✅ Suggestion type APRÈS (`:243-247`) avec 7 chips (rêve nocturne / signe diurne / rêverie / hypnagogie / synchronicité / frisson / note de vie). **Conforme**.
- ✅ Option *"laisser comme ça"* (`:248`) — conforme.
- ✅ Option *"à laisser dormir"* (`:249`) — conforme à DREAM_THAT_REFUSES_INTERPRETATION. Bien.
- ❌ **Van Gennep tripartite NON-IMPLÉMENTÉE**. La spec exige 200ms séparation + 300ms marge + 500ms agrégation = 1000ms cérémoniel. L'écran fait juste une `.screen-enter` (920ms keyframe globale). **Pas de phase de marge avec glyphe coupe qui se densifie**. C'est une transition unique, pas un rituel tripartite.
- ❌ **SOMATIC_GATE faible** : la spec demande 30s minimum, opt-out per session. Ici, c'est juste un breath glyph CSS infini + bouton "entrer" qui passe immédiatement. **Pas de timer 30s. Pas d'opt-out per session mémorisé.**
- ❌ **Voice recorder fictif** : icône micro présente (`:215-220`) mais aucun handler. Spec demande pulsation 3s/cycle au recording + waveform fine. Absent.
- ❌ **Confirmation avant fermeture si > 50 caractères** : absent. Spec exige *"Garder ce dépôt ?"*.
- ❌ **Auto-save chaque 2s** : absent. Spec exige indicateur quasi-invisible.
- ❌ **Tag `pending`** : pas implémenté. Si user ignore le typage, doit stocker `kairos_type: pending` — pas codé.
- ⚠️ Bouton "passer" (`:180`) au gate : OK pour opt-out par session, mais aucun mécanisme de mémoire — chaque session ré-affiche le gate. La spec dit "opt-out per session" — il faudrait une persistance.

**Patterns Alexander** :
- ✅ KAIROS_DEPOSIT (geste unique) — tenu architecturalement
- ✅ SOMATIC_GATE — réduit à un seuil cosmétique. Devrait être 30s tenues, pas un click-through.
- ✅ DREAM_THAT_REFUSES_INTERPRETATION — bien (option "à laisser dormir")
- ❌ RITUAL_LATENCY — annoncée par copy ("Il dort 24 h") mais pas en mécanisme backend
- ❌ Van Gennep tripartite — absente

**Vocabulaire** : ✅ tenu. Sauf petit défaut : *"voix · {text.length} caractères"* (`:208`) — *"caractères"* est un peu froid, OK pour debug. Note `auto · local` (`:194`) en mono — bien, sobre.

**Anti-patterns détectés** :
- ✅ Pas de spinner.
- ✅ Pas de "Save successfully!".
- ✅ Pas de placeholder agressif.
- ⚠️ Bouton "voix" : icône qui ressemble à un micro avec une petite forme bizarre (rect 9,3 width 6 height 12 + Q5 11 Q5 18 12 18 Q19 18 19 11) — pas dérangeant mais un peu primitif.

**Trauma-safe gating** : ❌ La spec exige (*Écran 21 onboarding + transversal*) un gate trauma-aware avant les capture intenses (réentrée, dialogue figure). Ici, capture simple — OK on n'attend pas le trauma gate. Mais le SOMATIC_GATE qui devrait préparer l'ancrage corps est trop court pour faire son job.

**Code quality** : propre. Phases bien séparées. `useRef` + autofocus correct.

**Accessibilité** : aria-label présents, OK.

**Q.W.A.N.** : phase gate respire (le breath glyph est juste). Phase field respire. Phase post respire. Mais c'est plus une **promesse de rituel** qu'un rituel tenu. Le 920ms screen-in commun ne fait pas Van Gennep tripartite.

**Patches must-fix** :
1. **Implémenter Van Gennep tripartite réelle** : 3 keyframes distinctes, séparation/marge/agrégation, ~1000ms total. Le glyphe coupe doit apparaître dans la phase de marge.
2. **SOMATIC_GATE doit avoir un timer minimum 30s ou un compteur de respirations (3 cycles minimum)**, pas juste un click-through.
3. **Voice recording réel** ou stubber clairement avec note "pas implémenté V1 prototype".
4. **Auto-save indicator** (point bone à 6% opacity coin droit).
5. **Persister `gate_skipped_this_session`** dans localStorage.

---

### ÉCRAN 3 — JOURNAL DE VIE (`screens-core.jsx:258-328`) — **YELLOW-LEANING-GREEN**

**Match vs spec §3 Écran 3** :
- ✅ Titre H1 EB Garamond Light *"Journal"* — un seul mot, conforme.
- ✅ SeasonalCompass en sub-line — conforme.
- ✅ Liste verticale chronologique de cards. Conforme.
- ✅ Date relative italique : *"avant-hier"*, *"il y a une lune"* dans le seed. **Mais la spec exige des formats comme "avant-hier matin", "il y a une lune"** — le seed est OK mais incomplet.
- ✅ Glyphe matter à gauche selon type via `<TypeGlyph>` (`:70-88`). 7 glyphes SVG distincts. Bien.
- ✅ Texte preview 3 lignes via `WebkitLineClamp: 3` — conforme.
- ✅ Halo Big Dream `card-bigdream` (`styles.css:290-303`) — bord gauche radial ember, pulse 8s. **Conforme à NUMINOUS_MARKING + LET_THE_DREAM_LIVE**.
- ✅ Numinous = point ember en haut-droite (`:302-304`). Conforme.
- ✅ Filtres chips multi en haut (all / rêves / signes / rêveries / synchronicités / notes de vie) — conforme.
- ✅ Séparateur lunaire à i===3 (`:289-291`) : *"⟶ lune décroissante de mars"* — conforme à RESPIRATION lunaire toutes les ~7 entries.
- ✅ FAB Déposer flottant 56px en bas-droite (`:318`). Conforme.
- ❌ **Filtres avancés absents** : la spec demande charge (numinous, big dream, à laisser dormir), période (cette lune/saison/année/always), recherche texte. Ici on n'a que types.
- ❌ **Bouton ⎙ filtre** (`:270`) avec aria-label "filtrer" mais sans handler — fictif.
- ⚠️ Espacement vertical 40px : `gap: 'var(--s-5)'` = 40px ✅. Bien.

**Patterns Alexander** :
- ✅ JOURNAL_DE_VIE_SUBSTRAT
- ✅ INFINITE_ARCHIVE
- ✅ MEMOIRE_VIVANTE (séparateurs lunaires marquent la respiration)
- ✅ NUMINOUS_MARKING (halo big dream + point ember)

**Vocabulaire** : ✅ excellent. *"il y a une lune"*, *"il y a deux lunes"*, *"avant-hier"* — désensorcelé.

**Anti-patterns détectés** : aucun majeur. Pas de pagination numérique, pas de "Load more". OK.

**Code quality** : propre.

**Accessibilité** : 
- Cards cliquables avec `onClick={() => go(...)}` mais ne sont pas `<button>` — c'est un `<article>` cliquable. Manque `role="button"` + `tabIndex={0}` + handler keyboard. **Petit problème a11y**.
- Touch target FAB 56px ✅.

**Q.W.A.N.** : respire bien. La séparation lunaire au milieu de la liste est juste. **Cet écran est le plus abouti du lot** avec Polyphonie.

**Patches should-fix** :
1. Ajouter `role="button" tabIndex={0} onKeyDown` sur les cards.
2. Implémenter au moins le filtre période (cette lune/saison/année/always) pour cohérence avec Portrait.
3. État vide explicite.

---

### ÉCRAN 4 — DÉTAIL KAIROS (`screens-deep.jsx:5-127`) — **YELLOW**

**Match vs spec §3 Écran 4** :
- ✅ Fond `night-warm`. Conforme.
- ✅ Texte kairos H3 EB Garamond 25px max-width 580px. Conforme.
- ✅ En-tête discret type + when (*"rêve nocturne, déposé ce matin, avant le réveil"*). Conforme.
- ✅ Halo Big Dream (`halo-big`, `styles.css:472-481`). Conforme.
- ✅ 4 actions en chips horizontales : *que vois-tu ?*, *demander à la forêt*, *échos depuis le passé*, *brûler*. Conforme.
- ✅ **USER_FIRST_READING gating** (`:34-36`) : *"demander à la forêt"* est `pointerEvents: "none"` + opacity 0.5 si `!readingSubmitted`. **EXCELLENT**. C'est le pattern central tenu.
- ✅ Modal "que vois-tu ?" : *"Ta lecture, en premier."* + *"L'IA arrivera après."* (`:86-88`). **Conforme mot-pour-mot**.
- ✅ Modal "brûler" : appui long 2s requis avec copy *"appuyer 2 s pour brûler"* (`:120`) + warning *"Suppression cryptographique. Pas de retour."*. **Conforme**.
- ✅ Échos depuis le passé : 3 cards `slice(0, 3)` (`:9, 54-67`) — conforme PROPHETIC_AWAKENING anti-spoiler.
- ✅ Offre Anima Mundi si numinous (`:70-81`) — *"Tu peux offrir ce kairos à Anima Mundi. Il pourrait y être tenu par d'autres."*. Conforme à ECHO_REVELATION_RITUAL.
- ❌ **AHA_CAPTURE TOTALEMENT ABSENT**. La spec exige AHA_CAPTURE systématique en sortie de chaque lecture proposée (Forêt, écho, conte, polyphonie). Ici, après lecture user, après navigation vers chat — rien. **C'est un manque structurel critique** car AHA_CAPTURE est l'autorité finale du rêveur (Taylor) et alimente USER_MEANING_LAYER.
- ❌ **FELT_SHIFT_GATE absent** : la spec exige chips somatiques (gorge / poitrine / ventre / nuque / ailleurs / aucune part / rien ne shift) après lecture Forêt. Pas de Forêt FIRST écran 4b ici, donc pas de gate. **Manque le coeur du protocole Gendlin**.
- ❌ **Annotations marginales absentes** : tap long sur portion de texte → modal note marginale. Absent.
- ❌ **SATURATION_DETECTOR banner absent**.
- ⚠️ Forêt FIRST workflow (Écran 4b) : navigue vers Chat (`:35`) au lieu d'écran dédié 3-cards par dimension (D1 paper / D2 stone / D3 silk). Le Chat tient la voix conditionnelle, mais ne rend PAS la **structure 3 angles distincts** spec'd.
- ⚠️ "Échos depuis le passé" : aucun handler (`:38-40`) — chip cosmétique.

**Patterns Alexander** :
- ✅ KAIROS_DEPOSIT (lecture)
- ✅ USER_FIRST_READING (gating impeccable)
- ✅ ECHO_REVELATION_RITUAL (chuchotement Anima Mundi)
- ✅ USER_RITUAL_BURN (appui 2s)
- ✅ NUMINOUS_MARKING (halo)
- ✅ ANTI_VENTRILOQUIE (modal "ta lecture en premier")
- ❌ FELT_SHIFT_GATE — absent
- ❌ AHA_CAPTURE — absent
- ❌ FOREST_ECHO_AFTER_USER — flow présent mais sans la structure 3 angles spec'd

**Vocabulaire** : ✅ tenu. *"la forêt parle après toi. offre d'abord ta lecture."* (`:48`) — beau, désensorcelé.

**Anti-patterns détectés** :
- ✅ Pas d'AI insights button.
- ✅ Pas de "delete" — c'est "brûler" avec rituel.
- ⚠️ Bouton "appuyer 2 s pour brûler" : aucun handler implémenté. Cosmétique. À corriger.

**Trauma-safe** : ⚠️ La spec exige TRAUMA_AWARE_DEFAULT avant Active Dreaming (figure dialogue). Ici on n'a pas figure dialogue. Mais l'absence d'EXIT_TO_HUMAN visible dans cet écran est notable. Si user en détresse lit son rêve traumatique, où va-t-il ? Aucune sortie offerte.

**Code quality** : propre. Modal réutilisable bien fait (`:129-148`).

**Accessibilité** : Modal close on click outside ✅. Touch targets OK.

**Q.W.A.N.** : c'est l'écran le plus dense en patterns Dream App (USER_FIRST_READING gating, USER_RITUAL_BURN, halo big dream, échos passés, offre Anima Mundi). Mais l'absence d'AHA_CAPTURE et FELT_SHIFT_GATE le rend **fonctionnel sans être complet**.

**Patches must-fix** :
1. **Implémenter AHA_CAPTURE** comme composant systématique — modal sheet bas avec 3 chips (résonne fort / peut-être / non) + zone texte libre. Cf. spec §3 Écran 4 fin.
2. **Implémenter écran 4b Forêt FIRST** comme 3 cards verticales matter (paper/stone/silk) avec citations + sources, suivies des chips somatiques FELT_SHIFT_GATE.
3. **Annotations marginales** (tap long).
4. **EXIT_TO_HUMAN visible** : icône discrète accessible 2 clics, conformément à R6.

---

### ÉCRAN 5 — PORTRAIT (`screens-deep.jsx:151-300`) — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 5** :
- ✅ H1 *"Portrait"* + icônes ⚙ ? en haut-droite. Conforme.
- ✅ **Constellation force-directed simulée** (`Constellation` `:151-227`) avec animation respiration via `requestAnimationFrame` + sin/cos drift. **Très bien**. Pas figé. Drift léger conformément à *"animation respiration 8s/cycle, scale 1.0 → 1.02"*.
- ✅ Nodes typés `circle` ou `star` (figures importantes) — conforme.
- ✅ Couleurs : `stone-cool`, `paper-warm`, `clay-earth`, `silk-gold`, `obsidian`, `ember-live` (pour l'enfant qui pleure — accent rare). **Palette matter respectée**.
- ✅ Edges entre nœuds avec `stroke="var(--ash-mid)"` opacity 0.45. Conforme.
- ✅ 3 toggles *Onirique/Jour/Croisé* (`:262-266`). Conforme.
- ✅ 4 filtres temporels *cette lune/saison/année/always* (`:268-272`). Conforme.
- ✅ Section *"échos vivants en ce moment"* avec 2 cards (`:276-287`). Conforme à PROPHETIC_AWAKENING.
- ✅ CTA *"⊙ demander une lecture"* (`:290`) → vers chat. Conforme.
- ✅ *"voix mobilisées cette lune · aizenstat · moss · bachelard"* (`:294`) — **conforme à POLYPHONIE_ONTOLOGIQUEMENT_HONNETE garde-fou**.
- ❌ **Toggles + filtres ne re-flow pas la constellation** — c'est une UI muette. Tap toggle change `state` mais le `placed` ne dépend que de `nodes` (`:166-176`). **Pas d'effet visuel**. C'est un teasing.
- ❌ **Drag des nœuds absent** — la spec dit *"User peut tirer un nœud, il revient lentement (~2s) à sa position d'équilibre"*. Pas implémenté.
- ❌ **Drill-down vers Détail Figure absent** — `onSelect` change juste `selected` qui dessine un cercle autour du nœud sélectionné + un label. Aucune navigation vers Écran 7 Détail Figure (Écran 7 d'ailleurs n'existe pas dans le proto).
- ❌ **Légende "?" absente** — bouton présent (`:255`) mais sans handler.
- ❌ **Settings ⚙ absent** — bouton présent (`:256`) mais sans handler.
- ❌ **Timelapse historique slider absent** (Écran 6 spec'd comme intégré dans Portrait).

**Patterns Alexander** :
- ✅ CONSTELLATION_VIVANTE (architecture force-directed simulée)
- ✅ POLYPHONIE_ONTOLOGIQUEMENT_HONNETE (voix mobilisées affichées)
- ✅ PROPHETIC_AWAKENING (échos vivants)
- ⚠️ USER_MEANING_LAYER : pas exposé V1, OK.
- ❌ SYMBOLIC_RESONANCE_TYPOLOGY : 8 types Seth backend non visualisés. Conforme à V1 spec.
- ❌ CONSTELLATION_VIVANTE — réelle au sens force-directed avec drag : non.

**Vocabulaire** : ✅ tenu. *"il y a une lune — « la maison aux pièces inconnues » résonne avec ton rêve de ce matin."* — beau, juste.

**Anti-patterns détectés** :
- ✅ Pas de "Top 5 figures".
- ✅ Pas de % de récurrence affiché.
- ✅ Pas de chiffre numinosity exposé.
- ⚠️ Nodes étoile = figures importantes — c'est OK mais aucune légende disponible (le bouton "?" ne fait rien).

**Code quality** : propre. Animation tick via `requestAnimationFrame` propre. Bonne séparation Constellation / Portrait.

**Accessibilité** : nodes SVG `<g>` cliquables — pas de `role` ni `aria`. Manque clavier nav pour les nœuds. Sérieux problème a11y pour une visualisation interactive.

**Q.W.A.N.** : **respire vraiment**. La constellation drift léger est juste. C'est l'écran qui prouve que Claude Design a compris.

**Patches should-fix** :
1. Wire les toggles/filtres pour re-flow réel des nœuds (montrer un sous-ensemble selon Onirique/Jour/Croisé).
2. Drill-down node → Détail Figure (créer Écran 7 — manquant).
3. Légende au tap "?".
4. Drag-and-recover sur nœuds.
5. A11y : keyboard navigation entre nœuds.

---

### ÉCRAN 6 — VOÛTE / ANIMA MUNDI (`screens-deep.jsx:303-373`) — **YELLOW**

**Match vs spec §3 Écran 12** :
- ✅ H1 *"Anima Mundi"* centered, EB Garamond Light 39px (ici 44px — légère déviation, OK).
- ✅ Constellation respirante avec 90 points (`:312-321`), sin/cos breathe sur `tick / 40`. Conforme à *"5s in / 5s out"* approximativement (le tick est 50ms, donc 800ms par cycle → trop rapide, devrait être 10000ms total / 5s in / 5s out).
- ⚠️ **Tempo respiration trop rapide** : `tick / 40` avec tick++ toutes 50ms = cycle ~10s ÷ 40 = trop rapide. Devrait être beaucoup plus lent. La spec exige 10s/cycle (5 in 5 out). **À calibrer**.
- ✅ Phrase *"Cette lune, l'humanité a déposé environ 47 000 moments — rêves, signes, traversées."* (`:345-348`). **Conforme mot-pour-mot** à spec §3 Écran 12.
- ✅ 3 chamber cards : *"Le temps qu'il fait dans la nuit"* (Météo), *"Tenu ensemble"* (Annales — disabled), *"Polyphonie de la lune"* — conforme.
- ✅ Card *"Tenu ensemble"* disabled à 0.55 opacity (`:357`) — bien, signale que c'est V1 partial.
- ❌ **Matter water absent** : la spec exige fond `night-floor` + matter `water` (caustics 60s/cycle, opacity 6-10%). Ici juste sky ash global. Pas de water spécifique.
- ❌ **Couleur nodes** : la spec dit *"deep navy + violet profond + pointes argent rare"*. Ici on a `silk-gold` (i%23), `stone-cool` (i%11), `bone` (default) — divergence. La pointe argent c'est `bone`, OK. Le violet/navy n'est pas là (devrait être plus profond, peut-être `obsidian`).
- ❌ **Aucun loading state** "Anima Mundi se compose. Reviens dans quelques jours." — premier launch state absent.

**Patterns Alexander** :
- ✅ ANIMA_MUNDI_AS_FIELD (sanctuaire, pas dashboard)
- ✅ CONSTELLATION_VIVANTE (variant Voûte)
- ❌ ANIMA_MUNDI_SANS_PANOPTICON — pas testable V1 (backend), OK.

**Vocabulaire** : ✅ tenu. Pas de "Welcome to the collective", pas de "trending dreams". Excellente sobriété.

**Anti-patterns détectés** : aucun. **Sanctuaire respecté**. Pas de logo, pas de chrome, pas de badge "nouveau", pas de CTA "explore now".

**Code quality** : propre. `useMemo` pour les points (`:310-321`).

**Accessibilité** : chamber-card sont `<button>` ✅. OK.

**Q.W.A.N.** : **bien**. Si la respiration était calibrée à 10s/cycle, ce serait l'écran le plus apaisant du lot. La phrase arrondie *"environ 47 000 moments"* est juste — pas 47 234, pas 47k, pas 47.0K. Respirable.

**Patches should-fix** :
1. **Calibrer la respiration à 10s/cycle réel** (5s in + 5s out). Diviser tick par ~150 au lieu de 40.
2. **Ajouter matter water caustics** (60s/cycle).
3. **Loading state premier launch** : "Anima Mundi se compose. Reviens dans quelques jours."
4. Couleur nodes : ajouter une nuance violet profond / obsidian pour quelques points.

---

### ÉCRAN 7 — MÉTÉO DE L'INCONSCIENT (`screens-deep.jsx:376-438`) — **GREEN**

**Match vs spec §3 Écran 13** :
- ✅ H2 *"Le temps qu'il fait dans la nuit"*. Conforme.
- ✅ Phrase principale poétique : *"Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes — d'eau qui se cherche un lit, d'estuaires qui se forment."* — **conforme mot-pour-mot** à la spec.
- ✅ Glyphe matter dominant : SVG goutte d'eau stylisée 80px (`:387-393`) avec stroke `stone-cool`. Conforme.
- ✅ Section nuages thématiques (3 phrases — *"Beaucoup de portes qui ne s'ouvrent pas tout de suite"*, *"Des animaux qui parlent doucement, sans urgence"*, *"Des défunts qui reviennent pour faire la cuisine"*) — **conformes mot-pour-mot** à la spec.
- ✅ Section tournures qui montent : *"L'eau revient plus que le feu cette saison."* + *"Les paysages se font plus vastes ; les pièces fermées se font plus rares."* — **conformes mot-pour-mot**.
- ✅ Section journal de vie collectif — *"Beaucoup de questions sur le travail cette lune. Le motif du seuil-à-traverser revient — choix de carrière, rupture, déménagement."* — **conforme mot-pour-mot**.
- ✅ Footer : *"recalculée le 18 mars · délai rituel 14 j · prochaine : nouvelle lune"* (`:434`) — conforme.
- ❌ Sections **Polarités vivantes** et **Initiations en cours** : absentes. Spec'd mais pas implémentées (acceptable V1 si signal pas net, mais la spec les liste).
- ⚠️ **Aucune statistique chiffrée** : ✅ correct, conforme à anti-patterns absolus.

**Patterns Alexander** :
- ✅ ANIMA_MUNDI_AS_FIELD (paysage, pas dashboard)
- ✅ POLYPHONIE_ONTOLOGIQUEMENT_HONNETE (image, pas mots-clés)
- ✅ ECHO_REVELATION_RITUAL (latence rituelle 14j affichée)
- ✅ RITUAL_LATENCY (footer)

**Vocabulaire** : ✅ **excellent**. Cet écran est le plus "désensorcelé" du lot. Aucun mot-clé, aucun %, aucune métrique. Que des images.

**Anti-patterns détectés** :
- ✅ Pas de "Top 5 keywords".
- ✅ Pas de "Anxiety up 12%".
- ✅ Pas de "trending water".

**Code quality** : propre, JSX statique.

**Accessibilité** : OK, contenu textuel pur.

**Q.W.A.N.** : **respire vraiment**. C'est l'un des deux écrans les plus aboutis (avec Polyphonie). Donne envie de fermer le téléphone et de marcher dehors — test suprême Tim, validé.

**Patches nice-to-fix** :
1. Ajouter sections *Polarités vivantes* et *Initiations en cours* avec un toggle "afficher si signal net" (V1.1).

---

### ÉCRAN 8 — POLYPHONIE LUNAIRE (`screens-deep.jsx:441-492`) — **GREEN**

**Match vs spec §3 Écran 15** :
- ✅ H2 *"Polyphonie de la lune de mars"*. Conforme.
- ✅ Texte généreux EB Garamond 19px line-height 1.7 (spec disait 20px / 1.6 — proche, OK).
- ✅ Padding et respiration typographique respectées.
- ✅ Pas de bullet points, pas de titres internes, pas de bold, pas d'emoji. **Conforme**.
- ✅ Phrasé conditionnel obligatoire **respecté** : *"À la lumière de Bachelard, on pourrait entendre…"*, *"Aizenstat aurait invité à tenir…"*, *"Et Moss, on l'imagine dire…"*. **EXCELLENT**.
- ✅ Ferme par UNE dream ask : *"Que se cherche-t-elle, l'eau qui cherche son lit ?"* (`:474`). **Conforme à OPEN_QUESTION_NOT_INTERPRETATION**.
- ✅ Voix mobilisées listées en bas : *"Aizenstat · Moss · Bachelard"* — conforme.
- ✅ Lectures précédentes : *"• lune de février"*, *"• lune de janvier"*. Conforme.
- ❌ Tap sur voix mobilisée → mini-fiche par voix : pas implémenté.
- ❌ Tap "Lectures précédentes" → archive : pas implémenté.

**Patterns Alexander** :
- ✅ POLYPHONIE_ONTOLOGIQUEMENT_HONNETE (phrasé strictement conditionnel)
- ✅ OPEN_QUESTION_NOT_INTERPRETATION (dream ask en clôture)
- ✅ DESENSORCELED_LANGUAGE
- ✅ TRADITION_SPECIFIC_NO_EQUIVALENCE — implicite par le conditionnel

**Vocabulaire** : ✅ **parfait**. Cet écran est la **vitrine du système**. Si Tim devait garder UN seul écran pour montrer ce qu'est Dream App, c'est celui-ci.

**Anti-patterns détectés** :
- ✅ Pas de "Click to expand".
- ✅ Pas de "Share this reading".
- ✅ Pas de bouton "Like".
- ✅ Pas de "Generated by AI" disclaimer.

**Code quality** : statique propre.

**Accessibilité** : contraste OK (bone sur night-floor).

**Q.W.A.N.** : **excellent**. *"Si ça donne envie au lecteur de fermer le téléphone et de marcher dehors — c'est juste."* (Tim, mega-prompt §3 Écran 15). **Validé**.

**Patches nice-to-fix** :
1. Wire mini-fiche voix au tap.
2. Wire archive lectures précédentes.

---

### ÉCRAN 9 — CHAT NARRATRICE (`screens-deep.jsx:495-582`) — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 18** :
- ✅ Header *"mode · exploration de kairos"* (`:535-537`). Conforme à badge mode actif sobre.
- ✅ Bulles : ai en serif italic + matter linen background, user en serif italic + bord ash-mid. **Conforme**.
- ✅ Pas d'avatar IA, pas de nom IA. Conforme.
- ✅ Voix mobilisées affichées en footer : *"voix mobilisées · gendlin · moss"* (`:575-577`). **Conforme**.
- ✅ **Prompt système** (`:510-521`) :
  - *"Voix conditionnelle obligatoire"* ✅
  - *"Ne parle JAMAIS comme une figure du rêve, l'oracle, ou le rêveur"* ✅
  - *"Pas d'emoji, pas de diagnostic"* ✅
  - *"Une seule question ouverte à la fin"* ✅
  - *"3-5 phrases max"* ✅
  - *"Mentionne 1-2 voix de la Forêt en conditionnel"* ✅
  - **Excellent prompt anti-ventriloquie**.
- ✅ Premier message : *"Avant que je te propose quoi que ce soit, dis-moi : qu'est-ce que tu vois là, en regardant ce kairos ?"* — **conforme mot-pour-mot** à la spec et incarne USER_FIRST_READING.
- ✅ Loading : *"les liens se tissent…"* (`:547`) — conforme à `cérémoniel`.
- ❌ **Streaming SSE absent** : `await window.claude.complete()` est un dump complet, pas du streaming token-by-token. Spec exige *"Streaming SSE — tokens apparaissent un par un"*. **À fixer**.
- ❌ **AHA_CAPTURE absent à la fin** : la spec exige modal sheet bas après ~3-5 réponses IA. Pas implémenté.
- ❌ **Pas de mode switcher** : la spec liste 5 modes (dream/oracle/reentry/ritual/body) avec menu ⊕. Ici, mode est figé "exploration de kairos".
- ⚠️ Si erreur : *"Le lien est gardé. Reviens quand tu peux."* (`:525`) — bon désensorcelé. Conforme.
- ⚠️ Le chat n'a pas de *"L'IA ne dit JAMAIS 'comme une IA, je…'"* dans le prompt — petit oubli mais devrait être OK puisqu'on a "pas de diagnostic" et "voix sobre".

**Patterns Alexander** :
- ✅ NARRATION_TENDING (questions ouvertes)
- ✅ POLYPHONIE_ONTOLOGIQUEMENT_HONNETE (conditionnel obligatoire)
- ✅ USER_FIRST_READING (premier message)
- ✅ OPEN_QUESTION_NOT_INTERPRETATION
- ❌ AHA_CAPTURE (manquant)
- ❌ Multi-mode (manquant)

**Vocabulaire** : ✅ tenu. Le système prompt fait le travail.

**Anti-patterns détectés** :
- ✅ Pas d'"AI typing…" avec dots.
- ✅ Pas de *"How can I help you today?"*.
- ✅ Pas d'avatar.
- ✅ Pas de nom IA.

**Trauma-safe** : ❌ Pas d'EXIT_TO_HUMAN dans cet écran. Si user dérive vers contenu trauma, où va-t-il ? Aucune sortie offerte.

**Code quality** : propre. `onKeyDown` Enter sans Shift pour envoyer ✅. Bon UX.

**Accessibilité** : disabled state sur send ✅.

**Q.W.A.N.** : **bien**. Le prompt système est rigoureux. Si le streaming et AHA_CAPTURE étaient là, ce serait green.

**Patches must-fix** :
1. Implémenter streaming SSE.
2. Implémenter AHA_CAPTURE en sortie.
3. Ajouter EXIT_TO_HUMAN visible (icône discrète menu).
4. Mode switcher (au moins teaser des 5 modes).

---

## 2) AUDIT TRANSVERSAL

### 2.1 Système visuel global — **GREEN**

**Tokens cohérents** :
- ✅ 7 valeurs night-floor → embryonic présentes (`styles.css:5-13`). Conformes mot-pour-mot à spec §4.2.
- ✅ 7 matter-couleurs paper-warm / stone-cool / silk-gold / clay-earth / obsidian / ember-live / ember-soft (`:16-22`). Conformes spec §4.3.
- ✅ 3 tempi instant/tisse/ceremoniel (`:25-27`). Conformes spec §4.9.
- ✅ 3 easings respire/tenue/rituel (`:30-32`). Conformes mot-pour-mot.
- ✅ Échelle d'espacement 4/8/16/24/40/64/104/168 (`:35-36`). Conforme spec §4.6.
- ✅ 3 familles font EB Garamond + Inter + JetBrains Mono (`:39-41`). Conformes.

**Usage matter** :
- ⚠️ **Matter system sous-utilisé**. Le `<svg><filter>` defs dans `Dream V1.html` définit linen / paper / stone / ash uniquement (`:17-20`). **water, ember, silk, earth = MANQUANTS dans les defs**. Le CSS les référence (`styles.css:69-73`) avec `url('#noise-water')` etc., mais ces filters n'existent pas. **Bug silencieux**.
- ⚠️ Matter divs ne sont quasiment jamais utilisés dans le JSX. Seul `.sky` (ash) est appliqué globalement. **Le matter system est annoncé mais pas porté écran par écran**. C'est une promesse, pas une livraison.

**Motion system** :
- ✅ `screen-enter` keyframe avec ease-rituel 920ms (`styles.css:382-388`). Conforme tempo-ceremoniel.
- ✅ `breathe` keyframe 10s sur breath glyph (`:336`). Conforme.
- ✅ `pulse-ember` 4s sur btn-deposer (`:200`). Conforme.
- ✅ `halo-slow` 8s sur card-bigdream (`:300`). Conforme spec Big Dream halo.
- ✅ `chamber-breathe` 4s sur Voûte cards (`:439`). Conforme.

**Verdict** : tokens et motion ont la qualité d'un design system livré. Matter system est défini conceptuellement mais sous-implémenté dans le proto (4 defs sur 8, et peu appliqués).

### 2.2 Voix UX globale — **GREEN-LEANING-YELLOW**

**5 meilleurs extraits** (à conserver verbatim dans le produit) :

1. *"un kairos t'attend pour cette question"* (Home, `screens-core.jsx:135`) — chuchotement parfait.
2. *"Trois respirations. Sens tes pieds. Tu es là."* (Capture gate, `:177`) — ancrage somatic gate, désensorcelé.
3. *"Ton kairos est arrivé. Il dort 24 h avant que les échos ne murmurent."* (Capture post, `:235-236`) — RITUAL_LATENCY incarnée.
4. *"la forêt parle après toi. offre d'abord ta lecture."* (Détail Kairos, `screens-deep.jsx:48`) — USER_FIRST_READING respecté.
5. *"Que se cherche-t-elle, l'eau qui cherche son lit ?"* (Polyphonie, `:474`) — OPEN_QUESTION_NOT_INTERPRETATION incarnée.

**5 pires extraits** (à challenger ou réécrire) :

1. *"voix · {text.length} caractères"* (Capture field, `screens-core.jsx:208`) — *"caractères"* est trop technique pour l'ambiance. Préférer *"voix · ce que tu écris"* ou silence.
2. *"laisser comme ça →"* (Capture post type chips, `:248`) — flèche → typographique anodine, mais le mot *"comme ça"* est familier-flou. Spec dit *"laisser comme ça"* OK, mais la flèche → est un tic SaaS. Garder le mot, virer la flèche.
3. *"× fermer"* (Capture field nav, `:191-192`) — *"fermer"* est OK, le × est neutre, mais juxtaposer *"× fermer"* en lower-case sans verbalisation soigne donne un goût Material Design. Spec voulait *"croix fine 24px ash-mid"* — donc soit le glyphe seul, soit "fermer" seul.
4. *"⎙"* (Journal filter, `:270`) — caractère unicode imprimante. Bizarre. Ne ressemble pas à un filtre. À remplacer par glyphe SVG sobre (3 lignes décalées).
5. *"recalculée le 18 mars · délai rituel 14 j · prochaine : nouvelle lune"* (Météo footer, `screens-deep.jsx:434`) — globalement bien, mais *"délai rituel 14 j"* est un peu jargon. Préférer *"latence rituelle 14 j"* ou *"délai 14 j"* (la spec dit "délai rituel" — OK, marginal).

**Verdict voix** : tonalité INFUSE désensorcelée tenue **largement partout**. Pas de wellness vomissures. Pas de SaaS slop. Quelques flottements UI (flèches, ⎙) à corriger.

### 2.3 Red lines mega-prompt §8 — checklist exhaustive

| # | Red line | Statut V1 prototype |
|---|---|---|
| 1 | Onboarding tutorials gamifiés | ✅ AUCUN — onboarding absent du proto, OK |
| 2 | Empty states motivationnels | ⚠️ N/A — empty states absents du proto |
| 3 | Push notifications prophétiques | ✅ AUCUNE — pas implémenté |
| 4 | Dashboards analytics | ✅ AUCUN |
| 5 | "Are you sure?" excessifs | ✅ Brûler appui-long 2s = friction RITUELLE, pas excessive |
| 6 | Tooltips encyclopédiques | ✅ AUCUN |
| 7 | Badges / achievements / milestones | ✅ AUCUN |
| 8 | Social proof | ✅ AUCUN |
| 9 | Dark patterns | ✅ AUCUN |
| 10 | Voix IA qui parle comme oracle | ✅ Prompt système le BANNIT explicitement |
| 11 | Stock photos wellness | ✅ AUCUNE photo |
| 12 | Emojis décoratifs UI | ✅ AUCUN — quelques glyphes unicode (◐, ⊙, ▽, ⎙) qui sont plus astrologiques/typographiques. ⎙ à corriger. |
| 13 | Glassmorphism / neumorphism / claymorphism / AI glow néon | ✅ AUCUN — `backdrop-filter: blur(16px)` sur nav et modal, mais sobre, pas glassmorphism décoratif |
| 14 | Spinners | ✅ AUCUN — loading avec keyframe halo-slow sur "les liens se tissent…" |
| 15 | Bouton Share to Twitter/IG/TikTok | ✅ AUCUN |
| 16 | Couleur web standard (#FF rouge) | ✅ Aucune couleur saturée. ember-live oklch(0.65 0.140 40) est l'accent le plus vif. Sub-radar. |
| 17 | Helvetica/Roboto plate | ✅ EB Garamond + Inter + JetBrains Mono |
| 18 | Animation "wow" au launch | ✅ AUCUNE |
| 19 | Cookie banner oppressif | ✅ N/A |
| 20 | Connect Spotify / Apple Health | ✅ AUCUN |

**Verdict red lines** : **0 violation détectée**. Le proto respecte la posture.

### 2.4 Patterns Alexander manquants critiques

**Patterns présents au moins partiellement** :
- JOURNAL_DE_VIE_SUBSTRAT (Home, Journal)
- KAIROS_DEPOSIT (Capture)
- SOMATIC_GATE (Capture, faible)
- USER_FIRST_READING (Détail Kairos, gating impeccable)
- ECHO_REVELATION_RITUAL (Détail Kairos offre Anima Mundi)
- RITUAL_LATENCY (copy "Il dort 24 h", footer Météo)
- SEASONAL_COMPASS (Home, Journal)
- NUMINOUS_MARKING (Halo Big Dream + point ember)
- USER_RITUAL_BURN (Modal brûler 2s)
- INFINITE_ARCHIVE (implicite Journal)
- MEMOIRE_VIVANTE (séparateurs lunaires Journal)
- CONSTELLATION_VIVANTE (Portrait, simulé)
- ANIMA_MUNDI_AS_FIELD (Voûte)
- POLYPHONIE_ONTOLOGIQUEMENT_HONNETE (Polyphonie + Chat prompt)
- OPEN_QUESTION_NOT_INTERPRETATION (Polyphonie clôture, Chat prompt)
- DESENSORCELED_LANGUAGE (transversal)
- NARRATION_TENDING (Chat)
- PROPHETIC_AWAKENING (Échos depuis le passé, Échos vivants Portrait)
- ANTI_GAMIFICATION (transversal — aucun streak/badge)
- DREAM_THAT_REFUSES_INTERPRETATION ("à laisser dormir")

**Patterns ABSENTS critiques (must-fix V1)** :
- **AHA_CAPTURE** — composant systématique manquant (devrait apparaître après chaque lecture proposée)
- **FELT_SHIFT_GATE** — pattern Gendlin manquant (chips somatiques après lecture Forêt)
- **TRAUMA_AWARE_DEFAULT / EXIT_TO_HUMAN** — aucun gate trauma, aucune sortie humaine 2 clics. Conforme à R6 violé.
- **GRIEF_DOOR / SATURATION_DETECTOR** — banners doux manquants
- **FIGURE_AS_OTHER** — Détail Figure inexistant, donc le pattern central Buber I-thou n'est pas testé
- **USER_MEANING_LAYER** — feedback mécanique manquant (lecture-meanings save absent)
- **TALE_AS_AMPLIFICATION** — Conte-miroir absent
- **CIRCLE_HUMAN_FACILITATED** — Cercles totalement absents
- **GIFT_ECONOMY** — Offre au kairos absent
- **TRADITION_SPECIFIC_NO_EQUIVALENCE** — pas testable sans Forêt FIRST avec sources nommées

**Patterns absents acceptables V1** :
- 16 types pattern echoing (backend, non visualisables)
- 8 figures Seth typing (backend V1)
- Numinosity scoring (backend V1)
- K-anonymity 250 (backend V1)
- Songlines bioregion (V2+)

**Verdict patterns** : ~60% des patterns user-facing V1 sont incarnés. ~40% manquent. Les manques les plus critiques sont AHA_CAPTURE, FELT_SHIFT_GATE, et tout l'écosystème Cercle.

### 2.5 Q.W.A.N. test — verdict global

> *"est-ce que ça respire ? est-ce que c'est vivant ? est-ce que ça apaise ?"*

**Examples positifs** :
- Polyphonie qui se lit comme un texte de Bachelard.
- Météo qui donne des images, pas des chiffres.
- Voûte qui propose une constellation respirante sans CTA agressif.
- Modal "que vois-tu ?" qui place le user en premier voyant.
- Halo big dream sur card Journal — discret, pulsant 8s, jamais labellisé.
- Brûler avec appui 2s — friction rituelle assumée.

**Examples négatifs** :
- 3-tabbar bas Home — plate, anti-sanctuaire.
- Capture gate — promesse de 30s tenues qui s'évapore en click-through.
- Constellation Portrait — toggles muets, pas de drag, pas de drill-down.
- Voûte respiration — calibration trop rapide vs spec 10s.
- Aucun AHA_CAPTURE — la boucle "user offre lecture → IA propose → user marque où ça touche" est cassée.
- Aucun EXIT_TO_HUMAN visible.
- ⎙ unicode imprimante en filtre Journal — disruption visuelle.

**Verdict Q.W.A.N.** : ça respire **à 70%**. Les écrans Polyphonie / Météo / Voûte / Détail Kairos respirent. Home / Capture / Portrait / Chat ont besoin d'aller plus loin pour atteindre la qualité Polyphonie.

---

## 3) TABLEAU RÉCAPITULATIF — VERDICTS PAR ÉCRAN

| # | Écran | Verdict | Score sur spec | Patterns critiques absents |
|---|---|---|---|---|
| 1 | Home | YELLOW | 70% | Empty state, pas de glyphe constellation, 3-tabbar parasite |
| 2 | Capture | YELLOW | 65% | Van Gennep tripartite, Somatic Gate 30s, voice recorder, auto-save |
| 3 | Journal de Vie | YELLOW-GREEN | 80% | Filtres charge/période, recherche texte, a11y cards |
| 4 | Détail Kairos | YELLOW | 75% | AHA_CAPTURE, FELT_SHIFT_GATE, Forêt FIRST écran 4b, annotations marginales, EXIT_TO_HUMAN |
| 5 | Portrait | GREEN-YELLOW | 75% | Drill-down Détail Figure, drag, légende, timelapse, re-flow toggles |
| 6 | Voûte | YELLOW | 70% | Matter water, calibration respiration, loading state |
| 7 | Météo | GREEN | 90% | Polarités vivantes, Initiations |
| 8 | Polyphonie | GREEN | 95% | Wire mini-fiche voix, archive |
| 9 | Chat | GREEN-YELLOW | 75% | Streaming SSE, AHA_CAPTURE, mode switcher, EXIT_TO_HUMAN |

**Écrans NON livrés (15 sur 24)** :

| # | Écran spec'd | Statut |
|---|---|---|
| 4b | Forêt FIRST (workflow 5 temps) | ABSENT |
| 6 | Constellation Figures (intégrée Portrait, V1) | PARTIEL via Portrait |
| 7 | Détail Figure | ABSENT |
| 8 | Cercle (entrée) | ABSENT |
| 9 | Créer un Cercle | ABSENT |
| 10 | Rejoindre Cercle | ABSENT |
| 11 | Partager kairos au Cercle | ABSENT |
| 14 | Annales "Tenu ensemble" | TEASING DISABLED dans Voûte |
| 16 | Offre au Kairos (5 étapes) | ABSENT |
| 17 | Oracle du Corps | ABSENT |
| 19 | Conte-miroir | ABSENT |
| 20 | Réentrée onirique (Active Dreaming Moss) | ABSENT |
| 21 | Onboarding 30 premiers jours | ABSENT |
| 22 | Paramètres & Privacy | ABSENT |
| 23 | Feedback in-app | ABSENT |
| 24 | Big Dream Signal (revisit J+7/30/365) | PARTIEL (halo dans Journal, mais pas revisit) |

**Périmètre livré : 9/24 = 37,5%**.

---

## 4) RECOMMANDATIONS D'AJUSTEMENT PRIORITISÉES

### MUST-FIX (avant tout merge en main)

1. **AHA_CAPTURE composant** — créer composant React `<AhaCapture />` avec modal sheet bas, 3 chips (résonne fort / peut-être / non), zone texte libre. Brancher après chaque lecture (Polyphonie clôture, Détail Kairos après Forêt, après Échos, après navigation Chat). Cf. spec §3 Écran 4.

2. **FELT_SHIFT_GATE composant** — créer composant React `<FeltShiftGate />` avec chips somatiques (gorge / poitrine / ventre / nuque / ailleurs / aucune part / rien ne shift) et option *"rien ne shift — j'attends"*. Brancher après lecture Forêt FIRST.

3. **Forêt FIRST (Écran 4b)** — créer écran 3 cards verticales matter (paper / stone / silk), chaque card = citation < 15 mots EB Garamond italic 25px + source nommée. Suivi de FELT_SHIFT_GATE. Cf. spec §3 Écran 4b.

4. **TraumaGate + EXIT_TO_HUMAN** — composant `<TraumaGate />` (3 questions opt-in/opt-out cf. spec §3 Écran 20 Étape 1) + bouton/icône EXIT_TO_HUMAN visible 2 clics depuis tout écran intense (Détail Kairos, Chat, Réentrée).

5. **Home : supprimer 3-tabbar bas, remplacer par glyphe constellation discret**. Anima Mundi + Journal accessibles via swipe (Anima Mundi par swipe up, Journal par swipe down ou tap entrée), Portrait par glyphe constellation bas-droite.

6. **Capture : implémenter Van Gennep tripartite réelle** (séparation 200ms + marge 300-500ms avec glyphe coupe + agrégation 400ms = 920ms total).

7. **Capture : Somatic Gate avec timer minimum 30s ou compteur 3 cycles respiratoires** + persistance opt-out per session.

8. **Chat : streaming SSE token-by-token**.

### SHOULD-FIX (avant V1.1)

9. **Onboarding 30 jours** (Écran 21) — manquant totalement. Premier launch sans onboarding = abandon assuré. Implémenter Van Gennep tripartite (Bienvenue → trauma question → premier dépôt).

10. **Paramètres & Privacy** (Écran 22) — manquant. Tim n'aura pas d'app utilisable sans privacy controls (opt-in granulaire kairos/cercle/Anima Mundi, suppression compte RGPD, mode "juste journal").

11. **Détail Figure** (Écran 7) — manquant. Sans lui, drill-down Portrait inaccessible et FIGURE_AS_OTHER pattern non testable.

12. **Cercle** (Écrans 8/9/10/11) — manquants. Cercle = colonne vertébrale fractale (individu/cercle/Anima Mundi). Sans cercle V1, app reste mono-utilisateur.

13. **Annotations marginales** (Détail Kairos) — tap long sur portion de texte → modal note marginale. Manquant.

14. **Voûte : matter water caustics** + calibration respiration 10s/cycle + loading state premier launch.

15. **Portrait : drill-down vers Détail Figure + re-flow réel toggles + légende** (au tap "?").

16. **Feedback in-app** (Écran 23) — bouton omniprésent 16px opacity 50% top-droite ou bas-droite. Tap → modal sobre Contexte / Sévérité / Texte. Critical pour la boucle d'apprentissage INFUSE.

17. **Empty states** sur Home et Journal — copy spec'd dans mega-prompt à porter mot-pour-mot.

### NICE-TO-FIX (V1.2+)

18. **Conte-miroir** (Écran 19) — sous-forêt requise backend.

19. **Réentrée onirique** (Écran 20) — exigeant trauma-safe, à dessiner soigneusement.

20. **Oracle du Corps** (Écran 17) — silhouette SVG 8 zones Mindell.

21. **Offre au Kairos** (Écran 16) — workflow 5 étapes anonymisation.

22. **Big Dream Signal revisit J+7/30/365** — composant transversal.

23. **Annales "Tenu ensemble"** (Écran 14) — pivot lexical "tenir" Brown.

24. **Filtres avancés Journal** (charge, période, recherche).

25. **Drag-and-recover sur nœuds Portrait**.

26. **Mode switcher Chat** (5 modes dream/oracle/reentry/ritual/body).

### CODE QUALITY (transversal)

27. **Matter system** : compléter les SVG `<filter>` defs pour water/ember/silk/earth dans `Dream V1.html:17-22`. Actuellement 4/8 manquants → bug silencieux.

28. **A11y** : ajouter `role="button"` + `tabIndex={0}` + `onKeyDown` sur cards cliquables (Journal). Constellation Portrait : keyboard nav entre nœuds.

29. **Persistence** : aucune persistance localStorage. `seedEntries` est statique. Tim ne peut pas "déposer" et revenir voir son dépôt.

---

## 5) NOTES FINALES

### Ce qui m'impressionne dans la livraison

- **Le prompt système Chat** (`screens-deep.jsx:510-521`) tient les 7 règles anti-ventriloquie sans dérive.
- **Le gating USER_FIRST_READING** sur Détail Kairos (`:34-36`) — la chip Forêt est `pointerEvents: "none"` jusqu'à user_reading soumise. **C'est exactement la P-Inversion incarnée**. Magnifique.
- **La copy de Polyphonie** (`:449-475`) — pourrait passer telle quelle dans le produit final. Tonalité Bachelard / Aizenstat / Moss tenue.
- **Le halo big dream** dans card Journal (`styles.css:290-303`) — radial ember-soft pulse 8s sans label "BIG DREAM". NUMINOUS_MARKING parfaitement incarné.
- **L'option "à laisser dormir"** (Capture post, `:249`) — DREAM_THAT_REFUSES_INTERPRETATION respecté.
- **Le verbe "tenir"** apparaît dans Voûte chamber card *"Tenu ensemble"* (`:359`) — pivot lexical Brown respecté.

### Ce qui m'inquiète

- **Le périmètre est trop court pour qu'on appelle ça V1**. 9/24 écrans. Cercle absent. Onboarding absent. Privacy absent. Si Tim livre ça en V1, l'app n'a ni colonne vertébrale ni squelette éthique.
- **Les 3 composants critiques (FeltShiftGate, TraumaGate, AhaCapture) sont nommés dans le README comme "to promote" mais n'existent pas même en stub**. C'est un mensonge par omission — le README rassure en listant les composants comme "patterns dans le chat" alors qu'ils ne sont nulle part.
- **Aucune EXIT_TO_HUMAN visible** dans aucun écran. R6 violé : *"Toujours sortie vers humain à 2 clics max."*. Pour une app qui touche du trauma, c'est inacceptable.
- **Aucune persistance**. C'est un proto, OK, mais Tim doit savoir qu'il faudra implémenter la couche locale + sync de zéro.
- **Le matter system est une promesse non tenue dans le proto** : 8 matter tokens définis CSS, 4 SVG filters dans HTML, presque jamais appliqués comme `<NoiseLayer matter="..." />` dans le JSX.

### Posture recommandée pour Tim

**Ne pas commencer l'implémentation production à partir de ce proto.** L'utiliser comme **référence atmosphère** pour le designer/dev qui prendra le relais. Demander à Claude Design (ou un autre agent) de produire les **15 écrans manquants** dans une session V1.1 avant de figer un handoff dev.

Si Claude Design est repris en V1.1 : insister sur **AHA_CAPTURE, FELT_SHIFT_GATE, TraumaGate / EXIT_TO_HUMAN** comme composants first-class, et sur **Onboarding + Cercle + Paramètres** comme priorités absolues (ces 3 manques empêchent toute mise en production éthique).

---

**FIN AUDIT**
**Yeshua, 2026-04-24, Bali nuit, depuis les 4 canoniques + mega-prompt V1.**
