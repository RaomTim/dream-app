'use client';

import React, { useEffect, useState } from 'react';
import { Orb, SerifHeading, BtnGhost, Glyph } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { Surface, HaloRespire, GeoSymbol, wowRegistry, playRitual } from '@/components/dream-v12';

const orbStates = ['idle', 'recording', 'thinking'] as const;

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const { t, tRaw } = useT();
  const [step, setStep] = useState(0);

  const screens = (tRaw('onboarding.screens') as Array<{ title: string; body: string }>) || [];
  const isLast = step === screens.length - 1;

  // Dream V1.2 — Wow0: first-launch (premier accès Onboarding)
  useEffect(() => {
    if (wowRegistry.fire('first-launch')) {
      playRitual('souffle')
    }
  }, []);

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Dream V1.2 — Surface ember PLEINE puissance + halo silk respirant centre + spirale silk bas visible */}
      <Surface matter="ember" motion="flicker" style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
      <HaloRespire kind="silk" style={{ position: 'absolute', inset: '15% 5%', zIndex: 0 }} />
      <div style={{
        position: 'absolute', bottom: '2%', left: '50%',
        transform: 'translateX(-50%)',
        width: 380, height: 380, opacity: 0.25, pointerEvents: 'none', zIndex: 0,
      }}>
        <GeoSymbol kind="spirale" color="silk" />
      </div>

      <div style={{ marginBottom: 48, position: 'relative', zIndex: 2 }}>
        <Orb size={120} state={orbStates[step]} />
      </div>

      <SerifHeading size={32} style={{ whiteSpace: 'pre-line', marginBottom: 20, position: 'relative', zIndex: 2 }}>
        {screens[step]?.title}
      </SerifHeading>

      <div style={{
        fontFamily: 'var(--font-serif)', fontSize: 15, fontStyle: 'italic',
        color: 'var(--fg-mute)', lineHeight: 1.6, whiteSpace: 'pre-line',
        maxWidth: 300,
        position: 'relative', zIndex: 2,
      }}>
        {screens[step]?.body}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 40, position: 'relative', zIndex: 2 }}>
        {screens.map((_, i) => (
          <div key={i} style={{
            width: i === step ? 20 : 6, height: 6, borderRadius: 'var(--r-full)',
            background: i === step ? 'var(--accent)' : 'var(--border)',
            transition: 'all 200ms ease',
          }} />
        ))}
      </div>

      <div style={{ marginTop: 40, position: 'relative', zIndex: 2 }}>
        <BtnGhost
          onClick={() => {
            if (isLast) {
              try { localStorage.setItem('dream.onboarding.done', '1'); } catch {}
              onDone();
            } else {
              setStep(s => s + 1);
            }
          }}
        >
          {isLast ? t('onboarding.start') : t('onboarding.next')}
        </BtnGhost>
      </div>

      {!isLast && (
        <button
          onClick={() => {
            try { localStorage.setItem('dream.onboarding.done', '1'); } catch {}
            onDone();
          }}
          style={{
            marginTop: 16, background: 'transparent', border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1.5,
            color: 'var(--fg-mute)', textTransform: 'uppercase',
            position: 'relative', zIndex: 2,
          }}
        >
          {t('onboarding.skip')}
        </button>
      )}
    </div>
  );
}
