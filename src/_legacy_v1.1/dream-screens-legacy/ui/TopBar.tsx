'use client';

import React from 'react';
import { MoonSigil } from './primitives';
import { useT } from '@/lib/i18n';

export default function TopBar({
  title,
  subtitle,
  onProfile,
  theme,
  onToggleTheme,
}: {
  title?: string;
  subtitle?: string;
  onProfile?: () => void;
  theme?: string;
  onToggleTheme?: () => void;
}) {
  const { t } = useT();
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 20px',
      paddingTop: 'env(safe-area-inset-top, 12px)',
      height: 56,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <MoonSigil size={28} />
        {title && (
          <div>
            <div style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 17, color: 'var(--fg)', letterSpacing: -0.3,
            }}>
              {title}
            </div>
            {subtitle && (
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                color: 'var(--fg-mute)', letterSpacing: 1,
                textTransform: 'uppercase',
              }}>
                {subtitle}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            aria-label={t('profile.theme')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'transparent',
              border: '1px solid var(--border)',
              display: 'grid', placeItems: 'center',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 11,
              color: 'var(--fg-mute)',
            }}
          >
            {theme === 'night' ? '☽' : theme === 'day' ? '☼' : '◑'}
          </button>
        )}
        {onProfile && (
          <button
            onClick={onProfile}
            aria-label={t('profile.title')}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              display: 'grid', placeItems: 'center',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 12,
              color: 'var(--accent)',
            }}
          >
            ◇
          </button>
        )}
      </div>
    </div>
  );
}
