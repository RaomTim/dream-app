'use client';

import React, { useState, useEffect } from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { authFetch } from '@/lib/api-client';
import { Surface, HaloRespire, GeoSymbol } from '@/components/dream-v12';

/**
 * Oracle du Corps — Mindell Dreambody Screen
 *
 * Based on Arnold Mindell's process-oriented psychology:
 * Dreams and body symptoms speak the same language.
 * This screen maps somatic sensations to dream patterns.
 */

export type OracleCorpsScreenProps = {
  userId: string;
  onClose?: () => void;
  onOpenDream?: (dreamId: string) => void;
  onOpenChat?: (mode: string) => void;
};

type BodyZone = 'head' | 'throat' | 'chest' | 'belly' | 'hands' | 'legs' | 'back' | 'other';

type SomaticCorrelation = {
  zone: string;
  count: number;
  dreams: Array<{
    id: string;
    title: string | null;
    created_at: string;
    body_symbolism: any;
    somatic_location: string | null;
  }>;
};

const BODY_ZONES: { zone: BodyZone; label: string; y: number; symbolism: string }[] = [
  { zone: 'head', label: 'Tête', y: 8, symbolism: 'Pensée, contrôle, identité' },
  { zone: 'throat', label: 'Gorge', y: 18, symbolism: 'Expression, vérité non-dite' },
  { zone: 'chest', label: 'Poitrine', y: 30, symbolism: 'Cœur, amour, vulnérabilité' },
  { zone: 'belly', label: 'Ventre', y: 45, symbolism: 'Intuition, digestion émotionnelle' },
  { zone: 'hands', label: 'Mains', y: 42, symbolism: 'Action, création, toucher' },
  { zone: 'back', label: 'Dos', y: 35, symbolism: 'Soutien, fardeau, ce qu\'on porte' },
  { zone: 'legs', label: 'Jambes', y: 65, symbolism: 'Ancrage, avancer, fuir' },
];

