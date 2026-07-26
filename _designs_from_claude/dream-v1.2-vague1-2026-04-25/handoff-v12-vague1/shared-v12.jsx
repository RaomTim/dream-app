/* global React, d3 */
// ──────────────────────────────────────────────────────────────
// Dream — V1.2 amplification shared layer
// 4 composants de base · Wow registry · Sound stub
// ──────────────────────────────────────────────────────────────
//
// Composants exportés à window :
//   <Surface matter="…" motion={true|"flicker"|…}>      — bed + noise overlay (réutilisable partout)
//   <HaloRespire kind="silk"|"ember"|"bigdream">        — halos respirants V1.2
//   <GeoSymbol kind="spirale"|"concentric"|"triangle"|"demi-cercle"|"songlines"|"croissant">
//   <ConstellationD3 nodes edges focal onNodeClick>      — D3-force vivant
//   <SpiraleWowOverlay show />                          — Wow 1 : premier kairos déposé
//
// API utilitaires :
//   wowRegistry.fire(name)         — déclenche un Wow (idempotent une fois marqué fired)
//   wowRegistry.demo(name)         — démontre un Wow sans le marquer (pour Tweaks panel)
//   wowRegistry.has(name)          — true si déjà fired
//   wowRegistry.reset(name?)       — reset un ou tous (utile en démo)
//   playRitual(kind)               — son rituel synthétisé Web Audio (stub) :
//                                    "souffle" · "braise" · "tisse" · "ceremoniel" · "ancrage"
//                                    Refs freesound.org pour upgrade :
//                                      souffle    → freesound.org/people/InspectorJ/sounds/376737/  (~6s, -23 LUFS, mp3 44.1kHz)
//                                      braise     → freesound.org/people/florianreichelt/sounds/673032/ (~3.5s, -22 LUFS)
//                                      tisse      → freesound.org/people/Adam_N/sounds/541478/  (~400ms, -18 LUFS)
//                                      ceremoniel → freesound.org/people/InspectorJ/sounds/411089/ (~1s, gong feutré, -20 LUFS)
//                                      ancrage    → freesound.org/people/Anthousai/sounds/398810/  (~2s, drone earth, -25 LUFS)
//
// ──────────────────────────────────────────────────────────────

const { useState: uV12S, useEffect: uV12E, useRef: uV12R, useMemo: uV12M, useCallback: uV12C } = React;

