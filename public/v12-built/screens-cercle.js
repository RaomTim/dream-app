const { useState: uCS, useEffect: uCE, useMemo: uCM, useRef: uCR } = React;
const KIND_LABEL = {
  spontane: "spontan\xE9",
  intentionnel: "intentionnel",
  facilite: "facilit\xE9"
};
function relativeWhen(iso) {
  var _a, _b;
  if (!iso) return "r\xE9cemment";
  try {
    return ((_b = (_a = window.DreamAPI) == null ? void 0 : _a._relativeWhen) == null ? void 0 : _b.call(_a, iso)) || "r\xE9cemment";
  } catch (e) {
    return "r\xE9cemment";
  }
}
function genericPseudo(idx) {
  const glyphs = ["\u03B1", "\u03B2", "\u03B3", "\u03B4", "\u03B5", "\u03B6", "\u03B7", "\u03B8", "\u03B9", "\u03BA", "\u03BB"];
  return glyphs[idx % glyphs.length];
}
const CercleScreen = ({ go }) => {
  const [circles, setCircles] = uCS([]);
  const [loading, setLoading] = uCS(true);
  uCE(() => {
    let cancelled = false;
    setLoading(true);
    window.DreamAPI.listCircles().then((d) => {
      if (cancelled) return;
      setCircles((d == null ? void 0 : d.circles) || []);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  if (!loading && circles.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "frame center",
        style: { minHeight: "calc(100vh - 60px)" }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "stack text-center gap-m",
          style: { alignItems: "center", maxWidth: 480 }
        },
        /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-m" }, "aucun cercle ne te tient encore"),
        /* @__PURE__ */ React.createElement(
          "p",
          {
            className: "seuil-italic mb-l",
            style: { color: "var(--ash-light)" }
          },
          "un cercle se tient \xE0 plusieurs. ouvre-en un, ou rejoins celui qu'un\xB7e autre porte d\xE9j\xE0."
        ),
        /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { flexWrap: "wrap", justifyContent: "center", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => go("creer-cercle"),
            style: {
              background: "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))",
              color: "var(--bone)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 45%, var(--ash-deep))",
              padding: "14px 28px",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              letterSpacing: "0.02em",
              cursor: "pointer",
              borderRadius: 0,
              transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
              boxShadow: "0 0 24px color-mix(in oklch, var(--silk-gold) 12%, transparent)"
            },
            onMouseEnter: (e) => {
              e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, var(--night-warm))";
              e.currentTarget.style.boxShadow = "0 0 32px color-mix(in oklch, var(--silk-gold) 18%, transparent)";
            },
            onMouseLeave: (e) => {
              e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))";
              e.currentTarget.style.boxShadow = "0 0 24px color-mix(in oklch, var(--silk-gold) 12%, transparent)";
            }
          },
          "+ cr\xE9er un cercle"
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => go("rejoindre"),
            style: {
              background: "transparent",
              color: "var(--ash-light)",
              border: "none",
              padding: "14px 16px",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 14,
              letterSpacing: "0.02em",
              cursor: "pointer",
              borderBottom: "1px dashed color-mix(in oklch, var(--ash-light) 50%, transparent)",
              transition: "color 280ms ease"
            },
            onMouseEnter: (e) => e.currentTarget.style.color = "var(--bone)",
            onMouseLeave: (e) => e.currentTarget.style.color = "var(--ash-light)"
          },
          "rejoindre via un code"
        )),
        /* @__PURE__ */ React.createElement("p", { className: "meta op-50 mt-xl", style: {
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--ash-light)",
          maxWidth: 360
        } }, "un cercle s'ouvre en moins d'une minute \xB7 code partageable instantan\xE9")
      )
    ), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
  }
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { minHeight: "calc(100vh - 60px)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath" })));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta mb-s",
      style: { fontFamily: "var(--serif)", fontStyle: "italic" }
    },
    "tes cercles"
  ), /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "ce que tu tiens ensemble"), /* @__PURE__ */ React.createElement("div", { className: "stack gap-m mb-xl" }, circles.map((c) => /* @__PURE__ */ React.createElement(CercleCard, { key: c.id, circle: c, go }))), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => go("creer-cercle") }, "+ cr\xE9er un cercle"), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => go("rejoindre") }, "rejoindre via un code")), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70 mt-xl",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 480 }
    },
    "un cercle n'est pas un groupe de discussion. on y d\xE9pose ce qu'on porte, on tient ce que d'autres d\xE9posent."
  )), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const CercleCard = ({ circle, go }) => {
  const kind = circle.type || (circle.frequency === "open" ? "spontane" : "intentionnel");
  const kindLabel = KIND_LABEL[kind] || kind;
  const memberCount = circle.member_count || 1;
  const lastRestit = circle.last_restitution;
  const isActive = circle.my_role === "guardian";
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go("cercle-detail", circle.id),
      className: "card",
      style: {
        textAlign: "left",
        padding: "var(--s-4)",
        background: "color-mix(in oklch, var(--stone-cool) 6%, var(--night-floor))",
        border: isActive ? "1px solid color-mix(in oklch, var(--silk-gold) 20%, var(--ash-deep))" : "1px solid var(--ash-deep)",
        borderRadius: 0,
        cursor: "pointer",
        width: "100%",
        position: "relative"
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "row mb-s",
        style: { justifyContent: "space-between", alignItems: "baseline" }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontFamily: "var(--serif)",
            fontSize: 20,
            color: "var(--bone)"
          }
        },
        circle.name
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "meta-mono",
          style: {
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "var(--ash-light)",
            textTransform: "uppercase"
          }
        },
        kindLabel
      )
    ),
    kind === "intentionnel" && circle.intention_text && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "seuil-italic mb-s",
        style: {
          color: "var(--ash-light)",
          fontSize: 14,
          lineHeight: 1.5,
          textWrap: "pretty"
        }
      },
      "\xAB ",
      circle.intention_text,
      " \xBB"
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta mb-s",
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 12.5,
          color: "var(--ash-light)"
        }
      },
      memberCount,
      " ",
      memberCount > 1 ? "personnes" : "personne",
      " qui ",
      memberCount > 1 ? "tiennent" : "tient",
      " ce cercle"
    ),
    lastRestit ? /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "mt-s",
        style: {
          paddingTop: "var(--s-3)",
          borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)"
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "meta op-70 mb-s",
          style: {
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "var(--silk-gold)",
            textTransform: "uppercase"
          }
        },
        "derni\xE8re lecture \xB7 ",
        relativeWhen(lastRestit.requested_at)
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--bone)",
            opacity: 0.85,
            lineHeight: 1.55,
            textWrap: "pretty"
          }
        },
        (lastRestit.preview || "").slice(0, 180),
        (lastRestit.preview || "").length > 180 ? "\u2026" : ""
      )
    ) : /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta op-70 mt-s",
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 12.5
        }
      },
      "ce cercle n'a pas encore re\xE7u de lecture"
    )
  );
};
const CercleDetail = ({ go, circleId }) => {
  var _a, _b;
  const [circle, setCircle] = uCS(null);
  const [restitutions, setRestitutions] = uCS([]);
  const [loading, setLoading] = uCS(true);
  const [requesting, setRequesting] = uCS(false);
  const [confirmLeave, setConfirmLeave] = uCS(false);
  const [kairos, setKairos] = uCS([]);
  const [kairosLoading, setKairosLoading] = uCS(true);
  uCE(() => {
    let cancelled = false;
    if (!circleId) {
      setLoading(false);
      return;
    }
    Promise.all([
      window.DreamAPI.listCircles(),
      window.DreamAPI.listRestitutions(circleId),
      window.DreamAPI.listKairos({ limit: 30 })
    ]).then(([circlesData, restitData, kairosData]) => {
      var _a2, _b2;
      if (cancelled) return;
      const found = ((circlesData == null ? void 0 : circlesData.circles) || []).find((c) => c.id === circleId);
      setCircle(found || null);
      setRestitutions((restitData == null ? void 0 : restitData.restitutions) || []);
      setKairos(((kairosData == null ? void 0 : kairosData.kairos) || []).slice(0, 12));
      setLoading(false);
      setKairosLoading(false);
      if (((restitData == null ? void 0 : restitData.restitutions) || []).length > 0) {
        try {
          (_b2 = (_a2 = window.wowRegistry) == null ? void 0 : _a2.fire) == null ? void 0 : _b2.call(_a2, "premiere-restitution-cercle");
        } catch (e) {
        }
      }
    }).catch(() => {
      if (!cancelled) {
        setLoading(false);
        setKairosLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [circleId]);
  const requestReading = async () => {
    if (!circleId || requesting) return;
    setRequesting(true);
    try {
      await window.DreamAPI.requestRestitution(circleId, 28);
      const r = await window.DreamAPI.listRestitutions(circleId);
      setRestitutions((r == null ? void 0 : r.restitutions) || []);
    } catch (e) {
      console.warn("[CercleDetail] requestReading failed:", e.message);
    } finally {
      setRequesting(false);
    }
  };
  const doLeave = async () => {
    if (!circleId) return;
    try {
      await window.DreamAPI.leaveCircle(circleId);
    } catch (e) {
      console.warn("[CercleDetail] leave failed:", e.message);
    }
    go("cercle");
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { minHeight: "calc(100vh - 60px)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath" })));
  }
  if (!circle) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame center", style: { paddingTop: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "ce cercle ne te tient plus, ou n'existe pas."), /* @__PURE__ */ React.createElement("button", { className: "btn-text mt-l", onClick: () => go("cercle") }, "\u2190 retour \xE0 tes cercles")));
  }
  const kind = circle.type || (circle.frequency === "open" ? "spontane" : "intentionnel");
  const kindLabel = KIND_LABEL[kind] || kind;
  const memberCount = circle.member_count || 1;
  const latest = restitutions[0] || null;
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta-mono mb-s",
      style: {
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: "var(--silk-gold)",
        textTransform: "uppercase"
      }
    },
    "cercle \xB7 ",
    kindLabel
  ), /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-m" }, circle.name), kind === "intentionnel" && circle.intention_text && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card mb-l",
      style: {
        padding: "var(--s-4)",
        background: "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))"
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta op-70 mb-s",
        style: { fontFamily: "var(--serif)", fontStyle: "italic" }
      },
      "intention tenue ensemble"
    ),
    /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "seuil-italic",
        style: { color: "var(--bone)", fontSize: 16, lineHeight: 1.55 }
      },
      "\xAB ",
      circle.intention_text,
      " \xBB"
    ),
    Array.isArray(circle.intention_history) && ((_b = (_a = circle.intention_history[0]) == null ? void 0 : _a.sub_intentions) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ React.createElement(
      "ul",
      {
        className: "mt-m",
        style: {
          listStyle: "none",
          padding: 0,
          margin: 0,
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          color: "var(--ash-light)",
          fontSize: 13.5
        }
      },
      circle.intention_history[0].sub_intentions.map((s, i) => /* @__PURE__ */ React.createElement("li", { key: i, style: { paddingLeft: 14, position: "relative", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", left: 0, color: "var(--silk-gold)" } }, "\xB7"), s))
    )
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta mb-l",
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        color: "var(--ash-light)"
      }
    },
    memberCount,
    " ",
    memberCount > 1 ? "personnes tiennent" : "personne tient",
    " ce cercle"
  ), /* @__PURE__ */ React.createElement("div", { className: "row mb-xl", style: { gap: 8, flexWrap: "wrap" } }, Array.from({ length: Math.min(memberCount, 9) }, (_, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: i,
      style: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        border: "1px solid var(--ash-deep)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        color: "var(--ash-light)",
        background: "color-mix(in oklch, var(--stone-cool) 4%, transparent)"
      }
    },
    genericPseudo(i)
  )), memberCount > 9 && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        color: "var(--ash-light)",
        fontSize: 13,
        alignSelf: "center"
      }
    },
    "+",
    memberCount - 9
  )), /* @__PURE__ */ React.createElement("div", { className: "divider-moon" }, "restitution polyphonique"), latest ? /* @__PURE__ */ React.createElement(
    RestitutionBlock,
    {
      circleId,
      restitution: latest
    }
  ) : /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card text-center",
      style: {
        padding: "var(--s-5) var(--s-4)",
        background: "color-mix(in oklch, var(--night-warm) 60%, var(--night-floor))",
        border: "1px solid var(--ash-deep)",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "seuil-italic mb-l",
        style: { color: "var(--ash-light)", maxWidth: 420, margin: "0 auto" }
      },
      "ce cercle n'a pas encore re\xE7u de lecture."
    ),
    /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-ghost",
        disabled: requesting,
        onClick: requestReading
      },
      requesting ? "lecture en chemin\u2026" : "demander une lecture"
    )
  ), latest && /* @__PURE__ */ React.createElement("div", { className: "row mt-l mb-xl", style: { justifyContent: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      disabled: requesting,
      onClick: requestReading,
      style: { fontSize: 13 }
    },
    requesting ? "lecture en chemin\u2026" : "demander une nouvelle lecture du cercle"
  )), /* @__PURE__ */ React.createElement("div", { className: "divider-moon mt-xl" }, "mes kairos & ce cercle"), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70 mb-l",
      style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 520 }
    },
    "chaque kairos peut rester priv\xE9, alimenter la lecture du cercle anonymement, ou \xEAtre d\xE9pos\xE9 en clair pour les autres."
  ), kairosLoading ? /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "chargement\u2026") : kairos.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "tu n'as pas encore d\xE9pos\xE9 de kairos. commence par en cueillir un.") : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s mb-xl" }, kairos.map((k) => /* @__PURE__ */ React.createElement(KairosOptinRow, { key: k.id, kairos: k, circleId }))), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "mt-xl",
      style: {
        paddingTop: "var(--s-4)",
        borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)"
      }
    },
    !confirmLeave ? /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-text",
        onClick: () => setConfirmLeave(true),
        style: {
          fontSize: 12.5,
          color: "var(--ash-light)",
          fontStyle: "italic"
        }
      },
      "quitter ce cercle"
    ) : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "seuil-italic",
        style: { color: "var(--ash-light)", maxWidth: 480 }
      },
      "tu cesseras de tenir ce cercle. les lectures d\xE9j\xE0 re\xE7ues restent."
    ), /* @__PURE__ */ React.createElement("div", { className: "row gap-m" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "btn-ghost",
        onClick: doLeave,
        style: { borderColor: "var(--ember-live)", color: "var(--ember-live)" }
      },
      "oui, quitter"
    ), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setConfirmLeave(false) }, "rester")))
  )), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const RestitutionBlock = ({ circleId, restitution }) => {
  var _a;
  const [counts, setCounts] = uCS({ resonates: 0, unfamiliar: 0, question: 0 });
  const [mine, setMine] = uCS({ resonates: false, unfamiliar: false, question: false });
  const [loading, setLoading] = uCS(true);
  uCE(() => {
    let cancelled = false;
    window.DreamAPI.listCircleReactions(circleId, restitution.id).then((r) => {
      if (cancelled) return;
      if (r == null ? void 0 : r.counts) setCounts(r.counts);
      if (r == null ? void 0 : r.mine) setMine(r.mine);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [circleId, restitution.id]);
  const toggle = async (type) => {
    var _a2;
    const wasOn = !!mine[type];
    setMine((m) => ({ ...m, [type]: !wasOn }));
    setCounts((c) => ({ ...c, [type]: Math.max(0, (c[type] || 0) + (wasOn ? -1 : 1)) }));
    const syncId = window.dreamSyncBegin ? window.dreamSyncBegin("circleReaction") : null;
    try {
      if (wasOn) {
        await window.DreamAPI.removeCircleReaction(circleId, restitution.id, type);
      } else {
        await window.DreamAPI.submitCircleReaction(circleId, restitution.id, type);
      }
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId);
    } catch (e) {
      setMine((m) => ({ ...m, [type]: wasOn }));
      setCounts((c) => ({ ...c, [type]: Math.max(0, (c[type] || 0) + (wasOn ? 1 : -1)) }));
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: e.message });
      try {
        (_a2 = window.dreamShowToast) == null ? void 0 : _a2.call(window, {
          text: "r\xE9action non enregistr\xE9e, reviens dans un instant",
          tone: "error",
          duration: 4e3
        });
      } catch (e2) {
      }
      console.warn("[RestitutionBlock] reaction toggle failed:", e.message);
    }
  };
  const text = restitution.narrative_text || "";
  const status = restitution.status;
  if (status === "pending") {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "card text-center",
        style: {
          padding: "var(--s-5) var(--s-4)",
          background: "color-mix(in oklch, var(--night-warm) 60%, var(--night-floor))",
          border: "1px solid var(--ash-deep)",
          borderRadius: 0
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "breath mb-l", style: { width: 40, height: 40, margin: "0 auto" } }),
      /* @__PURE__ */ React.createElement(
        "p",
        {
          className: "seuil-italic",
          style: { color: "var(--ash-light)", maxWidth: 380, margin: "0 auto" }
        },
        "la lecture est en chemin. reviens dans un instant."
      )
    );
  }
  if (status === "failed") {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "card",
        style: {
          padding: "var(--s-4)",
          background: "color-mix(in oklch, var(--ember-soft) 8%, var(--night-floor))",
          border: "1px solid color-mix(in oklch, var(--ember-live) 30%, var(--ash-deep))",
          borderRadius: 0
        }
      },
      /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "la lecture n'a pas pu se faire cette fois. demande \xE0 nouveau plus tard.")
    );
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card mb-l",
      style: {
        padding: "var(--s-5) var(--s-4)",
        background: "var(--night-warm)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
        borderRadius: 0,
        position: "relative",
        overflow: "hidden"
      }
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "100%",
        height: "100%",
        style: {
          position: "absolute",
          inset: 0,
          opacity: 0.5,
          pointerEvents: "none"
        },
        "aria-hidden": "true"
      },
      /* @__PURE__ */ React.createElement("rect", { width: "100%", height: "100%", filter: "url(#noise-paper)" })
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta-mono mb-m",
        style: {
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--silk-gold)",
          textTransform: "uppercase",
          position: "relative"
        }
      },
      relativeWhen(restitution.requested_at),
      " \xB7 sur ",
      ((_a = restitution.metadata) == null ? void 0 : _a.period_days) || 28,
      " jours"
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 18,
          lineHeight: 1.7,
          color: "var(--bone)",
          textWrap: "pretty",
          position: "relative",
          whiteSpace: "pre-wrap"
        }
      },
      text
    ),
    restitution.intention_at_time && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "mt-l",
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 12.5,
          color: "var(--ash-light)",
          opacity: 0.75,
          position: "relative"
        }
      },
      "intention au moment de la lecture : \xAB ",
      restitution.intention_at_time,
      " \xBB"
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-l", style: { flexWrap: "wrap", justifyContent: "center" } }, [
    ["resonates", "r\xE9sonne"],
    ["unfamiliar", "unfamiliar"],
    ["question", "question"]
  ].map(([k, label]) => {
    const isOn = !!mine[k];
    const c = counts[k] || 0;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => toggle(k),
        disabled: loading,
        style: {
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px 4px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14.5,
          color: isOn ? "var(--silk-gold)" : "var(--ash-light)",
          letterSpacing: "0.02em",
          transition: "color 380ms cubic-bezier(0.45,0,0.55,1)",
          opacity: loading ? 0.5 : 1
        }
      },
      label,
      c > 0 && /* @__PURE__ */ React.createElement(
        "span",
        {
          style: {
            marginLeft: 6,
            fontFamily: "var(--mono)",
            fontSize: 11,
            opacity: 0.7
          }
        },
        "\xB7 ",
        c
      )
    );
  })), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta op-70 text-center mt-s",
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 11.5
      }
    },
    "pas un vote \u2014 une fa\xE7on de tenir"
  ));
};
const KairosOptinRow = ({ kairos, circleId }) => {
  const [mode, setMode] = uCS("private");
  const [busy, setBusy] = uCS(false);
  const [loaded, setLoaded] = uCS(false);
  uCE(() => {
    let cancelled = false;
    window.DreamAPI.getKairosCircleMode(kairos.id, circleId).then((r) => {
      if (cancelled) return;
      if (r == null ? void 0 : r.mode) setMode(r.mode);
      setLoaded(true);
    }).catch(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [kairos.id, circleId]);
  const change = async (newMode) => {
    if (busy || newMode === mode) return;
    const prev = mode;
    setBusy(true);
    setMode(newMode);
    try {
      await window.DreamAPI.optinKairosToCircle({
        kairosId: kairos.id,
        circleId,
        mode: newMode
      });
    } catch (e) {
      setMode(prev);
      console.warn("[KairosOptinRow] mode change failed:", e.message);
    } finally {
      setBusy(false);
    }
  };
  const text = kairos.text || kairos.raw_text || "";
  const preview = text.length > 120 ? text.slice(0, 120) + "\u2026" : text;
  const when = kairos.when || relativeWhen(kairos.created_at);
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card",
      style: {
        padding: "var(--s-3) var(--s-4)",
        background: mode === "shared_clear" ? "color-mix(in oklch, var(--silk-gold) 5%, var(--night-floor))" : mode === "optin_anon" ? "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))" : "transparent",
        border: mode === "shared_clear" ? "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))" : "1px solid var(--ash-deep)",
        borderRadius: 0,
        opacity: loaded ? 1 : 0.6,
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta-mono mb-s",
        style: {
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          color: "var(--ash-light)",
          textTransform: "uppercase"
        }
      },
      window.typeLabel ? window.typeLabel(kairos.type) : kairos.type,
      " \xB7 ",
      when
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "mb-s",
        style: {
          fontFamily: "var(--serif)",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--bone)",
          textWrap: "pretty"
        }
      },
      preview
    ),
    /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { flexWrap: "wrap" } }, [
      ["private", "priv\xE9"],
      ["optin_anon", "opt-in cercle"],
      ["shared_clear", "partag\xE9 en clair"]
    ].map(([k, label]) => {
      const isOn = mode === k;
      return /* @__PURE__ */ React.createElement(
        "button",
        {
          key: k,
          onClick: () => change(k),
          disabled: busy,
          style: {
            background: "transparent",
            border: "none",
            cursor: busy ? "wait" : "pointer",
            padding: "4px 0",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 12.5,
            color: isOn ? "var(--silk-gold)" : "var(--ash-light)",
            opacity: busy ? 0.6 : 1,
            borderBottom: isOn ? "1px solid var(--silk-gold)" : "1px solid transparent",
            marginRight: 14,
            transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
          }
        },
        label
      );
    }))
  );
};
const CercleTemplatePicker = ({ onPick, onCancel }) => {
  const [tpls, setTpls] = uCS([]);
  const [loading, setLoading] = uCS(true);
  const [err, setErr] = uCS(null);
  uCE(() => {
    let alive = true;
    window.DreamAPI.listCircleTemplates().then((res) => {
      if (!alive) return;
      if (Array.isArray(res == null ? void 0 : res.templates)) setTpls(res.templates);
      else setErr("templates indisponibles");
    }).catch((e) => alive && setErr(e.message)).finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "qu'est-ce que ce cercle va tenir\xA0?"), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "body op-70 mb-xl",
      style: { maxWidth: 540, fontFamily: "var(--serif)", fontStyle: "italic" }
    },
    "un point de d\xE9part doux, jamais un carcan \u2014 tout reste modifiable juste apr\xE8s."
  ), loading && /* @__PURE__ */ React.createElement("div", { className: "breath", style: { marginTop: 24 } }), err && /* @__PURE__ */ React.createElement("p", { className: "meta op-70", style: { color: "var(--ash-light)" } }, err), !loading && !err && /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 14,
        marginBottom: 28
      }
    },
    tpls.map((t) => /* @__PURE__ */ React.createElement(
      "button",
      {
        key: t.slug,
        onClick: () => onPick(t),
        style: {
          background: "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
          color: "var(--bone)",
          padding: "20px 18px",
          textAlign: "left",
          cursor: "pointer",
          borderRadius: 0,
          fontFamily: "var(--serif)",
          transition: "all 320ms cubic-bezier(0.45,0,0.55,1)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          minHeight: 138
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))";
          e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 55%, var(--ash-deep))";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))";
          e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))";
        }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontSize: 26,
            color: "var(--silk-gold)",
            letterSpacing: "0.05em"
          }
        },
        t.glyph || "\u25CB"
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontStyle: "italic",
            fontSize: 17,
            letterSpacing: "0.01em",
            lineHeight: 1.3
          }
        },
        t.name
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "op-70",
          style: {
            fontSize: 13,
            fontStyle: "italic",
            lineHeight: 1.4
          }
        },
        t.short_description
      ),
      t.trauma_aware && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--silk-gold)",
            marginTop: "auto"
          }
        },
        "\xB7 trauma-aware"
      ),
      t.ephemeral_default_days && /* @__PURE__ */ React.createElement(
        "div",
        {
          style: {
            fontFamily: "var(--mono)",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--silk-gold)",
            marginTop: "auto"
          }
        },
        "\xB7 ",
        t.ephemeral_default_days,
        " jours"
      )
    ))
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { flexWrap: "wrap", marginTop: 12 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      onClick: () => onPick(null),
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        color: "var(--ash-light)",
        background: "transparent",
        border: "none",
        borderBottom: "1px dashed color-mix(in oklch, var(--ash-light) 50%, transparent)",
        cursor: "pointer",
        padding: "10px 4px"
      }
    },
    "ou cr\xE9er un cercle libre \u2192"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      onClick: onCancel,
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        color: "var(--ash-light)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "10px 4px"
      }
    },
    "annuler"
  )));
};
const CreerCercleScreen = ({ go }) => {
  const [step, setStep] = uCS("pick");
  const [chosenTemplate, setChosenTemplate] = uCS(null);
  const [templateMeta, setTemplateMeta] = uCS(null);
  const [name, setName] = uCS("");
  const [kind, setKind] = uCS("spontane");
  const [intention, setIntention] = uCS("");
  const [subIntents, setSubIntents] = uCS(["", "", ""]);
  const [createdCircle, setCreatedCircle] = uCS(null);
  const [creating, setCreating] = uCS(false);
  const [createError, setCreateError] = uCS(null);
  const [copied, setCopied] = uCS(false);
  const [isEphemeral, setIsEphemeral] = uCS(false);
  const [ephemeralDays, setEphemeralDays] = uCS(21);
  const goNext = () => {
    if (step === "pick") setStep(0);
    else if (step === 0 && kind === "spontane") setStep(2);
    else setStep(step + 1);
  };
  const goBack = () => {
    if (step === 0) setStep("pick");
    else if (step === 2 && kind === "spontane") setStep(0);
    else if (typeof step === "number" && step > 0) setStep(step - 1);
  };
  const onPickTemplate = (tpl) => {
    if (!tpl) {
      setChosenTemplate(null);
      setTemplateMeta(null);
      setStep(0);
      return;
    }
    setChosenTemplate(tpl.slug);
    setTemplateMeta(tpl);
    setName(tpl.name || "");
    setKind(tpl.default_circle_type || "spontane");
    setIntention(tpl.default_intention || "");
    const subs = Array.isArray(tpl.default_sub_intentions) ? tpl.default_sub_intentions : [];
    setSubIntents([subs[0] || "", subs[1] || "", subs[2] || ""]);
    setStep(0);
  };
  uCE(() => {
    if (step !== 2 || createdCircle || creating) return;
    setCreating(true);
    setCreateError(null);
    const cleanedSubs = subIntents.map((s) => s.trim()).filter(Boolean).slice(0, 3);
    const promise = chosenTemplate ? window.DreamAPI.createCircleFromTemplate({
      slug: chosenTemplate,
      customName: name.trim(),
      customIntention: kind === "intentionnel" ? intention.trim() : null,
      customSubIntentions: kind === "intentionnel" ? cleanedSubs : []
    }) : window.DreamAPI.createCircle({
      name: name.trim(),
      type: kind,
      intention_text: kind === "intentionnel" ? intention.trim() : null,
      sub_intentions: kind === "intentionnel" ? cleanedSubs : [],
      maxMembers: 8,
      frequency: kind === "spontane" ? "freeform" : "weekly",
      ephemeral_days: isEphemeral ? ephemeralDays : null
    });
    promise.then((result) => {
      var _a;
      if ((_a = result == null ? void 0 : result.circle) == null ? void 0 : _a.invite_code) {
        setCreatedCircle(result.circle);
      } else if (result == null ? void 0 : result._seed) {
        setCreateError("cr\xE9ation locale (mode d\xE9mo, sans backend)");
        setCreatedCircle({
          id: "local-" + Date.now(),
          name: name.trim(),
          invite_code: "DEMO" + Math.random().toString(36).slice(2, 6).toUpperCase()
        });
      } else {
        setCreateError((result == null ? void 0 : result.error) || "la cr\xE9ation n'a pas abouti");
      }
    }).catch((e) => setCreateError(e.message)).finally(() => setCreating(false));
  }, [step]);
  const inviteUrl = (createdCircle == null ? void 0 : createdCircle.invite_code) ? `${location.origin}/v12/index.html#rejoindre?code=${createdCircle.invite_code}` : "";
  const doCopy = async () => {
    var _a;
    if (!inviteUrl) return;
    try {
      await ((_a = navigator.clipboard) == null ? void 0 : _a.writeText(inviteUrl));
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    } catch (e) {
    }
  };
  const doShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name + " \xB7 Dream",
          text: "rejoins le cercle \xAB " + name + " \xBB dans Dream",
          url: inviteUrl
        });
      } catch (e) {
      }
    } else {
      doCopy();
    }
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "stage screen-enter",
      style: {
        background: "var(--night-floor)",
        // Van Gennep transition between steps
        transition: "all var(--tempo-tisse, 380ms) cubic-bezier(0.45,0,0.55,1)"
      }
    },
    /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => step !== "pick" ? goBack() : go("cercle"), label: "" }),
    /* @__PURE__ */ React.createElement("div", { className: "frame", style: { maxWidth: step === "pick" ? 760 : 560 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta-mono mb-s",
        style: {
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--silk-gold)",
          textTransform: "uppercase"
        }
      },
      step === "pick" ? "cr\xE9er un cercle \xB7 choisir un point de d\xE9part" : "cr\xE9er un cercle \xB7 \xE9tape " + (step === 0 ? 1 : step === 1 ? 2 : 3) + "/" + (kind === "intentionnel" ? 3 : 2)
    ), step === "pick" && /* @__PURE__ */ React.createElement(CercleTemplatePicker, { onPick: onPickTemplate, onCancel: () => go("cercle") }), step === 0 && /* @__PURE__ */ React.createElement(
      CreerStepOne,
      {
        name,
        setName,
        kind,
        setKind,
        isEphemeral,
        setIsEphemeral,
        ephemeralDays,
        setEphemeralDays,
        onNext: goNext,
        onCancel: () => go("cercle"),
        templateMeta
      }
    ), step === 1 && /* @__PURE__ */ React.createElement(
      CreerStepIntention,
      {
        intention,
        setIntention,
        subIntents,
        setSubIntents,
        onNext: goNext,
        onBack: goBack
      }
    ), step === 2 && /* @__PURE__ */ React.createElement(
      CreerStepConfirm,
      {
        name,
        kind,
        intention,
        creating,
        createError,
        createdCircle,
        inviteUrl,
        copied,
        doCopy,
        doShare,
        onEnter: () => {
          if (createdCircle == null ? void 0 : createdCircle.id) go("cercle-detail", createdCircle.id);
          else go("cercle");
        }
      }
    ))
  );
};
const CreerStepOne = ({
  name,
  setName,
  kind,
  setKind,
  isEphemeral,
  setIsEphemeral,
  ephemeralDays,
  setEphemeralDays,
  onNext,
  onCancel,
  templateMeta
}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "comment voudrais-tu l'appeler ?"), templateMeta && /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "meta-mono mb-m",
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--silk-gold)",
      textTransform: "uppercase",
      opacity: 0.85
    }
  },
  "d\xE9part\xA0: ",
  templateMeta.glyph || "\u25CB",
  " ",
  templateMeta.name
), /* @__PURE__ */ React.createElement("p", { className: "body op-70 mb-m", style: { maxWidth: 480 } }, "un nom qui d\xE9crit ce que ce cercle tient."), /* @__PURE__ */ React.createElement(
  "input",
  {
    className: "field-input mb-xl",
    placeholder: "la for\xEAt tenue, les veilleuses de mars, l'\xE9quipe transition\u2026",
    value: name,
    onChange: (e) => setName(e.target.value),
    autoFocus: true
  }
), /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "meta-mono mb-m",
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--ash-light)",
      textTransform: "uppercase"
    }
  },
  "quel type de cercle"
), /* @__PURE__ */ React.createElement("div", { className: "stack gap-s mb-xl" }, [
  [
    "spontane",
    "spontan\xE9",
    "famille, amis, coll\xE8gues. on partage les r\xEAves pour l'intimit\xE9. z\xE9ro protocole."
  ],
  [
    "intentionnel",
    "intentionnel",
    "ONG, asso, entreprise, collectif. on tient ensemble une intention partag\xE9e."
  ]
].map(([k, lbl, desc]) => /* @__PURE__ */ React.createElement(
  "button",
  {
    key: k,
    onClick: () => setKind(k),
    style: {
      textAlign: "left",
      padding: "var(--s-3) var(--s-4)",
      border: "1px solid " + (kind === k ? "color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))" : "var(--ash-deep)"),
      background: kind === k ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent",
      cursor: "pointer",
      transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
    }
  },
  /* @__PURE__ */ React.createElement(
    "div",
    {
      style: {
        fontFamily: "var(--serif)",
        fontSize: 17,
        color: kind === k ? "var(--silk-gold)" : "var(--bone)",
        marginBottom: 4,
        fontStyle: "italic"
      }
    },
    lbl
  ),
  /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta",
      style: {
        color: "var(--ash-light)",
        fontSize: 13,
        lineHeight: 1.5
      }
    },
    desc
  )
))), /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "meta-mono mb-m",
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--ash-light)",
      textTransform: "uppercase"
    }
  },
  "ce cercle est-il \xE9ph\xE9m\xE8re ?"
), /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "card mb-xl",
    style: {
      padding: "var(--s-3) var(--s-4)",
      border: "1px solid " + (isEphemeral ? "color-mix(in oklch, var(--silk-gold) 24%, var(--ash-deep))" : "var(--ash-deep)"),
      background: isEphemeral ? "color-mix(in oklch, var(--silk-gold) 4%, transparent)" : "transparent",
      transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
    }
  },
  /* @__PURE__ */ React.createElement(
    "label",
    {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        cursor: "pointer"
      }
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: !!isEphemeral,
        onChange: (e) => setIsEphemeral(e.target.checked),
        style: {
          marginTop: 4,
          accentColor: "var(--silk-gold)"
        }
      }
    ),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 16,
          color: isEphemeral ? "var(--silk-gold)" : "var(--bone)",
          marginBottom: 4
        }
      },
      "ce cercle se referme tout seul"
    ), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta",
        style: {
          color: "var(--ash-light)",
          fontSize: 13,
          lineHeight: 1.5
        }
      },
      "une travers\xE9e commune avec une fin inscrite d\xE8s le d\xE9part. au jour J, une lecture finale est tiss\xE9e et le cercle s'archive."
    ))
  ),
  isEphemeral && /* @__PURE__ */ React.createElement("div", { className: "mt-m", style: { paddingLeft: 28 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta-mono mb-s",
      style: {
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: "var(--ash-light)",
        textTransform: "uppercase"
      }
    },
    "dur\xE9e \xA0\xB7\xA0 ",
    /* @__PURE__ */ React.createElement("span", { style: { color: "var(--silk-gold)" } }, ephemeralDays, " jours")
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { flexWrap: "wrap", marginBottom: 10 } }, [7, 14, 21, 30, 60].map((d) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: d,
      onClick: () => setEphemeralDays(d),
      style: {
        background: ephemeralDays === d ? "color-mix(in oklch, var(--silk-gold) 12%, transparent)" : "transparent",
        border: "1px solid " + (ephemeralDays === d ? "var(--silk-gold)" : "var(--ash-deep)"),
        color: ephemeralDays === d ? "var(--silk-gold)" : "var(--ash-light)",
        padding: "6px 14px",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 14,
        cursor: "pointer",
        transition: "all 280ms ease"
      }
    },
    d,
    "j"
  ))), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "range",
      min: 1,
      max: 90,
      value: ephemeralDays,
      onChange: (e) => setEphemeralDays(Number(e.target.value)),
      style: {
        width: "100%",
        accentColor: "var(--silk-gold)"
      }
    }
  ), ephemeralDays === 21 && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta op-70 mt-s",
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        color: "var(--ash-light)",
        lineHeight: 1.5
      }
    },
    "21 jours \xB7 trois semaines, un cycle de travers\xE9e (Est\xE9s, Vasalisa)."
  ))
), /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onCancel }, "annuler"), /* @__PURE__ */ React.createElement(
  "button",
  {
    className: "btn-ghost",
    disabled: !name.trim() || !kind,
    onClick: onNext
  },
  "continuer"
)));
const CreerStepIntention = ({
  intention,
  setIntention,
  subIntents,
  setSubIntents,
  onNext,
  onBack
}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "quelle intention tenez-vous ensemble ?"), /* @__PURE__ */ React.createElement("p", { className: "body op-70 mb-l", style: { maxWidth: 480 } }, "une phrase. pas un objectif \u2014 une orientation."), /* @__PURE__ */ React.createElement(
  "textarea",
  {
    className: "field-textarea mb-l",
    placeholder: "traverser nos transitions professionnelles, sans conseils. tenir ce projet politique du regard de nos r\xEAves. \xE9couter ce que la communaut\xE9 porte.",
    value: intention,
    onChange: (e) => setIntention(e.target.value),
    rows: 3,
    autoFocus: true
  }
), /* @__PURE__ */ React.createElement(
  "div",
  {
    className: "meta-mono mb-s",
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.14em",
      color: "var(--ash-light)",
      textTransform: "uppercase"
    }
  },
  "sous-intentions (jusqu'\xE0 3, optionnel)"
), /* @__PURE__ */ React.createElement("div", { className: "stack gap-s mb-xl" }, subIntents.map((s, i) => /* @__PURE__ */ React.createElement(
  "input",
  {
    key: i,
    className: "field-input",
    placeholder: `sous-intention ${i + 1}\u2026`,
    value: s,
    onChange: (e) => {
      const next = [...subIntents];
      next[i] = e.target.value;
      setSubIntents(next);
    }
  }
))), /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onBack }, "\u2190 retour"), /* @__PURE__ */ React.createElement(
  "button",
  {
    className: "btn-ghost",
    disabled: !intention.trim(),
    onClick: onNext
  },
  "continuer"
)));
const CreerStepConfirm = ({
  name,
  kind,
  intention,
  creating,
  createError,
  createdCircle,
  inviteUrl,
  copied,
  doCopy,
  doShare,
  onEnter
}) => {
  if (creating) {
    return /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { paddingTop: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath mb-xl" }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "le cercle se forme."));
  }
  if (!createdCircle) {
    return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-m" }, "la cr\xE9ation n'a pas pu se faire"), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ember-live)" } }, createError || "v\xE9rifie ta connexion et r\xE9essaie."));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-m" }, "le cercle est ouvert."), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "seuil-italic mb-l",
      style: { color: "var(--ash-light)", maxWidth: 480 }
    },
    "voici le lien d'invitation. partage-le aux personnes que tu veux voir tenir ce cercle avec toi."
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "card mb-l",
      style: {
        padding: "var(--s-4)",
        background: "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
        borderRadius: 0
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta-mono mb-s",
        style: {
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--silk-gold)",
          textTransform: "uppercase"
        }
      },
      "code \xB7 ",
      createdCircle.invite_code
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--mono)",
          fontSize: 12.5,
          color: "var(--bone)",
          wordBreak: "break-all",
          lineHeight: 1.5
        }
      },
      inviteUrl
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-m mb-xl", style: { flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: doCopy }, copied ? "copi\xE9 \xB7" : "copier le lien"), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: doShare }, "partager\u2026")), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70 mb-l",
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        maxWidth: 460
      }
    },
    "un cercle \xE0 une personne reste un cercle. invite \xE0 ton rythme."
  ), createError && /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta mb-m",
      style: {
        color: "var(--ember-live)",
        fontFamily: "var(--serif)",
        fontStyle: "italic"
      }
    },
    createError
  ), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: onEnter }, "entrer dans le cercle"));
};
const RejoindreScreen = ({ go }) => {
  const [code, setCode] = uCS(() => {
    try {
      const hash = location.hash || "";
      const m = hash.match(/[?&]code=([A-Za-z0-9]+)/);
      return m ? m[1].toUpperCase() : "";
    } catch (e) {
      return "";
    }
  });
  const [joining, setJoining] = uCS(false);
  const [error, setError] = uCS(null);
  const [success, setSuccess] = uCS(null);
  const doJoin = async () => {
    if (!code.trim()) {
      setError("entre un code \xE0 6 caract\xE8res");
      return;
    }
    setJoining(true);
    setError(null);
    try {
      const result = await window.DreamAPI.joinCircle({
        inviteCode: code.trim().toUpperCase()
      });
      if (result == null ? void 0 : result.error) {
        setError(prettifyError(result.error));
      } else if (result == null ? void 0 : result.circle) {
        setSuccess(result.circle);
        setTimeout(() => go("cercle-detail", result.circle.id), 1200);
      } else {
        setError("rejoindre n'a pas abouti. recommence dans un instant.");
      }
    } catch (e) {
      setError(prettifyError(e.message));
    } finally {
      setJoining(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame text-center", style: { paddingTop: "var(--s-7)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath mb-xl" }), /* @__PURE__ */ React.createElement(
      "p",
      {
        className: "seuil-italic",
        style: { color: "var(--bone)", fontSize: 18, maxWidth: 380, margin: "0 auto" }
      },
      "le cercle \xAB ",
      success.name,
      " \xBB te tient maintenant."
    )));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-floor)" } }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { maxWidth: 480 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta-mono mb-s",
      style: {
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: "var(--silk-gold)",
        textTransform: "uppercase"
      }
    },
    "rejoindre un cercle"
  ), /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "tu as re\xE7u un code ?"), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "body op-70 mb-l",
      style: { maxWidth: 460 }
    },
    "entre les six caract\xE8res que la personne qui tient ce cercle t'a transmis."
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input mb-l",
      placeholder: "ABC123",
      value: code,
      onChange: (e) => {
        setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8));
        setError(null);
      },
      autoFocus: true,
      style: {
        fontFamily: "var(--mono)",
        letterSpacing: "0.18em",
        fontSize: 18,
        textAlign: "center"
      }
    }
  ), error && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta mb-m",
      style: {
        color: "var(--ember-live)",
        fontFamily: "var(--serif)",
        fontStyle: "italic"
      }
    },
    error
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => go("cercle") }, "pas cette fois"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      disabled: joining || !code.trim(),
      onClick: doJoin
    },
    joining ? "rejoindre\u2026" : "rejoindre"
  )), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "meta op-70 mt-xl",
      style: {
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        maxWidth: 460
      }
    },
    "en rejoignant, tu choisiras \xE0 chaque kairos s'il reste priv\xE9, alimente la lecture du cercle, ou est partag\xE9 en clair."
  )));
};
function prettifyError(msg) {
  if (!msg) return "rejoindre n'a pas abouti.";
  const m = String(msg).toLowerCase();
  if (m.includes("non trouv\xE9") || m.includes("not found") || m.includes("404")) {
    return "ce code ne m\xE8ne \xE0 aucun cercle. v\xE9rifie qu'il est exact.";
  }
  if (m.includes("d\xE9j\xE0 membre") || m.includes("already")) {
    return "tu tiens d\xE9j\xE0 ce cercle.";
  }
  if (m.includes("complet") || m.includes("full")) {
    return "ce cercle est complet pour le moment.";
  }
  if (m.includes("auth") || m.includes("401")) {
    return "tu dois te connecter avant de rejoindre.";
  }
  return msg;
}
const PartagerReveScreen = ({ go }) => {
  const [step, setStep] = uCS(0);
  const [selectedId, setSelectedId] = uCS(null);
  const [framing, setFraming] = uCS("");
  const [anon, setAnon] = uCS(false);
  const entries = window.seedEntries || [];
  const selected = entries.find((e) => e.id === selectedId);
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(window.TopNav, { showBack: true, onBack: () => go("cercle"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { maxWidth: 620 } }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta mb-s",
      style: { fontFamily: "var(--serif)", fontStyle: "italic" }
    },
    "d\xE9poser un kairos \xB7 le cercle"
  ), step === 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "quel kairos veux-tu d\xE9poser ?"), /* @__PURE__ */ React.createElement("p", { className: "body op-70 mb-l" }, "d\xE9poser dans le cercle est toujours un geste explicite, jamais par d\xE9faut."), /* @__PURE__ */ React.createElement("div", { className: "stack gap-m mb-l" }, entries.slice(0, 5).map((e) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: e.id,
      onClick: () => setSelectedId(e.id),
      style: {
        textAlign: "left",
        padding: "var(--s-4)",
        border: "1px solid " + (selectedId === e.id ? "var(--bone)" : "var(--ash-deep)"),
        background: selectedId === e.id ? "color-mix(in oklch, var(--bone) 4%, transparent)" : "transparent"
      }
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "meta mb-s",
        style: { fontFamily: "var(--serif)", fontStyle: "italic" }
      },
      window.typeLabel ? window.typeLabel(e.type) : e.type,
      " \xB7 ",
      e.when
    ),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          fontFamily: "var(--serif)",
          fontSize: 16,
          color: "var(--bone)",
          textWrap: "pretty"
        }
      },
      e.text.length > 180 ? e.text.slice(0, 180) + "\u2026" : e.text
    )
  ))), /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => go("cercle") }, "annuler"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      disabled: !selectedId,
      onClick: () => setStep(1)
    },
    "continuer"
  ))), step === 1 && selected && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil mb-l" }, "un cadre pour que le cercle re\xE7oive ?"), /* @__PURE__ */ React.createElement("p", { className: "body op-70 mb-l" }, "optionnel. une phrase pour situer \u2014 pas pour expliquer."), /* @__PURE__ */ React.createElement("div", { className: "card mb-l" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta mb-s",
      style: { fontFamily: "var(--serif)", fontStyle: "italic" }
    },
    window.typeLabel ? window.typeLabel(selected.type) : selected.type,
    " \xB7",
    " ",
    selected.when
  ), /* @__PURE__ */ React.createElement("p", { className: "body", style: { textWrap: "pretty" } }, selected.text)), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-textarea mb-l",
      placeholder: "ce r\xEAve est venu apr\xE8s une journ\xE9e o\xF9\u2026 / je n'ai pas compris mais quelque chose a boug\xE9\u2026",
      value: framing,
      onChange: (e) => setFraming(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement(
    "label",
    {
      className: "row gap-s mb-l",
      style: { cursor: "pointer" }
    },
    /* @__PURE__ */ React.createElement(
      "span",
      {
        className: "toggle " + (anon ? "on" : ""),
        onClick: () => setAnon(!anon)
      }
    ),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14 } }, "d\xE9poser sans mon nom")
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta op-70 mb-l",
      style: { fontFamily: "var(--serif)", fontStyle: "italic" }
    },
    "d\xE9poser dans le cercle n'envoie rien \xE0 Anima Mundi. ce sont deux gestes s\xE9par\xE9s."
  ), /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setStep(0) }, "\u2190 retour"), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => setStep(2) }, "d\xE9poser dans le cercle"))), step === 2 && /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { paddingTop: "var(--s-6)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath mb-xl" }), /* @__PURE__ */ React.createElement(
    "p",
    {
      className: "seuil-italic mb-s",
      style: { maxWidth: 420, margin: "0 auto" }
    },
    "le kairos est d\xE9pos\xE9 dans le cercle."
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "meta op-70 mt-m",
      style: { fontFamily: "var(--serif)", fontStyle: "italic" }
    },
    "tu seras notifi\xE9e quand quelqu'un le tient. ou jamais."
  ), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost mt-xl", onClick: () => go("cercle") }, "retourner au cercle"))));
};
Object.assign(window, {
  CercleScreen,
  CercleDetail,
  CreerCercleScreen,
  CercleTemplatePicker,
  RejoindreScreen,
  PartagerReveScreen
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1jZXJjbGUuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiBnbG9iYWwgUmVhY3QgKi9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRHJlYW0gVjEuMiBcdTIwMTQgXHUwMEM5Y3JhbnMgQ0VSQ0xFIChyZWZvbnRlIDIwMjYtMDQtMjUgXHUyMDE0IFllc2h1YSlcbi8vXG4vLyBWaXNpb24gQmlibGUgXHUwMEE3My40LjEgKyBEZXNpZ24gXHUwMEE3Ny43IDpcbi8vICAgMyB0eXBlcyBkZSBjZXJjbGVzIFYxIDpcbi8vICAgICAtIFNQT05UQU5cdTAwQzkgICAgICA6IGludGltaXRcdTAwRTksIHpcdTAwRTlybyBwcm90b2NvbGUsIGxpZW4gcGFydGFnZWFibGUgaW5zdGFudGFuXHUwMEU5LlxuLy8gICAgIC0gSU5URU5USU9OTkVMICA6IGludGVudGlvbiBwYXJ0YWdcdTAwRTllICsganVzcXUnXHUwMEUwIDMgc291cy1pbnRlbnRpb25zLlxuLy8gICAgIC0gRkFDSUxJVFx1MDBDOSAgICAgIDogVjIgKG1hcmtldHBsYWNlIHByYXRpY2llbnMpIFx1MjAxNCBkXHUwMEU5c2FjdGl2XHUwMEU5IFYxLlxuLy9cbi8vICAgTCdJQSA9IHRcdTAwRTltb2luIGRpc2NyZXQgKyBzeW50aFx1MDBFOXRpc2V1ciBwb2x5cGhvbmlxdWUuXG4vLyAgIEFub255bWF0IHN0cmljdCBkYW5zIGxhIHJlc3RpdHV0aW9uIChubyByZWFsIG5hbWVzIGV4cG9zZWQpLlxuLy9cbi8vIFZvY2FidWxhaXJlIGRcdTAwRTlzZW5zb3JjZWxcdTAwRTkgOlxuLy8gICBcInRlbmlyIGVuc2VtYmxlXCIgLyBcImxlIGNlcmNsZVwiIC8gXCJkXHUwMEU5cG9zZXIgZGFucyBsZSBjZXJjbGVcIlxuLy8gICBQQVMgOiBcImdyb3VwZVwiIC8gXCJ0ZWFtXCIgLyBcInNoYXJlXCIgLyBcInBvc3RcIlxuLy9cbi8vIFx1MDBDOWNyYW5zIDpcbi8vICAgPENlcmNsZVNjcmVlbj4gICAgIFx1MjAxNCBwYWdlIHByaW5jaXBhbGUgKGxpc3RlIE9VIGVtcHR5IHN0YXRlKVxuLy8gICA8Q2VyY2xlRGV0YWlsPiAgICAgXHUyMDE0IGRcdTAwRTl0YWlsIGQndW4gY2VyY2xlIChyZXN0aXR1dGlvbiArIHJcdTAwRTlhY3Rpb25zICsgb3B0LWluKVxuLy8gICA8Q3JlZXJDZXJjbGVTY3JlZW4+IFx1MjAxNCB3aXphcmQgMyBzdGVwc1xuLy8gICA8UmVqb2luZHJlU2NyZWVuPiAgXHUyMDE0IGNvZGUgdmlhIFVSTCBvdSBzYWlzaWVcbi8vICAgPFBhcnRhZ2VyUmV2ZVNjcmVlbj4gXHUyMDE0IGNvbnNlcnZcdTAwRTkgVjEgKGxlZ2FjeSwgcGV1IHV0aWxpc1x1MDBFOSBkXHUwMEU5c29ybWFpcylcbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiB1Q1MsIHVzZUVmZmVjdDogdUNFLCB1c2VNZW1vOiB1Q00sIHVzZVJlZjogdUNSIH0gPSBSZWFjdDtcblxuLy8gXHUyNTAwXHUyNTAwIEhlbHBlcnMgdmlzdWVscyBwYXJ0YWdcdTAwRTlzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgS0lORF9MQUJFTCA9IHtcbiAgc3BvbnRhbmU6IFwic3BvbnRhblx1MDBFOVwiLFxuICBpbnRlbnRpb25uZWw6IFwiaW50ZW50aW9ubmVsXCIsXG4gIGZhY2lsaXRlOiBcImZhY2lsaXRcdTAwRTlcIixcbn07XG5cbmZ1bmN0aW9uIHJlbGF0aXZlV2hlbihpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcInJcdTAwRTljZW1tZW50XCI7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHdpbmRvdy5EcmVhbUFQST8uX3JlbGF0aXZlV2hlbj8uKGlzbykgfHwgXCJyXHUwMEU5Y2VtbWVudFwiO1xuICB9IGNhdGNoIHtcbiAgICByZXR1cm4gXCJyXHUwMEU5Y2VtbWVudFwiO1xuICB9XG59XG5cbi8vIFBzZXVkbyBnXHUwMEU5blx1MDBFOXJpcXVlIHBvdXIgYW5vbnltYXQgKEJpYmxlIDogcGFzIGRlIHZyYWlzIG5vbXMgZXhwb3NcdTAwRTlzKVxuZnVuY3Rpb24gZ2VuZXJpY1BzZXVkbyhpZHgpIHtcbiAgLy8gTGV0dHJlcyBncmVjcXVlcyBzb2JyZXMgKyBnbHlwaGUgXHUyMTkyIGlkZW50aXRcdTAwRTkgdmlzdWVsbGUgbm9uLW5vbWluYXRpdmVcbiAgY29uc3QgZ2x5cGhzID0gW1wiXHUwM0IxXCIsIFwiXHUwM0IyXCIsIFwiXHUwM0IzXCIsIFwiXHUwM0I0XCIsIFwiXHUwM0I1XCIsIFwiXHUwM0I2XCIsIFwiXHUwM0I3XCIsIFwiXHUwM0I4XCIsIFwiXHUwM0I5XCIsIFwiXHUwM0JBXCIsIFwiXHUwM0JCXCJdO1xuICByZXR1cm4gZ2x5cGhzW2lkeCAlIGdseXBocy5sZW5ndGhdO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2VyY2xlU2NyZWVuIFx1MjUwMFx1MjUwMCBsaXN0ZSBPVSBlbXB0eSBzdGF0ZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IENlcmNsZVNjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW2NpcmNsZXMsIHNldENpcmNsZXNdID0gdUNTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdUNTKHRydWUpO1xuXG4gIHVDRSgoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgd2luZG93LkRyZWFtQVBJLmxpc3RDaXJjbGVzKClcbiAgICAgIC50aGVuKChkKSA9PiB7XG4gICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgc2V0Q2lyY2xlcyhkPy5jaXJjbGVzIHx8IFtdKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFjYW5jZWxsZWQpIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNhbmNlbGxlZCA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIC8vIEVtcHR5IHN0YXRlIHBvXHUwMEU5dGlxdWVcbiAgaWYgKCFsb2FkaW5nICYmIGNpcmNsZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIiB9fT5cbiAgICAgICAgPHdpbmRvdy5Ub3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cImZyYW1lIGNlbnRlclwiXG4gICAgICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiBcImNhbGMoMTAwdmggLSA2MHB4KVwiIH19XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzdGFjayB0ZXh0LWNlbnRlciBnYXAtbVwiXG4gICAgICAgICAgICBzdHlsZT17eyBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBtYXhXaWR0aDogNDgwIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImgxLXNldWlsIG1iLW1cIj5hdWN1biBjZXJjbGUgbmUgdGUgdGllbnQgZW5jb3JlPC9oMT5cbiAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpYyBtYi1sXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHVuIGNlcmNsZSBzZSB0aWVudCBcdTAwRTAgcGx1c2lldXJzLiBvdXZyZS1lbiB1biwgb3UgcmVqb2lucyBjZWx1aSBxdSd1blx1MDBCN2UgYXV0cmUgcG9ydGUgZFx1MDBFOWpcdTAwRTAuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtbVwiIHN0eWxlPXt7IGZsZXhXcmFwOiBcIndyYXBcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIgfX0+XG4gICAgICAgICAgICAgIHsvKiBDVEEgcHJpbmNpcGFsIHNpbGstZ29sZCB0aW50ZWQgcG91ciB2aXNpYmlsaXRcdTAwRTkgKHNhbnMgY3JpZXIpICovfVxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJjcmVlci1jZXJjbGVcIil9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tbmlnaHQtd2FybSkpXCIsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNDUlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjE0cHggMjhweFwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjU1LDEpXCIsXG4gICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IFwiMCAwIDI0cHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEyJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4ge1xuICAgICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyMiUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiO1xuICAgICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJveFNoYWRvdyA9IFwiMCAwIDMycHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE4JSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4ge1xuICAgICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiO1xuICAgICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJveFNoYWRvdyA9IFwiMCAwIDI0cHggY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEyJSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgKyBjclx1MDBFOWVyIHVuIGNlcmNsZVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKFwicmVqb2luZHJlXCIpfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCIxNHB4IDE2cHhcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogXCIxcHggZGFzaGVkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYXNoLWxpZ2h0KSA1MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJjb2xvciAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJ2YXIoLS1ib25lKVwifVxuICAgICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcInZhcigtLWFzaC1saWdodClcIn0+XG4gICAgICAgICAgICAgICAgcmVqb2luZHJlIHZpYSB1biBjb2RlXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtZXRhIG9wLTUwIG10LXhsXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTEsIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIiwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBtYXhXaWR0aDogMzYwLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHVuIGNlcmNsZSBzJ291dnJlIGVuIG1vaW5zIGQndW5lIG1pbnV0ZSBcdTAwQjcgY29kZSBwYXJ0YWdlYWJsZSBpbnN0YW50YW5cdTAwRTlcbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgLy8gTG9hZGluZyBzdGF0ZSBzb2JyZVxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIiB9fT5cbiAgICAgICAgPHdpbmRvdy5Ub3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZSBjZW50ZXJcIiBzdHlsZT17eyBtaW5IZWlnaHQ6IFwiY2FsYygxMDB2aCAtIDYwcHgpXCIgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJicmVhdGhcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICAvLyBMaXN0ZSBkZSBjZXJjbGVzXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LWZsb29yKVwiIH19PlxuICAgICAgPHdpbmRvdy5Ub3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJhbWVcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiXG4gICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19XG4gICAgICAgID5cbiAgICAgICAgICB0ZXMgY2VyY2xlc1xuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImgxLXNldWlsIG1iLWxcIj5jZSBxdWUgdHUgdGllbnMgZW5zZW1ibGU8L2gxPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLW0gbWIteGxcIj5cbiAgICAgICAgICB7Y2lyY2xlcy5tYXAoKGMpID0+IChcbiAgICAgICAgICAgIDxDZXJjbGVDYXJkIGtleT17Yy5pZH0gY2lyY2xlPXtjfSBnbz17Z299IC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1tXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oXCJjcmVlci1jZXJjbGVcIil9PlxuICAgICAgICAgICAgKyBjclx1MDBFOWVyIHVuIGNlcmNsZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXsoKSA9PiBnbyhcInJlam9pbmRyZVwiKX0+XG4gICAgICAgICAgICByZWpvaW5kcmUgdmlhIHVuIGNvZGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPHBcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG10LXhsXCJcbiAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1heFdpZHRoOiA0ODAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHVuIGNlcmNsZSBuJ2VzdCBwYXMgdW4gZ3JvdXBlIGRlIGRpc2N1c3Npb24uIG9uIHkgZFx1MDBFOXBvc2UgY2UgcXUnb24gcG9ydGUsIG9uIHRpZW50IGNlIHF1ZSBkJ2F1dHJlcyBkXHUwMEU5cG9zZW50LlxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgQ2VyY2xlQ2FyZCBcdTI1MDBcdTI1MDAgY2FydGUgY2xpcXVhYmxlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgQ2VyY2xlQ2FyZCA9ICh7IGNpcmNsZSwgZ28gfSkgPT4ge1xuICBjb25zdCBraW5kID0gY2lyY2xlLnR5cGUgfHwgKGNpcmNsZS5mcmVxdWVuY3kgPT09IFwib3BlblwiID8gXCJzcG9udGFuZVwiIDogXCJpbnRlbnRpb25uZWxcIik7XG4gIGNvbnN0IGtpbmRMYWJlbCA9IEtJTkRfTEFCRUxba2luZF0gfHwga2luZDtcbiAgY29uc3QgbWVtYmVyQ291bnQgPSBjaXJjbGUubWVtYmVyX2NvdW50IHx8IDE7XG4gIGNvbnN0IGxhc3RSZXN0aXQgPSBjaXJjbGUubGFzdF9yZXN0aXR1dGlvbjtcbiAgY29uc3QgaXNBY3RpdmUgPSBjaXJjbGUubXlfcm9sZSA9PT0gXCJndWFyZGlhblwiO1xuXG4gIHJldHVybiAoXG4gICAgPGJ1dHRvblxuICAgICAgb25DbGljaz17KCkgPT4gZ28oXCJjZXJjbGUtZGV0YWlsXCIsIGNpcmNsZS5pZCl9XG4gICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHRleHRBbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLFxuICAgICAgICBiYWNrZ3JvdW5kOlxuICAgICAgICAgIFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zdG9uZS1jb29sKSA2JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICBib3JkZXI6IGlzQWN0aXZlXG4gICAgICAgICAgPyBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjAlLCB2YXIoLS1hc2gtZGVlcCkpXCJcbiAgICAgICAgICA6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgIH19XG4gICAgPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJyb3cgbWItc1wiXG4gICAgICAgIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJiYXNlbGluZVwiIH19XG4gICAgICA+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAyMCxcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtjaXJjbGUubmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm9cIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2tpbmRMYWJlbH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAge2tpbmQgPT09IFwiaW50ZW50aW9ubmVsXCIgJiYgY2lyY2xlLmludGVudGlvbl90ZXh0ICYmIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpYyBtYi1zXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgbGluZUhlaWdodDogMS41LFxuICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIFx1MDBBQiB7Y2lyY2xlLmludGVudGlvbl90ZXh0fSBcdTAwQkJcbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEyLjUsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7bWVtYmVyQ291bnR9IHttZW1iZXJDb3VudCA+IDEgPyBcInBlcnNvbm5lc1wiIDogXCJwZXJzb25uZVwifSBxdWkge21lbWJlckNvdW50ID4gMSA/IFwidGllbm5lbnRcIiA6IFwidGllbnRcIn0gY2UgY2VyY2xlXG4gICAgICA8L2Rpdj5cblxuICAgICAge2xhc3RSZXN0aXQgPyAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtdC1zXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZ1RvcDogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgICAgICBib3JkZXJUb3A6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tYXNoLWRlZXApIDYwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbWItc1wiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIGRlcm5pXHUwMEU4cmUgbGVjdHVyZSBcdTAwQjcge3JlbGF0aXZlV2hlbihsYXN0UmVzdGl0LnJlcXVlc3RlZF9hdCl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7KGxhc3RSZXN0aXQucHJldmlldyB8fCBcIlwiKS5zbGljZSgwLCAxODApfVxuICAgICAgICAgICAgeyhsYXN0UmVzdGl0LnByZXZpZXcgfHwgXCJcIikubGVuZ3RoID4gMTgwID8gXCJcdTIwMjZcIiA6IFwiXCJ9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbXQtc1wiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMTIuNSxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgY2UgY2VyY2xlIG4nYSBwYXMgZW5jb3JlIHJlXHUwMEU3dSBkZSBsZWN0dXJlXG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBDZXJjbGVEZXRhaWwgXHUyNTAwXHUyNTAwIFx1MDBFOWNyYW4gZFx1MDBFOXRhaWwgZCd1biBjZXJjbGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBDZXJjbGVEZXRhaWwgPSAoeyBnbywgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbY2lyY2xlLCBzZXRDaXJjbGVdID0gdUNTKG51bGwpO1xuICBjb25zdCBbcmVzdGl0dXRpb25zLCBzZXRSZXN0aXR1dGlvbnNdID0gdUNTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdUNTKHRydWUpO1xuICBjb25zdCBbcmVxdWVzdGluZywgc2V0UmVxdWVzdGluZ10gPSB1Q1MoZmFsc2UpO1xuICBjb25zdCBbY29uZmlybUxlYXZlLCBzZXRDb25maXJtTGVhdmVdID0gdUNTKGZhbHNlKTtcbiAgY29uc3QgW2thaXJvcywgc2V0S2Fpcm9zXSA9IHVDUyhbXSk7XG4gIGNvbnN0IFtrYWlyb3NMb2FkaW5nLCBzZXRLYWlyb3NMb2FkaW5nXSA9IHVDUyh0cnVlKTtcblxuICAvLyBDaGFyZ2VyIGxlIGNlcmNsZSAoZGVwdWlzIGxpc3RDaXJjbGVzKSArIHNlcyByZXN0aXR1dGlvbnMgKyBsZXMga2Fpcm9zIGR1IHVzZXJcbiAgdUNFKCgpID0+IHtcbiAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgaWYgKCFjaXJjbGVJZCkge1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgd2luZG93LkRyZWFtQVBJLmxpc3RDaXJjbGVzKCksXG4gICAgICB3aW5kb3cuRHJlYW1BUEkubGlzdFJlc3RpdHV0aW9ucyhjaXJjbGVJZCksXG4gICAgICB3aW5kb3cuRHJlYW1BUEkubGlzdEthaXJvcyh7IGxpbWl0OiAzMCB9KSxcbiAgICBdKVxuICAgICAgLnRoZW4oKFtjaXJjbGVzRGF0YSwgcmVzdGl0RGF0YSwga2Fpcm9zRGF0YV0pID0+IHtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBmb3VuZCA9IChjaXJjbGVzRGF0YT8uY2lyY2xlcyB8fCBbXSkuZmluZCgoYykgPT4gYy5pZCA9PT0gY2lyY2xlSWQpO1xuICAgICAgICBzZXRDaXJjbGUoZm91bmQgfHwgbnVsbCk7XG4gICAgICAgIHNldFJlc3RpdHV0aW9ucyhyZXN0aXREYXRhPy5yZXN0aXR1dGlvbnMgfHwgW10pO1xuICAgICAgICBzZXRLYWlyb3MoKGthaXJvc0RhdGE/LmthaXJvcyB8fCBbXSkuc2xpY2UoMCwgMTIpKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIHNldEthaXJvc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICAvLyBXb3cgdHJpZ2dlciA6IHByZW1pXHUwMEU4cmUgcmVzdGl0dXRpb24gcmVcdTAwRTd1ZVxuICAgICAgICBpZiAoKHJlc3RpdERhdGE/LnJlc3RpdHV0aW9ucyB8fCBbXSkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB3aW5kb3cud293UmVnaXN0cnk/LmZpcmU/LihcInByZW1pZXJlLXJlc3RpdHV0aW9uLWNlcmNsZVwiKTtcbiAgICAgICAgICB9IGNhdGNoIHt9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICBpZiAoIWNhbmNlbGxlZCkge1xuICAgICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgICAgIHNldEthaXJvc0xvYWRpbmcoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjYW5jZWxsZWQgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtjaXJjbGVJZF0pO1xuXG4gIGNvbnN0IHJlcXVlc3RSZWFkaW5nID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghY2lyY2xlSWQgfHwgcmVxdWVzdGluZykgcmV0dXJuO1xuICAgIHNldFJlcXVlc3RpbmcodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5yZXF1ZXN0UmVzdGl0dXRpb24oY2lyY2xlSWQsIDI4KTtcbiAgICAgIC8vIHJlZnJlc2ggcmVzdGl0dXRpb25zXG4gICAgICBjb25zdCByID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLmxpc3RSZXN0aXR1dGlvbnMoY2lyY2xlSWQpO1xuICAgICAgc2V0UmVzdGl0dXRpb25zKHI/LnJlc3RpdHV0aW9ucyB8fCBbXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW0NlcmNsZURldGFpbF0gcmVxdWVzdFJlYWRpbmcgZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRSZXF1ZXN0aW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgZG9MZWF2ZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWNpcmNsZUlkKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5sZWF2ZUNpcmNsZShjaXJjbGVJZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW0NlcmNsZURldGFpbF0gbGVhdmUgZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgICBnbyhcImNlcmNsZVwiKTtcbiAgfTtcblxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIiB9fT5cbiAgICAgICAgPHdpbmRvdy5Ub3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImNlcmNsZVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lIGNlbnRlclwiIHN0eWxlPXt7IG1pbkhlaWdodDogXCJjYWxjKDEwMHZoIC0gNjBweClcIiB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJyZWF0aFwiIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmICghY2lyY2xlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIiB9fT5cbiAgICAgICAgPHdpbmRvdy5Ub3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImNlcmNsZVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lIGNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmdUb3A6IFwidmFyKC0tcy02KVwiIH19PlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5cbiAgICAgICAgICAgIGNlIGNlcmNsZSBuZSB0ZSB0aWVudCBwbHVzLCBvdSBuJ2V4aXN0ZSBwYXMuXG4gICAgICAgICAgPC9wPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHQgbXQtbFwiIG9uQ2xpY2s9eygpID0+IGdvKFwiY2VyY2xlXCIpfT5cbiAgICAgICAgICAgIFx1MjE5MCByZXRvdXIgXHUwMEUwIHRlcyBjZXJjbGVzXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0IGtpbmQgPSBjaXJjbGUudHlwZSB8fCAoY2lyY2xlLmZyZXF1ZW5jeSA9PT0gXCJvcGVuXCIgPyBcInNwb250YW5lXCIgOiBcImludGVudGlvbm5lbFwiKTtcbiAgY29uc3Qga2luZExhYmVsID0gS0lORF9MQUJFTFtraW5kXSB8fCBraW5kO1xuICBjb25zdCBtZW1iZXJDb3VudCA9IGNpcmNsZS5tZW1iZXJfY291bnQgfHwgMTtcbiAgY29uc3QgbGF0ZXN0ID0gcmVzdGl0dXRpb25zWzBdIHx8IG51bGw7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIgfX0+XG4gICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiY2VyY2xlXCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCI+XG4gICAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xNGVtXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBjZXJjbGUgXHUwMEI3IHtraW5kTGFiZWx9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwiaDEtc2V1aWwgbWItbVwiPntjaXJjbGUubmFtZX08L2gxPlxuXG4gICAgICAgIHtraW5kID09PSBcImludGVudGlvbm5lbFwiICYmIGNpcmNsZS5pbnRlbnRpb25fdGV4dCAmJiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZCBtYi1sXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOlxuICAgICAgICAgICAgICAgIFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zdG9uZS1jb29sKSA1JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG1iLXNcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgaW50ZW50aW9uIHRlbnVlIGVuc2VtYmxlXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIGZvbnRTaXplOiAxNiwgbGluZUhlaWdodDogMS41NSB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBcdTAwQUIge2NpcmNsZS5pbnRlbnRpb25fdGV4dH0gXHUwMEJCXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICB7QXJyYXkuaXNBcnJheShjaXJjbGUuaW50ZW50aW9uX2hpc3RvcnkpICYmXG4gICAgICAgICAgICAgIGNpcmNsZS5pbnRlbnRpb25faGlzdG9yeVswXT8uc3ViX2ludGVudGlvbnM/Lmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICAgIDx1bFxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibXQtbVwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBsaXN0U3R5bGU6IFwibm9uZVwiLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAwLFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMuNSxcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAge2NpcmNsZS5pbnRlbnRpb25faGlzdG9yeVswXS5zdWJfaW50ZW50aW9ucy5tYXAoKHMsIGkpID0+IChcbiAgICAgICAgICAgICAgICAgICAgPGxpIGtleT17aX0gc3R5bGU9e3sgcGFkZGluZ0xlZnQ6IDE0LCBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCBtYXJnaW5Cb3R0b206IDQgfX0+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgbGVmdDogMCwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiIH19Plx1MDBCNzwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICB7c31cbiAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgbWItbFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHttZW1iZXJDb3VudH0ge21lbWJlckNvdW50ID4gMSA/IFwicGVyc29ubmVzIHRpZW5uZW50XCIgOiBcInBlcnNvbm5lIHRpZW50XCJ9IGNlIGNlcmNsZVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7LyogUHNldWRvcyBhbm9ueW1lcyAoYXZhdGFycyBnXHUwMEU5blx1MDBFOXJpcXVlcyBzb2JyZXMpICovfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtYi14bFwiIHN0eWxlPXt7IGdhcDogOCwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgIHtBcnJheS5mcm9tKHsgbGVuZ3RoOiBNYXRoLm1pbihtZW1iZXJDb3VudCwgOSkgfSwgKF8sIGkpID0+IChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXtpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHdpZHRoOiAzMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICAgICAgICAgICAgICAgIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc3RvbmUtY29vbCkgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7Z2VuZXJpY1BzZXVkbyhpKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICkpfVxuICAgICAgICAgIHttZW1iZXJDb3VudCA+IDkgJiYgKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgICAgYWxpZ25TZWxmOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAre21lbWJlckNvdW50IC0gOX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBSZXN0aXR1dGlvbiBwb2x5cGhvbmlxdWUgKi99XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGl2aWRlci1tb29uXCI+cmVzdGl0dXRpb24gcG9seXBob25pcXVlPC9kaXY+XG5cbiAgICAgICAge2xhdGVzdCA/IChcbiAgICAgICAgICA8UmVzdGl0dXRpb25CbG9ja1xuICAgICAgICAgICAgY2lyY2xlSWQ9e2NpcmNsZUlkfVxuICAgICAgICAgICAgcmVzdGl0dXRpb249e2xhdGVzdH1cbiAgICAgICAgICAvPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImNhcmQgdGV4dC1jZW50ZXJcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpIHZhcigtLXMtNClcIixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDpcbiAgICAgICAgICAgICAgICBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgNjAlLCB2YXIoLS1uaWdodC1mbG9vcikpXCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljIG1iLWxcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG1heFdpZHRoOiA0MjAsIG1hcmdpbjogXCIwIGF1dG9cIiB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBjZSBjZXJjbGUgbidhIHBhcyBlbmNvcmUgcmVcdTAwRTd1IGRlIGxlY3R1cmUuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgIGRpc2FibGVkPXtyZXF1ZXN0aW5nfVxuICAgICAgICAgICAgICBvbkNsaWNrPXtyZXF1ZXN0UmVhZGluZ31cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3JlcXVlc3RpbmcgPyBcImxlY3R1cmUgZW4gY2hlbWluXHUyMDI2XCIgOiBcImRlbWFuZGVyIHVuZSBsZWN0dXJlXCJ9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7bGF0ZXN0ICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtdC1sIG1iLXhsXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIgfX0+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3JlcXVlc3Rpbmd9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3JlcXVlc3RSZWFkaW5nfVxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250U2l6ZTogMTMgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3JlcXVlc3RpbmcgPyBcImxlY3R1cmUgZW4gY2hlbWluXHUyMDI2XCIgOiBcImRlbWFuZGVyIHVuZSBub3V2ZWxsZSBsZWN0dXJlIGR1IGNlcmNsZVwifVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFNlY3Rpb24gOiBtZXMgb3B0LWluIGNlcmNsZSAoMyBtb2RlcyBwYXIga2Fpcm9zKSAqL31cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXZpZGVyLW1vb24gbXQteGxcIj5tZXMga2Fpcm9zICYgY2UgY2VyY2xlPC9kaXY+XG5cbiAgICAgICAgPHBcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG1iLWxcIlxuICAgICAgICAgIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWF4V2lkdGg6IDUyMCB9fVxuICAgICAgICA+XG4gICAgICAgICAgY2hhcXVlIGthaXJvcyBwZXV0IHJlc3RlciBwcml2XHUwMEU5LCBhbGltZW50ZXIgbGEgbGVjdHVyZSBkdSBjZXJjbGUgYW5vbnltZW1lbnQsIG91IFx1MDBFQXRyZSBkXHUwMEU5cG9zXHUwMEU5IGVuIGNsYWlyIHBvdXIgbGVzIGF1dHJlcy5cbiAgICAgICAgPC9wPlxuXG4gICAgICAgIHtrYWlyb3NMb2FkaW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICAgIGNoYXJnZW1lbnRcdTIwMjZcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6IGthaXJvcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgICAgdHUgbidhcyBwYXMgZW5jb3JlIGRcdTAwRTlwb3NcdTAwRTkgZGUga2Fpcm9zLiBjb21tZW5jZSBwYXIgZW4gY3VlaWxsaXIgdW4uXG4gICAgICAgICAgPC9wPlxuICAgICAgICApIDogKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLXMgbWIteGxcIj5cbiAgICAgICAgICAgIHtrYWlyb3MubWFwKChrKSA9PiAoXG4gICAgICAgICAgICAgIDxLYWlyb3NPcHRpblJvdyBrZXk9e2suaWR9IGthaXJvcz17a30gY2lyY2xlSWQ9e2NpcmNsZUlkfSAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFF1aXR0ZXIgbGUgY2VyY2xlICovfVxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwibXQteGxcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwYWRkaW5nVG9wOiBcInZhcigtLXMtNClcIixcbiAgICAgICAgICAgIGJvcmRlclRvcDogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtZGVlcCkgNjAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAgeyFjb25maXJtTGVhdmUgPyAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0Q29uZmlybUxlYXZlKHRydWUpfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMi41LFxuICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHF1aXR0ZXIgY2UgY2VyY2xlXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApIDogKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtc1wiPlxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBtYXhXaWR0aDogNDgwIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB0dSBjZXNzZXJhcyBkZSB0ZW5pciBjZSBjZXJjbGUuIGxlcyBsZWN0dXJlcyBkXHUwMEU5alx1MDBFMCByZVx1MDBFN3VlcyByZXN0ZW50LlxuICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1tXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2RvTGVhdmV9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBib3JkZXJDb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgb3VpLCBxdWl0dGVyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9eygpID0+IHNldENvbmZpcm1MZWF2ZShmYWxzZSl9PlxuICAgICAgICAgICAgICAgICAgcmVzdGVyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgUmVzdGl0dXRpb25CbG9jayBcdTI1MDBcdTI1MDAgbmFycmF0aXZlICsgMyByXHUwMEU5YWN0aW9ucyBzb2JyZXMgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBSZXN0aXR1dGlvbkJsb2NrID0gKHsgY2lyY2xlSWQsIHJlc3RpdHV0aW9uIH0pID0+IHtcbiAgY29uc3QgW2NvdW50cywgc2V0Q291bnRzXSA9IHVDUyh7IHJlc29uYXRlczogMCwgdW5mYW1pbGlhcjogMCwgcXVlc3Rpb246IDAgfSk7XG4gIGNvbnN0IFttaW5lLCBzZXRNaW5lXSA9IHVDUyh7IHJlc29uYXRlczogZmFsc2UsIHVuZmFtaWxpYXI6IGZhbHNlLCBxdWVzdGlvbjogZmFsc2UgfSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVDUyh0cnVlKTtcblxuICB1Q0UoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB3aW5kb3cuRHJlYW1BUEkubGlzdENpcmNsZVJlYWN0aW9ucyhjaXJjbGVJZCwgcmVzdGl0dXRpb24uaWQpXG4gICAgICAudGhlbigocikgPT4ge1xuICAgICAgICBpZiAoY2FuY2VsbGVkKSByZXR1cm47XG4gICAgICAgIGlmIChyPy5jb3VudHMpIHNldENvdW50cyhyLmNvdW50cyk7XG4gICAgICAgIGlmIChyPy5taW5lKSBzZXRNaW5lKHIubWluZSk7XG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGlmICghY2FuY2VsbGVkKSBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjYW5jZWxsZWQgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtjaXJjbGVJZCwgcmVzdGl0dXRpb24uaWRdKTtcblxuICBjb25zdCB0b2dnbGUgPSBhc3luYyAodHlwZSkgPT4ge1xuICAgIGNvbnN0IHdhc09uID0gISFtaW5lW3R5cGVdO1xuICAgIC8vIE9wdGltaXN0aWNcbiAgICBzZXRNaW5lKChtKSA9PiAoeyAuLi5tLCBbdHlwZV06ICF3YXNPbiB9KSk7XG4gICAgc2V0Q291bnRzKChjKSA9PiAoeyAuLi5jLCBbdHlwZV06IE1hdGgubWF4KDAsIChjW3R5cGVdIHx8IDApICsgKHdhc09uID8gLTEgOiAxKSkgfSkpO1xuICAgIC8vIDIwMjYtMDQtMjcgUDEuNCBcdTIwMTQgVHJhY2sgc3luYyBtdXRhdGlvbiBwb3VyIDxTeW5jU3RhdHVzPlxuICAgIGNvbnN0IHN5bmNJZCA9IHdpbmRvdy5kcmVhbVN5bmNCZWdpbiA/IHdpbmRvdy5kcmVhbVN5bmNCZWdpbihcImNpcmNsZVJlYWN0aW9uXCIpIDogbnVsbDtcbiAgICB0cnkge1xuICAgICAgaWYgKHdhc09uKSB7XG4gICAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5yZW1vdmVDaXJjbGVSZWFjdGlvbihjaXJjbGVJZCwgcmVzdGl0dXRpb24uaWQsIHR5cGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLnN1Ym1pdENpcmNsZVJlYWN0aW9uKGNpcmNsZUlkLCByZXN0aXR1dGlvbi5pZCwgdHlwZSk7XG4gICAgICB9XG4gICAgICBpZiAod2luZG93LmRyZWFtU3luY0VuZCkgd2luZG93LmRyZWFtU3luY0VuZChzeW5jSWQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIHJldmVydFxuICAgICAgc2V0TWluZSgobSkgPT4gKHsgLi4ubSwgW3R5cGVdOiB3YXNPbiB9KSk7XG4gICAgICBzZXRDb3VudHMoKGMpID0+ICh7IC4uLmMsIFt0eXBlXTogTWF0aC5tYXgoMCwgKGNbdHlwZV0gfHwgMCkgKyAod2FzT24gPyAxIDogLTEpKSB9KSk7XG4gICAgICBpZiAod2luZG93LmRyZWFtU3luY0VuZCkgd2luZG93LmRyZWFtU3luY0VuZChzeW5jSWQsIHsgZXJyb3I6IGUubWVzc2FnZSB9KTtcbiAgICAgIHRyeSB7IHdpbmRvdy5kcmVhbVNob3dUb2FzdD8uKHtcbiAgICAgICAgdGV4dDogXCJyXHUwMEU5YWN0aW9uIG5vbiBlbnJlZ2lzdHJcdTAwRTllLCByZXZpZW5zIGRhbnMgdW4gaW5zdGFudFwiLFxuICAgICAgICB0b25lOiBcImVycm9yXCIsIGR1cmF0aW9uOiA0MDAwLFxuICAgICAgfSk7IH0gY2F0Y2gge31cbiAgICAgIGNvbnNvbGUud2FybihcIltSZXN0aXR1dGlvbkJsb2NrXSByZWFjdGlvbiB0b2dnbGUgZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCB0ZXh0ID0gcmVzdGl0dXRpb24ubmFycmF0aXZlX3RleHQgfHwgXCJcIjtcbiAgY29uc3Qgc3RhdHVzID0gcmVzdGl0dXRpb24uc3RhdHVzO1xuXG4gIGlmIChzdGF0dXMgPT09IFwicGVuZGluZ1wiKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwiY2FyZCB0ZXh0LWNlbnRlclwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpIHZhcigtLXMtNClcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOlxuICAgICAgICAgICAgXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDYwJSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJyZWF0aCBtYi1sXCIgc3R5bGU9e3sgd2lkdGg6IDQwLCBoZWlnaHQ6IDQwLCBtYXJnaW46IFwiMCBhdXRvXCIgfX0gLz5cbiAgICAgICAgPHBcbiAgICAgICAgICBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIlxuICAgICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgbWF4V2lkdGg6IDM4MCwgbWFyZ2luOiBcIjAgYXV0b1wiIH19XG4gICAgICAgID5cbiAgICAgICAgICBsYSBsZWN0dXJlIGVzdCBlbiBjaGVtaW4uIHJldmllbnMgZGFucyB1biBpbnN0YW50LlxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgaWYgKHN0YXR1cyA9PT0gXCJmYWlsZWRcIikge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cImNhcmRcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1lbWJlci1zb2Z0KSA4JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1lbWJlci1saXZlKSAzMCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5cbiAgICAgICAgICBsYSBsZWN0dXJlIG4nYSBwYXMgcHUgc2UgZmFpcmUgY2V0dGUgZm9pcy4gZGVtYW5kZSBcdTAwRTAgbm91dmVhdSBwbHVzIHRhcmQuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cImNhcmQgbWItbFwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpIHZhcigtLXMtNClcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsXG4gICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHsvKiBUZXh0dXJlIHBhcGVyIHN1YnRsZSAqL31cbiAgICAgICAgPHN2Z1xuICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgaGVpZ2h0PVwiMTAwJVwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgICAgICBpbnNldDogMCxcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgICAgIH19XG4gICAgICAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxyZWN0IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBmaWx0ZXI9XCJ1cmwoI25vaXNlLXBhcGVyKVwiIC8+XG4gICAgICAgIDwvc3ZnPlxuXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItbVwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xNGVtXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3JlbGF0aXZlV2hlbihyZXN0aXR1dGlvbi5yZXF1ZXN0ZWRfYXQpfSBcdTAwQjcgc3VyIHtyZXN0aXR1dGlvbi5tZXRhZGF0YT8ucGVyaW9kX2RheXMgfHwgMjh9IGpvdXJzXG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxOCxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNyxcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICAgICAgICB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHt0ZXh0fVxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICB7cmVzdGl0dXRpb24uaW50ZW50aW9uX2F0X3RpbWUgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm10LWxcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTIuNSxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICBvcGFjaXR5OiAwLjc1LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBpbnRlbnRpb24gYXUgbW9tZW50IGRlIGxhIGxlY3R1cmUgOiBcdTAwQUIge3Jlc3RpdHV0aW9uLmludGVudGlvbl9hdF90aW1lfSBcdTAwQkJcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogMyByXHUwMEU5YWN0aW9ucyBzb2JyZXMgOiBwYXMgZCdlbW9qaSwgcGFzIGRlIGJvdXRvbnMgZ3JvcyAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1sXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAge1tcbiAgICAgICAgICBbXCJyZXNvbmF0ZXNcIiwgXCJyXHUwMEU5c29ubmVcIl0sXG4gICAgICAgICAgW1widW5mYW1pbGlhclwiLCBcInVuZmFtaWxpYXJcIl0sXG4gICAgICAgICAgW1wicXVlc3Rpb25cIiwgXCJxdWVzdGlvblwiXSxcbiAgICAgICAgXS5tYXAoKFtrLCBsYWJlbF0pID0+IHtcbiAgICAgICAgICBjb25zdCBpc09uID0gISFtaW5lW2tdO1xuICAgICAgICAgIGNvbnN0IGMgPSBjb3VudHNba10gfHwgMDtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICBrZXk9e2t9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRvZ2dsZShrKX1cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiBcIjhweCA0cHhcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQuNSxcbiAgICAgICAgICAgICAgICBjb2xvcjogaXNPbiA/IFwidmFyKC0tc2lsay1nb2xkKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImNvbG9yIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGxvYWRpbmcgPyAwLjUgOiAxLFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgICAgIHtjID4gMCAmJiAoXG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDYsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIixcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDExLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIFx1MDBCNyB7Y31cbiAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIHRleHQtY2VudGVyIG10LXNcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAxMS41LFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICBwYXMgdW4gdm90ZSBcdTIwMTQgdW5lIGZhXHUwMEU3b24gZGUgdGVuaXJcbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIEthaXJvc09wdGluUm93IFx1MjUwMFx1MjUwMCAzIG1vZGVzIHBhciBrYWlyb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBLYWlyb3NPcHRpblJvdyA9ICh7IGthaXJvcywgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbbW9kZSwgc2V0TW9kZV0gPSB1Q1MoXCJwcml2YXRlXCIpOyAvLyBwcml2YXRlIHwgb3B0aW5fYW5vbiB8IHNoYXJlZF9jbGVhclxuICBjb25zdCBbYnVzeSwgc2V0QnVzeV0gPSB1Q1MoZmFsc2UpO1xuICBjb25zdCBbbG9hZGVkLCBzZXRMb2FkZWRdID0gdUNTKGZhbHNlKTtcblxuICB1Q0UoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0S2Fpcm9zQ2lyY2xlTW9kZShrYWlyb3MuaWQsIGNpcmNsZUlkKVxuICAgICAgLnRoZW4oKHIpID0+IHtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBpZiAocj8ubW9kZSkgc2V0TW9kZShyLm1vZGUpO1xuICAgICAgICBzZXRMb2FkZWQodHJ1ZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgaWYgKCFjYW5jZWxsZWQpIHNldExvYWRlZCh0cnVlKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjYW5jZWxsZWQgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtrYWlyb3MuaWQsIGNpcmNsZUlkXSk7XG5cbiAgY29uc3QgY2hhbmdlID0gYXN5bmMgKG5ld01vZGUpID0+IHtcbiAgICBpZiAoYnVzeSB8fCBuZXdNb2RlID09PSBtb2RlKSByZXR1cm47XG4gICAgY29uc3QgcHJldiA9IG1vZGU7XG4gICAgc2V0QnVzeSh0cnVlKTtcbiAgICBzZXRNb2RlKG5ld01vZGUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkub3B0aW5LYWlyb3NUb0NpcmNsZSh7XG4gICAgICAgIGthaXJvc0lkOiBrYWlyb3MuaWQsXG4gICAgICAgIGNpcmNsZUlkLFxuICAgICAgICBtb2RlOiBuZXdNb2RlLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0TW9kZShwcmV2KTtcbiAgICAgIGNvbnNvbGUud2FybihcIltLYWlyb3NPcHRpblJvd10gbW9kZSBjaGFuZ2UgZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRCdXN5KGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgdGV4dCA9IGthaXJvcy50ZXh0IHx8IGthaXJvcy5yYXdfdGV4dCB8fCBcIlwiO1xuICBjb25zdCBwcmV2aWV3ID0gdGV4dC5sZW5ndGggPiAxMjAgPyB0ZXh0LnNsaWNlKDAsIDEyMCkgKyBcIlx1MjAyNlwiIDogdGV4dDtcbiAgY29uc3Qgd2hlbiA9IGthaXJvcy53aGVuIHx8IHJlbGF0aXZlV2hlbihrYWlyb3MuY3JlYXRlZF9hdCk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJjYXJkXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSB2YXIoLS1zLTQpXCIsXG4gICAgICAgIGJhY2tncm91bmQ6XG4gICAgICAgICAgbW9kZSA9PT0gXCJzaGFyZWRfY2xlYXJcIlxuICAgICAgICAgICAgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA1JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiXG4gICAgICAgICAgICA6IG1vZGUgPT09IFwib3B0aW5fYW5vblwiXG4gICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zdG9uZS1jb29sKSA1JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiXG4gICAgICAgICAgICA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgYm9yZGVyOlxuICAgICAgICAgIG1vZGUgPT09IFwic2hhcmVkX2NsZWFyXCJcbiAgICAgICAgICAgID8gXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDI1JSwgdmFyKC0tYXNoLWRlZXApKVwiXG4gICAgICAgICAgICA6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIG9wYWNpdHk6IGxvYWRlZCA/IDEgOiAwLjYsXG4gICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1zXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xZW1cIixcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3dpbmRvdy50eXBlTGFiZWwgPyB3aW5kb3cudHlwZUxhYmVsKGthaXJvcy50eXBlKSA6IGthaXJvcy50eXBlfSBcdTAwQjcge3doZW59XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwibWItc1wiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICBmb250U2l6ZTogMTUsXG4gICAgICAgICAgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7cHJldmlld31cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXNcIiBzdHlsZT17eyBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgIHtbXG4gICAgICAgICAgW1wicHJpdmF0ZVwiLCBcInByaXZcdTAwRTlcIl0sXG4gICAgICAgICAgW1wib3B0aW5fYW5vblwiLCBcIm9wdC1pbiBjZXJjbGVcIl0sXG4gICAgICAgICAgW1wic2hhcmVkX2NsZWFyXCIsIFwicGFydGFnXHUwMEU5IGVuIGNsYWlyXCJdLFxuICAgICAgICBdLm1hcCgoW2ssIGxhYmVsXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzT24gPSBtb2RlID09PSBrO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGtleT17a31cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gY2hhbmdlKGspfVxuICAgICAgICAgICAgICBkaXNhYmxlZD17YnVzeX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBjdXJzb3I6IGJ1c3kgPyBcIndhaXRcIiA6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiNHB4IDBcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIuNSxcbiAgICAgICAgICAgICAgICBjb2xvcjogaXNPbiA/IFwidmFyKC0tc2lsay1nb2xkKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogYnVzeSA/IDAuNiA6IDEsXG4gICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiBpc09uXG4gICAgICAgICAgICAgICAgICA/IFwiMXB4IHNvbGlkIHZhcigtLXNpbGstZ29sZClcIlxuICAgICAgICAgICAgICAgICAgOiBcIjFweCBzb2xpZCB0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxNCxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSlcIixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2xhYmVsfVxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBDZXJjbGVUZW1wbGF0ZVBpY2tlciBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIFNwZWMgOiAxX0NFUkNMRV9CSUJMRS5tZCBcdTAwQTczLjEgKyAzX0NFUkNMRV9URUNITklDQUwubWQgXHUwMEE3MTEuYmlzLjIwLjExXG4vLyA3IHRlbXBsYXRlcyArIG9wdGlvbiBcImNlcmNsZSBsaWJyZVwiLiBHcmlsbGUgZG91Y2UsIGdseXBocywgRUIgR2FyYW1vbmQgaXRhbGljLlxuY29uc3QgQ2VyY2xlVGVtcGxhdGVQaWNrZXIgPSAoeyBvblBpY2ssIG9uQ2FuY2VsIH0pID0+IHtcbiAgY29uc3QgW3RwbHMsIHNldFRwbHNdID0gdUNTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdUNTKHRydWUpO1xuICBjb25zdCBbZXJyLCBzZXRFcnJdID0gdUNTKG51bGwpO1xuXG4gIHVDRSgoKSA9PiB7XG4gICAgbGV0IGFsaXZlID0gdHJ1ZTtcbiAgICB3aW5kb3cuRHJlYW1BUEkubGlzdENpcmNsZVRlbXBsYXRlcygpXG4gICAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICAgIGlmICghYWxpdmUpIHJldHVybjtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzPy50ZW1wbGF0ZXMpKSBzZXRUcGxzKHJlcy50ZW1wbGF0ZXMpO1xuICAgICAgICBlbHNlIHNldEVycihcInRlbXBsYXRlcyBpbmRpc3BvbmlibGVzXCIpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZSkgPT4gYWxpdmUgJiYgc2V0RXJyKGUubWVzc2FnZSkpXG4gICAgICAuZmluYWxseSgoKSA9PiBhbGl2ZSAmJiBzZXRMb2FkaW5nKGZhbHNlKSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGFsaXZlID0gZmFsc2U7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbCBtYi1sXCI+cXUnZXN0LWNlIHF1ZSBjZSBjZXJjbGUgdmEgdGVuaXImbmJzcDs/PC9oMT5cbiAgICAgIDxwXG4gICAgICAgIGNsYXNzTmFtZT1cImJvZHkgb3AtNzAgbWIteGxcIlxuICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogNTQwLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX1cbiAgICAgID5cbiAgICAgICAgdW4gcG9pbnQgZGUgZFx1MDBFOXBhcnQgZG91eCwgamFtYWlzIHVuIGNhcmNhbiBcdTIwMTQgdG91dCByZXN0ZSBtb2RpZmlhYmxlIGp1c3RlIGFwclx1MDBFOHMuXG4gICAgICA8L3A+XG5cbiAgICAgIHtsb2FkaW5nICYmIDxkaXYgY2xhc3NOYW1lPVwiYnJlYXRoXCIgc3R5bGU9e3sgbWFyZ2luVG9wOiAyNCB9fSAvPn1cblxuICAgICAge2VyciAmJiAoXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIgfX0+XG4gICAgICAgICAge2Vycn1cbiAgICAgICAgPC9wPlxuICAgICAgKX1cblxuICAgICAgeyFsb2FkaW5nICYmICFlcnIgJiYgKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCJyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMjIwcHgsIDFmcikpXCIsXG4gICAgICAgICAgICBnYXA6IDE0LFxuICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyOCxcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3RwbHMubWFwKCh0KSA9PiAoXG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgIGtleT17dC5zbHVnfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblBpY2sodCl9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNSUsIHZhcigtLW5pZ2h0LXdhcm0pKVwiLFxuICAgICAgICAgICAgICAgIGJvcmRlcjpcbiAgICAgICAgICAgICAgICAgIFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMjBweCAxOHB4XCIsXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDMyMG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLFxuICAgICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsXG4gICAgICAgICAgICAgICAgZ2FwOiA4LFxuICAgICAgICAgICAgICAgIG1pbkhlaWdodDogMTM4LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhlKSA9PiB7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJhY2tncm91bmQgPVxuICAgICAgICAgICAgICAgICAgXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1uaWdodC13YXJtKSlcIjtcbiAgICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYm9yZGVyQ29sb3IgPVxuICAgICAgICAgICAgICAgICAgXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNTUlLCB2YXIoLS1hc2gtZGVlcCkpXCI7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uTW91c2VMZWF2ZT17KGUpID0+IHtcbiAgICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9XG4gICAgICAgICAgICAgICAgICBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA1JSwgdmFyKC0tbmlnaHQtd2FybSkpXCI7XG4gICAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID1cbiAgICAgICAgICAgICAgICAgIFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMwJSwgdmFyKC0tYXNoLWRlZXApKVwiO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAyNixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wNWVtXCIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0LmdseXBoIHx8IFwiXHUyNUNCXCJ9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNyxcbiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMWVtXCIsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjMsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0Lm5hbWV9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwib3AtNzBcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt0LnNob3J0X2Rlc2NyaXB0aW9ufVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAge3QudHJhdW1hX2F3YXJlICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiA5LFxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTRlbVwiLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpblRvcDogXCJhdXRvXCIsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIFx1MDBCNyB0cmF1bWEtYXdhcmVcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAge3QuZXBoZW1lcmFsX2RlZmF1bHRfZGF5cyAmJiAoXG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IFwiYXV0b1wiLFxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBcdTAwQjcge3QuZXBoZW1lcmFsX2RlZmF1bHRfZGF5c30gam91cnNcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1tXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiLCBtYXJnaW5Ub3A6IDEyIH19PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLXRleHRcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uUGljayhudWxsKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICBib3JkZXJCb3R0b206IFwiMXB4IGRhc2hlZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgNTAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjEwcHggNHB4XCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIG91IGNyXHUwMEU5ZXIgdW4gY2VyY2xlIGxpYnJlIFx1MjE5MlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCJcbiAgICAgICAgICBvbkNsaWNrPXtvbkNhbmNlbH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgcGFkZGluZzogXCIxMHB4IDRweFwiLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBhbm51bGVyXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC8+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgQ3JlZXJDZXJjbGVTY3JlZW4gXHUyNTAwXHUyNTAwIHdpemFyZCA0IHN0ZXBzICh0ZW1wbGF0ZSBwaWNrZXIgKyBuYW1lICsgaW50ZW50aW9uICsgY29uZmlybSkgXHUyNTAwXG5jb25zdCBDcmVlckNlcmNsZVNjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgLy8gc3RlcCB2YWx1ZXM6ICdwaWNrJyB8IDAgfCAxIHwgMlxuICBjb25zdCBbc3RlcCwgc2V0U3RlcF0gPSB1Q1MoXCJwaWNrXCIpO1xuICBjb25zdCBbY2hvc2VuVGVtcGxhdGUsIHNldENob3NlblRlbXBsYXRlXSA9IHVDUyhudWxsKTsgLy8gc2x1ZyBvciBudWxsIChsaWJyZSlcbiAgY29uc3QgW3RlbXBsYXRlTWV0YSwgc2V0VGVtcGxhdGVNZXRhXSA9IHVDUyhudWxsKTsgICAgIC8vIGZ1bGwgdGVtcGxhdGUgcm93XG4gIGNvbnN0IFtuYW1lLCBzZXROYW1lXSA9IHVDUyhcIlwiKTtcbiAgY29uc3QgW2tpbmQsIHNldEtpbmRdID0gdUNTKFwic3BvbnRhbmVcIik7IC8vIHRvZ2dsZSBzcG9udGFuZSAvIGludGVudGlvbm5lbFxuICBjb25zdCBbaW50ZW50aW9uLCBzZXRJbnRlbnRpb25dID0gdUNTKFwiXCIpO1xuICBjb25zdCBbc3ViSW50ZW50cywgc2V0U3ViSW50ZW50c10gPSB1Q1MoW1wiXCIsIFwiXCIsIFwiXCJdKTtcbiAgY29uc3QgW2NyZWF0ZWRDaXJjbGUsIHNldENyZWF0ZWRDaXJjbGVdID0gdUNTKG51bGwpO1xuICBjb25zdCBbY3JlYXRpbmcsIHNldENyZWF0aW5nXSA9IHVDUyhmYWxzZSk7XG4gIGNvbnN0IFtjcmVhdGVFcnJvciwgc2V0Q3JlYXRlRXJyb3JdID0gdUNTKG51bGwpO1xuICBjb25zdCBbY29waWVkLCBzZXRDb3BpZWRdID0gdUNTKGZhbHNlKTtcbiAgLy8gQ2VyY2xlIFx1MDBFOXBoXHUwMEU5bVx1MDBFOHJlIChUMiBOaXZlYXUgMykgXHUyMDE0IG51bGwgPSBub24tXHUwMEU5cGhcdTAwRTltXHUwMEU4cmUgOyBzaW5vbiBub21icmUgZGUgam91cnNcbiAgY29uc3QgW2lzRXBoZW1lcmFsLCBzZXRJc0VwaGVtZXJhbF0gPSB1Q1MoZmFsc2UpO1xuICBjb25zdCBbZXBoZW1lcmFsRGF5cywgc2V0RXBoZW1lcmFsRGF5c10gPSB1Q1MoMjEpO1xuXG4gIC8vIENvbXB1dGUgc3RlcHMgOiBpZiBzcG9udGFuZSBcdTIxOTIgc3RlcCAwIChuYW1lK3R5cGUpIFx1MjE5MiBzdGVwIDIgKGNvbmZpcm0pXG4gIC8vICAgICAgICAgICAgICAgICBpZiBpbnRlbnRpb25uZWwgXHUyMTkyIHN0ZXAgMCBcdTIxOTIgc3RlcCAxIChpbnRlbnRpb24pIFx1MjE5MiBzdGVwIDJcbiAgY29uc3QgZ29OZXh0ID0gKCkgPT4ge1xuICAgIGlmIChzdGVwID09PSBcInBpY2tcIikgc2V0U3RlcCgwKTtcbiAgICBlbHNlIGlmIChzdGVwID09PSAwICYmIGtpbmQgPT09IFwic3BvbnRhbmVcIikgc2V0U3RlcCgyKTtcbiAgICBlbHNlIHNldFN0ZXAoc3RlcCArIDEpO1xuICB9O1xuICBjb25zdCBnb0JhY2sgPSAoKSA9PiB7XG4gICAgaWYgKHN0ZXAgPT09IDApIHNldFN0ZXAoXCJwaWNrXCIpO1xuICAgIGVsc2UgaWYgKHN0ZXAgPT09IDIgJiYga2luZCA9PT0gXCJzcG9udGFuZVwiKSBzZXRTdGVwKDApO1xuICAgIGVsc2UgaWYgKHR5cGVvZiBzdGVwID09PSBcIm51bWJlclwiICYmIHN0ZXAgPiAwKSBzZXRTdGVwKHN0ZXAgLSAxKTtcbiAgfTtcblxuICAvLyBQaWNrZXIgaGFuZGxlciA6IGNob29zZSB0ZW1wbGF0ZSBvciBcImxpYnJlXCJcbiAgY29uc3Qgb25QaWNrVGVtcGxhdGUgPSAodHBsKSA9PiB7XG4gICAgaWYgKCF0cGwpIHtcbiAgICAgIC8vIGNlcmNsZSBsaWJyZSA6IHJlc2V0IHRvIGZyZWUgd2l6YXJkXG4gICAgICBzZXRDaG9zZW5UZW1wbGF0ZShudWxsKTtcbiAgICAgIHNldFRlbXBsYXRlTWV0YShudWxsKTtcbiAgICAgIHNldFN0ZXAoMCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldENob3NlblRlbXBsYXRlKHRwbC5zbHVnKTtcbiAgICBzZXRUZW1wbGF0ZU1ldGEodHBsKTtcbiAgICAvLyBQcmUtZmlsbCBmcm9tIHRlbXBsYXRlXG4gICAgc2V0TmFtZSh0cGwubmFtZSB8fCBcIlwiKTtcbiAgICBzZXRLaW5kKHRwbC5kZWZhdWx0X2NpcmNsZV90eXBlIHx8IFwic3BvbnRhbmVcIik7XG4gICAgc2V0SW50ZW50aW9uKHRwbC5kZWZhdWx0X2ludGVudGlvbiB8fCBcIlwiKTtcbiAgICBjb25zdCBzdWJzID0gQXJyYXkuaXNBcnJheSh0cGwuZGVmYXVsdF9zdWJfaW50ZW50aW9ucykgPyB0cGwuZGVmYXVsdF9zdWJfaW50ZW50aW9ucyA6IFtdO1xuICAgIHNldFN1YkludGVudHMoW3N1YnNbMF0gfHwgXCJcIiwgc3Vic1sxXSB8fCBcIlwiLCBzdWJzWzJdIHx8IFwiXCJdKTtcbiAgICBzZXRTdGVwKDApO1xuICB9O1xuXG4gIC8vIENyZWF0ZSBvbiBlbnRlcmluZyBzdGVwIDJcbiAgdUNFKCgpID0+IHtcbiAgICBpZiAoc3RlcCAhPT0gMiB8fCBjcmVhdGVkQ2lyY2xlIHx8IGNyZWF0aW5nKSByZXR1cm47XG4gICAgc2V0Q3JlYXRpbmcodHJ1ZSk7XG4gICAgc2V0Q3JlYXRlRXJyb3IobnVsbCk7XG4gICAgY29uc3QgY2xlYW5lZFN1YnMgPSBzdWJJbnRlbnRzLm1hcCgocykgPT4gcy50cmltKCkpLmZpbHRlcihCb29sZWFuKS5zbGljZSgwLCAzKTtcblxuICAgIC8vIEJyYW5jaGUgdGVtcGxhdGUgdnMgbGlicmVcbiAgICBjb25zdCBwcm9taXNlID0gY2hvc2VuVGVtcGxhdGVcbiAgICAgID8gd2luZG93LkRyZWFtQVBJLmNyZWF0ZUNpcmNsZUZyb21UZW1wbGF0ZSh7XG4gICAgICAgICAgc2x1ZzogY2hvc2VuVGVtcGxhdGUsXG4gICAgICAgICAgY3VzdG9tTmFtZTogbmFtZS50cmltKCksXG4gICAgICAgICAgY3VzdG9tSW50ZW50aW9uOiBraW5kID09PSBcImludGVudGlvbm5lbFwiID8gaW50ZW50aW9uLnRyaW0oKSA6IG51bGwsXG4gICAgICAgICAgY3VzdG9tU3ViSW50ZW50aW9uczoga2luZCA9PT0gXCJpbnRlbnRpb25uZWxcIiA/IGNsZWFuZWRTdWJzIDogW10sXG4gICAgICAgIH0pXG4gICAgICA6IHdpbmRvdy5EcmVhbUFQSS5jcmVhdGVDaXJjbGUoe1xuICAgICAgICAgIG5hbWU6IG5hbWUudHJpbSgpLFxuICAgICAgICAgIHR5cGU6IGtpbmQsXG4gICAgICAgICAgaW50ZW50aW9uX3RleHQ6IGtpbmQgPT09IFwiaW50ZW50aW9ubmVsXCIgPyBpbnRlbnRpb24udHJpbSgpIDogbnVsbCxcbiAgICAgICAgICBzdWJfaW50ZW50aW9uczoga2luZCA9PT0gXCJpbnRlbnRpb25uZWxcIiA/IGNsZWFuZWRTdWJzIDogW10sXG4gICAgICAgICAgbWF4TWVtYmVyczogOCxcbiAgICAgICAgICBmcmVxdWVuY3k6IGtpbmQgPT09IFwic3BvbnRhbmVcIiA/IFwiZnJlZWZvcm1cIiA6IFwid2Vla2x5XCIsXG4gICAgICAgICAgZXBoZW1lcmFsX2RheXM6IGlzRXBoZW1lcmFsID8gZXBoZW1lcmFsRGF5cyA6IG51bGwsXG4gICAgICAgIH0pO1xuXG4gICAgcHJvbWlzZVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAocmVzdWx0Py5jaXJjbGU/Lmludml0ZV9jb2RlKSB7XG4gICAgICAgICAgc2V0Q3JlYXRlZENpcmNsZShyZXN1bHQuY2lyY2xlKTtcbiAgICAgICAgfSBlbHNlIGlmIChyZXN1bHQ/Ll9zZWVkKSB7XG4gICAgICAgICAgc2V0Q3JlYXRlRXJyb3IoXCJjclx1MDBFOWF0aW9uIGxvY2FsZSAobW9kZSBkXHUwMEU5bW8sIHNhbnMgYmFja2VuZClcIik7XG4gICAgICAgICAgc2V0Q3JlYXRlZENpcmNsZSh7XG4gICAgICAgICAgICBpZDogXCJsb2NhbC1cIiArIERhdGUubm93KCksXG4gICAgICAgICAgICBuYW1lOiBuYW1lLnRyaW0oKSxcbiAgICAgICAgICAgIGludml0ZV9jb2RlOiBcIkRFTU9cIiArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDYpLnRvVXBwZXJDYXNlKCksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0Q3JlYXRlRXJyb3IocmVzdWx0Py5lcnJvciB8fCBcImxhIGNyXHUwMEU5YXRpb24gbidhIHBhcyBhYm91dGlcIik7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGUpID0+IHNldENyZWF0ZUVycm9yKGUubWVzc2FnZSkpXG4gICAgICAuZmluYWxseSgoKSA9PiBzZXRDcmVhdGluZyhmYWxzZSkpO1xuICB9LCBbc3RlcF0pO1xuXG4gIGNvbnN0IGludml0ZVVybCA9IGNyZWF0ZWRDaXJjbGU/Lmludml0ZV9jb2RlXG4gICAgPyBgJHtsb2NhdGlvbi5vcmlnaW59L3YxMi9pbmRleC5odG1sI3Jlam9pbmRyZT9jb2RlPSR7Y3JlYXRlZENpcmNsZS5pbnZpdGVfY29kZX1gXG4gICAgOiBcIlwiO1xuXG4gIGNvbnN0IGRvQ29weSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWludml0ZVVybCkgcmV0dXJuO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkPy53cml0ZVRleHQoaW52aXRlVXJsKTtcbiAgICAgIHNldENvcGllZCh0cnVlKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0Q29waWVkKGZhbHNlKSwgMjAwMCk7XG4gICAgfSBjYXRjaCB7fVxuICB9O1xuXG4gIGNvbnN0IGRvU2hhcmUgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFpbnZpdGVVcmwpIHJldHVybjtcbiAgICBpZiAobmF2aWdhdG9yLnNoYXJlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBuYXZpZ2F0b3Iuc2hhcmUoe1xuICAgICAgICAgIHRpdGxlOiBuYW1lICsgXCIgXHUwMEI3IERyZWFtXCIsXG4gICAgICAgICAgdGV4dDogXCJyZWpvaW5zIGxlIGNlcmNsZSBcdTAwQUIgXCIgKyBuYW1lICsgXCIgXHUwMEJCIGRhbnMgRHJlYW1cIixcbiAgICAgICAgICB1cmw6IGludml0ZVVybCxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvQ29weSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LWZsb29yKVwiLFxuICAgICAgICAvLyBWYW4gR2VubmVwIHRyYW5zaXRpb24gYmV0d2VlbiBzdGVwc1xuICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCB2YXIoLS10ZW1wby10aXNzZSwgMzgwbXMpIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IChzdGVwICE9PSBcInBpY2tcIiA/IGdvQmFjaygpIDogZ28oXCJjZXJjbGVcIikpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgbWF4V2lkdGg6IHN0ZXAgPT09IFwicGlja1wiID8gNzYwIDogNTYwIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPVwibWV0YS1tb25vIG1iLXNcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTRlbVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge3N0ZXAgPT09IFwicGlja1wiXG4gICAgICAgICAgICA/IFwiY3JcdTAwRTllciB1biBjZXJjbGUgXHUwMEI3IGNob2lzaXIgdW4gcG9pbnQgZGUgZFx1MDBFOXBhcnRcIlxuICAgICAgICAgICAgOiBcImNyXHUwMEU5ZXIgdW4gY2VyY2xlIFx1MDBCNyBcdTAwRTl0YXBlIFwiICtcbiAgICAgICAgICAgICAgKHN0ZXAgPT09IDAgPyAxIDogc3RlcCA9PT0gMSA/IDIgOiAzKSArXG4gICAgICAgICAgICAgIFwiL1wiICtcbiAgICAgICAgICAgICAgKGtpbmQgPT09IFwiaW50ZW50aW9ubmVsXCIgPyAzIDogMil9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHsvKiBQSUNLIFx1MjAxNCB0ZW1wbGF0ZSBwaWNrZXIgKDcgdGVtcGxhdGVzICsgY2VyY2xlIGxpYnJlKSAqL31cbiAgICAgICAge3N0ZXAgPT09IFwicGlja1wiICYmIChcbiAgICAgICAgICA8Q2VyY2xlVGVtcGxhdGVQaWNrZXIgb25QaWNrPXtvblBpY2tUZW1wbGF0ZX0gb25DYW5jZWw9eygpID0+IGdvKFwiY2VyY2xlXCIpfSAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHsvKiBTVEVQIDAgXHUyMDE0IG5vbSArIHR5cGUgKi99XG4gICAgICAgIHtzdGVwID09PSAwICYmIChcbiAgICAgICAgICA8Q3JlZXJTdGVwT25lXG4gICAgICAgICAgICBuYW1lPXtuYW1lfVxuICAgICAgICAgICAgc2V0TmFtZT17c2V0TmFtZX1cbiAgICAgICAgICAgIGtpbmQ9e2tpbmR9XG4gICAgICAgICAgICBzZXRLaW5kPXtzZXRLaW5kfVxuICAgICAgICAgICAgaXNFcGhlbWVyYWw9e2lzRXBoZW1lcmFsfVxuICAgICAgICAgICAgc2V0SXNFcGhlbWVyYWw9e3NldElzRXBoZW1lcmFsfVxuICAgICAgICAgICAgZXBoZW1lcmFsRGF5cz17ZXBoZW1lcmFsRGF5c31cbiAgICAgICAgICAgIHNldEVwaGVtZXJhbERheXM9e3NldEVwaGVtZXJhbERheXN9XG4gICAgICAgICAgICBvbk5leHQ9e2dvTmV4dH1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBnbyhcImNlcmNsZVwiKX1cbiAgICAgICAgICAgIHRlbXBsYXRlTWV0YT17dGVtcGxhdGVNZXRhfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFNURVAgMSBcdTIwMTQgaW50ZW50aW9uIChpbnRlbnRpb25uZWwgdW5pcXVlbWVudCkgKi99XG4gICAgICAgIHtzdGVwID09PSAxICYmIChcbiAgICAgICAgICA8Q3JlZXJTdGVwSW50ZW50aW9uXG4gICAgICAgICAgICBpbnRlbnRpb249e2ludGVudGlvbn1cbiAgICAgICAgICAgIHNldEludGVudGlvbj17c2V0SW50ZW50aW9ufVxuICAgICAgICAgICAgc3ViSW50ZW50cz17c3ViSW50ZW50c31cbiAgICAgICAgICAgIHNldFN1YkludGVudHM9e3NldFN1YkludGVudHN9XG4gICAgICAgICAgICBvbk5leHQ9e2dvTmV4dH1cbiAgICAgICAgICAgIG9uQmFjaz17Z29CYWNrfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIFNURVAgMiBcdTIwMTQgY29uZmlybSArIGludml0ZSBsaW5rICovfVxuICAgICAgICB7c3RlcCA9PT0gMiAmJiAoXG4gICAgICAgICAgPENyZWVyU3RlcENvbmZpcm1cbiAgICAgICAgICAgIG5hbWU9e25hbWV9XG4gICAgICAgICAgICBraW5kPXtraW5kfVxuICAgICAgICAgICAgaW50ZW50aW9uPXtpbnRlbnRpb259XG4gICAgICAgICAgICBjcmVhdGluZz17Y3JlYXRpbmd9XG4gICAgICAgICAgICBjcmVhdGVFcnJvcj17Y3JlYXRlRXJyb3J9XG4gICAgICAgICAgICBjcmVhdGVkQ2lyY2xlPXtjcmVhdGVkQ2lyY2xlfVxuICAgICAgICAgICAgaW52aXRlVXJsPXtpbnZpdGVVcmx9XG4gICAgICAgICAgICBjb3BpZWQ9e2NvcGllZH1cbiAgICAgICAgICAgIGRvQ29weT17ZG9Db3B5fVxuICAgICAgICAgICAgZG9TaGFyZT17ZG9TaGFyZX1cbiAgICAgICAgICAgIG9uRW50ZXI9eygpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGNyZWF0ZWRDaXJjbGU/LmlkKSBnbyhcImNlcmNsZS1kZXRhaWxcIiwgY3JlYXRlZENpcmNsZS5pZCk7XG4gICAgICAgICAgICAgIGVsc2UgZ28oXCJjZXJjbGVcIik7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IENyZWVyU3RlcE9uZSA9ICh7XG4gIG5hbWUsXG4gIHNldE5hbWUsXG4gIGtpbmQsXG4gIHNldEtpbmQsXG4gIGlzRXBoZW1lcmFsLFxuICBzZXRJc0VwaGVtZXJhbCxcbiAgZXBoZW1lcmFsRGF5cyxcbiAgc2V0RXBoZW1lcmFsRGF5cyxcbiAgb25OZXh0LFxuICBvbkNhbmNlbCxcbiAgdGVtcGxhdGVNZXRhLFxufSkgPT4gKFxuICA8PlxuICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbCBtYi1sXCI+Y29tbWVudCB2b3VkcmFpcy10dSBsJ2FwcGVsZXIgPzwvaDE+XG4gICAge3RlbXBsYXRlTWV0YSAmJiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1tXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xNGVtXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgb3BhY2l0eTogMC44NSxcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgZFx1MDBFOXBhcnQmbmJzcDs6IHt0ZW1wbGF0ZU1ldGEuZ2x5cGggfHwgXCJcdTI1Q0JcIn0ge3RlbXBsYXRlTWV0YS5uYW1lfVxuICAgICAgPC9kaXY+XG4gICAgKX1cbiAgICA8cCBjbGFzc05hbWU9XCJib2R5IG9wLTcwIG1iLW1cIiBzdHlsZT17eyBtYXhXaWR0aDogNDgwIH19PlxuICAgICAgdW4gbm9tIHF1aSBkXHUwMEU5Y3JpdCBjZSBxdWUgY2UgY2VyY2xlIHRpZW50LlxuICAgIDwvcD5cbiAgICA8aW5wdXRcbiAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IG1iLXhsXCJcbiAgICAgIHBsYWNlaG9sZGVyPVwibGEgZm9yXHUwMEVBdCB0ZW51ZSwgbGVzIHZlaWxsZXVzZXMgZGUgbWFycywgbCdcdTAwRTlxdWlwZSB0cmFuc2l0aW9uXHUyMDI2XCJcbiAgICAgIHZhbHVlPXtuYW1lfVxuICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXROYW1lKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgIGF1dG9Gb2N1c1xuICAgIC8+XG5cbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItbVwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICBxdWVsIHR5cGUgZGUgY2VyY2xlXG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1zIG1iLXhsXCI+XG4gICAgICB7W1xuICAgICAgICBbXG4gICAgICAgICAgXCJzcG9udGFuZVwiLFxuICAgICAgICAgIFwic3BvbnRhblx1MDBFOVwiLFxuICAgICAgICAgIFwiZmFtaWxsZSwgYW1pcywgY29sbFx1MDBFOGd1ZXMuIG9uIHBhcnRhZ2UgbGVzIHJcdTAwRUF2ZXMgcG91ciBsJ2ludGltaXRcdTAwRTkuIHpcdTAwRTlybyBwcm90b2NvbGUuXCIsXG4gICAgICAgIF0sXG4gICAgICAgIFtcbiAgICAgICAgICBcImludGVudGlvbm5lbFwiLFxuICAgICAgICAgIFwiaW50ZW50aW9ubmVsXCIsXG4gICAgICAgICAgXCJPTkcsIGFzc28sIGVudHJlcHJpc2UsIGNvbGxlY3RpZi4gb24gdGllbnQgZW5zZW1ibGUgdW5lIGludGVudGlvbiBwYXJ0YWdcdTAwRTllLlwiLFxuICAgICAgICBdLFxuICAgICAgXS5tYXAoKFtrLCBsYmwsIGRlc2NdKSA9PiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBrZXk9e2t9XG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0S2luZChrKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSB2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICBib3JkZXI6XG4gICAgICAgICAgICAgIFwiMXB4IHNvbGlkIFwiICtcbiAgICAgICAgICAgICAgKGtpbmQgPT09IGtcbiAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMwJSwgdmFyKC0tYXNoLWRlZXApKVwiXG4gICAgICAgICAgICAgICAgOiBcInZhcigtLWFzaC1kZWVwKVwiKSxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6XG4gICAgICAgICAgICAgIGtpbmQgPT09IGtcbiAgICAgICAgICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDUlLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgICAgIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTcsXG4gICAgICAgICAgICAgIGNvbG9yOiBraW5kID09PSBrID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCIgOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogNCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bGJsfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGFcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNSxcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge2Rlc2N9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKSl9XG4gICAgPC9kaXY+XG5cbiAgICB7LyogQ2VyY2xlIFx1MDBFOXBoXHUwMEU5bVx1MDBFOHJlIDIxaiAoVDIgTml2ZWF1IDMpIFx1MjAxNCBkaXNjcmV0LCBzb2JyZSAqL31cbiAgICA8ZGl2XG4gICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItbVwiXG4gICAgICBzdHlsZT17e1xuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICBjZSBjZXJjbGUgZXN0LWlsIFx1MDBFOXBoXHUwMEU5bVx1MDBFOHJlID9cbiAgICA8L2Rpdj5cblxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cImNhcmQgbWIteGxcIlxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTMpIHZhcigtLXMtNClcIixcbiAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBcIiArIChpc0VwaGVtZXJhbFxuICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjQlLCB2YXIoLS1hc2gtZGVlcCkpXCJcbiAgICAgICAgICA6IFwidmFyKC0tYXNoLWRlZXApXCIpLFxuICAgICAgICBiYWNrZ3JvdW5kOiBpc0VwaGVtZXJhbFxuICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNCUsIHRyYW5zcGFyZW50KVwiXG4gICAgICAgICAgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICA8bGFiZWxcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIixcbiAgICAgICAgICBhbGlnbkl0ZW1zOiBcImZsZXgtc3RhcnRcIixcbiAgICAgICAgICBnYXA6IDEyLFxuICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHR5cGU9XCJjaGVja2JveFwiXG4gICAgICAgICAgY2hlY2tlZD17ISFpc0VwaGVtZXJhbH1cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldElzRXBoZW1lcmFsKGUudGFyZ2V0LmNoZWNrZWQpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Ub3A6IDQsXG4gICAgICAgICAgICBhY2NlbnRDb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmbGV4OiAxIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxuICAgICAgICAgICAgICBjb2xvcjogaXNFcGhlbWVyYWwgPyBcInZhcigtLXNpbGstZ29sZClcIiA6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA0LFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBjZSBjZXJjbGUgc2UgcmVmZXJtZSB0b3V0IHNldWxcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhXCJcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHVuZSB0cmF2ZXJzXHUwMEU5ZSBjb21tdW5lIGF2ZWMgdW5lIGZpbiBpbnNjcml0ZSBkXHUwMEU4cyBsZSBkXHUwMEU5cGFydC4gYXUgam91ciBKLFxuICAgICAgICAgICAgdW5lIGxlY3R1cmUgZmluYWxlIGVzdCB0aXNzXHUwMEU5ZSBldCBsZSBjZXJjbGUgcydhcmNoaXZlLlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGFiZWw+XG5cbiAgICAgIHtpc0VwaGVtZXJhbCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtbVwiIHN0eWxlPXt7IHBhZGRpbmdMZWZ0OiAyOCB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBkdXJcdTAwRTllICZuYnNwO1x1MDBCNyZuYnNwOyA8c3BhbiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIgfX0+e2VwaGVtZXJhbERheXN9IGpvdXJzPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1zXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiLCBtYXJnaW5Cb3R0b206IDEwIH19PlxuICAgICAgICAgICAge1s3LCAxNCwgMjEsIDMwLCA2MF0ubWFwKChkKSA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBrZXk9e2R9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0RXBoZW1lcmFsRGF5cyhkKX1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDpcbiAgICAgICAgICAgICAgICAgICAgZXBoZW1lcmFsRGF5cyA9PT0gZFxuICAgICAgICAgICAgICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTIlLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgIDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOlxuICAgICAgICAgICAgICAgICAgICBcIjFweCBzb2xpZCBcIiArXG4gICAgICAgICAgICAgICAgICAgIChlcGhlbWVyYWxEYXlzID09PSBkXG4gICAgICAgICAgICAgICAgICAgICAgPyBcInZhcigtLXNpbGstZ29sZClcIlxuICAgICAgICAgICAgICAgICAgICAgIDogXCJ2YXIoLS1hc2gtZGVlcClcIiksXG4gICAgICAgICAgICAgICAgICBjb2xvcjpcbiAgICAgICAgICAgICAgICAgICAgZXBoZW1lcmFsRGF5cyA9PT0gZFxuICAgICAgICAgICAgICAgICAgICAgID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCJcbiAgICAgICAgICAgICAgICAgICAgICA6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgICAgcGFkZGluZzogXCI2cHggMTRweFwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAyODBtcyBlYXNlXCIsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHtkfWpcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXG4gICAgICAgICAgICBtaW49ezF9XG4gICAgICAgICAgICBtYXg9ezkwfVxuICAgICAgICAgICAgdmFsdWU9e2VwaGVtZXJhbERheXN9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEVwaGVtZXJhbERheXMoTnVtYmVyKGUudGFyZ2V0LnZhbHVlKSl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgIGFjY2VudENvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICB7ZXBoZW1lcmFsRGF5cyA9PT0gMjEgJiYgKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG10LXNcIlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41LFxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAyMSBqb3VycyBcdTAwQjcgdHJvaXMgc2VtYWluZXMsIHVuIGN5Y2xlIGRlIHRyYXZlcnNcdTAwRTllIChFc3RcdTAwRTlzLCBWYXNhbGlzYSkuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtvbkNhbmNlbH0+XG4gICAgICAgIGFubnVsZXJcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICBkaXNhYmxlZD17IW5hbWUudHJpbSgpIHx8ICFraW5kfVxuICAgICAgICBvbkNsaWNrPXtvbk5leHR9XG4gICAgICA+XG4gICAgICAgIGNvbnRpbnVlclxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvPlxuKTtcblxuY29uc3QgQ3JlZXJTdGVwSW50ZW50aW9uID0gKHtcbiAgaW50ZW50aW9uLFxuICBzZXRJbnRlbnRpb24sXG4gIHN1YkludGVudHMsXG4gIHNldFN1YkludGVudHMsXG4gIG9uTmV4dCxcbiAgb25CYWNrLFxufSkgPT4gKFxuICA8PlxuICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbCBtYi1sXCI+cXVlbGxlIGludGVudGlvbiB0ZW5lei12b3VzIGVuc2VtYmxlID88L2gxPlxuICAgIDxwIGNsYXNzTmFtZT1cImJvZHkgb3AtNzAgbWItbFwiIHN0eWxlPXt7IG1heFdpZHRoOiA0ODAgfX0+XG4gICAgICB1bmUgcGhyYXNlLiBwYXMgdW4gb2JqZWN0aWYgXHUyMDE0IHVuZSBvcmllbnRhdGlvbi5cbiAgICA8L3A+XG4gICAgPHRleHRhcmVhXG4gICAgICBjbGFzc05hbWU9XCJmaWVsZC10ZXh0YXJlYSBtYi1sXCJcbiAgICAgIHBsYWNlaG9sZGVyPVwidHJhdmVyc2VyIG5vcyB0cmFuc2l0aW9ucyBwcm9mZXNzaW9ubmVsbGVzLCBzYW5zIGNvbnNlaWxzLiB0ZW5pciBjZSBwcm9qZXQgcG9saXRpcXVlIGR1IHJlZ2FyZCBkZSBub3Mgclx1MDBFQXZlcy4gXHUwMEU5Y291dGVyIGNlIHF1ZSBsYSBjb21tdW5hdXRcdTAwRTkgcG9ydGUuXCJcbiAgICAgIHZhbHVlPXtpbnRlbnRpb259XG4gICAgICBvbkNoYW5nZT17KGUpID0+IHNldEludGVudGlvbihlLnRhcmdldC52YWx1ZSl9XG4gICAgICByb3dzPXszfVxuICAgICAgYXV0b0ZvY3VzXG4gICAgLz5cblxuICAgIDxkaXZcbiAgICAgIGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1zXCJcbiAgICAgIHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIixcbiAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTRlbVwiLFxuICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICB9fVxuICAgID5cbiAgICAgIHNvdXMtaW50ZW50aW9ucyAoanVzcXUnXHUwMEUwIDMsIG9wdGlvbm5lbClcbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1zIG1iLXhsXCI+XG4gICAgICB7c3ViSW50ZW50cy5tYXAoKHMsIGkpID0+IChcbiAgICAgICAgPGlucHV0XG4gICAgICAgICAga2V5PXtpfVxuICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj17YHNvdXMtaW50ZW50aW9uICR7aSArIDF9XHUyMDI2YH1cbiAgICAgICAgICB2YWx1ZT17c31cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5leHQgPSBbLi4uc3ViSW50ZW50c107XG4gICAgICAgICAgICBuZXh0W2ldID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBzZXRTdWJJbnRlbnRzKG5leHQpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiIH19PlxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9e29uQmFja30+XG4gICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICBkaXNhYmxlZD17IWludGVudGlvbi50cmltKCl9XG4gICAgICAgIG9uQ2xpY2s9e29uTmV4dH1cbiAgICAgID5cbiAgICAgICAgY29udGludWVyXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC8+XG4pO1xuXG5jb25zdCBDcmVlclN0ZXBDb25maXJtID0gKHtcbiAgbmFtZSxcbiAga2luZCxcbiAgaW50ZW50aW9uLFxuICBjcmVhdGluZyxcbiAgY3JlYXRlRXJyb3IsXG4gIGNyZWF0ZWRDaXJjbGUsXG4gIGludml0ZVVybCxcbiAgY29waWVkLFxuICBkb0NvcHksXG4gIGRvU2hhcmUsXG4gIG9uRW50ZXIsXG59KSA9PiB7XG4gIGlmIChjcmVhdGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCIgc3R5bGU9e3sgcGFkZGluZ1RvcDogXCJ2YXIoLS1zLTYpXCIgfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnJlYXRoIG1iLXhsXCIgLz5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgIGxlIGNlcmNsZSBzZSBmb3JtZS5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIGlmICghY3JlYXRlZENpcmNsZSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1tXCI+XG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbCBtYi1tXCI+bGEgY3JcdTAwRTlhdGlvbiBuJ2EgcGFzIHB1IHNlIGZhaXJlPC9oMT5cbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiB9fT5cbiAgICAgICAgICB7Y3JlYXRlRXJyb3IgfHwgXCJ2XHUwMEU5cmlmaWUgdGEgY29ubmV4aW9uIGV0IHJcdTAwRTllc3NhaWUuXCJ9XG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8aDEgY2xhc3NOYW1lPVwiaDEtc2V1aWwgbWItbVwiPmxlIGNlcmNsZSBlc3Qgb3V2ZXJ0LjwvaDE+XG4gICAgICA8cFxuICAgICAgICBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWMgbWItbFwiXG4gICAgICAgIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgbWF4V2lkdGg6IDQ4MCB9fVxuICAgICAgPlxuICAgICAgICB2b2ljaSBsZSBsaWVuIGQnaW52aXRhdGlvbi4gcGFydGFnZS1sZSBhdXggcGVyc29ubmVzIHF1ZSB0dSB2ZXV4IHZvaXIgdGVuaXIgY2UgY2VyY2xlIGF2ZWMgdG9pLlxuICAgICAgPC9wPlxuXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cImNhcmQgbWItbFwiXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgYmFja2dyb3VuZDpcbiAgICAgICAgICAgIFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zdG9uZS1jb29sKSA1JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICAgIGJvcmRlcjpcbiAgICAgICAgICAgIFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIixcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xNGVtXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBjb2RlIFx1MDBCNyB7Y3JlYXRlZENpcmNsZS5pbnZpdGVfY29kZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDEyLjUsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgd29yZEJyZWFrOiBcImJyZWFrLWFsbFwiLFxuICAgICAgICAgICAgbGluZUhlaWdodDogMS41LFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7aW52aXRlVXJsfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtbSBtYi14bFwiIHN0eWxlPXt7IGZsZXhXcmFwOiBcIndyYXBcIiB9fT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXtkb0NvcHl9PlxuICAgICAgICAgIHtjb3BpZWQgPyBcImNvcGlcdTAwRTkgXHUwMEI3XCIgOiBcImNvcGllciBsZSBsaWVuXCJ9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17ZG9TaGFyZX0+XG4gICAgICAgICAgcGFydGFnZXJcdTIwMjZcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHBcbiAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtYi1sXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICBtYXhXaWR0aDogNDYwLFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB1biBjZXJjbGUgXHUwMEUwIHVuZSBwZXJzb25uZSByZXN0ZSB1biBjZXJjbGUuIGludml0ZSBcdTAwRTAgdG9uIHJ5dGhtZS5cbiAgICAgIDwvcD5cblxuICAgICAge2NyZWF0ZUVycm9yICYmIChcbiAgICAgICAgPHBcbiAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG1iLW1cIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICB9fVxuICAgICAgICA+XG4gICAgICAgICAge2NyZWF0ZUVycm9yfVxuICAgICAgICA8L3A+XG4gICAgICApfVxuXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9e29uRW50ZXJ9PlxuICAgICAgICBlbnRyZXIgZGFucyBsZSBjZXJjbGVcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvPlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIFJlam9pbmRyZVNjcmVlbiBcdTI1MDBcdTI1MDAgcGFyc2UgY29kZSBkZXB1aXMgVVJMIE9VIHNhaXNpZSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IFJlam9pbmRyZVNjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW2NvZGUsIHNldENvZGVdID0gdUNTKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaGFzaCA9IGxvY2F0aW9uLmhhc2ggfHwgXCJcIjtcbiAgICAgIGNvbnN0IG0gPSBoYXNoLm1hdGNoKC9bPyZdY29kZT0oW0EtWmEtejAtOV0rKS8pO1xuICAgICAgcmV0dXJuIG0gPyBtWzFdLnRvVXBwZXJDYXNlKCkgOiBcIlwiO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9KTtcbiAgY29uc3QgW2pvaW5pbmcsIHNldEpvaW5pbmddID0gdUNTKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSB1Q1MobnVsbCk7XG4gIGNvbnN0IFtzdWNjZXNzLCBzZXRTdWNjZXNzXSA9IHVDUyhudWxsKTsgLy8gam9pbmVkIGNpcmNsZSBvYmplY3RcblxuICBjb25zdCBkb0pvaW4gPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFjb2RlLnRyaW0oKSkge1xuICAgICAgc2V0RXJyb3IoXCJlbnRyZSB1biBjb2RlIFx1MDBFMCA2IGNhcmFjdFx1MDBFOHJlc1wiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0Sm9pbmluZyh0cnVlKTtcbiAgICBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgd2luZG93LkRyZWFtQVBJLmpvaW5DaXJjbGUoe1xuICAgICAgICBpbnZpdGVDb2RlOiBjb2RlLnRyaW0oKS50b1VwcGVyQ2FzZSgpLFxuICAgICAgfSk7XG4gICAgICBpZiAocmVzdWx0Py5lcnJvcikge1xuICAgICAgICBzZXRFcnJvcihwcmV0dGlmeUVycm9yKHJlc3VsdC5lcnJvcikpO1xuICAgICAgfSBlbHNlIGlmIChyZXN1bHQ/LmNpcmNsZSkge1xuICAgICAgICBzZXRTdWNjZXNzKHJlc3VsdC5jaXJjbGUpO1xuICAgICAgICAvLyBOYXZpZ2F0ZSB0byBkZXRhaWwgYWZ0ZXIgYSBiZWF0XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZ28oXCJjZXJjbGUtZGV0YWlsXCIsIHJlc3VsdC5jaXJjbGUuaWQpLCAxMjAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldEVycm9yKFwicmVqb2luZHJlIG4nYSBwYXMgYWJvdXRpLiByZWNvbW1lbmNlIGRhbnMgdW4gaW5zdGFudC5cIik7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IocHJldHRpZnlFcnJvcihlLm1lc3NhZ2UpKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0Sm9pbmluZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIGlmIChzdWNjZXNzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCIgc3R5bGU9e3sgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIiB9fT5cbiAgICAgICAgPHdpbmRvdy5Ub3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImNlcmNsZVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lIHRleHQtY2VudGVyXCIgc3R5bGU9e3sgcGFkZGluZ1RvcDogXCJ2YXIoLS1zLTcpXCIgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJicmVhdGggbWIteGxcIiAvPlxuICAgICAgICAgIDxwXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIlxuICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgZm9udFNpemU6IDE4LCBtYXhXaWR0aDogMzgwLCBtYXJnaW46IFwiMCBhdXRvXCIgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICBsZSBjZXJjbGUgXHUwMEFCIHtzdWNjZXNzLm5hbWV9IFx1MDBCQiB0ZSB0aWVudCBtYWludGVuYW50LlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIgfX0+XG4gICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiY2VyY2xlXCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgbWF4V2lkdGg6IDQ4MCB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1zXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHJlam9pbmRyZSB1biBjZXJjbGVcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJoMS1zZXVpbCBtYi1sXCI+dHUgYXMgcmVcdTAwRTd1IHVuIGNvZGUgPzwvaDE+XG4gICAgICAgIDxwXG4gICAgICAgICAgY2xhc3NOYW1lPVwiYm9keSBvcC03MCBtYi1sXCJcbiAgICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogNDYwIH19XG4gICAgICAgID5cbiAgICAgICAgICBlbnRyZSBsZXMgc2l4IGNhcmFjdFx1MDBFOHJlcyBxdWUgbGEgcGVyc29ubmUgcXVpIHRpZW50IGNlIGNlcmNsZSB0J2EgdHJhbnNtaXMuXG4gICAgICAgIDwvcD5cblxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBtYi1sXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cIkFCQzEyM1wiXG4gICAgICAgICAgdmFsdWU9e2NvZGV9XG4gICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB7XG4gICAgICAgICAgICBzZXRDb2RlKGUudGFyZ2V0LnZhbHVlLnRvVXBwZXJDYXNlKCkucmVwbGFjZSgvW15BLVowLTldL2csIFwiXCIpLnNsaWNlKDAsIDgpKTtcbiAgICAgICAgICAgIHNldEVycm9yKG51bGwpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgYXV0b0ZvY3VzXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIixcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4xOGVtXCIsXG4gICAgICAgICAgICBmb250U2l6ZTogMTgsXG4gICAgICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cblxuICAgICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgbWItbVwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtlcnJvcn1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtbVwiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gZ28oXCJjZXJjbGVcIil9PlxuICAgICAgICAgICAgcGFzIGNldHRlIGZvaXNcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2pvaW5pbmcgfHwgIWNvZGUudHJpbSgpfVxuICAgICAgICAgICAgb25DbGljaz17ZG9Kb2lufVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtqb2luaW5nID8gXCJyZWpvaW5kcmVcdTIwMjZcIiA6IFwicmVqb2luZHJlXCJ9XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxwXG4gICAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtdC14bFwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICBtYXhXaWR0aDogNDYwLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBlbiByZWpvaWduYW50LCB0dSBjaG9pc2lyYXMgXHUwMEUwIGNoYXF1ZSBrYWlyb3MgcydpbCByZXN0ZSBwcml2XHUwMEU5LCBhbGltZW50ZSBsYSBsZWN0dXJlIGR1IGNlcmNsZSwgb3UgZXN0IHBhcnRhZ1x1MDBFOSBlbiBjbGFpci5cbiAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBQcmV0dHkgZXJyb3IgbWFwcGluZ1xuZnVuY3Rpb24gcHJldHRpZnlFcnJvcihtc2cpIHtcbiAgaWYgKCFtc2cpIHJldHVybiBcInJlam9pbmRyZSBuJ2EgcGFzIGFib3V0aS5cIjtcbiAgY29uc3QgbSA9IFN0cmluZyhtc2cpLnRvTG93ZXJDYXNlKCk7XG4gIGlmIChtLmluY2x1ZGVzKFwibm9uIHRyb3V2XHUwMEU5XCIpIHx8IG0uaW5jbHVkZXMoXCJub3QgZm91bmRcIikgfHwgbS5pbmNsdWRlcyhcIjQwNFwiKSkge1xuICAgIHJldHVybiBcImNlIGNvZGUgbmUgbVx1MDBFOG5lIFx1MDBFMCBhdWN1biBjZXJjbGUuIHZcdTAwRTlyaWZpZSBxdSdpbCBlc3QgZXhhY3QuXCI7XG4gIH1cbiAgaWYgKG0uaW5jbHVkZXMoXCJkXHUwMEU5alx1MDBFMCBtZW1icmVcIikgfHwgbS5pbmNsdWRlcyhcImFscmVhZHlcIikpIHtcbiAgICByZXR1cm4gXCJ0dSB0aWVucyBkXHUwMEU5alx1MDBFMCBjZSBjZXJjbGUuXCI7XG4gIH1cbiAgaWYgKG0uaW5jbHVkZXMoXCJjb21wbGV0XCIpIHx8IG0uaW5jbHVkZXMoXCJmdWxsXCIpKSB7XG4gICAgcmV0dXJuIFwiY2UgY2VyY2xlIGVzdCBjb21wbGV0IHBvdXIgbGUgbW9tZW50LlwiO1xuICB9XG4gIGlmIChtLmluY2x1ZGVzKFwiYXV0aFwiKSB8fCBtLmluY2x1ZGVzKFwiNDAxXCIpKSB7XG4gICAgcmV0dXJuIFwidHUgZG9pcyB0ZSBjb25uZWN0ZXIgYXZhbnQgZGUgcmVqb2luZHJlLlwiO1xuICB9XG4gIHJldHVybiBtc2c7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBQYXJ0YWdlclJldmVTY3JlZW4gKGxlZ2FjeSBWMSwgY29uc2Vydlx1MDBFOSBwb3VyIGNvbXBhdCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOT1RFIDIwMjYtMDQtMjUgXHUyMDE0IGwnb3B0LWluIDMtbW9kZXMgcGFyIGthaXJvcyB2aXQgbWFpbnRlbmFudCBkYW5zIENlcmNsZURldGFpbC5cbi8vIENlIGZsb3cgcmVzdGUgYWNjZXNzaWJsZSB2aWEgcm91dGVzIGFuY2llbm5lcyBtYWlzIG4nZXN0IHBsdXMgbGUgZ2VzdGUgcHJpbWFpcmUuXG5jb25zdCBQYXJ0YWdlclJldmVTY3JlZW4gPSAoeyBnbyB9KSA9PiB7XG4gIGNvbnN0IFtzdGVwLCBzZXRTdGVwXSA9IHVDUygwKTtcbiAgY29uc3QgW3NlbGVjdGVkSWQsIHNldFNlbGVjdGVkSWRdID0gdUNTKG51bGwpO1xuICBjb25zdCBbZnJhbWluZywgc2V0RnJhbWluZ10gPSB1Q1MoXCJcIik7XG4gIGNvbnN0IFthbm9uLCBzZXRBbm9uXSA9IHVDUyhmYWxzZSk7XG4gIGNvbnN0IGVudHJpZXMgPSB3aW5kb3cuc2VlZEVudHJpZXMgfHwgW107XG4gIGNvbnN0IHNlbGVjdGVkID0gZW50cmllcy5maW5kKChlKSA9PiBlLmlkID09PSBzZWxlY3RlZElkKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCI+XG4gICAgICA8d2luZG93LlRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiY2VyY2xlXCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgbWF4V2lkdGg6IDYyMCB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiXG4gICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19XG4gICAgICAgID5cbiAgICAgICAgICBkXHUwMEU5cG9zZXIgdW4ga2Fpcm9zIFx1MDBCNyBsZSBjZXJjbGVcbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge3N0ZXAgPT09IDAgJiYgKFxuICAgICAgICAgIDw+XG4gICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiaDEtc2V1aWwgbWItbFwiPnF1ZWwga2Fpcm9zIHZldXgtdHUgZFx1MDBFOXBvc2VyID88L2gxPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYm9keSBvcC03MCBtYi1sXCI+XG4gICAgICAgICAgICAgIGRcdTAwRTlwb3NlciBkYW5zIGxlIGNlcmNsZSBlc3QgdG91am91cnMgdW4gZ2VzdGUgZXhwbGljaXRlLCBqYW1haXMgcGFyIGRcdTAwRTlmYXV0LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbSBtYi1sXCI+XG4gICAgICAgICAgICAgIHtlbnRyaWVzLnNsaWNlKDAsIDUpLm1hcCgoZSkgPT4gKFxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgIGtleT17ZS5pZH1cbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFNlbGVjdGVkSWQoZS5pZCl9XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246IFwibGVmdFwiLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNClcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOlxuICAgICAgICAgICAgICAgICAgICAgIFwiMXB4IHNvbGlkIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAoc2VsZWN0ZWRJZCA9PT0gZS5pZCA/IFwidmFyKC0tYm9uZSlcIiA6IFwidmFyKC0tYXNoLWRlZXApXCIpLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOlxuICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSWQgPT09IGUuaWRcbiAgICAgICAgICAgICAgICAgICAgICAgID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWJvbmUpIDQlLCB0cmFuc3BhcmVudClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBtYi1zXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHt3aW5kb3cudHlwZUxhYmVsID8gd2luZG93LnR5cGVMYWJlbChlLnR5cGUpIDogZS50eXBlfSBcdTAwQjcge2Uud2hlbn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDE2LFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtlLnRleHQubGVuZ3RoID4gMTgwID8gZS50ZXh0LnNsaWNlKDAsIDE4MCkgKyBcIlx1MjAyNlwiIDogZS50ZXh0fVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9eygpID0+IGdvKFwiY2VyY2xlXCIpfT5cbiAgICAgICAgICAgICAgICBhbm51bGVyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuLWdob3N0XCJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17IXNlbGVjdGVkSWR9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0U3RlcCgxKX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIGNvbnRpbnVlclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvPlxuICAgICAgICApfVxuXG4gICAgICAgIHtzdGVwID09PSAxICYmIHNlbGVjdGVkICYmIChcbiAgICAgICAgICA8PlxuICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImgxLXNldWlsIG1iLWxcIj51biBjYWRyZSBwb3VyIHF1ZSBsZSBjZXJjbGUgcmVcdTAwRTdvaXZlID88L2gxPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYm9keSBvcC03MCBtYi1sXCI+XG4gICAgICAgICAgICAgIG9wdGlvbm5lbC4gdW5lIHBocmFzZSBwb3VyIHNpdHVlciBcdTIwMTQgcGFzIHBvdXIgZXhwbGlxdWVyLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIG1iLWxcIj5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7d2luZG93LnR5cGVMYWJlbCA/IHdpbmRvdy50eXBlTGFiZWwoc2VsZWN0ZWQudHlwZSkgOiBzZWxlY3RlZC50eXBlfSBcdTAwQjd7XCIgXCJ9XG4gICAgICAgICAgICAgICAge3NlbGVjdGVkLndoZW59XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJib2R5XCIgc3R5bGU9e3sgdGV4dFdyYXA6IFwicHJldHR5XCIgfX0+XG4gICAgICAgICAgICAgICAge3NlbGVjdGVkLnRleHR9XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHRleHRhcmVhXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLXRleHRhcmVhIG1iLWxcIlxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cImNlIHJcdTAwRUF2ZSBlc3QgdmVudSBhcHJcdTAwRThzIHVuZSBqb3Vyblx1MDBFOWUgb1x1MDBGOVx1MjAyNiAvIGplIG4nYWkgcGFzIGNvbXByaXMgbWFpcyBxdWVscXVlIGNob3NlIGEgYm91Z1x1MDBFOVx1MjAyNlwiXG4gICAgICAgICAgICAgIHZhbHVlPXtmcmFtaW5nfVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEZyYW1pbmcoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxsYWJlbFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyb3cgZ2FwLXMgbWItbFwiXG4gICAgICAgICAgICAgIHN0eWxlPXt7IGN1cnNvcjogXCJwb2ludGVyXCIgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1widG9nZ2xlIFwiICsgKGFub24gPyBcIm9uXCIgOiBcIlwiKX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRBbm9uKCFhbm9uKX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDE0IH19PmRcdTAwRTlwb3NlciBzYW5zIG1vbiBub208L3NwYW4+XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG1iLWxcIlxuICAgICAgICAgICAgICBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgZFx1MDBFOXBvc2VyIGRhbnMgbGUgY2VyY2xlIG4nZW52b2llIHJpZW4gXHUwMEUwIEFuaW1hIE11bmRpLiBjZSBzb250IGRldXggZ2VzdGVzIHNcdTAwRTlwYXJcdTAwRTlzLlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9eygpID0+IHNldFN0ZXAoMCl9PlxuICAgICAgICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gc2V0U3RlcCgyKX0+XG4gICAgICAgICAgICAgICAgZFx1MDBFOXBvc2VyIGRhbnMgbGUgY2VyY2xlXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge3N0ZXAgPT09IDIgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIiBzdHlsZT17eyBwYWRkaW5nVG9wOiBcInZhcigtLXMtNilcIiB9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnJlYXRoIG1iLXhsXCIgLz5cbiAgICAgICAgICAgIDxwXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpYyBtYi1zXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgbWF4V2lkdGg6IDQyMCwgbWFyZ2luOiBcIjAgYXV0b1wiIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIGxlIGthaXJvcyBlc3QgZFx1MDBFOXBvc1x1MDBFOSBkYW5zIGxlIGNlcmNsZS5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtdC1tXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHR1IHNlcmFzIG5vdGlmaVx1MDBFOWUgcXVhbmQgcXVlbHF1J3VuIGxlIHRpZW50LiBvdSBqYW1haXMuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0IG10LXhsXCIgb25DbGljaz17KCkgPT4gZ28oXCJjZXJjbGVcIil9PlxuICAgICAgICAgICAgICByZXRvdXJuZXIgYXUgY2VyY2xlXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgQ2VyY2xlU2NyZWVuLFxuICBDZXJjbGVEZXRhaWwsXG4gIENyZWVyQ2VyY2xlU2NyZWVuLFxuICBDZXJjbGVUZW1wbGF0ZVBpY2tlcixcbiAgUmVqb2luZHJlU2NyZWVuLFxuICBQYXJ0YWdlclJldmVTY3JlZW4sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQXlCQSxNQUFNLEVBQUUsVUFBVSxLQUFLLFdBQVcsS0FBSyxTQUFTLEtBQUssUUFBUSxJQUFJLElBQUk7QUFHckUsTUFBTSxhQUFhO0FBQUEsRUFDakIsVUFBVTtBQUFBLEVBQ1YsY0FBYztBQUFBLEVBQ2QsVUFBVTtBQUNaO0FBRUEsU0FBUyxhQUFhLEtBQUs7QUFsQzNCO0FBbUNFLE1BQUksQ0FBQyxJQUFLLFFBQU87QUFDakIsTUFBSTtBQUNGLGFBQU8sa0JBQU8sYUFBUCxtQkFBaUIsa0JBQWpCLDRCQUFpQyxTQUFRO0FBQUEsRUFDbEQsU0FBUTtBQUNOLFdBQU87QUFBQSxF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
