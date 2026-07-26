'use client'

/**
 * GreatDreamFlag — « un grand rêve ». Le geste de marquage, sur la fiche du rêve.
 * Réf : TAXONOMIE-GRANDS-REVES.md §1.
 *
 * UN tap. Réversible par un second tap. Pas de modale, pas de confirmation,
 * pas de question — le rêve entre (ou sort) du journal à part, c'est tout.
 *
 * La marque EST `kairos.user_marked_numinous` (colonne existante, déjà lue par
 * page.tsx et par list_kairos_numinous). Aucun second booléen : deux colonnes
 * pour la même vérité divergent toujours.
 *
 * Ce qui n'apparaît QU'APRÈS le marquage, replié, jamais demandé au moment de
 * marquer (§1.2/§1.3) :
 *   • la nuance facultative — ce que le rêve FAIT au rêveur, jamais ce qu'il EST
 *   • « pourquoi celui-là » — les mots du rêveur
 * Ne rien remplir est un état normal et définitif.
 *
 * L'asymétrie IA/rêveur (§1.5) : si l'IA a jugé que le rêve « rayonne »
 * (numinosity_score ≥ 0.7) sans que le rêveur ait marqué, on affiche une mention
 * basse et grise. Une INVITATION, jamais une entrée — seul le tap fait entrer.
 *
 * Vocabulaire §0.1 : « numineux » est banni à l'écran (il reste en base).
 * Self-contained (tokens + bearer de session), comme les autres composants du dossier.
 *
 * Yeshua (Opus, A3), 2026-07-26.
 */

import { useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T, SCALE, MOTION } from '@/lib/dream-design'

export const GREAT_FACETS = ['change', 'force', 'ouvert'] as const
export type GreatFacet = (typeof GREAT_FACETS)[number]

