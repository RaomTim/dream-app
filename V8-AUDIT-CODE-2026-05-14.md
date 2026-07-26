# V8 Audit Code Exhaustif — 2026-05-14

**Fichiers audités** : `public/v8/index.html` (13 377 lignes) + `public/v8/dream-api-bridge.js` (831 lignes).

**Cause racine n°1** : le bridge clone `#chat-input` et `#orbe` à T+500ms après DOMContentLoaded pour neutraliser les anciens listeners V5 et brancher les vrais appels API. Mais ce clone détruit AUSSI tous les listeners attachés par les scripts `sprint`, `extension`, `v6-patches` qui se sont exécutés avant. Conséquence : 4 features importantes (auto-honor, body-keywords → oracle, lucid auto-detect, crisis-safe sprint) ne déclenchent plus jamais.

**Cause racine n°2** : `attachSwipeNav` exige que le touchstart démarre dans 10% du bord opposé (`SWIPE_EDGE_RATIO = 0.10`). Pour swiper à gauche, il faut commencer le doigt dans les 10% du bord droit, etc. Aucune indication visuelle, aucun feedback. C'est ce que Tim ressent comme "swipes mobile cassés".

**Cause racine n°3** : multiples handlers redondants ou contradictoires sur les mêmes éléments (radial buttons interceptés par 3 scripts différents, kd-sec-head qui à la fois collapse ET fetch).

## Résumé exécutif
- **15 P0** (bloquants UX critique)
- **13 P1** (UX dégradée mais utilisable)
- **9 P2** (cosmétique / amélioration)

**Estimation totale** : 8-12 heures-agent (1 swarm parallèle 5-6 zones).

**Fixes triviaux APPLIQUÉS pendant l'audit** (inline, non-destructifs) :
- P0-9 : `#v6-felt-demo` ligne 11872 → `style="display:none;"` ajouté.
- P0-10 : auto-show `bdpush-floating` ligne 11066 → commenté (bouton reste callable via console).
- P2-1 : `$('#cercle-titre')` ligne 6750 → remplacé par `$('.feu-titre')`.

---

## P0 — Bloquants

