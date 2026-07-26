/**
 * SHIM — /api/circle/[id]/portrait/generate → /api/circles/[id]/portrait/generate
 *
 * Audit dette code 2026-04-28 : route canonique = pluriel (REST convention).
 * Backward-compat shim ; à supprimer après V1 launch + grace period.
 */
export { POST } from '../../../../circles/[id]/portrait/generate/route'
