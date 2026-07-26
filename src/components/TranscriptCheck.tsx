'use client'

/**
 * TranscriptCheck — relire la transcription d'un rêve dicté à la voix (§12ter.D).
 *
 * Sur la fiche rêve (J3), pour un dépôt VOCAL, une ligne discrète « Vérifier la
 * transcription ». Au tap, l'IA (route /api/mvp/transcript-check) relit le texte et
 * repère les passages qui ne font pas sens (mots mal entendus au réveil). On passe
 * alors une petite série de questions — UNE À LA FOIS — chaleureuses, jamais
 * culpabilisantes. Le rêveur répond (réécrit le passage) ou confirme (« c'était bien
 * ça »). À la fin, le texte corrigé est proposé en diff simple (ancien barré doux →
 * nouveau) ; « Valider la transcription » enregistre.
 *
 * L'audio d'origine reste la référence (le lecteur audio vit ailleurs sur la fiche).
 * Cette relecture ne réécrit jamais d'office : c'est le rêveur qui tranche.
 *
 * Persistance : PATCH /api/kairos/[id] { raw_text?: <corrigé>, transcript_verified: true }.
 * Le raw_text corrigé passe par la whitelist existante. Le drapeau transcript_verified
 * est best-effort (voir migration 2026-07-22_transcript_verified.sql) ; en attendant son
 * câblage serveur, la ligne se masque en local via onVerified() → l'UX reste propre.
 *
 * Vocabulaire §0.1 : mots simples, aucun terme banni. Tokens de style : dream-design (aucun hex).
 *
 * Yeshua (Opus), 2026-07-22.
 */

import { useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT, currentLocale } from '@/lib/i18n'
/* 2026-07-26 (passe design A4) — `T` ne porte QUE la couleur et la typographie ;
   la géométrie (radius, plancher de corps, cible tactile) vit dans `SCALE`.
   Ce fichier lisait `T.radius` / `T.radiusPill`, qui n'existent pas : 3 erreurs
   TS2339 qui cassaient `tsc --noEmit` sur TOUT le projet. */
import { T, SCALE } from '@/lib/dream-design'

type Issue = { quote: string; question: string }
type Answer = { quote: string; replacement: string | null } // replacement=null → gardé tel quel

type Phase = 'idle' | 'checking' | 'clean' | 'qa' | 'review' | 'saving' | 'done' | 'error'

async function tcFetch(path: string, opts: RequestInit, session: Session | null) {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  headers['X-Dream-Lang'] = currentLocale()
  const res = await fetch(path, { ...opts, headers })
  return res
}

// Remplace la PREMIÈRE occurrence de `find` par `repl` (les citations sont des extraits
// verbatim distincts ; on ne touche jamais deux fois au même segment).
function replaceFirst(text: string, find: string, repl: string): string {
  const at = text.indexOf(find)
  if (at === -1) return text
  return text.slice(0, at) + repl + text.slice(at + find.length)
}