async function patch(kairosId: string, payload: any, session: Session) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  const res = await fetch(`/api/kairos/${kairosId}`, { method: 'PATCH', headers, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

export default function GreatDreamFlag({
  session,
  kairosId,
  marked,
  markedAt,
  facets,
  note,
  radiant,
  onChange,
}: {
  session: Session
  kairosId: string
  marked: boolean
  markedAt?: string | null
  facets?: string[] | null
  note?: string | null
  /** suggestion de l'IA (numinosity_score ≥ 0.7) — invitation, jamais entrée */
  radiant?: boolean
  onChange?: (next: { marked: boolean; facets: string[]; note: string | null }) => void
}) {
  const { t, locale } = useT()
  const [on, setOn] = useState(!!marked)
  const [fac, setFac] = useState<string[]>(facets || [])
  const [noteVal, setNoteVal] = useState(note || '')
  const [openNote, setOpenNote] = useState(false)
  const [saved, setSaved] = useState(false)
  const mounted = useRef(true)
  const noteTimer = useRef<any>(null)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false; clearTimeout(noteTimer.current) }
  }, [])
  useEffect(() => { setOn(!!marked) }, [marked])
  useEffect(() => { setFac(facets || []) }, [facets])
  useEffect(() => { setNoteVal(note || '') }, [note])

  // Le tap. Optimiste : l'état bascule tout de suite, on répare si le réseau refuse.
  const toggle = async () => {
    const next = !on
    setOn(next)
    if (!next) setOpenNote(false)
    onChange?.({ marked: next, facets: fac, note: noteVal || null })
    try {
      await patch(kairosId, { user_marked_numinous: next }, session)
    } catch {
      if (mounted.current) { setOn(!next); onChange?.({ marked: !next, facets: fac, note: noteVal || null }) }
    }
  }

  const toggleFacet = async (f: string) => {
    const next = fac.includes(f) ? fac.filter(x => x !== f) : [...fac, f]
    setFac(next)
    onChange?.({ marked: on, facets: next, note: noteVal || null })
    try { await patch(kairosId, { great_dream_facets: next }, session) } catch { if (mounted.current) setFac(fac) }
  }

  // La note s'enregistre toute seule (pas de bouton « Enregistrer » : §0.5, zéro friction).
  const onNote = (v: string) => {
    setNoteVal(v)
    setSaved(false)
    clearTimeout(noteTimer.current)
    noteTimer.current = setTimeout(async () => {
      try {
        await patch(kairosId, { great_dream_note: v }, session)
        if (mounted.current) { setSaved(true); onChange?.({ marked: on, facets: fac, note: v || null }) }
      } catch { /* la prochaine frappe réessaiera */ }
    }, 900)
  }

  const dateStr = (iso?: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale, { month: 'long', year: 'numeric' }) : ''

  return (
    <div style={{ marginTop: 34 }}>
      {/* ── LE GESTE ──────────────────────────────────────────── */}
      <button
        onClick={toggle}
        aria-pressed={on}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 13,
          padding: '13px 16px',
          minHeight: SCALE.touch,
          borderRadius: SCALE.radius,
          cursor: 'pointer',
          textAlign: 'left',
          background: on ? 'rgba(201,168,106,0.10)' : 'transparent',
          border: on ? `1px solid ${T.gold}66` : T.cardBorder,
          transition: `background ${MOTION.fade}ms ${MOTION.ease}, border-color ${MOTION.fade}ms ${MOTION.ease}`,
        }}
      >
        {/* la marque : un disque qui s'allume. Pas une étoile — une étoile appelle une note. */}
        <span
          aria-hidden
          style={{
            width: 21, height: 21, borderRadius: '50%', flexShrink: 0,
            background: on
              ? `radial-gradient(circle at 38% 32%, ${T.goldLit} 0%, ${T.gold} 62%, #a8874e 100%)`
              : 'transparent',
            border: on ? 'none' : `1px solid ${T.gold}55`,
            boxShadow: on ? `0 0 13px 3px rgba(201,168,106,0.34)` : 'none',
            transition: `all ${MOTION.fade}ms ${MOTION.ease}`,
          }}
        />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'block', fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600, color: on ? T.cream : T.dim }}>
            {t('screens.great.flag')}
          </span>
          {/* La date de reconnaissance : le seul truc intéressant quand la marque arrive tard. */}
          {on && markedAt && (
            <span style={{ display: 'block', marginTop: 3, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
              {t('screens.great.recognisedIn', { date: dateStr(markedAt) })}
            </span>
          )}
          {/* L'asymétrie : l'IA suggère, elle ne fait pas entrer. */}
          {!on && radiant && (
            <span style={{ display: 'block', marginTop: 3, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
              {t('screens.great.radiantHint')}
            </span>
          )}
        </span>
      </button>

      {/* ── APRÈS, et seulement après ──────────────────────────── */}
      {on && (
        <div style={{ marginTop: 13, paddingLeft: 3, animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {GREAT_FACETS.map(f => {
              const active = fac.includes(f)
              return (
                <button
                  key={f}
                  onClick={() => toggleFacet(f)}
                  aria-pressed={active}
                  style={{
                    padding: '8px 14px', borderRadius: SCALE.radiusPill, cursor: 'pointer',
                    fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 500,
                    background: active ? 'rgba(201,168,106,0.14)' : 'transparent',
                    border: active ? `1px solid ${T.gold}66` : `0.5px solid ${T.line}`,
                    color: active ? T.cream : T.faint,
                    transition: `all ${MOTION.fade}ms ${MOTION.ease}`,
                  }}
                >
                  {t(`screens.great.facet.${f}`)}
                </button>
              )
            })}
          </div>

          {!openNote && !noteVal ? (
            <button
              onClick={() => setOpenNote(true)}
              style={{ marginTop: 10, background: 'none', border: 'none', padding: '6px 3px', cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.meta, color: T.dim }}
            >
              {t('screens.great.addNote')}
            </button>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.faint, marginBottom: 8 }}>
                {t('screens.great.noteKicker')}
              </div>
              <textarea
                autoFocus={openNote && !noteVal}
                value={noteVal}
                maxLength={600}
                onChange={e => onNote(e.target.value)}
                placeholder={t('screens.great.notePlaceholder')}
                style={{
                  width: '100%', minHeight: 89, padding: 13, borderRadius: SCALE.radius,
                  background: T.card, border: T.cardBorder, color: T.ink,
                  fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', lineHeight: 1.618,
                  resize: 'vertical',
                }}
              />
              {saved && (
                <div style={{ marginTop: 6, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
                  {t('screens.great.noteSaved')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
