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
    const t = setTimeout(() => onDone == null ? void 0 : onDone(), 9e3);
    return () => clearTimeout(t);
  }, [show, onDone]);
  if (!show) return null;
  const duration = _formatDuration(daysAgo);
  const handleNotTouch = () => {
    try {
      onDismiss && onDismiss();
    } catch (e) {
    }
    onDone && onDone();
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-label": "ce kairos en a r\xE9veill\xE9 un autre",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 9e3,
        background: "color-mix(in oklch, var(--night-floor) 92%, black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "echo-prophetic-overlay-fade-in 600ms ease-out",
        overflow: "auto"
      }
    },
    /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 17,
      lineHeight: 1.5,
      color: "var(--bone)",
      opacity: 0.9,
      textAlign: "center",
      maxWidth: 540,
      margin: "0 0 28px 0",
      textWrap: "pretty",
      letterSpacing: "0.005em"
    } }, "Ce kairos en a r\xE9veill\xE9 un autre, d\xE9pos\xE9 ", duration, "."),
    /* @__PURE__ */ React.createElement("div", { style: {
      position: "relative",
      width: "100%",
      maxWidth: 640,
      display: "flex",
      alignItems: "stretch",
      justifyContent: "space-between",
      gap: 18,
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement("div", { className: "echo-card", style: {
      flex: "1 1 240px",
      minWidth: 0,
      padding: "18px 20px",
      background: "color-mix(in oklch, var(--night-warm) 70%, transparent)",
      border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
      borderRadius: 0
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--mono)",
      fontSize: 9.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--silk-gold)",
      opacity: 0.7,
      marginBottom: 10
    } }, "pr\xE9sent"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 14.5,
      lineHeight: 1.6,
      color: "var(--bone)",
      margin: 0,
      textWrap: "pretty"
    } }, presentText.slice(0, 220), presentText.length > 220 ? "\u2026" : "")), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      flex: "0 0 auto",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 36
    } }, /* @__PURE__ */ React.createElement("svg", { width: "60", height: "40", viewBox: "0 0 60 40", style: { display: "block" } }, /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 4 20 Q 15 8, 30 20 T 56 20",
        fill: "none",
        stroke: "var(--silk-gold)",
        strokeWidth: "0.9",
        strokeOpacity: "0.65",
        strokeLinecap: "round",
        style: { animation: "echo-line-flow 4.2s ease-in-out infinite" }
      }
    ))), /* @__PURE__ */ React.createElement("div", { className: "echo-card", style: {
      flex: "1 1 240px",
      minWidth: 0,
      padding: "18px 20px",
      background: "color-mix(in oklch, var(--night-warm) 50%, transparent)",
      border: "1px dashed color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
      borderRadius: 0
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--mono)",
      fontSize: 9.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "var(--silk-gold)",
      opacity: 0.6,
      marginBottom: 10
    } }, "pass\xE9 \xB7 ", duration), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 14.5,
      lineHeight: 1.6,
      color: "color-mix(in oklch, var(--bone) 80%, var(--ash-light))",
      margin: 0,
      textWrap: "pretty"
    } }, pastText.slice(0, 220), pastText.length > 220 ? "\u2026" : ""))),
    /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 36,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleNotTouch,
        style: {
          background: "transparent",
          border: "1px solid color-mix(in oklch, var(--ash-light) 60%, transparent)",
          color: "var(--ash-light)",
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "10px 22px",
          cursor: "pointer",
          transition: "all 280ms ease",
          borderRadius: 0
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.color = "var(--bone)";
          e.currentTarget.style.borderColor = "var(--bone)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.color = "var(--ash-light)";
          e.currentTarget.style.borderColor = "color-mix(in oklch, var(--ash-light) 60%, transparent)";
        }
      },
      "[ cet \xE9cho ne touche pas ]"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onDone == null ? void 0 : onDone(),
        style: {
          background: "transparent",
          border: "none",
          color: "var(--ash-light)",
          opacity: 0.55,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 12.5,
          cursor: "pointer",
          padding: "4px 10px",
          letterSpacing: "0.02em"
        }
      },
      "fermer"
    )),
    /* @__PURE__ */ React.createElement("style", null, `
        @keyframes echo-prophetic-overlay-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes echo-line-flow {
          0%, 100% { stroke-opacity: 0.45; transform: translateX(0); }
          50%      { stroke-opacity: 0.95; transform: translateX(2px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label="ce kairos en a r\xE9veill\xE9 un autre"] * {
            animation: none !important;
          }
        }
      `)
  );
};
let _echoOverlayState = { show: false, presentText: "", pastText: "", daysAgo: 0, onDismiss: null, onDone: null };
const _echoOverlayListeners = /* @__PURE__ */ new Set();
function _notifyEcho() {
  _echoOverlayListeners.forEach((fn) => {
    try {
      fn({ ..._echoOverlayState });
    } catch (e) {
    }
  });
}
window.dreamShowEchoOverlay = function({ presentText = "", pastText = "", daysAgo = 0, onDismiss = null } = {}) {
  _echoOverlayState = {
    show: true,
    presentText,
    pastText,
    daysAgo,
    onDismiss,
    onDone: () => {
      _echoOverlayState.show = false;
      _notifyEcho();
    }
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
  return /* @__PURE__ */ React.createElement(
    EchoPropheticOverlay,
    {
      show: state.show,
      presentText: state.presentText,
      pastText: state.pastText,
      daysAgo: state.daysAgo,
      onDismiss: state.onDismiss,
      onDone: state.onDone
    }
  );
};
window.EchoPropheticOverlay = EchoPropheticOverlay;
window.EchoPropheticOverlayRoot = EchoPropheticOverlayRoot;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1lY2hvLXByb3BoZXRpYy1vdmVybGF5LmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIEVjaG9Qcm9waGV0aWNPdmVybGF5IChZZXNodWEgMjAyNi0wNC0yOSlcbi8vIFBsZWluIFx1MDBFOWNyYW4gZmFkZS1pbiA2MDBtcyBcdTAwQjcgMiBjYXJkcyAocHJcdTAwRTlzZW50IHwgcGFzc1x1MDBFOSkgcmVsaVx1MDBFOWVzXG4vLyBwYXIgdW5lIGxpZ25lIG9uZHVsZXVzZSBzaWxrLWdvbGQuIEJvdXRvbiBcIlsgY2V0IFx1MDBFOWNobyBuZSB0b3VjaGUgcGFzIF1cIi5cbi8vXG4vLyBUcmlnZ2VyIDogd2luZG93LmRyZWFtU2hvd0VjaG9PdmVybGF5KHsgcHJlc2VudFRleHQsIHBhc3RUZXh0LCBkYXlzQWdvLCBvbkRpc21pc3MgfSlcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiBlcG9TLCB1c2VFZmZlY3Q6IGVwb0UgfSA9IFJlYWN0O1xuXG5mdW5jdGlvbiBfZm9ybWF0RHVyYXRpb24oZGF5c0Fnbykge1xuICBpZiAoIWRheXNBZ28gfHwgZGF5c0FnbyA8IDApIHJldHVybiBcImlsIHkgYSBxdWVscXVlIHRlbXBzXCI7XG4gIGlmIChkYXlzQWdvIDwgMSkgcmV0dXJuIFwiaWwgeSBhIG1vaW5zIGQndW4gam91clwiO1xuICBpZiAoZGF5c0FnbyA8IDMwKSByZXR1cm4gZGF5c0FnbyA9PT0gMSA/IFwiaWwgeSBhIDEgam91clwiIDogYGlsIHkgYSAke2RheXNBZ299IGpvdXJzYDtcbiAgY29uc3QgbW9udGhzID0gTWF0aC5mbG9vcihkYXlzQWdvIC8gMzApO1xuICBpZiAobW9udGhzIDwgMTIpIHJldHVybiBtb250aHMgPT09IDEgPyBcImlsIHkgYSAxIG1vaXNcIiA6IGBpbCB5IGEgJHttb250aHN9IG1vaXNgO1xuICBjb25zdCB5ZWFycyA9IE1hdGguZmxvb3IobW9udGhzIC8gMTIpO1xuICByZXR1cm4geWVhcnMgPT09IDEgPyBcImlsIHkgYSAxIGFuXCIgOiBgaWwgeSBhICR7eWVhcnN9IGFuc2A7XG59XG5cbmNvbnN0IEVjaG9Qcm9waGV0aWNPdmVybGF5ID0gKHsgc2hvdywgcHJlc2VudFRleHQgPSBcIlwiLCBwYXN0VGV4dCA9IFwiXCIsIGRheXNBZ28gPSAwLCBvbkRvbmUsIG9uRGlzbWlzcyB9KSA9PiB7XG4gIGVwb0UoKCkgPT4ge1xuICAgIGlmICghc2hvdykgcmV0dXJuO1xuICAgIC8vIEF1dG8tZGlzbWlzcyBhZnRlciA5cyBpZiB1c2VyIGRvZXNuJ3QgaW50ZXJhY3QgKGxvbmdlciB0aGFuIGNvbnN0ZWxsYXRpb24sIG1vcmUgY29udGVtcGxhdGlmKVxuICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IG9uRG9uZT8uKCksIDkwMDApO1xuICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodCk7XG4gIH0sIFtzaG93LCBvbkRvbmVdKTtcblxuICBpZiAoIXNob3cpIHJldHVybiBudWxsO1xuICBjb25zdCBkdXJhdGlvbiA9IF9mb3JtYXREdXJhdGlvbihkYXlzQWdvKTtcbiAgY29uc3QgaGFuZGxlTm90VG91Y2ggPSAoKSA9PiB7XG4gICAgdHJ5IHsgb25EaXNtaXNzICYmIG9uRGlzbWlzcygpOyB9IGNhdGNoIHt9XG4gICAgb25Eb25lICYmIG9uRG9uZSgpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgcm9sZT1cImRpYWxvZ1wiXG4gICAgICBhcmlhLWxhYmVsPVwiY2Uga2Fpcm9zIGVuIGEgclx1MDBFOXZlaWxsXHUwMEU5IHVuIGF1dHJlXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIGluc2V0OiAwLCB6SW5kZXg6IDkwMDAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgOTIlLCBibGFjaylcIixcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICBwYWRkaW5nOiBcIjI0cHhcIixcbiAgICAgICAgYW5pbWF0aW9uOiBcImVjaG8tcHJvcGhldGljLW92ZXJsYXktZmFkZS1pbiA2MDBtcyBlYXNlLW91dFwiLFxuICAgICAgICBvdmVyZmxvdzogXCJhdXRvXCIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHsvKiBUZXh0ZSB0b3AgaXRhbGljICovfVxuICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMTcsIGxpbmVIZWlnaHQ6IDEuNSxcbiAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgb3BhY2l0eTogMC45LFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIG1heFdpZHRoOiA1NDAsXG4gICAgICAgIG1hcmdpbjogXCIwIDAgMjhweCAwXCIsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDA1ZW1cIixcbiAgICAgIH19PlxuICAgICAgICBDZSBrYWlyb3MgZW4gYSByXHUwMEU5dmVpbGxcdTAwRTkgdW4gYXV0cmUsIGRcdTAwRTlwb3NcdTAwRTkge2R1cmF0aW9ufS5cbiAgICAgIDwvcD5cblxuICAgICAgey8qIDIgY2FyZHMgKyBsaWduZSBvbmR1bGV1c2UgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgIHdpZHRoOiBcIjEwMCVcIiwgbWF4V2lkdGg6IDY0MCxcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwic3RyZXRjaFwiLFxuICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGdhcDogMTgsXG4gICAgICAgIGZsZXhXcmFwOiBcIndyYXBcIixcbiAgICAgIH19PlxuICAgICAgICB7LyogQ2FydGUgcHJcdTAwRTlzZW50ICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVjaG8tY2FyZFwiIHN0eWxlPXt7XG4gICAgICAgICAgZmxleDogXCIxIDEgMjQwcHhcIiwgbWluV2lkdGg6IDAsXG4gICAgICAgICAgcGFkZGluZzogXCIxOHB4IDIwcHhcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgNzAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzNSUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDkuNSwgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgb3BhY2l0eTogMC43LFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAxMCxcbiAgICAgICAgICB9fT5wclx1MDBFOXNlbnQ8L2Rpdj5cbiAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE0LjUsIGxpbmVIZWlnaHQ6IDEuNixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7cHJlc2VudFRleHQuc2xpY2UoMCwgMjIwKX17cHJlc2VudFRleHQubGVuZ3RoID4gMjIwID8gXCJcdTIwMjZcIiA6IFwiXCJ9XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogTGlnbmUgb25kdWxldXNlIGF1IGNlbnRyZSAodmlzaWJsZSBxdWFuZCBwYXMgd3JhcCkgKi99XG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICBmbGV4OiBcIjAgMCBhdXRvXCIsIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICAgIG1pbldpZHRoOiAzNixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjYwXCIgaGVpZ2h0PVwiNDBcIiB2aWV3Qm94PVwiMCAwIDYwIDQwXCIgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiIH19PlxuICAgICAgICAgICAgPHBhdGggZD1cIk0gNCAyMCBRIDE1IDgsIDMwIDIwIFQgNTYgMjBcIlxuICAgICAgICAgICAgICBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLXNpbGstZ29sZClcIiBzdHJva2VXaWR0aD1cIjAuOVwiIHN0cm9rZU9wYWNpdHk9XCIwLjY1XCJcbiAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgYW5pbWF0aW9uOiBcImVjaG8tbGluZS1mbG93IDQuMnMgZWFzZS1pbi1vdXQgaW5maW5pdGVcIiB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIENhcnRlIHBhc3NcdTAwRTkgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZWNoby1jYXJkXCIgc3R5bGU9e3tcbiAgICAgICAgICBmbGV4OiBcIjEgMSAyNDBweFwiLCBtaW5XaWR0aDogMCxcbiAgICAgICAgICBwYWRkaW5nOiBcIjE4cHggMjBweFwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA1MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggZGFzaGVkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDkuNSwgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgb3BhY2l0eTogMC42LFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAxMCxcbiAgICAgICAgICB9fT5wYXNzXHUwMEU5IFx1MDBCNyB7ZHVyYXRpb259PC9kaXY+XG4gICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNC41LCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICBjb2xvcjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWJvbmUpIDgwJSwgdmFyKC0tYXNoLWxpZ2h0KSlcIixcbiAgICAgICAgICAgIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7cGFzdFRleHQuc2xpY2UoMCwgMjIwKX17cGFzdFRleHQubGVuZ3RoID4gMjIwID8gXCJcdTIwMjZcIiA6IFwiXCJ9XG4gICAgICAgICAgPC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogQm91dG9uIFwibmUgdG91Y2hlIHBhc1wiICsgYm91dG9uIGZlcm1lciBkb3V4ICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBtYXJnaW5Ub3A6IDM2LCBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbiAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiAxMixcbiAgICAgIH19PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZU5vdFRvdWNofVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYXNoLWxpZ2h0KSA2MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xOGVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggMjJweFwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMjgwbXMgZWFzZVwiLCBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcInZhcigtLWJvbmUpXCI7IGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFwidmFyKC0tYm9uZSlcIjsgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcInZhcigtLWFzaC1saWdodClcIjsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgNjAlLCB0cmFuc3BhcmVudClcIjsgfX1cbiAgICAgICAgPlxuICAgICAgICAgIFsgY2V0IFx1MDBFOWNobyBuZSB0b3VjaGUgcGFzIF1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gb25Eb25lPy4oKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjU1LFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIuNSxcbiAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsIHBhZGRpbmc6IFwiNHB4IDEwcHhcIixcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgZmVybWVyXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxzdHlsZT57YFxuICAgICAgICBAa2V5ZnJhbWVzIGVjaG8tcHJvcGhldGljLW92ZXJsYXktZmFkZS1pbiB7XG4gICAgICAgICAgZnJvbSB7IG9wYWNpdHk6IDA7IH1cbiAgICAgICAgICB0byAgIHsgb3BhY2l0eTogMTsgfVxuICAgICAgICB9XG4gICAgICAgIEBrZXlmcmFtZXMgZWNoby1saW5lLWZsb3cge1xuICAgICAgICAgIDAlLCAxMDAlIHsgc3Ryb2tlLW9wYWNpdHk6IDAuNDU7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwKTsgfVxuICAgICAgICAgIDUwJSAgICAgIHsgc3Ryb2tlLW9wYWNpdHk6IDAuOTU7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgycHgpOyB9XG4gICAgICAgIH1cbiAgICAgICAgQG1lZGlhIChwcmVmZXJzLXJlZHVjZWQtbW90aW9uOiByZWR1Y2UpIHtcbiAgICAgICAgICBbYXJpYS1sYWJlbD1cImNlIGthaXJvcyBlbiBhIHJcdTAwRTl2ZWlsbFx1MDBFOSB1biBhdXRyZVwiXSAqIHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogbm9uZSAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gU2luZ2xldG9uIG1vdW50ICsgdHJpZ2dlciBnbG9iYWxcbmxldCBfZWNob092ZXJsYXlTdGF0ZSA9IHsgc2hvdzogZmFsc2UsIHByZXNlbnRUZXh0OiBcIlwiLCBwYXN0VGV4dDogXCJcIiwgZGF5c0FnbzogMCwgb25EaXNtaXNzOiBudWxsLCBvbkRvbmU6IG51bGwgfTtcbmNvbnN0IF9lY2hvT3ZlcmxheUxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbmZ1bmN0aW9uIF9ub3RpZnlFY2hvKCkgeyBfZWNob092ZXJsYXlMaXN0ZW5lcnMuZm9yRWFjaChmbiA9PiB7IHRyeSB7IGZuKHsgLi4uX2VjaG9PdmVybGF5U3RhdGUgfSk7IH0gY2F0Y2gge30gfSk7IH1cblxud2luZG93LmRyZWFtU2hvd0VjaG9PdmVybGF5ID0gZnVuY3Rpb24gKHsgcHJlc2VudFRleHQgPSBcIlwiLCBwYXN0VGV4dCA9IFwiXCIsIGRheXNBZ28gPSAwLCBvbkRpc21pc3MgPSBudWxsIH0gPSB7fSkge1xuICBfZWNob092ZXJsYXlTdGF0ZSA9IHtcbiAgICBzaG93OiB0cnVlLFxuICAgIHByZXNlbnRUZXh0LCBwYXN0VGV4dCwgZGF5c0FnbyxcbiAgICBvbkRpc21pc3MsXG4gICAgb25Eb25lOiAoKSA9PiB7XG4gICAgICBfZWNob092ZXJsYXlTdGF0ZS5zaG93ID0gZmFsc2U7XG4gICAgICBfbm90aWZ5RWNobygpO1xuICAgIH0sXG4gIH07XG4gIF9ub3RpZnlFY2hvKCk7XG59O1xuXG5jb25zdCBFY2hvUHJvcGhldGljT3ZlcmxheVJvb3QgPSAoKSA9PiB7XG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gZXBvUyhfZWNob092ZXJsYXlTdGF0ZSk7XG4gIGVwb0UoKCkgPT4ge1xuICAgIGNvbnN0IGZuID0gKHMpID0+IHNldFN0YXRlKHMpO1xuICAgIF9lY2hvT3ZlcmxheUxpc3RlbmVycy5hZGQoZm4pO1xuICAgIHJldHVybiAoKSA9PiBfZWNob092ZXJsYXlMaXN0ZW5lcnMuZGVsZXRlKGZuKTtcbiAgfSwgW10pO1xuICByZXR1cm4gKFxuICAgIDxFY2hvUHJvcGhldGljT3ZlcmxheVxuICAgICAgc2hvdz17c3RhdGUuc2hvd31cbiAgICAgIHByZXNlbnRUZXh0PXtzdGF0ZS5wcmVzZW50VGV4dH1cbiAgICAgIHBhc3RUZXh0PXtzdGF0ZS5wYXN0VGV4dH1cbiAgICAgIGRheXNBZ289e3N0YXRlLmRheXNBZ299XG4gICAgICBvbkRpc21pc3M9e3N0YXRlLm9uRGlzbWlzc31cbiAgICAgIG9uRG9uZT17c3RhdGUub25Eb25lfVxuICAgIC8+XG4gICk7XG59O1xuXG53aW5kb3cuRWNob1Byb3BoZXRpY092ZXJsYXkgPSBFY2hvUHJvcGhldGljT3ZlcmxheTtcbndpbmRvdy5FY2hvUHJvcGhldGljT3ZlcmxheVJvb3QgPSBFY2hvUHJvcGhldGljT3ZlcmxheVJvb3Q7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFTQSxNQUFNLEVBQUUsVUFBVSxNQUFNLFdBQVcsS0FBSyxJQUFJO0FBRTVDLFNBQVMsZ0JBQWdCLFNBQVM7QUFDaEMsTUFBSSxDQUFDLFdBQVcsVUFBVSxFQUFHLFFBQU87QUFDcEMsTUFBSSxVQUFVLEVBQUcsUUFBTztBQUN4QixNQUFJLFVBQVUsR0FBSSxRQUFPLFlBQVksSUFBSSxrQkFBa0IsVUFBVSxPQUFPO0FBQzVFLFFBQU0sU0FBUyxLQUFLLE1BQU0sVUFBVSxFQUFFO0FBQ3RDLE1BQUksU0FBUyxHQUFJLFFBQU8sV0FBVyxJQUFJLGtCQUFrQixVQUFVLE1B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
