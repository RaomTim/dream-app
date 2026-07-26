/**
 * SHIM — /api/circle/[id]/chat/converse → /api/circles/[id]/chat/converse
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { GET, POST } from '../../../../circles/[id]/chat/converse/route'
