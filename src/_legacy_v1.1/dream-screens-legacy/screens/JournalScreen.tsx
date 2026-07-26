'use client';

import React, { useState } from 'react';
import { useT } from '@/lib/i18n';
import { Glyph, MODES, type ModeKey } from '@/components/dream/ui/primitives';
import { Surface, GeoSymbol } from '@/components/dream-v12';

export type JournalEntry = {
  id: string;
  title: string;
  date: string;        // relative time string
  mode: string;        // entry_type: dream, day, oracle, etc.
  excerpt?: string;
  glyph: string;
  accentColor: string;
  incomplete?: boolean;
  synchronicity?: boolean;
};

export type JournalScreenProps = {
  entries: JournalEntry[];
  onOpenEntry?: (entry: JournalEntry) => void;
};

const MODE_TO_KEY: Record<string, ModeKey> = {
  dream: 'reve', reve: 'reve',
  day: 'jour', jour: 'jour', journal: 'jour',
  oracle: 'oracle',
  tale: 'conte', conte: 'conte',
  forest: 'foret', foret: 'foret',
  ritual: 'rituel', rituel: 'rituel',
  reentry: 'reve', text: 'reve',
};

const FILTER_MODES: { id: string; key: ModeKey | null }[] = [
  { id: 'tous', key: null },
  { id: 'reve', key: 'reve' },
  { id: 'jour', key: 'jour' },
  { id: 'oracle', key: 'oracle' },
  { id: 'conte', key: 'conte' },
  { id: 'foret', key: 'foret' },
  { id: 'rituel', key: 'rituel' },
];

export default function JournalScreen({ entries, onOpenEntry }: JournalScreenProps) {
  const { t } = useT();
  const [filter, setFilter] = useState<string>('tous');

  const visible = filter === 'tous'
    ? entries
    : entries.filter(e => {
        const mKey = MODE_TO_KEY[e.mode];
        return mKey === filter;
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
        overflow: 'hidden',
      }}
    >
      {/* Dream V1.2 — matter paper PLEINE page + songlines visibles */}
      <Surface
        matter="paper"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.32, pointerEvents: 'none', zIndex: 0 }}>
        <GeoSymbol kind="songlines" color="silk" />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 14,
        }}>
          <Glyph size={10}>{t('home.journal')}</Glyph>
          <Glyph size={9} color="var(--fg-mute)">{entries.length} {t('home.entries')}</Glyph>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTER_MODES.map(f => {
            const m = f.key ? MODES[f.key] : null;
            const isActive = filter === (f.key || 'tous');
            const accent = m?.accent || 'var(--accent)';
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.key || 'tous')}
                style={{
                  padding: '4px 12px',
                  background: isActive
                    ? `color-mix(in srgb, ${accent} 18%, transparent)`
                    : 'transparent',
                  border: `1px solid ${isActive ? accent : 'var(--border)'}`,
                  color: isActive ? accent : 'var(--fg-mute)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  borderRadius: 999,
                }}
              >
                {f.key === null
                  ? t('journal.all')
                  : (m?.glyph || '') + ' ' + (t(`entry_types.${f.id}`) || f.id)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Entries */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 20px 20px' }}>
        {visible.length === 0 && (
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
            color: 'var(--fg-mute)', padding: '24px 0', textAlign: 'center',
          }}>
            {t('home.no_dreams')}
          </div>
        )}

        {visible.map((entry) => {
          const mKey = MODE_TO_KEY[entry.mode] || 'reve';
          const modeInfo = MODES[mKey];
          const isBigDream = entry.synchronicity;
          return (
            <button
              key={entry.id}
              onClick={() => onOpenEntry?.(entry)}
              style={{
                position: 'relative',
                width: '100%',
                padding: isBigDream ? '18px 14px' : '16px 0',
                marginBottom: isBigDream ? 8 : 0,
                borderBottom: isBigDream ? 'none' : '1px solid var(--border)',
                background: isBigDream
                  ? 'color-mix(in oklch, var(--v12-silk-gold) 6%, transparent)'
                  : 'transparent',
                borderTop: isBigDream ? '1px solid color-mix(in oklch, var(--v12-silk-gold) 30%, transparent)' : 'none',
                borderLeft: isBigDream ? '1px solid color-mix(in oklch, var(--v12-silk-gold) 30%, transparent)' : 'none',
                borderRight: isBigDream ? '1px solid color-mix(in oklch, var(--v12-silk-gold) 30%, transparent)' : 'none',
                borderBottomWidth: isBigDream ? 1 : 1,
                borderBottomStyle: 'solid',
                borderBottomColor: isBigDream ? 'color-mix(in oklch, var(--v12-silk-gold) 30%, transparent)' : 'var(--border)',
                cursor: 'pointer',
                color: 'inherit',
                textAlign: 'left',
                opacity: entry.incomplete ? 0.45 : 1,
              }}
            >
              {/* Title row */}
              <div style={{
                display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={{
                    color: modeInfo.accent,
                    fontFamily: 'var(--font-serif)',
                    fontSize: 14,
                    flexShrink: 0,
                  }}>
                    {entry.glyph}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 18,
                    fontStyle: 'italic',
                    lineHeight: 1.2,
                    color: 'var(--fg)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {entry.title || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  {entry.synchronicity && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--accent)',
                      boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)',
                      display: 'inline-block',
                    }} />
                  )}
                  <Glyph size={8} color="var(--fg-mute)">{entry.date}</Glyph>
                </div>
              </div>

              {/* Excerpt */}
              {entry.excerpt && (
                <div style={{
                  marginTop: 6,
                  marginLeft: 24,
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 13,
                  color: 'var(--fg-mute)',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {entry.excerpt}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
