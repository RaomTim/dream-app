/**
 * SHIM — /api/circle/[id]/rituals/[ritualId]/join → /api/circles/[id]/rituals/[ritualId]/join
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { POST, DELETE } from '../../../../../circles/[id]/rituals/[ritualId]/join/route'
