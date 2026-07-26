'use client'

/**
 * AuthScreen — V1.2 native styling.
 * Refondu 2026-04-25 — supprimé dépendances legacy primitives.
 * Utilise tokens V1.2 (--night-floor, --bone, --silk-gold, --serif, --mono).
 */

import { useState } from 'react'
import { createBrowserClient } from '@/lib/auth'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

type Mode = 'login' | 'signup' | 'magic-link' | 'forgot-password'

export default function AuthScreen() {
  const { t } = useT()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = createBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split('@')[0] },
          },
        })
        if (error) throw error
        setMessage(t('screens.auth.signupDone'))
      } else if (mode === 'magic-link') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: 'https://dream-alpha-bice.vercel.app/',
          },
        })
        if (error) throw error
        setMessage(t('screens.auth.magicSent'))
      } else if (mode === 'forgot-password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: 'https://dream-alpha-bice.vercel.app/',
        })
        if (error) throw error
        setMessage(t('screens.auth.resetSent'))
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (err: any) {
      // les messages Supabase sont en anglais et bruts : on traduit les deux cas courants,
      // sinon on montre le message tel quel (jamais un « quelque chose s'est mal passé » qui cache).
      setError(
        err.message === 'Invalid login credentials'
          ? t('screens.auth.errBadCredentials')
          : err.message === 'User already registered'
          ? t('screens.auth.errAlreadyRegistered')
          : err.message || t('screens.auth.errGeneric')
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: T.bgFlat,
    border: `1px solid ${T.line}`,
    borderRadius: 2,
    color: T.cream,
    fontFamily: T.serif,
    fontStyle: 'italic',
    fontSize: 16,
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: T.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: T.dim,
    display: 'block',
    marginBottom: 6,
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: T.bg,
      padding: '0 32px',
      fontFamily: T.sans,
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, margin: '0 auto',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${T.gold} 0%, transparent 65%)`,
          opacity: 0.85,
        }} />
        <div style={{
          fontFamily: T.serif,
          fontStyle: 'italic',
          fontSize: 38,
          marginTop: 20,
          color: T.cream,
          letterSpacing: '0.02em',
        }}>
          Dream
        </div>
        <div style={{
          fontFamily: T.mono,
          fontSize: 9,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: T.dim,
          marginTop: 10,
        }}>
          {t('screens.auth.tagline')}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 340 }}>
        {mode === 'signup' && (
          <div style={{ marginBottom: 16 }}>
            <span style={labelStyle}>{t('screens.auth.nameLabel')}</span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('screens.auth.namePlaceholder')}
              style={inputStyle}
            />
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <span style={labelStyle}>{t('screens.auth.emailLabel')}</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('screens.auth.emailPlaceholder')}
            required
            style={inputStyle}
          />
        </div>

        {(mode === 'login' || mode === 'signup') && (
          <div style={{ marginBottom: 20 }}>
            <span style={labelStyle}>{t('screens.auth.passwordLabel')}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={inputStyle}
            />
          </div>
        )}

        {error && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 16,
            borderRadius: 2,
            background: `color-mix(in oklch, ${T.emberLive} 12%, transparent)`,
            border: `1px solid color-mix(in oklch, ${T.emberLive} 40%, transparent)`,
            fontFamily: T.serif,
            fontSize: 14,
            color: T.emberLive,
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: '10px 14px',
            marginBottom: 16,
            borderRadius: 2,
            background: `color-mix(in oklch, ${T.gold} 8%, transparent)`,
            border: `1px solid color-mix(in oklch, ${T.gold} 30%, transparent)`,
            fontFamily: T.serif,
            fontSize: 14,
            color: T.gold,
          }}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 2,
            background: `color-mix(in oklch, ${T.gold} 8%, ${T.bgFlat})`,
            border: `1px solid ${T.gold}`,
            color: T.gold,
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: T.mono,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: 'uppercase',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading
            ? '...'
            : mode === 'login'
            ? t('screens.auth.ctaLogin')
            : mode === 'signup'
            ? t('screens.auth.ctaSignup')
            : mode === 'magic-link'
            ? t('screens.auth.ctaMagic')
            : t('screens.auth.ctaForgot')}
        </button>

        {/* Liens secondaires */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginTop: 20,
        }}>
          {mode === 'login' && (
            <button
              type="button"
              onClick={() => { setMode('forgot-password'); setError(null); setMessage(null) }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: T.mono,
                fontSize: 9,
                letterSpacing: 1,
                color: T.dim,
              }}
            >
              {t('screens.auth.forgot')}
            </button>
          )}

          {(mode === 'login' || mode === 'forgot-password') && (
            <button
              type="button"
              onClick={() => { setMode('magic-link'); setError(null); setMessage(null) }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontFamily: T.mono,
                fontSize: 9,
                letterSpacing: 1,
                color: T.dim,
              }}
            >
              {t('screens.auth.magicLink')}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login')
              setError(null)
              setMessage(null)
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: 1,
              color: T.dim,
            }}
          >
            {mode === 'login'
              ? t('screens.auth.toSignup')
              : mode === 'signup'
              ? t('screens.auth.toLogin')
              : t('screens.auth.backToLogin')}
          </button>
        </div>
      </form>
    </div>
  )
}
