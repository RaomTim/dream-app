'use client';

import React, { useState } from 'react';
import { Glyph, SerifHeading, BtnGhost, Diamond, Tag } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';

export type ProfileScreenProps = {
  userName?: string;
  email?: string;
  theme: string;
  onToggleTheme: () => void;
  stats?: { dreams: number; days: number; symbols: number };
  topFigures?: { name: string; count: number }[];
  onClose: () => void;
  onSignOut: () => void;
  onImport?: () => void;
};

export default function ProfileScreen({
  userName, email, theme, onToggleTheme, stats, topFigures, onClose, onSignOut, onImport,
}: ProfileScreenProps) {
  const { t, locale, setLocale } = useT();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  const changePassword = async () => {
    if (!newPassword.trim() || newPassword.length < 6 || passwordSaving) return;
    setPasswordSaving(true);
    setPasswordMsg(null);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPassword.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg(locale === 'fr' ? 'Mot de passe changé ✓' : 'Password changed ✓');
        setNewPassword('');
        setTimeout(() => { setShowPasswordChange(false); setPasswordMsg(null); }, 2000);
      } else {
        setPasswordMsg(data.error || 'Error');
      }
    } catch {
      setPasswordMsg('Erreur réseau');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="grain screen-enter-fade" style={{
      minHeight: '100dvh', background: 'var(--bg-wash)',
      paddingTop: 'env(safe-area-inset-top, 12px)',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Glyph size={10}>{t('profile.back')}</Glyph>
        </button>
        <Glyph size={10}>{t('profile.title')}</Glyph>
      </div>

      {/* Avatar + name */}
      <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
          background: 'var(--structural-bg)', border: '1px solid var(--structural-line)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 28, fontStyle: 'italic',
          color: 'var(--accent)',
        }}>
          {(userName || email || 'D')[0].toUpperCase()}
        </div>
        <SerifHeading size={22}>{userName || t('profile.dreamer')}</SerifHeading>
        {email && <Glyph size={9} color="var(--fg-mute)" style={{ marginTop: 6, display: 'block' }}>{email}</Glyph>}
      </div>

      {/* Stats */}
      {stats && (
        <div style={{
          display: 'flex', gap: 12, padding: '28px 20px 0', justifyContent: 'center',
        }}>
          {[
            { label: t('profile.dreams'), value: stats.dreams },
            { label: t('profile.days'), value: stats.days },
            { label: t('profile.symbols'), value: stats.symbols },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, maxWidth: 110, textAlign: 'center',
              padding: '16px 8px', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 2,
            }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontStyle: 'italic', color: 'var(--accent)' }}>
                {s.value}
              </div>
              <Glyph size={8} color="var(--fg-mute)">{s.label}</Glyph>
            </div>
          ))}
        </div>
      )}

      {/* Top figures */}
      {topFigures && topFigures.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <Glyph size={10}>{t('profile.your_figures')}</Glyph>
          <div style={{ marginTop: 12 }}>
            {topFigures.slice(0, 5).map(f => (
              <div key={f.name} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--fg)' }}>
                  {f.name}
                </span>
                <Glyph size={9} color="var(--fg-mute)">{f.count}×</Glyph>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div style={{ padding: '28px 20px 40px' }}>
        <Glyph size={10}>{t('profile.settings')}</Glyph>
        <div style={{ marginTop: 12 }}>
          {onImport && (
            <button
              onClick={onImport}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
                cursor: 'pointer', color: 'var(--accent)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16 }}>
                Importer mes rêves anciens
              </span>
              <Diamond size={6} />
            </button>
          )}
          <button
            onClick={onToggleTheme}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--fg)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16 }}>{t('profile.theme')}</span>
            <Tag>{theme === 'auto' ? t('profile.theme_auto') : theme === 'night' ? t('profile.theme_night') : t('profile.theme_day')}</Tag>
          </button>
          <button
            onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--fg)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16 }}>{t('profile.language')}</span>
            <Tag>{locale === 'fr' ? 'Français' : 'English'}</Tag>
          </button>
          {/* Change password */}
          <div style={{ borderBottom: '1px solid var(--border)' }}>
            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 0', background: 'transparent', border: 'none',
                cursor: 'pointer', color: 'var(--fg)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16 }}>
                {locale === 'fr' ? 'Changer le mot de passe' : 'Change password'}
              </span>
              <Diamond size={6} />
            </button>
            {showPasswordChange && (
              <div style={{ padding: '0 0 14px' }}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={locale === 'fr' ? 'Nouveau mot de passe (min 6 car.)' : 'New password (min 6 chars)'}
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid var(--border)',
                    background: 'var(--bg-card)', borderRadius: 2, color: 'var(--fg)',
                    fontFamily: 'var(--font-serif)', fontSize: 14, fontStyle: 'italic',
                    outline: 'none',
                  }}
                />
                <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                  <button
                    onClick={changePassword}
                    disabled={!newPassword.trim() || newPassword.length < 6 || passwordSaving}
                    style={{
                      background: 'transparent', border: '1px solid var(--accent)',
                      padding: '6px 14px', borderRadius: 2,
                      cursor: newPassword.length >= 6 ? 'pointer' : 'not-allowed',
                      opacity: newPassword.length >= 6 ? 1 : 0.3,
                    }}
                  >
                    <Glyph size={9} color="var(--accent)">
                      {passwordSaving ? '...' : locale === 'fr' ? 'changer' : 'change'}
                    </Glyph>
                  </button>
                  {passwordMsg && (
                    <Glyph size={9} color={passwordMsg.includes('✓') ? '#9AE07C' : 'var(--rouge)'}>{passwordMsg}</Glyph>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onSignOut}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--accent)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16 }}>{t('profile.sign_out')}</span>
            <Diamond size={6} />
          </button>
        </div>
      </div>
    </div>
  );
}
