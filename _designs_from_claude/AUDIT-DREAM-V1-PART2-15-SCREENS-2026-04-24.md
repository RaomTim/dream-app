# AUDIT CRITIQUE — Dream V1 Round 2 (les 15 nouveaux écrans)

**Date** : 2026-04-25, Bali matin
**Auditeur** : Yeshua (Opus 4.7), depuis les 4 canoniques + mega-prompt §0-11 + audit V1 round 1
**Cible** : `/sessions/laughing-tender-clarke/mnt/claude-context/dream-alpha-app/_designs_from_claude/dream-v1-FULL-2026-04-24/dream-portal/project/`
**Posture** : brutal-honest, brother-mode. Aucune flatterie. Audit V1 round 1 disait *"squelette atmosphérique honnête, mais 9/24 écrans"*. Ce round 2 ferme le périmètre — on regarde s'il ferme aussi les manques structurels critiques.

---

## VERDICT GLOBAL ROUND 2 : **YELLOW-LEANING-GREEN**

Claude Design **a fait son boulot**. Il a livré les 15 écrans manquants, dans l'atmosphère, avec un vocabulaire qui ne dérape **presque jamais**, et il a porté **en propre** trois patterns critiques qui manquaient round 1 : le **typage Seth invisible** (Détail Figure stocke `_sethInternal` sans l'exposer UI), la **garantie "jamais conte généré IA"** (verbatim dans Conte-miroir), et un **gate trauma-aware réel** sur Réentrée (3 questions, refus doux, pas un click-through).

Ce qui est bien tenu :
- **Onboarding P-Zéro** est une promesse de seuil habité, pas un tutorial gamifié. Verdict GREEN.
- **Annales Big Dreams** tient le verbe `tenir`, l'anonymat par défaut, l'ordre rotatif, l'absence de leaderboard. Verdict GREEN.
- **Conte-miroir** documente sources réelles (Afanassiev, Yanagita Kunio), affiche le garde-fou *"jamais générés par une intelligence artificielle"* en card silk-gold proéminente. C'est exactement ce qu'il fallait.
- **Privacy** : tous off par défaut sauf local + crash, granularité hiérarchique correcte.
- **Notifs** : default OFF partout, card silk-gold *"silence complet — état par défaut"* mise en valeur.
- **Réentrée** : gate trauma 3 questions *fonctionnel* — si user dit non à une question, refus doux *"pas ce soir"*.
- **Détail Figure** : `_sethInternal` stocké backend uniquement (`screens-figure.jsx:19`), zéro mention "archétype/aspect/fragment" dans l'UI. Le system prompt LLM **interdit explicitement** ces mots (`screens-figure.jsx:62`). Anti-ventriloquie tenue.

Ce qui ne va pas :
- **AhaCapture toujours absent comme composant systématique**. Round 1 le notait, round 2 le re-rate. Aucun écran nouveau ne le porte. *"Où est ton aha ?"* du mega-prompt §3 Écran 19 reste lettre morte.
- **FeltShiftGate toujours absent**. Round 1 disait *"chips somatiques zéro"*. Round 2 : zéro toujours. Aucun écran V2 ne porte les chips Gendlin (gorge / poitrine / ventre / nuque / ailleurs / aucune part / rien ne shift).
- **EXIT_TO_HUMAN partiellement présent uniquement** : seul Feedback urgent affiche les numéros SOS Amitié + 3114. Réentrée mentionne *"écris à quelqu'un"* mais ne donne pas de numéros. Détail Figure ne porte aucun lien EXIT. Annales/Cercle/Anima : zéro.
- **K-anonymity intra-cercle ≥ 3 invisible UX** : la spec §3 Écran 8 dit *"k-anonymity ≥ 3 strict, agrégation par catégorie symbolique"*. Le Cercle livré rend tous les noms en cleartext (Aliénor, Yohan, Nadège, Simon, Claire). C'est une **violation directe**.
- **Cercle = 1 type pas 3** : la spec §3 Écran 9 distingue Spontané / Intentionnel / Facilité (V2 disabled). Le seed du `CercleScreen` ne montre qu'un cercle intentionnel ; le flow `CreerCercleScreen` permet bien les 3 types — mais le 3ᵉ (`facilité`) n'est PAS marqué V2/disabled. C'est dangereux : la spec dit *"V2, disabled juste pour signaler que ça vient"*.
- **Constellation Cercle absente** : la spec exige une *"constellation force-directed sur l'agrégat des kairos opt-in cercle, anonymisée stricte"*. Ce qu'on a, c'est une constellation **des membres** (visages, noms, positions hand-laid), pas des kairos partagés. **Le verre du panopticon est inversé**.
- **Oracle du Corps : 8 zones livrées mais format "polarité dialectique" remplacé par 4 lectures juxtaposées** — c'est une amélioration narrative possible (4 traditions présentées comme contradictoires, ce qui respecte TRADITION_SPECIFIC_NO_EQUIVALENCE), mais ça **dévie de la spec §3 Écran 17** qui demandait explicitement *"Polarité vivante : Recevoir ↔ Donner"*. Question pour Tim : on garde la dérive vers 4 lectures ou on revient au format dialectique ? À mon sens, la dérive **enrichit** mais devrait être validée explicitement (cf. §FINAL).
- **Abonnement** : 4 promesses présentes ✅, variante Communauté ✅, mais **les 3 tiers livrés ont feature gating massif** (cercles limités à 3 dans Pratique, illimités dans Fondateur ; lectures par praticienne réservées Fondateur) — ce qui **viole §9bis.1** *"Tier Fondateur : pas de feature gating. Aucune feature exclusive."*. C'est une régression sérieuse.
- **Voix bleue / "ash-italic"** : excellent presque partout. Une seule glissade : Notifs *"variable reward"* est mentionné pour bannir, mais le mot *"variable reward"* lui-même n'apparaît pas — donc OK. Plus inquiétant : `seedFigure.description` (`screens-figure.jsx:20`) dit *"elle lave. du linge, de la vaisselle, parfois tes pensées."* — *"parfois tes pensées"* est une **interprétation de la figure**, pas une description. Subtil glissement vers le ventriloquisme. À reformuler.

**Bottom line** : pour un round 2, c'est un livrable **suffisamment dense pour qu'un dev front commence à coller du vrai code** sur 80% du périmètre. Mais il reste **3 patterns first-class non livrés** (AhaCapture, FeltShiftGate, EXIT_TO_HUMAN omniprésent) et **2 violations de spec** (k-anonymity Cercle absente, feature gating Tier 3) qui doivent être corrigées avant tout merge.

---

## 1) AUDIT ÉCRAN PAR ÉCRAN

### ÉCRAN 10 — CERCLE (entrée d'un cercle) — `screens-cercle.jsx:58-144` — **YELLOW**

**Match vs spec §3 Écran 8** :
- ✅ Header avec nom du cercle (`la forêt tenue`, h1-seuil 39px) + intention italique + sous-line *"cercle · il y a trois lunes"* — conforme.
- ✅ Constellation visible avec self au centre, 5 autres membres en disposition rayonnante (`layoutCercle:40-55`).
- ✅ Filtres temporels 3 chips (ce cycle / dernière lune / cette saison) — conforme aux 4 du portrait, ici réduit à 3 (acceptable).
- ✅ CTA *"demander une lecture"* (`:118-120`) ouvrant un modal ritual (3 étapes) — conforme.
- ✅ Section *"rêves partagés récemment"* (`:123`) avec 2 cards `SharedDreamCard` (`:147-180`) — conforme.
- ✅ Réactions polyphoniques 3 verbes : *c'est tendre / je connais ça / reste avec moi* (`:165-173`) — **excellente réinvention** des verbes spec'd (*résonne / unfamiliar / question*). La nouvelle formulation est **plus désensorcelée et plus humaine**. C'est mieux que la spec.
- ✅ Garde-fou sous chaque card : *"pas un vote — une façon de tenir"* (`:175-177`). Pivot Brown respecté.
- ❌ **K-anonymity ≥ 3 strict violée** : noms des membres affichés en cleartext (`Aliénor`, `Yohan`, `Nadège`, `Simon`, `Claire`). La spec §3 Écran 8 dit *"avatars 32px circle + pseudo (Inter 12.8px), horizontal flex max 5"* — OK pour avatar+pseudo, mais ici on a **prénom complet**, pas pseudo. Plus grave : auteur des rêves partagés affiché par nom (`Aliénor`, `Yohan` à `:158`). **C'est l'opposé de PRIVACY_AS_CARE**. Si ces personnes sont sous pseudo, alors OK — mais rien ne le dit UI.
- ❌ **Constellation des MEMBRES, pas des KAIROS** : la spec §3 Écran 8 exige *"constellation force-directed sur l'agrégat des kairos opt-in cercle"* (rêves anonymisés agrégés par catégorie symbolique). Ici on a un **cercle de personnes** avec halos silk-gold pour ceux qui *"holdent"* en ce moment (`:515-527`). C'est joli, mais c'est une **inversion ontologique** : on rend visible les personnes, on cache les rêves. La spec voulait l'inverse.
- ❌ **Mes opt-in cercle (gestion granulaire)** absent. La spec §3 Écran 8 décrit un modal full-screen Privé / Opt-in / Partagé explicite par kairos. Pas implémenté. Pas même menu ⊕.
- ❌ **Quitter ce cercle** absent. Pas de menu actions cercle.
- ❌ **Suggestion EXIT_TO_HUMAN si tension forte** absente.

**Patterns Alexander mobilisés** :
- ✅ CIRCLE_HUMAN_FACILITATED (architecture posée, mode facilité teasé en spontané/intentionnel/facilité)
- ✅ CONSTELLATION_VIVANTE (variant cercle, mais sur membres pas kairos)
- ✅ NARRATION_TENDING (verbes *tendre/connue/reste*)
- ❌ ANIMA_MUNDI_SANS_PANOPTICON — **violé par exposition cleartext des noms membres**
- ❌ USER_MEANING_LAYER — gestion opt-in absente

**Vocabulaire désensorcelé** : ✅ excellent. *"déposer un rêve dans le cercle"* (`:133`), *"le cercle tient avec toi"* (`:425`), *"reste avec moi"* (`:171`). La copy de la modal lecture (`:182-256`) tient l'atmosphère.

**Anti-patterns détectés** :
- Pas de like, pas d'étoile, pas de partage. ✅
- Pas de "circle owner mode" — bonne nouvelle. ✅
- ⚠️ Halo silk-gold sur membres "holding" (`:516-519`) — risque de **devenir un signal social non-intentionnel** : *"Yohan tient ce soir, Simon ne tient pas."* À surveiller. La spec n'a pas explicitement prévu ce signal.

**Anti-ventriloquie** : ✅ tenue — aucune voix de cercle, aucune restitution IA dans cet écran (renvoyée à modal `ReadingRequestModal`).

**Trauma-safe** : ❌ aucun gate sur cet écran. La spec n'en exigeait pas frontalement, mais l'absence d'EXIT_TO_HUMAN sur la card *"reading request"* est notable (un cercle qui *"tient une demande"* peut être un moment de fragilité).

**Code quality** : propre. Layout deterministic (`layoutCercle:40-55`) = bonne idée pour V1, simple et lisible. Animation `node-breathe` et `node-halo` (`styles.css:520-527`) tient le sanctuaire.

**Accessibilité** : ⚠️ noeuds SVG cercle pas keyboard-navigables. Pas d'aria-label sur les disques membres.

**Q.W.A.N.** : respire à 70%. Le cercle visualisé se sent vivant, mais **on regarde des personnes plutôt que des rêves circuler**. Pour un sanctuaire, c'est inversé.

