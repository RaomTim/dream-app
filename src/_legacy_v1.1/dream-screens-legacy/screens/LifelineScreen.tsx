'use client';

import React, { useState, useEffect } from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { authFetch } from '@/lib/api-client';

type LifelineData = {
  timeline: Array<{ month: string; count: number; dreams: number; days: number; numinous: number }>;
  recurringFigures: Array<{
    name: string; type: string; appearances: number;
    firstSeen: string; lastSeen: string; timeline: string[];
  }>;
  topThemes: Array<{ theme: string; count: number }>;
  numinousDreams: Array<{ id: string; title: string; date: string; numinosity: number; soulWish: string | null }>;
  propheticDreams: Array<{ id: string; title: string; date: string; status: string }>;
  honoring: {
    total: number; honored: number; pledged: number;
    list: Array<{ id: string; title: string; action: string; status: string; note: string | null; date: string }>;
  };
  stats: { totalDreams: number; totalDays: number; totalEntries: number; firstEntry: string; lastEntry: string };
};

const FIGURE_TYPE_COLORS: Record<string, string> = {
  probable_self: '#7CE0D8',
  counterpart: '#C77CE0',
  entity_fragment: '#FFD700',
  consciousness_cousin: '#9AE07C',
  post_mortem: '#E0C77C',
  inner_ego_projection: '#E07C7C',
  archetypal: '#7C9AE0',
  unknown: 'var(--fg-mute)',
};

export type LifelineScreenProps = {
  userId?: string;
  onClose?: () => void;
  onOpenDream?: (id: string) => void;
};

