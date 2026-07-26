'use client'

/**
 * GroupScreen — G4 (l'écran social principal) + G5 (dépôt ouvert) + G7 (réglages)
 * SPEC : DREAM-MVP-SPEC-ECRANS-A-Z.md §4
 * Auteur : Yeshua (Opus) — 2026-07-11
 *
 * Un seul scroll, deux étages :
 *   ① Rêves & moments partagés (cartes des partages + lectures de Dream, réactions)
 *   ② La conversation — chat humain (texte + vocaux non transcrits + photos), realtime
 *
 * Garde-fous SPEC : zéro compteur/streak sur les défis (des prénoms), zéro
 * transcription des vocaux, mot « partage » (jamais « dépôt ») à l'écran,
 * zéro emoji système (les emojis TAPÉS par les humains dans le chat sont OK).
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/auth'
import { useT, type Locale } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

/* ── tokens « L'encre vivante » (miroir de mvp/page.tsx) ── */

/* ── icônes (trait, zéro emoji) ── */
const Ic = {
  back: (c = '#ddd4de', s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  mic: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="11" rx="3" fill={c} /><path d="M6 11a6 6 0 0 0 12 0M12 17v3" stroke={c} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  stop: (c: string, s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><rect x="5" y="5" width="14" height="14" rx="3" /></svg>
  ),
  send: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M4 12l16-7-7 16-2.5-6.5L4 12z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" /></svg>
  ),
  clip: (c: string, s = 20) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M20 11.5l-8 8a5 5 0 0 1-7-7l8.5-8.5a3.2 3.2 0 0 1 4.6 4.6l-8.2 8.2a1.5 1.5 0 0 1-2.2-2.1l7.6-7.6" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  play: (c: string, s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M7 4.5v15l13-7.5z" /></svg>
  ),
  cog: (c: string, s = 19) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke={c} strokeWidth="1.5" /><path d="M12 3v2.2M12 18.8V21M21 12h-2.2M5.2 12H3M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" stroke={c} strokeWidth="1.3" strokeLinecap="round" /></svg>
  ),
}

