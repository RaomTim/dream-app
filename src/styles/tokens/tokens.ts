/**
 * Dream App — Design tokens (TypeScript)
 * Mirrors tokens.css. Use when you need tokens in JS (e.g. Tailwind config,
 * inline styles, canvas rendering, email templates).
 */

export const raw = {
  kemet:        '#08080b',
  kemetElev:    '#111117',
  kemetCard:    '#161621',

  lapis:        '#2a3a7a',
  lapisDim:     '#1a2550',
  lapisInk:     '#0e1230',

  nebu:         '#b8975a',
  nebuHi:       '#d8b87a',
  nebuPat:      '#8a6a38',

  stone:        '#2a2830',
  bone:         '#e8e3d8',
  boneDim:      '#9a948a',
  boneMut:      '#6a6460',

  papyrus:      '#ece3cf',
  papyrusHi:    '#f3ecda',
  papyrusLo:    '#d8ceb5',

  ink:          '#1b1510',
  inkSoft:      '#3a2f24',
  inkMute:      '#6e5f4e',
  rouge:        '#7a2418',
} as const;

export const fonts = {
  serif: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
  mono:  '"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace',
  sans:  'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
} as const;

export const spacing = {
  1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48,
} as const;

export const radius = { 0: 0, 1: 2, 2: 4, full: 9999 } as const;

export const typeScale = {
  display: 38,
  h1: 30,
  h2: 24,
  body: 17,
  meta: 10,
  caption: 9,
} as const;

/** Semantic token map — flips between night/day. */
export const semantic = {
  night: {
    bg: raw.kemet,
    bgElev: raw.kemetElev,
    bgCard: raw.kemetCard,
    fg: raw.bone,
    fgDim: raw.boneDim,
    fgMute: raw.boneMut,
    border: raw.stone,
    borderStrong: '#3a3840',
    accent: raw.nebu,
    accentHi: raw.nebuHi,
    accentDim: raw.nebuPat,
    structural: raw.lapis,
    structuralBg: 'rgba(42,58,122,0.22)',
    structuralLine: 'rgba(42,58,122,0.55)',
  },
  day: {
    bg: raw.papyrus,
    bgElev: raw.papyrusHi,
    bgCard: '#f3ecda',
    fg: raw.ink,
    fgDim: raw.inkSoft,
    fgMute: raw.inkMute,
    border: 'rgba(27,21,16,0.28)',
    borderStrong: 'rgba(27,21,16,0.55)',
    accent: raw.rouge,
    accentHi: '#a3341f',
    accentDim: raw.nebuPat,
    structural: '#223066',
    structuralBg: 'rgba(34,48,102,0.10)',
    structuralLine: 'rgba(34,48,102,0.40)',
  },
} as const;

export type ThemeMode = 'auto' | 'night' | 'day';
export type ResolvedTheme = 'night' | 'day';

export const tokens = { raw, fonts, spacing, radius, typeScale, semantic };
export default tokens;
