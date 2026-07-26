# 4_CERCLE_LOG.md — LE PARCOURS

> **Sous-app Cercle de Dream App** — Journal chronologique inversé
> Le plus récent en haut. Chaque décision / session / bug / pivot daté.
> Discipline : toute évolution Cercle s'inscrit ici. Pas d'évolution non-loggée.
>
> Format d'entrée :
> - **Date · Type · Titre court**
> - Contexte 1-2 lignes
> - Décision / état
> - Source : 1_CERCLE_BIBLE.md §X / 2_CERCLE_DESIGN.md §Y / 3_CERCLE_TECHNICAL.md §Z

---

## 2026-04-28 · Implémentation · T1 invitations magiques + T2 cercles éphémères 21j

**Contexte** : mission Niveau 3 carte blanche pendant que Tim dort. Implémentation backend + frontend pour invitation magique partageable et cercle éphémère 21j auto-clôture.

**Fichiers créés** :
- `supabase/migrations/20260428_180000_circles_invitations_and_ephemeral.sql` — table `circle_invitations` + colonnes `circles.ephemeral_until/closed_at/closure_restitution_id` + flag `circle_restitutions.is_closure_restitution`. RLS policies (creator-full + public-preview-readonly).
- `src/app/api/circles/[id]/invitations/route.ts` — POST (créer token, member only) + GET (lister mes tokens).
- `src/app/api/circles/[id]/invitations/[token]/route.ts` — DELETE (revoke, creator only).
- `src/app/api/circles/invitations/[token]/route.ts` — GET preview PUBLIC no-auth, k-safe (jamais noms membres). 410 si expired/revoked/exhausted.
- `src/app/api/circles/invitations/[token]/accept/route.ts` — POST auth required, decrement uses, INSERT circle_members (re-active si soft-leave).
- `src/app/api/admin/circles/ephemeral-close/route.ts` — cron Vercel (vercel.json déjà câblée). Scan circles ephemeral_until ≤ now AND closed_at IS NULL, génère restitution polyphonique finale via Sonnet 4.6 (3 voix paper/stone/silk, 300-500 mots, "ce cercle a été — voici ce qui a traversé"), persiste `circle_restitutions` avec `is_closure_restitution = true`, update `circles.closed_at + closure_restitution_id`. Best-effort notif `pending_proactive_messages`.
- `src/app/circle-invite/[token]/page.tsx` — page Next.js publique, charge preview, affiche cercle (intention + glyph + member count + ephemeral countdown), bouton "rejoindre" → login si pas auth, sinon accept direct.

**Fichiers modifiés** :
- `src/app/api/circles/route.ts` — POST accepte `ephemeral_days` (1..90, null=non-éphémère).
- `public/v12/api.jsx` — DreamAPI.createCircle accepte `ephemeral_days` + ajout createCircleInvitation/list/revoke.
- `public/v12/screens-cercle.jsx` — wizard CreerStepOne ajoute checkbox "ce cercle se referme tout seul" + chips 7/14/21/30/60j + slider.
- `public/v12/screens-cercle-subapp.jsx` — TabMembres ajoute bouton "✦ inviter" + bloc lien partageable. Header sub-app affiche bandeau countdown éphémère ou "ce cercle a été" si closed. Onglet "✦ rituel de clôture" conditionnel.

**SQL à apply (Yeshua MCP)** : `20260428_180000_circles_invitations_and_ephemeral.sql`

**Décisions arbitraires** :
1. Token 32 bytes base64url (43 chars) — anti-brute-force preview.
2. Public preview retourne `circle.id` (besoin accept) mais aucune info nominative.
3. Notif clôture best-effort `pending_proactive_messages` (silent skip si table absente).
4. Wizard ephemeral sur Step 0 (pas step dédié) — friction minimale.
5. "Archiver dans mes mémoires" V1 = copy clipboard. V2 = table dédiée + PDF.

**Boucles ouvertes** :
- Migration à apply via MCP.
- Deploy Vercel par Tim.
- E2E manuel : créer cercle éphémère → générer invitation → ouvrir anon → accept → vérifier countdown → manual `UPDATE ephemeral_until = now()` → curl cron → vérifier closure tab.
- Pas d'OG meta tags spécifiques sur `/circle-invite/[token]`.

