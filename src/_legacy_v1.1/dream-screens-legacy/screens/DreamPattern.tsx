'use client';

/**
 * DreamPattern — V1.2 AMPLIFIED REFOUND (2026-04-25)
 *
 * Refonte massive depuis screens-v12-amplified.jsx (PortraitV12).
 * Visuellement :
 *   - Surface stone matter (gris-bleu, ancrage)
 *   - ConstellationD3 vivant force-directed avec edges Bézier ondulants
 *   - Particules silk-gold qui dérivent
 *   - Node "moi" focal pinned au centre + halo silk-gold
 *   - Wow2 echo arc : arc silk-gold reliant 2 figures résonantes (one-shot)
 *
 * Logique préservée :
 *   - props (motifs, edges, summary, onOpen, onClose)
 *   - mapping motifs → nodes ConstellationD3
 *   - frequency list en bas
 *   - figure type colors / labels
 */

import React, { useMemo, useState, useEffect } from 'react';
import { Glyph } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { authFetch } from '@/lib/api-client';
import {
  Surface, ConstellationD3, wowRegistry, playRitual,
  type ConstellationNode, type ConstellationEdge,
} from '@/components/dream-v12';

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

const FIGURE_TYPE_COLORS: Record<string, string> = {
  probable_self: '#7C9AE0',
  counterpart: '#9AE07C',
  entity_fragment: '#E0C77C',
  consciousness_cousin: '#C77CE0',
  post_mortem: '#E07C7C',
  inner_ego_projection: '#7CE0D8',
  archetypal: 'var(--accent)',
  unknown: 'var(--fg-mute)',
};