// ══════════════════════════════════════════════════════════════
// 1. Surface — bed + noise overlay réutilisable
// ══════════════════════════════════════════════════════════════
const Surface = ({ matter = "linen", motion = true, boost, children, className = "", style = {}, as = "div" }) => {
  const Tag = as;
  const motionBed = motion ? `motion-${matter === "silk" ? "silk-halo" : matter}` : "";
  const motionNoise = motion === "flicker" ? "motion-ember-flicker"
                    : motion === "drift"   ? "motion-silk-drift"
                    : "";
  const boostClass = boost === false ? "" : (matter === "paper" || matter === "silk" || matter === "water" || matter === "ember" || matter === "earth") ? `boost-${matter === "silk" ? "silk" : matter}` : "";
  return (
    <Tag className={`surface ${className}`} style={style}>
      <div className={`bed bed-${matter} ${motionBed}`}></div>
      <div className={`bed-noise ${boostClass} ${motionNoise}`} style={{ filter: `url(#n-${matter})` }}></div>
      {children}
    </Tag>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. HaloRespire — halos respirants V1.2
//    kind = "silk" | "ember" | "bigdream"
// ══════════════════════════════════════════════════════════════
const HaloRespire = ({ kind = "silk", style = {} }) => {
  const cls = kind === "bigdream" ? "halo-bigdream-combine"
            : kind === "ember"    ? "halo-ember-respire"
            :                       "halo-silk-respire";
  return <div className={cls} style={style} aria-hidden="true"></div>;
};

// ══════════════════════════════════════════════════════════════
// 3. GeoSymbol — 6 formes géosymboliques
// ══════════════════════════════════════════════════════════════
const GeoSymbol = ({ kind, color = "silk", style = {}, opacity }) => {
  const colorClass = color === "ember" ? "geo-symbol--ember"
                   : color === "bone"  ? "geo-symbol--bone"
                   : "";
  const wrapStyle = { ...style, ...(opacity != null ? { opacity } : {}) };

  if (kind === "spirale") {
    // spirale logarithmique (Big Dream marquage)
    const path = computeLogSpiral({ cx: 100, cy: 100, a: 2, b: 0.18, turns: 3.5, steps: 200 });
    return (
      <div className={`geo-symbol ${colorClass}`} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200"><path d={path} /></svg>
      </div>
    );
  }

  if (kind === "concentric") {
    // cercles concentriques (Portrait centre, AHA capture)
    return (
      <div className={`geo-symbol ${colorClass} concentric-rings`} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="40" />
          <circle cx="100" cy="100" r="60" />
          <circle cx="100" cy="100" r="80" />
        </svg>
      </div>
    );
  }

  if (kind === "triangle") {
    // triangle équilatéral (rituel — Réentrée, gates)
    return (
      <div className={`geo-symbol ${colorClass} triangle-rituel`} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <polygon points="100,20 180,170 20,170" />
          <polygon points="100,50 153,158 47,158" opacity="0.5" />
        </svg>
      </div>
    );
  }

  if (kind === "demi-cercle") {
    // demi-cercle horizontal aurore (Anima Mundi)
    return (
      <div className={`demi-cercle-aurore`} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d="M 0 180 Q 500 -40, 1000 180" />
          <path d="M 50 180 Q 500 0, 950 180" opacity="0.5" />
        </svg>
      </div>
    );
  }

  if (kind === "songlines") {
    // lignes ondulantes parallèles (backgrounds nuit)
    return (
      <div className={`songlines-bg ${colorClass}`} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <path key={i} d={`M 0 ${100 + i * 80} Q 250 ${60 + i * 80}, 500 ${100 + i * 80} T 1000 ${100 + i * 80}`} />
          ))}
        </svg>
      </div>
    );
  }

  if (kind === "croissant") {
    // croissant lunaire (Polyphonies)
    return (
      <div className={`croissant-lune ${colorClass}`} style={wrapStyle} aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <path d="M 100 20 A 80 80 0 1 0 100 180 A 60 60 0 1 1 100 20 Z" />
        </svg>
      </div>
    );
  }

  return null;
};

// helper — log spiral path
function computeLogSpiral({ cx, cy, a, b, turns, steps }) {
  const tMax = turns * 2 * Math.PI;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax;
    const r = a * Math.exp(b * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    d += (i === 0 ? "M " : "L ") + x.toFixed(2) + " " + y.toFixed(2) + " ";
  }
  return d;
}