export default function LifelineScreen({ userId, onClose, onOpenDream }: LifelineScreenProps) {
  const [data, setData] = useState<LifelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useT();

  useEffect(() => {
    if (!userId) return;
    const fetch_ = async () => {
      try {
        const res = await authFetch(`/api/dreams/lifeline?userId=${userId}`);
        const json = await res.json();
        setData(json.lifeline || null);
      } catch (e) {
        console.error('Lifeline fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [userId]);

  if (loading) {
    return (
      <div className="grain" style={{ minHeight: '100dvh', background: 'var(--bg-wash)', display: 'grid', placeItems: 'center' }}>
        <SerifHeading size={20} italic color="var(--fg-mute)">{t('detail.loading')}</SerifHeading>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grain" style={{ minHeight: '100dvh', background: 'var(--bg-wash)', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center', padding: '0 32px' }}>
          <SerifHeading size={22} italic color="var(--fg-mute)">{t('lifeline.no_data')}</SerifHeading>
          <button onClick={onClose} style={{ marginTop: 20, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Glyph size={10}>{t('lifeline.back')}</Glyph>
          </button>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.timeline.map(m => m.count), 1);

  return (
    <div
      className="grain"
      style={{
        position: 'relative', minHeight: '100dvh',
        background: 'var(--bg-wash)', color: 'var(--fg)',
        fontFamily: 'var(--font-serif)', paddingTop: 54,
      }}
    >
      {/* Header */}
      <header style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <Glyph size={10}>{t('lifeline.back')}</Glyph>
        </button>
        <Glyph size={9} color="var(--fg-mute)">{data.stats.totalEntries} {t('home.entries')}</Glyph>
      </header>

      {/* Title */}
      <div style={{ padding: '28px 28px 0', textAlign: 'center' }}>
        <SerifHeading size={28} italic style={{ lineHeight: 1.15 }}>
          {t('lifeline.title')}
        </SerifHeading>
        <div style={{
          marginTop: 6, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 14, color: 'var(--fg-dim)',
        }}>
          {t('lifeline.intro')}
        </div>
      </div>

      {/* Timeline bars */}
      <div style={{ padding: '28px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 80 }}>
          {data.timeline.map(m => {
            const h = Math.max(4, (m.count / maxCount) * 70);
            const numinH = m.numinous > 0 ? Math.max(2, (m.numinous / maxCount) * 70) : 0;
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <div style={{
                    width: '100%', height: h, borderRadius: '1px 1px 0 0',
                    background: 'color-mix(in srgb, var(--accent) 30%, transparent)',
                  }} />
                  {numinH > 0 && (
                    <div style={{
                      position: 'absolute', bottom: 0, width: '100%', height: numinH,
                      background: 'var(--accent)', borderRadius: '1px 1px 0 0',
                    }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <Glyph size={7} color="var(--fg-mute)">
            {data.timeline[0]?.month || ''}
          </Glyph>
          <Glyph size={7} color="var(--fg-mute)">
            {data.timeline[data.timeline.length - 1]?.month || ''}
          </Glyph>
        </div>
      </div>

      <Rule style={{ margin: '24px 28px 0' }} />

      {/* Recurring Figures */}
      {data.recurringFigures.length > 0 && (
        <div style={{ padding: '24px 28px 0' }}>
          <Glyph size={10}>{t('lifeline.figures_section')}</Glyph>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.recurringFigures.slice(0, 8).map(fig => (
              <div key={fig.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: FIGURE_TYPE_COLORS[fig.type] || 'var(--fg-mute)',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic',
                    color: 'var(--fg)',
                  }}>
                    {fig.name}
                  </div>
                  <Glyph size={8} color="var(--fg-mute)">
                    {fig.appearances}× · {fig.firstSeen.substring(0, 10)} → {fig.lastSeen.substring(0, 10)}
                  </Glyph>
                </div>
                {/* Mini sparkline — dots for each appearance */}
                <div style={{ display: 'flex', gap: 2 }}>
                  {fig.timeline.slice(-10).map((d, i) => (
                    <div key={i} style={{
                      width: 4, height: 4, borderRadius: '50%',
                      background: FIGURE_TYPE_COLORS[fig.type] || 'var(--accent)',
                      opacity: 0.5 + (i / fig.timeline.length) * 0.5,
                    }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Themes */}
      {data.topThemes.length > 0 && (
        <div style={{ padding: '24px 28px 0' }}>
          <Glyph size={10}>{t('lifeline.themes_section')}</Glyph>
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {data.topThemes.map(th => (
              <span key={th.theme} style={{
                padding: '4px 10px',
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                borderRadius: 2,
                fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1,
                color: 'var(--accent)',
              }}>
                {th.theme} · {th.count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Numinous / Big Dreams */}
      {data.numinousDreams.length > 0 && (
        <div style={{ padding: '24px 28px 0' }}>
          <Glyph size={10}>{t('lifeline.numinous_dreams')}</Glyph>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.numinousDreams.map(d => (
              <button
                key={d.id}
                onClick={() => onOpenDream?.(d.id)}
                style={{
                  width: '100%', background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)',
                  borderRadius: 2, padding: '10px 14px', cursor: 'pointer',
                  textAlign: 'left', color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontSize: 15, fontStyle: 'italic',
                    color: 'var(--fg)',
                  }}>
                    {d.title}
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: d.numinosity }, (_, i) => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: 'var(--accent)',
                        boxShadow: i >= 3 ? '0 0 6px color-mix(in srgb, var(--accent) 60%, transparent)' : 'none',
                      }} />
                    ))}
                  </div>
                </div>
                <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 2 }}>
                  {new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Glyph>
                {d.soulWish && (
                  <div style={{
                    marginTop: 6, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                    fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.4,
                  }}>
                    « {d.soulWish} »
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prophetic Echoes */}
      {data.propheticDreams.length > 0 && (
        <div style={{ padding: '24px 28px 0' }}>
          <Glyph size={10}>{t('lifeline.echoes_section')}</Glyph>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.propheticDreams.map(d => (
              <button
                key={d.id}
                onClick={() => onOpenDream?.(d.id)}
                style={{
                  width: '100%', background: 'transparent',
                  border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                  borderRadius: 2, padding: '10px 14px', cursor: 'pointer',
                  textAlign: 'left', color: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
                  boxShadow: '0 0 10px color-mix(in srgb, var(--accent) 60%, transparent)',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, fontStyle: 'italic' }}>
                    {d.title}
                  </div>
                  <Glyph size={8} color="var(--fg-mute)">
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    {d.status === 'confirmed' ? ' · confirmé' : ' · éveillé'}
                  </Glyph>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Honoring tracker */}
      {data.honoring.total > 0 && (
        <div style={{ padding: '24px 28px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Glyph size={10}>{t('lifeline.honoring_section')}</Glyph>
            <Glyph size={9} color={data.honoring.honored > 0 ? '#9AE07C' : 'var(--fg-mute)'}>
              {t('lifeline.honored_count')
                .replace('{honored}', String(data.honoring.honored))
                .replace('{total}', String(data.honoring.total))}
            </Glyph>
          </div>
          {/* Progress bar */}
          <div style={{
            marginTop: 10, height: 4, borderRadius: 2,
            background: 'color-mix(in srgb, #9AE07C 15%, transparent)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${(data.honoring.honored / data.honoring.total) * 100}%`,
              height: '100%', borderRadius: 2,
              background: '#9AE07C',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {data.honoring.list.slice(0, 6).map(h => (
              <button
                key={h.id}
                onClick={() => onOpenDream?.(h.id)}
                style={{
                  width: '100%', background: 'transparent',
                  border: 'none', borderBottom: '1px solid var(--border)',
                  padding: '8px 0', cursor: 'pointer', textAlign: 'left', color: 'inherit',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  opacity: h.status === 'honored' ? 0.6 : 1,
                }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                  background: h.status === 'honored' ? '#9AE07C' : 'var(--accent)',
                }} />
                <div>
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontSize: 13, fontStyle: 'italic',
                    textDecoration: h.status === 'honored' ? 'line-through' : 'none',
                  }}>
                    {h.action}
                  </div>
                  <Glyph size={7} color="var(--fg-mute)">{h.title}</Glyph>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ height: 60 }} />
    </div>
  );
}
