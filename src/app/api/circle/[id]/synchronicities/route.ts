/**
 * SHIM — /api/circle/[id]/synchronicities → /api/circles/[id]/synchronicities
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Ce shim reste pour compat backward avec d'éventuels clients V0.x déployés.
 * À supprimer après V1 launch + grace period.
 */
export { GET, POST } from '../../../circles/[id]/synchronicities/route'
export const maxDuration = 60
