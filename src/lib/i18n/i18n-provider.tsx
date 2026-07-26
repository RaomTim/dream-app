'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import fr from './locales/fr.json';
import en from './locales/en.json';

// ═══════════════════════════════════════════════════════════
// I18N — FR/EN (§12bis.F, validé Tim 2026-07-11)
//
// Le socle V1.x (locales/fr.json + en.json, 323 clés) est CONSERVÉ tel quel :
// il sert encore aux écrans legacy. Le MVP a ses propres namespaces, dans des
// fichiers SÉPARÉS, montés sous 3 clés racines :
//
//   core.*     → src/app/mvp/page.tsx (le tronc)
//   screens.*  → src/components/*.tsx (les écrans)
//   content.*  → guides.ts, infoSheets.ts, appointments.ts (le contenu long)
//
// Pourquoi séparés : un fichier = un propriétaire. Zéro collision de clés,
// zéro conflit d'écriture quand plusieurs agents traduisent en parallèle.
//
// Défaut = langue du téléphone (navigator.language), override persisté dans
// localStorage via Réglages > Langue.
// ═══════════════════════════════════════════════════════════

import coreFr from './mvp/core.fr.json';
import coreEn from './mvp/core.en.json';
import screensFr from './mvp/screens.fr.json';
import screensEn from './mvp/screens.en.json';
import contentFr from './mvp/content.fr.json';
import contentEn from './mvp/content.en.json';

export type Locale = 'fr' | 'en';

const LOCALES: Record<Locale, Record<string, any>> = {
  fr: { ...fr, core: coreFr, screens: screensFr, content: contentFr },
  en: { ...en, core: coreEn, screens: screensEn, content: contentEn },
};

const STORAGE_KEY = 'dream.locale';

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'fr';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'fr' || stored === 'en') return stored;
  const nav = navigator.language?.slice(0, 2);
  return nav === 'en' ? 'en' : 'fr';
}

function getNestedRaw(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}

/** Remplace {{var}} par la valeur fournie. */
function interpolate(str: string, vars?: Record<string, string | number>): string {
  if (!vars) return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{{${k}}}`));
}

/**
 * Clé manquante : repli sur le FR (langue source de la voix), puis la clé nue
 * — visible à l'écran, donc attrapable en relecture. Jamais de crash.
 */
function resolve(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  let val = getNestedRaw(LOCALES[locale], key);
  if (typeof val !== 'string' && locale !== 'fr') val = getNestedRaw(LOCALES.fr, key);
  if (typeof val !== 'string') {
    if (process.env.NODE_ENV !== 'production') console.warn(`[i18n] cle manquante: ${key}`);
    return key;
  }
  return interpolate(val, vars);
}

/**
 * Pluriel. La clé pointe un objet { one, other }. Intl.PluralRules applique la
 * règle de chaque langue (fr : 0 et 1 -> one ; en : 1 -> one).
 */
function resolvePlural(locale: Locale, key: string, n: number, vars?: Record<string, string | number>): string {
  const node = getNestedRaw(LOCALES[locale], key) ?? getNestedRaw(LOCALES.fr, key);
  if (!node || typeof node !== 'object') {
    if (process.env.NODE_ENV !== 'production') console.warn(`[i18n] cle plurielle manquante: ${key}`);
    return key;
  }
  const rule = new Intl.PluralRules(locale).select(n);
  const str = typeof node[rule] === 'string' ? node[rule] : node.other;
  return interpolate(typeof str === 'string' ? str : key, { ...vars, n });
}

type I18nCtx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  tp: (key: string, n: number, vars?: Record<string, string | number>) => string;
  tRaw: (key: string) => any;
};

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // SSR = 'fr' (pas de navigator) ; la vraie langue est posée à l'hydratation.
  const [locale, setLocaleState] = useState<Locale>('fr');

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: string, vars?: Record<string, string | number>) => resolve(locale, key, vars), [locale]);
  const tp = useCallback((key: string, n: number, vars?: Record<string, string | number>) => resolvePlural(locale, key, n, vars), [locale]);
  const tRaw = useCallback((key: string) => getNestedRaw(LOCALES[locale], key) ?? getNestedRaw(LOCALES.fr, key), [locale]);

  const value = useMemo(() => ({ locale, setLocale, t, tp, tRaw }), [locale, setLocale, t, tp, tRaw]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT(): I18nCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useT must be used inside <I18nProvider>');
  return ctx;
}

/** Version sûre hors provider (ErrorBoundary, rendus isolés). */
export function useOptionalT(): I18nCtx {
  const ctx = useContext(Ctx);
  const fallback = useMemo<I18nCtx>(() => ({
    locale: 'fr' as Locale,
    setLocale: () => {},
    t: (key: string, vars?: Record<string, string | number>) => resolve('fr', key, vars),
    tp: (key: string, n: number, vars?: Record<string, string | number>) => resolvePlural('fr', key, n, vars),
    tRaw: (key: string) => getNestedRaw(LOCALES.fr, key),
  }), []);
  return ctx ?? fallback;
}

export function useLocale(): Locale {
  const ctx = useContext(Ctx);
  return ctx?.locale ?? 'fr';
}

/**
 * Langue courante HORS React — pour les appels API : on envoie la langue du
 * rêveur au modèle, qui doit répondre dans cette langue (interprétation,
 * guides, transcription). Sans ça, l'UI serait en anglais et l'IA en français.
 */
export function currentLocale(): Locale {
  return detectLocale();
}
