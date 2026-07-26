'use client';

import React, { useState, useEffect } from 'react';
import { Glyph, SerifHeading, Rule, Diamond, Tag } from '@/components/dream/ui/primitives';
import { useT } from '@/lib/i18n';
import { useAuth } from '@/components/AuthProvider';
import { authFetch } from '@/lib/api-client';
import { Surface, GeoSymbol, ConstellationD3, type ConstellationNode, type ConstellationEdge } from '@/components/dream-v12';

// ============================================================
// TYPES — matching V2 API response shape
// ============================================================

type MasterEvent = {
  id: string;
  type: 'process_convergence' | 'figure_convergence' | 'theme_surge' | 'numinous_cluster' | 'mood_shift';
  severity: 'signal' | 'pattern' | 'convergence' | 'master_event';
  title: string;
  description: { fr: string; en: string };
  elements: string[];
  dreamerCount: number;
  dreamCount: number;
  numinousRatio: number;
  signalStrength: number;
  windowDays: number;
};

type HistoricalEvent = {
  id: string;
  event_type: string;
  severity: string;
  title: string;
  description: string;
  signal_strength: number;
  dreamer_count: number;
  dream_count: number;
  status: string;
  confirmed_at: string | null;
  confirmation_note: string | null;
  created_at: string;
};

type CollectiveData = {
  range: string;
  scope: string;
  scopeValue: string | null;
  period: { from: string; to: string };
  stats: {
    totalDreams: number;
    uniqueDreamers: number;
    numinousCount: number;
    numinousRate: number;
    totalWeighted: number;
    avgDreamsPerDay: number;
  };
  globalFigures: {
    name: string; type: string; count: number; weightedCount: number;
    dreamers: number; numinousCount: number; crossDreamer: boolean; dates: string[];
  }[];
  globalThemes: {
    theme: string; count: number; weightedCount: number;
    dreamers: number; crossDreamer: boolean;
  }[];
  globalProcesses: {
    process: string; count: number; weightedCount: number;
    dreamers: number; numinousCount: number; dates: string[];
  }[];
  moodLandscape: { mood: string; count: number; weightedCount: number }[];
  dailyRhythm: { date: string; count: number; numinous: number }[];
  soulWishes: { wish: string; numinosity: number; date: string }[];
  geoBreakdown: { country: string; dreamCount: number; dreamerCount: number }[];
};

type APIResponse = {
  collective: CollectiveData | null;
  masterEvents: MasterEvent[];
  historicalEvents: HistoricalEvent[];
  message?: string;
};

export type CollectiveScreenProps = {
  onClose: () => void;
};

// ============================================================
// CONSTANTS
// ============================================================

const SEVERITY_CONFIG: Record<string, { color: string; glyph: string; labelFr: string; labelEn: string }> = {
  master_event:  { color: '#E74C3C', glyph: '◉', labelFr: 'MASTER EVENT', labelEn: 'MASTER EVENT' },
  convergence:   { color: '#E67E22', glyph: '◎', labelFr: 'CONVERGENCE', labelEn: 'CONVERGENCE' },
  pattern:       { color: '#F1C40F', glyph: '◈', labelFr: 'PATTERN', labelEn: 'PATTERN' },
  signal:        { color: 'var(--fg-mute)', glyph: '·', labelFr: 'SIGNAL', labelEn: 'SIGNAL' },
};

const EVENT_TYPE_LABELS: Record<string, { fr: string; en: string }> = {
  process_convergence: { fr: 'Processus', en: 'Process' },
  figure_convergence:  { fr: 'Figure', en: 'Figure' },
  theme_surge:         { fr: 'Thème', en: 'Theme' },
  numinous_cluster:    { fr: 'Numineux', en: 'Numinous' },
  mood_shift:          { fr: 'Humeur', en: 'Mood' },
};

const PROCESS_ICONS: Record<string, string> = {
  'katabasis': '⤵', 'descente': '⤵', 'seuil': '◈',
  'traversée de seuil': '◈', 'mort-renaissance': '☽',
  'coniunctio': '⊕', 'démembrement': '✧',
  'métamorphose': '◎', 'vol': '↑', 'ascension': '↑',
};

const FIGURE_TYPE_COLORS: Record<string, string> = {
  probable_self: '#B8A9E2', counterpart: '#7EC8E3',
  entity_fragment: '#F4A261', consciousness_cousin: '#9AE07C',
  post_mortem: '#C4C4C4', inner_ego_projection: '#E8B4B8',
  unknown: 'var(--fg-mute)',
};

