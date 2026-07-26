/**
 * SHIM — /api/circle/[id]/annales/mark → /api/circles/[id]/annales/mark
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { POST, DELETE } from '../../../../circles/[id]/annales/mark/route'
