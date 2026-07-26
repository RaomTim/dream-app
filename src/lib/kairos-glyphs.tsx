/**
 * kairos-glyphs.tsx — les huit glyphes des types de dépôt, en un seul endroit.
 *
 * C1 · 2026-07-26 · Yeshua (Opus).
 *
 * Ils vivaient dans `KTYPES` (page.tsx), inatteignables depuis un composant — or la
 * bulle « ce qu'on dépose ici » doit montrer EXACTEMENT les mêmes signes que les puces
 * du post-dépôt, sinon la bulle n'est plus une répétition de ce qui va arriver, c'est
 * une deuxième nomenclature. Les recopier aurait garanti la dérive au premier retrait
 * de trait. Ils sont donc extraits ici, et `KTYPES` les consomme.
 *
 * Tracés inchangés au trait près (moon/sun repris de `I.moon` / `I.sun`).
 * Le libellé, lui, reste dans l'i18n : `core.ktypes.<id>`.
 */

export type Glyph = (c: string, s?: number) => JSX.Element

export const KGLYPH: Record<string, Glyph> = {
  reve: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ),
  signe: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 5c4.5 0 8 4.2 9 7-1 2.8-4.5 7-9 7s-8-4.2-9-7c1-2.8 4.5-7 9-7z" stroke={c} strokeWidth="1.5" /><circle cx="12" cy="12" r="2.6" fill={c} /></svg>
  ),
  reverie: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M6 16a4 4 0 0 1 .5-7.97A5.5 5.5 0 0 1 17 9a3.5 3.5 0 0 1 1 6.9H6z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ),
  hypnagogie: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 15a8 8 0 0 1 16 0" stroke={c} strokeWidth="1.5" /><path d="M2 18h20" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" /></svg>
  ),
  frisson: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0" stroke={c} strokeWidth="1.5" strokeLinecap="round" /></svg>
  ),
  synchronicite: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" stroke={c} strokeWidth="1.3" strokeLinejoin="round" /><circle cx="18.5" cy="17.5" r="2" stroke={c} strokeWidth="1.2" /></svg>
  ),
  intuition: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M12 4v5M12 15v5M4 12h5M15 12h5" stroke={c} strokeWidth="1.4" strokeLinecap="round" /><circle cx="12" cy="12" r="2" fill={c} /></svg>
  ),
  note_jour: (c, s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.2" stroke={c} strokeWidth="1.5" /><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6" stroke={c} strokeWidth="1.4" strokeLinecap="round" /></svg>
  ),
}
