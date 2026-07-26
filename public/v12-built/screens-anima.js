const { useState: uAS, useEffect: uAE, useMemo: uAM, useRef: uAR } = React;
function roundHumane(n) {
  if (!n || n < 50) return null;
  if (n < 1e3) return Math.round(n / 50) * 50;
  if (n < 1e4) return Math.round(n / 500) * 500;
  if (n < 1e5) return Math.round(n / 1e3) * 1e3;
  return Math.round(n / 1e4) * 1e4;
}
function frNumber(n) {
  if (n == null) return "";
  return n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ");
}
function holdRounded(n) {
  if (!n || n < 1) return 0;
  if (n < 30) return Math.max(10, Math.round(n / 10) * 10);
  if (n < 300) return Math.round(n / 50) * 50;
  if (n < 3e3) return Math.round(n / 100) * 100;
  return Math.round(n / 500) * 500;
}
function shuffleSeeded(arr, seed = 1) {
  const a = arr.slice();
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor(s / 233280 * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function ChamberBackground({ intensity = 0.5 }) {
  return /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    background: "var(--night-floor)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    opacity: 0.1 * intensity,
    animation: "anima-water-drift 60s ease-in-out infinite",
    mixBlendMode: "screen"
  } }, /* @__PURE__ */ React.createElement("svg", { width: "100%", height: "100%", preserveAspectRatio: "none", style: { display: "block" } }, /* @__PURE__ */ React.createElement("rect", { width: "100%", height: "100%", filter: "url(#noise-water)" }))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
    background: "radial-gradient(ellipse at 50% 100%, color-mix(in oklch, var(--obsidian) 55%, transparent), transparent 70%)",
    opacity: 0.7
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at 50% 35%, color-mix(in oklch, var(--stone-cool) 22%, transparent), transparent 65%)",
    opacity: 0.55
  } }));
}
function ConstellationBreathing({ density = 80 }) {
  const [tick, setTick] = uAS(0);
  uAE(() => {
    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;
      setTick((t) => t + dt / 1e3);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const points = uAM(() => {
    const N = Math.max(40, Math.min(140, Math.round(density)));
    const arr = [];
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const angle = i * 2.39996;
      const r = Math.sqrt(t) * 44;
      const cx = 50 + Math.cos(angle) * r;
      const cy = 50 + Math.sin(angle) * r * 0.62;
      const phase = i * 0.317 % (Math.PI * 2);
      const size = 0.35 + i * 13 % 9 / 14;
      const kind = i % 28 === 0 ? "gold" : i % 11 === 0 ? "cool" : "bone";
      arr.push({ cx, cy, phase, size, kind });
    }
    return arr;
  }, [density]);
  const breath = (Math.sin(tick / 10 * Math.PI * 2) + 1) / 2;
  return /* @__PURE__ */ React.createElement("div", { className: "anima-constellation", "aria-hidden": "true", style: {
    width: "100%",
    height: 320,
    position: "relative",
    overflow: "hidden",
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 100 100", width: "100%", height: "100%", preserveAspectRatio: "xMidYMid meet", style: { display: "block" } }, points.map((p, i) => {
    const local = (Math.sin(tick / 10 * Math.PI * 2 + p.phase * 0.3) + 1) / 2;
    const a = 0.15 + local * 0.55;
    const r = p.size * (0.7 + breath * 0.4);
    const fill = p.kind === "gold" ? "var(--silk-gold)" : p.kind === "cool" ? "var(--stone-cool)" : "var(--bone)";
    return /* @__PURE__ */ React.createElement("circle", { key: i, cx: p.cx, cy: p.cy, r, fill, opacity: a });
  })));
}
const AnimaVouteScreen = ({ go }) => {
  var _a;
  const [voute, setVoute] = uAS(null);
  const [loading, setLoading] = uAS(true);
  uAE(() => {
    let cancelled = false;
    window.DreamAPI.getVoute().then((d) => {
      if (cancelled) return;
      setVoute(d);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  const rawCount = ((_a = voute == null ? void 0 : voute.meteo) == null ? void 0 : _a.k_count) || (voute == null ? void 0 : voute.meteo_optin_count) || null;
  const humaneCount = roundHumane(rawCount);
  const density = uAM(() => {
    if (!rawCount || rawCount < 50) return 60;
    return Math.min(140, 50 + Math.round(rawCount / 600));
  }, [rawCount]);
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "transparent", position: "relative" } }, /* @__PURE__ */ React.createElement(ChamberBackground, { intensity: 1 }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(window.TopNav, null), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { paddingBottom: 120 } }, /* @__PURE__ */ React.createElement("div", { className: "text-center", style: {
    marginTop: "var(--s-4)",
    marginBottom: "var(--s-4)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15.5,
    color: "var(--ash-light)",
    letterSpacing: "0.01em",
    textWrap: "pretty",
    opacity: loading ? 0 : 0.85,
    transition: "opacity 1200ms var(--ease-respire)"
  } }, humaneCount ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Cette lune, l'humanit\xE9 a r\xEAv\xE9 environ ", frNumber(humaneCount), " fois.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Cette lune, des voix se rassemblent dans la nuit.")), /* @__PURE__ */ React.createElement(ConstellationBreathing, { density }), /* @__PURE__ */ React.createElement("div", { className: "text-center", style: {
    marginTop: "var(--s-4)",
    marginBottom: "var(--s-6)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    letterSpacing: "0.18em",
    textTransform: "lowercase",
    opacity: 0.6
  } }, "anima mundi"), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 28 } }, /* @__PURE__ */ React.createElement(
    ChamberCard,
    {
      title: "Le temps qu'il fait dans la nuit",
      hint: "m\xE9t\xE9o",
      onClick: () => go("anima-meteo"),
      breathDelay: 0
    }
  ), /* @__PURE__ */ React.createElement(
    ChamberCard,
    {
      title: "Tenu ensemble",
      hint: "annales",
      onClick: () => go("anima-annales"),
      breathDelay: 1.6
    }
  ), /* @__PURE__ */ React.createElement(
    ChamberCard,
    {
      title: "Polyphonie de la lune",
      hint: "lecture longue",
      onClick: () => go("anima-polyphonie"),
      breathDelay: 3.2
    }
  )))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes anima-water-drift {
          0%, 100% { transform: translate3d(-1.5%, -1%, 0) scale(1.04); }
          50%      { transform: translate3d(1.5%, 1%, 0) scale(1.06); }
        }
        @keyframes anima-card-breathe {
          0%, 100% { box-shadow: 0 0 24px color-mix(in oklch, var(--bone) 3%, transparent); }
          50%      { box-shadow: 0 0 42px color-mix(in oklch, var(--silk-gold) 9%, transparent); }
        }
        .anima-chamber-card {
          padding: 32px 28px;
          background:
            radial-gradient(ellipse at 80% 20%, color-mix(in oklch, var(--bone) 3%, transparent), transparent 60%),
            color-mix(in oklch, var(--obsidian) 48%, transparent);
          border: 1px solid color-mix(in oklch, var(--silk-gold) 8%, var(--ash-deep));
          color: var(--bone);
          cursor: pointer; text-align: left;
          transition: border-color 920ms var(--ease-respire),
                      transform 920ms var(--ease-respire),
                      background 920ms var(--ease-respire);
          position: relative; overflow: hidden;
          font-family: var(--serif);
          animation: anima-card-breathe 9s ease-in-out infinite;
        }
        .anima-chamber-card::before {
          content: ""; position: absolute; inset: 0;
          background-image: url('#noise-stone');
          opacity: 0.30;
          pointer-events: none;
        }
        .anima-chamber-card:hover {
          border-color: color-mix(in oklch, var(--silk-gold) 28%, var(--ash-mid));
          transform: translateY(-1px);
        }
      `));
};
const ChamberCard = ({ title, hint, onClick, breathDelay = 0 }) => /* @__PURE__ */ React.createElement(
  "button",
  {
    className: "anima-chamber-card",
    onClick,
    style: { animationDelay: `-${breathDelay}s` }
  },
  /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("h3", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 24,
    lineHeight: 1.25,
    color: "var(--bone)",
    margin: 0,
    textWrap: "pretty"
  } }, title), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 12,
    fontFamily: "var(--mono)",
    fontSize: 10.5,
    color: "var(--ash-light)",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    opacity: 0.7
  } }, hint))
);
const AnimaMeteoScreen = ({ go }) => {
  var _a, _b, _c, _d, _e;
  const [meteos, setMeteos] = uAS([]);
  const [loading, setLoading] = uAS(true);
  uAE(() => {
    let cancelled = false;
    window.DreamAPI.getMeteo({ limit: 4 }).then((d) => {
      if (cancelled) return;
      setMeteos((d == null ? void 0 : d.meteos) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  const latest = meteos[0];
  const poetic = (latest == null ? void 0 : latest.poetic_phrase) || (latest == null ? void 0 : latest.headline) || (((_a = latest == null ? void 0 : latest.top_motifs) == null ? void 0 : _a.length) ? composeMeteoPhrase(latest.top_motifs[0]) : "Cette lune, l'humanit\xE9 a r\xEAv\xE9 d'eau. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit.");
  const mainMotif = ((_c = (_b = latest == null ? void 0 : latest.top_motifs) == null ? void 0 : _b[0]) == null ? void 0 : _c.motif) || ((_e = (_d = latest == null ? void 0 : latest.top_motifs) == null ? void 0 : _d[0]) == null ? void 0 : _e.label) || "eau";
  const matterKind = motifToMatter(mainMotif);
  const clouds = composeClouds(latest);
  const tournures = composeTournures(latest);
  const polarities = composePolarities(latest);
  const initiations = composeInitiations(latest);
  const ageDays = (latest == null ? void 0 : latest.computed_at) ? Math.floor((Date.now() - new Date(latest.computed_at).getTime()) / (24 * 3600 * 1e3)) : null;
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "transparent", position: "relative" } }, /* @__PURE__ */ React.createElement(ChamberBackground, { intensity: 0.7 }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("anima"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { paddingBottom: 120 } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "lowercase"
  } }, "anima mundi \xB7 chambre seconde"), /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 32,
    lineHeight: 1.15,
    color: "var(--bone)",
    margin: "0 0 var(--s-5) 0",
    textWrap: "pretty",
    maxWidth: 580
  } }, "Le temps qu'il fait dans la nuit"), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 23,
    lineHeight: 1.5,
    color: "var(--bone)",
    maxWidth: 600,
    textWrap: "pretty",
    margin: "0 0 var(--s-6) 0",
    opacity: loading ? 0.4 : 1,
    transition: "opacity 920ms var(--ease-respire)"
  } }, loading ? "la m\xE9t\xE9o se compose\u2026" : poetic), /* @__PURE__ */ React.createElement("div", { className: "text-center mb-xl", style: { marginTop: "var(--s-4)", marginBottom: "var(--s-6)" } }, /* @__PURE__ */ React.createElement(MatterGlyph, { kind: matterKind }), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 14,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--ash-light)",
    letterSpacing: "0.05em"
  } }, mainMotif)), /* @__PURE__ */ React.createElement(SectionRule, { label: "nuages th\xE9matiques" }), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 20, marginBottom: "var(--s-6)" } }, clouds.map((t, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 18,
    lineHeight: 1.55,
    color: "var(--bone)",
    margin: 0,
    textWrap: "pretty",
    maxWidth: 600,
    opacity: 0.92
  } }, t))), /* @__PURE__ */ React.createElement(SectionRule, { label: "tournures qui montent" }), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 16, marginBottom: "var(--s-6)" } }, tournures.map((t, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--bone)",
    margin: 0,
    textWrap: "pretty",
    maxWidth: 600,
    opacity: 0.85
  } }, t))), polarities.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionRule, { label: "polarit\xE9s vivantes" }), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 14, marginBottom: "var(--s-6)" } }, polarities.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 16.5,
    lineHeight: 1.5,
    color: "var(--bone)",
    opacity: 0.85,
    textWrap: "pretty",
    maxWidth: 600
  } }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--silk-gold)", opacity: 0.7 } }, "\u2194"), " ", p)))), initiations.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(SectionRule, { label: "initiations en cours" }), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 14, marginBottom: "var(--s-6)" } }, initiations.map((p, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--bone)",
    opacity: 0.88,
    textWrap: "pretty",
    maxWidth: 600,
    margin: 0
  } }, p)))), /* @__PURE__ */ React.createElement("div", { className: "meta op-50", style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.05em",
    marginTop: "var(--s-6)",
    color: "var(--ash-light)"
  } }, ageDays != null ? `recompos\xE9e il y a ${ageDays} jours \xB7 d\xE9lai rituel \u2265 14 j` : "recompos\xE9e r\xE9guli\xE8rement \xB7 d\xE9lai rituel \u2265 14 j"))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
function composeMeteoPhrase(topMotif) {
  const m = ((topMotif == null ? void 0 : topMotif.motif) || (topMotif == null ? void 0 : topMotif.label) || "eau").toLowerCase();
  const map = {
    eau: "Cette lune, l'humanit\xE9 a r\xEAv\xE9 d'eau. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit.",
    pierre: "Cette lune, beaucoup de pierres. Pierres qui retiennent, pierres qui marquent un seuil.",
    feu: "Cette lune, du feu qui couve plus qu'il ne br\xFBle. Braises tenues, pas flammes hautes.",
    brume: "Cette lune, beaucoup de brume. Les contours se d\xE9font avant de se reposer ailleurs.",
    vent: "Cette lune, du vent qui passe sans presser. Il d\xE9place ce qui pesait.",
    racine: "Cette lune, des racines qui descendent. Lentement, sans bruit, vers ce qui les nourrit.",
    porte: "Cette lune, beaucoup de portes. Certaines s'ouvrent, beaucoup attendent encore.",
    animal: "Cette lune, des animaux qui parlent doucement. Ils n'ont pas l'air press\xE9s d'\xEAtre compris."
  };
  return map[m] || `Cette lune, le motif de la ${m} revient le plus \u2014 sans s'imposer.`;
}
function composeClouds(meteo) {
  if ((meteo == null ? void 0 : meteo.clouds) && Array.isArray(meteo.clouds) && meteo.clouds.length > 0) {
    return meteo.clouds.slice(0, 5);
  }
  return [
    "Beaucoup de portes qui ne s'ouvrent pas tout de suite.",
    "Des animaux qui parlent doucement, sans urgence.",
    "Des d\xE9funts qui reviennent pour faire la cuisine."
  ];
}
function composeTournures(meteo) {
  if ((meteo == null ? void 0 : meteo.tournures) && Array.isArray(meteo.tournures) && meteo.tournures.length > 0) {
    return meteo.tournures.slice(0, 5);
  }
  return [
    "L'eau revient plus que le feu cette saison.",
    "Les paysages se font plus vastes ; les pi\xE8ces ferm\xE9es se font plus rares.",
    "Les figures grand-maternelles se rapprochent."
  ];
}
function composePolarities(meteo) {
  if ((meteo == null ? void 0 : meteo.polarities) && Array.isArray(meteo.polarities) && meteo.polarities.length > 0) {
    return meteo.polarities.slice(0, 4).map(
      (p) => typeof p === "string" ? p : `${p.left || ""} et ${p.right || ""}`
    );
  }
  return [];
}
function composeInitiations(meteo) {
  if ((meteo == null ? void 0 : meteo.initiations) && Array.isArray(meteo.initiations) && meteo.initiations.length > 0) {
    return meteo.initiations.slice(0, 3);
  }
  return [];
}
function motifToMatter(motif) {
  const m = (motif || "").toLowerCase();
  if (m.includes("eau") || m.includes("riv") || m.includes("mer")) return "eau";
  if (m.includes("feu") || m.includes("braise") || m.includes("flamme")) return "feu";
  if (m.includes("pierre") || m.includes("roche")) return "pierre";
  if (m.includes("brume") || m.includes("nuage") || m.includes("vapeur")) return "brume";
  if (m.includes("vent") || m.includes("souffle")) return "vent";
  if (m.includes("racine") || m.includes("arbre") || m.includes("for\xEAt")) return "racine";
  return "eau";
}
const MatterGlyph = ({ kind = "eau" }) => {
  const common = {
    width: 90,
    height: 90,
    viewBox: "0 0 80 80",
    style: { opacity: 0.78 }
  };
  const stroke = "var(--stone-cool)";
  const sw = 0.7;
  switch (kind) {
    case "eau":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M40 14 Q26 30 26 46 Q26 62 40 70 Q54 62 54 46 Q54 30 40 14 Z",
          fill: "none",
          stroke,
          strokeWidth: sw
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M40 24 Q32 34 32 48 Q32 60 40 64",
          fill: "none",
          stroke,
          strokeWidth: sw * 0.7,
          opacity: "0.6"
        }
      ));
    case "feu":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M40 14 Q30 30 32 44 Q34 56 40 60 Q46 56 48 44 Q50 30 40 14 Z",
          fill: "none",
          stroke: "var(--ember-live)",
          strokeWidth: sw,
          opacity: "0.9"
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M40 28 Q36 38 38 48 Q40 56 40 56",
          fill: "none",
          stroke: "var(--ember-live)",
          strokeWidth: sw * 0.7,
          opacity: "0.55"
        }
      ));
    case "pierre":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M22 50 Q22 32 40 30 Q58 32 58 50 Q58 60 50 64 L30 64 Q22 60 22 50 Z",
          fill: "none",
          stroke,
          strokeWidth: sw
        }
      ), /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M30 48 L36 42 L46 50 L52 44",
          fill: "none",
          stroke,
          strokeWidth: sw * 0.6,
          opacity: "0.55"
        }
      ));
    case "brume":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M16 30 Q28 26 40 30 T64 30", fill: "none", stroke, strokeWidth: sw, opacity: "0.7" }), /* @__PURE__ */ React.createElement("path", { d: "M14 42 Q28 38 40 42 T66 42", fill: "none", stroke, strokeWidth: sw, opacity: "0.6" }), /* @__PURE__ */ React.createElement("path", { d: "M18 54 Q30 50 42 54 T62 54", fill: "none", stroke, strokeWidth: sw, opacity: "0.5" }));
    case "vent":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M14 32 Q34 28 50 32 Q56 33 60 30", fill: "none", stroke, strokeWidth: sw, opacity: "0.75" }), /* @__PURE__ */ React.createElement("path", { d: "M14 44 Q40 40 56 44 Q62 45 64 42", fill: "none", stroke, strokeWidth: sw, opacity: "0.6" }), /* @__PURE__ */ React.createElement("path", { d: "M14 56 Q30 52 46 56 Q52 57 54 54", fill: "none", stroke, strokeWidth: sw, opacity: "0.45" }));
    case "racine":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M40 14 L40 38", fill: "none", stroke, strokeWidth: sw }), /* @__PURE__ */ React.createElement(
        "path",
        {
          d: "M40 38 Q34 46 28 56 M40 38 Q46 46 52 56 M40 38 L40 64 M28 56 Q24 60 20 66 M52 56 Q56 60 60 66",
          fill: "none",
          stroke,
          strokeWidth: sw * 0.7,
          opacity: "0.7"
        }
      ));
    default:
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "40", cy: "40", r: "22", fill: "none", stroke, strokeWidth: sw }));
  }
};
const SectionRule = ({ label }) => /* @__PURE__ */ React.createElement("div", { className: "row", style: {
  alignItems: "center",
  gap: 14,
  marginBottom: 22
} }, /* @__PURE__ */ React.createElement("span", { style: {
  flex: "0 0 auto",
  fontFamily: "var(--mono)",
  fontSize: 10.5,
  color: "var(--ash-light)",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  opacity: 0.75
} }, label), /* @__PURE__ */ React.createElement("span", { style: {
  flex: 1,
  height: 1,
  background: "color-mix(in oklch, var(--ash-deep) 100%, transparent)",
  opacity: 0.5
} }));
const AnimaAnnalesScreen = ({ go }) => {
  const [corpus, setCorpus] = uAS([]);
  const [loading, setLoading] = uAS(true);
  const [tenuById, setTenuById] = uAS({});
  const seed = uAM(() => [
    { id: "seed-1", text: "Une grand-m\xE8re inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom.", hold_count: 280, shared_at: null },
    { id: "seed-2", text: "Un enfant-animal que j'ai oubli\xE9 de nourrir depuis des ann\xE9es sort du placard vivant. Pas en col\xE8re. Simplement vivant.", hold_count: 410, shared_at: null },
    { id: "seed-3", text: "Je traverse un pont qu'on n'a pas fini de construire. Il se construit sous mes pieds \u2014 mais seulement si je continue.", hold_count: 180, shared_at: null },
    { id: "seed-4", text: "Une baleine remonte dans une rivi\xE8re ass\xE9ch\xE9e, suivie par des gens qui tiennent des seaux d'eau, un \xE0 la fois.", hold_count: 530, shared_at: null }
  ], []);
  uAE(() => {
    let cancelled = false;
    window.DreamAPI.getAnnales().then((d) => {
      if (cancelled) return;
      const live = ((d == null ? void 0 : d.circulating) || []).map((a) => ({
        id: a.id,
        text: a.curated_text,
        hold_count: a.hold_count || 0,
        shared_at: a.shared_at
      }));
      setCorpus(live.length > 0 ? live : seed);
      setLoading(false);
    }).catch(() => {
      setCorpus(seed);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [seed]);
  const display = uAM(() => {
    const today = /* @__PURE__ */ new Date();
    const seedDay = today.getFullYear() * 1e3 + Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (24 * 3600 * 1e3)
    );
    return shuffleSeeded(corpus, seedDay);
  }, [corpus]);
  const tenir = async (id) => {
    if (tenuById[id]) return;
    setTenuById((t) => ({ ...t, [id]: true }));
    try {
      await window.DreamAPI.tenirAnnale(id);
    } catch (e) {
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "transparent", position: "relative" } }, /* @__PURE__ */ React.createElement(ChamberBackground, { intensity: 0.6 }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("anima"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { paddingBottom: 120 } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "lowercase"
  } }, "anima mundi \xB7 chambre troisi\xE8me"), /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 32,
    lineHeight: 1.15,
    color: "var(--bone)",
    margin: "0 0 var(--s-4) 0",
    textWrap: "pretty"
  } }, "Tenu ensemble"), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--ash-light)",
    maxWidth: 580,
    textWrap: "pretty",
    margin: "0 0 var(--s-6) 0"
  } }, "Ces r\xEAves ont \xE9t\xE9 offerts \xE0 la vo\xFBte commune. Nous les tenons \u2014 non pour les comprendre, mais parce qu'ils nous regardent."), loading && corpus.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    opacity: 0.6,
    padding: "var(--s-5) 0"
  } }, "les annales se rassemblent\u2026") : /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 32 } }, display.map((d) => /* @__PURE__ */ React.createElement(
    AnnaleCard,
    {
      key: d.id,
      annale: d,
      tenu: !!tenuById[d.id],
      onTenir: () => tenir(d.id)
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "meta op-50", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    marginTop: "var(--s-6)",
    maxWidth: 600,
    textWrap: "pretty",
    fontSize: 14,
    lineHeight: 1.55
  } }, "Tenir n'est pas voter. Aucun classement. L'ordre change \xE0 chaque lune. Tu peux retirer un r\xEAve que tu as offert, \xE0 tout moment \u2014 il s'efface en silence."))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null), /* @__PURE__ */ React.createElement("style", null, `
        .anima-annale-card {
          padding: 32px 28px;
          background:
            linear-gradient(180deg,
              color-mix(in oklch, var(--paper-warm) 8%, var(--night-warm)) 0%,
              color-mix(in oklch, var(--obsidian) 60%, var(--night-floor)) 100%);
          border: 1px solid color-mix(in oklch, var(--paper-warm) 14%, var(--ash-deep));
          position: relative; overflow: hidden;
        }
        .anima-annale-card::before {
          content: ""; position: absolute; inset: 0;
          background-image: url('#noise-paper');
          opacity: 0.18;
          pointer-events: none;
        }
        .anima-tenir {
          background: transparent; border: none;
          color: var(--ash-light);
          font-family: var(--serif); font-style: italic;
          font-size: 22px; line-height: 1;
          cursor: pointer; padding: 6px 10px;
          transition: color 920ms var(--ease-respire),
                      transform 380ms var(--ease-respire),
                      text-shadow 920ms var(--ease-respire);
        }
        .anima-tenir:hover { color: var(--bone); }
        .anima-tenir.tenu {
          color: var(--silk-gold);
          text-shadow: 0 0 12px color-mix(in oklch, var(--silk-gold) 40%, transparent);
        }
      `));
};
const AnnaleCard = ({ annale, tenu, onTenir }) => {
  const heldRound = holdRounded(annale.hold_count);
  return /* @__PURE__ */ React.createElement("article", { className: "anima-annale-card" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    lineHeight: 1.5,
    color: "var(--bone)",
    margin: 0,
    textAlign: "center",
    textWrap: "pretty",
    padding: "0 8px"
  } }, annale.text), /* @__PURE__ */ React.createElement("div", { className: "row", style: {
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    paddingTop: 18,
    borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 70%, transparent)",
    flexWrap: "wrap",
    gap: 14
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--ash-light)",
    opacity: 0.85
  } }, heldRound > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "tenu par ~", frNumber(heldRound)) : /* @__PURE__ */ React.createElement(React.Fragment, null, "en circulation")), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "anima-tenir " + (tenu ? "tenu" : ""),
      onClick: onTenir,
      "aria-label": tenu ? "tu tiens ce r\xEAve" : "tenir ce r\xEAve",
      title: tenu ? "tu le tiens" : "tenir"
    },
    tenu ? "\u2726" : "\u2727"
  ))));
};
const AnimaPolyphonieScreen = ({ go }) => {
  const [polyphonies, setPolyphonies] = uAS([]);
  const [archive, setArchive] = uAS([]);
  const [showArchive, setShowArchive] = uAS(false);
  const [activeIdx, setActiveIdx] = uAS(0);
  const [loading, setLoading] = uAS(true);
  uAE(() => {
    let cancelled = false;
    Promise.all([
      window.DreamAPI.getPolyphonie({ limit: 1 }),
      window.DreamAPI.getPolyphonieArchive ? window.DreamAPI.getPolyphonieArchive() : Promise.resolve({ polyphonies: [] })
    ]).then(([latestData, archiveData]) => {
      if (cancelled) return;
      setPolyphonies((latestData == null ? void 0 : latestData.polyphonies) || []);
      setArchive((archiveData == null ? void 0 : archiveData.polyphonies) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);
  const pool = uAM(() => {
    const current = polyphonies[0];
    const map = /* @__PURE__ */ new Map();
    if (current) map.set(current.id, current);
    archive.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [polyphonies, archive]);
  const active = pool[activeIdx] || polyphonies[0] || null;
  const lunarLabel = (active == null ? void 0 : active.lunar_phase) || "lecture longue";
  const voices = (active == null ? void 0 : active.voices_mobilisees) || [];
  const fmtMonth = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };
  const fallback = `Plusieurs ont r\xEAv\xE9 d'eau cette lune. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit, d'estuaires qui se forment. Et plusieurs ont \xE9crit des doutes sur leur travail, sur ce qu'il faut tenir et ce qu'il faut l\xE2cher.

\xC0 la lumi\xE8re de Bachelard, on pourrait entendre dans ces eaux cherchant leur lit la m\xEAme chose que dans ces questions de seuil : une fluidit\xE9 qui demande \xE0 se poser quelque part, sans encore savoir o\xF9. L'eau, ici, n'est pas celle qui noie. C'est celle qui h\xE9site avant de prendre sa forme.

Aizenstat aurait invit\xE9 \xE0 tenir la grand-m\xE8re qui revient \u2014 plusieurs l'ont vue cette lune, dans des cuisines sans feu, avec du linge \xE0 laver. Elle n'est pas figure de pass\xE9. Elle est figure qui travaille quelque chose qui n'a pas encore de nom dans la vie de jour.

Et Moss, on l'imagine dire : les ponts inachev\xE9s qui reviennent en synchronicit\xE9 ne demandent peut-\xEAtre pas \xE0 \xEAtre finis. Ils demandent \xE0 \xEAtre regard\xE9s, depuis les deux rives \xE0 la fois.

Que se cherche-t-elle, l'eau qui cherche son lit ?`;
  const text = (active == null ? void 0 : active.narrative_text) || fallback;
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "transparent", position: "relative" } }, /* @__PURE__ */ React.createElement(ChamberBackground, { intensity: 0.55 }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("anima"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { paddingBottom: 120, maxWidth: 680 } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    fontSize: 13,
    letterSpacing: "0.12em",
    textTransform: "lowercase"
  } }, "anima mundi \xB7 chambre quatri\xE8me"), /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 32,
    lineHeight: 1.15,
    color: "var(--bone)",
    margin: "0 0 var(--s-3) 0",
    textWrap: "pretty"
  } }, "Polyphonie de la lune"), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--ash-light)",
    marginBottom: "var(--s-6)",
    opacity: 0.85
  } }, activeIdx === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "\xB7 ", lunarLabel) : /* @__PURE__ */ React.createElement(React.Fragment, null, "\xB7 lecture pr\xE9c\xE9dente \xB7 ", fmtMonth(active == null ? void 0 : active.period_end))), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontSize: 19,
    lineHeight: 1.75,
    color: "var(--bone)",
    maxWidth: 600,
    textAlign: "justify",
    textWrap: "pretty"
  } }, loading ? window.PolyphonieLetterSkeleton ? /* @__PURE__ */ React.createElement(window.PolyphonieLetterSkeleton, null) : /* @__PURE__ */ React.createElement("p", { style: { fontStyle: "italic", opacity: 0.5 } }, "la polyphonie s'\xE9crit\u2026") : paragraphs.map((para, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: {
    margin: "0 0 1.4em 0",
    textWrap: "pretty"
  } }, para))), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: "var(--s-6)",
    paddingTop: "var(--s-4)",
    borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    opacity: 0.85,
    textWrap: "pretty"
  } }, "voix mobilis\xE9es cette lune \xB7", " ", voices.length > 0 ? voices.join(", ") : "Aizenstat, Moss, Bachelard"), pool.length > 1 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "var(--s-6)" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowArchive((s) => !s),
      style: {
        background: "transparent",
        border: "none",
        color: "var(--ash-light)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14.5,
        cursor: "pointer",
        padding: "8px 0",
        letterSpacing: "0.02em",
        textDecoration: "underline",
        textDecorationColor: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
        textUnderlineOffset: 6
      }
    },
    showArchive ? "refermer les lectures pr\xE9c\xE9dentes" : "lectures pr\xE9c\xE9dentes"
  ), showArchive && /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 6, marginTop: "var(--s-4)" } }, pool.map((p, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.id || i,
      onClick: () => {
        setActiveIdx(i);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      style: {
        background: i === activeIdx ? "color-mix(in oklch, var(--silk-gold) 8%, transparent)" : "transparent",
        border: "1px solid " + (i === activeIdx ? "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))" : "var(--ash-deep)"),
        color: i === activeIdx ? "var(--bone)" : "var(--ash-light)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 15,
        padding: "10px 14px",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 380ms var(--ease-respire)"
      }
    },
    i === 0 ? "lune actuelle" : p.lunar_phase || fmtMonth(p.period_end) || "lecture pr\xE9c\xE9dente"
  )))))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const OffreKairosSheet = ({ entry, onClose, onOffer }) => {
  const [step, setStep] = uAS(0);
  const [consent, setConsent] = uAS({ image: true, moon: true, region: false });
  return /* @__PURE__ */ React.createElement("div", { className: "offre-sheet" }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 620, margin: "0 auto" } }, step === 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" } }, "ce r\xEAve porte un numinous"), /* @__PURE__ */ React.createElement("h2", { className: "h2-section mb-m", style: { fontSize: 23 } }, "voudrais-tu l'offrir \xE0 anima mundi ?"), /* @__PURE__ */ React.createElement("p", { className: "body op-70 mb-m", style: { textWrap: "pretty" } }, "Certains r\xEAves semblent appartenir au-del\xE0 de nous. Les offrir \xE0 la vo\xFBte commune, c'est permettre qu'ils soient tenus par des inconnues, dans d'autres r\xE9gions, d'autres lunes."), /* @__PURE__ */ React.createElement("p", { className: "meta mb-l", style: { fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)", textWrap: "pretty" } }, "ce n'est pas obligatoire. tu peux dire non, sans explication."), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onClose }, "pas cette fois"), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => setStep(1) }, "voir ce qui serait partag\xE9"))), step === 1 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "ce qui voyagerait vers anima mundi"), /* @__PURE__ */ React.createElement("h3", { className: "h3-lecture mb-m", style: { fontSize: 19 } }, "avec ton accord, et seulement ce que tu veux."), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 0 } }, /* @__PURE__ */ React.createElement("div", { className: "setting-row" }, /* @__PURE__ */ React.createElement("div", { className: "label" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, "l'image du r\xEAve"), /* @__PURE__ */ React.createElement("div", { className: "desc" }, "anonyme. aucune trace de toi, aucun identifiant.")), /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "toggle " + (consent.image ? "on" : ""),
      onClick: () => setConsent((c) => ({ ...c, image: !c.image }))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "setting-row" }, /* @__PURE__ */ React.createElement("div", { className: "label" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, "phase de lune et saison"), /* @__PURE__ */ React.createElement("div", { className: "desc" }, "aide la vo\xFBte \xE0 lire les rythmes collectifs.")), /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "toggle " + (consent.moon ? "on" : ""),
      onClick: () => setConsent((c) => ({ ...c, moon: !c.moon }))
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "setting-row" }, /* @__PURE__ */ React.createElement("div", { className: "label" }, /* @__PURE__ */ React.createElement("div", { className: "title" }, "r\xE9gion large (continent)"), /* @__PURE__ */ React.createElement("div", { className: "desc" }, "jamais de ville, jamais de pays. continent seulement.")), /* @__PURE__ */ React.createElement(
    "span",
    {
      className: "toggle " + (consent.region ? "on" : ""),
      onClick: () => setConsent((c) => ({ ...c, region: !c.region }))
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "meta op-70 mt-l mb-l", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "tu peux retirer ce r\xEAve de la vo\xFBte \xE0 tout moment. il dispara\xEEt en 48h."), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setStep(0) }, "\u2190 retour"), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => {
    onOffer == null ? void 0 : onOffer(consent);
    setStep(2);
  } }, "offrir"))), step === 2 && /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { padding: "var(--s-5) 0" } }, /* @__PURE__ */ React.createElement("div", { className: "breath mb-l", style: { width: 80, height: 80 } }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mb-s", style: { maxWidth: 420, margin: "0 auto" } }, "le r\xEAve a rejoint la vo\xFBte."), /* @__PURE__ */ React.createElement("div", { className: "meta op-70 mt-m", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "il est tenu par les lunes. tu seras notifi\xE9e si son image en rencontre d'autres."), /* @__PURE__ */ React.createElement("button", { className: "btn-text mt-xl", onClick: onClose }, "refermer"))));
};
const OffreKairosScreen = ({ go }) => {
  const [open, setOpen] = uAS(true);
  const entry = (window.seedEntries || [])[0];
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-warm)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("kairos"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { opacity: open ? 0.3 : 1, transition: "opacity var(--tempo-tisse)" } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "d\xE9tail \xB7 ", entry == null ? void 0 : entry.when), /* @__PURE__ */ React.createElement("p", { className: "h3-lecture", style: { fontSize: 25, textWrap: "pretty", maxWidth: 600 } }, entry == null ? void 0 : entry.text)), open && /* @__PURE__ */ React.createElement(
    OffreKairosSheet,
    {
      entry,
      onClose: () => setOpen(false),
      onOffer: () => {
      }
    }
  ), !open && /* @__PURE__ */ React.createElement("div", { className: "frame", style: { paddingTop: 0 } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setOpen(true) }, "rouvrir l'offre")), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const ANIMA_SECTION_IDS = {
  voute: "anima-section-voute",
  meteo: "anima-section-meteo",
  annales: "anima-section-annales",
  polyphonie: "anima-section-polyphonie"
};
const AnimaSectionDivider = ({ label }) => /* @__PURE__ */ React.createElement("div", { style: {
  margin: "var(--s-7) auto var(--s-6)",
  maxWidth: 600,
  display: "flex",
  alignItems: "center",
  gap: 16
} }, /* @__PURE__ */ React.createElement("span", { style: {
  flex: 1,
  height: 1,
  background: "color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
  opacity: 0.45
} }), /* @__PURE__ */ React.createElement("span", { style: {
  flex: "0 0 auto",
  fontFamily: "var(--mono)",
  fontSize: 10.5,
  color: "var(--ash-light)",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  opacity: 0.6
} }, label), /* @__PURE__ */ React.createElement("span", { style: {
  flex: 1,
  height: 1,
  background: "color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
  opacity: 0.45
} }));
const AnimaUnifiedScreen = ({ go, scrollToSection = null }) => {
  var _a, _b, _c, _d, _e, _f;
  const [voute, setVoute] = uAS(null);
  const [vouteLoading, setVouteLoading] = uAS(true);
  const [meteos, setMeteos] = uAS([]);
  const [meteoLoading, setMeteoLoading] = uAS(true);
  const [corpus, setCorpus] = uAS([]);
  const [annalesLoading, setAnnalesLoading] = uAS(true);
  const [tenuById, setTenuById] = uAS({});
  const [polyphonies, setPolyphonies] = uAS([]);
  const [archive, setArchive] = uAS([]);
  const [polyLoading, setPolyLoading] = uAS(true);
  const [showArchive, setShowArchive] = uAS(false);
  const [polyActiveIdx, setPolyActiveIdx] = uAS(0);
  const seedAnnales = uAM(() => [
    { id: "seed-1", text: "Une grand-m\xE8re inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom.", hold_count: 280, shared_at: null },
    { id: "seed-2", text: "Un enfant-animal que j'ai oubli\xE9 de nourrir depuis des ann\xE9es sort du placard vivant. Pas en col\xE8re. Simplement vivant.", hold_count: 410, shared_at: null },
    { id: "seed-3", text: "Je traverse un pont qu'on n'a pas fini de construire. Il se construit sous mes pieds \u2014 mais seulement si je continue.", hold_count: 180, shared_at: null }
  ], []);
  uAE(() => {
    let cancelled = false;
    Promise.all([
      window.DreamAPI.getVoute().catch(() => null),
      window.DreamAPI.getMeteo({ limit: 4 }).catch(() => null),
      window.DreamAPI.getAnnales().catch(() => null),
      window.DreamAPI.getPolyphonie({ limit: 1 }).catch(() => null),
      window.DreamAPI.getPolyphonieArchive ? window.DreamAPI.getPolyphonieArchive().catch(() => null) : Promise.resolve(null)
    ]).then(([vData, mData, aData, pData, paData]) => {
      if (cancelled) return;
      setVoute(vData);
      setVouteLoading(false);
      setMeteos((mData == null ? void 0 : mData.meteos) || []);
      setMeteoLoading(false);
      const live = ((aData == null ? void 0 : aData.circulating) || []).map((a) => ({
        id: a.id,
        text: a.curated_text,
        hold_count: a.hold_count || 0,
        shared_at: a.shared_at
      }));
      setCorpus(live.length > 0 ? live : seedAnnales);
      setAnnalesLoading(false);
      setPolyphonies((pData == null ? void 0 : pData.polyphonies) || []);
      setArchive((paData == null ? void 0 : paData.polyphonies) || []);
      setPolyLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [seedAnnales]);
  uAE(() => {
    if (!scrollToSection) return;
    const id = ANIMA_SECTION_IDS[scrollToSection];
    if (!id) return;
    setTimeout(() => {
      try {
        const el = document.getElementById(id);
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch (e) {
      }
    }, 600);
  }, [scrollToSection]);
  const rawCount = ((_a = voute == null ? void 0 : voute.meteo) == null ? void 0 : _a.k_count) || (voute == null ? void 0 : voute.meteo_optin_count) || null;
  const humaneCount = roundHumane(rawCount);
  const density = uAM(() => {
    if (!rawCount || rawCount < 50) return 60;
    return Math.min(140, 50 + Math.round(rawCount / 600));
  }, [rawCount]);
  const latestMeteo = meteos[0];
  const poetic = (latestMeteo == null ? void 0 : latestMeteo.poetic_phrase) || (latestMeteo == null ? void 0 : latestMeteo.headline) || (((_b = latestMeteo == null ? void 0 : latestMeteo.top_motifs) == null ? void 0 : _b.length) ? composeMeteoPhrase(latestMeteo.top_motifs[0]) : "Cette lune, l'humanit\xE9 a r\xEAv\xE9 d'eau. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit.");
  const mainMotif = ((_d = (_c = latestMeteo == null ? void 0 : latestMeteo.top_motifs) == null ? void 0 : _c[0]) == null ? void 0 : _d.motif) || ((_f = (_e = latestMeteo == null ? void 0 : latestMeteo.top_motifs) == null ? void 0 : _e[0]) == null ? void 0 : _f.label) || "eau";
  const matterKind = motifToMatter(mainMotif);
  const clouds = composeClouds(latestMeteo);
  const displayAnnales = uAM(() => {
    const today = /* @__PURE__ */ new Date();
    const seedDay = today.getFullYear() * 1e3 + Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (24 * 3600 * 1e3)
    );
    return shuffleSeeded(corpus, seedDay).slice(0, 5);
  }, [corpus]);
  const tenir = async (id) => {
    if (tenuById[id]) return;
    setTenuById((t) => ({ ...t, [id]: true }));
    try {
      await window.DreamAPI.tenirAnnale(id);
    } catch (e) {
    }
  };
  const polyPool = uAM(() => {
    const current = polyphonies[0];
    const map = /* @__PURE__ */ new Map();
    if (current) map.set(current.id, current);
    archive.forEach((p) => {
      if (!map.has(p.id)) map.set(p.id, p);
    });
    return Array.from(map.values());
  }, [polyphonies, archive]);
  const polyActive = polyPool[polyActiveIdx] || polyphonies[0] || null;
  const lunarLabel = (polyActive == null ? void 0 : polyActive.lunar_phase) || "lecture longue";
  const voices = (polyActive == null ? void 0 : polyActive.voices_mobilisees) || [];
  const fmtMonth = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };
  const polyFallback = `Plusieurs ont r\xEAv\xE9 d'eau cette lune. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit, d'estuaires qui se forment. Et plusieurs ont \xE9crit des doutes sur leur travail, sur ce qu'il faut tenir et ce qu'il faut l\xE2cher.

\xC0 la lumi\xE8re de Bachelard, on pourrait entendre dans ces eaux cherchant leur lit la m\xEAme chose que dans ces questions de seuil : une fluidit\xE9 qui demande \xE0 se poser quelque part, sans encore savoir o\xF9.

Aizenstat aurait invit\xE9 \xE0 tenir la grand-m\xE8re qui revient \u2014 plusieurs l'ont vue cette lune, dans des cuisines sans feu, avec du linge \xE0 laver.

Que se cherche-t-elle, l'eau qui cherche son lit ?`;
  const polyText = (polyActive == null ? void 0 : polyActive.narrative_text) || polyFallback;
  const polyParagraphs = polyText.split(/\n\n+/).filter(Boolean);
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "transparent", position: "relative" } }, /* @__PURE__ */ React.createElement(ChamberBackground, { intensity: 0.85 }), window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: 30,
    left: "50%",
    transform: "translateX(-50%)",
    width: "90vw",
    maxWidth: 800,
    height: 360,
    opacity: 0.4,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), window.GeoSymbol && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.12,
    pointerEvents: "none",
    zIndex: 0,
    animation: "drift-derive 12s linear infinite alternate"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: "songlines",
      color: "silk",
      style: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(window.TopNav, null), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { paddingBottom: 140, maxWidth: 720, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("section", { id: ANIMA_SECTION_IDS.voute }, /* @__PURE__ */ React.createElement("div", { className: "text-center", style: {
    marginTop: "var(--s-4)",
    marginBottom: "var(--s-4)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15.5,
    color: "var(--ash-light)",
    letterSpacing: "0.01em",
    textWrap: "pretty",
    opacity: vouteLoading ? 0 : 0.9,
    transition: "opacity 1200ms var(--ease-respire)"
  } }, humaneCount ? /* @__PURE__ */ React.createElement(React.Fragment, null, "Cette lune, l'humanit\xE9 a tiss\xE9 environ ", frNumber(humaneCount), " moments.") : /* @__PURE__ */ React.createElement(React.Fragment, null, "Cette lune, des voix se rassemblent dans la nuit.")), /* @__PURE__ */ React.createElement(ConstellationBreathing, { density }), /* @__PURE__ */ React.createElement("div", { className: "text-center", style: {
    marginTop: "var(--s-3)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    letterSpacing: "0.18em",
    textTransform: "lowercase",
    opacity: 0.55
  } }, "anima mundi")), /* @__PURE__ */ React.createElement(AnimaSectionDivider, { label: "m\xE9t\xE9o" }), /* @__PURE__ */ React.createElement("section", { id: ANIMA_SECTION_IDS.meteo }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    lineHeight: 1.55,
    color: "var(--bone)",
    maxWidth: 600,
    textWrap: "pretty",
    margin: "0 0 var(--s-5) 0",
    opacity: meteoLoading ? 0.4 : 1,
    transition: "opacity 920ms var(--ease-respire)"
  } }, meteoLoading ? "la m\xE9t\xE9o se compose\u2026" : poetic), /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { marginBottom: "var(--s-5)" } }, /* @__PURE__ */ React.createElement(MatterGlyph, { kind: matterKind }), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 12,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    letterSpacing: "0.05em"
  } }, mainMotif)), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 18 } }, clouds.slice(0, 5).map((t, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.55,
    color: "var(--bone)",
    margin: 0,
    textWrap: "pretty",
    maxWidth: 600,
    opacity: 0.9
  } }, t)))), /* @__PURE__ */ React.createElement(AnimaSectionDivider, { label: "tenu ensemble" }), /* @__PURE__ */ React.createElement("section", { id: ANIMA_SECTION_IDS.annales }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 1.55,
    color: "var(--ash-light)",
    maxWidth: 580,
    textWrap: "pretty",
    margin: "0 0 var(--s-5) 0"
  } }, "Ces r\xEAves ont \xE9t\xE9 offerts \xE0 la vo\xFBte commune. Nous les tenons \u2014 non pour les comprendre, mais parce qu'ils nous regardent."), annalesLoading && corpus.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    opacity: 0.6,
    padding: "var(--s-5) 0"
  } }, "les annales se rassemblent\u2026") : /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 24 } }, displayAnnales.map((d) => /* @__PURE__ */ React.createElement(
    AnnaleCard,
    {
      key: d.id,
      annale: d,
      tenu: !!tenuById[d.id],
      onTenir: () => tenir(d.id)
    }
  )))), /* @__PURE__ */ React.createElement(AnimaSectionDivider, { label: "polyphonie de la lune" }), /* @__PURE__ */ React.createElement("section", { id: ANIMA_SECTION_IDS.polyphonie }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    marginBottom: "var(--s-4)",
    opacity: 0.85
  } }, polyActiveIdx === 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, "\xB7 ", lunarLabel) : /* @__PURE__ */ React.createElement(React.Fragment, null, "\xB7 lecture pr\xE9c\xE9dente \xB7 ", fmtMonth(polyActive == null ? void 0 : polyActive.period_end))), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontSize: 18,
    lineHeight: 1.75,
    color: "var(--bone)",
    maxWidth: 600,
    textAlign: "justify",
    textWrap: "pretty"
  } }, polyLoading ? window.PolyphonieLetterSkeleton ? /* @__PURE__ */ React.createElement(window.PolyphonieLetterSkeleton, null) : /* @__PURE__ */ React.createElement("p", { style: { fontStyle: "italic", opacity: 0.5 } }, "la polyphonie s'\xE9crit\u2026") : polyParagraphs.map((para, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: { margin: "0 0 1.4em 0", textWrap: "pretty" } }, para))), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: "var(--s-5)",
    paddingTop: "var(--s-3)",
    borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    opacity: 0.85,
    textWrap: "pretty"
  } }, "voix mobilis\xE9es cette lune \xB7", " ", voices.length > 0 ? voices.join(", ") : "Aizenstat, Moss, Bachelard"), polyPool.length > 1 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "var(--s-5)" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowArchive((s) => !s),
      style: {
        background: "transparent",
        border: "none",
        color: "var(--ash-light)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        cursor: "pointer",
        padding: "8px 0",
        letterSpacing: "0.02em",
        textDecoration: "underline",
        textDecorationColor: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
        textUnderlineOffset: 6
      }
    },
    showArchive ? "refermer les lectures pr\xE9c\xE9dentes" : "lectures pr\xE9c\xE9dentes"
  ), showArchive && /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 6, marginTop: "var(--s-4)" } }, polyPool.map((p, i) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.id || i,
      onClick: () => {
        setPolyActiveIdx(i);
      },
      style: {
        background: i === polyActiveIdx ? "color-mix(in oklch, var(--silk-gold) 8%, transparent)" : "transparent",
        border: "1px solid " + (i === polyActiveIdx ? "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))" : "var(--ash-deep)"),
        color: i === polyActiveIdx ? "var(--bone)" : "var(--ash-light)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        padding: "10px 14px",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 380ms var(--ease-respire)"
      }
    },
    i === 0 ? "lune actuelle" : p.lunar_phase || fmtMonth(p.period_end) || "lecture pr\xE9c\xE9dente"
  ))))))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