export default function OracleCorpsScreen({
  userId,
  onClose,
  onOpenDream,
  onOpenChat,
}: OracleCorpsScreenProps) {
  const { t } = useT();
  const [correlations, setCorrelations] = useState<SomaticCorrelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<BodyZone | null>(null);

  useEffect(() => {
    fetchSomaticData();
  }, [userId]);

  const fetchSomaticData = async () => {
    try {
      const res = await authFetch(`/api/oracle-corps?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCorrelations(data.correlations || []);
      }
    } catch (e) {
      console.error('Oracle Corps fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedCorrelation = correlations.find(c => c.zone === selectedZone);
  const maxCount = Math.max(...correlations.map(c => c.count), 1);

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
      {/* Dream V1.2 — Surface earth ambient (visible) + cercles concentriques + halo earth respirant centre */}
      <Surface
        matter="earth"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div style={{
        position: 'absolute',
        top: '14%', left: '50%',
        transform: 'translateX(-50%)',
        width: 400, height: 400, opacity: 0.45, pointerEvents: 'none', zIndex: 0,
      }}>
        <GeoSymbol kind="concentric" color="silk" />
      </div>
      <div style={{
        position: 'absolute',
        top: '15%', left: '50%',
        transform: 'translateX(-50%)',
        width: 320, height: 320, pointerEvents: 'none', zIndex: 0, opacity: 0.55,
      }}>
        <HaloRespire kind="earth" />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <Glyph size={10}>{t('oracle_corps.title')}</Glyph>
          <Glyph size={9} color="var(--fg-mute)">{t('oracle_corps.subtitle')}</Glyph>
        </div>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
          color: 'var(--fg-dim)', lineHeight: 1.5, marginBottom: 16,
        }}>
          {t('oracle_corps.intro')}
        </div>
      </div>

      {loading ? (
        <div style={{ position: 'relative', zIndex: 1, padding: '40px 20px', textAlign: 'center' }}>
          <Glyph size={10} color="var(--fg-mute)">{t('detail.loading')}</Glyph>
        </div>
      ) : (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Body map */}
          <div style={{
            position: 'relative',
            height: 320,
            margin: '0 20px',
            display: 'flex',
            justifyContent: 'center',
          }}>
            {/* Vertical body line */}
            <div style={{
              position: 'absolute',
              left: '50%', top: '5%', height: '80%',
              width: 2,
              background: 'linear-gradient(180deg, var(--accent), var(--border), var(--accent))',
              opacity: 0.3,
              transform: 'translateX(-50%)',
            }} />

            {/* Body zones */}
            {BODY_ZONES.map(({ zone, label, y, symbolism }) => {
              const correlation = correlations.find(c => c.zone === zone);
              const count = correlation?.count || 0;
              const intensity = count / maxCount;
              const isSelected = selectedZone === zone;
              const isLeft = zone === 'hands';
              const isRight = zone === 'back';

              return (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(isSelected ? null : zone)}
                  style={{
                    position: 'absolute',
                    top: `${y}%`,
                    left: isLeft ? '20%' : isRight ? '80%' : '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  {/* Pulse ring for zones with data */}
                  {count > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 30 + intensity * 30,
                      height: 30 + intensity * 30,
                      borderRadius: '50%',
                      background: `color-mix(in srgb, var(--accent) ${Math.round(10 + intensity * 20)}%, transparent)`,
                      animation: count > 2 ? 'breath 4s ease-in-out infinite' : 'none',
                    }} />
                  )}

                  {/* Center dot */}
                  <div style={{
                    width: isSelected ? 16 : 10,
                    height: isSelected ? 16 : 10,
                    borderRadius: '50%',
                    background: count > 0
                      ? `color-mix(in srgb, var(--accent) ${40 + intensity * 60}%, var(--fg-mute))`
                      : 'var(--border)',
                    border: isSelected ? '2px solid var(--accent)' : '1px solid var(--border)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                  }} />

                  {/* Label */}
                  <div style={{
                    marginTop: 4,
                    fontSize: 10,
                    fontFamily: 'var(--font-sans)',
                    color: isSelected ? 'var(--accent)' : 'var(--fg-mute)',
                    letterSpacing: 0.5,
                    whiteSpace: 'nowrap',
                  }}>
                    {label}
                    {count > 0 && (
                      <span style={{ marginLeft: 4, color: 'var(--accent)' }}>·{count}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected zone detail */}
          {selectedZone && (
            <div style={{ padding: '0 20px 16px' }}>
              <Rule />
              <div style={{ marginTop: 16 }}>
                <SerifHeading size={18} italic>
                  {BODY_ZONES.find(z => z.zone === selectedZone)?.label}
                </SerifHeading>
                <div style={{
                  marginTop: 6,
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.4,
                }}>
                  {BODY_ZONES.find(z => z.zone === selectedZone)?.symbolism}
                </div>

                {selectedCorrelation && selectedCorrelation.dreams.length > 0 ? (
                  <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <Glyph size={9} color="var(--accent)">
                      {selectedCorrelation.count} {selectedCorrelation.count > 1 ? 'rêves' : 'rêve'} dans cette zone
                    </Glyph>
                    {selectedCorrelation.dreams.slice(0, 5).map(dream => (
                      <button
                        key={dream.id}
                        onClick={() => onOpenDream?.(dream.id)}
                        style={{
                          width: '100%', textAlign: 'left',
                          background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
                          border: '1px solid var(--border)',
                          borderRadius: 2, padding: '10px 14px',
                          cursor: 'pointer',
                        }}
                      >
                        <Glyph size={9} color="var(--fg)">
                          {dream.title || new Date(dream.created_at).toLocaleDateString('fr-FR')}
                        </Glyph>
                        {dream.body_symbolism?.message && (
                          <div style={{
                            marginTop: 4, fontSize: 12,
                            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                            color: 'var(--fg-dim)', lineHeight: 1.4,
                          }}>
                            {dream.body_symbolism.message}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ marginTop: 14 }}>
                    <Glyph size={9} color="var(--fg-mute)">
                      {t('oracle_corps.no_dreams_zone')}
                    </Glyph>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Overall body message */}
          {!selectedZone && correlations.length > 0 && (
            <div style={{ padding: '0 20px 16px' }}>
              <Rule />
              <div style={{ marginTop: 16 }}>
                <Glyph size={9} color="var(--accent)">{t('oracle_corps.active_zones')}</Glyph>
                <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {correlations
                    .filter(c => c.count > 0)
                    .sort((a, b) => b.count - a.count)
                    .map(c => (
                      <button
                        key={c.zone}
                        onClick={() => setSelectedZone(c.zone as BodyZone)}
                        style={{
                          padding: '6px 12px',
                          background: `color-mix(in srgb, var(--accent) ${Math.round(10 + (c.count / maxCount) * 20)}%, transparent)`,
                          border: '1px solid var(--accent)',
                          borderRadius: 2, cursor: 'pointer',
                        }}
                      >
                        <Glyph size={9} color="var(--accent)">
                          {BODY_ZONES.find(z => z.zone === c.zone)?.label || c.zone} ·{c.count}
                        </Glyph>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}

          {correlations.length === 0 && !loading && (
            <div style={{ padding: '20px 20px', textAlign: 'center' }}>
              <Glyph size={9} color="var(--fg-mute)">{t('oracle_corps.empty')}</Glyph>
              <div style={{
                marginTop: 12, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.5,
              }}>
                {t('oracle_corps.empty_hint')}
              </div>
            </div>
          )}

          {/* Action: Explore with body oracle */}
          <div style={{ padding: '16px 20px 80px' }}>
            <button
              onClick={() => onOpenChat?.('body')}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, var(--structural-bg), color-mix(in srgb, var(--structural) 10%, transparent))',
                border: '1px solid var(--structural-line)',
                padding: '14px 18px', cursor: 'pointer', borderRadius: 2,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <Diamond size={6} color="var(--accent)" />
              <Glyph size={9} color="var(--accent)">{t('oracle_corps.consult')}</Glyph>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
