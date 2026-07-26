'use client';

import React from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';

/**
 * 03 · If It Were My Dream
 * Socratic guided dialogue. 4 thresholds: Décris · Ressens · S'il était mien · Garde.
 * One question at a time. No authoritative interpretation.
 */

export type DreamDialogueProps = {
  dreamTitle?: string;
  dreamDate?: string;
  step?: 1 | 2 | 3 | 4;
  question?: string;
  answer?: string;
  onAnswerChange?: (s: string) => void;
  onNext?: () => void;
  onBack?: () => void;
  onClose?: () => void;
};

const THRESHOLDS = [
  { n: 1, name: 'décris',         hint: "les images, sans y chercher de sens" },
  { n: 2, name: 'ressens',        hint: "le corps avant la pensée" },
  { n: 3, name: "s'il était mien", hint: "projection socratique, sans autorité" },
  { n: 4, name: 'garde',           hint: "un fragment à emporter dans le jour" },
] as const;

export default function DreamDialogue({
  dreamTitle = 'la maison sans toit',
  dreamDate = 'nuit du 16 avril',
  step = 3,
  question = "Si ce rêve était mien,\nque serait cette maison ouverte au ciel ?",
  answer = '',
  onAnswerChange,
  onNext,
  onBack,
  onClose,
}: DreamDialogueProps) {
  const threshold = THRESHOLDS[step - 1];
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
      }}
    >
      <header style={{ padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={btn}><Glyph size={10}>× fermer</Glyph></button>
        <Glyph size={10}>dialogue</Glyph>
        <button onClick={onBack} style={btn}><Glyph size={10}>retour</Glyph></button>
      </header>

      {/* Dream reference strip */}
      <div style={{ padding: '28px 28px 0' }}>
        <Glyph size={9} color="var(--fg-mute)">{dreamDate}</Glyph>
        <SerifHeading size={20} italic color="var(--fg-dim)" style={{ marginTop: 6 }}>
          « {dreamTitle} »
        </SerifHeading>
      </div>

      {/* Thresholds ladder */}
      <div style={{ padding: '36px 28px 0' }}>
        <Glyph size={9} color="var(--accent)">SEUIL {step} / 4 · {threshold.name}</Glyph>
        <div style={{ marginTop: 14, display: 'flex', gap: 6 }}>
          {THRESHOLDS.map((t) => (
            <div
              key={t.n}
              style={{
                flex: 1, height: 1,
                background: t.n <= step ? 'var(--accent)' : 'var(--border)',
                opacity: t.n === step ? 1 : (t.n < step ? 0.6 : 1),
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: 10, fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--fg-mute)' }}>
          {threshold.hint}
        </div>
      </div>

      {/* Question — the oracle's voice */}
      <div style={{ padding: '52px 36px 0' }}>
        <Diamond size={6} />
        <SerifHeading size={30} italic style={{ marginTop: 22, whiteSpace: 'pre-line', lineHeight: 1.18 }}>
          {question}
        </SerifHeading>
      </div>

      {/* Answer field */}
      <div style={{ padding: '40px 36px 0' }}>
        <Rule />
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange?.(e.target.value)}
          placeholder="écris au fil, sans corriger…"
          rows={5}
          style={{
            width: '100%', marginTop: 18, padding: 0, border: 'none', outline: 'none',
            background: 'transparent', resize: 'none',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 18, lineHeight: 1.55, color: 'var(--fg)',
          }}
        />
      </div>

      {/* Footer */}
      <div style={{ position: 'absolute', bottom: 34, left: 0, right: 0, padding: '0 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Glyph size={9} color="var(--fg-mute)">sans jugement, sans fin</Glyph>
        <button
          onClick={onNext}
          style={{
            background: 'transparent', border: '1px solid var(--accent)',
            padding: '10px 18px', cursor: 'pointer', borderRadius: 2,
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <Glyph size={9} color="var(--accent)">{step === 4 ? 'achever' : 'seuil suivant'}</Glyph>
          <Diamond size={6} />
        </button>
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' };
