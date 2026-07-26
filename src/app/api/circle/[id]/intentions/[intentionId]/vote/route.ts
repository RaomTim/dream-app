/**
 * SHIM — /api/circle/[id]/intentions/[intentionId]/vote → /api/circles/[id]/intentions/[intentionId]/vote
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { POST } from '../../../../../circles/[id]/intentions/[intentionId]/vote/route'
