import type { ProtocolConfig } from '@/components/dream/screens/ProtocolGuide';

/**
 * Les 3 protocoles guidés de Dream — bilingues FR/EN
 * Basés sur protocol-stack.json (Forêt de 40+ livres oniriques)
 */

export const DREAM_PROTOCOL: ProtocolConfig = {
  id: 'rêve',
  title: 'Réception de rêve',
  subtitle: 'protocole en 10 étapes · Moss, Gendlin, Seth, Hillman',
  icon: '◯',
  entryType: 'dream',
  aiMode: 'dream',
  finalCTA: 'achever le protocole',
  placeholder: 'écris au fil, sans corriger...',
  footerHint: 'sans jugement, sans fin',
  en: {
    title: 'Dream reception',
    subtitle: '10-step protocol · Moss, Gendlin, Seth, Hillman',
    finalCTA: 'complete the protocol',
    placeholder: 'write as it comes, don\'t edit...',
    footerHint: 'no judgment, no end',
  },
  steps: [
    {
      name: 'accueil',
      hint: 'revois le rêve comme un film, sans analyser',
      question: "Tu as voyagé quelque part\ncette nuit.\nRaconte-moi.",
      en: {
        name: 'welcome',
        hint: 'relive the dream like a film, without analyzing',
        question: "You traveled somewhere\nlast night.\nTell me.",
      },
    },
    {
      name: 'sens',
      hint: 'les détails cristallins sont des marqueurs — ton intelligence plus large signale ce qui compte',
      question: "Quels détails sont cristallins ?\nCouleur, texture,\ntempérature, son ?",
      en: {
        name: 'senses',
        hint: 'crystalline details are markers — your wider intelligence signals what matters',
        question: "What details are crystalline?\nColor, texture,\ntemperature, sound?",
      },
    },
    {
      name: 'corps',
      hint: 'le felt sense (Gendlin) — pas une émotion nommée, juste la qualité globale',
      question: "Ferme les yeux un instant.\nLe rêve dans son ensemble —\nqu'est-ce que ça fait\ndans ton corps ?",
      en: {
        name: 'body',
        hint: 'the felt sense (Gendlin) — not a named emotion, just the overall quality',
        question: "Close your eyes a moment.\nThe dream as a whole —\nwhat does it feel like\nin your body?",
      },
    },
    {
      name: 'littéral',
      hint: 'avant le symbolique — vérification chamanique (Moss)',
      question: "Avant de chercher du sens :\nça pourrait être littéral ?\nCe lieu existe ?\nCes personnes existent ?",
      en: {
        name: 'literal',
        hint: 'before the symbolic — shamanic check (Moss)',
        question: "Before seeking meaning:\ncould it be literal?\nDoes this place exist?\nDo these people exist?",
      },
    },
    {
      name: 'si c\'était mon rêve',
      hint: 'projection socratique — l\'IA offre 3 à 5 pistes conditionnelles',
      question: "L'oracle va te proposer\nplusieurs lectures possibles.\nMais d'abord — toi,\nqu'est-ce que tu en fais\nde ce rêve ?",
      en: {
        name: 'if it were my dream',
        hint: 'socratic projection — the AI offers 3-5 conditional readings',
        question: "The oracle will offer you\nseveral possible readings.\nBut first — you,\nwhat do you make\nof this dream?",
      },
      insightDuration: 5000,
    },
    {
      name: 'résonances',
      hint: 'l\'IA croise avec tes rêves passés et ton journal',
      question: "Est-ce que ce rêve\nte rappelle quelque chose ?\nUn autre rêve,\nun événement récent,\nun sentiment familier ?",
      en: {
        name: 'resonances',
        hint: 'the AI crosses with your past dreams and journal',
        question: "Does this dream\nremind you of something?\nAnother dream,\na recent event,\na familiar feeling?",
      },
    },
    {
      name: 'croyance',
      hint: 'Seth — les croyances sont des directives créatives que le rêve révèle',
      question: "Si ce rêve révélait\nune croyance profonde\nque tu portes —\nlaquelle serait-ce ?",
      en: {
        name: 'belief',
        hint: 'Seth — beliefs are creative directives that dreams reveal',
        question: "If this dream revealed\na deep belief\nyou carry —\nwhich would it be?",
      },
    },
    {
      name: 'garde',
      hint: 'un fragment à emporter dans le jour',
      question: "De tout ça,\nqu'est-ce que tu veux\ngarder pour aujourd'hui ?",
      en: {
        name: 'keep',
        hint: 'a fragment to carry into the day',
        question: "Of all this,\nwhat do you want\nto keep for today?",
      },
    },
    {
      name: 'action',
      hint: 'Hill + Gendlin : l\'insight sans action est incomplet',
      question: "Que veux-tu faire\navec ce rêve ?\nUn geste concret,\nmême tout petit.",
      en: {
        name: 'action',
        hint: 'Hill + Gendlin: insight without action is incomplete',
        question: "What do you want to do\nwith this dream?\nA concrete gesture,\neven a small one.",
      },
    },
    {
      name: 'titre',
      hint: 'Moss : nommer le rêve, c\'est lui donner une forme qui tient',
      question: "Nomme ce rêve.\nTrois à cinq mots —\npour le retrouver,\net pour lui donner\nune forme qui tient.",
      en: {
        name: 'title',
        hint: 'Moss: naming the dream gives it a shape that holds',
        question: "Name this dream.\nThree to five words —\nto find it again,\nand to give it\na shape that holds.",
      },
      isTitle: true,
    },
  ],
};

