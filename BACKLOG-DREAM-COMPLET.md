# BACKLOG-DREAM-COMPLET

> **Source de vérité unique** de TOUT le backlog Dream App.
> Mise à jour : 2026-04-29 (chat post-vol Bali → France).
> Engagement Yeshua : aucune décision/draft Tim n'est perdue. Tout y passe, Tim filtre.

**Statuts** : `[TODO]` `[IN_PROGRESS]` `[BLOCKED]` `[NEEDS_TIM_DECISION]` `[BACKLOG_FUTURE]` `[DONE]`

---

## A. RÉGRESSIONS P0 À CORRIGER

- `[TODO]` **ReentryScreen V12 nu** — décommenter `window.ReentryScreen = ReentryV12;` (screens-v12-amplified.jsx:1072). 1 ligne, gros impact visuel. Source : audit overlays 2026-04-29.
- `[TODO]` **Wow2 arc silk-gold Portrait perdu** — PortraitV12 droppé, PortraitNarrative ne réimplémente pas l'arc `echoArcDraw` 4.2s. Recâbler dans PortraitNarrative.
- `[TODO]` **Wow3 big-dream-marquage KairosDetail base perdu** — actif uniquement BigDreamSignal. Câbler dans screens-deep.jsx.
- `[NEEDS_TIM_DECISION]` **2 overlays inventés à arbitrer** — ConstellationOverlay + EchoPropheticOverlay (créés en avril, sémantiquement décalés du système doux Claude Design). Options : downgrade en cards flottantes / supprimer / garder.
- `[TODO]` **Bug Android black screen** — fix esbuild precompile prêt (script `scripts/precompile-jsx.mjs`), à déployer via `npx vercel --prod`. Estimation gain mobile : 6-12s CPU économisés. Capacitor wrap = fix natif automatique également.

## B. 3 RÉGRESSIONS PHILOSOPHIQUES À CÂBLER

- `[TODO]` **Détections en signal narratif Hopcke (pas affirmation)** — Modifier system prompts Anima + UI : détections threads/prophétique/récurrent restent câblées en backend, mais leur livraison passe en signal discret + invitation Anima ("trois fois ton frère cette lune... tu veux raconter ?"). Profondeur sur demande.
- `[TODO]` **Embargo 6-24h supprimé** — Crons restent (4h/6h/6h30/7h UTC pour batch+coût) mais sorties affichées dès le retour user. Plus d'attente philosophiquement injustifiée. Latence rituelle conservée uniquement sur synthèse profonde Sonnet J+1.
- `[TODO]` **Posture Hopcke explicite system prompts Anima** — Ajouter dans toutes les routes IA Dream :
  - "Tu es interlocutrice de narration, pas détective de patterns"
  - "Le user dit le sens en premier, jamais toi"
  - "Pose des questions ouvertes (qu'est-ce qui s'est passé juste avant ?)"
  - "Si tu n'es pas invitée à interpréter, tu te tais"

**Nuance Tim 2026-04-29** : Anima PEUT interpréter et DOIT interpréter avec nuances ("ça pourrait être X, ou Y, prends ce qui résonne"). Ce n'est pas "ChatGPT-light frileux". L'app peut révéler les patterns, partager la richesse symbolique connue par la LLM + Forêt + connaissance personnelle du user. Le critère = aider à narrer + apporter symbolisme + nuancer. PAS détective verdict fermé.

## C. ANCRES — 12 PROPOSITIONS COMME STATES (BANDEAU COLLAPSIBLE)

À câbler en bandeau d'État Vivant en haut Journal de Vie, default collapsed (3 ancres prio en aperçu : Intuition / Honoring / Pattern qui s'allume), tap → déploie tout.

1. `[TODO]` **Intuition du réveil** ★ — capture immédiate post-réveil
2. `[TODO]` **Honoring du rêve** ★ — mission du jour issue d'un rêve, proposée 1×/jour par Anima
3. `[TODO]` **Intention pré-sommeil** — invitation portée pour la nuit, capture user
4. `[TODO]` **Quête cercle actif** — intention du cercle en cours, sync cercle
5. `[TODO]` **Lucid mission** — intention pratique lucide (conditionnelle : Lucid sub-app activée ET chosen_path != "présence éveillée seulement")
6. `[TODO]` **Dernière lecture oracle** — message du corps capté, sync Oracle Corps
7. `[TODO]` **Pattern qui s'allume** ✨ — thread/prophétique/récurrent actif, détection backend, click → narrer avec Anima
8. `[TODO]` **Big Dream tenu en cours** — si workflow 7j actif, progression J/7
9. `[TODO]` **Symbole personnel chaud** — du dictionnaire personnel, refresh cron 7h
10. `[TODO]` **Synchronicité ouverte** — en cours d'élucidation, flag user
11. `[BACKLOG_FUTURE]` **Saison de l'âme** ⊘ — phase initiatique courante, détection vector cluster shift (table soul_seasons existe vide)
12. `[TODO]` **Felt-shift à intégrer** — shift Gendlin capté, pas encore re-visité

