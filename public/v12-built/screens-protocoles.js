const { useState: pS, useEffect: pE, useRef: pR, useMemo: pM } = React;
function pLocale() {
  try {
    return localStorage.getItem("dream:locale") === "en" ? "en" : "fr";
  } catch (e) {
    return "fr";
  }
}
function pTxt(obj, key) {
  const loc = pLocale();
  if (loc === "en" && obj[key + "_en"]) return obj[key + "_en"];
  return obj[key];
}
const PROTOCOLES_REVEAL_KEY = "dream:protocoles:revealed-at";
const PROTOCOLES_DISMISSED_KEY = "dream:protocoles:dismissed-at";
function shouldRevealProtocoles(kairosCount) {
  try {
    const revealed = localStorage.getItem(PROTOCOLES_REVEAL_KEY);
    if (revealed) return false;
    const dismissedAt = parseInt(localStorage.getItem(PROTOCOLES_DISMISSED_KEY) || "0", 10);
    if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 3600 * 1e3) return false;
    return kairosCount >= 3;
  } catch (e) {
    return false;
  }
}
function markProtocolesRevealed() {
  try {
    localStorage.setItem(PROTOCOLES_REVEAL_KEY, String(Date.now()));
  } catch (e) {
  }
}
function markProtocolesDismissed() {
  try {
    localStorage.setItem(PROTOCOLES_DISMISSED_KEY, String(Date.now()));
  } catch (e) {
  }
}
const ProtocoleDiscoveryReveal = ({ go, onClose }) => {
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 320,
        background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--s-5)",
        animation: "p-fade-in 480ms ease"
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: 440,
      width: "100%",
      background: "color-mix(in oklch, var(--night-warm) 92%, transparent)",
      border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
      padding: "var(--s-6) var(--s-5)",
      textAlign: "center"
    } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: "var(--s-3)", display: "grid", placeItems: "center" }, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { width: "36", height: "36", viewBox: "0 0 40 40", style: { display: "block", opacity: 0.85 } }, /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 20 6\n                 a 14 14 0 1 1 -10 23.8\n                 a 10 10 0 1 1 16.5 -7.5\n                 a 6 6 0 1 1 -10 4\n                 a 3 3 0 1 1 5.2 -2",
        fill: "none",
        stroke: "var(--silk-gold)",
        strokeWidth: "1.2",
        strokeLinecap: "round",
        opacity: "0.9"
      }
    ))), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 17,
      color: "var(--bone)",
      marginBottom: "var(--s-3)"
    } }, "un autre chemin pour d\xE9poser"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 15,
      lineHeight: 1.55,
      color: "var(--ash-light)",
      marginBottom: "var(--s-5)",
      textWrap: "pretty"
    } }, "Sais-tu qu'\xE0 chaque d\xE9p\xF4t, tu peux choisir entre rapide ou accompagn\xE9 par un guide inspir\xE9 d'une voix de la For\xEAt ?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10 } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          markProtocolesRevealed();
          onClose && onClose();
          if (typeof go === "function") setTimeout(() => go("protocole-selector"), 200);
        },
        style: pBtnPrimary
      },
      "essayer un guide"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          markProtocolesDismissed();
          onClose && onClose();
        },
        style: pBtnGhost
      },
      "plus tard"
    ))),
    /* @__PURE__ */ React.createElement("style", null, `@keyframes p-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`)
  );
};
const CaptureChoiceScreen = ({ go }) => {
  const [kairosCount, setKairosCount] = pS(null);
  pE(() => {
    let cancelled = false;
    (async () => {
      var _a;
      try {
        if (!((_a = window.DreamAPI) == null ? void 0 : _a.listKairos)) {
          if (!cancelled) setKairosCount(0);
          return;
        }
        const data = await window.DreamAPI.listKairos({ limit: 50 });
        const n = ((data == null ? void 0 : data.kairos) || []).length;
        if (!cancelled) setKairosCount(n);
      } catch (e) {
        if (!cancelled) setKairosCount(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  pE(() => {
    if (kairosCount !== null && kairosCount < 3) {
      setTimeout(() => go && go("capture"), 0);
    }
  }, [kairosCount]);
  if (kairosCount === null || kairosCount < 3) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      minHeight: "100vh",
      background: "var(--night-warm)",
      display: "grid",
      placeItems: "center",
      color: "var(--ash-light)",
      fontFamily: "var(--serif)",
      fontStyle: "italic"
    } }, /* @__PURE__ */ React.createElement("div", { style: { opacity: 0.6 } }, "\u2026"));
  }
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    background: "var(--night-warm)",
    color: "var(--bone)",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "flex-end",
    padding: "0 22px 4px"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("capture"),
      "aria-label": "passer ce choix",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.6,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "8px 12px"
      }
    },
    "passer \u2192"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "var(--s-5) 22px var(--s-6)",
    maxWidth: 540,
    width: "100%",
    margin: "0 auto"
  } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    lineHeight: 1.45,
    textAlign: "center",
    marginBottom: "var(--s-6)",
    color: "var(--bone)",
    textWrap: "pretty"
  } }, "Comment veux-tu d\xE9poser ?"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("capture"),
      style: {
        ...pCardBase,
        cursor: "pointer",
        textAlign: "left",
        background: "color-mix(in oklch, var(--night-floor) 60%, transparent)"
      },
      onMouseEnter: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
      onMouseLeave: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 26,
      marginBottom: 8,
      color: "var(--silk-gold)",
      opacity: 0.9
    } }, "\u26A1"),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--bone)",
      marginBottom: 6
    } }, "Rapide"),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 14,
      color: "var(--ash-light)",
      lineHeight: 1.5
    } }, "en 30 secondes \u2014 un fragment, une image")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("protocole-selector"),
      style: {
        ...pCardBase,
        cursor: "pointer",
        textAlign: "left",
        background: "color-mix(in oklch, var(--night-floor) 60%, transparent)"
      },
      onMouseEnter: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
      onMouseLeave: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"
    },
    /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8, display: "flex", alignItems: "center" }, "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("svg", { width: "26", height: "26", viewBox: "0 0 40 40", style: { display: "block", opacity: 0.9 } }, /* @__PURE__ */ React.createElement(
      "path",
      {
        d: "M 20 6\n                     a 14 14 0 1 1 -10 23.8\n                     a 10 10 0 1 1 16.5 -7.5\n                     a 6 6 0 1 1 -10 4\n                     a 3 3 0 1 1 5.2 -2",
        fill: "none",
        stroke: "var(--silk-gold)",
        strokeWidth: "1.4",
        strokeLinecap: "round"
      }
    ))),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 19,
      color: "var(--bone)",
      marginBottom: 6
    } }, "Avec un guide"),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 14,
      color: "var(--ash-light)",
      lineHeight: 1.5
    } }, "un protocole inspir\xE9 d'une voix de la For\xEAt")
  ))));
};
const ProtocoleSelector = ({ go }) => {
  const catalog = window.PROTOCOLES_CATALOG || {};
  const all = Object.values(catalog);
  const groups = pM(() => {
    const out = [];
    const seen = /* @__PURE__ */ new Set();
    for (const p of all) {
      if (p.id === "reentry") continue;
      const cat = p.category_label || "Autres";
      if (!seen.has(cat)) {
        seen.add(cat);
        out.push({ label: cat, items: [] });
      }
      out.find((g) => g.label === cat).items.push(p);
    }
    return out;
  }, [catalog]);
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    background: "var(--night-warm)",
    color: "var(--bone)",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 18px 12px"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("capture-choice"),
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.7,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        padding: "8px 4px"
      }
    },
    "\u2190 retour"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("home"),
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.5,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "8px 12px"
      }
    },
    "fermer"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: 580,
    width: "100%",
    margin: "0 auto",
    padding: "8px 18px 0"
  } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    textAlign: "center",
    marginBottom: "var(--s-5)",
    color: "var(--bone)",
    textWrap: "pretty"
  } }, "Quel guide veux-tu pour cette fois ?"), groups.map((g, gi) => /* @__PURE__ */ React.createElement("div", { key: g.label, style: { marginTop: gi === 0 ? 0 : "var(--s-5)" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    letterSpacing: "0.08em",
    color: "var(--silk-gold)",
    opacity: 0.78,
    textTransform: "uppercase",
    marginBottom: 12,
    paddingLeft: 4
  } }, g.label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, g.items.map((p) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: p.id,
      onClick: () => go && go("protocole-sub-flow", { protocolId: p.id }),
      style: {
        ...pCardBase,
        cursor: "pointer",
        textAlign: "left",
        background: "color-mix(in oklch, var(--night-floor) 55%, transparent)",
        padding: "14px 16px"
      },
      onMouseEnter: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
      onMouseLeave: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginBottom: 4
    } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, color: "var(--silk-gold)", opacity: 0.9 } }, p.glyph), /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 17,
      color: "var(--bone)"
    } }, pTxt(p, "title"))),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 13,
      color: "var(--ash-light)",
      marginBottom: 4
    } }, pTxt(p, "subtitle")),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.04em",
      color: "var(--ash-light)",
      opacity: 0.55,
      marginTop: 6
    } }, "source \xB7 ", p.source)
  )))))));
};
const ProtocoleSubFlow = ({ go, protocolId, kairosId, entryId }) => {
  var _a;
  const protocol = (window.PROTOCOLES_CATALOG || {})[protocolId] || null;
  const [stepIdx, setStepIdx] = pS(0);
  const [answers, setAnswers] = pS({});
  const [submitting, setSubmitting] = pS(false);
  const [error, setError] = pS(null);
  const [savedRecordId, setSavedRecordId] = pS(kairosId || entryId || null);
  const [completed, setCompleted] = pS(false);
  const totalSteps = protocol ? protocol.steps.length : 0;
  const step = protocol ? protocol.steps[stepIdx] : null;
  const isLast = stepIdx === totalSteps - 1;
  pE(() => {
    if (!step) return;
    if ((step.type === "breathing" || step.type === "info") && step.duration) {
      const t = setTimeout(() => {
        setAnswers((prev) => ({ ...prev, [step.id]: { type: step.type, answer: "_auto_", skipped: false } }));
        if (isLast) finalize({ type: step.type, answer: "_auto_", skipped: false });
        else setStepIdx(stepIdx + 1);
      }, step.duration);
      return () => clearTimeout(t);
    }
  }, [stepIdx, step == null ? void 0 : step.id]);
  if (!protocol) {
    return /* @__PURE__ */ React.createElement("div", { style: {
      minHeight: "100vh",
      background: "var(--night-warm)",
      display: "grid",
      placeItems: "center",
      color: "var(--ash-light)",
      fontFamily: "var(--serif)",
      fontStyle: "italic"
    } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: 24 } }, /* @__PURE__ */ React.createElement("p", null, "protocole introuvable"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => go && go("home"),
        style: pBtnGhost
      },
      "retour"
    )));
  }
  async function persist(finalAnswers, isCompleting = false) {
    var _a2, _b;
    const sessionData = {
      protocol_id: protocol.id,
      language: pLocale(),
      steps: protocol.steps.map((s) => {
        var _a3;
        const a = finalAnswers[s.id];
        return {
          id: s.id,
          type: s.type,
          answer: (_a3 = a == null ? void 0 : a.answer) != null ? _a3 : null,
          skipped: !!(a == null ? void 0 : a.skipped)
        };
      }),
      completed: isCompleting
    };
    const raw_text_parts = [];
    for (const s of protocol.steps) {
      const a = finalAnswers[s.id];
      if (!a || a.skipped) continue;
      if (typeof a.answer === "string" && a.answer.trim().length > 0 && a.answer !== "_auto_") {
        raw_text_parts.push(a.answer.trim());
      } else if (Array.isArray(a.answer) && a.answer.length > 0) {
        raw_text_parts.push(a.answer.join(", "));
      }
    }
    const composed_raw_text = raw_text_parts.join("\n\n").slice(0, 8e3) || `[${protocol.title}] d\xE9p\xF4t protocolaire`;
    const protocolPatch = {
      protocol_used: protocol.id,
      protocol_session_data: sessionData
    };
    if (isCompleting) {
      protocolPatch.protocol_completed_at = (/* @__PURE__ */ new Date()).toISOString();
      if (protocol.target === "kairos" || protocol.target === "kairos_existing") {
        protocolPatch.protocol_step_count = protocol.steps.length;
      }
    }
    try {
      if (protocol.target === "kairos_existing") {
        if (!savedRecordId) throw new Error("R\xE9entr\xE9e sans kairosId");
        await fetch("/api/kairos/" + encodeURIComponent(savedRecordId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...await authHeaders() },
          body: JSON.stringify(protocolPatch)
        });
        return savedRecordId;
      }
      if (protocol.target === "journal") {
        if (!savedRecordId) {
          const res = await fetch("/api/journal/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...await authHeaders() },
            body: JSON.stringify({
              raw_text: composed_raw_text
            })
          });
          const d = await res.json();
          if (!res.ok) throw new Error((d == null ? void 0 : d.error) || "POST journal failed");
          const newId = (_a2 = d == null ? void 0 : d.entry) == null ? void 0 : _a2.id;
          setSavedRecordId(newId);
          if (newId) {
            await fetch("/api/journal/entries/" + encodeURIComponent(newId), {
              method: "PATCH",
              headers: { "Content-Type": "application/json", ...await authHeaders() },
              body: JSON.stringify(protocolPatch)
            }).catch(() => {
            });
          }
          return newId;
        }
        await fetch("/api/journal/entries/" + encodeURIComponent(savedRecordId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...await authHeaders() },
          body: JSON.stringify({ raw_text: composed_raw_text, ...protocolPatch })
        }).catch(() => {
        });
        return savedRecordId;
      }
      if (!savedRecordId) {
        const res = await window.DreamAPI.createKairos({
          raw_text: composed_raw_text,
          kairos_type: protocol.target_type || "reve",
          capture_method: "protocol"
        });
        const newId = (_b = res == null ? void 0 : res.kairos) == null ? void 0 : _b.id;
        setSavedRecordId(newId);
        if (newId) {
          await window.DreamAPI.updateKairos(newId, protocolPatch).catch(() => {
          });
        }
        return newId;
      }
      await window.DreamAPI.updateKairos(savedRecordId, {
        raw_text: composed_raw_text,
        ...protocolPatch
      });
      return savedRecordId;
    } catch (e) {
      console.warn("[ProtocoleSubFlow.persist] failed:", e == null ? void 0 : e.message);
      throw e;
    }
  }
  async function authHeaders() {
    var _a2, _b;
    try {
      const t = await ((_b = (_a2 = window.DreamAuth) == null ? void 0 : _a2.getAccessToken) == null ? void 0 : _b.call(_a2));
      if (t) return { Authorization: "Bearer " + t };
    } catch (e) {
    }
    return {};
  }
  function recordAnswer(answer, { skipped = false } = {}) {
    const next = { ...answers, [step.id]: { type: step.type, answer, skipped } };
    setAnswers(next);
    if (isLast) {
      finalize(next[step.id], next);
    } else {
      setStepIdx(stepIdx + 1);
    }
  }
  function skipStep() {
    recordAnswer(null, { skipped: true });
  }
  async function finalize(_finalStepAnswer, finalAnswers = answers) {
    setSubmitting(true);
    setError(null);
    try {
      const id = await persist(finalAnswers, true);
      setSavedRecordId(id);
      setCompleted(true);
      try {
        window.DreamRefreshEntries && setTimeout(() => window.DreamRefreshEntries(), 250);
      } catch (e) {
      }
    } catch (e) {
      setError("Sauvegarde \xE9chou\xE9e \u2014 " + ((e == null ? void 0 : e.message) || ""));
    } finally {
      setSubmitting(false);
    }
  }
  async function pauseAndSave() {
    setSubmitting(true);
    try {
      const id = await persist(answers, false);
      setSavedRecordId(id);
      if (protocol.target === "kairos" || protocol.target === "kairos_existing") {
        if (typeof go === "function") setTimeout(() => go("kairos", id), 400);
      } else if (protocol.target === "journal") {
        if (typeof go === "function") setTimeout(() => go("home-jour"), 400);
      } else {
        if (typeof go === "function") setTimeout(() => go("home"), 400);
      }
    } catch (e) {
      setError("Sauvegarde \xE9chou\xE9e \u2014 " + ((e == null ? void 0 : e.message) || ""));
      setSubmitting(false);
    }
  }
  if (completed) {
    return /* @__PURE__ */ React.createElement("div", { style: pStageNight }, /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: 480,
      width: "100%",
      margin: "0 auto",
      textAlign: "center",
      paddingTop: "var(--s-7)"
    } }, /* @__PURE__ */ React.createElement("div", { style: {
      fontSize: 40,
      color: "var(--silk-gold)",
      opacity: 0.9,
      marginBottom: 16
    } }, protocol.glyph), /* @__PURE__ */ React.createElement("h2", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 22,
      color: "var(--bone)",
      marginBottom: 12,
      textWrap: "pretty"
    } }, "le protocole est complet"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 15,
      color: "var(--ash-light)",
      textWrap: "pretty",
      marginBottom: "var(--s-6)",
      lineHeight: 1.55
    } }, "ce que tu as d\xE9pos\xE9 tient. tu peux y revenir quand tu veux."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12, alignItems: "center" } }, (protocol.target === "kairos" || protocol.target === "kairos_existing") && savedRecordId && /* @__PURE__ */ React.createElement("button", { onClick: () => go && go("kairos", savedRecordId), style: pBtnPrimary }, "ouvrir l'entr\xE9e"), protocol.target === "journal" && /* @__PURE__ */ React.createElement("button", { onClick: () => go && go("home-jour"), style: pBtnPrimary }, "voir Journal de Vie"), /* @__PURE__ */ React.createElement("button", { onClick: () => go && go("home"), style: pBtnGhost }, "retour \xE0 l'accueil"))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: pStageNight }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px var(--s-3)",
    maxWidth: 620,
    width: "100%",
    margin: "0 auto"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: pauseAndSave,
      disabled: submitting,
      style: {
        background: "transparent",
        border: "none",
        cursor: submitting ? "wait" : "pointer",
        color: "var(--ash-light)",
        opacity: 0.7,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "8px 4px"
      }
    },
    "\u2190 garder ce que j'ai"
  ), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.08em",
    color: "var(--ash-light)",
    opacity: 0.6
  } }, stepIdx + 1, " / ", totalSteps)), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    justifyContent: "center",
    gap: 6,
    padding: "0 18px var(--s-4)"
  } }, protocol.steps.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: i <= stepIdx ? "var(--silk-gold)" : "color-mix(in oklch, var(--ash-light) 40%, transparent)",
    opacity: i === stepIdx ? 1 : i < stepIdx ? 0.6 : 0.35,
    transition: "all 380ms ease"
  } }))), /* @__PURE__ */ React.createElement("div", { style: {
    textAlign: "center",
    padding: "0 18px var(--s-5)",
    maxWidth: 540,
    width: "100%",
    margin: "0 auto"
  } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 22, color: "var(--silk-gold)", opacity: 0.85, marginBottom: 4 } }, protocol.glyph), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    color: "var(--ash-light)",
    opacity: 0.85
  } }, pTxt(protocol, "title"))), /* @__PURE__ */ React.createElement("div", { style: {
    flex: 1,
    maxWidth: 600,
    width: "100%",
    margin: "0 auto",
    padding: "0 22px"
  } }, /* @__PURE__ */ React.createElement(
    StepRenderer,
    {
      step,
      value: (_a = answers[step.id]) == null ? void 0 : _a.answer,
      onSubmit: (answer) => recordAnswer(answer),
      onSkip: step.skippable ? skipStep : null,
      submitting
    }
  ), error && /* @__PURE__ */ React.createElement("div", { style: {
    color: "var(--ember-live, #C97A4A)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    marginTop: 12,
    textAlign: "center"
  } }, error), step.skippable !== false && step.type !== "breathing" && step.type !== "info" && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginTop: 18 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: skipStep,
      disabled: submitting,
      style: {
        background: "transparent",
        border: "none",
        cursor: submitting ? "wait" : "pointer",
        color: "var(--ash-light)",
        opacity: 0.55,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        padding: "8px 12px"
      }
    },
    "passer cette question"
  ))));
};
const StepRenderer = ({ step, value, onSubmit, onSkip, submitting }) => {
  if (!step) return null;
  const Q = /* @__PURE__ */ React.createElement("p", { style: pQuestion }, pTxt(step, "question"));
  const Hint = step.hint ? /* @__PURE__ */ React.createElement("div", { style: pHint }, step.hint) : null;
  switch (step.type) {
    // ── Voix + textarea ───────────────────────────────────────
    case "textarea":
    case "title_short":
      return /* @__PURE__ */ React.createElement(
        TextareaStep,
        {
          step,
          Q,
          Hint,
          value: value || "",
          onSubmit,
          submitting,
          small: step.type === "title_short"
        }
      );
    case "two_textareas":
      return /* @__PURE__ */ React.createElement(
        TwoTextareasStep,
        {
          step,
          Q,
          Hint,
          value: value || ["", ""],
          onSubmit,
          submitting
        }
      );
    case "chips":
      return /* @__PURE__ */ React.createElement(
        ChipsStep,
        {
          step,
          Q,
          Hint,
          value,
          onSubmit,
          multi: false,
          submitting
        }
      );
    case "chips_multi":
      return /* @__PURE__ */ React.createElement(
        ChipsStep,
        {
          step,
          Q,
          Hint,
          value: value || [],
          onSubmit,
          multi: true,
          submitting
        }
      );
    case "binary":
      return /* @__PURE__ */ React.createElement(
        ChipsStep,
        {
          step,
          Q,
          Hint,
          value,
          onSubmit,
          multi: false,
          submitting,
          binary: true
        }
      );
    case "slider":
      return /* @__PURE__ */ React.createElement(
        SliderStep,
        {
          step,
          Q,
          Hint,
          value,
          onSubmit,
          submitting
        }
      );
    case "body_zone":
      return /* @__PURE__ */ React.createElement(
        BodyZoneStep,
        {
          step,
          Q,
          Hint,
          value,
          onSubmit,
          submitting
        }
      );
    case "body_zone_full":
      return /* @__PURE__ */ React.createElement(
        BodyZoneFullStep,
        {
          step,
          Q,
          Hint,
          value,
          onSubmit,
          submitting
        }
      );
    case "aha_capture":
      return /* @__PURE__ */ React.createElement(
        AhaCaptureStep,
        {
          step,
          Q,
          Hint,
          onSubmit,
          submitting
        }
      );
    case "breathing":
      return /* @__PURE__ */ React.createElement(BreathingStep, { step, Q, Hint });
    case "info":
      return /* @__PURE__ */ React.createElement(InfoStep, { step, Q, Hint });
    default:
      return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", color: "var(--ash-light)", padding: 24 } }, Q, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, opacity: 0.5, fontFamily: "var(--mono)", fontSize: 11 } }, 'type "', step.type, '" non g\xE9r\xE9 \u2014 passer'));
  }
};
const TextareaStep = ({ step, Q, Hint, value, onSubmit, submitting, small }) => {
  const [text, setText] = pS(value);
  const [recording, setRecording] = pS(false);
  const [transcribing, setTranscribing] = pS(false);
  const mediaRef = pR(null);
  const chunksRef = pR([]);
  const pickMimeType = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4;codecs=mp4a.40.2", "audio/mp4", "audio/aac"];
    for (const t of candidates) {
      try {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t;
      } catch (e) {
      }
    }
    return "";
  };
  const startRecord = async () => {
    try {
      if (typeof MediaRecorder === "undefined") return;
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
          const r = await window.DreamAPI.transcribe(blob, actualMime);
          if (r == null ? void 0 : r.text) setText((prev) => (prev ? prev + " " : "") + r.text);
        } catch (e) {
        } finally {
          setTranscribing(false);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
    }
  };
  const stopRecord = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRecording(false);
  };
  return /* @__PURE__ */ React.createElement("div", null, Q, Hint, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: text,
      onChange: (e) => setText(e.target.value),
      placeholder: step.placeholder || "\u2026",
      disabled: submitting,
      autoFocus: true,
      rows: small ? 2 : 5,
      style: {
        width: "100%",
        boxSizing: "border-box",
        background: "color-mix(in oklch, var(--night-floor) 60%, transparent)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
        padding: "16px 18px",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 17,
        lineHeight: 1.55,
        outline: "none",
        resize: "vertical",
        marginTop: 18,
        transition: "border-color 380ms ease"
      },
      onFocus: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
      onBlur: (e) => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"
    }
  ), transcribing && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--silk-gold)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, marginTop: 8 } }, "transcription en cours\u2026"), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 18
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: recording ? stopRecord : startRecord,
      "aria-label": recording ? "arr\xEAter" : "voix",
      style: pVoiceBtn(recording)
    },
    recording ? "\u25A0" : "\u{1F399}"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSubmit(text.trim()),
      disabled: submitting || text.trim().length < 1,
      style: pSubmitBtn(submitting || text.trim().length < 1)
    },
    submitting ? "\u2026" : "\u2304"
  )), /* @__PURE__ */ React.createElement("div", { style: pSubmitLabel }, "continuer"));
};
const TwoTextareasStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const [a, setA] = pS(value[0] || "");
  const [b, setB] = pS(value[1] || "");
  return /* @__PURE__ */ React.createElement("div", null, Q, Hint, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: a,
      onChange: (e) => setA(e.target.value),
      disabled: submitting,
      placeholder: "\u2026",
      rows: 3,
      autoFocus: true,
      style: pTwoTaStyle()
    }
  ), /* @__PURE__ */ React.createElement("p", { style: { ...pQuestion, fontSize: 17, marginTop: 18 } }, pTxt(step, "subQuestion")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: b,
      onChange: (e) => setB(e.target.value),
      disabled: submitting,
      placeholder: "\u2026",
      rows: 3,
      style: pTwoTaStyle()
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 18, display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSubmit([a.trim(), b.trim()]),
      disabled: submitting || a.trim().length < 1 && b.trim().length < 1,
      style: pSubmitBtn(submitting || a.trim().length < 1 && b.trim().length < 1)
    },
    submitting ? "\u2026" : "\u2304"
  )), /* @__PURE__ */ React.createElement("div", { style: pSubmitLabel }, "continuer"));
};
const ChipsStep = ({ step, Q, Hint, value, onSubmit, multi, submitting, binary }) => {
  const [sel, setSel] = pS(multi ? Array.isArray(value) ? value : [] : value);
  const toggle = (k) => {
    if (multi) {
      setSel((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
    } else {
      setSel(k);
      setTimeout(() => onSubmit(k), 280);
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, Q, Hint, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 22
  } }, (step.chips || []).map(([k, l]) => {
    const active = multi ? sel.includes(k) : sel === k;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => toggle(k),
        disabled: submitting,
        style: {
          padding: "10px 16px",
          borderRadius: 100,
          border: "1px solid " + (active ? "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))" : "color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))"),
          background: active ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)" : "transparent",
          color: active ? "var(--bone)" : "var(--ash-light)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: submitting ? "wait" : "pointer",
          transition: "all 280ms ease"
        }
      },
      l
    );
  })), multi && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSubmit(sel),
      disabled: submitting,
      style: pSubmitBtn(submitting)
    },
    submitting ? "\u2026" : "\u2304"
  )), multi && /* @__PURE__ */ React.createElement("div", { style: pSubmitLabel }, "continuer"));
};
const SliderStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const min = step.min || 1;
  const max = step.max || 5;
  const [v, setV] = pS(value || Math.round((min + max) / 2));
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, Q, Hint, /* @__PURE__ */ React.createElement("div", { style: { marginTop: 28 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min,
      max,
      step: "1",
      value: v,
      onChange: (e) => setV(parseInt(e.target.value, 10)),
      style: { width: "100%", maxWidth: 320 }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 12,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 24,
    color: "var(--silk-gold)"
  } }, v, " / ", max)), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSubmit(v),
      disabled: submitting,
      style: pSubmitBtn(submitting)
    },
    submitting ? "\u2026" : "\u2304"
  )), /* @__PURE__ */ React.createElement("div", { style: pSubmitLabel }, "continuer"));
};
const BodyZoneStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const ZONES_DEFAULT = ["corps_entier"];
  const ZONES_FULL = [
    ["tete", "t\xEAte"],
    ["gorge", "gorge"],
    ["coeur", "c\u0153ur"],
    ["ventre", "ventre"],
    ["bassin", "bassin"],
    ["jambes", "jambes"]
  ];
  const ext = (() => {
    try {
      return localStorage.getItem("dream:felt-shift-mode") === "6-zones";
    } catch (e) {
      return false;
    }
  })();
  const [sel, setSel] = pS(value || null);
  return /* @__PURE__ */ React.createElement("div", null, Q, Hint, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 22
  } }, (ext ? ZONES_FULL : [["corps_entier", "dans tout le corps"]]).map(([k, l]) => {
    const active = sel === k;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => {
          setSel(k);
          setTimeout(() => onSubmit(k), 280);
        },
        disabled: submitting,
        style: {
          padding: "10px 16px",
          borderRadius: 100,
          border: "1px solid " + (active ? "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))" : "color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))"),
          background: active ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)" : "transparent",
          color: active ? "var(--bone)" : "var(--ash-light)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: submitting ? "wait" : "pointer"
        }
      },
      l
    );
  }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSubmit("rien"),
      disabled: submitting,
      style: {
        padding: "10px 16px",
        borderRadius: 100,
        border: "none",
        background: "transparent",
        color: "var(--ash-light)",
        opacity: 0.6,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        cursor: submitting ? "wait" : "pointer"
      }
    },
    "rien ne bouge"
  )));
};
const BodyZoneFullStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  var _a;
  const [sel, setSel] = pS(value || null);
  const ZONES = [
    { id: "head", label: "t\xEAte", cx: 100, cy: 38, r: 22 },
    { id: "throat", label: "gorge", cx: 100, cy: 76, r: 11 },
    { id: "shoulders", label: "\xE9paules", cx: 100, cy: 92, r: 18 },
    { id: "heart", label: "c\u0153ur", cx: 100, cy: 118, r: 16 },
    { id: "belly", label: "ventre", cx: 100, cy: 168, r: 22 },
    { id: "lower_belly", label: "bas-ventre", cx: 100, cy: 198, r: 17 },
    { id: "pelvis", label: "bassin", cx: 100, cy: 220, r: 15 },
    { id: "feet", label: "pieds", cx: 100, cy: 312, r: 13 }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, Q, Hint, /* @__PURE__ */ React.createElement(
    "svg",
    {
      viewBox: "0 0 200 340",
      width: "200",
      height: "auto",
      style: { maxHeight: 380, display: "block", margin: "16px auto 8px" }
    },
    /* @__PURE__ */ React.createElement("g", { style: {
      fill: "color-mix(in oklch, var(--ash-mid) 40%, transparent)",
      stroke: "var(--ash-mid)",
      strokeWidth: 0.6
    } }, /* @__PURE__ */ React.createElement("ellipse", { cx: "100", cy: "38", rx: "22", ry: "26" }), /* @__PURE__ */ React.createElement("rect", { x: "93", y: "62", width: "14", height: "14" }), /* @__PURE__ */ React.createElement("path", { d: "M 70 76 Q 100 72 130 76 L 138 168 Q 100 178 62 168 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 64 170 L 136 170 L 132 222 Q 100 230 68 222 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 70 226 L 78 312 L 92 312 L 96 226 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 104 226 L 108 312 L 122 312 L 130 226 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 64 84 L 44 178 L 56 180 L 72 92 Z" }), /* @__PURE__ */ React.createElement("path", { d: "M 136 84 L 156 178 L 144 180 L 128 92 Z" })),
    ZONES.map((z) => {
      const active = sel === z.id;
      return /* @__PURE__ */ React.createElement(
        "circle",
        {
          key: z.id,
          cx: z.cx,
          cy: z.cy,
          r: z.r,
          style: {
            fill: active ? "color-mix(in oklch, var(--silk-gold) 28%, transparent)" : "transparent",
            stroke: active ? "var(--silk-gold)" : "color-mix(in oklch, var(--ash-light) 30%, transparent)",
            strokeWidth: active ? 1.5 : 0.5,
            cursor: submitting ? "wait" : "pointer",
            transition: "all 280ms ease"
          },
          onClick: () => {
            setSel(z.id);
            setTimeout(() => onSubmit(z.id), 320);
          }
        }
      );
    })
  ), sel && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--silk-gold)",
    marginTop: 4
  } }, (_a = ZONES.find((z) => z.id === sel)) == null ? void 0 : _a.label));
};
const AhaCaptureStep = ({ step, Q, Hint, onSubmit, submitting }) => {
  const [chosen, setChosen] = pS(null);
  const [note, setNote] = pS("");
  return /* @__PURE__ */ React.createElement("div", null, Q, Hint, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    marginTop: 22
  } }, [
    ["fort", "\xE7a r\xE9sonne fort"],
    ["partiel", "partiel"],
    ["non", "pas du tout"],
    ["note", "autre \u2014 note libre"]
  ].map(([k, l]) => {
    const active = chosen === k;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => setChosen(k),
        disabled: submitting,
        style: {
          padding: "10px 16px",
          borderRadius: 100,
          border: "1px solid " + (active ? "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))" : "color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))"),
          background: active ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)" : "transparent",
          color: active ? "var(--bone)" : "var(--ash-light)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14,
          cursor: submitting ? "wait" : "pointer"
        }
      },
      l
    );
  })), chosen === "note" && /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: note,
      onChange: (e) => setNote(e.target.value),
      placeholder: "ce qui s'est pos\xE9, ou ce qui n'a pas regard\xE9\u2026",
      disabled: submitting,
      rows: 3,
      style: {
        ...pTwoTaStyle(),
        marginTop: 16
      }
    }
  ), chosen && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22, display: "flex", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSubmit({ aha: chosen, note: note.trim() }),
      disabled: submitting,
      style: pSubmitBtn(submitting)
    },
    submitting ? "\u2026" : "\u2304"
  )), /* @__PURE__ */ React.createElement("div", { style: { ...pSubmitLabel, marginTop: 6 } }, "d\xE9poser ton aha \xB7 achever"));
};
const BreathingStep = ({ step, Q, Hint }) => {
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "var(--s-5) 0" } }, Q, Hint, /* @__PURE__ */ React.createElement("div", { style: {
    margin: "32px auto 0",
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--silk-gold) 24%, transparent), color-mix(in oklch, var(--ember) 16%, transparent))",
    animation: "p-breath 14s ease-in-out infinite"
  } }), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes p-breath {
          0%   { transform: scale(0.7); opacity: 0.6; }
          28%  { transform: scale(1.15); opacity: 1; }
          50%  { transform: scale(1.15); opacity: 1; }
          92%  { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(0.7); opacity: 0.6; }
        }
      `));
};
const InfoStep = ({ Q, Hint }) => {
  return /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "var(--s-7) 0" } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    color: "var(--silk-gold)",
    marginBottom: 12,
    textWrap: "pretty"
  } }, Q.props.children), Hint);
};
const pStageNight = {
  minHeight: "100vh",
  background: "var(--night-warm)",
  color: "var(--bone)",
  paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
  position: "relative",
  display: "flex",
  flexDirection: "column"
};
const pCardBase = {
  border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
  padding: "var(--s-5) var(--s-4)",
  transition: "border-color 380ms ease, background 380ms ease"
};
const pBtnPrimary = {
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
};
const pBtnGhost = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "var(--ash-light)",
  opacity: 0.6,
  fontFamily: "var(--serif)",
  fontStyle: "italic",
  fontSize: 13,
  padding: "8px 0"
};
const pQuestion = {
  fontFamily: "var(--serif)",
  fontStyle: "italic",
  fontSize: 19,
  lineHeight: 1.45,
  color: "var(--bone)",
  textAlign: "center",
  marginTop: 12,
  marginBottom: 4,
  textWrap: "pretty",
  whiteSpace: "pre-line"
};
const pHint = {
  fontFamily: "var(--serif)",
  fontStyle: "italic",
  fontSize: 13,
  color: "var(--ash-light)",
  opacity: 0.7,
  textAlign: "center",
  marginBottom: 4,
  textWrap: "pretty"
};
const pTwoTaStyle = () => ({
  width: "100%",
  boxSizing: "border-box",
  background: "color-mix(in oklch, var(--night-floor) 60%, transparent)",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
  padding: "14px 16px",
  color: "var(--bone)",
  fontFamily: "var(--serif)",
  fontStyle: "italic",
  fontSize: 16,
  lineHeight: 1.55,
  outline: "none",
  resize: "vertical",
  marginTop: 12
});
const pVoiceBtn = (recording) => ({
  background: "transparent",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))",
  borderRadius: "50%",
  width: 44,
  height: 44,
  cursor: "pointer",
  color: recording ? "var(--ember-live, #C97A4A)" : "var(--ash-light)",
  fontSize: 16,
  opacity: 0.85,
  display: "grid",
  placeItems: "center"
});
const pSubmitBtn = (disabled) => ({
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--ember) 32%, var(--night-warm)), color-mix(in oklch, var(--silk-gold) 18%, var(--night-floor)))",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.45 : 1,
  display: "grid",
  placeItems: "center",
  color: "var(--bone)",
  fontSize: 22,
  boxShadow: "0 0 24px color-mix(in oklch, var(--silk-gold) 22%, transparent)",
  transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
});
const pSubmitLabel = {
  marginTop: 8,
  textAlign: "center",
  fontFamily: "var(--serif)",
  fontStyle: "italic",
  fontSize: 12,
  color: "var(--ash-light)",
  opacity: 0.6,
  letterSpacing: "0.04em"
};
Object.assign(window, {
  CaptureChoiceScreen,
  ProtocoleSelector,
  ProtocoleSubFlow,
  ProtocoleDiscoveryReveal,
  shouldRevealProtocoles,
  markProtocolesRevealed,
  markProtocolesDismissed
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1wcm90b2NvbGVzLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0LCB3aW5kb3cgKi9cbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuLy8gU0NSRUVOUyBQUk9UT0NPTEVTIFx1MjAxNCBVSSBjb21wb25lbnRzXG4vLyBTcGVjIDogMV9CSUJMRSBcdTAwQTczLjExICsgMl9ERVNJR04gXHUwMEE3MTEuYmlzLjEzXG4vLyBZZXNodWEsIDIwMjYtMDQtMjYgbnVpdCBwcm9mb25kZS5cbi8vXG4vLyBDb21wb25lbnRzIGV4cG9zZWQgb24gd2luZG93IDpcbi8vICAgLSBDYXB0dXJlQ2hvaWNlU2NyZWVuICAgICBcdTAwRTljcmFuIFx1MjZBMS9cdUQ4M0NcdURGMDAgKHZpc2libGUgc2kgdXNlciBhIFx1MjI2NTMga2Fpcm9zKVxuLy8gICAtIFByb3RvY29sZVNlbGVjdG9yICAgICAgIG1vZGFsIHNcdTAwRTlsZWN0aW9uIDkgcHJvdG9jb2xlcyArIDIgcml0dWVsc1xuLy8gICAtIFByb3RvY29sZVN1YkZsb3cgICAgICAgIHN0YXRlIG1hY2hpbmUgZ1x1MDBFOW5cdTAwRTlyaXF1ZSBcdTAwRTl0YXBlIHBhciBcdTAwRTl0YXBlXG4vLyAgIC0gUHJvdG9jb2xlRGlzY292ZXJ5UmV2ZWFsIG1vZGFsIGRvdWNlIEozIChpbnRcdTAwRTlnclx1MDBFOWUgZGFucyBmbG93IERyZWFtIEhvbWUpXG4vL1xuLy8gUlx1MDBFOXV0aWxpc2UgOlxuLy8gICAtIHdpbmRvdy5BaGFDYXB0dXJlICAgICAgICAgIChzY3JlZW5zLXNoYXJlZC5qc3gpIHBvdXIgXHUwMEU5dGFwZSBcImFoYV9jYXB0dXJlXCJcbi8vICAgLSB3aW5kb3cuRmVsdFNoaWZ0R2F0ZSAgICAgICAoc2NyZWVucy1zaGFyZWQuanN4KSBwb3VyIFx1MDBFOXRhcGUgXCJib2R5X3pvbmVcIlxuLy8gICAtIHdpbmRvdy5PcmFjbGVDb3Jwc1NjcmVlbiAgIHNpbGhvdWV0dGUgXHUyMTkyIG9uIGludFx1MDBFOGdyZSB1bmUgbWluaS12ZXJzaW9uIHBvdXIgYm9keV96b25lX2Z1bGxcbi8vICAgLSB3aW5kb3cuRHJlYW1BUEkuY3JlYXRlS2Fpcm9zLCB1cGRhdGVLYWlyb3MsIHRyYW5zY3JpYmVcbi8vICAgLSBmZXRjaChcIi9hcGkvam91cm5hbC9lbnRyaWVzXCIpICBwb3VyIGNpYmxlIFwiam91cm5hbFwiXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcblxuY29uc3QgeyB1c2VTdGF0ZTogcFMsIHVzZUVmZmVjdDogcEUsIHVzZVJlZjogcFIsIHVzZU1lbW86IHBNIH0gPSBSZWFjdDtcblxuLy8gXHUyNTAwXHUyNTAwIEhlbHBlcnMgbG9jYWxlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gcExvY2FsZSgpIHtcbiAgdHJ5IHsgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJlYW06bG9jYWxlXCIpID09PSBcImVuXCIgPyBcImVuXCIgOiBcImZyXCI7IH1cbiAgY2F0Y2ggeyByZXR1cm4gXCJmclwiOyB9XG59XG5mdW5jdGlvbiBwVHh0KG9iaiwga2V5KSB7XG4gIGNvbnN0IGxvYyA9IHBMb2NhbGUoKTtcbiAgaWYgKGxvYyA9PT0gXCJlblwiICYmIG9ialtrZXkgKyBcIl9lblwiXSkgcmV0dXJuIG9ialtrZXkgKyBcIl9lblwiXTtcbiAgcmV0dXJuIG9ialtrZXldO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgRGlzY292ZXJ5IHByb2dyZXNzaXZlIChyXHUwMEU5dXRpbGlzYWJsZSBkZXB1aXMgRHJlYW0gSG9tZSkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBQUk9UT0NPTEVTX1JFVkVBTF9LRVkgPSBcImRyZWFtOnByb3RvY29sZXM6cmV2ZWFsZWQtYXRcIjtcbmNvbnN0IFBST1RPQ09MRVNfRElTTUlTU0VEX0tFWSA9IFwiZHJlYW06cHJvdG9jb2xlczpkaXNtaXNzZWQtYXRcIjtcblxuZnVuY3Rpb24gc2hvdWxkUmV2ZWFsUHJvdG9jb2xlcyhrYWlyb3NDb3VudCkge1xuICB0cnkge1xuICAgIGNvbnN0IHJldmVhbGVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oUFJPVE9DT0xFU19SRVZFQUxfS0VZKTtcbiAgICBpZiAocmV2ZWFsZWQpIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCBkaXNtaXNzZWRBdCA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKFBST1RPQ09MRVNfRElTTUlTU0VEX0tFWSkgfHwgXCIwXCIsIDEwKTtcbiAgICBpZiAoZGlzbWlzc2VkQXQgJiYgRGF0ZS5ub3coKSAtIGRpc21pc3NlZEF0IDwgNyAqIDI0ICogMzYwMCAqIDEwMDApIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4ga2Fpcm9zQ291bnQgPj0gMztcbiAgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxufVxuZnVuY3Rpb24gbWFya1Byb3RvY29sZXNSZXZlYWxlZCgpIHtcbiAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUFJPVE9DT0xFU19SRVZFQUxfS0VZLCBTdHJpbmcoRGF0ZS5ub3coKSkpOyB9IGNhdGNoIHt9XG59XG5mdW5jdGlvbiBtYXJrUHJvdG9jb2xlc0Rpc21pc3NlZCgpIHtcbiAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oUFJPVE9DT0xFU19ESVNNSVNTRURfS0VZLCBTdHJpbmcoRGF0ZS5ub3coKSkpOyB9IGNhdGNoIHt9XG59XG5cbmNvbnN0IFByb3RvY29sZURpc2NvdmVyeVJldmVhbCA9ICh7IGdvLCBvbkNsb3NlIH0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHJvbGU9XCJkaWFsb2dcIiBhcmlhLW1vZGFsPVwidHJ1ZVwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBpbnNldDogMCwgekluZGV4OiAzMjAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgODAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig4cHgpXCIsXG4gICAgICAgIFdlYmtpdEJhY2tkcm9wRmlsdGVyOiBcImJsdXIoOHB4KVwiLFxuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy01KVwiLFxuICAgICAgICBhbmltYXRpb246IFwicC1mYWRlLWluIDQ4MG1zIGVhc2VcIixcbiAgICAgIH19PlxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBtYXhXaWR0aDogNDQwLCB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA5MiUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTYpIHZhcigtLXMtNSlcIixcbiAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgfX0+XG4gICAgICAgIHsvKiAyMDI2LTA0LTI3IFx1MjAxNCBGaXggU3ByaW50IFAwIFx1MDBBN0MgOiByZW1wbGFjZW1lbnQgZW1vamkgXHVEODNDXHVERjAwIChyZW5kdSBibGV1IE9TLW5hdGlmIEhPUlMgcGFsZXR0ZSlcbiAgICAgICAgICAgIHBhciBTVkcgc3BpcmFsZSBzb2JyZSBxdWkgcmVzcGVjdGUgdmFyKC0tc2lsay1nb2xkKS4gR2x5cGhlIGluc3Bpclx1MDBFOSBzcGlyYWxlIGFyY2hhXHUwMEVGcXVlLFxuICAgICAgICAgICAgY29oXHUwMEU5cmVudCBhdmVjIHBhbGV0dGUgZGFyay1maXJzdCBva2xjaC4gKi99XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtMylcIiwgZGlzcGxheTogXCJncmlkXCIsIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIgfX0gYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgPHN2ZyB3aWR0aD1cIjM2XCIgaGVpZ2h0PVwiMzZcIiB2aWV3Qm94PVwiMCAwIDQwIDQwXCIgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiLCBvcGFjaXR5OiAwLjg1IH19PlxuICAgICAgICAgICAgPHBhdGhcbiAgICAgICAgICAgICAgZD1cIk0gMjAgNlxuICAgICAgICAgICAgICAgICBhIDE0IDE0IDAgMSAxIC0xMCAyMy44XG4gICAgICAgICAgICAgICAgIGEgMTAgMTAgMCAxIDEgMTYuNSAtNy41XG4gICAgICAgICAgICAgICAgIGEgNiA2IDAgMSAxIC0xMCA0XG4gICAgICAgICAgICAgICAgIGEgMyAzIDAgMSAxIDUuMiAtMlwiXG4gICAgICAgICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICAgICAgICAgc3Ryb2tlPVwidmFyKC0tc2lsay1nb2xkKVwiXG4gICAgICAgICAgICAgIHN0cm9rZVdpZHRoPVwiMS4yXCJcbiAgICAgICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgICAgICAgb3BhY2l0eT1cIjAuOVwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3ZnPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE3LFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHVuIGF1dHJlIGNoZW1pbiBwb3VyIGRcdTAwRTlwb3NlclxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSwgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTUpXCIsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICBTYWlzLXR1IHF1J1x1MDBFMCBjaGFxdWUgZFx1MDBFOXBcdTAwRjR0LCB0dSBwZXV4IGNob2lzaXIgZW50cmUgcmFwaWRlIG91IGFjY29tcGFnblx1MDBFOSBwYXIgdW4gZ3VpZGUgaW5zcGlyXHUwMEU5IGQndW5lIHZvaXggZGUgbGEgRm9yXHUwMEVBdCA/XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiAxMCB9fT5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgbWFya1Byb3RvY29sZXNSZXZlYWxlZCgpOyBvbkNsb3NlICYmIG9uQ2xvc2UoKTsgaWYgKHR5cGVvZiBnbyA9PT0gXCJmdW5jdGlvblwiKSBzZXRUaW1lb3V0KCgpID0+IGdvKFwicHJvdG9jb2xlLXNlbGVjdG9yXCIpLCAyMDApOyB9fVxuICAgICAgICAgICAgc3R5bGU9e3BCdG5QcmltYXJ5fT5cbiAgICAgICAgICAgIGVzc2F5ZXIgdW4gZ3VpZGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IHsgbWFya1Byb3RvY29sZXNEaXNtaXNzZWQoKTsgb25DbG9zZSAmJiBvbkNsb3NlKCk7IH19XG4gICAgICAgICAgICBzdHlsZT17cEJ0bkdob3N0fT5cbiAgICAgICAgICAgIHBsdXMgdGFyZFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPHN0eWxlPntgQGtleWZyYW1lcyBwLWZhZGUtaW4geyBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7IH0gdG8geyBvcGFjaXR5OiAxOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7IH0gfWB9PC9zdHlsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gQ2FwdHVyZUNob2ljZVNjcmVlbiBcdTIwMTQgXHUwMEU5Y3JhbiBkZSBjaG9peCBRdWljayAvIEF2ZWMgdW4gZ3VpZGVcbi8vIFZpc2libGUgVU5JUVVFTUVOVCBzaSB1c2VyIGEgXHUyMjY1MyBrYWlyb3MuIFNpbm9uIFx1MjE5MiBmbG93IFF1aWNrIGRpcmVjdC5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBDYXB0dXJlQ2hvaWNlU2NyZWVuID0gKHsgZ28gfSkgPT4ge1xuICAvLyBDb21wdGUgbGVzIGthaXJvcyBkZXB1aXMgd2luZG93LkRyZWFtQVBJXG4gIGNvbnN0IFtrYWlyb3NDb3VudCwgc2V0S2Fpcm9zQ291bnRdID0gcFMobnVsbCk7IC8vIG51bGwgPSBsb2FkaW5nXG5cbiAgcEUoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICAoYXN5bmMgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCF3aW5kb3cuRHJlYW1BUEk/Lmxpc3RLYWlyb3MpIHsgaWYgKCFjYW5jZWxsZWQpIHNldEthaXJvc0NvdW50KDApOyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5saXN0S2Fpcm9zKHsgbGltaXQ6IDUwIH0pO1xuICAgICAgICBjb25zdCBuID0gKGRhdGE/LmthaXJvcyB8fCBbXSkubGVuZ3RoO1xuICAgICAgICBpZiAoIWNhbmNlbGxlZCkgc2V0S2Fpcm9zQ291bnQobik7XG4gICAgICB9IGNhdGNoIHsgaWYgKCFjYW5jZWxsZWQpIHNldEthaXJvc0NvdW50KDApOyB9XG4gICAgfSkoKTtcbiAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICB9LCBbXSk7XG5cbiAgLy8gQXZhbnQgM2UgZFx1MDBFOXBcdTAwRjR0IFx1MjE5MiBieXBhc3MgZGlyZWN0IHZlcnMgZmxvdyBRdWljayAoZXhpc3RhbnQpXG4gIHBFKCgpID0+IHtcbiAgICBpZiAoa2Fpcm9zQ291bnQgIT09IG51bGwgJiYga2Fpcm9zQ291bnQgPCAzKSB7XG4gICAgICAvLyBEaXJlY3QgdmVycyBDYXB0dXJlIHF1aWNrIGV4aXN0YW50XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IGdvICYmIGdvKFwiY2FwdHVyZVwiKSwgMCk7XG4gICAgfVxuICB9LCBba2Fpcm9zQ291bnRdKTtcblxuICBpZiAoa2Fpcm9zQ291bnQgPT09IG51bGwgfHwga2Fpcm9zQ291bnQgPCAzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgbWluSGVpZ2h0OiBcIjEwMHZoXCIsIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIixcbiAgICAgICAgZGlzcGxheTogXCJncmlkXCIsIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgb3BhY2l0eTogMC42IH19Plx1MjAyNjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgbWluSGVpZ2h0OiBcIjEwMHZoXCIsIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIiwgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgIHBhZGRpbmdUb3A6IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMHB4KSArIDE4cHgpXCIsXG4gICAgICBwYWRkaW5nQm90dG9tOiBcImNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20sIDBweCkgKyAxMTBweClcIixcbiAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIG92ZXJmbG93OiBcImhpZGRlblwiLFxuICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgfX0+XG4gICAgICB7LyogSGVhZGVyIFx1MjAxNCBib3V0b24gcGFzc2VyIChza2lwIGNob2ljZSBcdTIxOTIgZmxvdyBRdWljayBkaXJlY3QpICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1lbmRcIiwgcGFkZGluZzogXCIwIDIycHggNHB4XCIsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImNhcHR1cmVcIil9XG4gICAgICAgICAgYXJpYS1sYWJlbD1cInBhc3NlciBjZSBjaG9peFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC42LFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjhweCAxMnB4XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgcGFzc2VyIFx1MjE5MlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogQ2VudHJlIDogdGl0cmUgKyAyIGNhcmRzICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBmbGV4OiAxLCBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy01KSAyMnB4IHZhcigtLXMtNilcIiwgbWF4V2lkdGg6IDU0MCwgd2lkdGg6IFwiMTAwJVwiLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICB9fT5cbiAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDIyLCBsaW5lSGVpZ2h0OiAxLjQ1LCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNilcIiwgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgQ29tbWVudCB2ZXV4LXR1IGRcdTAwRTlwb3NlciA/XG4gICAgICAgIDwvcD5cblxuICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDE2IH19PlxuICAgICAgICAgIHsvKiBDYXJkIFx1MjZBMSBSYXBpZGUgKi99XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImNhcHR1cmVcIil9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAuLi5wQ2FyZEJhc2UsXG4gICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsIHRleHRBbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgNjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzglLCB2YXIoLS1hc2gtZGVlcCkpXCJ9XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCJ9PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250U2l6ZTogMjYsIG1hcmdpbkJvdHRvbTogOCxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBvcGFjaXR5OiAwLjksXG4gICAgICAgICAgICB9fT5cdTI2QTE8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTksXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG1hcmdpbkJvdHRvbTogNixcbiAgICAgICAgICAgIH19PlJhcGlkZTwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICB9fT5lbiAzMCBzZWNvbmRlcyBcdTIwMTQgdW4gZnJhZ21lbnQsIHVuZSBpbWFnZTwvZGl2PlxuICAgICAgICAgIDwvYnV0dG9uPlxuXG4gICAgICAgICAgey8qIENhcmQgXHVEODNDXHVERjAwIEF2ZWMgdW4gZ3VpZGUgKi99XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcInByb3RvY29sZS1zZWxlY3RvclwiKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIC4uLnBDYXJkQmFzZSxcbiAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIiwgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA2MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzOCUsIHZhcigtLWFzaC1kZWVwKSlcIn1cbiAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLWFzaC1kZWVwKSlcIn0+XG4gICAgICAgICAgICB7LyogMjAyNi0wNC0yNyBTcHJpbnQgUDAgXHUwMEE3QyA6IFNWRyBzcGlyYWxlIHNvYnJlLCByZW1wbGFjZSBlbW9qaSBcdUQ4M0NcdURGMDAgKHJlbmR1IE9TIGJsZXUpICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDgsIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiIH19IGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMjZcIiBoZWlnaHQ9XCIyNlwiIHZpZXdCb3g9XCIwIDAgNDAgNDBcIiBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIsIG9wYWNpdHk6IDAuOSB9fT5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgZD1cIk0gMjAgNlxuICAgICAgICAgICAgICAgICAgICAgYSAxNCAxNCAwIDEgMSAtMTAgMjMuOFxuICAgICAgICAgICAgICAgICAgICAgYSAxMCAxMCAwIDEgMSAxNi41IC03LjVcbiAgICAgICAgICAgICAgICAgICAgIGEgNiA2IDAgMSAxIC0xMCA0XG4gICAgICAgICAgICAgICAgICAgICBhIDMgMyAwIDEgMSA1LjIgLTJcIlxuICAgICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgc3Ryb2tlPVwidmFyKC0tc2lsay1nb2xkKVwiXG4gICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjEuNFwiXG4gICAgICAgICAgICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE5LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCBtYXJnaW5Cb3R0b206IDYsXG4gICAgICAgICAgICB9fT5BdmVjIHVuIGd1aWRlPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIGxpbmVIZWlnaHQ6IDEuNSxcbiAgICAgICAgICAgIH19PnVuIHByb3RvY29sZSBpbnNwaXJcdTAwRTkgZCd1bmUgdm9peCBkZSBsYSBGb3JcdTAwRUF0PC9kaXY+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFByb3RvY29sZVNlbGVjdG9yIFx1MjAxNCBtb2RhbCBkZSBzXHUwMEU5bGVjdGlvbiAocm91dGUgcHJvdG9jb2xlLXNlbGVjdG9yKVxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFByb3RvY29sZVNlbGVjdG9yID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBjYXRhbG9nID0gd2luZG93LlBST1RPQ09MRVNfQ0FUQUxPRyB8fCB7fTtcbiAgY29uc3QgYWxsID0gT2JqZWN0LnZhbHVlcyhjYXRhbG9nKTtcbiAgLy8gR3JvdXAgOiBwYXIgY2F0ZWdvcnlfbGFiZWwgZGFucyBsJ29yZHJlIGNhdGFsb2d1ZVxuICBjb25zdCBncm91cHMgPSBwTSgoKSA9PiB7XG4gICAgY29uc3Qgb3V0ID0gW107XG4gICAgY29uc3Qgc2VlbiA9IG5ldyBTZXQoKTtcbiAgICBmb3IgKGNvbnN0IHAgb2YgYWxsKSB7XG4gICAgICAvLyBTa2lwIHJlZW50cnkgZGUgbGEgbGlzdGUgKGFjY2Vzc2libGUgZGVwdWlzIEthaXJvc0RldGFpbClcbiAgICAgIGlmIChwLmlkID09PSBcInJlZW50cnlcIikgY29udGludWU7XG4gICAgICBjb25zdCBjYXQgPSBwLmNhdGVnb3J5X2xhYmVsIHx8IFwiQXV0cmVzXCI7XG4gICAgICBpZiAoIXNlZW4uaGFzKGNhdCkpIHtcbiAgICAgICAgc2Vlbi5hZGQoY2F0KTtcbiAgICAgICAgb3V0LnB1c2goeyBsYWJlbDogY2F0LCBpdGVtczogW10gfSk7XG4gICAgICB9XG4gICAgICBvdXQuZmluZChnID0+IGcubGFiZWwgPT09IGNhdCkuaXRlbXMucHVzaChwKTtcbiAgICB9XG4gICAgcmV0dXJuIG91dDtcbiAgfSwgW2NhdGFsb2ddKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLCBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICBwYWRkaW5nVG9wOiBcImNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC10b3AsIDBweCkgKyAxNHB4KVwiLFxuICAgICAgcGFkZGluZ0JvdHRvbTogXCJjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tLCAwcHgpICsgMTEwcHgpXCIsXG4gICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgIH19PlxuICAgICAgey8qIEhlYWRlciAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgcGFkZGluZzogXCIwIDE4cHggMTJweFwiLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJjYXB0dXJlLWNob2ljZVwiKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiOHB4IDRweFwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJob21lXCIpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgcGFkZGluZzogXCI4cHggMTJweFwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgIGZlcm1lclxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIG1heFdpZHRoOiA1ODAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICBwYWRkaW5nOiBcIjhweCAxOHB4IDBcIixcbiAgICAgIH19PlxuICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDIyLFxuICAgICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNSlcIixcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgUXVlbCBndWlkZSB2ZXV4LXR1IHBvdXIgY2V0dGUgZm9pcyA/XG4gICAgICAgIDwvcD5cblxuICAgICAgICB7Z3JvdXBzLm1hcCgoZywgZ2kpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17Zy5sYWJlbH0gc3R5bGU9e3sgbWFyZ2luVG9wOiBnaSA9PT0gMCA/IDAgOiBcInZhcigtLXMtNSlcIiB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTEsIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgb3BhY2l0eTogMC43OCxcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgICAgICAgcGFkZGluZ0xlZnQ6IDQsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2cubGFiZWx9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogMTIgfX0+XG4gICAgICAgICAgICAgIHtnLml0ZW1zLm1hcChwID0+IChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGtleT17cC5pZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKFwicHJvdG9jb2xlLXN1Yi1mbG93XCIsIHsgcHJvdG9jb2xJZDogcC5pZCB9KX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIC4uLnBDYXJkQmFzZSxcbiAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIiwgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA1NSUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjE0cHggMTZweFwiLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzOCUsIHZhcigtLWFzaC1kZWVwKSlcIn1cbiAgICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLWFzaC1kZWVwKSlcIn0+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImJhc2VsaW5lXCIsIGdhcDogOCxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA0LFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAxOCwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBvcGFjaXR5OiAwLjkgfX0+e3AuZ2x5cGh9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE3LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgICAgICAgIH19PntwVHh0KHAsIFwidGl0bGVcIil9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG1hcmdpbkJvdHRvbTogNCxcbiAgICAgICAgICAgICAgICAgIH19PntwVHh0KHAsIFwic3VidGl0bGVcIil9PC9kaXY+XG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDRlbVwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNTUsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogNixcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICBzb3VyY2UgXHUwMEI3IHtwLnNvdXJjZX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBQcm90b2NvbGVTdWJGbG93IFx1MjAxNCBzdGF0ZSBtYWNoaW5lIGdcdTAwRTluXHUwMEU5cmlxdWUgXHUwMEU5dGFwZSBwYXIgXHUwMEU5dGFwZVxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IFByb3RvY29sZVN1YkZsb3cgPSAoeyBnbywgcHJvdG9jb2xJZCwga2Fpcm9zSWQsIGVudHJ5SWQgfSkgPT4ge1xuICBjb25zdCBwcm90b2NvbCA9ICh3aW5kb3cuUFJPVE9DT0xFU19DQVRBTE9HIHx8IHt9KVtwcm90b2NvbElkXSB8fCBudWxsO1xuXG4gIC8vIEhvb2tzIFx1MjAxNCBhcHBlbFx1MDBFOXMgaW5jb25kaXRpb25uZWxsZW1lbnQgKGF2YW50IHRvdXQgcmV0dXJuIGNvbmRpdGlvbm5lbClcbiAgY29uc3QgW3N0ZXBJZHgsIHNldFN0ZXBJZHhdID0gcFMoMCk7XG4gIGNvbnN0IFthbnN3ZXJzLCBzZXRBbnN3ZXJzXSA9IHBTKHt9KTsgIC8vIHsgc3RlcElkOiB7IHR5cGUsIGFuc3dlciwgc2tpcHBlZCB9IH1cbiAgY29uc3QgW3N1Ym1pdHRpbmcsIHNldFN1Ym1pdHRpbmddID0gcFMoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHBTKG51bGwpO1xuICBjb25zdCBbc2F2ZWRSZWNvcmRJZCwgc2V0U2F2ZWRSZWNvcmRJZF0gPSBwUyhrYWlyb3NJZCB8fCBlbnRyeUlkIHx8IG51bGwpO1xuICBjb25zdCBbY29tcGxldGVkLCBzZXRDb21wbGV0ZWRdID0gcFMoZmFsc2UpO1xuXG4gIGNvbnN0IHRvdGFsU3RlcHMgPSBwcm90b2NvbCA/IHByb3RvY29sLnN0ZXBzLmxlbmd0aCA6IDA7XG4gIGNvbnN0IHN0ZXAgPSBwcm90b2NvbCA/IHByb3RvY29sLnN0ZXBzW3N0ZXBJZHhdIDogbnVsbDtcbiAgY29uc3QgaXNMYXN0ID0gc3RlcElkeCA9PT0gdG90YWxTdGVwcyAtIDE7XG5cbiAgLy8gQXV0by1hZHZhbmNlIHBvdXIgYnJlYXRoaW5nL2luZm9cbiAgcEUoKCkgPT4ge1xuICAgIGlmICghc3RlcCkgcmV0dXJuO1xuICAgIGlmICgoc3RlcC50eXBlID09PSBcImJyZWF0aGluZ1wiIHx8IHN0ZXAudHlwZSA9PT0gXCJpbmZvXCIpICYmIHN0ZXAuZHVyYXRpb24pIHtcbiAgICAgIGNvbnN0IHQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2V0QW5zd2VycyhwcmV2ID0+ICh7IC4uLnByZXYsIFtzdGVwLmlkXTogeyB0eXBlOiBzdGVwLnR5cGUsIGFuc3dlcjogXCJfYXV0b19cIiwgc2tpcHBlZDogZmFsc2UgfSB9KSk7XG4gICAgICAgIGlmIChpc0xhc3QpIGZpbmFsaXplKHsgdHlwZTogc3RlcC50eXBlLCBhbnN3ZXI6IFwiX2F1dG9fXCIsIHNraXBwZWQ6IGZhbHNlIH0pO1xuICAgICAgICBlbHNlIHNldFN0ZXBJZHgoc3RlcElkeCArIDEpO1xuICAgICAgfSwgc3RlcC5kdXJhdGlvbik7XG4gICAgICByZXR1cm4gKCkgPT4gY2xlYXJUaW1lb3V0KHQpO1xuICAgIH1cbiAgfSwgW3N0ZXBJZHgsIHN0ZXA/LmlkXSk7XG5cbiAgLy8gU2kgcGFzIGRlIHByb3RvY29sZSB2YWxpZGUgXHUyMTkyIGFmZmljaGVyIG1lc3NhZ2UgKyByZXRvdXJcbiAgaWYgKCFwcm90b2NvbCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLCBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLCBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiwgcGFkZGluZzogMjQgfX0+XG4gICAgICAgICAgPHA+cHJvdG9jb2xlIGludHJvdXZhYmxlPC9wPlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJob21lXCIpfVxuICAgICAgICAgICAgc3R5bGU9e3BCdG5HaG9zdH0+cmV0b3VyPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBQZXJzaXN0IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAvLyBDclx1MDBFOWUgb3UgbWV0IFx1MDBFMCBqb3VyIGxlIGthaXJvcyAvIGVudHJ5IGF2ZWMgcHJvdG9jb2xfc2Vzc2lvbl9kYXRhLlxuICBhc3luYyBmdW5jdGlvbiBwZXJzaXN0KGZpbmFsQW5zd2VycywgaXNDb21wbGV0aW5nID0gZmFsc2UpIHtcbiAgICBjb25zdCBzZXNzaW9uRGF0YSA9IHtcbiAgICAgIHByb3RvY29sX2lkOiBwcm90b2NvbC5pZCxcbiAgICAgIGxhbmd1YWdlOiBwTG9jYWxlKCksXG4gICAgICBzdGVwczogcHJvdG9jb2wuc3RlcHMubWFwKHMgPT4ge1xuICAgICAgICBjb25zdCBhID0gZmluYWxBbnN3ZXJzW3MuaWRdO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBzLmlkLFxuICAgICAgICAgIHR5cGU6IHMudHlwZSxcbiAgICAgICAgICBhbnN3ZXI6IGE/LmFuc3dlciA/PyBudWxsLFxuICAgICAgICAgIHNraXBwZWQ6ICEhYT8uc2tpcHBlZCxcbiAgICAgICAgfTtcbiAgICAgIH0pLFxuICAgICAgY29tcGxldGVkOiBpc0NvbXBsZXRpbmcsXG4gICAgfTtcblxuICAgIC8vIENvbXBvc2UgcmF3X3RleHQgXHUwMEUwIHBhcnRpciBkZXMgclx1MDBFOXBvbnNlcyB0ZXh0dWVsbGVzXG4gICAgY29uc3QgcmF3X3RleHRfcGFydHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IHMgb2YgcHJvdG9jb2wuc3RlcHMpIHtcbiAgICAgIGNvbnN0IGEgPSBmaW5hbEFuc3dlcnNbcy5pZF07XG4gICAgICBpZiAoIWEgfHwgYS5za2lwcGVkKSBjb250aW51ZTtcbiAgICAgIGlmICh0eXBlb2YgYS5hbnN3ZXIgPT09IFwic3RyaW5nXCIgJiYgYS5hbnN3ZXIudHJpbSgpLmxlbmd0aCA+IDAgJiYgYS5hbnN3ZXIgIT09IFwiX2F1dG9fXCIpIHtcbiAgICAgICAgcmF3X3RleHRfcGFydHMucHVzaChhLmFuc3dlci50cmltKCkpO1xuICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGEuYW5zd2VyKSAmJiBhLmFuc3dlci5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJhd190ZXh0X3BhcnRzLnB1c2goYS5hbnN3ZXIuam9pbihcIiwgXCIpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgY29tcG9zZWRfcmF3X3RleHQgPSByYXdfdGV4dF9wYXJ0cy5qb2luKFwiXFxuXFxuXCIpLnNsaWNlKDAsIDgwMDApIHx8IGBbJHtwcm90b2NvbC50aXRsZX1dIGRcdTAwRTlwXHUwMEY0dCBwcm90b2NvbGFpcmVgO1xuXG4gICAgY29uc3QgcHJvdG9jb2xQYXRjaCA9IHtcbiAgICAgIHByb3RvY29sX3VzZWQ6IHByb3RvY29sLmlkLFxuICAgICAgcHJvdG9jb2xfc2Vzc2lvbl9kYXRhOiBzZXNzaW9uRGF0YSxcbiAgICB9O1xuICAgIGlmIChpc0NvbXBsZXRpbmcpIHtcbiAgICAgIHByb3RvY29sUGF0Y2gucHJvdG9jb2xfY29tcGxldGVkX2F0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpO1xuICAgICAgaWYgKHByb3RvY29sLnRhcmdldCA9PT0gXCJrYWlyb3NcIiB8fCBwcm90b2NvbC50YXJnZXQgPT09IFwia2Fpcm9zX2V4aXN0aW5nXCIpIHtcbiAgICAgICAgcHJvdG9jb2xQYXRjaC5wcm90b2NvbF9zdGVwX2NvdW50ID0gcHJvdG9jb2wuc3RlcHMubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBDSUJMRSAxIDoga2Fpcm9zX2V4aXN0aW5nIChyXHUwMEU5ZW50clx1MDBFOWUpIFx1MjE5MiBQQVRDSCBrYWlyb3NJZCBleGlzdGFudFxuICAgICAgaWYgKHByb3RvY29sLnRhcmdldCA9PT0gXCJrYWlyb3NfZXhpc3RpbmdcIikge1xuICAgICAgICBpZiAoIXNhdmVkUmVjb3JkSWQpIHRocm93IG5ldyBFcnJvcihcIlJcdTAwRTllbnRyXHUwMEU5ZSBzYW5zIGthaXJvc0lkXCIpO1xuICAgICAgICBhd2FpdCBmZXRjaChcIi9hcGkva2Fpcm9zL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KHNhdmVkUmVjb3JkSWQpLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgLi4uYXdhaXQgYXV0aEhlYWRlcnMoKSB9LFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb3RvY29sUGF0Y2gpLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHNhdmVkUmVjb3JkSWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIENJQkxFIDIgOiBqb3VybmFsIChGaW4gZGUgSm91cm5cdTAwRTllKSBcdTIxOTIgUE9TVCAvYXBpL2pvdXJuYWwvZW50cmllc1xuICAgICAgaWYgKHByb3RvY29sLnRhcmdldCA9PT0gXCJqb3VybmFsXCIpIHtcbiAgICAgICAgaWYgKCFzYXZlZFJlY29yZElkKSB7XG4gICAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCIvYXBpL2pvdXJuYWwvZW50cmllc1wiLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiwgLi4uYXdhaXQgYXV0aEhlYWRlcnMoKSB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICByYXdfdGV4dDogY29tcG9zZWRfcmF3X3RleHQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb25zdCBkID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKGQ/LmVycm9yIHx8IFwiUE9TVCBqb3VybmFsIGZhaWxlZFwiKTtcbiAgICAgICAgICBjb25zdCBuZXdJZCA9IGQ/LmVudHJ5Py5pZDtcbiAgICAgICAgICBzZXRTYXZlZFJlY29yZElkKG5ld0lkKTtcbiAgICAgICAgICAvLyBQYXRjaCBwcm90b2NvbCBmaWVsZHMgc1x1MDBFOXBhclx1MDBFOW1lbnRcbiAgICAgICAgICBpZiAobmV3SWQpIHtcbiAgICAgICAgICAgIGF3YWl0IGZldGNoKFwiL2FwaS9qb3VybmFsL2VudHJpZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQobmV3SWQpLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJQQVRDSFwiLFxuICAgICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLCAuLi5hd2FpdCBhdXRoSGVhZGVycygpIH0sXG4gICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHByb3RvY29sUGF0Y2gpLFxuICAgICAgICAgICAgfSkuY2F0Y2goKCkgPT4ge30pOyAgLy8gYmVzdCBlZmZvcnQgXHUyMDE0IHBhdGNoIGpvdXJuYWwgZW50cnlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIG5ld0lkO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyBqb3VybmFsIGVudHJ5XG4gICAgICAgIGF3YWl0IGZldGNoKFwiL2FwaS9qb3VybmFsL2VudHJpZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc2F2ZWRSZWNvcmRJZCksIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUEFUQ0hcIixcbiAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLCAuLi5hd2FpdCBhdXRoSGVhZGVycygpIH0sXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyByYXdfdGV4dDogY29tcG9zZWRfcmF3X3RleHQsIC4uLnByb3RvY29sUGF0Y2ggfSksXG4gICAgICAgIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgcmV0dXJuIHNhdmVkUmVjb3JkSWQ7XG4gICAgICB9XG5cbiAgICAgIC8vIENJQkxFIDMgOiBrYWlyb3MgKGNyXHUwMEU5YXRpb24gKyBwYXRjaCBwcm90b2NvbGUpXG4gICAgICBpZiAoIXNhdmVkUmVjb3JkSWQpIHtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLmNyZWF0ZUthaXJvcyh7XG4gICAgICAgICAgcmF3X3RleHQ6IGNvbXBvc2VkX3Jhd190ZXh0LFxuICAgICAgICAgIGthaXJvc190eXBlOiBwcm90b2NvbC50YXJnZXRfdHlwZSB8fCBcInJldmVcIixcbiAgICAgICAgICBjYXB0dXJlX21ldGhvZDogXCJwcm90b2NvbFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgbmV3SWQgPSByZXM/LmthaXJvcz8uaWQ7XG4gICAgICAgIHNldFNhdmVkUmVjb3JkSWQobmV3SWQpO1xuICAgICAgICBpZiAobmV3SWQpIHtcbiAgICAgICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkudXBkYXRlS2Fpcm9zKG5ld0lkLCBwcm90b2NvbFBhdGNoKS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld0lkO1xuICAgICAgfVxuICAgICAgLy8gVXBkYXRlIGV4aXN0aW5nIGthaXJvc1xuICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLnVwZGF0ZUthaXJvcyhzYXZlZFJlY29yZElkLCB7XG4gICAgICAgIHJhd190ZXh0OiBjb21wb3NlZF9yYXdfdGV4dCxcbiAgICAgICAgLi4ucHJvdG9jb2xQYXRjaCxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHNhdmVkUmVjb3JkSWQ7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW1Byb3RvY29sZVN1YkZsb3cucGVyc2lzdF0gZmFpbGVkOlwiLCBlPy5tZXNzYWdlKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgLy8gQXV0aCBoZWFkZXJzIGhlbHBlciAobWlycm9yaW5nIGFwaS5qc3gganNvbkZldGNoIGJlaGF2aW9yKVxuICBhc3luYyBmdW5jdGlvbiBhdXRoSGVhZGVycygpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgdCA9IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGg/LmdldEFjY2Vzc1Rva2VuPy4oKTtcbiAgICAgIGlmICh0KSByZXR1cm4geyBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHQgfTtcbiAgICB9IGNhdGNoIHt9XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFNhdmUgY3VycmVudCBzdGVwIGFuc3dlciArIGFkdmFuY2UgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIGZ1bmN0aW9uIHJlY29yZEFuc3dlcihhbnN3ZXIsIHsgc2tpcHBlZCA9IGZhbHNlIH0gPSB7fSkge1xuICAgIGNvbnN0IG5leHQgPSB7IC4uLmFuc3dlcnMsIFtzdGVwLmlkXTogeyB0eXBlOiBzdGVwLnR5cGUsIGFuc3dlciwgc2tpcHBlZCB9IH07XG4gICAgc2V0QW5zd2VycyhuZXh0KTtcbiAgICBpZiAoaXNMYXN0KSB7XG4gICAgICBmaW5hbGl6ZShuZXh0W3N0ZXAuaWRdLCBuZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U3RlcElkeChzdGVwSWR4ICsgMSk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHNraXBTdGVwKCkge1xuICAgIHJlY29yZEFuc3dlcihudWxsLCB7IHNraXBwZWQ6IHRydWUgfSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBmaW5hbGl6ZShfZmluYWxTdGVwQW5zd2VyLCBmaW5hbEFuc3dlcnMgPSBhbnN3ZXJzKSB7XG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTsgc2V0RXJyb3IobnVsbCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGlkID0gYXdhaXQgcGVyc2lzdChmaW5hbEFuc3dlcnMsIHRydWUpO1xuICAgICAgc2V0U2F2ZWRSZWNvcmRJZChpZCk7XG4gICAgICBzZXRDb21wbGV0ZWQodHJ1ZSk7XG4gICAgICAvLyBSZWZyZXNoIGdsb2JhbCBlbnRyaWVzXG4gICAgICB0cnkgeyB3aW5kb3cuRHJlYW1SZWZyZXNoRW50cmllcyAmJiBzZXRUaW1lb3V0KCgpID0+IHdpbmRvdy5EcmVhbVJlZnJlc2hFbnRyaWVzKCksIDI1MCk7IH0gY2F0Y2gge31cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRFcnJvcihcIlNhdXZlZ2FyZGUgXHUwMEU5Y2hvdVx1MDBFOWUgXHUyMDE0IFwiICsgKGU/Lm1lc3NhZ2UgfHwgXCJcIikpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRTdWJtaXR0aW5nKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBwYXVzZUFuZFNhdmUoKSB7XG4gICAgc2V0U3VibWl0dGluZyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaWQgPSBhd2FpdCBwZXJzaXN0KGFuc3dlcnMsIGZhbHNlKTtcbiAgICAgIHNldFNhdmVkUmVjb3JkSWQoaWQpO1xuICAgICAgLy8gTmF2aWdhdGUgdmVycyBrYWlyb3MgZGV0YWlsIHNpIGFwcGxpY2FibGVcbiAgICAgIGlmIChwcm90b2NvbC50YXJnZXQgPT09IFwia2Fpcm9zXCIgfHwgcHJvdG9jb2wudGFyZ2V0ID09PSBcImthaXJvc19leGlzdGluZ1wiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZ28gPT09IFwiZnVuY3Rpb25cIikgc2V0VGltZW91dCgoKSA9PiBnbyhcImthaXJvc1wiLCBpZCksIDQwMCk7XG4gICAgICB9IGVsc2UgaWYgKHByb3RvY29sLnRhcmdldCA9PT0gXCJqb3VybmFsXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBnbyA9PT0gXCJmdW5jdGlvblwiKSBzZXRUaW1lb3V0KCgpID0+IGdvKFwiaG9tZS1qb3VyXCIpLCA0MDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiBnbyA9PT0gXCJmdW5jdGlvblwiKSBzZXRUaW1lb3V0KCgpID0+IGdvKFwiaG9tZVwiKSwgNDAwKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRFcnJvcihcIlNhdXZlZ2FyZGUgXHUwMEU5Y2hvdVx1MDBFOWUgXHUyMDE0IFwiICsgKGU/Lm1lc3NhZ2UgfHwgXCJcIikpO1xuICAgICAgc2V0U3VibWl0dGluZyhmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIENsb3Npbmcgc2NyZWVuIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBpZiAoY29tcGxldGVkKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e3BTdGFnZU5pZ2h0fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIG1heFdpZHRoOiA0ODAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIiwgcGFkZGluZ1RvcDogXCJ2YXIoLS1zLTcpXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRTaXplOiA0MCwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBvcGFjaXR5OiAwLjksIG1hcmdpbkJvdHRvbTogMTYsXG4gICAgICAgICAgfX0+e3Byb3RvY29sLmdseXBofTwvZGl2PlxuICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMjIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCBtYXJnaW5Cb3R0b206IDEyLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIGxlIHByb3RvY29sZSBlc3QgY29tcGxldFxuICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTYpXCIsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBjZSBxdWUgdHUgYXMgZFx1MDBFOXBvc1x1MDBFOSB0aWVudC4gdHUgcGV1eCB5IHJldmVuaXIgcXVhbmQgdHUgdmV1eC5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIiwgZ2FwOiAxMiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgICAgIHsocHJvdG9jb2wudGFyZ2V0ID09PSBcImthaXJvc1wiIHx8IHByb3RvY29sLnRhcmdldCA9PT0gXCJrYWlyb3NfZXhpc3RpbmdcIikgJiYgc2F2ZWRSZWNvcmRJZCAmJiAoXG4gICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJrYWlyb3NcIiwgc2F2ZWRSZWNvcmRJZCl9IHN0eWxlPXtwQnRuUHJpbWFyeX0+XG4gICAgICAgICAgICAgICAgb3V2cmlyIGwnZW50clx1MDBFOWVcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAge3Byb3RvY29sLnRhcmdldCA9PT0gXCJqb3VybmFsXCIgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IGdvICYmIGdvKFwiaG9tZS1qb3VyXCIpfSBzdHlsZT17cEJ0blByaW1hcnl9PlxuICAgICAgICAgICAgICAgIHZvaXIgSm91cm5hbCBkZSBWaWVcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImhvbWVcIil9IHN0eWxlPXtwQnRuR2hvc3R9PlxuICAgICAgICAgICAgICByZXRvdXIgXHUwMEUwIGwnYWNjdWVpbFxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIC8vIFx1MjUwMFx1MjUwMCBTdGVwIFVJIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3BTdGFnZU5pZ2h0fT5cbiAgICAgIHsvKiBIZWFkZXIgcHJvZ3Jlc3MgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsXG4gICAgICAgIHBhZGRpbmc6IFwiMCAxOHB4IHZhcigtLXMtMylcIixcbiAgICAgICAgbWF4V2lkdGg6IDYyMCwgd2lkdGg6IFwiMTAwJVwiLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtwYXVzZUFuZFNhdmV9IGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogc3VibWl0dGluZyA/IFwid2FpdFwiIDogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNyxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgcGFkZGluZzogXCI4cHggNHB4XCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgXHUyMTkwIGdhcmRlciBjZSBxdWUgaidhaVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC42LFxuICAgICAgICB9fT5cbiAgICAgICAgICB7c3RlcElkeCArIDF9IC8ge3RvdGFsU3RlcHN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBQcm9ncmVzcyBkb3RzICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsIGdhcDogNixcbiAgICAgICAgcGFkZGluZzogXCIwIDE4cHggdmFyKC0tcy00KVwiLFxuICAgICAgfX0+XG4gICAgICAgIHtwcm90b2NvbC5zdGVwcy5tYXAoKF8sIGkpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17aX0gc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiA1LCBoZWlnaHQ6IDUsIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGkgPD0gc3RlcElkeCA/IFwidmFyKC0tc2lsay1nb2xkKVwiIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgNDAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgIG9wYWNpdHk6IGkgPT09IHN0ZXBJZHggPyAxIDogaSA8IHN0ZXBJZHggPyAwLjYgOiAwLjM1LFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMzgwbXMgZWFzZVwiLFxuICAgICAgICAgIH19IC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBUaXRsZSArIHN1YnRpdGxlICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIHBhZGRpbmc6IFwiMCAxOHB4IHZhcigtLXMtNSlcIixcbiAgICAgICAgbWF4V2lkdGg6IDU0MCwgd2lkdGg6IFwiMTAwJVwiLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmb250U2l6ZTogMjIsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgb3BhY2l0eTogMC44NSwgbWFyZ2luQm90dG9tOiA0IH19PlxuICAgICAgICAgIHtwcm90b2NvbC5nbHlwaH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtwVHh0KHByb3RvY29sLCBcInRpdGxlXCIpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogU3RlcCBib2R5ICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBmbGV4OiAxLCBtYXhXaWR0aDogNjAwLCB3aWR0aDogXCIxMDAlXCIsIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgICAgcGFkZGluZzogXCIwIDIycHhcIixcbiAgICAgIH19PlxuICAgICAgICA8U3RlcFJlbmRlcmVyXG4gICAgICAgICAgc3RlcD17c3RlcH1cbiAgICAgICAgICB2YWx1ZT17YW5zd2Vyc1tzdGVwLmlkXT8uYW5zd2VyfVxuICAgICAgICAgIG9uU3VibWl0PXsoYW5zd2VyKSA9PiByZWNvcmRBbnN3ZXIoYW5zd2VyKX1cbiAgICAgICAgICBvblNraXA9e3N0ZXAuc2tpcHBhYmxlID8gc2tpcFN0ZXAgOiBudWxsfVxuICAgICAgICAgIHN1Ym1pdHRpbmc9e3N1Ym1pdHRpbmd9XG4gICAgICAgIC8+XG5cbiAgICAgICAge2Vycm9yICYmIChcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlLCAjQzk3QTRBKVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICBtYXJnaW5Ub3A6IDEyLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFNraXAgYnV0dG9uICh0b3Vqb3VycyB2aXNpYmxlKSAqL31cbiAgICAgICAge3N0ZXAuc2tpcHBhYmxlICE9PSBmYWxzZSAmJiBzdGVwLnR5cGUgIT09IFwiYnJlYXRoaW5nXCIgJiYgc3RlcC50eXBlICE9PSBcImluZm9cIiAmJiAoXG4gICAgICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIG1hcmdpblRvcDogMTggfX0+XG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3NraXBTdGVwfSBkaXNhYmxlZD17c3VibWl0dGluZ31cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBzdWJtaXR0aW5nID8gXCJ3YWl0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNTUsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogXCI4cHggMTJweFwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgcGFzc2VyIGNldHRlIHF1ZXN0aW9uXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBTdGVwUmVuZGVyZXIgXHUyMDE0IGRpc3BhdGNoIHBhciB0eXBlIGRlIHN0ZXBcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBTdGVwUmVuZGVyZXIgPSAoeyBzdGVwLCB2YWx1ZSwgb25TdWJtaXQsIG9uU2tpcCwgc3VibWl0dGluZyB9KSA9PiB7XG4gIGlmICghc3RlcCkgcmV0dXJuIG51bGw7XG4gIGNvbnN0IFEgPSAoXG4gICAgPHAgc3R5bGU9e3BRdWVzdGlvbn0+e3BUeHQoc3RlcCwgXCJxdWVzdGlvblwiKX08L3A+XG4gICk7XG4gIGNvbnN0IEhpbnQgPSBzdGVwLmhpbnQgPyAoXG4gICAgPGRpdiBzdHlsZT17cEhpbnR9PntzdGVwLmhpbnR9PC9kaXY+XG4gICkgOiBudWxsO1xuXG4gIHN3aXRjaCAoc3RlcC50eXBlKSB7XG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgVm9peCArIHRleHRhcmVhIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIGNhc2UgXCJ0ZXh0YXJlYVwiOlxuICAgIGNhc2UgXCJ0aXRsZV9zaG9ydFwiOlxuICAgICAgcmV0dXJuIDxUZXh0YXJlYVN0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH0gdmFsdWU9e3ZhbHVlIHx8IFwiXCJ9XG4gICAgICAgIG9uU3VibWl0PXtvblN1Ym1pdH0gc3VibWl0dGluZz17c3VibWl0dGluZ31cbiAgICAgICAgc21hbGw9e3N0ZXAudHlwZSA9PT0gXCJ0aXRsZV9zaG9ydFwifSAvPjtcblxuICAgIGNhc2UgXCJ0d29fdGV4dGFyZWFzXCI6XG4gICAgICByZXR1cm4gPFR3b1RleHRhcmVhc1N0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH1cbiAgICAgICAgdmFsdWU9e3ZhbHVlIHx8IFtcIlwiLCBcIlwiXX1cbiAgICAgICAgb25TdWJtaXQ9e29uU3VibWl0fSBzdWJtaXR0aW5nPXtzdWJtaXR0aW5nfSAvPjtcblxuICAgIGNhc2UgXCJjaGlwc1wiOlxuICAgICAgcmV0dXJuIDxDaGlwc1N0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH0gdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvblN1Ym1pdD17b25TdWJtaXR9IG11bHRpPXtmYWxzZX0gc3VibWl0dGluZz17c3VibWl0dGluZ30gLz47XG5cbiAgICBjYXNlIFwiY2hpcHNfbXVsdGlcIjpcbiAgICAgIHJldHVybiA8Q2hpcHNTdGVwIHN0ZXA9e3N0ZXB9IFE9e1F9IEhpbnQ9e0hpbnR9IHZhbHVlPXt2YWx1ZSB8fCBbXX1cbiAgICAgICAgb25TdWJtaXQ9e29uU3VibWl0fSBtdWx0aT17dHJ1ZX0gc3VibWl0dGluZz17c3VibWl0dGluZ30gLz47XG5cbiAgICBjYXNlIFwiYmluYXJ5XCI6XG4gICAgICByZXR1cm4gPENoaXBzU3RlcCBzdGVwPXtzdGVwfSBRPXtRfSBIaW50PXtIaW50fSB2YWx1ZT17dmFsdWV9XG4gICAgICAgIG9uU3VibWl0PXtvblN1Ym1pdH0gbXVsdGk9e2ZhbHNlfSBzdWJtaXR0aW5nPXtzdWJtaXR0aW5nfSBiaW5hcnkgLz47XG5cbiAgICBjYXNlIFwic2xpZGVyXCI6XG4gICAgICByZXR1cm4gPFNsaWRlclN0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH0gdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvblN1Ym1pdD17b25TdWJtaXR9IHN1Ym1pdHRpbmc9e3N1Ym1pdHRpbmd9IC8+O1xuXG4gICAgY2FzZSBcImJvZHlfem9uZVwiOlxuICAgICAgcmV0dXJuIDxCb2R5Wm9uZVN0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH0gdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvblN1Ym1pdD17b25TdWJtaXR9IHN1Ym1pdHRpbmc9e3N1Ym1pdHRpbmd9IC8+O1xuXG4gICAgY2FzZSBcImJvZHlfem9uZV9mdWxsXCI6XG4gICAgICByZXR1cm4gPEJvZHlab25lRnVsbFN0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH0gdmFsdWU9e3ZhbHVlfVxuICAgICAgICBvblN1Ym1pdD17b25TdWJtaXR9IHN1Ym1pdHRpbmc9e3N1Ym1pdHRpbmd9IC8+O1xuXG4gICAgY2FzZSBcImFoYV9jYXB0dXJlXCI6XG4gICAgICByZXR1cm4gPEFoYUNhcHR1cmVTdGVwIHN0ZXA9e3N0ZXB9IFE9e1F9IEhpbnQ9e0hpbnR9XG4gICAgICAgIG9uU3VibWl0PXtvblN1Ym1pdH0gc3VibWl0dGluZz17c3VibWl0dGluZ30gLz47XG5cbiAgICBjYXNlIFwiYnJlYXRoaW5nXCI6XG4gICAgICByZXR1cm4gPEJyZWF0aGluZ1N0ZXAgc3RlcD17c3RlcH0gUT17UX0gSGludD17SGludH0gLz47XG5cbiAgICBjYXNlIFwiaW5mb1wiOlxuICAgICAgcmV0dXJuIDxJbmZvU3RlcCBzdGVwPXtzdGVwfSBRPXtRfSBIaW50PXtIaW50fSAvPjtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBwYWRkaW5nOiAyNCB9fT5cbiAgICAgICAgICB7UX1cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMTIsIG9wYWNpdHk6IDAuNSwgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTEgfX0+XG4gICAgICAgICAgICB0eXBlIFwie3N0ZXAudHlwZX1cIiBub24gZ1x1MDBFOXJcdTAwRTkgXHUyMDE0IHBhc3NlclxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gIH1cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBTdWItY29tcG9uZW50cyBieSB0eXBlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCBUZXh0YXJlYVN0ZXAgPSAoeyBzdGVwLCBRLCBIaW50LCB2YWx1ZSwgb25TdWJtaXQsIHN1Ym1pdHRpbmcsIHNtYWxsIH0pID0+IHtcbiAgY29uc3QgW3RleHQsIHNldFRleHRdID0gcFModmFsdWUpO1xuICBjb25zdCBbcmVjb3JkaW5nLCBzZXRSZWNvcmRpbmddID0gcFMoZmFsc2UpO1xuICBjb25zdCBbdHJhbnNjcmliaW5nLCBzZXRUcmFuc2NyaWJpbmddID0gcFMoZmFsc2UpO1xuICBjb25zdCBtZWRpYVJlZiA9IHBSKG51bGwpO1xuICBjb25zdCBjaHVua3NSZWYgPSBwUihbXSk7XG5cbiAgY29uc3QgcGlja01pbWVUeXBlID0gKCkgPT4ge1xuICAgIGlmICh0eXBlb2YgTWVkaWFSZWNvcmRlciA9PT0gXCJ1bmRlZmluZWRcIikgcmV0dXJuIG51bGw7XG4gICAgY29uc3QgY2FuZGlkYXRlcyA9IFtcImF1ZGlvL3dlYm07Y29kZWNzPW9wdXNcIiwgXCJhdWRpby93ZWJtXCIsIFwiYXVkaW8vbXA0O2NvZGVjcz1tcDRhLjQwLjJcIiwgXCJhdWRpby9tcDRcIiwgXCJhdWRpby9hYWNcIl07XG4gICAgZm9yIChjb25zdCB0IG9mIGNhbmRpZGF0ZXMpIHtcbiAgICAgIHRyeSB7IGlmIChNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCAmJiBNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZCh0KSkgcmV0dXJuIHQ7IH0gY2F0Y2gge31cbiAgICB9XG4gICAgcmV0dXJuIFwiXCI7XG4gIH07XG4gIGNvbnN0IHN0YXJ0UmVjb3JkID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAodHlwZW9mIE1lZGlhUmVjb3JkZXIgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybjtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSk7XG4gICAgICBjb25zdCBtaW1lVHlwZSA9IHBpY2tNaW1lVHlwZSgpO1xuICAgICAgY29uc3QgbXIgPSBuZXcgTWVkaWFSZWNvcmRlcihzdHJlYW0sIG1pbWVUeXBlID8geyBtaW1lVHlwZSB9IDoge30pO1xuICAgICAgY29uc3QgYWN0dWFsTWltZSA9IG1yLm1pbWVUeXBlIHx8IG1pbWVUeXBlIHx8IFwiYXVkaW8vd2VibVwiO1xuICAgICAgY2h1bmtzUmVmLmN1cnJlbnQgPSBbXTtcbiAgICAgIG1yLm9uZGF0YWF2YWlsYWJsZSA9IGV2ID0+IHsgaWYgKGV2LmRhdGEuc2l6ZSA+IDApIGNodW5rc1JlZi5jdXJyZW50LnB1c2goZXYuZGF0YSk7IH07XG4gICAgICBtci5vbnN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHQgPT4gdC5zdG9wKCkpO1xuICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoY2h1bmtzUmVmLmN1cnJlbnQsIHsgdHlwZTogYWN0dWFsTWltZSB9KTtcbiAgICAgICAgc2V0VHJhbnNjcmliaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHIgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkudHJhbnNjcmliZShibG9iLCBhY3R1YWxNaW1lKTtcbiAgICAgICAgICBpZiAocj8udGV4dCkgc2V0VGV4dChwcmV2ID0+IChwcmV2ID8gcHJldiArIFwiIFwiIDogXCJcIikgKyByLnRleHQpO1xuICAgICAgICB9IGNhdGNoIHt9IGZpbmFsbHkgeyBzZXRUcmFuc2NyaWJpbmcoZmFsc2UpOyB9XG4gICAgICB9O1xuICAgICAgbWVkaWFSZWYuY3VycmVudCA9IG1yO1xuICAgICAgbXIuc3RhcnQoKTtcbiAgICAgIHNldFJlY29yZGluZyh0cnVlKTtcbiAgICB9IGNhdGNoIHt9XG4gIH07XG4gIGNvbnN0IHN0b3BSZWNvcmQgPSAoKSA9PiB7XG4gICAgaWYgKG1lZGlhUmVmLmN1cnJlbnQgJiYgbWVkaWFSZWYuY3VycmVudC5zdGF0ZSAhPT0gXCJpbmFjdGl2ZVwiKSBtZWRpYVJlZi5jdXJyZW50LnN0b3AoKTtcbiAgICBzZXRSZWNvcmRpbmcoZmFsc2UpO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIHtRfVxuICAgICAge0hpbnR9XG4gICAgICA8dGV4dGFyZWFcbiAgICAgICAgdmFsdWU9e3RleHR9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldFRleHQoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICBwbGFjZWhvbGRlcj17c3RlcC5wbGFjZWhvbGRlciB8fCBcIlx1MjAyNlwifVxuICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cbiAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgIHJvd3M9e3NtYWxsID8gMiA6IDV9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLCBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgNjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBwYWRkaW5nOiBcIjE2cHggMThweFwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTcsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgb3V0bGluZTogXCJub25lXCIsIHJlc2l6ZTogXCJ2ZXJ0aWNhbFwiLFxuICAgICAgICAgIG1hcmdpblRvcDogMTgsXG4gICAgICAgICAgdHJhbnNpdGlvbjogXCJib3JkZXItY29sb3IgMzgwbXMgZWFzZVwiLFxuICAgICAgICB9fVxuICAgICAgICBvbkZvY3VzPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5ib3JkZXJDb2xvciA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDM4JSwgdmFyKC0tYXNoLWRlZXApKVwifVxuICAgICAgICBvbkJsdXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCJ9XG4gICAgICAvPlxuICAgICAge3RyYW5zY3JpYmluZyAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMywgbWFyZ2luVG9wOiA4IH19PlxuICAgICAgICAgIHRyYW5zY3JpcHRpb24gZW4gY291cnNcdTIwMjZcbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBtYXJnaW5Ub3A6IDE4LCBkaXNwbGF5OiBcImZsZXhcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsIGdhcDogMTgsXG4gICAgICB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtyZWNvcmRpbmcgPyBzdG9wUmVjb3JkIDogc3RhcnRSZWNvcmR9XG4gICAgICAgICAgYXJpYS1sYWJlbD17cmVjb3JkaW5nID8gXCJhcnJcdTAwRUF0ZXJcIiA6IFwidm9peFwifVxuICAgICAgICAgIHN0eWxlPXtwVm9pY2VCdG4ocmVjb3JkaW5nKX0+XG4gICAgICAgICAge3JlY29yZGluZyA/IFwiXHUyNUEwXCIgOiBcIlx1RDgzQ1x1REY5OVwifVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU3VibWl0KHRleHQudHJpbSgpKX1cbiAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZyB8fCB0ZXh0LnRyaW0oKS5sZW5ndGggPCAxfVxuICAgICAgICAgIHN0eWxlPXtwU3VibWl0QnRuKHN1Ym1pdHRpbmcgfHwgdGV4dC50cmltKCkubGVuZ3RoIDwgMSl9PlxuICAgICAgICAgIHtzdWJtaXR0aW5nID8gXCJcdTIwMjZcIiA6IFwiXHUyMzA0XCJ9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXtwU3VibWl0TGFiZWx9PmNvbnRpbnVlcjwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgVHdvVGV4dGFyZWFzU3RlcCA9ICh7IHN0ZXAsIFEsIEhpbnQsIHZhbHVlLCBvblN1Ym1pdCwgc3VibWl0dGluZyB9KSA9PiB7XG4gIGNvbnN0IFthLCBzZXRBXSA9IHBTKHZhbHVlWzBdIHx8IFwiXCIpO1xuICBjb25zdCBbYiwgc2V0Ql0gPSBwUyh2YWx1ZVsxXSB8fCBcIlwiKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAge1F9XG4gICAgICB7SGludH1cbiAgICAgIDx0ZXh0YXJlYVxuICAgICAgICB2YWx1ZT17YX0gb25DaGFuZ2U9e2UgPT4gc2V0QShlLnRhcmdldC52YWx1ZSl9IGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICBwbGFjZWhvbGRlcj1cIlx1MjAyNlwiIHJvd3M9ezN9IGF1dG9Gb2N1c1xuICAgICAgICBzdHlsZT17cFR3b1RhU3R5bGUoKX1cbiAgICAgIC8+XG4gICAgICA8cCBzdHlsZT17eyAuLi5wUXVlc3Rpb24sIGZvbnRTaXplOiAxNywgbWFyZ2luVG9wOiAxOCB9fT5cbiAgICAgICAge3BUeHQoc3RlcCwgXCJzdWJRdWVzdGlvblwiKX1cbiAgICAgIDwvcD5cbiAgICAgIDx0ZXh0YXJlYVxuICAgICAgICB2YWx1ZT17Yn0gb25DaGFuZ2U9e2UgPT4gc2V0QihlLnRhcmdldC52YWx1ZSl9IGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICBwbGFjZWhvbGRlcj1cIlx1MjAyNlwiIHJvd3M9ezN9XG4gICAgICAgIHN0eWxlPXtwVHdvVGFTdHlsZSgpfVxuICAgICAgLz5cbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAxOCwgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiIH19PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG9uU3VibWl0KFthLnRyaW0oKSwgYi50cmltKCldKX1cbiAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZyB8fCAoYS50cmltKCkubGVuZ3RoIDwgMSAmJiBiLnRyaW0oKS5sZW5ndGggPCAxKX1cbiAgICAgICAgICBzdHlsZT17cFN1Ym1pdEJ0bihzdWJtaXR0aW5nIHx8IChhLnRyaW0oKS5sZW5ndGggPCAxICYmIGIudHJpbSgpLmxlbmd0aCA8IDEpKX0+XG4gICAgICAgICAge3N1Ym1pdHRpbmcgPyBcIlx1MjAyNlwiIDogXCJcdTIzMDRcIn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3BTdWJtaXRMYWJlbH0+Y29udGludWVyPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBDaGlwc1N0ZXAgPSAoeyBzdGVwLCBRLCBIaW50LCB2YWx1ZSwgb25TdWJtaXQsIG11bHRpLCBzdWJtaXR0aW5nLCBiaW5hcnkgfSkgPT4ge1xuICBjb25zdCBbc2VsLCBzZXRTZWxdID0gcFMobXVsdGkgPyAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFtdKSA6IHZhbHVlKTtcbiAgY29uc3QgdG9nZ2xlID0gKGspID0+IHtcbiAgICBpZiAobXVsdGkpIHtcbiAgICAgIHNldFNlbChwcmV2ID0+IHByZXYuaW5jbHVkZXMoaykgPyBwcmV2LmZpbHRlcih4ID0+IHggIT09IGspIDogWy4uLnByZXYsIGtdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U2VsKGspO1xuICAgICAgLy8gc2luZ2xlIFx1MjE5MiBhdXRvLXN1Ym1pdCBhcHJcdTAwRThzIHBldGl0IGRcdTAwRTlsYWlcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gb25TdWJtaXQoayksIDI4MCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICB7UX1cbiAgICAgIHtIaW50fVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleFdyYXA6IFwid3JhcFwiLCBnYXA6IDEwLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgbWFyZ2luVG9wOiAyMixcbiAgICAgIH19PlxuICAgICAgICB7KHN0ZXAuY2hpcHMgfHwgW10pLm1hcCgoW2ssIGxdKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlID0gbXVsdGkgPyBzZWwuaW5jbHVkZXMoaykgOiBzZWwgPT09IGs7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfSBvbkNsaWNrPXsoKSA9PiB0b2dnbGUoayl9IGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxNnB4XCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAxMDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBcIiArIChhY3RpdmVcbiAgICAgICAgICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNjAlLCB2YXIoLS1ib25lKSlcIlxuICAgICAgICAgICAgICAgICAgOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNiUsIHZhcigtLWFzaC1kZWVwKSlcIiksXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlXG4gICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgICAgICAgICAgIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBhY3RpdmUgPyBcInZhcigtLWJvbmUpXCIgOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHN1Ym1pdHRpbmcgPyBcIndhaXRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIHttdWx0aSAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAyMiwgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiIH19PlxuICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gb25TdWJtaXQoc2VsKX0gZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XG4gICAgICAgICAgICBzdHlsZT17cFN1Ym1pdEJ0bihzdWJtaXR0aW5nKX0+XG4gICAgICAgICAgICB7c3VibWl0dGluZyA/IFwiXHUyMDI2XCIgOiBcIlx1MjMwNFwifVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7bXVsdGkgJiYgPGRpdiBzdHlsZT17cFN1Ym1pdExhYmVsfT5jb250aW51ZXI8L2Rpdj59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBTbGlkZXJTdGVwID0gKHsgc3RlcCwgUSwgSGludCwgdmFsdWUsIG9uU3VibWl0LCBzdWJtaXR0aW5nIH0pID0+IHtcbiAgY29uc3QgbWluID0gc3RlcC5taW4gfHwgMTtcbiAgY29uc3QgbWF4ID0gc3RlcC5tYXggfHwgNTtcbiAgY29uc3QgW3YsIHNldFZdID0gcFModmFsdWUgfHwgTWF0aC5yb3VuZCgobWluICsgbWF4KSAvIDIpKTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiB9fT5cbiAgICAgIHtRfVxuICAgICAge0hpbnR9XG4gICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogMjggfX0+XG4gICAgICAgIDxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49e21pbn0gbWF4PXttYXh9IHN0ZXA9XCIxXCJcbiAgICAgICAgICB2YWx1ZT17dn0gb25DaGFuZ2U9e2UgPT4gc2V0VihwYXJzZUludChlLnRhcmdldC52YWx1ZSwgMTApKX1cbiAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIG1heFdpZHRoOiAzMjAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIG1hcmdpblRvcDogMTIsIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDI0LFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAge3Z9IC8ge21heH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAyMiwgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiIH19PlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IG9uU3VibWl0KHYpfSBkaXNhYmxlZD17c3VibWl0dGluZ31cbiAgICAgICAgICBzdHlsZT17cFN1Ym1pdEJ0bihzdWJtaXR0aW5nKX0+XG4gICAgICAgICAge3N1Ym1pdHRpbmcgPyBcIlx1MjAyNlwiIDogXCJcdTIzMDRcIn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3BTdWJtaXRMYWJlbH0+Y29udGludWVyPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBCb2R5Wm9uZVN0ZXAgPSAoeyBzdGVwLCBRLCBIaW50LCB2YWx1ZSwgb25TdWJtaXQsIHN1Ym1pdHRpbmcgfSkgPT4ge1xuICBjb25zdCBaT05FU19ERUZBVUxUID0gW1wiY29ycHNfZW50aWVyXCJdO1xuICBjb25zdCBaT05FU19GVUxMID0gW1xuICAgIFtcInRldGVcIiwgXCJ0XHUwMEVBdGVcIl0sXG4gICAgW1wiZ29yZ2VcIiwgXCJnb3JnZVwiXSxcbiAgICBbXCJjb2V1clwiLCBcImNcdTAxNTN1clwiXSxcbiAgICBbXCJ2ZW50cmVcIiwgXCJ2ZW50cmVcIl0sXG4gICAgW1wiYmFzc2luXCIsIFwiYmFzc2luXCJdLFxuICAgIFtcImphbWJlc1wiLCBcImphbWJlc1wiXSxcbiAgXTtcbiAgLy8gUmVhZCB1c2VyIHByZWYgZm9yIGV4dGVuZGVkIG1vZGVcbiAgY29uc3QgZXh0ID0gKCgpID0+IHsgdHJ5IHsgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJlYW06ZmVsdC1zaGlmdC1tb2RlXCIpID09PSBcIjYtem9uZXNcIjsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfSB9KSgpO1xuICBjb25zdCBbc2VsLCBzZXRTZWxdID0gcFModmFsdWUgfHwgbnVsbCk7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIHtRfVxuICAgICAge0hpbnR9XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4V3JhcDogXCJ3cmFwXCIsIGdhcDogMTAsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLFxuICAgICAgICBtYXJnaW5Ub3A6IDIyLFxuICAgICAgfX0+XG4gICAgICAgIHsoZXh0ID8gWk9ORVNfRlVMTCA6IFtbXCJjb3Jwc19lbnRpZXJcIiwgXCJkYW5zIHRvdXQgbGUgY29ycHNcIl1dKS5tYXAoKFtrLCBsXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFjdGl2ZSA9IHNlbCA9PT0gaztcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2t9IG9uQ2xpY2s9eygpID0+IHsgc2V0U2VsKGspOyBzZXRUaW1lb3V0KCgpID0+IG9uU3VibWl0KGspLCAyODApOyB9fVxuICAgICAgICAgICAgICBkaXNhYmxlZD17c3VibWl0dGluZ31cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggMTZweFwiLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMTAwLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgXCIgKyAoYWN0aXZlXG4gICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYwJSwgdmFyKC0tYm9uZSkpXCJcbiAgICAgICAgICAgICAgICAgIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTYlLCB2YXIoLS1hc2gtZGVlcCkpXCIpLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHRyYW5zcGFyZW50KVwiXG4gICAgICAgICAgICAgICAgICA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlID8gXCJ2YXIoLS1ib25lKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBzdWJtaXR0aW5nID8gXCJ3YWl0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gb25TdWJtaXQoXCJyaWVuXCIpfSBkaXNhYmxlZD17c3VibWl0dGluZ31cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogXCIxMHB4IDE2cHhcIiwgYm9yZGVyUmFkaXVzOiAxMDAsXG4gICAgICAgICAgICBib3JkZXI6IFwibm9uZVwiLCBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgY3Vyc29yOiBzdWJtaXR0aW5nID8gXCJ3YWl0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICByaWVuIG5lIGJvdWdlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBCb2R5IHpvbmUgZnVsbCBcdTIwMTQgc2lsaG91ZXR0ZSBtaW5pIGNsaXF1YWJsZSAocG91ciBGb2N1c2luZylcbmNvbnN0IEJvZHlab25lRnVsbFN0ZXAgPSAoeyBzdGVwLCBRLCBIaW50LCB2YWx1ZSwgb25TdWJtaXQsIHN1Ym1pdHRpbmcgfSkgPT4ge1xuICBjb25zdCBbc2VsLCBzZXRTZWxdID0gcFModmFsdWUgfHwgbnVsbCk7XG4gIC8vIE1pbmkgc2lsaG91ZXR0ZSA6IDggem9uZXMgY2xpcXVhYmxlc1xuICBjb25zdCBaT05FUyA9IFtcbiAgICB7IGlkOiBcImhlYWRcIiwgICAgICAgIGxhYmVsOiBcInRcdTAwRUF0ZVwiLCAgICAgICAgICBjeDogMTAwLCBjeTogMzgsICByOiAyMiB9LFxuICAgIHsgaWQ6IFwidGhyb2F0XCIsICAgICAgbGFiZWw6IFwiZ29yZ2VcIiwgICAgICAgICBjeDogMTAwLCBjeTogNzYsICByOiAxMSB9LFxuICAgIHsgaWQ6IFwic2hvdWxkZXJzXCIsICAgbGFiZWw6IFwiXHUwMEU5cGF1bGVzXCIsICAgICAgIGN4OiAxMDAsIGN5OiA5MiwgIHI6IDE4IH0sXG4gICAgeyBpZDogXCJoZWFydFwiLCAgICAgICBsYWJlbDogXCJjXHUwMTUzdXJcIiwgICAgICAgICAgY3g6IDEwMCwgY3k6IDExOCwgcjogMTYgfSxcbiAgICB7IGlkOiBcImJlbGx5XCIsICAgICAgIGxhYmVsOiBcInZlbnRyZVwiLCAgICAgICAgY3g6IDEwMCwgY3k6IDE2OCwgcjogMjIgfSxcbiAgICB7IGlkOiBcImxvd2VyX2JlbGx5XCIsIGxhYmVsOiBcImJhcy12ZW50cmVcIiwgICAgY3g6IDEwMCwgY3k6IDE5OCwgcjogMTcgfSxcbiAgICB7IGlkOiBcInBlbHZpc1wiLCAgICAgIGxhYmVsOiBcImJhc3NpblwiLCAgICAgICAgY3g6IDEwMCwgY3k6IDIyMCwgcjogMTUgfSxcbiAgICB7IGlkOiBcImZlZXRcIiwgICAgICAgIGxhYmVsOiBcInBpZWRzXCIsICAgICAgICAgY3g6IDEwMCwgY3k6IDMxMiwgcjogMTMgfSxcbiAgXTtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiB9fT5cbiAgICAgIHtRfVxuICAgICAge0hpbnR9XG4gICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjAwIDM0MFwiIHdpZHRoPVwiMjAwXCIgaGVpZ2h0PVwiYXV0b1wiXG4gICAgICAgIHN0eWxlPXt7IG1heEhlaWdodDogMzgwLCBkaXNwbGF5OiBcImJsb2NrXCIsIG1hcmdpbjogXCIxNnB4IGF1dG8gOHB4XCIgfX0+XG4gICAgICAgIDxnIHN0eWxlPXt7XG4gICAgICAgICAgZmlsbDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1taWQpIDQwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgc3Ryb2tlOiBcInZhcigtLWFzaC1taWQpXCIsIHN0cm9rZVdpZHRoOiAwLjYsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxlbGxpcHNlIGN4PVwiMTAwXCIgY3k9XCIzOFwiIHJ4PVwiMjJcIiByeT1cIjI2XCIgLz5cbiAgICAgICAgICA8cmVjdCB4PVwiOTNcIiB5PVwiNjJcIiB3aWR0aD1cIjE0XCIgaGVpZ2h0PVwiMTRcIiAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNIDcwIDc2IFEgMTAwIDcyIDEzMCA3NiBMIDEzOCAxNjggUSAxMDAgMTc4IDYyIDE2OCBaXCIgLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTSA2NCAxNzAgTCAxMzYgMTcwIEwgMTMyIDIyMiBRIDEwMCAyMzAgNjggMjIyIFpcIiAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNIDcwIDIyNiBMIDc4IDMxMiBMIDkyIDMxMiBMIDk2IDIyNiBaXCIgLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTSAxMDQgMjI2IEwgMTA4IDMxMiBMIDEyMiAzMTIgTCAxMzAgMjI2IFpcIiAvPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNIDY0IDg0IEwgNDQgMTc4IEwgNTYgMTgwIEwgNzIgOTIgWlwiIC8+XG4gICAgICAgICAgPHBhdGggZD1cIk0gMTM2IDg0IEwgMTU2IDE3OCBMIDE0NCAxODAgTCAxMjggOTIgWlwiIC8+XG4gICAgICAgIDwvZz5cbiAgICAgICAge1pPTkVTLm1hcCh6ID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSBzZWwgPT09IHouaWQ7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxjaXJjbGUga2V5PXt6LmlkfSBjeD17ei5jeH0gY3k9e3ouY3l9IHI9e3oucn1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmaWxsOiBhY3RpdmVcbiAgICAgICAgICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjglLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgICAgICAgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgc3Ryb2tlOiBhY3RpdmVcbiAgICAgICAgICAgICAgICAgID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCJcbiAgICAgICAgICAgICAgICAgIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgMzAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogYWN0aXZlID8gMS41IDogMC41LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogc3VibWl0dGluZyA/IFwid2FpdFwiIDogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7IHNldFNlbCh6LmlkKTsgc2V0VGltZW91dCgoKSA9PiBvblN1Ym1pdCh6LmlkKSwgMzIwKTsgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L3N2Zz5cbiAgICAgIHtzZWwgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBtYXJnaW5Ub3A6IDQsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtaT05FUy5maW5kKHogPT4gei5pZCA9PT0gc2VsKT8ubGFiZWx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IEFoYUNhcHR1cmVTdGVwID0gKHsgc3RlcCwgUSwgSGludCwgb25TdWJtaXQsIHN1Ym1pdHRpbmcgfSkgPT4ge1xuICBjb25zdCBbY2hvc2VuLCBzZXRDaG9zZW5dID0gcFMobnVsbCk7XG4gIGNvbnN0IFtub3RlLCBzZXROb3RlXSA9IHBTKFwiXCIpO1xuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICB7UX1cbiAgICAgIHtIaW50fVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleFdyYXA6IFwid3JhcFwiLCBnYXA6IDEwLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIixcbiAgICAgICAgbWFyZ2luVG9wOiAyMixcbiAgICAgIH19PlxuICAgICAgICB7W1xuICAgICAgICAgIFtcImZvcnRcIiwgICAgXCJcdTAwRTdhIHJcdTAwRTlzb25uZSBmb3J0XCJdLFxuICAgICAgICAgIFtcInBhcnRpZWxcIiwgXCJwYXJ0aWVsXCJdLFxuICAgICAgICAgIFtcIm5vblwiLCAgICAgXCJwYXMgZHUgdG91dFwiXSxcbiAgICAgICAgICBbXCJub3RlXCIsICAgIFwiYXV0cmUgXHUyMDE0IG5vdGUgbGlicmVcIl0sXG4gICAgICAgIF0ubWFwKChbaywgbF0pID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSBjaG9zZW4gPT09IGs7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfSBvbkNsaWNrPXsoKSA9PiBzZXRDaG9zZW4oayl9IGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTBweCAxNnB4XCIsIGJvcmRlclJhZGl1czogMTAwLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgXCIgKyAoYWN0aXZlXG4gICAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYwJSwgdmFyKC0tYm9uZSkpXCJcbiAgICAgICAgICAgICAgICAgIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTYlLCB2YXIoLS1hc2gtZGVlcCkpXCIpLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVxuICAgICAgICAgICAgICAgICAgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHRyYW5zcGFyZW50KVwiXG4gICAgICAgICAgICAgICAgICA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlID8gXCJ2YXIoLS1ib25lKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBzdWJtaXR0aW5nID8gXCJ3YWl0XCIgOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIHtjaG9zZW4gPT09IFwibm90ZVwiICYmIChcbiAgICAgICAgPHRleHRhcmVhIHZhbHVlPXtub3RlfSBvbkNoYW5nZT17ZSA9PiBzZXROb3RlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBwbGFjZWhvbGRlcj1cImNlIHF1aSBzJ2VzdCBwb3NcdTAwRTksIG91IGNlIHF1aSBuJ2EgcGFzIHJlZ2FyZFx1MDBFOVx1MjAyNlwiXG4gICAgICAgICAgZGlzYWJsZWQ9e3N1Ym1pdHRpbmd9XG4gICAgICAgICAgcm93cz17M31cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLi4ucFR3b1RhU3R5bGUoKSxcbiAgICAgICAgICAgIG1hcmdpblRvcDogMTYsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICl9XG4gICAgICB7Y2hvc2VuICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDIyLCBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIgfX0+XG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBvblN1Ym1pdCh7IGFoYTogY2hvc2VuLCBub3RlOiBub3RlLnRyaW0oKSB9KX1cbiAgICAgICAgICAgIGRpc2FibGVkPXtzdWJtaXR0aW5nfVxuICAgICAgICAgICAgc3R5bGU9e3BTdWJtaXRCdG4oc3VibWl0dGluZyl9PlxuICAgICAgICAgICAge3N1Ym1pdHRpbmcgPyBcIlx1MjAyNlwiIDogXCJcdTIzMDRcIn1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgPGRpdiBzdHlsZT17eyAuLi5wU3VibWl0TGFiZWwsIG1hcmdpblRvcDogNiB9fT5kXHUwMEU5cG9zZXIgdG9uIGFoYSBcdTAwQjcgYWNoZXZlcjwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgQnJlYXRoaW5nU3RlcCA9ICh7IHN0ZXAsIFEsIEhpbnQgfSkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiBcImNlbnRlclwiLCBwYWRkaW5nOiBcInZhcigtLXMtNSkgMFwiIH19PlxuICAgICAge1F9XG4gICAgICB7SGludH1cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgbWFyZ2luOiBcIjMycHggYXV0byAwXCIsXG4gICAgICAgIHdpZHRoOiAxMDAsIGhlaWdodDogMTAwLCBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gICAgICAgIGJhY2tncm91bmQ6IFwicmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzMCUgMzAlLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjQlLCB0cmFuc3BhcmVudCksIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZW1iZXIpIDE2JSwgdHJhbnNwYXJlbnQpKVwiLFxuICAgICAgICBhbmltYXRpb246IFwicC1icmVhdGggMTRzIGVhc2UtaW4tb3V0IGluZmluaXRlXCIsXG4gICAgICB9fSAvPlxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIEBrZXlmcmFtZXMgcC1icmVhdGgge1xuICAgICAgICAgIDAlICAgeyB0cmFuc2Zvcm06IHNjYWxlKDAuNyk7IG9wYWNpdHk6IDAuNjsgfVxuICAgICAgICAgIDI4JSAgeyB0cmFuc2Zvcm06IHNjYWxlKDEuMTUpOyBvcGFjaXR5OiAxOyB9XG4gICAgICAgICAgNTAlICB7IHRyYW5zZm9ybTogc2NhbGUoMS4xNSk7IG9wYWNpdHk6IDE7IH1cbiAgICAgICAgICA5MiUgIHsgdHJhbnNmb3JtOiBzY2FsZSgwLjcpOyBvcGFjaXR5OiAwLjY7IH1cbiAgICAgICAgICAxMDAlIHsgdHJhbnNmb3JtOiBzY2FsZSgwLjcpOyBvcGFjaXR5OiAwLjY7IH1cbiAgICAgICAgfVxuICAgICAgYH08L3N0eWxlPlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgSW5mb1N0ZXAgPSAoeyBRLCBIaW50IH0pID0+IHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogXCJjZW50ZXJcIiwgcGFkZGluZzogXCJ2YXIoLS1zLTcpIDBcIiB9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMjIsXG4gICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICB9fT5cbiAgICAgICAge1EucHJvcHMuY2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICAgIHtIaW50fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIFN0eWxlcyBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgcFN0YWdlTmlnaHQgPSB7XG4gIG1pbkhlaWdodDogXCIxMDB2aFwiLFxuICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsXG4gIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gIHBhZGRpbmdUb3A6IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMHB4KSArIDE0cHgpXCIsXG4gIHBhZGRpbmdCb3R0b206IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSwgMHB4KSArIDExMHB4KVwiLFxuICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICBkaXNwbGF5OiBcImZsZXhcIiwgZmxleERpcmVjdGlvbjogXCJjb2x1bW5cIixcbn07XG5jb25zdCBwQ2FyZEJhc2UgPSB7XG4gIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICBwYWRkaW5nOiBcInZhcigtLXMtNSkgdmFyKC0tcy00KVwiLFxuICB0cmFuc2l0aW9uOiBcImJvcmRlci1jb2xvciAzODBtcyBlYXNlLCBiYWNrZ3JvdW5kIDM4MG1zIGVhc2VcIixcbn07XG5jb25zdCBwQnRuUHJpbWFyeSA9IHtcbiAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB0cmFuc3BhcmVudClcIixcbiAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNTAlLCB2YXIoLS1ib25lKSlcIixcbiAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTUsXG4gIHBhZGRpbmc6IFwiMTFweCAyMnB4XCIsIGN1cnNvcjogXCJwb2ludGVyXCIsIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGVhc2VcIixcbn07XG5jb25zdCBwQnRuR2hvc3QgPSB7XG4gIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjYsXG4gIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICBwYWRkaW5nOiBcIjhweCAwXCIsXG59O1xuY29uc3QgcFF1ZXN0aW9uID0ge1xuICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gIGZvbnRTaXplOiAxOSwgbGluZUhlaWdodDogMS40NSxcbiAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICBtYXJnaW5Ub3A6IDEyLCBtYXJnaW5Cb3R0b206IDQsXG4gIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICB3aGl0ZVNwYWNlOiBcInByZS1saW5lXCIsXG59O1xuY29uc3QgcEhpbnQgPSB7XG4gIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNyxcbiAgdGV4dEFsaWduOiBcImNlbnRlclwiLCBtYXJnaW5Cb3R0b206IDQsXG4gIHRleHRXcmFwOiBcInByZXR0eVwiLFxufTtcbmNvbnN0IHBUd29UYVN0eWxlID0gKCkgPT4gKHtcbiAgd2lkdGg6IFwiMTAwJVwiLCBib3hTaXppbmc6IFwiYm9yZGVyLWJveFwiLFxuICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtZmxvb3IpIDYwJSwgdHJhbnNwYXJlbnQpXCIsXG4gIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICBwYWRkaW5nOiBcIjE0cHggMTZweFwiLFxuICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS41NSxcbiAgb3V0bGluZTogXCJub25lXCIsIHJlc2l6ZTogXCJ2ZXJ0aWNhbFwiLCBtYXJnaW5Ub3A6IDEyLFxufSk7XG5jb25zdCBwVm9pY2VCdG4gPSAocmVjb3JkaW5nKSA9PiAoe1xuICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI1JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICBib3JkZXJSYWRpdXM6IFwiNTAlXCIsXG4gIHdpZHRoOiA0NCwgaGVpZ2h0OiA0NCxcbiAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgY29sb3I6IHJlY29yZGluZyA/IFwidmFyKC0tZW1iZXItbGl2ZSwgI0M5N0E0QSlcIiA6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICBmb250U2l6ZTogMTYsIG9wYWNpdHk6IDAuODUsXG4gIGRpc3BsYXk6IFwiZ3JpZFwiLCBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxufSk7XG5jb25zdCBwU3VibWl0QnRuID0gKGRpc2FibGVkKSA9PiAoe1xuICB3aWR0aDogNjAsIGhlaWdodDogNjAsIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgYmFja2dyb3VuZDogXCJyYWRpYWwtZ3JhZGllbnQoY2lyY2xlIGF0IDMwJSAzMCUsIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZW1iZXIpIDMyJSwgdmFyKC0tbmlnaHQtd2FybSkpLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB2YXIoLS1uaWdodC1mbG9vcikpKVwiLFxuICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzNSUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgY3Vyc29yOiBkaXNhYmxlZCA/IFwibm90LWFsbG93ZWRcIiA6IFwicG9pbnRlclwiLFxuICBvcGFjaXR5OiBkaXNhYmxlZCA/IDAuNDUgOiAxLFxuICBkaXNwbGF5OiBcImdyaWRcIiwgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcbiAgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgZm9udFNpemU6IDIyLFxuICBib3hTaGFkb3c6IFwiMCAwIDI0cHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdHJhbnNwYXJlbnQpXCIsXG4gIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxufSk7XG5jb25zdCBwU3VibWl0TGFiZWwgPSB7XG4gIG1hcmdpblRvcDogOCwgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMixcbiAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjYsIGxldHRlclNwYWNpbmc6IFwiMC4wNGVtXCIsXG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgRXhwb3J0cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gIENhcHR1cmVDaG9pY2VTY3JlZW4sXG4gIFByb3RvY29sZVNlbGVjdG9yLFxuICBQcm90b2NvbGVTdWJGbG93LFxuICBQcm90b2NvbGVEaXNjb3ZlcnlSZXZlYWwsXG4gIHNob3VsZFJldmVhbFByb3RvY29sZXMsXG4gIG1hcmtQcm90b2NvbGVzUmV2ZWFsZWQsXG4gIG1hcmtQcm90b2NvbGVzRGlzbWlzc2VkLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFvQkEsTUFBTSxFQUFFLFVBQVUsSUFBSSxXQUFXLElBQUksUUFBUSxJQUFJLFNBQVMsR0FBRyxJQUFJO0FBR2pFLFNBQVMsVUFBVTtBQUNqQixNQUFJO0FBQUUsV0FBTyxhQUFhLFFBQVEsY0FBYyxNQUFNLE9BQU8sT0FBTztBQUFBLEVBQU0sU0FDcEU7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
