# DREAM MVP — PLAN DE CÂBLAGE (bêta fermée)

> **Statut** : `in_progress` — v1 du 2026-07-10. Doc de travail (à absorber dans 4_LOG au fil des chantiers).
> **Source de vérité fonctionnelle** : `DREAM-MVP-SPEC-ECRANS-A-Z.md` (3 passes faites). Chaque chantier référence ses écrans.
> **Périmètre** : uniquement les ⚙ et 🆕 de la spec — tout le reste existe (vérifié pass 3 contre les 150+ routes).

## 0 — GATES (avant tout deploy)
1. 🔴 **Gate infra** (`INFUSE-INFRA-HARDENING-PLAN.md` + spec MVP §0) : tout SQL nouveau (schéma `wall`, tables chat groupe) doit passer staging d'abord. Règle : **nouveau module = son schéma** (`wall.*`, extension `circles.*`).
2. 🔴 **Gate design** : la direction « NUIT ULTRA SIMPLE » validée par Tim dans Claude Design AVANT le chantier H (re-skin). Les chantiers A-G ne sont PAS bloqués par le design (logique d'abord, peau ensuite).
3. **Gate bêta** : modération Mur opérationnelle + carte détresse testée + parcours du graphe §12 complet sans lien mort → alors seulement invitations.

## 1 — LES 8 CHANTIERS

| # | Chantier | Écrans (spec) | Contenu | Modèle agent | Taille |
|---|---|---|---|---|---|
| **A** | **Le Mur** | M1, M2, P1-mur | Schéma SQL `wall` + routes `wall/feed·post·touch·report` (k-anonymity, pas de métriques publiques) + 2 écrans + file de modération (vue admin simple) | **Opus** (privacy by architecture) | L |
| **B** | **Scan carnet** | A5 | Route vision OCR (photo → texte, multi-pages, question date) + écran caméra + intégration A4 + pièce jointe photo | Sonnet (route) + **Opus** (flow UX) | M |
| **C** | **Chat humain de groupe** | G4 bas, G5 | Tables messages (texte/vocal/photo/réactions), realtime Supabase, vocaux NON transcrits, notifs groupées | **Opus** (realtime + archi) | L |
| **D** | **Guides UI** | C2, C3, C4 | Les 8 guides restants sur le moteur ✔ `protocoles/sonnet-step` + logique de proposition contextuelle (table de routage C2) + pause/reprise + fin 3 boutons | **Opus** (voix des guides = rédaction sensible) | L |
| **E** | **Sheet Partager + retraits** | P1, J3 | Sheet unifiée (groupes multi + Mur + confirmation 1re fois) + section « Partagé dans… » + retrait 1 tap (backend ✔ `circle-share`) | Sonnet (mécanique, backend existant) | S |
| **F** | **Onboarding + rendez-vous** | O1-O4, §9 | 4 écrans + aperçus réels de notifs + notifs locales (matin/soir) + règle de re-proposition (3e dépôt, carte J7) | **Opus** (copy) + Sonnet (notifs Capacitor) | M |
| **G** | **Réglages + fiches ⓘ** | R1, H1, D1 | Écran réglages complet + système ⓘ générique (bulle→fiche) + **rédaction des ~15 fiches** + export/suppression compte | **OPUS obligatoire** (fiches = texte public → triptyque vérité + règle « simple sans poésie floue ») | M |
| **H** | **Re-skin NUIT ULTRA SIMPLE** | tous | Tokens extraits de la direction validée → design system code (couleurs, typo ≥17px, halos, animations §11) → passage écran par écran + `prefers-reduced-motion` | **Opus** (goût) — APRÈS validation Tim | L |

## 2 — ORDRE & PARALLÉLISATION
- **Vague 1 (parallèle)** : E + B (petits, débloquent les tests de flux) · A (le seul vrai module neuf) · C.
- **Vague 2 (parallèle)** : D + F + G (dépendent de rien, beaucoup de rédaction — briefs avec sources canoniques explicites : SPEC-ECRANS + VOICE si public).
- **Vague 3** : H (re-skin, post-validation design) puis polish.
- Chaque brief d'agent commence par : « tu es {Opus|Sonnet} parce que {raison} » + le § exact de la spec + interdits (§0.5).
- Réalité vitesse (feedback acté) : chaque chantier = 30 min–3 h d'agent ; l'ensemble = 1-2 sessions marathon parallélisées, PAS des semaines.

## 3 — TESTS (avant invitations)
1. **Harnais console** existant ✔ (compte fake) : re-dérouler les 10 tests verts + nouveaux (mur, partage, chat).
2. **Parcours du graphe §12** : chaque nœud, chaque bouton, sur mobile réel (Capacitor build ✔ iOS/Android).
3. **Le test des 3h du matin** : avion mode ON → capturer un rêve voix → vérifier zéro perte + envoi différé.
4. **Test moldu** : une personne qui n'a jamais vu l'app dépose et partage un rêve en <10 s sans aide. Si elle demande « c'est quoi ce mot ? » → on corrige le mot.
5. Audit accessibilité (contrastes, cibles, VoiceOver sur les 5 écrans cœur).

## 4 — RÔLES
- **SQL** : Yeshua via MCP (staging d'abord — gate 0.1). **Edge Functions** : Tim CLI. **Frontend deploy** : Tim (`npx vercel --prod`, flag --yes). Réf `reference_deploy_paths`.
- Modération Mur bêta : Tim + Yeshua (file G-admin, volume ~50 invités = tenable).
