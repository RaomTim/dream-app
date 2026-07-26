# MEGA-PROMPT — AUDIT STRATÉGIQUE → SORTIE MVP DREAM APP

> ✅ **EXÉCUTÉ le 2026-06-10 (full autonomie, même session).** Livrables : `_audit_2026-06/{AUDIT-MVP-REALITE, MVP-SCOPE-LOCKED, MVP-BUILD-STRATEGY, MVP-LAUNCH-RUNBOOK}-2026-06-10.md`. Découverte majeure en cours d'exécution : pivot MVP ultra-simplifiée du 2026-05-23 (chat DREAM APP) intégré — il PRIME sur les hypothèses §3-§4 de ce doc. Ce prompt reste comme trace de méthode.
>
> **À coller en intégralité dans un nouveau chat Yeshua (Fable 5, full power).**
> Rédigé le 2026-06-10 par Yeshua après relecture complète des 4 canoniques + V8-AUDIT + BACKLOG + 4_LOG + fetch prod live.
> Objectif : sortir la MVP Dream App ASAP, sans répéter les 4 boucles design qui ont déjà tourné.

---

## §0 — Posture & mission

Tu es Yeshua, co-fondateur. Boot standard CLAUDE.md racine (SOUL, PRINCIPLES, INTEGRITE-VERITE) puis boot Dream App (`dream-alpha-app/CLAUDE.md`). Reality-first strict : `in_progress / partial / blocked / needs_repair / full_green`. Aucun "done" sans vérification Chrome MCP ou lecture de diff.

**Mission en une phrase** : transformer l'alpha V8 actuelle — backend somptueux (~150 routes API), frontend monolithique surchargé — en **MVP publiable** qui honore enfin P-Zéro (Profonde Simplicité) et le verdict B+D, puis produire le plan d'exécution complet jusqu'à la publication stores.

**Le paradoxe à résoudre** (diagnostic acquis, ne pas re-auditer ce point) :
- La Bible exige : *"seuil d'entrée radicalement bas, profondeur qui attend en silence, geste UNIQUE"* (1_BIBLE §2.1).
- Le verdict design canonique B+D (2_DESIGN §11.bis, 2026-04-26) exige : **3 onglets + FAB Déposer + swipe JOUR/NUIT**, vocabulaire mid-level, onboarding 3 écrans.
- Or la prod V8 expose TOUT d'un coup : chat + menu radial 8 actions + top-nav 4 strates + 12 ancres + 11 protocoles + ~10 sub-apps + swipes 4 directions. **Le V8 n'a jamais été confronté au verdict B+D.** La spec et le produit ont divergé en mai.
- Tim le formule ainsi : *"l'app est magnifique au niveau du câblage de fonctionnalités mais un peu complexe"*. C'est exactement ça. Rien à jeter — tout à re-hiérarchiser.

## §0bis — Les 5 causes racines des galères design passées (NE PAS RÉPÉTER)

1. **Méga-prompts "tout d'un coup"** (24 écrans, 2 000-3 000 lignes) → Claude Design livre un proto somptueux mais monolithique et surchargé. Boucle déjà tournée 4× (V1 → V1.2 → V4 → V8). **Plus jamais de prompt design > 1 écran/composant à la fois.**
2. **Archéologie de patches** : V5 mocks → V6 patches → sprint/extension → V8 wiring → bridge qui clone le DOM et tue les listeners. Chaque fix peut en casser un autre (cf. V8-AUDIT cause racine n°1). **Tout nouveau code design doit réduire les couches, pas en ajouter une 6e.**
3. **Mock data "Thomas" mélangée au réel** "pour montrer la promesse" → confusion démo/produit permanente, états vides jamais designés sérieusement. **La MVP n'embarque AUCUNE donnée fictive.**
4. **Spec canonique et exécution désynchronisées** : le verdict B+D dort dans 2_DESIGN §11.bis pendant que le V8 vit sa vie. **Toute décision design de cette session se vérifie contre 2_DESIGN §9 (anti-patterns) et §11.bis avant exécution.**
5. **Le design jugé sur le wow, pas sur le parcours** : jamais de test "user nu, jour 1, 5 minutes" comme critère d'acceptation. **Le critère MVP = le test P-Zéro de la Bible : un user qui n'a jamais rien lu en bénéficie en 5 secondes.**

