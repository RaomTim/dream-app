'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';
import { useT, useLocale } from '@/lib/i18n';
import { authFetch } from '@/lib/api-client';
import { streamSSE } from '@/lib/sse-client';

/**
 * ProtocolGuide — Composant générique pour tous les protocoles guidés
 * Utilisé pour : réception de rêve (9 étapes), journal de jour (5), rituel pré-sommeil (5)
 */

export type ProtocolStep = {
  name: string;
  hint: string;
  question: string;
  /** English overrides for bilingual support */
  en?: {
    name: string;
    hint: string;
    question: string;
  };
  /** Si true, l'IA répond mais on ne passe pas auto — l'utilisateur décide */
  pauseAfterAI?: boolean;
  /** Durée d'affichage de l'insight IA avant passage auto (ms). Défaut 3500 */
  insightDuration?: number;
  /** Si true, la réponse de l'user est le titre du rêve — sauvé en DB */
  isTitle?: boolean;
};

export type ProtocolConfig = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  steps: ProtocolStep[];
  /** English overrides for bilingual support */
  en?: {
    title: string;
    subtitle: string;
    finalCTA: string;
    placeholder: string;
    footerHint: string;
  };
  /** Mode AI à envoyer à /api/chat */
  aiMode: string;
  /** Texte du bouton final */
  finalCTA: string;
  /** Placeholder du textarea */
  placeholder: string;
  /** Message footer pendant la saisie */
  footerHint: string;
  /** entry_type pour la DB */
  entryType: string;
};

export type ProtocolGuideProps = {
  config: ProtocolConfig;
  /** Texte initial (ex: transcription vocale pour un rêve) */
  initialText?: string;
  userId?: string;
  onComplete?: (data: {
    entryType: string;
    initialText?: string;
    answers: string[];
    aiResponses: string[];
    entryId?: string;
  }) => void;
  onClose?: () => void;
};