### P0-1 : Swipes mobile inutilisables (cause "swipes cassés" rapportée par Tim)
- **Où** : `index.html:6394` (`SWIPE_EDGE_RATIO = 0.10`) + `attachSwipeNav` lignes 6415-6456.
- **Quoi** : Pour déclencher un swipe gauche → ouvrir threads, le doigt DOIT démarrer dans les 10% du bord droit du viewport (~38px sur un iPhone). Idem pour les 3 autres directions. Aucun utilisateur ne fait ça spontanément.
- **Reproduction** : ouvrir l'app sur mobile, swiper de la moitié de l'écran vers la gauche → rien ne se passe. Swiper à 5px du bord droit vers la gauche → ouvre Threads.
- **Cause** : `edgeAllow.left = sx >= (W - edgeX)` exige que `sx` soit dans le bord droit (W - 10%).
- **Fix** : soit relâcher `SWIPE_EDGE_RATIO` à `1.0` (n'importe où), soit (mieux) supprimer entièrement la contrainte `edgeAllow` mais ajouter une garde "ne pas déclencher si target est un input/scrollable" (déjà présente via `_swipeStartedOnInput`). Code minimal :
```js
// Remplacer l'objet edgeAllow par true partout
const edgeAllow = { down: true, up: true, right: true, left: true };
// puis supprimer les conditions edgeAllow.X dans touchend
if (dx < 0 && handlers.left) { debouncedSwipe(handlers.left); ... }
```
- **Zone fixer** : navigation

### P0-2 : 4 listeners chat-input morts après clone bridge
- **Où** : `dream-api-bridge.js:391-394` clone `#chat-input` ; les listeners attachés AVANT par sprint/extension/V5 sont perdus :
  - `index.html:7778` `maybeProposeHonoring` (auto-suggest honor sur "rêve")
  - `index.html:9217` crisis-safe `detectCrisis` du sprint (pattern list complète)
  - `index.html:9724` body keywords → suggest oracle du corps
  - `index.html:9854` lucid markers auto-detect
- **Quoi** : ces 4 features ne déclenchent jamais. La crisis safety du sprint est remplacée par celle (moins riche) du bridge ligne 197-207.
- **Reproduction** : taper "j'ai mal au ventre" → le chat ne propose JAMAIS l'oracle du corps. Taper "j'étais lucide dans le rêve" → pas d'auto-marker. Taper "j'ai rêvé du loup" → pas de bouton honoring.
- **Cause** : `oldInput.parentNode.replaceChild(newInput, oldInput)` retire tous les listeners. Le V8 wiring patch (ligne 13312) fonctionne car il s'attache APRÈS le clone (T+1500ms via whenReady).
- **Fix** : déplacer toutes les fonctionnalités dépendantes dans `wireAppHooks` du bridge OU au lieu de cloner, utiliser `addEventListener('keydown', handler, true)` capture-phase pour intercepter avant V5. Solution minimale : exposer la fonction de re-wiring sur `window.__rewireChatInputListeners` et l'appeler depuis le bridge après le clone, qui fait alors `setTimeout(window.__rewireChatInputListeners, 100)`.
- **Zone fixer** : voice + chat persona + crisis-safe

### P0-3 : Crisis-safe sprint dégradé en faveur de bridge moins complet
- **Où** : sprint `index.html:9173-9187` patterns vs bridge `dream-api-bridge.js:197-202`.
- **Quoi** : sprint avait 13 patterns crisis (incl. "envie de disparaître", "personne ne me comprend", "je suis seul au monde"). Bridge n'en a que 4. Le listener sprint étant tué (P0-2), des phrases à risque ne déclenchent plus le sanctuaire.
- **Reproduction** : taper "personne ne me comprend, je suis seul au monde" → bridge ne détecte rien, message envoyé à Anima normale.
- **Fix** : copier les patterns sprint dans le bridge (`CRISIS_PATTERNS` à enrichir), ou faire pointer `window.checkCrisisLocal` vers `detectCrisis` du sprint si disponible.
- **Zone fixer** : voice + chat persona + crisis-safe

### P0-4 : Bridge bypass paintHeatmap dans Oracle du Corps
- **Où** : `dream-api-bridge.js:635-643` (radial action 'oracle-corps').
- **Quoi** : bridge ouvre `#oracle-corps-page` avec `.active` mais ne déclenche jamais `paintHeatmap()` (sprint ligne 9249). Les zones du corps restent neutres au lieu de montrer la heat map (ventre rouge, gorge orange, etc.).
- **Cause** : bridge teste `if (ocpage)` puis fait juste classList.add, ignorant la sub-app sprint qui contient `paintHeatmap`.
- **Fix** : remplacer le bloc par :
```js
case 'oracle-corps': {
  if (window.__sprint && window.__sprint.openOracleCorpsApp) {
    window.__sprint.openOracleCorpsApp();
  }
  break;
}
```
- **Zone fixer** : sub-apps

### P0-5 : Voice transcription release handler reste mock (déjà flagué)
- **Où** : `index.html:5778` `setTimeout(() => simulateAnimaResponse('vocal'), 900)`.
- **Quoi** : V5 stopRecording mock reste — mais bridge clone l'orbe et installe son propre handler (vrai Whisper + créer kairos + streamAnima). V5 stopRecording N'EST plus appelé après clone, donc ce mock est mort. **FAUX BUG en réalité** — le clone tue le mock V5 stopRecording. À NE PAS toucher.
- **Statut** : à laisser, le bridge prend la main correctement.

### P0-6 : V6.E "journal" radial → cercles fonctionne, mais bridge cas 'journal' aurait routé vers openJournal
- **Où** : V6.E `index.html:12082-12111` (capture-phase document) + bridge `dream-api-bridge.js:586-651`.
- **Quoi** : V6.E intercepte `journal/protocoles/lucid` en capture-phase avec `stopImmediatePropagation`. Bridge cloned-button listener ne fire pas. **FONCTIONNE** mais est fragile : si V6.E patch est désactivé (cheat code, etc.), bridge default branch appelle `handleRadialAction('journal')` → ouvre journal au lieu de cercles. Label dans le bouton dit "cercles" mais action serait journal.
- **Reproduction** : aucune en prod normale. Si on bypass V6.E, label/action désync.
- **Fix** : durcir le bridge default-case pour respecter le remap V6 :
```js
const REMAP = { journal: 'cercles', protocoles: 'constellation', lucid: 'anima-mundi' };
const realAction = REMAP[action] || action;
window.handleRadialAction(realAction);
```
- **Zone fixer** : navigation

### P0-7 : "kd-sec-head 'demander à la forêt'" double-handler (collapse + fetch)
- **Où** : `index.html:8014-8018` (toggle open/close section) + `index.html:13277-13301` (V8 patch, fetch polyphony).
- **Quoi** : tap sur l'en-tête "demander à la forêt" déclenche À LA FOIS : (1) ferme la section et (2) fetch polyphony qui va dans le chat-zone. Mais l'utilisateur voulait juste expanded/collapsed. Le bouton interne `data-act="foret-sagesse"` (ligne 5249) est l'élément destiné à fetch — mais V5 ligne 8126-8129 montre seulement les voix mock hardcoded.
- **Reproduction** : ouvrir un kairos → tap section header "demander à la forêt" → la section se ferme + chat anima reçoit polyphony depuis backend.
- **Fix** : retirer le V8 patch sur kd-sec-head (lignes 13277-13301) et brancher la VRAIE polyphony sur `data-act="foret-sagesse"` à la place. Faire que `case 'foret-sagesse'` au switch ligne 8126 fasse l'appel API et injecte le résultat dans `#kd-foret-resp`.
- **Zone fixer** : kairos detail + threads

### P0-8 : `data-row-action` autres que "lucid" non câblés
- **Où** : `index.html:4481` seul row a `data-row-action="lucid"`. Les 11 autres ancres etat-vivant n'ont pas d'action.
- **Quoi** : taper sur "synchronicité ouverte 3 corbeaux" ou "big dream en cours" ne fait rien (sauf le toggle expand/collapse global).
- **Reproduction** : déployer etat-vivant, taper "big dream en cours" → rien.
- **Fix** : ajouter handlers pour data-row-action="bigdream", "synchro", "intuition", etc., qui ouvrent le kairos source approprié. Ou alternativement marquer clairement "non-cliquable / display-only".
- **Zone fixer** : overlays/modals/onboarding/etat

### P0-9 : Bouton "felt-shift" visible en bas-gauche en production
- **Où** : `index.html:11872` `<button class="v6-felt-demo" id="v6-felt-demo">felt-shift</button>`.
- **Quoi** : bouton de démo développeur (déclenche l'animation felt-shift) reste visible en alpha. Confond Tim et amis.
- **Reproduction** : ouvrir l'app → bouton "felt-shift" visible bas-gauche.
- **Fix** : ajouter `style="display:none"` ou supprimer la balise. Garder uniquement si `?debug=1` dans URL.
- **Zone fixer** : overlays/modals

### P0-10 : "push humain · 30€" floating button auto-shown en alpha
- **Où** : `index.html:10480` + `index.html:11058-11067` (auto-show après 8s).
- **Quoi** : le bouton flottant "push humain · 30€" apparaît automatiquement après 8 secondes d'usage. C'est un push payant, présenté comme MVP feature alors que Stripe n'est pas branché (ligne 11053 dit "stub Stripe payment intent"). Confond le user qui pense pouvoir payer.
- **Reproduction** : ouvrir app → attendre 8s → bouton "push humain · 30€" apparaît bottom-right.
- **Fix** : supprimer l'auto-show ligne 11066, ou afficher uniquement après détection big dream avéré. Au minimum, désactiver entièrement en alpha.
- **Zone fixer** : overlays/modals

### P0-11 : `addAnimaMessage` static partout en sub-apps (pas de vraie réponse Anima)
- **Où** : multiples — `index.html:5841` (enterForet), `index.html:5972`, `index.html:7740`, `index.html:8060`, `index.html:8090`, `index.html:8123`, `index.html:8131`, `index.html:8134`, `index.html:8145`, `index.html:9137-9142`, `index.html:9700-9705`, `index.html:10546`, `index.html:10731`, etc.
- **Quoi** : partout où le code dit "Anima répond X", c'est un texte statique injecté dans le chat. Aucune persona Anima réelle ne tourne pour ces moments. Le bridge n'override que le keydown chat principal.
- **Reproduction** : marquer un kairos comme cauchemar → message Anima statique apparaît "le cauchemar est posé...". Ferme oracle corps après save → message statique. Etc.
- **Fix** : remplacer ces appels par `window.__dreamStreamAnima(prompt_contextuel)` ou par un nouveau `window.__dreamAddSystemNote()` qui ne prétend pas être Anima. À minima ajouter un styling distinct (ex: `.message.system-note`) pour ne pas confondre avec une vraie réponse Anima.
- **Zone fixer** : voice + chat persona

### P0-12 : Bridge rebind oracle-corps mais V6.E ne le précède pas
- **Où** : V6.E intercepte `journal/protocoles/lucid` avec stopImmediatePropagation (ligne 12082-12111). Pour les AUTRES actions (capter, foret, portrait, oracle-corps, sanctuaire), V6.E set `__vgIntensity` mais ne stoppe pas. Bridge cloned-button listener fire ensuite.
- **Quoi** : pour `oracle-corps`, bridge ouvre la page sans paintHeatmap (P0-4). Pour `sanctuaire`, bridge default branch appelle `handleRadialAction('sanctuaire')` qui appelle `window.__sprint.openSanctuaire()` → OK. Pour `portrait`, bridge fait son fetch + open (correct). Pour `capter`, bridge focus chat + arme `_dreamCapterArmed` (OK). Pour `foret`, bridge fetch summonKairosWisdom (OK). Donc seul oracle-corps a le bug.
- **Statut** : couvert par P0-4.

### P0-13 : Multiple Escape handlers ferment tout — pas réversible
- **Où** : `index.html:6699`, `8441`, `9902`, `10968` — 4 listeners distincts sur Escape qui ferment toutes les modales.
- **Quoi** : appuyer sur Escape ferme TOUTES les pages ouvertes simultanément (constellation + portrait + journal + ...). Si user a kairos detail open ON TOP de constellation, Escape ferme les deux d'un coup. Mauvais UX.
- **Reproduction** : ouvrir kairos detail depuis constellation → Escape → retour à anima au lieu de juste fermer le kairos.
- **Fix** : implémenter une stack de modales `_modalStack = []` poussée à l'open, popée à l'Escape. Un seul handler Escape global qui pop la dernière.
- **Zone fixer** : overlays/modals

### P0-14 : "Carte" top-nav ouvre constellation, mais pas de "Map des lieux"
- **Où** : `index.html:4441` `<button id="rc-constellation" title="constellation">carte</button>` + handler ligne 6378 ouvre `openConstellation`.
- **Quoi** : le label "carte" évoque une carte géographique. Mais ça ouvre Constellation (carte des kairos). De plus, dans portrait quaternio (ligne 12217-12218), le bouton "ouvrir la carte des lieux" appelle `openConstellation()` aussi → même destination.
- **Reproduction** : taper "carte" en haut → constellation s'ouvre. User attendait peut-être une carte Bali/Paris.
- **Fix** : renommer "carte" → "constellation" pour clarifier. Ou créer une vraie page "carte des lieux" plus tard.
- **Zone fixer** : navigation

### P0-15 : Onb-overlay non auto-affiché mais reste appelable et HTML toujours présent
- **Où** : `index.html:10567-10569` set `dream_onboarded=1` au load (désactive auto-show), mais `index.html:10382` HTML existe et `index.html:10520` `startOnboarding` exposée (`window.__dreamExt.startOnboarding`).
- **Quoi** : V6 onboard fonctionne. Ancien V5 onb-overlay persiste DOM (~80 lignes d'HTML mort). Risque d'apparition accidentelle si autre script appelle showOnboard (`finishOnboarding` exists at 10533).
- **Statut** : "déjà flagué". Tim a corrigé l'auto-show mais le HTML mort reste — recommandation : supprimer #onb-overlay du HTML pour éviter rebond futur.
- **Zone fixer** : overlays/modals

---

## P1 — Dégradés

### P1-1 : `simulateAnimaResponse('vocal')` ligne 5778 mort code
- **Où** : `index.html:5774-5779` V5 stopRecording.
- **Quoi** : V5 stopRecording mock fait `addUserMessage('[ voix déposée ... ]')` puis `simulateAnimaResponse('vocal')`. Mais bridge clone l'orbe ET pose son propre handler (tracking long-press, vrai Whisper). Le V5 handler ne tourne JAMAIS sur la nouvelle orbe.
- **Statut** : "déjà flagué bug connu restant". Tim avait noté ce bug dans le brief. Confirmé : c'est du code mort dans l'app actuelle (peut être supprimé pour clarté).
- **Fix** : retirer la fonction `stopRecording` V5 (lignes 5766-5780) puisque bridge la remplace, ou la garder pour fallback no-mic.
- **Zone fixer** : voice

### P1-2 : Multiple `window.addEventListener('load', ...)` injectent suggestions Anima au boot
- **Où** : `index.html:7896` (3 setTimeout 3.2s/6.5s/11s), `index.html:8429` (14.5s), `index.html:9913` (sanctuaire 18s), `index.html:10832` (discovery card 18s), `index.html:10987` (dictionnaire 22s), `index.html:11035` (recurring dream 25s), `index.html:11066` (push humain 8s), `index.html:11074-11111` (mode-based suggestions 30s/32s).
- **Quoi** : ~10 propositions Anima (suggestions cliquables) s'empilent dans le chat-zone dans les 30 premières secondes. C'est démo/seeded, pas alpha-prête.
- **Reproduction** : ouvrir app → laisser tourner 30s → 8 cards "anima-suggest" s'empilent.
- **Fix** : retirer toutes les injections automatiques pour l'alpha. Garder seulement celle déclenchée par un VRAI dépôt de kairos (event-driven, pas time-driven).
- **Zone fixer** : voice + chat persona

### P1-3 : "demander à la forêt" dans kairos detail montre voix hardcoded
- **Où** : `index.html:5250-5266` (HTML mock) + handler `index.html:8126-8129` (V5 montre kd-foret-resp).
- **Quoi** : cliquer "demander la sagesse" dans un kairos → 3 voix mock hardcoded (Bachelard, Aizenstat, Hopcke) s'affichent. Pas d'API call.
- **Cause** : V8 patch (ligne 13277) hooke kd-sec-head et envoie le résultat ailleurs (chat-zone). Pas le bouton lui-même.
- **Fix** : voir P0-7. Brancher data-act="foret-sagesse" sur l'API et remplacer le contenu de #kd-foret-resp en place.
- **Zone fixer** : kairos detail

### P1-4 : Échos prophétiques + figures + threads tous hardcoded dans HTML kd-page
- **Où** : `index.html:5273-5293` (HTML statique).
- **Quoi** : "il y a 12j — le rivage à marée basse", "8 dépôts cette lune", etc. — tout hardcoded. Aucun lien avec les vrais kairos de l'utilisateur.
- **Reproduction** : ouvrir n'importe quel kairos → mêmes échos affichés (ceux de Thomas mock).
- **Fix** : injecter dynamiquement depuis API `/api/kairos?related_to=X`. Pour alpha, masquer ces blocs si le user n'a pas encore N kairos.
- **Zone fixer** : kairos detail

### P1-5 : Const-stats hardcoded "127 kairos · 15 figures · 18 motifs · 3 big dreams"
- **Où** : `index.html:4619`.
- **Quoi** : peu importe le user, affiche toujours 127 kairos. Insulte un user qui vient de signer.
- **Fix** : récupérer `await DreamAPI.listKairos()` et afficher le vrai compte. Si 0 → message "tu n'as pas encore déposé".
- **Zone fixer** : portrait + constellation + body

### P1-6 : Journal entries 32 hardcoded (Thomas mock)
- **Où** : `index.html:7242-7279` JOURNAL_ENTRIES.
- **Quoi** : tous les users voient le journal de Thomas (rêves de mai, l'enfant qui marche sur l'eau, etc.).
- **Fix** : remplacer par `await DreamAPI.listKairos()`. Si vide, message "tu n'as encore rien déposé".
- **Zone fixer** : kairos + threads

### P1-7 : Threads, Anima history, dictionnaire personnel — tous hardcoded
- **Où** : `index.html:8156-8220` (CHAT_SESSIONS), `index.html:8279-8344` (THREADS_DATA), `index.html:10838-10916` (DICT_SYMBOLES).
- **Quoi** : 12 sessions chat fictives, 6 threads fictifs, 7 symboles de dictionnaire fictifs.
- **Fix** : tous remplacer par appels API. Pour alpha, simplement afficher état vide quand 0 entrée.
- **Zone fixer** : portrait + constellation + body

### P1-8 : Cercles (feu de camp) — onglets hardcoded (membres, dépôts, chat, portrait, intentions, synchros, météo, annales, rituels)
- **Où** : `index.html:4851-5066` HTML statique.
- **Quoi** : "huit présences autour du feu" toujours mêmes pseudos grecs. Simulé comme si user était dans un cercle actif.
- **Fix** : pour alpha, état vide "tu n'es dans aucun cercle. demande une invitation à invitation@dream.app". Backend pas prêt.
- **Zone fixer** : sub-apps cercles

### P1-9 : Sanctuaire kairos hardcoded ("le roi mort", "mon père sans visage", etc.)
- **Où** : `index.html:8558-8575` HTML.
- **Quoi** : tous les users voient ces 4 kairos sombres.
- **Fix** : récupérer kairos avec `is_nightmare=true OR is_grief_related=true` via API.
- **Zone fixer** : voice + crisis

### P1-10 : "Toggle face / dos" Oracle Corps zones back jamais marquées
- **Où** : `index.html:9239-9247` ZONE_MARKS — seulement zones front (`'tete-front': 4`).
- **Quoi** : zones du dos (data-zone="bas-dos", "dos-haut", "epaule-g-back", etc.) jamais paintées. Switch sur "dos" montre silhouette neutre.
- **Fix** : ajouter `'bas-dos': 3, 'dos-haut': 1` dans ZONE_MARKS. Long terme : récupérer depuis API.
- **Zone fixer** : portrait + body

### P1-11 : Lucid stats / dream signs / RC tous hardcoded
- **Où** : `index.html:8908-9036` HTML statique tabs.
- **Quoi** : "3 rêves lucides ce mois", "porte rouge 12 occurrences", etc. — pas du user.
- **Fix** : API ou état vide.
- **Zone fixer** : sub-apps lucid

### P1-12 : Crisis-banner exit button → deactivateCrisisSafe + pas de re-test
- **Où** : `index.html:9202-9207`.
- **Quoi** : `je vais mieux — sortir du mode protection` réactive immédiatement la chat IA. Pas de "are you sure" ou de cooldown 24h.
- **Fix** : confirm dialog + cooldown forcé minimum 1h avant re-désactivation.
- **Zone fixer** : voice + crisis-safe

### P1-13 : V5 `applyMode` set glyph V5 puis V6 observer le re-set — flicker visuel
- **Où** : `index.html:5629` (V5) + `index.html:11975` (V6 MutationObserver).
- **Quoi** : à chaque switch de mode atmosphérique, V5 inject glyphe puis V6 inject glyphe différent. Si V5 et V6 diffèrent, flicker bref.
- **Fix** : retirer la ligne 5629 V5 et laisser V6 gérer entièrement les glyphes.
- **Zone fixer** : overlays/modals

---

## P2 — Cosmétique / améliorations

### P2-1 : `#cercle-titre` référencé n'existe pas
- **Où** : `index.html:6750` `const titre = $('#cercle-titre')`.
- **Quoi** : keyboard ArrowLeft/Right en cercles — handler tente `$('#cercle-titre')` qui retourne null. Pas de crash (test `if titre`), mais navigation cercle via clavier ne fonctionne pas. `navigateCercle` qui agit sur `.feu-titre` (ligne 6686) reste OK via swipe.
- **Fix** : remplacer `$('#cercle-titre')` par `$('.feu-titre')`.
- **Zone fixer** : navigation

### P2-2 : `#ah-close` et `#threads-close` référencés n'existent pas (fallback OK)
- **Où** : `index.html:6582`, `6586`, `6725`, `6733`.
- **Quoi** : keyboard handler tente `$('#ah-close')` puis fallback sur `$('#ah-back')`. Idem threads.
- **Fix** : nettoyer pour clarté. Remplacer par directement `$('#ah-back')` et `$('#threads-back')`.
- **Zone fixer** : navigation

### P2-3 : Stale `orbe` const dans `attachSwipeNav` après bridge clone
- **Où** : `index.html:6438` `if (orbe && orbe.contains(e.target))`.
- **Quoi** : `const orbe` ligne 5661 pointe vers vieille orbe (détachée). Test `contains` retourne false pour la nouvelle. Pas critique car `_swipeStartedOnInput` filtre déjà via `.orbe` class.
- **Fix** : remplacer par `e.target.closest('.orbe')`.
- **Zone fixer** : navigation

### P2-4 : Bridge ne montre pas lock-hint-toast lors de verrouillage voice
- **Où** : `dream-api-bridge.js:540-544`.
- **Quoi** : V5 `lockRecording` (ligne 5690) appelle `showLockHint()` (toast 2.8s). Bridge `onMove` lock juste add classe + haptic. Toast jamais montré. Mineur.
- **Fix** : dans bridge, ajouter `const toast = document.getElementById('lock-hint-toast'); if (toast) { toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2800); }`.
- **Zone fixer** : voice

### P2-5 : Bridge ne met pas à jour orbe-hint à l'état locked
- **Où** : `dream-api-bridge.js:540-544`.
- **Quoi** : quand verrouillé, hint reste "j'écoute, relâche pour clore" au lieu de "verrouillé · parle librement · re-tap pour clore".
- **Fix** : ajouter `const hint = document.getElementById('orbe-hint'); if (hint) hint.innerHTML = '⌃ verrouillé · parle librement · <em>re-tap pour clore</em>';`.
- **Zone fixer** : voice

### P2-6 : Glossaire termes (`kairos`, `anima_mundi`, etc.) underline pointillé partout — distrait
- **Où** : `index.html:10661-10698` `wireGlossaryOnText` parcourt toutes textNodes et wrappe les termes.
- **Quoi** : dans certains modes (jour-actif, soir), trop d'underlines pointillés dégradent la lisibilité.
- **Fix** : limiter à `#chat-zone` et `#portrait-letter-body` (déjà fait : ligne 10775-10777). Vérifier que MutationObserver ne wire pas sur portrait quaternio dynamique.
- **Zone fixer** : overlays/modals

### P2-7 : Particules `.particule.p1` à `.p20` SVG sans width/height intrinsics
- **Où** : `index.html:4400-4421`.
- **Quoi** : div placeholder, taille via CSS. Probablement OK mais à vérifier sur mobile portrait — particules parfois invisibles.
- **Fix** : si invisibles, renforcer min-width/min-height en CSS.
- **Zone fixer** : visual

### P2-8 : `triggerHaptic` requiert navigator.vibrate (iOS Safari ne supporte pas)
- **Où** : `index.html:7045-7053`.
- **Quoi** : iOS Safari ignore vibrate. Aucun fallback haptic.
- **Fix** : pas critique. Pour iPhone, considérer Web API Vibration absent → usage future Capacitor.
- **Zone fixer** : voice

### P2-9 : Discovery cards (`open-dict-btn` ajouté à constellation au load)
- **Où** : `index.html:11117-11129`.
- **Quoi** : bouton "✦ dictionnaire personnel" ajouté à #strate-constellation au load. Si DICT_SYMBOLES vide (alpha sans data), bouton ouvre dict vide.
- **Fix** : conditionner l'apparition à `DICT_SYMBOLES.length > 0` ou compter les vrais symboles.
- **Zone fixer** : portrait + constellation

---

## Faux problèmes (intentionnels, à NE PAS toucher)

- **Pattern Alexander asymétrique** des glyphes V6.B (ligne 11912) : intentionnellement non-Bézier-parfait selon design.
- **5 particules mortelles sur 20** mode soir Tanizaki (ligne 12678-12679) : voulu (palette sombre).
- **Multiple `window.addEventListener('load')`** : ces sont des injections de seed data progressivement révélées (3.2s/6.5s/...). Conceptuellement voulu pour démo, mais pour ALPHA il faut les retirer (voir P1-2).
- **Backdrop-filter sur `.kd-page::before`** : déjà refactor pour ne plus créer containing block (commentaire ligne 2769-2770).
- **V5 `function simulateAnimaResponse`** ligne 7109 : reste comme fallback légitime quand DreamAPI absente. À garder.
- **`onb-overlay`** HTML reste : volontairement neutralisé via `dream_onboarded=1` au load. Recommandation : supprimer le HTML pour réduire bruit, mais pas un bug.

---

## Zones de fix recommandées (pour swarm parallèle)

### Zone A — Navigation (~4 bugs · ~1.5h-2h)
- P0-1 (swipes 10% edge → relax)
- P0-6 (V6 remap fragile)
- P0-14 (label "carte" → "constellation")
- P0-13 (Escape stack modales)
- P2-1 (#cercle-titre)
- P2-2 (#ah-close / #threads-close)
- P2-3 (stale `orbe` const)

### Zone B — Sub-apps Cercles/Sanctuaire/Lucid/Oracle Corps (~4 bugs · ~1.5h-2h)
- P0-4 (paintHeatmap missing)
- P1-8 (cercles hardcoded → empty state)
- P1-9 (sanctuaire kairos hardcoded → API)
- P1-11 (lucid stats hardcoded → empty state)
- P1-10 (oracle dos zones)

### Zone C — Kairos detail + threads + sagesse polyphonique (~3 bugs · ~1h-1.5h)
- P0-7 (kd-sec-head double handler)
- P1-3 (foret-sagesse mock)
- P1-4 (échos / threads hardcoded → API)

### Zone D — Portrait + Constellation + Body (~4 bugs · ~1.5h-2h)
- P1-5 (const-stats 127 kairos hardcoded → API)
- P1-6 (journal entries hardcoded → API)
- P1-7 (threads / anima-history / dict hardcoded → API)
- P2-9 (open-dict-btn empty state)

### Zone E — Overlays/modals/onboarding/glossaire (~4 bugs · ~1h-1.5h)
- P0-9 (felt-shift demo button → display:none)
- P0-10 (push-humain auto-show → off)
- P0-15 (onb-overlay HTML → supprimer)
- P0-8 (etat-vivant rows non câblées → handlers)
- P1-13 (glyph V5/V6 flicker)
- P2-6 (glossy term underline scope)

### Zone F — Voice + chat persona + crisis-safe (~4 bugs · ~2h-3h)
- P0-2 (4 chat listeners morts → re-wire dans bridge)
- P0-3 (crisis patterns enrichir)
- P0-11 (`addAnimaMessage` static → distinguer system note vs Anima)
- P1-1 (V5 stopRecording mort code)
- P1-2 (load suggestions → retirer)
- P1-12 (crisis exit confirm + cooldown)
- P2-4 (lock-hint-toast)
- P2-5 (orbe-hint locked update)

---

## Checklist priorités absolues pour alpha "vraiment fonctionnelle"

1. **Fix swipes** (P0-1) — 10 min de code, débloque tout.
2. **Re-wire 4 listeners chat** (P0-2 + P0-3) — 30 min, débloque crisis + body + lucid + honor.
3. **Heat map oracle corps** (P0-4) — 5 min.
4. **Désactiver demo buttons** (P0-9 + P0-10) — 2 min.
5. **Remplacer hardcoded data par empty states** (P1-5 à P1-11) — 1-2h, montre vraie alpha.
6. **Stack Escape** (P0-13) — 30 min.
7. **Distinguer addAnimaMessage system vs vraie Anima** (P0-11) — 30 min.

Total chemin critique : **~3-4h** pour passer de "demo seedée" à "alpha utilisable par 5 amis".
