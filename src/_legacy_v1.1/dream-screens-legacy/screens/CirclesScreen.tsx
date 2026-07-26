'use client';

import React, { useState, useEffect } from 'react';
import { Glyph, SerifHeading, Rule, Diamond, Tag } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { authFetch } from '@/lib/api-client';

type Circle = {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  max_members: number;
  frequency: string;
  member_count: number;
  my_role: string;
  created_at: string;
};

type CircleShare = {
  id: string;
  circle_id: string;
  user_id: string;
  dream_id: string | null;
  share_type: 'dream' | 'mirror' | 'resonance';
  content: string | null;
  created_at: string;
};

export type CirclesScreenProps = {
  userId: string;
  onClose?: () => void;
  onOpenDream?: (dreamId: string) => void;
};

type View = 'list' | 'create' | 'join' | 'detail';

type CircleResonances = {
  circleId: string;
  memberCount: number;
  dreamsAnalyzed: number;
  sharedFigures: { name: string; type: string; dreamers: string[]; dreamerCount: number; appearances: number }[];
  sharedThemes: { theme: string; count: number; dreamers: string[] }[];
  sharedProcesses: { process: string; count: number; dreamerCount: number }[];
  sharedMoods: { mood: string; count: number; dreamerCount: number }[];
  numinousDreams: { title: string; dreamer: string; numinosity: number | null; date: string }[];
  insight: { fr: string; en: string };
};

const FIGURE_TYPE_COLORS: Record<string, string> = {
  probable_self: '#B8A9E2',
  counterpart: '#7EC8E3',
  entity_fragment: '#F4A261',
  consciousness_cousin: '#9AE07C',
  post_mortem: '#C4C4C4',
  inner_ego_projection: '#E8B4B8',
  unknown: 'var(--fg-mute)',
};

