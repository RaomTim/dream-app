'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

type PreviewPayload = {
  circle: {
    id: string
    name: string
    type: string
    intention: string | null
    member_count: number
    glyph: string
    ephemeral_until: string | null
  }
  invitation: {
    uses_remaining: number
    expires_at: string
  }
  can_join: boolean
}

type PreviewError = {
  error: string
  can_join?: false
  invitation?: {
    expired?: boolean
    revoked?: boolean
    exhausted?: boolean
    expires_at?: string
    uses_remaining?: number
  }
}

const SERIF = 'EB Garamond, Garamond, Georgia, serif'
const MONO = 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace'

// Couleurs Dream night-warm (cohérent /v12/styles.css)
const NIGHT_FLOOR = '#0E0F14'
const NIGHT_WARM = '#15161D'
const ASH_DEEP = '#2A2C36'
const ASH_LIGHT = '#7E7F87'
const BONE = '#E5E2DA'
const SILK_GOLD = '#C9A96E'
const EMBER = '#C77B5C'

export default function CircleInvitePage() {
  const params = useParams<{ token: string }>()
  const router = useRouter()
  const token = String(params?.token || '')
  const { user, session, loading: authLoading } = useAuth()

  const [preview, setPreview] = useState<PreviewPayload | null>(null)
  const [previewError, setPreviewError] = useState<PreviewError | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [acceptError, setAcceptError] = useState<string | null>(null)

  const fetchPreview = useCallback(async () => {
    setLoading(true)
    setPreviewError(null)
    try {
      const r = await fetch(`/api/circles/invitations/${encodeURIComponent(token)}`)
      const data = await r.json()
      if (!r.ok) {
        setPreviewError(data)
        setPreview(null)
      } else {
        setPreview(data as PreviewPayload)
      }
    } catch (e: any) {
      setPreviewError({ error: e?.message || 'Connexion impossible' })
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    if (token) fetchPreview()
  }, [token, fetchPreview])

  const accept = async () => {
    if (!session?.access_token) {
      // Pas authentifié → mémorise le token et envoie sur l'app principale
      try {
        localStorage.setItem('dream_pending_invite_token', token)
      } catch {}
      // L'app /v12/index.html#auth attend dans son flow standard
      router.push('/v12/index.html#auth')
      return
    }

    setAccepting(true)
    setAcceptError(null)
    try {
      const r = await fetch(
        `/api/circles/invitations/${encodeURIComponent(token)}/accept`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({}),
        }
      )
      const data = await r.json()
      if (!r.ok) {
        setAcceptError(data?.error || 'Acceptation impossible')
        setAccepting(false)
        return
      }
      // Redirige vers le cercle accepté dans l'app v12
      const circleId = data?.circle_id
      if (circleId) {
        router.push(`/v12/index.html#cercle-detail?id=${encodeURIComponent(circleId)}`)
      } else {
        router.push('/v12/index.html#cercle')
      }
    } catch (e: any) {
      setAcceptError(e?.message || 'Acceptation impossible')
      setAccepting(false)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: '100vh',
        background: NIGHT_FLOOR,
        color: BONE,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        fontFamily: SERIF,
      }}
    >
      <div
        style={{
          maxWidth: 540,
          width: '100%',
          background: NIGHT_WARM,
          border: `1px solid ${ASH_DEEP}`,
          borderRadius: 0,
          padding: '40px 32px',
        }}
      >
        {/* Eyebrow mono */}
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: '0.14em',
            color: SILK_GOLD,
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          ✦ une invitation à tenir un cercle
        </div>

        {(loading || authLoading) && (
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              color: ASH_LIGHT,
              fontSize: 15,
            }}
          >
            la trame se charge…
          </div>
        )}

        {!loading && previewError && (
          <div>
            <h1
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 28,
                lineHeight: 1.2,
                color: BONE,
                margin: 0,
                marginBottom: 16,
              }}
            >
              ce lien ne tient plus.
            </h1>
            <p
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                color: ASH_LIGHT,
                fontSize: 15,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              {previewError.invitation?.revoked
                ? "l'invitation a été retirée par la personne qui l'a envoyée."
                : previewError.invitation?.expired
                  ? "l'invitation a expiré. demande un nouveau lien à la personne qui t'a invité·e."
                  : previewError.invitation?.exhausted
                    ? "le nombre d'utilisations de ce lien est épuisé. demande un nouveau lien."
                    : previewError.error || "ce lien n'est pas reconnu."}
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                background: 'transparent',
                border: `1px solid ${ASH_DEEP}`,
                color: BONE,
                padding: '10px 20px',
                cursor: 'pointer',
              }}
            >
              retour à dream
            </button>
          </div>
        )}

        {!loading && preview && (
          <div>
            {/* Glyph + meta */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: `1px solid ${ASH_DEEP}`,
                  display: 'grid',
                  placeItems: 'center',
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  fontSize: 26,
                  color: SILK_GOLD,
                  background: 'rgba(201, 169, 110, 0.04)',
                }}
              >
                {preview.circle.glyph}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    color: ASH_LIGHT,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  cercle · {preview.circle.type || 'spontane'}
                </div>
                <h1
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 26,
                    lineHeight: 1.15,
                    color: BONE,
                    margin: 0,
                  }}
                >
                  {preview.circle.name}
                </h1>
              </div>
            </div>

            {/* Intention */}
            {preview.circle.intention && (
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  color: BONE,
                  fontSize: 17,
                  lineHeight: 1.6,
                  margin: '0 0 24px 0',
                  paddingLeft: 16,
                  borderLeft: `2px solid ${SILK_GOLD}`,
                }}
              >
                « {preview.circle.intention} »
              </p>
            )}

            {/* Meta count + ephemeral countdown */}
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: '0.14em',
                color: ASH_LIGHT,
                textTransform: 'uppercase',
                marginBottom: 24,
                lineHeight: 1.7,
              }}
            >
              {preview.circle.member_count}{' '}
              {preview.circle.member_count > 1 ? 'voix tiennent' : 'voix tient'} ce cercle
              {preview.circle.ephemeral_until && (
                <>
                  {' · '}
                  <span style={{ color: SILK_GOLD }}>
                    se referme {relativeUntil(preview.circle.ephemeral_until)}
                  </span>
                </>
              )}
            </div>

            {/* Action */}
            {preview.can_join ? (
              <>
                <button
                  onClick={accept}
                  disabled={accepting}
                  style={{
                    fontFamily: SERIF,
                    fontStyle: 'italic',
                    fontSize: 16,
                    background: 'rgba(201, 169, 110, 0.08)',
                    border: `1px solid ${SILK_GOLD}`,
                    color: SILK_GOLD,
                    padding: '14px 28px',
                    cursor: accepting ? 'not-allowed' : 'pointer',
                    opacity: accepting ? 0.6 : 1,
                    transition: 'all 280ms ease',
                    width: '100%',
                  }}
                >
                  {accepting
                    ? 'tu rejoins…'
                    : !session
                      ? 'me connecter pour rejoindre'
                      : 'rejoindre ce cercle'}
                </button>
                {acceptError && (
                  <div
                    style={{
                      marginTop: 16,
                      color: EMBER,
                      fontFamily: SERIF,
                      fontStyle: 'italic',
                      fontSize: 14,
                    }}
                  >
                    {acceptError}
                  </div>
                )}
              </>
            ) : (
              <p
                style={{
                  fontFamily: SERIF,
                  fontStyle: 'italic',
                  color: ASH_LIGHT,
                  fontSize: 14,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                ce cercle est complet. demande à la personne qui t'a invité·e si une
                place se libère.
              </p>
            )}

            {/* Privacy note */}
            <div
              style={{
                marginTop: 32,
                paddingTop: 20,
                borderTop: `1px solid ${ASH_DEEP}`,
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 13,
                color: ASH_LIGHT,
                lineHeight: 1.6,
              }}
            >
              les noms des membres ne sont pas révélés. l'identité est portée par la
              voix, pas par le nom.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function relativeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now()
  if (ms <= 0) return "à l'instant"
  const days = Math.floor(ms / (24 * 3600 * 1000))
  if (days >= 2) return `dans ${days} jours`
  if (days === 1) return 'demain'
  const hours = Math.floor(ms / (3600 * 1000))
  if (hours >= 2) return `dans ${hours} heures`
  if (hours === 1) return 'dans une heure'
  return 'dans quelques minutes'
}
