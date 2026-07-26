'use client';

import React from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { Surface, GeoSymbol } from '@/components/dream-v12';

/**
 * 04 · Correspondances  (night ↔ day synchronicities)
 * V2 design: SVG gradient curves connecting rêve/jour nodes, concept cards with strength %.
 */

export type Correspondence = {
  id: string;
  echoType?: 'dream-day' | 'dream-dream';
  nightFragment: string;
  nightTime: string;
  dayEvent: string;
  dayTime: string;
  resonance: string;
  strength?: 1 | 2 | 3;
};

export type DreamSyncProps = {
  dateLabel?: string;
  subtitle?: string;
  correspondences: Correspondence[];
  onOpen?: (c: Correspondence) => void;
  onClose?: () => void;
};

export default function DreamSync({
  dateLabel = 'semaine du 13 avril',
  subtitle = "7 échos repérés dans la semaine",
  correspondences,
  onOpen,
  onClose,
}: DreamSyncProps) {
  const { t } = useT();
  return (
    <div
      className="grain has-bottom-nav"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--bg-wash)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-serif)',
        overflow: 'hidden',
      }}
    >
      {/* Dream V1.2 — matter water + songlines (échos = fluidité, courants oniriques) */}
      <Surface
        matter="water"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.65, pointerEvents: 'none', zIndex: 0 }}>
        <GeoSymbol kind="songlines" color="silk" />
      </div>

      {/* Intro text */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Glyph size={10}>{t('sync.title')}</Glyph>
          <Glyph size={9} color="var(--fg-mute)">{correspondences.length}</Glyph>
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16,
          color: 'var(--fg-dim)', lineHeight: 1.5, marginBottom: 20,
        }}>
          {t('sync.intro')}
        </div>
      </div>

      {/* Echo cards */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 20px' }}>
        {correspondences.length === 0 && (
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
            color: 'var(--fg-mute)', padding: '24px 0', textAlign: 'center',
          }}>
            {t('sync.no_echos')}
          </div>
        )}

        {correspondences.map((c, i) => (
          <EchoCard key={c.id} echo={c} index={i} onOpen={() => onOpen?.(c)} />
        ))}
      </div>
    </div>
  );
}

function EchoCard({ echo, index, onOpen }: { echo: Correspondence; index: number; onOpen?: () => void }) {
  const strength = echo.strength ?? 2;
  const strengthPct = Math.round((strength / 3) * 100);
  const gradientId = `echo-grad-${index}`;

  return (
    <button
      onClick={onOpen}
      style={{
        width: '100%',
        marginBottom: 18,
        padding: '16px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 2,
        cursor: 'pointer',
        color: 'inherit',
        textAlign: 'left',
      }}
    >
      {/* Header: strength + date */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <Glyph size={9} color="var(--accent)">écho · {strengthPct}%</Glyph>
        <Glyph size={8} color="var(--fg-mute)">{echo.nightTime}</Glyph>
      </div>

      {/* SVG thread: two nodes + gradient curve */}
      {(() => {
        const isDreamDream = echo.echoType === 'dream-dream';
        const color2 = isDreamDream ? 'var(--mode-reve-accent)' : 'var(--mode-jour-accent)';
        const label2 = isDreamDream ? '☽ RÊVE' : '☉ JOUR';
        return (
          <div style={{ position: 'relative', marginBottom: 16, height: 72 }}>
            <svg viewBox="0 0 300 72" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id={gradientId} x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--mode-reve-accent)" />
                  <stop offset="100%" stopColor={color2} />
                </linearGradient>
              </defs>
              {/* First node */}
              <circle cx="40" cy="18" r="5" fill="var(--mode-reve-accent)" />
              <circle cx="40" cy="18" r="10" fill="var(--mode-reve-accent)" opacity="0.15" />
              {/* Second node */}
              <circle cx="260" cy="54" r="5" fill={color2} />
              <circle cx="260" cy="54" r="10" fill={color2} opacity="0.15" />
              {/* Connecting curve */}
              <path
                d="M 40 18 C 120 18 180 54 260 54"
                stroke={`url(#${gradientId})`}
                strokeWidth={1 + strength * 0.8}
                fill="none"
                strokeDasharray="4 2"
                opacity={0.6 + strength * 0.13}
              />
            </svg>

            {/* First label */}
            <div style={{
              position: 'absolute', top: 0, left: 60, right: 0,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg)',
            }}>
              <Glyph size={8} color="var(--mode-reve-accent)" style={{ display: 'block', marginBottom: 2 }}>☽ RÊVE</Glyph>
              {echo.nightFragment}
            </div>

            {/* Second label */}
            <div style={{
              position: 'absolute', bottom: 0, left: 60, right: 0,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--fg)',
            }}>
              <Glyph size={8} color={color2} style={{ display: 'block', marginBottom: 2 }}>{label2}</Glyph>
              {echo.dayEvent}
            </div>
          </div>
        );
      })()}

      {/* Concept card */}
      <div style={{
        padding: '10px 12px',
        background: 'color-mix(in srgb, var(--accent) 6%, var(--bg))',
        borderLeft: '2px solid var(--accent)',
      }}>
        <Glyph size={8} color="var(--fg-mute)">concept reliant</Glyph>
        <div style={{
          marginTop: 3,
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
          color: 'var(--fg)',
        }}>
          « {echo.resonance} »
        </div>
      </div>
    </button>
  );
}
