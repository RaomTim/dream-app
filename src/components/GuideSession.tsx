'use client'

/**
 * GuideSession — l'écran C3 (SPEC-ECRANS §3).
 * Chantier D · 2026-07-11 · Yeshua (Opus).
 *
 * Flux : intro (quoi / durée / « on y va ? ») → UNE question par écran
 * (texte ou voix) → 3 points de progression → Pause (garde l'état) →
 * fin « Et là, ça te fait quoi ? » (3 boutons felt-shift, skippable) →
 * « C'est gardé avec ton rêve. » → retour fiche.
 *
 * Persistance : PATCH /api/kairos/[id] { protocol_session_data } (JSONB, pattern
 * kairos existant) pour la pause ET la fin ; POST /api/mvp/feedback pour le
 * felt-shift. Guide « du soir » sans dépôt → crée une note via POST /api/kairos.
 *
 * Zéro mot banni à l'écran, zéro gamification, jamais deux questions par écran.
 */

import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import VoiceRecorder from '@/components/VoiceRecorder'
import { Guide, incGuideCount } from '@/lib/guides'
import { GT, guideApi, GuideBackHeader, GuidePill, GuideGhost, GuideRing, GuideProgress } from '@/components/guide-ui'
import { useT } from '@/lib/i18n'

type Phase = 'intro' | 'steps' | 'felt' | 'done'

const FELT_MAP: Record<string, { validation: 'resonates' | 'partial' | 'rejected'; felt: boolean }> = {
  bouge: { validation: 'resonates', felt: true },
  pareil: { validation: 'rejected', felt: false },
  saispas: { validation: 'partial', felt: false },
}

