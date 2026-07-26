/* global React */
// ──────────────────────────────────────────────────────────────
// ConstellationOverlay (Yeshua 2026-04-29)
// Plein écran fade-in 600ms · 4-5 points reliés via d3-force
// Le nouveau point = silk-gold pulsant. Auto-dismiss 3500ms.
//
// Trigger : window.dreamShowConstellationOverlay({ newFigureLabel })
//   newFigureLabel : string optionnel ("la grand-mère", "l'eau", etc.)
//
// Câblage automatique via app.jsx hook DreamReplaceLocalKairos :
// si le real kairos contient figures/archetypal_tags qui n'apparaissent
// pas dans les kairos précédents → nouvelle figure → trigger.
// ──────────────────────────────────────────────────────────────

const { useState: cosS, useEffect: cosE, useRef: cosR } = React;

const ConstellationOverlay = ({ show, newFigureLabel = "une figure", onDone }) => {
  const wrapRef = cosR(null);
  const [tick, setTick] = cosS(0);
  const nodesRef = cosR([]);
  const edgesRef = cosR([]);
  const simRef = cosR(null);

  // Build nodes : 1 nouveau silk-gold + 3-4 anciens gris
  cosE(() => {
    if (!show) return;
    const W = typeof window !== "undefined" ? window.innerWidth : 360;
    const H = typeof window !== "undefined" ? window.innerHeight : 640;
    const cx = W / 2, cy = H / 2;
    const old = [
      { id: "old1", kind: "old", x: cx - 80, y: cy - 50 },
      { id: "old2", kind: "old", x: cx + 90, y: cy - 30 },
      { id: "old3", kind: "old", x: cx - 60, y: cy + 70 },
      { id: "old4", kind: "old", x: cx + 70, y: cy + 60 },
    ];
    const newNode = { id: "new", kind: "new", label: newFigureLabel, x: cx, y: cy };
    const nodes = [...old, newNode];
    // Connect new node to all old, and a few cross-connects between old
    const edges = [
      { source: "new", target: "old1", alive: true },
      { source: "new", target: "old2", alive: true },
      { source: "new", target: "old3", alive: true },
      { source: "new", target: "old4", alive: true },
      { source: "old1", target: "old2" },
      { source: "old3", target: "old4" },
    ];
    nodesRef.current = nodes;
    edgesRef.current = edges;

    if (window.d3 && window.d3.forceSimulation) {
      const byId = new Map(nodes.map(n => [n.id, n]));
      const eds = edges.map(e => ({
        ...e,
        source: byId.get(e.source),
        target: byId.get(e.target),
      }));
      const sim = window.d3.forceSimulation(nodes)
        .force("link", window.d3.forceLink(eds).id(d => d.id).distance(110).strength(0.35))
        .force("charge", window.d3.forceManyBody().strength(d => d.kind === "new" ? -260 : -110))
        .force("center", window.d3.forceCenter(cx, cy).strength(0.05))
        .force("collide", window.d3.forceCollide().radius(28).strength(0.85))
        .alpha(0.9)
        .alphaDecay(0.02);
      // Pin new at center
      newNode.fx = cx; newNode.fy = cy;
      let raf = 0;
      let last = 0;
      sim.on("tick", () => {
        const now = performance.now();
        if (now - last < 32) return;
        last = now;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setTick(t => t + 1));
      });
      simRef.current = sim;
      return () => {
        sim.stop();
        cancelAnimationFrame(raf);
      };
    }
  }, [show, newFigureLabel]);

  // Auto-dismiss after 3500ms
  cosE(() => {
    if (!show) return;
    const t = setTimeout(() => onDone?.(), 3500);
    return () => clearTimeout(t);
  }, [show, onDone]);

  if (!show) return null;
  const nodes = nodesRef.current;
  const edges = edgesRef.current;

  // Resolve edge endpoints to current node positions
  const byId = new Map(nodes.map(n => [n.id, n]));
  const resolveEdge = e => ({
    sx: (byId.get(typeof e.source === "string" ? e.source : e.source.id) || {}).x || 0,
    sy: (byId.get(typeof e.source === "string" ? e.source : e.source.id) || {}).y || 0,
    tx: (byId.get(typeof e.target === "string" ? e.target : e.target.id) || {}).x || 0,
    ty: (byId.get(typeof e.target === "string" ? e.target : e.target.id) || {}).y || 0,
    alive: !!e.alive,
  });

  return (
    <div
      ref={wrapRef}
      onClick={() => onDone?.()}
      role="dialog"
      aria-label="une figure nouvelle est entrée"
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "color-mix(in oklch, var(--night-floor) 92%, black)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        cursor: "pointer",
        animation: "constellation-overlay-fade-in 600ms ease-out",
      }}
    >
      <svg
        viewBox={`0 0 ${typeof window !== "undefined" ? window.innerWidth : 360} ${typeof window !== "undefined" ? window.innerHeight : 640}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        aria-hidden="true"
      >
        {/* Edges */}
        <g>
          {edges.map((e, i) => {
            const r = resolveEdge(e);
            return (
              <line key={i}
                x1={r.sx} y1={r.sy} x2={r.tx} y2={r.ty}
                stroke={r.alive ? "var(--silk-gold)" : "var(--ash-light)"}
                strokeOpacity={r.alive ? 0.55 : 0.2}
                strokeWidth={r.alive ? 0.8 : 0.5}
                style={{
                  animation: r.alive ? "constellation-edge-pulse 2.4s ease-in-out infinite" : "none",
                }}
              />
            );
          })}
        </g>
        {/* Nodes */}
        <g>
          {nodes.map(n => {
            const isNew = n.kind === "new";
            return (
              <g key={n.id} transform={`translate(${n.x || 0}, ${n.y || 0})`}>
                {isNew && (
                  <circle r={26}
                    fill="none"
                    stroke="var(--silk-gold)"
                    strokeOpacity={0.35}
                    strokeWidth={0.8}
                    style={{ animation: "constellation-new-halo 2.2s ease-in-out infinite" }}
                  />
                )}
                <circle r={isNew ? 7 : 4}
                  fill={isNew ? "var(--silk-gold)" : "var(--ash-light)"}
                  fillOpacity={isNew ? 0.95 : 0.55}
                  style={{
                    animation: isNew ? "constellation-new-core 2.2s ease-in-out infinite" : "none",
                    filter: isNew ? "drop-shadow(0 0 8px color-mix(in oklch, var(--silk-gold) 65%, transparent))" : "none",
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Texte italic en bas */}
      <div style={{
        position: "absolute",
        bottom: "12vh", left: 0, right: 0,
        textAlign: "center", padding: "0 24px",
        pointerEvents: "none",
        animation: "constellation-text-fade-in 1100ms ease-out 400ms both",
      }}>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 17, lineHeight: 1.5,
          color: "var(--bone)", opacity: 0.92,
          letterSpacing: "0.01em", textWrap: "pretty",
          margin: 0,
        }}>
          Une figure nouvelle est entrée dans ta constellation.
        </p>
        {newFigureLabel && newFigureLabel !== "une figure" && (
          <p style={{
            marginTop: 8,
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 14, color: "var(--silk-gold)", opacity: 0.8,
          }}>
            {newFigureLabel}
          </p>
        )}
      </div>

      <style>{`
        @keyframes constellation-overlay-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes constellation-text-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes constellation-new-halo {
          0%, 100% { r: 24; opacity: 0.4; }
          50%      { r: 32; opacity: 0.18; }
        }
        @keyframes constellation-new-core {
          0%, 100% { r: 6; opacity: 0.85; }
          50%      { r: 9; opacity: 1; }
        }
        @keyframes constellation-edge-pulse {
          0%, 100% { stroke-opacity: 0.45; }
          50%      { stroke-opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .__constellation_no_motion * { animation: none !important; }
        }
      `}</style>
    </div>
  );
};

// ── Singleton mount + trigger global ──────────────────────────
// On expose un mountNode global qui écoute window.dreamShowConstellationOverlay.
// Mount dans app.jsx (ou auto-mount si manquant) — voir bottom du file.
let _consOverlayState = { show: false, label: "une figure", onDone: null };
const _consOverlayListeners = new Set();
function _notifyCons() { _consOverlayListeners.forEach(fn => { try { fn({ ..._consOverlayState }); } catch {} }); }

window.dreamShowConstellationOverlay = function ({ newFigureLabel } = {}) {
  _consOverlayState = {
    show: true,
    label: newFigureLabel || "une figure",
    onDone: () => {
      _consOverlayState.show = false;
      _notifyCons();
    },
  };
  _notifyCons();
};

// Composant root persistant que app.jsx peut monter une seule fois
const ConstellationOverlayRoot = () => {
  const [state, setState] = cosS(_consOverlayState);
  cosE(() => {
    const fn = (s) => setState(s);
    _consOverlayListeners.add(fn);
    return () => _consOverlayListeners.delete(fn);
  }, []);
  return <ConstellationOverlay show={state.show} newFigureLabel={state.label} onDone={state.onDone} />;
};

window.ConstellationOverlay = ConstellationOverlay;
window.ConstellationOverlayRoot = ConstellationOverlayRoot;
