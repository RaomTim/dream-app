'use client'

/**
 * QW1 — FeedbackButton omniprésent.
 * Bouton discret 30px ash-light en bas-droit. Modal 3-step :
 *   1. Context (auto-détecté depuis pathname)
 *   2. Severity (low / medium / high)
 *   3. Texte libre + email optionnel
 * Si severity = high → carte rouge SOS/3114 affichée sous le textarea.
 *
 * Auth : utilise authFetch (Bearer token via session Supabase).
 * Anonyme acceptable côté DB (user_id nullable + RLS WITH CHECK user_id = auth.uid() OR NULL),
 * mais la requête nécessite quand même un Bearer token valide pour passer authenticated.
 */

import React, { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { authFetch } from '@/lib/api-client'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

type Severity = 'low' | 'medium' | 'high'

function detectContext(pathname: string | null): { type: string; id: string | null } {
  if (!pathname) return { type: 'app', id: null }
  // Heuristiques simples — extensible
  if (pathname.startsWith('/dream/')) {
    const parts = pathname.split('/').filter(Boolean)
    return { type: 'screen', id: parts.slice(1).join('/') || 'dream' }
  }
  if (pathname === '/' || pathname === '') return { type: 'screen', id: 'home' }
  return { type: 'screen', id: pathname }
}

export default function FeedbackButton() {
  const { t } = useT()
  const pathname = usePathname()
  const { user, session } = useAuth()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [severity, setSeverity] = useState<Severity>('low')
  const [text, setText] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ctx = useMemo(() => detectContext(pathname), [pathname])

  // Pré-remplir email si user connecté
  useEffect(() => {
    if (user?.email && !email) setEmail(user.email)
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset à la fermeture
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(1)
        setSeverity('low')
        setText('')
        setError(null)
        setDone(false)
        setSubmitting(false)
      }, 300)
      return () => clearTimeout(t)
    }
  }, [open])

  // Si pas de session → on n'affiche pas le bouton (pas de feedback anon dans V1)
  if (!session) return null

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError(t('screens.feedback.emptyText'))
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await authFetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
          context_type: ctx.type,
          context_id: ctx.id,
          feedback_text: text,
          severity,
          user_email: email || null,
        }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `HTTP ${res.status}`)
      }
      setDone(true)
      setTimeout(() => setOpen(false), 1400)
    } catch (e: any) {
      setError(e?.message || t('screens.feedback.sendFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Bouton flottant 30px discret */}
      <button
        type="button"
        aria-label={t('screens.feedback.ariaOpen')}
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 14,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 78px)', // au-dessus du BottomNav
          width: 30,
          height: 30,
          borderRadius: 9999,
          background: T.card,
          border: `1px solid ${T.line}`,
          color: T.dim,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 90,
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          padding: 0,
          opacity: 0.7,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
      >
        {/* speech-bubble minimal */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 3.5C2 2.67 2.67 2 3.5 2h7c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5H6.5L4 12V10H3.5C2.67 10 2 9.33 2 8.5v-5z"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t('screens.feedback.ariaDialog')}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20,14,10,0.62)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: T.bgFlat,
              border: `1px solid ${T.line}`,
              borderRadius: 4,
              padding: 20,
              color: T.cream,
              fontFamily: T.sans,
              maxHeight: '88dvh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: T.mono,
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: T.dim,
                }}
              >
                {t('screens.feedback.step', { n: step })}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: T.dim,
                  cursor: 'pointer',
                  fontSize: 18,
                  padding: 4,
                  lineHeight: 1,
                }}
                aria-label={t('screens.feedback.ariaClose')}
              >
                ×
              </button>
            </div>

            {done ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div
                  style={{
                    fontFamily: T.serif,
                    fontStyle: 'italic',
                    fontSize: 22,
                    marginBottom: 8,
                  }}
                >
                  {t('screens.feedback.doneTitle')}
                </div>
                <div style={{ fontSize: 13, color: T.dim }}>
                  {t('screens.feedback.doneBody')}
                </div>
              </div>
            ) : (
              <>
                {/* STEP 1 — context */}
                {step === 1 && (
                  <>
                    <div
                      style={{
                        fontFamily: T.serif,
                        fontStyle: 'italic',
                        fontSize: 24,
                        marginBottom: 12,
                        lineHeight: 1.2,
                      }}
                    >
                      {t('screens.feedback.step1Title')}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: T.dim,
                        marginBottom: 18,
                      }}
                    >
                      {t('screens.feedback.youAreOn')}{' '}
                      <span style={{ color: T.cream }}>
                        {ctx.id || t('screens.feedback.theApp')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        style={btnPrimary}
                      >
                        {t('screens.common.continueCap')}
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 2 — severity */}
                {step === 2 && (
                  <>
                    <div
                      style={{
                        fontFamily: T.serif,
                        fontStyle: 'italic',
                        fontSize: 22,
                        marginBottom: 14,
                        lineHeight: 1.2,
                      }}
                    >
                      {t('screens.feedback.step2Title')}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                      {(['low', 'medium', 'high'] as Severity[]).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSeverity(s)}
                          style={{
                            ...btnSeverity,
                            ...(severity === s ? btnSeverityActive : {}),
                          }}
                        >
                          <span style={{ fontSize: 14, fontWeight: 500 }}>
                            {s === 'low' ? t('screens.feedback.sevLow') : s === 'medium' ? t('screens.feedback.sevMedium') : t('screens.feedback.sevHigh')}
                          </span>
                          <span style={{ fontSize: 11, color: T.dim, marginTop: 2 }}>
                            {s === 'low'
                              ? t('screens.feedback.sevLowSub')
                              : s === 'medium'
                              ? t('screens.feedback.sevMediumSub')
                              : t('screens.feedback.sevHighSub')}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                      <button type="button" onClick={() => setStep(1)} style={btnGhost}>
                        {t('screens.common.backCap')}
                      </button>
                      <button type="button" onClick={() => setStep(3)} style={btnPrimary}>
                        {t('screens.common.continueCap')}
                      </button>
                    </div>
                  </>
                )}

                {/* STEP 3 — text */}
                {step === 3 && (
                  <>
                    <div
                      style={{
                        fontFamily: T.serif,
                        fontStyle: 'italic',
                        fontSize: 22,
                        marginBottom: 14,
                        lineHeight: 1.2,
                      }}
                    >
                      {t('screens.feedback.step3Title')}
                    </div>

                    {severity === 'high' && (
                      <div
                        style={{
                          background: 'rgba(199,115,75,0.16)',
                          border: '1px solid rgba(199,115,75,0.5)',
                          borderRadius: 4,
                          padding: 14,
                          marginBottom: 14,
                          fontSize: 13,
                          lineHeight: 1.5,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: T.mono,
                            fontSize: 10,
                            letterSpacing: 1.5,
                            textTransform: 'uppercase',
                            marginBottom: 8,
                            color: T.emberLive,
                          }}
                        >
                          {t('screens.feedback.sosKicker')}
                        </div>
                        <div style={{ color: T.cream, marginBottom: 6 }}>
                          {t('screens.feedback.sosIntro')}
                        </div>
                        {/* ⚠️ SÉCURITÉ RÉELLE : numéros FRANÇAIS vérifiés, jamais « traduits » ni inventés.
                            En anglais on garde les mêmes lignes + la mention du service local. */}
                        <ul style={{ margin: 0, paddingLeft: 18, color: T.cream }}>
                          <li>
                            <strong>3114</strong>{t('screens.feedback.sos3114')}
                          </li>
                          <li>
                            <strong>15</strong> · <strong>112</strong>{t('screens.feedback.sosEmergency')}
                          </li>
                          <li>
                            {t('screens.feedback.sosAmitie')}<strong>09 72 39 40 50</strong>
                          </li>
                        </ul>
                        <div style={{ marginTop: 8, fontSize: 11.5, color: T.dim, lineHeight: 1.5 }}>
                          {t('screens.feedback.sosElsewhere')}
                        </div>
                      </div>
                    )}

                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={t('screens.feedback.textPlaceholder')}
                      rows={5}
                      style={{
                        width: '100%',
                        background: T.card,
                        border: `1px solid ${T.line}`,
                        borderRadius: 4,
                        color: T.cream,
                        padding: 12,
                        fontFamily: T.sans,
                        fontSize: 14,
                        lineHeight: 1.5,
                        resize: 'vertical',
                        marginBottom: 12,
                        outline: 'none',
                      }}
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('screens.feedback.emailPlaceholder')}
                      style={{
                        width: '100%',
                        background: T.card,
                        border: `1px solid ${T.line}`,
                        borderRadius: 4,
                        color: T.cream,
                        padding: 10,
                        fontFamily: T.sans,
                        fontSize: 13,
                        marginBottom: 14,
                        outline: 'none',
                      }}
                    />

                    {error && (
                      <div
                        style={{
                          fontSize: 12,
                          color: T.emberLive,
                          marginBottom: 10,
                        }}
                      >
                        {error}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                      <button type="button" onClick={() => setStep(2)} style={btnGhost} disabled={submitting}>
                        {t('screens.common.backCap')}
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        style={btnPrimary}
                        disabled={submitting || !text.trim()}
                      >
                        {submitting ? t('screens.feedback.sending') : t('screens.feedback.send')}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const btnPrimary: React.CSSProperties = {
  background: T.gold,
  color: T.bgFlat,
  border: 'none',
  borderRadius: 2,
  padding: '10px 18px',
  fontFamily: T.mono,
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  cursor: 'pointer',
  fontWeight: 500,
}

const btnGhost: React.CSSProperties = {
  background: 'transparent',
  color: T.dim,
  border: `1px solid ${T.line}`,
  borderRadius: 2,
  padding: '10px 18px',
  fontFamily: T.mono,
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: 'uppercase',
  cursor: 'pointer',
}

const btnSeverity: React.CSSProperties = {
  background: T.card,
  border: `1px solid ${T.line}`,
  borderRadius: 4,
  padding: '12px 14px',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  color: T.cream,
}

const btnSeverityActive: React.CSSProperties = {
  border: `1px solid ${T.gold}`,
  background: 'rgba(255,255,255,0.1)',
}