export const DAY_PROTOCOL: ProtocolConfig = {
  id: 'journal',
  title: 'Journal de jour',
  subtitle: 'croiser ta journée avec tes rêves · 5 étapes',
  icon: '☼',
  entryType: 'day',
  aiMode: 'day',
  finalCTA: 'déposer',
  placeholder: 'ce qui s\'est passé, ce qui t\'habite...',
  footerHint: 'tout est matière',
  en: {
    title: 'Day journal',
    subtitle: 'cross your day with your dreams · 5 steps',
    finalCTA: 'lay down',
    placeholder: 'what happened, what stays with you...',
    footerHint: 'everything is material',
  },
  steps: [
    {
      name: 'dépôt',
      hint: 'raconte sans filtrer — rencontres, conflits, événements, questionnements',
      question: "Qu'est-ce qui s'est passé\naujourd'hui ?\nUne rencontre, un conflit,\nun signe, un questionnement ?",
      en: {
        name: 'deposit',
        hint: 'tell without filtering — encounters, conflicts, events, questions',
        question: "What happened today?\nAn encounter, a conflict,\na sign, a question?",
      },
    },
    {
      name: 'corps',
      hint: 'le ressenti somatique de ta journée',
      question: "Comment ton corps\nporte cette journée ?\nOù se loge la tension,\noù se loge le calme ?",
      en: {
        name: 'body',
        hint: 'the somatic feeling of your day',
        question: "How does your body\ncarry this day?\nWhere does tension live,\nwhere does calm live?",
      },
    },
    {
      name: 'échos',
      hint: 'l\'IA cherche des résonances avec tes rêves récents',
      question: "Est-ce que quelque chose\ndans ta journée\nfait écho à un rêve récent ?\nUne image, un lieu,\nune sensation ?",
      en: {
        name: 'echoes',
        hint: 'the AI looks for resonances with your recent dreams',
        question: "Does anything\nin your day\necho a recent dream?\nAn image, a place,\na sensation?",
      },
      insightDuration: 5000,
    },
    {
      name: 'synchronicité',
      hint: 'ces moments où quelque chose s\'aligne sans raison apparente',
      question: "Y a-t-il eu un moment\nde coïncidence aujourd'hui ?\nComme si quelque chose\ns'alignait ?",
      en: {
        name: 'synchronicity',
        hint: 'those moments when something aligns for no apparent reason',
        question: "Was there a moment\nof coincidence today?\nAs if something\nwas aligning?",
      },
    },
    {
      name: 'intention de nuit',
      hint: 'planter une graine pour la nuit qui vient',
      question: "Ce soir, avec quoi\nvoudrais-tu dormir ?\nQuelle question,\nquelle intention\npour la nuit ?",
      en: {
        name: 'night intention',
        hint: 'plant a seed for the coming night',
        question: "Tonight, what would you\nlike to sleep with?\nWhat question,\nwhat intention\nfor the night?",
      },
    },
  ],
};

