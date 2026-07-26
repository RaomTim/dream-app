/**
 * screens-personal-dictionary.jsx — Mon dictionnaire (2026-04-29)
 *
 * Spec : 4_LOG.md 2026-04-29 — moat épistémique.
 *
 * Composants exposés :
 *   window.PersonalDictionaryScreen — page liste symboles personnels
 *
 * Routes app.jsx :
 *   case "personal-dictionary" → <window.PersonalDictionaryScreen go={go} />
 *
 * UX :
 *   - Liste verticale ordonnée last_seen_at DESC
 *   - Card par symbole : titre + count + valence avg + dernière date + bouton 3 angles
 *   - 3 angles paper/stone/silk en MatterBubble (window.MatterBubble réutilisé)
 *   - Bouton "voir mes kairos avec ce symbole" → go("journal", { tag: symbol_text })
 *   - Bouton "archiver" → DELETE soft
 *   - Bouton "rafraîchir" → POST /refresh user-scoped
 */

const { useState: pdS, useEffect: pdE, useCallback: pdCB } = React;

// ── helpers ────────────────────────────────────────────────────
function pdValenceLabel(v) {
  if (v === null || v === undefined) return null;
  if (v > 0.4) return 'porteuse';
  if (v > 0.15) return 'plutôt douce';
  if (v < -0.4) return 'sombre';
  if (v < -0.15) return 'plutôt pesante';
  return 'mêlée';
}

function pdValenceColor(v) {
  if (v === null || v === undefined) return 'var(--ash-light)';
  if (v > 0.15) return 'var(--silk-gold)';
  if (v < -0.15) return 'color-mix(in oklch, var(--ash-light) 80%, var(--ash-deep))';
  return 'var(--ash-light)';
}

function pdFormatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

function pdKindLabel(k) {
  return ({
    motif: 'motif',
    figure: 'figure',
    lieu: 'lieu',
    sensation: 'sensation',
    synchronicite: 'synchronicité',
  })[k] || k;
}

