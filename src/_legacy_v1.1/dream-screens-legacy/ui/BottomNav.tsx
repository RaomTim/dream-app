'use client';

import React from 'react';
import { Orb, MODES, type ModeKey } from './primitives';
import { useT } from '@/lib/i18n';

export type BottomTab = 'home' | 'journal' | 'capture' | 'echos' | 'figures';

function NavHome({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--fg-mute)'} strokeWidth="1.5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function NavJournal({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--fg-mute)'} strokeWidth="1.5">
      <path d="M4 4h16v16H4z" />
      <path d="M8 8h8M8 12h5" />
    </svg>
  );
}

function NavEchos({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--fg-mute)'} strokeWidth="1.5">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="16" r="3" />
      <path d="M10.5 10.5l3 3" strokeDasharray="2 2" />
    </svg>
  );
}

function NavFigures({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--accent)' : 'var(--fg-mute)'} strokeWidth="1.5">
      <circle cx="12" cy="8" r="2.5" />
      <circle cx="7" cy="16" r="2" />
      <circle cx="17" cy="15" r="2" />
      <path d="M12 10.5v3M9 14.5l-1.5 0M15 13.5l1.5 0" opacity="0.5" />
    </svg>
  );
}

export default function BottomNav({
  current,
  onTab,
}: {
  current: BottomTab;
  onTab: (tab: BottomTab) => void;
}) {
  const { t } = useT();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
      height: 88,
      background: 'linear-gradient(180deg, transparent 0%, var(--bg) 20%, var(--bg) 100%)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
      paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
      borderTop: '1px solid var(--border-hair, var(--border))',
    }}>
      <NavButton active={current === 'home'} onClick={() => onTab('home')} label={t('nav.home')}>
        <NavHome active={current === 'home'} />
      </NavButton>

      <NavButton active={current === 'journal'} onClick={() => onTab('journal')} label={t('nav.journal')}>
        <NavJournal active={current === 'journal'} />
      </NavButton>

      {/* Center orb — capture */}
      <div style={{ marginTop: -30, position: 'relative' }}>
        <Orb
          size={68}
          state="idle"
          onClick={() => onTab('capture')}
        />
      </div>

      <NavButton active={current === 'echos'} onClick={() => onTab('echos')} label={t('nav.echos')}>
        <NavEchos active={current === 'echos'} />
      </NavButton>

      <NavButton active={current === 'figures'} onClick={() => onTab('figures')} label={t('nav.figures')}>
        <NavFigures active={current === 'figures'} />
      </NavButton>
    </nav>
  );
}

function NavButton({
  active, onClick, label, children,
}: {
  active: boolean; onClick: () => void; label: string; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        padding: '6px 12px',
      }}
    >
      {children}
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: active ? 'var(--accent)' : 'var(--fg-mute)',
      }}>
        {label}
      </span>
    </button>
  );
}
