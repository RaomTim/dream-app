'use client';

import React from 'react';
import { useT } from '@/lib/i18n';

/**
 * Shared primitive UI atoms for the Dream App.
 * Theme-aware via CSS vars — never hardcode colors here.
 */

/* Metadata voice — always mono, uppercase, wide tracking. */
export function Glyph({
  children, size = 10, color, className = '', style = {},
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={className}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: size,
        color: color ?? 'var(--fg-dim)',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* The voice of the oracle — italic serif, generous leading. */
export function SerifHeading({
  children, size = 30, italic = true, weight = 400, color, style = {},
}: {
  children: React.ReactNode;
  size?: number;
  italic?: boolean;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: size,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: weight,
        color: color ?? 'var(--fg)',
        letterSpacing: -0.3,
        lineHeight: 1.12,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Hair-thin rule — accent variant draws a soft gold/red line.   */
export function Rule({ accent = false, style = {} }: { accent?: boolean; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        height: 1,
        background: accent
          ? 'linear-gradient(90deg, transparent, var(--accent) 20%, var(--accent) 80%, transparent)'
          : 'var(--border)',
        opacity: accent ? 0.55 : 1,
        ...style,
      }}
    />
  );
}

/* Moon sigil — used in the home header. */
export function MoonSigil({ phase = 0.5, size = 36 }: { phase?: number; size?: number }) {
  const clamped = Math.max(0, Math.min(1, phase));
  const rx = Math.abs(15 * (1 - clamped * 2));
  const sweep = clamped > 0.5 ? 0 : 1;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <circle cx="20" cy="20" r="15" fill="none" stroke="var(--accent)" strokeWidth="0.75" opacity="0.55" />
      <path
        d={`M 20 5 A 15 15 0 0 1 20 35 A ${rx} 15 0 0 ${sweep} 20 5 Z`}
        fill="var(--accent)"
        opacity="0.8"
      />
    </svg>
  );
}

/* Diamond — small geometric marker. */
export function Diamond({ size = 8, color }: { size?: number; color?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `1px solid ${color ?? 'var(--accent)'}`,
        transform: 'rotate(45deg)',
      }}
    />
  );
}

/* ─── MODES object ─── */
export const MODES = {
  reve:   { label: 'Rêve',   accent: 'var(--mode-reve-accent)',   glyph: '☽', motif: 'stars' },
  jour:   { label: 'Jour',   accent: 'var(--mode-jour-accent)',   glyph: '☉', motif: 'sun' },
  oracle: { label: 'Oracle', accent: 'var(--mode-oracle-accent)', glyph: '✧', motif: 'eye' },
  conte:  { label: 'Conte',  accent: 'var(--mode-conte-accent)',  glyph: '❦', motif: 'flame' },
  foret:  { label: 'Forêt',  accent: 'var(--mode-foret-accent)',  glyph: '❧', motif: 'leaves' },
  rituel: { label: 'Rituel', accent: 'var(--mode-rituel-accent)', glyph: '⚚', motif: 'moon' },
} as const;

export type ModeKey = keyof typeof MODES;

