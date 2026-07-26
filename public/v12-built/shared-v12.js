const { useState: uV12S, useEffect: uV12E, useRef: uV12R, useMemo: uV12M, useCallback: uV12C } = React;
const Surface = ({ matter = "linen", motion = true, boost, children, className = "", style = {}, as = "div" }) => {
  const Tag = as;
  const motionBed = motion ? `motion-${matter === "silk" ? "silk-halo" : matter}` : "";
  const motionNoise = motion === "flicker" ? "motion-ember-flicker" : motion === "drift" ? "motion-silk-drift" : "";
  const boostClass = boost === false ? "" : matter === "paper" || matter === "silk" || matter === "water" || matter === "ember" || matter === "earth" ? `boost-${matter === "silk" ? "silk" : matter}` : "";
  return /* @__PURE__ */ React.createElement(Tag, { className: `surface ${className}`, style }, /* @__PURE__ */ React.createElement("div", { className: `bed bed-${matter} ${motionBed}` }), /* @__PURE__ */ React.createElement("div", { className: `bed-noise ${boostClass} ${motionNoise}`, style: { filter: `url(#noise-${matter})` } }), children);
};
const HaloRespire = ({ kind = "silk", style = {} }) => {
  const cls = kind === "bigdream" ? "halo-bigdream-combine" : kind === "ember" ? "halo-ember-respire" : "halo-silk-respire";
  return /* @__PURE__ */ React.createElement("div", { className: cls, style, "aria-hidden": "true" });
};
const GeoSymbol = ({ kind, color = "silk", style = {}, opacity }) => {
  if (kind === "cercle-concentrique" || kind === "cercles-concentriques") kind = "concentric";
  if (kind === "demi-cercle-aurore") kind = "demi-cercle";
  const colorClass = color === "ember" ? "geo-symbol--ember" : color === "bone" ? "geo-symbol--bone" : "";
  const wrapStyle = { ...style, ...opacity != null ? { opacity } : {} };
  if (kind === "spirale") {
    const path = computeLogSpiral({ cx: 100, cy: 100, a: 2, b: 0.18, turns: 3.5, steps: 200 });
    return /* @__PURE__ */ React.createElement("div", { className: `geo-symbol ${colorClass}`, style: wrapStyle, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 200" }, /* @__PURE__ */ React.createElement("path", { d: path })));
  }
  if (kind === "concentric") {
    return /* @__PURE__ */ React.createElement("div", { className: `geo-symbol ${colorClass} concentric-rings`, style: wrapStyle, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 200" }, /* @__PURE__ */ React.createElement("circle", { cx: "100", cy: "100", r: "40" }), /* @__PURE__ */ React.createElement("circle", { cx: "100", cy: "100", r: "60" }), /* @__PURE__ */ React.createElement("circle", { cx: "100", cy: "100", r: "80" })));
  }
  if (kind === "triangle") {
    return /* @__PURE__ */ React.createElement("div", { className: `geo-symbol ${colorClass} triangle-rituel`, style: wrapStyle, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 200" }, /* @__PURE__ */ React.createElement("polygon", { points: "100,20 180,170 20,170" }), /* @__PURE__ */ React.createElement("polygon", { points: "100,50 153,158 47,158", opacity: "0.5" })));
  }
  if (kind === "demi-cercle") {
    return /* @__PURE__ */ React.createElement("div", { className: `demi-cercle-aurore`, style: wrapStyle, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 1000 200", preserveAspectRatio: "none" }, /* @__PURE__ */ React.createElement("path", { d: "M 0 180 Q 500 -40, 1000 180" }), /* @__PURE__ */ React.createElement("path", { d: "M 50 180 Q 500 0, 950 180", opacity: "0.5" })));
  }
  if (kind === "songlines") {
    return /* @__PURE__ */ React.createElement("div", { className: `songlines-bg ${colorClass}`, style: wrapStyle, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 1000 600", preserveAspectRatio: "none" }, [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ React.createElement("path", { key: i, d: `M 0 ${100 + i * 80} Q 250 ${60 + i * 80}, 500 ${100 + i * 80} T 1000 ${100 + i * 80}` }))));
  }
  if (kind === "croissant") {
    return /* @__PURE__ */ React.createElement("div", { className: `croissant-lune ${colorClass}`, style: wrapStyle, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 200 200" }, /* @__PURE__ */ React.createElement("path", { d: "M 100 20 A 80 80 0 1 0 100 180 A 60 60 0 1 1 100 20 Z" })));
  }
  return null;
};
function computeLogSpiral({ cx, cy, a, b, turns, steps }) {
  const tMax = turns * 2 * Math.PI;
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const t = i / steps * tMax;
    const r = a * Math.exp(b * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    d += (i === 0 ? "M " : "L ") + x.toFixed(2) + " " + y.toFixed(2) + " ";
  }
  return d;
}
const SpiraleWowOverlay = ({ show, onDone }) => {
  uV12E(() => {
    if (!show) return;
    const t = setTimeout(() => onDone == null ? void 0 : onDone(), 1900);
    return () => clearTimeout(t);
  }, [show, onDone]);
  if (!show) return null;
  const path = computeLogSpiral({ cx: 140, cy: 140, a: 2.5, b: 0.2, turns: 3.5, steps: 240 });
  return /* @__PURE__ */ React.createElement("div", { className: "spirale-wow", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 280 280" }, /* @__PURE__ */ React.createElement("path", { d: path })));
};
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
  style = {}
}) => {
  const wrapRef = uV12R(null);
  const svgRef = uV12R(null);
  const [size, setSize] = uV12S({ w: propW || 600, h: propH || 400 });
  const [tick, setTick] = uV12S(0);
  uV12E(() => {
    if (propW && propH) return;
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: r.width || propW || 600, h: r.height || propH || 400 });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [propW, propH]);
  const simRef = uV12R(null);
  const nodesRef = uV12R([]);
  const edgesRef = uV12R([]);
  uV12E(() => {
    if (!window.d3 || !window.d3.forceSimulation) return;
    const nodes = initialNodes.map((n) => ({ ...n }));
    const edges = initialEdges.map((e) => ({ ...e }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    edges.forEach((e) => {
      if (typeof e.source === "string") e.source = byId.get(e.source);
      if (typeof e.target === "string") e.target = byId.get(e.target);
    });
    const sim = window.d3.forceSimulation(nodes).force("link", window.d3.forceLink(edges).id((d) => d.id).distance((d) => d.alive ? 80 : 95).strength(0.4)).force("charge", window.d3.forceManyBody().strength((d) => d.kind === "bigdream" ? -260 : -130)).force("center", window.d3.forceCenter(size.w / 2, size.h / 2).strength(0.06)).force("collide", window.d3.forceCollide().radius((d) => d.kind === "bigdream" ? 32 : 20).strength(0.85)).alpha(0.9).alphaDecay(0.015);
    if (focalId) {
      const f = byId.get(focalId);
      if (f) {
        f.fx = size.w / 2;
        f.fy = size.h / 2;
      }
    }
    nodesRef.current = nodes;
    edgesRef.current = edges;
    simRef.current = sim;
    let raf = 0;
    let last = 0;
    const clampPad = 40;
    const clampNodes = () => {
      for (const n of nodes) {
        if (n.fx == null) n.x = Math.max(clampPad, Math.min(size.w - clampPad, n.x || 0));
        if (n.fy == null) n.y = Math.max(clampPad, Math.min(size.h - clampPad, n.y || 0));
      }
    };
    sim.on("tick", () => {
      clampNodes();
      const now = performance.now();
      if (now - last < 16) return;
      last = now;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setTick((t) => t + 1));
    });
    return () => {
      sim.stop();
      cancelAnimationFrame(raf);
    };
  }, [JSON.stringify(initialNodes.map((n) => n.id)), JSON.stringify(initialEdges.map((e) => {
    var _a, _b;
    return `${typeof e.source === "string" ? e.source : (_a = e.source) == null ? void 0 : _a.id}-${typeof e.target === "string" ? e.target : (_b = e.target) == null ? void 0 : _b.id}`;
  })), size.w, size.h, focalId]);
  const dragRef = uV12R(null);
  const onMouseDown = (e, n) => {
    if (!simRef.current) return;
    n.fx = n.x;
    n.fy = n.y;
    simRef.current.alphaTarget(0.3).restart();
    dragRef.current = { node: n, start: { x: e.clientX, y: e.clientY } };
    const move = (ev) => {
      const dx = ev.clientX - dragRef.current.start.x;
      const dy = ev.clientY - dragRef.current.start.y;
      n.fx = (n.x || 0) + dx;
      n.fy = (n.y || 0) + dy;
    };
    const up = () => {
      if (n.id !== focalId) {
        n.fx = null;
        n.fy = null;
      }
      simRef.current.alphaTarget(0);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      dragRef.current = null;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };
  const particles = uV12M(() => {
    if (!driftParticles) return [];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 2e-4,
      vy: (Math.random() - 0.5) * 2e-4,
      r: 1 + Math.random() * 1.2,
      delay: Math.random() * 8
    }));
  }, [driftParticles]);
  const [particleTick, setParticleTick] = uV12S(0);
  uV12E(() => {
    if (!driftParticles) return;
    let raf = 0;
    let last = 0;
    const loop = (t) => {
      if (t - last > 40) {
        setParticleTick((p) => p + 1);
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [driftParticles]);
  uV12E(() => {
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > 1) p.vx *= -1;
      if (p.y < 0 || p.y > 1) p.vy *= -1;
    });
  }, [particleTick, particles]);
  const edgePath = (e) => {
    const sx = e.source.x, sy = e.source.y, tx = e.target.x, ty = e.target.y;
    if (sx == null) return "";
    const mx = (sx + tx) / 2, my = (sy + ty) / 2;
    const dx = tx - sx, dy = ty - sy;
    const nx = -dy, ny = dx;
    const len = Math.hypot(nx, ny) || 1;
    const curve = 0.12;
    const cx = mx + nx / len * Math.hypot(dx, dy) * curve;
    const cy = my + ny / len * Math.hypot(dx, dy) * curve;
    return `M ${sx} ${sy} Q ${cx} ${cy}, ${tx} ${ty}`;
  };
  const nodeRadius = (n) => n.kind === "bigdream" ? 18 : n.kind === "self" ? 14 : 11;
  return /* @__PURE__ */ React.createElement("div", { ref: wrapRef, className: `constellation-d3 ${className}`, style }, /* @__PURE__ */ React.createElement("svg", { ref: svgRef, viewBox: `0 0 ${size.w} ${size.h}` }, /* @__PURE__ */ React.createElement("g", { className: "edges" }, edgesRef.current.map((e, i) => /* @__PURE__ */ React.createElement("path", { key: i, className: `edge ${e.alive ? "alive" : ""}`, d: edgePath(e) }))), driftParticles && /* @__PURE__ */ React.createElement("g", { className: "particles" }, particles.map((p) => /* @__PURE__ */ React.createElement(
    "circle",
    {
      key: p.id,
      className: "particle",
      cx: p.x * size.w,
      cy: p.y * size.h,
      r: p.r,
      style: { opacity: 0.3 + 0.4 * Math.sin((particleTick + p.delay * 10) * 0.05) }
    }
  ))), /* @__PURE__ */ React.createElement("g", { className: "nodes" }, nodesRef.current.map((n) => {
    const r = nodeRadius(n);
    const cls = `node ${n.kind || ""} ${n.id === focalId ? "focal" : ""} ${n.holding ? "holding" : ""}`;
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        key: n.id,
        className: cls,
        transform: `translate(${n.x || 0}, ${n.y || 0})`,
        onMouseDown: (e) => onMouseDown(e, n),
        onClick: () => onNodeClick == null ? void 0 : onNodeClick(n),
        style: { cursor: "pointer" }
      },
      /* @__PURE__ */ React.createElement("circle", { className: "halo", r: r * 1.8 }),
      /* @__PURE__ */ React.createElement("circle", { className: "core", r }),
      n.label && showLabels && /* @__PURE__ */ React.createElement("text", { y: r + 14 }, n.label)
    );
  }))));
};
const WOW_KEY = "dream:wow-fired";
const WOW_NAMES = [
  "first-launch",
  "premier-kairos",
  "premier-echo-prophetique",
  "big-dream-marquage",
  "naissance-noeud",
  "premiere-restitution-cercle"
];
const wowListeners = /* @__PURE__ */ new Set();
const _readWow = () => {
  try {
    return JSON.parse(localStorage.getItem(WOW_KEY) || "{}");
  } catch (e) {
    return {};
  }
};
const _writeWow = (state) => {
  try {
    localStorage.setItem(WOW_KEY, JSON.stringify(state));
  } catch (e) {
  }
  wowListeners.forEach((fn) => {
    try {
      fn(state);
    } catch (e) {
    }
  });
};
const wowRegistry = {
  has(name) {
    return !!_readWow()[name];
  },
  fire(name) {
    if (!WOW_NAMES.includes(name)) return false;
    const s = _readWow();
    if (s[name]) return false;
    s[name] = Date.now();
    _writeWow(s);
    window.dispatchEvent(new CustomEvent("wow:fire", { detail: { name, real: true } }));
    return true;
  },
  demo(name) {
    window.dispatchEvent(new CustomEvent("wow:fire", { detail: { name, real: false } }));
  },
  reset(name) {
    const s = _readWow();
    if (name) delete s[name];
    else WOW_NAMES.forEach((n) => delete s[n]);
    _writeWow(s);
  },
  subscribe(fn) {
    wowListeners.add(fn);
    return () => wowListeners.delete(fn);
  },
  list: WOW_NAMES
};
const useWowFire = (name, callback) => {
  uV12E(() => {
    const handler = (e) => {
      if (e.detail.name === name) callback == null ? void 0 : callback(e.detail);
    };
    window.addEventListener("wow:fire", handler);
    return () => window.removeEventListener("wow:fire", handler);
  }, [name, callback]);
};
const RITUAL_KEY = "dream:ritual-sound";
const ritualSoundEnabled = () => {
  try {
    const v = localStorage.getItem(RITUAL_KEY);
    return v === null ? true : v === "true";
  } catch (e) {
    return true;
  }
};
const setRitualSound = (on) => {
  try {
    localStorage.setItem(RITUAL_KEY, String(!!on));
  } catch (e) {
  }
};
let _audioCtx = null;
const _ctx = () => {
  if (!_audioCtx) {
    try {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return null;
    }
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
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 110;
    const g = ctx.createGain();
    g.gain.value = 0;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 380;
    o.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.045, t + 1.5);
    g.gain.linearRampToValueAtTime(0.06, t + 3);
    g.gain.linearRampToValueAtTime(0, t + 6);
    o.start(t);
    o.stop(t + 6);
  } else if (kind === "braise") {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 65;
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.08, t + 0.05);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.4);
    g.gain.linearRampToValueAtTime(0.06, t + 1);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 1.4);
    o.start(t);
    o.stop(t + 1.6);
  } else if (kind === "tisse") {
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = 880;
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.06, t + 0.02);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 0.38);
    o.frequency.exponentialRampToValueAtTime(660, t + 0.38);
    o.start(t);
    o.stop(t + 0.4);
  } else if (kind === "ceremoniel") {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 220;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = 330;
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(g);
    o2.connect(g);
    g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.07, t + 0.05);
    g.gain.exponentialRampToValueAtTime(1e-4, t + 1.2);
    o.start(t);
    o.stop(t + 1.3);
    o2.start(t);
    o2.stop(t + 1.3);
  } else if (kind === "ancrage") {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = 55;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 220;
    const g = ctx.createGain();
    g.gain.value = 0;
    o.connect(f);
    f.connect(g);
    g.connect(ctx.destination);
    g.gain.linearRampToValueAtTime(0.05, t + 0.3);
    g.gain.linearRampToValueAtTime(0, t + 2);
    o.start(t);
    o.stop(t + 2);
  }
};
function isPostJ30(flagDateKey = "dream:account-created", days = 30) {
  try {
    const raw = localStorage.getItem(flagDateKey);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (!ts || isNaN(ts)) return false;
    return Date.now() - ts > days * 86400 * 1e3;
  } catch (e) {
    return false;
  }
}
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
  isPostJ30
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2hhcmVkLXYxMi5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCwgZDMgKi9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRHJlYW0gXHUyMDE0IFYxLjIgYW1wbGlmaWNhdGlvbiBzaGFyZWQgbGF5ZXJcbi8vIDQgY29tcG9zYW50cyBkZSBiYXNlIFx1MDBCNyBXb3cgcmVnaXN0cnkgXHUwMEI3IFNvdW5kIHN0dWJcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy9cbi8vIENvbXBvc2FudHMgZXhwb3J0XHUwMEU5cyBcdTAwRTAgd2luZG93IDpcbi8vICAgPFN1cmZhY2UgbWF0dGVyPVwiXHUyMDI2XCIgbW90aW9uPXt0cnVlfFwiZmxpY2tlclwifFx1MjAyNn0+ICAgICAgXHUyMDE0IGJlZCArIG5vaXNlIG92ZXJsYXkgKHJcdTAwRTl1dGlsaXNhYmxlIHBhcnRvdXQpXG4vLyAgIDxIYWxvUmVzcGlyZSBraW5kPVwic2lsa1wifFwiZW1iZXJcInxcImJpZ2RyZWFtXCI+ICAgICAgICBcdTIwMTQgaGFsb3MgcmVzcGlyYW50cyBWMS4yXG4vLyAgIDxHZW9TeW1ib2wga2luZD1cInNwaXJhbGVcInxcImNvbmNlbnRyaWNcInxcInRyaWFuZ2xlXCJ8XCJkZW1pLWNlcmNsZVwifFwic29uZ2xpbmVzXCJ8XCJjcm9pc3NhbnRcIj5cbi8vICAgPENvbnN0ZWxsYXRpb25EMyBub2RlcyBlZGdlcyBmb2NhbCBvbk5vZGVDbGljaz4gICAgICBcdTIwMTQgRDMtZm9yY2Ugdml2YW50XG4vLyAgIDxTcGlyYWxlV293T3ZlcmxheSBzaG93IC8+ICAgICAgICAgICAgICAgICAgICAgICAgICBcdTIwMTQgV293IDEgOiBwcmVtaWVyIGthaXJvcyBkXHUwMEU5cG9zXHUwMEU5XG4vL1xuLy8gQVBJIHV0aWxpdGFpcmVzIDpcbi8vICAgd293UmVnaXN0cnkuZmlyZShuYW1lKSAgICAgICAgIFx1MjAxNCBkXHUwMEU5Y2xlbmNoZSB1biBXb3cgKGlkZW1wb3RlbnQgdW5lIGZvaXMgbWFycXVcdTAwRTkgZmlyZWQpXG4vLyAgIHdvd1JlZ2lzdHJ5LmRlbW8obmFtZSkgICAgICAgICBcdTIwMTQgZFx1MDBFOW1vbnRyZSB1biBXb3cgc2FucyBsZSBtYXJxdWVyIChwb3VyIFR3ZWFrcyBwYW5lbClcbi8vICAgd293UmVnaXN0cnkuaGFzKG5hbWUpICAgICAgICAgIFx1MjAxNCB0cnVlIHNpIGRcdTAwRTlqXHUwMEUwIGZpcmVkXG4vLyAgIHdvd1JlZ2lzdHJ5LnJlc2V0KG5hbWU/KSAgICAgICBcdTIwMTQgcmVzZXQgdW4gb3UgdG91cyAodXRpbGUgZW4gZFx1MDBFOW1vKVxuLy8gICBwbGF5Uml0dWFsKGtpbmQpICAgICAgICAgICAgICAgXHUyMDE0IHNvbiByaXR1ZWwgc3ludGhcdTAwRTl0aXNcdTAwRTkgV2ViIEF1ZGlvIChzdHViKSA6XG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic291ZmZsZVwiIFx1MDBCNyBcImJyYWlzZVwiIFx1MDBCNyBcInRpc3NlXCIgXHUwMEI3IFwiY2VyZW1vbmllbFwiIFx1MDBCNyBcImFuY3JhZ2VcIlxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWZzIGZyZWVzb3VuZC5vcmcgcG91ciB1cGdyYWRlIDpcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VmZmxlICAgIFx1MjE5MiBmcmVlc291bmQub3JnL3Blb3BsZS9JbnNwZWN0b3JKL3NvdW5kcy8zNzY3MzcvICAofjZzLCAtMjMgTFVGUywgbXAzIDQ0LjFrSHopXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJhaXNlICAgICBcdTIxOTIgZnJlZXNvdW5kLm9yZy9wZW9wbGUvZmxvcmlhbnJlaWNoZWx0L3NvdW5kcy82NzMwMzIvICh+My41cywgLTIyIExVRlMpXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGlzc2UgICAgICBcdTIxOTIgZnJlZXNvdW5kLm9yZy9wZW9wbGUvQWRhbV9OL3NvdW5kcy81NDE0NzgvICAofjQwMG1zLCAtMTggTFVGUylcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZXJlbW9uaWVsIFx1MjE5MiBmcmVlc291bmQub3JnL3Blb3BsZS9JbnNwZWN0b3JKL3NvdW5kcy80MTEwODkvICh+MXMsIGdvbmcgZmV1dHJcdTAwRTksIC0yMCBMVUZTKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuY3JhZ2UgICAgXHUyMTkyIGZyZWVzb3VuZC5vcmcvcGVvcGxlL0FudGhvdXNhaS9zb3VuZHMvMzk4ODEwLyAgKH4ycywgZHJvbmUgZWFydGgsIC0yNSBMVUZTKVxuLy9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiB1VjEyUywgdXNlRWZmZWN0OiB1VjEyRSwgdXNlUmVmOiB1VjEyUiwgdXNlTWVtbzogdVYxMk0sIHVzZUNhbGxiYWNrOiB1VjEyQyB9ID0gUmVhY3Q7XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gMS4gU3VyZmFjZSBcdTIwMTQgYmVkICsgbm9pc2Ugb3ZlcmxheSByXHUwMEU5dXRpbGlzYWJsZVxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBTdXJmYWNlID0gKHsgbWF0dGVyID0gXCJsaW5lblwiLCBtb3Rpb24gPSB0cnVlLCBib29zdCwgY2hpbGRyZW4sIGNsYXNzTmFtZSA9IFwiXCIsIHN0eWxlID0ge30sIGFzID0gXCJkaXZcIiB9KSA9PiB7XG4gIGNvbnN0IFRhZyA9IGFzO1xuICBjb25zdCBtb3Rpb25CZWQgPSBtb3Rpb24gPyBgbW90aW9uLSR7bWF0dGVyID09PSBcInNpbGtcIiA/IFwic2lsay1oYWxvXCIgOiBtYXR0ZXJ9YCA6IFwiXCI7XG4gIGNvbnN0IG1vdGlvbk5vaXNlID0gbW90aW9uID09PSBcImZsaWNrZXJcIiA/IFwibW90aW9uLWVtYmVyLWZsaWNrZXJcIlxuICAgICAgICAgICAgICAgICAgICA6IG1vdGlvbiA9PT0gXCJkcmlmdFwiICAgPyBcIm1vdGlvbi1zaWxrLWRyaWZ0XCJcbiAgICAgICAgICAgICAgICAgICAgOiBcIlwiO1xuICBjb25zdCBib29zdENsYXNzID0gYm9vc3QgPT09IGZhbHNlID8gXCJcIiA6IChtYXR0ZXIgPT09IFwicGFwZXJcIiB8fCBtYXR0ZXIgPT09IFwic2lsa1wiIHx8IG1hdHRlciA9PT0gXCJ3YXRlclwiIHx8IG1hdHRlciA9PT0gXCJlbWJlclwiIHx8IG1hdHRlciA9PT0gXCJlYXJ0aFwiKSA/IGBib29zdC0ke21hdHRlciA9PT0gXCJzaWxrXCIgPyBcInNpbGtcIiA6IG1hdHRlcn1gIDogXCJcIjtcbiAgcmV0dXJuIChcbiAgICA8VGFnIGNsYXNzTmFtZT17YHN1cmZhY2UgJHtjbGFzc05hbWV9YH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgYmVkIGJlZC0ke21hdHRlcn0gJHttb3Rpb25CZWR9YH0+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGJlZC1ub2lzZSAke2Jvb3N0Q2xhc3N9ICR7bW90aW9uTm9pc2V9YH0gc3R5bGU9e3sgZmlsdGVyOiBgdXJsKCNub2lzZS0ke21hdHRlcn0pYCB9fT48L2Rpdj5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1RhZz5cbiAgKTtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gMi4gSGFsb1Jlc3BpcmUgXHUyMDE0IGhhbG9zIHJlc3BpcmFudHMgVjEuMlxuLy8gICAga2luZCA9IFwic2lsa1wiIHwgXCJlbWJlclwiIHwgXCJiaWdkcmVhbVwiXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmNvbnN0IEhhbG9SZXNwaXJlID0gKHsga2luZCA9IFwic2lsa1wiLCBzdHlsZSA9IHt9IH0pID0+IHtcbiAgY29uc3QgY2xzID0ga2luZCA9PT0gXCJiaWdkcmVhbVwiID8gXCJoYWxvLWJpZ2RyZWFtLWNvbWJpbmVcIlxuICAgICAgICAgICAgOiBraW5kID09PSBcImVtYmVyXCIgICAgPyBcImhhbG8tZW1iZXItcmVzcGlyZVwiXG4gICAgICAgICAgICA6ICAgICAgICAgICAgICAgICAgICAgICBcImhhbG8tc2lsay1yZXNwaXJlXCI7XG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xzfSBzdHlsZT17c3R5bGV9IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvZGl2Pjtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gMy4gR2VvU3ltYm9sIFx1MjAxNCA2IGZvcm1lcyBnXHUwMEU5b3N5bWJvbGlxdWVzXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmNvbnN0IEdlb1N5bWJvbCA9ICh7IGtpbmQsIGNvbG9yID0gXCJzaWxrXCIsIHN0eWxlID0ge30sIG9wYWNpdHkgfSkgPT4ge1xuICAvLyBBbGlhc2VzIHRvbFx1MDBFOXJcdTAwRTlzIChjb21wYXQgVjEuMiBhbXBsaWZpXHUwMEU5ZSlcbiAgaWYgKGtpbmQgPT09IFwiY2VyY2xlLWNvbmNlbnRyaXF1ZVwiIHx8IGtpbmQgPT09IFwiY2VyY2xlcy1jb25jZW50cmlxdWVzXCIpIGtpbmQgPSBcImNvbmNlbnRyaWNcIjtcbiAgaWYgKGtpbmQgPT09IFwiZGVtaS1jZXJjbGUtYXVyb3JlXCIpIGtpbmQgPSBcImRlbWktY2VyY2xlXCI7XG4gIGNvbnN0IGNvbG9yQ2xhc3MgPSBjb2xvciA9PT0gXCJlbWJlclwiID8gXCJnZW8tc3ltYm9sLS1lbWJlclwiXG4gICAgICAgICAgICAgICAgICAgOiBjb2xvciA9PT0gXCJib25lXCIgID8gXCJnZW8tc3ltYm9sLS1ib25lXCJcbiAgICAgICAgICAgICAgICAgICA6IFwiXCI7XG4gIGNvbnN0IHdyYXBTdHlsZSA9IHsgLi4uc3R5bGUsIC4uLihvcGFjaXR5ICE9IG51bGwgPyB7IG9wYWNpdHkgfSA6IHt9KSB9O1xuXG4gIGlmIChraW5kID09PSBcInNwaXJhbGVcIikge1xuICAgIC8vIHNwaXJhbGUgbG9nYXJpdGhtaXF1ZSAoQmlnIERyZWFtIG1hcnF1YWdlKVxuICAgIGNvbnN0IHBhdGggPSBjb21wdXRlTG9nU3BpcmFsKHsgY3g6IDEwMCwgY3k6IDEwMCwgYTogMiwgYjogMC4xOCwgdHVybnM6IDMuNSwgc3RlcHM6IDIwMCB9KTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BnZW8tc3ltYm9sICR7Y29sb3JDbGFzc31gfSBzdHlsZT17d3JhcFN0eWxlfSBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDIwMCAyMDBcIj48cGF0aCBkPXtwYXRofSAvPjwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChraW5kID09PSBcImNvbmNlbnRyaWNcIikge1xuICAgIC8vIGNlcmNsZXMgY29uY2VudHJpcXVlcyAoUG9ydHJhaXQgY2VudHJlLCBBSEEgY2FwdHVyZSlcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2BnZW8tc3ltYm9sICR7Y29sb3JDbGFzc30gY29uY2VudHJpYy1yaW5nc2B9IHN0eWxlPXt3cmFwU3R5bGV9IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjAwIDIwMFwiPlxuICAgICAgICAgIDxjaXJjbGUgY3g9XCIxMDBcIiBjeT1cIjEwMFwiIHI9XCI0MFwiIC8+XG4gICAgICAgICAgPGNpcmNsZSBjeD1cIjEwMFwiIGN5PVwiMTAwXCIgcj1cIjYwXCIgLz5cbiAgICAgICAgICA8Y2lyY2xlIGN4PVwiMTAwXCIgY3k9XCIxMDBcIiByPVwiODBcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAoa2luZCA9PT0gXCJ0cmlhbmdsZVwiKSB7XG4gICAgLy8gdHJpYW5nbGUgXHUwMEU5cXVpbGF0XHUwMEU5cmFsIChyaXR1ZWwgXHUyMDE0IFJcdTAwRTllbnRyXHUwMEU5ZSwgZ2F0ZXMpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZ2VvLXN5bWJvbCAke2NvbG9yQ2xhc3N9IHRyaWFuZ2xlLXJpdHVlbGB9IHN0eWxlPXt3cmFwU3R5bGV9IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjAwIDIwMFwiPlxuICAgICAgICAgIDxwb2x5Z29uIHBvaW50cz1cIjEwMCwyMCAxODAsMTcwIDIwLDE3MFwiIC8+XG4gICAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiMTAwLDUwIDE1MywxNTggNDcsMTU4XCIgb3BhY2l0eT1cIjAuNVwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChraW5kID09PSBcImRlbWktY2VyY2xlXCIpIHtcbiAgICAvLyBkZW1pLWNlcmNsZSBob3Jpem9udGFsIGF1cm9yZSAoQW5pbWEgTXVuZGkpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgZGVtaS1jZXJjbGUtYXVyb3JlYH0gc3R5bGU9e3dyYXBTdHlsZX0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxMDAwIDIwMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0gMCAxODAgUSA1MDAgLTQwLCAxMDAwIDE4MFwiIC8+XG4gICAgICAgICAgPHBhdGggZD1cIk0gNTAgMTgwIFEgNTAwIDAsIDk1MCAxODBcIiBvcGFjaXR5PVwiMC41XCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaWYgKGtpbmQgPT09IFwic29uZ2xpbmVzXCIpIHtcbiAgICAvLyBsaWduZXMgb25kdWxhbnRlcyBwYXJhbGxcdTAwRThsZXMgKGJhY2tncm91bmRzIG51aXQpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtgc29uZ2xpbmVzLWJnICR7Y29sb3JDbGFzc31gfSBzdHlsZT17d3JhcFN0eWxlfSBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDEwMDAgNjAwXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIj5cbiAgICAgICAgICB7WzAsIDEsIDIsIDMsIDQsIDVdLm1hcChpID0+IChcbiAgICAgICAgICAgIDxwYXRoIGtleT17aX0gZD17YE0gMCAkezEwMCArIGkgKiA4MH0gUSAyNTAgJHs2MCArIGkgKiA4MH0sIDUwMCAkezEwMCArIGkgKiA4MH0gVCAxMDAwICR7MTAwICsgaSAqIDgwfWB9IC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChraW5kID09PSBcImNyb2lzc2FudFwiKSB7XG4gICAgLy8gY3JvaXNzYW50IGx1bmFpcmUgKFBvbHlwaG9uaWVzKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YGNyb2lzc2FudC1sdW5lICR7Y29sb3JDbGFzc31gfSBzdHlsZT17d3JhcFN0eWxlfSBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDIwMCAyMDBcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTSAxMDAgMjAgQSA4MCA4MCAwIDEgMCAxMDAgMTgwIEEgNjAgNjAgMCAxIDEgMTAwIDIwIFpcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIGhlbHBlciBcdTIwMTQgbG9nIHNwaXJhbCBwYXRoXG5mdW5jdGlvbiBjb21wdXRlTG9nU3BpcmFsKHsgY3gsIGN5LCBhLCBiLCB0dXJucywgc3RlcHMgfSkge1xuICBjb25zdCB0TWF4ID0gdHVybnMgKiAyICogTWF0aC5QSTtcbiAgbGV0IGQgPSBcIlwiO1xuICBmb3IgKGxldCBpID0gMDsgaSA8PSBzdGVwczsgaSsrKSB7XG4gICAgY29uc3QgdCA9IChpIC8gc3RlcHMpICogdE1heDtcbiAgICBjb25zdCByID0gYSAqIE1hdGguZXhwKGIgKiB0KTtcbiAgICBjb25zdCB4ID0gY3ggKyByICogTWF0aC5jb3ModCk7XG4gICAgY29uc3QgeSA9IGN5ICsgciAqIE1hdGguc2luKHQpO1xuICAgIGQgKz0gKGkgPT09IDAgPyBcIk0gXCIgOiBcIkwgXCIpICsgeC50b0ZpeGVkKDIpICsgXCIgXCIgKyB5LnRvRml4ZWQoMikgKyBcIiBcIjtcbiAgfVxuICByZXR1cm4gZDtcbn1cblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyA0LiBTcGlyYWxlV293T3ZlcmxheSBcdTIwMTQgV293IDEgOiBwcmVtaWVyIGthaXJvcyBkXHUwMEU5cG9zXHUwMEU5XG4vLyAgICBBZmZpY2hlIDEuOHMgcHVpcyBkaXNwYXJhXHUwMEVFdFxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBTcGlyYWxlV293T3ZlcmxheSA9ICh7IHNob3csIG9uRG9uZSB9KSA9PiB7XG4gIHVWMTJFKCgpID0+IHtcbiAgICBpZiAoIXNob3cpIHJldHVybjtcbiAgICBjb25zdCB0ID0gc2V0VGltZW91dCgoKSA9PiBvbkRvbmU/LigpLCAxOTAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbc2hvdywgb25Eb25lXSk7XG4gIGlmICghc2hvdykgcmV0dXJuIG51bGw7XG4gIGNvbnN0IHBhdGggPSBjb21wdXRlTG9nU3BpcmFsKHsgY3g6IDE0MCwgY3k6IDE0MCwgYTogMi41LCBiOiAwLjIwLCB0dXJuczogMy41LCBzdGVwczogMjQwIH0pO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3BpcmFsZS13b3dcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAyODAgMjgwXCI+PHBhdGggZD17cGF0aH0gLz48L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gNS4gQ29uc3RlbGxhdGlvbkQzIFx1MjAxNCB2aXZhbnQsIGZvcmNlLWRpcmVjdGVkLCBlZGdlcyBCXHUwMEU5emllclxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vL1xuLy8gUHJvcHMgOlxuLy8gICBub2RlcyA6IFt7IGlkLCBsYWJlbCwgd2VpZ2h0LCBraW5kOiBcInNlbGZcInxcImthaXJvc1wifFwiYmlnZHJlYW1cInxcIm1lbWJlclwifFwiaG9sZGluZ1wifFwiZmlndXJlXCIsIHg/LCB5PyB9XVxuLy8gICBlZGdlcyA6IFt7IHNvdXJjZSwgdGFyZ2V0LCBhbGl2ZT86IGJvb2xlYW4gfV1cbi8vICAgZm9jYWxJZCA6IGlkIGR1IG5vZXVkIGZvY3VzIChjZW50clx1MDBFOSwgaGFsbyByZXNwaXJhbnQpXG4vLyAgIHdpZHRoIC8gaGVpZ2h0IDogb3B0aW9ubmVsIChzaW5vbiBjb250YWluZXIgbWVhc3VyZSlcbi8vICAgdGhyb3R0bGVNcyA6IDE2IGRlZmF1bHRcbi8vICAgb25Ob2RlQ2xpY2sgOiAobm9kZSkgPT4gdm9pZFxuLy8gICBkcmlmdFBhcnRpY2xlcyA6IHRydWV8ZmFsc2UgIChwZXRpdGVzIHBhcnRpY3VsZXMgc2lsay1nb2xkIHF1aSBkXHUwMEU5cml2ZW50KVxuLy8gICBzaG93TGFiZWxzIDogdHJ1ZVxuLy9cbmNvbnN0IENvbnN0ZWxsYXRpb25EMyA9ICh7XG4gIG5vZGVzOiBpbml0aWFsTm9kZXMsXG4gIGVkZ2VzOiBpbml0aWFsRWRnZXMsXG4gIGZvY2FsSWQsXG4gIHdpZHRoOiBwcm9wVyxcbiAgaGVpZ2h0OiBwcm9wSCxcbiAgb25Ob2RlQ2xpY2ssXG4gIGRyaWZ0UGFydGljbGVzID0gdHJ1ZSxcbiAgc2hvd0xhYmVscyA9IHRydWUsXG4gIGNsYXNzTmFtZSA9IFwiXCIsXG4gIHN0eWxlID0ge30sXG59KSA9PiB7XG4gIGNvbnN0IHdyYXBSZWYgPSB1VjEyUihudWxsKTtcbiAgY29uc3Qgc3ZnUmVmID0gdVYxMlIobnVsbCk7XG4gIGNvbnN0IFtzaXplLCBzZXRTaXplXSA9IHVWMTJTKHsgdzogcHJvcFcgfHwgNjAwLCBoOiBwcm9wSCB8fCA0MDAgfSk7XG4gIGNvbnN0IFt0aWNrLCBzZXRUaWNrXSA9IHVWMTJTKDApO1xuXG4gIC8vIG1lYXN1cmUgY29udGFpbmVyIGlmIG5vIGV4cGxpY2l0IHNpemVcbiAgdVYxMkUoKCkgPT4ge1xuICAgIGlmIChwcm9wVyAmJiBwcm9wSCkgcmV0dXJuO1xuICAgIGNvbnN0IGVsID0gd3JhcFJlZi5jdXJyZW50O1xuICAgIGlmICghZWwpIHJldHVybjtcbiAgICBjb25zdCBybyA9IG5ldyBSZXNpemVPYnNlcnZlcihlbnRyaWVzID0+IHtcbiAgICAgIGNvbnN0IHIgPSBlbnRyaWVzWzBdLmNvbnRlbnRSZWN0O1xuICAgICAgc2V0U2l6ZSh7IHc6IHIud2lkdGggfHwgcHJvcFcgfHwgNjAwLCBoOiByLmhlaWdodCB8fCBwcm9wSCB8fCA0MDAgfSk7XG4gICAgfSk7XG4gICAgcm8ub2JzZXJ2ZShlbCk7XG4gICAgcmV0dXJuICgpID0+IHJvLmRpc2Nvbm5lY3QoKTtcbiAgfSwgW3Byb3BXLCBwcm9wSF0pO1xuXG4gIC8vIC0tLSBkMy1mb3JjZSBzaW11bGF0aW9uIC0tLVxuICBjb25zdCBzaW1SZWYgPSB1VjEyUihudWxsKTtcbiAgY29uc3Qgbm9kZXNSZWYgPSB1VjEyUihbXSk7XG4gIGNvbnN0IGVkZ2VzUmVmID0gdVYxMlIoW10pO1xuXG4gIHVWMTJFKCgpID0+IHtcbiAgICBpZiAoIXdpbmRvdy5kMyB8fCAhd2luZG93LmQzLmZvcmNlU2ltdWxhdGlvbikgcmV0dXJuO1xuICAgIC8vIGRlZXAtY29weSBub2RlcyAmIGVkZ2VzIHNvIGQzIGNhbiBtdXRhdGVcbiAgICBjb25zdCBub2RlcyA9IGluaXRpYWxOb2Rlcy5tYXAobiA9PiAoeyAuLi5uIH0pKTtcbiAgICBjb25zdCBlZGdlcyA9IGluaXRpYWxFZGdlcy5tYXAoZSA9PiAoeyAuLi5lIH0pKTtcblxuICAgIC8vIHJlc29sdmUgc3RyaW5nIGlkcyBpbiBlZGdlc1xuICAgIGNvbnN0IGJ5SWQgPSBuZXcgTWFwKG5vZGVzLm1hcChuID0+IFtuLmlkLCBuXSkpO1xuICAgIGVkZ2VzLmZvckVhY2goZSA9PiB7XG4gICAgICBpZiAodHlwZW9mIGUuc291cmNlID09PSBcInN0cmluZ1wiKSBlLnNvdXJjZSA9IGJ5SWQuZ2V0KGUuc291cmNlKTtcbiAgICAgIGlmICh0eXBlb2YgZS50YXJnZXQgPT09IFwic3RyaW5nXCIpIGUudGFyZ2V0ID0gYnlJZC5nZXQoZS50YXJnZXQpO1xuICAgIH0pO1xuXG4gICAgY29uc3Qgc2ltID0gd2luZG93LmQzLmZvcmNlU2ltdWxhdGlvbihub2RlcylcbiAgICAgIC5mb3JjZShcImxpbmtcIiwgd2luZG93LmQzLmZvcmNlTGluayhlZGdlcykuaWQoZCA9PiBkLmlkKS5kaXN0YW5jZShkID0+IGQuYWxpdmUgPyA4MCA6IDk1KS5zdHJlbmd0aCgwLjQpKVxuICAgICAgLmZvcmNlKFwiY2hhcmdlXCIsIHdpbmRvdy5kMy5mb3JjZU1hbnlCb2R5KCkuc3RyZW5ndGgoZCA9PiBkLmtpbmQgPT09IFwiYmlnZHJlYW1cIiA/IC0yNjAgOiAtMTMwKSlcbiAgICAgIC5mb3JjZShcImNlbnRlclwiLCB3aW5kb3cuZDMuZm9yY2VDZW50ZXIoc2l6ZS53IC8gMiwgc2l6ZS5oIC8gMikuc3RyZW5ndGgoMC4wNikpXG4gICAgICAuZm9yY2UoXCJjb2xsaWRlXCIsIHdpbmRvdy5kMy5mb3JjZUNvbGxpZGUoKS5yYWRpdXMoZCA9PiAoZC5raW5kID09PSBcImJpZ2RyZWFtXCIgPyAzMiA6IDIwKSkuc3RyZW5ndGgoMC44NSkpXG4gICAgICAuYWxwaGEoMC45KVxuICAgICAgLmFscGhhRGVjYXkoMC4wMTUpO1xuXG4gICAgLy8gZm9jYWwgcGlubmluZ1xuICAgIGlmIChmb2NhbElkKSB7XG4gICAgICBjb25zdCBmID0gYnlJZC5nZXQoZm9jYWxJZCk7XG4gICAgICBpZiAoZikgeyBmLmZ4ID0gc2l6ZS53IC8gMjsgZi5meSA9IHNpemUuaCAvIDI7IH1cbiAgICB9XG5cbiAgICBub2Rlc1JlZi5jdXJyZW50ID0gbm9kZXM7XG4gICAgZWRnZXNSZWYuY3VycmVudCA9IGVkZ2VzO1xuICAgIHNpbVJlZi5jdXJyZW50ID0gc2ltO1xuXG4gICAgbGV0IHJhZiA9IDA7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIC8vIENsYW1wIG5vZGVzIGluc2lkZSB2aWV3cG9ydCAocHJldmVudCBsYWJlbHMgZnJvbSBjbGlwcGluZyBhdCBlZGdlcylcbiAgICAvLyAyMDI2LTA0LTI1IFx1MjAxNCBmaXggb3ZlcmZsb3cgdmlzaWJsZSBkYW5zIFBvcnRyYWl0L0NlcmNsZS9BbmltYVxuICAgIGNvbnN0IGNsYW1wUGFkID0gNDA7IC8vIHB4IHBhZGRpbmcgZm9yIGxhYmVsIHdpZHRoXG4gICAgY29uc3QgY2xhbXBOb2RlcyA9ICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgbiBvZiBub2Rlcykge1xuICAgICAgICBpZiAobi5meCA9PSBudWxsKSBuLnggPSBNYXRoLm1heChjbGFtcFBhZCwgTWF0aC5taW4oc2l6ZS53IC0gY2xhbXBQYWQsIG4ueCB8fCAwKSk7XG4gICAgICAgIGlmIChuLmZ5ID09IG51bGwpIG4ueSA9IE1hdGgubWF4KGNsYW1wUGFkLCBNYXRoLm1pbihzaXplLmggLSBjbGFtcFBhZCwgbi55IHx8IDApKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHNpbS5vbihcInRpY2tcIiwgKCkgPT4ge1xuICAgICAgY2xhbXBOb2RlcygpO1xuICAgICAgY29uc3Qgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBpZiAobm93IC0gbGFzdCA8IDE2KSByZXR1cm47IC8vIHRocm90dGxlIH42MGZwc1xuICAgICAgbGFzdCA9IG5vdztcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gICAgICByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4gc2V0VGljayh0ID0+IHQgKyAxKSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4geyBzaW0uc3RvcCgpOyBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpOyB9O1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZWFjdC1ob29rcy9leGhhdXN0aXZlLWRlcHNcbiAgfSwgW0pTT04uc3RyaW5naWZ5KGluaXRpYWxOb2Rlcy5tYXAobiA9PiBuLmlkKSksIEpTT04uc3RyaW5naWZ5KGluaXRpYWxFZGdlcy5tYXAoZSA9PiBgJHt0eXBlb2YgZS5zb3VyY2UgPT09IFwic3RyaW5nXCIgPyBlLnNvdXJjZSA6IGUuc291cmNlPy5pZH0tJHt0eXBlb2YgZS50YXJnZXQgPT09IFwic3RyaW5nXCIgPyBlLnRhcmdldCA6IGUudGFyZ2V0Py5pZH1gKSksIHNpemUudywgc2l6ZS5oLCBmb2NhbElkXSk7XG5cbiAgLy8gZHJhZ1xuICBjb25zdCBkcmFnUmVmID0gdVYxMlIobnVsbCk7XG4gIGNvbnN0IG9uTW91c2VEb3duID0gKGUsIG4pID0+IHtcbiAgICBpZiAoIXNpbVJlZi5jdXJyZW50KSByZXR1cm47XG4gICAgbi5meCA9IG4ueDsgbi5meSA9IG4ueTtcbiAgICBzaW1SZWYuY3VycmVudC5hbHBoYVRhcmdldCgwLjMpLnJlc3RhcnQoKTtcbiAgICBkcmFnUmVmLmN1cnJlbnQgPSB7IG5vZGU6IG4sIHN0YXJ0OiB7IHg6IGUuY2xpZW50WCwgeTogZS5jbGllbnRZIH0gfTtcbiAgICBjb25zdCBtb3ZlID0gZXYgPT4ge1xuICAgICAgY29uc3QgZHggPSBldi5jbGllbnRYIC0gZHJhZ1JlZi5jdXJyZW50LnN0YXJ0Lng7XG4gICAgICBjb25zdCBkeSA9IGV2LmNsaWVudFkgLSBkcmFnUmVmLmN1cnJlbnQuc3RhcnQueTtcbiAgICAgIG4uZnggPSAobi54IHx8IDApICsgZHg7XG4gICAgICBuLmZ5ID0gKG4ueSB8fCAwKSArIGR5O1xuICAgIH07XG4gICAgY29uc3QgdXAgPSAoKSA9PiB7XG4gICAgICBpZiAobi5pZCAhPT0gZm9jYWxJZCkgeyBuLmZ4ID0gbnVsbDsgbi5meSA9IG51bGw7IH1cbiAgICAgIHNpbVJlZi5jdXJyZW50LmFscGhhVGFyZ2V0KDApO1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgbW92ZSk7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdXApO1xuICAgICAgZHJhZ1JlZi5jdXJyZW50ID0gbnVsbDtcbiAgICB9O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsIG1vdmUpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB1cCk7XG4gIH07XG5cbiAgLy8gcGFydGljbGVzIGRcdTAwRTlyaXZlIChzaWxrLWdvbGQgcG91c3NpXHUwMEU4cmUpXG4gIGNvbnN0IHBhcnRpY2xlcyA9IHVWMTJNKCgpID0+IHtcbiAgICBpZiAoIWRyaWZ0UGFydGljbGVzKSByZXR1cm4gW107XG4gICAgcmV0dXJuIEFycmF5LmZyb20oeyBsZW5ndGg6IDEyIH0pLm1hcCgoXywgaSkgPT4gKHtcbiAgICAgIGlkOiBpLFxuICAgICAgeDogTWF0aC5yYW5kb20oKSwgeTogTWF0aC5yYW5kb20oKSxcbiAgICAgIHZ4OiAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjAwMDIsXG4gICAgICB2eTogKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4wMDAyLFxuICAgICAgcjogMSArIE1hdGgucmFuZG9tKCkgKiAxLjIsXG4gICAgICBkZWxheTogTWF0aC5yYW5kb20oKSAqIDgsXG4gICAgfSkpO1xuICB9LCBbZHJpZnRQYXJ0aWNsZXNdKTtcblxuICBjb25zdCBbcGFydGljbGVUaWNrLCBzZXRQYXJ0aWNsZVRpY2tdID0gdVYxMlMoMCk7XG4gIHVWMTJFKCgpID0+IHtcbiAgICBpZiAoIWRyaWZ0UGFydGljbGVzKSByZXR1cm47XG4gICAgbGV0IHJhZiA9IDA7XG4gICAgbGV0IGxhc3QgPSAwO1xuICAgIGNvbnN0IGxvb3AgPSAodCkgPT4ge1xuICAgICAgaWYgKHQgLSBsYXN0ID4gNDApIHsgc2V0UGFydGljbGVUaWNrKHAgPT4gcCArIDEpOyBsYXN0ID0gdDsgfVxuICAgICAgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH07XG4gICAgcmFmID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIHJldHVybiAoKSA9PiBjYW5jZWxBbmltYXRpb25GcmFtZShyYWYpO1xuICB9LCBbZHJpZnRQYXJ0aWNsZXNdKTtcblxuICB1VjEyRSgoKSA9PiB7XG4gICAgcGFydGljbGVzLmZvckVhY2gocCA9PiB7XG4gICAgICBwLnggKz0gcC52eDsgcC55ICs9IHAudnk7XG4gICAgICBpZiAocC54IDwgMCB8fCBwLnggPiAxKSBwLnZ4ICo9IC0xO1xuICAgICAgaWYgKHAueSA8IDAgfHwgcC55ID4gMSkgcC52eSAqPSAtMTtcbiAgICB9KTtcbiAgfSwgW3BhcnRpY2xlVGljaywgcGFydGljbGVzXSk7XG5cbiAgLy8gZWRnZSBwYXRoIGJlemllclxuICBjb25zdCBlZGdlUGF0aCA9IChlKSA9PiB7XG4gICAgY29uc3Qgc3ggPSBlLnNvdXJjZS54LCBzeSA9IGUuc291cmNlLnksIHR4ID0gZS50YXJnZXQueCwgdHkgPSBlLnRhcmdldC55O1xuICAgIGlmIChzeCA9PSBudWxsKSByZXR1cm4gXCJcIjtcbiAgICBjb25zdCBteCA9IChzeCArIHR4KSAvIDIsIG15ID0gKHN5ICsgdHkpIC8gMjtcbiAgICBjb25zdCBkeCA9IHR4IC0gc3gsIGR5ID0gdHkgLSBzeTtcbiAgICAvLyBwZXJwZW5kaWN1bGFyIHNsaWdodCBjdXJ2ZVxuICAgIGNvbnN0IG54ID0gLWR5LCBueSA9IGR4O1xuICAgIGNvbnN0IGxlbiA9IE1hdGguaHlwb3QobngsIG55KSB8fCAxO1xuICAgIGNvbnN0IGN1cnZlID0gMC4xMjtcbiAgICBjb25zdCBjeCA9IG14ICsgKG54IC8gbGVuKSAqIE1hdGguaHlwb3QoZHgsIGR5KSAqIGN1cnZlO1xuICAgIGNvbnN0IGN5ID0gbXkgKyAobnkgLyBsZW4pICogTWF0aC5oeXBvdChkeCwgZHkpICogY3VydmU7XG4gICAgcmV0dXJuIGBNICR7c3h9ICR7c3l9IFEgJHtjeH0gJHtjeX0sICR7dHh9ICR7dHl9YDtcbiAgfTtcblxuICBjb25zdCBub2RlUmFkaXVzID0gKG4pID0+IG4ua2luZCA9PT0gXCJiaWdkcmVhbVwiID8gMTggOiAobi5raW5kID09PSBcInNlbGZcIiA/IDE0IDogMTEpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e3dyYXBSZWZ9IGNsYXNzTmFtZT17YGNvbnN0ZWxsYXRpb24tZDMgJHtjbGFzc05hbWV9YH0gc3R5bGU9e3N0eWxlfT5cbiAgICAgIDxzdmcgcmVmPXtzdmdSZWZ9IHZpZXdCb3g9e2AwIDAgJHtzaXplLnd9ICR7c2l6ZS5ofWB9PlxuICAgICAgICB7LyogZWRnZXMgKi99XG4gICAgICAgIDxnIGNsYXNzTmFtZT1cImVkZ2VzXCI+XG4gICAgICAgICAge2VkZ2VzUmVmLmN1cnJlbnQubWFwKChlLCBpKSA9PiAoXG4gICAgICAgICAgICA8cGF0aCBrZXk9e2l9IGNsYXNzTmFtZT17YGVkZ2UgJHtlLmFsaXZlID8gXCJhbGl2ZVwiIDogXCJcIn1gfSBkPXtlZGdlUGF0aChlKX0gLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9nPlxuICAgICAgICB7LyogcGFydGljbGVzICovfVxuICAgICAgICB7ZHJpZnRQYXJ0aWNsZXMgJiYgKFxuICAgICAgICAgIDxnIGNsYXNzTmFtZT1cInBhcnRpY2xlc1wiPlxuICAgICAgICAgICAge3BhcnRpY2xlcy5tYXAocCA9PiAoXG4gICAgICAgICAgICAgIDxjaXJjbGUga2V5PXtwLmlkfSBjbGFzc05hbWU9XCJwYXJ0aWNsZVwiXG4gICAgICAgICAgICAgICAgY3g9e3AueCAqIHNpemUud30gY3k9e3AueSAqIHNpemUuaH0gcj17cC5yfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IG9wYWNpdHk6IDAuMyArIDAuNCAqIE1hdGguc2luKChwYXJ0aWNsZVRpY2sgKyBwLmRlbGF5ICogMTApICogMC4wNSkgfX0gLz5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZz5cbiAgICAgICAgKX1cbiAgICAgICAgey8qIG5vZGVzICovfVxuICAgICAgICA8ZyBjbGFzc05hbWU9XCJub2Rlc1wiPlxuICAgICAgICAgIHtub2Rlc1JlZi5jdXJyZW50Lm1hcChuID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBub2RlUmFkaXVzKG4pO1xuICAgICAgICAgICAgY29uc3QgY2xzID0gYG5vZGUgJHtuLmtpbmQgfHwgXCJcIn0gJHtuLmlkID09PSBmb2NhbElkID8gXCJmb2NhbFwiIDogXCJcIn0gJHtuLmhvbGRpbmcgPyBcImhvbGRpbmdcIiA6IFwiXCJ9YDtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxnIGtleT17bi5pZH0gY2xhc3NOYW1lPXtjbHN9IHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke24ueCB8fCAwfSwgJHtuLnkgfHwgMH0pYH1cbiAgICAgICAgICAgICAgICAgb25Nb3VzZURvd249eyhlKSA9PiBvbk1vdXNlRG93bihlLCBuKX1cbiAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25Ob2RlQ2xpY2s/LihuKX1cbiAgICAgICAgICAgICAgICAgc3R5bGU9e3sgY3Vyc29yOiBcInBvaW50ZXJcIiB9fT5cbiAgICAgICAgICAgICAgICA8Y2lyY2xlIGNsYXNzTmFtZT1cImhhbG9cIiByPXtyICogMS44fSAvPlxuICAgICAgICAgICAgICAgIDxjaXJjbGUgY2xhc3NOYW1lPVwiY29yZVwiIHI9e3J9IC8+XG4gICAgICAgICAgICAgICAge24ubGFiZWwgJiYgc2hvd0xhYmVscyAmJiAoXG4gICAgICAgICAgICAgICAgICA8dGV4dCB5PXtyICsgMTR9PntuLmxhYmVsfTwvdGV4dD5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2c+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2c+XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gNi4gd293UmVnaXN0cnkgXHUyMDE0IGRcdTAwRTljbGVuY2hldXJzIGRlcyA1IFdvdyBNb21lbnRzXG4vLyAgICBQZXJzaXN0YW50IGVuIGxvY2FsU3RvcmFnZSwgYWNjZXNzaWJsZSB2aWEgVHdlYWtzIHBhbmVsIFYyLlxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vL1xuLy8gV293IDAgOiBcImZpcnN0LWxhdW5jaFwiICAgICAgICAgICAgICAgXHUyMDE0IHByZW1pZXIgYWNjXHUwMEU4cyBPbmJvYXJkaW5nIChQLVpcdTAwRTlybylcbi8vIFdvdyAxIDogXCJwcmVtaWVyLWthaXJvc1wiICAgICAgICAgICAgIFx1MjAxNCBwcmVtaWVyIGthaXJvcyBkXHUwMEU5cG9zXHUwMEU5IGFwclx1MDBFOHMgb25ib2FyZGluZ1xuLy8gV293IDIgOiBcInByZW1pZXItZWNoby1wcm9waGV0aXF1ZVwiICAgXHUyMDE0IHByZW1pZXIgXHUwMEU5Y2hvIHByb3BoXHUwMEU5dGlxdWUgZFx1MDBFOXRlY3RcdTAwRTlcbi8vIFdvdyAzIDogXCJiaWctZHJlYW0tbWFycXVhZ2VcIiAgICAgICAgIFx1MjAxNCBCaWcgRHJlYW0gbWFycXVcdTAwRTkgKHNpZ25hbCBwZXJtYW5lbnQpXG4vLyBXb3cgNCA6IFwibmFpc3NhbmNlLW5vZXVkXCIgICAgICAgICAgICBcdTIwMTQgbmFpc3NhbmNlIGQndW4gbm9ldWQgY29uc3RlbGxhdGlvblxuLy8gV293IDUgOiBcInByZW1pZXJlLXJlc3RpdHV0aW9uLWNlcmNsZVwiIFx1MjAxNCBwcmVtaVx1MDBFOHJlIHJlc3RpdHV0aW9uIGNlcmNsZVxuLy9cbmNvbnN0IFdPV19LRVkgPSBcImRyZWFtOndvdy1maXJlZFwiO1xuY29uc3QgV09XX05BTUVTID0gW1xuICBcImZpcnN0LWxhdW5jaFwiLFxuICBcInByZW1pZXIta2Fpcm9zXCIsXG4gIFwicHJlbWllci1lY2hvLXByb3BoZXRpcXVlXCIsXG4gIFwiYmlnLWRyZWFtLW1hcnF1YWdlXCIsXG4gIFwibmFpc3NhbmNlLW5vZXVkXCIsXG4gIFwicHJlbWllcmUtcmVzdGl0dXRpb24tY2VyY2xlXCIsXG5dO1xuY29uc3Qgd293TGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG5jb25zdCBfcmVhZFdvdyA9ICgpID0+IHtcbiAgdHJ5IHsgcmV0dXJuIEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oV09XX0tFWSkgfHwgXCJ7fVwiKTsgfVxuICBjYXRjaCB7IHJldHVybiB7fTsgfVxufTtcbmNvbnN0IF93cml0ZVdvdyA9IChzdGF0ZSkgPT4ge1xuICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShXT1dfS0VZLCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpOyB9IGNhdGNoIHt9XG4gIHdvd0xpc3RlbmVycy5mb3JFYWNoKGZuID0+IHsgdHJ5IHsgZm4oc3RhdGUpOyB9IGNhdGNoIHt9IH0pO1xufTtcblxuY29uc3Qgd293UmVnaXN0cnkgPSB7XG4gIGhhcyhuYW1lKSB7IHJldHVybiAhIV9yZWFkV293KClbbmFtZV07IH0sXG4gIGZpcmUobmFtZSkge1xuICAgIGlmICghV09XX05BTUVTLmluY2x1ZGVzKG5hbWUpKSByZXR1cm4gZmFsc2U7XG4gICAgY29uc3QgcyA9IF9yZWFkV293KCk7XG4gICAgaWYgKHNbbmFtZV0pIHJldHVybiBmYWxzZTsgLy8gaWRlbXBvdGVudFxuICAgIHNbbmFtZV0gPSBEYXRlLm5vdygpO1xuICAgIF93cml0ZVdvdyhzKTtcbiAgICAvLyBkXHUwMEU5Y2xlbmNoZXIgbGUgdmlzdWVsIHZpYSBjdXN0b20gZXZlbnRcbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJ3b3c6ZmlyZVwiLCB7IGRldGFpbDogeyBuYW1lLCByZWFsOiB0cnVlIH0gfSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBkZW1vKG5hbWUpIHtcbiAgICAvLyBkXHUwMEU5bW9udHJlIHNhbnMgcGVyc2lzdGVyIChUd2Vha3MgcGFuZWwpXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwid293OmZpcmVcIiwgeyBkZXRhaWw6IHsgbmFtZSwgcmVhbDogZmFsc2UgfSB9KSk7XG4gIH0sXG4gIHJlc2V0KG5hbWUpIHtcbiAgICBjb25zdCBzID0gX3JlYWRXb3coKTtcbiAgICBpZiAobmFtZSkgZGVsZXRlIHNbbmFtZV07IGVsc2UgV09XX05BTUVTLmZvckVhY2gobiA9PiBkZWxldGUgc1tuXSk7XG4gICAgX3dyaXRlV293KHMpO1xuICB9LFxuICBzdWJzY3JpYmUoZm4pIHsgd293TGlzdGVuZXJzLmFkZChmbik7IHJldHVybiAoKSA9PiB3b3dMaXN0ZW5lcnMuZGVsZXRlKGZuKTsgfSxcbiAgbGlzdDogV09XX05BTUVTLFxufTtcblxuLy8gaG9vayA6IGFib25uZXIgdW4gY29tcG9zYW50IFx1MDBFMCB1biBXb3dcbmNvbnN0IHVzZVdvd0ZpcmUgPSAobmFtZSwgY2FsbGJhY2spID0+IHtcbiAgdVYxMkUoKCkgPT4ge1xuICAgIGNvbnN0IGhhbmRsZXIgPSAoZSkgPT4geyBpZiAoZS5kZXRhaWwubmFtZSA9PT0gbmFtZSkgY2FsbGJhY2s/LihlLmRldGFpbCk7IH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ3b3c6ZmlyZVwiLCBoYW5kbGVyKTtcbiAgICByZXR1cm4gKCkgPT4gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ3b3c6ZmlyZVwiLCBoYW5kbGVyKTtcbiAgfSwgW25hbWUsIGNhbGxiYWNrXSk7XG59O1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIDcuIHBsYXlSaXR1YWwgXHUyMDE0IHNvbnMgcml0dWVscyBXZWIgQXVkaW8gc3ludGhcdTAwRTl0aXNcdTAwRTlzIChzdHViIFYxLjIpXG4vLyAgICBUb2dnbGUgdmlhIFBhcmFtXHUwMEU4dHJlcyBcdTIxOTIgTm90aWZpY2F0aW9ucyAoY2xcdTAwRTkgbG9jYWxTdG9yYWdlIFwiZHJlYW06cml0dWFsLXNvdW5kXCIpLlxuLy8gICAgUmVmcyBmcmVlc291bmQub3JnIGRvY3VtZW50XHUwMEU5ZXMgZW4gaGF1dCBkZSBmaWNoaWVyLlxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBSSVRVQUxfS0VZID0gXCJkcmVhbTpyaXR1YWwtc291bmRcIjtcbmNvbnN0IHJpdHVhbFNvdW5kRW5hYmxlZCA9ICgpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCB2ID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oUklUVUFMX0tFWSk7XG4gICAgcmV0dXJuIHYgPT09IG51bGwgPyB0cnVlIDogdiA9PT0gXCJ0cnVlXCI7IC8vIE9OIHBhciBkXHUwMEU5ZmF1dFxuICB9IGNhdGNoIHsgcmV0dXJuIHRydWU7IH1cbn07XG5jb25zdCBzZXRSaXR1YWxTb3VuZCA9IChvbikgPT4ge1xuICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShSSVRVQUxfS0VZLCBTdHJpbmcoISFvbikpOyB9IGNhdGNoIHt9XG59O1xuXG5sZXQgX2F1ZGlvQ3R4ID0gbnVsbDtcbmNvbnN0IF9jdHggPSAoKSA9PiB7XG4gIGlmICghX2F1ZGlvQ3R4KSB7XG4gICAgdHJ5IHsgX2F1ZGlvQ3R4ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7IH1cbiAgICBjYXRjaCB7IHJldHVybiBudWxsOyB9XG4gIH1cbiAgcmV0dXJuIF9hdWRpb0N0eDtcbn07XG5cbmNvbnN0IHBsYXlSaXR1YWwgPSAoa2luZCkgPT4ge1xuICBpZiAoIXJpdHVhbFNvdW5kRW5hYmxlZCgpKSByZXR1cm47XG4gIGNvbnN0IGN0eCA9IF9jdHgoKTtcbiAgaWYgKCFjdHgpIHJldHVybjtcbiAgaWYgKGN0eC5zdGF0ZSA9PT0gXCJzdXNwZW5kZWRcIikgY3R4LnJlc3VtZSgpO1xuICBjb25zdCB0ID0gY3R4LmN1cnJlbnRUaW1lO1xuXG4gIGlmIChraW5kID09PSBcInNvdWZmbGVcIikge1xuICAgIC8vIHNvdWZmbGUgbG9uZywgfjZzLCB2b2lsZSBiYXNzZSBmclx1MDBFOXF1ZW5jZVxuICAgIGNvbnN0IG8gPSBjdHguY3JlYXRlT3NjaWxsYXRvcigpOyBvLnR5cGUgPSBcInNpbmVcIjsgby5mcmVxdWVuY3kudmFsdWUgPSAxMTA7XG4gICAgY29uc3QgZyA9IGN0eC5jcmVhdGVHYWluKCk7IGcuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgY29uc3QgZiA9IGN0eC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTsgZi50eXBlID0gXCJsb3dwYXNzXCI7IGYuZnJlcXVlbmN5LnZhbHVlID0gMzgwO1xuICAgIG8uY29ubmVjdChmKTsgZi5jb25uZWN0KGcpOyBnLmNvbm5lY3QoY3R4LmRlc3RpbmF0aW9uKTtcbiAgICBnLmdhaW4ubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMC4wNDUsIHQgKyAxLjUpO1xuICAgIGcuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjA2LCB0ICsgMyk7XG4gICAgZy5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIHQgKyA2KTtcbiAgICBvLnN0YXJ0KHQpOyBvLnN0b3AodCArIDYpO1xuICB9IGVsc2UgaWYgKGtpbmQgPT09IFwiYnJhaXNlXCIpIHtcbiAgICAvLyBwdWxzYXRpb24gY2FyZGlhcXVlIHJhbGVudGllIH4zLjVzXG4gICAgY29uc3QgbyA9IGN0eC5jcmVhdGVPc2NpbGxhdG9yKCk7IG8udHlwZSA9IFwic2luZVwiOyBvLmZyZXF1ZW5jeS52YWx1ZSA9IDY1O1xuICAgIGNvbnN0IGcgPSBjdHguY3JlYXRlR2FpbigpOyBnLmdhaW4udmFsdWUgPSAwO1xuICAgIG8uY29ubmVjdChnKTsgZy5jb25uZWN0KGN0eC5kZXN0aW5hdGlvbik7XG4gICAgZy5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDgsIHQgKyAwLjA1KTtcbiAgICBnLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMDEsIHQgKyAwLjQpO1xuICAgIGcuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjA2LCB0ICsgMS4wKTtcbiAgICBnLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMDEsIHQgKyAxLjQpO1xuICAgIG8uc3RhcnQodCk7IG8uc3RvcCh0ICsgMS42KTtcbiAgfSBlbHNlIGlmIChraW5kID09PSBcInRpc3NlXCIpIHtcbiAgICAvLyBmaWwgYnJlZiB0aXNzXHUwMEU5IH4zODBtcywgc29uICdwbGluaycgZmV1dHJcdTAwRTlcbiAgICBjb25zdCBvID0gY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTsgby50eXBlID0gXCJ0cmlhbmdsZVwiOyBvLmZyZXF1ZW5jeS52YWx1ZSA9IDg4MDtcbiAgICBjb25zdCBnID0gY3R4LmNyZWF0ZUdhaW4oKTsgZy5nYWluLnZhbHVlID0gMDtcbiAgICBvLmNvbm5lY3QoZyk7IGcuY29ubmVjdChjdHguZGVzdGluYXRpb24pO1xuICAgIGcuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLjA2LCB0ICsgMC4wMik7XG4gICAgZy5nYWluLmV4cG9uZW50aWFsUmFtcFRvVmFsdWVBdFRpbWUoMC4wMDAxLCB0ICsgMC4zOCk7XG4gICAgby5mcmVxdWVuY3kuZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSg2NjAsIHQgKyAwLjM4KTtcbiAgICBvLnN0YXJ0KHQpOyBvLnN0b3AodCArIDAuNCk7XG4gIH0gZWxzZSBpZiAoa2luZCA9PT0gXCJjZXJlbW9uaWVsXCIpIHtcbiAgICAvLyBnb25nIGZldXRyXHUwMEU5IH4xcyBwb3VyIHBhc3NhZ2VzIHJpdHVlbHNcbiAgICBjb25zdCBvID0gY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTsgby50eXBlID0gXCJzaW5lXCI7IG8uZnJlcXVlbmN5LnZhbHVlID0gMjIwO1xuICAgIGNvbnN0IG8yID0gY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTsgbzIudHlwZSA9IFwic2luZVwiOyBvMi5mcmVxdWVuY3kudmFsdWUgPSAzMzA7IC8vIDV0aFxuICAgIGNvbnN0IGcgPSBjdHguY3JlYXRlR2FpbigpOyBnLmdhaW4udmFsdWUgPSAwO1xuICAgIG8uY29ubmVjdChnKTsgbzIuY29ubmVjdChnKTsgZy5jb25uZWN0KGN0eC5kZXN0aW5hdGlvbik7XG4gICAgZy5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDcsIHQgKyAwLjA1KTtcbiAgICBnLmdhaW4uZXhwb25lbnRpYWxSYW1wVG9WYWx1ZUF0VGltZSgwLjAwMDEsIHQgKyAxLjIpO1xuICAgIG8uc3RhcnQodCk7IG8uc3RvcCh0ICsgMS4zKTtcbiAgICBvMi5zdGFydCh0KTsgbzIuc3RvcCh0ICsgMS4zKTtcbiAgfSBlbHNlIGlmIChraW5kID09PSBcImFuY3JhZ2VcIikge1xuICAgIC8vIGRyb25lIGVhcnRoIH4ycywgYmFzc2UgcHJvZm9uZGVcbiAgICBjb25zdCBvID0gY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTsgby50eXBlID0gXCJzYXd0b290aFwiOyBvLmZyZXF1ZW5jeS52YWx1ZSA9IDU1O1xuICAgIGNvbnN0IGYgPSBjdHguY3JlYXRlQmlxdWFkRmlsdGVyKCk7IGYudHlwZSA9IFwibG93cGFzc1wiOyBmLmZyZXF1ZW5jeS52YWx1ZSA9IDIyMDtcbiAgICBjb25zdCBnID0gY3R4LmNyZWF0ZUdhaW4oKTsgZy5nYWluLnZhbHVlID0gMDtcbiAgICBvLmNvbm5lY3QoZik7IGYuY29ubmVjdChnKTsgZy5jb25uZWN0KGN0eC5kZXN0aW5hdGlvbik7XG4gICAgZy5nYWluLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAuMDUsIHQgKyAwLjMpO1xuICAgIGcuZ2Fpbi5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCB0ICsgMik7XG4gICAgby5zdGFydCh0KTsgby5zdG9wKHQgKyAyKTtcbiAgfVxufTtcblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyA4LiBpc1Bvc3RKMzAgXHUyMDE0IGhlbHBlciBKMC1KMzAgZ3JhZGllbnQgKEIrRCByZWZvbnRlIDIwMjYtMDQtMjYpXG4vLyAgICBTcGVjIDogRGVzaWduIFx1MDBBNzExLmJpcy42IChzb21hdGljIGdhdGUgb3B0LWluIEozMCkgKyBcdTAwQTcxMS5iaXMuNyAoZmVsdC1zaGlmdCA2LXpvbmVzIEozMCkuXG4vLyAgICBMaXQgdW4gZmxhZyBkZSBkYXRlIGRlcHVpcyBsb2NhbFN0b3JhZ2UgZXQgcmV0b3VybmUgdHJ1ZSBzaSA+IE4gam91cnMuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmZ1bmN0aW9uIGlzUG9zdEozMChmbGFnRGF0ZUtleSA9IFwiZHJlYW06YWNjb3VudC1jcmVhdGVkXCIsIGRheXMgPSAzMCkge1xuICB0cnkge1xuICAgIGNvbnN0IHJhdyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGZsYWdEYXRlS2V5KTtcbiAgICBpZiAoIXJhdykgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHRzID0gcGFyc2VJbnQocmF3LCAxMCk7XG4gICAgaWYgKCF0cyB8fCBpc05hTih0cykpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gKERhdGUubm93KCkgLSB0cykgPiBkYXlzICogODY0MDAgKiAxMDAwO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyBFeHBvcnRzIFx1MjE5MiB3aW5kb3dcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgU3VyZmFjZSxcbiAgSGFsb1Jlc3BpcmUsXG4gIEdlb1N5bWJvbCxcbiAgU3BpcmFsZVdvd092ZXJsYXksXG4gIENvbnN0ZWxsYXRpb25EMyxcbiAgd293UmVnaXN0cnksXG4gIHVzZVdvd0ZpcmUsXG4gIHBsYXlSaXR1YWwsXG4gIHJpdHVhbFNvdW5kRW5hYmxlZCxcbiAgc2V0Uml0dWFsU291bmQsXG4gIGNvbXB1dGVMb2dTcGlyYWwsXG4gIGlzUG9zdEozMCxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBNkJBLE1BQU0sRUFBRSxVQUFVLE9BQU8sV0FBVyxPQUFPLFFBQVEsT0FBTyxTQUFTLE9BQU8sYUFBYSxNQUFNLElBQUk7QUFLakcsTUFBTSxVQUFVLENBQUMsRUFBRSxTQUFTLFNBQVMsU0FBUyxNQUFNLE9BQU8sVUFBVSxZQUFZLElBQUksUUFBUSxDQUFDLEdBQUcsS0FBSyxNQUFNLE1BQU07QUFDaEgsUUFBTSxNQUFNO0FBQ1osUUFBTSxZQUFZLFNBQVMsVUFBVSxXQUFXLFNBQVMsY0FBYyxNQUFNLEtBQUs7QUFDbEYsUUFBTSxjQUFjLFdBQVcsWUFBWSx5QkFDdkIsV0FBVyxVQUFZLHNCQUN2QjtBQUNwQixRQUFNLGFBQWEsVUFBVSxRQUFRLEtBQU0sV0FBVyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBVyxTQUFTLFdBQVcsU0FBUyxTQUFTLE1BQU0sS0FBSztBQUN6TSxTQUNFLG9DQUFDLE9BQUksV0FBVyxXQUFXLFNBQVMsSUFBSSxTQUN0QyxvQ0FBQyxTQUFJLFdBQVcsV0FBVyxNQUFNLElBQUksU0FBUyxJQUFJLEdBQ2xELG9DQUFDLFNBQUksV0FBVyxhQUFhLFVBQVUsSUFBSSxXQUFXLElBQUksT0FBTyxFQUFFLFFBQVEsY0FBYyxNQUFNLElBQUksR0FBRyxHQUNyRyxRQUNIO0FBRUo7QUFNQSxNQUFNLGNBQWMsQ0FBQyxFQUFFLE9BQU8sUUFBUSxRQUFRLENBQUMsRUFBRSxNQUFNO0FBQ3JELFFBQU0sTUFBTSxTQUFTLGFBQWEsMEJBQ3RCLFNBQVMsVUFBYSx1QkFDQTtBQUNsQyxTQUFPLG9DQUFDLFNBQUksV0FBVyxLQUFLLE9BQWMsZUFBWSxRQUFPO0FBQy9EO0FBS0EsTUFBTSxZQUFZLENBQUMsRUFBRSxNQUFNLFFBQVEsUUFBUSxRQUFRLENBQUMsR0FBRyxRQUFRLE1BQU07QUFFbkUsTUFBSSxTQUFTLHlCQUF5QixTQUFTLHdCQUF5QixRQUFPO0FBQy9FLE1BQUksU0FBUyxxQkFBc0IsUUFBTztBQUMxQyxRQUFNLGFBQWEsVUFBVSxVQUFVLHNCQUNwQixVQUFVLFNBQVUscUJBQ3BCO0FBQ25CLFFBQU0sWUFBWSxFQUFFLEdBQUcsT0FBTyxHQUFJLFdBQVcsT0FBTyxFQUFFLFFBQVEsSUFBSSxDQUFDLEVBQUc7QUFFdEUsTUFBSSxTQUFTLFdBQVc7QUFFdEIsVUFBTSxPQUFPLGlCQUFpQixFQUFFLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUM7QUFDekYsV0FDRSxvQ0FBQyxTQUFJLFdBQVcsY0FBYyxVQUFVLElBQUksT0FBTyxXQUFXLGVBQVksVUFDeEUsb0NBQUMsU0FBSSxTQUFRLGlCQUFjLG9DQUFDLFVBQUssR0FBRyxNQUFNLENBQUUsQ0FDOUM7QUFBQSxFQUVKO0FBRUEsTUFBSSxTQUFTLGNBQWM7QUFFekIsV0FDRSxvQ0FBQyxTQUFJLFdBQVcsY0FBYyxVQUFVLHFCQUFxQixPQUFPLFdBQVcsZUFBWSxVQUN6RixvQ0FBQyxTQUFJLFNBQVEsaUJBQ1gsb0NBQUMsWUFBTyxJQUFHLE9BQU0sSUFBRyxPQUFNLEdBQUUsTUFBSyxHQUNqQyxvQ0FBQyxZQUFPLElBQUcsT0FBTSxJQUFHLE9BQU0sR0FBRSxNQUFLLEdBQ2pDLG9DQUFDLFlBQU8sSUFBRyxPQUFNLElBQUcsT0FBTSxHQUFFLE1BQUssQ0FDbkMsQ0FDRjtBQUFBLEVBRUo7QUFFQSxNQUFJLFNBQVMsWUFBWTtBQUV2QixXQUNFLG9DQUFDLFNBQUksV0FBVyxjQUFjLFVBQVUsb0JBQW9CLE9BQU8sV0FBVyxlQUFZLFVBQ3hGLG9DQUFDLFNBQUksU0FBUSxpQkFDWCxvQ0FBQyxhQUFRLFFBQU8seUJBQXdCLEdBQ3hDLG9DQUFDLGFBQVEsUUFBTyx5QkFBd0IsU0FBUSxPQUFNLENBQ3hELENBQ0Y7QUFBQSxFQUVKO0FBRUEsTUFBSSxTQUFTLGVBQWU7QUFFMUIsV0FDRSxvQ0FBQyxTQUFJLFdBQVcsc0JBQXNCLE9BQU8sV0FBVyxlQUFZLFVBQ2xFLG9DQUFDLFNBQUksU0FBUSxnQkFBZSxxQkFBb0IsVUFDOUMsb0NBQUMsVUFBSyxHQUFFLCtCQUE4QixHQUN0QyxvQ0FBQyxVQUFLLEdBQUUsNkJBQTRCLFNBQVEsT0FBTSxDQUNwRCxDQUNGO0FBQUEsRUFFSjtBQUVBLE1BQUksU0FBUyxhQUFhO0FBRXhCLFdBQ0Usb0NBQUMsU0FBSSxXQUFXLGdCQUFnQixVQUFVLElBQUksT0FBTyxXQUFXLGVBQVksVUFDMUUsb0NBQUMsU0FBSSxTQUFRLGdCQUFlLHFCQUFvQixVQUM3QyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsSUFBSSxPQUN0QixvQ0FBQyxVQUFLLEtBQUssR0FBRyxHQUFHLE9BQU8sTUFBTSxJQUFJLEVBQUUsVUFBVSxLQUFLLElBQUksRUFBRSxTQUFTLE1BQU0sSUFBSSxFQUFFLFdBQVcsTUFBTSxJQUFJLEVBQUUsSUFBSSxDQUMxRyxDQUNILENBQ0Y7QUFBQSxFQUVKO0FBRUEsTUFBSSxTQUFTLGFBQWE7QUFFeEIsV0FDRSxvQ0FBQyxTQUFJLFdBQVcsa0JBQWtCLFVBQVUsSUFBSSxPQUFPLFdBQVcsZUFBWSxVQUM1RSxvQ0FBQyxTQUFJLFNBQVEsaUJBQ1gsb0NBQUMsVUFBSyxHQUFFLHlEQUF3RCxDQUNsRSxDQUNGO0FBQUEsRUFFSjtBQUVBLFNBQU87QUFDVDtBQUdBLFNBQVMsaUJBQWlCLEVBQUUsSUFBSSxJQUFJLEdBQUcsR0FBRyxPQUFPLE1BQU0sR0FBRztBQUN4RCxRQUFNLE9BQU8sUUFBUSxJQUFJLEtBQUs7QUFDOUIsTUFBSSxJQUFJO0FBQ1IsV0FBUyxJQUFJLEdBQUcsS0FBSyxPQUFPLEtBQUs7QUFDL0IsVUFBTSxJQUFLLElBQUksUUFBUztBQUN4QixVQUFNLElBQUksSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDO0FBQzVCLFVBQU0sSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLENBQUM7QUFDN0IsVUFBTSxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksQ0FBQztBQUM3QixVQUFNLE1BQU0sSUFBSSxPQUFPLFFBQVEsRUFBRSxRQUFRLENBQUMsSUFBSSxNQUFNLEVBQUUsUUFBUSxDQUFDLElBQUk7QUFBQSxFQUNyRTtBQUNBLFNBQU87QUFDVDtBQU1BLE1BQU0sb0JBQW9CLENBQUMsRUFBRSxNQUFNLE9BQU8sTUFBTTtBQUM5QyxRQUFNLE1BQU07QUFDVixRQUFJLENBQUMsS0FBTTtBQUNYLFVBQU0sSUFBSSxXQUFXLE1BQU0sb0NBQVksSUFBSTtBQUMzQyxXQUFPLE1BQU0sYUFBYSxDQUFDO0FBQUEsRUFDN0IsR0FBRyxDQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ2pCLE1BQUksQ0FBQyxLQUFNLFFBQU87QUFDbEIsUUFBTSxPQUFPLGlCQUFpQixFQUFFLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBTSxPQUFPLEtBQUssT0FBTyxJQUFJLENBQUM7QUFDM0YsU0FDRSxvQ0FBQyxTQUFJLFdBQVUsZUFBYyxlQUFZLFVBQ3ZDLG9DQUFDLFNBQUksU0FBUSxpQkFBYyxvQ0FBQyxVQUFLLEdBQUcsTUFBTSxDQUFFLENBQzlDO0FBRUo7QUFnQkEsTUFBTSxrQkFBa0IsQ0FBQztBQUFBLEVBQ3ZCLE9BQU87QUFBQSxFQUNQLE9BQU87QUFBQSxFQUNQO0FBQUEsRUFDQSxPQUFPO0FBQUEsRUFDUCxRQUFRO0FBQUEsRUFDUjtBQUFBLEVBQ0EsaUJBQWlCO0FBQUEsRUFDakIsYUFBYTtBQUFBLEVBQ2IsWUFBWTtBQUFBLEVBQ1osUUFBUSxDQUFDO0FBQ1gsTUFBTTtBQUNKLFFBQU0sVUFBVSxNQUFNLElBQUk7QUFDMUIsUUFBTSxTQUFTLE1BQU0sSUFBSTtBQUN6QixRQUFNLENBQUMsTUFBTSxPQUFPLElBQUksTUFBTSxFQUFFLEdBQUcsU0FBUyxLQUFLLEdBQUcsU0FBUyxJQUFJLENBQUM7QUFDbEUsUUFBTSxDQUFDLE1BQU0sT0FBTyxJQUFJLE1BQU0sQ0FBQztBQUcvQixRQUFNLE1BQU07QUFDVixRQUFJLFNBQVMsTUFBTztBQUNwQixVQUFNLEtBQUssUUFBUTtBQUNuQixRQUFJLENBQUMsR0FBSTtBQUNULFVBQU0sS0FBSyxJQUFJLGVBQWUsYUFBVztBQUN2QyxZQUFNLElBQUksUUFBUSxDQUFDLEVBQUU7QUFDckIsY0FBUSxFQUFFLEdBQUcsRUFBRSxTQUFTLFNBQVMsS0FBSyxHQUFHLEVBQUUsVUFBVSxTQUFTLElBQUksQ0FBQztBQUFBLElBQ3JFLENBQUM7QUFDRCxPQUFHLFFBQVEsRUFBRTtBQUNiLFdBQU8sTUFBTSxHQUFHLFdBQVc7QUFBQSxFQUM3QixHQUFHLENBQUMsT0FBTyxLQUFLLENBQUM7QUFHakIsUUFBTSxTQUFTLE1BQU0sSUFBSTtBQUN6QixRQUFNLFdBQVcsTUFBTSxDQUFDLENBQUM7QUFDekIsUUFBTSxXQUFXLE1BQU0sQ0FBQyxDQUFDO0FBRXpCLFFBQU0sTUFBTTtBQUNWLFFBQUksQ0FBQyxPQUFPLE1BQU0sQ0FBQyxPQUFPLEdBQUcsZ0JBQWlCO0FBRTlDLFVBQU0sUUFBUSxhQUFhLElBQUksUUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQzlDLFVBQU0sUUFBUSxhQUFhLElBQUksUUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBRzlDLFVBQU0sT0FBTyxJQUFJLElBQUksTUFBTSxJQUFJLE9BQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDOUMsVUFBTSxRQUFRLE9BQUs7QUFDakIsVUFBSSxPQUFPLEVBQUUsV0FBVyxTQUFVLEdBQUUsU0FBUyxLQUFLLElBQUksRUFBRSxNQUFNO0FBQzlELFVBQUksT0FBTyxFQUFFLFdBQVcsU0FBVSxHQUFFLFNBQVMsS0FBSyxJQUFJLEVBQUUsTUFBTTtBQUFBLElBQ2hFLENBQUM7QUFFRCxVQUFNLE1BQU0sT0FBTyxHQUFHLGdCQUFnQixLQUFLLEVBQ3hDLE1BQU0sUUFBUSxPQUFPLEdBQUcsVUFBVSxLQUFLLEVBQUUsR0FBRyxPQUFLLEVBQUUsRUFBRSxFQUFFLFNBQVMsT0FBSyxFQUFFLFFBQVEsS0FBSyxFQUFFLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFDckcsTUFBTSxVQUFVLE9BQU8sR0FBRyxjQUFjLEVBQUUsU0FBUyxPQUFLLEVBQUUsU0FBUyxhQUFhLE9BQU8sSUFBSSxDQUFDLEVBQzVGLE1BQU0sVUFBVSxPQUFPLEdBQUcsWUFBWSxLQUFLLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxFQUFFLFNBQVMsSUFBSSxDQUFDLEVBQzVFLE1BQU0sV0FBVyxPQUFPLEdBQUcsYUFBYSxFQUFFLE9BQU8sT0FBTSxFQUFFLFNBQVMsYUFBYSxLQUFLLEVBQUcsRUFBRSxTQUFTLElBQUksQ0FBQyxFQUN2RyxNQUFNLEdBQUcsRUFDVCxXQUFXLEtBQUs7QUFHbkIsUUFBSSxTQUFTO0FBQ1gsWUFBTSxJQUFJLEtBQUssSUFBSSxPQUFPO0FBQzFCLFVBQUksR0FBRztBQUFFLFVBQUUsS0FBSyxLQUFLLElBQUk7QUFBRyxVQUFFLEtBQUssS0FBSyxJQUFJO0FBQUEsTUFBRztBQUFBLElBQ2pEO0FBRUEsYUFBUyxVQUFVO0FBQ25CLGFBQVMsVUFBVTtBQUNuQixXQUFPLFVBQVU7QUFFakIsUUFBSSxNQUFNO0FBQ1YsUUFBSSxPQUFPO0FBR1gsVUFBTSxXQUFXO0FBQ2pCLFVBQU0sYUFBYSxNQUFNO0FBQ3ZCLGlCQUFXLEtBQUssT0FBTztBQUNyQixZQUFJLEVBQUUsTUFBTSxLQUFNLEdBQUUsSUFBSSxLQUFLLElBQUksVUFBVSxLQUFLLElBQUksS0FBSyxJQUFJLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRixZQUFJLEVBQUUsTUFBTSxLQUFNLEdBQUUsSUFBSSxLQUFLLElBQUksVUFBVSxLQUFLLElBQUksS0FBSyxJQUFJLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUFBLE1BQ2xGO0FBQUEsSUFDRjtBQUNBLFFBQUksR0FBRyxRQUFRLE1BQU07QUFDbkIsaUJBQVc7QUFDWCxZQUFNLE1BQU0sWUFBWSxJQUFJO0FBQzVCLFVBQUksTUFBTSxPQUFPLEdBQUk7QUFDckIsYUFBTztBQUNQLDJCQUFxQixHQUFHO0FBQ3hCLFlBQU0sc0JBQXNCLE1BQU0sUUFBUSxPQUFLLElBQUksQ0FBQyxDQUFDO0FBQUEsSUFDdkQsQ0FBQztBQUVELFdBQU8sTUFBTTtBQUFFLFVBQUksS0FBSztBQUFHLDJCQUFxQixHQUFHO0FBQUEsSUFBRztBQUFBLEVBRXhELEdBQUcsQ0FBQyxLQUFLLFVBQVUsYUFBYSxJQUFJLE9BQUssRUFBRSxFQUFFLENBQUMsR0FBRyxLQUFLLFVBQVUsYUFBYSxJQUFJLE9BQUU7QUExUnJGO0FBMFJ3RixjQUFHLE9BQU8sRUFBRSxXQUFXLFdBQVcsRUFBRSxVQUFTLE9BQUUsV0FBRixtQkFBVSxFQUFFLElBQUksT0FBTyxFQUFFLFdBQVcsV0FBVyxFQUFFLFVBQVMsT0FBRSxXQUFGLG1CQUFVLEVBQUU7QUFBQSxHQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUd2TyxRQUFNLFVBQVUsTUFBTSxJQUFJO0FBQzFCLFFBQU0sY0FBYyxDQUFDLEdBQUcsTUFBTTtBQUM1QixRQUFJLENBQUMsT0FBTyxRQUFTO0FBQ3JCLE1BQUUsS0FBSyxFQUFFO0FBQUcsTUFBRSxLQUFLLEVBQUU7QUFDckIsV0FBTyxRQUFRLFlBQVksR0FBRyxFQUFFLFFBQVE7QUFDeEMsWUFBUSxVQUFVLEVBQUUsTUFBTSxHQUFHLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQ25FLFVBQU0sT0FBTyxRQUFNO0FBQ2pCLFlBQU0sS0FBSyxHQUFHLFVBQVUsUUFBUSxRQUFRLE1BQU07QUFDOUMsWUFBTSxLQUFLLEdBQUcsVUFBVSxRQUFRLFFBQVEsTUFBTTtBQUM5QyxRQUFFLE1BQU0sRUFBRSxLQUFLLEtBQUs7QUFDcEIsUUFBRSxNQUFNLEVBQUUsS0FBSyxLQUFLO0FBQUEsSUFDdEI7QUFDQSxVQUFNLEtBQUssTUFBTTtBQUNmLFVBQUksRUFBRSxPQUFPLFNBQVM7QUFBRSxVQUFFLEtBQUs7QUFBTSxVQUFFLEtBQUs7QUFBQSxNQUFNO0FBQ2xELGFBQU8sUUFBUSxZQUFZLENBQUM7QUFDNUIsYUFBTyxvQkFBb0IsYUFBYSxJQUFJO0FBQzVDLGFBQU8sb0JBQW9CLFdBQVcsRUFBRTtBQUN4QyxjQUFRLFVBQVU7QUFBQSxJQUNwQjtBQUNBLFdBQU8saUJBQWlCLGFBQWEsSUFBSTtBQUN6QyxXQUFPLGlCQUFpQixXQUFXLEVBQUU7QUFBQSxFQUN2QztBQUdBLFFBQU0sWUFBWSxNQUFNLE1BQU07QUFDNUIsUUFBSSxDQUFDLGVBQWdCLFFBQU8sQ0FBQztBQUM3QixXQUFPLE1BQU0sS0FBSyxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsT0FBTztBQUFBLE1BQy9DLElBQUk7QUFBQSxNQUNKLEdBQUcsS0FBSyxPQUFPO0FBQUEsTUFBRyxHQUFHLEtBQUssT0FBTztBQUFBLE1BQ2pDLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTztBQUFBLE1BQzVCLEtBQUssS0FBSyxPQUFPLElBQUksT0FBTztBQUFBLE1BQzVCLEdBQUcsSUFBSSxLQUFLLE9BQU8sSUFBSTtBQUFBLE1BQ3ZCLE9BQU8sS0FBSyxPQUFPLElBQUk7QUFBQSxJQUN6QixFQUFFO0FBQUEsRUFDSixHQUFHLENBQUMsY0FBYyxDQUFDO0FBRW5CLFFBQU0sQ0FBQyxjQUFjLGVBQWUsSUFBSSxNQUFNLENBQUM7QUFDL0MsUUFBTSxNQUFNO0FBQ1YsUUFBSSxDQUFDLGVBQWdCO0FBQ3JCLFFBQUksTUFBTTtBQUNWLFFBQUksT0FBTztBQUNYLFVBQU0sT0FBTyxDQUFDLE1BQU07QUFDbEIsVUFBSSxJQUFJLE9BQU8sSUFBSTtBQUFFLHdCQUFnQixPQUFLLElBQUksQ0FBQztBQUFHLGVBQU87QUFBQSxNQUFHO0FBQzVELFlBQU0sc0JBQXNCLElBQUk7QUFBQSxJQUNsQztBQUNBLFVBQU0sc0JBQXNCLElBQUk7QUFDaEMsV0FBTyxNQUFNLHFCQUFxQixHQUFHO0FBQUEsRUFDdkMsR0FBRyxDQUFDLGNBQWMsQ0FBQztBQUVuQixRQUFNLE1BQU07QUFDVixjQUFVLFFBQVEsT0FBSztBQUNyQixRQUFFLEtBQUssRUFBRTtBQUFJLFFBQUUsS0FBSyxFQUFFO0FBQ3RCLFVBQUksRUFBRSxJQUFJLEtBQUssRUFBRSxJQUFJLEVBQUcsR0FBRSxNQUFNO0FBQ2hDLFVBQUksRUFBRSxJQUFJLEtBQUssRUFBRSxJQUFJLEVBQUcsR0FBRSxNQUFNO0FBQUEsSUFDbEMsQ0FBQztBQUFBLEVBQ0gsR0FBRyxDQUFDLGNBQWMsU0FBUyxDQUFDO0FBRzVCLFFBQU0sV0FBVyxDQUFDLE1BQU07QUFDdEIsVUFBTSxLQUFLLEVBQUUsT0FBTyxHQUFHLEtBQUssRUFBRSxPQUFPLEdBQUcsS0FBSyxFQUFFLE9BQU8sR0FBRyxLQUFLLEVBQUUsT0FBTztBQUN2RSxRQUFJLE1BQU0sS0FBTSxRQUFPO0FBQ3ZCLFVBQU0sTUFBTSxLQUFLLE1BQU0sR0FBRyxNQUFNLEtBQUssTUFBTTtBQUMzQyxVQUFNLEtBQUssS0FBSyxJQUFJLEtBQUssS0FBSztBQUU5QixVQUFNLEtBQUssQ0FBQyxJQUFJLEtBQUs7QUFDckIsVUFBTSxNQUFNLEtBQUssTUFBTSxJQUFJLEVBQUUsS0FBSztBQUNsQyxVQUFNLFFBQVE7QUFDZCxVQUFNLEtBQUssS0FBTSxLQUFLLE1BQU8sS0FBSyxNQUFNLElBQUksRUFBRSxJQUFJO0FBQ2xELFVBQU0sS0FBSyxLQUFNLEtBQUssTUFBTyxLQUFLLE1BQU0sSUFBSSxFQUFFLElBQUk7QUFDbEQsV0FBTyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUFBLEVBQ2pEO0FBRUEsUUFBTSxhQUFhLENBQUMsTUFBTSxFQUFFLFNBQVMsYUFBYSxLQUFNLEVBQUUsU0FBUyxTQUFTLEtBQUs7QUFFakYsU0FDRSxvQ0FBQyxTQUFJLEtBQUssU0FBUyxXQUFXLG9CQUFvQixTQUFTLElBQUksU0FDN0Qsb0NBQUMsU0FBSSxLQUFLLFFBQVEsU0FBUyxPQUFPLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUVoRCxvQ0FBQyxPQUFFLFdBQVUsV0FDVixTQUFTLFFBQVEsSUFBSSxDQUFDLEdBQUcsTUFDeEIsb0NBQUMsVUFBSyxLQUFLLEdBQUcsV0FBVyxRQUFRLEVBQUUsUUFBUSxVQUFVLEVBQUUsSUFBSSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQzVFLENBQ0gsR0FFQyxrQkFDQyxvQ0FBQyxPQUFFLFdBQVUsZUFDVixVQUFVLElBQUksT0FDYjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sS0FBSyxFQUFFO0FBQUEsTUFBSSxXQUFVO0FBQUEsTUFDM0IsSUFBSSxFQUFFLElBQUksS0FBSztBQUFBLE1BQUcsSUFBSSxFQUFFLElBQUksS0FBSztBQUFBLE1BQUcsR0FBRyxFQUFFO0FBQUEsTUFDekMsT0FBTyxFQUFFLFNBQVMsTUFBTSxNQUFNLEtBQUssS0FBSyxlQUFlLEVBQUUsUUFBUSxNQUFNLElBQUksRUFBRTtBQUFBO0FBQUEsRUFBRyxDQUNuRixDQUNILEdBR0Ysb0NBQUMsT0FBRSxXQUFVLFdBQ1YsU0FBUyxRQUFRLElBQUksT0FBSztBQUN6QixVQUFNLElBQUksV0FBVyxDQUFDO0FBQ3RCLFVBQU0sTUFBTSxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLFVBQVUsVUFBVSxFQUFFLElBQUksRUFBRSxVQUFVLFlBQVksRUFBRTtBQUNqRyxXQUNFO0FBQUEsTUFBQztBQUFBO0FBQUEsUUFBRSxLQUFLLEVBQUU7QUFBQSxRQUFJLFdBQVc7QUFBQSxRQUFLLFdBQVcsYUFBYSxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDO0FBQUEsUUFDeEUsYUFBYSxDQUFDLE1BQU0sWUFBWSxHQUFHLENBQUM7QUFBQSxRQUNwQyxTQUFTLE1BQU0sMkNBQWM7QUFBQSxRQUM3QixPQUFPLEVBQUUsUUFBUSxVQUFVO0FBQUE7QUFBQSxNQUM1QixvQ0FBQyxZQUFPLFdBQVUsUUFBTyxHQUFHLElBQUksS0FBSztBQUFBLE1BQ3JDLG9DQUFDLFlBQU8sV0FBVSxRQUFPLEdBQU07QUFBQSxNQUM5QixFQUFFLFNBQVMsY0FDVixvQ0FBQyxVQUFLLEdBQUcsSUFBSSxNQUFLLEVBQUUsS0FBTTtBQUFBLElBRTlCO0FBQUEsRUFFSixDQUFDLENBQ0gsQ0FDRixDQUNGO0FBRUo7QUFjQSxNQUFNLFVBQVU7QUFDaEIsTUFBTSxZQUFZO0FBQUEsRUFDaEI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGO0FBQ0EsTUFBTSxlQUFlLG9CQUFJLElBQUk7QUFFN0IsTUFBTSxXQUFXLE1BQU07QUFDckIsTUFBSTtBQUFFLFdBQU8sS0FBSyxNQUFNLGFBQWEsUUFBUSxPQUFPLEtBQUssSUFBSTtBQUFBLEVBQUcsU0FDMUQ7QUFBRSxXQUFPLENBQUM7QUFBQSxFQUFHO0FBQ3JCO0FBQ0EsTUFBTSxZQUFZLENBQUMsVUFBVTtBQUMzQixNQUFJO0FBQUUsaUJBQWEsUUFBUSxTQUFTLEtBQUssVUFBVSxLQUFLLENBQUM7QUFBQSxFQUFHLFNBQVE7QUFBQSxFQUFDO0FBQ3JFLGVBQWEsUUFBUSxRQUFNO0FBQUUsUUFBSTtBQUFFLFNBQUcsS0FBSztBQUFBLElBQUcsU0FBUTtBQUFBLElBQUM7QUFBQSxFQUFFLENBQUM7QUFDNUQ7QUFFQSxNQUFNLGNBQWM7QUFBQSxFQUNsQixJQUFJLE1BQU07QUFBRSxXQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSTtBQUFBLEVBQUc7QUFBQSxFQUN2QyxLQUFLLE1BQU07QUFDVCxRQUFJLENBQUMsVUFBVSxTQUFTLElBQUksRUFBRyxRQUFPO0FBQ3RDLFVBQU0sSUFBSSxTQUFTO0FBQ25CLFFBQUksRUFBRSxJQUFJLEVBQUcsUUFBTztBQUNwQixNQUFFLElBQUksSUFBSSxLQUFLLElBQUk7QUFDbkIsY0FBVSxDQUFDO0FBRVgsV0FBTyxjQUFjLElBQUksWUFBWSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sTUFBTSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQ2xGLFdBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxLQUFLLE1BQU07QUFFVCxXQUFPLGNBQWMsSUFBSSxZQUFZLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSxNQUFNLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFBQSxFQUNyRjtBQUFBLEVBQ0EsTUFBTSxNQUFNO0FBQ1YsVUFBTSxJQUFJLFNBQVM7QUFDbkIsUUFBSSxLQUFNLFFBQU8sRUFBRSxJQUFJO0FBQUEsUUFBUSxXQUFVLFFBQVEsT0FBSyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ2pFLGNBQVUsQ0FBQztBQUFBLEVBQ2I7QUFBQSxFQUNBLFVBQVUsSUFBSTtBQUFFLGlCQUFhLElBQUksRUFBRTtBQUFHLFdBQU8sTUFBTSxhQUFhLE9BQU8sRUFBRTtBQUFBLEVBQUc7QUFBQSxFQUM1RSxNQUFNO0FBQ1I7QUFHQSxNQUFNLGFBQWEsQ0FBQyxNQUFNLGFBQWE7QUFDckMsUUFBTSxNQUFNO0FBQ1YsVUFBTSxVQUFVLENBQUMsTUFBTTtBQUFFLFVBQUksRUFBRSxPQUFPLFNBQVMsS0FBTSxzQ0FBVyxFQUFFO0FBQUEsSUFBUztBQUMzRSxXQUFPLGlCQUFpQixZQUFZLE9BQU87QUFDM0MsV0FBTyxNQUFNLE9BQU8sb0JBQW9CLFlBQVksT0FBTztBQUFBLEVBQzdELEdBQUcsQ0FBQyxNQUFNLFFBQVEsQ0FBQztBQUNyQjtBQU9BLE1BQU0sYUFBYTtBQUNuQixNQUFNLHFCQUFxQixNQUFNO0FBQy9CLE1BQUk7QUFDRixVQUFNLElBQUksYUFBYSxRQUFRLFVBQVU7QUFDekMsV0FBTyxNQUFNLE9BQU8sT0FBTyxNQUFNO0FBQUEsRUFDbkMsU0FBUTtBQUFFLFdBQU87QUFBQSxFQUFNO0FBQ3pCO0FBQ0EsTUFBTSxpQkFBaUIsQ0FBQyxPQUFPO0FBQzdCLE1BQUk7QUFBRSxpQkFBYSxRQUFRLFlBQVksT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQUEsRUFBRyxTQUFRO0FBQUEsRUFBQztBQUNqRTtBQUVBLElBQUksWUFBWTtBQUNoQixNQUFNLE9BQU8sTUFBTTtBQUNqQixNQUFJLENBQUMsV0FBVztBQUNkLFFBQUk7QUFBRSxrQkFBWSxLQUFLLE9BQU8sZ0JBQWdCLE9BQU8sb0JBQW9CO0FBQUEsSUFBRyxTQUN0RTtBQUFFLGFBQU87QUFBQSxJQUFNO0FBQUEsRUFDdkI7QUFDQSxTQUFPO0FBQ1Q7QUFFQSxNQUFNLGFBQWEsQ0FBQyxTQUFTO0FBQzNCLE1BQUksQ0FBQyxtQkFBbUIsRUFBRztBQUMzQixRQUFNLE1BQU0sS0FBSztBQUNqQixNQUFJLENBQUMsSUFBSztBQUNWLE1BQUksSUFBSSxVQUFVLFlBQWEsS0FBSSxPQUFPO0FBQzFDLFFBQU0sSUFBSSxJQUFJO0FBRWQsTUFBSSxTQUFTLFdBQVc7QUFFdEIsVUFBTSxJQUFJLElBQUksaUJBQWlCO0FBQUcsTUFBRSxPQUFPO0FBQVEsTUFBRSxVQUFVLFFBQVE7QUFDdkUsVUFBTSxJQUFJLElBQUksV0FBVztBQUFHLE1BQUUsS0FBSyxRQUFRO0FBQzNDLFVBQU0sSUFBSSxJQUFJLG1CQUFtQjtBQUFHLE1BQUUsT0FBTztBQUFXLE1BQUUsVUFBVSxRQUFRO0FBQzVFLE1BQUUsUUFBUSxDQUFDO0FBQUcsTUFBRSxRQUFRLENBQUM7QUFBRyxNQUFFLFFBQVEsSUFBSSxXQUFXO0FBQ3JELE1BQUUsS0FBSyx3QkFBd0IsT0FBTyxJQUFJLEdBQUc7QUFDN0MsTUFBRSxLQUFLLHdCQUF3QixNQUFNLElBQUksQ0FBQztBQUMxQyxNQUFFLEtBQUssd0JBQXdCLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLE1BQUUsTUFBTSxDQUFDO0FBQUcsTUFBRSxLQUFLLElBQUksQ0FBQztBQUFBLEVBQzFCLFdBQVcsU0FBUyxVQUFVO0FBRTVCLFVBQU0sSUFBSSxJQUFJLGlCQUFpQjtBQUFHLE1BQUUsT0FBTztBQUFRLE1BQUUsVUFBVSxRQUFRO0FBQ3ZFLFVBQU0sSUFBSSxJQUFJLFdBQVc7QUFBRyxNQUFFLEtBQUssUUFBUTtBQUMzQyxNQUFFLFFBQVEsQ0FBQztBQUFHLE1BQUUsUUFBUSxJQUFJLFdBQVc7QUFDdkMsTUFBRSxLQUFLLHdCQUF3QixNQUFNLElBQUksSUFBSTtBQUM3QyxNQUFFLEtBQUssNkJBQTZCLE1BQVEsSUFBSSxHQUFHO0FBQ25ELE1BQUUsS0FBSyx3QkFBd0IsTUFBTSxJQUFJLENBQUc7QUFDNUMsTUFBRSxLQUFLLDZCQUE2QixNQUFRLElBQUksR0FBRztBQUNuRCxNQUFFLE1BQU0sQ0FBQztBQUFHLE1BQUUsS0FBSyxJQUFJLEdBQUc7QUFBQSxFQUM1QixXQUFXLFNBQVMsU0FBUztBQUUzQixVQUFNLElBQUksSUFBSSxpQkFBaUI7QUFBRyxNQUFFLE9BQU87QUFBWSxNQUFFLFVBQVUsUUFBUTtBQUMzRSxVQUFNLElBQUksSUFBSSxXQUFXO0FBQUcsTUFBRSxLQUFLLFFBQVE7QUFDM0MsTUFBRSxRQUFRLENBQUM7QUFBRyxNQUFFLFFBQVEsSUFBSSxXQUFXO0FBQ3ZDLE1BQUUsS0FBSyx3QkFBd0IsTUFBTSxJQUFJLElBQUk7QUFDN0MsTUFBRSxLQUFLLDZCQUE2QixNQUFRLElBQUksSUFBSTtBQUNwRCxNQUFFLFVBQVUsNkJBQTZCLEtBQUssSUFBSSxJQUFJO0FBQ3RELE1BQUUsTUFBTSxDQUFDO0FBQUcsTUFBRSxLQUFLLElBQUksR0FBRztBQUFBLEVBQzVCLFdBQVcsU0FBUyxjQUFjO0FBRWhDLFVBQU0sSUFBSSxJQUFJLGlCQUFpQjtBQUFHLE1BQUUsT0FBTztBQUFRLE1BQUUsVUFBVSxRQUFRO0FBQ3ZFLFVBQU0sS0FBSyxJQUFJLGlCQUFpQjtBQUFHLE9BQUcsT0FBTztBQUFRLE9BQUcsVUFBVSxRQUFRO0FBQzFFLFVBQU0sSUFBSSxJQUFJLFdBQVc7QUFBRyxNQUFFLEtBQUssUUFBUTtBQUMzQyxNQUFFLFFBQVEsQ0FBQztBQUFHLE9BQUcsUUFBUSxDQUFDO0FBQUcsTUFBRSxRQUFRLElBQUksV0FBVztBQUN0RCxNQUFFLEtBQUssd0JBQXdCLE1BQU0sSUFBSSxJQUFJO0FBQzdDLE1BQUUsS0FBSyw2QkFBNkIsTUFBUSxJQUFJLEdBQUc7QUFDbkQsTUFBRSxNQUFNLENBQUM7QUFBRyxNQUFFLEtBQUssSUFBSSxHQUFHO0FBQzFCLE9BQUcsTUFBTSxDQUFDO0FBQUcsT0FBRyxLQUFLLElBQUksR0FBRztBQUFBLEVBQzlCLFdBQVcsU0FBUyxXQUFXO0FBRTdCLFVBQU0sSUFBSSxJQUFJLGlCQUFpQjtBQUFHLE1BQUUsT0FBTztBQUFZLE1BQUUsVUFBVSxRQUFRO0FBQzNFLFVBQU0sSUFBSSxJQUFJLG1CQUFtQjtBQUFHLE1BQUUsT0FBTztBQUFXLE1BQUUsVUFBVSxRQUFRO0FBQzVFLFVBQU0sSUFBSSxJQUFJLFdBQVc7QUFBRyxNQUFFLEtBQUssUUFBUTtBQUMzQyxNQUFFLFFBQVEsQ0FBQztBQUFHLE1BQUUsUUFBUSxDQUFDO0FBQUcsTUFBRSxRQUFRLElBQUksV0FBVztBQUNyRCxNQUFFLEtBQUssd0JBQXdCLE1BQU0sSUFBSSxHQUFHO0FBQzVDLE1BQUUsS0FBSyx3QkFBd0IsR0FBRyxJQUFJLENBQUM7QUFDdkMsTUFBRSxNQUFNLENBQUM7QUFBRyxNQUFFLEtBQUssSUFBSSxDQUFDO0FBQUEsRUFDMUI7QUFDRjtBQU9BLFNBQVMsVUFBVSxjQUFjLHlCQUF5QixPQUFPLElBQUk7QUFDbkUsTUFBSTtBQUNGLFVBQU0sTUFBTSxhQUFhLFFBQVEsV0FBVztBQUM1QyxRQUFJLENBQUMsSUFBSyxRQUFPO0FBQ2pCLFVBQU0sS0FBSyxTQUFTLEtBQUssRUFBRTtBQUMzQixRQUFJLENBQUMsTUFBTSxNQUFNLEVBQUUsRUFBRyxRQUFPO0FBQzdCLFdBQVEsS0FBSyxJQUFJLElBQUksS0FBTSxPQUFPLFFBQVE7QUFBQSxFQUM1QyxTQUFRO0FBQ04sV0FBTztBQUFBLEVBQ1Q7QUFDRjtBQUtBLE9BQU8sT0FBTyxRQUFRO0FBQUEsRUFDcEI7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
