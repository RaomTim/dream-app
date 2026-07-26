'use client';

/**
 * DreamHome — V1.2 AMPLIFIED REFOUND (2026-04-25)
 *
 * Refonte massive depuis screens-v12-amplified.jsx (HomeV12).
 * Visuellement :
 *   - matter linen pleine page (visible)
 *   - spirale silk-gold derrière le contenu (opacity 0.12)
 *   - card latest entry centrale, EB Garamond italic 22px, backdrop-blur
 *   - bouton déposer central proéminent + halo silk-gold respirant (visible)
 *   - bottom nav 5 entrées sobres (déjà géré par BottomNav.tsx)
 *
 * Logique préservée :
 *   - tous les callbacks (onOpenThreshold, onOpenProtocol, etc.)
 *   - protocols guidés (3) — déplacés en section secondaire
 *   - espaces 2x2 (oracle/conte/réentrée/cercles/corps/lifeline/collective)
 *   - bridge Forêt externe
 *   - journal recent strata
 */

import React from 'react';
import { useT } from '@/lib/i18n';
import { Glyph, SerifHeading, MoonSigil, Diamond, MODES, type ModeKey } from '@/components/dream/ui/primitives';
import { Surface, HaloRespire, GeoSymbol } from '@/components/dream-v12';

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
  onOpenCapture?: () => void;
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
  onOpenCapture,
  onTabChange,
  anchorFragment,
}: DreamHomeProps) {
  const { t } = useT();
  const [welcomed, setWelcomed] = React.useState(false);

  // Breath de bienvenue : 1 cycle souffle (6s) puis fade halo card
  React.useEffect(() => {
    const tm = setTimeout(() => setWelcomed(true), 6200);
    return () => clearTimeout(tm);
  }, []);

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
  ];

  const sortedProtocols = [...PROTOCOLS].sort((a, b) => {
    if (a.time === timeOfDay && b.time !== timeOfDay) return -1;
    if (b.time === timeOfDay && a.time !== timeOfDay) return 1;
    return 0;
  });

  // Latest entry pour la card centrale V1.2
  const latest = recent[0];

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
        overflow: 'hidden',
      }}
    >
      {/* ═══════════════════════════════════════════════════
          V1.2 — matter linen ambient PLEINE PAGE (visible)
          ═══════════════════════════════════════════════════ */}
      <Surface
        matter="linen"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />

      {/* Spirale géosymbolique en fond — visible (opacity 0.12) */}
      <div style={{
        position: 'absolute', top: '18%', left: '50%',
        transform: 'translate(-50%, -25%)',
        width: 540, height: 540, opacity: 0.12, pointerEvents: 'none', zIndex: 0,
      }}>
        <GeoSymbol kind="spirale" color="silk" />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* ═══════════════════════════════════════════════════
            ANCRE DU JOUR (préservée)
            ═══════════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════════
            HÉROS V1.2 — meta + card latest entry + bouton déposer
            "ce que le journal tient en ce moment" (V1.2 amplified Home)
            ═══════════════════════════════════════════════════ */}
        <div style={{ padding: '32px 20px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
            color: 'var(--fg-mute)', textAlign: 'center', marginBottom: 24,
            letterSpacing: 0.2,
          }}>
            ce que le journal tient en ce moment
          </div>

          {/* Latest entry card — proéminente, EB Garamond, backdrop blur */}
          {latest ? (
            <button
              onClick={() => onOpenDream?.(latest)}
              style={{
                position: 'relative',
                display: 'block', width: '100%',
                padding: '22px 20px',
                background: 'color-mix(in oklch, var(--bg-card) 86%, transparent)',
                backdropFilter: 'blur(2px)',
                WebkitBackdropFilter: 'blur(2px)',
                border: '1px solid color-mix(in srgb, var(--accent) 18%, var(--border))',
                borderRadius: 2,
                cursor: 'pointer', color: 'inherit', textAlign: 'left',
              }}
            >
              {/* Halo silk respirant pendant 6s au montage */}
              {!welcomed && (
                <div style={{
                  position: 'absolute', top: -40, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 180, height: 100, pointerEvents: 'none',
                  zIndex: 0,
                }}>
                  <HaloRespire kind="silk" style={{ width: '100%', height: '100%' }} />
                </div>
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 11,
                  color: 'var(--fg-mute)', letterSpacing: 0.3, marginBottom: 10,
                }}>
                  {latest.date}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 22, lineHeight: 1.35, color: 'var(--fg)',
                  textWrap: 'pretty' as const,
                }}>
                  {latest.title}
                </div>
                {latest.synchronicity && (
                  <div style={{ marginTop: 10 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)',
                      display: 'inline-block', marginRight: 8, verticalAlign: 'middle',
                    }} />
                    <Glyph size={9} color="var(--accent)">écho prophétique</Glyph>
                  </div>
                )}
              </div>
            </button>
          ) : (
            // empty state — invitation au seuil
            <button
              onClick={onOpenThreshold}
              style={{
                display: 'block', width: '100%',
                padding: '24px 20px 22px',
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
          )}

          {/* "un kairos t'attend pour cette question" — whisper sous la card */}
          {latest && (
            <button
              onClick={onOpenThreshold}
              style={{
                display: 'block', margin: '20px auto 0',
                background: 'transparent', border: 'none',
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
                color: 'var(--fg-mute)', cursor: 'pointer',
                opacity: 0.75,
              }}
            >
              un kairos t'attend pour cette question →
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            BOUTON DÉPOSER CENTRAL V1.2 — proéminent + halo silk
            ═══════════════════════════════════════════════════ */}
        <div style={{
          position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 12, padding: '32px 20px 36px',
        }}>
          {/* Halo silk respirant DERRIÈRE le bouton — clairement visible */}
          <div style={{
            position: 'absolute', top: 16, left: '50%',
            transform: 'translateX(-50%)',
            width: 160, height: 160, pointerEvents: 'none',
            opacity: 0.85, zIndex: 0,
          }}>
            <HaloRespire kind="silk" style={{ width: '100%', height: '100%' }} />
          </div>

          <button
            onClick={onOpenCapture || onOpenThreshold}
            aria-label="déposer un kairos"
            style={{
              position: 'relative', zIndex: 1,
              width: 64, height: 64, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 32%, var(--accent-hi), var(--accent) 55%, color-mix(in oklch, var(--accent) 60%, var(--structural)) 100%)',
              border: '1px solid color-mix(in srgb, var(--accent) 50%, transparent)',
              cursor: 'pointer',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 32px color-mix(in srgb, var(--accent) 40%, transparent), inset 0 0 14px rgba(0,0,0,0.35)',
              transition: 'transform 200ms ease',
            }}
          >
            <svg viewBox="0 0 28 28" width={26} height={26} fill="none" stroke="rgba(8,8,11,0.72)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10 Q14 22 24 10" />
              <line x1="14" y1="2" x2="14" y2="10" />
            </svg>
          </button>
          <div style={{
            position: 'relative', zIndex: 1,
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 2.5,
            color: 'var(--fg-mute)', textTransform: 'lowercase' as const,
          }}>
            déposer
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            PROTOCOLES GUIDÉS (préservés, secondaires)
            ═══════════════════════════════════════════════════ */}
        <div style={{ padding: '8px 20px 0' }}>
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

        {/* ═══════════════════════════════════════════════════
            ESPACES — grid 2×2 (préservé)
            ═══════════════════════════════════════════════════ */}
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
                overrideLabel={e.customAction === 'reentry' ? 'Réentrée' : e.customAction === 'circles' ? 'Cercles' : e.customAction === 'oracle-corps' ? 'Corps' : e.customAction === 'lifeline' ? 'Ligne de vie' : e.customAction === 'collective' ? 'Voûte' : undefined}
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
                    const MODE_TO_APP: Record<string, string> = {
                      rituel: 'ritual', conte: 'tale', reve: 'dream',
                    };
                    onOpenMode?.(MODE_TO_APP[e.mode] || e.mode);
                  }
                }}
              />
            ))}
          </div>

          {/* Bridge Forêt externe (préservé) */}
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

        {/* ═══════════════════════════════════════════════════
            JOURNAL STRATA (préservé)
            ═══════════════════════════════════════════════════ */}
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

/* ═══════════════════════════════════════════════════
   Sub-components (préservés depuis V1.1)
   ═══════════════════════════════════════════════════ */

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
        color: 'var(--fg-mute)', textTransform: 'uppercase' as const,
      }}>
        {desc}
      </div>
    </button>
  );
}

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
