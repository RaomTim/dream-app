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
  compact,
  mark,
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
  /** 2026-07-26 — la marque vit dans l'EN-TÊTE de la fiche, plus dans une section.
   *  Marquer un grand rêve est un geste SUR le rêve, d'une seule touche, réversible :
   *  ça n'a jamais mérité une carte pleine largeur au milieu d'un écran de lecture.
   *  En compact, il ne reste que le disque — et, une fois marqué, la double date. */
  compact?: boolean
  /** `false` = ne rends PAS le geste de marquage, seulement ce qui vient après
   *  (la double date + « pourquoi celui-là »). Sert sur la fiche, où le disque
   *  vit dans l'en-tête. Par défaut le composant rend les deux, comme avant. */
  mark?: boolean
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

  /* 2026-07-26 — D11 tranchée par Tim : « la nuance "ça m'a changé" — on la
     supprime ». Les trois facettes (change · force · ouvert) ne s'affichent
     plus. La colonne `great_dream_facets` reste en base et reste transmise
     telle quelle par `onChange` : on retire un écran, on ne détruit pas une
     donnée qu'un rêveur aurait déjà posée. */

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

  /* ── LE DISQUE, seul ──────────────────────────────────────
     Pas une étoile : une étoile appelle une note, et l'app ne note rien
     (§2.4). Un disque qui s'allume, comme la lune de l'accueil en plus petit —
     c'est le même geste, à l'échelle d'un seul rêve. */
  const disc = (lit: boolean) => (
    <span
      aria-hidden
      style={{
        width: 21, height: 21, borderRadius: '50%', flexShrink: 0, display: 'block',
        background: lit ? `radial-gradient(circle at 38% 32%, ${T.goldLit} 0%, ${T.gold} 62%, #a8874e 100%)` : 'transparent',
        border: lit ? 'none' : `1px solid ${T.gold}55`,
        boxShadow: lit ? '0 0 13px 3px rgba(224,192,135,0.30)' : 'none',
        transition: `background ${MOTION.fade}ms ${MOTION.ease}, box-shadow ${MOTION.fade}ms ${MOTION.ease}`,
      }}
    />
  )

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-pressed={on}
        aria-label={t('screens.great.flag')}
        title={on && markedAt ? t('screens.great.recognisedIn', { date: dateStr(markedAt) }) : t('screens.great.flag')}
        style={{
          minWidth: SCALE.touch, minHeight: SCALE.touch, display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 4,
          /* l'invitation de l'IA ne fait pas entrer : elle allume à peine le contour */
          opacity: on ? 1 : radiant ? 0.75 : 0.45,
        }}
      >
        {disc(on)}
      </button>
    )
  }

  /* `mark` = « la marque est ailleurs, ne me rends que ce qui vient APRÈS ».
     Sur la fiche, le disque est dans l'en-tête (compact) et ce bloc-ci se pose
     sous le seuil, avec les autres écritures du rêveur — « ce que j'ai gardé »,
     la lecture conservée. C'est sa famille : ce sont ses mots, pas une fonction.
     Rien tant que le rêve n'est pas marqué. */
  if (mark === false && !on) return null

  return (
    <div style={{ marginTop: 34 }}>
      {/* ── LE GESTE ──────────────────────────────────────────── */}
      {mark !== false && (
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
          background: on ? 'rgba(255,255,255,0.1)' : 'transparent',
          border: on ? `1px solid ${T.gold}66` : T.cardBorder,
          transition: `background ${MOTION.fade}ms ${MOTION.ease}, border-color ${MOTION.fade}ms ${MOTION.ease}`,
        }}
      >
        {disc(on)}
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
      )}

      {/* ── APRÈS, et seulement après ──────────────────────────── */}
      {on && (
        <div style={{ marginTop: mark === false ? 0 : 13, paddingLeft: 3, animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
          {/* La double date — « rêvé en mars 2019 · reconnu en juillet 2026 ».
              C'est le seul fait vraiment intéressant qu'un journal de grands
              rêves puisse raconter (BRIEF §4.6), donc il ne se cache pas
              derrière un titre : il ouvre le bloc. */}
          {mark === false && markedAt && (
            <div style={{ fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint, marginBottom: 10 }}>
              {t('screens.great.recognisedIn', { date: dateStr(markedAt) })}
            </div>
          )}
          {!openNote && !noteVal ? (
            <button
              onClick={() => setOpenNote(true)}
              style={{ marginTop: 10, background: 'none', border: 'none', padding: '6px 3px', cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.meta, color: T.dim }}
            >
              {t('screens.great.addNote')}
            </button>
          ) : (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.faint, marginBottom: 8 }}>
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
