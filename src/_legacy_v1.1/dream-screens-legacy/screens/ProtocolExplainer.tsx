'use client';

import React, { useState } from 'react';
import { useT } from '@/lib/i18n';
import { Glyph, SerifHeading, Diamond } from '@/components/dream/ui/primitives';

export type ProtocolExplainerProps = {
  onClose?: () => void;
  onStartProtocol?: (type: 'rêve' | 'journal' | 'rituel') => void;
};

type GuideSection = {
  key: 'reve' | 'jour' | 'rituel';
  protocolId: 'rêve' | 'journal' | 'rituel';
  glyph: string;
  accent: string;
};

const SECTIONS: GuideSection[] = [
  { key: 'reve', protocolId: 'rêve', glyph: '☽', accent: 'var(--mode-reve-accent)' },
  { key: 'jour', protocolId: 'journal', glyph: '☉', accent: 'var(--mode-jour-accent)' },
  { key: 'rituel', protocolId: 'rituel', glyph: '⚚', accent: 'var(--mode-rituel-accent)' },
];

export default function ProtocolExplainer({ onClose, onStartProtocol }: ProtocolExplainerProps) {
  const { t, tRaw } = useT();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['reve']));

  const toggle = (key: string) => {
    const next = new Set(openSections);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setOpenSections(next);
  };

  return (
    <div
      className="grain"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--bg-wash)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-serif)',
        paddingTop: 'env(safe-area-inset-top, 12px)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
      }}>
        <button onClick={onClose} style={btn}>
          <Glyph size={10}>{t('protocol.back')}</Glyph>
        </button>
        <SerifHeading size={16} italic>{t('guide.title')}</SerifHeading>
        <span style={{ width: 50 }} />
      </div>

      {/* Content */}
      <div style={{ padding: '28px 24px 40px', overflowY: 'auto' }}>
        {/* Intro */}
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16,
          color: 'var(--fg-dim)', lineHeight: 1.55, marginBottom: 36,
        }}>
          {t('guide.intro')}
        </div>

        {/* Sections */}
        {SECTIONS.map(sec => {
          const isOpen = openSections.has(sec.key);
          const title = t(`guide.${sec.key}.title`);
          const source = t(`guide.${sec.key}.source`);
          const intro = t(`guide.${sec.key}.intro`);
          const steps = tRaw(`guide.${sec.key}.steps`) as { name: string; desc: string }[] | undefined;

          return (
            <section key={sec.key} style={{ marginBottom: 28 }}>
              <button
                onClick={() => toggle(sec.key)}
                style={{
                  width: '100%', padding: '14px 0', background: 'transparent',
                  border: 'none', borderTop: `1px solid color-mix(in srgb, ${sec.accent} 25%, transparent)`,
                  cursor: 'pointer', color: 'inherit', textAlign: 'left',
                  display: 'flex', alignItems: 'baseline', gap: 14,
                }}
              >
                <span style={{
                  color: sec.accent, fontFamily: 'var(--font-serif)',
                  fontSize: 22, lineHeight: 1, width: 20,
                }}>{sec.glyph}</span>
                <div style={{ flex: 1 }}>
                  <SerifHeading size={24} italic={false} style={{ letterSpacing: -0.3, fontWeight: 400 }}>
                    {title}
                  </SerifHeading>
                  <Glyph size={9} color="var(--fg-mute)" style={{ marginTop: 4, display: 'block' }}>
                    {source}
                  </Glyph>
                </div>
                <span style={{
                  color: sec.accent, fontFamily: 'var(--font-mono)', fontSize: 14,
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0)',
                  transition: 'transform 220ms',
                  display: 'inline-block',
                }}>›</span>
              </button>

              {isOpen && (
                <div className="screen-enter-fade" style={{ paddingLeft: 34, paddingRight: 4, paddingTop: 8, paddingBottom: 12 }}>
                  {/* Section intro */}
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
                    color: 'var(--fg-dim)', lineHeight: 1.6, marginBottom: 24,
                    paddingLeft: 14, borderLeft: `1px solid color-mix(in srgb, ${sec.accent} 25%, transparent)`,
                  }}>
                    {intro}
                  </div>

                  {/* Steps */}
                  {steps && steps.map((s, i) => (
                    <div key={i} style={{
                      marginBottom: 18, paddingBottom: 18,
                      borderBottom: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                        <Glyph size={9} color={sec.accent} style={{ minWidth: 18 }}>
                          {String(i + 1).padStart(2, '0')}
                        </Glyph>
                        <span style={{
                          fontFamily: 'var(--font-serif)', fontSize: 17,
                          color: sec.accent, fontWeight: 500, fontStyle: 'normal',
                          letterSpacing: -0.2,
                        }}>
                          {s.name}
                        </span>
                      </div>
                      <div style={{
                        paddingLeft: 28,
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                        color: 'var(--fg-dim)', lineHeight: 1.6,
                      }}>
                        {s.desc}
                      </div>
                    </div>
                  ))}

                  {/* Start protocol button */}
                  <button
                    onClick={() => onStartProtocol?.(sec.protocolId)}
                    style={{
                      marginTop: 8,
                      padding: '10px 16px',
                      background: `color-mix(in srgb, ${sec.accent} 12%, transparent)`,
                      border: `1px solid ${sec.accent}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      letterSpacing: 1.5,
                      textTransform: 'uppercase' as const,
                      color: sec.accent,
                    }}
                  >
                    {t('guide.start_protocol')}
                  </button>
                </div>
              )}
            </section>
          );
        })}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 28, opacity: 0.5 }}>
          <Diamond size={5} color="var(--accent)" />
          <Glyph size={8} color="var(--fg-mute)" style={{ display: 'block', marginTop: 12 }}>
            {t('guide.footer')}
          </Glyph>
        </div>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' };
