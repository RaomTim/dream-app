const PROTOCOLES_CATALOG = {
  // ─────────────────────────────────────────────────────────────
  // 1. 🌀 LIGHTNING_DREAMWORK (Moss) — pour rêve
  // ─────────────────────────────────────────────────────────────
  lightning_dreamwork: {
    id: "lightning_dreamwork",
    glyph: "\u25D0",
    title: "Lightning Dreamwork",
    title_en: "Lightning Dreamwork",
    subtitle: "8 \xE9tapes \xB7 ~5 min \xB7 pour un r\xEAve",
    subtitle_en: "8 steps \xB7 ~5 min \xB7 for a dream",
    source: "Robert Moss \u2014 Conscious Dreaming + Active Dreaming",
    target: "kairos",
    // → POST/PATCH /api/kairos
    target_type: "reve",
    // kairos_type
    category: "kairos",
    // pour groupage UI
    category_label: "Pour un r\xEAve nocturne",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Raconte le r\xEAve au pr\xE9sent, comme s'il se passait maintenant.",
        question_en: "Tell the dream in present tense, as if it's happening now.",
        hint: "voix possible \xB7 pas de censure",
        placeholder: "je suis dans une maison que je ne connais pas\u2026"
      },
      {
        id: "titre_instinctif",
        type: "title_short",
        question: "Si tu devais donner un titre \xE0 ce r\xEAve, en 3-5 mots ?",
        question_en: "If you had to give this dream a title, in 3-5 words?",
        hint: "Moss : nommer un r\xEAve lui donne forme",
        placeholder: "la maison qui respire\u2026"
      },
      {
        id: "emotion_dominante",
        type: "chips",
        question: "\xC9motion dominante ?",
        question_en: "Dominant emotion?",
        chips: [
          ["peur", "peur"],
          ["joie", "joie"],
          ["tristesse", "tristesse"],
          ["colere", "col\xE8re"],
          ["surprise", "surprise"],
          ["paix", "paix"],
          ["autre", "autre"]
        ],
        skippable: true
      },
      {
        id: "lettre_au_reveur",
        type: "textarea",
        question: "Si ce r\xEAve \xE9tait une lettre, qu'est-ce qu'il essaie de te dire ?",
        question_en: "If this dream were a letter, what is it trying to tell you?",
        hint: "USER_FIRST_READING \u2014 toi d'abord, l'oracle apr\xE8s",
        placeholder: "il me dit que\u2026"
      },
      {
        id: "personne_du_reve",
        type: "chips",
        question: "Qui r\xEAvait quoi dans ce r\xEAve ? La toi d'aujourd'hui \u2014 ou une autre ?",
        question_en: "Who was dreaming what in this dream? Today-you, or another?",
        hint: "Moss : probable self / counterpart",
        chips: [
          ["aujourd_hui", "moi d'aujourd'hui"],
          ["enfant", "moi enfant"],
          ["future", "moi futur\xB7e"],
          ["counterpart", "un\xB7e autre moi"],
          ["pas_sur", "pas s\xFBr\xB7e"]
        ],
        skippable: true
      },
      {
        id: "geste_honorifique",
        type: "textarea",
        question: "Si tu pouvais faire UN GESTE dans le monde \xE9veill\xE9 qui honore ce r\xEAve, ce serait quoi ?",
        question_en: "If you could do ONE gesture in the waking world to honor this dream, what would it be?",
        hint: "Moss : honoring action \u2014 le r\xEAve sans geste reste lettre morte",
        placeholder: "\xE9crire \xE0\u2026, allumer une bougie, marcher jusqu'\xE0\u2026"
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "O\xF9 \xE7a r\xE9sonne dans ton corps ?",
        question_en: "Where does it resonate in your body?",
        hint: "1 zone par d\xE9faut \xB7 6 zones opt-in"
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 2. 🌀 DREAM_TENDING (Aizenstat) — pour rêve
  // ─────────────────────────────────────────────────────────────
  dream_tending: {
    id: "dream_tending",
    glyph: "\u25D0",
    title: "Dream Tending",
    title_en: "Dream Tending",
    subtitle: "10 \xE9tapes \xB7 ~8 min \xB7 pour un r\xEAve",
    subtitle_en: "10 steps \xB7 ~8 min \xB7 for a dream",
    source: "Stephen Aizenstat \u2014 Dream Tending",
    target: "kairos",
    target_type: "reve",
    category: "kairos",
    category_label: "Pour un r\xEAve nocturne",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Raconte le r\xEAve. Sans pr\xE9cipiter.",
        question_en: "Tell the dream. Without rushing.",
        placeholder: "je marchais dans\u2026"
      },
      {
        id: "image_dominante",
        type: "textarea",
        question: "Quelle image \xE9merge en premier quand tu penses au r\xEAve ?",
        question_en: "What image emerges first when you think of the dream?",
        hint: "une seule. la premi\xE8re qui arrive.",
        placeholder: "un escalier, un visage, une couleur\u2026"
      },
      {
        id: "tending_image",
        type: "textarea",
        question: "Reste avec cette image. Que vois-tu de plus si tu prends le temps ?",
        question_en: "Stay with this image. What more do you see if you take the time?",
        hint: "Aizenstat : tend the image \u2014 laisse-la s'animer"
      },
      {
        id: "presence_figures",
        type: "textarea",
        question: "Y a-t-il des figures (humaines, animales, autres) ? Lesquelles ?",
        question_en: "Are there figures (human, animal, other)? Which ones?",
        placeholder: "une vieille femme, un chien noir, une voix\u2026"
      },
      {
        id: "eidolon_principale",
        type: "textarea",
        question: "Choisis la figure la plus pr\xE9sente. D\xE9cris-la en 5 mots.",
        question_en: "Choose the most present figure. Describe it in 5 words.",
        hint: "Aizenstat : eidolon \u2014 la figure vivante du r\xEAve"
      },
      {
        id: "body_to_body",
        type: "textarea",
        question: "Si tu te tiens \xE0 c\xF4t\xE9 de cette figure dans le r\xEAve, qu'est-ce que ton corps ressent ?",
        question_en: "If you stand beside this figure in the dream, what does your body feel?",
        hint: "body-to-body \u2014 pas un concept, une sensation"
      },
      {
        id: "ce_quelle_veut",
        type: "textarea",
        question: "Que semble vouloir cette figure ?",
        question_en: "What does this figure seem to want?",
        hint: "sans interpr\xE9ter \u2014 \xE9couter"
      },
      {
        id: "cadeau",
        type: "textarea",
        question: "Cette figure t'apporte quelque chose. Quoi ?",
        question_en: "This figure brings you something. What?",
        hint: "Aizenstat : the gift \u2014 chaque eidolon porte un don"
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "O\xF9 \xE7a r\xE9sonne dans ton corps ?",
        question_en: "Where does it resonate in your body?"
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 3. 🌀 SIDEWALK_ORACLE_TRACKING (Moss) — pour signe diurne
  // ─────────────────────────────────────────────────────────────
  sidewalk_oracle: {
    id: "sidewalk_oracle",
    glyph: "\u25D0",
    title: "Sidewalk Oracle",
    title_en: "Sidewalk Oracle",
    subtitle: "6 \xE9tapes \xB7 ~4 min \xB7 pour un signe diurne",
    subtitle_en: "6 steps \xB7 ~4 min \xB7 for a daytime sign",
    source: "Robert Moss \u2014 Sidewalk Oracles",
    target: "kairos",
    target_type: "signe",
    category: "kairos",
    category_label: "Pour un signe du jour",
    steps: [
      {
        id: "description",
        type: "textarea",
        question: "D\xE9cris ce que tu as vu, entendu, crois\xE9.",
        question_en: "Describe what you saw, heard, encountered.",
        placeholder: "un corbeau s'est pos\xE9 devant moi\u2026"
      },
      {
        id: "heure_lieu",
        type: "textarea",
        question: "Heure et lieu ?",
        question_en: "Time and place?",
        placeholder: "ce matin, en sortant de chez moi\u2026",
        hint: "court, pr\xE9cis"
      },
      {
        id: "etat_avant",
        type: "textarea",
        question: "\xC9tat int\xE9rieur juste avant que \xE7a arrive ?",
        question_en: "Inner state just before it happened?",
        hint: "\xE0 quoi tu pensais, ce que tu vivais"
      },
      {
        id: "charge",
        type: "slider",
        question: "Charge \u2014 \xE0 quel point \xE7a t'a marqu\xE9 ?",
        question_en: "Charge \u2014 how much did it strike you?",
        min: 1,
        max: 5,
        hint: "1 = \xE0 peine \xB7 5 = saisissant"
      },
      {
        id: "lecture_kairomancer",
        type: "textarea",
        question: "Si ce signe te r\xE9pondait \xE0 une question, ce serait quelle question ?",
        question_en: "If this sign answered a question, what question would it be?",
        hint: "Moss : kairomancer \u2014 l'oracle du seuil"
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 4. 🌀 REVERIE_TENDING (Bachelard) — pour rêverie diurne
  // ─────────────────────────────────────────────────────────────
  reverie_tending: {
    id: "reverie_tending",
    glyph: "\u25D0",
    title: "Reverie Tending",
    title_en: "Reverie Tending",
    subtitle: "6 \xE9tapes \xB7 ~5 min \xB7 pour une r\xEAverie",
    subtitle_en: "6 steps \xB7 ~5 min \xB7 for a reverie",
    source: "Gaston Bachelard \u2014 La Po\xE9tique de la R\xEAverie",
    target: "kairos",
    target_type: "reverie",
    category: "kairos",
    category_label: "Pour une r\xEAverie diurne",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "D\xE9cris la r\xEAverie. Pas l'analyse \u2014 l'image.",
        question_en: "Describe the reverie. Not the analysis \u2014 the image.",
        placeholder: "j'\xE9tais en train de regarder par la fen\xEAtre\u2026"
      },
      {
        id: "element_dominant",
        type: "chips",
        question: "\xC9l\xE9ment dominant ?",
        question_en: "Dominant element?",
        chips: [
          ["eau", "eau"],
          ["air", "air"],
          ["feu", "feu"],
          ["terre", "terre"]
        ],
        hint: "Bachelard : 4 imaginations mat\xE9rielles"
      },
      {
        id: "cosmique_intime",
        type: "chips",
        question: "Cosmique ou intime ?",
        question_en: "Cosmic or intimate?",
        chips: [
          ["cosmique", "cosmique \u2014 vaste, ouvert"],
          ["intime", "intime \u2014 proche, nich\xE9"]
        ],
        hint: "Bachelard : la r\xEAverie a deux p\xF4les"
      },
      {
        id: "elle_sallonge",
        type: "textarea",
        question: "Tu prolonges la r\xEAverie 30 secondes en imaginant. Que se passe-t-il ?",
        question_en: "You extend the reverie 30 seconds by imagining. What happens?"
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "O\xF9 \xE7a r\xE9sonne dans ton corps ?",
        question_en: "Where does it resonate in your body?"
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 5. 🌀 HYPNAGOGIC_RECALL (Mavromatis) — pour hypnagogie
  // ─────────────────────────────────────────────────────────────
  hypnagogic_recall: {
    id: "hypnagogic_recall",
    glyph: "\u25D0",
    title: "Hypnagogic Recall",
    title_en: "Hypnagogic Recall",
    subtitle: "5 \xE9tapes \xB7 ~3 min \xB7 pour une hypnagogie",
    subtitle_en: "5 steps \xB7 ~3 min \xB7 for hypnagogia",
    source: "Andreas Mavromatis \u2014 Hypnagogia",
    target: "kairos",
    target_type: "hypnagogie",
    category: "kairos",
    category_label: "Pour une hypnagogie",
    steps: [
      {
        id: "capture_brute",
        type: "textarea",
        question: "Note ce qui te reste \u2014 image, son, sensation.",
        question_en: "Note what remains \u2014 image, sound, sensation.",
        hint: "rapide, sans formuler joliment"
      },
      {
        id: "modalite",
        type: "chips_multi",
        question: "Modalit\xE9(s) ?",
        question_en: "Modality(ies)?",
        chips: [
          ["visuelle", "visuelle"],
          ["auditive", "auditive"],
          ["kinesthesique", "kinesth\xE9sique"],
          ["verbale", "verbale"],
          ["autre", "autre"]
        ]
      },
      {
        id: "categorie",
        type: "chips",
        question: "Cat\xE9gorie Mavromatis ?",
        question_en: "Mavromatis category?",
        chips: [
          ["geometric", "g\xE9om\xE9trique"],
          ["face", "visage"],
          ["scene", "sc\xE8ne"],
          ["phrase", "phrase entendue"],
          ["autre", "autre"]
        ]
      },
      {
        id: "veille_sommeil",
        type: "binary",
        question: "Tu allais t'endormir, ou tu te r\xE9veillais ?",
        question_en: "Were you falling asleep, or waking?",
        chips: [
          ["endormissement", "endormissement"],
          ["reveil", "r\xE9veil"]
        ]
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 6. 🌀 SYNCHRONICITY_STORY (Hopcke) — pour synchronicité
  // ─────────────────────────────────────────────────────────────
  synchronicity_story: {
    id: "synchronicity_story",
    glyph: "\u25D0",
    title: "Synchronicity Story",
    title_en: "Synchronicity Story",
    subtitle: "7 \xE9tapes \xB7 ~5 min \xB7 pour une synchronicit\xE9",
    subtitle_en: "7 steps \xB7 ~5 min \xB7 for a synchronicity",
    source: "Robert Hopcke \u2014 There Are No Accidents",
    target: "kairos",
    target_type: "synchronicite",
    category: "kairos",
    category_label: "Pour une synchronicit\xE9",
    steps: [
      {
        id: "deux_evenements",
        type: "two_textareas",
        question: "L'\xE9v\xE9nement int\xE9rieur (ce qui \xE9tait dans ta t\xEAte, ton c\u0153ur) ?",
        question_en: "The inner event (what was in your head, your heart)?",
        subQuestion: "L'\xE9v\xE9nement ext\xE9rieur (ce qui s'est pass\xE9 dans le monde) ?",
        subQuestion_en: "The outer event (what happened in the world)?",
        hint: "deux c\xF4t\xE9s d'une m\xEAme histoire"
      },
      {
        id: "decalage_temporel",
        type: "textarea",
        question: "D\xE9calage temporel entre les deux ?",
        question_en: "Time gap between the two?",
        placeholder: "juste avant \xB7 le lendemain \xB7 3 semaines apr\xE8s\u2026"
      },
      {
        id: "charge_affective",
        type: "slider",
        question: "Charge affective ?",
        question_en: "Affective charge?",
        min: 1,
        max: 5,
        hint: "1 = l\xE9ger \xB7 5 = bouleversant"
      },
      {
        id: "recit_narratif",
        type: "textarea",
        question: "Raconte les deux comme une seule histoire.",
        question_en: "Tell both as a single story.",
        hint: "Hopcke : narrative event \u2014 la synchro est r\xE9cit"
      },
      {
        id: "recurrence",
        type: "binary",
        question: "Cette synchronicit\xE9 s'inscrit-elle dans une s\xE9rie ?",
        question_en: "Is this synchronicity part of a series?",
        chips: [
          ["oui", "oui \u2014 d'autres signes pareils"],
          ["non", "non \u2014 isol\xE9e"],
          ["pas_sur", "pas s\xFBr\xB7e"]
        ]
      },
      {
        id: "felt_shift",
        type: "body_zone",
        question: "O\xF9 \xE7a r\xE9sonne dans ton corps ?",
        question_en: "Where does it resonate in your body?"
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 7. 🌀 FOCUSING_FELT_SENSE (Gendlin) — pour frisson somatique
  // ─────────────────────────────────────────────────────────────
  focusing_felt_sense: {
    id: "focusing_felt_sense",
    glyph: "\u25D0",
    title: "Focusing \u2014 Felt Sense",
    title_en: "Focusing \u2014 Felt Sense",
    subtitle: "6 \xE9tapes \xB7 ~6 min \xB7 pour un frisson",
    subtitle_en: "6 steps \xB7 ~6 min \xB7 for a body charge",
    source: "Eugene Gendlin \u2014 Focusing",
    target: "kairos",
    target_type: "frisson",
    category: "kairos",
    category_label: "Pour un frisson somatique",
    steps: [
      {
        id: "localisation",
        type: "body_zone_full",
        question: "O\xF9, dans ton corps ?",
        question_en: "Where, in your body?",
        hint: "silhouette cliquable \u2014 front + back"
      },
      {
        id: "qualite_texture",
        type: "chips",
        question: "Si ce frisson avait une texture, ce serait quoi ?",
        question_en: "If this charge had a texture, what would it be?",
        chips: [
          ["chaud", "chaud"],
          ["froid", "froid"],
          ["lourd", "lourd"],
          ["leger", "l\xE9ger"],
          ["serre", "serr\xE9"],
          ["ouvert", "ouvert"],
          ["palpitant", "palpitant"],
          ["autre", "autre"]
        ]
      },
      {
        id: "handle_word",
        type: "title_short",
        question: "Quel mot capte au mieux cette sensation ?",
        question_en: "Which word best captures this sensation?",
        hint: "Gendlin : handle word \u2014 un mot qui tient",
        placeholder: "tendu \xB7 doux \xB7 vibrant\u2026"
      },
      {
        id: "resonating",
        type: "binary",
        question: "Pose le mot sur la sensation. Est-ce que \xE7a r\xE9sonne ?",
        question_en: "Place the word on the sensation. Does it resonate?",
        chips: [
          ["oui", "oui \u2014 c'est juste"],
          ["presque", "presque \u2014 pas tout \xE0 fait"],
          ["non", "non \u2014 autre mot"]
        ]
      },
      {
        id: "asking",
        type: "textarea",
        question: "Demande \xE0 la sensation : \xAB qu'est-ce qui te fait \xEAtre l\xE0 ? \xBB \u2014 silence 30 secondes \u2014 puis \xE9cris ce qui vient.",
        question_en: 'Ask the sensation: "what makes you here?" \u2014 30s silence \u2014 then write what comes.',
        hint: "Gendlin : asking step"
      },
      {
        id: "aha_handle",
        type: "aha_capture",
        question: "O\xF9 est ton aha ? Et le handle final ?",
        question_en: "Where is your aha? And the final handle?"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 8. 🌀 FIN_DE_JOURNEE (Examen Ignacien adapté) — pour Journal de Vie
  // ─────────────────────────────────────────────────────────────
  fin_de_journee: {
    id: "fin_de_journee",
    glyph: "\u2609",
    title: "Fin de Journ\xE9e",
    title_en: "End of Day",
    subtitle: "4 \xE9tapes \xB7 ~5 min \xB7 pour le Journal de Vie",
    subtitle_en: "4 steps \xB7 ~5 min \xB7 for Life Journal",
    source: "Examen Ignacien adapt\xE9 \xB7 Moss + Wangyal",
    target: "journal",
    // → POST /api/journal/entries
    target_type: "note",
    category: "journal",
    category_label: "Pour ton Journal de Vie (le soir)",
    steps: [
      {
        id: "gratitude",
        type: "textarea",
        question: "Qu'est-ce qui m\xE9rite ta gratitude aujourd'hui ?",
        question_en: "What deserves your gratitude today?",
        hint: "voix possible \xB7 sans hi\xE9rarchiser"
      },
      {
        id: "mouvement_interieur",
        type: "chips",
        question: "Quel mouvement t'a travers\xE9 aujourd'hui ?",
        question_en: "What movement crossed through you today?",
        chips: [
          ["joie", "joie"],
          ["desir", "d\xE9sir"],
          ["peur", "peur"],
          ["paix", "paix"],
          ["colere", "col\xE8re"],
          ["tristesse", "tristesse"],
          ["autre", "autre"]
        ],
        hint: "Examen ignacien : noter les mouvements"
      },
      {
        id: "question_ouverte",
        type: "textarea",
        question: "Y a-t-il une question qui s'est pos\xE9e \xE0 toi sans r\xE9ponse ?",
        question_en: "Is there a question that arose without an answer?"
      },
      {
        id: "intention_de_nuit",
        type: "textarea",
        question: "Avec quoi veux-tu t'endormir ?",
        question_en: "What do you want to sleep with?",
        hint: "tu peux ensuite encha\xEEner sur le rituel pr\xE9-sommeil",
        placeholder: "une image, un mot, une question pour la nuit\u2026"
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 9. 🌙 PRE_SOMMEIL — rituel temporel (incubation Moss + LaBerge MILD)
  // ─────────────────────────────────────────────────────────────
  pre_sommeil: {
    id: "pre_sommeil",
    glyph: "\u{1F319}",
    title: "Pr\xE9-sommeil \u2014 Incubation",
    title_en: "Pre-sleep \u2014 Incubation",
    subtitle: "6 \xE9tapes \xB7 ~6 min \xB7 rituel du soir",
    subtitle_en: "6 steps \xB7 ~6 min \xB7 evening ritual",
    source: "Robert Moss + Stephen LaBerge (MILD) + Tenzin Wangyal \u2014 Tibetan Yogas of Dream",
    target: "kairos",
    target_type: "note",
    // dépôt léger pour traçer l'intention
    category: "ritual",
    category_label: "Rituels du temps",
    steps: [
      {
        id: "bilan_journee",
        type: "textarea",
        question: "Ta journ\xE9e en une phrase ?",
        question_en: "Your day in one sentence?",
        placeholder: "courte, sans soigner"
      },
      {
        id: "question_incubation",
        type: "textarea",
        question: "Y a-t-il une question que tu veux poser \xE0 tes r\xEAves cette nuit ?",
        question_en: "Is there a question you want to ask your dreams tonight?",
        hint: "Moss : dream incubation \u2014 semer pour la nuit"
      },
      {
        id: "image_graine",
        type: "textarea",
        question: "Une image qui pourrait \xEAtre ton point d'entr\xE9e dans le r\xEAve ?",
        question_en: "An image that could be your entry point into the dream?",
        placeholder: "une porte, un visage, une lumi\xE8re\u2026"
      },
      {
        id: "intention_mild",
        type: "textarea",
        question: "Si tu r\xEAves cette nuit \u2014 comment veux-tu y \xEAtre ?",
        question_en: "If you dream tonight \u2014 how do you want to be there?",
        hint: "LaBerge MILD : \xAB Si je r\xEAve, je deviens lucide \xBB",
        placeholder: "pr\xE9sent\xB7e, lucide, \xE0 l'\xE9coute\u2026",
        skippable: true
      },
      {
        id: "respiration",
        type: "breathing",
        question: "Trois cycles. Inspire 4, retiens 4, expire 6.",
        question_en: "Three cycles. Inhale 4, hold 4, exhale 6.",
        duration: 42e3
        // 3 cycles × 14s
      },
      {
        id: "bonne_traversee",
        type: "info",
        question: "Le r\xEAve sait. Bonne travers\xE9e.",
        question_en: "The dream knows. Safe crossing.",
        duration: 4e3
      }
    ]
  },
  // ─────────────────────────────────────────────────────────────
  // 10. 🪷 REENTRY (Aizenstat + Jung active imagination) — sur kairos déjà déposé
  // Note : étapes 1-2 (gate trauma-safe + choix chemin) sont gérées AVANT par
  // ReentryScreen actuel (screens-soma.jsx). Ce protocole est appelé après.
  // ─────────────────────────────────────────────────────────────
  reentry: {
    id: "reentry",
    glyph: "\u{1FAB7}",
    title: "R\xE9entr\xE9e \u2014 Active Imagination",
    title_en: "Re-entry \u2014 Active Imagination",
    subtitle: "5 \xE9tapes \xB7 ~10 min \xB7 sur un r\xEAve d\xE9j\xE0 d\xE9pos\xE9",
    subtitle_en: "5 steps \xB7 ~10 min \xB7 on a deposited dream",
    source: "Stephen Aizenstat + C.G. Jung \u2014 Red Book / Active Imagination",
    target: "kairos_existing",
    // PATCH le kairosId fourni
    category: "ritual",
    category_label: "Rituels du temps",
    requires_kairos_id: true,
    steps: [
      {
        id: "reimaginer",
        type: "textarea",
        question: "Reprends le r\xEAve. Tu te tiens l\xE0 o\xF9 tu \xE9tais. Que vois-tu ?",
        question_en: "Take up the dream again. You stand where you were. What do you see?",
        hint: "Aizenstat : tu n'analyses pas \u2014 tu y retournes"
      },
      {
        id: "choix_figure",
        type: "textarea",
        question: "Si tu peux dialoguer avec une figure du r\xEAve \u2014 laquelle ? Et que lui dis-tu ?",
        question_en: "If you can dialogue with a figure of the dream \u2014 which one? And what do you say?",
        hint: "Jung : active imagination commence par parler"
      },
      {
        id: "reponse_imaginee",
        type: "textarea",
        question: "Que te r\xE9pond-elle ? Imagine, \xE9cris.",
        question_en: "What does she/he/it answer? Imagine, write.",
        hint: "Jung : laisse l'image parler \u2014 ne corrige pas"
      },
      {
        id: "geste_rituel",
        type: "textarea",
        question: "Quel geste \xE9veill\xE9 peut honorer cette r\xE9entr\xE9e ?",
        question_en: "What waking gesture can honor this re-entry?",
        hint: "Moss : honoring action"
      },
      {
        id: "aha",
        type: "aha_capture",
        question: "O\xF9 est ton aha ?",
        question_en: "Where is your aha?"
      }
    ]
  }
};
function listProtocoles({ category = null } = {}) {
  const all = Object.values(PROTOCOLES_CATALOG);
  if (category) return all.filter((p) => p.category === category);
  return all;
}
function getProtocole(id) {
  return PROTOCOLES_CATALOG[id] || null;
}
const TYPE_TO_PROTOCOLES = {
  reve: ["lightning_dreamwork", "dream_tending"],
  signe: ["sidewalk_oracle"],
  reverie: ["reverie_tending"],
  hypnagogie: ["hypnagogic_recall"],
  synchronicite: ["synchronicity_story"],
  frisson: ["focusing_felt_sense"],
  note: ["fin_de_journee"]
};
Object.assign(window, {
  PROTOCOLES_CATALOG,
  listProtocoles,
  getProtocole,
  TYPE_TO_PROTOCOLES
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicHJvdG9jb2xlcy1jYXRhbG9nLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIHdpbmRvdyAqL1xuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyBQUk9UT0NPTEVTIENBVEFMT0cgXHUyMDE0IEFyY2hpdGVjdHVyZSBRdWljayB2cyBQcm90b2NvbGUgQWNjb21wYWduXHUwMEU5XG4vLyBTcGVjIDogMV9CSUJMRSBcdTAwQTczLjExICsgMl9ERVNJR04gXHUwMEE3MTEuYmlzLjEzXG4vLyBZZXNodWEsIDIwMjYtMDQtMjYgbnVpdCBwcm9mb25kZS5cbi8vXG4vLyA5IHByb3RvY29sZXMgKDggY2FyZHMgKyAxIFwiRmluIGRlIEpvdXJuXHUwMEU5ZVwiKSArIDEgc3VyIGthaXJvcyBkXHUwMEU5alx1MDBFMCBkXHUwMEU5cG9zXHUwMEU5IChSXHUwMEU5ZW50clx1MDBFOWUpLlxuLy9cbi8vIFNjaFx1MDBFOW1hIGQndW5lIFx1MDBFOXRhcGUgOlxuLy8gICB7XG4vLyAgICAgaWQ6IFwic25ha2VfY2FzZV91bmlxdWVfd2l0aGluX3Byb3RvY29sXCIsXG4vLyAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiIHwgXCJ0aXRsZV9zaG9ydFwiIHwgXCJjaGlwc1wiIHwgXCJjaGlwc19tdWx0aVwiIHwgXCJzbGlkZXJcIlxuLy8gICAgICAgICAgIHwgXCJiaW5hcnlcIiB8IFwidHdvX3RleHRhcmVhc1wiIHwgXCJib2R5X3pvbmVcIiB8IFwiYnJlYXRoaW5nXCJcbi8vICAgICAgICAgICB8IFwidm9pY2Vfb25seVwiIHwgXCJpbmZvXCIsXG4vLyAgICAgcXVlc3Rpb246IFwidGV4dGUgRlJcIixcbi8vICAgICBxdWVzdGlvbl9lbjogXCJFTiB0ZXh0XCIsICAgICAgICAgICAgLy8gb3B0aW9ubmVsXG4vLyAgICAgaGludD86IFwicGV0aXRlIGluZGljYXRpb24gaXRhbGlxdWVcIixcbi8vICAgICBwbGFjZWhvbGRlcj86IFwiLi4uXCIsXG4vLyAgICAgY2hpcHM/OiBbW1wia2V5XCIsXCJsYWJlbFwiXSwgLi4uXSxcbi8vICAgICBtaW4/OiBudW1iZXIsIG1heD86IG51bWJlciwgICAgICAgIC8vIHBvdXIgc2xpZGVyXG4vLyAgICAgZHVyYXRpb24/OiBudW1iZXIsICAgICAgICAgICAgICAgICAvLyBwb3VyIGJyZWF0aGluZy9pbmZvIGF1dG8tYWR2YW5jZSBtc1xuLy8gICAgIHNraXBwYWJsZT86IHRydWUsICAgICAgICAgICAgICAgICAgLy8gYm91dG9uIFwicGFzc2VyIGNldHRlIHF1ZXN0aW9uXCJcbi8vICAgICBzdWJRdWVzdGlvbj86IFwic2Vjb25kIHByb21wdCBmb3IgdHdvX3RleHRhcmVhc1wiXG4vLyAgIH1cbi8vXG4vLyBDaWJsZSBzdG9yYWdlIDoga2Fpcm9zLnByb3RvY29sX3Nlc3Npb25fZGF0YSBKU09OQlxuLy8gICB7IHByb3RvY29sX2lkLCBsYW5ndWFnZSwgc3RlcHM6IFt7IGlkLCB0eXBlLCBhbnN3ZXIsIHNraXBwZWQgfV0sIGNvbXBsZXRlZF9hdCB9XG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcblxuY29uc3QgUFJPVE9DT0xFU19DQVRBTE9HID0ge1xuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAxLiBcdUQ4M0NcdURGMDAgTElHSFROSU5HX0RSRUFNV09SSyAoTW9zcykgXHUyMDE0IHBvdXIgclx1MDBFQXZlXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBsaWdodG5pbmdfZHJlYW13b3JrOiB7XG4gICAgaWQ6IFwibGlnaHRuaW5nX2RyZWFtd29ya1wiLFxuICAgIGdseXBoOiBcIlx1MjVEMFwiLFxuICAgIHRpdGxlOiBcIkxpZ2h0bmluZyBEcmVhbXdvcmtcIixcbiAgICB0aXRsZV9lbjogXCJMaWdodG5pbmcgRHJlYW13b3JrXCIsXG4gICAgc3VidGl0bGU6IFwiOCBcdTAwRTl0YXBlcyBcdTAwQjcgfjUgbWluIFx1MDBCNyBwb3VyIHVuIHJcdTAwRUF2ZVwiLFxuICAgIHN1YnRpdGxlX2VuOiBcIjggc3RlcHMgXHUwMEI3IH41IG1pbiBcdTAwQjcgZm9yIGEgZHJlYW1cIixcbiAgICBzb3VyY2U6IFwiUm9iZXJ0IE1vc3MgXHUyMDE0IENvbnNjaW91cyBEcmVhbWluZyArIEFjdGl2ZSBEcmVhbWluZ1wiLFxuICAgIHRhcmdldDogXCJrYWlyb3NcIiwgICAgICAgICAgICAvLyBcdTIxOTIgUE9TVC9QQVRDSCAvYXBpL2thaXJvc1xuICAgIHRhcmdldF90eXBlOiBcInJldmVcIiwgICAgICAgICAvLyBrYWlyb3NfdHlwZVxuICAgIGNhdGVnb3J5OiBcImthaXJvc1wiLCAgICAgICAgICAvLyBwb3VyIGdyb3VwYWdlIFVJXG4gICAgY2F0ZWdvcnlfbGFiZWw6IFwiUG91ciB1biByXHUwMEVBdmUgbm9jdHVybmVcIixcbiAgICBzdGVwczogW1xuICAgICAge1xuICAgICAgICBpZDogXCJjYXB0dXJlX2JydXRlXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiUmFjb250ZSBsZSByXHUwMEVBdmUgYXUgcHJcdTAwRTlzZW50LCBjb21tZSBzJ2lsIHNlIHBhc3NhaXQgbWFpbnRlbmFudC5cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiVGVsbCB0aGUgZHJlYW0gaW4gcHJlc2VudCB0ZW5zZSwgYXMgaWYgaXQncyBoYXBwZW5pbmcgbm93LlwiLFxuICAgICAgICBoaW50OiBcInZvaXggcG9zc2libGUgXHUwMEI3IHBhcyBkZSBjZW5zdXJlXCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcImplIHN1aXMgZGFucyB1bmUgbWFpc29uIHF1ZSBqZSBuZSBjb25uYWlzIHBhc1x1MjAyNlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwidGl0cmVfaW5zdGluY3RpZlwiLFxuICAgICAgICB0eXBlOiBcInRpdGxlX3Nob3J0XCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlNpIHR1IGRldmFpcyBkb25uZXIgdW4gdGl0cmUgXHUwMEUwIGNlIHJcdTAwRUF2ZSwgZW4gMy01IG1vdHMgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJJZiB5b3UgaGFkIHRvIGdpdmUgdGhpcyBkcmVhbSBhIHRpdGxlLCBpbiAzLTUgd29yZHM/XCIsXG4gICAgICAgIGhpbnQ6IFwiTW9zcyA6IG5vbW1lciB1biByXHUwMEVBdmUgbHVpIGRvbm5lIGZvcm1lXCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcImxhIG1haXNvbiBxdWkgcmVzcGlyZVx1MjAyNlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZW1vdGlvbl9kb21pbmFudGVcIixcbiAgICAgICAgdHlwZTogXCJjaGlwc1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJcdTAwQzltb3Rpb24gZG9taW5hbnRlID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiRG9taW5hbnQgZW1vdGlvbj9cIixcbiAgICAgICAgY2hpcHM6IFtcbiAgICAgICAgICBbXCJwZXVyXCIsICAgICBcInBldXJcIl0sXG4gICAgICAgICAgW1wiam9pZVwiLCAgICAgXCJqb2llXCJdLFxuICAgICAgICAgIFtcInRyaXN0ZXNzZVwiLFwidHJpc3Rlc3NlXCJdLFxuICAgICAgICAgIFtcImNvbGVyZVwiLCAgIFwiY29sXHUwMEU4cmVcIl0sXG4gICAgICAgICAgW1wic3VycHJpc2VcIiwgXCJzdXJwcmlzZVwiXSxcbiAgICAgICAgICBbXCJwYWl4XCIsICAgICBcInBhaXhcIl0sXG4gICAgICAgICAgW1wiYXV0cmVcIiwgICAgXCJhdXRyZVwiXSxcbiAgICAgICAgXSxcbiAgICAgICAgc2tpcHBhYmxlOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwibGV0dHJlX2F1X3JldmV1clwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlNpIGNlIHJcdTAwRUF2ZSBcdTAwRTl0YWl0IHVuZSBsZXR0cmUsIHF1J2VzdC1jZSBxdSdpbCBlc3NhaWUgZGUgdGUgZGlyZSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIklmIHRoaXMgZHJlYW0gd2VyZSBhIGxldHRlciwgd2hhdCBpcyBpdCB0cnlpbmcgdG8gdGVsbCB5b3U/XCIsXG4gICAgICAgIGhpbnQ6IFwiVVNFUl9GSVJTVF9SRUFESU5HIFx1MjAxNCB0b2kgZCdhYm9yZCwgbCdvcmFjbGUgYXByXHUwMEU4c1wiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJpbCBtZSBkaXQgcXVlXHUyMDI2XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJwZXJzb25uZV9kdV9yZXZlXCIsXG4gICAgICAgIHR5cGU6IFwiY2hpcHNcIixcbiAgICAgICAgcXVlc3Rpb246IFwiUXVpIHJcdTAwRUF2YWl0IHF1b2kgZGFucyBjZSByXHUwMEVBdmUgPyBMYSB0b2kgZCdhdWpvdXJkJ2h1aSBcdTIwMTQgb3UgdW5lIGF1dHJlID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiV2hvIHdhcyBkcmVhbWluZyB3aGF0IGluIHRoaXMgZHJlYW0/IFRvZGF5LXlvdSwgb3IgYW5vdGhlcj9cIixcbiAgICAgICAgaGludDogXCJNb3NzIDogcHJvYmFibGUgc2VsZiAvIGNvdW50ZXJwYXJ0XCIsXG4gICAgICAgIGNoaXBzOiBbXG4gICAgICAgICAgW1wiYXVqb3VyZF9odWlcIiwgIFwibW9pIGQnYXVqb3VyZCdodWlcIl0sXG4gICAgICAgICAgW1wiZW5mYW50XCIsICAgICAgIFwibW9pIGVuZmFudFwiXSxcbiAgICAgICAgICBbXCJmdXR1cmVcIiwgICAgICAgXCJtb2kgZnV0dXJcdTAwQjdlXCJdLFxuICAgICAgICAgIFtcImNvdW50ZXJwYXJ0XCIsICBcInVuXHUwMEI3ZSBhdXRyZSBtb2lcIl0sXG4gICAgICAgICAgW1wicGFzX3N1clwiLCAgICAgIFwicGFzIHNcdTAwRkJyXHUwMEI3ZVwiXSxcbiAgICAgICAgXSxcbiAgICAgICAgc2tpcHBhYmxlOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZ2VzdGVfaG9ub3JpZmlxdWVcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJTaSB0dSBwb3V2YWlzIGZhaXJlIFVOIEdFU1RFIGRhbnMgbGUgbW9uZGUgXHUwMEU5dmVpbGxcdTAwRTkgcXVpIGhvbm9yZSBjZSByXHUwMEVBdmUsIGNlIHNlcmFpdCBxdW9pID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiSWYgeW91IGNvdWxkIGRvIE9ORSBnZXN0dXJlIGluIHRoZSB3YWtpbmcgd29ybGQgdG8gaG9ub3IgdGhpcyBkcmVhbSwgd2hhdCB3b3VsZCBpdCBiZT9cIixcbiAgICAgICAgaGludDogXCJNb3NzIDogaG9ub3JpbmcgYWN0aW9uIFx1MjAxNCBsZSByXHUwMEVBdmUgc2FucyBnZXN0ZSByZXN0ZSBsZXR0cmUgbW9ydGVcIixcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiXHUwMEU5Y3JpcmUgXHUwMEUwXHUyMDI2LCBhbGx1bWVyIHVuZSBib3VnaWUsIG1hcmNoZXIganVzcXUnXHUwMEUwXHUyMDI2XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJmZWx0X3NoaWZ0XCIsXG4gICAgICAgIHR5cGU6IFwiYm9keV96b25lXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIk9cdTAwRjkgXHUwMEU3YSByXHUwMEU5c29ubmUgZGFucyB0b24gY29ycHMgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGVyZSBkb2VzIGl0IHJlc29uYXRlIGluIHlvdXIgYm9keT9cIixcbiAgICAgICAgaGludDogXCIxIHpvbmUgcGFyIGRcdTAwRTlmYXV0IFx1MDBCNyA2IHpvbmVzIG9wdC1pblwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWhhXCIsXG4gICAgICAgIHR5cGU6IFwiYWhhX2NhcHR1cmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBlc3QgdG9uIGFoYSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGlzIHlvdXIgYWhhP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAyLiBcdUQ4M0NcdURGMDAgRFJFQU1fVEVORElORyAoQWl6ZW5zdGF0KSBcdTIwMTQgcG91ciByXHUwMEVBdmVcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGRyZWFtX3RlbmRpbmc6IHtcbiAgICBpZDogXCJkcmVhbV90ZW5kaW5nXCIsXG4gICAgZ2x5cGg6IFwiXHUyNUQwXCIsXG4gICAgdGl0bGU6IFwiRHJlYW0gVGVuZGluZ1wiLFxuICAgIHRpdGxlX2VuOiBcIkRyZWFtIFRlbmRpbmdcIixcbiAgICBzdWJ0aXRsZTogXCIxMCBcdTAwRTl0YXBlcyBcdTAwQjcgfjggbWluIFx1MDBCNyBwb3VyIHVuIHJcdTAwRUF2ZVwiLFxuICAgIHN1YnRpdGxlX2VuOiBcIjEwIHN0ZXBzIFx1MDBCNyB+OCBtaW4gXHUwMEI3IGZvciBhIGRyZWFtXCIsXG4gICAgc291cmNlOiBcIlN0ZXBoZW4gQWl6ZW5zdGF0IFx1MjAxNCBEcmVhbSBUZW5kaW5nXCIsXG4gICAgdGFyZ2V0OiBcImthaXJvc1wiLFxuICAgIHRhcmdldF90eXBlOiBcInJldmVcIixcbiAgICBjYXRlZ29yeTogXCJrYWlyb3NcIixcbiAgICBjYXRlZ29yeV9sYWJlbDogXCJQb3VyIHVuIHJcdTAwRUF2ZSBub2N0dXJuZVwiLFxuICAgIHN0ZXBzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiBcImNhcHR1cmVfYnJ1dGVcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJSYWNvbnRlIGxlIHJcdTAwRUF2ZS4gU2FucyBwclx1MDBFOWNpcGl0ZXIuXCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIlRlbGwgdGhlIGRyZWFtLiBXaXRob3V0IHJ1c2hpbmcuXCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcImplIG1hcmNoYWlzIGRhbnNcdTIwMjZcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImltYWdlX2RvbWluYW50ZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlF1ZWxsZSBpbWFnZSBcdTAwRTltZXJnZSBlbiBwcmVtaWVyIHF1YW5kIHR1IHBlbnNlcyBhdSByXHUwMEVBdmUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGF0IGltYWdlIGVtZXJnZXMgZmlyc3Qgd2hlbiB5b3UgdGhpbmsgb2YgdGhlIGRyZWFtP1wiLFxuICAgICAgICBoaW50OiBcInVuZSBzZXVsZS4gbGEgcHJlbWlcdTAwRThyZSBxdWkgYXJyaXZlLlwiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJ1biBlc2NhbGllciwgdW4gdmlzYWdlLCB1bmUgY291bGV1clx1MjAyNlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwidGVuZGluZ19pbWFnZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlJlc3RlIGF2ZWMgY2V0dGUgaW1hZ2UuIFF1ZSB2b2lzLXR1IGRlIHBsdXMgc2kgdHUgcHJlbmRzIGxlIHRlbXBzID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiU3RheSB3aXRoIHRoaXMgaW1hZ2UuIFdoYXQgbW9yZSBkbyB5b3Ugc2VlIGlmIHlvdSB0YWtlIHRoZSB0aW1lP1wiLFxuICAgICAgICBoaW50OiBcIkFpemVuc3RhdCA6IHRlbmQgdGhlIGltYWdlIFx1MjAxNCBsYWlzc2UtbGEgcydhbmltZXJcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInByZXNlbmNlX2ZpZ3VyZXNcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJZIGEtdC1pbCBkZXMgZmlndXJlcyAoaHVtYWluZXMsIGFuaW1hbGVzLCBhdXRyZXMpID8gTGVzcXVlbGxlcyA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIkFyZSB0aGVyZSBmaWd1cmVzIChodW1hbiwgYW5pbWFsLCBvdGhlcik/IFdoaWNoIG9uZXM/XCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcInVuZSB2aWVpbGxlIGZlbW1lLCB1biBjaGllbiBub2lyLCB1bmUgdm9peFx1MjAyNlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZWlkb2xvbl9wcmluY2lwYWxlXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiQ2hvaXNpcyBsYSBmaWd1cmUgbGEgcGx1cyBwclx1MDBFOXNlbnRlLiBEXHUwMEU5Y3Jpcy1sYSBlbiA1IG1vdHMuXCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIkNob29zZSB0aGUgbW9zdCBwcmVzZW50IGZpZ3VyZS4gRGVzY3JpYmUgaXQgaW4gNSB3b3Jkcy5cIixcbiAgICAgICAgaGludDogXCJBaXplbnN0YXQgOiBlaWRvbG9uIFx1MjAxNCBsYSBmaWd1cmUgdml2YW50ZSBkdSByXHUwMEVBdmVcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImJvZHlfdG9fYm9keVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlNpIHR1IHRlIHRpZW5zIFx1MDBFMCBjXHUwMEY0dFx1MDBFOSBkZSBjZXR0ZSBmaWd1cmUgZGFucyBsZSByXHUwMEVBdmUsIHF1J2VzdC1jZSBxdWUgdG9uIGNvcnBzIHJlc3NlbnQgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJJZiB5b3Ugc3RhbmQgYmVzaWRlIHRoaXMgZmlndXJlIGluIHRoZSBkcmVhbSwgd2hhdCBkb2VzIHlvdXIgYm9keSBmZWVsP1wiLFxuICAgICAgICBoaW50OiBcImJvZHktdG8tYm9keSBcdTIwMTQgcGFzIHVuIGNvbmNlcHQsIHVuZSBzZW5zYXRpb25cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImNlX3F1ZWxsZV92ZXV0XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiUXVlIHNlbWJsZSB2b3Vsb2lyIGNldHRlIGZpZ3VyZSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoYXQgZG9lcyB0aGlzIGZpZ3VyZSBzZWVtIHRvIHdhbnQ/XCIsXG4gICAgICAgIGhpbnQ6IFwic2FucyBpbnRlcnByXHUwMEU5dGVyIFx1MjAxNCBcdTAwRTljb3V0ZXJcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImNhZGVhdVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIkNldHRlIGZpZ3VyZSB0J2FwcG9ydGUgcXVlbHF1ZSBjaG9zZS4gUXVvaSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIlRoaXMgZmlndXJlIGJyaW5ncyB5b3Ugc29tZXRoaW5nLiBXaGF0P1wiLFxuICAgICAgICBoaW50OiBcIkFpemVuc3RhdCA6IHRoZSBnaWZ0IFx1MjAxNCBjaGFxdWUgZWlkb2xvbiBwb3J0ZSB1biBkb25cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImZlbHRfc2hpZnRcIixcbiAgICAgICAgdHlwZTogXCJib2R5X3pvbmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBcdTAwRTdhIHJcdTAwRTlzb25uZSBkYW5zIHRvbiBjb3JwcyA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGRvZXMgaXQgcmVzb25hdGUgaW4geW91ciBib2R5P1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWhhXCIsXG4gICAgICAgIHR5cGU6IFwiYWhhX2NhcHR1cmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBlc3QgdG9uIGFoYSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGlzIHlvdXIgYWhhP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyAzLiBcdUQ4M0NcdURGMDAgU0lERVdBTEtfT1JBQ0xFX1RSQUNLSU5HIChNb3NzKSBcdTIwMTQgcG91ciBzaWduZSBkaXVybmVcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIHNpZGV3YWxrX29yYWNsZToge1xuICAgIGlkOiBcInNpZGV3YWxrX29yYWNsZVwiLFxuICAgIGdseXBoOiBcIlx1MjVEMFwiLFxuICAgIHRpdGxlOiBcIlNpZGV3YWxrIE9yYWNsZVwiLFxuICAgIHRpdGxlX2VuOiBcIlNpZGV3YWxrIE9yYWNsZVwiLFxuICAgIHN1YnRpdGxlOiBcIjYgXHUwMEU5dGFwZXMgXHUwMEI3IH40IG1pbiBcdTAwQjcgcG91ciB1biBzaWduZSBkaXVybmVcIixcbiAgICBzdWJ0aXRsZV9lbjogXCI2IHN0ZXBzIFx1MDBCNyB+NCBtaW4gXHUwMEI3IGZvciBhIGRheXRpbWUgc2lnblwiLFxuICAgIHNvdXJjZTogXCJSb2JlcnQgTW9zcyBcdTIwMTQgU2lkZXdhbGsgT3JhY2xlc1wiLFxuICAgIHRhcmdldDogXCJrYWlyb3NcIixcbiAgICB0YXJnZXRfdHlwZTogXCJzaWduZVwiLFxuICAgIGNhdGVnb3J5OiBcImthaXJvc1wiLFxuICAgIGNhdGVnb3J5X2xhYmVsOiBcIlBvdXIgdW4gc2lnbmUgZHUgam91clwiLFxuICAgIHN0ZXBzOiBbXG4gICAgICB7XG4gICAgICAgIGlkOiBcImRlc2NyaXB0aW9uXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiRFx1MDBFOWNyaXMgY2UgcXVlIHR1IGFzIHZ1LCBlbnRlbmR1LCBjcm9pc1x1MDBFOS5cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiRGVzY3JpYmUgd2hhdCB5b3Ugc2F3LCBoZWFyZCwgZW5jb3VudGVyZWQuXCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcInVuIGNvcmJlYXUgcydlc3QgcG9zXHUwMEU5IGRldmFudCBtb2lcdTIwMjZcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImhldXJlX2xpZXVcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJIZXVyZSBldCBsaWV1ID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiVGltZSBhbmQgcGxhY2U/XCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcImNlIG1hdGluLCBlbiBzb3J0YW50IGRlIGNoZXogbW9pXHUyMDI2XCIsXG4gICAgICAgIGhpbnQ6IFwiY291cnQsIHByXHUwMEU5Y2lzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJldGF0X2F2YW50XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiXHUwMEM5dGF0IGludFx1MDBFOXJpZXVyIGp1c3RlIGF2YW50IHF1ZSBcdTAwRTdhIGFycml2ZSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIklubmVyIHN0YXRlIGp1c3QgYmVmb3JlIGl0IGhhcHBlbmVkP1wiLFxuICAgICAgICBoaW50OiBcIlx1MDBFMCBxdW9pIHR1IHBlbnNhaXMsIGNlIHF1ZSB0dSB2aXZhaXNcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImNoYXJnZVwiLFxuICAgICAgICB0eXBlOiBcInNsaWRlclwiLFxuICAgICAgICBxdWVzdGlvbjogXCJDaGFyZ2UgXHUyMDE0IFx1MDBFMCBxdWVsIHBvaW50IFx1MDBFN2EgdCdhIG1hcnF1XHUwMEU5ID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiQ2hhcmdlIFx1MjAxNCBob3cgbXVjaCBkaWQgaXQgc3RyaWtlIHlvdT9cIixcbiAgICAgICAgbWluOiAxLCBtYXg6IDUsXG4gICAgICAgIGhpbnQ6IFwiMSA9IFx1MDBFMCBwZWluZSBcdTAwQjcgNSA9IHNhaXNpc3NhbnRcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImxlY3R1cmVfa2Fpcm9tYW5jZXJcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJTaSBjZSBzaWduZSB0ZSByXHUwMEU5cG9uZGFpdCBcdTAwRTAgdW5lIHF1ZXN0aW9uLCBjZSBzZXJhaXQgcXVlbGxlIHF1ZXN0aW9uID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiSWYgdGhpcyBzaWduIGFuc3dlcmVkIGEgcXVlc3Rpb24sIHdoYXQgcXVlc3Rpb24gd291bGQgaXQgYmU/XCIsXG4gICAgICAgIGhpbnQ6IFwiTW9zcyA6IGthaXJvbWFuY2VyIFx1MjAxNCBsJ29yYWNsZSBkdSBzZXVpbFwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWhhXCIsXG4gICAgICAgIHR5cGU6IFwiYWhhX2NhcHR1cmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBlc3QgdG9uIGFoYSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGlzIHlvdXIgYWhhP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyA0LiBcdUQ4M0NcdURGMDAgUkVWRVJJRV9URU5ESU5HIChCYWNoZWxhcmQpIFx1MjAxNCBwb3VyIHJcdTAwRUF2ZXJpZSBkaXVybmVcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIHJldmVyaWVfdGVuZGluZzoge1xuICAgIGlkOiBcInJldmVyaWVfdGVuZGluZ1wiLFxuICAgIGdseXBoOiBcIlx1MjVEMFwiLFxuICAgIHRpdGxlOiBcIlJldmVyaWUgVGVuZGluZ1wiLFxuICAgIHRpdGxlX2VuOiBcIlJldmVyaWUgVGVuZGluZ1wiLFxuICAgIHN1YnRpdGxlOiBcIjYgXHUwMEU5dGFwZXMgXHUwMEI3IH41IG1pbiBcdTAwQjcgcG91ciB1bmUgclx1MDBFQXZlcmllXCIsXG4gICAgc3VidGl0bGVfZW46IFwiNiBzdGVwcyBcdTAwQjcgfjUgbWluIFx1MDBCNyBmb3IgYSByZXZlcmllXCIsXG4gICAgc291cmNlOiBcIkdhc3RvbiBCYWNoZWxhcmQgXHUyMDE0IExhIFBvXHUwMEU5dGlxdWUgZGUgbGEgUlx1MDBFQXZlcmllXCIsXG4gICAgdGFyZ2V0OiBcImthaXJvc1wiLFxuICAgIHRhcmdldF90eXBlOiBcInJldmVyaWVcIixcbiAgICBjYXRlZ29yeTogXCJrYWlyb3NcIixcbiAgICBjYXRlZ29yeV9sYWJlbDogXCJQb3VyIHVuZSByXHUwMEVBdmVyaWUgZGl1cm5lXCIsXG4gICAgc3RlcHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiY2FwdHVyZV9icnV0ZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIkRcdTAwRTljcmlzIGxhIHJcdTAwRUF2ZXJpZS4gUGFzIGwnYW5hbHlzZSBcdTIwMTQgbCdpbWFnZS5cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiRGVzY3JpYmUgdGhlIHJldmVyaWUuIE5vdCB0aGUgYW5hbHlzaXMgXHUyMDE0IHRoZSBpbWFnZS5cIixcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwiaidcdTAwRTl0YWlzIGVuIHRyYWluIGRlIHJlZ2FyZGVyIHBhciBsYSBmZW5cdTAwRUF0cmVcdTIwMjZcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImVsZW1lbnRfZG9taW5hbnRcIixcbiAgICAgICAgdHlwZTogXCJjaGlwc1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJcdTAwQzlsXHUwMEU5bWVudCBkb21pbmFudCA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIkRvbWluYW50IGVsZW1lbnQ/XCIsXG4gICAgICAgIGNoaXBzOiBbXG4gICAgICAgICAgW1wiZWF1XCIsICAgXCJlYXVcIl0sXG4gICAgICAgICAgW1wiYWlyXCIsICAgXCJhaXJcIl0sXG4gICAgICAgICAgW1wiZmV1XCIsICAgXCJmZXVcIl0sXG4gICAgICAgICAgW1widGVycmVcIiwgXCJ0ZXJyZVwiXSxcbiAgICAgICAgXSxcbiAgICAgICAgaGludDogXCJCYWNoZWxhcmQgOiA0IGltYWdpbmF0aW9ucyBtYXRcdTAwRTlyaWVsbGVzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJjb3NtaXF1ZV9pbnRpbWVcIixcbiAgICAgICAgdHlwZTogXCJjaGlwc1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJDb3NtaXF1ZSBvdSBpbnRpbWUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJDb3NtaWMgb3IgaW50aW1hdGU/XCIsXG4gICAgICAgIGNoaXBzOiBbXG4gICAgICAgICAgW1wiY29zbWlxdWVcIiwgXCJjb3NtaXF1ZSBcdTIwMTQgdmFzdGUsIG91dmVydFwiXSxcbiAgICAgICAgICBbXCJpbnRpbWVcIiwgICBcImludGltZSBcdTIwMTQgcHJvY2hlLCBuaWNoXHUwMEU5XCJdLFxuICAgICAgICBdLFxuICAgICAgICBoaW50OiBcIkJhY2hlbGFyZCA6IGxhIHJcdTAwRUF2ZXJpZSBhIGRldXggcFx1MDBGNGxlc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZWxsZV9zYWxsb25nZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlR1IHByb2xvbmdlcyBsYSByXHUwMEVBdmVyaWUgMzAgc2Vjb25kZXMgZW4gaW1hZ2luYW50LiBRdWUgc2UgcGFzc2UtdC1pbCA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIllvdSBleHRlbmQgdGhlIHJldmVyaWUgMzAgc2Vjb25kcyBieSBpbWFnaW5pbmcuIFdoYXQgaGFwcGVucz9cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImZlbHRfc2hpZnRcIixcbiAgICAgICAgdHlwZTogXCJib2R5X3pvbmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBcdTAwRTdhIHJcdTAwRTlzb25uZSBkYW5zIHRvbiBjb3JwcyA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGRvZXMgaXQgcmVzb25hdGUgaW4geW91ciBib2R5P1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWhhXCIsXG4gICAgICAgIHR5cGU6IFwiYWhhX2NhcHR1cmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBlc3QgdG9uIGFoYSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGlzIHlvdXIgYWhhP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyA1LiBcdUQ4M0NcdURGMDAgSFlQTkFHT0dJQ19SRUNBTEwgKE1hdnJvbWF0aXMpIFx1MjAxNCBwb3VyIGh5cG5hZ29naWVcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGh5cG5hZ29naWNfcmVjYWxsOiB7XG4gICAgaWQ6IFwiaHlwbmFnb2dpY19yZWNhbGxcIixcbiAgICBnbHlwaDogXCJcdTI1RDBcIixcbiAgICB0aXRsZTogXCJIeXBuYWdvZ2ljIFJlY2FsbFwiLFxuICAgIHRpdGxlX2VuOiBcIkh5cG5hZ29naWMgUmVjYWxsXCIsXG4gICAgc3VidGl0bGU6IFwiNSBcdTAwRTl0YXBlcyBcdTAwQjcgfjMgbWluIFx1MDBCNyBwb3VyIHVuZSBoeXBuYWdvZ2llXCIsXG4gICAgc3VidGl0bGVfZW46IFwiNSBzdGVwcyBcdTAwQjcgfjMgbWluIFx1MDBCNyBmb3IgaHlwbmFnb2dpYVwiLFxuICAgIHNvdXJjZTogXCJBbmRyZWFzIE1hdnJvbWF0aXMgXHUyMDE0IEh5cG5hZ29naWFcIixcbiAgICB0YXJnZXQ6IFwia2Fpcm9zXCIsXG4gICAgdGFyZ2V0X3R5cGU6IFwiaHlwbmFnb2dpZVwiLFxuICAgIGNhdGVnb3J5OiBcImthaXJvc1wiLFxuICAgIGNhdGVnb3J5X2xhYmVsOiBcIlBvdXIgdW5lIGh5cG5hZ29naWVcIixcbiAgICBzdGVwczogW1xuICAgICAge1xuICAgICAgICBpZDogXCJjYXB0dXJlX2JydXRlXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiTm90ZSBjZSBxdWkgdGUgcmVzdGUgXHUyMDE0IGltYWdlLCBzb24sIHNlbnNhdGlvbi5cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiTm90ZSB3aGF0IHJlbWFpbnMgXHUyMDE0IGltYWdlLCBzb3VuZCwgc2Vuc2F0aW9uLlwiLFxuICAgICAgICBoaW50OiBcInJhcGlkZSwgc2FucyBmb3JtdWxlciBqb2xpbWVudFwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwibW9kYWxpdGVcIixcbiAgICAgICAgdHlwZTogXCJjaGlwc19tdWx0aVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJNb2RhbGl0XHUwMEU5KHMpID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiTW9kYWxpdHkoaWVzKT9cIixcbiAgICAgICAgY2hpcHM6IFtcbiAgICAgICAgICBbXCJ2aXN1ZWxsZVwiLCAgICAgICBcInZpc3VlbGxlXCJdLFxuICAgICAgICAgIFtcImF1ZGl0aXZlXCIsICAgICAgIFwiYXVkaXRpdmVcIl0sXG4gICAgICAgICAgW1wia2luZXN0aGVzaXF1ZVwiLCAgXCJraW5lc3RoXHUwMEU5c2lxdWVcIl0sXG4gICAgICAgICAgW1widmVyYmFsZVwiLCAgICAgICAgXCJ2ZXJiYWxlXCJdLFxuICAgICAgICAgIFtcImF1dHJlXCIsICAgICAgICAgIFwiYXV0cmVcIl0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJjYXRlZ29yaWVcIixcbiAgICAgICAgdHlwZTogXCJjaGlwc1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJDYXRcdTAwRTlnb3JpZSBNYXZyb21hdGlzID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiTWF2cm9tYXRpcyBjYXRlZ29yeT9cIixcbiAgICAgICAgY2hpcHM6IFtcbiAgICAgICAgICBbXCJnZW9tZXRyaWNcIiwgXCJnXHUwMEU5b21cdTAwRTl0cmlxdWVcIl0sXG4gICAgICAgICAgW1wiZmFjZVwiLCAgICAgIFwidmlzYWdlXCJdLFxuICAgICAgICAgIFtcInNjZW5lXCIsICAgICBcInNjXHUwMEU4bmVcIl0sXG4gICAgICAgICAgW1wicGhyYXNlXCIsICAgIFwicGhyYXNlIGVudGVuZHVlXCJdLFxuICAgICAgICAgIFtcImF1dHJlXCIsICAgICBcImF1dHJlXCJdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwidmVpbGxlX3NvbW1laWxcIixcbiAgICAgICAgdHlwZTogXCJiaW5hcnlcIixcbiAgICAgICAgcXVlc3Rpb246IFwiVHUgYWxsYWlzIHQnZW5kb3JtaXIsIG91IHR1IHRlIHJcdTAwRTl2ZWlsbGFpcyA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldlcmUgeW91IGZhbGxpbmcgYXNsZWVwLCBvciB3YWtpbmc/XCIsXG4gICAgICAgIGNoaXBzOiBbXG4gICAgICAgICAgW1wiZW5kb3JtaXNzZW1lbnRcIiwgXCJlbmRvcm1pc3NlbWVudFwiXSxcbiAgICAgICAgICBbXCJyZXZlaWxcIiwgICAgICAgICBcInJcdTAwRTl2ZWlsXCJdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWhhXCIsXG4gICAgICAgIHR5cGU6IFwiYWhhX2NhcHR1cmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBlc3QgdG9uIGFoYSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGlzIHlvdXIgYWhhP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyA2LiBcdUQ4M0NcdURGMDAgU1lOQ0hST05JQ0lUWV9TVE9SWSAoSG9wY2tlKSBcdTIwMTQgcG91ciBzeW5jaHJvbmljaXRcdTAwRTlcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIHN5bmNocm9uaWNpdHlfc3Rvcnk6IHtcbiAgICBpZDogXCJzeW5jaHJvbmljaXR5X3N0b3J5XCIsXG4gICAgZ2x5cGg6IFwiXHUyNUQwXCIsXG4gICAgdGl0bGU6IFwiU3luY2hyb25pY2l0eSBTdG9yeVwiLFxuICAgIHRpdGxlX2VuOiBcIlN5bmNocm9uaWNpdHkgU3RvcnlcIixcbiAgICBzdWJ0aXRsZTogXCI3IFx1MDBFOXRhcGVzIFx1MDBCNyB+NSBtaW4gXHUwMEI3IHBvdXIgdW5lIHN5bmNocm9uaWNpdFx1MDBFOVwiLFxuICAgIHN1YnRpdGxlX2VuOiBcIjcgc3RlcHMgXHUwMEI3IH41IG1pbiBcdTAwQjcgZm9yIGEgc3luY2hyb25pY2l0eVwiLFxuICAgIHNvdXJjZTogXCJSb2JlcnQgSG9wY2tlIFx1MjAxNCBUaGVyZSBBcmUgTm8gQWNjaWRlbnRzXCIsXG4gICAgdGFyZ2V0OiBcImthaXJvc1wiLFxuICAgIHRhcmdldF90eXBlOiBcInN5bmNocm9uaWNpdGVcIixcbiAgICBjYXRlZ29yeTogXCJrYWlyb3NcIixcbiAgICBjYXRlZ29yeV9sYWJlbDogXCJQb3VyIHVuZSBzeW5jaHJvbmljaXRcdTAwRTlcIixcbiAgICBzdGVwczogW1xuICAgICAge1xuICAgICAgICBpZDogXCJkZXV4X2V2ZW5lbWVudHNcIixcbiAgICAgICAgdHlwZTogXCJ0d29fdGV4dGFyZWFzXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIkwnXHUwMEU5dlx1MDBFOW5lbWVudCBpbnRcdTAwRTlyaWV1ciAoY2UgcXVpIFx1MDBFOXRhaXQgZGFucyB0YSB0XHUwMEVBdGUsIHRvbiBjXHUwMTUzdXIpID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiVGhlIGlubmVyIGV2ZW50ICh3aGF0IHdhcyBpbiB5b3VyIGhlYWQsIHlvdXIgaGVhcnQpP1wiLFxuICAgICAgICBzdWJRdWVzdGlvbjogXCJMJ1x1MDBFOXZcdTAwRTluZW1lbnQgZXh0XHUwMEU5cmlldXIgKGNlIHF1aSBzJ2VzdCBwYXNzXHUwMEU5IGRhbnMgbGUgbW9uZGUpID9cIixcbiAgICAgICAgc3ViUXVlc3Rpb25fZW46IFwiVGhlIG91dGVyIGV2ZW50ICh3aGF0IGhhcHBlbmVkIGluIHRoZSB3b3JsZCk/XCIsXG4gICAgICAgIGhpbnQ6IFwiZGV1eCBjXHUwMEY0dFx1MDBFOXMgZCd1bmUgbVx1MDBFQW1lIGhpc3RvaXJlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJkZWNhbGFnZV90ZW1wb3JlbFwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIkRcdTAwRTljYWxhZ2UgdGVtcG9yZWwgZW50cmUgbGVzIGRldXggP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJUaW1lIGdhcCBiZXR3ZWVuIHRoZSB0d28/XCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcImp1c3RlIGF2YW50IFx1MDBCNyBsZSBsZW5kZW1haW4gXHUwMEI3IDMgc2VtYWluZXMgYXByXHUwMEU4c1x1MjAyNlwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiY2hhcmdlX2FmZmVjdGl2ZVwiLFxuICAgICAgICB0eXBlOiBcInNsaWRlclwiLFxuICAgICAgICBxdWVzdGlvbjogXCJDaGFyZ2UgYWZmZWN0aXZlID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiQWZmZWN0aXZlIGNoYXJnZT9cIixcbiAgICAgICAgbWluOiAxLCBtYXg6IDUsXG4gICAgICAgIGhpbnQ6IFwiMSA9IGxcdTAwRTlnZXIgXHUwMEI3IDUgPSBib3VsZXZlcnNhbnRcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInJlY2l0X25hcnJhdGlmXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiUmFjb250ZSBsZXMgZGV1eCBjb21tZSB1bmUgc2V1bGUgaGlzdG9pcmUuXCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIlRlbGwgYm90aCBhcyBhIHNpbmdsZSBzdG9yeS5cIixcbiAgICAgICAgaGludDogXCJIb3Bja2UgOiBuYXJyYXRpdmUgZXZlbnQgXHUyMDE0IGxhIHN5bmNocm8gZXN0IHJcdTAwRTljaXRcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcInJlY3VycmVuY2VcIixcbiAgICAgICAgdHlwZTogXCJiaW5hcnlcIixcbiAgICAgICAgcXVlc3Rpb246IFwiQ2V0dGUgc3luY2hyb25pY2l0XHUwMEU5IHMnaW5zY3JpdC1lbGxlIGRhbnMgdW5lIHNcdTAwRTlyaWUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJJcyB0aGlzIHN5bmNocm9uaWNpdHkgcGFydCBvZiBhIHNlcmllcz9cIixcbiAgICAgICAgY2hpcHM6IFtcbiAgICAgICAgICBbXCJvdWlcIiwgIFwib3VpIFx1MjAxNCBkJ2F1dHJlcyBzaWduZXMgcGFyZWlsc1wiXSxcbiAgICAgICAgICBbXCJub25cIiwgIFwibm9uIFx1MjAxNCBpc29sXHUwMEU5ZVwiXSxcbiAgICAgICAgICBbXCJwYXNfc3VyXCIsIFwicGFzIHNcdTAwRkJyXHUwMEI3ZVwiXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImZlbHRfc2hpZnRcIixcbiAgICAgICAgdHlwZTogXCJib2R5X3pvbmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBcdTAwRTdhIHJcdTAwRTlzb25uZSBkYW5zIHRvbiBjb3JwcyA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGRvZXMgaXQgcmVzb25hdGUgaW4geW91ciBib2R5P1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYWhhXCIsXG4gICAgICAgIHR5cGU6IFwiYWhhX2NhcHR1cmVcIixcbiAgICAgICAgcXVlc3Rpb246IFwiT1x1MDBGOSBlc3QgdG9uIGFoYSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlIGlzIHlvdXIgYWhhP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyA3LiBcdUQ4M0NcdURGMDAgRk9DVVNJTkdfRkVMVF9TRU5TRSAoR2VuZGxpbikgXHUyMDE0IHBvdXIgZnJpc3NvbiBzb21hdGlxdWVcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGZvY3VzaW5nX2ZlbHRfc2Vuc2U6IHtcbiAgICBpZDogXCJmb2N1c2luZ19mZWx0X3NlbnNlXCIsXG4gICAgZ2x5cGg6IFwiXHUyNUQwXCIsXG4gICAgdGl0bGU6IFwiRm9jdXNpbmcgXHUyMDE0IEZlbHQgU2Vuc2VcIixcbiAgICB0aXRsZV9lbjogXCJGb2N1c2luZyBcdTIwMTQgRmVsdCBTZW5zZVwiLFxuICAgIHN1YnRpdGxlOiBcIjYgXHUwMEU5dGFwZXMgXHUwMEI3IH42IG1pbiBcdTAwQjcgcG91ciB1biBmcmlzc29uXCIsXG4gICAgc3VidGl0bGVfZW46IFwiNiBzdGVwcyBcdTAwQjcgfjYgbWluIFx1MDBCNyBmb3IgYSBib2R5IGNoYXJnZVwiLFxuICAgIHNvdXJjZTogXCJFdWdlbmUgR2VuZGxpbiBcdTIwMTQgRm9jdXNpbmdcIixcbiAgICB0YXJnZXQ6IFwia2Fpcm9zXCIsXG4gICAgdGFyZ2V0X3R5cGU6IFwiZnJpc3NvblwiLFxuICAgIGNhdGVnb3J5OiBcImthaXJvc1wiLFxuICAgIGNhdGVnb3J5X2xhYmVsOiBcIlBvdXIgdW4gZnJpc3NvbiBzb21hdGlxdWVcIixcbiAgICBzdGVwczogW1xuICAgICAge1xuICAgICAgICBpZDogXCJsb2NhbGlzYXRpb25cIixcbiAgICAgICAgdHlwZTogXCJib2R5X3pvbmVfZnVsbFwiLFxuICAgICAgICBxdWVzdGlvbjogXCJPXHUwMEY5LCBkYW5zIHRvbiBjb3JwcyA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoZXJlLCBpbiB5b3VyIGJvZHk/XCIsXG4gICAgICAgIGhpbnQ6IFwic2lsaG91ZXR0ZSBjbGlxdWFibGUgXHUyMDE0IGZyb250ICsgYmFja1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwicXVhbGl0ZV90ZXh0dXJlXCIsXG4gICAgICAgIHR5cGU6IFwiY2hpcHNcIixcbiAgICAgICAgcXVlc3Rpb246IFwiU2kgY2UgZnJpc3NvbiBhdmFpdCB1bmUgdGV4dHVyZSwgY2Ugc2VyYWl0IHF1b2kgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJJZiB0aGlzIGNoYXJnZSBoYWQgYSB0ZXh0dXJlLCB3aGF0IHdvdWxkIGl0IGJlP1wiLFxuICAgICAgICBjaGlwczogW1xuICAgICAgICAgIFtcImNoYXVkXCIsICAgICBcImNoYXVkXCJdLFxuICAgICAgICAgIFtcImZyb2lkXCIsICAgICBcImZyb2lkXCJdLFxuICAgICAgICAgIFtcImxvdXJkXCIsICAgICBcImxvdXJkXCJdLFxuICAgICAgICAgIFtcImxlZ2VyXCIsICAgICBcImxcdTAwRTlnZXJcIl0sXG4gICAgICAgICAgW1wic2VycmVcIiwgICAgIFwic2Vyclx1MDBFOVwiXSxcbiAgICAgICAgICBbXCJvdXZlcnRcIiwgICAgXCJvdXZlcnRcIl0sXG4gICAgICAgICAgW1wicGFscGl0YW50XCIsIFwicGFscGl0YW50XCJdLFxuICAgICAgICAgIFtcImF1dHJlXCIsICAgICBcImF1dHJlXCJdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiaGFuZGxlX3dvcmRcIixcbiAgICAgICAgdHlwZTogXCJ0aXRsZV9zaG9ydFwiLFxuICAgICAgICBxdWVzdGlvbjogXCJRdWVsIG1vdCBjYXB0ZSBhdSBtaWV1eCBjZXR0ZSBzZW5zYXRpb24gP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGljaCB3b3JkIGJlc3QgY2FwdHVyZXMgdGhpcyBzZW5zYXRpb24/XCIsXG4gICAgICAgIGhpbnQ6IFwiR2VuZGxpbiA6IGhhbmRsZSB3b3JkIFx1MjAxNCB1biBtb3QgcXVpIHRpZW50XCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcInRlbmR1IFx1MDBCNyBkb3V4IFx1MDBCNyB2aWJyYW50XHUyMDI2XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJyZXNvbmF0aW5nXCIsXG4gICAgICAgIHR5cGU6IFwiYmluYXJ5XCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlBvc2UgbGUgbW90IHN1ciBsYSBzZW5zYXRpb24uIEVzdC1jZSBxdWUgXHUwMEU3YSByXHUwMEU5c29ubmUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJQbGFjZSB0aGUgd29yZCBvbiB0aGUgc2Vuc2F0aW9uLiBEb2VzIGl0IHJlc29uYXRlP1wiLFxuICAgICAgICBjaGlwczogW1xuICAgICAgICAgIFtcIm91aVwiLCAgICAgXCJvdWkgXHUyMDE0IGMnZXN0IGp1c3RlXCJdLFxuICAgICAgICAgIFtcInByZXNxdWVcIiwgXCJwcmVzcXVlIFx1MjAxNCBwYXMgdG91dCBcdTAwRTAgZmFpdFwiXSxcbiAgICAgICAgICBbXCJub25cIiwgICAgIFwibm9uIFx1MjAxNCBhdXRyZSBtb3RcIl0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJhc2tpbmdcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJEZW1hbmRlIFx1MDBFMCBsYSBzZW5zYXRpb24gOiBcdTAwQUIgcXUnZXN0LWNlIHF1aSB0ZSBmYWl0IFx1MDBFQXRyZSBsXHUwMEUwID8gXHUwMEJCIFx1MjAxNCBzaWxlbmNlIDMwIHNlY29uZGVzIFx1MjAxNCBwdWlzIFx1MDBFOWNyaXMgY2UgcXVpIHZpZW50LlwiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJBc2sgdGhlIHNlbnNhdGlvbjogXFxcIndoYXQgbWFrZXMgeW91IGhlcmU/XFxcIiBcdTIwMTQgMzBzIHNpbGVuY2UgXHUyMDE0IHRoZW4gd3JpdGUgd2hhdCBjb21lcy5cIixcbiAgICAgICAgaGludDogXCJHZW5kbGluIDogYXNraW5nIHN0ZXBcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImFoYV9oYW5kbGVcIixcbiAgICAgICAgdHlwZTogXCJhaGFfY2FwdHVyZVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJPXHUwMEY5IGVzdCB0b24gYWhhID8gRXQgbGUgaGFuZGxlIGZpbmFsID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiV2hlcmUgaXMgeW91ciBhaGE/IEFuZCB0aGUgZmluYWwgaGFuZGxlP1wiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyA4LiBcdUQ4M0NcdURGMDAgRklOX0RFX0pPVVJORUUgKEV4YW1lbiBJZ25hY2llbiBhZGFwdFx1MDBFOSkgXHUyMDE0IHBvdXIgSm91cm5hbCBkZSBWaWVcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGZpbl9kZV9qb3VybmVlOiB7XG4gICAgaWQ6IFwiZmluX2RlX2pvdXJuZWVcIixcbiAgICBnbHlwaDogXCJcdTI2MDlcIixcbiAgICB0aXRsZTogXCJGaW4gZGUgSm91cm5cdTAwRTllXCIsXG4gICAgdGl0bGVfZW46IFwiRW5kIG9mIERheVwiLFxuICAgIHN1YnRpdGxlOiBcIjQgXHUwMEU5dGFwZXMgXHUwMEI3IH41IG1pbiBcdTAwQjcgcG91ciBsZSBKb3VybmFsIGRlIFZpZVwiLFxuICAgIHN1YnRpdGxlX2VuOiBcIjQgc3RlcHMgXHUwMEI3IH41IG1pbiBcdTAwQjcgZm9yIExpZmUgSm91cm5hbFwiLFxuICAgIHNvdXJjZTogXCJFeGFtZW4gSWduYWNpZW4gYWRhcHRcdTAwRTkgXHUwMEI3IE1vc3MgKyBXYW5neWFsXCIsXG4gICAgdGFyZ2V0OiBcImpvdXJuYWxcIiwgICAgICAgICAgICAvLyBcdTIxOTIgUE9TVCAvYXBpL2pvdXJuYWwvZW50cmllc1xuICAgIHRhcmdldF90eXBlOiBcIm5vdGVcIixcbiAgICBjYXRlZ29yeTogXCJqb3VybmFsXCIsXG4gICAgY2F0ZWdvcnlfbGFiZWw6IFwiUG91ciB0b24gSm91cm5hbCBkZSBWaWUgKGxlIHNvaXIpXCIsXG4gICAgc3RlcHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiZ3JhdGl0dWRlXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiUXUnZXN0LWNlIHF1aSBtXHUwMEU5cml0ZSB0YSBncmF0aXR1ZGUgYXVqb3VyZCdodWkgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGF0IGRlc2VydmVzIHlvdXIgZ3JhdGl0dWRlIHRvZGF5P1wiLFxuICAgICAgICBoaW50OiBcInZvaXggcG9zc2libGUgXHUwMEI3IHNhbnMgaGlcdTAwRTlyYXJjaGlzZXJcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcIm1vdXZlbWVudF9pbnRlcmlldXJcIixcbiAgICAgICAgdHlwZTogXCJjaGlwc1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJRdWVsIG1vdXZlbWVudCB0J2EgdHJhdmVyc1x1MDBFOSBhdWpvdXJkJ2h1aSA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIldoYXQgbW92ZW1lbnQgY3Jvc3NlZCB0aHJvdWdoIHlvdSB0b2RheT9cIixcbiAgICAgICAgY2hpcHM6IFtcbiAgICAgICAgICBbXCJqb2llXCIsICAgICBcImpvaWVcIl0sXG4gICAgICAgICAgW1wiZGVzaXJcIiwgICAgXCJkXHUwMEU5c2lyXCJdLFxuICAgICAgICAgIFtcInBldXJcIiwgICAgIFwicGV1clwiXSxcbiAgICAgICAgICBbXCJwYWl4XCIsICAgICBcInBhaXhcIl0sXG4gICAgICAgICAgW1wiY29sZXJlXCIsICAgXCJjb2xcdTAwRThyZVwiXSxcbiAgICAgICAgICBbXCJ0cmlzdGVzc2VcIixcInRyaXN0ZXNzZVwiXSxcbiAgICAgICAgICBbXCJhdXRyZVwiLCAgICBcImF1dHJlXCJdLFxuICAgICAgICBdLFxuICAgICAgICBoaW50OiBcIkV4YW1lbiBpZ25hY2llbiA6IG5vdGVyIGxlcyBtb3V2ZW1lbnRzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJxdWVzdGlvbl9vdXZlcnRlXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiWSBhLXQtaWwgdW5lIHF1ZXN0aW9uIHF1aSBzJ2VzdCBwb3NcdTAwRTllIFx1MDBFMCB0b2kgc2FucyByXHUwMEU5cG9uc2UgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJJcyB0aGVyZSBhIHF1ZXN0aW9uIHRoYXQgYXJvc2Ugd2l0aG91dCBhbiBhbnN3ZXI/XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJpbnRlbnRpb25fZGVfbnVpdFwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIkF2ZWMgcXVvaSB2ZXV4LXR1IHQnZW5kb3JtaXIgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGF0IGRvIHlvdSB3YW50IHRvIHNsZWVwIHdpdGg/XCIsXG4gICAgICAgIGhpbnQ6IFwidHUgcGV1eCBlbnN1aXRlIGVuY2hhXHUwMEVFbmVyIHN1ciBsZSByaXR1ZWwgcHJcdTAwRTktc29tbWVpbFwiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJ1bmUgaW1hZ2UsIHVuIG1vdCwgdW5lIHF1ZXN0aW9uIHBvdXIgbGEgbnVpdFx1MjAyNlwiLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyA5LiBcdUQ4M0NcdURGMTkgUFJFX1NPTU1FSUwgXHUyMDE0IHJpdHVlbCB0ZW1wb3JlbCAoaW5jdWJhdGlvbiBNb3NzICsgTGFCZXJnZSBNSUxEKVxuICAvLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgcHJlX3NvbW1laWw6IHtcbiAgICBpZDogXCJwcmVfc29tbWVpbFwiLFxuICAgIGdseXBoOiBcIlx1RDgzQ1x1REYxOVwiLFxuICAgIHRpdGxlOiBcIlByXHUwMEU5LXNvbW1laWwgXHUyMDE0IEluY3ViYXRpb25cIixcbiAgICB0aXRsZV9lbjogXCJQcmUtc2xlZXAgXHUyMDE0IEluY3ViYXRpb25cIixcbiAgICBzdWJ0aXRsZTogXCI2IFx1MDBFOXRhcGVzIFx1MDBCNyB+NiBtaW4gXHUwMEI3IHJpdHVlbCBkdSBzb2lyXCIsXG4gICAgc3VidGl0bGVfZW46IFwiNiBzdGVwcyBcdTAwQjcgfjYgbWluIFx1MDBCNyBldmVuaW5nIHJpdHVhbFwiLFxuICAgIHNvdXJjZTogXCJSb2JlcnQgTW9zcyArIFN0ZXBoZW4gTGFCZXJnZSAoTUlMRCkgKyBUZW56aW4gV2FuZ3lhbCBcdTIwMTQgVGliZXRhbiBZb2dhcyBvZiBEcmVhbVwiLFxuICAgIHRhcmdldDogXCJrYWlyb3NcIixcbiAgICB0YXJnZXRfdHlwZTogXCJub3RlXCIsICAgICAgICAgIC8vIGRcdTAwRTlwXHUwMEY0dCBsXHUwMEU5Z2VyIHBvdXIgdHJhXHUwMEU3ZXIgbCdpbnRlbnRpb25cbiAgICBjYXRlZ29yeTogXCJyaXR1YWxcIixcbiAgICBjYXRlZ29yeV9sYWJlbDogXCJSaXR1ZWxzIGR1IHRlbXBzXCIsXG4gICAgc3RlcHM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYmlsYW5fam91cm5lZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlRhIGpvdXJuXHUwMEU5ZSBlbiB1bmUgcGhyYXNlID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiWW91ciBkYXkgaW4gb25lIHNlbnRlbmNlP1wiLFxuICAgICAgICBwbGFjZWhvbGRlcjogXCJjb3VydGUsIHNhbnMgc29pZ25lclwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwicXVlc3Rpb25faW5jdWJhdGlvblwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlkgYS10LWlsIHVuZSBxdWVzdGlvbiBxdWUgdHUgdmV1eCBwb3NlciBcdTAwRTAgdGVzIHJcdTAwRUF2ZXMgY2V0dGUgbnVpdCA/XCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIklzIHRoZXJlIGEgcXVlc3Rpb24geW91IHdhbnQgdG8gYXNrIHlvdXIgZHJlYW1zIHRvbmlnaHQ/XCIsXG4gICAgICAgIGhpbnQ6IFwiTW9zcyA6IGRyZWFtIGluY3ViYXRpb24gXHUyMDE0IHNlbWVyIHBvdXIgbGEgbnVpdFwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiaW1hZ2VfZ3JhaW5lXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiVW5lIGltYWdlIHF1aSBwb3VycmFpdCBcdTAwRUF0cmUgdG9uIHBvaW50IGQnZW50clx1MDBFOWUgZGFucyBsZSByXHUwMEVBdmUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJBbiBpbWFnZSB0aGF0IGNvdWxkIGJlIHlvdXIgZW50cnkgcG9pbnQgaW50byB0aGUgZHJlYW0/XCIsXG4gICAgICAgIHBsYWNlaG9sZGVyOiBcInVuZSBwb3J0ZSwgdW4gdmlzYWdlLCB1bmUgbHVtaVx1MDBFOHJlXHUyMDI2XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJpbnRlbnRpb25fbWlsZFwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlNpIHR1IHJcdTAwRUF2ZXMgY2V0dGUgbnVpdCBcdTIwMTQgY29tbWVudCB2ZXV4LXR1IHkgXHUwMEVBdHJlID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiSWYgeW91IGRyZWFtIHRvbmlnaHQgXHUyMDE0IGhvdyBkbyB5b3Ugd2FudCB0byBiZSB0aGVyZT9cIixcbiAgICAgICAgaGludDogXCJMYUJlcmdlIE1JTEQgOiBcdTAwQUIgU2kgamUgclx1MDBFQXZlLCBqZSBkZXZpZW5zIGx1Y2lkZSBcdTAwQkJcIixcbiAgICAgICAgcGxhY2Vob2xkZXI6IFwicHJcdTAwRTlzZW50XHUwMEI3ZSwgbHVjaWRlLCBcdTAwRTAgbCdcdTAwRTljb3V0ZVx1MjAyNlwiLFxuICAgICAgICBza2lwcGFibGU6IHRydWUsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJyZXNwaXJhdGlvblwiLFxuICAgICAgICB0eXBlOiBcImJyZWF0aGluZ1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJUcm9pcyBjeWNsZXMuIEluc3BpcmUgNCwgcmV0aWVucyA0LCBleHBpcmUgNi5cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiVGhyZWUgY3ljbGVzLiBJbmhhbGUgNCwgaG9sZCA0LCBleGhhbGUgNi5cIixcbiAgICAgICAgZHVyYXRpb246IDQyMDAwLCAgICAgICAgICAgLy8gMyBjeWNsZXMgXHUwMEQ3IDE0c1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiYm9ubmVfdHJhdmVyc2VlXCIsXG4gICAgICAgIHR5cGU6IFwiaW5mb1wiLFxuICAgICAgICBxdWVzdGlvbjogXCJMZSByXHUwMEVBdmUgc2FpdC4gQm9ubmUgdHJhdmVyc1x1MDBFOWUuXCIsXG4gICAgICAgIHF1ZXN0aW9uX2VuOiBcIlRoZSBkcmVhbSBrbm93cy4gU2FmZSBjcm9zc2luZy5cIixcbiAgICAgICAgZHVyYXRpb246IDQwMDAsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIDEwLiBcdUQ4M0VcdURFQjcgUkVFTlRSWSAoQWl6ZW5zdGF0ICsgSnVuZyBhY3RpdmUgaW1hZ2luYXRpb24pIFx1MjAxNCBzdXIga2Fpcm9zIGRcdTAwRTlqXHUwMEUwIGRcdTAwRTlwb3NcdTAwRTlcbiAgLy8gTm90ZSA6IFx1MDBFOXRhcGVzIDEtMiAoZ2F0ZSB0cmF1bWEtc2FmZSArIGNob2l4IGNoZW1pbikgc29udCBnXHUwMEU5clx1MDBFOWVzIEFWQU5UIHBhclxuICAvLyBSZWVudHJ5U2NyZWVuIGFjdHVlbCAoc2NyZWVucy1zb21hLmpzeCkuIENlIHByb3RvY29sZSBlc3QgYXBwZWxcdTAwRTkgYXByXHUwMEU4cy5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIHJlZW50cnk6IHtcbiAgICBpZDogXCJyZWVudHJ5XCIsXG4gICAgZ2x5cGg6IFwiXHVEODNFXHVERUI3XCIsXG4gICAgdGl0bGU6IFwiUlx1MDBFOWVudHJcdTAwRTllIFx1MjAxNCBBY3RpdmUgSW1hZ2luYXRpb25cIixcbiAgICB0aXRsZV9lbjogXCJSZS1lbnRyeSBcdTIwMTQgQWN0aXZlIEltYWdpbmF0aW9uXCIsXG4gICAgc3VidGl0bGU6IFwiNSBcdTAwRTl0YXBlcyBcdTAwQjcgfjEwIG1pbiBcdTAwQjcgc3VyIHVuIHJcdTAwRUF2ZSBkXHUwMEU5alx1MDBFMCBkXHUwMEU5cG9zXHUwMEU5XCIsXG4gICAgc3VidGl0bGVfZW46IFwiNSBzdGVwcyBcdTAwQjcgfjEwIG1pbiBcdTAwQjcgb24gYSBkZXBvc2l0ZWQgZHJlYW1cIixcbiAgICBzb3VyY2U6IFwiU3RlcGhlbiBBaXplbnN0YXQgKyBDLkcuIEp1bmcgXHUyMDE0IFJlZCBCb29rIC8gQWN0aXZlIEltYWdpbmF0aW9uXCIsXG4gICAgdGFyZ2V0OiBcImthaXJvc19leGlzdGluZ1wiLCAgICAgLy8gUEFUQ0ggbGUga2Fpcm9zSWQgZm91cm5pXG4gICAgY2F0ZWdvcnk6IFwicml0dWFsXCIsXG4gICAgY2F0ZWdvcnlfbGFiZWw6IFwiUml0dWVscyBkdSB0ZW1wc1wiLFxuICAgIHJlcXVpcmVzX2thaXJvc19pZDogdHJ1ZSxcbiAgICBzdGVwczogW1xuICAgICAge1xuICAgICAgICBpZDogXCJyZWltYWdpbmVyXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dGFyZWFcIixcbiAgICAgICAgcXVlc3Rpb246IFwiUmVwcmVuZHMgbGUgclx1MDBFQXZlLiBUdSB0ZSB0aWVucyBsXHUwMEUwIG9cdTAwRjkgdHUgXHUwMEU5dGFpcy4gUXVlIHZvaXMtdHUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJUYWtlIHVwIHRoZSBkcmVhbSBhZ2Fpbi4gWW91IHN0YW5kIHdoZXJlIHlvdSB3ZXJlLiBXaGF0IGRvIHlvdSBzZWU/XCIsXG4gICAgICAgIGhpbnQ6IFwiQWl6ZW5zdGF0IDogdHUgbidhbmFseXNlcyBwYXMgXHUyMDE0IHR1IHkgcmV0b3VybmVzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJjaG9peF9maWd1cmVcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJTaSB0dSBwZXV4IGRpYWxvZ3VlciBhdmVjIHVuZSBmaWd1cmUgZHUgclx1MDBFQXZlIFx1MjAxNCBsYXF1ZWxsZSA/IEV0IHF1ZSBsdWkgZGlzLXR1ID9cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiSWYgeW91IGNhbiBkaWFsb2d1ZSB3aXRoIGEgZmlndXJlIG9mIHRoZSBkcmVhbSBcdTIwMTQgd2hpY2ggb25lPyBBbmQgd2hhdCBkbyB5b3Ugc2F5P1wiLFxuICAgICAgICBoaW50OiBcIkp1bmcgOiBhY3RpdmUgaW1hZ2luYXRpb24gY29tbWVuY2UgcGFyIHBhcmxlclwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwicmVwb25zZV9pbWFnaW5lZVwiLFxuICAgICAgICB0eXBlOiBcInRleHRhcmVhXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIlF1ZSB0ZSByXHUwMEU5cG9uZC1lbGxlID8gSW1hZ2luZSwgXHUwMEU5Y3Jpcy5cIixcbiAgICAgICAgcXVlc3Rpb25fZW46IFwiV2hhdCBkb2VzIHNoZS9oZS9pdCBhbnN3ZXI/IEltYWdpbmUsIHdyaXRlLlwiLFxuICAgICAgICBoaW50OiBcIkp1bmcgOiBsYWlzc2UgbCdpbWFnZSBwYXJsZXIgXHUyMDE0IG5lIGNvcnJpZ2UgcGFzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJnZXN0ZV9yaXR1ZWxcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0YXJlYVwiLFxuICAgICAgICBxdWVzdGlvbjogXCJRdWVsIGdlc3RlIFx1MDBFOXZlaWxsXHUwMEU5IHBldXQgaG9ub3JlciBjZXR0ZSByXHUwMEU5ZW50clx1MDBFOWUgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGF0IHdha2luZyBnZXN0dXJlIGNhbiBob25vciB0aGlzIHJlLWVudHJ5P1wiLFxuICAgICAgICBoaW50OiBcIk1vc3MgOiBob25vcmluZyBhY3Rpb25cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGlkOiBcImFoYVwiLFxuICAgICAgICB0eXBlOiBcImFoYV9jYXB0dXJlXCIsXG4gICAgICAgIHF1ZXN0aW9uOiBcIk9cdTAwRjkgZXN0IHRvbiBhaGEgP1wiLFxuICAgICAgICBxdWVzdGlvbl9lbjogXCJXaGVyZSBpcyB5b3VyIGFoYT9cIixcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBIZWxwZXJzIGRlIGRcdTAwRTljb3V2ZXJ0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmZ1bmN0aW9uIGxpc3RQcm90b2NvbGVzKHsgY2F0ZWdvcnkgPSBudWxsIH0gPSB7fSkge1xuICBjb25zdCBhbGwgPSBPYmplY3QudmFsdWVzKFBST1RPQ09MRVNfQ0FUQUxPRyk7XG4gIGlmIChjYXRlZ29yeSkgcmV0dXJuIGFsbC5maWx0ZXIocCA9PiBwLmNhdGVnb3J5ID09PSBjYXRlZ29yeSk7XG4gIHJldHVybiBhbGw7XG59XG5cbmZ1bmN0aW9uIGdldFByb3RvY29sZShpZCkge1xuICByZXR1cm4gUFJPVE9DT0xFU19DQVRBTE9HW2lkXSB8fCBudWxsO1xufVxuXG4vLyBNYXBwaW5nIGthaXJvc190eXBlIFx1MjE5MiBwcm90b2NvbGVzIHN1Z2dcdTAwRTlyXHUwMEU5cyAoVUkgaGVscGVyKVxuY29uc3QgVFlQRV9UT19QUk9UT0NPTEVTID0ge1xuICByZXZlOiAgICAgICAgICBbXCJsaWdodG5pbmdfZHJlYW13b3JrXCIsIFwiZHJlYW1fdGVuZGluZ1wiXSxcbiAgc2lnbmU6ICAgICAgICAgW1wic2lkZXdhbGtfb3JhY2xlXCJdLFxuICByZXZlcmllOiAgICAgICBbXCJyZXZlcmllX3RlbmRpbmdcIl0sXG4gIGh5cG5hZ29naWU6ICAgIFtcImh5cG5hZ29naWNfcmVjYWxsXCJdLFxuICBzeW5jaHJvbmljaXRlOiBbXCJzeW5jaHJvbmljaXR5X3N0b3J5XCJdLFxuICBmcmlzc29uOiAgICAgICBbXCJmb2N1c2luZ19mZWx0X3NlbnNlXCJdLFxuICBub3RlOiAgICAgICAgICBbXCJmaW5fZGVfam91cm5lZVwiXSxcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gIFBST1RPQ09MRVNfQ0FUQUxPRyxcbiAgbGlzdFByb3RvY29sZXMsXG4gIGdldFByb3RvY29sZSxcbiAgVFlQRV9UT19QUk9UT0NPTEVTLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUE2QkEsTUFBTSxxQkFBcUI7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQUt6QixxQkFBcUI7QUFBQSxJQUNuQixJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsSUFDVixhQUFhO0FBQUEsSUFDYixRQUFRO0FBQUEsSUFDUixRQUFRO0FBQUE7QUFBQSxJQUNSLGFBQWE7QUFBQTtBQUFBLElBQ2IsVUFBVTtBQUFBO0FBQUEsSUFDVixnQkFBZ0I7QUFBQSxJQUNoQixPQUFPO0FBQUEsTUFDTDtBQUFBLFFBQ0UsSUFBSTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sVUFBVTtBQUFBLFFBQ1YsYUFBYTtBQUFBLFFBQ2IsTUFBTTtBQUFBLFFBQ04sYUFBYTtBQUFBLE1BQ2Y7QUFBQSxNQUNBO0FBQUEsUUFDRSxJQUFJO0FBQUEsUUFDSixNQUFNO0FBQUEsUUFDTixVQUFVO0FBQUEsUUFDVixhQUFhO0FBQUEsUUFDYixNQUFNO0FBQUEsUUFDTixhQUFhO0FBQUEsTUFDZjtBQUFBLE1BQ0E7QUFBQSxRQUNFLElBQUk7QUFBQSxRQUNKLE1BQU07QUFBQSxRQUNOLFVBQVU7QUFBQSxRQUNWLGFBQWE7QUFBQSxRQUNiLE9BQU87QUFBQSxVQUNMLENBQUMsUUFBWSxNQUFNO0FBQUEsVUFDbkIsQ0FBQyxRQUFZLE1BQU07QUFBQSxVQUNuQixDQUFDLGFBQVksV0FBVztBQUFBLFVBQ3hCLENBQUMsVUFBWSxXQUFRO0FBQUEsVUFDckIsQ0FBQyxZQUFZLFVBQVU7QUFBQSxVQUN2QixDQUFDLFFBQVksTUFBTTtBQUFB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
