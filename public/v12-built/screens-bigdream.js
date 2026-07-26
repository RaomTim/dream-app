(function setupBigDreamScreens() {
  const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;
  const T = {
    bg: "var(--night-warm, #15130F)",
    bgFloor: "var(--night-floor, #0E0F14)",
    bgSoft: "color-mix(in oklch, var(--paper-warm, #B89E7C) 6%, transparent)",
    bgSilkSoft: "color-mix(in oklch, var(--silk-gold, #C8A658) 5%, transparent)",
    border: "var(--ash-deep, #1F2025)",
    borderActive: "var(--silk-gold, #C8A658)",
    text: "var(--bone, #C4B9AD)",
    textDim: "var(--ash-light, #5C5854)",
    textMuted: "var(--ash-mid, #363430)",
    accent: "var(--silk-gold, #C8A658)",
    ember: "var(--ember-live, #C46B3D)",
    paper: "var(--paper-warm, #B89E7C)",
    stone: "var(--stone-cool, #6F7C88)",
    serif: "var(--serif, 'EB Garamond', Garamond, serif)",
    sans: "var(--sans, Inter, system-ui, sans-serif)",
    mono: "var(--mono, 'JetBrains Mono', ui-monospace, monospace)"
  };
  const STEP_META = {
    1: {
      kind: "silence",
      label: "Silence",
      title: "juste poser, ne rien interpr\xE9ter",
      desc: "Aujourd'hui, ne fais rien. Re-lis le r\xEAve. Laisse-le \xEAtre. Aucune capture obligatoire.",
      placeholder: "(facultatif) un mot, une sensation, ce qui surnage\u2026"
    },
    2: {
      kind: "image_or_drawing",
      label: "Image / dessin",
      title: "une image, un dessin, ou la description d'une image",
      desc: "Si une image vient, d\xE9pose-la (texte ou photo). Si rien ne vient, d\xE9cris une image qui pourrait porter le r\xEAve.",
      placeholder: "ce que je vois, ce que je dessinerais, ce qui prend forme\u2026"
    },
    3: {
      kind: "dialogue_personnage",
      label: "Dialogue avec un personnage",
      title: "parler \xE0 un personnage du r\xEAve",
      desc: "Choisis une figure du r\xEAve. Pose-lui une question. \xC9coute ce qu'elle dit (mode incarnation Aizenstat \u2014 tu peux \xE9crire les deux voix).",
      placeholder: "moi : \u2026 / la figure : \u2026"
    },
    4: {
      kind: "polyphonie_3_voix",
      label: "Polyphonie 3 voix",
      title: "lecture polyphonique paper / stone / silk",
      desc: "Convoque les 3 voix de la For\xEAt sur ce r\xEAve. Aucune ne dit le sens. Lequel r\xE9sonne ?",
      placeholder: "ce qui m'a touch\xE9 dans une voix, ce qui m'a r\xE9sist\xE9\u2026",
      hasAction: "polyphony"
      // bouton qui appelle /api/dream-chat/converse force_polyphony=true
    },
    5: {
      kind: "correlations_foret",
      label: "Corr\xE9lations For\xEAt \xE9tendues",
      title: "5-7 chunks For\xEAt vs 3 standard",
      desc: "Recherche cibl\xE9e dans la biblioth\xE8que pour ce r\xEAve. Pas pour d\xE9coder \u2014 pour entendre les voix qui r\xE9sonnent.",
      placeholder: "ce qui s'est ouvert avec les voix For\xEAt\u2026",
      hasAction: "forest"
      // bouton qui appelle forestReading
    },
    6: {
      kind: "oracle_corps",
      label: "Oracle du Corps",
      title: "o\xF9 le r\xEAve vit dans ton corps",
      desc: "Sensation associ\xE9e au r\xEAve. Lecture corps 3 voix. Pas dans la t\xEAte \u2014 dans la chair.",
      placeholder: "o\xF9 \xE7a vit dans le corps, ce qui se passe quand j'y reviens\u2026",
      hasAction: "body"
    },
    7: {
      kind: "letter_to_self",
      label: "Lettre \xE0 toi-m\xEAme",
      title: "synth\xE8se narrative ~400-500 mots",
      desc: "L'app tisse une lettre \xE0 partir de tes 6 captures. Tu peux l'amender ou la garder telle quelle.",
      placeholder: "(la lettre est g\xE9n\xE9r\xE9e automatiquement \u2014 clique le bouton ci-dessous)",
      hasAction: "closing_letter"
    }
  };
  function WorkflowOverview({ workflow, steps, onSelectDay }) {
    const currentDay = (workflow == null ? void 0 : workflow.current_day) || 1;
    const closed = !!(workflow == null ? void 0 : workflow.closed_at);
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, [1, 2, 3, 4, 5, 6, 7].map((d) => {
      const meta = STEP_META[d];
      const step = (steps || []).find((s) => s.day === d);
      const completed = !!(step == null ? void 0 : step.completed_at);
      const isCurrent = d === currentDay && !closed;
      const borderColor = completed ? T.borderActive : isCurrent ? T.ember : T.border;
      const bg = completed ? T.bgSilkSoft : isCurrent ? "color-mix(in oklch, var(--ember-live) 4%, transparent)" : "transparent";
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: d,
          onClick: () => onSelectDay && onSelectDay(d),
          style: {
            textAlign: "left",
            background: bg,
            border: `1px solid ${borderColor}`,
            color: T.text,
            padding: "14px 16px",
            cursor: "pointer",
            fontFamily: T.sans,
            transition: "border-color 200ms ease, background 200ms ease"
          }
        },
        /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("div", { style: {
          fontFamily: T.mono,
          fontSize: 10.5,
          letterSpacing: "0.1em",
          color: completed ? T.accent : isCurrent ? T.ember : T.textDim
        } }, "J", d, " \u2014 ", meta.label.toUpperCase()), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10.5, color: T.textDim } }, completed ? "\u2713 tenu" : isCurrent ? "\u2190 aujourd'hui" : "")),
        /* @__PURE__ */ React.createElement("div", { style: {
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 16,
          color: T.text,
          marginTop: 6,
          lineHeight: 1.4
        } }, meta.title),
        (step == null ? void 0 : step.user_capture) && /* @__PURE__ */ React.createElement("div", { style: {
          fontFamily: T.serif,
          fontSize: 13,
          color: T.textDim,
          marginTop: 8,
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        } }, step.user_capture.slice(0, 180), step.user_capture.length > 180 ? "\u2026" : "")
      );
    }));
  }
  function WorkflowDayDetail({ workflow, kairos, day, step, onComplete, onBack, onGenerateClosingLetter }) {
    const meta = STEP_META[day];
    const [capture, uCap] = uS((step == null ? void 0 : step.user_capture) || "");
    const [voice, uVoice] = uS(!!(step == null ? void 0 : step.user_capture_voice));
    const [saving, uSav] = uS(false);
    const [error, uErr] = uS(null);
    const [letterLoading, uLL] = uS(false);
    const [generatedLetter, uGL] = uS(null);
    uE(() => {
      uCap((step == null ? void 0 : step.user_capture) || "");
      uVoice(!!(step == null ? void 0 : step.user_capture_voice));
      uErr(null);
      uGL(null);
    }, [step == null ? void 0 : step.day]);
    const handleSave = async () => {
      if (saving) return;
      if (capture.trim().length < 1 && day !== 1 && day !== 7) {
        uErr("d\xE9pose au moins quelques mots");
        return;
      }
      uSav(true);
      uErr(null);
      try {
        const res = await window.DreamAPI.completeBigDreamStep(workflow.id, day, {
          capture_text: capture.trim() || null,
          capture_voice: voice
        });
        if (res == null ? void 0 : res._seed) throw new Error("connexion impossible");
        if (onComplete) onComplete(res);
      } catch (e) {
        uErr(e && e.message || "erreur");
      } finally {
        uSav(false);
      }
    };
    const handleGenerateLetter = async () => {
      if (letterLoading) return;
      uLL(true);
      uErr(null);
      try {
        const res = await window.DreamAPI.generateBigDreamClosingLetter(workflow.id);
        if (res == null ? void 0 : res.closing_letter) {
          uGL(res.closing_letter);
          uCap(res.closing_letter);
          if (onGenerateClosingLetter) onGenerateClosingLetter(res);
        } else if (res == null ? void 0 : res.error) {
          uErr(res.error);
        } else {
          uErr("la lettre n'a pas pu \xEAtre tiss\xE9e");
        }
      } catch (e) {
        uErr(e && e.message || "erreur");
      } finally {
        uLL(false);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.1em",
      color: T.accent,
      marginBottom: 8
    } }, "J", day, " \u2014 ", meta.label.toUpperCase()), /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 24,
      color: T.text,
      lineHeight: 1.35,
      margin: 0
    } }, meta.title), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 15,
      color: T.textDim,
      lineHeight: 1.6,
      marginTop: 10
    } }, meta.desc)), (kairos == null ? void 0 : kairos.raw_text) && /* @__PURE__ */ React.createElement("div", { style: {
      border: `1px solid ${T.border}`,
      background: T.bgSoft,
      padding: 14
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10,
      letterSpacing: "0.1em",
      color: T.paper,
      marginBottom: 6
    } }, "R\xCAVE INITIAL"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 14,
      fontStyle: "italic",
      color: T.text,
      lineHeight: 1.55,
      margin: 0,
      display: "-webkit-box",
      WebkitLineClamp: 4,
      WebkitBoxOrient: "vertical",
      overflow: "hidden"
    } }, kairos.raw_text)), day === 7 && !generatedLetter && !(step == null ? void 0 : step.completed_at) && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleGenerateLetter,
        disabled: letterLoading,
        style: {
          padding: "14px 18px",
          border: `1px solid ${T.borderActive}`,
          background: T.bgSilkSoft,
          color: T.accent,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 16,
          cursor: letterLoading ? "wait" : "pointer",
          opacity: letterLoading ? 0.6 : 1
        }
      },
      letterLoading ? "la lettre se tisse\u2026" : "tisser la lettre maintenant (~400-500 mots)"
    ), day === 7 && (generatedLetter || (step == null ? void 0 : step.user_capture)) && /* @__PURE__ */ React.createElement("div", { style: {
      border: `1px solid ${T.borderActive}`,
      background: T.bgSilkSoft,
      padding: 16
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.1em",
      color: T.accent,
      marginBottom: 10
    } }, "LETTRE \u2014 TISS\xC9E POUR TOI"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 16,
      color: T.text,
      lineHeight: 1.7,
      whiteSpace: "pre-wrap",
      margin: 0,
      textWrap: "pretty"
    } }, generatedLetter || (step == null ? void 0 : step.user_capture))), !(day === 7 && (generatedLetter || (step == null ? void 0 : step.user_capture))) && /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: capture,
        onChange: (e) => uCap(e.target.value),
        placeholder: meta.placeholder,
        rows: day === 1 ? 4 : 8,
        style: {
          width: "100%",
          minHeight: day === 1 ? 80 : 160,
          background: "transparent",
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 16,
          lineHeight: 1.6,
          padding: 12,
          outline: "none",
          resize: "vertical"
        }
      }
    ), /* @__PURE__ */ React.createElement("label", { style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      cursor: "pointer"
    } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: voice,
        onChange: (e) => uVoice(e.target.checked),
        style: { accentColor: T.accent }
      }
    ), "capture vocale (\xE0 venir : transcription Whisper)"), error && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontSize: 13,
      fontStyle: "italic",
      color: T.ember
    } }, error), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
      gap: 12
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onBack,
        style: {
          background: "transparent",
          border: "none",
          color: T.textDim,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          cursor: "pointer"
        }
      },
      "\u2190 retour"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSave,
        disabled: saving,
        style: {
          padding: "10px 18px",
          border: `1px solid ${T.borderActive}`,
          background: "transparent",
          color: T.accent,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 15,
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? 0.6 : 1
        }
      },
      saving ? "d\xE9poser\u2026" : (step == null ? void 0 : step.completed_at) ? "mettre \xE0 jour" : "tenir ce jour"
    )));
  }
  function HumanPushRequestModal({ workflowId, kairosId, onClose, onSubmitted }) {
    var _a;
    const [text, uText] = uS("");
    const [submitting, uSub] = uS(false);
    const [error, uErr] = uS(null);
    const [submitted, uDone] = uS(null);
    const handleSubmit = async () => {
      if (text.trim().length < 10) {
        uErr("dis quelques mots de plus \xE0 la praticienne (min 10 caract\xE8res)");
        return;
      }
      uSub(true);
      uErr(null);
      try {
        const res = await window.DreamAPI.requestBigDreamHumanPush({
          workflow_id: workflowId || null,
          kairos_id: kairosId || null,
          user_request_text: text.trim()
        });
        if ((res == null ? void 0 : res._seed) || !(res == null ? void 0 : res.push)) throw new Error("connexion impossible");
        uDone(res);
        if (onSubmitted) onSubmitted(res);
      } catch (e) {
        uErr(e && e.message || "erreur");
      } finally {
        uSub(false);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { style: {
      position: "fixed",
      inset: 0,
      background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
      zIndex: 1e3,
      display: "grid",
      placeItems: "center",
      padding: 16
    }, onClick: onClose }, /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: 520,
      width: "100%",
      background: T.bg,
      border: `1px solid ${T.border}`,
      padding: 24
    }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.1em",
      color: T.accent,
      marginBottom: 8
    } }, "DEMANDER UN REGARD HUMAIN"), /* @__PURE__ */ React.createElement("h3", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 22,
      color: T.text,
      lineHeight: 1.35,
      marginTop: 0,
      marginBottom: 12
    } }, "Une praticienne form\xE9e Aizenstat / Moss / Hopcke peut tenir ce r\xEAve avec toi."), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 14,
      color: T.textDim,
      lineHeight: 1.6,
      marginBottom: 16
    } }, /* @__PURE__ */ React.createElement("strong", { style: { color: T.accent } }, "30\u20AC"), " \xB7 r\xE9ponse \xE9crite sous 7 jours \xB7 pas un diagnostic, un compagnonnage."), !submitted && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        value: text,
        onChange: (e) => uText(e.target.value),
        placeholder: "ce que tu veux que la praticienne sache, la question qui revient, ce qui p\xE8se\u2026",
        rows: 6,
        style: {
          width: "100%",
          minHeight: 140,
          background: "transparent",
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 15,
          lineHeight: 1.55,
          padding: 12,
          outline: "none",
          resize: "vertical"
        }
      }
    ), error && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.serif,
      fontSize: 13,
      fontStyle: "italic",
      color: T.ember,
      marginTop: 10
    } }, error), /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        style: {
          background: "transparent",
          border: "none",
          color: T.textDim,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          cursor: "pointer"
        }
      },
      "refermer"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSubmit,
        disabled: submitting,
        style: {
          padding: "10px 18px",
          border: `1px solid ${T.borderActive}`,
          background: T.bgSilkSoft,
          color: T.accent,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 15,
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.6 : 1
        }
      },
      submitting ? "envoi\u2026" : "demander (30\u20AC)"
    ))), submitted && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 16,
      fontStyle: "italic",
      color: T.text,
      lineHeight: 1.6
    } }, "Ta demande est partie. La praticienne reviendra vers toi sous 7 jours."), ((_a = submitted.payment) == null ? void 0 : _a.stub) && /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 11,
      color: T.textDim,
      marginTop: 12,
      padding: 10,
      border: `1px dashed ${T.border}`
    } }, "MVP : Stripe stub \u2014 la facturation r\xE9elle arrive en V1.5. Intent ID : ", submitted.payment.payment_intent_id), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 16 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        style: {
          padding: "10px 18px",
          border: `1px solid ${T.borderActive}`,
          background: "transparent",
          color: T.accent,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 15,
          cursor: "pointer"
        }
      },
      "refermer"
    )))));
  }
  function BigDreamWorkflowScreen({ go, ctx }) {
    const ctxObj = typeof ctx === "string" ? { workflow_id: ctx } : ctx || {};
    const [workflowId, uWid] = uS(ctxObj.workflow_id || null);
    const [workflow, uWf] = uS(null);
    const [steps, uSteps] = uS([]);
    const [kairos, uK] = uS(null);
    const [loading, uLoad] = uS(true);
    const [error, uErr] = uS(null);
    const [selectedDay, uSelDay] = uS(null);
    const [showPush, uShowPush] = uS(false);
    uE(() => {
      let cancelled = false;
      async function bootstrap() {
        var _a;
        uLoad(true);
        uErr(null);
        try {
          let wid = workflowId;
          if (!wid && ctxObj.kairos_id) {
            const startRes = await window.DreamAPI.startBigDreamWorkflow(ctxObj.kairos_id);
            if (startRes == null ? void 0 : startRes._seed) throw new Error("impossible de cr\xE9er le workflow");
            if ((_a = startRes == null ? void 0 : startRes.workflow) == null ? void 0 : _a.id) {
              wid = startRes.workflow.id;
              if (!cancelled) uWid(wid);
            } else if (startRes == null ? void 0 : startRes.error) {
              throw new Error(startRes.error);
            }
          }
          if (!wid) {
            if (!cancelled) {
              uErr("aucun workflow ni kairos fourni");
              uLoad(false);
            }
            return;
          }
          const res = await window.DreamAPI.getBigDreamWorkflow(wid);
          if (cancelled) return;
          if ((res == null ? void 0 : res._seed) || !(res == null ? void 0 : res.workflow)) throw new Error("workflow introuvable");
          uWf(res.workflow);
          uSteps(res.steps || []);
          uK(res.kairos || null);
          uSelDay(res.workflow.current_day || 1);
        } catch (e) {
          if (!cancelled) uErr(e && e.message || "erreur");
        } finally {
          if (!cancelled) uLoad(false);
        }
      }
      bootstrap();
      return () => {
        cancelled = true;
      };
    }, [ctxObj.kairos_id, ctxObj.workflow_id]);
    const refresh = async () => {
      if (!workflowId) return;
      const res = await window.DreamAPI.getBigDreamWorkflow(workflowId);
      if (res == null ? void 0 : res.workflow) {
        uWf(res.workflow);
        uSteps(res.steps || []);
        uK(res.kairos || null);
      }
    };
    const onStepComplete = async () => {
      await refresh();
    };
    const currentStep = selectedDay ? (steps || []).find((s) => s.day === selectedDay) : null;
    if (loading) {
      return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: T.bgFloor, color: T.text, minHeight: "100vh", padding: "24px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: {
        fontFamily: T.serif,
        fontStyle: "italic",
        color: T.textDim,
        textAlign: "center",
        marginTop: 40,
        fontSize: 16
      } }, "le workflow se pr\xE9pare\u2026"));
    }
    if (error) {
      return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: T.bgFloor, color: T.text, minHeight: "100vh", padding: "24px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: T.serif, color: T.ember, fontSize: 15 } }, error), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => go && go("home"),
          style: {
            marginTop: 16,
            padding: "10px 18px",
            border: `1px solid ${T.border}`,
            background: "transparent",
            color: T.text,
            cursor: "pointer",
            fontFamily: T.serif
          }
        },
        "\u2190 retour"
      ));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: {
      background: T.bgFloor,
      color: T.text,
      minHeight: "100vh",
      fontFamily: T.sans,
      padding: "20px 16px 100px"
    } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => go && go(kairos ? "kairos" : "home", kairos == null ? void 0 : kairos.id),
        style: {
          background: "transparent",
          border: "none",
          color: T.textDim,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 14,
          cursor: "pointer"
        }
      },
      "\u2190 retour"
    ), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.1em",
      color: T.accent
    } }, "BIG DREAM \xB7 7 JOURS")), /* @__PURE__ */ React.createElement("h1", { style: {
      fontFamily: T.serif,
      fontStyle: "italic",
      fontSize: 28,
      lineHeight: 1.3,
      color: T.text,
      margin: "0 0 8px 0"
    } }, "tenir ce r\xEAve sur 7 jours"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 14,
      color: T.textDim,
      lineHeight: 1.55,
      marginBottom: 20,
      maxWidth: 540
    } }, "Un rituel par jour. Le r\xEAve continue \xE0 parler tant qu'on le tient.", (workflow == null ? void 0 : workflow.closed_at) ? " \u2014 referm\xE9." : ""), selectedDay && currentStep ? /* @__PURE__ */ React.createElement(
      WorkflowDayDetail,
      {
        workflow,
        kairos,
        day: selectedDay,
        step: currentStep,
        onComplete: onStepComplete,
        onBack: () => uSelDay(null),
        onGenerateClosingLetter: refresh
      }
    ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      WorkflowOverview,
      {
        workflow,
        steps,
        onSelectDay: (d) => uSelDay(d)
      }
    ), /* @__PURE__ */ React.createElement("div", { style: {
      marginTop: 28,
      padding: 16,
      border: `1px solid ${T.border}`,
      background: T.bgSoft
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: T.mono,
      fontSize: 10.5,
      letterSpacing: "0.1em",
      color: T.paper,
      marginBottom: 8
    } }, "BESOIN D'UN REGARD HUMAIN ?"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: T.serif,
      fontSize: 14,
      color: T.text,
      lineHeight: 1.55,
      marginTop: 0,
      marginBottom: 12
    } }, "Une praticienne form\xE9e peut tenir ce r\xEAve avec toi. ", /* @__PURE__ */ React.createElement("strong", { style: { color: T.accent } }, "30\u20AC"), ", r\xE9ponse \xE9crite sous 7 jours."), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => uShowPush(true),
        style: {
          padding: "10px 18px",
          border: `1px solid ${T.borderActive}`,
          background: "transparent",
          color: T.accent,
          fontFamily: T.serif,
          fontStyle: "italic",
          fontSize: 15,
          cursor: "pointer"
        }
      },
      "demander un regard humain"
    ))), showPush && /* @__PURE__ */ React.createElement(
      HumanPushRequestModal,
      {
        workflowId,
        kairosId: kairos == null ? void 0 : kairos.id,
        onClose: () => uShowPush(false),
        onSubmitted: () => {
        }
      }
    ));
  }
  Object.assign(window, {
    BigDreamWorkflowScreen,
    WorkflowOverview,
    WorkflowDayDetail,
    HumanPushRequestModal
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1iaWdkcmVhbS5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCwgd2luZG93ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIEJpZyBEcmVhbSBXb3JrZmxvdyBcdTIwMTQgc291cy1hcHAgNyBqb3VycyAoRmVhdHVyZSAzLCAyMDI2LTA0LTI5KVxuLy9cbi8vIFNwZWMgOiA0X0xPRy5tZCAyMDI2LTA0LTI5IChCaWcgRHJlYW1zIFdvcmtmbG93ICsgUHVzaCBodW1haW4gcGF5YW50KS5cbi8vXG4vLyBDb21wb3NhbnRzIGV4cG9ydFx1MDBFOXMgOlxuLy8gICAtIHdpbmRvdy5CaWdEcmVhbVdvcmtmbG93U2NyZWVuIDogcm91dGluZyBlbnRyeSwgY2hhcmdlIHdvcmtmbG93XG4vLyAgIC0gd2luZG93LldvcmtmbG93T3ZlcnZpZXcgICAgICAgIDogNyBjYXJkcyBKMS4uSjcsIGN1cnJlbnRfZGF5IGhpZ2hsaWdodFxuLy8gICAtIHdpbmRvdy5Xb3JrZmxvd0RheURldGFpbCAgICAgICA6IFx1MDBFOXRhcGUgZHUgam91ciBhdmVjIHRleHQvdm9pY2UgY2FwdHVyZVxuLy8gICAtIHdpbmRvdy5IdW1hblB1c2hSZXF1ZXN0TW9kYWwgICA6IHB1c2ggcHJhdGljaWVuIDMwXHUyMEFDIChTdHJpcGUgTVZQIHN0dWIpXG4vL1xuLy8gR3JhbW1haXJlIDogYWxpZ25cdTAwRTllIERyZWFtIG1haW4gKG5pZ2h0LXdhcm0gKyBFQiBHYXJhbW9uZCBpdGFsaWMgKyBzaWxrLWdvbGQpLlxuLy8gNyBcdTAwRTl0YXBlcyA6IHNpbGVuY2UgLyBpbWFnZV9vcl9kcmF3aW5nIC8gZGlhbG9ndWVfcGVyc29ubmFnZSAvIHBvbHlwaG9uaWVfM192b2l4IC9cbi8vICAgICAgICAgICAgY29ycmVsYXRpb25zX2ZvcmV0IC8gb3JhY2xlX2NvcnBzIC8gbGV0dGVyX3RvX3NlbGZcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG4oZnVuY3Rpb24gc2V0dXBCaWdEcmVhbVNjcmVlbnMoKSB7XG4gIGNvbnN0IHsgdXNlU3RhdGU6IHVTLCB1c2VFZmZlY3Q6IHVFLCB1c2VSZWY6IHVSLCB1c2VNZW1vOiB1TSB9ID0gUmVhY3Q7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFRva2VucyBcdTIwMTQgRHJlYW0gbWFpbiBhZXN0aGV0aWMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGNvbnN0IFQgPSB7XG4gICAgYmc6ICAgICAgICAgICBcInZhcigtLW5pZ2h0LXdhcm0sICMxNTEzMEYpXCIsXG4gICAgYmdGbG9vcjogICAgICBcInZhcigtLW5pZ2h0LWZsb29yLCAjMEUwRjE0KVwiLFxuICAgIGJnU29mdDogICAgICAgXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXBhcGVyLXdhcm0sICNCODlFN0MpIDYlLCB0cmFuc3BhcmVudClcIixcbiAgICBiZ1NpbGtTb2Z0OiAgIFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQsICNDOEE2NTgpIDUlLCB0cmFuc3BhcmVudClcIixcbiAgICBib3JkZXI6ICAgICAgIFwidmFyKC0tYXNoLWRlZXAsICMxRjIwMjUpXCIsXG4gICAgYm9yZGVyQWN0aXZlOiBcInZhcigtLXNpbGstZ29sZCwgI0M4QTY1OClcIixcbiAgICB0ZXh0OiAgICAgICAgIFwidmFyKC0tYm9uZSwgI0M0QjlBRClcIixcbiAgICB0ZXh0RGltOiAgICAgIFwidmFyKC0tYXNoLWxpZ2h0LCAjNUM1ODU0KVwiLFxuICAgIHRleHRNdXRlZDogICAgXCJ2YXIoLS1hc2gtbWlkLCAjMzYzNDMwKVwiLFxuICAgIGFjY2VudDogICAgICAgXCJ2YXIoLS1zaWxrLWdvbGQsICNDOEE2NTgpXCIsXG4gICAgZW1iZXI6ICAgICAgICBcInZhcigtLWVtYmVyLWxpdmUsICNDNDZCM0QpXCIsXG4gICAgcGFwZXI6ICAgICAgICBcInZhcigtLXBhcGVyLXdhcm0sICNCODlFN0MpXCIsXG4gICAgc3RvbmU6ICAgICAgICBcInZhcigtLXN0b25lLWNvb2wsICM2RjdDODgpXCIsXG4gICAgc2VyaWY6ICAgICAgICBcInZhcigtLXNlcmlmLCAnRUIgR2FyYW1vbmQnLCBHYXJhbW9uZCwgc2VyaWYpXCIsXG4gICAgc2FuczogICAgICAgICBcInZhcigtLXNhbnMsIEludGVyLCBzeXN0ZW0tdWksIHNhbnMtc2VyaWYpXCIsXG4gICAgbW9ubzogICAgICAgICBcInZhcigtLW1vbm8sICdKZXRCcmFpbnMgTW9ubycsIHVpLW1vbm9zcGFjZSwgbW9ub3NwYWNlKVwiLFxuICB9O1xuXG4gIC8vIDcgXHUwMEU5dGFwZXMgXHUyMDE0IGxhYmVscyArIGludGVudGlvbnNcbiAgY29uc3QgU1RFUF9NRVRBID0ge1xuICAgIDE6IHtcbiAgICAgIGtpbmQ6IFwic2lsZW5jZVwiLFxuICAgICAgbGFiZWw6IFwiU2lsZW5jZVwiLFxuICAgICAgdGl0bGU6IFwianVzdGUgcG9zZXIsIG5lIHJpZW4gaW50ZXJwclx1MDBFOXRlclwiLFxuICAgICAgZGVzYzogXCJBdWpvdXJkJ2h1aSwgbmUgZmFpcyByaWVuLiBSZS1saXMgbGUgclx1MDBFQXZlLiBMYWlzc2UtbGUgXHUwMEVBdHJlLiBBdWN1bmUgY2FwdHVyZSBvYmxpZ2F0b2lyZS5cIixcbiAgICAgIHBsYWNlaG9sZGVyOiBcIihmYWN1bHRhdGlmKSB1biBtb3QsIHVuZSBzZW5zYXRpb24sIGNlIHF1aSBzdXJuYWdlXHUyMDI2XCIsXG4gICAgfSxcbiAgICAyOiB7XG4gICAgICBraW5kOiBcImltYWdlX29yX2RyYXdpbmdcIixcbiAgICAgIGxhYmVsOiBcIkltYWdlIC8gZGVzc2luXCIsXG4gICAgICB0aXRsZTogXCJ1bmUgaW1hZ2UsIHVuIGRlc3Npbiwgb3UgbGEgZGVzY3JpcHRpb24gZCd1bmUgaW1hZ2VcIixcbiAgICAgIGRlc2M6IFwiU2kgdW5lIGltYWdlIHZpZW50LCBkXHUwMEU5cG9zZS1sYSAodGV4dGUgb3UgcGhvdG8pLiBTaSByaWVuIG5lIHZpZW50LCBkXHUwMEU5Y3JpcyB1bmUgaW1hZ2UgcXVpIHBvdXJyYWl0IHBvcnRlciBsZSByXHUwMEVBdmUuXCIsXG4gICAgICBwbGFjZWhvbGRlcjogXCJjZSBxdWUgamUgdm9pcywgY2UgcXVlIGplIGRlc3NpbmVyYWlzLCBjZSBxdWkgcHJlbmQgZm9ybWVcdTIwMjZcIixcbiAgICB9LFxuICAgIDM6IHtcbiAgICAgIGtpbmQ6IFwiZGlhbG9ndWVfcGVyc29ubmFnZVwiLFxuICAgICAgbGFiZWw6IFwiRGlhbG9ndWUgYXZlYyB1biBwZXJzb25uYWdlXCIsXG4gICAgICB0aXRsZTogXCJwYXJsZXIgXHUwMEUwIHVuIHBlcnNvbm5hZ2UgZHUgclx1MDBFQXZlXCIsXG4gICAgICBkZXNjOiBcIkNob2lzaXMgdW5lIGZpZ3VyZSBkdSByXHUwMEVBdmUuIFBvc2UtbHVpIHVuZSBxdWVzdGlvbi4gXHUwMEM5Y291dGUgY2UgcXUnZWxsZSBkaXQgKG1vZGUgaW5jYXJuYXRpb24gQWl6ZW5zdGF0IFx1MjAxNCB0dSBwZXV4IFx1MDBFOWNyaXJlIGxlcyBkZXV4IHZvaXgpLlwiLFxuICAgICAgcGxhY2Vob2xkZXI6IFwibW9pIDogXHUyMDI2IC8gbGEgZmlndXJlIDogXHUyMDI2XCIsXG4gICAgfSxcbiAgICA0OiB7XG4gICAgICBraW5kOiBcInBvbHlwaG9uaWVfM192b2l4XCIsXG4gICAgICBsYWJlbDogXCJQb2x5cGhvbmllIDMgdm9peFwiLFxuICAgICAgdGl0bGU6IFwibGVjdHVyZSBwb2x5cGhvbmlxdWUgcGFwZXIgLyBzdG9uZSAvIHNpbGtcIixcbiAgICAgIGRlc2M6IFwiQ29udm9xdWUgbGVzIDMgdm9peCBkZSBsYSBGb3JcdTAwRUF0IHN1ciBjZSByXHUwMEVBdmUuIEF1Y3VuZSBuZSBkaXQgbGUgc2Vucy4gTGVxdWVsIHJcdTAwRTlzb25uZSA/XCIsXG4gICAgICBwbGFjZWhvbGRlcjogXCJjZSBxdWkgbSdhIHRvdWNoXHUwMEU5IGRhbnMgdW5lIHZvaXgsIGNlIHF1aSBtJ2Egclx1MDBFOXNpc3RcdTAwRTlcdTIwMjZcIixcbiAgICAgIGhhc0FjdGlvbjogXCJwb2x5cGhvbnlcIiwgLy8gYm91dG9uIHF1aSBhcHBlbGxlIC9hcGkvZHJlYW0tY2hhdC9jb252ZXJzZSBmb3JjZV9wb2x5cGhvbnk9dHJ1ZVxuICAgIH0sXG4gICAgNToge1xuICAgICAga2luZDogXCJjb3JyZWxhdGlvbnNfZm9yZXRcIixcbiAgICAgIGxhYmVsOiBcIkNvcnJcdTAwRTlsYXRpb25zIEZvclx1MDBFQXQgXHUwMEU5dGVuZHVlc1wiLFxuICAgICAgdGl0bGU6IFwiNS03IGNodW5rcyBGb3JcdTAwRUF0IHZzIDMgc3RhbmRhcmRcIixcbiAgICAgIGRlc2M6IFwiUmVjaGVyY2hlIGNpYmxcdTAwRTllIGRhbnMgbGEgYmlibGlvdGhcdTAwRThxdWUgcG91ciBjZSByXHUwMEVBdmUuIFBhcyBwb3VyIGRcdTAwRTljb2RlciBcdTIwMTQgcG91ciBlbnRlbmRyZSBsZXMgdm9peCBxdWkgclx1MDBFOXNvbm5lbnQuXCIsXG4gICAgICBwbGFjZWhvbGRlcjogXCJjZSBxdWkgcydlc3Qgb3V2ZXJ0IGF2ZWMgbGVzIHZvaXggRm9yXHUwMEVBdFx1MjAyNlwiLFxuICAgICAgaGFzQWN0aW9uOiBcImZvcmVzdFwiLCAvLyBib3V0b24gcXVpIGFwcGVsbGUgZm9yZXN0UmVhZGluZ1xuICAgIH0sXG4gICAgNjoge1xuICAgICAga2luZDogXCJvcmFjbGVfY29ycHNcIixcbiAgICAgIGxhYmVsOiBcIk9yYWNsZSBkdSBDb3Jwc1wiLFxuICAgICAgdGl0bGU6IFwib1x1MDBGOSBsZSByXHUwMEVBdmUgdml0IGRhbnMgdG9uIGNvcnBzXCIsXG4gICAgICBkZXNjOiBcIlNlbnNhdGlvbiBhc3NvY2lcdTAwRTllIGF1IHJcdTAwRUF2ZS4gTGVjdHVyZSBjb3JwcyAzIHZvaXguIFBhcyBkYW5zIGxhIHRcdTAwRUF0ZSBcdTIwMTQgZGFucyBsYSBjaGFpci5cIixcbiAgICAgIHBsYWNlaG9sZGVyOiBcIm9cdTAwRjkgXHUwMEU3YSB2aXQgZGFucyBsZSBjb3JwcywgY2UgcXVpIHNlIHBhc3NlIHF1YW5kIGoneSByZXZpZW5zXHUyMDI2XCIsXG4gICAgICBoYXNBY3Rpb246IFwiYm9keVwiLFxuICAgIH0sXG4gICAgNzoge1xuICAgICAga2luZDogXCJsZXR0ZXJfdG9fc2VsZlwiLFxuICAgICAgbGFiZWw6IFwiTGV0dHJlIFx1MDBFMCB0b2ktbVx1MDBFQW1lXCIsXG4gICAgICB0aXRsZTogXCJzeW50aFx1MDBFOHNlIG5hcnJhdGl2ZSB+NDAwLTUwMCBtb3RzXCIsXG4gICAgICBkZXNjOiBcIkwnYXBwIHRpc3NlIHVuZSBsZXR0cmUgXHUwMEUwIHBhcnRpciBkZSB0ZXMgNiBjYXB0dXJlcy4gVHUgcGV1eCBsJ2FtZW5kZXIgb3UgbGEgZ2FyZGVyIHRlbGxlIHF1ZWxsZS5cIixcbiAgICAgIHBsYWNlaG9sZGVyOiBcIihsYSBsZXR0cmUgZXN0IGdcdTAwRTluXHUwMEU5clx1MDBFOWUgYXV0b21hdGlxdWVtZW50IFx1MjAxNCBjbGlxdWUgbGUgYm91dG9uIGNpLWRlc3NvdXMpXCIsXG4gICAgICBoYXNBY3Rpb246IFwiY2xvc2luZ19sZXR0ZXJcIixcbiAgICB9LFxuICB9O1xuXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBXb3JrZmxvd092ZXJ2aWV3IFx1MjAxNCA3IGNhcmRzIGhvcml6b250YWxlcy92ZXJ0aWNhbGVzXG4gIC8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBmdW5jdGlvbiBXb3JrZmxvd092ZXJ2aWV3KHsgd29ya2Zsb3csIHN0ZXBzLCBvblNlbGVjdERheSB9KSB7XG4gICAgY29uc3QgY3VycmVudERheSA9IHdvcmtmbG93Py5jdXJyZW50X2RheSB8fCAxO1xuICAgIGNvbnN0IGNsb3NlZCA9ICEhd29ya2Zsb3c/LmNsb3NlZF9hdDtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDEwIH19PlxuICAgICAgICB7WzEsIDIsIDMsIDQsIDUsIDYsIDddLm1hcCgoZCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG1ldGEgPSBTVEVQX01FVEFbZF07XG4gICAgICAgICAgY29uc3Qgc3RlcCA9IChzdGVwcyB8fCBbXSkuZmluZCgocykgPT4gcy5kYXkgPT09IGQpO1xuICAgICAgICAgIGNvbnN0IGNvbXBsZXRlZCA9ICEhc3RlcD8uY29tcGxldGVkX2F0O1xuICAgICAgICAgIGNvbnN0IGlzQ3VycmVudCA9IGQgPT09IGN1cnJlbnREYXkgJiYgIWNsb3NlZDtcblxuICAgICAgICAgIGNvbnN0IGJvcmRlckNvbG9yID0gY29tcGxldGVkXG4gICAgICAgICAgICA/IFQuYm9yZGVyQWN0aXZlXG4gICAgICAgICAgICA6IGlzQ3VycmVudFxuICAgICAgICAgICAgPyBULmVtYmVyXG4gICAgICAgICAgICA6IFQuYm9yZGVyO1xuICAgICAgICAgIGNvbnN0IGJnID0gY29tcGxldGVkXG4gICAgICAgICAgICA/IFQuYmdTaWxrU29mdFxuICAgICAgICAgICAgOiBpc0N1cnJlbnRcbiAgICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyLWxpdmUpIDQlLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgOiBcInRyYW5zcGFyZW50XCI7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2R9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0RGF5ICYmIG9uU2VsZWN0RGF5KGQpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYmcsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IHNvbGlkICR7Ym9yZGVyQ29sb3J9YCxcbiAgICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0LFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTRweCAxNnB4XCIsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNhbnMsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJib3JkZXItY29sb3IgMjAwbXMgZWFzZSwgYmFja2dyb3VuZCAyMDBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJiYXNlbGluZVwiIH19PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb21wbGV0ZWQgPyBULmFjY2VudCA6IGlzQ3VycmVudCA/IFQuZW1iZXIgOiBULnRleHREaW0sXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBKe2R9IFx1MjAxNCB7bWV0YS5sYWJlbC50b1VwcGVyQ2FzZSgpfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAuNSwgY29sb3I6IFQudGV4dERpbSB9fT5cbiAgICAgICAgICAgICAgICAgIHtjb21wbGV0ZWQgPyBcIlx1MjcxMyB0ZW51XCIgOiBpc0N1cnJlbnQgPyBcIlx1MjE5MCBhdWpvdXJkJ2h1aVwiIDogXCJcIn1cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0LCBtYXJnaW5Ub3A6IDYsIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAge21ldGEudGl0bGV9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICB7c3RlcD8udXNlcl9jYXB0dXJlICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTMsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDgsIGxpbmVIZWlnaHQ6IDEuNSxcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiLXdlYmtpdC1ib3hcIiwgV2Via2l0TGluZUNsYW1wOiAyLFxuICAgICAgICAgICAgICAgICAgV2Via2l0Qm94T3JpZW50OiBcInZlcnRpY2FsXCIsIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAge3N0ZXAudXNlcl9jYXB0dXJlLnNsaWNlKDAsIDE4MCl9e3N0ZXAudXNlcl9jYXB0dXJlLmxlbmd0aCA+IDE4MCA/IFwiXHUyMDI2XCIgOiBcIlwifVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIFdvcmtmbG93RGF5RGV0YWlsIFx1MjAxNCBcdTAwRTl0YXBlIGR1IGpvdXIgYXZlYyBjYXB0dXJlICsgYWN0aW9uc1xuICAvLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgZnVuY3Rpb24gV29ya2Zsb3dEYXlEZXRhaWwoeyB3b3JrZmxvdywga2Fpcm9zLCBkYXksIHN0ZXAsIG9uQ29tcGxldGUsIG9uQmFjaywgb25HZW5lcmF0ZUNsb3NpbmdMZXR0ZXIgfSkge1xuICAgIGNvbnN0IG1ldGEgPSBTVEVQX01FVEFbZGF5XTtcbiAgICBjb25zdCBbY2FwdHVyZSwgdUNhcF0gPSB1UyhzdGVwPy51c2VyX2NhcHR1cmUgfHwgXCJcIik7XG4gICAgY29uc3QgW3ZvaWNlLCB1Vm9pY2VdID0gdVMoISFzdGVwPy51c2VyX2NhcHR1cmVfdm9pY2UpO1xuICAgIGNvbnN0IFtzYXZpbmcsIHVTYXZdID0gdVMoZmFsc2UpO1xuICAgIGNvbnN0IFtlcnJvciwgdUVycl0gPSB1UyhudWxsKTtcblxuICAgIC8vIFBvdXIgSjcgbGV0dGVyX3RvX3NlbGYgOiBsYW5jZSBsYSBnXHUwMEU5blx1MDBFOXJhdGlvbiBhdXRvXG4gICAgY29uc3QgW2xldHRlckxvYWRpbmcsIHVMTF0gPSB1UyhmYWxzZSk7XG4gICAgY29uc3QgW2dlbmVyYXRlZExldHRlciwgdUdMXSA9IHVTKG51bGwpO1xuXG4gICAgdUUoKCkgPT4ge1xuICAgICAgdUNhcChzdGVwPy51c2VyX2NhcHR1cmUgfHwgXCJcIik7XG4gICAgICB1Vm9pY2UoISFzdGVwPy51c2VyX2NhcHR1cmVfdm9pY2UpO1xuICAgICAgdUVycihudWxsKTtcbiAgICAgIHVHTChudWxsKTtcbiAgICB9LCBbc3RlcD8uZGF5XSk7XG5cbiAgICBjb25zdCBoYW5kbGVTYXZlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKHNhdmluZykgcmV0dXJuO1xuICAgICAgaWYgKGNhcHR1cmUudHJpbSgpLmxlbmd0aCA8IDEgJiYgZGF5ICE9PSAxICYmIGRheSAhPT0gNykge1xuICAgICAgICB1RXJyKFwiZFx1MDBFOXBvc2UgYXUgbW9pbnMgcXVlbHF1ZXMgbW90c1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdVNhdih0cnVlKTtcbiAgICAgIHVFcnIobnVsbCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuY29tcGxldGVCaWdEcmVhbVN0ZXAod29ya2Zsb3cuaWQsIGRheSwge1xuICAgICAgICAgIGNhcHR1cmVfdGV4dDogY2FwdHVyZS50cmltKCkgfHwgbnVsbCxcbiAgICAgICAgICBjYXB0dXJlX3ZvaWNlOiB2b2ljZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChyZXM/Ll9zZWVkKSB0aHJvdyBuZXcgRXJyb3IoXCJjb25uZXhpb24gaW1wb3NzaWJsZVwiKTtcbiAgICAgICAgaWYgKG9uQ29tcGxldGUpIG9uQ29tcGxldGUocmVzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdUVycigoZSAmJiBlLm1lc3NhZ2UpIHx8IFwiZXJyZXVyXCIpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdVNhdihmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZUdlbmVyYXRlTGV0dGVyID0gYXN5bmMgKCkgPT4ge1xuICAgICAgaWYgKGxldHRlckxvYWRpbmcpIHJldHVybjtcbiAgICAgIHVMTCh0cnVlKTtcbiAgICAgIHVFcnIobnVsbCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZ2VuZXJhdGVCaWdEcmVhbUNsb3NpbmdMZXR0ZXIod29ya2Zsb3cuaWQpO1xuICAgICAgICBpZiAocmVzPy5jbG9zaW5nX2xldHRlcikge1xuICAgICAgICAgIHVHTChyZXMuY2xvc2luZ19sZXR0ZXIpO1xuICAgICAgICAgIHVDYXAocmVzLmNsb3NpbmdfbGV0dGVyKTtcbiAgICAgICAgICBpZiAob25HZW5lcmF0ZUNsb3NpbmdMZXR0ZXIpIG9uR2VuZXJhdGVDbG9zaW5nTGV0dGVyKHJlcyk7XG4gICAgICAgIH0gZWxzZSBpZiAocmVzPy5lcnJvcikge1xuICAgICAgICAgIHVFcnIocmVzLmVycm9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1RXJyKFwibGEgbGV0dHJlIG4nYSBwYXMgcHUgXHUwMEVBdHJlIHRpc3NcdTAwRTllXCIpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHVFcnIoKGUgJiYgZS5tZXNzYWdlKSB8fCBcImVycmV1clwiKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIHVMTChmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDE2IH19PlxuICAgICAgICB7LyogSGVhZGVyICovfVxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICAgIGNvbG9yOiBULmFjY2VudCwgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgSntkYXl9IFx1MjAxNCB7bWV0YS5sYWJlbC50b1VwcGVyQ2FzZSgpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMjQsXG4gICAgICAgICAgICBjb2xvcjogVC50ZXh0LCBsaW5lSGVpZ2h0OiAxLjM1LCBtYXJnaW46IDAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7bWV0YS50aXRsZX1cbiAgICAgICAgICA8L2gyPlxuICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTUsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjYsIG1hcmdpblRvcDogMTAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7bWV0YS5kZXNjfVxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIFJhcHBlbCByXHUwMEVBdmUgb3JpZ2luYWwgKi99XG4gICAgICAgIHtrYWlyb3M/LnJhd190ZXh0ICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogVC5iZ1NvZnQsXG4gICAgICAgICAgICBwYWRkaW5nOiAxNCxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICAgICAgY29sb3I6IFQucGFwZXIsIG1hcmdpbkJvdHRvbTogNixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICBSXHUwMENBVkUgSU5JVElBTFxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTQsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgbGluZUhlaWdodDogMS41NSwgbWFyZ2luOiAwLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcIi13ZWJraXQtYm94XCIsIFdlYmtpdExpbmVDbGFtcDogNCxcbiAgICAgICAgICAgICAgV2Via2l0Qm94T3JpZW50OiBcInZlcnRpY2FsXCIsIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtrYWlyb3MucmF3X3RleHR9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEo3IFx1MjAxNCBib3V0b24gZ1x1MDBFOW5cdTAwRTlyZXIgbGEgbGV0dHJlICovfVxuICAgICAgICB7ZGF5ID09PSA3ICYmICFnZW5lcmF0ZWRMZXR0ZXIgJiYgIXN0ZXA/LmNvbXBsZXRlZF9hdCAmJiAoXG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlR2VuZXJhdGVMZXR0ZXJ9XG4gICAgICAgICAgICBkaXNhYmxlZD17bGV0dGVyTG9hZGluZ31cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTRweCAxOHB4XCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyQWN0aXZlfWAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFQuYmdTaWxrU29mdCxcbiAgICAgICAgICAgICAgY29sb3I6IFQuYWNjZW50LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgY3Vyc29yOiBsZXR0ZXJMb2FkaW5nID8gXCJ3YWl0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgb3BhY2l0eTogbGV0dGVyTG9hZGluZyA/IDAuNiA6IDEsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsZXR0ZXJMb2FkaW5nID8gXCJsYSBsZXR0cmUgc2UgdGlzc2VcdTIwMjZcIiA6IFwidGlzc2VyIGxhIGxldHRyZSBtYWludGVuYW50ICh+NDAwLTUwMCBtb3RzKVwifVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBKNyBcdTIwMTQgYWZmaWNoYWdlIGRlIGxhIGxldHRyZSAqL31cbiAgICAgICAge2RheSA9PT0gNyAmJiAoZ2VuZXJhdGVkTGV0dGVyIHx8IHN0ZXA/LnVzZXJfY2FwdHVyZSkgJiYgKFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyQWN0aXZlfWAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBULmJnU2lsa1NvZnQsXG4gICAgICAgICAgICBwYWRkaW5nOiAxNixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgICBjb2xvcjogVC5hY2NlbnQsIG1hcmdpbkJvdHRvbTogMTAsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgTEVUVFJFIFx1MjAxNCBUSVNTXHUwMEM5RSBQT1VSIFRPSVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTYsIGNvbG9yOiBULnRleHQsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNywgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLCBtYXJnaW46IDAsXG4gICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtnZW5lcmF0ZWRMZXR0ZXIgfHwgc3RlcD8udXNlcl9jYXB0dXJlfVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBDYXB0dXJlIHRleHRhcmVhIChzYXVmIEo3IHNpIGxldHRyZSBkXHUwMEU5alx1MDBFMCBsXHUwMEUwKSAqL31cbiAgICAgICAgeyEoZGF5ID09PSA3ICYmIChnZW5lcmF0ZWRMZXR0ZXIgfHwgc3RlcD8udXNlcl9jYXB0dXJlKSkgJiYgKFxuICAgICAgICAgIDx0ZXh0YXJlYVxuICAgICAgICAgICAgdmFsdWU9e2NhcHR1cmV9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVDYXAoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9e21ldGEucGxhY2Vob2xkZXJ9XG4gICAgICAgICAgICByb3dzPXtkYXkgPT09IDEgPyA0IDogOH1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgbWluSGVpZ2h0OiBkYXkgPT09IDEgPyA4MCA6IDE2MCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgICAgICBjb2xvcjogVC50ZXh0LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS42LCBwYWRkaW5nOiAxMixcbiAgICAgICAgICAgICAgb3V0bGluZTogXCJub25lXCIsIHJlc2l6ZTogXCJ2ZXJ0aWNhbFwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBWb2ljZSB0b2dnbGUgKi99XG4gICAgICAgIDxsYWJlbCBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6IFwiaW5saW5lLWZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgZ2FwOiA4LFxuICAgICAgICAgIGZvbnRGYW1pbHk6IFQubW9ubywgZm9udFNpemU6IDExLCBjb2xvcjogVC50ZXh0RGltLFxuICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIGNoZWNrZWQ9e3ZvaWNlfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1Vm9pY2UoZS50YXJnZXQuY2hlY2tlZCl9XG4gICAgICAgICAgICBzdHlsZT17eyBhY2NlbnRDb2xvcjogVC5hY2NlbnQgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIGNhcHR1cmUgdm9jYWxlIChcdTAwRTAgdmVuaXIgOiB0cmFuc2NyaXB0aW9uIFdoaXNwZXIpXG4gICAgICAgIDwvbGFiZWw+XG5cbiAgICAgICAge2Vycm9yICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTMsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGNvbG9yOiBULmVtYmVyLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBBY3Rpb25zICovfVxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIixcbiAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBtYXJnaW5Ub3A6IDgsIGdhcDogMTIsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9e29uQmFja31cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVTYXZlfVxuICAgICAgICAgICAgZGlzYWJsZWQ9e3NhdmluZ31cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxOHB4XCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyQWN0aXZlfWAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgY29sb3I6IFQuYWNjZW50LFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiBzYXZpbmcgPyBcIndhaXRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICBvcGFjaXR5OiBzYXZpbmcgPyAwLjYgOiAxLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7c2F2aW5nID8gXCJkXHUwMEU5cG9zZXJcdTIwMjZcIiA6IHN0ZXA/LmNvbXBsZXRlZF9hdCA/IFwibWV0dHJlIFx1MDBFMCBqb3VyXCIgOiBcInRlbmlyIGNlIGpvdXJcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEh1bWFuUHVzaFJlcXVlc3RNb2RhbCBcdTIwMTQgcHVzaCBwcmF0aWNpZW4gMzBcdTIwQUNcbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGZ1bmN0aW9uIEh1bWFuUHVzaFJlcXVlc3RNb2RhbCh7IHdvcmtmbG93SWQsIGthaXJvc0lkLCBvbkNsb3NlLCBvblN1Ym1pdHRlZCB9KSB7XG4gICAgY29uc3QgW3RleHQsIHVUZXh0XSA9IHVTKFwiXCIpO1xuICAgIGNvbnN0IFtzdWJtaXR0aW5nLCB1U3ViXSA9IHVTKGZhbHNlKTtcbiAgICBjb25zdCBbZXJyb3IsIHVFcnJdID0gdVMobnVsbCk7XG4gICAgY29uc3QgW3N1Ym1pdHRlZCwgdURvbmVdID0gdVMobnVsbCk7XG5cbiAgICBjb25zdCBoYW5kbGVTdWJtaXQgPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAodGV4dC50cmltKCkubGVuZ3RoIDwgMTApIHtcbiAgICAgICAgdUVycihcImRpcyBxdWVscXVlcyBtb3RzIGRlIHBsdXMgXHUwMEUwIGxhIHByYXRpY2llbm5lIChtaW4gMTAgY2FyYWN0XHUwMEU4cmVzKVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdVN1Yih0cnVlKTtcbiAgICAgIHVFcnIobnVsbCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkucmVxdWVzdEJpZ0RyZWFtSHVtYW5QdXNoKHtcbiAgICAgICAgICB3b3JrZmxvd19pZDogd29ya2Zsb3dJZCB8fCBudWxsLFxuICAgICAgICAgIGthaXJvc19pZDoga2Fpcm9zSWQgfHwgbnVsbCxcbiAgICAgICAgICB1c2VyX3JlcXVlc3RfdGV4dDogdGV4dC50cmltKCksXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAocmVzPy5fc2VlZCB8fCAhcmVzPy5wdXNoKSB0aHJvdyBuZXcgRXJyb3IoXCJjb25uZXhpb24gaW1wb3NzaWJsZVwiKTtcbiAgICAgICAgdURvbmUocmVzKTtcbiAgICAgICAgaWYgKG9uU3VibWl0dGVkKSBvblN1Ym1pdHRlZChyZXMpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB1RXJyKChlICYmIGUubWVzc2FnZSkgfHwgXCJlcnJldXJcIik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICB1U3ViKGZhbHNlKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIiwgaW5zZXQ6IDAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgODAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgekluZGV4OiAxMDAwLCBkaXNwbGF5OiBcImdyaWRcIiwgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgcGFkZGluZzogMTYsXG4gICAgICB9fSBvbkNsaWNrPXtvbkNsb3NlfT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIG1heFdpZHRoOiA1MjAsIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBULmJnLCBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgIHBhZGRpbmc6IDI0LFxuICAgICAgICB9fSBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgY29sb3I6IFQuYWNjZW50LCBtYXJnaW5Cb3R0b206IDgsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBERU1BTkRFUiBVTiBSRUdBUkQgSFVNQUlOXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGgzIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAyMixcbiAgICAgICAgICAgIGNvbG9yOiBULnRleHQsIGxpbmVIZWlnaHQ6IDEuMzUsIG1hcmdpblRvcDogMCwgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIFVuZSBwcmF0aWNpZW5uZSBmb3JtXHUwMEU5ZSBBaXplbnN0YXQgLyBNb3NzIC8gSG9wY2tlIHBldXQgdGVuaXIgY2Ugclx1MDBFQXZlIGF2ZWMgdG9pLlxuICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTaXplOiAxNCwgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNiwgbWFyZ2luQm90dG9tOiAxNixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzdHJvbmcgc3R5bGU9e3sgY29sb3I6IFQuYWNjZW50IH19PjMwXHUyMEFDPC9zdHJvbmc+IFx1MDBCNyByXHUwMEU5cG9uc2UgXHUwMEU5Y3JpdGUgc291cyA3IGpvdXJzIFx1MDBCNyBwYXMgdW4gZGlhZ25vc3RpYywgdW4gY29tcGFnbm9ubmFnZS5cbiAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICB7IXN1Ym1pdHRlZCAmJiAoXG4gICAgICAgICAgICA8PlxuICAgICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgICB2YWx1ZT17dGV4dH1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVUZXh0KGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImNlIHF1ZSB0dSB2ZXV4IHF1ZSBsYSBwcmF0aWNpZW5uZSBzYWNoZSwgbGEgcXVlc3Rpb24gcXVpIHJldmllbnQsIGNlIHF1aSBwXHUwMEU4c2VcdTIwMjZcIlxuICAgICAgICAgICAgICAgIHJvd3M9ezZ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIiwgbWluSGVpZ2h0OiAxNDAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlcn1gLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCxcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41NSwgcGFkZGluZzogMTIsXG4gICAgICAgICAgICAgICAgICBvdXRsaW5lOiBcIm5vbmVcIiwgcmVzaXplOiBcInZlcnRpY2FsXCIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTaXplOiAxMywgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFQuZW1iZXIsIG1hcmdpblRvcDogMTAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwgbWFyZ2luVG9wOiAxNixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHJlZmVybWVyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlU3VibWl0fVxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggMThweFwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHtULmJvcmRlckFjdGl2ZX1gLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBULmJnU2lsa1NvZnQsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBULmFjY2VudCxcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTUsXG4gICAgICAgICAgICAgICAgICAgIGN1cnNvcjogc3VibWl0dGluZyA/IFwid2FpdFwiIDogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHN1Ym1pdHRpbmcgPyAwLjYgOiAxLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiZW52b2lcdTIwMjZcIiA6IFwiZGVtYW5kZXIgKDMwXHUyMEFDKVwifVxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7c3VibWl0dGVkICYmIChcbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogVC5zZXJpZiwgZm9udFNpemU6IDE2LCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBUYSBkZW1hbmRlIGVzdCBwYXJ0aWUuIExhIHByYXRpY2llbm5lIHJldmllbmRyYSB2ZXJzIHRvaSBzb3VzIDcgam91cnMuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAge3N1Ym1pdHRlZC5wYXltZW50Py5zdHViICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMSwgY29sb3I6IFQudGV4dERpbSxcbiAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMTIsIHBhZGRpbmc6IDEwLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBgMXB4IGRhc2hlZCAke1QuYm9yZGVyfWAsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBNVlAgOiBTdHJpcGUgc3R1YiBcdTIwMTQgbGEgZmFjdHVyYXRpb24gclx1MDBFOWVsbGUgYXJyaXZlIGVuIFYxLjUuXG4gICAgICAgICAgICAgICAgICBJbnRlbnQgSUQgOiB7c3VibWl0dGVkLnBheW1lbnQucGF5bWVudF9pbnRlbnRfaWR9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImZsZXgtZW5kXCIsIG1hcmdpblRvcDogMTYgfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxOHB4XCIsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyQWN0aXZlfWAsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFQuYWNjZW50LFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgcmVmZXJtZXJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgLy8gQmlnRHJlYW1Xb3JrZmxvd1NjcmVlbiBcdTIwMTQgZW50cnkvcm91dGluZ1xuICAvL1xuICAvLyBQcm9wcyA6XG4gIC8vICAgLSBnbyA6IHJvdXRlciBjYWxsYmFja1xuICAvLyAgIC0gY3R4IDogcGV1dCBcdTAwRUF0cmUgdW4gd29ya2Zsb3dfaWQgKHN0cmluZykgT1UgeyB3b3JrZmxvd19pZCwga2Fpcm9zX2lkIH1cbiAgLy9cbiAgLy8gU2kgcGFzIGRlIHdvcmtmbG93X2lkIG1haXMgdW4ga2Fpcm9zX2lkIFx1MjE5MiBzdGFydCB3b3JrZmxvdyBwdWlzIGNoYXJnZS5cbiAgLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGZ1bmN0aW9uIEJpZ0RyZWFtV29ya2Zsb3dTY3JlZW4oeyBnbywgY3R4IH0pIHtcbiAgICBjb25zdCBjdHhPYmogPSB0eXBlb2YgY3R4ID09PSBcInN0cmluZ1wiID8geyB3b3JrZmxvd19pZDogY3R4IH0gOiAoY3R4IHx8IHt9KTtcbiAgICBjb25zdCBbd29ya2Zsb3dJZCwgdVdpZF0gPSB1UyhjdHhPYmoud29ya2Zsb3dfaWQgfHwgbnVsbCk7XG4gICAgY29uc3QgW3dvcmtmbG93LCB1V2ZdID0gdVMobnVsbCk7XG4gICAgY29uc3QgW3N0ZXBzLCB1U3RlcHNdID0gdVMoW10pO1xuICAgIGNvbnN0IFtrYWlyb3MsIHVLXSA9IHVTKG51bGwpO1xuICAgIGNvbnN0IFtsb2FkaW5nLCB1TG9hZF0gPSB1Uyh0cnVlKTtcbiAgICBjb25zdCBbZXJyb3IsIHVFcnJdID0gdVMobnVsbCk7XG5cbiAgICBjb25zdCBbc2VsZWN0ZWREYXksIHVTZWxEYXldID0gdVMobnVsbCk7XG4gICAgY29uc3QgW3Nob3dQdXNoLCB1U2hvd1B1c2hdID0gdVMoZmFsc2UpO1xuXG4gICAgLy8gQm9vdHN0cmFwIDogc2kgcGFzIGRlIHdvcmtmbG93X2lkIG1haXMga2Fpcm9zX2lkIFx1MjE5MiBzdGFydFxuICAgIHVFKCgpID0+IHtcbiAgICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcblxuICAgICAgYXN5bmMgZnVuY3Rpb24gYm9vdHN0cmFwKCkge1xuICAgICAgICB1TG9hZCh0cnVlKTtcbiAgICAgICAgdUVycihudWxsKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBsZXQgd2lkID0gd29ya2Zsb3dJZDtcbiAgICAgICAgICBpZiAoIXdpZCAmJiBjdHhPYmoua2Fpcm9zX2lkKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydFJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5zdGFydEJpZ0RyZWFtV29ya2Zsb3coY3R4T2JqLmthaXJvc19pZCk7XG4gICAgICAgICAgICBpZiAoc3RhcnRSZXM/Ll9zZWVkKSB0aHJvdyBuZXcgRXJyb3IoXCJpbXBvc3NpYmxlIGRlIGNyXHUwMEU5ZXIgbGUgd29ya2Zsb3dcIik7XG4gICAgICAgICAgICBpZiAoc3RhcnRSZXM/LndvcmtmbG93Py5pZCkge1xuICAgICAgICAgICAgICB3aWQgPSBzdGFydFJlcy53b3JrZmxvdy5pZDtcbiAgICAgICAgICAgICAgaWYgKCFjYW5jZWxsZWQpIHVXaWQod2lkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnRSZXM/LmVycm9yKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzdGFydFJlcy5lcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghd2lkKSB7XG4gICAgICAgICAgICBpZiAoIWNhbmNlbGxlZCkge1xuICAgICAgICAgICAgICB1RXJyKFwiYXVjdW4gd29ya2Zsb3cgbmkga2Fpcm9zIGZvdXJuaVwiKTtcbiAgICAgICAgICAgICAgdUxvYWQoZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5nZXRCaWdEcmVhbVdvcmtmbG93KHdpZCk7XG4gICAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICAgIGlmIChyZXM/Ll9zZWVkIHx8ICFyZXM/LndvcmtmbG93KSB0aHJvdyBuZXcgRXJyb3IoXCJ3b3JrZmxvdyBpbnRyb3V2YWJsZVwiKTtcbiAgICAgICAgICB1V2YocmVzLndvcmtmbG93KTtcbiAgICAgICAgICB1U3RlcHMocmVzLnN0ZXBzIHx8IFtdKTtcbiAgICAgICAgICB1SyhyZXMua2Fpcm9zIHx8IG51bGwpO1xuICAgICAgICAgIC8vIFNcdTAwRTlsZWN0aW9ubmUgYXV0b21hdGlxdWVtZW50IGxlIGN1cnJlbnRfZGF5XG4gICAgICAgICAgdVNlbERheShyZXMud29ya2Zsb3cuY3VycmVudF9kYXkgfHwgMSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoIWNhbmNlbGxlZCkgdUVycigoZSAmJiBlLm1lc3NhZ2UpIHx8IFwiZXJyZXVyXCIpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgIGlmICghY2FuY2VsbGVkKSB1TG9hZChmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYm9vdHN0cmFwKCk7XG4gICAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICAgIH0sIFtjdHhPYmoua2Fpcm9zX2lkLCBjdHhPYmoud29ya2Zsb3dfaWRdKTtcblxuICAgIGNvbnN0IHJlZnJlc2ggPSBhc3luYyAoKSA9PiB7XG4gICAgICBpZiAoIXdvcmtmbG93SWQpIHJldHVybjtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5nZXRCaWdEcmVhbVdvcmtmbG93KHdvcmtmbG93SWQpO1xuICAgICAgaWYgKHJlcz8ud29ya2Zsb3cpIHtcbiAgICAgICAgdVdmKHJlcy53b3JrZmxvdyk7XG4gICAgICAgIHVTdGVwcyhyZXMuc3RlcHMgfHwgW10pO1xuICAgICAgICB1SyhyZXMua2Fpcm9zIHx8IG51bGwpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBvblN0ZXBDb21wbGV0ZSA9IGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHJlZnJlc2goKTtcbiAgICAgIC8vIFJlcG9zaXRpb25uZSBzdXIgY3VycmVudF9kYXkgYXByXHUwMEU4cyBzYXZlXG4gICAgICAvLyAoc2F1ZiBzaSB1c2VyIGEgbWFudWVsbGVtZW50IGNob2lzaSB1biBhdXRyZSBqb3VyKVxuICAgIH07XG5cbiAgICBjb25zdCBjdXJyZW50U3RlcCA9IHNlbGVjdGVkRGF5ID8gKHN0ZXBzIHx8IFtdKS5maW5kKChzKSA9PiBzLmRheSA9PT0gc2VsZWN0ZWREYXkpIDogbnVsbDtcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBSZW5kZXIgXHUyNTAwXHUyNTAwXG4gICAgaWYgKGxvYWRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogVC5iZ0Zsb29yLCBjb2xvcjogVC50ZXh0LCBtaW5IZWlnaHQ6IFwiMTAwdmhcIiwgcGFkZGluZzogXCIyNHB4IDE2cHhcIiB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIG1hcmdpblRvcDogNDAsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIGxlIHdvcmtmbG93IHNlIHByXHUwMEU5cGFyZVx1MjAyNlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFQuYmdGbG9vciwgY29sb3I6IFQudGV4dCwgbWluSGVpZ2h0OiBcIjEwMHZoXCIsIHBhZGRpbmc6IFwiMjRweCAxNnB4XCIgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBmb250RmFtaWx5OiBULnNlcmlmLCBjb2xvcjogVC5lbWJlciwgZm9udFNpemU6IDE1IH19PlxuICAgICAgICAgICAge2Vycm9yfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKFwiaG9tZVwiKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMTYsIHBhZGRpbmc6IFwiMTBweCAxOHB4XCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyfWAsIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgY29sb3I6IFQudGV4dCwgY3Vyc29yOiBcInBvaW50ZXJcIiwgZm9udEZhbWlseTogVC5zZXJpZixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgXHUyMTkwIHJldG91clxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3tcbiAgICAgICAgYmFja2dyb3VuZDogVC5iZ0Zsb29yLCBjb2xvcjogVC50ZXh0LFxuICAgICAgICBtaW5IZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgICAgZm9udEZhbWlseTogVC5zYW5zLFxuICAgICAgICBwYWRkaW5nOiBcIjIwcHggMTZweCAxMDBweFwiLFxuICAgICAgfX0+XG4gICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJiYXNlbGluZVwiLCBtYXJnaW5Cb3R0b206IDE4IH19PlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKGthaXJvcyA/IFwia2Fpcm9zXCIgOiBcImhvbWVcIiwga2Fpcm9zPy5pZCl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBcdTIxOTAgcmV0b3VyXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogVC5tb25vLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgY29sb3I6IFQuYWNjZW50LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgQklHIERSRUFNIFx1MDBCNyA3IEpPVVJTXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxoMSBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDI4LFxuICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuMywgY29sb3I6IFQudGV4dCwgbWFyZ2luOiBcIjAgMCA4cHggMFwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB0ZW5pciBjZSByXHUwMEVBdmUgc3VyIDcgam91cnNcbiAgICAgICAgPC9oMT5cbiAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U2l6ZTogMTQsIGNvbG9yOiBULnRleHREaW0sXG4gICAgICAgICAgbGluZUhlaWdodDogMS41NSwgbWFyZ2luQm90dG9tOiAyMCwgbWF4V2lkdGg6IDU0MCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgVW4gcml0dWVsIHBhciBqb3VyLiBMZSByXHUwMEVBdmUgY29udGludWUgXHUwMEUwIHBhcmxlciB0YW50IHF1J29uIGxlIHRpZW50LlxuICAgICAgICAgIHt3b3JrZmxvdz8uY2xvc2VkX2F0ID8gXCIgXHUyMDE0IHJlZmVybVx1MDBFOS5cIiA6IFwiXCJ9XG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogRGV0YWlsIGR1IGpvdXIgb3UgT3ZlcnZpZXcgKi99XG4gICAgICAgIHtzZWxlY3RlZERheSAmJiBjdXJyZW50U3RlcCA/IChcbiAgICAgICAgICA8V29ya2Zsb3dEYXlEZXRhaWxcbiAgICAgICAgICAgIHdvcmtmbG93PXt3b3JrZmxvd31cbiAgICAgICAgICAgIGthaXJvcz17a2Fpcm9zfVxuICAgICAgICAgICAgZGF5PXtzZWxlY3RlZERheX1cbiAgICAgICAgICAgIHN0ZXA9e2N1cnJlbnRTdGVwfVxuICAgICAgICAgICAgb25Db21wbGV0ZT17b25TdGVwQ29tcGxldGV9XG4gICAgICAgICAgICBvbkJhY2s9eygpID0+IHVTZWxEYXkobnVsbCl9XG4gICAgICAgICAgICBvbkdlbmVyYXRlQ2xvc2luZ0xldHRlcj17cmVmcmVzaH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8V29ya2Zsb3dPdmVydmlld1xuICAgICAgICAgICAgICB3b3JrZmxvdz17d29ya2Zsb3d9XG4gICAgICAgICAgICAgIHN0ZXBzPXtzdGVwc31cbiAgICAgICAgICAgICAgb25TZWxlY3REYXk9eyhkKSA9PiB1U2VsRGF5KGQpfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgICAgey8qIFB1c2ggaHVtYWluIENUQSAqL31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiAyOCwgcGFkZGluZzogMTYsXG4gICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyfWAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFQuYmdTb2Z0LFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULm1vbm8sIGZvbnRTaXplOiAxMC41LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFQucGFwZXIsIG1hcmdpbkJvdHRvbTogOCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgQkVTT0lOIEQnVU4gUkVHQVJEIEhVTUFJTiA/XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFQuc2VyaWYsIGZvbnRTaXplOiAxNCwgY29sb3I6IFQudGV4dCxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjU1LCBtYXJnaW5Ub3A6IDAsIG1hcmdpbkJvdHRvbTogMTIsXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIFVuZSBwcmF0aWNpZW5uZSBmb3JtXHUwMEU5ZSBwZXV0IHRlbmlyIGNlIHJcdTAwRUF2ZSBhdmVjIHRvaS4gPHN0cm9uZyBzdHlsZT17eyBjb2xvcjogVC5hY2NlbnQgfX0+MzBcdTIwQUM8L3N0cm9uZz4sIHJcdTAwRTlwb25zZSBcdTAwRTljcml0ZSBzb3VzIDcgam91cnMuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHVTaG93UHVzaCh0cnVlKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxMHB4IDE4cHhcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAke1QuYm9yZGVyQWN0aXZlfWAsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogVC5hY2NlbnQsXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBULnNlcmlmLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIGRlbWFuZGVyIHVuIHJlZ2FyZCBodW1haW5cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8Lz5cbiAgICAgICAgKX1cblxuICAgICAgICB7c2hvd1B1c2ggJiYgKFxuICAgICAgICAgIDxIdW1hblB1c2hSZXF1ZXN0TW9kYWxcbiAgICAgICAgICAgIHdvcmtmbG93SWQ9e3dvcmtmbG93SWR9XG4gICAgICAgICAgICBrYWlyb3NJZD17a2Fpcm9zPy5pZH1cbiAgICAgICAgICAgIG9uQ2xvc2U9eygpID0+IHVTaG93UHVzaChmYWxzZSl9XG4gICAgICAgICAgICBvblN1Ym1pdHRlZD17KCkgPT4geyAvKiBwYXMgZGUgcmVmcmVzaCBzdGF0ZSBuXHUwMEU5Y2Vzc2FpcmUgcG91ciBsJ2luc3RhbnQgKi8gfX1cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIC8vIEV4cG9zZVxuICBPYmplY3QuYXNzaWduKHdpbmRvdywge1xuICAgIEJpZ0RyZWFtV29ya2Zsb3dTY3JlZW4sXG4gICAgV29ya2Zsb3dPdmVydmlldyxcbiAgICBXb3JrZmxvd0RheURldGFpbCxcbiAgICBIdW1hblB1c2hSZXF1ZXN0TW9kYWwsXG4gIH0pO1xufSkoKTtcbiJdLAogICJtYXBwaW5ncyI6ICJDQWlCQyxTQUFTLHVCQUF1QjtBQUMvQixRQUFNLEVBQUUsVUFBVSxJQUFJLFdBQVcsSUFBSSxRQUFRLElBQUksU0FBUyxHQUFHLElBQUk7QUFHakUsUUFBTSxJQUFJO0FBQUEsSUFDUixJQUFjO0FBQUEs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
