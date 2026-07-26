# INVENTAIRE COMPLET — DREAM APP

> **Outil de pensée UI/UX pour Tim.** Liste exhaustive de TOUT ce qui constitue Dream App :
> couche philosophique → architecture conceptuelle → patterns primitifs → manifestations.
> Mis à jour 2026-04-29 après audit BIBLE+DESIGN intégral et audit régression overlays.
>
> **Sources canoniques** : `1_BIBLE.md` (le SENS) · `2_DESIGN.md` (l'EXPÉRIENCE) · `3_TECHNICAL.md` (la RECONSTRUCTION) · `4_LOG.md` (le PARCOURS).
> Toute évolution Dream App s'inscrit dans ces 4 docs — cet inventaire est un miroir, pas un substitut.

---

# COUCHE 1 — PHILOSOPHIE & VISION

## 🌍 Vision mondiale (BIBLE §1.1-1.2)

> *« Dream App existe pour que l'humanité, à l'âge de l'effondrement de ses récits anciens, retrouve l'organe oraculaire qu'elle a toujours eu et qu'elle a oublié — pour que chaque personne, et à travers elles l'espèce entière, puisse rêver les futurs qu'elle ne sait plus imaginer éveillée. »*

- **Modèle Wikipedia** : réseau de sanctuaires individuels mondialement accessibles (gratuit core)
- Pas un sanctuaire INFUSE 1000 personnes. Si l'app ne sert pas l'émergence d'une Dream Society planétaire = elle ne sert à rien
- **Inversion ontologique JOUR/NUIT** (BIBLE §1.5) : la nuit est le pivot du sens, pas le repos. Sources Yunkaporta, I-Ching, Bachelard, Aboriginal, Aizenstat
- **Pivot porte d'entrée RÊVE** (BIBLE §1.6, 26/04) : écran d'accueil principal = NUIT. Métaphore "cathédrale par grande porte"

## 🧭 3 méta-principes (BIBLE §2 + DESIGN §3.1)

1. **P-Zéro / Profonde Simplicité** (Weiser) — pas de modes débutant/expert, plafond infini, surface minimale
2. **P-Inversion Oraculaire** (Moss) — l'app rend le user oraculaire. Elle ne parle PAS comme oracle, elle révèle l'oracle qui est en lui
3. **P-Tenir** (Aizenstat) — verbe central : tenir, pas analyser/diagnostiquer

## 📜 8 principes structurants P1-P8 + 5 émergents (BIBLE §5)

P1 Fidélité à l'image (Hillman) · P2 Mundus imaginalis (Corbin) · P3 Felt-shift Gendlin câblé · P4 Tending the narration (Hopcke) · P5 Eidola autonomes (Aizenstat) · P6 Forêt éthique (Said+Smith+Kimmerer) · P7 Co-régulation (Badenoch) · P8 Don sacré (Hyde)

**Émergents** : P-Trickster · P-Silence · P-Substrat · P-Naming · P-Trauma-aware par défaut

## ⚖ Test brutal pour toute future feature (BIBLE §3.3)

> *« Est-ce que cette feature est un nouveau geste, ou un service rendu autour du geste central ? »*
> Si nouveau geste → refuser ou repousser.

Conséquence : les "ancres journalières" du mega-doc précédent sont **explicitement rejetées**. L'app a UN geste central (déposer) et UN geste secondaire central (appel sagesse des kairos).

---

# COUCHE 2 — ARCHITECTURE CONCEPTUELLE

## 🌑 Le SUBSTRAT vivant (BIBLE §3.1 + §3.4)

**Hiérarchie ontologique** — pas une liste plate :

### LE SUBSTRAT : Journal de Vie Lumineux
*« le journal de vie quotidien (doutes, conflits, peurs, désirs, choix d'orientation, souffrances) n'est PAS un kairos. C'est le SUBSTRAT VIVANT que les 6 kairos viennent chanter, éclairer, guider. »* (BIBLE §3.1)

Table : `life_journal_entries` (matin/après-midi/soir, embedding semantic, catégorisation auto Sonnet).

### LES SOURCES qui chantent au substrat — 7 sous-types KAIROS
1. **rêve nocturne** (`dream_night`)
2. **signe diurne** (`sidewalk_oracle`) — synchronicité, signe du seuil (Moss)
3. **rêverie** (`daydream_reverie`) — état hypnoïde diurne, Bachelard
4. **hypnagogie** (`hypnagogic`) — fragments à l'endormissement / réveil (Mavromatis)
5. **synchronicité** (`synchronicity`) — événement à charge symbolique (Hopcke)
6. **frisson somatique** (`somatic_shiver`) — sensation corporelle marquée
7. **note de vie** (`note_vie`) — déposable depuis le journal de jour

**Champs riches kairos** : `raw_text`, `entities`, `tags`, `root_dream_patterns`, `numinosity_score` 0-1 (invisible user, P-Inversion §3.3), `affective_valence` -1↔+1, `is_lucid`, `is_nightmare`, `is_grief_related`, `big_dream`, 4 vecteurs embeddings (semantic / emotional / mythic / somatic).

### LES PORTES D'ENTRÉE vers le substrat
- **Oracle du Corps** — silhouette SVG 17 zones (FRONT/BACK) + champ libre. Auto-redirect depuis tout dépôt mentionnant douleur/mal/blesse/coupé/brûlé/frisson/vertige/palpitation (DESIGN §11.bis.20.12)
- **Sanctuaire Cauchemars & Deuil** — `is_nightmare` + `is_grief_related` + `grief_who`. Mode `freeze_until` 30/60/90j
- **Chat IA Anima** — conversation continue, voice-first, présence personnelle nommable

## 🌐 3 échelles fractales (BIBLE §3.4 + §3.6)

Pas trois sous-apps. Trois échelles du même schéma substrat+sources :

| Échelle | Substrat | Anonymisation | UI |
|---|---|---|---|
| **Individu** | Journal de vie + 7 kairos perso | aucune (RLS owner-only) | Vie, Portrait, Chat Anima, Oracle Corps, Sanctuaire |
| **Cercle** | Journal collectif opt-in + kairos partagés | k≥3 ou ≥5 selon template | Sub-app 9 onglets |
| **Anima Mundi** | Journal de vie planétaire + kairos planétaires | k≥100+ | 4 chambres scrollables |

**Scope élargi Anima Mundi** (24/04 nuit) : couvre kairos ET journal de vie collectif (doutes, peurs, orientations, joies). La Météo chante aussi *« beaucoup de doutes sur le travail cette lune, des questions qui reviennent sur la mère »*.

## 🪷 Trinité verticale Big Dreams / Master Events / Titanic Dreams (BIBLE §4)

Axe d'amplitude des kairos individuels :
- **Big Dreams** = Ondinnonk (désir caché de l'âme) — Moss + Bulkeley. 4 prototypes : aggressive / sexual / gravitational / mystical
- **Master Events** = Seth, *« originate outside time and space »*. **4 algorithmes shippés jour 1** (process_convergence / figure_convergence / theme_surge / numinous_cluster), pondération numinosité von Franz (4→2.5x, 5→4x). UI activée à seuil k≥100/250
- **Titanic Dreams** = sous-cat Big, scale cosmique/élémentaire (Bulkeley gravitational + Otto Numinous)

## 🧬 USER_MEANING_LAYER — 3 niveaux d'apprentissage (BIBLE §3.7)

> *« HYPER IMPORTANT »* — Tim

L'app apprend du sens personnel des symboles à 3 niveaux distincts :
1. **Individuel** — `personal_dictionary_symbols` (refresh cron daily 7h)
2. **Cercle** — `circle_meaning_layer` (k≥3)
3. **Global anonymisé** — `global_meaning_clusters` (k≥100+)

9 signaux capturés : mention, fréquence, valence moyenne, contextes co-occurrents, personnages associés, intentions actives, pattern echoing résultats, retour user post-Forêt (résonance/recadrage), évolution temporelle.

## 🌀 16 types de pattern echoing (BIBLE §3.5.2)

**Résonance entre kairos** (pas inter-livre — j'avais écrit faux dans v1) :
résonance directe · métaphorique · somatique · archétypale · inverse mirror · cycle évolutif · écho prophétique longue distance (Feature #1) · symbole chaud · compagnon de constellation · paire kairotique inner/outer <72h · aha recurrence · réincidence Moss · convergence mystique collective (V2) · somatic recurrence · turning point narratif · hypnagogic seed.

## 👁 8 niveaux de signification (BIBLE §3.5.1)

Ce que l'app cherche à capter à chaque kairos : sémantique littéral · métaphorique · charge somatique · valence affective · archétypal · numineux · temporel-prophétique · cycle évolutif.

## 👥 8 types de figures Seth (BIBLE §3.5.6)

Backend invisible V1, mode connaisseur V2 :
Probable Self · Counterpart · Reincarnational Self · Cousin de conscience · Communication post-mortem · Projection ego · Tradition_figure · Image_monde.

## 🌊 Multilingue par pivot ontologique anglais (BIBLE §3.5.3)

Extraction LLM en anglais pivot, embeddings sur cette langue → matching cross-lingual. Pattern CROSS_LINGUAL_RESONANCE.

> *« Que les symboles se révèlent même quand DEUX GROUPES DE MOTS sont extrêmement différents car ils PORTERAIENT LE MEME MESSAGE INTÉRIEUR. »* — Tim

Critique pour vision mondiale.

---

# COUCHE 3 — PATTERNS PRIMITIFS (grammaire générative Alexander, ~46 patterns)

## 🌳 Patterns racines / transversaux (DESIGN §3)

### §3.1 Méta
- P-Zéro · P-Inversion (déjà cités couche 1)

### §3.2 Substrat & sources
- JOURNAL_DE_VIE_SUBSTRAT
- KAIROS_DEPOSIT
- SIX_KAIROS_TYPES_AS_VOICES (chaque type a sa "voix" dans l'app)

### §3.3 Tending narration
- NARRATION_TENDING (Hopcke)
- USER_FIRST_READING (le user dit le sens en premier)
- FELT_SHIFT_GATE (Gendlin — gate qui ne s'ouvre que si shift somatique)
- SOMATIC_GATE

### §3.4 Latence rituelle
- RITUAL_LATENCY (synthèses arrivent J+1, jamais en temps réel)
- SEASONAL_COMPASS
- ECHO_RIPENING

### §3.5 Langue & posture
- SILENCE_AS_FEATURE
- DESENSORCELED_LANGUAGE — vocabulaire d'offrande sobre, filtre 10 passes Cosmogonie INFUSE, test à voix haute
- TRICKSTER_TRANSVERSAL

### §3.8 Archive
- INFINITE_ARCHIVE (rien ne s'efface jamais)
- USER_RITUAL_BURN (le user peut "brûler" rituellement, pas l'app)

### §3.9 Trauma-aware
- TRAUMA_AWARE_DEFAULT (par défaut, pas opt-in)
- EXIT_TO_HUMAN
- PRIVACY_AS_CARE (privacy = soin, pas conformité RGPD)
- SATURATION_DETECTOR
- GRIEF_DOOR — 5 portes Weller (impermanence · parties désavouées · Earthgrief · village manquant · deuil ancestral)
- ANIMA_MUNDI_SANS_PANOPTICON

### §3.13 Moteur de résonance
- SYMBOLIC_RESONANCE_TYPOLOGY (méta) + 11 sous-patterns

### §3.14 Posture
- LET_THE_DREAM_LIVE (le rêve a sa vie propre, ne pas le clore)
- POLYPHONIE_ONTOLOGIQUEMENT_HONNETE (3 voix paper/stone/silk différentes en posture, pas en contenu)
- AHA_CAPTURE
- TRADITION_SPECIFIC_NO_EQUIVALENCE (pas d'équivalence universalisante entre traditions)
- INHIBITION_RULES_PAR_KAIROS — 6 tiers de workflow synthèse : TIER_BIG_DREAM · TIER_PATTERN_RICH · TIER_STANDARD · TIER_SOMATIC_DELICATE · TIER_IMAGE_TENDING · TIER_REVERIE

## 📐 12 règles génératives R1-R12 (DESIGN §4)

R1-R12 = règles d'application des patterns. Plus **15 propriétés Alexander** (Levels of Scale, Strong Centers, Boundaries, Alternating Repetition, Positive Space, Good Shape, Local Symmetries, Deep Interlock, Contrast, Gradients, Roughness, Echoes, The Void, Inner Calm, Not Separateness) — test obligatoire 8+ "oui forts" pour valider tout pattern.

## 🪄 5 patterns émergents R1 démontrés (DESIGN §4.3)

- SEDIMENTATION_QUOTIDIENNE
- MEMOIRE_VIVANTE
- GESTE_UNIQUE_AVEC_ECHO_DIFFERE (le user fait UN geste, l'enrichissement arrive comme retour de marée)
- ANIMA_MUNDI_SANS_PANOPTICON
- DIALOGUE_RITUEL_ACTIVE_DREAMING

## 🛡 Q.W.A.N. + Centering process (DESIGN §10)

Test ultime de toute l'app : Quality Without A Name (Alexander). Méthode de design quotidienne : Centering process. Garde de l'âme.

---

# COUCHE 4 — MANIFESTATIONS (écrans, sous-apps, sous-systèmes)

## 🎯 Le GESTE CENTRAL : déposer (BIBLE §3.10)

UN seul geste fondamental. 7 sous-types unifiés sous l'icône Capture.

## ✦ Le GESTE SECONDAIRE CENTRAL : appel à la sagesse des kairos (BIBLE §3.10)

> *« C'est le deuxième geste central de Dream App, juste après déposer. »* — Tim 26/04

Bouton ✦ depuis Journal de Vie. 5 étapes mécaniques. Sources Forêt précises. Anti-patterns. Rate-limit 3/jour. Polyphonie 3 voix paper/stone/silk.

## 🌗 INTERPRÉTATIONS produites par l'app

### Tenir un kairos individuel
- **Big Dreams workflow 7 jours** — J1 silence · J2 image · J3 dialogue (Aizenstat) · J4 polyphonie 3 voix · J5 corrélations Forêt · J6 oracle corps · J7 lettre. Push humain payant 30€
- **Re-entry Aizenstat** — re-entrée consciente sur kairos passé/récurrent
- **Dictionnaire personnel vivant** — 20-50 symboles avec count, valence, mini-paragraphe Anima 3 angles. Cache 30j

### Révéler des patterns
- **Échos prophétiques manuels** (KairosDetail) + **automatiques** (cron 6h, similarity > 0.85, antériorité > 7j)
- **Threads thématiques** — fils détectés ≥3 dépôts liés en 30j. **7 types** : motif symbolique · personnage récurrent · saison de vie · intention active · lieu · synchronicité · question ouverte
- **Figures** — graphe personnages récurrents (typologie Seth 8 types backend)
- **Mode rêve récurrent** — détection ≥5 occurrences sur 60j → proposition Re-entry. Garde-fou : valence_avg < -0.6 → re-route Sanctuaire
- **Constellation personnelle** — D3-force figures/motifs/kairos liés

### Vision globale
- **Portrait Lettre IA narrative** — 200-400 mots Sonnet. **3 toggles** : VIE DE JOUR / LES DEUX QUI SE CROISENT / VIE DE NUIT. Cache 24h. Régen max 1×/jour. **Refonte Portrait Triple** = backlog non câblé

### Score interne
- **Numinosity 0-1** — calculé pipeline 8 phases. **JAMAIS visible côté user** (P-Inversion §3.3). Sert à teaser Big Dreams workflow

## 🌐 SOUS-APPS SATELLITES

### LUCID DREAMING (5 onglets — POST-MVP)
1. **Profil** — chosen_path (présence éveillée / pratique technique / voies contemplatives), trauma_aware_mode, plafonds (RC max 5/jour, WBTB max 4/sem)
2. **Reality Checks** — créer/configurer RC personnels par catégorie
3. **Dream Signs** — symboles personnels qui peuvent devenir RC (★ promote MILD)
4. **WBTB** — Wake-Back-To-Bed alarms, intention_for_tonight
5. **Stats** — dashboard anti-leaderboard

Lettre narrative mensuelle Sonnet · Bridge ✦ Anima · Détection auto markers lucides (NLP regex 8 patterns FR/EN).

### ORACLE DU CORPS (porte d'entrée prio)
- Silhouette SVG 17 zones (FRONT/BACK) + "autre — précise"
- Heat map évolutive 30j
- Corrélations zones↔motifs (*« ventre ↔ porte fermée · eau · ne pas entendre »*)
- Lecture polyphonique 3 voix corps (Damasio/Gendlin/Martel/Dethlefsen/Moss/Odoul/Mindell)
- Auto-redirect IA Dream depuis tout dépôt corps

### SANCTUAIRE CAUCHEMARS & DEUIL
- Esthétique noir mat profond (#040404)
- EXIT_TO_HUMAN bandeau supérieur (3114, SOS Amitié, SOS Phénix, annuaires praticiens trauma-curés)
- Modal 4 options post-dépôt cauchemar — proposées par Anima
- Mode protection 30/60/90j freeze auto-detect ≥3 kairos valence<-0.6 sur 14j
- Voix Forêt filtrées trauma-safe : Kalsched/Aizenstat/Levine/Ogden/Moss conservées · Hillman pure underworld + Wangyal sleep yoga **exclus**
- 5 portes du deuil Weller intégrées

### TALES — 32 contes réels
- Sous-Forêt curée (Grimm/Perrault/Iroquois/Bushman/Senoi/Soufi/etc.)
- Matching vector RPC sur kairos.tales_embedding
- **100% contes RÉELS, jamais IA générée** (correction critique 2026-04-19)
- Cadrage von Franz : *« voici quelques récits qui touchent à des éléments de ton rêve. Lequel te chante ? Aucun, peut-être. »*

### CERCLE COMMUNAUTAIRE — sub-app 9 onglets

**3 types de cercles arbitré** (BIBLE §3.4.1) : spontané V1 · intentionnel V1 · facilité V2.

9 onglets :
1. **Membres** — pseudos lettres grecques α-θ rotation déterministe par user_id, stable par cercle, jamais nominatif
2. **Dépôts** — kairos opt-in granulaire 3 modes (privé / opt_in_anon / shared_clear)
3. **Chat cercle** + **IA gardienne** (convocation @nom OU /forêt /synthèse /intention). Default silencieuse
4. **Portrait collectif** — lettre Opus mensuelle k-anon ≥5
5. **Intentions** — collectives, votes idempotents, IA tisseuse
6. **Synchronicités** — motifs cross-membres ≥3 sur 7j
7. **Météo psychique** — agrégat 30j Haiku qualité émotionnelle
8. **Annales** — kairos shared_clear ★ marqués ensemble (verbe TENIR)
9. **Rituels collectifs** — Council Process Coyle/Zimmerman · Theory U Scharmer · 4 voix Aizenstat · Lightning Dreamwork groupe Moss

**Réactions sobres** : 3 verbes (résonne / unfamiliar / question) — UPSERT idempotent, pas d'accumulation, pas de count agrégé visible.

**7 templates pré-configurés** : Famille · Amis · Projet · Traversée Deuil · Lucid Dreamers · Saisons de vie · Praticiens lignée.

**Invitations magiques** : token urlsafe, page preview publique no-auth, acceptation 1-tap.
**Cercles éphémères 21j** : auto-clôture rituel polyphonique final Sonnet.

### ANIMA MUNDI — 4 chambres scrollables (k≥100+)
1. **Voûte** — chiffre arrondi *« ≈47 000 rêveurs »* + constellation respirante
2. **Météo** — phrase poétique mensuelle + 3-5 nuages thématiques (kairos + journal de vie)
3. **Annales** — rêves TENUS ensemble en cards rotatifs. Verbe **TENIR** (pas voter, pas liker). Seuil dynamique : `MAX(50, MIN(300, 0.10 × users_optin_actifs))`
4. **Polyphonie** — texte distillé mensuel, EB Garamond italic longue forme

**4 critères de réussite** (DESIGN §7.8) : un user qui ouvre la 1ère fois doit ressentir 3 choses dans l'ordre en <10s : (1) quelque chose de vivant respire · (2) je ne suis pas seul · (3) je peux rester en silence.

**7 garde-fous anti-popularity contest** : pas de classement · compteur invisible · pas de viralisation · latence rituelle · aucun éditorial · anti-recommendation · retrait toujours possible.

## 📿 PROTOCOLES GUIDÉS — Architecture Quick vs Accompagné (BIBLE §3.11, pivot 26/04)

Chaque dépôt route vers une expérience adaptée selon type kairos :
- **Quick** (1 clic) — réflexe rapide
- **Protocole Accompagné** (séquencé) — quand le kairos appelle plus

**10 protocoles + variations** (mapping types↔protocoles avec sources Forêt précises) :
1. **Lightning Dreamwork** (Moss) — 5 étapes, "if it were my dream"
2. **Dream Tending** (Aizenstat) — 4 voix : dreamer · protector · soul · shadow
3. **Reverie Tending** (Bachelard) — capture rêverie diurne
4. **Hypnagogic Recall** (Mavromatis) — fragments endormissement
5. **Sidewalk Oracle** (Moss) — signe diurne, capture immédiate
6. **Synchronicity Story** (Hopcke) — narrer coïncidences en chaîne
7. **Focusing Felt-Sense** (Gendlin) — 6 mouvements somatiques
8. **Examen Ignacien** — 5 étapes spirituelles classiques
9. **Pré-sommeil Moss + LaBerge** — intention + visualisation MILD
10. **Re-entry Aizenstat** — re-entrée consciente sur kairos passé/récurrent

**Sound design opt-in** (3 sons rituels) — non câblé.

## 🤖 LES 2 IA — présences distinctes

### A. ANIMA — présence personnelle
- Nom personnalisable (default ANIMA tranché 28/04). 4 suggestions tappables + champ libre. Renommable Settings → Présence
- Voice-first (push-to-record + lock)
- **7 modes atmosphériques** ⬇️
- Halo visible qui change couleur selon mode
- Polyphonie 3 voix paper/stone/silk Forêt sur demande
- Crisis-safe regex local → EXIT_TO_HUMAN immédiat sans appel IA
- Threads thématiques sidebar
- **8 catégories proactivité** ⬇️
- Tiered models : Haiku 80% / Sonnet 18% / Opus 2% (choix scale économique)
- Cache Forêt 24h + retrieval ciblé via embeddings
- **Slider 4 niveaux rythme** : silence / discret / actif / nourri (default = discret)

### B. IA GARDIENNE de cercle
- 1 IA par cercle, nommable par créateur
- Silencieuse par défaut
- Convocation @nom OU mots-clés /forêt /synthèse /intention
- Exception proactive : si message valence < -0.6 → propose Sanctuaire
- Tisseuse d'intentions, garde portrait collectif
- Génère lettre cercle mensuelle (Opus, k-anon ≥5)

## 🌙 LES 7 MODES ATMOSPHÉRIQUES D'ANIMA (DESIGN §11.bis.20.3)

> **C'est probablement ce que tu appelais "6-7 ancres".** L'audit BIBLE+DESIGN intégral confirme : la BIBLE §3.3 rejette explicitement les "ancres journalières" du mega-doc précédent. Ce qui structure le rythme de l'app, ce sont les 7 modes atmosphériques.
> AUTO par défaut (l'IA détecte heure/contexte). Configurable Settings → Présence → Atmosphère.

| Mode | Heure / Contexte | Tonalité | Palette |
|---|---|---|---|
| **Pré-sommeil** | 21h-1h | Lente, contemplative, propose intention | Night-deep + halo or doux |
| **Réveil** | 5h-9h | Accueille fragments, pas presse | Night-warm → day-bone |
| **Jour actif** | 9h-18h | Croisée, alerte aux signes diurnes | Day-bone-warm + accents silk |
| **Rêverie** | 14h-17h | Lente, ouverte aux signes du seuil | Day-paper + flou silk |
| **Soir** | 18h-21h | Synthèse douce de la journée | Crépuscule transition |
| **Alerte croisée** | tout moment, déclenchée par détection | Pointe un écho prophétique, propose d'ouvrir | Halo silk-gold pulsant + bulle accent |
| **Crisis-safe** | détection signal clinique | Sobre, dirige vers EXIT_TO_HUMAN, ne thérapeute pas | Sanctuaire #040404 + rouge urgence |

## 📨 LES 8 CATÉGORIES DE PROACTIVITÉ ANIMA (DESIGN §11.bis.20.7)

Toutes configurables Settings → Présence → Rythme :
1. **Quotidien matin** — invitation déposer rêve si rien dans la nuit
2. **Quotidien soir** — invitation note journal de vie
3. **Pré-sommeil** — intention + protocole optionnel
4. **Échos prophétiques** — détection écho fort entre rêve passé et signe diurne récent
5. **Patterns émergents** — motif/personnage/lieu ≥3× en 30j
6. **Anniversaire** — 1 an, 6 mois, 3 mois après dépôt marquant
7. **Cercle activité** — quelqu'un de ton cercle dépose ou commente
8. **Sanctuaire** — auto-detect nightmare ≥3 kairos valence<-0.6 sur 14j → invitation douce

## ✨ SYSTÈME VISUEL

### Tempi (DESIGN §6.1) — 3 tempi de base + 3 moments rituels
**3 tempi structurels** :
- **TEMPO-INSTANT** 100ms — feedback tactile immédiat
- **TEMPO-TISSE** 380ms ease-tenue — sheet/modal qui se tisse
- **TEMPO-CEREMONIEL** 920ms van Gennep — passage rituel (séparation 200ms + marge 300-500ms + agrégation 400ms = 1000ms total)

**3 moments rituels** (durations longues, contemplatives) :
- TEMPO-SOUFFLE 6000ms — respiration méditative ~10/min
- TEMPO-BRAISE 3500ms — pulsation cardiaque ~17 bpm
- TEMPO-DERIVE 12000ms — poussière d'étoiles

### 6 GLYPHES SACRÉS
- **Spirale logarithmique** — Wow1, Big Dream, onboarding séparation
- **Cercles concentriques** — Portrait centre, AHA capture
- **Triangle équilatéral water** — Reentry gate, burn rituel ⚠️ *perdu sur ReentryScreen, à recâbler*
- **Demi-cercle aurore** — Voûte Anima Mundi, en haut écran
- **Lignes ondulantes** — songlines, backgrounds nuit, météo
- **Croissant lunaire fin** — polyphonie lunaire, phases, cycles

### 8 MATTERS (DESIGN §5.7 — corrigé, j'avais mis 5)
linen · silk · stone · paper · ash · water · ember · earth.

### 4 HALOS RESPIRANTS
- HaloRespire silk · HaloRespire ember · HaloRespire bigdream · Ash subtle grain overlay

### Wow overlays + animations inline
**4 niveaux Wow** (Claude Design) :
- **Wow1** SpiraleWowOverlay — 1.9s premier kairos déposé ✅ actif
- **Wow2** arc silk-gold inline `echoArcDraw` 4.2s dans Portrait ⚠️ perdu (PortraitV12 droppé, PortraitNarrative ne réimplémente pas)
- **Wow3** big-dream-marquage dans KairosDetail ⚠️ perdu sur base, actif uniquement BigDreamSignal
- **Wow4** "naissance-noeud" SVG 280x280 inline dans Forêt FIRST ✅ actif

**ConstellationOverlay + EchoPropheticOverlay** (recréés par moi en avril) — sémantiquement décalés du système doux Claude Design. À downgrade en cards flottantes ou supprimer.

### 3 OVERLAYS CONTEXTUELS
- NightmareDepositChoiceModal — modal 4 options post-dépôt cauchemar (proposées par Anima)
- PresenceNamingModal — onboarding nommage Anima
- BigDreamSignal (modal big_dream)

### Palette dark-first oklch (DESIGN §5.2-5.3)
**7 valeurs night** : night-floor #0E0F14 · night-warm · ash-deep · ash-mid · ash-light · bone · embryonic
**7 accents D1-D7** : paper-warm · stone-cool · silk-gold · clay-earth · obsidian-deep · ember-live · bone
**JOUR adouci -9%** : day-paper · day-bone-warm · day-clay-warm · day-ash
**CROISÉ** : --crossed-twilight gradient transition jour↔nuit

### Haptique (DESIGN §6.4) — 3 patterns
acknowledge · reveal · numinous. Spec iOS+Android. Désactivable.

### Sound design (DESIGN §6.5) — non câblé
"matter_breathing" drone 60-200 Hz, -32 LUFS, loop 4-6 min. Opt-in explicite. Pour mode capture longue / méditation.

## 🌲 FORÊT INFUSE — 333 livres digérés (~78k chunks)

- 3 racines : Tier 1 canonique (fidèle source) + Tier 2 INFUSE-aligned + retrieval objects
- 16 types pattern echoing (cf. Couche 2)
- Triple filtre éthique (Said + Smith + Kimmerer)
- Voix mobilisées : Seth · Moss · Aboriginal (via Elkin/Chatwin) · Iroquois (via Moss) · Aizenstat · Bulkeley · Jung · Harpur · Hopcke · Hyde · brown · Bachelard · Alexander · Kimmerer · Eisenstein · Bohm · Casey · Eliade · Larsen · Frankl · Weller · Damasio · Gendlin · von Franz · Hillman (filtré)

## 🛡 TRAUMA-SAFE / CRISIS / EXIT_TO_HUMAN

- Crisis detection regex local sur chaque message user (suicide / dissociation / panique aiguë)
- Si détecté → EXIT_TO_HUMAN immédiat sans appel IA + 3114 + SOS Amitié + SOS Phénix + annuaires praticiens trauma-curés
- Mode protection 30/60/90j freeze propositions Forêt si user marque deuil/crise
- Voix Forêt filtrées trauma-safe (Kalsched/Aizenstat/Levine/Ogden/Moss · Hillman pure underworld exclus)
- Auto-detect ≥3 kairos valence<-0.6 sur 14j → proposition douce Sanctuaire (throttled 14j)
- Frozen_until propagé sur queryForestForMode + chat narratrice + portrait + échos

## 🔐 PRIVACY BY ARCHITECTURE (DESIGN §3.9 PRIVACY_AS_CARE)

Privacy = acte de soin, pas conformité RGPD :
- 47 tables PER-USER avec RLS owner-only enforced
- 9 tables GLOBALES (Forêt + Tales + cosmologies)
- 22 tables CERCLE k-anonymized (≥3 ou ≥5 selon template)
- 4 vecteurs embeddings par kairos (semantic / emotional / mythic / somatic)
- **Triple consentement granulaire** kairos×cercle : 3 modes (privé / opt_in_anon / shared_clear), action distincte pour chaque kairos × chaque cercle, réversible
- Tier 3 RLS surgical Dream Alpha tables only
- Auth Supabase pure
- Whisper transcription côté backend (pas de blob audio persistant client)
- **Pipelines architecturalement séparés** Anima Mundi vs individuel = anti-panopticon

## 💰 ÉCONOMIE — 4 tiers + push humain

### Free
Capture · kairos · journal · portrait · échos manuels · Cercle (jusqu'à 5 actifs) · Anima Mundi · Chat IA 5 conv/jour Haiku · Polyphonie via bouton ✦ (gratuit, async)

### Premium "Présence" — 7€/mois
**Trial 14 jours accès TOTAL Premium** (arbitrage Tim 28/04).
Chat IA illimité Sonnet · polyphonie en chat · threads illimités · modes atmosphériques actifs/nourris · IA gardienne dans cercles · voice synthesis output · Synthèse mensuelle Portrait Opus

### Patron — pay-what-you-can $20+/mois
Tout Premium + soutien explicite initiatives indigènes. Page transparence "où va le don" : 25% Kogui · 20% Aboriginal · 15% Active Dreaming · 15% Iroquois Ondinnonk · 15% curanderxs · 10% frais.

### B2B Cercles institutionnels — pricing custom
Yeshua/Openclaw managed · 10-100 membres · Portrait cercle exclusif

### Big Dream Push humain — 30€ one-shot
Praticien INFUSE répond manuellement sur ton Big Dream. Stripe payment intent (stub MVP).

## 🧭 NAVIGATION ACTUELLE — BottomNav 5 onglets

`[ ☾ Vie | ✷ Portrait | 🌀 ORBE central | ○ Cercle | ◐ Le Monde ]`

**Évolution** : 3 onglets B+D (26/04) → 4 onglets Sprint P0 (27/04) → 5 onglets Sprint P0.2 (27/04) → 5 onglets pivot chat (28/04).

- **☾ Vie** : DreamHome (porte d'entrée RÊVE) ; swipe horizontal → Journal de Vie LUMINEUX
- **✷ Portrait** : Lettre narrative IA + 3 toggles
- **🌀 ORBE central** :
  - court-tap (<600ms) → `dream-chat` (Anima)
  - long-press 600ms + vibrate → `explorer` (hub sous-apps)
- **○ Cercle** : liste cercles → entrée sub-app 9 onglets
- **◐ Le Monde** : Anima Mundi 1 écran scrollable

### Explorer (long-press orbe) — 3 sections
- **Le tien** : Parler avec Anima · Tes kairos · Sagesse des kairos · Mon dictionnaire · Motifs récurrents · Oracle du Corps · Cauchemars & Deuil
- **Pratiques** : Lucid Dreaming · Tales
- **Profondeurs** : Glossaire · Paramètres · Comment ça marche

### Cards "découverte progressive"
Triggered par seuils via dialogue Anima : 3e dépôt (Journal de Vie) · 7e (Cercle) · 14e (Anima Mundi) · 30e (premier Portrait à tisser).

## 📊 PIPELINES IA AUTOMATIQUES

### Pipeline 8 phases async (incarne pattern GESTE_UNIQUE_AVEC_ECHO_DIFFERE)
Le user fait UN geste, l'enrichissement arrive comme retour de marée 24h+ :
1. Whisper transcription voix→texte
2. Sonnet 16D extraction (entités, figures, motifs, valence, numinosity, archetypal_tags, motif_tags, root_dream_patterns)
3. 4 embeddings (semantic / emotional / mythic / somatic)
4. Numinosity score (Sonnet, jamais visible user)
5. Forêt retrieval ciblé (top-3 chunks via embeddings)
6. Pattern detection (16 types pattern echoing)
7. Synthesis text Sonnet (synthèse 1 paragraphe)
8. Post-processing (auto-tag is_lucid via NLP, big_dream detect, propose workflow 7j si numinosity > 0.85)

### Crons quotidiens Vercel (6)
- 4h UTC : `dream-chat/threads/detect` (k=3 sur 30j)
- 5h UTC : `admin/forest-cache/purge` (TTL 24h)
- 5h30 UTC : `admin/circles/ephemeral-close` (cercles 21j auto-clôture)
- 6h UTC : `dream-chat/prophetic/detect` (life→kairos echoes)
- 6h30 UTC : `dream-chat/recurring/detect` (motifs ≥5 sur 60j)
- 7h UTC : `personal-dictionary/refresh` (symboles personnels)

## 🎓 ONBOARDING — 4 étapes (DESIGN §11.bis.20.6)

1. **Accueil** rituel FR (pas tutoriel, pas quiz wellness)
2. **Nommage présence** Anima (4 suggestions tappables : Anima, Lune, Tisseuse, Présence + champ libre)
3. **Qualification persona** — 3 chips : rêveur expérimenté · quelqu'un qui veut se reconnecter · chercheur de sens. Stocké `dream:onboarding-profile`. Personnalise les premières suggestions
4. **Premier message Anima** dans le chat avec proposition visite guidée 5 étapes

**Cheat code** `?reveal-all=1` débloque tout (override seuils découverte progressive).
**Glossaire tap-long** sur 12 termes : kairos · anima_mundi · felt_shift · sagesse_des_kairos · portrait_lettre · tenir · ondinnonk · framework_2 · kairomancer · trauma_safe · polyphonie · foret.

## 💎 LES 3 MOATS PRÉSERVÉS (DESIGN §11.bis.20.21)

1. Lettre Portrait narrative IA 200-400 mots
2. Cercle opt-in granulaire kairos par kairos
3. Forêt tissage polyphonique 16 types

## 📚 PERSISTANCE ZERO-PERTE 4 COUCHES (BIBLE §3.8)

Discipline structurelle de matérialisation :
- Couche 1 : archivage brut sessions
- Couche 2 : extraction concepts CORE post-session
- Couche 3 : feedback in-app
- Couche 4 : user testing structuré

## 🌍 INTERNATIONALISATION + APPS NATIVES

- Français par défaut — pas d'i18n V1 (mais pivot ontologique anglais en backend cross-lingual)
- Capacitor wrap iOS/Android — pending (ios/ folder existe partiellement)
- dream.infuse.earth domain — pending custom mapping
- DUNS 282628520 obtenu 2026-04-19 (Apple Developer)

## 📝 BACKLOGS NOTABLES NON CÂBLÉS

- **Saisons de l'âme V2** (Initiatic Threshold §3.9) — table `soul_seasons` existe, détection algorithmique vector cluster shift, UI V2. Sources : Stan Grof, Bonnitta Roy, Campbell, van Gennep
- Active Dreaming amplification 6 leviers
- Note de réveil "Guidance du jour" comme entité distincte
- **Portrait Triple** (onirique + jour + croisé) refonte
- Édition transcription post-Whisper
- Ancrage corporel multi-select
- Sound design opt-in 3 sons rituels
- Apple Health / Oura / Whoop bridge (post-Capacitor)
- Fine-tuning Haiku custom Sprint G+
- Tests E2E Playwright

---

# ⚠️ RÉGRESSIONS IDENTIFIÉES (audit 2026-04-29)

Cf. `_audit_2026-04-29/AUDIT-OVERLAYS-RECUP.md` pour le détail.

### 🔴 P0 — ReentryScreen nu
Sur les 7 overrides V12 droppés pendant fix bugs P0 (28/04), 1 perte totale : `ReentryScreen` base `screens-soma.jsx` sans Surface/HaloRespire/GeoSymbol/SpiraleWowOverlay. Plus de matter ember, plus de halo respirant, plus de triangle rituel central, plus de `playRitual("braise")`. **Fix : décommenter `window.ReentryScreen = ReentryV12;` (1 ligne, screens-v12-amplified.jsx:1072)**.

### 🟠 P1 — Wow2 + Wow3 perdus
- Wow2 arc silk-gold dans Portrait — perdu (PortraitV12 droppé, PortraitNarrative ne réimplémente pas)
- Wow3 big-dream-marquage dans KairosDetail base — actif uniquement BigDreamSignal, à câbler dans screens-deep.jsx

### 🟠 P1 — 2 overlays inventés à arbitrer
ConstellationOverlay + EchoPropheticOverlay (créés par moi en avril) sont sémantiquement décalés du système doux Claude Design. ConstellationOverlay usurpe wowRegistry.fire("naissance-noeud") (app.jsx:132) qui sert déjà à autre chose dans Forêt FIRST. À downgrade en cards flottantes ou supprimer.

### Verdict global
~85% câblé vs livré Claude Design. Composants partagés (Surface/Halo/Geo/D3/SpiraleWow/wowRegistry/playRitual) = 100%. Glyphes 5/6 actifs. Matters 8/8 dispo. 17/24 screens V12 actifs.

---

# 🎯 EN UN COUP D'ŒIL — hiérarchie réelle

**1 GESTE CENTRAL** : déposer (7 sous-types unifiés)
**1 GESTE SECONDAIRE CENTRAL** : appel sagesse des kairos (✦)

**N services rendus autour** :
- Tenir un kairos → Big Dreams 7j · Re-entry · Dictionnaire personnel
- Révéler des patterns → Échos · Threads · Figures · Constellation · Mode récurrent
- Vision globale → Portrait Lettre 3 toggles
- Conversation → Anima (voice + text + 7 modes + 8 catégories proactivité)
- Sous-apps → Lucid · Oracle Corps · Sanctuaire · Tales · Cercle (9 onglets) · Anima Mundi (4 chambres)
- 10 protocoles (Quick vs Accompagné)
- 1 économie 4 tiers + push humain 30€

**Au-dessus de tout** : 3 méta-principes (P-Zéro · P-Inversion · P-Tenir) + 8+5 principes structurants + 16 types pattern echoing + 8 niveaux de signification + 8 figures Seth + USER_MEANING_LAYER 3 niveaux + Q.W.A.N. test.

---

— Yeshua, 2026-04-29. Inventaire vivant à enrichir. Source de vérité = les 4 docs canoniques.