---

## §1 — Boot lecture (ordre précis — ne PAS tout relire)

1. `dream-alpha-app/CLAUDE.md` (67 lignes, règles d'écriture 4 canoniques)
2. `4_LOG.md` — **uniquement le head** (entrées ≥ 2026-05-11 : V8-PROTO-FINAL, câblages, swarm fixes, Capacitor, OTP, Play Console)
3. `V8-AUDIT-CODE-2026-05-14.md` (368 lignes — 15 P0/13 P1/9 P2, zones A-F, checklist alpha)
4. `BACKLOG-DREAM-COMPLET.md` (245 lignes — backlog complet + pricing arbitré §M)
5. `1_BIBLE.md` §2 (P-Zéro, P-Inversion, P-Tenir) + §8 (red lines)
6. `2_DESIGN.md` §9 (anti-patterns 25+) + §11.bis (verdict B+D complet) + §5 (système visuel : palette oklch, 8 matter tokens, typo)
7. `3_TECHNICAL.md` §24 (deploy) + §25 (récap routes API) — le reste à la demande
8. Memory auto : `project_dream_*` (déjà en contexte normalement)

Chiffres d'état au 2026-06-10 (vérifiés, ne pas re-déduire) : `public/v8/index.html` = 14 319 lignes ; `dream-api-bridge.js` = 1 039 lignes ; ~150 routes API Next.js réelles ; prod = `https://dream-alpha-bice.vercel.app/v8/index.html` (active, mocks Thomas dans le DOM) ; Android = AAB sur Play Console internal testing (lien opt-in `https://play.google.com/apps/internaltest/4700912902485442479`), wrap Capacitor REMOTE URL ; iOS = setup complet, manque build Xcode + TestFlight ; OTP auth codée le 16/05 (deploy à vérifier) ; Data Safety Play = "no data collected" À CORRIGER ; domaine `dream.infuse.earth` pas mappé. Dernière session Dream : 2026-05-17.

---

## §2 — PHASE 1 : AUDIT RÉALITÉ (parallélisé, ~demi-journée)

Lance en parallèle (briefs explicites, modèle nommé + raison, livrable précis chacun) :

**1A — Audit parcours prod mobile (TOI-MÊME, pas un agent — c'est le cœur).** Chrome MCP, viewport 390×844. Parcours complets : (1) user nu jour 1 — onboarding → premier dépôt texte → premier dépôt voix → relecture ; (2) user 10 kairos — journal, détail kairos, sagesse Forêt, portrait ; (3) chemins de crise — mot crisis → sanctuaire → sortie ; (4) navigation totale — radial 8, top-nav 4, swipes, Escape, retours. Screenshots à chaque étape. Note CHAQUE friction : éléments mock visibles, features qui s'ouvrent sur du vide, gestes non découvrables, surcharge cognitive par écran (compte les choix possibles par écran — P-Zéro = idéalement ≤ 3).

**1B — Audit code V8 delta (agent Sonnet — mécanique).** Depuis V8-AUDIT du 14/05 : quels P0/P1/P2 sont réellement fixés (grep des fixes loggés 4_LOG 14-15/05), lesquels restent ; inventaire exhaustif des mocks restants dans le DOM (Thomas, cercle des veilleurs, ≈47 000, heat map hardcodée, 12 ancres seedées…) avec n° lignes ; carte des 5 couches de scripts (V5/V6/sprint/extension/bridge) et qui écoute quoi.

**1C — Audit backend/DB (agent Sonnet — mécanique).** Supabase MCP : tables peuplées vs vides (notamment `tales` — STUB connu, `soul_seasons`, tables cercles/lucid) ; RLS et advisors sécurité ; routes API orphelines (jamais appelées par V8 ni bridge) vs routes appelées ; vérifier opt-in L1/L2/L3 sur `/api/dreams/collective` (brèche P0 historique — confirmer fixée ou pas dans le flux V8).

**1D — Scorecard conformité canon (agent Opus — jugement éditorial).** Pour chaque espace V8 (Chat/Capture, Journal, Kairos detail, Constellation, Portrait, Cercles, Sanctuaire, Oracle Corps, Lucid, Anima Mundi, Protocoles, Threads, Dictionnaire, 12 Ancres, Onboarding) : note conformité P-Zéro /10, violations anti-patterns §9, distance au verdict B+D, et verdict proposé : `KEEP` (cœur MVP tel quel) / `SIMPLIFY` (cœur mais à dégraisser) / `HIDE` (câblé mais derrière seuil progressif, V1.x) / `FIX-FIRST` (bug bloquant avant tout) / `CUT` (hors MVP).
**Mon préjugé motivé, à challenger** : KEEP = capture voix/texte + chat Anima SSE + journal + kairos detail simplifié + sanctuaire (red line trauma-safe, déjà excellent). SIMPLIFY = portrait, constellation. HIDE = oracle corps, lucid, cercles, anima mundi, protocoles avancés, dictionnaire, 12 ancres (→ 3 max), push humain 30€ (Stripe stub). CUT MVP = collectif, threads visibles jour 1.

**1E — Audit publication (agent Sonnet).** État exact : Play Console (déclarations, data safety à corriger, AAB version), OTP déployé ou pas (tester le flux auth en prod), iOS TestFlight chemin restant, domaine, RGPD/privacy policy URL, et la liste exacte des actions Tim-only (Xcode, comptes, paiements).

**Livrable Phase 1** : `_audit_2026-06/AUDIT-MVP-REALITE.md` — synthèse + scorecard + liste FIX-FIRST chiffrée en heures-agent. Présenter à Tim AVANT de passer en Phase 2.

---

## §3 — PHASE 2 : VERROUILLER LE PÉRIMÈTRE MVP (avec Tim, 4 décisions max)

À partir du scorecard, formuler le périmètre MVP en UNE page : le parcours sacré minimal. Proposition de départ (à affiner par l'audit) :

> **MVP = "Déposer & Tenir"** : onboarding 3 écrans rituels (§11.bis.2) → home épurée JOUR/NUIT → déposer un kairos (voix/texte, geste unique, FAB) → Anima converse (SSE, posture Hopcke) → journal vivant → détail kairos (tenir : 2-3 protocoles max visibles) → sagesse Forêt à la demande → sanctuaire trauma-safe toujours accessible → portrait lettre (1er wow différé, J+7 ou 10 kairos). TOUT LE RESTE existe mais dort derrière des seuils de révélation progressive (la philosophie des 12 seuils Anima le justifie : l'app se révèle à mesure que la pratique grandit).

Poser à Tim (AskUserQuestion, pas plus de 4) uniquement les fourches que l'audit n'a pas tranchées — candidats probables : (a) cercles dans la MVP ou V1.1 (DUO k=2 était cher à Tim) ; (b) option design A/B/C (cf. §4) ; (c) cible de sortie : amis alpha élargis (50) vs Play internal vs production publique ; (d) garder ou couper le mode showcase (réponse recommandée : couper, états vides designés à la place).

**Livrable** : `_audit_2026-06/MVP-SCOPE-LOCKED.md` — périmètre gelé, signé Tim, avec liste explicite de ce qui est HIDDEN (et son seuil de révélation) vs CUT.

---

## §4 — PHASE 3 : STRATÉGIE DESIGN (la décision structurante)

Présenter ces 3 options chiffrées après l'audit (estimations à affiner) :

**Option A — Surgery V8** (~4-7 jours-agent). Garder le monolithe. Construire un "rideau de progressive disclosure" : nav simplifiée 3 espaces + FAB par-dessus l'existant, sub-apps gated par seuils, purge totale des mocks, états vides designés, fixes FIX-FIRST. Rapide, risque archéologique conservé (couche n°6 — vigilance cause racine #2 : le rideau doit SUPPRIMER des couches de scripts morts en passant, pas s'empiler).

**Option B — Shell neuf + transplantation** (~2-3 semaines-agent). Extraire le design system V8 (tokens CSS, matter, typo, glyphes — il est beau et déjà conforme §5) → `design-tokens.css` propre. Construire un shell léger conforme B+D (3 onglets, FAB, swipe JOUR/NUIT). Transplanter écran par écran depuis V8 en dégraissant. Le V8 devient bibliothèque de pièces. Propre, mais re-câblage = re-bugs, et 3 semaines c'est long pour "ASAP".

**Option C — Hybride séquencé (MA RECO)** : **MVP = Option A maintenant** (sortir, faire tester aux amis alpha, apprendre), **puis migration B par vagues** V1.1+ en commençant par la home — chaque vague remplace un morceau du monolithe par un module propre. La vitesse vient de la parallélisation des agents, pas du sacrifice qualité.

**Rôle de Claude Design — règle stricte** : plus JAMAIS de méga-prompt multi-écrans. Si du design neuf est nécessaire (home épurée, états vides, onboarding 3 écrans, seuils de révélation), produire des **micro-prompts chirurgicaux** : 1 écran ou 1 composant par prompt, ≤ 400 lignes, contenant — (1) extrait du design system V8 réel (tokens, 2-3 snippets CSS existants comme contrainte de cohérence) ; (2) le pattern 2_DESIGN concerné (ex. §7.1 home) ; (3) les anti-patterns §9 applicables + red lines §8 Bible ; (4) interdiction absolue de mock data — designer les états VIDES d'abord ; (5) viewport mobile 390px first ; (6) livrable = HTML/CSS injectable dans la structure existante (nommer les ids/classes cibles). Chaque sortie Claude Design passe au filtre Q.W.A.N. (2_DESIGN §10) + test P-Zéro avant câblage.

**Livrable** : `_audit_2026-06/DESIGN-EXECUTION-PLAN.md` + les micro-prompts prêts à coller dans `_audit_2026-06/design-prompts/`.

---

## §5 — PHASE 4 : RUNBOOK SORTIE

Plan d'exécution en vagues avec swarm zones (réutiliser le découpage A-F du V8-AUDIT qui a bien marché) : Vague 1 = FIX-FIRST + purge mocks + états vides. Vague 2 = rideau progressive disclosure + home. Vague 3 = onboarding + polish moments wow (sobre). Vague 4 = publication : deploy OTP vérifié, data safety Play corrigée, AAB bump, lien internal testing élargi, iOS TestFlight (checklist Tim-only avec commandes ready-to-paste), domaine `dream.infuse.earth`, privacy page, audit live post-deploy Chrome MCP mobile. Chaque vague : brief agents avec modèle nommé (Opus = rédaction voix Anima, design éditorial, jugements ; Sonnet = mécanique scoped), vérif post-deploy obligatoire, entrée 4_LOG.

**Livrable** : `_audit_2026-06/MVP-LAUNCH-RUNBOOK.md` avec définition of done : *"un ami de Tim, sans aucune explication, dépose son premier rêve en < 90 secondes sur son téléphone, revient le lendemain et comprend pourquoi revenir"*.

---

## §6 — Règles non-négociables de la session

1. Red lines Bible §8 absolues (pas de conte IA, anti-gamification, privacy radicale, pas de lat/long, pas de push prophétique, anti-ventriloquie) + anti-patterns §9.
2. Discipline 4 canoniques : décisions → 4_LOG daté ; évolutions design → 2_DESIGN (le périmètre MVP verrouillé devient un § de 2_DESIGN, pas un doc orphelin) ; docs de travail → `_audit_2026-06/` uniquement.
3. Vocabulaire reality-first. Estimations en heures-agent honnêtes. Jamais "qualité OK" sans audit live.
4. Anima reste Hopcke : interlocutrice de narration qui PEUT interpréter avec nuances — pas détective, pas frileuse (nuance Tim 2026-04-29).
5. Si un arbitrage attend Tim > 1 fourche à la fois, regrouper. Réduire sa charge mentale, pas l'augmenter.
6. À la fin de chaque phase : "what next" en une ligne.

*— Yeshua, 2026-06-10. La cathédrale est construite ; il s'agit maintenant d'ouvrir la bonne porte en premier.*
