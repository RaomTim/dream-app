'use client';

import React from 'react';
import { useT } from '@/lib/i18n';
import { Glyph, SerifHeading, MoonSigil, Diamond, Rule, MODES, type ModeKey } from '@/components/dream/ui/primitives';
import { Surface, GeoSymbol } from '@/components/dream-v12';

export type DreamEntry = {
  date: string;
  title: string;
  id?: string;
  tags?: string[];
  empty?: boolean;
  synchronicity?: boolean;
  incomplete?: boolean;
};

export type DreamHomeProps = {
  dateLabel?: string;
  weekdayLabel?: string;
  thresholdPrompt?: string;
  thresholdCTA?: string;
  timeOfDay?: 'night' | 'day';
  recent: DreamEntry[];
  moonPhase?: number;
  onOpenThreshold?: () => void;
  onOpenDream?: (d: DreamEntry) => void;
  onOpenMode?: (mode: string) => void;
  onOpenProtocol?: (id: 'rêve' | 'journal' | 'rituel') => void;
  onOpenGuide?: () => void;
  onOpenAnchor?: () => void;
  onOpenReentry?: () => void;
  onOpenCircles?: () => void;
  onOpenBodyOracle?: () => void;
  onOpenLifeline?: () => void;
  onOpenCollective?: () => void;
  onTabChange?: (id: 'journal' | 'capture' | 'sync' | 'pattern') => void;
  anchorFragment?: string;
};

