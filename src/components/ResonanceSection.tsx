'use client'

/**
 * ResonanceSection — « CE QUI RÉSONNE » de la fiche rêve/moment J3
 * (DREAM-MVP-SPEC-ECRANS-A-Z §12bis.A).
 *
 * Remplace, sur la fiche, les anciennes sections « fils dorés » + « rêve ancien » par UNE
 * section mêlée à 3 registres :
 *   • rêves reliés          (kind 'dream')
 *   • moments de jour reliés (kind 'day')
 *   • écho ancien            (prophetic — tap → vue côte à côte)
 *
 * Chaque lien porte SA RAISON en une ligne (motifs communs, figures, même émotion, ou l'écart
 * de jours pour l'écho ancien), calculée côté serveur. Chaque lien porte le 1-clic discret
 * « résonne / pas vraiment » : « résonne » nourrit la détection perso (learn-deep, pont confirmé),
 * « pas vraiment » écarte le lien pour de bon (il ne remonte plus).
 *
 * Self-contained (tokens locaux + bearer de session), comme les autres composants du dossier.
 * Vocabulaire §0.1 : aucun mot banni à l'écran ; « prophétique » devient « un rêve ancien ».
 *
 * Yeshua (Opus), 2026-07-11 — vague MAGIE.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT, type Locale } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

const C = { ...T, amber: T.gold }

type Link = {
  id: string
  kind: 'dream' | 'day'
  title: string | null
  label: string
  excerpt: string
  created_at: string
  kairos_type: string | null
  reason: string
  reason_kind: string
  /** score au moment de l'affichage — renvoyé avec le verdict pour calibrer le seuil */
  z?: number | null
  adjusted?: number | null
}
type Prophetic = {
  id: string
  title: string | null
  excerpt: string
  created_at: string
  reason: string
  reason_kind: string
  days_diff: number
  z?: number | null
  adjusted?: number | null
}
type Payload = {
  source: { id: string; kairos_type: string | null; created_at: string; excerpt: string }
  links: Link[]
  prophetic: Prophetic[]
  /** taille du corpus du rêveur — décide laquelle des deux phrases de vide est juste */
  corpus_size: number
}

