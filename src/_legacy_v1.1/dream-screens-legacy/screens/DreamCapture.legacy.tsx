'use client';

import React, { useState, useRef } from 'react';
import { useT } from '@/lib/i18n';
import { Glyph, SerifHeading, Rule, Orb } from '@/components/dream/ui/primitives';
import { useAuth } from '@/components/AuthProvider';
import { authFetch } from '@/lib/api-client';
import { Surface, HaloRespire } from '@/components/dream-v12';

export type CaptureDestination = 'protocol-dream' | 'protocol-day' | 'oracle' | 'fragment-dream' | 'fragment-day';

export type DreamCaptureProps = {
  onClose?: () => void;
  onFinish?: (transcript: string) => void;
  onDestination?: (dest: CaptureDestination, transcript: string) => void;
  onSwitchMode?: (m: 'write' | 'draw' | 'fragment') => void;
};

export default function DreamCapture({
  onClose,
  onFinish,
  onDestination,
  onSwitchMode,
}: DreamCaptureProps) {
  const { t } = useT();
  const { user } = useAuth();
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [time] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const hasContent = transcript.trim().length > 0;

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
        setShowMenu(true); // Show destination menu after transcription
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

  // Show destination menu when content is available
  if (showMenu && hasContent) {
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
        }}
      >
        {/* Header */}
        <header style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onClose} style={btn}><Glyph size={10}>{t('capture.close')}</Glyph></button>
          <Glyph size={10}>◆ {t('capture.time_label')}</Glyph>
          <button
            onClick={() => handleDestination('fragment-dream')}
            style={btn}
          >
            <Glyph size={10}>{t('capture.finish')}</Glyph>
          </button>
        </header>

        {/* Orb — smaller in menu mode */}
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '32px 0 24px',
        }}>
          <Orb size={140} state="thinking" />
        </div>

        {/* Transcript preview */}
        <div style={{ padding: '0 28px 16px' }}>
          <Glyph size={9} color="var(--accent)">◆ {t('capture.fragment_captured')}</Glyph>
          <div style={{
            marginTop: 8,
            padding: '12px 14px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 2,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 14,
            color: 'var(--fg-dim)',
            lineHeight: 1.5,
            maxHeight: 80,
            overflowY: 'auto',
          }}>
            {transcript}
          </div>
        </div>

        {/* Destination menu */}
        <div style={{ padding: '8px 28px', flex: 1 }}>
          <Glyph size={9} color="var(--fg-mute)" style={{ display: 'block', marginBottom: 12 }}>
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
                  background: 'transparent',
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
                  fontSize: 20,
                  width: 20,
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

        {/* Back to recording */}
        <div style={{ padding: '16px 28px 40px', textAlign: 'center' }}>
          <button
            onClick={() => setShowMenu(false)}
            style={btn}
          >
            <Glyph size={9} color="var(--fg-mute)">{t('capture.back_to_recording')}</Glyph>
          </button>
        </div>
      </div>
    );
  }

  // Default: recording/capture view
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
      {/* Dream V1.2 — gate ember + halo derrière le breath orb */}
      <Surface
        matter="ember"
        motion="flicker"
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.7 }}
      />
      <HaloRespire
        kind="ember"
        style={{ position: 'absolute', inset: '15% 10%', zIndex: 0 }}
      />

      <header style={{ position: 'relative', zIndex: 1, padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={btn}><Glyph size={10}>{t('capture.close')}</Glyph></button>
        <Glyph size={10}>◆ {t('capture.time_label')} · {time}</Glyph>
        <button
          onClick={() => {
            if (hasContent) setShowMenu(true);
            else if (transcript.trim() && onFinish) onFinish(transcript.trim());
          }}
          style={{ ...btn, opacity: hasContent ? 1 : 0.3 }}
        >
          <Glyph size={10}>{t('capture.finish')}</Glyph>
        </button>
      </header>

      <div style={{ position: 'relative', zIndex: 1, padding: '48px 36px 0' }}>
        <Glyph size={9} color="var(--accent)">{t('capture.before_fades')}</Glyph>
        <SerifHeading size={38} italic style={{ marginTop: 20, lineHeight: 1.1, whiteSpace: 'pre-line' }}>
          {t('capture.speak_softly')}
        </SerifHeading>
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic',
          color: 'var(--fg-dim)', marginTop: 18, lineHeight: 1.5, whiteSpace: 'pre-line',
        }}>
          {t('capture.write_tomorrow')}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Transcript — editable */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 36px 30px' }}>
        <Rule accent />
        {editMode || transcript ? (
          <textarea
            ref={textareaRef}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={editMode ? t('capture.write_here') : t('capture.press_orb')}
            rows={editMode ? 8 : 4}
            style={{
              width: '100%', marginTop: 18, padding: 0,
              border: 'none', outline: 'none', background: 'transparent',
              resize: 'none', fontFamily: 'var(--font-serif)',
              fontStyle: 'italic', fontSize: 18, lineHeight: 1.45,
              minHeight: 40, color: 'var(--fg)',
            }}
          />
        ) : (
          <div style={{
            marginTop: 18, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 18, lineHeight: 1.45, minHeight: 40,
          }}>
            {transcribing ? (
              <span style={{ color: 'var(--fg-mute)' }}>{t('capture.transcribing')}</span>
            ) : (
              <span style={{ color: 'var(--fg-mute)', fontSize: 14 }}>
                {recording ? t('capture.listening') : t('capture.press_orb')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Voice orb */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 0 60px', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={toggleRecord}
          disabled={transcribing}
          aria-label={recording ? 'arrêter' : 'enregistrer'}
          style={{
            position: 'relative', width: 132, height: 132,
            display: 'grid', placeItems: 'center',
            background: 'transparent', border: 'none',
            cursor: transcribing ? 'wait' : 'pointer',
            opacity: transcribing ? 0.5 : 1,
          }}
        >
          {[132, 108, 84].map((s, i) => (
            <span key={s} style={{
              position: 'absolute', width: s, height: s, borderRadius: '50%',
              border: `1px solid color-mix(in srgb, var(--accent) ${[15, 30, 45][i]}%, transparent)`,
              animation: recording ? `dreamPulse ${2 + i * 0.4}s ease-in-out ${i * 0.2}s infinite` : 'none',
            }} />
          ))}
          <span style={{
            width: 60, height: 60, borderRadius: '50%',
            background: recording
              ? 'radial-gradient(circle at 30% 30%, #ef4444, #dc2626 55%, #991b1b 100%)'
              : 'radial-gradient(circle at 30% 30%, var(--accent-hi), var(--accent) 55%, var(--structural) 100%)',
            boxShadow: recording
              ? '0 0 40px rgba(239,68,68,0.4), inset 0 0 20px rgba(0,0,0,0.4)'
              : '0 0 40px color-mix(in srgb, var(--accent) 47%, transparent), inset 0 0 20px rgba(0,0,0,0.4)',
          }} />
        </button>
      </div>

      <footer style={{ position: 'relative', zIndex: 1, padding: '0 36px 40px', display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={() => { setEditMode(true); setTimeout(() => textareaRef.current?.focus(), 100); }}
          style={{ ...btn, opacity: editMode ? 0.4 : 1 }}
        >
          <Glyph size={9} color={editMode ? 'var(--accent)' : 'var(--fg-mute)'}>
            {editMode ? t('capture.write_mode') : t('capture.write')}
          </Glyph>
        </button>
        <button onClick={() => { if (hasContent) setShowMenu(true); else onSwitchMode?.('fragment'); }} style={btn}>
          <Glyph size={9} color="var(--fg-mute)">
            {hasContent ? t('capture.choose_destination') : t('capture.fragment')}
          </Glyph>
        </button>
      </footer>
    </div>
  );
}

const btn: React.CSSProperties = { background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' };