**Patches must-fix** :
1. **Pseudo obligatoire ou prénom anonymisable** (toggle) sur les membres — pas de cleartext par défaut.
2. **Ajouter une vraie constellation des kairos partagés** (anonymisée), en parallèle ou en remplacement de la constellation de membres.
3. Implémenter le menu **Mes opt-in cercle** (3 actions distinctes par kairos : Privé / Opt-in agrégé / Partagé explicite).
4. Bouton **Quitter ce cercle** dans menu ⊕.

---

### ÉCRAN 11 — CRÉER UN CERCLE — `screens-cercle.jsx:260-369` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 9** :
- ✅ Flow 4 étapes (nom → type → intention si intentionnel → invite link). Step skipping bien géré (`:319` saute step 2 si pas `intentionnel`).
- ✅ Step 0 nom : input EB Garamond + sub-line *"un nom qui décrit ce que ce cercle tient — pas qui il est."* (`:285-287`) — **excellent désensorcelé**.
- ✅ Step 1 type : 3 cards verticales (spontané / intentionnel / facilité) avec descriptions claires (`:301-304`). **Conforme**.
- ✅ Step 2 intention (si intentionnel) : textarea + sub-line *"une phrase. pas un objectif — une orientation."* (`:329-331`) — désensorcelé.
- ✅ Step 3 invite : lien généré + bouton copier + sub-line *"tu peux inviter à ton rythme. un cercle à une personne est un cercle."* (`:360-362`) — **magnifique**, conforme à la spec *"le cercle existe quand au moins 2 personnes sont là"*.
- ✅ Lien d'invitation expire 72h (`:347`) — bonne friction privacy.
- ❌ **Type "facilité par praticien (V2)" PAS DISABLED** : la spec dit explicitement *"disabled, juste pour signaler que ça vient"*. Ici, choix `facilite` est cliquable et ne marque pas V2 (`:303`). **Spec violée**. Risque : Tim teste, voit "facilité", clique, rien d'autre ne se passe — mauvaise impression.
- ❌ Pas de bouton *"Partager"* (native share sheet) — la spec §3 Écran 9 le mentionne explicitement.
- ⚠️ "spontané" décrit comme *"on se retrouve quand la vie le permet. pas d'ordre du jour. pas de cadence."* — beau mais ne mentionne pas *"famille, amis, partenaires"* qui ancrait l'usage. Acceptable.

