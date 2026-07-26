const { useState, useEffect, useRef, useMemo } = React;
const seedEntries = [
  {
    id: "k-08",
    type: "dream_night",
    when: "ce matin, avant le r\xE9veil",
    text: "Une grand-m\xE8re inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom. Quelque part, une porte qu'on ne finit pas d'ouvrir.",
    numinous: true,
    bigDream: true
  },
  {
    id: "k-07",
    type: "note_vie",
    when: "hier soir",
    text: "Doute profond sur la mission. Ce n'est pas la peur d'\xE9chouer. C'est la peur que ce soit juste \u2014 et qu'il faille tout redessiner."
  },
  {
    id: "k-06",
    type: "sidewalk_oracle",
    when: "hier, 14h",
    text: "Un corbeau sur le muret de la mosqu\xE9e, qui tenait dans son bec une feuille morte plus grande que sa t\xEAte. Il ne la laissait pas tomber."
  },
  {
    id: "k-05",
    type: "synchronicity",
    when: "avant-hier",
    text: "Trois personnes, en moins de six heures, m'ont parl\xE9 d'un pont inachev\xE9. Aucune ne se connaissait."
  },
  {
    id: "k-04",
    type: "daydream_reverie",
    when: "il y a quatre jours, midi",
    text: "Pendant une conversation sur les taxes, j'ai vu un estuaire depuis en haut. L'eau cherchait son lit entre des bancs de sable que personne n'avait dessin\xE9s."
  },
  {
    id: "k-03",
    type: "dream_night",
    when: "il y a une lune",
    text: "Une maison aux pi\xE8ces inconnues. Je cherche un enfant qui pleure derri\xE8re une porte. La porte est plus petite que moi.",
    echoOf: "k-08"
  },
  {
    id: "k-02",
    type: "somatic_shiver",
    when: "il y a deux lunes",
    text: "Frisson dans la nuque en lisant une lettre ancienne. Pas de mots \u2014 juste le frisson."
  },
  {
    id: "k-01",
    type: "note_vie",
    when: "il y a deux lunes",
    text: "D\xE9cision report\xE9e sur le contrat Paris. Quelque chose dans le ventre dit attends."
  }
];
const typeLabel = (t) => ({
  dream_night: "r\xEAve nocturne",
  sidewalk_oracle: "signe diurne",
  daydream_reverie: "r\xEAverie",
  hypnagogic: "hypnagogie",
  synchronicity: "synchronicit\xE9",
  somatic_shiver: "frisson somatique",
  note_vie: "note de vie"
})[t] || "moment";
const TypeGlyph = ({ type, size = 14 }) => {
  const common = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1 };
  switch (type) {
    case "dream_night":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r: size / 2 - 1 }));
    case "sidewalk_oracle":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("polygon", { points: `${size / 2},1 ${size - 1},${size - 1} 1,${size - 1}` }));
    case "daydream_reverie":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: `M1 ${size / 2} Q ${size / 4} 1 ${size / 2} ${size / 2} T ${size - 1} ${size / 2}` }));
    case "synchronicity":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: size / 3, cy: size / 2, r: size / 4 }), /* @__PURE__ */ React.createElement("circle", { cx: 2 * size / 3, cy: size / 2, r: size / 4 }));
    case "somatic_shiver":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: `M1 ${size - 2} L ${size / 3} 2 L ${2 * size / 3} ${size - 2} L ${size - 1} 2` }));
    case "hypnagogic":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("line", { x1: "1", y1: size / 2, x2: size - 1, y2: size / 2 }), /* @__PURE__ */ React.createElement("circle", { cx: size / 2, cy: size / 2, r: "2" }));
    default:
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "1", y: "1", width: size - 2, height: size - 2 }));
  }
};
const SeasonalCompass = () => /* @__PURE__ */ React.createElement("div", { className: "nav-compass" }, /* @__PURE__ */ React.createElement("span", { className: "glyph" }, "\u25D0"), "lune d\xE9croissante \xB7 mars");
const TopNav = ({ onLogo, showBack, onBack, label }) => /* @__PURE__ */ React.createElement("nav", { className: "nav" }, showBack ? /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onBack, "aria-label": "retour" }, "\u2190 ", label || "retour") : /* @__PURE__ */ React.createElement(
  "button",
  {
    onClick: onLogo,
    "aria-label": "accueil",
    style: { background: "none", border: "none", padding: 0 }
  },
  /* @__PURE__ */ React.createElement("span", { className: "nav-dot" })
), /* @__PURE__ */ React.createElement(SeasonalCompass, null));
const Home = ({ go, entries, loading }) => {
  const latest = entries && entries[0] || (window.seedEntries || [])[0] || null;
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(TopNav, null), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-l text-center op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "ce que le journal tient en ce moment"), loading && !latest ? /* @__PURE__ */ React.createElement("div", { className: "card text-center", style: { padding: "var(--s-6) var(--s-5)", opacity: 0.6 } }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "le journal s'\xE9veille\u2026")) : latest ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "var(--s-6) var(--s-5)" } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, latest.when), /* @__PURE__ */ React.createElement("p", { className: "h3-lecture", style: { textWrap: "pretty" } }, latest.text)), /* @__PURE__ */ React.createElement("button", { className: "whisper mt-l", onClick: () => go("kairos", latest.id) }, "un kairos t'attend pour cette question")) : /* @__PURE__ */ React.createElement("div", { className: "card text-center", style: { padding: "var(--s-6) var(--s-5)" } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: { fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)" } }, "ton journal est encore vide"), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { fontSize: 17, textWrap: "pretty" } }, "d\xE9pose un premier kairos \u2014 un r\xEAve, un signe, un frisson."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-4)", paddingTop: "var(--s-6)", paddingBottom: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-deposer", onClick: () => go("capture"), "aria-label": "d\xE9poser" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 28 28" }, /* @__PURE__ */ React.createElement("path", { d: "M4 10 Q14 22 24 10" }), /* @__PURE__ */ React.createElement("line", { x1: "14", y1: "2", x2: "14", y2: "10" }))), /* @__PURE__ */ React.createElement("div", { className: "meta", style: { letterSpacing: "0.15em", textTransform: "lowercase" } }, "d\xE9poser"))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const TYPE_CHIPS = [
  ["reve", "r\xEAve nocturne"],
  ["signe", "signe diurne"],
  ["reverie", "r\xEAverie"],
  ["hypnagogie", "hypnagogie"],
  ["synchronicite", "synchronicit\xE9"],
  ["frisson", "frisson"],
  ["note", "note de vie"]
];
const Capture = ({ go }) => {
  const initialPhase = (() => {
    try {
      const explicit = localStorage.getItem("dream:somatic-gate-enabled");
      if (explicit === "true") return "gate";
      return "field";
    } catch (e) {
      return "field";
    }
  })();
  const [phase, setPhase] = useState(initialPhase);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdId, setCreatedId] = useState(null);
  const [selectedType, setSelectedType] = useState("reve");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [showSomaticOptIn, setShowSomaticOptIn] = useState(false);
  const taRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  useEffect(() => {
    if (phase === "field" && taRef.current) taRef.current.focus();
  }, [phase]);
  useEffect(() => {
    try {
      const explicit = localStorage.getItem("dream:somatic-gate-enabled");
      if (explicit !== null) return;
      const prompted = localStorage.getItem("dream:somatic-gate-prompted");
      if (prompted) return;
      const isPost = typeof window.isPostJ30 === "function" ? window.isPostJ30("dream:account-created", 30) : false;
      if (isPost) {
        setShowSomaticOptIn(true);
      }
    } catch (e) {
    }
  }, []);
  const acceptSomaticGate = () => {
    try {
      localStorage.setItem("dream:somatic-gate-enabled", "true");
      localStorage.setItem("dream:somatic-gate-prompted", String(Date.now()));
    } catch (e) {
    }
    setShowSomaticOptIn(false);
    setPhase("gate");
  };
  const declineSomaticGate = () => {
    try {
      localStorage.setItem("dream:somatic-gate-enabled", "false");
      localStorage.setItem("dream:somatic-gate-prompted", String(Date.now()));
    } catch (e) {
    }
    setShowSomaticOptIn(false);
  };
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
        setSubmitError("L'enregistrement vocal n'est pas support\xE9 sur ce navigateur. Essaie en mode texte.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const opts = mimeType ? { mimeType } : {};
      const mr = new MediaRecorder(stream, opts);
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
          if (result == null ? void 0 : result.text) {
            setText((prev) => (prev ? prev + "\n\n" : "") + result.text);
          } else if (result == null ? void 0 : result.error) {
            setSubmitError("Transcription : " + result.error);
          }
        } catch (e) {
          setSubmitError("Transcription \xE9chou\xE9e : " + e.message);
        } finally {
          setTranscribing(false);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setSubmitError("Impossible d'acc\xE9der au micro : " + e.message);
    }
  };
  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    setRecording(false);
  };
  const submit = async () => {
    var _a, _b, _c, _d;
    if (text.trim().length < 3) return;
    setSubmitError(null);
    const trimmed = text.trim();
    const localId = "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    const localKairos = {
      id: localId,
      type: selectedType === "reve" ? "dream_night" : selectedType === "signe" ? "sidewalk_oracle" : selectedType === "reverie" ? "daydream_reverie" : selectedType === "hypnagogie" ? "hypnagogic" : selectedType === "synchronicite" ? "synchronicity" : selectedType === "frisson" ? "somatic_shiver" : selectedType === "note" ? "note_vie" : "dream_night",
      when: "\xE0 l'instant",
      text: trimmed,
      raw_text: trimmed,
      _pending: true,
      _localId: localId,
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      if (typeof window.DreamInsertLocalKairos === "function") {
        window.DreamInsertLocalKairos(localKairos);
      }
    } catch (e) {
    }
    setCreatedId(localId);
    setPhase("post");
    try {
      (_b = (_a = window.wowRegistry) == null ? void 0 : _a.fire) == null ? void 0 : _b.call(_a, "premier-kairos");
    } catch (e) {
    }
    const syncId = window.dreamSyncBegin ? window.dreamSyncBegin("createKairos") : null;
    setSubmitting(true);
    try {
      const result = await window.DreamAPI.createKairos({
        raw_text: trimmed,
        kairos_type: selectedType,
        capture_method: recording || transcribing ? "voice" : "text"
      });
      if ((_c = result == null ? void 0 : result.kairos) == null ? void 0 : _c.id) {
        if (typeof window.DreamReplaceLocalKairos === "function") {
          window.DreamReplaceLocalKairos(localId, result.kairos);
        }
        setCreatedId(result.kairos.id);
      }
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId);
      if (window.DreamRefreshEntries) setTimeout(() => window.DreamRefreshEntries(), 800);
    } catch (e) {
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: e.message });
      setSubmitError("Le d\xE9p\xF4t n'a pas atteint l'app, reviens dans un instant.");
      try {
        (_d = window.dreamShowToast) == null ? void 0 : _d.call(window, {
          text: "le d\xE9p\xF4t n'a pas atteint l'app, reviens dans un instant",
          tone: "error",
          duration: 5e3
        });
      } catch (e2) {
      }
    } finally {
      setSubmitting(false);
    }
  };
  const updateType = async (newType) => {
    setSelectedType(newType);
    if (createdId) {
      try {
        await window.DreamAPI.updateKairos(createdId, { kairos_type: newType });
      } catch (e) {
        console.warn("updateKairos type failed:", e.message);
      }
    }
  };
  if (phase === "gate") {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-warm)" } }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { minHeight: "calc(100vh - 60px)" } }, /* @__PURE__ */ React.createElement("div", { className: "stack", style: { alignItems: "center", gap: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath" }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic text-center", style: { maxWidth: 420 } }, "Trois respirations. Sens tes pieds. Tu es l\xE0."), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => setPhase("field") }, "entrer"), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setPhase("field") }, "passer"))));
  }
  if (phase === "field") {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-warm)" } }, /* @__PURE__ */ React.createElement("div", { className: "nav" }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => go("home"), "aria-label": "fermer" }, "\xD7 fermer"), /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--mono)" } }, "auto \xB7 local")), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, paddingTop: "var(--s-5)" } }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        ref: taRef,
        className: "capture-field",
        rows: 14,
        placeholder: transcribing ? "transcription en cours\u2026" : "Ce qui est venu\u2026",
        value: text,
        onChange: (e) => setText(e.target.value),
        disabled: submitting || transcribing
      }
    ), submitError && /* @__PURE__ */ React.createElement("div", { className: "meta mt-m", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" } }, submitError)), /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between", paddingBottom: "var(--s-4)" } }, /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, recording ? "\u{1F534} enregistrement\u2026" : transcribing ? "transcription\u2026" : `voix \xB7 ${text.length} caract\xE8res`), /* @__PURE__ */ React.createElement("div", { className: "row gap-s" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-ghost",
        onClick: submit,
        disabled: text.trim().length < 3 || submitting || recording || transcribing,
        style: { opacity: text.trim().length < 3 || submitting || recording || transcribing ? 0.4 : 1 }
      },
      submitting ? "d\xE9p\xF4t\u2026" : "garder"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        "aria-label": recording ? "arr\xEAter" : "voix",
        className: "btn-deposer",
        style: {
          width: 48,
          height: 48,
          background: recording ? "color-mix(in oklch, var(--ember-live) 30%, transparent)" : void 0
        },
        onClick: recording ? stopRecording : startRecording,
        disabled: submitting || transcribing
      },
      /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", style: { width: 18, height: 18 } }, /* @__PURE__ */ React.createElement("rect", { x: "9", y: "3", width: "6", height: "12", rx: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M5 11 Q5 18 12 18 Q19 18 19 11" }))
    )))), showSomaticOptIn && /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      inset: 0,
      zIndex: 150,
      background: "color-mix(in oklch, var(--night-floor) 78%, transparent)",
      backdropFilter: "blur(8px)",
      display: "grid",
      placeItems: "center",
      padding: "var(--s-4)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      background: "var(--night-warm)",
      border: "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-mid))",
      padding: "var(--s-5)",
      maxWidth: 460,
      width: "100%"
    } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: {
      fontFamily: "var(--mono)",
      fontSize: 10.5,
      letterSpacing: "0.08em",
      color: "var(--silk-gold)"
    } }, "UN GESTE QU'ON TE PROPOSE"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 18,
      lineHeight: 1.55,
      color: "var(--bone)",
      margin: "0 0 var(--s-4) 0",
      textWrap: "pretty"
    } }, "Veux-tu un seuil de respiration avant chaque d\xE9p\xF4t\xA0? Trois respirations, une trentaine de secondes."), /* @__PURE__ */ React.createElement("p", { className: "meta op-70 mb-m", style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 13,
      lineHeight: 1.6,
      textWrap: "pretty"
    } }, "Tu peux changer d'avis dans les param\xE8tres."), /* @__PURE__ */ React.createElement("div", { className: "row", style: {
      justifyContent: "space-between",
      marginTop: "var(--s-4)",
      gap: 12,
      flexWrap: "wrap"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-text",
        onClick: declineSomaticGate,
        style: { fontSize: 14 }
      },
      "non, garde rapide"
    ), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: acceptSomaticGate }, "oui, ralentir")))));
  }
  if (phase === "post") {
    return /* @__PURE__ */ React.createElement(
      CapturePostSequenced,
      {
        go,
        createdId,
        selectedType,
        text,
        updateType
      }
    );
  }
};
function CapturePostSequenced({ go, createdId, selectedType, text, updateType }) {
  const [wave, setWave] = useState(0);
  const [showTypeChips, setShowTypeChips] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const autoNavRef = useRef(null);
  const [showSpiraleWow, setShowSpiraleWow] = useState(false);
  useEffect(() => {
    setShowSpiraleWow(true);
  }, []);
  useEffect(() => {
    const t1 = setTimeout(() => setWave(1), 600);
    const t2 = setTimeout(() => setWave(2), 1400);
    const t3 = setTimeout(() => setWave(3), 2200);
    const t4 = setTimeout(() => setWave(4), 3e3);
    const tAuto = setTimeout(() => {
      if (!interacted && createdId) {
        if (autoNavRef.current) return;
        autoNavRef.current = true;
        go("kairos", createdId);
      }
    }, 11e3);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tAuto);
    };
  }, []);
  const onUserInteract = () => {
    setInteracted(true);
  };
  const goJournalLinked = () => {
    onUserInteract();
    try {
      window.__dreamJournalLinkedHint = {
        linked_kairos_id: createdId,
        source_text: text.trim(),
        source_type: selectedType,
        createdAt: Date.now()
      };
    } catch (e) {
    }
    go("home");
  };
  const goSeeKairos = () => {
    onUserInteract();
    if (createdId) go("kairos", createdId);
  };
  const goLetSleep = () => {
    onUserInteract();
    go("home");
  };
  const waveStyle = (active, delay = 0) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(8px)",
    transition: `opacity 600ms cubic-bezier(0.45,0,0.15,1) ${delay}ms, transform 600ms cubic-bezier(0.45,0,0.15,1) ${delay}ms`,
    pointerEvents: active ? "auto" : "none"
  });
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-warm)", position: "relative", overflow: "hidden" } }, window.Surface && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.5,
    zIndex: 0,
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement(
    window.Surface,
    {
      matter: "silk",
      motion: true,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    }
  )), /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => {
    onUserInteract();
    go("home");
  }, label: "" }), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    background: "radial-gradient(ellipse at 50% 38%, color-mix(in oklch, var(--ember-live) 14%, transparent), transparent 60%)",
    opacity: wave >= 0 ? 0.7 : 0,
    transition: "opacity 600ms cubic-bezier(0.45,0,0.15,1)",
    zIndex: 0
  } }), window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: "32%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "min(380px, 80vw)",
    height: "min(380px, 80vw)",
    opacity: wave >= 0 ? 0.6 : 0,
    transition: "opacity 800ms cubic-bezier(0.45,0,0.15,1)",
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), window.SpiraleWowOverlay && /* @__PURE__ */ React.createElement(window.SpiraleWowOverlay, { show: showSpiraleWow, onDone: () => setShowSpiraleWow(false) }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { minHeight: "calc(100vh - 60px)", position: "relative", zIndex: 2 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "stack text-center gap-m",
      style: { alignItems: "center", maxWidth: 480 },
      onClick: onUserInteract,
      onTouchStart: onUserInteract
    },
    /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 18,
      lineHeight: 1.6,
      color: "var(--bone)",
      textAlign: "center",
      textWrap: "pretty",
      maxWidth: 420,
      ...waveStyle(wave >= 1)
    } }, "Le kairos est d\xE9pos\xE9.", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--ash-light)", opacity: 0.85 } }, "Il dort 24 h avant que les \xE9chos ne murmurent.")),
    /* @__PURE__ */ React.createElement("div", { style: {
      width: "100%",
      maxWidth: 360,
      marginTop: "var(--s-5)",
      ...waveStyle(wave >= 2)
    } }, createdId && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: goSeeKairos,
        style: {
          width: "100%",
          background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
          border: "1px solid var(--silk-gold)",
          color: "var(--silk-gold)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 16,
          lineHeight: 1.4,
          padding: "12px 24px",
          cursor: "pointer",
          letterSpacing: "0.01em",
          transition: "all 280ms cubic-bezier(0.45,0,0.55,1)"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, transparent)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, transparent)";
        }
      },
      "voir mon kairos \u2192"
    )),
    /* @__PURE__ */ React.createElement("div", { className: "stack gap-s", style: {
      alignItems: "center",
      width: "100%",
      maxWidth: 360,
      marginTop: "var(--s-3)",
      ...waveStyle(wave >= 3)
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: goJournalLinked,
        style: {
          background: "transparent",
          border: "none",
          color: "var(--ash-light)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: "pointer",
          padding: "6px 12px",
          letterSpacing: "0.01em",
          opacity: 0.85,
          transition: "opacity 280ms ease, color 280ms ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.opacity = 1;
          e.currentTarget.style.color = "var(--bone)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.opacity = 0.85;
          e.currentTarget.style.color = "var(--ash-light)";
        }
      },
      "\xB7 d\xE9poser une note de Journal de Vie li\xE9e"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: goLetSleep,
        style: {
          background: "transparent",
          border: "none",
          color: "var(--ash-light)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: "pointer",
          padding: "6px 12px",
          letterSpacing: "0.01em",
          opacity: 0.7,
          transition: "opacity 280ms ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.opacity = 1;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.opacity = 0.7;
        }
      },
      "\xB7 laisser dormir \u2192"
    )),
    /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: "var(--s-5)",
      width: "100%",
      maxWidth: 360,
      ...waveStyle(wave >= 4)
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          onUserInteract();
          setShowTypeChips((s) => !s);
        },
        style: {
          background: "transparent",
          border: "none",
          color: "var(--ash-light)",
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          padding: "4px 8px",
          opacity: 0.5,
          transition: "opacity 280ms ease"
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.opacity = 0.85;
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.opacity = 0.5;
        }
      },
      showTypeChips ? "\u25B2 replier" : "\u25BC ajuster le type"
    ), showTypeChips && /* @__PURE__ */ React.createElement("div", { className: "dream-skeleton-fade-in", style: {
      marginTop: "var(--s-3)",
      padding: "var(--s-3) 0"
    } }, /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { flexWrap: "wrap", justifyContent: "center" } }, TYPE_CHIPS.map(([k, l]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        className: "chip " + (selectedType === k ? "active" : ""),
        onClick: () => {
          onUserInteract();
          updateType(k);
        },
        style: selectedType === k ? {
          borderColor: "var(--silk-gold)",
          color: "var(--silk-gold)",
          background: "color-mix(in oklch, var(--silk-gold) 8%, transparent)"
        } : void 0
      },
      l
    )))))
  )));
}
const Journal = ({ go, entries, loading }) => {
  const [filter, setFilter] = useState("all");
  const safeEntries = entries || [];
  const shown = filter === "all" ? safeEntries : safeEntries.filter((e) => e.type === filter);
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame" }, /* @__PURE__ */ React.createElement("div", { className: "row mb-m", style: { justifyContent: "space-between", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil" }, "Journal"), /* @__PURE__ */ React.createElement("div", { className: "mt-s" }, /* @__PURE__ */ React.createElement(SeasonalCompass, null))), /* @__PURE__ */ React.createElement("button", { className: "btn-text", "aria-label": "filtrer", style: { fontSize: 18 } }, "\u2399")), /* @__PURE__ */ React.createElement("div", { className: "row gap-s mb-l", style: { flexWrap: "wrap" } }, [
    ["all", "tout"],
    ["dream_night", "r\xEAves"],
    ["sidewalk_oracle", "signes"],
    ["daydream_reverie", "r\xEAveries"],
    ["synchronicity", "synchronicit\xE9s"],
    ["note_vie", "notes de vie"]
  ].map(([k, l]) => /* @__PURE__ */ React.createElement("button", { key: k, className: "chip" + (filter === k ? " active" : ""), onClick: () => setFilter(k) }, l))), loading && shown.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { padding: "var(--s-7)", opacity: 0.6 } }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "le journal s'\xE9veille\u2026")) : shown.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card text-center", style: { padding: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { fontSize: 17, textWrap: "pretty" } }, filter === "all" ? "ton journal est encore vide. d\xE9pose un premier kairos." : "aucun kairos de ce type pour l'instant.")) : /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: "var(--s-5)" } }, shown.map((e, i) => /* @__PURE__ */ React.createElement("div", { key: e.id }, i === 3 && filter === "all" && /* @__PURE__ */ React.createElement("div", { className: "divider-moon" }, "\u27F6 lune d\xE9croissante de mars"), /* @__PURE__ */ React.createElement(
    "article",
    {
      className: "card" + (e.bigDream ? " card-bigdream" : ""),
      onClick: () => go("kairos", e.id),
      style: { cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "row mb-s gap-s", style: { color: "var(--ash-light)" } }, /* @__PURE__ */ React.createElement(TypeGlyph, { type: e.type }), /* @__PURE__ */ React.createElement("span", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, e.when), /* @__PURE__ */ React.createElement("span", { className: "meta op-50" }, "\xB7"), /* @__PURE__ */ React.createElement("span", { className: "meta" }, typeLabel(e.type)), e.numinous && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--ember-live)", opacity: 0.7 } })),
    /* @__PURE__ */ React.createElement("p", { className: "body", style: {
      fontFamily: "var(--serif)",
      fontSize: 18,
      lineHeight: 1.55,
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textWrap: "pretty"
    } }, e.text)
  )))), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-deposer",
      style: { position: "fixed", bottom: 32, right: 32, width: 56, height: 56 },
      onClick: () => go("capture"),
      "aria-label": "d\xE9poser"
    },
    /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 28 28", style: { width: 20, height: 20 } }, /* @__PURE__ */ React.createElement("path", { d: "M4 10 Q14 22 24 10" }), /* @__PURE__ */ React.createElement("line", { x1: "14", y1: "2", x2: "14", y2: "10" }))
  )), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