export default function TranscriptCheck({
  session, kairosId, rawText, onVerified,
}: {
  session: Session
  kairosId: string
  rawText: string
  /** Appelé après validation. newText = texte corrigé, ou null si aucun changement (simple vérification). */
  onVerified: (newText: string | null) => void
}) {
  const { t } = useT()
  const [phase, setPhase] = useState<Phase>('idle')
  const [issues, setIssues] = useState<Issue[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [idx, setIdx] = useState(0)
  const [draft, setDraft] = useState('')

  const startCheck = async () => {
    setPhase('checking')
    try {
      const res = await tcFetch('/api/mvp/transcript-check', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId }) }, session)
      const j = await res.json().catch(() => ({}))
      if (!res.ok) { setPhase('error'); return }
      const list: Issue[] = Array.isArray(j.issues) ? j.issues : []
      if (j.clean || list.length === 0) {
        setPhase('clean')
        return
      }
      setIssues(list)
      setAnswers([])
      setIdx(0)
      setDraft('')
      setPhase('qa')
    } catch {
      setPhase('error')
    }
  }

  const answerCurrent = (replacement: string | null) => {
    const cur = issues[idx]
    const next = [...answers, { quote: cur.quote, replacement }]
    setAnswers(next)
    setDraft('')
    if (idx + 1 < issues.length) {
      setIdx(idx + 1)
    } else {
      setPhase('review')
    }
  }

  // texte corrigé + liste des changements réellement appliqués
  const changes = answers.filter(a => a.replacement != null && a.replacement.trim().length > 0 && a.replacement.trim() !== a.quote)
    .map(a => ({ quote: a.quote, replacement: a.replacement!.trim() }))
  let corrected = rawText
  for (const c of changes) corrected = replaceFirst(corrected, c.quote, c.replacement)
  const hasChange = changes.length > 0 && corrected !== rawText

  const save = async () => {
    setPhase('saving')
    const payload: Record<string, any> = { transcript_verified: true }
    if (hasChange) payload.raw_text = corrected
    try {
      const res = await tcFetch(`/api/kairos/${kairosId}`, { method: 'PATCH', body: JSON.stringify(payload) }, session)
      // Si on a corrigé le texte, la sauvegarde DOIT réussir (raw_text). Sinon on n'envoie
      // que le drapeau (best-effort tant que la whitelist serveur n'est pas câblée) → on
      // ignore un éventuel 400 et on masque la ligne en local.
      if (hasChange && !res.ok) { setPhase('review'); return }
    } catch {
      if (hasChange) { setPhase('review'); return }
    }
    setPhase('done')
    onVerified(hasChange ? corrected : null)
    // Après le remerciement, la ligne disparaît (onVerified a mis à jour la fiche).
  }

  const reset = () => { setPhase('idle'); setIssues([]); setAnswers([]); setIdx(0); setDraft('') }

  // ── styles locaux (tokens dream-design, aucun hex) ─────────────────────────────
  const wrap: React.CSSProperties = { marginTop: 22 }
  const kicker: React.CSSProperties = { fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.faint, marginBottom: 12 }
  const cardStyle: React.CSSProperties = { padding: '17px 18px', borderRadius: SCALE.radius, background: T.card, border: T.cardBorder }
  const quoteChip: React.CSSProperties = { fontFamily: T.serif, fontStyle: 'italic', fontSize: SCALE.body, color: T.cream, lineHeight: 1.5 }
  const primaryBtn: React.CSSProperties = { flex: 1, minHeight: SCALE.touch, padding: '13px 17px', borderRadius: SCALE.radiusPill, background: 'rgba(255,255,255,0.14)', border: `1px solid ${T.gold}66`, cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 600, color: T.cream }
  const ghostBtn: React.CSSProperties = { flex: 1, minHeight: SCALE.touch, padding: '13px 17px', borderRadius: SCALE.radiusPill, background: 'transparent', border: `1px solid ${T.line}`, cursor: 'pointer', fontFamily: T.sans, fontSize: SCALE.body, fontWeight: 500, color: T.dim }
  const inputStyle: React.CSSProperties = { width: '100%', boxSizing: 'border-box', marginTop: 13, padding: '11px 13px', borderRadius: SCALE.radius, background: 'rgba(202,191,206,0.04)', border: `1px solid ${T.line}`, color: T.ink, fontFamily: T.sans, fontSize: SCALE.body, lineHeight: 1.5, resize: 'vertical', outline: 'none' }

  // ── IDLE : la ligne discrète ───────────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div style={wrap}>
        <button
          onClick={startCheck}
          style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}
        >
          <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 500, color: T.gold, borderBottom: `1px dotted ${T.gold}66`, paddingBottom: 1 }}>{t('core.transcriptCheck.line')}</span>
          <span style={{ display: 'block', marginTop: 4, fontFamily: T.sans, fontSize: 12.5, color: T.faint, lineHeight: 1.4 }}>{t('core.transcriptCheck.lineSub')}</span>
        </button>
      </div>
    )
  }

  // ── CHECKING ─────────────────────────────────────────────────────────────────
  if (phase === 'checking') {
    return (
      <div style={wrap}>
        <div style={{ ...cardStyle, fontFamily: T.serif, fontStyle: 'italic', fontSize: 16, color: T.dim }}>{t('core.transcriptCheck.checking')}</div>
      </div>
    )
  }

  // ── ERROR ──────────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div style={wrap}>
        <div style={cardStyle}>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 16, color: T.dim, marginBottom: 12 }}>{t('core.transcriptCheck.errorLine')}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={startCheck} style={primaryBtn}>{t('core.transcriptCheck.retry')}</button>
            <button onClick={reset} style={ghostBtn}>{t('core.transcriptCheck.cancel')}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── CLEAN : rien à corriger ─────────────────────────────────────────────────────
  if (phase === 'clean') {
    return (
      <div style={wrap}>
        <div style={cardStyle}>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.cream, lineHeight: 1.5, marginBottom: 14 }}>{t('core.transcriptCheck.clean')}</div>
          <button onClick={save} style={primaryBtn}>{t('core.transcriptCheck.gotIt')}</button>
        </div>
      </div>
    )
  }

  // ── QA : une question à la fois ─────────────────────────────────────────────────
  if (phase === 'qa') {
    const cur = issues[idx]
    return (
      <div style={wrap}>
        <div style={cardStyle}>
          <div style={{ fontFamily: T.sans, fontSize: SCALE.kicker, fontWeight: 600, letterSpacing: '0.2em', color: T.faint, marginBottom: 12 }}>{t('core.transcriptCheck.progress', { n: idx + 1, total: issues.length })}</div>
          <div style={quoteChip}>{cur.question}</div>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={t('core.transcriptCheck.placeholder')}
            rows={2}
            style={inputStyle}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={() => answerCurrent(null)} style={ghostBtn}>{t('core.transcriptCheck.keep')}</button>
            <button
              onClick={() => answerCurrent(draft.trim() ? draft.trim() : null)}
              disabled={!draft.trim()}
              style={{ ...primaryBtn, opacity: draft.trim() ? 1 : 0.4, cursor: draft.trim() ? 'pointer' : 'default' }}
            >{t('core.transcriptCheck.fix')}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── REVIEW : le texte corrigé, diff simple ──────────────────────────────────────
  if (phase === 'review' || phase === 'saving') {
    return (
      <div style={wrap}>
        <div style={cardStyle}>
          {hasChange ? (
            <>
              <div style={kicker}>{t('core.transcriptCheck.reviewKicker')}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {changes.map((c, i) => (
                  <div key={i} style={{ fontFamily: T.serif, fontSize: 16, lineHeight: 1.5 }}>
                    <span style={{ color: T.dim, textDecoration: 'line-through', textDecorationColor: T.faint }}>{c.quote}</span>
                    <span style={{ color: T.faint, margin: '0 8px' }}>→</span>
                    <span style={{ color: T.goldLit, fontStyle: 'italic' }}>{c.replacement}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.6, color: T.ink, whiteSpace: 'pre-wrap', marginBottom: 16, paddingTop: 14, borderTop: `1px solid ${T.line}` }}>{corrected}</div>
            </>
          ) : (
            <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.cream, lineHeight: 1.5, marginBottom: 16 }}>{t('core.transcriptCheck.reviewNoChange')}</div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={reset} style={ghostBtn} disabled={phase === 'saving'}>{t('core.transcriptCheck.cancel')}</button>
            <button onClick={save} style={{ ...primaryBtn, opacity: phase === 'saving' ? 0.5 : 1 }} disabled={phase === 'saving'}>{t('core.transcriptCheck.validate')}</button>
          </div>
        </div>
      </div>
    )
  }

  // ── DONE : bref remerciement (la ligne va disparaître via onVerified) ────────────
  if (phase === 'done') {
    return (
      <div style={wrap}>
        <div style={{ ...cardStyle, fontFamily: T.serif, fontStyle: 'italic', fontSize: 16, color: T.dim }}>{t('core.transcriptCheck.done')}</div>
      </div>
    )
  }

  return null
}