**Décision Tim** : ancres = STATES affichés (pas gestes imposés). BIBLE §3.3 à amender pour clarifier "états ≠ gestes".

## D. ANIMA COMPAGNON INITIATIQUE (8 SPRINTS LIVRÉ AGENT)

Cf. `_recherches_2026-04-29/PLENIERE-ANIMA-COMPAGNON-INITIATIQUE.md` (6544 mots, livré).

- `[TODO]` **Sprint 1 — System prompt refonte Hopcke** (bloquant pour le reste)
- `[TODO]` **Sprint 2 — Programme 12 seuils (3 premiers câblés)**
- `[TODO]` **Sprint 3 — Détection maturité user (vector 6D non-affiché)**
- `[TODO]` **Sprint 4 — P-Silence avec triggers (Anima se tait)**
- `[TODO]` **Sprint 5 — Glossaire vivant des concepts oraculaires**
- `[TODO]` **Sprint 6 — Invitation expérientielle hebdo**
- `[TODO]` **Sprint 7 — 5 anti-pièges câblés (Anima-guru, prescripteur, détective, flatteuse, sur-explicateur)**
- `[TODO]` **Sprint 8 — Tests Q.W.A.N.**
- `[NEEDS_TIM_DECISION]` **DUAL-TRACK école initiatique opt-in** — Tim challenge 2026-04-29 : pour eager users, autre section "école aux chemins initiatiques" où user opt-in à max 3 chemins en parallèle (qu'on valide). Pas gamification stupide, vraie quête d'apprentissage profondeur app.
- `[NEEDS_TIM_DECISION]` **Aucun protocole UI tant que pas seuil — trop frileux ?** Tim challenge : protocoles devraient être accessibles via Explorer, Anima propose ceux qui correspondent au seuil actuel.

## E. PORTRAIT TRIPLE — CHOIX TIM 2/4/5

Cf. `_recherches_2026-04-29/PORTRAIT-TRIPLE-DEEP-SEARCH.md` (6342 mots, 7 designs livré).

- `[NEEDS_TIM_DECISION]` **D2 Topographie poétique** (Bachelard maison verticale)
- `[NEEDS_TIM_DECISION]` **D4 Mandala quaternio** (Aizenstat 4 capacities + Jung Tower)
- `[NEEDS_TIM_DECISION]` **D5 Réseau relations & lignage** (Yunkaporta + Kimmerer, anti-narcissisme actif)
- `[BACKLOG_FUTURE]` **Plénière Forêt Portrait avec encore plus d'options** (Tim demande nouveau tour, invoquer tous les auteurs Forêt + connaissance moderne)
- `[BACKLOG_FUTURE]` **Double Portrait couple/duo** — D6, applicabilité Olga/Tim
- `[BACKLOG_FUTURE]` **Portrait collectif cercle** — D7, spec autonome anonymisée
- **Tim challenge Yeshua frilosité** : reco initiale "D1+D5 fusionnés" était plate. Reviser vers proposals D2/D4/D5 plus ambitieuses.

## F. CERCLES — DÉCISIONS TIM CHAT 2026-04-29

- `[TODO]` **DUO catégorie spéciale** — template 8e à ajouter aux 7 actuels. k-anonymity = 2 (limite éthique pour duo intentionnel). IA gardienne tisseuse de duo. Idéal couples.
- `[TODO]` **Suppression limite 12 membres** cercle. Aucune limite, ni 3 ni 12, peut commencer à 2 (DUO).
- `[TODO]` **Cercles publics thématiques** — opt-in friction modérée. Discoverable depuis liste publique, validation modérateur 3j d'attente, anonymisation par défaut, trauma-safe banner permanent.
- `[TODO]` **Lien Telegram externe** — depuis Cercle sub-app, lien clickable groupe Telegram INFUSE multi-channels pour discussions plus libres / rencontres / rejoindre cercles thématiques.

## G. SUB-APPS À RAFFINER

- `[DONE]` **Lucid 5 onglets** — V1 OK
- `[DONE]` **Oracle Corps** — V1 OK (silhouette 17 zones + lecture polyphonique)
- `[DONE]` **Sanctuaire** — modal post-dépôt cauchemar 4 options + freeze 30/60/90j
- `[TODO]` **Tales — câbler nouveau matching algo** — vector top-10 + 4 modulateurs (structure 1.0 / émotion 0.6 / figure 0.8 / diversité 0.5). Effort ~4j.
- `[TODO]` **Tales — enrichir corpus 10 livres prioritaires** — Propp (priorité absolue), Campbell *Masks of God*, Mabinogion, Edda, Gilgamesh, von Franz *Shadow*, Jataka, Bettelheim, Arabian Nights, Baring/Cashford. Effort variable selon disponibilité PDF.
- `[DONE]` **Cercle 9 onglets** — V1 OK (chat collectif câblé)
- `[BACKLOG_FUTURE]` **Anima Mundi** — plénière dédiée à lancer (sub-folder anima-mundi-subapp/, 4 docs canoniques calqués cercle/lucid). POST-VOL France priorité.

## H. NOUVELLES FEATURES DRAFT TIM CHAT 2026-04-29

- `[TODO]` **HERMAION — sous-type kairos accidental_awakening** (8e type). Synchronicité d'éveil accidentel, "lucky find". Plus question Anima quand kairos a saveur d'accident révélateur. Protocole Re-entry Aizenstat amplifié pour hermaions.
- `[TODO]` **GIUFÀ mode optionnel pour set intentions** (jour/nuit/cercle). Anima reformule l'intention en littéralité brute → "tu dis [X], donc tu vas faire EXACTEMENT [X]. Tu confirmes ?" → révèle angles morts. Trickster sain.
- `[TODO]` **Yeshua /giufa dans CLAUDE.md** — me câbler pour proposer GIUFA quand Tim dépose intention/objectif/plan ici. Slash command + auto-détection.
- `[BACKLOG_FUTURE]` **Mega-app Trickster** — 5 mini-jeux trickstery (Hermaion, Giufa, Dirt, Polytropos, Wakan), multi-phone, BD 4 tomes Tim (NON / OUI / Trick). Reprend rêve Tim BD 4 tomes apprentissage.
- `[TODO]` **Fonction ALARM** — réveil matin doux, sieste, pré-sommeil, reverie. Connexion Spotify/Deezer OAuth. Capture immédiate post-réveil, intention pré-sommeil structurée. Effort moyen 2-3j post-Capacitor.
- `[TODO]` **Onboarding upload existant** — rêves audio/notes anciennes (Whisper) + export ChatGPT/Claude/Gemini JSON parsing + prompts fournis par Dream pour récupérer journal de jour des autres IA.
- `[TODO]` **Prompts Dream à donner aux autres IA** — template stocké, récupération bi-quotidienne/hebdomadaire/quand le user veut.
- `[BACKLOG_FUTURE]` **Sound design opt-in** — 3 sons rituels (gong tibetan / oiseau forêt / silence progressif).
- `[BACKLOG_FUTURE]` **Apple Health/Oura/Whoop bridge** — post-Capacitor uniquement.
- `[TODO]` **Active Dreaming 6 leviers complets** — câblage actuel 40% (Dream Recall/Lightning partial/Re-entry/Sidewalk Oracle bug). À ajouter : Shamanic Journeying + Dream Incubation. Cf. `_recherches_2026-04-29/ACTIVE-DREAMING-6-LEVIERS.md`.
- `[BACKLOG_FUTURE]` **Saisons de l'âme V2** — table soul_seasons existe vide. Détection algorithmique vector cluster shift. UI V2. Sources Stan Grof + Bonnitta Roy + van Gennep + Campbell.
- `[BACKLOG_FUTURE]` **Note de réveil "Guidance du jour"** — entité distincte des kairos. Spec à designer.
- `[TODO]` **Édition transcription post-Whisper** — édition texte + titre dream/day/fragment.
- `[TODO]` **Ancrage corporel multi-select** — choix multiple pour BodyMarkerCaptureModal.
- `[BACKLOG_FUTURE]` **Tests E2E Playwright** — avant launch publique.
- `[BACKLOG_FUTURE]` **Fine-tuning Haiku custom** — Sprint G+ post-MVP.
- `[NEEDS_TIM_DECISION]` **Constellations relationnelles avec seuils** — Cambray "à chaque fois X apparaît, Y dans 72h". Géométrie affective-symbolique. Tim demande arbitrage seuil 2 vs 8 (apophénie vs vérité).

## I. RECHERCHES À MENER

- `[TODO]` **Plénière Anima Mundi** — sub-folder anima-mundi-subapp/, 4 docs canoniques (1_BIBLE / 2_DESIGN / 3_TECHNICAL / 4_LOG). POST-VOL France priorité absolue.
- `[DONE]` **Plénière design app game-changing** — `_recherches_2026-04-29/PLENIERE-DESIGN-APP-GAME-CHANGING.md` (12 nouvelles props 6-17 + 3 paris ambitieux).
- `[DONE]` **Articles approfondis 7 Pépites Kairos** — 7 articles 2000+ mots dans `_articles_kairos_2026-04-29/`.
- `[TODO]` **Mega Wiki articles profonds dans autre chat** — prompt à fournir + contexte sauvé. Cible ~50 articles 2000-3500 mots = 100-150k mots de contenu profond.
- `[BACKLOG_FUTURE]` **Test safety design avec spécialistes trauma** — 2-3 prof × 200-400€ = 600-1200€ budget. ROI éthique élevé.
- `[BACKLOG_FUTURE]` **Anti-paranoïa raffinement mots-déclencheurs** avec spécialistes (cf. liste validée Tim).
- `[BACKLOG_FUTURE]` **Trickster app dédiée concepts BD 4 tomes Tim** — NON / OUI / Trick.
- `[BACKLOG_FUTURE]` **Recherche profonde langage personnel touchant** — étudier comment chatGPT s'adapte au user. Câbler équivalent dans Anima (langage personnel par user, comment il aime qu'on lui parle, ce qui le touche).
- `[BACKLOG_FUTURE]` **Casey "gods invite, never elect"** — citation pas dans Forêt actuelle. Digérer source originale OU citer concept-node `invitation-vs-imposition` qui existe.
- `[BACKLOG_FUTURE]` **Trungpa Crazy Wisdom** — priorité Forêt complément Trickster.
- `[BACKLOG_FUTURE]` **Snyder Practice of the Wild** — Trickster wilderness.
- `[BACKLOG_FUTURE]` **Gates Jr Signifying Monkey** — si app touche au langage trickster.

