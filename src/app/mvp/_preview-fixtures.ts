/* ───────────────────────────────────────────────────────────────────────────
   Fixtures DEV-ONLY pour le harnais de preview no-auth (?preview&screen=…).
   Importé dynamiquement uniquement quand PREVIEW.on (jamais en prod).
   Retourne l'objet JSON que chaque écran attend via api()->res.json().
   Données fictives FR riches : ~12 rêves sur 3 lunes + notes de jour + 7 axes.
   Aucune date dynamique (ISO en dur). /api/mvp/interpret renvoie { __sse } —
   le harnais le transforme en frames `data: {"t":…}` + `[DONE]`.
─────────────────────────────────────────────────────────────────────────── */

export function mockFixture(path: string, opts?: RequestInit): any {
  const method = ((opts && opts.method) || 'GET').toUpperCase()
  const p = String(path || '').split('?')[0]
  const qs = String(path || '').indexOf('?') >= 0 ? String(path).split('?')[1] : ''

  // §12bis.B — écho proactif de l'accueil (démo preview : un écho ancien allumé sur un dépôt récent)
  if (p === '/api/mvp/echo-of-the-day') {
    return { echo: { kairos_id: 'k-001', echo_kairos_id: 'k-012', register: 'prophetic', message: "un rêve d'avril semble avoir préparé ce que tu as déposé récemment", deposit_created_at: '2026-07-10T06:00:00Z', echo_created_at: '2026-04-18T06:00:00Z' } }
  }

  const DREAMS: any[] = [
    { id: 'k-001', user_id: 'u-demo', title: 'la femme voilée au bord du fleuve', kairos_type: 'reve', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-06-14T06:42:00Z', updated_at: '2026-06-14T06:50:00Z', raw_text: "je marchais le long d'un fleuve très lent, presque immobile. une femme voilée se tenait sur l'autre rive et me tendait une clé sans rien dire. je savais que je devais traverser mais l'eau était noire et je n'osais pas. au moment de poser le pied, je me suis réveillé, le cœur battant.", numinosity_score: 0.82, numinosity_pending: false, user_marked_numinous: true, affective_valence: -0.15, affective_intensity: 0.78, dominant_emotion: 'appréhension', dream_ego_stance: "j'hésite, je guette", place_label: 'un fleuve sombre', life_themes: ['seuil', 'transmission'], figures: [{ name: 'une femme voilée', role: 'guide' }], motif_tags: ['clé', 'fleuve', 'voile', 'traversée'], somatic_markers: ['cœur qui bat', 'jambes lourdes'], archetypal_tags: ['passeur', 'seuil'], synthesis_tier: 'deep', soul_season_id: 'saison-eau' },
    { id: 'k-002', user_id: 'u-demo', title: "la maison d'enfance aux pièces infinies", kairos_type: 'reve', capture_method: 'voice', raw_text_lang: 'fr', created_at: '2026-06-11T07:14:00Z', updated_at: '2026-06-11T07:20:00Z', raw_text: "j'étais dans la maison de ma grand-mère, sauf qu'elle avait des pièces que je ne connaissais pas. derrière une porte tapissée, un escalier descendait vers une cave inondée où flottaient de vieilles photos. je reconnaissais des visages sans pouvoir les nommer. une douceur étrange, comme un retour.", numinosity_score: 0.74, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.32, affective_intensity: 0.6, dominant_emotion: 'nostalgie', dream_ego_stance: "j'explore, je cherche", place_label: "une maison d'enfance", life_themes: ['mémoire', 'racines'], figures: [{ name: 'ma grand-mère', role: 'ancêtre' }], motif_tags: ['maison', 'escalier', 'photos', 'eau', 'porte'], somatic_markers: ['poitrine ouverte'], archetypal_tags: ['demeure intérieure'], synthesis_tier: 'deep', soul_season_id: 'saison-eau' },
    { id: 'k-003', user_id: 'u-demo', title: 'le loup blanc qui marchait à côté de moi', kairos_type: 'reve', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-06-08T05:30:00Z', updated_at: '2026-06-08T05:38:00Z', raw_text: "un loup blanc est sorti de la forêt et s'est mis à marcher à côté de moi, sans menace. on a traversé une clairière baignée de lune. il s'est arrêté, m'a regardé droit dans les yeux, puis a disparu dans les arbres. je me suis senti choisi, et un peu seul.", numinosity_score: 0.88, numinosity_pending: false, user_marked_numinous: true, affective_valence: 0.45, affective_intensity: 0.82, dominant_emotion: 'émerveillement', dream_ego_stance: "j'avance, j'ose", place_label: 'une forêt sous la lune', life_themes: ['alliance', 'solitude'], figures: [{ name: 'un loup blanc', role: 'animal-guide' }], motif_tags: ['loup', 'forêt', 'lune', 'clairière', 'regard'], somatic_markers: ['nuque qui frissonne'], archetypal_tags: ['animal psychopompe'], synthesis_tier: 'deep', soul_season_id: 'saison-feu' },
    { id: 'k-004', user_id: 'u-demo', title: 'la plume tombée sur le seuil', kairos_type: 'signe', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-06-05T18:10:00Z', updated_at: '2026-06-05T18:12:00Z', raw_text: "en sortant de chez moi, une plume noire est tombée pile devant la porte, sans qu'aucun oiseau ne soit en vue. je pensais justement à mon père. je l'ai ramassée et gardée dans ma poche toute la journée.", numinosity_score: 0.61, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.2, affective_intensity: 0.5, dominant_emotion: 'trouble', dream_ego_stance: 'je remarque, je doute', place_label: 'le seuil de ma porte', life_themes: ['présence', 'deuil'], figures: [{ name: 'mon père', role: 'absent' }], motif_tags: ['plume', 'porte', 'oiseau'], somatic_markers: [], archetypal_tags: ['messager'], synthesis_tier: 'light', soul_season_id: 'saison-feu' },
    { id: 'k-005', user_id: 'u-demo', title: 'la mer qui montait dans le salon', kairos_type: 'reve', capture_method: 'voice', raw_text_lang: 'fr', created_at: '2026-05-28T06:05:00Z', updated_at: '2026-05-28T06:11:00Z', raw_text: "l'eau montait doucement dans le salon, transparente et tiède. au lieu d'avoir peur, je me suis assis et j'ai laissé l'eau m'entourer. des poissons d'argent passaient entre les meubles. je respirais sous l'eau sans effort. un calme immense.", numinosity_score: 0.79, numinosity_pending: false, user_marked_numinous: true, affective_valence: 0.66, affective_intensity: 0.7, dominant_emotion: 'paix', dream_ego_stance: 'je me transforme, je lâche', place_label: 'mon salon inondé', life_themes: ['lâcher-prise', 'émotions'], figures: [], motif_tags: ['eau', 'mer', 'poissons', 'salon', 'respiration'], somatic_markers: ['respiration ample', 'épaules relâchées'], archetypal_tags: ['immersion', 'renaissance'], synthesis_tier: 'deep', soul_season_id: 'saison-eau' },
    { id: 'k-006', user_id: 'u-demo', title: "l'escalier qui se dérobait", kairos_type: 'reve', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-05-22T04:50:00Z', updated_at: '2026-05-22T04:57:00Z', raw_text: "je montais un escalier interminable dans une gare, mais les marches se dérobaient sous mes pieds. en bas, un train que je devais absolument prendre. plus je montais, plus le quai s'éloignait. l'angoisse de rater quelque chose d'irréversible.", numinosity_score: 0.55, numinosity_pending: false, user_marked_numinous: false, affective_valence: -0.58, affective_intensity: 0.75, dominant_emotion: 'urgence', dream_ego_stance: 'je fuis, je me retiens', place_label: 'une gare', life_themes: ['peur de rater', 'contrôle'], figures: [], motif_tags: ['escalier', 'gare', 'train', 'marches'], somatic_markers: ['ventre noué', 'souffle court'], archetypal_tags: ['empêchement'], synthesis_tier: 'light', soul_season_id: 'saison-air' },
    { id: 'k-007', user_id: 'u-demo', title: 'la voix au bord du sommeil', kairos_type: 'hypnagogie', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-05-19T23:40:00Z', updated_at: '2026-05-19T23:42:00Z', raw_text: "juste avant de m'endormir, une voix claire a dit mon prénom, une seule fois, très douce. j'ai sursauté. il n'y avait personne. puis une image fugace d'un jardin clos avec une fontaine.", numinosity_score: 0.48, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.1, affective_intensity: 0.45, dominant_emotion: 'stupéfaction', dream_ego_stance: 'je guette, je doute', place_label: 'au bord du sommeil', life_themes: ['appel', 'intériorité'], figures: [{ name: 'une voix sans visage', role: 'appel' }], motif_tags: ['voix', 'prénom', 'jardin', 'fontaine'], somatic_markers: ['sursaut'], archetypal_tags: ['appel intérieur'], synthesis_tier: 'light', soul_season_id: 'saison-air' },
    { id: 'k-008', user_id: 'u-demo', title: 'le double chiffre sur toutes les horloges', kairos_type: 'synchronicite', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-05-15T21:11:00Z', updated_at: '2026-05-15T21:13:00Z', raw_text: "toute la journée, je suis tombé sur 11:11 — sur mon téléphone, sur un ticket de caisse, sur la plaque d'une voiture. la dernière fois, juste après avoir décidé de rappeler une amie perdue de vue. comme un clin d'œil.", numinosity_score: 0.52, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.4, affective_intensity: 0.4, dominant_emotion: 'joie', dream_ego_stance: "j'ose, je décide", place_label: 'dans la ville', life_themes: ['lien', 'signe'], figures: [{ name: 'une amie perdue de vue', role: 'lien' }], motif_tags: ['11:11', 'horloge', 'répétition'], somatic_markers: [], archetypal_tags: ['synchronicité'], synthesis_tier: 'light', soul_season_id: 'saison-air' },
    { id: 'k-009', user_id: 'u-demo', title: "la lumière douce de fin d'après-midi", kairos_type: 'reverie', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-05-09T16:30:00Z', updated_at: '2026-05-09T16:33:00Z', raw_text: "en regardant la lumière dorée tomber sur le mur, je me suis laissé glisser dans une rêverie : un atelier au calme, des mains qui façonnent l'argile, le bonheur tranquille de créer sans but. je suis resté longtemps là, suspendu.", numinosity_score: 0.43, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.71, affective_intensity: 0.5, dominant_emotion: 'plénitude', dream_ego_stance: 'je me laisse aller', place_label: 'un atelier imaginé', life_themes: ['création', 'douceur'], figures: [], motif_tags: ['lumière', 'argile', 'atelier', 'mains'], somatic_markers: ['chaleur dans la poitrine'], archetypal_tags: ['création'], synthesis_tier: 'light', soul_season_id: 'saison-terre' },
    { id: 'k-010', user_id: 'u-demo', title: 'le frisson devant la porte ancienne', kairos_type: 'frisson', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-05-03T11:20:00Z', updated_at: '2026-05-03T11:22:00Z', raw_text: "devant une vieille porte en bois sculpté d'une église, un frisson m'a traversé de la nuque au bas du dos. quelque chose voulait être remarqué là, sans que je sache quoi. je suis resté un instant, la main posée sur le bois tiède.", numinosity_score: 0.5, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.3, affective_intensity: 0.55, dominant_emotion: 'mystique', dream_ego_stance: "je remarque, je m'arrête", place_label: 'devant une église', life_themes: ['sacré', 'corps'], figures: [], motif_tags: ['porte', 'bois', 'église', 'frisson'], somatic_markers: ['frisson dorsal', 'nuque'], archetypal_tags: ['seuil sacré'], synthesis_tier: 'light', soul_season_id: 'saison-terre' },
    { id: 'k-011', user_id: 'u-demo', title: 'la chute qui devenait vol', kairos_type: 'reve', capture_method: 'voice', raw_text_lang: 'fr', created_at: '2026-04-26T05:15:00Z', updated_at: '2026-04-26T05:22:00Z', raw_text: "je tombais d'une falaise, terrifié, puis d'un coup mes bras se sont ouverts et la chute est devenue un vol. je planais au-dessus d'une vallée verte, libre, en riant. le vent portait mon corps comme une plume.", numinosity_score: 0.83, numinosity_pending: false, user_marked_numinous: true, affective_valence: 0.6, affective_intensity: 0.85, dominant_emotion: 'exaltation', dream_ego_stance: 'je me transforme, je dépasse', place_label: "au-dessus d'une vallée", life_themes: ['peur', 'liberté'], figures: [], motif_tags: ['chute', 'vol', 'falaise', 'vallée', 'vent'], somatic_markers: ['vide dans le ventre', 'bras ouverts'], archetypal_tags: ['renversement', 'envol'], synthesis_tier: 'deep', soul_season_id: 'saison-feu' },
    { id: 'k-012', user_id: 'u-demo', title: 'le jardin clos derrière le mur', kairos_type: 'reve', capture_method: 'text', raw_text_lang: 'fr', created_at: '2026-04-18T06:00:00Z', updated_at: '2026-04-18T06:06:00Z', raw_text: "j'ai trouvé une porte basse dans un mur que je longeais depuis toujours. derrière, un jardin clos, foisonnant, avec une fontaine au centre. une enfant y jouait seule et m'a fait signe d'approcher. je me suis senti attendu depuis longtemps.", numinosity_score: 0.77, numinosity_pending: false, user_marked_numinous: true, affective_valence: 0.55, affective_intensity: 0.68, dominant_emotion: 'émerveillement', dream_ego_stance: "j'ose, j'approche", place_label: 'un jardin clos', life_themes: ['intériorité', 'enfance'], figures: [{ name: 'une enfant', role: 'soi-enfant' }], motif_tags: ['jardin', 'mur', 'porte', 'fontaine', 'enfant'], somatic_markers: ["gorge serrée d'émotion"], archetypal_tags: ['jardin secret', 'enfant intérieur'], synthesis_tier: 'deep', soul_season_id: 'saison-terre' },
  ]

  const DAY_NOTES: any[] = [
    { id: 'd-001', user_id: 'u-demo', title: null, kairos_type: 'note_jour', capture_method: 'mvp_animus', raw_text_lang: 'fr', created_at: '2026-06-15T19:30:00Z', updated_at: '2026-06-15T19:30:00Z', raw_text: "journée intense au travail — j'ai présenté le projet et j'ai senti une vraie reconnaissance de l'équipe. fier, mais aussi vidé. besoin de repos.", numinosity_score: null, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.4, affective_intensity: 0.5, dominant_emotion: 'fierté', dream_ego_stance: null, place_label: null, life_themes: ['travail', 'reconnaissance'], figures: [], motif_tags: [], somatic_markers: [], archetypal_tags: [], synthesis_tier: null, soul_season_id: null },
    { id: 'd-002', user_id: 'u-demo', title: null, kairos_type: 'note_jour', capture_method: 'mvp_animus', raw_text_lang: 'fr', created_at: '2026-06-13T21:05:00Z', updated_at: '2026-06-13T21:05:00Z', raw_text: "longue conversation avec ma sœur ce soir, on a réparé quelque chose qui traînait depuis des mois. de la tendresse retrouvée. je me sens plus léger dans ma relation à la famille.", numinosity_score: null, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.6, affective_intensity: 0.55, dominant_emotion: 'tendresse', dream_ego_stance: null, place_label: null, life_themes: ['relations', 'famille'], figures: [], motif_tags: [], somatic_markers: [], archetypal_tags: [], synthesis_tier: null, soul_season_id: null },
    { id: 'd-003', user_id: 'u-demo', title: null, kairos_type: 'note_jour', capture_method: 'mvp_animus', raw_text_lang: 'fr', created_at: '2026-06-10T08:15:00Z', updated_at: '2026-06-10T08:15:00Z', raw_text: "le corps fatigué ce matin, mal dormi, tension dans la nuque. j'ai marché vingt minutes au lieu de scroller, et l'énergie est revenue un peu. mon corps me demande plus de sommeil.", numinosity_score: null, numinosity_pending: false, user_marked_numinous: false, affective_valence: -0.1, affective_intensity: 0.4, dominant_emotion: 'fatigue', dream_ego_stance: null, place_label: null, life_themes: ['corps', 'sommeil'], figures: [], motif_tags: [], somatic_markers: ['nuque tendue'], archetypal_tags: [], synthesis_tier: null, soul_season_id: null },
    { id: 'd-004', user_id: 'u-demo', title: null, kairos_type: 'note_jour', capture_method: 'mvp_animus', raw_text_lang: 'fr', created_at: '2026-06-07T22:40:00Z', updated_at: '2026-06-07T22:40:00Z', raw_text: "j'ai repris la guitare ce soir après des semaines. une heure passée sans voir le temps. cette joie de créer pour rien, juste pour la beauté du geste. il faut que je garde ça vivant.", numinosity_score: null, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.7, affective_intensity: 0.5, dominant_emotion: 'joie', dream_ego_stance: null, place_label: null, life_themes: ['passions', 'création'], figures: [], motif_tags: [], somatic_markers: [], archetypal_tags: [], synthesis_tier: null, soul_season_id: null },
    { id: 'd-005', user_id: 'u-demo', title: null, kairos_type: 'note_jour', capture_method: 'mvp_animus', raw_text_lang: 'fr', created_at: '2026-06-02T18:00:00Z', updated_at: '2026-06-02T18:00:00Z', raw_text: "un doute sur la direction à prendre — rester dans ce poste sûr ou tenter le projet qui me fait vibrer. je tourne en rond. un vrai seuil, une décision que je repousse depuis longtemps.", numinosity_score: null, numinosity_pending: false, user_marked_numinous: false, affective_valence: -0.2, affective_intensity: 0.6, dominant_emotion: 'incertitude', dream_ego_stance: null, place_label: null, life_themes: ['transitions', 'décision'], figures: [], motif_tags: [], somatic_markers: [], archetypal_tags: [], synthesis_tier: null, soul_season_id: null },
    { id: 'd-006', user_id: 'u-demo', title: null, kairos_type: 'note_jour', capture_method: 'mvp_animus', raw_text_lang: 'fr', created_at: '2026-05-30T07:50:00Z', updated_at: '2026-05-30T07:50:00Z', raw_text: "méditation de vingt minutes au réveil, un vrai calme. une intuition est montée : ralentir n'est pas perdre du temps. présence simple à ce qui est. je veux nourrir ça.", numinosity_score: null, numinosity_pending: false, user_marked_numinous: false, affective_valence: 0.5, affective_intensity: 0.4, dominant_emotion: 'sérénité', dream_ego_stance: null, place_label: null, life_themes: ['spiritualité', 'présence'], figures: [], motif_tags: [], somatic_markers: [], archetypal_tags: [], synthesis_tier: null, soul_season_id: null },
  ]

  function listRow(k: any) {
    return { id: k.id, title: k.title, kairos_type: k.kairos_type, raw_text: k.raw_text, raw_text_lang: k.raw_text_lang, created_at: k.created_at, numinosity_score: k.numinosity_score, numinosity_pending: k.numinosity_pending, synthesis_tier: k.synthesis_tier, motif_tags: k.motif_tags, archetypal_tags: k.archetypal_tags, soul_season_id: k.soul_season_id, user_marked_numinous: k.user_marked_numinous, figures: k.figures, place_label: k.place_label, dominant_emotion: k.dominant_emotion, affective_valence: k.affective_valence, dream_ego_stance: k.dream_ego_stance, life_themes: k.life_themes }
  }
  function getParam(name: string) {
    const parts = qs.split('&')
    for (let i = 0; i < parts.length; i++) { const kv = parts[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || '') }
    return null
  }
  function byId(id: string) {
    for (let i = 0; i < DREAMS.length; i++) if (DREAMS[i].id === id) return DREAMS[i]
    for (let j = 0; j < DAY_NOTES.length; j++) if (DAY_NOTES[j].id === id) return DAY_NOTES[j]
    return null
  }

  const mEcho = p.match(/^\/api\/kairos\/([^/]+)\/echoes$/)
  if (mEcho) {
    return { echoes: [
      { other_id: 'k-012', combined_score: 0.81, sem_score: 0.78, title: 'le jardin clos derrière le mur', preview: "j'ai trouvé une porte basse dans un mur que je longeais depuis toujours. derrière, un jardin clos, foisonnant, avec une fontaine au centre.", kairos_type: 'reve', created_at: '2026-04-18T06:00:00Z', numinosity_score: 0.77 },
      { other_id: 'k-005', combined_score: 0.72, sem_score: 0.69, title: 'la mer qui montait dans le salon', preview: "l'eau montait doucement dans le salon, transparente et tiède. au lieu d'avoir peur, je me suis assis et j'ai laissé l'eau m'entourer.", kairos_type: 'reve', created_at: '2026-05-28T06:05:00Z', numinosity_score: 0.79 },
      { other_id: 'k-002', combined_score: 0.66, sem_score: 0.64, title: "la maison d'enfance aux pièces infinies", preview: "j'étais dans la maison de ma grand-mère, sauf qu'elle avait des pièces que je ne connaissais pas.", kairos_type: 'reve', created_at: '2026-06-11T07:14:00Z', numinosity_score: 0.74 },
      { other_id: 'k-007', combined_score: 0.58, sem_score: 0.56, title: 'la voix au bord du sommeil', preview: "juste avant de m'endormir, une voix claire a dit mon prénom, une seule fois, très douce.", kairos_type: 'hypnagogie', created_at: '2026-05-19T23:40:00Z', numinosity_score: 0.48 },
    ] }
  }

  const mProph = p.match(/^\/api\/kairos\/([^/]+)\/prophetic$/)
  if (mProph) {
    return { propheties: [
      { past_id: 'k-012', combined_score: 0.79, delta_days: 57, preview: "j'ai trouvé une porte basse dans un mur que je longeais depuis toujours. derrière, un jardin clos, foisonnant, avec une fontaine au centre. une enfant y jouait seule et m'a fait signe d'approcher.", created_at: '2026-04-18T06:00:00Z', kairos_type: 'reve', sensitive_notice: 'signal prophétique probabiliste, pas une certitude.' },
      { past_id: 'k-011', combined_score: 0.76, delta_days: 49, preview: "je tombais d'une falaise, terrifié, puis d'un coup mes bras se sont ouverts et la chute est devenue un vol. je planais au-dessus d'une vallée verte, libre, en riant.", created_at: '2026-04-26T05:15:00Z', kairos_type: 'reve', sensitive_notice: 'signal prophétique probabiliste, pas une certitude.' },
    ] }
  }

  // §12bis.A — « CE QUI RÉSONNE » : rêves reliés + moments de jour + écho ancien, mêlés, chacun avec sa raison.
  const mReso = p.match(/^\/api\/kairos\/([^/]+)\/resonance$/)
  if (mReso) {
    return {
      source: { id: mReso[1], kairos_type: 'reve', created_at: '2026-07-10T06:00:00Z', excerpt: "je marchais le long d'un fleuve très lent, presque immobile. une femme voilée me tendait une clé sans rien dire. l'eau était noire et je n'osais pas traverser." },
      links: [
        { id: 'k-005', kind: 'dream', title: 'la mer qui montait dans le salon', label: 'la mer qui montait dans le salon', excerpt: "l'eau montait doucement dans le salon, transparente et tiède. je me suis assis et j'ai laissé l'eau m'entourer.", created_at: '2026-05-28T06:05:00Z', kairos_type: 'reve', reason: 'eau · maison', reason_kind: 'motif' },
        { id: 'k-002', kind: 'dream', title: "la maison d'enfance aux pièces infinies", label: "la maison d'enfance aux pièces infinies", excerpt: "j'étais dans la maison de ma grand-mère, sauf qu'elle avait des pièces que je ne connaissais pas.", created_at: '2026-06-11T07:14:00Z', kairos_type: 'reve', reason: 'même émotion', reason_kind: 'emotion' },
        { id: 'n-003', kind: 'day', title: 'la décision que je repousse', label: 'la décision que je repousse', excerpt: "toute la journée j'ai tourné autour de ce choix sans oser. je sais ce que je dois faire mais je n'avance pas.", created_at: '2026-07-09T18:20:00Z', kairos_type: 'note_jour', reason: 'proche par le sens', reason_kind: 'semantic' },
      ],
      prophetic: [
        { id: 'k-012', title: 'le jardin clos derrière le mur', excerpt: "j'ai trouvé une porte basse dans un mur que je longeais depuis toujours. derrière, un jardin clos, foisonnant, avec une fontaine au centre. une enfant y jouait seule et m'a fait signe d'approcher — comme si elle m'attendait depuis longtemps.", created_at: '2026-04-18T06:00:00Z', reason: 'la porte · le passage', reason_kind: 'motif', days_diff: 83 },
      ],
    }
  }

  const mSub = p.match(/^\/api\/kairos\/([^/]+)\/[^/]+$/)
  if (mSub) {
    if (p.indexOf('/forest-reading') >= 0) return { reading: null, sources: [] }
    if (p.indexOf('/mirrors') >= 0) return { mirrors: [] }
    if (p.indexOf('/edges') >= 0) return { edges: [] }
    return { ok: true }
  }

  const mOne = p.match(/^\/api\/kairos\/([^/]+)$/)
  if (mOne) {
    if (method !== 'GET') return { ok: true, kairos: byId(mOne[1]) || null }
    const one = byId(mOne[1]) || DREAMS[0]
    return { kairos: {
      id: one.id, user_id: one.user_id || 'u-demo', title: one.title, kairos_type: one.kairos_type, capture_method: one.capture_method || 'text', raw_text: one.raw_text, raw_text_lang: one.raw_text_lang || 'fr', created_at: one.created_at, updated_at: one.updated_at || one.created_at, numinosity_score: one.numinosity_score, numinosity_pending: one.numinosity_pending, affective_valence: one.affective_valence, affective_intensity: one.affective_intensity, dominant_emotion: one.dominant_emotion, figures: one.figures || [], motif_tags: one.motif_tags || [], somatic_markers: one.somatic_markers || [], archetypal_tags: one.archetypal_tags || [], setting_metadata: { place_label: one.place_label || null }, narrative_dynamics: null, temporal_signature: null, sensorial_qualities: null, thresholds_passages: null, parole_silence: null, power_relations: null, paradoxes_unresolved: null, metaphors_extrapolated: null, dream_ask: null, root_dream_patterns: one.archetypal_tags || [], prophetic_status: 'dormant', soul_season_id: one.soul_season_id || null, user_first_reading_submitted: false, user_marked_numinous: one.user_marked_numinous, synthesis_text: one.synthesis_tier === 'deep' ? "ce rêve semble tenir, en une seule image, une question de seuil : quelque chose t'est tendu, et l'enjeu n'est pas tant de comprendre que d'oser le pas. les eaux sombres ne sont pas un obstacle — elles sont le passage lui-même." : null, synthesis_tier: one.synthesis_tier || null, synthesis_voices: one.synthesis_tier === 'deep' ? ['tending', 'somatique'] : null, synthesis_generated_at: one.synthesis_tier === 'deep' ? one.updated_at || one.created_at : null, forest_sources: [],
    } }
  }

  if (p === '/api/kairos') {
    if (method === 'POST') return { id: 'k-new-001', kairos: { id: 'k-new-001', created_at: '2026-06-19T08:00:00Z', kairos_type: 'reve', raw_text: '(nouveau)', enrichment_status: 'pending' } }
    const ktype = getParam('kairos_type')
    const limit = parseInt(getParam('limit') || '30', 10)
    let src: any[]
    if (ktype === 'note_jour') src = DAY_NOTES
    else if (ktype) src = DREAMS.filter((k) => k.kairos_type === ktype)
    else src = DREAMS.concat(DAY_NOTES).sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    return { kairos: src.slice(0, limit).map(listRow), total: src.length, next_cursor: null }
  }

  if (p === '/api/mvp/symbol-book') {
    return {
      window: getParam('window') || 'all',
      symbols: [
        { kind: 'motif', text: 'eau', count: 7, valence: 0.28, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: 'le flux des émotions, ce qui me dépasse et me porte' },
        { kind: 'motif', text: 'porte', count: 6, valence: 0.22, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: "un passage, un choix que je n'ose pas faire" },
        { kind: 'motif', text: 'clé', count: 4, valence: 0.15, first_seen: '2026-05-03T11:20:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: null },
        { kind: 'motif', text: 'lune', count: 4, valence: 0.4, first_seen: '2026-04-26T05:15:00Z', last_seen: '2026-06-08T05:30:00Z', user_meaning: null },
        { kind: 'motif', text: 'escalier', count: 3, valence: -0.3, first_seen: '2026-05-22T04:50:00Z', last_seen: '2026-06-11T07:14:00Z', user_meaning: null },
        { kind: 'motif', text: 'fontaine', count: 3, valence: 0.45, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-05-19T23:40:00Z', user_meaning: null },
        { kind: 'motif', text: 'plume', count: 2, valence: 0.1, first_seen: '2026-05-19T23:40:00Z', last_seen: '2026-06-05T18:10:00Z', user_meaning: null },
        { kind: 'motif', text: 'vol', count: 2, valence: 0.62, first_seen: '2026-04-26T05:15:00Z', last_seen: '2026-04-26T05:15:00Z', user_meaning: null },
        { kind: 'figure', text: 'une femme voilée', count: 3, valence: -0.1, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: null },
        { kind: 'figure', text: 'ma grand-mère', count: 2, valence: 0.4, first_seen: '2026-05-09T16:30:00Z', last_seen: '2026-06-11T07:14:00Z', user_meaning: 'la transmission, ce qui me relie à mes racines' },
        { kind: 'figure', text: 'un loup blanc', count: 2, valence: 0.5, first_seen: '2026-06-08T05:30:00Z', last_seen: '2026-06-08T05:30:00Z', user_meaning: null },
        { kind: 'figure', text: 'mon père', count: 2, valence: 0.05, first_seen: '2026-06-05T18:10:00Z', last_seen: '2026-06-05T18:10:00Z', user_meaning: null },
        { kind: 'figure', text: 'une enfant', count: 2, valence: 0.55, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-05-19T23:40:00Z', user_meaning: null },
        { kind: 'figure', text: 'une voix sans visage', count: 1, valence: 0.1, first_seen: '2026-05-19T23:40:00Z', last_seen: '2026-05-19T23:40:00Z', user_meaning: null },
        { kind: 'lieu', text: "une maison d'enfance", count: 4, valence: 0.3, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-06-11T07:14:00Z', user_meaning: null },
        { kind: 'lieu', text: 'une forêt', count: 3, valence: 0.4, first_seen: '2026-05-03T11:20:00Z', last_seen: '2026-06-08T05:30:00Z', user_meaning: null },
        { kind: 'lieu', text: 'un fleuve sombre', count: 2, valence: -0.2, first_seen: '2026-05-28T06:05:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: null },
        { kind: 'lieu', text: 'une gare', count: 2, valence: -0.5, first_seen: '2026-05-22T04:50:00Z', last_seen: '2026-05-22T04:50:00Z', user_meaning: null },
        { kind: 'lieu', text: 'un jardin clos', count: 3, valence: 0.55, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-05-19T23:40:00Z', user_meaning: null },
        { kind: 'lieu', text: 'une église', count: 1, valence: 0.3, first_seen: '2026-05-03T11:20:00Z', last_seen: '2026-05-03T11:20:00Z', user_meaning: null },
        { kind: 'dream_ego', text: "j'ose, j'avance", count: 4, valence: 0.5, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-06-08T05:30:00Z', user_meaning: null },
        { kind: 'dream_ego', text: 'je fuis, je me retiens', count: 2, valence: -0.5, first_seen: '2026-05-22T04:50:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: null },
        { kind: 'dream_ego', text: "j'observe, je doute", count: 3, valence: -0.1, first_seen: '2026-05-03T11:20:00Z', last_seen: '2026-06-05T18:10:00Z', user_meaning: null },
        { kind: 'dream_ego', text: 'je me transforme', count: 2, valence: 0.6, first_seen: '2026-04-26T05:15:00Z', last_seen: '2026-05-28T06:05:00Z', user_meaning: null },
        { kind: 'theme', text: 'seuil', count: 5, valence: 0.1, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: null },
        { kind: 'theme', text: 'lâcher-prise', count: 3, valence: 0.5, first_seen: '2026-04-26T05:15:00Z', last_seen: '2026-05-28T06:05:00Z', user_meaning: null },
        { kind: 'theme', text: 'mémoire', count: 3, valence: 0.2, first_seen: '2026-05-09T16:30:00Z', last_seen: '2026-06-11T07:14:00Z', user_meaning: null },
        { kind: 'theme', text: 'liberté', count: 2, valence: 0.6, first_seen: '2026-04-26T05:15:00Z', last_seen: '2026-04-26T05:15:00Z', user_meaning: null },
        { kind: 'theme', text: 'deuil', count: 2, valence: -0.3, first_seen: '2026-06-05T18:10:00Z', last_seen: '2026-06-05T18:10:00Z', user_meaning: null },
        { kind: 'theme', text: 'création', count: 2, valence: 0.65, first_seen: '2026-05-09T16:30:00Z', last_seen: '2026-05-09T16:30:00Z', user_meaning: null },
        { kind: 'theme', text: 'sacré', count: 2, valence: 0.4, first_seen: '2026-05-03T11:20:00Z', last_seen: '2026-05-19T23:40:00Z', user_meaning: null },
        { kind: 'sensation', text: 'cœur qui bat', count: 4, valence: -0.2, first_seen: '2026-04-26T05:15:00Z', last_seen: '2026-06-14T06:42:00Z', user_meaning: null },
        { kind: 'sensation', text: 'frisson dorsal', count: 3, valence: 0.3, first_seen: '2026-05-03T11:20:00Z', last_seen: '2026-06-08T05:30:00Z', user_meaning: 'quand quelque chose de vrai veut être remarqué' },
        { kind: 'sensation', text: 'ventre noué', count: 2, valence: -0.5, first_seen: '2026-05-22T04:50:00Z', last_seen: '2026-05-22T04:50:00Z', user_meaning: null },
        { kind: 'sensation', text: 'respiration ample', count: 2, valence: 0.6, first_seen: '2026-05-28T06:05:00Z', last_seen: '2026-05-28T06:05:00Z', user_meaning: null },
        { kind: 'sensation', text: 'gorge serrée', count: 2, valence: 0.1, first_seen: '2026-04-18T06:00:00Z', last_seen: '2026-04-18T06:00:00Z', user_meaning: null },
      ],
      emotions: [
        { label: 'émerveillement', count: 5, valence_avg: 0.5 },
        { label: 'paix', count: 4, valence_avg: 0.62 },
        { label: 'appréhension', count: 4, valence_avg: -0.25 },
        { label: 'nostalgie', count: 3, valence_avg: 0.3 },
        { label: 'exaltation', count: 3, valence_avg: 0.6 },
        { label: 'urgence', count: 2, valence_avg: -0.55 },
        { label: 'plénitude', count: 2, valence_avg: 0.7 },
        { label: 'trouble', count: 2, valence_avg: 0.05 },
        { label: 'joie', count: 2, valence_avg: 0.55 },
        { label: 'mystique', count: 1, valence_avg: 0.3 },
      ],
    }
  }

  if (p === '/api/mvp/forge/works') {
    if (method === 'POST') return { ok: true }
    return { works: [
      { id: 'w-001', kairos_id: 'k-003', kind: 'image', status: 'done', vision_title: 'le loup blanc sous la lune', share_slug: 'image-a1b2c3d4', asset_url: 'https://picsum.photos/seed/loupblanc/720/720', is_public: true, cost: 3, created_at: '2026-06-09T10:00:00Z' },
      { id: 'w-002', kairos_id: 'k-005', kind: 'image', status: 'done', vision_title: 'le salon sous les eaux', share_slug: 'image-e5f6g7h8', asset_url: 'https://picsum.photos/seed/salonmer/720/720', is_public: false, cost: 3, created_at: '2026-05-29T12:30:00Z' },
      { id: 'w-003', kairos_id: 'k-012', kind: 'game', status: 'done', vision_title: 'la quête du jardin clos', share_slug: 'game-i9j0k1l2', asset_url: 'https://example.com/play/jardin-clos', is_public: true, cost: 8, created_at: '2026-04-20T09:15:00Z' },
    ], balance: 24 }
  }
  if (p === '/api/mvp/forge/propose') {
    return { visions: [
      { kind: 'image', title: 'la femme voilée, la clé tendue', cost: 3, brief: "l'image centrale : une silhouette voilée sur l'autre rive d'un fleuve noir et lisse, tendant une clé d'or. lumière de l'aube, brume basse, le reflet du ciel sur l'eau immobile." },
      { kind: 'game', title: 'traverser le fleuve noir', cost: 8, brief: "une quête contemplative : le joueur doit trouver le courage de poser le pied sur l'eau et traverser vers la rive de la femme voilée pour recevoir la clé." },
      { kind: 'video', title: "le pas au-dessus de l'eau", cost: 15, brief: "un plan lent : la caméra avance vers le fleuve, la femme voilée lève la clé, l'eau frémit. souffle suspendu au moment du premier pas." },
    ], balance: 24, video_available: false }
  }
  if (p === '/api/mvp/forge/generate') {
    return { work: { id: 'w-new-001', share_slug: 'image-z9y8x7w6', kind: 'image', vision_title: 'la femme voilée, la clé tendue', asset_url: 'https://picsum.photos/seed/femmevoilee/720/720' }, balance: 21 }
  }

  if (p === '/api/mvp/interpret') {
    let b: any = {}
    try { b = opts && opts.body ? JSON.parse(opts.body as string) : {} } catch (e) { b = {} }
    if (b.mode === 'name') return { names: ["la clé sur l'autre rive", "le fleuve qu'on n'ose traverser", "ce qui m'est tendu"] }
    if (b.mode === 'honor') return { gestures: ['pose une clé sur ta table et regarde-la une fois dans la journée', "marche cinq minutes au bord de l'eau la plus proche", "écris le nom de ce que tu n'oses pas traverser, puis garde-le sur toi"] }
    const deeper = b.depth === 'deeper'
    return { __sse: deeper
      ? "il y a, dans ce rêve, quelque chose qui se rejoue depuis longtemps. ce fleuve que tu n'oses pas traverser, tu le longes peut-être éveillé aussi — devant un choix que tu repousses.\n\nce que ton corps sait avant ta pensée, c'est que la clé t'est déjà tendue. tu n'as pas à la mériter, seulement à avancer la main. l'eau noire n'est pas la mort : c'est l'inconnu, et tu sais nager.\n\nqu'est-ce qui, en ce moment, attend que tu poses le pied ? et de quoi aurais-tu besoin pour oser ce premier pas ?"
      : "ce que tu décris a une grande force tranquille. une femme voilée, sur l'autre rive, qui te tend une clé sans un mot — quelque chose t'est offert, et ce quelque chose demande un passage.\n\non pourrait entendre que l'eau noire, ce n'est pas tant un danger qu'un seuil : ce qui te sépare de ce qui t'attend. ton cœur qui bat au moment de poser le pied dit peut-être à quel point ce passage compte pour toi.\n\nqu'est-ce que, pour toi, cette clé pourrait ouvrir ? et qu'est-ce qui rend la traversée si difficile à oser, en ce moment ?" }
  }

  if (p === '/api/mvp/resonate') {
    return { resonances: [
      { id: 'k-005', title: 'la mer qui montait dans le salon', excerpt: "l'eau montait doucement dans le salon, transparente et tiède. au lieu d'avoir peur, je me suis assis et j'ai laissé l'eau m'entourer.", created_at: '2026-05-28T06:05:00Z', similarity: 0.81 },
      { id: 'k-011', title: 'la chute qui devenait vol', excerpt: "je tombais d'une falaise, terrifié, puis d'un coup mes bras se sont ouverts et la chute est devenue un vol.", created_at: '2026-04-26T05:15:00Z', similarity: 0.73 },
      { id: 'k-001', title: 'la femme voilée au bord du fleuve', excerpt: "une femme voilée se tenait sur l'autre rive et me tendait une clé sans rien dire.", created_at: '2026-06-14T06:42:00Z', similarity: 0.68 },
    ] }
  }

  if (p === '/api/mvp/meaning') { if (method === 'POST') return { ok: true }; return { meaning: null, weight: null } }
  if (p === '/api/mvp/name') return { ok: true }
  if (p === '/api/mvp/feedback') return { ok: true, learned_terms: 3 }
  if (p === '/api/mvp/import') return { imported: 3, message: 'tes rêves sont déposés — leur lecture profonde se tisse en arrière-plan' }
  if (p === '/api/mvp/enrich-batch') return { ok: true, enriched: 0 }
  if (p === '/api/transcribe') return { text: "cette nuit, je marchais dans une forêt qui chantait, et une porte de lumière s'est ouverte devant moi." }

  if (p === '/api/tales/match') {
    return { tales: [
      { id: 't-001', title: 'la jeune fille sans mains', source_book_slug: 'grimm', source: 'grimm', text: "un conte de seuil et de traversée : une héroïne dépouillée doit franchir une eau et faire confiance à ce qui lui est tendu pour retrouver son intégrité.", summary: 'un conte de seuil et de traversée.', match_score: 0.74, match_reasons: ["traversée d'une eau", "don d'un objet", 'figure féminine qui guide'] },
    ], mode: 'heuristic', total_matched: 1 }
  }

  if (p === '/api/circles') {
    if (method === 'POST') return { circle: { id: 'c-new', name: 'mon cercle', type: 'spontane', my_role: 'guardian', member_count: 1 } }
    return { circles: [
      { id: 'c-001', name: 'les veilleurs de nuit', type: 'intentionnel', intention_text: 'partager nos rêves de seuil', my_role: 'guardian', member_count: 4, last_restitution: { id: 'r-001', requested_at: '2026-06-12T20:00:00Z', preview: 'cette lune, vos rêves ont tous frôlé une eau à traverser, comme si quelque chose appelait au passage…' } },
      { id: 'c-002', name: 'le feu doux', type: 'spontane', intention_text: null, my_role: 'member', member_count: 2, last_restitution: null },
    ] }
  }
  if (p.match(/^\/api\/circles\/[^/]+\/share$/)) { if (method === 'POST') return { ok: true, shared: true }; return { shares: [] } }
  if (p === '/api/circles/join') return { ok: true, joined: true }
  if (p.match(/^\/api\/circles\//)) return { ok: true }

  if (p === '/api/kairos/cycles') return { cycles: [] }
  if (p === '/api/kairos/numinous') return { kairos: DREAMS.filter((k) => (k.numinosity_score || 0) >= 0.7).map(listRow) }

  return { ok: true }
}