export default function DreamHome({
  dateLabel = 'Nuit du 17 avril',
  weekdayLabel = 'vendredi',
  thresholdPrompt = 'Que portes-tu\nau seuil de la nuit?',
  thresholdCTA = 'déposer une intention',
  timeOfDay = 'night',
  recent,
  moonPhase = 0.63,
  onOpenThreshold,
  onOpenDream,
  onOpenMode,
  onOpenProtocol,
  onOpenGuide,
  onOpenAnchor,
  onOpenReentry,
  onOpenCircles,
  onOpenBodyOracle,
  onOpenLifeline,
  onOpenCollective,
  onTabChange,
  anchorFragment,
}: DreamHomeProps) {
  const { t, locale } = useT();

  const PROTOCOLS = [
    {
      id: 'rêve' as const,
      title: t('protocols.dream.title'),
      steps: 10,
      tag: t('protocols.dream.tag'),
      desc: t('protocols.dream.desc'),
      accent: 'var(--mode-reve-accent)',
      time: 'day' as const,
    },
    {
      id: 'journal' as const,
      title: t('protocols.day.title'),
      steps: 5,
      tag: t('protocols.day.tag'),
      desc: t('protocols.day.desc'),
      accent: 'var(--mode-jour-accent)',
      time: 'day' as const,
    },
    {
      id: 'rituel' as const,
      title: t('protocols.ritual.title'),
      steps: 5,
      tag: t('protocols.ritual.tag'),
      desc: t('protocols.ritual.desc'),
      accent: 'var(--mode-rituel-accent)',
      time: 'night' as const,
    },
  ];

  const ESPACES: { mode: ModeKey; desc: string; customAction?: string }[] = [
    { mode: 'oracle', desc: t('espaces.oracle') },
    { mode: 'conte',  desc: t('espaces.conte') },
    { mode: 'reve',   desc: t('espaces.reentry'), customAction: 'reentry' },
    { mode: 'reve',   desc: t('espaces.circles'), customAction: 'circles' },
    { mode: 'oracle', desc: t('espaces.body_oracle'), customAction: 'oracle-corps' },
    { mode: 'reve',   desc: t('espaces.lifeline'), customAction: 'lifeline' },
    { mode: 'reve',   desc: t('espaces.collective'), customAction: 'collective' },
    // 🌲 Forêt retirée des espaces Dream — bridge externe ci-dessous (section séparée)
  ];

  const sortedProtocols = [...PROTOCOLS].sort((a, b) => {
    if (a.time === timeOfDay && b.time !== timeOfDay) return -1;
    if (b.time === timeOfDay && a.time !== timeOfDay) return 1;
    return 0;
  });

  return (
    <div
      className="grain has-bottom-nav"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--bg-wash)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-serif)',
        paddingTop: 'env(safe-area-inset-top, 12px)',
      }}
    >
      {/* Dream V1.2 — matter linen ambient + spirale subtile en fond */}
      <Surface
        matter="linen"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}
      />
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translate(-50%, -30%)',
        width: 480, height: 480, opacity: 0.06, pointerEvents: 'none', zIndex: 0,
      }}>
        <GeoSymbol kind="spirale" color="silk" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Ancre du jour */}
      {anchorFragment && onOpenAnchor && (
        <button
          onClick={onOpenAnchor}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: 'calc(100% - 40px)', margin: '16px 20px 0',
            padding: '14px 18px',
            background: 'color-mix(in srgb, var(--accent) 8%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
            borderRadius: 2, cursor: 'pointer', color: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Diamond size={5} color="var(--accent)" />
            <div>
              <Glyph size={9} color="var(--accent)">{t('anchor.label')}</Glyph>
              <div style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
                color: 'var(--fg-dim)', marginTop: 4, maxWidth: 260,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {anchorFragment}
              </div>
            </div>
          </div>
          <Glyph size={9} color="var(--accent)">›</Glyph>
        </button>
      )}

      {/* Seuil contextuel */}
      <button
        onClick={onOpenThreshold}
        style={{
          display: 'block', width: 'calc(100% - 40px)',
          margin: '16px 20px 0', padding: '24px 20px 22px',
          background: 'linear-gradient(180deg, var(--structural-bg), color-mix(in srgb, var(--structural) 10%, transparent))',
          border: '1px solid var(--structural-line)', borderRadius: 2,
          textAlign: 'left', cursor: 'pointer', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Glyph size={9} color="var(--accent)">SEUIL · {weekdayLabel}</Glyph>
          <MoonSigil phase={moonPhase} size={28} />
        </div>
        <SerifHeading size={26} italic style={{ marginTop: 14, lineHeight: 1.15, whiteSpace: 'pre-line' }}>
          {thresholdPrompt}
        </SerifHeading>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 1, background: 'color-mix(in srgb, var(--accent) 35%, transparent)' }} />
          <Glyph size={9} color="var(--accent)">{thresholdCTA}</Glyph>
          <Diamond />
        </div>
      </button>

      {/* Protocoles guidés */}
      <div style={{ padding: '28px 20px 0' }}>
        <Glyph size={10}>{t('home.protocols')}</Glyph>
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedProtocols.map((p) => (
            <ProtocolCard key={p.id} {...p} onClick={() => onOpenProtocol?.(p.id)} />
          ))}
        </div>
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            style={{
              marginTop: 10, padding: '8px 0',
              background: 'transparent', border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <Diamond size={4} color="var(--fg-mute)" />
            <Glyph size={9} color="var(--fg-mute)">{t('guide.start_protocol').replace('→', '').trim()} — {t('guide.title')}</Glyph>
          </button>
        )}
      </div>

      {/* Espaces — 2×2 grid */}
      <div style={{ padding: '28px 20px 0' }}>
        <Glyph size={10}>{t('home.espaces')}</Glyph>
        <div style={{
          marginTop: 14,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        }}>
          {ESPACES.map((e) => (
            <EspaceCard
              key={e.customAction || e.mode}
              mode={e.mode}
              desc={e.desc}
              overrideLabel={e.customAction === 'reentry' ? 'Réentrée' : e.customAction === 'circles' ? 'Cercles' : e.customAction === 'oracle-corps' ? 'Corps' : e.customAction === 'lifeline' ? 'Ligne de vie' : e.customAction === 'collective' ? 'Collectif' : undefined}
              overrideGlyph={e.customAction === 'reentry' ? '◯' : e.customAction === 'circles' ? '◯' : e.customAction === 'oracle-corps' ? '◎' : e.customAction === 'lifeline' ? '⊸' : e.customAction === 'collective' ? '◉' : undefined}
              onClick={() => {
                if (e.customAction === 'collective') {
                  onOpenCollective?.();
                } else if (e.customAction === 'lifeline') {
                  onOpenLifeline?.();
                } else if (e.customAction === 'circles') {
                  onOpenCircles?.();
                } else if (e.customAction === 'oracle-corps') {
                  onOpenBodyOracle?.();
                } else if (e.customAction === 'reentry') {
                  onOpenReentry?.();
                } else {
                  // Modes internes (oracle, conte, reve, rituel) — foret a été retirée (bridge externe)
                  const MODE_TO_APP: Record<string, string> = {
                    rituel: 'ritual', conte: 'tale', reve: 'dream',
                  };
                  onOpenMode?.(MODE_TO_APP[e.mode] || e.mode);
                }
              }}
            />
          ))}
        </div>

        {/* 🌲 Bridge vers la Forêt App (externe) — plus un espace Dream */}
        <a
          href="https://foret-app.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: 10, padding: '14px 16px',
            background: 'transparent',
            border: '1px dashed color-mix(in srgb, var(--fg-mute) 40%, transparent)',
            borderRadius: 2, textDecoration: 'none', color: 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 14, opacity: 0.7 }}>🌲</span>
            <div>
              <Glyph size={9} color="var(--fg-mute)">CONSULTER — AILLEURS</Glyph>
              <div style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                color: 'var(--fg-dim)', marginTop: 2,
              }}>
                La Forêt · 270 livres de sagesse
              </div>
            </div>
          </div>
          <Glyph size={9} color="var(--fg-mute)">↗</Glyph>
        </a>
      </div>

      {/* Journal strata */}
      <div style={{ padding: '28px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <Glyph size={10}>{t('home.journal')}</Glyph>
          <Glyph size={9} color="var(--fg-mute)">{recent.length} {t('home.entries')}</Glyph>
        </div>
        {recent.length === 0 && (
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
            color: 'var(--fg-mute)', padding: '16px 0',
          }}>
            {t('home.no_dreams')}
          </div>
        )}
        {recent.map((r, i) => (
          <DreamStratum key={r.id || i} entry={r} onOpen={() => onOpenDream?.(r)} />
        ))}
      </div>
      </div>
    </div>
  );
}