## J. FIX TECHNIQUES

- `[TODO]` **Deploy fix Android black screen** — `npx vercel --prod` après merge esbuild precompile.
- `[TODO]` **Capacitor wrap iOS** — ios/ folder partial. Mac requis. ~4-6h setup.
- `[TODO]` **Capacitor wrap Android** — Android Studio. ~4-6h setup. Fixera automatiquement le bug Babel via WebView native.
- `[BLOCKED]` **Apple Developer enrollment** — $99/an. DUNS 282628520 obtenu. Validation 1-3j. Mac requis pour Xcode.
- `[NEEDS_TIM_DECISION]` **Google Play Console** — créé ou pas ? $25 one-shot. Internal testing track 1j.
- `[TODO]` **dream.infuse.earth domain custom mapping** — DNS Vercel.
- `[TODO]` **Animations câblage 8 écrans + 2 overlays** — task #108 toujours pending.

## K. ANIMATIONS BRIEF CLAUDE DESIGN V5 (17 propositions)

Phrase Tim directrice : *"La vie EST VIVANTE, la nature pulse et grouille de partout tout l'temps lol."*

### Niveau 1 — Subtiles ambiance (priorité haute)
1. `[TODO]` Surface Matter respirante fond global selon mode atmosphérique heure
2. `[TODO]` HaloRespire silk intensifié au focus champ texte (0.3→0.6 opacity)
3. `[TODO]` Particules silk-gold flottantes ultra-lentes 10s+ opacity 0.05, 5-10 max
4. `[TODO]` Glyphes contextuels (croissant nuit, demi-cercle aurore matin)
5. `[TODO]` Transitions pages cérémoniel 920ms van Gennep

