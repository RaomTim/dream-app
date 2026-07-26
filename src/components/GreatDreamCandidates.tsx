'use client'

/**
 * GreatDreamCandidates — « ceux qui ressortent ».
 *
 * L'app a parcouru le corpus et propose. Le rêveur review. C'est tout.
 *
 * ── CE QUI EST INTERDIT À CET ÉCRAN, et pourquoi ───────────────────────────
 * • Ne jamais écrire « ce rêve est un grand rêve ». L'app n'a pas autorité pour
 *   ça (1_BIBLE §3.13.3). Le mot employé est **« ressort »** — un fait sur le
 *   corpus (il se détache des autres), pas un verdict sur le rêve.
 * • Ne jamais afficher de score, de rang, de pourcentage, de compteur de
 *   progression (§0.5 : zéro score, zéro classement). Le relief existe en base,
 *   il ne monte jamais à l'écran : un chiffre transformerait une proposition en
 *   jugement.
 * • Ne jamais dire ce que le rêve veut dire. On montre **l'image** — ce qui se
 *   passe dedans — et on se tait. C'est l'épistrophè de Hillman, et c'est ce qui
 *   distingue « tendre le rêve » (Aizenstat) de « le matraquer pour le remonter
 *   au grand jour ».
 *
 * ── LE GESTE ────────────────────────────────────────────────────────────────
 * Trois réponses, et la troisième est la plus importante : **oui**, **non**, et
 * **ne rien faire**. Fermer l'écran est une réponse valide ; rien ne se passe,
 * rien n'insiste, la proposition attend. Aucun « plus tard », aucun rappel,
 * aucune relance : « non » veut dire qu'on ne repropose plus ce rêve, jamais.
 * Le rêve reste marquable à la main sur sa fiche — un rêve peut devenir grand
 * dans dix ans (§3.13.1), rien ici ne le ferme.
 *
 * Yeshua (Opus, agent B3), 2026-07-26.
 */

import { useCallback, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T, SCALE, MOTION } from '@/lib/dream-design'

export type Candidate = {
  id: string
  kairos_id: string
  image: string | null
  title: string | null
  excerpt: string
  created_at: string | null
  status: string
}

function authHeaders(session: Session): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (session?.access_token) h['Authorization'] = `Bearer ${session.access_token}`
  return h
}