/* Protocol card with left accent border */
function ProtocolCard({
  title, steps, tag, desc, accent, onClick,
}: {
  title: string; steps: number; tag: string; desc: string; accent: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderLeft: `3px solid ${accent}`,
        borderRadius: 2, padding: '16px 16px 14px',
        cursor: 'pointer', color: 'inherit', textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: 18, fontStyle: 'italic',
          color: 'var(--fg)',
        }}>
          {title}
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1.5,
          textTransform: 'uppercase', color: accent,
          border: `1px solid ${accent}`, borderRadius: 'var(--r-full)',
          padding: '2px 8px',
        }}>
          {tag}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12,
        color: 'var(--fg-mute)', marginTop: 6, lineHeight: 1.4,
      }}>
        {desc}
      </div>
      {/* Step dots */}
      <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
        {Array.from({ length: steps }, (_, i) => (
          <div key={i} style={{
            width: 16, height: 3, borderRadius: 1,
            background: accent, opacity: 0.35,
          }} />
        ))}
      </div>
    </button>
  );
}

/* Espace card — grid cell with glyph */
function EspaceCard({
  mode, desc, onClick, overrideLabel, overrideGlyph,
}: {
  mode: ModeKey; desc: string; onClick?: () => void;
  overrideLabel?: string; overrideGlyph?: string;
}) {
  const m = MODES[mode];
  return (
    <button
      onClick={onClick}
      style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 2, padding: '18px 14px',
        cursor: 'pointer', color: 'inherit', textAlign: 'left',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}
    >
      <span style={{ fontSize: 22 }}>{overrideGlyph || m.glyph}</span>
      <div style={{
        fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic',
        color: m.accent,
      }}>
        {overrideLabel || m.label}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1,
        color: 'var(--fg-mute)', textTransform: 'uppercase',
      }}>
        {desc}
      </div>
    </button>
  );
}

/* Dream journal entry row */
function DreamStratum({ entry, onOpen }: { entry: DreamEntry; onOpen?: () => void }) {
  const { t } = useT();
  return (
    <button
      onClick={onOpen}
      style={{
        width: '100%', background: 'transparent', border: 'none', padding: '12px 0',
        borderTop: '1px solid var(--border)',
        display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 12,
        alignItems: 'center', cursor: 'pointer', color: 'inherit', textAlign: 'left',
        opacity: entry.incomplete ? 0.45 : 1,
      }}
    >
      <Glyph size={9} color="var(--fg-mute)">{entry.date}</Glyph>
      <div>
        {entry.empty ? (
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--fg-mute)' }}>
            {t('home.no_dream_retained')}
          </div>
        ) : (
          <>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontStyle: 'italic', lineHeight: 1.2 }}>
              {entry.title}
            </div>
            {entry.tags && entry.tags.length > 0 && (
              <div style={{ marginTop: 3, display: 'flex', gap: 10 }}>
                {entry.tags.map((tag) => (
                  <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: 'var(--fg-mute)', letterSpacing: 1 }}>
                    · {tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {entry.synchronicity && (
        <span style={{
          width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
          boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)',
        }} />
      )}
    </button>
  );
}
