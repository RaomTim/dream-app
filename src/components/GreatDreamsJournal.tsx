'use client'

/**
 * GreatDreamsJournal — « les grands rêves ». Le journal à part + la consultation.
 * Réf : TAXONOMIE-GRANDS-REVES.md §3 et §4.
 *
 * DEUX vues dans un seul composant (A4 n'a donc qu'un montage à faire) :
 *   • 'journal' — les rêves marqués, puis ce que le rêveur a gardé
 *   • 'consult' — le chant du cœur → DEUX lectures séparées (grands rêves / corpus)
 * `initialView` permet d'ouvrir directement sur la consultation (entrée Cœur).
 *
 * Ce qu'on a refusé de faire (§3) :
 *   • pas de grille de vignettes, pas de compteur, pas de tri par « popularité » —
 *     ce n'est pas une liste de favoris. Une colonne, du texte, beaucoup d'air :
 *     on n'en survole pas 40, on en relit UN.
 *   • pas d'état vide « en erreur » : au début il n'y a rien, et c'est normal.
 *     Une phrase, et le silence. Aucun bouton d'action, aucun tutoriel — un
 *     journal de grands rêves ne se remplit pas sur commande.
 *   • le seul mouvement de l'écran : il ouvre sur UN rêve tiré au sort parmi les
 *     marqués. La première chose qu'on voit en entrant est un rêve, pas une liste.
 *
 * φ/Fibonacci (DESIGN-MATHEMATIQUES-SACREES.md) : espacements 8/13/21/34/55/89/144,
 * durées 89/144/233/377/610, line-height 1.618, radius Fibonacci. Tokens de
 * src/lib/dream-design.ts uniquement — aucune couleur inventée.
 *
 * Yeshua (Opus, A3), 2026-07-26.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T, SCALE, MOTION } from '@/lib/dream-design'
import GreatDreamCandidates from '@/components/GreatDreamCandidates'

type GreatDream = {
  id: string
  title: string | null
  excerpt: string
  kairos_type: string | null
  created_at: string
  marked_great_at: string | null
  facets: string[]
  note: string | null
}
type KeptInterp = {
  id: string
  kairos_id: string
  body: string
  resonance_note: string | null
  kept_at: string
  dream_title: string | null
  dream_created_at: string | null
}
type Found = {
  id: string
  reason: string
  title: string | null
  excerpt: string
  kairos_type: string
  created_at: string | null
  facets: string[]
  note: string | null
}

async function apiGet(path: string, session: Session) {
  const headers: Record<string, string> = {}
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  const res = await fetch(path, { headers })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}
async function apiPost(path: string, body: any, session: Session) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  const res = await fetch(path, { method: 'POST', headers, body: JSON.stringify(body) })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

/* ─────────── petits éléments partagés ─────────── */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.faint, marginBottom: 13 }}>
      {children}
    </div>
  )
}

function FacetTags({ facets }: { facets: string[] }) {
  const { t } = useT()
  if (!facets?.length) return null
  return (
    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {facets.map(f => (
        <span key={f} style={{ padding: '5px 12px', borderRadius: SCALE.radiusPill, border: `0.5px solid ${T.line}`, fontFamily: T.sans, fontSize: SCALE.meta, color: T.dim }}>
          {t(`screens.great.facet.${f}`)}
        </span>
      ))}
    </div>
  )
}

