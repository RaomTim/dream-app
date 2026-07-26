/* global window */
// ═════════════════════════════════════════════════════════════════════
// PROTOCOLES CATALOG — Architecture Quick vs Protocole Accompagné
// Spec : 1_BIBLE §3.11 + 2_DESIGN §11.bis.13
// Yeshua, 2026-04-26 nuit profonde.
//
// 9 protocoles (8 cards + 1 "Fin de Journée") + 1 sur kairos déjà déposé (Réentrée).
//
// Schéma d'une étape :
//   {
//     id: "snake_case_unique_within_protocol",
//     type: "textarea" | "title_short" | "chips" | "chips_multi" | "slider"
//           | "binary" | "two_textareas" | "body_zone" | "breathing"
//           | "voice_only" | "info",
//     question: "texte FR",
//     question_en: "EN text",            // optionnel
//     hint?: "petite indication italique",
//     placeholder?: "...",
//     chips?: [["key","label"], ...],
//     min?: number, max?: number,        // pour slider
//     duration?: number,                 // pour breathing/info auto-advance ms
//     skippable?: true,                  // bouton "passer cette question"
//     subQuestion?: "second prompt for two_textareas"
//   }
//
// Cible storage : kairos.protocol_session_data JSONB
//   { protocol_id, language, steps: [{ id, type, answer, skipped }], completed_at }
// ═════════════════════════════════════════════════════════════════════

