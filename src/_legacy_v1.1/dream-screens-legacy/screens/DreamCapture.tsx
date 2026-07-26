'use client';

/**
 * DreamCapture — V1.2 AMPLIFIED REFOUND (2026-04-25)
 *
 * Refonte massive depuis screens-v12-amplified.jsx (CaptureV12).
 * Visuellement :
 *   - PHASE GATE somatic (3 respirations) : Surface ember + halo ember + breath circle
 *   - PHASE FIELD : Surface ember (atténuée) + textarea EB Garamond italic 25px
 *     + bouton micro PROÉMINENT 56px central-droite avec halo ember
 *   - PHASE POST : Surface silk + propose la destination du kairos
 *
 * Logique préservée :
 *   - enregistrement audio (MediaRecorder)
 *   - transcription Whisper
 *   - destinations (protocol-dream, protocol-day, oracle, fragment-*)
 *   - callbacks onClose, onFinish, onDestination, onSwitchMode
 */

import React, { useState, useRef, useEffect } from 'react';
import { useT } from '@/lib/i18n';
import { Glyph } from '@/components/dream/ui/primitives';
import { useAuth } from '@/components/AuthProvider';
import { authFetch } from '@/lib/api-client';
import { Surface, HaloRespire, playRitual } from '@/components/dream-v12';

export type CaptureDestination = 'protocol-dream' | 'protocol-day' | 'oracle' | 'fragment-dream' | 'fragment-day';

export type DreamCaptureProps = {
  onClose?: () => void;
  onFinish?: (transcript: string) => void;
  onDestination?: (dest: CaptureDestination, transcript: string) => void;
  onSwitchMode?: (m: 'write' | 'draw' | 'fragment') => void;
};

type Phase = 'gate' | 'field' | 'post';