// ══════════════════════════════════════════════════════════════
// 4. SpiraleWowOverlay — Wow 1 : premier kairos déposé
//    Affiche 1.8s puis disparaît
// ══════════════════════════════════════════════════════════════
const SpiraleWowOverlay = ({ show, onDone }) => {
  uV12E(() => {
    if (!show) return;
    const t = setTimeout(() => onDone?.(), 1900);
    return () => clearTimeout(t);
  }, [show, onDone]);
  if (!show) return null;
  const path = computeLogSpiral({ cx: 140, cy: 140, a: 2.5, b: 0.20, turns: 3.5, steps: 240 });
  return (
    <div className="spirale-wow" aria-hidden="true">
      <svg viewBox="0 0 280 280"><path d={path} /></svg>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. ConstellationD3 — vivant, force-directed, edges Bézier
// ══════════════════════════════════════════════════════════════
//
// Props :
//   nodes : [{ id, label, weight, kind: "self"|"kairos"|"bigdream"|"member"|"holding"|"figure", x?, y? }]
//   edges : [{ source, target, alive?: boolean }]
//   focalId : id du noeud focus (centré, halo respirant)
//   width / height : optionnel (sinon container measure)
//   throttleMs : 16 default
//   onNodeClick : (node) => void
//   driftParticles : true|false  (petites particules silk-gold qui dérivent)
//   showLabels : true
//
const ConstellationD3 = ({
  nodes: initialNodes,
  edges: initialEdges,
  focalId,
  width: propW,
  height: propH,
  onNodeClick,
  driftParticles = true,
  showLabels = true,
  className = "",
  style = {},
}) => {
  const wrapRef = uV12R(null);
  const svgRef = uV12R(null);
  const [size, setSize] = uV12S({ w: propW || 600, h: propH || 400 });
  const [tick, setTick] = uV12S(0);

  // measure container if no explicit size
  uV12E(() => {
    if (propW && propH) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      setSize({ w: r.width || propW || 600, h: r.height || propH || 400 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [propW, propH]);

  // --- d3-force simulation ---
  const simRef = uV12R(null);
  const nodesRef = uV12R([]);
  const edgesRef = uV12R([]);

  uV12E(() => {
    if (!window.d3 || !window.d3.forceSimulation) return;
    // deep-copy nodes & edges so d3 can mutate
    const nodes = initialNodes.map(n => ({ ...n }));
    const edges = initialEdges.map(e => ({ ...e }));

    // resolve string ids in edges
    const byId = new Map(nodes.map(n => [n.id, n]));
    edges.forEach(e => {
      if (typeof e.source === "string") e.source = byId.get(e.source);
      if (typeof e.target === "string") e.target = byId.get(e.target);
    });

    const sim = window.d3.forceSimulation(nodes)
      .force("link", window.d3.forceLink(edges).id(d => d.id).distance(d => d.alive ? 80 : 95).strength(0.4))
      .force("charge", window.d3.forceManyBody().strength(d => d.kind === "bigdream" ? -260 : -130))
      .force("center", window.d3.forceCenter(size.w / 2, size.h / 2).strength(0.06))
      .force("collide", window.d3.forceCollide().radius(d => (d.kind === "bigdream" ? 32 : 20)).strength(0.85))
      .alpha(0.9)
      .alphaDecay(0.015);

    // focal pinning
    if (focalId) {
      const f = byId.get(focalId);
      if (f) { f.fx = size.w / 2; f.fy = size.h / 2; }
    }

    nodesRef.current = nodes;
    edgesRef.current = edges;
    simRef.current = sim;

    let raf = 0;
    let last = 0;
    sim.on("tick", () => {
      const now = performance.now();
      if (now - last < 16) return; // throttle ~60fps
      last = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTick(t => t + 1));
    });

    return () => { sim.stop(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialNodes.map(n => n.id)), JSON.stringify(initialEdges.map(e => `${typeof e.source === "string" ? e.source : e.source?.id}-${typeof e.target === "string" ? e.target : e.target?.id}`)), size.w, size.h, focalId]);

  // drag
  const dragRef = uV12R(null);
  const onMouseDown = (e, n) => {
    if (!simRef.current) return;
    n.fx = n.x; n.fy = n.y;
    simRef.current.alphaTarget(0.3).restart();
    dragRef.current = { node: n, start: { x: e.clientX, y: e.clientY } };
    const move = ev => {
      const dx = ev.clientX - dragRef.current.start.x;
      const dy = ev.clientY - dragRef.current.start.y;
      n.fx = (n.x || 0) + dx;
      n.fy = (n.y || 0) + dy;
    };
    const up = () => {
      if (n.id !== focalId) { n.fx = null; n.fy = null; }
      simRef.current.alphaTarget(0);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      dragRef.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  // particles dérive (silk-gold poussière)
  const particles = uV12M(() => {
    if (!driftParticles) return [];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0002,
      vy: (Math.random() - 0.5) * 0.0002,
      r: 1 + Math.random() * 1.2,
      delay: Math.random() * 8,
    }));
  }, [driftParticles]);

  const [particleTick, setParticleTick] = uV12S(0);
  uV12E(() => {
    if (!driftParticles) return;
    let raf = 0;
    let last = 0;
    const loop = (t) => {
      if (t - last > 40) { setParticleTick(p => p + 1); last = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [driftParticles]);

  uV12E(() => {
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
    });
  }, [particleTick, particles]);

  // edge path bezier
  const edgePath = (e) => {
    const sx = e.source.x, sy = e.source.y, tx = e.target.x, ty = e.target.y;
    if (sx == null) return "";
    const mx = (sx + tx) / 2, my = (sy + ty) / 2;
    const dx = tx - sx, dy = ty - sy;
    // perpendicular slight curve
    const nx = -dy, ny = dx;
    const len = Math.hypot(nx, ny) || 1;
    const curve = 0.12;
    const cx = mx + (nx / len) * Math.hypot(dx, dy) * curve;
    const cy = my + (ny / len) * Math.hypot(dx, dy) * curve;
    return `M ${sx} ${sy} Q ${cx} ${cy}, ${tx} ${ty}`;
  };

  const nodeRadius = (n) => n.kind === "bigdream" ? 18 : (n.kind === "self" ? 14 : 11);

  return (
    <div ref={wrapRef} className={`constellation-d3 ${className}`} style={style}>
      <svg ref={svgRef} viewBox={`0 0 ${size.w} ${size.h}`}>
        {/* edges */}
        <g className="edges">
          {edgesRef.current.map((e, i) => (
            <path key={i} className={`edge ${e.alive ? "alive" : ""}`} d={edgePath(e)} />
          ))}
        </g>
        {/* particles */}
        {driftParticles && (
          <g className="particles">
            {particles.map(p => (
              <circle key={p.id} className="particle"
                cx={p.x * size.w} cy={p.y * size.h} r={p.r}
                style={{ opacity: 0.3 + 0.4 * Math.sin((particleTick + p.delay * 10) * 0.05) }} />
            ))}
          </g>
        )}
        {/* nodes */}
        <g className="nodes">
          {nodesRef.current.map(n => {
            const r = nodeRadius(n);
            const cls = `node ${n.kind || ""} ${n.id === focalId ? "focal" : ""} ${n.holding ? "holding" : ""}`;
            return (
              <g key={n.id} className={cls} transform={`translate(${n.x || 0}, ${n.y || 0})`}
                 onMouseDown={(e) => onMouseDown(e, n)}
                 onClick={() => onNodeClick?.(n)}
                 style={{ cursor: "pointer" }}>
                <circle className="halo" r={r * 1.8} />
                <circle className="core" r={r} />
                {n.label && showLabels && (
                  <text y={r + 14}>{n.label}</text>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 6. wowRegistry — déclencheurs des 5 Wow Moments
//    Persistant en localStorage, accessible via Tweaks panel V2.
// ══════════════════════════════════════════════════════════════
//
// Wow 1 : "premier-kairos"             — premier kairos déposé après onboarding
// Wow 2 : "premier-echo-prophetique"   — premier écho prophétique détecté
// Wow 3 : "big-dream-marquage"         — Big Dream marqué (signal permanent)
// Wow 4 : "naissance-noeud"            — naissance d'un noeud constellation
// Wow 5 : "premiere-restitution-cercle" — première restitution cercle
//
const WOW_KEY = "dream:wow-fired";
const WOW_NAMES = [
  "premier-kairos",
  "premier-echo-prophetique",
  "big-dream-marquage",
  "naissance-noeud",
  "premiere-restitution-cercle",
];
const wowListeners = new Set();

const _readWow = () => {
  try { return JSON.parse(localStorage.getItem(WOW_KEY) || "{}"); }
  catch { return {}; }
};
const _writeWow = (state) => {
  try { localStorage.setItem(WOW_KEY, JSON.stringify(state)); } catch {}
  wowListeners.forEach(fn => { try { fn(state); } catch {} });
};

const wowRegistry = {
  has(name) { return !!_readWow()[name]; },
  fire(name) {
    if (!WOW_NAMES.includes(name)) return false;
    const s = _readWow();
    if (s[name]) return false; // idempotent
    s[name] = Date.now();
    _writeWow(s);
    // déclencher le visuel via custom event
    window.dispatchEvent(new CustomEvent("wow:fire", { detail: { name, real: true } }));
    return true;
  },
  demo(name) {
    // démontre sans persister (Tweaks panel)
    window.dispatchEvent(new CustomEvent("wow:fire", { detail: { name, real: false } }));
  },
  reset(name) {
    const s = _readWow();
    if (name) delete s[name]; else WOW_NAMES.forEach(n => delete s[n]);
    _writeWow(s);
  },
  subscribe(fn) { wowListeners.add(fn); return () => wowListeners.delete(fn); },
  list: WOW_NAMES,
};

// hook : abonner un composant à un Wow
const useWowFire = (name, callback) => {
  uV12E(() => {
    const handler = (e) => { if (e.detail.name === name) callback?.(e.detail); };
    window.addEventListener("wow:fire", handler);
    return () => window.removeEventListener("wow:fire", handler);
  }, [name, callback]);
};

// ══════════════════════════════════════════════════════════════
// 7. playRitual — sons rituels Web Audio synthétisés (stub V1.2)
//    Toggle via Paramètres → Notifications (clé localStorage "dream:ritual-sound").
//    Refs freesound.org documentées en haut de fichier.
// ══════════════════════════════════════════════════════════════
const RITUAL_KEY = "dream:ritual-sound";
const ritualSoundEnabled = () => {
  try {
    const v = localStorage.getItem(RITUAL_KEY);
    return v === null ? true : v === "true"; // ON par défaut
  } catch { return true; }
};
const setRitualSound = (on) => {
  try { localStorage.setItem(RITUAL_KEY, String(!!on)); } catch {}
};

let _audioCtx = null;
const _ctx = () => {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch { return null; }
  }
  return _audioCtx;
};

const playRitual = (kind) => {
  if (!ritualSoundEnabled()) return;
  const ctx = _ctx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const t = ctx.currentTime;

  if (kind === "souffle") {
    // souffle long, ~6s, voile basse fréquence
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 110;
    const g = ctx.createGain(); g.gain.value = 0;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 380;
    o.connect(f); f.connect(g); g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.045, t + 1.5);
    g.gain.linearRampToValueAtTime(0.06, t + 3);
    g.gain.linearRampToValueAtTime(0, t + 6);
    o.start(t); o.stop(t + 6);
  } else if (kind === "braise") {
    // pulsation cardiaque ralentie ~3.5s
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 65;
    const g = ctx.createGain(); g.gain.value = 0;
    o.connect(g); g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.08, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    g.gain.linearRampToValueAtTime(0.06, t + 1.0);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.start(t); o.stop(t + 1.6);
  } else if (kind === "tisse") {
    // fil bref tissé ~380ms, son 'plink' feutré
    const o = ctx.createOscillator(); o.type = "triangle"; o.frequency.value = 880;
    const g = ctx.createGain(); g.gain.value = 0;
    o.connect(g); g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.06, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
    o.frequency.exponentialRampToValueAtTime(660, t + 0.38);
    o.start(t); o.stop(t + 0.4);
  } else if (kind === "ceremoniel") {
    // gong feutré ~1s pour passages rituels
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = 220;
    const o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = 330; // 5th
    const g = ctx.createGain(); g.gain.value = 0;
    o.connect(g); o2.connect(g); g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.07, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    o.start(t); o.stop(t + 1.3);
    o2.start(t); o2.stop(t + 1.3);
  } else if (kind === "ancrage") {
    // drone earth ~2s, basse profonde
    const o = ctx.createOscillator(); o.type = "sawtooth"; o.frequency.value = 55;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 220;
    const g = ctx.createGain(); g.gain.value = 0;
    o.connect(f); f.connect(g); g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.05, t + 0.3);
    g.gain.linearRampToValueAtTime(0, t + 2);
    o.start(t); o.stop(t + 2);
  }
};

// ══════════════════════════════════════════════════════════════
// Exports → window
// ══════════════════════════════════════════════════════════════
Object.assign(window, {
  Surface,
  HaloRespire,
  GeoSymbol,
  SpiraleWowOverlay,
  ConstellationD3,
  wowRegistry,
  useWowFire,
  playRitual,
  ritualSoundEnabled,
  setRitualSound,
  computeLogSpiral,
});
