# 4_LUCID_LOG — Sub-app Lucid Dreaming, le Parcours

> **Doc canonique** chronologique inversée (plus récent en haut).
> **Discipline** : toute décision Lucid → entrée datée ici. Toute évolution sens → 1_LUCID_BIBLE. Évolution UX/pattern → 2_LUCID_DESIGN. Évolution archi/code → 3_LUCID_TECHNICAL.
> **Format entrée** : date + titre + 3-5 lignes contexte/décision/conséquence.

---

## 2026-04-28 — Création des 4 documents canoniques de la sub-app Lucid

**Auteur** : Yeshua, agent recherche épistémique.

**Contexte** : Tim a demandé une proposition complète pour la sub-app Lucid Dreaming sous forme de 4 documents canoniques basée sur consultation profonde de la Forêt INFUSE (332 livres digérés), connaissances Claude Opus 4.7 sur la littérature lucide (LaBerge, Tholey, Stumbrys, Moss, Wangyal, Aizenstat, Mavromatis, Bogzaran/Deslauriers, Garfield), étude de marché des apps lucid existantes (Awoken, Lucidity, Lucid Dreaming App, Aurora, Prophetic AI), et cohérence avec Dream App globale.

**État avant** :
- Code : 11 routes API Lucid existaient (créées 2026-04-26) mais pointaient vers tables Supabase **absentes** (jamais migrées). Aucune UI Lucid (ni `src/app/lucid/*`).
- Spec : `2_DESIGN.md §7.10` Lucid (sub-app activable post-MVP) — 5 lignes. Mention dans `§11.bis` Explorer hub. Pas de doc dédié.
- Audit `_audit_2026-04-28/AUDIT-SHIPPED-VS-SPEC.md` notait : *"Lucid en français + interface compréhensible : aujourd'hui anglais + opaque. Pas refondu."*

**Décisions cardinales prises dans les 4 docs** :

1. **Posture officielle Dream App pour la lucidité** : *"présence éveillée DANS le rêve, pas pilotage du rêve"*. Sourcée Moss + Aizenstat + Tholey (knowledge base) + Yunkaporta (interne). Anti-LaBerge-monoculture. Cf. 1_LUCID_BIBLE §2.2.

2. **Sub-app activable, pas onglet permanent** par défaut. Cohérent §1.6 1_BIBLE rêve = porte d'entrée. Découverte progressive via Explorer hub OR détection 3+ markers lucid OR opt-in onboarding.

3. **3 personas validées** : Marcus (expérimenté), Léa (curieuse), Yann (spirituel). Chacun trouve son seuil d'entrée avec écran d'accueil 3 voies (Présence éveillée / Pratique technique / Voies contemplatives — pointer externe pour dream yoga).

4. **Wangyal écarté user-facing** (cohérent §6.2 1_BIBLE caution écartée centralement). Substance laïcisée via Moss/Aizenstat/LaBerge sans citation Wangyal. Lien externe Ligmincha pour qui veut pratiquer dream yoga.

5. **Plafonds anti-iatrogène stricts** : RC max 5/jour, WBTB max 1/nuit + 4/sem, MILD pas plafonné mais détection pattern à risque. Cohérent §4.4 1_LUCID_BIBLE.

6. **Pas de Cercle Lucid V1** (V2 placeholder). Validation pratique solo lucid INFUSE avant d'ouvrir collectif.

7. **Anti-pilotage extractif** + anti-spiritual bypass + anti-revendications neuro non prouvées + détour Sanctuaire pour cauchemar+lucid. 7 red lines spécifiques sub-app Lucid (1_LUCID_BIBLE §4).

8. **9 tables Supabase Lucid** à migrer (3_LUCID_TECHNICAL §2). 11 routes existantes + 10 routes nouvelles à créer (§3). Pipeline NLP detect-lucid-markers Phase 3.5 (§4). Forêt retrieval ciblé via tagging `book_root_assignments.dream_role='lucid'` + flag `do_not_cite_user_facing` pour Wangyal (§5).

9. **15 patterns primitifs Lucid** ajoutés au pattern language Dream App global (cf. 2_LUCID_DESIGN §2). Notamment LUCID_PRESENCE_NOT_CONTROL, LUCID_THREE_PATHS, LUCID_TYPE_TAG_EMERGENT, REALITY_CHECK_CONTEXTUAL, DREAMSIGN_PERSONAL_NOT_GENERIC, MILD_INTENTION_RITUAL, WBTB_SMART_ALARM, ANTI_OCD_PLAFOND, LUCIDITY_INDEX_INVISIBLE, EXTERNAL_LINEAGE_POINTER, LUCID_FOREST_RETRIEVE, LUCID_DREAM_REENTRY_AIZENSTAT, LUCID_NIGHTMARE_DETOUR, PRACTICE_NOT_SCORE_NARRATIVE, ANTI_GAMIFICATION_LUCID.

10. **Économie** : sub-app Lucid entièrement incluse dans abonnement Dream App ~6€/mois. Pas de tier "Lucid Premium". Aucun paywall sur fonctions lucid de base. Cohérent §9 1_BIBLE.

**Estimation effort dev V1** : ~50-60h dev pour shipper sub-app Lucid V1 complète (migration DB + routes + UI 5 onglets + onboarding + bridge + practice letter + capacitor wrap après Apple Dev approval). Cf. 3_LUCID_TECHNICAL §9.