export default function GreatDreamCandidates({
  session,
  onOpenDream,
  onMarked,
}: {
  session: Session
  /** ouvrir la fiche du rêve — la proposition n'est pas un substitut au rêve */
  onOpenDream?: (kairosId: string) => void
  /** un rêve vient d'entrer dans le journal : rafraîchir la liste du parent */
  onMarked?: (kairosId: string) => void
}) {
  const { t, locale } = useT()
  const [cands, setCands] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [firstDone, setFirstDone] = useState(false)
  const [corpusReady, setCorpusReady] = useState(true)
  const [silence, setSilence] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/great-dreams/candidates', { headers: authHeaders(session) })
      const j = await r.json()
      setCands(j.candidates || [])
      setFirstDone(!!j.first_review_done)
      setCorpusReady(j.corpus_ready !== false)
    } catch { /* silencieux : un écran de proposition ne crie pas */ }
    setLoading(false)
  }, [session])

  useEffect(() => { load() }, [load])

  /** La première review — SOLLICITÉE. Jamais déclenchée toute seule. */
  const runFirstReview = async () => {
    setSearching(true); setSilence(false)
    try {
      const r = await fetch('/api/great-dreams/candidates', {
        method: 'POST', headers: authHeaders(session),
        body: JSON.stringify({ mode: 'first_review' }),
      })
      const j = await r.json()
      setCands(j.candidates || [])
      setSilence(!!j.silence && !(j.candidates || []).length)
      setFirstDone(true)
    } catch { setSilence(true) }
    setSearching(false)
  }

  const decide = async (c: Candidate, decision: 'accepted' | 'dismissed') => {
    setBusyId(c.id)
    setCands(prev => prev.filter(x => x.id !== c.id)) // optimiste : ça s'efface, ça ne clignote pas
    try {
      await fetch('/api/great-dreams/candidates', {
        method: 'PATCH', headers: authHeaders(session),
        body: JSON.stringify({ id: c.id, decision }),
      })
      if (decision === 'accepted') onMarked?.(c.kairos_id)
    } catch {
      setCands(prev => [c, ...prev]) // le réseau a refusé : on remet, sans drame
    }
    setBusyId(null)
  }

  const dateStr = (iso: string | null) =>
    iso ? new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) : ''

  if (loading) return null

  /* ── Rien à proposer, et pas encore de première review ──────────────────── */
  if (!cands.length) {
    // Corpus trop mince : on ne propose même pas de chercher. Le brief est
    // explicite — un corpus de quelques rêves ne contient probablement aucun
    // grand rêve détectable, et le dire vaut mieux que de faire semblant.
    if (!corpusReady) return null
    if (firstDone && !silence) return null

    return (
      <div style={{ marginTop: 34 }}>
        {silence ? (
          <p style={{ fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', lineHeight: 1.618, color: T.dim, margin: 0 }}>
            {t('screens.great.candSilence')}
          </p>
        ) : (
          <>
            <p style={{ fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic', lineHeight: 1.618, color: T.dim, margin: '0 0 13px' }}>
              {t('screens.great.candInvite')}
            </p>
            <button
              onClick={runFirstReview}
              disabled={searching}
              style={{
                padding: '11px 21px', minHeight: SCALE.touch, borderRadius: SCALE.radiusPill,
                cursor: searching ? 'default' : 'pointer',
                background: 'transparent', border: `1px solid ${T.gold}55`, color: T.cream,
                fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 500,
                opacity: searching ? 0.55 : 1,
                transition: `opacity ${MOTION.fade}ms ${MOTION.ease}`,
              }}
            >
              {searching ? t('screens.great.candSearching') : t('screens.great.candRun')}
            </button>
          </>
        )}
      </div>
    )
  }

  /* ── Les propositions ───────────────────────────────────────────────────── */
  return (
    <div style={{ marginTop: 34, animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
      <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.faint, marginBottom: 13 }}>
        {cands.length > 1 ? t('screens.great.candKickerMany') : t('screens.great.candKickerOne')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
        {cands.map(c => (
          <article
            key={c.id}
            style={{
              padding: '17px 18px', borderRadius: SCALE.radius,
              background: T.card, border: T.cardBorder,
              opacity: busyId === c.id ? 0.5 : 1,
              transition: `opacity ${MOTION.fade}ms ${MOTION.ease}`,
            }}
          >
            {/* L'IMAGE — ce qui se passe dans le rêve. Jamais ce que ça veut dire. */}
            {c.image && (
              <p style={{ fontFamily: T.serif, fontSize: SCALE.bodyLg, fontStyle: 'italic', lineHeight: 1.618, color: T.ink, margin: '0 0 13px' }}>
                {c.image}
              </p>
            )}

            <button
              onClick={() => onOpenDream?.(c.kairos_id)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none',
                border: 'none', padding: 0, cursor: onOpenDream ? 'pointer' : 'default',
              }}
            >
              <span style={{ display: 'block', fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 600, color: T.cream }}>
                {c.title || t('screens.great.untitled')}
              </span>
              <span style={{ display: 'block', marginTop: 3, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
                {dateStr(c.created_at)}
              </span>
            </button>

            <div style={{ display: 'flex', gap: 8, marginTop: 17 }}>
              <button
                onClick={() => decide(c, 'accepted')}
                disabled={busyId === c.id}
                style={{
                  flex: 1, minHeight: SCALE.touch, padding: '10px 16px', borderRadius: SCALE.radiusPill,
                  cursor: 'pointer', background: 'rgba(201,168,106,0.12)', border: `1px solid ${T.gold}66`,
                  color: T.cream, fontFamily: T.sans, fontSize: SCALE.small, fontWeight: 600,
                }}
              >
                {t('screens.great.flag')}
              </button>
              <button
                onClick={() => decide(c, 'dismissed')}
                disabled={busyId === c.id}
                style={{
                  minHeight: SCALE.touch, padding: '10px 18px', borderRadius: SCALE.radiusPill,
                  cursor: 'pointer', background: 'transparent', border: `0.5px solid ${T.line}`,
                  color: T.faint, fontFamily: T.sans, fontSize: SCALE.small,
                }}
              >
                {t('screens.great.candNo')}
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Ne rien faire est une réponse. On le dit une fois, tout bas. */}
      <p style={{ marginTop: 17, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint, lineHeight: 1.618, margin: '17px 0 0' }}>
        {t('screens.great.candNoRush')}
      </p>
    </div>
  )
}
