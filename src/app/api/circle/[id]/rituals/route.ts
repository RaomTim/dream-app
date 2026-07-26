/**
 * SHIM — /api/circle/[id]/rituals → /api/circles/[id]/rituals
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { GET, POST } from '../../../circles/[id]/rituals/route'