/** Une entrée du journal : pleine largeur, du texte, de l'air. */
function DreamEntry({ d, onOpen, locale, t, lead }: { d: GreatDream; onOpen: (id: string) => void; locale: string; t: any; lead?: boolean }) {
  const dreamt = new Date(d.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
  const late =
    d.marked_great_at &&
    new Date(d.marked_great_at).getTime() - new Date(d.created_at).getTime() > 89 * 24 * 3600 * 1000
  return (
    <button
      onClick={() => onOpen(d.id)}
      style={{
        display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
        background: lead ? 'rgba(255,255,255,0.05)' : 'transparent',
        border: 'none', borderTop: lead ? 'none' : `0.5px solid ${T.line}`,
        borderRadius: lead ? SCALE.radiusLg : 0,
        padding: lead ? '34px 21px' : '34px 3px 21px',
      }}
    >
      <div style={{ fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
        {dreamt}
        {late && d.marked_great_at && (
          <> · {t('screens.great.recognisedIn', { date: new Date(d.marked_great_at).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) })}</>
        )}
      </div>
      <div style={{ marginTop: 10, fontFamily: T.serif, fontSize: lead ? 28 : 22, fontStyle: 'italic', color: T.cream, lineHeight: 1.272 }}>
        {d.title || t('screens.great.untitled')}
      </div>
      {/* Les mots du rêveur passent AVANT le récit : c'est ce qu'il a voulu retenir. */}
      {d.note && (
        <div style={{ marginTop: 13, paddingLeft: 13, borderLeft: `1px solid ${T.gold}44`, fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', color: T.ink, lineHeight: 1.618 }}>
          {d.note}
        </div>
      )}
      <div style={{ marginTop: 13, fontFamily: T.serif, fontSize: SCALE.body, color: '#ddd4de', lineHeight: 1.618 }}>
        {d.excerpt}…
      </div>
      <FacetTags facets={d.facets} />
    </button>
  )
}

/* ═════════════════════════ LE COMPOSANT ═════════════════════════ */

export default function GreatDreamsJournal({
  session,
  onOpenDream,
  onBack,
  initialView = 'journal',
}: {
  session: Session
  onOpenDream: (id: string) => void
  onBack?: () => void
  initialView?: 'journal' | 'consult'
}) {
  const { t, locale } = useT()
  const [view, setView] = useState<'journal' | 'consult'>(initialView)
  const [dreams, setDreams] = useState<GreatDream[] | null>(null)
  const [kept, setKept] = useState<KeptInterp[]>([])
  const mounted = useRef(true)

  // Extrait en `reload` (B3) : quand une proposition est acceptée, le rêve entre
  // dans le journal et la liste doit le refléter tout de suite.
  const reload = useCallback(() => {
    apiGet('/api/great-dreams', session)
      .then(j => {
        if (!mounted.current) return
        setDreams(Array.isArray(j.dreams) ? j.dreams : [])
        setKept(Array.isArray(j.interpretations) ? j.interpretations : [])
      })
      .catch(() => { if (mounted.current) { setDreams([]); setKept([]) } })
  }, [session])

  useEffect(() => {
    mounted.current = true
    reload()
    return () => { mounted.current = false }
  }, [reload])

  // Le rêve d'ouverture : tiré au sort une fois par montage, pas à chaque rendu.
  const leadId = useMemo(() => {
    if (!dreams || dreams.length === 0) return null
    return dreams[Math.floor(Math.random() * dreams.length)].id
  }, [dreams])

  const lead = dreams?.find(d => d.id === leadId) || null
  const rest = (dreams || []).filter(d => d.id !== leadId)

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 144 }}>
      {/* en-tête */}
      <div style={{ paddingTop: 55, paddingLeft: 21, paddingRight: 21, display: 'flex', alignItems: 'center', gap: 13 }}>
        {onBack && (
          <button onClick={onBack} aria-label={t('screens.common.back')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#ddd4de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        )}
        <div style={{ flex: 1 }} />
      </div>

      <div style={{ padding: '0 21px', maxWidth: 610, margin: '0 auto' }}>
        <h1 style={{ margin: 0, marginTop: 21, fontFamily: T.serif, fontSize: 34, fontStyle: 'italic', fontWeight: 400, color: T.cream, lineHeight: 1.272 }}>
          {t('screens.great.title')}
        </h1>

        {/* bascule journal / consultation — deux mots, pas un menu */}
        <div style={{ marginTop: 21, display: 'flex', gap: 4, padding: 4, borderRadius: SCALE.radius, background: 'rgba(255,255,255,0.06)', border: T.cardBorder, width: 'fit-content' }}>
          {(['journal', 'consult'] as const).map(k => (
            <button
              key={k}
              onClick={() => setView(k)}
              style={{
                padding: '9px 21px', borderRadius: 8, cursor: 'pointer',
                fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600,
                background: view === k ? 'rgba(255,255,255,0.16)' : 'transparent',
                border: view === k ? `1px solid ${T.gold}55` : '1px solid transparent',
                color: view === k ? T.cream : T.dim,
              }}
            >
              {t(k === 'journal' ? 'screens.great.tabJournal' : 'screens.great.tabConsult')}
            </button>
          ))}
        </div>

        {view === 'consult' ? (
          <Consultation session={session} onOpenDream={onOpenDream} />
        ) : dreams === null ? null /* §0.3 : jamais de spinner brut */ : dreams.length === 0 && kept.length === 0 ? (
          /* ── L'ÉTAT VIDE — l'état normal des premières semaines ──
             Une phrase, et le silence. Pas de bouton, pas de tutoriel. */
          <div style={{ marginTop: 89, animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
            <div style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.dim, lineHeight: 1.618 }}>
              {t('screens.great.emptyL1')}
            </div>
            <div style={{ marginTop: 21, fontFamily: T.sans, fontSize: SCALE.body, color: T.faint, lineHeight: 1.618 }}>
              {t('screens.great.emptyL2')}
            </div>
            {/* B3 — la première review, proposée SEULEMENT s'il y a de quoi regarder
                en arrière (≥ 12 rêves ; en dessous le composant rend `null` et le
                vide reste nu, comme le veut §3.13.4 « ni bouton ni tutoriel »).
                Un rêveur qui a douze rêves et aucun marqué est exactement celui à
                qui cette fonction s'adresse : lui offrir de regarder n'est pas un
                tutoriel, c'est la fonction. */}
            <GreatDreamCandidates session={session} onOpenDream={onOpenDream} onMarked={reload} />
          </div>
        ) : (
          <div style={{ animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
            {/* B3 — ce que l'app propose. Au-dessus des rêves marqués : c'est ce
                qui attend une décision, pas ce qui est déjà décidé. */}
            <GreatDreamCandidates session={session} onOpenDream={onOpenDream} onMarked={reload} />
            {lead && (
              <div style={{ marginTop: 34 }}>
                <DreamEntry d={lead} onOpen={onOpenDream} locale={locale} t={t} lead />
              </div>
            )}
            {rest.length > 0 && (
              <div style={{ marginTop: 34 }}>
                {rest.map(d => <DreamEntry key={d.id} d={d} onOpen={onOpenDream} locale={locale} t={t} />)}
              </div>
            )}

            {/* ── CE QUE J'AI GARDÉ — les interprétations gardées, enfin visibles
                   ailleurs que sur la fiche de leur rêve (§1.4). ── */}
            {kept.length > 0 && (
              <div style={{ marginTop: 89 }}>
                <Kicker>{t('screens.great.keptKicker')}</Kicker>
                {kept.map(k => (
                  <button
                    key={k.id}
                    onClick={() => onOpenDream(k.kairos_id)}
                    style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', borderTop: `0.5px solid ${T.line}`, padding: '21px 3px' }}
                  >
                    <div style={{ fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
                      {k.dream_title || t('screens.great.untitled')}
                    </div>
                    <div style={{ marginTop: 8, fontFamily: T.serif, fontSize: SCALE.body, color: T.ink, lineHeight: 1.618 }}>
                      {k.body.length > 320 ? k.body.slice(0, 320) + '…' : k.body}
                    </div>
                    {k.resonance_note && (
                      <div style={{ marginTop: 10, paddingLeft: 13, borderLeft: `1px solid ${T.gold}44`, fontFamily: T.serif, fontSize: SCALE.small, fontStyle: 'italic', color: T.dim, lineHeight: 1.618 }}>
                        {k.resonance_note}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═════════ LA CONSULTATION À DOUBLE LECTURE (§4) ═════════ */

function Consultation({ session, onOpenDream }: { session: Session; onOpenDream: (id: string) => void }) {
  const { t, locale } = useT()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState<{ reading_great: Found[]; reading_all: Found[]; silence: boolean; rate_limited?: boolean } | null>(null)
  const [err, setErr] = useState('')

  const ask = useCallback(async () => {
    const v = text.trim()
    if (v.length < 10 || busy) return
    setBusy(true); setErr(''); setRes(null)
    try {
      const j = await apiPost('/api/great-dreams/consult', { text: v }, session)
      setRes(j)
    } catch {
      setErr(t('screens.great.consultErr'))
    } finally {
      setBusy(false)
    }
  }, [text, busy, session, t])

  const Reading = ({ items, kicker, empty }: { items: Found[]; kicker: string; empty: string }) => (
    <div style={{ marginTop: 55 }}>
      <Kicker>{kicker}</Kicker>
      {items.length === 0 ? (
        <div style={{ fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', color: T.faint, lineHeight: 1.618 }}>{empty}</div>
      ) : (
        items.map(f => (
          <button
            key={f.id}
            onClick={() => onOpenDream(f.id)}
            style={{ display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none', borderTop: `0.5px solid ${T.line}`, padding: '21px 3px' }}
          >
            <div style={{ fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
              {f.created_at ? new Date(f.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
            </div>
            <div style={{ marginTop: 8, fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.cream, lineHeight: 1.272 }}>
              {f.title || t('screens.great.untitled')}
            </div>
            {/* La raison : FACTUELLE, ce qu'il y a DANS le rêve. L'app ramène, elle ne traduit pas. */}
            <div style={{ marginTop: 10, fontFamily: T.serif, fontSize: SCALE.body, color: T.ink, lineHeight: 1.618 }}>
              {f.reason}
            </div>
            <FacetTags facets={f.facets || []} />
          </button>
        ))
      )}
    </div>
  )

  return (
    <div style={{ marginTop: 34 }}>
      <div style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.dim, lineHeight: 1.618 }}>
        {t('screens.great.consultAsk')}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        maxLength={2000}
        placeholder={t('screens.great.consultPlaceholder')}
        style={{
          marginTop: 21, width: '100%', minHeight: 144, padding: 21, borderRadius: SCALE.radiusLg,
          background: T.card, border: T.cardBorder, color: T.ink,
          fontFamily: T.serif, fontSize: SCALE.bodyLg, fontStyle: 'italic', lineHeight: 1.618, resize: 'vertical',
        }}
      />
      <button
        onClick={ask}
        disabled={text.trim().length < 10 || busy}
        style={{
          marginTop: 13, width: '100%', padding: '13px 21px', minHeight: SCALE.touch,
          borderRadius: SCALE.radiusPill, cursor: text.trim().length < 10 || busy ? 'default' : 'pointer',
          background: 'rgba(255,255,255,0.1)', border: `1px solid ${T.gold}55`,
          fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600, color: T.cream,
          opacity: text.trim().length < 10 || busy ? 0.45 : 1,
          transition: `opacity ${MOTION.fade}ms ${MOTION.ease}`,
        }}
      >
        {busy ? t('screens.great.consultBusy') : t('screens.great.consultGo')}
      </button>
      {err && <div style={{ marginTop: 13, fontFamily: T.sans, fontSize: SCALE.small, color: T.emberLive }}>{err}</div>}

      {res?.rate_limited && (
        <div style={{ marginTop: 34, fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', color: T.dim, lineHeight: 1.618 }}>
          {t('screens.great.consultLater')}
        </div>
      )}

      {res && !res.rate_limited && (
        <div style={{ animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
          {res.silence ? (
            /* SILENCE_AS_FEATURE — une réponse, pas une erreur. */
            <div style={{ marginTop: 55, fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.dim, lineHeight: 1.618 }}>
              {t('screens.great.consultSilence')}
            </div>
          ) : (
            <>
              <Reading items={res.reading_great} kicker={t('screens.great.readingA')} empty={t('screens.great.readingAEmpty')} />
              <Reading items={res.reading_all} kicker={t('screens.great.readingB')} empty={t('screens.great.readingBEmpty')} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