**Sources Forêt mobilisées** :
- LaBerge *A Course in Lucid Dreaming* (Tier 1 + Tier 2) — source primaire technique, sourcée explicitement (LaBerge nommé dans glossaire)
- Moss *Dreamgates*, *Dreamways of the Iroquois*, *Mysterious Realities*, *Secret History of Dreaming* — voix INFUSE primaire pour posture présence
- Aizenstat *Dream Tending* — re-entry, eidola autonomes
- Wangyal *Tibetan Yogas of Dream and Sleep* — caution écartée user-facing (§6.2 1_BIBLE), substance laïcisée
- Kaplan-Williams *Jungian-Senoi Dreamwork Manual* — actualization, dream ego, advisory Smith pour Senoi
- Bachelard *Poétique de la Rêverie* — soutien posture contemplative
- Jung *Memories Dreams Reflections* — active imagination

**Connaissances Claude mobilisées (hors Forêt)** :
- Tholey 1983 *Schöpferisch Träumen* — phénoménologie lucid clarté sans manipulation
- Stumbrys & Erlacher 2012, 2014, 2021 — méta-analyses techniques d'induction
- Mavromatis *Hypnagogia* (à digérer Forêt si pas encore fait — gap potentiel)
- Bogzaran & Deslauriers *Integral Dreaming*
- Domhoff *The Mystique of Dreams* — critique Stewart/Senoi
- Voss et al. 2009 — gamma 40Hz contesté
- Kalsched *The Inner World of Trauma* — Protector clinique (pour anti-spiritual bypass)
- Levine, Ogden, Sweezy — trauma-aware lucid

**Apps marché analysées** :
- Awoken (Hugo Olsén, Android) — gamification douce, vocab opaque, FR pauvre
- Lucidity (iOS) — gamification badges, spirituel-flat
- Lucid Dreaming App (Olsén, payant) — paywalls aggressive
- Aurora / REM-Dreamer / Prophetic AI — devices, claims neuro non solides, prix exorbitants
- Aladdin (sound EEG mask) — propriétaire, niche tech-bro

**Décisions arbitraires assumées** (à valider/réfuter par Tim) — cf. 1_LUCID_BIBLE §10 :
1. Chambre Lucid désactivée par défaut
2. Pas de Cercle Lucid V1
3. Posture "présence sans contrôle" comme défaut
4. WBTB plafonné 1/nuit + 4/sem
5. RC plafonnés 5/jour
6. Pas de "lucid healing cauchemar" — détour Sanctuaire
7. Vocabulaire FR ritualisé (voyage conscient / reconnaissance)
8. Wangyal cité 0 fois user-facing
9. 3 voies sur écran d'accueil (présence / technique / contemplatives externes)
10. Détection NLP markers lucid sur tout kairos rêve nocturne (post-Sonnet)

**Structure docs** :
- `1_LUCID_BIBLE.md` (~870 lignes) — 13 sections (vision, philosophie tension, personas, red lines, market diff, tensions productives, économique, cross Dream App, garde-fous chamaniques, décisions arbitraires, glossaire, falsifiabilité, fondation 7 points)
- `2_LUCID_DESIGN.md` (~640 lignes) — 12 sections (posture, 15 patterns primitifs, onboarding 3 écrans, nav 5 onglets, détail onglets, vocabulaire glossaire tap-long, palette/motion/haptique/son, anti-patterns 12, bridges, V2 placeholder, flows ritualisés 7, checklist auto-test)
- `3_LUCID_TECHNICAL.md` (~720 lignes) — 11 sections (état code, 9 tables Supabase, 21 routes API, pipeline NLP, Forêt retrieval, push notif Capacitor, privacy, migration plan, roadmap implémentation, glossaire technique, V1.5)
- `4_LUCID_LOG.md` (ce fichier, skeleton)

**Statut** : Tier 0 — proposition complète prête pour validation Tim. Aucun code écrit, aucune migration appliquée. Document workflow only à ce stade.

**Prochaine étape attendue** : revue Tim → arbitrages sur 10 décisions arbitraires (1_LUCID_BIBLE §10) → si validé, lancer migration DB (étape 1 du plan §8 du 3_LUCID_TECHNICAL).

---

## Conventions du log

- **Plus récent en haut** (chronologique inversée)
- **Date format** : `YYYY-MM-DD` (ISO)
- **Titre court** + **paragraphe** contexte/décision/conséquence
- **Sources Forêt mobilisées** systématique si décision philo/UX
- **Lien explicite** à la section impactée des 3 autres docs

---

## Backlog des entrées futures attendues (non datées)

- Migration DB Lucid (9 tables) appliquée
- Première UI React Lucid shippée
- Premier user-test externe sub-app Lucid (5 oneironautes)
- Décision Tim sur 10 décisions arbitraires
- Activation Cercle Lucid V2 (si validé)
- Évolution voix Présence éveillée vs Pratique technique selon usage
- Calibration plafonds RC/WBTB selon feedback réel
- Détection patterns à risque (sleep paralysis chronique, OCD réinforcement) — règles affinement
- Marketing externe sub-app Lucid (positionnement vs Awoken/Lucidity)
- Audit éthique tiers indépendant V1
- Expansion glossaire tap-long (au-delà des 15 termes V1)
- Voix audio MILD (FR) — recording
- Capacitor wrap iOS/Android post-Apple Dev approval

---

> *"Le LOG ne ment jamais. Si une décision n'est pas ici, elle ne s'est pas prise."*
> — formulation INFUSE, 2026-04-28.