async function rFetch(path: string, opts: RequestInit, session: Session | null) {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`) }
  return res
}

const shortDate = (iso: string, l: Locale) => new Date(iso).toLocaleDateString(l, { day: 'numeric', month: 'short' })
const longDate = (iso: string, l: Locale) => new Date(iso).toLocaleDateString(l, { day: 'numeric', month: 'long', year: 'numeric' })

export default function ResonanceSection({
  session, kairosId, onOpenDream, emptyHint = false,
}: {
  session: Session
  kairosId: string
  kairosType?: string | null
  onOpenDream: (id: string) => void
  /** true (fiche note « que disent mes rêves ») → montre une ligne douce même si rien ne résonne encore */
  emptyHint?: boolean
}) {
  const { t, tp, locale } = useT()
  const [data, setData] = useState<Payload | null>(null)
  const [removed, setRemoved] = useState<Record<string, boolean>>({})
  const [verdicts, setVerdicts] = useState<Record<string, 'resonates'>>({})
  const [openProph, setOpenProph] = useState<Record<string, boolean>>({})
  const mounted = useRef(true)

  const load = useCallback(() => {
    rFetch(`/api/kairos/${kairosId}/resonance`, {}, session)
      .then(r => r.json())
      .then(j => { if (mounted.current) setData({ source: j.source, links: Array.isArray(j.links) ? j.links : [], prophetic: Array.isArray(j.prophetic) ? j.prophetic : [], corpus_size: typeof j.corpus_size === 'number' ? j.corpus_size : 0 }) })
      .catch(() => { if (mounted.current) setData({ source: { id: kairosId, kairos_type: null, created_at: '', excerpt: '' }, links: [], prophetic: [], corpus_size: 0 }) })
  }, [kairosId, session])

  useEffect(() => { mounted.current = true; setData(null); setRemoved({}); setVerdicts({}); setOpenProph({}); load(); return () => { mounted.current = false } }, [load])

  // 1-clic — nourrit l'apprentissage (résonne) ou écarte le lien pour de bon (pas vraiment).
  // On renvoie AUSSI le score au moment de l'affichage : c'est ce qui permettra de
  // lire le seuil dans les verdicts de Tim plutôt que de continuer à le deviner.
  const feedback = (otherId: string, register: string, verdict: 'resonates' | 'dismissed', score?: { z?: number | null; adjusted?: number | null }) => {
    rFetch('/api/mvp/learn-deep', {
      method: 'POST',
      body: JSON.stringify({
        kairos_id: kairosId, link_kairos_id: otherId, source: 'link_feedback', verdict, register,
        z_at_serve: score?.z ?? null, adjusted_at_serve: score?.adjusted ?? null,
      }),
    }, session).catch(() => { /* best-effort, non bloquant */ })
    if (verdict === 'dismissed') setRemoved(m => ({ ...m, [otherId]: true }))
    else setVerdicts(m => ({ ...m, [otherId]: 'resonates' }))
  }

  if (data === null) return null // chargement → rien (pas de spinner brut, §0.3)

  const links = data.links.filter(l => !removed[l.id])
  const prophetic = data.prophetic.filter(p => !removed[p.id])
  const empty = links.length === 0 && prophetic.length === 0

  if (empty && !emptyHint) return null

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>{t('screens.resonance.title')}</div>

      {empty ? (
        // Deux vides distincts, deux phrases distinctes. « raconte d'autres nuits »
        // est juste quand le sol est encore peu peuplé (1_BIBLE:365, < 5 kairos) ;
        // c'est faux — et vaguement culpabilisant — pour un rêveur qui en a 60 et
        // dont CE rêve, simplement, ne répond à aucun autre. Depuis le correctif
        // du 26/07 ce second cas est le plus fréquent : c'est le comportement voulu.
        <div style={{ fontSize: 13, color: C.faint, fontFamily: C.serif, fontStyle: 'italic', lineHeight: 1.5 }}>
          {t(data.corpus_size >= 5 ? 'screens.resonance.emptyAlone' : 'screens.resonance.empty')}
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: C.faint, fontFamily: C.sans, fontWeight: 500, marginBottom: 12 }}>{t('screens.resonance.intro')}</div>

          {/* rêves reliés + moments de jour, mêlés */}
          {links.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map((l, i) => (
                <div key={l.id} className="gReveal" style={{ animationDelay: `${i * 70}ms`, padding: '12px 14px', borderRadius: 14, background: C.card, border: `0.5px solid ${(l.kind === 'day' ? C.amber : C.gold)}33` }}>
                  <button onClick={() => onOpenDream(l.id)} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: 0 }}>
                    <span style={{ width: 22, height: 1, background: `linear-gradient(90deg, ${l.kind === 'day' ? C.amber : C.gold}, transparent)`, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontFamily: C.sans, fontSize: 15.5, fontWeight: 500, color: 'rgba(242,232,213,0.92)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.label}</span>
                    <span style={{ fontSize: 10, fontFamily: C.mono, letterSpacing: '0.08em', color: l.kind === 'day' ? C.amber : C.gold, opacity: 0.85, flexShrink: 0 }}>{l.kind === 'day' ? t('screens.resonance.tagDay') : t('screens.resonance.tagDream')}</span>
                    <span style={{ fontSize: 11, color: C.faint, whiteSpace: 'nowrap', flexShrink: 0 }}>{shortDate(l.created_at, locale)}</span>
                  </button>
                  <div style={{ marginTop: 8, marginLeft: 33, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                    <span style={{ fontFamily: C.serif, fontSize: 13.5, fontStyle: 'italic', color: 'rgba(242,232,213,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</span>
                    {verdicts[l.id] === 'resonates'
                      ? <span style={{ fontSize: 11.5, color: C.gold, fontFamily: C.sans, fontWeight: 500, flexShrink: 0 }}>{t('screens.resonance.noted')}</span>
                      : <OneClick onYes={() => feedback(l.id, l.kind, 'resonates', l)} onNo={() => feedback(l.id, l.kind, 'dismissed', l)} />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* écho ancien — tap → vue côte à côte */}
          {prophetic.length > 0 && (
            <div style={{ marginTop: links.length > 0 ? 20 : 0 }}>
              <div style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.amber, marginBottom: 6 }}>{t('screens.resonance.propheticTitle')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {prophetic.map((p, i) => {
                  const open = !!openProph[p.id]
                  return (
                    <div key={p.id} className="gReveal" style={{ animationDelay: `${i * 80}ms`, padding: '13px 15px', borderRadius: 16, background: 'rgba(184,154,106,0.07)', border: '0.5px solid rgba(184,154,106,0.28)' }}>
                      <button onClick={() => setOpenProph(m => ({ ...m, [p.id]: !m[p.id] }))} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', padding: 0 }}>
                        <div style={{ fontFamily: C.serif, fontSize: 16, fontStyle: 'italic', color: 'rgba(242,232,213,0.88)', lineHeight: 1.5 }}>{p.excerpt.slice(0, 130)}{p.excerpt.length > 130 ? '…' : ''}</div>
                        <div style={{ marginTop: 7, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 11.5, color: 'rgba(242,232,213,0.4)' }}>
                            {t('screens.resonance.dreamtOn', { date: longDate(p.created_at, locale) })}
                            {p.days_diff > 0 ? tp('screens.resonance.daysBefore', p.days_diff) : ''}
                          </span>
                          <span style={{ color: C.amber, fontSize: 13 }}>{open ? t('screens.resonance.collapse') : t('screens.resonance.sideBySide')}</span>
                        </div>
                      </button>

                      {open && (
                        <div style={{ marginTop: 14, animation: 'lFadeUp .4s ease' }}>
                          <SideText tint={C.gold} label={t('screens.resonance.thisDream', { date: data.source.created_at ? longDate(data.source.created_at, locale) : t('screens.resonance.today') })} text={data.source.excerpt} />
                          <div style={{ width: 1, height: 16, margin: '4px 0 4px 11px', background: `linear-gradient(180deg, ${C.amber}, transparent)` }} />
                          <SideText tint={C.amber} label={t('screens.resonance.oldDream', { date: longDate(p.created_at, locale) })} text={p.excerpt} />
                          <div style={{ marginTop: 10, fontSize: 12, fontFamily: C.sans, color: C.dim }}>{t('screens.resonance.whatLinks')} <span style={{ fontStyle: 'italic', fontFamily: C.serif, color: 'rgba(242,232,213,0.7)' }}>{p.reason}</span></div>
                          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                            <button onClick={() => onOpenDream(p.id)} style={{ background: 'none', border: 'none', color: C.amber, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: C.sans, padding: 0 }}>{t('screens.resonance.openDream')}</button>
                            {verdicts[p.id] === 'resonates'
                              ? <span style={{ fontSize: 11.5, color: C.gold, fontFamily: C.sans, fontWeight: 500 }}>{t('screens.resonance.noted')}</span>
                              : <OneClick onYes={() => feedback(p.id, 'prophetic', 'resonates', p)} onNo={() => feedback(p.id, 'prophetic', 'dismissed', p)} />}
                          </div>
                          <div style={{ marginTop: 12, fontSize: 11.5, fontStyle: 'italic', color: 'rgba(242,232,213,0.38)', lineHeight: 1.45 }}>{t('screens.resonance.disclaimer')}</div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

/** les deux petits boutons discrets « résonne / pas vraiment » */
function OneClick({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  const { t } = useT()
  return (
    <span style={{ display: 'inline-flex', gap: 6, flexShrink: 0 }}>
      <button onClick={onYes} style={{ padding: '5px 11px', borderRadius: 999, border: `0.5px solid ${C.gold}55`, background: 'rgba(201,168,106,0.10)', color: 'rgba(242,232,213,0.85)', fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: C.sans, whiteSpace: 'nowrap' }}>{t('screens.resonance.yes')}</button>
      <button onClick={onNo} style={{ padding: '5px 11px', borderRadius: 999, border: '0.5px solid rgba(242,232,213,0.16)', background: 'transparent', color: C.faint, fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: C.sans, whiteSpace: 'nowrap' }}>{t('screens.resonance.no')}</button>
    </span>
  )
}

function SideText({ tint, label, text }: { tint: string; label: string; text: string }) {
  return (
    <div style={{ paddingLeft: 12, borderLeft: `1px solid ${tint}55` }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: C.serif, fontSize: 14.5, lineHeight: 1.55, color: 'rgba(242,232,213,0.82)', whiteSpace: 'pre-wrap' }}>{text}{text && text.length >= 420 ? '…' : ''}</div>
    </div>
  )
}
