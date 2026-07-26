/**
 * Dream V1.2 — composants partagés
 *
 * Couche d'amplification visuelle/sensorielle (matters, halos, géosymboles,
 * constellations vivantes, Wow moments).
 *
 * Source : pack handoff dream-v1.2-FINAL-2026-04-25 (post-patch V5).
 *
 * Usage typique pour amplifier un écran existant :
 *
 *   import { Surface, HaloRespire, GeoSymbol } from '@/components/dream-v12'
 *
 *   <div style={{ position: 'relative' }}>
 *     <Surface matter="silk" style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
 *     <HaloRespire kind="silk" style={{ position: 'absolute', inset: '-10%', zIndex: 0 }} />
 *     <div style={{ position: 'relative', zIndex: 2 }}>
 *       {/* contenu écran original *\/}
 *     </div>
 *   </div>
 */

export { default as MatterDefs } from './MatterDefs'
export { default as Surface } from './Surface'
export type { Matter, SurfaceMotion, SurfaceProps } from './Surface'
export { default as HaloRespire } from './HaloRespire'
export type { HaloKind, HaloRespireProps } from './HaloRespire'
export { default as GeoSymbol, computeLogSpiral } from './GeoSymbol'
export type { GeoKind, GeoColor, GeoSymbolProps } from './GeoSymbol'
export { default as SpiraleWowOverlay } from './SpiraleWowOverlay'
export type { SpiraleWowOverlayProps } from './SpiraleWowOverlay'
export { default as ConstellationD3 } from './ConstellationD3'
export type {
  ConstellationD3Props,
  ConstellationNode,
  ConstellationEdge,
  NodeKind,
} from './ConstellationD3'
export { default as DepositFAB } from './DepositFAB'
export type { DepositFABProps } from './DepositFAB'

// Re-export lib helpers for convenience
export { wowRegistry, WOW_NAMES, WOW_KEY } from '@/lib/dream-v12/wow-registry'
export type { WowName, WowFireDetail } from '@/lib/dream-v12/wow-registry'
export { useWowFire } from '@/lib/dream-v12/use-wow-fire'
export { playRitual, ritualSoundEnabled, setRitualSound } from '@/lib/dream-v12/ritual-sound'
export type { RitualSoundKind } from '@/lib/dream-v12/ritual-sound'
