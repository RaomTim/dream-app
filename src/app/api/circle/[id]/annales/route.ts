/**
 * SHIM — /api/circle/[id]/annales → /api/circles/[id]/annales
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { GET } from '../../../circles/[id]/annales/route'
