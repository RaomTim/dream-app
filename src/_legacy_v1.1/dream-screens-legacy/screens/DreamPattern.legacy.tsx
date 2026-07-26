'use client';

import React from 'react';
import { Glyph, SerifHeading, Diamond } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { Surface, GeoSymbol } from '@/components/dream-v12';

/**
 * 05 · Figures — V2 semantic cloud with breathing animation
 * Words positioned in a cloud, sized by frequency, with gentle breathing motion.
 * Falls back to frequency list below.
 */

export type Motif = {
  id: string;
  label: string;
  occurrences: number;
  firstSeen: string;
  emergentPhase?: boolean;
  dreamIds?: string[];
  type?: string;
  types?: string[];
};

// Seth's 6 figure types + archetypal + unknown
const FIGURE_TYPE_COLORS: Record<string, string> = {
  probable_self: '#7C9AE0',      // bleu — versions probables de soi
  counterpart: '#9AE07C',        // vert — contreparties dans le réseau d'être
  entity_fragment: '#E0C77C',    // or — fragments d'entité plus vaste
  consciousness_cousin: '#C77CE0', // violet — cousins de conscience non-humains
  post_mortem: '#E07C7C',        // rouge doux — communications post-mortem
  inner_ego_projection: '#7CE0D8', // turquoise — projections de l'ego intérieur
  archetypal: 'var(--accent)',    // accent — archétypes
  unknown: 'var(--fg-mute)',
};

const FIGURE_TYPE_LABELS: Record<string, string> = {
  probable_self: 'soi probable',
  counterpart: 'contrepartie',
  entity_fragment: 'fragment d\'entité',
  consciousness_cousin: 'cousin de conscience',
  post_mortem: 'post-mortem',
  inner_ego_projection: 'projection ego',
  archetypal: 'archétype',
  unknown: 'inconnu',
};

export type MotifEdge = { a: string; b: string; weight?: number };

export type DreamPatternProps = {
  windowLabel?: string;
  summary?: string;
  motifs: Motif[];
  edges?: MotifEdge[];
  onOpen?: (m: Motif) => void;
  onClose?: () => void;
};

// Stable cloud positions — avoids layout shift
const CLOUD_POSITIONS = [
  { x: 45, y: 30 }, { x: 18, y: 20 }, { x: 72, y: 48 },
  { x: 30, y: 60 }, { x: 78, y: 18 }, { x: 58, y: 72 },
  { x: 15, y: 52 }, { x: 85, y: 75 }, { x: 40, y: 10 },
  { x: 72, y: 86 }, { x: 12, y: 76 }, { x: 55, y: 48 },
  { x: 88, y: 40 }, { x: 28, y: 38 }, { x: 65, y: 14 },
];