export const RITUAL_PROTOCOL: ProtocolConfig = {
  id: 'rituel',
  title: 'Rituel pré-sommeil',
  subtitle: 'préparer la traversée · Moss, Wangyal, Seth',
  icon: '☽',
  entryType: 'dream',
  aiMode: 'ritual',
  finalCTA: 'bonne traversée',
  placeholder: 'à voix basse...',
  footerHint: 'le silence fait partie du rituel',
  en: {
    title: 'Pre-sleep ritual',
    subtitle: 'preparing the crossing · Moss, Wangyal, Seth',
    finalCTA: 'safe crossing',
    placeholder: 'softly...',
    footerHint: 'silence is part of the ritual',
  },
  steps: [
    {
      name: 'atterrissage',
      hint: 'ramener l\'attention dans le corps — laisser la journée se déposer',
      question: "Comment tu arrives\nce soir ?\nTon corps, ton énergie —\noù t'en es ?",
      en: {
        name: 'landing',
        hint: 'bring attention into the body — let the day settle',
        question: "How are you arriving\ntonight?\nYour body, your energy —\nwhere are you?",
      },
    },
    {
      name: 'revue',
      hint: 'technique Wangyal — remonter la journée à l\'envers',
      question: "Remonte ta journée\nà l'envers.\nQu'est-ce qui reste ?\nUn moment, une image,\nune sensation.",
      en: {
        name: 'review',
        hint: 'Wangyal technique — rewind the day backwards',
        question: "Rewind your day\nbackwards.\nWhat remains?\nA moment, an image,\na sensation.",
      },
      insightDuration: 4000,
    },
    {
      name: 'incubation',
      hint: 'planter une graine pour la nuit — c\'est la phase clé',
      question: "De quoi as-tu besoin\ncette nuit ?\nPas ce que tu veux savoir —\nce dont ton âme a besoin.",
      en: {
        name: 'incubation',
        hint: 'plant a seed for the night — this is the key phase',
        question: "What do you need\ntonight?\nNot what you want to know —\nwhat your soul needs.",
      },
    },
    {
      name: 'soma',
      hint: 'préparer le corps à devenir réceptif',
      question: "Relâche ta mâchoire.\nTes épaules. Le ventre.\nLes yeux.\nOù se loge encore\nune tension ?",
      en: {
        name: 'soma',
        hint: 'prepare the body to become receptive',
        question: "Release your jaw.\nYour shoulders. Your belly.\nYour eyes.\nWhere does tension\nstill live?",
      },
    },
    {
      name: 'seuil',
      hint: 'le dernier échange avant la traversée',
      question: "Répète ton intention\nen une phrase.\nCourte, claire,\ncomme une graine\nqu'on confie à la terre.",
      en: {
        name: 'threshold',
        hint: 'the last exchange before crossing',
        question: "Repeat your intention\nin one sentence.\nShort, clear,\nlike a seed\nentrusted to the earth.",
      },
      insightDuration: 6000,
    },
  ],
};

