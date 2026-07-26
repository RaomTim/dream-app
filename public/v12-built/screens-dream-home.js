const { useState: dhS, useEffect: dhE, useRef: dhR } = React;
function dreamInvitation() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h >= 4 && h < 12) return "Quel r\xEAve vient ce matin ?";
  if (h >= 12 && h < 19) return "Un r\xEAve t'a marqu\xE9 aujourd'hui ?";
  return "Quel r\xEAve veux-tu d\xE9poser ?";
}
function GlyphLuneDecroissante({ size = 36 }) {
  const haloSize = Math.max(size * 2.4, 80);
  const showHalo = size >= 28;
  return /* @__PURE__ */ React.createElement("span", { style: { position: "relative", display: "inline-grid", placeItems: "center" } }, showHalo && /* @__PURE__ */ React.createElement(
    "svg",
    {
      "aria-hidden": "true",
      width: haloSize,
      height: haloSize,
      viewBox: "0 0 100 100",
      style: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        opacity: 0.55,
        animation: "dh-halo-souffle 8s ease-in-out infinite",
        filter: "blur(0.6px)"
      }
    },
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("radialGradient", { id: `dh-halo-grad-${size}`, cx: "50%", cy: "50%", r: "50%" }, /* @__PURE__ */ React.createElement("stop", { offset: "0%", stopColor: "color-mix(in oklch, var(--silk-gold) 50%, transparent)", stopOpacity: "0.42" }), /* @__PURE__ */ React.createElement("stop", { offset: "55%", stopColor: "color-mix(in oklch, var(--silk-gold) 28%, transparent)", stopOpacity: "0.18" }), /* @__PURE__ */ React.createElement("stop", { offset: "100%", stopColor: "color-mix(in oklch, var(--silk-gold) 14%, transparent)", stopOpacity: "0" }))),
    /* @__PURE__ */ React.createElement("circle", { cx: "50", cy: "50", r: "48", fill: `url(#dh-halo-grad-${size})` })
  ), /* @__PURE__ */ React.createElement(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      "aria-hidden": "true",
      style: { display: "block", position: "relative" }
    },
    /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("mask", { id: "lune-decroissante-mask" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "0", width: "100", height: "100", fill: "white" }), /* @__PURE__ */ React.createElement("circle", { cx: "62", cy: "50", r: "34", fill: "black" }))),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "32",
        fill: "none",
        stroke: "color-mix(in oklch, var(--silk-gold) 45%, var(--bone))",
        strokeWidth: "1.1",
        opacity: "0.65"
      }
    ),
    /* @__PURE__ */ React.createElement(
      "circle",
      {
        cx: "50",
        cy: "50",
        r: "32",
        fill: "color-mix(in oklch, var(--silk-gold) 22%, var(--night-warm))",
        mask: "url(#lune-decroissante-mask)",
        opacity: "0.85"
      }
    )
  ));
}
const REVEAL_KEY = "dream:discovery:revealed";
const REVEAL_DISMISSED_KEY = "dream:discovery:dismissed-at";
const DISCOVERY_LEVELS = [
  {
    key: "journal-vie",
    threshold: 3,
    glyph: "\u2609",
    title: "une seconde porte s'ouvre",
    text: "3 r\xEAves d\xE9pos\xE9s. Sais-tu qu'ils peuvent \xE9clairer ta vie de jour ?",
    cta: "ouvrir Journal de Vie",
    route: "home-jour"
  },
  {
    key: "cercle",
    threshold: 7,
    glyph: "\u25CB",
    title: "tu n'es pas seul\xB7e \xE0 r\xEAver",
    text: "7 r\xEAves d\xE9pos\xE9s. Tu peux aussi rejoindre un cercle pour partager.",
    cta: "d\xE9couvrir les cercles",
    route: "cercle"
  },
  {
    key: "anima",
    threshold: 14,
    glyph: "\u25D0",
    title: "le r\xEAve du monde t'attend",
    // 2026-04-27 P0.4 — text peut être un render function (JSX) pour TermDef
    text: () => {
      const T = window.TermDef;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, "14 r\xEAves d\xE9pos\xE9s. ", T ? /* @__PURE__ */ React.createElement(T, { term: "anima_mundi" }) : "Anima Mundi", " \u2014 la vo\xFBte commune \u2014 a quelque chose \xE0 te dire.");
    },
    cta: "ouvrir Anima Mundi",
    route: "anima"
  },
  {
    key: "portrait-lettre",
    threshold: 30,
    glyph: "\u2737",
    title: "une lettre t'a \xE9t\xE9 tiss\xE9e",
    text: () => {
      const T = window.TermDef;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, "30 r\xEAves d\xE9pos\xE9s. Une lecture personnelle peut \xEAtre faite \u2014 ta ", T ? /* @__PURE__ */ React.createElement(T, { term: "portrait_lettre" }) : "lettre du moment", ".");
    },
    cta: "demander ma lettre",
    route: "portrait"
  }
];
function getRevealed() {
  try {
    return JSON.parse(localStorage.getItem(REVEAL_KEY) || "[]");
  } catch (e) {
    return [];
  }
}
function markRevealed(key) {
  try {
    const r = getRevealed();
    if (!r.includes(key)) {
      r.push(key);
      localStorage.setItem(REVEAL_KEY, JSON.stringify(r));
    }
  } catch (e) {
  }
}
function getDismissedAt() {
  try {
    return parseInt(localStorage.getItem(REVEAL_DISMISSED_KEY) || "0", 10);
  } catch (e) {
    return 0;
  }
}
function setDismissedAt(t) {
  try {
    localStorage.setItem(REVEAL_DISMISSED_KEY, String(t));
  } catch (e) {
  }
}
function shouldRevealDiscovery(kairosCount) {
  const revealed = getRevealed();
  const dismissedAt = getDismissedAt();
  if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 3600 * 1e3) return null;
  for (const lvl of DISCOVERY_LEVELS) {
    if (revealed.includes(lvl.key)) continue;
    if (kairosCount >= lvl.threshold) return lvl;
  }
  return null;
}
const DiscoveryReveal = ({ level, go, onClose }) => {
  if (!level) return null;
  const handleDiscover = () => {
    markRevealed(level.key);
    onClose && onClose();
    if (typeof go === "function") setTimeout(() => go(level.route), 200);
  };
  const handleLater = () => {
    setDismissedAt(Date.now());
    onClose && onClose();
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": level.title,
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--s-5)",
        animation: "dh-modal-fade-in 480ms ease"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: 420,
      width: "100%",
      background: "color-mix(in oklch, var(--night-warm) 92%, transparent)",
      border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
      padding: "var(--s-6) var(--s-5)",
      textAlign: "center",
      boxShadow: "0 6px 40px color-mix(in oklch, var(--night-floor) 60%, transparent)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 32,
      marginBottom: "var(--s-3)",
      color: "var(--silk-gold)",
      opacity: 0.85
    } }, level.glyph), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 17,
      color: "var(--bone)",
      marginBottom: "var(--s-3)",
      letterSpacing: "0.01em"
    } }, level.title), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 15,
      lineHeight: 1.55,
      color: "var(--ash-light)",
      marginBottom: "var(--s-5)",
      textWrap: "pretty"
    } }, typeof level.text === "function" ? level.text() : level.text), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleDiscover,
        style: {
          background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 50%, var(--bone))",
          color: "var(--bone)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 15,
          padding: "11px 22px",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 380ms ease"
        }
      },
      level.cta
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleLater,
        style: {
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ash-light)",
          opacity: 0.6,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 13,
          padding: "8px 0"
        }
      },
      "plus tard"
    ))),
    /* @__PURE__ */ React.createElement("style", null, `
        @keyframes dh-modal-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `)
  );
};
const DiscoverDrawer = ({ open, onClose, go }) => {
  const goAndClose = (route) => {
    onClose && onClose();
    setTimeout(() => {
      try {
        go && go(route);
      } catch (e) {
      }
    }, 220);
  };
  const items = [
    { glyph: "\u2609", label: "Tes kairos", hint: "l'historique de tes r\xEAves et signes", route: "journal" },
    { glyph: "\u25C9", label: "Oracle du Corps", hint: "le corps comme sismographe", route: "oracle-corps" },
    { glyph: "\u2726", label: "Cauchemars & Deuil", hint: "sanctuaire pour ce qui p\xE8se", route: "nightmares" },
    { glyph: "\u274B", label: "Tales \u2014 contes qui r\xE9pondent", hint: "32 contes r\xE9els qui font \xE9cho", route: "conte-miroir" },
    { glyph: "\u25D0", label: "Mode Lucid", hint: "pour pratiquer le r\xEAve lucide", route: "lucid-profile" },
    { glyph: "\xB7", label: "Param\xE8tres", hint: "pr\xE9f\xE9rences, notifications", route: "privacy" }
  ];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: onClose,
      "aria-hidden": "true",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 310,
        background: "color-mix(in oklch, var(--night-floor) 70%, transparent)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "opacity 300ms cubic-bezier(0.45,0,0.55,1)",
        backdropFilter: open ? "blur(4px)" : "none",
        WebkitBackdropFilter: open ? "blur(4px)" : "none"
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "aside",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "d\xE9couvrir les autres entr\xE9es",
      style: {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        width: "min(86vw, 340px)",
        zIndex: 311,
        background: "color-mix(in oklch, var(--night-warm) 96%, var(--night-floor))",
        borderRight: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
        boxShadow: open ? "8px 0 28px color-mix(in oklch, var(--night-floor) 50%, transparent)" : "none",
        transform: open ? "translateX(0)" : "translateX(-104%)",
        transition: "transform 380ms cubic-bezier(0.45,0,0.55,1), box-shadow 380ms ease",
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 22px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
        display: "flex",
        flexDirection: "column",
        color: "var(--bone)",
        fontFamily: "var(--serif)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      padding: "0 22px 18px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))"
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontStyle: "italic",
      fontSize: 15,
      color: "var(--silk-gold)",
      opacity: 0.85,
      letterSpacing: "0.04em"
    } }, "d\xE9couvrir"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        "aria-label": "fermer le menu",
        style: {
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ash-light)",
          opacity: 0.6,
          fontSize: 20,
          padding: "4px 6px",
          transition: "opacity 280ms ease"
        },
        onMouseEnter: (e) => e.currentTarget.style.opacity = 1,
        onMouseLeave: (e) => e.currentTarget.style.opacity = 0.6
      },
      "\xD7"
    )),
    /* @__PURE__ */ React.createElement("nav", { style: {
      flex: 1,
      overflowY: "auto",
      padding: "var(--s-3) 0"
    } }, items.map((it, i) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: it.route,
        onClick: () => goAndClose(it.route),
        style: {
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
          width: "100%",
          textAlign: "left",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "14px 22px",
          color: "var(--bone)",
          fontFamily: "var(--serif)",
          transition: "background 280ms ease, color 280ms ease",
          borderBottom: i < items.length - 1 ? "1px solid color-mix(in oklch, var(--silk-gold) 6%, var(--ash-deep))" : "none"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 4%, transparent)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        }
      },
      /* @__PURE__ */ React.createElement("span", { style: {
        fontSize: 18,
        color: "var(--silk-gold)",
        opacity: 0.78,
        marginTop: 1,
        minWidth: 18
      } }, it.glyph),
      /* @__PURE__ */ React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 3, flex: 1 } }, /* @__PURE__ */ React.createElement("span", { style: {
        fontStyle: "italic",
        fontSize: 15.5,
        letterSpacing: "0.005em"
      } }, it.label), /* @__PURE__ */ React.createElement("span", { style: {
        fontStyle: "italic",
        fontSize: 12.5,
        color: "var(--ash-light)",
        opacity: 0.7,
        lineHeight: 1.45,
        textWrap: "pretty"
      } }, it.hint))
    ))),
    /* @__PURE__ */ React.createElement("div", { style: {
      padding: "16px 22px 0",
      borderTop: "1px solid color-mix(in oklch, var(--silk-gold) 8%, var(--ash-deep))",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontStyle: "italic",
      fontSize: 11.5,
      color: "var(--ash-light)",
      opacity: 0.55,
      letterSpacing: "0.05em"
    } }, /* @__PURE__ */ React.createElement("span", null, "v0.4 \xB7 alpha"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        style: {
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--ash-light)",
          opacity: 0.7,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 11.5,
          padding: 0,
          letterSpacing: "0.05em"
        }
      },
      "\u2190 retour"
    ))
  ));
};
const DreamHome = ({ go, entries }) => {
  const [text, setText] = dhS("");
  const [submitting, setSubmitting] = dhS(false);
  const [error, setError] = dhS(null);
  const [recording, setRecording] = dhS(false);
  const [transcribing, setTranscribing] = dhS(false);
  const [reveal, setReveal] = dhS(null);
  const [protoReveal, setProtoReveal] = dhS(false);
  const [showLuneHint, setShowLuneHint] = dhS(false);
  const [propheticEcho, setPropheticEcho] = dhS(null);
  const [propheticDismissing, setPropheticDismissing] = dhS(false);
  const taRef = dhR(null);
  const mediaRef = dhR(null);
  const chunksRef = dhR([]);
  const invitation = dreamInvitation();
  const latest = (() => {
    if (!entries || entries.length === 0) return null;
    const reveLatest = entries.find((e) => {
      var _a;
      return e.type === "reve" || ((_a = e._raw) == null ? void 0 : _a.kairos_type) === "reve";
    });
    return reveLatest || entries[0];
  })();
  const pickMimeType = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/aac",
      "audio/ogg;codecs=opus"
    ];
    for (const t of candidates) {
      try {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t;
      } catch (e) {
      }
    }
    return "";
  };
  const startRecording = async () => {
    try {
      if (typeof MediaRecorder === "undefined") {
        setError("Enregistrement vocal non support\xE9 ici. Essaie en texte.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      const actualMime = mr.mimeType || mimeType || "audio/webm";
      chunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: actualMime });
        setTranscribing(true);
        try {
          const result = await window.DreamAPI.transcribe(blob, actualMime);
          if (result == null ? void 0 : result.text) setText((prev) => (prev ? prev + "\n\n" : "") + result.text);
          else if (result == null ? void 0 : result.error) setError("Transcription : " + result.error);
        } catch (e) {
          setError("Transcription \xE9chou\xE9e : " + e.message);
        } finally {
          setTranscribing(false);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setError("Micro inaccessible : " + e.message);
    }
  };
  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRecording(false);
  };
  const submit = async () => {
    var _a, _b, _c;
    if (text.trim().length < 3) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await window.DreamAPI.createKairos({
        raw_text: text.trim(),
        kairos_type: "reve",
        capture_method: recording || transcribing ? "voice" : "text"
      });
      try {
        (_b = (_a = window.wowRegistry) == null ? void 0 : _a.fire) == null ? void 0 : _b.call(_a, "premier-kairos");
      } catch (e) {
      }
      setText("");
      if (window.DreamRefreshEntries) setTimeout(() => window.DreamRefreshEntries(), 250);
      if (((_c = result == null ? void 0 : result.kairos) == null ? void 0 : _c.id) && typeof go === "function") {
        setTimeout(() => go("kairos", result.kairos.id), 350);
      }
    } catch (e) {
      setError("D\xE9p\xF4t \xE9chou\xE9 : " + e.message);
    } finally {
      setSubmitting(false);
    }
  };
  dhE(() => {
    let cancelled = false;
    (async () => {
      var _a;
      try {
        const localDismiss = parseInt(localStorage.getItem("dream:prophetic:dismissed") || "0", 10);
        if (localDismiss && Date.now() - localDismiss < 7 * 24 * 3600 * 1e3) return;
        if (!((_a = window.DreamAPI) == null ? void 0 : _a.getMaturedPropheticEchoes)) return;
        const r = await window.DreamAPI.getMaturedPropheticEchoes();
        if (cancelled) return;
        const e = (r == null ? void 0 : r.echoes) && r.echoes[0];
        if (e && e.kairos_id) setPropheticEcho(e);
      } catch (e) {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const dismissPropheticEcho = async () => {
    var _a;
    if (!propheticEcho || propheticDismissing) return;
    setPropheticDismissing(true);
    const id = propheticEcho.kairos_id;
    try {
      try {
        localStorage.setItem("dream:prophetic:dismissed", String(Date.now()));
      } catch (e) {
      }
      if ((_a = window.DreamAPI) == null ? void 0 : _a.dismissPropheticEcho) {
        await window.DreamAPI.dismissPropheticEcho(id);
      }
    } catch (e) {
    } finally {
      setPropheticEcho(null);
      setPropheticDismissing(false);
    }
  };
  const openPropheticEcho = () => {
    if (!propheticEcho) return;
    const id = propheticEcho.kairos_id;
    setPropheticEcho(null);
    if (typeof go === "function") go("kairos", id);
  };
  dhE(() => {
    let hasVisitedExplorer = false;
    try {
      hasVisitedExplorer = localStorage.getItem("dream:explorer-visited") === "true";
    } catch (e) {
    }
    if (hasVisitedExplorer) return;
    const t = setTimeout(() => setShowLuneHint(true), 2e3);
    return () => clearTimeout(t);
  }, []);
  dhE(() => {
    if (!entries || entries.length === 0) return;
    const lvl = shouldRevealDiscovery(entries.length);
    if (lvl) {
      const t = setTimeout(() => setReveal(lvl), 1400);
      return () => clearTimeout(t);
    }
    if (typeof window.shouldRevealProtocoles === "function" && window.shouldRevealProtocoles(entries.length)) {
      const t = setTimeout(() => setProtoReveal(true), 2e3);
      return () => clearTimeout(t);
    }
  }, [entries == null ? void 0 : entries.length]);
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    background: "var(--night-floor)",
    color: "var(--bone)",
    display: "flex",
    flexDirection: "column",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative",
    overflow: "hidden"
  } }, window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.42
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    background: "radial-gradient(ellipse 90% 60% at 50% 28%, color-mix(in oklch, var(--silk-gold) 6%, transparent) 0%, transparent 70%)"
  } }), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.22,
    zIndex: 1
  } }, /* @__PURE__ */ React.createElement("svg", { width: "100%", height: "100%", preserveAspectRatio: "none", style: { display: "block" } }, /* @__PURE__ */ React.createElement("rect", { width: "100%", height: "100%", filter: "url(#noise-ash)" }))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "0 22px 4px",
    minHeight: 56
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        try {
          localStorage.setItem("dream:explorer-visited", "true");
        } catch (e) {
        }
        setShowLuneHint(false);
        go && go("explorer");
      },
      "aria-label": "ouvrir explorer",
      title: "explorer toutes les portes de Dream",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 4,
        margin: -4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        transition: "transform 380ms cubic-bezier(0.45,0,0.55,1), opacity 280ms ease",
        opacity: 0.95
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.transform = "scale(1.08)";
        e.currentTarget.style.opacity = 1;
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.opacity = 0.95;
      }
    },
    /* @__PURE__ */ React.createElement(GlyphLuneDecroissante, { size: 32 }),
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      fontFamily: "var(--mono, monospace)",
      fontSize: 9,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "var(--ash-light)",
      opacity: showLuneHint ? 0.5 : 0,
      transition: "opacity 920ms ease",
      marginTop: 2,
      pointerEvents: "none"
    } }, "explorer")
  )), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "var(--s-6) 24px var(--s-5)",
    maxWidth: 580,
    width: "100%",
    margin: "0 auto"
  } }, propheticEcho && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "dh-prophetic-whisper",
      role: "button",
      tabIndex: 0,
      onClick: openPropheticEcho,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openPropheticEcho();
        }
      },
      "aria-label": "ouvrir le kairos qui r\xE9sonne",
      style: {
        position: "relative",
        marginBottom: "var(--s-5)",
        padding: "12px 36px 12px 14px",
        borderTop: "1px dashed color-mix(in oklch, var(--silk-gold) 30%, transparent)",
        borderBottom: "1px dashed color-mix(in oklch, var(--silk-gold) 30%, transparent)",
        cursor: "pointer",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        lineHeight: 1.55,
        color: "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))",
        letterSpacing: "0.005em",
        textWrap: "pretty",
        display: "flex",
        alignItems: "center",
        gap: 12,
        transition: "background 380ms ease, color 380ms ease",
        animation: "dh-whisper-fade-in 920ms ease-out"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 4%, transparent)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
      }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      fontSize: 17,
      color: "var(--silk-gold)",
      opacity: 0.85,
      animation: "dh-whisper-pulse 4s ease-in-out infinite",
      flexShrink: 0,
      fontStyle: "normal"
    } }, "\u25D1"),
    /* @__PURE__ */ React.createElement("span", { style: { flex: 1 } }, propheticEcho.whisper || "un kairos d'autrefois r\xE9sonne avec ta semaine", /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      marginLeft: 8,
      color: "color-mix(in oklch, var(--silk-gold) 60%, var(--ash-light))",
      opacity: 0.7
    } }, "\u2192")),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: (e) => {
          e.stopPropagation();
          dismissPropheticEcho();
        },
        "aria-label": "ne plus afficher ce chuchotement",
        title: "ne plus afficher",
        disabled: propheticDismissing,
        style: {
          position: "absolute",
          top: 6,
          right: 6,
          background: "transparent",
          border: "none",
          cursor: propheticDismissing ? "default" : "pointer",
          padding: "4px 8px",
          fontSize: 14,
          color: "var(--ash-light)",
          opacity: 0.5,
          fontFamily: "var(--serif)",
          fontStyle: "normal",
          lineHeight: 1,
          transition: "opacity 280ms ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.opacity = "0.85";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.opacity = "0.5";
        }
      },
      "\xD7"
    )
  ), window.GeoSymbol && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    display: "flex",
    justifyContent: "center",
    marginBottom: 14
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    width: 28,
    height: 28,
    opacity: 0.6,
    animation: "breathe-souffle 6s ease-in-out infinite"
  } }, /* @__PURE__ */ React.createElement(
    window.GeoSymbol,
    {
      kind: "spirale",
      color: "silk",
      style: { position: "relative", width: 28, height: 28, opacity: 1 }
    }
  ))), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 24,
    lineHeight: 1.45,
    color: "var(--bone)",
    textAlign: "center",
    marginBottom: "var(--s-5)",
    textWrap: "pretty",
    letterSpacing: "0.005em",
    textShadow: "0 1px 14px color-mix(in oklch, var(--night-floor) 50%, transparent)"
  } }, invitation), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%" } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      ref: taRef,
      value: text,
      onChange: (e) => {
        setText(e.target.value);
        setError(null);
      },
      placeholder: "raconte \u2014 un fragment, une image, une sensation\u2026",
      disabled: submitting,
      rows: 5,
      autoFocus: true,
      style: {
        width: "100%",
        minHeight: 140,
        background: "color-mix(in oklch, var(--night-warm) 60%, transparent)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
        padding: "18px 48px 18px 20px",
        // padding-right augmenté pour micro
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 17,
        lineHeight: 1.6,
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box",
        transition: "border-color 380ms ease"
      },
      onFocus: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
      onBlur: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: recording ? stopRecording : startRecording,
      "aria-label": recording ? "arr\xEAter l'enregistrement" : "d\xE9poser en voix",
      title: recording ? "arr\xEAter l'enregistrement" : "d\xE9poser en voix",
      style: {
        position: "absolute",
        top: 14,
        right: 14,
        background: "transparent",
        border: "none",
        padding: 6,
        cursor: "pointer",
        color: recording ? "var(--ember-live, #C97A4A)" : "var(--ash-light)",
        fontSize: 16,
        opacity: recording ? 1 : 0.55,
        display: "grid",
        placeItems: "center",
        transition: "all 280ms ease",
        borderRadius: "50%"
      },
      onMouseEnter: (e) => {
        if (!recording) e.currentTarget.style.opacity = 1;
      },
      onMouseLeave: (e) => {
        if (!recording) e.currentTarget.style.opacity = 0.55;
      }
    },
    recording ? "\u25A0" : "\u{1F399}"
  )), error && /* @__PURE__ */ React.createElement("div", { style: {
    color: "var(--ember-live, #C97A4A)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8
  } }, error), transcribing && /* @__PURE__ */ React.createElement("div", { style: {
    color: "var(--silk-gold)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8
  } }, "transcription en cours\u2026"), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: "var(--s-5)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: submit,
      disabled: submitting || text.trim().length < 3,
      "aria-label": "d\xE9poser ce r\xEAve",
      className: "dh-deposer-button",
      style: {
        width: 76,
        height: 76,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--ember) 32%, var(--night-warm)), color-mix(in oklch, var(--silk-gold) 18%, var(--night-floor)))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
        cursor: submitting || text.trim().length < 3 ? "not-allowed" : "pointer",
        opacity: submitting || text.trim().length < 3 ? 0.45 : 1,
        display: "grid",
        placeItems: "center",
        color: "var(--bone)",
        fontSize: 28,
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
        position: "relative",
        boxShadow: "0 0 32px color-mix(in oklch, var(--silk-gold) 22%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 22%, transparent)",
        animation: submitting || text.trim().length < 3 ? "none" : "dh-halo-pulse 8s ease-in-out infinite"
      }
    },
    submitting ? /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, "\u2026") : (
      /* 2026-04-29 — Demi-cercle aurore inline (Yeshua) :
         petit demi-cercle silk-gold qui pulse en mode silk-gold,
         remplace le "⌄" plat par un signe de seuil aurore. */
      /* @__PURE__ */ React.createElement(
        "svg",
        {
          viewBox: "0 0 60 28",
          width: "38",
          height: "20",
          "aria-hidden": "true",
          style: { display: "block", overflow: "visible" }
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M 4 24 Q 30 -4, 56 24",
            fill: "none",
            stroke: "color-mix(in oklch, var(--silk-gold) 90%, var(--bone))",
            strokeWidth: "1.4",
            strokeLinecap: "round",
            style: { filter: "drop-shadow(0 0 6px color-mix(in oklch, var(--silk-gold) 55%, transparent))" }
          }
        ),
        /* @__PURE__ */ React.createElement(
          "path",
          {
            d: "M 10 24 Q 30 4, 50 24",
            fill: "none",
            stroke: "color-mix(in oklch, var(--silk-gold) 60%, transparent)",
            strokeWidth: "0.9",
            strokeLinecap: "round",
            opacity: "0.6"
          }
        )
      )
    )
  ), /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--bone)",
    opacity: 0.85,
    letterSpacing: "0.02em"
  } }, "d\xE9poser un r\xEAve")), /* @__PURE__ */ React.createElement("style", null, `
          @keyframes dh-halo-pulse {
            0%   { box-shadow: 0 0 28px color-mix(in oklch, var(--silk-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 22%, transparent); }
            50%  { box-shadow: 0 0 48px color-mix(in oklch, var(--ember) 28%, transparent), 0 0 18px color-mix(in oklch, var(--silk-gold) 26%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 28%, transparent); }
            100% { box-shadow: 0 0 28px color-mix(in oklch, var(--silk-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 22%, transparent); }
          }
          /* Sprint P1 \xA7C \u2014 halo souffle derri\xE8re la lune top-left (8s) */
          @keyframes dh-halo-souffle {
            0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
            50%      { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08); }
          }
          /* Sprint P1 \xA7B \u2014 pulse glyph \u25D1 chuchotement (4s) */
          @keyframes dh-whisper-pulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50%      { opacity: 1;    transform: scale(1.12); }
          }
          /* Sprint P1 \xA7B \u2014 entr\xE9e du chuchotement (douce) */
          @keyframes dh-whisper-fade-in {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `)), latest && /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 2,
    padding: "var(--s-4) 24px 0",
    maxWidth: 580,
    width: "100%",
    margin: "0 auto",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("kairos", latest.id),
      "aria-label": "ouvrir la derni\xE8re entr\xE9e",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.55,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        lineHeight: 1.5,
        padding: "8px 0",
        maxWidth: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "block",
        margin: "0 auto",
        letterSpacing: "0.005em",
        transition: "opacity 380ms ease"
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = 0.85,
      onMouseLeave: (e) => e.currentTarget.style.opacity = 0.55
    },
    /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.7, marginRight: 8 } }, "\xB7"),
    (latest.text || "").slice(0, 88),
    (latest.text || "").length > 88 ? "\u2026" : ""
  )), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 2,
    padding: "var(--s-3) 24px 0",
    maxWidth: 580,
    width: "100%",
    margin: "0 auto",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("home-jour"),
      title: "bascule vers ton Journal de Vie LUMINEUX",
      "aria-label": "ouvrir le Journal de Vie",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))",
        opacity: 0.75,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "6px 4px",
        letterSpacing: "0.02em",
        textDecoration: "underline",
        textDecorationStyle: "dashed",
        textUnderlineOffset: 4,
        textDecorationColor: "color-mix(in oklch, var(--silk-gold) 35%, transparent)",
        transition: "opacity 380ms ease, color 380ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.color = "var(--silk-gold)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = 0.75;
        e.currentTarget.style.color = "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))";
      }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { marginRight: 5, fontSize: 12 } }, "\u2609"),
    "et ta vie de jour ?"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 2,
    padding: "var(--s-3) 24px 0",
    maxWidth: 580,
    width: "100%",
    margin: "0 auto",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 11.5,
    color: "var(--ash-light)",
    opacity: 0.5,
    letterSpacing: "0.08em",
    textTransform: "lowercase",
    marginBottom: 6
  } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    display: "inline-block",
    width: 14,
    height: 1,
    background: "color-mix(in oklch, var(--ash-light) 50%, transparent)"
  } }), /* @__PURE__ */ React.createElement("span", null, "et aussi"), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    display: "inline-block",
    width: 14,
    height: 1,
    background: "color-mix(in oklch, var(--ash-light) 50%, transparent)"
  } })), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12.5
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("explorer"),
      "aria-label": "ouvrir Sagesse des kairos via explorer",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.7,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12.5,
        padding: "3px 4px",
        letterSpacing: "0.02em",
        transition: "all 280ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.color = "var(--silk-gold)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = 0.7;
        e.currentTarget.style.color = "var(--ash-light)";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { marginRight: 4, opacity: 0.85 } }, "\u2726"),
    "appel sagesse"
  ), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { color: "var(--ash-light)", opacity: 0.35 } }, "\xB7"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("oracle-corps"),
      "aria-label": "ouvrir Oracle du Corps",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.7,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12.5,
        padding: "3px 4px",
        letterSpacing: "0.02em",
        transition: "all 280ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.color = "var(--silk-gold)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = 0.7;
        e.currentTarget.style.color = "var(--ash-light)";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { marginRight: 4, opacity: 0.85 } }, "\u25C9"),
    "oracle du corps"
  ), /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: { color: "var(--ash-light)", opacity: 0.35 } }, "\xB7"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("conte-miroir"),
      "aria-label": "ouvrir Tales \u2014 contes qui r\xE9pondent",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.7,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12.5,
        padding: "3px 4px",
        letterSpacing: "0.02em",
        transition: "all 280ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.color = "var(--silk-gold)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = 0.7;
        e.currentTarget.style.color = "var(--ash-light)";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { marginRight: 4, opacity: 0.85 } }, "\u274B"),
    "tales"
  ))), reveal && /* @__PURE__ */ React.createElement(DiscoveryReveal, { level: reveal, go, onClose: () => setReveal(null) }), protoReveal && window.ProtocoleDiscoveryReveal && /* @__PURE__ */ React.createElement(window.ProtocoleDiscoveryReveal, { go, onClose: () => setProtoReveal(false) }));
};
Object.assign(window, {
  DreamHome,
  DiscoveryReveal,
  DiscoverDrawer,
  // 2026-04-27 Sprint P0 §B
  shouldRevealDiscovery,
  markRevealedDiscovery: markRevealed,
  getRevealedDiscoveries: getRevealed,
  dreamInvitation
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1kcmVhbS1ob21lLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERyZWFtSG9tZSBcdTIwMTQgUG9ydGUgZCdlbnRyXHUwMEU5ZSBSXHUwMENBVkUgKGRpcmVjdGl2ZSBUaW0gMjAyNi0wNC0yNilcbi8vIFNwZWMgOiAxX0JJQkxFIFx1MDBBNzEuNiArIDJfREVTSUdOIFx1MDBBNzExLmJpcy4xMiArIDExLmJpcy4xNyAoUDAuMylcbi8vXG4vLyBQaXZvdCBjYXJkaW5hbCBUaW0gMjYvMDQgOlxuLy8gICBcIkxhIHBvcnRlIGQnZW50clx1MDBFOWUgcmVzdGUgbGUgUlx1MDBDQVZFLiBGYXV0IHF1ZSBjZSBzb2l0IGNsYWlyLCBldCBxdWVcbi8vICAgIFx1MDBFN2EgcmVzdGUgdW5lIHN1cGVyIERSRUFNIEFQUCBhdSBxdW90aWRpZW4uIEMnZXN0IExBIHBvcnRlXG4vLyAgICBkJ2VudHJcdTAwRTllLiBMZSByZXN0ZSBlc3QgdW5lIGRcdTAwRTljb3V2ZXJ0ZSBzdXJwcmVuYW50ZSBwZXJtYW5lbnRlXG4vLyAgICBkJ3VuZSBpbmNyb3lhYmxlIHByb2ZvbmRldXIuXCJcbi8vXG4vLyBDZXQgXHUwMEU5Y3JhbiByZW1wbGFjZSBgSm91cm5hbERlVmllSm91cmAgY29tbWUgcm91dGUgcGFyIGRcdTAwRTlmYXV0IGBob21lYC5cbi8vIExlIEpvdXJuYWwgZGUgVmllIExVTUlORVVYIGRldmllbnQgc291cy1wYWdlIGFjY2Vzc2libGUgdmlhXG4vLyBzd2lwZSBob3Jpem9udGFsIE9VIGxpZW4gXCJldCB0YSB2aWUgZGUgam91ciA/XCIgKGRcdTAwRTlwbGFjXHUwMEU5IGVuIGJhcyBQMC4zKS5cbi8vXG4vLyAyMDI2LTA0LTI3IFAwLjMgXHUyMDE0IFJlZm9udGUgaGlcdTAwRTlyYXJjaGllIDMgbml2ZWF1eCA6XG4vLyAgIC0gSEVSTyAocHJpbWFpcmUpIDogcGhyYXNlIGludml0YXRpb24gKyB0ZXh0YXJlYSArIGJvdXRvbiBcdTIzMDRcbi8vICAgLSBBTUJJQU5DRSAoc2Vjb25kYWlyZSkgOiBnbHlwaGUgbHVuZSB0b3AtbGVmdCBhdmVjIGhpbnQgKyBoYWxvXG4vLyAgIC0gSU5WSVRBVElPTlMgKHRlcnRpYWlyZSkgOiBcImV0IHRhIHZpZSBkZSBqb3VyID9cIiArIFwiZXQgYXVzc2lcIlxuLy8gICAgIGxpZW5zIHRleHRlIHNvYnJlcyBlbiBiYXMgKGF1LWRlc3N1cyBkdSBCb3R0b21OYXYpXG4vL1xuLy8gRHJhd2VyIGNhY2hcdTAwRTkgU1VQUFJJTVx1MDBDOSAoXHUwMEE3MTEuYmlzLjE3KS4gR2x5cGhlIGx1bmUgcm91dGUgbWFpbnRlbmFudFxuLy8gdmVycyAvZXhwbG9yZXIgKG9uZ2xldCBwZXJtYW5lbnQgQm90dG9tTmF2KS5cbi8vXG4vLyBQYXR0ZXJucyBkb21pbmFudHMgOlxuLy8gICAtIERSRUFNX0ZJUlNUX0VOVFJZIChsYSBwcm9tZXNzZSByXHUwMEVBdmUgaG9ub3JcdTAwRTllIGRcdTAwRThzIGxhIDFcdTAwRThyZSBzZWNvbmRlKVxuLy8gICAtIERJU0NPVkVSQUJMRV9ERVBUSCAoUC1aXHUwMEU5cm8gXHUwMEE3Mi4xIFx1MjAxNCBwcm9mb25kZXVyIHJcdTAwRTl2XHUwMEU5bFx1MDBFOWUgcHJvZ3Jlc3NpdmVtZW50KVxuLy8gICAtIEdFU1RFX1VOSVFVRSAoZFx1MDBFOXBvc2VyIFx1MjAxNCBpY2kgcGFyIGRcdTAwRTlmYXV0IHVuIGthaXJvcyB0eXBlPSdyZXZlJylcbi8vICAgLSBLQUlST1NfUFJFVklFVyAoZGVybmlcdTAwRThyZSBlbnRyXHUwMEU5ZSBkaXNjclx1MDBFOHRlIGVuIGJhcylcbi8vICAgLSBISVx1MDBDOVJBUkNISUUgRVhQTElDSVRFIChQMC4zKSBcdTIwMTQgMyBuaXZlYXV4IGNsYWlycywgcGFzIGRlIGJvdXRvbiBtdWV0XG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgeyB1c2VTdGF0ZTogZGhTLCB1c2VFZmZlY3Q6IGRoRSwgdXNlUmVmOiBkaFIgfSA9IFJlYWN0O1xuXG4vLyBcdTI1MDBcdTI1MDAgUGhyYXNlcyBkJ2ludml0YXRpb24gcm90YXRpdmUgc2Vsb24gaGV1cmUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5mdW5jdGlvbiBkcmVhbUludml0YXRpb24oKSB7XG4gIGNvbnN0IGggPSBuZXcgRGF0ZSgpLmdldEhvdXJzKCk7XG4gIC8vIG1hdGluICg0LTExKSA6IG9uIHJldmllbnQgZGUgbGEgbnVpdFxuICBpZiAoaCA+PSA0ICYmIGggPCAxMikgcmV0dXJuIFwiUXVlbCByXHUwMEVBdmUgdmllbnQgY2UgbWF0aW4gP1wiO1xuICAvLyBhcHJcdTAwRThzLW1pZGkgKDEyLTE4KSA6IHVuIHJcdTAwRUF2ZSB0J2EgbWFycXVcdTAwRTkgP1xuICBpZiAoaCA+PSAxMiAmJiBoIDwgMTkpIHJldHVybiBcIlVuIHJcdTAwRUF2ZSB0J2EgbWFycXVcdTAwRTkgYXVqb3VyZCdodWkgP1wiO1xuICAvLyBzb2lyL251aXQgKDE5LTMpIDogZFx1MDBFOXBvc2VyIHBvdXIgbGEgbnVpdCBxdWkgdmllbnRcbiAgcmV0dXJuIFwiUXVlbCByXHUwMEVBdmUgdmV1eC10dSBkXHUwMEU5cG9zZXIgP1wiO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgR2x5cGhlIGx1bmUgZFx1MDBFOWNyb2lzc2FudGUgKFNWRykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBTcHJpbnQgUDEgXHUwMEE3QyA6IGVudmVsb3BwXHUwMEU5IGQndW4gaGFsbyByYWRpYWwgc2lsay1nb2xkIHJlc3BpcmFudCA4cy5cbi8vIExlIGhhbG8gZXN0IHJlbmR1IGVuIGdyYWRpZW50IFNWRyAocmFkaWFsR3JhZGllbnQpICsgYW5pbWF0aW9uIGBkaC1oYWxvLXNvdWZmbGVgXG4vLyBkXHUwMEU5ZmluaWUgZGFucyBsYSA8c3R5bGU+IGdsb2JhbGUgZHUgY29tcG9zYW50IChjbFx1MDBFOSA6IHByXHUwMEU5c2VuY2UgZCd1biBrZXlmcmFtZVxuLy8gZGFucyBsZSBibG9jayBzdHlsZSBnbG9iYWwgYXUgYmFzIGRlIERyZWFtSG9tZSkuXG5mdW5jdGlvbiBHbHlwaEx1bmVEZWNyb2lzc2FudGUoeyBzaXplID0gMzYgfSkge1xuICAvLyBIYWxvIDgwXHUwMEQ3ODAgKG91IDIuMjJcdTAwRDcgbGEgdGFpbGxlIGRlIGxhIGx1bmUpIFx1MjAxNCBuZSBib3VnZSBwYXMgbGUgbGF5b3V0IGR1IGJvdXRvblxuICAvLyBjYXIgcG9zaXRpb25uXHUwMEU5IGFic29sdXRlIGRlcnJpXHUwMEU4cmUuIFV0aWxpc1x1MDBFOSBzZXVsZW1lbnQgcXVhbmQgc2l6ZSA+PSAzMiAocGFzXG4gIC8vIHN1ciBsZXMgcGV0aXRzIGdseXBoZXMgZGVzIG1vZGFsIGhlYWRlcnMpLlxuICBjb25zdCBoYWxvU2l6ZSA9IE1hdGgubWF4KHNpemUgKiAyLjQsIDgwKTtcbiAgY29uc3Qgc2hvd0hhbG8gPSBzaXplID49IDI4O1xuICByZXR1cm4gKFxuICAgIDxzcGFuIHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIGRpc3BsYXk6IFwiaW5saW5lLWdyaWRcIiwgcGxhY2VJdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgIHtzaG93SGFsbyAmJiAoXG4gICAgICAgIDxzdmdcbiAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgIHdpZHRoPXtoYWxvU2l6ZX1cbiAgICAgICAgICBoZWlnaHQ9e2hhbG9TaXplfVxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMTAwIDEwMFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICB0b3A6IFwiNTAlXCIsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFwidHJhbnNsYXRlKC01MCUsIC01MCUpXCIsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNTUsXG4gICAgICAgICAgICBhbmltYXRpb246IFwiZGgtaGFsby1zb3VmZmxlIDhzIGVhc2UtaW4tb3V0IGluZmluaXRlXCIsXG4gICAgICAgICAgICBmaWx0ZXI6IFwiYmx1cigwLjZweClcIixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICA8cmFkaWFsR3JhZGllbnQgaWQ9e2BkaC1oYWxvLWdyYWQtJHtzaXplfWB9IGN4PVwiNTAlXCIgY3k9XCI1MCVcIiByPVwiNTAlXCI+XG4gICAgICAgICAgICAgIDxzdG9wIG9mZnNldD1cIjAlXCIgc3RvcENvbG9yPVwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDUwJSwgdHJhbnNwYXJlbnQpXCIgc3RvcE9wYWNpdHk9XCIwLjQyXCIgLz5cbiAgICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiNTUlXCIgc3RvcENvbG9yPVwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI4JSwgdHJhbnNwYXJlbnQpXCIgc3RvcE9wYWNpdHk9XCIwLjE4XCIgLz5cbiAgICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PVwiMTAwJVwiIHN0b3BDb2xvcj1cImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHRyYW5zcGFyZW50KVwiIHN0b3BPcGFjaXR5PVwiMFwiIC8+XG4gICAgICAgICAgICA8L3JhZGlhbEdyYWRpZW50PlxuICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICA8Y2lyY2xlIGN4PVwiNTBcIiBjeT1cIjUwXCIgcj1cIjQ4XCIgZmlsbD17YHVybCgjZGgtaGFsby1ncmFkLSR7c2l6ZX0pYH0gLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICApfVxuICAgICAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSB2aWV3Qm94PVwiMCAwIDEwMCAxMDBcIiBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIsIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIgfX0+XG4gICAgICAgIHsvKiBsdW5lIGRcdTAwRTljcm9pc3NhbnRlIDogZGlzcXVlIG1hc3F1XHUwMEU5IHBhciBjcm9pc3NhbnQgXHUwMEUwIGRyb2l0ZSAqL31cbiAgICAgICAgPGRlZnM+XG4gICAgICAgICAgPG1hc2sgaWQ9XCJsdW5lLWRlY3JvaXNzYW50ZS1tYXNrXCI+XG4gICAgICAgICAgICA8cmVjdCB4PVwiMFwiIHk9XCIwXCIgd2lkdGg9XCIxMDBcIiBoZWlnaHQ9XCIxMDBcIiBmaWxsPVwid2hpdGVcIiAvPlxuICAgICAgICAgICAgPGNpcmNsZSBjeD1cIjYyXCIgY3k9XCI1MFwiIHI9XCIzNFwiIGZpbGw9XCJibGFja1wiIC8+XG4gICAgICAgICAgPC9tYXNrPlxuICAgICAgICA8L2RlZnM+XG4gICAgICAgIDxjaXJjbGUgY3g9XCI1MFwiIGN5PVwiNTBcIiByPVwiMzJcIiBmaWxsPVwibm9uZVwiXG4gICAgICAgICAgc3Ryb2tlPVwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDQ1JSwgdmFyKC0tYm9uZSkpXCJcbiAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuMVwiIG9wYWNpdHk9XCIwLjY1XCIgLz5cbiAgICAgICAgPGNpcmNsZSBjeD1cIjUwXCIgY3k9XCI1MFwiIHI9XCIzMlwiXG4gICAgICAgICAgZmlsbD1cImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiXG4gICAgICAgICAgbWFzaz1cInVybCgjbHVuZS1kZWNyb2lzc2FudGUtbWFzaylcIlxuICAgICAgICAgIG9wYWNpdHk9XCIwLjg1XCIgLz5cbiAgICAgIDwvc3ZnPlxuICAgIDwvc3Bhbj5cbiAgKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBEXHUwMEU5Y291dmVydGUgcHJvZ3Jlc3NpdmUgXHUyMDE0IHN5c3RcdTAwRThtZSBkJ2F1dG8tclx1MDBFOXZcdTAwRTlsYXRpb25cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBSRVZFQUxfS0VZID0gXCJkcmVhbTpkaXNjb3Zlcnk6cmV2ZWFsZWRcIjtcbmNvbnN0IFJFVkVBTF9ESVNNSVNTRURfS0VZID0gXCJkcmVhbTpkaXNjb3Zlcnk6ZGlzbWlzc2VkLWF0XCI7XG5cbmNvbnN0IERJU0NPVkVSWV9MRVZFTFMgPSBbXG4gIHtcbiAgICBrZXk6IFwiam91cm5hbC12aWVcIixcbiAgICB0aHJlc2hvbGQ6IDMsXG4gICAgZ2x5cGg6IFwiXHUyNjA5XCIsXG4gICAgdGl0bGU6IFwidW5lIHNlY29uZGUgcG9ydGUgcydvdXZyZVwiLFxuICAgIHRleHQ6IFwiMyByXHUwMEVBdmVzIGRcdTAwRTlwb3NcdTAwRTlzLiBTYWlzLXR1IHF1J2lscyBwZXV2ZW50IFx1MDBFOWNsYWlyZXIgdGEgdmllIGRlIGpvdXIgP1wiLFxuICAgIGN0YTogXCJvdXZyaXIgSm91cm5hbCBkZSBWaWVcIixcbiAgICByb3V0ZTogXCJob21lLWpvdXJcIixcbiAgfSxcbiAge1xuICAgIGtleTogXCJjZXJjbGVcIixcbiAgICB0aHJlc2hvbGQ6IDcsXG4gICAgZ2x5cGg6IFwiXHUyNUNCXCIsXG4gICAgdGl0bGU6IFwidHUgbidlcyBwYXMgc2V1bFx1MDBCN2UgXHUwMEUwIHJcdTAwRUF2ZXJcIixcbiAgICB0ZXh0OiBcIjcgclx1MDBFQXZlcyBkXHUwMEU5cG9zXHUwMEU5cy4gVHUgcGV1eCBhdXNzaSByZWpvaW5kcmUgdW4gY2VyY2xlIHBvdXIgcGFydGFnZXIuXCIsXG4gICAgY3RhOiBcImRcdTAwRTljb3V2cmlyIGxlcyBjZXJjbGVzXCIsXG4gICAgcm91dGU6IFwiY2VyY2xlXCIsXG4gIH0sXG4gIHtcbiAgICBrZXk6IFwiYW5pbWFcIixcbiAgICB0aHJlc2hvbGQ6IDE0LFxuICAgIGdseXBoOiBcIlx1MjVEMFwiLFxuICAgIHRpdGxlOiBcImxlIHJcdTAwRUF2ZSBkdSBtb25kZSB0J2F0dGVuZFwiLFxuICAgIC8vIDIwMjYtMDQtMjcgUDAuNCBcdTIwMTQgdGV4dCBwZXV0IFx1MDBFQXRyZSB1biByZW5kZXIgZnVuY3Rpb24gKEpTWCkgcG91ciBUZXJtRGVmXG4gICAgdGV4dDogKCkgPT4ge1xuICAgICAgY29uc3QgVCA9IHdpbmRvdy5UZXJtRGVmO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICAxNCByXHUwMEVBdmVzIGRcdTAwRTlwb3NcdTAwRTlzLiB7VCA/IDxUIHRlcm09XCJhbmltYV9tdW5kaVwiIC8+IDogXCJBbmltYSBNdW5kaVwifSBcdTIwMTQgbGEgdm9cdTAwRkJ0ZSBjb21tdW5lIFx1MjAxNCBhIHF1ZWxxdWUgY2hvc2UgXHUwMEUwIHRlIGRpcmUuXG4gICAgICAgIDwvPlxuICAgICAgKTtcbiAgICB9LFxuICAgIGN0YTogXCJvdXZyaXIgQW5pbWEgTXVuZGlcIixcbiAgICByb3V0ZTogXCJhbmltYVwiLFxuICB9LFxuICB7XG4gICAga2V5OiBcInBvcnRyYWl0LWxldHRyZVwiLFxuICAgIHRocmVzaG9sZDogMzAsXG4gICAgZ2x5cGg6IFwiXHUyNzM3XCIsXG4gICAgdGl0bGU6IFwidW5lIGxldHRyZSB0J2EgXHUwMEU5dFx1MDBFOSB0aXNzXHUwMEU5ZVwiLFxuICAgIHRleHQ6ICgpID0+IHtcbiAgICAgIGNvbnN0IFQgPSB3aW5kb3cuVGVybURlZjtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgMzAgclx1MDBFQXZlcyBkXHUwMEU5cG9zXHUwMEU5cy4gVW5lIGxlY3R1cmUgcGVyc29ubmVsbGUgcGV1dCBcdTAwRUF0cmUgZmFpdGUgXHUyMDE0IHRhIHtUID8gPFQgdGVybT1cInBvcnRyYWl0X2xldHRyZVwiIC8+IDogXCJsZXR0cmUgZHUgbW9tZW50XCJ9LlxuICAgICAgICA8Lz5cbiAgICAgICk7XG4gICAgfSxcbiAgICBjdGE6IFwiZGVtYW5kZXIgbWEgbGV0dHJlXCIsXG4gICAgcm91dGU6IFwicG9ydHJhaXRcIixcbiAgfSxcbl07XG5cbmZ1bmN0aW9uIGdldFJldmVhbGVkKCkge1xuICB0cnkgeyByZXR1cm4gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRVZFQUxfS0VZKSB8fCBcIltdXCIpOyB9XG4gIGNhdGNoIHsgcmV0dXJuIFtdOyB9XG59XG5mdW5jdGlvbiBtYXJrUmV2ZWFsZWQoa2V5KSB7XG4gIHRyeSB7XG4gICAgY29uc3QgciA9IGdldFJldmVhbGVkKCk7XG4gICAgaWYgKCFyLmluY2x1ZGVzKGtleSkpIHtcbiAgICAgIHIucHVzaChrZXkpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUkVWRUFMX0tFWSwgSlNPTi5zdHJpbmdpZnkocikpO1xuICAgIH1cbiAgfSBjYXRjaCB7fVxufVxuZnVuY3Rpb24gZ2V0RGlzbWlzc2VkQXQoKSB7XG4gIHRyeSB7IHJldHVybiBwYXJzZUludChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShSRVZFQUxfRElTTUlTU0VEX0tFWSkgfHwgXCIwXCIsIDEwKTsgfVxuICBjYXRjaCB7IHJldHVybiAwOyB9XG59XG5mdW5jdGlvbiBzZXREaXNtaXNzZWRBdCh0KSB7XG4gIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKFJFVkVBTF9ESVNNSVNTRURfS0VZLCBTdHJpbmcodCkpOyB9IGNhdGNoIHt9XG59XG5cbi8vIHNob3VsZFJldmVhbERpc2NvdmVyeShrYWlyb3NDb3VudCkgXHUyMTkyIHJldHVybnMgdGhlIG5leHQgcGVuZGluZyBsZXZlbCBvciBudWxsLlxuLy8gU2tpcCBpZiBhIGxldmVsIHdhcyBkaXNtaXNzZWQgaW4gdGhlIGxhc3QgN2QuXG5mdW5jdGlvbiBzaG91bGRSZXZlYWxEaXNjb3Zlcnkoa2Fpcm9zQ291bnQpIHtcbiAgY29uc3QgcmV2ZWFsZWQgPSBnZXRSZXZlYWxlZCgpO1xuICBjb25zdCBkaXNtaXNzZWRBdCA9IGdldERpc21pc3NlZEF0KCk7XG4gIC8vIFJlLXByb21wdCBjb29sZG93biA6IDdqXG4gIGlmIChkaXNtaXNzZWRBdCAmJiBEYXRlLm5vdygpIC0gZGlzbWlzc2VkQXQgPCA3ICogMjQgKiAzNjAwICogMTAwMCkgcmV0dXJuIG51bGw7XG4gIGZvciAoY29uc3QgbHZsIG9mIERJU0NPVkVSWV9MRVZFTFMpIHtcbiAgICBpZiAocmV2ZWFsZWQuaW5jbHVkZXMobHZsLmtleSkpIGNvbnRpbnVlO1xuICAgIGlmIChrYWlyb3NDb3VudCA+PSBsdmwudGhyZXNob2xkKSByZXR1cm4gbHZsO1xuICB9XG4gIHJldHVybiBudWxsO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgTW9kYWwgZG91Y2UgZGUgclx1MDBFOXZcdTAwRTlsYXRpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBEaXNjb3ZlcnlSZXZlYWwgPSAoeyBsZXZlbCwgZ28sIG9uQ2xvc2UgfSkgPT4ge1xuICBpZiAoIWxldmVsKSByZXR1cm4gbnVsbDtcbiAgY29uc3QgaGFuZGxlRGlzY292ZXIgPSAoKSA9PiB7XG4gICAgbWFya1JldmVhbGVkKGxldmVsLmtleSk7XG4gICAgb25DbG9zZSAmJiBvbkNsb3NlKCk7XG4gICAgaWYgKHR5cGVvZiBnbyA9PT0gXCJmdW5jdGlvblwiKSBzZXRUaW1lb3V0KCgpID0+IGdvKGxldmVsLnJvdXRlKSwgMjAwKTtcbiAgfTtcbiAgY29uc3QgaGFuZGxlTGF0ZXIgPSAoKSA9PiB7XG4gICAgc2V0RGlzbWlzc2VkQXQoRGF0ZS5ub3coKSk7XG4gICAgb25DbG9zZSAmJiBvbkNsb3NlKCk7XG4gIH07XG4gIHJldHVybiAoXG4gICAgPGRpdiByb2xlPVwiZGlhbG9nXCIgYXJpYS1tb2RhbD1cInRydWVcIiBhcmlhLWxhYmVsPXtsZXZlbC50aXRsZX1cbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIGluc2V0OiAwLCB6SW5kZXg6IDMwMCxcbiAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA4MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICBiYWNrZHJvcEZpbHRlcjogXCJibHVyKDhweClcIixcbiAgICAgICAgV2Via2l0QmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig4cHgpXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgIGFuaW1hdGlvbjogXCJkaC1tb2RhbC1mYWRlLWluIDQ4MG1zIGVhc2VcIixcbiAgICAgIH19PlxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBtYXhXaWR0aDogNDIwLCB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA5MiUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTYpIHZhcigtLXMtNSlcIixcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICBib3hTaGFkb3c6IFwiMCA2cHggNDBweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA2MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250U2l6ZTogMzIsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBvcGFjaXR5OiAwLjg1LFxuICAgICAgICB9fT57bGV2ZWwuZ2x5cGh9PC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDE3LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAxZW1cIixcbiAgICAgICAgfX0+e2xldmVsLnRpdGxlfTwvZGl2PlxuICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICBmb250U2l6ZTogMTUsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgIH19Pnt0eXBlb2YgbGV2ZWwudGV4dCA9PT0gXCJmdW5jdGlvblwiID8gbGV2ZWwudGV4dCgpIDogbGV2ZWwudGV4dH08L3A+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogMTAgfX0+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVEaXNjb3Zlcn1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDUwJSwgdmFyKC0tYm9uZSkpXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjExcHggMjJweFwiLFxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBlYXNlXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtsZXZlbC5jdGF9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtoYW5kbGVMYXRlcn1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjhweCAwXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHBsdXMgdGFyZFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIEBrZXlmcmFtZXMgZGgtbW9kYWwtZmFkZS1pbiB7XG4gICAgICAgICAgZnJvbSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSg4cHgpOyB9XG4gICAgICAgICAgdG8gICB7IG9wYWNpdHk6IDE7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfVxuICAgICAgICB9XG4gICAgICBgfTwvc3R5bGU+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgRHJhd2VyIFwiZFx1MDBFOWNvdXZyaXJcIiAoU3ByaW50IFAwIFx1MDBBN0IgMjAyNi0wNC0yNykgXHUyMDE0IExFR0FDWSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIDIwMjYtMDQtMjcgKFAwLjIpIDogRFJBV0VSIE9CU09MXHUwMEM4VEUuIExlIGh1YiBcImRcdTAwRTljb3V2cmlyXCIgZXN0XG4vLyBkZXZlbnUgdW4gb25nbGV0IHBlcm1hbmVudCBkYW5zIEJvdHRvbU5hdiAocm91dGUgXCJleHBsb3JlclwiLFxuLy8gY29tcG9zYW50IEV4cGxvcmVyU2NyZWVuKS4gTGUgY29tcG9zYW50IGVzdCBjb25zZXJ2XHUwMEU5IGVuXG4vLyBjb21wYXRpYmlsaXRcdTAwRTkgKHpcdTAwRTlybyBjb25zb21tYXRldXIgZGFucyBsJ2FwcCBhcHJcdTAwRThzIGNldHRlIHJlZm9udGUpXG4vLyBtYWlzIE4nRVNUIFBMVVMgQVBQRUxcdTAwQzkgZGVwdWlzIERyZWFtSG9tZSAobGUgZ2x5cGhlIGx1bmUgcm91dGVcbi8vIGRpcmVjdGVtZW50IHZlcnMgL2V4cGxvcmVyKS5cbi8vXG4vLyBcdTAwQzAgcmV0aXJlciBkYW5zIHVuZSBzZXNzaW9uIHN1aXZhbnRlIGFwclx1MDBFOHMgdlx1MDBFOXJpZi4gZGUgelx1MDBFOXJvIHVzYWdlLlxuY29uc3QgRGlzY292ZXJEcmF3ZXIgPSAoeyBvcGVuLCBvbkNsb3NlLCBnbyB9KSA9PiB7XG4gIC8vIEZlcm1lIGRyYXdlciBwdWlzIHJvdXRlIHZlcnMgbGEgZGVzdGluYXRpb25cbiAgY29uc3QgZ29BbmRDbG9zZSA9IChyb3V0ZSkgPT4ge1xuICAgIG9uQ2xvc2UgJiYgb25DbG9zZSgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0cnkgeyBnbyAmJiBnbyhyb3V0ZSk7IH0gY2F0Y2gge30gfSwgMjIwKTtcbiAgfTtcblxuICAvLyBJdGVtcyBkdSBkcmF3ZXIgXHUyMDE0IHNvYnJlcywgdW4gcGFyIHVuLCBwYWxldHRlIG5pZ2h0LXdhcm1cbiAgY29uc3QgaXRlbXMgPSBbXG4gICAgeyBnbHlwaDogXCJcdTI2MDlcIiwgbGFiZWw6IFwiVGVzIGthaXJvc1wiLCAgICAgICAgICAgICAgICBoaW50OiBcImwnaGlzdG9yaXF1ZSBkZSB0ZXMgclx1MDBFQXZlcyBldCBzaWduZXNcIiwgICAgICByb3V0ZTogXCJqb3VybmFsXCIgfSxcbiAgICB7IGdseXBoOiBcIlx1MjVDOVwiLCBsYWJlbDogXCJPcmFjbGUgZHUgQ29ycHNcIiwgICAgICAgICAgIGhpbnQ6IFwibGUgY29ycHMgY29tbWUgc2lzbW9ncmFwaGVcIiwgICAgICAgICAgICAgICByb3V0ZTogXCJvcmFjbGUtY29ycHNcIiB9LFxuICAgIHsgZ2x5cGg6IFwiXHUyNzI2XCIsIGxhYmVsOiBcIkNhdWNoZW1hcnMgJiBEZXVpbFwiLCAgICAgICAgaGludDogXCJzYW5jdHVhaXJlIHBvdXIgY2UgcXVpIHBcdTAwRThzZVwiLCAgICAgICAgICAgICAgcm91dGU6IFwibmlnaHRtYXJlc1wiIH0sXG4gICAgeyBnbHlwaDogXCJcdTI3NEJcIiwgbGFiZWw6IFwiVGFsZXMgXHUyMDE0IGNvbnRlcyBxdWkgclx1MDBFOXBvbmRlbnRcIiwgaGludDogXCIzMiBjb250ZXMgclx1MDBFOWVscyBxdWkgZm9udCBcdTAwRTljaG9cIiwgICAgICAgICByb3V0ZTogXCJjb250ZS1taXJvaXJcIiB9LFxuICAgIHsgZ2x5cGg6IFwiXHUyNUQwXCIsIGxhYmVsOiBcIk1vZGUgTHVjaWRcIiwgICAgICAgICAgICAgICAgaGludDogXCJwb3VyIHByYXRpcXVlciBsZSByXHUwMEVBdmUgbHVjaWRlXCIsICAgICAgICAgICAgcm91dGU6IFwibHVjaWQtcHJvZmlsZVwiIH0sXG4gICAgeyBnbHlwaDogXCJcdTAwQjdcIiwgbGFiZWw6IFwiUGFyYW1cdTAwRTh0cmVzXCIsICAgICAgICAgICAgICAgIGhpbnQ6IFwicHJcdTAwRTlmXHUwMEU5cmVuY2VzLCBub3RpZmljYXRpb25zXCIsICAgICAgICAgICAgICAgcm91dGU6IFwicHJpdmFjeVwiIH0sXG4gIF07XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgey8qIE92ZXJsYXkgKHRhcC1vdXRzaWRlIGZlcm1lKSAqL31cbiAgICAgIDxkaXZcbiAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBpbnNldDogMCwgekluZGV4OiAzMTAsXG4gICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA3MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIG9wYWNpdHk6IG9wZW4gPyAxIDogMCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBvcGVuID8gXCJhdXRvXCIgOiBcIm5vbmVcIixcbiAgICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgMzAwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjU1LDEpXCIsXG4gICAgICAgICAgYmFja2Ryb3BGaWx0ZXI6IG9wZW4gPyBcImJsdXIoNHB4KVwiIDogXCJub25lXCIsXG4gICAgICAgICAgV2Via2l0QmFja2Ryb3BGaWx0ZXI6IG9wZW4gPyBcImJsdXIoNHB4KVwiIDogXCJub25lXCIsXG4gICAgICAgIH19XG4gICAgICAvPlxuICAgICAgey8qIERyYXdlciBwYW5lbCBcdTIwMTQgc2xpZGUtaW4gZ2F1Y2hlICovfVxuICAgICAgPGFzaWRlXG4gICAgICAgIHJvbGU9XCJkaWFsb2dcIlxuICAgICAgICBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJkXHUwMEU5Y291dnJpciBsZXMgYXV0cmVzIGVudHJcdTAwRTllc1wiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIiwgdG9wOiAwLCBib3R0b206IDAsIGxlZnQ6IDAsXG4gICAgICAgICAgd2lkdGg6IFwibWluKDg2dncsIDM0MHB4KVwiLFxuICAgICAgICAgIHpJbmRleDogMzExLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA5NiUsIHZhcigtLW5pZ2h0LWZsb29yKSlcIixcbiAgICAgICAgICBib3JkZXJSaWdodDogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE4JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICAgIGJveFNoYWRvdzogb3BlbiA/IFwiOHB4IDAgMjhweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA1MCUsIHRyYW5zcGFyZW50KVwiIDogXCJub25lXCIsXG4gICAgICAgICAgdHJhbnNmb3JtOiBvcGVuID8gXCJ0cmFuc2xhdGVYKDApXCIgOiBcInRyYW5zbGF0ZVgoLTEwNCUpXCIsXG4gICAgICAgICAgdHJhbnNpdGlvbjogXCJ0cmFuc2Zvcm0gMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjU1LDEpLCBib3gtc2hhZG93IDM4MG1zIGVhc2VcIixcbiAgICAgICAgICBwYWRkaW5nVG9wOiBcImNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC10b3AsIDBweCkgKyAyMnB4KVwiLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSwgMHB4KSArIDE4cHgpXCIsXG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7LyogSGVhZGVyIGRyYXdlciAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIHBhZGRpbmc6IFwiMCAyMnB4IDE4cHhcIixcbiAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEwJSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTUsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDRlbVwiLFxuICAgICAgICAgIH19PmRcdTAwRTljb3V2cmlyPC9zcGFuPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwiZmVybWVyIGxlIG1lbnVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDIwLCBwYWRkaW5nOiBcIjRweCA2cHhcIixcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxfVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC42fVxuICAgICAgICAgID5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIEl0ZW1zICovfVxuICAgICAgICA8bmF2IHN0eWxlPXt7XG4gICAgICAgICAgZmxleDogMSwgb3ZlcmZsb3dZOiBcImF1dG9cIixcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMykgMFwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7aXRlbXMubWFwKChpdCwgaSkgPT4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2l0LnJvdXRlfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnb0FuZENsb3NlKGl0LnJvdXRlKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJmbGV4LXN0YXJ0XCIsIGdhcDogMTQsXG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLCB0ZXh0QWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjE0cHggMjJweFwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImJhY2tncm91bmQgMjgwbXMgZWFzZSwgY29sb3IgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogaSA8IGl0ZW1zLmxlbmd0aCAtIDFcbiAgICAgICAgICAgICAgICAgID8gXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYlLCB2YXIoLS1hc2gtZGVlcCkpXCJcbiAgICAgICAgICAgICAgICAgIDogXCJub25lXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiB7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcInRyYW5zcGFyZW50XCI7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDE4LCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIG9wYWNpdHk6IDAuNzgsXG4gICAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxLCBtaW5XaWR0aDogMTgsXG4gICAgICAgICAgICAgIH19PntpdC5nbHlwaH08L3NwYW4+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDMsIGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LjUsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDA1ZW1cIixcbiAgICAgICAgICAgICAgICB9fT57aXQubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMi41LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQ1LCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgICAgICB9fT57aXQuaGludH08L3NwYW4+XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L25hdj5cblxuICAgICAgICB7LyogRm9vdGVyIGRyYXdlciAqL31cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIHBhZGRpbmc6IFwiMTZweCAyMnB4IDBcIixcbiAgICAgICAgICBib3JkZXJUb3A6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA4JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTEuNSxcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNTUsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHNwYW4+djAuNCBcdTAwQjcgYWxwaGE8L3NwYW4+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDExLjUsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cdTIxOTAgcmV0b3VyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9hc2lkZT5cbiAgICA8Lz5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBEcmVhbUhvbWUgXHUyMDE0IGNvbXBvc2FudCBwcmluY2lwYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBEcmVhbUhvbWUgPSAoeyBnbywgZW50cmllcyB9KSA9PiB7XG4gIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IGRoUyhcIlwiKTtcbiAgY29uc3QgW3N1Ym1pdHRpbmcsIHNldFN1Ym1pdHRpbmddID0gZGhTKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSBkaFMobnVsbCk7XG4gIGNvbnN0IFtyZWNvcmRpbmcsIHNldFJlY29yZGluZ10gPSBkaFMoZmFsc2UpO1xuICBjb25zdCBbdHJhbnNjcmliaW5nLCBzZXRUcmFuc2NyaWJpbmddID0gZGhTKGZhbHNlKTtcbiAgY29uc3QgW3JldmVhbCwgc2V0UmV2ZWFsXSA9IGRoUyhudWxsKTsgLy8gZGlzY292ZXJ5IGxldmVsIHBlbmRpbmdcbiAgY29uc3QgW3Byb3RvUmV2ZWFsLCBzZXRQcm90b1JldmVhbF0gPSBkaFMoZmFsc2UpOyAvLyAyMDI2LTA0LTI2IFx1MjAxNCBtb2RhbCBcIkF2ZWMgdW4gZ3VpZGVcIiAoQmlibGUgXHUwMEE3My4xMSlcbiAgLy8gMjAyNi0wNC0yNyBQMC4zIFx1MjAxNCBoaW50IFwiZXhwbG9yZXJcIiBzb3VzIGxhIGx1bmUgdG9wLWxlZnQgYXByXHUwMEU4cyAyc1xuICAvLyAoc2lnbmFsIGRlIHRhcHBhYmlsaXRcdTAwRTkgZG91eCwgcGFzIGQnYW5pbWF0aW9uIGNyaWFyZGUpLlxuICBjb25zdCBbc2hvd0x1bmVIaW50LCBzZXRTaG93THVuZUhpbnRdID0gZGhTKGZhbHNlKTtcbiAgLy8gU3ByaW50IFAxIFx1MDBBN0IgKDIwMjYtMDQtMjcpIFx1MjAxNCBjaHVjaG90ZW1lbnQgXHUwMEU5Y2hvIHByb3BoXHUwMEU5dGlxdWUgbVx1MDBGQnJpXG4gIGNvbnN0IFtwcm9waGV0aWNFY2hvLCBzZXRQcm9waGV0aWNFY2hvXSA9IGRoUyhudWxsKTtcbiAgY29uc3QgW3Byb3BoZXRpY0Rpc21pc3NpbmcsIHNldFByb3BoZXRpY0Rpc21pc3NpbmddID0gZGhTKGZhbHNlKTtcbiAgY29uc3QgdGFSZWYgPSBkaFIobnVsbCk7XG4gIGNvbnN0IG1lZGlhUmVmID0gZGhSKG51bGwpO1xuICBjb25zdCBjaHVua3NSZWYgPSBkaFIoW10pO1xuXG4gIGNvbnN0IGludml0YXRpb24gPSBkcmVhbUludml0YXRpb24oKTtcblxuICAvLyBEZXJuaVx1MDBFOHJlIGVudHJcdTAwRTllIHByZXZpZXcgKHByZWZlcnJlZCA6IGthaXJvcywgZmFsbGJhY2sgOiBub3RlIGRlIHZpZSlcbiAgY29uc3QgbGF0ZXN0ID0gKCgpID0+IHtcbiAgICBpZiAoIWVudHJpZXMgfHwgZW50cmllcy5sZW5ndGggPT09IDApIHJldHVybiBudWxsO1xuICAgIC8vIFByZWZlciB0aGUgbGF0ZXN0IGthaXJvcyB0eXBlPSdyZXZlJyBpZiBhbnksIGVsc2UgYW55IGxhdGVzdCBlbnRyeVxuICAgIGNvbnN0IHJldmVMYXRlc3QgPSBlbnRyaWVzLmZpbmQoZSA9PiBlLnR5cGUgPT09IFwicmV2ZVwiIHx8IGUuX3Jhdz8ua2Fpcm9zX3R5cGUgPT09IFwicmV2ZVwiKTtcbiAgICByZXR1cm4gcmV2ZUxhdGVzdCB8fCBlbnRyaWVzWzBdO1xuICB9KSgpO1xuXG4gIC8vIFZvaWNlIHJlY29yZGluZyAocG9ydCBmcm9tIENhcHR1cmUvSm91cm5hbERlVmllSm91cikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IHBpY2tNaW1lVHlwZSA9ICgpID0+IHtcbiAgICBpZiAodHlwZW9mIE1lZGlhUmVjb3JkZXIgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBbXG4gICAgICBcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcIixcbiAgICAgIFwiYXVkaW8vd2VibVwiLFxuICAgICAgXCJhdWRpby9tcDQ7Y29kZWNzPW1wNGEuNDAuMlwiLFxuICAgICAgXCJhdWRpby9tcDRcIixcbiAgICAgIFwiYXVkaW8vYWFjXCIsXG4gICAgICBcImF1ZGlvL29nZztjb2RlY3M9b3B1c1wiLFxuICAgIF07XG4gICAgZm9yIChjb25zdCB0IG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCAmJiBNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCh0KSkgcmV0dXJuIHQ7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfVxuICAgIHJldHVybiBcIlwiO1xuICB9O1xuXG4gIGNvbnN0IHN0YXJ0UmVjb3JkaW5nID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIE1lZGlhUmVjb3JkZXIgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgc2V0RXJyb3IoXCJFbnJlZ2lzdHJlbWVudCB2b2NhbCBub24gc3VwcG9ydFx1MDBFOSBpY2kuIEVzc2FpZSBlbiB0ZXh0ZS5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSk7XG4gICAgICBjb25zdCBtaW1lVHlwZSA9IHBpY2tNaW1lVHlwZSgpO1xuICAgICAgY29uc3QgbXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG1pbWVUeXBlID8geyBtaW1lVHlwZSB9IDoge30pO1xuICAgICAgY29uc3QgYWN0dWFsTWltZSA9IG1yLm1pbWVUeXBlIHx8IG1pbWVUeXBlIHx8IFwiYXVkaW8vd2VibVwiO1xuICAgICAgY2h1bmtzUmVmLmN1cnJlbnQgPSBbXTtcbiAgICAgIG1yLm9uZGF0YWF2YWlsYWJsZSA9IChldikgPT4geyBpZiAoZXYuZGF0YS5zaXplID4gMCkgY2h1bmtzUmVmLmN1cnJlbnQucHVzaChldi5kYXRhKTsgfTtcbiAgICAgIG1yLm9uc3RvcCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godCA9PiB0LnN0b3AoKSk7XG4gICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihjaHVua3NSZWYuY3VycmVudCwgeyB0eXBlOiBhY3R1YWxNaW1lIH0pO1xuICAgICAgICBzZXRUcmFuc2NyaWJpbmcodHJ1ZSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLnRyYW5zY3JpYmUoYmxvYiwgYWN0dWFsTWltZSk7XG4gICAgICAgICAgaWYgKHJlc3VsdD8udGV4dCkgc2V0VGV4dChwcmV2ID0+IChwcmV2ID8gcHJldiArIFwiXFxuXFxuXCIgOiBcIlwiKSArIHJlc3VsdC50ZXh0KTtcbiAgICAgICAgICBlbHNlIGlmIChyZXN1bHQ/LmVycm9yKSBzZXRFcnJvcihcIlRyYW5zY3JpcHRpb24gOiBcIiArIHJlc3VsdC5lcnJvcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBzZXRFcnJvcihcIlRyYW5zY3JpcHRpb24gXHUwMEU5Y2hvdVx1MDBFOWUgOiBcIiArIGUubWVzc2FnZSk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgc2V0VHJhbnNjcmliaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIG1lZGlhUmVmLmN1cnJlbnQgPSBtcjtcbiAgICAgIG1yLnN0YXJ0KCk7XG4gICAgICBzZXRSZWNvcmRpbmcodHJ1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IoXCJNaWNybyBpbmFjY2Vzc2libGUgOiBcIiArIGUubWVzc2FnZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN0b3BSZWNvcmRpbmcgPSAoKSA9PiB7XG4gICAgaWYgKG1lZGlhUmVmLmN1cnJlbnQgJiYgbWVkaWFSZWYuY3VycmVudC5zdGF0ZSAhPT0gXCJpbmFjdGl2ZVwiKSBtZWRpYVJlZi5jdXJyZW50LnN0b3AoKTtcbiAgICBzZXRSZWNvcmRpbmcoZmFsc2UpO1xuICB9O1xuXG4gIC8vIFN1Ym1pdCBhIGthaXJvcyB0eXBlPSdyZXZlJyAoZGVmYXVsdCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAodGV4dC50cmltKCkubGVuZ3RoIDwgMykgcmV0dXJuO1xuICAgIHNldFN1Ym1pdHRpbmcodHJ1ZSk7IHNldEVycm9yKG51bGwpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuY3JlYXRlS2Fpcm9zKHtcbiAgICAgICAgcmF3X3RleHQ6IHRleHQudHJpbSgpLFxuICAgICAgICBrYWlyb3NfdHlwZTogXCJyZXZlXCIsXG4gICAgICAgIGNhcHR1cmVfbWV0aG9kOiByZWNvcmRpbmcgfHwgdHJhbnNjcmliaW5nID8gXCJ2b2ljZVwiIDogXCJ0ZXh0XCIsXG4gICAgICB9KTtcbiAgICAgIC8vIFdvdzEgOiBwcmVtaWVyIGthaXJvcyBkXHUwMEU5cG9zXHUwMEU5IChpZGVtcG90ZW50KVxuICAgICAgdHJ5IHsgd2luZG93Lndvd1JlZ2lzdHJ5Py5maXJlPy4oXCJwcmVtaWVyLWthaXJvc1wiKTsgfSBjYXRjaCB7fVxuICAgICAgc2V0VGV4dChcIlwiKTtcbiAgICAgIC8vIFJlZnJlc2ggZ2xvYmFsIGVudHJpZXNcbiAgICAgIGlmICh3aW5kb3cuRHJlYW1SZWZyZXNoRW50cmllcykgc2V0VGltZW91dCgoKSA9PiB3aW5kb3cuRHJlYW1SZWZyZXNoRW50cmllcygpLCAyNTApO1xuICAgICAgLy8gTmF2aWd1ZXIgdmVycyBLYWlyb3NEZXRhaWwgKHBvc3QtY2FwdHVyZSBzdWdnZXN0aW9uIHR5cGUgdmlhIGNoaXBzKVxuICAgICAgaWYgKHJlc3VsdD8ua2Fpcm9zPy5pZCAmJiB0eXBlb2YgZ28gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGdvKFwia2Fpcm9zXCIsIHJlc3VsdC5rYWlyb3MuaWQpLCAzNTApO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldEVycm9yKFwiRFx1MDBFOXBcdTAwRjR0IFx1MDBFOWNob3VcdTAwRTkgOiBcIiArIGUubWVzc2FnZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICAvLyBTcHJpbnQgUDEgXHUwMEE3QiAoMjAyNi0wNC0yNykgXHUyMDE0IGZldGNoIFx1MDBFOWNobyBwcm9waFx1MDBFOXRpcXVlIG1cdTAwRkJyaSBhdSBtb3VudC5cbiAgLy8gU2kgcHJcdTAwRTlzZW50IFx1MjE5MiBhZmZpY2hhZ2UgY2h1Y2hvdGVtZW50IGF1LWRlc3N1cyBkZSBsYSBwaHJhc2UgZCdpbnZpdGF0aW9uLlxuICAvLyBsb2NhbFN0b3JhZ2UgaG9sZCA6IFwiZHJlYW06cHJvcGhldGljOmRpc21pc3NlZFwiIGVtcFx1MDBFQWNoZSBsZSByZS1hZmZpY2hhZ2VcbiAgLy8gZCd1biBcdTAwRTljaG8gZFx1MDBFOWpcdTAwRTAgZGlzbWlzcyBjXHUwMEY0dFx1MDBFOSBjbGllbnQgKGVuIHBsdXMgZHUgc2VydmV1cikuIENvb2xkb3duIGNvdXJ0IDdqLlxuICBkaEUoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gU2tpcCBzaSBkaXNtaXNzIGNsaWVudC1zaWRlIHJcdTAwRTljZW50IChjb29sZG93biA3ailcbiAgICAgICAgY29uc3QgbG9jYWxEaXNtaXNzID0gcGFyc2VJbnQobG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkcmVhbTpwcm9waGV0aWM6ZGlzbWlzc2VkXCIpIHx8IFwiMFwiLCAxMCk7XG4gICAgICAgIGlmIChsb2NhbERpc21pc3MgJiYgRGF0ZS5ub3coKSAtIGxvY2FsRGlzbWlzcyA8IDcgKiAyNCAqIDM2MDAgKiAxMDAwKSByZXR1cm47XG4gICAgICAgIGlmICghd2luZG93LkRyZWFtQVBJPy5nZXRNYXR1cmVkUHJvcGhldGljRWNob2VzKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHIgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZ2V0TWF0dXJlZFByb3BoZXRpY0VjaG9lcygpO1xuICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGUgPSByPy5lY2hvZXMgJiYgci5lY2hvZXNbMF07XG4gICAgICAgIGlmIChlICYmIGUua2Fpcm9zX2lkKSBzZXRQcm9waGV0aWNFY2hvKGUpO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH0pKCk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIC8vIFNwcmludCBQMSBcdTAwQTdCIFx1MjAxNCBoYW5kbGVyIGRpc21pc3MgZHUgY2h1Y2hvdGVtZW50IChQT1NUICsgY2xvc2UgVUkgKyBjb29sZG93bilcbiAgY29uc3QgZGlzbWlzc1Byb3BoZXRpY0VjaG8gPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFwcm9waGV0aWNFY2hvIHx8IHByb3BoZXRpY0Rpc21pc3NpbmcpIHJldHVybjtcbiAgICBzZXRQcm9waGV0aWNEaXNtaXNzaW5nKHRydWUpO1xuICAgIGNvbnN0IGlkID0gcHJvcGhldGljRWNoby5rYWlyb3NfaWQ7XG4gICAgdHJ5IHtcbiAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZHJlYW06cHJvcGhldGljOmRpc21pc3NlZFwiLCBTdHJpbmcoRGF0ZS5ub3coKSkpOyB9IGNhdGNoIHt9XG4gICAgICBpZiAod2luZG93LkRyZWFtQVBJPy5kaXNtaXNzUHJvcGhldGljRWNobykge1xuICAgICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZGlzbWlzc1Byb3BoZXRpY0VjaG8oaWQpO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge31cbiAgICBmaW5hbGx5IHtcbiAgICAgIHNldFByb3BoZXRpY0VjaG8obnVsbCk7XG4gICAgICBzZXRQcm9waGV0aWNEaXNtaXNzaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU3ByaW50IFAxIFx1MDBBN0IgXHUyMDE0IGhhbmRsZXIgdGFwIGNodWNob3RlbWVudCBcdTIxOTIgbmF2aWdhdGUgdmVycyBLYWlyb3NEZXRhaWxcbiAgY29uc3Qgb3BlblByb3BoZXRpY0VjaG8gPSAoKSA9PiB7XG4gICAgaWYgKCFwcm9waGV0aWNFY2hvKSByZXR1cm47XG4gICAgY29uc3QgaWQgPSBwcm9waGV0aWNFY2hvLmthaXJvc19pZDtcbiAgICBzZXRQcm9waGV0aWNFY2hvKG51bGwpO1xuICAgIGlmICh0eXBlb2YgZ28gPT09IFwiZnVuY3Rpb25cIikgZ28oXCJrYWlyb3NcIiwgaWQpO1xuICB9O1xuXG4gIC8vIDIwMjYtMDQtMjcgUDAuMyBcdTIwMTQgSGludCBcImV4cGxvcmVyXCIgYXBwYXJhXHUwMEVFdCBhcHJcdTAwRThzIDJzIHNvdXMgbGEgbHVuZVxuICAvLyB0b3AtbGVmdCAoc2lnbmFsIGRlIHRhcHBhYmlsaXRcdTAwRTksIG9wYWNpdHkgMCBcdTIxOTIgMC41IGZhZGUtaW4gOTIwbXMpLlxuICAvLyBTa2lwIHNpIHVzZXIgYSBkXHUwMEU5alx1MDBFMCB2aXNpdFx1MDBFOSBleHBsb3JlciBhdSBtb2lucyAxIGZvaXMgKGxvY2FsU3RvcmFnZSkuXG4gIGRoRSgoKSA9PiB7XG4gICAgbGV0IGhhc1Zpc2l0ZWRFeHBsb3JlciA9IGZhbHNlO1xuICAgIHRyeSB7IGhhc1Zpc2l0ZWRFeHBsb3JlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJlYW06ZXhwbG9yZXItdmlzaXRlZFwiKSA9PT0gXCJ0cnVlXCI7IH0gY2F0Y2gge31cbiAgICBpZiAoaGFzVmlzaXRlZEV4cGxvcmVyKSByZXR1cm47XG4gICAgY29uc3QgdCA9IHNldFRpbWVvdXQoKCkgPT4gc2V0U2hvd0x1bmVIaW50KHRydWUpLCAyMDAwKTtcbiAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICB9LCBbXSk7XG5cbiAgLy8gRGlzY292ZXJ5IHJldmVhbCBjaGVjayBvbiBtb3VudCArIHdoZW4gZW50cmllcyBjaGFuZ2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGRoRSgoKSA9PiB7XG4gICAgaWYgKCFlbnRyaWVzIHx8IGVudHJpZXMubGVuZ3RoID09PSAwKSByZXR1cm47XG4gICAgY29uc3QgbHZsID0gc2hvdWxkUmV2ZWFsRGlzY292ZXJ5KGVudHJpZXMubGVuZ3RoKTtcbiAgICBpZiAobHZsKSB7XG4gICAgICAvLyBEXHUwMEU5bGFpIGxcdTAwRTlnZXIgcG91ciBuZSBwYXMgZnJhcHBlciBsJ1x1MDBFOWNyYW4gZCdhcnJpdlx1MDBFOWVcbiAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldFJldmVhbChsdmwpLCAxNDAwKTtcbiAgICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodCk7XG4gICAgfVxuICAgIC8vIDIwMjYtMDQtMjYgXHUyMDE0IFByb3RvY29sZXMgcmV2ZWFsIChCaWJsZSBcdTAwQTczLjExKSBzaSBwYXMgZGUgZGlzY292ZXJ5IGF1dHJlICsgY291bnQgPj0gM1xuICAgIGlmICh0eXBlb2Ygd2luZG93LnNob3VsZFJldmVhbFByb3RvY29sZXMgPT09IFwiZnVuY3Rpb25cIiAmJiB3aW5kb3cuc2hvdWxkUmV2ZWFsUHJvdG9jb2xlcyhlbnRyaWVzLmxlbmd0aCkpIHtcbiAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHNldFByb3RvUmV2ZWFsKHRydWUpLCAyMDAwKTtcbiAgICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodCk7XG4gICAgfVxuICB9LCBbZW50cmllcz8ubGVuZ3RoXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtaW5IZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIsXG4gICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgICBwYWRkaW5nVG9wOiBcImNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC10b3AsIDBweCkgKyAxOHB4KVwiLFxuICAgICAgcGFkZGluZ0JvdHRvbTogXCJjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tLCAwcHgpICsgMTEwcHgpXCIsXG4gICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgfX0+XG4gICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgSGFsb1Jlc3BpcmUgc2lsayBmaXhlZCAoWWVzaHVhLCBhbmltYXRpb24gVEVNUE8tU09VRkZMRSkuXG4gICAgICAgICAgUG9zXHUwMEU5IGVuIGJhY2tncm91bmQgYWJzb2x1dGUgZml4ZWQgdG9wLCBkZXJyaVx1MDBFOHJlIGNvbnRlbnUuXG4gICAgICAgICAgUmVzcGVjdGUgcHJlZmVycy1yZWR1Y2VkLW1vdGlvbiAobGEgY2xhc3NlIGVzdCBuZXV0cmFsaXNcdTAwRTllIHBhciBDU1MpLlxuICAgICAgICAgIDIwMjYtMDQtMjkgKEZJWCAjNCkgXHUyMDE0IG9wYWNpdHkgMC4xOCBcdTIxOTIgMC40MiA6IFx1MDBFMCAwLjE4IGxlIGhhbG8gXHUwMEU5dGFpdFxuICAgICAgICAgIHF1YXNpIGludmlzaWJsZSAoNCUgbHVtaW5hbmNlIGVmZmVjdGl2ZSkuIDAuNDIgcmVzdGUgc3VidGlsXG4gICAgICAgICAgbWFpcyBwZXJjZXB0aWJsZS4gKi99XG4gICAgICB7d2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNDIsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cInNpbGtcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBTcHJpbnQgUDEgXHUwMEE3QyBcdTIwMTQgdmlnbmV0dGUgcmFkaWFsZSB3YXJtIHBvdXIgY2Fzc2VyIGxlIG5vaXIgdHJvcCB2aWRlXG4gICAgICAgICAgKGhhdXQgY2VudHJlID0gdHJcdTAwRThzIGxcdTAwRTlnXHUwMEU4cmUgbHVldXIgc2lsay1nb2xkLCBiYXMgPSBuaWdodC1mbG9vciBwdXIpLlxuICAgICAgICAgIFBsdXMgc3VidGlsIHF1J3VuIGdyYWRpZW50IGRpcmVjdCBzdXIgYmFja2dyb3VuZCA6IGMnZXN0IHVuIG92ZXJsYXlcbiAgICAgICAgICBhZGRpdGlmIHF1aSByZXNwZWN0ZSBsYSBwYWxldHRlIGRhcmstZmlyc3QuICovfVxuICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMCxcbiAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSA5MCUgNjAlIGF0IDUwJSAyOCUsIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA2JSwgdHJhbnNwYXJlbnQpIDAlLCB0cmFuc3BhcmVudCA3MCUpXCIsXG4gICAgICB9fSAvPlxuXG4gICAgICB7LyogQXNoIHN1YnRsZSBncmFpbiBvdmVybGF5IChtYXR0ZXIgYXNoLCA0JSBlZmZlY3RpdmUgb3BhY2l0eSkgXHUyMDE0IFNwcmludCBQMSBcdTAwQTdDIGNvbmZpcm1cdTAwRTkgKi99XG4gICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgICAgb3BhY2l0eTogMC4yMiwgekluZGV4OiAxLFxuICAgICAgfX0+XG4gICAgICAgIDxzdmcgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHByZXNlcnZlQXNwZWN0UmF0aW89XCJub25lXCIgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiIH19PlxuICAgICAgICAgIDxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWx0ZXI9XCJ1cmwoI25vaXNlLWFzaClcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogSGVhZGVyIDogZ2x5cGhlIGx1bmUgKGdhdWNoZSwgYW1iaWFuY2UgKyB0YXAgPSBleHBsb3JlcilcbiAgICAgICAgICAyMDI2LTA0LTI3IFAwLjMgXHUyMDE0IExlIHRvcC1yaWdodCB0b2dnbGUgXCJldCB0YSB2aWUgZGUgam91ciA/XCIgZXN0XG4gICAgICAgICAgRFx1MDBDOVBMQUNcdTAwQzkgRU4gQkFTICh6b25lIHRlcnRpYWlyZSkuIExlIGdseXBoZSBsdW5lIGRldmllbnRcbiAgICAgICAgICBhbWJpYW5jZSBhdmVjIGhpbnQgXCJleHBsb3JlclwiIGVuIG1vbm8gdXBwZXJjYXNlIHF1aSBhcHBhcmFcdTAwRUV0XG4gICAgICAgICAgYXByXHUwMEU4cyAycyBwb3VyIHNpZ25hbGVyIGxhIHRhcHBhYmlsaXRcdTAwRTkgKHNraXAgc2kgdXNlciBkXHUwMEU5alx1MDBFMCB2aXNpdFx1MDBFOSkuICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJmbGV4LXN0YXJ0XCIsIGFsaWduSXRlbXM6IFwiZmxleC1zdGFydFwiLFxuICAgICAgICBwYWRkaW5nOiBcIjAgMjJweCA0cHhcIixcbiAgICAgICAgbWluSGVpZ2h0OiA1NixcbiAgICAgIH19PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpleHBsb3Jlci12aXNpdGVkXCIsIFwidHJ1ZVwiKTsgfSBjYXRjaCB7fVxuICAgICAgICAgICAgc2V0U2hvd0x1bmVIaW50KGZhbHNlKTtcbiAgICAgICAgICAgIGdvICYmIGdvKFwiZXhwbG9yZXJcIik7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBhcmlhLWxhYmVsPVwib3V2cmlyIGV4cGxvcmVyXCJcbiAgICAgICAgICB0aXRsZT1cImV4cGxvcmVyIHRvdXRlcyBsZXMgcG9ydGVzIGRlIERyZWFtXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgcGFkZGluZzogNCwgbWFyZ2luOiAtNCxcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDIsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBcInRyYW5zZm9ybSAzODBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSksIG9wYWNpdHkgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgb3BhY2l0eTogMC45NSxcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDEuMDgpXCI7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTsgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxKVwiOyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuOTU7IH19XG4gICAgICAgID5cbiAgICAgICAgICA8R2x5cGhMdW5lRGVjcm9pc3NhbnRlIHNpemU9ezMyfSAvPlxuICAgICAgICAgIHsvKiBIaW50IFwiZXhwbG9yZXJcIiBcdTIwMTQgYXBwYXJhXHUwMEVFdCBhcHJcdTAwRThzIDJzLCBmYWRlLWluIDkyMG1zLFxuICAgICAgICAgICAgICBndWlkZSBkb3V4IHZlcnMgbGUgaHViLiBEaXNwYXJhXHUwMEVFdCBkXHUwMEU4cyBxdWUgdXNlciBhIHRhcC4gKi99XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubywgbW9ub3NwYWNlKVwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMThlbVwiLFxuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IHNob3dMdW5lSGludCA/IDAuNSA6IDAsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgOTIwbXMgZWFzZVwiLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiAyLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogXCJub25lXCIsXG4gICAgICAgICAgfX0+ZXhwbG9yZXI8L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBDZW50cmUgOiBwaHJhc2UgZCdpbnZpdGF0aW9uICsgY2hhbXAgKyBib3V0b24gXHUyMzA0IGRcdTAwRTlwb3NlciAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgZmxleDogMSxcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy02KSAyNHB4IHZhcigtLXMtNSlcIixcbiAgICAgICAgbWF4V2lkdGg6IDU4MCwgd2lkdGg6IFwiMTAwJVwiLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICB9fT5cbiAgICAgICAgey8qIFNwcmludCBQMSBcdTAwQTdCICgyMDI2LTA0LTI3KSBcdTIwMTQgQ2h1Y2hvdGVtZW50IFx1MDBFOWNobyBwcm9waFx1MDBFOXRpcXVlIG1cdTAwRkJyaS5cbiAgICAgICAgICAgIEFwcGFyYVx1MDBFRXQgQVUtREVTU1VTIGRlIGxhIHBocmFzZSBkJ2ludml0YXRpb24uIFRhcCBcdTIxOTIgS2Fpcm9zRGV0YWlsXG4gICAgICAgICAgICBkdSBrYWlyb3Mgclx1MDBFOXNvbm5hbnQuIFwieFwiIFx1MjE5MiBQT1NUIGRpc21pc3MgKyBjb29sZG93biA3ai4gKi99XG4gICAgICAgIHtwcm9waGV0aWNFY2hvICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRoLXByb3BoZXRpYy13aGlzcGVyXCIgcm9sZT1cImJ1dHRvblwiIHRhYkluZGV4PXswfVxuICAgICAgICAgICAgb25DbGljaz17b3BlblByb3BoZXRpY0VjaG99XG4gICAgICAgICAgICBvbktleURvd249eyhlKSA9PiB7IGlmIChlLmtleSA9PT0gXCJFbnRlclwiIHx8IGUua2V5ID09PSBcIiBcIikgeyBlLnByZXZlbnREZWZhdWx0KCk7IG9wZW5Qcm9waGV0aWNFY2hvKCk7IH0gfX1cbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJvdXZyaXIgbGUga2Fpcm9zIHF1aSByXHUwMEU5c29ubmVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNSlcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIxMnB4IDM2cHggMTJweCAxNHB4XCIsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogXCIxcHggZGFzaGVkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICBib3JkZXJCb3R0b206IFwiMXB4IGRhc2hlZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgICAgIGNvbG9yOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA3MCUsIHZhcigtLWJvbmUpKVwiLFxuICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDA1ZW1cIixcbiAgICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDEyLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImJhY2tncm91bmQgMzgwbXMgZWFzZSwgY29sb3IgMzgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgICBhbmltYXRpb246IFwiZGgtd2hpc3Blci1mYWRlLWluIDkyMG1zIGVhc2Utb3V0XCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IHtcbiAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHtcbiAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcInRyYW5zcGFyZW50XCI7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsvKiBHbHlwaCBcdTI1RDEgcXVpIHB1bHNlIDRzICovfVxuICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE3LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJkaC13aGlzcGVyLXB1bHNlIDRzIGVhc2UtaW4tb3V0IGluZmluaXRlXCIsXG4gICAgICAgICAgICAgIGZsZXhTaHJpbms6IDAsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJub3JtYWxcIixcbiAgICAgICAgICAgIH19Plx1MjVEMTwvc3Bhbj5cblxuICAgICAgICAgICAgey8qIFBocmFzZSBjaHVjaG90XHUwMEU5ZSAqL31cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgIHtwcm9waGV0aWNFY2hvLndoaXNwZXIgfHwgXCJ1biBrYWlyb3MgZCdhdXRyZWZvaXMgclx1MDBFOXNvbm5lIGF2ZWMgdGEgc2VtYWluZVwifVxuICAgICAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDgsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYwJSwgdmFyKC0tYXNoLWxpZ2h0KSlcIixcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgIH19Plx1MjE5Mjwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgICAgey8qIEJvdXRvbiB4IGRpc21pc3MgXHUyMDE0IGRpc2NyZXQsIHRvcC1yaWdodCBhYnNvbHV0ZSAqL31cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgZGlzbWlzc1Byb3BoZXRpY0VjaG8oKTsgfX1cbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIm5lIHBsdXMgYWZmaWNoZXIgY2UgY2h1Y2hvdGVtZW50XCJcbiAgICAgICAgICAgICAgdGl0bGU9XCJuZSBwbHVzIGFmZmljaGVyXCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3Byb3BoZXRpY0Rpc21pc3Npbmd9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgICAgICAgICB0b3A6IDYsIHJpZ2h0OiA2LFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHByb3BoZXRpY0Rpc21pc3NpbmcgPyBcImRlZmF1bHRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiNHB4IDhweFwiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJub3JtYWxcIixcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gXCIwLjg1XCI7IH19XG4gICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gXCIwLjVcIjsgfX1cbiAgICAgICAgICAgID5cdTAwRDc8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgUGV0aXQgZ2x5cGhlIHNwaXJhbGUgbG9nYXJpdGhtaXF1ZSBhdS1kZXNzdXMgZHUgY2hhbXBcbiAgICAgICAgICAgIChZZXNodWEpLiAyNHgyNCwgYW5pbWF0aW9uIGJyZWF0aGUtc291ZmZsZSA2cywgb3BhY2l0XHUwMEU5IDAuNTUuICovfVxuICAgICAgICB7d2luZG93Lkdlb1N5bWJvbCAmJiAoXG4gICAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBtYXJnaW5Cb3R0b206IDE0LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB3aWR0aDogMjgsIGhlaWdodDogMjgsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiBcImJyZWF0aGUtc291ZmZsZSA2cyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDx3aW5kb3cuR2VvU3ltYm9sIGtpbmQ9XCJzcGlyYWxlXCIgY29sb3I9XCJzaWxrXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB3aWR0aDogMjgsIGhlaWdodDogMjgsIG9wYWNpdHk6IDEgfX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAyNCwgbGluZUhlaWdodDogMS40NSxcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IFwidmFyKC0tcy01KVwiLFxuICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMDVlbVwiLFxuICAgICAgICAgIHRleHRTaGFkb3c6IFwiMCAxcHggMTRweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA1MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7aW52aXRhdGlvbn1cbiAgICAgICAgPC9wPlxuXG4gICAgICAgIHsvKiAyMDI2LTA0LTI3IFNwcmludCBQMCBcdTAwQTdCIDogbWljcm8gdm9peCBkZXZpZW50IHBldGl0IGljXHUwMEY0bmUgXHUwMEUwIGRyb2l0ZSBkdSB0ZXh0YXJlYVxuICAgICAgICAgICAgKGludFx1MDBFOWdyXHUwMEU5IGRhbnMgbGUgY2hhbXAsIHBsdXMgZGUgcm93IHNwaFx1MDBFOHJlIHNcdTAwRTlwYXJcdTAwRTllKS4gKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgd2lkdGg6IFwiMTAwJVwiIH19PlxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgcmVmPXt0YVJlZn1cbiAgICAgICAgICAgIHZhbHVlPXt0ZXh0fVxuICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4geyBzZXRUZXh0KGUudGFyZ2V0LnZhbHVlKTsgc2V0RXJyb3IobnVsbCk7IH19XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cInJhY29udGUgXHUyMDE0IHVuIGZyYWdtZW50LCB1bmUgaW1hZ2UsIHVuZSBzZW5zYXRpb25cdTIwMjZcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XG4gICAgICAgICAgICByb3dzPXs1fVxuICAgICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgIG1pbkhlaWdodDogMTQwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgNjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiMThweCA0OHB4IDE4cHggMjBweFwiLCAvLyBwYWRkaW5nLXJpZ2h0IGF1Z21lbnRcdTAwRTkgcG91ciBtaWNyb1xuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNywgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICBvdXRsaW5lOiBcIm5vbmVcIiwgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgIGJveFNpemluZzogXCJib3JkZXItYm94XCIsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYm9yZGVyLWNvbG9yIDM4MG1zIGVhc2VcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkZvY3VzPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDM4JSwgdmFyKC0tYXNoLWRlZXApKVwifVxuICAgICAgICAgICAgb25CbHVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKVwifVxuICAgICAgICAgIC8+XG4gICAgICAgICAgey8qIE1pY3JvIHZvaXggaW50XHUwMEU5Z3JcdTAwRTkgYXUgY2hhbXAgXHUyMDE0IHBldGl0IGljXHUwMEY0bmUgZGlzY3JldCB0b3AtcmlnaHQgZHUgdGV4dGFyZWEgKi99XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17cmVjb3JkaW5nID8gc3RvcFJlY29yZGluZyA6IHN0YXJ0UmVjb3JkaW5nfVxuICAgICAgICAgICAgYXJpYS1sYWJlbD17cmVjb3JkaW5nID8gXCJhcnJcdTAwRUF0ZXIgbCdlbnJlZ2lzdHJlbWVudFwiIDogXCJkXHUwMEU5cG9zZXIgZW4gdm9peFwifVxuICAgICAgICAgICAgdGl0bGU9e3JlY29yZGluZyA/IFwiYXJyXHUwMEVBdGVyIGwnZW5yZWdpc3RyZW1lbnRcIiA6IFwiZFx1MDBFOXBvc2VyIGVuIHZvaXhcIn1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogMTQsIHJpZ2h0OiAxNCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICBwYWRkaW5nOiA2LFxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBjb2xvcjogcmVjb3JkaW5nID8gXCJ2YXIoLS1lbWJlci1saXZlLCAjQzk3QTRBKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgb3BhY2l0eTogcmVjb3JkaW5nID8gMSA6IDAuNTUsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLCBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBpZiAoIXJlY29yZGluZykgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxOyB9fVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHsgaWYgKCFyZWNvcmRpbmcpIGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC41NTsgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7cmVjb3JkaW5nID8gXCJcdTI1QTBcIiA6IFwiXHVEODNDXHVERjk5XCJ9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSwgI0M5N0E0QSlcIixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgbWFyZ2luVG9wOiA4LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHt0cmFuc2NyaWJpbmcgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICBtYXJnaW5Ub3A6IDgsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB0cmFuc2NyaXB0aW9uIGVuIGNvdXJzXHUyMDI2XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIDIwMjYtMDQtMjcgU3ByaW50IFAwIFx1MDBBN0IgOiBVTiBTRVVMIGJvdXRvbiBcdTIzMDQgY2VudHJhbCBwcm9cdTAwRTltaW5lbnQsIGhhbG8gZW1iZXIgcmFkaWFsIHB1bHNhbnQgOHMuXG4gICAgICAgICAgICAoUGx1cyBkZSByb3cgc3BoXHUwMEU4cmVzIHNcdTAwRTlwYXJcdTAwRTllIFx1MjAxNCBtaWNybyBlc3QgZGFucyBsZSB0ZXh0YXJlYSBjaS1kZXNzdXMsXG4gICAgICAgICAgICBGQUIgQm90dG9tTmF2IHJlc3RlIGFjY2Vzc2libGUgcGVybWFuZW50LikgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy01KVwiLFxuICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDEwLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXtzdWJtaXR9XG4gICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZyB8fCB0ZXh0LnRyaW0oKS5sZW5ndGggPCAzfVxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cImRcdTAwRTlwb3NlciBjZSByXHUwMEVBdmVcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZGgtZGVwb3Nlci1idXR0b25cIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDc2LCBoZWlnaHQ6IDc2LCBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwicmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzMCUgMzAlLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyKSAzMiUsIHZhcigtLW5pZ2h0LXdhcm0pKSwgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE4JSwgdmFyKC0tbmlnaHQtZmxvb3IpKSlcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzUlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgIGN1cnNvcjogKHN1Ym1pdHRpbmcgfHwgdGV4dC50cmltKCkubGVuZ3RoIDwgMykgPyBcIm5vdC1hbGxvd2VkXCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgb3BhY2l0eTogKHN1Ym1pdHRpbmcgfHwgdGV4dC50cmltKCkubGVuZ3RoIDwgMykgPyAwLjQ1IDogMSxcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJncmlkXCIsIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIGZvbnRTaXplOiAyOCxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjU1LDEpXCIsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogXCIwIDAgMzJweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjIlLCB0cmFuc3BhcmVudCksIGluc2V0IDAgMXB4IDAgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogKHN1Ym1pdHRpbmcgfHwgdGV4dC50cmltKCkubGVuZ3RoIDwgMykgPyBcIm5vbmVcIiA6IFwiZGgtaGFsby1wdWxzZSA4cyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7c3VibWl0dGluZyA/IChcbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDIwIH19Plx1MjAyNjwvc3Bhbj5cbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIC8qIDIwMjYtMDQtMjkgXHUyMDE0IERlbWktY2VyY2xlIGF1cm9yZSBpbmxpbmUgKFllc2h1YSkgOlxuICAgICAgICAgICAgICAgICBwZXRpdCBkZW1pLWNlcmNsZSBzaWxrLWdvbGQgcXVpIHB1bHNlIGVuIG1vZGUgc2lsay1nb2xkLFxuICAgICAgICAgICAgICAgICByZW1wbGFjZSBsZSBcIlx1MjMwNFwiIHBsYXQgcGFyIHVuIHNpZ25lIGRlIHNldWlsIGF1cm9yZS4gKi9cbiAgICAgICAgICAgICAgPHN2ZyB2aWV3Qm94PVwiMCAwIDYwIDI4XCIgd2lkdGg9XCIzOFwiIGhlaWdodD1cIjIwXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIsIG92ZXJmbG93OiBcInZpc2libGVcIiB9fT5cbiAgICAgICAgICAgICAgICA8cGF0aCBkPVwiTSA0IDI0IFEgMzAgLTQsIDU2IDI0XCJcbiAgICAgICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgIHN0cm9rZT1cImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA5MCUsIHZhcigtLWJvbmUpKVwiXG4gICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNFwiIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmaWx0ZXI6IFwiZHJvcC1zaGFkb3coMCAwIDZweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNTUlLCB0cmFuc3BhcmVudCkpXCIgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNIDEwIDI0IFEgMzAgNCwgNTAgMjRcIlxuICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYwJSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMC45XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgb3BhY2l0eT1cIjAuNlwiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCBvcGFjaXR5OiAwLjg1LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgZFx1MDBFOXBvc2VyIHVuIHJcdTAwRUF2ZVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogSGFsbyBwdWxzYW50IFx1MjAxNCBrZXlmcmFtZXMgbG9jYWxlcyAoOHMsIGVtYmVyIHJhZGlhbCBkb3V4LCByZXNwZWN0IGRhcmstZmlyc3QpXG4gICAgICAgICAgICBTcHJpbnQgUDEgXHUwMEE3QitDIFx1MjAxNCBham91dCBkaC1oYWxvLXNvdWZmbGUgKGx1bmUgdG9wLWxlZnQpLCBkaC13aGlzcGVyLXB1bHNlLFxuICAgICAgICAgICAgZGgtd2hpc3Blci1mYWRlLWluIChjaHVjaG90ZW1lbnQgXHUwMEU5Y2hvIHByb3BoXHUwMEU5dGlxdWUpLiAqL31cbiAgICAgICAgPHN0eWxlPntgXG4gICAgICAgICAgQGtleWZyYW1lcyBkaC1oYWxvLXB1bHNlIHtcbiAgICAgICAgICAgIDAlICAgeyBib3gtc2hhZG93OiAwIDAgMjhweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB0cmFuc3BhcmVudCksIGluc2V0IDAgMXB4IDAgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdHJhbnNwYXJlbnQpOyB9XG4gICAgICAgICAgICA1MCUgIHsgYm94LXNoYWRvdzogMCAwIDQ4cHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1lbWJlcikgMjglLCB0cmFuc3BhcmVudCksIDAgMCAxOHB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyNiUsIHRyYW5zcGFyZW50KSwgaW5zZXQgMCAxcHggMCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjglLCB0cmFuc3BhcmVudCk7IH1cbiAgICAgICAgICAgIDEwMCUgeyBib3gtc2hhZG93OiAwIDAgMjhweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB0cmFuc3BhcmVudCksIGluc2V0IDAgMXB4IDAgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdHJhbnNwYXJlbnQpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qIFNwcmludCBQMSBcdTAwQTdDIFx1MjAxNCBoYWxvIHNvdWZmbGUgZGVycmlcdTAwRThyZSBsYSBsdW5lIHRvcC1sZWZ0ICg4cykgKi9cbiAgICAgICAgICBAa2V5ZnJhbWVzIGRoLWhhbG8tc291ZmZsZSB7XG4gICAgICAgICAgICAwJSwgMTAwJSB7IG9wYWNpdHk6IDAuNDsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSkgc2NhbGUoMSk7IH1cbiAgICAgICAgICAgIDUwJSAgICAgIHsgb3BhY2l0eTogMC43OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKSBzY2FsZSgxLjA4KTsgfVxuICAgICAgICAgIH1cbiAgICAgICAgICAvKiBTcHJpbnQgUDEgXHUwMEE3QiBcdTIwMTQgcHVsc2UgZ2x5cGggXHUyNUQxIGNodWNob3RlbWVudCAoNHMpICovXG4gICAgICAgICAgQGtleWZyYW1lcyBkaC13aGlzcGVyLXB1bHNlIHtcbiAgICAgICAgICAgIDAlLCAxMDAlIHsgb3BhY2l0eTogMC41NTsgdHJhbnNmb3JtOiBzY2FsZSgxKTsgfVxuICAgICAgICAgICAgNTAlICAgICAgeyBvcGFjaXR5OiAxOyAgICB0cmFuc2Zvcm06IHNjYWxlKDEuMTIpOyB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8qIFNwcmludCBQMSBcdTAwQTdCIFx1MjAxNCBlbnRyXHUwMEU5ZSBkdSBjaHVjaG90ZW1lbnQgKGRvdWNlKSAqL1xuICAgICAgICAgIEBrZXlmcmFtZXMgZGgtd2hpc3Blci1mYWRlLWluIHtcbiAgICAgICAgICAgIGZyb20geyBvcGFjaXR5OiAwOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTRweCk7IH1cbiAgICAgICAgICAgIHRvICAgeyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH1cbiAgICAgICAgICB9XG4gICAgICAgIGB9PC9zdHlsZT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogQmFzIDogcHJldmlldyBkZSBsYSBkZXJuaVx1MDBFOHJlIGVudHJcdTAwRTllICgxIGxpZ25lIGl0YWxpYykgKi99XG4gICAgICB7bGF0ZXN0ICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMixcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNCkgMjRweCAwXCIsXG4gICAgICAgICAgbWF4V2lkdGg6IDU4MCwgd2lkdGg6IFwiMTAwJVwiLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImthaXJvc1wiLCBsYXRlc3QuaWQpfVxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIm91dnJpciBsYSBkZXJuaVx1MDBFOHJlIGVudHJcdTAwRTllXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjU1LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41LCBwYWRkaW5nOiBcIjhweCAwXCIsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsIHRleHRPdmVyZmxvdzogXCJlbGxpcHNpc1wiLCB3aGl0ZVNwYWNlOiBcIm5vd3JhcFwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcImJsb2NrXCIsIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAzODBtcyBlYXNlXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC44NX1cbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNTV9PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgb3BhY2l0eTogMC43LCBtYXJnaW5SaWdodDogOCB9fT5cdTAwQjc8L3NwYW4+XG4gICAgICAgICAgICB7KGxhdGVzdC50ZXh0IHx8IFwiXCIpLnNsaWNlKDAsIDg4KX17KGxhdGVzdC50ZXh0IHx8IFwiXCIpLmxlbmd0aCA+IDg4ID8gXCJcdTIwMjZcIiA6IFwiXCJ9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIDIwMjYtMDQtMjcgUDAuMyBcdTIwMTQgWm9uZSBURVJUSUFJUkUgaW52aXRhdGlvbnMuXG4gICAgICAgICAgTGllbiBcImV0IHRhIHZpZSBkZSBqb3VyID9cIiBkXHUwMEU5cGxhY1x1MDBFOSBkdSB0b3AtcmlnaHQgdmVycyBpY2kgKHNvdXMgbGVcbiAgICAgICAgICBwcmV2aWV3KS4gVW5kZXJsaW5lIGRhc2hlZCBzaWxrLWdvbGQgcG91ciBzaWduYWxlciBsZSBiYXNjdWxlXG4gICAgICAgICAgaG9yaXpvbnRhbCB2ZXJzIEpvdXJuYWwgZGUgVmllIExVTUlORVVYLiAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyLFxuICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMykgMjRweCAwXCIsXG4gICAgICAgIG1heFdpZHRoOiA1ODAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImhvbWUtam91clwiKX1cbiAgICAgICAgICB0aXRsZT1cImJhc2N1bGUgdmVycyB0b24gSm91cm5hbCBkZSBWaWUgTFVNSU5FVVhcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJvdXZyaXIgbGUgSm91cm5hbCBkZSBWaWVcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNzAlLCB2YXIoLS1ib25lKSlcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNzUsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDRweFwiLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiBcInVuZGVybGluZVwiLFxuICAgICAgICAgICAgdGV4dERlY29yYXRpb25TdHlsZTogXCJkYXNoZWRcIixcbiAgICAgICAgICAgIHRleHRVbmRlcmxpbmVPZmZzZXQ6IDQsXG4gICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbkNvbG9yOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzNSUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDM4MG1zIGVhc2UsIGNvbG9yIDM4MG1zIGVhc2VcIixcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJ2YXIoLS1zaWxrLWdvbGQpXCI7IH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjc1OyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA3MCUsIHZhcigtLWJvbmUpKVwiOyB9fT5cbiAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17eyBtYXJnaW5SaWdodDogNSwgZm9udFNpemU6IDEyIH19Plx1MjYwOTwvc3Bhbj5cbiAgICAgICAgICBldCB0YSB2aWUgZGUgam91ciA/XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiAyMDI2LTA0LTI3IFAwLjMgXHUyMDE0IFwiZXQgYXVzc2lcIiBtaWNyby1iYXJcbiAgICAgICAgICBSXHUwMEU5dlx1MDBFOGxlIDMgZmVhdHVyZXMtY2xcdTAwRTlzIChzYWdlc3NlIC8gb3JhY2xlIC8gdGFsZXMpIGVuIHRleHQtbGlua1xuICAgICAgICAgIHNvYnJlcyBzXHUwMEU5cGFyXHUwMEU5cyBwYXIgXCJcdTAwQjdcIi4gVXNlciBxdWkgYSA1KyBrYWlyb3Mgdm9pdCBjZXMgYWx0ZXJuYXRpdmVzXG4gICAgICAgICAgc2FucyBlbmNvbWJyZXIgbGUgaGVyby4gVGFwIFx1MjE5MiBuYXZpZ2F0ZS4gSG92ZXIgXHUyMTkyIHNpbGstZ29sZCBmdWxsLiAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyLFxuICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMykgMjRweCAwXCIsXG4gICAgICAgIG1heFdpZHRoOiA1ODAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiA4LFxuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDExLjUsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcbiAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcImxvd2VyY2FzZVwiLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogNixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiaW5saW5lLWJsb2NrXCIsIHdpZHRoOiAxNCwgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgNTAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDxzcGFuPmV0IGF1c3NpPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiBcImlubGluZS1ibG9ja1wiLCB3aWR0aDogMTQsIGhlaWdodDogMSxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDUwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgZ2FwOiAxMCwgZmxleFdyYXA6IFwid3JhcFwiLFxuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLjUsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJleHBsb3JlclwiKX1cbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJvdXZyaXIgU2FnZXNzZSBkZXMga2Fpcm9zIHZpYSBleHBsb3JlclwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC43LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMi41LFxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjNweCA0cHhcIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJ2YXIoLS1zaWxrLWdvbGQpXCI7IH19XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNzsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJ2YXIoLS1hc2gtbGlnaHQpXCI7IH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgbWFyZ2luUmlnaHQ6IDQsIG9wYWNpdHk6IDAuODUgfX0+XHUyNzI2PC9zcGFuPmFwcGVsIHNhZ2Vzc2VcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuMzUgfX0+XHUwMEI3PC9zcGFuPlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJvcmFjbGUtY29ycHNcIil9XG4gICAgICAgICAgICBhcmlhLWxhYmVsPVwib3V2cmlyIE9yYWNsZSBkdSBDb3Jwc1wiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC43LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMi41LFxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjNweCA0cHhcIixcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJ2YXIoLS1zaWxrLWdvbGQpXCI7IH19XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNzsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJ2YXIoLS1hc2gtbGlnaHQpXCI7IH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgbWFyZ2luUmlnaHQ6IDQsIG9wYWNpdHk6IDAuODUgfX0+XHUyNUM5PC9zcGFuPm9yYWNsZSBkdSBjb3Jwc1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC4zNSB9fT5cdTAwQjc8L3NwYW4+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImNvbnRlLW1pcm9pclwiKX1cbiAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJvdXZyaXIgVGFsZXMgXHUyMDE0IGNvbnRlcyBxdWkgclx1MDBFOXBvbmRlbnRcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNyxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIuNSxcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIzcHggNHB4XCIsXG4gICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7IGUuY3VycmVudFRhcmdldC5zdHlsZS5jb2xvciA9IFwidmFyKC0tc2lsay1nb2xkKVwiOyB9fVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjc7IGUuY3VycmVudFRhcmdldC5zdHlsZS5jb2xvciA9IFwidmFyKC0tYXNoLWxpZ2h0KVwiOyB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IG1hcmdpblJpZ2h0OiA0LCBvcGFjaXR5OiAwLjg1IH19Plx1Mjc0Qjwvc3Bhbj50YWxlc1xuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogRGlzY292ZXJ5IHJldmVhbCBtb2RhbCAqL31cbiAgICAgIHtyZXZlYWwgJiYgKFxuICAgICAgICA8RGlzY292ZXJ5UmV2ZWFsIGxldmVsPXtyZXZlYWx9IGdvPXtnb30gb25DbG9zZT17KCkgPT4gc2V0UmV2ZWFsKG51bGwpfSAvPlxuICAgICAgKX1cblxuICAgICAgey8qIDIwMjYtMDQtMjYgXHUyMDE0IFByb3RvY29sZXMgcmV2ZWFsIG1vZGFsIChCaWJsZSBcdTAwQTczLjExIFx1MjAxNCBkXHUwMEU5Y291dmVydGUgcHJvZ3Jlc3NpdmUgSjMpICovfVxuICAgICAge3Byb3RvUmV2ZWFsICYmIHdpbmRvdy5Qcm90b2NvbGVEaXNjb3ZlcnlSZXZlYWwgJiYgKFxuICAgICAgICA8d2luZG93LlByb3RvY29sZURpc2NvdmVyeVJldmVhbCBnbz17Z299IG9uQ2xvc2U9eygpID0+IHNldFByb3RvUmV2ZWFsKGZhbHNlKX0gLz5cbiAgICAgICl9XG5cbiAgICAgIHsvKiAyMDI2LTA0LTI3IFAwLjIgXHUyMDE0IERpc2NvdmVyRHJhd2VyIERcdTAwQzlQUlx1MDBDOUNJXHUwMEM5LiBMZSBodWIgZXN0IG1haW50ZW5hbnRcbiAgICAgICAgICB1biBvbmdsZXQgcGVybWFuZW50IChyb3V0ZSBcImV4cGxvcmVyXCIpLiBMZSBkcmF3ZXIgcmVzdGUgZXhwb3J0XHUwMEU5XG4gICAgICAgICAgZW4gY29tcGF0aWJpbGl0XHUwMEU5IG1haXMgbidlc3QgcGx1cyBtb250XHUwMEU5IGljaS4gKi99XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgRXhwb3J0cyBcdTIxOTIgd2luZG93IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgRHJlYW1Ib21lLFxuICBEaXNjb3ZlcnlSZXZlYWwsXG4gIERpc2NvdmVyRHJhd2VyLCAvLyAyMDI2LTA0LTI3IFNwcmludCBQMCBcdTAwQTdCXG4gIHNob3VsZFJldmVhbERpc2NvdmVyeSxcbiAgbWFya1JldmVhbGVkRGlzY292ZXJ5OiBtYXJrUmV2ZWFsZWQsXG4gIGdldFJldmVhbGVkRGlzY292ZXJpZXM6IGdldFJldmVhbGVkLFxuICBkcmVhbUludml0YXRpb24sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQWdDQSxNQUFNLEVBQUUsVUFBVSxLQUFLLFdBQVcsS0FBSyxRQUFRLElBQUksSUFBSTtBQUd2RCxTQUFTLGtCQUFrQjtBQUN6QixRQUFNLEtBQUksb0JBQUksS0FBSyxHQUFFLFNBQVM7QUFFOUIsTUFBSSxLQUFLLEtBQUssSUFBSSxHQUFJLFFBQU87QUFFN0IsTUFBSSxLQUFLLE1BQU0sSUFBSSxHQUFJLFFBQU87QUFFOUIsU0FBTztBQUNUO0FBT0EsU0FBUyxzQkFBc0IsRUFBRSxPQUFPLEdBQUcsR0FBRztBQUk1QyxRQUFNLFdBQVcsS0FBSyxJQUFJLE9BQU8sS0FBSyxFQUFFO0FBQ3hDLFFBQU0sV0FBVyxRQUFRO0FBQ3pCLFNBQ0Usb0NBQUMsVUFBSyxPQUFPLEVBQUUsVUFBVSxZQUFZLFNBQVMsZUFBZSxZQUFZLFNBQVMsS0FDL0UsWUFDQztBQUFBLElBQUM7QUFBQTtBQUFBLE1BQ0MsZUFBWTtBQUFBLE1BQ1osT0FBTztBQUFBLE1BQ1AsUUFBUTtBQUFBLE1BQ1IsU0FBUTtBQUFBLE1BQ1IsT0FBTztBQUFBLFFBQ0wsVUFBVTtBQUFBLFFBQ1YsS0FBSztB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
