const { useState: uS, useEffect: uE, useRef: uR } = React;
const ACCOUNT_CREATED_KEY = "dream:account-created";
function AppShell() {
  var _a;
  uE(() => {
    var _a2, _b;
    try {
      if (!localStorage.getItem(ACCOUNT_CREATED_KEY)) {
        localStorage.setItem(ACCOUNT_CREATED_KEY, String(Date.now()));
      }
      const params = new URLSearchParams(location.search);
      if (params.get("reveal-all") === "1") {
        const ALL_DISCOVERIES = ["journal-vie", "cercle", "anima", "portrait-lettre", "protocoles"];
        localStorage.setItem("dream:discovery:revealed", JSON.stringify(ALL_DISCOVERIES));
        localStorage.setItem("dream:felt-shift-mode", "6-zones");
        localStorage.setItem("dream:felt-shift-prompted", String(Date.now()));
        localStorage.setItem("dream:onboarded:b-plus-d", String(Date.now()));
        const j35ago = Date.now() - 35 * 24 * 3600 * 1e3;
        localStorage.setItem(ACCOUNT_CREATED_KEY, String(j35ago));
        console.log("[Dream] \u{1F31F} reveal-all=1 activ\xE9 \u2014 toute l'app d\xE9bloqu\xE9e. Reload sans le param pour explorer.");
      }
      if (params.get("reset-discovery") === "1") {
        localStorage.removeItem("dream:discovery:revealed");
        localStorage.removeItem("dream:felt-shift-mode");
        localStorage.removeItem("dream:felt-shift-prompted");
        localStorage.removeItem("dream:somatic-gate-enabled");
        localStorage.removeItem("dream:somatic-gate-prompted");
        localStorage.removeItem("dream:onboarded:b-plus-d");
        localStorage.removeItem(ACCOUNT_CREATED_KEY);
        try {
          (_b = (_a2 = window.wowRegistry) == null ? void 0 : _a2.reset) == null ? void 0 : _b.call(_a2);
        } catch (e) {
        }
        console.log("[Dream] \u{1F504} reset-discovery=1 activ\xE9 \u2014 \xE9tat initial restaur\xE9.");
      }
    } catch (e) {
    }
  }, []);
  const [needsOnboarding, setNeedsOnboarding] = uS(() => {
    try {
      if (typeof window.isOnboardedBPlusD === "function") {
        return !window.isOnboardedBPlusD();
      }
      return !localStorage.getItem("dream:onboarded:b-plus-d");
    } catch (e) {
      return false;
    }
  });
  const [screen, setScreen] = uS(() => {
    try {
      const p = new URL(location.href).hash.replace("#", "");
      return p || "home";
    } catch (e) {
      return "home";
    }
  });
  const [ctx, setCtx] = uS(null);
  const swipeStartRef = uR(null);
  const [entries, setEntries] = uS(window.seedEntries || []);
  const [entriesLoading, setEntriesLoading] = uS(true);
  const [toast, setToast] = uS(null);
  uE(() => {
    window.DreamInsertLocalKairos = (localKairos) => {
      setEntries((prev) => {
        if (prev.find((e) => e.id === localKairos.id)) return prev;
        return [localKairos, ...prev];
      });
    };
    window.DreamReplaceLocalKairos = (localId, real) => {
      var _a2, _b;
      const mapped = {
        id: real.id,
        type: real.type || real.kairos_type || "dream_night",
        when: real.when || "\xE0 l'instant",
        text: real.text || real.raw_text || "",
        raw_text: real.raw_text,
        numinous: real.numinous,
        bigDream: real.bigDream,
        created_at: real.created_at,
        synthesis_text: real.synthesis_text,
        synthesis_voices: real.synthesis_voices,
        _raw: real
      };
      try {
        const newTags = [
          ...real.archetypal_tags || ((_a2 = real._raw) == null ? void 0 : _a2.archetypal_tags) || [],
          ...real.motif_tags || ((_b = real._raw) == null ? void 0 : _b.motif_tags) || []
        ].map((t) => String(t).toLowerCase().trim()).filter(Boolean);
        if (newTags.length > 0) {
          setEntries((prev) => {
            var _a3, _b2;
            const seen = /* @__PURE__ */ new Set();
            for (const e of prev) {
              const tags = [
                ...((_a3 = e._raw) == null ? void 0 : _a3.archetypal_tags) || [],
                ...((_b2 = e._raw) == null ? void 0 : _b2.motif_tags) || []
              ];
              tags.forEach((t) => seen.add(String(t).toLowerCase().trim()));
            }
            const fresh = newTags.find((t) => !seen.has(t));
            if (fresh && window.dreamShowConstellationOverlay) {
              setTimeout(() => {
                var _a4, _b3;
                try {
                  window.dreamShowConstellationOverlay({ newFigureLabel: fresh });
                  (_b3 = (_a4 = window.wowRegistry) == null ? void 0 : _a4.fire) == null ? void 0 : _b3.call(_a4, "naissance-noeud");
                } catch (e) {
                }
              }, 1200);
            }
            return prev.map((e) => e.id === localId ? mapped : e);
          });
          return;
        }
      } catch (e) {
      }
      setEntries((prev) => prev.map((e) => e.id === localId ? mapped : e));
    };
    window.dreamShowToast = (opts) => {
      const id = "t-" + Date.now();
      setToast({ id, ...opts });
    };
  }, []);
  const refreshEntries = async () => {
    try {
      setEntriesLoading(true);
      const data = await window.DreamAPI.listKairos({ limit: 50 });
      const rows = ((data == null ? void 0 : data.kairos) || []).map((k) => ({
        id: k.id,
        type: k.type,
        when: k.when,
        text: k.text || k.raw_text || "",
        numinous: k.numinous,
        bigDream: k.bigDream,
        // keep raw backend fields available
        _raw: k
      }));
      if (rows.length === 0 && (data == null ? void 0 : data._seed)) {
        setEntries((prev) => {
          const pending = prev.filter((e) => e._pending);
          return pending.length ? [...pending, ...window.seedEntries || []] : window.seedEntries || [];
        });
      } else if (rows.length === 0) {
        setEntries((prev) => prev.filter((e) => e._pending));
      } else {
        setEntries((prev) => {
          const pending = prev.filter((e) => e._pending);
          const pendingFiltered = pending.filter((p) => !rows.find((r) => r.id === p.id));
          return [...pendingFiltered, ...rows];
        });
      }
    } catch (e) {
      console.warn("[App] refreshEntries failed:", e.message);
      setEntries(window.seedEntries || []);
    } finally {
      setEntriesLoading(false);
    }
  };
  uE(() => {
    refreshEntries();
    if (window.DreamAuth && !window.DreamAuth.noAuth) {
      const unsub = window.DreamAuth.onAuthChange(() => {
        refreshEntries();
      });
      return unsub;
    }
  }, []);
  uE(() => {
    window.DreamRefreshEntries = refreshEntries;
    window.DreamEntriesLoading = entriesLoading;
  });
  const go = (s, c) => {
    setScreen(s);
    setCtx(c || null);
    try {
      location.hash = s;
    } catch (e) {
    }
    window.scrollTo({ top: 0 });
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { screen: s } }, "*");
    } catch (e) {
    }
  };
  uE(() => {
    let tweaksAllowed = false;
    try {
      tweaksAllowed = localStorage.getItem("dream:tweaks-enabled") === "true";
      if (!tweaksAllowed) {
        const params = new URLSearchParams(location.search);
        if (params.get("tweaks") === "1") {
          tweaksAllowed = true;
        }
      }
    } catch (e) {
    }
    if (!tweaksAllowed) {
      return;
    }
    const handler = (e) => {
      var _a2, _b;
      if (((_a2 = e.data) == null ? void 0 : _a2.type) === "__activate_edit_mode") setTweaks(true);
      if (((_b = e.data) == null ? void 0 : _b.type) === "__deactivate_edit_mode") setTweaks(false);
    };
    window.addEventListener("message", handler);
    try {
      window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    } catch (e) {
    }
    return () => window.removeEventListener("message", handler);
  }, []);
  const [nightmareProposal, setNightmareProposal] = uS(null);
  uE(() => {
    let cancelled = false;
    (async () => {
      var _a2;
      try {
        const dismissedAt = parseInt(localStorage.getItem("dream:nightmare-proposal:dismissed-at") || "0", 10);
        if (Date.now() - dismissedAt < 7 * 24 * 3600 * 1e3) return;
        if (!((_a2 = window.DreamAPI) == null ? void 0 : _a2.autoDetectProtection)) return;
        const r = await window.DreamAPI.autoDetectProtection();
        if (cancelled) return;
        if (r == null ? void 0 : r.propose) {
          setNightmareProposal({ count: r.recent_low_valence_count || 3 });
        }
      } catch (e) {
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  const [tweaks, setTweaks] = uS(false);
  const TWEAK_DEFAULTS = (
    /*EDITMODE-BEGIN*/
    {
      "screen": "home"
    }
  );
  uE(() => {
    if (TWEAK_DEFAULTS.screen && TWEAK_DEFAULTS.screen !== screen) {
      setScreen(TWEAK_DEFAULTS.screen);
    }
  }, []);
  const entry = ctx ? entries.find((e) => e.id === ctx) || (window.seedEntries || [])[0] : entries[0] || (window.seedEntries || [])[0];
  let view;
  switch (screen) {
    // core flow
    case "capture":
      view = /* @__PURE__ */ React.createElement(window.Capture, { go });
      break;
    case "journal":
      view = /* @__PURE__ */ React.createElement(window.Journal, { go, entries, loading: entriesLoading });
      break;
    case "kairos":
      view = /* @__PURE__ */ React.createElement(window.KairosDetail, { go, entry: entry || entries[0], allEntries: entries });
      break;
    // 2026-04-25 — Portrait refonte LETTRE narrative (Design §7.6)
    case "portrait":
      view = window.PortraitNarrative ? /* @__PURE__ */ React.createElement(window.PortraitNarrative, { go }) : /* @__PURE__ */ React.createElement(window.Portrait, { go });
      break;
    case "portrait-carte":
      view = /* @__PURE__ */ React.createElement(window.Portrait, { go });
      break;
    // sous-page constellation
    // 2026-04-26 — Anima Mundi 1 écran scrollable (Design §11.bis.5)
    // Tous les sub-routes legacy redirigent vers AnimaUnifiedScreen avec
    // scrollToSection (la page scroll smooth vers la section au mount).
    case "anima":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go }) : window.AnimaVouteScreen ? /* @__PURE__ */ React.createElement(window.AnimaVouteScreen, { go }) : /* @__PURE__ */ React.createElement(window.AnimaVoute, { go });
      break;
    case "anima-meteo":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go, scrollToSection: "meteo" }) : window.AnimaMeteoScreen ? /* @__PURE__ */ React.createElement(window.AnimaMeteoScreen, { go }) : /* @__PURE__ */ React.createElement(window.Meteo, { go });
      break;
    case "anima-annales":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go, scrollToSection: "annales" }) : window.AnimaAnnalesScreen ? /* @__PURE__ */ React.createElement(window.AnimaAnnalesScreen, { go }) : /* @__PURE__ */ React.createElement(window.AnnalesScreen, { go });
      break;
    case "anima-polyphonie":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go, scrollToSection: "polyphonie" }) : window.AnimaPolyphonieScreen ? /* @__PURE__ */ React.createElement(window.AnimaPolyphonieScreen, { go }) : /* @__PURE__ */ React.createElement(window.Polyphonie, { go });
      break;
    // Compat legacy : redirige aussi vers l'écran unifié
    case "meteo":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go, scrollToSection: "meteo" }) : window.AnimaMeteoScreen ? /* @__PURE__ */ React.createElement(window.AnimaMeteoScreen, { go }) : /* @__PURE__ */ React.createElement(window.Meteo, { go });
      break;
    case "polyphonie":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go, scrollToSection: "polyphonie" }) : window.AnimaPolyphonieScreen ? /* @__PURE__ */ React.createElement(window.AnimaPolyphonieScreen, { go }) : /* @__PURE__ */ React.createElement(window.Polyphonie, { go });
      break;
    case "annales":
      view = window.AnimaUnifiedScreen ? /* @__PURE__ */ React.createElement(window.AnimaUnifiedScreen, { go, scrollToSection: "annales" }) : window.AnimaAnnalesScreen ? /* @__PURE__ */ React.createElement(window.AnimaAnnalesScreen, { go }) : /* @__PURE__ */ React.createElement(window.AnnalesScreen, { go });
      break;
    case "chat":
      view = /* @__PURE__ */ React.createElement(window.Chat, { go, contextId: ctx });
      break;
    // 2026-04-28 — Pivot Chat IA Dream personnel (Sprint A, Design §11.bis.20)
    case "dream-chat":
      view = /* @__PURE__ */ React.createElement(window.DreamChatHome, { go });
      break;
    // cercle (refonte 2026-04-25 — Bible §3.4.1 + Design §7.7)
    case "cercle":
      view = /* @__PURE__ */ React.createElement(window.CercleScreen, { go });
      break;
    case "cercle-detail":
      view = window.CercleSubApp ? /* @__PURE__ */ React.createElement(window.CercleSubApp, { go, circleId: ctx }) : /* @__PURE__ */ React.createElement(window.CercleDetail, { go, circleId: ctx });
      break;
    case "creer-cercle":
      view = /* @__PURE__ */ React.createElement(window.CreerCercleScreen, { go });
      break;
    case "rejoindre":
      view = /* @__PURE__ */ React.createElement(window.RejoindreScreen, { go });
      break;
    case "partager-reve":
      view = /* @__PURE__ */ React.createElement(window.PartagerReveScreen, { go });
      break;
    // 2026-04-27 — Sprint P0.2 : Explorer hub (remplace drawer caché)
    // Spec : 2_DESIGN §11.bis.17. ExplorerScreen = liste sobre des sous-apps
    // organisée en 3 sections (Le tien · Les autres · Profondeurs).
    case "explorer":
      view = window.ExplorerScreen ? /* @__PURE__ */ React.createElement(window.ExplorerScreen, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    case "comment":
      view = window.CommentScreen ? /* @__PURE__ */ React.createElement(window.CommentScreen, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    // 2026-04-27 — Sprint P0.4 : Glossaire (Design §11.bis.18)
    case "glossaire":
      view = window.GlossaireScreen ? /* @__PURE__ */ React.createElement(window.GlossaireScreen, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    // 2026-04-29 — Mon dictionnaire (moat épistémique, 4_LOG.md 2026-04-29)
    case "personal-dictionary":
      view = window.PersonalDictionaryScreen ? /* @__PURE__ */ React.createElement(window.PersonalDictionaryScreen, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    // anima mundi (legacy / utilitaire)
    case "offre-kairos":
      view = /* @__PURE__ */ React.createElement(window.OffreKairosScreen, { go });
      break;
    // soma
    case "oracle-corps":
      view = /* @__PURE__ */ React.createElement(window.OracleCorpsScreen, { go });
      break;
    case "conte-miroir":
      view = /* @__PURE__ */ React.createElement(window.ConteMiroirScreen, { go });
      break;
    case "reentry":
      view = /* @__PURE__ */ React.createElement(window.ReentryScreen, { go });
      break;
    // 2026-04-26 nuit profonde — Quick vs Protocole Accompagné (Bible §3.11)
    case "capture-choice":
      view = window.CaptureChoiceScreen ? /* @__PURE__ */ React.createElement(window.CaptureChoiceScreen, { go }) : /* @__PURE__ */ React.createElement(window.Capture, { go });
      break;
    case "protocole-selector":
      view = window.ProtocoleSelector ? /* @__PURE__ */ React.createElement(window.ProtocoleSelector, { go }) : /* @__PURE__ */ React.createElement(window.Capture, { go });
      break;
    case "protocole-sub-flow":
      view = window.ProtocoleSubFlow ? /* @__PURE__ */ React.createElement(
        window.ProtocoleSubFlow,
        {
          go,
          protocolId: ctx == null ? void 0 : ctx.protocolId,
          kairosId: ctx == null ? void 0 : ctx.kairosId,
          entryId: ctx == null ? void 0 : ctx.entryId
        }
      ) : /* @__PURE__ */ React.createElement(window.Capture, { go });
      break;
    case "protocole-pre-sommeil":
      view = window.ProtocoleSubFlow ? /* @__PURE__ */ React.createElement(
        window.ProtocoleSubFlow,
        {
          go,
          protocolId: "pre_sommeil"
        }
      ) : /* @__PURE__ */ React.createElement(window.Capture, { go });
      break;
    // meta
    case "onboarding":
      view = /* @__PURE__ */ React.createElement(window.OnboardingScreen, { go });
      break;
    case "privacy":
      view = /* @__PURE__ */ React.createElement(window.PrivacyScreen, { go });
      break;
    case "notifs":
      view = /* @__PURE__ */ React.createElement(window.NotifsScreen, { go });
      break;
    case "abonnement":
      view = /* @__PURE__ */ React.createElement(window.AbonnementScreen, { go });
      break;
    // figure
    case "figure":
      view = /* @__PURE__ */ React.createElement(window.FigureDetailScreen, { go });
      break;
    // v1.2 amplification
    case "bigdream-signal":
      view = /* @__PURE__ */ React.createElement(window.BigDreamSignalScreen, { go });
      break;
    // 2026-04-26 — Sanctuaire Nightmares (Bible §17.3) MODE INTÉGRÉ + écran dédié
    case "nightmares":
      view = /* @__PURE__ */ React.createElement(window.NightmaresScreen, { go });
      break;
    // 2026-04-29 — Big Dream Workflow 7 jours (Feature 3, 4_LOG.md)
    // ctx peut être un workflow_id (string) OU { workflow_id, kairos_id }
    case "bigdream-workflow":
      view = window.BigDreamWorkflowScreen ? /* @__PURE__ */ React.createElement(window.BigDreamWorkflowScreen, { go, ctx }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    // 2026-04-29 — Recurring Re-entry (Feature 4) — fermeture boucle ouverte UI
    // ctx peut être un pattern_id string OU { pattern_id }. Sans ctx → liste patterns.
    case "recurring":
    case "recurring-re-entry":
      view = window.RecurringReEntryScreen ? /* @__PURE__ */ React.createElement(window.RecurringReEntryScreen, { go, ctx }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    // 2026-04-26 — Sous-app Lucid Dreaming (Bible §17) opt-in strict
    // Si user n'a pas activé lucid mode → redirect vers profile (onboarding)
    case "lucid-profile":
      view = /* @__PURE__ */ React.createElement(window.LucidProfileScreen, { go });
      break;
    case "lucid-dashboard":
    case "lucid-reality-checks":
    case "lucid-dream-signs":
    case "lucid-wbtb": {
      const lucidEnabled = (() => {
        try {
          return localStorage.getItem("dream:lucid:enabled") === "true";
        } catch (e) {
          return false;
        }
      })();
      if (!lucidEnabled) {
        view = /* @__PURE__ */ React.createElement(window.LucidProfileScreen, { go });
      } else if (screen === "lucid-dashboard") view = /* @__PURE__ */ React.createElement(window.LucidDashboardScreen, { go });
      else if (screen === "lucid-reality-checks") view = /* @__PURE__ */ React.createElement(window.LucidRealityChecksScreen, { go });
      else if (screen === "lucid-dream-signs") view = /* @__PURE__ */ React.createElement(window.LucidDreamSignsScreen, { go });
      else if (screen === "lucid-wbtb") view = /* @__PURE__ */ React.createElement(window.LucidWBTBScreen, { go });
      break;
    }
    // 2026-04-25 — Vue contemplative ancienne (1 kairos en grand)
    case "home-nuit":
      view = /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    // 2026-04-25 — Drill-down section : ctx = objet section complet
    case "journal-section":
      view = window.JournalSectionDrillDown ? /* @__PURE__ */ React.createElement(window.JournalSectionDrillDown, { go, section: ctx }) : /* @__PURE__ */ React.createElement(window.JournalDeVieJour, { go });
      break;
    // 2026-04-26 (soir) — Pivot porte d'entrée RÊVE (Bible §1.6 + Design §11.bis.12)
    // home → DreamHome (NOUVEAU DEFAULT). home-jour → Journal de Vie LUMINEUX (sous-page)
    case "home":
      view = window.DreamHome ? /* @__PURE__ */ React.createElement(window.DreamHome, { go, entries }) : window.JournalDeVieJour ? /* @__PURE__ */ React.createElement(window.JournalDeVieJour, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    case "home-jour":
    case "journal-jour":
      view = window.JournalDeVieJour ? /* @__PURE__ */ React.createElement(window.JournalDeVieJour, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
      break;
    default:
      view = window.DreamHome ? /* @__PURE__ */ React.createElement(window.DreamHome, { go, entries }) : window.JournalDeVieJour ? /* @__PURE__ */ React.createElement(window.JournalDeVieJour, { go }) : /* @__PURE__ */ React.createElement(window.Home, { go, entries, loading: entriesLoading });
  }
  if (window.OnboardingRituel && (needsOnboarding || screen === "onboarding-rituel")) {
    return /* @__PURE__ */ React.createElement(window.OnboardingRituel, { go: (s, c) => {
      setNeedsOnboarding(false);
      go(s || "home", c);
    } });
  }
  const isVieScreen = screen === "home" || screen === "home-jour" || screen === "journal-jour";
  const onTouchStart = (e) => {
    var _a2;
    if (!isVieScreen) return;
    const t = (_a2 = e.touches) == null ? void 0 : _a2[0];
    if (!t) return;
    swipeStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    var _a2;
    if (!isVieScreen) return;
    const start = swipeStartRef.current;
    if (!start) return;
    swipeStartRef.current = null;
    const t = (_a2 = e.changedTouches) == null ? void 0 : _a2[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const dt = Date.now() - start.t;
    if (Math.abs(dx) < 80) return;
    if (Math.abs(dy) > Math.abs(dx) * 0.8) return;
    if (dt > 800) return;
    if (dx < 0 && screen === "home") {
      go("home-jour");
    } else if (dx > 0 && (screen === "home-jour" || screen === "journal-jour")) {
      go("home");
    }
  };
  const isJourActive = screen === "home-jour" || screen === "journal-jour";
  const dayNightIndicator = isVieScreen ? /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    top: "calc(env(safe-area-inset-top, 0px) + 6px)",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    gap: 10,
    zIndex: 40,
    pointerEvents: "none"
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: !isJourActive ? "var(--silk-gold, #C9B098)" : "color-mix(in oklch, var(--ash-light) 40%, transparent)",
    opacity: !isJourActive ? 0.85 : 0.4,
    transition: "all 380ms ease",
    boxShadow: !isJourActive ? "0 0 6px color-mix(in oklch, var(--silk-gold) 30%, transparent)" : "none"
  } }), /* @__PURE__ */ React.createElement("span", { style: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: isJourActive ? "var(--day-clay-warm, #C9B098)" : "color-mix(in oklch, var(--ash-light) 40%, transparent)",
    opacity: isJourActive ? 0.85 : 0.4,
    transition: "all 380ms ease",
    boxShadow: isJourActive ? "0 0 6px color-mix(in oklch, var(--day-clay-warm) 30%, transparent)" : "none"
  } })) : null;
  const isDemoMode = !!((_a = window.DreamAuth) == null ? void 0 : _a.noAuth);
  const onDemoSignIn = () => {
    try {
      const u = new URL(location.href);
      u.searchParams.delete("demo");
      location.href = u.toString();
    } catch (e) {
      location.reload();
    }
  };
  const demoBanner = isDemoMode ? /* @__PURE__ */ React.createElement("div", { role: "status", "aria-live": "polite", style: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    // au-dessus de BottomNav (50) ; sous modals (200+)
    background: "color-mix(in oklch, var(--ash-deep) 40%, color-mix(in oklch, var(--night-floor) 70%, transparent))",
    borderBottom: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    padding: "calc(env(safe-area-inset-top, 0px) + 6px) 16px 6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12,
    color: "var(--ash-light)",
    letterSpacing: "0.02em",
    lineHeight: 1.4
  } }, /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.9 } }, "mode d\xE9mo \xB7 les d\xE9p\xF4ts ne sont pas sauvegard\xE9s"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onDemoSignIn,
      "aria-label": "se connecter pour sauvegarder",
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
        color: "color-mix(in oklch, var(--silk-gold) 75%, var(--bone))",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12,
        padding: "3px 10px",
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 280ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 8%, transparent)";
        e.currentTarget.style.color = "var(--silk-gold)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "color-mix(in oklch, var(--silk-gold) 75%, var(--bone))";
      }
    },
    "se connecter \u2192"
  )) : null;
  const demoBannerOffset = isDemoMode ? "calc(env(safe-area-inset-top, 0px) + 32px)" : "0px";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      onTouchStart,
      onTouchEnd,
      style: { minHeight: "100vh", paddingTop: demoBannerOffset }
    },
    demoBanner,
    dayNightIndicator,
    window.SyncStatus && /* @__PURE__ */ React.createElement(window.SyncStatus, null),
    view,
    toast && window.OptimisticToast && /* @__PURE__ */ React.createElement(
      window.OptimisticToast,
      {
        key: toast.id,
        text: toast.text,
        tone: toast.tone,
        duration: toast.duration || 3e3,
        onDismiss: () => setToast(null)
      }
    ),
    /* @__PURE__ */ React.createElement(BottomNavV12, { screen, go }),
    tweaks && /* @__PURE__ */ React.createElement(TweaksUI, { screen, go }),
    nightmareProposal && window.NightmareAutoProposalModal && /* @__PURE__ */ React.createElement(
      window.NightmareAutoProposalModal,
      {
        count: nightmareProposal.count,
        onClose: () => {
          try {
            localStorage.setItem("dream:nightmare-proposal:dismissed-at", String(Date.now()));
          } catch (e) {
          }
          setNightmareProposal(null);
        },
        onActivate: () => {
          setNightmareProposal(null);
          go("nightmares");
        }
      }
    ),
    window.ConstellationOverlayRoot && /* @__PURE__ */ React.createElement(window.ConstellationOverlayRoot, null),
    window.EchoPropheticOverlayRoot && /* @__PURE__ */ React.createElement(window.EchoPropheticOverlayRoot, null)
  );
}
function BottomNavV12({ screen, go }) {
  const HIDE_NAV_ON = [
    "capture",
    "onboarding",
    "reentry",
    "kairos",
    "onboarding-rituel",
    // 2026-04-26 — protocoles flow (Bible §3.11)
    "capture-choice",
    "protocole-selector",
    "protocole-sub-flow",
    "protocole-pre-sommeil"
  ];
  if (HIDE_NAV_ON.includes(screen)) return null;
  const isDayMode = screen === "home-jour" || screen === "journal-jour" || screen === "journal-section";
  const isVieActive = ["home", "home-jour", "home-nuit", "journal-jour", "journal-section", "journal", "kairos"].includes(screen);
  const isPortraitActive = ["portrait", "portrait-carte", "figure"].includes(screen);
  const isCercleActive = [
    "cercle",
    "cercle-detail",
    "creer-cercle",
    "rejoindre",
    "partager-reve"
  ].includes(screen);
  const isAnimaActive = ["anima", "anima-meteo", "anima-annales", "anima-polyphonie", "meteo", "polyphonie", "annales"].includes(screen);
  const isOrbActive = ["dream-chat"].includes(screen);
  const isExplorerSubActive = [
    "explorer",
    "comment",
    "glossaire",
    "oracle-corps",
    "conte-miroir",
    "nightmares",
    "lucid-profile",
    "lucid-dashboard",
    "lucid-reality-checks",
    "lucid-dream-signs",
    "lucid-wbtb",
    "privacy",
    "notifs",
    "abonnement"
  ].includes(screen);
  const vieGlyph = isDayMode ? "\u2609" : "\u263E";
  const activeColor = isDayMode ? "var(--day-clay-warm, #C9B098)" : "var(--silk-gold)";
  const idleColor = isDayMode ? "var(--day-ash-soft, #776E62)" : "var(--ash-light)";
  const renderTab = (it) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: it.id,
      onClick: it.onTap,
      "aria-label": it.label,
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        padding: "6px 4px",
        color: it.active ? activeColor : idleColor,
        opacity: it.active ? 1 : 0.65,
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)"
      }
    },
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, fontStyle: "italic" } }, it.glyph),
    /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontStyle: "italic", letterSpacing: "0.02em" } }, it.label)
  );
  const leftItems = [
    {
      id: "home",
      label: "vie",
      glyph: vieGlyph,
      active: isVieActive,
      onTap: () => go(isDayMode ? "home-jour" : "home")
    },
    {
      id: "portrait",
      label: "portrait",
      glyph: "\u2737",
      active: isPortraitActive,
      onTap: () => go("portrait")
    }
  ];
  const rightItems = [
    {
      id: "cercle",
      label: "cercle",
      glyph: "\u25CB",
      active: isCercleActive,
      onTap: () => go("cercle")
    },
    {
      id: "anima",
      label: "le monde",
      glyph: "\u25D0",
      active: isAnimaActive,
      onTap: () => go("anima")
    }
  ];
  const longPressTimerRef = uR(null);
  const longPressFiredRef = uR(false);
  const ORB_LONGPRESS_MS = 600;
  const onOrbDown = (e) => {
    longPressFiredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      var _a;
      longPressFiredRef.current = true;
      try {
        if ((_a = window.navigator) == null ? void 0 : _a.vibrate) window.navigator.vibrate(15);
      } catch (e2) {
      }
      go("explorer");
    }, ORB_LONGPRESS_MS);
  };
  const onOrbUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  const onOrbLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };
  const onOrbClick = (e) => {
    if (longPressFiredRef.current) {
      e.preventDefault();
      e.stopPropagation();
      longPressFiredRef.current = false;
      return;
    }
    go("dream-chat");
  };
  return /* @__PURE__ */ React.createElement("nav", { style: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: isDayMode ? "color-mix(in oklch, var(--day-paper, #EBE2D2) 92%, transparent)" : "color-mix(in oklch, var(--night-floor) 92%, transparent)",
    borderTop: isDayMode ? "1px solid color-mix(in oklch, var(--day-clay-warm, #C9B098) 25%, transparent)" : "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    padding: "10px 8px calc(env(safe-area-inset-bottom, 0px) + 10px)",
    display: "grid",
    // 5 slots : Vie | Portrait | (ORBE) | Cercle | Le Monde
    gridTemplateColumns: "1fr 1fr 64px 1fr 1fr",
    alignItems: "center",
    justifyItems: "center",
    gap: 2,
    fontFamily: "var(--serif)",
    transition: "background 920ms ease, border-color 920ms ease"
  } }, leftItems.map(renderTab), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onOrbClick,
      onMouseDown: onOrbDown,
      onMouseUp: onOrbUp,
      onMouseLeave: onOrbLeave,
      onTouchStart: onOrbDown,
      onTouchEnd: onOrbUp,
      onTouchCancel: onOrbLeave,
      "aria-label": "parler avec anima \xB7 long-press pour explorer",
      title: "parler avec anima \xB7 long-press pour explorer",
      style: {
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: isOrbActive ? "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--silk-gold) 38%, var(--night-warm)), color-mix(in oklch, var(--ember) 22%, var(--night-floor)))" : "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--ember) 28%, var(--night-warm)), color-mix(in oklch, var(--silk-gold) 18%, var(--night-floor)))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        color: "var(--bone)",
        fontSize: 22,
        boxShadow: isOrbActive ? "0 0 32px color-mix(in oklch, var(--silk-gold) 32%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 30%, transparent)" : "0 0 24px color-mix(in oklch, var(--silk-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 20%, transparent)",
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
        marginTop: -16,
        fontStyle: "italic",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none"
      }
    },
    "\u263E"
  ), rightItems.map(renderTab));
}
function App() {
  const Gate = window.AuthGate || (({ children }) => children);
  const Halo = window.HaloRespire;
  return /* @__PURE__ */ React.createElement(Gate, null, Halo && /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "fixed",
    inset: "-10%",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.4
  } }, /* @__PURE__ */ React.createElement(Halo, { kind: "silk" })), /* @__PURE__ */ React.createElement(AppShell, null));
}
const screenGroups = [
  { label: "mati\xE8re", items: [
    ["home", "home \u2014 journal substrat"],
    ["capture", "capture \u2014 somatic gate"],
    ["journal", "journal de vie"],
    ["kairos", "d\xE9tail kairos"]
  ] },
  { label: "portrait", items: [
    ["portrait", "portrait \u2014 constellation"],
    ["figure", "d\xE9tail figure"]
  ] },
  { label: "cercle", items: [
    ["cercle", "cercle \u2014 liste"],
    ["cercle-detail", "cercle \u2014 d\xE9tail"],
    ["creer-cercle", "cr\xE9er un cercle"],
    ["rejoindre", "rejoindre cercle"],
    ["partager-reve", "partager un r\xEAve (legacy)"]
  ] },
  { label: "anima mundi (4 chambres)", items: [
    ["anima", "1 \xB7 la vo\xFBte (hub)"],
    ["anima-meteo", "2 \xB7 le temps qu'il fait dans la nuit"],
    ["anima-annales", "3 \xB7 tenu ensemble"],
    ["anima-polyphonie", "4 \xB7 polyphonie de la lune"],
    ["offre-kairos", "offre au kairos (legacy)"]
  ] },
  { label: "soma", items: [
    ["oracle-corps", "oracle du corps"],
    ["conte-miroir", "conte-miroir"],
    ["reentry", "r\xE9entr\xE9e onirique"],
    ["nightmares", "sanctuaire cauchemars & deuil"]
  ] },
  { label: "protocoles \xB7 quick vs accompagn\xE9", items: [
    ["capture-choice", "\xE9cran de choix \u26A1/\u{1F300}"],
    ["protocole-selector", "s\xE9lection des 9 protocoles"],
    ["protocole-pre-sommeil", "\u{1F319} pr\xE9-sommeil (raccourci)"]
  ] },
  { label: "narratrice", items: [
    ["chat", "chat narratrice"]
  ] },
  { label: "v1.2 amplifi\xE9", items: [
    ["bigdream-signal", "big dream signal"]
  ] },
  { label: "entr\xE9e & r\xE9glages", items: [
    ["onboarding", "onboarding p-z\xE9ro"],
    ["privacy", "param\xE8tres \xB7 privacy"],
    ["notifs", "param\xE8tres \xB7 notifs"],
    ["abonnement", "param\xE8tres \xB7 abonnement"]
  ] }
];
function TweaksUI({ screen, go }) {
  var _a;
  return /* @__PURE__ */ React.createElement("div", { style: {
    position: "fixed",
    bottom: 24,
    right: 24,
    zIndex: 200,
    width: 300,
    maxHeight: "calc(100vh - 48px)",
    overflowY: "auto",
    background: "var(--night-warm)",
    border: "1px solid var(--ash-mid)",
    padding: "var(--s-4)",
    fontFamily: "var(--sans)",
    fontSize: 13,
    color: "var(--bone)"
  } }, /* @__PURE__ */ React.createElement("div", { className: "row mb-m", style: { justifyContent: "space-between" } }, /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16 } }, "Tweaks"), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => {
    window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
  } }, "\xD7")), /* @__PURE__ */ React.createElement("div", { className: "meta op-70 mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic" } }, "\xE9cran"), /* @__PURE__ */ React.createElement("div", { className: "stack", style: { gap: 2 } }, screenGroups.map((g) => /* @__PURE__ */ React.createElement("div", { key: g.label, style: { marginTop: 10 } }, /* @__PURE__ */ React.createElement("div", { className: "meta op-70", style: { fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 4 } }, g.label.toUpperCase()), g.items.map(([k, l]) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: k,
      onClick: () => go(k),
      style: {
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "5px 10px",
        background: screen === k ? "color-mix(in oklch, var(--bone) 6%, transparent)" : "transparent",
        border: "1px solid " + (screen === k ? "var(--bone)" : "var(--ash-deep)"),
        color: screen === k ? "var(--bone)" : "var(--ash-light)",
        fontSize: 12.5,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        cursor: "pointer",
        marginBottom: 2
      }
    },
    l
  ))))), /* @__PURE__ */ React.createElement("div", { className: "mt-l", style: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: "1px solid var(--ash-deep)",
    fontSize: 11,
    fontFamily: "var(--mono)",
    color: "var(--ash-light)"
  } }, window.DreamUser ? /* @__PURE__ */ React.createElement(React.Fragment, null, "auth: ", window.DreamUser.email, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-text",
      style: { fontSize: 11, marginTop: 4 },
      onClick: async () => {
        await window.DreamAuth.signOut();
        location.reload();
      }
    },
    "d\xE9connexion"
  )) : ((_a = window.DreamAuth) == null ? void 0 : _a.noAuth) ? "auth: d\xE9sactiv\xE9e (seed mode)" : "auth: non connect\xE9"));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/* @__PURE__ */ React.createElement(App, null));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0LCBSZWFjdERPTSAqL1xuY29uc3QgeyB1c2VTdGF0ZTogdVMsIHVzZUVmZmVjdDogdUUsIHVzZVJlZjogdVIgfSA9IFJlYWN0O1xuXG4vLyAyMDI2LTA0LTI2IFx1MjAxNCBSZWZvbnRlIEIrRCAoRGVzaWduIFx1MDBBNzExLmJpcylcbi8vIC0gTWFyayBmaXJzdC1hY2Nlc3MgdGltZXN0YW1wIHBvdXIgaGVscGVyIGlzUG9zdEozMCAoYWNjb3VudC1jcmVhdGVkKVxuLy8gLSBJbml0aWFsIG9uYm9hcmRpbmcgc2NyZWVuIHNpIHBhcyBvbmJvYXJkXHUwMEU5XG5jb25zdCBBQ0NPVU5UX0NSRUFURURfS0VZID0gXCJkcmVhbTphY2NvdW50LWNyZWF0ZWRcIjtcblxuZnVuY3Rpb24gQXBwU2hlbGwoKSB7XG4gIC8vIFByZW1pZXIgYWNjXHUwMEU4cyA6IG9uIHN0YW1wIGFjY291bnQtY3JlYXRlZCAodXRpbGlzXHUwMEU5IHBhciBpc1Bvc3RKMzBcbiAgLy8gcG91ciBzb21hdGljIGdhdGUgKyBmZWx0LXNoaWZ0IG9wdC1pbiBhcHJcdTAwRThzIEozMClcbiAgdUUoKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKEFDQ09VTlRfQ1JFQVRFRF9LRVkpKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKEFDQ09VTlRfQ1JFQVRFRF9LRVksIFN0cmluZyhEYXRlLm5vdygpKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIDIwMjYtMDQtMjcgXHUyMDE0IENIRUFUIENPREUgcG91ciBleHBsb3JlciB0b3V0ZSBsJ2FwcCBzYW5zIGF0dGVuZHJlIE4gam91cnMuXG4gICAgICAvLyBVUkwgOiBgP3JldmVhbC1hbGw9MWAgZFx1MDBFOWJsb3F1ZSB0b3V0IDpcbiAgICAgIC8vICAgLSBUb3V0ZXMgbGVzIGRcdTAwRTljb3V2ZXJ0ZXMgcHJvZ3Jlc3NpdmVzIChKb3VybmFsLCBDZXJjbGUsIEFuaW1hLCBQb3J0cmFpdCBMZXR0cmUsIFByb3RvY29sZXMpXG4gICAgICAvLyAgIC0gRmVsdC1zaGlmdCA2IHpvbmVzIChhdSBsaWV1IGRlIDEgcGFyIGRcdTAwRTlmYXV0KVxuICAgICAgLy8gICAtIE9uYm9hcmRpbmcgc2tpcFxuICAgICAgLy8gICAtIEFjY291bnQtY3JlYXRlZCBiYWNrZGF0XHUwMEU5IFx1MDBFMCAzNSBqb3VycyAocGFzc2UgSjMwIHBvdXIgc29tYXRpYyBnYXRlIG9wdC1pbilcbiAgICAgIC8vIFBlcnNpc3RhbnQgOiByZXN0ZSBhY3RpZiB0YW50IHF1ZSBsb2NhbFN0b3JhZ2Ugbidlc3QgcGFzIHZpZFx1MDBFOS5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMobG9jYXRpb24uc2VhcmNoKTtcbiAgICAgIGlmIChwYXJhbXMuZ2V0KFwicmV2ZWFsLWFsbFwiKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgY29uc3QgQUxMX0RJU0NPVkVSSUVTID0gW1wiam91cm5hbC12aWVcIiwgXCJjZXJjbGVcIiwgXCJhbmltYVwiLCBcInBvcnRyYWl0LWxldHRyZVwiLCBcInByb3RvY29sZXNcIl07XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZHJlYW06ZGlzY292ZXJ5OnJldmVhbGVkXCIsIEpTT04uc3RyaW5naWZ5KEFMTF9ESVNDT1ZFUklFUykpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRyZWFtOmZlbHQtc2hpZnQtbW9kZVwiLCBcIjYtem9uZXNcIik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZHJlYW06ZmVsdC1zaGlmdC1wcm9tcHRlZFwiLCBTdHJpbmcoRGF0ZS5ub3coKSkpO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImRyZWFtOm9uYm9hcmRlZDpiLXBsdXMtZFwiLCBTdHJpbmcoRGF0ZS5ub3coKSkpO1xuICAgICAgICBjb25zdCBqMzVhZ28gPSBEYXRlLm5vdygpIC0gMzUgKiAyNCAqIDM2MDAgKiAxMDAwO1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShBQ0NPVU5UX0NSRUFURURfS0VZLCBTdHJpbmcoajM1YWdvKSk7XG4gICAgICAgIC8vIEZvcmNlIHRvdXQgbGVzIFdvdyBjb21tZSBkXHUwMEU5alx1MDBFMCB0aXJcdTAwRTlzIChwb3VyIHBhcyBhdm9pciBkJ292ZXJsYXkgc3VycHJpc2UpXG4gICAgICAgIC8vIG91IGF1IGNvbnRyYWlyZSBsZXMgcmVzZXQgc2kgb24gdmV1dCBsZXMgdm9pciB0b3VzIFx1MjE5MiBvbiBsZXMgbGFpc3NlIGludGFjdHNcbiAgICAgICAgY29uc29sZS5sb2coXCJbRHJlYW1dIFx1RDgzQ1x1REYxRiByZXZlYWwtYWxsPTEgYWN0aXZcdTAwRTkgXHUyMDE0IHRvdXRlIGwnYXBwIGRcdTAwRTlibG9xdVx1MDBFOWUuIFJlbG9hZCBzYW5zIGxlIHBhcmFtIHBvdXIgZXhwbG9yZXIuXCIpO1xuICAgICAgfVxuICAgICAgaWYgKHBhcmFtcy5nZXQoXCJyZXNldC1kaXNjb3ZlcnlcIikgPT09IFwiMVwiKSB7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFwiZHJlYW06ZGlzY292ZXJ5OnJldmVhbGVkXCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRyZWFtOmZlbHQtc2hpZnQtbW9kZVwiKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJkcmVhbTpmZWx0LXNoaWZ0LXByb21wdGVkXCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRyZWFtOnNvbWF0aWMtZ2F0ZS1lbmFibGVkXCIpO1xuICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcImRyZWFtOnNvbWF0aWMtZ2F0ZS1wcm9tcHRlZFwiKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJkcmVhbTpvbmJvYXJkZWQ6Yi1wbHVzLWRcIik7XG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKEFDQ09VTlRfQ1JFQVRFRF9LRVkpO1xuICAgICAgICB0cnkgeyB3aW5kb3cud293UmVnaXN0cnk/LnJlc2V0Py4oKTsgfSBjYXRjaCB7fVxuICAgICAgICBjb25zb2xlLmxvZyhcIltEcmVhbV0gXHVEODNEXHVERDA0IHJlc2V0LWRpc2NvdmVyeT0xIGFjdGl2XHUwMEU5IFx1MjAxNCBcdTAwRTl0YXQgaW5pdGlhbCByZXN0YXVyXHUwMEU5LlwiKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHt9XG4gIH0sIFtdKTtcblxuICAvLyBPbmJvYXJkaW5nIEIrRCA6IHNpIHBhcyBlbmNvcmUgZmFpdCBcdTIxOTIgYWZmaWNoZXIgbCdcdTAwRTljcmFuIHJpdHVlbFxuICAvLyB3aW5kb3cuaXNPbmJvYXJkZWRCUGx1c0QgcHJvdmllbnQgZGUgc2NyZWVucy1vbmJvYXJkaW5nLXJpdHVlbC5qc3hcbiAgY29uc3QgW25lZWRzT25ib2FyZGluZywgc2V0TmVlZHNPbmJvYXJkaW5nXSA9IHVTKCgpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cuaXNPbmJvYXJkZWRCUGx1c0QgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gIXdpbmRvdy5pc09uYm9hcmRlZEJQbHVzRCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRyZWFtOm9uYm9hcmRlZDpiLXBsdXMtZFwiKTtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH0pO1xuXG4gIGNvbnN0IFtzY3JlZW4sIHNldFNjcmVlbl0gPSB1UygoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpLmhhc2gucmVwbGFjZShcIiNcIiwgXCJcIik7XG4gICAgICByZXR1cm4gcCB8fCBcImhvbWVcIjtcbiAgICB9IGNhdGNoIHsgcmV0dXJuIFwiaG9tZVwiOyB9XG4gIH0pO1xuICBjb25zdCBbY3R4LCBzZXRDdHhdID0gdVMobnVsbCk7XG5cbiAgLy8gUmVmcyBwb3VyIHN3aXBlIGhvcml6b250YWwgSk9VUi9OVUlUIChEZXNpZ24gXHUwMEE3MTEuYmlzLjQpXG4gIGNvbnN0IHN3aXBlU3RhcnRSZWYgPSB1UihudWxsKTtcblxuICAvLyBMaXZlIGVudHJpZXMgXHUyMDE0IGxvYWRlZCBmcm9tIERyZWFtQVBJIG9uIG1vdW50ICsgb24gYXV0aCBjaGFuZ2UuXG4gIC8vIEZhbGxzIGJhY2sgdG8gc2VlZCBkYXRhIHdoZW4gQVBJIHVuYXZhaWxhYmxlIC8gbm90IGF1dGhlbnRpY2F0ZWQuXG4gIGNvbnN0IFtlbnRyaWVzLCBzZXRFbnRyaWVzXSA9IHVTKHdpbmRvdy5zZWVkRW50cmllcyB8fCBbXSk7XG4gIGNvbnN0IFtlbnRyaWVzTG9hZGluZywgc2V0RW50cmllc0xvYWRpbmddID0gdVModHJ1ZSk7XG5cbiAgLy8gMjAyNi0wNC0yNyBQMS40IFx1MjAxNCBUb2FzdCBxdWV1ZSAoMSB0b2FzdCBhdCBhIHRpbWUpXG4gIGNvbnN0IFt0b2FzdCwgc2V0VG9hc3RdID0gdVMobnVsbCk7XG5cbiAgLy8gT3B0aW1pc3RpYyBoZWxwZXJzIFx1MjAxNCBleHBvc1x1MDBFOXMgZ2xvYmFsZW1lbnQgcG91ciBDYXB0dXJlL0pvdXJuYWwvQ2VyY2xlLlxuICAvLyBJbnNlcnQgbG9jYWwgaW1tXHUwMEU5ZGlhdGVtZW50IChtXHUwMEVBbWUgaWQgYGxvY2FsLVx1MjAyNmAgZmxhZyBfcGVuZGluZykuXG4gIC8vIFJlcGxhY2UgbG9jYWwgcGFyIHJlYWwga2Fpcm9zIGF1IHJldG91ciBBUEkuXG4gIHVFKCgpID0+IHtcbiAgICB3aW5kb3cuRHJlYW1JbnNlcnRMb2NhbEthaXJvcyA9IChsb2NhbEthaXJvcykgPT4ge1xuICAgICAgc2V0RW50cmllcyhwcmV2ID0+IHtcbiAgICAgICAgLy8gXHUwMEM5dml0ZSBkdXBsaWNhdGVcbiAgICAgICAgaWYgKHByZXYuZmluZChlID0+IGUuaWQgPT09IGxvY2FsS2Fpcm9zLmlkKSkgcmV0dXJuIHByZXY7XG4gICAgICAgIHJldHVybiBbbG9jYWxLYWlyb3MsIC4uLnByZXZdO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICB3aW5kb3cuRHJlYW1SZXBsYWNlTG9jYWxLYWlyb3MgPSAobG9jYWxJZCwgcmVhbCkgPT4ge1xuICAgICAgY29uc3QgbWFwcGVkID0ge1xuICAgICAgICBpZDogcmVhbC5pZCxcbiAgICAgICAgdHlwZTogcmVhbC50eXBlIHx8IHJlYWwua2Fpcm9zX3R5cGUgfHwgXCJkcmVhbV9uaWdodFwiLFxuICAgICAgICB3aGVuOiByZWFsLndoZW4gfHwgXCJcdTAwRTAgbCdpbnN0YW50XCIsXG4gICAgICAgIHRleHQ6IHJlYWwudGV4dCB8fCByZWFsLnJhd190ZXh0IHx8IFwiXCIsXG4gICAgICAgIHJhd190ZXh0OiByZWFsLnJhd190ZXh0LFxuICAgICAgICBudW1pbm91czogcmVhbC5udW1pbm91cyxcbiAgICAgICAgYmlnRHJlYW06IHJlYWwuYmlnRHJlYW0sXG4gICAgICAgIGNyZWF0ZWRfYXQ6IHJlYWwuY3JlYXRlZF9hdCxcbiAgICAgICAgc3ludGhlc2lzX3RleHQ6IHJlYWwuc3ludGhlc2lzX3RleHQsXG4gICAgICAgIHN5bnRoZXNpc192b2ljZXM6IHJlYWwuc3ludGhlc2lzX3ZvaWNlcyxcbiAgICAgICAgX3JhdzogcmVhbCxcbiAgICAgIH07XG4gICAgICAvLyAyMDI2LTA0LTI5IFx1MjAxNCBUcmlnZ2VyIENvbnN0ZWxsYXRpb25PdmVybGF5IHNpIG5vdXZlbGxlIGZpZ3VyZS9hcmNoXHUwMEU5dHlwZS5cbiAgICAgIC8vIENvbXBhcmUgYXJjaGV0eXBhbF90YWdzICsgbW90aWZfdGFncyBkdSByZWFsIGthaXJvcyBhdmVjIGNldXggZGVzXG4gICAgICAvLyBlbnRyaWVzIHByXHUwMEU5Y1x1MDBFOWRlbnRlcyA6IHNpIFVOIG5vdXZlYXUgbGFiZWwgYXBwYXJhXHUwMEVFdCBxdWkgbidleGlzdGFpdFxuICAgICAgLy8gcGFzIGF2YW50IFx1MjE5MiBmaXJlIGwnb3ZlcmxheSAoMVx1MDBENyB2aWEgd293UmVnaXN0cnkgXCJuYWlzc2FuY2Utbm9ldWRcIikuXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBuZXdUYWdzID0gW1xuICAgICAgICAgIC4uLigocmVhbC5hcmNoZXR5cGFsX3RhZ3MgfHwgcmVhbC5fcmF3Py5hcmNoZXR5cGFsX3RhZ3MpIHx8IFtdKSxcbiAgICAgICAgICAuLi4oKHJlYWwubW90aWZfdGFncyB8fCByZWFsLl9yYXc/Lm1vdGlmX3RhZ3MpIHx8IFtdKSxcbiAgICAgICAgXS5tYXAodCA9PiBTdHJpbmcodCkudG9Mb3dlckNhc2UoKS50cmltKCkpLmZpbHRlcihCb29sZWFuKTtcbiAgICAgICAgaWYgKG5ld1RhZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNldEVudHJpZXMocHJldiA9PiB7XG4gICAgICAgICAgICBjb25zdCBzZWVuID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBlIG9mIHByZXYpIHtcbiAgICAgICAgICAgICAgY29uc3QgdGFncyA9IFtcbiAgICAgICAgICAgICAgICAuLi4oKGUuX3Jhdz8uYXJjaGV0eXBhbF90YWdzKSB8fCBbXSksXG4gICAgICAgICAgICAgICAgLi4uKChlLl9yYXc/Lm1vdGlmX3RhZ3MpIHx8IFtdKSxcbiAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgdGFncy5mb3JFYWNoKHQgPT4gc2Vlbi5hZGQoU3RyaW5nKHQpLnRvTG93ZXJDYXNlKCkudHJpbSgpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBmcmVzaCA9IG5ld1RhZ3MuZmluZCh0ID0+ICFzZWVuLmhhcyh0KSk7XG4gICAgICAgICAgICBpZiAoZnJlc2ggJiYgd2luZG93LmRyZWFtU2hvd0NvbnN0ZWxsYXRpb25PdmVybGF5KSB7XG4gICAgICAgICAgICAgIC8vIERcdTAwRTlsYWkgbFx1MDBFOWdlciBwb3VyIGxhaXNzZXIgQ2FwdHVyZVBvc3RTZXF1ZW5jZWQgcydhbmltZXIgZW4gcHJlbWllclxuICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgd2luZG93LmRyZWFtU2hvd0NvbnN0ZWxsYXRpb25PdmVybGF5KHsgbmV3RmlndXJlTGFiZWw6IGZyZXNoIH0pO1xuICAgICAgICAgICAgICAgICAgd2luZG93Lndvd1JlZ2lzdHJ5Py5maXJlPy4oXCJuYWlzc2FuY2Utbm9ldWRcIik7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCB7fVxuICAgICAgICAgICAgICB9LCAxMjAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcmV2Lm1hcChlID0+IChlLmlkID09PSBsb2NhbElkID8gbWFwcGVkIDogZSkpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7fVxuICAgICAgc2V0RW50cmllcyhwcmV2ID0+IHByZXYubWFwKGUgPT4gKGUuaWQgPT09IGxvY2FsSWQgPyBtYXBwZWQgOiBlKSkpO1xuICAgIH07XG4gICAgd2luZG93LmRyZWFtU2hvd1RvYXN0ID0gKG9wdHMpID0+IHtcbiAgICAgIC8vIFJlcGxhY2UgYW55IGV4aXN0aW5nIHRvYXN0ICgxIGF0IGEgdGltZSlcbiAgICAgIGNvbnN0IGlkID0gXCJ0LVwiICsgRGF0ZS5ub3coKTtcbiAgICAgIHNldFRvYXN0KHsgaWQsIC4uLm9wdHMgfSk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIC8vIFJlbG9hZCBlbnRyaWVzIGZyb20gQVBJXG4gIGNvbnN0IHJlZnJlc2hFbnRyaWVzID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBzZXRFbnRyaWVzTG9hZGluZyh0cnVlKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkubGlzdEthaXJvcyh7IGxpbWl0OiA1MCB9KTtcbiAgICAgIGNvbnN0IHJvd3MgPSAoZGF0YT8ua2Fpcm9zIHx8IFtdKS5tYXAoayA9PiAoe1xuICAgICAgICBpZDogay5pZCxcbiAgICAgICAgdHlwZTogay50eXBlLFxuICAgICAgICB3aGVuOiBrLndoZW4sXG4gICAgICAgIHRleHQ6IGsudGV4dCB8fCBrLnJhd190ZXh0IHx8IFwiXCIsXG4gICAgICAgIG51bWlub3VzOiBrLm51bWlub3VzLFxuICAgICAgICBiaWdEcmVhbTogay5iaWdEcmVhbSxcbiAgICAgICAgLy8ga2VlcCByYXcgYmFja2VuZCBmaWVsZHMgYXZhaWxhYmxlXG4gICAgICAgIF9yYXc6IGssXG4gICAgICB9KSk7XG4gICAgICAvLyBJZiBBUEkgcmV0dXJuZWQgbm90aGluZywgZmFsbCBiYWNrIHRvIHNlZWQgZm9yIHZpc3VhbCBjb250aW51aXR5XG4gICAgICAvLyAoc2VlZCBrZXB0IGFzIGJvb3RzdHJhcCBVWCB3aGlsZSB1c2VyIGhhcyAwIGthaXJvcylcbiAgICAgIC8vIDIwMjYtMDQtMjcgUDEuNCA6IHByZXNlcnZlIHBlbmRpbmcgbG9jYWwga2Fpcm9zIHBlbmRhbnQgcmVmcmVzaFxuICAgICAgLy8gKHNpbm9uIG9wdGltaXN0aWMgZGlzYXBwZWFycyBhdSByZWZyZXNoIGFzeW5jaHJvbmUgcG9zdC1jcmVhdGUpLlxuICAgICAgaWYgKHJvd3MubGVuZ3RoID09PSAwICYmIGRhdGE/Ll9zZWVkKSB7XG4gICAgICAgIHNldEVudHJpZXMocHJldiA9PiB7XG4gICAgICAgICAgY29uc3QgcGVuZGluZyA9IHByZXYuZmlsdGVyKGUgPT4gZS5fcGVuZGluZyk7XG4gICAgICAgICAgcmV0dXJuIHBlbmRpbmcubGVuZ3RoID8gWy4uLnBlbmRpbmcsIC4uLih3aW5kb3cuc2VlZEVudHJpZXMgfHwgW10pXSA6ICh3aW5kb3cuc2VlZEVudHJpZXMgfHwgW10pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgc2V0RW50cmllcyhwcmV2ID0+IHByZXYuZmlsdGVyKGUgPT4gZS5fcGVuZGluZykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0RW50cmllcyhwcmV2ID0+IHtcbiAgICAgICAgICBjb25zdCBwZW5kaW5nID0gcHJldi5maWx0ZXIoZSA9PiBlLl9wZW5kaW5nKTtcbiAgICAgICAgICAvLyBTaSB1biByZWFsIGthaXJvcyBhIHVuIGlkIG1hdGNoYW50IHVuIHBlbmRpbmcgXHUyMTkyIGRyb3AgcGVuZGluZ1xuICAgICAgICAgIGNvbnN0IHBlbmRpbmdGaWx0ZXJlZCA9IHBlbmRpbmcuZmlsdGVyKHAgPT4gIXJvd3MuZmluZChyID0+IHIuaWQgPT09IHAuaWQpKTtcbiAgICAgICAgICByZXR1cm4gWy4uLnBlbmRpbmdGaWx0ZXJlZCwgLi4ucm93c107XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltBcHBdIHJlZnJlc2hFbnRyaWVzIGZhaWxlZDpcIiwgZS5tZXNzYWdlKTtcbiAgICAgIHNldEVudHJpZXMod2luZG93LnNlZWRFbnRyaWVzIHx8IFtdKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgc2V0RW50cmllc0xvYWRpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICB1RSgoKSA9PiB7XG4gICAgcmVmcmVzaEVudHJpZXMoKTtcbiAgICAvLyBBdXRvLXJlZnJlc2ggb24gYXV0aCBjaGFuZ2UgKGlmIGF2YWlsYWJsZSlcbiAgICBpZiAod2luZG93LkRyZWFtQXV0aCAmJiAhd2luZG93LkRyZWFtQXV0aC5ub0F1dGgpIHtcbiAgICAgIGNvbnN0IHVuc3ViID0gd2luZG93LkRyZWFtQXV0aC5vbkF1dGhDaGFuZ2UoKCkgPT4geyByZWZyZXNoRW50cmllcygpOyB9KTtcbiAgICAgIHJldHVybiB1bnN1YjtcbiAgICB9XG4gIH0sIFtdKTtcblxuICAvLyBFeHBvc2UgZm9yIGNoaWxkIHNjcmVlbnMgdGhhdCB3YW50IHRvIHRyaWdnZXIgcmVmcmVzaCBhZnRlciBjcmVhdGUvZGVsZXRlXG4gIHVFKCgpID0+IHtcbiAgICB3aW5kb3cuRHJlYW1SZWZyZXNoRW50cmllcyA9IHJlZnJlc2hFbnRyaWVzO1xuICAgIHdpbmRvdy5EcmVhbUVudHJpZXNMb2FkaW5nID0gZW50cmllc0xvYWRpbmc7XG4gIH0pO1xuXG4gIGNvbnN0IGdvID0gKHMsIGMpID0+IHtcbiAgICBzZXRTY3JlZW4ocyk7XG4gICAgc2V0Q3R4KGMgfHwgbnVsbCk7XG4gICAgdHJ5IHsgbG9jYXRpb24uaGFzaCA9IHM7IH0gY2F0Y2gge31cbiAgICB3aW5kb3cuc2Nyb2xsVG8oeyB0b3A6IDAgfSk7XG4gICAgdHJ5IHsgd2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSh7IHR5cGU6IFwiX19lZGl0X21vZGVfc2V0X2tleXNcIiwgZWRpdHM6IHsgc2NyZWVuOiBzIH0gfSwgXCIqXCIpOyB9IGNhdGNoIHt9XG4gIH07XG5cbiAgLy8gMjAyNi0wNC0yNyBcdTIwMTQgU3ByaW50IFAwIFx1MDBBN0QgOiBndWFyZCBUd2Vha3MgZW4gcHJvZC5cbiAgLy8gTGlzdGVuZXIgcG9zdE1lc3NhZ2UgX19hY3RpdmF0ZV9lZGl0X21vZGUgVU5JUVVFTUVOVCBzaSA6XG4gIC8vICAgLSBsb2NhbFN0b3JhZ2VbXCJkcmVhbTp0d2Vha3MtZW5hYmxlZFwiXSA9PT0gXCJ0cnVlXCIgIChhY3RpdmUgdmlhIGNvbnNvbGUgcG91ciBkZXYpXG4gIC8vICAgLSBPVSBVUkwgP3R3ZWFrcz0xICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGFjdGl2ZSBtYW51ZWxsZW1lbnQgcG91ciBkZWJ1ZylcbiAgLy8gU2lub24gbGUgcGFubmVhdSBuZSBwZXV0IGphbWFpcyBzJ291dnJpciAocG9sbHV0aW9uIHByb2QgXHUwMEU5dml0XHUwMEU5ZSkuXG4gIHVFKCgpID0+IHtcbiAgICBsZXQgdHdlYWtzQWxsb3dlZCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICB0d2Vha3NBbGxvd2VkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkcmVhbTp0d2Vha3MtZW5hYmxlZFwiKSA9PT0gXCJ0cnVlXCI7XG4gICAgICBpZiAoIXR3ZWFrc0FsbG93ZWQpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICBpZiAocGFyYW1zLmdldChcInR3ZWFrc1wiKSA9PT0gXCIxXCIpIHtcbiAgICAgICAgICB0d2Vha3NBbGxvd2VkID0gdHJ1ZTtcbiAgICAgICAgICAvLyBQZXJzaXN0IHBvdXIgbGEgc2Vzc2lvbiAoc2FucyBmb3JjZXIgcGVybWFuZW50IFx1MjAxNCBvcHQtaW4gdmlhIFVSTClcbiAgICAgICAgICAvLyBTaSBvbiB2ZXV0IHBlcm1hIDogZFx1MDBFOWNvbW1lbnRlciBsYSBsaWduZSBjaS1kZXNzb3VzXG4gICAgICAgICAgLy8gbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTp0d2Vha3MtZW5hYmxlZFwiLCBcInRydWVcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIHt9XG5cbiAgICBpZiAoIXR3ZWFrc0FsbG93ZWQpIHtcbiAgICAgIC8vIFBhcyBkZSBsaXN0ZW5lciBpbnN0YWxsXHUwMEU5IGVuIHByb2QgXHUyMTkyIHBhbmVsIGphbWFpcyBhZmZpY2hcdTAwRTkuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlciA9IChlKSA9PiB7XG4gICAgICBpZiAoZS5kYXRhPy50eXBlID09PSBcIl9fYWN0aXZhdGVfZWRpdF9tb2RlXCIpIHNldFR3ZWFrcyh0cnVlKTtcbiAgICAgIGlmIChlLmRhdGE/LnR5cGUgPT09IFwiX19kZWFjdGl2YXRlX2VkaXRfbW9kZVwiKSBzZXRUd2Vha3MoZmFsc2UpO1xuICAgIH07XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIGhhbmRsZXIpO1xuICAgIHRyeSB7IHdpbmRvdy5wYXJlbnQucG9zdE1lc3NhZ2UoeyB0eXBlOiBcIl9fZWRpdF9tb2RlX2F2YWlsYWJsZVwiIH0sIFwiKlwiKTsgfSBjYXRjaCB7fVxuICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgaGFuZGxlcik7XG4gIH0sIFtdKTtcblxuICAvLyAyMDI2LTA0LTI2IFx1MjAxNCBOaWdodG1hcmUgYXV0by1kZXRlY3QgOiBzaWxlbnQgY2hlY2sgb24gbW91bnQgKyBvbmNlIHBlciBzZXNzaW9uLlxuICAvLyBTaSB2YWxlbmNlIDwgLTAuNiBzdXIgMysga2Fpcm9zIHN1ciAxNGogXHUyMTkyIHByb3Bvc2UgbW9kYWwgZG91Y2UuXG4gIGNvbnN0IFtuaWdodG1hcmVQcm9wb3NhbCwgc2V0TmlnaHRtYXJlUHJvcG9zYWxdID0gdVMobnVsbCk7XG4gIHVFKCgpID0+IHtcbiAgICBsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG4gICAgKGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFNraXAgaWYgdXNlciBhbHJlYWR5IG9uIG5pZ2h0bWFyZXMgcm91dGUgb3IgaGFzIGRpc21pc3NlZCByZWNlbnRseVxuICAgICAgICBjb25zdCBkaXNtaXNzZWRBdCA9IHBhcnNlSW50KGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZHJlYW06bmlnaHRtYXJlLXByb3Bvc2FsOmRpc21pc3NlZC1hdFwiKSB8fCBcIjBcIiwgMTApO1xuICAgICAgICBpZiAoRGF0ZS5ub3coKSAtIGRpc21pc3NlZEF0IDwgNyAqIDI0ICogMzYwMCAqIDEwMDApIHJldHVybjtcbiAgICAgICAgaWYgKCF3aW5kb3cuRHJlYW1BUEk/LmF1dG9EZXRlY3RQcm90ZWN0aW9uKSByZXR1cm47XG4gICAgICAgIGNvbnN0IHIgPSBhd2FpdCB3aW5kb3cuRHJlYW1BUEkuYXV0b0RldGVjdFByb3RlY3Rpb24oKTtcbiAgICAgICAgaWYgKGNhbmNlbGxlZCkgcmV0dXJuO1xuICAgICAgICBpZiAocj8ucHJvcG9zZSkge1xuICAgICAgICAgIHNldE5pZ2h0bWFyZVByb3Bvc2FsKHsgY291bnQ6IHIucmVjZW50X2xvd192YWxlbmNlX2NvdW50IHx8IDMgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2gge31cbiAgICB9KSgpO1xuICAgIHJldHVybiAoKSA9PiB7IGNhbmNlbGxlZCA9IHRydWU7IH07XG4gIH0sIFtdKTtcblxuICBjb25zdCBbdHdlYWtzLCBzZXRUd2Vha3NdID0gdVMoZmFsc2UpO1xuICBjb25zdCBUV0VBS19ERUZBVUxUUyA9IC8qRURJVE1PREUtQkVHSU4qL3tcbiAgICBcInNjcmVlblwiOiBcImhvbWVcIlxuICB9LypFRElUTU9ERS1FTkQqLztcblxuICB1RSgoKSA9PiB7XG4gICAgaWYgKFRXRUFLX0RFRkFVTFRTLnNjcmVlbiAmJiBUV0VBS19ERUZBVUxUUy5zY3JlZW4gIT09IHNjcmVlbikge1xuICAgICAgc2V0U2NyZWVuKFRXRUFLX0RFRkFVTFRTLnNjcmVlbik7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgLy8gUGljayBjdXJyZW50IGVudHJ5OiB3aGVuIGN0eCBwcm92aWRlZCwgZmluZCBpdDsgZWxzZSB1c2UgZmlyc3QgYXZhaWxhYmxlLlxuICAvLyBFbnN1cmVzIEthaXJvc0RldGFpbCByZWNlaXZlcyBhIHJlYWwgZW50cnkgZXZlbiBiZWZvcmUgYXN5bmMgbG9hZCBjb21wbGV0ZXMuXG4gIGNvbnN0IGVudHJ5ID0gY3R4ID8gKGVudHJpZXMuZmluZChlID0+IGUuaWQgPT09IGN0eCkgfHwgKHdpbmRvdy5zZWVkRW50cmllcyB8fCBbXSlbMF0pXG4gICAgICAgICAgICAgICAgICAgIDogKGVudHJpZXNbMF0gfHwgKHdpbmRvdy5zZWVkRW50cmllcyB8fCBbXSlbMF0pO1xuXG4gIGxldCB2aWV3O1xuICBzd2l0Y2ggKHNjcmVlbikge1xuICAgIC8vIGNvcmUgZmxvd1xuICAgIGNhc2UgXCJjYXB0dXJlXCI6ICAgICAgICB2aWV3ID0gPHdpbmRvdy5DYXB0dXJlIGdvPXtnb30gLz47IGJyZWFrO1xuICAgIGNhc2UgXCJqb3VybmFsXCI6ICAgICAgICB2aWV3ID0gPHdpbmRvdy5Kb3VybmFsIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+OyBicmVhaztcbiAgICBjYXNlIFwia2Fpcm9zXCI6ICAgICAgICAgdmlldyA9IDx3aW5kb3cuS2Fpcm9zRGV0YWlsIGdvPXtnb30gZW50cnk9e2VudHJ5IHx8IGVudHJpZXNbMF19IGFsbEVudHJpZXM9e2VudHJpZXN9IC8+OyBicmVhaztcblxuICAgIC8vIDIwMjYtMDQtMjUgXHUyMDE0IFBvcnRyYWl0IHJlZm9udGUgTEVUVFJFIG5hcnJhdGl2ZSAoRGVzaWduIFx1MDBBNzcuNilcbiAgICBjYXNlIFwicG9ydHJhaXRcIjogICAgICAgdmlldyA9IHdpbmRvdy5Qb3J0cmFpdE5hcnJhdGl2ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LlBvcnRyYWl0TmFycmF0aXZlIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Qb3J0cmFpdCBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwicG9ydHJhaXQtY2FydGVcIjogdmlldyA9IDx3aW5kb3cuUG9ydHJhaXQgZ289e2dvfSAvPjsgYnJlYWs7ICAvLyBzb3VzLXBhZ2UgY29uc3RlbGxhdGlvblxuICAgIC8vIDIwMjYtMDQtMjYgXHUyMDE0IEFuaW1hIE11bmRpIDEgXHUwMEU5Y3JhbiBzY3JvbGxhYmxlIChEZXNpZ24gXHUwMEE3MTEuYmlzLjUpXG4gICAgLy8gVG91cyBsZXMgc3ViLXJvdXRlcyBsZWdhY3kgcmVkaXJpZ2VudCB2ZXJzIEFuaW1hVW5pZmllZFNjcmVlbiBhdmVjXG4gICAgLy8gc2Nyb2xsVG9TZWN0aW9uIChsYSBwYWdlIHNjcm9sbCBzbW9vdGggdmVycyBsYSBzZWN0aW9uIGF1IG1vdW50KS5cbiAgICBjYXNlIFwiYW5pbWFcIjogICAgICAgICAgICB2aWV3ID0gd2luZG93LkFuaW1hVW5pZmllZFNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQW5pbWFVbmlmaWVkU2NyZWVuIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aW5kb3cuQW5pbWFWb3V0ZVNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5BbmltYVZvdXRlU2NyZWVuIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuQW5pbWFWb3V0ZSBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwiYW5pbWEtbWV0ZW9cIjogICAgICB2aWV3ID0gd2luZG93LkFuaW1hVW5pZmllZFNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQW5pbWFVbmlmaWVkU2NyZWVuIGdvPXtnb30gc2Nyb2xsVG9TZWN0aW9uPVwibWV0ZW9cIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHdpbmRvdy5BbmltYU1ldGVvU2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LkFuaW1hTWV0ZW9TY3JlZW4gZ289e2dvfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5NZXRlbyBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwiYW5pbWEtYW5uYWxlc1wiOiAgICB2aWV3ID0gd2luZG93LkFuaW1hVW5pZmllZFNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQW5pbWFVbmlmaWVkU2NyZWVuIGdvPXtnb30gc2Nyb2xsVG9TZWN0aW9uPVwiYW5uYWxlc1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2luZG93LkFuaW1hQW5uYWxlc1NjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5BbmltYUFubmFsZXNTY3JlZW4gZ289e2dvfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Bbm5hbGVzU2NyZWVuIGdvPXtnb30gLz47IGJyZWFrO1xuICAgIGNhc2UgXCJhbmltYS1wb2x5cGhvbmllXCI6IHZpZXcgPSB3aW5kb3cuQW5pbWFVbmlmaWVkU2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5BbmltYVVuaWZpZWRTY3JlZW4gZ289e2dvfSBzY3JvbGxUb1NlY3Rpb249XCJwb2x5cGhvbmllXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aW5kb3cuQW5pbWFQb2x5cGhvbmllU2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LkFuaW1hUG9seXBob25pZVNjcmVlbiBnbz17Z299IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8d2luZG93LlBvbHlwaG9uaWUgZ289e2dvfSAvPjsgYnJlYWs7XG4gICAgLy8gQ29tcGF0IGxlZ2FjeSA6IHJlZGlyaWdlIGF1c3NpIHZlcnMgbCdcdTAwRTljcmFuIHVuaWZpXHUwMEU5XG4gICAgY2FzZSBcIm1ldGVvXCI6ICAgICAgICAgICAgdmlldyA9IHdpbmRvdy5BbmltYVVuaWZpZWRTY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LkFuaW1hVW5pZmllZFNjcmVlbiBnbz17Z299IHNjcm9sbFRvU2VjdGlvbj1cIm1ldGVvXCIgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aW5kb3cuQW5pbWFNZXRlb1NjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5BbmltYU1ldGVvU2NyZWVuIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuTWV0ZW8gZ289e2dvfSAvPjsgYnJlYWs7XG4gICAgY2FzZSBcInBvbHlwaG9uaWVcIjogICAgICAgdmlldyA9IHdpbmRvdy5BbmltYVVuaWZpZWRTY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LkFuaW1hVW5pZmllZFNjcmVlbiBnbz17Z299IHNjcm9sbFRvU2VjdGlvbj1cInBvbHlwaG9uaWVcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHdpbmRvdy5BbmltYVBvbHlwaG9uaWVTY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQW5pbWFQb2x5cGhvbmllU2NyZWVuIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuUG9seXBob25pZSBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwiYW5uYWxlc1wiOiAgICAgICAgICB2aWV3ID0gd2luZG93LkFuaW1hVW5pZmllZFNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQW5pbWFVbmlmaWVkU2NyZWVuIGdvPXtnb30gc2Nyb2xsVG9TZWN0aW9uPVwiYW5uYWxlc1wiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2luZG93LkFuaW1hQW5uYWxlc1NjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5BbmltYUFubmFsZXNTY3JlZW4gZ289e2dvfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Bbm5hbGVzU2NyZWVuIGdvPXtnb30gLz47IGJyZWFrO1xuICAgIGNhc2UgXCJjaGF0XCI6ICAgICAgICAgICAgIHZpZXcgPSA8d2luZG93LkNoYXQgZ289e2dvfSBjb250ZXh0SWQ9e2N0eH0gLz47IGJyZWFrO1xuXG4gICAgLy8gMjAyNi0wNC0yOCBcdTIwMTQgUGl2b3QgQ2hhdCBJQSBEcmVhbSBwZXJzb25uZWwgKFNwcmludCBBLCBEZXNpZ24gXHUwMEE3MTEuYmlzLjIwKVxuICAgIGNhc2UgXCJkcmVhbS1jaGF0XCI6ICAgICAgIHZpZXcgPSA8d2luZG93LkRyZWFtQ2hhdEhvbWUgZ289e2dvfSAvPjsgYnJlYWs7XG5cbiAgICAvLyBjZXJjbGUgKHJlZm9udGUgMjAyNi0wNC0yNSBcdTIwMTQgQmlibGUgXHUwMEE3My40LjEgKyBEZXNpZ24gXHUwMEE3Ny43KVxuICAgIGNhc2UgXCJjZXJjbGVcIjogICAgICAgICAgIHZpZXcgPSA8d2luZG93LkNlcmNsZVNjcmVlbiBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwiY2VyY2xlLWRldGFpbFwiOiAgICB2aWV3ID0gd2luZG93LkNlcmNsZVN1YkFwcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQ2VyY2xlU3ViQXBwIGdvPXtnb30gY2lyY2xlSWQ9e2N0eH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8d2luZG93LkNlcmNsZURldGFpbCBnbz17Z299IGNpcmNsZUlkPXtjdHh9IC8+OyBicmVhaztcbiAgICBjYXNlIFwiY3JlZXItY2VyY2xlXCI6ICAgICB2aWV3ID0gPHdpbmRvdy5DcmVlckNlcmNsZVNjcmVlbiBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwicmVqb2luZHJlXCI6ICAgICAgICB2aWV3ID0gPHdpbmRvdy5SZWpvaW5kcmVTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG4gICAgY2FzZSBcInBhcnRhZ2VyLXJldmVcIjogICAgdmlldyA9IDx3aW5kb3cuUGFydGFnZXJSZXZlU2NyZWVuIGdvPXtnb30gLz47IGJyZWFrO1xuXG4gICAgLy8gMjAyNi0wNC0yNyBcdTIwMTQgU3ByaW50IFAwLjIgOiBFeHBsb3JlciBodWIgKHJlbXBsYWNlIGRyYXdlciBjYWNoXHUwMEU5KVxuICAgIC8vIFNwZWMgOiAyX0RFU0lHTiBcdTAwQTcxMS5iaXMuMTcuIEV4cGxvcmVyU2NyZWVuID0gbGlzdGUgc29icmUgZGVzIHNvdXMtYXBwc1xuICAgIC8vIG9yZ2FuaXNcdTAwRTllIGVuIDMgc2VjdGlvbnMgKExlIHRpZW4gXHUwMEI3IExlcyBhdXRyZXMgXHUwMEI3IFByb2ZvbmRldXJzKS5cbiAgICBjYXNlIFwiZXhwbG9yZXJcIjogICAgICAgICB2aWV3ID0gd2luZG93LkV4cGxvcmVyU2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5FeHBsb3JlclNjcmVlbiBnbz17Z299IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+OyBicmVhaztcbiAgICBjYXNlIFwiY29tbWVudFwiOiAgICAgICAgICB2aWV3ID0gd2luZG93LkNvbW1lbnRTY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LkNvbW1lbnRTY3JlZW4gZ289e2dvfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuSG9tZSBnbz17Z299IGVudHJpZXM9e2VudHJpZXN9IGxvYWRpbmc9e2VudHJpZXNMb2FkaW5nfSAvPjsgYnJlYWs7XG4gICAgLy8gMjAyNi0wNC0yNyBcdTIwMTQgU3ByaW50IFAwLjQgOiBHbG9zc2FpcmUgKERlc2lnbiBcdTAwQTcxMS5iaXMuMTgpXG4gICAgY2FzZSBcImdsb3NzYWlyZVwiOiAgICAgICAgdmlldyA9IHdpbmRvdy5HbG9zc2FpcmVTY3JlZW5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93Lkdsb3NzYWlyZVNjcmVlbiBnbz17Z299IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+OyBicmVhaztcbiAgICAvLyAyMDI2LTA0LTI5IFx1MjAxNCBNb24gZGljdGlvbm5haXJlIChtb2F0IFx1MDBFOXBpc3RcdTAwRTltaXF1ZSwgNF9MT0cubWQgMjAyNi0wNC0yOSlcbiAgICBjYXNlIFwicGVyc29uYWwtZGljdGlvbmFyeVwiOiB2aWV3ID0gd2luZG93LlBlcnNvbmFsRGljdGlvbmFyeVNjcmVlblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuUGVyc29uYWxEaWN0aW9uYXJ5U2NyZWVuIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8d2luZG93LkhvbWUgZ289e2dvfSBlbnRyaWVzPXtlbnRyaWVzfSBsb2FkaW5nPXtlbnRyaWVzTG9hZGluZ30gLz47IGJyZWFrO1xuXG4gICAgLy8gYW5pbWEgbXVuZGkgKGxlZ2FjeSAvIHV0aWxpdGFpcmUpXG4gICAgY2FzZSBcIm9mZnJlLWthaXJvc1wiOiAgICAgdmlldyA9IDx3aW5kb3cuT2ZmcmVLYWlyb3NTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG5cbiAgICAvLyBzb21hXG4gICAgY2FzZSBcIm9yYWNsZS1jb3Jwc1wiOiAgIHZpZXcgPSA8d2luZG93Lk9yYWNsZUNvcnBzU2NyZWVuIGdvPXtnb30gLz47IGJyZWFrO1xuICAgIGNhc2UgXCJjb250ZS1taXJvaXJcIjogICB2aWV3ID0gPHdpbmRvdy5Db250ZU1pcm9pclNjcmVlbiBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwicmVlbnRyeVwiOiAgICAgICAgdmlldyA9IDx3aW5kb3cuUmVlbnRyeVNjcmVlbiBnbz17Z299IC8+OyBicmVhaztcblxuICAgIC8vIDIwMjYtMDQtMjYgbnVpdCBwcm9mb25kZSBcdTIwMTQgUXVpY2sgdnMgUHJvdG9jb2xlIEFjY29tcGFnblx1MDBFOSAoQmlibGUgXHUwMEE3My4xMSlcbiAgICBjYXNlIFwiY2FwdHVyZS1jaG9pY2VcIjogdmlldyA9IHdpbmRvdy5DYXB0dXJlQ2hvaWNlU2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuQ2FwdHVyZUNob2ljZVNjcmVlbiBnbz17Z299IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuQ2FwdHVyZSBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwicHJvdG9jb2xlLXNlbGVjdG9yXCI6IHZpZXcgPSB3aW5kb3cuUHJvdG9jb2xlU2VsZWN0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5Qcm90b2NvbGVTZWxlY3RvciBnbz17Z299IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuQ2FwdHVyZSBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwicHJvdG9jb2xlLXN1Yi1mbG93XCI6IHZpZXcgPSB3aW5kb3cuUHJvdG9jb2xlU3ViRmxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LlByb3RvY29sZVN1YkZsb3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbz17Z299XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvdG9jb2xJZD17Y3R4Py5wcm90b2NvbElkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGthaXJvc0lkPXtjdHg/LmthaXJvc0lkfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudHJ5SWQ9e2N0eD8uZW50cnlJZH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5DYXB0dXJlIGdvPXtnb30gLz47IGJyZWFrO1xuICAgIGNhc2UgXCJwcm90b2NvbGUtcHJlLXNvbW1laWxcIjogdmlldyA9IHdpbmRvdy5Qcm90b2NvbGVTdWJGbG93XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuUHJvdG9jb2xlU3ViRmxvd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvPXtnb31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm90b2NvbElkPVwicHJlX3NvbW1laWxcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiA8d2luZG93LkNhcHR1cmUgZ289e2dvfSAvPjsgYnJlYWs7XG5cbiAgICAvLyBtZXRhXG4gICAgY2FzZSBcIm9uYm9hcmRpbmdcIjogICAgIHZpZXcgPSA8d2luZG93Lk9uYm9hcmRpbmdTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG4gICAgY2FzZSBcInByaXZhY3lcIjogICAgICAgIHZpZXcgPSA8d2luZG93LlByaXZhY3lTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG4gICAgY2FzZSBcIm5vdGlmc1wiOiAgICAgICAgIHZpZXcgPSA8d2luZG93Lk5vdGlmc1NjcmVlbiBnbz17Z299IC8+OyBicmVhaztcbiAgICBjYXNlIFwiYWJvbm5lbWVudFwiOiAgICAgdmlldyA9IDx3aW5kb3cuQWJvbm5lbWVudFNjcmVlbiBnbz17Z299IC8+OyBicmVhaztcblxuICAgIC8vIGZpZ3VyZVxuICAgIGNhc2UgXCJmaWd1cmVcIjogICAgICAgICB2aWV3ID0gPHdpbmRvdy5GaWd1cmVEZXRhaWxTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG5cbiAgICAvLyB2MS4yIGFtcGxpZmljYXRpb25cbiAgICBjYXNlIFwiYmlnZHJlYW0tc2lnbmFsXCI6IHZpZXcgPSA8d2luZG93LkJpZ0RyZWFtU2lnbmFsU2NyZWVuIGdvPXtnb30gLz47IGJyZWFrO1xuXG4gICAgLy8gMjAyNi0wNC0yNiBcdTIwMTQgU2FuY3R1YWlyZSBOaWdodG1hcmVzIChCaWJsZSBcdTAwQTcxNy4zKSBNT0RFIElOVFx1MDBDOUdSXHUwMEM5ICsgXHUwMEU5Y3JhbiBkXHUwMEU5ZGlcdTAwRTlcbiAgICBjYXNlIFwibmlnaHRtYXJlc1wiOiAgICAgIHZpZXcgPSA8d2luZG93Lk5pZ2h0bWFyZXNTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG5cbiAgICAvLyAyMDI2LTA0LTI5IFx1MjAxNCBCaWcgRHJlYW0gV29ya2Zsb3cgNyBqb3VycyAoRmVhdHVyZSAzLCA0X0xPRy5tZClcbiAgICAvLyBjdHggcGV1dCBcdTAwRUF0cmUgdW4gd29ya2Zsb3dfaWQgKHN0cmluZykgT1UgeyB3b3JrZmxvd19pZCwga2Fpcm9zX2lkIH1cbiAgICBjYXNlIFwiYmlnZHJlYW0td29ya2Zsb3dcIjogdmlldyA9IHdpbmRvdy5CaWdEcmVhbVdvcmtmbG93U2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5CaWdEcmVhbVdvcmtmbG93U2NyZWVuIGdvPXtnb30gY3R4PXtjdHh9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+OyBicmVhaztcblxuICAgIC8vIDIwMjYtMDQtMjkgXHUyMDE0IFJlY3VycmluZyBSZS1lbnRyeSAoRmVhdHVyZSA0KSBcdTIwMTQgZmVybWV0dXJlIGJvdWNsZSBvdXZlcnRlIFVJXG4gICAgLy8gY3R4IHBldXQgXHUwMEVBdHJlIHVuIHBhdHRlcm5faWQgc3RyaW5nIE9VIHsgcGF0dGVybl9pZCB9LiBTYW5zIGN0eCBcdTIxOTIgbGlzdGUgcGF0dGVybnMuXG4gICAgY2FzZSBcInJlY3VycmluZ1wiOlxuICAgIGNhc2UgXCJyZWN1cnJpbmctcmUtZW50cnlcIjogdmlldyA9IHdpbmRvdy5SZWN1cnJpbmdSZUVudHJ5U2NyZWVuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5SZWN1cnJpbmdSZUVudHJ5U2NyZWVuIGdvPXtnb30gY3R4PXtjdHh9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+OyBicmVhaztcblxuICAgIC8vIDIwMjYtMDQtMjYgXHUyMDE0IFNvdXMtYXBwIEx1Y2lkIERyZWFtaW5nIChCaWJsZSBcdTAwQTcxNykgb3B0LWluIHN0cmljdFxuICAgIC8vIFNpIHVzZXIgbidhIHBhcyBhY3Rpdlx1MDBFOSBsdWNpZCBtb2RlIFx1MjE5MiByZWRpcmVjdCB2ZXJzIHByb2ZpbGUgKG9uYm9hcmRpbmcpXG4gICAgY2FzZSBcImx1Y2lkLXByb2ZpbGVcIjogICB2aWV3ID0gPHdpbmRvdy5MdWNpZFByb2ZpbGVTY3JlZW4gZ289e2dvfSAvPjsgYnJlYWs7XG4gICAgY2FzZSBcImx1Y2lkLWRhc2hib2FyZFwiOlxuICAgIGNhc2UgXCJsdWNpZC1yZWFsaXR5LWNoZWNrc1wiOlxuICAgIGNhc2UgXCJsdWNpZC1kcmVhbS1zaWduc1wiOlxuICAgIGNhc2UgXCJsdWNpZC13YnRiXCI6IHtcbiAgICAgIGNvbnN0IGx1Y2lkRW5hYmxlZCA9ICgoKSA9PiB7XG4gICAgICAgIHRyeSB7IHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRyZWFtOmx1Y2lkOmVuYWJsZWRcIikgPT09IFwidHJ1ZVwiOyB9XG4gICAgICAgIGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICB9KSgpO1xuICAgICAgaWYgKCFsdWNpZEVuYWJsZWQpIHtcbiAgICAgICAgdmlldyA9IDx3aW5kb3cuTHVjaWRQcm9maWxlU2NyZWVuIGdvPXtnb30gLz47XG4gICAgICB9IGVsc2UgaWYgKHNjcmVlbiA9PT0gXCJsdWNpZC1kYXNoYm9hcmRcIikgICAgICAgdmlldyA9IDx3aW5kb3cuTHVjaWREYXNoYm9hcmRTY3JlZW4gZ289e2dvfSAvPjtcbiAgICAgIGVsc2UgaWYgKHNjcmVlbiA9PT0gXCJsdWNpZC1yZWFsaXR5LWNoZWNrc1wiKSAgICB2aWV3ID0gPHdpbmRvdy5MdWNpZFJlYWxpdHlDaGVja3NTY3JlZW4gZ289e2dvfSAvPjtcbiAgICAgIGVsc2UgaWYgKHNjcmVlbiA9PT0gXCJsdWNpZC1kcmVhbS1zaWduc1wiKSAgICAgICB2aWV3ID0gPHdpbmRvdy5MdWNpZERyZWFtU2lnbnNTY3JlZW4gZ289e2dvfSAvPjtcbiAgICAgIGVsc2UgaWYgKHNjcmVlbiA9PT0gXCJsdWNpZC13YnRiXCIpICAgICAgICAgICAgICB2aWV3ID0gPHdpbmRvdy5MdWNpZFdCVEJTY3JlZW4gZ289e2dvfSAvPjtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIC8vIDIwMjYtMDQtMjUgXHUyMDE0IFZ1ZSBjb250ZW1wbGF0aXZlIGFuY2llbm5lICgxIGthaXJvcyBlbiBncmFuZClcbiAgICBjYXNlIFwiaG9tZS1udWl0XCI6ICAgICAgdmlldyA9IDx3aW5kb3cuSG9tZSBnbz17Z299IGVudHJpZXM9e2VudHJpZXN9IGxvYWRpbmc9e2VudHJpZXNMb2FkaW5nfSAvPjsgYnJlYWs7XG4gICAgLy8gMjAyNi0wNC0yNSBcdTIwMTQgRHJpbGwtZG93biBzZWN0aW9uIDogY3R4ID0gb2JqZXQgc2VjdGlvbiBjb21wbGV0XG4gICAgY2FzZSBcImpvdXJuYWwtc2VjdGlvblwiOiB2aWV3ID0gd2luZG93LkpvdXJuYWxTZWN0aW9uRHJpbGxEb3duXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuSm91cm5hbFNlY3Rpb25EcmlsbERvd24gZ289e2dvfSBzZWN0aW9uPXtjdHh9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuSm91cm5hbERlVmllSm91ciBnbz17Z299IC8+OyBicmVhaztcbiAgICAvLyAyMDI2LTA0LTI2IChzb2lyKSBcdTIwMTQgUGl2b3QgcG9ydGUgZCdlbnRyXHUwMEU5ZSBSXHUwMENBVkUgKEJpYmxlIFx1MDBBNzEuNiArIERlc2lnbiBcdTAwQTcxMS5iaXMuMTIpXG4gICAgLy8gaG9tZSBcdTIxOTIgRHJlYW1Ib21lIChOT1VWRUFVIERFRkFVTFQpLiBob21lLWpvdXIgXHUyMTkyIEpvdXJuYWwgZGUgVmllIExVTUlORVVYIChzb3VzLXBhZ2UpXG4gICAgY2FzZSBcImhvbWVcIjogICAgICAgICAgIHZpZXcgPSB3aW5kb3cuRHJlYW1Ib21lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuRHJlYW1Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogd2luZG93LkpvdXJuYWxEZVZpZUpvdXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyA8d2luZG93LkpvdXJuYWxEZVZpZUpvdXIgZ289e2dvfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IDx3aW5kb3cuSG9tZSBnbz17Z299IGVudHJpZXM9e2VudHJpZXN9IGxvYWRpbmc9e2VudHJpZXNMb2FkaW5nfSAvPjsgYnJlYWs7XG4gICAgY2FzZSBcImhvbWUtam91clwiOlxuICAgIGNhc2UgXCJqb3VybmFsLWpvdXJcIjogICB2aWV3ID0gd2luZG93LkpvdXJuYWxEZVZpZUpvdXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5Kb3VybmFsRGVWaWVKb3VyIGdvPXtnb30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+OyBicmVhaztcblxuICAgIGRlZmF1bHQ6ICAgICAgICAgICAgICAgdmlldyA9IHdpbmRvdy5EcmVhbUhvbWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gPHdpbmRvdy5EcmVhbUhvbWUgZ289e2dvfSBlbnRyaWVzPXtlbnRyaWVzfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB3aW5kb3cuSm91cm5hbERlVmllSm91clxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IDx3aW5kb3cuSm91cm5hbERlVmllSm91ciBnbz17Z299IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogPHdpbmRvdy5Ib21lIGdvPXtnb30gZW50cmllcz17ZW50cmllc30gbG9hZGluZz17ZW50cmllc0xvYWRpbmd9IC8+O1xuICB9XG5cbiAgLy8gXHUyNTAwXHUyNTAwIE9uYm9hcmRpbmcgQitEIDogc2kgcGFzIG9uYm9hcmRcdTAwRTkgT1Ugc2NyZWVuID09PSBcIm9uYm9hcmRpbmctcml0dWVsXCJcbiAgLy8gXHUyMTkyIGFmZmljaGVyIGwnXHUwMEU5Y3JhbiByaXR1ZWwgQVZBTlQgdG91dCByZXN0ZSAoc2tpcCBcdTIxOTIgbWFycXVlICsgZ28gaG9tZSlcbiAgaWYgKHdpbmRvdy5PbmJvYXJkaW5nUml0dWVsICYmIChuZWVkc09uYm9hcmRpbmcgfHwgc2NyZWVuID09PSBcIm9uYm9hcmRpbmctcml0dWVsXCIpKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDx3aW5kb3cuT25ib2FyZGluZ1JpdHVlbCBnbz17KHMsIGMpID0+IHtcbiAgICAgICAgc2V0TmVlZHNPbmJvYXJkaW5nKGZhbHNlKTtcbiAgICAgICAgZ28ocyB8fCBcImhvbWVcIiwgYyk7XG4gICAgICB9fSAvPlxuICAgICk7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU3dpcGUgaG9yaXpvbnRhbCBEUkVBTSBcdTIxOTQgSk9VUiAoRGVzaWduIFx1MDBBNzExLmJpcy4xMiBcdTIwMTQgcmVmb250ZSBwb3J0ZSBSXHUwMENBVkUpXG4gIC8vIFRocmVzaG9sZCA4MHB4LiBUb3VjaHN0YXJ0IGVucmVnaXN0cmUsIHRvdWNoZW5kIGNhbGN1bGUgZGVsdGFYLlxuICAvLyBBY3RpZiB1bmlxdWVtZW50IHF1YW5kIHNjcmVlbiA9PT0gXCJob21lXCIgKERyZWFtSG9tZSkgb3UgXCJob21lLWpvdXJcIiAoSm91cm5hbCBkZSBWaWUgTFVNSU5FVVgpLlxuICAvLyBOb3RlIDogXCJob21lLW51aXRcIiByZXN0ZSBhY2Nlc3NpYmxlICh2dWUgY29udGVtcGxhdGl2ZSkgbWFpcyBIT1JTIGR1IHN3aXBlIHJvdGF0aW9uLlxuICBjb25zdCBpc1ZpZVNjcmVlbiA9IHNjcmVlbiA9PT0gXCJob21lXCIgfHwgc2NyZWVuID09PSBcImhvbWUtam91clwiIHx8IHNjcmVlbiA9PT0gXCJqb3VybmFsLWpvdXJcIjtcbiAgY29uc3Qgb25Ub3VjaFN0YXJ0ID0gKGUpID0+IHtcbiAgICBpZiAoIWlzVmllU2NyZWVuKSByZXR1cm47XG4gICAgY29uc3QgdCA9IGUudG91Y2hlcz8uWzBdO1xuICAgIGlmICghdCkgcmV0dXJuO1xuICAgIHN3aXBlU3RhcnRSZWYuY3VycmVudCA9IHsgeDogdC5jbGllbnRYLCB5OiB0LmNsaWVudFksIHQ6IERhdGUubm93KCkgfTtcbiAgfTtcbiAgY29uc3Qgb25Ub3VjaEVuZCA9IChlKSA9PiB7XG4gICAgaWYgKCFpc1ZpZVNjcmVlbikgcmV0dXJuO1xuICAgIGNvbnN0IHN0YXJ0ID0gc3dpcGVTdGFydFJlZi5jdXJyZW50O1xuICAgIGlmICghc3RhcnQpIHJldHVybjtcbiAgICBzd2lwZVN0YXJ0UmVmLmN1cnJlbnQgPSBudWxsO1xuICAgIGNvbnN0IHQgPSBlLmNoYW5nZWRUb3VjaGVzPy5bMF07XG4gICAgaWYgKCF0KSByZXR1cm47XG4gICAgY29uc3QgZHggPSB0LmNsaWVudFggLSBzdGFydC54O1xuICAgIGNvbnN0IGR5ID0gdC5jbGllbnRZIC0gc3RhcnQueTtcbiAgICBjb25zdCBkdCA9IERhdGUubm93KCkgLSBzdGFydC50O1xuICAgIGlmIChNYXRoLmFicyhkeCkgPCA4MCkgcmV0dXJuO1xuICAgIGlmIChNYXRoLmFicyhkeSkgPiBNYXRoLmFicyhkeCkgKiAwLjgpIHJldHVybjsgLy8gbW9zdGx5IHZlcnRpY2FsIFx1MjE5MiBpZ25vcmVcbiAgICBpZiAoZHQgPiA4MDApIHJldHVybjsgLy8gdG9vIHNsb3cgXHUyMTkyIGlnbm9yZVxuICAgIGlmIChkeCA8IDAgJiYgc2NyZWVuID09PSBcImhvbWVcIikge1xuICAgICAgLy8gc3dpcGUgZ2F1Y2hlIGRlcHVpcyBEUkVBTSBcdTIxOTIgSk9VUiAoSm91cm5hbCBkZSBWaWUgTFVNSU5FVVgpXG4gICAgICBnbyhcImhvbWUtam91clwiKTtcbiAgICB9IGVsc2UgaWYgKGR4ID4gMCAmJiAoc2NyZWVuID09PSBcImhvbWUtam91clwiIHx8IHNjcmVlbiA9PT0gXCJqb3VybmFsLWpvdXJcIikpIHtcbiAgICAgIC8vIHN3aXBlIGRyb2l0ZSBkZXB1aXMgSk9VUiBcdTIxOTIgRFJFQU1cbiAgICAgIGdvKFwiaG9tZVwiKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gSW5kaWNhdGV1ciB2aXN1ZWwgRFJFQU0vSk9VUiAoMiBkb3RzIFx1MjYzRS9cdTI2MDkpIFx1MjAxNCBzZXVsZW1lbnQgc3VyIFZpZVxuICAvLyBcdTI2M0UgKGdhdWNoZSkgPSBEcmVhbUhvbWUgKGRlZmF1bHQpIC8gXHUyNjA5IChkcm9pdGUpID0gSm91cm5hbCBkZSBWaWUgTFVNSU5FVVhcbiAgY29uc3QgaXNKb3VyQWN0aXZlID0gc2NyZWVuID09PSBcImhvbWUtam91clwiIHx8IHNjcmVlbiA9PT0gXCJqb3VybmFsLWpvdXJcIjtcbiAgY29uc3QgZGF5TmlnaHRJbmRpY2F0b3IgPSBpc1ZpZVNjcmVlbiA/IChcbiAgICA8ZGl2IGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCB0b3A6IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMHB4KSArIDZweClcIixcbiAgICAgIGxlZnQ6IDAsIHJpZ2h0OiAwLFxuICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGp1c3RpZnlDb250ZW50OiBcImNlbnRlclwiLCBnYXA6IDEwLFxuICAgICAgekluZGV4OiA0MCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsXG4gICAgfX0+XG4gICAgICB7LyogXHUyNjNFIERyZWFtIChkZWZhdWx0KSAqL31cbiAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgIHdpZHRoOiA2LCBoZWlnaHQ6IDYsIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgYmFja2dyb3VuZDogIWlzSm91ckFjdGl2ZSA/IFwidmFyKC0tc2lsay1nb2xkLCAjQzlCMDk4KVwiIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgNDAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgb3BhY2l0eTogIWlzSm91ckFjdGl2ZSA/IDAuODUgOiAwLjQsXG4gICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGVhc2VcIixcbiAgICAgICAgYm94U2hhZG93OiAhaXNKb3VyQWN0aXZlID8gXCIwIDAgNnB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHRyYW5zcGFyZW50KVwiIDogXCJub25lXCIsXG4gICAgICB9fSAvPlxuICAgICAgey8qIFx1MjYwOSBKb3VybmFsIGRlIFZpZSAqL31cbiAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgIHdpZHRoOiA2LCBoZWlnaHQ6IDYsIGJvcmRlclJhZGl1czogXCI1MCVcIixcbiAgICAgICAgYmFja2dyb3VuZDogaXNKb3VyQWN0aXZlID8gXCJ2YXIoLS1kYXktY2xheS13YXJtLCAjQzlCMDk4KVwiIDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWFzaC1saWdodCkgNDAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgb3BhY2l0eTogaXNKb3VyQWN0aXZlID8gMC44NSA6IDAuNCxcbiAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMzgwbXMgZWFzZVwiLFxuICAgICAgICBib3hTaGFkb3c6IGlzSm91ckFjdGl2ZSA/IFwiMCAwIDZweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWRheS1jbGF5LXdhcm0pIDMwJSwgdHJhbnNwYXJlbnQpXCIgOiBcIm5vbmVcIixcbiAgICAgIH19IC8+XG4gICAgPC9kaXY+XG4gICkgOiBudWxsO1xuXG4gIC8vIFNwcmludCBQMSBcdTAwQTdEICgyMDI2LTA0LTI3KSBcdTIwMTQgQmFuZGVhdSBkXHUwMEU5bW8gbW9kZS5cbiAgLy8gQWZmaWNoXHUwMEU5IHN0aWNreS10b3AgcXVhbmQgd2luZG93LkRyZWFtQXV0aC5ub0F1dGggPT09IHRydWUgKG1vZGUgP2RlbW89MVxuICAvLyBvdSBTdXBhYmFzZSBub24gY2hhcmdcdTAwRTkpLiBJbmRpcXVlIHF1ZSBsZXMgZFx1MDBFOXBcdTAwRjR0cyBuZSBzb250IHBhcyBzYXV2ZWdhcmRcdTAwRTlzXG4gIC8vICsgYm91dG9uIFwic2UgY29ubmVjdGVyIFx1MjE5MlwiIHF1aSBmb3JjZSBsZSBwYXNzYWdlIHBhciBTaWduSW5TY3JlZW4uXG4gIC8vIExlIGJvdXRvbiByZWNoYXJnZSBzYW5zIGxlIHBhcmFtID9kZW1vPTEgOyBBdXRoR2F0ZSBwcmVuZCBsZSByZWxhaXMuXG4gIGNvbnN0IGlzRGVtb01vZGUgPSAhISh3aW5kb3cuRHJlYW1BdXRoPy5ub0F1dGgpO1xuICBjb25zdCBvbkRlbW9TaWduSW4gPSAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHUgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuICAgICAgdS5zZWFyY2hQYXJhbXMuZGVsZXRlKFwiZGVtb1wiKTtcbiAgICAgIC8vIE9uIGdhcmRlIGxlIGhhc2ggcG91ciByZXZlbmlyIFx1MDBFMCBsJ1x1MDBFOWNyYW4gY291cmFudCBhcHJcdTAwRThzIGxvZ2luXG4gICAgICBsb2NhdGlvbi5ocmVmID0gdS50b1N0cmluZygpO1xuICAgIH0gY2F0Y2gge1xuICAgICAgbG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfVxuICB9O1xuICBjb25zdCBkZW1vQmFubmVyID0gaXNEZW1vTW9kZSA/IChcbiAgICA8ZGl2IHJvbGU9XCJzdGF0dXNcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIiBzdHlsZT17e1xuICAgICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICAgIHRvcDogMCwgbGVmdDogMCwgcmlnaHQ6IDAsXG4gICAgICB6SW5kZXg6IDYwLCAvLyBhdS1kZXNzdXMgZGUgQm90dG9tTmF2ICg1MCkgOyBzb3VzIG1vZGFscyAoMjAwKylcbiAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtZGVlcCkgNDAlLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LWZsb29yKSA3MCUsIHRyYW5zcGFyZW50KSlcIixcbiAgICAgIGJvcmRlckJvdHRvbTogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDE0JSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgYmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig2cHgpXCIsXG4gICAgICBXZWJraXRCYWNrZHJvcEZpbHRlcjogXCJibHVyKDZweClcIixcbiAgICAgIHBhZGRpbmc6IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMHB4KSArIDZweCkgMTZweCA2cHhcIixcbiAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBqdXN0aWZ5Q29udGVudDogXCJjZW50ZXJcIiwgZ2FwOiAxMixcbiAgICAgIGZsZXhXcmFwOiBcIndyYXBcIixcbiAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEyLFxuICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgIGxpbmVIZWlnaHQ6IDEuNCxcbiAgICB9fT5cbiAgICAgIDxzcGFuIHN0eWxlPXt7IG9wYWNpdHk6IDAuOSB9fT5cbiAgICAgICAgbW9kZSBkXHUwMEU5bW8gXHUwMEI3IGxlcyBkXHUwMEU5cFx1MDBGNHRzIG5lIHNvbnQgcGFzIHNhdXZlZ2FyZFx1MDBFOXNcbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxidXR0b24gb25DbGljaz17b25EZW1vU2lnbklufVxuICAgICAgICBhcmlhLWxhYmVsPVwic2UgY29ubmVjdGVyIHBvdXIgc2F1dmVnYXJkZXJcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzNSUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBjb2xvcjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNzUlLCB2YXIoLS1ib25lKSlcIixcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMixcbiAgICAgICAgICBwYWRkaW5nOiBcIjNweCAxMHB4XCIsXG4gICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IHtcbiAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDglLCB0cmFuc3BhcmVudClcIjtcbiAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcInZhcigtLXNpbGstZ29sZClcIjtcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHtcbiAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwidHJhbnNwYXJlbnRcIjtcbiAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuY29sb3IgPSBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA3NSUsIHZhcigtLWJvbmUpKVwiO1xuICAgICAgICB9fT5cbiAgICAgICAgc2UgY29ubmVjdGVyIFx1MjE5MlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICkgOiBudWxsO1xuXG4gIC8vIFNpIGJhbmRlYXUgdmlzaWJsZSwgb24gcHVzaCBsZSBjb250ZW51IGRlIDMycHggKHZhcmlhYmxlIHNlbG9uIHNhZmUtYXJlYSkuXG4gIC8vIFdyYXBwZXIgdXRpbGlzZSB1biBwYWRkaW5nLXRvcCBjb25kaXRpb25uZWwuXG4gIGNvbnN0IGRlbW9CYW5uZXJPZmZzZXQgPSBpc0RlbW9Nb2RlID8gXCJjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtdG9wLCAwcHgpICsgMzJweClcIiA6IFwiMHB4XCI7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IG9uVG91Y2hTdGFydD17b25Ub3VjaFN0YXJ0fSBvblRvdWNoRW5kPXtvblRvdWNoRW5kfVxuICAgICAgc3R5bGU9e3sgbWluSGVpZ2h0OiBcIjEwMHZoXCIsIHBhZGRpbmdUb3A6IGRlbW9CYW5uZXJPZmZzZXQgfX0+XG4gICAgICB7ZGVtb0Jhbm5lcn1cbiAgICAgIHtkYXlOaWdodEluZGljYXRvcn1cbiAgICAgIHsvKiAyMDI2LTA0LTI3IFAwLjUgXHUyMDE0IFN5bmNTdGF0dXMgYmFkZ2UgdG9wLXJpZ2h0IGRpc2NyZXQgKi99XG4gICAgICB7d2luZG93LlN5bmNTdGF0dXMgJiYgPHdpbmRvdy5TeW5jU3RhdHVzIC8+fVxuICAgICAge3ZpZXd9XG4gICAgICB7LyogMjAyNi0wNC0yNyBQMS40IFx1MjAxNCBUb2FzdCBib3R0b20tY2VudGVyIGF1dG8tZGlzbWlzcyAqL31cbiAgICAgIHt0b2FzdCAmJiB3aW5kb3cuT3B0aW1pc3RpY1RvYXN0ICYmIChcbiAgICAgICAgPHdpbmRvdy5PcHRpbWlzdGljVG9hc3RcbiAgICAgICAgICBrZXk9e3RvYXN0LmlkfVxuICAgICAgICAgIHRleHQ9e3RvYXN0LnRleHR9XG4gICAgICAgICAgdG9uZT17dG9hc3QudG9uZX1cbiAgICAgICAgICBkdXJhdGlvbj17dG9hc3QuZHVyYXRpb24gfHwgMzAwMH1cbiAgICAgICAgICBvbkRpc21pc3M9eygpID0+IHNldFRvYXN0KG51bGwpfVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICAgIHsvKiBCb3R0b20gbmF2IFYxLjIgXHUyMDE0IHJlZm9udGUgMjAyNi0wNC0yNiA6IDMgb25nbGV0cyArIEZBQiAqL31cbiAgICAgIDxCb3R0b21OYXZWMTIgc2NyZWVuPXtzY3JlZW59IGdvPXtnb30gLz5cbiAgICAgIHt0d2Vha3MgJiYgPFR3ZWFrc1VJIHNjcmVlbj17c2NyZWVufSBnbz17Z299IC8+fVxuXG4gICAgICB7LyogMjAyNi0wNC0yNiBcdTIwMTQgTmlnaHRtYXJlIGF1dG8tcHJvcG9zYWwgbW9kYWwgKEJpYmxlIFx1MDBBNzE3LjMpICovfVxuICAgICAge25pZ2h0bWFyZVByb3Bvc2FsICYmIHdpbmRvdy5OaWdodG1hcmVBdXRvUHJvcG9zYWxNb2RhbCAmJiAoXG4gICAgICAgIDx3aW5kb3cuTmlnaHRtYXJlQXV0b1Byb3Bvc2FsTW9kYWxcbiAgICAgICAgICBjb3VudD17bmlnaHRtYXJlUHJvcG9zYWwuY291bnR9XG4gICAgICAgICAgb25DbG9zZT17KCkgPT4ge1xuICAgICAgICAgICAgdHJ5IHsgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJkcmVhbTpuaWdodG1hcmUtcHJvcG9zYWw6ZGlzbWlzc2VkLWF0XCIsIFN0cmluZyhEYXRlLm5vdygpKSk7IH0gY2F0Y2gge31cbiAgICAgICAgICAgIHNldE5pZ2h0bWFyZVByb3Bvc2FsKG51bGwpO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25BY3RpdmF0ZT17KCkgPT4ge1xuICAgICAgICAgICAgc2V0TmlnaHRtYXJlUHJvcG9zYWwobnVsbCk7XG4gICAgICAgICAgICBnbyhcIm5pZ2h0bWFyZXNcIik7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICl9XG5cbiAgICAgIHsvKiAyMDI2LTA0LTI5IFx1MjAxNCBPdmVybGF5cyBwbGVpbiBcdTAwRTljcmFuIChZZXNodWEpIDpcbiAgICAgICAgICBDb25zdGVsbGF0aW9uT3ZlcmxheSAoYXV0by10cmlnZ2VyIG5vdXZlbGxlIGZpZ3VyZSBwb3N0LWNyZWF0ZSlcbiAgICAgICAgICBFY2hvUHJvcGhldGljT3ZlcmxheSAoYXV0by10cmlnZ2VyIHZpYSB3aW5kb3cuZHJlYW1TaG93RWNob092ZXJsYXlcbiAgICAgICAgICBkZXB1aXMgS2Fpcm9zRGV0YWlsIHF1YW5kIGVjaG9fd2l0aF9lbnRyeV9pZCBkXHUwMEU5dGVjdFx1MDBFOSkuICovfVxuICAgICAge3dpbmRvdy5Db25zdGVsbGF0aW9uT3ZlcmxheVJvb3QgJiYgPHdpbmRvdy5Db25zdGVsbGF0aW9uT3ZlcmxheVJvb3QgLz59XG4gICAgICB7d2luZG93LkVjaG9Qcm9waGV0aWNPdmVybGF5Um9vdCAmJiA8d2luZG93LkVjaG9Qcm9waGV0aWNPdmVybGF5Um9vdCAvPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy8gXHUyNTAwXHUyNTAwIEJvdHRvbU5hdiBWMyAocmVmb250ZSAyMDI2LTA0LTI4IFx1MjAxNCBDZXJjbGUgMVx1MDBFOHJlIGNsYXNzZSkgXHUyNTAwXHUyNTAwXG4vLyA0IG9uZ2xldHMgdmlzaWJsZXMgKyBGQUIgT1JCRSBjZW50cmFsIHF1aSBvdXZyZSBBbmltYSBDaGF0IChnZXN0ZSBwcmVtaWVyKS5cbi8vIFNwZWMgOiBEZXNpZ24gXHUwMEE3MTEuYmlzLjIwLnggKyBicmllZiBUMiBtaXNzaW9uIHRyaXBsZVxuLy8gICBbIFx1MjYzRSBWaWUgfCBcdTI3MzcgUG9ydHJhaXQgfCBcdUQ4M0NcdURGMDAgT1JCRSBjZW50cmFsIHwgXHUyQjU1IENlcmNsZSB8IFx1MjVEMCBNb25kZSBdXG4vL1xuLy8gQ0hBTkdFTUVOVC1DTFx1MDBDOSAyMDI2LTA0LTI4IDpcbi8vIC0gQ2VyY2xlIFBST01VIDFcdTAwRThyZSBjbGFzc2UgKFx1MDBFOXRhaXQgY2FjaFx1MDBFOSBkZXJyaVx1MDBFOHJlIEV4cGxvcmVyKS5cbi8vIC0gRXhwbG9yZXIgcmVzdGUgYWNjZXNzaWJsZSB2aWEgbG9uZy1wcmVzcyBkdSBGQUIgT1JCRSBjZW50cmFsXG4vLyAgIChldCBjYXJ0ZSBFeHBsb3JlciBkYW5zIExlIE1vbmRlICsgc2VjdGlvbiBWaWUgcG91ciBkXHUwMEU5Y291dnJhYmlsaXRcdTAwRTkpLlxuLy8gLSBMZSBGQUIgT1JCRSBjb3VydC10YXAgPSBBbmltYSBjaGF0IChcImRyZWFtLWNoYXRcIiBcdTIwMTQgbGEgcHJcdTAwRTlzZW5jZSBwZXJzb25uZWxsZSxcbi8vICAgZ2VzdGUgcHJlbWllciBwb3N0LVNwcmludCBBKS4gTG9uZy1wcmVzcyA9IEV4cGxvcmVyLlxuLy8gLSBDYXB0dXJlIHJlc3RlIGFjY2Vzc2libGUgdmlhIC9ob21lIChEcmVhbUhvbWUpIGJvdXRvbiBwcmltYWlyZSArIHZpYVxuLy8gICBBbmltYSBxdWkgcGV1dCByb3V0ZXIgXCJvdXZyaXIgY2FwdHVyZVwiLlxuLy9cbi8vIEFkYXB0aXZlIEpPVVIvTlVJVCBwclx1MDBFOXNlcnZcdTAwRTkuIEhpZGUtb24tc2NyZWVuIGxvZ2ljIHByXHUwMEU5c2Vydlx1MDBFOWUuXG5mdW5jdGlvbiBCb3R0b21OYXZWMTIoeyBzY3JlZW4sIGdvIH0pIHtcbiAgLy8gSGlkZSBvbiBjb250ZW1wbGF0aXZlL21vZGFsIHNjcmVlbnNcbiAgY29uc3QgSElERV9OQVZfT04gPSBbXG4gICAgXCJjYXB0dXJlXCIsIFwib25ib2FyZGluZ1wiLCBcInJlZW50cnlcIiwgXCJrYWlyb3NcIiwgXCJvbmJvYXJkaW5nLXJpdHVlbFwiLFxuICAgIC8vIDIwMjYtMDQtMjYgXHUyMDE0IHByb3RvY29sZXMgZmxvdyAoQmlibGUgXHUwMEE3My4xMSlcbiAgICBcImNhcHR1cmUtY2hvaWNlXCIsIFwicHJvdG9jb2xlLXNlbGVjdG9yXCIsIFwicHJvdG9jb2xlLXN1Yi1mbG93XCIsIFwicHJvdG9jb2xlLXByZS1zb21tZWlsXCIsXG4gIF07XG4gIGlmIChISURFX05BVl9PTi5pbmNsdWRlcyhzY3JlZW4pKSByZXR1cm4gbnVsbDtcblxuICAvLyBEXHUwMEU5dGVjdGlvbiBtb2RlIEpPVVIgKHBhbGV0dGUgKyBnbHlwaGUgVmllKVxuICBjb25zdCBpc0RheU1vZGUgPSBzY3JlZW4gPT09IFwiaG9tZS1qb3VyXCIgfHwgc2NyZWVuID09PSBcImpvdXJuYWwtam91clwiIHx8IHNjcmVlbiA9PT0gXCJqb3VybmFsLXNlY3Rpb25cIjtcbiAgY29uc3QgaXNWaWVBY3RpdmUgPSBbXCJob21lXCIsIFwiaG9tZS1qb3VyXCIsIFwiaG9tZS1udWl0XCIsIFwiam91cm5hbC1qb3VyXCIsIFwiam91cm5hbC1zZWN0aW9uXCIsIFwiam91cm5hbFwiLCBcImthaXJvc1wiXS5pbmNsdWRlcyhzY3JlZW4pO1xuICBjb25zdCBpc1BvcnRyYWl0QWN0aXZlID0gW1wicG9ydHJhaXRcIiwgXCJwb3J0cmFpdC1jYXJ0ZVwiLCBcImZpZ3VyZVwiXS5pbmNsdWRlcyhzY3JlZW4pO1xuICAvLyBDZXJjbGUgb25nbGV0IDogYWN0aWYgc3VyIHRvdXMgbGVzIFx1MDBFOWNyYW5zIGNlcmNsZS5cbiAgY29uc3QgaXNDZXJjbGVBY3RpdmUgPSBbXG4gICAgXCJjZXJjbGVcIiwgXCJjZXJjbGUtZGV0YWlsXCIsIFwiY3JlZXItY2VyY2xlXCIsIFwicmVqb2luZHJlXCIsIFwicGFydGFnZXItcmV2ZVwiLFxuICBdLmluY2x1ZGVzKHNjcmVlbik7XG4gIC8vIEFuaW1hL01vbmRlIG9uZ2xldCA6IFwibGUgbW9uZGVcIiA9IEFuaW1hIE11bmRpIChjb25zdGVsbGF0aW9uIGNvbGxlY3RpdmUpLlxuICBjb25zdCBpc0FuaW1hQWN0aXZlID0gW1wiYW5pbWFcIiwgXCJhbmltYS1tZXRlb1wiLCBcImFuaW1hLWFubmFsZXNcIiwgXCJhbmltYS1wb2x5cGhvbmllXCIsIFwibWV0ZW9cIiwgXCJwb2x5cGhvbmllXCIsIFwiYW5uYWxlc1wiXS5pbmNsdWRlcyhzY3JlZW4pO1xuICAvLyBPcmJlIGNlbnRyYWwgYWN0aWYgcXVhbmQgb24gZXN0IGVuIGNoYXQtYW5pbWEgKGdlc3RlIHByZW1pZXIpLlxuICBjb25zdCBpc09yYkFjdGl2ZSA9IFtcImRyZWFtLWNoYXRcIl0uaW5jbHVkZXMoc2NyZWVuKTtcbiAgLy8gRXhwbG9yZXIgcmVzdGUgYWNjZXNzaWJsZSAobG9uZy1wcmVzcyBvcmJlIE9VIGNhcmQgZGFucyBMZSBNb25kZSkgXHUyMDE0IHBhc1xuICAvLyBkJ29uZ2xldCBkXHUwMEU5ZGlcdTAwRTksIG1haXMgb24gc3VpdCBxdSdvbiB5IGVzdCBwb3VyIGd1aWRhbmNlIHZpc3VlbGxlLlxuICBjb25zdCBpc0V4cGxvcmVyU3ViQWN0aXZlID0gW1xuICAgIFwiZXhwbG9yZXJcIiwgXCJjb21tZW50XCIsIFwiZ2xvc3NhaXJlXCIsXG4gICAgXCJvcmFjbGUtY29ycHNcIiwgXCJjb250ZS1taXJvaXJcIiwgXCJuaWdodG1hcmVzXCIsXG4gICAgXCJsdWNpZC1wcm9maWxlXCIsIFwibHVjaWQtZGFzaGJvYXJkXCIsIFwibHVjaWQtcmVhbGl0eS1jaGVja3NcIiwgXCJsdWNpZC1kcmVhbS1zaWduc1wiLCBcImx1Y2lkLXdidGJcIixcbiAgICBcInByaXZhY3lcIiwgXCJub3RpZnNcIiwgXCJhYm9ubmVtZW50XCIsXG4gIF0uaW5jbHVkZXMoc2NyZWVuKTtcblxuICBjb25zdCB2aWVHbHlwaCA9IGlzRGF5TW9kZSA/IFwiXHUyNjA5XCIgOiBcIlx1MjYzRVwiO1xuXG4gIC8vIEhlbHBlcnMgY291bGV1ciAoZmFjdG9yIFx1MjAxNCBwYWxldHRlIGFkYXB0YXRpdmUgSk9VUi9OVUlUKVxuICBjb25zdCBhY3RpdmVDb2xvciA9IGlzRGF5TW9kZSA/IFwidmFyKC0tZGF5LWNsYXktd2FybSwgI0M5QjA5OClcIiA6IFwidmFyKC0tc2lsay1nb2xkKVwiO1xuICBjb25zdCBpZGxlQ29sb3IgICA9IGlzRGF5TW9kZSA/IFwidmFyKC0tZGF5LWFzaC1zb2Z0LCAjNzc2RTYyKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCI7XG5cbiAgLy8gUmVuZGVyZXIgb25nbGV0IFx1MjAxNCByXHUwMEU5dXRpbGlzXHUwMEU5IHBvdXIgbGVzIDQgb25nbGV0cyAoRFJZKVxuICBjb25zdCByZW5kZXJUYWIgPSAoaXQpID0+IChcbiAgICA8YnV0dG9uIGtleT17aXQuaWR9IG9uQ2xpY2s9e2l0Lm9uVGFwfVxuICAgICAgYXJpYS1sYWJlbD17aXQubGFiZWx9XG4gICAgICBzdHlsZT17e1xuICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsIGJvcmRlcjogXCJub25lXCIsIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDIsXG4gICAgICAgIHBhZGRpbmc6IFwiNnB4IDRweFwiLFxuICAgICAgICBjb2xvcjogaXQuYWN0aXZlID8gYWN0aXZlQ29sb3IgOiBpZGxlQ29sb3IsXG4gICAgICAgIG9wYWNpdHk6IGl0LmFjdGl2ZSA/IDEgOiAwLjY1LFxuICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSlcIixcbiAgICAgIH19PlxuICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFNpemU6IDE4LCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+e2l0LmdseXBofTwvc3Bhbj5cbiAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiIH19PntpdC5sYWJlbH08L3NwYW4+XG4gICAgPC9idXR0b24+XG4gICk7XG5cbiAgLy8gNCBvbmdsZXRzIFx1MjAxNCBsJ29yZHJlIHZpc3VlbCA6IFsgVmllIF0gWyBQb3J0cmFpdCBdIChPUkJFKSBbIENlcmNsZSBdIFsgTGUgTW9uZGUgXVxuICBjb25zdCBsZWZ0SXRlbXMgPSBbXG4gICAgeyBpZDogXCJob21lXCIsICAgICBsYWJlbDogXCJ2aWVcIiwgICAgICBnbHlwaDogdmllR2x5cGgsIGFjdGl2ZTogaXNWaWVBY3RpdmUsXG4gICAgICBvblRhcDogKCkgPT4gZ28oaXNEYXlNb2RlID8gXCJob21lLWpvdXJcIiA6IFwiaG9tZVwiKSB9LFxuICAgIHsgaWQ6IFwicG9ydHJhaXRcIiwgbGFiZWw6IFwicG9ydHJhaXRcIiwgZ2x5cGg6IFwiXHUyNzM3XCIsICAgICAgYWN0aXZlOiBpc1BvcnRyYWl0QWN0aXZlLFxuICAgICAgb25UYXA6ICgpID0+IGdvKFwicG9ydHJhaXRcIikgfSxcbiAgXTtcbiAgY29uc3QgcmlnaHRJdGVtcyA9IFtcbiAgICB7IGlkOiBcImNlcmNsZVwiLCAgIGxhYmVsOiBcImNlcmNsZVwiLCAgIGdseXBoOiBcIlx1MjVDQlwiLCAgICAgIGFjdGl2ZTogaXNDZXJjbGVBY3RpdmUsXG4gICAgICBvblRhcDogKCkgPT4gZ28oXCJjZXJjbGVcIikgfSxcbiAgICB7IGlkOiBcImFuaW1hXCIsICAgIGxhYmVsOiBcImxlIG1vbmRlXCIsIGdseXBoOiBcIlx1MjVEMFwiLCAgICAgIGFjdGl2ZTogaXNBbmltYUFjdGl2ZSxcbiAgICAgIG9uVGFwOiAoKSA9PiBnbyhcImFuaW1hXCIpIH0sXG4gIF07XG5cbiAgLy8gTG9uZy1wcmVzcyBoYW5kbGVyIHBvdXIgbCdPUkJFIFx1MjE5MiBFeHBsb3JlclxuICAvLyAodG91Y2ggJiBtb3VzZSkuIDYwMG1zIHRocmVzaG9sZC4gQ291cnQtdGFwID0gZHJlYW0tY2hhdC5cbiAgY29uc3QgbG9uZ1ByZXNzVGltZXJSZWYgPSB1UihudWxsKTtcbiAgY29uc3QgbG9uZ1ByZXNzRmlyZWRSZWYgPSB1UihmYWxzZSk7XG4gIGNvbnN0IE9SQl9MT05HUFJFU1NfTVMgPSA2MDA7XG4gIGNvbnN0IG9uT3JiRG93biA9IChlKSA9PiB7XG4gICAgbG9uZ1ByZXNzRmlyZWRSZWYuY3VycmVudCA9IGZhbHNlO1xuICAgIGxvbmdQcmVzc1RpbWVyUmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGxvbmdQcmVzc0ZpcmVkUmVmLmN1cnJlbnQgPSB0cnVlO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHdpbmRvdy5uYXZpZ2F0b3I/LnZpYnJhdGUpIHdpbmRvdy5uYXZpZ2F0b3IudmlicmF0ZSgxNSk7XG4gICAgICB9IGNhdGNoIHt9XG4gICAgICBnbyhcImV4cGxvcmVyXCIpO1xuICAgIH0sIE9SQl9MT05HUFJFU1NfTVMpO1xuICB9O1xuICBjb25zdCBvbk9yYlVwID0gKCkgPT4ge1xuICAgIGlmIChsb25nUHJlc3NUaW1lclJlZi5jdXJyZW50KSB7XG4gICAgICBjbGVhclRpbWVvdXQobG9uZ1ByZXNzVGltZXJSZWYuY3VycmVudCk7XG4gICAgICBsb25nUHJlc3NUaW1lclJlZi5jdXJyZW50ID0gbnVsbDtcbiAgICB9XG4gIH07XG4gIGNvbnN0IG9uT3JiTGVhdmUgPSAoKSA9PiB7XG4gICAgaWYgKGxvbmdQcmVzc1RpbWVyUmVmLmN1cnJlbnQpIHtcbiAgICAgIGNsZWFyVGltZW91dChsb25nUHJlc3NUaW1lclJlZi5jdXJyZW50KTtcbiAgICAgIGxvbmdQcmVzc1RpbWVyUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgIH1cbiAgfTtcbiAgY29uc3Qgb25PcmJDbGljayA9IChlKSA9PiB7XG4gICAgaWYgKGxvbmdQcmVzc0ZpcmVkUmVmLmN1cnJlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBsb25nUHJlc3NGaXJlZFJlZi5jdXJyZW50ID0gZmFsc2U7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGdvKFwiZHJlYW0tY2hhdFwiKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxuYXYgc3R5bGU9e3tcbiAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsXG4gICAgICBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwLFxuICAgICAgekluZGV4OiA1MCxcbiAgICAgIGJhY2tncm91bmQ6IGlzRGF5TW9kZVxuICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1kYXktcGFwZXIsICNFQkUyRDIpIDkyJSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtZmxvb3IpIDkyJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICBib3JkZXJUb3A6IGlzRGF5TW9kZVxuICAgICAgICA/IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZGF5LWNsYXktd2FybSwgI0M5QjA5OCkgMjUlLCB0cmFuc3BhcmVudClcIlxuICAgICAgICA6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgIGJhY2tkcm9wRmlsdGVyOiBcImJsdXIoOHB4KVwiLFxuICAgICAgV2Via2l0QmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig4cHgpXCIsXG4gICAgICBwYWRkaW5nOiBcIjEwcHggOHB4IGNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20sIDBweCkgKyAxMHB4KVwiLFxuICAgICAgZGlzcGxheTogXCJncmlkXCIsXG4gICAgICAvLyA1IHNsb3RzIDogVmllIHwgUG9ydHJhaXQgfCAoT1JCRSkgfCBDZXJjbGUgfCBMZSBNb25kZVxuICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIxZnIgMWZyIDY0cHggMWZyIDFmclwiLFxuICAgICAgYWxpZ25JdGVtczogXCJjZW50ZXJcIixcbiAgICAgIGp1c3RpZnlJdGVtczogXCJjZW50ZXJcIixcbiAgICAgIGdhcDogMixcbiAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICB0cmFuc2l0aW9uOiBcImJhY2tncm91bmQgOTIwbXMgZWFzZSwgYm9yZGVyLWNvbG9yIDkyMG1zIGVhc2VcIixcbiAgICB9fT5cbiAgICAgIHsvKiBPbmdsZXRzIGdhdWNoZSA6IFZpZSwgUG9ydHJhaXQgKi99XG4gICAgICB7bGVmdEl0ZW1zLm1hcChyZW5kZXJUYWIpfVxuXG4gICAgICB7LyogT1JCRSBjZW50cmFsIFx1MjAxNCBnZXN0ZSBwcmVtaWVyIChTcHJpbnQgQSBwaXZvdCkgOlxuICAgICAgICAgIGNvdXJ0LXRhcCBcdTIxOTIgQW5pbWEgY2hhdCAoZHJlYW0tY2hhdCkgXHUyMDE0IGxhIHByXHUwMEU5c2VuY2Ugb25pcmlxdWUgbm9tbWFibGUuXG4gICAgICAgICAgbG9uZy1wcmVzcyA2MDBtcyBcdTIxOTIgRXhwbG9yZXIgaHViIChsdWNpZCwgb3JhY2xlLCBjb250ZXMsIG5pZ2h0bWFyZXMsXG4gICAgICAgICAgc2V0dGluZ3MpLiBWaWJyYXRlIDE1bXMgZmVlZGJhY2sgaGFwdGlxdWUgc3VyIGxvbmctcHJlc3MgZmlyZS4gKi99XG4gICAgICA8YnV0dG9uXG4gICAgICAgIG9uQ2xpY2s9e29uT3JiQ2xpY2t9XG4gICAgICAgIG9uTW91c2VEb3duPXtvbk9yYkRvd259IG9uTW91c2VVcD17b25PcmJVcH0gb25Nb3VzZUxlYXZlPXtvbk9yYkxlYXZlfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e29uT3JiRG93bn0gb25Ub3VjaEVuZD17b25PcmJVcH0gb25Ub3VjaENhbmNlbD17b25PcmJMZWF2ZX1cbiAgICAgICAgYXJpYS1sYWJlbD1cInBhcmxlciBhdmVjIGFuaW1hIFx1MDBCNyBsb25nLXByZXNzIHBvdXIgZXhwbG9yZXJcIlxuICAgICAgICB0aXRsZT1cInBhcmxlciBhdmVjIGFuaW1hIFx1MDBCNyBsb25nLXByZXNzIHBvdXIgZXhwbG9yZXJcIlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiA1NiwgaGVpZ2h0OiA1NiwgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IGlzT3JiQWN0aXZlXG4gICAgICAgICAgICA/IFwicmFkaWFsLWdyYWRpZW50KGNpcmNsZSBhdCAzMCUgMzAlLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzglLCB2YXIoLS1uaWdodC13YXJtKSksIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tZW1iZXIpIDIyJSwgdmFyKC0tbmlnaHQtZmxvb3IpKSlcIlxuICAgICAgICAgICAgOiBcInJhZGlhbC1ncmFkaWVudChjaXJjbGUgYXQgMzAlIDMwJSwgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1lbWJlcikgMjglLCB2YXIoLS1uaWdodC13YXJtKSksIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHZhcigtLW5pZ2h0LWZsb29yKSkpXCIsXG4gICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzAlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIiwgZGlzcGxheTogXCJncmlkXCIsIHBsYWNlSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgZm9udFNpemU6IDIyLFxuICAgICAgICAgIGJveFNoYWRvdzogaXNPcmJBY3RpdmVcbiAgICAgICAgICAgID8gXCIwIDAgMzJweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzIlLCB0cmFuc3BhcmVudCksIGluc2V0IDAgMXB4IDAgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMwJSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgICAgIDogXCIwIDAgMjRweCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB0cmFuc3BhcmVudCksIGluc2V0IDAgMXB4IDAgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgdHJhbnNpdGlvbjogXCJhbGwgMzgwbXMgY3ViaWMtYmV6aWVyKDAuNDUsMCwwLjU1LDEpXCIsXG4gICAgICAgICAgbWFyZ2luVG9wOiAtMTYsXG4gICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIHVzZXJTZWxlY3Q6IFwibm9uZVwiLFxuICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IFwibm9uZVwiLFxuICAgICAgICAgIFdlYmtpdFRvdWNoQ2FsbG91dDogXCJub25lXCIsXG4gICAgICAgIH19PlxuICAgICAgICBcdTI2M0VcbiAgICAgIDwvYnV0dG9uPlxuXG4gICAgICB7LyogT25nbGV0cyBkcm9pdGUgOiBDZXJjbGUsIExlIE1vbmRlICovfVxuICAgICAge3JpZ2h0SXRlbXMubWFwKHJlbmRlclRhYil9XG4gICAgPC9uYXY+XG4gICk7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBUb3AtbGV2ZWwgQXBwID0gQXV0aEdhdGUoQXBwU2hlbGwpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gMjAyNi0wNC0yOSAoWWVzaHVhLCBGSVggUDAgYW5pbWF0aW9ucykgXHUyMDE0IEhhbG9SZXNwaXJlIHNpbGsgbW9udFx1MDBFOSBlblxuLy8gYmFja2dyb3VuZCBmaXhlZCBnbG9iYWwsIGRlcnJpXHUwMEU4cmUgVE9VVCAoekluZGV4IDAsIHBvaW50ZXItZXZlbnRzIG5vbmUpLlxuLy8gVmlzaWJsZSBzdXIgdG91cyBsZXMgc2NyZWVucyBcdTIwMTQgVGltIGRvaXQgc2VudGlyIGxhIHJlc3BpcmF0aW9uIGNvbnN0YW50ZVxuLy8gZGUgbCdhcHAsIHBhcyB1biBub2lyIG1vcnQuIE9wYWNpdHkgMC40ID0gbGlzaWJsZSBtYWlzIHBhcyBlbnZhaGlzc2FudC5cbi8vIFJlc3BlY3RlIHByZWZlcnMtcmVkdWNlZC1tb3Rpb24gKENTUyBnYXRlIGRhbnMgc3R5bGVzLmNzcykuXG5mdW5jdGlvbiBBcHAoKSB7XG4gIGNvbnN0IEdhdGUgPSB3aW5kb3cuQXV0aEdhdGUgfHwgKCh7IGNoaWxkcmVuIH0pID0+IGNoaWxkcmVuKTtcbiAgY29uc3QgSGFsbyA9IHdpbmRvdy5IYWxvUmVzcGlyZTtcbiAgcmV0dXJuIChcbiAgICA8R2F0ZT5cbiAgICAgIHtIYWxvICYmIChcbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiBcImZpeGVkXCIsIGluc2V0OiBcIi0xMCVcIixcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIiwgekluZGV4OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPEhhbG8ga2luZD1cInNpbGtcIiAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8QXBwU2hlbGwgLz5cbiAgICA8L0dhdGU+XG4gICk7XG59XG5cbmNvbnN0IHNjcmVlbkdyb3VwcyA9IFtcbiAgeyBsYWJlbDogXCJtYXRpXHUwMEU4cmVcIiwgaXRlbXM6IFtcbiAgICBbXCJob21lXCIsIFwiaG9tZSBcdTIwMTQgam91cm5hbCBzdWJzdHJhdFwiXSxcbiAgICBbXCJjYXB0dXJlXCIsIFwiY2FwdHVyZSBcdTIwMTQgc29tYXRpYyBnYXRlXCJdLFxuICAgIFtcImpvdXJuYWxcIiwgXCJqb3VybmFsIGRlIHZpZVwiXSxcbiAgICBbXCJrYWlyb3NcIiwgXCJkXHUwMEU5dGFpbCBrYWlyb3NcIl0sXG4gIF19LFxuICB7IGxhYmVsOiBcInBvcnRyYWl0XCIsIGl0ZW1zOiBbXG4gICAgW1wicG9ydHJhaXRcIiwgXCJwb3J0cmFpdCBcdTIwMTQgY29uc3RlbGxhdGlvblwiXSxcbiAgICBbXCJmaWd1cmVcIiwgXCJkXHUwMEU5dGFpbCBmaWd1cmVcIl0sXG4gIF19LFxuICB7IGxhYmVsOiBcImNlcmNsZVwiLCBpdGVtczogW1xuICAgIFtcImNlcmNsZVwiLCBcImNlcmNsZSBcdTIwMTQgbGlzdGVcIl0sXG4gICAgW1wiY2VyY2xlLWRldGFpbFwiLCBcImNlcmNsZSBcdTIwMTQgZFx1MDBFOXRhaWxcIl0sXG4gICAgW1wiY3JlZXItY2VyY2xlXCIsIFwiY3JcdTAwRTllciB1biBjZXJjbGVcIl0sXG4gICAgW1wicmVqb2luZHJlXCIsIFwicmVqb2luZHJlIGNlcmNsZVwiXSxcbiAgICBbXCJwYXJ0YWdlci1yZXZlXCIsIFwicGFydGFnZXIgdW4gclx1MDBFQXZlIChsZWdhY3kpXCJdLFxuICBdfSxcbiAgeyBsYWJlbDogXCJhbmltYSBtdW5kaSAoNCBjaGFtYnJlcylcIiwgaXRlbXM6IFtcbiAgICBbXCJhbmltYVwiLCBcIjEgXHUwMEI3IGxhIHZvXHUwMEZCdGUgKGh1YilcIl0sXG4gICAgW1wiYW5pbWEtbWV0ZW9cIiwgXCIyIFx1MDBCNyBsZSB0ZW1wcyBxdSdpbCBmYWl0IGRhbnMgbGEgbnVpdFwiXSxcbiAgICBbXCJhbmltYS1hbm5hbGVzXCIsIFwiMyBcdTAwQjcgdGVudSBlbnNlbWJsZVwiXSxcbiAgICBbXCJhbmltYS1wb2x5cGhvbmllXCIsIFwiNCBcdTAwQjcgcG9seXBob25pZSBkZSBsYSBsdW5lXCJdLFxuICAgIFtcIm9mZnJlLWthaXJvc1wiLCBcIm9mZnJlIGF1IGthaXJvcyAobGVnYWN5KVwiXSxcbiAgXX0sXG4gIHsgbGFiZWw6IFwic29tYVwiLCBpdGVtczogW1xuICAgIFtcIm9yYWNsZS1jb3Jwc1wiLCBcIm9yYWNsZSBkdSBjb3Jwc1wiXSxcbiAgICBbXCJjb250ZS1taXJvaXJcIiwgXCJjb250ZS1taXJvaXJcIl0sXG4gICAgW1wicmVlbnRyeVwiLCBcInJcdTAwRTllbnRyXHUwMEU5ZSBvbmlyaXF1ZVwiXSxcbiAgICBbXCJuaWdodG1hcmVzXCIsIFwic2FuY3R1YWlyZSBjYXVjaGVtYXJzICYgZGV1aWxcIl0sXG4gIF19LFxuICB7IGxhYmVsOiBcInByb3RvY29sZXMgXHUwMEI3IHF1aWNrIHZzIGFjY29tcGFnblx1MDBFOVwiLCBpdGVtczogW1xuICAgIFtcImNhcHR1cmUtY2hvaWNlXCIsIFwiXHUwMEU5Y3JhbiBkZSBjaG9peCBcdTI2QTEvXHVEODNDXHVERjAwXCJdLFxuICAgIFtcInByb3RvY29sZS1zZWxlY3RvclwiLCBcInNcdTAwRTlsZWN0aW9uIGRlcyA5IHByb3RvY29sZXNcIl0sXG4gICAgW1wicHJvdG9jb2xlLXByZS1zb21tZWlsXCIsIFwiXHVEODNDXHVERjE5IHByXHUwMEU5LXNvbW1laWwgKHJhY2NvdXJjaSlcIl0sXG4gIF19LFxuICB7IGxhYmVsOiBcIm5hcnJhdHJpY2VcIiwgaXRlbXM6IFtcbiAgICBbXCJjaGF0XCIsIFwiY2hhdCBuYXJyYXRyaWNlXCJdLFxuICBdfSxcbiAgeyBsYWJlbDogXCJ2MS4yIGFtcGxpZmlcdTAwRTlcIiwgaXRlbXM6IFtcbiAgICBbXCJiaWdkcmVhbS1zaWduYWxcIiwgXCJiaWcgZHJlYW0gc2lnbmFsXCJdLFxuICBdfSxcbiAgeyBsYWJlbDogXCJlbnRyXHUwMEU5ZSAmIHJcdTAwRTlnbGFnZXNcIiwgaXRlbXM6IFtcbiAgICBbXCJvbmJvYXJkaW5nXCIsIFwib25ib2FyZGluZyBwLXpcdTAwRTlyb1wiXSxcbiAgICBbXCJwcml2YWN5XCIsIFwicGFyYW1cdTAwRTh0cmVzIFx1MDBCNyBwcml2YWN5XCJdLFxuICAgIFtcIm5vdGlmc1wiLCBcInBhcmFtXHUwMEU4dHJlcyBcdTAwQjcgbm90aWZzXCJdLFxuICAgIFtcImFib25uZW1lbnRcIiwgXCJwYXJhbVx1MDBFOHRyZXMgXHUwMEI3IGFib25uZW1lbnRcIl0sXG4gIF19LFxuXTtcblxuZnVuY3Rpb24gVHdlYWtzVUkoeyBzY3JlZW4sIGdvIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwb3NpdGlvbjogXCJmaXhlZFwiLCBib3R0b206IDI0LCByaWdodDogMjQsIHpJbmRleDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCwgbWF4SGVpZ2h0OiBcImNhbGMoMTAwdmggLSA0OHB4KVwiLCBvdmVyZmxvd1k6IFwiYXV0b1wiLFxuICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC13YXJtKVwiLFxuICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtbWlkKVwiLCBwYWRkaW5nOiBcInZhcigtLXMtNClcIixcbiAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2FucylcIiwgZm9udFNpemU6IDEzLCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbWItbVwiIHN0eWxlPXt7IGp1c3RpZnlDb250ZW50OiBcInNwYWNlLWJldHdlZW5cIiB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNiB9fT5Ud2Vha3M8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICB3aW5kb3cucGFyZW50LnBvc3RNZXNzYWdlKHsgdHlwZTogXCJfX2VkaXRfbW9kZV9kaXNtaXNzZWRcIiB9LCBcIipcIik7XG4gICAgICAgIH19Plx1MDBENzwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbWItc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cdTAwRTljcmFuPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrXCIgc3R5bGU9e3sgZ2FwOiAyIH19PlxuICAgICAgICB7c2NyZWVuR3JvdXBzLm1hcChnID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17Zy5sYWJlbH0gc3R5bGU9e3sgbWFyZ2luVG9wOiAxMCB9fT5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMWVtXCIsIG1hcmdpbkJvdHRvbTogNCB9fT5cbiAgICAgICAgICAgICAge2cubGFiZWwudG9VcHBlckNhc2UoKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAge2cuaXRlbXMubWFwKChbaywgbF0pID0+IChcbiAgICAgICAgICAgICAgPGJ1dHRvbiBrZXk9e2t9XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gZ28oayl9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIiwgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImxlZnRcIiwgcGFkZGluZzogXCI1cHggMTBweFwiLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogc2NyZWVuID09PSBrID8gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWJvbmUpIDYlLCB0cmFuc3BhcmVudClcIiA6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgXCIgKyAoc2NyZWVuID09PSBrID8gXCJ2YXIoLS1ib25lKVwiIDogXCJ2YXIoLS1hc2gtZGVlcClcIiksXG4gICAgICAgICAgICAgICAgICBjb2xvcjogc2NyZWVuID09PSBrID8gXCJ2YXIoLS1ib25lKVwiIDogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIuNSwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHtsfVxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICkpfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogQXV0aCBzdGF0dXMgZm9vdGVyICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC1sXCIgc3R5bGU9e3tcbiAgICAgICAgbWFyZ2luVG9wOiAxNiwgcGFkZGluZ1RvcDogMTIsXG4gICAgICAgIGJvcmRlclRvcDogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgIGZvbnRTaXplOiAxMSwgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLFxuICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICB9fT5cbiAgICAgICAge3dpbmRvdy5EcmVhbVVzZXJcbiAgICAgICAgICA/IDw+XG4gICAgICAgICAgICAgIGF1dGg6IHt3aW5kb3cuRHJlYW1Vc2VyLmVtYWlsfTxiciAvPlxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgc3R5bGU9e3sgZm9udFNpemU6IDExLCBtYXJnaW5Ub3A6IDQgfX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXthc3luYyAoKSA9PiB7IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGguc2lnbk91dCgpOyBsb2NhdGlvbi5yZWxvYWQoKTsgfX0+XG4gICAgICAgICAgICAgICAgZFx1MDBFOWNvbm5leGlvblxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgIDogd2luZG93LkRyZWFtQXV0aD8ubm9BdXRoXG4gICAgICAgICAgICA/IFwiYXV0aDogZFx1MDBFOXNhY3Rpdlx1MDBFOWUgKHNlZWQgbW9kZSlcIlxuICAgICAgICAgICAgOiBcImF1dGg6IG5vbiBjb25uZWN0XHUwMEU5XCJ9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuY29uc3Qgcm9vdCA9IFJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpKTtcbnJvb3QucmVuZGVyKDxBcHAgLz4pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBQ0EsTUFBTSxFQUFFLFVBQVUsSUFBSSxXQUFXLElBQUksUUFBUSxHQUFHLElBQUk7QUFLcEQsTUFBTSxzQkFBc0I7QUFFNUIsU0FBUyxXQUFXO0FBUnBCO0FBV0UsS0FBRyxNQUFNO0FBWFgsUUFBQUEsS0FBQTtBQVlJLFFBQUk7QUFDRixVQUFJLENBQUMsYUFBYSxRQUFRLG1CQUFtQixHQUFHO0FBQzlDLHFCQUFhLFFBQVEscUJBQXFCLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQztBQUFBLE1BQzlEO0FBU0EsWUFBTSxTQUFTLElBQUksZ0JBQWdCLFNBQVMsTUFBTTtBQUNsRCxVQUFJLE9BQU8sSUFBSSxZQUFZLE1BQU0sS0FBSztBQUNwQyxjQUFNLGtCQUFrQixDQUFDLGVBQWUsVUFBVSxTQUFTLG1CQUFtQixZQUFZO0FBQzFGLHFCQUFhLFFBQVEsNEJBQTRCLEtBQUssVUFBVSxlQUFlLENBQUM7QUFDaEYscUJBQWEsUUFBUSx5QkFBeUIsU0FBUztBQUN2RCxxQkFBYSxRQUFRLDZCQUE2QixPQUFPLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDcEUscUJBQWEsUUFBUSw0QkFBNEIsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQ25FLGNBQU0sU0FBUyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssT0FBTztBQUM3QyxxQkFBYSxRQUFRLHFCQUFxQixPQUFPLE1BQU0sQ0FBQztBQUd4RCxnQkFBUSxJQUFJLGtIQUE2RjtBQUFBLE1BQzNHO0FBQ0EsVUFBSSxPQUFPLElBQUksaUJBQWlCLE1BQU0sS0FBSztBQUN6QyxxQkFBYSxXQUFXLDBCQUEwQjtBQUNsRCxxQkFBYSxXQUFXLHVCQUF1QjtBQUMvQyxxQkFBYSxXQUFXLDJCQUEyQjtBQUNuRCxxQkFBYSxXQUFXLDRCQUE0QjtBQUNwRCxxQkFBYSxXQUFXLDZCQUE2QjtBQUNyRCxxQkFBYSxXQUFXLDBCQUEwQjtBQUNsRCxxQkFBYSxXQUFXLG1CQUFtQjtBQUMzQyxZQUFJO0FBQUUsaUJBQUFBLE1BQUEsT0FBTyxnQkFBUCxnQkFBQUEsSUFBb0IsVUFBcEIsd0JBQUFBO0FBQUEsUUFBK0IsU0FBUTtBQUFBLFFBQUM7QUFDOUMsZ0JBQVEsSUFBSSxtRkFBOEQ7QUFBQSxNQUM1RTtBQUFBLElBQ0YsU0FBUTtBQUFBLElBQUM7QUFBQSxFQUNYLEdBQUcsQ0FBQyxDQUFDO0FBSUwsUUFBTSxDQUFDLGlCQUFpQixrQkFBa0IsSUFBSSxHQUFHLE1BQU07QUFDckQsUUFBSTtBQUNGLFVBQUksT0FBTyxPQUFPLHNCQUFzQixZQUFZO0FBQ2xELGVBQU8sQ0FBQyxPQUFPLGtCQUFrQjtBQUFBLE1BQ25DO0FBQ0EsYUFBTyxDQUFDLGFBQWEsUUFBUSwwQkFBMEI7QUFBQSxJQUN6RCxTQUFRO0FBQUUsYUFBTztBQUFBLElBQU87QUFBQSxFQUMxQixDQUFDO0FBRUQsUUFBTSxDQUFDLFFBQVEsU0FBUyxJQUFJLEdBQUcsTUFBTTtBQUNuQyxRQUFJO0FBQ0YsWUFBTSxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksRUFBRSxLQUFLLFFBQVEsS0FBSyxFQUFFO0FBQ3JELGFBQU8sS0FBSztBQUFBLElBQ2QsU0FBUTtBQUFFLGFBQU87QUFBQSxJQUFRO0FBQUEsRUFDM0IsQ0FBQztBQUNELFFBQU0sQ0FBQyxLQUFLLE1BQU0sSUFBSSxHQUFHLElBQUk7QUFHN0IsUUFBTSxnQkFBZ0IsR0FBRyxJQUFJO0FBSTdCLFFBQU0sQ0FBQyxTQUFTLFVBQVUsSUFBSSxHQUFHLE9BQU8sZUFBZSxDQUFDLENBQUM7QUFDekQsUUFBTSxDQUFDLGdCQUFnQixpQkFBaUIsSUFBSSxHQUFHLElBQUk7QUFHbkQsUUFBTSxDQUFDLE9BQU8sUUFBUSxJQUFJLEdBQUcsSUFBSTtBQUtqQyxLQUFHLE1BQU07QUFDUCxXQUFPLHlCQUF5QixDQUFDLGdCQUFnQjtBQUMvQyxpQkFBVyxVQUFRO0FBRWpCLFlBQUksS0FBSyxLQUFLLE9BQUssRUFBRSxPQUFPLFlBQVksRUFBRSxFQUFHLFFBQU87QUFDcEQsZUFBTyxDQUFDLGFBQWEsR0FBRyxJQUFJO0FBQUEsTUFDOUIsQ0FBQztBQUFBLElBQ0g7QUFDQSxXQUFPLDBCQUEwQixDQUFDLFNBQVMsU0FBUztBQTVGeEQsVUFBQUEsS0FBQTtBQTZGTSxZQUFNLFNBQVM7QUFBQSxRQUNiLElBQUksS0FBSztBQUFBLFFBQ1QsTUFBTSxLQUFLLFFBQVEsS0FBSyxlQUFlO0FBQUEsUUFDdkMsTUFBTSxLQUFLLFFBQVE7QUFBQSxRQUNuQixNQUFNLEtBQUssUUFBUSxLQUFLLFlBQVk7QUFBQSxRQUNwQyxVQUFVLEtBQUs7QUFBQSxRQUNmLFVBQVUsS0FBSztBQUFBLFFBQ2YsVUFBVSxLQUFLO0FBQUEsUUFDZixZQUFZLEtBQUs7QUFBQSxRQUNqQixnQkFBZ0IsS0FBSztBQUFBLFFBQ3JCLGtCQUFrQixLQUFLO0FBQUEsUUFDdkIsTUFBTTtBQUFBLE1BQ1I7QUFLQSxVQUFJO0FBQ0YsY0FBTSxVQUFVO0FBQUEsVUFDZCxHQUFLLEtBQUsscUJBQW1CQSxNQUFBLEtBQUssU0FBTCxnQkFBQUEsSUFBVyxvQkFBb0IsQ0FBQztBQUFBLFVBQzdELEdBQUssS0FBSyxnQkFBYyxVQUFLLFNBQUwsbUJBQVcsZUFBZSxDQUFDO0FBQUEsUUFDckQsRUFBRSxJQUFJLE9BQUssT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxFQUFFLE9BQU8sT0FBTztBQUN6RCxZQUFJLFFBQVEsU0FBUyxHQUFHO0FBQ3RCLHFCQUFXLFVBQVE7QUFwSDdCLGdCQUFBQSxLQUFBQztBQXFIWSxrQkFBTSxPQUFPLG9CQUFJLElBQUk7QUFDckIsdUJBQVcsS0FBSyxNQUFNO0FBQ3BCLG9CQUFNLE9BQU87QUFBQSxnQkFDWCxLQUFLRCxNQUFBLEVBQUUsU0FBRixnQkFBQUEsSUFBUSxvQkFBb0IsQ0FBQztBQUFBLGdCQUNsQyxLQUFLQyxNQUFBLEVBQUUsU0FBRixnQkFBQUEsSUFBUSxlQUFlLENBQUM7QUFBQSxjQUMvQjtBQUNBLG1CQUFLLFFBQVEsT0FBSyxLQUFLLElBQUksT0FBTyxDQUFDLEVBQUUsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQUEsWUFDNUQ7QUFDQSxrQkFBTSxRQUFRLFFBQVEsS0FBSyxPQUFLLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztBQUM1QyxnQkFBSSxTQUFTLE9BQU8sK0JBQStCO0FBRWpELHlCQUFXLE1BQU07QUFoSS9CLG9CQUFBRCxLQUFBQztBQWlJZ0Isb0JBQUk7QUFDRix5QkFBTyw4QkFBOEIsRUFBRSxnQkFBZ0IsTUFBTSxDQUFDO0FBQzlELG1CQUFBQSxPQUFBRCxNQUFBLE9BQU8sZ0JBQVAsZ0JBQUFBLElBQW9CLFNBQXBCLGdCQUFBQyxJQUFBLEtBQUFELEtBQTJCO0FBQUEsZ0JBQzdCLFNBQVE7QUFBQSxnQkFBQztBQUFBLGNBQ1gsR0FBRyxJQUFJO0FBQUEsWUFDVDtBQUNBLG1CQUFPLEtBQUssSUFBSSxPQUFNLEVBQUUsT0FBTyxVQUFVLFNBQVMsQ0FBRTtBQUFBLFVBQ3RELENBQUM7QUFDRDtBQUFBLFFBQ0Y7QUFBQSxNQUNGLFNBQVE7QUFBQSxNQUFDO0FBQ1QsaUJBQVcsVUFBUSxLQUFLLElBQUksT0FBTSxFQUFFLE9BQU8sVUFBVSxTQUFTLENBQUUsQ0FBQztBQUFBLElBQ25FO0FBQ0EsV0FBTyxpQkFBaUIsQ0FBQyxTQUFTO0FBRWhDLFlBQU0sS0FBSyxPQUFPLEtBQUssSUFBSTtBQUMzQixlQUFTLEVBQUUsSUFBSSxHQUFHLEtBQUssQ0FBQztBQUFBLElBQzFCO0FBQUEsRUFDRixHQUFHLENBQUMsQ0FBQztBQUdMLFFBQU0saUJBQWlCLFlBQVk7QUFDakMsUUFBSTtBQUNGLHdCQUFrQixJQUFJO0FBQ3RCLFlBQU0sT0FBTyxNQUFNLE9BQU8sU0FBUyxXQUFXLEVBQUUsT0FBTyxHQUFHLENBQUM7QUFDM0QsWUFBTSxTQUFRLDZCQUFNLFdBQVUsQ0FBQyxHQUFHLElBQUksUUFBTTtBQUFBLFFBQzFDLElBQUksRUFBRTtBQUFBLFFBQ04sTUFBTSxFQUFFO0FBQUEsUUFDUixNQUFNLEVBQUU7QUFBQSxRQUNSLE1BQU0sRUFBRSxRQUFRLEVBQUUsWUFBWTtBQUFBLFFBQzlCLFVBQVUsRUFBRTtBQUFBLFFBQ1osVUFBVSxFQUFFO0FBQUE7QUFBQSxRQUVaLE1BQU07QUFBQSxNQUNSLEVBQUU7QUFLRixVQUFJLEtBQUssV0FBVyxNQUFLLDZCQUFNLFFBQU87QUFDcEMsbUJBQVcsVUFBUTtBQUNqQixnQkFBTSxVQUFVLEtBQUssT0FBTyxPQUFLLEVBQUUsUUFBUTtBQUMzQyxpQkFBTyxRQUFRLFNBQVMsQ0FBQyxHQUFHLFNBQVMsR0FBSSxPQUFPLGVBQWUsQ0FBQyxDQUFFLElBQUssT0FBTyxlQUFlLENBQUM7QUFBQSxRQUNoRyxDQUFDO0FBQUEsTUFDSCxXQUFXLEtBQUssV0FBVyxHQUFHO0FBQzVCLG1CQUFXLFVBQVEsS0FBSyxPQUFPLE9BQUssRUFBRSxRQUFRLENBQUM7QUFBQSxNQUNqRCxPQUFPO0FBQ0wsbUJBQVcsVUFBUTtBQUNqQixnQkFBTSxVQUFVLEtBQUssT0FBTyxPQUFLLEVBQUUsUUFBUTtBQUUzQyxnQkFBTSxrQkFBa0IsUUFBUSxPQUFPLE9BQUssQ0FBQyxLQUFLLEtBQUssT0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUM7QUFDMUUsaUJBQU8sQ0FBQyxHQUFHLGlCQUFpQixHQUFHLElBQUk7QUFBQSxRQUNyQyxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0YsU0FBUyxHQUFHO0FBQ1YsY0FBUSxLQUFLLGdDQUFnQyxFQUFFLE9BQU87QUFDdEQsaUJBQVcsT0FBTyxlQUFlLENBQUMsQ0FBQztBQUFBLElBQ3JDLFVBQUU7QUFDQSx3QkFBa0IsS0FBSztBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUVBLEtBQUcsTUFBTTtBQUNQLG1CQUFlO0FBRWYsUUFBSSxPQUFPLGFBQWEsQ0FBQyxPQUFPLFVBQVUsUUFBUTtBQUNoRCxZQUFNLFFBQVEsT0FBTyxVQUFVLGFBQWEsTUFBTTtBQUFFLHVCQUFlO0FBQUEsTUFBRyxDQUFDO0FBQ3ZFLGFBQU87QUFBQSxJQUNUO0FBQUEsRUFDRixHQUFHLENBQUMsQ0FBQztBQUdMLEtBQUcsTUFBTTtBQUNQLFdBQU8sc0JBQXNCO0FBQzdCLFdBQU8sc0JBQXNCO0FBQUEsRUFDL0IsQ0FBQztBQUVELFFBQU0sS0FBSyxDQUFDLEdBQUcsTUFBTTtBQUNuQixjQUFVLENBQUM7QUFDWCxXQUFPLEtBQUssSUFBSTtBQUNoQixRQUFJO0FBQUUsZUFBUyxPQUFPO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUNsQyxXQUFPLFNBQVMsRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUMxQixRQUFJO0FBQUUsYUFBTyxPQUFPLFlBQVksRUFBRSxNQUFNLHdCQUF3QixPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsR0FBRyxHQUFHO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUFBLEVBQ3pHO0FBT0EsS0FBRyxNQUFNO0FBQ1AsUUFBSSxnQkFBZ0I7QUFDcEIsUUFBSTtBQUNGLHNCQUFnQixhQUFhLFFBQVEsc0JBQXNCLE1BQU07QUFDakUsVUFBSSxDQUFDLGVBQWU7QUFDbEIsY0FBTSxTQUFTLElBQUksZ0JBQWdCLFNBQVMsTUFBTTtBQUNsRCxZQUFJLE9BQU8sSUFBSSxRQUFRLE1BQU0sS0FBSztBQUNoQywwQkFBZ0I7QUFBQSxRQUlsQjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFNBQVE7QUFBQSxJQUFDO0FBRVQsUUFBSSxDQUFDLGVBQWU7QUFFbEI7QUFBQSxJQUNGO0FBRUEsVUFBTSxVQUFVLENBQUMsTUFBTTtBQS9PM0IsVUFBQUEsS0FBQTtBQWdQTSxZQUFJQSxNQUFBLEVBQUUsU0FBRixnQkFBQUEsSUFBUSxVQUFTLHVCQUF3QixXQUFVLElBQUk7QUFDM0QsWUFBSSxPQUFFLFNBQUYsbUJBQVEsVUFBUyx5QkFBMEIsV0FBVSxLQUFLO0FBQUEsSUFDaEU7QUFDQSxXQUFPLGlCQUFpQixXQUFXLE9BQU87QUFDMUMsUUFBSTtBQUFFLGFBQU8sT0FBTyxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsR0FBRyxHQUFHO0FBQUEsSUFBRyxTQUFRO0FBQUEsSUFBQztBQUNsRixXQUFPLE1BQU0sT0FBTyxvQkFBb0IsV0FBVyxPQUFPO0FBQUEsRUFDNUQsR0FBRyxDQUFDLENBQUM7QUFJTCxRQUFNLENBQUMsbUJBQW1CLG9CQUFvQixJQUFJLEdBQUcsSUFBSTtBQUN6RCxLQUFHLE1BQU07QUFDUCxRQUFJLFlBQVk7QUFDaEIsS0FBQyxZQUFZO0FBN1BqQixVQUFBQTtBQThQTSxVQUFJO0FBRUYsY0FBTSxjQUFjLFNBQVMsYUFBYSxRQUFRLHVDQUF1QyxLQUFLLEtBQUssRUFBRTtBQUNyRyxZQUFJLEtBQUssSUFBSSxJQUFJLGNBQWMsSUFBSSxLQUFLLE9BQU8sSUFBTTtBQUNyRCxZQUFJLEdBQUNBLE1BQUEsT0FBTyxhQUFQLGdCQUFBQSxJQUFpQixzQkFBc0I7QUFDNUMsY0FBTSxJQUFJLE1BQU0sT0FBTyxTQUFTLHFCQUFxQjtBQUNyRCxZQUFJLFVBQVc7QUFDZixZQUFJLHVCQUFHLFNBQVM7QUFDZCwrQkFBcUIsRUFBRSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsQ0FBQztBQUFBLFFBQ2pFO0FBQUEsTUFDRixTQUFRO0FBQUEsTUFBQztBQUFBLElBQ1gsR0FBRztBQUNILFdBQU8sTUFBTTtBQUFFLGtCQUFZO0FBQUEsSUFBTTtBQUFBLEVBQ25DLEdBQUcsQ0FBQyxDQUFDO0FBRUwsUUFBTSxDQUFDLFFBQVEsU0FBUyxJQUFJLEdBQUcsS0FBSztBQUNwQyxRQUFNO0FBQUE7QUFBQSxJQUFtQztBQUFBLE1BQ3ZDLFVBQVU7QUFBQSxJQUNaO0FBQUE7QUFFQSxLQUFHLE1BQU07QUFDUCxRQUFJLGVBQWUsVUFBVSxlQUFlLFdBQVcsUUFBUTtBQUM3RCxnQkFBVSxlQUFlLE1BQU07QUFBQSxJQUNqQztBQUFBLEVBQ0YsR0FBRyxDQUFDLENBQUM7QUFJTCxRQUFNLFFBQVEsTUFBTyxRQUFRLEtBQUssT0FBSyxFQUFFLE9BQU8sR0FBRyxNQUFNLE9BQU8sZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUMvRCxRQUFRLENBQUMsTUFBTSxPQUFPLGVBQWUsQ0FBQyxHQUFHLENBQUM7QUFFL0QsTUFBSTtBQUNKLFVBQVEsUUFBUTtBQUFBO0FBQUEsSUFFZCxLQUFLO0FBQWtCLGFBQU8sb0NBQUMsT0FBTyxTQUFQLEVBQWUsSUFBUTtBQUFJO0FBQUEsSUFDMUQsS0FBSztBQUFrQixhQUFPLG9DQUFDLE9BQU8sU0FBUCxFQUFlLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBSTtBQUFBLElBQ3JHLEtBQUs7QUFBa0IsYUFBTyxvQ0FBQyxPQUFPLGNBQVAsRUFBb0IsSUFBUSxPQUFPLFNBQVMsUUFBUSxDQUFDLEdBQUcsWUFBWSxTQUFTO0FBQUk7QUFBQTtBQUFBLElBR2hILEtBQUs7QUFBa0IsYUFBTyxPQUFPLG9CQUNILG9DQUFDLE9BQU8sbUJBQVAsRUFBeUIsSUFBUSxJQUNsQyxvQ0FBQyxPQUFPLFVBQVAsRUFBZ0IsSUFBUTtBQUFJO0FBQUEsSUFDL0QsS0FBSztBQUFrQixhQUFPLG9DQUFDLE9BQU8sVUFBUCxFQUFnQixJQUFRO0FBQUk7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSTNELEtBQUs7QUFBb0IsYUFBTyxPQUFPLHFCQUNILG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUSxJQUNuQyxPQUFPLG1CQUNMLG9DQUFDLE9BQU8sa0JBQVAsRUFBd0IsSUFBUSxJQUNqQyxvQ0FBQyxPQUFPLFlBQVAsRUFBa0IsSUFBUTtBQUFJO0FBQUEsSUFDckUsS0FBSztBQUFvQixhQUFPLE9BQU8scUJBQ0gsb0NBQUMsT0FBTyxvQkFBUCxFQUEwQixJQUFRLGlCQUFnQixTQUFRLElBQzNELE9BQU8sbUJBQ0wsb0NBQUMsT0FBTyxrQkFBUCxFQUF3QixJQUFRLElBQ2pDLG9DQUFDLE9BQU8sT0FBUCxFQUFhLElBQVE7QUFBSTtBQUFBLElBQ2hFLEtBQUs7QUFBb0IsYUFBTyxPQUFPLHFCQUNILG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUSxpQkFBZ0IsV0FBVSxJQUM3RCxPQUFPLHFCQUNMLG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUSxJQUNuQyxvQ0FBQyxPQUFPLGVBQVAsRUFBcUIsSUFBUTtBQUFJO0FBQUEsSUFDeEUsS0FBSztBQUFvQixhQUFPLE9BQU8scUJBQ0gsb0NBQUMsT0FBTyxvQkFBUCxFQUEwQixJQUFRLGlCQUFnQixjQUFhLElBQ2hFLE9BQU8sd0JBQ0wsb0NBQUMsT0FBTyx1QkFBUCxFQUE2QixJQUFRLElBQ3RDLG9DQUFDLE9BQU8sWUFBUCxFQUFrQixJQUFRO0FBQUk7QUFBQTtBQUFBLElBRXJFLEtBQUs7QUFBb0IsYUFBTyxPQUFPLHFCQUNILG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUSxpQkFBZ0IsU0FBUSxJQUMzRCxPQUFPLG1CQUNMLG9DQUFDLE9BQU8sa0JBQVAsRUFBd0IsSUFBUSxJQUNqQyxvQ0FBQyxPQUFPLE9BQVAsRUFBYSxJQUFRO0FBQUk7QUFBQSxJQUNoRSxLQUFLO0FBQW9CLGFBQU8sT0FBTyxxQkFDSCxvQ0FBQyxPQUFPLG9CQUFQLEVBQTBCLElBQVEsaUJBQWdCLGNBQWEsSUFDaEUsT0FBTyx3QkFDTCxvQ0FBQyxPQUFPLHVCQUFQLEVBQTZCLElBQVEsSUFDdEMsb0NBQUMsT0FBTyxZQUFQLEVBQWtCLElBQVE7QUFBSTtBQUFBLElBQ3JFLEtBQUs7QUFBb0IsYUFBTyxPQUFPLHFCQUNILG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUSxpQkFBZ0IsV0FBVSxJQUM3RCxPQUFPLHFCQUNMLG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUSxJQUNuQyxvQ0FBQyxPQUFPLGVBQVAsRUFBcUIsSUFBUTtBQUFJO0FBQUEsSUFDeEUsS0FBSztBQUFvQixhQUFPLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsV0FBVyxLQUFLO0FBQUk7QUFBQTtBQUFBLElBR3pFLEtBQUs7QUFBb0IsYUFBTyxvQ0FBQyxPQUFPLGVBQVAsRUFBcUIsSUFBUTtBQUFJO0FBQUE7QUFBQSxJQUdsRSxLQUFLO0FBQW9CLGFBQU8sb0NBQUMsT0FBTyxjQUFQLEVBQW9CLElBQVE7QUFBSTtBQUFBLElBQ2pFLEtBQUs7QUFBb0IsYUFBTyxPQUFPLGVBQ0gsb0NBQUMsT0FBTyxjQUFQLEVBQW9CLElBQVEsVUFBVSxLQUFLLElBQzVDLG9DQUFDLE9BQU8sY0FBUCxFQUFvQixJQUFRLFVBQVUsS0FBSztBQUFJO0FBQUEsSUFDcEYsS0FBSztBQUFvQixhQUFPLG9DQUFDLE9BQU8sbUJBQVAsRUFBeUIsSUFBUTtBQUFJO0FBQUEsSUFDdEUsS0FBSztBQUFvQixhQUFPLG9DQUFDLE9BQU8saUJBQVAsRUFBdUIsSUFBUTtBQUFJO0FBQUEsSUFDcEUsS0FBSztBQUFvQixhQUFPLG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUTtBQUFJO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFLdkUsS0FBSztBQUFvQixhQUFPLE9BQU8saUJBQ0gsb0NBQUMsT0FBTyxnQkFBUCxFQUFzQixJQUFRLElBQy9CLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBSTtBQUFBLElBQ3hHLEtBQUs7QUFBb0IsYUFBTyxPQUFPLGdCQUNILG9DQUFDLE9BQU8sZUFBUCxFQUFxQixJQUFRLElBQzlCLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBSTtBQUFBO0FBQUEsSUFFeEcsS0FBSztBQUFvQixhQUFPLE9BQU8sa0JBQ0gsb0NBQUMsT0FBTyxpQkFBUCxFQUF1QixJQUFRLElBQ2hDLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBSTtBQUFBO0FBQUEsSUFFeEcsS0FBSztBQUF1QixhQUFPLE9BQU8sMkJBQ04sb0NBQUMsT0FBTywwQkFBUCxFQUFnQyxJQUFRLElBQ3pDLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBSTtBQUFBO0FBQUEsSUFHeEcsS0FBSztBQUFvQixhQUFPLG9DQUFDLE9BQU8sbUJBQVAsRUFBeUIsSUFBUTtBQUFJO0FBQUE7QUFBQSxJQUd0RSxLQUFLO0FBQWtCLGFBQU8sb0NBQUMsT0FBTyxtQkFBUCxFQUF5QixJQUFRO0FBQUk7QUFBQSxJQUNwRSxLQUFLO0FBQWtCLGFBQU8sb0NBQUMsT0FBTyxtQkFBUCxFQUF5QixJQUFRO0FBQUk7QUFBQSxJQUNwRSxLQUFLO0FBQWtCLGFBQU8sb0NBQUMsT0FBTyxlQUFQLEVBQXFCLElBQVE7QUFBSTtBQUFBO0FBQUEsSUFHaEUsS0FBSztBQUFrQixhQUFPLE9BQU8sc0JBQ0gsb0NBQUMsT0FBTyxxQkFBUCxFQUEyQixJQUFRLElBQ3BDLG9DQUFDLE9BQU8sU0FBUCxFQUFlLElBQVE7QUFBSTtBQUFBLElBQzlELEtBQUs7QUFBc0IsYUFBTyxPQUFPLG9CQUNQLG9DQUFDLE9BQU8sbUJBQVAsRUFBeUIsSUFBUSxJQUNsQyxvQ0FBQyxPQUFPLFNBQVAsRUFBZSxJQUFRO0FBQUk7QUFBQSxJQUM5RCxLQUFLO0FBQXNCLGFBQU8sT0FBTyxtQkFDUDtBQUFBLFFBQUMsT0FBTztBQUFBLFFBQVA7QUFBQSxVQUNDO0FBQUEsVUFDQSxZQUFZLDJCQUFLO0FBQUEsVUFDakIsVUFBVSwyQkFBSztBQUFBLFVBQ2YsU0FBUywyQkFBSztBQUFBO0FBQUEsTUFBUyxJQUN6QixvQ0FBQyxPQUFPLFNBQVAsRUFBZSxJQUFRO0FBQUk7QUFBQSxJQUM5RCxLQUFLO0FBQXlCLGFBQU8sT0FBTyxtQkFDVjtBQUFBLFFBQUMsT0FBTztBQUFBLFFBQVA7QUFBQSxVQUNDO0FBQUEsVUFDQSxZQUFXO0FBQUE7QUFBQSxNQUFjLElBQzNCLG9DQUFDLE9BQU8sU0FBUCxFQUFlLElBQVE7QUFBSTtBQUFBO0FBQUEsSUFHOUQsS0FBSztBQUFrQixhQUFPLG9DQUFDLE9BQU8sa0JBQVAsRUFBd0IsSUFBUTtBQUFJO0FBQUEsSUFDbkUsS0FBSztBQUFrQixhQUFPLG9DQUFDLE9BQU8sZUFBUCxFQUFxQixJQUFRO0FBQUk7QUFBQSxJQUNoRSxLQUFLO0FBQWtCLGFBQU8sb0NBQUMsT0FBTyxjQUFQLEVBQW9CLElBQVE7QUFBSTtBQUFBLElBQy9ELEtBQUs7QUFBa0IsYUFBTyxvQ0FBQyxPQUFPLGtCQUFQLEVBQXdCLElBQVE7QUFBSTtBQUFBO0FBQUEsSUFHbkUsS0FBSztBQUFrQixhQUFPLG9DQUFDLE9BQU8sb0JBQVAsRUFBMEIsSUFBUTtBQUFJO0FBQUE7QUFBQSxJQUdyRSxLQUFLO0FBQW1CLGFBQU8sb0NBQUMsT0FBTyxzQkFBUCxFQUE0QixJQUFRO0FBQUk7QUFBQTtBQUFBLElBR3hFLEtBQUs7QUFBbUIsYUFBTyxvQ0FBQyxPQUFPLGtCQUFQLEVBQXdCLElBQVE7QUFBSTtBQUFBO0FBQUE7QUFBQSxJQUlwRSxLQUFLO0FBQXFCLGFBQU8sT0FBTyx5QkFDSixvQ0FBQyxPQUFPLHdCQUFQLEVBQThCLElBQVEsS0FBVSxJQUNqRCxvQ0FBQyxPQUFPLE1BQVAsRUFBWSxJQUFRLFNBQWtCLFNBQVMsZ0JBQWdCO0FBQUk7QUFBQTtBQUFBO0FBQUEsSUFJeEcsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFzQixhQUFPLE9BQU8seUJBQ0wsb0NBQUMsT0FBTyx3QkFBUCxFQUE4QixJQUFRLEtBQVUsSUFDakQsb0NBQUMsT0FBTyxNQUFQLEVBQVksSUFBUSxTQUFrQixTQUFTLGdCQUFnQjtBQUFJO0FBQUE7QUFBQTtBQUFBLElBSXhHLEtBQUs7QUFBbUIsYUFBTyxvQ0FBQyxPQUFPLG9CQUFQLEVBQTBCLElBQVE7QUFBSTtBQUFBLElBQ3RFLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUs7QUFBQSxJQUNMLEtBQUssY0FBYztBQUNqQixZQUFNLGdCQUFnQixNQUFNO0FBQzFCLFlBQUk7QUFBRSxpQkFBTyxhQUFhLFFBQVEscUJBQXFCLE1BQU07QUFBQSxRQUFRLFNBQy9EO0FBQUUsaUJBQU87QUFBQSxRQUFPO0FBQUEsTUFDeEIsR0FBRztBQUNILFVBQUksQ0FBQyxjQUFjO0FBQ2pCLGVBQU8sb0NBQUMsT0FBTyxvQkFBUCxFQUEwQixJQUFRO0FBQUEsTUFDNUMsV0FBVyxXQUFXLGtCQUF5QixRQUFPLG9DQUFDLE9BQU8sc0JBQVAsRUFBNEIsSUFBUTtBQUFBLGVBQ2xGLFdBQVcsdUJBQTJCLFFBQU8sb0NBQUMsT0FBTywwQkFBUCxFQUFnQyxJQUFRO0FBQUEsZUFDdEYsV0FBVyxvQkFBMkIsUUFBTyxvQ0FBQyxPQUFPLHVCQUFQLEVBQTZCLElBQVE7QUFBQSxlQUNuRixXQUFXLGFBQTJCLFFBQU8sb0NBQUMsT0FBTyxpQkFBUCxFQUF1QixJQUFRO0FBQ3RGO0FBQUEsSUFDRjtBQUFBO0FBQUEsSUFHQSxLQUFLO0FBQWtCLGFBQU8sb0NBQUMsT0FBTyxNQUFQLEVBQVksSUFBUSxTQUFrQixTQUFTLGdCQUFnQjtBQUFJO0FBQUE7QUFBQSxJQUVsRyxLQUFLO0FBQW1CLGFBQU8sT0FBTywwQkFDSixvQ0FBQyxPQUFPLHlCQUFQLEVBQStCLElBQVEsU0FBUyxLQUFLLElBQ3RELG9DQUFDLE9BQU8sa0JBQVAsRUFBd0IsSUFBUTtBQUFJO0FBQUE7QUFBQTtBQUFBLElBR3ZFLEtBQUs7QUFBa0IsYUFBTyxPQUFPLFlBQ0gsb0NBQUMsT0FBTyxXQUFQLEVBQWlCLElBQVEsU0FBa0IsSUFDNUMsT0FBTyxtQkFDTCxvQ0FBQyxPQUFPLGtCQUFQLEVBQXdCLElBQVEsSUFDakMsb0NBQUMsT0FBTyxNQUFQLEVBQVksSUFBUSxTQUFrQixTQUFTLGdCQUFnQjtBQUFJO0FBQUEsSUFDeEcsS0FBSztBQUFBLElBQ0wsS0FBSztBQUFrQixhQUFPLE9BQU8sbUJBQ0gsb0NBQUMsT0FBTyxrQkFBUCxFQUF3QixJQUFRLElBQ2pDLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBSTtBQUFBLElBRXRHO0FBQXVCLGFBQU8sT0FBTyxZQUNILG9DQUFDLE9BQU8sV0FBUCxFQUFpQixJQUFRLFNBQWtCLElBQzVDLE9BQU8sbUJBQ0wsb0NBQUMsT0FBTyxrQkFBUCxFQUF3QixJQUFRLElBQ2pDLG9DQUFDLE9BQU8sTUFBUCxFQUFZLElBQVEsU0FBa0IsU0FBUyxnQkFBZ0I7QUFBQSxFQUN0RztBQUlBLE1BQUksT0FBTyxxQkFBcUIsbUJBQW1CLFdBQVcsc0JBQXNCO0FBQ2xGLFdBQ0Usb0NBQUMsT0FBTyxrQkFBUCxFQUF3QixJQUFJLENBQUMsR0FBRyxNQUFNO0FBQ3JDLHlCQUFtQixLQUFLO0FBQ3hCLFNBQUcsS0FBSyxRQUFRLENBQUM7QUFBQSxJQUNuQixHQUFHO0FBQUEsRUFFUDtBQU1BLFFBQU0sY0FBYyxXQUFXLFVBQVUsV0FBVyxlQUFlLFdBQVc7QUFDOUUsUUFBTSxlQUFlLENBQUMsTUFBTTtBQXJlOUIsUUFBQUE7QUFzZUksUUFBSSxDQUFDLFlBQWE7QUFDbEIsVUFBTSxLQUFJQSxNQUFBLEVBQUUsWUFBRixnQkFBQUEsSUFBWTtBQUN0QixRQUFJLENBQUMsRUFBRztBQUNSLGtCQUFjLFVBQVUsRUFBRSxHQUFHLEVBQUUsU0FBUyxHQUFHLEVBQUUsU0FBUyxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQUEsRUFDdEU7QUFDQSxRQUFNLGFBQWEsQ0FBQyxNQUFNO0FBM2U1QixRQUFBQTtBQTRlSSxRQUFJLENBQUMsWUFBYTtBQUNsQixVQUFNLFFBQVEsY0FBYztBQUM1QixRQUFJLENBQUMsTUFBTztBQUNaLGtCQUFjLFVBQVU7QUFDeEIsVUFBTSxLQUFJQSxNQUFBLEVBQUUsbUJBQUYsZ0JBQUFBLElBQW1CO0FBQzdCLFFBQUksQ0FBQyxFQUFHO0FBQ1IsVUFBTSxLQUFLLEVBQUUsVUFBVSxNQUFNO0FBQzdCLFVBQU0sS0FBSyxFQUFFLFVBQVUsTUFBTTtBQUM3QixVQUFNLEtBQUssS0FBSyxJQUFJLElBQUksTUFBTTtBQUM5QixRQUFJLEtBQUssSUFBSSxFQUFFLElBQUksR0FBSTtBQUN2QixRQUFJLEtBQUssSUFBSSxFQUFFLElBQUksS0FBSyxJQUFJLEVBQUUsSUFBSSxJQUFLO0FBQ3ZDLFFBQUksS0FBSyxJQUFLO0FBQ2QsUUFBSSxLQUFLLEtBQUssV0FBVyxRQUFRO0FBRS9CLFNBQUcsV0FBVztBQUFBLElBQ2hCLFdBQVcsS0FBSyxNQUFNLFdBQVcsZUFBZSxXQUFXLGlCQUFpQjtBQUUxRSxTQUFHLE1BQU07QUFBQSxJQUNYO0FBQUEsRUFDRjtBQUlBLFFBQU0sZUFBZSxXQUFXLGVBQWUsV0FBVztBQUMxRCxRQUFNLG9CQUFvQixjQUN4QixvQ0FBQyxTQUFJLGVBQVksUUFBTyxPQUFPO0FBQUEsSUFDN0IsVUFBVTtBQUFBLElBQVMsS0FBSztBQUFBLElBQ3hCLE1BQU07QUFBQSxJQUFHLE9BQU87QUFBQSxJQUNoQixTQUFTO0FBQUEsSUFBUSxnQkFBZ0I7QUFBQSxJQUFVLEtBQUs7QUFBQSxJQUNoRCxRQUFRO0FBQUEsSUFBSSxlQUFlO0FBQUEsRUFDN0IsS0FFRSxvQ0FBQyxVQUFLLE9BQU87QUFBQSxJQUNYLE9BQU87QUFBQSxJQUFHLFFBQVE7QUFBQSxJQUFHLGNBQWM7QUFBQSxJQUNuQyxZQUFZLENBQUMsZUFBZSw4QkFBOEI7QUFBQSxJQUMxRCxTQUFTLENBQUMsZUFBZSxPQUFPO0FBQUEsSUFDaEMsWUFBWTtBQUFBLElBQ1osV0FBVyxDQUFDLGVBQWUsbUVBQW1FO0FBQUEsRUFDaEcsR0FBRyxHQUVILG9DQUFDLFVBQUssT0FBTztBQUFBLElBQ1gsT0FBTztBQUFBLElBQUcsUUFBUTtBQUFBLElBQUcsY0FBYztBQUFBLElBQ25DLFlBQVksZUFBZSxrQ0FBa0M7QUFBQSxJQUM3RCxTQUFTLGVBQWUsT0FBTztBQUFBLElBQy9CLFlBQVk7QUFBQSxJQUNaLFdBQVcsZUFBZSx1RUFBdUU7QUFBQSxFQUNuRyxHQUFHLENBQ0wsSUFDRTtBQU9KLFFBQU0sYUFBYSxDQUFDLEdBQUUsWUFBTyxjQUFQLG1CQUFrQjtBQUN4QyxRQUFNLGVBQWUsTUFBTTtBQUN6QixRQUFJO0FBQ0YsWUFBTSxJQUFJLElBQUksSUFBSSxTQUFTLElBQUk7QUFDL0IsUUFBRSxhQUFhLE9BQU8sTUFBTTtBQUU1QixlQUFTLE9BQU8sRUFBRSxTQUFTO0FBQUEsSUFDN0IsU0FBUTtBQUNOLGVBQVMsT0FBTztBQUFBLElBQ2xCO0FBQUEsRUFDRjtBQUNBLFFBQU0sYUFBYSxhQUNqQixvQ0FBQyxTQUFJLE1BQUssVUFBUyxhQUFVLFVBQVMsT0FBTztBQUFBLElBQzNDLFVBQVU7QUFBQSxJQUNWLEtBQUs7QUFBQSxJQUFHLE1BQU07QUFBQSxJQUFHLE9BQU87QUFBQSxJQUN4QixRQUFRO0FBQUE7QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUNaLGNBQWM7QUFBQSxJQUNkLGdCQUFnQjtBQUFBLElBQ2hCLHNCQUFzQjtBQUFBLElBQ3RCLFNBQVM7QUFBQSxJQUNULFNBQVM7QUFBQSxJQUFRLFlBQVk7QUFBQSxJQUFVLGdCQUFnQjtBQUFBLElBQVUsS0FBSztBQUFBLElBQ3RFLFVBQVU7QUFBQSxJQUNWLFlBQVk7QUFBQSxJQUFnQixXQUFXO0FBQUEsSUFBVSxVQUFVO0FBQUEsSUFDM0QsT0FBTztBQUFBLElBQ1AsZUFBZTtBQUFBLElBQ2YsWUFBWTtBQUFBLEVBQ2QsS0FDRSxvQ0FBQyxVQUFLLE9BQU8sRUFBRSxTQUFTLElBQUksS0FBRywrREFFL0IsR0FDQTtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sU0FBUztBQUFBLE1BQ2YsY0FBVztBQUFBLE1BQ1gsT0FBTztBQUFBLFFBQ0wsWUFBWTtBQUFBLFFBQ1osUUFBUTtBQUFBLFFBQ1IsT0FBTztBQUFBLFFBQ1AsWUFBWTtBQUFBLFFBQWdCLFdBQVc7QUFBQSxRQUFVLFVBQVU7QUFBQSxRQUMzRCxTQUFTO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixlQUFlO0FBQUEsUUFDZixZQUFZO0FBQUEsTUFDZDtBQUFBLE1BQ0EsY0FBYyxPQUFLO0FBQ2pCLFVBQUUsY0FBYyxNQUFNLGFBQWE7QUFDbkMsVUFBRSxjQUFjLE1BQU0sUUFBUTtBQUFBLE1BQ2hDO0FBQUEsTUFDQSxjQUFjLE9BQUs7QUFDakIsVUFBRSxjQUFjLE1BQU0sYUFBYTtBQUNuQyxVQUFFLGNBQWMsTUFBTSxRQUFRO0FBQUEsTUFDaEM7QUFBQTtBQUFBLElBQUc7QUFBQSxFQUVMLENBQ0YsSUFDRTtBQUlKLFFBQU0sbUJBQW1CLGFBQWEsK0NBQStDO0FBRXJGLFNBQ0U7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFJO0FBQUEsTUFBNEI7QUFBQSxNQUMvQixPQUFPLEVBQUUsV0FBVyxTQUFTLFlBQVksaUJBQWlCO0FBQUE7QUFBQSxJQUN6RDtBQUFBLElBQ0E7QUFBQSxJQUVBLE9BQU8sY0FBYyxvQ0FBQyxPQUFPLFlBQVAsSUFBa0I7QUFBQSxJQUN4QztBQUFBLElBRUEsU0FBUyxPQUFPLG1CQUNmO0FBQUEsTUFBQyxPQUFPO0FBQUEsTUFBUDtBQUFBLFFBQ0MsS0FBSyxNQUFNO0FBQUEsUUFDWCxNQUFNLE1BQU07QUFBQSxRQUNaLE1BQU0sTUFBTTtBQUFBLFFBQ1osVUFBVSxNQUFNLFlBQVk7QUFBQSxRQUM1QixXQUFXLE1BQU0sU0FBUyxJQUFJO0FBQUE7QUFBQSxJQUNoQztBQUFBLElBR0Ysb0NBQUMsZ0JBQWEsUUFBZ0IsSUFBUTtBQUFBLElBQ3JDLFVBQVUsb0NBQUMsWUFBUyxRQUFnQixJQUFRO0FBQUEsSUFHNUMscUJBQXFCLE9BQU8sOEJBQzNCO0FBQUEsTUFBQyxPQUFPO0FBQUEsTUFBUDtBQUFBLFFBQ0MsT0FBTyxrQkFBa0I7QUFBQSxRQUN6QixTQUFTLE1BQU07QUFDYixjQUFJO0FBQUUseUJBQWEsUUFBUSx5Q0FBeUMsT0FBTyxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQUEsVUFBRyxTQUFRO0FBQUEsVUFBQztBQUNsRywrQkFBcUIsSUFBSTtBQUFBLFFBQzNCO0FBQUEsUUFDQSxZQUFZLE1BQU07QUFDaEIsK0JBQXFCLElBQUk7QUFDekIsYUFBRyxZQUFZO0FBQUEsUUFDakI7QUFBQTtBQUFBLElBQ0Y7QUFBQSxJQU9ELE9BQU8sNEJBQTRCLG9DQUFDLE9BQU8sMEJBQVAsSUFBZ0M7QUFBQSxJQUNwRSxPQUFPLDRCQUE0QixvQ0FBQyxPQUFPLDBCQUFQLElBQWdDO0FBQUEsRUFDdkU7QUFFSjtBQWlCQSxTQUFTLGFBQWEsRUFBRSxRQUFRLEdBQUcsR0FBRztBQUVwQyxRQUFNLGNBQWM7QUFBQSxJQUNsQjtBQUFBLElBQVc7QUFBQSxJQUFjO0FBQUEsSUFBVztBQUFBLElBQVU7QUFBQTtBQUFBLElBRTlDO0FBQUEsSUFBa0I7QUFBQSxJQUFzQjtBQUFBLElBQXNCO0FBQUEsRUFDaEU7QUFDQSxNQUFJLFlBQVksU0FBUyxNQUFNLEVBQUcsUUFBTztBQUd6QyxRQUFNLFlBQVksV0FBVyxlQUFlLFdBQVcsa0JBQWtCLFdBQVc7QUFDcEYsUUFBTSxjQUFjLENBQUMsUUFBUSxhQUFhLGFBQWEsZ0JBQWdCLG1CQUFtQixXQUFXLFFBQVEsRUFBRSxTQUFTLE1BQU07QUFDOUgsUUFBTSxtQkFBbUIsQ0FBQyxZQUFZLGtCQUFrQixRQUFRLEVBQUUsU0FBUyxNQUFNO0FBRWpGLFFBQU0saUJBQWlCO0FBQUEsSUFDckI7QUFBQSxJQUFVO0FBQUEsSUFBaUI7QUFBQSxJQUFnQjtBQUFBLElBQWE7QUFBQSxFQUMxRCxFQUFFLFNBQVMsTUFBTTtBQUVqQixRQUFNLGdCQUFnQixDQUFDLFNBQVMsZUFBZSxpQkFBaUIsb0JBQW9CLFNBQVMsY0FBYyxTQUFTLEVBQUUsU0FBUyxNQUFNO0FBRXJJLFFBQU0sY0FBYyxDQUFDLFlBQVksRUFBRSxTQUFTLE1BQU07QUFHbEQsUUFBTSxzQkFBc0I7QUFBQSxJQUMxQjtBQUFBLElBQVk7QUFBQSxJQUFXO0FBQUEsSUFDdkI7QUFBQSxJQUFnQjtBQUFBLElBQWdCO0FBQUEsSUFDaEM7QUFBQSxJQUFpQjtBQUFBLElBQW1CO0FBQUEsSUFBd0I7QUFBQSxJQUFxQjtBQUFBLElBQ2pGO0FBQUEsSUFBVztBQUFBLElBQVU7QUFBQSxFQUN2QixFQUFFLFNBQVMsTUFBTTtBQUVqQixRQUFNLFdBQVcsWUFBWSxXQUFNO0FBR25DLFFBQU0sY0FBYyxZQUFZLGtDQUFrQztBQUNsRSxRQUFNLFlBQWMsWUFBWSxpQ0FBaUM7QUFHakUsUUFBTSxZQUFZLENBQUMsT0FDakI7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUFPLEtBQUssR0FBRztBQUFBLE1BQUksU0FBUyxHQUFHO0FBQUEsTUFDOUIsY0FBWSxHQUFHO0FBQUEsTUFDZixPQUFPO0FBQUEsUUFDTCxZQUFZO0FBQUEsUUFBZSxRQUFRO0FBQUEsUUFBUSxRQUFRO0FBQUEsUUFDbkQsU0FBUztBQUFBLFFBQVEsZUFBZTtBQUFBLFFBQVUsWUFBWTtBQUFBLFFBQVUsS0FBSztBQUFBLFFBQ3JFLFNBQVM7QUFBQSxRQUNULE9BQU8sR0FBRyxTQUFTLGNBQWM7QUFBQSxRQUNqQyxTQUFTLEdBQUcsU0FBUyxJQUFJO0FBQUEsUUFDekIsWUFBWTtBQUFBLE1BQ2Q7QUFBQTtBQUFBLElBQ0Esb0NBQUMsVUFBSyxPQUFPLEVBQUUsVUFBVSxJQUFJLFdBQVcsU0FBUyxLQUFJLEdBQUcsS0FBTTtBQUFBLElBQzlELG9DQUFDLFVBQUssT0FBTyxFQUFFLFVBQVUsSUFBSSxXQUFXLFVBQVUsZUFBZSxTQUFTLEtBQUksR0FBRyxLQUFNO0FBQUEsRUFDekY7QUFJRixRQUFNLFlBQVk7QUFBQSxJQUNoQjtBQUFBLE1BQUUsSUFBSTtBQUFBLE1BQVksT0FBTztBQUFBLE1BQVksT0FBTztBQUFBLE1BQVUsUUFBUTtBQUFBLE1BQzVELE9BQU8sTUFBTSxHQUFHLFlBQVksY0FBYyxNQUFNO0FBQUEsSUFBRTtBQUFBLElBQ3BEO0FBQUEsTUFBRSxJQUFJO0FBQUEsTUFBWSxPQUFPO0FBQUEsTUFBWSxPQUFPO0FBQUEsTUFBVSxRQUFRO0FBQUEsTUFDNUQsT0FBTyxNQUFNLEdBQUcsVUFBVTtBQUFBLElBQUU7QUFBQSxFQUNoQztBQUNBLFFBQU0sYUFBYTtBQUFBLElBQ2pCO0FBQUEsTUFBRSxJQUFJO0FBQUEsTUFBWSxPQUFPO0FBQUEsTUFBWSxPQUFPO0FBQUEsTUFBVSxRQUFRO0FBQUEsTUFDNUQsT0FBTyxNQUFNLEdBQUcsUUFBUTtBQUFBLElBQUU7QUFBQSxJQUM1QjtBQUFBLE1BQUUsSUFBSTtBQUFBLE1BQVksT0FBTztBQUFBLE1BQVksT0FBTztBQUFBLE1BQVUsUUFBUTtBQUFBLE1BQzVELE9BQU8sTUFBTSxHQUFHLE9BQU87QUFBQSxJQUFFO0FBQUEsRUFDN0I7QUFJQSxRQUFNLG9CQUFvQixHQUFHLElBQUk7QUFDakMsUUFBTSxvQkFBb0IsR0FBRyxLQUFLO0FBQ2xDLFFBQU0sbUJBQW1CO0FBQ3pCLFFBQU0sWUFBWSxDQUFDLE1BQU07QUFDdkIsc0JBQWtCLFVBQVU7QUFDNUIsc0JBQWtCLFVBQVUsV0FBVyxNQUFNO0FBdnVCakQ7QUF3dUJNLHdCQUFrQixVQUFVO0FBQzVCLFVBQUk7QUFDRixhQUFJLFlBQU8sY0FBUCxtQkFBa0IsUUFBUyxRQUFPLFVBQVUsUUFBUSxFQUFFO0FBQUEsTUFDNUQsU0FBUUUsSUFBQTtBQUFBLE1BQUM7QUFDVCxTQUFHLFVBQVU7QUFBQSxJQUNmLEdBQUcsZ0JBQWdCO0FBQUEsRUFDckI7QUFDQSxRQUFNLFVBQVUsTUFBTTtBQUNwQixRQUFJLGtCQUFrQixTQUFTO0FBQzdCLG1CQUFhLGtCQUFrQixPQUFPO0FBQ3RDLHdCQUFrQixVQUFVO0FBQUEsSUFDOUI7QUFBQSxFQUNGO0FBQ0EsUUFBTSxhQUFhLE1BQU07QUFDdkIsUUFBSSxrQkFBa0IsU0FBUztBQUM3QixtQkFBYSxrQkFBa0IsT0FBTztBQUN0Qyx3QkFBa0IsVUFBVTtBQUFBLElBQzlCO0FBQUEsRUFDRjtBQUNBLFFBQU0sYUFBYSxDQUFDLE1BQU07QUFDeEIsUUFBSSxrQkFBa0IsU0FBUztBQUM3QixRQUFFLGVBQWU7QUFDakIsUUFBRSxnQkFBZ0I7QUFDbEIsd0JBQWtCLFVBQVU7QUFDNUI7QUFBQSxJQUNGO0FBQ0EsT0FBRyxZQUFZO0FBQUEsRUFDakI7QUFFQSxTQUNFLG9DQUFDLFNBQUksT0FBTztBQUFBLElBQ1YsVUFBVTtBQUFBLElBQ1YsUUFBUTtBQUFBLElBQUcsTUFBTTtBQUFBLElBQUcsT0FBTztBQUFBLElBQzNCLFFBQVE7QUFBQSxJQUNSLFlBQVksWUFDUixvRUFDQTtBQUFBLElBQ0osV0FBVyxZQUNQLGtGQUNBO0FBQUEsSUFDSixnQkFBZ0I7QUFBQSxJQUNoQixzQkFBc0I7QUFBQSxJQUN0QixTQUFTO0FBQUEsSUFDVCxTQUFTO0FBQUE7QUFBQSxJQUVULHFCQUFxQjtBQUFBLElBQ3JCLFlBQVk7QUFBQSxJQUNaLGNBQWM7QUFBQSxJQUNkLEtBQUs7QUFBQSxJQUNMLFlBQVk7QUFBQSxJQUNaLFlBQVk7QUFBQSxFQUNkLEtBRUcsVUFBVSxJQUFJLFNBQVMsR0FNeEI7QUFBQSxJQUFDO0FBQUE7QUFBQSxNQUNDLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUFXLFdBQVc7QUFBQSxNQUFTLGNBQWM7QUFBQSxNQUMxRCxjQUFjO0FBQUEsTUFBVyxZQUFZO0FBQUEsTUFBUyxlQUFlO0FBQUEsTUFDN0QsY0FBVztBQUFBLE1BQ1gsT0FBTTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsT0FBTztBQUFBLFFBQUksUUFBUTtBQUFBLFFBQUksY0FBYztBQUFBLFFBQ3JDLFlBQVksY0FDUixnS0FDQTtBQUFBLFFBQ0osUUFBUTtBQUFBLFFBQ1IsUUFBUTtBQUFBLFFBQVcsU0FBUztBQUFBLFFBQVEsWUFBWTtBQUFBLFFBQ2hELE9BQU87QUFBQSxRQUFlLFVBQVU7QUFBQSxRQUNoQyxXQUFXLGNBQ1AsMElBQ0E7QUFBQSxRQUNKLFlBQVk7QUFBQSxRQUNaLFdBQVc7QUFBQSxRQUNYLFdBQVc7QUFBQSxRQUNYLFlBQVk7QUFBQSxRQUNaLGtCQUFrQjtBQUFBLFFBQ2xCLG9CQUFvQjtBQUFBLE1BQ3RCO0FBQUE7QUFBQSxJQUFHO0FBQUEsRUFFTCxHQUdDLFdBQVcsSUFBSSxTQUFTLENBQzNCO0FBRUo7QUFRQSxTQUFTLE1BQU07QUFDYixRQUFNLE9BQU8sT0FBTyxhQUFhLENBQUMsRUFBRSxTQUFTLE1BQU07QUFDbkQsUUFBTSxPQUFPLE9BQU87QUFDcEIsU0FDRSxvQ0FBQyxZQUNFLFFBQ0Msb0NBQUMsU0FBSSxlQUFZLFFBQU8sT0FBTztBQUFBLElBQzdCLFVBQVU7QUFBQSxJQUFTLE9BQU87QUFBQSxJQUMxQixlQUFlO0FBQUEsSUFBUSxRQUFRO0FBQUEsSUFDL0IsU0FBUztBQUFBLEVBQ1gsS0FDRSxvQ0FBQyxRQUFLLE1BQUssUUFBTyxDQUNwQixHQUVGLG9DQUFDLGNBQVMsQ0FDWjtBQUVKO0FBRUEsTUFBTSxlQUFlO0FBQUEsRUFDbkIsRUFBRSxPQUFPLGNBQVcsT0FBTztBQUFBLElBQ3pCLENBQUMsUUFBUSw4QkFBeUI7QUFBQSxJQUNsQyxDQUFDLFdBQVcsNkJBQXdCO0FBQUEsSUFDcEMsQ0FBQyxXQUFXLGdCQUFnQjtBQUFBLElBQzVCLENBQUMsVUFBVSxrQkFBZTtBQUFBLEVBQzVCLEVBQUM7QUFBQSxFQUNELEVBQUUsT0FBTyxZQUFZLE9BQU87QUFBQSxJQUMxQixDQUFDLFlBQVksK0JBQTBCO0FBQUEsSUFDdkMsQ0FBQyxVQUFVLGtCQUFlO0FBQUEsRUFDNUIsRUFBQztBQUFBLEVBQ0QsRUFBRSxPQUFPLFVBQVUsT0FBTztBQUFBLElBQ3hCLENBQUMsVUFBVSxxQkFBZ0I7QUFBQSxJQUMzQixDQUFDLGlCQUFpQix5QkFBaUI7QUFBQSxJQUNuQyxDQUFDLGdCQUFnQixvQkFBaUI7QUFBQSxJQUNsQyxDQUFDLGFBQWEsa0JBQWtCO0FBQUEsSUFDaEMsQ0FBQyxpQkFBaUIsOEJBQTJCO0FBQUEsRUFDL0MsRUFBQztBQUFBLEVBQ0QsRUFBRSxPQUFPLDRCQUE0QixPQUFPO0FBQUEsSUFDMUMsQ0FBQyxTQUFTLDBCQUFvQjtBQUFBLElBQzlCLENBQUMsZUFBZSx5Q0FBc0M7QUFBQSxJQUN0RCxDQUFDLGlCQUFpQixzQkFBbUI7QUFBQSxJQUNyQyxDQUFDLG9CQUFvQiw4QkFBMkI7QUFBQSxJQUNoRCxDQUFDLGdCQUFnQiwwQkFBMEI7QUFBQSxFQUM3QyxFQUFDO0FBQUEsRUFDRCxFQUFFLE9BQU8sUUFBUSxPQUFPO0FBQUEsSUFDdEIsQ0FBQyxnQkFBZ0IsaUJBQWlCO0FBQUEsSUFDbEMsQ0FBQyxnQkFBZ0IsY0FBYztBQUFBLElBQy9CLENBQUMsV0FBVyx5QkFBbUI7QUFBQSxJQUMvQixDQUFDLGNBQWMsK0JBQStCO0FBQUEsRUFDaEQsRUFBQztBQUFBLEVBQ0QsRUFBRSxPQUFPLDBDQUFvQyxPQUFPO0FBQUEsSUFDbEQsQ0FBQyxrQkFBa0Isb0NBQXFCO0FBQUEsSUFDeEMsQ0FBQyxzQkFBc0IsK0JBQTRCO0FBQUEsSUFDbkQsQ0FBQyx5QkFBeUIsc0NBQTRCO0FBQUEsRUFDeEQsRUFBQztBQUFBLEVBQ0QsRUFBRSxPQUFPLGNBQWMsT0FBTztBQUFBLElBQzVCLENBQUMsUUFBUSxpQkFBaUI7QUFBQSxFQUM1QixFQUFDO0FBQUEsRUFDRCxFQUFFLE9BQU8sb0JBQWlCLE9BQU87QUFBQSxJQUMvQixDQUFDLG1CQUFtQixrQkFBa0I7QUFBQSxFQUN4QyxFQUFDO0FBQUEsRUFDRCxFQUFFLE9BQU8sMkJBQXFCLE9BQU87QUFBQSxJQUNuQyxDQUFDLGNBQWMsc0JBQW1CO0FBQUEsSUFDbEMsQ0FBQyxXQUFXLDRCQUFzQjtBQUFBLElBQ2xDLENBQUMsVUFBVSwyQkFBcUI7QUFBQSxJQUNoQyxDQUFDLGNBQWMsK0JBQXlCO0FBQUEsRUFDMUMsRUFBQztBQUNIO0FBRUEsU0FBUyxTQUFTLEVBQUUsUUFBUSxHQUFHLEdBQUc7QUEvNEJsQztBQWc1QkUsU0FDRSxvQ0FBQyxTQUFJLE9BQU87QUFBQSxJQUNWLFVBQVU7QUFBQSxJQUFTLFFBQVE7QUFBQSxJQUFJLE9BQU87QUFBQSxJQUFJLFFBQVE7QUFBQSxJQUNsRCxPQUFPO0FBQUEsSUFBSyxXQUFXO0FBQUEsSUFBc0IsV0FBVztBQUFBLElBQ3hELFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxJQUE0QixTQUFTO0FBQUEsSUFDN0MsWUFBWTtBQUFBLElBQWUsVUFBVTtBQUFBLElBQUksT0FBTztBQUFBLEVBQ2xELEtBQ0Usb0NBQUMsU0FBSSxXQUFVLFlBQVcsT0FBTyxFQUFFLGdCQUFnQixnQkFBZ0IsS0FDakUsb0NBQUMsU0FBSSxPQUFPLEVBQUUsWUFBWSxnQkFBZ0IsV0FBVyxVQUFVLFVBQVUsR0FBRyxLQUFHLFFBQU0sR0FDckYsb0NBQUMsWUFBTyxXQUFVLFlBQVcsU0FBUyxNQUFNO0FBQzFDLFdBQU8sT0FBTyxZQUFZLEVBQUUsTUFBTSx3QkFBd0IsR0FBRyxHQUFHO0FBQUEsRUFDbEUsS0FBRyxNQUFDLENBQ04sR0FDQSxvQ0FBQyxTQUFJLFdBQVUsbUJBQWtCLE9BQU8sRUFBRSxZQUFZLGdCQUFnQixXQUFXLFNBQVMsS0FBRyxVQUFLLEdBQ2xHLG9DQUFDLFNBQUksV0FBVSxTQUFRLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FDcEMsYUFBYSxJQUFJLE9BQ2hCLG9DQUFDLFNBQUksS0FBSyxFQUFFLE9BQU8sT0FBTyxFQUFFLFdBQVcsR0FBRyxLQUN4QyxvQ0FBQyxTQUFJLFdBQVUsY0FBYSxPQUFPLEVBQUUsWUFBWSxlQUFlLFVBQVUsSUFBSSxlQUFlLFNBQVMsY0FBYyxFQUFFLEtBQ25ILEVBQUUsTUFBTSxZQUFZLENBQ3ZCLEdBQ0MsRUFBRSxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUNqQjtBQUFBLElBQUM7QUFBQTtBQUFBLE1BQU8sS0FBSztBQUFBLE1BQ1gsU0FBUyxNQUFNLEdBQUcsQ0FBQztBQUFBLE1BQ25CLE9BQU87QUFBQSxRQUNMLFNBQVM7QUFBQSxRQUFTLE9BQU87QUFBQSxRQUN6QixXQUFXO0FBQUEsUUFBUSxTQUFTO0FBQUEsUUFDNUIsWUFBWSxXQUFXLElBQUkscURBQXFEO0FBQUEsUUFDaEYsUUFBUSxnQkFBZ0IsV0FBVyxJQUFJLGdCQUFnQjtBQUFBLFFBQ3ZELE9BQU8sV0FBVyxJQUFJLGdCQUFnQjtBQUFBLFFBQ3RDLFVBQVU7QUFBQSxRQUFNLFlBQVk7QUFBQSxRQUFnQixXQUFXO0FBQUEsUUFBVSxRQUFRO0FBQUEsUUFDekUsY0FBYztBQUFBLE1BQ2hCO0FBQUE7QUFBQSxJQUNDO0FBQUEsRUFDSCxDQUNELENBQ0gsQ0FDRCxDQUNILEdBR0Esb0NBQUMsU0FBSSxXQUFVLFFBQU8sT0FBTztBQUFBLElBQzNCLFdBQVc7QUFBQSxJQUFJLFlBQVk7QUFBQSxJQUMzQixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFBSSxZQUFZO0FBQUEsSUFDMUIsT0FBTztBQUFBLEVBQ1QsS0FDRyxPQUFPLFlBQ0osMERBQUUsVUFDTyxPQUFPLFVBQVUsT0FBTSxvQ0FBQyxVQUFHLEdBQ2xDO0FBQUEsSUFBQztBQUFBO0FBQUEsTUFBTyxXQUFVO0FBQUEsTUFBVyxPQUFPLEVBQUUsVUFBVSxJQUFJLFdBQVcsRUFBRTtBQUFBLE1BQy9ELFNBQVMsWUFBWTtBQUFFLGNBQU0sT0FBTyxVQUFVLFFBQVE7QUFBRyxpQkFBUyxPQUFPO0FBQUEsTUFBRztBQUFBO0FBQUEsSUFBRztBQUFBLEVBRWpGLENBQ0YsTUFDQSxZQUFPLGNBQVAsbUJBQWtCLFVBQ2hCLHVDQUNBLHVCQUNSLENBQ0Y7QUFFSjtBQUVBLE1BQU0sT0FBTyxTQUFTLFdBQVcsU0FBUyxlQUFlLE1BQU0sQ0FBQztBQUNoRSxLQUFLLE9BQU8sb0NBQUMsU0FBSSxDQUFFOyIsCiAgIm5hbWVzIjogWyJfYSIsICJfYiIsICJlIl0KfQo=