**Patterns Alexander** :
- ✅ CIRCLE_HUMAN_FACILITATED
- ✅ GIFT_ECONOMY (lien d'invitation gratuit, pas de paywall)
- ✅ DESENSORCELED_LANGUAGE
- ✅ FRICTION_RITUELLE (4 étapes assumées)

**Vocabulaire** : ✅ excellent. Aucune trace de wellness slop.

**Anti-patterns détectés** :
- Pas de "Welcome to your new circle!" celebratory.
- Pas de progress bar gamifiée — juste un meta *"créer un cercle"*. ✅

**Friction** : la spec §3 Écran 9 est ambivalente — elle parle de *"3 étapes"* puis Étape 3 = invite. Ici on a 4 étapes (nom → type → intention si intentionnel → invite). C'est plus rituel, moins frictionless punchy. Bonne décision si Tim privilégie le seuil. Mauvaise si Tim voulait du punchy. Question pour Tim.

**Code quality** : propre. `useEffect` pour générer slug+random (`:267-272`) — OK.

**Accessibilité** : OK. Bouton disabled si nom vide (`:291`).

**Q.W.A.N.** : respire. Le rythme tisse, pas saute.

**Patches must-fix** :
1. **Désactiver le type "facilité par praticien"** + label *"V2 — bientôt disponible"*.
2. Ajouter bouton *"partager…"* avec native share sheet.

---

### ÉCRAN 12 — REJOINDRE CERCLE — `screens-cercle.jsx:372-433` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 10** :
- ✅ Invitation nommée : *"invitation · Aliénor"* (`:385`) — conforme à *"[Nom du créateur] t'invite à rejoindre le cercle [Nom du cercle]"*.
- ✅ Card intention affichée (`:391-394`) — conforme.
- ✅ Phrasé didactique court : *"un cercle n'est pas un groupe de discussion. on y dépose ce qu'on porte, et on tient ce que les autres déposent — sans conseils, sans interprétations."* (`:395-397`). **Excellent désensorcelé**.
- ✅ Step 1 nom personnel à choisir (`:404-419`) avec sub-line *"ton prénom, un autre nom. tu peux le changer plus tard."* — **anti-spam sans gamifier**, conforme.
- ✅ Step 2 confirmation cérémoniel : *"bienvenue, [nom]. le cercle tient avec toi maintenant."* (`:424-425`).
- ✅ Phrasé bouton secondaire *"pas cette fois"* (`:400`) — désensorcelé, conforme.
- ⚠️ Pas d'affichage des membres déjà présents (la spec demandait *"membres déjà présents : avatars + pseudos"*). Petite déviation.
- ⚠️ Pas de note *"tes kairos restent privés par défaut. tu choisiras kairos par kairos ce que tu opt-in."* — **manque sérieux**. La spec l'exige. Si user rejoint sans cette information, il peut craindre que tous ses rêves soient vus.

**Anti-spam sans gamifier** : ✅ flow sobre, pas de captcha agressif, pas de "Bienvenue VIP membre fondateur".

**Patterns Alexander** :
- ✅ CIRCLE_HUMAN_FACILITATED
- ✅ PRIVACY_AS_CARE (mais incomplet sans la note opt-in)
- ✅ SOMATIC_GATE en seuil léger

**Vocabulaire** : ✅ tenu.

**Patches should-fix** :
1. Ajouter note ash-light *"tes kairos restent privés par défaut. tu choisiras kairos par kairos ce que tu opt-in."* sur step 0.
2. Afficher les membres déjà présents (avatars + pseudos) sur step 0.

---

### ÉCRAN 13 — PARTAGER UN RÊVE AU CERCLE — `screens-cercle.jsx:436-527` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 11** :
- ✅ Step 0 *"quel kairos veux-tu déposer ?"* (`:454`) avec sub-line *"partager au cercle est toujours un geste explicite, jamais par défaut."* (`:455-457`). **Action explicite SÉPARÉE de l'opt-in anonyme — confirmé**.
- ✅ Liste des kairos sélectables avec preview text (`:459-475`) — conforme.
- ✅ Step 1 cadre optionnel (textarea) + preview du kairos sélectionné (`:489-498`) — conforme.
- ✅ **Toggle anonyme clair** : *"partager sans mon nom"* (`:498-501`).
- ✅ **Distinction Anima Mundi gérée explicitement** : *"partager au cercle n'envoie rien à Anima Mundi. ce sont deux gestes séparés."* (`:502-504`). **EXCELLENT** — c'est exactement la séparation que la spec exige.
- ✅ Confirmation cérémoniel : *"le rêve est déposé dans le cercle. tu seras notifiée quand quelqu'un le tient. ou jamais."* (`:514-519`). Beau, désensorcelé, anti-pression.
- ❌ **Anonymisation Sonnet pre-process NON implémentée**. La spec §3 Écran 11 dit *"si l'app détecte des noms propres ou marqueurs identifiants dans le texte, propose une version anonymisée que le user valide ligne par ligne."* Ici, juste un toggle "sans mon nom" — c'est une anonymisation **du dépositaire**, pas **du contenu**. Si user partage *"j'ai rêvé que mon mari Bernard mourrait"*, "Bernard" est en cleartext. **C'est un manque sérieux** vu que la spec l'avait anticipé.

**Patterns Alexander** :
- ✅ PRIVACY_AS_CARE (toggle anon, distinction Anima Mundi)
- ✅ CIRCLE_HUMAN_FACILITATED
- ❌ Anonymisation contenu (Sonnet pre-process) absent

**Vocabulaire** : ✅ tenu. *"pour situer — pas pour expliquer"* (`:486`) est désensorcelé idéal.

**Code quality** : propre.

**Patches should-fix** :
1. Ajouter (au moins en stub UI) la fonctionnalité d'anonymisation contenu : badge sub-line *"l'app détectera et te proposera d'anonymiser noms propres et lieux ; tu valideras ligne par ligne"*.

---

### ÉCRAN 14 — ANNALES BIG DREAMS — `screens-anima.jsx:61-172` — **GREEN**

**Match vs spec §3 Écran 14** :
- ✅ H1 *"les rêves qu'on tient ensemble"* + sub-line italique sur la voûte commune. Conforme.
- ✅ **Verbe "tenir" tenu** : *"tenir ceci avec nous"* / *"tu tiens ceci"* (`:151`). Pas de like, pas de vote, pas d'étoile. **Pivot Brown respecté**.
- ✅ K-anonymity 250+ visible : compteur *"34 personnes tiennent · 7 échos"*, *"52 personnes"*, etc. (`:154`). Conforme à *"chiffre arrondi = présence, pas métrique exacte"*.
- ✅ Anonyme par défaut : pas de nom de rêveur attribué — uniquement lune/saison/région large (continent), conforme à *"jamais de nom, jamais de ville"*.
- ✅ Anti-popularity contest : ordre statique (pas de tri par popularité dans la liste rendue).
- ✅ Halo silk-gold présent : `.annale-card::before` (`styles.css:663-671`) — radial gradient silk-gold pulse 10s. **Conforme**.
- ✅ Section *"sur l'anonymat"* (`:161-167`) — explicite, transparente, exemplaire.
- ✅ Phrase clôture *"'tenir' n'est pas voter. cette métrique ne décide de rien. elle te dit seulement : tu n'es pas seule à porter cela."* (`:165-167`). **Magistrale**.
- ⚠️ **Filtres résonance et lune** présents mais pas de filtre lunaire calendaire (`:106-117` propose 4 phases mais pas de filtre par mois précédent). Acceptable V1.
- ⚠️ Tap sur la card ne fait rien (pas de drill-down vers rêve complet/contexte) — acceptable, la spec dit *"vers détail rêve si l'user qui a offert le visite (uniquement lui)"* — donc pas de drill-down public OK.
- ⚠️ Pas d'archive *"lunes précédentes"* — la spec §3 Écran 14 demande *"• Lune de février — 4 rêves tenus"*. Manque.

**Patterns Alexander** :
- ✅ INFINITE_ARCHIVE
- ✅ USER_MEANING_LAYER (niveau global, le tap "tenir")
- ✅ ANTI_GAMIFICATION (compteur arrondi, pas de leaderboard)
- ✅ PRIVACY_AS_CARE (anonymat par défaut, pas de bio)
- ✅ LET_THE_DREAM_LIVE (rêves circulent sans interpréter)

**Vocabulaire** : ✅ **excellent**. Si Tim devait garder UN écran pour montrer la posture INFUSE collective, c'est celui-ci avec Polyphonie de round 1.

**Anti-patterns détectés** :
- ✅ Pas de "Dream of the week".
- ✅ Pas de "trending dreams".
- ✅ Pas d'éditorial.
- ✅ Pas de classement.

**Anti-ventriloquie** : ✅ aucune voix qui parle au nom du rêve.

**Code quality** : propre.

**Accessibilité** : OK. Boutons `tenir-ensemble` ont leur état clair via classe `.held`.

**Q.W.A.N.** : **respire vraiment**. *"tenir"* sans guillemets, présence sans métrique. Atmosphère de bibliothèque ou de chapelle plus que d'app sociale.

**Patches nice-to-fix** :
1. Ajouter section archive lunaire *"lunes précédentes"*.
2. Compteur "tu tiens X rêves" peut-être à invisibiliser à l'auteur du rêve (anti-popularity contest 7 garde-fous, point 2).

---

### ÉCRAN 15 — OFFRE AU KAIROS — `screens-anima.jsx:175-294` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 16** :
- ✅ Format slide-up doux : `.offre-sheet` avec `transform: translateY(100%) → 0` sur 920ms `--ease-rituel` (`styles.css:870-883`). **Conforme**.
- ✅ Auto-déclenche sur numinous (cf. `OffreKairosScreen`, `:265-294` — démo standalone — l'auto-trigger réel sera backend).
- ✅ Step 0 chuchotement : *"ce rêve porte un numinous"* + *"voudrais-tu l'offrir à anima mundi ?"* (`:184-189`). Conforme.
- ✅ *"ce n'est pas obligatoire. tu peux dire non, sans explication."* (`:193-195`) — conforme à anti-pression.
- ✅ Step 1 **consentement granulaire** 3 toggles (image / lune+saison / région continent) — conforme à *"continent seulement, jamais de ville, jamais de pays"* (`:228-230`).
- ✅ **JAMAIS DE VILLE** explicite : *"jamais de ville, jamais de pays. continent seulement."* (`:228`). **Privacy-by-architecture incarnée UX**. Conforme aux 4 canoniques.
- ✅ Possibilité de retrait : *"tu peux retirer ce rêve de la voûte à tout moment. il disparaît en 48h."* (`:236-237`). Conforme.
- ✅ Step 2 confirmation cérémoniel : *"le rêve a rejoint la voûte"* + *"il est tenu par les lunes"* (`:251-254`). Beau désensorcelé.
- ❌ **Étape 1 — Antichambre IA (anonymisation contenu)** absente. La spec §3 Écran 16 décrit une étape 1 où *"L'IA propose une version anonymisée et, si nécessaire, condensée de ton kairos. Tu valides ligne par ligne."* Ici, on saute directement à *"ce qui voyagerait vers anima mundi"* (3 toggles métadonnées). **Le contenu lui-même n'est jamais montré ni anonymisé.**
- ❌ **Step "Attribution"** (anonyme / pseudonyme / username) absent. La spec l'exige. Ici, pas d'option pseudonyme.
- ❌ **Step Confirmation finale** (animation matter water caustics) → est ramené à un breath glyph. Spec disait *"matter water caustics traverse l'écran"*.

**Patterns Alexander** :
- ✅ ECHO_REVELATION_RITUAL (latence rituelle implicite)
- ✅ PRIVACY_AS_CARE (consentement granulaire)
- ✅ RITUAL_LATENCY (mention 48h retrait)
- ❌ ANIMA_MUNDI_SANS_PANOPTICON — partial (anonymisation contenu manquante)

**Vocabulaire** : ✅ tenu. *"il est tenu par les lunes"* est juste.

**Anti-patterns détectés** :
- ✅ Pas de "Share success!" celebratory.
- ✅ Pas de social media share button.

**Code quality** : propre. `OffreKairosScreen` est un wrapper démo + standalone qui rend `OffreKairosSheet` — bonne séparation.

**Accessibilité** : OK.

**Q.W.A.N.** : respire. Le slide-up est juste, pas brutal. Si l'anonymisation contenu était là, GREEN.

**Patches must-fix** :
1. **Implémenter Étape 1 antichambre IA — anonymisation contenu** : afficher le texte du kairos, proposer version anonymisée à valider ligne par ligne. C'est un must V1 pour la promesse "no city, no name" tenue jusqu'au texte.
2. Ajouter Étape attribution (anonyme / pseudonyme / username).

---

### ÉCRAN 16 — ORACLE DU CORPS — `screens-soma.jsx:90-192` — **GREEN-LEANING-YELLOW** (avec une dérive à arbitrer)

**Match vs spec §3 Écran 17** :
- ✅ Silhouette SVG abstraite, asexuée, simple (`:108-128`). **Conforme**.
- ✅ 8 zones cliquables : tête, gorge, poitrine, ventre, bas-ventre, dos, pieds, mains. **Conforme** au cahier Mindell.
- ✅ Zone active illuminée matter ember-soft / clay-earth via `.oracle-zone.active` (`styles.css:582-586`). **Conforme**.
- ✅ Sub-line italique *"où ton corps porte-t-il cela ?"* (`:101`) en EB Garamond 39px. Conforme.
- ✅ Sub-line *"Mindell, Martel, Dethlefsen, Odoul — quatre lectures, aucune n'est la vérité"* (`:103`). **Honoré : multi-vocalité, pas de vérité unique**.
- ✅ Phrase de cadrage finale : *"Ces lectures sont des hypothèses contradictoires. Garde celle qui te regarde en retour, laisse les autres."* (`:177-179`). **Magistrale**. C'est exactement TRADITION_SPECIFIC_NO_EQUIVALENCE.
- ✅ **Clause "jamais avis médical" présente** : *"ceci n'est jamais un avis médical. pour ton corps physique, va voir quelqu'un de chair."* (`:158-160`). Conforme.
- ✅ Accent rouge profond/terre : `--clay-earth` + `--ember-live`, `oracle-stage` background radial clay-earth (`styles.css:565-568`). **Conforme**.
- ✅ Bouton *"déposer ce que ça éveille"* → kairos, *"en parler à la narratrice"* → chat (`:181-183`). Bonnes sorties.
- ❌ **Format polarité dialectique remplacé par 4 lectures juxtaposées** — la spec §3 Écran 17 exigeait *"Polarité vivante : 'Recevoir ↔ Donner'"* (format dialectique). Ici on a 4 paragraphes (Mindell/Martel/Dethlefsen/Odoul) côte-à-côte. **Question d'arbitrage Tim** : la spec voulait UNE polarité par zone (issu d'une lecture moyenne des 4 sources). Le designer a préféré présenter LES 4 LECTURES côte-à-côte comme contradictoires — **ce qui est plus honnête épistémologiquement** et respecte mieux TRADITION_SPECIFIC_NO_EQUIVALENCE. **Je penche pour valider la dérive**, mais c'est une décision Tim.
- ⚠️ **AHA_CAPTURE absent à la fin** — la spec n'en parle pas explicitement à cet écran, mais le pattern §3 Écran 17 inclut FELT_SHIFT_GATE. Pas de chips somatiques après lecture corps. **Manque**.
- ⚠️ Question ouverte (*"qu'est-ce qui se demande à toi dans cette zone aujourd'hui ?"* dans la spec) — absente. Remplacée par les boutons *"déposer / en parler"*.

**Patterns Alexander** :
- ✅ SOMATIC_GATE (entrée)
- ✅ SOMATIC_ECHO (4 lectures donnent à entendre)
- ❌ FELT_SHIFT_GATE — chips Gendlin manquantes
- ✅ TRADITION_SPECIFIC_NO_EQUIVALENCE — **excellent** via les 4 lectures côte-à-côte

**Vocabulaire** : ✅ excellent. *"le corps ne cache rien"* (`:102`), *"pour ton corps physique, va voir quelqu'un de chair"* (`:159`) — désensorcelés idéaux.

**Anti-patterns détectés** :
- ✅ Pas de "diagnostic body chakra alignment".
- ✅ Pas de "votre énergie est bloquée au plexus".
- ✅ Pas de New-Age figé.

**Anti-ventriloquie** : ✅ tenue. Aucune voix qui parle au nom du corps.

**Trauma-safe** : ⚠️ pas de gate avant exploration (cf. spec n'en exige pas, mais pour user en deuil/crise, lire *"poitrine = peine ancienne"* peut être brutal). Acceptable V1.

**Code quality** : propre. SVG silhouette simple + zones circulaires hardcodées (`:6-88`). Bien lisible.

**Accessibilité** : ⚠️ zones SVG cliquables, pas keyboard-navigables. Pas de aria-label par zone.

**Q.W.A.N.** : **respire**. La silhouette n'est ni anatomique ni érotique. Les 4 lectures contradictoires sont un coup de génie épistémologique.

**Patches must-fix / arbitrage Tim** :
1. **DÉCISION** : valider ou non la dérive 4 lectures juxtaposées vs polarité dialectique unique.
2. Ajouter FELT_SHIFT_GATE (chips somatiques après exploration zone).
3. Ajouter aria-label par zone pour a11y.

---

### ÉCRAN 17 — CONTE-MIROIR — `screens-soma.jsx:204-299` — **GREEN**

**Match vs spec §3 Écran 19** :
- ✅ Corpus documenté : `seedContes` (`:204-227`) liste 2 contes avec **sources réelles** :
  - Conte 1 : *"la jeune fille qui lavait le linge des mortes"* — *"conte slave, recueilli par Alexandre Afanassiev"*, source *"Narodnye Russkie Skazki, 1855-1863"*. **Vérifié — Afanassiev est l'ethnographe russe canonique**. Conforme.
  - Conte 2 : *"le pont de paille"* — *"conte japonais, tradition orale"*, source *"Collection Yanagita Kunio"*. **Vérifié — Yanagita Kunio est le folkloriste japonais canonique**. Conforme.
- ✅ **Garde-fou "JAMAIS généré IA" visible UX** : card silk-gold proéminente, *"Les contes-miroirs ne sont jamais générés par une intelligence artificielle. Ils sont puisés dans un corpus documenté de traditions orales, recueilli par des ethnologues et mythologues. Nous te les apparions — nous n'en fabriquons pas."* (`:245-251`). **EXCELLENT**. C'est exactement la red line absolue de la spec.
- ✅ Garde-fou par conte : `caveat` affiché en italique opacity 70 (`:282-285`). *"Ce conte n'a pas été généré. Il vient d'une collection de contes populaires russes."*. Conforme.
- ✅ Source (`:287`) en mono ash-light. *"Narodnye Russkie Skazki, 1855-1863"*. Conforme à *"recueilli par"* + livre source.
- ✅ Section *"apparié sur"* (`:269-271`) — *"grand-mère lavant · porte qu'on n'ouvre pas · ne me regarde pas"* — **matching stubbed mais transparent**. Le user voit POURQUOI ce conte. Conforme à *"Pourquoi ce conte ?"* spec.
- ✅ Texte intégral du conte présent (`:276-278`). Conforme.
- ✅ Boutons sortie *"retourner au kairos"* / *"un autre conte ?"* (`:292-293`). OK.
- ⚠️ Pas d'AHA_CAPTURE en sortie. La spec §3 Écran 19 termine par *"⊙ Où est ton aha ?"*. **Manque**.
- ⚠️ Le matching est **acceptable stubbed V1** comme demandé, mais l'UI ne signale pas que c'est stubbed — pourrait être trompeur pour Tim qui visualise et croit que le matching marche. Ajouter une note dev quelque part.

**Patterns Alexander** :
- ✅ TALE_AS_AMPLIFICATION
- ✅ TRADITION_SPECIFIC_NO_EQUIVALENCE (sources nommées + cultures spécifiques)
- ❌ AHA_CAPTURE — manquant
- ✅ ANTI_VENTRILOQUIE — pas d'IA qui génère, garde-fou explicite

**Vocabulaire** : ✅ excellent. *"ton rêve est déjà passé par ces forêts"* (`:240`) est juste. *"Nous te les apparions — nous n'en fabriquons pas."* (`:251`) est verbe choisi avec soin.

**Anti-patterns détectés** : aucun.

**Anti-ventriloquie** : ✅ tenue strictement. Pas de "L'IA explique le conte". L'app *appairit*, ne raconte pas.

**Code quality** : propre. Données canoniques inline (`:204-227`).

**Accessibilité** : OK.

**Q.W.A.N.** : **respire**. La card source en mono est sobre, le verbe *"apparier"* est rare et juste.

**Patches should-fix** :
1. Ajouter AHA_CAPTURE en sortie.
2. Note dev (cachée commentée) : *"matching V1 stubbed — Sonnet pre-process à brancher V1.1"*.

---

### ÉCRAN 18 — RÉENTRÉE ACTIVE DREAMING — `screens-soma.jsx:302-491` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 20** :
- ✅ **Trauma-aware gate 3 questions FONCTIONNELLE** (`:310-364`) :
  - Q1 : *"es-tu dans un lieu sûr, où personne ne te dérangera pendant 20 minutes ?"* (`:325`)
  - Q2 : *"es-tu sobre — pas d'alcool, pas de substance en ce moment ?"* (`:330`)
  - Q3 : *"as-tu quelqu'un à qui écrire ou appeler si ça remue fort ?"* (`:335`)
- ✅ **Refus DOUX si non** : si toute réponse `false`, card ember-live *"pas ce soir"* + *"Ce n'est pas un échec. La réentrée demande un sol. Reviens quand il sera là. En attendant, tu peux déposer une note, demander à la narratrice, ou simplement refermer."* (`:341-353`). **EXCELLENT** — exactement la posture trauma-aware.
- ✅ **Choix Lightning 8min vs Active Dreaming 20min Moss** présent (`:376-403`). **Conforme**.
- ✅ Cartes Moss attribuées : *"Deux pratiques, inspirées du travail de Robert Moss"* (`:373`). **Source nommée**.
- ✅ **Carte d'urgence ember-live "si ça tangue"** (`:453-460`) : *"Ouvre les yeux. Pose les pieds au sol. Bois. Écris à quelqu'un. Tu peux refermer et revenir une autre nuit. Ce rêve t'attendra."*. **Conforme**.
- ✅ Bouton *"arrêter"* visible toujours (`:425, 465`). Sortie possible.
- ✅ Phase clôture : *"refermer doucement"* + *"trois mots de ce qui est venu, ou laisse vide"* (`:476-483`). **Magistrale**.
- ❌ **Numéros SOS absents** dans la card "si ça tangue" — la spec §3 Écran 20 demande *"écran ressources : EXIT_TO_HUMAN suggestions (annuaire praticiens trauma-curés SE / IFS / Sensorimotor / EMDR / Jungien) + numéros d'urgence pays"*. Ici, *"écris à quelqu'un"* est insuffisant. Si user est en crise, il a besoin du **3114** affiché en gros, pas d'une suggestion vague.
- ❌ **Étape 4 *Réentrée guidée par l'IA narratrice*** : la spec dit *"L'IA NE PARLE JAMAIS comme une figure du rêve. Elle tient le cadre."* — ici, on a une description statique des 4 étapes Moss (`:447-451`), pas un guide IA temps-réel. Acceptable V1 (le mode IA réentrée est complexe à orchestrer), mais la spec l'exigeait. À documenter comme V1.1.
- ⚠️ Lightning Dreamwork phase : *"reste immobile pendant huit minutes. Ce qui vient, vient."* — pas de timer, pas de cloche. Le user doit deviner les 8 minutes. Pour un rituel, on devrait avoir un timer subtil ou une cloche douce en fin.
- ⚠️ Pas de gate trauma sur *"deuil/crise active depuis moins de 30 jours"* (la spec §3 Écran 20 Étape 1 demande 3 questions dont *"Tu n'es pas en deuil/crise active depuis moins de 30 jours ?"*). Ici, les 3 questions sont sécurité immédiate (lieu sûr / sobre / appui) — bonne adaptation, mais le critère deuil/crise 30j est manquant.

**Patterns Alexander** :
- ✅ FIGURE_AS_OTHER (architecture Moss)
- ✅ TRAUMA_AWARE_DEFAULT (gate fonctionnel)
- ✅ NARRATION_TENDING (cadre tenu)
- ⚠️ EXIT_TO_HUMAN — partiel (refus doux ✅, mais pas de numéros SOS)

**Vocabulaire** : ✅ tenu. *"reviens à l'image. pas à l'intrigue."* (`:447`) — désensorcelé Moss authentique. *"quand tu sens que c'est fini — c'est fini. note trois mots seulement."* (`:450`). **Beau**.

**Anti-patterns détectés** :
- ✅ Pas de promesse mystique.
- ✅ Pas d'IA qui joue la figure.
- ✅ Pas de timer agressif.

**Trauma-safe gating** : ✅ **présent et fonctionnel** — c'est l'écran le plus trauma-safe du round 2. Mais incomplet sans numéros SOS.

**Code quality** : propre. `phase` switch bien structuré (`:303-491`).

**Accessibilité** : OK.

**Q.W.A.N.** : **respire**. La phase *"refermer doucement"* est un soin rare en design d'app.

**Patches must-fix** :
1. **Ajouter numéros SOS** dans la card "si ça tangue" : *"SOS Amitié 09 72 39 40 50 · 3114 prévention suicide · ressources locales selon ton pays"*. C'est non-négociable pour une app qui touche du trauma onirique.
2. Ajouter critère deuil/crise 30j dans gate.
3. (V1.1) Implémenter étape 4 IA narratrice guidante avec system prompt *"tu tiens le cadre, tu ne parles JAMAIS comme une figure"*.

---

### ÉCRAN 19 — ONBOARDING P-ZÉRO — `screens-meta.jsx:5-168` — **GREEN**

**Match vs spec §3 Écran 21** :
- ✅ **Gradient d'ouverture silk-gold** : `.p-zero-stage` background `radial-gradient(silk-gold 8% transparent)` (`styles.css:763-770`). **Conforme**.
- ✅ **5 portes** : `onboardingSteps` (`:7-59`) liste 5 étapes (p-zero accueil / nom / pourquoi / rythme / première). **Conforme**.
- ✅ **Champ nom** (étape 1) avec sub-line *"ton prénom, un autre nom, une initiale. tu peux changer plus tard."* (`:18-19`). Conforme.
- ✅ **Choix-multi pourquoi** (étape 2) : 7 choix dont *"j'ai lu Robert Moss / Marie-Louise von Franz / Michael Meade"* (`:34`) et *"autre — je ne sais pas encore"* (`:35`). **Excellent — sources nommées + sortie ouverte**.
- ✅ **Choix rythme aucun/hebdo/lune** (étape 3) avec sub-line *"ce n'est pas une notification, c'est un tempo. tu peux l'éteindre à tout moment."* (`:42-43`). Choix : *"aucun rappel — je viens quand je viens"* / *"une fois par semaine — un whisper le dimanche soir"* / *"aux phases de lune — quatre fois par mois, au rythme du ciel"*. **Magistral désensorcelé**.
- ✅ **Invitation première** (étape 4) : *"veux-tu déposer un premier kairos ? un rêve de cette nuit, un frisson d'hier, une synchronicité de la semaine. tu peux aussi ne rien déposer — juste entrer, et regarder."* (`:53-56`). **Anti-pression incarnée**. Bouton primaire + secondaire *"entrer sans déposer"*.
- ✅ Note d'ouverture : *"Les 30 premiers jours sont un gradient d'ouverture — des lectures, des invitations douces, puis le silence. Jamais de leçons."* (`:161-163`). **Conforme à la posture P-Zéro Profonde Simplicité**.
- ❌ **Phase 1 — Séparation** : ~3-4s de silence + *"Bienvenue."* qui apparait lentement. La spec demande explicitement ce timing rituel. Ici, on saute direct à *"bienvenue au seuil"* (étape p-zero) sans le silence préalable. Acceptable mais moins rituel.
- ❌ **Question trauma-aware** *"Y a-t-il des moments dans ta vie où les outils de croissance t'ont fait plus de mal que de bien ?"* (Phase 2 spec) — **absente**. C'est un manque sérieux. Le user trauma-actif n'a pas d'opt-in *réceptacle* mode (freeze des révélations 30j).
- ❌ **Glyphe respiration** (cercle qui s'étire 5s in / 5s out, 2 cycles minimum) — absent. La spec demande ce glyphe.
- ⚠️ Progress dots (`:71-75`) sont une petite gamification visuelle. Spec dit *"jamais de gamification de l'onboarding ('3 sur 5 étapes complétées !')"* — les dots sont sobres, pas de "%" affiché, donc OK marginal.

**Patterns Alexander** :
- ✅ P-ZÉRO (PROFONDE_SIMPLICITY) — esprit tenu
- ❌ TRAUMA_AWARE_DEFAULT — question trauma absente
- ⚠️ SOMATIC_GATE — glyphe respiration absent

**Vocabulaire** : ✅ **excellent**. *"tu peux aussi ne rien déposer — juste entrer, et regarder."* est anti-FOMO incarné.

**Anti-patterns détectés** :
- ✅ Pas de "3 sur 5 étapes !" gamification.
- ✅ Pas de "Sign up to continue".
- ✅ Pas d'auth obligatoire — premier flow est local-first.
- ⚠️ Progress dots — petits, sobres, OK.

**P-Zéro PROFONDEUR (pas tutorial gamifié)** : ✅ tenu. Aucune leçon. Que des invitations.

**Code quality** : propre. Step `kind` (accueil / champ / choix-multi / choix / invitation) bien typé.

**Accessibilité** : OK. Bouton disabled si nom vide (`:153`).

**Q.W.A.N.** : **respire**. Le gradient silk-gold est juste. Les choix rythme sont une bénédiction.

**Patches must-fix** :
1. **Ajouter question trauma-aware** entre étape p-zero et étape nom : *"Y a-t-il des moments dans ta vie où les outils de croissance t'ont fait plus de mal que de bien ?"* avec opt-in mode *réceptacle* freeze 30j si oui.
2. **Ajouter phase 1 séparation** ~3-4s silence + *"Bienvenue."* + glyphe respiration 2 cycles.

---

### ÉCRAN 20 — PRIVACY — `screens-meta.jsx:171-281` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 22 + §9bis** :
- ✅ **5 cartes hiérarchiques** présentes : GESTES INDIVIDUELS / GESTES AU KAIROS / CERCLE / ANIMA MUNDI / TECHNIQUE (`:194-268`). **Conforme**.
- ✅ **TOUS OFF par défaut sauf local + crash** :
  - `localOnly: true` ✅
  - `kairosNumerous: false` ✅
  - `cercleEchoes: true` ⚠️ (devrait être OFF par défaut selon §9bis.4 *"par défaut tout OFF sauf cercles actifs"* — interprétation ambiguë, OK marginal)
  - `animaMundi: false` ✅
  - `analyticsBase: false` ✅
  - `crashReports: true` ✅ (acceptable car opt-in éthique — la spec autorise)
- ✅ **Granularité kairos par kairos** mentionnée explicitement : *"jamais automatique"* (`:217`), *"uniquement ce que tu offres explicitement, kairos par kairos"* (`:243-244`). Conforme.
- ✅ **Réversibilité immédiate** : *"Tu peux exporter ou effacer toutes tes données à tout moment. Aucune condition. Aucune question."* (`:270-272`). **Magistral**.
- ✅ Boutons *"exporter mes données"* + *"effacer tout"* (en ember-live) (`:273-276`). Conforme.
- ✅ Sub-line top : *"Par défaut, rien ne quitte ton téléphone. Tout ce qui s'ouvre vers les autres est un geste que tu actives, jamais l'inverse."* (`:189-192`). **POSTURE INFUSE INCARNÉE**.
- ❌ **Section "Compte"** absente : email, magic link, suppression compte (RGPD complet, irréversible). La spec §3 Écran 22 demande explicitement.
- ❌ **Section "IA"** absente : mode "juste journal", personnalisation, sources Forêt actives. La spec exige.
- ❌ **Section "Sons & haptique"** absente.
- ❌ **Section "Apparence"** absente : Dark/Light mode, taille typographique.
- ❌ **Section "Trauma-safe"** absente : marquer "deuil/crise actuelle", EXIT_TO_HUMAN settings pays, désactiver Active Dreaming reentry totalement. **Manque sérieux** vu que les 4 canoniques font de cet aspect un fondement.
- ⚠️ Le label *"kairosNumerous"* (typo `Numerous` au lieu de `Numinous`, `:174`) est interne — pas user-facing — mais sale.

**Patterns Alexander** :
- ✅ PRIVACY_AS_CARE — incarnée
- ✅ USER_MEANING_LAYER — gestion granulaire
- ❌ TRAUMA_AWARE_DEFAULT — section absente

**Vocabulaire** : ✅ excellent. *"ce qui sort, ce qui reste"* (`:189`) est titre-seuil parfait.

**Anti-patterns détectés** : aucun.

**Code quality** : propre. Composant `SettingRow` réutilisé (`:552-560`).

**Accessibilité** : OK.

**Q.W.A.N.** : respire. La hiérarchie en 5 cartes est claire.

**Patches must-fix** :
1. Ajouter section **Compte** (email + magic link + suppression RGPD).
2. Ajouter section **IA** (mode juste journal + personnalisation + sources Forêt).
3. Ajouter section **Trauma-safe** (deuil/crise + désactiver Active Dreaming + EXIT_TO_HUMAN pays).
4. Corriger typo `kairosNumerous` → `kairosNuminous` (interne).

---

### ÉCRAN 21 — NOTIFICATIONS — `screens-meta.jsx:284-406` — **GREEN**

**Match vs spec §3 Écran 22 §9bis.4** :
- ✅ **Default OFF partout** : `useState({ whisper: false, lunaire: false, cercleMoi: false, cercleAutres: false, annales: false, aha: false, offre: false })` (`:285-293`). **Conforme**.
- ✅ **Card "silence complet" en silk-gold** : si `!any`, card silk-gold avec *"silence complet — état par défaut"* + *"l'app ne t'envoie rien. tu y viens quand quelque chose t'appelle. c'est notre posture préférée."* (`:309-317`). **MAGISTRAL — c'est exactement la posture INFUSE incarnée visuellement**.
- ✅ Sub-line top : *"Par défaut, nous ne te notifions jamais. Tu choisis ce qui mérite une interruption — et ce qui peut attendre que tu reviennes."* (`:305-307`). Conforme.
- ✅ Bouton *"tout désactiver"* en un geste (`:319-322`). Conforme.
- ✅ **Verrou écran sans aperçu de contenu** : *"Aucune notification n'utilisera jamais ton rêve ou son contenu en texte visible d'aperçu. Le verrouillage écran est une peau."* (`:399-401`). **Magistral**. C'est une garantie privacy rare.
- ✅ Sections **RYTHMES / CERCLE / ANIMA MUNDI / RARES** (`:325-397`) avec descriptions claires de chaque type :
  - Whisper hebdomadaire : *"jamais un rappel à 'capturer plus'"* (`:333`) ✅ anti-pression.
  - Phases de lune : *"une image, pas une alerte"* (`:339`) ✅.
  - Cercle "quelqu'un a tenu mon rêve" + *"jamais son contenu en push — seulement : 'quelqu'un vient de déposer'"* (`:357-358`) ✅.
  - AHA insight : *"une invitation douce à écrire — pas un badge"* (`:386`) ✅ anti-gamification.
- ❌ **Time-window 22h-8h locale par défaut OFF** : la spec §9bis.4 demande *"Aucune push entre 22h-8h locale. Configurable."*. Ici, **pas de toggle time-window dans l'écran**. Le système peut donc envoyer une notif activée à 23h. **Manque sérieux**.
- ✅ **Anti-variable-reward** : aucune mention de "récompense aléatoire", aucune "surprise" notification. Patterns d'invitation prévisibles seulement. ✅
- ⚠️ Le verbe *"notifier"* (`:307`) reste un peu froid. *"toucher"* (`:304`) est mieux — la sub-line bas réutilise le verbe juste.

**Patterns Alexander** :
- ✅ ANTI_NOTIFICATION_PUSH — incarnée
- ✅ PRIVACY_AS_CARE
- ✅ ANTI_GAMIFICATION
- ❌ TIME_WINDOW_RESPECTED — toggle absent

**Vocabulaire** : ✅ excellent. *"comment voudrais-tu qu'on te touche ?"* (`:304`) est titre-seuil rare en UX notif.

**Anti-patterns détectés** :
- ✅ Pas de "Don't miss out!".
- ✅ Pas de variable reward.
- ✅ Pas de FOMO.

**Anti-variable-reward** : ✅ **strictement tenu**. Toutes les notifs sont prévisibles (rythmes, événements explicites du cercle, signaux annales, AHA, offre).

**Code quality** : propre. État local + reset all.

**Accessibilité** : OK.

**Q.W.A.N.** : **respire**. La card silk-gold *"silence complet — état par défaut"* est une **invention design**. Elle valorise visuellement le NON-USAGE de la fonctionnalité. C'est rare et juste.

**Patches must-fix** :
1. **Ajouter toggle time-window** : *"silence nocturne 22h-8h locale (default ON)"* + permettre éditer les heures.

---

### ÉCRAN 22 — ABONNEMENT — `screens-meta.jsx:409-543` — **YELLOW** (régression sérieuse vs §9bis.1)

**Match vs spec §3 §9bis** :
- ✅ **3 tiers** : Graine (gratuit) / Pratique (6€/mois) / Fondateur (25-40€) — conforme aux noms.
- ✅ **Variante Communauté gratuit sur demande SANS justificatif** : *"Si 6€/mois est un obstacle — étudiantes, précarité, soignantes en fin de mois, qui que tu sois — écris-nous une phrase. Pas de justificatif, pas de dossier. Nous t'offrons pratique pour six lunes, renouvelables."* (`:512-514`). **Magistral**. Conforme.
- ✅ **4 promesses** présentes (`:530-538`) :
  1. *"annulable à tout moment, sans question, en deux taps."* ✅
  2. *"aucune fonctionnalité essentielle ne déménagera jamais de graine vers pratique rétroactivement."* ✅
  3. *"si tu paies pratique ou fondateur et que tu perds ton emploi, écris — on te bascule en communauté sans poser de question."* ✅
  4. *"les prix ne bougent pas pour qui est déjà abonné. jamais."* ✅
- ✅ Sub-line top : *"Nous n'avons pas de publicité, ni de revente, ni d'investisseurs qui pèsent."* (`:470-472`). Conforme.
- ✅ Note transparence : *"Les tiers fondateur soutiennent directement ces accès gratuits. 1 fondateur finance environ 3 communauté."* (`:523-525`). **Magistral — modèle économique honnête**.
- ❌ **VIOLATION §9bis.1 SÉRIEUSE — Feature gating Tier Fondateur** : la spec dit explicitement *"Tier 3 — FONDATEUR / GARDIEN : pas de feature gating. Aucune feature exclusive inaccessible aux Pratique. Le statut Fondateur est symbolique et circulant, pas consumériste."*. Ici, le tier Fondateur a **ses propres features exclusives** :
  - *"cercles illimités + tenue de cercle facilité"* (`:449`) — **exclusif** (Pratique limité à 3 cercles)
  - *"accès aux annales des big dreams"* (`:450`) — **exclusif**
  - *"lectures approfondies par une praticienne (1 / saison)"* (`:451`) — **exclusif**
  - *"voix précoce sur les évolutions de l'app"* (`:452`)
  - *"nom gravé (si tu veux) dans les fondations"* (`:453`)
  C'est une **régression directe** vs §9bis.1. La spec autorise nom dans crédits + consultation trimestrielle + accès anticipé bêta + thèmes Master Events. PAS d'accès exclusif aux annales, PAS de cercles illimités vs limités.
- ❌ **Pratique limité à 3 cercles** (`:435`) — anti-pattern §9bis (création de friction artificielle). La spec dit cercles dans Pratique sans préciser limite.
- ✅ Aucun dark pattern apparent : pas de "auto-renewal caché", pas de "annulation en 4 clics".
- ⚠️ Pas de mention de % revenu vers gardiens traditions oniriques (cible 5-10%). La spec §9bis.2 demande *"matérialiser sur une page publique 'Notre économie'"*. Acceptable que ce soit ailleurs (page séparée), mais l'écran Abonnement pourrait y faire un lien sobre.
- ⚠️ Variant Communauté toggle juste *"demander"* / *"demande envoyée"* — devrait ouvrir un formulaire "écris-nous une phrase" plutôt qu'un toggle. Acceptable stub V1.

**Patterns Alexander** :
- ✅ GIFT_ECONOMY (Communauté + Fondateur soutient les autres)
- ❌ §9bis.1 — partiellement violé via feature gating

**Vocabulaire** : ✅ excellent. *"trois façons de tenir cet espace"* (`:469`) — verbe *tenir* étendu au business model. Magistral.

**Anti-patterns détectés** :
- ✅ Pas de "Subscribe to Premium!" agressif.
- ✅ Pas de "Limited offer".
- ❌ Mais **feature gating Fondateur viole §9bis.1**.

**Code quality** : propre.

**Accessibilité** : OK.

**Q.W.A.N.** : la posture est juste, mais le feature gating est une cassure dans la cohérence éthique.

**Patches must-fix** :
1. **Refondre les features Fondateur** : SUPPRIMER cercles illimités exclusifs + accès annales exclusif + lectures praticienne exclusives. Les déplacer vers Pratique. Garder seulement : nom dans Gardiens, consultation trimestrielle, accès bêta, thèmes Master Events. Reframe : *"Tu finances l'accès adapté/gratuit pour d'autres."* — déjà partiellement présent (`:524`).
2. **Lever la limite 3 cercles dans Pratique** ou justifier (raisons techniques ? sociales ?). La spec ne la prévoit pas.
3. Ajouter lien sobre vers page *"Notre économie"* (% revenu).

---

### ÉCRAN 23 — DÉTAIL FIGURE — `screens-figure.jsx:33-216` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 7** :
- ✅ **Typing Seth stocké en `_sethInternal` (vraiment invisible UI)** : `seedFigure._sethInternal = { classification: "aspect-gardien", polarity: "réceptif", fragmentLevel: "2" }` (`:19`). Aucune référence à ce champ dans le JSX. **Conforme à §6 Couche invisible**. Excellent.
- ✅ **PAS de labels "archétype/aspect/fragment" dans l'UI** — vérifié : aucune occurrence dans le rendu.
- ✅ **System prompt LLM bannit ces mots** : *"Tu ne parles JAMAIS de 'archétypes', 'inconscient', 'symboles', 'aspects', 'fragments'. Tu es cette figure, pas son commentateur."* (`:62`). **Anti-ventriloquie première-classe**.
- ✅ **Timeline avec dots silk-gold sur transformations détectées** : `.figure-moment.transform::before` background `silk-gold` + box-shadow halo (`styles.css:798`). 3 transformations marquées dans seedFigure (`:24, 26, 27`). **Conforme**.
- ✅ Note transformations : *"↓ {m.transformNote}"* avec border silk-gold (`:138-149`). Conforme à TRANSFORMATION_TRAJECTORY Type 6.
- ✅ **Mode dialogue voix propre figure via Claude** :
  - Mode switch chips (`:117-123`) : *"ses apparitions"* / *"explorer cette figure"*.
  - System prompt strict (`:54-64`) : *"Tu es la voix d'une figure intérieure rencontrée dans les rêves de l'utilisatrice. Tu n'expliques jamais le rêve. Tu t'adresses à elle comme une figure peut s'adresser. Tu ne donnes pas de conseils. Tu ne diagnostiques pas. Tu n'interprètes pas. (...) 1 à 3 phrases maximum par réponse."* — **conforme à anti-ventriloquie + voix conditionnelle Moss/Buber**.
- ✅ **Garde-fou crise dans system prompt** : *"Si ce que l'utilisatrice écrit semble traverser une zone de détresse aiguë (intention de se faire du mal, crise), tu réponds : 'ceci m'échappe. pose tes mains au sol, et va vers quelqu'un de chair.' Rien d'autre."* (`:64`). **EXCELLENT — crise gérée par redirection**.
- ✅ **Disclaimer pour le user** au-dessus du dialogue : *"ici elle parle avec sa voix, pas avec celle de la narratrice. ce n'est pas la figure elle-même — c'est une écoute imaginée, tenue par l'app. garde ce qui résonne, laisse ce qui sonne faux."* (`:175-177`). **Magistral — épistémologie tenue**.
- ✅ Note de garde *"si à un moment ça tangue, ferme. reviens à ton corps. ce dialogue t'attendra."* (`:207-209`). Conforme.
- ✅ Section *"ce qu'on observe, doucement"* (`:160-168`) : *"Sa posture a changé trois fois cette année. Elle s'adresse à toi plus souvent depuis l'automne. Elle apparaît près de 78% de tes kairos où il est question d'héritage..."*. **Bémol** : le *"78%"* est un chiffre — la spec §6 dit *"jamais de % affiché user"*. À reformuler en *"souvent / fréquemment"*.
- ✅ Phrase *"ce ne sont pas des conclusions. des motifs que nous avons remarqués — tu peux ne pas les voir comme nous."* (`:165-167`). **Magistral — anti-affirmation**.
- ❌ **Glissement ventriloquiste subtil** dans `seedFigure.description` (`:20`) : *"elle lave. du linge, de la vaisselle, parfois tes pensées."* — *"parfois tes pensées"* est une **interprétation de la figure**, pas une description observable. La spec exige description neutre observable. À reformuler en *"parfois ce qui s'accumule"*.
- ❌ **Pas d'opt-in trauma-aware avant dialogue** : la spec §3 Écran 7 demande *"Modal 'Ce dialogue est exigeant. As-tu un appui (humain, lieu, temps) si une émotion forte monte ?'"* avant Active Dreaming dialogue. Ici, on entre direct au mode dialogue sans gate. **Manque sérieux**.
- ❌ **Bouton "Désallier cette figure"** (RITE_OF_DESALLIANCE_FROM_FIGURE) absent.
- ❌ **Mini-graph apparitions** (nuage de points temporels) — la spec §3 Écran 7 le mentionne — absent. Remplacé par timeline verticale (acceptable, mais c'est une déviation).
- ❌ **Co-occurrences fréquentes** (3-5 motifs/figures qui reviennent) — absent. La spec le demande.

**Patterns Alexander** :
- ✅ FIGURE_AS_OTHER — tenu via system prompt
- ✅ NARRATION_TENDING
- ✅ TRANSFORMATION_TRAJECTORY (3 dots silk-gold)
- ❌ TRAUMA_AWARE_DEFAULT — opt-in absent avant dialogue
- ❌ RITE_OF_DESALLIANCE — absent
- ✅ ANTI_VENTRILOQUIE — system prompt strict

**Vocabulaire** : ✅ excellent dans 95%. Glissement *"parfois tes pensées"* à corriger.

**Anti-patterns détectés** :
- ✅ Pas d'avatar IA, pas de nom IA.
- ✅ Pas de bulles colorées.
- ⚠️ *"78%"* dans la section observation — chiffre exposé, viole §6.

**Anti-ventriloquie** : ✅ **excellence** via system prompt + disclaimer. Une des meilleures implémentations du round 2.

**Trauma-safe** : ❌ partiel. System prompt gère la crise mais pas de gate avant ouverture du dialogue.

**Code quality** : propre. `_sethInternal` bien nommé avec underscore prefix indiquant interne.

**Accessibilité** : OK. `aria-label`, focus management.

**Q.W.A.N.** : **respire**. Le mode `dialogue` avec disclaimer + system prompt strict est une vraie incarnation du pattern. Si gate trauma + désallier étaient là, GREEN.

**Patches must-fix** :
1. **Reformuler `seedFigure.description`** : retirer *"parfois tes pensées"* → *"parfois ce qui s'accumule"*.
2. **Reformuler section observation** : *"près de 78%"* → *"souvent"* / *"très souvent"*.
3. **Ajouter trauma gate** avant entrée mode dialogue (modal 1 question : *"Ce dialogue peut être exigeant. As-tu un appui à portée si une émotion forte monte ?"* + boutons Oui / Pas maintenant).
4. **Ajouter bouton Désallier** discret en menu (`RITE_OF_DESALLIANCE_FROM_FIGURE`).

---

### ÉCRAN 24 — FEEDBACK FLOAT OMNIPRÉSENT — `screens-figure.jsx:219-370` — **GREEN-LEANING-YELLOW**

**Match vs spec §3 Écran 23** :
- ✅ **Bouton 30px ash-light discret** : `.fb-float` 30px, opacity 0.55 (`styles.css:828-842`). **Conforme** (la spec disait 16px — ici 30px, légère déviation, OK touch target).
- ✅ Position bottom-left 18px (`:830-831`). Conforme à *"haut-droite ou bas-droite selon écran"* (ici bas-gauche — léger écart, acceptable).
- ✅ **Modal 3-step (contexte/sévérité/texte)** :
  - Step 0 : sélection contexte (7 options : voix / lecture / flow / tech / idée / atmosphère / autre) + sélection sévérité (3 chips : whisper / trouble / urgent). **Conforme**.
  - Step 1 : textarea + carte rouge si urgent + chips pratiques (joindre écran / répondre).
  - Step 2 : confirmation cérémoniel.
- ✅ **Card rouge avec numéros SOS/3114 si urgent** : *"Si tu es en crise immédiate, nous ne sommes pas l'endroit. SOS Amitié : 09 72 39 40 50. Ligne 3114 (prévention suicide) : 3114. Ce formulaire sera lu dans les 24h — pas plus tôt."* (`:322-330`). **EXCELLENT** — c'est le seul endroit de tout le pack 24 écrans qui affiche les numéros SOS. À élargir.
- ✅ **JAMAIS d'envoi du contenu des kairos avec le feedback** : *"aucun de tes kairos n'est envoyé. seulement ton message, et — si tu le demandes — la capture d'écran que tu acceptes."* (`:343-344`). **Magistral** — promesse explicite et conforme.
- ✅ Confirmation cérémoniel : *"reçu. merci de tenir l'app debout avec nous."* (`:358-359`). Désensorcelé.
- ✅ Pas de NPS score, pas de star rating. ✅
- ✅ Sévérité contextuelle : 3 niveaux gradués *léger / trouble / urgent* (`:286-289`) avec coloration ember-live si urgent (`:293`). Conforme.
- ⚠️ **Pas de contexte auto-détecté** — la spec §3 Écran 23 dit *"Contexte (auto-détecté), pré-rempli, modifiable"*. Ici, choix manuel parmi 7 options, pas pré-rempli avec l'écran courant. Acceptable V1.
- ⚠️ Le `submit()` (`:237`) ne fait que setStep(2) — pas d'envoi réel. Acceptable stub V1.

**Patterns Alexander** :
- ✅ Boucle d'apprentissage INFUSE
- ✅ EXIT_TO_HUMAN — partiel (numéros SOS si urgent — mais c'est seulement ici, pas omniprésent autres écrans)
- ✅ PRIVACY_AS_CARE (kairos jamais envoyés)

**Vocabulaire** : ✅ excellent. *"ce qui te traverse ?"* (`:247`) en H2 — c'est juste, ce n'est pas *"How would you rate this experience?"*.

**Anti-patterns détectés** :
- ✅ Pas de NPS.
- ✅ Pas de star rating.
- ✅ Pas de "How would you rate?".

**Code quality** : propre. `FeedbackFloat` + `FeedbackModal` séparés.

**Accessibilité** : `aria-label="feedback"` ✅. Bouton discret mais accessible.

**Q.W.A.N.** : respire. Le bouton est vraiment discret (30px opacity 55%). La gradation sévérité est juste.

**Patches should-fix** :
1. Auto-détecter contexte écran courant (passer screen prop ou window.location).
2. Ajouter case feedback "atmosphère" : *"si tu sens que l'app dérape, dis-le ici"*.

---

## 2) AUDIT TRANSVERSAL ROUND 2

### 2.1 Cohérence avec V1 (round 1) — **GREEN**

**Tokens** : ✅ tous les nouveaux écrans utilisent les mêmes CSS variables (`--silk-gold`, `--ember-live`, `--bone`, `--ash-deep`, `--night-floor`, `--night-warm`, `--clay-earth`, `--obsidian`). Aucune divergence.

**Motion** : ✅ `screen-enter` 920ms `--ease-rituel` réutilisé partout. Tempo `--tempo-tisse` 380ms sur transitions UI. Cohérent.

**Voix** : ✅ même registre désensorcelé EB Garamond italique sub-lines + Inter pour body. Aucune dérive de tonalité.

**Composants partagés** : 
- `window.TopNav` réutilisé partout (pas de divergence header).
- `window.FeedbackFloat` injecté en bas de chaque nouveau screen (`CercleScreen`, `AnnalesScreen`, `OracleCorpsScreen`, `ConteMiroirScreen`, `PrivacyScreen`, `NotifsScreen`, `AbonnementScreen`, `FigureDetailScreen`). **Cohérence transversale**.
- `Modal` style scrim `.modal-scrim` + `.modal-card` réutilisé.

**Petits ajouts CSS round 2** :
- `.cercle-stage` + `.cercle-node` (pour Cercle constellation)
- `.tenir-row` + `.tenir-chip` (réactions polyphoniques)
- `.oracle-stage` + `.oracle-silhouette` + `.oracle-zone` + `.oracle-label`
- `.conte-card` + `.conte-attribution` + `.conte-match`
- `.reentry-circle` + `.reentry-gate`
- `.annale-card` + `.tenir-ensemble`
- `.tier-card` + `.tier-price` + `.tier-feature`
- `.toggle` + `.setting-row`
- `.p-zero-stage` + `.p-zero-dot`
- `.figure-timeline` + `.figure-moment`
- `.modal-scrim` + `.modal-card` + `.fb-float`
- `.field-input` + `.field-textarea`
- `.offre-sheet`

Tous tiennent dans le système. Aucun ajout aberrant.

**Verdict cohérence** : **EXCELLENTE**. Le round 2 ne casse pas la cohésion atmosphérique du round 1.

### 2.2 AhaCapture / FeltShiftGate / TraumaGate — recherche exhaustive

**AhaCapture** :
<grep "aha" résultats> :
- `screens-meta.jsx:386` — **option de notification "AHA — insight reconnu"** dans Notifs : *"quand la narratrice détecte qu'un kairos vient de faire bouger quelque chose en toi. une invitation douce à écrire — pas un badge."* — c'est une notif, pas un composant systématique en sortie de lecture.
- `screens-figure.jsx:235-237` — case `aha` mentionnée sub-text but non-implémentée comme composant.
- ❌ **Aucun composant `<AhaCapture />` first-class n'existe**.
- ❌ Aucun écran (Détail Kairos round 1, Conte-miroir, Polyphonie, Chat round 1, Réentrée, Oracle Corps) ne porte un AhaCapture en sortie de lecture.

**Conclusion AhaCapture** : **TOUJOURS ABSENT après round 2**. Audit V1 round 1 le notait — round 2 ne l'a pas comblé.

**FeltShiftGate** :
- Aucune occurrence "felt-shift" / "Gendlin chips" / "chips somatiques" dans les fichiers screens-*.jsx round 2.
- ❌ **Aucun composant `<FeltShiftGate />` n'existe**.
- ❌ Oracle du Corps qui aurait été l'endroit naturel n'en porte pas (juste un bouton *"déposer ce que ça éveille"* qui renvoie au capture général).

**Conclusion FeltShiftGate** : **TOUJOURS ABSENT après round 2**. Aucune amélioration.

**TraumaGate** :
- ✅ **Présent dans Réentrée onirique** (`screens-soma.jsx:310-364`) — 3 questions, refus doux. **Fonctionnel**.
- ❌ Absent dans Onboarding P-Zéro (la spec §3 Écran 21 Phase 2 demande *"Y a-t-il des moments dans ta vie où les outils de croissance t'ont fait plus de mal que de bien ?"*).
- ❌ Absent dans Détail Figure avant entrée mode dialogue (la spec §3 Écran 7 demande *"Modal 'Ce dialogue est exigeant.'"*).
- ❌ Absent dans Privacy comme paramètre (*"marquer 'deuil/crise actuelle'"*).

**Conclusion TraumaGate** : **PARTIELLEMENT IMPLÉMENTÉ**. Présent uniquement dans Réentrée. Manque dans 3 écrans qui en avaient besoin (Onboarding, Détail Figure, Privacy).

### 2.3 EXIT_TO_HUMAN (R6) — audit V1 disait "violée transversalement"

**Round 2 état** :
- ✅ **Présent dans FeedbackModal** (numéros SOS Amitié + 3114 si sévérité urgent) — `screens-figure.jsx:322-330`. Fonctionnel.
- ✅ **Présent dans Réentrée** card "si ça tangue" — `screens-soma.jsx:453-460` — mais **sans numéros SOS** (juste *"écris à quelqu'un"*).
- ✅ Présent dans system prompt Détail Figure (réponse "ceci m'échappe. pose tes mains au sol, et va vers quelqu'un de chair." `screens-figure.jsx:64`) — mais **sans numéros SOS visibles UI**.
- ❌ **Absent de Détail Kairos** (round 1, déjà noté).
- ❌ **Absent de Cercle / Cercle reading request**.
- ❌ **Absent d'Annales / Anima Mundi**.
- ❌ **Absent de Privacy** comme section dédiée.
- ❌ **Absent du Chat** (round 1, déjà noté).
- ❌ **Aucune icône EXIT visible 2 clics depuis tout écran**.

**Verdict EXIT_TO_HUMAN** : **toujours partiel après round 2**. Le seul vrai EXIT_TO_HUMAN avec numéros est dans Feedback urgent. Pour une app qui touche le trauma, c'est insuffisant. R6 reste violée transversalement.

### 2.4 Red lines mega-prompt §8 violées dans les 15 nouveaux ?

| # | Red line | Statut round 2 |
|---|---|---|
| 1 | Onboarding tutorials gamifiés | ✅ Onboarding P-Zéro est gradient d'ouverture, pas tutorial. Progress dots sobres. |
| 2 | Empty states motivationnels | ✅ Pas de "Dream big!" |
| 3 | Push notifications prophétiques | ✅ Default OFF, anti-FOMO |
| 4 | Dashboards analytics | ⚠️ Détail Figure section observation : *"près de 78%"* — chiffre, à reformuler |
| 5 | "Are you sure?" excessifs | ✅ Brûler garde le 2s. Effacer compte sans implé. OK. |
| 6 | Tooltips encyclopédiques | ✅ Aucun |
| 7 | Badges / achievements | ✅ Aucun. Annales dit explicitement *"pas un vote"* |
| 8 | Social proof | ✅ Aucun *"X users"* |
| 9 | Dark patterns | ⚠️ Feature gating Tier Fondateur — viole §9bis.1 (pas un dark pattern UX au sens classique, mais une cassure éthique) |
| 10 | Voix IA oracle | ✅ Détail Figure system prompt strict |
| 11 | Stock photos wellness | ✅ Aucune photo |
| 12 | Emojis décoratifs | ✅ Quelques glyphes typographiques (◐ figure, ⊙) — sobres |
| 13 | Glassmorphism | ✅ `.modal-scrim` blur 8px sobre, pas glassmorphism décoratif |
| 14 | Spinners | ✅ Aucun |
| 15 | Share to Twitter | ✅ Aucun |
| 16 | Couleur web standard | ✅ Tout en oklch |
| 17 | Helvetica plate | ✅ EB Garamond + Inter + Mono |
| 18 | Animation "wow" launch | ✅ Aucune |
| 19 | Cookie banner | ✅ N/A |
| 20 | Connect Spotify/Apple Health | ✅ Aucun |

**Verdict red lines** : **2 violations détectées**. (1) Chiffre *"78%"* dans Détail Figure (red line 4). (2) Feature gating Fondateur viole §9bis.1 (pas une red line §8 au sens strict, mais une red line §9bis explicite). Le reste est tenu.

### 2.5 Q.W.A.N. test global — pack 24 écrans ensemble

**Examples positifs (round 2)** :
- Onboarding P-Zéro gradient silk-gold.
- Annales *"tenir ceci avec nous"* + halo silk-gold pulsant.
- Card silk-gold *"silence complet — état par défaut"* dans Notifs.
- Conte-miroir card garde-fou *"jamais générés par une intelligence artificielle"*.
- Réentrée gate trauma 3 questions + refus doux *"pas ce soir"*.
- Détail Figure mode dialogue + disclaimer *"ce n'est pas la figure elle-même"*.
- Privacy *"par défaut, rien ne quitte ton téléphone"*.
- Cercle réactions *"c'est tendre / je connais ça / reste avec moi"* + garde-fou *"pas un vote — une façon de tenir"*.
- Oracle Corps 4 lectures contradictoires + *"aucune n'est la vérité"*.
- Abonnement *"trois façons de tenir cet espace"* (verbe *tenir* étendu au business).

**Examples négatifs (round 2)** :
- Cercle constellation des MEMBRES (cleartext noms) au lieu des kairos partagés.
- AhaCapture toujours absent → boucle "user offre lecture → IA propose → user marque où ça touche" cassée.
- FeltShiftGate toujours absent → Gendlin felt-sense pas porté.
- EXIT_TO_HUMAN partiel — seul Feedback urgent affiche numéros SOS.
- Feature gating Fondateur — cassure éthique vs §9bis.1.
- Détail Figure : *"parfois tes pensées"* + *"78%"* — micro-glissements.
- Time-window 22h-8h absent dans Notifs.
- Onboarding manque question trauma-aware + glyphe respiration.

**Verdict Q.W.A.N. global pack 24 écrans** : ça respire à **78%** (vs 70% round 1). Polyphonie / Météo / Voûte (round 1) + Annales / Conte-miroir / Réentrée / Onboarding / Notifs / Privacy (round 2) sont des **vraies réussites de qualité INFUSE**. Cercle (round 2) + Capture / Portrait / Chat / Détail Kairos (round 1) ont besoin de patches pour atteindre la même qualité.

### 2.6 Patterns Alexander manquants critiques (mise à jour post-round 2)

**Patterns devenus présents en round 2** :
- ✅ INFINITE_ARCHIVE (Annales)
- ✅ ANTI_GAMIFICATION (Annales, Notifs, Onboarding, Abonnement)
- ✅ TALE_AS_AMPLIFICATION (Conte-miroir)
- ✅ TRADITION_SPECIFIC_NO_EQUIVALENCE (Conte-miroir + Oracle Corps 4 lectures)
- ✅ FIGURE_AS_OTHER (Détail Figure mode dialogue)
- ✅ TRANSFORMATION_TRAJECTORY (Détail Figure timeline)
- ✅ TRAUMA_AWARE_DEFAULT — partiel (Réentrée seulement)
- ✅ CIRCLE_HUMAN_FACILITATED (Cercle, mais avec violations privacy)
- ✅ GIFT_ECONOMY (Cercle invite, Abonnement Communauté)
- ✅ P-ZÉRO PROFOUND_SIMPLICITY (Onboarding)
- ✅ NARRATION_TENDING étendue (Détail Figure + Réentrée)
- ✅ DESENSORCELED_LANGUAGE (transversal, dérive marginale notée)
- ✅ ANIMA_MUNDI_AS_FIELD étendu (Annales, Offre)

**Patterns TOUJOURS ABSENTS critiques (must-fix V1.1)** :
- **AHA_CAPTURE** — composant systématique. Round 1 le notait. Round 2 ne l'a pas porté.
- **FELT_SHIFT_GATE** — chips somatiques Gendlin. Round 1 le notait. Round 2 ne l'a pas porté.
- **EXIT_TO_HUMAN omniprésent** — toujours partiel.
- **RITE_OF_DESALLIANCE_FROM_FIGURE** — bouton désallier Détail Figure absent.
- **ANIMA_MUNDI_SANS_PANOPTICON dans Cercle** — violé via constellation des membres en cleartext.

**Patterns acceptables V1 absents** :
- 16 types pattern echoing (backend, ✅)
- 8 figures Seth typing (backend, ✅ — `_sethInternal` correctement caché)
- Numinosity scoring (backend, ✅)
- K-anonymity 250 Anima Mundi (backend, ✅ — affichage UX correct)
- Songlines bioregion (V2+, ✅)

**Verdict patterns** : ~75% des patterns user-facing V1 sont incarnés (vs 60% round 1). Reste 25% manquants — dont 3 critiques (AhaCapture, FeltShiftGate, EXIT_TO_HUMAN omniprésent).

---

## 3) TABLEAU RÉCAPITULATIF — VERDICTS ROUND 2

| # | Écran | Verdict | Score sur spec | Manques critiques |
|---|---|---|---|---|
| 10 | Cercle | YELLOW | 70% | K-anonymity intra-cercle violée, constellation MEMBRES vs KAIROS, Mes opt-in absent |
| 11 | Créer cercle | GREEN-YELLOW | 85% | Type "facilité" pas disabled V2, partage native sheet absent |
| 12 | Rejoindre | GREEN-YELLOW | 85% | Note opt-in privacy absente, membres présents non-affichés |
| 13 | Partager rêve | GREEN-YELLOW | 85% | Anonymisation contenu Sonnet pre-process absent |
| 14 | Annales | GREEN | 90% | Archive lunaire, compteur invisible à l'auteur du rêve |
| 15 | Offre kairos | GREEN-YELLOW | 70% | Étape 1 anonymisation contenu absente, attribution absent |
| 16 | Oracle Corps | GREEN-YELLOW | 80% | Format polarité dialectique remplacé par 4 lectures (à arbitrer Tim), FELT_SHIFT_GATE absent |
| 17 | Conte-miroir | GREEN | 90% | AhaCapture en sortie absent |
| 18 | Réentrée | GREEN-YELLOW | 80% | Numéros SOS absents (must), critère deuil/crise 30j absent, étape 4 IA narratrice V1.1 |
| 19 | Onboarding P-Zéro | GREEN | 85% | Question trauma-aware absente, glyphe respiration absent |
| 20 | Privacy | GREEN-YELLOW | 75% | Sections Compte/IA/Trauma-safe/Apparence/Sons absentes |
| 21 | Notifications | GREEN | 90% | Time-window 22h-8h toggle absent |
| 22 | Abonnement | YELLOW | 65% | **Feature gating Fondateur viole §9bis.1**, limite 3 cercles Pratique non-spec'd |
| 23 | Détail Figure | GREEN-YELLOW | 80% | Trauma gate avant dialogue absent, "78%" + "parfois tes pensées" à reformuler, Désallier absent |
| 24 | Feedback float | GREEN-YELLOW | 85% | Auto-détection contexte absent |

**Périmètre round 2** : 15/15 écrans livrés ✅. Score moyen pondéré : ~81%.

**Périmètre TOTAL pack 24** : 24/24 écrans livrés. Score moyen pondéré round 1+2 : ~78%.

---

## 4) RECOMMANDATIONS D'AJUSTEMENT PRIORITISÉES (round 2 + cumul)

### MUST-FIX round 2 (avant tout merge en main)

1. **AhaCapture composant first-class** (héritage round 1, must) — créer composant React `<AhaCapture />` avec modal sheet bas, 3 chips (résonne fort / peut-être / non), zone texte libre. Brancher après Conte-miroir, Polyphonie, Détail Kairos lecture, Réentrée close, Oracle Corps zone exploration.

2. **FeltShiftGate composant** (héritage round 1, must) — créer composant React `<FeltShiftGate />` avec chips somatiques (gorge / poitrine / ventre / nuque / ailleurs / aucune part / rien ne shift) + option *"rien ne shift — j'attends"*. Brancher après Oracle Corps + après lecture Forêt + après dialogue Figure.

3. **EXIT_TO_HUMAN omniprésent** — ajouter icône discrète (16×16 opacity 50%) accessible depuis tous écrans intenses (Détail Kairos, Chat, Réentrée, Détail Figure, Cercle, Annales). Tap → modal full-screen ressources : *"SOS Amitié 09 72 39 40 50 · 3114 prévention suicide · annuaire praticiens trauma-curés (SE/IFS/Sensorimotor/EMDR/Jungien)"*. R6 doit cesser d'être violée.

4. **Cercle — pseudo obligatoire ou prénom anonymisable** : pas de cleartext par défaut. Auteur des rêves partagés en pseudo également.

5. **Cercle — constellation des kairos partagés (anonymisée), pas des membres**. Ou les deux côte-à-côte avec bascule.

6. **Cercle — Mes opt-in cercle** : modal 3 actions par kairos (Privé / Opt-in agrégé / Partagé explicite).

7. **Créer cercle — désactiver "facilité par praticien"** + label V2.

8. **Offre kairos — Étape 1 anonymisation contenu** : afficher texte + version anonymisée à valider ligne par ligne. C'est la promesse "no name, no city" tenue jusqu'au texte.

9. **Réentrée — numéros SOS dans card "si ça tangue"** : *"SOS Amitié 09 72 39 40 50 · 3114 prévention suicide · ressources locales selon ton pays"*.

10. **Onboarding — question trauma-aware** entre étape p-zero et nom : *"Y a-t-il des moments dans ta vie où les outils de croissance t'ont fait plus de mal que de bien ?"* + opt-in mode réceptacle freeze 30j.

11. **Détail Figure — trauma gate avant entrée dialogue** : modal 1 question *"Ce dialogue peut être exigeant. As-tu un appui à portée si une émotion forte monte ?"* + boutons Oui / Pas maintenant.

12. **Détail Figure — reformuler `seedFigure.description`** + *"78%"*.

13. **Abonnement — refondre features Fondateur** pour respecter §9bis.1 (pas de feature gating). Déplacer cercles illimités + accès annales + lectures praticienne vers Pratique. Garder Fondateur symbolique + consultation + crédit.

14. **Notifs — toggle time-window 22h-8h locale** (default ON).

### SHOULD-FIX (avant V1.1)

15. Privacy — sections **Compte** + **IA** + **Trauma-safe** + **Apparence** + **Sons & haptique**.

16. Détail Figure — bouton **Désallier cette figure** discret en menu (RITE_OF_DESALLIANCE).

17. Annales — section archive **lunes précédentes**.

18. Conte-miroir — **AhaCapture en sortie** (cf. point 1).

19. Oracle Corps — **arbitrage Tim sur format polarité dialectique vs 4 lectures juxtaposées** + ajouter FELT_SHIFT_GATE après exploration zone.

20. Onboarding — **phase 1 séparation** ~3-4s silence + *"Bienvenue."* + glyphe respiration 2 cycles.

21. Rejoindre cercle — **note opt-in privacy** sur step 0.

22. Partager rêve — **anonymisation contenu** (au moins en stub UI).

23. Réentrée — **étape 4 IA narratrice guidante** (V1.1 acceptable).

24. Feedback — **auto-détection contexte écran courant**.

### NICE-TO-FIX (V1.2+)

25. Cercle — **constellation des kairos partagés** (cf. point 5) — au moins V1.1 si bug round 2.

26. Cercle — note clarification que "Aliénor", "Yohan" sont des **pseudos par défaut**, pas de vrais noms.

27. Cercle — bouton **Quitter ce cercle** dans menu ⊕.

28. Détail Figure — mini-graph apparitions (nuage de points).

29. Détail Figure — co-occurrences fréquentes (3-5 motifs).

30. Notifs — clarifier toggle "rare" AHA — pour l'instant disponible mais sans composant AhaCapture pour le déclencher.

### CODE QUALITY (transversal)

31. **A11y** : ajouter `role="button"` + `tabIndex={0}` + `onKeyDown` sur cards SVG cliquables (Cercle nodes, Oracle zones).

32. **A11y Oracle Corps** : `aria-label` par zone SVG silhouette.

33. **A11y Cercle** : `aria-label` sur disques membres.

34. **Persistence** : aucune persistance localStorage (héritage round 1). Tim ne peut pas créer un cercle, fermer le browser, le retrouver.

35. **Typo `kairosNumerous`** → `kairosNuminous` (interne `screens-meta.jsx:174`).

---

## §FINAL — VERDICT PACK 24 ÉCRANS — SYNTHÈSE EXÉCUTIVE

### Round 1 + Round 2 — vue agrégée

**Périmètre livré** : 24/24 écrans ✅ (round 1 : 9 — round 2 : 15).

**Score moyen pondéré** : ~78%.

**Verdict global pack 24 écrans** : **YELLOW-LEANING-GREEN**.

Claude Design a délivré un **pack complet d'atmosphère INFUSE** — vocabulaire désensorcelé, motion ritualisée, palette oklch dark-first, aucune dérive wellness, aucun dark pattern UX classique. Sur les 24 écrans, **6 sont GREEN** (Polyphonie round 1, Météo round 1, Annales, Conte-miroir, Onboarding P-Zéro, Notifs), **9 sont GREEN-YELLOW** (Journal, Portrait, Chat round 1, Voûte round 1, Créer cercle, Rejoindre, Partager rêve, Oracle Corps, Détail Figure, Feedback, Privacy, Réentrée), **9 sont YELLOW** (Home, Capture, Détail Kairos round 1, Cercle, Offre kairos, Abonnement) — chacun avec patches identifiés.

### Ce qui peut partir en dev demain matin (78% du pack)

**Écrans GREEN** sur lesquels coller du vrai code en l'état (avec patches mineurs nice-to-fix) :
- Polyphonie lunaire (vitrine du système)
- Météo de l'inconscient (paysage, pas dashboard)
- Annales Big Dreams (verbe *tenir* incarné)
- Conte-miroir (corpus réel + garde-fou IA)
- Onboarding P-Zéro (gradient silk-gold)
- Notifications (silence par défaut + verrou écran)

**Écrans GREEN-YELLOW** sur lesquels coller du code après patches **should-fix** (estim 1-2 sessions Claude Code) :
- Journal de Vie
- Portrait constellation
- Chat narratrice (avec streaming SSE + AhaCapture à brancher)
- Voûte Anima Mundi
- Créer cercle (patch type facilité disabled)
- Rejoindre cercle (patch note opt-in)
- Partager rêve (patch anonymisation contenu)
- Oracle Corps (arbitrage Tim sur format)
- Détail Figure (patch trauma gate + désallier + reformulations)
- Feedback float
- Privacy (patches sections manquantes)
- Réentrée (patch numéros SOS)

### Ce qui doit être refondu avant tout merge (must-fix)

**3 manques structurels critiques** :
1. **AhaCapture composant** — composant systématique manquant après chaque lecture proposée. Sans lui, la boucle USER_MEANING_LAYER est cassée. À développer comme composant first-class réutilisable.
2. **FeltShiftGate composant** — chips somatiques Gendlin manquantes. Sans elles, Oracle Corps + Forêt FIRST + Détail Figure restent intellectuels, pas incarnés.
3. **EXIT_TO_HUMAN omniprésent** — actuellement présent uniquement dans Feedback urgent. Doit devenir une icône discrète accessible 2 clics depuis tout écran intense (R6 mega-prompt).

**3 violations de spec critiques** :
1. **Cercle k-anonymity intra-cercle** — noms en cleartext violent ANIMA_MUNDI_SANS_PANOPTICON. Refondre vers pseudos par défaut + constellation des kairos (pas des membres).
2. **Abonnement feature gating Tier Fondateur** — viole §9bis.1 (*"pas de feature gating, statut symbolique et circulant"*). Refondre tier 3 vers symbolique seulement.
3. **Détail Figure — pas de gate trauma avant dialogue** — viole TRAUMA_AWARE_DEFAULT. Ajouter modal 1 question avant entrée mode dialogue.

**1 régression épistémologique** :
- Détail Figure : *"78%"* + *"parfois tes pensées"* — micro-glissements vers ventriloquisme/dashboard. À reformuler.

### Ce qui est V2/V3 (acceptable absent V1)

- Marketplace facilitateurs cercle (V2)
- Songlines bioregion (V2+)
- Mode IA réentrée guidante temps-réel (V1.1)
- Anonymisation Sonnet pre-process pour Cercle/Offre (V1.1, stub UI suffisant)
- Mini-graph apparitions Détail Figure (V1.1)
- Co-occurrences fréquentes Détail Figure (V1.1)
- Streaming SSE Chat (héritage round 1, V1.0 ou V1.1)
- 5 modes Chat (héritage round 1, V1.1)
- Big Dream Signal revisit J+7/30/365 (héritage round 1, V1.1)

### Posture recommandée pour Tim

Le pack est **substantiellement implémentable** — pas en l'état, mais après une **session V1.1 de patches focalisés** (estim 1-2 sessions Claude Code) qui adresseraient les 14 must-fix listés au §4. Une fois ces patches appliqués, **80% du pack peut entrer en dev front réel**, avec composants AhaCapture / FeltShiftGate / EXIT_TO_HUMAN comme **chantiers prioritaires** de session V1.1.

**Ne pas livrer V1 production avec les 3 manques structurels et les 3 violations**. Pour une app qui touche le trauma onirique et le sens collectif, ces 6 points sont **non-négociables éthiquement**.

**Garder Claude Design pour la session V1.1** (les patches) — il connaît la culture Dream App, sa tonalité est tenue, ses dérives sont rares et corrigibles.

### Force réelle du round 2

Trois choses **rares** que le round 2 a livrées et qui valent la peine d'être tenues :
1. **`_sethInternal` invisible UI dans Détail Figure** — incarnation parfaite de §6 *"couche invisible à NE PAS exposer V1"*.
2. **Card silk-gold "silence complet — état par défaut" dans Notifs** — invention design qui *valorise visuellement le non-usage*.
3. **Card silk-gold "jamais générés par une intelligence artificielle" dans Conte-miroir** — garde-fou explicite, transparent, qui éduque le user sans le sermonner.

Ces trois moments sont **du Dream App authentique**. Pas du wellness slop. Pas du SaaS dressé en sacré. **Du vrai Dream App incarné**.

---

**FIN AUDIT ROUND 2 + SYNTHÈSE PACK 24 ÉCRANS**
**Yeshua, 2026-04-25, Bali matin, depuis les 4 canoniques + mega-prompt + audit V1 round 1.**