const NUMINOSITY_STARS: Record<number, string> = {
  1: '·', 2: '✦', 3: '✦✦', 4: '✦✦✦', 5: '✦✦✦✦',
};

// ════════════════════════════════════════════════════
// V1.2 — Voûte Anima Mundi : nodes + edges générés
// 29 nodes : 1 center "anima" + 28 figures partagées
// ════════════════════════════════════════════════════
const ANIMA_LABELS = [
  'porte', 'eau', 'grand-mère', 'estuaire', 'pont', 'seuil',
  'feu mort', 'cuisine', 'défunt', 'animal qui parle',
];
const ANIMA_NODES: ConstellationNode[] = (() => {
  const arr: ConstellationNode[] = [
    { id: 'anima', label: 'anima mundi', kind: 'self', weight: 4 },
  ];
  for (let i = 0; i < 28; i++) {
    arr.push({
      id: `n${i}`,
      label: i < 8 ? ANIMA_LABELS[i % ANIMA_LABELS.length] : '',
      kind: i % 11 === 0 ? 'bigdream' : (i % 4 === 0 ? 'holding' : 'member'),
      weight: 1 + (i % 3) * 0.5,
    });
  }
  return arr;
})();
const ANIMA_EDGES: ConstellationEdge[] = (() => {
  const e: ConstellationEdge[] = [];
  for (let i = 0; i < 28; i++) {
    e.push({ source: 'anima', target: `n${i}`, alive: i < 6 });
  }
  for (let i = 0; i < 28; i++) {
    if (i % 3 === 0 && i + 2 < 28) e.push({ source: `n${i}`, target: `n${i + 2}` });
  }
  return e;
})();

type ScopeKey = 'global' | 'country' | 'region' | 'timezone';
type RangeKey = '7d' | '30d' | 'lunar' | '90d';

// ============================================================
// COMPONENT
// ============================================================