const FIGURE_TYPE_LABELS: Record<string, string> = {
  probable_self: 'soi probable',
  counterpart: 'contrepartie',
  entity_fragment: "fragment d'entité",
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

export default function DreamPattern({
  windowLabel = '6 derniers mois',
  motifs,
  edges = [],
  onOpen,
  onClose,
}: DreamPatternProps) {
  const { t } = useT();
  const sorted = useMemo(() => [...motifs].sort((a, b) => b.occurrences - a.occurrences), [motifs]);
  const [selected, setSelected] = useState<string | null>(null);
  const [echoArc, setEchoArc] = useState<{ from: string; to: string } | null>(null);
  const [period, setPeriod] = useState<'lune' | 'saison' | 'annee' | 'always'>('lune');
  const [scope, setScope] = useState<'onirique' | 'jour' | 'croise'>('croise');

  // Construction nodes pour ConstellationD3
  const nodes: ConstellationNode[] = useMemo(() => {
    const list: ConstellationNode[] = [
      { id: 'self', label: 'moi', kind: 'self', weight: 3 },
    ];
    sorted.slice(0, 14).forEach((m) => {
      const isBig = m.emergentPhase || m.occurrences >= 5;
      list.push({
        id: m.id,
        label: m.label,
        kind: isBig ? 'bigdream' : 'figure',
        weight: 1.2 + Math.min(m.occurrences / 4, 2),
      });
    });
    return list;
  }, [sorted]);

  // Construction edges — relier "self" aux 5 plus fortes figures + edges du back-end
  const edgesD3: ConstellationEdge[] = useMemo(() => {
    const e: ConstellationEdge[] = [];
    sorted.slice(0, 5).forEach((m) => {
      e.push({ source: 'self', target: m.id, alive: true });
    });
    edges.forEach((edge) => {
      if (edge.a !== edge.b) {
        e.push({ source: edge.a, target: edge.b });
      }
    });
    return e;
  }, [sorted, edges]);

  // Wow 2 — premier écho prophétique : arc silk-gold éphémère reliant 2 figures.
  // Trigger : si server `user_wow_state.first_prophetic_echo_fired_at` est présent
  // (DB trigger via INSERT kairos_edges echo_prophetique). On vérifie d'abord
  // localStorage (idempotent) puis on fait un check serveur léger.
  useEffect(() => {
    if (sorted.length < 2) return;
    if (wowRegistry.has('premier-echo-prophetique')) return;

    let cancelled = false;
    const check = async () => {
      try {
        const res = await authFetch('/api/user/wow-state');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const fired = data?.fired?.['premier-echo-prophetique'];
        if (fired) {
          if (wowRegistry.fire('premier-echo-prophetique')) {
            try { playRitual('tisse'); } catch {}
            setEchoArc({ from: sorted[0].id, to: sorted[1].id });
            setTimeout(() => setEchoArc(null), 4200);
          }
        }
      } catch {}
    };
    // Délai court pour laisser monter la constellation visuellement.
    const t1 = setTimeout(check, 1500);
    return () => { cancelled = true; clearTimeout(t1); };
  }, [sorted]);

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
      {/* V1.2 — Surface stone (gris-bleu ancrage, derive cosmologique) */}
      <Surface
        matter="stone"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 8,
          }}>
            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 28, color: 'var(--fg)',
            }}>
              Portrait
            </div>
            <Glyph size={9} color="var(--fg-mute)">{windowLabel}</Glyph>
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
            color: 'var(--fg-dim)', lineHeight: 1.5,
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

        {/* ════════════════════════════════════════════════════
            CONSTELLATION D3 VIVANTE — pivot V1.2 amplified
            ════════════════════════════════════════════════════ */}
        {motifs.length > 0 && (
          <div style={{
            position: 'relative',
            margin: '0 12px 16px',
            border: '1px solid color-mix(in srgb, var(--v12-stone-cool) 28%, transparent)',
            background: 'color-mix(in oklch, var(--v12-night-warm) 48%, transparent)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}>
            <ConstellationD3
              nodes={nodes}
              edges={edgesD3}
              focalId="self"
              onNodeClick={(n) => {
                setSelected(n.id);
                const motif = sorted.find((m) => m.id === n.id);
                if (motif) onOpen?.(motif);
              }}
              driftParticles={true}
              showLabels={true}
              style={{ width: '100%', height: 420 }}
            />

            {/* Wow2 — arc silk-gold éphémère reliant 2 figures résonantes */}
            {echoArc && (
              <svg
                className="echo-arc-wow"
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: 420,
                  pointerEvents: 'none', zIndex: 3,
                }}
                aria-hidden="true"
              >
                <path
                  d="M 22 38 Q 50 4, 78 30"
                  fill="none"
                  stroke="var(--v12-silk-gold)"
                  strokeWidth="0.35"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: 200,
                    filter: 'drop-shadow(0 0 6px color-mix(in oklch, var(--v12-silk-gold) 55%, transparent))',
                    animation: 'echoArcDraw 4200ms cubic-bezier(0.7, 0, 0.3, 1) forwards',
                  }}
                />
                <style>{`
                  @keyframes echoArcDraw {
                    0%   { stroke-dashoffset: 200; opacity: 0; }
                    20%  { opacity: 0.95; }
                    65%  { stroke-dashoffset: 0; opacity: 0.85; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                  }
                `}</style>
              </svg>
            )}
          </div>
        )}

        {selected && (
          <div style={{
            textAlign: 'center', padding: '0 20px 12px',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--v12-silk-gold)',
          }}>
            {sorted.find((m) => m.id === selected)?.label}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            Toggles : scope (onirique/jour/croisé) + period
            ════════════════════════════════════════════════════ */}
        <div style={{ padding: '0 20px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {([['onirique', 'onirique'], ['jour', 'jour'], ['croise', 'croisé']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setScope(k)}
              style={pillStyle(scope === k)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ padding: '0 20px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {([['lune', 'cette lune'], ['saison', 'saison'], ['annee', 'année'], ['always', 'always']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setPeriod(k)}
              style={pillStyle(period === k)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Échos vivants en ce moment — texte poétique */}
        {sorted.length >= 2 && (
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.5,
              textTransform: 'uppercase' as const,
              color: 'var(--fg-mute)', marginBottom: 12, textAlign: 'center',
            }}>
              · échos vivants en ce moment ·
            </div>
            {sorted.slice(0, 2).map((m) => (
              <div key={m.id} style={{
                padding: '14px 16px', marginBottom: 8,
                background: 'color-mix(in oklch, var(--bg-card) 75%, transparent)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
                border: '1px solid var(--border)', borderRadius: 2,
              }}>
                <p style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16,
                  margin: 0, color: 'var(--fg)', lineHeight: 1.5,
                }}>
                  « {m.label} » résonne — {m.occurrences} apparitions depuis {m.firstSeen}.
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Type legend (préservé) */}
        {sorted.length > 0 && (
          <div style={{ padding: '0 20px 12px' }}>
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

        {/* Frequency list (préservé) */}
        {sorted.length > 0 && (
          <div style={{ padding: '4px 20px 60px' }}>
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
    </div>
  );
}

function pillStyle(active: boolean): React.CSSProperties {
  return {
    padding: '5px 14px',
    background: active
      ? 'color-mix(in oklch, var(--v12-silk-gold) 18%, transparent)'
      : 'color-mix(in oklch, var(--bg-card) 60%, transparent)',
    border: `1px solid ${active ? 'var(--v12-silk-gold)' : 'var(--border)'}`,
    borderRadius: 999,
    color: active ? 'var(--v12-silk-gold)' : 'var(--fg-mute)',
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    cursor: 'pointer',
  };
}
