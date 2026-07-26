const { useState: uOR_S, useEffect: uOR_E, useRef: uOR_R } = React;
const ONBOARDED_KEY = "dream:onboarded:b-plus-d";
const PROFILE_KEY = "dream:onboarding-profile";
function isOnboardedBPlusD() {
  try {
    return !!localStorage.getItem(ONBOARDED_KEY);
  } catch (e) {
    return false;
  }
}
function markOnboardedBPlusD() {
  try {
    localStorage.setItem(ONBOARDED_KEY, String(Date.now()));
  } catch (e) {
  }
}
function setOnboardingProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, profile);
  } catch (e) {
  }
}
function GlyphLuneDecroissante({ size = 88, breathing = false }) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      "aria-hidden": "true",
      className: breathing ? "onb-lune-breath" : "",
      style: { display: "block", margin: "0 auto" }
    },
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("mask", { id: "onb-lune-mask" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "0", width: "100", height: "100", fill: "white" }), /* @__PURE__ */ React.createElement("circle", { cx: "62", cy: "50", r: "34", fill: "black" }))),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "32",
        fill: "none",
        stroke: "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))",
        strokeWidth: "1.1",
        opacity: "0.78"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "32",
        fill: "color-mix(in oklch, var(--silk-gold) 28%, var(--night-warm))",
        mask: "url(#onb-lune-mask)",
        opacity: "0.88"
      }
    )
  );
}
function GlyphTrinite({ size = 80 }) {
  return /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      "aria-hidden": "true",
      style: { display: "block", margin: "0 auto" }
    },
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "36",
        fill: "none",
        stroke: "color-mix(in oklch, var(--silk-gold) 35%, var(--ash-light))",
        strokeWidth: "0.9",
        opacity: "0.6"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "24",
        fill: "none",
        stroke: "color-mix(in oklch, var(--silk-gold) 50%, var(--bone))",
        strokeWidth: "1",
        opacity: "0.78"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "12",
        fill: "none",
        stroke: "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))",
        strokeWidth: "1.1",
        opacity: "0.92"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "2.4",
        fill: "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))",
        opacity: "0.95"
      }
    )
  );
}
const OnboardingRituel = ({ go }) => {
  const [step, setStep] = uOR_S(0);
  const [animating, setAnimating] = uOR_S(false);
  const [text, setText] = uOR_S("");
  const [submitting, setSubmitting] = uOR_S(false);
  const [submitError, setSubmitError] = uOR_S(null);
  const [selectedProfile, setSelectedProfile] = uOR_S(null);
  const [wowSpirale, setWowSpirale] = uOR_S(false);
  const taRef = uOR_R(null);
  const OnbBackdrop = () => /* @__PURE__ */ React.createElement(React.Fragment, null, window.Surface && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.45,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(
    window.Surface,
    {
      matter: "silk",
      motion: true,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    }
  )), window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.5,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })));
  uOR_E(() => {
    if (step === 2 && taRef.current) {
      setTimeout(() => {
        try {
          taRef.current && taRef.current.focus();
        } catch (e) {
        }
      }, 420);
    }
  }, [step]);
  const goStep = (n) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(n);
      setAnimating(false);
    }, 380);
  };
  const pickProfile = (profile) => {
    setSelectedProfile(profile);
    setOnboardingProfile(profile);
    setTimeout(() => {
      goStep(2);
      setTimeout(() => setWowSpirale(true), 380);
    }, 280);
  };
  const skip = () => {
    markOnboardedBPlusD();
    if (typeof go === "function") go("home");
    else {
      try {
        window.location.hash = "home";
      } catch (e) {
      }
      window.location.reload && window.location.reload();
    }
  };
  const finish = async () => {
    var _a, _b;
    if (text.trim().length >= 3 && window.DreamAPI && window.DreamAPI.createKairos) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        await window.DreamAPI.createKairos({
          raw_text: text.trim(),
          kairos_type: "reve",
          capture_method: "text"
        });
        try {
          (_b = (_a = window.wowRegistry) == null ? void 0 : _a.fire) == null ? void 0 : _b.call(_a, "premier-kairos");
        } catch (e) {
        }
      } catch (e) {
        setSubmitError("Le d\xE9p\xF4t a but\xE9 : " + ((e == null ? void 0 : e.message) || "?") + " \u2014 on continue, tu pourras r\xE9essayer.");
      } finally {
        setSubmitting(false);
      }
    }
    markOnboardedBPlusD();
    if (window.DreamRefreshEntries) setTimeout(() => window.DreamRefreshEntries(), 250);
    if (typeof go === "function") go("home");
    else {
      try {
        window.location.hash = "home";
      } catch (e) {
      }
    }
  };
  const SkipButton = () => /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: skip,
      "aria-label": "passer l'onboarding",
      style: {
        position: "absolute",
        top: 18,
        right: 22,
        zIndex: 5,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.65,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        letterSpacing: "0.02em",
        padding: "8px 12px",
        transition: "opacity 380ms ease"
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
      onMouseLeave: (e) => e.currentTarget.style.opacity = "0.65"
    },
    "passer \u2192"
  );
  if (step === 0) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "var(--night-floor)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--s-5)",
      opacity: animating ? 0 : 1,
      transition: "opacity 380ms cubic-bezier(0.45,0,0.15,1)",
      overflow: "hidden"
    } }, /* @__PURE__ */ React.createElement(SkipButton, null), /* @__PURE__ */ React.createElement(OnbBackdrop, null), /* @__PURE__ */ React.createElement("div", { className: "onb-halo-bg", "aria-hidden": "true" }), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 540, textAlign: "center", position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement(GlyphLuneDecroissante, { size: 96, breathing: true }), /* @__PURE__ */ React.createElement("p", { style: {
      marginTop: "var(--s-6)",
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 32,
      lineHeight: 1.42,
      color: "var(--bone)",
      textWrap: "pretty",
      letterSpacing: "0.005em",
      textShadow: "0 1px 14px color-mix(in oklch, var(--night-floor) 50%, transparent)"
    } }, "Dream \u2014 pour tes r\xEAves,", /* @__PURE__ */ React.createElement("br", null), "et ce qu'ils \xE9clairent."), /* @__PURE__ */ React.createElement("div", { className: "onb-trio", role: "list", "aria-label": "ce que Dream te permet" }, /* @__PURE__ */ React.createElement("div", { className: "onb-trio-item onb-trio-1", role: "listitem" }, /* @__PURE__ */ React.createElement("span", { className: "onb-trio-title" }, "capture"), /* @__PURE__ */ React.createElement("span", { className: "onb-trio-paren" }, "(en 30s)")), /* @__PURE__ */ React.createElement("span", { className: "onb-trio-sep", "aria-hidden": "true" }, "/"), /* @__PURE__ */ React.createElement("div", { className: "onb-trio-item onb-trio-2", role: "listitem" }, /* @__PURE__ */ React.createElement("span", { className: "onb-trio-title" }, "patterns"), /* @__PURE__ */ React.createElement("span", { className: "onb-trio-paren" }, "(r\xE9v\xE9l\xE9s)")), /* @__PURE__ */ React.createElement("span", { className: "onb-trio-sep onb-trio-sep-2", "aria-hidden": "true" }, "/"), /* @__PURE__ */ React.createElement("div", { className: "onb-trio-item onb-trio-3", role: "listitem" }, /* @__PURE__ */ React.createElement("span", { className: "onb-trio-title" }, "sagesse cumulative"), /* @__PURE__ */ React.createElement("span", { className: "onb-trio-paren" }, "(au fil du temps)"))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goStep(1),
        className: "onb-btn-commencer",
        style: {
          marginTop: "var(--s-7)",
          background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
          border: "1px solid var(--silk-gold)",
          color: "var(--bone)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 17,
          padding: "13px 32px",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 380ms cubic-bezier(0.45,0,0.15,1)",
          boxShadow: "0 0 22px color-mix(in oklch, var(--silk-gold) 16%, transparent)"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, transparent)";
          e.currentTarget.style.boxShadow = "0 0 30px color-mix(in oklch, var(--silk-gold) 26%, transparent)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, transparent)";
          e.currentTarget.style.boxShadow = "0 0 22px color-mix(in oklch, var(--silk-gold) 16%, transparent)";
        }
      },
      "commencer"
    )), /* @__PURE__ */ React.createElement("style", null, `
          .onb-halo-bg {
            position: absolute;
            top: 50%; left: 50%;
            width: 520px; height: 520px;
            transform: translate(-50%, -64%);
            background: radial-gradient(circle, color-mix(in oklch, var(--silk-gold) 8%, transparent) 0%, transparent 65%);
            pointer-events: none;
            z-index: 0;
            animation: onb-halo-breath 9s ease-in-out infinite;
          }
          @keyframes onb-halo-breath {
            0%, 100% { opacity: 0.55; transform: translate(-50%, -64%) scale(1); }
            50%      { opacity: 0.85; transform: translate(-50%, -64%) scale(1.06); }
          }
          .onb-lune-breath {
            animation: onb-lune-breath-anim 6s ease-in-out infinite;
          }
          @keyframes onb-lune-breath-anim {
            0%, 100% { opacity: 0.92; transform: scale(1); }
            50%      { opacity: 1;    transform: scale(1.025); }
          }

          /* TRIO promesses \u2014 fade-in s\xE9quenc\xE9 300/600/900ms */
          .onb-trio {
            margin-top: var(--s-5);
            display: flex; flex-wrap: wrap;
            align-items: baseline; justify-content: center;
            gap: 14px;
            padding: 0 8px;
          }
          .onb-trio-item {
            display: inline-flex; flex-direction: column;
            align-items: center; gap: 2px;
            opacity: 0;
            animation-name: onb-trio-fade-up;
            animation-duration: 720ms;
            animation-timing-function: cubic-bezier(0.45,0,0.15,1);
            animation-fill-mode: forwards;
          }
          .onb-trio-1 { animation-delay: 300ms; }
          .onb-trio-2 { animation-delay: 600ms; }
          .onb-trio-3 { animation-delay: 900ms; }
          .onb-trio-title {
            font-family: var(--serif); font-style: italic; font-size: 14px;
            color: var(--ash-light);
            letter-spacing: 0.02em;
            opacity: 0.92;
          }
          .onb-trio-paren {
            font-family: var(--serif); font-style: italic; font-size: 12px;
            color: var(--ash-light);
            opacity: 0.55;
            letter-spacing: 0.01em;
          }
          .onb-trio-sep {
            font-family: var(--serif); font-style: italic; font-size: 14px;
            color: var(--ash-light);
            opacity: 0;
            animation: onb-trio-sep-fade 720ms cubic-bezier(0.45,0,0.15,1) forwards;
            animation-delay: 450ms;
          }
          .onb-trio-sep-2 { animation-delay: 750ms; }
          @keyframes onb-trio-fade-up {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes onb-trio-sep-fade {
            from { opacity: 0; }
            to   { opacity: 0.4; }
          }
          @media (max-width: 480px) {
            .onb-trio {
              flex-direction: column;
              gap: 10px;
            }
            .onb-trio-sep { display: none; }
          }
        `));
  }
  if (step === 1) {
    const profiles = [
      {
        id: "r\xEAveur",
        glyph: "\u{1F319}",
        text: "Je r\xEAve souvent et je veux les comprendre"
      },
      {
        id: "reconnexion",
        glyph: "\u2728",
        text: "Je me souviens \xE0 peine de mes r\xEAves, je voudrais m'y reconnecter"
      },
      {
        id: "chercheur",
        glyph: "\u2609",
        text: "Je cherche du sens dans ma vie et j'entends parler de Dream"
      }
    ];
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 200,
      background: "var(--night-floor)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--s-5)",
      opacity: animating ? 0 : 1,
      transition: "opacity 380ms cubic-bezier(0.45,0,0.15,1)",
      overflowY: "auto"
    } }, /* @__PURE__ */ React.createElement(SkipButton, null), /* @__PURE__ */ React.createElement(OnbBackdrop, null), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 480, width: "100%", textAlign: "center", padding: "var(--s-5) 0", position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "var(--s-5)" } }, /* @__PURE__ */ React.createElement(GlyphTrinite, { size: 72 })), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 26,
      lineHeight: 1.42,
      color: "var(--bone)",
      marginBottom: "var(--s-6)",
      textWrap: "pretty",
      letterSpacing: "0.005em"
    } }, "D'o\xF9 viens-tu\xA0?"), /* @__PURE__ */ React.createElement("div", { className: "onb-qual-cards", role: "radiogroup", "aria-label": "d'o\xF9 viens-tu" }, profiles.map((p, i) => {
      const selected = selectedProfile === p.id;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: p.id,
          role: "radio",
          "aria-checked": selected,
          onClick: () => pickProfile(p.id),
          className: "onb-qual-card onb-qual-card-" + i + (selected ? " is-selected" : ""),
          disabled: !!selectedProfile,
          style: {
            cursor: selectedProfile ? "default" : "pointer"
          }
        },
        /* @__PURE__ */ React.createElement("span", { className: "onb-qual-glyph", "aria-hidden": "true" }, p.glyph),
        /* @__PURE__ */ React.createElement("span", { className: "onb-qual-text" }, p.text)
      );
    })), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goStep(2),
        className: "onb-qual-skip",
        style: {
          marginTop: "var(--s-5)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ash-light)",
          opacity: 0.55,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 13,
          letterSpacing: "0.02em",
          padding: "8px 12px",
          transition: "opacity 380ms ease"
        },
        onMouseEnter: (e) => e.currentTarget.style.opacity = "0.85",
        onMouseLeave: (e) => e.currentTarget.style.opacity = "0.55"
      },
      "passer cette question \u2192"
    )), /* @__PURE__ */ React.createElement("style", null, `
          .onb-qual-cards {
            display: flex; flex-direction: column; gap: 12px;
            width: 100%;
          }
          .onb-qual-card {
            display: flex; align-items: center;
            gap: 14px;
            text-align: left;
            background: color-mix(in oklch, var(--night-warm) 50%, transparent);
            border: 1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep));
            padding: 16px 18px;
            color: var(--bone);
            font-family: var(--serif); font-style: italic; font-size: 15px;
            line-height: 1.45;
            letter-spacing: 0.005em;
            transition: all 380ms cubic-bezier(0.45,0,0.15,1);
            opacity: 0;
            animation: onb-qual-card-in 720ms cubic-bezier(0.45,0,0.15,1) forwards;
          }
          .onb-qual-card-0 { animation-delay: 200ms; }
          .onb-qual-card-1 { animation-delay: 400ms; }
          .onb-qual-card-2 { animation-delay: 600ms; }
          .onb-qual-card:hover:not(:disabled) {
            background: color-mix(in oklch, var(--night-warm) 70%, transparent);
            border-color: color-mix(in oklch, var(--silk-gold) 32%, var(--ash-deep));
            transform: translateY(-1px);
          }
          .onb-qual-card.is-selected {
            background: color-mix(in oklch, var(--silk-gold) 12%, var(--night-warm));
            border-color: var(--silk-gold);
            box-shadow: 0 0 24px color-mix(in oklch, var(--silk-gold) 18%, transparent);
          }
          .onb-qual-glyph {
            font-size: 22px;
            line-height: 1;
            min-width: 28px;
            text-align: center;
            font-style: normal;
            opacity: 0.92;
          }
          .onb-qual-text {
            flex: 1;
            font-style: italic;
          }
          @keyframes onb-qual-card-in {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `));
  }
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    background: "var(--night-warm)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "calc(var(--s-7) + env(safe-area-inset-top, 0)) var(--s-5) var(--s-6)",
    opacity: animating ? 0 : 1,
    transition: "opacity 380ms cubic-bezier(0.45,0,0.15,1)",
    overflowY: "auto"
  } }, /* @__PURE__ */ React.createElement(SkipButton, null), /* @__PURE__ */ React.createElement(OnbBackdrop, null), window.SpiraleWowOverlay && /* @__PURE__ */ React.createElement(
    window.SpiraleWowOverlay,
    {
      show: wowSpirale,
      onDone: () => setWowSpirale(false)
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 540, width: "100%", marginTop: "var(--s-5)", position: "relative", zIndex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: "var(--s-5)" } }, /* @__PURE__ */ React.createElement(GlyphLuneDecroissante, { size: 64, breathing: true })), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 26,
    lineHeight: 1.42,
    color: "var(--bone)",
    textWrap: "pretty",
    marginBottom: "var(--s-3)",
    textAlign: "center",
    letterSpacing: "0.005em"
  } }, "Ton premier d\xE9p\xF4t."), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    lineHeight: 1.6,
    color: "var(--ash-light)",
    opacity: 0.82,
    textAlign: "center",
    marginBottom: "var(--s-5)",
    textWrap: "pretty",
    letterSpacing: "0.005em",
    maxWidth: 460,
    marginLeft: "auto",
    marginRight: "auto"
  } }, "peu importe \u2014 un fragment, une image, une sensation, ou une ligne sur ce que tu vis aujourd'hui.", /* @__PURE__ */ React.createElement("br", null), "l'app garde tout, sans jugement, sans effort, en privacy radicale."), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      ref: taRef,
      rows: 6,
      value: text,
      onChange: (e) => setText(e.target.value),
      placeholder: "raconte \u2014 un fragment, une image, une sensation\u2026",
      disabled: submitting,
      style: {
        width: "100%",
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
        padding: "var(--s-4)",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 17,
        lineHeight: 1.6,
        resize: "vertical",
        outline: "none",
        minHeight: 130,
        transition: "border-color 380ms cubic-bezier(0.45,0,0.15,1), box-shadow 380ms ease"
      },
      onFocus: (e) => {
        e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))";
        e.currentTarget.style.boxShadow = "0 0 16px color-mix(in oklch, var(--silk-gold) 12%, transparent)";
      },
      onBlur: (e) => {
        e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))";
        e.currentTarget.style.boxShadow = "none";
      }
    }
  ), submitError && /* @__PURE__ */ React.createElement("div", { className: "meta mt-s", style: {
    color: "var(--ember-live, #C97A4A)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: "var(--s-3)"
  } }, submitError), /* @__PURE__ */ React.createElement("div", { className: "row", style: {
    marginTop: "var(--s-5)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 14
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: finish,
      disabled: submitting,
      style: {
        background: text.trim().length >= 3 ? "color-mix(in oklch, var(--silk-gold) 18%, transparent)" : "transparent",
        border: "1px solid " + (text.trim().length >= 3 ? "var(--silk-gold)" : "color-mix(in oklch, var(--silk-gold) 50%, var(--bone))"),
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 16,
        padding: "13px 28px",
        cursor: submitting ? "default" : "pointer",
        opacity: submitting ? 0.5 : 1,
        letterSpacing: "0.02em",
        transition: "all 380ms cubic-bezier(0.45,0,0.15,1)",
        boxShadow: text.trim().length >= 3 ? "0 0 22px color-mix(in oklch, var(--silk-gold) 18%, transparent)" : "none"
      }
    },
    submitting ? "d\xE9p\xF4t en cours\u2026" : text.trim().length >= 3 ? "d\xE9poser mon premier r\xEAve" : "d\xE9poser mon premier r\xEAve"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: finish,
      disabled: submitting,
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.6,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "6px 0",
        letterSpacing: "0.02em",
        transition: "opacity 380ms ease"
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.9",
      onMouseLeave: (e) => e.currentTarget.style.opacity = "0.6"
    },
    "ou commencer sans d\xE9poser \u2192"
  )), /* @__PURE__ */ React.createElement("p", { className: "meta op-50 mt-l", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12,
    color: "var(--ash-light)",
    textAlign: "center",
    marginTop: "var(--s-6)",
    textWrap: "pretty",
    opacity: 0.55,
    letterSpacing: "0.01em"
  } }, "le glyphe lune en haut r\xE9v\xE8le toutes les portes cach\xE9es."), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: "var(--s-4)" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => goStep(1),
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.45,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        padding: "6px 0",
        transition: "opacity 380ms ease"
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = "0.75",
      onMouseLeave: (e) => e.currentTarget.style.opacity = "0.45"
    },
    "\u2190 retour"
  ))));
};
Object.assign(window, {
  OnboardingRituel,
  isOnboardedBPlusD,
  markOnboardedBPlusD
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1vbmJvYXJkaW5nLXJpdHVlbC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCAqL1xuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBPbmJvYXJkaW5nUml0dWVsIFx1MjAxNCAzIFx1MDBFOWNyYW5zIHJpdHVlbHNcbi8vIFJFRk9OVEUgMjAyNi0wNC0yNyAoU3ByaW50IFAwLjEpIFx1MjAxNCBPbmJvYXJkaW5nIHF1YWxpZmlcdTAwRTkgZ3JhbmQgcHVibGljXG4vLyBTcGVjIDogMV9CSUJMRSBcdTAwQTcxLjYgKyAyX0RFU0lHTiBcdTAwQTcxMS5iaXMuMTZcbi8vXG4vLyBQYXR0ZXJuIDogcGFzIGRlIHR1dG9yaWVsIHBcdTAwRTlkYW50LiAzIHNldWlscyA6XG4vLyAgIDEuIFBocmFzZSBwb1x1MDBFOXRpcXVlICsgZ2x5cGhlIGx1bmUgZFx1MDBFOWNyb2lzc2FudGUgKyBUUklPIGRlIDMgcHJvbWVzc2VzXG4vLyAgICAgIGNvbmNyXHUwMEU4dGVzIChjYXB0dXJlIC8gcGF0dGVybnMgLyBzYWdlc3NlIGN1bXVsYXRpdmUpICsgYm91dG9uIGNvbW1lbmNlci5cbi8vICAgMi4gUXVhbGlmaWNhdGlvbiBkJ3VzYWdlIChwYXMgZFx1MDBFOW1vKSA6IDMgY2FyZHMgXCJkJ29cdTAwRjkgdmllbnMtdHUgP1wiXG4vLyAgICAgIChyXHUwMEVBdmV1ciAvIHJlY29ubmV4aW9uIC8gY2hlcmNoZXVyKS4gUlx1MDBFOXBvbnNlIHN0b2NrXHUwMEU5ZSBkYW5zXG4vLyAgICAgIGxvY2FsU3RvcmFnZVtcImRyZWFtOm9uYm9hcmRpbmctcHJvZmlsZVwiXS4gTGllbiBcInBhc3NlciBjZXR0ZSBxdWVzdGlvbiBcdTIxOTJcIi5cbi8vICAgMy4gQ2hhbXAgXCJ0b24gcHJlbWllciBkXHUwMEU5cFx1MDBGNHRcIiBwclx1MDBFOS1mb2N1cyArIHRleHRlIHJhc3N1cmFudCArXG4vLyAgICAgIERyZWFtQVBJLmNyZWF0ZUthaXJvcyBrYWlyb3NfdHlwZT0ncmV2ZScgXHUyMTkyIGhvbWUgKyBXb3cxLlxuLy9cbi8vIFNraXAgdG91am91cnMgcG9zc2libGUgKGJvdXRvbiBjb2luIGhhdXQtZHJvaXQpLlxuLy8gTWFycXVlIGxvY2FsU3RvcmFnZVtcImRyZWFtOm9uYm9hcmRlZDpiLXBsdXMtZFwiXSBcdTAwRTAgbGEgZmluLlxuLy8gVHJhbnNpdGlvbnMgVmFuIEdlbm5lcCAoMzgwbXMgY3ViaWMtYmV6aWVyIGVhc2UtdGVudWUpIGVudHJlIFx1MDBFOWNyYW5zLlxuLy9cbi8vIEdhcmRlLWZvdSA6IGF1Y3VuIG1lbnRpb24gXCJrYWlyb3MgLyBhbmltYSAvIGRcdTAwRTlzZW5zb3JjZWxcdTAwRTkgLyBqb3VybmFsIGRlIHZpZVwiXG4vLyBkYW5zIGNlcyAzIFx1MDBFOWNyYW5zLiBMYSBwcm9mb25kZXVyIHNlIHJcdTAwRTl2XHUwMEU4bGUgZW5zdWl0ZSAoRGlzY292ZXJ5UmV2ZWFsKS5cbi8vXG4vLyBcdTAwQzl2b2x1dGlvbiByZWZvbnRlIFAwLjEgOlxuLy8gLSBUcmlvIHByb21lc3NlcyBzdWItdGl0bGVzIDogY2FwdHVyZSAoZW4gMzBzKSAvIHBhdHRlcm5zIChyXHUwMEU5dlx1MDBFOWxcdTAwRTlzKSAvXG4vLyAgIHNhZ2Vzc2UgY3VtdWxhdGl2ZSAoYXUgZmlsIGR1IHRlbXBzKS4gRmFkZS1pbiBzXHUwMEU5cXVlbmNcdTAwRTkgMzAwLzYwMC85MDBtcy5cbi8vIC0gXHUwMEM5Y3JhbiAyIGVudGlcdTAwRThyZW1lbnQgcmVwZW5zXHUwMEU5IDogcXVhbGlmaWNhdGlvbiA+IHR1dG9yaWVsLlxuLy8gLSBcdTAwQzljcmFuIDMgOiBjb3B5IGVucmljaGkgcHJvdGVjdGlvbiArIHByaXZhY3kgcmFkaWNhbGUgKyBmYWxsYmFjayBza2lwLlxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IHsgdXNlU3RhdGU6IHVPUl9TLCB1c2VFZmZlY3Q6IHVPUl9FLCB1c2VSZWY6IHVPUl9SIH0gPSBSZWFjdDtcblxuY29uc3QgT05CT0FSREVEX0tFWSA9IFwiZHJlYW06b25ib2FyZGVkOmItcGx1cy1kXCI7XG5jb25zdCBQUk9GSUxFX0tFWSA9IFwiZHJlYW06b25ib2FyZGluZy1wcm9maWxlXCI7XG5cbi8vIEhlbHBlciA6IGEtdC1vbiBkXHUwMEU5alx1MDBFMCBmYWl0IGwnb25ib2FyZGluZyBCK0QgP1xuZnVuY3Rpb24gaXNPbmJvYXJkZWRCUGx1c0QoKSB7XG4gIHRyeSB7IHJldHVybiAhIWxvY2FsU3RvcmFnZS5nZXRJdGVtKE9OQk9BUkRFRF9LRVkpOyB9XG4gIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG59XG5cbi8vIEhlbHBlciA6IG1hcnF1ZXIgbCdvbmJvYXJkaW5nIGNvbW1lIGZhaXQgKFx1MDBFMCBsYSBmaW4gT1UgYXUgc2tpcClcbmZ1bmN0aW9uIG1hcmtPbmJvYXJkZWRCUGx1c0QoKSB7XG4gIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKE9OQk9BUkRFRF9LRVksIFN0cmluZyhEYXRlLm5vdygpKSk7IH0gY2F0Y2gge31cbn1cblxuLy8gSGVscGVyIDogc3RvY2tlciBsZSBwcm9maWwgZCd1c2FnZSAoc2VydmlyYSBwbHVzIHRhcmQgcG91ciBwZXJzb25uYWxpc2VyKVxuZnVuY3Rpb24gc2V0T25ib2FyZGluZ1Byb2ZpbGUocHJvZmlsZSkge1xuICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShQUk9GSUxFX0tFWSwgcHJvZmlsZSk7IH0gY2F0Y2gge31cbn1cblxuLy8gXHUyNTAwXHUyNTAwIEdseXBoZSBsdW5lIGRcdTAwRTljcm9pc3NhbnRlIChTVkcpIFx1MjAxNCBwb3J0ZSBSXHUwMENBVkUgXHUyNTAwXHUyNTAwXG5mdW5jdGlvbiBHbHlwaEx1bmVEZWNyb2lzc2FudGUoeyBzaXplID0gODgsIGJyZWF0aGluZyA9IGZhbHNlIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXG4gICAgICBjbGFzc05hbWU9e2JyZWF0aGluZyA/IFwib25iLWx1bmUtYnJlYXRoXCIgOiBcIlwifVxuICAgICAgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiLCBtYXJnaW46IFwiMCBhdXRvXCIgfX0+XG4gICAgICA8ZGVmcz5cbiAgICAgICAgPG1hc2sgaWQ9XCJvbmItbHVuZS1tYXNrXCI+XG4gICAgICAgICAgPHJlY3QgeD1cIjBcIiB5PVwiMFwiIHdpZHRoPVwiMTAwXCIgaGVpZ2h0PVwiMTAwXCIgZmlsbD1cIndoaXRlXCIgLz5cbiAgICAgICAgICA8Y2lyY2xlIGN4PVwiNjJcIiBjeT1cIjUwXCIgcj1cIjM0XCIgZmlsbD1cImJsYWNrXCIgLz5cbiAgICAgICAgPC9tYXNrPlxuICAgICAgPC9kZWZzPlxuICAgICAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIzMlwiIGZpbGw9XCJub25lXCJcbiAgICAgICAgc3Ryb2tlPVwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYwJSwgdmFyKC0tYm9uZSkpXCJcbiAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjFcIiBvcGFjaXR5PVwiMC43OFwiIC8+XG4gICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjMyXCJcbiAgICAgICAgZmlsbD1cImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyOCUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiXG4gICAgICAgIG1hc2s9XCJ1cmwoI29uYi1sdW5lLW1hc2spXCJcbiAgICAgICAgb3BhY2l0eT1cIjAuODhcIiAvPlxuICAgIDwvc3ZnPlxuICApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR2x5cGhlIHRyaW5pdFx1MDBFOSAoMyBjZXJjbGVzIGNvbmNlbnRyaXF1ZXMpIFx1MjAxNCBcdTAwRTljcmFuIDIgcXVhbGlmaWNhdGlvbiBcdTI1MDBcdTI1MDBcbmZ1bmN0aW9uIEdseXBoVHJpbml0ZSh7IHNpemUgPSA4MCB9KSB7XG4gIHJldHVybiAoXG4gICAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiLCBtYXJnaW46IFwiMCBhdXRvXCIgfX0+XG4gICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjM2XCIgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHJva2U9XCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzUlLCB2YXIoLS1hc2gtbGlnaHQpKVwiXG4gICAgICAgIHN0cm9rZVdpZHRoPVwiMC45XCIgb3BhY2l0eT1cIjAuNlwiIC8+XG4gICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjI0XCIgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHJva2U9XCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNTAlLCB2YXIoLS1ib25lKSlcIlxuICAgICAgICBzdHJva2VXaWR0aD1cIjFcIiBvcGFjaXR5PVwiMC43OFwiIC8+XG4gICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjEyXCIgZmlsbD1cIm5vbmVcIlxuICAgICAgICBzdHJva2U9XCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNzAlLCB2YXIoLS1ib25lKSlcIlxuICAgICAgICBzdHJva2VXaWR0aD1cIjEuMVwiIG9wYWNpdHk9XCIwLjkyXCIgLz5cbiAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMi40XCJcbiAgICAgICAgZmlsbD1cImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA4MCUsIHZhcigtLWJvbmUpKVwiXG4gICAgICAgIG9wYWNpdHk9XCIwLjk1XCIgLz5cbiAgICA8L3N2Zz5cbiAgKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIENvbXBvc2FudCBwcmluY2lwYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBPbmJvYXJkaW5nUml0dWVsID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbc3RlcCwgc2V0U3RlcF0gPSB1T1JfUygwKTsgLy8gMCB8IDEgfCAyXG4gIGNvbnN0IFthbmltYXRpbmcsIHNldEFuaW1hdGluZ10gPSB1T1JfUyhmYWxzZSk7IC8vIHRyYW5zaXRpb24gVmFuIEdlbm5lcFxuICBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSB1T1JfUyhcIlwiKTtcbiAgY29uc3QgW3N1Ym1pdHRpbmcsIHNldFN1Ym1pdHRpbmddID0gdU9SX1MoZmFsc2UpO1xuICBjb25zdCBbc3VibWl0RXJyb3IsIHNldFN1Ym1pdEVycm9yXSA9IHVPUl9TKG51bGwpO1xuICBjb25zdCBbc2VsZWN0ZWRQcm9maWxlLCBzZXRTZWxlY3RlZFByb2ZpbGVdID0gdU9SX1MobnVsbCk7XG4gIC8vIDIwMjYtMDQtMjkgKFllc2h1YSwgRklYIFAwIGFuaW0pIFx1MjAxNCBTcGlyYWxlIHdvdyBkXHUwMEU5Y2xlbmNoXHUwMEU5ZSBhdSBwYXNzYWdlIHN0ZXAgMlxuICAvLyAocHJlbWllciBtZXNzYWdlIFx1MDBFMCBBbmltYSkuIEF1dG8tZGlzcGFyYVx1MDBFRXQgYXByXHUwMEU4cyAxLjlzIHZpYSBTcGlyYWxlV293T3ZlcmxheS5cbiAgY29uc3QgW3dvd1NwaXJhbGUsIHNldFdvd1NwaXJhbGVdID0gdU9SX1MoZmFsc2UpO1xuICBjb25zdCB0YVJlZiA9IHVPUl9SKG51bGwpO1xuXG4gIC8vIDIwMjYtMDQtMjkgKFllc2h1YSwgRklYIFAwIGFuaW0pIFx1MjAxNCBCYWNrZHJvcCBhbmltXHUwMEU5IGNvbW11biBhdXggMyBcdTAwRTljcmFucyA6XG4gIC8vIFN1cmZhY2Ugc2lsayArIEhhbG9SZXNwaXJlIHNpbGsgZGlzY3JldC4gUG9zXHUwMEU5IGVuIGFic29sdXRlIHotaW5kZXggMCxcbiAgLy8gZGVycmlcdTAwRThyZSBTa2lwQnV0dG9uIGV0IGNvbnRlbnUuIExhIFN1cmZhY2UgZG9ubmUgZ3JhaW4vcmVzcGlyYXRpb24gYXUgZm9uZC5cbiAgY29uc3QgT25iQmFja2Ryb3AgPSAoKSA9PiAoXG4gICAgPFJlYWN0LkZyYWdtZW50PlxuICAgICAge3dpbmRvdy5TdXJmYWNlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBvcGFjaXR5OiAwLjQ1LFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuU3VyZmFjZSBtYXR0ZXI9XCJzaWxrXCIgbW90aW9uPXt0cnVlfVxuICAgICAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjEwMCVcIiB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7d2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBvcGFjaXR5OiAwLjUsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHdpbmRvdy5IYWxvUmVzcGlyZSBraW5kPVwic2lsa1wiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L1JlYWN0LkZyYWdtZW50PlxuICApO1xuXG4gIC8vIFByXHUwMEU5LWZvY3VzIGR1IHRleHRhcmVhIHN1ciBsJ1x1MDBFOWNyYW4gM1xuICB1T1JfRSgoKSA9PiB7XG4gICAgaWYgKHN0ZXAgPT09IDIgJiYgdGFSZWYuY3VycmVudCkge1xuICAgICAgLy8gUGV0aXQgZFx1MDBFOWxhaSBwb3VyIGxhaXNzZXIgbGEgdHJhbnNpdGlvbiBmaW5pclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRyeSB7IHRhUmVmLmN1cnJlbnQgJiYgdGFSZWYuY3VycmVudC5mb2N1cygpOyB9IGNhdGNoIHt9IH0sIDQyMCk7XG4gICAgfVxuICB9LCBbc3RlcF0pO1xuXG4gIC8vIFRyYW5zaXRpb24gMzgwbXMgZW50cmUgXHUwMEU5Y3JhbnMgKFZhbiBHZW5uZXAsIGVhc2UtdGVudWUpXG4gIGNvbnN0IGdvU3RlcCA9IChuKSA9PiB7XG4gICAgc2V0QW5pbWF0aW5nKHRydWUpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgc2V0U3RlcChuKTtcbiAgICAgIHNldEFuaW1hdGluZyhmYWxzZSk7XG4gICAgfSwgMzgwKTtcbiAgfTtcblxuICAvLyBTXHUwMEU5bGVjdGlvbiBwcm9maWwgXHUwMEU5Y3JhbiAyIFx1MjE5MiBzdG9jayArIHRyYW5zaXRpb24gdmVycyBcdTAwRTljcmFuIDNcbiAgY29uc3QgcGlja1Byb2ZpbGUgPSAocHJvZmlsZSkgPT4ge1xuICAgIHNldFNlbGVjdGVkUHJvZmlsZShwcm9maWxlKTtcbiAgICBzZXRPbmJvYXJkaW5nUHJvZmlsZShwcm9maWxlKTtcbiAgICAvLyBQZXRpdCBkXHUwMEU5bGFpIHZpc3VlbCBwb3VyIHF1ZSBsYSBjYXJkIHNcdTAwRTlsZWN0aW9ublx1MDBFOWUgc2Ugdm9pZSBhdmFudCB0cmFuc2l0aW9uXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBnb1N0ZXAoMik7XG4gICAgICAvLyAyMDI2LTA0LTI5IChZZXNodWEsIEZJWCBQMCBhbmltKSBcdTIwMTQgU3BpcmFsZSB3b3cgYXUgbW9tZW50IG9cdTAwRjkgbCdvblxuICAgICAgLy8gZW50cmUgZGFucyBsZSByaXR1ZWwgXCJwcmVtaWVyIG1lc3NhZ2UgXHUwMEUwIEFuaW1hXCIgKHN0ZXAgMikuIE1hcnF1ZXVyXG4gICAgICAvLyBzZW5zb3JpZWwgZHUgc2V1aWwuIEF1dG8tZGlzcGFyYVx1MDBFRXQgYXByXHUwMEU4cyB+MS45cy5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0V293U3BpcmFsZSh0cnVlKSwgMzgwKTtcbiAgICB9LCAyODApO1xuICB9O1xuXG4gIC8vIFNraXAgXHUyMTkyIG1hcnF1ZSBjb21tZSBmYWl0LCByZXRvdXIgaG9tZVxuICBjb25zdCBza2lwID0gKCkgPT4ge1xuICAgIG1hcmtPbmJvYXJkZWRCUGx1c0QoKTtcbiAgICBpZiAodHlwZW9mIGdvID09PSBcImZ1bmN0aW9uXCIpIGdvKFwiaG9tZVwiKTtcbiAgICBlbHNlIHsgdHJ5IHsgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcImhvbWVcIjsgfSBjYXRjaCB7fSB3aW5kb3cubG9jYXRpb24ucmVsb2FkICYmIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTsgfVxuICB9O1xuXG4gIC8vIEZpbiBkZSBsJ29uYm9hcmRpbmcgOiB0ZW50ZSBkZSBjclx1MDBFOWVyIHVuIGthaXJvcyB0eXBlPSdyZXZlJyBzaSB0ZXh0ZSByZW1wbGlcbiAgY29uc3QgZmluaXNoID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICh0ZXh0LnRyaW0oKS5sZW5ndGggPj0gMyAmJiB3aW5kb3cuRHJlYW1BUEkgJiYgd2luZG93LkRyZWFtQVBJLmNyZWF0ZUthaXJvcykge1xuICAgICAgc2V0U3VibWl0dGluZyh0cnVlKTtcbiAgICAgIHNldFN1Ym1pdEVycm9yKG51bGwpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLmNyZWF0ZUthaXJvcyh7XG4gICAgICAgICAgcmF3X3RleHQ6IHRleHQudHJpbSgpLFxuICAgICAgICAgIGthaXJvc190eXBlOiBcInJldmVcIixcbiAgICAgICAgICBjYXB0dXJlX21ldGhvZDogXCJ0ZXh0XCIsXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBXb3cxIDogcHJlbWllciBrYWlyb3MgZFx1MDBFOXBvc1x1MDBFOSAoaWRlbXBvdGVudCB2aWEgd293UmVnaXN0cnkpXG4gICAgICAgIHRyeSB7IHdpbmRvdy53b3dSZWdpc3RyeT8uZmlyZT8uKFwicHJlbWllci1rYWlyb3NcIik7IH0gY2F0Y2gge31cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2V0U3VibWl0RXJyb3IoXCJMZSBkXHUwMEU5cFx1MDBGNHQgYSBidXRcdTAwRTkgOiBcIiArIChlPy5tZXNzYWdlIHx8IFwiP1wiKSArIFwiIFx1MjAxNCBvbiBjb250aW51ZSwgdHUgcG91cnJhcyByXHUwMEU5ZXNzYXllci5cIik7XG4gICAgICAgIC8vIE9uIG1hcnF1ZSBxdWFuZCBtXHUwMEVBbWUgY29tbWUgb25ib2FyZFx1MDBFOSwgcGFzIGRlIGJsb2NhZ2VcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xuICAgICAgfVxuICAgIH1cbiAgICBtYXJrT25ib2FyZGVkQlBsdXNEKCk7XG4gICAgLy8gUmVmcmVzaCBlbnRyaWVzIHNpIHBvc3NpYmxlXG4gICAgaWYgKHdpbmRvdy5EcmVhbVJlZnJlc2hFbnRyaWVzKSBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5EcmVhbVJlZnJlc2hFbnRyaWVzKCksIDI1MCk7XG4gICAgaWYgKHR5cGVvZiBnbyA9PT0gXCJmdW5jdGlvblwiKSBnbyhcImhvbWVcIik7XG4gICAgZWxzZSB7IHRyeSB7IHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJob21lXCI7IH0gY2F0Y2gge30gfVxuICB9O1xuXG4gIC8vIEJvdXRvbiBcInBhc3NlclwiIGNvaW4gaGF1dC1kcm9pdCB0b3Vqb3VycyB2aXNpYmxlXG4gIGNvbnN0IFNraXBCdXR0b24gPSAoKSA9PiAoXG4gICAgPGJ1dHRvbiBvbkNsaWNrPXtza2lwfSBhcmlhLWxhYmVsPVwicGFzc2VyIGwnb25ib2FyZGluZ1wiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IDE4LCByaWdodDogMjIsIHpJbmRleDogNSxcbiAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNjUsXG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICBwYWRkaW5nOiBcIjhweCAxMnB4XCIsXG4gICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAzODBtcyBlYXNlXCIsXG4gICAgICB9fVxuICAgICAgb25Nb3VzZUVudGVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gXCIxXCJ9XG4gICAgICBvbk1vdXNlTGVhdmU9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBcIjAuNjVcIn0+XG4gICAgICBwYXNzZXIgXHUyMTkyXG4gICAgPC9idXR0b24+XG4gICk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFx1MDBDOUNSQU4gMSBcdTI1MDBcdTI1MDAgUGhyYXNlIHBvXHUwMEU5dGlxdWUgKyBnbHlwaGUgbHVuZSByZXNwaXJhbnQgKyBUUklPIHByb21lc3NlcyArIGJvdXRvbiBjb21tZW5jZXJcbiAgaWYgKHN0ZXAgPT09IDApIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBpbnNldDogMCwgekluZGV4OiAyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgIG9wYWNpdHk6IGFuaW1hdGluZyA/IDAgOiAxLFxuICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpXCIsXG4gICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgfX0+XG4gICAgICAgIDxTa2lwQnV0dG9uIC8+XG4gICAgICAgIDxPbmJCYWNrZHJvcCAvPlxuXG4gICAgICAgIHsvKiBIYWxvIHN1YnRpbCBkZXJyaVx1MDBFOHJlIGxhIGx1bmUgKGNvaFx1MDBFOXJlbmNlIERyZWFtSG9tZSBcdTAwQTcxMS5iaXMuMTUpICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYi1oYWxvLWJnXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IG1heFdpZHRoOiA1NDAsIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICAgIDxHbHlwaEx1bmVEZWNyb2lzc2FudGUgc2l6ZT17OTZ9IGJyZWF0aGluZz17dHJ1ZX0gLz5cblxuICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy02KVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDMyLCBsaW5lSGVpZ2h0OiAxLjQyLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgICAgICB0ZXh0U2hhZG93OiBcIjAgMXB4IDE0cHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgNTAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIERyZWFtIFx1MjAxNCBwb3VyIHRlcyByXHUwMEVBdmVzLDxiciAvPlxuICAgICAgICAgICAgZXQgY2UgcXUnaWxzIFx1MDBFOWNsYWlyZW50LlxuICAgICAgICAgIDwvcD5cblxuICAgICAgICAgIHsvKiBUUklPIGRlIDMgcHJvbWVzc2VzIGNvbmNyXHUwMEU4dGVzIFx1MjAxNCBmYWRlLWluIHNcdTAwRTlxdWVuY1x1MDBFOSAqL31cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYi10cmlvXCIgcm9sZT1cImxpc3RcIiBhcmlhLWxhYmVsPVwiY2UgcXVlIERyZWFtIHRlIHBlcm1ldFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmItdHJpby1pdGVtIG9uYi10cmlvLTFcIiByb2xlPVwibGlzdGl0ZW1cIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib25iLXRyaW8tdGl0bGVcIj5jYXB0dXJlPC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvbmItdHJpby1wYXJlblwiPihlbiAzMHMpPC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvbmItdHJpby1zZXBcIiBhcmlhLWhpZGRlbj1cInRydWVcIj4vPC9zcGFuPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvbmItdHJpby1pdGVtIG9uYi10cmlvLTJcIiByb2xlPVwibGlzdGl0ZW1cIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib25iLXRyaW8tdGl0bGVcIj5wYXR0ZXJuczwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib25iLXRyaW8tcGFyZW5cIj4oclx1MDBFOXZcdTAwRTlsXHUwMEU5cyk8L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9uYi10cmlvLXNlcCBvbmItdHJpby1zZXAtMlwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPi88L3NwYW4+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9uYi10cmlvLWl0ZW0gb25iLXRyaW8tM1wiIHJvbGU9XCJsaXN0aXRlbVwiPlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvbmItdHJpby10aXRsZVwiPnNhZ2Vzc2UgY3VtdWxhdGl2ZTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib25iLXRyaW8tcGFyZW5cIj4oYXUgZmlsIGR1IHRlbXBzKTwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnb1N0ZXAoMSl9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJvbmItYnRuLWNvbW1lbmNlclwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy03KVwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTcsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTNweCAzMnB4XCIsXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC4xNSwxKVwiLFxuICAgICAgICAgICAgICBib3hTaGFkb3c6IFwiMCAwIDIycHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE2JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IHtcbiAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHRyYW5zcGFyZW50KVwiO1xuICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm94U2hhZG93ID0gXCIwIDAgMzBweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjYlLCB0cmFuc3BhcmVudClcIjtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4ge1xuICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3hTaGFkb3cgPSBcIjAgMCAyMnB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNiUsIHRyYW5zcGFyZW50KVwiO1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICBjb21tZW5jZXJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHN0eWxlPntgXG4gICAgICAgICAgLm9uYi1oYWxvLWJnIHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgICAgIHRvcDogNTAlOyBsZWZ0OiA1MCU7XG4gICAgICAgICAgICB3aWR0aDogNTIwcHg7IGhlaWdodDogNTIwcHg7XG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNjQlKTtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IHJhZGlhbC1ncmFkaWVudChjaXJjbGUsIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA4JSwgdHJhbnNwYXJlbnQpIDAlLCB0cmFuc3BhcmVudCA2NSUpO1xuICAgICAgICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgICAgICAgICB6LWluZGV4OiAwO1xuICAgICAgICAgICAgYW5pbWF0aW9uOiBvbmItaGFsby1icmVhdGggOXMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIEBrZXlmcmFtZXMgb25iLWhhbG8tYnJlYXRoIHtcbiAgICAgICAgICAgIDAlLCAxMDAlIHsgb3BhY2l0eTogMC41NTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTY0JSkgc2NhbGUoMSk7IH1cbiAgICAgICAgICAgIDUwJSAgICAgIHsgb3BhY2l0eTogMC44NTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTY0JSkgc2NhbGUoMS4wNik7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLm9uYi1sdW5lLWJyZWF0aCB7XG4gICAgICAgICAgICBhbmltYXRpb246IG9uYi1sdW5lLWJyZWF0aC1hbmltIDZzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBAa2V5ZnJhbWVzIG9uYi1sdW5lLWJyZWF0aC1hbmltIHtcbiAgICAgICAgICAgIDAlLCAxMDAlIHsgb3BhY2l0eTogMC45MjsgdHJhbnNmb3JtOiBzY2FsZSgxKTsgfVxuICAgICAgICAgICAgNTAlICAgICAgeyBvcGFjaXR5OiAxOyAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMDI1KTsgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8qIFRSSU8gcHJvbWVzc2VzIFx1MjAxNCBmYWRlLWluIHNcdTAwRTlxdWVuY1x1MDBFOSAzMDAvNjAwLzkwMG1zICovXG4gICAgICAgICAgLm9uYi10cmlvIHtcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IHZhcigtLXMtNSk7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4OyBmbGV4LXdyYXA6IHdyYXA7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogYmFzZWxpbmU7IGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiAxNHB4O1xuICAgICAgICAgICAgcGFkZGluZzogMCA4cHg7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItdHJpby1pdGVtIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGlubGluZS1mbGV4OyBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjsgZ2FwOiAycHg7XG4gICAgICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICAgICAgYW5pbWF0aW9uLW5hbWU6IG9uYi10cmlvLWZhZGUtdXA7XG4gICAgICAgICAgICBhbmltYXRpb24tZHVyYXRpb246IDcyMG1zO1xuICAgICAgICAgICAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpO1xuICAgICAgICAgICAgYW5pbWF0aW9uLWZpbGwtbW9kZTogZm9yd2FyZHM7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItdHJpby0xIHsgYW5pbWF0aW9uLWRlbGF5OiAzMDBtczsgfVxuICAgICAgICAgIC5vbmItdHJpby0yIHsgYW5pbWF0aW9uLWRlbGF5OiA2MDBtczsgfVxuICAgICAgICAgIC5vbmItdHJpby0zIHsgYW5pbWF0aW9uLWRlbGF5OiA5MDBtczsgfVxuICAgICAgICAgIC5vbmItdHJpby10aXRsZSB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyKC0tc2VyaWYpOyBmb250LXN0eWxlOiBpdGFsaWM7IGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1hc2gtbGlnaHQpO1xuICAgICAgICAgICAgbGV0dGVyLXNwYWNpbmc6IDAuMDJlbTtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuOTI7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItdHJpby1wYXJlbiB7XG4gICAgICAgICAgICBmb250LWZhbWlseTogdmFyKC0tc2VyaWYpOyBmb250LXN0eWxlOiBpdGFsaWM7IGZvbnQtc2l6ZTogMTJweDtcbiAgICAgICAgICAgIGNvbG9yOiB2YXIoLS1hc2gtbGlnaHQpO1xuICAgICAgICAgICAgb3BhY2l0eTogMC41NTtcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjAxZW07XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItdHJpby1zZXAge1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLXNlcmlmKTsgZm9udC1zdHlsZTogaXRhbGljOyBmb250LXNpemU6IDE0cHg7XG4gICAgICAgICAgICBjb2xvcjogdmFyKC0tYXNoLWxpZ2h0KTtcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgICAgICBhbmltYXRpb246IG9uYi10cmlvLXNlcC1mYWRlIDcyMG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC4xNSwxKSBmb3J3YXJkcztcbiAgICAgICAgICAgIGFuaW1hdGlvbi1kZWxheTogNDUwbXM7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItdHJpby1zZXAtMiB7IGFuaW1hdGlvbi1kZWxheTogNzUwbXM7IH1cbiAgICAgICAgICBAa2V5ZnJhbWVzIG9uYi10cmlvLWZhZGUtdXAge1xuICAgICAgICAgICAgZnJvbSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpOyB9XG4gICAgICAgICAgICB0byAgIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIEBrZXlmcmFtZXMgb25iLXRyaW8tc2VwLWZhZGUge1xuICAgICAgICAgICAgZnJvbSB7IG9wYWNpdHk6IDA7IH1cbiAgICAgICAgICAgIHRvICAgeyBvcGFjaXR5OiAwLjQ7IH1cbiAgICAgICAgICB9XG4gICAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4MHB4KSB7XG4gICAgICAgICAgICAub25iLXRyaW8ge1xuICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgICAgICAgICBnYXA6IDEwcHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAub25iLXRyaW8tc2VwIHsgZGlzcGxheTogbm9uZTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgYH08L3N0eWxlPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBcdTAwQzlDUkFOIDIgXHUyNTAwXHUyNTAwIFFVQUxJRklDQVRJT04gOiBcIkQnb1x1MDBGOSB2aWVucy10dSA/XCIgMyBjYXJkc1xuICBpZiAoc3RlcCA9PT0gMSkge1xuICAgIGNvbnN0IHByb2ZpbGVzID0gW1xuICAgICAge1xuICAgICAgICBpZDogXCJyXHUwMEVBdmV1clwiLFxuICAgICAgICBnbHlwaDogXCJcdUQ4M0NcdURGMTlcIixcbiAgICAgICAgdGV4dDogXCJKZSByXHUwMEVBdmUgc291dmVudCBldCBqZSB2ZXV4IGxlcyBjb21wcmVuZHJlXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpZDogXCJyZWNvbm5leGlvblwiLFxuICAgICAgICBnbHlwaDogXCJcdTI3MjhcIixcbiAgICAgICAgdGV4dDogXCJKZSBtZSBzb3V2aWVucyBcdTAwRTAgcGVpbmUgZGUgbWVzIHJcdTAwRUF2ZXMsIGplIHZvdWRyYWlzIG0neSByZWNvbm5lY3RlclwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWQ6IFwiY2hlcmNoZXVyXCIsXG4gICAgICAgIGdseXBoOiBcIlx1MjYwOVwiLFxuICAgICAgICB0ZXh0OiBcIkplIGNoZXJjaGUgZHUgc2VucyBkYW5zIG1hIHZpZSBldCBqJ2VudGVuZHMgcGFybGVyIGRlIERyZWFtXCIsXG4gICAgICB9LFxuICAgIF07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBpbnNldDogMCwgekluZGV4OiAyMDAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgIG9wYWNpdHk6IGFuaW1hdGluZyA/IDAgOiAxLFxuICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpXCIsXG4gICAgICAgIG92ZXJmbG93WTogXCJhdXRvXCIsXG4gICAgICB9fT5cbiAgICAgICAgPFNraXBCdXR0b24gLz5cbiAgICAgICAgPE9uYkJhY2tkcm9wIC8+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXhXaWR0aDogNDgwLCB3aWR0aDogXCIxMDAlXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgcGFkZGluZzogXCJ2YXIoLS1zLTUpIDBcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNSlcIiB9fT5cbiAgICAgICAgICAgIDxHbHlwaFRyaW5pdGUgc2l6ZT17NzJ9IC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDI2LCBsaW5lSGVpZ2h0OiAxLjQyLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTYpXCIsXG4gICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMDVlbVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgRCdvXHUwMEY5IHZpZW5zLXR1Jm5ic3A7P1xuICAgICAgICAgIDwvcD5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib25iLXF1YWwtY2FyZHNcIiByb2xlPVwicmFkaW9ncm91cFwiIGFyaWEtbGFiZWw9XCJkJ29cdTAwRjkgdmllbnMtdHVcIj5cbiAgICAgICAgICAgIHtwcm9maWxlcy5tYXAoKHAsIGkpID0+IHtcbiAgICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBzZWxlY3RlZFByb2ZpbGUgPT09IHAuaWQ7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAga2V5PXtwLmlkfVxuICAgICAgICAgICAgICAgICAgcm9sZT1cInJhZGlvXCJcbiAgICAgICAgICAgICAgICAgIGFyaWEtY2hlY2tlZD17c2VsZWN0ZWR9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwaWNrUHJvZmlsZShwLmlkKX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17XCJvbmItcXVhbC1jYXJkIG9uYi1xdWFsLWNhcmQtXCIgKyBpICsgKHNlbGVjdGVkID8gXCIgaXMtc2VsZWN0ZWRcIiA6IFwiXCIpfVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyEhc2VsZWN0ZWRQcm9maWxlfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBzZWxlY3RlZFByb2ZpbGUgPyBcImRlZmF1bHRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvbmItcXVhbC1nbHlwaFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPntwLmdseXBofTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9uYi1xdWFsLXRleHRcIj57cC50ZXh0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ29TdGVwKDIpfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwib25iLXF1YWwtc2tpcFwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy01KVwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC41NSxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiOHB4IDEycHhcIixcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDM4MG1zIGVhc2VcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBcIjAuODVcIn1cbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IFwiMC41NVwifT5cbiAgICAgICAgICAgIHBhc3NlciBjZXR0ZSBxdWVzdGlvbiBcdTIxOTJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHN0eWxlPntgXG4gICAgICAgICAgLm9uYi1xdWFsLWNhcmRzIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGdhcDogMTJweDtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgIH1cbiAgICAgICAgICAub25iLXF1YWwtY2FyZCB7XG4gICAgICAgICAgICBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgZ2FwOiAxNHB4O1xuICAgICAgICAgICAgdGV4dC1hbGlnbjogbGVmdDtcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgNTAlLCB0cmFuc3BhcmVudCk7XG4gICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpO1xuICAgICAgICAgICAgcGFkZGluZzogMTZweCAxOHB4O1xuICAgICAgICAgICAgY29sb3I6IHZhcigtLWJvbmUpO1xuICAgICAgICAgICAgZm9udC1mYW1pbHk6IHZhcigtLXNlcmlmKTsgZm9udC1zdHlsZTogaXRhbGljOyBmb250LXNpemU6IDE1cHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS40NTtcbiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiAwLjAwNWVtO1xuICAgICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC4xNSwxKTtcbiAgICAgICAgICAgIG9wYWNpdHk6IDA7XG4gICAgICAgICAgICBhbmltYXRpb246IG9uYi1xdWFsLWNhcmQtaW4gNzIwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpIGZvcndhcmRzO1xuICAgICAgICAgIH1cbiAgICAgICAgICAub25iLXF1YWwtY2FyZC0wIHsgYW5pbWF0aW9uLWRlbGF5OiAyMDBtczsgfVxuICAgICAgICAgIC5vbmItcXVhbC1jYXJkLTEgeyBhbmltYXRpb24tZGVsYXk6IDQwMG1zOyB9XG4gICAgICAgICAgLm9uYi1xdWFsLWNhcmQtMiB7IGFuaW1hdGlvbi1kZWxheTogNjAwbXM7IH1cbiAgICAgICAgICAub25iLXF1YWwtY2FyZDpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDcwJSwgdHJhbnNwYXJlbnQpO1xuICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzIlLCB2YXIoLS1hc2gtZGVlcCkpO1xuICAgICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICAub25iLXF1YWwtY2FyZC5pcy1zZWxlY3RlZCB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTIlLCB2YXIoLS1uaWdodC13YXJtKSk7XG4gICAgICAgICAgICBib3JkZXItY29sb3I6IHZhcigtLXNpbGstZ29sZCk7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDAgMjRweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB0cmFuc3BhcmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItcXVhbC1nbHlwaCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDIycHg7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMTtcbiAgICAgICAgICAgIG1pbi13aWR0aDogMjhweDtcbiAgICAgICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgICAgICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuOTI7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5vbmItcXVhbC10ZXh0IHtcbiAgICAgICAgICAgIGZsZXg6IDE7XG4gICAgICAgICAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgICAgICAgfVxuICAgICAgICAgIEBrZXlmcmFtZXMgb25iLXF1YWwtY2FyZC1pbiB7XG4gICAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7IH1cbiAgICAgICAgICAgIHRvICAgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIGB9PC9zdHlsZT5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgXHUwMEM5Q1JBTiAzIFx1MjUwMFx1MjUwMCBQcmVtaWVyIGRcdTAwRTlwXHUwMEY0dCA6IGNoYW1wIHByXHUwMEU5LWZvY3VzICsgcHJvdGVjdGlvbiArIHByaXZhY3kgcmFkaWNhbGVcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBpbnNldDogMCwgekluZGV4OiAyMDAsXG4gICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsXG4gICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1zdGFydFwiLFxuICAgICAgcGFkZGluZzogXCJjYWxjKHZhcigtLXMtNykgKyBlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMCkpIHZhcigtLXMtNSkgdmFyKC0tcy02KVwiLFxuICAgICAgb3BhY2l0eTogYW5pbWF0aW5nID8gMCA6IDEsXG4gICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpXCIsXG4gICAgICBvdmVyZmxvd1k6IFwiYXV0b1wiLFxuICAgIH19PlxuICAgICAgPFNraXBCdXR0b24gLz5cbiAgICAgIDxPbmJCYWNrZHJvcCAvPlxuICAgICAgey8qIDIwMjYtMDQtMjkgKFllc2h1YSwgRklYIFAwIGFuaW0pIFx1MjAxNCBTcGlyYWxlIHdvdyBkXHUwMEU5Y2xlbmNoXHUwMEU5ZVxuICAgICAgICAgIGF1IHBhc3NhZ2Ugc3RlcCAyLCBtYXJxdWUgc2Vuc29yaWVsIGR1IHNldWlsIFwicHJlbWllciBtZXNzYWdlXCIuICovfVxuICAgICAge3dpbmRvdy5TcGlyYWxlV293T3ZlcmxheSAmJiAoXG4gICAgICAgIDx3aW5kb3cuU3BpcmFsZVdvd092ZXJsYXlcbiAgICAgICAgICBzaG93PXt3b3dTcGlyYWxlfVxuICAgICAgICAgIG9uRG9uZT17KCkgPT4gc2V0V293U3BpcmFsZShmYWxzZSl9XG4gICAgICAgIC8+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1heFdpZHRoOiA1NDAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luVG9wOiBcInZhcigtLXMtNSlcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiwgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNSlcIiB9fT5cbiAgICAgICAgICA8R2x5cGhMdW5lRGVjcm9pc3NhbnRlIHNpemU9ezY0fSBicmVhdGhpbmc9e3RydWV9IC8+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAyNiwgbGluZUhlaWdodDogMS40MixcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMDVlbVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICBUb24gcHJlbWllciBkXHUwMEU5cFx1MDBGNHQuXG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogVGV4dGUgcmFzc3VyYW50IFx1MjAxNCBwcm90ZWN0aW9uICsgcHJpdmFjeSByYWRpY2FsZSAqL31cbiAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEzLCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgIG9wYWNpdHk6IDAuODIsXG4gICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgICAgbWF4V2lkdGg6IDQ2MCwgbWFyZ2luTGVmdDogXCJhdXRvXCIsIG1hcmdpblJpZ2h0OiBcImF1dG9cIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgcGV1IGltcG9ydGUgXHUyMDE0IHVuIGZyYWdtZW50LCB1bmUgaW1hZ2UsIHVuZSBzZW5zYXRpb24sXG4gICAgICAgICAgb3UgdW5lIGxpZ25lIHN1ciBjZSBxdWUgdHUgdmlzIGF1am91cmQnaHVpLjxiciAvPlxuICAgICAgICAgIGwnYXBwIGdhcmRlIHRvdXQsIHNhbnMganVnZW1lbnQsIHNhbnMgZWZmb3J0LCBlbiBwcml2YWN5IHJhZGljYWxlLlxuICAgICAgICA8L3A+XG5cbiAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgcmVmPXt0YVJlZn1cbiAgICAgICAgICByb3dzPXs2fVxuICAgICAgICAgIHZhbHVlPXt0ZXh0fVxuICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRleHQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwicmFjb250ZSBcdTIwMTQgdW4gZnJhZ21lbnQsIHVuZSBpbWFnZSwgdW5lIHNlbnNhdGlvblx1MjAyNlwiXG4gICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTcsIGxpbmVIZWlnaHQ6IDEuNixcbiAgICAgICAgICAgIHJlc2l6ZTogXCJ2ZXJ0aWNhbFwiLCBvdXRsaW5lOiBcIm5vbmVcIixcbiAgICAgICAgICAgIG1pbkhlaWdodDogMTMwLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJib3JkZXItY29sb3IgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpLCBib3gtc2hhZG93IDM4MG1zIGVhc2VcIixcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXM9e2UgPT4ge1xuICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzglLCB2YXIoLS1hc2gtZGVlcCkpXCI7XG4gICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm94U2hhZG93ID0gXCIwIDAgMTZweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTIlLCB0cmFuc3BhcmVudClcIjtcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQmx1cj17ZSA9PiB7XG4gICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLWFzaC1kZWVwKSlcIjtcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3hTaGFkb3cgPSBcIm5vbmVcIjtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuXG4gICAgICAgIHtzdWJtaXRFcnJvciAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG10LXNcIiBzdHlsZT17e1xuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSwgI0M5N0E0QSlcIixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiBcInZhcigtLXMtMylcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtzdWJtaXRFcnJvcn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7XG4gICAgICAgICAgbWFyZ2luVG9wOiBcInZhcigtLXMtNSlcIixcbiAgICAgICAgICBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDE0LFxuICAgICAgICB9fT5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2ZpbmlzaH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogdGV4dC50cmltKCkubGVuZ3RoID49IDNcbiAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE4JSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgICAgICAgICA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBcIiArICh0ZXh0LnRyaW0oKS5sZW5ndGggPj0gM1xuICAgICAgICAgICAgICAgID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCJcbiAgICAgICAgICAgICAgICA6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDUwJSwgdmFyKC0tYm9uZSkpXCIpLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIxM3B4IDI4cHhcIixcbiAgICAgICAgICAgICAgY3Vyc29yOiBzdWJtaXR0aW5nID8gXCJkZWZhdWx0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgb3BhY2l0eTogc3VibWl0dGluZyA/IDAuNSA6IDEsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC4xNSwxKVwiLFxuICAgICAgICAgICAgICBib3hTaGFkb3c6IHRleHQudHJpbSgpLmxlbmd0aCA+PSAzXG4gICAgICAgICAgICAgICAgPyBcIjAgMCAyMnB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHRyYW5zcGFyZW50KVwiXG4gICAgICAgICAgICAgICAgOiBcIm5vbmVcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3N1Ym1pdHRpbmdcbiAgICAgICAgICAgICAgPyBcImRcdTAwRTlwXHUwMEY0dCBlbiBjb3Vyc1x1MjAyNlwiXG4gICAgICAgICAgICAgIDogKHRleHQudHJpbSgpLmxlbmd0aCA+PSAzID8gXCJkXHUwMEU5cG9zZXIgbW9uIHByZW1pZXIgclx1MDBFQXZlXCIgOiBcImRcdTAwRTlwb3NlciBtb24gcHJlbWllciByXHUwMEVBdmVcIil9XG4gICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2ZpbmlzaH1cbiAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDBcIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDM4MG1zIGVhc2VcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBcIjAuOVwifVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gXCIwLjZcIn0+XG4gICAgICAgICAgICBvdSBjb21tZW5jZXIgc2FucyBkXHUwMEU5cG9zZXIgXHUyMTkyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBNaWNyby10ZXh0IGJhcyA6IGluZGljYXRldXIgZGUgbGEgcG9ydGUgY2FjaFx1MDBFOWUgKi99XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNTAgbXQtbFwiIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAxMiwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgbWFyZ2luVG9wOiBcInZhcigtLXMtNilcIixcbiAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICBvcGFjaXR5OiAwLjU1LFxuICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIGxlIGdseXBoZSBsdW5lIGVuIGhhdXQgclx1MDBFOXZcdTAwRThsZSB0b3V0ZXMgbGVzIHBvcnRlcyBjYWNoXHUwMEU5ZXMuXG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogTGllbiByZXRvdXIgZGlzY3JldCAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIG1hcmdpblRvcDogXCJ2YXIoLS1zLTQpXCIgfX0+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnb1N0ZXAoMSl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC40NSxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDBcIixcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDM4MG1zIGVhc2VcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSBcIjAuNzVcIn1cbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IFwiMC40NVwifT5cbiAgICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBFeHBvcnRzIFx1MjE5MiB3aW5kb3cgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5PYmplY3QuYXNzaWduKHdpbmRvdywge1xuICBPbmJvYXJkaW5nUml0dWVsLFxuICBpc09uYm9hcmRlZEJQbHVzRCxcbiAgbWFya09uYm9hcmRlZEJQbHVzRCxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBNkJBLE1BQU0sRUFBRSxVQUFVLE9BQU8sV0FBVyxPQUFPLFFBQVEsTUFBTSxJQUFJO0FBRTdELE1BQU0sZ0JBQWdCO0FBQ3RCLE1BQU0sY0FBYztBQUdwQixTQUFTLG9CQUFvQjtBQUMzQixNQUFJO0FBQUUsV0FBTyxDQUFDLENBQUMsYUFBYSxRQUFRLGFBQWE7QUFBQSxFQUFHLFNBQzlDO0FBQUUsV0FBTztBQUFBLEVBQU87QUFDeEI7QUFHQSxTQUFTLHNCQUFzQjtBQUM3QixNQUFJO0FBQUUsaUJBQWEsUUFBUSxlQUFlLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQztBQUFBLEVBQUcsU0FBUTtBQUFBLEVBQUM7QUFDMUU7QUFHQSxTQUFTLHFCQUFxQixTQUFTO0FBQ3JDLE1BQUk7QUFBRSxpQkFBYSxRQUFRLGFBQWEsT0FBTztBQUFBLEVBQUcsU0FBUTtBQUFBLEVBQUM7QUFDN0Q7QUFHQSxTQUFTLHNCQUFzQixFQUFFLE9BQU8sSUFBSSxZQUFZLE1BQU0sR0FBRztBQUMvRCxTQUNFO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBSSxPQUFPO0FBQUEsTUFBTSxRQUFRO0FBQUEsTUFBTSxTQUFRO0FBQUEsTUFBYyxlQUFZO0FBQUEsTUFDaEUsV0FBVyxZQUFZLG9CQUFvQjtBQUFBLE1BQzNDLE9BQU8sRUFBRSxTQUFTLFNBQVMsUUFBUSxTQUFTO0FBQUE7QUFBQSxJQUM1QyxvQ0FBQyxjQUNDLG9DQUFDLFVBQUssSUFBRyxtQkFDUCxvQ0FBQyxVQUFLLEdBQUUsS0FBSSxHQUFFLEtBQUksT0FBTSxPQUFNLFFBQU8s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