export default function DreamPattern({
  windowLabel = '6 derniers mois',
  summary = "Une figure se tient au centre : la maison. Tout le reste gravite autour d'elle.",
  motifs,
  edges = [],
  onOpen,
  onClose,
}: DreamPatternProps) {
  const { t } = useT();
  const sorted = [...motifs].sort((a, b) => b.occurrences - a.occurrences);
  const maxOcc = Math.max(...sorted.map(m => m.occurrences), 1);

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
      {/* Dream V1.2 — matter silk pour Portrait des figures */}
      <Surface
        matter="silk"
        motion="drift"
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55 }}
      />
      <div style={{
        position: 'absolute', top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 420, height: 420, opacity: 0.18, pointerEvents: 'none', zIndex: 0,
      }}>
        <GeoSymbol kind="concentric" color="silk" />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Glyph size={10}>{t('pattern.title')}</Glyph>
          <Glyph size={9} color="var(--fg-mute)">{windowLabel}</Glyph>
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16,
          color: 'var(--fg-dim)', lineHeight: 1.5, marginBottom: 16,
        }}>
          {t('pattern.intro')}
        </div>
      </div>

      {motifs.length === 0 && (
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
          color: 'var(--fg-mute)', padding: '24px 20px', textAlign: 'center',
        }}>
          {t('pattern.no_figures')}
        </div>
      )}

      {/* Semantic cloud */}
      {motifs.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, height: 420, margin: '0 20px', overflow: 'hidden' }}>
          {sorted.slice(0, CLOUD_POSITIONS.length).map((m, i) => {
            const pos = CLOUD_POSITIONS[i];
            const fontSize = scaleFontSize(m.occurrences, maxOcc, 15, 34);
            const opacity = 0.4 + (m.occurrences / maxOcc) * 0.6;
            // Stagger breathing animation
            const animDuration = 5 + (i % 4);
            const animDelay = (i % 5) * 0.3;

            return (
              <button
                key={m.id}
                onClick={() => onOpen?.(m)}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  color: 'inherit',
                  animation: `breath ${animDuration}s ease-in-out infinite`,
                  animationDelay: `${animDelay}s`,
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize,
                  color: m.type && FIGURE_TYPE_COLORS[m.type] ? FIGURE_TYPE_COLORS[m.type] : (m.emergentPhase ? 'var(--accent)' : 'var(--fg)'),
                  letterSpacing: -0.3,
                  opacity,
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                }}>
                  {m.label}
                </div>
                <Glyph size={8} color="var(--fg-mute)" style={{ display: 'block', marginTop: 3, textAlign: 'center' }}>
                  ×{m.occurrences}
                </Glyph>
              </button>
            );
          })}
        </div>
      )}

      {/* Seth figure type legend */}
      {sorted.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 0' }}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 0',
            borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
          }}>
            {Object.entries(FIGURE_TYPE_LABELS).filter(([k]) => k !== 'unknown').map(([key, label]) => (
              <span key={key} style={{
                fontSize: 8, fontFamily: 'var(--font-sans)',
                padding: '2px 6px', borderRadius: 2,
                background: `color-mix(in srgb, ${FIGURE_TYPE_COLORS[key]} 12%, transparent)`,
                color: FIGURE_TYPE_COLORS[key],
                letterSpacing: 0.3,
              }}>
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Frequency list */}
      {sorted.length > 0 && (
        <div style={{ position: 'relative', zIndex: 1, padding: '4px 20px 60px' }}>
          <div style={{ paddingTop: 12 }}>
            <Glyph size={9} color="var(--fg-mute)">{t('pattern.frequency')}</Glyph>
          </div>
          {sorted.map((m) => {
            const typeColor = m.type && FIGURE_TYPE_COLORS[m.type] ? FIGURE_TYPE_COLORS[m.type] : 'var(--fg-mute)';
            const typeLabel = m.type && FIGURE_TYPE_LABELS[m.type] ? FIGURE_TYPE_LABELS[m.type] : '';
            return (
              <button
                key={m.id}
                onClick={() => onOpen?.(m)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 52px',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  width: '100%', textAlign: 'left',
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--fg)' }}>
                    {m.label}
                    {m.emergentPhase && (
                      <span style={{
                        marginLeft: 10,
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: 'var(--accent)',
                        letterSpacing: 1.5,
                      }}>
                        · {t('pattern.emergent')}
                      </span>
                    )}
                  </div>
                  {typeLabel && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: 4,
                      fontSize: 9,
                      fontFamily: 'var(--font-sans)',
                      padding: '2px 8px',
                      borderRadius: 2,
                      background: `color-mix(in srgb, ${typeColor} 15%, transparent)`,
                      color: typeColor,
                      letterSpacing: 0.5,
                    }}>
                      {typeLabel}
                    </span>
                  )}
                </div>
                <Glyph size={9} color="var(--fg-mute)">{t('pattern.since')} {m.firstSeen}</Glyph>
                <Glyph size={10} color={m.emergentPhase ? 'var(--accent)' : 'var(--fg)'} style={{ textAlign: 'right' as const }}>
                  × {m.occurrences}
                </Glyph>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function scaleFontSize(occ: number, max: number, min: number, maxSize: number) {
  const t = occ / max;
  return Math.round(min + (maxSize - min) * t);
}