export const REENTRY_PROTOCOL: ProtocolConfig = {
  id: 'réentrée',
  title: 'Réentrée onirique',
  subtitle: 'replonger dans un rêve ancien · Moss, Gendlin, Hillman',
  icon: '◯',
  entryType: 'reentry',
  aiMode: 'reentry',
  finalCTA: 'remonter à la surface',
  placeholder: 'laisse les images revenir...',
  footerHint: 'le rêve t\'attend',
  en: {
    title: 'Dream re-entry',
    subtitle: 'dive back into an old dream · Moss, Gendlin, Hillman',
    finalCTA: 'surface',
    placeholder: 'let the images return...',
    footerHint: 'the dream awaits',
  },
  steps: [
    {
      name: 'relecture',
      hint: 'relis le rêve lentement — comme si tu y retournais',
      question: "Relis ton rêve.\nPas pour l'analyser —\npour y retourner.\nQu'est-ce qui te frappe\nmaintenant que tu ne\nvoyais pas avant ?",
      en: {
        name: 'rereading',
        hint: 'reread the dream slowly — as if returning there',
        question: "Reread your dream.\nNot to analyze it —\nto return there.\nWhat strikes you now\nthat you didn't\nsee before?",
      },
    },
    {
      name: 'corps',
      hint: 'Gendlin : le corps se souvient avant l\'esprit',
      question: "Ferme les yeux.\nEn relisant ce rêve —\nqu'est-ce que tu sens\ndans ton corps ?\nOù ça se loge ?",
      en: {
        name: 'body',
        hint: 'Gendlin: the body remembers before the mind',
        question: "Close your eyes.\nRereading this dream —\nwhat do you feel\nin your body?\nWhere does it live?",
      },
    },
    {
      name: 'retour au lieu',
      hint: 'Moss : rêver c\'est voyager — retourne dans le lieu du rêve',
      question: "Retourne dans le lieu\ndu rêve.\nQu'est-ce qui a changé\ndepuis la dernière fois ?\nQu'est-ce qui t'attend là ?",
      en: {
        name: 'return to place',
        hint: 'Moss: dreaming is traveling — return to the dream place',
        question: "Return to the place\nof the dream.\nWhat has changed\nsince last time?\nWhat awaits you there?",
      },
      insightDuration: 5000,
    },
    {
      name: 'dialogue',
      hint: 'Hillman : les figures du rêve sont des présences, pas des symboles',
      question: "Y avait-il une présence\ndans ce rêve ?\nSi tu pouvais lui parler\nmaintenant —\nque lui dirais-tu ?",
      en: {
        name: 'dialogue',
        hint: 'Hillman: dream figures are presences, not symbols',
        question: "Was there a presence\nin this dream?\nIf you could speak to them\nnow —\nwhat would you say?",
      },
    },
    {
      name: 'ce qui a mûri',
      hint: 'entre le rêve et maintenant — qu\'est-ce que le temps a révélé',
      question: "Depuis ce rêve,\nqu'est-ce qui a mûri ?\nDans ta vie éveillée —\nun écho, un changement,\nune compréhension ?",
      en: {
        name: 'what ripened',
        hint: 'between the dream and now — what has time revealed',
        question: "Since this dream,\nwhat has ripened?\nIn your waking life —\nan echo, a change,\nan understanding?",
      },
      insightDuration: 5000,
    },
    {
      name: 'ancrage',
      hint: 'ramène quelque chose du rêve dans ton présent',
      question: "Qu'est-ce que tu ramènes\nde cette réentrée ?\nUn mot, une image,\nun geste —\nquelque chose de concret\npour aujourd'hui.",
      en: {
        name: 'anchoring',
        hint: 'bring something from the dream into your present',
        question: "What do you bring back\nfrom this re-entry?\nA word, an image,\na gesture —\nsomething concrete\nfor today.",
      },
    },
  ],
};

/** Tous les protocoles indexés par id */
export const PROTOCOLS: Record<string, ProtocolConfig> = {
  'rêve': DREAM_PROTOCOL,
  'journal': DAY_PROTOCOL,
  'rituel': RITUAL_PROTOCOL,
  'réentrée': REENTRY_PROTOCOL,
};