export default function CirclesScreen({ userId, onClose, onOpenDream }: CirclesScreenProps) {
  const { t, locale } = useT();
  const [view, setView] = useState<View>('list');
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCircle, setActiveCircle] = useState<Circle | null>(null);
  const [shares, setShares] = useState<CircleShare[]>([]);
  const [resonances, setResonances] = useState<CircleResonances | null>(null);
  const [resonancesLoading, setResonancesLoading] = useState(false);

  // Create form
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  // Join form
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  // Share form
  const [mirrorText, setMirrorText] = useState('');
  const [sharing, setSharing] = useState(false);

  // Copied invite code
  const [copiedCode, setCopiedCode] = useState(false);

  const fetchCircles = async () => {
    try {
      const res = await authFetch(`/api/circles?userId=${userId}`);
      const data = await res.json();
      if (data.circles) setCircles(data.circles);
    } catch (e) {
      console.error('Error loading circles:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchShares = async (circleId: string) => {
    try {
      // 🔒 2026-04-20 : userId requis côté serveur (membership check)
      const res = await authFetch(`/api/circles/${circleId}/share?userId=${userId}`);
      const data = await res.json();
      if (data.shares) setShares(data.shares);
    } catch (e) {
      console.error('Error loading shares:', e);
    }
  };

  useEffect(() => {
    fetchCircles();
  }, [userId]);

  const fetchResonances = async (circleId: string) => {
    setResonancesLoading(true);
    try {
      // 🔒 2026-04-20 : userId requis côté serveur (membership check)
      const res = await authFetch(`/api/circles/${circleId}/resonances?userId=${userId}`);
      const data = await res.json();
      if (data.resonances) setResonances(data.resonances);
      else setResonances(null);
    } catch (e) {
      console.error('Error loading resonances:', e);
    } finally {
      setResonancesLoading(false);
    }
  };

  useEffect(() => {
    if (activeCircle) {
      fetchShares(activeCircle.id);
      fetchResonances(activeCircle.id);
    }
  }, [activeCircle]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await authFetch('/api/circles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          description: newDesc.trim() || null,
          userId,
        }),
      });
      const data = await res.json();
      if (data.circle) {
        setCircles(prev => [data.circle, ...prev]);
        setNewName('');
        setNewDesc('');
        setView('list');
      }
    } catch (e) {
      console.error('Error creating circle:', e);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setJoining(true);
    setJoinError('');
    try {
      const res = await fetch('/api/circles/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inviteCode: joinCode.trim(),
          userId,
          displayName: joinName.trim() || null,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setJoinError(data.error);
      } else if (data.circle) {
        await fetchCircles();
        setJoinCode('');
        setJoinName('');
        setView('list');
      }
    } catch (e) {
      setJoinError('Erreur réseau');
    } finally {
      setJoining(false);
    }
  };

  const handleShareMirror = async () => {
    if (!mirrorText.trim() || !activeCircle) return;
    setSharing(true);
    try {
      const res = await authFetch(`/api/circles/${activeCircle.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          shareType: 'mirror',
          content: mirrorText.trim(),
        }),
      });
      const data = await res.json();
      if (data.share) {
        setShares(prev => [data.share, ...prev]);
        setMirrorText('');
      }
    } catch (e) {
      console.error('Error sharing mirror:', e);
    } finally {
      setSharing(false);
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  const accent = 'var(--mode-reve-accent)';

  // ===== LIST VIEW =====
  if (view === 'list') {
    return (
      <div
        className="grain has-bottom-nav"
        style={{
          position: 'relative',
          minHeight: '100dvh',
          background: 'var(--bg-wash)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-serif)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, color: accent }}>◯</span>
              <Glyph size={10}>{t('circles.title')}</Glyph>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                <Glyph size={9} color="var(--fg-mute)">✕</Glyph>
              </button>
            )}
          </div>
          <div style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
            color: 'var(--fg-dim)', lineHeight: 1.5, marginBottom: 16,
          }}>
            {t('circles.intro')}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, padding: '0 20px', marginBottom: 20 }}>
          <button
            onClick={() => setView('create')}
            style={{
              flex: 1, padding: '12px 0',
              background: 'color-mix(in srgb, var(--mode-reve-accent) 12%, var(--bg-card))',
              border: `1px solid ${accent}`,
              borderRadius: 2,
              cursor: 'pointer', color: accent,
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}
          >
            {t('circles.create_btn')}
          </button>
          <button
            onClick={() => setView('join')}
            style={{
              flex: 1, padding: '12px 0',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              cursor: 'pointer', color: 'var(--fg)',
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}
          >
            {t('circles.join_btn')}
          </button>
        </div>

        <Rule />

        {/* Circle list */}
        <div style={{ padding: '16px 20px' }}>
          {loading && (
            <div style={{
              fontStyle: 'italic', fontSize: 14, color: 'var(--fg-mute)',
              textAlign: 'center', padding: 24,
            }}>
              {t('circles.loading')}
            </div>
          )}

          {!loading && circles.length === 0 && (
            <div style={{
              fontStyle: 'italic', fontSize: 15, color: 'var(--fg-mute)',
              textAlign: 'center', padding: '32px 0', lineHeight: 1.6,
            }}>
              {t('circles.empty')}
            </div>
          )}

          {circles.map((c) => (
            <button
              key={c.id}
              onClick={() => { setActiveCircle(c); setView('detail'); }}
              style={{
                width: '100%', textAlign: 'left',
                marginBottom: 14, padding: '16px 18px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 2,
                cursor: 'pointer', color: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <Glyph size={10} color={accent}>◯ {c.name}</Glyph>
                <Glyph size={8} color="var(--fg-mute)">{c.member_count}/{c.max_members}</Glyph>
              </div>
              {c.description && (
                <div style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                  color: 'var(--fg-dim)', lineHeight: 1.4, marginBottom: 6,
                }}>
                  {c.description}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12 }}>
                <Glyph size={8} color="var(--fg-mute)">{t(`circles.role_${c.my_role}`)}</Glyph>
                <Glyph size={8} color="var(--fg-mute)">{c.frequency}</Glyph>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ===== CREATE VIEW =====
  if (view === 'create') {
    return (
      <div
        className="grain"
        style={{
          minHeight: '100dvh',
          background: 'var(--bg-wash)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-serif)',
          padding: '0 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => setView('list')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Glyph size={10}>← {t('circles.back')}</Glyph>
          </button>
        </div>

        <SerifHeading>{t('circles.create_title')}</SerifHeading>
        <div style={{
          fontStyle: 'italic', fontSize: 15, color: 'var(--fg-dim)',
          lineHeight: 1.5, margin: '8px 0 24px',
        }}>
          {t('circles.create_desc')}
        </div>

        <label>
          <Glyph size={9} color="var(--fg-mute)">{t('circles.name_label')}</Glyph>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t('circles.name_placeholder')}
            maxLength={60}
            style={{
              display: 'block', width: '100%', marginTop: 6, marginBottom: 20,
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              color: 'var(--fg)',
              fontFamily: 'var(--font-serif)', fontSize: 16,
              outline: 'none',
            }}
          />
        </label>

        <label>
          <Glyph size={9} color="var(--fg-mute)">{t('circles.desc_label')}</Glyph>
          <textarea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder={t('circles.desc_placeholder')}
            rows={3}
            maxLength={300}
            style={{
              display: 'block', width: '100%', marginTop: 6, marginBottom: 24,
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              color: 'var(--fg)',
              fontFamily: 'var(--font-serif)', fontSize: 15,
              outline: 'none', resize: 'vertical',
            }}
          />
        </label>

        <button
          onClick={handleCreate}
          disabled={!newName.trim() || creating}
          style={{
            width: '100%', padding: '14px 0',
            background: newName.trim()
              ? 'color-mix(in srgb, var(--mode-reve-accent) 20%, var(--bg-card))'
              : 'var(--bg-card)',
            border: `1px solid ${newName.trim() ? accent : 'var(--border)'}`,
            borderRadius: 2,
            cursor: newName.trim() ? 'pointer' : 'default',
            color: newName.trim() ? accent : 'var(--fg-mute)',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: 1.5, textTransform: 'uppercase',
            opacity: creating ? 0.5 : 1,
          }}
        >
          {creating ? '...' : t('circles.create_submit')}
        </button>
      </div>
    );
  }

  // ===== JOIN VIEW =====
  if (view === 'join') {
    return (
      <div
        className="grain"
        style={{
          minHeight: '100dvh',
          background: 'var(--bg-wash)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-serif)',
          padding: '0 20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <button
            onClick={() => setView('list')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Glyph size={10}>← {t('circles.back')}</Glyph>
          </button>
        </div>

        <SerifHeading>{t('circles.join_title')}</SerifHeading>
        <div style={{
          fontStyle: 'italic', fontSize: 15, color: 'var(--fg-dim)',
          lineHeight: 1.5, margin: '8px 0 24px',
        }}>
          {t('circles.join_desc')}
        </div>

        <label>
          <Glyph size={9} color="var(--fg-mute)">{t('circles.code_label')}</Glyph>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={6}
            style={{
              display: 'block', width: '100%', marginTop: 6, marginBottom: 20,
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              color: 'var(--fg)',
              fontFamily: 'var(--font-mono)', fontSize: 18,
              letterSpacing: 4, textAlign: 'center',
              outline: 'none',
            }}
          />
        </label>

        <label>
          <Glyph size={9} color="var(--fg-mute)">{t('circles.display_name_label')}</Glyph>
          <input
            type="text"
            value={joinName}
            onChange={(e) => setJoinName(e.target.value)}
            placeholder={t('circles.display_name_placeholder')}
            maxLength={30}
            style={{
              display: 'block', width: '100%', marginTop: 6, marginBottom: 24,
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              color: 'var(--fg)',
              fontFamily: 'var(--font-serif)', fontSize: 16,
              outline: 'none',
            }}
          />
        </label>

        {joinError && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: 'color-mix(in srgb, #c74f4f 10%, var(--bg-card))',
            borderLeft: '2px solid #c74f4f',
            fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
            color: '#c74f4f',
          }}>
            {joinError}
          </div>
        )}

        <button
          onClick={handleJoin}
          disabled={!joinCode.trim() || joining}
          style={{
            width: '100%', padding: '14px 0',
            background: joinCode.trim()
              ? 'color-mix(in srgb, var(--mode-reve-accent) 20%, var(--bg-card))'
              : 'var(--bg-card)',
            border: `1px solid ${joinCode.trim() ? accent : 'var(--border)'}`,
            borderRadius: 2,
            cursor: joinCode.trim() ? 'pointer' : 'default',
            color: joinCode.trim() ? accent : 'var(--fg-mute)',
            fontFamily: 'var(--font-mono)', fontSize: 11,
            letterSpacing: 1.5, textTransform: 'uppercase',
            opacity: joining ? 0.5 : 1,
          }}
        >
          {joining ? '...' : t('circles.join_submit')}
        </button>
      </div>
    );
  }

  // ===== DETAIL VIEW =====
  if (view === 'detail' && activeCircle) {
    const dreamShares = shares.filter(s => s.share_type === 'dream');
    const mirrorShares = shares.filter(s => s.share_type === 'mirror' || s.share_type === 'resonance');

    return (
      <div
        className="grain"
        style={{
          minHeight: '100dvh',
          background: 'var(--bg-wash)',
          color: 'var(--fg)',
          fontFamily: 'var(--font-serif)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button
              onClick={() => { setActiveCircle(null); setView('list'); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Glyph size={10}>← {t('circles.back')}</Glyph>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 22, color: accent }}>◯</span>
            <SerifHeading>{activeCircle.name}</SerifHeading>
          </div>

          {activeCircle.description && (
            <div style={{
              fontStyle: 'italic', fontSize: 15, color: 'var(--fg-dim)',
              lineHeight: 1.5, marginBottom: 12,
            }}>
              {activeCircle.description}
            </div>
          )}

          {/* Invite code */}
          <button
            onClick={() => copyInviteCode(activeCircle.invite_code)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', marginBottom: 16,
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              cursor: 'pointer', color: 'var(--fg)',
            }}
          >
            <Glyph size={9} color="var(--fg-mute)">{t('circles.invite_code')}</Glyph>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 14,
              letterSpacing: 3, color: accent,
            }}>
              {activeCircle.invite_code}
            </span>
            <Glyph size={8} color="var(--fg-mute)">
              {copiedCode ? t('circles.copied') : t('circles.copy')}
            </Glyph>
          </button>

          <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
            <Glyph size={9} color="var(--fg-mute)">
              {activeCircle.member_count} {t('circles.members')}
            </Glyph>
            <Glyph size={9} color="var(--fg-mute)">
              {t(`circles.role_${activeCircle.my_role}`)}
            </Glyph>
          </div>
        </div>

        <Rule />

        {/* Shared dreams */}
        <div style={{ padding: '16px 20px' }}>
          <Glyph size={10} color={accent}>{t('circles.shared_dreams')}</Glyph>

          {dreamShares.length === 0 && (
            <div style={{
              fontStyle: 'italic', fontSize: 14, color: 'var(--fg-mute)',
              padding: '20px 0', textAlign: 'center',
            }}>
              {t('circles.no_shares')}
            </div>
          )}

          {dreamShares.map((s) => (
            <div
              key={s.id}
              style={{
                marginTop: 12, padding: '14px 16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 2,
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 15, color: 'var(--fg)', lineHeight: 1.5,
              }}>
                {s.content || '(rêve partagé)'}
              </div>
              <Glyph size={8} color="var(--fg-mute)" style={{ marginTop: 8 }}>
                {new Date(s.created_at).toLocaleDateString()}
              </Glyph>
            </div>
          ))}
        </div>

        <Rule />

        {/* Mirrors / "si c'était mon rêve" */}
        <div style={{ padding: '16px 20px' }}>
          <Glyph size={10} color={accent}>{t('circles.mirrors')}</Glyph>

          {mirrorShares.map((s) => (
            <div
              key={s.id}
              style={{
                marginTop: 12, padding: '12px 14px',
                background: 'color-mix(in srgb, var(--accent) 5%, var(--bg))',
                borderLeft: '2px solid var(--accent)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 14, color: 'var(--fg)', lineHeight: 1.5,
              }}>
                « {s.content} »
              </div>
            </div>
          ))}

          {/* Write a mirror */}
          <div style={{ marginTop: 20 }}>
            <Glyph size={9} color="var(--fg-mute)">{t('circles.write_mirror')}</Glyph>
            <textarea
              value={mirrorText}
              onChange={(e) => setMirrorText(e.target.value)}
              placeholder={t('circles.mirror_placeholder')}
              rows={3}
              maxLength={1000}
              style={{
                display: 'block', width: '100%', marginTop: 8,
                padding: '12px 14px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 2,
                color: 'var(--fg)',
                fontFamily: 'var(--font-serif)', fontSize: 15, fontStyle: 'italic',
                outline: 'none', resize: 'vertical',
              }}
            />
            <button
              onClick={handleShareMirror}
              disabled={!mirrorText.trim() || sharing}
              style={{
                marginTop: 10, padding: '10px 20px',
                background: mirrorText.trim()
                  ? 'color-mix(in srgb, var(--accent) 15%, var(--bg-card))'
                  : 'var(--bg-card)',
                border: `1px solid ${mirrorText.trim() ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 2,
                cursor: mirrorText.trim() ? 'pointer' : 'default',
                color: mirrorText.trim() ? 'var(--accent)' : 'var(--fg-mute)',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: 1.5, textTransform: 'uppercase',
                opacity: sharing ? 0.5 : 1,
              }}
            >
              {sharing ? '...' : t('circles.share_mirror_btn')}
            </button>
          </div>
        </div>

        <Rule />

        {/* ===== RESONANCES — Couche 1 ===== */}
        <div style={{ padding: '16px 20px' }}>
          <Glyph size={10} color={accent}>
            {locale === 'fr' ? '◎ Résonances du cercle' : '◎ Circle resonances'}
          </Glyph>
          <div style={{
            fontStyle: 'italic', fontSize: 13, color: 'var(--fg-dim)',
            marginTop: 4, marginBottom: 12, lineHeight: 1.5,
          }}>
            {locale === 'fr'
              ? 'L\'IA croise vos rêves et détecte les patterns partagés.'
              : 'AI cross-references your dreams and detects shared patterns.'}
          </div>

          {resonancesLoading && (
            <div style={{ textAlign: 'center', padding: 20, fontStyle: 'italic', color: 'var(--fg-mute)' }}>
              {locale === 'fr' ? 'Lecture des résonances...' : 'Reading resonances...'}
            </div>
          )}

          {!resonancesLoading && !resonances && (
            <div style={{
              textAlign: 'center', padding: 20, fontStyle: 'italic', color: 'var(--fg-mute)',
              lineHeight: 1.5,
            }}>
              {locale === 'fr'
                ? 'Pas encore assez de rêves partagés pour détecter des résonances. Invitez des rêveurs !'
                : 'Not enough shared dreams yet to detect resonances. Invite dreamers!'}
            </div>
          )}

          {!resonancesLoading && resonances && (
            <>
              {/* Insight banner */}
              <div style={{
                padding: '12px 16px', marginBottom: 16,
                background: 'color-mix(in srgb, var(--mode-reve-accent) 8%, var(--bg-card))',
                borderLeft: `3px solid ${accent}`,
                fontStyle: 'italic', fontSize: 14, color: 'var(--fg)',
                lineHeight: 1.5,
              }}>
                {locale === 'fr' ? resonances.insight.fr : resonances.insight.en}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <Glyph size={8} color="var(--fg-mute)">
                  {resonances.dreamsAnalyzed} {locale === 'fr' ? 'rêves analysés' : 'dreams analyzed'}
                </Glyph>
                <Glyph size={8} color="var(--fg-mute)">
                  {resonances.memberCount} {locale === 'fr' ? 'membres' : 'members'}
                </Glyph>
              </div>

              {/* Shared figures */}
              {resonances.sharedFigures.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <Glyph size={9} color="var(--fg-mute)">
                    {locale === 'fr' ? 'Figures partagées' : 'Shared figures'}
                  </Glyph>
                  {resonances.sharedFigures.map((f, i) => (
                    <div key={f.name} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0',
                      borderBottom: i < resonances.sharedFigures.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: FIGURE_TYPE_COLORS[f.type] || FIGURE_TYPE_COLORS.unknown,
                          display: 'inline-block',
                        }} />
                        <span style={{
                          fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
                        }}>
                          {f.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <Glyph size={8} color="var(--fg-mute)">{f.appearances}×</Glyph>
                        <Tag>{f.dreamerCount} {locale === 'fr' ? 'rêveurs' : 'dreamers'}</Tag>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Shared themes */}
              {resonances.sharedThemes.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <Glyph size={9} color="var(--fg-mute)">
                    {locale === 'fr' ? 'Thèmes communs' : 'Common themes'}
                  </Glyph>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                    {resonances.sharedThemes.map(th => (
                      <div key={th.theme} style={{
                        padding: '5px 12px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 2,
                        fontStyle: 'italic', fontSize: 13,
                      }}>
                        {th.theme}
                        <span style={{ marginLeft: 6, color: 'var(--fg-mute)', fontSize: 11 }}>
                          {th.count} · {th.dreamers.length}◎
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared processes */}
              {resonances.sharedProcesses.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <Glyph size={9} color="var(--fg-mute)">
                    {locale === 'fr' ? 'Mouvements archétypaux communs' : 'Shared archetypal movements'}
                  </Glyph>
                  {resonances.sharedProcesses.map(p => (
                    <div key={p.process} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '8px 0', borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{ fontStyle: 'italic', fontSize: 14 }}>◇ {p.process}</span>
                      <Glyph size={8} color="var(--fg-mute)">
                        {p.count}× · {p.dreamerCount} {locale === 'fr' ? 'rêveurs' : 'dreamers'}
                      </Glyph>
                    </div>
                  ))}
                </div>
              )}

              {/* Numinous dreams in circle */}
              {resonances.numinousDreams.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <Glyph size={9} color="var(--fg-mute)">
                    {locale === 'fr' ? 'Grands rêves du cercle' : 'Big dreams in the circle'}
                  </Glyph>
                  {resonances.numinousDreams.map((d, i) => (
                    <div key={i} style={{
                      padding: '10px 14px', marginTop: 8,
                      background: 'color-mix(in srgb, var(--mode-reve-accent) 6%, var(--bg-card))',
                      borderLeft: `2px solid ${accent}`,
                    }}>
                      <div style={{ fontStyle: 'italic', fontSize: 14 }}>{d.title}</div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                        <Glyph size={8} color="var(--fg-mute)">{d.dreamer}</Glyph>
                        <Glyph size={8} color={accent}>✦ {d.numinosity}/5</Glyph>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Bottom padding */}
        <div style={{ height: 40 }} />
      </div>
    );
  }

  return null;
}
