# CLAUDE.md — dream-alpha-app/ (contextuel local)

> Tu es Yeshua. Tu travailles sur **Dream App**. Lis ce fichier en entier avant toute action ici.

## Source de vérité = 4 documents canoniques

Dream App a **4 et seulement 4 documents canoniques**. Ils sont la source de vérité unique. Tout le reste est intermédiaire (à archiver) ou opérationnel (code, scripts, config).

| Doc | Rôle | Quand y écrire |
|---|---|---|
| [`1_BIBLE.md`](1_BIBLE.md) | LE SENS | Vision, philosophie, red lines, mythos, Forêt absorbée, gouvernance éthique |
| [`2_DESIGN.md`](2_DESIGN.md) | L'EXPÉRIENCE | Pattern language Alexander, 28 patterns primitifs, 12 règles génératives, matter system, motion, haptique, Q.W.A.N. test |
| [`3_TECHNICAL.md`](3_TECHNICAL.md) | LA RECONSTRUCTION | Architecture, DB schema, API routes, deploy, privacy-by-architecture, scaling, "rebuild from scratch" |
| [`4_LOG.md`](4_LOG.md) | LE PARCOURS | Chronologique inversé : décisions datées, sessions, bugs résolus, releases, pivots, révisions conceptuelles |

**Date de canonisation** : 2026-04-24, Bali night. Auteurs : Yeshua + 4 agents Opus dispatched en parallèle, sourcés par 5 plénières ouvertes 2026-04-24 + verdict intégratif + mapping consolidation Phase 3 + inventaire exhaustif Phase 1 + 17 mémoires Tier S/A/B + Pattern Language Grammar + Forêt absorbée (30+ livres digérés).

---

## Règle d'écriture (NON-NÉGOCIABLE)

Toute évolution Dream App s'inscrit DANS les 4 docs ci-dessus. Pas à côté.

1. **Décision Dream App** (Tim tranche, ou Forêt révèle, ou plénière conclut) → entrée datée dans `4_LOG.md` (chronologique inversé, plus récent en haut)
2. **Évolution du SENS** (vision, philo, red lines, mythos) → mise à jour `1_BIBLE.md`
3. **Évolution UX / pattern / grammaire / matter / motion** → mise à jour `2_DESIGN.md`
4. **Évolution archi / DB / API / deploy / privacy / scaling** → mise à jour `3_TECHNICAL.md`
5. **Doc intermédiaire produit** (plénière, audit, agent Opus, recherche Forêt) :
   - Son contenu est **absorbé** dans les 4 canoniques pertinents
   - Le fichier est **déplacé** dans `_archive_pre_canonical/` (pas supprimé — gardé pour traçabilité)
   - Une entrée 4_LOG signale l'absorption
6. **Pas de nouveau doc Dream App au top niveau de `dream-alpha-app/` sans validation Tim explicite**

---

## Discipline de lecture

Avant de répondre à toute question Dream App profonde (pas un bug ponctuel) :
- Lire la section pertinente d'au moins **1_BIBLE** (le sens) ET **2_DESIGN** (l'expérience)
- Si question archi/tech : ajouter **3_TECHNICAL**
- Si question historique : ajouter **4_LOG**

Pour bug ponctuel ou tâche opérationnelle : lire d'abord `4_LOG.md` (récent en haut) pour voir si le sujet a déjà été traité, puis attaquer.

---

## Ce qui n'est PAS canonique (et ne doit pas être traité comme tel)

- Tout fichier dans `_archive_pre_canonical/` — historique uniquement
- Tout `DREAM-MASTER-BIBLE.md`, `DREAM-MEGA-BRIEF*.md`, `CLAUDE-DESIGN-V4-PROMPT*.md`, `DESIGN-V4-*.md`, `META-AUDIT-*.md`, `PLENIERE-*.md`, `FOREST-CONSULT-*.md`, `MAPPING-CONSOLIDATION-*.md`, `INVENTORY-EXHAUSTIVE-*.md`, `P-ZERO-*.md`, `DREAM-APP-PATTERN-LANGUAGE-GRAMMAR.md`, `DREAM-APP-VISION-EXHAUSTIVE-*.md` — tous **historiques absorbés dans les 4 canoniques**, à déplacer dans `_archive_pre_canonical/`
- `DEPLOY.md`, `APP-STATE-INVENTORY.md` — opérationnels, OK au top niveau
- Les sources code (`src/`, `package.json`, etc.) — opérationnels

---

## Reconnaître une dérive (red flag)

Si tu te retrouves à :
- Créer un nouveau `.md` Dream App au top niveau (autre que les 4 canoniques + DEPLOY/APP-STATE)
- Citer un doc archivé comme s'il était encore source de vérité
- Sourcer une décision sur un memory `.auto-memory/project_dream_*.md` plutôt que sur les 4 canoniques

→ **Stop**. Tu dérives. Recadre : la source est dans les 4 docs ci-dessus.

---

*Câblé 2026-04-24 par Yeshua sur demande Tim. Discipline anti-perte total.*
