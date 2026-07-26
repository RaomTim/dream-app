/**
 * depositScope.ts — « ce qu'on dépose ici », les trois étages.
 *
 * C1 · 2026-07-26 · Yeshua (Opus).
 *
 * Tim, 26/07 :
 *   « Pour les mots courts "rêve ou un signe, un frisson…" la solution comme d'hab est
 *     cette petite bulle qui permet d'avoir + d'info → présente les kaïros direct, et
 *     "lire +" emmène sur une vraie page en profondeur sur tous les kaïros qu'on est
 *     invité à déposer. Idem dans Cœur, même principe. Ça amène même aux protocoles
 *     dans le "in depth". »
 *
 * Trois étages, exactement comme le système ⓘ (`infoSheets.ts`) :
 *   · la traîne  — ce qui est déjà à l'écran, qui devient tapable
 *   · la bulle   — les types EUX-MÊMES (pas leur définition), glyphe + mot + six mots
 *   · la page    — le développé, et le pont vers les guides
 *
 * ── OÙ VIT LE TEXTE ─────────────────────────────────────────────────────────
 * Nulle part ici. Tout est dans `src/lib/i18n/mvp/content.{fr,en}.json` → `content.scope.*`.
 * Ce fichier ne porte que la STRUCTURE (l'ordre des types, les clés) — même contrat que
 * `infoSheets.ts` et `guides.ts`. L'anglais est une ré-écriture, pas une traduction.
 *
 * 🔴 L'ORDRE DES TYPES N'EST PAS LIBRE. `DREAM_TYPES` est l'ordre EXACT des puces
 * « c'était… » du post-dépôt (`KTYPES` moins `intuition`, filtré là-bas). La bulle est
 * une répétition de ce que le rêveur touchera trente secondes après son dépôt ; si les
 * deux listes divergent, la bulle cesse d'enseigner et se met à contredire.
 */

/** Les sept types de dépôt de la face Rêve, dans l'ordre des puces du post-dépôt. */
export const DREAM_TYPES = [
  'reve', 'signe', 'reverie', 'hypnagogie', 'frisson', 'synchronicite', 'note_jour',
] as const
export type DreamType = (typeof DREAM_TYPES)[number]

/** Les six registres de la face Cœur. Ce ne sont PAS des types en base — voir ci-dessous. */
export const HEART_ROWS = ['joie', 'peur', 'colere', 'douleur', 'gratitude', 'rien'] as const
export type HeartRow = (typeof HEART_ROWS)[number]

/**
 * 🔴 Pourquoi le Cœur n'a pas de glyphes, et pourquoi c'est volontaire.
 * Côté Rêve, les sept sont de VRAIS types : ils existent en base (`kairos_type`), le
 * rêveur les choisit après son dépôt, le Journal filtre dessus. Le glyphe est donc
 * l'étiquette d'une chose réelle.
 * Côté Cœur, tout est `note_jour`. « une joie », « une colère » sont des registres de
 * parole (les mots de Tim : « la parole, le chant, le cri, le murmure »), pas une
 * taxonomie. Leur dessiner des glyphes promettrait un classement qui n'existe pas —
 * et le premier rêveur qui chercherait le filtre « colère » dans son journal aurait
 * raison de nous en vouloir. Des mots nus, donc, et rien de plus.
 */

export type ScopeFace = 'dream' | 'heart'

/** Base de clés i18n pour une face. */
export const scopeKey = (face: ScopeFace, leaf: string): string => `content.scope.${face}.${leaf}`

/** Le libellé d'un type vit avec les puces, pas ici — même source, jamais deux. */
export const ktypeLabelKey = (id: string): string => `core.ktypes.${id}`