### Niveau 2 — Wow rituels
6. `[TODO]` Spirale logarithmique premier kairos (1.9s, déjà câblé Wow1)
7. `[TODO]` Arc silk-gold quand écho détecté (Wow2 perdu, à récupérer)
8. `[TODO]` Big Dream marquage auréole or massif numinosity > 0.85 (Wow3 partiel)
9. `[TODO]` Constellation pulsante quand nouvelle figure
10. `[TODO]` Onde de matière quand "tenir ce kairos" — onde silk depuis centre

### Niveau 3 — Sacrées profondes (Big Dream rare)
11. `[TODO]` Triangle équilatéral water passage porte rituelle (Reentry, à récupérer)
12. `[TODO]` Cercles concentriques infinis centre Portrait quand toggle
13. `[TODO]` Ondinnonk pulsation géant Big Dream entre workflow 7j
14. `[TODO]` Chœur visuel — 3 voix paper/stone/silk en cascade lors polyphonie

### Niveau 4 — Interactives
15. `[TODO]` Orbe centrale pulsante réagissant au volume voix (récupéré)
16. `[TODO]` Halo couleur selon mode atmosphérique (partiel)
17. `[TODO]` Felt-shift gate — animation lente ouverture/fermeture quand user valide shift

## L. MODÈLES IA — SACRIFICES QUALITÉ À CORRIGER