function PolyphonieLetterSkeleton() {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const messages = [
    "la polyphonie s'\xE9crit\u2026",
    "les voix se cherchent\u2026",
    "tisser la lune\u2026"
  ];
  const message = useRotating ? useRotating(messages, 2400) : messages[0];
  if (!Shim || !Halo) {
    return /* @__PURE__ */ React.createElement("p", { style: { fontStyle: "italic", opacity: 0.5 } }, message);
  }
  return /* @__PURE__ */ React.createElement("div", { className: "dream-skeleton-fade-in", style: {
    display: "flex",
    flexDirection: "column",
    gap: 18
  } }, [5, 4, 4].map((lines, p) => /* @__PURE__ */ React.createElement(Shim, { key: p, lines, height: 13, gap: 11, dark: true, lastLineWidth: p === 2 ? "45%" : "82%" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", paddingTop: 8 } }, /* @__PURE__ */ React.createElement(Halo, { size: 26, message, dark: true })));
}
window.PolyphonieLetterSkeleton = PolyphonieLetterSkeleton;
const AnnalesScreen = AnimaAnnalesScreen;
Object.assign(window, {
  // 4 chambres canoniques (gardées pour compat / fallback)
  AnimaVouteScreen,
  AnimaMeteoScreen,
  AnimaAnnalesScreen,
  AnimaPolyphonieScreen,
  // 2026-04-26 — B+D : 1 écran scrollable cascade (Design §11.bis.5)
  AnimaUnifiedScreen,
  // legacy / compat
  AnnalesScreen,
  OffreKairosScreen,
  OffreKairosSheet
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1hbmltYS5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCAqL1xuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBBbmltYSBNdW5kaSBcdTIwMTQgU2FuY3R1YWlyZSBcdTAwRTAgNCBjaGFtYnJlcyBzXHUwMEU5cGFyXHUwMEU5ZXNcbi8vIDIwMjYtMDQtMjUgXHUyMDE0IFllc2h1YSAoT3B1cyA0LjcgMU0sIGF1dG9ub21lKVxuLy9cbi8vIFJlZm9udGUgQmlibGUgXHUwMEE3My42ICsgRGVzaWduIFx1MDBBNzcuOCA6IG9uIHF1aXR0ZSBsZSBwYXR0ZXJuIFwiVm9cdTAwRkJ0ZSA9IHBvbHlwaG9uaWUrXG4vLyBsaWVuc1wiIHBvdXIgdW5lIGFyY2hpdGVjdHVyZSAxIGh1YiArIDMgY2hhbWJyZXMgcHJvZm9uZGVzLlxuLy9cbi8vICAgMS4gQW5pbWFWb3V0ZVNjcmVlbiAgICAgIFx1MjAxNCBMYSBWb1x1MDBGQnRlIChodWIsIGNvbnRlbXBsYXRpZiwgMyBjYXJ0ZXMpXG4vLyAgIDIuIEFuaW1hTWV0ZW9TY3JlZW4gICAgICBcdTIwMTQgTGUgdGVtcHMgcXUnaWwgZmFpdCBkYW5zIGxhIG51aXRcbi8vICAgMy4gQW5pbWFBbm5hbGVzU2NyZWVuICAgIFx1MjAxNCBUZW51IGVuc2VtYmxlIChCaWcgRHJlYW1zIGVuIGNpcmN1bGF0aW9uKVxuLy8gICA0LiBBbmltYVBvbHlwaG9uaWVTY3JlZW4gXHUyMDE0IFBvbHlwaG9uaWUgZGUgbGEgbHVuZSAodGV4dGUgMjAwLTUwMCBtb3RzKVxuLy9cbi8vIERpc2NpcGxpbmUgOiBhdWN1biBiYWRnZSwgYXVjdW4gXCJub3V2ZWF1XCIsIGF1Y3VuIGNhbGwtdG8tYWN0aW9uLlxuLy8gVm9jYWJ1bGFpcmUgZFx1MDBFOXNlbnNvcmNlbFx1MDBFOSA6IFwidGVuaXJcIiBwYXMgXCJ2b3RlclwiLCBcIm9mZmVydFwiIHBhcyBcInBvc3RcdTAwRTlcIixcbi8vIGNoaWZmcmVzIGFycm9uZGlzIChcImVudmlyb24gNDcgMDAwXCIpIHBhcyBcIjQ3IDIzNCBkXHUwMEU5cFx1MDBGNHRzXCIuXG4vLyBMYXRlbmNlIHJpdHVlbGxlIFx1MjI2NSAxNCBqIHN1ciBsYSBtXHUwMEU5dFx1MDBFOW8uIFBvbHlwaG9uaWUgMVx1MDBENyBwYXIgbHVuZS5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiB1QVMsIHVzZUVmZmVjdDogdUFFLCB1c2VNZW1vOiB1QU0sIHVzZVJlZjogdUFSIH0gPSBSZWFjdDtcblxuLy8gXHUyNTAwXHUyNTAwIEhlbHBlcnMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5mdW5jdGlvbiByb3VuZEh1bWFuZShuKSB7XG4gIGlmICghbiB8fCBuIDwgNTApIHJldHVybiBudWxsO1xuICBpZiAobiA8IDEwMDApIHJldHVybiBNYXRoLnJvdW5kKG4gLyA1MCkgKiA1MDtcbiAgaWYgKG4gPCAxMDAwMCkgcmV0dXJuIE1hdGgucm91bmQobiAvIDUwMCkgKiA1MDA7XG4gIGlmIChuIDwgMTAwMDAwKSByZXR1cm4gTWF0aC5yb3VuZChuIC8gMTAwMCkgKiAxMDAwO1xuICByZXR1cm4gTWF0aC5yb3VuZChuIC8gMTAwMDApICogMTAwMDA7XG59XG5cbmZ1bmN0aW9uIGZyTnVtYmVyKG4pIHtcbiAgaWYgKG4gPT0gbnVsbCkgcmV0dXJuIFwiXCI7XG4gIHJldHVybiBuLnRvTG9jYWxlU3RyaW5nKFwiZnItRlJcIikucmVwbGFjZSgvXFx1MjAyZnxcXHUwMGEwL2csIFwiIFwiKTtcbn1cblxuLy8gXCJ0ZW51IHBhciB+MzAwXCIgXHUyMDE0IHRvdWpvdXJzIGFycm9uZGksIGphbWFpcyBleGFjdFxuZnVuY3Rpb24gaG9sZFJvdW5kZWQobikge1xuICBpZiAoIW4gfHwgbiA8IDEpIHJldHVybiAwO1xuICBpZiAobiA8IDMwKSByZXR1cm4gTWF0aC5tYXgoMTAsIE1hdGgucm91bmQobiAvIDEwKSAqIDEwKTtcbiAgaWYgKG4gPCAzMDApIHJldHVybiBNYXRoLnJvdW5kKG4gLyA1MCkgKiA1MDtcbiAgaWYgKG4gPCAzMDAwKSByZXR1cm4gTWF0aC5yb3VuZChuIC8gMTAwKSAqIDEwMDtcbiAgcmV0dXJuIE1hdGgucm91bmQobiAvIDUwMCkgKiA1MDA7XG59XG5cbi8vIFNodWZmbGUgKGFudGktY2xhc3NlbWVudCkgXHUyMDE0IGRcdTAwRTl0ZXJtaW5pc3RlIHBhciBzZWVkIChpbmRleCBsdW5lKSBwb3VyXG4vLyBcdTAwRTl2aXRlciBxdWUgbGEgbGlzdGUgc2F1dGUgXHUwMEUwIGNoYXF1ZSByZS1yZW5kZXIgbWFpcyBjaGFuZ2UgY2hhcXVlIGx1bmUuXG5mdW5jdGlvbiBzaHVmZmxlU2VlZGVkKGFyciwgc2VlZCA9IDEpIHtcbiAgY29uc3QgYSA9IGFyci5zbGljZSgpO1xuICBsZXQgcyA9IHNlZWQgKiA5MzAxICsgNDkyOTc7XG4gIGZvciAobGV0IGkgPSBhLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICBzID0gKHMgKiA5MzAxICsgNDkyOTcpICUgMjMzMjgwO1xuICAgIGNvbnN0IGogPSBNYXRoLmZsb29yKChzIC8gMjMzMjgwKSAqIChpICsgMSkpO1xuICAgIFthW2ldLCBhW2pdXSA9IFthW2pdLCBhW2ldXTtcbiAgfVxuICByZXR1cm4gYTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJhY2tncm91bmQgY29tbXVuIGF1eCBjaGFtYnJlcyA6IG5pZ2h0LWZsb29yICsgbWF0dGVyIHdhdGVyIGxlbnRlIFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gQ2hhbWJlckJhY2tncm91bmQoeyBpbnRlbnNpdHkgPSAwLjUgfSkge1xuICByZXR1cm4gKFxuICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIGluc2V0OiAwLCB6SW5kZXg6IDAsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIixcbiAgICB9fT5cbiAgICAgIHsvKiBDYXVzdGljcyB3YXRlciBcdTIwMTQgdHJcdTAwRThzIGxlbnRlcyAoNjBzL2N5Y2xlKSwgb3BhY2l0XHUwMEU5IGJhc3NlICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCxcbiAgICAgICAgb3BhY2l0eTogMC4xMCAqIGludGVuc2l0eSxcbiAgICAgICAgYW5pbWF0aW9uOiBcImFuaW1hLXdhdGVyLWRyaWZ0IDYwcyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICBtaXhCbGVuZE1vZGU6IFwic2NyZWVuXCIsXG4gICAgICB9fT5cbiAgICAgICAgPHN2ZyB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIiBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIgfX0+XG4gICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZpbHRlcj1cInVybCgjbm9pc2Utd2F0ZXIpXCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBIYWxvIHZpb2xldCBwcm9mb25kIGJhcyAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgbGVmdDogMCwgcmlnaHQ6IDAsIGJvdHRvbTogMCwgaGVpZ2h0OiBcIjU1JVwiLFxuICAgICAgICBiYWNrZ3JvdW5kOiBcInJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IDUwJSAxMDAlLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW9ic2lkaWFuKSA1NSUsIHRyYW5zcGFyZW50KSwgdHJhbnNwYXJlbnQgNzAlKVwiLFxuICAgICAgICBvcGFjaXR5OiAwLjcsXG4gICAgICB9fSAvPlxuICAgICAgey8qIEhhbG8gbmF2eSBjZW50cmUgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLFxuICAgICAgICBiYWNrZ3JvdW5kOiBcInJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IDUwJSAzNSUsIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc3RvbmUtY29vbCkgMjIlLCB0cmFuc3BhcmVudCksIHRyYW5zcGFyZW50IDY1JSlcIixcbiAgICAgICAgb3BhY2l0eTogMC41NSxcbiAgICAgIH19IC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDb25zdGVsbGF0aW9uIHJlc3BpcmFudGUgKGZvbmQgY29udGVtcGxhdGlmLCAwIGludGVyYWN0aW9uKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERlbnNpdFx1MDBFOSA9IHZvbHVtZSBrYWlyb3MgZFx1MDBFOXBvc1x1MDBFOXMgY2VzIDI4IGogKGFycm9uZGkgaHVtYW5pc1x1MDBFOSkuXG5mdW5jdGlvbiBDb25zdGVsbGF0aW9uQnJlYXRoaW5nKHsgZGVuc2l0eSA9IDgwIH0pIHtcbiAgY29uc3QgW3RpY2ssIHNldFRpY2tdID0gdUFTKDApO1xuICB1QUUoKCkgPT4ge1xuICAgIGxldCByYWY7XG4gICAgbGV0IGxhc3QgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICBjb25zdCBsb29wID0gKG5vdykgPT4ge1xuICAgICAgLy8gUmVzcGlyYXRpb24gNSBzIGluIC8gNSBzIG91dCBcdTIxOTIgdGljayBhZHZhbmNlIGxlbnRcbiAgICAgIGNvbnN0IGR0ID0gbm93IC0gbGFzdDtcbiAgICAgIGxhc3QgPSBub3c7XG4gICAgICBzZXRUaWNrKHQgPT4gdCArIGR0IC8gMTAwMCk7XG4gICAgICByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfTtcbiAgICByYWYgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgcmV0dXJuICgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gIH0sIFtdKTtcblxuICBjb25zdCBwb2ludHMgPSB1QU0oKCkgPT4ge1xuICAgIC8vIERlbnNpdFx1MDBFOSBib3JuXHUwMEU5ZSBwb3VyIFx1MDBFOXZpdGVyIHNhdHVyYXRpb24gdmlzdWVsbGUgKHNhbmN0dWFpcmUgcGFzIGRhc2hib2FyZClcbiAgICBjb25zdCBOID0gTWF0aC5tYXgoNDAsIE1hdGgubWluKDE0MCwgTWF0aC5yb3VuZChkZW5zaXR5KSkpO1xuICAgIGNvbnN0IGFyciA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgTjsgaSsrKSB7XG4gICAgICAvLyBEaXN0cmlidXRpb24gcHNldWRvLWFsXHUwMEU5YXRvaXJlIChnb2xkZW4gcmF0aW8pIFx1MjAxNCBwbHVzIG9yZ2FuaXF1ZSBxdSd1bmUgZ3JpbGxlXG4gICAgICBjb25zdCB0ID0gaSAvIE47XG4gICAgICBjb25zdCBhbmdsZSA9IGkgKiAyLjM5OTk2OyAvLyBnb2xkZW4gYW5nbGVcbiAgICAgIGNvbnN0IHIgPSBNYXRoLnNxcnQodCkgKiA0NDtcbiAgICAgIGNvbnN0IGN4ID0gNTAgKyBNYXRoLmNvcyhhbmdsZSkgKiByO1xuICAgICAgY29uc3QgY3kgPSA1MCArIE1hdGguc2luKGFuZ2xlKSAqIHIgKiAwLjYyOyAvLyBcdTAwRTljcmFzZW1lbnQgdmVydGljYWxcbiAgICAgIGNvbnN0IHBoYXNlID0gKGkgKiAwLjMxNykgJSAoTWF0aC5QSSAqIDIpO1xuICAgICAgY29uc3Qgc2l6ZSA9IDAuMzUgKyAoKGkgKiAxMykgJSA5KSAvIDE0O1xuICAgICAgLy8gMSBzdXIgMjggPSBcInBvaW50ZSBhcmdlbnQgcmFyZVwiIChzaWxrLWdvbGQpLCAxIHN1ciAxMSA9IHN0b25lLWNvb2wsIHNpbm9uIGJvbmVcbiAgICAgIGNvbnN0IGtpbmQgPSBpICUgMjggPT09IDAgPyBcImdvbGRcIiA6IGkgJSAxMSA9PT0gMCA/IFwiY29vbFwiIDogXCJib25lXCI7XG4gICAgICBhcnIucHVzaCh7IGN4LCBjeSwgcGhhc2UsIHNpemUsIGtpbmQgfSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH0sIFtkZW5zaXR5XSk7XG5cbiAgLy8gQ3ljbGUgcmVzcGlyYXRpb24gMTBzICg1IGluIC8gNSBvdXQpXG4gIGNvbnN0IGJyZWF0aCA9IChNYXRoLnNpbigodGljayAvIDEwKSAqIE1hdGguUEkgKiAyKSArIDEpIC8gMjtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYW5pbWEtY29uc3RlbGxhdGlvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogMzIwLFxuICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICB9fT5cbiAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxMDAgMTAwXCIgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWlkWU1pZCBtZWV0XCIgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiIH19PlxuICAgICAgICB7cG9pbnRzLm1hcCgocCwgaSkgPT4ge1xuICAgICAgICAgIC8vIExcdTAwRTlnXHUwMEU4cmUgZFx1MDBFOXN5bmNocm9uaXNhdGlvbiBwYXIgcG9pbnQgcG91ciBcdTAwRTl2aXRlciBcInRvdXQgcHVsc2UgXHUwMEUwIGwndW5pc3NvblwiXG4gICAgICAgICAgY29uc3QgbG9jYWwgPSAoTWF0aC5zaW4oKHRpY2sgLyAxMCkgKiBNYXRoLlBJICogMiArIHAucGhhc2UgKiAwLjMpICsgMSkgLyAyO1xuICAgICAgICAgIGNvbnN0IGEgPSAwLjE1ICsgbG9jYWwgKiAwLjU1O1xuICAgICAgICAgIGNvbnN0IHIgPSBwLnNpemUgKiAoMC43ICsgYnJlYXRoICogMC40KTtcbiAgICAgICAgICBjb25zdCBmaWxsID0gcC5raW5kID09PSBcImdvbGRcIlxuICAgICAgICAgICAgPyBcInZhcigtLXNpbGstZ29sZClcIlxuICAgICAgICAgICAgOiBwLmtpbmQgPT09IFwiY29vbFwiXG4gICAgICAgICAgICAgID8gXCJ2YXIoLS1zdG9uZS1jb29sKVwiXG4gICAgICAgICAgICAgIDogXCJ2YXIoLS1ib25lKVwiO1xuICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e3AuY3h9IGN5PXtwLmN5fSByPXtyfSBmaWxsPXtmaWxsfSBvcGFjaXR5PXthfSAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDSEFNQlJFIDEgXHUyMDE0IExhIFZvXHUwMEZCdGUgKGh1YiBkJ2FjY3VlaWwgY29udGVtcGxhdGlmKVxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBBbmltYVZvdXRlU2NyZWVuID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbdm91dGUsIHNldFZvdXRlXSA9IHVBUyhudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdUFTKHRydWUpO1xuXG4gIHVBRSgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5EcmVhbUFQSS5nZXRWb3V0ZSgpLnRoZW4oZCA9PiB7XG4gICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICBzZXRWb3V0ZShkKTtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH0pLmNhdGNoKCgpID0+IHNldExvYWRpbmcoZmFsc2UpKTtcbiAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICB9LCBbXSk7XG5cbiAgLy8gVm9sdW1lIGthaXJvcyBhcnJvbmRpIChjZXMgMjggailcbiAgY29uc3QgcmF3Q291bnQgPSB2b3V0ZT8ubWV0ZW8/LmtfY291bnRcbiAgICB8fCB2b3V0ZT8ubWV0ZW9fb3B0aW5fY291bnRcbiAgICB8fCBudWxsO1xuICBjb25zdCBodW1hbmVDb3VudCA9IHJvdW5kSHVtYW5lKHJhd0NvdW50KTtcblxuICAvLyBEZW5zaXRcdTAwRTkgY29uc3RlbGxhdGlvbiA6IHByb3BvcnRpb25uZWxsZSBhdSB2b2x1bWUsIGJvcm5cdTAwRTllXG4gIGNvbnN0IGRlbnNpdHkgPSB1QU0oKCkgPT4ge1xuICAgIGlmICghcmF3Q291bnQgfHwgcmF3Q291bnQgPCA1MCkgcmV0dXJuIDYwO1xuICAgIHJldHVybiBNYXRoLm1pbigxNDAsIDUwICsgTWF0aC5yb3VuZChyYXdDb3VudCAvIDYwMCkpO1xuICB9LCBbcmF3Q291bnRdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH19PlxuICAgICAgPENoYW1iZXJCYWNrZ3JvdW5kIGludGVuc2l0eT17MX0gLz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICA8d2luZG93LlRvcE5hdiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgcGFkZGluZ0JvdHRvbTogMTIwIH19PlxuICAgICAgICAgIHsvKiBDaGlmZnJlIGFycm9uZGkgaGF1dCBcdTIwMTQgc29icmUsIEVCIEdhcmFtb25kIGl0YWxpYywgamFtYWlzIGVuIGdyYXMgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy00KVwiLCBtYXJnaW5Cb3R0b206IFwidmFyKC0tcy00KVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE1LjUsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgb3BhY2l0eTogbG9hZGluZyA/IDAgOiAwLjg1LFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDEyMDBtcyB2YXIoLS1lYXNlLXJlc3BpcmUpXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7aHVtYW5lQ291bnRcbiAgICAgICAgICAgICAgPyA8PkNldHRlIGx1bmUsIGwnaHVtYW5pdFx1MDBFOSBhIHJcdTAwRUF2XHUwMEU5IGVudmlyb24ge2ZyTnVtYmVyKGh1bWFuZUNvdW50KX0gZm9pcy48Lz5cbiAgICAgICAgICAgICAgOiA8PkNldHRlIGx1bmUsIGRlcyB2b2l4IHNlIHJhc3NlbWJsZW50IGRhbnMgbGEgbnVpdC48Lz59XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogQ29uc3RlbGxhdGlvbiByZXNwaXJhbnRlIGNlbnRyYWxlIChmb25kIGNvbnRlbXBsYXRpZiwgMCB0YXApICovfVxuICAgICAgICAgIDxDb25zdGVsbGF0aW9uQnJlYXRoaW5nIGRlbnNpdHk9e2RlbnNpdHl9IC8+XG5cbiAgICAgICAgICB7LyogVGl0cmUgc2FuY3R1YWlyZSBcdTIwMTQgZGlzY3JldCwgcHJlc3F1ZSBlZmZhY1x1MDBFOSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDogXCJ2YXIoLS1zLTQpXCIsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTYpXCIsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMTMsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xOGVtXCIsIHRleHRUcmFuc2Zvcm06IFwibG93ZXJjYXNlXCIsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBhbmltYSBtdW5kaVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIDMgY2hhbWJyZXMgXHUyMDE0IGNhcmRzIGVzcGFjXHUwMEU5ZXMsIHJlc3BpcmFudGVzICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2tcIiBzdHlsZT17eyBnYXA6IDI4IH19PlxuICAgICAgICAgICAgPENoYW1iZXJDYXJkXG4gICAgICAgICAgICAgIHRpdGxlPVwiTGUgdGVtcHMgcXUnaWwgZmFpdCBkYW5zIGxhIG51aXRcIlxuICAgICAgICAgICAgICBoaW50PVwibVx1MDBFOXRcdTAwRTlvXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJhbmltYS1tZXRlb1wiKX1cbiAgICAgICAgICAgICAgYnJlYXRoRGVsYXk9ezB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENoYW1iZXJDYXJkXG4gICAgICAgICAgICAgIHRpdGxlPVwiVGVudSBlbnNlbWJsZVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJhbm5hbGVzXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJhbmltYS1hbm5hbGVzXCIpfVxuICAgICAgICAgICAgICBicmVhdGhEZWxheT17MS42fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDaGFtYmVyQ2FyZFxuICAgICAgICAgICAgICB0aXRsZT1cIlBvbHlwaG9uaWUgZGUgbGEgbHVuZVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJsZWN0dXJlIGxvbmd1ZVwiXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKFwiYW5pbWEtcG9seXBob25pZVwiKX1cbiAgICAgICAgICAgICAgYnJlYXRoRGVsYXk9ezMuMn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7d2luZG93LkZlZWRiYWNrRmxvYXQgJiYgPHdpbmRvdy5GZWVkYmFja0Zsb2F0IC8+fVxuXG4gICAgICA8c3R5bGU+e2BcbiAgICAgICAgQGtleWZyYW1lcyBhbmltYS13YXRlci1kcmlmdCB7XG4gICAgICAgICAgMCUsIDEwMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKC0xLjUlLCAtMSUsIDApIHNjYWxlKDEuMDQpOyB9XG4gICAgICAgICAgNTAlICAgICAgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDEuNSUsIDElLCAwKSBzY2FsZSgxLjA2KTsgfVxuICAgICAgICB9XG4gICAgICAgIEBrZXlmcmFtZXMgYW5pbWEtY2FyZC1icmVhdGhlIHtcbiAgICAgICAgICAwJSwgMTAwJSB7IGJveC1zaGFkb3c6IDAgMCAyNHB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYm9uZSkgMyUsIHRyYW5zcGFyZW50KTsgfVxuICAgICAgICAgIDUwJSAgICAgIHsgYm94LXNoYWRvdzogMCAwIDQycHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDklLCB0cmFuc3BhcmVudCk7IH1cbiAgICAgICAgfVxuICAgICAgICAuYW5pbWEtY2hhbWJlci1jYXJkIHtcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4IDI4cHg7XG4gICAgICAgICAgYmFja2dyb3VuZDpcbiAgICAgICAgICAgIHJhZGlhbC1ncmFkaWVudChlbGxpcHNlIGF0IDgwJSAyMCUsIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYm9uZSkgMyUsIHRyYW5zcGFyZW50KSwgdHJhbnNwYXJlbnQgNjAlKSxcbiAgICAgICAgICAgIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tb2JzaWRpYW4pIDQ4JSwgdHJhbnNwYXJlbnQpO1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA4JSwgdmFyKC0tYXNoLWRlZXApKTtcbiAgICAgICAgICBjb2xvcjogdmFyKC0tYm9uZSk7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyOyB0ZXh0LWFsaWduOiBsZWZ0O1xuICAgICAgICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciA5MjBtcyB2YXIoLS1lYXNlLXJlc3BpcmUpLFxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybSA5MjBtcyB2YXIoLS1lYXNlLXJlc3BpcmUpLFxuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQgOTIwbXMgdmFyKC0tZWFzZS1yZXNwaXJlKTtcbiAgICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7IG92ZXJmbG93OiBoaWRkZW47XG4gICAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLXNlcmlmKTtcbiAgICAgICAgICBhbmltYXRpb246IGFuaW1hLWNhcmQtYnJlYXRoZSA5cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgICAgICAgfVxuICAgICAgICAuYW5pbWEtY2hhbWJlci1jYXJkOjpiZWZvcmUge1xuICAgICAgICAgIGNvbnRlbnQ6IFwiXCI7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaW5zZXQ6IDA7XG4gICAgICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcjbm9pc2Utc3RvbmUnKTtcbiAgICAgICAgICBvcGFjaXR5OiAwLjMwO1xuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgICB9XG4gICAgICAgIC5hbmltYS1jaGFtYmVyLWNhcmQ6aG92ZXIge1xuICAgICAgICAgIGJvcmRlci1jb2xvcjogY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI4JSwgdmFyKC0tYXNoLW1pZCkpO1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMXB4KTtcbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgQ2hhbWJlckNhcmQgPSAoeyB0aXRsZSwgaGludCwgb25DbGljaywgYnJlYXRoRGVsYXkgPSAwIH0pID0+IChcbiAgPGJ1dHRvbiBjbGFzc05hbWU9XCJhbmltYS1jaGFtYmVyLWNhcmRcIiBvbkNsaWNrPXtvbkNsaWNrfVxuICAgIHN0eWxlPXt7IGFuaW1hdGlvbkRlbGF5OiBgLSR7YnJlYXRoRGVsYXl9c2AgfX0+XG4gICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEgfX0+XG4gICAgICA8aDMgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMjQsIGxpbmVIZWlnaHQ6IDEuMjUsXG4gICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICB9fT57dGl0bGV9PC9oMz5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgbWFyZ2luVG9wOiAxMixcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSxcbiAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMThlbVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICBvcGFjaXR5OiAwLjcsXG4gICAgICB9fT57aGludH08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9idXR0b24+XG4pO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENIQU1CUkUgMiBcdTIwMTQgTGUgdGVtcHMgcXUnaWwgZmFpdCBkYW5zIGxhIG51aXQgKE1cdTAwRTl0XHUwMEU5bylcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgQW5pbWFNZXRlb1NjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW21ldGVvcywgc2V0TWV0ZW9zXSA9IHVBUyhbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVBUyh0cnVlKTtcblxuICB1QUUoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0TWV0ZW8oeyBsaW1pdDogNCB9KS50aGVuKGQgPT4ge1xuICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgc2V0TWV0ZW9zKGQ/Lm1ldGVvcyB8fCBbXSk7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9KS5jYXRjaCgoKSA9PiBzZXRMb2FkaW5nKGZhbHNlKSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGxhdGVzdCA9IG1ldGVvc1swXTtcblxuICAvLyBQaHJhc2UgcHJpbmNpcGFsZSBwb1x1MDBFOXRpcXVlIFx1MjAxNCBwcml2aWxcdTAwRTlnaWUgdW4gdGV4dGUgZ1x1MDBFOW5cdTAwRTlyXHUwMEU5IGNcdTAwRjR0XHUwMEU5IGJhY2tlbmRcbiAgLy8gKGxhdGVzdC5wb2V0aWNfcGhyYXNlIC8gbGF0ZXN0LmhlYWRsaW5lKS4gRmFsbGJhY2sgOiBjb21wb3NlIFx1MDBFMCBwYXJ0aXJcbiAgLy8gZHUgdG9wIG1vdGlmLiBUb3Vqb3VycyBlbiBpbWFnZSwgamFtYWlzIGVuICUuXG4gIGNvbnN0IHBvZXRpYyA9IGxhdGVzdD8ucG9ldGljX3BocmFzZVxuICAgIHx8IGxhdGVzdD8uaGVhZGxpbmVcbiAgICB8fCAobGF0ZXN0Py50b3BfbW90aWZzPy5sZW5ndGhcbiAgICAgICAgPyBjb21wb3NlTWV0ZW9QaHJhc2UobGF0ZXN0LnRvcF9tb3RpZnNbMF0pXG4gICAgICAgIDogXCJDZXR0ZSBsdW5lLCBsJ2h1bWFuaXRcdTAwRTkgYSByXHUwMEVBdlx1MDBFOSBkJ2VhdS4gUGFzIGRlIHRlbXBcdTAwRUF0ZXMgXHUyMDE0IGQnZWF1IHF1aSBzZSBjaGVyY2hlIHVuIGxpdC5cIik7XG5cbiAgLy8gR2x5cGhlIG1hdHRlciBwcmluY2lwYWxcbiAgY29uc3QgbWFpbk1vdGlmID0gbGF0ZXN0Py50b3BfbW90aWZzPy5bMF0/Lm1vdGlmXG4gICAgfHwgbGF0ZXN0Py50b3BfbW90aWZzPy5bMF0/LmxhYmVsXG4gICAgfHwgXCJlYXVcIjtcbiAgY29uc3QgbWF0dGVyS2luZCA9IG1vdGlmVG9NYXR0ZXIobWFpbk1vdGlmKTtcblxuICAvLyAzLTUgbnVhZ2VzIHRoXHUwMEU5bWF0aXF1ZXMgKGVuIGltYWdlKVxuICBjb25zdCBjbG91ZHMgPSBjb21wb3NlQ2xvdWRzKGxhdGVzdCk7XG4gIC8vIFRvdXJudXJlcyBxdWkgbW9udGVudCAoMy01IG1vdGlmcyBlbiBhbXBsaWZpY2F0aW9uKVxuICBjb25zdCB0b3VybnVyZXMgPSBjb21wb3NlVG91cm51cmVzKGxhdGVzdCk7XG4gIC8vIFBvbGFyaXRcdTAwRTlzIHZpdmFudGVzXG4gIGNvbnN0IHBvbGFyaXRpZXMgPSBjb21wb3NlUG9sYXJpdGllcyhsYXRlc3QpO1xuICAvLyBJbml0aWF0aW9ucyBlbiBjb3Vyc1xuICBjb25zdCBpbml0aWF0aW9ucyA9IGNvbXBvc2VJbml0aWF0aW9ucyhsYXRlc3QpO1xuXG4gIC8vIExhdGVuY2Ugcml0dWVsbGUgOiBtYXRcdTAwRTlyaWVsID49IDE0aiBkJ1x1MDBFMmdlXG4gIGNvbnN0IGFnZURheXMgPSBsYXRlc3Q/LmNvbXB1dGVkX2F0XG4gICAgPyBNYXRoLmZsb29yKChEYXRlLm5vdygpIC0gbmV3IERhdGUobGF0ZXN0LmNvbXB1dGVkX2F0KS5nZXRUaW1lKCkpIC8gKDI0ICogMzYwMCAqIDEwMDApKVxuICAgIDogbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH19PlxuICAgICAgPENoYW1iZXJCYWNrZ3JvdW5kIGludGVuc2l0eT17MC43fSAvPlxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEgfX0+XG4gICAgICAgIDx3aW5kb3cuVG9wTmF2IHNob3dCYWNrIG9uQmFjaz17KCkgPT4gZ28oXCJhbmltYVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgcGFkZGluZ0JvdHRvbTogMTIwIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1zXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIiwgdGV4dFRyYW5zZm9ybTogXCJsb3dlcmNhc2VcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIGFuaW1hIG11bmRpIFx1MDBCNyBjaGFtYnJlIHNlY29uZGVcbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxoMSBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDMyLCBsaW5lSGVpZ2h0OiAxLjE1LFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgdmFyKC0tcy01KSAwXCIsXG4gICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIG1heFdpZHRoOiA1ODAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBMZSB0ZW1wcyBxdSdpbCBmYWl0IGRhbnMgbGEgbnVpdFxuICAgICAgICAgIDwvaDE+XG5cbiAgICAgICAgICB7LyogUGhyYXNlIHByaW5jaXBhbGUgcG9cdTAwRTl0aXF1ZSBcdTIwMTQgSDIsIEVCIEdhcmFtb25kIGl0YWxpYyAqL31cbiAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDIzLCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICBtYXJnaW46IFwiMCAwIHZhcigtLXMtNikgMFwiLFxuICAgICAgICAgICAgb3BhY2l0eTogbG9hZGluZyA/IDAuNCA6IDEsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgOTIwbXMgdmFyKC0tZWFzZS1yZXNwaXJlKVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2xvYWRpbmcgPyBcImxhIG1cdTAwRTl0XHUwMEU5byBzZSBjb21wb3NlXHUyMDI2XCIgOiBwb2V0aWN9XG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgey8qIEdseXBoZSAvIG1hdHRlciBwcmluY2lwYWwgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBtYi14bFwiIHN0eWxlPXt7IG1hcmdpblRvcDogXCJ2YXIoLS1zLTQpXCIsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTYpXCIgfX0+XG4gICAgICAgICAgICA8TWF0dGVyR2x5cGgga2luZD17bWF0dGVyS2luZH0gLz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxNCxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTQsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7bWFpbk1vdGlmfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8U2VjdGlvblJ1bGUgbGFiZWw9XCJudWFnZXMgdGhcdTAwRTltYXRpcXVlc1wiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFja1wiIHN0eWxlPXt7IGdhcDogMjAsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTYpXCIgfX0+XG4gICAgICAgICAgICB7Y2xvdWRzLm1hcCgodCwgaSkgPT4gKFxuICAgICAgICAgICAgICA8cCBrZXk9e2l9IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxOCwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjkyLFxuICAgICAgICAgICAgICB9fT57dH08L3A+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxTZWN0aW9uUnVsZSBsYWJlbD1cInRvdXJudXJlcyBxdWkgbW9udGVudFwiIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFja1wiIHN0eWxlPXt7IGdhcDogMTYsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTYpXCIgfX0+XG4gICAgICAgICAgICB7dG91cm51cmVzLm1hcCgodCwgaSkgPT4gKFxuICAgICAgICAgICAgICA8cCBrZXk9e2l9IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNywgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjg1LFxuICAgICAgICAgICAgICB9fT57dH08L3A+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHtwb2xhcml0aWVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgPFNlY3Rpb25SdWxlIGxhYmVsPVwicG9sYXJpdFx1MDBFOXMgdml2YW50ZXNcIiAvPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrXCIgc3R5bGU9e3sgZ2FwOiAxNCwgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNilcIiB9fT5cbiAgICAgICAgICAgICAgICB7cG9sYXJpdGllcy5tYXAoKHAsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNi41LCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLCBtYXhXaWR0aDogNjAwLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgb3BhY2l0eTogMC43IH19Plx1MjE5NDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge1wiIFwifVxuICAgICAgICAgICAgICAgICAgICB7cH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7aW5pdGlhdGlvbnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8U2VjdGlvblJ1bGUgbGFiZWw9XCJpbml0aWF0aW9ucyBlbiBjb3Vyc1wiIC8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2tcIiBzdHlsZT17eyBnYXA6IDE0LCBtYXJnaW5Cb3R0b206IFwidmFyKC0tcy02KVwiIH19PlxuICAgICAgICAgICAgICAgIHtpbml0aWF0aW9ucy5tYXAoKHAsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxwIGtleT17aX0gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTcsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG9wYWNpdHk6IDAuODgsXG4gICAgICAgICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLCBtYXhXaWR0aDogNjAwLCBtYXJnaW46IDAsXG4gICAgICAgICAgICAgICAgICB9fT57cH08L3A+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC8+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBMYXRlbmNlIHJpdHVlbGxlIFx1MjAxNCB0b3Vqb3VycyB2aXNpYmxlLCBzb2JyZSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNTBcIiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTEsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiBcInZhcigtLXMtNilcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHthZ2VEYXlzICE9IG51bGxcbiAgICAgICAgICAgICAgPyBgcmVjb21wb3NcdTAwRTllIGlsIHkgYSAke2FnZURheXN9IGpvdXJzIFx1MDBCNyBkXHUwMEU5bGFpIHJpdHVlbCBcdTIyNjUgMTQgamBcbiAgICAgICAgICAgICAgOiBcInJlY29tcG9zXHUwMEU5ZSByXHUwMEU5Z3VsaVx1MDBFOHJlbWVudCBcdTAwQjcgZFx1MDBFOWxhaSByaXR1ZWwgXHUyMjY1IDE0IGpcIn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgQ29tcG9zZXJzIChmYWxsYmFjayBzaSBiYWNrZW5kIG5lIGdcdTAwRTluXHUwMEU4cmUgcGFzIGVuY29yZSBsZXMgcGhyYXNlcykgXHUyNTAwXHUyNTAwXG5mdW5jdGlvbiBjb21wb3NlTWV0ZW9QaHJhc2UodG9wTW90aWYpIHtcbiAgY29uc3QgbSA9ICh0b3BNb3RpZj8ubW90aWYgfHwgdG9wTW90aWY/LmxhYmVsIHx8IFwiZWF1XCIpLnRvTG93ZXJDYXNlKCk7XG4gIGNvbnN0IG1hcCA9IHtcbiAgICBlYXU6IFwiQ2V0dGUgbHVuZSwgbCdodW1hbml0XHUwMEU5IGEgclx1MDBFQXZcdTAwRTkgZCdlYXUuIFBhcyBkZSB0ZW1wXHUwMEVBdGVzIFx1MjAxNCBkJ2VhdSBxdWkgc2UgY2hlcmNoZSB1biBsaXQuXCIsXG4gICAgcGllcnJlOiBcIkNldHRlIGx1bmUsIGJlYXVjb3VwIGRlIHBpZXJyZXMuIFBpZXJyZXMgcXVpIHJldGllbm5lbnQsIHBpZXJyZXMgcXVpIG1hcnF1ZW50IHVuIHNldWlsLlwiLFxuICAgIGZldTogXCJDZXR0ZSBsdW5lLCBkdSBmZXUgcXVpIGNvdXZlIHBsdXMgcXUnaWwgbmUgYnJcdTAwRkJsZS4gQnJhaXNlcyB0ZW51ZXMsIHBhcyBmbGFtbWVzIGhhdXRlcy5cIixcbiAgICBicnVtZTogXCJDZXR0ZSBsdW5lLCBiZWF1Y291cCBkZSBicnVtZS4gTGVzIGNvbnRvdXJzIHNlIGRcdTAwRTlmb250IGF2YW50IGRlIHNlIHJlcG9zZXIgYWlsbGV1cnMuXCIsXG4gICAgdmVudDogXCJDZXR0ZSBsdW5lLCBkdSB2ZW50IHF1aSBwYXNzZSBzYW5zIHByZXNzZXIuIElsIGRcdTAwRTlwbGFjZSBjZSBxdWkgcGVzYWl0LlwiLFxuICAgIHJhY2luZTogXCJDZXR0ZSBsdW5lLCBkZXMgcmFjaW5lcyBxdWkgZGVzY2VuZGVudC4gTGVudGVtZW50LCBzYW5zIGJydWl0LCB2ZXJzIGNlIHF1aSBsZXMgbm91cnJpdC5cIixcbiAgICBwb3J0ZTogXCJDZXR0ZSBsdW5lLCBiZWF1Y291cCBkZSBwb3J0ZXMuIENlcnRhaW5lcyBzJ291dnJlbnQsIGJlYXVjb3VwIGF0dGVuZGVudCBlbmNvcmUuXCIsXG4gICAgYW5pbWFsOiBcIkNldHRlIGx1bmUsIGRlcyBhbmltYXV4IHF1aSBwYXJsZW50IGRvdWNlbWVudC4gSWxzIG4nb250IHBhcyBsJ2FpciBwcmVzc1x1MDBFOXMgZCdcdTAwRUF0cmUgY29tcHJpcy5cIixcbiAgfTtcbiAgcmV0dXJuIG1hcFttXSB8fCBgQ2V0dGUgbHVuZSwgbGUgbW90aWYgZGUgbGEgJHttfSByZXZpZW50IGxlIHBsdXMgXHUyMDE0IHNhbnMgcydpbXBvc2VyLmA7XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VDbG91ZHMobWV0ZW8pIHtcbiAgLy8gU2kgbGUgYmFja2VuZCByZW52b2llIGRlcyBjbG91ZHMgZ1x1MDBFOW5cdTAwRTlyXHUwMEU5cywgbGVzIHV0aWxpc2VyLiBTaW5vbiBmYWxsYmFjay5cbiAgaWYgKG1ldGVvPy5jbG91ZHMgJiYgQXJyYXkuaXNBcnJheShtZXRlby5jbG91ZHMpICYmIG1ldGVvLmNsb3Vkcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIG1ldGVvLmNsb3Vkcy5zbGljZSgwLCA1KTtcbiAgfVxuICAvLyBGYWxsYmFjayA6IDMgcGhyYXNlcyBlbiBpbWFnZSBxdWkgdGllbm5lbnQgbGUgdG9uXG4gIHJldHVybiBbXG4gICAgXCJCZWF1Y291cCBkZSBwb3J0ZXMgcXVpIG5lIHMnb3V2cmVudCBwYXMgdG91dCBkZSBzdWl0ZS5cIixcbiAgICBcIkRlcyBhbmltYXV4IHF1aSBwYXJsZW50IGRvdWNlbWVudCwgc2FucyB1cmdlbmNlLlwiLFxuICAgIFwiRGVzIGRcdTAwRTlmdW50cyBxdWkgcmV2aWVubmVudCBwb3VyIGZhaXJlIGxhIGN1aXNpbmUuXCIsXG4gIF07XG59XG5cbmZ1bmN0aW9uIGNvbXBvc2VUb3VybnVyZXMobWV0ZW8pIHtcbiAgaWYgKG1ldGVvPy50b3VybnVyZXMgJiYgQXJyYXkuaXNBcnJheShtZXRlby50b3VybnVyZXMpICYmIG1ldGVvLnRvdXJudXJlcy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIG1ldGVvLnRvdXJudXJlcy5zbGljZSgwLCA1KTtcbiAgfVxuICByZXR1cm4gW1xuICAgIFwiTCdlYXUgcmV2aWVudCBwbHVzIHF1ZSBsZSBmZXUgY2V0dGUgc2Fpc29uLlwiLFxuICAgIFwiTGVzIHBheXNhZ2VzIHNlIGZvbnQgcGx1cyB2YXN0ZXMgOyBsZXMgcGlcdTAwRThjZXMgZmVybVx1MDBFOWVzIHNlIGZvbnQgcGx1cyByYXJlcy5cIixcbiAgICBcIkxlcyBmaWd1cmVzIGdyYW5kLW1hdGVybmVsbGVzIHNlIHJhcHByb2NoZW50LlwiLFxuICBdO1xufVxuXG5mdW5jdGlvbiBjb21wb3NlUG9sYXJpdGllcyhtZXRlbykge1xuICBpZiAobWV0ZW8/LnBvbGFyaXRpZXMgJiYgQXJyYXkuaXNBcnJheShtZXRlby5wb2xhcml0aWVzKSAmJiBtZXRlby5wb2xhcml0aWVzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gbWV0ZW8ucG9sYXJpdGllcy5zbGljZSgwLCA0KS5tYXAocCA9PlxuICAgICAgdHlwZW9mIHAgPT09IFwic3RyaW5nXCIgPyBwIDogYCR7cC5sZWZ0IHx8IFwiXCJ9IGV0ICR7cC5yaWdodCB8fCBcIlwifWBcbiAgICApO1xuICB9XG4gIHJldHVybiBbXTtcbn1cblxuZnVuY3Rpb24gY29tcG9zZUluaXRpYXRpb25zKG1ldGVvKSB7XG4gIGlmIChtZXRlbz8uaW5pdGlhdGlvbnMgJiYgQXJyYXkuaXNBcnJheShtZXRlby5pbml0aWF0aW9ucykgJiYgbWV0ZW8uaW5pdGlhdGlvbnMubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiBtZXRlby5pbml0aWF0aW9ucy5zbGljZSgwLCAzKTtcbiAgfVxuICByZXR1cm4gW107XG59XG5cbmZ1bmN0aW9uIG1vdGlmVG9NYXR0ZXIobW90aWYpIHtcbiAgY29uc3QgbSA9IChtb3RpZiB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuICBpZiAobS5pbmNsdWRlcyhcImVhdVwiKSB8fCBtLmluY2x1ZGVzKFwicml2XCIpIHx8IG0uaW5jbHVkZXMoXCJtZXJcIikpIHJldHVybiBcImVhdVwiO1xuICBpZiAobS5pbmNsdWRlcyhcImZldVwiKSB8fCBtLmluY2x1ZGVzKFwiYnJhaXNlXCIpIHx8IG0uaW5jbHVkZXMoXCJmbGFtbWVcIikpIHJldHVybiBcImZldVwiO1xuICBpZiAobS5pbmNsdWRlcyhcInBpZXJyZVwiKSB8fCBtLmluY2x1ZGVzKFwicm9jaGVcIikpIHJldHVybiBcInBpZXJyZVwiO1xuICBpZiAobS5pbmNsdWRlcyhcImJydW1lXCIpIHx8IG0uaW5jbHVkZXMoXCJudWFnZVwiKSB8fCBtLmluY2x1ZGVzKFwidmFwZXVyXCIpKSByZXR1cm4gXCJicnVtZVwiO1xuICBpZiAobS5pbmNsdWRlcyhcInZlbnRcIikgfHwgbS5pbmNsdWRlcyhcInNvdWZmbGVcIikpIHJldHVybiBcInZlbnRcIjtcbiAgaWYgKG0uaW5jbHVkZXMoXCJyYWNpbmVcIikgfHwgbS5pbmNsdWRlcyhcImFyYnJlXCIpIHx8IG0uaW5jbHVkZXMoXCJmb3JcdTAwRUF0XCIpKSByZXR1cm4gXCJyYWNpbmVcIjtcbiAgcmV0dXJuIFwiZWF1XCI7XG59XG5cbmNvbnN0IE1hdHRlckdseXBoID0gKHsga2luZCA9IFwiZWF1XCIgfSkgPT4ge1xuICBjb25zdCBjb21tb24gPSB7XG4gICAgd2lkdGg6IDkwLCBoZWlnaHQ6IDkwLCB2aWV3Qm94OiBcIjAgMCA4MCA4MFwiLFxuICAgIHN0eWxlOiB7IG9wYWNpdHk6IDAuNzggfSxcbiAgfTtcbiAgY29uc3Qgc3Ryb2tlID0gXCJ2YXIoLS1zdG9uZS1jb29sKVwiO1xuICBjb25zdCBzdyA9IDAuNztcbiAgc3dpdGNoIChraW5kKSB7XG4gICAgY2FzZSBcImVhdVwiOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHN2ZyB7Li4uY29tbW9ufT5cbiAgICAgICAgICA8cGF0aCBkPVwiTTQwIDE0IFEyNiAzMCAyNiA0NiBRMjYgNjIgNDAgNzAgUTU0IDYyIDU0IDQ2IFE1NCAzMCA0MCAxNCBaXCJcbiAgICAgICAgICAgIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtzdHJva2V9IHN0cm9rZVdpZHRoPXtzd30gLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTQwIDI0IFEzMiAzNCAzMiA0OCBRMzIgNjAgNDAgNjRcIlxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIiBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlV2lkdGg9e3N3ICogMC43fSBvcGFjaXR5PVwiMC42XCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApO1xuICAgIGNhc2UgXCJmZXVcIjpcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzdmcgey4uLmNvbW1vbn0+XG4gICAgICAgICAgPHBhdGggZD1cIk00MCAxNCBRMzAgMzAgMzIgNDQgUTM0IDU2IDQwIDYwIFE0NiA1NiA0OCA0NCBRNTAgMzAgNDAgMTQgWlwiXG4gICAgICAgICAgICBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWVtYmVyLWxpdmUpXCIgc3Ryb2tlV2lkdGg9e3N3fSBvcGFjaXR5PVwiMC45XCIgLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTQwIDI4IFEzNiAzOCAzOCA0OCBRNDAgNTYgNDAgNTZcIlxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1lbWJlci1saXZlKVwiIHN0cm9rZVdpZHRoPXtzdyAqIDAuN30gb3BhY2l0eT1cIjAuNTVcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgICk7XG4gICAgY2FzZSBcInBpZXJyZVwiOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHN2ZyB7Li4uY29tbW9ufT5cbiAgICAgICAgICA8cGF0aCBkPVwiTTIyIDUwIFEyMiAzMiA0MCAzMCBRNTggMzIgNTggNTAgUTU4IDYwIDUwIDY0IEwzMCA2NCBRMjIgNjAgMjIgNTAgWlwiXG4gICAgICAgICAgICBmaWxsPVwibm9uZVwiIHN0cm9rZT17c3Ryb2tlfSBzdHJva2VXaWR0aD17c3d9IC8+XG4gICAgICAgICAgPHBhdGggZD1cIk0zMCA0OCBMMzYgNDIgTDQ2IDUwIEw1MiA0NFwiXG4gICAgICAgICAgICBmaWxsPVwibm9uZVwiIHN0cm9rZT17c3Ryb2tlfSBzdHJva2VXaWR0aD17c3cgKiAwLjZ9IG9wYWNpdHk9XCIwLjU1XCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApO1xuICAgIGNhc2UgXCJicnVtZVwiOlxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHN2ZyB7Li4uY29tbW9ufT5cbiAgICAgICAgICA8cGF0aCBkPVwiTTE2IDMwIFEyOCAyNiA0MCAzMCBUNjQgMzBcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17c3Ryb2tlfSBzdHJva2VXaWR0aD17c3d9IG9wYWNpdHk9XCIwLjdcIiAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgNDIgUTI4IDM4IDQwIDQyIFQ2NiA0MlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtzdHJva2V9IHN0cm9rZVdpZHRoPXtzd30gb3BhY2l0eT1cIjAuNlwiIC8+XG4gICAgICAgICAgPHBhdGggZD1cIk0xOCA1NCBRMzAgNTAgNDIgNTQgVDYyIDU0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlV2lkdGg9e3N3fSBvcGFjaXR5PVwiMC41XCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApO1xuICAgIGNhc2UgXCJ2ZW50XCI6XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3ZnIHsuLi5jb21tb259PlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgMzIgUTM0IDI4IDUwIDMyIFE1NiAzMyA2MCAzMFwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtzdHJva2V9IHN0cm9rZVdpZHRoPXtzd30gb3BhY2l0eT1cIjAuNzVcIiAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTQgNDQgUTQwIDQwIDU2IDQ0IFE2MiA0NSA2NCA0MlwiIGZpbGw9XCJub25lXCIgc3Ryb2tlPXtzdHJva2V9IHN0cm9rZVdpZHRoPXtzd30gb3BhY2l0eT1cIjAuNlwiIC8+XG4gICAgICAgICAgPHBhdGggZD1cIk0xNCA1NiBRMzAgNTIgNDYgNTYgUTUyIDU3IDU0IDU0XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlV2lkdGg9e3N3fSBvcGFjaXR5PVwiMC40NVwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgKTtcbiAgICBjYXNlIFwicmFjaW5lXCI6XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3ZnIHsuLi5jb21tb259PlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNDAgMTQgTDQwIDM4XCIgZmlsbD1cIm5vbmVcIiBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlV2lkdGg9e3N3fSAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNNDAgMzggUTM0IDQ2IDI4IDU2IE00MCAzOCBRNDYgNDYgNTIgNTYgTTQwIDM4IEw0MCA2NCBNMjggNTYgUTI0IDYwIDIwIDY2IE01MiA1NiBRNTYgNjAgNjAgNjZcIlxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIiBzdHJva2U9e3N0cm9rZX0gc3Ryb2tlV2lkdGg9e3N3ICogMC43fSBvcGFjaXR5PVwiMC43XCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3ZnIHsuLi5jb21tb259PlxuICAgICAgICAgIDxjaXJjbGUgY3g9XCI0MFwiIGN5PVwiNDBcIiByPVwiMjJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT17c3Ryb2tlfSBzdHJva2VXaWR0aD17c3d9IC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgKTtcbiAgfVxufTtcblxuY29uc3QgU2VjdGlvblJ1bGUgPSAoeyBsYWJlbCB9KSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3tcbiAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDE0LCBtYXJnaW5Cb3R0b206IDIyLFxuICB9fT5cbiAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgZmxleDogXCIwIDAgYXV0b1wiLFxuICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSxcbiAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xOGVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICBvcGFjaXR5OiAwLjc1LFxuICAgIH19PntsYWJlbH08L3NwYW4+XG4gICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgIGZsZXg6IDEsIGhlaWdodDogMSxcbiAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtZGVlcCkgMTAwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICBvcGFjaXR5OiAwLjUsXG4gICAgfX0gLz5cbiAgPC9kaXY+XG4pO1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIENIQU1CUkUgMyBcdTIwMTQgVGVudSBlbnNlbWJsZSAoQW5uYWxlcyBCaWcgRHJlYW1zIGNvbGxlY3RpZnMpXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEFuaW1hQW5uYWxlc1NjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW2NvcnB1cywgc2V0Q29ycHVzXSA9IHVBUyhbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVBUyh0cnVlKTtcbiAgY29uc3QgW3RlbnVCeUlkLCBzZXRUZW51QnlJZF0gPSB1QVMoe30pOyAvLyB1c2VyLXNpZGUgdGVudSBzdGF0ZVxuXG4gIC8vIFNlZWQgcG91ciBtb2RlIGRcdTAwRTltbyAvIGVhcmx5IGRheXNcbiAgY29uc3Qgc2VlZCA9IHVBTSgoKSA9PiAoW1xuICAgIHsgaWQ6IFwic2VlZC0xXCIsIHRleHQ6IFwiVW5lIGdyYW5kLW1cdTAwRThyZSBpbmNvbm51ZSBsYXZlIGR1IGxpbmdlIGRhbnMgdW5lIGN1aXNpbmUgc2FucyBmZXUuIEVsbGUgbmUgbWUgcmVnYXJkZSBwYXMgbWFpcyBzYWl0IG1vbiBub20uXCIsIGhvbGRfY291bnQ6IDI4MCwgc2hhcmVkX2F0OiBudWxsIH0sXG4gICAgeyBpZDogXCJzZWVkLTJcIiwgdGV4dDogXCJVbiBlbmZhbnQtYW5pbWFsIHF1ZSBqJ2FpIG91YmxpXHUwMEU5IGRlIG5vdXJyaXIgZGVwdWlzIGRlcyBhbm5cdTAwRTllcyBzb3J0IGR1IHBsYWNhcmQgdml2YW50LiBQYXMgZW4gY29sXHUwMEU4cmUuIFNpbXBsZW1lbnQgdml2YW50LlwiLCBob2xkX2NvdW50OiA0MTAsIHNoYXJlZF9hdDogbnVsbCB9LFxuICAgIHsgaWQ6IFwic2VlZC0zXCIsIHRleHQ6IFwiSmUgdHJhdmVyc2UgdW4gcG9udCBxdSdvbiBuJ2EgcGFzIGZpbmkgZGUgY29uc3RydWlyZS4gSWwgc2UgY29uc3RydWl0IHNvdXMgbWVzIHBpZWRzIFx1MjAxNCBtYWlzIHNldWxlbWVudCBzaSBqZSBjb250aW51ZS5cIiwgaG9sZF9jb3VudDogMTgwLCBzaGFyZWRfYXQ6IG51bGwgfSxcbiAgICB7IGlkOiBcInNlZWQtNFwiLCB0ZXh0OiBcIlVuZSBiYWxlaW5lIHJlbW9udGUgZGFucyB1bmUgcml2aVx1MDBFOHJlIGFzc1x1MDBFOWNoXHUwMEU5ZSwgc3VpdmllIHBhciBkZXMgZ2VucyBxdWkgdGllbm5lbnQgZGVzIHNlYXV4IGQnZWF1LCB1biBcdTAwRTAgbGEgZm9pcy5cIiwgaG9sZF9jb3VudDogNTMwLCBzaGFyZWRfYXQ6IG51bGwgfSxcbiAgXSksIFtdKTtcblxuICB1QUUoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0QW5uYWxlcygpLnRoZW4oZCA9PiB7XG4gICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICBjb25zdCBsaXZlID0gKGQ/LmNpcmN1bGF0aW5nIHx8IFtdKS5tYXAoYSA9PiAoe1xuICAgICAgICBpZDogYS5pZCxcbiAgICAgICAgdGV4dDogYS5jdXJhdGVkX3RleHQsXG4gICAgICAgIGhvbGRfY291bnQ6IGEuaG9sZF9jb3VudCB8fCAwLFxuICAgICAgICBzaGFyZWRfYXQ6IGEuc2hhcmVkX2F0LFxuICAgICAgfSkpO1xuICAgICAgc2V0Q29ycHVzKGxpdmUubGVuZ3RoID4gMCA/IGxpdmUgOiBzZWVkKTtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH0pLmNhdGNoKCgpID0+IHtcbiAgICAgIHNldENvcnB1cyhzZWVkKTtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gIH0sIFtzZWVkXSk7XG5cbiAgLy8gT3JkcmUgcm90YXRpZiBhbFx1MDBFOWF0b2lyZSBcdTIwMTQgYW50aS1jbGFzc2VtZW50IChzZWVkID0gam91ciBkZSBsJ2Fublx1MDBFOWUsXG4gIC8vIHBvdXIgc3RhYmlsaXRcdTAwRTkgZGFucyBsYSBzZXNzaW9uIG1haXMgcm90YXRpb24gbGVudGUpXG4gIGNvbnN0IGRpc3BsYXkgPSB1QU0oKCkgPT4ge1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBzZWVkRGF5ID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAqIDEwMDAgKyBNYXRoLmZsb29yKFxuICAgICAgKHRvZGF5IC0gbmV3IERhdGUodG9kYXkuZ2V0RnVsbFllYXIoKSwgMCwgMCkpIC8gKDI0ICogMzYwMCAqIDEwMDApXG4gICAgKTtcbiAgICByZXR1cm4gc2h1ZmZsZVNlZWRlZChjb3JwdXMsIHNlZWREYXkpO1xuICB9LCBbY29ycHVzXSk7XG5cbiAgY29uc3QgdGVuaXIgPSBhc3luYyAoaWQpID0+IHtcbiAgICBpZiAodGVudUJ5SWRbaWRdKSByZXR1cm47IC8vIHBhcyBkJ3VuZG8gblx1MDBFOWNlc3NhaXJlIFx1MjAxNCBzaWxlbmNpZXV4XG4gICAgc2V0VGVudUJ5SWQodCA9PiAoeyAuLi50LCBbaWRdOiB0cnVlIH0pKTtcbiAgICB0cnkgeyBhd2FpdCB3aW5kb3cuRHJlYW1BUEkudGVuaXJBbm5hbGUoaWQpOyB9IGNhdGNoIHt9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9fT5cbiAgICAgIDxDaGFtYmVyQmFja2dyb3VuZCBpbnRlbnNpdHk9ezAuNn0gLz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiYW5pbWFcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZVwiIHN0eWxlPXt7IHBhZGRpbmdCb3R0b206IDEyMCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsIHRleHRUcmFuc2Zvcm06IFwibG93ZXJjYXNlXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBhbmltYSBtdW5kaSBcdTAwQjcgY2hhbWJyZSB0cm9pc2lcdTAwRThtZVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGgxIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMzIsIGxpbmVIZWlnaHQ6IDEuMTUsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgbWFyZ2luOiBcIjAgMCB2YXIoLS1zLTQpIDBcIixcbiAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgVGVudSBlbnNlbWJsZVxuICAgICAgICAgIDwvaDE+XG5cbiAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE3LCBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgbWF4V2lkdGg6IDU4MCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICBtYXJnaW46IFwiMCAwIHZhcigtLXMtNikgMFwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgQ2VzIHJcdTAwRUF2ZXMgb250IFx1MDBFOXRcdTAwRTkgb2ZmZXJ0cyBcdTAwRTAgbGEgdm9cdTAwRkJ0ZSBjb21tdW5lLiBOb3VzIGxlcyB0ZW5vbnMgXHUyMDE0XG4gICAgICAgICAgICBub24gcG91ciBsZXMgY29tcHJlbmRyZSwgbWFpcyBwYXJjZSBxdSdpbHMgbm91cyByZWdhcmRlbnQuXG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgICAge2xvYWRpbmcgJiYgY29ycHVzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpIDBcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBsZXMgYW5uYWxlcyBzZSByYXNzZW1ibGVudFx1MjAyNlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2tcIiBzdHlsZT17eyBnYXA6IDMyIH19PlxuICAgICAgICAgICAgICB7ZGlzcGxheS5tYXAoZCA9PiAoXG4gICAgICAgICAgICAgICAgPEFubmFsZUNhcmQga2V5PXtkLmlkfVxuICAgICAgICAgICAgICAgICAgYW5uYWxlPXtkfVxuICAgICAgICAgICAgICAgICAgdGVudT17ISF0ZW51QnlJZFtkLmlkXX1cbiAgICAgICAgICAgICAgICAgIG9uVGVuaXI9eygpID0+IHRlbmlyKGQuaWQpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBHYXJkZS1mb3VzIGFudGktcG9wdWxhcml0eSBjb250ZXN0IFx1MjAxNCB0ZW51ZSBzaWxlbmNpZXVzZSBlbiBiYXMgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTUwXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgIG1hcmdpblRvcDogXCJ2YXIoLS1zLTYpXCIsIG1heFdpZHRoOiA2MDAsXG4gICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNCwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIFRlbmlyIG4nZXN0IHBhcyB2b3Rlci4gQXVjdW4gY2xhc3NlbWVudC4gTCdvcmRyZSBjaGFuZ2UgXHUwMEUwIGNoYXF1ZSBsdW5lLlxuICAgICAgICAgICAgVHUgcGV1eCByZXRpcmVyIHVuIHJcdTAwRUF2ZSBxdWUgdHUgYXMgb2ZmZXJ0LCBcdTAwRTAgdG91dCBtb21lbnQgXHUyMDE0IGlsIHMnZWZmYWNlIGVuIHNpbGVuY2UuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICB7d2luZG93LkZlZWRiYWNrRmxvYXQgJiYgPHdpbmRvdy5GZWVkYmFja0Zsb2F0IC8+fVxuXG4gICAgICA8c3R5bGU+e2BcbiAgICAgICAgLmFuaW1hLWFubmFsZS1jYXJkIHtcbiAgICAgICAgICBwYWRkaW5nOiAzMnB4IDI4cHg7XG4gICAgICAgICAgYmFja2dyb3VuZDpcbiAgICAgICAgICAgIGxpbmVhci1ncmFkaWVudCgxODBkZWcsXG4gICAgICAgICAgICAgIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcGFwZXItd2FybSkgOCUsIHZhcigtLW5pZ2h0LXdhcm0pKSAwJSxcbiAgICAgICAgICAgICAgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1vYnNpZGlhbikgNjAlLCB2YXIoLS1uaWdodC1mbG9vcikpIDEwMCUpO1xuICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcGFwZXItd2FybSkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpO1xuICAgICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTsgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgICAgfVxuICAgICAgICAuYW5pbWEtYW5uYWxlLWNhcmQ6OmJlZm9yZSB7XG4gICAgICAgICAgY29udGVudDogXCJcIjsgcG9zaXRpb246IGFic29sdXRlOyBpbnNldDogMDtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJyNub2lzZS1wYXBlcicpO1xuICAgICAgICAgIG9wYWNpdHk6IDAuMTg7XG4gICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICAgIH1cbiAgICAgICAgLmFuaW1hLXRlbmlyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgYm9yZGVyOiBub25lO1xuICAgICAgICAgIGNvbG9yOiB2YXIoLS1hc2gtbGlnaHQpO1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1zZXJpZik7IGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICAgICAgICBmb250LXNpemU6IDIycHg7IGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjsgcGFkZGluZzogNnB4IDEwcHg7XG4gICAgICAgICAgdHJhbnNpdGlvbjogY29sb3IgOTIwbXMgdmFyKC0tZWFzZS1yZXNwaXJlKSxcbiAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm0gMzgwbXMgdmFyKC0tZWFzZS1yZXNwaXJlKSxcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0LXNoYWRvdyA5MjBtcyB2YXIoLS1lYXNlLXJlc3BpcmUpO1xuICAgICAgICB9XG4gICAgICAgIC5hbmltYS10ZW5pcjpob3ZlciB7IGNvbG9yOiB2YXIoLS1ib25lKTsgfVxuICAgICAgICAuYW5pbWEtdGVuaXIudGVudSB7XG4gICAgICAgICAgY29sb3I6IHZhcigtLXNpbGstZ29sZCk7XG4gICAgICAgICAgdGV4dC1zaGFkb3c6IDAgMCAxMnB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0MCUsIHRyYW5zcGFyZW50KTtcbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgQW5uYWxlQ2FyZCA9ICh7IGFubmFsZSwgdGVudSwgb25UZW5pciB9KSA9PiB7XG4gIGNvbnN0IGhlbGRSb3VuZCA9IGhvbGRSb3VuZGVkKGFubmFsZS5ob2xkX2NvdW50KTtcbiAgcmV0dXJuIChcbiAgICA8YXJ0aWNsZSBjbGFzc05hbWU9XCJhbmltYS1hbm5hbGUtY2FyZFwiPlxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEgfX0+XG4gICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAyMiwgbGluZUhlaWdodDogMS41LFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgbWFyZ2luOiAwLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgcGFkZGluZzogXCIwIDhweFwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7YW5uYWxlLnRleHR9XG4gICAgICAgIDwvcD5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7XG4gICAgICAgICAganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgIG1hcmdpblRvcDogMjgsXG4gICAgICAgICAgcGFkZGluZ1RvcDogMTgsXG4gICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1kZWVwKSA3MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIGZsZXhXcmFwOiBcIndyYXBcIiwgZ2FwOiAxNCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE0LCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjg1LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2hlbGRSb3VuZCA+IDAgPyA8PnRlbnUgcGFyIH57ZnJOdW1iZXIoaGVsZFJvdW5kKX08Lz4gOiA8PmVuIGNpcmN1bGF0aW9uPC8+fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT17XCJhbmltYS10ZW5pciBcIiArICh0ZW51ID8gXCJ0ZW51XCIgOiBcIlwiKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uVGVuaXJ9XG4gICAgICAgICAgICBhcmlhLWxhYmVsPXt0ZW51ID8gXCJ0dSB0aWVucyBjZSByXHUwMEVBdmVcIiA6IFwidGVuaXIgY2Ugclx1MDBFQXZlXCJ9XG4gICAgICAgICAgICB0aXRsZT17dGVudSA/IFwidHUgbGUgdGllbnNcIiA6IFwidGVuaXJcIn0+XG4gICAgICAgICAgICB7dGVudSA/IFwiXHUyNzI2XCIgOiBcIlx1MjcyN1wifVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvYXJ0aWNsZT5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ0hBTUJSRSA0IFx1MjAxNCBQb2x5cGhvbmllIGRlIGxhIGx1bmVcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgQW5pbWFQb2x5cGhvbmllU2NyZWVuID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbcG9seXBob25pZXMsIHNldFBvbHlwaG9uaWVzXSA9IHVBUyhbXSk7XG4gIGNvbnN0IFthcmNoaXZlLCBzZXRBcmNoaXZlXSA9IHVBUyhbXSk7XG4gIGNvbnN0IFtzaG93QXJjaGl2ZSwgc2V0U2hvd0FyY2hpdmVdID0gdUFTKGZhbHNlKTtcbiAgY29uc3QgW2FjdGl2ZUlkeCwgc2V0QWN0aXZlSWR4XSA9IHVBUygwKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdUFTKHRydWUpO1xuXG4gIHVBRSgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIFByb21pc2UuYWxsKFtcbiAgICAgIHdpbmRvdy5EcmVhbUFQSS5nZXRQb2x5cGhvbmllKHsgbGltaXQ6IDEgfSksXG4gICAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0UG9seXBob25pZUFyY2hpdmVcbiAgICAgICAgPyB3aW5kb3cuRHJlYW1BUEkuZ2V0UG9seXBob25pZUFyY2hpdmUoKVxuICAgICAgICA6IFByb21pc2UucmVzb2x2ZSh7IHBvbHlwaG9uaWVzOiBbXSB9KSxcbiAgICBdKS50aGVuKChbbGF0ZXN0RGF0YSwgYXJjaGl2ZURhdGFdKSA9PiB7XG4gICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICBzZXRQb2x5cGhvbmllcyhsYXRlc3REYXRhPy5wb2x5cGhvbmllcyB8fCBbXSk7XG4gICAgICBzZXRBcmNoaXZlKGFyY2hpdmVEYXRhPy5wb2x5cGhvbmllcyB8fCBbXSk7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9KS5jYXRjaCgoKSA9PiBzZXRMb2FkaW5nKGZhbHNlKSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIC8vIFBvb2wgOiBjdXJyZW50ICsgYXJjaGl2ZSAoY3VycmVudCBlbiBpbmRleCAwKVxuICBjb25zdCBwb29sID0gdUFNKCgpID0+IHtcbiAgICBjb25zdCBjdXJyZW50ID0gcG9seXBob25pZXNbMF07XG4gICAgY29uc3QgbWFwID0gbmV3IE1hcCgpO1xuICAgIGlmIChjdXJyZW50KSBtYXAuc2V0KGN1cnJlbnQuaWQsIGN1cnJlbnQpO1xuICAgIGFyY2hpdmUuZm9yRWFjaChwID0+IHsgaWYgKCFtYXAuaGFzKHAuaWQpKSBtYXAuc2V0KHAuaWQsIHApOyB9KTtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShtYXAudmFsdWVzKCkpO1xuICB9LCBbcG9seXBob25pZXMsIGFyY2hpdmVdKTtcblxuICBjb25zdCBhY3RpdmUgPSBwb29sW2FjdGl2ZUlkeF0gfHwgcG9seXBob25pZXNbMF0gfHwgbnVsbDtcbiAgY29uc3QgbHVuYXJMYWJlbCA9IGFjdGl2ZT8ubHVuYXJfcGhhc2UgfHwgXCJsZWN0dXJlIGxvbmd1ZVwiO1xuICBjb25zdCB2b2ljZXMgPSBhY3RpdmU/LnZvaWNlc19tb2JpbGlzZWVzIHx8IFtdO1xuXG4gIC8vIERhdGUgbGFiZWwgKG1vaXMgYW5uXHUwMEU5ZSkgcG91ciBsJ2FyY2hpdmVcbiAgY29uc3QgZm10TW9udGggPSAoaXNvKSA9PiB7XG4gICAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBuZXcgRGF0ZShpc28pLnRvTG9jYWxlRGF0ZVN0cmluZyhcImZyLUZSXCIsIHsgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIiB9KTtcbiAgfTtcblxuICAvLyBUZXh0ZSBmYWxsYmFjayAobW9kZSBkXHUwMEU5bW8pIFx1MjAxNCBwYXMgZGUgYnVsbGV0cywgcGFzIGQnZW1vamlcbiAgY29uc3QgZmFsbGJhY2sgPSBgUGx1c2lldXJzIG9udCByXHUwMEVBdlx1MDBFOSBkJ2VhdSBjZXR0ZSBsdW5lLiBQYXMgZGUgdGVtcFx1MDBFQXRlcyBcdTIwMTQgZCdlYXUgcXVpIHNlIGNoZXJjaGUgdW4gbGl0LCBkJ2VzdHVhaXJlcyBxdWkgc2UgZm9ybWVudC4gRXQgcGx1c2lldXJzIG9udCBcdTAwRTljcml0IGRlcyBkb3V0ZXMgc3VyIGxldXIgdHJhdmFpbCwgc3VyIGNlIHF1J2lsIGZhdXQgdGVuaXIgZXQgY2UgcXUnaWwgZmF1dCBsXHUwMEUyY2hlci5cblxuXHUwMEMwIGxhIGx1bWlcdTAwRThyZSBkZSBCYWNoZWxhcmQsIG9uIHBvdXJyYWl0IGVudGVuZHJlIGRhbnMgY2VzIGVhdXggY2hlcmNoYW50IGxldXIgbGl0IGxhIG1cdTAwRUFtZSBjaG9zZSBxdWUgZGFucyBjZXMgcXVlc3Rpb25zIGRlIHNldWlsIDogdW5lIGZsdWlkaXRcdTAwRTkgcXVpIGRlbWFuZGUgXHUwMEUwIHNlIHBvc2VyIHF1ZWxxdWUgcGFydCwgc2FucyBlbmNvcmUgc2F2b2lyIG9cdTAwRjkuIEwnZWF1LCBpY2ksIG4nZXN0IHBhcyBjZWxsZSBxdWkgbm9pZS4gQydlc3QgY2VsbGUgcXVpIGhcdTAwRTlzaXRlIGF2YW50IGRlIHByZW5kcmUgc2EgZm9ybWUuXG5cbkFpemVuc3RhdCBhdXJhaXQgaW52aXRcdTAwRTkgXHUwMEUwIHRlbmlyIGxhIGdyYW5kLW1cdTAwRThyZSBxdWkgcmV2aWVudCBcdTIwMTQgcGx1c2lldXJzIGwnb250IHZ1ZSBjZXR0ZSBsdW5lLCBkYW5zIGRlcyBjdWlzaW5lcyBzYW5zIGZldSwgYXZlYyBkdSBsaW5nZSBcdTAwRTAgbGF2ZXIuIEVsbGUgbidlc3QgcGFzIGZpZ3VyZSBkZSBwYXNzXHUwMEU5LiBFbGxlIGVzdCBmaWd1cmUgcXVpIHRyYXZhaWxsZSBxdWVscXVlIGNob3NlIHF1aSBuJ2EgcGFzIGVuY29yZSBkZSBub20gZGFucyBsYSB2aWUgZGUgam91ci5cblxuRXQgTW9zcywgb24gbCdpbWFnaW5lIGRpcmUgOiBsZXMgcG9udHMgaW5hY2hldlx1MDBFOXMgcXVpIHJldmllbm5lbnQgZW4gc3luY2hyb25pY2l0XHUwMEU5IG5lIGRlbWFuZGVudCBwZXV0LVx1MDBFQXRyZSBwYXMgXHUwMEUwIFx1MDBFQXRyZSBmaW5pcy4gSWxzIGRlbWFuZGVudCBcdTAwRTAgXHUwMEVBdHJlIHJlZ2FyZFx1MDBFOXMsIGRlcHVpcyBsZXMgZGV1eCByaXZlcyBcdTAwRTAgbGEgZm9pcy5cblxuUXVlIHNlIGNoZXJjaGUtdC1lbGxlLCBsJ2VhdSBxdWkgY2hlcmNoZSBzb24gbGl0ID9gO1xuXG4gIGNvbnN0IHRleHQgPSBhY3RpdmU/Lm5hcnJhdGl2ZV90ZXh0IHx8IGZhbGxiYWNrO1xuICBjb25zdCBwYXJhZ3JhcGhzID0gdGV4dC5zcGxpdCgvXFxuXFxuKy8pLmZpbHRlcihCb29sZWFuKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiIH19PlxuICAgICAgPENoYW1iZXJCYWNrZ3JvdW5kIGludGVuc2l0eT17MC41NX0gLz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiYW5pbWFcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZVwiIHN0eWxlPXt7IHBhZGRpbmdCb3R0b206IDEyMCwgbWF4V2lkdGg6IDY4MCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsIHRleHRUcmFuc2Zvcm06IFwibG93ZXJjYXNlXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBhbmltYSBtdW5kaSBcdTAwQjcgY2hhbWJyZSBxdWF0cmlcdTAwRThtZVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGgxIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMzIsIGxpbmVIZWlnaHQ6IDEuMTUsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgbWFyZ2luOiBcIjAgMCB2YXIoLS1zLTMpIDBcIixcbiAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgUG9seXBob25pZSBkZSBsYSBsdW5lXG4gICAgICAgICAgPC9oMT5cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNCwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNilcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7YWN0aXZlSWR4ID09PSAwID8gPD5cdTAwQjcge2x1bmFyTGFiZWx9PC8+IDogPD5cdTAwQjcgbGVjdHVyZSBwclx1MDBFOWNcdTAwRTlkZW50ZSBcdTAwQjcge2ZtdE1vbnRoKGFjdGl2ZT8ucGVyaW9kX2VuZCl9PC8+fVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFRleHRlIGZsdWlkZSwgRUIgR2FyYW1vbmQsIHBhcyBkZSBidWxsZXRzLCBwYXMgZGUgdGl0cmVzIGludGVybmVzICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMTksIGxpbmVIZWlnaHQ6IDEuNzUsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCxcbiAgICAgICAgICAgIHRleHRBbGlnbjogXCJqdXN0aWZ5XCIsXG4gICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgICAgICB3aW5kb3cuUG9seXBob25pZUxldHRlclNrZWxldG9uXG4gICAgICAgICAgICAgICAgPyA8d2luZG93LlBvbHlwaG9uaWVMZXR0ZXJTa2VsZXRvbiAvPlxuICAgICAgICAgICAgICAgIDogPHAgc3R5bGU9e3sgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBvcGFjaXR5OiAwLjUgfX0+bGEgcG9seXBob25pZSBzJ1x1MDBFOWNyaXRcdTIwMjY8L3A+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICBwYXJhZ3JhcGhzLm1hcCgocGFyYSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxwIGtleT17aX0gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgMS40ZW0gMFwiLFxuICAgICAgICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgICAgfX0+e3BhcmF9PC9wPlxuICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBWb2l4IG1vYmlsaXNcdTAwRTllcyBcdTIwMTQgc2lnbmF0dXJlIGRpc2NyXHUwMEU4dGUgYmFzICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDogXCJ2YXIoLS1zLTYpXCIsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiBcInZhcigtLXMtNClcIixcbiAgICAgICAgICAgIGJvcmRlclRvcDogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtZGVlcCkgNjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMywgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgb3BhY2l0eTogMC44NSxcbiAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgdm9peCBtb2JpbGlzXHUwMEU5ZXMgY2V0dGUgbHVuZSBcdTAwQjd7XCIgXCJ9XG4gICAgICAgICAgICB7dm9pY2VzLmxlbmd0aCA+IDBcbiAgICAgICAgICAgICAgPyB2b2ljZXMuam9pbihcIiwgXCIpXG4gICAgICAgICAgICAgIDogXCJBaXplbnN0YXQsIE1vc3MsIEJhY2hlbGFyZFwifVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIEJvdXRvbiBsZWN0dXJlcyBwclx1MDBFOWNcdTAwRTlkZW50ZXMgKi99XG4gICAgICAgICAge3Bvb2wubGVuZ3RoID4gMSAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogXCJ2YXIoLS1zLTYpXCIgfX0+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93QXJjaGl2ZShzID0+ICFzKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE0LjUsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjhweCAwXCIsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwidW5kZXJsaW5lXCIsXG4gICAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbkNvbG9yOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgdGV4dFVuZGVybGluZU9mZnNldDogNixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7c2hvd0FyY2hpdmUgPyBcInJlZmVybWVyIGxlcyBsZWN0dXJlcyBwclx1MDBFOWNcdTAwRTlkZW50ZXNcIiA6IFwibGVjdHVyZXMgcHJcdTAwRTljXHUwMEU5ZGVudGVzXCJ9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgIHtzaG93QXJjaGl2ZSAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFja1wiIHN0eWxlPXt7IGdhcDogNiwgbWFyZ2luVG9wOiBcInZhcigtLXMtNClcIiB9fT5cbiAgICAgICAgICAgICAgICAgIHtwb29sLm1hcCgocCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17cC5pZCB8fCBpfVxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0QWN0aXZlSWR4KGkpOyB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IDAsIGJlaGF2aW9yOiBcInNtb290aFwiIH0pOyB9fVxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBpID09PSBhY3RpdmVJZHhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA4JSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgKGkgPT09IGFjdGl2ZUlkeFxuICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI4JSwgdmFyKC0tYXNoLWRlZXApKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJ2YXIoLS1hc2gtZGVlcClcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogaSA9PT0gYWN0aXZlSWR4ID8gXCJ2YXIoLS1ib25lKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggMTRweFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImxlZnRcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIHZhcigtLWVhc2UtcmVzcGlyZSlcIixcbiAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7aSA9PT0gMCA/IFwibHVuZSBhY3R1ZWxsZVwiIDogKHAubHVuYXJfcGhhc2UgfHwgZm10TW9udGgocC5wZXJpb2RfZW5kKSB8fCBcImxlY3R1cmUgcHJcdTAwRTljXHUwMEU5ZGVudGVcIil9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAge3dpbmRvdy5GZWVkYmFja0Zsb2F0ICYmIDx3aW5kb3cuRmVlZGJhY2tGbG9hdCAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ29tcGF0aWJpbGl0XHUwMEU5IGhcdTAwRTlyaXRhZ2UgOiBPZmZyZUthaXJvc1NoZWV0IC8gT2ZmcmVLYWlyb3NTY3JlZW5cbi8vIChwclx1MDBFOXNlcnZcdTAwRTlzIGRlcHVpcyBsJ2FuY2llbiBzY3JlZW5zLWFuaW1hLmpzeCBcdTIwMTQgdXRpbGlzXHUwMEU5cyBwYXIgY2FwdHVyZSBmbG93KVxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBPZmZyZUthaXJvc1NoZWV0ID0gKHsgZW50cnksIG9uQ2xvc2UsIG9uT2ZmZXIgfSkgPT4ge1xuICBjb25zdCBbc3RlcCwgc2V0U3RlcF0gPSB1QVMoMCk7XG4gIGNvbnN0IFtjb25zZW50LCBzZXRDb25zZW50XSA9IHVBUyh7IGltYWdlOiB0cnVlLCBtb29uOiB0cnVlLCByZWdpb246IGZhbHNlIH0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJvZmZyZS1zaGVldFwiPlxuICAgICAgPGRpdiBzdHlsZT17eyBtYXhXaWR0aDogNjIwLCBtYXJnaW46IFwiMCBhdXRvXCIgfX0+XG4gICAgICAgIHtzdGVwID09PSAwICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLXNcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiB9fT5cbiAgICAgICAgICAgICAgY2Ugclx1MDBFQXZlIHBvcnRlIHVuIG51bWlub3VzXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJoMi1zZWN0aW9uIG1iLW1cIiBzdHlsZT17eyBmb250U2l6ZTogMjMgfX0+XG4gICAgICAgICAgICAgIHZvdWRyYWlzLXR1IGwnb2ZmcmlyIFx1MDBFMCBhbmltYSBtdW5kaSA/XG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYm9keSBvcC03MCBtYi1tXCIgc3R5bGU9e3sgdGV4dFdyYXA6IFwicHJldHR5XCIgfX0+XG4gICAgICAgICAgICAgIENlcnRhaW5zIHJcdTAwRUF2ZXMgc2VtYmxlbnQgYXBwYXJ0ZW5pciBhdS1kZWxcdTAwRTAgZGUgbm91cy4gTGVzIG9mZnJpciBcdTAwRTAgbGEgdm9cdTAwRkJ0ZSBjb21tdW5lLFxuICAgICAgICAgICAgICBjJ2VzdCBwZXJtZXR0cmUgcXUnaWxzIHNvaWVudCB0ZW51cyBwYXIgZGVzIGluY29ubnVlcywgZGFucyBkJ2F1dHJlcyByXHUwMEU5Z2lvbnMsIGQnYXV0cmVzIGx1bmVzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWV0YSBtYi1sXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICAgICAgICBjZSBuJ2VzdCBwYXMgb2JsaWdhdG9pcmUuIHR1IHBldXggZGlyZSBub24sIHNhbnMgZXhwbGljYXRpb24uXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtbVwiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcImZsZXgtZW5kXCIgfX0+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtvbkNsb3NlfT5wYXMgY2V0dGUgZm9pczwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IHNldFN0ZXAoMSl9PnZvaXIgY2UgcXVpIHNlcmFpdCBwYXJ0YWdcdTAwRTk8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgICB7c3RlcCA9PT0gMSAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1zXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgICBjZSBxdWkgdm95YWdlcmFpdCB2ZXJzIGFuaW1hIG11bmRpXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJoMy1sZWN0dXJlIG1iLW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTkgfX0+YXZlYyB0b24gYWNjb3JkLCBldCBzZXVsZW1lbnQgY2UgcXVlIHR1IHZldXguPC9oMz5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFja1wiIHN0eWxlPXt7IGdhcDogMCB9fT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nLXJvd1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGFiZWxcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGl0bGVcIj5sJ2ltYWdlIGR1IHJcdTAwRUF2ZTwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkZXNjXCI+YW5vbnltZS4gYXVjdW5lIHRyYWNlIGRlIHRvaSwgYXVjdW4gaWRlbnRpZmlhbnQuPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtcInRvZ2dsZSBcIiArIChjb25zZW50LmltYWdlID8gXCJvblwiIDogXCJcIil9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb25zZW50KGMgPT4gKHsgLi4uYywgaW1hZ2U6ICFjLmltYWdlIH0pKX0gLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZy1yb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRpdGxlXCI+cGhhc2UgZGUgbHVuZSBldCBzYWlzb248L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGVzY1wiPmFpZGUgbGEgdm9cdTAwRkJ0ZSBcdTAwRTAgbGlyZSBsZXMgcnl0aG1lcyBjb2xsZWN0aWZzLjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17XCJ0b2dnbGUgXCIgKyAoY29uc2VudC5tb29uID8gXCJvblwiIDogXCJcIil9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRDb25zZW50KGMgPT4gKHsgLi4uYywgbW9vbjogIWMubW9vbiB9KSl9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNldHRpbmctcm93XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0aXRsZVwiPnJcdTAwRTlnaW9uIGxhcmdlIChjb250aW5lbnQpPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRlc2NcIj5qYW1haXMgZGUgdmlsbGUsIGphbWFpcyBkZSBwYXlzLiBjb250aW5lbnQgc2V1bGVtZW50LjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17XCJ0b2dnbGUgXCIgKyAoY29uc2VudC5yZWdpb24gPyBcIm9uXCIgOiBcIlwiKX1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldENvbnNlbnQoYyA9PiAoeyAuLi5jLCByZWdpb246ICFjLnJlZ2lvbiB9KSl9IC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtdC1sIG1iLWxcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICAgIHR1IHBldXggcmV0aXJlciBjZSByXHUwMEVBdmUgZGUgbGEgdm9cdTAwRkJ0ZSBcdTAwRTAgdG91dCBtb21lbnQuIGlsIGRpc3BhcmFcdTAwRUV0IGVuIDQ4aC5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLW1cIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIgfX0+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXsoKSA9PiBzZXRTdGVwKDApfT5cdTIxOTAgcmV0b3VyPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4geyBvbk9mZmVyPy4oY29uc2VudCk7IHNldFN0ZXAoMik7IH19PlxuICAgICAgICAgICAgICAgIG9mZnJpclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuICAgICAgICB7c3RlcCA9PT0gMiAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy01KSAwXCIgfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJyZWF0aCBtYi1sXCIgc3R5bGU9e3sgd2lkdGg6IDgwLCBoZWlnaHQ6IDgwIH19IC8+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWMgbWItc1wiIHN0eWxlPXt7IG1heFdpZHRoOiA0MjAsIG1hcmdpbjogXCIwIGF1dG9cIiB9fT5cbiAgICAgICAgICAgICAgbGUgclx1MDBFQXZlIGEgcmVqb2ludCBsYSB2b1x1MDBGQnRlLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG10LW1cIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICAgIGlsIGVzdCB0ZW51IHBhciBsZXMgbHVuZXMuIHR1IHNlcmFzIG5vdGlmaVx1MDBFOWUgc2kgc29uIGltYWdlIGVuIHJlbmNvbnRyZSBkJ2F1dHJlcy5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dCBtdC14bFwiIG9uQ2xpY2s9e29uQ2xvc2V9PnJlZmVybWVyPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IE9mZnJlS2Fpcm9zU2NyZWVuID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSB1QVModHJ1ZSk7XG4gIGNvbnN0IGVudHJ5ID0gKHdpbmRvdy5zZWVkRW50cmllcyB8fCBbXSlbMF07XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIgfX0+XG4gICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwia2Fpcm9zXCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgb3BhY2l0eTogb3BlbiA/IDAuMyA6IDEsIHRyYW5zaXRpb246IFwib3BhY2l0eSB2YXIoLS10ZW1wby10aXNzZSlcIiB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLXNcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgZFx1MDBFOXRhaWwgXHUwMEI3IHtlbnRyeT8ud2hlbn1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImgzLWxlY3R1cmVcIiBzdHlsZT17eyBmb250U2l6ZTogMjUsIHRleHRXcmFwOiBcInByZXR0eVwiLCBtYXhXaWR0aDogNjAwIH19PlxuICAgICAgICAgIHtlbnRyeT8udGV4dH1cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgICB7b3BlbiAmJiAoXG4gICAgICAgIDxPZmZyZUthaXJvc1NoZWV0XG4gICAgICAgICAgZW50cnk9e2VudHJ5fVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldE9wZW4oZmFsc2UpfVxuICAgICAgICAgIG9uT2ZmZXI9eygpID0+IHt9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHshb3BlbiAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJhbWVcIiBzdHlsZT17eyBwYWRkaW5nVG9wOiAwIH19PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXsoKSA9PiBzZXRPcGVuKHRydWUpfT5yb3V2cmlyIGwnb2ZmcmU8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAge3dpbmRvdy5GZWVkYmFja0Zsb2F0ICYmIDx3aW5kb3cuRmVlZGJhY2tGbG9hdCAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gMjAyNi0wNC0yNiBcdTIwMTQgUkVGT05URSBCK0QgXHUwMEE3MTEuYmlzLjVcbi8vIEFuaW1hVW5pZmllZFNjcmVlbiA6IDEgU0VVTEUgZW50clx1MDBFOWUgc2Nyb2xsYWJsZSwgNCBzZWN0aW9ucyBjYXNjYWRlXG4vLyAoVm9cdTAwRkJ0ZSAvIE1cdTAwRTl0XHUwMEU5byAvIEFubmFsZXMgLyBQb2x5cGhvbmllKS4gUGx1cyBkZSBzdWItcm91dGVzIHVzZXIuXG4vL1xuLy8gc2Nyb2xsVG9TZWN0aW9uIDogc2kgb24gYXJyaXZlIGF2ZWMgdW4gaGFzaCBkZSBzZWN0aW9uXG4vLyAoYW5pbWEtbWV0ZW8gLyBhbmltYS1hbm5hbGVzIC8gYW5pbWEtcG9seXBob25pZSksIG9uIHNjcm9sbCBhdXRvXG4vLyB2ZXJzIGxhIHNlY3Rpb24gY29ycmVzcG9uZGFudGUgYXByXHUwMEU4cyBtb3VudC5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgQU5JTUFfU0VDVElPTl9JRFMgPSB7XG4gIHZvdXRlOiBcImFuaW1hLXNlY3Rpb24tdm91dGVcIixcbiAgbWV0ZW86IFwiYW5pbWEtc2VjdGlvbi1tZXRlb1wiLFxuICBhbm5hbGVzOiBcImFuaW1hLXNlY3Rpb24tYW5uYWxlc1wiLFxuICBwb2x5cGhvbmllOiBcImFuaW1hLXNlY3Rpb24tcG9seXBob25pZVwiLFxufTtcblxuY29uc3QgQW5pbWFTZWN0aW9uRGl2aWRlciA9ICh7IGxhYmVsIH0pID0+IChcbiAgPGRpdiBzdHlsZT17e1xuICAgIG1hcmdpbjogXCJ2YXIoLS1zLTcpIGF1dG8gdmFyKC0tcy02KVwiLFxuICAgIG1heFdpZHRoOiA2MDAsXG4gICAgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGdhcDogMTYsXG4gIH19PlxuICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICBmbGV4OiAxLCBoZWlnaHQ6IDEsXG4gICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgIG9wYWNpdHk6IDAuNDUsXG4gICAgfX0gLz5cbiAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgZmxleDogXCIwIDAgYXV0b1wiLFxuICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSxcbiAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4yMmVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICBvcGFjaXR5OiAwLjYsXG4gICAgfX0+e2xhYmVsfTwvc3Bhbj5cbiAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgZmxleDogMSwgaGVpZ2h0OiAxLFxuICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICBvcGFjaXR5OiAwLjQ1LFxuICAgIH19IC8+XG4gIDwvZGl2PlxuKTtcblxuY29uc3QgQW5pbWFVbmlmaWVkU2NyZWVuID0gKHsgZ28sIHNjcm9sbFRvU2VjdGlvbiA9IG51bGwgfSkgPT4ge1xuICAvLyBEb25uXHUwMEU5ZXMgKGZldGNoIGVuIHBhcmFsbFx1MDBFOGxlKSBcdTI1MDBcdTI1MDBcbiAgY29uc3QgW3ZvdXRlLCBzZXRWb3V0ZV0gPSB1QVMobnVsbCk7XG4gIGNvbnN0IFt2b3V0ZUxvYWRpbmcsIHNldFZvdXRlTG9hZGluZ10gPSB1QVModHJ1ZSk7XG4gIGNvbnN0IFttZXRlb3MsIHNldE1ldGVvc10gPSB1QVMoW10pO1xuICBjb25zdCBbbWV0ZW9Mb2FkaW5nLCBzZXRNZXRlb0xvYWRpbmddID0gdUFTKHRydWUpO1xuICBjb25zdCBbY29ycHVzLCBzZXRDb3JwdXNdID0gdUFTKFtdKTtcbiAgY29uc3QgW2FubmFsZXNMb2FkaW5nLCBzZXRBbm5hbGVzTG9hZGluZ10gPSB1QVModHJ1ZSk7XG4gIGNvbnN0IFt0ZW51QnlJZCwgc2V0VGVudUJ5SWRdID0gdUFTKHt9KTtcbiAgY29uc3QgW3BvbHlwaG9uaWVzLCBzZXRQb2x5cGhvbmllc10gPSB1QVMoW10pO1xuICBjb25zdCBbYXJjaGl2ZSwgc2V0QXJjaGl2ZV0gPSB1QVMoW10pO1xuICBjb25zdCBbcG9seUxvYWRpbmcsIHNldFBvbHlMb2FkaW5nXSA9IHVBUyh0cnVlKTtcbiAgY29uc3QgW3Nob3dBcmNoaXZlLCBzZXRTaG93QXJjaGl2ZV0gPSB1QVMoZmFsc2UpO1xuICBjb25zdCBbcG9seUFjdGl2ZUlkeCwgc2V0UG9seUFjdGl2ZUlkeF0gPSB1QVMoMCk7XG5cbiAgLy8gU2VlZCBhbm5hbGVzIHBvdXIgbW9kZSBkXHUwMEU5bW9cbiAgY29uc3Qgc2VlZEFubmFsZXMgPSB1QU0oKCkgPT4gKFtcbiAgICB7IGlkOiBcInNlZWQtMVwiLCB0ZXh0OiBcIlVuZSBncmFuZC1tXHUwMEU4cmUgaW5jb25udWUgbGF2ZSBkdSBsaW5nZSBkYW5zIHVuZSBjdWlzaW5lIHNhbnMgZmV1LiBFbGxlIG5lIG1lIHJlZ2FyZGUgcGFzIG1haXMgc2FpdCBtb24gbm9tLlwiLCBob2xkX2NvdW50OiAyODAsIHNoYXJlZF9hdDogbnVsbCB9LFxuICAgIHsgaWQ6IFwic2VlZC0yXCIsIHRleHQ6IFwiVW4gZW5mYW50LWFuaW1hbCBxdWUgaidhaSBvdWJsaVx1MDBFOSBkZSBub3VycmlyIGRlcHVpcyBkZXMgYW5uXHUwMEU5ZXMgc29ydCBkdSBwbGFjYXJkIHZpdmFudC4gUGFzIGVuIGNvbFx1MDBFOHJlLiBTaW1wbGVtZW50IHZpdmFudC5cIiwgaG9sZF9jb3VudDogNDEwLCBzaGFyZWRfYXQ6IG51bGwgfSxcbiAgICB7IGlkOiBcInNlZWQtM1wiLCB0ZXh0OiBcIkplIHRyYXZlcnNlIHVuIHBvbnQgcXUnb24gbidhIHBhcyBmaW5pIGRlIGNvbnN0cnVpcmUuIElsIHNlIGNvbnN0cnVpdCBzb3VzIG1lcyBwaWVkcyBcdTIwMTQgbWFpcyBzZXVsZW1lbnQgc2kgamUgY29udGludWUuXCIsIGhvbGRfY291bnQ6IDE4MCwgc2hhcmVkX2F0OiBudWxsIH0sXG4gIF0pLCBbXSk7XG5cbiAgLy8gRmV0Y2ggdG91dGVzIGxlcyBzZWN0aW9ucyBlbiBwYXJhbGxcdTAwRThsZSBhdSBtb3VudFxuICB1QUUoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICBQcm9taXNlLmFsbChbXG4gICAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0Vm91dGUoKS5jYXRjaCgoKSA9PiBudWxsKSxcbiAgICAgIHdpbmRvdy5EcmVhbUFQSS5nZXRNZXRlbyh7IGxpbWl0OiA0IH0pLmNhdGNoKCgpID0+IG51bGwpLFxuICAgICAgd2luZG93LkRyZWFtQVBJLmdldEFubmFsZXMoKS5jYXRjaCgoKSA9PiBudWxsKSxcbiAgICAgIHdpbmRvdy5EcmVhbUFQSS5nZXRQb2x5cGhvbmllKHsgbGltaXQ6IDEgfSkuY2F0Y2goKCkgPT4gbnVsbCksXG4gICAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0UG9seXBob25pZUFyY2hpdmUgPyB3aW5kb3cuRHJlYW1BUEkuZ2V0UG9seXBob25pZUFyY2hpdmUoKS5jYXRjaCgoKSA9PiBudWxsKSA6IFByb21pc2UucmVzb2x2ZShudWxsKSxcbiAgICBdKS50aGVuKChbdkRhdGEsIG1EYXRhLCBhRGF0YSwgcERhdGEsIHBhRGF0YV0pID0+IHtcbiAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgIHNldFZvdXRlKHZEYXRhKTsgc2V0Vm91dGVMb2FkaW5nKGZhbHNlKTtcbiAgICAgIHNldE1ldGVvcyhtRGF0YT8ubWV0ZW9zIHx8IFtdKTsgc2V0TWV0ZW9Mb2FkaW5nKGZhbHNlKTtcbiAgICAgIGNvbnN0IGxpdmUgPSAoYURhdGE/LmNpcmN1bGF0aW5nIHx8IFtdKS5tYXAoYSA9PiAoe1xuICAgICAgICBpZDogYS5pZCwgdGV4dDogYS5jdXJhdGVkX3RleHQsIGhvbGRfY291bnQ6IGEuaG9sZF9jb3VudCB8fCAwLCBzaGFyZWRfYXQ6IGEuc2hhcmVkX2F0LFxuICAgICAgfSkpO1xuICAgICAgc2V0Q29ycHVzKGxpdmUubGVuZ3RoID4gMCA/IGxpdmUgOiBzZWVkQW5uYWxlcyk7XG4gICAgICBzZXRBbm5hbGVzTG9hZGluZyhmYWxzZSk7XG4gICAgICBzZXRQb2x5cGhvbmllcyhwRGF0YT8ucG9seXBob25pZXMgfHwgW10pO1xuICAgICAgc2V0QXJjaGl2ZShwYURhdGE/LnBvbHlwaG9uaWVzIHx8IFtdKTtcbiAgICAgIHNldFBvbHlMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICB9LCBbc2VlZEFubmFsZXNdKTtcblxuICAvLyBTY3JvbGwgdmVycyBzZWN0aW9uIHNwXHUwMEU5Y2lmaXF1ZSAoY29tcGF0IGxlZ2FjeSByb3V0ZXMgYW5pbWEtbWV0ZW8gZXRjLilcbiAgdUFFKCgpID0+IHtcbiAgICBpZiAoIXNjcm9sbFRvU2VjdGlvbikgcmV0dXJuO1xuICAgIGNvbnN0IGlkID0gQU5JTUFfU0VDVElPTl9JRFNbc2Nyb2xsVG9TZWN0aW9uXTtcbiAgICBpZiAoIWlkKSByZXR1cm47XG4gICAgLy8gRFx1MDBFOWxhaSBwb3VyIGxhaXNzZXIgbGVzIHNlY3Rpb25zIHNlIHJlbmRyZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgICAgIGlmIChlbCAmJiB0eXBlb2YgZWwuc2Nyb2xsSW50b1ZpZXcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGVsLnNjcm9sbEludG9WaWV3KHsgYmVoYXZpb3I6IFwic21vb3RoXCIsIGJsb2NrOiBcInN0YXJ0XCIgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2gge31cbiAgICB9LCA2MDApO1xuICB9LCBbc2Nyb2xsVG9TZWN0aW9uXSk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFZvXHUwMEZCdGUgXHUyNTAwXHUyNTAwXG4gIGNvbnN0IHJhd0NvdW50ID0gdm91dGU/Lm1ldGVvPy5rX2NvdW50IHx8IHZvdXRlPy5tZXRlb19vcHRpbl9jb3VudCB8fCBudWxsO1xuICBjb25zdCBodW1hbmVDb3VudCA9IHJvdW5kSHVtYW5lKHJhd0NvdW50KTtcbiAgY29uc3QgZGVuc2l0eSA9IHVBTSgoKSA9PiB7XG4gICAgaWYgKCFyYXdDb3VudCB8fCByYXdDb3VudCA8IDUwKSByZXR1cm4gNjA7XG4gICAgcmV0dXJuIE1hdGgubWluKDE0MCwgNTAgKyBNYXRoLnJvdW5kKHJhd0NvdW50IC8gNjAwKSk7XG4gIH0sIFtyYXdDb3VudF0pO1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBNXHUwMEU5dFx1MDBFOW8gXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGxhdGVzdE1ldGVvID0gbWV0ZW9zWzBdO1xuICBjb25zdCBwb2V0aWMgPSBsYXRlc3RNZXRlbz8ucG9ldGljX3BocmFzZVxuICAgIHx8IGxhdGVzdE1ldGVvPy5oZWFkbGluZVxuICAgIHx8IChsYXRlc3RNZXRlbz8udG9wX21vdGlmcz8ubGVuZ3RoXG4gICAgICAgID8gY29tcG9zZU1ldGVvUGhyYXNlKGxhdGVzdE1ldGVvLnRvcF9tb3RpZnNbMF0pXG4gICAgICAgIDogXCJDZXR0ZSBsdW5lLCBsJ2h1bWFuaXRcdTAwRTkgYSByXHUwMEVBdlx1MDBFOSBkJ2VhdS4gUGFzIGRlIHRlbXBcdTAwRUF0ZXMgXHUyMDE0IGQnZWF1IHF1aSBzZSBjaGVyY2hlIHVuIGxpdC5cIik7XG4gIGNvbnN0IG1haW5Nb3RpZiA9IGxhdGVzdE1ldGVvPy50b3BfbW90aWZzPy5bMF0/Lm1vdGlmXG4gICAgfHwgbGF0ZXN0TWV0ZW8/LnRvcF9tb3RpZnM/LlswXT8ubGFiZWxcbiAgICB8fCBcImVhdVwiO1xuICBjb25zdCBtYXR0ZXJLaW5kID0gbW90aWZUb01hdHRlcihtYWluTW90aWYpO1xuICBjb25zdCBjbG91ZHMgPSBjb21wb3NlQ2xvdWRzKGxhdGVzdE1ldGVvKTtcblxuICAvLyBcdTI1MDBcdTI1MDAgQW5uYWxlcyBcdTI1MDBcdTI1MDBcbiAgY29uc3QgZGlzcGxheUFubmFsZXMgPSB1QU0oKCkgPT4ge1xuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCBzZWVkRGF5ID0gdG9kYXkuZ2V0RnVsbFllYXIoKSAqIDEwMDAgKyBNYXRoLmZsb29yKFxuICAgICAgKHRvZGF5IC0gbmV3IERhdGUodG9kYXkuZ2V0RnVsbFllYXIoKSwgMCwgMCkpIC8gKDI0ICogMzYwMCAqIDEwMDApXG4gICAgKTtcbiAgICByZXR1cm4gc2h1ZmZsZVNlZWRlZChjb3JwdXMsIHNlZWREYXkpLnNsaWNlKDAsIDUpO1xuICB9LCBbY29ycHVzXSk7XG4gIGNvbnN0IHRlbmlyID0gYXN5bmMgKGlkKSA9PiB7XG4gICAgaWYgKHRlbnVCeUlkW2lkXSkgcmV0dXJuO1xuICAgIHNldFRlbnVCeUlkKHQgPT4gKHsgLi4udCwgW2lkXTogdHJ1ZSB9KSk7XG4gICAgdHJ5IHsgYXdhaXQgd2luZG93LkRyZWFtQVBJLnRlbmlyQW5uYWxlKGlkKTsgfSBjYXRjaCB7fVxuICB9O1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBQb2x5cGhvbmllIFx1MjUwMFx1MjUwMFxuICBjb25zdCBwb2x5UG9vbCA9IHVBTSgoKSA9PiB7XG4gICAgY29uc3QgY3VycmVudCA9IHBvbHlwaG9uaWVzWzBdO1xuICAgIGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcbiAgICBpZiAoY3VycmVudCkgbWFwLnNldChjdXJyZW50LmlkLCBjdXJyZW50KTtcbiAgICBhcmNoaXZlLmZvckVhY2gocCA9PiB7IGlmICghbWFwLmhhcyhwLmlkKSkgbWFwLnNldChwLmlkLCBwKTsgfSk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20obWFwLnZhbHVlcygpKTtcbiAgfSwgW3BvbHlwaG9uaWVzLCBhcmNoaXZlXSk7XG4gIGNvbnN0IHBvbHlBY3RpdmUgPSBwb2x5UG9vbFtwb2x5QWN0aXZlSWR4XSB8fCBwb2x5cGhvbmllc1swXSB8fCBudWxsO1xuICBjb25zdCBsdW5hckxhYmVsID0gcG9seUFjdGl2ZT8ubHVuYXJfcGhhc2UgfHwgXCJsZWN0dXJlIGxvbmd1ZVwiO1xuICBjb25zdCB2b2ljZXMgPSBwb2x5QWN0aXZlPy52b2ljZXNfbW9iaWxpc2VlcyB8fCBbXTtcbiAgY29uc3QgZm10TW9udGggPSAoaXNvKSA9PiB7XG4gICAgaWYgKCFpc28pIHJldHVybiBcIlwiO1xuICAgIHJldHVybiBuZXcgRGF0ZShpc28pLnRvTG9jYWxlRGF0ZVN0cmluZyhcImZyLUZSXCIsIHsgbW9udGg6IFwibG9uZ1wiLCB5ZWFyOiBcIm51bWVyaWNcIiB9KTtcbiAgfTtcbiAgY29uc3QgcG9seUZhbGxiYWNrID0gYFBsdXNpZXVycyBvbnQgclx1MDBFQXZcdTAwRTkgZCdlYXUgY2V0dGUgbHVuZS4gUGFzIGRlIHRlbXBcdTAwRUF0ZXMgXHUyMDE0IGQnZWF1IHF1aSBzZSBjaGVyY2hlIHVuIGxpdCwgZCdlc3R1YWlyZXMgcXVpIHNlIGZvcm1lbnQuIEV0IHBsdXNpZXVycyBvbnQgXHUwMEU5Y3JpdCBkZXMgZG91dGVzIHN1ciBsZXVyIHRyYXZhaWwsIHN1ciBjZSBxdSdpbCBmYXV0IHRlbmlyIGV0IGNlIHF1J2lsIGZhdXQgbFx1MDBFMmNoZXIuXG5cblx1MDBDMCBsYSBsdW1pXHUwMEU4cmUgZGUgQmFjaGVsYXJkLCBvbiBwb3VycmFpdCBlbnRlbmRyZSBkYW5zIGNlcyBlYXV4IGNoZXJjaGFudCBsZXVyIGxpdCBsYSBtXHUwMEVBbWUgY2hvc2UgcXVlIGRhbnMgY2VzIHF1ZXN0aW9ucyBkZSBzZXVpbCA6IHVuZSBmbHVpZGl0XHUwMEU5IHF1aSBkZW1hbmRlIFx1MDBFMCBzZSBwb3NlciBxdWVscXVlIHBhcnQsIHNhbnMgZW5jb3JlIHNhdm9pciBvXHUwMEY5LlxuXG5BaXplbnN0YXQgYXVyYWl0IGludml0XHUwMEU5IFx1MDBFMCB0ZW5pciBsYSBncmFuZC1tXHUwMEU4cmUgcXVpIHJldmllbnQgXHUyMDE0IHBsdXNpZXVycyBsJ29udCB2dWUgY2V0dGUgbHVuZSwgZGFucyBkZXMgY3Vpc2luZXMgc2FucyBmZXUsIGF2ZWMgZHUgbGluZ2UgXHUwMEUwIGxhdmVyLlxuXG5RdWUgc2UgY2hlcmNoZS10LWVsbGUsIGwnZWF1IHF1aSBjaGVyY2hlIHNvbiBsaXQgP2A7XG4gIGNvbnN0IHBvbHlUZXh0ID0gcG9seUFjdGl2ZT8ubmFycmF0aXZlX3RleHQgfHwgcG9seUZhbGxiYWNrO1xuICBjb25zdCBwb2x5UGFyYWdyYXBocyA9IHBvbHlUZXh0LnNwbGl0KC9cXG5cXG4rLykuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIgfX0+XG4gICAgICA8Q2hhbWJlckJhY2tncm91bmQgaW50ZW5zaXR5PXswLjg1fSAvPlxuXG4gICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgSGFsb1Jlc3BpcmUgc2lsayBnXHUwMEU5YW50IChZZXNodWEsIHZvXHUwMEZCdGUgdG9wLCA5MHZ3LCBvcGFjaXR5IDAuNCkgKi99XG4gICAgICB7d2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogMzAsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgICAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVgoLTUwJSlcIixcbiAgICAgICAgICB3aWR0aDogXCI5MHZ3XCIsIG1heFdpZHRoOiA4MDAsIGhlaWdodDogMzYwLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNDAsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cInNpbGtcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiAyMDI2LTA0LTI5IFx1MjAxNCBTb25nbGluZXMgZHJpZnQgZW4gYmFja2dyb3VuZCAoWWVzaHVhLCBvcGFjaXR5IDAuMTIsIDEycyBkcmlmdCkgKi99XG4gICAgICB7d2luZG93Lkdlb1N5bWJvbCAmJiAoXG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAwLjEyLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAwLFxuICAgICAgICAgIGFuaW1hdGlvbjogXCJkcmlmdC1kZXJpdmUgMTJzIGxpbmVhciBpbmZpbml0ZSBhbHRlcm5hdGVcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHdpbmRvdy5HZW9TeW1ib2wga2luZD1cInNvbmdsaW5lc1wiIGNvbG9yPVwic2lsa1wiXG4gICAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IFwiMTAwJVwiLCBvcGFjaXR5OiAxIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEgfX0+XG4gICAgICAgIDx3aW5kb3cuVG9wTmF2IC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJhbWVcIiBzdHlsZT17eyBwYWRkaW5nQm90dG9tOiAxNDAsIG1heFdpZHRoOiA3MjAsIG1hcmdpbjogXCIwIGF1dG9cIiB9fT5cblxuICAgICAgICAgIHsvKiBcdTI1MDBcdTI1MDAgU0VDVElPTiAxIFx1MDBCNyBWT1x1MDBEQlRFIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgICAgICA8c2VjdGlvbiBpZD17QU5JTUFfU0VDVElPTl9JRFMudm91dGV9PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1hcmdpblRvcDogXCJ2YXIoLS1zLTQpXCIsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE1LjUsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAxZW1cIiwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IHZvdXRlTG9hZGluZyA/IDAgOiAwLjksXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAxMjAwbXMgdmFyKC0tZWFzZS1yZXNwaXJlKVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbmVDb3VudFxuICAgICAgICAgICAgICAgID8gPD5DZXR0ZSBsdW5lLCBsJ2h1bWFuaXRcdTAwRTkgYSB0aXNzXHUwMEU5IGVudmlyb24ge2ZyTnVtYmVyKGh1bWFuZUNvdW50KX0gbW9tZW50cy48Lz5cbiAgICAgICAgICAgICAgICA6IDw+Q2V0dGUgbHVuZSwgZGVzIHZvaXggc2UgcmFzc2VtYmxlbnQgZGFucyBsYSBudWl0LjwvPn1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8Q29uc3RlbGxhdGlvbkJyZWF0aGluZyBkZW5zaXR5PXtkZW5zaXR5fSAvPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiBcInZhcigtLXMtMylcIixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTMsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjE4ZW1cIiwgdGV4dFRyYW5zZm9ybTogXCJsb3dlcmNhc2VcIixcbiAgICAgICAgICAgICAgb3BhY2l0eTogMC41NSxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBhbmltYSBtdW5kaVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgey8qIFx1MjUwMFx1MjUwMCBTRUNUSU9OIDIgXHUwMEI3IE1cdTAwQzlUXHUwMEM5TyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICAgICAgPEFuaW1hU2VjdGlvbkRpdmlkZXIgbGFiZWw9XCJtXHUwMEU5dFx1MDBFOW9cIiAvPlxuICAgICAgICAgIDxzZWN0aW9uIGlkPXtBTklNQV9TRUNUSU9OX0lEUy5tZXRlb30+XG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMiwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDYwMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgdmFyKC0tcy01KSAwXCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IG1ldGVvTG9hZGluZyA/IDAuNCA6IDEsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSA5MjBtcyB2YXIoLS1lYXNlLXJlc3BpcmUpXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge21ldGVvTG9hZGluZyA/IFwibGEgbVx1MDBFOXRcdTAwRTlvIHNlIGNvbXBvc2VcdTIwMjZcIiA6IHBvZXRpY31cbiAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTUpXCIgfX0+XG4gICAgICAgICAgICAgIDxNYXR0ZXJHbHlwaCBraW5kPXttYXR0ZXJLaW5kfSAvPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxMixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge21haW5Nb3RpZn1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFja1wiIHN0eWxlPXt7IGdhcDogMTggfX0+XG4gICAgICAgICAgICAgIHtjbG91ZHMuc2xpY2UoMCwgNSkubWFwKCh0LCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgPHAga2V5PXtpfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE3LCBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC45LFxuICAgICAgICAgICAgICAgIH19Pnt0fTwvcD5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgICB7LyogXHUyNTAwXHUyNTAwIFNFQ1RJT04gMyBcdTAwQjcgQU5OQUxFUyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDAgKi99XG4gICAgICAgICAgPEFuaW1hU2VjdGlvbkRpdmlkZXIgbGFiZWw9XCJ0ZW51IGVuc2VtYmxlXCIgLz5cbiAgICAgICAgICA8c2VjdGlvbiBpZD17QU5JTUFfU0VDVElPTl9JRFMuYW5uYWxlc30+XG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICBtYXhXaWR0aDogNTgwLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgICAgbWFyZ2luOiBcIjAgMCB2YXIoLS1zLTUpIDBcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBDZXMgclx1MDBFQXZlcyBvbnQgXHUwMEU5dFx1MDBFOSBvZmZlcnRzIFx1MDBFMCBsYSB2b1x1MDBGQnRlIGNvbW11bmUuIE5vdXMgbGVzIHRlbm9ucyBcdTIwMTRcbiAgICAgICAgICAgICAgbm9uIHBvdXIgbGVzIGNvbXByZW5kcmUsIG1haXMgcGFyY2UgcXUnaWxzIG5vdXMgcmVnYXJkZW50LlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICB7YW5uYWxlc0xvYWRpbmcgJiYgY29ycHVzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNSkgMFwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBsZXMgYW5uYWxlcyBzZSByYXNzZW1ibGVudFx1MjAyNlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2tcIiBzdHlsZT17eyBnYXA6IDI0IH19PlxuICAgICAgICAgICAgICAgIHtkaXNwbGF5QW5uYWxlcy5tYXAoZCA9PiAoXG4gICAgICAgICAgICAgICAgICA8QW5uYWxlQ2FyZCBrZXk9e2QuaWR9XG4gICAgICAgICAgICAgICAgICAgIGFubmFsZT17ZH1cbiAgICAgICAgICAgICAgICAgICAgdGVudT17ISF0ZW51QnlJZFtkLmlkXX1cbiAgICAgICAgICAgICAgICAgICAgb25UZW5pcj17KCkgPT4gdGVuaXIoZC5pZCl9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICAgICAgey8qIFx1MjUwMFx1MjUwMCBTRUNUSU9OIDQgXHUwMEI3IFBPTFlQSE9OSUUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAgICAgIDxBbmltYVNlY3Rpb25EaXZpZGVyIGxhYmVsPVwicG9seXBob25pZSBkZSBsYSBsdW5lXCIgLz5cbiAgICAgICAgICA8c2VjdGlvbiBpZD17QU5JTUFfU0VDVElPTl9JRFMucG9seXBob25pZX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3BvbHlBY3RpdmVJZHggPT09IDAgPyA8Plx1MDBCNyB7bHVuYXJMYWJlbH08Lz4gOiA8Plx1MDBCNyBsZWN0dXJlIHByXHUwMEU5Y1x1MDBFOWRlbnRlIFx1MDBCNyB7Zm10TW9udGgocG9seUFjdGl2ZT8ucGVyaW9kX2VuZCl9PC8+fVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE4LCBsaW5lSGVpZ2h0OiAxLjc1LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICBtYXhXaWR0aDogNjAwLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwianVzdGlmeVwiLFxuICAgICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7cG9seUxvYWRpbmcgPyAoXG4gICAgICAgICAgICAgICAgd2luZG93LlBvbHlwaG9uaWVMZXR0ZXJTa2VsZXRvblxuICAgICAgICAgICAgICAgICAgPyA8d2luZG93LlBvbHlwaG9uaWVMZXR0ZXJTa2VsZXRvbiAvPlxuICAgICAgICAgICAgICAgICAgOiA8cCBzdHlsZT17eyBmb250U3R5bGU6IFwiaXRhbGljXCIsIG9wYWNpdHk6IDAuNSB9fT5sYSBwb2x5cGhvbmllIHMnXHUwMEU5Y3JpdFx1MjAyNjwvcD5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICBwb2x5UGFyYWdyYXBocy5tYXAoKHBhcmEsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgIDxwIGtleT17aX0gc3R5bGU9e3sgbWFyZ2luOiBcIjAgMCAxLjRlbSAwXCIsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PntwYXJhfTwvcD5cbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiBcInZhcigtLXMtNSlcIiwgcGFkZGluZ1RvcDogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtZGVlcCkgNjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTMsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgb3BhY2l0eTogMC44NSwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgdm9peCBtb2JpbGlzXHUwMEU5ZXMgY2V0dGUgbHVuZSBcdTAwQjd7XCIgXCJ9XG4gICAgICAgICAgICAgIHt2b2ljZXMubGVuZ3RoID4gMCA/IHZvaWNlcy5qb2luKFwiLCBcIikgOiBcIkFpemVuc3RhdCwgTW9zcywgQmFjaGVsYXJkXCJ9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAge3BvbHlQb29sLmxlbmd0aCA+IDEgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogXCJ2YXIoLS1zLTUpXCIgfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U2hvd0FyY2hpdmUocyA9PiAhcyl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiOHB4IDBcIixcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246IFwidW5kZXJsaW5lXCIsXG4gICAgICAgICAgICAgICAgICAgIHRleHREZWNvcmF0aW9uQ29sb3I6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgICAgIHRleHRVbmRlcmxpbmVPZmZzZXQ6IDYsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHtzaG93QXJjaGl2ZSA/IFwicmVmZXJtZXIgbGVzIGxlY3R1cmVzIHByXHUwMEU5Y1x1MDBFOWRlbnRlc1wiIDogXCJsZWN0dXJlcyBwclx1MDBFOWNcdTAwRTlkZW50ZXNcIn1cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cblxuICAgICAgICAgICAgICAgIHtzaG93QXJjaGl2ZSAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrXCIgc3R5bGU9e3sgZ2FwOiA2LCBtYXJnaW5Ub3A6IFwidmFyKC0tcy00KVwiIH19PlxuICAgICAgICAgICAgICAgICAgICB7cG9seVBvb2wubWFwKChwLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3AuaWQgfHwgaX1cbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0UG9seUFjdGl2ZUlkeChpKTsgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgPT09IHBvbHlBY3RpdmVJZHhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDglLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgKGkgPT09IHBvbHlBY3RpdmVJZHhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI4JSwgdmFyKC0tYXNoLWRlZXApKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBcInZhcigtLWFzaC1kZWVwKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGkgPT09IHBvbHlBY3RpdmVJZHggPyBcInZhcigtLWJvbmUpXCIgOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxNHB4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRBbGlnbjogXCJsZWZ0XCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIHZhcigtLWVhc2UtcmVzcGlyZSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge2kgPT09IDAgPyBcImx1bmUgYWN0dWVsbGVcIiA6IChwLmx1bmFyX3BoYXNlIHx8IGZtdE1vbnRoKHAucGVyaW9kX2VuZCkgfHwgXCJsZWN0dXJlIHByXHUwMEU5Y1x1MDBFOWRlbnRlXCIpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L3NlY3Rpb24+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgMjAyNi0wNC0yNyBcdTIwMTQgU3ByaW50IFAwLjUgKERlc2lnbiBcdTAwQTcxMS5iaXMuMTkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUG9seXBob25pZUxldHRlclNrZWxldG9uIDogMTItMTUgbGlnbmVzIEVCIEdhcmFtb25kIGp1c3RpZnkgc2hpbW1lclxuLy8gKyBMb2FkaW5nSGFsbyArIG1lc3NhZ2Ugcm90YXRpbmcgXCJsYSBwb2x5cGhvbmllIHMnXHUwMEU5Y3JpdFx1MjAyNlwiLlxuZnVuY3Rpb24gUG9seXBob25pZUxldHRlclNrZWxldG9uKCkge1xuICBjb25zdCBTaGltID0gd2luZG93LlNrZWxldG9uU2hpbW1lcjtcbiAgY29uc3QgSGFsbyA9IHdpbmRvdy5Mb2FkaW5nSGFsbztcbiAgY29uc3QgdXNlUm90YXRpbmcgPSB3aW5kb3cudXNlUm90YXRpbmdNZXNzYWdlO1xuICBjb25zdCBtZXNzYWdlcyA9IFtcbiAgICBcImxhIHBvbHlwaG9uaWUgcydcdTAwRTljcml0XHUyMDI2XCIsXG4gICAgXCJsZXMgdm9peCBzZSBjaGVyY2hlbnRcdTIwMjZcIixcbiAgICBcInRpc3NlciBsYSBsdW5lXHUyMDI2XCIsXG4gIF07XG4gIGNvbnN0IG1lc3NhZ2UgPSB1c2VSb3RhdGluZyA/IHVzZVJvdGF0aW5nKG1lc3NhZ2VzLCAyNDAwKSA6IG1lc3NhZ2VzWzBdO1xuXG4gIGlmICghU2hpbSB8fCAhSGFsbykge1xuICAgIHJldHVybiA8cCBzdHlsZT17eyBmb250U3R5bGU6IFwiaXRhbGljXCIsIG9wYWNpdHk6IDAuNSB9fT57bWVzc2FnZX08L3A+O1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRyZWFtLXNrZWxldG9uLWZhZGUtaW5cIiBzdHlsZT17e1xuICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogMTgsXG4gICAgfX0+XG4gICAgICB7LyogMyBwYXJhZ3JhcGhlcyBzaW11bFx1MDBFOXMsIDQtNSBsaWduZXMgY2hhY3VuLCBqdXN0aWZ5ICovfVxuICAgICAge1s1LCA0LCA0XS5tYXAoKGxpbmVzLCBwKSA9PiAoXG4gICAgICAgIDxTaGltIGtleT17cH0gbGluZXM9e2xpbmVzfSBoZWlnaHQ9ezEzfSBnYXA9ezExfSBkYXJrPXt0cnVlfSBsYXN0TGluZVdpZHRoPXtwID09PSAyID8gXCI0NSVcIiA6IFwiODIlXCJ9IC8+XG4gICAgICApKX1cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBwYWRkaW5nVG9wOiA4IH19PlxuICAgICAgICA8SGFsbyBzaXplPXsyNn0gbWVzc2FnZT17bWVzc2FnZX0gZGFyaz17dHJ1ZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxud2luZG93LlBvbHlwaG9uaWVMZXR0ZXJTa2VsZXRvbiA9IFBvbHlwaG9uaWVMZXR0ZXJTa2VsZXRvbjtcblxuLy8gXHUyNTAwXHUyNTAwIENvbXBhdCBhbGlhcyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIEFubmFsZXNTY3JlZW4gcmVzdGUgZXhwb3NcdTAwRTkgcG91ciBuZSBwYXMgY2Fzc2VyIGRlcyBsaWVucyBleGlzdGFudHNcbi8vIChyb3V0ZSBsZWdhY3kgYGFubmFsZXNgIGNvbnRpbnVlIFx1MDBFMCBwb2ludGVyIHZlcnMgbGEgY2hhbWJyZSAzKS5cbmNvbnN0IEFubmFsZXNTY3JlZW4gPSBBbmltYUFubmFsZXNTY3JlZW47XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gIC8vIDQgY2hhbWJyZXMgY2Fub25pcXVlcyAoZ2FyZFx1MDBFOWVzIHBvdXIgY29tcGF0IC8gZmFsbGJhY2spXG4gIEFuaW1hVm91dGVTY3JlZW4sXG4gIEFuaW1hTWV0ZW9TY3JlZW4sXG4gIEFuaW1hQW5uYWxlc1NjcmVlbixcbiAgQW5pbWFQb2x5cGhvbmllU2NyZWVuLFxuICAvLyAyMDI2LTA0LTI2IFx1MjAxNCBCK0QgOiAxIFx1MDBFOWNyYW4gc2Nyb2xsYWJsZSBjYXNjYWRlIChEZXNpZ24gXHUwMEE3MTEuYmlzLjUpXG4gIEFuaW1hVW5pZmllZFNjcmVlbixcbiAgLy8gbGVnYWN5IC8gY29tcGF0XG4gIEFubmFsZXNTY3JlZW4sXG4gIE9mZnJlS2Fpcm9zU2NyZWVuLFxuICBPZmZyZUthaXJvc1NoZWV0LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFtQkEsTUFBTSxFQUFFLFVBQVUsS0FBSyxXQUFXLEtBQUssU0FBUyxLQUFLLFFBQVEsSUFBSSxJQUFJO0FBR3JFLFNBQVMsWUFBWSxHQUFHO0FBQ3RCLE1BQUksQ0FBQyxLQUFLLElBQUksR0FBSSxRQUFPO0FBQ3pCLE1BQUksSUFBSSxJQUFNLFFBQU8sS0FBSyxNQUFNLElBQUksRUFBRSxJQUFJO0FBQzFDLE1BQUksSUFBSSxJQUFPLFFBQU8sS0FBSyxNQUFNLElBQUksR0FBRyxJQUFJO0FBQzVDLE1BQUksSUFBSSxJQUFRLFFBQU8sS0FBSyxNQUFNLElBQUksR0FBSSxJQUFJO0FBQzlDLFNBQU8sS0FBSyxNQUFNLElBQUksR0FBSyxJQUFJO0FBQ2pDO0FBRUEsU0FBUyxTQUFTLEdBQUc7QUFDbkIsTUFBSSxLQUFLLEtBQU0sUUFBTztBQUN0QixTQUFPLEVBQUUsZUFBZSxPQUFPLEVBQUUsUUFBUSxrQkFBa0IsR0FBRztBQUNoRTtBQUdBLFNBQVMsWUFBWSxHQUFHO0FBQ3RCLE1BQUksQ0FBQyxLQUFLLElBQUksRUFBRyxRQUFPO0FBQ3hCLE1BQUksSUFBSSxHQUFJLFFBQU8sS0FBSyxJQUFJLElBQUksS0FBSyxNQUFNLElBQUksRUFBRSxJQUFJLEVBQUU7QUFDdkQsTUFBSSxJQUFJLElBQUssUUFBTyxLQUFLLE1BQU0sSUFBSSxFQUFFLElBQUk7QUFDekMsTUFBSSxJQUFJ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
