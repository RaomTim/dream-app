'use client'

/**
 * MirrorWhatISaid — le miroir, mode « ce que j'en ai dit ».
 *
 * L'app ne dit rien d'elle-même. Elle pose les phrases du rêveur côte à côte,
 * elle les date, et elle se tait. Loi : `DOCTRINE-MIROIR.md` §9 (« le miroir est
 * beau par MONTAGE, pas par écriture ») et §10 (ce mode = zéro prose générée).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * LE DESSIN, ET CE QU'IL DÉFEND
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * LA DATE EST UN PERSONNAGE. C'est la seule chose à l'écran qui ait le droit
 * d'être grande à côté de ses phrases. « septembre 2024 » en Cormorant 34, et
 * l'écart entre deux cartes écrit en clair sur le filet — « vingt-deux mois
 * plus tard ». Ce que l'IA n'a pas le droit de faire, le temps le fait tout
 * seul, gratuitement, et mieux.
 *
 * DEUX GRAMMAIRES, ET RIEN ENTRE LES DEUX.
 *   · LA LIGNE — un filet vertical relie les cartes, du haut vers le bas. Il
 *     n'apparaît QUE si chaque lecture citée est fiablement datée. Le filet est
 *     une affirmation sur le temps : il ne se dessine que quand elle est vraie.
 *   · LE PÊLE-MÊLE — dès qu'une seule lecture flotte hors du temps, le filet
 *     disparaît, les cartes se posent en quinconce légère (±0,382° — φ⁻²), et
 *     l'écran dit « sans ordre ». Personne ne peut lire une chronologie dans
 *     des papiers posés sur une table.
 *   42 des 64 rêves de Tim sont dans ce cas. Le pêle-mêle n'est pas le mode
 *   dégradé : c'est le mode honnête pour les deux tiers du corpus.
 *
 * LA DERNIÈRE CARTE EST VIDE. « aujourd'hui — » et un champ. C'est ce qui
 * empêche le dispositif d'être un musée : il peut ajouter une lecture de
 * maintenant à côté de celles d'il y a deux ans, et elle reviendra dans les
 * montages suivants, à sa date. Aucun bouton « analyser », aucune relance si
 * le champ reste vide.
 *
 * CE QUE L'APP DIT D'ELLE-MÊME, EN TOUT ET POUR TOUT : « Ce sont tes phrases.
 * Je ne les commente pas. » Le « je » n'est employé que pour dire ce qu'elle ne
 * fait pas (§9, règle du « je »).
 *
 * ⚠️ AUCUN de ces textes ne caractérise le rêveur. Pas de « on dirait que »,
 * pas de « tu as évolué », pas de compteur nu. Un nombre ne sort qu'accompagné
 * de sa période (§7, règle des nombres) — d'où l'absence totale de chiffre sur
 * les fils non datés : sans période à lui adjoindre, le nombre ne sort pas.
 *
 * φ/Fibonacci : espacements 8/13/21/34/55/89/144, durées 233/377/610,
 * line-height 1.618, radius 13/21. Tokens de `src/lib/dream-design.ts`
 * uniquement — aucune couleur inventée.
 *
 * Yeshua (Opus, G2), 2026-07-26.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T, SCALE, MOTION } from '@/lib/dream-design'
import type { MirrorThread, MirrorReading } from '@/lib/mirror/what-i-said'

type Payload = {
  threads: MirrorThread[]
  reason?: 'no_readings' | 'no_recurrence'
  readingsCount?: number
  dreamsCount?: number
  undatedDreams?: number
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

/* ─────────────────────────── le temps, écrit ─────────────────────────── */

function monthYear(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      month: 'long', year: 'numeric',
    })
  } catch { return iso.slice(0, 7) }
}
function fullDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return iso.slice(0, 10) }
}
/** L'écart entre deux cartes, en toutes lettres. C'est LA phrase qui fait le
 *  travail — et elle est purement factuelle, donc permise. */