- `[TODO]` **Portrait** : Sonnet → **Opus** (mensuel, rare, mérite)
- `[TODO]` **Big Dream J7 lettre** : Sonnet → **Opus**
- `[TODO]` **Météo cercle** : Haiku → **Sonnet** (qualité émotionnelle)
- `[TODO]` **Onboarding initiation seuil** : Haiku → **Sonnet** (moments fondateurs)
- `[DONE]` Sagesse Kairos polyphonie : Sonnet OK
- `[DONE]` Cercle portrait collectif : Opus OK
- `[DONE]` Lecture Forêt 3 voix : Sonnet OK
- `[DONE]` Chat conversationnel quotidien : Haiku avec Sonnet escalation OK

## M. ÉCONOMIE / PRICING ARBITRÉ

- `[DONE]` **Free** — Capture, kairos, journal, portrait, échos manuels, Cercle (5 actifs), Anima Mundi, Chat IA 5/jour Haiku, Polyphonie via ✦
- `[DONE]` **Premium "Présence" 7€/mois** — Trial 14j accès TOTAL Premium (arbitrage Tim 28/04). Chat illimité Sonnet, polyphonie chat, threads illimités, modes atmos actifs/nourris, IA gardienne cercles, voice synthesis output, Synthèse mensuelle Portrait Opus
- `[DONE]` **Patron pay-what-you-can $20+** — Tout Premium + soutien explicite initiatives indigènes (25% Kogui / 20% Aboriginal / 15% Active Dreaming / 15% Iroquois Ondinnonk / 15% curanderxs / 10% frais)
- `[DONE]` **B2B custom** — Yeshua/Openclaw managed, 10-100 membres, Portrait cercle exclusif
- `[DONE]` **Big Dream Push humain 30€** — Praticien INFUSE répond, Stripe stub MVP

## N. DÉCISIONS STRATÉGIQUES EN SUSPENS

