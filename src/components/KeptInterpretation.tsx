'use client'

/**
 * KeptInterpretation — section « Interprétation gardée » de la fiche rêve J3
 * (DREAM-MVP-SPEC-ECRANS-A-Z.md §C1bis / §J3).
 *
 * Affiche, pour un rêve, l'interprétation que le rêveur a gardée :
 *   - le texte gardé,
 *   - sa note de résonance (lecteur audio si elle a été dite à la voix),
 *   - l'historique des corrections, replié.
 * Actions (à vie) : modifier la note · retirer (le signet) · supprimer.
 *
 * Self-contained : tokens de style locaux (comme les autres composants du dossier),
 * appels API via le bearer de la session. Lecture seule si aucune interprétation gardée
 * (le composant ne rend alors rien — pas d'écran vide dans la fiche).
 *
 * Vocabulaire §0.1 : mots simples, aucun terme banni. Suppression = double confirmation (§0.3).
 *
 * Yeshua (Opus), 2026-07-11.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { useT } from '@/lib/i18n'
import { T } from '@/lib/dream-design'

const C = T

type Interp = {
  id: string
  kairos_id: string
  body: string
  status: 'proposed' | 'kept'
  resonance_note: string | null
  resonance_audio_path: string | null
  corrections: { at?: string; user_correction?: string; revised_body?: string }[]
  created_at: string
  kept_at: string | null
  audio_url?: string | null
}

async function kiFetch(path: string, opts: RequestInit, session: Session | null) {
  const headers: Record<string, string> = { ...(opts.headers as any) }
  if (session?.access_token) headers['Authorization'] = `Bearer ${session.access_token}`
  if (opts.body && typeof opts.body === 'string') headers['Content-Type'] = 'application/json'
  const res = await fetch(path, { ...opts, headers })
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error || `${res.status}`) }
  return res
}

export default function KeptInterpretation({ session, kairosId }: { session: Session; kairosId: string }) {
  const { t, tp } = useT()
  const [items, setItems] = useState<Interp[] | null>(null)
  const [editing, setEditing] = useState<string | null>(null)
  const [noteDraft, setNoteDraft] = useState('')
  const [openCorr, setOpenCorr] = useState<Record<string, boolean>>({})
  const [confirmDel, setConfirmDel] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const mounted = useRef(true)

  const load = useCallback(() => {
    kiFetch(`/api/mvp/interpretations?kairos_id=${encodeURIComponent(kairosId)}`, {}, session)
      .then(r => r.json())
      .then(j => { if (mounted.current) setItems(Array.isArray(j.interpretations) ? j.interpretations : []) })
      .catch(() => { if (mounted.current) setItems([]) })
  }, [kairosId, session])

  useEffect(() => { mounted.current = true; setItems(null); load(); return () => { mounted.current = false } }, [load])

  const kept = (items || []).filter(i => i.status === 'kept')
  if (items === null) return null            // en cours de chargement → rien (pas de spinner brut)
  if (!kept.length) return null              // aucune interprétation gardée → section absente

  const saveNote = async (id: string) => {
    setBusy(true)
    try {
      await kiFetch(`/api/mvp/interpretations/${id}`, { method: 'PATCH', body: JSON.stringify({ resonance_note: noteDraft.trim() }) }, session)
      // apprentissage : la note éditée reste un enseignement du langage personnel
      if (noteDraft.trim().length > 3) {
        kiFetch('/api/mvp/learn-deep', { method: 'POST', body: JSON.stringify({ kairos_id: kairosId, text: noteDraft.trim(), source: 'resonance_note' }) }, session).catch(() => {})
      }
      setEditing(null); load()
    } catch { /* silencieux — non bloquant */ }
    setBusy(false)
  }

  const remove = async (id: string) => {
    setBusy(true)
    try { await kiFetch(`/api/mvp/interpretations/${id}`, { method: 'DELETE' }, session) } catch { /* */ }
    setConfirmDel(null); setBusy(false); load()
  }

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold, marginBottom: 12 }}>{t('screens.kept.title')}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {kept.map(it => {
          const corr = Array.isArray(it.corrections) ? it.corrections : []
          return (
            <div key={it.id} style={{ padding: 18, borderRadius: 20, background: C.card, border: C.cardBorder }}>
              <div style={{ fontFamily: C.serif, fontSize: 16.5, lineHeight: 1.55, color: C.cream, whiteSpace: 'pre-wrap' }}>{it.body}</div>

              {/* note de résonance */}
              {editing === it.id ? (
                <div style={{ marginTop: 14 }}>
                  <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} placeholder={t('screens.kept.notePlaceholder')} style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 14, background: 'rgba(0,0,0,0.18)', border: C.cardBorder, color: C.cream, fontFamily: C.serif, fontSize: 15, fontStyle: 'italic', lineHeight: 1.5, resize: 'vertical' }} />
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button onClick={() => saveNote(it.id)} disabled={busy} style={btn(true)}>{t('screens.common.saveCap')}</button>
                    <button onClick={() => setEditing(null)} style={btn(false)}>{t('screens.common.cancelCap')}</button>
                  </div>
                </div>
              ) : (it.resonance_note || it.audio_url) ? (
                <div style={{ marginTop: 14, paddingLeft: 12, borderLeft: `1px solid ${C.gold}44` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.faint, marginBottom: 6 }}>{t('screens.kept.noteLabel')}</div>
                  {it.resonance_note && <div style={{ fontFamily: C.serif, fontSize: 15.5, fontStyle: 'italic', color: 'rgba(242,232,213,0.85)', lineHeight: 1.5 }}>{it.resonance_note}</div>}
                  {it.audio_url && <audio controls src={it.audio_url} style={{ marginTop: 8, width: '100%', height: 34 }} />}
                </div>
              ) : null}

              {/* corrections, repliées */}
              {corr.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <button onClick={() => setOpenCorr(o => ({ ...o, [it.id]: !o[it.id] }))} style={{ background: 'none', border: 'none', color: C.dim, fontFamily: C.sans, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', padding: 0 }}>
                    {openCorr[it.id] ? '▾' : '▸'} {tp('screens.kept.corrections', corr.length)}
                  </button>
                  {openCorr[it.id] && (
                    <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {corr.map((c, i) => (
                        <div key={i} style={{ padding: 12, borderRadius: 14, background: 'rgba(0,0,0,0.14)' }}>
                          {c.user_correction && <div style={{ fontSize: 13, color: 'rgba(242,232,213,0.7)', fontFamily: C.sans, marginBottom: c.revised_body ? 8 : 0 }}><span style={{ color: C.faint }}>{t('screens.kept.youSaid')}</span>{c.user_correction}</div>}
                          {c.revised_body && <div style={{ fontFamily: C.serif, fontSize: 14.5, fontStyle: 'italic', color: 'rgba(242,232,213,0.82)', lineHeight: 1.5 }}>{c.revised_body}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* actions */}
              <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {editing !== it.id && (
                  <button onClick={() => { setEditing(it.id); setNoteDraft(it.resonance_note || '') }} style={btn(false)}>{it.resonance_note ? t('screens.kept.editNote') : t('screens.kept.addNote')}</button>
                )}
                {confirmDel === it.id ? (
                  <>
                    <button onClick={() => remove(it.id)} disabled={busy} style={btn(false, true)}>{t('screens.kept.confirmDelete')}</button>
                    <button onClick={() => setConfirmDel(null)} style={btn(false)}>{t('screens.common.cancelCap')}</button>
                  </>
                ) : (
                  <button onClick={() => setConfirmDel(it.id)} style={btn(false)}>{t('screens.kept.remove')}</button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function btn(primary: boolean, danger = false): React.CSSProperties {
  return {
    padding: '9px 14px',
    borderRadius: 999,
    border: danger ? '0.5px solid rgba(199,115,75,0.5)' : primary ? `1px solid ${C.gold}66` : '0.5px solid rgba(242,232,213,0.2)',
    background: primary ? 'rgba(201,168,106,0.14)' : 'transparent',
    color: danger ? '#c7734b' : primary ? C.cream : C.dim,
    fontFamily: C.sans,
    fontSize: 12.5,
    fontWeight: primary ? 600 : 500,
    cursor: 'pointer',
  }
}
