(function setupLucidScreens() {
  const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;
  const T = {
    bg: "var(--night-warm, #15130F)",
    bgFloor: "var(--night-floor, #0E0F14)",
    bgSoft: "color-mix(in oklch, var(--paper-warm, #B89E7C) 6%, transparent)",
    border: "var(--ash-deep, #1F2025)",
    borderActive: "var(--silk-gold, #C8A658)",
    text: "var(--bone, #C4B9AD)",
    textDim: "var(--ash-light, #5C5854)",
    textMuted: "var(--ash-mid, #363430)",
    accent: "var(--silk-gold, #C8A658)",
    ember: "var(--ember-live, #C46B3D)",
    danger: "var(--clay-earth, #8C5C3B)",
    serif: "var(--serif, 'EB Garamond', Garamond, serif)",
    sans: "var(--sans, Inter, system-ui, sans-serif)",
    mono: "var(--mono, 'JetBrains Mono', ui-monospace, monospace)"
  };
  function Stage({ children, style }) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: {
      minHeight: "100vh",
      background: T.bgFloor,
      color: T.text,
      fontFamily: T.sans,
      fontSize: 15,
      lineHeight: 1.55,
      padding: "0 0 100px",
      ...style
    } }, children);
  }
  function Frame({ children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "frame", style: {
      maxWidth: 720,
      margin: "0 auto",
      padding: "24px 24px 48px"
    } }, children);
  }
  function LucidHeader({ go, sub }) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 32 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => go("explorer"),
        style: {
          background: "transparent",
          border: "none",
          color: T.textDim,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          padding: "6px 0",
          cursor: "pointer",
          marginBottom: 12
        }
      },
      "\u2190 retour"
    ), window.GeoSymbol && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      display: "flex",
      justifyContent: "flex-start",
      marginBottom: 14
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "relative",
      width: 30,
      height: 30,
      opacity: 0.55,
      animation: "breathe-souffle 6s ease-in-out infinite"
    } }, /* @__PURE__ */ React.createElement(
      window.GeoSymbol,
      {
        kind: "croissant",
        color: "bone",
        style: { position: "relative", width: 30, height: 30, opacity: 1 }
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10,
      letterSpacing: "0.16em",
      color: T.accent,
      textTransform: "uppercase",
      marginBottom: 8
    } }, "\u25D0 \xA0lucid \xB7 ton terrain de pratique"), sub && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      color: T.textDim,
      maxWidth: 540
    } }, sub));
  }
  function Card({ children, title, accent, style }) {
    return /* @__PURE__ */ React.createElement("section", { style: {
      background: T.bgSoft,
      border: `1px solid ${T.border}`,
      padding: "20px 22px",
      marginBottom: 20,
      borderRadius: 0,
      ...style
    } }, title && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10,
      letterSpacing: "0.14em",
      color: accent ? T.accent : T.textDim,
      textTransform: "uppercase",
      marginBottom: 14
    } }, title), children);
  }
  function Btn({ children, onClick, primary, ghost, danger, disabled, style }) {
    let color = T.text;
    let border = T.border;
    let bg = "transparent";
    if (primary) {
      color = T.accent;
      border = T.accent;
      bg = "color-mix(in oklch, var(--silk-gold, #C8A658) 8%, transparent)";
    } else if (ghost) {
      color = T.textDim;
      border = "transparent";
    } else if (danger) {
      color = T.danger;
      border = T.danger;
    }
    return /* @__PURE__ */ React.createElement("button", { onClick, disabled, style: {
      background: bg,
      border: `1px solid ${border}`,
      color: disabled ? T.textMuted : color,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      padding: "10px 18px",
      cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: "0.01em",
      opacity: disabled ? 0.4 : 1,
      borderRadius: 0,
      transition: "all 280ms ease",
      ...style
    } }, children);
  }
  function Chip({ children, active, onClick, style }) {
    return /* @__PURE__ */ React.createElement("button", { onClick, style: {
      background: active ? "color-mix(in oklch, var(--silk-gold, #C8A658) 10%, transparent)" : "transparent",
      border: `1px solid ${active ? T.accent : T.border}`,
      color: active ? T.accent : T.textDim,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      padding: "8px 16px",
      cursor: "pointer",
      borderRadius: 100,
      transition: "all 280ms ease",
      ...style
    } }, children);
  }
  function Field({ label, children, hint }) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, label && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 6
    } }, label), children, hint && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 13,
      color: T.textMuted,
      marginTop: 6,
      lineHeight: 1.5
    } }, hint));
  }
  function Input({ value, onChange, placeholder, type }) {
    return /* @__PURE__ */ React.createElement(
      "input",
      {
        type: type || "text",
        value: value || "",
        onChange: (e) => onChange(e.target.value),
        placeholder,
        style: {
          width: "100%",
          background: T.bg,
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.sans,
          fontSize: 15,
          padding: "10px 14px",
          outline: "none",
          borderRadius: 0
        },
        onFocus: (e) => e.target.style.borderColor = T.accent,
        onBlur: (e) => e.target.style.borderColor = T.border
      }
    );
  }
  function Select({ value, onChange, options }) {
    return /* @__PURE__ */ React.createElement(
      "select",
      {
        value: value || "",
        onChange: (e) => onChange(e.target.value),
        style: {
          width: "100%",
          background: T.bg,
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.sans,
          fontSize: 15,
          padding: "10px 14px",
          borderRadius: 0,
          outline: "none"
        }
      },
      options.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.value, value: o.value }, o.label))
    );
  }
  function Toggle({ on, onClick, label, hint }) {
    return /* @__PURE__ */ React.createElement("div", { onClick, style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 0",
      borderBottom: `1px solid ${T.border}`,
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0, paddingRight: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontSize: 16, color: T.text, fontStyle: "italic" } }, label), hint && /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontStyle: "italic", fontSize: 13, color: T.textDim, marginTop: 2 } }, hint)), /* @__PURE__ */ React.createElement("div", { style: {
      width: 38,
      height: 20,
      position: "relative",
      flexShrink: 0,
      background: on ? "color-mix(in oklch, var(--silk-gold, #C8A658) 16%, transparent)" : "transparent",
      border: `1px solid ${on ? T.accent : T.border}`,
      borderRadius: 100
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      position: "absolute",
      top: 1,
      left: on ? 18 : 1,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: on ? T.accent : T.textDim,
      transition: "left 280ms ease"
    } })));
  }
  function Slider({ value, onChange, min, max, step, label, valueLabel }) {
    return /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, label && /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: 6
    } }, /* @__PURE__ */ React.createElement("span", null, label), /* @__PURE__ */ React.createElement("span", { style: { color: T.accent, fontStyle: "normal" } }, valueLabel || value + (max ? "/" + max : ""))), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "range",
        min: min || 0,
        max: max || 5,
        step: step || 1,
        value: value || 0,
        onChange: (e) => onChange(parseInt(e.target.value, 10)),
        style: { width: "100%", accentColor: "var(--silk-gold, #C8A658)" }
      }
    ));
  }
  const ONB_EXPERIENCES = [
    { value: "discovery", label: "d\xE9couverte" },
    { value: "occasional", label: "j'en ai eu quelques-uns" },
    { value: "regular_dild", label: "je pratique (DILD)" },
    { value: "regular_mild", label: "je pratique (MILD)" },
    { value: "regular_wild", label: "je pratique (WILD)" },
    { value: "advanced", label: "avanc\xE9\xB7e (200+)" }
  ];
  const LucidOnboarding = ({ profile, onComplete, onSkip }) => {
    const [step, setStep] = uS(0);
    const [exp, setExp] = uS((profile == null ? void 0 : profile.experience_level) || null);
    const [busy, setBusy] = uS(false);
    const finish = async (createDefaultRC) => {
      setBusy(true);
      try {
        const patch = {
          enabled: true,
          onboarding_completed: true,
          ui_mode: "dream_ambient"
        };
        if (exp) patch.experience_level = exp;
        await window.DreamAPI.updateLucidProfile(patch);
        if (createDefaultRC) {
          await window.DreamAPI.createRealityCheck({
            technique: "look_at_hands",
            interval_minutes: 240,
            active_hours_start: "09:00",
            active_hours_end: "21:00",
            vibration_pattern: "short",
            trigger_context: "interval",
            max_per_day: 3
          });
        }
        try {
          localStorage.setItem("dream:lucid:enabled", "true");
        } catch (e) {
        }
        onComplete();
      } finally {
        setBusy(false);
      }
    };
    return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(LucidHeader, { go: () => onSkip() }), step === 0 && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      padding: "32px 0 16px"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontSize: 56,
      color: T.accent,
      opacity: 0.85,
      marginBottom: 24,
      letterSpacing: "0.05em"
    } }, "\u25D0"), /* @__PURE__ */ React.createElement("h1", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 28,
      lineHeight: 1.3,
      color: T.text,
      fontWeight: 300,
      margin: "0 0 16px",
      maxWidth: 460,
      marginLeft: "auto",
      marginRight: "auto"
    } }, "le r\xEAve lucide \u2014 un terrain de pratique. pas une magie."), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 1.6,
      color: T.textDim,
      maxWidth: 480,
      margin: "0 auto 32px"
    } }, "ici, tu peux t'entra\xEEner \xE0 reconna\xEEtre que tu r\xEAves, pendant que tu r\xEAves. des techniques (MILD, WBTB, dream signs), pas de promesses."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => setStep(1) }, "commencer"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: onSkip }, "plus tard")))), step === 1 && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 0" } }, /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 24,
      lineHeight: 1.3,
      color: T.text,
      fontWeight: 300,
      margin: "0 0 24px"
    } }, "o\xF9 en es-tu, dans ta pratique ?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 } }, ONB_EXPERIENCES.map((o) => /* @__PURE__ */ React.createElement(Chip, { key: o.value, active: exp === o.value, onClick: () => setExp(o.value) }, o.label))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => setStep(0) }, "\u2190 retour"), /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => setStep(2), disabled: !exp }, "continuer \u2192")))), step === 2 && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 0" } }, /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 24,
      lineHeight: 1.3,
      color: T.text,
      fontWeight: 300,
      margin: "0 0 16px"
    } }, "veux-tu une premi\xE8re technique simple ?"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 1.6,
      color: T.textDim,
      marginBottom: 20
    } }, "on peut t'installer un reality check l\xE9ger (3 fois par jour, regarde tes mains) + commencer la pratique ", /* @__PURE__ */ React.createElement("em", null, "MILD"), "."), /* @__PURE__ */ React.createElement("div", { style: {
      borderLeft: `2px solid ${T.accent}`,
      paddingLeft: 16,
      marginBottom: 24,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 15,
      color: T.text,
      lineHeight: 1.6
    } }, /* @__PURE__ */ React.createElement("strong", { style: { color: T.accent, fontStyle: "normal", fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em" } }, "MILD"), /* @__PURE__ */ React.createElement("br", null), "avant de dormir, r\xE9p\xE8te int\xE9rieurement :", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", { style: { color: T.text } }, "\xAB la prochaine fois que je r\xEAve, je le saurai. \xBB")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => finish(true), disabled: busy }, busy ? "\u2026" : "oui, installer"), /* @__PURE__ */ React.createElement(Btn, { onClick: () => finish(false), disabled: busy }, "je verrai plus tard"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => setStep(1) }, "\u2190 retour"))))));
  };
  const TABS = [
    { key: "profile", route: "lucid-profile", label: "profil", glyph: "\u25D0" },
    { key: "rc", route: "lucid-reality-checks", label: "reality", glyph: "\u2731" },
    { key: "signs", route: "lucid-dream-signs", label: "dream signs", glyph: "\u2726" },
    { key: "wbtb", route: "lucid-wbtb", label: "WBTB", glyph: "\u263E" },
    { key: "stats", route: "lucid-dashboard", label: "stats", glyph: "\u25A4" }
  ];
  function LucidTabs({ go, current }) {
    return /* @__PURE__ */ React.createElement("nav", { style: {
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "color-mix(in oklch, var(--night-floor, #0E0F14) 95%, transparent)",
      backdropFilter: "blur(12px)",
      borderTop: `1px solid ${T.border}`,
      padding: "10px 12px 18px",
      display: "flex",
      justifyContent: "space-around",
      alignItems: "center"
    } }, TABS.map((t) => {
      const active = t.key === current;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: t.key,
          onClick: () => go(t.route),
          "aria-label": t.label,
          style: {
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding: "4px 8px",
            color: active ? T.accent : T.textDim,
            opacity: active ? 1 : 0.7,
            transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
          }
        },
        /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18 } }, t.glyph),
        /* @__PURE__ */ React.createElement("span", { style: {
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 11,
          letterSpacing: "0.02em"
        } }, t.label)
      );
    }));
  }
  const LucidProfileScreen = ({ go }) => {
    const [profile, setProfile] = uS(null);
    const [loading, setLoading] = uS(true);
    const [forceOnboard, setForceOnboard] = uS(false);
    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.getLucidProfile();
        setProfile((res == null ? void 0 : res.profile) || null);
      } finally {
        setLoading(false);
      }
    };
    uE(() => {
      refresh();
    }, []);
    const update = async (patch) => {
      const res = await window.DreamAPI.updateLucidProfile(patch);
      setProfile((res == null ? void 0 : res.profile) || null);
      if ("enabled" in patch) {
        try {
          localStorage.setItem("dream:lucid:enabled", patch.enabled ? "true" : "false");
        } catch (e) {
        }
      }
    };
    if (loading) {
      return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(LucidHeader, { go }), /* @__PURE__ */ React.createElement("div", { className: "breath", style: { color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "chargement\u2026")));
    }
    const needOnboard = forceOnboard || !(profile == null ? void 0 : profile.enabled) && !(profile == null ? void 0 : profile.onboarding_completed) || (profile == null ? void 0 : profile.enabled) && !(profile == null ? void 0 : profile.onboarding_completed);
    if (needOnboard) {
      return /* @__PURE__ */ React.createElement(
        LucidOnboarding,
        {
          profile,
          onComplete: () => {
            setForceOnboard(false);
            refresh();
          },
          onSkip: () => go("explorer")
        }
      );
    }
    if (!(profile == null ? void 0 : profile.enabled)) {
      return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(LucidHeader, { go, sub: "le mode lucide est d\xE9sactiv\xE9. tu peux le rallumer ici." }), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: { padding: "20px 0", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontStyle: "italic", fontSize: 18, color: T.textDim, marginBottom: 24 } }, "rien ne tourne en arri\xE8re-plan tant que le mode est \xE9teint."), /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => update({ enabled: true }) }, "rallumer le mode lucide")))), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "profile" }));
    }
    return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(LucidHeader, { go, sub: "ton terrain de pratique. opt-in, sans pression." }), /* @__PURE__ */ React.createElement(Card, { title: "pratique", accent: true }, /* @__PURE__ */ React.createElement(Field, { label: "niveau d'exp\xE9rience" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: profile.experience_level || "",
        onChange: (v) => update({ experience_level: v || null }),
        options: [{ value: "", label: "\u2014" }, ...ONB_EXPERIENCES]
      }
    )), /* @__PURE__ */ React.createElement(
      Field,
      {
        label: "technique pr\xE9f\xE9r\xE9e",
        hint: "MILD = r\xE9p\xE9tition d'intention. WBTB = r\xE9veil + retour avec intention. WILD = passage conscient. SSILD = cycle des sens. DILD = lucidit\xE9 spontan\xE9e dans le r\xEAve."
      },
      /* @__PURE__ */ React.createElement(
        Select,
        {
          value: profile.preferred_technique || "",
          onChange: (v) => update({ preferred_technique: v || null }),
          options: [
            { value: "", label: "\u2014" },
            { value: "MILD", label: "MILD (intention r\xE9p\xE9t\xE9e)" },
            { value: "WBTB", label: "WBTB (wake back to bed)" },
            { value: "WILD", label: "WILD (passage conscient)" },
            { value: "SSILD", label: "SSILD (cycle des sens)" },
            { value: "DILD", label: "DILD (spontan\xE9 dans le r\xEAve)" }
          ]
        }
      )
    )), /* @__PURE__ */ React.createElement(Card, { title: "export" }, /* @__PURE__ */ React.createElement(
      Toggle,
      {
        on: !!profile.obsidian_export_enabled,
        onClick: () => update({ obsidian_export_enabled: !profile.obsidian_export_enabled }),
        label: "export Obsidian / Markdown activ\xE9",
        hint: "t\xE9l\xE9chargement .md avec frontmatter (date, lucidit\xE9, technique, signs)."
      }
    )), /* @__PURE__ */ React.createElement(Card, { title: "explore la profondeur", accent: true }, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      color: T.textDim,
      marginBottom: 14,
      lineHeight: 1.6
    } }, "cette chambre est une chapelle lat\xE9rale de la cath\xE9drale Dream. tu peux remonter au sol \u2014 converser avec Anima de ta pratique, ou voir comment tes lucides s'inscrivent dans ton portrait global."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => {
      try {
        sessionStorage.setItem(
          "dream:chat:prefilled",
          "Je viens de la chambre Lucid. J'aimerais parler de ma pratique du r\xEAve lucide \u2014 ce qui revient, ce qui me trouble, ce que je n'ose pas regarder."
        );
      } catch (e) {
      }
      go("dream-chat");
    } }, "\u2726 converse avec Anima de cette pratique"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => go("portrait") }, "\u21BA portrait narratif"))), /* @__PURE__ */ React.createElement(Card, { title: "zone de retrait" }, /* @__PURE__ */ React.createElement(
      Toggle,
      {
        on: !!profile.enabled,
        onClick: () => update({ enabled: false }),
        label: "d\xE9sactiver le mode lucide",
        hint: "rien n'est supprim\xE9. tu peux rallumer quand tu veux."
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14 } }, /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => setForceOnboard(true) }, "refaire l'introduction")))), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "profile" }));
  };
  const RC_TECHNIQUES_FR = [
    { value: "look_at_hands", label: "regarde tes mains" },
    { value: "look_at_text", label: "lis un texte deux fois" },
    { value: "finger_through_palm", label: "passe un doigt \xE0 travers ta paume" },
    { value: "look_at_clock", label: "regarde l'heure (deux fois)" },
    { value: "breath_through_nose", label: "pince ton nez et respire" },
    { value: "jump_test", label: "saute (est-ce que tu flottes ?)" },
    { value: "custom", label: "personnalis\xE9\u2026" }
  ];
  const RC_TRIGGERS_FR = [
    { value: "interval", label: "\xE0 intervalles r\xE9guliers" },
    { value: "on_app_open", label: "\xE0 l'ouverture de l'app" },
    { value: "on_morning", label: "le matin (au r\xE9veil)" },
    { value: "on_evening", label: "le soir (avant dormir)" },
    { value: "on_random", label: "\xE0 un moment impr\xE9vu" }
  ];
  const RC_VIB_FR = [
    { value: "short", label: "courte" },
    { value: "medium", label: "moyenne" },
    { value: "long", label: "longue" }
  ];
  const LucidRealityChecksScreen = ({ go }) => {
    const [checks, setChecks] = uS([]);
    const [loading, setLoading] = uS(true);
    const [adding, setAdding] = uS(false);
    const [draft, setDraft] = uS(null);
    const intervalRef = uR(null);
    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.listRealityChecks();
        setChecks((res == null ? void 0 : res.reality_checks) || []);
      } finally {
        setLoading(false);
      }
    };
    uE(() => {
      refresh();
    }, []);
    uE(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const enabled = checks.filter((c) => c.enabled);
      if (enabled.length === 0) return;
      intervalRef.current = setInterval(() => {
        var _a;
        if (typeof Notification === "undefined") return;
        if (Notification.permission !== "granted") return;
        const now = /* @__PURE__ */ new Date();
        const today = now.toISOString().slice(0, 10);
        const hour = now.toTimeString().slice(0, 5);
        for (const rc of enabled) {
          if (rc.trigger_context && rc.trigger_context !== "interval") continue;
          if (rc.active_hours_start && hour < rc.active_hours_start) continue;
          if (rc.active_hours_end && hour > rc.active_hours_end) continue;
          const lastDay = rc.last_performed_at ? rc.last_performed_at.slice(0, 10) : null;
          const performedToday = lastDay === today ? rc._countToday || 1 : 0;
          if (performedToday >= (rc.max_per_day || 3)) continue;
          const last = rc.last_performed_at ? new Date(rc.last_performed_at).getTime() : 0;
          const interval = (rc.interval_minutes || 90) * 60 * 1e3;
          if (Date.now() - last >= interval) {
            try {
              new Notification("Reality check", {
                body: rc.custom_label || (((_a = RC_TECHNIQUES_FR.find((x) => x.value === rc.technique)) == null ? void 0 : _a.label) || rc.technique),
                silent: !rc.sound_enabled
              });
              window.DreamAPI.updateRealityCheck(rc.id, {
                last_performed_at: (/* @__PURE__ */ new Date()).toISOString(),
                performed_count: (rc.performed_count || 0) + 1
              }).then(refresh).catch(() => {
              });
            } catch (e) {
              console.warn(e);
            }
          }
        }
      }, 60 * 1e3);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [checks]);
    uE(() => {
      var _a;
      const now = /* @__PURE__ */ new Date();
      const today = now.toISOString().slice(0, 10);
      const onOpen = checks.filter(
        (c) => c.enabled && c.trigger_context === "on_app_open" && (!c.last_performed_at || !c.last_performed_at.startsWith(today))
      );
      if (onOpen.length === 0) return;
      for (const rc of onOpen) {
        try {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Reality check", {
              body: rc.custom_label || (((_a = RC_TECHNIQUES_FR.find((x) => x.value === rc.technique)) == null ? void 0 : _a.label) || rc.technique)
            });
          }
          window.DreamAPI.updateRealityCheck(rc.id, {
            last_performed_at: (/* @__PURE__ */ new Date()).toISOString(),
            performed_count: (rc.performed_count || 0) + 1
          }).then(refresh).catch(() => {
          });
        } catch (e) {
        }
      }
    }, [checks.length]);
    const askPerm = async () => {
      if (typeof Notification === "undefined") {
        alert("notifications indisponibles sur cet appareil.");
        return;
      }
      if (Notification.permission === "default") {
        const p = await Notification.requestPermission();
        alert("permission : " + p);
      } else {
        alert("d\xE9j\xE0 : " + Notification.permission);
      }
    };
    const startAdd = () => {
      setDraft({
        technique: "look_at_hands",
        custom_label: "",
        interval_minutes: 240,
        active_hours_start: "09:00",
        active_hours_end: "21:00",
        vibration_pattern: "short",
        sound_enabled: false,
        trigger_context: "interval",
        max_per_day: 3,
        enabled: true
      });
      setAdding(true);
    };
    const save = async () => {
      try {
        await window.DreamAPI.createRealityCheck(draft);
        setAdding(false);
        setDraft(null);
        refresh();
      } catch (e) {
        alert("erreur : " + e.message);
      }
    };
    const toggle = async (rc) => {
      await window.DreamAPI.updateRealityCheck(rc.id, { enabled: !rc.enabled });
      refresh();
    };
    const remove = async (rc) => {
      if (!confirm("supprimer ce reality check ?")) return;
      await window.DreamAPI.deleteRealityCheck(rc.id);
      refresh();
    };
    return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(
      LucidHeader,
      {
        go,
        sub: "reality checks \u2014 petits gestes r\xE9p\xE9t\xE9s dans la journ\xE9e. quand un sign appara\xEEt, l'habitude te dit : \xAB est-ce que je r\xEAve ? \xBB"
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: startAdd }, "+ ajouter"), /* @__PURE__ */ React.createElement(Btn, { onClick: askPerm }, "activer notifications")), adding && draft && /* @__PURE__ */ React.createElement(Card, { title: "nouveau reality check", accent: true }, /* @__PURE__ */ React.createElement(Field, { label: "technique" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: draft.technique,
        onChange: (v) => setDraft({ ...draft, technique: v }),
        options: RC_TECHNIQUES_FR
      }
    )), draft.technique === "custom" && /* @__PURE__ */ React.createElement(Field, { label: "formulation perso" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        value: draft.custom_label,
        onChange: (v) => setDraft({ ...draft, custom_label: v }),
        placeholder: "ex. compte tes doigts"
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "quand", hint: "si tu choisis \xAB \xE0 intervalles \xBB, fixe la fr\xE9quence ci-dessous." }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: draft.trigger_context,
        onChange: (v) => setDraft({ ...draft, trigger_context: v }),
        options: RC_TRIGGERS_FR
      }
    )), draft.trigger_context === "interval" && /* @__PURE__ */ React.createElement(
      Slider,
      {
        label: "fr\xE9quence",
        valueLabel: `toutes les ${draft.interval_minutes} min`,
        value: draft.interval_minutes,
        onChange: (v) => setDraft({ ...draft, interval_minutes: v }),
        min: 30,
        max: 360,
        step: 15
      }
    ), /* @__PURE__ */ React.createElement(
      Slider,
      {
        label: "max par jour",
        valueLabel: String(draft.max_per_day || 3),
        value: draft.max_per_day,
        onChange: (v) => setDraft({ ...draft, max_per_day: v }),
        min: 1,
        max: 8,
        step: 1
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement(Field, { label: "actif de" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "time",
        value: draft.active_hours_start,
        onChange: (v) => setDraft({ ...draft, active_hours_start: v })
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "\xE0" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "time",
        value: draft.active_hours_end,
        onChange: (v) => setDraft({ ...draft, active_hours_end: v })
      }
    ))), /* @__PURE__ */ React.createElement(Field, { label: "vibration" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: draft.vibration_pattern,
        onChange: (v) => setDraft({ ...draft, vibration_pattern: v }),
        options: RC_VIB_FR
      }
    )), /* @__PURE__ */ React.createElement(
      Toggle,
      {
        on: !!draft.sound_enabled,
        onClick: () => setDraft({ ...draft, sound_enabled: !draft.sound_enabled }),
        label: "son discret"
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 18 } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: save }, "enregistrer"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => {
      setAdding(false);
      setDraft(null);
    } }, "annuler"))), loading && /* @__PURE__ */ React.createElement("div", { style: { color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "chargement\u2026"), !loading && checks.length === 0 && !adding && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      color: T.textDim,
      textAlign: "center",
      padding: "20px 0"
    } }, "aucun reality check pour l'instant.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13 } }, "les classiques : ", /* @__PURE__ */ React.createElement("em", null, "regarde tes mains"), ", ", /* @__PURE__ */ React.createElement("em", null, "lis un texte deux fois"), ", ", /* @__PURE__ */ React.createElement("em", null, "est-ce que je r\xEAve ?")))), checks.map((rc) => {
      var _a, _b;
      const techLabel = ((_a = RC_TECHNIQUES_FR.find((x) => x.value === rc.technique)) == null ? void 0 : _a.label) || rc.technique;
      const trigLabel = ((_b = RC_TRIGGERS_FR.find((x) => x.value === rc.trigger_context)) == null ? void 0 : _b.label) || "intervalle";
      return /* @__PURE__ */ React.createElement(Card, { key: rc.id }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 17,
        color: T.text,
        marginBottom: 6
      } }, rc.custom_label || techLabel), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim,
        letterSpacing: "0.04em"
      } }, trigLabel, rc.trigger_context === "interval" && ` \xB7 toutes les ${rc.interval_minutes} min`, ` \xB7 ${rc.active_hours_start}\u2013${rc.active_hours_end}`, ` \xB7 max ${rc.max_per_day || 3}/j`), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.accent,
        marginTop: 4
      } }, rc.performed_count || 0, " fait", (rc.performed_count || 0) > 1 ? "s" : "")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Btn, { primary: !!rc.enabled, onClick: () => toggle(rc), style: { padding: "6px 12px", fontSize: 12 } }, rc.enabled ? "actif" : "off"), /* @__PURE__ */ React.createElement(Btn, { danger: true, onClick: () => remove(rc), style: { padding: "6px 10px", fontSize: 12 } }, "\xD7"))));
    })), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "rc" }));
  };
  const SIGN_CAT_FR = [
    { value: "", label: "\u2014" },
    { value: "character", label: "personnage" },
    { value: "location", label: "lieu" },
    { value: "object", label: "objet" },
    { value: "action", label: "action" },
    { value: "emotion", label: "\xE9motion" }
  ];
  const CAT_COLOR = {
    character: "#C46B3D",
    // ember
    location: "#7E9DBA",
    // stone-cool
    object: "#A89469",
    action: "#C8A658",
    // silk-gold
    emotion: "#9E7BB0"
  };
  const LucidDreamSignsScreen = ({ go }) => {
    const [signs, setSigns] = uS([]);
    const [loading, setLoading] = uS(true);
    const [newLabel, setNewLabel] = uS("");
    const [newCat, setNewCat] = uS("");
    const [showTuto, setShowTuto] = uS(false);
    const [suggesting, setSuggesting] = uS(false);
    const [suggestNote, setSuggestNote] = uS("");
    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.listDreamSigns();
        setSigns((res == null ? void 0 : res.dream_signs) || []);
      } finally {
        setLoading(false);
      }
    };
    uE(() => {
      refresh();
    }, []);
    const add = async () => {
      const label = (newLabel || "").trim();
      if (!label) return;
      await window.DreamAPI.addDreamSign(label, newCat || null);
      setNewLabel("");
      setNewCat("");
      refresh();
    };
    const suggestIA = async () => {
      setSuggesting(true);
      setSuggestNote("");
      try {
        const res = await window.DreamAPI.suggestDreamSigns();
        const n = ((res == null ? void 0 : res.suggestions) || []).length;
        if (n > 0) {
          setSuggestNote(`${n} suggestion${n > 1 ? "s" : ""} ajout\xE9e${n > 1 ? "s" : ""} (\xE0 confirmer \u2605).`);
          refresh();
        } else if (res == null ? void 0 : res.reason) {
          setSuggestNote(res.reason);
        } else {
          setSuggestNote("Aucune r\xE9currence claire d\xE9tect\xE9e pour l'instant.");
        }
      } catch (e) {
        setSuggestNote("Erreur : " + (e.message || "inconnue"));
      } finally {
        setSuggesting(false);
      }
    };
    const togglePersonal = async (s) => {
      await window.DreamAPI.updateDreamSign(s.id, { is_personal_sign: !s.is_personal_sign });
      refresh();
    };
    const remove = async (id) => {
      if (!confirm("supprimer ce dream sign ?")) return;
      await window.DreamAPI.deleteDreamSign(id);
      refresh();
    };
    const top = signs.slice(0, 30);
    const personal = signs.filter((s) => s.is_personal_sign);
    return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(
      LucidHeader,
      {
        go,
        sub: "dream signs \u2014 \xE9l\xE9ments qui reviennent dans tes r\xEAves. quand tu les vois, ton attention peut basculer en lucidit\xE9."
      }
    ), personal.length > 0 && /* @__PURE__ */ React.createElement(Card, { title: "\u2605 tes dream signs personnels", accent: true }, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      color: T.textDim,
      marginBottom: 12,
      lineHeight: 1.6
    } }, "pour chacun, formule l'intention MILD :", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("em", { style: { color: T.text } }, "\xAB la prochaine fois que je vois [", personal.map((p) => p.sign_label).join(", "), "], je deviens lucide. \xBB")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 8 } }, personal.map((s) => /* @__PURE__ */ React.createElement("span", { key: s.id, style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      color: T.accent,
      padding: "6px 14px",
      borderRadius: 100,
      border: `1px solid ${T.accent}`,
      background: "color-mix(in oklch, var(--silk-gold, #C8A658) 8%, transparent)"
    } }, "\u2605 ", s.sign_label)))), /* @__PURE__ */ React.createElement(Card, { title: "ajouter un dream sign" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8 } }, /* @__PURE__ */ React.createElement(Input, { value: newLabel, onChange: setNewLabel, placeholder: "ex. escaliers, eau, maison d'enfance" }), /* @__PURE__ */ React.createElement(Select, { value: newCat, onChange: setNewCat, options: SIGN_CAT_FR }), /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: add }, "+")), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: suggestIA, disabled: suggesting, style: { fontSize: 12 } }, suggesting ? "analyse en cours\u2026" : "\u2726 proposer 3 suggestions (IA \xB7 30 derniers r\xEAves)"), suggestNote && /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 13,
      color: T.textDim
    } }, suggestNote))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => setShowTuto((v) => !v) }, showTuto ? "\u2191 replier" : "\u2193 pourquoi les dream signs ?")), showTuto && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: T.serif, fontStyle: "italic", fontSize: 15, color: T.text, lineHeight: 1.7, margin: 0 } }, "LaBerge & Tholey ont not\xE9 que la plupart des r\xEAves contiennent des", /* @__PURE__ */ React.createElement("em", { style: { color: T.accent } }, " motifs r\xE9currents "), " propres \xE0 chaque r\xEAveur. Un dream sign, c'est un de ces motifs. Si tu lui d\xE9dies une intention pr\xE9-sommeil \u2014 la pratique ", /* @__PURE__ */ React.createElement("em", null, "MILD"), " \u2014 il devient un d\xE9clencheur de lucidit\xE9 dans le r\xEAve.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), "Marque un dream sign avec ", /* @__PURE__ */ React.createElement("em", null, "\u2605"), " pour le passer en ", /* @__PURE__ */ React.createElement("em", null, "personnel"), " : il sera mis en avant pour ton intention MILD.")), loading && /* @__PURE__ */ React.createElement("div", { style: { color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "chargement\u2026"), !loading && signs.length === 0 && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      color: T.textDim,
      textAlign: "center",
      padding: "16px 0"
    } }, "aucun dream sign d\xE9tect\xE9. ajoute-en un manuellement,", /* @__PURE__ */ React.createElement("br", null), "ou laisse l'extraction automatique faire son travail quand tu d\xE9poses des r\xEAves.")), top.length > 0 && /* @__PURE__ */ React.createElement(Card, { title: `tu vois souvent (${signs.length})` }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0 } }, top.map((s) => {
      var _a;
      return /* @__PURE__ */ React.createElement("div", { key: s.id, style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: `1px solid ${T.border}`,
        gap: 10
      } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => togglePersonal(s), style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: s.is_personal_sign ? T.accent : T.textMuted,
        fontSize: 18,
        padding: 4
      }, "aria-label": "marquer personnel" }, s.is_personal_sign ? "\u2605" : "\u2606"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 16,
        color: T.text
      } }, s.sign_label), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.textDim,
        letterSpacing: "0.06em",
        marginTop: 2
      } }, s.sign_category && /* @__PURE__ */ React.createElement("span", { style: {
        color: CAT_COLOR[s.sign_category] || T.textDim,
        marginRight: 8,
        textTransform: "uppercase"
      } }, ((_a = SIGN_CAT_FR.find((c) => c.value === s.sign_category)) == null ? void 0 : _a.label) || s.sign_category), "\xD7", s.occurrences_count || 1, s.triggered_lucidity_count > 0 && /* @__PURE__ */ React.createElement("span", { style: { color: T.accent, marginLeft: 8 } }, "\xB7 ", s.triggered_lucidity_count, " lucid")))), /* @__PURE__ */ React.createElement(Btn, { danger: true, onClick: () => remove(s.id), style: { padding: "4px 10px", fontSize: 11 } }, "\xD7"));
    })))), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "signs" }));
  };
  const DAYS_FR = [
    { value: "mon", label: "lun" },
    { value: "tue", label: "mar" },
    { value: "wed", label: "mer" },
    { value: "thu", label: "jeu" },
    { value: "fri", label: "ven" },
    { value: "sat", label: "sam" },
    { value: "sun", label: "dim" }
  ];
  const SOUND_PROFILES = [
    { value: "gentle", label: "doux (cloche feutr\xE9e)" },
    { value: "chime", label: "carillon clair" },
    { value: "vibration_only", label: "vibration uniquement" }
  ];
  const LucidWBTBScreen = ({ go }) => {
    const [alarms, setAlarms] = uS([]);
    const [loading, setLoading] = uS(true);
    const [adding, setAdding] = uS(false);
    const [draft, setDraft] = uS(null);
    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.listWBTBAlarms();
        setAlarms((res == null ? void 0 : res.alarms) || []);
      } finally {
        setLoading(false);
      }
    };
    uE(() => {
      refresh();
    }, []);
    const startAdd = () => {
      setDraft({
        bedtime: "23:00",
        wake_time: "04:30",
        back_to_sleep_minutes: 20,
        active_days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        intention_text: "je vais retourner dormir, et je vais reconna\xEEtre que je r\xEAve.",
        sound_profile: "gentle",
        enabled: true
      });
      setAdding(true);
    };
    const save = async () => {
      try {
        await window.DreamAPI.createWBTBAlarm(draft);
        setAdding(false);
        setDraft(null);
        refresh();
      } catch (e) {
        alert("erreur : " + e.message);
      }
    };
    const remove = async (id) => {
      if (!confirm("supprimer cette alarme ?")) return;
      await window.DreamAPI.deleteWBTBAlarm(id);
      refresh();
    };
    const toggleEnabled = async (a) => {
      await window.DreamAPI.updateWBTBAlarm(a.id, { enabled: !a.enabled });
      refresh();
    };
    const toggleDay = (d) => {
      if (!draft) return;
      const days = draft.active_days.includes(d) ? draft.active_days.filter((x) => x !== d) : [...draft.active_days, d];
      setDraft({ ...draft, active_days: days });
    };
    return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(
      LucidHeader,
      {
        go,
        sub: "WBTB (Wake Back To Bed) \u2014 r\xE9veille-toi 4\u20136h apr\xE8s l'endormissement, reste lucide 15\u201330 min, retourne dormir avec une intention."
      }
    ), /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: startAdd, style: { marginBottom: 20 } }, "+ cr\xE9er une alarme"), adding && draft && /* @__PURE__ */ React.createElement(Card, { title: "nouvelle alarme WBTB", accent: true }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement(Field, { label: "heure de coucher" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "time",
        value: draft.bedtime,
        onChange: (v) => setDraft({ ...draft, bedtime: v })
      }
    )), /* @__PURE__ */ React.createElement(
      Field,
      {
        label: "r\xE9veil WBTB",
        hint: "souvent 4h30\u20136h apr\xE8s le coucher (pendant un cycle REM tardif)."
      },
      /* @__PURE__ */ React.createElement(
        Input,
        {
          type: "time",
          value: draft.wake_time,
          onChange: (v) => setDraft({ ...draft, wake_time: v })
        }
      )
    )), /* @__PURE__ */ React.createElement(
      Slider,
      {
        label: "rester \xE9veill\xE9",
        valueLabel: `${draft.back_to_sleep_minutes} min`,
        value: draft.back_to_sleep_minutes,
        onChange: (v) => setDraft({ ...draft, back_to_sleep_minutes: v }),
        min: 5,
        max: 45,
        step: 5
      }
    ), /* @__PURE__ */ React.createElement(
      Field,
      {
        label: "texte d'intention",
        hint: "ce que tu vas te r\xE9p\xE9ter en retournant dormir."
      },
      /* @__PURE__ */ React.createElement(
        "textarea",
        {
          value: draft.intention_text,
          onChange: (e) => setDraft({ ...draft, intention_text: e.target.value }),
          style: {
            width: "100%",
            minHeight: 60,
            background: T.bg,
            border: `1px solid ${T.border}`,
            color: T.text,
            fontFamily: T.serif,
            fontStyle: "italic",
            fontSize: 15,
            padding: 12,
            outline: "none",
            resize: "vertical",
            borderRadius: 0
          }
        }
      )
    ), /* @__PURE__ */ React.createElement(Field, { label: "son" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: draft.sound_profile,
        onChange: (v) => setDraft({ ...draft, sound_profile: v }),
        options: SOUND_PROFILES
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "jours actifs" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, DAYS_FR.map((d) => /* @__PURE__ */ React.createElement(
      Chip,
      {
        key: d.value,
        active: draft.active_days.includes(d.value),
        onClick: () => toggleDay(d.value)
      },
      d.label
    )))), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 12,
      marginBottom: 4,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 12,
      color: T.textMuted,
      lineHeight: 1.5
    } }, "note : le d\xE9clenchement r\xE9el demande l'app native (Capacitor + notifications locales). en web, l'alarme reste en m\xE9moire ; active les notifications natives quand tu installes Dream comme app."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 16 } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: save }, "cr\xE9er l'alarme"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => {
      setAdding(false);
      setDraft(null);
    } }, "annuler"))), loading && /* @__PURE__ */ React.createElement("div", { style: { color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "chargement\u2026"), !loading && alarms.length === 0 && !adding && /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      color: T.textDim,
      textAlign: "center",
      padding: "16px 0"
    } }, "aucune alarme WBTB. la pratique demande de la r\xE9gularit\xE9 \u2014", /* @__PURE__ */ React.createElement("br", null), "commence par 1 ou 2 nuits par semaine.")), alarms.map((a) => {
      var _a;
      return /* @__PURE__ */ React.createElement(Card, { key: a.id }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 17,
        color: T.text,
        marginBottom: 6
      } }, "coucher ", a.bedtime, " \u2192 r\xE9veil ", /* @__PURE__ */ React.createElement("span", { style: { color: T.accent } }, a.wake_time)), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.mono,
        fontSize: 11,
        color: T.textDim,
        letterSpacing: "0.04em"
      } }, a.back_to_sleep_minutes, " min \xE9veill\xE9 \xB7 ", (a.active_days || []).map((d) => {
        const x = DAYS_FR.find((y) => y.value === d);
        return x ? x.label : d;
      }).join(", "), a.sound_profile && ` \xB7 ${((_a = SOUND_PROFILES.find((s) => s.value === a.sound_profile)) == null ? void 0 : _a.label) || a.sound_profile}`), a.intention_text && /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 13,
        color: T.textDim,
        marginTop: 8,
        lineHeight: 1.5,
        borderLeft: `2px solid ${T.border}`,
        paddingLeft: 10
      } }, "\xAB ", a.intention_text, " \xBB"), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.mono,
        fontSize: 10,
        color: T.accent,
        marginTop: 8,
        letterSpacing: "0.06em"
      } }, a.triggered_count || 0, " d\xE9clenchements \xB7 ", a.resulted_in_lucid_count || 0, " lucides")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Btn, { primary: !!a.enabled, onClick: () => toggleEnabled(a), style: { padding: "6px 12px", fontSize: 12 } }, a.enabled ? "actif" : "off"), /* @__PURE__ */ React.createElement(Btn, { danger: true, onClick: () => remove(a.id), style: { padding: "6px 10px", fontSize: 12 } }, "\xD7"))));
    })), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "wbtb" }));
  };
  const TECH_FR_LABELS = {
    DILD: "DILD",
    MILD: "MILD",
    WILD: "WILD",
    SSILD: "SSILD",
    WBTB: "WBTB",
    spontaneous: "spontan\xE9",
    none: "non not\xE9",
    unknown: "\u2014"
  };
  const LucidDashboardScreen = ({ go }) => {
    const [stats, setStats] = uS(null);
    const [loading, setLoading] = uS(true);
    const [exporting, setExporting] = uS(false);
    const [letter, setLetter] = uS(null);
    const [letterLoading, setLetterLoading] = uS(false);
    uE(() => {
      (async () => {
        try {
          const res = await window.DreamAPI.getLucidStats();
          setStats((res == null ? void 0 : res.stats) || null);
        } finally {
          setLoading(false);
        }
      })();
    }, []);
    const fetchLetter = async (force) => {
      setLetterLoading(true);
      try {
        const res = await window.DreamAPI.getLucidPracticeLetter({ force: !!force });
        setLetter(res || null);
      } catch (e) {
        alert("erreur lettre : " + (e.message || "inconnue"));
      } finally {
        setLetterLoading(false);
      }
    };
    if (loading) {
      return /* @__PURE__ */ React.createElement(Stage, null, /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(LucidHeader, { go }), /* @__PURE__ */ React.createElement("div", { style: { color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "chargement des stats\u2026")), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "stats" }));
    }
    const s = stats || {};
    const exportObsidian = async (format) => {
      setExporting(true);
      try {
        const md = await window.DreamAPI.exportObsidian();
        const ext = format === "json" ? "json" : "md";
        const mime = format === "json" ? "application/json" : "text/markdown";
        const blob = new Blob([md], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dream-lucid-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (e) {
        alert("export impossible : " + e.message);
      } finally {
        setExporting(false);
      }
    };
    return /* @__PURE__ */ React.createElement(Stage, null, window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      position: "fixed",
      top: "30vh",
      left: "50%",
      transform: "translateX(-50%)",
      width: "min(420px, 85vw)",
      height: "min(420px, 85vw)",
      opacity: 0.1,
      pointerEvents: "none",
      zIndex: 0
    } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "ember" })), /* @__PURE__ */ React.createElement(Frame, null, /* @__PURE__ */ React.createElement(
      LucidHeader,
      {
        go,
        sub: "ces chiffres sont pour toi. il n'y a pas de classement, pas de comparaison avec d'autres r\xEAveurs."
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(Stat, { label: "total lucides", value: s.total_lucid_dreams || 0 }), /* @__PURE__ */ React.createElement(
      Stat,
      {
        label: "taux de rappel",
        value: (s.recall_rate_pct || 0) + "%",
        hint: `${s.total_dreams || 0} r\xEAves not\xE9s`
      }
    ), /* @__PURE__ */ React.createElement(
      Stat,
      {
        label: "cette semaine",
        value: s.current_streak_per_week || 0,
        hint: "meilleur 7 jours : " + (s.best_streak_in_7d_window || 0)
      }
    ), /* @__PURE__ */ React.createElement(Stat, { label: "dream signs", value: s.signs_count || 0 })), /* @__PURE__ */ React.createElement(Card, { title: "indice de lucidit\xE9 \u2014 30 derniers jours", accent: true }, /* @__PURE__ */ React.createElement(LucidLineGraph, { data: s.recent_lucid_per_day || [] })), /* @__PURE__ */ React.createElement(Card, { title: "technique par fr\xE9quence" }, Object.keys(s.technique_breakdown || {}).length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontStyle: "italic", color: T.textDim } }, "pas encore de donn\xE9es \u2014 ajoute la m\xE9tadonn\xE9e lucide \xE0 un r\xEAve.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, Object.entries(s.technique_breakdown || {}).sort((a, b) => b[1] - a[1]).map(([t, n]) => {
      const max = Math.max(...Object.values(s.technique_breakdown || {}).map(Number));
      const pct = max > 0 ? Math.round(Number(n) / max * 100) : 0;
      return /* @__PURE__ */ React.createElement("div", { key: t }, /* @__PURE__ */ React.createElement("div", { style: {
        display: "flex",
        justifyContent: "space-between",
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 14,
        color: T.text,
        marginBottom: 3
      } }, /* @__PURE__ */ React.createElement("span", null, TECH_FR_LABELS[t] || t), /* @__PURE__ */ React.createElement("span", { style: { color: T.accent, fontFamily: T.mono, fontStyle: "normal", fontSize: 12 } }, n)), /* @__PURE__ */ React.createElement("div", { style: { height: 4, background: T.border } }, /* @__PURE__ */ React.createElement("div", { style: {
        height: "100%",
        width: pct + "%",
        background: T.accent,
        opacity: 0.7,
        transition: "width 480ms ease"
      } })));
    }))), /* @__PURE__ */ React.createElement(Card, { title: "\u2726 lettre de pratique \xB7 90 derniers jours", accent: true }, !letter && !letterLoading && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      color: T.textDim,
      marginBottom: 14,
      lineHeight: 1.6
    } }, "une lettre narrative \xE9crite pour toi \xE0 partir de ta pratique r\xE9cente. pas de scores, pas de chiffres \u2014 juste ce qui revient, ce qui se tient. r\xE9g\xE9n\xE9r\xE9e tous les 14 jours."), /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => fetchLetter(false) }, "recevoir ma lettre")), letterLoading && /* @__PURE__ */ React.createElement("div", { className: "breath", style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      color: T.textDim
    } }, "la lettre s'\xE9crit\u2026"), letter && letter.letter && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 16,
      color: T.text,
      lineHeight: 1.75,
      whiteSpace: "pre-wrap",
      borderLeft: `2px solid ${T.accent}`,
      paddingLeft: 18
    } }, letter.letter), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 14,
      display: "flex",
      gap: 10,
      alignItems: "center",
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: "0.06em"
    } }, /* @__PURE__ */ React.createElement("span", null, letter.cached ? "lettre en cache" : "fra\xEEchement \xE9crite"), /* @__PURE__ */ React.createElement("span", null, "\xB7"), /* @__PURE__ */ React.createElement("span", null, letter.word_count || "?", " mots"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: () => fetchLetter(true), style: { marginLeft: "auto", fontSize: 11 } }, "r\xE9g\xE9n\xE9rer")))), /* @__PURE__ */ React.createElement(Card, { title: "dream signs \xB7 top 10" }, (s.top_signs || []).length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontStyle: "italic", color: T.textDim } }, "aucun dream sign d\xE9tect\xE9 pour l'instant.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, (s.top_signs || []).map((sig, i) => /* @__PURE__ */ React.createElement("div", { key: sig.id, style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 15,
      color: T.text,
      padding: "6px 0",
      borderBottom: i < s.top_signs.length - 1 ? `1px solid ${T.border}` : "none"
    } }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { style: { color: T.textDim, marginRight: 8, fontFamily: T.mono, fontStyle: "normal", fontSize: 11 } }, String(i + 1).padStart(2, "0")), sig.sign_label), /* @__PURE__ */ React.createElement("span", { style: { color: T.accent, fontFamily: T.mono, fontStyle: "normal", fontSize: 12 } }, "\xD7", sig.occurrences_count, sig.triggered_lucidity_count > 0 && ` \xB7 ${sig.triggered_lucidity_count}L`))))), /* @__PURE__ */ React.createElement(Card, { title: "exporter" }, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      color: T.textDim,
      marginBottom: 14,
      lineHeight: 1.6
    } }, "r\xE9cup\xE8re tout ton historique lucide (r\xEAves + m\xE9tadonn\xE9es + dream signs) dans un format r\xE9utilisable ailleurs."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: () => exportObsidian("md"), disabled: exporting }, exporting ? "\u2026" : "Markdown (Obsidian)"), /* @__PURE__ */ React.createElement(Btn, { onClick: () => exportObsidian("json"), disabled: exporting }, "JSON")))), /* @__PURE__ */ React.createElement(LucidTabs, { go, current: "stats" }));
  };
  function Stat({ label, value, hint }) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      background: T.bgSoft,
      border: `1px solid ${T.border}`,
      padding: "16px 18px"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10,
      color: T.textDim,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginBottom: 6
    } }, label), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontSize: 28,
      color: T.accent,
      fontStyle: "normal",
      lineHeight: 1,
      marginBottom: 4
    } }, value), hint && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 12,
      color: T.textDim
    } }, hint));
  }
  function LucidLineGraph({ data }) {
    if (!data || data.length === 0) {
      return /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontStyle: "italic", color: T.textDim, padding: "12px 0" } }, "pas encore de donn\xE9es.");
    }
    const W = 520, H = 120, P = 8;
    const max = Math.max(1, ...data.map((d) => d.count || 0));
    const stepX = (W - P * 2) / Math.max(1, data.length - 1);
    const points = data.map((d, i) => {
      const x = P + i * stepX;
      const y = H - P - (d.count || 0) / max * (H - P * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${W} ${H}`, style: { width: "100%", height: 120, display: "block" } }, /* @__PURE__ */ React.createElement("line", { x1: P, y1: H - P, x2: W - P, y2: H - P, stroke: T.border, strokeWidth: "0.6" }), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "lucidGrad", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "var(--silk-gold, #C8A658)", stopOpacity: "0.32" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "var(--silk-gold, #C8A658)", stopOpacity: "0" }))), /* @__PURE__ */ React.createElement(
      "polygon",
      {
        fill: "url(#lucidGrad)",
        points: `${P},${H - P} ${points} ${W - P},${H - P}`
      }
    ), /* @__PURE__ */ React.createElement("polyline", { fill: "none", stroke: "var(--silk-gold, #C8A658)", strokeWidth: "1.4", points }), data.map((d, i) => {
      if (!d.count) return null;
      const x = P + i * stepX;
      const y = H - P - d.count / max * (H - P * 2);
      return /* @__PURE__ */ React.createElement("circle", { key: i, cx: x, cy: y, r: "2.4", fill: "var(--silk-gold, #C8A658)" });
    }));
  }
  const TECHNIQUE_FR_OPTS = [
    { value: "none", label: "\u2014" },
    { value: "DILD", label: "DILD (spontan\xE9)" },
    { value: "MILD", label: "MILD (intention)" },
    { value: "WILD", label: "WILD (passage conscient)" },
    { value: "SSILD", label: "SSILD (cycle des sens)" },
    { value: "WBTB", label: "WBTB" },
    { value: "spontaneous", label: "spontan\xE9" }
  ];
  const LucidKairosMetadataModal = ({ kairosId, kairosText, onClose, onSaved }) => {
    const [m, setM] = uS({
      lucidity_score: 0,
      lucidity_technique: "none",
      stability_score: 0,
      control_score: 0,
      false_awakening_count: 0,
      reality_check_performed: false,
      signs_recognized: [],
      pre_sleep_intention: "",
      notes_technique: "",
      rem_cycle_estimate: 0,
      hours_slept: 0
    });
    const [signsAvailable, setSignsAvailable] = uS([]);
    const [saving, setSaving] = uS(false);
    const [extracting, setExtracting] = uS(false);
    uE(() => {
      (async () => {
        try {
          const res = await window.DreamAPI.listDreamSigns();
          setSignsAvailable((res == null ? void 0 : res.dream_signs) || []);
        } catch (e) {
        }
      })();
    }, []);
    const toggleSign = (label) => {
      const next = m.signs_recognized.includes(label) ? m.signs_recognized.filter((s) => s !== label) : [...m.signs_recognized, label];
      setM({ ...m, signs_recognized: next });
    };
    const save = async () => {
      setSaving(true);
      try {
        await window.DreamAPI.attachLucidMetadata(kairosId, m);
        if (onSaved) onSaved();
        onClose && onClose();
      } catch (e) {
        alert("erreur : " + e.message);
      } finally {
        setSaving(false);
      }
    };
    const extractSigns = async () => {
      setExtracting(true);
      try {
        const res = await window.DreamAPI.extractDreamSigns(kairosId);
        const newSigns = (res == null ? void 0 : res.dream_signs) || [];
        setSignsAvailable((prev) => {
          const ids = new Set(prev.map((s) => s.id));
          const merged = [...prev];
          for (const s of newSigns) if (!ids.has(s.id)) merged.push(s);
          return merged;
        });
        if (newSigns.length === 0) alert("aucun nouveau dream sign d\xE9tect\xE9.");
      } catch (e) {
        alert("erreur : " + e.message);
      } finally {
        setExtracting(false);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.78)",
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      fontFamily: T.sans
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: T.bg,
      border: `1px solid ${T.border}`,
      maxWidth: 520,
      width: "100%",
      maxHeight: "90vh",
      overflowY: "auto",
      padding: 24,
      color: T.text
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 18
    } }, /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontWeight: 300,
      fontSize: 22,
      color: T.accent,
      margin: 0
    } }, "annoter ce r\xEAve"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: {
      background: "transparent",
      border: "none",
      color: T.textDim,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 22,
      cursor: "pointer",
      padding: 4
    } }, "\xD7")), /* @__PURE__ */ React.createElement(
      Slider,
      {
        label: "lucidit\xE9",
        value: m.lucidity_score,
        onChange: (v) => setM({ ...m, lucidity_score: v }),
        min: 0,
        max: 5,
        valueLabel: `${m.lucidity_score}/5`
      }
    ), /* @__PURE__ */ React.createElement(Field, { label: "technique" }, /* @__PURE__ */ React.createElement(
      Select,
      {
        value: m.lucidity_technique,
        onChange: (v) => setM({ ...m, lucidity_technique: v }),
        options: TECHNIQUE_FR_OPTS
      }
    )), /* @__PURE__ */ React.createElement(
      Slider,
      {
        label: "stabilit\xE9",
        value: m.stability_score,
        onChange: (v) => setM({ ...m, stability_score: v }),
        min: 0,
        max: 5,
        valueLabel: `${m.stability_score}/5`
      }
    ), /* @__PURE__ */ React.createElement(
      Slider,
      {
        label: "contr\xF4le",
        value: m.control_score,
        onChange: (v) => setM({ ...m, control_score: v }),
        min: 0,
        max: 5,
        valueLabel: `${m.control_score}/5`
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 } }, /* @__PURE__ */ React.createElement(Field, { label: "cycle REM (estim.)" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "number",
        value: m.rem_cycle_estimate,
        onChange: (v) => setM({ ...m, rem_cycle_estimate: parseInt(v, 10) || 0 })
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "heures de sommeil" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "number",
        value: m.hours_slept,
        onChange: (v) => setM({ ...m, hours_slept: parseFloat(v) || 0 })
      }
    ))), /* @__PURE__ */ React.createElement(
      Toggle,
      {
        on: m.reality_check_performed,
        onClick: () => setM({ ...m, reality_check_performed: !m.reality_check_performed }),
        label: "reality check fait dans le r\xEAve"
      }
    ), /* @__PURE__ */ React.createElement(Field, { label: "faux r\xE9veils" }, /* @__PURE__ */ React.createElement(
      Input,
      {
        type: "number",
        value: m.false_awakening_count,
        onChange: (v) => setM({ ...m, false_awakening_count: parseInt(v, 10) || 0 })
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "signs reconnus" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontFamily: T.serif, fontStyle: "italic", color: T.textDim, fontSize: 13 } }, "tap pour cocher"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: extractSigns, disabled: extracting, style: { padding: "4px 10px", fontSize: 12 } }, extracting ? "\u2026" : "+ extraction NLP")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } }, signsAvailable.length === 0 && /* @__PURE__ */ React.createElement("span", { style: { fontFamily: T.serif, fontStyle: "italic", color: T.textMuted, fontSize: 13 } }, "aucun sign \u2014 utilise l'extraction NLP."), signsAvailable.map((s) => /* @__PURE__ */ React.createElement(
      Chip,
      {
        key: s.id,
        active: m.signs_recognized.includes(s.sign_label),
        onClick: () => toggleSign(s.sign_label)
      },
      s.sign_label
    )))), /* @__PURE__ */ React.createElement(Field, { label: "intention pr\xE9-sommeil (MILD)" }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: m.pre_sleep_intention,
        onChange: (e) => setM({ ...m, pre_sleep_intention: e.target.value }),
        placeholder: "\xAB la prochaine fois que je vois\u2026 \xBB",
        style: {
          width: "100%",
          minHeight: 56,
          background: T.bg,
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          padding: 10,
          outline: "none",
          resize: "vertical",
          borderRadius: 0
        }
      }
    )), /* @__PURE__ */ React.createElement(Field, { label: "notes" }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: m.notes_technique,
        onChange: (e) => setM({ ...m, notes_technique: e.target.value }),
        style: {
          width: "100%",
          minHeight: 50,
          background: T.bg,
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          padding: 10,
          outline: "none",
          resize: "vertical",
          borderRadius: 0
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 18 } }, /* @__PURE__ */ React.createElement(Btn, { primary: true, onClick: save, disabled: saving }, saving ? "\u2026" : "enregistrer"), /* @__PURE__ */ React.createElement(Btn, { ghost: true, onClick: onClose }, "annuler"))));
  };
  window.LucidProfileScreen = LucidProfileScreen;
  window.LucidDashboardScreen = LucidDashboardScreen;
  window.LucidRealityChecksScreen = LucidRealityChecksScreen;
  window.LucidDreamSignsScreen = LucidDreamSignsScreen;
  window.LucidWBTBScreen = LucidWBTBScreen;
  window.LucidKairosMetadataModal = LucidKairosMetadataModal;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1sdWNpZC5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCwgd2luZG93ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIEx1Y2lkIERyZWFtIFx1MjAxNCBzb3VzLWFwcCByZWZvbnRlIDIwMjYtMDQtMjggKFllc2h1YSlcbi8vXG4vLyBBdmFudCAoMjAyNi0wNC0yNikgOiBlc3RoXHUwMEU5dGlxdWUgZGFyayBtb25vc3BhY2UgcHVyZSwgRU4sIGp1Z1x1MDBFOWVcbi8vIFwiY2hlbG91LCBpbmNvbXByXHUwMEU5aGVuc2libGUsIG1vY2hlXCIgcGFyIFRpbS4gQUJBTkRPTk5cdTAwQzkuXG4vL1xuLy8gTWFpbnRlbmFudCA6IGdyYW1tYWlyZSB2aXN1ZWxsZSBEcmVhbSBtYWluIChuaWdodC13YXJtICsgRUIgR2FyYW1vbmRcbi8vIGl0YWxpYyArIGNoaXBzIHNpbGstZ29sZCArIGhhbG9zIHJlc3BpcmFudHMpLiAxMDAlIGZyYW5cdTAwRTdhaXMuXG4vLyBWb2NhYnVsYWlyZSB0ZWNobmlxdWUgTGFCZXJnZS9UaG9sZXkgaW50cm9kdWl0IGVuIGRvdWNldXIuXG4vL1xuLy8gU3RydWN0dXJlIDogc291cy1hcHAgXHUwMEUwIDUgb25nbGV0cyAobVx1MDBFQW1lcyByb3V0ZXMgcXUnYXZhbnQsIG9uIGdhcmRlXG4vLyBsZSByb3V0aW5nIGFwcC5qc3gpICsgb25ib2FyZGluZyAzIFx1MDBFOWNyYW5zIHJpdHVlbHMgRlIgKyBmZWF0dXJlc1xuLy8gTC4xXHUyMDEzTC42IChSQyBjb250ZXh0dWVscywgZHJlYW0gc2lnbnMgXHUyNjA1IE1JTEQsIFdCVEIgaW50ZW50aW9uLCBzdGF0c1xuLy8gZ3JhcGhlcyBzaW1wbGVzICsgZXhwb3J0LCBlbnRyeSBodWIgYXZlYyAzIHByb3Bvc2l0aW9ucyBkZSBsYXlvdXQpLlxuLy9cbi8vIFBlcnNvbmEgOiBwcmF0aXF1YW50IGx1Y2lkZSBjdXJpZXV4LCBGUi4gVGVjaG5pcXVlcyBub21tXHUwMEU5ZXMgKERJTEQvTUlMRFxuLy8gL1dCVEIvU1NJTEQvV0lMRCkgaW50cm9kdWl0ZXMgYXUgbW9tZW50IG9cdTAwRjkgZWxsZXMgc2VydmVudC5cbi8vXG4vLyBBbnRpLWdhbWlmaWNhdGlvbiA6IHBhcyBkZSBsZWFkZXJib2FyZCwgcGFzIGRlIFwidnMgYXV0cmVzXCIuIFN0YXRzXG4vLyBwb3VyIHNvaS4gQ2YuIDJfREVTSUdOIFx1MDBBNzcuMTAuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuKGZ1bmN0aW9uIHNldHVwTHVjaWRTY3JlZW5zKCkge1xuICBjb25zdCB7IHVzZVN0YXRlOiB1UywgdXNlRWZmZWN0OiB1RSwgdXNlUmVmOiB1UiwgdXNlTWVtbzogdU0gfSA9IFJlYWN0O1xuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBUb2tlbnMgXHUyMDE0IGFsaWduXHUwMEU5cyBEcmVhbSBtYWluIChuaWdodC13YXJtICsgc2VyaWYgaXRhbGljICsgc2lsay1nb2xkKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gT24gbGl0IGxlcyBDU1MgdmFycyBxdWFuZCBvbiBwZXV0LCBmYWxsYmFjayBzaW5vbi5cbiAgY29uc3QgVCA9IHtcbiAgICBiZzogICAgICAgXCJ2YXIoLS1uaWdodC13YXJtLCAjMTUxMzBGKVwiLFxuICAgIGJnRmxvb3I6ICBcInZhcigtLW5pZ2h0LWZsb29yLCAjMEUwRjE0KVwiLFxuICAgIGJnU29mdDogICBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcGFwZXItd2FybSwgI0I4OUU3QykgNiUsIHRyYW5zcGFyZW50KVwiLFxuICAgIGJvcmRlcjogICBcInZhcigtLWFzaC1kZWVwLCAjMUYyMDI1KVwiLFxuICAgIGJvcmRlckFjdGl2ZTogXCJ2YXIoLS1zaWxrLWdvbGQsICNDOEE2NTgpXCIsXG4gICAgdGV4dDogICAgIFwidmFyKC0tYm9uZSwgI0M0QjlBRClcIixcbiAgICB0ZXh0RGltOiAgXCJ2YXIoLS1hc2gtbGlnaHQsICM1QzU4NTQpXCIsXG4gICAgdGV4dE11dGVkOlwidmFyKC0tYXNoLW1pZCwgIzM2MzQzMClcIixcbiAgICBhY2NlbnQ6ICAgXCJ2YXIoLS1zaWxrLWdvbGQsICNDOEE2NTgpXCIsXG4gICAgZW1iZXI6ICAgIFwidmFyKC0tZW1iZXItbGl2ZSwgI0M0NkIzRClcIixcbiAgICBkYW5nZXI6ICAgXCJ2YXIoLS1jbGF5LWVhcnRoLCAjOEM1QzNCKVwiLFxuICAgIHNlcmlmOiAgICBcInZhcigtLXNlcmlmLCAnRUIgR2FyYW1vbmQnLCBHYXJhbW9uZCwgc2VyaWYpXCIsXG4gICAgc2FuczogICAgIFwidmFyKC0tc2FucywgSW50ZXIsIHN5c3RlbS11aSwgc2Fucy1zZXJpZilcIixcbiAgICBtb25vOiAgICAgXCJ2YXIoLS1tb25vLCAnSmV0QnJhaW5zIE1vbm8nLCB1aS1tb25vc3BhY2UsIG1vbm9zcGFjZSlcIixcbiAgfTtcblxuICAvLyBcdTI1MDBcdTI1MDAgUHJpbWl0aXZlcyB2aXN1ZWxsZXMgKERyZWFtIG1haW4gYWVzdGhldGljKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgZnVuY3Rpb24gU3RhZ2UoeyBjaGlsZHJlbiwgc3R5bGUgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7XG4gICAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgICBiYWNrZ3JvdW5kOiBULmJnRmxvb3IsXG4gICAgICAgIGNvbG9yOiBULnRleHQsXG4gICAgICAgIGZvbnRGYW1pbHk6IFQuc2FucyxcbiAgICAgICAgZm9udFNpemU6IDE1LFxuICAgICAgICBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICBwYWRkaW5nOiBcIjAgMCAxMDBweFwiLFxuICAgICAgICAuLi5zdHlsZSxcbiAgICAgIH19PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gRnJhbWUoeyBjaGlsZHJlbiB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJhbWVcIiBzdHlsZT17e1xuICAgICAgICBtYXhXaWR0aDogNzIwLCBtYXJnaW46IFwiMCBhdXRvXCIsIHBhZGRpbmc6IFwiMjRweCAyNHB4IDQ4cHhcIixcbiAgICAgIH19PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgLy8gSGVhZGVyIHN1Yi1hcHAgXHUyMDE0IGdseXBoZSBcdTI1RDAgKyB0aXRsZSBpdGFsaWNcbiAgLy8gMjAyNi0wNC0yOSAoWWVzaHVhKSA6IGFqb3V0IGNyb2lzc2FudCBsdW5haXJlIFNWRyBmaW4gYXUtZGVzc3VzLCBhbmltYXRpb25cbiAgLy8gYnJlYXRoZS1zb3VmZmxlIDZzLCBvcGFjaXR5IDAuNTUuIFZpc3VlbCBzYWNyXHUwMEU5IHN1YnRpbCBwb3VyIG9uZ2xldCBwcmF0aXF1ZS5cbiAgZnVuY3Rpb24gTHVjaWRIZWFkZXIoeyBnbywgc3ViIH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDMyIH19PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJleHBsb3JlclwiKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLFxuICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMFwiLFxuICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgey8qIENyb2lzc2FudCBsdW5haXJlIGZpbiBTVkcgXHUyMDE0IFllc2h1YSAyMDI2LTA0LTI5ICovfVxuICAgICAgICB7d2luZG93Lkdlb1N5bWJvbCAmJiAoXG4gICAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImZsZXgtc3RhcnRcIixcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTQsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHdpZHRoOiAzMCwgaGVpZ2h0OiAzMCwgb3BhY2l0eTogMC41NSxcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImJyZWF0aGUtc291ZmZsZSA2cyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDx3aW5kb3cuR2VvU3ltYm9sIGtpbmQ9XCJjcm9pc3NhbnRcIiBjb2xvcj1cImJvbmVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHdpZHRoOiAzMCwgaGVpZ2h0OiAzMCwgb3BhY2l0eTogMSB9fSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxuICAgICAgICAgIGNvbG9yOiBULmFjY2VudCwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICB9fT5cbiAgICAgICAgICBcdTI1RDAgJm5ic3A7bHVjaWQgXHUwMEI3IHRvbiB0ZXJyYWluIGRlIHByYXRpcXVlXG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7c3ViICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIGNvbG9yOiBULnRleHREaW0sIG1heFdpZHRoOiA1NDAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7c3VifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIC8vIENhcmQgcGFuZWwgXHUyMDE0IHBhcyBkZSBib3JkdXJlIGR1cmUsIGp1c3RlIHVuIHZvaWxlXG4gIGZ1bmN0aW9uIENhcmQoeyBjaGlsZHJlbiwgdGl0bGUsIGFjY2VudCwgc3R5bGUgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8c2VjdGlvbiBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBULmJnU29mdCxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7VC5ib3JkZXJ9YCxcbiAgICAgICAgcGFkZGluZzogXCIyMHB4IDIycHhcIixcbiAgICAgICAgbWFyZ2luQm90dG9tOiAyMCxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAuLi5zdHlsZSxcbiAgICAgIH19PlxuICAgICAgICB7dGl0bGUgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xNGVtXCIsXG4gICAgICAgICAgICBjb2xvcjogYWNjZW50ID8gVC5hY2NlbnQgOiBULnRleHREaW0sXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAxNCxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9zZWN0aW9uPlxuICAgICk7XG4gIH1cblxuICAvLyBCb3V0b24gXHUyMDE0IGNoaXAtbGlrZVxuICBmdW5jdGlvbiBCdG4oeyBjaGlsZHJlbiwgb25DbGljaywgcHJpbWFyeSwgZ2hvc3QsIGRhbmdlciwgZGlzYWJsZWQsIHN0eWxlIH0pIHtcbiAgICBsZXQgY29sb3IgPSBULnRleHQ7XG4gICAgbGV0IGJvcmRlciA9IFQuYm9yZGVyO1xuICAgIGxldCBiZyA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICBpZiAocHJpbWFyeSkgeyBjb2xvciA9IFQuYWNjZW50OyBib3JkZXIgPSBULmFjY2VudDsgYmcgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkLCAjQzhBNjU4KSA4JSwgdHJhbnNwYXJlbnQpXCI7IH1cbiAgICBlbHNlIGlmIChnaG9zdCkgeyBjb2xvciA9IFQudGV4dERpbTsgYm9yZGVyID0gXCJ0cmFuc3BhcmVudFwiOyB9XG4gICAgZWxzZSBpZiAoZGFuZ2VyKSB7IGNvbG9yID0gVC5kYW5nZXI7IGJvcmRlciA9IFQuZGFuZ2VyOyB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gb25DbGljaz17b25DbGlja30gZGlzYWJsZWQ9e2Rpc2FibGVkfSBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBiZyxcbiAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7Ym9yZGVyfWAsXG4gICAgICAgIGNvbG9yOiBkaXNhYmxlZCA/IFQudGV4dE11dGVkIDogY29sb3IsXG4gICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsXG4gICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICBwYWRkaW5nOiBcIjEwcHggMThweFwiLFxuICAgICAgICBjdXJzb3I6IGRpc2FibGVkID8gXCJub3QtYWxsb3dlZFwiIDogXCJwb2ludGVyXCIsXG4gICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgIG9wYWNpdHk6IGRpc2FibGVkID8gMC40IDogMSxcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAyODBtcyBlYXNlXCIsXG4gICAgICAgIC4uLnN0eWxlLFxuICAgICAgfX0+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cblxuICAvLyBDaGlwIFx1MjAxNCBwb3VyIHF1YWxpZiBvbmJvYXJkaW5nICsgZmlsdHJlc1xuICBmdW5jdGlvbiBDaGlwKHsgY2hpbGRyZW4sIGFjdGl2ZSwgb25DbGljaywgc3R5bGUgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xpY2t9IHN0eWxlPXt7XG4gICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVxuICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCwgI0M4QTY1OCkgMTAlLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHthY3RpdmUgPyBULmFjY2VudCA6IFQuYm9yZGVyfWAsXG4gICAgICAgIGNvbG9yOiBhY3RpdmUgPyBULmFjY2VudCA6IFQudGV4dERpbSxcbiAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZixcbiAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgIHBhZGRpbmc6IFwiOHB4IDE2cHhcIixcbiAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxMDAsXG4gICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgLi4uc3R5bGUsXG4gICAgICB9fT5cbiAgICAgICAge2NoaWxkcmVufVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEZpZWxkKHsgbGFiZWwsIGNoaWxkcmVuLCBoaW50IH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE2IH19PlxuICAgICAgICB7bGFiZWwgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDEwLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA2LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIHtoaW50ICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIGNvbG9yOiBULnRleHRNdXRlZCwgbWFyZ2luVG9wOiA2LCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7aGludH1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBJbnB1dCh7IHZhbHVlLCBvbkNoYW5nZSwgcGxhY2Vob2xkZXIsIHR5cGUgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8aW5wdXRcbiAgICAgICAgdHlwZT17dHlwZSB8fCBcInRleHRcIn1cbiAgICAgICAgdmFsdWU9e3ZhbHVlIHx8IFwiXCJ9XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gb25DaGFuZ2UoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFQuYmcsXG4gICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7VC5ib3JkZXJ9YCxcbiAgICAgICAgICBjb2xvcjogVC50ZXh0LFxuICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2FucywgZm9udFNpemU6IDE1LFxuICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxNHB4XCIsXG4gICAgICAgICAgb3V0bGluZTogXCJub25lXCIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICB9fVxuICAgICAgICBvbkZvY3VzPXsoZSkgPT4gKGUudGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gVC5hY2NlbnQpfVxuICAgICAgICBvbkJsdXI9eyhlKSA9PiAoZS50YXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBULmJvcmRlcil9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBTZWxlY3QoeyB2YWx1ZSwgb25DaGFuZ2UsIG9wdGlvbnMgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8c2VsZWN0XG4gICAgICAgIHZhbHVlPXt2YWx1ZSB8fCBcIlwifVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgYmFja2dyb3VuZDogVC5iZyxcbiAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgIGNvbG9yOiBULnRleHQsXG4gICAgICAgICAgZm9udEZhbWlseTogVC5zYW5zLCBmb250U2l6ZTogMTUsXG4gICAgICAgICAgcGFkZGluZzogXCIxMHB4IDE0cHhcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgb3V0bGluZTogXCJub25lXCIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtvcHRpb25zLm1hcCgobykgPT4gKFxuICAgICAgICAgIDxvcHRpb24ga2V5PXtvLnZhbHVlfSB2YWx1ZT17by52YWx1ZX0+e28ubGFiZWx9PC9vcHRpb24+XG4gICAgICAgICkpfVxuICAgICAgPC9zZWxlY3Q+XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIFRvZ2dsZSh7IG9uLCBvbkNsaWNrLCBsYWJlbCwgaGludCB9KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgb25DbGljaz17b25DbGlja30gc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICAgICAgcGFkZGluZzogXCIxMnB4IDBcIixcbiAgICAgICAgYm9yZGVyQm90dG9tOiBgMXB4IHNvbGlkICR7VC5ib3JkZXJ9YCxcbiAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwLCBwYWRkaW5nUmlnaHQ6IDEyIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFNpemU6IDE2LCBjb2xvcjogVC50ZXh0LCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2hpbnQgJiYgKFxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMywgY29sb3I6IFQudGV4dERpbSwgbWFyZ2luVG9wOiAyIH19PlxuICAgICAgICAgICAgICB7aGludH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IDM4LCBoZWlnaHQ6IDIwLCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCBmbGV4U2hyaW5rOiAwLFxuICAgICAgICAgIGJhY2tncm91bmQ6IG9uID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCwgI0M4QTY1OCkgMTYlLCB0cmFuc3BhcmVudClcIiA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtvbiA/IFQuYWNjZW50IDogVC5ib3JkZXJ9YCxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDEwMCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgdG9wOiAxLCBsZWZ0OiBvbiA/IDE4IDogMSxcbiAgICAgICAgICAgIHdpZHRoOiAxNiwgaGVpZ2h0OiAxNiwgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogb24gPyBULmFjY2VudCA6IFQudGV4dERpbSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwibGVmdCAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gU2xpZGVyKHsgdmFsdWUsIG9uQ2hhbmdlLCBtaW4sIG1heCwgc3RlcCwgbGFiZWwsIHZhbHVlTGFiZWwgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTQgfX0+XG4gICAgICAgIHtsYWJlbCAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDEwLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA2LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4+e2xhYmVsfTwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBULmFjY2VudCwgZm9udFN0eWxlOiBcIm5vcm1hbFwiIH19PlxuICAgICAgICAgICAgICB7dmFsdWVMYWJlbCB8fCAodmFsdWUgKyAobWF4ID8gXCIvXCIgKyBtYXggOiBcIlwiKSl9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIlxuICAgICAgICAgIG1pbj17bWluIHx8IDB9IG1heD17bWF4IHx8IDV9IHN0ZXA9e3N0ZXAgfHwgMX1cbiAgICAgICAgICB2YWx1ZT17dmFsdWUgfHwgMH1cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IG9uQ2hhbmdlKHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlLCAxMCkpfVxuICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgYWNjZW50Q29sb3I6IFwidmFyKC0tc2lsay1nb2xkLCAjQzhBNjU4KVwiIH19XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEwuMSBcdTIwMTQgT05CT0FSRElORyAzIFx1MDBFOWNyYW5zIHJpdHVlbHMgRlJcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGNvbnN0IE9OQl9FWFBFUklFTkNFUyA9IFtcbiAgICB7IHZhbHVlOiBcImRpc2NvdmVyeVwiLCBsYWJlbDogXCJkXHUwMEU5Y291dmVydGVcIiB9LFxuICAgIHsgdmFsdWU6IFwib2NjYXNpb25hbFwiLCBsYWJlbDogXCJqJ2VuIGFpIGV1IHF1ZWxxdWVzLXVuc1wiIH0sXG4gICAgeyB2YWx1ZTogXCJyZWd1bGFyX2RpbGRcIiwgbGFiZWw6IFwiamUgcHJhdGlxdWUgKERJTEQpXCIgfSxcbiAgICB7IHZhbHVlOiBcInJlZ3VsYXJfbWlsZFwiLCBsYWJlbDogXCJqZSBwcmF0aXF1ZSAoTUlMRClcIiB9LFxuICAgIHsgdmFsdWU6IFwicmVndWxhcl93aWxkXCIsIGxhYmVsOiBcImplIHByYXRpcXVlIChXSUxEKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJhZHZhbmNlZFwiLCBsYWJlbDogXCJhdmFuY1x1MDBFOVx1MDBCN2UgKDIwMCspXCIgfSxcbiAgXTtcblxuICBjb25zdCBMdWNpZE9uYm9hcmRpbmcgPSAoeyBwcm9maWxlLCBvbkNvbXBsZXRlLCBvblNraXAgfSkgPT4ge1xuICAgIGNvbnN0IFtzdGVwLCBzZXRTdGVwXSA9IHVTKDApOyAvLyAwLzEvMlxuICAgIGNvbnN0IFtleHAsIHNldEV4cF0gPSB1Uyhwcm9maWxlPy5leHBlcmllbmNlX2xldmVsIHx8IG51bGwpO1xuICAgIGNvbnN0IFtidXN5LCBzZXRCdXN5XSA9IHVTKGZhbHNlKTtcblxuICAgIGNvbnN0IGZpbmlzaCA9IGFzeW5jIChjcmVhdGVEZWZhdWx0UkMpID0+IHtcbiAgICAgIHNldEJ1c3kodHJ1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwYXRjaCA9IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIG9uYm9hcmRpbmdfY29tcGxldGVkOiB0cnVlLFxuICAgICAgICAgIHVpX21vZGU6IFwiZHJlYW1fYW1iaWVudFwiLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoZXhwKSBwYXRjaC5leHBlcmllbmNlX2xldmVsID0gZXhwO1xuICAgICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkudXBkYXRlTHVjaWRQcm9maWxlKHBhdGNoKTtcbiAgICAgICAgaWYgKGNyZWF0ZURlZmF1bHRSQykge1xuICAgICAgICAgIC8vIDMgUkMgcGFyIGRcdTAwRTlmYXV0IChsZXMgY2xhc3NpcXVlcyBMYUJlcmdlKSwgbWF4IDMvam91clxuICAgICAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5jcmVhdGVSZWFsaXR5Q2hlY2soe1xuICAgICAgICAgICAgdGVjaG5pcXVlOiBcImxvb2tfYXRfaGFuZHNcIixcbiAgICAgICAgICAgIGludGVydmFsX21pbnV0ZXM6IDI0MCxcbiAgICAgICAgICAgIGFjdGl2ZV9ob3Vyc19zdGFydDogXCIwOTowMFwiLFxuICAgICAgICAgICAgYWN0aXZlX2hvdXJzX2VuZDogXCIyMTowMFwiLFxuICAgICAgICAgICAgdmlicmF0aW9uX3BhdHRlcm46IFwic2hvcnRcIixcbiAgICAgICAgICAgIHRyaWdnZXJfY29udGV4dDogXCJpbnRlcnZhbFwiLFxuICAgICAgICAgICAgbWF4X3Blcl9kYXk6IDMsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpsdWNpZDplbmFibGVkXCIsIFwidHJ1ZVwiKTsgfSBjYXRjaCB7fVxuICAgICAgICBvbkNvbXBsZXRlKCk7XG4gICAgICB9IGZpbmFsbHkgeyBzZXRCdXN5KGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWdlPlxuICAgICAgICA8RnJhbWU+XG4gICAgICAgICAgPEx1Y2lkSGVhZGVyIGdvPXsoKSA9PiBvblNraXAoKX0gLz5cblxuICAgICAgICAgIHsvKiBTdGVwIDAgXHUyMDE0IGFjY3VlaWwgKi99XG4gICAgICAgICAge3N0ZXAgPT09IDAgJiYgKFxuICAgICAgICAgICAgPENhcmQ+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogXCIzMnB4IDAgMTZweFwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogNTYsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogVC5hY2NlbnQsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IDI0LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgXHUyNUQwXG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGgxIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjgsIGxpbmVIZWlnaHQ6IDEuMyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBULnRleHQsIGZvbnRXZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgMTZweFwiLFxuICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IDQ2MCxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IFwiYXV0b1wiLCBtYXJnaW5SaWdodDogXCJhdXRvXCIsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBsZSByXHUwMEVBdmUgbHVjaWRlIFx1MjAxNCB1biB0ZXJyYWluIGRlIHByYXRpcXVlLiBwYXMgdW5lIG1hZ2llLlxuICAgICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS42LCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6IDQ4MCwgbWFyZ2luOiBcIjAgYXV0byAzMnB4XCIsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBpY2ksIHR1IHBldXggdCdlbnRyYVx1MDBFRW5lciBcdTAwRTAgcmVjb25uYVx1MDBFRXRyZSBxdWUgdHUgclx1MDBFQXZlcywgcGVuZGFudCBxdWUgdHUgclx1MDBFQXZlcy5cbiAgICAgICAgICAgICAgICAgIGRlcyB0ZWNobmlxdWVzIChNSUxELCBXQlRCLCBkcmVhbSBzaWducyksIHBhcyBkZSBwcm9tZXNzZXMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogMTAsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgICAgICAgICAgICA8QnRuIHByaW1hcnkgb25DbGljaz17KCkgPT4gc2V0U3RlcCgxKX0+Y29tbWVuY2VyPC9CdG4+XG4gICAgICAgICAgICAgICAgICA8QnRuIGdob3N0IG9uQ2xpY2s9e29uU2tpcH0+cGx1cyB0YXJkPC9CdG4+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7LyogU3RlcCAxIFx1MjAxNCBxdWFsaWZpY2F0aW9uICovfVxuICAgICAgICAgIHtzdGVwID09PSAxICYmIChcbiAgICAgICAgICAgIDxDYXJkPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMTZweCAwXCIgfX0+XG4gICAgICAgICAgICAgICAgPGgyIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMjQsIGxpbmVIZWlnaHQ6IDEuMyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBULnRleHQsIGZvbnRXZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgMjRweFwiLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgb1x1MDBGOSBlbiBlcy10dSwgZGFucyB0YSBwcmF0aXF1ZSA/XG4gICAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDEwLCBmbGV4V3JhcDogXCJ3cmFwXCIsIG1hcmdpbkJvdHRvbTogMzIgfX0+XG4gICAgICAgICAgICAgICAgICB7T05CX0VYUEVSSUVOQ0VTLm1hcCgobykgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8Q2hpcCBrZXk9e28udmFsdWV9IGFjdGl2ZT17ZXhwID09PSBvLnZhbHVlfSBvbkNsaWNrPXsoKSA9PiBzZXRFeHAoby52YWx1ZSl9PlxuICAgICAgICAgICAgICAgICAgICAgIHtvLmxhYmVsfVxuICAgICAgICAgICAgICAgICAgICA8L0NoaXA+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDEwIH19PlxuICAgICAgICAgICAgICAgICAgPEJ0biBnaG9zdCBvbkNsaWNrPXsoKSA9PiBzZXRTdGVwKDApfT5cdTIxOTAgcmV0b3VyPC9CdG4+XG4gICAgICAgICAgICAgICAgICA8QnRuIHByaW1hcnkgb25DbGljaz17KCkgPT4gc2V0U3RlcCgyKX0gZGlzYWJsZWQ9eyFleHB9PlxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZXIgXHUyMTkyXG4gICAgICAgICAgICAgICAgICA8L0J0bj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBTdGVwIDIgXHUyMDE0IHByb3Bvc2VyIHRlY2huaXF1ZSBzaW1wbGUgKi99XG4gICAgICAgICAge3N0ZXAgPT09IDIgJiYgKFxuICAgICAgICAgICAgPENhcmQ+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIxNnB4IDBcIiB9fT5cbiAgICAgICAgICAgICAgICA8aDIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAyNCwgbGluZUhlaWdodDogMS4zLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgZm9udFdlaWdodDogMzAwLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luOiBcIjAgMCAxNnB4XCIsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB2ZXV4LXR1IHVuZSBwcmVtaVx1MDBFOHJlIHRlY2huaXF1ZSBzaW1wbGUgP1xuICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dERpbSwgbWFyZ2luQm90dG9tOiAyMCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIG9uIHBldXQgdCdpbnN0YWxsZXIgdW4gcmVhbGl0eSBjaGVjayBsXHUwMEU5Z2VyICgzIGZvaXMgcGFyIGpvdXIsIHJlZ2FyZGUgdGVzIG1haW5zKVxuICAgICAgICAgICAgICAgICAgKyBjb21tZW5jZXIgbGEgcHJhdGlxdWUgPGVtPk1JTEQ8L2VtPi5cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYm9yZGVyTGVmdDogYDJweCBzb2xpZCAke1QuYWNjZW50fWAsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nTGVmdDogMTYsIG1hcmdpbkJvdHRvbTogMjQsXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTUsIGNvbG9yOiBULnRleHQsIGxpbmVIZWlnaHQ6IDEuNixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFQuYWNjZW50LCBmb250U3R5bGU6IFwibm9ybWFsXCIsIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDExLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIgfX0+XG4gICAgICAgICAgICAgICAgICAgIE1JTERcbiAgICAgICAgICAgICAgICAgIDwvc3Ryb25nPlxuICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICBhdmFudCBkZSBkb3JtaXIsIHJcdTAwRTlwXHUwMEU4dGUgaW50XHUwMEU5cmlldXJlbWVudCA6XG4gICAgICAgICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgICAgICAgIDxlbSBzdHlsZT17eyBjb2xvcjogVC50ZXh0IH19Plx1MDBBQiBsYSBwcm9jaGFpbmUgZm9pcyBxdWUgamUgclx1MDBFQXZlLCBqZSBsZSBzYXVyYWkuIFx1MDBCQjwvZW0+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZ2FwOiAxMCwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgICAgICAgPEJ0biBwcmltYXJ5IG9uQ2xpY2s9eygpID0+IGZpbmlzaCh0cnVlKX0gZGlzYWJsZWQ9e2J1c3l9PlxuICAgICAgICAgICAgICAgICAgICB7YnVzeSA/IFwiXHUyMDI2XCIgOiBcIm91aSwgaW5zdGFsbGVyXCJ9XG4gICAgICAgICAgICAgICAgICA8L0J0bj5cbiAgICAgICAgICAgICAgICAgIDxCdG4gb25DbGljaz17KCkgPT4gZmluaXNoKGZhbHNlKX0gZGlzYWJsZWQ9e2J1c3l9PlxuICAgICAgICAgICAgICAgICAgICBqZSB2ZXJyYWkgcGx1cyB0YXJkXG4gICAgICAgICAgICAgICAgICA8L0J0bj5cbiAgICAgICAgICAgICAgICAgIDxCdG4gZ2hvc3Qgb25DbGljaz17KCkgPT4gc2V0U3RlcCgxKX0+XHUyMTkwIHJldG91cjwvQnRuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0ZyYW1lPlxuICAgICAgPC9TdGFnZT5cbiAgICApO1xuICB9O1xuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBMLkJPTlVTIFx1MjAxNCBIdWIgc3ViLWFwcCA6IGhlYWRlciArIGJvdHRvbS10YWJzICg1IG9uZ2xldHMpXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBUYWJzIDogcHJvZmlsIC8gcmVhbGl0eSBjaGVja3MgLyBkcmVhbSBzaWducyAvIFdCVEIgLyBzdGF0c1xuICAvLyBMZSB0YWIgcHJpbmNpcGFsIGRldmllbnQgY2VsdWkgcXVlIGxhIHJvdXRlIGRlbWFuZGUuXG4gIC8vIFBvdXIgbGUgdXNlciBleHBcdTAwRTlyaW1lbnRcdTAwRTksIGMnZXN0IHBsdXMgcmFwaWRlIDsgcG91ciBsZSBkXHUwMEU5YnV0YW50LFxuICAvLyBsJ29uYm9hcmRpbmcgc2UgZmFpdCBhdmFudCBjZSBodWIuXG4gIGNvbnN0IFRBQlMgPSBbXG4gICAgeyBrZXk6IFwicHJvZmlsZVwiLCByb3V0ZTogXCJsdWNpZC1wcm9maWxlXCIsICAgICAgICBsYWJlbDogXCJwcm9maWxcIiwgICAgZ2x5cGg6IFwiXHUyNUQwXCIgfSxcbiAgICB7IGtleTogXCJyY1wiLCAgICAgIHJvdXRlOiBcImx1Y2lkLXJlYWxpdHktY2hlY2tzXCIsIGxhYmVsOiBcInJlYWxpdHlcIiwgICBnbHlwaDogXCJcdTI3MzFcIiB9LFxuICAgIHsga2V5OiBcInNpZ25zXCIsICAgcm91dGU6IFwibHVjaWQtZHJlYW0tc2lnbnNcIiwgICAgbGFiZWw6IFwiZHJlYW0gc2lnbnNcIiwgZ2x5cGg6IFwiXHUyNzI2XCIgfSxcbiAgICB7IGtleTogXCJ3YnRiXCIsICAgIHJvdXRlOiBcImx1Y2lkLXdidGJcIiwgICAgICAgICAgIGxhYmVsOiBcIldCVEJcIiwgICAgICBnbHlwaDogXCJcdTI2M0VcIiB9LFxuICAgIHsga2V5OiBcInN0YXRzXCIsICAgcm91dGU6IFwibHVjaWQtZGFzaGJvYXJkXCIsICAgICAgbGFiZWw6IFwic3RhdHNcIiwgICAgIGdseXBoOiBcIlx1MjVBNFwiIH0sXG4gIF07XG5cbiAgZnVuY3Rpb24gTHVjaWRUYWJzKHsgZ28sIGN1cnJlbnQgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8bmF2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgICAgIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDAsXG4gICAgICAgIHpJbmRleDogNTAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vciwgIzBFMEYxNCkgOTUlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cigxMnB4KVwiLFxuICAgICAgICBib3JkZXJUb3A6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICBwYWRkaW5nOiBcIjEwcHggMTJweCAxOHB4XCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1hcm91bmRcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgIH19PlxuICAgICAgICB7VEFCUy5tYXAoKHQpID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSB0LmtleSA9PT0gY3VycmVudDtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e3Qua2V5fVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyh0LnJvdXRlKX1cbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD17dC5sYWJlbH1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGdhcDogMixcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjRweCA4cHhcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlID8gVC5hY2NlbnQgOiBULnRleHREaW0sXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogYWN0aXZlID8gMSA6IDAuNyxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSlcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDE4IH19Pnt0LmdseXBofTwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDExLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICB7dC5sYWJlbH1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L25hdj5cbiAgICApO1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIDEuIFBST0ZJTCAocm91dGUgbHVjaWQtcHJvZmlsZSlcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGNvbnN0IEx1Y2lkUHJvZmlsZVNjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgICBjb25zdCBbcHJvZmlsZSwgc2V0UHJvZmlsZV0gPSB1UyhudWxsKTtcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1Uyh0cnVlKTtcbiAgICBjb25zdCBbZm9yY2VPbmJvYXJkLCBzZXRGb3JjZU9uYm9hcmRdID0gdVMoZmFsc2UpO1xuXG4gICAgY29uc3QgcmVmcmVzaCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZ2V0THVjaWRQcm9maWxlKCk7XG4gICAgICAgIHNldFByb2ZpbGUocmVzPy5wcm9maWxlIHx8IG51bGwpO1xuICAgICAgfSBmaW5hbGx5IHsgc2V0TG9hZGluZyhmYWxzZSk7IH1cbiAgICB9O1xuICAgIHVFKCgpID0+IHsgcmVmcmVzaCgpOyB9LCBbXSk7XG5cbiAgICBjb25zdCB1cGRhdGUgPSBhc3luYyAocGF0Y2gpID0+IHtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS51cGRhdGVMdWNpZFByb2ZpbGUocGF0Y2gpO1xuICAgICAgc2V0UHJvZmlsZShyZXM/LnByb2ZpbGUgfHwgbnVsbCk7XG4gICAgICBpZiAoXCJlbmFibGVkXCIgaW4gcGF0Y2gpIHtcbiAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpsdWNpZDplbmFibGVkXCIsIHBhdGNoLmVuYWJsZWQgPyBcInRydWVcIiA6IFwiZmFsc2VcIik7IH0gY2F0Y2gge31cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdGFnZT5cbiAgICAgICAgICA8RnJhbWU+XG4gICAgICAgICAgICA8THVjaWRIZWFkZXIgZ289e2dvfSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJicmVhdGhcIiBzdHlsZT17eyBjb2xvcjogVC50ZXh0RGltLCBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICAgIGNoYXJnZW1lbnRcdTIwMjZcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvRnJhbWU+XG4gICAgICAgIDwvU3RhZ2U+XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIE9uYm9hcmRpbmcgc2kgcGFzIGVuY29yZSBmYWl0IE9VIGFjdGl2YXRpb24gZm9yY1x1MDBFOWVcbiAgICBjb25zdCBuZWVkT25ib2FyZCA9XG4gICAgICBmb3JjZU9uYm9hcmQgfHxcbiAgICAgICghcHJvZmlsZT8uZW5hYmxlZCAmJiAhcHJvZmlsZT8ub25ib2FyZGluZ19jb21wbGV0ZWQpIHx8XG4gICAgICAocHJvZmlsZT8uZW5hYmxlZCAmJiAhcHJvZmlsZT8ub25ib2FyZGluZ19jb21wbGV0ZWQpO1xuICAgIGlmIChuZWVkT25ib2FyZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEx1Y2lkT25ib2FyZGluZ1xuICAgICAgICAgIHByb2ZpbGU9e3Byb2ZpbGV9XG4gICAgICAgICAgb25Db21wbGV0ZT17KCkgPT4geyBzZXRGb3JjZU9uYm9hcmQoZmFsc2UpOyByZWZyZXNoKCk7IH19XG4gICAgICAgICAgb25Ta2lwPXsoKSA9PiBnbyhcImV4cGxvcmVyXCIpfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBNb2RlIGRcdTAwRTlzYWN0aXZcdTAwRTkgXHUyMTkyIFx1MDBFOWNyYW4gXCJyXHUwMEU5YWN0aXZlclwiXG4gICAgaWYgKCFwcm9maWxlPy5lbmFibGVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3RhZ2U+XG4gICAgICAgICAgPEZyYW1lPlxuICAgICAgICAgICAgPEx1Y2lkSGVhZGVyIGdvPXtnb30gc3ViPVwibGUgbW9kZSBsdWNpZGUgZXN0IGRcdTAwRTlzYWN0aXZcdTAwRTkuIHR1IHBldXggbGUgcmFsbHVtZXIgaWNpLlwiIC8+XG4gICAgICAgICAgICA8Q2FyZD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjIwcHggMFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxOCwgY29sb3I6IFQudGV4dERpbSwgbWFyZ2luQm90dG9tOiAyNCB9fT5cbiAgICAgICAgICAgICAgICAgIHJpZW4gbmUgdG91cm5lIGVuIGFycmlcdTAwRThyZS1wbGFuIHRhbnQgcXVlIGxlIG1vZGUgZXN0IFx1MDBFOXRlaW50LlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxCdG4gcHJpbWFyeSBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoeyBlbmFibGVkOiB0cnVlIH0pfT5cbiAgICAgICAgICAgICAgICAgIHJhbGx1bWVyIGxlIG1vZGUgbHVjaWRlXG4gICAgICAgICAgICAgICAgPC9CdG4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgIDwvRnJhbWU+XG4gICAgICAgICAgPEx1Y2lkVGFicyBnbz17Z299IGN1cnJlbnQ9XCJwcm9maWxlXCIgLz5cbiAgICAgICAgPC9TdGFnZT5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gTW9kZSBhY3RpZiBcdTIxOTIgc2V0dGluZ3NcbiAgICByZXR1cm4gKFxuICAgICAgPFN0YWdlPlxuICAgICAgICA8RnJhbWU+XG4gICAgICAgICAgPEx1Y2lkSGVhZGVyIGdvPXtnb30gc3ViPVwidG9uIHRlcnJhaW4gZGUgcHJhdGlxdWUuIG9wdC1pbiwgc2FucyBwcmVzc2lvbi5cIiAvPlxuXG4gICAgICAgICAgPENhcmQgdGl0bGU9XCJwcmF0aXF1ZVwiIGFjY2VudD5cbiAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cIm5pdmVhdSBkJ2V4cFx1MDBFOXJpZW5jZVwiPlxuICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgdmFsdWU9e3Byb2ZpbGUuZXhwZXJpZW5jZV9sZXZlbCB8fCBcIlwifVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gdXBkYXRlKHsgZXhwZXJpZW5jZV9sZXZlbDogdiB8fCBudWxsIH0pfVxuICAgICAgICAgICAgICAgIG9wdGlvbnM9e1t7IHZhbHVlOiBcIlwiLCBsYWJlbDogXCJcdTIwMTRcIiB9LCAuLi5PTkJfRVhQRVJJRU5DRVNdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9GaWVsZD5cbiAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cInRlY2huaXF1ZSBwclx1MDBFOWZcdTAwRTlyXHUwMEU5ZVwiXG4gICAgICAgICAgICAgIGhpbnQ9XCJNSUxEID0gclx1MDBFOXBcdTAwRTl0aXRpb24gZCdpbnRlbnRpb24uIFdCVEIgPSByXHUwMEU5dmVpbCArIHJldG91ciBhdmVjIGludGVudGlvbi4gV0lMRCA9IHBhc3NhZ2UgY29uc2NpZW50LiBTU0lMRCA9IGN5Y2xlIGRlcyBzZW5zLiBESUxEID0gbHVjaWRpdFx1MDBFOSBzcG9udGFuXHUwMEU5ZSBkYW5zIGxlIHJcdTAwRUF2ZS5cIj5cbiAgICAgICAgICAgICAgPFNlbGVjdFxuICAgICAgICAgICAgICAgIHZhbHVlPXtwcm9maWxlLnByZWZlcnJlZF90ZWNobmlxdWUgfHwgXCJcIn1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHVwZGF0ZSh7IHByZWZlcnJlZF90ZWNobmlxdWU6IHYgfHwgbnVsbCB9KX1cbiAgICAgICAgICAgICAgICBvcHRpb25zPXtbXG4gICAgICAgICAgICAgICAgICB7IHZhbHVlOiBcIlwiLCBsYWJlbDogXCJcdTIwMTRcIiB9LFxuICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogXCJNSUxEXCIsIGxhYmVsOiBcIk1JTEQgKGludGVudGlvbiByXHUwMEU5cFx1MDBFOXRcdTAwRTllKVwiIH0sXG4gICAgICAgICAgICAgICAgICB7IHZhbHVlOiBcIldCVEJcIiwgbGFiZWw6IFwiV0JUQiAod2FrZSBiYWNrIHRvIGJlZClcIiB9LFxuICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogXCJXSUxEXCIsIGxhYmVsOiBcIldJTEQgKHBhc3NhZ2UgY29uc2NpZW50KVwiIH0sXG4gICAgICAgICAgICAgICAgICB7IHZhbHVlOiBcIlNTSUxEXCIsIGxhYmVsOiBcIlNTSUxEIChjeWNsZSBkZXMgc2VucylcIiB9LFxuICAgICAgICAgICAgICAgICAgeyB2YWx1ZTogXCJESUxEXCIsIGxhYmVsOiBcIkRJTEQgKHNwb250YW5cdTAwRTkgZGFucyBsZSByXHUwMEVBdmUpXCIgfSxcbiAgICAgICAgICAgICAgICBdfVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9GaWVsZD5cbiAgICAgICAgICA8L0NhcmQ+XG5cbiAgICAgICAgICA8Q2FyZCB0aXRsZT1cImV4cG9ydFwiPlxuICAgICAgICAgICAgPFRvZ2dsZVxuICAgICAgICAgICAgICBvbj17ISFwcm9maWxlLm9ic2lkaWFuX2V4cG9ydF9lbmFibGVkfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB1cGRhdGUoeyBvYnNpZGlhbl9leHBvcnRfZW5hYmxlZDogIXByb2ZpbGUub2JzaWRpYW5fZXhwb3J0X2VuYWJsZWQgfSl9XG4gICAgICAgICAgICAgIGxhYmVsPVwiZXhwb3J0IE9ic2lkaWFuIC8gTWFya2Rvd24gYWN0aXZcdTAwRTlcIlxuICAgICAgICAgICAgICBoaW50PVwidFx1MDBFOWxcdTAwRTljaGFyZ2VtZW50IC5tZCBhdmVjIGZyb250bWF0dGVyIChkYXRlLCBsdWNpZGl0XHUwMEU5LCB0ZWNobmlxdWUsIHNpZ25zKS5cIlxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0NhcmQ+XG5cbiAgICAgICAgICB7LyogVDQgXHUyMDE0IEJyaWRnZSB2ZXJzIERyZWFtIG1haW4gOiBleHBsb3JlciBsYSBwcm9mb25kZXVyIHZpYSBBbmltYSAqL31cbiAgICAgICAgICA8Q2FyZCB0aXRsZT1cImV4cGxvcmUgbGEgcHJvZm9uZGV1clwiIGFjY2VudD5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0RGltLCBtYXJnaW5Cb3R0b206IDE0LCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgY2V0dGUgY2hhbWJyZSBlc3QgdW5lIGNoYXBlbGxlIGxhdFx1MDBFOXJhbGUgZGUgbGEgY2F0aFx1MDBFOWRyYWxlIERyZWFtLlxuICAgICAgICAgICAgICB0dSBwZXV4IHJlbW9udGVyIGF1IHNvbCBcdTIwMTQgY29udmVyc2VyIGF2ZWMgQW5pbWEgZGUgdGEgcHJhdGlxdWUsXG4gICAgICAgICAgICAgIG91IHZvaXIgY29tbWVudCB0ZXMgbHVjaWRlcyBzJ2luc2NyaXZlbnQgZGFucyB0b24gcG9ydHJhaXQgZ2xvYmFsLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZ2FwOiAxMCwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgICA8QnRuIHByaW1hcnkgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICBzZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFwiZHJlYW06Y2hhdDpwcmVmaWxsZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJKZSB2aWVucyBkZSBsYSBjaGFtYnJlIEx1Y2lkLiBKJ2FpbWVyYWlzIHBhcmxlciBkZSBtYSBwcmF0aXF1ZSBkdSByXHUwMEVBdmUgbHVjaWRlIFx1MjAxNCBjZSBxdWkgcmV2aWVudCwgY2UgcXVpIG1lIHRyb3VibGUsIGNlIHF1ZSBqZSBuJ29zZSBwYXMgcmVnYXJkZXIuXCIpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2gge31cbiAgICAgICAgICAgICAgICBnbyhcImRyZWFtLWNoYXRcIik7XG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIFx1MjcyNiBjb252ZXJzZSBhdmVjIEFuaW1hIGRlIGNldHRlIHByYXRpcXVlXG4gICAgICAgICAgICAgIDwvQnRuPlxuICAgICAgICAgICAgICA8QnRuIGdob3N0IG9uQ2xpY2s9eygpID0+IGdvKFwicG9ydHJhaXRcIil9PlxuICAgICAgICAgICAgICAgIFx1MjFCQSBwb3J0cmFpdCBuYXJyYXRpZlxuICAgICAgICAgICAgICA8L0J0bj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvQ2FyZD5cblxuICAgICAgICAgIDxDYXJkIHRpdGxlPVwiem9uZSBkZSByZXRyYWl0XCI+XG4gICAgICAgICAgICA8VG9nZ2xlXG4gICAgICAgICAgICAgIG9uPXshIXByb2ZpbGUuZW5hYmxlZH1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdXBkYXRlKHsgZW5hYmxlZDogZmFsc2UgfSl9XG4gICAgICAgICAgICAgIGxhYmVsPVwiZFx1MDBFOXNhY3RpdmVyIGxlIG1vZGUgbHVjaWRlXCJcbiAgICAgICAgICAgICAgaGludD1cInJpZW4gbidlc3Qgc3VwcHJpbVx1MDBFOS4gdHUgcGV1eCByYWxsdW1lciBxdWFuZCB0dSB2ZXV4LlwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDE0IH19PlxuICAgICAgICAgICAgICA8QnRuIGdob3N0IG9uQ2xpY2s9eygpID0+IHNldEZvcmNlT25ib2FyZCh0cnVlKX0+XG4gICAgICAgICAgICAgICAgcmVmYWlyZSBsJ2ludHJvZHVjdGlvblxuICAgICAgICAgICAgICA8L0J0bj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgPC9GcmFtZT5cbiAgICAgICAgPEx1Y2lkVGFicyBnbz17Z299IGN1cnJlbnQ9XCJwcm9maWxlXCIgLz5cbiAgICAgIDwvU3RhZ2U+XG4gICAgKTtcbiAgfTtcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gMi4gUkVBTElUWSBDSEVDS1MgKHJvdXRlIGx1Y2lkLXJlYWxpdHktY2hlY2tzKSBcdTIwMTQgTC4zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBjb25zdCBSQ19URUNITklRVUVTX0ZSID0gW1xuICAgIHsgdmFsdWU6IFwibG9va19hdF9oYW5kc1wiLCAgICAgICAgbGFiZWw6IFwicmVnYXJkZSB0ZXMgbWFpbnNcIiB9LFxuICAgIHsgdmFsdWU6IFwibG9va19hdF90ZXh0XCIsICAgICAgICAgbGFiZWw6IFwibGlzIHVuIHRleHRlIGRldXggZm9pc1wiIH0sXG4gICAgeyB2YWx1ZTogXCJmaW5nZXJfdGhyb3VnaF9wYWxtXCIsICBsYWJlbDogXCJwYXNzZSB1biBkb2lndCBcdTAwRTAgdHJhdmVycyB0YSBwYXVtZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJsb29rX2F0X2Nsb2NrXCIsICAgICAgICBsYWJlbDogXCJyZWdhcmRlIGwnaGV1cmUgKGRldXggZm9pcylcIiB9LFxuICAgIHsgdmFsdWU6IFwiYnJlYXRoX3Rocm91Z2hfbm9zZVwiLCAgbGFiZWw6IFwicGluY2UgdG9uIG5leiBldCByZXNwaXJlXCIgfSxcbiAgICB7IHZhbHVlOiBcImp1bXBfdGVzdFwiLCAgICAgICAgICAgIGxhYmVsOiBcInNhdXRlIChlc3QtY2UgcXVlIHR1IGZsb3R0ZXMgPylcIiB9LFxuICAgIHsgdmFsdWU6IFwiY3VzdG9tXCIsICAgICAgICAgICAgICAgbGFiZWw6IFwicGVyc29ubmFsaXNcdTAwRTlcdTIwMjZcIiB9LFxuICBdO1xuICBjb25zdCBSQ19UUklHR0VSU19GUiA9IFtcbiAgICB7IHZhbHVlOiBcImludGVydmFsXCIsICAgICBsYWJlbDogXCJcdTAwRTAgaW50ZXJ2YWxsZXMgclx1MDBFOWd1bGllcnNcIiB9LFxuICAgIHsgdmFsdWU6IFwib25fYXBwX29wZW5cIiwgIGxhYmVsOiBcIlx1MDBFMCBsJ291dmVydHVyZSBkZSBsJ2FwcFwiIH0sXG4gICAgeyB2YWx1ZTogXCJvbl9tb3JuaW5nXCIsICAgbGFiZWw6IFwibGUgbWF0aW4gKGF1IHJcdTAwRTl2ZWlsKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJvbl9ldmVuaW5nXCIsICAgbGFiZWw6IFwibGUgc29pciAoYXZhbnQgZG9ybWlyKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJvbl9yYW5kb21cIiwgICAgbGFiZWw6IFwiXHUwMEUwIHVuIG1vbWVudCBpbXByXHUwMEU5dnVcIiB9LFxuICBdO1xuICBjb25zdCBSQ19WSUJfRlIgPSBbXG4gICAgeyB2YWx1ZTogXCJzaG9ydFwiLCAgbGFiZWw6IFwiY291cnRlXCIgfSxcbiAgICB7IHZhbHVlOiBcIm1lZGl1bVwiLCBsYWJlbDogXCJtb3llbm5lXCIgfSxcbiAgICB7IHZhbHVlOiBcImxvbmdcIiwgICBsYWJlbDogXCJsb25ndWVcIiB9LFxuICBdO1xuXG4gIGNvbnN0IEx1Y2lkUmVhbGl0eUNoZWNrc1NjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgICBjb25zdCBbY2hlY2tzLCBzZXRDaGVja3NdID0gdVMoW10pO1xuICAgIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVTKHRydWUpO1xuICAgIGNvbnN0IFthZGRpbmcsIHNldEFkZGluZ10gPSB1UyhmYWxzZSk7XG4gICAgY29uc3QgW2RyYWZ0LCBzZXREcmFmdF0gPSB1UyhudWxsKTtcbiAgICBjb25zdCBpbnRlcnZhbFJlZiA9IHVSKG51bGwpO1xuXG4gICAgY29uc3QgcmVmcmVzaCA9IGFzeW5jICgpID0+IHtcbiAgICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkubGlzdFJlYWxpdHlDaGVja3MoKTtcbiAgICAgICAgc2V0Q2hlY2tzKHJlcz8ucmVhbGl0eV9jaGVja3MgfHwgW10pO1xuICAgICAgfSBmaW5hbGx5IHsgc2V0TG9hZGluZyhmYWxzZSk7IH1cbiAgICB9O1xuICAgIHVFKCgpID0+IHsgcmVmcmVzaCgpOyB9LCBbXSk7XG5cbiAgICAvLyBOb3RpZiBsb29wIGNcdTAwRjR0XHUwMEU5IGNsaWVudCAoVjEgd2ViKVxuICAgIHVFKCgpID0+IHtcbiAgICAgIGlmIChpbnRlcnZhbFJlZi5jdXJyZW50KSBjbGVhckludGVydmFsKGludGVydmFsUmVmLmN1cnJlbnQpO1xuICAgICAgY29uc3QgZW5hYmxlZCA9IGNoZWNrcy5maWx0ZXIoKGMpID0+IGMuZW5hYmxlZCk7XG4gICAgICBpZiAoZW5hYmxlZC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgIGludGVydmFsUmVmLmN1cnJlbnQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgTm90aWZpY2F0aW9uID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm47XG4gICAgICAgIGlmIChOb3RpZmljYXRpb24ucGVybWlzc2lvbiAhPT0gXCJncmFudGVkXCIpIHJldHVybjtcbiAgICAgICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgY29uc3QgdG9kYXkgPSBub3cudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgICAgIGNvbnN0IGhvdXIgPSBub3cudG9UaW1lU3RyaW5nKCkuc2xpY2UoMCwgNSk7XG4gICAgICAgIGZvciAoY29uc3QgcmMgb2YgZW5hYmxlZCkge1xuICAgICAgICAgIGlmIChyYy50cmlnZ2VyX2NvbnRleHQgJiYgcmMudHJpZ2dlcl9jb250ZXh0ICE9PSBcImludGVydmFsXCIpIGNvbnRpbnVlO1xuICAgICAgICAgIGlmIChyYy5hY3RpdmVfaG91cnNfc3RhcnQgJiYgaG91ciA8IHJjLmFjdGl2ZV9ob3Vyc19zdGFydCkgY29udGludWU7XG4gICAgICAgICAgaWYgKHJjLmFjdGl2ZV9ob3Vyc19lbmQgJiYgaG91ciA+IHJjLmFjdGl2ZV9ob3Vyc19lbmQpIGNvbnRpbnVlO1xuICAgICAgICAgIC8vIEFudGktc3BhbSA6IG1heF9wZXJfZGF5XG4gICAgICAgICAgY29uc3QgbGFzdERheSA9IHJjLmxhc3RfcGVyZm9ybWVkX2F0ID8gcmMubGFzdF9wZXJmb3JtZWRfYXQuc2xpY2UoMCwgMTApIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBwZXJmb3JtZWRUb2RheSA9IGxhc3REYXkgPT09IHRvZGF5XG4gICAgICAgICAgICA/IChyYy5fY291bnRUb2RheSB8fCAxKVxuICAgICAgICAgICAgOiAwO1xuICAgICAgICAgIGlmIChwZXJmb3JtZWRUb2RheSA+PSAocmMubWF4X3Blcl9kYXkgfHwgMykpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IGxhc3QgPSByYy5sYXN0X3BlcmZvcm1lZF9hdCA/IG5ldyBEYXRlKHJjLmxhc3RfcGVyZm9ybWVkX2F0KS5nZXRUaW1lKCkgOiAwO1xuICAgICAgICAgIGNvbnN0IGludGVydmFsID0gKHJjLmludGVydmFsX21pbnV0ZXMgfHwgOTApICogNjAgKiAxMDAwO1xuICAgICAgICAgIGlmIChEYXRlLm5vdygpIC0gbGFzdCA+PSBpbnRlcnZhbCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgbmV3IE5vdGlmaWNhdGlvbihcIlJlYWxpdHkgY2hlY2tcIiwge1xuICAgICAgICAgICAgICAgIGJvZHk6IHJjLmN1c3RvbV9sYWJlbCB8fCAoUkNfVEVDSE5JUVVFU19GUi5maW5kKCh4KSA9PiB4LnZhbHVlID09PSByYy50ZWNobmlxdWUpPy5sYWJlbCB8fCByYy50ZWNobmlxdWUpLFxuICAgICAgICAgICAgICAgIHNpbGVudDogIXJjLnNvdW5kX2VuYWJsZWQsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB3aW5kb3cuRHJlYW1BUEkudXBkYXRlUmVhbGl0eUNoZWNrKHJjLmlkLCB7XG4gICAgICAgICAgICAgICAgbGFzdF9wZXJmb3JtZWRfYXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBwZXJmb3JtZWRfY291bnQ6IChyYy5wZXJmb3JtZWRfY291bnQgfHwgMCkgKyAxLFxuICAgICAgICAgICAgICB9KS50aGVuKHJlZnJlc2gpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKGUpOyB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCA2MCAqIDEwMDApO1xuICAgICAgcmV0dXJuICgpID0+IHsgaWYgKGludGVydmFsUmVmLmN1cnJlbnQpIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxSZWYuY3VycmVudCk7IH07XG4gICAgfSwgW2NoZWNrc10pO1xuXG4gICAgLy8gVHJpZ2dlciBcIm9uX2FwcF9vcGVuXCJcbiAgICB1RSgoKSA9PiB7XG4gICAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgY29uc3QgdG9kYXkgPSBub3cudG9JU09TdHJpbmcoKS5zbGljZSgwLCAxMCk7XG4gICAgICBjb25zdCBvbk9wZW4gPSBjaGVja3MuZmlsdGVyKChjKSA9PlxuICAgICAgICBjLmVuYWJsZWQgJiYgYy50cmlnZ2VyX2NvbnRleHQgPT09IFwib25fYXBwX29wZW5cIiAmJlxuICAgICAgICAoIWMubGFzdF9wZXJmb3JtZWRfYXQgfHwgIWMubGFzdF9wZXJmb3JtZWRfYXQuc3RhcnRzV2l0aCh0b2RheSkpXG4gICAgICApO1xuICAgICAgaWYgKG9uT3Blbi5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICAgIC8vIFNvZnQgaW4tYXBwIGJhbm5lciB2aWEgY29uc29sZSArIGZhbGxiYWNrIGFsZXJ0XG4gICAgICAvLyBWcmFpZSBpbXBsXHUwMEU5bSA6IG9uIGRcdTAwRTljbGVuY2hlIG5vdGlmIHNpIGF1dG9yaXNcdTAwRTllLCBzaW5vbiBiYW5uZXIuXG4gICAgICBmb3IgKGNvbnN0IHJjIG9mIG9uT3Blbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlb2YgTm90aWZpY2F0aW9uICE9PSBcInVuZGVmaW5lZFwiICYmIE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uID09PSBcImdyYW50ZWRcIikge1xuICAgICAgICAgICAgbmV3IE5vdGlmaWNhdGlvbihcIlJlYWxpdHkgY2hlY2tcIiwge1xuICAgICAgICAgICAgICBib2R5OiByYy5jdXN0b21fbGFiZWwgfHwgKFJDX1RFQ0hOSVFVRVNfRlIuZmluZCgoeCkgPT4geC52YWx1ZSA9PT0gcmMudGVjaG5pcXVlKT8ubGFiZWwgfHwgcmMudGVjaG5pcXVlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cuRHJlYW1BUEkudXBkYXRlUmVhbGl0eUNoZWNrKHJjLmlkLCB7XG4gICAgICAgICAgICBsYXN0X3BlcmZvcm1lZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgcGVyZm9ybWVkX2NvdW50OiAocmMucGVyZm9ybWVkX2NvdW50IHx8IDApICsgMSxcbiAgICAgICAgICB9KS50aGVuKHJlZnJlc2gpLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfVxuICAgIH0sIFtjaGVja3MubGVuZ3RoXSk7XG5cbiAgICBjb25zdCBhc2tQZXJtID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBOb3RpZmljYXRpb24gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgYWxlcnQoXCJub3RpZmljYXRpb25zIGluZGlzcG9uaWJsZXMgc3VyIGNldCBhcHBhcmVpbC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChOb3RpZmljYXRpb24ucGVybWlzc2lvbiA9PT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgY29uc3QgcCA9IGF3YWl0IE5vdGlmaWNhdGlvbi5yZXF1ZXN0UGVybWlzc2lvbigpO1xuICAgICAgICBhbGVydChcInBlcm1pc3Npb24gOiBcIiArIHApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxlcnQoXCJkXHUwMEU5alx1MDBFMCA6IFwiICsgTm90aWZpY2F0aW9uLnBlcm1pc3Npb24pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBzdGFydEFkZCA9ICgpID0+IHtcbiAgICAgIHNldERyYWZ0KHtcbiAgICAgICAgdGVjaG5pcXVlOiBcImxvb2tfYXRfaGFuZHNcIixcbiAgICAgICAgY3VzdG9tX2xhYmVsOiBcIlwiLFxuICAgICAgICBpbnRlcnZhbF9taW51dGVzOiAyNDAsXG4gICAgICAgIGFjdGl2ZV9ob3Vyc19zdGFydDogXCIwOTowMFwiLFxuICAgICAgICBhY3RpdmVfaG91cnNfZW5kOiBcIjIxOjAwXCIsXG4gICAgICAgIHZpYnJhdGlvbl9wYXR0ZXJuOiBcInNob3J0XCIsXG4gICAgICAgIHNvdW5kX2VuYWJsZWQ6IGZhbHNlLFxuICAgICAgICB0cmlnZ2VyX2NvbnRleHQ6IFwiaW50ZXJ2YWxcIixcbiAgICAgICAgbWF4X3Blcl9kYXk6IDMsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHNldEFkZGluZyh0cnVlKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2F2ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5jcmVhdGVSZWFsaXR5Q2hlY2soZHJhZnQpO1xuICAgICAgICBzZXRBZGRpbmcoZmFsc2UpO1xuICAgICAgICBzZXREcmFmdChudWxsKTtcbiAgICAgICAgcmVmcmVzaCgpO1xuICAgICAgfSBjYXRjaCAoZSkgeyBhbGVydChcImVycmV1ciA6IFwiICsgZS5tZXNzYWdlKTsgfVxuICAgIH07XG5cbiAgICBjb25zdCB0b2dnbGUgPSBhc3luYyAocmMpID0+IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS51cGRhdGVSZWFsaXR5Q2hlY2socmMuaWQsIHsgZW5hYmxlZDogIXJjLmVuYWJsZWQgfSk7XG4gICAgICByZWZyZXNoKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbW92ZSA9IGFzeW5jIChyYykgPT4ge1xuICAgICAgaWYgKCFjb25maXJtKFwic3VwcHJpbWVyIGNlIHJlYWxpdHkgY2hlY2sgP1wiKSkgcmV0dXJuO1xuICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLmRlbGV0ZVJlYWxpdHlDaGVjayhyYy5pZCk7XG4gICAgICByZWZyZXNoKCk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3RhZ2U+XG4gICAgICAgIDxGcmFtZT5cbiAgICAgICAgICA8THVjaWRIZWFkZXJcbiAgICAgICAgICAgIGdvPXtnb31cbiAgICAgICAgICAgIHN1Yj1cInJlYWxpdHkgY2hlY2tzIFx1MjAxNCBwZXRpdHMgZ2VzdGVzIHJcdTAwRTlwXHUwMEU5dFx1MDBFOXMgZGFucyBsYSBqb3Vyblx1MDBFOWUuIHF1YW5kIHVuIHNpZ24gYXBwYXJhXHUwMEVFdCwgbCdoYWJpdHVkZSB0ZSBkaXQgOiBcdTAwQUIgZXN0LWNlIHF1ZSBqZSByXHUwMEVBdmUgPyBcdTAwQkJcIlxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDEwLCBtYXJnaW5Cb3R0b206IDIwLCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgICAgICA8QnRuIHByaW1hcnkgb25DbGljaz17c3RhcnRBZGR9PisgYWpvdXRlcjwvQnRuPlxuICAgICAgICAgICAgPEJ0biBvbkNsaWNrPXthc2tQZXJtfT5hY3RpdmVyIG5vdGlmaWNhdGlvbnM8L0J0bj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHthZGRpbmcgJiYgZHJhZnQgJiYgKFxuICAgICAgICAgICAgPENhcmQgdGl0bGU9XCJub3V2ZWF1IHJlYWxpdHkgY2hlY2tcIiBhY2NlbnQ+XG4gICAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cInRlY2huaXF1ZVwiPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtkcmFmdC50ZWNobmlxdWV9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHNldERyYWZ0KHsgLi4uZHJhZnQsIHRlY2huaXF1ZTogdiB9KX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1JDX1RFQ0hOSVFVRVNfRlJ9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9GaWVsZD5cblxuICAgICAgICAgICAgICB7ZHJhZnQudGVjaG5pcXVlID09PSBcImN1c3RvbVwiICYmIChcbiAgICAgICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJmb3JtdWxhdGlvbiBwZXJzb1wiPlxuICAgICAgICAgICAgICAgICAgPElucHV0XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXtkcmFmdC5jdXN0b21fbGFiZWx9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0RHJhZnQoeyAuLi5kcmFmdCwgY3VzdG9tX2xhYmVsOiB2IH0pfVxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImV4LiBjb21wdGUgdGVzIGRvaWd0c1wiXG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgPEZpZWxkIGxhYmVsPVwicXVhbmRcIiBoaW50PVwic2kgdHUgY2hvaXNpcyBcdTAwQUIgXHUwMEUwIGludGVydmFsbGVzIFx1MDBCQiwgZml4ZSBsYSBmclx1MDBFOXF1ZW5jZSBjaS1kZXNzb3VzLlwiPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtkcmFmdC50cmlnZ2VyX2NvbnRleHR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHNldERyYWZ0KHsgLi4uZHJhZnQsIHRyaWdnZXJfY29udGV4dDogdiB9KX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1JDX1RSSUdHRVJTX0ZSfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvRmllbGQ+XG5cbiAgICAgICAgICAgICAge2RyYWZ0LnRyaWdnZXJfY29udGV4dCA9PT0gXCJpbnRlcnZhbFwiICYmIChcbiAgICAgICAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICAgICAgICBsYWJlbD1cImZyXHUwMEU5cXVlbmNlXCJcbiAgICAgICAgICAgICAgICAgIHZhbHVlTGFiZWw9e2B0b3V0ZXMgbGVzICR7ZHJhZnQuaW50ZXJ2YWxfbWludXRlc30gbWluYH1cbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtkcmFmdC5pbnRlcnZhbF9taW51dGVzfVxuICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBzZXREcmFmdCh7IC4uLmRyYWZ0LCBpbnRlcnZhbF9taW51dGVzOiB2IH0pfVxuICAgICAgICAgICAgICAgICAgbWluPXszMH0gbWF4PXszNjB9IHN0ZXA9ezE1fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgPFNsaWRlclxuICAgICAgICAgICAgICAgIGxhYmVsPVwibWF4IHBhciBqb3VyXCJcbiAgICAgICAgICAgICAgICB2YWx1ZUxhYmVsPXtTdHJpbmcoZHJhZnQubWF4X3Blcl9kYXkgfHwgMyl9XG4gICAgICAgICAgICAgICAgdmFsdWU9e2RyYWZ0Lm1heF9wZXJfZGF5fVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0RHJhZnQoeyAuLi5kcmFmdCwgbWF4X3Blcl9kYXk6IHYgfSl9XG4gICAgICAgICAgICAgICAgbWluPXsxfSBtYXg9ezh9IHN0ZXA9ezF9XG4gICAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsIGdhcDogMTIgfX0+XG4gICAgICAgICAgICAgICAgPEZpZWxkIGxhYmVsPVwiYWN0aWYgZGVcIj5cbiAgICAgICAgICAgICAgICAgIDxJbnB1dCB0eXBlPVwidGltZVwiIHZhbHVlPXtkcmFmdC5hY3RpdmVfaG91cnNfc3RhcnR9XG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0RHJhZnQoeyAuLi5kcmFmdCwgYWN0aXZlX2hvdXJzX3N0YXJ0OiB2IH0pfSAvPlxuICAgICAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgICAgICAgPEZpZWxkIGxhYmVsPVwiXHUwMEUwXCI+XG4gICAgICAgICAgICAgICAgICA8SW5wdXQgdHlwZT1cInRpbWVcIiB2YWx1ZT17ZHJhZnQuYWN0aXZlX2hvdXJzX2VuZH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBzZXREcmFmdCh7IC4uLmRyYWZ0LCBhY3RpdmVfaG91cnNfZW5kOiB2IH0pfSAvPlxuICAgICAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cInZpYnJhdGlvblwiPlxuICAgICAgICAgICAgICAgIDxTZWxlY3RcbiAgICAgICAgICAgICAgICAgIHZhbHVlPXtkcmFmdC52aWJyYXRpb25fcGF0dGVybn1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0RHJhZnQoeyAuLi5kcmFmdCwgdmlicmF0aW9uX3BhdHRlcm46IHYgfSl9XG4gICAgICAgICAgICAgICAgICBvcHRpb25zPXtSQ19WSUJfRlJ9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9GaWVsZD5cblxuICAgICAgICAgICAgICA8VG9nZ2xlXG4gICAgICAgICAgICAgICAgb249eyEhZHJhZnQuc291bmRfZW5hYmxlZH1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXREcmFmdCh7IC4uLmRyYWZ0LCBzb3VuZF9lbmFibGVkOiAhZHJhZnQuc291bmRfZW5hYmxlZCB9KX1cbiAgICAgICAgICAgICAgICBsYWJlbD1cInNvbiBkaXNjcmV0XCJcbiAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDEwLCBtYXJnaW5Ub3A6IDE4IH19PlxuICAgICAgICAgICAgICAgIDxCdG4gcHJpbWFyeSBvbkNsaWNrPXtzYXZlfT5lbnJlZ2lzdHJlcjwvQnRuPlxuICAgICAgICAgICAgICAgIDxCdG4gZ2hvc3Qgb25DbGljaz17KCkgPT4geyBzZXRBZGRpbmcoZmFsc2UpOyBzZXREcmFmdChudWxsKTsgfX0+YW5udWxlcjwvQnRuPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge2xvYWRpbmcgJiYgPGRpdiBzdHlsZT17eyBjb2xvcjogVC50ZXh0RGltLCBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+Y2hhcmdlbWVudFx1MjAyNjwvZGl2Pn1cbiAgICAgICAgICB7IWxvYWRpbmcgJiYgY2hlY2tzLmxlbmd0aCA9PT0gMCAmJiAhYWRkaW5nICYmIChcbiAgICAgICAgICAgIDxDYXJkPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgcGFkZGluZzogXCIyMHB4IDBcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgYXVjdW4gcmVhbGl0eSBjaGVjayBwb3VyIGwnaW5zdGFudC5cbiAgICAgICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+bGVzIGNsYXNzaXF1ZXMgOiA8ZW0+cmVnYXJkZSB0ZXMgbWFpbnM8L2VtPiwgPGVtPmxpcyB1biB0ZXh0ZSBkZXV4IGZvaXM8L2VtPiwgPGVtPmVzdC1jZSBxdWUgamUgclx1MDBFQXZlID88L2VtPjwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtjaGVja3MubWFwKChyYykgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGVjaExhYmVsID0gUkNfVEVDSE5JUVVFU19GUi5maW5kKCh4KSA9PiB4LnZhbHVlID09PSByYy50ZWNobmlxdWUpPy5sYWJlbCB8fCByYy50ZWNobmlxdWU7XG4gICAgICAgICAgICBjb25zdCB0cmlnTGFiZWwgPSBSQ19UUklHR0VSU19GUi5maW5kKCh4KSA9PiB4LnZhbHVlID09PSByYy50cmlnZ2VyX2NvbnRleHQpPy5sYWJlbCB8fCBcImludGVydmFsbGVcIjtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxDYXJkIGtleT17cmMuaWR9PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJmbGV4LXN0YXJ0XCIsIGdhcDogMTIgfX0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNywgY29sb3I6IFQudGV4dCwgbWFyZ2luQm90dG9tOiA2LFxuICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7cmMuY3VzdG9tX2xhYmVsIHx8IHRlY2hMYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMSwgY29sb3I6IFQudGV4dERpbSwgbGV0dGVyU3BhY2luZzogXCIwLjA0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge3RyaWdMYWJlbH1cbiAgICAgICAgICAgICAgICAgICAgICB7cmMudHJpZ2dlcl9jb250ZXh0ID09PSBcImludGVydmFsXCIgJiYgYCBcdTAwQjcgdG91dGVzIGxlcyAke3JjLmludGVydmFsX21pbnV0ZXN9IG1pbmB9XG4gICAgICAgICAgICAgICAgICAgICAge2AgXHUwMEI3ICR7cmMuYWN0aXZlX2hvdXJzX3N0YXJ0fVx1MjAxMyR7cmMuYWN0aXZlX2hvdXJzX2VuZH1gfVxuICAgICAgICAgICAgICAgICAgICAgIHtgIFx1MDBCNyBtYXggJHtyYy5tYXhfcGVyX2RheSB8fCAzfS9qYH1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMSwgY29sb3I6IFQuYWNjZW50LCBtYXJnaW5Ub3A6IDQsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtyYy5wZXJmb3JtZWRfY291bnQgfHwgMH0gZmFpdHsocmMucGVyZm9ybWVkX2NvdW50IHx8IDApID4gMSA/IFwic1wiIDogXCJcIn1cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogNiwgZmxleFNocmluazogMCB9fT5cbiAgICAgICAgICAgICAgICAgICAgPEJ0biBwcmltYXJ5PXshIXJjLmVuYWJsZWR9IG9uQ2xpY2s9eygpID0+IHRvZ2dsZShyYyl9IHN0eWxlPXt7IHBhZGRpbmc6IFwiNnB4IDEycHhcIiwgZm9udFNpemU6IDEyIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtyYy5lbmFibGVkID8gXCJhY3RpZlwiIDogXCJvZmZcIn1cbiAgICAgICAgICAgICAgICAgICAgPC9CdG4+XG4gICAgICAgICAgICAgICAgICAgIDxCdG4gZGFuZ2VyIG9uQ2xpY2s9eygpID0+IHJlbW92ZShyYyl9IHN0eWxlPXt7IHBhZGRpbmc6IFwiNnB4IDEwcHhcIiwgZm9udFNpemU6IDEyIH19Plx1MDBENzwvQnRuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvRnJhbWU+XG4gICAgICAgIDxMdWNpZFRhYnMgZ289e2dvfSBjdXJyZW50PVwicmNcIiAvPlxuICAgICAgPC9TdGFnZT5cbiAgICApO1xuICB9O1xuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyAzLiBEUkVBTSBTSUdOUyAocm91dGUgbHVjaWQtZHJlYW0tc2lnbnMpIFx1MjAxNCBMLjRcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGNvbnN0IFNJR05fQ0FUX0ZSID0gW1xuICAgIHsgdmFsdWU6IFwiXCIsICAgICAgICAgIGxhYmVsOiBcIlx1MjAxNFwiIH0sXG4gICAgeyB2YWx1ZTogXCJjaGFyYWN0ZXJcIiwgbGFiZWw6IFwicGVyc29ubmFnZVwiIH0sXG4gICAgeyB2YWx1ZTogXCJsb2NhdGlvblwiLCAgbGFiZWw6IFwibGlldVwiIH0sXG4gICAgeyB2YWx1ZTogXCJvYmplY3RcIiwgICAgbGFiZWw6IFwib2JqZXRcIiB9LFxuICAgIHsgdmFsdWU6IFwiYWN0aW9uXCIsICAgIGxhYmVsOiBcImFjdGlvblwiIH0sXG4gICAgeyB2YWx1ZTogXCJlbW90aW9uXCIsICAgbGFiZWw6IFwiXHUwMEU5bW90aW9uXCIgfSxcbiAgXTtcbiAgY29uc3QgQ0FUX0NPTE9SID0ge1xuICAgIGNoYXJhY3RlcjogXCIjQzQ2QjNEXCIsICAvLyBlbWJlclxuICAgIGxvY2F0aW9uOiAgXCIjN0U5REJBXCIsICAvLyBzdG9uZS1jb29sXG4gICAgb2JqZWN0OiAgICBcIiNBODk0NjlcIixcbiAgICBhY3Rpb246ICAgIFwiI0M4QTY1OFwiLCAgLy8gc2lsay1nb2xkXG4gICAgZW1vdGlvbjogICBcIiM5RTdCQjBcIixcbiAgfTtcblxuICBjb25zdCBMdWNpZERyZWFtU2lnbnNTY3JlZW4gPSAoeyBnbyB9KSA9PiB7XG4gICAgY29uc3QgW3NpZ25zLCBzZXRTaWduc10gPSB1UyhbXSk7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdVModHJ1ZSk7XG4gICAgY29uc3QgW25ld0xhYmVsLCBzZXROZXdMYWJlbF0gPSB1UyhcIlwiKTtcbiAgICBjb25zdCBbbmV3Q2F0LCBzZXROZXdDYXRdID0gdVMoXCJcIik7XG4gICAgY29uc3QgW3Nob3dUdXRvLCBzZXRTaG93VHV0b10gPSB1UyhmYWxzZSk7XG4gICAgY29uc3QgW3N1Z2dlc3RpbmcsIHNldFN1Z2dlc3RpbmddID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtzdWdnZXN0Tm90ZSwgc2V0U3VnZ2VzdE5vdGVdID0gdVMoXCJcIik7XG5cbiAgICBjb25zdCByZWZyZXNoID0gYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5saXN0RHJlYW1TaWducygpO1xuICAgICAgICBzZXRTaWducyhyZXM/LmRyZWFtX3NpZ25zIHx8IFtdKTtcbiAgICAgIH0gZmluYWxseSB7IHNldExvYWRpbmcoZmFsc2UpOyB9XG4gICAgfTtcbiAgICB1RSgoKSA9PiB7IHJlZnJlc2goKTsgfSwgW10pO1xuXG4gICAgY29uc3QgYWRkID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbGFiZWwgPSAobmV3TGFiZWwgfHwgXCJcIikudHJpbSgpO1xuICAgICAgaWYgKCFsYWJlbCkgcmV0dXJuO1xuICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLmFkZERyZWFtU2lnbihsYWJlbCwgbmV3Q2F0IHx8IG51bGwpO1xuICAgICAgc2V0TmV3TGFiZWwoXCJcIik7IHNldE5ld0NhdChcIlwiKTtcbiAgICAgIHJlZnJlc2goKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc3VnZ2VzdElBID0gYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0U3VnZ2VzdGluZyh0cnVlKTtcbiAgICAgIHNldFN1Z2dlc3ROb3RlKFwiXCIpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLnN1Z2dlc3REcmVhbVNpZ25zKCk7XG4gICAgICAgIGNvbnN0IG4gPSAocmVzPy5zdWdnZXN0aW9ucyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBpZiAobiA+IDApIHtcbiAgICAgICAgICBzZXRTdWdnZXN0Tm90ZShgJHtufSBzdWdnZXN0aW9uJHtuID4gMSA/IFwic1wiIDogXCJcIn0gYWpvdXRcdTAwRTllJHtuID4gMSA/IFwic1wiIDogXCJcIn0gKFx1MDBFMCBjb25maXJtZXIgXHUyNjA1KS5gKTtcbiAgICAgICAgICByZWZyZXNoKCk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzPy5yZWFzb24pIHtcbiAgICAgICAgICBzZXRTdWdnZXN0Tm90ZShyZXMucmVhc29uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRTdWdnZXN0Tm90ZShcIkF1Y3VuZSByXHUwMEU5Y3VycmVuY2UgY2xhaXJlIGRcdTAwRTl0ZWN0XHUwMEU5ZSBwb3VyIGwnaW5zdGFudC5cIik7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgc2V0U3VnZ2VzdE5vdGUoXCJFcnJldXIgOiBcIiArIChlLm1lc3NhZ2UgfHwgXCJpbmNvbm51ZVwiKSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRTdWdnZXN0aW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgdG9nZ2xlUGVyc29uYWwgPSBhc3luYyAocykgPT4ge1xuICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLnVwZGF0ZURyZWFtU2lnbihzLmlkLCB7IGlzX3BlcnNvbmFsX3NpZ246ICFzLmlzX3BlcnNvbmFsX3NpZ24gfSk7XG4gICAgICByZWZyZXNoKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbW92ZSA9IGFzeW5jIChpZCkgPT4ge1xuICAgICAgaWYgKCFjb25maXJtKFwic3VwcHJpbWVyIGNlIGRyZWFtIHNpZ24gP1wiKSkgcmV0dXJuO1xuICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLmRlbGV0ZURyZWFtU2lnbihpZCk7XG4gICAgICByZWZyZXNoKCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHRvcCA9IHNpZ25zLnNsaWNlKDAsIDMwKTtcbiAgICBjb25zdCBwZXJzb25hbCA9IHNpZ25zLmZpbHRlcigocykgPT4gcy5pc19wZXJzb25hbF9zaWduKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3RhZ2U+XG4gICAgICAgIDxGcmFtZT5cbiAgICAgICAgICA8THVjaWRIZWFkZXJcbiAgICAgICAgICAgIGdvPXtnb31cbiAgICAgICAgICAgIHN1Yj1cImRyZWFtIHNpZ25zIFx1MjAxNCBcdTAwRTlsXHUwMEU5bWVudHMgcXVpIHJldmllbm5lbnQgZGFucyB0ZXMgclx1MDBFQXZlcy4gcXVhbmQgdHUgbGVzIHZvaXMsIHRvbiBhdHRlbnRpb24gcGV1dCBiYXNjdWxlciBlbiBsdWNpZGl0XHUwMEU5LlwiXG4gICAgICAgICAgLz5cblxuICAgICAgICAgIHsvKiBQZXJzb25hbCBzaWducyBpbiBmb2N1cyAqL31cbiAgICAgICAgICB7cGVyc29uYWwubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8Q2FyZCB0aXRsZT1cIlx1MjYwNSB0ZXMgZHJlYW0gc2lnbnMgcGVyc29ubmVsc1wiIGFjY2VudD5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0RGltLCBtYXJnaW5Cb3R0b206IDEyLCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHBvdXIgY2hhY3VuLCBmb3JtdWxlIGwnaW50ZW50aW9uIE1JTEQgOlxuICAgICAgICAgICAgICAgIDxiciAvPlxuICAgICAgICAgICAgICAgIDxlbSBzdHlsZT17eyBjb2xvcjogVC50ZXh0IH19Plx1MDBBQiBsYSBwcm9jaGFpbmUgZm9pcyBxdWUgamUgdm9pcyBbe3BlcnNvbmFsLm1hcCgocCkgPT4gcC5zaWduX2xhYmVsKS5qb2luKFwiLCBcIil9XSwgamUgZGV2aWVucyBsdWNpZGUuIFx1MDBCQjwvZW0+XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleFdyYXA6IFwid3JhcFwiLCBnYXA6IDggfX0+XG4gICAgICAgICAgICAgICAge3BlcnNvbmFsLm1hcCgocykgPT4gKFxuICAgICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtzLmlkfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFQuYWNjZW50LFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjZweCAxNHB4XCIsIGJvcmRlclJhZGl1czogMTAwLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtULmFjY2VudH1gLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkLCAjQzhBNjU4KSA4JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgXHUyNjA1IHtzLnNpZ25fbGFiZWx9XG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7LyogQWRkIG1hbnVhbCAqL31cbiAgICAgICAgICA8Q2FyZCB0aXRsZT1cImFqb3V0ZXIgdW4gZHJlYW0gc2lnblwiPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIyZnIgMWZyIGF1dG9cIiwgZ2FwOiA4IH19PlxuICAgICAgICAgICAgICA8SW5wdXQgdmFsdWU9e25ld0xhYmVsfSBvbkNoYW5nZT17c2V0TmV3TGFiZWx9IHBsYWNlaG9sZGVyPVwiZXguIGVzY2FsaWVycywgZWF1LCBtYWlzb24gZCdlbmZhbmNlXCIgLz5cbiAgICAgICAgICAgICAgPFNlbGVjdCB2YWx1ZT17bmV3Q2F0fSBvbkNoYW5nZT17c2V0TmV3Q2F0fSBvcHRpb25zPXtTSUdOX0NBVF9GUn0gLz5cbiAgICAgICAgICAgICAgPEJ0biBwcmltYXJ5IG9uQ2xpY2s9e2FkZH0+KzwvQnRuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMTIsIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDEwLCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgICAgICAgIDxCdG4gZ2hvc3Qgb25DbGljaz17c3VnZ2VzdElBfSBkaXNhYmxlZD17c3VnZ2VzdGluZ30gc3R5bGU9e3sgZm9udFNpemU6IDEyIH19PlxuICAgICAgICAgICAgICAgIHtzdWdnZXN0aW5nID8gXCJhbmFseXNlIGVuIGNvdXJzXHUyMDI2XCIgOiBcIlx1MjcyNiBwcm9wb3NlciAzIHN1Z2dlc3Rpb25zIChJQSBcdTAwQjcgMzAgZGVybmllcnMgclx1MDBFQXZlcylcIn1cbiAgICAgICAgICAgICAgPC9CdG4+XG4gICAgICAgICAgICAgIHtzdWdnZXN0Tm90ZSAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAge3N1Z2dlc3ROb3RlfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvQ2FyZD5cblxuICAgICAgICAgIHsvKiBUdXRvIHRyaWdnZXIgKi99XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDE0IH19PlxuICAgICAgICAgICAgPEJ0biBnaG9zdCBvbkNsaWNrPXsoKSA9PiBzZXRTaG93VHV0bygodikgPT4gIXYpfT5cbiAgICAgICAgICAgICAge3Nob3dUdXRvID8gXCJcdTIxOTEgcmVwbGllclwiIDogXCJcdTIxOTMgcG91cnF1b2kgbGVzIGRyZWFtIHNpZ25zID9cIn1cbiAgICAgICAgICAgIDwvQnRuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtzaG93VHV0byAmJiAoXG4gICAgICAgICAgICA8Q2FyZD5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTUsIGNvbG9yOiBULnRleHQsIGxpbmVIZWlnaHQ6IDEuNywgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgICAgIExhQmVyZ2UgJiBUaG9sZXkgb250IG5vdFx1MDBFOSBxdWUgbGEgcGx1cGFydCBkZXMgclx1MDBFQXZlcyBjb250aWVubmVudCBkZXNcbiAgICAgICAgICAgICAgICA8ZW0gc3R5bGU9e3sgY29sb3I6IFQuYWNjZW50IH19PiBtb3RpZnMgclx1MDBFOWN1cnJlbnRzIDwvZW0+IHByb3ByZXMgXHUwMEUwIGNoYXF1ZSByXHUwMEVBdmV1ci5cbiAgICAgICAgICAgICAgICBVbiBkcmVhbSBzaWduLCBjJ2VzdCB1biBkZSBjZXMgbW90aWZzLlxuICAgICAgICAgICAgICAgIFNpIHR1IGx1aSBkXHUwMEU5ZGllcyB1bmUgaW50ZW50aW9uIHByXHUwMEU5LXNvbW1laWwgXHUyMDE0IGxhIHByYXRpcXVlIDxlbT5NSUxEPC9lbT4gXHUyMDE0IGlsIGRldmllbnQgdW4gZFx1MDBFOWNsZW5jaGV1ciBkZSBsdWNpZGl0XHUwMEU5IGRhbnMgbGUgclx1MDBFQXZlLlxuICAgICAgICAgICAgICAgIDxiciAvPjxiciAvPlxuICAgICAgICAgICAgICAgIE1hcnF1ZSB1biBkcmVhbSBzaWduIGF2ZWMgPGVtPlx1MjYwNTwvZW0+IHBvdXIgbGUgcGFzc2VyIGVuIDxlbT5wZXJzb25uZWw8L2VtPiA6IGlsIHNlcmEgbWlzIGVuIGF2YW50IHBvdXIgdG9uIGludGVudGlvbiBNSUxELlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBMaXN0ICovfVxuICAgICAgICAgIHtsb2FkaW5nICYmIDxkaXYgc3R5bGU9e3sgY29sb3I6IFQudGV4dERpbSwgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PmNoYXJnZW1lbnRcdTIwMjY8L2Rpdj59XG4gICAgICAgICAgeyFsb2FkaW5nICYmIHNpZ25zLmxlbmd0aCA9PT0gMCAmJiAoXG4gICAgICAgICAgICA8Q2FyZD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0RGltLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIHBhZGRpbmc6IFwiMTZweCAwXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIGF1Y3VuIGRyZWFtIHNpZ24gZFx1MDBFOXRlY3RcdTAwRTkuIGFqb3V0ZS1lbiB1biBtYW51ZWxsZW1lbnQsXG4gICAgICAgICAgICAgICAgPGJyIC8+b3UgbGFpc3NlIGwnZXh0cmFjdGlvbiBhdXRvbWF0aXF1ZSBmYWlyZSBzb24gdHJhdmFpbFxuICAgICAgICAgICAgICAgIHF1YW5kIHR1IGRcdTAwRTlwb3NlcyBkZXMgclx1MDBFQXZlcy5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHt0b3AubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8Q2FyZCB0aXRsZT17YHR1IHZvaXMgc291dmVudCAoJHtzaWducy5sZW5ndGh9KWB9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDAgfX0+XG4gICAgICAgICAgICAgICAge3RvcC5tYXAoKHMpID0+IChcbiAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtzLmlkfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEycHggMFwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgICAgICAgICAgICBnYXA6IDEwLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGdhcDogMTAsIGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gdG9nZ2xlUGVyc29uYWwocyl9IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogcy5pc19wZXJzb25hbF9zaWduID8gVC5hY2NlbnQgOiBULnRleHRNdXRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxOCwgcGFkZGluZzogNCxcbiAgICAgICAgICAgICAgICAgICAgICB9fSBhcmlhLWxhYmVsPVwibWFycXVlciBwZXJzb25uZWxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHtzLmlzX3BlcnNvbmFsX3NpZ24gPyBcIlx1MjYwNVwiIDogXCJcdTI2MDZcIn1cbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIG1pbldpZHRoOiAwIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNiwgY29sb3I6IFQudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7cy5zaWduX2xhYmVsfVxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDEwLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDZlbVwiLCBtYXJnaW5Ub3A6IDIsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAge3Muc2lnbl9jYXRlZ29yeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBDQVRfQ09MT1Jbcy5zaWduX2NhdGVnb3J5XSB8fCBULnRleHREaW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5SaWdodDogOCwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtTSUdOX0NBVF9GUi5maW5kKChjKSA9PiBjLnZhbHVlID09PSBzLnNpZ25fY2F0ZWdvcnkpPy5sYWJlbCB8fCBzLnNpZ25fY2F0ZWdvcnl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBcdTAwRDd7cy5vY2N1cnJlbmNlc19jb3VudCB8fCAxfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB7cy50cmlnZ2VyZWRfbHVjaWRpdHlfY291bnQgPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogVC5hY2NlbnQsIG1hcmdpbkxlZnQ6IDggfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdTAwQjcge3MudHJpZ2dlcmVkX2x1Y2lkaXR5X2NvdW50fSBsdWNpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPEJ0biBkYW5nZXIgb25DbGljaz17KCkgPT4gcmVtb3ZlKHMuaWQpfSBzdHlsZT17eyBwYWRkaW5nOiBcIjRweCAxMHB4XCIsIGZvbnRTaXplOiAxMSB9fT5cdTAwRDc8L0J0bj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICApfVxuICAgICAgICA8L0ZyYW1lPlxuICAgICAgICA8THVjaWRUYWJzIGdvPXtnb30gY3VycmVudD1cInNpZ25zXCIgLz5cbiAgICAgIDwvU3RhZ2U+XG4gICAgKTtcbiAgfTtcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gNC4gV0JUQiAocm91dGUgbHVjaWQtd2J0YikgXHUyMDE0IEwuNVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgY29uc3QgREFZU19GUiA9IFtcbiAgICB7IHZhbHVlOiBcIm1vblwiLCBsYWJlbDogXCJsdW5cIiB9LFxuICAgIHsgdmFsdWU6IFwidHVlXCIsIGxhYmVsOiBcIm1hclwiIH0sXG4gICAgeyB2YWx1ZTogXCJ3ZWRcIiwgbGFiZWw6IFwibWVyXCIgfSxcbiAgICB7IHZhbHVlOiBcInRodVwiLCBsYWJlbDogXCJqZXVcIiB9LFxuICAgIHsgdmFsdWU6IFwiZnJpXCIsIGxhYmVsOiBcInZlblwiIH0sXG4gICAgeyB2YWx1ZTogXCJzYXRcIiwgbGFiZWw6IFwic2FtXCIgfSxcbiAgICB7IHZhbHVlOiBcInN1blwiLCBsYWJlbDogXCJkaW1cIiB9LFxuICBdO1xuICBjb25zdCBTT1VORF9QUk9GSUxFUyA9IFtcbiAgICB7IHZhbHVlOiBcImdlbnRsZVwiLCAgICAgICAgIGxhYmVsOiBcImRvdXggKGNsb2NoZSBmZXV0clx1MDBFOWUpXCIgfSxcbiAgICB7IHZhbHVlOiBcImNoaW1lXCIsICAgICAgICAgIGxhYmVsOiBcImNhcmlsbG9uIGNsYWlyXCIgfSxcbiAgICB7IHZhbHVlOiBcInZpYnJhdGlvbl9vbmx5XCIsIGxhYmVsOiBcInZpYnJhdGlvbiB1bmlxdWVtZW50XCIgfSxcbiAgXTtcblxuICBjb25zdCBMdWNpZFdCVEJTY3JlZW4gPSAoeyBnbyB9KSA9PiB7XG4gICAgY29uc3QgW2FsYXJtcywgc2V0QWxhcm1zXSA9IHVTKFtdKTtcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1Uyh0cnVlKTtcbiAgICBjb25zdCBbYWRkaW5nLCBzZXRBZGRpbmddID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtkcmFmdCwgc2V0RHJhZnRdID0gdVMobnVsbCk7XG5cbiAgICBjb25zdCByZWZyZXNoID0gYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5saXN0V0JUQkFsYXJtcygpO1xuICAgICAgICBzZXRBbGFybXMocmVzPy5hbGFybXMgfHwgW10pO1xuICAgICAgfSBmaW5hbGx5IHsgc2V0TG9hZGluZyhmYWxzZSk7IH1cbiAgICB9O1xuICAgIHVFKCgpID0+IHsgcmVmcmVzaCgpOyB9LCBbXSk7XG5cbiAgICBjb25zdCBzdGFydEFkZCA9ICgpID0+IHtcbiAgICAgIHNldERyYWZ0KHtcbiAgICAgICAgYmVkdGltZTogXCIyMzowMFwiLFxuICAgICAgICB3YWtlX3RpbWU6IFwiMDQ6MzBcIixcbiAgICAgICAgYmFja190b19zbGVlcF9taW51dGVzOiAyMCxcbiAgICAgICAgYWN0aXZlX2RheXM6IFtcIm1vblwiLCBcInR1ZVwiLCBcIndlZFwiLCBcInRodVwiLCBcImZyaVwiLCBcInNhdFwiLCBcInN1blwiXSxcbiAgICAgICAgaW50ZW50aW9uX3RleHQ6IFwiamUgdmFpcyByZXRvdXJuZXIgZG9ybWlyLCBldCBqZSB2YWlzIHJlY29ubmFcdTAwRUV0cmUgcXVlIGplIHJcdTAwRUF2ZS5cIixcbiAgICAgICAgc291bmRfcHJvZmlsZTogXCJnZW50bGVcIixcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0pO1xuICAgICAgc2V0QWRkaW5nKHRydWUpO1xuICAgIH07XG5cbiAgICBjb25zdCBzYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLmNyZWF0ZVdCVEJBbGFybShkcmFmdCk7XG4gICAgICAgIHNldEFkZGluZyhmYWxzZSk7XG4gICAgICAgIHNldERyYWZ0KG51bGwpO1xuICAgICAgICByZWZyZXNoKCk7XG4gICAgICB9IGNhdGNoIChlKSB7IGFsZXJ0KFwiZXJyZXVyIDogXCIgKyBlLm1lc3NhZ2UpOyB9XG4gICAgfTtcblxuICAgIGNvbnN0IHJlbW92ZSA9IGFzeW5jIChpZCkgPT4ge1xuICAgICAgaWYgKCFjb25maXJtKFwic3VwcHJpbWVyIGNldHRlIGFsYXJtZSA/XCIpKSByZXR1cm47XG4gICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZGVsZXRlV0JUQkFsYXJtKGlkKTtcbiAgICAgIHJlZnJlc2goKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdG9nZ2xlRW5hYmxlZCA9IGFzeW5jIChhKSA9PiB7XG4gICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkudXBkYXRlV0JUQkFsYXJtKGEuaWQsIHsgZW5hYmxlZDogIWEuZW5hYmxlZCB9KTtcbiAgICAgIHJlZnJlc2goKTtcbiAgICB9O1xuXG4gICAgY29uc3QgdG9nZ2xlRGF5ID0gKGQpID0+IHtcbiAgICAgIGlmICghZHJhZnQpIHJldHVybjtcbiAgICAgIGNvbnN0IGRheXMgPSBkcmFmdC5hY3RpdmVfZGF5cy5pbmNsdWRlcyhkKVxuICAgICAgICA/IGRyYWZ0LmFjdGl2ZV9kYXlzLmZpbHRlcigoeCkgPT4geCAhPT0gZClcbiAgICAgICAgOiBbLi4uZHJhZnQuYWN0aXZlX2RheXMsIGRdO1xuICAgICAgc2V0RHJhZnQoeyAuLi5kcmFmdCwgYWN0aXZlX2RheXM6IGRheXMgfSk7XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3RhZ2U+XG4gICAgICAgIDxGcmFtZT5cbiAgICAgICAgICA8THVjaWRIZWFkZXJcbiAgICAgICAgICAgIGdvPXtnb31cbiAgICAgICAgICAgIHN1Yj1cIldCVEIgKFdha2UgQmFjayBUbyBCZWQpIFx1MjAxNCByXHUwMEU5dmVpbGxlLXRvaSA0XHUyMDEzNmggYXByXHUwMEU4cyBsJ2VuZG9ybWlzc2VtZW50LCByZXN0ZSBsdWNpZGUgMTVcdTIwMTMzMCBtaW4sIHJldG91cm5lIGRvcm1pciBhdmVjIHVuZSBpbnRlbnRpb24uXCJcbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgPEJ0biBwcmltYXJ5IG9uQ2xpY2s9e3N0YXJ0QWRkfSBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDIwIH19PisgY3JcdTAwRTllciB1bmUgYWxhcm1lPC9CdG4+XG5cbiAgICAgICAgICB7YWRkaW5nICYmIGRyYWZ0ICYmIChcbiAgICAgICAgICAgIDxDYXJkIHRpdGxlPVwibm91dmVsbGUgYWxhcm1lIFdCVEJcIiBhY2NlbnQ+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLCBnYXA6IDEyIH19PlxuICAgICAgICAgICAgICAgIDxGaWVsZCBsYWJlbD1cImhldXJlIGRlIGNvdWNoZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxJbnB1dCB0eXBlPVwidGltZVwiIHZhbHVlPXtkcmFmdC5iZWR0aW1lfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHNldERyYWZ0KHsgLi4uZHJhZnQsIGJlZHRpbWU6IHYgfSl9IC8+XG4gICAgICAgICAgICAgICAgPC9GaWVsZD5cbiAgICAgICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJyXHUwMEU5dmVpbCBXQlRCXCJcbiAgICAgICAgICAgICAgICAgIGhpbnQ9XCJzb3V2ZW50IDRoMzBcdTIwMTM2aCBhcHJcdTAwRThzIGxlIGNvdWNoZXIgKHBlbmRhbnQgdW4gY3ljbGUgUkVNIHRhcmRpZikuXCI+XG4gICAgICAgICAgICAgICAgICA8SW5wdXQgdHlwZT1cInRpbWVcIiB2YWx1ZT17ZHJhZnQud2FrZV90aW1lfVxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KHYpID0+IHNldERyYWZ0KHsgLi4uZHJhZnQsIHdha2VfdGltZTogdiB9KX0gLz5cbiAgICAgICAgICAgICAgICA8L0ZpZWxkPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICA8U2xpZGVyXG4gICAgICAgICAgICAgICAgbGFiZWw9XCJyZXN0ZXIgXHUwMEU5dmVpbGxcdTAwRTlcIlxuICAgICAgICAgICAgICAgIHZhbHVlTGFiZWw9e2Ake2RyYWZ0LmJhY2tfdG9fc2xlZXBfbWludXRlc30gbWluYH1cbiAgICAgICAgICAgICAgICB2YWx1ZT17ZHJhZnQuYmFja190b19zbGVlcF9taW51dGVzfVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0RHJhZnQoeyAuLi5kcmFmdCwgYmFja190b19zbGVlcF9taW51dGVzOiB2IH0pfVxuICAgICAgICAgICAgICAgIG1pbj17NX0gbWF4PXs0NX0gc3RlcD17NX1cbiAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJ0ZXh0ZSBkJ2ludGVudGlvblwiXG4gICAgICAgICAgICAgICAgaGludD1cImNlIHF1ZSB0dSB2YXMgdGUgclx1MDBFOXBcdTAwRTl0ZXIgZW4gcmV0b3VybmFudCBkb3JtaXIuXCI+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17ZHJhZnQuaW50ZW50aW9uX3RleHR9XG4gICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldERyYWZ0KHsgLi4uZHJhZnQsIGludGVudGlvbl90ZXh0OiBlLnRhcmdldC52YWx1ZSB9KX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIiwgbWluSGVpZ2h0OiA2MCxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogVC5iZywgYm9yZGVyOiBgMXB4IHNvbGlkICR7VC5ib3JkZXJ9YCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTUsIHBhZGRpbmc6IDEyLCBvdXRsaW5lOiBcIm5vbmVcIiwgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9GaWVsZD5cblxuICAgICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJzb25cIj5cbiAgICAgICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgICAgICB2YWx1ZT17ZHJhZnQuc291bmRfcHJvZmlsZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0RHJhZnQoeyAuLi5kcmFmdCwgc291bmRfcHJvZmlsZTogdiB9KX1cbiAgICAgICAgICAgICAgICAgIG9wdGlvbnM9e1NPVU5EX1BST0ZJTEVTfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvRmllbGQ+XG5cbiAgICAgICAgICAgICAgPEZpZWxkIGxhYmVsPVwiam91cnMgYWN0aWZzXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZ2FwOiA2LCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgICAgICAgICAgICB7REFZU19GUi5tYXAoKGQpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPENoaXAga2V5PXtkLnZhbHVlfVxuICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZT17ZHJhZnQuYWN0aXZlX2RheXMuaW5jbHVkZXMoZC52YWx1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdG9nZ2xlRGF5KGQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge2QubGFiZWx9XG4gICAgICAgICAgICAgICAgICAgIDwvQ2hpcD5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L0ZpZWxkPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDEyLCBtYXJnaW5Cb3R0b206IDQsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dE11dGVkLCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIG5vdGUgOiBsZSBkXHUwMEU5Y2xlbmNoZW1lbnQgclx1MDBFOWVsIGRlbWFuZGUgbCdhcHAgbmF0aXZlXG4gICAgICAgICAgICAgICAgKENhcGFjaXRvciArIG5vdGlmaWNhdGlvbnMgbG9jYWxlcykuIGVuIHdlYiwgbCdhbGFybWUgcmVzdGVcbiAgICAgICAgICAgICAgICBlbiBtXHUwMEU5bW9pcmUgOyBhY3RpdmUgbGVzIG5vdGlmaWNhdGlvbnMgbmF0aXZlcyBxdWFuZCB0dSBpbnN0YWxsZXNcbiAgICAgICAgICAgICAgICBEcmVhbSBjb21tZSBhcHAuXG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogMTAsIG1hcmdpblRvcDogMTYgfX0+XG4gICAgICAgICAgICAgICAgPEJ0biBwcmltYXJ5IG9uQ2xpY2s9e3NhdmV9PmNyXHUwMEU5ZXIgbCdhbGFybWU8L0J0bj5cbiAgICAgICAgICAgICAgICA8QnRuIGdob3N0IG9uQ2xpY2s9eygpID0+IHsgc2V0QWRkaW5nKGZhbHNlKTsgc2V0RHJhZnQobnVsbCk7IH19PmFubnVsZXI8L0J0bj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHtsb2FkaW5nICYmIDxkaXYgc3R5bGU9e3sgY29sb3I6IFQudGV4dERpbSwgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PmNoYXJnZW1lbnRcdTIwMjY8L2Rpdj59XG4gICAgICAgICAgeyFsb2FkaW5nICYmIGFsYXJtcy5sZW5ndGggPT09IDAgJiYgIWFkZGluZyAmJiAoXG4gICAgICAgICAgICA8Q2FyZD5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIHBhZGRpbmc6IFwiMTZweCAwXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIGF1Y3VuZSBhbGFybWUgV0JUQi4gbGEgcHJhdGlxdWUgZGVtYW5kZSBkZSBsYSByXHUwMEU5Z3VsYXJpdFx1MDBFOSBcdTIwMTRcbiAgICAgICAgICAgICAgICA8YnIgLz5jb21tZW5jZSBwYXIgMSBvdSAyIG51aXRzIHBhciBzZW1haW5lLlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAge2FsYXJtcy5tYXAoKGEpID0+IChcbiAgICAgICAgICAgIDxDYXJkIGtleT17YS5pZH0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJmbGV4LXN0YXJ0XCIsIGdhcDogMTIgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxLCBtaW5XaWR0aDogMCB9fT5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTcsIGNvbG9yOiBULnRleHQsIG1hcmdpbkJvdHRvbTogNixcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICBjb3VjaGVyIHthLmJlZHRpbWV9IFx1MjE5MiByXHUwMEU5dmVpbCA8c3BhbiBzdHlsZT17eyBjb2xvcjogVC5hY2NlbnQgfX0+e2Eud2FrZV90aW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMSwgY29sb3I6IFQudGV4dERpbSwgbGV0dGVyU3BhY2luZzogXCIwLjA0ZW1cIixcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICB7YS5iYWNrX3RvX3NsZWVwX21pbnV0ZXN9IG1pbiBcdTAwRTl2ZWlsbFx1MDBFOSBcdTAwQjcgeyhhLmFjdGl2ZV9kYXlzIHx8IFtdKS5tYXAoKGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zdCB4ID0gREFZU19GUi5maW5kKCh5KSA9PiB5LnZhbHVlID09PSBkKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4geCA/IHgubGFiZWwgOiBkO1xuICAgICAgICAgICAgICAgICAgICB9KS5qb2luKFwiLCBcIil9XG4gICAgICAgICAgICAgICAgICAgIHthLnNvdW5kX3Byb2ZpbGUgJiYgYCBcdTAwQjcgJHtTT1VORF9QUk9GSUxFUy5maW5kKChzKSA9PiBzLnZhbHVlID09PSBhLnNvdW5kX3Byb2ZpbGUpPy5sYWJlbCB8fCBhLnNvdW5kX3Byb2ZpbGV9YH1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAge2EuaW50ZW50aW9uX3RleHQgJiYgKFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dERpbSwgbWFyZ2luVG9wOiA4LCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyTGVmdDogYDJweCBzb2xpZCAke1QuYm9yZGVyfWAsIHBhZGRpbmdMZWZ0OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgXHUwMEFCIHthLmludGVudGlvbl90ZXh0fSBcdTAwQkJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMCwgY29sb3I6IFQuYWNjZW50LCBtYXJnaW5Ub3A6IDgsIGxldHRlclNwYWNpbmc6IFwiMC4wNmVtXCIsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAge2EudHJpZ2dlcmVkX2NvdW50IHx8IDB9IGRcdTAwRTljbGVuY2hlbWVudHMgXHUwMEI3IHthLnJlc3VsdGVkX2luX2x1Y2lkX2NvdW50IHx8IDB9IGx1Y2lkZXNcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogNiwgZmxleFNocmluazogMCB9fT5cbiAgICAgICAgICAgICAgICAgIDxCdG4gcHJpbWFyeT17ISFhLmVuYWJsZWR9IG9uQ2xpY2s9eygpID0+IHRvZ2dsZUVuYWJsZWQoYSl9IHN0eWxlPXt7IHBhZGRpbmc6IFwiNnB4IDEycHhcIiwgZm9udFNpemU6IDEyIH19PlxuICAgICAgICAgICAgICAgICAgICB7YS5lbmFibGVkID8gXCJhY3RpZlwiIDogXCJvZmZcIn1cbiAgICAgICAgICAgICAgICAgIDwvQnRuPlxuICAgICAgICAgICAgICAgICAgPEJ0biBkYW5nZXIgb25DbGljaz17KCkgPT4gcmVtb3ZlKGEuaWQpfSBzdHlsZT17eyBwYWRkaW5nOiBcIjZweCAxMHB4XCIsIGZvbnRTaXplOiAxMiB9fT5cdTAwRDc8L0J0bj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvRnJhbWU+XG4gICAgICAgIDxMdWNpZFRhYnMgZ289e2dvfSBjdXJyZW50PVwid2J0YlwiIC8+XG4gICAgICA8L1N0YWdlPlxuICAgICk7XG4gIH07XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIDUuIFNUQVRTIChyb3V0ZSBsdWNpZC1kYXNoYm9hcmQpIFx1MjAxNCBMLjZcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGNvbnN0IFRFQ0hfRlJfTEFCRUxTID0ge1xuICAgIERJTEQ6IFwiRElMRFwiLFxuICAgIE1JTEQ6IFwiTUlMRFwiLFxuICAgIFdJTEQ6IFwiV0lMRFwiLFxuICAgIFNTSUxEOiBcIlNTSUxEXCIsXG4gICAgV0JUQjogXCJXQlRCXCIsXG4gICAgc3BvbnRhbmVvdXM6IFwic3BvbnRhblx1MDBFOVwiLFxuICAgIG5vbmU6IFwibm9uIG5vdFx1MDBFOVwiLFxuICAgIHVua25vd246IFwiXHUyMDE0XCIsXG4gIH07XG5cbiAgY29uc3QgTHVjaWREYXNoYm9hcmRTY3JlZW4gPSAoeyBnbyB9KSA9PiB7XG4gICAgY29uc3QgW3N0YXRzLCBzZXRTdGF0c10gPSB1UyhudWxsKTtcbiAgICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1Uyh0cnVlKTtcbiAgICBjb25zdCBbZXhwb3J0aW5nLCBzZXRFeHBvcnRpbmddID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtsZXR0ZXIsIHNldExldHRlcl0gPSB1UyhudWxsKTtcbiAgICBjb25zdCBbbGV0dGVyTG9hZGluZywgc2V0TGV0dGVyTG9hZGluZ10gPSB1UyhmYWxzZSk7XG5cbiAgICB1RSgoKSA9PiB7XG4gICAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5nZXRMdWNpZFN0YXRzKCk7XG4gICAgICAgICAgc2V0U3RhdHMocmVzPy5zdGF0cyB8fCBudWxsKTtcbiAgICAgICAgfSBmaW5hbGx5IHsgc2V0TG9hZGluZyhmYWxzZSk7IH1cbiAgICAgIH0pKCk7XG4gICAgfSwgW10pO1xuXG4gICAgY29uc3QgZmV0Y2hMZXR0ZXIgPSBhc3luYyAoZm9yY2UpID0+IHtcbiAgICAgIHNldExldHRlckxvYWRpbmcodHJ1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZ2V0THVjaWRQcmFjdGljZUxldHRlcih7IGZvcmNlOiAhIWZvcmNlIH0pO1xuICAgICAgICBzZXRMZXR0ZXIocmVzIHx8IG51bGwpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBhbGVydChcImVycmV1ciBsZXR0cmUgOiBcIiArIChlLm1lc3NhZ2UgfHwgXCJpbmNvbm51ZVwiKSk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBzZXRMZXR0ZXJMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTdGFnZT5cbiAgICAgICAgICA8RnJhbWU+XG4gICAgICAgICAgICA8THVjaWRIZWFkZXIgZ289e2dvfSAvPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBjb2xvcjogVC50ZXh0RGltLCBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+Y2hhcmdlbWVudCBkZXMgc3RhdHNcdTIwMjY8L2Rpdj5cbiAgICAgICAgICA8L0ZyYW1lPlxuICAgICAgICAgIDxMdWNpZFRhYnMgZ289e2dvfSBjdXJyZW50PVwic3RhdHNcIiAvPlxuICAgICAgICA8L1N0YWdlPlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBjb25zdCBzID0gc3RhdHMgfHwge307XG5cbiAgICBjb25zdCBleHBvcnRPYnNpZGlhbiA9IGFzeW5jIChmb3JtYXQpID0+IHtcbiAgICAgIHNldEV4cG9ydGluZyh0cnVlKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1kID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLmV4cG9ydE9ic2lkaWFuKCk7XG4gICAgICAgIGNvbnN0IGV4dCA9IGZvcm1hdCA9PT0gXCJqc29uXCIgPyBcImpzb25cIiA6IFwibWRcIjtcbiAgICAgICAgY29uc3QgbWltZSA9IGZvcm1hdCA9PT0gXCJqc29uXCIgPyBcImFwcGxpY2F0aW9uL2pzb25cIiA6IFwidGV4dC9tYXJrZG93blwiO1xuICAgICAgICAvLyBWMSBzaW1wbGUgOiBvbiBzaGlwZSBsZSBtYXJrZG93biBtXHUwMEVBbWUgcG91ciBqc29uIChsZSBmcm9udCBwZXV0IHRyYW5zZm9ybWVyIHBsdXMgdGFyZClcbiAgICAgICAgY29uc3QgYmxvYiA9IG5ldyBCbG9iKFttZF0sIHsgdHlwZTogbWltZSB9KTtcbiAgICAgICAgY29uc3QgdXJsID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcbiAgICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICBhLmhyZWYgPSB1cmw7XG4gICAgICAgIGEuZG93bmxvYWQgPSBgZHJlYW0tbHVjaWQtJHtuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc2xpY2UoMCwgMTApfS4ke2V4dH1gO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgICBhLmNsaWNrKCk7IGEucmVtb3ZlKCk7XG4gICAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYWxlcnQoXCJleHBvcnQgaW1wb3NzaWJsZSA6IFwiICsgZS5tZXNzYWdlKTsgfVxuICAgICAgZmluYWxseSB7IHNldEV4cG9ydGluZyhmYWxzZSk7IH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxTdGFnZT5cbiAgICAgICAgey8qIDIwMjYtMDQtMjkgXHUyMDE0IEhhbG8gZW1iZXIgZGlzY3JldCBlbiBiYWNrZ3JvdW5kIChZZXNodWEsIG9wYWNpdHkgMC4xMCkgKi99XG4gICAgICAgIHt3aW5kb3cuSGFsb1Jlc3BpcmUgJiYgKFxuICAgICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIHRvcDogXCIzMHZoXCIsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWCgtNTAlKVwiLFxuICAgICAgICAgICAgd2lkdGg6IFwibWluKDQyMHB4LCA4NXZ3KVwiLCBoZWlnaHQ6IFwibWluKDQyMHB4LCA4NXZ3KVwiLFxuICAgICAgICAgICAgb3BhY2l0eTogMC4xMCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMCxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cImVtYmVyXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgICAgPEZyYW1lPlxuICAgICAgICAgIDxMdWNpZEhlYWRlclxuICAgICAgICAgICAgZ289e2dvfVxuICAgICAgICAgICAgc3ViPVwiY2VzIGNoaWZmcmVzIHNvbnQgcG91ciB0b2kuIGlsIG4neSBhIHBhcyBkZSBjbGFzc2VtZW50LCBwYXMgZGUgY29tcGFyYWlzb24gYXZlYyBkJ2F1dHJlcyByXHUwMEVBdmV1cnMuXCJcbiAgICAgICAgICAvPlxuXG4gICAgICAgICAgey8qIE1cdTAwRTl0cmlxdWVzIHByaW5jaXBhbGVzICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJncmlkXCIsIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMWZyIDFmclwiLCBnYXA6IDEyLCBtYXJnaW5Cb3R0b206IDE2IH19PlxuICAgICAgICAgICAgPFN0YXQgbGFiZWw9XCJ0b3RhbCBsdWNpZGVzXCIgdmFsdWU9e3MudG90YWxfbHVjaWRfZHJlYW1zIHx8IDB9IC8+XG4gICAgICAgICAgICA8U3RhdCBsYWJlbD1cInRhdXggZGUgcmFwcGVsXCIgdmFsdWU9eyhzLnJlY2FsbF9yYXRlX3BjdCB8fCAwKSArIFwiJVwifVxuICAgICAgICAgICAgICBoaW50PXtgJHtzLnRvdGFsX2RyZWFtcyB8fCAwfSByXHUwMEVBdmVzIG5vdFx1MDBFOXNgfSAvPlxuICAgICAgICAgICAgPFN0YXQgbGFiZWw9XCJjZXR0ZSBzZW1haW5lXCIgdmFsdWU9e3MuY3VycmVudF9zdHJlYWtfcGVyX3dlZWsgfHwgMH1cbiAgICAgICAgICAgICAgaGludD17XCJtZWlsbGV1ciA3IGpvdXJzIDogXCIgKyAocy5iZXN0X3N0cmVha19pbl83ZF93aW5kb3cgfHwgMCl9IC8+XG4gICAgICAgICAgICA8U3RhdCBsYWJlbD1cImRyZWFtIHNpZ25zXCIgdmFsdWU9e3Muc2lnbnNfY291bnQgfHwgMH0gLz5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBHcmFwaGUgbHVjaWRpdFx1MDBFOSAzMGogKi99XG4gICAgICAgICAgPENhcmQgdGl0bGU9XCJpbmRpY2UgZGUgbHVjaWRpdFx1MDBFOSBcdTIwMTQgMzAgZGVybmllcnMgam91cnNcIiBhY2NlbnQ+XG4gICAgICAgICAgICA8THVjaWRMaW5lR3JhcGggZGF0YT17cy5yZWNlbnRfbHVjaWRfcGVyX2RheSB8fCBbXX0gLz5cbiAgICAgICAgICA8L0NhcmQ+XG5cbiAgICAgICAgICB7LyogVGVjaG5pcXVlIGdhZ25hbnRlICovfVxuICAgICAgICAgIDxDYXJkIHRpdGxlPVwidGVjaG5pcXVlIHBhciBmclx1MDBFOXF1ZW5jZVwiPlxuICAgICAgICAgICAge09iamVjdC5rZXlzKHMudGVjaG5pcXVlX2JyZWFrZG93biB8fCB7fSkubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgY29sb3I6IFQudGV4dERpbSB9fT5cbiAgICAgICAgICAgICAgICBwYXMgZW5jb3JlIGRlIGRvbm5cdTAwRTllcyBcdTIwMTQgYWpvdXRlIGxhIG1cdTAwRTl0YWRvbm5cdTAwRTllIGx1Y2lkZSBcdTAwRTAgdW4gclx1MDBFQXZlLlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogOCB9fT5cbiAgICAgICAgICAgICAgICB7T2JqZWN0LmVudHJpZXMocy50ZWNobmlxdWVfYnJlYWtkb3duIHx8IHt9KVxuICAgICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IChiWzFdKSAtIChhWzFdKSlcbiAgICAgICAgICAgICAgICAgIC5tYXAoKFt0LCBuXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5PYmplY3QudmFsdWVzKHMudGVjaG5pcXVlX2JyZWFrZG93biB8fCB7fSkubWFwKE51bWJlcikpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwY3QgPSBtYXggPiAwID8gTWF0aC5yb3VuZCgoTnVtYmVyKG4pIC8gbWF4KSAqIDEwMCkgOiAwO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXt0fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBULnRleHQsIG1hcmdpbkJvdHRvbTogMyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57VEVDSF9GUl9MQUJFTFNbdF0gfHwgdH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBULmFjY2VudCwgZm9udEZhbWlseTogVC5tb25vLCBmb250U3R5bGU6IFwibm9ybWFsXCIsIGZvbnRTaXplOiAxMiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogNCwgYmFja2dyb3VuZDogVC5ib3JkZXIgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLCB3aWR0aDogcGN0ICsgXCIlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogVC5hY2NlbnQsIG9wYWNpdHk6IDAuNyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcIndpZHRoIDQ4MG1zIGVhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0NhcmQ+XG5cbiAgICAgICAgICB7LyogUHJhY3RpY2UgbGV0dGVyIChuYXJyYXRpdmUsIGFudGktZ2FtaWZpY2F0aW9uKSAqL31cbiAgICAgICAgICA8Q2FyZCB0aXRsZT1cIlx1MjcyNiBsZXR0cmUgZGUgcHJhdGlxdWUgXHUwMEI3IDkwIGRlcm5pZXJzIGpvdXJzXCIgYWNjZW50PlxuICAgICAgICAgICAgeyFsZXR0ZXIgJiYgIWxldHRlckxvYWRpbmcgJiYgKFxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBULnRleHREaW0sIG1hcmdpbkJvdHRvbTogMTQsIGxpbmVIZWlnaHQ6IDEuNixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHVuZSBsZXR0cmUgbmFycmF0aXZlIFx1MDBFOWNyaXRlIHBvdXIgdG9pIFx1MDBFMCBwYXJ0aXIgZGUgdGEgcHJhdGlxdWUgclx1MDBFOWNlbnRlLlxuICAgICAgICAgICAgICAgICAgcGFzIGRlIHNjb3JlcywgcGFzIGRlIGNoaWZmcmVzIFx1MjAxNCBqdXN0ZSBjZSBxdWkgcmV2aWVudCwgY2UgcXVpIHNlIHRpZW50LlxuICAgICAgICAgICAgICAgICAgclx1MDBFOWdcdTAwRTluXHUwMEU5clx1MDBFOWUgdG91cyBsZXMgMTQgam91cnMuXG4gICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDxCdG4gcHJpbWFyeSBvbkNsaWNrPXsoKSA9PiBmZXRjaExldHRlcihmYWxzZSl9PlxuICAgICAgICAgICAgICAgICAgcmVjZXZvaXIgbWEgbGV0dHJlXG4gICAgICAgICAgICAgICAgPC9CdG4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtsZXR0ZXJMb2FkaW5nICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJicmVhdGhcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgbGEgbGV0dHJlIHMnXHUwMEU5Y3JpdFx1MjAyNlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICB7bGV0dGVyICYmIGxldHRlci5sZXR0ZXIgJiYgKFxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE2LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgbGluZUhlaWdodDogMS43NSwgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyTGVmdDogYDJweCBzb2xpZCAke1QuYWNjZW50fWAsIHBhZGRpbmdMZWZ0OiAxOCxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHtsZXR0ZXIubGV0dGVyfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMTQsIGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDEwLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDZlbVwiLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2xldHRlci5jYWNoZWQgPyBcImxldHRyZSBlbiBjYWNoZVwiIDogXCJmcmFcdTAwRUVjaGVtZW50IFx1MDBFOWNyaXRlXCJ9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+XHUwMEI3PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2xldHRlci53b3JkX2NvdW50IHx8IFwiP1wifSBtb3RzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPEJ0biBnaG9zdCBvbkNsaWNrPXsoKSA9PiBmZXRjaExldHRlcih0cnVlKX0gc3R5bGU9e3sgbWFyZ2luTGVmdDogXCJhdXRvXCIsIGZvbnRTaXplOiAxMSB9fT5cbiAgICAgICAgICAgICAgICAgICAgclx1MDBFOWdcdTAwRTluXHUwMEU5cmVyXG4gICAgICAgICAgICAgICAgICA8L0J0bj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvQ2FyZD5cblxuICAgICAgICAgIHsvKiBUb3AgMTAgZHJlYW0gc2lnbnMgKi99XG4gICAgICAgICAgPENhcmQgdGl0bGU9XCJkcmVhbSBzaWducyBcdTAwQjcgdG9wIDEwXCI+XG4gICAgICAgICAgICB7KHMudG9wX3NpZ25zIHx8IFtdKS5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBjb2xvcjogVC50ZXh0RGltIH19PlxuICAgICAgICAgICAgICAgIGF1Y3VuIGRyZWFtIHNpZ24gZFx1MDBFOXRlY3RcdTAwRTkgcG91ciBsJ2luc3RhbnQuXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiA2IH19PlxuICAgICAgICAgICAgICAgIHsocy50b3Bfc2lnbnMgfHwgW10pLm1hcCgoc2lnLCBpKSA9PiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17c2lnLmlkfSBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMFwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206IGkgPCAocy50b3Bfc2lnbnMubGVuZ3RoIC0gMSkgPyBgMXB4IHNvbGlkICR7VC5ib3JkZXJ9YCA6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBULnRleHREaW0sIG1hcmdpblJpZ2h0OiA4LCBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTdHlsZTogXCJub3JtYWxcIiwgZm9udFNpemU6IDExIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge1N0cmluZyhpICsgMSkucGFkU3RhcnQoMiwgXCIwXCIpfVxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICB7c2lnLnNpZ25fbGFiZWx9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6IFQuYWNjZW50LCBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTdHlsZTogXCJub3JtYWxcIiwgZm9udFNpemU6IDEyIH19PlxuICAgICAgICAgICAgICAgICAgICAgIFx1MDBEN3tzaWcub2NjdXJyZW5jZXNfY291bnR9XG4gICAgICAgICAgICAgICAgICAgICAge3NpZy50cmlnZ2VyZWRfbHVjaWRpdHlfY291bnQgPiAwICYmIGAgXHUwMEI3ICR7c2lnLnRyaWdnZXJlZF9sdWNpZGl0eV9jb3VudH1MYH1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L0NhcmQ+XG5cbiAgICAgICAgICB7LyogRXhwb3J0ICovfVxuICAgICAgICAgIDxDYXJkIHRpdGxlPVwiZXhwb3J0ZXJcIj5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0RGltLCBtYXJnaW5Cb3R0b206IDE0LCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgclx1MDBFOWN1cFx1MDBFOHJlIHRvdXQgdG9uIGhpc3RvcmlxdWUgbHVjaWRlIChyXHUwMEVBdmVzICsgbVx1MDBFOXRhZG9ublx1MDBFOWVzICsgZHJlYW0gc2lnbnMpXG4gICAgICAgICAgICAgIGRhbnMgdW4gZm9ybWF0IHJcdTAwRTl1dGlsaXNhYmxlIGFpbGxldXJzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZ2FwOiAxMCwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgICA8QnRuIHByaW1hcnkgb25DbGljaz17KCkgPT4gZXhwb3J0T2JzaWRpYW4oXCJtZFwiKX0gZGlzYWJsZWQ9e2V4cG9ydGluZ30+XG4gICAgICAgICAgICAgICAge2V4cG9ydGluZyA/IFwiXHUyMDI2XCIgOiBcIk1hcmtkb3duIChPYnNpZGlhbilcIn1cbiAgICAgICAgICAgICAgPC9CdG4+XG4gICAgICAgICAgICAgIDxCdG4gb25DbGljaz17KCkgPT4gZXhwb3J0T2JzaWRpYW4oXCJqc29uXCIpfSBkaXNhYmxlZD17ZXhwb3J0aW5nfT5cbiAgICAgICAgICAgICAgICBKU09OXG4gICAgICAgICAgICAgIDwvQnRuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9DYXJkPlxuICAgICAgICA8L0ZyYW1lPlxuICAgICAgICA8THVjaWRUYWJzIGdvPXtnb30gY3VycmVudD1cInN0YXRzXCIgLz5cbiAgICAgIDwvU3RhZ2U+XG4gICAgKTtcbiAgfTtcblxuICBmdW5jdGlvbiBTdGF0KHsgbGFiZWwsIHZhbHVlLCBoaW50IH0pIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBULmJnU29mdCwgYm9yZGVyOiBgMXB4IHNvbGlkICR7VC5ib3JkZXJ9YCxcbiAgICAgICAgcGFkZGluZzogXCIxNnB4IDE4cHhcIixcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IDYsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtsYWJlbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMjgsIGNvbG9yOiBULmFjY2VudCxcbiAgICAgICAgICBmb250U3R5bGU6IFwibm9ybWFsXCIsIGxpbmVIZWlnaHQ6IDEsIG1hcmdpbkJvdHRvbTogNCxcbiAgICAgICAgfX0+XG4gICAgICAgICAge3ZhbHVlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2hpbnQgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtoaW50fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEx1Y2lkTGluZUdyYXBoKHsgZGF0YSB9KSB7XG4gICAgaWYgKCFkYXRhIHx8IGRhdGEubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgY29sb3I6IFQudGV4dERpbSwgcGFkZGluZzogXCIxMnB4IDBcIiB9fT5cbiAgICAgICAgICBwYXMgZW5jb3JlIGRlIGRvbm5cdTAwRTllcy5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBXID0gNTIwLCBIID0gMTIwLCBQID0gODtcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCgxLCAuLi5kYXRhLm1hcCgoZCkgPT4gZC5jb3VudCB8fCAwKSk7XG4gICAgY29uc3Qgc3RlcFggPSAoVyAtIFAgKiAyKSAvIE1hdGgubWF4KDEsIGRhdGEubGVuZ3RoIC0gMSk7XG4gICAgY29uc3QgcG9pbnRzID0gZGF0YS5tYXAoKGQsIGkpID0+IHtcbiAgICAgIGNvbnN0IHggPSBQICsgaSAqIHN0ZXBYO1xuICAgICAgY29uc3QgeSA9IEggLSBQIC0gKChkLmNvdW50IHx8IDApIC8gbWF4KSAqIChIIC0gUCAqIDIpO1xuICAgICAgcmV0dXJuIGAke3gudG9GaXhlZCgxKX0sJHt5LnRvRml4ZWQoMSl9YDtcbiAgICB9KS5qb2luKFwiIFwiKTtcbiAgICByZXR1cm4gKFxuICAgICAgPHN2ZyB2aWV3Qm94PXtgMCAwICR7V30gJHtIfWB9IHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiAxMjAsIGRpc3BsYXk6IFwiYmxvY2tcIiB9fT5cbiAgICAgICAgey8qIGJhc2VsaW5lICovfVxuICAgICAgICA8bGluZSB4MT17UH0geTE9e0ggLSBQfSB4Mj17VyAtIFB9IHkyPXtIIC0gUH0gc3Ryb2tlPXtULmJvcmRlcn0gc3Ryb2tlV2lkdGg9XCIwLjZcIiAvPlxuICAgICAgICB7LyogZ3JhZGllbnQgaGFsbyAqL31cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPVwibHVjaWRHcmFkXCIgeDE9XCIwXCIgeTE9XCIwXCIgeDI9XCIwXCIgeTI9XCIxXCI+XG4gICAgICAgICAgICA8c3RvcCBvZmZzZXQ9XCIwJVwiIHN0b3BDb2xvcj1cInZhcigtLXNpbGstZ29sZCwgI0M4QTY1OClcIiBzdG9wT3BhY2l0eT1cIjAuMzJcIiAvPlxuICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3BDb2xvcj1cInZhcigtLXNpbGstZ29sZCwgI0M4QTY1OClcIiBzdG9wT3BhY2l0eT1cIjBcIiAvPlxuICAgICAgICAgIDwvbGluZWFyR3JhZGllbnQ+XG4gICAgICAgIDwvZGVmcz5cbiAgICAgICAgPHBvbHlnb25cbiAgICAgICAgICBmaWxsPVwidXJsKCNsdWNpZEdyYWQpXCJcbiAgICAgICAgICBwb2ludHM9e2Ake1B9LCR7SCAtIFB9ICR7cG9pbnRzfSAke1cgLSBQfSwke0ggLSBQfWB9XG4gICAgICAgIC8+XG4gICAgICAgIDxwb2x5bGluZSBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLXNpbGstZ29sZCwgI0M4QTY1OClcIiBzdHJva2VXaWR0aD1cIjEuNFwiIHBvaW50cz17cG9pbnRzfSAvPlxuICAgICAgICB7ZGF0YS5tYXAoKGQsIGkpID0+IHtcbiAgICAgICAgICBpZiAoIWQuY291bnQpIHJldHVybiBudWxsO1xuICAgICAgICAgIGNvbnN0IHggPSBQICsgaSAqIHN0ZXBYO1xuICAgICAgICAgIGNvbnN0IHkgPSBIIC0gUCAtIChkLmNvdW50IC8gbWF4KSAqIChIIC0gUCAqIDIpO1xuICAgICAgICAgIHJldHVybiA8Y2lyY2xlIGtleT17aX0gY3g9e3h9IGN5PXt5fSByPVwiMi40XCIgZmlsbD1cInZhcigtLXNpbGstZ29sZCwgI0M4QTY1OClcIiAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L3N2Zz5cbiAgICApO1xuICB9XG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIDYuIE1FVEFEQVRBIE1PREFMIFx1MjAxNCB1dGlsaXNcdTAwRTllIGRlcHVpcyBLYWlyb3NEZXRhaWwgc2kgbHVjaWQgbW9kZSBhY3RpZlxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgY29uc3QgVEVDSE5JUVVFX0ZSX09QVFMgPSBbXG4gICAgeyB2YWx1ZTogXCJub25lXCIsICAgICAgICAgbGFiZWw6IFwiXHUyMDE0XCIgfSxcbiAgICB7IHZhbHVlOiBcIkRJTERcIiwgICAgICAgICBsYWJlbDogXCJESUxEIChzcG9udGFuXHUwMEU5KVwiIH0sXG4gICAgeyB2YWx1ZTogXCJNSUxEXCIsICAgICAgICAgbGFiZWw6IFwiTUlMRCAoaW50ZW50aW9uKVwiIH0sXG4gICAgeyB2YWx1ZTogXCJXSUxEXCIsICAgICAgICAgbGFiZWw6IFwiV0lMRCAocGFzc2FnZSBjb25zY2llbnQpXCIgfSxcbiAgICB7IHZhbHVlOiBcIlNTSUxEXCIsICAgICAgICBsYWJlbDogXCJTU0lMRCAoY3ljbGUgZGVzIHNlbnMpXCIgfSxcbiAgICB7IHZhbHVlOiBcIldCVEJcIiwgICAgICAgICBsYWJlbDogXCJXQlRCXCIgfSxcbiAgICB7IHZhbHVlOiBcInNwb250YW5lb3VzXCIsICBsYWJlbDogXCJzcG9udGFuXHUwMEU5XCIgfSxcbiAgXTtcblxuICBjb25zdCBMdWNpZEthaXJvc01ldGFkYXRhTW9kYWwgPSAoeyBrYWlyb3NJZCwga2Fpcm9zVGV4dCwgb25DbG9zZSwgb25TYXZlZCB9KSA9PiB7XG4gICAgY29uc3QgW20sIHNldE1dID0gdVMoe1xuICAgICAgbHVjaWRpdHlfc2NvcmU6IDAsXG4gICAgICBsdWNpZGl0eV90ZWNobmlxdWU6IFwibm9uZVwiLFxuICAgICAgc3RhYmlsaXR5X3Njb3JlOiAwLFxuICAgICAgY29udHJvbF9zY29yZTogMCxcbiAgICAgIGZhbHNlX2F3YWtlbmluZ19jb3VudDogMCxcbiAgICAgIHJlYWxpdHlfY2hlY2tfcGVyZm9ybWVkOiBmYWxzZSxcbiAgICAgIHNpZ25zX3JlY29nbml6ZWQ6IFtdLFxuICAgICAgcHJlX3NsZWVwX2ludGVudGlvbjogXCJcIixcbiAgICAgIG5vdGVzX3RlY2huaXF1ZTogXCJcIixcbiAgICAgIHJlbV9jeWNsZV9lc3RpbWF0ZTogMCxcbiAgICAgIGhvdXJzX3NsZXB0OiAwLFxuICAgIH0pO1xuICAgIGNvbnN0IFtzaWduc0F2YWlsYWJsZSwgc2V0U2lnbnNBdmFpbGFibGVdID0gdVMoW10pO1xuICAgIGNvbnN0IFtzYXZpbmcsIHNldFNhdmluZ10gPSB1UyhmYWxzZSk7XG4gICAgY29uc3QgW2V4dHJhY3RpbmcsIHNldEV4dHJhY3RpbmddID0gdVMoZmFsc2UpO1xuXG4gICAgdUUoKCkgPT4ge1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkubGlzdERyZWFtU2lnbnMoKTtcbiAgICAgICAgICBzZXRTaWduc0F2YWlsYWJsZShyZXM/LmRyZWFtX3NpZ25zIHx8IFtdKTtcbiAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgfSkoKTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCB0b2dnbGVTaWduID0gKGxhYmVsKSA9PiB7XG4gICAgICBjb25zdCBuZXh0ID0gbS5zaWduc19yZWNvZ25pemVkLmluY2x1ZGVzKGxhYmVsKVxuICAgICAgICA/IG0uc2lnbnNfcmVjb2duaXplZC5maWx0ZXIoKHMpID0+IHMgIT09IGxhYmVsKVxuICAgICAgICA6IFsuLi5tLnNpZ25zX3JlY29nbml6ZWQsIGxhYmVsXTtcbiAgICAgIHNldE0oeyAuLi5tLCBzaWduc19yZWNvZ25pemVkOiBuZXh0IH0pO1xuICAgIH07XG5cbiAgICBjb25zdCBzYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgc2V0U2F2aW5nKHRydWUpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLmF0dGFjaEx1Y2lkTWV0YWRhdGEoa2Fpcm9zSWQsIG0pO1xuICAgICAgICBpZiAob25TYXZlZCkgb25TYXZlZCgpO1xuICAgICAgICBvbkNsb3NlICYmIG9uQ2xvc2UoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYWxlcnQoXCJlcnJldXIgOiBcIiArIGUubWVzc2FnZSk7IH1cbiAgICAgIGZpbmFsbHkgeyBzZXRTYXZpbmcoZmFsc2UpOyB9XG4gICAgfTtcblxuICAgIGNvbnN0IGV4dHJhY3RTaWducyA9IGFzeW5jICgpID0+IHtcbiAgICAgIHNldEV4dHJhY3RpbmcodHJ1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZXh0cmFjdERyZWFtU2lnbnMoa2Fpcm9zSWQpO1xuICAgICAgICBjb25zdCBuZXdTaWducyA9IHJlcz8uZHJlYW1fc2lnbnMgfHwgW107XG4gICAgICAgIHNldFNpZ25zQXZhaWxhYmxlKChwcmV2KSA9PiB7XG4gICAgICAgICAgY29uc3QgaWRzID0gbmV3IFNldChwcmV2Lm1hcCgocykgPT4gcy5pZCkpO1xuICAgICAgICAgIGNvbnN0IG1lcmdlZCA9IFsuLi5wcmV2XTtcbiAgICAgICAgICBmb3IgKGNvbnN0IHMgb2YgbmV3U2lnbnMpIGlmICghaWRzLmhhcyhzLmlkKSkgbWVyZ2VkLnB1c2gocyk7XG4gICAgICAgICAgcmV0dXJuIG1lcmdlZDtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChuZXdTaWducy5sZW5ndGggPT09IDApIGFsZXJ0KFwiYXVjdW4gbm91dmVhdSBkcmVhbSBzaWduIGRcdTAwRTl0ZWN0XHUwMEU5LlwiKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHsgYWxlcnQoXCJlcnJldXIgOiBcIiArIGUubWVzc2FnZSk7IH1cbiAgICAgIGZpbmFsbHkgeyBzZXRFeHRyYWN0aW5nKGZhbHNlKTsgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBpbnNldDogMCwgYmFja2dyb3VuZDogXCJyZ2JhKDAsMCwwLDAuNzgpXCIsXG4gICAgICAgIHpJbmRleDogMTAwLCBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgIHBhZGRpbmc6IDE2LCBmb250RmFtaWx5OiBULnNhbnMsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGJhY2tncm91bmQ6IFQuYmcsIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyfWAsXG4gICAgICAgICAgbWF4V2lkdGg6IDUyMCwgd2lkdGg6IFwiMTAwJVwiLCBtYXhIZWlnaHQ6IFwiOTB2aFwiLCBvdmVyZmxvd1k6IFwiYXV0b1wiLFxuICAgICAgICAgIHBhZGRpbmc6IDI0LCBjb2xvcjogVC50ZXh0LFxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAxOCxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRXZWlnaHQ6IDMwMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDIyLCBjb2xvcjogVC5hY2NlbnQsIG1hcmdpbjogMCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBhbm5vdGVyIGNlIHJcdTAwRUF2ZVxuICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX0gc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAyMiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogNCxcbiAgICAgICAgICAgIH19Plx1MDBENzwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPFNsaWRlciBsYWJlbD1cImx1Y2lkaXRcdTAwRTlcIiB2YWx1ZT17bS5sdWNpZGl0eV9zY29yZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0TSh7IC4uLm0sIGx1Y2lkaXR5X3Njb3JlOiB2IH0pfVxuICAgICAgICAgICAgbWluPXswfSBtYXg9ezV9IHZhbHVlTGFiZWw9e2Ake20ubHVjaWRpdHlfc2NvcmV9LzVgfSAvPlxuXG4gICAgICAgICAgPEZpZWxkIGxhYmVsPVwidGVjaG5pcXVlXCI+XG4gICAgICAgICAgICA8U2VsZWN0XG4gICAgICAgICAgICAgIHZhbHVlPXttLmx1Y2lkaXR5X3RlY2huaXF1ZX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBzZXRNKHsgLi4ubSwgbHVjaWRpdHlfdGVjaG5pcXVlOiB2IH0pfVxuICAgICAgICAgICAgICBvcHRpb25zPXtURUNITklRVUVfRlJfT1BUU31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9GaWVsZD5cblxuICAgICAgICAgIDxTbGlkZXIgbGFiZWw9XCJzdGFiaWxpdFx1MDBFOVwiIHZhbHVlPXttLnN0YWJpbGl0eV9zY29yZX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0TSh7IC4uLm0sIHN0YWJpbGl0eV9zY29yZTogdiB9KX1cbiAgICAgICAgICAgIG1pbj17MH0gbWF4PXs1fSB2YWx1ZUxhYmVsPXtgJHttLnN0YWJpbGl0eV9zY29yZX0vNWB9IC8+XG4gICAgICAgICAgPFNsaWRlciBsYWJlbD1cImNvbnRyXHUwMEY0bGVcIiB2YWx1ZT17bS5jb250cm9sX3Njb3JlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBzZXRNKHsgLi4ubSwgY29udHJvbF9zY29yZTogdiB9KX1cbiAgICAgICAgICAgIG1pbj17MH0gbWF4PXs1fSB2YWx1ZUxhYmVsPXtgJHttLmNvbnRyb2xfc2NvcmV9LzVgfSAvPlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyXCIsIGdhcDogMTIgfX0+XG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJjeWNsZSBSRU0gKGVzdGltLilcIj5cbiAgICAgICAgICAgICAgPElucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17bS5yZW1fY3ljbGVfZXN0aW1hdGV9XG4gICAgICAgICAgICAgICAgb25DaGFuZ2U9eyh2KSA9PiBzZXRNKHsgLi4ubSwgcmVtX2N5Y2xlX2VzdGltYXRlOiBwYXJzZUludCh2LCAxMCkgfHwgMCB9KX0gLz5cbiAgICAgICAgICAgIDwvRmllbGQ+XG4gICAgICAgICAgICA8RmllbGQgbGFiZWw9XCJoZXVyZXMgZGUgc29tbWVpbFwiPlxuICAgICAgICAgICAgICA8SW5wdXQgdHlwZT1cIm51bWJlclwiIHZhbHVlPXttLmhvdXJzX3NsZXB0fVxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0TSh7IC4uLm0sIGhvdXJzX3NsZXB0OiBwYXJzZUZsb2F0KHYpIHx8IDAgfSl9IC8+XG4gICAgICAgICAgICA8L0ZpZWxkPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPFRvZ2dsZVxuICAgICAgICAgICAgb249e20ucmVhbGl0eV9jaGVja19wZXJmb3JtZWR9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNKHsgLi4ubSwgcmVhbGl0eV9jaGVja19wZXJmb3JtZWQ6ICFtLnJlYWxpdHlfY2hlY2tfcGVyZm9ybWVkIH0pfVxuICAgICAgICAgICAgbGFiZWw9XCJyZWFsaXR5IGNoZWNrIGZhaXQgZGFucyBsZSByXHUwMEVBdmVcIlxuICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8RmllbGQgbGFiZWw9XCJmYXV4IHJcdTAwRTl2ZWlsc1wiPlxuICAgICAgICAgICAgPElucHV0IHR5cGU9XCJudW1iZXJcIiB2YWx1ZT17bS5mYWxzZV9hd2FrZW5pbmdfY291bnR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsodikgPT4gc2V0TSh7IC4uLm0sIGZhbHNlX2F3YWtlbmluZ19jb3VudDogcGFyc2VJbnQodiwgMTApIHx8IDAgfSl9IC8+XG4gICAgICAgICAgPC9GaWVsZD5cblxuICAgICAgICAgIDxGaWVsZCBsYWJlbD1cInNpZ25zIHJlY29ubnVzXCI+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIG1hcmdpbkJvdHRvbTogOCB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBjb2xvcjogVC50ZXh0RGltLCBmb250U2l6ZTogMTMgfX0+XG4gICAgICAgICAgICAgICAgdGFwIHBvdXIgY29jaGVyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPEJ0biBnaG9zdCBvbkNsaWNrPXtleHRyYWN0U2lnbnN9IGRpc2FibGVkPXtleHRyYWN0aW5nfSBzdHlsZT17eyBwYWRkaW5nOiBcIjRweCAxMHB4XCIsIGZvbnRTaXplOiAxMiB9fT5cbiAgICAgICAgICAgICAgICB7ZXh0cmFjdGluZyA/IFwiXHUyMDI2XCIgOiBcIisgZXh0cmFjdGlvbiBOTFBcIn1cbiAgICAgICAgICAgICAgPC9CdG4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogNiwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgICB7c2lnbnNBdmFpbGFibGUubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGNvbG9yOiBULnRleHRNdXRlZCwgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgICAgICAgICAgYXVjdW4gc2lnbiBcdTIwMTQgdXRpbGlzZSBsJ2V4dHJhY3Rpb24gTkxQLlxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge3NpZ25zQXZhaWxhYmxlLm1hcCgocykgPT4gKFxuICAgICAgICAgICAgICAgIDxDaGlwIGtleT17cy5pZH1cbiAgICAgICAgICAgICAgICAgIGFjdGl2ZT17bS5zaWduc19yZWNvZ25pemVkLmluY2x1ZGVzKHMuc2lnbl9sYWJlbCl9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0b2dnbGVTaWduKHMuc2lnbl9sYWJlbCl9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge3Muc2lnbl9sYWJlbH1cbiAgICAgICAgICAgICAgICA8L0NoaXA+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9GaWVsZD5cblxuICAgICAgICAgIDxGaWVsZCBsYWJlbD1cImludGVudGlvbiBwclx1MDBFOS1zb21tZWlsIChNSUxEKVwiPlxuICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgIHZhbHVlPXttLnByZV9zbGVlcF9pbnRlbnRpb259XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TSh7IC4uLm0sIHByZV9zbGVlcF9pbnRlbnRpb246IGUudGFyZ2V0LnZhbHVlIH0pfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlx1MDBBQiBsYSBwcm9jaGFpbmUgZm9pcyBxdWUgamUgdm9pc1x1MjAyNiBcdTAwQkJcIlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIiwgbWluSGVpZ2h0OiA1NixcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBULmJnLCBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBULnRleHQsIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsIHBhZGRpbmc6IDEwLCBvdXRsaW5lOiBcIm5vbmVcIiwgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L0ZpZWxkPlxuXG4gICAgICAgICAgPEZpZWxkIGxhYmVsPVwibm90ZXNcIj5cbiAgICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgICB2YWx1ZT17bS5ub3Rlc190ZWNobmlxdWV9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0TSh7IC4uLm0sIG5vdGVzX3RlY2huaXF1ZTogZS50YXJnZXQudmFsdWUgfSl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLCBtaW5IZWlnaHQ6IDUwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFQuYmcsIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyfWAsXG4gICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNCwgcGFkZGluZzogMTAsIG91dGxpbmU6IFwibm9uZVwiLCByZXNpemU6IFwidmVydGljYWxcIixcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvRmllbGQ+XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBnYXA6IDEwLCBtYXJnaW5Ub3A6IDE4IH19PlxuICAgICAgICAgICAgPEJ0biBwcmltYXJ5IG9uQ2xpY2s9e3NhdmV9IGRpc2FibGVkPXtzYXZpbmd9PlxuICAgICAgICAgICAgICB7c2F2aW5nID8gXCJcdTIwMjZcIiA6IFwiZW5yZWdpc3RyZXJcIn1cbiAgICAgICAgICAgIDwvQnRuPlxuICAgICAgICAgICAgPEJ0biBnaG9zdCBvbkNsaWNrPXtvbkNsb3NlfT5hbm51bGVyPC9CdG4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICAvLyBcdTI1MDBcdTI1MDAgRXhwb3NlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICB3aW5kb3cuTHVjaWRQcm9maWxlU2NyZWVuID0gTHVjaWRQcm9maWxlU2NyZWVuO1xuICB3aW5kb3cuTHVjaWREYXNoYm9hcmRTY3JlZW4gPSBMdWNpZERhc2hib2FyZFNjcmVlbjtcbiAgd2luZG93Lkx1Y2lkUmVhbGl0eUNoZWNrc1NjcmVlbiA9IEx1Y2lkUmVhbGl0eUNoZWNrc1NjcmVlbjtcbiAgd2luZG93Lkx1Y2lkRHJlYW1TaWduc1NjcmVlbiA9IEx1Y2lkRHJlYW1TaWduc1NjcmVlbjtcbiAgd2luZG93Lkx1Y2lkV0JUQlNjcmVlbiA9IEx1Y2lkV0JUQlNjcmVlbjtcbiAgd2luZG93Lkx1Y2lkS2Fpcm9zTWV0YWRhdGFNb2RhbCA9IEx1Y2lkS2Fpcm9zTWV0YWRhdGFNb2RhbDtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiQ0F1QkMsU0FBUyxvQkFBb0I7QUFDNUIsUUFBTSxFQUFFLFVBQVUsSUFBSSxXQUFXLElBQUksUUFBUSxJQUFJLFNBQVMsR0FBRyxJQUFJO0FBTWpFLFFBQU0sSUFBSTtBQUFBLElBQ1IsSUFBVTtBQUFBLElBQ1YsU0FBVTtBQUFBLElBQ1YsUUFBVTtBQUFBLElBQ1YsUUFBVTtBQUFBLElBQ1YsY0FBYztBQUFBLElBQ2QsTUFBVTtBQUFBLElBQ1YsU0FBVTtBQUFBLElBQ1YsV0FBVTtBQUFBLElBQ1YsUUFBVTtBQUFBLElBQ1YsT0FBVTtBQUFBLElBQ1YsUUFBVTtBQUFBLElBQ1YsT0FBVTtBQUFBLElBQ1YsTUFBVTtBQUFBLElBQ1YsTUFBVTtBQUFBLEVBQ1o7QUFHQSxXQUFTLE1BQU0sRUFBRSxVQUFVLE1BQU0s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