export default function GuideSession({
  session,
  guide,
  kairosId,
  dreamText,
  resume,
  onExit,
}: {
  session: Session
  guide: Guide
  kairosId: string | null
  dreamText?: string
  /** Reprise d'un guide en pause : pas gardé + réponses déjà données (§C3). */
  resume?: { step: number; answers: Record<string, string> }
  onExit: () => void
}) {
  const { t, tp } = useT()
  // reprise : on démarre directement aux questions, au pas gardé, réponses restaurées.
  const resumeStep = resume ? Math.min(Math.max(0, resume.step), guide.steps.length - 1) : 0
  const [phase, setPhase] = useState<Phase>(resume ? 'steps' : 'intro')
  const [i, setI] = useState(resumeStep)
  const [answers, setAnswers] = useState<Record<string, string>>(resume?.answers ?? {})
  const [cur, setCur] = useState(resume ? (resume.answers[guide.steps[resumeStep]?.id] ?? '') : '')
  const [busy, setBusy] = useState(false)

  const step = guide.steps[i]
  const isLast = i >= guide.steps.length - 1
  const needsText = (step?.input ?? 'text') === 'text'

  const compile = (all: Record<string, string>) => {
    const lines = guide.steps
      .filter((s) => (all[s.id] || '').trim())
      .map((s) => `${s.q}\n${all[s.id].trim()}`)
    return `[${guide.name}]\n\n${lines.join('\n\n')}`.slice(0, 4000)
  }

  const advance = () => {
    const all = needsText && cur.trim() ? { ...answers, [step.id]: cur.trim() } : answers
    setAnswers(all)
    setCur('')
    if (isLast) setPhase('felt')
    else setI((x) => x + 1)
  }

  // Pause : gare l'état sur le dépôt (JSONB), rien n'est perdu.
  const pause = async () => {
    const all = needsText && cur.trim() ? { ...answers, [step.id]: cur.trim() } : answers
    if (kairosId) {
      try {
        await guideApi(`/api/kairos/${kairosId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            protocol_session_data: { guide_id: guide.id, guide_name: guide.name, step: i, answers: all, paused: true, paused_at: new Date().toISOString() },
          }),
        }, session)
      } catch { /* le réseau a flanché — on sort quand même, sans casser */ }
    }
    onExit()
  }

  // Fin : garde le contenu + enregistre le felt-shift (skippable).
  const finish = async (feltKey?: string) => {
    if (busy) return
    setBusy(true)
    const compiled = compile(answers)
    const fs = feltKey ? FELT_MAP[feltKey] : null
    try {
      if (kairosId) {
        await guideApi(`/api/kairos/${kairosId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            protocol_session_data: { guide_id: guide.id, guide_name: guide.name, answers, completed: true, completed_at: new Date().toISOString(), felt_shift: feltKey || null },
            protocol_completed_at: new Date().toISOString(),
          }),
        }, session).catch(() => {})
        if (fs) {
          await guideApi('/api/mvp/feedback', {
            method: 'POST',
            body: JSON.stringify({ kairos_id: kairosId, validation: fs.validation, felt: fs.felt, note: compiled.slice(0, 1500) }),
          }, session).catch(() => {})
        }
      } else {
        // Guide du soir sans dépôt → une note dans le journal.
        await guideApi('/api/kairos', {
          method: 'POST',
          body: JSON.stringify({ raw_text: compiled, kairos_type: 'note_jour', capture_method: `guide_${guide.id}` }),
        }, session).catch(() => {})
        if (fs) {
          await guideApi('/api/mvp/feedback', {
            method: 'POST',
            body: JSON.stringify({ validation: fs.validation, felt: fs.felt }),
          }, session).catch(() => {})
        }
      }
    } catch { /* best-effort : rien ne bloque le retour */ }
    incGuideCount(guide.id)
    setBusy(false)
    setPhase('done')
  }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60 }}>
      <GuideBackHeader
        onBack={phase === 'steps' ? pause : onExit}
        title={guide.name}
        right={phase === 'steps' ? (
          <button onClick={pause} style={{ background: 'none', border: '1px solid rgba(202,191,206,0.18)', borderRadius: 999, padding: '6px 14px', color: GT.dim, fontSize: 12.5, fontWeight: 500, fontFamily: GT.sans, cursor: 'pointer' }}>{t('screens.guide.pause')}</button>
        ) : undefined}
      />

      {dreamText && phase !== 'done' && (
        <div style={{ margin: '16px 24px 0', fontFamily: GT.serif, fontSize: 14.5, fontStyle: 'italic', color: '#b9b0bd', maxHeight: 66, overflow: 'hidden', maskImage: 'linear-gradient(180deg, black 55%, transparent)' }}>
          “{dreamText.slice(0, 170)}{dreamText.length > 170 ? '…' : ''}”
        </div>
      )}

      {/* ── INTRO ── */}
      {phase === 'intro' && (
        <div style={{ margin: '40px 24px 0', textAlign: 'center', animation: 'lFadeUp .4s ease' }}>
          <GuideRing s={34} />
          <div style={{ marginTop: 20, fontFamily: GT.serif, fontSize: 22, fontStyle: 'italic', color: GT.cream, lineHeight: 1.4 }}>{guide.intro}</div>
          <div style={{ marginTop: 16, fontSize: 12.5, letterSpacing: '0.14em', textTransform: 'uppercase', fontFamily: GT.mono, color: GT.faint }}>{tp('screens.guide.meta', guide.steps.length, { duration: guide.duration })}</div>
          <div style={{ marginTop: 30, display: 'flex', gap: 10 }}>
            <GuideGhost onClick={onExit}>{t('screens.guide.later')}</GuideGhost>
            <GuidePill primary onClick={() => setPhase('steps')}>{t('screens.guide.start')}</GuidePill>
          </div>
        </div>
      )}

      {/* ── UNE QUESTION PAR ÉCRAN ── */}
      {phase === 'steps' && step && (
        <div style={{ margin: '26px 20px 0' }}>
          <div style={{ marginBottom: 20 }}><GuideProgress ratio={(i + 1) / guide.steps.length} /></div>
          <div key={i} style={{ animation: 'lFadeUp .35s ease' }}>
            <div style={{ fontFamily: GT.serif, fontSize: 22, fontStyle: 'italic', color: GT.cream, lineHeight: 1.35 }}>{step.q}</div>
            {step.hint && <div style={{ marginTop: 8, fontSize: 13, color: GT.faint, fontWeight: 500, fontFamily: GT.sans }}>{step.hint}</div>}
            {needsText && (
              <div style={{ marginTop: 16, position: 'relative' }}>
                <textarea
                  autoFocus
                  value={cur}
                  onChange={(e) => setCur(e.target.value)}
                  placeholder={step.placeholder || t('screens.guide.placeholder')}
                  style={{ width: '100%', minHeight: 120, padding: 16, paddingRight: 54, borderRadius: 18, background: GT.card, border: GT.cardBorder, color: GT.cream, fontFamily: GT.serif, fontSize: 16, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }}
                />
                <div style={{ position: 'absolute', right: 12, bottom: 12 }}>
                  <VoiceRecorder onTranscription={(t) => setCur((c) => (c ? c + ' ' : '') + t)} />
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            {i > 0 && <GuideGhost onClick={() => { setI((x) => x - 1); setCur(answers[guide.steps[i - 1].id] || '') }}>{t('screens.guide.backStep')}</GuideGhost>}
            <GuidePill primary onClick={advance} disabled={needsText && cur.trim().length < 1}>{isLast ? t('screens.guide.finish') : t('screens.guide.next')}</GuidePill>
          </div>
        </div>
      )}

      {/* ── FIN : felt-shift ── */}
      {phase === 'felt' && (
        <div style={{ margin: '40px 22px 0', textAlign: 'center', animation: 'lFadeUp .4s ease' }}>
          <div style={{ fontFamily: GT.serif, fontSize: 24, fontStyle: 'italic', color: GT.cream, lineHeight: 1.35 }}>{t('screens.guide.feltTitle')}</div>
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => finish('bouge')} disabled={busy} style={{ padding: '15px 18px', borderRadius: 18, background: 'rgba(255,255,255,0.12)', border: `1px solid ${GT.gold}55`, color: GT.cream, fontFamily: GT.sans, fontSize: 15.5, fontWeight: 600, cursor: 'pointer' }}>{t('screens.guide.feltMoved')}</button>
            <button onClick={() => finish('pareil')} disabled={busy} style={{ padding: '15px 18px', borderRadius: 18, background: GT.card, border: GT.cardBorder, color: GT.cream, fontFamily: GT.sans, fontSize: 15.5, fontWeight: 500, cursor: 'pointer' }}>{t('screens.guide.feltSame')}</button>
            <button onClick={() => finish('saispas')} disabled={busy} style={{ padding: '15px 18px', borderRadius: 18, background: GT.card, border: GT.cardBorder, color: GT.cream, fontFamily: GT.sans, fontSize: 15.5, fontWeight: 500, cursor: 'pointer' }}>{t('screens.guide.feltDunno')}</button>
          </div>
          <button onClick={() => finish()} disabled={busy} style={{ marginTop: 18, background: 'none', border: 'none', color: GT.faint, fontSize: 13, fontFamily: GT.sans, cursor: 'pointer' }}>{t('screens.guide.feltSkip')}</button>
        </div>
      )}

      {/* ── C'EST GARDÉ ── */}
      {phase === 'done' && (
        <div style={{ margin: '60px 24px 0', textAlign: 'center', animation: 'lFadeUp .4s ease' }}>
          <GuideRing s={36} />
          <div style={{ marginTop: 20, fontFamily: GT.serif, fontSize: 21, fontStyle: 'italic', color: GT.cream, lineHeight: 1.5 }}>
            {kairosId ? t('screens.guide.keptWithDream') : t('screens.guide.keptInJournal')}
          </div>
          <div style={{ marginTop: 30, display: 'flex' }}>
            <GuidePill primary onClick={onExit}>{t('screens.guide.backHome')}</GuidePill>
          </div>
        </div>
      )}
    </div>
  )
}
