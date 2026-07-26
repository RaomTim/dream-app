'use client';

import React, { useState, useEffect } from 'react';
import { Glyph, SerifHeading, Rule, Diamond } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { authFetch } from '@/lib/api-client';
import { Surface, HaloRespire, GeoSymbol, wowRegistry, playRitual } from '@/components/dream-v12';

type DreamDetailEntry = {
  id: string;
  title: string | null;
  raw_text: string;
  created_at: string;
  mood: string | null;
  notes: string | null;
  entry_type: string;
  entities: Record<string, unknown> | null;
  prophetic_suspect: boolean;
  tags: string[];
  numinosity: number | null;
  soul_wish: string | null;
  somatic_location: string | null;
  honoring_action: string | null;
  honoring_status: string | null;
  honoring_note: string | null;
  // V1.2 backend-cabling — kairos data optionnel (loaded séparément)
  numinosity_score?: number | null;
  big_dream?: boolean;
  synthesis_text?: string | null;
};

export type DreamDetailProps = {
  dreamId: string;
  userId?: string;
  onClose?: () => void;
  onOpenChat?: (dreamId: string, mode: string) => void;
  onOpenReentry?: (dreamId: string) => void;
  onOpenTale?: (dreamId: string, text: string) => void;
};

export default function DreamDetail({
  dreamId,
  userId,
  onClose,
  onOpenChat,
  onOpenReentry,
  onOpenTale,
}: DreamDetailProps) {
  const [dream, setDream] = useState<DreamDetailEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [showNoteField, setShowNoteField] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'deleting'>('idle');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [numinosity, setNuminosity] = useState<number>(0);
  const [soulWish, setSoulWish] = useState('');
  const [showSoulWish, setShowSoulWish] = useState(false);
  const [soulWishSaving, setSoulWishSaving] = useState(false);
  const [somaticLocation, setSomaticLocation] = useState<string | null>(null);
  const [similarDreams, setSimilarDreams] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const [matchedTales, setMatchedTales] = useState<any[]>([]);
  const [loadingTales, setLoadingTales] = useState(false);
  const [showTales, setShowTales] = useState(false);
  const [honoringAction, setHonoringAction] = useState('');
  const [honoringStatus, setHonoringStatus] = useState<string | null>(null);
  const [honoringNote, setHonoringNote] = useState('');
  const [showHonoring, setShowHonoring] = useState(false);
  const [honoringSaving, setHonoringSaving] = useState(false);
  // Régénération analyse profonde (Forêt absorbée)
  const [regenState, setRegenState] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [regenMsg, setRegenMsg] = useState<string | null>(null);
  const { t } = useT();

  useEffect(() => {
    const fetchDream = async () => {
      try {
        if (!userId) { setLoading(false); return; }
        const res = await authFetch(`/api/dreams/${dreamId}?userId=${userId}`);
        const data = await res.json();
        if (data.dream) {
          setDream(data.dream);
          setNoteText(data.dream.notes || '');
          setNuminosity(data.dream.numinosity || 0);
          setSoulWish(data.dream.soul_wish || '');
          setSomaticLocation(data.dream.somatic_location || null);
          setHonoringAction(data.dream.honoring_action || '');
          setHonoringStatus(data.dream.honoring_status || null);
          setHonoringNote(data.dream.honoring_note || '');
        }
      } catch (e) {
        console.error('Erreur chargement rêve:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDream();
  }, [dreamId]);

  // V1.2 — fetch kairos backend data (numinosity_score, synthesis_text, big_dream).
  // Tant que pipeline en background, polling 3s pendant ~30s.
  useEffect(() => {
    if (!dreamId) return
    let cancelled = false
    let attempts = 0
    const maxAttempts = 12 // ~36s (cf. pipeline 8-15s)

    const tick = async () => {
      try {
        const res = await authFetch(`/api/kairos/${dreamId}`)
        if (!res.ok) return false
        const data = await res.json()
        if (cancelled) return true
        const k = data?.kairos
        if (!k) return false
        // Merger les données kairos dans le dream display
        setDream(prev => prev ? { ...prev, numinosity_score: k.numinosity_score ?? null, big_dream: (k.numinosity_score ?? 0) >= 0.85, synthesis_text: k.synthesis_text || null } : prev)
        // Stop poll si synthesis arrivée OU numinosity_pending=false
        return Boolean(k.synthesis_text) || k.numinosity_pending === false
      } catch {
        return false
      }
    }

    const loop = async () => {
      while (!cancelled && attempts < maxAttempts) {
        const done = await tick()
        if (done) break
        attempts++
        await new Promise(r => setTimeout(r, 3000))
      }
    }
    loop()
    return () => { cancelled = true }
  }, [dreamId])

  // V1.2 — Wow3 fire (big-dream-marquage) côté frontend si on détecte localement
  // un Big Dream. Le trigger DB (fire_first_big_dream) couvre déjà le cas backend,
  // mais le frontend tire aussi pour produire le rituel visuel immédiat à l'ouverture.
  useEffect(() => {
    if (!dream) return
    const numScore = (dream as any).numinosity_score ?? null
    const localBig =
      (dream as any).big_dream === true ||
      (typeof numScore === 'number' && numScore >= 0.85)
    if (!localBig) return
    if (wowRegistry.has('big-dream-marquage')) return
    if (wowRegistry.fire('big-dream-marquage')) {
      try { playRitual('ceremoniel') } catch {}
      authFetch('/api/user/wow-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'big-dream-marquage' }),
      }).catch(() => {})
    }
  }, [dream])

  const saveField = async (field: string, value: any) => {
    try {
      await authFetch(`/api/dreams/${dreamId}?userId=${userId || ''}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (e) {
      console.error(`Failed to save ${field}:`, e);
    }
  };

  const handleNuminosity = (val: number) => {
    setNuminosity(val);
    saveField('numinosity', val);
  };

  const handleSomatic = (loc: string) => {
    setSomaticLocation(loc);
    saveField('somatic_location', loc);
  };

  const fetchSimilarDreams = async () => {
    if (loadingSimilar || similarDreams.length > 0) { setShowSimilar(true); return; }
    setLoadingSimilar(true);
    setShowSimilar(true);
    try {
      const res = await authFetch('/api/dreams/similar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dreamId, userId }),
      });
      const data = await res.json();
      setSimilarDreams(data.similar || []);
    } catch (e) { console.error('Similar dreams error:', e); }
    finally { setLoadingSimilar(false); }
  };

  const fetchMatchedTales = async () => {
    if (loadingTales || matchedTales.length > 0) { setShowTales(true); return; }
    setLoadingTales(true);
    setShowTales(true);
    try {
      const res = await authFetch('/api/tales/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 🔒 2026-04-20 : userId requis côté serveur (ownership check)
        body: JSON.stringify({ dreamId, userId }),
      });
      const data = await res.json();
      setMatchedTales(data.tales || []);
    } catch (e) { console.error('Tales match error:', e); }
    finally { setLoadingTales(false); }
  };

  const saveHonoringAction = async () => {
    if (!honoringAction.trim() || honoringSaving) return;
    setHonoringSaving(true);
    await saveField('honoring_action', honoringAction.trim());
    await saveField('honoring_status', 'pledged');
    setHonoringStatus('pledged');
    setHonoringSaving(false);
    setShowHonoring(false);
  };

  const markHonored = async () => {
    setHonoringSaving(true);
    await saveField('honoring_status', 'honored');
    if (honoringNote.trim()) {
      await saveField('honoring_note', honoringNote.trim());
    }
    setHonoringStatus('honored');
    setHonoringSaving(false);
  };

  const saveSoulWish = async () => {
    if (!soulWish.trim() || soulWishSaving) return;
    setSoulWishSaving(true);
    await saveField('soul_wish', soulWish.trim());
    setSoulWishSaving(false);
    setShowSoulWish(false);
  };

  const saveNote = async () => {
    if (!noteText.trim() || saving) return;
    setSaving(true);
    try {
      const existingNotes = dream?.notes || '';
      const timestamp = new Date().toLocaleDateString('fr-FR');
      const newNote = existingNotes
        ? `${existingNotes}\n\n---\n[${timestamp}] ${noteText.trim()}`
        : `[${timestamp}] ${noteText.trim()}`;

      await authFetch(`/api/dreams/${dreamId}?userId=${userId || ''}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: newNote }),
      });

      setDream((prev) => prev ? { ...prev, notes: newNote } : prev);
      setNoteText('');
      setShowNoteField(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Erreur sauvegarde note:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteStep === 'idle') {
      setDeleteStep('confirm');
      return;
    }
    if (deleteStep === 'confirm') {
      setDeleteStep('deleting');
      setDeleteError(null);
      try {
        const res = await authFetch(`/api/dreams/${dreamId}?userId=${userId || ''}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erreur suppression');
        }
        onClose?.();
      } catch (e: any) {
        console.error('Erreur suppression:', e);
        setDeleteError(e.message || 'Erreur suppression');
        setDeleteStep('idle');
      }
    }
  };

  if (loading) {
    return (
      <div className="grain" style={{
        minHeight: '100dvh', background: 'var(--bg-wash)',
        display: 'grid', placeItems: 'center',
      }}>
        <SerifHeading size={20} italic color="var(--fg-mute)">{t('detail.loading')}</SerifHeading>
      </div>
    );
  }

  if (!dream) {
    return (
      <div className="grain" style={{
        minHeight: '100dvh', background: 'var(--bg-wash)',
        display: 'grid', placeItems: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <SerifHeading size={20} italic color="var(--fg-mute)">{t('detail.not_found')}</SerifHeading>
          <button onClick={onClose} style={{ marginTop: 20, ...btn }}>
            <Glyph size={10}>{t('detail.back')}</Glyph>
          </button>
        </div>
      </div>
    );
  }

  const date = new Date(dream.created_at);
  const dateStr = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
  const typeLabel = dream.entry_type === 'day' ? t('chat.modes.day') : dream.entry_type === 'oracle' ? t('chat.modes.oracle') : t('chat.modes.dream');

  // Contextual "explore" button label based on entry type
  const EXPLORE_LABELS: Record<string, string> = {
    dream: 'detail.explore_dream', reve: 'detail.explore_dream',
    day: 'detail.explore_day', jour: 'detail.explore_day', journal: 'detail.explore_day',
    oracle: 'detail.explore_oracle',
    ritual: 'detail.explore_ritual', rituel: 'detail.explore_ritual',
    forest: 'detail.explore_forest', foret: 'detail.explore_forest',
    tale: 'detail.explore_tale', conte: 'detail.explore_tale',
  };
  const exploreLabel = t(EXPLORE_LABELS[dream.entry_type] || 'detail.explore_ai');

  // Dream V1.2 — détecter si c'est un BigDream pour amplification.
  // Source de vérité (priorité décroissante) :
  //   1. flag big_dream renvoyé par backend kairos
  //   2. numinosity_score >= 0.85 (seuil D4 Tim)
  //   3. fallback : prophetic_suspect (legacy compat)
  const numScore = (dream as any).numinosity_score ?? null
  const isBigDream =
    (dream as any).big_dream === true ||
    (typeof numScore === 'number' && numScore >= 0.85) ||
    dream.prophetic_suspect === true
  const isProphetic = dream.prophetic_suspect === true || (typeof numScore === 'number' && numScore >= 0.7)

  return (
    <div
      className="grain"
      style={{
        position: 'relative',
        minHeight: '100dvh',
        background: 'var(--bg-wash)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-serif)',
        paddingTop: 54,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Dream V1.2 — matter linen pleine page (visible) + halo silk si prophétique/bigdream */}
      <Surface
        matter={isBigDream ? 'silk' : 'linen'}
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      {isProphetic && (
        <HaloRespire
          kind={isBigDream ? 'bigdream' : 'silk'}
          style={{ position: 'absolute', inset: '12% 5%', zIndex: 0 }}
        />
      )}
      {isBigDream && (
        <div style={{
          position: 'absolute', top: '6%', left: '50%',
          transform: 'translateX(-50%)',
          width: 360, height: 360, opacity: 0.20, pointerEvents: 'none', zIndex: 0,
        }}>
          <GeoSymbol kind="spirale" color="silk" />
        </div>
      )}

      {/* Header */}
      <header style={{ position: 'relative', zIndex: 1, padding: '16px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={btn}><Glyph size={10}>{t('detail.back')}</Glyph></button>
        <Glyph size={10}>{typeLabel} · {dateStr}</Glyph>
        <div style={{ width: 60 }} />
      </header>

      {/* Dream content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '32px 28px 0' }}>
        {dream.prophetic_suspect && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', marginBottom: 16,
            background: 'color-mix(in srgb, var(--accent) 15%, transparent)',
            border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
            borderRadius: 2,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px color-mix(in srgb, var(--accent) 60%, transparent)' }} />
            <Glyph size={9} color="var(--accent)">{t('detail.prophetic')}</Glyph>
          </div>
        )}

        {dream.title ? (
          <SerifHeading size={24} italic style={{ lineHeight: 1.2 }}>
            {dream.title}
          </SerifHeading>
        ) : (
          <EditableTitle dreamId={dream.id} userId={userId} onTitleSaved={(title) => setDream({ ...dream, title })} />
        )}

        <Rule style={{ marginTop: 20 }} />

        <div
          className={isBigDream ? 'drop-cap' : ''}
          style={{
            marginTop: 20,
            fontFamily: 'var(--font-serif)',
            fontSize: isBigDream ? 19 : 17,
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: 'var(--fg-dim)',
          }}
        >
          {dream.raw_text}
        </div>
      </div>

      {/* V4: Numinosity rating */}
      {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && (
        <div style={{ padding: '24px 28px 0' }}>
          <Glyph size={9} color="var(--accent)">{t('detail.numinosity_label')}</Glyph>
          <div style={{
            marginTop: 8,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 11, color: 'var(--fg-mute)',
          }}>
            {t('detail.numinosity_hint')}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => handleNuminosity(n)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  background: numinosity >= n
                    ? `color-mix(in srgb, var(--accent) ${20 + n * 15}%, transparent)`
                    : 'transparent',
                  border: numinosity >= n
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Glyph size={8} color={numinosity >= n ? 'var(--accent)' : 'var(--fg-mute)'}>
                  {t(`detail.numinosity_${n}` as any)}
                </Glyph>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* V4: Somatic location */}
      {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && (
        <div style={{ padding: '20px 28px 0' }}>
          <Glyph size={9} color="var(--accent)">{t('detail.somatic_label')}</Glyph>
          <div style={{
            marginTop: 8,
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 11, color: 'var(--fg-mute)',
          }}>
            {t('detail.somatic_prompt')}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {(['throat', 'chest', 'belly', 'head', 'hands', 'legs', 'other', 'unknown'] as const).map(loc => (
              <button
                key={loc}
                onClick={() => handleSomatic(loc)}
                style={{
                  padding: '6px 12px',
                  background: somaticLocation === loc
                    ? 'color-mix(in srgb, var(--accent) 25%, transparent)'
                    : 'transparent',
                  border: somaticLocation === loc
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border)',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Glyph size={8} color={somaticLocation === loc ? 'var(--accent)' : 'var(--fg-mute)'}>
                  {t(`detail.somatic_${loc}` as any)}
                </Glyph>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* V4: Ondinnonk — Soul wish */}
      {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && (
        <div style={{ padding: '20px 28px 0' }}>
          {soulWish && !showSoulWish ? (
            <>
              <Glyph size={9} color="var(--accent)">{t('detail.ondinnonk_label')}</Glyph>
              <div style={{
                marginTop: 10,
                borderLeft: '2px solid var(--accent)',
                paddingLeft: 16,
                fontFamily: 'var(--font-serif)',
                fontSize: 15,
                fontStyle: 'italic',
                lineHeight: 1.55,
                color: 'var(--fg-dim)',
              }}>
                {soulWish}
              </div>
              <button onClick={() => setShowSoulWish(true)} style={{ ...btn, marginTop: 8 }}>
                <Glyph size={8} color="var(--fg-mute)">modifier</Glyph>
              </button>
            </>
          ) : !showSoulWish ? (
            <button
              onClick={() => setShowSoulWish(true)}
              style={{
                width: '100%', background: 'transparent',
                border: '1px dashed color-mix(in srgb, var(--accent) 40%, var(--border))',
                padding: '12px 16px', cursor: 'pointer', borderRadius: 2,
                textAlign: 'left',
              }}
            >
              <Glyph size={9} color="var(--accent)">{t('detail.ondinnonk_label')}</Glyph>
              <div style={{
                marginTop: 4,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 12, color: 'var(--fg-mute)',
              }}>
                {t('detail.ondinnonk_prompt')}
              </div>
            </button>
          ) : (
            <>
              <Glyph size={9} color="var(--accent)">{t('detail.ondinnonk_label')}</Glyph>
              <div style={{
                marginTop: 6,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 12, color: 'var(--fg-mute)',
              }}>
                {t('detail.ondinnonk_prompt')}
              </div>
              <textarea
                value={soulWish}
                onChange={(e) => setSoulWish(e.target.value)}
                placeholder={t('detail.ondinnonk_placeholder')}
                rows={3}
                autoFocus
                style={{
                  width: '100%', marginTop: 10, padding: 0, border: 'none', outline: 'none',
                  background: 'transparent', resize: 'none',
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 17, lineHeight: 1.55, color: 'var(--fg)',
                }}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button onClick={() => setShowSoulWish(false)} style={btn}>
                  <Glyph size={9} color="var(--fg-mute)">{t('detail.cancel')}</Glyph>
                </button>
                <button
                  onClick={saveSoulWish}
                  disabled={!soulWish.trim() || soulWishSaving}
                  style={{
                    background: 'transparent',
                    border: soulWish.trim() ? '1px solid var(--accent)' : '1px solid var(--border)',
                    padding: '8px 16px', cursor: soulWish.trim() ? 'pointer' : 'not-allowed',
                    borderRadius: 2, opacity: soulWish.trim() ? 1 : 0.3,
                  }}
                >
                  <Glyph size={9} color="var(--accent)">
                    {soulWishSaving ? t('detail.saving') : t('detail.save')}
                  </Glyph>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* V4: Honoring Ritual — cycle rêve→action */}
      {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && (
        <div style={{ padding: '20px 28px 0' }}>
          {honoringStatus === 'honored' ? (
            // HONORED — display green confirmation
            <div style={{
              background: 'color-mix(in srgb, #9AE07C 8%, transparent)',
              border: '1px solid color-mix(in srgb, #9AE07C 30%, transparent)',
              borderRadius: 2, padding: '14px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#9AE07C',
                  boxShadow: '0 0 8px color-mix(in srgb, #9AE07C 60%, transparent)',
                }} />
                <Glyph size={9} color="#9AE07C">{t('honoring.honored')}</Glyph>
              </div>
              {honoringAction && (
                <div style={{
                  marginTop: 8, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 14, color: 'var(--fg-dim)', lineHeight: 1.4,
                }}>
                  {honoringAction}
                </div>
              )}
              {honoringNote && (
                <div style={{
                  marginTop: 6, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 13, color: 'var(--fg-mute)', lineHeight: 1.4,
                }}>
                  {honoringNote}
                </div>
              )}
            </div>
          ) : honoringStatus === 'pledged' && !showHonoring ? (
            // PLEDGED — show the action + button to mark honored
            <div style={{
              background: 'color-mix(in srgb, var(--accent) 6%, transparent)',
              border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
              borderRadius: 2, padding: '14px 16px',
            }}>
              <Glyph size={9} color="var(--accent)">{t('honoring.pledged_label')}</Glyph>
              <div style={{
                marginTop: 8, borderLeft: '2px solid var(--accent)', paddingLeft: 14,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 15, color: 'var(--fg-dim)', lineHeight: 1.5,
              }}>
                {honoringAction}
              </div>
              <div style={{ marginTop: 14 }}>
                <button
                  onClick={() => setShowHonoring(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--accent)',
                    padding: '8px 16px', cursor: 'pointer', borderRadius: 2,
                  }}
                >
                  <Glyph size={9} color="var(--accent)">{t('honoring.mark_honored')}</Glyph>
                </button>
              </div>
              {showHonoring && (
                <div style={{ marginTop: 12 }}>
                  <Glyph size={8} color="var(--fg-mute)">{t('honoring.how_honored')}</Glyph>
                  <textarea
                    value={honoringNote}
                    onChange={(e) => setHonoringNote(e.target.value)}
                    placeholder={t('honoring.note_placeholder')}
                    rows={2}
                    autoFocus
                    style={{
                      width: '100%', marginTop: 8, padding: 0, border: 'none', outline: 'none',
                      background: 'transparent', resize: 'none',
                      fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                      fontSize: 15, lineHeight: 1.5, color: 'var(--fg)',
                    }}
                  />
                  <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                    <button onClick={() => setShowHonoring(false)} style={btn}>
                      <Glyph size={9} color="var(--fg-mute)">{t('detail.cancel')}</Glyph>
                    </button>
                    <button
                      onClick={markHonored}
                      disabled={honoringSaving}
                      style={{
                        background: 'transparent',
                        border: '1px solid #9AE07C',
                        padding: '8px 16px', cursor: 'pointer', borderRadius: 2,
                      }}
                    >
                      <Glyph size={9} color="#9AE07C">
                        {honoringSaving ? t('detail.saving') : t('honoring.confirm_honored')}
                      </Glyph>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : !showHonoring ? (
            // NO HONORING YET — prompt to set one
            <button
              onClick={() => setShowHonoring(true)}
              style={{
                width: '100%', background: 'transparent',
                border: '1px dashed color-mix(in srgb, #9AE07C 40%, var(--border))',
                padding: '12px 16px', cursor: 'pointer', borderRadius: 2,
                textAlign: 'left',
              }}
            >
              <Glyph size={9} color="#9AE07C">{t('honoring.label')}</Glyph>
              <div style={{
                marginTop: 4,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 12, color: 'var(--fg-mute)',
              }}>
                {t('honoring.prompt')}
              </div>
            </button>
          ) : (
            // EDITING — text input for the action
            <>
              <Glyph size={9} color="#9AE07C">{t('honoring.label')}</Glyph>
              <div style={{
                marginTop: 6,
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 12, color: 'var(--fg-mute)',
              }}>
                {t('honoring.prompt')}
              </div>
              <textarea
                value={honoringAction}
                onChange={(e) => setHonoringAction(e.target.value)}
                placeholder={t('honoring.placeholder')}
                rows={3}
                autoFocus
                style={{
                  width: '100%', marginTop: 10, padding: 0, border: 'none', outline: 'none',
                  background: 'transparent', resize: 'none',
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                  fontSize: 17, lineHeight: 1.55, color: 'var(--fg)',
                }}
              />
              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button onClick={() => setShowHonoring(false)} style={btn}>
                  <Glyph size={9} color="var(--fg-mute)">{t('detail.cancel')}</Glyph>
                </button>
                <button
                  onClick={saveHonoringAction}
                  disabled={!honoringAction.trim() || honoringSaving}
                  style={{
                    background: 'transparent',
                    border: honoringAction.trim() ? '1px solid #9AE07C' : '1px solid var(--border)',
                    padding: '8px 16px', cursor: honoringAction.trim() ? 'pointer' : 'not-allowed',
                    borderRadius: 2, opacity: honoringAction.trim() ? 1 : 0.3,
                  }}
                >
                  <Glyph size={9} color="#9AE07C">
                    {honoringSaving ? t('detail.saving') : t('honoring.pledge')}
                  </Glyph>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* V4: Similar Dreams — navigation par résonance */}
      {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && (
        <div style={{ padding: '20px 28px 0' }}>
          {!showSimilar ? (
            <button
              onClick={fetchSimilarDreams}
              style={{
                width: '100%', background: 'transparent',
                border: '1px dashed var(--border)',
                padding: '10px 16px', cursor: 'pointer', borderRadius: 2,
                textAlign: 'left',
              }}
            >
              <Glyph size={9} color="var(--fg-mute)">◎ {t('detail.similar_dreams')}</Glyph>
            </button>
          ) : (
            <div>
              <Glyph size={9} color="var(--accent)">◎ {t('detail.similar_dreams')}</Glyph>
              {loadingSimilar ? (
                <div style={{ marginTop: 10 }}>
                  <Glyph size={9} color="var(--fg-mute)">{t('detail.loading')}</Glyph>
                </div>
              ) : similarDreams.length === 0 ? (
                <div style={{ marginTop: 10 }}>
                  <Glyph size={9} color="var(--fg-mute)">{t('detail.no_similar')}</Glyph>
                </div>
              ) : (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {similarDreams.map((d: any) => (
                    <button
                      key={d.id}
                      onClick={() => {/* TODO: navigate to dream */ }}
                      style={{
                        width: '100%', background: 'color-mix(in srgb, var(--accent) 5%, transparent)',
                        border: '1px solid var(--border)', borderRadius: 2,
                        padding: '10px 14px', cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Glyph size={9} color="var(--fg)">
                          {d.title || new Date(d.created_at).toLocaleDateString('fr-FR')}
                        </Glyph>
                        {d.similarity_score && (
                          <Glyph size={8} color="var(--accent)">
                            {typeof d.similarity_score === 'number' && d.similarity_score < 1
                              ? `${Math.round(d.similarity_score * 100)}%`
                              : `${d.similarity_score}pts`}
                          </Glyph>
                        )}
                      </div>
                      {d.mood && (
                        <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 2 }}>{d.mood}</Glyph>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* V4: Matched Tales — contes résonants */}
      {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && (
        <div style={{ padding: '16px 28px 0' }}>
          {!showTales ? (
            <button
              onClick={fetchMatchedTales}
              style={{
                width: '100%', background: 'transparent',
                border: '1px dashed color-mix(in srgb, var(--mode-conte-accent) 40%, var(--border))',
                padding: '10px 16px', cursor: 'pointer', borderRadius: 2,
                textAlign: 'left',
              }}
            >
              <Glyph size={9} color="var(--mode-conte-accent)">❦ {t('detail.matched_tales')}</Glyph>
            </button>
          ) : (
            <div>
              <Glyph size={9} color="var(--mode-conte-accent)">❦ {t('detail.matched_tales')}</Glyph>
              {loadingTales ? (
                <div style={{ marginTop: 10 }}>
                  <Glyph size={9} color="var(--fg-mute)">{t('detail.loading')}</Glyph>
                </div>
              ) : matchedTales.length === 0 ? (
                <div style={{ marginTop: 10 }}>
                  <Glyph size={9} color="var(--fg-mute)">{t('detail.no_tales')}</Glyph>
                </div>
              ) : (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {matchedTales.map((tale: any) => (
                    <div
                      key={tale.id}
                      style={{
                        background: 'color-mix(in srgb, var(--mode-conte-accent) 5%, transparent)',
                        border: '1px solid color-mix(in srgb, var(--mode-conte-accent) 25%, var(--border))',
                        borderRadius: 2, padding: '12px 14px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <SerifHeading size={14} italic>{tale.title}</SerifHeading>
                        <Glyph size={8} color="var(--mode-conte-accent)">{tale.match_score}pts</Glyph>
                      </div>
                      <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 4 }}>
                        {tale.tradition} · {tale.source_book_slug}
                      </Glyph>
                      {tale.summary && (
                        <div style={{
                          marginTop: 8, fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                          fontSize: 13, lineHeight: 1.5, color: 'var(--fg-dim)',
                        }}>
                          {tale.summary}
                        </div>
                      )}
                      {tale.match_reasons && (
                        <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {tale.match_reasons.slice(0, 4).map((r: string, i: number) => (
                            <span key={i} style={{
                              fontSize: 9, fontFamily: 'var(--font-sans)',
                              padding: '2px 6px', borderRadius: 2,
                              background: 'color-mix(in srgb, var(--mode-conte-accent) 15%, transparent)',
                              color: 'var(--mode-conte-accent)',
                            }}>
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Existing notes */}
      {dream.notes && (
        <div style={{ padding: '28px 28px 0' }}>
          <Glyph size={9} color="var(--accent)">{t('detail.notes_label')}</Glyph>
          <div style={{
            marginTop: 12,
            borderLeft: '2px solid var(--accent)',
            paddingLeft: 16,
            fontFamily: 'var(--font-serif)',
            fontSize: 15,
            fontStyle: 'italic',
            lineHeight: 1.55,
            color: 'var(--fg-dim)',
            whiteSpace: 'pre-line',
          }}>
            {dream.notes}
          </div>
        </div>
      )}

      <div style={{ flex: 1, minHeight: 40 }} />

      {/* Add note section */}
      <div style={{ position: 'relative', zIndex: 1, padding: '0 28px 24px' }}>
        {saved && (
          <div className="animate-fade-in" style={{ marginBottom: 16 }}>
            <Glyph size={9} color="var(--accent)">{t('detail.saved')}</Glyph>
          </div>
        )}

        {showNoteField ? (
          <>
            <Glyph size={9} color="var(--accent)">{t('detail.new_note')}</Glyph>
            <div style={{
              marginTop: 8,
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 13,
              color: 'var(--fg-mute)',
            }}>
              {t('detail.note_prompt')}
            </div>
            <Rule style={{ marginTop: 12 }} />
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={t('detail.note_placeholder')}
              rows={4}
              autoFocus
              style={{
                width: '100%', marginTop: 12, padding: 0, border: 'none', outline: 'none',
                background: 'transparent', resize: 'none',
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 18, lineHeight: 1.55, color: 'var(--fg)',
              }}
            />
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button onClick={() => setShowNoteField(false)} style={btn}>
                <Glyph size={9} color="var(--fg-mute)">{t('detail.cancel')}</Glyph>
              </button>
              <button
                onClick={saveNote}
                disabled={!noteText.trim() || saving}
                style={{
                  background: 'transparent',
                  border: noteText.trim() ? '1px solid var(--accent)' : '1px solid var(--border)',
                  padding: '8px 16px', cursor: noteText.trim() ? 'pointer' : 'not-allowed',
                  borderRadius: 2, opacity: noteText.trim() ? 1 : 0.3,
                }}
              >
                <Glyph size={9} color="var(--accent)">
                  {saving ? t('detail.saving') : t('detail.save')}
                </Glyph>
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Primary action: Note */}
            <button
              onClick={() => setShowNoteField(true)}
              style={{
                width: '100%',
                background: 'linear-gradient(180deg, var(--structural-bg), color-mix(in srgb, var(--structural) 10%, transparent))',
                border: '1px solid var(--structural-line)',
                padding: '14px 18px', cursor: 'pointer', borderRadius: 2,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <Diamond size={6} color="var(--accent)" />
              <Glyph size={9} color="var(--accent)">{t('detail.add_interpretation')}</Glyph>
            </button>
            {/* Secondary actions row */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => onOpenChat?.(dreamId, dream.entry_type || 'dream')}
                style={{
                  flex: 1, background: 'transparent',
                  border: '1px solid var(--border)',
                  padding: '14px 12px', cursor: 'pointer', borderRadius: 2,
                }}
              >
                <Glyph size={9} color="var(--fg-mute)">{exploreLabel}</Glyph>
              </button>
              {/* Réentrée — only for dream entries */}
              {(dream.entry_type === 'dream' || dream.entry_type === 'reve' || dream.entry_type === 'reentry') && onOpenReentry && (
                <button
                  onClick={() => onOpenReentry(dreamId)}
                  style={{
                    flex: 1, background: 'transparent',
                    border: '1px solid color-mix(in srgb, var(--mode-reve-accent) 40%, var(--border))',
                    padding: '14px 12px', cursor: 'pointer', borderRadius: 2,
                  }}
                >
                  <Glyph size={9} color="var(--mode-reve-accent)">◯ replonger</Glyph>
                </button>
              )}
              {/* Conte-miroir — for dream and day entries */}
              {(dream.entry_type !== 'oracle' && dream.entry_type !== 'ritual' && dream.entry_type !== 'rituel') && onOpenTale && (
                <button
                  onClick={() => onOpenTale(dreamId, dream.raw_text)}
                  style={{
                    flex: 1, background: 'transparent',
                    border: '1px solid color-mix(in srgb, var(--mode-conte-accent) 40%, var(--border))',
                    padding: '14px 12px', cursor: 'pointer', borderRadius: 2,
                  }}
                >
                  <Glyph size={9} color="var(--mode-conte-accent)">❦ conte</Glyph>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Régénérer analyse profonde — relance extract-deep pour cet entry */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 28px 8px', textAlign: 'center' }}>
        <Rule style={{ marginBottom: 20 }} />
        {regenMsg && (
          <div style={{ marginBottom: 12 }}>
            <Glyph size={9} color={regenState === 'error' ? 'var(--rouge)' : 'var(--fg-mute)'}>
              {regenMsg}
            </Glyph>
          </div>
        )}
        <button
          onClick={async () => {
            if (regenState === 'running') return;
            setRegenState('running');
            setRegenMsg('La Forêt relit ce rêve…');
            try {
              // 🔒 2026-04-23 FIX : authFetch (Bearer) au lieu de fetch (cassait avec "userId requis")
              const res = await authFetch('/api/dreams/extract-deep', {
                method: 'POST',
                body: JSON.stringify({ dreamId, entryType: dream?.entry_type }),
              });
              const data = await res.json();
              if (!res.ok || data.error) throw new Error(data.error || 'Échec régénération');
              const books = data.forest?.books || [];
              setRegenState('done');
              setRegenMsg(
                books.length > 0
                  ? `Relecture profonde faite — ${data.forest.chunks_used} passages absorbés`
                  : 'Relecture profonde faite'
              );
              // Refresh dream data
              const refresh = await authFetch(`/api/dreams/${dreamId}?userId=${userId || ''}`);
              const refreshData = await refresh.json();
              if (refreshData.dream) setDream(refreshData.dream);
              setTimeout(() => { setRegenMsg(null); setRegenState('idle'); }, 4000);
            } catch (err: any) {
              setRegenState('error');
              setRegenMsg(err.message || 'Erreur pendant la régénération');
              setTimeout(() => { setRegenMsg(null); setRegenState('idle'); }, 5000);
            }
          }}
          disabled={regenState === 'running'}
          style={{
            background: 'transparent',
            border: '1px solid color-mix(in srgb, var(--mode-reve-accent) 30%, var(--border))',
            padding: '10px 18px',
            cursor: regenState === 'running' ? 'wait' : 'pointer',
            borderRadius: 2,
            opacity: regenState === 'running' ? 0.6 : 1,
          }}
        >
          <Glyph size={9} color="var(--mode-reve-accent)">
            {regenState === 'running' ? '🌲 en lecture…' : '🌲 régénérer analyse profonde'}
          </Glyph>
        </button>
      </div>

      {/* Delete section */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 28px 32px', textAlign: 'center' }}>
        <Rule style={{ marginBottom: 20 }} />
        {deleteError && (
          <div style={{ marginBottom: 12 }}>
            <Glyph size={9} color="var(--rouge)">{deleteError}</Glyph>
          </div>
        )}
        <button
          onClick={handleDelete}
          onBlur={() => { if (deleteStep === 'confirm') setDeleteStep('idle'); }}
          disabled={deleteStep === 'deleting'}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '8px 0',
            cursor: deleteStep === 'deleting' ? 'not-allowed' : 'pointer',
            opacity: deleteStep === 'deleting' ? 0.4 : 0.6,
          }}
        >
          <Glyph size={9} color="var(--rouge)">
            {deleteStep === 'idle' && t('detail.delete_entry')}
            {deleteStep === 'confirm' && t('detail.delete_confirm')}
            {deleteStep === 'deleting' && t('detail.delete_progress')}
          </Glyph>
        </button>
      </div>
    </div>
  );
}

/* Editable title — shown when dream has no title yet (Moss: the dreamer names the dream) */
function EditableTitle({ dreamId, userId, onTitleSaved }: { dreamId: string; userId?: string; onTitleSaved: (t: string) => void }) {
  const { t } = useT();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!value.trim() || saving) return;
    setSaving(true);
    try {
      await authFetch(`/api/dreams/${dreamId}?userId=${userId || ''}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: value.trim() }),
      });
      onTitleSaved(value.trim());
    } catch (e) {
      console.error('Failed to save title:', e);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          padding: 0, textAlign: 'left', width: '100%',
        }}
      >
        <SerifHeading size={24} italic style={{ lineHeight: 1.2, color: 'var(--fg-mute)', opacity: 0.6 }}>
          {t('detail.tap_to_name')}
        </SerifHeading>
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
        placeholder={t('detail.name_placeholder')}
        style={{
          flex: 1,
          fontFamily: 'var(--font-serif)', fontSize: 22, fontStyle: 'italic',
          color: 'var(--fg)', background: 'transparent',
          border: 'none', borderBottom: '1px solid var(--accent)',
          padding: '4px 0', outline: 'none',
        }}
      />
      <button onClick={save} disabled={saving} style={{
        background: 'transparent', border: '1px solid var(--accent)',
        borderRadius: 2, padding: '4px 12px', cursor: 'pointer',
      }}>
        <Glyph size={9} color="var(--accent)">{saving ? '...' : '✓'}</Glyph>
      </button>
      <button onClick={() => setEditing(false)} style={{
        background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 8px',
      }}>
        <Glyph size={9} color="var(--fg-mute)">×</Glyph>
      </button>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
};