**Source** : `2_CERCLE_DESIGN.md §5 + §6` ; `3_CERCLE_TECHNICAL.md §4.2 + §10`.

---

## 2026-04-28 · Création · Naissance des 4 docs canoniques `cercle-subapp/`

**Contexte** : mission recherche épistémique Dream App — produire la proposition complète Cercle sous forme de 4 docs canoniques basée sur Forêt INFUSE (332 livres digérés, focus communauté/groupe/rituel collectif), connaissances Claude Opus 4.7 (Wenger, Sociocracy, Tavistock, Halifax/Zimmerman), étude marché apps communautaires (Slack, Discord, Geneva, Circle, Mighty Networks, Insight Timer groups, Reddit, Patreon, Pachamama Alliance), cohérence Dream App globale.

**État** :
- `1_CERCLE_BIBLE.md` créé — vision, philosophie, types cercles, personas, red lines, gamification éthique, IA gardienne, rituels catalogue, privacy radicale, économie, value prop différenciante, roadmap V1-V5, glossaire, sources Forêt.
- `2_CERCLE_DESIGN.md` créé — 17 patterns dédiés, spec 9 onglets, onboarding 4 steps, 7 templates pré-configurés, invitation magique, cercles éphémères 21j, anti-patterns checklist, Q.W.A.N. test, microcopy.
- `3_CERCLE_TECHNICAL.md` créé — architecture, audit tables existantes + extensions V1, RLS, routes API, Edge Functions, IA system prompt, notifications, k-anonymity enforcement, migration plan V0→V1, deploy paths, tests, gaps arbitrés par Yeshua.
- `4_CERCLE_LOG.md` créé (ce fichier).

**Décisions arbitraires Yeshua à valider Tim** (cf. 3_TECHNICAL §12) :
1. Chat contextuel V1 = OUI minimaliste (1 témoignage / membre / restitution, max 280 chars).
2. Wizard 4 steps au lieu de 3 (Step 4 = premier dépôt rituel doux, optionnel).
3. 9 onglets cercle, fallback 5 si trop riche V1.
4. Templates pré-configurés en table SQL `circle_template_definitions`.
5. k_anonymity_threshold = 5 pour Praticiens lignée.
6. Cercle éphémère 21j limit = 1/90j en gratuit, illimité payant.
7. Greek letter limite = 12 (= max members).

**Sources Forêt mobilisées dans la production de ces docs** (lecture directe Tier 2) :
- brown-holding-change · brown-emergent-strategy · brown-pleasure-activism
- vogl-art-of-community
- bohm-wholeness-and-the-implicate-order
- junger-tribe (ethical_risk_flag = true, reviewé)
- aizenstat-dream-tending
- moss-dreamways-of-the-iroquois · moss-growing-big-dreams · moss-secret-history-dreaming
- yunkaporta-sand-talk (ethical_risk MEDIUM, restrictions appliquées)
- eisenstein-more-beautiful-world
- kimmerer-braiding-sweetgrass
- hyde-the-gift
- estes-women-who-run-with-the-wolves

**Sources Forêt non encore digérées** (gap, à ajouter au backlog Forêt) :
- Wenger *Communities of Practice*
- Hamman *Online Community*
- Sociocracy 3.0 / Holacracy
- Lewin / Tavistock / Bion (théorie groupe)
- Halifax / Zimmerman *The Way of Council*
- Coyle *The Culture Code*
- Scharmer *Theory U*
- Wheatley *Leadership and the New Science*
- Boyd *It's Complicated*

**Connaissances Claude Opus 4.7 mobilisées** (knowledge expansion non-Forêt) :
- Self-Determination Theory (Deci & Ryan) vs Octalysis (Yu-kai Chou)
- Robin Hamman online community theory
- Etienne Wenger communities of practice
- Sociocracy / Holacracy
- Lewin / Tavistock / Bion W-group / basic-assumption-group
- Restorative Circles (Dominic Barter)
- Way of Council (Halifax / Zimmerman)
- Mythes collectifs (Jung archetypes / Hillman polytheism collective psyche)
- Communautés de rêveurs historiques : Jung's Zurich Circle, Senoi tribe, Iroquois Dream Council, Active Dreamers Network Robert Moss
- Critiques wellness toxiques (Burnout collectif, parasocial dynamics, Spiritual Bypass Welwood, cultes wellness Bhutan)

