/**
 * SHIM — /api/circle/[id]/weather → /api/circles/[id]/weather
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { GET, POST } from '../../../circles/[id]/weather/route'