export default function ProtocolGuide({
  config,
  initialText,
  userId,
  onComplete,
  onClose,
}: ProtocolGuideProps) {
  const { t } = useT();
  const locale = useLocale();

  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [showingInsight, setShowingInsight] = useState(false);

  // Voice recording state
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const transcribeAudio = useCallback(async (audioBlob: Blob, mimeType: string) => {
    setTranscribing(true);
    try {
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
      const formData = new FormData();
      formData.append('audio', audioBlob, `dream-recording.${ext}`);
      if (userId) formData.append('userId', userId);
      const res = await authFetch('/api/transcribe', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.text) {
        setAnswer((prev) => (prev ? prev + ' ' + data.text : data.text));
      }
    } catch (error) {
      console.error('Erreur transcription:', error);
    } finally {
      setTranscribing(false);
    }
  }, [userId]);

  const startRecording = useCallback(async () => {
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
  }, [transcribeAudio]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  }, []);

  const toggleRecord = useCallback(() => {
    if (recording) stopRecording();
    else startRecording();
  }, [recording, startRecording, stopRecording]);

  const totalSteps = config.steps.length;
  const currentStep = config.steps[step];

  // Locale-aware getters for current step
  const stepName = locale === 'en' && currentStep.en?.name ? currentStep.en.name : currentStep.name;
  const stepHint = locale === 'en' && currentStep.en?.hint ? currentStep.en.hint : currentStep.hint;
  const stepQuestion = locale === 'en' && currentStep.en?.question ? currentStep.en.question : currentStep.question;

  // Locale-aware getters for config
  const configTitle = locale === 'en' && config.en?.title ? config.en.title : config.title;
  const configSubtitle = locale === 'en' && config.en?.subtitle ? config.en.subtitle : config.subtitle;
  const configFinalCTA = locale === 'en' && config.en?.finalCTA ? config.en.finalCTA : config.finalCTA;
  const configPlaceholder = locale === 'en' && config.en?.placeholder ? config.en.placeholder : config.placeholder;
  const configFooterHint = locale === 'en' && config.en?.footerHint ? config.en.footerHint : config.footerHint;

  // Create entry on mount (if there's initial text — dream/day)
  useEffect(() => {
    if (!initialText && config.entryType !== 'dream') return;
    const createEntry = async () => {
      try {
        const res = await fetch('/api/dreams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raw_text: initialText || `[${configTitle}] — en cours`,
            source: initialText ? 'voice' : 'text',
            entry_type: config.entryType,
            user_id: userId,
          }),
        });
        const data = await res.json();
        if (data.dream) setEntryId(data.dream.id);
      } catch (e) {
        console.error('Erreur création entrée:', e);
      }
    };
    createEntry();
  }, [initialText, userId, config.entryType, configTitle]);

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;

    const currentAnswer = answer.trim();
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setAnswer('');
    setLoading(true);
    setAiInsight(null);

    // If this step is marked as title, save it to DB immediately
    if (currentStep.isTitle && entryId) {
      try {
        await fetch(`/api/dreams/${entryId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: currentAnswer }),
        });
      } catch (e) {
        console.error('Failed to save title:', e);
      }
    }

    try {
      const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

      // Context initial
      if (initialText) {
        messages.push({
          role: 'user',
          content: `[${configTitle.toUpperCase()} DÉPOSÉ]\n${initialText}`,
        });
      }

      // Historique des étapes précédentes
      for (let i = 0; i < newAnswers.length; i++) {
        const stepConfig = config.steps[i];
        const sName = locale === 'en' && stepConfig.en?.name ? stepConfig.en.name : stepConfig.name;
        messages.push({
          role: 'user',
          content: `[${t('protocol.step_of').replace('{current}', String(i + 1)).replace('{total}', String(totalSteps))}: ${sName}]\n${newAnswers[i]}`,
        });
        if (aiResponses[i]) {
          messages.push({
            role: 'assistant',
            content: aiResponses[i],
          });
        }
      }

      let aiText = '';
      for await (const event of streamSSE('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          dreamId: entryId,
          mode: config.aiMode,
          isFirstEntry: step === 0,
          userId,
          guidedStep: step + 1,
          protocolId: config.id,
          locale,
        }),
      })) {
        if (event.type === 'chunk') {
          aiText += event.content;
        } else if (event.type === 'error') {
          aiText = event.message || '';
          break;
        }
        // 'done': no client action needed
      }
      const newAiResponses = [...aiResponses, aiText];
      setAiResponses(newAiResponses);

      if (step < totalSteps - 1) {
        // Show AI insight, then advance
        setAiInsight(aiText);
        setShowingInsight(true);
        const duration = currentStep.insightDuration || 3500;
        setTimeout(() => {
          setStep(step + 1);
          setAiInsight(null);
          setShowingInsight(false);
        }, duration);
      } else {
        // Final step — show closing, then complete
        setAiInsight(aiText);
        setShowingInsight(true);
        setTimeout(() => {
          onComplete?.({
            entryType: config.entryType,
            initialText,
            answers: newAnswers,
            aiResponses: newAiResponses,
            entryId: entryId || undefined,
          });
        }, 4500);
      }
    } catch (error) {
      console.error('Erreur protocole guidé:', error);
      // Still advance on error
      if (step < totalSteps - 1) {
        setStep(step + 1);
      }
    } finally {
      setLoading(false);
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
        paddingTop: 54,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={btn}><Glyph size={10}>{t('protocol.close')}</Glyph></button>
        <Glyph size={10}>{config.icon} {config.id}</Glyph>
        <div style={{ width: 60 }} />
      </header>

      {/* Subtitle / Context */}
      <div style={{ padding: '20px 28px 0' }}>
        <Glyph size={9} color="var(--fg-mute)">{configSubtitle}</Glyph>
        {initialText && (
          <SerifHeading size={15} italic color="var(--fg-dim)" style={{ marginTop: 6 }}>
            {initialText.substring(0, 80) + (initialText.length > 80 ? '...' : '')}
          </SerifHeading>
        )}
      </div>

      {/* Step progress */}
      <div style={{ padding: '28px 28px 0' }}>
        <Glyph size={9} color="var(--accent)">
          {t('protocol.step_of').replace('{current}', String(step + 1)).replace('{total}', String(totalSteps))} · {stepName}
        </Glyph>
        <div style={{ marginTop: 14, display: 'flex', gap: 4 }}>
          {config.steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 2,
                background: i <= step ? 'var(--accent)' : 'var(--border)',
                opacity: i === step ? 1 : i < step ? 0.6 : 0.3,
                transition: 'all 600ms ease',
              }}
            />
          ))}
        </div>
        <div style={{
          marginTop: 10,
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 13,
          color: 'var(--fg-mute)',
        }}>
          {stepHint}
        </div>
      </div>

      {/* AI insight (shown after user answers) */}
      {aiInsight && (
        <div className="animate-fade-in" style={{ padding: '24px 36px 0' }}>
          <div style={{
            borderLeft: '2px solid var(--accent)',
            paddingLeft: 16,
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.55,
            color: 'var(--fg-dim)',
          }}>
            {aiInsight}
          </div>
        </div>
      )}

      {/* Question */}
      {!showingInsight && (
        <div style={{ padding: '40px 36px 0' }}>
          <Diamond size={6} />
          <SerifHeading size={26} italic style={{ marginTop: 18, whiteSpace: 'pre-line', lineHeight: 1.18 }}>
            {stepQuestion}
          </SerifHeading>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Answer field + mini voice orb */}
      {!showingInsight && (
        <div style={{ padding: '0 36px 24px' }}>
          <Rule />
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', marginTop: 18 }}>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={transcribing ? t('capture.transcribing') : recording ? t('capture.listening') : configPlaceholder}
              rows={4}
              style={{
                flex: 1,
                padding: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                resize: 'none',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 18,
                lineHeight: 1.55,
                color: 'var(--fg)',
              }}
            />
            {/* Mini voice orb */}
            <button
              onClick={toggleRecord}
              disabled={transcribing}
              aria-label={recording ? (locale === 'en' ? 'stop recording' : 'arrêter l\'enregistrement') : (locale === 'en' ? 'record by voice' : 'enregistrer par la voix')}
              style={{
                position: 'relative',
                width: 48,
                height: 48,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                border: 'none',
                cursor: transcribing ? 'wait' : 'pointer',
                opacity: transcribing ? 0.5 : 1,
                marginBottom: 4,
              }}
            >
              {/* Pulse rings */}
              {[48, 40].map((s, i) => (
                <span key={s} style={{
                  position: 'absolute',
                  width: s,
                  height: s,
                  borderRadius: '50%',
                  border: `1px solid color-mix(in srgb, var(--accent) ${[15, 30][i]}%, transparent)`,
                  animation: recording ? `dreamPulse ${1.8 + i * 0.3}s ease-in-out ${i * 0.15}s infinite` : 'none',
                }} />
              ))}
              {/* Core orb */}
              <span style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: recording
                  ? 'radial-gradient(circle at 30% 30%, #ef4444, #dc2626 55%, #991b1b 100%)'
                  : 'radial-gradient(circle at 30% 30%, var(--accent-hi), var(--accent) 55%, var(--structural) 100%)',
                boxShadow: recording
                  ? '0 0 20px rgba(239,68,68,0.4), inset 0 0 10px rgba(0,0,0,0.4)'
                  : '0 0 20px color-mix(in srgb, var(--accent) 30%, transparent), inset 0 0 10px rgba(0,0,0,0.4)',
                transition: 'all 300ms ease',
              }} />
            </button>
          </div>
          {/* Voice status */}
          {(recording || transcribing) && (
            <div style={{
              marginTop: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: 1,
              textTransform: 'uppercase' as const,
              color: recording ? '#ef4444' : 'var(--accent)',
              opacity: 0.8,
            }}>
              {recording ? t('protocol.recording') : t('capture.transcribing')}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '0 28px 34px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Glyph size={9} color="var(--fg-mute)">
          {loading
            ? t('thinking.phrases.0')
            : showingInsight
            ? step < totalSteps - 1
              ? t('protocol.moving_next')
              : t('protocol.closing')
            : configFooterHint}
        </Glyph>
        {!showingInsight && (
          <button
            onClick={submitAnswer}
            disabled={!answer.trim() || loading}
            style={{
              background: 'transparent',
              border: answer.trim() && !loading ? '1px solid var(--accent)' : '1px solid var(--border)',
              padding: '10px 18px',
              cursor: answer.trim() && !loading ? 'pointer' : 'not-allowed',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: answer.trim() && !loading ? 1 : 0.3,
            }}
          >
            <Glyph size={9} color="var(--accent)">
              {step === totalSteps - 1 ? configFinalCTA : t('protocol.next')}
            </Glyph>
            <Diamond size={6} />
          </button>
        )}
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};