const PROTOCOLES_CATALOG = {

  // ─────────────────────────────────────────────────────────────
  // 1. 🌀 LIGHTNING_DREAMWORK (Moss) — pour rêve
  // ─────────────────────────────────────────────────────────────
  lightning_dreamwork: {
    id: "lightning_dreamwork",
    glyph: "◐",
    title: "Lightning Dreamwork",
    title_en: "Lightning Dreamwork",
    subtitle: "8 étapes · ~5 min · pour un rêve",
    subtitle_en: "8 steps · ~5 min · for a dream",
    source: "Robert Moss — Conscious Dreaming + Active Dreaming",
    target: "kairos",            // → POST/PATCH /api/kairos
    target_type: "reve",         // kairos_type
    category: "kairos",          // pour groupage UI
    category_label: "Pour un rêve nocturne",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Raconte le rêve au présent, comme s'il se passait maintenant.",
        question_en: "Tell the dream in present tense, as if it's happening now.",
        hint: "voix possible · pas de censure",
        placeholder: "je suis dans une maison que je ne connais pas…",
      },
      {
        id: "titre_instinctif",
        type: "title_short",
        question: "Si tu devais donner un titre à ce rêve, en 3-5 mots ?",
        question_en: "If you had to give this dream a title, in 3-5 words?",
        hint: "Moss : nommer un rêve lui donne forme",
        placeholder: "la maison qui respire…",
      },
      {
        id: "emotion_dominante",
        type: "chips",
        question: "Émotion dominante ?",
        question_en: "Dominant emotion?",
        chips: [
          ["peur",     "peur"],
          ["joie",     "joie"],
          ["tristesse","tristesse"],
          ["colere",   "colère"],
          ["surprise", "surprise"],
          ["paix",     "paix"],
          ["autre",    "autre"],
        ],
        skippable: true,
      },
      {
        id: "lettre_au_reveur",
        type: "textarea",
        question: "Si ce rêve était une lettre, qu'est-ce qu'il essaie de te dire ?",
        question_en: "If this dream were a letter, what is it trying to tell you?",
        hint: "USER_FIRST_READING — toi d'abord, l'oracle après",
        placeholder: "il me dit que…",
      },
      {
        id: "personne_du_reve",
        type: "chips",
        question: "Qui rêvait quoi dans ce rêve ? La toi d'aujourd'hui — ou une autre ?",
        question_en: "Who was dreaming what in this dream? Today-you, or another?",
        hint: "Moss : probable self / counterpart",
        chips: [
          ["aujourd_hui",  "moi d'aujourd'hui"],
          ["enfant",       "moi enfant"],
          ["future",       "moi futur·e"],
          ["counterpart",  "un·e autre moi"],
          ["pas_sur",      "pas sûr·e"],
        ],
        skippable: true,
      },
      {
        id: "geste_honorifique",
        type: "textarea",
        question: "Si tu pouvais faire UN GESTE dans le monde éveillé qui honore ce rêve, ce serait quoi ?",
        question_en: "If you could do ONE gesture in the waking world to honor this dream, what would it be?",
        hint: "Moss : honoring action — le rêve sans geste reste lettre morte",
        placeholder: "écrire à…, allumer une bougie, marcher jusqu'à…",
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "Où ça résonne dans ton corps ?",
        question_en: "Where does it resonate in your body?",
        hint: "1 zone par défaut · 6 zones opt-in",
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. 🌀 DREAM_TENDING (Aizenstat) — pour rêve
  // ─────────────────────────────────────────────────────────────
  dream_tending: {
    id: "dream_tending",
    glyph: "◐",
    title: "Dream Tending",
    title_en: "Dream Tending",
    subtitle: "10 étapes · ~8 min · pour un rêve",
    subtitle_en: "10 steps · ~8 min · for a dream",
    source: "Stephen Aizenstat — Dream Tending",
    target: "kairos",
    target_type: "reve",
    category: "kairos",
    category_label: "Pour un rêve nocturne",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Raconte le rêve. Sans précipiter.",
        question_en: "Tell the dream. Without rushing.",
        placeholder: "je marchais dans…",
      },
      {
        id: "image_dominante",
        type: "textarea",
        question: "Quelle image émerge en premier quand tu penses au rêve ?",
        question_en: "What image emerges first when you think of the dream?",
        hint: "une seule. la première qui arrive.",
        placeholder: "un escalier, un visage, une couleur…",
      },
      {
        id: "tending_image",
        type: "textarea",
        question: "Reste avec cette image. Que vois-tu de plus si tu prends le temps ?",
        question_en: "Stay with this image. What more do you see if you take the time?",
        hint: "Aizenstat : tend the image — laisse-la s'animer",
      },
      {
        id: "presence_figures",
        type: "textarea",
        question: "Y a-t-il des figures (humaines, animales, autres) ? Lesquelles ?",
        question_en: "Are there figures (human, animal, other)? Which ones?",
        placeholder: "une vieille femme, un chien noir, une voix…",
      },
      {
        id: "eidolon_principale",
        type: "textarea",
        question: "Choisis la figure la plus présente. Décris-la en 5 mots.",
        question_en: "Choose the most present figure. Describe it in 5 words.",
        hint: "Aizenstat : eidolon — la figure vivante du rêve",
      },
      {
        id: "body_to_body",
        type: "textarea",
        question: "Si tu te tiens à côté de cette figure dans le rêve, qu'est-ce que ton corps ressent ?",
        question_en: "If you stand beside this figure in the dream, what does your body feel?",
        hint: "body-to-body — pas un concept, une sensation",
      },
      {
        id: "ce_quelle_veut",
        type: "textarea",
        question: "Que semble vouloir cette figure ?",
        question_en: "What does this figure seem to want?",
        hint: "sans interpréter — écouter",
      },
      {
        id: "cadeau",
        type: "textarea",
        question: "Cette figure t'apporte quelque chose. Quoi ?",
        question_en: "This figure brings you something. What?",
        hint: "Aizenstat : the gift — chaque eidolon porte un don",
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "Où ça résonne dans ton corps ?",
        question_en: "Where does it resonate in your body?",
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. 🌀 SIDEWALK_ORACLE_TRACKING (Moss) — pour signe diurne
  // ─────────────────────────────────────────────────────────────
  sidewalk_oracle: {
    id: "sidewalk_oracle",
    glyph: "◐",
    title: "Sidewalk Oracle",
    title_en: "Sidewalk Oracle",
    subtitle: "6 étapes · ~4 min · pour un signe diurne",
    subtitle_en: "6 steps · ~4 min · for a daytime sign",
    source: "Robert Moss — Sidewalk Oracles",
    target: "kairos",
    target_type: "signe",
    category: "kairos",
    category_label: "Pour un signe du jour",
    steps: [
      {
        id: "description",
        type: "textarea",
        question: "Décris ce que tu as vu, entendu, croisé.",
        question_en: "Describe what you saw, heard, encountered.",
        placeholder: "un corbeau s'est posé devant moi…",
      },
      {
        id: "heure_lieu",
        type: "textarea",
        question: "Heure et lieu ?",
        question_en: "Time and place?",
        placeholder: "ce matin, en sortant de chez moi…",
        hint: "court, précis",
      },
      {
        id: "etat_avant",
        type: "textarea",
        question: "État intérieur juste avant que ça arrive ?",
        question_en: "Inner state just before it happened?",
        hint: "à quoi tu pensais, ce que tu vivais",
      },
      {
        id: "charge",
        type: "slider",
        question: "Charge — à quel point ça t'a marqué ?",
        question_en: "Charge — how much did it strike you?",
        min: 1, max: 5,
        hint: "1 = à peine · 5 = saisissant",
      },
      {
        id: "lecture_kairomancer",
        type: "textarea",
        question: "Si ce signe te répondait à une question, ce serait quelle question ?",
        question_en: "If this sign answered a question, what question would it be?",
        hint: "Moss : kairomancer — l'oracle du seuil",
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. 🌀 REVERIE_TENDING (Bachelard) — pour rêverie diurne
  // ─────────────────────────────────────────────────────────────
  reverie_tending: {
    id: "reverie_tending",
    glyph: "◐",
    title: "Reverie Tending",
    title_en: "Reverie Tending",
    subtitle: "6 étapes · ~5 min · pour une rêverie",
    subtitle_en: "6 steps · ~5 min · for a reverie",
    source: "Gaston Bachelard — La Poétique de la Rêverie",
    target: "kairos",
    target_type: "reverie",
    category: "kairos",
    category_label: "Pour une rêverie diurne",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Décris la rêverie. Pas l'analyse — l'image.",
        question_en: "Describe the reverie. Not the analysis — the image.",
        placeholder: "j'étais en train de regarder par la fenêtre…",
      },
      {
        id: "element_dominant",
        type: "chips",
        question: "Élément dominant ?",
        question_en: "Dominant element?",
        chips: [
          ["eau",   "eau"],
          ["air",   "air"],
          ["feu",   "feu"],
          ["terre", "terre"],
        ],
        hint: "Bachelard : 4 imaginations matérielles",
      },
      {
        id: "cosmique_intime",
        type: "chips",
        question: "Cosmique ou intime ?",
        question_en: "Cosmic or intimate?",
        chips: [
          ["cosmique", "cosmique — vaste, ouvert"],
          ["intime",   "intime — proche, niché"],
        ],
        hint: "Bachelard : la rêverie a deux pôles",
      },
      {
        id: "elle_sallonge",
        type: "textarea",
        question: "Tu prolonges la rêverie 30 secondes en imaginant. Que se passe-t-il ?",
        question_en: "You extend the reverie 30 seconds by imagining. What happens?",
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "Où ça résonne dans ton corps ?",
        question_en: "Where does it resonate in your body?",
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. 🌀 HYPNAGOGIC_RECALL (Mavromatis) — pour hypnagogie
  // ─────────────────────────────────────────────────────────────
  hypnagogic_recall: {
    id: "hypnagogic_recall",
    glyph: "◐",
    title: "Hypnagogic Recall",
    title_en: "Hypnagogic Recall",
    subtitle: "5 étapes · ~3 min · pour une hypnagogie",
    subtitle_en: "5 steps · ~3 min · for hypnagogia",
    source: "Andreas Mavromatis — Hypnagogia",
    target: "kairos",
    target_type: "hypnagogie",
    category: "kairos",
    category_label: "Pour une hypnagogie",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Note ce qui te reste — image, son, sensation.",
        question_en: "Note what remains — image, sound, sensation.",
        hint: "rapide, sans formuler joliment",
      },
      {
        id: "modalite",
        type: "chips_multi",
        question: "Modalité(s) ?",
        question_en: "Modality(ies)?",
        chips: [
          ["visuelle",       "visuelle"],
          ["auditive",       "auditive"],
          ["kinesthesique",  "kinesthésique"],
          ["verbale",        "verbale"],
          ["autre",          "autre"],
        ],
      },
      {
        id: "categorie",
        type: "chips",
        question: "Catégorie Mavromatis ?",
        question_en: "Mavromatis category?",
        chips: [
          ["geometric", "géométrique"],
          ["face",      "visage"],
          ["scene",     "scène"],
          ["phrase",    "phrase entendue"],
          ["autre",     "autre"],
        ],
      },
      {
        id: "veille_sommeil",
        type: "binary",
        question: "Tu allais t'endormir, ou tu te réveillais ?",
        question_en: "Were you falling asleep, or waking?",
        chips: [
          ["endormissement", "endormissement"],
          ["reveil",         "réveil"],
        ],
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. 🌀 SYNCHRONICITY_STORY (Hopcke) — pour synchronicité
  // ─────────────────────────────────────────────────────────────
  synchronicity_story: {
    id: "synchronicity_story",
    glyph: "◐",
    title: "Synchronicity Story",
    title_en: "Synchronicity Story",
    subtitle: "7 étapes · ~5 min · pour une synchronicité",
    subtitle_en: "7 steps · ~5 min · for a synchronicity",
    source: "Robert Hopcke — There Are No Accidents",
    target: "kairos",
    target_type: "synchronicite",
    category: "kairos",
    category_label: "Pour une synchronicité",
    steps: [
      {
        id: "deux_evenements",
        type: "two_textareas",
        question: "L'événement intérieur (ce qui était dans ta tête, ton cœur) ?",
        question_en: "The inner event (what was in your head, your heart)?",
        subQuestion: "L'événement extérieur (ce qui s'est passé dans le monde) ?",
        subQuestion_en: "The outer event (what happened in the world)?",
        hint: "deux côtés d'une même histoire",
      },
      {
        id: "decalage_temporel",
        type: "textarea",
        question: "Décalage temporel entre les deux ?",
        question_en: "Time gap between the two?",
        placeholder: "juste avant · le lendemain · 3 semaines après…",
      },
      {
        id: "charge_affective",
        type: "slider",
        question: "Charge affective ?",
        question_en: "Affective charge?",
        min: 1, max: 5,
        hint: "1 = léger · 5 = bouleversant",
      },
      {
        id: "recit_narratif",
        type: "textarea",
        question: "Raconte les deux comme une seule histoire.",
        question_en: "Tell both as a single story.",
        hint: "Hopcke : narrative event — la synchro est récit",
      },
      {
        id: "recurrence",
        type: "binary",
        question: "Cette synchronicité s'inscrit-elle dans une série ?",
        question_en: "Is this synchronicity part of a series?",
        chips: [
          ["oui",  "oui — d'autres signes pareils"],
          ["non",  "non — isolée"],
          ["pas_sur", "pas sûr·e"],
        ],
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "Où ça résonne dans ton corps ?",
        question_en: "Where does it resonate in your body?",
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. 🌀 FOCUSING_FELT_SENSE (Gendlin) — pour frisson somatique
  // ─────────────────────────────────────────────────────────────
  focusing_felt_sense: {
    id: "focusing_felt_sense",
    glyph: "◐",
    title: "Focusing — Felt Sense",
    title_en: "Focusing — Felt Sense",
    subtitle: "6 étapes · ~6 min · pour un frisson",
    subtitle_en: "6 steps · ~6 min · for a body charge",
    source: "Eugene Gendlin — Focusing",
    target: "kairos",
    target_type: "frisson",
    category: "kairos",
    category_label: "Pour un frisson somatique",
    steps: [
      {
        id: "localisation",
        type: "body_zone_full",
        question: "Où, dans ton corps ?",
        question_en: "Where, in your body?",
        hint: "silhouette cliquable — front + back",
      },
      {
        id: "qualite_texture",
        type: "chips",
        question: "Si ce frisson avait une texture, ce serait quoi ?",
        question_en: "If this charge had a texture, what would it be?",
        chips: [
          ["chaud",     "chaud"],
          ["froid",     "froid"],
          ["lourd",     "lourd"],
          ["leger",     "léger"],
          ["serre",     "serré"],
          ["ouvert",    "ouvert"],
          ["palpitant", "palpitant"],
          ["autre",     "autre"],
        ],
      },
      {
        id: "handle_word",
        type: "title_short",
        question: "Quel mot capte au mieux cette sensation ?",
        question_en: "Which word best captures this sensation?",
        hint: "Gendlin : handle word — un mot qui tient",
        placeholder: "tendu · doux · vibrant…",
      },
      {
        id: "resonating",
        type: "binary",
        question: "Pose le mot sur la sensation. Est-ce que ça résonne ?",
        question_en: "Place the word on the sensation. Does it resonate?",
        chips: [
          ["oui",     "oui — c'est juste"],
          ["presque", "presque — pas tout à fait"],
          ["non",     "non — autre mot"],
        ],
      },
      {
        id: "asking",
        type: "textarea",
        question: "Demande à la sensation : « qu'est-ce qui te fait être là ? » — silence 30 secondes — puis écris ce qui vient.",
        question_en: "Ask the sensation: \"what makes you here?\" — 30s silence — then write what comes.",
        hint: "Gendlin : asking step",
      },
      {
        id: "aha_handle",
        type: "aha_capture",
        question: "Où est ton aha ? Et le handle final ?",
        question_en: "Where is your aha? And the final handle?",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 8. 🌀 FIN_DE_JOURNEE (Examen Ignacien adapté) — pour Journal de Vie
  // ─────────────────────────────────────────────────────────────
  fin_de_journee: {
    id: "fin_de_journee",
    glyph: "☉",
    title: "Fin de Journée",
    title_en: "End of Day",
    subtitle: "4 étapes · ~5 min · pour le Journal de Vie",
    subtitle_en: "4 steps · ~5 min · for Life Journal",
    source: "Examen Ignacien adapté · Moss + Wangyal",
    target: "journal",            // → POST /api/journal/entries
    target_type: "note",
    category: "journal",
    category_label: "Pour ton Journal de Vie (le soir)",
    steps: [
      {
        id: "gratitude",
        type: "textarea",
        question: "Qu'est-ce qui mérite ta gratitude aujourd'hui ?",
        question_en: "What deserves your gratitude today?",
        hint: "voix possible · sans hiérarchiser",
      },
      {
        id: "mouvement_interieur",
        type: "chips",
        question: "Quel mouvement t'a traversé aujourd'hui ?",
        question_en: "What movement crossed through you today?",
        chips: [
          ["joie",     "joie"],
          ["desir",    "désir"],
          ["peur",     "peur"],
          ["paix",     "paix"],
          ["colere",   "colère"],
          ["tristesse","tristesse"],
          ["autre",    "autre"],
        ],
        hint: "Examen ignacien : noter les mouvements",
      },
      {
        id: "question_ouverte",
        type: "textarea",
        question: "Y a-t-il une question qui s'est posée à toi sans réponse ?",
        question_en: "Is there a question that arose without an answer?",
      },
      {
        id: "intention_de_nuit",
        type: "textarea",
        question: "Avec quoi veux-tu t'endormir ?",
        question_en: "What do you want to sleep with?",
        hint: "tu peux ensuite enchaîner sur le rituel pré-sommeil",
        placeholder: "une image, un mot, une question pour la nuit…",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 9. 🌙 PRE_SOMMEIL — rituel temporel (incubation Moss + LaBerge MILD)
  // ─────────────────────────────────────────────────────────────
  pre_sommeil: {
    id: "pre_sommeil",
    glyph: "🌙",
    title: "Pré-sommeil — Incubation",
    title_en: "Pre-sleep — Incubation",
    subtitle: "6 étapes · ~6 min · rituel du soir",
    subtitle_en: "6 steps · ~6 min · evening ritual",
    source: "Robert Moss + Stephen LaBerge (MILD) + Tenzin Wangyal — Tibetan Yogas of Dream",
    target: "kairos",
    target_type: "note",          // dépôt léger pour traçer l'intention
    category: "ritual",
    category_label: "Rituels du temps",
    steps: [
      {
        id: "bilan_journee",
        type: "textarea",
        question: "Ta journée en une phrase ?",
        question_en: "Your day in one sentence?",
        placeholder: "courte, sans soigner",
      },
      {
        id: "question_incubation",
        type: "textarea",
        question: "Y a-t-il une question que tu veux poser à tes rêves cette nuit ?",
        question_en: "Is there a question you want to ask your dreams tonight?",
        hint: "Moss : dream incubation — semer pour la nuit",
      },
      {
        id: "image_graine",
        type: "textarea",
        question: "Une image qui pourrait être ton point d'entrée dans le rêve ?",
        question_en: "An image that could be your entry point into the dream?",
        placeholder: "une porte, un visage, une lumière…",
      },
      {
        id: "intention_mild",
        type: "textarea",
        question: "Si tu rêves cette nuit — comment veux-tu y être ?",
        question_en: "If you dream tonight — how do you want to be there?",
        hint: "LaBerge MILD : « Si je rêve, je deviens lucide »",
        placeholder: "présent·e, lucide, à l'écoute…",
        skippable: true,
      },
      {
        id: "respiration",
        type: "breathing",
        question: "Trois cycles. Inspire 4, retiens 4, expire 6.",
        question_en: "Three cycles. Inhale 4, hold 4, exhale 6.",
        duration: 42000,           // 3 cycles × 14s
      },
      {
        id: "bonne_traversee",
        type: "info",
        question: "Le rêve sait. Bonne traversée.",
        question_en: "The dream knows. Safe crossing.",
        duration: 4000,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 10. 🪷 REENTRY (Aizenstat + Jung active imagination) — sur kairos déjà déposé
  // Note : étapes 1-2 (gate trauma-safe + choix chemin) sont gérées AVANT par
  // ReentryScreen actuel (screens-soma.jsx). Ce protocole est appelé après.
  // ─────────────────────────────────────────────────────────────
  reentry: {
    id: "reentry",
    glyph: "🪷",
    title: "Réentrée — Active Imagination",
    title_en: "Re-entry — Active Imagination",
    subtitle: "5 étapes · ~10 min · sur un rêve déjà déposé",
    subtitle_en: "5 steps · ~10 min · on a deposited dream",
    source: "Stephen Aizenstat + C.G. Jung — Red Book / Active Imagination",
    target: "kairos_existing",     // PATCH le kairosId fourni
    category: "ritual",
    category_label: "Rituels du temps",
    requires_kairos_id: true,
    steps: [
      {
        id: "reimaginer",
        type: "textarea",
        question: "Reprends le rêve. Tu te tiens là où tu étais. Que vois-tu ?",
        question_en: "Take up the dream again. You stand where you were. What do you see?",
        hint: "Aizenstat : tu n'analyses pas — tu y retournes",
      },
      {
        id: "choix_figure",
        type: "textarea",
        question: "Si tu peux dialoguer avec une figure du rêve — laquelle ? Et que lui dis-tu ?",
        question_en: "If you can dialogue with a figure of the dream — which one? And what do you say?",
        hint: "Jung : active imagination commence par parler",
      },
      {
        id: "reponse_imaginee",
        type: "textarea",
        question: "Que te répond-elle ? Imagine, écris.",
        question_en: "What does she/he/it answer? Imagine, write.",
        hint: "Jung : laisse l'image parler — ne corrige pas",
      },
      {
        id: "geste_rituel",
        type: "textarea",
        question: "Quel geste éveillé peut honorer cette réentrée ?",
        question_en: "What waking gesture can honor this re-entry?",
        hint: "Moss : honoring action",
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "Où est ton aha ?",
        question_en: "Where is your aha?",
      },
    ],
  },
};

// ── Helpers de découverte ────────────────────────────────────────
function listProtocoles({ category = null } = {}) {
  const all = Object.values(PROTOCOLES_CATALOG);
  if (category) return all.filter(p => p.category === category);
  return all;
}

function getProtocole(id) {
  return PROTOCOLES_CATALOG[id] || null;
}

// Mapping kairos_type → protocoles suggérés (UI helper)
const TYPE_TO_PROTOCOLES = {
  reve:          ["lightning_dreamwork", "dream_tending"],
  signe:         ["sidewalk_oracle"],
  reverie:       ["reverie_tending"],
  hypnagogie:    ["hypnagogic_recall"],
  synchronicite: ["synchronicity_story"],
  frisson:       ["focusing_felt_sense"],
  note:          ["fin_de_journee"],
};

Object.assign(window, {
  PROTOCOLES_CATALOG,
  listProtocoles,
  getProtocole,
  TYPE_TO_PROTOCOLES,
});
