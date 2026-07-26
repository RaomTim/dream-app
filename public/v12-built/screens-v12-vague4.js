const { useState: v4S, useEffect: v4E, useRef: v4R } = React;
const OnboardingV12 = ({ go }) => {
  const Original = window.__OnboardingOriginal;
  if (!Original) return null;
  const [stepKey, setStepKey] = v4S(0);
  v4E(() => {
    if (!window.wowRegistry) return;
    try {
      const legacy = localStorage.getItem("dream:wow0:fired");
      if (legacy && !window.wowRegistry.has("first-launch")) {
        const s = JSON.parse(localStorage.getItem("dream:wow-fired") || "{}");
        s["first-launch"] = Date.now();
        localStorage.setItem("dream:wow-fired", JSON.stringify(s));
        return;
      }
    } catch (e) {
    }
    const fired = window.wowRegistry.fire("first-launch");
    if (fired && window.playRitual) window.playRitual("seuil");
  }, []);
  v4E(() => {
    if (stepKey > 0 && window.playRitual) window.playRitual("souffle");
  }, [stepKey]);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(window.Surface, { matter: "ember", motion: true, style: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.45,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "20%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 700,
    height: 500,
    pointerEvents: "none",
    zIndex: 1,
    opacity: 0.4
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk", style: { width: "100%", height: "100%" } })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    bottom: -150,
    right: -100,
    width: 450,
    height: 450,
    opacity: 0.07,
    pointerEvents: "none",
    zIndex: 1
  } }, /* @__PURE__ */ React.createElement(window.GeoSymbol, { kind: "spirale", color: "silk" })), /* @__PURE__ */ React.createElement(
    "div",
    {
      style: { position: "relative", zIndex: 2 },
      onClick: () => setStepKey((k) => k + 1)
    },
    /* @__PURE__ */ React.createElement(Original, { go })
  ));
};
const OracleCorpsV12 = ({ go }) => {
  const Original = window.__OracleCorpsOriginal;
  if (!Original) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(window.Surface, { matter: "earth", motion: true, style: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.55,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 200,
    left: 40,
    width: 380,
    height: 380,
    opacity: 0.08,
    pointerEvents: "none",
    zIndex: 1
  } }, /* @__PURE__ */ React.createElement(window.GeoSymbol, { kind: "cercle-concentrique", color: "silk" })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 250,
    left: 60,
    width: 400,
    height: 500,
    pointerEvents: "none",
    zIndex: 1,
    opacity: 0.45
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "earth", style: { width: "100%", height: "100%" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(Original, { go })), /* @__PURE__ */ React.createElement("style", null, `
        .oracle-zone {
          fill: color-mix(in oklch, var(--clay-earth) 35%, transparent);
          stroke: color-mix(in oklch, var(--clay-earth) 70%, transparent);
          stroke-width: 0.6;
          cursor: pointer;
          transition: fill var(--respire) var(--ease-respire),
                      stroke var(--respire) var(--ease-respire);
        }
        .oracle-zone:hover {
          fill: color-mix(in oklch, var(--silk-gold) 22%, transparent);
          stroke: var(--silk-gold);
        }
        .oracle-zone.active {
          fill: color-mix(in oklch, var(--silk-gold) 30%, transparent);
          stroke: var(--silk-gold);
          stroke-width: 0.9;
          animation: oraclePulse 6s var(--ease-respire) infinite;
        }
        @keyframes oraclePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `));
};
const NotifsV12 = ({ go }) => {
  const Original = window.__NotifsOriginal;
  if (!Original) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(window.Surface, { matter: "linen", motion: true, style: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.55,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    height: 180,
    zIndex: 1,
    pointerEvents: "none",
    opacity: 0.3
  } }, /* @__PURE__ */ React.createElement(window.GeoSymbol, { kind: "demi-cercle" })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(Original, { go })), /* @__PURE__ */ React.createElement("style", null, `
        .stage label, .stage .meta {
          font-family: var(--serif);
        }
      `));
};
const PrivacyV12 = ({ go }) => {
  const Original = window.__PrivacyOriginal;
  if (!Original) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(window.Surface, { matter: "bone", motion: true, style: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.5,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 200,
    right: -60,
    width: 320,
    height: 320,
    opacity: 0.08,
    pointerEvents: "none",
    zIndex: 1
  } }, /* @__PURE__ */ React.createElement(window.GeoSymbol, { kind: "spirale", color: "silk" })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(Original, { go })));
};
const AbonnementV12 = ({ go }) => {
  const Original = window.__AbonnementOriginal;
  if (!Original) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(window.Surface, { matter: "paper", motion: true, style: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.55,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 280,
    left: "50%",
    transform: "translateX(-50%)",
    width: 600,
    height: 500,
    pointerEvents: "none",
    zIndex: 1,
    opacity: 0.35
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk", style: { width: "100%", height: "100%" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(Original, { go })));
};
const OffreKairosV12 = ({ go }) => {
  const Original = window.__OffreKairosOriginal;
  if (!Original) return null;
  v4E(() => {
    if (window.playRitual) window.playRitual("ceremoniel");
  }, []);
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement(window.Surface, { matter: "silk", motion: true, style: {
    position: "absolute",
    inset: 0,
    zIndex: 0,
    opacity: 0.7,
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    zIndex: 1,
    pointerEvents: "none",
    opacity: 0.55
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "bigdream", style: { width: "100%", height: "100%" } })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: "10%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 600,
    height: 600,
    opacity: 0.12,
    pointerEvents: "none",
    zIndex: 1
  } }, /* @__PURE__ */ React.createElement(window.GeoSymbol, { kind: "spirale", color: "silk" })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(Original, { go })));
};
const ModalV12 = ({ children, onClose, kind = "default" }) => {
  const matter = kind === "burn" ? "ember" : kind === "ceremonial" ? "silk" : "paper";
  const haloKind = kind === "burn" ? "ember" : kind === "ceremonial" ? "bigdream" : "silk";
  v4E(() => {
    if (kind === "ceremonial" && window.playRitual) window.playRitual("ceremoniel");
    if (kind === "burn" && window.playRitual) window.playRitual("braise");
  }, [kind]);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--s-4)",
        animation: "modalFadeIn var(--respire) var(--ease-respire)"
      },
      onClick: onClose
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      background: "color-mix(in oklch, var(--obsidian) 78%, transparent)",
      backdropFilter: "blur(8px)"
    } }),
    /* @__PURE__ */ React.createElement(window.Surface, { matter, motion: true, style: {
      position: "absolute",
      inset: 0,
      opacity: 0.35,
      pointerEvents: "none"
    } }),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity: 0.4
    } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: haloKind, style: { width: "100%", height: "100%" } })),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => e.stopPropagation(),
        style: {
          position: "relative",
          zIndex: 1,
          background: "var(--night-warm)",
          border: "1px solid var(--ash-deep)",
          padding: "var(--s-6)",
          maxWidth: 520,
          width: "100%",
          maxHeight: "calc(100vh - var(--s-6))",
          overflowY: "auto"
        }
      },
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onClose,
          "aria-label": "fermer",
          style: {
            position: "absolute",
            top: "var(--s-3)",
            right: "var(--s-3)",
            background: "transparent",
            border: "none",
            color: "var(--ash-light)",
            cursor: "pointer",
            fontSize: 18,
            fontFamily: "var(--serif)"
          }
        },
        "\xD7"
      ),
      children
    ),
    /* @__PURE__ */ React.createElement("style", null, `
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `)
  );
};
const ConstellationGeneric = ({
  data,
  mode = "figures",
  // figures | kairos | cercle | abstract
  focalLabel = "ici",
  onNodeClick,
  height = 360,
  showLabels = true,
  driftParticles = true,
  ambientHalo = true
}) => {
  if (!data || !data.nodes) return null;
  const nodes = data.nodes.find((n) => n.id === "self") ? data.nodes : [{ id: "self", label: focalLabel, kind: "self", weight: 2.5 }, ...data.nodes];
  const matter = {
    figures: "silk",
    kairos: "paper",
    cercle: "earth",
    abstract: "linen"
  }[mode] || "linen";
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    border: "1px solid var(--ash-deep)",
    background: "color-mix(in oklch, var(--obsidian) 45%, transparent)"
  } }, /* @__PURE__ */ React.createElement(window.Surface, { matter, motion: true, style: {
    position: "absolute",
    inset: 0,
    opacity: 0.3,
    pointerEvents: "none"
  } }), ambientHalo && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.25,
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk", style: { width: "100%", height: "100%" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(
    window.ConstellationD3,
    {
      nodes,
      edges: data.edges || [],
      focalId: "self",
      driftParticles,
      showLabels,
      onNodeClick,
      style: { width: "100%", height }
    }
  )));
};
window.__OnboardingOriginal = window.OnboardingScreen;
window.__OracleCorpsOriginal = window.OracleCorpsScreen;
window.__NotifsOriginal = window.NotifsScreen;
window.__PrivacyOriginal = window.PrivacyScreen;
window.__AbonnementOriginal = window.AbonnementScreen;
window.__OffreKairosOriginal = window.OffreKairosScreen;
window.__ModalOriginal = window.Modal;
window.OnboardingScreen = OnboardingV12;
window.OracleCorpsScreen = OracleCorpsV12;
window.NotifsScreen = NotifsV12;
window.PrivacyScreen = PrivacyV12;
window.AbonnementScreen = AbonnementV12;
window.OffreKairosScreen = OffreKairosV12;
window.Modal = ModalV12;
window.ConstellationGeneric = ConstellationGeneric;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy12MTItdmFndWU0LmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERyZWFtIFx1MjAxNCBWMS4yIGFtcGxpZmljYXRpb24gXHUwMEI3IFZhZ3VlIDQgKGZpbmFsZSlcbi8vIDggc3VyZmFjZXMgOiBPbmJvYXJkaW5nIFAtWlx1MDBFOXJvLCBPcmFjbGUgZHUgQ29ycHMsIE5vdGlmaWNhdGlvbnMsXG4vLyBQcml2YWN5LCBBYm9ubmVtZW50IChcdTIyNDhmZWVkYmFjayBtZXRhKSwgT2ZmcmUgYXUgS2Fpcm9zLCBNb2RhbCBWMS4yLFxuLy8gQ29uc3RlbGxhdGlvbiBnXHUwMEU5blx1MDBFOXJpcXVlIHdyYXBwZXIuXG4vL1xuLy8gQ2hhcmdcdTAwRTkgYXByXHUwMEU4cyBzY3JlZW5zLXYxMi12YWd1ZTMuanN4LCBhdmFudCBhcHAuanN4LlxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IHsgdXNlU3RhdGU6IHY0UywgdXNlRWZmZWN0OiB2NEUsIHVzZVJlZjogdjRSIH0gPSBSZWFjdDtcblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyAxLiBPTkJPQVJESU5HIFAtWlx1MDBDOVJPIFx1MjAxNCBtYXR0ZXIgZW1iZXIgKGJyYWlzZSBkJ2FjY3VlaWwpICtcbi8vICAgIHNvdWZmbGUgYXUgcGFzc2FnZSBkZSBjaGFxdWUgXHUwMEU5dGFwZSArIFdvdzAgXHUwMEUwIGxhIHByZW1pXHUwMEU4cmUgZW50clx1MDBFOWVcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgT25ib2FyZGluZ1YxMiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgT3JpZ2luYWwgPSB3aW5kb3cuX19PbmJvYXJkaW5nT3JpZ2luYWw7XG4gIGlmICghT3JpZ2luYWwpIHJldHVybiBudWxsO1xuICBjb25zdCBbc3RlcEtleSwgc2V0U3RlcEtleV0gPSB2NFMoMCk7XG5cbiAgLy8gV293MCBcdTIwMTQgcHJlbWlcdTAwRThyZSBmb2lzIHF1J29uIHJlbnRyZSBkYW5zIG9uYm9hcmRpbmcgKFAtWlx1MDBFOXJvKS5cbiAgLy8gRFx1MDBFOXNvcm1haXMgdmlhIHdvd1JlZ2lzdHJ5LmZpcmUoXCJmaXJzdC1sYXVuY2hcIikgKGNvaFx1MDBFOXJlbmNlIHJlZ2lzdHJ5LCBpZGVtcG90ZW50KS5cbiAgLy8gQ29tcGF0IDogc2kgbCdhbmNpZW5uZSBjbFx1MDBFOSBsb2NhbFN0b3JhZ2UgXCJkcmVhbTp3b3cwOmZpcmVkXCIgZXhpc3RlLCBvbiByZXNwZWN0ZSAocGFzIGRlIHJlLWZpcmUpLlxuICB2NEUoKCkgPT4ge1xuICAgIGlmICghd2luZG93Lndvd1JlZ2lzdHJ5KSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGxlZ2FjeSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJlYW06d293MDpmaXJlZFwiKTtcbiAgICAgIGlmIChsZWdhY3kgJiYgIXdpbmRvdy53b3dSZWdpc3RyeS5oYXMoXCJmaXJzdC1sYXVuY2hcIikpIHtcbiAgICAgICAgLy8gbWlncmF0aW9uIHNpbGVuY2lldXNlIDogbWFycXVlIGZpcnN0LWxhdW5jaCBjb21tZSBkXHUwMEU5alx1MDBFMCBmaXJlZFxuICAgICAgICBjb25zdCBzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRyZWFtOndvdy1maXJlZFwiKSB8fCBcInt9XCIpO1xuICAgICAgICBzW1wiZmlyc3QtbGF1bmNoXCJdID0gRGF0ZS5ub3coKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTp3b3ctZmlyZWRcIiwgSlNPTi5zdHJpbmdpZnkocykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfSBjYXRjaCB7fVxuICAgIGNvbnN0IGZpcmVkID0gd2luZG93Lndvd1JlZ2lzdHJ5LmZpcmUoXCJmaXJzdC1sYXVuY2hcIik7XG4gICAgaWYgKGZpcmVkICYmIHdpbmRvdy5wbGF5Uml0dWFsKSB3aW5kb3cucGxheVJpdHVhbChcInNldWlsXCIpO1xuICB9LCBbXSk7XG5cbiAgLy8gRFx1MDBFOXRlY3RlIGxlcyBjaGFuZ2VtZW50cyBkZSBzdGVwIHBvdXIgcmVqb3VlciB1biBzb3VmZmxlIHN1YnRpbFxuICB2NEUoKCkgPT4ge1xuICAgIGlmIChzdGVwS2V5ID4gMCAmJiB3aW5kb3cucGxheVJpdHVhbCkgd2luZG93LnBsYXlSaXR1YWwoXCJzb3VmZmxlXCIpO1xuICB9LCBbc3RlcEtleV0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCBtaW5IZWlnaHQ6IFwiMTAwdmhcIiB9fT5cbiAgICAgIHsvKiBtYXR0ZXIgZW1iZXIgXHUyMDE0IGxhIGJyYWlzZSBxdWkgYWNjdWVpbGxlLCB0clx1MDBFOHMgZG91Y2UgKi99XG4gICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPVwiZW1iZXJcIiBtb3Rpb249e3RydWV9IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCB6SW5kZXg6IDAsIG9wYWNpdHk6IDAuNDUsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgfX0gLz5cbiAgICAgIHsvKiBoYWxvIHNpbGsgZG91eCBkZXJyaVx1MDBFOHJlIGxhIHpvbmUgY2VudHJhbGUgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogXCIyMCVcIiwgbGVmdDogXCI1MCVcIixcbiAgICAgICAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVgoLTUwJSlcIixcbiAgICAgICAgd2lkdGg6IDcwMCwgaGVpZ2h0OiA1MDAsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDEsIG9wYWNpdHk6IDAuNCxcbiAgICAgIH19PlxuICAgICAgICA8d2luZG93LkhhbG9SZXNwaXJlIGtpbmQ9XCJzaWxrXCIgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IFwiMTAwJVwiIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBnXHUwMEU5b3N5bWJvbGUgc3BpcmFsZSB0clx1MDBFOHMgc3VidGlsIGVuIGJhcyBcdTIwMTQgbGUgY29tbWVuY2VtZW50ICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBib3R0b206IC0xNTAsIHJpZ2h0OiAtMTAwLFxuICAgICAgICB3aWR0aDogNDUwLCBoZWlnaHQ6IDQ1MCwgb3BhY2l0eTogMC4wNywgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMSxcbiAgICAgIH19PlxuICAgICAgICA8d2luZG93Lkdlb1N5bWJvbCBraW5kPVwic3BpcmFsZVwiIGNvbG9yPVwic2lsa1wiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyIH19XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFN0ZXBLZXkoayA9PiBrICsgMSl9PlxuICAgICAgICA8T3JpZ2luYWwgZ289e2dvfSAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIDIuIE9SQUNMRSBEVSBDT1JQUyBcdTIwMTQgbWF0dGVyIGVhcnRoICsgaGFsbyBlYXJ0aCByZXNwaXJhbnQgK1xuLy8gICAgY2VyY2xlcyBjb25jZW50cmlxdWVzIGF1dG91ciBkZSBsYSBzaWxob3VldHRlICsgZmVsdC1zaGlmdCBnYXRlc1xuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBPcmFjbGVDb3Jwc1YxMiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgT3JpZ2luYWwgPSB3aW5kb3cuX19PcmFjbGVDb3Jwc09yaWdpbmFsO1xuICBpZiAoIU9yaWdpbmFsKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgbWluSGVpZ2h0OiBcIjEwMHZoXCIgfX0+XG4gICAgICB7LyogbWF0dGVyIGVhcnRoIFx1MjAxNCBsJ2VucmFjaW5lbWVudCBzb21hdGlxdWUgKi99XG4gICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPVwiZWFydGhcIiBtb3Rpb249e3RydWV9IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCB6SW5kZXg6IDAsIG9wYWNpdHk6IDAuNTUsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgfX0gLz5cbiAgICAgIHsvKiBjZXJjbGVzIGNvbmNlbnRyaXF1ZXMgZGVycmlcdTAwRThyZSBsYSBzaWxob3VldHRlIFx1MjAxNCBsZXMgY291Y2hlcyBkdSBjb3JwcyAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdG9wOiAyMDAsIGxlZnQ6IDQwLFxuICAgICAgICB3aWR0aDogMzgwLCBoZWlnaHQ6IDM4MCwgb3BhY2l0eTogMC4wOCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMSxcbiAgICAgIH19PlxuICAgICAgICA8d2luZG93Lkdlb1N5bWJvbCBraW5kPVwiY2VyY2xlLWNvbmNlbnRyaXF1ZVwiIGNvbG9yPVwic2lsa1wiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBoYWxvIGVhcnRoIHJlc3BpcmFudCBjZW50clx1MDBFOSBzdXIgbGUgY29ycHMgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogMjUwLCBsZWZ0OiA2MCxcbiAgICAgICAgd2lkdGg6IDQwMCwgaGVpZ2h0OiA1MDAsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDEsIG9wYWNpdHk6IDAuNDUsXG4gICAgICB9fT5cbiAgICAgICAgPHdpbmRvdy5IYWxvUmVzcGlyZSBraW5kPVwiZWFydGhcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDIgfX0+XG4gICAgICAgIDxPcmlnaW5hbCBnbz17Z299IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIHsvKiBzdHlsZSBhZGRpdGlvbm5lbCBwb3VyIGxlcyB6b25lcyBcdTIwMTQgcHVsc2F0aW9uIGRpc2NyXHUwMEU4dGUgXHUwMEUwIGwnaG92ZXIgKi99XG4gICAgICA8c3R5bGU+e2BcbiAgICAgICAgLm9yYWNsZS16b25lIHtcbiAgICAgICAgICBmaWxsOiBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWNsYXktZWFydGgpIDM1JSwgdHJhbnNwYXJlbnQpO1xuICAgICAgICAgIHN0cm9rZTogY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1jbGF5LWVhcnRoKSA3MCUsIHRyYW5zcGFyZW50KTtcbiAgICAgICAgICBzdHJva2Utd2lkdGg6IDAuNjtcbiAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgICAgdHJhbnNpdGlvbjogZmlsbCB2YXIoLS1yZXNwaXJlKSB2YXIoLS1lYXNlLXJlc3BpcmUpLFxuICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZSB2YXIoLS1yZXNwaXJlKSB2YXIoLS1lYXNlLXJlc3BpcmUpO1xuICAgICAgICB9XG4gICAgICAgIC5vcmFjbGUtem9uZTpob3ZlciB7XG4gICAgICAgICAgZmlsbDogY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdHJhbnNwYXJlbnQpO1xuICAgICAgICAgIHN0cm9rZTogdmFyKC0tc2lsay1nb2xkKTtcbiAgICAgICAgfVxuICAgICAgICAub3JhY2xlLXpvbmUuYWN0aXZlIHtcbiAgICAgICAgICBmaWxsOiBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzAlLCB0cmFuc3BhcmVudCk7XG4gICAgICAgICAgc3Ryb2tlOiB2YXIoLS1zaWxrLWdvbGQpO1xuICAgICAgICAgIHN0cm9rZS13aWR0aDogMC45O1xuICAgICAgICAgIGFuaW1hdGlvbjogb3JhY2xlUHVsc2UgNnMgdmFyKC0tZWFzZS1yZXNwaXJlKSBpbmZpbml0ZTtcbiAgICAgICAgfVxuICAgICAgICBAa2V5ZnJhbWVzIG9yYWNsZVB1bHNlIHtcbiAgICAgICAgICAwJSwgMTAwJSB7IG9wYWNpdHk6IDE7IH1cbiAgICAgICAgICA1MCUgeyBvcGFjaXR5OiAwLjY1OyB9XG4gICAgICAgIH1cbiAgICAgIGB9PC9zdHlsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gMy4gTk9USUZJQ0FUSU9OUyBcdTIwMTQgbWF0dGVyIGxpbmVuICsgY2h1Y2hvdGVtZW50cyBlbiBzZXJpZiBpdGFsaXF1ZVxuLy8gICAgKyBzdXBwcmVzc2lvbiBkXHUwMEU5ZmluaXRpdmUgZGVzIFwiYWxlcnRlc1wiIGNvbW1lIHRvbmFsaXRcdTAwRTlcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgTm90aWZzVjEyID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBPcmlnaW5hbCA9IHdpbmRvdy5fX05vdGlmc09yaWdpbmFsO1xuICBpZiAoIU9yaWdpbmFsKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgbWluSGVpZ2h0OiBcIjEwMHZoXCIgfX0+XG4gICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPVwibGluZW5cIiBtb3Rpb249e3RydWV9IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCB6SW5kZXg6IDAsIG9wYWNpdHk6IDAuNTUsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgfX0gLz5cbiAgICAgIHsvKiBkZW1pLWNlcmNsZSBhdXJvcmUgdHJcdTAwRThzIHN1YnRpbCBlbiBoYXV0IFx1MjAxNCBsZXMgcGhhc2VzIHF1aSBzJ291dnJlbnQgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogNzAsIGxlZnQ6IDAsIHJpZ2h0OiAwLCBoZWlnaHQ6IDE4MCxcbiAgICAgICAgekluZGV4OiAxLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgb3BhY2l0eTogMC4zLFxuICAgICAgfX0+XG4gICAgICAgIDx3aW5kb3cuR2VvU3ltYm9sIGtpbmQ9XCJkZW1pLWNlcmNsZVwiIC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyIH19PlxuICAgICAgICA8T3JpZ2luYWwgZ289e2dvfSAvPlxuICAgICAgPC9kaXY+XG4gICAgICB7Lyogb3ZlcnJpZGUgOiB0b3V0IGxhYmVsIFwibm90aWZpY2F0aW9uXCIgZGV2aWVudCBcImNodWNob3RlbWVudFwiIGVuIHNlcmlmICovfVxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIC5zdGFnZSBsYWJlbCwgLnN0YWdlIC5tZXRhIHtcbiAgICAgICAgICBmb250LWZhbWlseTogdmFyKC0tc2VyaWYpO1xuICAgICAgICB9XG4gICAgICBgfTwvc3R5bGU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIDQuIFBSSVZBQ1kgXHUyMDE0IG1hdHRlciBib25lICh2XHUwMEU5bGluIGNsYWlyKSArIHNvYnJpXHUwMEU5dFx1MDBFOSBjcnlwdG9ncmFwaGlxdWVcbi8vICAgICsgc3BpcmFsZSBzdWJ0aWxlIHBvdXIgcmFwcGVsZXIgcXVlIGxhIG1cdTAwRTltb2lyZSBlc3QgZ2FyZFx1MDBFOWUsIHBhcyBhcmNoaXZcdTAwRTllXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmNvbnN0IFByaXZhY3lWMTIgPSAoeyBnbyB9KSA9PiB7XG4gIGNvbnN0IE9yaWdpbmFsID0gd2luZG93Ll9fUHJpdmFjeU9yaWdpbmFsO1xuICBpZiAoIU9yaWdpbmFsKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgbWluSGVpZ2h0OiBcIjEwMHZoXCIgfX0+XG4gICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPVwiYm9uZVwiIG1vdGlvbj17dHJ1ZX0gc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIHpJbmRleDogMCwgb3BhY2l0eTogMC41LCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgIH19IC8+XG4gICAgICB7Lyogc3BpcmFsZSBsZW50ZSwgc2lnbmF0dXJlIGRlIGxhIG1cdTAwRTltb2lyZSB2aXZhbnRlICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IDIwMCwgcmlnaHQ6IC02MCxcbiAgICAgICAgd2lkdGg6IDMyMCwgaGVpZ2h0OiAzMjAsIG9wYWNpdHk6IDAuMDgsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDEsXG4gICAgICB9fT5cbiAgICAgICAgPHdpbmRvdy5HZW9TeW1ib2wga2luZD1cInNwaXJhbGVcIiBjb2xvcj1cInNpbGtcIiAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMiB9fT5cbiAgICAgICAgPE9yaWdpbmFsIGdvPXtnb30gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyA1LiBBQk9OTkVNRU5UIFx1MjAxNCBtYXR0ZXIgcGFwZXIgKGwnZW5nYWdlbWVudCBcdTAwRTljcml0KSArIHZvaXggc29icmVcbi8vICAgICBwYXMgZGUgXCJwcmVtaXVtXCIsIHBhcyBkJ3VyZ2VuY2UsIGp1c3RlIHVuZSBvZmZyZSB0ZW51ZVxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBBYm9ubmVtZW50VjEyID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBPcmlnaW5hbCA9IHdpbmRvdy5fX0Fib25uZW1lbnRPcmlnaW5hbDtcbiAgaWYgKCFPcmlnaW5hbCkgcmV0dXJuIG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIG1pbkhlaWdodDogXCIxMDB2aFwiIH19PlxuICAgICAgPHdpbmRvdy5TdXJmYWNlIG1hdHRlcj1cInBhcGVyXCIgbW90aW9uPXt0cnVlfSBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgekluZGV4OiAwLCBvcGFjaXR5OiAwLjU1LCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgIH19IC8+XG4gICAgICB7LyogaGFsbyBzaWxrIGRpc2NyZXQsIGwnb2ZmcmUgYSB1bmUgcHJcdTAwRTlzZW5jZSByaXR1ZWxsZSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdG9wOiAyODAsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVYKC01MCUpXCIsXG4gICAgICAgIHdpZHRoOiA2MDAsIGhlaWdodDogNTAwLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAxLCBvcGFjaXR5OiAwLjM1LFxuICAgICAgfX0+XG4gICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cInNpbGtcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDIgfX0+XG4gICAgICAgIDxPcmlnaW5hbCBnbz17Z299IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gNi4gT0ZGUkUgQVUgS0FJUk9TIFx1MjAxNCBtYXR0ZXIgc2lsayArIGhhbG8gYmlnZHJlYW0gKyBXb3cgcml0dWVsXG4vLyAgICBDZSBtb21lbnQgZXN0IHJhcmUuIElsIG1cdTAwRTlyaXRlIGxhIGRvcnVyZSBwbGVpbmUuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmNvbnN0IE9mZnJlS2Fpcm9zVjEyID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBPcmlnaW5hbCA9IHdpbmRvdy5fX09mZnJlS2Fpcm9zT3JpZ2luYWw7XG4gIGlmICghT3JpZ2luYWwpIHJldHVybiBudWxsO1xuXG4gIHY0RSgoKSA9PiB7XG4gICAgLy8gam91ZXIgbGUgcml0dWVsIGQnb2ZmcmFuZGUgXHUwMEUwIGwnb3V2ZXJ0dXJlXG4gICAgaWYgKHdpbmRvdy5wbGF5Uml0dWFsKSB3aW5kb3cucGxheVJpdHVhbChcImNlcmVtb25pZWxcIik7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgbWluSGVpZ2h0OiBcIjEwMHZoXCIgfX0+XG4gICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPVwic2lsa1wiIG1vdGlvbj17dHJ1ZX0gc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIHpJbmRleDogMCwgb3BhY2l0eTogMC43LCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgIH19IC8+XG4gICAgICB7LyogaGFsbyBiaWdkcmVhbSBwbGVpbmUgcHVpc3NhbmNlIFx1MjAxNCBjJ2VzdCBsJ29mZnJhbmRlICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgekluZGV4OiAxLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgb3BhY2l0eTogMC41NSxcbiAgICAgIH19PlxuICAgICAgICA8d2luZG93LkhhbG9SZXNwaXJlIGtpbmQ9XCJiaWdkcmVhbVwiIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjEwMCVcIiB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgICB7Lyogc3BpcmFsZSBkb3JcdTAwRTllIGFtcGxlIGVuIGFycmlcdTAwRThyZS1wbGFuICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IFwiMTAlXCIsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVYKC01MCUpXCIsXG4gICAgICAgIHdpZHRoOiA2MDAsIGhlaWdodDogNjAwLCBvcGFjaXR5OiAwLjEyLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAxLFxuICAgICAgfX0+XG4gICAgICAgIDx3aW5kb3cuR2VvU3ltYm9sIGtpbmQ9XCJzcGlyYWxlXCIgY29sb3I9XCJzaWxrXCIgLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDIgfX0+XG4gICAgICAgIDxPcmlnaW5hbCBnbz17Z299IC8+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gNy4gTU9EQUwgVjEuMiBcdTIwMTQgYmFja2Ryb3AgYXZlYyBtYXR0ZXIgZG91Y2UgKyBlbWJlciBwb3VyIG1vZGFsZXMgYnVyblxuLy8gICAgT3ZlcnJpZGUgZGUgd2luZG93Lk1vZGFsIHBvdXIgYW1wbGlmaWVyIHRvdXRlcyBsZXMgbW9kYWxlcyBkdSBzeXN0XHUwMEU4bWVcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgTW9kYWxWMTIgPSAoeyBjaGlsZHJlbiwgb25DbG9zZSwga2luZCA9IFwiZGVmYXVsdFwiIH0pID0+IHtcbiAgLy8ga2luZDogXCJkZWZhdWx0XCIgfCBcImJ1cm5cIiB8IFwiY2VyZW1vbmlhbFwiXG4gIGNvbnN0IG1hdHRlciA9IGtpbmQgPT09IFwiYnVyblwiID8gXCJlbWJlclwiIDoga2luZCA9PT0gXCJjZXJlbW9uaWFsXCIgPyBcInNpbGtcIiA6IFwicGFwZXJcIjtcbiAgY29uc3QgaGFsb0tpbmQgPSBraW5kID09PSBcImJ1cm5cIiA/IFwiZW1iZXJcIiA6IGtpbmQgPT09IFwiY2VyZW1vbmlhbFwiID8gXCJiaWdkcmVhbVwiIDogXCJzaWxrXCI7XG5cbiAgdjRFKCgpID0+IHtcbiAgICBpZiAoa2luZCA9PT0gXCJjZXJlbW9uaWFsXCIgJiYgd2luZG93LnBsYXlSaXR1YWwpIHdpbmRvdy5wbGF5Uml0dWFsKFwiY2VyZW1vbmllbFwiKTtcbiAgICBpZiAoa2luZCA9PT0gXCJidXJuXCIgJiYgd2luZG93LnBsYXlSaXR1YWwpIHdpbmRvdy5wbGF5Uml0dWFsKFwiYnJhaXNlXCIpO1xuICB9LCBba2luZF0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgcG9zaXRpb246IFwiZml4ZWRcIiwgaW5zZXQ6IDAsIHpJbmRleDogMTAwLFxuICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICBhbmltYXRpb246IFwibW9kYWxGYWRlSW4gdmFyKC0tcmVzcGlyZSkgdmFyKC0tZWFzZS1yZXNwaXJlKVwiLFxuICAgIH19XG4gICAgICBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgIHsvKiBiYWNrZHJvcCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1vYnNpZGlhbikgNzglLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig4cHgpXCIsXG4gICAgICB9fSAvPlxuICAgICAgey8qIG1hdHRlciBvdmVybGF5IHNvYnJlICovfVxuICAgICAgPHdpbmRvdy5TdXJmYWNlIG1hdHRlcj17bWF0dGVyfSBtb3Rpb249e3RydWV9IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBvcGFjaXR5OiAwLjM1LCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgIH19IC8+XG4gICAgICB7LyogaGFsbyByZXNwaXJhbnQgc3VidGlsICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIG9wYWNpdHk6IDAuNCxcbiAgICAgIH19PlxuICAgICAgICA8d2luZG93LkhhbG9SZXNwaXJlIGtpbmQ9e2hhbG9LaW5kfSBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEsXG4gICAgICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC13YXJtKVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTYpXCIsXG4gICAgICAgICAgbWF4V2lkdGg6IDUyMCwgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgIG1heEhlaWdodDogXCJjYWxjKDEwMHZoIC0gdmFyKC0tcy02KSlcIiwgb3ZlcmZsb3dZOiBcImF1dG9cIixcbiAgICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICBhcmlhLWxhYmVsPVwiZmVybWVyXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdG9wOiBcInZhcigtLXMtMylcIiwgcmlnaHQ6IFwidmFyKC0tcy0zKVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE4LCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgIH19Plx1MDBENzwvYnV0dG9uPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICAgIDxzdHlsZT57YFxuICAgICAgICBAa2V5ZnJhbWVzIG1vZGFsRmFkZUluIHtcbiAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgfVxuICAgICAgICAgIHRvIHsgb3BhY2l0eTogMTsgfVxuICAgICAgICB9XG4gICAgICBgfTwvc3R5bGU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIDguIENPTlNURUxMQVRJT04gXHUyMDE0IHdyYXBwZXIgclx1MDBFOXV0aWxpc2FibGUgYXV0b3VyIGRlIENvbnN0ZWxsYXRpb25EM1xuLy8gICAgZXhwb3NlIHVuZSBBUEkgc2ltcGxpZmlcdTAwRTllIDogPENvbnN0ZWxsYXRpb25HZW5lcmljIGRhdGE9e1x1MjAyNn0gbW9kZT1cImZpZ3VyZXN8a2Fpcm9zfGNlcmNsZVwiIC8+XG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmNvbnN0IENvbnN0ZWxsYXRpb25HZW5lcmljID0gKHtcbiAgZGF0YSxcbiAgbW9kZSA9IFwiZmlndXJlc1wiLCAgICAgIC8vIGZpZ3VyZXMgfCBrYWlyb3MgfCBjZXJjbGUgfCBhYnN0cmFjdFxuICBmb2NhbExhYmVsID0gXCJpY2lcIixcbiAgb25Ob2RlQ2xpY2ssXG4gIGhlaWdodCA9IDM2MCxcbiAgc2hvd0xhYmVscyA9IHRydWUsXG4gIGRyaWZ0UGFydGljbGVzID0gdHJ1ZSxcbiAgYW1iaWVudEhhbG8gPSB0cnVlLFxufSkgPT4ge1xuICBpZiAoIWRhdGEgfHwgIWRhdGEubm9kZXMpIHJldHVybiBudWxsO1xuXG4gIC8vIGFzc3VyZSBxdSd1biBuXHUwMTUzdWQgXCJzZWxmXCIgZXhpc3RlXG4gIGNvbnN0IG5vZGVzID0gZGF0YS5ub2Rlcy5maW5kKG4gPT4gbi5pZCA9PT0gXCJzZWxmXCIpXG4gICAgPyBkYXRhLm5vZGVzXG4gICAgOiBbeyBpZDogXCJzZWxmXCIsIGxhYmVsOiBmb2NhbExhYmVsLCBraW5kOiBcInNlbGZcIiwgd2VpZ2h0OiAyLjUgfSwgLi4uZGF0YS5ub2Rlc107XG5cbiAgLy8gbWF0dGVyIHNlbG9uIGxlIG1vZGVcbiAgY29uc3QgbWF0dGVyID0ge1xuICAgIGZpZ3VyZXM6IFwic2lsa1wiLFxuICAgIGthaXJvczogXCJwYXBlclwiLFxuICAgIGNlcmNsZTogXCJlYXJ0aFwiLFxuICAgIGFic3RyYWN0OiBcImxpbmVuXCIsXG4gIH1bbW9kZV0gfHwgXCJsaW5lblwiO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tb2JzaWRpYW4pIDQ1JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgfX0+XG4gICAgICB7LyogbWF0dGVyIGVuIGFycmlcdTAwRThyZS1mb25kLCB0clx1MDBFOHMgZGlzY3JldCAqL31cbiAgICAgIDx3aW5kb3cuU3VyZmFjZSBtYXR0ZXI9e21hdHRlcn0gbW90aW9uPXt0cnVlfSBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgb3BhY2l0eTogMC4zLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgIH19IC8+XG4gICAgICB7LyogaGFsbyBzaWxrIHJlc3BpcmFudCBzaSBhY3Rpdlx1MDBFOSAqL31cbiAgICAgIHthbWJpZW50SGFsbyAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIG9wYWNpdHk6IDAuMjUsIHpJbmRleDogMCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHdpbmRvdy5IYWxvUmVzcGlyZSBraW5kPVwic2lsa1wiIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjEwMCVcIiB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMSB9fT5cbiAgICAgICAgPHdpbmRvdy5Db25zdGVsbGF0aW9uRDNcbiAgICAgICAgICBub2Rlcz17bm9kZXN9XG4gICAgICAgICAgZWRnZXM9e2RhdGEuZWRnZXMgfHwgW119XG4gICAgICAgICAgZm9jYWxJZD1cInNlbGZcIlxuICAgICAgICAgIGRyaWZ0UGFydGljbGVzPXtkcmlmdFBhcnRpY2xlc31cbiAgICAgICAgICBzaG93TGFiZWxzPXtzaG93TGFiZWxzfVxuICAgICAgICAgIG9uTm9kZUNsaWNrPXtvbk5vZGVDbGlja31cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodCB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIEFwcGxpY2F0aW9uIGRlcyBvdmVycmlkZXMgVjRcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuXG4vLyBTYXV2ZWdhcmRlIGRlcyBvcmlnaW5hdXggcG91ciB3cmFwcGluZ1xud2luZG93Ll9fT25ib2FyZGluZ09yaWdpbmFsID0gd2luZG93Lk9uYm9hcmRpbmdTY3JlZW47XG53aW5kb3cuX19PcmFjbGVDb3Jwc09yaWdpbmFsID0gd2luZG93Lk9yYWNsZUNvcnBzU2NyZWVuO1xud2luZG93Ll9fTm90aWZzT3JpZ2luYWwgPSB3aW5kb3cuTm90aWZzU2NyZWVuO1xud2luZG93Ll9fUHJpdmFjeU9yaWdpbmFsID0gd2luZG93LlByaXZhY3lTY3JlZW47XG53aW5kb3cuX19BYm9ubmVtZW50T3JpZ2luYWwgPSB3aW5kb3cuQWJvbm5lbWVudFNjcmVlbjtcbndpbmRvdy5fX09mZnJlS2Fpcm9zT3JpZ2luYWwgPSB3aW5kb3cuT2ZmcmVLYWlyb3NTY3JlZW47XG53aW5kb3cuX19Nb2RhbE9yaWdpbmFsID0gd2luZG93Lk1vZGFsO1xuXG4vLyBPdmVycmlkZSBwYXIgbGVzIHZlcnNpb25zIFYxLjJcbndpbmRvdy5PbmJvYXJkaW5nU2NyZWVuID0gT25ib2FyZGluZ1YxMjtcbndpbmRvdy5PcmFjbGVDb3Jwc1NjcmVlbiA9IE9yYWNsZUNvcnBzVjEyO1xud2luZG93Lk5vdGlmc1NjcmVlbiA9IE5vdGlmc1YxMjtcbndpbmRvdy5Qcml2YWN5U2NyZWVuID0gUHJpdmFjeVYxMjtcbndpbmRvdy5BYm9ubmVtZW50U2NyZWVuID0gQWJvbm5lbWVudFYxMjtcbndpbmRvdy5PZmZyZUthaXJvc1NjcmVlbiA9IE9mZnJlS2Fpcm9zVjEyO1xud2luZG93Lk1vZGFsID0gTW9kYWxWMTI7XG5cbi8vIE5vdXZlYXUgY29tcG9zYW50IGV4cG9zXHUwMEU5IDogQ29uc3RlbGxhdGlvbiBnXHUwMEU5blx1MDBFOXJpcXVlXG53aW5kb3cuQ29uc3RlbGxhdGlvbkdlbmVyaWMgPSBDb25zdGVsbGF0aW9uR2VuZXJpYztcbiJdLAogICJtYXBwaW5ncyI6ICJBQVVBLE1BQU0sRUFBRSxVQUFVLEtBQUssV0FBVyxLQUFLLFFBQVEsSUFBSSxJQUFJO0FBTXZELE1BQU0sZ0JBQWdCLENBQUMsRUFBRSxHQUFHLE1BQU07QUFDaEMsUUFBTSxXQUFXLE9BQU87QUFDeEIsTUFBSSxDQUFDLFNBQVUsUUFBTztBQUN0QixRQUFNLENBQUMsU0FBUyxV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