export default function DreamCapture({
  onClose,
  onFinish,
  onDestination,
  onSwitchMode,
}: DreamCaptureProps) {
  const { t } = useT();
  const { user } = useAuth();
  const [phase, setPhase] = useState<Phase>('gate');
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasContent = transcript.trim().length > 0;

  useEffect(() => {
    if (phase === 'field' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [phase]);

  const enterGate = () => {
    try { playRitual('souffle'); } catch {}
    setPhase('field');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 16000 },
      });

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        await transcribeAudio(audioBlob, mimeType);
      };

      mediaRecorder.start(1000);
      setRecording(true);
    } catch (error) {
      console.error('Erreur accès micro:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob, mimeType: string) => {
    setTranscribing(true);
    try {
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const formData = new FormData();
      formData.append('audio', audioBlob, `dream-recording.${ext}`);
      if (user?.id) formData.append('userId', user.id);

      const res = await authFetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.text) {
        setTranscript((prev) => (prev ? prev + ' ' + data.text : data.text));
      }
    } catch (error) {
      console.error('Erreur transcription:', error);
    } finally {
      setTranscribing(false);
    }
  };

  const toggleRecord = () => {
    if (recording) stopRecording();
    else startRecording();
  };

  const garder = () => {
    if (!hasContent) return;
    try { playRitual('ceremoniel'); } catch {}
    setPhase('post');
  };

  const handleDestination = (dest: CaptureDestination) => {
    const text = transcript.trim();
    if (!text) return;
    if (onDestination) {
      onDestination(dest, text);
    } else if (dest === 'protocol-dream' && onFinish) {
      onFinish(text);
    }
  };

  const DESTINATIONS: { key: CaptureDestination; glyph: string; label: string; hint: string; accent: string }[] = [
    { key: 'protocol-dream', glyph: '☽', label: t('capture.dest_protocol'), hint: t('capture.dest_protocol_hint'), accent: 'var(--mode-reve-accent)' },
    { key: 'fragment-dream', glyph: '☽', label: t('capture.dest_fragment_dream'), hint: t('capture.dest_fragment_dream_hint'), accent: 'var(--mode-reve-accent)' },
    { key: 'protocol-day', glyph: '☉', label: t('capture.dest_day'), hint: t('capture.dest_day_hint'), accent: 'var(--mode-jour-accent)' },
    { key: 'fragment-day', glyph: '☉', label: t('capture.dest_fragment_day'), hint: t('capture.dest_fragment_day_hint'), accent: 'var(--mode-jour-accent)' },
    { key: 'oracle', glyph: '✧', label: t('capture.dest_oracle'), hint: t('capture.dest_oracle_hint'), accent: 'var(--mode-oracle-accent)' },
  ];

  // ════════════════════════════════════════════════════════════
  // PHASE GATE — somatic, 3 respirations
  // ════════════════════════════════════════════════════════════
  if (phase === 'gate') {
    return (
      <div
        className="grain"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          background: 'var(--bg-wash)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-serif)',
          paddingTop: 'env(safe-area-inset-top, 54px)',
          overflow: 'hidden',
        }}
      >
        {/* Surface ember + flicker (visible) */}
        <Surface
          matter="ember"
          motion="flicker"
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
        />

        <header style={{ position: 'relative', zIndex: 2, padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={btn}><Glyph size={10}>{t('capture.close')}</Glyph></button>
          <Glyph size={10}>◆ seuil</Glyph>
          <div style={{ width: 60 }} />
        </header>

        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: 'calc(100dvh - 100px)',
          padding: '0 28px',
        }}>
          {/* Cercle respiration + halo ember */}
          <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 36 }}>
            <HaloRespire kind="ember" style={{ position: 'absolute', inset: '-25%', width: '150%', height: '150%' }} />
            <div style={{
              position: 'absolute', inset: '25%',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, color-mix(in oklch, var(--v12-ember-live) 70%, transparent), color-mix(in oklch, var(--v12-ember-live) 30%, transparent) 60%, transparent 80%)',
              border: '1px solid color-mix(in oklch, var(--v12-ember-live) 50%, transparent)',
              animation: 'breath 5s var(--ease-respire-v12) infinite',
            }} />
          </div>

          <p style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 22, lineHeight: 1.4, color: 'var(--fg)',
            textAlign: 'center', maxWidth: 380, margin: 0,
          }}>
            Trois respirations. Sens tes pieds. Tu es là.
          </p>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <button
              onClick={enterGate}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2,
                textTransform: 'uppercase' as const,
                color: 'var(--accent)',
                background: 'transparent',
                border: '1px solid var(--accent)',
                borderRadius: 2,
                padding: '12px 28px', cursor: 'pointer',
              }}
            >
              entrer
            </button>
            <button
              onClick={() => setPhase('field')}
              style={{
                background: 'transparent', border: 'none',
                fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
                color: 'var(--fg-mute)', cursor: 'pointer', opacity: 0.7,
              }}
            >
              passer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // PHASE POST — choisir destination
  // ════════════════════════════════════════════════════════════
  if (phase === 'post' && hasContent) {
    return (
      <div
        className="grain"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          background: 'var(--bg-wash)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-serif)',
          paddingTop: 'env(safe-area-inset-top, 54px)',
          overflow: 'hidden',
        }}
      >
        {/* Surface silk — célébration */}
        <Surface
          matter="silk"
          motion={true}
          style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}
        />
        <HaloRespire kind="silk" style={{ position: 'absolute', inset: '15% 5%', zIndex: 0 }} />

        <header style={{ position: 'relative', zIndex: 2, padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={btn}><Glyph size={10}>{t('capture.close')}</Glyph></button>
          <Glyph size={10}>◆ kairos déposé</Glyph>
          <div style={{ width: 60 }} />
        </header>

        <div style={{ position: 'relative', zIndex: 2, padding: '40px 28px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 28, lineHeight: 1.2, color: 'var(--fg)',
            textAlign: 'center', marginBottom: 12,
          }}>
            Ton kairos est arrivé.
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 15, color: 'var(--fg-dim)',
            textAlign: 'center', marginBottom: 24, maxWidth: 380, margin: '0 auto 24px',
          }}>
            Il dort 24h avant que les échos ne murmurent.
          </div>
        </div>

        {/* Transcript preview */}
        <div style={{ position: 'relative', zIndex: 2, padding: '0 28px 16px' }}>
          <div style={{
            padding: '14px 16px',
            background: 'color-mix(in oklch, var(--bg-card) 80%, transparent)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
            border: '1px solid var(--border)',
            borderRadius: 2,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            color: 'var(--fg-dim)',
            lineHeight: 1.55,
            maxHeight: 100,
            overflowY: 'auto',
          }}>
            {transcript}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '8px 28px' }}>
          <Glyph size={9} color="var(--fg-mute)" style={{ display: 'block', marginBottom: 12, textAlign: 'center' }}>
            {t('capture.where_deposit')}
          </Glyph>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DESTINATIONS.map(d => (
              <button
                key={d.key}
                onClick={() => handleDestination(d.key)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'color-mix(in oklch, var(--bg-card) 70%, transparent)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  border: '1px solid var(--border)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  color: 'inherit',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <span style={{
                  color: d.accent,
                  fontFamily: 'var(--font-serif)',
                  fontSize: 22,
                  width: 24,
                  textAlign: 'center',
                  flexShrink: 0,
                }}>{d.glyph}</span>
                <div style={{ flex: 1 }}>
                  <Glyph size={10} color="var(--fg)" style={{ display: 'block', fontWeight: 500 }}>
                    {d.label}
                  </Glyph>
                  <span style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: 12,
                    color: 'var(--fg-mute)',
                    display: 'block',
                    marginTop: 3,
                  }}>{d.hint}</span>
                </div>
                <span style={{
                  color: 'var(--fg-mute)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                }}>→</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, padding: '16px 28px 40px', textAlign: 'center' }}>
          <button
            onClick={() => setPhase('field')}
            style={btn}
          >
            <Glyph size={9} color="var(--fg-mute)">{t('capture.back_to_recording')}</Glyph>
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════
  // PHASE FIELD — capture textuelle / vocale
  // ════════════════════════════════════════════════════════════
  return (
    <div
      className="grain"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--bg-wash)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-serif)',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'env(safe-area-inset-top, 54px)',
        overflow: 'hidden',
      }}
    >
      {/* Surface ember atténuée */}
      <Surface
        matter="ember"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.55 }}
      />

      <header style={{ position: 'relative', zIndex: 2, padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={btn}><Glyph size={10}>× {t('capture.close')}</Glyph></button>
        <Glyph size={10}>◆ {t('capture.time_label')}</Glyph>
        <div style={{ width: 60 }} />
      </header>

      <div style={{ position: 'relative', zIndex: 2, padding: '32px 28px 16px' }}>
        <div style={{
          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 11,
          color: 'var(--fg-mute)', letterSpacing: 0.3, marginBottom: 8,
        }}>
          ce qui est venu…
        </div>
      </div>

      {/* Textarea grand format EB Garamond italic 25px */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, padding: '0 28px' }}>
        <textarea
          ref={textareaRef}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={transcribing ? t('capture.transcribing') : t('capture.press_orb')}
          rows={14}
          style={{
            width: '100%', padding: 0, border: 'none', outline: 'none',
            background: 'transparent', resize: 'none',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 25, lineHeight: 1.45,
            minHeight: 240, color: 'var(--fg)',
          }}
        />
      </div>

      {/* Footer — voix counter + boutons */}
      <div style={{
        position: 'relative', zIndex: 2,
        padding: '16px 28px env(safe-area-inset-bottom, 32px)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        gap: 16,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: 1,
          color: 'var(--fg-mute)', opacity: 0.7, paddingBottom: 8,
        }}>
          voix · {transcript.length} caractères
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {/* Garder */}
          <button
            onClick={garder}
            disabled={!hasContent}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2,
              textTransform: 'uppercase' as const,
              color: hasContent ? 'var(--accent)' : 'var(--fg-mute)',
              background: 'transparent',
              border: `1px solid ${hasContent ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 2,
              padding: '12px 20px',
              cursor: hasContent ? 'pointer' : 'not-allowed',
              opacity: hasContent ? 1 : 0.4,
            }}
          >
            garder
          </button>

          {/* Bouton micro PROÉMINENT 56px + halo ember */}
          <div style={{ position: 'relative', width: 56, height: 56 }}>
            <div style={{
              position: 'absolute', inset: '-30%', pointerEvents: 'none',
              opacity: recording ? 1 : 0.6,
            }}>
              <HaloRespire kind="ember" style={{ width: '100%', height: '100%' }} />
            </div>
            <button
              onClick={toggleRecord}
              disabled={transcribing}
              aria-label={recording ? 'arrêter' : 'enregistrer'}
              style={{
                position: 'relative', zIndex: 1,
                width: 56, height: 56, borderRadius: '50%',
                background: recording
                  ? 'radial-gradient(circle at 35% 32%, #ef4444, #dc2626 55%, #991b1b 100%)'
                  : 'radial-gradient(circle at 35% 32%, color-mix(in oklch, var(--v12-ember-live) 80%, white), var(--v12-ember-live) 55%, color-mix(in oklch, var(--v12-ember-live) 60%, black) 100%)',
                border: 'none',
                boxShadow: recording
                  ? '0 0 32px rgba(239,68,68,0.6), inset 0 0 14px rgba(0,0,0,0.4)'
                  : '0 0 28px color-mix(in oklch, var(--v12-ember-live) 50%, transparent), inset 0 0 12px rgba(0,0,0,0.35)',
                cursor: transcribing ? 'wait' : 'pointer',
                opacity: transcribing ? 0.5 : 1,
                display: 'grid', placeItems: 'center',
                animation: recording ? 'dreamPulseRec 1.8s ease-in-out infinite' : 'none',
              }}
            >
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="rgba(8,8,11,0.78)" strokeWidth="1.6" strokeLinecap="round">
                <rect x="9" y="3" width="6" height="12" rx="3" />
                <path d="M5 11 Q5 18 12 18 Q19 18 19 11" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' };
