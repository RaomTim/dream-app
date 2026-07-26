'use client';

import React, { useState } from 'react';
import { useT } from '@/lib/i18n';
import { Glyph, Diamond, MoonSigil } from '@/components/dream/ui/primitives';

export type AnchorScreenProps = {
  fragment?: string;
  onClose?: () => void;
  onHonored?: (note?: string) => void;
};

export default function AnchorScreen({
  fragment,
  onClose,
  onHonored,
}: AnchorScreenProps) {
  const { t } = useT();
  const [state, setState] = useState<'idle' | 'note' | 'honored'>('idle');
  const [note, setNote] = useState('');

  const defaultFragment = "Aujourd'hui, quand tu verras une porte ouverte — passe-la. Le rêve te l'a montrée pour une raison.";
  const frag = fragment || defaultFragment;

  const handleHonor = () => {
    setState('honored');
    onHonored?.();
  };

  const handleNote = () => {
    if (state === 'note') {
      setState('honored');
      onHonored?.(note);
    } else {
      setState('note');
    }
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
        display: 'flex',
        flexDirection: 'column',
        padding: '84px 28px 32px',
        paddingTop: 'calc(env(safe-area-inset-top, 12px) + 72px)',
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top, 12px) + 16px)', right: 24,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--fg-mute)', padding: 6,
          fontFamily: 'var(--font-mono)', fontSize: 14, letterSpacing: 1,
        }}
      >×</button>

      {/* Micro-label */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Glyph size={9} color="var(--fg-mute)">{t('anchor.label')}</Glyph>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 24, height: 1, background: 'var(--border)' }} />
          <Diamond size={5} color="var(--accent)" />
          <span style={{ width: 24, height: 1, background: 'var(--border)' }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 32,
      }}>
        {state === 'honored' ? (
          <div className="screen-enter-fade" style={{ textAlign: 'center' }}>
            <MoonSigil size={40} phase={0.9} />
            <div style={{
              marginTop: 22,
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 22,
              color: 'var(--fg)', lineHeight: 1.3, maxWidth: 280,
            }}>
              {t('anchor.honored_title')}
            </div>
            <Glyph size={9} color="var(--fg-mute)" style={{ marginTop: 18, display: 'block' }}>
              {t('anchor.honored_sub')}
            </Glyph>
          </div>
        ) : (
          <>
            <div style={{
              textAlign: 'center',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 26, lineHeight: 1.35, letterSpacing: -0.3,
              color: 'var(--fg)',
              maxWidth: 320,
            }}>
              {frag}
            </div>

            {state === 'note' && (
              <div className="screen-enter-fade" style={{ width: '100%', maxWidth: 320 }}>
                <Glyph size={9} color="var(--fg-mute)" style={{ marginBottom: 8, display: 'block', textAlign: 'center' }}>
                  {t('anchor.how_manifested')}
                </Glyph>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder={t('anchor.note_placeholder')}
                  autoFocus
                  style={{
                    width: '100%', minHeight: 120,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--fg)',
                    fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
                    lineHeight: 1.5, padding: '14px 16px', borderRadius: 2, resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      {state !== 'honored' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={handleHonor}
            style={{
              width: '100%', padding: '16px',
              background: 'var(--accent)', border: '1px solid var(--accent)',
              color: 'var(--bg)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.8,
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
              fontWeight: 500,
            }}
          >
            {t('anchor.honor_btn')}
          </button>
          <button
            onClick={handleNote}
            style={{
              width: '100%', padding: '16px',
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--fg-dim)',
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.8,
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
            }}
          >
            {state === 'note' ? t('anchor.submit_note') : t('anchor.note_btn')}
          </button>
        </div>
      )}

      {state === 'honored' && (
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '16px',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--fg-dim)',
            fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 1.8,
            textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
          }}
        >
          {t('anchor.back')}
        </button>
      )}
    </div>
  );
}
