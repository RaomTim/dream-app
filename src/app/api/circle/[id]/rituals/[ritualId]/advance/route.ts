/**
 * SHIM — /api/circle/[id]/rituals/[ritualId]/advance → /api/circles/[id]/rituals/[ritualId]/advance
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { POST } from '../../../../../circles/[id]/rituals/[ritualId]/advance/route'
