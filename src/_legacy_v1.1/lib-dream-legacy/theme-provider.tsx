'use client';

/**
 * Dream Theme Provider
 *
 * Wraps the app and sets [data-theme="night"|"day"] on <html> based on mode.
 * Persists mode to localStorage. Auto-switches on hour crossings.
 */

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { ThemeMode, ResolvedTheme } from './tokens';

type Ctx = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (m: ThemeMode) => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = 'dream.theme.mode';

function resolveTheme(mode: ThemeMode, now: Date, nightStart: number, dayStart: number): ResolvedTheme {
  if (mode === 'night') return 'night';
  if (mode === 'day') return 'day';
  const h = now.getHours();
  // e.g. nightStart=20, dayStart=7 → night if h >= 20 OR h < 7
  return h >= nightStart || h < dayStart ? 'night' : 'day';
}

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';
  const v = window.localStorage.getItem(STORAGE_KEY);
  if (v === 'auto' || v === 'night' || v === 'day') return v;
  return 'auto';
}

export function DreamThemeProvider({
  children,
  defaultMode = 'auto',
  nightStart = 20,
  dayStart = 7,
}: {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  /** Hour (0-23) at which auto-mode flips to night. */
  nightStart?: number;
  /** Hour (0-23) at which auto-mode flips to day. */
  dayStart?: number;
}) {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [now, setNow] = useState<Date>(() => new Date());

  // hydrate from localStorage once mounted
  useEffect(() => {
    const stored = readStoredMode();
    setModeState(stored);
  }, []);

  // re-resolve on the next hour boundary
  useEffect(() => {
    if (mode !== 'auto') return;
    const n = new Date();
    const msToNextHour = (60 - n.getMinutes()) * 60_000 - n.getSeconds() * 1000 + 100;
    const t = setTimeout(() => setNow(new Date()), msToNextHour);
    return () => clearTimeout(t);
  }, [mode, now]);

  // also re-resolve on tab visibility (user opens app at 9am after leaving at 11pm)
  useEffect(() => {
    const onVis = () => { if (document.visibilityState === 'visible') setNow(new Date()); };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const resolved = useMemo(
    () => resolveTheme(mode, now, nightStart, dayStart),
    [mode, now, nightStart, dayStart],
  );

  // apply to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolved);
  }, [resolved]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { window.localStorage.setItem(STORAGE_KEY, m); } catch {}
    if (m !== 'auto') setNow(new Date()); // force re-eval
  }, []);

  const value = useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useDreamTheme(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useDreamTheme must be used inside <DreamThemeProvider>');
  return ctx;
}