- `[NEEDS_TIM_DECISION]` **BIBLE §3.3 amender** pour clarifier "états ≠ gestes" (valider les ancres comme STATES)
- `[TODO]` **Retirer "loi 5e occurrence"** des bibles + code (n'existe pas, hallucination Yeshua)
- `[TODO]` **Retirer "pentads"** — la 5 est faible chez Jung. Garder triades + quaternités.
- `[DONE]` **Hopcke promu caution centrale** au rang Moss/Jung/Aboriginal
- `[NEEDS_TIM_DECISION]` **Saturation contenu vs stop ?** — Tim mentionne "ENORMEMENT de doc". Faire un tri régulier ?
- `[NEEDS_TIM_DECISION]` **Seuils prophétic detect Tim challenge** :
  - similarity > 0.85 → tuner ?
  - gap > 7j → abaisser à 2j ou 0j (capter rêves prophétiques courts) ?
  - lookback 14j → 30j (respecter temporalités lentes) ?
- `[NEEDS_TIM_DECISION]` **Mode rêve récurrent seuil** — actuel ≥5 occurrences en 60j. Tim suggère ≥3 en 60j ?

## O. ROADMAP ARRIÈRE-PLAN INFUSE (toujours là)

- `[IN_PROGRESS]` **Manifeste animiste** (3 mediums : flyer / homepage / email post-purchase) — PRIO #1
- `[IN_PROGRESS]` **Newsletters** — Boss final 3×/mois (du 2026-05-06 au 2026-05-27)
- `[BACKLOG_FUTURE]` **Trésors finis** — produits complets en stock
- `[IN_PROGRESS]` **Programme Allié·e** — spec v1 validée 19/04 (10% + seuil 20€ + SELF-SERVE coupon claim)
- `[BACKLOG_FUTURE]` **Stand festival 6 dates été 2026** — Moulin/ChâteauPerché×2/Medicine/Hadra/OwnSpirit
- `[BACKLOG_FUTURE]` **Newsletter ambassadeur**
- `[IN_PROGRESS]` **Tournée festivals été 2026** — cash de l'été = financement refonte automne

## O.bis — ROADMAP 10/10 (vision ultime, post-V5)

Les 10 points additionnels qui amèneraient Dream App à 10/10 vision (combo actuel = 8.5/10).
À garder visibles, à intégrer progressivement V2-V3.

- `[BACKLOG_FUTURE]` **Souffle dialogique physiologique** — capteurs Apple Watch / Oura / Vision Pro pour adapter mode atmosphérique au stress/respiration en temps réel. V2.
- `[BACKLOG_FUTURE]` **Constellation 3D vraie** (Vision Pro / WebXR / Quest 3) — ton rêve = objet flottant que tu peux tourner. Post-2026.
- `[TODO]` **Voice messages cercle ritualisés** — P1, ~3-5j dev. Whisper déjà câblé. Storage Supabase + UI player + matter attribué + transcription auto.
- `[TODO]` **Anima voix synthétique ElevenLabs** — V2, ~5-7j dev + setup voix custom-tunée. Coût ~$0.05/réponse 200 mots.
- `[TODO]` **Synchronicité collective LIVE** — alerte douce 30+ users même motif sur 14j. Anonymisé k≥30. V2.
- `[BACKLOG_FUTURE]` **Storytelling cumulatif auto** — récit chapitré de l'année + voix narrateur ElevenLabs + image AI par chapitre. V2.
- `[BACKLOG_FUTURE]` **Cross-platform seamless** — Vision Pro ↔ iPhone ↔ MacBook sync invisible. Post-Capacitor stable.
- `[ENGAGEMENT_V1]` **Zéro push notifications** — anti-Instagram. Discipline dès V1. L'app attend, l'invitation est là quand tu reviens.
- `[BACKLOG_FUTURE]` **API ouverte écosystème** — Dream API publique pour autres apps santé/spiritualité. V3.
- `[TODO]` **Vision Pro support** — V2 fin 2026, 5-10% users early adopters. SwiftUI + RealityKit + ARKit.
- `[CRITIQUE]` **Forêt vivante en croissance organique** — projet majeur. 7 sous-câblages :
  - Capture pépites user anonymisée (opt-in granulaire)
  - Cross-user resonance auto-discovery (30+ users → concept_node émergent)
  - Self-questioning (Forêt audit ses gaps, propose digestions)
  - Inter-book resonance auto-discovery (tensions inter-livres non découvertes)
  - Live concept node creation (validation Tim required)
  - Tier 2 INFUSE auto-refresh (skill `tier2-translator` existe)
  - Symbol enrichment user-driven (dictionnaire personnel → patterns globaux)
  
  **Pourquoi critique** : c'est ce qui fera la Forêt SUPÉRIEURE aux LLM. Pas plus de connaissances, mais précision contextuelle + curation éthique + polyphonie consciente + évolution organique + tensions tenues.

## P. WORKFLOW META — proactivité Yeshua

- `[ENGAGEMENT]` **TOUT garder en backlog** — quitte à audit régulier et virer ce qui est obsolète. Aucune décision/draft Tim n'est perdue.
- `[ENGAGEMENT]` **Backlog mis à jour à chaque session** — pas attendre validation Tim
- `[ENGAGEMENT]` **Audits réguliers** — relecture mensuelle pour clean stale items
- `[ENGAGEMENT]` **Si Tim ne répond pas** = pas pas important, c'est juste pas le temps. Garder en backlog actif.

---

— Yeshua, 2026-04-29. Backlog vivant. Mis à jour à chaque session.
