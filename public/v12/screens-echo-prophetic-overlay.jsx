/* global React */
// ──────────────────────────────────────────────────────────────
// EchoPropheticOverlay (Yeshua 2026-04-29)
// Plein écran fade-in 600ms · 2 cards (présent | passé) reliées
// par une ligne onduleuse silk-gold. Bouton "[ cet écho ne touche pas ]".
//
// Trigger : window.dreamShowEchoOverlay({ presentText, pastText, daysAgo, onDismiss })
// ──────────────────────────────────────────────────────────────

const { useState: epoS, useEffect: epoE } = React;

function _formatDuration(daysAgo) {
  if (!daysAgo || daysAgo < 0) return "il y a quelque temps";
  if (daysAgo < 1) return "il y a moins d'un jour";
  if (daysAgo < 30) return daysAgo === 1 ? "il y a 1 jour" : `il y a ${daysAgo} jours`;
  const months = Math.floor(daysAgo / 30);
  if (months < 12) return months === 1 ? "il y a 1 mois" : `il y a ${months} mois`;
  const years = Math.floor(months / 12);
  return years === 1 ? "il y a 1 an" : `il y a ${years} ans`;
}

const EchoPropheticOverlay = ({ show, presentText = "", pastText = "", daysAgo = 0, onDone, onDismiss }) => {
  epoE(() => {
    if (!show) return;
    // Auto-dismiss after 9s if user doesn't interact (longer than constellation, more contemplatif)
    const t = setTimeout(() => onDone?.(), 9000);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;
  const duration = _formatDuration(daysAgo);
  const handleNotTouch = () => {
    try { onDismiss && onDismiss(); } catch {}
    onDone && onDone();
  };

  return (
    <div
      role="dialog"
      aria-label="ce kairos en a réveillé un autre"
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "color-mix(in oklch, var(--night-floor) 92%, black)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "echo-prophetic-overlay-fade-in 600ms ease-out",
        overflow: "auto",
      }}
    >
      {/* Texte top italic */}
      <p style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 17, lineHeight: 1.5,
        color: "var(--bone)", opacity: 0.9,
        textAlign: "center", maxWidth: 540,
        margin: "0 0 28px 0", textWrap: "pretty",
        letterSpacing: "0.005em",
      }}>
        Ce kairos en a réveillé un autre, déposé {duration}.
      </p>

      {/* 2 cards + ligne onduleuse */}
      <div style={{
        position: "relative",
        width: "100%", maxWidth: 640,
        display: "flex", alignItems: "stretch",
        justifyContent: "space-between", gap: 18,
        flexWrap: "wrap",
      }}>
        {/* Carte présent */}
        <div className="echo-card" style={{
          flex: "1 1 240px", minWidth: 0,
          padding: "18px 20px",
          background: "color-mix(in oklch, var(--night-warm) 70%, transparent)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
          borderRadius: 0,
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--silk-gold)", opacity: 0.7,
            marginBottom: 10,
          }}>présent</div>
          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 14.5, lineHeight: 1.6,
            color: "var(--bone)", margin: 0, textWrap: "pretty",
          }}>
            {presentText.slice(0, 220)}{presentText.length > 220 ? "…" : ""}
          </p>
        </div>

        {/* Ligne onduleuse au centre (visible quand pas wrap) */}
        <div aria-hidden="true" style={{
          flex: "0 0 auto", display: "flex",
          alignItems: "center", justifyContent: "center",
          minWidth: 36,
        }}>
          <svg width="60" height="40" viewBox="0 0 60 40" style={{ display: "block" }}>
            <path d="M 4 20 Q 15 8, 30 20 T 56 20"
              fill="none" stroke="var(--silk-gold)" strokeWidth="0.9" strokeOpacity="0.65"
              strokeLinecap="round"
              style={{ animation: "echo-line-flow 4.2s ease-in-out infinite" }}
            />
          </svg>
        </div>

        {/* Carte passé */}
        <div className="echo-card" style={{
          flex: "1 1 240px", minWidth: 0,
          padding: "18px 20px",
          background: "color-mix(in oklch, var(--night-warm) 50%, transparent)",
          border: "1px dashed color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
          borderRadius: 0,
        }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "var(--silk-gold)", opacity: 0.6,
            marginBottom: 10,
          }}>passé · {duration}</div>
          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 14.5, lineHeight: 1.6,
            color: "color-mix(in oklch, var(--bone) 80%, var(--ash-light))",
            margin: 0, textWrap: "pretty",
          }}>
            {pastText.slice(0, 220)}{pastText.length > 220 ? "…" : ""}
          </p>
        </div>
      </div>

      {/* Bouton "ne touche pas" + bouton fermer doux */}
      <div style={{
        marginTop: 36, display: "flex", flexDirection: "column",
        alignItems: "center", gap: 12,
      }}>
        <button onClick={handleNotTouch}
          style={{
            background: "transparent",
            border: "1px solid color-mix(in oklch, var(--ash-light) 60%, transparent)",
            color: "var(--ash-light)",
            fontFamily: "var(--mono)", fontSize: 10.5,
            letterSpacing: "0.18em", textTransform: "uppercase",
            padding: "10px 22px", cursor: "pointer",
            transition: "all 280ms ease", borderRadius: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--bone)"; e.currentTarget.style.borderColor = "var(--bone)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--ash-light)"; e.currentTarget.style.borderColor = "color-mix(in oklch, var(--ash-light) 60%, transparent)"; }}
        >
          [ cet écho ne touche pas ]
        </button>
        <button onClick={() => onDone?.()}
          style={{
            background: "transparent", border: "none",
            color: "var(--ash-light)", opacity: 0.55,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5,
            cursor: "pointer", padding: "4px 10px",
            letterSpacing: "0.02em",
          }}>
          fermer
        </button>
      </div>

      <style>{`
        @keyframes echo-prophetic-overlay-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes echo-line-flow {
          0%, 100% { stroke-opacity: 0.45; transform: translateX(0); }
          50%      { stroke-opacity: 0.95; transform: translateX(2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="ce kairos en a réveillé un autre"] * {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Singleton mount + trigger global
let _echoOverlayState = { show: false, presentText: "", pastText: "", daysAgo: 0, onDismiss: null, onDone: null };
const _echoOverlayListeners = new Set();
function _notifyEcho() { _echoOverlayListeners.forEach(fn => { try { fn({ ..._echoOverlayState }); } catch {} }); }

window.dreamShowEchoOverlay = function ({ presentText = "", pastText = "", daysAgo = 0, onDismiss = null } = {}) {
  _echoOverlayState = {
    show: true,
    presentText, pastText, daysAgo,
    onDismiss,
    onDone: () => {
      _echoOverlayState.show = false;
      _notifyEcho();
    },
  };
  _notifyEcho();
};

const EchoPropheticOverlayRoot = () => {
  const [state, setState] = epoS(_echoOverlayState);
  epoE(() => {
    const fn = (s) => setState(s);
    _echoOverlayListeners.add(fn);
    return () => _echoOverlayListeners.delete(fn);
  }, []);
  return (
    <EchoPropheticOverlay
      show={state.show}
      presentText={state.presentText}
      pastText={state.pastText}
      daysAgo={state.daysAgo}
      onDismiss={state.onDismiss}
      onDone={state.onDone}
    />
  );
};

window.EchoPropheticOverlay = EchoPropheticOverlay;
window.EchoPropheticOverlayRoot = EchoPropheticOverlayRoot;
