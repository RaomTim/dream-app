const { useState: jS, useEffect: jE, useRef: jR, useCallback: jCB } = React;
const DAY_VARS = {
  "--day-paper": "oklch(0.92 0.018 75)",
  "--day-linen": "oklch(0.88 0.022 70)",
  "--day-clay-warm": "oklch(0.78 0.045 60)",
  "--day-bone-warm": "oklch(0.65 0.025 65)",
  "--day-ash-soft": "oklch(0.50 0.015 65)",
  "--day-sun-low": "oklch(0.72 0.090 75)",
  "--day-shadow": "oklch(0.40 0.020 280)"
};
const dayStyle = (extra = {}) => ({
  background: "var(--day-paper)",
  color: "var(--day-bone-warm)",
  fontFamily: "var(--serif)",
  ...DAY_VARS,
  ...extra
});
function JourHeader({ go, lunePhase = "lune d\xE9croissante" }) {
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
  return /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid color-mix(in oklch, var(--day-clay-warm) 30%, transparent)"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--day-ash-soft)",
    letterSpacing: "0.02em"
  } }, today, " \xB7 ", lunePhase), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("portrait"),
      title: "ta lettre du moment",
      "aria-label": "voir mon portrait",
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 35%, transparent)",
        borderRadius: 100,
        padding: "5px 12px 5px 10px",
        cursor: "pointer",
        color: "var(--day-bone-warm)",
        opacity: 0.85,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 5,
        letterSpacing: "0.02em",
        transition: "all 380ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, transparent)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = 0.85;
        e.currentTarget.style.background = "transparent";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13 } }, "\u2737"),
    /* @__PURE__ */ React.createElement("span", null, "mon portrait")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("home"),
      title: "retour \xE0 Dream \u2014 l'\xE9cran d'accueil r\xEAve",
      "aria-label": "retour \xE0 Dream",
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 35%, transparent)",
        borderRadius: 100,
        padding: "5px 12px 5px 10px",
        cursor: "pointer",
        color: "var(--day-bone-warm)",
        opacity: 0.85,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        display: "flex",
        alignItems: "center",
        gap: 5,
        letterSpacing: "0.02em",
        transition: "all 380ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, transparent)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = 0.85;
        e.currentTarget.style.background = "transparent";
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13 } }, "\u263E"),
    /* @__PURE__ */ React.createElement("span", null, "retour \xE0 Dream")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("home-nuit"),
      title: "vue contemplative (un seul kairos)",
      "aria-label": "vue contemplative",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: 18,
        padding: "5px 8px",
        color: "var(--day-shadow)",
        opacity: 0.5,
        transition: "opacity 380ms ease"
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = 1,
      onMouseLeave: (e) => e.currentTarget.style.opacity = 0.5
    },
    "\u25CC"
  )));
}
function DeposerLibre({ onDepose }) {
  const [text, setText] = jS("");
  const [sending, setSending] = jS(false);
  const [recording, setRecording] = jS(false);
  const [error, setError] = jS(null);
  const [success, setSuccess] = jS(false);
  const [linkedHint, setLinkedHint] = jS(null);
  const taRef = jR(null);
  const mediaRef = jR(null);
  const chunksRef = jR([]);
  const PLACEHOLDERS = [
    "Que vis-tu, l\xE0, maintenant ?",
    "Qu'est-ce qui se demande aujourd'hui ?",
    "Qu'est-ce qui te traverse ?",
    "Que veux-tu d\xE9poser dans le journal ?",
    "Un doute, une joie, une question, un conflit ?"
  ];
  const placeholder = PLACEHOLDERS[Math.floor(Date.now() / 864e5) % PLACEHOLDERS.length];
  jE(() => {
    try {
      const hint = window.__dreamJournalLinkedHint;
      if (hint && Date.now() - hint.createdAt < 5 * 60 * 1e3) {
        setLinkedHint(hint);
        const snippet = (hint.source_text || "").slice(0, 80);
        const ellipsis = (hint.source_text || "").length > 80 ? "\u2026" : "";
        setText(`En \xE9cho au kairos d\xE9pos\xE9 (\xAB\xA0${snippet}${ellipsis}\xA0\xBB), je note ici dans ma vie de jour : `);
        setTimeout(() => {
          if (taRef.current) {
            taRef.current.focus();
            taRef.current.setSelectionRange(taRef.current.value.length, taRef.current.value.length);
          }
        }, 100);
        try {
          delete window.__dreamJournalLinkedHint;
        } catch (e) {
        }
      }
    } catch (e) {
    }
  }, []);
  const submit = async () => {
    var _a, _b, _c;
    if (text.trim().length < 1) return;
    const trimmed = text.trim();
    const linkedId = (linkedHint == null ? void 0 : linkedHint.linked_kairos_id) || null;
    setSending(true);
    setError(null);
    setSuccess(true);
    setText("");
    setLinkedHint(null);
    setTimeout(() => setSuccess(false), 2500);
    const syncId = window.dreamSyncBegin ? window.dreamSyncBegin("createJournalEntry") : null;
    try {
      const r = await window.DreamAPI.createJournalEntry({
        raw_text: trimmed,
        linked_kairos_id: linkedId
      });
      if ((_a = r == null ? void 0 : r.entry) == null ? void 0 : _a.id) {
        if (onDepose) onDepose(r.entry);
        if (window.dreamSyncEnd) window.dreamSyncEnd(syncId);
      } else if (r == null ? void 0 : r.error) {
        setError(r.error);
        if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: r.error });
        try {
          (_b = window.dreamShowToast) == null ? void 0 : _b.call(window, {
            text: "le d\xE9p\xF4t n'a pas atteint l'app, reviens dans un instant",
            tone: "error",
            duration: 5e3
          });
        } catch (e) {
        }
      }
    } catch (e) {
      setError("D\xE9p\xF4t \xE9chou\xE9 : " + e.message);
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: e.message });
      try {
        (_c = window.dreamShowToast) == null ? void 0 : _c.call(window, {
          text: "le d\xE9p\xF4t n'a pas atteint l'app, reviens dans un instant",
          tone: "error",
          duration: 5e3
        });
      } catch (e2) {
      }
    } finally {
      setSending(false);
    }
  };
  const pickMime = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac", "audio/ogg"];
    for (const t of candidates) {
      try {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t;
      } catch (e) {
      }
    }
    return "";
  };
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      const actual = mr.mimeType || mime || "audio/webm";
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: actual });
        try {
          const r = await window.DreamAPI.transcribe(blob, actual);
          if (r == null ? void 0 : r.text) setText((p) => (p ? p + "\n\n" : "") + r.text);
        } catch (e) {
          setError("Transcription : " + e.message);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setError("Micro inaccessible : " + e.message);
    }
  };
  const stopRec = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRecording(false);
  };
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "32px 24px",
    background: "var(--day-paper)"
  } }, linkedHint && /* @__PURE__ */ React.createElement("div", { style: {
    marginBottom: 12,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12,
    color: "var(--day-clay-warm)",
    letterSpacing: "0.02em",
    display: "flex",
    alignItems: "center",
    gap: 8
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "\u263E"), "note de jour reli\xE9e \xE0 un kairos d\xE9pos\xE9", /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setLinkedHint(null);
        setText("");
      },
      "aria-label": "d\xE9tacher",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--day-ash-soft)",
        fontSize: 12,
        marginLeft: "auto",
        fontFamily: "var(--serif)",
        fontStyle: "italic"
      }
    },
    "d\xE9tacher"
  )), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      ref: taRef,
      value: text,
      onChange: (e) => {
        setText(e.target.value);
        setError(null);
      },
      placeholder,
      disabled: sending,
      rows: 4,
      style: {
        width: "100%",
        minHeight: 120,
        background: "var(--day-linen)",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
        borderRadius: 4,
        padding: "20px 24px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 18,
        lineHeight: 1.6,
        color: "var(--day-bone-warm)",
        outline: "none",
        resize: "vertical",
        boxSizing: "border-box"
      }
    }
  ), error && /* @__PURE__ */ React.createElement("div", { style: {
    color: "var(--ember-live)",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8,
    fontFamily: "var(--serif)"
  } }, error), success && /* @__PURE__ */ React.createElement("div", { style: {
    color: "var(--day-clay-warm)",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 8,
    fontFamily: "var(--serif)"
  } }, "d\xE9pos\xE9. l'app range en silence."), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: recording ? stopRec : startRec,
      "aria-label": recording ? "arr\xEAter l'enregistrement" : "d\xE9poser en voix",
      style: {
        background: "transparent",
        border: "1px solid var(--day-bone-warm)",
        borderRadius: "50%",
        width: 40,
        height: 40,
        cursor: "pointer",
        color: recording ? "var(--ember-live)" : "var(--day-bone-warm)",
        opacity: 0.7,
        transition: "all 280ms ease"
      }
    },
    recording ? "\u25A0" : "\u{1F399}"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: submit,
      disabled: sending || text.trim().length < 1,
      style: {
        background: "var(--day-clay-warm)",
        color: "var(--day-paper)",
        border: "none",
        padding: "12px 28px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 15,
        letterSpacing: "0.02em",
        cursor: sending || text.trim().length < 1 ? "not-allowed" : "pointer",
        opacity: sending || text.trim().length < 1 ? 0.4 : 1,
        transition: "all 380ms ease"
      }
    },
    sending ? "\u2026" : "d\xE9poser"
  )));
}
function SectionCard({ section, onOpen }) {
  const empty = section.count === 0;
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onOpen(section),
      disabled: empty,
      style: {
        background: empty ? "transparent" : "var(--day-linen)",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
        padding: "18px 20px",
        textAlign: "left",
        cursor: empty ? "default" : "pointer",
        fontFamily: "var(--serif)",
        color: "var(--day-bone-warm)",
        opacity: empty ? 0.45 : 1,
        transition: "all 380ms ease",
        display: "flex",
        flexDirection: "column",
        gap: 6
      },
      onMouseEnter: (e) => {
        if (!empty) e.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, var(--day-linen))";
      },
      onMouseLeave: (e) => {
        if (!empty) e.currentTarget.style.background = "var(--day-linen)";
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, color: "var(--day-clay-warm)" } }, section.glyph), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontStyle: "italic" } }, section.label)), section.count > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--day-ash-soft)", fontFamily: "var(--mono)" } }, "\u2248", section.count > 50 ? "50+" : section.count)),
    section.last_entry && /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 13,
      color: "var(--day-ash-soft)",
      lineHeight: 1.5,
      fontStyle: "italic",
      marginTop: 4
    } }, '"', section.last_entry.raw_text, '"'),
    empty && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontStyle: "italic", color: "var(--day-ash-soft)" } }, "encore vide")
  );
}
function PolyphonieSheet({ summon, onClose, onFeedback }) {
  const [feltShift, setFeltShift] = jS(null);
  const [ahaLevel, setAhaLevel] = jS(null);
  const [ahaNote, setAhaNote] = jS("");
  const [submitted, setSubmitted] = jS(false);
  const [phase, setPhase] = jS("read");
  const submit = async () => {
    if (submitted || !(summon == null ? void 0 : summon.summon_id)) return;
    setSubmitted(true);
    try {
      await window.DreamAPI.submitWisdomFeedback(summon.summon_id, {
        felt_shift_location: feltShift,
        aha_level: ahaLevel,
        aha_note: ahaNote.trim() || null
      });
      if (onFeedback) onFeedback();
    } catch (e) {
      console.warn("feedback failed:", e.message);
    }
    setPhase("done");
    setTimeout(onClose, 1800);
  };
  if (!summon) return null;
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "color-mix(in oklch, var(--day-paper) 96%, var(--day-shadow))",
        overflowY: "auto",
        padding: "40px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 600, width: "100%" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        "aria-label": "fermer",
        style: {
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--day-ash-soft)",
          fontSize: 14,
          fontStyle: "italic",
          fontFamily: "var(--serif)",
          marginBottom: 24
        }
      },
      "\xD7 fermer"
    ), phase !== "done" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--mono)",
      fontSize: 11,
      letterSpacing: "0.1em",
      color: "var(--day-clay-warm)",
      marginBottom: 16,
      textTransform: "uppercase"
    } }, window.TermDef ? /* @__PURE__ */ React.createElement(window.TermDef, { term: "sagesse_des_kairos" }, "sagesse des kairos") : "sagesse des kairos"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontSize: 19,
      lineHeight: 1.7,
      color: "var(--day-bone-warm)",
      fontStyle: "italic",
      whiteSpace: "pre-wrap",
      marginBottom: 24,
      textWrap: "pretty"
    } }, summon.polyphony_text), summon.voices_mobilisees && summon.voices_mobilisees.length > 0 && /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 12,
      fontStyle: "italic",
      color: "var(--day-ash-soft)",
      fontFamily: "var(--serif)",
      marginBottom: 32,
      paddingTop: 12,
      borderTop: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)"
    } }, "voix tiss\xE9es : ", summon.voices_mobilisees.join(", ")), phase === "read" && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setPhase("felt"),
        style: {
          background: "var(--day-clay-warm)",
          color: "var(--day-paper)",
          border: "none",
          padding: "12px 24px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: "pointer",
          letterSpacing: "0.02em"
        }
      },
      "continuer"
    ), phase === "felt" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24 } }, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 16,
      color: "var(--day-bone-warm)",
      marginBottom: 20
    } }, "Qu'est-ce qui shift dans ton corps ?"), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 } }, [
      ["gorge", "gorge"],
      ["poitrine", "poitrine"],
      ["ventre", "ventre"],
      ["nuque", "nuque"],
      ["ailleurs", "ailleurs"],
      ["aucune", "rien"]
    ].map(([k, label]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => {
          setFeltShift(k);
          setPhase("aha");
        },
        style: {
          background: feltShift === k ? "var(--day-clay-warm)" : "transparent",
          color: feltShift === k ? "var(--day-paper)" : "var(--day-bone-warm)",
          border: "1px solid var(--day-clay-warm)",
          padding: "10px 12px",
          fontSize: 13,
          fontStyle: "italic",
          fontFamily: "var(--serif)",
          cursor: "pointer"
        }
      },
      label
    )))), phase === "aha" && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24 } }, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 16,
      color: "var(--day-bone-warm)",
      marginBottom: 20
    } }, "O\xF9 est ton aha ?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 16 } }, [["fort", "r\xE9sonne fort"], ["peut-etre", "peut-\xEAtre"], ["non", "non"]].map(([k, l]) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => setAhaLevel(k),
        style: {
          flex: 1,
          background: ahaLevel === k ? "var(--day-clay-warm)" : "transparent",
          color: ahaLevel === k ? "var(--day-paper)" : "var(--day-bone-warm)",
          border: "1px solid var(--day-clay-warm)",
          padding: "10px 12px",
          fontSize: 13,
          fontStyle: "italic",
          fontFamily: "var(--serif)",
          cursor: "pointer"
        }
      },
      l
    ))), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: ahaNote,
        onChange: (e) => setAhaNote(e.target.value),
        placeholder: "une note libre (optionnel)\u2026",
        rows: 2,
        style: {
          width: "100%",
          background: "var(--day-linen)",
          border: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
          padding: "10px 14px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 13,
          color: "var(--day-bone-warm)",
          outline: "none",
          boxSizing: "border-box",
          resize: "vertical"
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: submit,
        disabled: !ahaLevel || submitted,
        style: {
          marginTop: 16,
          background: "var(--day-clay-warm)",
          color: "var(--day-paper)",
          border: "none",
          padding: "12px 24px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: ahaLevel ? "pointer" : "not-allowed",
          opacity: ahaLevel ? 1 : 0.4
        }
      },
      "enregistrer"
    ))), phase === "done" && /* @__PURE__ */ React.createElement("div", { style: {
      textAlign: "center",
      padding: "60px 0",
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      color: "var(--day-clay-warm)",
      fontSize: 17
    } }, "tenu."))
  );
}
function SummonButton({ entry_id = null, category = null, sub_category = null, onSummonStart, onSummonDone }) {
  const [loading, setLoading] = jS(false);
  const trigger = async (e) => {
    e == null ? void 0 : e.stopPropagation();
    if (loading) return;
    setLoading(true);
    if (onSummonStart) onSummonStart();
    try {
      const r = await window.DreamAPI.summonKairosWisdom({ entry_id, category, sub_category });
      if (r.error) {
        alert(r.error);
      } else if (onSummonDone) {
        onSummonDone(r);
      }
    } catch (e2) {
      alert("\xC9chec : " + e2.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: trigger,
      disabled: loading,
      title: "appel \xE0 la sagesse des kairos",
      "aria-label": "appel \xE0 la sagesse des kairos",
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--day-sun-low) 50%, transparent)",
        borderRadius: "50%",
        width: 32,
        height: 32,
        cursor: loading ? "wait" : "pointer",
        color: "var(--day-sun-low)",
        fontSize: 14,
        opacity: loading ? 0.5 : 0.85,
        transition: "all 380ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.opacity = 1;
        e.currentTarget.style.transform = "scale(1.08)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.opacity = loading ? 0.5 : 0.85;
        e.currentTarget.style.transform = "scale(1)";
      }
    },
    loading ? "\u2026" : "\u2726"
  );
}
function JournalDeVieJour({ go }) {
  const [sections, setSections] = jS([]);
  const [loading, setLoading] = jS(true);
  const [activeSummon, setActiveSummon] = jS(null);
  const [summonLoading, setSummonLoading] = jS(false);
  const [recentEntries, setRecentEntries] = jS([]);
  const refreshSections = jCB(async () => {
    setLoading(true);
    try {
      const [sects, entries] = await Promise.all([
        window.DreamAPI.listJournalSections(),
        window.DreamAPI.listJournalEntries({ limit: 5 })
      ]);
      setSections((sects == null ? void 0 : sects.sections) || []);
      setRecentEntries((entries == null ? void 0 : entries.entries) || []);
    } catch (e) {
      console.warn("[Journal] refresh failed:", e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  jE(() => {
    refreshSections();
  }, [refreshSections]);
  return /* @__PURE__ */ React.createElement("div", { style: dayStyle({
    minHeight: "100vh",
    paddingBottom: 100
    // espace pour bottom nav
  }) }, /* @__PURE__ */ React.createElement(JourHeader, { go }), /* @__PURE__ */ React.createElement(DeposerLibre, { onDepose: () => refreshSections() }), recentEntries.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 24px 8px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--day-ash-soft)",
    textTransform: "uppercase",
    marginBottom: 12
  } }, "r\xE9cemment d\xE9pos\xE9"), recentEntries.map((e) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: e.id,
      style: {
        background: "var(--day-linen)",
        padding: "14px 18px",
        marginBottom: 8,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        borderLeft: "2px solid var(--day-clay-warm)"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 14,
      color: "var(--day-bone-warm)",
      lineHeight: 1.6
    } }, e.raw_text), e.category && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.1em",
      color: "var(--day-ash-soft)",
      marginTop: 6,
      textTransform: "uppercase"
    } }, e.category, e.sub_category ? " \xB7 " + e.sub_category : "")),
    /* @__PURE__ */ React.createElement(
      SummonButton,
      {
        entry_id: e.id,
        onSummonStart: () => setSummonLoading(true),
        onSummonDone: (r) => {
          setSummonLoading(false);
          setActiveSummon(r);
        }
      }
    )
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 24px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.1em",
    color: "var(--day-ash-soft)",
    textTransform: "uppercase",
    marginBottom: 14
  } }, "tes domaines de vie"), loading ? /* @__PURE__ */ React.createElement("div", { style: { fontStyle: "italic", color: "var(--day-ash-soft)", fontSize: 14 } }, "\u2026") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr", gap: 8 } }, sections.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.category, style: { position: "relative" } }, /* @__PURE__ */ React.createElement(SectionCard, { section: s, onOpen: () => go && go("journal-section", s) }), s.count > 0 && /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    top: 14,
    right: 14
  } }, /* @__PURE__ */ React.createElement(
    SummonButton,
    {
      category: s.category,
      onSummonStart: () => setSummonLoading(true),
      onSummonDone: (r) => {
        setSummonLoading(false);
        setActiveSummon(r);
      }
    }
  )))))), summonLoading && /* @__PURE__ */ React.createElement(SummonLoadingModal, { dark: false }), activeSummon && /* @__PURE__ */ React.createElement(
    PolyphonieSheet,
    {
      summon: activeSummon,
      onClose: () => setActiveSummon(null),
      onFeedback: () => {
      }
    }
  ));
}
function SummonLoadingModal({ dark = false }) {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const messages = [
    "les kairos r\xE9sonnent\u2026",
    "\xE9couter ce qui revient\u2026",
    "tisser les voix\u2026"
  ];
  const message = useRotating ? useRotating(messages, 2400) : messages[0];
  const overlayBg = dark ? "color-mix(in oklch, var(--night-floor) 78%, transparent)" : "color-mix(in oklch, var(--day-paper) 88%, var(--day-shadow, transparent))";
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
    background: overlayBg,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--s-5)"
  } }, /* @__PURE__ */ React.createElement("div", { className: "dream-skeleton-fade-in", style: {
    maxWidth: 460,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: "28px 24px",
    background: dark ? "color-mix(in oklch, var(--night-warm) 70%, var(--night-floor))" : "color-mix(in oklch, var(--day-linen, #DFD3BF) 35%, var(--day-paper, #EBE2D2))",
    border: "1px solid " + (dark ? "color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))" : "color-mix(in oklch, var(--day-clay-warm, #C9B098) 35%, transparent)")
  } }, Halo ? /* @__PURE__ */ React.createElement(Halo, { size: 32, message: null, dark }) : /* @__PURE__ */ React.createElement("div", { style: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid " + (dark ? "var(--silk-gold)" : "var(--day-clay-warm)"),
    animation: "halo-slow 2.5s ease-in-out infinite",
    alignSelf: "center"
  } }), Shim && /* @__PURE__ */ React.createElement(Shim, { lines: 5, height: 12, gap: 12, dark, lastLineWidth: "62%" }), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: dark ? "var(--ash-light)" : "var(--day-bone-warm, #9F8E7C)",
    textAlign: "center",
    textWrap: "pretty",
    opacity: 0.9
  } }, message)));
}
window.SummonLoadingModal = SummonLoadingModal;
function relativeDateJour(iso) {
  if (!iso) return "r\xE9cemment";
  const now = Date.now();
  const t = new Date(iso).getTime();
  const dh = (now - t) / 36e5;
  if (dh < 1) return "\xE0 l'instant";
  if (dh < 12) return "ce matin";
  if (dh < 24) return "aujourd'hui";
  if (dh < 36) return "hier soir";
  if (dh < 48) return "hier";
  if (dh < 24 * 7) return "il y a " + Math.floor(dh / 24) + " jours";
  if (dh < 24 * 30) return "il y a " + Math.floor(dh / (24 * 7)) + " semaine(s)";
  if (dh < 24 * 60) return "il y a une lune";
  if (dh < 24 * 90) return "il y a deux lunes";
  return "il y a plusieurs lunes";
}
const RELATIONS_SUBS = [
  ["all", "toutes"],
  ["amour", "amour"],
  ["famille", "famille"],
  ["amis", "amis"],
  ["collegues", "coll\xE8gues"],
  ["rencontres", "rencontres"]
];
function JournalSectionDrillDown({ go, section }) {
  const safeSection = section || { category: "travail", label: "section", glyph: "\u25C7", count: 0 };
  const isRelations = safeSection.category === "relations";
  const [entries, setEntries] = jS([]);
  const [loading, setLoading] = jS(true);
  const [activeSub, setActiveSub] = jS("all");
  const [activeSummon, setActiveSummon] = jS(null);
  const [summonLoading, setSummonLoading] = jS(false);
  const refreshEntries = jCB(async () => {
    setLoading(true);
    try {
      const params = { category: safeSection.category, limit: 100 };
      if (isRelations && activeSub !== "all") params.sub_category = activeSub;
      const r = await window.DreamAPI.listJournalEntries(params);
      setEntries((r == null ? void 0 : r.entries) || []);
    } catch (e) {
      console.warn("[JournalSectionDrillDown] refresh failed:", e.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [safeSection.category, isRelations, activeSub]);
  jE(() => {
    refreshEntries();
  }, [refreshEntries]);
  const goCaptureFromEntry = (entry) => {
    try {
      window.__dreamCaptureLinkedHint = {
        from_journal_entry_id: entry.id,
        from_journal_text: entry.raw_text,
        from_category: safeSection.category,
        createdAt: Date.now()
      };
    } catch (e) {
    }
    go("capture");
  };
  return /* @__PURE__ */ React.createElement("div", { style: dayStyle({
    minHeight: "100vh",
    paddingBottom: 100
  }) }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid color-mix(in oklch, var(--day-clay-warm) 30%, transparent)"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("home"),
      "aria-label": "retour au journal",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--day-ash-soft)",
        fontSize: 13,
        fontStyle: "italic",
        fontFamily: "var(--serif)",
        padding: "4px 0"
      }
    },
    "\u2190 journal"
  ), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--day-ash-soft)"
  } }, entries.length > 0 ? `${entries.length} entr\xE9e${entries.length > 1 ? "s" : ""}` : "")), /* @__PURE__ */ React.createElement("div", { style: { padding: "24px 24px 12px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 28, color: "var(--day-clay-warm)" } }, safeSection.glyph), /* @__PURE__ */ React.createElement("h2", { style: {
    margin: 0,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 26,
    color: "var(--day-bone-warm)",
    fontWeight: 400,
    letterSpacing: "0.01em"
  } }, safeSection.label))), /* @__PURE__ */ React.createElement("div", { style: {
    padding: "8px 24px 20px",
    display: "flex",
    alignItems: "center",
    gap: 12
  } }, window.SummonButton && /* @__PURE__ */ React.createElement(
    window.SummonButton,
    {
      category: safeSection.category,
      sub_category: isRelations && activeSub !== "all" ? activeSub : null,
      onSummonStart: () => setSummonLoading(true),
      onSummonDone: (r) => {
        setSummonLoading(false);
        setActiveSummon(r);
      }
    }
  ), /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--day-bone-warm)",
    letterSpacing: "0.01em"
  } }, "appel \xE0 la sagesse des kairos sur cette section")), isRelations && /* @__PURE__ */ React.createElement("div", { style: {
    padding: "0 24px 16px",
    display: "flex",
    flexWrap: "wrap",
    gap: 8
  } }, RELATIONS_SUBS.map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      onClick: () => setActiveSub(k),
      style: {
        background: activeSub === k ? "var(--day-clay-warm)" : "transparent",
        color: activeSub === k ? "var(--day-paper)" : "var(--day-bone-warm)",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 50%, transparent)",
        padding: "6px 14px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        cursor: "pointer",
        borderRadius: 999,
        transition: "all 280ms ease"
      }
    },
    l
  ))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 24px 24px" } }, loading ? /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--day-ash-soft)",
    padding: "40px 0",
    textAlign: "center"
  } }, "les entr\xE9es s'\xE9veillent\u2026") : entries.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    color: "var(--day-ash-soft)",
    padding: "40px 0",
    textAlign: "center",
    lineHeight: 1.6,
    textWrap: "pretty"
  } }, "cette section ne tient encore rien.", /* @__PURE__ */ React.createElement("br", null), "d\xE9pose une note depuis l'accueil pour commencer.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, entries.map((e) => /* @__PURE__ */ React.createElement(
    "article",
    {
      key: e.id,
      style: {
        background: "var(--day-linen)",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 18%, transparent)",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline"
    } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 12,
      color: "var(--day-ash-soft)"
    } }, relativeDateJour(e.created_at)), e.sub_category && /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.1em",
      color: "var(--day-clay-warm)",
      textTransform: "uppercase"
    } }, e.sub_category)),
    /* @__PURE__ */ React.createElement("p", { style: {
      margin: 0,
      fontFamily: "var(--serif)",
      fontSize: 16,
      lineHeight: 1.6,
      color: "var(--day-bone-warm)",
      fontStyle: "italic",
      textWrap: "pretty"
    } }, e.raw_text),
    e.linked_kairos_id && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 11,
      color: "var(--day-clay-warm)",
      letterSpacing: "0.02em",
      display: "flex",
      alignItems: "center",
      gap: 6
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12 } }, "\u263E"), "reli\xE9 \xE0 un kairos"),
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
      gap: 12
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => goCaptureFromEntry(e),
        style: {
          background: "transparent",
          border: "1px solid color-mix(in oklch, var(--day-bone-warm) 30%, transparent)",
          color: "var(--day-bone-warm)",
          padding: "6px 12px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 12,
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 280ms ease"
        },
        onMouseEnter: (ev) => ev.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, transparent)",
        onMouseLeave: (ev) => ev.currentTarget.style.background = "transparent"
      },
      "d\xE9poser un kairos li\xE9"
    ), window.SummonButton && /* @__PURE__ */ React.createElement(
      window.SummonButton,
      {
        entry_id: e.id,
        onSummonStart: () => setSummonLoading(true),
        onSummonDone: (r) => {
          setSummonLoading(false);
          setActiveSummon(r);
        }
      }
    ))
  )))), summonLoading && /* @__PURE__ */ React.createElement(SummonLoadingModal, { dark: false }), activeSummon && window.PolyphonieSheet && /* @__PURE__ */ React.createElement(
    window.PolyphonieSheet,
    {
      summon: activeSummon,
      onClose: () => setActiveSummon(null),
      onFeedback: () => {
      }
    }
  ));
}
window.JournalDeVieJour = JournalDeVieJour;
window.SummonButton = SummonButton;
window.PolyphonieSheet = PolyphonieSheet;
window.JournalSectionDrillDown = JournalSectionDrillDown;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1qb3VybmFsLWpvdXIuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiBnbG9iYWwgUmVhY3QgKi9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRHJlYW0gVjEuMiBcdTIwMTQgSm91cm5hbCBkZSBWaWUgTFVNSU5FVVggKHJcdTAwRTl2XHUwMEU5bGF0aW9uIFRpbSAyMDI2LTA0LTI1KVxuLy8gQmlibGUgXHUwMEE3My4xLmJpcyArIFx1MDBBNzMuMS50ZXIgXHUyMDE0IExlIFNVQlNUUkFUIGNlbnRyYWwgZGUgbCdhcHAsIGVuIG1vZGUgSk9VUi5cbi8vIERlc2lnbiBcdTAwQTc3LjEgcmVmb250ZSAyMDI2LTA0LTI1LlxuLy9cbi8vIFBhdHRlcm5zIGRvbWluYW50cyA6XG4vLyAgIC0gSk9VUk5BTF9ERV9WSUVfU1VCU1RSQVQgKGNlbnRyZSBhcmNoaXRlY3R1cmFsKVxuLy8gICAtIEpPVVJOQUxfREFZX0RBU0hCT0FSRCAocGFsZXR0ZSBKT1VSIHZzIHJlc3RlIGRlIGwnYXBwIE5VSVQpXG4vLyAgIC0gS0FJUk9TX1dJU0RPTV9TVU1NT04gKGJvdXRvbiBcImFwcGVsIHNhZ2Vzc2UgZGVzIGthaXJvc1wiKVxuLy8gICAtIEFVVE9fQ0FURUdPUklaQVRJT04gKFNvbm5ldCByb3V0ZSBlbiBzaWxlbmNlKVxuLy9cbi8vIEwnXHUwMEU5Y3JhbiBlc3QgbCdcdTAwRTljcmFuIGQnYWNjdWVpbCBwYXIgZFx1MDBFOWZhdXQuIEludmVyc2lvbiBvbnRvbG9naXF1ZSA6XG4vLyBwYXBpZXIgcGF0aW5cdTAwRTkgY2hhdWQsIHBhcyBkZSBkYXJrLWZpcnN0LiBMZSB1c2VyIHZpdCBsZSBKT1VSIGljaSxcbi8vIGxlcyBrYWlyb3MgY2hhbnRlbnQgZGVwdWlzIGxhIE5VSVQgKGxlIHJlc3RlIGRlIGwnYXBwKS5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiBqUywgdXNlRWZmZWN0OiBqRSwgdXNlUmVmOiBqUiwgdXNlQ2FsbGJhY2s6IGpDQiB9ID0gUmVhY3Q7XG5cbi8vIFx1MjUwMFx1MjUwMCBQYWxldHRlIEpPVVIgKERlc2lnbiBcdTAwQTc1IGFqb3V0IDIwMjYtMDQtMjUpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgREFZX1ZBUlMgPSB7XG4gIFwiLS1kYXktcGFwZXJcIjogXCJva2xjaCgwLjkyIDAuMDE4IDc1KVwiLFxuICBcIi0tZGF5LWxpbmVuXCI6IFwib2tsY2goMC44OCAwLjAyMiA3MClcIixcbiAgXCItLWRheS1jbGF5LXdhcm1cIjogXCJva2xjaCgwLjc4IDAuMDQ1IDYwKVwiLFxuICBcIi0tZGF5LWJvbmUtd2FybVwiOiBcIm9rbGNoKDAuNjUgMC4wMjUgNjUpXCIsXG4gIFwiLS1kYXktYXNoLXNvZnRcIjogXCJva2xjaCgwLjUwIDAuMDE1IDY1KVwiLFxuICBcIi0tZGF5LXN1bi1sb3dcIjogXCJva2xjaCgwLjcyIDAuMDkwIDc1KVwiLFxuICBcIi0tZGF5LXNoYWRvd1wiOiBcIm9rbGNoKDAuNDAgMC4wMjAgMjgwKVwiLFxufTtcblxuY29uc3QgZGF5U3R5bGUgPSAoZXh0cmEgPSB7fSkgPT4gKHtcbiAgYmFja2dyb3VuZDogXCJ2YXIoLS1kYXktcGFwZXIpXCIsXG4gIGNvbG9yOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsXG4gIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gIC4uLkRBWV9WQVJTLFxuICAuLi5leHRyYSxcbn0pO1xuXG4vLyBcdTI1MDBcdTI1MDAgSGVhZGVyIGx1bWluZXV4IChsdW5lIGVuIGhhdXQtZHJvaXQgcG91ciBwYXNzZXIgTlVJVCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyAyMDI2LTA0LTI1IHYyIDogYWpvdXQgYWNjXHUwMEU4cyBkaXJlY3QgXCJ0ZXMga2Fpcm9zXCIgKEpvdXJuYWwgZGUgbGEgbnVpdCA9IGxpc3RlXG4vLyBkZXMga2Fpcm9zIGRcdTAwRTlwb3NcdTAwRTlzIGZpbHRyYWJsZSBwYXIgdHlwZSkgcXVpIFx1MDBFOXRhaXQgZGV2ZW51IGludmlzaWJsZSBhcHJcdTAwRThzIHJlZm9udGUuXG5mdW5jdGlvbiBKb3VySGVhZGVyKHsgZ28sIGx1bmVQaGFzZSA9IFwibHVuZSBkXHUwMEU5Y3JvaXNzYW50ZVwiIH0pIHtcbiAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImZyLUZSXCIsIHtcbiAgICB3ZWVrZGF5OiBcImxvbmdcIiwgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiLFxuICB9KTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgcGFkZGluZzogXCIxNnB4IDI0cHhcIiwgYm9yZGVyQm90dG9tOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDMwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgfX0+XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYXNoLXNvZnQpXCIsIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICB9fT5cbiAgICAgICAge3RvZGF5fSBcdTAwQjcge2x1bmVQaGFzZX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiA0IH19PlxuICAgICAgICB7LyogMjAyNi0wNC0yNiBcdTIwMTQgQWNjXHUwMEU4cyBQb3J0cmFpdCBkZXB1aXMgVmllIChCK0QgXHUwMEE3MTEuYmlzLjQgOiBQb3J0cmFpdFxuICAgICAgICAgICAgbidlc3QgcGx1cyBlbiBib3R0b20tbmF2LCBhY2Nlc3NpYmxlIHZpYSBWaWUpICovfVxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKFwicG9ydHJhaXRcIil9XG4gICAgICAgICAgdGl0bGU9XCJ0YSBsZXR0cmUgZHUgbW9tZW50XCJcbiAgICAgICAgICBhcmlhLWxhYmVsPVwidm9pciBtb24gcG9ydHJhaXRcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSkgMzUlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTAwLFxuICAgICAgICAgICAgcGFkZGluZzogXCI1cHggMTJweCA1cHggMTBweFwiLFxuICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjg1LFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiA1LFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGVhc2VcIixcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMTsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSkgOCUsIHRyYW5zcGFyZW50KVwiOyB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiB7IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC44NTsgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcInRyYW5zcGFyZW50XCI7IH19PlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAxMyB9fT5cdTI3Mzc8L3NwYW4+XG4gICAgICAgICAgPHNwYW4+bW9uIHBvcnRyYWl0PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgey8qIDIwMjYtMDQtMjYgKHNvaXIpIFx1MjAxNCByZWZvbnRlIHBvcnRlIFJcdTAwQ0FWRSA6IGNlIGJvdXRvbiBkZXZpZW50IFwicmV0b3VyIFx1MDBFMCBEcmVhbVwiXG4gICAgICAgICAgICAoaWNcdTAwRjRuZSBcdTI2M0UpLiBDJ1x1MDBFOXRhaXQgYXVwYXJhdmFudCBcInRlcyBrYWlyb3NcIiBcdTIxOTIgL2pvdXJuYWwgOyBsZSBkcmlsbC1kb3duIGthaXJvc1xuICAgICAgICAgICAgcmVzdGUgYWNjZXNzaWJsZSB2aWEgbW9uIHBvcnRyYWl0ICsgam91cm5hbCBlbnRyaWVzIChzb3VzLXBhZ2VzKS4gKi99XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJob21lXCIpfVxuICAgICAgICAgIHRpdGxlPVwicmV0b3VyIFx1MDBFMCBEcmVhbSBcdTIwMTQgbCdcdTAwRTljcmFuIGQnYWNjdWVpbCByXHUwMEVBdmVcIlxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJyZXRvdXIgXHUwMEUwIERyZWFtXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDM1JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDEwMCxcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiNXB4IDEycHggNXB4IDEwcHhcIixcbiAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYm9uZS13YXJtKVwiLFxuICAgICAgICAgICAgb3BhY2l0eTogMC44NSxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGdhcDogNSxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBlYXNlXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDglLCB0cmFuc3BhcmVudClcIjsgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuODU7IGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJ0cmFuc3BhcmVudFwiOyB9fT5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+XHUyNjNFPC9zcGFuPlxuICAgICAgICAgIDxzcGFuPnJldG91ciBcdTAwRTAgRHJlYW08L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICB7LyogVnVlIGNvbnRlbXBsYXRpdmUgKGFuY2llbiBIb21lIFYxLjIgXHUyMDE0IDEgclx1MDBFQXZlIGVuIGdyYW5kKSBcdTIwMTQgcmVzdGUgc3ViLWFjdGlvbiBkaXNjclx1MDBFOHRlICovfVxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKFwiaG9tZS1udWl0XCIpfVxuICAgICAgICAgIHRpdGxlPVwidnVlIGNvbnRlbXBsYXRpdmUgKHVuIHNldWwga2Fpcm9zKVwiXG4gICAgICAgICAgYXJpYS1sYWJlbD1cInZ1ZSBjb250ZW1wbGF0aXZlXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE4LCBwYWRkaW5nOiBcIjVweCA4cHhcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1zaGFkb3cpXCIsIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwib3BhY2l0eSAzODBtcyBlYXNlXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxfVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNX0+XG4gICAgICAgICAgXHUyNUNDXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDaGFtcCBkZSBkXHUwMEU5cFx1MDBGNHQgbGlicmUgKGdlc3RlIGNlbnRyYWwpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gRGVwb3NlckxpYnJlKHsgb25EZXBvc2UgfSkge1xuICBjb25zdCBbdGV4dCwgc2V0VGV4dF0gPSBqUyhcIlwiKTtcbiAgY29uc3QgW3NlbmRpbmcsIHNldFNlbmRpbmddID0galMoZmFsc2UpO1xuICBjb25zdCBbcmVjb3JkaW5nLCBzZXRSZWNvcmRpbmddID0galMoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGpTKG51bGwpO1xuICBjb25zdCBbc3VjY2Vzcywgc2V0U3VjY2Vzc10gPSBqUyhmYWxzZSk7XG4gIGNvbnN0IFtsaW5rZWRIaW50LCBzZXRMaW5rZWRIaW50XSA9IGpTKG51bGwpO1xuICBjb25zdCB0YVJlZiA9IGpSKG51bGwpO1xuICBjb25zdCBtZWRpYVJlZiA9IGpSKG51bGwpO1xuICBjb25zdCBjaHVua3NSZWYgPSBqUihbXSk7XG5cbiAgY29uc3QgUExBQ0VIT0xERVJTID0gW1xuICAgIFwiUXVlIHZpcy10dSwgbFx1MDBFMCwgbWFpbnRlbmFudCA/XCIsXG4gICAgXCJRdSdlc3QtY2UgcXVpIHNlIGRlbWFuZGUgYXVqb3VyZCdodWkgP1wiLFxuICAgIFwiUXUnZXN0LWNlIHF1aSB0ZSB0cmF2ZXJzZSA/XCIsXG4gICAgXCJRdWUgdmV1eC10dSBkXHUwMEU5cG9zZXIgZGFucyBsZSBqb3VybmFsID9cIixcbiAgICBcIlVuIGRvdXRlLCB1bmUgam9pZSwgdW5lIHF1ZXN0aW9uLCB1biBjb25mbGl0ID9cIixcbiAgXTtcbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBQTEFDRUhPTERFUlNbTWF0aC5mbG9vcihEYXRlLm5vdygpIC8gODY0MDAwMDApICUgUExBQ0VIT0xERVJTLmxlbmd0aF07XG5cbiAgLy8gMjAyNi0wNC0yNSBcdTIwMTQgQ29uc3VtZSBfX2RyZWFtSm91cm5hbExpbmtlZEhpbnQgKHNldCBieSBDYXB0dXJlIFJJVFVBTF9MQVRFTkNZKVxuICAvLyBQclx1MDBFOS1yZW1wbGlzc2FnZSBjb250ZXh0dWVsIHF1YW5kIGwndXNlciB2aWVudCBkZSBkXHUwMEU5cG9zZXIgdW4ga2Fpcm9zXG4gIC8vIGV0IGNob2lzaXQgXCJkXHUwMEU5cG9zZXIgdW5lIG5vdGUgZGUgSm91cm5hbCBkZSBWaWUgbGlcdTAwRTllXCJcbiAgakUoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBoaW50ID0gd2luZG93Ll9fZHJlYW1Kb3VybmFsTGlua2VkSGludDtcbiAgICAgIGlmIChoaW50ICYmIERhdGUubm93KCkgLSBoaW50LmNyZWF0ZWRBdCA8IDUgKiA2MCAqIDEwMDApIHtcbiAgICAgICAgc2V0TGlua2VkSGludChoaW50KTtcbiAgICAgICAgLy8gUHJcdTAwRTktcmVtcGxpciBsZSBjaGFtcCBhdmVjIHVuIHByb21wdCBjb250ZXh0dWVsIGRvdXhcbiAgICAgICAgY29uc3Qgc25pcHBldCA9IChoaW50LnNvdXJjZV90ZXh0IHx8IFwiXCIpLnNsaWNlKDAsIDgwKTtcbiAgICAgICAgY29uc3QgZWxsaXBzaXMgPSAoaGludC5zb3VyY2VfdGV4dCB8fCBcIlwiKS5sZW5ndGggPiA4MCA/IFwiXHUyMDI2XCIgOiBcIlwiO1xuICAgICAgICBzZXRUZXh0KGBFbiBcdTAwRTljaG8gYXUga2Fpcm9zIGRcdTAwRTlwb3NcdTAwRTkgKFx1MDBBQlxcdTAwYTAke3NuaXBwZXR9JHtlbGxpcHNpc31cXHUwMGEwXHUwMEJCKSwgamUgbm90ZSBpY2kgZGFucyBtYSB2aWUgZGUgam91ciA6IGApO1xuICAgICAgICAvLyBGb2N1cyBsJ2lucHV0IGFwclx1MDBFOHMgbW91bnRcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgaWYgKHRhUmVmLmN1cnJlbnQpIHtcbiAgICAgICAgICAgIHRhUmVmLmN1cnJlbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIHRhUmVmLmN1cnJlbnQuc2V0U2VsZWN0aW9uUmFuZ2UodGFSZWYuY3VycmVudC52YWx1ZS5sZW5ndGgsIHRhUmVmLmN1cnJlbnQudmFsdWUubGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDEwMCk7XG4gICAgICAgIC8vIENvbnN1bWUgdGhlIGhpbnQgKG9uZS1zaG90KVxuICAgICAgICB0cnkgeyBkZWxldGUgd2luZG93Ll9fZHJlYW1Kb3VybmFsTGlua2VkSGludDsgfSBjYXRjaCB7fVxuICAgICAgfVxuICAgIH0gY2F0Y2gge31cbiAgfSwgW10pO1xuXG4gIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAodGV4dC50cmltKCkubGVuZ3RoIDwgMSkgcmV0dXJuO1xuICAgIC8vIDIwMjYtMDQtMjcgUDEuNCBcdTIwMTQgT3B0aW1pc3RpYyBVSSA6IGZlZWRiYWNrIGltbVx1MDBFOWRpYXQgKHN1Y2Nlc3Mgc3RhdGUpLFxuICAgIC8vIHB1c2ggQVBJIGVuIGJhY2tncm91bmQsIHRyYWNrIHN5bmMgdmlhIGRyZWFtU3luY0JlZ2luL0VuZC5cbiAgICBjb25zdCB0cmltbWVkID0gdGV4dC50cmltKCk7XG4gICAgY29uc3QgbGlua2VkSWQgPSBsaW5rZWRIaW50Py5saW5rZWRfa2Fpcm9zX2lkIHx8IG51bGw7XG4gICAgc2V0U2VuZGluZyh0cnVlKTsgc2V0RXJyb3IobnVsbCk7XG4gICAgc2V0U3VjY2Vzcyh0cnVlKTtcbiAgICBzZXRUZXh0KFwiXCIpO1xuICAgIHNldExpbmtlZEhpbnQobnVsbCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiBzZXRTdWNjZXNzKGZhbHNlKSwgMjUwMCk7XG5cbiAgICBjb25zdCBzeW5jSWQgPSB3aW5kb3cuZHJlYW1TeW5jQmVnaW4gPyB3aW5kb3cuZHJlYW1TeW5jQmVnaW4oXCJjcmVhdGVKb3VybmFsRW50cnlcIikgOiBudWxsO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLmNyZWF0ZUpvdXJuYWxFbnRyeSh7XG4gICAgICAgIHJhd190ZXh0OiB0cmltbWVkLFxuICAgICAgICBsaW5rZWRfa2Fpcm9zX2lkOiBsaW5rZWRJZCxcbiAgICAgIH0pO1xuICAgICAgaWYgKHI/LmVudHJ5Py5pZCkge1xuICAgICAgICBpZiAob25EZXBvc2UpIG9uRGVwb3NlKHIuZW50cnkpO1xuICAgICAgICBpZiAod2luZG93LmRyZWFtU3luY0VuZCkgd2luZG93LmRyZWFtU3luY0VuZChzeW5jSWQpO1xuICAgICAgfSBlbHNlIGlmIChyPy5lcnJvcikge1xuICAgICAgICBzZXRFcnJvcihyLmVycm9yKTtcbiAgICAgICAgaWYgKHdpbmRvdy5kcmVhbVN5bmNFbmQpIHdpbmRvdy5kcmVhbVN5bmNFbmQoc3luY0lkLCB7IGVycm9yOiByLmVycm9yIH0pO1xuICAgICAgICB0cnkgeyB3aW5kb3cuZHJlYW1TaG93VG9hc3Q/Lih7XG4gICAgICAgICAgdGV4dDogXCJsZSBkXHUwMEU5cFx1MDBGNHQgbidhIHBhcyBhdHRlaW50IGwnYXBwLCByZXZpZW5zIGRhbnMgdW4gaW5zdGFudFwiLFxuICAgICAgICAgIHRvbmU6IFwiZXJyb3JcIiwgZHVyYXRpb246IDUwMDAsXG4gICAgICAgIH0pOyB9IGNhdGNoIHt9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IoXCJEXHUwMEU5cFx1MDBGNHQgXHUwMEU5Y2hvdVx1MDBFOSA6IFwiICsgZS5tZXNzYWdlKTtcbiAgICAgIGlmICh3aW5kb3cuZHJlYW1TeW5jRW5kKSB3aW5kb3cuZHJlYW1TeW5jRW5kKHN5bmNJZCwgeyBlcnJvcjogZS5tZXNzYWdlIH0pO1xuICAgICAgdHJ5IHsgd2luZG93LmRyZWFtU2hvd1RvYXN0Py4oe1xuICAgICAgICB0ZXh0OiBcImxlIGRcdTAwRTlwXHUwMEY0dCBuJ2EgcGFzIGF0dGVpbnQgbCdhcHAsIHJldmllbnMgZGFucyB1biBpbnN0YW50XCIsXG4gICAgICAgIHRvbmU6IFwiZXJyb3JcIiwgZHVyYXRpb246IDUwMDAsXG4gICAgICB9KTsgfSBjYXRjaCB7fVxuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRTZW5kaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gVm9pY2UgcmVjb3JkaW5nIChzaW1wbGUgXHUyMDE0IGZ1bGwgd2VibS9tcDQgZmFsbGJhY2spXG4gIGNvbnN0IHBpY2tNaW1lID0gKCkgPT4ge1xuICAgIGlmICh0eXBlb2YgTWVkaWFSZWNvcmRlciA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IFtcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcIixcImF1ZGlvL3dlYm1cIixcImF1ZGlvL21wNFwiLFwiYXVkaW8vYWFjXCIsXCJhdWRpby9vZ2dcIl07XG4gICAgZm9yIChjb25zdCB0IG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgIHRyeSB7IGlmIChNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCAmJiBNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCh0KSkgcmV0dXJuIHQ7IH0gY2F0Y2gge31cbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG4gIH07XG4gIGNvbnN0IHN0YXJ0UmVjID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzdHJlYW0gPSBhd2FpdCBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0pO1xuICAgICAgY29uc3QgbWltZSA9IHBpY2tNaW1lKCk7XG4gICAgICBjb25zdCBtciA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgbWltZSA/IHsgbWltZVR5cGU6IG1pbWUgfSA6IHt9KTtcbiAgICAgIGNvbnN0IGFjdHVhbCA9IG1yLm1pbWVUeXBlIHx8IG1pbWUgfHwgXCJhdWRpby93ZWJtXCI7XG4gICAgICBjaHVua3NSZWYuY3VycmVudCA9IFtdO1xuICAgICAgbXIub25kYXRhYXZhaWxhYmxlID0gZSA9PiB7IGlmIChlLmRhdGEuc2l6ZSA+IDApIGNodW5rc1JlZi5jdXJyZW50LnB1c2goZS5kYXRhKTsgfTtcbiAgICAgIG1yLm9uc3RvcCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godCA9PiB0LnN0b3AoKSk7XG4gICAgICAgIGNvbnN0IGJsb2IgPSBuZXcgQmxvYihjaHVua3NSZWYuY3VycmVudCwgeyB0eXBlOiBhY3R1YWwgfSk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgciA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS50cmFuc2NyaWJlKGJsb2IsIGFjdHVhbCk7XG4gICAgICAgICAgaWYgKHI/LnRleHQpIHNldFRleHQocCA9PiAocCA/IHAgKyBcIlxcblxcblwiIDogXCJcIikgKyByLnRleHQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7IHNldEVycm9yKFwiVHJhbnNjcmlwdGlvbiA6IFwiICsgZS5tZXNzYWdlKTsgfVxuICAgICAgfTtcbiAgICAgIG1lZGlhUmVmLmN1cnJlbnQgPSBtcjsgbXIuc3RhcnQoKTsgc2V0UmVjb3JkaW5nKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHsgc2V0RXJyb3IoXCJNaWNybyBpbmFjY2Vzc2libGUgOiBcIiArIGUubWVzc2FnZSk7IH1cbiAgfTtcbiAgY29uc3Qgc3RvcFJlYyA9ICgpID0+IHtcbiAgICBpZiAobWVkaWFSZWYuY3VycmVudCAmJiBtZWRpYVJlZi5jdXJyZW50LnN0YXRlICE9PSBcImluYWN0aXZlXCIpIG1lZGlhUmVmLmN1cnJlbnQuc3RvcCgpO1xuICAgIHNldFJlY29yZGluZyhmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwYWRkaW5nOiBcIjMycHggMjRweFwiLFxuICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1kYXktcGFwZXIpXCIsXG4gICAgfX0+XG4gICAgICB7bGlua2VkSGludCAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IDEyLFxuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1jbGF5LXdhcm0pXCIsIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGdhcDogOCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDE0IH19Plx1MjYzRTwvc3Bhbj5cbiAgICAgICAgICBub3RlIGRlIGpvdXIgcmVsaVx1MDBFOWUgXHUwMEUwIHVuIGthaXJvcyBkXHUwMEU5cG9zXHUwMEU5XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRMaW5rZWRIaW50KG51bGwpOyBzZXRUZXh0KFwiXCIpOyB9fVxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cImRcdTAwRTl0YWNoZXJcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYXNoLXNvZnQpXCIsIGZvbnRTaXplOiAxMiwgbWFyZ2luTGVmdDogXCJhdXRvXCIsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgZFx1MDBFOXRhY2hlclxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8dGV4dGFyZWFcbiAgICAgICAgcmVmPXt0YVJlZn1cbiAgICAgICAgdmFsdWU9e3RleHR9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHsgc2V0VGV4dChlLnRhcmdldC52YWx1ZSk7IHNldEVycm9yKG51bGwpOyB9fVxuICAgICAgICBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXJ9XG4gICAgICAgIGRpc2FibGVkPXtzZW5kaW5nfVxuICAgICAgICByb3dzPXs0fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICBtaW5IZWlnaHQ6IDEyMCxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLWRheS1saW5lbilcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSkgMjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDQsXG4gICAgICAgICAgcGFkZGluZzogXCIyMHB4IDI0cHhcIixcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICBmb250U2l6ZTogMTgsXG4gICAgICAgICAgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsXG4gICAgICAgICAgb3V0bGluZTogXCJub25lXCIsXG4gICAgICAgICAgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgYm94U2l6aW5nOiBcImJvcmRlci1ib3hcIixcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgbWFyZ2luVG9wOiA4LCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtzdWNjZXNzICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1jbGF5LXdhcm0pXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgIG1hcmdpblRvcDogOCwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgZFx1MDBFOXBvc1x1MDBFOS4gbCdhcHAgcmFuZ2UgZW4gc2lsZW5jZS5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICBtYXJnaW5Ub3A6IDE0LFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtyZWNvcmRpbmcgPyBzdG9wUmVjIDogc3RhcnRSZWN9XG4gICAgICAgICAgYXJpYS1sYWJlbD17cmVjb3JkaW5nID8gXCJhcnJcdTAwRUF0ZXIgbCdlbnJlZ2lzdHJlbWVudFwiIDogXCJkXHUwMEU5cG9zZXIgZW4gdm9peFwifVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWRheS1ib25lLXdhcm0pXCIsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgICAgICB3aWR0aDogNDAsIGhlaWdodDogNDAsXG4gICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgY29sb3I6IHJlY29yZGluZyA/IFwidmFyKC0tZW1iZXItbGl2ZSlcIiA6IFwidmFyKC0tZGF5LWJvbmUtd2FybSlcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNyxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7cmVjb3JkaW5nID8gXCJcdTI1QTBcIiA6IFwiXHVEODNDXHVERjk5XCJ9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17c3VibWl0fVxuICAgICAgICAgIGRpc2FibGVkPXtzZW5kaW5nIHx8IHRleHQudHJpbSgpLmxlbmd0aCA8IDF9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1wYXBlcilcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjEycHggMjhweFwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICBjdXJzb3I6IHNlbmRpbmcgfHwgdGV4dC50cmltKCkubGVuZ3RoIDwgMSA/IFwibm90LWFsbG93ZWRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgb3BhY2l0eTogc2VuZGluZyB8fCB0ZXh0LnRyaW0oKS5sZW5ndGggPCAxID8gMC40IDogMSxcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGVhc2VcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7c2VuZGluZyA/IFwiXHUyMDI2XCIgOiBcImRcdTAwRTlwb3NlclwifVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgU2VjdGlvbiBjYXJkIChjYXRcdTAwRTlnb3JpZSBkZSB2aWUpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gU2VjdGlvbkNhcmQoeyBzZWN0aW9uLCBvbk9wZW4gfSkge1xuICBjb25zdCBlbXB0eSA9IHNlY3Rpb24uY291bnQgPT09IDA7XG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgb25DbGljaz17KCkgPT4gb25PcGVuKHNlY3Rpb24pfVxuICAgICAgZGlzYWJsZWQ9e2VtcHR5fVxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDogZW1wdHkgPyBcInRyYW5zcGFyZW50XCIgOiBcInZhcigtLWRheS1saW5lbilcIixcbiAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDIwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgIHBhZGRpbmc6IFwiMThweCAyMHB4XCIsXG4gICAgICAgIHRleHRBbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgIGN1cnNvcjogZW1wdHkgPyBcImRlZmF1bHRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYm9uZS13YXJtKVwiLFxuICAgICAgICBvcGFjaXR5OiBlbXB0eSA/IDAuNDUgOiAxLFxuICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBlYXNlXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLFxuICAgICAgICBnYXA6IDYsXG4gICAgICB9fVxuICAgICAgb25Nb3VzZUVudGVyPXtlID0+IHsgaWYgKCFlbXB0eSkgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSkgOCUsIHZhcigtLWRheS1saW5lbikpXCI7IH19XG4gICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBpZiAoIWVtcHR5KSBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwidmFyKC0tZGF5LWxpbmVuKVwiOyB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJiYXNlbGluZVwiIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImJhc2VsaW5lXCIsIGdhcDogOCB9fT5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogMTgsIGNvbG9yOiBcInZhcigtLWRheS1jbGF5LXdhcm0pXCIgfX0+e3NlY3Rpb24uZ2x5cGh9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAxNiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PntzZWN0aW9uLmxhYmVsfTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtzZWN0aW9uLmNvdW50ID4gMCAmJiAoXG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDEyLCBjb2xvcjogXCJ2YXIoLS1kYXktYXNoLXNvZnQpXCIsIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiB9fT5cbiAgICAgICAgICAgIFx1MjI0OHtzZWN0aW9uLmNvdW50ID4gNTAgPyBcIjUwK1wiIDogc2VjdGlvbi5jb3VudH1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICAgIHtzZWN0aW9uLmxhc3RfZW50cnkgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udFNpemU6IDEzLCBjb2xvcjogXCJ2YXIoLS1kYXktYXNoLXNvZnQpXCIsIGxpbmVIZWlnaHQ6IDEuNSxcbiAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1hcmdpblRvcDogNCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgXCJ7c2VjdGlvbi5sYXN0X2VudHJ5LnJhd190ZXh0fVwiXG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIHtlbXB0eSAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udFNpemU6IDEyLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGNvbG9yOiBcInZhcigtLWRheS1hc2gtc29mdClcIiB9fT5cbiAgICAgICAgICBlbmNvcmUgdmlkZVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9idXR0b24+XG4gICk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNb2RhbCBQb2x5cGhvbmllIChyXHUwMEU5c3VsdGF0IGFwcGVsIHNhZ2Vzc2UpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gUG9seXBob25pZVNoZWV0KHsgc3VtbW9uLCBvbkNsb3NlLCBvbkZlZWRiYWNrIH0pIHtcbiAgY29uc3QgW2ZlbHRTaGlmdCwgc2V0RmVsdFNoaWZ0XSA9IGpTKG51bGwpO1xuICBjb25zdCBbYWhhTGV2ZWwsIHNldEFoYUxldmVsXSA9IGpTKG51bGwpO1xuICBjb25zdCBbYWhhTm90ZSwgc2V0QWhhTm90ZV0gPSBqUyhcIlwiKTtcbiAgY29uc3QgW3N1Ym1pdHRlZCwgc2V0U3VibWl0dGVkXSA9IGpTKGZhbHNlKTtcbiAgY29uc3QgW3BoYXNlLCBzZXRQaGFzZV0gPSBqUyhcInJlYWRcIik7IC8vIHJlYWQgfCBmZWx0IHwgYWhhIHwgZG9uZVxuXG4gIGNvbnN0IHN1Ym1pdCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoc3VibWl0dGVkIHx8ICFzdW1tb24/LnN1bW1vbl9pZCkgcmV0dXJuO1xuICAgIHNldFN1Ym1pdHRlZCh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLnN1Ym1pdFdpc2RvbUZlZWRiYWNrKHN1bW1vbi5zdW1tb25faWQsIHtcbiAgICAgICAgZmVsdF9zaGlmdF9sb2NhdGlvbjogZmVsdFNoaWZ0LFxuICAgICAgICBhaGFfbGV2ZWw6IGFoYUxldmVsLFxuICAgICAgICBhaGFfbm90ZTogYWhhTm90ZS50cmltKCkgfHwgbnVsbCxcbiAgICAgIH0pO1xuICAgICAgaWYgKG9uRmVlZGJhY2spIG9uRmVlZGJhY2soKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJmZWVkYmFjayBmYWlsZWQ6XCIsIGUubWVzc2FnZSk7XG4gICAgfVxuICAgIHNldFBoYXNlKFwiZG9uZVwiKTtcbiAgICBzZXRUaW1lb3V0KG9uQ2xvc2UsIDE4MDApO1xuICB9O1xuXG4gIGlmICghc3VtbW9uKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIGluc2V0OiAwLCB6SW5kZXg6IDEwMCxcbiAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1wYXBlcikgOTYlLCB2YXIoLS1kYXktc2hhZG93KSlcIixcbiAgICAgICAgb3ZlcmZsb3dZOiBcImF1dG9cIixcbiAgICAgICAgcGFkZGluZzogXCI0MHB4IDI0cHhcIixcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3sgbWF4V2lkdGg6IDYwMCwgd2lkdGg6IFwiMTAwJVwiIH19PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9XG4gICAgICAgICAgYXJpYS1sYWJlbD1cImZlcm1lclwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1hc2gtc29mdClcIiwgZm9udFNpemU6IDE0LCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBtYXJnaW5Cb3R0b206IDI0LFxuICAgICAgICAgIH19PlxuICAgICAgICAgIFx1MDBENyBmZXJtZXJcbiAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAge3BoYXNlICE9PSBcImRvbmVcIiAmJiAoXG4gICAgICAgICAgPD5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTEsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIiwgbWFyZ2luQm90dG9tOiAxNiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7LyogUDAuNCBcdTIwMTQgVGVybURlZiBzdXIgXCJzYWdlc3NlIGRlcyBrYWlyb3NcIiAoRGVzaWduIFx1MDBBNzExLmJpcy4xOCkgKi99XG4gICAgICAgICAgICAgIHt3aW5kb3cuVGVybURlZlxuICAgICAgICAgICAgICAgID8gPHdpbmRvdy5UZXJtRGVmIHRlcm09XCJzYWdlc3NlX2Rlc19rYWlyb3NcIj5zYWdlc3NlIGRlcyBrYWlyb3M8L3dpbmRvdy5UZXJtRGVmPlxuICAgICAgICAgICAgICAgIDogXCJzYWdlc3NlIGRlcyBrYWlyb3NcIn1cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTksXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNyxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWJvbmUtd2FybSlcIixcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMjQsXG4gICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtzdW1tb24ucG9seXBob255X3RleHR9XG4gICAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICAgIHtzdW1tb24udm9pY2VzX21vYmlsaXNlZXMgJiYgc3VtbW9uLnZvaWNlc19tb2JpbGlzZWVzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGNvbG9yOiBcInZhcigtLWRheS1hc2gtc29mdClcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBtYXJnaW5Cb3R0b206IDMyLFxuICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEyLCBib3JkZXJUb3A6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSkgMjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgdm9peCB0aXNzXHUwMEU5ZXMgOiB7c3VtbW9uLnZvaWNlc19tb2JpbGlzZWVzLmpvaW4oXCIsIFwiKX1cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICB7cGhhc2UgPT09IFwicmVhZFwiICYmIChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRQaGFzZShcImZlbHRcIil9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIiwgY29sb3I6IFwidmFyKC0tZGF5LXBhcGVyKVwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIm5vbmVcIiwgcGFkZGluZzogXCIxMnB4IDI0cHhcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIiwgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBjb250aW51ZXJcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuXG4gICAgICAgICAgICB7cGhhc2UgPT09IFwiZmVsdFwiICYmIChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDI0IH19PlxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsIG1hcmdpbkJvdHRvbTogMjAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBRdSdlc3QtY2UgcXVpIHNoaWZ0IGRhbnMgdG9uIGNvcnBzID9cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImdyaWRcIiwgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyIDFmclwiLCBnYXA6IDgsIG1hcmdpbkJvdHRvbTogMTYgfX0+XG4gICAgICAgICAgICAgICAgICB7W1xuICAgICAgICAgICAgICAgICAgICBbXCJnb3JnZVwiLFwiZ29yZ2VcIl0sW1wicG9pdHJpbmVcIixcInBvaXRyaW5lXCJdLFtcInZlbnRyZVwiLFwidmVudHJlXCJdLFxuICAgICAgICAgICAgICAgICAgICBbXCJudXF1ZVwiLFwibnVxdWVcIl0sW1wiYWlsbGV1cnNcIixcImFpbGxldXJzXCJdLFtcImF1Y3VuZVwiLFwicmllblwiXSxcbiAgICAgICAgICAgICAgICAgIF0ubWFwKChbaywgbGFiZWxdKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfSBvbkNsaWNrPXsoKSA9PiB7IHNldEZlbHRTaGlmdChrKTsgc2V0UGhhc2UoXCJhaGFcIik7IH19XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGZlbHRTaGlmdCA9PT0gayA/IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIiA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBmZWx0U2hpZnQgPT09IGsgPyBcInZhcigtLWRheS1wYXBlcilcIiA6IFwidmFyKC0tZGF5LWJvbmUtd2FybSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tZGF5LWNsYXktd2FybSlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxMnB4XCIsIGZvbnRTaXplOiAxMywgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAge3BoYXNlID09PSBcImFoYVwiICYmIChcbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDI0IH19PlxuICAgICAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsIG1hcmdpbkJvdHRvbTogMjAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBPXHUwMEY5IGVzdCB0b24gYWhhID9cbiAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZ2FwOiA4LCBtYXJnaW5Cb3R0b206IDE2IH19PlxuICAgICAgICAgICAgICAgICAge1tbXCJmb3J0XCIsXCJyXHUwMEU5c29ubmUgZm9ydFwiXSxbXCJwZXV0LWV0cmVcIixcInBldXQtXHUwMEVBdHJlXCJdLFtcIm5vblwiLFwibm9uXCJdXS5tYXAoKFtrLCBsXSkgPT4gKFxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17a30gb25DbGljaz17KCkgPT4gc2V0QWhhTGV2ZWwoayl9XG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIGZsZXg6IDEsIGJhY2tncm91bmQ6IGFoYUxldmVsID09PSBrID8gXCJ2YXIoLS1kYXktY2xheS13YXJtKVwiIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGFoYUxldmVsID09PSBrID8gXCJ2YXIoLS1kYXktcGFwZXIpXCIgOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWRheS1jbGF5LXdhcm0pXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggMTJweFwiLCBmb250U2l6ZTogMTMsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2x9XG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgICAgICB2YWx1ZT17YWhhTm90ZX1cbiAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEFoYU5vdGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ1bmUgbm90ZSBsaWJyZSAob3B0aW9ubmVsKVx1MjAyNlwiXG4gICAgICAgICAgICAgICAgICByb3dzPXsyfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLWRheS1saW5lbilcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDIwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxNHB4XCIsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYm9uZS13YXJtKVwiLCBvdXRsaW5lOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgYm94U2l6aW5nOiBcImJvcmRlci1ib3hcIiwgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtzdWJtaXR9XG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IWFoYUxldmVsIHx8IHN1Ym1pdHRlZH1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMTYsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIiwgY29sb3I6IFwidmFyKC0tZGF5LXBhcGVyKVwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwibm9uZVwiLCBwYWRkaW5nOiBcIjEycHggMjRweFwiLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBhaGFMZXZlbCA/IFwicG9pbnRlclwiIDogXCJub3QtYWxsb3dlZFwiLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiBhaGFMZXZlbCA/IDEgOiAwLjQsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIGVucmVnaXN0cmVyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cblxuICAgICAgICB7cGhhc2UgPT09IFwiZG9uZVwiICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIHBhZGRpbmc6IFwiNjBweCAwXCIsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktY2xheS13YXJtKVwiLCBmb250U2l6ZTogMTcsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB0ZW51LlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBCb3V0b24gXCJhcHBlbCBzYWdlc3NlXCIgc3VyIGVudHJcdTAwRTllIG91IHNlY3Rpb24gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5mdW5jdGlvbiBTdW1tb25CdXR0b24oeyBlbnRyeV9pZCA9IG51bGwsIGNhdGVnb3J5ID0gbnVsbCwgc3ViX2NhdGVnb3J5ID0gbnVsbCwgb25TdW1tb25TdGFydCwgb25TdW1tb25Eb25lIH0pIHtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0galMoZmFsc2UpO1xuXG4gIGNvbnN0IHRyaWdnZXIgPSBhc3luYyAoZSkgPT4ge1xuICAgIGU/LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChsb2FkaW5nKSByZXR1cm47XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICBpZiAob25TdW1tb25TdGFydCkgb25TdW1tb25TdGFydCgpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLnN1bW1vbkthaXJvc1dpc2RvbSh7IGVudHJ5X2lkLCBjYXRlZ29yeSwgc3ViX2NhdGVnb3J5IH0pO1xuICAgICAgaWYgKHIuZXJyb3IpIHtcbiAgICAgICAgYWxlcnQoci5lcnJvcik7XG4gICAgICB9IGVsc2UgaWYgKG9uU3VtbW9uRG9uZSkge1xuICAgICAgICBvblN1bW1vbkRvbmUocik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgYWxlcnQoXCJcdTAwQzljaGVjIDogXCIgKyBlLm1lc3NhZ2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uIG9uQ2xpY2s9e3RyaWdnZXJ9IGRpc2FibGVkPXtsb2FkaW5nfVxuICAgICAgdGl0bGU9XCJhcHBlbCBcdTAwRTAgbGEgc2FnZXNzZSBkZXMga2Fpcm9zXCJcbiAgICAgIGFyaWEtbGFiZWw9XCJhcHBlbCBcdTAwRTAgbGEgc2FnZXNzZSBkZXMga2Fpcm9zXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1zdW4tbG93KSA1MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgIHdpZHRoOiAzMiwgaGVpZ2h0OiAzMixcbiAgICAgICAgY3Vyc29yOiBsb2FkaW5nID8gXCJ3YWl0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LXN1bi1sb3cpXCIsXG4gICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgb3BhY2l0eTogbG9hZGluZyA/IDAuNSA6IDAuODUsXG4gICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGVhc2VcIixcbiAgICAgIH19XG4gICAgICBvbk1vdXNlRW50ZXI9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDE7IGUuY3VycmVudFRhcmdldC5zdHlsZS50cmFuc2Zvcm0gPSBcInNjYWxlKDEuMDgpXCI7IH19XG4gICAgICBvbk1vdXNlTGVhdmU9e2UgPT4geyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IGxvYWRpbmcgPyAwLjUgOiAwLjg1OyBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxKVwiOyB9fT5cbiAgICAgIHtsb2FkaW5nID8gXCJcdTIwMjZcIiA6IFwiXHUyNzI2XCJ9XG4gICAgPC9idXR0b24+XG4gICk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBNYWluIHNjcmVlbiA6IEpvdXJuYWwgZGUgVmllIExVTUlORVVYIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gSm91cm5hbERlVmllSm91cih7IGdvIH0pIHtcbiAgY29uc3QgW3NlY3Rpb25zLCBzZXRTZWN0aW9uc10gPSBqUyhbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IGpTKHRydWUpO1xuICBjb25zdCBbYWN0aXZlU3VtbW9uLCBzZXRBY3RpdmVTdW1tb25dID0galMobnVsbCk7XG4gIGNvbnN0IFtzdW1tb25Mb2FkaW5nLCBzZXRTdW1tb25Mb2FkaW5nXSA9IGpTKGZhbHNlKTtcbiAgY29uc3QgW3JlY2VudEVudHJpZXMsIHNldFJlY2VudEVudHJpZXNdID0galMoW10pO1xuXG4gIGNvbnN0IHJlZnJlc2hTZWN0aW9ucyA9IGpDQihhc3luYyAoKSA9PiB7XG4gICAgc2V0TG9hZGluZyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgW3NlY3RzLCBlbnRyaWVzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgd2luZG93LkRyZWFtQVBJLmxpc3RKb3VybmFsU2VjdGlvbnMoKSxcbiAgICAgICAgd2luZG93LkRyZWFtQVBJLmxpc3RKb3VybmFsRW50cmllcyh7IGxpbWl0OiA1IH0pLFxuICAgICAgXSk7XG4gICAgICBzZXRTZWN0aW9ucyhzZWN0cz8uc2VjdGlvbnMgfHwgW10pO1xuICAgICAgc2V0UmVjZW50RW50cmllcyhlbnRyaWVzPy5lbnRyaWVzIHx8IFtdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbSm91cm5hbF0gcmVmcmVzaCBmYWlsZWQ6XCIsIGUubWVzc2FnZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGpFKCgpID0+IHsgcmVmcmVzaFNlY3Rpb25zKCk7IH0sIFtyZWZyZXNoU2VjdGlvbnNdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e2RheVN0eWxlKHtcbiAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgcGFkZGluZ0JvdHRvbTogMTAwLCAvLyBlc3BhY2UgcG91ciBib3R0b20gbmF2XG4gICAgfSl9PlxuICAgICAgPEpvdXJIZWFkZXIgZ289e2dvfSAvPlxuXG4gICAgICA8RGVwb3NlckxpYnJlIG9uRGVwb3NlPXsoKSA9PiByZWZyZXNoU2VjdGlvbnMoKX0gLz5cblxuICAgICAgey8qIFNlY3Rpb24gXCJyXHUwMEU5Y2VudGVzXCIgXHUyMDE0IDUgZGVybmlcdTAwRThyZXMgZW50clx1MDBFOWVzIGF2ZWMgYm91dG9uIHNhZ2Vzc2UgKi99XG4gICAgICB7cmVjZW50RW50cmllcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjE2cHggMjRweCA4cHhcIiB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMSwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWFzaC1zb2Z0KVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLCBtYXJnaW5Cb3R0b206IDEyLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgclx1MDBFOWNlbW1lbnQgZFx1MDBFOXBvc1x1MDBFOVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtyZWNlbnRFbnRyaWVzLm1hcChlID0+IChcbiAgICAgICAgICAgIDxkaXYga2V5PXtlLmlkfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tZGF5LWxpbmVuKVwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTRweCAxOHB4XCIsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiZmxleC1zdGFydFwiLCBnYXA6IDEyLFxuICAgICAgICAgICAgICAgIGJvcmRlckxlZnQ6IFwiMnB4IHNvbGlkIHZhcigtLWRheS1jbGF5LXdhcm0pXCIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZsZXg6IDEgfX0+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYm9uZS13YXJtKVwiLCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB7ZS5yYXdfdGV4dH1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICB7ZS5jYXRlZ29yeSAmJiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1hc2gtc29mdClcIiwgbWFyZ2luVG9wOiA2LCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIHtlLmNhdGVnb3J5fXtlLnN1Yl9jYXRlZ29yeSA/IFwiIFx1MDBCNyBcIiArIGUuc3ViX2NhdGVnb3J5IDogXCJcIn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8U3VtbW9uQnV0dG9uIGVudHJ5X2lkPXtlLmlkfVxuICAgICAgICAgICAgICAgIG9uU3VtbW9uU3RhcnQ9eygpID0+IHNldFN1bW1vbkxvYWRpbmcodHJ1ZSl9XG4gICAgICAgICAgICAgICAgb25TdW1tb25Eb25lPXtyID0+IHsgc2V0U3VtbW9uTG9hZGluZyhmYWxzZSk7IHNldEFjdGl2ZVN1bW1vbihyKTsgfX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBTZWN0aW9ucyBkZSB2aWUgXHUyMDE0IGdyaWxsZSB2ZXJ0aWNhbGUgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMjRweCAyNHB4IDI0cHhcIiB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDExLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWFzaC1zb2Z0KVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLCBtYXJnaW5Cb3R0b206IDE0LFxuICAgICAgICB9fT5cbiAgICAgICAgICB0ZXMgZG9tYWluZXMgZGUgdmllXG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7bG9hZGluZyA/IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgY29sb3I6IFwidmFyKC0tZGF5LWFzaC1zb2Z0KVwiLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgICAgICBcdTIwMjZcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZ3JpZFwiLCBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjFmclwiLCBnYXA6IDggfX0+XG4gICAgICAgICAgICB7c2VjdGlvbnMubWFwKHMgPT4gKFxuICAgICAgICAgICAgICA8ZGl2IGtleT17cy5jYXRlZ29yeX0gc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9fT5cbiAgICAgICAgICAgICAgICA8U2VjdGlvbkNhcmQgc2VjdGlvbj17c30gb25PcGVuPXsoKSA9PiBnbyAmJiBnbyhcImpvdXJuYWwtc2VjdGlvblwiLCBzKX0gLz5cbiAgICAgICAgICAgICAgICB7cy5jb3VudCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IDE0LCByaWdodDogMTQsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPFN1bW1vbkJ1dHRvbiBjYXRlZ29yeT17cy5jYXRlZ29yeX1cbiAgICAgICAgICAgICAgICAgICAgICBvblN1bW1vblN0YXJ0PXsoKSA9PiBzZXRTdW1tb25Mb2FkaW5nKHRydWUpfVxuICAgICAgICAgICAgICAgICAgICAgIG9uU3VtbW9uRG9uZT17ciA9PiB7IHNldFN1bW1vbkxvYWRpbmcoZmFsc2UpOyBzZXRBY3RpdmVTdW1tb24ocik7IH19IC8+XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHtzdW1tb25Mb2FkaW5nICYmIChcbiAgICAgICAgPFN1bW1vbkxvYWRpbmdNb2RhbCBkYXJrPXtmYWxzZX0gLz5cbiAgICAgICl9XG5cbiAgICAgIHthY3RpdmVTdW1tb24gJiYgKFxuICAgICAgICA8UG9seXBob25pZVNoZWV0IHN1bW1vbj17YWN0aXZlU3VtbW9ufVxuICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHNldEFjdGl2ZVN1bW1vbihudWxsKX1cbiAgICAgICAgICBvbkZlZWRiYWNrPXsoKSA9PiB7fX0gLz5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbi8vIDIwMjYtMDQtMjcgXHUyMDE0IFNwcmludCBQMC41IChEZXNpZ24gXHUwMEE3MTEuYmlzLjE5KVxuLy8gTW9kYWwgcGFydGFnXHUwMEU5ZSBwZW5kYW50IHN1bW1vbkthaXJvc1dpc2RvbSAoNS0xMHMpIDpcbi8vIExvYWRpbmdIYWxvICsgc2tlbGV0b24gNSBsaWduZXMgKyBtZXNzYWdlIHJvdGF0aW5nIFwibGVzIGthaXJvcyByXHUwMEU5c29ubmVudFx1MjAyNlwiXG4vLyBBZGFwdGl2ZSBkYXkvbmlnaHQgdmlhIHByb3AgZGFyay5cbmZ1bmN0aW9uIFN1bW1vbkxvYWRpbmdNb2RhbCh7IGRhcmsgPSBmYWxzZSB9KSB7XG4gIGNvbnN0IFNoaW0gPSB3aW5kb3cuU2tlbGV0b25TaGltbWVyO1xuICBjb25zdCBIYWxvID0gd2luZG93LkxvYWRpbmdIYWxvO1xuICBjb25zdCB1c2VSb3RhdGluZyA9IHdpbmRvdy51c2VSb3RhdGluZ01lc3NhZ2U7XG4gIGNvbnN0IG1lc3NhZ2VzID0gW1xuICAgIFwibGVzIGthaXJvcyByXHUwMEU5c29ubmVudFx1MjAyNlwiLFxuICAgIFwiXHUwMEU5Y291dGVyIGNlIHF1aSByZXZpZW50XHUyMDI2XCIsXG4gICAgXCJ0aXNzZXIgbGVzIHZvaXhcdTIwMjZcIixcbiAgXTtcbiAgY29uc3QgbWVzc2FnZSA9IHVzZVJvdGF0aW5nID8gdXNlUm90YXRpbmcobWVzc2FnZXMsIDI0MDApIDogbWVzc2FnZXNbMF07XG5cbiAgY29uc3Qgb3ZlcmxheUJnID0gZGFya1xuICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA3OCUsIHRyYW5zcGFyZW50KVwiXG4gICAgOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LXBhcGVyKSA4OCUsIHZhcigtLWRheS1zaGFkb3csIHRyYW5zcGFyZW50KSlcIjtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIGluc2V0OiAwLCB6SW5kZXg6IDkwLFxuICAgICAgYmFja2dyb3VuZDogb3ZlcmxheUJnLFxuICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig2cHgpXCIsXG4gICAgICBXZWJraXRCYWNrZHJvcEZpbHRlcjogXCJibHVyKDZweClcIixcbiAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy01KVwiLFxuICAgIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkcmVhbS1za2VsZXRvbi1mYWRlLWluXCIgc3R5bGU9e3tcbiAgICAgICAgbWF4V2lkdGg6IDQ2MCwgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiAyMCxcbiAgICAgICAgcGFkZGluZzogXCIyOHB4IDI0cHhcIixcbiAgICAgICAgYmFja2dyb3VuZDogZGFya1xuICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDcwJSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiXG4gICAgICAgICAgOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWxpbmVuLCAjREZEM0JGKSAzNSUsIHZhcigtLWRheS1wYXBlciwgI0VCRTJEMikpXCIsXG4gICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgXCIgKyAoZGFya1xuICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjIlLCB2YXIoLS1hc2gtZGVlcCkpXCJcbiAgICAgICAgICA6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktY2xheS13YXJtLCAjQzlCMDk4KSAzNSUsIHRyYW5zcGFyZW50KVwiKSxcbiAgICAgIH19PlxuICAgICAgICB7SGFsb1xuICAgICAgICAgID8gPEhhbG8gc2l6ZT17MzJ9IG1lc3NhZ2U9e251bGx9IGRhcms9e2Rhcmt9IC8+XG4gICAgICAgICAgOiA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAzMiwgaGVpZ2h0OiAzMiwgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgKGRhcmsgPyBcInZhcigtLXNpbGstZ29sZClcIiA6IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIiksXG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJoYWxvLXNsb3cgMi41cyBlYXNlLWluLW91dCBpbmZpbml0ZVwiLFxuICAgICAgICAgICAgICBhbGlnblNlbGY6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB9fSAvPn1cbiAgICAgICAge1NoaW0gJiYgKFxuICAgICAgICAgIDxTaGltIGxpbmVzPXs1fSBoZWlnaHQ9ezEyfSBnYXA9ezEyfSBkYXJrPXtkYXJrfSBsYXN0TGluZVdpZHRoPVwiNjIlXCIgLz5cbiAgICAgICAgKX1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgIGNvbG9yOiBkYXJrID8gXCJ2YXIoLS1hc2gtbGlnaHQpXCIgOiBcInZhcigtLWRheS1ib25lLXdhcm0sICM5RjhFN0MpXCIsXG4gICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICBvcGFjaXR5OiAwLjksXG4gICAgICAgIH19PlxuICAgICAgICAgIHttZXNzYWdlfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLyBFeHBvc2UgZm9yIG5pZ2h0bHkgSm91cm5hbCBzY3JlZW4gcmV1c2VcbndpbmRvdy5TdW1tb25Mb2FkaW5nTW9kYWwgPSBTdW1tb25Mb2FkaW5nTW9kYWw7XG5cbi8vIFx1MjUwMFx1MjUwMCBIZWxwZXJzIDogcmVsYXRpdmUgZGF0ZSBmb3IgZHJpbGwtZG93biBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmZ1bmN0aW9uIHJlbGF0aXZlRGF0ZUpvdXIoaXNvKSB7XG4gIGlmICghaXNvKSByZXR1cm4gXCJyXHUwMEU5Y2VtbWVudFwiO1xuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBjb25zdCB0ID0gbmV3IERhdGUoaXNvKS5nZXRUaW1lKCk7XG4gIGNvbnN0IGRoID0gKG5vdyAtIHQpIC8gMzYwMDAwMDtcbiAgaWYgKGRoIDwgMSkgcmV0dXJuIFwiXHUwMEUwIGwnaW5zdGFudFwiO1xuICBpZiAoZGggPCAxMikgcmV0dXJuIFwiY2UgbWF0aW5cIjtcbiAgaWYgKGRoIDwgMjQpIHJldHVybiBcImF1am91cmQnaHVpXCI7XG4gIGlmIChkaCA8IDM2KSByZXR1cm4gXCJoaWVyIHNvaXJcIjtcbiAgaWYgKGRoIDwgNDgpIHJldHVybiBcImhpZXJcIjtcbiAgaWYgKGRoIDwgMjQgKiA3KSByZXR1cm4gXCJpbCB5IGEgXCIgKyBNYXRoLmZsb29yKGRoIC8gMjQpICsgXCIgam91cnNcIjtcbiAgaWYgKGRoIDwgMjQgKiAzMCkgcmV0dXJuIFwiaWwgeSBhIFwiICsgTWF0aC5mbG9vcihkaCAvICgyNCAqIDcpKSArIFwiIHNlbWFpbmUocylcIjtcbiAgaWYgKGRoIDwgMjQgKiA2MCkgcmV0dXJuIFwiaWwgeSBhIHVuZSBsdW5lXCI7XG4gIGlmIChkaCA8IDI0ICogOTApIHJldHVybiBcImlsIHkgYSBkZXV4IGx1bmVzXCI7XG4gIHJldHVybiBcImlsIHkgYSBwbHVzaWV1cnMgbHVuZXNcIjtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIFN1Yi1jYXRlZ29yaWVzIGNhbm9uaXF1ZXMgcG91ciAncmVsYXRpb25zJyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IFJFTEFUSU9OU19TVUJTID0gW1xuICBbXCJhbGxcIiwgICAgICAgIFwidG91dGVzXCJdLFxuICBbXCJhbW91clwiLCAgICAgIFwiYW1vdXJcIl0sXG4gIFtcImZhbWlsbGVcIiwgICAgXCJmYW1pbGxlXCJdLFxuICBbXCJhbWlzXCIsICAgICAgIFwiYW1pc1wiXSxcbiAgW1wiY29sbGVndWVzXCIsICBcImNvbGxcdTAwRThndWVzXCJdLFxuICBbXCJyZW5jb250cmVzXCIsIFwicmVuY29udHJlc1wiXSxcbl07XG5cbi8vIFx1MjUwMFx1MjUwMCBKb3VybmFsU2VjdGlvbkRyaWxsRG93biBcdTIwMTQgdnVlIGNocm9ub2xvZ2lxdWUgaW52ZXJzXHUwMEU5ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERlc2lnbiBcdTAwQTc3LjEgKyBcdTAwQTczLjEuYmlzXG4vLyBEcmlsbC1kb3duIGQndW5lIHNlY3Rpb24gZHUgSm91cm5hbCBkZSBWaWUgTFVNSU5FVVguXG4vLyBIZWFkZXIgbHVtaW5ldXggKyBib3V0b24gc2FnZXNzZSBkZSBzZWN0aW9uICsgbGlzdGUgZW50cmllc1xuLy8gKyBib3V0b24gc2FnZXNzZSBpbmRpdmlkdWVsICsgYm91dG9uIFwiZFx1MDBFOXBvc2VyIHVuIGthaXJvcyBsaVx1MDBFOVwiXG5mdW5jdGlvbiBKb3VybmFsU2VjdGlvbkRyaWxsRG93bih7IGdvLCBzZWN0aW9uIH0pIHtcbiAgY29uc3Qgc2FmZVNlY3Rpb24gPSBzZWN0aW9uIHx8IHsgY2F0ZWdvcnk6IFwidHJhdmFpbFwiLCBsYWJlbDogXCJzZWN0aW9uXCIsIGdseXBoOiBcIlx1MjVDN1wiLCBjb3VudDogMCB9O1xuICBjb25zdCBpc1JlbGF0aW9ucyA9IHNhZmVTZWN0aW9uLmNhdGVnb3J5ID09PSBcInJlbGF0aW9uc1wiO1xuXG4gIGNvbnN0IFtlbnRyaWVzLCBzZXRFbnRyaWVzXSA9IGpTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0galModHJ1ZSk7XG4gIGNvbnN0IFthY3RpdmVTdWIsIHNldEFjdGl2ZVN1Yl0gPSBqUyhcImFsbFwiKTtcbiAgY29uc3QgW2FjdGl2ZVN1bW1vbiwgc2V0QWN0aXZlU3VtbW9uXSA9IGpTKG51bGwpO1xuICBjb25zdCBbc3VtbW9uTG9hZGluZywgc2V0U3VtbW9uTG9hZGluZ10gPSBqUyhmYWxzZSk7XG5cbiAgY29uc3QgcmVmcmVzaEVudHJpZXMgPSBqQ0IoYXN5bmMgKCkgPT4ge1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhcmFtcyA9IHsgY2F0ZWdvcnk6IHNhZmVTZWN0aW9uLmNhdGVnb3J5LCBsaW1pdDogMTAwIH07XG4gICAgICBpZiAoaXNSZWxhdGlvbnMgJiYgYWN0aXZlU3ViICE9PSBcImFsbFwiKSBwYXJhbXMuc3ViX2NhdGVnb3J5ID0gYWN0aXZlU3ViO1xuICAgICAgY29uc3QgciA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5saXN0Sm91cm5hbEVudHJpZXMocGFyYW1zKTtcbiAgICAgIHNldEVudHJpZXMocj8uZW50cmllcyB8fCBbXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW0pvdXJuYWxTZWN0aW9uRHJpbGxEb3duXSByZWZyZXNoIGZhaWxlZDpcIiwgZS5tZXNzYWdlKTtcbiAgICAgIHNldEVudHJpZXMoW10pO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH0sIFtzYWZlU2VjdGlvbi5jYXRlZ29yeSwgaXNSZWxhdGlvbnMsIGFjdGl2ZVN1Yl0pO1xuXG4gIGpFKCgpID0+IHsgcmVmcmVzaEVudHJpZXMoKTsgfSwgW3JlZnJlc2hFbnRyaWVzXSk7XG5cbiAgLy8gQm91dG9uIFwiZFx1MDBFOXBvc2VyIHVuIGthaXJvcyBsaVx1MDBFOVwiIFx1MjAxNCBuYXZpZ3VlIHZlcnMgQ2FwdHVyZSAoTlVJVClcbiAgLy8gYXZlYyB1biBoaW50IGludmVyc1x1MDBFOSA6IGxhIG5vdGUgSm91cm5hbCBkZXZpZW50IGxlIGNvbnRleHRlIGR1IGthaXJvc1xuICBjb25zdCBnb0NhcHR1cmVGcm9tRW50cnkgPSAoZW50cnkpID0+IHtcbiAgICB0cnkge1xuICAgICAgd2luZG93Ll9fZHJlYW1DYXB0dXJlTGlua2VkSGludCA9IHtcbiAgICAgICAgZnJvbV9qb3VybmFsX2VudHJ5X2lkOiBlbnRyeS5pZCxcbiAgICAgICAgZnJvbV9qb3VybmFsX3RleHQ6IGVudHJ5LnJhd190ZXh0LFxuICAgICAgICBmcm9tX2NhdGVnb3J5OiBzYWZlU2VjdGlvbi5jYXRlZ29yeSxcbiAgICAgICAgY3JlYXRlZEF0OiBEYXRlLm5vdygpLFxuICAgICAgfTtcbiAgICB9IGNhdGNoIHt9XG4gICAgZ28oXCJjYXB0dXJlXCIpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17ZGF5U3R5bGUoe1xuICAgICAgbWluSGVpZ2h0OiBcIjEwMHZoXCIsXG4gICAgICBwYWRkaW5nQm90dG9tOiAxMDAsXG4gICAgfSl9PlxuICAgICAgey8qIEhlYWRlciBsdW1pbmV1eCA6IHJldG91ciArIGxhYmVsICsgY291bnQgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgIHBhZGRpbmc6IFwiMTZweCAyNHB4XCIsXG4gICAgICAgIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktY2xheS13YXJtKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJob21lXCIpfVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJyZXRvdXIgYXUgam91cm5hbFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1hc2gtc29mdClcIiwgZm9udFNpemU6IDEzLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBwYWRkaW5nOiBcIjRweCAwXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgXHUyMTkwIGpvdXJuYWxcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYXNoLXNvZnQpXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtlbnRyaWVzLmxlbmd0aCA+IDAgPyBgJHtlbnRyaWVzLmxlbmd0aH0gZW50clx1MDBFOWUke2VudHJpZXMubGVuZ3RoID4gMSA/IFwic1wiIDogXCJcIn1gIDogXCJcIn1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFRpdHJlIHNlY3Rpb24gKyBnbHlwaGUgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMjRweCAyNHB4IDEycHhcIiB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJiYXNlbGluZVwiLCBnYXA6IDEyIH19PlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAyOCwgY29sb3I6IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIiB9fT5cbiAgICAgICAgICAgIHtzYWZlU2VjdGlvbi5nbHlwaH1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPGgyIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAyNixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsIGZvbnRXZWlnaHQ6IDQwMCxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7c2FmZVNlY3Rpb24ubGFiZWx9XG4gICAgICAgICAgPC9oMj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEJvdXRvbiBcImFwcGVsIHNhZ2Vzc2UgZGVzIGthaXJvcyBzdXIgY2V0dGUgc2VjdGlvblwiIFx1MjAxNCBwcm9cdTAwRTltaW5lbnQgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBhZGRpbmc6IFwiOHB4IDI0cHggMjBweFwiLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiAxMixcbiAgICAgIH19PlxuICAgICAgICB7d2luZG93LlN1bW1vbkJ1dHRvbiAmJiAoXG4gICAgICAgICAgPHdpbmRvdy5TdW1tb25CdXR0b25cbiAgICAgICAgICAgIGNhdGVnb3J5PXtzYWZlU2VjdGlvbi5jYXRlZ29yeX1cbiAgICAgICAgICAgIHN1Yl9jYXRlZ29yeT17aXNSZWxhdGlvbnMgJiYgYWN0aXZlU3ViICE9PSBcImFsbFwiID8gYWN0aXZlU3ViIDogbnVsbH1cbiAgICAgICAgICAgIG9uU3VtbW9uU3RhcnQ9eygpID0+IHNldFN1bW1vbkxvYWRpbmcodHJ1ZSl9XG4gICAgICAgICAgICBvblN1bW1vbkRvbmU9e3IgPT4geyBzZXRTdW1tb25Mb2FkaW5nKGZhbHNlKTsgc2V0QWN0aXZlU3VtbW9uKHIpOyB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWJvbmUtd2FybSlcIiwgbGV0dGVyU3BhY2luZzogXCIwLjAxZW1cIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgYXBwZWwgXHUwMEUwIGxhIHNhZ2Vzc2UgZGVzIGthaXJvcyBzdXIgY2V0dGUgc2VjdGlvblxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFN1Yi1jYXRlZ29yaWVzIHRhYnMgKHJlbGF0aW9ucyBvbmx5KSAqL31cbiAgICAgIHtpc1JlbGF0aW9ucyAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiBcIjAgMjRweCAxNnB4XCIsXG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhXcmFwOiBcIndyYXBcIiwgZ2FwOiA4LFxuICAgICAgICB9fT5cbiAgICAgICAgICB7UkVMQVRJT05TX1NVQlMubWFwKChbaywgbF0pID0+IChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVTdWIoayl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlU3ViID09PSBrXG4gICAgICAgICAgICAgICAgICA/IFwidmFyKC0tZGF5LWNsYXktd2FybSlcIlxuICAgICAgICAgICAgICAgICAgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IGFjdGl2ZVN1YiA9PT0ga1xuICAgICAgICAgICAgICAgICAgPyBcInZhcigtLWRheS1wYXBlcilcIlxuICAgICAgICAgICAgICAgICAgOiBcInZhcigtLWRheS1ib25lLXdhcm0pXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDUwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTRweFwiLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA5OTksXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2x9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogTGlzdGUgY2hyb25vbG9naXF1ZSBpbnZlcnNcdTAwRTllIGRlcyBlbnRyaWVzICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjAgMjRweCAyNHB4XCIgfX0+XG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWFzaC1zb2Z0KVwiLCBwYWRkaW5nOiBcIjQwcHggMFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBsZXMgZW50clx1MDBFOWVzIHMnXHUwMEU5dmVpbGxlbnRcdTIwMjZcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IGVudHJpZXMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZGF5LWFzaC1zb2Z0KVwiLCBwYWRkaW5nOiBcIjQwcHggMFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjYsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgY2V0dGUgc2VjdGlvbiBuZSB0aWVudCBlbmNvcmUgcmllbi48YnIgLz5cbiAgICAgICAgICAgIGRcdTAwRTlwb3NlIHVuZSBub3RlIGRlcHVpcyBsJ2FjY3VlaWwgcG91ciBjb21tZW5jZXIuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiAxMiB9fT5cbiAgICAgICAgICAgIHtlbnRyaWVzLm1hcChlID0+IChcbiAgICAgICAgICAgICAgPGFydGljbGUga2V5PXtlLmlkfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLWRheS1saW5lbilcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktY2xheS13YXJtKSAxOCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxNnB4IDE4cHhcIixcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDEwLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHsvKiBIZWFkZXIgOiBkYXRlIHJlbGF0aXZlICsgc3ViX2NhdGVnb3J5ICovfVxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiYmFzZWxpbmVcIixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYXNoLXNvZnQpXCIsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAge3JlbGF0aXZlRGF0ZUpvdXIoZS5jcmVhdGVkX2F0KX1cbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIHtlLnN1Yl9jYXRlZ29yeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktY2xheS13YXJtKVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7ZS5zdWJfY2F0ZWdvcnl9XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogVGV4dGUgZGUgbCdlbnRyeSAqL31cbiAgICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgbWFyZ2luOiAwLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYm9uZS13YXJtKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHtlLnJhd190ZXh0fVxuICAgICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICAgIHsvKiBMaW5rZWQga2Fpcm9zIGJhZGdlIGlmIGFueSAqL31cbiAgICAgICAgICAgICAgICB7ZS5saW5rZWRfa2Fpcm9zX2lkICYmIChcbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTEsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWRheS1jbGF5LXdhcm0pXCIsIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDYsXG4gICAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDEyIH19Plx1MjYzRTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgcmVsaVx1MDBFOSBcdTAwRTAgdW4ga2Fpcm9zXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgey8qIEFjdGlvbnMgcm93IDogc2FnZXNzZSArIGRcdTAwRTlwb3NlciBrYWlyb3MgbGlcdTAwRTkgKi99XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogNCwgZ2FwOiAxMixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ29DYXB0dXJlRnJvbUVudHJ5KGUpfVxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWJvbmUtd2FybSkgMzAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1kYXktYm9uZS13YXJtKVwiLFxuICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiNnB4IDEycHhcIixcbiAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMixcbiAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtldiA9PiBldi5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSkgOCUsIHRyYW5zcGFyZW50KVwifVxuICAgICAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2V2ID0+IGV2LmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwidHJhbnNwYXJlbnRcIn0+XG4gICAgICAgICAgICAgICAgICAgIGRcdTAwRTlwb3NlciB1biBrYWlyb3MgbGlcdTAwRTlcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgICAgICAgICB7d2luZG93LlN1bW1vbkJ1dHRvbiAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDx3aW5kb3cuU3VtbW9uQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgZW50cnlfaWQ9e2UuaWR9XG4gICAgICAgICAgICAgICAgICAgICAgb25TdW1tb25TdGFydD17KCkgPT4gc2V0U3VtbW9uTG9hZGluZyh0cnVlKX1cbiAgICAgICAgICAgICAgICAgICAgICBvblN1bW1vbkRvbmU9e3IgPT4geyBzZXRTdW1tb25Mb2FkaW5nKGZhbHNlKTsgc2V0QWN0aXZlU3VtbW9uKHIpOyB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9hcnRpY2xlPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIExvYWRpbmcgb3ZlcmxheSBzdW1tb24gXHUyMDE0IFNwcmludCBQMC41IChEZXNpZ24gXHUwMEE3MTEuYmlzLjE5KSAqL31cbiAgICAgIHtzdW1tb25Mb2FkaW5nICYmIChcbiAgICAgICAgPFN1bW1vbkxvYWRpbmdNb2RhbCBkYXJrPXtmYWxzZX0gLz5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBQb2x5cGhvbmllIG1vZGFsICovfVxuICAgICAge2FjdGl2ZVN1bW1vbiAmJiB3aW5kb3cuUG9seXBob25pZVNoZWV0ICYmIChcbiAgICAgICAgPHdpbmRvdy5Qb2x5cGhvbmllU2hlZXRcbiAgICAgICAgICBzdW1tb249e2FjdGl2ZVN1bW1vbn1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiBzZXRBY3RpdmVTdW1tb24obnVsbCl9XG4gICAgICAgICAgb25GZWVkYmFjaz17KCkgPT4ge319XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG4vLyBFeHBvc2UgZ2xvYmFsbHkgZm9yIGFwcC5qc3ggcm91dGluZ1xud2luZG93LkpvdXJuYWxEZVZpZUpvdXIgPSBKb3VybmFsRGVWaWVKb3VyO1xud2luZG93LlN1bW1vbkJ1dHRvbiA9IFN1bW1vbkJ1dHRvbjtcbndpbmRvdy5Qb2x5cGhvbmllU2hlZXQgPSBQb2x5cGhvbmllU2hlZXQ7XG53aW5kb3cuSm91cm5hbFNlY3Rpb25EcmlsbERvd24gPSBKb3VybmFsU2VjdGlvbkRyaWxsRG93bjtcbiJdLAogICJtYXBwaW5ncyI6ICJBQWlCQSxNQUFNLEVBQUUsVUFBVSxJQUFJLFdBQVcsSUFBSSxRQUFRLElBQUksYUFBYSxJQUFJLElBQUk7QUFHdEUsTUFBTSxXQUFXO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixlQUFlO0FBQUEsRUFDZixtQkFBbUI7QUFBQSxFQUNuQixtQkFBbUI7QUFBQSxFQUNuQixrQkFBa0I7QUFBQSxFQUNsQixpQkFBaUI7QUFBQSxFQUNqQixnQkFBZ0I7QUFDbEI7QUFFQSxNQUFNLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTztBQUFBLEVBQ2hDLFlBQVk7QUFBQSxFQUNaLE9BQU87QUFBQSxFQUNQLFlBQVk7QUFBQSxFQUNaLEdBQUc7QUFBQSxFQUNILEdBQUc7QUFDTDtBQUtBLFNBQVMsV0FBVyxFQUFFLElBQUksWUFBWSx1QkFBb0IsR0FBRztBQUMzRCxRQUFNLFNBQVEsb0JBQUksS0FBSyxHQUFFLG1CQUFtQixTQUFTO0FBQUEsSUFDbkQsU0FBUztBQUFBLElBQVEsS0FBSztBQUFBLElBQVcsT0FBTztBQUFBLEVBQzFDLENBQUM7QUFDRCxTQUNFLG9DQUFDLFNBQUksT0FBTztBQUFBLElBQ1YsU0FBUztBQUFBLElBQVEsZ0JBQWdCO0FBQUEsSUFBaUIsWUFBWTtBQUFBLElBQzlELFNBQVM7QUFB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