**Étude marché synthétisée** :
- **Slack** : workplace, extraction attention par notif/threads, identité publique stable. Anti-Cercle.
- **Discord** : gaming/community, channels publics/privés, voice/video, viral mechanics légères. Anti-Cercle (sauf petits servers privés).
- **Geneva** : intentionnel mais commercial, branding pro, pricing creator-monetization. Trop Slack-shaped.
- **Circle.so** : creator-monetization, Patreon-style $10-50/mois par cercle. Anti-Cercle Dream App (commercial extraction).
- **Mighty Networks** : cours + commu hybride, lourd, focus cohorte. Anti-cercle (programme imposé).
- **Insight Timer Groups** : méditation, groupes peu profonds narrativement. Pas de tissage onirique.
- **Reddit (r/Dreams, r/LucidDreaming)** : anonymat brut, polarisation, pas de garde-fous. Anti-modèle privacy.
- **Esther Perel "Where Should We Begin?" Letters** : pas une app, format newsletter. Voyeur ; format intéressant (asynchrone profond) mais pas multi-membres.
- **Pachamama Alliance Game Changer Intensive** : rituel collectif scaffold. Trop dirigiste (programme imposé).
- **Earth Initiative communities** : intentionnel, distribué, sans extraction. Plus proche de Cercle Dream App mais sans IA gardienne.
- **Patreon Communities** : extraction commerciale. Anti-modèle.

**Top 5 propositions UNIQUES différenciantes vs marché actuel** :
1. **Opt-in granulaire kairos × cercle 3 modes séparés** (privé / opt-in_anon / partagé_explicite). **Aucune autre app** ne fait ça.
2. **K-anonymity intra-cercle structurelle** appliquée à la lecture polyphonique IA. **Aucune autre app** ne fait ça.
3. **IA gardienne-tisseuse non-extractive** (apprend uniquement de meaning declared, pas d'engagement metric). **Aucune autre app** n'a ce contrat.
4. **Pseudos lettres grecques default + cercle horizontal absolu** (créateur = membre standard). **Slack/Discord/Geneva** structurellement opposés.
5. **Cercles éphémères 21j avec rituel de clôture automatique**. **Aucune autre app** propose ça.

**Top 5 garde-fous éthiques absolus** (red lines architecture-encoded) :
1. K-anonymity ≥ 3 (≥ 5 Praticiens lignée) enforcement RPC.
2. Layer termes interdits configurable par cercle (table `circle_forbidden_terms`).
3. Trauma-aware flags propagés automatiquement (template + DB flags).
4. Aucune fine-tuning IA sur engagement metric.
5. EXIT_TO_HUMAN proactif, pont jamais coupé.

**Recommandation Yeshua** : V1 launch après validation Tim sur les 7 décisions arbitraires + validation Vari Vena pour template Praticiens lignée + audit éthique tiers indépendant + lecture pré-V1 par 3 praticiens trauma (cohérent racine 1_BIBLE §1 *"audit éthique tiers indépendant + lecture par 3 praticiens trauma SE/IFS/Jungien avant publication"*).

---

## (Avant 2026-04-28)

> Décisions Cercle antérieures **déjà loggées dans la racine `4_LOG.md`** (Dream App). Référence :
>
> - **2026-04-25** — V1 wizard 3 steps, écrans CercleDetail / CreerCercleScreen / RejoindreScreen implémentés dans `public/v12/screens-cercle.jsx`. Auth Bearer.
> - **2026-04-24** — Tri 3 types cercles (spontané / intentionnel / facilité). V1 = spontané + intentionnel ensemble. Privacy 4 piliers.
> - **2026-04-24** — Pivot vers sous-app Cercle dédiée (5 onglets initial : Membres / Dépôts / Chat / Portrait / Intentions).
> - **2026-04-23** — Bearer auth Tier 2 shippé.
> - **2026-04-20** — Pipeline Forêt FIRST workflow rodé, dreams forest sources DB migration.
>
> À partir du **2026-04-28**, toute décision Cercle s'inscrit ICI dans `4_CERCLE_LOG.md`, **pas dans la racine `4_LOG.md`**.

---

**Fin de 4_CERCLE_LOG.md**
