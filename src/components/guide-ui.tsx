'use client'

/**
 * Primitives partagées des guides (Chantier D · 2026-07-11).
 * Copie locale des tokens « L'encre vivante » (page.tsx) pour rester
 * self-contained : aucun import depuis page.tsx (pas de couplage / import
 * circulaire). Mêmes valeurs → même peau.
 */

import type { Session } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

export const GT = T

/* ── fetch authentifié minimal (le PREVIEW de page.tsx ne touche pas les guides) ── */
let _sb: ReturnType<typeof createClient> | null = null
function sb() {
  if (!_sb) {
    _sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _sb
}

export async function guideApi(
  path: string,
  opts: RequestInit = {},
  session: Session | null = null
): Promise<Response> {
  let token = session?.access_token
  if (!token) {
    try { token = (await sb().auth.getSession()).data.session?.access_token } catch { /* noop */ }
  }
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || `${res.status}`)
  }
  return res
}

export function GuideBackHeader({ onBack, title, right }: { onBack: () => void; title: string; right?: React.ReactNode }) {
  const { t } = useT()
  return (
    <div style={{ paddingTop: 60, paddingLeft: 20, paddingRight: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
      <button onClick={onBack} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="rgba(242,232,213,0.6)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div style={{ flex: 1, fontFamily: GT.serif, fontSize: 19, fontStyle: 'italic', color: GT.cream }}>{title}</div>
      {right}
    </div>
  )
}

export function GuidePill({ onClick, children, primary, disabled, flex }: any) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ flex: flex ?? 1, padding: 14, borderRadius: 999, cursor: disabled ? 'default' : 'pointer', fontFamily: GT.sans, fontSize: 14.5, fontWeight: primary ? 600 : 500, opacity: disabled ? 0.45 : 1, transition: 'all .25s ease', ...(primary ? { border: 'none', background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', color: '#2a160e' } : { background: 'rgba(201,168,106,0.10)', border: `1px solid ${GT.gold}44`, color: GT.cream }) }}>{children}</button>
  )
}

export function GuideGhost({ onClick, children }: any) {
  return (
    <button onClick={onClick} style={{ flex: 1, padding: 14, borderRadius: 999, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(242,232,213,0.18)', color: GT.dim, fontSize: 14, fontWeight: 500, fontFamily: GT.sans }}>{children}</button>
  )
}

export function GuideRing({ s = 30 }: { s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 26 26" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="13" cy="13" r="9" fill="none" stroke={GT.gold} strokeWidth="0.8" opacity="0.7" />
      <circle cx="13" cy="13" r="1.6" fill={GT.gold} />
    </svg>
  )
}

/** 3 points de progression discrets (SPEC C3). */
export function GuideProgress({ ratio }: { ratio: number }) {
  const filled = Math.max(1, Math.round(ratio * 3))
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 22, height: 2, borderRadius: 2, background: i < filled ? GT.gold : 'rgba(242,232,213,0.15)', transition: 'background .3s ease' }} />
      ))}
    </div>
  )
}