Object.assign(window, {
  Home,
  Capture,
  Journal,
  TopNav,
  TypeGlyph,
  typeLabel,
  seedEntries,
  SeasonalCompass,
  // Sprint P1.4 (2026-04-27) — Optimistic Capture phase post séquencée
  CapturePostSequenced
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1jb3JlLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG5jb25zdCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlTWVtbyB9ID0gUmVhY3Q7XG5cbi8vIFx1MjUwMFx1MjUwMCBTYW1wbGUgZGF0YSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IHNlZWRFbnRyaWVzID0gW1xuICB7XG4gICAgaWQ6IFwiay0wOFwiLFxuICAgIHR5cGU6IFwiZHJlYW1fbmlnaHRcIixcbiAgICB3aGVuOiBcImNlIG1hdGluLCBhdmFudCBsZSByXHUwMEU5dmVpbFwiLFxuICAgIHRleHQ6IFwiVW5lIGdyYW5kLW1cdTAwRThyZSBpbmNvbm51ZSBsYXZlIGR1IGxpbmdlIGRhbnMgdW5lIGN1aXNpbmUgc2FucyBmZXUuIEVsbGUgbmUgbWUgcmVnYXJkZSBwYXMgbWFpcyBzYWl0IG1vbiBub20uIFF1ZWxxdWUgcGFydCwgdW5lIHBvcnRlIHF1J29uIG5lIGZpbml0IHBhcyBkJ291dnJpci5cIixcbiAgICBudW1pbm91czogdHJ1ZSxcbiAgICBiaWdEcmVhbTogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIGlkOiBcImstMDdcIixcbiAgICB0eXBlOiBcIm5vdGVfdmllXCIsXG4gICAgd2hlbjogXCJoaWVyIHNvaXJcIixcbiAgICB0ZXh0OiBcIkRvdXRlIHByb2ZvbmQgc3VyIGxhIG1pc3Npb24uIENlIG4nZXN0IHBhcyBsYSBwZXVyIGQnXHUwMEU5Y2hvdWVyLiBDJ2VzdCBsYSBwZXVyIHF1ZSBjZSBzb2l0IGp1c3RlIFx1MjAxNCBldCBxdSdpbCBmYWlsbGUgdG91dCByZWRlc3NpbmVyLlwiLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiay0wNlwiLFxuICAgIHR5cGU6IFwic2lkZXdhbGtfb3JhY2xlXCIsXG4gICAgd2hlbjogXCJoaWVyLCAxNGhcIixcbiAgICB0ZXh0OiBcIlVuIGNvcmJlYXUgc3VyIGxlIG11cmV0IGRlIGxhIG1vc3F1XHUwMEU5ZSwgcXVpIHRlbmFpdCBkYW5zIHNvbiBiZWMgdW5lIGZldWlsbGUgbW9ydGUgcGx1cyBncmFuZGUgcXVlIHNhIHRcdTAwRUF0ZS4gSWwgbmUgbGEgbGFpc3NhaXQgcGFzIHRvbWJlci5cIixcbiAgfSxcbiAge1xuICAgIGlkOiBcImstMDVcIixcbiAgICB0eXBlOiBcInN5bmNocm9uaWNpdHlcIixcbiAgICB3aGVuOiBcImF2YW50LWhpZXJcIixcbiAgICB0ZXh0OiBcIlRyb2lzIHBlcnNvbm5lcywgZW4gbW9pbnMgZGUgc2l4IGhldXJlcywgbSdvbnQgcGFybFx1MDBFOSBkJ3VuIHBvbnQgaW5hY2hldlx1MDBFOS4gQXVjdW5lIG5lIHNlIGNvbm5haXNzYWl0LlwiLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiay0wNFwiLFxuICAgIHR5cGU6IFwiZGF5ZHJlYW1fcmV2ZXJpZVwiLFxuICAgIHdoZW46IFwiaWwgeSBhIHF1YXRyZSBqb3VycywgbWlkaVwiLFxuICAgIHRleHQ6IFwiUGVuZGFudCB1bmUgY29udmVyc2F0aW9uIHN1ciBsZXMgdGF4ZXMsIGonYWkgdnUgdW4gZXN0dWFpcmUgZGVwdWlzIGVuIGhhdXQuIEwnZWF1IGNoZXJjaGFpdCBzb24gbGl0IGVudHJlIGRlcyBiYW5jcyBkZSBzYWJsZSBxdWUgcGVyc29ubmUgbidhdmFpdCBkZXNzaW5cdTAwRTlzLlwiLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiay0wM1wiLFxuICAgIHR5cGU6IFwiZHJlYW1fbmlnaHRcIixcbiAgICB3aGVuOiBcImlsIHkgYSB1bmUgbHVuZVwiLFxuICAgIHRleHQ6IFwiVW5lIG1haXNvbiBhdXggcGlcdTAwRThjZXMgaW5jb25udWVzLiBKZSBjaGVyY2hlIHVuIGVuZmFudCBxdWkgcGxldXJlIGRlcnJpXHUwMEU4cmUgdW5lIHBvcnRlLiBMYSBwb3J0ZSBlc3QgcGx1cyBwZXRpdGUgcXVlIG1vaS5cIixcbiAgICBlY2hvT2Y6IFwiay0wOFwiLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiay0wMlwiLFxuICAgIHR5cGU6IFwic29tYXRpY19zaGl2ZXJcIixcbiAgICB3aGVuOiBcImlsIHkgYSBkZXV4IGx1bmVzXCIsXG4gICAgdGV4dDogXCJGcmlzc29uIGRhbnMgbGEgbnVxdWUgZW4gbGlzYW50IHVuZSBsZXR0cmUgYW5jaWVubmUuIFBhcyBkZSBtb3RzIFx1MjAxNCBqdXN0ZSBsZSBmcmlzc29uLlwiLFxuICB9LFxuICB7XG4gICAgaWQ6IFwiay0wMVwiLFxuICAgIHR5cGU6IFwibm90ZV92aWVcIixcbiAgICB3aGVuOiBcImlsIHkgYSBkZXV4IGx1bmVzXCIsXG4gICAgdGV4dDogXCJEXHUwMEU5Y2lzaW9uIHJlcG9ydFx1MDBFOWUgc3VyIGxlIGNvbnRyYXQgUGFyaXMuIFF1ZWxxdWUgY2hvc2UgZGFucyBsZSB2ZW50cmUgZGl0IGF0dGVuZHMuXCIsXG4gIH0sXG5dO1xuXG4vLyBcdTI1MDBcdTI1MDAgVHlwZSBnbHlwaHMgKG1hdHRlcikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCB0eXBlTGFiZWwgPSAodCkgPT4gKHtcbiAgZHJlYW1fbmlnaHQ6IFwiclx1MDBFQXZlIG5vY3R1cm5lXCIsXG4gIHNpZGV3YWxrX29yYWNsZTogXCJzaWduZSBkaXVybmVcIixcbiAgZGF5ZHJlYW1fcmV2ZXJpZTogXCJyXHUwMEVBdmVyaWVcIixcbiAgaHlwbmFnb2dpYzogXCJoeXBuYWdvZ2llXCIsXG4gIHN5bmNocm9uaWNpdHk6IFwic3luY2hyb25pY2l0XHUwMEU5XCIsXG4gIHNvbWF0aWNfc2hpdmVyOiBcImZyaXNzb24gc29tYXRpcXVlXCIsXG4gIG5vdGVfdmllOiBcIm5vdGUgZGUgdmllXCIsXG59W3RdIHx8IFwibW9tZW50XCIpO1xuXG5jb25zdCBUeXBlR2x5cGggPSAoeyB0eXBlLCBzaXplID0gMTQgfSkgPT4ge1xuICBjb25zdCBjb21tb24gPSB7IHdpZHRoOiBzaXplLCBoZWlnaHQ6IHNpemUsIGZpbGw6IFwibm9uZVwiLCBzdHJva2U6IFwiY3VycmVudENvbG9yXCIsIHN0cm9rZVdpZHRoOiAxIH07XG4gIHN3aXRjaCAodHlwZSkge1xuICAgIGNhc2UgXCJkcmVhbV9uaWdodFwiOlxuICAgICAgcmV0dXJuIDxzdmcgey4uLmNvbW1vbn0+PGNpcmNsZSBjeD17c2l6ZS8yfSBjeT17c2l6ZS8yfSByPXtzaXplLzIgLSAxfSAvPjwvc3ZnPjtcbiAgICBjYXNlIFwic2lkZXdhbGtfb3JhY2xlXCI6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4uY29tbW9ufT48cG9seWdvbiBwb2ludHM9e2Ake3NpemUvMn0sMSAke3NpemUtMX0sJHtzaXplLTF9IDEsJHtzaXplLTF9YH0gLz48L3N2Zz47XG4gICAgY2FzZSBcImRheWRyZWFtX3JldmVyaWVcIjpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5jb21tb259PjxwYXRoIGQ9e2BNMSAke3NpemUvMn0gUSAke3NpemUvNH0gMSAke3NpemUvMn0gJHtzaXplLzJ9IFQgJHtzaXplLTF9ICR7c2l6ZS8yfWB9IC8+PC9zdmc+O1xuICAgIGNhc2UgXCJzeW5jaHJvbmljaXR5XCI6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4uY29tbW9ufT48Y2lyY2xlIGN4PXtzaXplLzN9IGN5PXtzaXplLzJ9IHI9e3NpemUvNH0gLz48Y2lyY2xlIGN4PXsyKnNpemUvM30gY3k9e3NpemUvMn0gcj17c2l6ZS80fSAvPjwvc3ZnPjtcbiAgICBjYXNlIFwic29tYXRpY19zaGl2ZXJcIjpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5jb21tb259PjxwYXRoIGQ9e2BNMSAke3NpemUtMn0gTCAke3NpemUvM30gMiBMICR7MipzaXplLzN9ICR7c2l6ZS0yfSBMICR7c2l6ZS0xfSAyYH0gLz48L3N2Zz47XG4gICAgY2FzZSBcImh5cG5hZ29naWNcIjpcbiAgICAgIHJldHVybiA8c3ZnIHsuLi5jb21tb259PjxsaW5lIHgxPVwiMVwiIHkxPXtzaXplLzJ9IHgyPXtzaXplLTF9IHkyPXtzaXplLzJ9IC8+PGNpcmNsZSBjeD17c2l6ZS8yfSBjeT17c2l6ZS8yfSByPVwiMlwiIC8+PC9zdmc+O1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gPHN2ZyB7Li4uY29tbW9ufT48cmVjdCB4PVwiMVwiIHk9XCIxXCIgd2lkdGg9e3NpemUtMn0gaGVpZ2h0PXtzaXplLTJ9IC8+PC9zdmc+O1xuICB9XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgU2Vhc29uYWwgY29tcGFzcyAodG9wIG5hdikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBTZWFzb25hbENvbXBhc3MgPSAoKSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwibmF2LWNvbXBhc3NcIj5cbiAgICA8c3BhbiBjbGFzc05hbWU9XCJnbHlwaFwiPlx1MjVEMDwvc3Bhbj5sdW5lIGRcdTAwRTljcm9pc3NhbnRlIFx1MDBCNyBtYXJzXG4gIDwvZGl2PlxuKTtcblxuY29uc3QgVG9wTmF2ID0gKHsgb25Mb2dvLCBzaG93QmFjaywgb25CYWNrLCBsYWJlbCB9KSA9PiAoXG4gIDxuYXYgY2xhc3NOYW1lPVwibmF2XCI+XG4gICAge3Nob3dCYWNrID8gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9e29uQmFja30gYXJpYS1sYWJlbD1cInJldG91clwiPlxuICAgICAgICBcdTIxOTAge2xhYmVsIHx8IFwicmV0b3VyXCJ9XG4gICAgICA8L2J1dHRvbj5cbiAgICApIDogKFxuICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkxvZ299IGFyaWEtbGFiZWw9XCJhY2N1ZWlsXCJcbiAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJub25lXCIsIGJvcmRlcjogXCJub25lXCIsIHBhZGRpbmc6IDAgfX0+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm5hdi1kb3RcIiAvPlxuICAgICAgPC9idXR0b24+XG4gICAgKX1cbiAgICA8U2Vhc29uYWxDb21wYXNzIC8+XG4gIDwvbmF2PlxuKTtcblxuLy8gXHUyNTAwXHUyNTAwIEhvbWUgKGpvdXJuYWwgc3Vic3RyYXQpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgSG9tZSA9ICh7IGdvLCBlbnRyaWVzLCBsb2FkaW5nIH0pID0+IHtcbiAgY29uc3QgbGF0ZXN0ID0gKGVudHJpZXMgJiYgZW50cmllc1swXSkgfHwgKHdpbmRvdy5zZWVkRW50cmllcyB8fCBbXSlbMF0gfHwgbnVsbDtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiPlxuICAgICAgPFRvcE5hdiAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZVwiIHN0eWxlPXt7IG1pbkhlaWdodDogXCJjYWxjKDEwMHZoIC0gNjBweClcIiwgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1sIHRleHQtY2VudGVyIG9wLTcwXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgY2UgcXVlIGxlIGpvdXJuYWwgdGllbnQgZW4gY2UgbW9tZW50XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7bG9hZGluZyAmJiAhbGF0ZXN0ID8gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHRleHQtY2VudGVyXCIgc3R5bGU9e3sgcGFkZGluZzogXCJ2YXIoLS1zLTYpIHZhcigtLXMtNSlcIiwgb3BhY2l0eTogMC42IH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICAgICAgbGUgam91cm5hbCBzJ1x1MDBFOXZlaWxsZVx1MjAyNlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkgOiBsYXRlc3QgPyAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBwYWRkaW5nOiBcInZhcigtLXMtNikgdmFyKC0tcy01KVwiIH19PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1zXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgICAgICAge2xhdGVzdC53aGVufVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImgzLWxlY3R1cmVcIiBzdHlsZT17eyB0ZXh0V3JhcDogXCJwcmV0dHlcIiB9fT5cbiAgICAgICAgICAgICAgICAgIHtsYXRlc3QudGV4dH1cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwid2hpc3BlciBtdC1sXCIgb25DbGljaz17KCkgPT4gZ28oXCJrYWlyb3NcIiwgbGF0ZXN0LmlkKX0+XG4gICAgICAgICAgICAgICAgdW4ga2Fpcm9zIHQnYXR0ZW5kIHBvdXIgY2V0dGUgcXVlc3Rpb25cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8Lz5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHRleHQtY2VudGVyXCIgc3R5bGU9e3sgcGFkZGluZzogXCJ2YXIoLS1zLTYpIHZhcigtLXMtNSlcIiB9fT5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLW1cIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5cbiAgICAgICAgICAgICAgICB0b24gam91cm5hbCBlc3QgZW5jb3JlIHZpZGVcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiIHN0eWxlPXt7IGZvbnRTaXplOiAxNywgdGV4dFdyYXA6IFwicHJldHR5XCIgfX0+XG4gICAgICAgICAgICAgICAgZFx1MDBFOXBvc2UgdW4gcHJlbWllciBrYWlyb3MgXHUyMDE0IHVuIHJcdTAwRUF2ZSwgdW4gc2lnbmUsIHVuIGZyaXNzb24uXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGdhcDogXCJ2YXIoLS1zLTQpXCIsIHBhZGRpbmdUb3A6IFwidmFyKC0tcy02KVwiLCBwYWRkaW5nQm90dG9tOiBcInZhcigtLXMtNilcIiB9fT5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1kZXBvc2VyXCIgb25DbGljaz17KCkgPT4gZ28oXCJjYXB0dXJlXCIpfSBhcmlhLWxhYmVsPVwiZFx1MDBFOXBvc2VyXCI+XG4gICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjggMjhcIj5cbiAgICAgICAgICAgICAgPHBhdGggZD1cIk00IDEwIFExNCAyMiAyNCAxMFwiIC8+XG4gICAgICAgICAgICAgIDxsaW5lIHgxPVwiMTRcIiB5MT1cIjJcIiB4Mj1cIjE0XCIgeTI9XCIxMFwiIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBsZXR0ZXJTcGFjaW5nOiBcIjAuMTVlbVwiLCB0ZXh0VHJhbnNmb3JtOiBcImxvd2VyY2FzZVwiIH19PmRcdTAwRTlwb3NlcjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAge3dpbmRvdy5GZWVkYmFja0Zsb2F0ICYmIDx3aW5kb3cuRmVlZGJhY2tGbG9hdCAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBDYXB0dXJlIChzb21hdGljIGdhdGUgXHUyMTkyIGZpZWxkIFx1MjE5MiBwb3N0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IFRZUEVfQ0hJUFMgPSBbXG4gIFtcInJldmVcIiwgICAgICAgICAgXCJyXHUwMEVBdmUgbm9jdHVybmVcIl0sXG4gIFtcInNpZ25lXCIsICAgICAgICAgXCJzaWduZSBkaXVybmVcIl0sXG4gIFtcInJldmVyaWVcIiwgICAgICAgXCJyXHUwMEVBdmVyaWVcIl0sXG4gIFtcImh5cG5hZ29naWVcIiwgICAgXCJoeXBuYWdvZ2llXCJdLFxuICBbXCJzeW5jaHJvbmljaXRlXCIsIFwic3luY2hyb25pY2l0XHUwMEU5XCJdLFxuICBbXCJmcmlzc29uXCIsICAgICAgIFwiZnJpc3NvblwiXSxcbiAgW1wibm90ZVwiLCAgICAgICAgICBcIm5vdGUgZGUgdmllXCJdLFxuXTtcblxuY29uc3QgQ2FwdHVyZSA9ICh7IGdvIH0pID0+IHtcbiAgLy8gMjAyNi0wNC0yNiBcdTIwMTQgQitEIHJlZm9udGUgKERlc2lnbiBcdTAwQTcxMS5iaXMuNikgOlxuICAvLyAgIHNraXAgc29tYXRpYyBnYXRlIHBhciBkXHUwMEU5ZmF1dCBKMC1KMzAuIERcdTAwRTljaWRlIGluaXRpYWwgcGhhc2UuXG4gIC8vICAgLSBTaSB1c2VyIGEgZXhwbGljaXRlbWVudCBhY3Rpdlx1MDBFOSBgZHJlYW06c29tYXRpYy1nYXRlLWVuYWJsZWQgPSBcInRydWVcImAgXHUyMTkyIFwiZ2F0ZVwiXG4gIC8vICAgLSBTaW5vbiBcdTIxOTIgc2tpcCBkaXJlY3QgdmVycyBcImZpZWxkXCIgKyBwcm9wb3NlIG1vZGFsIG9wdC1pbiBzaSBKMzArIGV0IHBhcyBlbmNvcmUgcHJvbXB0ZWRcbiAgY29uc3QgaW5pdGlhbFBoYXNlID0gKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgZXhwbGljaXQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRyZWFtOnNvbWF0aWMtZ2F0ZS1lbmFibGVkXCIpO1xuICAgICAgaWYgKGV4cGxpY2l0ID09PSBcInRydWVcIikgcmV0dXJuIFwiZ2F0ZVwiO1xuICAgICAgLy8gRGVmYXVsdCA9IHNraXBcbiAgICAgIHJldHVybiBcImZpZWxkXCI7XG4gICAgfSBjYXRjaCB7IHJldHVybiBcImZpZWxkXCI7IH1cbiAgfSkoKTtcblxuICBjb25zdCBbcGhhc2UsIHNldFBoYXNlXSA9IHVzZVN0YXRlKGluaXRpYWxQaGFzZSk7IC8vIGdhdGUgfCBmaWVsZCB8IHBvc3QgfCB0eXBlXG4gIGNvbnN0IFt0ZXh0LCBzZXRUZXh0XSA9IHVzZVN0YXRlKFwiXCIpO1xuICBjb25zdCBbc3VibWl0dGluZywgc2V0U3VibWl0dGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzdWJtaXRFcnJvciwgc2V0U3VibWl0RXJyb3JdID0gdXNlU3RhdGUobnVsbCk7XG4gIGNvbnN0IFtjcmVhdGVkSWQsIHNldENyZWF0ZWRJZF0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW3NlbGVjdGVkVHlwZSwgc2V0U2VsZWN0ZWRUeXBlXSA9IHVzZVN0YXRlKFwicmV2ZVwiKTtcbiAgY29uc3QgW3JlY29yZGluZywgc2V0UmVjb3JkaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW3RyYW5zY3JpYmluZywgc2V0VHJhbnNjcmliaW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgLy8gTW9kYWwgcHJvcG9zaXRpb24gb3B0LWluIHNvbWF0aWMgZ2F0ZSAoSjMwKylcbiAgY29uc3QgW3Nob3dTb21hdGljT3B0SW4sIHNldFNob3dTb21hdGljT3B0SW5dID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCB0YVJlZiA9IHVzZVJlZihudWxsKTtcbiAgY29uc3QgbWVkaWFSZWYgPSB1c2VSZWYobnVsbCk7XG4gIGNvbnN0IGNodW5rc1JlZiA9IHVzZVJlZihbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAocGhhc2UgPT09IFwiZmllbGRcIiAmJiB0YVJlZi5jdXJyZW50KSB0YVJlZi5jdXJyZW50LmZvY3VzKCk7XG4gIH0sIFtwaGFzZV0pO1xuXG4gIC8vIEF1IG1vdW50LCBzaSBvbiBhIHNhdXRcdTAwRTkgbGUgZ2F0ZSBFVCBxdSdvbiBlc3QgcG9zdC1KMzAgRVQgcXUnb24gbidhXG4gIC8vIGphbWFpcyBwcm9tcHRlZCwgcHJvcG9zZSBsYSBtb2RhbCBkJ29wdC1pbiAodW5lIHNldWxlIGZvaXMpLlxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBleHBsaWNpdCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJlYW06c29tYXRpYy1nYXRlLWVuYWJsZWRcIik7XG4gICAgICBpZiAoZXhwbGljaXQgIT09IG51bGwpIHJldHVybjsgLy8gZFx1MDBFOWpcdTAwRTAgZFx1MDBFOWNpZFx1MDBFOVxuICAgICAgY29uc3QgcHJvbXB0ZWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRyZWFtOnNvbWF0aWMtZ2F0ZS1wcm9tcHRlZFwiKTtcbiAgICAgIGlmIChwcm9tcHRlZCkgcmV0dXJuO1xuICAgICAgY29uc3QgaXNQb3N0ID0gKHR5cGVvZiB3aW5kb3cuaXNQb3N0SjMwID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgID8gd2luZG93LmlzUG9zdEozMChcImRyZWFtOmFjY291bnQtY3JlYXRlZFwiLCAzMClcbiAgICAgICAgOiBmYWxzZTtcbiAgICAgIGlmIChpc1Bvc3QpIHtcbiAgICAgICAgc2V0U2hvd1NvbWF0aWNPcHRJbih0cnVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHt9XG4gIH0sIFtdKTtcblxuICAvLyBDaG9peCBvcHQtaW4gOiBlbmFibGUgLyByZWZ1c2UgLyBwb3N0cG9uZVxuICBjb25zdCBhY2NlcHRTb21hdGljR2F0ZSA9ICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpzb21hdGljLWdhdGUtZW5hYmxlZFwiLCBcInRydWVcIik7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRyZWFtOnNvbWF0aWMtZ2F0ZS1wcm9tcHRlZFwiLCBTdHJpbmcoRGF0ZS5ub3coKSkpO1xuICAgIH0gY2F0Y2gge31cbiAgICBzZXRTaG93U29tYXRpY09wdEluKGZhbHNlKTtcbiAgICBzZXRQaGFzZShcImdhdGVcIik7XG4gIH07XG4gIGNvbnN0IGRlY2xpbmVTb21hdGljR2F0ZSA9ICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpzb21hdGljLWdhdGUtZW5hYmxlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpzb21hdGljLWdhdGUtcHJvbXB0ZWRcIiwgU3RyaW5nKERhdGUubm93KCkpKTtcbiAgICB9IGNhdGNoIHt9XG4gICAgc2V0U2hvd1NvbWF0aWNPcHRJbihmYWxzZSk7XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFZvaWNlIHJlY29yZGluZyAodXNlcyAvYXBpL3RyYW5zY3JpYmUpIFx1MjUwMFx1MjUwMFxuICAvLyAyMDI2LTA0LTI1IFx1MjAxNCBpT1MgU2FmYXJpIGZhbGxiYWNrIDogTWVkaWFSZWNvcmRlciBuJ2FpbWUgcGFzIGF1ZGlvL3dlYm0gc3VyIGlPUyxcbiAgLy8gaWwgZmF1dCBhdWRpby9tcDQgb3UgYXVkaW8vYWFjLiBPbiBlc3NhaWUgbGVzIHR5cGVzIHBhciBvcmRyZSBkZSBzdXBwb3J0LlxuICBjb25zdCBwaWNrTWltZVR5cGUgPSAoKSA9PiB7XG4gICAgaWYgKHR5cGVvZiBNZWRpYVJlY29yZGVyID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gbnVsbDtcbiAgICBjb25zdCBjYW5kaWRhdGVzID0gW1xuICAgICAgXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXCIsXG4gICAgICBcImF1ZGlvL3dlYm1cIixcbiAgICAgIFwiYXVkaW8vbXA0O2NvZGVjcz1tcDRhLjQwLjJcIixcbiAgICAgIFwiYXVkaW8vbXA0XCIsXG4gICAgICBcImF1ZGlvL2FhY1wiLFxuICAgICAgXCJhdWRpby9vZ2c7Y29kZWNzPW9wdXNcIixcbiAgICBdO1xuICAgIGZvciAoY29uc3QgdCBvZiBjYW5kaWRhdGVzKSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQgJiYgTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQodCkpIHJldHVybiB0O1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH1cbiAgICByZXR1cm4gXCJcIjsgLy8gYnJvd3NlciBkZWZhdWx0XG4gIH07XG5cbiAgY29uc3Qgc3RhcnRSZWNvcmRpbmcgPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlb2YgTWVkaWFSZWNvcmRlciA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBzZXRTdWJtaXRFcnJvcihcIkwnZW5yZWdpc3RyZW1lbnQgdm9jYWwgbidlc3QgcGFzIHN1cHBvcnRcdTAwRTkgc3VyIGNlIG5hdmlnYXRldXIuIEVzc2FpZSBlbiBtb2RlIHRleHRlLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3Qgc3RyZWFtID0gYXdhaXQgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoeyBhdWRpbzogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IG1pbWVUeXBlID0gcGlja01pbWVUeXBlKCk7XG4gICAgICBjb25zdCBvcHRzID0gbWltZVR5cGUgPyB7IG1pbWVUeXBlIH0gOiB7fTtcbiAgICAgIGNvbnN0IG1yID0gbmV3IE1lZGlhUmVjb3JkZXIoc3RyZWFtLCBvcHRzKTtcbiAgICAgIGNvbnN0IGFjdHVhbE1pbWUgPSBtci5taW1lVHlwZSB8fCBtaW1lVHlwZSB8fCBcImF1ZGlvL3dlYm1cIjtcbiAgICAgIGNodW5rc1JlZi5jdXJyZW50ID0gW107XG4gICAgICBtci5vbmRhdGFhdmFpbGFibGUgPSAoZXYpID0+IHsgaWYgKGV2LmRhdGEuc2l6ZSA+IDApIGNodW5rc1JlZi5jdXJyZW50LnB1c2goZXYuZGF0YSk7IH07XG4gICAgICBtci5vbnN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHQgPT4gdC5zdG9wKCkpO1xuICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoY2h1bmtzUmVmLmN1cnJlbnQsIHsgdHlwZTogYWN0dWFsTWltZSB9KTtcbiAgICAgICAgc2V0VHJhbnNjcmliaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS50cmFuc2NyaWJlKGJsb2IsIGFjdHVhbE1pbWUpO1xuICAgICAgICAgIGlmIChyZXN1bHQ/LnRleHQpIHtcbiAgICAgICAgICAgIHNldFRleHQocHJldiA9PiAocHJldiA/IHByZXYgKyBcIlxcblxcblwiIDogXCJcIikgKyByZXN1bHQudGV4dCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQ/LmVycm9yKSB7XG4gICAgICAgICAgICBzZXRTdWJtaXRFcnJvcihcIlRyYW5zY3JpcHRpb24gOiBcIiArIHJlc3VsdC5lcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgc2V0U3VibWl0RXJyb3IoXCJUcmFuc2NyaXB0aW9uIFx1MDBFOWNob3VcdTAwRTllIDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIHNldFRyYW5zY3JpYmluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBtZWRpYVJlZi5jdXJyZW50ID0gbXI7XG4gICAgICBtci5zdGFydCgpO1xuICAgICAgc2V0UmVjb3JkaW5nKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldFN1Ym1pdEVycm9yKFwiSW1wb3NzaWJsZSBkJ2FjY1x1MDBFOWRlciBhdSBtaWNybyA6IFwiICsgZS5tZXNzYWdlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgc3RvcFJlY29yZGluZyA9ICgpID0+IHtcbiAgICBpZiAobWVkaWFSZWYuY3VycmVudCAmJiBtZWRpYVJlZi5jdXJyZW50LnN0YXRlICE9PSBcImluYWN0aXZlXCIpIHtcbiAgICAgIG1lZGlhUmVmLmN1cnJlbnQuc3RvcCgpO1xuICAgIH1cbiAgICBzZXRSZWNvcmRpbmcoZmFsc2UpO1xuICB9O1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBTdWJtaXQgXHUyNTAwXHUyNTAwIDIwMjYtMDQtMjcgUDEuNCA6IE9wdGltaXN0aWMgVUlcbiAgLy8gTmF2aWdhdGUgdG8gXCJwb3N0XCIgcGhhc2UgSU1NRURJQVRFTFksIHRoZW4gcHVzaCB0byBBUEkgaW4gYmFja2dyb3VuZC5cbiAgLy8gbG9jYWwga2Fpcm9zIGlkIGBsb2NhbC0ke3RzfWAgZmxhZ2dlZCBgX3BlbmRpbmc6IHRydWVgIGluc1x1MDBFOHJlIGxvY2FsZW1lbnQuXG4gIC8vIEF1IHJldG91ciBBUEkgOiByZW1wbGFjZSB2aWEgd2luZG93LkRyZWFtUmVwbGFjZUxvY2FsS2Fpcm9zKGxvY2FsSWQsIHJlYWxLYWlyb3MpLlxuICAvLyBFcnJldXIgOiBPcHRpbWlzdGljVG9hc3QgKyByZXRyeS5cbiAgY29uc3Qgc3VibWl0ID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICh0ZXh0LnRyaW0oKS5sZW5ndGggPCAzKSByZXR1cm47XG4gICAgc2V0U3VibWl0RXJyb3IobnVsbCk7XG5cbiAgICBjb25zdCB0cmltbWVkID0gdGV4dC50cmltKCk7XG4gICAgY29uc3QgbG9jYWxJZCA9IFwibG9jYWwtXCIgKyBEYXRlLm5vdygpICsgXCItXCIgKyBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zbGljZSgyLCA2KTtcbiAgICBjb25zdCBsb2NhbEthaXJvcyA9IHtcbiAgICAgIGlkOiBsb2NhbElkLFxuICAgICAgdHlwZTogc2VsZWN0ZWRUeXBlID09PSBcInJldmVcIiA/IFwiZHJlYW1fbmlnaHRcIlxuICAgICAgICAgIDogc2VsZWN0ZWRUeXBlID09PSBcInNpZ25lXCIgPyBcInNpZGV3YWxrX29yYWNsZVwiXG4gICAgICAgICAgOiBzZWxlY3RlZFR5cGUgPT09IFwicmV2ZXJpZVwiID8gXCJkYXlkcmVhbV9yZXZlcmllXCJcbiAgICAgICAgICA6IHNlbGVjdGVkVHlwZSA9PT0gXCJoeXBuYWdvZ2llXCIgPyBcImh5cG5hZ29naWNcIlxuICAgICAgICAgIDogc2VsZWN0ZWRUeXBlID09PSBcInN5bmNocm9uaWNpdGVcIiA/IFwic3luY2hyb25pY2l0eVwiXG4gICAgICAgICAgOiBzZWxlY3RlZFR5cGUgPT09IFwiZnJpc3NvblwiID8gXCJzb21hdGljX3NoaXZlclwiXG4gICAgICAgICAgOiBzZWxlY3RlZFR5cGUgPT09IFwibm90ZVwiID8gXCJub3RlX3ZpZVwiXG4gICAgICAgICAgOiBcImRyZWFtX25pZ2h0XCIsXG4gICAgICB3aGVuOiBcIlx1MDBFMCBsJ2luc3RhbnRcIixcbiAgICAgIHRleHQ6IHRyaW1tZWQsXG4gICAgICByYXdfdGV4dDogdHJpbW1lZCxcbiAgICAgIF9wZW5kaW5nOiB0cnVlLFxuICAgICAgX2xvY2FsSWQ6IGxvY2FsSWQsXG4gICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgfTtcblxuICAgIC8vIE9wdGltaXN0aWMgbG9jYWwgaW5zZXJ0ICsgdHJhbnNpdGlvbiBpbW1cdTAwRTlkaWF0ZVxuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdy5EcmVhbUluc2VydExvY2FsS2Fpcm9zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgd2luZG93LkRyZWFtSW5zZXJ0TG9jYWxLYWlyb3MobG9jYWxLYWlyb3MpO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge31cblxuICAgIHNldENyZWF0ZWRJZChsb2NhbElkKTtcbiAgICBzZXRQaGFzZShcInBvc3RcIik7XG5cbiAgICAvLyBXb3cxIDogcHJlbWllciBrYWlyb3MgZFx1MDBFOXBvc1x1MDBFOSAoaWRlbXBvdGVudCB2aWEgd293UmVnaXN0cnkpXG4gICAgdHJ5IHsgd2luZG93Lndvd1JlZ2lzdHJ5Py5maXJlPy4oXCJwcmVtaWVyLWthaXJvc1wiKTsgfSBjYXRjaCB7fVxuXG4gICAgLy8gVHJhY2sgc3luYyBtdXRhdGlvbiBwb3VyIDxTeW5jU3RhdHVzPlxuICAgIGNvbnN0IHN5bmNJZCA9IHdpbmRvdy5kcmVhbVN5bmNCZWdpbiA/IHdpbmRvdy5kcmVhbVN5bmNCZWdpbihcImNyZWF0ZUthaXJvc1wiKSA6IG51bGw7XG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuY3JlYXRlS2Fpcm9zKHtcbiAgICAgICAgcmF3X3RleHQ6IHRyaW1tZWQsXG4gICAgICAgIGthaXJvc190eXBlOiBzZWxlY3RlZFR5cGUsXG4gICAgICAgIGNhcHR1cmVfbWV0aG9kOiByZWNvcmRpbmcgfHwgdHJhbnNjcmliaW5nID8gXCJ2b2ljZVwiIDogXCJ0ZXh0XCIsXG4gICAgICB9KTtcbiAgICAgIGlmIChyZXN1bHQ/LmthaXJvcz8uaWQpIHtcbiAgICAgICAgLy8gUmVtcGxhY2UgbG9jYWwgcGFyIHJlYWwga2Fpcm9zXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93LkRyZWFtUmVwbGFjZUxvY2FsS2Fpcm9zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICB3aW5kb3cuRHJlYW1SZXBsYWNlTG9jYWxLYWlyb3MobG9jYWxJZCwgcmVzdWx0LmthaXJvcyk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0Q3JlYXRlZElkKHJlc3VsdC5rYWlyb3MuaWQpO1xuICAgICAgfVxuICAgICAgaWYgKHdpbmRvdy5kcmVhbVN5bmNFbmQpIHdpbmRvdy5kcmVhbVN5bmNFbmQoc3luY0lkKTtcbiAgICAgIC8vIFJlZnJlc2ggaW4gYmFja2dyb3VuZCAoc2VydmVyLXRydXRoKVxuICAgICAgaWYgKHdpbmRvdy5EcmVhbVJlZnJlc2hFbnRyaWVzKSBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5EcmVhbVJlZnJlc2hFbnRyaWVzKCksIDgwMCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgLy8gTGUgbG9jYWwga2Fpcm9zIHJlc3RlIHZpc2libGUgYXZlYyBfcGVuZGluZyBcdTIxOTIgdG9hc3QgcmV0cnlcbiAgICAgIGlmICh3aW5kb3cuZHJlYW1TeW5jRW5kKSB3aW5kb3cuZHJlYW1TeW5jRW5kKHN5bmNJZCwgeyBlcnJvcjogZS5tZXNzYWdlIH0pO1xuICAgICAgc2V0U3VibWl0RXJyb3IoXCJMZSBkXHUwMEU5cFx1MDBGNHQgbidhIHBhcyBhdHRlaW50IGwnYXBwLCByZXZpZW5zIGRhbnMgdW4gaW5zdGFudC5cIik7XG4gICAgICB0cnkgeyB3aW5kb3cuZHJlYW1TaG93VG9hc3Q/Lih7XG4gICAgICAgIHRleHQ6IFwibGUgZFx1MDBFOXBcdTAwRjR0IG4nYSBwYXMgYXR0ZWludCBsJ2FwcCwgcmV2aWVucyBkYW5zIHVuIGluc3RhbnRcIixcbiAgICAgICAgdG9uZTogXCJlcnJvclwiLFxuICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgIH0pOyB9IGNhdGNoIHt9XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFN1Ym1pdHRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICAvLyBVcGRhdGUga2Fpcm9zX3R5cGUgYWZ0ZXIgdGhlIGZhY3QgKHBvc3QtcGhhc2UgY2hpcHMpXG4gIC8vIDIwMjYtMDQtMjUgXHUyMDE0IGJhY2tlbmQgd2hpdGVsaXN0IG5vdyBpbmNsdWRlcyBrYWlyb3NfdHlwZSBcdTIxOTIgUEFUQ0ggbGl2ZVxuICBjb25zdCB1cGRhdGVUeXBlID0gYXN5bmMgKG5ld1R5cGUpID0+IHtcbiAgICBzZXRTZWxlY3RlZFR5cGUobmV3VHlwZSk7XG4gICAgaWYgKGNyZWF0ZWRJZCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLnVwZGF0ZUthaXJvcyhjcmVhdGVkSWQsIHsga2Fpcm9zX3R5cGU6IG5ld1R5cGUgfSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcInVwZGF0ZUthaXJvcyB0eXBlIGZhaWxlZDpcIiwgZS5tZXNzYWdlKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgaWYgKHBoYXNlID09PSBcImdhdGVcIikge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIiB9fT5cbiAgICAgICAgPFRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lIGNlbnRlclwiIHN0eWxlPXt7IG1pbkhlaWdodDogXCJjYWxjKDEwMHZoIC0gNjBweClcIiB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrXCIgc3R5bGU9e3sgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiBcInZhcigtLXMtNilcIiB9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnJlYXRoXCIgLz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpYyB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IG1heFdpZHRoOiA0MjAgfX0+XG4gICAgICAgICAgICAgIFRyb2lzIHJlc3BpcmF0aW9ucy4gU2VucyB0ZXMgcGllZHMuIFR1IGVzIGxcdTAwRTAuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IHNldFBoYXNlKFwiZmllbGRcIil9PmVudHJlcjwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9eygpID0+IHNldFBoYXNlKFwiZmllbGRcIil9PnBhc3NlcjwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBpZiAocGhhc2UgPT09IFwiZmllbGRcIikge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIiB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gZ28oXCJob21lXCIpfSBhcmlhLWxhYmVsPVwiZmVybWVyXCI+XG4gICAgICAgICAgICBcdTAwRDcgZmVybWVyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTcwXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiIH19PmF1dG8gXHUwMEI3IGxvY2FsPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgbWluSGVpZ2h0OiBcImNhbGMoMTAwdmggLSA2MHB4KVwiLCBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEsIHBhZGRpbmdUb3A6IFwidmFyKC0tcy01KVwiIH19PlxuICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgIHJlZj17dGFSZWZ9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhcHR1cmUtZmllbGRcIlxuICAgICAgICAgICAgICByb3dzPXsxNH1cbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9e3RyYW5zY3JpYmluZyA/IFwidHJhbnNjcmlwdGlvbiBlbiBjb3Vyc1x1MjAyNlwiIDogXCJDZSBxdWkgZXN0IHZlbnVcdTIwMjZcIn1cbiAgICAgICAgICAgICAgdmFsdWU9e3RleHR9XG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0VGV4dChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nIHx8IHRyYW5zY3JpYmluZ31cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICB7c3VibWl0RXJyb3IgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbXQtbVwiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWVtYmVyLWxpdmUpXCIsIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICAgICAgICB7c3VibWl0RXJyb3J9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgcGFkZGluZ0JvdHRvbTogXCJ2YXIoLS1zLTQpXCIgfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIj5cbiAgICAgICAgICAgICAge3JlY29yZGluZyA/IFwiXHVEODNEXHVERDM0IGVucmVnaXN0cmVtZW50XHUyMDI2XCIgOiB0cmFuc2NyaWJpbmcgPyBcInRyYW5zY3JpcHRpb25cdTIwMjZcIiA6IGB2b2l4IFx1MDBCNyAke3RleHQubGVuZ3RofSBjYXJhY3RcdTAwRThyZXNgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtc1wiPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9e3N1Ym1pdH1cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17dGV4dC50cmltKCkubGVuZ3RoIDwgMyB8fCBzdWJtaXR0aW5nIHx8IHJlY29yZGluZyB8fCB0cmFuc2NyaWJpbmd9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogKHRleHQudHJpbSgpLmxlbmd0aCA8IDMgfHwgc3VibWl0dGluZyB8fCByZWNvcmRpbmcgfHwgdHJhbnNjcmliaW5nKSA/IDAuNCA6IDEgfX0+XG4gICAgICAgICAgICAgICAge3N1Ym1pdHRpbmcgPyBcImRcdTAwRTlwXHUwMEY0dFx1MjAyNlwiIDogXCJnYXJkZXJcIn1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtyZWNvcmRpbmcgPyBcImFyclx1MDBFQXRlclwiIDogXCJ2b2l4XCJ9XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWRlcG9zZXJcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogNDgsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByZWNvcmRpbmcgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZW1iZXItbGl2ZSkgMzAlLCB0cmFuc3BhcmVudClcIiA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3JlY29yZGluZyA/IHN0b3BSZWNvcmRpbmcgOiBzdGFydFJlY29yZGluZ31cbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZyB8fCB0cmFuc2NyaWJpbmd9XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBzdHlsZT17eyB3aWR0aDogMTgsIGhlaWdodDogMTggfX0+XG4gICAgICAgICAgICAgICAgICA8cmVjdCB4PVwiOVwiIHk9XCIzXCIgd2lkdGg9XCI2XCIgaGVpZ2h0PVwiMTJcIiByeD1cIjNcIiAvPlxuICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk01IDExIFE1IDE4IDEyIDE4IFExOSAxOCAxOSAxMVwiIC8+XG4gICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiAyMDI2LTA0LTI2IFx1MjAxNCBNb2RhbCBvcHQtaW4gc29tYXRpYyBnYXRlIChEZXNpZ24gXHUwMEE3MTEuYmlzLjYpICovfVxuICAgICAgICB7c2hvd1NvbWF0aWNPcHRJbiAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIiwgaW5zZXQ6IDAsIHpJbmRleDogMTUwLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA3OCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig4cHgpXCIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcImdyaWRcIiwgcGxhY2VJdGVtczogXCJjZW50ZXJcIiwgcGFkZGluZzogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjUlLCB2YXIoLS1hc2gtbWlkKSlcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgICAgIG1heFdpZHRoOiA0NjAsIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItbVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIFVOIEdFU1RFIFFVJ09OIFRFIFBST1BPU0VcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxOCwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogXCIwIDAgdmFyKC0tcy00KSAwXCIsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBWZXV4LXR1IHVuIHNldWlsIGRlIHJlc3BpcmF0aW9uIGF2YW50IGNoYXF1ZSBkXHUwMEU5cFx1MDBGNHQmbmJzcDs/XG4gICAgICAgICAgICAgICAgVHJvaXMgcmVzcGlyYXRpb25zLCB1bmUgdHJlbnRhaW5lIGRlIHNlY29uZGVzLlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbWItbVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMywgbGluZUhlaWdodDogMS42LCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgVHUgcGV1eCBjaGFuZ2VyIGQnYXZpcyBkYW5zIGxlcyBwYXJhbVx1MDBFOHRyZXMuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgbWFyZ2luVG9wOiBcInZhcigtLXMtNClcIixcbiAgICAgICAgICAgICAgICBnYXA6IDEyLCBmbGV4V3JhcDogXCJ3cmFwXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtkZWNsaW5lU29tYXRpY0dhdGV9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICAgICAgICBub24sIGdhcmRlIHJhcGlkZVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17YWNjZXB0U29tYXRpY0dhdGV9PlxuICAgICAgICAgICAgICAgICAgb3VpLCByYWxlbnRpclxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmIChwaGFzZSA9PT0gXCJwb3N0XCIpIHtcbiAgICByZXR1cm4gPENhcHR1cmVQb3N0U2VxdWVuY2VkXG4gICAgICBnbz17Z299XG4gICAgICBjcmVhdGVkSWQ9e2NyZWF0ZWRJZH1cbiAgICAgIHNlbGVjdGVkVHlwZT17c2VsZWN0ZWRUeXBlfVxuICAgICAgdGV4dD17dGV4dH1cbiAgICAgIHVwZGF0ZVR5cGU9e3VwZGF0ZVR5cGV9IC8+O1xuICB9XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgQ2FwdHVyZSBQaGFzZSBQT1NUIHNcdTAwRTlxdWVuY1x1MDBFOWUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyAyMDI2LTA0LTI3IFx1MjAxNCBTcHJpbnQgUDEuNCAoRGVzaWduIFx1MDBBNzExLmJpcy4xOSlcbi8vIFJlZm9udGUgY29nbml0aXZlIDogNCB2YWd1ZXMgc1x1MDBFOXF1ZW5jXHUwMEU5ZXMgYXUgbGlldSBkZSB0b3V0IGQndW4gY291cC5cbi8vXG4vLyB0ID0gMCAgICAgIDogaGFsbyBlbWJlciByYWRpYWwgc3VidGlsIGZhZGUtaW4gNjAwbXNcbi8vIHQgPSA2MDBtcyAgOiB0ZXh0ZSBwb1x1MDBFOXRpcXVlIGl0YWxpYyAxOHB4IGZhZGUtaW5cbi8vIHQgPSAxNDAwbXMgOiAxIEFDVElPTiBQUklOQ0lQQUxFIHNpbGstZ29sZCBcInZvaXIgbW9uIGthaXJvcyBcdTIxOTJcIlxuLy8gdCA9IDIyMDBtcyA6IDIgYWN0aW9ucyBzZWNvbmRhaXJlcyB0ZXh0LWxpbmsgc29icmVcbi8vIHQgPSAzMDAwbXMgOiBcIlx1MjVCQyBhanVzdGVyIGxlIHR5cGVcIiBleHBhbmRhYmxlIHRyXHUwMEU4cyBkaXNjcmV0XG4vL1xuLy8gQXV0by1uYXZpZ2F0ZSB2ZXJzIEthaXJvc0RldGFpbCBzaSB1c2VyIGluYWN0aWYgOHMgYXByXHUwMEU4cyB3YXZlIDQuXG4vL1xuLy8gUHJcdTAwRTlzZXJ2ZSBUT1VURSBsYSBsb2dpcXVlIGQnb3JpZ2luZSA6IHVwZGF0ZSB0eXBlIHZpYSBQQVRDSCBsaXZlLFxuLy8gZ29Kb3VybmFsTGlua2VkIGZsYWcsIG5hdmlnYXRpb24gdmVycyBob21lL2thaXJvcy5cbmZ1bmN0aW9uIENhcHR1cmVQb3N0U2VxdWVuY2VkKHsgZ28sIGNyZWF0ZWRJZCwgc2VsZWN0ZWRUeXBlLCB0ZXh0LCB1cGRhdGVUeXBlIH0pIHtcbiAgY29uc3QgW3dhdmUsIHNldFdhdmVdID0gdXNlU3RhdGUoMCk7IC8vIDA9aGFsbyBvbmx5LCAxPXRleHRlLCAyPWN0YSwgMz1zZWNvbmRhaXJlcywgND1leHBhbmRcbiAgY29uc3QgW3Nob3dUeXBlQ2hpcHMsIHNldFNob3dUeXBlQ2hpcHNdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaW50ZXJhY3RlZCwgc2V0SW50ZXJhY3RlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IGF1dG9OYXZSZWYgPSB1c2VSZWYobnVsbCk7XG4gIC8vIDIwMjYtMDQtMjkgXHUyMDE0IFNwaXJhbGVXb3dPdmVybGF5IChZZXNodWEpIDogMS45cyBzdXIgcHJlbWllciBrYWlyb3MgT1UgXHUwMEUwXG4gIC8vIGNoYXF1ZSBkXHUwMEU5cFx1MDBGNHQgc2kgdXNlciBhIGV4cGxpY2l0ZW1lbnQgcmVzZXQgd293IHJlZ2lzdHJ5LiBPbiBsJ2FmZmljaGVcbiAgLy8gZW4gcGFyYWxsXHUwMEU4bGUgZHUgaGFsbyAoekluZGV4IDUpLlxuICBjb25zdCBbc2hvd1NwaXJhbGVXb3csIHNldFNob3dTcGlyYWxlV293XSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIFNwaXJhbGVXb3cgOiBkXHUwMEU5Y2xlbmNoZSB0b3V0IGRlIHN1aXRlIHNpIHByZW1pZXIga2Fpcm9zIE9VIHNpIHBhc1xuICAgIC8vIGVuY29yZSB2dWUgZGFucyBjZXR0ZSBzZXNzaW9uLiB3b3dSZWdpc3RyeS5maXJlKCkgcmV0b3VybmUgdHJ1ZSBzaVxuICAgIC8vIGMnZXN0IGxlIHByZW1pZXIga2Fpcm9zIGphbWFpcyAoaWRlbXBvdGVudCBwZXJzaXN0YW50KS4gTWFpcyBvblxuICAgIC8vIHZldXQgYXVzc2kgdW4gd293IGRvdXggXHUwMEUwIGNoYXF1ZSBkXHUwMEU5cFx1MDBGNHQgaW1wb3J0YW50IFx1MjAxNCBWMSBzaW1wbGUgOlxuICAgIC8vIGFmZmljaGUgc3lzdFx1MDBFOW1hdGlxdWVtZW50IDEuOXMuIEF1IHBpcmUgYydlc3Qgc29icmUgZXQgZGlzY3JldC5cbiAgICBzZXRTaG93U3BpcmFsZVdvdyh0cnVlKTtcbiAgfSwgW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gNCB2YWd1ZXMgc1x1MDBFOXF1ZW5jXHUwMEU5ZXNcbiAgICBjb25zdCB0MSA9IHNldFRpbWVvdXQoKCkgPT4gc2V0V2F2ZSgxKSwgNjAwKTtcbiAgICBjb25zdCB0MiA9IHNldFRpbWVvdXQoKCkgPT4gc2V0V2F2ZSgyKSwgMTQwMCk7XG4gICAgY29uc3QgdDMgPSBzZXRUaW1lb3V0KCgpID0+IHNldFdhdmUoMyksIDIyMDApO1xuICAgIGNvbnN0IHQ0ID0gc2V0VGltZW91dCgoKSA9PiBzZXRXYXZlKDQpLCAzMDAwKTtcblxuICAgIC8vIEF1dG8tbmF2aWdhdGUgYXByXHUwMEU4cyA4cyBkJ2luYWN0aXZpdFx1MDBFOSAocG9zdCB3YXZlIDQpXG4gICAgY29uc3QgdEF1dG8gPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGlmICghaW50ZXJhY3RlZCAmJiBjcmVhdGVkSWQpIHtcbiAgICAgICAgaWYgKGF1dG9OYXZSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBhdXRvTmF2UmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgICBnbyhcImthaXJvc1wiLCBjcmVhdGVkSWQpO1xuICAgICAgfVxuICAgIH0sIDExMDAwKTsgLy8gMzAwMG1zIHdhdmUgNCArIDgwMDBtcyBhdHRlbnRlXG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY2xlYXJUaW1lb3V0KHQxKTsgY2xlYXJUaW1lb3V0KHQyKTsgY2xlYXJUaW1lb3V0KHQzKTsgY2xlYXJUaW1lb3V0KHQ0KTtcbiAgICAgIGNsZWFyVGltZW91dCh0QXV0byk7XG4gICAgfTtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVhY3QtaG9va3MvZXhoYXVzdGl2ZS1kZXBzXG4gIH0sIFtdKTtcblxuICAvLyBUb3V0ZSBpbnRlcmFjdGlvbiB1dGlsaXNhdGV1ciA9IGFubnVsZSBsJ2F1dG8tbmF2aWdhdGVcbiAgY29uc3Qgb25Vc2VySW50ZXJhY3QgPSAoKSA9PiB7IHNldEludGVyYWN0ZWQodHJ1ZSk7IH07XG5cbiAgY29uc3QgZ29Kb3VybmFsTGlua2VkID0gKCkgPT4ge1xuICAgIG9uVXNlckludGVyYWN0KCk7XG4gICAgdHJ5IHtcbiAgICAgIHdpbmRvdy5fX2RyZWFtSm91cm5hbExpbmtlZEhpbnQgPSB7XG4gICAgICAgIGxpbmtlZF9rYWlyb3NfaWQ6IGNyZWF0ZWRJZCxcbiAgICAgICAgc291cmNlX3RleHQ6IHRleHQudHJpbSgpLFxuICAgICAgICBzb3VyY2VfdHlwZTogc2VsZWN0ZWRUeXBlLFxuICAgICAgICBjcmVhdGVkQXQ6IERhdGUubm93KCksXG4gICAgICB9O1xuICAgIH0gY2F0Y2gge31cbiAgICBnbyhcImhvbWVcIik7XG4gIH07XG5cbiAgY29uc3QgZ29TZWVLYWlyb3MgPSAoKSA9PiB7XG4gICAgb25Vc2VySW50ZXJhY3QoKTtcbiAgICBpZiAoY3JlYXRlZElkKSBnbyhcImthaXJvc1wiLCBjcmVhdGVkSWQpO1xuICB9O1xuXG4gIGNvbnN0IGdvTGV0U2xlZXAgPSAoKSA9PiB7XG4gICAgb25Vc2VySW50ZXJhY3QoKTtcbiAgICBnbyhcImhvbWVcIik7XG4gIH07XG5cbiAgLy8gQW5pbWF0aW9uIGhlbHBlciA6IHN0eWxlIGZhZGUrdHJhbnNsYXRlLXVwIHBvdXIgd2F2ZSBlbnRyYW5jZVxuICBjb25zdCB3YXZlU3R5bGUgPSAoYWN0aXZlLCBkZWxheSA9IDApID0+ICh7XG4gICAgb3BhY2l0eTogYWN0aXZlID8gMSA6IDAsXG4gICAgdHJhbnNmb3JtOiBhY3RpdmUgPyBcInRyYW5zbGF0ZVkoMClcIiA6IFwidHJhbnNsYXRlWSg4cHgpXCIsXG4gICAgdHJhbnNpdGlvbjogYG9wYWNpdHkgNjAwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjE1LDEpICR7ZGVsYXl9bXMsIHRyYW5zZm9ybSA2MDBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuMTUsMSkgJHtkZWxheX1tc2AsXG4gICAgcG9pbnRlckV2ZW50czogYWN0aXZlID8gXCJhdXRvXCIgOiBcIm5vbmVcIixcbiAgfSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCIgfX0+XG4gICAgICB7LyogMjAyNi0wNC0yOSBcdTIwMTQgU3VyZmFjZSBzaWxrIGVuIGJhY2tncm91bmQgKFllc2h1YSwgb3BhY2l0eSAwLjUpICtcbiAgICAgICAgICBIYWxvUmVzcGlyZSBzaWxrIGRlcnJpXHUwMEU4cmUgbGUgdGV4dGUgY2VudHJhbC4gU3VyZmFjZSBuZSBzJ2FwcGxpcXVlXG4gICAgICAgICAgcXUnXHUwMEUwIHVuIGNvbnRhaW5lciBhdmVjIHBvc2l0aW9uIHJlbGF0aXZlIFx1MjAxNCBvbiBsJ3V0aWxpc2UgdmlhIFRhZ1xuICAgICAgICAgIGFic29sdXRlIGJlaGluZC4gKi99XG4gICAgICB7d2luZG93LlN1cmZhY2UgJiYgKFxuICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIG9wYWNpdHk6IDAuNSwgekluZGV4OiAwLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICA8d2luZG93LlN1cmZhY2UgbWF0dGVyPVwic2lsa1wiIG1vdGlvbj17dHJ1ZX1cbiAgICAgICAgICAgIHN0eWxlPXt7IHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8VG9wTmF2IHNob3dCYWNrIG9uQmFjaz17KCkgPT4geyBvblVzZXJJbnRlcmFjdCgpOyBnbyhcImhvbWVcIik7IH19IGxhYmVsPVwiXCIgLz5cblxuICAgICAgey8qIFdhdmUgMCBcdTIwMTQgSGFsbyBlbWJlciByYWRpYWwsIGZhZGUtaW4gNjAwbXMgKGFuaW1hdGlvbiBDU1MgdmlhIG9wYWNpdHkgdHJhbnNpdGlvbikgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgICAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoZWxsaXBzZSBhdCA1MCUgMzglLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyLWxpdmUpIDE0JSwgdHJhbnNwYXJlbnQpLCB0cmFuc3BhcmVudCA2MCUpXCIsXG4gICAgICAgIG9wYWNpdHk6IHdhdmUgPj0gMCA/IDAuNyA6IDAsXG4gICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSA2MDBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuMTUsMSlcIixcbiAgICAgICAgekluZGV4OiAwLFxuICAgICAgfX0gLz5cblxuICAgICAgey8qIDIwMjYtMDQtMjkgXHUyMDE0IEhhbG9SZXNwaXJlIHNpbGsgZGVycmlcdTAwRThyZSBsZSB0ZXh0ZSBjZW50cmFsICh6SW5kZXggMSkgKi99XG4gICAgICB7d2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogXCIzMiVcIiwgbGVmdDogXCI1MCVcIixcbiAgICAgICAgICB0cmFuc2Zvcm06IFwidHJhbnNsYXRlKC01MCUsIC01MCUpXCIsXG4gICAgICAgICAgd2lkdGg6IFwibWluKDM4MHB4LCA4MHZ3KVwiLCBoZWlnaHQ6IFwibWluKDM4MHB4LCA4MHZ3KVwiLFxuICAgICAgICAgIG9wYWNpdHk6IHdhdmUgPj0gMCA/IDAuNiA6IDAsXG4gICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDgwMG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC4xNSwxKVwiLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cInNpbGtcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiAyMDI2LTA0LTI5IFx1MjAxNCBTcGlyYWxlV293T3ZlcmxheSA6IHRyYWNlIGRlIHNwaXJhbGUgcXVpIHNlIGRlc3NpbmVcbiAgICAgICAgICAxLjlzIHN1ciBkXHUwMEU5cFx1MDBGNHQuIEF1dG8tZGlzbWlzcyB2aWEgb25Eb25lLiB6SW5kZXggNSBkYW5zIC5zcGlyYWxlLXdvdy4gKi99XG4gICAgICB7d2luZG93LlNwaXJhbGVXb3dPdmVybGF5ICYmIChcbiAgICAgICAgPHdpbmRvdy5TcGlyYWxlV293T3ZlcmxheSBzaG93PXtzaG93U3BpcmFsZVdvd30gb25Eb25lPXsoKSA9PiBzZXRTaG93U3BpcmFsZVdvdyhmYWxzZSl9IC8+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lIGNlbnRlclwiIHN0eWxlPXt7IG1pbkhlaWdodDogXCJjYWxjKDEwMHZoIC0gNjBweClcIiwgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAyIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIHRleHQtY2VudGVyIGdhcC1tXCIgc3R5bGU9e3sgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgbWF4V2lkdGg6IDQ4MCB9fVxuICAgICAgICAgIG9uQ2xpY2s9e29uVXNlckludGVyYWN0fSBvblRvdWNoU3RhcnQ9e29uVXNlckludGVyYWN0fT5cblxuICAgICAgICAgIHsvKiBXYXZlIDEgXHUyMDE0IFRleHRlIHBvXHUwMEU5dGlxdWUgaXRhbGljIDE4cHggKGFwcGFyYWl0IHQ9NjAwbXMpICovfVxuICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxOCxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNiwgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsIG1heFdpZHRoOiA0MjAsXG4gICAgICAgICAgICAuLi53YXZlU3R5bGUod2F2ZSA+PSAxKSxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIExlIGthaXJvcyBlc3QgZFx1MDBFOXBvc1x1MDBFOS48YnIgLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC44NSB9fT5cbiAgICAgICAgICAgICAgSWwgZG9ydCAyNCBoIGF2YW50IHF1ZSBsZXMgXHUwMEU5Y2hvcyBuZSBtdXJtdXJlbnQuXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgey8qIFdhdmUgMiBcdTIwMTQgMSBBQ1RJT04gUFJJTkNJUEFMRSBzaWxrLWdvbGQgKGFwcGFyYWl0IHQ9MTQwMG1zKSAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsIG1heFdpZHRoOiAzNjAsIG1hcmdpblRvcDogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgICAuLi53YXZlU3R5bGUod2F2ZSA+PSAyKSxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtjcmVhdGVkSWQgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2dvU2VlS2Fpcm9zfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTYsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTJweCAyNHB4XCIsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAxZW1cIixcbiAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IHtcbiAgICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjIlLCB0cmFuc3BhcmVudClcIjtcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiB7XG4gICAgICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgdm9pciBtb24ga2Fpcm9zIFx1MjE5MlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogV2F2ZSAzIFx1MjAxNCAyIGFjdGlvbnMgc2Vjb25kYWlyZXMgdGV4dC1saW5rIHNvYnJlIChhcHBhcmFpdCB0PTIyMDBtcykgKi99XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtc1wiIHN0eWxlPXt7XG4gICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCB3aWR0aDogXCIxMDAlXCIsIG1heFdpZHRoOiAzNjAsXG4gICAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy0zKVwiLFxuICAgICAgICAgICAgLi4ud2F2ZVN0eWxlKHdhdmUgPj0gMyksXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2dvSm91cm5hbExpbmtlZH1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC44NSxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgMjgwbXMgZWFzZSwgY29sb3IgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7IGUuY3VycmVudFRhcmdldC5zdHlsZS5jb2xvciA9IFwidmFyKC0tYm9uZSlcIjsgfX1cbiAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjg1OyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcInZhcigtLWFzaC1saWdodClcIjsgfX0+XG4gICAgICAgICAgICAgIFx1MDBCNyBkXHUwMEU5cG9zZXIgdW5lIG5vdGUgZGUgSm91cm5hbCBkZSBWaWUgbGlcdTAwRTllXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17Z29MZXRTbGVlcH1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTJweFwiLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC43LFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTsgfX1cbiAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjc7IH19PlxuICAgICAgICAgICAgICBcdTAwQjcgbGFpc3NlciBkb3JtaXIgXHUyMTkyXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBXYXZlIDQgXHUyMDE0IEV4cGFuZGFibGUgXCJhanVzdGVyIGxlIHR5cGVcIiB0clx1MDBFOHMgZGlzY3JldCAoYXBwYXJhaXQgdD0zMDAwbXMpICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpblRvcDogXCJ2YXIoLS1zLTUpXCIsIHdpZHRoOiBcIjEwMCVcIiwgbWF4V2lkdGg6IDM2MCxcbiAgICAgICAgICAgIC4uLndhdmVTdHlsZSh3YXZlID49IDQpLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiB7IG9uVXNlckludGVyYWN0KCk7IHNldFNob3dUeXBlQ2hpcHMocyA9PiAhcyk7IH19XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMC41LFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIiwgcGFkZGluZzogXCI0cHggOHB4XCIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC44NTsgfX1cbiAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjU7IH19PlxuICAgICAgICAgICAgICB7c2hvd1R5cGVDaGlwcyA/IFwiXHUyNUIyIHJlcGxpZXJcIiA6IFwiXHUyNUJDIGFqdXN0ZXIgbGUgdHlwZVwifVxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgIHtzaG93VHlwZUNoaXBzICYmIChcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcmVhbS1za2VsZXRvbi1mYWRlLWluXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwidmFyKC0tcy0zKVwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSAwXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1zXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgICAgICAgICAgIHtUWVBFX0NISVBTLm1hcCgoW2ssIGxdKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17XCJjaGlwIFwiICsgKHNlbGVjdGVkVHlwZSA9PT0gayA/IFwiYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IG9uVXNlckludGVyYWN0KCk7IHVwZGF0ZVR5cGUoayk7IH19XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3NlbGVjdGVkVHlwZSA9PT0gayA/IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDglLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgICAgICAgICB9IDogdW5kZWZpbmVkfT5cbiAgICAgICAgICAgICAgICAgICAgICB7bH1cbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgSm91cm5hbCBkZSBWaWUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBKb3VybmFsID0gKHsgZ28sIGVudHJpZXMsIGxvYWRpbmcgfSkgPT4ge1xuICBjb25zdCBbZmlsdGVyLCBzZXRGaWx0ZXJdID0gdXNlU3RhdGUoXCJhbGxcIik7XG4gIGNvbnN0IHNhZmVFbnRyaWVzID0gZW50cmllcyB8fCBbXTtcbiAgY29uc3Qgc2hvd24gPSBmaWx0ZXIgPT09IFwiYWxsXCIgPyBzYWZlRW50cmllcyA6IHNhZmVFbnRyaWVzLmZpbHRlcihlID0+IGUudHlwZSA9PT0gZmlsdGVyKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiPlxuICAgICAgPFRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtYi1tXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImZsZXgtZW5kXCIgfX0+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbFwiPkpvdXJuYWw8L2gxPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1zXCI+PFNlYXNvbmFsQ29tcGFzcyAvPjwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBhcmlhLWxhYmVsPVwiZmlsdHJlclwiIHN0eWxlPXt7IGZvbnRTaXplOiAxOCB9fT5cdTIzOTk8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXMgbWItbFwiIHN0eWxlPXt7IGZsZXhXcmFwOiBcIndyYXBcIiB9fT5cbiAgICAgICAgICB7W1xuICAgICAgICAgICAgW1wiYWxsXCIsIFwidG91dFwiXSxcbiAgICAgICAgICAgIFtcImRyZWFtX25pZ2h0XCIsIFwiclx1MDBFQXZlc1wiXSxcbiAgICAgICAgICAgIFtcInNpZGV3YWxrX29yYWNsZVwiLCBcInNpZ25lc1wiXSxcbiAgICAgICAgICAgIFtcImRheWRyZWFtX3JldmVyaWVcIiwgXCJyXHUwMEVBdmVyaWVzXCJdLFxuICAgICAgICAgICAgW1wic3luY2hyb25pY2l0eVwiLCBcInN5bmNocm9uaWNpdFx1MDBFOXNcIl0sXG4gICAgICAgICAgICBbXCJub3RlX3ZpZVwiLCBcIm5vdGVzIGRlIHZpZVwiXSxcbiAgICAgICAgICBdLm1hcCgoW2ssIGxdKSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uIGtleT17a30gY2xhc3NOYW1lPXtcImNoaXBcIiArIChmaWx0ZXIgPT09IGsgPyBcIiBhY3RpdmVcIiA6IFwiXCIpfSBvbkNsaWNrPXsoKSA9PiBzZXRGaWx0ZXIoayl9PntsfTwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7bG9hZGluZyAmJiBzaG93bi5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy03KVwiLCBvcGFjaXR5OiAwLjYgfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICAgIGxlIGpvdXJuYWwgcydcdTAwRTl2ZWlsbGVcdTIwMjZcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogc2hvd24ubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy02KVwiIH19PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgZm9udFNpemU6IDE3LCB0ZXh0V3JhcDogXCJwcmV0dHlcIiB9fT5cbiAgICAgICAgICAgICAge2ZpbHRlciA9PT0gXCJhbGxcIlxuICAgICAgICAgICAgICAgID8gXCJ0b24gam91cm5hbCBlc3QgZW5jb3JlIHZpZGUuIGRcdTAwRTlwb3NlIHVuIHByZW1pZXIga2Fpcm9zLlwiXG4gICAgICAgICAgICAgICAgOiBcImF1Y3VuIGthaXJvcyBkZSBjZSB0eXBlIHBvdXIgbCdpbnN0YW50LlwifVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2tcIiBzdHlsZT17eyBnYXA6IFwidmFyKC0tcy01KVwiIH19PlxuICAgICAgICAgICAge3Nob3duLm1hcCgoZSwgaSkgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17ZS5pZH0+XG4gICAgICAgICAgICAgICAge2kgPT09IDMgJiYgZmlsdGVyID09PSBcImFsbFwiICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGl2aWRlci1tb29uXCI+XHUyN0Y2IGx1bmUgZFx1MDBFOWNyb2lzc2FudGUgZGUgbWFyczwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPGFydGljbGVcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17XCJjYXJkXCIgKyAoZS5iaWdEcmVhbSA/IFwiIGNhcmQtYmlnZHJlYW1cIiA6IFwiXCIpfVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJrYWlyb3NcIiwgZS5pZCl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBjdXJzb3I6IFwicG9pbnRlclwiIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbWItcyBnYXAtc1wiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFR5cGVHbHlwaCB0eXBlPXtlLnR5cGV9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+e2Uud2hlbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1ldGEgb3AtNTBcIj5cdTAwQjc8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1ldGFcIj57dHlwZUxhYmVsKGUudHlwZSl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7ZS5udW1pbm91cyAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgbWFyZ2luTGVmdDogXCJhdXRvXCIsIHdpZHRoOiA2LCBoZWlnaHQ6IDYsIGJvcmRlclJhZGl1czogXCI1MCVcIiwgYmFja2dyb3VuZDogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBvcGFjaXR5OiAwLjcgfX0gLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYm9keVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTaXplOiAxOCwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCItd2Via2l0LWJveFwiLCBXZWJraXRMaW5lQ2xhbXA6IDMsIFdlYmtpdEJveE9yaWVudDogXCJ2ZXJ0aWNhbFwiLCBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICAgICAgICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCJcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICB7ZS50ZXh0fVxuICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1kZXBvc2VyXCIgc3R5bGU9e3sgcG9zaXRpb246IFwiZml4ZWRcIiwgYm90dG9tOiAzMiwgcmlnaHQ6IDMyLCB3aWR0aDogNTYsIGhlaWdodDogNTYgfX1cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyhcImNhcHR1cmVcIil9IGFyaWEtbGFiZWw9XCJkXHUwMEU5cG9zZXJcIj5cbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjggMjhcIiBzdHlsZT17eyB3aWR0aDogMjAsIGhlaWdodDogMjAgfX0+XG4gICAgICAgICAgICA8cGF0aCBkPVwiTTQgMTAgUTE0IDIyIDI0IDEwXCIgLz5cbiAgICAgICAgICAgIDxsaW5lIHgxPVwiMTRcIiB5MT1cIjJcIiB4Mj1cIjE0XCIgeTI9XCIxMFwiIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICB7d2luZG93LkZlZWRiYWNrRmxvYXQgJiYgPHdpbmRvdy5GZWVkYmFja0Zsb2F0IC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgSG9tZSwgQ2FwdHVyZSwgSm91cm5hbCwgVG9wTmF2LCBUeXBlR2x5cGgsIHR5cGVMYWJlbCwgc2VlZEVudHJpZXMsIFNlYXNvbmFsQ29tcGFzcyxcbiAgLy8gU3ByaW50IFAxLjQgKDIwMjYtMDQtMjcpIFx1MjAxNCBPcHRpbWlzdGljIENhcHR1cmUgcGhhc2UgcG9zdCBzXHUwMEU5cXVlbmNcdTAwRTllXG4gIENhcHR1cmVQb3N0U2VxdWVuY2VkLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFDQSxNQUFNLEVBQUUsVUFBVSxXQUFXLFFBQVEsUUFBUSxJQUFJO0FBR2pELE1BQU0sY0FBYztBQUFBLEVBQ2xCO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixVQUFVO0FBQUEsSUFDVixVQUFVO0FBQUEsRUFDWjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0E7QUFBQSxJQUNFLElBQUk7QUFBQSxJQUNKLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQTtBQUFBLElBQ0UsSUFBSTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFN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
