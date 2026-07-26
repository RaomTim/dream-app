/**
 * SHIM — /api/circle/[id]/intentions/[intentionId] → /api/circles/[id]/intentions/[intentionId]
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { PATCH, DELETE } from '../../../../circles/[id]/intentions/[intentionId]/route'