// ── Card symbole ───────────────────────────────────────────────
const SymbolCard = ({ symbol, expanded, onToggleExpand, onSeeKairos, onArchive, onGenerateAngles, anglesLoading, anglesError }) => {
  const M = window.MatterBubble;
  const valenceLabel = pdValenceLabel(symbol.valence_avg);
  const hasAngles = symbol.paper_angle && symbol.stone_angle && symbol.silk_angle;

  return (
    <div style={{
      padding: '18px 20px',
      background: 'color-mix(in oklch, var(--night-warm) 60%, transparent)',
      border: '1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))',
      borderRadius: 2,
      marginBottom: 14,
      animation: 'dream-skeleton-fade-in 320ms cubic-bezier(0.45,0,0.55,1) both',
    }}>
      {/* Header — titre + meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--serif)',
            fontStyle: 'italic',
            fontSize: 22,
            color: 'var(--bone)',
            lineHeight: 1.2,
            marginBottom: 6,
            wordBreak: 'break-word',
          }}>
            {symbol.symbol_text}
          </div>
          <div style={{
            display: 'flex', gap: 14, flexWrap: 'wrap',
            fontFamily: 'var(--mono)', fontSize: 10.5,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ash-light)', opacity: 0.78,
          }}>
            <span>{pdKindLabel(symbol.symbol_kind)}</span>
            <span>{symbol.count_total}× </span>
            {valenceLabel && (
              <span style={{ color: pdValenceColor(symbol.valence_avg) }}>
                {valenceLabel}
              </span>
            )}
            <span>dernière · {pdFormatDate(symbol.last_seen_at)}</span>
          </div>
        </div>
      </div>

      {/* Evolution + figures associées */}
      {(symbol.evolution_summary || (symbol.associated_figures && symbol.associated_figures.length > 0)) && (
        <div style={{
          marginTop: 12,
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          fontSize: 13.5,
          color: 'color-mix(in oklch, var(--bone) 75%, transparent)',
          lineHeight: 1.55,
        }}>
          {symbol.evolution_summary && <div>{symbol.evolution_summary}</div>}
          {symbol.associated_figures && symbol.associated_figures.length > 0 && (
            <div style={{ marginTop: 6, opacity: 0.8 }}>
              accompagne · {symbol.associated_figures.slice(0, 5).join(' · ')}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
        <button
          onClick={onToggleExpand}
          style={{
            padding: '7px 14px',
            background: hasAngles
              ? 'color-mix(in oklch, var(--silk-gold) 14%, transparent)'
              : 'transparent',
            border: '1px solid color-mix(in oklch, var(--silk-gold) 36%, transparent)',
            color: 'var(--bone)',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          {expanded ? '— masquer les 3 angles' : (hasAngles ? '✦ afficher 3 angles' : '✦ générer 3 angles')}
        </button>
        <button
          onClick={onSeeKairos}
          style={{
            padding: '7px 14px',
            background: 'transparent',
            border: '1px solid color-mix(in oklch, var(--ash-light) 30%, transparent)',
            color: 'var(--ash-light)',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          ☉ voir mes kairos
        </button>
        <button
          onClick={onArchive}
          aria-label="archiver ce symbole"
          style={{
            padding: '7px 12px',
            background: 'transparent',
            border: '1px solid color-mix(in oklch, var(--ash-light) 18%, transparent)',
            color: 'color-mix(in oklch, var(--ash-light) 60%, transparent)',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 2,
            marginLeft: 'auto',
          }}
        >
          ·archiver·
        </button>
      </div>

      {/* 3 angles dépliés */}
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
          {anglesLoading && (
            <div style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              color: 'var(--ash-light)', opacity: 0.7, padding: '12px 0',
            }}>
              Anima tisse les trois angles…
            </div>
          )}
          {anglesError && (
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ember)',
              padding: '8px 12px', border: '1px solid var(--ember)',
            }}>
              {anglesError}
            </div>
          )}
          {!anglesLoading && hasAngles && M && (
            <>
              <M role="assistant" matter="paper" voiceAttribution="paper · lecture intime" fadeIn={true}>
                {symbol.paper_angle}
              </M>
              <M role="assistant" matter="stone" voiceAttribution="stone · lecture structurelle" fadeIn={true}>
                {symbol.stone_angle}
              </M>
              <M role="assistant" matter="silk" voiceAttribution="silk · invitation" fadeIn={true}>
                {symbol.silk_angle}
              </M>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── Screen principal ───────────────────────────────────────────
const PersonalDictionaryScreen = ({ go }) => {
  const [symbols, setSymbols] = pdS([]);
  const [loading, setLoading] = pdS(true);
  const [error, setError] = pdS(null);
  const [refreshing, setRefreshing] = pdS(false);
  const [filterKind, setFilterKind] = pdS('all');
  const [expandedId, setExpandedId] = pdS(null);
  const [anglesState, setAnglesState] = pdS({}); // { [symbolId]: { loading?, error? } }

  // Fetch symbols
  const fetchSymbols = pdCB(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      const res = await fetch('/api/personal-dictionary?limit=100', {
        headers: token ? { Authorization: 'Bearer ' + token } : {},
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      setSymbols(json.symbols || []);
    } catch (e) {
      setError('Le dictionnaire est temporairement indisponible.');
      console.warn('[PersonalDictionaryScreen] fetch failed:', e?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  pdE(() => { fetchSymbols(); }, [fetchSymbols]);

  // Refresh = re-aggregate
  const handleRefresh = pdCB(async () => {
    setRefreshing(true);
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      await fetch('/api/personal-dictionary/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({}),
      });
      await fetchSymbols();
    } catch (e) {
      console.warn('[PersonalDictionaryScreen] refresh failed:', e?.message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchSymbols]);

  // Toggle expand → fetch angles si pas déjà
  const handleToggleExpand = pdCB(async (sym) => {
    if (expandedId === sym.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(sym.id);
    const hasAngles = sym.paper_angle && sym.stone_angle && sym.silk_angle;
    const cacheValid = sym.paragraph_cache_valid_until && new Date(sym.paragraph_cache_valid_until) > new Date();
    if (hasAngles && cacheValid) return; // déjà OK

    setAnglesState((prev) => ({ ...prev, [sym.id]: { loading: true } }));
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      const res = await fetch('/api/personal-dictionary/' + encodeURIComponent(sym.id) + '/generate-angles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      // Update local symbol entry
      setSymbols((prev) => prev.map((s) => s.id === sym.id ? {
        ...s,
        paper_angle: json.paper,
        stone_angle: json.stone,
        silk_angle: json.silk,
        evolution_summary: json.evolution || s.evolution_summary,
        paragraph_cache_valid_until: json.valid_until || s.paragraph_cache_valid_until,
      } : s));
      setAnglesState((prev) => ({ ...prev, [sym.id]: {} }));
    } catch (e) {
      setAnglesState((prev) => ({ ...prev, [sym.id]: { error: 'Anima n\'a pas pu tisser les angles maintenant. Réessaie plus tard.' } }));
      console.warn('[PersonalDictionaryScreen] generate-angles failed:', e?.message);
    }
  }, [expandedId]);

  const handleSeeKairos = pdCB((sym) => {
    if (typeof go === 'function') {
      go('journal', { filter_tag: sym.symbol_text, filter_kind: sym.symbol_kind });
    }
  }, [go]);

  const handleArchive = pdCB(async (sym) => {
    if (typeof window !== 'undefined' && !window.confirm(`Archiver « ${sym.symbol_text} » ? Tes kairos sont préservés. Le symbole peut revenir tout seul s'il continue d'apparaître.`)) {
      return;
    }
    try {
      const token = await window.DreamAuth?.getAccessToken?.();
      await fetch('/api/personal-dictionary/' + encodeURIComponent(sym.id), {
        method: 'DELETE',
        headers: token ? { Authorization: 'Bearer ' + token } : {},
      });
      setSymbols((prev) => prev.filter((s) => s.id !== sym.id));
    } catch (e) {
      console.warn('[PersonalDictionaryScreen] archive failed:', e?.message);
    }
  }, []);

  // Filter
  const filtered = filterKind === 'all' ? symbols : symbols.filter((s) => s.symbol_kind === filterKind);
  const allKinds = ['all', 'motif', 'figure', 'lieu', 'sensation', 'synchronicite'];
  const counts = symbols.reduce((acc, s) => {
    acc[s.symbol_kind] = (acc[s.symbol_kind] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{
      maxWidth: 720,
      margin: '0 auto',
      padding: '32px 20px 80px',
      minHeight: '100vh',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button
          onClick={() => go && go('explorer')}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--ash-light)', fontFamily: 'var(--mono)',
            fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: 'pointer', padding: 0, marginBottom: 18, opacity: 0.78,
          }}
        >
          ← retour
        </button>
        <h1 style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 32, color: 'var(--bone)', margin: 0, lineHeight: 1.2,
        }}>
          Mon dictionnaire
        </h1>
        <p style={{
          marginTop: 10, fontFamily: 'var(--serif)', fontStyle: 'italic',
          color: 'color-mix(in oklch, var(--bone) 70%, transparent)',
          fontSize: 15, lineHeight: 1.55,
        }}>
          Les symboles qui reviennent dans tes kairos. Pas un compendium universel — ton lexique propre, qui se tisse à mesure que tu déposes.
        </p>
      </div>

      {/* Filters + refresh */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 22 }}>
        {allKinds.map((k) => {
          const active = filterKind === k;
          const count = k === 'all' ? symbols.length : (counts[k] || 0);
          return (
            <button
              key={k}
              onClick={() => setFilterKind(k)}
              style={{
                padding: '5px 12px',
                background: active
                  ? 'color-mix(in oklch, var(--silk-gold) 16%, transparent)'
                  : 'transparent',
                border: '1px solid color-mix(in oklch, var(--silk-gold) ' + (active ? '40' : '14') + '%, var(--ash-deep))',
                color: active ? 'var(--bone)' : 'var(--ash-light)',
                fontFamily: 'var(--mono)', fontSize: 10.5,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: 'pointer', borderRadius: 2,
              }}
            >
              {k === 'all' ? 'tous' : pdKindLabel(k)} · {count}
            </button>
          );
        })}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{
            padding: '5px 12px', marginLeft: 'auto',
            background: 'transparent',
            border: '1px solid color-mix(in oklch, var(--ash-light) 22%, transparent)',
            color: 'var(--ash-light)',
            fontFamily: 'var(--mono)', fontSize: 10.5,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            cursor: refreshing ? 'wait' : 'pointer', borderRadius: 2,
            opacity: refreshing ? 0.5 : 1,
          }}
        >
          {refreshing ? '· tissage en cours ·' : '↻ rafraîchir'}
        </button>
      </div>

      {/* Body */}
      {loading && (
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          color: 'var(--ash-light)', opacity: 0.7, textAlign: 'center', padding: '40px 20px',
        }}>
          Le dictionnaire se rassemble…
        </div>
      )}

      {error && !loading && (
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          color: 'var(--ember)', textAlign: 'center', padding: '32px 20px',
        }}>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          color: 'color-mix(in oklch, var(--bone) 65%, transparent)',
          textAlign: 'center', padding: '40px 20px', lineHeight: 1.6,
        }}>
          {symbols.length === 0
            ? 'Encore vide. Ton dictionnaire commence après quelques dépôts — un symbole apparaît ici quand il revient au moins 3 fois sur 90 jours.'
            : 'Aucun symbole pour ce filtre.'}
        </div>
      )}

      {!loading && filtered.map((sym) => (
        <SymbolCard
          key={sym.id}
          symbol={sym}
          expanded={expandedId === sym.id}
          onToggleExpand={() => handleToggleExpand(sym)}
          onSeeKairos={() => handleSeeKairos(sym)}
          onArchive={() => handleArchive(sym)}
          anglesLoading={anglesState[sym.id]?.loading}
          anglesError={anglesState[sym.id]?.error}
        />
      ))}
    </div>
  );
};

window.PersonalDictionaryScreen = PersonalDictionaryScreen;