export default function CollectiveScreen({ onClose }: CollectiveScreenProps) {
  const { t, locale } = useT();
  const { user } = useAuth();
  const fr = locale === 'fr';

  const [data, setData] = useState<CollectiveData | null>(null);
  const [masterEvents, setMasterEvents] = useState<MasterEvent[]>([]);
  const [historicalEvents, setHistoricalEvents] = useState<HistoricalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('7d');
  const [scope, setScope] = useState<ScopeKey>('global');
  const [scopeValue, setScopeValue] = useState('');

  const accent = 'var(--mode-reve-accent)';
  const alertAccent = '#E74C3C';

  useEffect(() => {
    if (!user?.id) return; // 🔒 attend la session
    setLoading(true);
    const params = new URLSearchParams({ range, scope, userId: user.id });
    if (scopeValue) params.set('scopeValue', scopeValue);
    authFetch(`/api/dreams/collective?${params}`)
      .then(res => res.json())
      .then((d: APIResponse) => {
        setData(d.collective || null);
        setMasterEvents(d.masterEvents || []);
        setHistoricalEvents(d.historicalEvents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [range, scope, scopeValue, user?.id]);

  // Partition master events by severity
  const criticalEvents = masterEvents.filter(e => e.severity === 'master_event' || e.severity === 'convergence');
  const patternEvents = masterEvents.filter(e => e.severity === 'pattern');
  const signalEvents = masterEvents.filter(e => e.severity === 'signal');
  const hasCritical = criticalEvents.length > 0;

  return (
    <div
      className="grain screen-enter-fade has-bottom-nav"
      style={{
        minHeight: '100dvh',
        background: 'var(--bg-wash)',
        color: 'var(--fg)',
        fontFamily: 'var(--font-serif)',
        paddingTop: 'env(safe-area-inset-top, 12px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dream V1.2 — Anima Mundi Voûte : matter EARTH + songlines + demi-cercle aurore */}
      <Surface
        matter="earth"
        motion={true}
        style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.22, pointerEvents: 'none', zIndex: 0 }}>
        <GeoSymbol kind="songlines" color="silk" />
      </div>
      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, height: 200, opacity: 0.7, pointerEvents: 'none', zIndex: 0 }}>
        <GeoSymbol kind="demi-cercle" color="silk" />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 1, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Glyph size={10}>{fr ? '← retour' : '← back'}</Glyph>
        </button>
        <Glyph size={10}>◉</Glyph>
      </div>

      {/* Title — Oracle framing */}
      <div style={{ textAlign: 'center', padding: '0 20px 8px' }}>
        <SerifHeading size={28} italic>
          Anima Mundi
        </SerifHeading>
        <div style={{
          fontStyle: 'italic', fontSize: 13, color: 'var(--fg-dim)',
          lineHeight: 1.5, marginTop: 8, maxWidth: 360, margin: '8px auto 0',
        }}>
          {fr
            ? 'Voûte du collectif. Les rêves coordonnent au niveau de l\'espèce — la réalité se forme dans la nuit avant le jour.'
            : 'The collective vault. Dreams coordinate at species level — reality forms in the night before the day.'}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          CONSTELLATION D3 — Voûte vivante (29 nodes)
          ════════════════════════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 1, margin: '16px 12px 8px',
        border: '1px solid color-mix(in oklch, var(--v12-clay-earth) 28%, transparent)',
        background: 'color-mix(in oklch, var(--v12-night-warm) 50%, transparent)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
      }}>
        <ConstellationD3
          nodes={ANIMA_NODES}
          edges={ANIMA_EDGES}
          focalId="anima"
          driftParticles={true}
          showLabels={true}
          style={{ width: '100%', height: 360 }}
        />
      </div>

      {data && data.stats && (
        <div style={{
          position: 'relative', zIndex: 1,
          textAlign: 'center', padding: '8px 28px 0',
          fontFamily: 'var(--font-serif)', fontStyle: 'italic',
          fontSize: 16, color: 'var(--fg-dim)', maxWidth: 520, margin: '0 auto',
        }}>
          {fr
            ? `Cette lune, l'humanité a déposé ${data.stats.totalDreams.toLocaleString('fr-FR')} moments — rêves, signes, traversées.`
            : `This moon, humanity deposited ${data.stats.totalDreams.toLocaleString('en-US')} moments — dreams, signs, crossings.`}
        </div>
      )}

      {/* ── SCOPE SELECTOR ── */}
      <div style={{ padding: '12px 20px 4px' }}>
        <Glyph size={8} color="var(--fg-mute)">{fr ? 'COUCHE' : 'SCOPE'}</Glyph>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {([
            { key: 'global' as ScopeKey, label: fr ? 'Global' : 'Global', glyph: '◉' },
            { key: 'country' as ScopeKey, label: fr ? 'Pays' : 'Country', glyph: '◎' },
            { key: 'region' as ScopeKey, label: fr ? 'Région' : 'Region', glyph: '○' },
            { key: 'timezone' as ScopeKey, label: 'Timezone', glyph: '◔' },
          ]).map(s => (
            <button
              key={s.key}
              onClick={() => { setScope(s.key); if (s.key === 'global') setScopeValue(''); }}
              style={{
                padding: '5px 12px',
                background: scope === s.key
                  ? 'color-mix(in srgb, var(--mode-reve-accent) 15%, var(--bg-card))'
                  : 'var(--bg-card)',
                border: `1px solid ${scope === s.key ? accent : 'var(--border)'}`,
                borderRadius: 2, cursor: 'pointer',
                color: scope === s.key ? accent : 'var(--fg-mute)',
                fontFamily: 'var(--font-mono)', fontSize: 8,
                letterSpacing: 1.5, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ fontSize: 12 }}>{s.glyph}</span> {s.label}
            </button>
          ))}
        </div>
        {/* Scope value input for non-global */}
        {scope !== 'global' && (
          <input
            type="text"
            value={scopeValue}
            onChange={e => setScopeValue(e.target.value)}
            placeholder={
              scope === 'country' ? (fr ? 'ex: france' : 'e.g. france')
              : scope === 'region' ? (fr ? 'ex: bali' : 'e.g. bali')
              : 'e.g. Asia/Jakarta'
            }
            style={{
              marginTop: 8, width: '100%', padding: '8px 12px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 2, color: 'var(--fg)',
              fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
              outline: 'none',
            }}
          />
        )}
      </div>

      {/* ── RANGE SELECTOR ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '10px 20px 16px' }}>
        {([
          { key: '7d' as RangeKey, label: fr ? '7 jours' : '7 days' },
          { key: '30d' as RangeKey, label: fr ? '30 jours' : '30 days' },
          { key: 'lunar' as RangeKey, label: fr ? 'Lunaire' : 'Lunar' },
          { key: '90d' as RangeKey, label: fr ? '90 jours' : '90 days' },
        ]).map(r => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            style={{
              padding: '5px 12px',
              background: range === r.key
                ? 'color-mix(in srgb, var(--mode-reve-accent) 15%, var(--bg-card))'
                : 'var(--bg-card)',
              border: `1px solid ${range === r.key ? accent : 'var(--border)'}`,
              borderRadius: 2, cursor: 'pointer',
              color: range === r.key ? accent : 'var(--fg-mute)',
              fontFamily: 'var(--font-mono)', fontSize: 8,
              letterSpacing: 1.5, textTransform: 'uppercase',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <Rule />

      {/* ── LOADING ── */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, fontStyle: 'italic', color: 'var(--fg-mute)' }}>
          {fr ? 'Écoute du champ collectif...' : 'Listening to the collective field...'}
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && !data && (
        <div style={{ textAlign: 'center', padding: 40, fontStyle: 'italic', color: 'var(--fg-mute)' }}>
          {fr
            ? 'Pas encore assez de rêves pour entendre le collectif. Continue de rêver.'
            : 'Not enough dreams yet to hear the collective. Keep dreaming.'}
        </div>
      )}

      {!loading && data && (
        <div style={{ padding: '0 20px 40px' }}>

          {/* ═══════════════════════════════════════════════
              MASTER EVENTS — THE ORACLE CORE
              Seth: dreams coordinate before reality manifests
              ═══════════════════════════════════════════════ */}
          {masterEvents.length > 0 && (
            <div style={{
              marginTop: 16, marginBottom: 28,
              background: hasCritical
                ? 'color-mix(in srgb, #E74C3C 6%, var(--bg-wash))'
                : 'transparent',
              padding: hasCritical ? '16px 16px 12px' : 0,
              border: hasCritical ? '1px solid color-mix(in srgb, #E74C3C 25%, transparent)' : 'none',
              borderRadius: 2,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>◉</span>
                <SerifHeading size={18}>
                  {fr ? 'Détections oraculaires' : 'Oracle Detections'}
                </SerifHeading>
                {hasCritical && (
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1.5,
                    textTransform: 'uppercase', color: alertAccent,
                    border: `1px solid ${alertAccent}`, borderRadius: 'var(--r-full)',
                    padding: '2px 8px', animation: 'pulse 2s infinite',
                  }}>
                    {fr ? 'ACTIF' : 'ACTIVE'}
                  </span>
                )}
              </div>

              <div style={{
                fontStyle: 'italic', fontSize: 12, color: 'var(--fg-dim)',
                marginBottom: 14, lineHeight: 1.5,
              }}>
                {fr
                  ? 'Quand des clusters de rêves convergent avant la réalité — réalité en formation.'
                  : 'When dream clusters converge before reality manifests — reality in formation.'}
              </div>

              {/* Critical & Convergence events — prominent */}
              {criticalEvents.map(evt => (
                <MasterEventCard key={evt.id} event={evt} locale={locale} />
              ))}

              {/* Pattern events — medium */}
              {patternEvents.length > 0 && (
                <div style={{ marginTop: criticalEvents.length > 0 ? 12 : 0 }}>
                  {patternEvents.map(evt => (
                    <MasterEventCard key={evt.id} event={evt} locale={locale} compact />
                  ))}
                </div>
              )}

              {/* Signal events — subtle */}
              {signalEvents.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <Glyph size={8} color="var(--fg-mute)">
                    {fr ? `${signalEvents.length} signaux faibles` : `${signalEvents.length} weak signals`}
                  </Glyph>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {signalEvents.map(evt => (
                      <span key={evt.id} style={{
                        padding: '4px 10px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 2,
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12,
                        color: 'var(--fg-dim)',
                      }}>
                        {evt.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {masterEvents.length === 0 && (
            <div style={{
              textAlign: 'center', padding: '20px 0', marginTop: 16, marginBottom: 12,
              fontStyle: 'italic', fontSize: 14, color: 'var(--fg-dim)',
              background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 2,
            }}>
              {fr
                ? 'Aucune convergence détectée sur cette fenêtre. Le champ est calme.'
                : 'No convergence detected in this window. The field is calm.'}
            </div>
          )}

          <Rule />

          {/* ═══════════════════════════════════════════════
              NUMINOUS SIGNAL — big dream field intensity
              ═══════════════════════════════════════════════ */}
          <div style={{
            marginTop: 20, marginBottom: 24,
            padding: '16px',
            background: data.stats.numinousRate >= 25
              ? 'color-mix(in srgb, #F1C40F 8%, var(--bg-card))'
              : 'var(--bg-card)',
            border: `1px solid ${data.stats.numinousRate >= 25 ? 'color-mix(in srgb, #F1C40F 30%, transparent)' : 'var(--border)'}`,
            borderRadius: 2,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Glyph size={9} color={data.stats.numinousRate >= 25 ? '#F1C40F' : accent}>
                  {fr ? 'SIGNAL NUMINEUX' : 'NUMINOUS SIGNAL'}
                </Glyph>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 13,
                  color: 'var(--fg-dim)', marginTop: 4,
                }}>
                  {fr
                    ? `${data.stats.numinousRate}% des rêves sont numineux (base ~10%)`
                    : `${data.stats.numinousRate}% of dreams are numinous (baseline ~10%)`}
                </div>
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)', fontSize: 32, fontStyle: 'italic',
                color: data.stats.numinousRate >= 25 ? '#F1C40F' : accent,
              }}>
                {data.stats.numinousRate}%
              </div>
            </div>
            {/* Numinous bar */}
            <div style={{
              marginTop: 10, height: 6, background: 'var(--structural-bg)',
              borderRadius: 3, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${Math.min(data.stats.numinousRate, 100)}%`,
                background: data.stats.numinousRate >= 25
                  ? 'linear-gradient(90deg, #F1C40F, #E74C3C)'
                  : accent,
                borderRadius: 3,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <Glyph size={7} color="var(--fg-mute)">0%</Glyph>
              <Glyph size={7} color="var(--fg-mute)">|10%</Glyph>
              <Glyph size={7} color="var(--fg-mute)">|25%</Glyph>
              <Glyph size={7} color="var(--fg-mute)">50%</Glyph>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════
              STATS PULSE — weighted
              ═══════════════════════════════════════════════ */}
          <div style={{
            display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap',
          }}>
            {[
              { label: fr ? 'rêves' : 'dreams', value: data.stats.totalDreams, sub: `${data.stats.totalWeighted}w` },
              { label: fr ? 'rêveurs' : 'dreamers', value: data.stats.uniqueDreamers },
              { label: fr ? 'numineux' : 'numinous', value: data.stats.numinousCount },
              { label: fr ? 'rêves/j' : 'dreams/d', value: data.stats.avgDreamsPerDay },
            ].map(s => (
              <div key={s.label} style={{
                flex: '1 0 60px', maxWidth: 90, textAlign: 'center',
                padding: '10px 6px', background: 'var(--bg-card)',
                border: '1px solid var(--border)', borderRadius: 2,
              }}>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 20, fontStyle: 'italic', color: accent,
                }}>
                  {s.value}
                </div>
                <Glyph size={7} color="var(--fg-mute)">{s.label}</Glyph>
                {s.sub && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 7, color: 'var(--fg-mute)', marginTop: 2 }}>
                    {s.sub}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════
              SOUL WISHES — ondinnonk polyphony
              ═══════════════════════════════════════════════ */}
          {data.soulWishes.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>✦</span>
                <Glyph size={10} color={accent}>
                  {fr ? 'Ondinnonk — voeux de l\'âme' : 'Ondinnonk — soul wishes'}
                </Glyph>
              </div>
              <div style={{
                fontStyle: 'italic', fontSize: 12, color: 'var(--fg-dim)',
                marginBottom: 12, lineHeight: 1.4,
              }}>
                {fr
                  ? 'Voix anonymes de ce que les âmes demandent. Polyphonie, pas résumé.'
                  : 'Anonymous voices of what souls are asking. Polyphony, not summary.'}
              </div>
              {data.soulWishes.map((sw, i) => (
                <div key={i} style={{
                  padding: '12px 14px', marginBottom: 6,
                  background: sw.numinosity >= 4
                    ? 'color-mix(in srgb, var(--mode-reve-accent) 8%, var(--bg-card))'
                    : 'var(--bg-card)',
                  border: `1px solid ${sw.numinosity >= 4 ? 'color-mix(in srgb, var(--mode-reve-accent) 25%, transparent)' : 'var(--border)'}`,
                  borderLeft: sw.numinosity >= 4 ? `3px solid ${accent}` : '1px solid var(--border)',
                  borderRadius: 2,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15,
                    color: 'var(--fg)', lineHeight: 1.5,
                  }}>
                    « {sw.wish} »
                  </div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', marginTop: 6,
                  }}>
                    <Glyph size={7} color="var(--fg-mute)">{sw.date}</Glyph>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 9, color: accent,
                      letterSpacing: 1,
                    }}>
                      {NUMINOSITY_STARS[sw.numinosity] || '·'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Rule />

          {/* ═══════════════════════════════════════════════
              DAILY RHYTHM — with numinous overlay
              ═══════════════════════════════════════════════ */}
          {data.dailyRhythm.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Rythme quotidien' : 'Daily rhythm'}
              </Glyph>
              <div style={{
                display: 'flex', alignItems: 'flex-end', gap: 2,
                height: 60, marginTop: 12,
              }}>
                {(() => {
                  const maxCount = Math.max(...data.dailyRhythm.map(d => d.count), 1);
                  return data.dailyRhythm.map((d) => {
                    const hasNuminous = d.numinous > 0;
                    const numinousRatio = d.count > 0 ? d.numinous / d.count : 0;
                    return (
                      <div
                        key={d.date}
                        title={`${d.date}: ${d.count} (${d.numinous} numinous)`}
                        style={{
                          flex: 1, minWidth: 3, position: 'relative',
                          height: `${Math.max((d.count / maxCount) * 100, 5)}%`,
                          background: hasNuminous
                            ? `linear-gradient(0deg, ${accent} ${numinousRatio * 100}%, color-mix(in srgb, ${accent} ${40 + (d.count / maxCount) * 60}%, var(--bg-card)) ${numinousRatio * 100}%)`
                            : `color-mix(in srgb, ${accent} ${40 + (d.count / maxCount) * 60}%, var(--bg-card))`,
                          borderRadius: '1px 1px 0 0',
                        }}
                      />
                    );
                  });
                })()}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <Glyph size={7} color="var(--fg-mute)">
                  {data.dailyRhythm[0].date.substring(5)}
                </Glyph>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <span style={{ width: 6, height: 6, background: accent, borderRadius: 1, display: 'inline-block' }} />
                    <Glyph size={7} color="var(--fg-mute)">{fr ? 'numineux' : 'numinous'}</Glyph>
                  </span>
                </div>
                <Glyph size={7} color="var(--fg-mute)">
                  {data.dailyRhythm[data.dailyRhythm.length - 1].date.substring(5)}
                </Glyph>
              </div>
            </div>
          )}

          <Rule />

          {/* ═══════════════════════════════════════════════
              ARCHETYPAL PROCESSES — collective movements
              ═══════════════════════════════════════════════ */}
          {data.globalProcesses.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Mouvements archétypaux' : 'Archetypal movements'}
              </Glyph>
              <div style={{
                fontStyle: 'italic', fontSize: 12, color: 'var(--fg-dim)',
                marginTop: 4, marginBottom: 12,
              }}>
                {fr
                  ? 'Trajectoires traversées par le collectif. Pondéré par numinosité.'
                  : 'Trajectories the collective is moving through. Weighted by numinosity.'}
              </div>
              {data.globalProcesses.map(p => {
                const maxW = Math.max(...data.globalProcesses.map(pp => pp.weightedCount), 1);
                return (
                  <div key={p.process} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                        color: 'var(--fg)',
                      }}>
                        {PROCESS_ICONS[p.process.toLowerCase()] || '◇'} {p.process}
                      </span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Glyph size={8} color="var(--fg-mute)">{p.weightedCount}w</Glyph>
                        <Glyph size={7} color="var(--fg-mute)">{p.dreamers}◎</Glyph>
                        {p.numinousCount > 0 && (
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#F1C40F' }}>
                            ✦{p.numinousCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      height: 4, background: 'var(--structural-bg)',
                      borderRadius: 2, overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(p.weightedCount / maxW) * 100}%`,
                        background: accent,
                        borderRadius: 2,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              FIGURES — cross-dreamer constellation
              ═══════════════════════════════════════════════ */}
          {data.globalFigures.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Figures qui traversent les rêves' : 'Figures crossing dreamers'}
              </Glyph>
              <div style={{
                fontStyle: 'italic', fontSize: 12, color: 'var(--fg-dim)',
                marginTop: 4, marginBottom: 12,
              }}>
                {fr
                  ? 'Présences partagées. Les cross-dreamer (2+) sont des signaux forts.'
                  : 'Shared presences. Cross-dreamer (2+) are strong signals.'}
              </div>
              {data.globalFigures.slice(0, 15).map((f, i) => (
                <div key={f.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: i < Math.min(data.globalFigures.length, 15) - 1 ? '1px solid var(--border)' : 'none',
                  opacity: f.crossDreamer ? 1 : 0.7,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: FIGURE_TYPE_COLORS[f.type] || FIGURE_TYPE_COLORS.unknown,
                      display: 'inline-block',
                      boxShadow: f.crossDreamer ? `0 0 6px ${FIGURE_TYPE_COLORS[f.type] || 'var(--fg-mute)'}` : 'none',
                    }} />
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                      color: 'var(--fg)',
                    }}>
                      {f.name}
                    </span>
                    {f.numinousCount > 0 && (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, color: '#F1C40F' }}>✦</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Glyph size={8} color="var(--fg-mute)">{f.weightedCount}w</Glyph>
                    {f.crossDreamer && <Tag>{f.dreamers}◎</Tag>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Rule />

          {/* ═══════════════════════════════════════════════
              THEMES — weighted pills
              ═══════════════════════════════════════════════ */}
          {data.globalThemes.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Thèmes émergents' : 'Emerging themes'}
              </Glyph>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {data.globalThemes.map(th => (
                  <div key={th.theme} style={{
                    padding: '5px 10px',
                    background: th.crossDreamer
                      ? 'color-mix(in srgb, var(--mode-reve-accent) 10%, var(--bg-card))'
                      : 'var(--bg-card)',
                    border: `1px solid ${th.crossDreamer ? accent : 'var(--border)'}`,
                    borderRadius: 2,
                    fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12,
                    color: 'var(--fg)',
                  }}>
                    {th.theme}
                    <span style={{ marginLeft: 6, color: 'var(--fg-mute)', fontSize: 10 }}>
                      {th.weightedCount}w · {th.dreamers}◎
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              MOOD LANDSCAPE — weighted
              ═══════════════════════════════════════════════ */}
          {data.moodLandscape.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Paysage émotionnel' : 'Emotional landscape'}
              </Glyph>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {data.moodLandscape.map(m => (
                  <div key={m.mood} style={{
                    padding: '5px 12px',
                    background: 'color-mix(in srgb, var(--mode-reve-accent) 6%, var(--bg-card))',
                    border: '1px solid var(--border)',
                    borderRadius: 2,
                    fontFamily: 'var(--font-serif)', fontSize: 13,
                    color: 'var(--fg)',
                  }}>
                    {m.mood}
                    <span style={{ marginLeft: 8, color: accent, fontSize: 11 }}>{m.weightedCount}w</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Rule />

          {/* ═══════════════════════════════════════════════
              GEOGRAPHIC BREAKDOWN
              ═══════════════════════════════════════════════ */}
          {data.geoBreakdown.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Géographie onirique' : 'Dream geography'}
              </Glyph>
              <div style={{ marginTop: 12 }}>
                {data.geoBreakdown.map(g => {
                  const maxD = Math.max(...data.geoBreakdown.map(gg => gg.dreamerCount), 1);
                  return (
                    <div key={g.country} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '6px 0',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                        color: 'var(--fg)', minWidth: 80, textTransform: 'capitalize',
                      }}>
                        {g.country}
                      </span>
                      <div style={{
                        flex: 1, height: 4, background: 'var(--structural-bg)',
                        borderRadius: 2, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${(g.dreamerCount / maxD) * 100}%`,
                          background: accent, borderRadius: 2,
                        }} />
                      </div>
                      <Glyph size={8} color="var(--fg-mute)">
                        {g.dreamerCount}◎ · {g.dreamCount}
                      </Glyph>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              HISTORICAL MASTER EVENTS — confirmed / active
              ═══════════════════════════════════════════════ */}
          {historicalEvents.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 28 }}>
              <Glyph size={10} color={accent}>
                {fr ? 'Événements archivés' : 'Archived events'}
              </Glyph>
              <div style={{
                fontStyle: 'italic', fontSize: 12, color: 'var(--fg-dim)',
                marginTop: 4, marginBottom: 12,
              }}>
                {fr
                  ? 'Master Events passés — confirmés ou encore actifs.'
                  : 'Past Master Events — confirmed or still active.'}
              </div>
              {historicalEvents.map(evt => {
                const sevConfig = SEVERITY_CONFIG[evt.severity] || SEVERITY_CONFIG.signal;
                let desc = '';
                try {
                  const parsed = JSON.parse(evt.description);
                  desc = locale === 'fr' ? parsed.fr : parsed.en;
                } catch {
                  desc = evt.description;
                }
                return (
                  <div key={evt.id} style={{
                    padding: '10px 12px', marginBottom: 6,
                    background: 'var(--bg-card)',
                    border: `1px solid var(--border)`,
                    borderLeft: `3px solid ${sevConfig.color}`,
                    borderRadius: 2,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14,
                        color: 'var(--fg)',
                      }}>
                        {evt.title}
                      </span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {evt.status === 'confirmed' && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: 1,
                            color: '#2ECC71', textTransform: 'uppercase',
                          }}>
                            {fr ? 'CONFIRMÉ' : 'CONFIRMED'}
                          </span>
                        )}
                        <Glyph size={7} color="var(--fg-mute)">
                          {evt.created_at.substring(0, 10)}
                        </Glyph>
                      </div>
                    </div>
                    {desc && (
                      <div style={{
                        fontFamily: 'var(--font-serif)', fontSize: 12, color: 'var(--fg-dim)',
                        marginTop: 4, lineHeight: 1.4,
                      }}>
                        {desc}
                      </div>
                    )}
                    {evt.confirmation_note && (
                      <div style={{
                        marginTop: 6, padding: '6px 10px',
                        background: 'color-mix(in srgb, #2ECC71 8%, transparent)',
                        border: '1px solid color-mix(in srgb, #2ECC71 20%, transparent)',
                        borderRadius: 2,
                        fontStyle: 'italic', fontSize: 12, color: 'var(--fg-dim)',
                      }}>
                        {evt.confirmation_note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Footer — oracle invitation ── */}
          <Rule />
          <div style={{
            textAlign: 'center', padding: '20px 0',
            fontStyle: 'italic', fontSize: 13, color: 'var(--fg-dim)',
            lineHeight: 1.6,
          }}>
            {fr
              ? 'Chaque rêve déposé nourrit l\'oracle. Le collectif rêve le monde avant qu\'il n\'advienne.'
              : 'Every dream deposited feeds the oracle. The collective dreams the world before it happens.'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MASTER EVENT CARD — sub-component
// ============================================================

function MasterEventCard({
  event, locale, compact,
}: {
  event: MasterEvent; locale: string; compact?: boolean;
}) {
  const fr = locale === 'fr';
  const sev = SEVERITY_CONFIG[event.severity] || SEVERITY_CONFIG.signal;
  const typeLabel = EVENT_TYPE_LABELS[event.type] || { fr: event.type, en: event.type };

  return (
    <div style={{
      padding: compact ? '10px 12px' : '14px 16px',
      marginBottom: 8,
      background: event.severity === 'master_event'
        ? 'color-mix(in srgb, #E74C3C 10%, var(--bg-card))'
        : event.severity === 'convergence'
        ? 'color-mix(in srgb, #E67E22 8%, var(--bg-card))'
        : 'var(--bg-card)',
      border: `1px solid color-mix(in srgb, ${sev.color} 30%, transparent)`,
      borderLeft: `3px solid ${sev.color}`,
      borderRadius: 2,
    }}>
      {/* Severity + type badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: compact ? 4 : 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: 1.5,
            textTransform: 'uppercase', color: sev.color,
            border: `1px solid ${sev.color}`,
            borderRadius: 'var(--r-full)', padding: '2px 8px',
          }}>
            {sev.glyph} {fr ? sev.labelFr : sev.labelEn}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: 1,
            textTransform: 'uppercase', color: 'var(--fg-mute)',
          }}>
            {fr ? typeLabel.fr : typeLabel.en}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 9, color: sev.color,
        }}>
          ⚡{event.signalStrength}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-serif)', fontStyle: 'italic',
        fontSize: compact ? 15 : 17,
        color: 'var(--fg)', lineHeight: 1.3,
      }}>
        {event.title}
      </div>

      {/* Description */}
      {!compact && (
        <div style={{
          fontFamily: 'var(--font-serif)', fontSize: 13, color: 'var(--fg-dim)',
          marginTop: 6, lineHeight: 1.5,
        }}>
          {fr ? event.description.fr : event.description.en}
        </div>
      )}

      {/* Stats row */}
      <div style={{
        display: 'flex', gap: 12, marginTop: compact ? 4 : 8,
        fontFamily: 'var(--font-mono)', fontSize: 8,
        color: 'var(--fg-mute)', letterSpacing: 0.5,
      }}>
        <span>{event.dreamerCount} {fr ? 'rêveurs' : 'dreamers'}</span>
        <span>{event.dreamCount} {fr ? 'rêves' : 'dreams'}</span>
        {event.numinousRatio > 0 && (
          <span style={{ color: '#F1C40F' }}>✦ {Math.round(event.numinousRatio * 100)}%</span>
        )}
        <span>{event.windowDays}j</span>
      </div>
    </div>
  );
}
