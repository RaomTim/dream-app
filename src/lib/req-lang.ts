/**
 * req-lang.ts — la langue du RÊVEUR, côté serveur.
 *
 * Le problème qu'on résout : sans ça, l'UI peut passer en anglais pendant que Dream
 * continue de répondre en français. Inacceptable.
 *
 * Les deux clients HTTP (src/lib/api-client.ts → authFetch, et le helper api() de
 * src/app/mvp/page.tsx) envoient un header `X-Dream-Lang: fr|en` sur CHAQUE appel.
 * Les routes IA le lisent ici et injectent la consigne de langue dans leur prompt système.
 *
 * LA RÈGLE, une fois pour toutes :
 *   la langue de SORTIE est celle du RÊVEUR, pas celle du texte du rêve.
 *   Un rêve écrit en français peut être lu par un rêveur qui a choisi l'anglais.
 *
 * Défaut = `fr` (l'app est FR-first) : un client ancien, un cron ou un appel serveur
 * à serveur sans header retombe sur le français, jamais sur une langue devinée.
 *
 * ⚠️ EXCEPTION — la fidélité prime sur la langue de l'UI : transcription voix
 * (/api/transcribe) et lecture de carnet (/api/mvp/scan) NE TRADUISENT JAMAIS. Elles
 * restituent ce qui a été dit/écrit, dans la langue où ça a été dit/écrit. La langue
 * du rêveur n'y sert que d'indice de désambiguïsation.
 *
 * Yeshua (Opus), 2026-07-11.
 */

export type DreamLang = 'fr' | 'en'

export const LANG_HEADER = 'x-dream-lang'

/** Lit la langue du rêveur sur la requête. Défaut : 'fr'. */
export function reqLang(req: { headers: { get(name: string): string | null } }): DreamLang {
  return req.headers.get(LANG_HEADER) === 'en' ? 'en' : 'fr'
}

/** Normalise une valeur venue d'ailleurs (body, colonne, cron). Défaut : 'fr'. */
export function asLang(v: unknown): DreamLang {
  return v === 'en' ? 'en' : 'fr'
}

/** Le nom de la langue, dans la langue elle-même (pour les prompts). */
export const LANG_NAME: Record<DreamLang, string> = {
  fr: 'français',
  en: 'anglais',
}

/**
 * Le bloc à COLLER dans un prompt système qui produit de la prose VUE par le rêveur.
 * Écrit en français (tous nos prompts systèmes le sont) — les modèles obéissent
 * parfaitement à une consigne de langue formulée dans une autre langue.
 */
export function langDirective(lang: DreamLang): string {
  return `

TA LANGUE DE SORTIE (non négociable) :
- Tu réponds en ${LANG_NAME[lang]}. Entièrement. Pas un mot dans une autre langue.
- La langue de sortie est celle du RÊVEUR, pas celle du texte du rêve : un rêve écrit en français peut être lu par un rêveur qui a choisi l'anglais, et l'inverse. Tu ne t'alignes jamais sur la langue du rêve.
- Si tu cites une image ou un mot du rêve, tu le rends dans ta langue de sortie${lang === 'en' ? " (traduis l'image, ne recopie pas le mot français tel quel)" : ' (traduis l’image, ne recopie pas le mot anglais tel quel)'}.
- Même registre dans les deux langues : minuscules naturelles, ton intime, jamais de Title Case, jamais de majuscules décoratives.`
}

/**
 * Variante COURTE, pour les prompts qui renvoient du JSON avec quelques valeurs libres
 * (titre, une ligne, un brief). Même règle, formulée en une phrase.
 */
export function langDirectiveShort(lang: DreamLang): string {
  return `\n\nLANGUE : toutes les valeurs de texte libre que tu renvoies sont en ${LANG_NAME[lang]} — c'est la langue du RÊVEUR, pas celle du texte du rêve. Un rêve écrit en français lu par un rêveur anglophone se rend en anglais. Minuscules naturelles, jamais de Title Case.`
}

/**
 * Variante FIDÉLITÉ, pour la transcription / l'OCR : on NE TRADUIT PAS. La langue du
 * rêveur ne sert que d'indice quand le signal est ambigu.
 */
export function langHintFaithful(lang: DreamLang): string {
  return `\n\nLANGUE : ne traduis JAMAIS. Restitue le texte dans la langue où il a été ${'écrit ou dit'}. Indice seulement : ce rêveur utilise l'app en ${LANG_NAME[lang]}, donc en cas de doute sur un mot ambigu, penche pour le ${LANG_NAME[lang]}.`
}