function gapLabel(a: string, b: string, t: (k: string, v?: any) => string): string | null {
  const months = Math.round((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 1) return t('screens.mirror.gapSameMonth')
  if (months < 12) return t('screens.mirror.gapMonths', { n: months })
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (rest === 0) return years === 1 ? t('screens.mirror.gapOneYear') : t('screens.mirror.gapYears', { n: years })
  return t('screens.mirror.gapYearsMonths', { y: years, m: rest })
}

/* ─────── la citation, avec le mot d'ancre rendu visible ───────
 * Le surlignage n'est PAS un commentaire : c'est ce qui est commun aux
 * citations, rendu lisible. C'est exactement le montage, et rien de plus. */
function Quote({ r, dim = false }: { r: MirrorReading; dim?: boolean }) {
  const base: React.CSSProperties = {
    fontFamily: T.serif, fontSize: SCALE.bodyLg, lineHeight: 1.618,
    color: dim ? T.dim : T.ink, margin: 0,
  }
  if (!r.match) return <p style={base}>{`« ${r.quote} »`}</p>
  const { start, end } = r.match
  return (
    <p style={base}>
      {'« '}
      {r.quote.slice(0, start)}
      <span style={{ color: T.cream, borderBottom: `1px solid ${T.gold}66`, paddingBottom: 1 }}>
        {r.quote.slice(start, end)}
      </span>
      {r.quote.slice(end)}
      {' »'}
    </p>
  )
}

/* ─────────────────────────── une carte ─────────────────────────── */

function ReadingCard({
  r, locale, t, tilt, showDate,
}: { r: MirrorReading; locale: string; t: any; tilt: number; showDate: boolean }) {
  return (
    <article
      style={{
        background: T.card, border: T.cardBorder, borderRadius: SCALE.radius,
        padding: '21px 21px 21px', transform: tilt ? `rotate(${tilt}deg)` : undefined,
      }}
    >
      {/* LA DATE — le personnage principal quand elle existe.
          ⚠️ Vu au rendu (26/07) : la raison du flou (« déposé le 19 avril 2026,
          la date du rêve n'a jamais été posée ») était répétée sur CHAQUE carte.
          Quatre fois la même explication noyaient les quatre citations — et sur
          cet écran, la citation est le sujet. La raison remonte une seule fois,
          au niveau du fil ; la carte ne garde que « date inconnue ». */}
      {showDate ? (
        <div style={{
          fontFamily: T.display, fontSize: 28, fontWeight: 400, color: T.cream,
          lineHeight: 1.272, letterSpacing: '0.01em',
        }}>
          {monthYear(r.occurredAt, locale)}
        </div>
      ) : (
        <div style={{ fontFamily: T.display, fontSize: 22, fontStyle: 'italic', color: T.faint, lineHeight: 1.272 }}>
          {t('screens.mirror.undated')}
        </div>
      )}

      {r.dreamTitle && (
        <div style={{ marginTop: 8, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint, letterSpacing: '0.02em' }}>
          {r.dreamTitle}
        </div>
      )}
      {r.source === 'today' && (
        <div style={{ marginTop: 8, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint }}>
          {t('screens.mirror.yourReadingLabel')}
        </div>
      )}

      <div style={{ marginTop: 13 }}>
        <Quote r={r} />
      </div>
    </article>
  )
}

/* ─────────────────────────── un fil ─────────────────────────── */

function Thread({
  th, session, locale, t, onAdded,
}: { th: MirrorThread; session: Session; locale: string; t: any; onAdded: () => void }) {
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const isLine = th.grammar === 'ligne'

  const factLine = useMemo(() => {
    if (isLine && th.span) {
      return t('screens.mirror.factDated', {
        n: th.readings.length,
        from: monthYear(th.span.from, locale),
        to: monthYear(th.span.to, locale),
      })
    }
    return t('screens.mirror.factUndated')
  }, [isLine, th, locale, t])

  /* La raison du flou, dite UNE fois pour le fil. Les jours de dépôt sont un
     fait vérifiable (`created_at`), à la différence de la date du rêve. */
  const factWhen = useMemo(() => {
    if (isLine) return null
    const days = Array.from(new Set(
      th.readings.filter((r) => !r.dated && r.depositedAt).map((r) => (r.depositedAt as string).slice(0, 10))
    )).sort()
    if (days.length === 0) return null
    let dates: string
    if (days.length === 1) {
      dates = t('screens.mirror.depositedOn', { d: fullDate(days[0], locale) })
    } else if (days.every((d) => d.slice(0, 7) === days[0].slice(0, 7))) {
      // Même mois : « les 19 et 20 avril 2026 » plutôt que « entre le
      // 19 avril 2026 et le 20 avril 2026 », qui répète deux fois le mois.
      dates = t('screens.mirror.depositedSameMonth', {
        days: days.map((d) => Number(d.slice(8, 10))).join(locale === 'en' ? ' and ' : ' et '),
        my: monthYear(days[0], locale),
      })
    } else {
      dates = t('screens.mirror.depositedBetween', {
        a: fullDate(days[0], locale), b: fullDate(days[days.length - 1], locale),
      })
    }
    return t('screens.mirror.factUndatedWhen', { dates })
  }, [isLine, th, locale, t])

  const save = useCallback(async () => {
    const v = draft.trim()
    if (!v || saving) return
    setSaving(true)
    try {
      await apiPost('/api/mvp/mirror/said', {
        anchor_slug: th.anchorSlug,
        anchor_label: th.anchor,
        body: v,
        cited_layer_ids: th.readings.map((r) => r.id),
      }, session)
      setSaved(true)
      setDraft('')
      onAdded()
    } catch { /* silence : on ne rend pas une erreur bavarde sur cet écran */ }
    finally { setSaving(false) }
  }, [draft, saving, th, session, onAdded])

  return (
    <section style={{ marginTop: 89, animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
      {/* ── L'ANCRE. Le mot, nu. Pas de phrase, pas de glose. ── */}
      <h2 style={{
        margin: 0, fontFamily: T.display, fontSize: SCALE.display, fontWeight: 400,
        fontStyle: 'italic', color: T.cream, lineHeight: 1.272,
      }}>
        {th.anchor}
      </h2>
      <div style={{ marginTop: 8, fontFamily: T.sans, fontSize: SCALE.small, color: T.faint, lineHeight: 1.618 }}>
        {factLine}
      </div>
      {factWhen && (
        <div style={{ marginTop: 5, fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint, lineHeight: 1.618 }}>
          {factWhen}
        </div>
      )}

      {/* ── LES CARTES ── */}
      <div style={{ marginTop: 34, position: 'relative' }}>
        {/* LE FILET — une affirmation sur le temps. Il ne se dessine que
            lorsqu'elle est vraie (toutes les dates fiables). */}
        {/* ⚠️ Vu au rendu (26/07) : à rgba(255,255,255,.08), le filet était
            invisible à l'écran. Or toute la grammaire « ligne » repose sur lui —
            sans filet, quatre cartes datées ne forment plus une ligne, juste une
            pile. Remonté à .13 : toujours discret, mais il existe. */}
        {isLine && (
          <div aria-hidden style={{
            position: 'absolute', left: 3, top: 13, bottom: 13, width: 1,
            background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.13) 8%, rgba(255,255,255,0.13) 92%, transparent)',
          }} />
        )}
        <div style={{ paddingLeft: isLine ? 34 : 0 }}>
          {th.readings.map((r, i) => {
            const prev = i > 0 ? th.readings[i - 1] : null
            /* Quinconce du pêle-mêle : ±0,382° = φ⁻². Assez pour dire « posé »,
               trop peu pour crier « scrapbook ». Alterné, jamais aléatoire —
               un désordre aléatoire changerait à chaque montage et donnerait
               l'impression que l'app bouge les papiers. */
            const tilt = isLine ? 0 : (i % 2 === 0 ? -0.382 : 0.382)
            return (
              <div key={r.id} style={{ marginTop: i === 0 ? 0 : 34, position: 'relative' }}>
                {/* Décalé de 13px pour que le filet passe PROPREMENT à sa
                    gauche. À left:-34 il traversait le premier caractère, et ça
                    se lisait comme un accident de mise en page. */}
                {isLine && prev && (
                  <div style={{
                    position: 'absolute', left: -21, top: -26, width: 220,
                    fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint,
                    letterSpacing: '0.04em',
                  }}>
                    {gapLabel(prev.occurredAt, r.occurredAt, t)}
                  </div>
                )}
                {isLine && (
                  <div aria-hidden style={{
                    position: 'absolute', left: -34, top: 26, width: 8, height: 8,
                    marginLeft: -1, borderRadius: '50%', background: T.moonGlyph, opacity: 0.61,
                  }} />
                )}
                <ReadingCard r={r} locale={locale} t={t} tilt={tilt} showDate={r.dated} />
              </div>
            )
          })}

          {/* ── LA CARTE VIDE — ce qui rend le dispositif vivant ── */}
          <div style={{ marginTop: 34, position: 'relative' }}>
            {isLine && (
              <div aria-hidden style={{
                position: 'absolute', left: -34, top: 26, width: 8, height: 8,
                marginLeft: -1, borderRadius: '50%',
                border: `1px solid ${T.moonGlyph}`, opacity: 0.61,
              }} />
            )}
            <div style={{
              background: 'transparent', border: `1px dashed rgba(255,255,255,0.11)`,
              borderRadius: SCALE.radius, padding: 21,
            }}>
              <label
                htmlFor={`mirror-today-${th.anchorSlug}`}
                style={{ display: 'block', fontFamily: T.display, fontSize: 28, color: T.dim, lineHeight: 1.272 }}
              >
                {t('screens.mirror.today')}
              </label>
              <textarea
                id={`mirror-today-${th.anchorSlug}`}
                value={draft}
                onChange={(e) => { setDraft(e.target.value); setSaved(false) }}
                rows={3}
                placeholder={t('screens.mirror.todayPlaceholder')}
                style={{
                  marginTop: 13, width: '100%', resize: 'vertical', minHeight: 89,
                  background: 'transparent', border: 'none', outline: 'none',
                  fontFamily: T.serif, fontSize: SCALE.bodyLg, lineHeight: 1.618, color: T.ink,
                }}
              />
              {draft.trim().length > 0 && (
                <button
                  onClick={save}
                  disabled={saving}
                  style={{
                    marginTop: 13, minHeight: SCALE.touch, padding: '11px 21px',
                    borderRadius: SCALE.radiusPill, cursor: saving ? 'default' : 'pointer',
                    background: T.gold, border: 'none', color: T.onGold,
                    fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600,
                    opacity: saving ? 0.61 : 1,
                  }}
                >
                  {t('screens.mirror.keep')}
                </button>
              )}
              {/* Accusé, pas compliment. « gardé » — un mot, et rien d'autre. */}
              {saved && draft.length === 0 && (
                <div style={{ marginTop: 13, fontFamily: T.sans, fontSize: SCALE.small, color: T.faint }}>
                  {t('screens.mirror.kept')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Les lectures que la ligne ne peut pas accueillir. Dit ici, pas caché. */}
      {th.undatedHeld > 0 && (
        <div style={{
          marginTop: 21, paddingLeft: isLine ? 34 : 0,
          fontFamily: T.sans, fontSize: SCALE.meta, color: T.faint, lineHeight: 1.618,
        }}>
          {th.undatedHeld === 1
            ? t('screens.mirror.heldOne')
            : t('screens.mirror.held', { n: th.undatedHeld })}
        </div>
      )}

      {/* ── LA SEULE LIGNE DE L'APP ── */}
      <div style={{
        marginTop: 34, paddingLeft: isLine ? 34 : 0,
        fontFamily: T.serif, fontSize: SCALE.body, fontStyle: 'italic',
        color: T.faint, lineHeight: 1.618,
      }}>
        {t('screens.mirror.appLine')}
      </div>
    </section>
  )
}

/* ─────────────────────────── l'écran ─────────────────────────── */

export default function MirrorWhatISaid({
  session, onBack,
}: { session: Session; onBack?: () => void }) {
  const { t, locale } = useT()
  const [data, setData] = useState<Payload | null>(null)

  const load = useCallback(() => {
    apiGet('/api/mvp/mirror/said', session)
      .then((j) => setData(j))
      .catch(() => setData({ threads: [], reason: 'no_readings' }))
  }, [session])

  useEffect(() => { load() }, [load])

  return (
    <div style={{ minHeight: '100dvh', paddingBottom: 144 }}>
      <div style={{ paddingTop: 55, paddingLeft: 21, paddingRight: 21, display: 'flex', alignItems: 'center', gap: 13 }}>
        {onBack && (
          <button onClick={onBack} aria-label={t('screens.common.back')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, minHeight: SCALE.touch }}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
              <path d="M15 5l-7 7 7 7" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <div style={{ padding: '0 21px', maxWidth: 610, margin: '0 auto' }}>
        <h1 style={{
          margin: 0, marginTop: 21, fontFamily: T.serif, fontSize: SCALE.titleLg,
          fontStyle: 'italic', fontWeight: 400, color: T.cream, lineHeight: 1.272,
        }}>
          {t('screens.mirror.title')}
        </h1>

        {data === null ? null /* jamais de spinner brut */ : data.threads.length === 0 ? (
          /* ── LE REFUS. Motivé, daté, sans excuse et sans promesse (§9, ex. 5). ── */
          <div style={{ marginTop: 89, animation: `dream-fade-in ${MOTION.fade}ms ${MOTION.ease}` }}>
            <div style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', color: T.dim, lineHeight: 1.618 }}>
              {t('screens.mirror.emptyL1')}
            </div>
            <div style={{ marginTop: 21, fontFamily: T.sans, fontSize: SCALE.body, color: T.faint, lineHeight: 1.618 }}>
              {data.reason === 'no_recurrence'
                ? t('screens.mirror.emptyNoRecurrence')
                : t('screens.mirror.emptyNoReadings')}
            </div>
          </div>
        ) : (
          <>
            {data.threads.map((th) => (
              <Thread key={th.anchorSlug} th={th} session={session} locale={locale} t={t} onAdded={load} />
            ))}

            {/* Les rêves hors du temps — dit une fois, en bas, et accompagné du
                geste qui répare. Jamais présenté comme un manque du rêveur. */}
            {(data.undatedDreams ?? 0) > 0 && (
              <div style={{
                marginTop: 89, paddingTop: 21, borderTop: `1px solid ${T.line}`,
                fontFamily: T.sans, fontSize: SCALE.small, color: T.faint, lineHeight: 1.618,
              }}>
                {t('screens.mirror.undatedFootnote', { n: data.undatedDreams ?? 0 })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