/* ── fetch authentifié local (miroir du api() de mvp/page.tsx) ── */
async function gfetch(path: string, opts: RequestInit = {}, token?: string) {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`) }
  return res
}

const fmtDate = (d: string, l: Locale) => { try { return new Date(d).toLocaleDateString(l, { day: 'numeric', month: 'long' }) } catch { return '' } }
const fmtTime = (d: string, l: Locale) => { try { return new Date(d).toLocaleTimeString(l, { hour: '2-digit', minute: '2-digit' }) } catch { return '' } }
const isToday = (d: string) => { const t = new Date(); const x = new Date(d); return t.toDateString() === x.toDateString() }
/** Le type de partage vit en base ('dream', 'moment'…) — on n'en garde ici que la CLÉ. */
const shareLabelKey = (type: string) =>
  ['dream', 'moment', 'mirror', 'resonance'].includes(type)
    ? `screens.group.type.${type}`
    : 'screens.group.type.other'

type Props = {
  circle: any                 // { id, name, intention_text, invite_code, my_role, i_am_creator? }
  session: Session | null
  onBack: () => void
}

export default function GroupScreen({ circle, session, onBack }: Props) {
  const { t, locale } = useT()
  const token = session?.access_token
  const cid = circle?.id
  const [view, setView] = useState<'group' | 'settings' | 'newChallenge'>('group')

  // état groupe
  const [c, setC] = useState<any>(circle)
  const [members, setMembers] = useState<any[]>([])
  const [shares, setShares] = useState<any[] | null>(null)
  const [restitutions, setRestitutions] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [olderBusy, setOlderBusy] = useState(false)

  // G5 dépôt ouvert
  const [openShare, setOpenShare] = useState<any | null>(null)

  // composer
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const scrollBottomRef = useRef<HTMLDivElement | null>(null)
  const messagesLenRef = useRef(0)

  const activeChallenge = challenges.find((x) => x.status === 'open') || null
  const memberName = (uid: string) => members.find((m) => m.user_id === uid)?.alias || t('screens.common.aDreamer')

  /* ── chargements ── */
  const loadCircle = useCallback(async () => {
    try {
      const r = await gfetch(`/api/circles/${cid}`, {}, token)
      const j = await r.json()
      if (j.circle) setC((prev: any) => ({ ...prev, ...j.circle }))
      setMembers(j.members || [])
    } catch { /* le prop circle reste la source de secours */ }
  }, [cid, token])

  const loadShares = useCallback(async () => {
    try {
      const r = await gfetch(`/api/circles/${cid}/share`, {}, token)
      setShares((await r.json()).shares || [])
    } catch { setShares([]) }
  }, [cid, token])

  const loadRestitutions = useCallback(async () => {
    try {
      const r = await gfetch(`/api/circles/${cid}/restitutions`, {}, token)
      setRestitutions((await r.json()).restitutions || [])
    } catch { setRestitutions([]) }
  }, [cid, token])

  const loadChallenges = useCallback(async () => {
    try {
      const r = await gfetch(`/api/circles/${cid}/challenges`, {}, token)
      setChallenges((await r.json()).challenges || [])
    } catch { setChallenges([]) }
  }, [cid, token])

  // dernier lot de messages, fusionné par id
  const refetchNewest = useCallback(async () => {
    try {
      const r = await gfetch(`/api/circles/${cid}/messages?limit=30`, {}, token)
      const j = await r.json()
      const fresh: any[] = j.messages || []
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id))
        const merged = [...prev, ...fresh.filter((m) => !seen.has(m.id))]
        merged.sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
        return merged
      })
      if (nextCursor === null) setNextCursor(j.nextCursor)
    } catch { /* silencieux — polling/realtime réessaiera */ }
  }, [cid, token, nextCursor])

  const loadOlder = useCallback(async () => {
    if (!nextCursor || olderBusy) return
    setOlderBusy(true)
    try {
      const r = await gfetch(`/api/circles/${cid}/messages?limit=30&cursor=${encodeURIComponent(nextCursor)}`, {}, token)
      const j = await r.json()
      const older: any[] = j.messages || []
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id))
        const merged = [...older.filter((m) => !seen.has(m.id)), ...prev]
        merged.sort((a, b) => (a.created_at < b.created_at ? -1 : 1))
        return merged
      })
      setNextCursor(j.nextCursor)
    } catch { /* noop */ }
    setOlderBusy(false)
  }, [cid, token, nextCursor, olderBusy])

  // premier chargement
  useEffect(() => {
    if (!cid) return
    loadCircle(); loadShares(); loadRestitutions(); loadChallenges(); refetchNewest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid])

  /* ── realtime + fallback polling 15s ── */
  useEffect(() => {
    if (!cid) return
    let stopped = false
    let pollTimer: any = null
    const startPolling = () => { if (!pollTimer) pollTimer = setInterval(() => { if (!stopped) refetchNewest() }, 15000) }

    let channel: any = null
    try {
      const sb = createBrowserClient()
      if (token) { try { (sb as any).realtime?.setAuth?.(token) } catch { /* noop */ } }
      channel = (sb.channel(`circle_messages:${cid}`) as any)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'circle_messages', filter: `circle_id=eq.${cid}` },
          () => { if (!stopped) refetchNewest() })
        .subscribe((status: string) => {
          // si le realtime ne s'établit pas, on bascule en polling
          if (status !== 'SUBSCRIBED') startPolling()
        })
      // filet : si pas SUBSCRIBED sous 4s → polling
      setTimeout(() => { if (!stopped && (channel?.state !== 'joined')) startPolling() }, 4000)
      return () => { stopped = true; if (pollTimer) clearInterval(pollTimer); try { sb.removeChannel(channel) } catch { /* noop */ } }
    } catch {
      startPolling()
      return () => { stopped = true; if (pollTimer) clearInterval(pollTimer) }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cid, token])

  // auto-scroll vers le bas quand un message arrive
  useEffect(() => {
    if (messages.length > messagesLenRef.current) {
      scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
    messagesLenRef.current = messages.length
  }, [messages.length])

  /* ── actions ── */
  const sendText = async () => {
    const body = draft.trim()
    if (!body || sending) return
    setSending(true); setDraft('')
    try {
      const r = await gfetch(`/api/circles/${cid}/messages`, { method: 'POST', body: JSON.stringify({ kind: 'text', body }) }, token)
      const j = await r.json()
      if (j.message) setMessages((prev) => (prev.some((m) => m.id === j.message.id) ? prev : [...prev, j.message]))
    } catch { setDraft(body) /* rendre le texte en cas d'échec */ }
    setSending(false)
  }

  const uploadMedia = async (file: File, kind: 'audio' | 'photo') => {
    setSending(true)
    try {
      const fd = new FormData()
      fd.append('kind', kind)
      fd.append('file', file)
      if (session?.user?.id) fd.append('userId', session.user.id)
      const r = await gfetch(`/api/circles/${cid}/messages`, { method: 'POST', body: fd }, token)
      const j = await r.json()
      if (j.message) setMessages((prev) => (prev.some((m) => m.id === j.message.id) ? prev : [...prev, j.message]))
    } catch { /* noop */ }
    setSending(false)
  }

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) uploadMedia(f, 'photo')
    e.target.value = ''
  }

  /* ── rendu ── */
  if (view === 'settings') {
    return <GroupSettings c={c} members={members} session={session} onBack={() => { setView('group'); loadCircle() }} onLeft={onBack} onChanged={loadCircle} />
  }

  const nightShare = (s: any) => s.share_type === 'dream'

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 96, fontFamily: T.sans }}>
      {/* ── HEADER ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'linear-gradient(180deg, rgba(20,14,10,0.96), rgba(20,14,10,0.86) 70%, transparent)', backdropFilter: 'blur(8px)', paddingTop: 'max(52px, env(safe-area-inset-top))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px 6px' }}>
          <button onClick={onBack} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>{Ic.back()}</button>
          <button onClick={() => setView('settings')} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: T.serif, fontSize: 22, fontStyle: 'italic', color: T.cream, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c?.name || t('screens.group.fallbackName')}</span>
            {Ic.cog(T.faint, 16)}
          </button>
        </div>
        {c?.intention_text && (
          <div style={{ padding: '0 16px 12px' }}>
            <div style={{ fontSize: 13, color: T.dim, lineHeight: 1.4 }}>{t('screens.group.crossing')} <span style={{ color: T.ink }}>{c.intention_text}</span></div>
            <AskDreamButton cid={cid} token={token} restitutions={restitutions} onAsked={() => { setTimeout(loadRestitutions, 3500) }} />
          </div>
        )}
      </div>

      {/* ── DÉFI ACTIF ── */}
      <div style={{ padding: '4px 14px 0' }}>
        {activeChallenge ? (
          <ChallengeCard ch={activeChallenge} cid={cid} token={token} onChanged={loadChallenges} />
        ) : (
          <button onClick={() => setView('newChallenge')} style={{ width: '100%', padding: '11px 14px', borderRadius: 14, background: 'transparent', border: `0.5px dashed ${T.gold}44`, color: T.dim, fontSize: 13, cursor: 'pointer', fontFamily: T.sans }}>
            {t('screens.group.challengeStart')}
          </button>
        )}
      </div>

      {view === 'newChallenge' && (
        <NewChallenge cid={cid} token={token} onDone={() => { setView('group'); loadChallenges() }} onCancel={() => setView('group')} />
      )}

      {/* ── ÉTAGE 1 : Rêves & moments partagés ── */}
      <div style={{ padding: '18px 14px 6px' }}>
        <div style={{ fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.faint, marginBottom: 10, paddingLeft: 4 }}>{t('screens.group.sharedTitle')}</div>

        {/* lectures de Dream (restitutions) — cartes spéciales, réactions */}
        {restitutions.filter((r) => r.status === 'ready' || r.status === 'pending').map((r) => (
          <RestitutionCard key={r.id} r={r} cid={cid} token={token} />
        ))}

        {shares === null ? (
          <div style={{ textAlign: 'center', color: T.dim, fontSize: 13, padding: '18px 0' }}>{t('screens.group.sharesLoading')}</div>
        ) : shares.length === 0 && restitutions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '26px 24px', fontFamily: T.serif, fontSize: 16.5, fontStyle: 'italic', color: T.dim, lineHeight: 1.5 }}>
            {t('screens.group.sharesEmpty1')}<br />{t('screens.group.sharesEmpty2')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {shares.map((s: any) => (
              <button key={s.id} onClick={() => setOpenShare(s)} style={{ textAlign: 'left', cursor: 'pointer', padding: '14px 16px', borderRadius: 18, background: nightShare(s) ? T.card : T.card, border: nightShare(s) ? T.cardBorder : T.cardBorder }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12.5, color: T.ink, fontWeight: 600 }}>{s.author_name || memberName(s.user_id)}<span style={{ color: T.faint, fontWeight: 400 }}> · {t(shareLabelKey(s.share_type))}</span></span>
                  <span style={{ fontSize: 11, color: T.faint, flexShrink: 0 }}>{fmtDate(s.created_at, locale)}</span>
                </div>
                <div style={{ fontFamily: T.serif, fontSize: 15, fontStyle: 'italic', color: '#f1e8d7', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {(s.content || s.dream_text || s.text || t('screens.group.aSharedDream')).slice(0, 400)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── ÉTAGE 2 : la conversation ── */}
      <div style={{ padding: '16px 14px 0' }}>
        <div style={{ fontSize: 12.5, letterSpacing: '0.06em', textTransform: 'uppercase', color: T.faint, marginBottom: 10, paddingLeft: 4 }}>{t('screens.group.conversation')}</div>
        {nextCursor && (
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <button onClick={loadOlder} disabled={olderBusy} style={{ background: 'none', border: 'none', color: T.dim, fontSize: 12.5, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>{olderBusy ? t('screens.common.working') : t('screens.group.olderMessages')}</button>
          </div>
        )}
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: T.faint, fontSize: 13, padding: '10px 0 20px' }}>{t('screens.group.noMessages')}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((m) => <MessageBubble key={m.id} m={m} />)}
          </div>
        )}
        <div ref={scrollBottomRef} />
      </div>

      {/* ── COMPOSER (barre du bas) ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20, padding: '10px 12px calc(10px + env(safe-area-inset-bottom))', background: 'linear-gradient(0deg, rgba(20,14,10,0.98), rgba(20,14,10,0.9) 70%, transparent)', display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onPickPhoto} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} aria-label={t('screens.group.ariaPhoto')} style={{ width: 38, height: 38, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'transparent', border: `1px solid ${T.gold}33`, cursor: 'pointer', flexShrink: 0 }}>{Ic.clip(T.dim)}</button>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText() } }}
          placeholder={t('screens.group.composerPlaceholder')}
          rows={1}
          style={{ flex: 1, resize: 'none', maxHeight: 120, padding: '10px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: T.cardBorder, color: T.cream, fontSize: 15, fontFamily: T.sans, lineHeight: 1.4, outline: 'none' }}
        />
        {draft.trim() ? (
          <button onClick={sendText} disabled={sending} aria-label={t('screens.group.ariaSend')} style={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', border: 'none', cursor: 'pointer', flexShrink: 0, opacity: sending ? 0.5 : 1 }}>{Ic.send('#2a160e')}</button>
        ) : (
          <VoiceButton onRecorded={(file) => uploadMedia(file, 'audio')} disabled={sending} />
        )}
      </div>

      {/* ── G5 : dépôt ouvert (vue lecture simple) ── */}
      {openShare && <ShareReader s={openShare} authorName={openShare.author_name || memberName(openShare.user_id)} isMe={openShare.user_id === session?.user?.id} onClose={() => setOpenShare(null)} />}
    </div>
  )
}

/* ═══════ « Demander une lecture à Dream » (garde-fou 1×/jour) ═══════ */
function AskDreamButton({ cid, token, restitutions, onAsked }: { cid: string; token?: string; restitutions: any[]; onAsked: () => void }) {
  const { t } = useT()
  const [busy, setBusy] = useState(false)
  const askedToday = restitutions.some((r) => r.requested_at && isToday(r.requested_at))
  const ask = async () => {
    if (busy || askedToday) return
    setBusy(true)
    try { await gfetch(`/api/circles/${cid}/restitutions`, { method: 'POST', body: JSON.stringify({ period_days: 28 }) }, token); onAsked() } catch { /* noop */ }
    setBusy(false)
  }
  return (
    <button onClick={ask} disabled={busy || askedToday} style={{ marginTop: 8, padding: '7px 14px', borderRadius: 999, background: askedToday ? 'transparent' : 'rgba(255,255,255,0.1)', border: `1px solid ${T.gold}44`, color: askedToday ? T.faint : T.cream, fontSize: 12.5, cursor: askedToday ? 'default' : 'pointer', fontFamily: T.sans, opacity: busy ? 0.6 : 1 }}>
      {busy ? t('screens.group.askDreamBusy') : askedToday ? t('screens.group.askDreamDone') : t('screens.group.askDream')}
    </button>
  )
}

/* ═══════ carte lecture de Dream (restitution) + réactions ═══════ */
function RestitutionCard({ r, cid, token }: { r: any; cid: string; token?: string }) {
  const { t } = useT()
  const [counts, setCounts] = useState<Record<string, number>>({ resonates: 0, unfamiliar: 0, question: 0 })
  const [mine, setMine] = useState<Record<string, boolean>>({ resonates: false, unfamiliar: false, question: false })
  useEffect(() => {
    if (r.status !== 'ready') return
    gfetch(`/api/circles/${cid}/reactions?restitution_id=${r.id}`, {}, token).then((x) => x.json()).then((j) => { if (j.counts) setCounts(j.counts); if (j.mine) setMine(j.mine) }).catch(() => {})
  }, [r.id, r.status, cid, token])

  const toggle = async (kind: string) => {
    const on = mine[kind]
    setMine((m) => ({ ...m, [kind]: !on }))
    setCounts((c2) => ({ ...c2, [kind]: Math.max(0, (c2[kind] || 0) + (on ? -1 : 1)) }))
    try {
      if (on) await gfetch(`/api/circles/${cid}/reactions?restitution_id=${r.id}&reaction_type=${kind}`, { method: 'DELETE' }, token)
      else await gfetch(`/api/circles/${cid}/reactions`, { method: 'POST', body: JSON.stringify({ restitution_id: r.id, reaction_type: kind }) }, token)
    } catch { /* rollback léger ignoré */ }
  }

  const labels: [string, string][] = [
    ['resonates', t('screens.group.reactResonates')],
    ['unfamiliar', t('screens.group.reactUnfamiliar')],
    ['question', t('screens.group.reactQuestion')],
  ]
  return (
    <div style={{ marginBottom: 10, padding: '15px 17px', borderRadius: 18, background: 'rgba(255,255,255,0.09)', border: `0.5px solid ${T.gold}3a` }}>
      <div style={{ fontSize: 11.5, letterSpacing: '0.05em', textTransform: 'uppercase', color: T.gold, marginBottom: 7 }}>{t('screens.group.seenTitle')}</div>
      {r.status === 'pending' ? (
        <div style={{ fontSize: 13.5, color: T.dim, fontStyle: 'italic', fontFamily: T.serif }}>{t('screens.group.seenPending')}</div>
      ) : (
        <>
          <div style={{ fontFamily: T.serif, fontSize: 15, color: '#f1e8d7', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>{r.narrative_text}</div>
          <div style={{ display: 'flex', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>
            {labels.map(([k, lab]) => (
              <button key={k} onClick={() => toggle(k)} style={{ padding: '5px 11px', borderRadius: 999, fontSize: 12, cursor: 'pointer', fontFamily: T.sans, background: mine[k] ? 'rgba(255,255,255,0.18)' : 'transparent', border: `1px solid ${mine[k] ? T.gold + '77' : 'rgba(202,191,206,0.16)'}`, color: mine[k] ? T.cream : T.dim }}>
                {lab}{counts[k] ? ` · ${counts[k]}` : ''}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ═══════ carte défi actif ═══════ */
function ChallengeCard({ ch, cid, token, onChanged }: { ch: any; cid: string; token?: string; onChanged: () => void }) {
  const { t } = useT()
  const [busy, setBusy] = useState(false)
  const names = (ch.participants || []).join(', ')
  const join = async () => { setBusy(true); try { await gfetch(`/api/circles/${cid}/challenges/${ch.id}/join`, { method: 'POST', body: JSON.stringify({}) }, token); onChanged() } catch {} setBusy(false) }
  const finish = async () => { setBusy(true); try { await gfetch(`/api/circles/${cid}/challenges/${ch.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'done' }) }, token); onChanged() } catch {} setBusy(false) }
  return (
    <div style={{ padding: '12px 15px', borderRadius: 16, background: T.card, border: T.cardBorder, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: T.cream, fontWeight: 600 }}>{t('screens.group.challengeLabel', { title: ch.title })}</div>
        {names && <div style={{ marginTop: 3, fontSize: 12, color: T.dim, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{names}</div>}
      </div>
      {ch.is_creator ? (
        <button onClick={finish} disabled={busy} style={{ flexShrink: 0, padding: '7px 13px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}44`, color: T.dim, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.group.challengeFinish')}</button>
      ) : ch.i_am_in ? (
        <span style={{ flexShrink: 0, fontSize: 12, color: T.faint }}>{t('screens.group.challengeIn')}</span>
      ) : (
        <button onClick={join} disabled={busy} style={{ flexShrink: 0, padding: '7px 15px', borderRadius: 999, background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', border: 'none', color: '#2a160e', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.group.challengeJoin')}</button>
      )}
    </div>
  )
}

/* ═══════ lancer un défi ═══════ */
function NewChallenge({ cid, token, onDone, onCancel }: { cid: string; token?: string; onDone: () => void; onCancel: () => void }) {
  const { t } = useT()
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)
  const suggestions = [t('screens.group.challengeSuggestion1'), t('screens.group.challengeSuggestion2')]
  const create = async () => {
    if (title.trim().length < 3 || busy) return
    setBusy(true)
    try { await gfetch(`/api/circles/${cid}/challenges`, { method: 'POST', body: JSON.stringify({ title: title.trim() }) }, token); onDone() } catch {} setBusy(false)
  }
  return (
    <div style={{ margin: '8px 14px 0', padding: 14, borderRadius: 16, background: T.card, border: T.cardBorder }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('screens.group.challengePlaceholder')} style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: T.cardBorder, color: T.cream, fontSize: 14.5, fontFamily: T.sans, outline: 'none', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 9 }}>
        {suggestions.map((s) => (
          <button key={s} onClick={() => setTitle(s)} style={{ padding: '5px 11px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.16)', color: T.dim, fontSize: 12, cursor: 'pointer', fontFamily: T.sans }}>{s}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
        <button onClick={onCancel} style={{ flex: 1, padding: 11, borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.common.cancelCap')}</button>
        <button onClick={create} disabled={busy || title.trim().length < 3} style={{ flex: 1, padding: 11, borderRadius: 999, background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', border: 'none', color: '#2a160e', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans, opacity: busy || title.trim().length < 3 ? 0.5 : 1 }}>{busy ? t('screens.common.working') : t('screens.group.challengeLaunch')}</button>
      </div>
    </div>
  )
}

/* ═══════ bulle de message (texte / audio / photo) ═══════ */
function MessageBubble({ m }: { m: any }) {
  const { t, locale } = useT()
  const me = m.is_me
  const align = me ? 'flex-end' : 'flex-start'
  const bg = me ? 'rgba(255,255,255,0.14)' : 'rgba(202,191,206,0.05)'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align, maxWidth: '100%' }}>
      {!me && <div style={{ fontSize: 11, color: T.faint, margin: '0 0 2px 12px' }}>{m.author_name || t('screens.common.aDreamer')}</div>}
      <div style={{ maxWidth: '80%', padding: m.kind === 'photo' ? 5 : '9px 13px', borderRadius: 16, background: bg, border: '0.5px solid rgba(255,255,255,0.12)' }}>
        {m.kind === 'text' && <div style={{ fontSize: 14.5, color: T.cream, lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{m.body}</div>}
        {m.kind === 'audio' && (m.media_url
          ? <audio controls src={m.media_url} style={{ height: 34, maxWidth: 220 }} />
          : <span style={{ fontSize: 13, color: T.dim, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Ic.play(T.dim)} {t('screens.group.aVoice')}</span>)}
        {m.kind === 'photo' && (m.media_url
          ? <img src={m.media_url} alt={t('screens.group.photoAlt')} style={{ maxWidth: 240, maxHeight: 300, borderRadius: 12, display: 'block' }} />
          : <span style={{ fontSize: 13, color: T.dim }}>{t('screens.group.aPhoto')}</span>)}
      </div>
      <div style={{ fontSize: 10, color: T.faint, margin: me ? '2px 12px 0 0' : '2px 0 0 12px' }}>{fmtTime(m.created_at, locale)}</div>
    </div>
  )
}

/* ═══════ bouton micro — enregistre et UPLOAD sans transcription (façon Telegram) ═══════ */
function VoiceButton({ onRecorded, disabled }: { onRecorded: (file: File) => void; disabled?: boolean }) {
  const { t } = useT()
  const [rec, setRec] = useState(false)
  const mr = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/webm'
      const rc = new MediaRecorder(stream, { mimeType: mime })
      mr.current = rc; chunks.current = []
      rc.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data) }
      rc.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const type = mime.includes('mp4') ? 'audio/mp4' : 'audio/webm'
        const ext = mime.includes('mp4') ? 'mp4' : 'webm'
        const blob = new Blob(chunks.current, { type })
        if (blob.size > 0) onRecorded(new File([blob], `vocal-${Date.now()}.${ext}`, { type }))
      }
      rc.start(); setRec(true)
    } catch { /* micro refusé : on ne bloque rien, l'utilisateur peut écrire */ }
  }
  const stop = () => { if (mr.current && mr.current.state !== 'inactive') { mr.current.stop(); setRec(false) } }

  return (
    <button onClick={rec ? stop : start} disabled={disabled} aria-label={rec ? t('screens.group.ariaStopRecord') : t('screens.group.ariaRecord')}
      style={{ width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center', flexShrink: 0, cursor: 'pointer', background: rec ? T.gold : 'transparent', border: `1px solid ${rec ? T.gold : T.gold + '44'}`, opacity: disabled ? 0.5 : 1 }}>
      {rec ? Ic.stop('#2a160e') : Ic.mic(T.dim)}
    </button>
  )
}

/* ═══════ G5 — dépôt ouvert (vue lecture simple, read-only) ═══════ */
function ShareReader({ s, authorName, isMe, onClose }: { s: any; authorName: string; isMe: boolean; onClose: () => void }) {
  const { t, locale } = useT()
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(20,14,10,0.9)', display: 'flex', flexDirection: 'column' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 'auto', maxHeight: '86dvh', overflowY: 'auto', background: 'radial-gradient(120% 60% at 50% 0%, #221d29, #221d29)', borderRadius: '26px 26px 0 0', border: '0.5px solid rgba(255,255,255,0.16)', padding: '20px 22px calc(24px + env(safe-area-inset-bottom))' }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(202,191,206,0.2)', margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: T.ink, fontWeight: 600 }}>{authorName}{isMe ? ` · ${t('screens.common.me')}` : ''}<span style={{ color: T.faint, fontWeight: 400 }}> · {t(shareLabelKey(s.share_type))}</span></span>
          <span style={{ fontSize: 12, color: T.faint }}>{fmtDate(s.created_at, locale)}</span>
        </div>
        <div style={{ fontFamily: T.serif, fontSize: 17, fontStyle: 'italic', color: '#f1e8d7', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
          {s.content || s.dream_text || s.text || t('screens.group.aSharedDream')}
        </div>
        <div style={{ marginTop: 18, fontSize: 11.5, color: T.faint, lineHeight: 1.5 }}>
          {t('screens.group.readerOwnership')}
        </div>
        <button onClick={onClose} style={{ marginTop: 18, width: '100%', padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.common.closeCap')}</button>
      </div>
    </div>
  )
}

/* ═══════ G7 — réglages du groupe (vue simple) ═══════ */
function GroupSettings({ c, members, session, onBack, onLeft, onChanged }: { c: any; members: any[]; session: Session | null; onBack: () => void; onLeft: () => void; onChanged: () => void }) {
  const { t } = useT()
  const token = session?.access_token
  const cid = c?.id
  const isGuardian = c?.i_am_creator || c?.my_role === 'guardian'
  const myAliasInit = (members.find((m) => m.is_me)?.alias) || ''
  const [name, setName] = useState(c?.name || '')
  const [intention, setIntention] = useState(c?.intention_text || '')
  const [alias, setAlias] = useState(myAliasInit)
  const [savedNote, setSavedNote] = useState('')
  // la couleur de la note ne peut plus se lire dans le texte (il est traduit) → drapeau explicite
  const [savedFailed, setSavedFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(0) // 0, 1, 2 (double confirmation)

  const patch = async (payload: any, note: string) => {
    setBusy(true); setSavedNote(''); setSavedFailed(false)
    try {
      await gfetch(`/api/circles/${cid}`, { method: 'PATCH', body: JSON.stringify(payload) }, token)
      setSavedNote(note); onChanged()
    } catch (e: any) {
      setSavedFailed(true)
      setSavedNote(t('screens.group.settings.saveFailed', { msg: e?.message || '' }))
    }
    setBusy(false)
  }
  const leave = async () => {
    setBusy(true)
    try { await gfetch(`/api/circles/${cid}/leave`, { method: 'DELETE' }, token); onLeft() } catch { setBusy(false) }
  }

  const label: any = { fontSize: 12, color: T.faint, marginBottom: 6, letterSpacing: '0.03em' }
  const field: any = { width: '100%', padding: '11px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: T.cardBorder, color: T.cream, fontSize: 14.5, fontFamily: T.sans, outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 60, fontFamily: T.sans }}>
      <div style={{ paddingTop: 'max(56px, env(safe-area-inset-top))', paddingLeft: 16, paddingRight: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>{Ic.back()}</button>
        <div style={{ fontFamily: T.serif, fontSize: 20, fontStyle: 'italic', color: T.cream }}>{t('screens.group.settings.title')}</div>
      </div>

      <div style={{ margin: '22px 16px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* nom */}
        <div>
          <div style={label}>{t('screens.group.settings.name')}</div>
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={!isGuardian} style={{ ...field, opacity: isGuardian ? 1 : 0.6 }} />
          {isGuardian && name.trim() && name.trim() !== c?.name && (
            <button onClick={() => patch({ name: name.trim() }, t('screens.group.settings.nameSaved'))} disabled={busy} style={saveBtn}>{t('screens.group.settings.saveName')}</button>
          )}
        </div>

        {/* intention */}
        <div>
          <div style={label}>{t('screens.group.settings.intention')}</div>
          <input value={intention} onChange={(e) => setIntention(e.target.value)} disabled={!isGuardian} placeholder={t('screens.group.settings.intentionPlaceholder')} style={{ ...field, opacity: isGuardian ? 1 : 0.6 }} />
          {isGuardian && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {intention.trim() !== (c?.intention_text || '') && (
                <button onClick={() => patch({ intention_text: intention.trim() }, t('screens.group.settings.intentionSaved'))} disabled={busy} style={saveBtn}>{t('screens.common.saveCap')}</button>
              )}
              {c?.intention_text && (
                <button onClick={() => { setIntention(''); patch({ intention_clear: true }, t('screens.group.settings.intentionCleared')) }} disabled={busy} style={ghostBtn}>{t('screens.group.settings.clearIntention')}</button>
              )}
            </div>
          )}
        </div>

        {/* alias */}
        <div>
          <div style={label}>{t('screens.group.settings.alias')}</div>
          <input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder={t('screens.group.settings.aliasPlaceholder')} style={field} />
          {alias !== myAliasInit && (
            <button onClick={() => patch({ my_alias: alias.trim() }, t('screens.group.settings.aliasSaved'))} disabled={busy} style={saveBtn}>{t('screens.group.settings.saveAlias')}</button>
          )}
        </div>

        {savedNote && <div style={{ fontSize: 12.5, color: savedFailed ? '#c7734b' : T.gold }}>{savedNote}</div>}

        {/* membres */}
        <div>
          <div style={label}>{t('screens.group.settings.members', { n: members.length })}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {members.map((m) => (
              <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 13px', borderRadius: 12, background: T.card, border: T.cardBorder }}>
                <span style={{ fontSize: 14, color: T.cream }}>{m.alias || t('screens.common.aDreamer')}{m.is_me ? ` · ${t('screens.common.me')}` : ''}</span>
                {m.is_creator && <span style={{ fontSize: 11, color: T.gold }}>{t('screens.group.settings.guardian')}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* inviter */}
        {c?.invite_code && (
          <div>
            <div style={label}>{t('screens.group.settings.invite')}</div>
            <div style={{ padding: '12px 15px', borderRadius: 14, background: T.card, border: T.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 18, color: T.gold, letterSpacing: '0.15em' }}>{c.invite_code}</span>
              <button onClick={() => { try { navigator.clipboard?.writeText(c.invite_code) } catch {} }} style={{ padding: '7px 13px', borderRadius: 999, background: 'transparent', border: `1px solid ${T.gold}44`, color: T.dim, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.group.settings.copyCode')}</button>
            </div>
          </div>
        )}

        {/* quitter (double confirmation) */}
        <div style={{ marginTop: 8 }}>
          {confirmLeave === 0 && (
            <button onClick={() => setConfirmLeave(1)} style={{ width: '100%', padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(199,115,75,0.4)', color: '#c7734b', fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.group.settings.leave')}</button>
          )}
          {confirmLeave === 1 && (
            <button onClick={() => setConfirmLeave(2)} style={{ width: '100%', padding: 12, borderRadius: 999, background: 'transparent', border: '1px solid rgba(199,115,75,0.5)', color: '#c7734b', fontSize: 13.5, cursor: 'pointer', fontFamily: T.sans }}>{t('screens.group.settings.leaveConfirm')}</button>
          )}
          {confirmLeave === 2 && (
            <button onClick={leave} disabled={busy} style={{ width: '100%', padding: 12, borderRadius: 999, background: 'rgba(199,115,75,0.16)', border: '1px solid rgba(199,115,75,0.6)', color: '#c7734b', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }}>{busy ? t('screens.common.working') : t('screens.group.settings.leaveFinal')}</button>
          )}
        </div>
      </div>
    </div>
  )
}

const saveBtn: any = { marginTop: 8, padding: '7px 15px', borderRadius: 999, background: 'linear-gradient(180deg, #fbeeda, #ecd4b4)', border: 'none', color: '#2a160e', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: T.sans }
const ghostBtn: any = { marginTop: 8, padding: '7px 13px', borderRadius: 999, background: 'transparent', border: '1px solid rgba(202,191,206,0.18)', color: T.dim, fontSize: 12.5, cursor: 'pointer', fontFamily: T.sans }
