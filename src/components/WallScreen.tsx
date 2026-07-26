'use client'

/**
 * WallScreen — Écran M1 : LE MUR (SPEC §5 · M1).
 *
 * Deux onglets « ☾ Rêves » / « ☀ Cœur » (glyphes rendus en SVG lune/soleil,
 * jamais en emoji — cf. §0.5). Flux vertical chronologique pur, groupé par nuit
 * calendaire avec séparateurs « ── cette nuit ── » / « ── la nuit du 8 juillet ── ».
 * Cartes ~6 lignes max, signées uniquement « Quelqu'un · cette nuit ». AUCUN
 * compteur, AUCUN avatar, pas de pull-to-refresh. Tap → WallPostView (M2).
 *
 * Tokens mirroir de src/app/mvp/page.tsx (dark chaud) — re-skin plus tard.
 * Yeshua (Opus), 2026-07-11.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import WallPostView, { type WallPost } from './WallPostView'
import { InfoDot } from '@/components/InfoSystem'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'


type Group = { date: string; separator: string; posts: WallPost[] }
type Tab = 'nuit' | 'jour'

async function call(path: string, session: Session | null) {
  const headers: Record<string, string> = {}
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  const res = await fetch(path, { headers })
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error(e.error || `${res.status}`)
  }
  return res.json()
}

function Moon({ c, s = 15 }: { c: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}
function Sun({ c, s = 15 }: { c: string; s?: number }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4.2" stroke={c} strokeWidth="1.5" />
      <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3 5.6 5.6" stroke={c} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function Separator({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', margin: '26px 0 16px' }}>
      <div style={{ height: 1, width: 34, background: 'linear-gradient(90deg, transparent, rgba(201,168,106,0.34))' }} />
      <span style={{ fontFamily: T.sans, fontSize: 11.5, letterSpacing: '0.06em', color: T.faint }}>{label}</span>
      <div style={{ height: 1, width: 34, background: 'linear-gradient(270deg, transparent, rgba(201,168,106,0.34))' }} />
    </div>
  )
}

function Card({ post, onOpen }: { post: WallPost; onOpen: () => void }) {
  const { t } = useT()
  return (
    <button
      onClick={onOpen}
      style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', background: T.card, border: T.cardBorder, borderRadius: 18, padding: '16px 18px', marginBottom: 12, fontFamily: T.sans, animation: 'lFadeUp .38s ease both' }}
    >
      <div
        style={{ fontFamily: T.serif, fontSize: 16.5, lineHeight: 1.5, color: T.cream, display: '-webkit-box', WebkitLineClamp: 6, WebkitBoxOrient: 'vertical', overflow: 'hidden', whiteSpace: 'pre-wrap' }}
      >
        {post.body}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: T.faint, letterSpacing: '0.02em' }}>{t('screens.wall.signature', { when: post.when })}</div>
    </button>
  )
}

export default function WallScreen({ session }: { session: Session | null }) {
  const { t } = useT()
  const [tab, setTab] = useState<Tab>('nuit')
  const [groups, setGroups] = useState<Group[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [slow, setSlow] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [open, setOpen] = useState<WallPost | null>(null)
  const sentinel = useRef<HTMLDivElement | null>(null)

  const mergeGroups = (prev: Group[], incoming: Group[]): Group[] => {
    const out = [...prev]
    for (const g of incoming) {
      const last = out[out.length - 1]
      if (last && last.date === g.date) last.posts = [...last.posts, ...g.posts]
      else out.push(g)
    }
    return out
  }

  const load = useCallback(
    async (t: Tab, cur: string | null) => {
      const first = cur === null
      if (first) {
        setStatus('loading')
        setSlow(false)
      } else {
        setLoadingMore(true)
      }
      const slowTimer = first ? setTimeout(() => setSlow(true), 2000) : null
      try {
        const q = new URLSearchParams({ tab: t })
        if (cur) q.set('cursor', cur)
        const r = await call(`/api/wall/feed?${q.toString()}`, session)
        const incoming: Group[] = r.groups || []
        setGroups((prev) => (first ? incoming : mergeGroups(prev, incoming)))
        setCursor(r.next_cursor || null)
        setStatus('ready')
      } catch {
        if (first) setStatus('error')
      } finally {
        if (slowTimer) clearTimeout(slowTimer)
        setLoadingMore(false)
      }
    },
    [session]
  )

  // (re)chargement à l'ouverture / au changement d'onglet — jamais de pull-to-refresh
  useEffect(() => {
    setGroups([])
    setCursor(null)
    load(tab, null)
  }, [tab, load])

  // scroll infini par nuits (sentinelle)
  useEffect(() => {
    if (!sentinel.current || !cursor || status !== 'ready') return
    const el = sentinel.current
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && cursor && !loadingMore) load(tab, cursor)
      },
      { rootMargin: '240px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [cursor, status, loadingMore, tab, load])

  const isEmpty = status === 'ready' && groups.length === 0

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 100 }}>
      <style>{`@keyframes lFadeUp { from { opacity:0; transform:translateY(8px);} to { opacity:1; transform:translateY(0);} }`}</style>

      {/* onglets ☾ Rêves / ☀ Cœur */}
      <div style={{ position: 'absolute', top: 'max(58px, calc(env(safe-area-inset-top) + 2px))', right: 18, zIndex: 5 }}>
        <InfoDot id="wall-anon" size={16} color="rgba(242,232,213,0.4)" />
      </div>
      <div style={{ paddingTop: 'max(56px, env(safe-area-inset-top))', display: 'flex', justifyContent: 'center', gap: 8 }}>
        {([
          { k: 'nuit' as Tab, label: t('screens.wall.tabDreams'), glyph: Moon },
          { k: 'jour' as Tab, label: t('screens.wall.tabHeart'), glyph: Sun },
        ]).map((it) => {
          const on = tab === it.k
          const c = on ? T.cream : T.faint
          const G = it.glyph
          return (
            <button
              key={it.k}
              onClick={() => setTab(it.k)}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, cursor: 'pointer', background: on ? 'rgba(201,168,106,0.10)' : 'transparent', border: on ? `1px solid ${T.gold}44` : '1px solid transparent', color: c, fontFamily: T.sans, fontSize: 14, fontWeight: on ? 600 : 500, transition: 'all .3s ease' }}
            >
              <G c={c} />
              {it.label}
            </button>
          )
        })}
      </div>

      {/* corps */}
      <div style={{ padding: '8px 18px 0', maxWidth: 560, margin: '0 auto' }}>
        {status === 'loading' && (
          <div style={{ paddingTop: 80, textAlign: 'center', fontFamily: T.serif, fontSize: 16, fontStyle: 'italic', color: T.dim }}>
            {slow ? t('screens.common.aMoment') : ''}
          </div>
        )}

        {status === 'error' && (
          <div style={{ paddingTop: 80, textAlign: 'center' }}>
            <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: T.dim, marginBottom: 16 }}>{t('screens.wall.error')}</div>
            <button onClick={() => load(tab, null)} style={{ padding: '11px 22px', borderRadius: 999, cursor: 'pointer', background: 'rgba(201,168,106,0.10)', border: `1px solid ${T.gold}44`, color: T.cream, fontFamily: T.sans, fontSize: 14, fontWeight: 500 }}>{t('screens.common.retry')}</button>
          </div>
        )}

        {isEmpty && (
          <div style={{ paddingTop: 90, textAlign: 'center', fontFamily: T.serif, fontSize: 18, fontStyle: 'italic', color: T.dim, lineHeight: 1.5, padding: '90px 24px 0' }}>
            {t('screens.wall.empty')}
          </div>
        )}

        {status === 'ready' && groups.map((g) => (
          <div key={g.date}>
            <Separator label={g.separator} />
            {g.posts.map((p) => (
              <Card key={p.id} post={p} onOpen={() => setOpen(p)} />
            ))}
          </div>
        ))}

        {/* sentinelle scroll infini */}
        {status === 'ready' && cursor && <div ref={sentinel} style={{ height: 1 }} />}
        {loadingMore && (
          <div style={{ textAlign: 'center', padding: '14px 0', fontFamily: T.serif, fontSize: 14, fontStyle: 'italic', color: T.faint }}>…</div>
        )}
      </div>

      {open && <WallPostView post={open} session={session} onBack={() => setOpen(null)} />}
    </div>
  )
}
