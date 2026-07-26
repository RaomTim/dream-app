const { useState: useS2, useEffect: useE2, useRef: useR2, useMemo: useM2 } = React;
const ForestThreeAnglesSkeleton = ({ matterColor }) => {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const messages = [
    "la for\xEAt convoque ses voix\u2026",
    "trois angles cherchent ton kairos\u2026",
    "\xE9couter ce qui te touche\u2026"
  ];
  const message = useRotating ? useRotating(messages, 2400) : messages[0];
  if (!Shim || !Halo) {
    return /* @__PURE__ */ React.createElement("div", { className: "card text-center", style: { padding: "var(--s-6)", opacity: 0.7 } }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, message));
  }
  const matters = ["paper", "stone", "silk"];
  return /* @__PURE__ */ React.createElement("div", { className: "dream-skeleton-fade-in stack gap-m" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", padding: "var(--s-3) 0" } }, /* @__PURE__ */ React.createElement(Halo, { size: 28, message, dark: true })), matters.map((m) => {
    const color = matterColor && matterColor[m] || "var(--paper-warm)";
    return /* @__PURE__ */ React.createElement("div", { key: m, className: "card", style: {
      padding: "var(--s-5)",
      borderColor: color,
      background: "color-mix(in oklch, " + color + " 4%, transparent)",
      display: "flex",
      flexDirection: "column",
      gap: 14
    } }, /* @__PURE__ */ React.createElement(Shim, { lines: 3, height: 14, gap: 10, dark: true, lastLineWidth: "68%" }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8 } }, /* @__PURE__ */ React.createElement(Shim, { lines: 2, height: 11, gap: 9, dark: true, lastLineWidth: "52%" })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, opacity: 0.6 } }, /* @__PURE__ */ React.createElement(Shim, { lines: 1, height: 9, dark: true, width: "38%" })));
  }));
};
const KairosDetail = ({ go, entry, allEntries }) => {
  var _a, _b, _c;
  const [sheet, setSheet] = useS2(null);
  const [userReading, setUserReading] = useS2("");
  const [readingSubmitted, setReadingSubmitted] = useS2(false);
  const [forestAngles, setForestAngles] = useS2(null);
  const [forestFraming, setForestFraming] = useS2("");
  const [forestLoading, setForestLoading] = useS2(false);
  const [forestError, setForestError] = useS2("");
  const [currentReading, setCurrentReading] = useS2(null);
  const [feltShift, setFeltShift] = useS2(null);
  const [ahaLevel, setAhaLevel] = useS2(null);
  const [ahaNote, setAhaNote] = useS2("");
  const [feedbackPosted, setFeedbackPosted] = useS2(false);
  const [burnCountdown, setBurnCountdown] = useS2(0);
  const burnTimerRef = useR2(null);
  const [fullKairos, setFullKairos] = useS2(entry);
  const [apiEchoes, setApiEchoes] = useS2([]);
  const [propheties, setPropheties] = useS2([]);
  const [loadingDetail, setLoadingDetail] = useS2(false);
  const [showSanctuaireModal, setShowSanctuaireModal] = useS2(false);
  useE2(() => {
    if (!(entry == null ? void 0 : entry.id)) return;
    let cancelled = false;
    setLoadingDetail(true);
    Promise.all([
      window.DreamAPI.getKairos(entry.id).catch(() => null),
      window.DreamAPI.getEchoesForKairos(entry.id, { limit: 6 }).catch(() => ({ echoes: [] })),
      window.DreamAPI.getProphecyForKairos(entry.id).catch(() => ({ propheties: [] }))
    ]).then(([kData, echoData, prophData]) => {
      var _a2, _b2;
      if (cancelled) return;
      if (kData == null ? void 0 : kData.kairos) {
        const merged = { ...entry, ...kData.kairos };
        setFullKairos(merged);
        if (kData.kairos.user_first_reading_submitted) setReadingSubmitted(true);
        try {
          const valence = typeof merged.valence === "number" ? merged.valence : null;
          const isNightmareLike = merged.is_nightmare === true || merged.is_grief_related === true || valence !== null && valence < -0.6;
          if (isNightmareLike && window.NightmareDepositChoiceModal) {
            const seenKey = "dream:sanctuaire:seen:" + merged.id;
            const alreadySeen = (() => {
              try {
                return localStorage.getItem(seenKey) === "1";
              } catch (e) {
                return false;
              }
            })();
            if (!alreadySeen) {
              setTimeout(() => {
                if (!cancelled) setShowSanctuaireModal(true);
              }, 600);
            }
          }
        } catch (err) {
          console.warn("[KairosDetail] sanctuaire auto-check failed:", err && err.message);
        }
      }
      setApiEchoes((echoData == null ? void 0 : echoData.echoes) || []);
      const props = (prophData == null ? void 0 : prophData.propheties) || [];
      setPropheties(props);
      setLoadingDetail(false);
      if (props.length > 0) {
        try {
          (_b2 = (_a2 = window.wowRegistry) == null ? void 0 : _a2.fire) == null ? void 0 : _b2.call(_a2, "premier-echo-prophetique");
        } catch (e) {
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [entry == null ? void 0 : entry.id]);
  const echoes = apiEchoes.length > 0 ? apiEchoes.slice(0, 6).map((e) => ({
    id: e.other_id || e.id,
    when: window.DreamAPI._relativeWhen ? window.DreamAPI._relativeWhen(e.created_at) : "",
    type: window.DreamAPI._mapTypeFromBackend ? window.DreamAPI._mapTypeFromBackend(e.kairos_type || "reve") : "dream_night",
    text: e.preview || "",
    prophetic: false
  })) : (allEntries || []).filter((e) => e.id !== entry.id).slice(0, 6).map((e) => ({ ...e, prophetic: false }));
  const propheticEchoes = (propheties || []).slice(0, 3).map((p) => ({
    id: p.past_id,
    when: window.DreamAPI._relativeWhen ? window.DreamAPI._relativeWhen(p.created_at) : "",
    type: "dream_night",
    text: p.preview || "",
    prophetic: true
  }));
  const allEchoes = [...propheticEchoes, ...echoes];
  const openReadingFeedback = (kind, snapshot = null) => {
    setCurrentReading({ kind, snapshot });
    setFeltShift(null);
    setAhaLevel(null);
    setAhaNote("");
    setFeedbackPosted(false);
  };
  const submitUserReading = async () => {
    if (userReading.trim().length < 4) return;
    setReadingSubmitted(true);
    if (entry == null ? void 0 : entry.id) {
      await window.DreamAPI.updateKairos(entry.id, { user_first_reading_submitted: true }).catch(() => {
      });
      if (userReading.trim()) {
        await window.DreamAPI.annotateKairos(entry.id, userReading.trim()).catch(() => {
        });
      }
    }
    openReadingFeedback("user_first");
    setSheet(null);
  };
  const askForest = async () => {
    if (!(entry == null ? void 0 : entry.id)) return;
    setSheet("forest");
    if (forestAngles) return;
    setForestLoading(true);
    setForestError("");
    try {
      const res = await window.DreamAPI.forestReading(entry.id, {
        user_first_reading: userReading.trim() || null
      });
      setForestAngles((res == null ? void 0 : res.angles) || []);
      setForestFraming((res == null ? void 0 : res.framing) || "");
    } catch (e) {
      setForestError("la for\xEAt n'a pas r\xE9pondu. reviens tout \xE0 l'heure.");
    } finally {
      setForestLoading(false);
    }
  };
  const acknowledgeForest = () => {
    openReadingFeedback("forest", forestAngles);
  };
  const startBurnCountdown = () => {
    setBurnCountdown(30);
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
    burnTimerRef.current = setInterval(() => {
      setBurnCountdown((c) => {
        if (c <= 1) {
          clearInterval(burnTimerRef.current);
          burnTimerRef.current = null;
          return 0;
        }
        return c - 1;
      });
    }, 1e3);
  };
  const cancelBurn = () => {
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
    burnTimerRef.current = null;
    setBurnCountdown(0);
    setSheet(null);
  };
  const confirmBurn = async () => {
    if (burnCountdown > 0) return;
    if (!(entry == null ? void 0 : entry.id)) return;
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
    burnTimerRef.current = null;
    await window.DreamAPI.deleteKairos(entry.id).catch(() => {
    });
    if (window.DreamRefreshEntries) window.DreamRefreshEntries();
    go("journal");
  };
  useE2(() => () => {
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
  }, []);
  const sendFeedback = async () => {
    if (!(entry == null ? void 0 : entry.id) || !currentReading) return;
    setFeedbackPosted(true);
    await window.DreamAPI.submitAhaFeedback(entry.id, {
      reading_kind: currentReading.kind,
      felt_shift_location: feltShift || void 0,
      aha_level: ahaLevel || void 0,
      aha_note: ahaNote.trim() || void 0,
      forest_reading_angles: currentReading.kind === "forest" ? currentReading.snapshot : void 0
    }).catch(() => {
    });
    setTimeout(() => setCurrentReading(null), 1400);
  };
  const display = fullKairos || entry;
  const matterColor = {
    paper: "var(--paper-warm)",
    stone: "var(--stone-cool)",
    silk: "var(--silk-gold)"
  };
  useE2(() => {
    if (!(entry == null ? void 0 : entry.id) || propheties.length === 0) return;
    const seenKey = "dream:echo-overlay:seen:" + entry.id;
    let alreadySeen = false;
    try {
      alreadySeen = localStorage.getItem(seenKey) === "1";
    } catch (e) {
    }
    if (alreadySeen) return;
    const p = propheties[0];
    const presentText = (display.text || display.raw_text || "").trim();
    const pastText = (p.preview || "").trim();
    if (!presentText || !pastText) return;
    let daysAgo = 0;
    try {
      const t = new Date(p.created_at).getTime();
      if (t) daysAgo = Math.max(0, Math.floor((Date.now() - t) / (24 * 3600 * 1e3)));
    } catch (e) {
    }
    const tmr = setTimeout(() => {
      try {
        if (window.dreamShowEchoOverlay) {
          window.dreamShowEchoOverlay({
            presentText,
            pastText,
            daysAgo,
            onDismiss: () => {
              try {
                localStorage.setItem(seenKey, "1");
              } catch (e) {
              }
            }
          });
          try {
            localStorage.setItem(seenKey, "1");
          } catch (e) {
          }
        }
      } catch (e) {
      }
    }, 900);
    return () => clearTimeout(tmr);
  }, [entry == null ? void 0 : entry.id, propheties.length]);
  const isBigDreamLike = display.numinosity_score && display.numinosity_score > 0.7 || display.bigDream === true || display.synthesis_tier === "deep";
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-warm)", position: "relative", overflow: "hidden" } }, window.Surface && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    opacity: 0.4,
    zIndex: 0,
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement(
    window.Surface,
    {
      matter: "linen",
      motion: true,
      style: { position: "absolute", inset: 0, width: "100%", height: "100%" }
    }
  )), isBigDreamLike && window.HaloRespire && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(540px, 92vw)",
    height: 320,
    opacity: 0.55,
    pointerEvents: "none",
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement(window.HaloRespire, { kind: "bigdream" })), /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("journal"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { position: "relative", paddingBottom: "calc(var(--s-7) + 80px)", zIndex: 2 } }, (display.bigDream || display.synthesis_tier === "deep") && /* @__PURE__ */ React.createElement("div", { className: "halo-big" }), /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, typeLabel(display.type), ", d\xE9pos\xE9 ", display.when, loadingDetail && /* @__PURE__ */ React.createElement("span", { className: "op-50", style: { marginLeft: 12 } }, "\xB7 enrichissement en cours\u2026")), /* @__PURE__ */ React.createElement("p", { className: "h3-lecture", style: {
    fontSize: 25,
    lineHeight: 1.55,
    maxWidth: 580,
    textWrap: "pretty",
    marginBottom: "var(--s-6)"
  } }, display.text || display.raw_text), display.synthesis_text ? /* @__PURE__ */ React.createElement("div", { className: "card mb-l", style: {
    padding: "var(--s-5)",
    background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
    borderColor: "var(--silk-gold)"
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)" } }, "SYNTH\xC8SE TISS\xC9E"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.7, textWrap: "pretty", whiteSpace: "pre-wrap" } }, display.synthesis_text), ((_a = display.synthesis_voices) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ React.createElement("div", { className: "meta mt-m op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13 } }, "voix \xB7 ", display.synthesis_voices.join(" \xB7 "))) : (() => {
    var _a2;
    const createdAtIso = display.created_at || ((_a2 = display._raw) == null ? void 0 : _a2.created_at);
    if (!createdAtIso) return null;
    const ageSec = (Date.now() - new Date(createdAtIso).getTime()) / 1e3;
    if (ageSec > 90 || ageSec < 0) return null;
    const Halo = window.LoadingHalo;
    return /* @__PURE__ */ React.createElement("div", { className: "card mb-l dream-skeleton-fade-in", style: {
      padding: "var(--s-5)",
      background: "color-mix(in oklch, var(--silk-gold) 3%, transparent)",
      borderColor: "color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
      borderStyle: "dashed"
    } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)", opacity: 0.7 } }, "SYNTH\xC8SE TISS\xC9E \xB7 EN CHEMIN"), /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 15,
      lineHeight: 1.65,
      textWrap: "pretty",
      color: "var(--ash-light)",
      margin: 0
    } }, "l'app tisse les \xE9chos pour ce kairos. reviens dans une minute\u2026"), Halo && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 14, display: "flex", justifyContent: "flex-start" } }, /* @__PURE__ */ React.createElement(Halo, { size: 20, message: null, dark: true })));
  })(), (((_b = display.motif_tags) == null ? void 0 : _b.length) > 0 || ((_c = display.archetypal_tags) == null ? void 0 : _c.length) > 0) && /* @__PURE__ */ React.createElement("div", { className: "row gap-s mb-l", style: { flexWrap: "wrap" } }, (display.motif_tags || []).slice(0, 6).map((t) => /* @__PURE__ */ React.createElement("span", { key: "m-" + t, className: "chip", style: { pointerEvents: "none", opacity: 0.85 } }, "\xB7 ", t)), (display.archetypal_tags || []).slice(0, 4).map((t) => /* @__PURE__ */ React.createElement("span", { key: "a-" + t, className: "chip", style: { pointerEvents: "none", opacity: 0.85, borderColor: "var(--silk-gold)", color: "var(--silk-gold)" } }, "\u25C7 ", t))), readingSubmitted && userReading.trim() && /* @__PURE__ */ React.createElement("div", { className: "card mb-l", style: {
    padding: "var(--s-4)",
    background: "color-mix(in oklch, var(--paper-warm) 4%, transparent)",
    borderColor: "color-mix(in oklch, var(--paper-warm) 30%, var(--ash-deep))"
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--paper-warm)" } }, "TA LECTURE"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic", lineHeight: 1.6, textWrap: "pretty", margin: 0 } }, userReading)), !readingSubmitted && /* @__PURE__ */ React.createElement("p", { className: "meta op-70 mb-l", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14, maxWidth: 520 } }, "la for\xEAt parle apr\xE8s toi. offre d'abord ta lecture."), currentReading && !feedbackPosted && /* @__PURE__ */ React.createElement("div", { className: "mt-xl card", style: {
    padding: "var(--s-5)",
    borderColor: "var(--clay-earth)",
    background: "color-mix(in oklch, var(--clay-earth) 4%, transparent)"
  } }, /* @__PURE__ */ React.createElement(
    FeltShiftAhaInline,
    {
      feltShift,
      setFeltShift,
      ahaLevel,
      setAhaLevel,
      ahaNote,
      setAhaNote,
      onSend: sendFeedback,
      onSkip: () => setCurrentReading(null)
    }
  )), currentReading && feedbackPosted && /* @__PURE__ */ React.createElement("div", { className: "mt-xl text-center", style: { padding: "var(--s-4)", borderTop: "1px solid var(--ash-deep)" } }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" } }, "ton aha est pos\xE9. il reste avec toi.")), window.ExitToHuman && /* @__PURE__ */ React.createElement(window.ExitToHuman, null)), /* @__PURE__ */ React.createElement("div", { style: {
    position: "sticky",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, var(--night-warm) 70%, transparent)",
    padding: "var(--s-5) var(--s-4) var(--s-4)",
    zIndex: 10
  } }, /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { flexWrap: "wrap", justifyContent: "center", maxWidth: 640, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("user_first") }, /* @__PURE__ */ React.createElement(TypeGlyph, { type: "note_vie", size: 10 }), " que vois-tu ?"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "chip",
      disabled: !readingSubmitted,
      onClick: readingSubmitted ? askForest : null,
      style: { opacity: readingSubmitted ? 1 : 0.4, cursor: readingSubmitted ? "pointer" : "not-allowed" },
      title: readingSubmitted ? "" : "offre d'abord ta lecture"
    },
    "demander \xE0 la for\xEAt"
  ), /* @__PURE__ */ React.createElement("button", { className: "chip", onClick: () => setSheet("echoes") }, "\xE9chos depuis le pass\xE9"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "chip",
      onClick: () => {
        setBurnCountdown(0);
        setSheet("burn");
      },
      style: { color: "var(--ash-light)" }
    },
    "br\xFBler"
  )), (() => {
    const shouldShowBigDreamCTA = display.numinosity_score && display.numinosity_score > 0.85 || display.bigDream === true || display.synthesis_tier === "deep" || display.synthesis_tier === "big_dream";
    if (!shouldShowBigDreamCTA) return null;
    return /* @__PURE__ */ React.createElement("div", { style: {
      maxWidth: 640,
      margin: "var(--s-3) auto 0",
      display: "flex",
      justifyContent: "center"
    } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "chip",
        onClick: () => go("bigdream-workflow", { kairos_id: display.id }),
        style: {
          borderColor: "var(--silk-gold)",
          color: "var(--silk-gold)",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 14
        }
      },
      "\u2726 tenir ce r\xEAve sur 7 jours"
    ));
  })()), sheet === "user_first" && /* @__PURE__ */ React.createElement(Sheet, { onClose: () => setSheet(null), matter: "paper" }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--paper-warm)" } }, "TA LECTURE \u2014 EN PREMIER"), /* @__PURE__ */ React.createElement("h3", { className: "h3-lecture mb-s", style: { fontSize: 26 } }, "Ce que tu vois l\xE0, ce qui te touche, ce qui te r\xE9siste."), /* @__PURE__ */ React.createElement("p", { className: "ash-italic mb-l", style: { fontSize: 15, textWrap: "pretty", maxWidth: 540 } }, "La for\xEAt arrive apr\xE8s. Tes mots d'abord \u2014 m\xEAme maladroits, m\xEAme fragmentaires."), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: 10,
      placeholder: "ce que ce kairos pose dans toi\u2026",
      style: {
        width: "100%",
        minHeight: 220,
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--paper-warm) 35%, var(--ash-deep))",
        padding: "var(--s-4)",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 18,
        lineHeight: 1.6,
        resize: "vertical",
        outline: "none"
      },
      value: userReading,
      onChange: (e) => setUserReading(e.target.value)
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-s mt-l", style: { justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setSheet(null) }, "plus tard"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: submitUserReading,
      disabled: userReading.trim().length < 4,
      style: {
        opacity: userReading.trim().length < 4 ? 0.4 : 1,
        borderColor: "var(--paper-warm)",
        color: "var(--paper-warm)"
      }
    },
    "d\xE9poser ma lecture"
  ))), sheet === "forest" && /* @__PURE__ */ React.createElement(Sheet, { onClose: () => setSheet(null) }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)" } }, "FOR\xCAT \u2014 3 ANGLES"), /* @__PURE__ */ React.createElement("p", { className: "ash-italic mb-l", style: { fontSize: 15, textWrap: "pretty", maxWidth: 580 } }, forestFraming || "ces voix ne disent pas ton r\xEAve \u2014 elles le touchent depuis leur angle. ton corps tranche."), forestLoading && /* @__PURE__ */ React.createElement(ForestThreeAnglesSkeleton, { matterColor }), forestError && !forestLoading && /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "var(--s-4)", borderColor: "var(--ember-live)" } }, /* @__PURE__ */ React.createElement("p", { className: "ash-italic", style: { fontSize: 15 } }, forestError), /* @__PURE__ */ React.createElement("button", { className: "btn-text mt-s", onClick: () => {
    setForestAngles(null);
    askForest();
  } }, "r\xE9essayer")), !forestLoading && forestAngles && forestAngles.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, forestAngles.map((a, i) => {
    const color = matterColor[a.matter] || "var(--paper-warm)";
    return /* @__PURE__ */ React.createElement("div", { key: i, className: "card", style: {
      padding: "var(--s-5)",
      borderColor: color,
      background: "color-mix(in oklch, " + color + " 4%, transparent)"
    } }, a.citation && /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontSize: 19,
      lineHeight: 1.5,
      fontStyle: "italic",
      margin: 0,
      textWrap: "pretty",
      color: "var(--bone)"
    } }, "\xAB ", a.citation, " \xBB"), a.angle && /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      lineHeight: 1.6,
      marginTop: a.citation ? "var(--s-3)" : 0,
      textWrap: "pretty",
      opacity: 0.9
    } }, a.angle), /* @__PURE__ */ React.createElement("div", { className: "meta mt-m", style: {
      fontFamily: "var(--mono)",
      fontSize: 10.5,
      letterSpacing: "0.08em",
      color,
      opacity: 0.85
    } }, "\u2014 ", a.source));
  }), /* @__PURE__ */ React.createElement("div", { className: "row gap-s mt-l", style: { justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setSheet(null) }, "refermer"), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => {
    setSheet(null);
    acknowledgeForest();
  } }, "ce qui a touch\xE9")))), sheet === "echoes" && /* @__PURE__ */ React.createElement(Sheet, { onClose: () => setSheet(null) }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ember-live)" } }, "\xC9CHOS DEPUIS LE PASS\xC9"), /* @__PURE__ */ React.createElement("p", { className: "ash-italic mb-l", style: { fontSize: 15, textWrap: "pretty", maxWidth: 540 } }, "kairos pass\xE9s qui r\xE9sonnent avec celui-ci. ", propheticEchoes.length > 0 ? "ceux marqu\xE9s proph\xE9tique se sont allum\xE9s r\xE9troactivement." : "signal probabiliste \u2014 pas certitude."), allEchoes.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "card text-center", style: { padding: "var(--s-5)", opacity: 0.6 } }, /* @__PURE__ */ React.createElement("p", { className: "ash-italic" }, "ton sol est encore peu peupl\xE9. reviens dans quelques semaines.")) : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, allEchoes.map((e) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: (e.prophetic ? "p-" : "e-") + e.id,
      className: "card",
      style: {
        padding: "var(--s-4)",
        cursor: "pointer",
        borderColor: e.prophetic ? "var(--ember-live)" : void 0,
        background: e.prophetic ? "color-mix(in oklch, var(--ember-live) 3%, transparent)" : void 0
      },
      onClick: () => {
        setSheet(null);
        go("kairos", e.id);
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between", alignItems: "baseline" } }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, e.when, " \u2014 ", typeLabel(e.type)), e.prophetic && /* @__PURE__ */ React.createElement("span", { className: "meta", style: { fontFamily: "var(--mono)", fontSize: 10, color: "var(--ember-live)", letterSpacing: "0.08em" } }, "\u25CA PROPH\xC9TIQUE")),
    /* @__PURE__ */ React.createElement("p", { style: {
      fontFamily: "var(--serif)",
      fontSize: 16,
      opacity: 0.85,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      margin: "var(--s-3) 0 0"
    } }, e.text)
  ))), /* @__PURE__ */ React.createElement("div", { className: "row mt-l", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => setSheet(null) }, "refermer"), allEchoes.length > 0 && /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => {
    setSheet(null);
    openReadingFeedback("echo");
  } }, "ce qui a touch\xE9"))), sheet === "burn" && /* @__PURE__ */ React.createElement(Sheet, { onClose: cancelBurn }, /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at center, color-mix(in oklch, var(--ember-live) 14%, transparent), transparent 65%)",
    pointerEvents: "none"
  } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s text-center", style: { fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ember-live)" } }, "GESTE RITUEL \u2014 DISSOLUTION"), /* @__PURE__ */ React.createElement("h3", { className: "h3-lecture text-center mb-s", style: { fontStyle: "italic", fontSize: 24 } }, "ce kairos sera dissous."), /* @__PURE__ */ React.createElement("p", { className: "ash-italic text-center mb-l", style: { fontSize: 15, maxWidth: 480, margin: "0 auto var(--s-5)" } }, "suppression cryptographique. pas de retour. pas d'undo.", " ", "laisse passer trente secondes \u2014 si ton corps dit encore oui, alors confirme."), /* @__PURE__ */ React.createElement("div", { className: "text-center mb-l" }, burnCountdown > 0 ? /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: 120, height: 120, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("svg", { width: "120", height: "120", viewBox: "0 0 120 120", style: { transform: "rotate(-90deg)" } }, /* @__PURE__ */ React.createElement("circle", { cx: "60", cy: "60", r: "54", fill: "none", stroke: "var(--ash-deep)", strokeWidth: "2" }), /* @__PURE__ */ React.createElement(
    "circle",
    {
      cx: "60",
      cy: "60",
      r: "54",
      fill: "none",
      stroke: "var(--ember-live)",
      strokeWidth: "2",
      strokeDasharray: 2 * Math.PI * 54,
      strokeDashoffset: 2 * Math.PI * 54 * (1 - burnCountdown / 30),
      style: { transition: "stroke-dashoffset 1s linear" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    fontFamily: "var(--mono)",
    fontSize: 28,
    color: "var(--ember-live)"
  } }, burnCountdown)) : /* @__PURE__ */ React.createElement("div", { style: {
    width: 120,
    height: 120,
    margin: "0 auto",
    display: "grid",
    placeItems: "center",
    border: "1px solid var(--ember-live)",
    borderRadius: "50%",
    color: "var(--ember-live)",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14
  } }, "pr\xEAt")), /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { justifyContent: "center", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: cancelBurn }, "annuler \xB7 garder"), burnCountdown === 0 && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: confirmBurn,
      style: {
        borderColor: "color-mix(in oklch, var(--ember-live) 60%, var(--ash-mid))",
        color: "var(--ember-live)"
      }
    },
    "confirmer la dissolution"
  ), burnCountdown === 0 && burnTimerRef.current === null && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: startBurnCountdown,
      style: {
        borderColor: "var(--ash-mid)",
        color: "var(--ash-light)",
        display: burnCountdown === 0 ? "inline-flex" : "none"
      }
    },
    "\u25B7 d\xE9marrer trente secondes"
  )))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null), showSanctuaireModal && window.NightmareDepositChoiceModal && /* @__PURE__ */ React.createElement(
    window.NightmareDepositChoiceModal,
    {
      entry: fullKairos,
      isFrozen: false,
      onClose: () => {
        setShowSanctuaireModal(false);
        try {
          localStorage.setItem("dream:sanctuaire:seen:" + ((fullKairos == null ? void 0 : fullKairos.id) || (entry == null ? void 0 : entry.id)), "1");
        } catch (e) {
        }
      },
      onGoSanctuaire: () => {
        try {
          localStorage.setItem("dream:sanctuaire:seen:" + ((fullKairos == null ? void 0 : fullKairos.id) || (entry == null ? void 0 : entry.id)), "1");
        } catch (e) {
        }
        setShowSanctuaireModal(false);
        go("nightmares");
      },
      onExitToHuman: () => {
        try {
          localStorage.setItem("dream:sanctuaire:seen:" + ((fullKairos == null ? void 0 : fullKairos.id) || (entry == null ? void 0 : entry.id)), "1");
        } catch (e) {
        }
        setShowSanctuaireModal(false);
        go("nightmares");
      }
    }
  ));
};
const FeltShiftAhaInline = ({ feltShift, setFeltShift, ahaLevel, setAhaLevel, ahaNote, setAhaNote, onSend, onSkip }) => {
  const [mode, setMode] = useS2(() => {
    try {
      return localStorage.getItem("dream:felt-shift-mode") || "default";
    } catch (e) {
      return "default";
    }
  });
  const [showOptIn, setShowOptIn] = useS2(false);
  useE2(() => {
    try {
      if (mode === "6-zones") return;
      const prompted = localStorage.getItem("dream:felt-shift-prompted");
      if (prompted) return;
      const isPost = typeof window.isPostJ30 === "function" ? window.isPostJ30("dream:account-created", 30) : false;
      if (isPost) setShowOptIn(true);
    } catch (e) {
    }
  }, [mode]);
  const acceptExtended = () => {
    try {
      localStorage.setItem("dream:felt-shift-mode", "6-zones");
      localStorage.setItem("dream:felt-shift-prompted", String(Date.now()));
    } catch (e) {
    }
    setMode("6-zones");
    setShowOptIn(false);
  };
  const declineExtended = () => {
    try {
      localStorage.setItem("dream:felt-shift-prompted", String(Date.now()));
    } catch (e) {
    }
    setShowOptIn(false);
  };
  const SHIFT_ZONES_DEFAULT = [
    ["gorge", "gorge"],
    ["poitrine", "poitrine"],
    ["ailleurs", "ailleurs"]
  ];
  const SHIFT_ZONES_EXTENDED = [
    ["gorge", "gorge"],
    ["poitrine", "poitrine"],
    ["ventre", "ventre"],
    ["nuque", "nuque"],
    ["ailleurs", "ailleurs"],
    ["aucune", "aucune part"]
  ];
  const SHIFT_ZONES = mode === "6-zones" ? SHIFT_ZONES_EXTENDED : SHIFT_ZONES_DEFAULT;
  const gridCols = mode === "6-zones" ? "repeat(3, 1fr)" : "repeat(3, 1fr)";
  const AHA_LEVELS = [
    ["fort", "r\xE9sonne fort"],
    ["peut-etre", "peut-\xEAtre"],
    ["non", "non"]
  ];
  const canSend = !!feltShift || !!ahaLevel || ahaNote.trim().length > 0;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10.5,
    letterSpacing: "0.08em",
    color: "var(--clay-earth)"
  } }, "FELT-SHIFT \xB7 GENDLIN"), /* @__PURE__ */ React.createElement("p", { className: "body mb-m", style: { textWrap: "pretty", fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic" } }, mode === "6-zones" ? "prends dix secondes. lequel a fait quelque chose dans ton corps ?" : "\xE7a shift o\xF9 ?"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "grid",
    gridTemplateColumns: gridCols,
    gap: "var(--s-2)",
    marginBottom: "var(--s-3)"
  } }, SHIFT_ZONES.map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      className: "chip " + (feltShift === k ? "active" : ""),
      onClick: () => setFeltShift(k),
      style: { width: "100%", justifyContent: "center" }
    },
    l
  ))), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text " + (feltShift === "rien" ? "active" : ""),
      onClick: () => setFeltShift("rien"),
      style: {
        fontSize: 13,
        opacity: 0.7,
        color: feltShift === "rien" ? "var(--bone)" : "var(--ash-light)",
        fontStyle: "italic"
      }
    },
    "rien ne shift \u2014 j'attends"
  ), showOptIn && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: "var(--s-4)",
    padding: "var(--s-3) var(--s-3)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))",
    background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)"
  } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 1.55,
    color: "var(--bone)",
    margin: "0 0 var(--s-3) 0",
    textWrap: "pretty"
  } }, "Veux-tu plus de pr\xE9cision corporelle\xA0? On peut d\xE9verrouiller 6 zones."), /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { justifyContent: "flex-end", flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      onClick: declineExtended,
      style: { fontSize: 13 }
    },
    "non, garde simple"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: acceptExtended,
      style: { fontSize: 13 }
    },
    "oui, d\xE9verrouiller 6 zones"
  ))), /* @__PURE__ */ React.createElement("div", { className: "divider", style: { margin: "var(--s-4) 0" } }), /* @__PURE__ */ React.createElement("div", { className: "meta mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10.5,
    letterSpacing: "0.08em",
    color: "var(--silk-gold)"
  } }, "AHA \u2014 CE QUI S'EST POS\xC9"), /* @__PURE__ */ React.createElement("div", { className: "row gap-s mb-m", style: { flexWrap: "wrap" } }, AHA_LEVELS.map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      className: "chip " + (ahaLevel === k ? "active" : ""),
      onClick: () => setAhaLevel(k)
    },
    l
  ))), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      rows: 3,
      placeholder: "ce qui s'est pos\xE9 en mots \u2014 ou laisser vide.",
      value: ahaNote,
      onChange: (e) => setAhaNote(e.target.value),
      style: {
        width: "100%",
        minHeight: 70,
        background: "transparent",
        border: "1px solid var(--ash-deep)",
        padding: "var(--s-3)",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 15,
        lineHeight: 1.5,
        resize: "vertical",
        outline: "none",
        marginBottom: "var(--s-3)"
      }
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onSkip, style: { fontSize: 13 } }, "plus tard"), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: onSend,
      disabled: !canSend,
      style: { opacity: canSend ? 1 : 0.4 }
    },
    "enregistrer"
  )), /* @__PURE__ */ React.createElement("div", { className: "meta op-70 mt-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12 } }, "rien n'est \xE9valu\xE9. ces traces pond\xE8rent les lectures futures, c'est tout."));
};
const Sheet = ({ children, onClose, matter = null }) => {
  const matterBorder = matter === "paper" ? "var(--paper-warm)" : matter === "stone" ? "var(--stone-cool)" : matter === "silk" ? "var(--silk-gold)" : "var(--ash-mid)";
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    inset: 0,
    zIndex: 110,
    background: "color-mix(in oklch, var(--night-floor) 88%, transparent)",
    backdropFilter: "blur(10px)",
    display: "grid",
    placeItems: "stretch",
    animation: "screen-in var(--tempo-tisse) var(--ease-respire) both"
  }, onClick: onClose }, /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: (e) => e.stopPropagation(),
      style: {
        background: "var(--night-warm)",
        borderTop: "1px solid " + matterBorder,
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        padding: "var(--s-6) var(--s-5) var(--s-7)",
        position: "relative",
        overflowY: "auto",
        maxHeight: "100vh"
      }
    },
    /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: onClose,
        "aria-label": "refermer",
        style: {
          position: "absolute",
          top: "var(--s-3)",
          right: "var(--s-3)",
          background: "none",
          border: "none",
          color: "var(--ash-light)",
          fontFamily: "var(--serif)",
          fontSize: 22,
          cursor: "pointer",
          padding: 8,
          opacity: 0.7
        }
      },
      "\xD7"
    ),
    children
  ));
};
const Modal = ({ children, onClose }) => /* @__PURE__ */ React.createElement("div", { style: {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
  backdropFilter: "blur(8px)",
  display: "grid",
  placeItems: "center",
  padding: "var(--s-4)",
  animation: "screen-in var(--tempo-tisse) var(--ease-respire) both"
}, onClick: onClose }, /* @__PURE__ */ React.createElement(
  "div",
  {
    onClick: (e) => e.stopPropagation(),
    style: {
      background: "var(--night-warm)",
      border: "1px solid var(--ash-mid)",
      padding: "var(--s-5)",
      maxWidth: 540,
      width: "100%",
      position: "relative",
      overflow: "hidden"
    }
  },
  children
));
const Constellation = ({ nodes, selected, onSelect, height = 340 }) => {
  const w = 640;
  const h = height;
  const [tick, setTick] = useS2(0);
  useE2(() => {
    let raf;
    const loop = () => {
      setTick((t) => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const placed = useM2(() => nodes.map((n, i) => {
    const angle = i / nodes.length * Math.PI * 2 + (n.seed || 0);
    const radius = 40 + (n.weight || 1) * 22 + i * 17 % 60;
    return {
      ...n,
      bx: w / 2 + Math.cos(angle) * radius,
      by: h / 2 + Math.sin(angle) * radius * 0.75
    };
  }), [nodes, w, h]);
  return /* @__PURE__ */ React.createElement("div", { className: "constellation", style: { height } }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%", height: "100%", style: { display: "block" } }, placed.map(
    (a, i) => placed.slice(i + 1).map((b, j) => {
      var _a;
      if (!((_a = a.edges) == null ? void 0 : _a.includes(b.id))) return null;
      const dx = Math.sin(tick / 60 + i) * 3;
      const dy = Math.cos(tick / 60 + j) * 3;
      return /* @__PURE__ */ React.createElement(
        "line",
        {
          key: `${a.id}-${b.id}`,
          x1: a.bx + dx,
          y1: a.by + dy,
          x2: b.bx - dx,
          y2: b.by - dy,
          stroke: "var(--ash-mid)",
          strokeWidth: "0.5",
          opacity: "0.45"
        }
      );
    })
  ), placed.map((n, i) => {
    const breath = 1 + Math.sin(tick / 50 + i) * 0.04;
    const dx = Math.sin(tick / 80 + i * 0.7) * 2;
    const dy = Math.cos(tick / 90 + i * 1.1) * 2;
    const r = (4 + (n.weight || 1) * 3) * breath;
    const isSel = selected === n.id;
    const fill = n.color || "var(--bone)";
    return /* @__PURE__ */ React.createElement(
      "g",
      {
        key: n.id,
        transform: `translate(${n.bx + dx} ${n.by + dy})`,
        style: { cursor: "pointer" },
        onClick: () => onSelect == null ? void 0 : onSelect(n.id)
      },
      isSel && /* @__PURE__ */ React.createElement("circle", { r: r + 10, fill: "none", stroke: "var(--bone)", strokeWidth: "0.5", opacity: "0.4" }),
      n.shape === "star" ? /* @__PURE__ */ React.createElement(
        "polygon",
        {
          points: "0,-6 1.5,-1.5 6,-1.5 2.5,1.5 4,6 0,3 -4,6 -2.5,1.5 -6,-1.5 -1.5,-1.5",
          fill,
          opacity: 0.85,
          transform: `scale(${r / 6})`
        }
      ) : /* @__PURE__ */ React.createElement("circle", { r, fill, opacity: 0.9 }),
      isSel && /* @__PURE__ */ React.createElement(
        "text",
        {
          y: r + 16,
          fontSize: "11",
          fill: "var(--bone)",
          textAnchor: "middle",
          fontFamily: "var(--serif)",
          fontStyle: "italic"
        },
        n.label
      )
    );
  })));
};
const portraitNodes = [
  { id: "grand-mere", label: "la grand-m\xE8re", weight: 3, color: "var(--stone-cool)", edges: ["maison", "porte"], seed: 0.3, shape: "circle" },
  { id: "maison", label: "la maison aux pi\xE8ces inconnues", weight: 2.5, color: "var(--paper-warm)", edges: ["porte"], seed: 0.8 },
  { id: "porte", label: "la porte qui ne s'ouvre pas", weight: 2.2, color: "var(--paper-warm)", edges: ["cuisine"], seed: 1.5 },
  { id: "cuisine", label: "cuisine sans feu", weight: 1.8, color: "var(--clay-earth)", edges: [], seed: 2.1 },
  { id: "eau", label: "eau qui cherche son lit", weight: 2.8, color: "var(--stone-cool)", edges: ["estuaire", "pont"], seed: 2.8, shape: "star" },
  { id: "estuaire", label: "estuaire", weight: 1.5, color: "var(--stone-cool)", edges: [], seed: 3.3 },
  { id: "pont", label: "pont inachev\xE9", weight: 2, color: "var(--silk-gold)", edges: ["seuil"], seed: 3.9, shape: "star" },
  { id: "seuil", label: "seuil \xE0 traverser", weight: 2.4, color: "var(--silk-gold)", edges: ["travail"], seed: 4.5 },
  { id: "travail", label: "question du travail", weight: 2.6, color: "var(--paper-warm)", edges: [], seed: 5.1 },
  { id: "corbeau", label: "corbeau / feuille morte", weight: 1.2, color: "var(--obsidian)", edges: [], seed: 5.7 },
  { id: "enfant", label: "enfant qui pleure", weight: 1.6, color: "var(--ember-live)", edges: ["maison"], seed: 0.1, shape: "star" }
];
const Portrait = ({ go }) => {
  const [toggle, setToggle] = useS2("croise");
  const [period, setPeriod] = useS2("lune");
  const [selected, setSelected] = useS2(null);
  const [graph, setGraph] = useS2({ nodes: portraitNodes, edges: [] });
  const [loading, setLoading] = useS2(true);
  const periodDays = { lune: 30, saison: 90, annee: 365, always: 3650 }[period] || 90;
  useE2(() => {
    let cancelled = false;
    setLoading(true);
    window.DreamAPI.getConstellationGraph({ days: periodDays, min_weight: 0.3 }).then((g) => {
      if (cancelled) return;
      const nodes = ((g == null ? void 0 : g.nodes) || []).map((n, i) => ({
        id: n.id || "n-" + i,
        label: n.label || n.name || "\xB7",
        weight: n.weight || n.occurrences || 1,
        color: n.kind === "bigdream" ? "var(--silk-gold)" : n.kind === "figure" ? "var(--paper-warm)" : n.kind === "motif" ? "var(--stone-cool)" : "var(--bone)",
        shape: n.kind === "bigdream" ? "star" : "circle",
        edges: (g.edges || []).filter((e) => (e.source || e.a) === (n.id || "n-" + i)).map((e) => e.target || e.b),
        seed: i * 0.7 % 6.28
      }));
      const finalNodes = nodes.length > 0 ? nodes : portraitNodes;
      setGraph({ nodes: finalNodes, edges: (g == null ? void 0 : g.edges) || [] });
      setLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setGraph({ nodes: portraitNodes, edges: [] });
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [periodDays]);
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame" }, /* @__PURE__ */ React.createElement("div", { className: "row mb-l", style: { justifyContent: "space-between", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil" }, "Portrait"), /* @__PURE__ */ React.createElement("div", { className: "row gap-m" }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", "aria-label": "l\xE9gende" }, "?"), /* @__PURE__ */ React.createElement("button", { className: "btn-text", "aria-label": "param\xE8tres" }, "\u2699"))), loading ? /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { height: 380, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 } }, /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "la constellation s'organise\u2026")) : /* @__PURE__ */ React.createElement(Constellation, { nodes: graph.nodes, selected, onSelect: setSelected, height: 380 }), /* @__PURE__ */ React.createElement("div", { className: "mt-l toggle-row" }, [["onirique", "onirique"], ["jour", "jour"], ["croise", "crois\xE9"]].map(([k, l]) => /* @__PURE__ */ React.createElement("button", { key: k, className: "chip" + (toggle === k ? " active" : ""), onClick: () => setToggle(k) }, l))), /* @__PURE__ */ React.createElement("div", { className: "mt-s toggle-row" }, [["lune", "cette lune"], ["saison", "saison"], ["annee", "ann\xE9e"], ["always", "always"]].map(([k, l]) => /* @__PURE__ */ React.createElement("button", { key: k, className: "chip" + (period === k ? " active" : ""), onClick: () => setPeriod(k) }, l))), /* @__PURE__ */ React.createElement("div", { className: "divider-moon" }, "\xE9chos vivants en ce moment"), /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "var(--s-4)" } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, margin: 0, textWrap: "pretty" } }, "il y a une lune \u2014 \xAB la maison aux pi\xE8ces inconnues \xBB r\xE9sonne avec ton r\xEAve de ce matin.")), /* @__PURE__ */ React.createElement("div", { className: "card", style: { padding: "var(--s-4)" } }, /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, margin: 0, textWrap: "pretty" } }, "il y a deux lunes \u2014 \xAB attends, d\xE9cision Paris \xBB r\xE9sonne avec la question du travail cette semaine."))), /* @__PURE__ */ React.createElement("div", { className: "mt-xl text-center" }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: () => go("chat", "portrait") }, "\u2299 demander une lecture"), /* @__PURE__ */ React.createElement("div", { className: "meta mt-s op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "voix mobilis\xE9es cette lune \xB7 aizenstat \xB7 moss \xB7 bachelard")), window.ExitToHuman && /* @__PURE__ */ React.createElement(window.ExitToHuman, null)), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const AnimaVoute = ({ go }) => {
  var _a, _b;
  const [tick, setTick] = useS2(0);
  const [voute, setVoute] = useS2(null);
  useE2(() => {
    const t = setInterval(() => setTick((v) => v + 1), 50);
    return () => clearInterval(t);
  }, []);
  useE2(() => {
    let cancelled = false;
    window.DreamAPI.getVoute().then((d) => {
      if (!cancelled) setVoute(d);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const points = useM2(() => {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        x: i * 37 % 100,
        y: i * 53 % 100,
        phase: i * 0.27,
        size: 0.6 + i * 13 % 7 / 10
      });
    }
    return arr;
  }, []);
  const meteoCount = ((_a = voute == null ? void 0 : voute.meteo) == null ? void 0 : _a.k_count) || (voute == null ? void 0 : voute.meteo_optin_count) || null;
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("home"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame" }, /* @__PURE__ */ React.createElement("h1", { className: "h1-seuil text-center mb-xl", style: { fontSize: 44 } }, "Anima Mundi"), /* @__PURE__ */ React.createElement("div", { className: "anima-constellation mb-l" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 100 60", width: "100%", height: "100%", preserveAspectRatio: "none", style: { display: "block" } }, points.map((p, i) => {
    const breathe = (Math.sin(tick / 40 + p.phase) + 1) / 2;
    const opacity = 0.15 + breathe * 0.5;
    return /* @__PURE__ */ React.createElement(
      "circle",
      {
        key: i,
        cx: p.x,
        cy: p.y * 0.6,
        r: p.size * (0.4 + breathe * 0.6),
        fill: i % 23 === 0 ? "var(--silk-gold)" : i % 11 === 0 ? "var(--stone-cool)" : "var(--bone)",
        opacity
      }
    );
  }))), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic text-center", style: { fontSize: 19, maxWidth: 520, margin: "0 auto", textWrap: "pretty" } }, meteoCount ? `Cette lune, ${meteoCount.toLocaleString("fr-FR")} voix ont d\xE9pos\xE9 \u2014 r\xEAves, signes, travers\xE9es.` : "Cette lune, des voix se rassemblent \u2014 r\xEAves, signes, travers\xE9es."), /* @__PURE__ */ React.createElement("div", { className: "stack gap-m mt-xl" }, /* @__PURE__ */ React.createElement("button", { className: "chamber-card", onClick: () => go("meteo") }, /* @__PURE__ */ React.createElement("h3", { className: "h3-lecture" }, "Le temps qu'il fait dans la nuit"), /* @__PURE__ */ React.createElement("p", { className: "meta mt-s op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "m\xE9t\xE9o de l'inconscient")), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "chamber-card",
      onClick: () => go("annales"),
      style: { opacity: ((voute == null ? void 0 : voute.annales_circulating_count) || 0) > 0 ? 1 : 0.55 }
    },
    /* @__PURE__ */ React.createElement("h3", { className: "h3-lecture" }, "Tenu ensemble"),
    /* @__PURE__ */ React.createElement("p", { className: "meta mt-s op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, (voute == null ? void 0 : voute.annales_circulating_count) ? `${voute.annales_circulating_count} annale(s) en circulation` : "r\xEAves et travers\xE9es offerts au collectif")
  ), /* @__PURE__ */ React.createElement("button", { className: "chamber-card", onClick: () => go("polyphonie") }, /* @__PURE__ */ React.createElement("h3", { className: "h3-lecture" }, "Polyphonie de la lune"), /* @__PURE__ */ React.createElement("p", { className: "meta mt-s op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, ((_b = voute == null ? void 0 : voute.polyphonie) == null ? void 0 : _b.lunar_phase) || "lecture longue")))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const Meteo = ({ go }) => {
  var _a;
  const [meteos, setMeteos] = useS2([]);
  const [loading, setLoading] = useS2(true);
  useE2(() => {
    let cancelled = false;
    window.DreamAPI.getMeteo({ limit: 4 }).then((d) => {
      if (cancelled) return;
      setMeteos((d == null ? void 0 : d.meteos) || []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const latest = meteos[0];
  const topMotif = (_a = latest == null ? void 0 : latest.top_motifs) == null ? void 0 : _a[0];
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("anima"), label: "anima mundi" }), /* @__PURE__ */ React.createElement("div", { className: "frame" }, /* @__PURE__ */ React.createElement("h2", { className: "h2-section mb-s" }, "Le temps qu'il fait dans la nuit"), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mb-xl", style: { maxWidth: 560, textWrap: "pretty" } }, loading ? "la m\xE9t\xE9o se compose\u2026" : topMotif ? `Cette p\xE9riode, le motif ${topMotif.motif || topMotif} revient le plus.` : "Cette lune, l'humanit\xE9 a r\xEAv\xE9 d'eau. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit, d'estuaires qui se forment."), /* @__PURE__ */ React.createElement("div", { className: "text-center mb-xl" }, /* @__PURE__ */ React.createElement("svg", { width: "80", height: "80", viewBox: "0 0 80 80", style: { opacity: 0.7 } }, /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M40 15 Q28 30 28 45 Q28 60 40 68 Q52 60 52 45 Q52 30 40 15 Z",
      fill: "none",
      stroke: "var(--stone-cool)",
      strokeWidth: "0.75"
    }
  ), /* @__PURE__ */ React.createElement(
    "path",
    {
      d: "M40 25 Q33 35 33 48 Q33 58 40 62",
      fill: "none",
      stroke: "var(--stone-cool)",
      strokeWidth: "0.5",
      opacity: "0.6"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "meta mt-s", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "eau")), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("h4", { className: "h4-repere mb-m", style: { fontSize: 17, color: "var(--ash-light)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "lowercase" } }, "\u25BD nuages th\xE9matiques"), /* @__PURE__ */ React.createElement("div", { className: "stack gap-m mb-xl" }, [
    "Beaucoup de portes qui ne s'ouvrent pas tout de suite.",
    "Des animaux qui parlent doucement, sans urgence.",
    "Des d\xE9funts qui reviennent pour faire la cuisine."
  ].map((t, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "card", style: { padding: "var(--s-4)" } }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { fontSize: 18, margin: 0, textWrap: "pretty" } }, t)))), /* @__PURE__ */ React.createElement("h4", { className: "h4-repere mb-m", style: { fontSize: 17, color: "var(--ash-light)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "lowercase" } }, "\u25BD tournures qui montent"), /* @__PURE__ */ React.createElement("div", { className: "stack gap-m mb-xl" }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { fontSize: 18, textWrap: "pretty" } }, "L'eau revient plus que le feu cette saison."), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { fontSize: 18, textWrap: "pretty" } }, "Les paysages se font plus vastes ; les pi\xE8ces ferm\xE9es se font plus rares.")), /* @__PURE__ */ React.createElement("h4", { className: "h4-repere mb-m", style: { fontSize: 17, color: "var(--ash-light)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "lowercase" } }, "\u25BD journal de vie collectif"), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mb-xl", style: { fontSize: 18, textWrap: "pretty" } }, "Beaucoup de questions sur le travail cette lune. Le motif du seuil-\xE0-traverser revient \u2014 choix de carri\xE8re, rupture, d\xE9m\xE9nagement."), /* @__PURE__ */ React.createElement("div", { className: "meta op-50 mt-xl", style: { fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em" } }, (latest == null ? void 0 : latest.computed_at) ? `recalcul\xE9e ${new Date(latest.computed_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} \xB7 d\xE9lai rituel 14 j` : "recalcul\xE9e r\xE9guli\xE8rement \xB7 d\xE9lai rituel 14 j \xB7 prochaine : nouvelle lune")), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const Polyphonie = ({ go }) => {
  const [polyphonies, setPolyphonies] = useS2([]);
  const [loading, setLoading] = useS2(true);
  useE2(() => {
    let cancelled = false;
    window.DreamAPI.getPolyphonie({ limit: 6 }).then((d) => {
      if (cancelled) return;
      setPolyphonies((d == null ? void 0 : d.polyphonies) || []);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  const latest = polyphonies[0];
  const earlier = polyphonies.slice(1);
  const lunarLabel = (latest == null ? void 0 : latest.lunar_phase) || "lecture longue";
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter" }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("anima"), label: "anima mundi" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { maxWidth: 640 } }, /* @__PURE__ */ React.createElement("h2", { className: "h2-section mb-l" }, "Polyphonie \xB7 ", lunarLabel), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.7, color: "var(--bone)" } }, loading ? /* @__PURE__ */ React.createElement("p", { className: "meta op-50", style: { fontStyle: "italic" } }, "la polyphonie s'\xE9crit\u2026") : (latest == null ? void 0 : latest.narrative_text) ? latest.narrative_text.split(/\n\n+/).map((para, i) => /* @__PURE__ */ React.createElement("p", { key: i, style: { textWrap: "pretty" } }, para)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { style: { textWrap: "pretty" } }, "Plusieurs ont r\xEAv\xE9 d'eau cette lune. Pas de temp\xEAtes \u2014 d'eau qui se cherche un lit, d'estuaires qui se forment. Et plusieurs ont \xE9crit des doutes sur leur travail."), /* @__PURE__ */ React.createElement("p", { style: { textWrap: "pretty" } }, "\xC0 la lumi\xE8re de Bachelard, on pourrait entendre dans ces eaux cherchant leur lit la m\xEAme chose que dans ces questions de seuil : une fluidit\xE9 qui demande \xE0 se poser quelque part, sans encore savoir o\xF9. L'eau, ici, n'est pas celle qui noie. C'est celle qui h\xE9site avant de prendre sa forme."), /* @__PURE__ */ React.createElement("p", { style: { textWrap: "pretty" } }, "Aizenstat aurait invit\xE9 \xE0 tenir la grand-m\xE8re qui revient \u2014 plusieurs l'ont vue cette lune, dans des cuisines sans feu, avec du linge \xE0 laver. Elle n'est pas figure de pass\xE9. Elle est figure qui travaille quelque chose qui n'a pas encore de nom."), /* @__PURE__ */ React.createElement("p", { style: { textWrap: "pretty" } }, "Et Moss, on l'imagine dire : les ponts inachev\xE9s qui reviennent en synchronicit\xE9 ne demandent peut-\xEAtre pas \xE0 \xEAtre finis. Ils demandent \xE0 \xEAtre regard\xE9s, depuis les deux rives \xE0 la fois."), /* @__PURE__ */ React.createElement("p", { style: { textWrap: "pretty", fontStyle: "italic", marginTop: "var(--s-5)" } }, "Que se cherche-t-elle, l'eau qui cherche son lit ?"))), /* @__PURE__ */ React.createElement("div", { className: "divider" }), /* @__PURE__ */ React.createElement("div", { className: "meta", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14 } }, "voix mobilis\xE9es cette lune"), /* @__PURE__ */ React.createElement("div", { className: "mt-s meta-mono" }, (latest == null ? void 0 : latest.voices_mobilisees) && latest.voices_mobilisees.length > 0 ? latest.voices_mobilisees.join(" \xB7 ") : "Aizenstat \xB7 Moss \xB7 Bachelard"), /* @__PURE__ */ React.createElement("div", { className: "divider-moon" }, "lectures pr\xE9c\xE9dentes"), /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, earlier.length > 0 ? earlier.map((p) => /* @__PURE__ */ React.createElement("button", { key: p.id, className: "btn-text text-center", style: { fontSize: 15 } }, "\u2022 ", p.lunar_phase || new Date(p.period_end).toLocaleDateString("fr-FR", { month: "long" }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { className: "btn-text text-center", style: { fontSize: 15 } }, "\u2022 lune pr\xE9c\xE9dente")))), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
const Chat = ({ go, contextId }) => {
  const [messages, setMessages] = useS2([
    { from: "ai", text: "Avant que je te propose quoi que ce soit, dis-moi : qu'est-ce que tu vois l\xE0, en regardant ce kairos ?" }
  ]);
  const [input, setInput] = useS2("");
  const [thinking, setThinking] = useS2(false);
  const [streaming, setStreaming] = useS2("");
  const send = async () => {
    if (!input.trim() || thinking) return;
    const userMsg = input.trim();
    setMessages((m) => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setThinking(true);
    setStreaming("");
    const apiMessages = messages.map((m) => ({ role: m.from === "ai" ? "assistant" : "user", content: m.text })).concat([{ role: "user", content: userMsg }]);
    let buffer = "";
    try {
      await window.DreamAPI.chat({
        messages: apiMessages,
        mode: "dream",
        dreamId: contextId || null,
        locale: "fr",
        onChunk: (chunk) => {
          buffer += chunk;
          setStreaming(buffer);
        },
        onDone: () => {
          if (buffer.trim()) {
            setMessages((m) => [...m, { from: "ai", text: buffer.trim() }]);
          }
          setStreaming("");
          setThinking(false);
        },
        onError: (msg) => {
          setMessages((m) => [...m, { from: "ai", text: msg ? "Le lien est gard\xE9. (" + msg + ") Reviens quand tu peux." : "Le lien est gard\xE9. Reviens quand tu peux." }]);
          setStreaming("");
          setThinking(false);
        }
      });
    } catch (e) {
      setMessages((m) => [...m, { from: "ai", text: "Le lien est gard\xE9. Reviens quand tu peux." }]);
      setStreaming("");
      setThinking(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stage screen-enter", style: { background: "var(--night-warm)" } }, /* @__PURE__ */ React.createElement(TopNav, { showBack: true, onBack: () => go("kairos", contextId || "k-08"), label: "" }), /* @__PURE__ */ React.createElement("div", { className: "frame", style: { display: "flex", flexDirection: "column", minHeight: "calc(100vh - 60px)" } }, /* @__PURE__ */ React.createElement("div", { className: "meta mb-l", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "mode \xB7 exploration de kairos"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", flexDirection: "column", gap: "var(--s-4)" } }, messages.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "bubble " + m.from, style: { textWrap: "pretty", whiteSpace: "pre-wrap" } }, m.text)), streaming && /* @__PURE__ */ React.createElement("div", { className: "bubble ai", style: { textWrap: "pretty", whiteSpace: "pre-wrap" } }, streaming, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.4 } }, "\u258D")), thinking && !streaming && /* @__PURE__ */ React.createElement("div", { className: "bubble ai", style: { opacity: 0.7, fontStyle: "italic" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", animation: "halo-slow 2s ease-in-out infinite" } }, "les liens se tissent\u2026"))), /* @__PURE__ */ React.createElement("div", { className: "mt-l" }, /* @__PURE__ */ React.createElement("div", { className: "row gap-s", style: { alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: input,
      onChange: (e) => setInput(e.target.value),
      onKeyDown: (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      },
      rows: 1,
      placeholder: "ce qui vient\u2026",
      style: {
        flex: 1,
        background: "transparent",
        border: "1px solid var(--ash-deep)",
        padding: "12px 16px",
        color: "var(--bone)",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 16,
        resize: "none",
        outline: "none",
        minHeight: 44
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onClick: send,
      disabled: !input.trim() || thinking,
      style: { opacity: !input.trim() || thinking ? 0.4 : 1 }
    },
    "envoyer"
  )), /* @__PURE__ */ React.createElement("div", { className: "meta op-70 mt-s", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "voix mobilis\xE9es \xB7 gendlin \xB7 moss")), messages.length >= 3 && /* @__PURE__ */ React.createElement(window.AhaCapture, { context: "chat-narratrice", onClose: () => {
  } }), window.ExitToHuman && /* @__PURE__ */ React.createElement(window.ExitToHuman, null)), window.FeedbackFloat && /* @__PURE__ */ React.createElement(window.FeedbackFloat, null));
};
Object.assign(window, { KairosDetail, Portrait, AnimaVoute, Meteo, Polyphonie, Chat, Modal, Constellation });
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1kZWVwLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG5jb25zdCB7IHVzZVN0YXRlOiB1c2VTMiwgdXNlRWZmZWN0OiB1c2VFMiwgdXNlUmVmOiB1c2VSMiwgdXNlTWVtbzogdXNlTTIgfSA9IFJlYWN0O1xuXG4vLyBcdTI1MDBcdTI1MDAgRm9yZXN0IDMgQW5nbGVzIFNrZWxldG9uIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gMjAyNi0wNC0yNyBcdTIwMTQgU3ByaW50IFAwLjUgKERlc2lnbiBcdTAwQTcxMS5iaXMuMTkpXG4vLyAzIGNhcmRzIHZlcnRpY2FsZXMgc2lkZS1ieS1zaWRlIGF2ZWMgc2hpbW1lciBtYXR0ZXIgKHBhcGVyL3N0b25lL3NpbGspLlxuLy8gSGFsbyByZXNwaXJlIGF1LWRlc3N1cyArIG1lc3NhZ2Ugcm90YXRpbmcgXCJsYSBmb3JcdTAwRUF0IGNvbnZvcXVlIHNlcyB2b2l4XHUyMDI2XCIuXG5jb25zdCBGb3Jlc3RUaHJlZUFuZ2xlc1NrZWxldG9uID0gKHsgbWF0dGVyQ29sb3IgfSkgPT4ge1xuICBjb25zdCBTaGltID0gd2luZG93LlNrZWxldG9uU2hpbW1lcjtcbiAgY29uc3QgSGFsbyA9IHdpbmRvdy5Mb2FkaW5nSGFsbztcbiAgY29uc3QgdXNlUm90YXRpbmcgPSB3aW5kb3cudXNlUm90YXRpbmdNZXNzYWdlO1xuICBjb25zdCBtZXNzYWdlcyA9IFtcbiAgICBcImxhIGZvclx1MDBFQXQgY29udm9xdWUgc2VzIHZvaXhcdTIwMjZcIixcbiAgICBcInRyb2lzIGFuZ2xlcyBjaGVyY2hlbnQgdG9uIGthaXJvc1x1MjAyNlwiLFxuICAgIFwiXHUwMEU5Y291dGVyIGNlIHF1aSB0ZSB0b3VjaGVcdTIwMjZcIixcbiAgXTtcbiAgY29uc3QgbWVzc2FnZSA9IHVzZVJvdGF0aW5nID8gdXNlUm90YXRpbmcobWVzc2FnZXMsIDI0MDApIDogbWVzc2FnZXNbMF07XG5cbiAgaWYgKCFTaGltIHx8ICFIYWxvKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy02KVwiLCBvcGFjaXR5OiAwLjcgfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YVwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICB7bWVzc2FnZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgY29uc3QgbWF0dGVycyA9IFtcInBhcGVyXCIsIFwic3RvbmVcIiwgXCJzaWxrXCJdO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJkcmVhbS1za2VsZXRvbi1mYWRlLWluIHN0YWNrIGdhcC1tXCI+XG4gICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiwgcGFkZGluZzogXCJ2YXIoLS1zLTMpIDBcIiB9fT5cbiAgICAgICAgPEhhbG8gc2l6ZT17Mjh9IG1lc3NhZ2U9e21lc3NhZ2V9IGRhcms9e3RydWV9IC8+XG4gICAgICA8L2Rpdj5cbiAgICAgIHttYXR0ZXJzLm1hcChtID0+IHtcbiAgICAgICAgY29uc3QgY29sb3IgPSAobWF0dGVyQ29sb3IgJiYgbWF0dGVyQ29sb3JbbV0pIHx8IFwidmFyKC0tcGFwZXItd2FybSlcIjtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2IGtleT17bX0gY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7XG4gICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNSlcIixcbiAgICAgICAgICAgIGJvcmRlckNvbG9yOiBjb2xvcixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCBcIiArIGNvbG9yICsgXCIgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogMTQsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7LyogQ2l0YXRpb24gc2ltdWxcdTAwRTllIFx1MjAxNCAzIGxpZ25lcyAqL31cbiAgICAgICAgICAgIDxTaGltIGxpbmVzPXszfSBoZWlnaHQ9ezE0fSBnYXA9ezEwfSBkYXJrPXt0cnVlfSBsYXN0TGluZVdpZHRoPVwiNjglXCIgLz5cbiAgICAgICAgICAgIHsvKiBBbmdsZSBzaW11bFx1MDBFOSBcdTIwMTQgMiBsaWduZXMgcGx1cyBvcGFxdWVzICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDggfX0+XG4gICAgICAgICAgICAgIDxTaGltIGxpbmVzPXsyfSBoZWlnaHQ9ezExfSBnYXA9ezl9IGRhcms9e3RydWV9IGxhc3RMaW5lV2lkdGg9XCI1MiVcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7LyogU291cmNlIG1vbm8gdXBwZXJjYXNlICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Ub3A6IDYsIG9wYWNpdHk6IDAuNiB9fT5cbiAgICAgICAgICAgICAgPFNoaW0gbGluZXM9ezF9IGhlaWdodD17OX0gZGFyaz17dHJ1ZX0gd2lkdGg9XCIzOCVcIiAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBEXHUwMEU5dGFpbCBLYWlyb3MgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBSZWZvbnRlIDIwMjYtMDQtMjUgXHUyMDE0IEJpYmxlIFx1MDBBNzIuMiBQLUludmVyc2lvbiBPcmFjdWxhaXJlICsgRGVzaWduIFx1MDBBNzcuM1xuLy8gICA0IGFjdGlvbnMgZGlzY3JcdTAwRTh0ZXMgZW4gYmFzIChqYW1haXMgaW1wb3NcdTAwRTllcykgOlxuLy8gICAgIDEuIHF1ZSB2b2lzLXR1ID8gICAgICBcdTIxOTIgVVNFUl9GSVJTVF9SRUFESU5HIChzaGVldCBwbGVpbiBcdTAwRTljcmFuIGZvbmQgbmlnaHQtd2FybSArIHBhcGVyKVxuLy8gICAgIDIuIGRlbWFuZGVyIFx1MDBFMCBsYSBmb3JcdTAwRUF0IFx1MjE5MiAzIGFuZ2xlcyBwb2x5cGhvbmlxdWVzIChwYXBlci9zdG9uZS9zaWxrKSBcdTIwMTQgQVBSXHUwMEM4UyB1c2VyX2ZpcnN0XG4vLyAgICAgMy4gXHUwMEU5Y2hvcyBkZXB1aXMgbGUgcGFzc1x1MDBFOSBcdTIxOTIga2Fpcm9zIHBhc3NcdTAwRTlzIHF1aSByXHUwMEU5c29ubmVudCAoc2hlZXQpXG4vLyAgICAgNC4gYnJcdTAwRkJsZXIgICAgICAgICAgICAgIFx1MjE5MiBCVVJOX1JJVFVBTCB+MzBzIGNvbmZpcm1hdGlvbiB2aXN1ZWxsZVxuLy8gICBBcHJcdTAwRThzIGNoYXF1ZSBsZWN0dXJlIDogRkVMVF9TSElGVF9HQVRFICg2IHpvbmVzIGNvcnBzKSArIEFIQV9DQVBUVVJFICgzIG5pdmVhdXggKyBub3RlKVxuY29uc3QgS2Fpcm9zRGV0YWlsID0gKHsgZ28sIGVudHJ5LCBhbGxFbnRyaWVzIH0pID0+IHtcbiAgLy8gU2hlZXQgY291cmFudGUgOiBudWxsIHwgJ3VzZXJfZmlyc3QnIHwgJ2ZvcmVzdCcgfCAnZWNob2VzJyB8ICdidXJuJ1xuICBjb25zdCBbc2hlZXQsIHNldFNoZWV0XSA9IHVzZVMyKG51bGwpO1xuICBjb25zdCBbdXNlclJlYWRpbmcsIHNldFVzZXJSZWFkaW5nXSA9IHVzZVMyKFwiXCIpO1xuICBjb25zdCBbcmVhZGluZ1N1Ym1pdHRlZCwgc2V0UmVhZGluZ1N1Ym1pdHRlZF0gPSB1c2VTMihmYWxzZSk7XG5cbiAgLy8gRm9yZXN0IHJlYWRpbmcgc3RhdGVcbiAgY29uc3QgW2ZvcmVzdEFuZ2xlcywgc2V0Rm9yZXN0QW5nbGVzXSA9IHVzZVMyKG51bGwpO1xuICBjb25zdCBbZm9yZXN0RnJhbWluZywgc2V0Rm9yZXN0RnJhbWluZ10gPSB1c2VTMihcIlwiKTtcbiAgY29uc3QgW2ZvcmVzdExvYWRpbmcsIHNldEZvcmVzdExvYWRpbmddID0gdXNlUzIoZmFsc2UpO1xuICBjb25zdCBbZm9yZXN0RXJyb3IsIHNldEZvcmVzdEVycm9yXSA9IHVzZVMyKFwiXCIpO1xuXG4gIC8vIEZFTFRfU0hJRlRfR0FURSArIEFIQV9DQVBUVVJFIHN0YXRlIFx1MjAxNCBwYXJ0YWdcdTAwRTkgcGFyIGxlcyBzaGVldHMgZGUgbGVjdHVyZVxuICAvLyBjdXJyZW50UmVhZGluZyA6IHsga2luZDogJ2ZvcmVzdCd8J2VjaG8nfCd0YWxlJ3wndXNlcl9maXJzdCcsIHNuYXBzaG90PzogYW55IH1cbiAgY29uc3QgW2N1cnJlbnRSZWFkaW5nLCBzZXRDdXJyZW50UmVhZGluZ10gPSB1c2VTMihudWxsKTtcbiAgY29uc3QgW2ZlbHRTaGlmdCwgc2V0RmVsdFNoaWZ0XSA9IHVzZVMyKG51bGwpO1xuICBjb25zdCBbYWhhTGV2ZWwsIHNldEFoYUxldmVsXSA9IHVzZVMyKG51bGwpO1xuICBjb25zdCBbYWhhTm90ZSwgc2V0QWhhTm90ZV0gPSB1c2VTMihcIlwiKTtcbiAgY29uc3QgW2ZlZWRiYWNrUG9zdGVkLCBzZXRGZWVkYmFja1Bvc3RlZF0gPSB1c2VTMihmYWxzZSk7XG5cbiAgLy8gQnVybiByaXR1YWwgY291bnRkb3duXG4gIGNvbnN0IFtidXJuQ291bnRkb3duLCBzZXRCdXJuQ291bnRkb3duXSA9IHVzZVMyKDApO1xuICBjb25zdCBidXJuVGltZXJSZWYgPSB1c2VSMihudWxsKTtcblxuICAvLyBMaXZlIGRhdGEgZnJvbSBBUEkgOiBmdWxsIGthaXJvcyBkZXRhaWwgKyBlY2hvZXNcbiAgY29uc3QgW2Z1bGxLYWlyb3MsIHNldEZ1bGxLYWlyb3NdID0gdXNlUzIoZW50cnkpO1xuICBjb25zdCBbYXBpRWNob2VzLCBzZXRBcGlFY2hvZXNdID0gdXNlUzIoW10pO1xuICBjb25zdCBbcHJvcGhldGllcywgc2V0UHJvcGhldGllc10gPSB1c2VTMihbXSk7XG4gIGNvbnN0IFtsb2FkaW5nRGV0YWlsLCBzZXRMb2FkaW5nRGV0YWlsXSA9IHVzZVMyKGZhbHNlKTtcblxuICAvLyBGLjIgXHUyMDE0IE1vZGFsIFNhbmN0dWFpcmUgYXV0by1kXHUwMEU5Y2xlbmNoXHUwMEU5ZSBzdXIgY2F1Y2hlbWFyIChcdTAwQTcxMS5iaXMuMjAuMTMpXG4gIC8vIENvbmRpdGlvbnMgOiBlbnRyeS5pc19uaWdodG1hcmUgPT09IHRydWUgT1UgdmFsZW5jZSA8IC0wLjYgT1UgaXNfZ3JpZWZfcmVsYXRlZFxuICAvLyBVbmUgc2V1bGUgZm9pcyBwYXIga2Fpcm9zIChsb2NhbFN0b3JhZ2UgZmxhZyBwb3VyIG5lIHBhcyBzcGFtKVxuICBjb25zdCBbc2hvd1NhbmN0dWFpcmVNb2RhbCwgc2V0U2hvd1NhbmN0dWFpcmVNb2RhbF0gPSB1c2VTMihmYWxzZSk7XG5cbiAgdXNlRTIoKCkgPT4ge1xuICAgIGlmICghZW50cnk/LmlkKSByZXR1cm47XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHNldExvYWRpbmdEZXRhaWwodHJ1ZSk7XG4gICAgUHJvbWlzZS5hbGwoW1xuICAgICAgd2luZG93LkRyZWFtQVBJLmdldEthaXJvcyhlbnRyeS5pZCkuY2F0Y2goKCkgPT4gbnVsbCksXG4gICAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0RWNob2VzRm9yS2Fpcm9zKGVudHJ5LmlkLCB7IGxpbWl0OiA2IH0pLmNhdGNoKCgpID0+ICh7IGVjaG9lczogW10gfSkpLFxuICAgICAgd2luZG93LkRyZWFtQVBJLmdldFByb3BoZWN5Rm9yS2Fpcm9zKGVudHJ5LmlkKS5jYXRjaCgoKSA9PiAoeyBwcm9waGV0aWVzOiBbXSB9KSksXG4gICAgXSkudGhlbigoW2tEYXRhLCBlY2hvRGF0YSwgcHJvcGhEYXRhXSkgPT4ge1xuICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgaWYgKGtEYXRhPy5rYWlyb3MpIHtcbiAgICAgICAgY29uc3QgbWVyZ2VkID0geyAuLi5lbnRyeSwgLi4ua0RhdGEua2Fpcm9zIH07XG4gICAgICAgIHNldEZ1bGxLYWlyb3MobWVyZ2VkKTtcbiAgICAgICAgaWYgKGtEYXRhLmthaXJvcy51c2VyX2ZpcnN0X3JlYWRpbmdfc3VibWl0dGVkKSBzZXRSZWFkaW5nU3VibWl0dGVkKHRydWUpO1xuXG4gICAgICAgIC8vIEYuMiBcdTIwMTQgYXV0by10cmlnZ2VyIE5pZ2h0bWFyZURlcG9zaXRDaG9pY2VNb2RhbCBzaSBjb25kaXRpb24gKyBwYXMgZFx1MDBFOWpcdTAwRTAgdnVlXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgdmFsZW5jZSA9IHR5cGVvZiBtZXJnZWQudmFsZW5jZSA9PT0gXCJudW1iZXJcIiA/IG1lcmdlZC52YWxlbmNlIDogbnVsbDtcbiAgICAgICAgICBjb25zdCBpc05pZ2h0bWFyZUxpa2UgPVxuICAgICAgICAgICAgbWVyZ2VkLmlzX25pZ2h0bWFyZSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgbWVyZ2VkLmlzX2dyaWVmX3JlbGF0ZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgICh2YWxlbmNlICE9PSBudWxsICYmIHZhbGVuY2UgPCAtMC42KTtcbiAgICAgICAgICBpZiAoaXNOaWdodG1hcmVMaWtlICYmIHdpbmRvdy5OaWdodG1hcmVEZXBvc2l0Q2hvaWNlTW9kYWwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlZW5LZXkgPSBcImRyZWFtOnNhbmN0dWFpcmU6c2VlbjpcIiArIG1lcmdlZC5pZDtcbiAgICAgICAgICAgIGNvbnN0IGFscmVhZHlTZWVuID0gKCgpID0+IHtcbiAgICAgICAgICAgICAgdHJ5IHsgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKHNlZW5LZXkpID09PSBcIjFcIjsgfSBjYXRjaCB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIGlmICghYWxyZWFkeVNlZW4pIHtcbiAgICAgICAgICAgICAgLy8gUGV0aXQgZFx1MDBFOWxhaSBwb3VyIGxhaXNzZXIgbGUgZFx1MDBFOXRhaWwgcydhbmltZXIgZW4gcHJlbWllciAofjYwMG1zKVxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhbmNlbGxlZCkgc2V0U2hvd1NhbmN0dWFpcmVNb2RhbCh0cnVlKTtcbiAgICAgICAgICAgICAgfSwgNjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcIltLYWlyb3NEZXRhaWxdIHNhbmN0dWFpcmUgYXV0by1jaGVjayBmYWlsZWQ6XCIsIGVyciAmJiBlcnIubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHNldEFwaUVjaG9lcyhlY2hvRGF0YT8uZWNob2VzIHx8IFtdKTtcbiAgICAgIGNvbnN0IHByb3BzID0gcHJvcGhEYXRhPy5wcm9waGV0aWVzIHx8IFtdO1xuICAgICAgc2V0UHJvcGhldGllcyhwcm9wcyk7XG4gICAgICBzZXRMb2FkaW5nRGV0YWlsKGZhbHNlKTtcbiAgICAgIGlmIChwcm9wcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRyeSB7IHdpbmRvdy53b3dSZWdpc3RyeT8uZmlyZT8uKFwicHJlbWllci1lY2hvLXByb3BoZXRpcXVlXCIpOyB9IGNhdGNoIHt9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW2VudHJ5Py5pZF0pO1xuXG4gIC8vIENvbXBvc2UgZWNob2VzIGxpc3QgOiBwcmVmZXIgbGl2ZSBBUEksIGZhbGwgYmFjayB0byBhbGxFbnRyaWVzIHNpYmxpbmdzXG4gIGNvbnN0IGVjaG9lcyA9IChhcGlFY2hvZXMubGVuZ3RoID4gMClcbiAgICA/IGFwaUVjaG9lcy5zbGljZSgwLCA2KS5tYXAoZSA9PiAoe1xuICAgICAgICBpZDogZS5vdGhlcl9pZCB8fCBlLmlkLFxuICAgICAgICB3aGVuOiB3aW5kb3cuRHJlYW1BUEkuX3JlbGF0aXZlV2hlbiA/IHdpbmRvdy5EcmVhbUFQSS5fcmVsYXRpdmVXaGVuKGUuY3JlYXRlZF9hdCkgOiBcIlwiLFxuICAgICAgICB0eXBlOiB3aW5kb3cuRHJlYW1BUEkuX21hcFR5cGVGcm9tQmFja2VuZFxuICAgICAgICAgID8gd2luZG93LkRyZWFtQVBJLl9tYXBUeXBlRnJvbUJhY2tlbmQoZS5rYWlyb3NfdHlwZSB8fCBcInJldmVcIilcbiAgICAgICAgICA6IFwiZHJlYW1fbmlnaHRcIixcbiAgICAgICAgdGV4dDogZS5wcmV2aWV3IHx8IFwiXCIsXG4gICAgICAgIHByb3BoZXRpYzogZmFsc2UsXG4gICAgICB9KSlcbiAgICA6IChhbGxFbnRyaWVzIHx8IFtdKS5maWx0ZXIoZSA9PiBlLmlkICE9PSBlbnRyeS5pZCkuc2xpY2UoMCwgNikubWFwKGUgPT4gKHsgLi4uZSwgcHJvcGhldGljOiBmYWxzZSB9KSk7XG5cbiAgY29uc3QgcHJvcGhldGljRWNob2VzID0gKHByb3BoZXRpZXMgfHwgW10pLnNsaWNlKDAsIDMpLm1hcChwID0+ICh7XG4gICAgaWQ6IHAucGFzdF9pZCxcbiAgICB3aGVuOiB3aW5kb3cuRHJlYW1BUEkuX3JlbGF0aXZlV2hlbiA/IHdpbmRvdy5EcmVhbUFQSS5fcmVsYXRpdmVXaGVuKHAuY3JlYXRlZF9hdCkgOiBcIlwiLFxuICAgIHR5cGU6IFwiZHJlYW1fbmlnaHRcIixcbiAgICB0ZXh0OiBwLnByZXZpZXcgfHwgXCJcIixcbiAgICBwcm9waGV0aWM6IHRydWUsXG4gIH0pKTtcblxuICBjb25zdCBhbGxFY2hvZXMgPSBbLi4ucHJvcGhldGljRWNob2VzLCAuLi5lY2hvZXNdO1xuXG4gIC8vIFJlc2V0IGZlZWRiYWNrIHN0YXRlIHdoZW4gb3BlbmluZyBhIG5ldyByZWFkaW5nXG4gIGNvbnN0IG9wZW5SZWFkaW5nRmVlZGJhY2sgPSAoa2luZCwgc25hcHNob3QgPSBudWxsKSA9PiB7XG4gICAgc2V0Q3VycmVudFJlYWRpbmcoeyBraW5kLCBzbmFwc2hvdCB9KTtcbiAgICBzZXRGZWx0U2hpZnQobnVsbCk7XG4gICAgc2V0QWhhTGV2ZWwobnVsbCk7XG4gICAgc2V0QWhhTm90ZShcIlwiKTtcbiAgICBzZXRGZWVkYmFja1Bvc3RlZChmYWxzZSk7XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIFVTRVJfRklSU1RfUkVBRElORyBcdTI1MDBcdTI1MDBcbiAgY29uc3Qgc3VibWl0VXNlclJlYWRpbmcgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKHVzZXJSZWFkaW5nLnRyaW0oKS5sZW5ndGggPCA0KSByZXR1cm47XG4gICAgc2V0UmVhZGluZ1N1Ym1pdHRlZCh0cnVlKTtcbiAgICBpZiAoZW50cnk/LmlkKSB7XG4gICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkudXBkYXRlS2Fpcm9zKGVudHJ5LmlkLCB7IHVzZXJfZmlyc3RfcmVhZGluZ19zdWJtaXR0ZWQ6IHRydWUgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgaWYgKHVzZXJSZWFkaW5nLnRyaW0oKSkge1xuICAgICAgICBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuYW5ub3RhdGVLYWlyb3MoZW50cnkuaWQsIHVzZXJSZWFkaW5nLnRyaW0oKSkuY2F0Y2goKCkgPT4ge30pO1xuICAgICAgfVxuICAgIH1cbiAgICBvcGVuUmVhZGluZ0ZlZWRiYWNrKFwidXNlcl9maXJzdFwiKTtcbiAgICBzZXRTaGVldChudWxsKTtcbiAgfTtcblxuICAvLyBcdTI1MDBcdTI1MDAgRk9SRVNUX1JFQURJTkcgXHUyNTAwXHUyNTAwXG4gIGNvbnN0IGFza0ZvcmVzdCA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoIWVudHJ5Py5pZCkgcmV0dXJuO1xuICAgIHNldFNoZWV0KFwiZm9yZXN0XCIpO1xuICAgIGlmIChmb3Jlc3RBbmdsZXMpIHJldHVybjsgLy8gZFx1MDBFOWpcdTAwRTAgY2hhcmdcdTAwRTlcbiAgICBzZXRGb3Jlc3RMb2FkaW5nKHRydWUpO1xuICAgIHNldEZvcmVzdEVycm9yKFwiXCIpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuZm9yZXN0UmVhZGluZyhlbnRyeS5pZCwge1xuICAgICAgICB1c2VyX2ZpcnN0X3JlYWRpbmc6IHVzZXJSZWFkaW5nLnRyaW0oKSB8fCBudWxsLFxuICAgICAgfSk7XG4gICAgICBzZXRGb3Jlc3RBbmdsZXMocmVzPy5hbmdsZXMgfHwgW10pO1xuICAgICAgc2V0Rm9yZXN0RnJhbWluZyhyZXM/LmZyYW1pbmcgfHwgXCJcIik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0Rm9yZXN0RXJyb3IoXCJsYSBmb3JcdTAwRUF0IG4nYSBwYXMgclx1MDBFOXBvbmR1LiByZXZpZW5zIHRvdXQgXHUwMEUwIGwnaGV1cmUuXCIpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRGb3Jlc3RMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gQWZ0ZXIgdmlld2luZyB0aGUgMyBhbmdsZXMsIHByZXBhcmUgRkVMVF9TSElGVCArIEFIQVxuICBjb25zdCBhY2tub3dsZWRnZUZvcmVzdCA9ICgpID0+IHtcbiAgICBvcGVuUmVhZGluZ0ZlZWRiYWNrKFwiZm9yZXN0XCIsIGZvcmVzdEFuZ2xlcyk7XG4gIH07XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEJVUk4gcml0dWFsIDogMzBzIGNvdW50ZG93biBcdTI1MDBcdTI1MDBcbiAgY29uc3Qgc3RhcnRCdXJuQ291bnRkb3duID0gKCkgPT4ge1xuICAgIHNldEJ1cm5Db3VudGRvd24oMzApO1xuICAgIGlmIChidXJuVGltZXJSZWYuY3VycmVudCkgY2xlYXJJbnRlcnZhbChidXJuVGltZXJSZWYuY3VycmVudCk7XG4gICAgYnVyblRpbWVyUmVmLmN1cnJlbnQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICBzZXRCdXJuQ291bnRkb3duKGMgPT4ge1xuICAgICAgICBpZiAoYyA8PSAxKSB7XG4gICAgICAgICAgY2xlYXJJbnRlcnZhbChidXJuVGltZXJSZWYuY3VycmVudCk7XG4gICAgICAgICAgYnVyblRpbWVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjIC0gMTtcbiAgICAgIH0pO1xuICAgIH0sIDEwMDApO1xuICB9O1xuXG4gIGNvbnN0IGNhbmNlbEJ1cm4gPSAoKSA9PiB7XG4gICAgaWYgKGJ1cm5UaW1lclJlZi5jdXJyZW50KSBjbGVhckludGVydmFsKGJ1cm5UaW1lclJlZi5jdXJyZW50KTtcbiAgICBidXJuVGltZXJSZWYuY3VycmVudCA9IG51bGw7XG4gICAgc2V0QnVybkNvdW50ZG93bigwKTtcbiAgICBzZXRTaGVldChudWxsKTtcbiAgfTtcblxuICBjb25zdCBjb25maXJtQnVybiA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoYnVybkNvdW50ZG93biA+IDApIHJldHVybjsgLy8gZG9pdCBhdHRlbmRyZSBsZSBjb3VudGRvd25cbiAgICBpZiAoIWVudHJ5Py5pZCkgcmV0dXJuO1xuICAgIGlmIChidXJuVGltZXJSZWYuY3VycmVudCkgY2xlYXJJbnRlcnZhbChidXJuVGltZXJSZWYuY3VycmVudCk7XG4gICAgYnVyblRpbWVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5kZWxldGVLYWlyb3MoZW50cnkuaWQpLmNhdGNoKCgpID0+IHt9KTtcbiAgICBpZiAod2luZG93LkRyZWFtUmVmcmVzaEVudHJpZXMpIHdpbmRvdy5EcmVhbVJlZnJlc2hFbnRyaWVzKCk7XG4gICAgZ28oXCJqb3VybmFsXCIpO1xuICB9O1xuXG4gIHVzZUUyKCgpID0+ICgpID0+IHtcbiAgICBpZiAoYnVyblRpbWVyUmVmLmN1cnJlbnQpIGNsZWFySW50ZXJ2YWwoYnVyblRpbWVyUmVmLmN1cnJlbnQpO1xuICB9LCBbXSk7XG5cbiAgLy8gXHUyNTAwXHUyNTAwIEZFTFRfU0hJRlQgKyBBSEEgc3VibWl0IFx1MjUwMFx1MjUwMFxuICBjb25zdCBzZW5kRmVlZGJhY2sgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFlbnRyeT8uaWQgfHwgIWN1cnJlbnRSZWFkaW5nKSByZXR1cm47XG4gICAgc2V0RmVlZGJhY2tQb3N0ZWQodHJ1ZSk7XG4gICAgYXdhaXQgd2luZG93LkRyZWFtQVBJLnN1Ym1pdEFoYUZlZWRiYWNrKGVudHJ5LmlkLCB7XG4gICAgICByZWFkaW5nX2tpbmQ6IGN1cnJlbnRSZWFkaW5nLmtpbmQsXG4gICAgICBmZWx0X3NoaWZ0X2xvY2F0aW9uOiBmZWx0U2hpZnQgfHwgdW5kZWZpbmVkLFxuICAgICAgYWhhX2xldmVsOiBhaGFMZXZlbCB8fCB1bmRlZmluZWQsXG4gICAgICBhaGFfbm90ZTogYWhhTm90ZS50cmltKCkgfHwgdW5kZWZpbmVkLFxuICAgICAgZm9yZXN0X3JlYWRpbmdfYW5nbGVzOiBjdXJyZW50UmVhZGluZy5raW5kID09PSBcImZvcmVzdFwiID8gY3VycmVudFJlYWRpbmcuc25hcHNob3QgOiB1bmRlZmluZWQsXG4gICAgfSkuY2F0Y2goKCkgPT4ge30pO1xuICAgIHNldFRpbWVvdXQoKCkgPT4gc2V0Q3VycmVudFJlYWRpbmcobnVsbCksIDE0MDApO1xuICB9O1xuXG4gIGNvbnN0IGRpc3BsYXkgPSBmdWxsS2Fpcm9zIHx8IGVudHJ5O1xuXG4gIC8vIFx1MjUwMFx1MjUwMCBNYXR0ZXIgY29sb3IgaGVscGVyIGZvciBGT1JFU1RfUkVBRElORyBjYXJkcyBcdTI1MDBcdTI1MDBcbiAgY29uc3QgbWF0dGVyQ29sb3IgPSB7XG4gICAgcGFwZXI6IFwidmFyKC0tcGFwZXItd2FybSlcIixcbiAgICBzdG9uZTogXCJ2YXIoLS1zdG9uZS1jb29sKVwiLFxuICAgIHNpbGs6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICB9O1xuXG4gIC8vIDIwMjYtMDQtMjkgXHUyMDE0IERcdTAwRTl0ZWN0aW9uIFx1MDBFOWNobyBwcm9waFx1MDBFOXRpcXVlIHBvdXIgb3ZlcmxheSAoWWVzaHVhKS5cbiAgLy8gVHJpZ2dlciB3aW5kb3cuZHJlYW1TaG93RWNob092ZXJsYXkgVU5FIEZPSVMgcGFyIGthaXJvcyBxdWFuZFxuICAvLyBwcm9waGV0aWVzWzBdIGFycml2ZSAoZWNob193aXRoX2VudHJ5X2lkKS4gbG9jYWxTdG9yYWdlIGZsYWcgcG91clxuICAvLyBuZSBwYXMgc3BhbSBzaSB1c2VyIHJldmllbnQgc3VyIGxlIGRcdTAwRTl0YWlsLlxuICB1c2VFMigoKSA9PiB7XG4gICAgaWYgKCFlbnRyeT8uaWQgfHwgcHJvcGhldGllcy5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICBjb25zdCBzZWVuS2V5ID0gXCJkcmVhbTplY2hvLW92ZXJsYXk6c2VlbjpcIiArIGVudHJ5LmlkO1xuICAgIGxldCBhbHJlYWR5U2VlbiA9IGZhbHNlO1xuICAgIHRyeSB7IGFscmVhZHlTZWVuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oc2VlbktleSkgPT09IFwiMVwiOyB9IGNhdGNoIHt9XG4gICAgaWYgKGFscmVhZHlTZWVuKSByZXR1cm47XG4gICAgY29uc3QgcCA9IHByb3BoZXRpZXNbMF07XG4gICAgY29uc3QgcHJlc2VudFRleHQgPSAoZGlzcGxheS50ZXh0IHx8IGRpc3BsYXkucmF3X3RleHQgfHwgXCJcIikudHJpbSgpO1xuICAgIGNvbnN0IHBhc3RUZXh0ID0gKHAucHJldmlldyB8fCBcIlwiKS50cmltKCk7XG4gICAgaWYgKCFwcmVzZW50VGV4dCB8fCAhcGFzdFRleHQpIHJldHVybjtcbiAgICAvLyBkYXlzQWdvIDogY29tcHV0ZSBkZXB1aXMgcC5jcmVhdGVkX2F0XG4gICAgbGV0IGRheXNBZ28gPSAwO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0ID0gbmV3IERhdGUocC5jcmVhdGVkX2F0KS5nZXRUaW1lKCk7XG4gICAgICBpZiAodCkgZGF5c0FnbyA9IE1hdGgubWF4KDAsIE1hdGguZmxvb3IoKERhdGUubm93KCkgLSB0KSAvICgyNCAqIDM2MDAgKiAxMDAwKSkpO1xuICAgIH0gY2F0Y2gge31cbiAgICAvLyBEXHUwMEU5bGFpIGxcdTAwRTlnZXIgcG91ciBsYWlzc2VyIEthaXJvc0RldGFpbCBzZSByZW5kcmVcbiAgICBjb25zdCB0bXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh3aW5kb3cuZHJlYW1TaG93RWNob092ZXJsYXkpIHtcbiAgICAgICAgICB3aW5kb3cuZHJlYW1TaG93RWNob092ZXJsYXkoe1xuICAgICAgICAgICAgcHJlc2VudFRleHQsIHBhc3RUZXh0LCBkYXlzQWdvLFxuICAgICAgICAgICAgb25EaXNtaXNzOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKHNlZW5LZXksIFwiMVwiKTsgfSBjYXRjaCB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICAvLyBUb3Vqb3VycyBtYXJxdWVyIHZ1IGFwclx1MDBFOHMgZGlzcGxheSAocXVlIHVzZXIgZGlzbWlzcyBvdSBwYXMpXG4gICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oc2VlbktleSwgXCIxXCIpOyB9IGNhdGNoIHt9XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2gge31cbiAgICB9LCA5MDApO1xuICAgIHJldHVybiAoKSA9PiBjbGVhclRpbWVvdXQodG1yKTtcbiAgfSwgW2VudHJ5Py5pZCwgcHJvcGhldGllcy5sZW5ndGhdKTtcblxuICAvLyBCaWcgRHJlYW0gY29uZGl0aW9uIFx1MjAxNCB1dGlsaXNlIG51bWlub3NpdHlfc2NvcmUgPiAwLjcgb3UgYmlnRHJlYW0vZGVlcFxuICBjb25zdCBpc0JpZ0RyZWFtTGlrZSA9XG4gICAgKGRpc3BsYXkubnVtaW5vc2l0eV9zY29yZSAmJiBkaXNwbGF5Lm51bWlub3NpdHlfc2NvcmUgPiAwLjcpIHx8XG4gICAgZGlzcGxheS5iaWdEcmVhbSA9PT0gdHJ1ZSB8fFxuICAgIGRpc3BsYXkuc3ludGhlc2lzX3RpZXIgPT09IFwiZGVlcFwiO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIiBzdHlsZT17eyBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIG92ZXJmbG93OiBcImhpZGRlblwiIH19PlxuICAgICAgey8qIDIwMjYtMDQtMjkgXHUyMDE0IEJhY2tncm91bmQgU3VyZmFjZSBsaW5lbiBzdWJ0aWwgKFllc2h1YSwgb3BhY2l0eSAwLjQpICovfVxuICAgICAge3dpbmRvdy5TdXJmYWNlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIGluc2V0OiAwLCBvcGFjaXR5OiAwLjQsIHpJbmRleDogMCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHdpbmRvdy5TdXJmYWNlIG1hdHRlcj1cImxpbmVuXCIgbW90aW9uPXt0cnVlfVxuICAgICAgICAgICAgc3R5bGU9e3sgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjEwMCVcIiB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiAyMDI2LTA0LTI5IFx1MjAxNCBIYWxvUmVzcGlyZSBiaWdkcmVhbSBkZXJyaVx1MDBFOHJlIGxlIHRpdHJlIChZZXNodWEpIHNpIG51bWlub3NpdHkgKi99XG4gICAgICB7aXNCaWdEcmVhbUxpa2UgJiYgd2luZG93LkhhbG9SZXNwaXJlICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsIHRvcDogODAsIGxlZnQ6IFwiNTAlXCIsXG4gICAgICAgICAgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVgoLTUwJSlcIixcbiAgICAgICAgICB3aWR0aDogXCJtaW4oNTQwcHgsIDkydncpXCIsIGhlaWdodDogMzIwLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNTUsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLCB6SW5kZXg6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDx3aW5kb3cuSGFsb1Jlc3BpcmUga2luZD1cImJpZ2RyZWFtXCIgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8VG9wTmF2IHNob3dCYWNrIG9uQmFjaz17KCkgPT4gZ28oXCJqb3VybmFsXCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgcGFkZGluZ0JvdHRvbTogXCJjYWxjKHZhcigtLXMtNykgKyA4MHB4KVwiLCB6SW5kZXg6IDIgfX0+XG4gICAgICAgIHsoZGlzcGxheS5iaWdEcmVhbSB8fCBkaXNwbGF5LnN5bnRoZXNpc190aWVyID09PSBcImRlZXBcIikgJiYgPGRpdiBjbGFzc05hbWU9XCJoYWxvLWJpZ1wiIC8+fVxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1tXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgIHt0eXBlTGFiZWwoZGlzcGxheS50eXBlKX0sIGRcdTAwRTlwb3NcdTAwRTkge2Rpc3BsYXkud2hlbn1cbiAgICAgICAgICB7bG9hZGluZ0RldGFpbCAmJiA8c3BhbiBjbGFzc05hbWU9XCJvcC01MFwiIHN0eWxlPXt7IG1hcmdpbkxlZnQ6IDEyIH19Plx1MDBCNyBlbnJpY2hpc3NlbWVudCBlbiBjb3Vyc1x1MjAyNjwvc3Bhbj59XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cImgzLWxlY3R1cmVcIiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRTaXplOiAyNSwgbGluZUhlaWdodDogMS41NSwgbWF4V2lkdGg6IDU4MCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtNilcIlxuICAgICAgICB9fT5cbiAgICAgICAgICB7ZGlzcGxheS50ZXh0IHx8IGRpc3BsYXkucmF3X3RleHR9XG4gICAgICAgIDwvcD5cblxuICAgICAgICB7LyogU3ludGhcdTAwRThzZSB0aXNzXHUwMEU5ZSBzaSBkaXNwb25pYmxlIFx1MjAxNCAyMDI2LTA0LTI3IFAwLjUgOlxuICAgICAgICAgICAgcGxhY2Vob2xkZXIgc2tlbGV0b24gc2kgbnVsbCBFVCBrYWlyb3MgPCA5MHMgKHN5bnRoZXNpcyBwZW5kaW5nKS4gKi99XG4gICAgICAgIHtkaXNwbGF5LnN5bnRoZXNpc190ZXh0ID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBtYi1sXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy01KVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLXNcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMC41LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIgfX0+XG4gICAgICAgICAgICAgIFNZTlRIXHUwMEM4U0UgVElTU1x1MDBDOUVcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFNpemU6IDE3LCBsaW5lSGVpZ2h0OiAxLjcsIHRleHRXcmFwOiBcInByZXR0eVwiLCB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XG4gICAgICAgICAgICAgIHtkaXNwbGF5LnN5bnRoZXNpc190ZXh0fVxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAge2Rpc3BsYXkuc3ludGhlc2lzX3ZvaWNlcz8ubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtdC1tIG9wLTcwXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMgfX0+XG4gICAgICAgICAgICAgICAgdm9peCBcdTAwQjcge2Rpc3BsYXkuc3ludGhlc2lzX3ZvaWNlcy5qb2luKFwiIFx1MDBCNyBcIil9XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSA6ICgoKSA9PiB7XG4gICAgICAgICAgLy8gUGVuZGluZyBzeW50aGVzaXMgOiBzaSBjcmVhdGVkX2F0IDwgOTBzLCBvbiBhZmZpY2hlIHBsYWNlaG9sZGVyXG4gICAgICAgICAgY29uc3QgY3JlYXRlZEF0SXNvID0gZGlzcGxheS5jcmVhdGVkX2F0IHx8IGRpc3BsYXkuX3Jhdz8uY3JlYXRlZF9hdDtcbiAgICAgICAgICBpZiAoIWNyZWF0ZWRBdElzbykgcmV0dXJuIG51bGw7XG4gICAgICAgICAgY29uc3QgYWdlU2VjID0gKERhdGUubm93KCkgLSBuZXcgRGF0ZShjcmVhdGVkQXRJc28pLmdldFRpbWUoKSkgLyAxMDAwO1xuICAgICAgICAgIGlmIChhZ2VTZWMgPiA5MCB8fCBhZ2VTZWMgPCAwKSByZXR1cm4gbnVsbDtcbiAgICAgICAgICBjb25zdCBIYWxvID0gd2luZG93LkxvYWRpbmdIYWxvO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgbWItbCBkcmVhbS1za2VsZXRvbi1mYWRlLWluXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDM1JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICAgICAgICBib3JkZXJTdHlsZTogXCJkYXNoZWRcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgb3BhY2l0eTogMC43IH19PlxuICAgICAgICAgICAgICAgIFNZTlRIXHUwMEM4U0UgVElTU1x1MDBDOUUgXHUwMEI3IEVOIENIRU1JTlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjY1LCB0ZXh0V3JhcDogXCJwcmV0dHlcIiwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogMCxcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgbCdhcHAgdGlzc2UgbGVzIFx1MDBFOWNob3MgcG91ciBjZSBrYWlyb3MuIHJldmllbnMgZGFucyB1bmUgbWludXRlXHUyMDI2XG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgICAge0hhbG8gJiYgKFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiAxNCwgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImZsZXgtc3RhcnRcIiB9fT5cbiAgICAgICAgICAgICAgICAgIDxIYWxvIHNpemU9ezIwfSBtZXNzYWdlPXtudWxsfSBkYXJrPXt0cnVlfSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSkoKX1cblxuICAgICAgICB7LyogTW90aWZzIC8gYXJjaFx1MDBFOXR5cGVzIGRcdTAwRTl0ZWN0XHUwMEU5cyAqL31cbiAgICAgICAgeyhkaXNwbGF5Lm1vdGlmX3RhZ3M/Lmxlbmd0aCA+IDAgfHwgZGlzcGxheS5hcmNoZXR5cGFsX3RhZ3M/Lmxlbmd0aCA+IDApICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtcyBtYi1sXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgeyhkaXNwbGF5Lm1vdGlmX3RhZ3MgfHwgW10pLnNsaWNlKDAsIDYpLm1hcCh0ID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtcIm0tXCIgKyB0fSBjbGFzc05hbWU9XCJjaGlwXCIgc3R5bGU9e3sgcG9pbnRlckV2ZW50czogXCJub25lXCIsIG9wYWNpdHk6IDAuODUgfX0+XG4gICAgICAgICAgICAgICAgXHUwMEI3IHt0fVxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICAgIHsoZGlzcGxheS5hcmNoZXR5cGFsX3RhZ3MgfHwgW10pLnNsaWNlKDAsIDQpLm1hcCh0ID0+IChcbiAgICAgICAgICAgICAgPHNwYW4ga2V5PXtcImEtXCIgKyB0fSBjbGFzc05hbWU9XCJjaGlwXCIgc3R5bGU9e3sgcG9pbnRlckV2ZW50czogXCJub25lXCIsIG9wYWNpdHk6IDAuODUsIGJvcmRlckNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiIH19PlxuICAgICAgICAgICAgICAgIFx1MjVDNyB7dH1cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIExlY3R1cmUgdXNlciBkXHUwMEU5alx1MDBFMCBvZmZlcnRlIFx1MjE5MiBhZmZpY2hhZ2Ugc29icmUgKi99XG4gICAgICAgIHtyZWFkaW5nU3VibWl0dGVkICYmIHVzZXJSZWFkaW5nLnRyaW0oKSAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIG1iLWxcIiBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcGFwZXItd2FybSkgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgYm9yZGVyQ29sb3I6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1wYXBlci13YXJtKSAzMCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1zXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIiwgY29sb3I6IFwidmFyKC0tcGFwZXItd2FybSlcIiB9fT5cbiAgICAgICAgICAgICAgVEEgTEVDVFVSRVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U2l6ZTogMTYsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbGluZUhlaWdodDogMS42LCB0ZXh0V3JhcDogXCJwcmV0dHlcIiwgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgICB7dXNlclJlYWRpbmd9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICl9XG5cbiAgICAgICAgeyFyZWFkaW5nU3VibWl0dGVkICYmIChcbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG1iLWxcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCwgbWF4V2lkdGg6IDUyMCB9fT5cbiAgICAgICAgICAgIGxhIGZvclx1MDBFQXQgcGFybGUgYXByXHUwMEU4cyB0b2kuIG9mZnJlIGQnYWJvcmQgdGEgbGVjdHVyZS5cbiAgICAgICAgICA8L3A+XG4gICAgICAgICl9XG5cbiAgICAgICAgey8qIEZFTFRfU0hJRlRfR0FURSArIEFIQV9DQVBUVVJFIGlubGluZSBhcHJcdTAwRThzIHVuZSBsZWN0dXJlICovfVxuICAgICAgICB7Y3VycmVudFJlYWRpbmcgJiYgIWZlZWRiYWNrUG9zdGVkICYmIChcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LXhsIGNhcmRcIiBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgICAgICBib3JkZXJDb2xvcjogXCJ2YXIoLS1jbGF5LWVhcnRoKVwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWNsYXktZWFydGgpIDQlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxGZWx0U2hpZnRBaGFJbmxpbmVcbiAgICAgICAgICAgICAgZmVsdFNoaWZ0PXtmZWx0U2hpZnR9XG4gICAgICAgICAgICAgIHNldEZlbHRTaGlmdD17c2V0RmVsdFNoaWZ0fVxuICAgICAgICAgICAgICBhaGFMZXZlbD17YWhhTGV2ZWx9XG4gICAgICAgICAgICAgIHNldEFoYUxldmVsPXtzZXRBaGFMZXZlbH1cbiAgICAgICAgICAgICAgYWhhTm90ZT17YWhhTm90ZX1cbiAgICAgICAgICAgICAgc2V0QWhhTm90ZT17c2V0QWhhTm90ZX1cbiAgICAgICAgICAgICAgb25TZW5kPXtzZW5kRmVlZGJhY2t9XG4gICAgICAgICAgICAgIG9uU2tpcD17KCkgPT4gc2V0Q3VycmVudFJlYWRpbmcobnVsbCl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApfVxuXG4gICAgICAgIHtjdXJyZW50UmVhZGluZyAmJiBmZWVkYmFja1Bvc3RlZCAmJiAoXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC14bCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLCBib3JkZXJUb3A6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiIH19PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIgfX0+XG4gICAgICAgICAgICAgIHRvbiBhaGEgZXN0IHBvc1x1MDBFOS4gaWwgcmVzdGUgYXZlYyB0b2kuXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cblxuICAgICAgICB7d2luZG93LkV4aXRUb0h1bWFuICYmIDx3aW5kb3cuRXhpdFRvSHVtYW4gLz59XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCA0IEFDVElPTlMgRElTQ1JcdTAwQzhURVMgRU4gQkFTIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwic3RpY2t5XCIsIGJvdHRvbTogMCwgbGVmdDogMCwgcmlnaHQ6IDAsXG4gICAgICAgIGJhY2tncm91bmQ6IFwibGluZWFyLWdyYWRpZW50KHRvIHRvcCwgdmFyKC0tbmlnaHQtd2FybSkgNzAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpIHZhcigtLXMtNCkgdmFyKC0tcy00KVwiLFxuICAgICAgICB6SW5kZXg6IDEwLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1zXCIgc3R5bGU9e3sgZmxleFdyYXA6IFwid3JhcFwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiwgbWF4V2lkdGg6IDY0MCwgbWFyZ2luOiBcIjAgYXV0b1wiIH19PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2hpcFwiIG9uQ2xpY2s9eygpID0+IHNldFNoZWV0KFwidXNlcl9maXJzdFwiKX0+XG4gICAgICAgICAgICA8VHlwZUdseXBoIHR5cGU9XCJub3RlX3ZpZVwiIHNpemU9ezEwfSAvPiBxdWUgdm9pcy10dSA/XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjaGlwXCJcbiAgICAgICAgICAgIGRpc2FibGVkPXshcmVhZGluZ1N1Ym1pdHRlZH1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3JlYWRpbmdTdWJtaXR0ZWQgPyBhc2tGb3Jlc3QgOiBudWxsfVxuICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogcmVhZGluZ1N1Ym1pdHRlZCA/IDEgOiAwLjQsIGN1cnNvcjogcmVhZGluZ1N1Ym1pdHRlZCA/IFwicG9pbnRlclwiIDogXCJub3QtYWxsb3dlZFwiIH19XG4gICAgICAgICAgICB0aXRsZT17cmVhZGluZ1N1Ym1pdHRlZCA/IFwiXCIgOiBcIm9mZnJlIGQnYWJvcmQgdGEgbGVjdHVyZVwifT5cbiAgICAgICAgICAgIGRlbWFuZGVyIFx1MDBFMCBsYSBmb3JcdTAwRUF0XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjaGlwXCIgb25DbGljaz17KCkgPT4gc2V0U2hlZXQoXCJlY2hvZXNcIil9PlxuICAgICAgICAgICAgXHUwMEU5Y2hvcyBkZXB1aXMgbGUgcGFzc1x1MDBFOVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2hpcFwiIG9uQ2xpY2s9eygpID0+IHsgc2V0QnVybkNvdW50ZG93bigwKTsgc2V0U2hlZXQoXCJidXJuXCIpOyB9fVxuICAgICAgICAgICAgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgICAgYnJcdTAwRkJsZXJcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgey8qIDIwMjYtMDQtMjkgXHUyMDE0IEJpZyBEcmVhbSBDVEEgOiB0ZW5pciBjZSByXHUwMEVBdmUgc3VyIDcgam91cnNcbiAgICAgICAgICAgIFZpc2libGUgdW5pcXVlbWVudCBzaSBudW1pbm9zaXR5X3Njb3JlID4gMC44NSBPVSBiaWdfZHJlYW0vc3ludGhlc2lzX3RpZXI9J2RlZXAnICovfVxuICAgICAgICB7KCgpID0+IHtcbiAgICAgICAgICBjb25zdCBzaG91bGRTaG93QmlnRHJlYW1DVEEgPVxuICAgICAgICAgICAgKGRpc3BsYXkubnVtaW5vc2l0eV9zY29yZSAmJiBkaXNwbGF5Lm51bWlub3NpdHlfc2NvcmUgPiAwLjg1KSB8fFxuICAgICAgICAgICAgZGlzcGxheS5iaWdEcmVhbSA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgZGlzcGxheS5zeW50aGVzaXNfdGllciA9PT0gXCJkZWVwXCIgfHxcbiAgICAgICAgICAgIGRpc3BsYXkuc3ludGhlc2lzX3RpZXIgPT09IFwiYmlnX2RyZWFtXCI7XG4gICAgICAgICAgaWYgKCFzaG91bGRTaG93QmlnRHJlYW1DVEEpIHJldHVybiBudWxsO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIG1heFdpZHRoOiA2NDAsIG1hcmdpbjogXCJ2YXIoLS1zLTMpIGF1dG8gMFwiLFxuICAgICAgICAgICAgICBkaXNwbGF5OiBcImZsZXhcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImNoaXBcIlxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGdvKFwiYmlnZHJlYW0td29ya2Zsb3dcIiwgeyBrYWlyb3NfaWQ6IGRpc3BsYXkuaWQgfSl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIFx1MjcyNiB0ZW5pciBjZSByXHUwMEVBdmUgc3VyIDcgam91cnNcbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9KSgpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgU0hFRVQgOiBVU0VSX0ZJUlNUX1JFQURJTkcgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3NoZWV0ID09PSBcInVzZXJfZmlyc3RcIiAmJiAoXG4gICAgICAgIDxTaGVldCBvbkNsb3NlPXsoKSA9PiBzZXRTaGVldChudWxsKX0gbWF0dGVyPVwicGFwZXJcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsIGNvbG9yOiBcInZhcigtLXBhcGVyLXdhcm0pXCIgfX0+XG4gICAgICAgICAgICBUQSBMRUNUVVJFIFx1MjAxNCBFTiBQUkVNSUVSXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImgzLWxlY3R1cmUgbWItc1wiIHN0eWxlPXt7IGZvbnRTaXplOiAyNiB9fT5cbiAgICAgICAgICAgIENlIHF1ZSB0dSB2b2lzIGxcdTAwRTAsIGNlIHF1aSB0ZSB0b3VjaGUsIGNlIHF1aSB0ZSByXHUwMEU5c2lzdGUuXG4gICAgICAgICAgPC9oMz5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJhc2gtaXRhbGljIG1iLWxcIiBzdHlsZT17eyBmb250U2l6ZTogMTUsIHRleHRXcmFwOiBcInByZXR0eVwiLCBtYXhXaWR0aDogNTQwIH19PlxuICAgICAgICAgICAgTGEgZm9yXHUwMEVBdCBhcnJpdmUgYXByXHUwMEU4cy4gVGVzIG1vdHMgZCdhYm9yZCBcdTIwMTQgbVx1MDBFQW1lIG1hbGFkcm9pdHMsIG1cdTAwRUFtZSBmcmFnbWVudGFpcmVzLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIHJvd3M9ezEwfVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJjZSBxdWUgY2Uga2Fpcm9zIHBvc2UgZGFucyB0b2lcdTIwMjZcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLCBtaW5IZWlnaHQ6IDIyMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tcGFwZXItd2FybSkgMzUlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxOCwgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICByZXNpemU6IFwidmVydGljYWxcIiwgb3V0bGluZTogXCJub25lXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgdmFsdWU9e3VzZXJSZWFkaW5nfVxuICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gc2V0VXNlclJlYWRpbmcoZS50YXJnZXQudmFsdWUpfSAvPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1zIG10LWxcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIgfX0+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gc2V0U2hlZXQobnVsbCl9PnBsdXMgdGFyZDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXtzdWJtaXRVc2VyUmVhZGluZ31cbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3VzZXJSZWFkaW5nLnRyaW0oKS5sZW5ndGggPCA0fVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IHVzZXJSZWFkaW5nLnRyaW0oKS5sZW5ndGggPCA0ID8gMC40IDogMSxcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogXCJ2YXIoLS1wYXBlci13YXJtKVwiLCBjb2xvcjogXCJ2YXIoLS1wYXBlci13YXJtKVwiLFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgZFx1MDBFOXBvc2VyIG1hIGxlY3R1cmVcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L1NoZWV0PlxuICAgICAgKX1cblxuICAgICAgey8qIFx1MjUwMFx1MjUwMCBTSEVFVCA6IEZPUkVTVF9SRUFESU5HICgzIGFuZ2xlcykgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwICovfVxuICAgICAge3NoZWV0ID09PSBcImZvcmVzdFwiICYmIChcbiAgICAgICAgPFNoZWV0IG9uQ2xvc2U9eygpID0+IHNldFNoZWV0KG51bGwpfT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiB9fT5cbiAgICAgICAgICAgIEZPUlx1MDBDQVQgXHUyMDE0IDMgQU5HTEVTXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXNoLWl0YWxpYyBtYi1sXCIgc3R5bGU9e3sgZm9udFNpemU6IDE1LCB0ZXh0V3JhcDogXCJwcmV0dHlcIiwgbWF4V2lkdGg6IDU4MCB9fT5cbiAgICAgICAgICAgIHtmb3Jlc3RGcmFtaW5nIHx8IFwiY2VzIHZvaXggbmUgZGlzZW50IHBhcyB0b24gclx1MDBFQXZlIFx1MjAxNCBlbGxlcyBsZSB0b3VjaGVudCBkZXB1aXMgbGV1ciBhbmdsZS4gdG9uIGNvcnBzIHRyYW5jaGUuXCJ9XG4gICAgICAgICAgPC9wPlxuXG4gICAgICAgICAge2ZvcmVzdExvYWRpbmcgJiYgPEZvcmVzdFRocmVlQW5nbGVzU2tlbGV0b24gbWF0dGVyQ29sb3I9e21hdHRlckNvbG9yfSAvPn1cblxuICAgICAgICAgIHtmb3Jlc3RFcnJvciAmJiAhZm9yZXN0TG9hZGluZyAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBwYWRkaW5nOiBcInZhcigtLXMtNClcIiwgYm9yZGVyQ29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiB9fT5cbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXNoLWl0YWxpY1wiIHN0eWxlPXt7IGZvbnRTaXplOiAxNSB9fT57Zm9yZXN0RXJyb3J9PC9wPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0IG10LXNcIiBvbkNsaWNrPXsoKSA9PiB7IHNldEZvcmVzdEFuZ2xlcyhudWxsKTsgYXNrRm9yZXN0KCk7IH19PnJcdTAwRTllc3NheWVyPC9idXR0b24+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuXG4gICAgICAgICAgeyFmb3Jlc3RMb2FkaW5nICYmIGZvcmVzdEFuZ2xlcyAmJiBmb3Jlc3RBbmdsZXMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1tXCI+XG4gICAgICAgICAgICAgIHtmb3Jlc3RBbmdsZXMubWFwKChhLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29sb3IgPSBtYXR0ZXJDb2xvclthLm1hdHRlcl0gfHwgXCJ2YXIoLS1wYXBlci13YXJtKVwiO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy01KVwiLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogY29sb3IsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCBcIiArIGNvbG9yICsgXCIgNCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIHthLmNpdGF0aW9uICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFNpemU6IDE5LCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgXHUwMEFCIHthLmNpdGF0aW9ufSBcdTAwQkJcbiAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgICAgIHthLmFuZ2xlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFNpemU6IDE2LCBsaW5lSGVpZ2h0OiAxLjYsXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IGEuY2l0YXRpb24gPyBcInZhcigtLXMtMylcIiA6IDAsIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC45LFxuICAgICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAge2EuYW5nbGV9XG4gICAgICAgICAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbXQtbVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIixcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICAgIFx1MjAxNCB7YS5zb3VyY2V9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXMgbXQtbFwiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gc2V0U2hlZXQobnVsbCl9PnJlZmVybWVyPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXsoKSA9PiB7IHNldFNoZWV0KG51bGwpOyBhY2tub3dsZWRnZUZvcmVzdCgpOyB9fT5cbiAgICAgICAgICAgICAgICAgIGNlIHF1aSBhIHRvdWNoXHUwMEU5XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9TaGVldD5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBcdTI1MDBcdTI1MDAgU0hFRVQgOiBcdTAwQzlDSE9TIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtzaGVldCA9PT0gXCJlY2hvZXNcIiAmJiAoXG4gICAgICAgIDxTaGVldCBvbkNsb3NlPXsoKSA9PiBzZXRTaGVldChudWxsKX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLXNcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMC41LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLCBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiIH19PlxuICAgICAgICAgICAgXHUwMEM5Q0hPUyBERVBVSVMgTEUgUEFTU1x1MDBDOVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImFzaC1pdGFsaWMgbWItbFwiIHN0eWxlPXt7IGZvbnRTaXplOiAxNSwgdGV4dFdyYXA6IFwicHJldHR5XCIsIG1heFdpZHRoOiA1NDAgfX0+XG4gICAgICAgICAgICBrYWlyb3MgcGFzc1x1MDBFOXMgcXVpIHJcdTAwRTlzb25uZW50IGF2ZWMgY2VsdWktY2kuIHtwcm9waGV0aWNFY2hvZXMubGVuZ3RoID4gMCA/IFwiY2V1eCBtYXJxdVx1MDBFOXMgcHJvcGhcdTAwRTl0aXF1ZSBzZSBzb250IGFsbHVtXHUwMEU5cyByXHUwMEU5dHJvYWN0aXZlbWVudC5cIiA6IFwic2lnbmFsIHByb2JhYmlsaXN0ZSBcdTIwMTQgcGFzIGNlcnRpdHVkZS5cIn1cbiAgICAgICAgICA8L3A+XG5cbiAgICAgICAgICB7YWxsRWNob2VzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy01KVwiLCBvcGFjaXR5OiAwLjYgfX0+XG4gICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImFzaC1pdGFsaWNcIj50b24gc29sIGVzdCBlbmNvcmUgcGV1IHBldXBsXHUwMEU5LiByZXZpZW5zIGRhbnMgcXVlbHF1ZXMgc2VtYWluZXMuPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKSA6IChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLXNcIj5cbiAgICAgICAgICAgICAge2FsbEVjaG9lcy5tYXAoZSA9PiAoXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9eyhlLnByb3BoZXRpYyA/IFwicC1cIiA6IFwiZS1cIikgKyBlLmlkfVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY2FyZFwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNClcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I6IGUucHJvcGhldGljID8gXCJ2YXIoLS1lbWJlci1saXZlKVwiIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBlLnByb3BoZXRpYyA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1lbWJlci1saXZlKSAzJSwgdHJhbnNwYXJlbnQpXCIgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4geyBzZXRTaGVldChudWxsKTsgZ28oXCJrYWlyb3NcIiwgZS5pZCk7IH19PlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiYmFzZWxpbmVcIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtlLndoZW59IFx1MjAxNCB7dHlwZUxhYmVsKGUudHlwZSl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7ZS5wcm9waGV0aWMgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiwgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICAgIFx1MjVDQSBQUk9QSFx1MDBDOVRJUVVFXG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U2l6ZTogMTYsIG9wYWNpdHk6IDAuODUsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiLXdlYmtpdC1ib3hcIiwgV2Via2l0TGluZUNsYW1wOiAyLCBXZWJraXRCb3hPcmllbnQ6IFwidmVydGljYWxcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogXCJ2YXIoLS1zLTMpIDAgMFwiLFxuICAgICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICAgIHtlLnRleHR9XG4gICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IG10LWxcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIgfX0+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17KCkgPT4gc2V0U2hlZXQobnVsbCl9PnJlZmVybWVyPC9idXR0b24+XG4gICAgICAgICAgICB7YWxsRWNob2VzLmxlbmd0aCA+IDAgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9eygpID0+IHsgc2V0U2hlZXQobnVsbCk7IG9wZW5SZWFkaW5nRmVlZGJhY2soXCJlY2hvXCIpOyB9fT5cbiAgICAgICAgICAgICAgICBjZSBxdWkgYSB0b3VjaFx1MDBFOVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvU2hlZXQ+XG4gICAgICApfVxuXG4gICAgICB7LyogXHUyNTAwXHUyNTAwIFNIRUVUIDogQlVSTiBSSVRVQUwgKDMwcyBjb3VudGRvd24pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMCAqL31cbiAgICAgIHtzaGVldCA9PT0gXCJidXJuXCIgJiYgKFxuICAgICAgICA8U2hlZXQgb25DbG9zZT17Y2FuY2VsQnVybn0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgY2VudGVyLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyLWxpdmUpIDE0JSwgdHJhbnNwYXJlbnQpLCB0cmFuc3BhcmVudCA2NSUpXCIsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIixcbiAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246IFwicmVsYXRpdmVcIiB9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBtYi1zIHRleHQtY2VudGVyXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAuNSwgbGV0dGVyU3BhY2luZzogXCIwLjA4ZW1cIiwgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiB9fT5cbiAgICAgICAgICAgICAgR0VTVEUgUklUVUVMIFx1MjAxNCBESVNTT0xVVElPTlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiaDMtbGVjdHVyZSB0ZXh0LWNlbnRlciBtYi1zXCIgc3R5bGU9e3sgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMjQgfX0+XG4gICAgICAgICAgICAgIGNlIGthaXJvcyBzZXJhIGRpc3NvdXMuXG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiYXNoLWl0YWxpYyB0ZXh0LWNlbnRlciBtYi1sXCIgc3R5bGU9e3sgZm9udFNpemU6IDE1LCBtYXhXaWR0aDogNDgwLCBtYXJnaW46IFwiMCBhdXRvIHZhcigtLXMtNSlcIiB9fT5cbiAgICAgICAgICAgICAgc3VwcHJlc3Npb24gY3J5cHRvZ3JhcGhpcXVlLiBwYXMgZGUgcmV0b3VyLiBwYXMgZCd1bmRvLlxuICAgICAgICAgICAgICB7JyAnfWxhaXNzZSBwYXNzZXIgdHJlbnRlIHNlY29uZGVzIFx1MjAxNCBzaSB0b24gY29ycHMgZGl0IGVuY29yZSBvdWksIGFsb3JzIGNvbmZpcm1lLlxuICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICB7LyogQ291bnRkb3duIGNpcmN1bGFyICovfVxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBtYi1sXCI+XG4gICAgICAgICAgICAgIHtidXJuQ291bnRkb3duID4gMCA/IChcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHdpZHRoOiAxMjAsIGhlaWdodDogMTIwLCBtYXJnaW46IFwiMCBhdXRvXCIgfX0+XG4gICAgICAgICAgICAgICAgICA8c3ZnIHdpZHRoPVwiMTIwXCIgaGVpZ2h0PVwiMTIwXCIgdmlld0JveD1cIjAgMCAxMjAgMTIwXCIgc3R5bGU9e3sgdHJhbnNmb3JtOiBcInJvdGF0ZSgtOTBkZWcpXCIgfX0+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI2MFwiIGN5PVwiNjBcIiByPVwiNTRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWFzaC1kZWVwKVwiIHN0cm9rZVdpZHRoPVwiMlwiIC8+XG4gICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9XCI2MFwiIGN5PVwiNjBcIiByPVwiNTRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLWVtYmVyLWxpdmUpXCIgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzdHJva2VEYXNoYXJyYXk9ezIgKiBNYXRoLlBJICogNTR9XG4gICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlRGFzaG9mZnNldD17MiAqIE1hdGguUEkgKiA1NCAqICgxIC0gYnVybkNvdW50ZG93biAvIDMwKX1cbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB0cmFuc2l0aW9uOiBcInN0cm9rZS1kYXNob2Zmc2V0IDFzIGxpbmVhclwiIH19IC8+XG4gICAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIGRpc3BsYXk6IFwiZ3JpZFwiLCBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAyOCwgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIixcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgICB7YnVybkNvdW50ZG93bn1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMjAsIGhlaWdodDogMTIwLCBtYXJnaW46IFwiMCBhdXRvXCIsIGRpc3BsYXk6IFwiZ3JpZFwiLCBwbGFjZUl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1lbWJlci1saXZlKVwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE0LFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgcHJcdTAwRUF0XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXNcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17Y2FuY2VsQnVybn0+YW5udWxlciBcdTAwQjcgZ2FyZGVyPC9idXR0b24+XG4gICAgICAgICAgICAgIHtidXJuQ291bnRkb3duID09PSAwICYmIChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtjb25maXJtQnVybn1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZW1iZXItbGl2ZSkgNjAlLCB2YXIoLS1hc2gtbWlkKSlcIixcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIixcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgY29uZmlybWVyIGxhIGRpc3NvbHV0aW9uXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtidXJuQ291bnRkb3duID09PSAwICYmIGJ1cm5UaW1lclJlZi5jdXJyZW50ID09PSBudWxsICYmIChcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtzdGFydEJ1cm5Db3VudGRvd259XG4gICAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgICBib3JkZXJDb2xvcjogXCJ2YXIoLS1hc2gtbWlkKVwiLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJ1cm5Db3VudGRvd24gPT09IDAgPyBcImlubGluZS1mbGV4XCIgOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgXHUyNUI3IGRcdTAwRTltYXJyZXIgdHJlbnRlIHNlY29uZGVzXG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9TaGVldD5cbiAgICAgICl9XG5cbiAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG5cbiAgICAgIHsvKiBGLjIgXHUyMDE0IE1vZGFsIFNhbmN0dWFpcmUgYXV0by1kXHUwMEU5Y2xlbmNoXHUwMEU5ZSAoXHUwMEE3MTEuYmlzLjIwLjEzKSAqL31cbiAgICAgIHtzaG93U2FuY3R1YWlyZU1vZGFsICYmIHdpbmRvdy5OaWdodG1hcmVEZXBvc2l0Q2hvaWNlTW9kYWwgJiYgKFxuICAgICAgICA8d2luZG93Lk5pZ2h0bWFyZURlcG9zaXRDaG9pY2VNb2RhbFxuICAgICAgICAgIGVudHJ5PXtmdWxsS2Fpcm9zfVxuICAgICAgICAgIGlzRnJvemVuPXtmYWxzZX1cbiAgICAgICAgICBvbkNsb3NlPXsoKSA9PiB7XG4gICAgICAgICAgICBzZXRTaG93U2FuY3R1YWlyZU1vZGFsKGZhbHNlKTtcbiAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZHJlYW06c2FuY3R1YWlyZTpzZWVuOlwiICsgKGZ1bGxLYWlyb3M/LmlkIHx8IGVudHJ5Py5pZCksIFwiMVwiKTsgfSBjYXRjaCB7fVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Hb1NhbmN0dWFpcmU9eygpID0+IHtcbiAgICAgICAgICAgIHRyeSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZHJlYW06c2FuY3R1YWlyZTpzZWVuOlwiICsgKGZ1bGxLYWlyb3M/LmlkIHx8IGVudHJ5Py5pZCksIFwiMVwiKTsgfSBjYXRjaCB7fVxuICAgICAgICAgICAgc2V0U2hvd1NhbmN0dWFpcmVNb2RhbChmYWxzZSk7XG4gICAgICAgICAgICBnbyhcIm5pZ2h0bWFyZXNcIik7XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkV4aXRUb0h1bWFuPXsoKSA9PiB7XG4gICAgICAgICAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRyZWFtOnNhbmN0dWFpcmU6c2VlbjpcIiArIChmdWxsS2Fpcm9zPy5pZCB8fCBlbnRyeT8uaWQpLCBcIjFcIik7IH0gY2F0Y2gge31cbiAgICAgICAgICAgIHNldFNob3dTYW5jdHVhaXJlTW9kYWwoZmFsc2UpO1xuICAgICAgICAgICAgZ28oXCJuaWdodG1hcmVzXCIpO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIEZFTFRfU0hJRlRfR0FURSBpbmxpbmUgKyBBSEFfQ0FQVFVSRSAocmVmb250ZSAyMDI2LTA0LTI1IFx1MjE5MiAyMDI2LTA0LTI2KSBcdTI1MDBcbi8vIDIwMjYtMDQtMjYgKEIrRCwgRGVzaWduIFx1MDBBNzExLmJpcy43KSA6XG4vLyAgIC0gRGVmYXVsdCBKMC1KMzAgPSAxIHF1ZXN0aW9uIHNpbXBsZSBcIlx1MDBFN2Egc2hpZnQgb1x1MDBGOSA/XCIgKyAzIGNoaXBzXG4vLyAgICAgKGdvcmdlIC8gcG9pdHJpbmUgLyBhaWxsZXVycylcbi8vICAgLSBPcHQtaW4gSjMwKyA6IHByb3Bvc2UgXCJ2ZXV4LXR1IHBsdXMgZGUgcHJcdTAwRTljaXNpb24gP1wiIFx1MjE5MiBkXHUwMEU5YmxvcXVlIDYgem9uZXNcbi8vICAgLSBsb2NhbFN0b3JhZ2VbXCJkcmVhbTpmZWx0LXNoaWZ0LW1vZGVcIl0gPSBcIjYtem9uZXNcIiBwb3VyIFx1MDBFOXRlbmRyZVxuLy8gICAtIEJhY2tlbmQgY29sbGVjdGUgdG91dCBwYXJlaWwsIGwnVUkgcydhZGFwdGVcbmNvbnN0IEZlbHRTaGlmdEFoYUlubGluZSA9ICh7IGZlbHRTaGlmdCwgc2V0RmVsdFNoaWZ0LCBhaGFMZXZlbCwgc2V0QWhhTGV2ZWwsIGFoYU5vdGUsIHNldEFoYU5vdGUsIG9uU2VuZCwgb25Ta2lwIH0pID0+IHtcbiAgLy8gTW9kZSBhY3R1ZWwgOiBcIjYtem9uZXNcIiAoXHUwMEU5dGVuZHUpIG91IGRcdTAwRTlmYXV0ICgzIHpvbmVzIHNpbXBsZXMpXG4gIGNvbnN0IFttb2RlLCBzZXRNb2RlXSA9IHVzZVMyKCgpID0+IHtcbiAgICB0cnkgeyByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkcmVhbTpmZWx0LXNoaWZ0LW1vZGVcIikgfHwgXCJkZWZhdWx0XCI7IH1cbiAgICBjYXRjaCB7IHJldHVybiBcImRlZmF1bHRcIjsgfVxuICB9KTtcbiAgY29uc3QgW3Nob3dPcHRJbiwgc2V0U2hvd09wdEluXSA9IHVzZVMyKGZhbHNlKTtcblxuICAvLyBBdSBtb3VudCA6IHNpIHBhcyBlbiBtb2RlIFx1MDBFOXRlbmR1LCBwYXMgZW5jb3JlIHByb21wdGVkLCBldCBwb3N0LUozMFxuICAvLyBcdTIxOTIgcHJvcG9zZSBsYSBtb2RhbCBkJ29wdC1pbiB1bmUgZm9pcy5cbiAgdXNlRTIoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAobW9kZSA9PT0gXCI2LXpvbmVzXCIpIHJldHVybjtcbiAgICAgIGNvbnN0IHByb21wdGVkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkcmVhbTpmZWx0LXNoaWZ0LXByb21wdGVkXCIpO1xuICAgICAgaWYgKHByb21wdGVkKSByZXR1cm47XG4gICAgICBjb25zdCBpc1Bvc3QgPSAodHlwZW9mIHdpbmRvdy5pc1Bvc3RKMzAgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgPyB3aW5kb3cuaXNQb3N0SjMwKFwiZHJlYW06YWNjb3VudC1jcmVhdGVkXCIsIDMwKVxuICAgICAgICA6IGZhbHNlO1xuICAgICAgaWYgKGlzUG9zdCkgc2V0U2hvd09wdEluKHRydWUpO1xuICAgIH0gY2F0Y2gge31cbiAgfSwgW21vZGVdKTtcblxuICBjb25zdCBhY2NlcHRFeHRlbmRlZCA9ICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpmZWx0LXNoaWZ0LW1vZGVcIiwgXCI2LXpvbmVzXCIpO1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpmZWx0LXNoaWZ0LXByb21wdGVkXCIsIFN0cmluZyhEYXRlLm5vdygpKSk7XG4gICAgfSBjYXRjaCB7fVxuICAgIHNldE1vZGUoXCI2LXpvbmVzXCIpO1xuICAgIHNldFNob3dPcHRJbihmYWxzZSk7XG4gIH07XG4gIGNvbnN0IGRlY2xpbmVFeHRlbmRlZCA9ICgpID0+IHtcbiAgICB0cnkgeyBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRyZWFtOmZlbHQtc2hpZnQtcHJvbXB0ZWRcIiwgU3RyaW5nKERhdGUubm93KCkpKTsgfSBjYXRjaCB7fVxuICAgIHNldFNob3dPcHRJbihmYWxzZSk7XG4gIH07XG5cbiAgLy8gWm9uZXMgc2Vsb24gbW9kZVxuICBjb25zdCBTSElGVF9aT05FU19ERUZBVUxUID0gW1xuICAgIFtcImdvcmdlXCIsIFwiZ29yZ2VcIl0sXG4gICAgW1wicG9pdHJpbmVcIiwgXCJwb2l0cmluZVwiXSxcbiAgICBbXCJhaWxsZXVyc1wiLCBcImFpbGxldXJzXCJdLFxuICBdO1xuICBjb25zdCBTSElGVF9aT05FU19FWFRFTkRFRCA9IFtcbiAgICBbXCJnb3JnZVwiLCBcImdvcmdlXCJdLFxuICAgIFtcInBvaXRyaW5lXCIsIFwicG9pdHJpbmVcIl0sXG4gICAgW1widmVudHJlXCIsIFwidmVudHJlXCJdLFxuICAgIFtcIm51cXVlXCIsIFwibnVxdWVcIl0sXG4gICAgW1wiYWlsbGV1cnNcIiwgXCJhaWxsZXVyc1wiXSxcbiAgICBbXCJhdWN1bmVcIiwgXCJhdWN1bmUgcGFydFwiXSxcbiAgXTtcbiAgY29uc3QgU0hJRlRfWk9ORVMgPSBtb2RlID09PSBcIjYtem9uZXNcIiA/IFNISUZUX1pPTkVTX0VYVEVOREVEIDogU0hJRlRfWk9ORVNfREVGQVVMVDtcbiAgY29uc3QgZ3JpZENvbHMgPSBtb2RlID09PSBcIjYtem9uZXNcIiA/IFwicmVwZWF0KDMsIDFmcilcIiA6IFwicmVwZWF0KDMsIDFmcilcIjtcblxuICBjb25zdCBBSEFfTEVWRUxTID0gW1xuICAgIFtcImZvcnRcIiwgXCJyXHUwMEU5c29ubmUgZm9ydFwiXSxcbiAgICBbXCJwZXV0LWV0cmVcIiwgXCJwZXV0LVx1MDBFQXRyZVwiXSxcbiAgICBbXCJub25cIiwgXCJub25cIl0sXG4gIF07XG5cbiAgY29uc3QgY2FuU2VuZCA9ICEhZmVsdFNoaWZ0IHx8ICEhYWhhTGV2ZWwgfHwgYWhhTm90ZS50cmltKCkubGVuZ3RoID4gMDtcblxuICByZXR1cm4gKFxuICAgIDxkaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbWItc1wiIHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLjUsIGxldHRlclNwYWNpbmc6IFwiMC4wOGVtXCIsIGNvbG9yOiBcInZhcigtLWNsYXktZWFydGgpXCIsXG4gICAgICB9fT5cbiAgICAgICAgRkVMVC1TSElGVCBcdTAwQjcgR0VORExJTlxuICAgICAgPC9kaXY+XG4gICAgICA8cCBjbGFzc05hbWU9XCJib2R5IG1iLW1cIiBzdHlsZT17eyB0ZXh0V3JhcDogXCJwcmV0dHlcIiwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFNpemU6IDE2LCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgIHttb2RlID09PSBcIjYtem9uZXNcIlxuICAgICAgICAgID8gXCJwcmVuZHMgZGl4IHNlY29uZGVzLiBsZXF1ZWwgYSBmYWl0IHF1ZWxxdWUgY2hvc2UgZGFucyB0b24gY29ycHMgP1wiXG4gICAgICAgICAgOiBcIlx1MDBFN2Egc2hpZnQgb1x1MDBGOSA/XCJ9XG4gICAgICA8L3A+XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLCBncmlkVGVtcGxhdGVDb2x1bW5zOiBncmlkQ29scywgZ2FwOiBcInZhcigtLXMtMilcIixcbiAgICAgICAgbWFyZ2luQm90dG9tOiBcInZhcigtLXMtMylcIixcbiAgICAgIH19PlxuICAgICAgICB7U0hJRlRfWk9ORVMubWFwKChbaywgbF0pID0+IChcbiAgICAgICAgICA8YnV0dG9uIGtleT17a31cbiAgICAgICAgICAgIGNsYXNzTmFtZT17XCJjaGlwIFwiICsgKGZlbHRTaGlmdCA9PT0gayA/IFwiYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZlbHRTaGlmdChrKX1cbiAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwganVzdGlmeUNvbnRlbnQ6IFwiY2VudGVyXCIgfX0+XG4gICAgICAgICAgICB7bH1cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgY2xhc3NOYW1lPXtcImJ0bi10ZXh0IFwiICsgKGZlbHRTaGlmdCA9PT0gXCJyaWVuXCIgPyBcImFjdGl2ZVwiIDogXCJcIil9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEZlbHRTaGlmdChcInJpZW5cIil9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZm9udFNpemU6IDEzLCBvcGFjaXR5OiAwLjcsXG4gICAgICAgICAgY29sb3I6IGZlbHRTaGlmdCA9PT0gXCJyaWVuXCIgPyBcInZhcigtLWJvbmUpXCIgOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgIH19PlxuICAgICAgICByaWVuIG5lIHNoaWZ0IFx1MjAxNCBqJ2F0dGVuZHNcbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICB7LyogTW9kYWwgb3B0LWluIEozMCsgOiBwcm9wb3NlIGxlcyA2IHpvbmVzIFx1MDBFOXRlbmR1ZXMgKi99XG4gICAgICB7c2hvd09wdEluICYmIChcbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIG1hcmdpblRvcDogXCJ2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTMpIHZhcigtLXMtMylcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAyNSUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNTUsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICBtYXJnaW46IFwiMCAwIHZhcigtLXMtMykgMFwiLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIFZldXgtdHUgcGx1cyBkZSBwclx1MDBFOWNpc2lvbiBjb3Jwb3JlbGxlJm5ic3A7PyBPbiBwZXV0IGRcdTAwRTl2ZXJyb3VpbGxlciA2IHpvbmVzLlxuICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBnYXAtc1wiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcImZsZXgtZW5kXCIsIGZsZXhXcmFwOiBcIndyYXBcIiB9fT5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtkZWNsaW5lRXh0ZW5kZWR9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGZvbnRTaXplOiAxMyB9fT5cbiAgICAgICAgICAgICAgbm9uLCBnYXJkZSBzaW1wbGVcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXthY2NlcHRFeHRlbmRlZH1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgICAgICBvdWksIGRcdTAwRTl2ZXJyb3VpbGxlciA2IHpvbmVzXG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpdmlkZXJcIiBzdHlsZT17eyBtYXJnaW46IFwidmFyKC0tcy00KSAwXCIgfX0gLz5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLXNcIiBzdHlsZT17e1xuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMC41LCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICB9fT5cbiAgICAgICAgQUhBIFx1MjAxNCBDRSBRVUkgUydFU1QgUE9TXHUwMEM5XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1zIG1iLW1cIiBzdHlsZT17eyBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgIHtBSEFfTEVWRUxTLm1hcCgoW2ssIGxdKSA9PiAoXG4gICAgICAgICAgPGJ1dHRvbiBrZXk9e2t9XG4gICAgICAgICAgICBjbGFzc05hbWU9e1wiY2hpcCBcIiArIChhaGFMZXZlbCA9PT0gayA/IFwiYWN0aXZlXCIgOiBcIlwiKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldEFoYUxldmVsKGspfT5cbiAgICAgICAgICAgIHtsfVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPHRleHRhcmVhXG4gICAgICAgIHJvd3M9ezN9XG4gICAgICAgIHBsYWNlaG9sZGVyPVwiY2UgcXVpIHMnZXN0IHBvc1x1MDBFOSBlbiBtb3RzIFx1MjAxNCBvdSBsYWlzc2VyIHZpZGUuXCJcbiAgICAgICAgdmFsdWU9e2FoYU5vdGV9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IHNldEFoYU5vdGUoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIiwgbWluSGVpZ2h0OiA3MCxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIixcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtMylcIixcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LCBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgcmVzaXplOiBcInZlcnRpY2FsXCIsIG91dGxpbmU6IFwibm9uZVwiLFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgIH19IC8+XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1zXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiIH19PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17b25Ta2lwfSBzdHlsZT17eyBmb250U2l6ZTogMTMgfX0+cGx1cyB0YXJkPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17b25TZW5kfVxuICAgICAgICAgIGRpc2FibGVkPXshY2FuU2VuZH1cbiAgICAgICAgICBzdHlsZT17eyBvcGFjaXR5OiBjYW5TZW5kID8gMSA6IDAuNCB9fT5cbiAgICAgICAgICBlbnJlZ2lzdHJlclxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG10LXNcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMiB9fT5cbiAgICAgICAgcmllbiBuJ2VzdCBcdTAwRTl2YWx1XHUwMEU5LiBjZXMgdHJhY2VzIHBvbmRcdTAwRThyZW50IGxlcyBsZWN0dXJlcyBmdXR1cmVzLCBjJ2VzdCB0b3V0LlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgU2hlZXQgcGxlaW4gXHUwMEU5Y3JhbiAobW9kYWwgbG91cmQsIGZvbmQgbmlnaHQtd2FybSArIG1hdHRlcikgXHUyNTAwXG5jb25zdCBTaGVldCA9ICh7IGNoaWxkcmVuLCBvbkNsb3NlLCBtYXR0ZXIgPSBudWxsIH0pID0+IHtcbiAgY29uc3QgbWF0dGVyQm9yZGVyID0gbWF0dGVyID09PSBcInBhcGVyXCIgPyBcInZhcigtLXBhcGVyLXdhcm0pXCJcbiAgICA6IG1hdHRlciA9PT0gXCJzdG9uZVwiID8gXCJ2YXIoLS1zdG9uZS1jb29sKVwiXG4gICAgOiBtYXR0ZXIgPT09IFwic2lsa1wiICA/IFwidmFyKC0tc2lsay1nb2xkKVwiXG4gICAgOiBcInZhcigtLWFzaC1taWQpXCI7XG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgcG9zaXRpb246IFwiZml4ZWRcIiwgaW5zZXQ6IDAsIHpJbmRleDogMTEwLFxuICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA4OCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cigxMHB4KVwiLFxuICAgICAgZGlzcGxheTogXCJncmlkXCIsIHBsYWNlSXRlbXM6IFwic3RyZXRjaFwiLFxuICAgICAgYW5pbWF0aW9uOiBcInNjcmVlbi1pbiB2YXIoLS10ZW1wby10aXNzZSkgdmFyKC0tZWFzZS1yZXNwaXJlKSBib3RoXCIsXG4gICAgfX0gb25DbGljaz17b25DbG9zZX0+XG4gICAgICA8ZGl2IG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsXG4gICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCBcIiArIG1hdHRlckJvcmRlcixcbiAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsIG1heFdpZHRoOiA3MjAsIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNikgdmFyKC0tcy01KSB2YXIoLS1zLTcpXCIsXG4gICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgb3ZlcmZsb3dZOiBcImF1dG9cIixcbiAgICAgICAgICBtYXhIZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17b25DbG9zZX1cbiAgICAgICAgICBhcmlhLWxhYmVsPVwicmVmZXJtZXJcIlxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCB0b3A6IFwidmFyKC0tcy0zKVwiLCByaWdodDogXCJ2YXIoLS1zLTMpXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcIm5vbmVcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFNpemU6IDIyLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgcGFkZGluZzogOCwgb3BhY2l0eTogMC43LFxuICAgICAgICAgIH19Plx1MDBENzwvYnV0dG9uPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IE1vZGFsID0gKHsgY2hpbGRyZW4sIG9uQ2xvc2UgfSkgPT4gKFxuICA8ZGl2IHN0eWxlPXt7XG4gICAgcG9zaXRpb246IFwiZml4ZWRcIiwgaW5zZXQ6IDAsIHpJbmRleDogMTAwLFxuICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC1mbG9vcikgODAlLCB0cmFuc3BhcmVudClcIixcbiAgICBiYWNrZHJvcEZpbHRlcjogXCJibHVyKDhweClcIixcbiAgICBkaXNwbGF5OiBcImdyaWRcIiwgcGxhY2VJdGVtczogXCJjZW50ZXJcIiwgcGFkZGluZzogXCJ2YXIoLS1zLTQpXCIsXG4gICAgYW5pbWF0aW9uOiBcInNjcmVlbi1pbiB2YXIoLS10ZW1wby10aXNzZSkgdmFyKC0tZWFzZS1yZXNwaXJlKSBib3RoXCJcbiAgfX0gb25DbGljaz17b25DbG9zZX0+XG4gICAgPGRpdiBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LXdhcm0pXCIsXG4gICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLW1pZClcIixcbiAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTUpXCIsXG4gICAgICAgIG1heFdpZHRoOiA1NDAsIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgb3ZlcmZsb3c6IFwiaGlkZGVuXCJcbiAgICAgIH19PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbik7XG5cbi8vIFx1MjUwMFx1MjUwMCBQb3J0cmFpdCAoY29uc3RlbGxhdGlvbikgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBDb25zdGVsbGF0aW9uID0gKHsgbm9kZXMsIHNlbGVjdGVkLCBvblNlbGVjdCwgaGVpZ2h0ID0gMzQwIH0pID0+IHtcbiAgY29uc3QgdyA9IDY0MDtcbiAgY29uc3QgaCA9IGhlaWdodDtcblxuICAvLyBwb3NpdGlvbnMgbGlnaHRseSBwZXJ0dXJiZWQgKyBzbG93IGRyaWZ0XG4gIGNvbnN0IFt0aWNrLCBzZXRUaWNrXSA9IHVzZVMyKDApO1xuICB1c2VFMigoKSA9PiB7XG4gICAgbGV0IHJhZjtcbiAgICBjb25zdCBsb29wID0gKCkgPT4ge1xuICAgICAgc2V0VGljayh0ID0+IHQgKyAxKTtcbiAgICAgIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9O1xuICAgIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICByZXR1cm4gKCkgPT4gY2FuY2VsQW5pbWF0aW9uRnJhbWUocmFmKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHBsYWNlZCA9IHVzZU0yKCgpID0+IG5vZGVzLm1hcCgobiwgaSkgPT4ge1xuICAgIC8vIGRldGVybWluaXN0aWMgYmFzZSBwb3NpdGlvblxuICAgIGNvbnN0IGFuZ2xlID0gKGkgLyBub2Rlcy5sZW5ndGgpICogTWF0aC5QSSAqIDIgKyAobi5zZWVkIHx8IDApO1xuICAgIGNvbnN0IHJhZGl1cyA9IDQwICsgKG4ud2VpZ2h0IHx8IDEpICogMjIgKyAoKGkgKiAxNykgJSA2MCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm4sXG4gICAgICBieDogdyAvIDIgKyBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXMsXG4gICAgICBieTogaCAvIDIgKyBNYXRoLnNpbihhbmdsZSkgKiByYWRpdXMgKiAwLjc1LFxuICAgIH07XG4gIH0pLCBbbm9kZXMsIHcsIGhdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29uc3RlbGxhdGlvblwiIHN0eWxlPXt7IGhlaWdodCB9fT5cbiAgICAgIDxzdmcgdmlld0JveD17YDAgMCAke3d9ICR7aH1gfSB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgc3R5bGU9e3sgZGlzcGxheTogXCJibG9ja1wiIH19PlxuICAgICAgICB7LyogZWRnZXMgKi99XG4gICAgICAgIHtwbGFjZWQubWFwKChhLCBpKSA9PlxuICAgICAgICAgIHBsYWNlZC5zbGljZShpKzEpLm1hcCgoYiwgaikgPT4ge1xuICAgICAgICAgICAgaWYgKCFhLmVkZ2VzPy5pbmNsdWRlcyhiLmlkKSkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICBjb25zdCBkeCA9IChNYXRoLnNpbih0aWNrIC8gNjAgKyBpKSAqIDMpO1xuICAgICAgICAgICAgY29uc3QgZHkgPSAoTWF0aC5jb3ModGljayAvIDYwICsgaikgKiAzKTtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxsaW5lIGtleT17YCR7YS5pZH0tJHtiLmlkfWB9XG4gICAgICAgICAgICAgICAgeDE9e2EuYnggKyBkeH0geTE9e2EuYnkgKyBkeX1cbiAgICAgICAgICAgICAgICB4Mj17Yi5ieCAtIGR4fSB5Mj17Yi5ieSAtIGR5fVxuICAgICAgICAgICAgICAgIHN0cm9rZT1cInZhcigtLWFzaC1taWQpXCIgc3Ryb2tlV2lkdGg9XCIwLjVcIiBvcGFjaXR5PVwiMC40NVwiIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pXG4gICAgICAgICl9XG4gICAgICAgIHsvKiBub2RlcyAqL31cbiAgICAgICAge3BsYWNlZC5tYXAoKG4sIGkpID0+IHtcbiAgICAgICAgICBjb25zdCBicmVhdGggPSAxICsgTWF0aC5zaW4odGljayAvIDUwICsgaSkgKiAwLjA0O1xuICAgICAgICAgIGNvbnN0IGR4ID0gTWF0aC5zaW4odGljayAvIDgwICsgaSAqIDAuNykgKiAyO1xuICAgICAgICAgIGNvbnN0IGR5ID0gTWF0aC5jb3ModGljayAvIDkwICsgaSAqIDEuMSkgKiAyO1xuICAgICAgICAgIGNvbnN0IHIgPSAoNCArIChuLndlaWdodCB8fCAxKSAqIDMpICogYnJlYXRoO1xuICAgICAgICAgIGNvbnN0IGlzU2VsID0gc2VsZWN0ZWQgPT09IG4uaWQ7XG4gICAgICAgICAgY29uc3QgZmlsbCA9IG4uY29sb3IgfHwgXCJ2YXIoLS1ib25lKVwiO1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZyBrZXk9e24uaWR9XG4gICAgICAgICAgICAgIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgke24uYnggKyBkeH0gJHtuLmJ5ICsgZHl9KWB9XG4gICAgICAgICAgICAgIHN0eWxlPXt7IGN1cnNvcjogXCJwb2ludGVyXCIgfX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3Q/LihuLmlkKX0+XG4gICAgICAgICAgICAgIHtpc1NlbCAmJiA8Y2lyY2xlIHI9e3IgKyAxMH0gZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1ib25lKVwiIHN0cm9rZVdpZHRoPVwiMC41XCIgb3BhY2l0eT1cIjAuNFwiIC8+fVxuICAgICAgICAgICAgICB7bi5zaGFwZSA9PT0gXCJzdGFyXCIgPyAoXG4gICAgICAgICAgICAgICAgPHBvbHlnb24gcG9pbnRzPVwiMCwtNiAxLjUsLTEuNSA2LC0xLjUgMi41LDEuNSA0LDYgMCwzIC00LDYgLTIuNSwxLjUgLTYsLTEuNSAtMS41LC0xLjVcIlxuICAgICAgICAgICAgICAgICAgZmlsbD17ZmlsbH0gb3BhY2l0eT17MC44NX0gdHJhbnNmb3JtPXtgc2NhbGUoJHtyLzZ9KWB9IC8+XG4gICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgPGNpcmNsZSByPXtyfSBmaWxsPXtmaWxsfSBvcGFjaXR5PXswLjl9IC8+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHtpc1NlbCAmJiAoXG4gICAgICAgICAgICAgICAgPHRleHQgeT17ciArIDE2fSBmb250U2l6ZT1cIjExXCIgZmlsbD1cInZhcigtLWJvbmUpXCIgdGV4dEFuY2hvcj1cIm1pZGRsZVwiXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5PVwidmFyKC0tc2VyaWYpXCIgZm9udFN0eWxlPVwiaXRhbGljXCI+XG4gICAgICAgICAgICAgICAgICB7bi5sYWJlbH1cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8L2c+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L3N2Zz5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IHBvcnRyYWl0Tm9kZXMgPSBbXG4gIHsgaWQ6IFwiZ3JhbmQtbWVyZVwiLCBsYWJlbDogXCJsYSBncmFuZC1tXHUwMEU4cmVcIiwgd2VpZ2h0OiAzLCBjb2xvcjogXCJ2YXIoLS1zdG9uZS1jb29sKVwiLCBlZGdlczogW1wibWFpc29uXCIsIFwicG9ydGVcIl0sIHNlZWQ6IDAuMywgc2hhcGU6IFwiY2lyY2xlXCIgfSxcbiAgeyBpZDogXCJtYWlzb25cIiwgICAgIGxhYmVsOiBcImxhIG1haXNvbiBhdXggcGlcdTAwRThjZXMgaW5jb25udWVzXCIsIHdlaWdodDogMi41LCBjb2xvcjogXCJ2YXIoLS1wYXBlci13YXJtKVwiLCBlZGdlczogW1wicG9ydGVcIl0sIHNlZWQ6IDAuOCB9LFxuICB7IGlkOiBcInBvcnRlXCIsICAgICAgbGFiZWw6IFwibGEgcG9ydGUgcXVpIG5lIHMnb3V2cmUgcGFzXCIsIHdlaWdodDogMi4yLCBjb2xvcjogXCJ2YXIoLS1wYXBlci13YXJtKVwiLCBlZGdlczogW1wiY3Vpc2luZVwiXSwgc2VlZDogMS41IH0sXG4gIHsgaWQ6IFwiY3Vpc2luZVwiLCAgICBsYWJlbDogXCJjdWlzaW5lIHNhbnMgZmV1XCIsIHdlaWdodDogMS44LCBjb2xvcjogXCJ2YXIoLS1jbGF5LWVhcnRoKVwiLCBlZGdlczogW10sIHNlZWQ6IDIuMSB9LFxuICB7IGlkOiBcImVhdVwiLCAgICAgICAgbGFiZWw6IFwiZWF1IHF1aSBjaGVyY2hlIHNvbiBsaXRcIiwgd2VpZ2h0OiAyLjgsIGNvbG9yOiBcInZhcigtLXN0b25lLWNvb2wpXCIsIGVkZ2VzOiBbXCJlc3R1YWlyZVwiLCBcInBvbnRcIl0sIHNlZWQ6IDIuOCwgc2hhcGU6IFwic3RhclwiIH0sXG4gIHsgaWQ6IFwiZXN0dWFpcmVcIiwgICBsYWJlbDogXCJlc3R1YWlyZVwiLCB3ZWlnaHQ6IDEuNSwgY29sb3I6IFwidmFyKC0tc3RvbmUtY29vbClcIiwgZWRnZXM6IFtdLCBzZWVkOiAzLjMgfSxcbiAgeyBpZDogXCJwb250XCIsICAgICAgIGxhYmVsOiBcInBvbnQgaW5hY2hldlx1MDBFOVwiLCB3ZWlnaHQ6IDIuMCwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCBlZGdlczogW1wic2V1aWxcIl0sIHNlZWQ6IDMuOSwgc2hhcGU6IFwic3RhclwiIH0sXG4gIHsgaWQ6IFwic2V1aWxcIiwgICAgICBsYWJlbDogXCJzZXVpbCBcdTAwRTAgdHJhdmVyc2VyXCIsIHdlaWdodDogMi40LCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIGVkZ2VzOiBbXCJ0cmF2YWlsXCJdLCBzZWVkOiA0LjUgfSxcbiAgeyBpZDogXCJ0cmF2YWlsXCIsICAgIGxhYmVsOiBcInF1ZXN0aW9uIGR1IHRyYXZhaWxcIiwgd2VpZ2h0OiAyLjYsIGNvbG9yOiBcInZhcigtLXBhcGVyLXdhcm0pXCIsIGVkZ2VzOiBbXSwgc2VlZDogNS4xIH0sXG4gIHsgaWQ6IFwiY29yYmVhdVwiLCAgICBsYWJlbDogXCJjb3JiZWF1IC8gZmV1aWxsZSBtb3J0ZVwiLCB3ZWlnaHQ6IDEuMiwgY29sb3I6IFwidmFyKC0tb2JzaWRpYW4pXCIsIGVkZ2VzOiBbXSwgc2VlZDogNS43IH0sXG4gIHsgaWQ6IFwiZW5mYW50XCIsICAgICBsYWJlbDogXCJlbmZhbnQgcXVpIHBsZXVyZVwiLCB3ZWlnaHQ6IDEuNiwgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiwgZWRnZXM6IFtcIm1haXNvblwiXSwgc2VlZDogMC4xLCBzaGFwZTogXCJzdGFyXCIgfSxcbl07XG5cbmNvbnN0IFBvcnRyYWl0ID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbdG9nZ2xlLCBzZXRUb2dnbGVdID0gdXNlUzIoXCJjcm9pc2VcIik7XG4gIGNvbnN0IFtwZXJpb2QsIHNldFBlcmlvZF0gPSB1c2VTMihcImx1bmVcIik7XG4gIGNvbnN0IFtzZWxlY3RlZCwgc2V0U2VsZWN0ZWRdID0gdXNlUzIobnVsbCk7XG4gIGNvbnN0IFtncmFwaCwgc2V0R3JhcGhdID0gdXNlUzIoeyBub2RlczogcG9ydHJhaXROb2RlcywgZWRnZXM6IFtdIH0pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTMih0cnVlKTtcblxuICAvLyBNYXAgcGVyaW9kIGNoaXAgXHUyMTkyIGRheXMgcGFyYW1cbiAgY29uc3QgcGVyaW9kRGF5cyA9ICh7IGx1bmU6IDMwLCBzYWlzb246IDkwLCBhbm5lZTogMzY1LCBhbHdheXM6IDM2NTAgfSlbcGVyaW9kXSB8fCA5MDtcblxuICB1c2VFMigoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgd2luZG93LkRyZWFtQVBJLmdldENvbnN0ZWxsYXRpb25HcmFwaCh7IGRheXM6IHBlcmlvZERheXMsIG1pbl93ZWlnaHQ6IDAuMyB9KVxuICAgICAgLnRoZW4oZyA9PiB7XG4gICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgLy8gQVBJIHJldHVybnMgeyBub2RlczogWy4uLl0sIGVkZ2VzOiBbLi4uXSB9XG4gICAgICAgIC8vIENvbnZlcnQgdG8gQ29uc3RlbGxhdGlvbi1jb21wYXRpYmxlIHNoYXBlXG4gICAgICAgIGNvbnN0IG5vZGVzID0gKGc/Lm5vZGVzIHx8IFtdKS5tYXAoKG4sIGkpID0+ICh7XG4gICAgICAgICAgaWQ6IG4uaWQgfHwgKFwibi1cIiArIGkpLFxuICAgICAgICAgIGxhYmVsOiBuLmxhYmVsIHx8IG4ubmFtZSB8fCBcIlx1MDBCN1wiLFxuICAgICAgICAgIHdlaWdodDogbi53ZWlnaHQgfHwgbi5vY2N1cnJlbmNlcyB8fCAxLFxuICAgICAgICAgIGNvbG9yOiBuLmtpbmQgPT09IFwiYmlnZHJlYW1cIiA/IFwidmFyKC0tc2lsay1nb2xkKVwiXG4gICAgICAgICAgICA6IG4ua2luZCA9PT0gXCJmaWd1cmVcIiA/IFwidmFyKC0tcGFwZXItd2FybSlcIlxuICAgICAgICAgICAgOiBuLmtpbmQgPT09IFwibW90aWZcIiA/IFwidmFyKC0tc3RvbmUtY29vbClcIlxuICAgICAgICAgICAgOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgc2hhcGU6IG4ua2luZCA9PT0gXCJiaWdkcmVhbVwiID8gXCJzdGFyXCIgOiBcImNpcmNsZVwiLFxuICAgICAgICAgIGVkZ2VzOiAoZy5lZGdlcyB8fCBbXSlcbiAgICAgICAgICAgIC5maWx0ZXIoZSA9PiAoZS5zb3VyY2UgfHwgZS5hKSA9PT0gKG4uaWQgfHwgKFwibi1cIiArIGkpKSlcbiAgICAgICAgICAgIC5tYXAoZSA9PiBlLnRhcmdldCB8fCBlLmIpLFxuICAgICAgICAgIHNlZWQ6IChpICogMC43KSAlIDYuMjgsXG4gICAgICAgIH0pKTtcbiAgICAgICAgLy8gRmFsbCBiYWNrIHRvIHNlZWQgaWYgYmFja2VuZCByZXR1cm5zIGVtcHR5XG4gICAgICAgIGNvbnN0IGZpbmFsTm9kZXMgPSBub2Rlcy5sZW5ndGggPiAwID8gbm9kZXMgOiBwb3J0cmFpdE5vZGVzO1xuICAgICAgICBzZXRHcmFwaCh7IG5vZGVzOiBmaW5hbE5vZGVzLCBlZGdlczogZz8uZWRnZXMgfHwgW10gfSk7XG4gICAgICAgIHNldExvYWRpbmcoZmFsc2UpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGlmIChjYW5jZWxsZWQpIHJldHVybjtcbiAgICAgICAgc2V0R3JhcGgoeyBub2RlczogcG9ydHJhaXROb2RlcywgZWRnZXM6IFtdIH0pO1xuICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gIH0sIFtwZXJpb2REYXlzXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiPlxuICAgICAgPFRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiaG9tZVwiKX0gbGFiZWw9XCJcIiAvPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmcmFtZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtYi1sXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwic3BhY2UtYmV0d2VlblwiLCBhbGlnbkl0ZW1zOiBcImZsZXgtZW5kXCIgfX0+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImgxLXNldWlsXCI+UG9ydHJhaXQ8L2gxPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1tXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgYXJpYS1sYWJlbD1cImxcdTAwRTlnZW5kZVwiPj88L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBhcmlhLWxhYmVsPVwicGFyYW1cdTAwRTh0cmVzXCI+XHUyNjk5PC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIHtsb2FkaW5nID8gKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIiBzdHlsZT17eyBoZWlnaHQ6IDM4MCwgZGlzcGxheTogXCJmbGV4XCIsIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBvcGFjaXR5OiAwLjUgfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+bGEgY29uc3RlbGxhdGlvbiBzJ29yZ2FuaXNlXHUyMDI2PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkgOiAoXG4gICAgICAgICAgPENvbnN0ZWxsYXRpb24gbm9kZXM9e2dyYXBoLm5vZGVzfSBzZWxlY3RlZD17c2VsZWN0ZWR9IG9uU2VsZWN0PXtzZXRTZWxlY3RlZH0gaGVpZ2h0PXszODB9IC8+XG4gICAgICAgICl9XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1sIHRvZ2dsZS1yb3dcIj5cbiAgICAgICAgICB7W1tcIm9uaXJpcXVlXCIsIFwib25pcmlxdWVcIl0sIFtcImpvdXJcIiwgXCJqb3VyXCJdLCBbXCJjcm9pc2VcIiwgXCJjcm9pc1x1MDBFOVwiXV0ubWFwKChbaywgbF0pID0+IChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfSBjbGFzc05hbWU9e1wiY2hpcFwiICsgKHRvZ2dsZSA9PT0gayA/IFwiIGFjdGl2ZVwiIDogXCJcIil9IG9uQ2xpY2s9eygpID0+IHNldFRvZ2dsZShrKX0+e2x9PC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtcyB0b2dnbGUtcm93XCI+XG4gICAgICAgICAge1tbXCJsdW5lXCIsIFwiY2V0dGUgbHVuZVwiXSwgW1wic2Fpc29uXCIsIFwic2Fpc29uXCJdLCBbXCJhbm5lZVwiLCBcImFublx1MDBFOWVcIl0sIFtcImFsd2F5c1wiLCBcImFsd2F5c1wiXV0ubWFwKChbaywgbF0pID0+IChcbiAgICAgICAgICAgIDxidXR0b24ga2V5PXtrfSBjbGFzc05hbWU9e1wiY2hpcFwiICsgKHBlcmlvZCA9PT0gayA/IFwiIGFjdGl2ZVwiIDogXCJcIil9IG9uQ2xpY2s9eygpID0+IHNldFBlcmlvZChrKX0+e2x9PC9idXR0b24+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGl2aWRlci1tb29uXCI+XHUwMEU5Y2hvcyB2aXZhbnRzIGVuIGNlIG1vbWVudDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLXNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBwYWRkaW5nOiBcInZhcigtLXMtNClcIiB9fT5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE3LCBtYXJnaW46IDAsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICAgICAgICBpbCB5IGEgdW5lIGx1bmUgXHUyMDE0IFx1MDBBQiBsYSBtYWlzb24gYXV4IHBpXHUwMEU4Y2VzIGluY29ubnVlcyBcdTAwQkIgclx1MDBFOXNvbm5lIGF2ZWMgdG9uIHJcdTAwRUF2ZSBkZSBjZSBtYXRpbi5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17eyBwYWRkaW5nOiBcInZhcigtLXMtNClcIiB9fT5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE3LCBtYXJnaW46IDAsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICAgICAgICBpbCB5IGEgZGV1eCBsdW5lcyBcdTIwMTQgXHUwMEFCIGF0dGVuZHMsIGRcdTAwRTljaXNpb24gUGFyaXMgXHUwMEJCIHJcdTAwRTlzb25uZSBhdmVjIGxhIHF1ZXN0aW9uIGR1IHRyYXZhaWwgY2V0dGUgc2VtYWluZS5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC14bCB0ZXh0LWNlbnRlclwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0XCIgb25DbGljaz17KCkgPT4gZ28oXCJjaGF0XCIsIFwicG9ydHJhaXRcIil9PlxuICAgICAgICAgICAgXHUyMjk5IGRlbWFuZGVyIHVuZSBsZWN0dXJlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG10LXMgb3AtNzBcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgICB2b2l4IG1vYmlsaXNcdTAwRTllcyBjZXR0ZSBsdW5lIFx1MDBCNyBhaXplbnN0YXQgXHUwMEI3IG1vc3MgXHUwMEI3IGJhY2hlbGFyZFxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3dpbmRvdy5FeGl0VG9IdW1hbiAmJiA8d2luZG93LkV4aXRUb0h1bWFuIC8+fVxuICAgICAgPC9kaXY+XG4gICAgICB7d2luZG93LkZlZWRiYWNrRmxvYXQgJiYgPHdpbmRvdy5GZWVkYmFja0Zsb2F0IC8+fVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIEFuaW1hIE11bmRpIFx1MjAxNCBWb1x1MDBGQnRlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgQW5pbWFWb3V0ZSA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW3RpY2ssIHNldFRpY2tdID0gdXNlUzIoMCk7XG4gIGNvbnN0IFt2b3V0ZSwgc2V0Vm91dGVdID0gdXNlUzIobnVsbCk7XG5cbiAgdXNlRTIoKCkgPT4ge1xuICAgIGNvbnN0IHQgPSBzZXRJbnRlcnZhbCgoKSA9PiBzZXRUaWNrKHYgPT4gdiArIDEpLCA1MCk7XG4gICAgcmV0dXJuICgpID0+IGNsZWFySW50ZXJ2YWwodCk7XG4gIH0sIFtdKTtcblxuICB1c2VFMigoKSA9PiB7XG4gICAgbGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuICAgIHdpbmRvdy5EcmVhbUFQSS5nZXRWb3V0ZSgpLnRoZW4oZCA9PiB7IGlmICghY2FuY2VsbGVkKSBzZXRWb3V0ZShkKTsgfSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IHBvaW50cyA9IHVzZU0yKCgpID0+IHtcbiAgICBjb25zdCBhcnIgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDkwOyBpKyspIHtcbiAgICAgIGFyci5wdXNoKHtcbiAgICAgICAgeDogKGkgKiAzNykgJSAxMDAsXG4gICAgICAgIHk6IChpICogNTMpICUgMTAwLFxuICAgICAgICBwaGFzZTogaSAqIDAuMjcsXG4gICAgICAgIHNpemU6IDAuNiArICgoaSAqIDEzKSAlIDcpIC8gMTAsXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbiAgfSwgW10pO1xuXG4gIC8vIENvbXBvc2UgaHVtYW4tZnJpZW5kbHkgY291bnQgZnJvbSB2b3V0ZSBhZ2dyZWdhdFxuICBjb25zdCBtZXRlb0NvdW50ID0gdm91dGU/Lm1ldGVvPy5rX2NvdW50IHx8IHZvdXRlPy5tZXRlb19vcHRpbl9jb3VudCB8fCBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFnZSBzY3JlZW4tZW50ZXJcIj5cbiAgICAgIDxUb3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImhvbWVcIil9IGxhYmVsPVwiXCIgLz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJhbWVcIj5cbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cImgxLXNldWlsIHRleHQtY2VudGVyIG1iLXhsXCIgc3R5bGU9e3sgZm9udFNpemU6IDQ0IH19PkFuaW1hIE11bmRpPC9oMT5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFuaW1hLWNvbnN0ZWxsYXRpb24gbWItbFwiPlxuICAgICAgICAgIDxzdmcgdmlld0JveD1cIjAgMCAxMDAgNjBcIiB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIiBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIgfX0+XG4gICAgICAgICAgICB7cG9pbnRzLm1hcCgocCwgaSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBicmVhdGhlID0gKE1hdGguc2luKHRpY2sgLyA0MCArIHAucGhhc2UpICsgMSkgLyAyO1xuICAgICAgICAgICAgICBjb25zdCBvcGFjaXR5ID0gMC4xNSArIGJyZWF0aGUgKiAwLjU7XG4gICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgPGNpcmNsZSBrZXk9e2l9XG4gICAgICAgICAgICAgICAgICBjeD17cC54fSBjeT17cC55ICogMC42fVxuICAgICAgICAgICAgICAgICAgcj17cC5zaXplICogKDAuNCArIGJyZWF0aGUgKiAwLjYpfVxuICAgICAgICAgICAgICAgICAgZmlsbD17aSAlIDIzID09PSAwID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCIgOiBpICUgMTEgPT09IDAgPyBcInZhcigtLXN0b25lLWNvb2wpXCIgOiBcInZhcigtLWJvbmUpXCJ9XG4gICAgICAgICAgICAgICAgICBvcGFjaXR5PXtvcGFjaXR5fSAvPlxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInNldWlsLWl0YWxpYyB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IGZvbnRTaXplOiAxOSwgbWF4V2lkdGg6IDUyMCwgbWFyZ2luOiBcIjAgYXV0b1wiLCB0ZXh0V3JhcDogXCJwcmV0dHlcIiB9fT5cbiAgICAgICAgICB7bWV0ZW9Db3VudFxuICAgICAgICAgICAgPyBgQ2V0dGUgbHVuZSwgJHttZXRlb0NvdW50LnRvTG9jYWxlU3RyaW5nKFwiZnItRlJcIil9IHZvaXggb250IGRcdTAwRTlwb3NcdTAwRTkgXHUyMDE0IHJcdTAwRUF2ZXMsIHNpZ25lcywgdHJhdmVyc1x1MDBFOWVzLmBcbiAgICAgICAgICAgIDogXCJDZXR0ZSBsdW5lLCBkZXMgdm9peCBzZSByYXNzZW1ibGVudCBcdTIwMTQgclx1MDBFQXZlcywgc2lnbmVzLCB0cmF2ZXJzXHUwMEU5ZXMuXCJ9XG4gICAgICAgIDwvcD5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1tIG10LXhsXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjaGFtYmVyLWNhcmRcIiBvbkNsaWNrPXsoKSA9PiBnbyhcIm1ldGVvXCIpfT5cbiAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJoMy1sZWN0dXJlXCI+TGUgdGVtcHMgcXUnaWwgZmFpdCBkYW5zIGxhIG51aXQ8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWV0YSBtdC1zIG9wLTcwXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgICBtXHUwMEU5dFx1MDBFOW8gZGUgbCdpbmNvbnNjaWVudFxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiY2hhbWJlci1jYXJkXCIgb25DbGljaz17KCkgPT4gZ28oXCJhbm5hbGVzXCIpfVxuICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogKHZvdXRlPy5hbm5hbGVzX2NpcmN1bGF0aW5nX2NvdW50IHx8IDApID4gMCA/IDEgOiAwLjU1IH19PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImgzLWxlY3R1cmVcIj5UZW51IGVuc2VtYmxlPC9oMz5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgbXQtcyBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICAgICAge3ZvdXRlPy5hbm5hbGVzX2NpcmN1bGF0aW5nX2NvdW50XG4gICAgICAgICAgICAgICAgPyBgJHt2b3V0ZS5hbm5hbGVzX2NpcmN1bGF0aW5nX2NvdW50fSBhbm5hbGUocykgZW4gY2lyY3VsYXRpb25gXG4gICAgICAgICAgICAgICAgOiBcInJcdTAwRUF2ZXMgZXQgdHJhdmVyc1x1MDBFOWVzIG9mZmVydHMgYXUgY29sbGVjdGlmXCJ9XG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJjaGFtYmVyLWNhcmRcIiBvbkNsaWNrPXsoKSA9PiBnbyhcInBvbHlwaG9uaWVcIil9PlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImgzLWxlY3R1cmVcIj5Qb2x5cGhvbmllIGRlIGxhIGx1bmU8L2gzPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWV0YSBtdC1zIG9wLTcwXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgICB7dm91dGU/LnBvbHlwaG9uaWU/Lmx1bmFyX3BoYXNlIHx8IFwibGVjdHVyZSBsb25ndWVcIn1cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIHt3aW5kb3cuRmVlZGJhY2tGbG9hdCAmJiA8d2luZG93LkZlZWRiYWNrRmxvYXQgLz59XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgTVx1MDBFOXRcdTAwRTlvIGRlIGwnaW5jb25zY2llbnQgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBNZXRlbyA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW21ldGVvcywgc2V0TWV0ZW9zXSA9IHVzZVMyKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlUzIodHJ1ZSk7XG5cbiAgdXNlRTIoKCkgPT4ge1xuICAgIGxldCBjYW5jZWxsZWQgPSBmYWxzZTtcbiAgICB3aW5kb3cuRHJlYW1BUEkuZ2V0TWV0ZW8oeyBsaW1pdDogNCB9KS50aGVuKGQgPT4ge1xuICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgc2V0TWV0ZW9zKGQ/Lm1ldGVvcyB8fCBbXSk7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKCkgPT4geyBjYW5jZWxsZWQgPSB0cnVlOyB9O1xuICB9LCBbXSk7XG5cbiAgY29uc3QgbGF0ZXN0ID0gbWV0ZW9zWzBdO1xuICBjb25zdCB0b3BNb3RpZiA9IGxhdGVzdD8udG9wX21vdGlmcz8uWzBdO1xuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwic3RhZ2Ugc2NyZWVuLWVudGVyXCI+XG4gICAgPFRvcE5hdiBzaG93QmFjayBvbkJhY2s9eygpID0+IGdvKFwiYW5pbWFcIil9IGxhYmVsPVwiYW5pbWEgbXVuZGlcIiAvPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZnJhbWVcIj5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJoMi1zZWN0aW9uIG1iLXNcIj5MZSB0ZW1wcyBxdSdpbCBmYWl0IGRhbnMgbGEgbnVpdDwvaDI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpdmlkZXJcIiAvPlxuICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljIG1iLXhsXCIgc3R5bGU9e3sgbWF4V2lkdGg6IDU2MCwgdGV4dFdyYXA6IFwicHJldHR5XCIgfX0+XG4gICAgICAgIHtsb2FkaW5nXG4gICAgICAgICAgPyBcImxhIG1cdTAwRTl0XHUwMEU5byBzZSBjb21wb3NlXHUyMDI2XCJcbiAgICAgICAgICA6IHRvcE1vdGlmXG4gICAgICAgICAgICA/IGBDZXR0ZSBwXHUwMEU5cmlvZGUsIGxlIG1vdGlmICR7dG9wTW90aWYubW90aWYgfHwgdG9wTW90aWZ9IHJldmllbnQgbGUgcGx1cy5gXG4gICAgICAgICAgICA6IFwiQ2V0dGUgbHVuZSwgbCdodW1hbml0XHUwMEU5IGEgclx1MDBFQXZcdTAwRTkgZCdlYXUuIFBhcyBkZSB0ZW1wXHUwMEVBdGVzIFx1MjAxNCBkJ2VhdSBxdWkgc2UgY2hlcmNoZSB1biBsaXQsIGQnZXN0dWFpcmVzIHF1aSBzZSBmb3JtZW50LlwifVxuICAgICAgPC9wPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBtYi14bFwiPlxuICAgICAgICA8c3ZnIHdpZHRoPVwiODBcIiBoZWlnaHQ9XCI4MFwiIHZpZXdCb3g9XCIwIDAgODAgODBcIiBzdHlsZT17eyBvcGFjaXR5OiAwLjcgfX0+XG4gICAgICAgICAgPHBhdGggZD1cIk00MCAxNSBRMjggMzAgMjggNDUgUTI4IDYwIDQwIDY4IFE1MiA2MCA1MiA0NSBRNTIgMzAgNDAgMTUgWlwiXG4gICAgICAgICAgICBmaWxsPVwibm9uZVwiIHN0cm9rZT1cInZhcigtLXN0b25lLWNvb2wpXCIgc3Ryb2tlV2lkdGg9XCIwLjc1XCIgLz5cbiAgICAgICAgICA8cGF0aCBkPVwiTTQwIDI1IFEzMyAzNSAzMyA0OCBRMzMgNTggNDAgNjJcIlxuICAgICAgICAgICAgZmlsbD1cIm5vbmVcIiBzdHJva2U9XCJ2YXIoLS1zdG9uZS1jb29sKVwiIHN0cm9rZVdpZHRoPVwiMC41XCIgb3BhY2l0eT1cIjAuNlwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgbXQtc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5lYXU8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpdmlkZXJcIiAvPlxuXG4gICAgICA8aDQgY2xhc3NOYW1lPVwiaDQtcmVwZXJlIG1iLW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTcsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgZm9udFdlaWdodDogNDAwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsIHRleHRUcmFuc2Zvcm06IFwibG93ZXJjYXNlXCIgfX0+XG4gICAgICAgIFx1MjVCRCBudWFnZXMgdGhcdTAwRTltYXRpcXVlc1xuICAgICAgPC9oND5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLW0gbWIteGxcIj5cbiAgICAgICAge1tcbiAgICAgICAgICBcIkJlYXVjb3VwIGRlIHBvcnRlcyBxdWkgbmUgcydvdXZyZW50IHBhcyB0b3V0IGRlIHN1aXRlLlwiLFxuICAgICAgICAgIFwiRGVzIGFuaW1hdXggcXVpIHBhcmxlbnQgZG91Y2VtZW50LCBzYW5zIHVyZ2VuY2UuXCIsXG4gICAgICAgICAgXCJEZXMgZFx1MDBFOWZ1bnRzIHF1aSByZXZpZW5uZW50IHBvdXIgZmFpcmUgbGEgY3Vpc2luZS5cIixcbiAgICAgICAgXS5tYXAoKHQsIGkpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17aX0gY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy00KVwiIH19PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgZm9udFNpemU6IDE4LCBtYXJnaW46IDAsIHRleHRXcmFwOiBcInByZXR0eVwiIH19Pnt0fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGg0IGNsYXNzTmFtZT1cImg0LXJlcGVyZSBtYi1tXCIgc3R5bGU9e3sgZm9udFNpemU6IDE3LCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIGZvbnRXZWlnaHQ6IDQwMCwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLCB0ZXh0VHJhbnNmb3JtOiBcImxvd2VyY2FzZVwiIH19PlxuICAgICAgICBcdTI1QkQgdG91cm51cmVzIHF1aSBtb250ZW50XG4gICAgICA8L2g0PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbSBtYi14bFwiPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBmb250U2l6ZTogMTgsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICAgIEwnZWF1IHJldmllbnQgcGx1cyBxdWUgbGUgZmV1IGNldHRlIHNhaXNvbi5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBmb250U2l6ZTogMTgsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICAgIExlcyBwYXlzYWdlcyBzZSBmb250IHBsdXMgdmFzdGVzIDsgbGVzIHBpXHUwMEU4Y2VzIGZlcm1cdTAwRTllcyBzZSBmb250IHBsdXMgcmFyZXMuXG4gICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8aDQgY2xhc3NOYW1lPVwiaDQtcmVwZXJlIG1iLW1cIiBzdHlsZT17eyBmb250U2l6ZTogMTcsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgZm9udFdlaWdodDogNDAwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsIHRleHRUcmFuc2Zvcm06IFwibG93ZXJjYXNlXCIgfX0+XG4gICAgICAgIFx1MjVCRCBqb3VybmFsIGRlIHZpZSBjb2xsZWN0aWZcbiAgICAgIDwvaDQ+XG4gICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWMgbWIteGxcIiBzdHlsZT17eyBmb250U2l6ZTogMTgsIHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICBCZWF1Y291cCBkZSBxdWVzdGlvbnMgc3VyIGxlIHRyYXZhaWwgY2V0dGUgbHVuZS4gTGUgbW90aWYgZHVcbiAgICAgICAgc2V1aWwtXHUwMEUwLXRyYXZlcnNlciByZXZpZW50IFx1MjAxNCBjaG9peCBkZSBjYXJyaVx1MDBFOHJlLCBydXB0dXJlLCBkXHUwMEU5bVx1MDBFOW5hZ2VtZW50LlxuICAgICAgPC9wPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNTAgbXQteGxcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMSwgbGV0dGVyU3BhY2luZzogXCIwLjA1ZW1cIiB9fT5cbiAgICAgICAge2xhdGVzdD8uY29tcHV0ZWRfYXRcbiAgICAgICAgICA/IGByZWNhbGN1bFx1MDBFOWUgJHtuZXcgRGF0ZShsYXRlc3QuY29tcHV0ZWRfYXQpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImZyLUZSXCIsIHsgZGF5OiBcIm51bWVyaWNcIiwgbW9udGg6IFwibG9uZ1wiIH0pfSBcdTAwQjcgZFx1MDBFOWxhaSByaXR1ZWwgMTQgamBcbiAgICAgICAgICA6IFwicmVjYWxjdWxcdTAwRTllIHJcdTAwRTlndWxpXHUwMEU4cmVtZW50IFx1MDBCNyBkXHUwMEU5bGFpIHJpdHVlbCAxNCBqIFx1MDBCNyBwcm9jaGFpbmUgOiBub3V2ZWxsZSBsdW5lXCJ9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICB7d2luZG93LkZlZWRiYWNrRmxvYXQgJiYgPHdpbmRvdy5GZWVkYmFja0Zsb2F0IC8+fVxuICA8L2Rpdj5cbik7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgUG9seXBob25pZSBsdW5haXJlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgUG9seXBob25pZSA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW3BvbHlwaG9uaWVzLCBzZXRQb2x5cGhvbmllc10gPSB1c2VTMihbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVMyKHRydWUpO1xuXG4gIHVzZUUyKCgpID0+IHtcbiAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgd2luZG93LkRyZWFtQVBJLmdldFBvbHlwaG9uaWUoeyBsaW1pdDogNiB9KS50aGVuKGQgPT4ge1xuICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgc2V0UG9seXBob25pZXMoZD8ucG9seXBob25pZXMgfHwgW10pO1xuICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuICgpID0+IHsgY2FuY2VsbGVkID0gdHJ1ZTsgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGxhdGVzdCA9IHBvbHlwaG9uaWVzWzBdO1xuICBjb25zdCBlYXJsaWVyID0gcG9seXBob25pZXMuc2xpY2UoMSk7XG4gIGNvbnN0IGx1bmFyTGFiZWwgPSBsYXRlc3Q/Lmx1bmFyX3BoYXNlIHx8IFwibGVjdHVyZSBsb25ndWVcIjtcblxuICByZXR1cm4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiPlxuICAgIDxUb3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImFuaW1hXCIpfSBsYWJlbD1cImFuaW1hIG11bmRpXCIgLz5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgbWF4V2lkdGg6IDY0MCB9fT5cbiAgICAgIDxoMiBjbGFzc05hbWU9XCJoMi1zZWN0aW9uIG1iLWxcIj5Qb2x5cGhvbmllIFx1MDBCNyB7bHVuYXJMYWJlbH08L2gyPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXZpZGVyXCIgLz5cblxuICAgICAgPGRpdiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U2l6ZTogMTksIGxpbmVIZWlnaHQ6IDEuNywgY29sb3I6IFwidmFyKC0tYm9uZSlcIiB9fT5cbiAgICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWV0YSBvcC01MFwiIHN0eWxlPXt7IGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5sYSBwb2x5cGhvbmllIHMnXHUwMEU5Y3JpdFx1MjAyNjwvcD5cbiAgICAgICAgKSA6IGxhdGVzdD8ubmFycmF0aXZlX3RleHQgPyAoXG4gICAgICAgICAgbGF0ZXN0Lm5hcnJhdGl2ZV90ZXh0LnNwbGl0KC9cXG5cXG4rLykubWFwKChwYXJhLCBpKSA9PiAoXG4gICAgICAgICAgICA8cCBrZXk9e2l9IHN0eWxlPXt7IHRleHRXcmFwOiBcInByZXR0eVwiIH19PntwYXJhfTwvcD5cbiAgICAgICAgICApKVxuICAgICAgICApIDogKFxuICAgICAgICA8PlxuICAgICAgICA8cCBzdHlsZT17eyB0ZXh0V3JhcDogXCJwcmV0dHlcIiB9fT5cbiAgICAgICAgICBQbHVzaWV1cnMgb250IHJcdTAwRUF2XHUwMEU5IGQnZWF1IGNldHRlIGx1bmUuIFBhcyBkZSB0ZW1wXHUwMEVBdGVzIFx1MjAxNFxuICAgICAgICAgIGQnZWF1IHF1aSBzZSBjaGVyY2hlIHVuIGxpdCwgZCdlc3R1YWlyZXMgcXVpIHNlIGZvcm1lbnQuXG4gICAgICAgICAgRXQgcGx1c2lldXJzIG9udCBcdTAwRTljcml0IGRlcyBkb3V0ZXMgc3VyIGxldXIgdHJhdmFpbC5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBzdHlsZT17eyB0ZXh0V3JhcDogXCJwcmV0dHlcIiB9fT5cbiAgICAgICAgICBcdTAwQzAgbGEgbHVtaVx1MDBFOHJlIGRlIEJhY2hlbGFyZCwgb24gcG91cnJhaXQgZW50ZW5kcmUgZGFucyBjZXMgZWF1eFxuICAgICAgICAgIGNoZXJjaGFudCBsZXVyIGxpdCBsYSBtXHUwMEVBbWUgY2hvc2UgcXVlIGRhbnMgY2VzIHF1ZXN0aW9ucyBkZSBzZXVpbCA6XG4gICAgICAgICAgdW5lIGZsdWlkaXRcdTAwRTkgcXVpIGRlbWFuZGUgXHUwMEUwIHNlIHBvc2VyIHF1ZWxxdWUgcGFydCwgc2FucyBlbmNvcmVcbiAgICAgICAgICBzYXZvaXIgb1x1MDBGOS4gTCdlYXUsIGljaSwgbidlc3QgcGFzIGNlbGxlIHF1aSBub2llLiBDJ2VzdCBjZWxsZSBxdWlcbiAgICAgICAgICBoXHUwMEU5c2l0ZSBhdmFudCBkZSBwcmVuZHJlIHNhIGZvcm1lLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxwIHN0eWxlPXt7IHRleHRXcmFwOiBcInByZXR0eVwiIH19PlxuICAgICAgICAgIEFpemVuc3RhdCBhdXJhaXQgaW52aXRcdTAwRTkgXHUwMEUwIHRlbmlyIGxhIGdyYW5kLW1cdTAwRThyZSBxdWkgcmV2aWVudCBcdTIwMTRcbiAgICAgICAgICBwbHVzaWV1cnMgbCdvbnQgdnVlIGNldHRlIGx1bmUsIGRhbnMgZGVzIGN1aXNpbmVzIHNhbnMgZmV1LFxuICAgICAgICAgIGF2ZWMgZHUgbGluZ2UgXHUwMEUwIGxhdmVyLiBFbGxlIG4nZXN0IHBhcyBmaWd1cmUgZGUgcGFzc1x1MDBFOS5cbiAgICAgICAgICBFbGxlIGVzdCBmaWd1cmUgcXVpIHRyYXZhaWxsZSBxdWVscXVlIGNob3NlIHF1aSBuJ2EgcGFzIGVuY29yZVxuICAgICAgICAgIGRlIG5vbS5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBzdHlsZT17eyB0ZXh0V3JhcDogXCJwcmV0dHlcIiB9fT5cbiAgICAgICAgICBFdCBNb3NzLCBvbiBsJ2ltYWdpbmUgZGlyZSA6IGxlcyBwb250cyBpbmFjaGV2XHUwMEU5cyBxdWkgcmV2aWVubmVudFxuICAgICAgICAgIGVuIHN5bmNocm9uaWNpdFx1MDBFOSBuZSBkZW1hbmRlbnQgcGV1dC1cdTAwRUF0cmUgcGFzIFx1MDBFMCBcdTAwRUF0cmUgZmluaXMuIElsc1xuICAgICAgICAgIGRlbWFuZGVudCBcdTAwRTAgXHUwMEVBdHJlIHJlZ2FyZFx1MDBFOXMsIGRlcHVpcyBsZXMgZGV1eCByaXZlcyBcdTAwRTAgbGEgZm9pcy5cbiAgICAgICAgPC9wPlxuICAgICAgICA8cCBzdHlsZT17eyB0ZXh0V3JhcDogXCJwcmV0dHlcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBtYXJnaW5Ub3A6IFwidmFyKC0tcy01KVwiIH19PlxuICAgICAgICAgIFF1ZSBzZSBjaGVyY2hlLXQtZWxsZSwgbCdlYXUgcXVpIGNoZXJjaGUgc29uIGxpdCA/XG4gICAgICAgIDwvcD5cbiAgICAgICAgPC8+XG4gICAgICAgICl9XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXZpZGVyXCIgLz5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTQgfX0+XG4gICAgICAgIHZvaXggbW9iaWxpc1x1MDBFOWVzIGNldHRlIGx1bmVcbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1zIG1ldGEtbW9ub1wiPlxuICAgICAgICB7KGxhdGVzdD8udm9pY2VzX21vYmlsaXNlZXMgJiYgbGF0ZXN0LnZvaWNlc19tb2JpbGlzZWVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgPyBsYXRlc3Qudm9pY2VzX21vYmlsaXNlZXMuam9pbihcIiBcdTAwQjcgXCIpXG4gICAgICAgICAgOiBcIkFpemVuc3RhdCBcdTAwQjcgTW9zcyBcdTAwQjcgQmFjaGVsYXJkXCJ9XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaXZpZGVyLW1vb25cIj5sZWN0dXJlcyBwclx1MDBFOWNcdTAwRTlkZW50ZXM8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLXNcIj5cbiAgICAgICAge2VhcmxpZXIubGVuZ3RoID4gMFxuICAgICAgICAgID8gZWFybGllci5tYXAocCA9PiAoXG4gICAgICAgICAgICAgIDxidXR0b24ga2V5PXtwLmlkfSBjbGFzc05hbWU9XCJidG4tdGV4dCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IGZvbnRTaXplOiAxNSB9fT5cbiAgICAgICAgICAgICAgICBcdTIwMjIge3AubHVuYXJfcGhhc2UgfHwgbmV3IERhdGUocC5wZXJpb2RfZW5kKS50b0xvY2FsZURhdGVTdHJpbmcoXCJmci1GUlwiLCB7IG1vbnRoOiBcImxvbmdcIiB9KX1cbiAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICApKVxuICAgICAgICAgIDogPD5cbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dCB0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IGZvbnRTaXplOiAxNSB9fT5cdTIwMjIgbHVuZSBwclx1MDBFOWNcdTAwRTlkZW50ZTwvYnV0dG9uPlxuICAgICAgICAgICAgPC8+fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAge3dpbmRvdy5GZWVkYmFja0Zsb2F0ICYmIDx3aW5kb3cuRmVlZGJhY2tGbG9hdCAvPn1cbiAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgQ2hhdCBJQSBuYXJyYXRyaWNlIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgQ2hhdCA9ICh7IGdvLCBjb250ZXh0SWQgfSkgPT4ge1xuICBjb25zdCBbbWVzc2FnZXMsIHNldE1lc3NhZ2VzXSA9IHVzZVMyKFtcbiAgICB7IGZyb206IFwiYWlcIiwgdGV4dDogXCJBdmFudCBxdWUgamUgdGUgcHJvcG9zZSBxdW9pIHF1ZSBjZSBzb2l0LCBkaXMtbW9pIDogcXUnZXN0LWNlIHF1ZSB0dSB2b2lzIGxcdTAwRTAsIGVuIHJlZ2FyZGFudCBjZSBrYWlyb3MgP1wiIH0sXG4gIF0pO1xuICBjb25zdCBbaW5wdXQsIHNldElucHV0XSA9IHVzZVMyKFwiXCIpO1xuICBjb25zdCBbdGhpbmtpbmcsIHNldFRoaW5raW5nXSA9IHVzZVMyKGZhbHNlKTtcbiAgY29uc3QgW3N0cmVhbWluZywgc2V0U3RyZWFtaW5nXSA9IHVzZVMyKFwiXCIpO1xuXG4gIGNvbnN0IHNlbmQgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFpbnB1dC50cmltKCkgfHwgdGhpbmtpbmcpIHJldHVybjtcbiAgICBjb25zdCB1c2VyTXNnID0gaW5wdXQudHJpbSgpO1xuICAgIHNldE1lc3NhZ2VzKG0gPT4gWy4uLm0sIHsgZnJvbTogXCJ1c2VyXCIsIHRleHQ6IHVzZXJNc2cgfV0pO1xuICAgIHNldElucHV0KFwiXCIpO1xuICAgIHNldFRoaW5raW5nKHRydWUpO1xuICAgIHNldFN0cmVhbWluZyhcIlwiKTtcblxuICAgIC8vIEJ1aWxkIG1lc3NhZ2VzIGFycmF5IGZvciAvYXBpL2NoYXRcbiAgICBjb25zdCBhcGlNZXNzYWdlcyA9IG1lc3NhZ2VzXG4gICAgICAubWFwKG0gPT4gKHsgcm9sZTogbS5mcm9tID09PSBcImFpXCIgPyBcImFzc2lzdGFudFwiIDogXCJ1c2VyXCIsIGNvbnRlbnQ6IG0udGV4dCB9KSlcbiAgICAgIC5jb25jYXQoW3sgcm9sZTogXCJ1c2VyXCIsIGNvbnRlbnQ6IHVzZXJNc2cgfV0pO1xuXG4gICAgbGV0IGJ1ZmZlciA9IFwiXCI7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHdpbmRvdy5EcmVhbUFQSS5jaGF0KHtcbiAgICAgICAgbWVzc2FnZXM6IGFwaU1lc3NhZ2VzLFxuICAgICAgICBtb2RlOiBcImRyZWFtXCIsXG4gICAgICAgIGRyZWFtSWQ6IGNvbnRleHRJZCB8fCBudWxsLFxuICAgICAgICBsb2NhbGU6IFwiZnJcIixcbiAgICAgICAgb25DaHVuazogKGNodW5rKSA9PiB7XG4gICAgICAgICAgYnVmZmVyICs9IGNodW5rO1xuICAgICAgICAgIHNldFN0cmVhbWluZyhidWZmZXIpO1xuICAgICAgICB9LFxuICAgICAgICBvbkRvbmU6ICgpID0+IHtcbiAgICAgICAgICBpZiAoYnVmZmVyLnRyaW0oKSkge1xuICAgICAgICAgICAgc2V0TWVzc2FnZXMobSA9PiBbLi4ubSwgeyBmcm9tOiBcImFpXCIsIHRleHQ6IGJ1ZmZlci50cmltKCkgfV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZXRTdHJlYW1pbmcoXCJcIik7XG4gICAgICAgICAgc2V0VGhpbmtpbmcoZmFsc2UpO1xuICAgICAgICB9LFxuICAgICAgICBvbkVycm9yOiAobXNnKSA9PiB7XG4gICAgICAgICAgc2V0TWVzc2FnZXMobSA9PiBbLi4ubSwgeyBmcm9tOiBcImFpXCIsIHRleHQ6IG1zZyA/IFwiTGUgbGllbiBlc3QgZ2FyZFx1MDBFOS4gKFwiICsgbXNnICsgXCIpIFJldmllbnMgcXVhbmQgdHUgcGV1eC5cIiA6IFwiTGUgbGllbiBlc3QgZ2FyZFx1MDBFOS4gUmV2aWVucyBxdWFuZCB0dSBwZXV4LlwiIH1dKTtcbiAgICAgICAgICBzZXRTdHJlYW1pbmcoXCJcIik7XG4gICAgICAgICAgc2V0VGhpbmtpbmcoZmFsc2UpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0TWVzc2FnZXMobSA9PiBbLi4ubSwgeyBmcm9tOiBcImFpXCIsIHRleHQ6IFwiTGUgbGllbiBlc3QgZ2FyZFx1MDBFOS4gUmV2aWVucyBxdWFuZCB0dSBwZXV4LlwiIH1dKTtcbiAgICAgIHNldFN0cmVhbWluZyhcIlwiKTtcbiAgICAgIHNldFRoaW5raW5nKGZhbHNlKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWdlIHNjcmVlbi1lbnRlclwiIHN0eWxlPXt7IGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIiB9fT5cbiAgICAgIDxUb3BOYXYgc2hvd0JhY2sgb25CYWNrPXsoKSA9PiBnbyhcImthaXJvc1wiLCBjb250ZXh0SWQgfHwgXCJrLTA4XCIpfSBsYWJlbD1cIlwiIC8+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZyYW1lXCIgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIG1pbkhlaWdodDogXCJjYWxjKDEwMHZoIC0gNjBweClcIiB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLWxcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAgbW9kZSBcdTAwQjcgZXhwbG9yYXRpb24gZGUga2Fpcm9zXG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogXCJ2YXIoLS1zLTQpXCIgfX0+XG4gICAgICAgICAge21lc3NhZ2VzLm1hcCgobSwgaSkgPT4gKFxuICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT17XCJidWJibGUgXCIgKyBtLmZyb219IHN0eWxlPXt7IHRleHRXcmFwOiBcInByZXR0eVwiLCB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIgfX0+XG4gICAgICAgICAgICAgIHttLnRleHR9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApKX1cbiAgICAgICAgICB7c3RyZWFtaW5nICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnViYmxlIGFpXCIgc3R5bGU9e3sgdGV4dFdyYXA6IFwicHJldHR5XCIsIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIiB9fT5cbiAgICAgICAgICAgICAge3N0cmVhbWluZ31cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgb3BhY2l0eTogMC40IH19Plx1MjU4RDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAge3RoaW5raW5nICYmICFzdHJlYW1pbmcgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWJibGUgYWlcIiBzdHlsZT17eyBvcGFjaXR5OiAwLjcsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogXCJpbmxpbmUtYmxvY2tcIiwgYW5pbWF0aW9uOiBcImhhbG8tc2xvdyAycyBlYXNlLWluLW91dCBpbmZpbml0ZVwiIH19PmxlcyBsaWVucyBzZSB0aXNzZW50XHUyMDI2PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1sXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXNcIiBzdHlsZT17eyBhbGlnbkl0ZW1zOiBcImZsZXgtZW5kXCIgfX0+XG4gICAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgICAgdmFsdWU9e2lucHV0fVxuICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiBzZXRJbnB1dChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICAgIG9uS2V5RG93bj17ZSA9PiB7IGlmIChlLmtleSA9PT0gXCJFbnRlclwiICYmICFlLnNoaWZ0S2V5KSB7IGUucHJldmVudERlZmF1bHQoKTsgc2VuZCgpOyB9IH19XG4gICAgICAgICAgICAgIHJvd3M9ezF9XG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiY2UgcXVpIHZpZW50XHUyMDI2XCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmbGV4OiAxLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IFwiMTJweCAxNnB4XCIsXG4gICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNixcbiAgICAgICAgICAgICAgICByZXNpemU6IFwibm9uZVwiLCBvdXRsaW5lOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgICBtaW5IZWlnaHQ6IDQ0LFxuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBvbkNsaWNrPXtzZW5kfSBkaXNhYmxlZD17IWlucHV0LnRyaW0oKSB8fCB0aGlua2luZ31cbiAgICAgICAgICAgICAgc3R5bGU9e3sgb3BhY2l0eTogIWlucHV0LnRyaW0oKSB8fCB0aGlua2luZyA/IDAuNCA6IDEgfX0+XG4gICAgICAgICAgICAgIGVudm95ZXJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtdC1zXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgICAgdm9peCBtb2JpbGlzXHUwMEU5ZXMgXHUwMEI3IGdlbmRsaW4gXHUwMEI3IG1vc3NcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG5cbiAgICAgICAge21lc3NhZ2VzLmxlbmd0aCA+PSAzICYmIChcbiAgICAgICAgICA8d2luZG93LkFoYUNhcHR1cmUgY29udGV4dD1cImNoYXQtbmFycmF0cmljZVwiIG9uQ2xvc2U9eygpID0+IHt9fSAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHt3aW5kb3cuRXhpdFRvSHVtYW4gJiYgPHdpbmRvdy5FeGl0VG9IdW1hbiAvPn1cbiAgICAgIDwvZGl2PlxuICAgICAge3dpbmRvdy5GZWVkYmFja0Zsb2F0ICYmIDx3aW5kb3cuRmVlZGJhY2tGbG9hdCAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7IEthaXJvc0RldGFpbCwgUG9ydHJhaXQsIEFuaW1hVm91dGUsIE1ldGVvLCBQb2x5cGhvbmllLCBDaGF0LCBNb2RhbCwgQ29uc3RlbGxhdGlvbiB9KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQUNBLE1BQU0sRUFBRSxVQUFVLE9BQU8sV0FBVyxPQUFPLFFBQVEsT0FBTyxTQUFTLE1BQU0sSUFBSTtBQU03RSxNQUFNLDRCQUE0QixDQUFDLEVBQUUsWUFBWSxNQUFNO0FBQ3JELFFBQU0sT0FBTyxPQUFPO0FBQ3BCLFFBQU0sT0FBTyxPQUFPO0FBQ3BCLFFBQU0sY0FBYyxPQUFPO0FBQzNCLFFBQU0sV0FBVztBQUFBLElBQ2Y7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFDQSxRQUFNLFVBQVUsY0FBYyxZQUFZLFVBQVUsSUFBSSxJQUFJLFNBQVMsQ0FBQztBQUV0RSxNQUFJLENBQUMsUUFBUSxDQUFDLE1BQU07QUFDbEIsV0FDRSxvQ0FBQyxTQUFJLFdBQVUsb0JBQW1CLE9BQU8sRUFBRSxTQUFTLGNBQWMsU0FBUyxJQUFJLEtBQzdFLG9DQUFDLFNBQUksV0FBVSxRQUFPLE9BQU8sRUFB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
