'use client';

import React, { useState, useEffect } from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';
import { streamSSE } from '@/lib/sse-client';

/**
 * Guided "If It Were My Dream" protocol
 * 4 thresholds, AI-powered questions at each step.
 * After step 4, calls onComplete with all data.
 */

type Step = 1 | 2 | 3 | 4;

const THRESHOLDS: Array<{ n: Step; name: string; hint: string; defaultQuestion: string }> = [
  {
    n: 1,
    name: 'décris',
    hint: 'les images, sans y chercher de sens',
    defaultQuestion: "Ferme les yeux. Revois le rêve.\nQu'est-ce qui apparaît d'abord ?",
  },
  {
    n: 2,
    name: 'ressens',
    hint: 'le corps avant la pensée',
    defaultQuestion: "Où dans ton corps\nse loge ce rêve ?",
  },
  {
    n: 3,
    name: "s'il était mien",
    hint: 'projection socratique, sans autorité',
    defaultQuestion: "Si ce rêve était le mien,\nqu'est-ce qu'il essaierait de me dire ?",
  },
  {
    n: 4,
    name: 'garde',
    hint: 'un fragment à emporter dans le jour',
    defaultQuestion: "De tout ça, qu'est-ce que\ntu veux garder pour aujourd'hui ?",
  },
];

export type GuidedDialogueProps = {
  dreamText: string;
  dreamTitle?: string;
  userId?: string;
  onComplete?: (data: {
    dreamText: string;
    answers: string[];
    aiResponses: string[];
  }) => void;
  onClose?: () => void;
};

export default function GuidedDialogue({
  dreamText,
  dreamTitle,
  userId,
  onComplete,
  onClose,
}: GuidedDialogueProps) {
  const [step, setStep] = useState<Step>(1);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [aiResponses, setAiResponses] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(THRESHOLDS[0].defaultQuestion);
  const [loading, setLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);

  // Create the dream entry on mount
  useEffect(() => {
    const createEntry = async () => {
      try {
        const res = await fetch('/api/dreams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raw_text: dreamText,
            source: 'voice',
            entry_type: 'dream',
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
  }, [dreamText, userId]);

  const threshold = THRESHOLDS[step - 1];

  const submitAnswer = async () => {
    if (!answer.trim() || loading) return;

    const currentAnswer = answer.trim();
    const newAnswers = [...answers, currentAnswer];
    setAnswers(newAnswers);
    setAnswer('');
    setLoading(true);
    setAiInsight(null);

    try {
      // Build the conversation so far for the AI
      const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
        { role: 'user', content: `[RÊVE DÉPOSÉ]\n${dreamText}` },
      ];

      // Add previous steps
      for (let i = 0; i < newAnswers.length; i++) {
        const stepName = THRESHOLDS[i].name;
        messages.push({
          role: 'user',
          content: `[Seuil ${i + 1}: ${stepName}]\n${newAnswers[i]}`,
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
          mode: 'dream',
          isFirstEntry: false,
          userId,
          guidedStep: step,
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

      if (step < 4) {
        // Show AI insight briefly, then move to next step
        setAiInsight(aiText);
        setTimeout(() => {
          setStep((step + 1) as Step);
          setCurrentQuestion(THRESHOLDS[step].defaultQuestion); // step is 0-indexed here after +1
          setAiInsight(null);
        }, 3000);
      } else {
        // Final step — show AI's closing reflection, then complete
        setAiInsight(aiText);
        setTimeout(() => {
          onComplete?.({
            dreamText,
            answers: newAnswers,
            aiResponses: newAiResponses,
          });
        }, 4000);
      }
    } catch (error) {
      console.error('Erreur dialogue guidé:', error);
      // Still advance on error
      if (step < 4) {
        setStep((step + 1) as Step);
        setCurrentQuestion(THRESHOLDS[step].defaultQuestion);
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
      <header style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={btn}><Glyph size={10}>× fermer</Glyph></button>
        <Glyph size={10}>dialogue</Glyph>
        <div style={{ width: 60 }} />
      </header>

      {/* Dream reference */}
      <div style={{ padding: '28px 28px 0' }}>
        <Glyph size={9} color="var(--fg-mute)">rêve déposé</Glyph>
        <SerifHeading size={18} italic color="var(--fg-dim)" style={{ marginTop: 6 }}>
          {dreamTitle || dreamText.substring(0, 60) + (dreamText.length > 60 ? '...' : '')}
        </SerifHeading>
      </div>

      {/* Threshold progress */}
      <div style={{ padding: '36px 28px 0' }}>
        <Glyph size={9} color="var(--accent)">SEUIL {step} / 4 · {threshold.name}</Glyph>
        <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
          {THRESHOLDS.map((t) => (
            <div
              key={t.n}
              style={{
                flex: 1, height: 2,
                background: t.n <= step ? 'var(--accent)' : 'var(--border)',
                opacity: t.n === step ? 1 : (t.n < step ? 0.6 : 1),
                transition: 'all 600ms ease',
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--fg-mute)' }}>
          {threshold.hint}
        </div>
      </div>

      {/* AI insight (shown after user answers) */}
      {aiInsight && (
        <div className="animate-fade-in" style={{ padding: '24px 36px 0' }}>
          <div style={{
            borderLeft: '2px solid var(--accent)', paddingLeft: 16,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 15, lineHeight: 1.5, color: 'var(--fg-dim)',
          }}>
            {aiInsight}
          </div>
        </div>
      )}

      {/* Question */}
      {!aiInsight && (
        <div style={{ padding: '52px 36px 0' }}>
          <Diamond size={6} />
          <SerifHeading size={28} italic style={{ marginTop: 22, whiteSpace: 'pre-line', lineHeight: 1.18 }}>
            {currentQuestion}
          </SerifHeading>
        </div>
      )}

      <div style={{ flex: 1 }} />

      {/* Answer field */}
      {!aiInsight && (
        <div style={{ padding: '0 36px 24px' }}>
          <Rule />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="écris au fil, sans corriger..."
            rows={4}
            style={{
              width: '100%', marginTop: 18, padding: 0, border: 'none', outline: 'none',
              background: 'transparent', resize: 'none',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 18, lineHeight: 1.55, color: 'var(--fg)',
            }}
          />
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '0 28px 34px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Glyph size={9} color="var(--fg-mute)">
          {loading ? 'l\'oracle réfléchit...' : aiInsight ? 'passage au seuil suivant...' : 'sans jugement, sans fin'}
        </Glyph>
        {!aiInsight && (
          <button
            onClick={submitAnswer}
            disabled={!answer.trim() || loading}
            style={{
              background: 'transparent',
              border: answer.trim() && !loading ? '1px solid var(--accent)' : '1px solid var(--border)',
              padding: '10px 18px', cursor: answer.trim() && !loading ? 'pointer' : 'not-allowed',
              borderRadius: 2,
              display: 'flex', alignItems: 'center', gap: 10,
              opacity: answer.trim() && !loading ? 1 : 0.3,
            }}
          >
            <Glyph size={9} color="var(--accent)">
              {step === 4 ? 'achever' : 'seuil suivant'}
            </Glyph>
            <Diamond size={6} />
          </button>
        )}
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' };
