/**
 * SHIM — /api/circle/[id]/rituals/[ritualId] → /api/circles/[id]/rituals/[ritualId]
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { GET, DELETE } from '../../../../circles/[id]/rituals/[ritualId]/route'
