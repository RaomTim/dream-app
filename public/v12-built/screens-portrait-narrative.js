const { useState: pS, useEffect: pE, useRef: pR } = React;
const TOGGLES = [
  { key: "day", label: "vie de jour", glyph: "\u2609" },
  { key: "crossed", label: "les deux qui se croisent", glyph: "\u232C" },
  { key: "night", label: "vie de nuit", glyph: "\u263E" }
];
const PERIODS = [
  { key: "lune", label: "cette lune" },
  { key: "saison", label: "cette saison" },
  { key: "annee", label: "cette ann\xE9e" },
  { key: "always", label: "toujours" }
];
function paletteFor(toggle) {
  if (toggle === "day") {
    return {
      "--p-bg": "var(--day-paper, oklch(0.92 0.018 75))",
      "--p-card": "var(--day-linen, oklch(0.88 0.022 70))",
      "--p-text": "var(--day-bone-warm, oklch(0.65 0.025 65))",
      "--p-meta": "var(--day-ash-soft, oklch(0.50 0.015 65))",
      "--p-accent": "var(--day-clay-warm, oklch(0.78 0.045 60))",
      "--p-glow": "var(--day-sun-low, oklch(0.72 0.090 75))"
    };
  }
  if (toggle === "night") {
    return {
      "--p-bg": "var(--night-floor)",
      "--p-card": "color-mix(in oklch, var(--night-warm) 80%, var(--ash-deep))",
      "--p-text": "var(--bone)",
      "--p-meta": "var(--ash-light)",
      "--p-accent": "var(--silk-gold)",
      "--p-glow": "var(--ember-live)"
    };
  }
  return {
    "--p-bg": "color-mix(in oklch, var(--day-paper, #EBE2D2) 50%, var(--night-floor))",
    "--p-card": "color-mix(in oklch, var(--day-linen, #DFD3BF) 30%, var(--night-warm))",
    "--p-text": "color-mix(in oklch, var(--day-bone-warm, #9F8E7C) 50%, var(--bone))",
    "--p-meta": "color-mix(in oklch, var(--day-ash-soft, #776E62) 60%, var(--ash-light))",
    "--p-accent": "var(--silk-gold)",
    "--p-glow": "var(--day-sun-low, #C5A672)"
  };
}
function PortraitLetterSkeleton({ toggle }) {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const isNight = toggle === "night";
  const isDay = toggle === "day";
  const messages = isDay ? ["lire ton jour\u2026", "\xE9couter le soleil\u2026", "tisser ce moment\u2026"] : isNight ? ["chercher tes patterns\u2026", "\xE9couter la lune\u2026", "tisser ce moment\u2026"] : ["tisser ce moment\u2026", "chercher tes patterns\u2026", "\xE9couter la lune\u2026"];
  const message = useRotating ? useRotating(messages, 2200) : messages[0];
  if (!Shim || !Halo) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      padding: "60px 0"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      border: "1px solid var(--p-accent)",
      animation: "halo-slow 2.5s ease-in-out infinite"
    } }), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 13,
      color: "var(--p-meta)"
    } }, message));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "dream-skeleton-fade-in", style: {
    background: "var(--p-card)",
    padding: "32px 28px",
    borderLeft: "3px solid var(--p-accent)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    position: "relative",
    overflow: "hidden"
  } }, window.HaloRespire && !isDay && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(280px, 70%)",
    height: "min(280px, 70%)",
    opacity: 0.45,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--p-meta)",
    textTransform: "uppercase",
    position: "relative",
    zIndex: 1
  } }, "la lettre du moment"), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(Shim, { lines: 8, height: 14, gap: 14, dark: !isDay, lastLineWidth: "58%" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", paddingTop: 8, position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(Halo, { size: 28, message, dark: !isDay })));
}
function PortraitNarrative({ go }) {
  const [toggle, setToggle] = pS("crossed");
  const [period, setPeriod] = pS("lune");
  const [reading, setReading] = pS(null);
  const [loading, setLoading] = pS(true);
  const [regenerating, setRegenerating] = pS(false);
  const [showEchoArc, setShowEchoArc] = pS(false);
  const pal = paletteFor(toggle);
  pE(() => {
    if (!reading || !reading.lettre || reading.error) return;
    const lower = reading.lettre.toLowerCase();
    const hasEcho = /\béch[oô]s?\b|\brésonn(e|ent|ance|ances)\b|\bresonn(e|ent|ance|ances)\b|\bse fait écho\b/.test(lower);
    if (hasEcho) {
      const t = setTimeout(() => setShowEchoArc(true), 800);
      const t2 = setTimeout(() => setShowEchoArc(false), 800 + 4400);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [reading == null ? void 0 : reading.lettre]);
  const fetchReading = async (force = false) => {
    setLoading(true);
    if (force) setRegenerating(true);
    try {
      const r = await window.DreamAPI.getPortraitNarrative({ toggle, period, force });
      setReading(r);
    } catch (e) {
      console.warn("[Portrait] fetch failed:", e.message);
      setReading({ lettre: "L'app n'a pas pu lire ce moment. Reviens dans un instant.", error: true });
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };
  pE(() => {
    fetchReading(false);
  }, [toggle, period]);
  return /* @__PURE__ */ React.createElement("div", { style: {
    ...pal,
    background: "var(--p-bg)",
    color: "var(--p-text)",
    minHeight: "100vh",
    paddingBottom: 100,
    transition: "background 920ms cubic-bezier(0.45,0,0.15,1), color 920ms ease",
    position: "relative",
    overflow: "hidden"
  } }, window.Surface && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.18,
    zIndex: 0,
    pointerEvents: "none",
    transition: "opacity 920ms ease"
  } }, /* @__PURE__ */ React.createElement(
    window.Surface,
    {
      matter: toggle === "day" ? "paper" : toggle === "night" ? "stone" : "silk",
      motion: true,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    }
  )), window.GeoSymbol && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: "32%",
    left: "50%",
    width: "min(420px, 80vw)",
    height: "min(420px, 80vw)",
    transform: "translate(-50%, -30%)",
    opacity: 0.14,
    pointerEvents: "none",
    zIndex: 0,
    animation: "breathe-souffle 8s ease-in-out infinite"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: "concentric",
      color: "silk",
      style: { width: "100%", height: "100%" }
    }
  )), window.HaloRespire && reading && !loading && toggle !== "day" && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: "30%",
    left: "50%",
    width: "min(560px, 92vw)",
    height: "min(420px, 60vh)",
    transform: "translateX(-50%)",
    opacity: 0.32,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60vw",
    maxWidth: 600,
    height: 130,
    opacity: 0.4,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      viewBox: "0 0 600 130",
      preserveAspectRatio: "none",
      style: { width: "100%", height: "100%", overflow: "visible" }
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 0 120 Q 300 -30, 600 120",
        fill: "none",
        stroke: "url(#aurore-gradient)",
        strokeWidth: "1.2",
        style: { animation: "breathe-souffle 8s ease-in-out infinite" }
      }
    ),
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 30 120 Q 300 0, 570 120",
        fill: "none",
        stroke: "url(#aurore-gradient)",
        strokeWidth: "0.7",
        opacity: "0.55"
      }
    )
  )), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid color-mix(in oklch, var(--p-accent) 20%, transparent)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--p-meta)",
    letterSpacing: "0.02em"
  } }, "ton portrait \xB7 lune d\xE9croissante"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("portrait-carte"),
      title: "voir ma carte",
      "aria-label": "voir ma carte",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--p-meta)",
        fontSize: 18,
        padding: "4px 8px",
        opacity: 0.7
      }
    },
    "\u2736"
  )), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 24px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
    marginBottom: 14
  } }, TOGGLES.map((t) => {
    const active = toggle === t.key;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.key,
        onClick: () => setToggle(t.key),
        style: {
          // 2026-04-30 ampli : actif = matter accent doux + glyphe agrandi
          // au lieu de plein-bloc accent. Plus contemplatif, moins UI brute.
          background: active ? "color-mix(in oklch, var(--p-accent) 18%, transparent)" : "transparent",
          color: active ? "var(--p-accent)" : "var(--p-text)",
          border: active ? "1px solid var(--p-accent)" : "1px solid color-mix(in oklch, var(--p-accent) 30%, transparent)",
          padding: "12px 8px 10px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 13,
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          position: "relative",
          overflow: "hidden"
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: active ? 22 : 17,
        opacity: active ? 1 : 0.6,
        transition: "all 380ms ease",
        lineHeight: 1
      } }, t.glyph),
      /* @__PURE__ */ React.createElement("span", null, t.label),
      active && /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
        position: "absolute",
        bottom: 0,
        left: "20%",
        right: "20%",
        height: 2,
        background: "var(--p-accent)",
        opacity: 0.7,
        animation: "breathe-souffle 6s ease-in-out infinite"
      } })
    );
  })), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 4,
    justifyContent: "center",
    flexWrap: "wrap"
  } }, PERIODS.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.key,
      onClick: () => setPeriod(p.key),
      style: {
        background: period === p.key ? "color-mix(in oklch, var(--p-accent) 30%, transparent)" : "transparent",
        color: period === p.key ? "var(--p-text)" : "var(--p-meta)",
        border: "none",
        padding: "6px 12px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 280ms ease",
        opacity: period === p.key ? 1 : 0.6
      }
    },
    p.label
  )))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px", position: "relative", zIndex: 2 } }, loading && !reading ? /* @__PURE__ */ React.createElement(PortraitLetterSkeleton, { toggle }) : reading ? /* @__PURE__ */ React.createElement("div", { style: {
    background: "var(--p-card)",
    padding: "32px 28px",
    borderLeft: "3px solid var(--p-accent)",
    position: "relative",
    // subtle inner shadow pour ancrer la lettre au-dessus du halo
    boxShadow: "0 1px 0 color-mix(in oklch, var(--p-accent) 18%, transparent), 0 8px 32px -16px color-mix(in oklch, var(--p-accent) 12%, transparent)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--p-meta)",
    textTransform: "uppercase",
    marginBottom: 16
  } }, "la lettre du moment"), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontSize: 18,
    lineHeight: 1.75,
    color: "var(--p-text)",
    fontStyle: "italic",
    whiteSpace: "pre-wrap",
    marginBottom: 24,
    textWrap: "pretty"
  } }, reading.lettre), reading.voix_mobilisees && reading.voix_mobilisees.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    fontSize: 12.5,
    color: "var(--p-meta)",
    fontStyle: "italic",
    fontFamily: "var(--serif)",
    marginTop: 4,
    padding: "12px 14px",
    background: toggle === "day" ? "transparent" : "color-mix(in oklch, var(--p-accent) 8%, transparent)",
    borderTop: "1px solid color-mix(in oklch, var(--p-accent) 22%, transparent)",
    borderLeft: toggle !== "day" ? "1px solid color-mix(in oklch, var(--p-accent) 28%, transparent)" : "none",
    letterSpacing: "0.01em",
    lineHeight: 1.6
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--mono)",
    fontSize: 9.5,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    opacity: 0.7,
    marginRight: 8
  } }, "voix tiss\xE9es"), reading.voix_mobilisees.join(" \xB7 ")), !reading.error && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => fetchReading(true),
      disabled: regenerating,
      style: {
        marginTop: 20,
        background: "transparent",
        border: "1px solid var(--p-accent)",
        color: "var(--p-accent)",
        padding: "8px 16px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        cursor: regenerating ? "wait" : "pointer",
        opacity: regenerating ? 0.5 : 1
      }
    },
    regenerating ? "\u2026" : "demander une nouvelle lecture"
  ), showEchoArc && /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "echo-arc-portrait-letter",
      viewBox: "0 0 100 30",
      preserveAspectRatio: "none",
      style: {
        position: "absolute",
        top: -8,
        left: 0,
        right: 0,
        width: "100%",
        height: 36,
        pointerEvents: "none",
        zIndex: 3
      },
      "aria-hidden": "true"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 12 24 Q 50 -4, 88 22",
        fill: "none",
        stroke: "var(--p-accent)",
        strokeWidth: "0.5",
        strokeLinecap: "round",
        vectorEffect: "non-scaling-stroke",
        style: {
          strokeDasharray: 200,
          strokeDashoffset: 200,
          filter: "drop-shadow(0 0 4px color-mix(in oklch, var(--p-accent) 60%, transparent))",
          animation: "echoArcDrawPortrait 4200ms cubic-bezier(0.7, 0, 0.3, 1) forwards"
        }
      }
    ),
    /* @__PURE__ */ React.createElement("style", null, `
                  @keyframes echoArcDrawPortrait {
                    0%   { stroke-dashoffset: 200; opacity: 0; }
                    20%  { opacity: 0.95; }
                    65%  { stroke-dashoffset: 0; opacity: 0.85; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                  }
                `)
  )) : null), reading && !reading.empty && !reading.error && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 24px 24px" } }, reading.echos_actifs && reading.echos_actifs.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--p-meta)",
    textTransform: "uppercase",
    marginBottom: 12
  } }, "\xE9chos vivants en ce moment"), reading.echos_actifs.map((e, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      onClick: () => e.kairos_id && go && go("kairos", e.kairos_id),
      style: {
        padding: "14px 18px",
        marginBottom: 8,
        background: "color-mix(in oklch, var(--p-card) 60%, transparent)",
        borderLeft: "1px solid var(--p-glow)",
        cursor: e.kairos_id ? "pointer" : "default",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        color: "var(--p-text)",
        lineHeight: 1.6
      }
    },
    e.resonance || e.preview
  ))), reading.figures_dominantes && reading.figures_dominantes.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--p-meta)",
    textTransform: "uppercase",
    marginBottom: 12
  } }, "figures qui reviennent"), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--p-text)",
    lineHeight: 1.7
  } }, reading.figures_dominantes.map((f, i) => /* @__PURE__ */ React.createElement("span", { key: i }, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--p-accent)", fontWeight: 500 } }, f.nom), " ", "(", f.occurrences, "\xD7 ", f.qualite ? "\u2014 " + f.qualite : "", ")", i < reading.figures_dominantes.length - 1 ? ". " : ".", " ")))), reading.tensions_ouvertes && reading.tensions_ouvertes.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--p-meta)",
    textTransform: "uppercase",
    marginBottom: 12
  } }, "tensions ouvertes"), reading.tensions_ouvertes.map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    padding: "12px 16px",
    marginBottom: 6,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--p-text)",
    lineHeight: 1.6,
    borderLeft: "1px solid color-mix(in oklch, var(--p-accent) 40%, transparent)"
  } }, t)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px", textAlign: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("portrait-carte"),
      style: {
        background: "transparent",
        border: "1px dashed color-mix(in oklch, var(--p-accent) 40%, transparent)",
        color: "var(--p-meta)",
        padding: "10px 20px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        cursor: "pointer",
        letterSpacing: "0.02em"
      }
    },
    "voir la carte vivante (constellation)"
  )));
}
window.PortraitNarrative = PortraitNarrative;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1wb3J0cmFpdC1uYXJyYXRpdmUuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiBnbG9iYWwgUmVhY3QgKi9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRHJlYW0gVjEuMiBcdTIwMTQgUG9ydHJhaXQgTkFSUkFUSUYgKHJlZm9udGUgMjAyNi0wNC0yNSlcbi8vIERlc2lnbiBcdTAwQTc3LjYgcmVmb250ZSA6IHBhZ2UgbGV0dHJlIHZpdmFudGUsIHBhcyBkYXRhdml6IFx1MDBFMCBidWxsZXMuXG4vL1xuLy8gUGF0dGVybnMgZG9taW5hbnRzIDpcbi8vICAgLSBQT0xZUEhPTklFX09OVE9MT0dJUVVFTUVOVF9IT05ORVRFXG4vLyAgIC0gT1BFTl9RVUVTVElPTl9OT1RfSU5URVJQUkVUQVRJT05cbi8vICAgLSBKT1VSTkFMX05VSVRfQ1JPSVNcdTAwQzkgKDMgdG9nZ2xlcyA6IGRheSAvIG5pZ2h0IC8gY3Jvc3NlZClcbi8vICAgLSBEUkVBTV9BU0tfQ0xPU0lOR1xuLy9cbi8vIEwnSUEgbmFycmF0cmljZSBcdTAwRTljcml0IHVuZSBsZXR0cmUgZHUgbW9tZW50IDIwMC00MDAgbW90cy5cbi8vIDMgdG9nZ2xlcyB2aXZhbnRzICh2aWUgZGUgam91ciAvIHZpZSBkZSBudWl0IC8gbGVzIGRldXggcXVpIHNlIGNyb2lzZW50KVxuLy8gNCBmaWx0cmVzIHRlbXBvcmVscyAoY2V0dGUgbHVuZSAvIHNhaXNvbiAvIGFublx1MDBFOWUgLyBhbHdheXMpXG4vLyAzIHNlY3Rpb25zIHNvdXMtamFjZW50ZXMgOiBcdTAwRTljaG9zIHZpdmFudHMsIGZpZ3VyZXMgcXVpIHJldmllbm5lbnQsIHRlbnNpb25zIG91dmVydGVzLlxuLy8gTGEgY29uc3RlbGxhdGlvbiB2aXN1ZWxsZSByZXN0ZSBhY2Nlc3NpYmxlIGVuIHNvdXMtcGFnZS5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiBwUywgdXNlRWZmZWN0OiBwRSwgdXNlUmVmOiBwUiB9ID0gUmVhY3Q7XG5cbmNvbnN0IFRPR0dMRVMgPSBbXG4gIHsga2V5OiBcImRheVwiLCBsYWJlbDogXCJ2aWUgZGUgam91clwiLCBnbHlwaDogXCJcdTI2MDlcIiB9LFxuICB7IGtleTogXCJjcm9zc2VkXCIsIGxhYmVsOiBcImxlcyBkZXV4IHF1aSBzZSBjcm9pc2VudFwiLCBnbHlwaDogXCJcdTIzMkNcIiB9LFxuICB7IGtleTogXCJuaWdodFwiLCBsYWJlbDogXCJ2aWUgZGUgbnVpdFwiLCBnbHlwaDogXCJcdTI2M0VcIiB9LFxuXTtcblxuY29uc3QgUEVSSU9EUyA9IFtcbiAgeyBrZXk6IFwibHVuZVwiLCBsYWJlbDogXCJjZXR0ZSBsdW5lXCIgfSxcbiAgeyBrZXk6IFwic2Fpc29uXCIsIGxhYmVsOiBcImNldHRlIHNhaXNvblwiIH0sXG4gIHsga2V5OiBcImFubmVlXCIsIGxhYmVsOiBcImNldHRlIGFublx1MDBFOWVcIiB9LFxuICB7IGtleTogXCJhbHdheXNcIiwgbGFiZWw6IFwidG91am91cnNcIiB9LFxuXTtcblxuLy8gUGFsZXR0ZSBxdWkgcydhZGFwdGUgYXUgdG9nZ2xlIChqb3VyIGNsYWlyIC8gbnVpdCBzb21icmUgLyBjclx1MDBFOXB1c2N1bGUpXG5mdW5jdGlvbiBwYWxldHRlRm9yKHRvZ2dsZSkge1xuICBpZiAodG9nZ2xlID09PSBcImRheVwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIFwiLS1wLWJnXCI6IFwidmFyKC0tZGF5LXBhcGVyLCBva2xjaCgwLjkyIDAuMDE4IDc1KSlcIixcbiAgICAgIFwiLS1wLWNhcmRcIjogXCJ2YXIoLS1kYXktbGluZW4sIG9rbGNoKDAuODggMC4wMjIgNzApKVwiLFxuICAgICAgXCItLXAtdGV4dFwiOiBcInZhcigtLWRheS1ib25lLXdhcm0sIG9rbGNoKDAuNjUgMC4wMjUgNjUpKVwiLFxuICAgICAgXCItLXAtbWV0YVwiOiBcInZhcigtLWRheS1hc2gtc29mdCwgb2tsY2goMC41MCAwLjAxNSA2NSkpXCIsXG4gICAgICBcIi0tcC1hY2NlbnRcIjogXCJ2YXIoLS1kYXktY2xheS13YXJtLCBva2xjaCgwLjc4IDAuMDQ1IDYwKSlcIixcbiAgICAgIFwiLS1wLWdsb3dcIjogXCJ2YXIoLS1kYXktc3VuLWxvdywgb2tsY2goMC43MiAwLjA5MCA3NSkpXCIsXG4gICAgfTtcbiAgfVxuICBpZiAodG9nZ2xlID09PSBcIm5pZ2h0XCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgXCItLXAtYmdcIjogXCJ2YXIoLS1uaWdodC1mbG9vcilcIixcbiAgICAgIFwiLS1wLWNhcmRcIjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDgwJSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgXCItLXAtdGV4dFwiOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICBcIi0tcC1tZXRhXCI6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgXCItLXAtYWNjZW50XCI6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgXCItLXAtZ2xvd1wiOiBcInZhcigtLWVtYmVyLWxpdmUpXCIsXG4gICAgfTtcbiAgfVxuICAvLyBjcm9zc2VkID0gY3JcdTAwRTlwdXNjdWxlIChncmFkaWVudClcbiAgcmV0dXJuIHtcbiAgICBcIi0tcC1iZ1wiOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LXBhcGVyLCAjRUJFMkQyKSA1MCUsIHZhcigtLW5pZ2h0LWZsb29yKSlcIixcbiAgICBcIi0tcC1jYXJkXCI6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktbGluZW4sICNERkQzQkYpIDMwJSwgdmFyKC0tbmlnaHQtd2FybSkpXCIsXG4gICAgXCItLXAtdGV4dFwiOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWJvbmUtd2FybSwgIzlGOEU3QykgNTAlLCB2YXIoLS1ib25lKSlcIixcbiAgICBcIi0tcC1tZXRhXCI6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktYXNoLXNvZnQsICM3NzZFNjIpIDYwJSwgdmFyKC0tYXNoLWxpZ2h0KSlcIixcbiAgICBcIi0tcC1hY2NlbnRcIjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgXCItLXAtZ2xvd1wiOiBcInZhcigtLWRheS1zdW4tbG93LCAjQzVBNjcyKVwiLFxuICB9O1xufVxuXG4vLyAyMDI2LTA0LTI3IFx1MjAxNCBTcHJpbnQgUDAuNSAoRGVzaWduIFx1MDBBNzExLmJpcy4xOSlcbi8vIFNrZWxldG9uIHNwXHUwMEU5Y2lmaXF1ZSBQb3J0cmFpdCBMRVRUUkUgcGVuZGFudCBnZXRQb3J0cmFpdE5hcnJhdGl2ZSAoMy0xNXMpLlxuLy8gOCBsaWduZXMgRUIgR2FyYW1vbmQgaXRhbGljIHNoaW1tZXIgKyBMb2FkaW5nSGFsbyArIG1lc3NhZ2Ugcm90YXRpbmdcbi8vIGFkYXB0XHUwMEU5IGF1IHRvZ2dsZSAoZGF5L25pZ2h0L2Nyb3NzZWQpLlxuZnVuY3Rpb24gUG9ydHJhaXRMZXR0ZXJTa2VsZXRvbih7IHRvZ2dsZSB9KSB7XG4gIGNvbnN0IFNoaW0gID0gd2luZG93LlNrZWxldG9uU2hpbW1lcjtcbiAgY29uc3QgSGFsbyAgPSB3aW5kb3cuTG9hZGluZ0hhbG87XG4gIGNvbnN0IHVzZVJvdGF0aW5nID0gd2luZG93LnVzZVJvdGF0aW5nTWVzc2FnZTtcbiAgY29uc3QgaXNOaWdodCA9IHRvZ2dsZSA9PT0gXCJuaWdodFwiO1xuICBjb25zdCBpc0RheSAgID0gdG9nZ2xlID09PSBcImRheVwiO1xuICBjb25zdCBtZXNzYWdlcyA9IGlzRGF5XG4gICAgPyBbXCJsaXJlIHRvbiBqb3VyXHUyMDI2XCIsIFwiXHUwMEU5Y291dGVyIGxlIHNvbGVpbFx1MjAyNlwiLCBcInRpc3NlciBjZSBtb21lbnRcdTIwMjZcIl1cbiAgICA6IGlzTmlnaHRcbiAgICAgID8gW1wiY2hlcmNoZXIgdGVzIHBhdHRlcm5zXHUyMDI2XCIsIFwiXHUwMEU5Y291dGVyIGxhIGx1bmVcdTIwMjZcIiwgXCJ0aXNzZXIgY2UgbW9tZW50XHUyMDI2XCJdXG4gICAgICA6IFtcInRpc3NlciBjZSBtb21lbnRcdTIwMjZcIiwgXCJjaGVyY2hlciB0ZXMgcGF0dGVybnNcdTIwMjZcIiwgXCJcdTAwRTljb3V0ZXIgbGEgbHVuZVx1MjAyNlwiXTtcbiAgY29uc3QgbWVzc2FnZSA9IHVzZVJvdGF0aW5nID8gdXNlUm90YXRpbmcobWVzc2FnZXMsIDIyMDApIDogbWVzc2FnZXNbMF07XG5cbiAgLy8gUmVuZGVyIHNpbXBsZSBzaSBwcmltaXRpdmVzIHBhcyBlbmNvcmUgY2hhcmdcdTAwRTllcyAobm8tb3AgZ3JhY2lldXgpXG4gIGlmICghU2hpbSB8fCAhSGFsbykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDE2LFxuICAgICAgICBwYWRkaW5nOiBcIjYwcHggMFwiLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogMzIsIGhlaWdodDogMzIsIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLXAtYWNjZW50KVwiLFxuICAgICAgICAgIGFuaW1hdGlvbjogXCJoYWxvLXNsb3cgMi41cyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICB9fSAvPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tcC1tZXRhKVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImRyZWFtLXNrZWxldG9uLWZhZGUtaW5cIiBzdHlsZT17e1xuICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1wLWNhcmQpXCIsXG4gICAgICBwYWRkaW5nOiBcIjMycHggMjhweFwiLFxuICAgICAgYm9yZGVyTGVmdDogXCIzcHggc29saWQgdmFyKC0tcC1hY2NlbnQpXCIsXG4gICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiAyNCxcbiAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgIH19PlxuICAgICAgey8qIDIwMjYtMDQtMjkgXHUyMDE0IEhhbG9SZXNwaXJlIHNpbGsgY2VudHJhbCBwZW5kYW50IHNrZWxldG9uIChZZXNodWEpICovfVxuICAgICAge3dpbmRvdy5IYWxvUmVzcGlyZSAmJiAhaXNEYXkgJiYgKFxuICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdG9wOiBcIjUwJVwiLCBsZWZ0OiBcIjUwJVwiLFxuICAgICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGUoLTUwJSwgLTUwJSlcIixcbiAgICAgICAgICB3aWR0aDogXCJtaW4oMjgwcHgsIDcwJSlcIiwgaGVpZ2h0OiBcIm1pbigyODBweCwgNzAlKVwiLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNDUsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cInNpbGtcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTEsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgY29sb3I6IFwidmFyKC0tcC1tZXRhKVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEsXG4gICAgICB9fT5cbiAgICAgICAgbGEgbGV0dHJlIGR1IG1vbWVudFxuICAgICAgPC9kaXY+XG4gICAgICB7LyogOCBsaWduZXMgc2hpbW1lciBFQiBHYXJhbW9uZCBpdGFsaWMgMThweCBcdTIyNDggMjgtMzBweCBsaW5lLWhlaWdodCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICA8U2hpbSBsaW5lcz17OH0gaGVpZ2h0PXsxNH0gZ2FwPXsxNH0gZGFyaz17IWlzRGF5fSBsYXN0TGluZVdpZHRoPVwiNTglXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgey8qIEhhbG8gcmVzcGlyZSArIG1lc3NhZ2Ugcm90YXRpbmcgaXRhbGljIHJvdGF0aW5nICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsIHBhZGRpbmdUb3A6IDgsIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMSB9fT5cbiAgICAgICAgPEhhbG8gc2l6ZT17Mjh9IG1lc3NhZ2U9e21lc3NhZ2V9IGRhcms9eyFpc0RheX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5mdW5jdGlvbiBQb3J0cmFpdE5hcnJhdGl2ZSh7IGdvIH0pIHtcbiAgY29uc3QgW3RvZ2dsZSwgc2V0VG9nZ2xlXSA9IHBTKFwiY3Jvc3NlZFwiKTtcbiAgY29uc3QgW3BlcmlvZCwgc2V0UGVyaW9kXSA9IHBTKFwibHVuZVwiKTtcbiAgY29uc3QgW3JlYWRpbmcsIHNldFJlYWRpbmddID0gcFMobnVsbCk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHBTKHRydWUpO1xuICBjb25zdCBbcmVnZW5lcmF0aW5nLCBzZXRSZWdlbmVyYXRpbmddID0gcFMoZmFsc2UpO1xuICAvLyAyMDI2LTA0LTMwIFx1MjAxNCBhcmMgc2lsay1nb2xkIFx1MDBFOXBoXHUwMEU5bVx1MDBFOHJlIChlY2hvQXJjRHJhdyA0LjJzKSBzaSBsYSBsZXR0cmUgY2l0ZSB1biBcdTAwRTljaG9cbiAgY29uc3QgW3Nob3dFY2hvQXJjLCBzZXRTaG93RWNob0FyY10gPSBwUyhmYWxzZSk7XG5cbiAgY29uc3QgcGFsID0gcGFsZXR0ZUZvcih0b2dnbGUpO1xuXG4gIC8vIDIwMjYtMDQtMzAgXHUyMDE0IGRcdTAwRTl0ZWN0ZXIgbWVudGlvbiBcIlx1MDBFOWNob1wiIGRhbnMgbGEgbGV0dHJlIFx1MjE5MiB0cmlnZ2VyIGFyYyBXb3cyXG4gIHBFKCgpID0+IHtcbiAgICBpZiAoIXJlYWRpbmcgfHwgIXJlYWRpbmcubGV0dHJlIHx8IHJlYWRpbmcuZXJyb3IpIHJldHVybjtcbiAgICAvLyBEXHUwMEU5dGVjdGlvbiBzb3VwbGUgOiBcIlx1MDBFOWNob1wiLCBcImVjaG9zXCIsIFwiclx1MDBFOXNvbmFuY2VcIiwgXCJyXHUwMEU5c29ubmVcIlxuICAgIGNvbnN0IGxvd2VyID0gcmVhZGluZy5sZXR0cmUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBoYXNFY2hvID0gL1xcYlx1MDBFOWNoW29cdTAwRjRdcz9cXGJ8XFxiclx1MDBFOXNvbm4oZXxlbnR8YW5jZXxhbmNlcylcXGJ8XFxicmVzb25uKGV8ZW50fGFuY2V8YW5jZXMpXFxifFxcYnNlIGZhaXQgXHUwMEU5Y2hvXFxiLy50ZXN0KGxvd2VyKTtcbiAgICBpZiAoaGFzRWNobykge1xuICAgICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gc2V0U2hvd0VjaG9BcmModHJ1ZSksIDgwMCk7XG4gICAgICBjb25zdCB0MiA9IHNldFRpbWVvdXQoKCkgPT4gc2V0U2hvd0VjaG9BcmMoZmFsc2UpLCA4MDAgKyA0NDAwKTtcbiAgICAgIHJldHVybiAoKSA9PiB7IGNsZWFyVGltZW91dCh0KTsgY2xlYXJUaW1lb3V0KHQyKTsgfTtcbiAgICB9XG4gIH0sIFtyZWFkaW5nPy5sZXR0cmVdKTtcblxuICBjb25zdCBmZXRjaFJlYWRpbmcgPSBhc3luYyAoZm9yY2UgPSBmYWxzZSkgPT4ge1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgaWYgKGZvcmNlKSBzZXRSZWdlbmVyYXRpbmcodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZ2V0UG9ydHJhaXROYXJyYXRpdmUoeyB0b2dnbGUsIHBlcmlvZCwgZm9yY2UgfSk7XG4gICAgICBzZXRSZWFkaW5nKHIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltQb3J0cmFpdF0gZmV0Y2ggZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgc2V0UmVhZGluZyh7IGxldHRyZTogXCJMJ2FwcCBuJ2EgcGFzIHB1IGxpcmUgY2UgbW9tZW50LiBSZXZpZW5zIGRhbnMgdW4gaW5zdGFudC5cIiwgZXJyb3I6IHRydWUgfSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgc2V0UmVnZW5lcmF0aW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgcEUoKCkgPT4geyBmZXRjaFJlYWRpbmcoZmFsc2UpOyB9LCBbdG9nZ2xlLCBwZXJpb2RdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIC4uLnBhbCxcbiAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tcC1iZylcIixcbiAgICAgIGNvbG9yOiBcInZhcigtLXAtdGV4dClcIixcbiAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgcGFkZGluZ0JvdHRvbTogMTAwLFxuICAgICAgdHJhbnNpdGlvbjogXCJiYWNrZ3JvdW5kIDkyMG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC4xNSwxKSwgY29sb3IgOTIwbXMgZWFzZVwiLFxuICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgIH19PlxuICAgICAgey8qIDIwMjYtMDQtMjkgXHUyMDE0IEJhY2tncm91bmQgU3VyZmFjZSBwYXBlciBzdWJ0aWwgKFllc2h1YSwgb3BhY2l0eSAwLjE1KVxuICAgICAgICAgIDIwMjYtMDQtMzAgYW1wbGlmaWNhdGlvbiA6IG1hdHRlciBzd2l0Y2ggc2Vsb24gdG9nZ2xlLiBKT1VSIFx1MjE5MiBwYXBlclxuICAgICAgICAgIChjbGFydFx1MDBFOSBwYXRpblx1MDBFOWUpLCBOVUlUIFx1MjE5MiBzdG9uZSAoZ3Jhdml0XHUwMEU5IG1pblx1MDBFOXJhbGUpLCBDUk9JU1x1MDBDOSBcdTIxOTIgc2lsa1xuICAgICAgICAgICh0aXNzYWdlIGVudHJlIGxlcyBkZXV4KS4gT3BhY2l0eSAwLjE4IHBvdXIgdmlzaWJpbGl0XHUwMEU5IGhvbm5cdTAwRUF0ZSBzYW5zXG4gICAgICAgICAgXHUwMEU5Y3Jhc2VyIGxhIGxldHRyZS4gKi99XG4gICAgICB7d2luZG93LlN1cmZhY2UgJiYgKFxuICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIG9wYWNpdHk6IDAuMTgsIHpJbmRleDogMCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgOTIwbXMgZWFzZVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93LlN1cmZhY2VcbiAgICAgICAgICAgIG1hdHRlcj17dG9nZ2xlID09PSBcImRheVwiID8gXCJwYXBlclwiIDogdG9nZ2xlID09PSBcIm5pZ2h0XCIgPyBcInN0b25lXCIgOiBcInNpbGtcIn1cbiAgICAgICAgICAgIG1vdGlvbj17dHJ1ZX1cbiAgICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogMjAyNi0wNC0zMCBcdTIwMTQgQ2VyY2xlcyBjb25jZW50cmlxdWVzIGVuIGJhY2tncm91bmQgKFllc2h1YSBhbXBsaWZpY2F0aW9uKS5cbiAgICAgICAgICBQb3NcdTAwRTlzIGRlcnJpXHUwMEU4cmUgbGEgbGV0dHJlLCBvcGFjaXR5IGRvdWNlLCBzaWduYXR1cmUgZ1x1MDBFOW9zeW1ib2xpcXVlIGR1XG4gICAgICAgICAgUG9ydHJhaXQgKGxhIHZ1ZSBkJ2Vuc2VtYmxlIHF1aSBzZSB0aXNzZSBlbiBjZXJjbGVzIGRlcHVpcyBsZSBjZW50cmVcbiAgICAgICAgICBNT0kpLiBBbmltYXRpb24gYnJlYXRoZS1zb3VmZmxlIDhzLiAqL31cbiAgICAgIHt3aW5kb3cuR2VvU3ltYm9sICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgdG9wOiBcIjMyJVwiLCBsZWZ0OiBcIjUwJVwiLFxuICAgICAgICAgIHdpZHRoOiBcIm1pbig0MjBweCwgODB2dylcIiwgaGVpZ2h0OiBcIm1pbig0MjBweCwgODB2dylcIixcbiAgICAgICAgICB0cmFuc2Zvcm06IFwidHJhbnNsYXRlKC01MCUsIC0zMCUpXCIsXG4gICAgICAgICAgb3BhY2l0eTogMC4xNCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAwLFxuICAgICAgICAgIGFuaW1hdGlvbjogXCJicmVhdGhlLXNvdWZmbGUgOHMgZWFzZS1pbi1vdXQgaW5maW5pdGVcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHdpbmRvdy5HZW9TeW1ib2wga2luZD1cImNvbmNlbnRyaWNcIiBjb2xvcj1cInNpbGtcIlxuICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IFwiMTAwJVwiIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIDIwMjYtMDQtMzAgXHUyMDE0IEhhbG9SZXNwaXJlIHNpbGsgcGVuZGFudCBsYSBsZWN0dXJlIChZZXNodWEgYW1wbGkpXG4gICAgICAgICAgVW5lIGZvaXMgbGEgbGV0dHJlIGNoYXJnXHUwMEU5ZSwgaGFsbyBzaWxrLWdvbGQgc3VidGlsIGRlcnJpXHUwMEU4cmUgbGUgYmxvY1xuICAgICAgICAgIGxldHRyZS4gRG9ubmUgdW5lIHByXHUwMEU5c2VuY2Ugdml2YW50ZSBcdTAwRTAgbGEgbGVjdHVyZSwgVEVNUE8tU09VRkZMRSA2cy5cbiAgICAgICAgICBTa2lwIHNpIHRvZ2dsZSA9PT0gZGF5IChwYWxldHRlIGNsYWlyZSwgaGFsbyBvciBpbnZpc2libGUpLiAqL31cbiAgICAgIHt3aW5kb3cuSGFsb1Jlc3BpcmUgJiYgcmVhZGluZyAmJiAhbG9hZGluZyAmJiB0b2dnbGUgIT09IFwiZGF5XCIgJiYgKFxuICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICB0b3A6IFwiMzAlXCIsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgICAgd2lkdGg6IFwibWluKDU2MHB4LCA5MnZ3KVwiLCBoZWlnaHQ6IFwibWluKDQyMHB4LCA2MHZoKVwiLFxuICAgICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVYKC01MCUpXCIsXG4gICAgICAgICAgb3BhY2l0eTogMC4zMixcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAwLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93LkhhbG9SZXNwaXJlIGtpbmQ9XCJzaWxrXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgRGVtaS1jZXJjbGUgYXVyb3JlIGVuIGhhdXQgKFllc2h1YSwgNjB2dywgb3BhY2l0eSAwLjQpXG4gICAgICAgICAgYXVyb3JlLWdyYWRpZW50IGRcdTAwRTlmaW5pIGRhbnMgaW5kZXguaHRtbCA8ZGVmcz4uICovfVxuICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IDAsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVYKC01MCUpXCIsXG4gICAgICAgIHdpZHRoOiBcIjYwdndcIiwgbWF4V2lkdGg6IDYwMCwgaGVpZ2h0OiAxMzAsXG4gICAgICAgIG9wYWNpdHk6IDAuNCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMCxcbiAgICAgIH19PlxuICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgNjAwIDEzMFwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCJcbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIsIG92ZXJmbG93OiBcInZpc2libGVcIiB9fT5cbiAgICAgICAgICA8cGF0aCBkPVwiTSAwIDEyMCBRIDMwMCAtMzAsIDYwMCAxMjBcIlxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ1cmwoI2F1cm9yZS1ncmFkaWVudClcIiBzdHJva2VXaWR0aD1cIjEuMlwiXG4gICAgICAgICAgICBzdHlsZT17eyBhbmltYXRpb246IFwiYnJlYXRoZS1zb3VmZmxlIDhzIGVhc2UtaW4tb3V0IGluZmluaXRlXCIgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNIDMwIDEyMCBRIDMwMCAwLCA1NzAgMTIwXCJcbiAgICAgICAgICAgIGZpbGw9XCJub25lXCIgc3Ryb2tlPVwidXJsKCNhdXJvcmUtZ3JhZGllbnQpXCIgc3Ryb2tlV2lkdGg9XCIwLjdcIiBvcGFjaXR5PVwiMC41NVwiXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEhlYWRlciAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICBwYWRkaW5nOiBcIjE2cHggMjRweFwiLFxuICAgICAgICBib3JkZXJCb3R0b206IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcC1hY2NlbnQpIDIwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtbWV0YSlcIiwgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgdG9uIHBvcnRyYWl0IFx1MDBCNyBsdW5lIGRcdTAwRTljcm9pc3NhbnRlXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKFwicG9ydHJhaXQtY2FydGVcIil9XG4gICAgICAgICAgdGl0bGU9XCJ2b2lyIG1hIGNhcnRlXCJcbiAgICAgICAgICBhcmlhLWxhYmVsPVwidm9pciBtYSBjYXJ0ZVwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtbWV0YSlcIiwgZm9udFNpemU6IDE4LCBwYWRkaW5nOiBcIjRweCA4cHhcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICBcdTI3MzZcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIDMgdG9nZ2xlcyB2aXZhbnRzICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjI0cHggMjRweCAxMnB4XCIgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiBcImdyaWRcIiwgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoMywgMWZyKVwiLFxuICAgICAgICAgIGdhcDogNiwgbWFyZ2luQm90dG9tOiAxNCxcbiAgICAgICAgfX0+XG4gICAgICAgICAge1RPR0dMRVMubWFwKHQgPT4ge1xuICAgICAgICAgICAgY29uc3QgYWN0aXZlID0gdG9nZ2xlID09PSB0LmtleTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PXt0LmtleX0gb25DbGljaz17KCkgPT4gc2V0VG9nZ2xlKHQua2V5KX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgLy8gMjAyNi0wNC0zMCBhbXBsaSA6IGFjdGlmID0gbWF0dGVyIGFjY2VudCBkb3V4ICsgZ2x5cGhlIGFncmFuZGlcbiAgICAgICAgICAgICAgICAgIC8vIGF1IGxpZXUgZGUgcGxlaW4tYmxvYyBhY2NlbnQuIFBsdXMgY29udGVtcGxhdGlmLCBtb2lucyBVSSBicnV0ZS5cbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1wLWFjY2VudCkgMTglLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgICAgICAgICA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmUgPyBcInZhcigtLXAtYWNjZW50KVwiIDogXCJ2YXIoLS1wLXRleHQpXCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgICA/IFwiMXB4IHNvbGlkIHZhcigtLXAtYWNjZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIDogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1wLWFjY2VudCkgMzAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTJweCA4cHggMTBweFwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjU1LDEpXCIsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiA2LFxuICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogYWN0aXZlID8gMjIgOiAxNyxcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IGFjdGl2ZSA/IDEgOiAwLjYsXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIH19Pnt0LmdseXBofTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3Bhbj57dC5sYWJlbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgey8qIGJhcnJlIHNpbGstZ29sZCBzdWJ0aWxlIHNvdXMgbGUgdG9nZ2xlIGFjdGlmICovfVxuICAgICAgICAgICAgICAgIHthY3RpdmUgJiYgKFxuICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgYm90dG9tOiAwLCBsZWZ0OiBcIjIwJVwiLCByaWdodDogXCIyMCVcIixcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAyLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLXAtYWNjZW50KVwiLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJicmVhdGhlLXNvdWZmbGUgNnMgZWFzZS1pbi1vdXQgaW5maW5pdGVcIixcbiAgICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogNCBmaWx0cmVzIHRlbXBvcmVscyAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDQsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBmbGV4V3JhcDogXCJ3cmFwXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtQRVJJT0RTLm1hcChwID0+IChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtwLmtleX0gb25DbGljaz17KCkgPT4gc2V0UGVyaW9kKHAua2V5KX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBwZXJpb2QgPT09IHAua2V5ID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXAtYWNjZW50KSAzMCUsIHRyYW5zcGFyZW50KVwiIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBwZXJpb2QgPT09IHAua2V5ID8gXCJ2YXIoLS1wLXRleHQpXCIgOiBcInZhcigtLXAtbWV0YSlcIixcbiAgICAgICAgICAgICAgICBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMixcbiAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBwZXJpb2QgPT09IHAua2V5ID8gMSA6IDAuNixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtwLmxhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBMZXR0cmUgZHUgbW9tZW50ICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjI0cHhcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyIH19PlxuICAgICAgICB7bG9hZGluZyAmJiAhcmVhZGluZyA/IChcbiAgICAgICAgICA8UG9ydHJhaXRMZXR0ZXJTa2VsZXRvbiB0b2dnbGU9e3RvZ2dsZX0gLz5cbiAgICAgICAgKSA6IHJlYWRpbmcgPyAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1wLWNhcmQpXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjMycHggMjhweFwiLFxuICAgICAgICAgICAgYm9yZGVyTGVmdDogXCIzcHggc29saWQgdmFyKC0tcC1hY2NlbnQpXCIsXG4gICAgICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgICAgICAgLy8gc3VidGxlIGlubmVyIHNoYWRvdyBwb3VyIGFuY3JlciBsYSBsZXR0cmUgYXUtZGVzc3VzIGR1IGhhbG9cbiAgICAgICAgICAgIGJveFNoYWRvdzogXCIwIDFweCAwIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcC1hY2NlbnQpIDE4JSwgdHJhbnNwYXJlbnQpLCAwIDhweCAzMnB4IC0xNnB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcC1hY2NlbnQpIDEyJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDExLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtbWV0YSlcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgbWFyZ2luQm90dG9tOiAxNixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBsYSBsZXR0cmUgZHUgbW9tZW50XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxOCxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS43NSxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tcC10ZXh0KVwiLFxuICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyNCxcbiAgICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3JlYWRpbmcubGV0dHJlfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgey8qIDIwMjYtMDQtMzAgXHUyMDE0IEVuY2FydCBtYXR0ZXIgc2lsayBwb3VyIHZvaXggbW9iaWxpc1x1MDBFOWVzIChZZXNodWEgYW1wbGkpXG4gICAgICAgICAgICAgICAgQXUgbGlldSBkJ3VuIHNpbXBsZSB0ZXh0ZSBzb3VzIGxhIGJhcnJlLCBlbmNhZHJcdTAwRTkgc2lsayBzdWJ0aWxcbiAgICAgICAgICAgICAgICBxdWkgbWFycXVlIGNlcyB2b2l4IGNvbW1lIGNpdGF0aW9ucyB2aXZhbnRlcy4gU2kgdG9nZ2xlID09PSBkYXksXG4gICAgICAgICAgICAgICAgZ2FyZGVyIGxhIHNvYnJpXHUwMEU5dFx1MDBFOSAocGFzIGRlIG1hdHRlciBzb21icmUgc3VyIGZvbmQgY2xhaXIpLiAqL31cbiAgICAgICAgICAgIHtyZWFkaW5nLnZvaXhfbW9iaWxpc2VlcyAmJiByZWFkaW5nLnZvaXhfbW9iaWxpc2Vlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMi41LCBjb2xvcjogXCJ2YXIoLS1wLW1ldGEpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogNCxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEycHggMTRweFwiLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IHRvZ2dsZSA9PT0gXCJkYXlcIlxuICAgICAgICAgICAgICAgICAgPyBcInRyYW5zcGFyZW50XCJcbiAgICAgICAgICAgICAgICAgIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXAtYWNjZW50KSA4JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXAtYWNjZW50KSAyMiUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6IHRvZ2dsZSAhPT0gXCJkYXlcIlxuICAgICAgICAgICAgICAgICAgPyBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXAtYWNjZW50KSAyOCUsIHRyYW5zcGFyZW50KVwiXG4gICAgICAgICAgICAgICAgICA6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogOS41LFxuICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNywgbWFyZ2luUmlnaHQ6IDgsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB2b2l4IHRpc3NcdTAwRTllc1xuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICB7cmVhZGluZy52b2l4X21vYmlsaXNlZXMuam9pbihcIiBcdTAwQjcgXCIpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7IXJlYWRpbmcuZXJyb3IgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGZldGNoUmVhZGluZyh0cnVlKX1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17cmVnZW5lcmF0aW5nfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDIwLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1wLWFjY2VudClcIixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtYWNjZW50KVwiLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCI4cHggMTZweFwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6IHJlZ2VuZXJhdGluZyA/IFwid2FpdFwiIDogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICBvcGFjaXR5OiByZWdlbmVyYXRpbmcgPyAwLjUgOiAxLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtyZWdlbmVyYXRpbmcgPyBcIlx1MjAyNlwiIDogXCJkZW1hbmRlciB1bmUgbm91dmVsbGUgbGVjdHVyZVwifVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIHsvKiAyMDI2LTA0LTMwIFx1MjAxNCBBcmMgc2lsay1nb2xkIFx1MDBFOXBoXHUwMEU5bVx1MDBFOHJlIChXb3cyIGVjaG9BcmNEcmF3IDQuMnMpXG4gICAgICAgICAgICAgICAgQXBwYXJhXHUwMEVFdCBhdS1kZXNzdXMgZHUgYmxvYyBsZXR0cmUgc2kgXCJcdTAwRTljaG9cIiBlc3QgbWVudGlvbm5cdTAwRTkuXG4gICAgICAgICAgICAgICAgUlx1MDBFOWN1cFx1MDBFOHJlIGwnYW5pbWF0aW9uIGVjaG9BcmNEcmF3IGR1IHNjcmVlbnMtdjEyLWFtcGxpZmllZC5qc3guICovfVxuICAgICAgICAgICAge3Nob3dFY2hvQXJjICYmIChcbiAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJlY2hvLWFyYy1wb3J0cmFpdC1sZXR0ZXJcIiB2aWV3Qm94PVwiMCAwIDEwMCAzMFwiXG4gICAgICAgICAgICAgICAgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IC04LCBsZWZ0OiAwLCByaWdodDogMCxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiAzNixcbiAgICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTSAxMiAyNCBRIDUwIC00LCA4OCAyMlwiXG4gICAgICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgICAgICAgICBzdHJva2U9XCJ2YXIoLS1wLWFjY2VudClcIlxuICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg9XCIwLjVcIlxuICAgICAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgICAgIHZlY3RvckVmZmVjdD1cIm5vbi1zY2FsaW5nLXN0cm9rZVwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk6IDIwMCxcbiAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaG9mZnNldDogMjAwLFxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IFwiZHJvcC1zaGFkb3coMCAwIDRweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXAtYWNjZW50KSA2MCUsIHRyYW5zcGFyZW50KSlcIixcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImVjaG9BcmNEcmF3UG9ydHJhaXQgNDIwMG1zIGN1YmljLWJlemllcigwLjcsIDAsIDAuMywgMSkgZm9yd2FyZHNcIixcbiAgICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICAgICAgPHN0eWxlPntgXG4gICAgICAgICAgICAgICAgICBAa2V5ZnJhbWVzIGVjaG9BcmNEcmF3UG9ydHJhaXQge1xuICAgICAgICAgICAgICAgICAgICAwJSAgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDIwMDsgb3BhY2l0eTogMDsgfVxuICAgICAgICAgICAgICAgICAgICAyMCUgIHsgb3BhY2l0eTogMC45NTsgfVxuICAgICAgICAgICAgICAgICAgICA2NSUgIHsgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7IG9wYWNpdHk6IDAuODU7IH1cbiAgICAgICAgICAgICAgICAgICAgMTAwJSB7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBvcGFjaXR5OiAwOyB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYH08L3N0eWxlPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiBudWxsfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTZWN0aW9ucyBzb3VzLWphY2VudGVzIDogXHUwMEU5Y2hvcyB2aXZhbnRzIC8gZmlndXJlcyAvIHRlbnNpb25zICovfVxuICAgICAge3JlYWRpbmcgJiYgIXJlYWRpbmcuZW1wdHkgJiYgIXJlYWRpbmcuZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMCAyNHB4IDI0cHhcIiB9fT5cbiAgICAgICAgICB7cmVhZGluZy5lY2hvc19hY3RpZnMgJiYgcmVhZGluZy5lY2hvc19hY3RpZnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMjAgfX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMSwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtbWV0YSlcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgXHUwMEU5Y2hvcyB2aXZhbnRzIGVuIGNlIG1vbWVudFxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAge3JlYWRpbmcuZWNob3NfYWN0aWZzLm1hcCgoZSwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZS5rYWlyb3NfaWQgJiYgZ28gJiYgZ28oXCJrYWlyb3NcIiwgZS5rYWlyb3NfaWQpfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxNHB4IDE4cHhcIiwgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcC1jYXJkKSA2MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJMZWZ0OiBcIjFweCBzb2xpZCB2YXIoLS1wLWdsb3cpXCIsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogZS5rYWlyb3NfaWQgPyBcInBvaW50ZXJcIiA6IFwiZGVmYXVsdFwiLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tcC10ZXh0KVwiLCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHtlLnJlc29uYW5jZSB8fCBlLnByZXZpZXd9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtyZWFkaW5nLmZpZ3VyZXNfZG9taW5hbnRlcyAmJiByZWFkaW5nLmZpZ3VyZXNfZG9taW5hbnRlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAyMCB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDExLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tcC1tZXRhKVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLCBtYXJnaW5Cb3R0b206IDEyLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBmaWd1cmVzIHF1aSByZXZpZW5uZW50XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtdGV4dClcIiwgbGluZUhlaWdodDogMS43LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7cmVhZGluZy5maWd1cmVzX2RvbWluYW50ZXMubWFwKChmLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8c3BhbiBrZXk9e2l9PlxuICAgICAgICAgICAgICAgICAgICA8c3Ryb25nIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLXAtYWNjZW50KVwiLCBmb250V2VpZ2h0OiA1MDAgfX0+e2Yubm9tfTwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgICB7XCIgXCJ9KHtmLm9jY3VycmVuY2VzfVx1MDBENyB7Zi5xdWFsaXRlID8gXCJcdTIwMTQgXCIgKyBmLnF1YWxpdGUgOiBcIlwifSlcbiAgICAgICAgICAgICAgICAgICAge2kgPCByZWFkaW5nLmZpZ3VyZXNfZG9taW5hbnRlcy5sZW5ndGggLSAxID8gXCIuIFwiIDogXCIuXCJ9XG4gICAgICAgICAgICAgICAgICAgIHtcIiBcIn1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtyZWFkaW5nLnRlbnNpb25zX291dmVydGVzICYmIHJlYWRpbmcudGVuc2lvbnNfb3V2ZXJ0ZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMjAgfX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMSwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXAtbWV0YSlcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgdGVuc2lvbnMgb3V2ZXJ0ZXNcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIHtyZWFkaW5nLnRlbnNpb25zX291dmVydGVzLm1hcCgodCwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxMnB4IDE2cHhcIiwgbWFyZ2luQm90dG9tOiA2LFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1wLXRleHQpXCIsIGxpbmVIZWlnaHQ6IDEuNixcbiAgICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcC1hY2NlbnQpIDQwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB7dH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBDb25zdGVsbGF0aW9uIHZpc3VlbGxlIFx1MjAxNCBzb3VzLXBhZ2UgYWNjZXNzaWJsZSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIyNHB4XCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcInBvcnRyYWl0LWNhcnRlXCIpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IGRhc2hlZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXAtYWNjZW50KSA0MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tcC1tZXRhKVwiLFxuICAgICAgICAgICAgcGFkZGluZzogXCIxMHB4IDIwcHhcIixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIiwgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB2b2lyIGxhIGNhcnRlIHZpdmFudGUgKGNvbnN0ZWxsYXRpb24pXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbndpbmRvdy5Qb3J0cmFpdE5hcnJhdGl2ZSA9IFBvcnRyYWl0TmFycmF0aXZlO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBa0JBLE1BQU0sRUFBRSxVQUFVLElBQUksV0FBVyxJQUFJLFFBQVEsR0FBRyxJQUFJO0FBRXBELE1BQU0sVUFBVTtBQUFBLEVBQ2QsRUFBRSxLQUFLLE9BQU8sT0FBTyxlQUFlLE9BQU8sU0FBSTtBQUFBLEVBQy9DLEVBQUUsS0FBSyxXQUFXLE9BQU8sNEJBQTRCLE9BQU8sU0FBSTtBQUFBLEVBQ2hFLEVBQUUsS0FBSyxTQUFTLE9BQU8sZUFBZSxPQUFPLFNBQUk7QUFDbkQ7QUFFQSxNQUFNLFVBQVU7QUFBQSxFQUNkLEVBQUUsS0FBSyxRQUFRLE9BQU8sYUFBYTtBQUFBLEVBQ25DLEVBQUUsS0FBSyxVQUFVLE9BQU8sZUFBZTtBQUFBLEVBQ3ZDLEVBQUUsS0FBSyxTQUFTLE9BQU8saUJBQWM7QUFBQSxFQUNyQyxFQUFFLEtBQUssVUFBVSxPQUFPLFdBQVc7QUFDckM7QUFHQSxTQUFTLFdBQVcsUUFBUTtBQUMxQixNQUFJLFdBQVcsT0FBTztBQUNwQixXQUFPO0FBQUEsTUFDTCxVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsTUFDWixZQUFZO0FBQUEsTUFDWixZQUFZO0FBQUEsTUFDWixjQUFjO0FBQUEsTUFDZCxZQUFZO0FBQUEsSUFDZDtBQUFBLEVBQ0Y7QUFDQSxNQUFJLFdBQVcsU0FBUztBQUN0QixXQUFPO0FBQUEsTUFDTCxVQUFVO0FBQUEsTUFDVixZQUFZO0FBQUEsTUFDWixZQUFZO0FBQUEsTUFDWixZQUFZO0FBQUEsTUFDWixjQUFjO0FB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QSxJQUFnQixXQUFXO0FBQUEsSUFBVSxVQUFVO0FBQUEsSUFDM0QsT0FBTztBQUFBLElBQWlCLFlBQVk7QUFBQSxFQUN0QyxLQUNHLFFBQVEsbUJBQW1CLElBQUksQ0FBQyxHQUFHLE1BQ2xDLG9DQUFDLFVBQUssS0FBSyxLQUNULG9DQUFDLFlBQU8sT0FBTyxFQUFFLE9BQU8sbUJBQW1CLFlBQVksSUFBSSxLQUFJLEVBQUUsR0FBSSxHQUNwRSxLQUFJLEtBQUUsRUFBRSxhQUFZLFNBQUcsRUFBRSxVQUFVLFlBQU8sRUFBRSxVQUFVLElBQUcsS0FDekQsSUFBSSxRQUFRLG1CQUFtQixTQUFTLElBQUksT0FBTyxLQUNuRCxHQUNILENBQ0QsQ0FDSCxDQUNGLEdBR0QsUUFBUSxxQkFBcUIsUUFBUSxrQkFBa0IsU0FBUyxLQUMvRCxvQ0FBQyxTQUFJLE9BQU8sRUFBRSxXQUFXLEdBQUcsS0FDMUIsb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFBZSxVQUFVO0FBQUEsSUFBSSxlQUFlO0FBQUEsSUFDeEQsT0FBTztBQUFBLElBQWlCLGVBQWU7QUFBQSxJQUFhLGNBQWM7QUFBQSxFQUNwRSxLQUFHLG1CQUVILEdBQ0MsUUFBUSxrQkFBa0IsSUFBSSxDQUFDLEdBQUcsTUFDakMsb0NBQUMsU0FBSSxLQUFLLEdBQUcsT0FBTztBQUFBLElBQ2xCLFNBQVM7QUFBQSxJQUFhLGNBQWM7QUFBQSxJQUNwQyxZQUFZO0FBQUEsSUFBZ0IsV0FBVztBQUFBLElBQVUsVUFBVTtBQUFBLElBQzNELE9BQU87QUFBQSxJQUFpQixZQUFZO0FBQUEsSUFDcEMsWUFBWTtBQUFBLEVBQ2QsS0FDRyxDQUNILENBQ0QsQ0FDSCxDQUVKLEdBSUYsb0NBQUMsU0FBSSxPQUFPLEVBQUUsU0FBUyxRQUFRLFdBQVcsU0FBUyxLQUNqRDtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sU0FBUyxNQUFNLE1BQU0sR0FBRyxnQkFBZ0I7QUFBQSxNQUM5QyxPQUFPO0FBQUEsUUFDTCxZQUFZO0FBQUEsUUFDWixRQUFRO0FBQUEsUUFDUixPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsUUFDVCxZQUFZO0FBQUEsUUFBZ0IsV0FBVztBQUFBLFFBQVUsVUFBVTtBQUFBLFFBQzNELFFBQVE7QUFBQSxRQUFXLGVBQWU7QUFBQSxNQUNwQztBQUFBO0FBQUEsSUFBRztBQUFBLEVBRUwsQ0FDRixDQUNGO0FBRUo7QUFFQSxPQUFPLG9CQUFvQjsiLAogICJuYW1lcyI6IFtdCn0K