/* ─── Orb ─── Main orbe with radial gradient, pulse animation */
export function Orb({
  size = 68,
  state = 'idle',
  onClick,
  color,
}: {
  size?: number;
  state?: 'idle' | 'recording' | 'thinking';
  onClick?: () => void;
  color?: string;
}) {
  const accentColor = color || 'var(--accent)';
  const core = size * 0.42;
  return (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 40% 38%, ${accentColor}, rgba(8,8,11,0.9) 72%)`,
        border: 'none', cursor: 'pointer', position: 'relative',
        display: 'grid', placeItems: 'center',
        animation: state === 'recording' ? 'dreamPulseRec 1.8s ease-in-out infinite'
                 : state === 'thinking' ? 'dreamPulse 2.4s ease-in-out infinite'
                 : 'none',
        boxShadow: `0 0 ${size * 0.4}px rgba(184,151,90,0.15)`,
        transition: 'transform 200ms ease',
      }}
      aria-label={state === 'recording' ? 'Arreter' : state === 'thinking' ? 'En reflexion' : 'Capturer'}
    >
      {/* Inner facet highlight */}
      <div style={{
        width: core, height: core, borderRadius: '50%',
        background: `radial-gradient(circle at 45% 40%, rgba(255,255,255,0.15), transparent 60%)`,
        border: `1px solid rgba(255,255,255,0.08)`,
      }} />
    </button>
  );
}

/* ─── MiniOrb ─── 44px version for inline use */
export function MiniOrb({
  state = 'idle',
  onClick,
  color,
}: {
  state?: 'idle' | 'recording' | 'thinking';
  onClick?: () => void;
  color?: string;
}) {
  return <Orb size={44} state={state} onClick={onClick} color={color} />;
}

/* ─── ThinkingLine ─── Rotating mystical phrases */
export function ThinkingLine({ color }: { color?: string }) {
  const { tRaw } = useT();
  const phrases = (tRaw('thinking.phrases') as string[]) || [];
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % phrases.length), 3200);
    return () => clearInterval(t);
  }, [phrases.length]);

  return (
    <div style={{
      fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
      color: color || 'var(--fg-mute)',
      textAlign: 'center', padding: '8px 0',
      animation: 'thinkFade 3.2s ease-in-out infinite',
      minHeight: 20,
    }}>
      {phrases[idx]}
    </div>
  );
}

/* ─── Tag ─── Mono bordered pill label */
export function Tag({
  children, color, active = false,
}: {
  children: React.ReactNode;
  color?: string;
  active?: boolean;
}) {
  const c = color || 'var(--fg-mute)';
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: active ? 'var(--bg)' : c,
      background: active ? c : 'transparent',
      border: `1px solid ${c}`,
      borderRadius: 'var(--r-full)',
      padding: '3px 10px',
      display: 'inline-block',
    }}>
      {children}
    </span>
  );
}

/* ─── BtnGhost ─── Ghost button with border */
export function BtnGhost({
  children, onClick, active = false, color,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  color?: string;
}) {
  const c = color || 'var(--accent)';
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: active ? 'var(--bg)' : c,
        background: active ? c : 'transparent',
        border: `1px solid ${c}`,
        borderRadius: 'var(--r-1)',
        padding: '8px 16px',
        cursor: 'pointer',
        transition: 'all 150ms ease',
      }}
    >
      {children}
    </button>
  );
}

/* ─── ModeMotif ─── SVG decorative per mode */
export function ModeMotif({ mode, size = 120 }: { mode: ModeKey; size?: number }) {
  const s = size;
  const half = s / 2;
  const color = MODES[mode]?.accent || 'var(--accent)';

  const paths: Record<string, string> = {
    reve: `M${half*0.3} ${half} Q${half} ${half*0.2} ${half*1.7} ${half} M${half*0.5} ${half*1.3} Q${half} ${half*0.7} ${half*1.5} ${half*1.3}`,
    jour: Array.from({length: 8}, (_, i) => { const a = (i * Math.PI * 2) / 8; return `M${half} ${half} L${half + Math.cos(a)*half*0.8} ${half + Math.sin(a)*half*0.8}`; }).join(' '),
    oracle: `M${half} ${half*0.3} Q${half*1.6} ${half} ${half} ${half*1.7} Q${half*0.4} ${half} ${half} ${half*0.3}`,
    conte: `M${half*0.2} ${half} Q${half*0.5} ${half*0.4} ${half} ${half} Q${half*1.5} ${half*1.6} ${half*1.8} ${half}`,
    foret: `M${half} ${s*0.9} L${half} ${half*0.5} M${half} ${half*0.7} L${half*0.6} ${half*0.3} M${half} ${half*0.7} L${half*1.4} ${half*0.3}`,
    rituel: `M${half} ${half*0.2} A${half*0.8} ${half*0.8} 0 1 1 ${half} ${half*1.8} A${half*0.8} ${half*0.8} 0 1 1 ${half} ${half*0.2} M${half*0.5} ${half} L${half*1.5} ${half}`,
  };

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width={s} height={s} style={{ opacity: 0.12, position: 'absolute', right: 0, top: 0 }}>
      <path d={paths[mode] || paths.reve} fill="none" stroke={color} strokeWidth="1" />
    </svg>
  );
}

/* Tab bar — shared across journal/echos/figures screens. */
export function TabBar({
  active,
  onChange,
}: {
  active: 'journal' | 'capture' | 'sync' | 'pattern';
  onChange?: (id: 'journal' | 'capture' | 'sync' | 'pattern') => void;
}) {
  const tabs = [
    { id: 'journal', label: 'journal' },
    { id: 'capture', label: 'capture', center: true },
    { id: 'sync',    label: 'échos'  },
    { id: 'pattern', label: 'figures' },
  ] as const;

  return (
    <div
      style={{
        position: 'absolute', bottom: 30, left: 0, right: 0,
        padding: '14px 28px 0',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}
    >
      {tabs.map((t) =>
        ('center' in t && t.center) ? (
          <button
            key={t.id}
            onClick={() => onChange?.(t.id)}
            style={{
              width: 42, height: 42, borderRadius: '50%',
              border: '1px solid var(--accent)',
              background: active === t.id ? 'color-mix(in srgb, var(--accent) 14%, transparent)' : 'transparent',
              display: 'grid', placeItems: 'center', cursor: 'pointer',
            }}
            aria-label="capture"
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          </button>
        ) : (
          <button
            key={t.id}
            onClick={() => onChange?.(t.id)}
            style={{
              background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2,
              textTransform: 'uppercase',
              color: active === t.id ? 'var(--accent)' : 'var(--fg-mute)',
            }}
          >
            {t.label}
          </button>
        ),
      )}
    </div>
  );
}
