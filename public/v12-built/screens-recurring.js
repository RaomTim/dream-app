(function setupRecurringScreens() {
  const { useState: uS, useEffect: uE, useCallback: uCB } = React;
  const T = {
    bg: "var(--night-warm, #15130F)",
    bgFloor: "var(--night-floor, #0E0F14)",
    border: "var(--ash-deep, #1F2025)",
    borderActive: "var(--silk-gold, #C8A658)",
    text: "var(--bone, #C4B9AD)",
    textDim: "var(--ash-light, #5C5854)",
    accent: "var(--silk-gold, #C8A658)",
    ember: "var(--ember-live, #C46B3D)",
    serif: "var(--serif, 'EB Garamond', Garamond, serif)",
    mono: "var(--mono, 'JetBrains Mono', ui-monospace, monospace)"
  };
  function PatternListView({ go, patterns, loading }) {
    if (loading) {
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "120px 24px", textAlign: "center", color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "les motifs r\xE9currents s'organisent\u2026");
    }
    if (!patterns || patterns.length === 0) {
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "80px 24px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontStyle: "italic", fontSize: 18, color: T.text, marginBottom: 12 } }, "Aucun motif r\xE9current d\xE9tect\xE9 pour l'instant."), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, fontSize: 14, color: T.textDim, opacity: 0.85 } }, "Un motif \xE9merge quand un m\xEAme symbole/figure/lieu revient au moins 5 fois en 60 jours."));
    }
    return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 } }, patterns.map((p) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: p.id,
        onClick: () => go("recurring-re-entry", { pattern_id: p.id }),
        style: {
          textAlign: "left",
          background: p.trauma_flag ? "color-mix(in oklch, var(--ember-live) 6%, var(--night-warm))" : "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))",
          border: "1px solid " + (p.trauma_flag ? T.ember : T.border),
          padding: "14px 16px",
          cursor: "pointer",
          borderRadius: 2,
          color: T.text,
          fontFamily: T.serif
        }
      },
      /* @__PURE__ */ React.createElement("div", { style: {
        fontSize: 10.5,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: p.trauma_flag ? T.ember : T.accent,
        fontFamily: T.mono,
        marginBottom: 6,
        opacity: 0.85
      } }, p.pattern_kind, " \xB7 revient ", p.count_total, "\xD7"),
      /* @__PURE__ */ React.createElement("div", { style: { fontStyle: "italic", fontSize: 17, lineHeight: 1.5 } }, "\xAB ", p.pattern_text, " \xBB"),
      p.trauma_flag && /* @__PURE__ */ React.createElement("div", { style: {
        marginTop: 8,
        fontSize: 12.5,
        color: T.ember,
        opacity: 0.9,
        fontStyle: "italic"
      } }, "valence lourde \u2014 sanctuaire sugg\xE9r\xE9")
    )));
  }
  function ReEntrySessionView({ go, pattern, guidance, exitToHuman, onCapture, captured, captureBusy }) {
    const [text, setText] = uS("");
    if (exitToHuman) {
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "60px 24px", maxWidth: 600, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 22,
        lineHeight: 1.5,
        color: T.text,
        marginBottom: 18,
        textWrap: "pretty"
      } }, "Ce motif touche quelque chose de difficile."), /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontSize: 16,
        lineHeight: 1.65,
        color: T.textDim,
        marginBottom: 24,
        textWrap: "pretty"
      } }, "Ce que tu portes m\xE9rite une pr\xE9sence humaine. Je ne suis pas \xE9quip\xE9e pour t'accompagner dans ce qui s'ouvre. Quelqu'un peut t'\xE9couter d\xE8s maintenant."), /* @__PURE__ */ React.createElement("div", { style: {
        padding: "18px 20px",
        border: "1px solid " + T.borderActive,
        background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
        fontFamily: T.serif,
        fontSize: 15,
        lineHeight: 1.65,
        color: T.text
      } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("strong", null, "SOS Amiti\xE9"), " \xB7 09 72 39 40 50 (24/7)"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement("strong", null, "3114"), " \xB7 pr\xE9vention suicide (24/7, gratuit)"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, "SAMU"), " \xB7 15 \xB7 urgence vitale")), /* @__PURE__ */ React.createElement("button", { onClick: () => go("home"), style: {
        marginTop: 30,
        background: "transparent",
        border: "1px solid " + T.border,
        color: T.textDim,
        padding: "10px 20px",
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 14,
        cursor: "pointer",
        borderRadius: 0
      } }, "retour"));
    }
    if (!guidance) {
      return /* @__PURE__ */ React.createElement("div", { style: { padding: "120px 24px", textAlign: "center", color: T.textDim, fontFamily: T.serif, fontStyle: "italic" } }, "la re-entr\xE9e se pr\xE9pare\u2026");
    }
    const aizenstatAngle = guidance.aizenstat_angle || "Le personnage non-d\xE9cod\xE9. La voix qui n'a pas encore parl\xE9.";
    const reading = guidance.reading || "";
    const questions = Array.isArray(guidance.questions) ? guidance.questions.slice(0, 3) : [];
    return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 80px", maxWidth: 640, margin: "0 auto" } }, pattern && /* @__PURE__ */ React.createElement("div", { style: {
      marginBottom: 22,
      fontFamily: T.mono,
      fontSize: 11,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: T.accent,
      opacity: 0.78
    } }, "re-entr\xE9e consciente \xB7 5 min \xB7 ", pattern.pattern_kind), pattern && /* @__PURE__ */ React.createElement("div", { style: {
      marginBottom: 24,
      padding: "14px 16px",
      background: "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))",
      border: "1px solid " + T.border,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 17,
      lineHeight: 1.55,
      color: T.text,
      textWrap: "pretty"
    } }, "\xAB ", pattern.pattern_text, " \xBB revient dans ", pattern.count_total, " de tes r\xEAves."), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontSize: 17,
      lineHeight: 1.65,
      color: T.text,
      marginBottom: 24,
      textWrap: "pretty"
    } }, reading), /* @__PURE__ */ React.createElement("div", { style: {
      padding: "16px 18px",
      borderTop: "1px dashed color-mix(in oklch, var(--silk-gold) 28%, transparent)",
      borderBottom: "1px dashed color-mix(in oklch, var(--silk-gold) 28%, transparent)",
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 1.6,
      color: "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))",
      marginBottom: 24,
      textWrap: "pretty"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 10.5,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: T.accent,
      opacity: 0.85,
      fontFamily: T.mono,
      marginBottom: 8,
      fontStyle: "normal"
    } }, "angle Aizenstat"), aizenstatAngle), questions.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: T.textDim,
      marginBottom: 12,
      opacity: 0.78
    } }, "trois portes"), /* @__PURE__ */ React.createElement("ol", { style: {
      listStyle: "decimal inside",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 16,
      lineHeight: 1.55,
      color: T.text,
      textWrap: "pretty"
    } }, questions.map((q, i) => /* @__PURE__ */ React.createElement("li", { key: i }, q)))), !captured ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: T.textDim,
      marginBottom: 8,
      opacity: 0.78
    } }, "capture (facultatif)"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: text,
        onChange: (e) => setText(e.target.value),
        placeholder: "ce qui vient quand tu retournes l\xE0\u2026",
        rows: 5,
        style: {
          width: "100%",
          background: "color-mix(in oklch, var(--night-warm) 60%, transparent)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
          color: T.text,
          padding: 14,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 16,
          lineHeight: 1.55,
          resize: "vertical",
          outline: "none",
          borderRadius: 0
        }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onCapture(text),
        disabled: captureBusy,
        style: {
          background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
          border: "1px solid " + T.borderActive,
          color: T.accent,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          padding: "8px 18px",
          cursor: captureBusy ? "default" : "pointer",
          borderRadius: 0,
          opacity: captureBusy ? 0.6 : 1
        }
      },
      captureBusy ? "\u2026" : "garder"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => onCapture(null),
        disabled: captureBusy,
        style: {
          background: "transparent",
          border: "1px solid " + T.border,
          color: T.textDim,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          padding: "8px 18px",
          cursor: captureBusy ? "default" : "pointer",
          borderRadius: 0,
          opacity: captureBusy ? 0.6 : 1
        }
      },
      "fermer sans capture"
    ))) : /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: 30 } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 18,
      color: T.text,
      marginBottom: 18,
      textWrap: "pretty"
    } }, "C'est tenu. La trace est pos\xE9e."), /* @__PURE__ */ React.createElement("button", { onClick: () => go("home"), style: {
      background: "transparent",
      border: "1px solid " + T.borderActive,
      color: T.accent,
      padding: "10px 22px",
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14,
      cursor: "pointer",
      borderRadius: 0
    } }, "retour")));
  }
  function RecurringReEntryScreen({ go, ctx }) {
    const ctxObj = ctx && typeof ctx === "object" ? ctx : typeof ctx === "string" ? { pattern_id: ctx } : {};
    const initialPatternId = ctxObj.pattern_id || null;
    const [patterns, setPatterns] = uS([]);
    const [loadingList, setLoadingList] = uS(true);
    const [pattern, setPattern] = uS(null);
    const [guidance, setGuidance] = uS(null);
    const [exitToHuman, setExitToHuman] = uS(false);
    const [redirectingSanctuaire, setRedirectingSanctuaire] = uS(false);
    const [captured, setCaptured] = uS(false);
    const [captureBusy, setCaptureBusy] = uS(false);
    const [error, setError] = uS(null);
    const [phase, setPhase] = uS(initialPatternId ? "session" : "list");
    uE(() => {
      if (phase !== "list") return;
      let cancelled = false;
      setLoadingList(true);
      window.DreamAPI.listRecurringPatterns().then((res) => {
        if (cancelled) return;
        const all = ((res == null ? void 0 : res.patterns) || []).filter((p) => !p.acknowledged_at && !p.archived_at);
        setPatterns(all);
        setLoadingList(false);
      }).catch(() => {
        if (!cancelled) {
          setLoadingList(false);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [phase]);
    uE(() => {
      if (phase !== "session" || !initialPatternId) return;
      let cancelled = false;
      (async () => {
        try {
          const ack = await window.DreamAPI.acknowledgeRecurringPattern(initialPatternId);
          if (cancelled) return;
          if (!ack || !ack.pattern) {
            setError("Motif introuvable.");
            return;
          }
          setPattern(ack.pattern);
          if (ack.suggestion === "sanctuaire" || ack.pattern.trauma_flag) {
            setRedirectingSanctuaire(true);
            setTimeout(() => {
              if (!cancelled) go("nightmares");
            }, 1800);
            return;
          }
          const sess = await window.DreamAPI.startRecurringReEntry(initialPatternId, {});
          if (cancelled) return;
          if (sess == null ? void 0 : sess.exit_to_human) {
            setExitToHuman(true);
            return;
          }
          setGuidance((sess == null ? void 0 : sess.guidance) || {
            reading: "",
            questions: [],
            aizenstat_angle: "Le personnage non-d\xE9cod\xE9. La voix qui n'a pas encore parl\xE9."
          });
        } catch (e) {
          if (!cancelled) setError("La re-entr\xE9e n'a pas pu d\xE9marrer. R\xE9essaie plus tard.");
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [phase, initialPatternId]);
    const onCapture = uCB(async (text) => {
      setCaptureBusy(true);
      try {
        if (text && text.trim().length > 0) {
          await window.DreamAPI.startRecurringReEntry(initialPatternId, {
            capture_text: text.trim(),
            capture_method: "text"
          });
        }
      } catch (e) {
      }
      setCaptureBusy(false);
      setCaptured(true);
    }, [initialPatternId]);
    return /* @__PURE__ */ React.createElement("div", { style: {
      minHeight: "100vh",
      background: T.bgFloor,
      color: T.text,
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      position: "relative"
    } }, window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      opacity: 0.14
    } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "silk" })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1 } }, window.TopNav && /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 720, margin: "0 auto", padding: "20px 0 0" } }, /* @__PURE__ */ React.createElement("h1", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 28,
      lineHeight: 1.2,
      color: T.text,
      padding: "0 20px",
      marginBottom: 18,
      textWrap: "pretty"
    } }, phase === "list" ? "Motifs qui reviennent" : "Re-entr\xE9e"), error && /* @__PURE__ */ React.createElement("div", { style: {
      padding: "12px 18px",
      margin: "0 20px 18px",
      background: "color-mix(in oklch, var(--ember-live) 8%, transparent)",
      border: "1px solid " + T.ember,
      color: T.text,
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 14
    } }, error), redirectingSanctuaire ? /* @__PURE__ */ React.createElement("div", { style: { padding: "60px 24px", textAlign: "center", color: T.textDim, fontFamily: T.serif, fontStyle: "italic", fontSize: 16, textWrap: "pretty" } }, "Ce motif est lourd \u2014 je t'am\xE8ne vers le sanctuaire.") : phase === "list" ? /* @__PURE__ */ React.createElement(PatternListView, { go, patterns, loading: loadingList }) : /* @__PURE__ */ React.createElement(
      ReEntrySessionView,
      {
        go,
        pattern,
        guidance,
        exitToHuman,
        onCapture,
        captured,
        captureBusy
      }
    ))));
  }
  window.RecurringReEntryScreen = RecurringReEntryScreen;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1yZWN1cnJpbmcuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiBnbG9iYWwgUmVhY3QsIHdpbmRvdyAqL1xuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBSZWN1cnJpbmcgUmUtZW50cnkgXHUyMDE0IHNvdXMtYXBwIE1vZGUgUlx1MDBFQXZlIFJcdTAwRTljdXJyZW50IChGZWF0dXJlIDQsIDIwMjYtMDQtMjkpXG4vL1xuLy8gU3BlYyA6IDRfTE9HLm1kIDIwMjYtMDQtMjkgKE1vZGUgUlx1MDBFQXZlIFJcdTAwRTljdXJyZW50ICsgUmUtZW50cnkgQWl6ZW5zdGF0KS5cbi8vIENhdXNlLXJhY2luZTogTGUgTE9HIGR1IDI5LzA0IG5vdGFpdCBcIlVJIHJlLWVudHJ5IHBhcyBjclx1MDBFOVx1MDBFOWVcIiBcdTIwMTQgYm91Y2xlIG91dmVydGVcbi8vIGp1c3F1J1x1MDBFMCAyMDI2LTA0LTI5IChhdWRpdCBUMyBmZWF0dXJlIDQpLlxuLy9cbi8vIENvbXBvc2FudHMgZXhwb3J0XHUwMEU5cyA6XG4vLyAgIC0gd2luZG93LlJlY3VycmluZ1JlRW50cnlTY3JlZW4gOiByb3V0aW5nIGVudHJ5LiBTaSBwYXMgZGUgcGF0dGVybklkIGVuIGN0eCxcbi8vICAgICBsaXN0ZSBsZXMgcGF0dGVybnMgYWNrbm93bGVkZ2VkPW51bGwuIFNpIHBhdHRlcm5JZCBwclx1MDBFOXNlbnQsIGZldGNoICtcbi8vICAgICBhY2tub3dsZWRnZSArIGRcdTAwRTltYXJyZSByZS1lbnRyeSBzZXNzaW9uICg1IG1pbiwgMSBhbmdsZSBBaXplbnN0YXQpLlxuLy9cbi8vIEdhcmRlLWZvdXMgOlxuLy8gICAtIHRyYXVtYV9mbGFnIFx1MjE5MiByZWRpcmVjdCBTYW5jdHVhaXJlIChOaWdodG1hcmVzU2NyZWVuKSBBVkFOVCBkXHUwMEU5bWFycmFnZSBzZXNzaW9uLlxuLy8gICAtIGV4aXRfdG9faHVtYW4gKGNyaXNpcyBwYXR0ZXJuKSBcdTIxOTIgbWVzc2FnZSBkXHUwMEU5ZGlcdTAwRTkgKyBudW1cdTAwRTlyb3MgZCd1cmdlbmNlIHZpc2libGVzLlxuLy9cbi8vIEdyYW1tYWlyZSA6IGFsaWduXHUwMEU5ZSBEcmVhbSBtYWluIChuaWdodC13YXJtICsgRUIgR2FyYW1vbmQgaXRhbGljICsgc2lsay1nb2xkKS5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4oZnVuY3Rpb24gc2V0dXBSZWN1cnJpbmdTY3JlZW5zKCkge1xuICBjb25zdCB7IHVzZVN0YXRlOiB1UywgdXNlRWZmZWN0OiB1RSwgdXNlQ2FsbGJhY2s6IHVDQiB9ID0gUmVhY3Q7XG5cbiAgLy8gVG9rZW5zIERyZWFtIG1haW4gKG1cdTAwRUFtZXMgcXVlIHNjcmVlbnMtYmlnZHJlYW0uanN4KVxuICBjb25zdCBUID0ge1xuICAgIGJnOiAgICAgICAgICAgXCJ2YXIoLS1uaWdodC13YXJtLCAjMTUxMzBGKVwiLFxuICAgIGJnRmxvb3I6ICAgICAgXCJ2YXIoLS1uaWdodC1mbG9vciwgIzBFMEYxNClcIixcbiAgICBib3JkZXI6ICAgICAgIFwidmFyKC0tYXNoLWRlZXAsICMxRjIwMjUpXCIsXG4gICAgYm9yZGVyQWN0aXZlOiBcInZhcigtLXNpbGstZ29sZCwgI0M4QTY1OClcIixcbiAgICB0ZXh0OiAgICAgICAgIFwidmFyKC0tYm9uZSwgI0M0QjlBRClcIixcbiAgICB0ZXh0RGltOiAgICAgIFwidmFyKC0tYXNoLWxpZ2h0LCAjNUM1ODU0KVwiLFxuICAgIGFjY2VudDogICAgICAgXCJ2YXIoLS1zaWxrLWdvbGQsICNDOEE2NTgpXCIsXG4gICAgZW1iZXI6ICAgICAgICBcInZhcigtLWVtYmVyLWxpdmUsICNDNDZCM0QpXCIsXG4gICAgc2VyaWY6ICAgICAgICBcInZhcigtLXNlcmlmLCAnRUIgR2FyYW1vbmQnLCBHYXJhbW9uZCwgc2VyaWYpXCIsXG4gICAgbW9ubzogICAgICAgICBcInZhcigtLW1vbm8sICdKZXRCcmFpbnMgTW9ubycsIHVpLW1vbm9zcGFjZSwgbW9ub3NwYWNlKVwiLFxuICB9O1xuXG4gIGZ1bmN0aW9uIFBhdHRlcm5MaXN0Vmlldyh7IGdvLCBwYXR0ZXJucywgbG9hZGluZyB9KSB7XG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIxMjBweCAyNHB4XCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgY29sb3I6IFQudGV4dERpbSwgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgIGxlcyBtb3RpZnMgclx1MDBFOWN1cnJlbnRzIHMnb3JnYW5pc2VudFx1MjAyNlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIGlmICghcGF0dGVybnMgfHwgcGF0dGVybnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiODBweCAyNHB4XCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE4LCBjb2xvcjogVC50ZXh0LCBtYXJnaW5Cb3R0b206IDEyIH19PlxuICAgICAgICAgICAgQXVjdW4gbW90aWYgclx1MDBFOWN1cnJlbnQgZFx1MDBFOXRlY3RcdTAwRTkgcG91ciBsJ2luc3RhbnQuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTQsIGNvbG9yOiBULnRleHREaW0sIG9wYWNpdHk6IDAuODUgfX0+XG4gICAgICAgICAgICBVbiBtb3RpZiBcdTAwRTltZXJnZSBxdWFuZCB1biBtXHUwMEVBbWUgc3ltYm9sZS9maWd1cmUvbGlldSByZXZpZW50IGF1IG1vaW5zIDUgZm9pcyBlbiA2MCBqb3Vycy5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjAgMjBweFwiLCBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiAxNCB9fT5cbiAgICAgICAge3BhdHRlcm5zLm1hcCgocCkgPT4gKFxuICAgICAgICAgIDxidXR0b24ga2V5PXtwLmlkfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJyZWN1cnJpbmctcmUtZW50cnlcIiwgeyBwYXR0ZXJuX2lkOiBwLmlkIH0pfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogcC50cmF1bWFfZmxhZ1xuICAgICAgICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyLWxpdmUpIDYlLCB2YXIoLS1uaWdodC13YXJtKSlcIlxuICAgICAgICAgICAgICAgIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNSUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgKHAudHJhdW1hX2ZsYWcgPyBULmVtYmVyIDogVC5ib3JkZXIpLFxuICAgICAgICAgICAgICBwYWRkaW5nOiBcIjE0cHggMTZweFwiLFxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDIsXG4gICAgICAgICAgICAgIGNvbG9yOiBULnRleHQsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4xNmVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBwLnRyYXVtYV9mbGFnID8gVC5lbWJlciA6IFQuYWNjZW50LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIG1hcmdpbkJvdHRvbTogNiwgb3BhY2l0eTogMC44NSxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7cC5wYXR0ZXJuX2tpbmR9IFx1MDBCNyByZXZpZW50IHtwLmNvdW50X3RvdGFsfVx1MDBEN1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE3LCBsaW5lSGVpZ2h0OiAxLjUgfX0+XG4gICAgICAgICAgICAgIFx1MDBBQiB7cC5wYXR0ZXJuX3RleHR9IFx1MDBCQlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7cC50cmF1bWFfZmxhZyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDgsIGZvbnRTaXplOiAxMi41LCBjb2xvcjogVC5lbWJlciwgb3BhY2l0eTogMC45LFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgdmFsZW5jZSBsb3VyZGUgXHUyMDE0IHNhbmN0dWFpcmUgc3VnZ1x1MDBFOXJcdTAwRTlcbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBSZUVudHJ5U2Vzc2lvblZpZXcoeyBnbywgcGF0dGVybiwgZ3VpZGFuY2UsIGV4aXRUb0h1bWFuLCBvbkNhcHR1cmUsIGNhcHR1cmVkLCBjYXB0dXJlQnVzeSB9KSB7XG4gICAgY29uc3QgW3RleHQsIHNldFRleHRdID0gdVMoXCJcIik7XG5cbiAgICBpZiAoZXhpdFRvSHVtYW4pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCI2MHB4IDI0cHhcIiwgbWF4V2lkdGg6IDYwMCwgbWFyZ2luOiBcIjAgYXV0b1wiIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAyMiwgbGluZUhlaWdodDogMS41LCBjb2xvcjogVC50ZXh0LCBtYXJnaW5Cb3R0b206IDE4LFxuICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBDZSBtb3RpZiB0b3VjaGUgcXVlbHF1ZSBjaG9zZSBkZSBkaWZmaWNpbGUuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjY1LCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyNCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBDZSBxdWUgdHUgcG9ydGVzIG1cdTAwRTlyaXRlIHVuZSBwclx1MDBFOXNlbmNlIGh1bWFpbmUuIEplIG5lIHN1aXMgcGFzIFx1MDBFOXF1aXBcdTAwRTllIHBvdXJcbiAgICAgICAgICAgIHQnYWNjb21wYWduZXIgZGFucyBjZSBxdWkgcydvdXZyZS4gUXVlbHF1J3VuIHBldXQgdCdcdTAwRTljb3V0ZXIgZFx1MDBFOHMgbWFpbnRlbmFudC5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwYWRkaW5nOiBcIjE4cHggMjBweFwiLCBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgVC5ib3JkZXJBY3RpdmUsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTUsIGxpbmVIZWlnaHQ6IDEuNjUsIGNvbG9yOiBULnRleHQsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpbkJvdHRvbTogMTAgfX0+PHN0cm9uZz5TT1MgQW1pdGlcdTAwRTk8L3N0cm9uZz4gXHUwMEI3IDA5IDcyIDM5IDQwIDUwICgyNC83KTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDEwIH19PjxzdHJvbmc+MzExNDwvc3Ryb25nPiBcdTAwQjcgcHJcdTAwRTl2ZW50aW9uIHN1aWNpZGUgKDI0LzcsIGdyYXR1aXQpPC9kaXY+XG4gICAgICAgICAgICA8ZGl2PjxzdHJvbmc+U0FNVTwvc3Ryb25nPiBcdTAwQjcgMTUgXHUwMEI3IHVyZ2VuY2Ugdml0YWxlPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Ub3A6IDMwLCBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCIxcHggc29saWQgXCIgKyBULmJvcmRlcixcbiAgICAgICAgICAgIGNvbG9yOiBULnRleHREaW0sIHBhZGRpbmc6IFwiMTBweCAyMHB4XCIsIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNCwgY3Vyc29yOiBcInBvaW50ZXJcIiwgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgcmV0b3VyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoIWd1aWRhbmNlKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMTIwcHggMjRweFwiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIGNvbG9yOiBULnRleHREaW0sIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICBsYSByZS1lbnRyXHUwMEU5ZSBzZSBwclx1MDBFOXBhcmVcdTIwMjZcbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGFpemVuc3RhdEFuZ2xlID0gZ3VpZGFuY2UuYWl6ZW5zdGF0X2FuZ2xlIHx8IFwiTGUgcGVyc29ubmFnZSBub24tZFx1MDBFOWNvZFx1MDBFOS4gTGEgdm9peCBxdWkgbidhIHBhcyBlbmNvcmUgcGFybFx1MDBFOS5cIjtcbiAgICBjb25zdCByZWFkaW5nID0gZ3VpZGFuY2UucmVhZGluZyB8fCBcIlwiO1xuICAgIGNvbnN0IHF1ZXN0aW9ucyA9IEFycmF5LmlzQXJyYXkoZ3VpZGFuY2UucXVlc3Rpb25zKSA/IGd1aWRhbmNlLnF1ZXN0aW9ucy5zbGljZSgwLCAzKSA6IFtdO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIwIDIwcHggODBweFwiLCBtYXhXaWR0aDogNjQwLCBtYXJnaW46IFwiMCBhdXRvXCIgfX0+XG4gICAgICAgIHtwYXR0ZXJuICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IDIyLFxuICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTEsIGxldHRlclNwYWNpbmc6IFwiMC4xNmVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICBjb2xvcjogVC5hY2NlbnQsIG9wYWNpdHk6IDAuNzgsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICByZS1lbnRyXHUwMEU5ZSBjb25zY2llbnRlIFx1MDBCNyA1IG1pbiBcdTAwQjcge3BhdHRlcm4ucGF0dGVybl9raW5kfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHtwYXR0ZXJuICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IDI0LCBwYWRkaW5nOiBcIjE0cHggMTZweFwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNSUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBcIiArIFQuYm9yZGVyLFxuICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE3LCBsaW5lSGVpZ2h0OiAxLjU1LCBjb2xvcjogVC50ZXh0LFxuICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBcdTAwQUIge3BhdHRlcm4ucGF0dGVybl90ZXh0fSBcdTAwQkIgcmV2aWVudCBkYW5zIHtwYXR0ZXJuLmNvdW50X3RvdGFsfSBkZSB0ZXMgclx1MDBFQXZlcy5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFNpemU6IDE3LCBsaW5lSGVpZ2h0OiAxLjY1LCBjb2xvcjogVC50ZXh0LFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogMjQsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7cmVhZGluZ31cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIHBhZGRpbmc6IFwiMTZweCAxOHB4XCIsXG4gICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBkYXNoZWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI4JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiBcIjFweCBkYXNoZWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI4JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS42LCBjb2xvcjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgODAlLCB2YXIoLS1ib25lKSlcIixcbiAgICAgICAgICBtYXJnaW5Cb3R0b206IDI0LCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4xOGVtXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICBjb2xvcjogVC5hY2NlbnQsIG9wYWNpdHk6IDAuODUsIGZvbnRGYW1pbHk6IFQubW9ubyxcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogOCwgZm9udFN0eWxlOiBcIm5vcm1hbFwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgYW5nbGUgQWl6ZW5zdGF0XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2FpemVuc3RhdEFuZ2xlfVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7cXVlc3Rpb25zLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAyOCB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgY29sb3I6IFQudGV4dERpbSwgbWFyZ2luQm90dG9tOiAxMiwgb3BhY2l0eTogMC43OCxcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB0cm9pcyBwb3J0ZXNcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPG9sIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGxpc3RTdHlsZTogXCJkZWNpbWFsIGluc2lkZVwiLFxuICAgICAgICAgICAgICBwYWRkaW5nOiAwLCBtYXJnaW46IDAsXG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDEyLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3F1ZXN0aW9ucy5tYXAoKHEsIGkpID0+IDxsaSBrZXk9e2l9PntxfTwvbGk+KX1cbiAgICAgICAgICAgIDwvb2w+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgeyFjYXB0dXJlZCA/IChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMC41LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLCBjb2xvcjogVC50ZXh0RGltLCBtYXJnaW5Cb3R0b206IDgsIG9wYWNpdHk6IDAuNzgsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgY2FwdHVyZSAoZmFjdWx0YXRpZilcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgIHZhbHVlPXt0ZXh0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFRleHQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImNlIHF1aSB2aWVudCBxdWFuZCB0dSByZXRvdXJuZXMgbFx1MDBFMFx1MjAyNlwiXG4gICAgICAgICAgICAgIHJvd3M9ezV9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA2MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBULnRleHQsIHBhZGRpbmc6IDE0LFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICAgICAgICAgIHJlc2l6ZTogXCJ2ZXJ0aWNhbFwiLCBvdXRsaW5lOiBcIm5vbmVcIiwgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAxNiwgZGlzcGxheTogXCJmbGV4XCIsIGdhcDogMTIsIGZsZXhXcmFwOiBcIndyYXBcIiB9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBvbkNhcHR1cmUodGV4dCl9IGRpc2FibGVkPXtjYXB0dXJlQnVzeX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgXCIgKyBULmJvcmRlckFjdGl2ZSwgY29sb3I6IFQuYWNjZW50LFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjhweCAxOHB4XCIsIGN1cnNvcjogY2FwdHVyZUJ1c3kgPyBcImRlZmF1bHRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLCBvcGFjaXR5OiBjYXB0dXJlQnVzeSA/IDAuNiA6IDEsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge2NhcHR1cmVCdXN5ID8gXCJcdTIwMjZcIiA6IFwiZ2FyZGVyXCJ9XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG9uQ2FwdHVyZShudWxsKX0gZGlzYWJsZWQ9e2NhcHR1cmVCdXN5fVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgVC5ib3JkZXIsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiOHB4IDE4cHhcIiwgY3Vyc29yOiBjYXB0dXJlQnVzeSA/IFwiZGVmYXVsdFwiIDogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsIG9wYWNpdHk6IGNhcHR1cmVCdXN5ID8gMC42IDogMSxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBmZXJtZXIgc2FucyBjYXB0dXJlXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIG1hcmdpblRvcDogMzAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE4LFxuICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0LCBtYXJnaW5Cb3R0b206IDE4LCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBDJ2VzdCB0ZW51LiBMYSB0cmFjZSBlc3QgcG9zXHUwMEU5ZS5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIjFweCBzb2xpZCBcIiArIFQuYm9yZGVyQWN0aXZlLFxuICAgICAgICAgICAgICBjb2xvcjogVC5hY2NlbnQsIHBhZGRpbmc6IFwiMTBweCAyMnB4XCIsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLCBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgcmV0b3VyXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBSZWN1cnJpbmdSZUVudHJ5U2NyZWVuKHsgZ28sIGN0eCB9KSB7XG4gICAgY29uc3QgY3R4T2JqID0gKGN0eCAmJiB0eXBlb2YgY3R4ID09PSBcIm9iamVjdFwiKSA/IGN0eCA6ICh0eXBlb2YgY3R4ID09PSBcInN0cmluZ1wiID8geyBwYXR0ZXJuX2lkOiBjdHggfSA6IHt9KTtcbiAgICBjb25zdCBpbml0aWFsUGF0dGVybklkID0gY3R4T2JqLnBhdHRlcm5faWQgfHwgbnVsbDtcblxuICAgIGNvbnN0IFtwYXR0ZXJucywgc2V0UGF0dGVybnNdID0gdVMoW10pO1xuICAgIGNvbnN0IFtsb2FkaW5nTGlzdCwgc2V0TG9hZGluZ0xpc3RdID0gdVModHJ1ZSk7XG4gICAgY29uc3QgW3BhdHRlcm4sIHNldFBhdHRlcm5dID0gdVMobnVsbCk7XG4gICAgY29uc3QgW2d1aWRhbmNlLCBzZXRHdWlkYW5jZV0gPSB1UyhudWxsKTtcbiAgICBjb25zdCBbZXhpdFRvSHVtYW4sIHNldEV4aXRUb0h1bWFuXSA9IHVTKGZhbHNlKTtcbiAgICBjb25zdCBbcmVkaXJlY3RpbmdTYW5jdHVhaXJlLCBzZXRSZWRpcmVjdGluZ1NhbmN0dWFpcmVdID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtjYXB0dXJlZCwgc2V0Q2FwdHVyZWRdID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtjYXB0dXJlQnVzeSwgc2V0Q2FwdHVyZUJ1c3ldID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdVMobnVsbCk7XG4gICAgY29uc3QgW3BoYXNlLCBzZXRQaGFzZV0gPSB1Uyhpbml0aWFsUGF0dGVybklkID8gXCJzZXNzaW9uXCIgOiBcImxpc3RcIik7XG5cbiAgICAvLyBNb2RlIGxpc3RlIDogY2hhcmdlIHRvdXMgbGVzIHBhdHRlcm5zIG5vbi1hY2tub3dsZWRnZWRcbiAgICB1RSgoKSA9PiB7XG4gICAgICBpZiAocGhhc2UgIT09IFwibGlzdFwiKSByZXR1cm47XG4gICAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgICBzZXRMb2FkaW5nTGlzdCh0cnVlKTtcbiAgICAgIHdpbmRvdy5EcmVhbUFQSS5saXN0UmVjdXJyaW5nUGF0dGVybnMoKVxuICAgICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgIGNvbnN0IGFsbCA9IChyZXM/LnBhdHRlcm5zIHx8IFtdKS5maWx0ZXIoKHApID0+ICFwLmFja25vd2xlZGdlZF9hdCAmJiAhcC5hcmNoaXZlZF9hdCk7XG4gICAgICAgICAgc2V0UGF0dGVybnMoYWxsKTtcbiAgICAgICAgICBzZXRMb2FkaW5nTGlzdChmYWxzZSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IGlmICghY2FuY2VsbGVkKSB7IHNldExvYWRpbmdMaXN0KGZhbHNlKTsgfSB9KTtcbiAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gICAgfSwgW3BoYXNlXSk7XG5cbiAgICAvLyBNb2RlIHNlc3Npb24gOiBhY2tub3dsZWRnZSArIHN0YXJ0IHJlLWVudHJ5XG4gICAgdUUoKCkgPT4ge1xuICAgICAgaWYgKHBoYXNlICE9PSBcInNlc3Npb25cIiB8fCAhaW5pdGlhbFBhdHRlcm5JZCkgcmV0dXJuO1xuICAgICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgICAgKGFzeW5jICgpID0+IHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyAxLiBhY2tub3dsZWRnZSBcdTIxOTIgclx1MDBFOWN1cFx1MDBFOHJlIHBhdHRlcm4gKyBzdWdnZXN0aW9uXG4gICAgICAgICAgY29uc3QgYWNrID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLmFja25vd2xlZGdlUmVjdXJyaW5nUGF0dGVybihpbml0aWFsUGF0dGVybklkKTtcbiAgICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgICAgaWYgKCFhY2sgfHwgIWFjay5wYXR0ZXJuKSB7XG4gICAgICAgICAgICBzZXRFcnJvcihcIk1vdGlmIGludHJvdXZhYmxlLlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2V0UGF0dGVybihhY2sucGF0dGVybik7XG5cbiAgICAgICAgICAvLyAyLiB0cmF1bWFfZmxhZyBcdTIxOTIgcmVkaXJlY3Qgc2FuY3R1YWlyZVxuICAgICAgICAgIGlmIChhY2suc3VnZ2VzdGlvbiA9PT0gXCJzYW5jdHVhaXJlXCIgfHwgYWNrLnBhdHRlcm4udHJhdW1hX2ZsYWcpIHtcbiAgICAgICAgICAgIHNldFJlZGlyZWN0aW5nU2FuY3R1YWlyZSh0cnVlKTtcbiAgICAgICAgICAgIC8vIHNvZnQgZGVsYXkgcG91ciBxdWUgdXNlciB2b2llIGxlIG1lc3NhZ2VcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBpZiAoIWNhbmNlbGxlZCkgZ28oXCJuaWdodG1hcmVzXCIpOyB9LCAxODAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyAzLiBzdGFydCByZS1lbnRyeSBzZXNzaW9uXG4gICAgICAgICAgY29uc3Qgc2VzcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5zdGFydFJlY3VycmluZ1JlRW50cnkoaW5pdGlhbFBhdHRlcm5JZCwge30pO1xuICAgICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgICBpZiAoc2Vzcz8uZXhpdF90b19odW1hbikge1xuICAgICAgICAgICAgc2V0RXhpdFRvSHVtYW4odHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHNldEd1aWRhbmNlKHNlc3M/Lmd1aWRhbmNlIHx8IHtcbiAgICAgICAgICAgIHJlYWRpbmc6IFwiXCIsXG4gICAgICAgICAgICBxdWVzdGlvbnM6IFtdLFxuICAgICAgICAgICAgYWl6ZW5zdGF0X2FuZ2xlOiBcIkxlIHBlcnNvbm5hZ2Ugbm9uLWRcdTAwRTljb2RcdTAwRTkuIExhIHZvaXggcXVpIG4nYSBwYXMgZW5jb3JlIHBhcmxcdTAwRTkuXCIsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoIWNhbmNlbGxlZCkgc2V0RXJyb3IoXCJMYSByZS1lbnRyXHUwMEU5ZSBuJ2EgcGFzIHB1IGRcdTAwRTltYXJyZXIuIFJcdTAwRTllc3NhaWUgcGx1cyB0YXJkLlwiKTtcbiAgICAgICAgfVxuICAgICAgfSkoKTtcbiAgICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gICAgfSwgW3BoYXNlLCBpbml0aWFsUGF0dGVybklkXSk7XG5cbiAgICBjb25zdCBvbkNhcHR1cmUgPSB1Q0IoYXN5bmMgKHRleHQpID0+IHtcbiAgICAgIHNldENhcHR1cmVCdXN5KHRydWUpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5zdGFydFJlY3VycmluZ1JlRW50cnkoaW5pdGlhbFBhdHRlcm5JZCwge1xuICAgICAgICAgICAgY2FwdHVyZV90ZXh0OiB0ZXh0LnRyaW0oKSxcbiAgICAgICAgICAgIGNhcHR1cmVfbWV0aG9kOiBcInRleHRcIixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7fVxuICAgICAgc2V0Q2FwdHVyZUJ1c3koZmFsc2UpO1xuICAgICAgc2V0Q2FwdHVyZWQodHJ1ZSk7XG4gICAgfSwgW2luaXRpYWxQYXR0ZXJuSWRdKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgICBiYWNrZ3JvdW5kOiBULmJnRmxvb3IsXG4gICAgICAgIGNvbG9yOiBULnRleHQsXG4gICAgICAgIHBhZGRpbmdUb3A6IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMHB4KSArIDE4cHgpXCIsXG4gICAgICAgIHBhZGRpbmdCb3R0b206IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSwgMHB4KSArIDExMHB4KVwiLFxuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgfX0+XG4gICAgICAgIHsvKiBIYWxvUmVzcGlyZSBzaWxrIHN1YnRpbCBlbiBiYWNrZ3JvdW5kICovfVxuICAgICAgICB7d2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsIHpJbmRleDogMCxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuMTQsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8d2luZG93LkhhbG9SZXNwaXJlIGtpbmQ9XCJzaWxrXCIgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMSB9fT5cbiAgICAgICAgICB7d2luZG93LlRvcE5hdiAmJiA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gbGFiZWw9XCJcIiAvPn1cblxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWF4V2lkdGg6IDcyMCwgbWFyZ2luOiBcIjAgYXV0b1wiLCBwYWRkaW5nOiBcIjIwcHggMCAwXCIgfX0+XG4gICAgICAgICAgICA8aDEgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjgsIGxpbmVIZWlnaHQ6IDEuMiwgY29sb3I6IFQudGV4dCxcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIwIDIwcHhcIiwgbWFyZ2luQm90dG9tOiAxOCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3BoYXNlID09PSBcImxpc3RcIiA/IFwiTW90aWZzIHF1aSByZXZpZW5uZW50XCIgOiBcIlJlLWVudHJcdTAwRTllXCJ9XG4gICAgICAgICAgICA8L2gxPlxuXG4gICAgICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcGFkZGluZzogXCIxMnB4IDE4cHhcIiwgbWFyZ2luOiBcIjAgMjBweCAxOHB4XCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyLWxpdmUpIDglLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIFwiICsgVC5lbWJlciwgY29sb3I6IFQudGV4dCxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIHtyZWRpcmVjdGluZ1NhbmN0dWFpcmUgPyAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCI2MHB4IDI0cHhcIiwgdGV4dEFsaWduOiBcImNlbnRlclwiLCBjb2xvcjogVC50ZXh0RGltLCBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNiwgdGV4dFdyYXA6IFwicHJldHR5XCIgfX0+XG4gICAgICAgICAgICAgICAgQ2UgbW90aWYgZXN0IGxvdXJkIFx1MjAxNCBqZSB0J2FtXHUwMEU4bmUgdmVycyBsZSBzYW5jdHVhaXJlLlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICkgOiBwaGFzZSA9PT0gXCJsaXN0XCIgPyAoXG4gICAgICAgICAgICAgIDxQYXR0ZXJuTGlzdFZpZXcgZ289e2dvfSBwYXR0ZXJucz17cGF0dGVybnN9IGxvYWRpbmc9e2xvYWRpbmdMaXN0fSAvPlxuICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgPFJlRW50cnlTZXNzaW9uVmlld1xuICAgICAgICAgICAgICAgIGdvPXtnb31cbiAgICAgICAgICAgICAgICBwYXR0ZXJuPXtwYXR0ZXJufVxuICAgICAgICAgICAgICAgIGd1aWRhbmNlPXtndWlkYW5jZX1cbiAgICAgICAgICAgICAgICBleGl0VG9IdW1hbj17ZXhpdFRvSHVtYW59XG4gICAgICAgICAgICAgICAgb25DYXB0dXJlPXtvbkNhcHR1cmV9XG4gICAgICAgICAgICAgICAgY2FwdHVyZWQ9e2NhcHR1cmVkfVxuICAgICAgICAgICAgICAgIGNhcHR1cmVCdXN5PXtjYXB0dXJlQnVzeX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHdpbmRvdy5SZWN1cnJpbmdSZUVudHJ5U2NyZWVuID0gUmVjdXJyaW5nUmVFbnRyeVNjcmVlbjtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiQ0FvQkMsU0FBUyx3QkFBd0I7QUFDaEMsUUFBTSxFQUFFLFVBQVUsSUFBSSxXQUFXLElBQUksYUFBYSxJQUFJLElBQUk7QUFHMUQsUUFBTSxJQUFJO0FBQUEsSUFDUixJQUFjO0FBQUEsSUFDZCxTQUFjO0FBQUEsSUFDZCxRQUFjO0FBQUEsSUFDZCxjQUFjO0FBQUEsSUFDZCxNQUFjO0FBQUEsSUFDZCxTQUFjO0FBQUEsSUFDZCxRQUFjO0FBQUEsSUFDZCxPQUFjO0FBQUEsSUFDZCxPQUFjO0FBQUEsSUFDZCxNQUFjO0FBQUEs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
