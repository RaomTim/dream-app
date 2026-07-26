/* global React, ReactDOM */
const { useState: uS, useEffect: uE, useRef: uR } = React;

// 2026-04-26 — Refonte B+D (Design §11.bis)
// - Mark first-access timestamp pour helper isPostJ30 (account-created)
// - Initial onboarding screen si pas onboardé
const ACCOUNT_CREATED_KEY = "dream:account-created";

function AppShell() {
  // Premier accès : on stamp account-created (utilisé par isPostJ30
  // pour somatic gate + felt-shift opt-in après J30)
  uE(() => {
    try {
      if (!localStorage.getItem(ACCOUNT_CREATED_KEY)) {
        localStorage.setItem(ACCOUNT_CREATED_KEY, String(Date.now()));
      }

      // 2026-04-27 — CHEAT CODE pour explorer toute l'app sans attendre N jours.
      // URL : `?reveal-all=1` débloque tout :
      //   - Toutes les découvertes progressives (Journal, Cercle, Anima, Portrait Lettre, Protocoles)
      //   - Felt-shift 6 zones (au lieu de 1 par défaut)
      //   - Onboarding skip
      //   - Account-created backdaté à 35 jours (passe J30 pour somatic gate opt-in)
      // Persistant : reste actif tant que localStorage n'est pas vidé.
      const params = new URLSearchParams(location.search);
      if (params.get("reveal-all") === "1") {
        const ALL_DISCOVERIES = ["journal-vie", "cercle", "anima", "portrait-lettre", "protocoles"];
        localStorage.setItem("dream:discovery:revealed", JSON.stringify(ALL_DISCOVERIES));
        localStorage.setItem("dream:felt-shift-mode", "6-zones");
        localStorage.setItem("dream:felt-shift-prompted", String(Date.now()));
        localStorage.setItem("dream:onboarded:b-plus-d", String(Date.now()));
        const j35ago = Date.now() - 35 * 24 * 3600 * 1000;
        localStorage.setItem(ACCOUNT_CREATED_KEY, String(j35ago));
        // Force tout les Wow comme déjà tirés (pour pas avoir d'overlay surprise)
        // ou au contraire les reset si on veut les voir tous → on les laisse intacts
        console.log("[Dream] 🌟 reveal-all=1 activé — toute l'app débloquée. Reload sans le param pour explorer.");
      }
      if (params.get("reset-discovery") === "1") {
        localStorage.removeItem("dream:discovery:revealed");
        localStorage.removeItem("dream:felt-shift-mode");
        localStorage.removeItem("dream:felt-shift-prompted");
        localStorage.removeItem("dream:somatic-gate-enabled");
        localStorage.removeItem("dream:somatic-gate-prompted");
        localStorage.removeItem("dream:onboarded:b-plus-d");
        localStorage.removeItem(ACCOUNT_CREATED_KEY);
        try { window.wowRegistry?.reset?.(); } catch {}
        console.log("[Dream] 🔄 reset-discovery=1 activé — état initial restauré.");
      }
    } catch {}
  }, []);

  // Onboarding B+D : si pas encore fait → afficher l'écran rituel
  // window.isOnboardedBPlusD provient de screens-onboarding-rituel.jsx
  const [needsOnboarding, setNeedsOnboarding] = uS(() => {
    try {
      if (typeof window.isOnboardedBPlusD === "function") {
        return !window.isOnboardedBPlusD();
      }
      return !localStorage.getItem("dream:onboarded:b-plus-d");
    } catch { return false; }
  });

  const [screen, setScreen] = uS(() => {
    try {
      const p = new URL(location.href).hash.replace("#", "");
      return p || "home";
    } catch { return "home"; }
  });
  const [ctx, setCtx] = uS(null);

  // Refs pour swipe horizontal JOUR/NUIT (Design §11.bis.4)
  const swipeStartRef = uR(null);

  // Live entries — loaded from DreamAPI on mount + on auth change.
  // Falls back to seed data when API unavailable / not authenticated.
  const [entries, setEntries] = uS(window.seedEntries || []);
  const [entriesLoading, setEntriesLoading] = uS(true);

  // 2026-04-27 P1.4 — Toast queue (1 toast at a time)
  const [toast, setToast] = uS(null);

  // Optimistic helpers — exposés globalement pour Capture/Journal/Cercle.
  // Insert local immédiatement (même id `local-…` flag _pending).
  // Replace local par real kairos au retour API.
  uE(() => {
    window.DreamInsertLocalKairos = (localKairos) => {
      setEntries(prev => {
        // Évite duplicate
        if (prev.find(e => e.id === localKairos.id)) return prev;
        return [localKairos, ...prev];
      });
    };
    window.DreamReplaceLocalKairos = (localId, real) => {
      const mapped = {
        id: real.id,
        type: real.type || real.kairos_type || "dream_night",
        when: real.when || "à l'instant",
        text: real.text || real.raw_text || "",
        raw_text: real.raw_text,
        numinous: real.numinous,
        bigDream: real.bigDream,
        created_at: real.created_at,
        synthesis_text: real.synthesis_text,
        synthesis_voices: real.synthesis_voices,
        _raw: real,
      };
      // 2026-04-29 — Trigger ConstellationOverlay si nouvelle figure/archétype.
      // Compare archetypal_tags + motif_tags du real kairos avec ceux des
      // entries précédentes : si UN nouveau label apparaît qui n'existait
      // pas avant → fire l'overlay (1× via wowRegistry "naissance-noeud").
      try {
        const newTags = [
          ...((real.archetypal_tags || real._raw?.archetypal_tags) || []),
          ...((real.motif_tags || real._raw?.motif_tags) || []),
        ].map(t => String(t).toLowerCase().trim()).filter(Boolean);
        if (newTags.length > 0) {
          setEntries(prev => {
            const seen = new Set();
            for (const e of prev) {
              const tags = [
                ...((e._raw?.archetypal_tags) || []),
                ...((e._raw?.motif_tags) || []),
              ];
              tags.forEach(t => seen.add(String(t).toLowerCase().trim()));
            }
            const fresh = newTags.find(t => !seen.has(t));
            if (fresh && window.dreamShowConstellationOverlay) {
              // Délai léger pour laisser CapturePostSequenced s'animer en premier
              setTimeout(() => {
                try {
                  window.dreamShowConstellationOverlay({ newFigureLabel: fresh });
                  window.wowRegistry?.fire?.("naissance-noeud");
                } catch {}
              }, 1200);
            }
            return prev.map(e => (e.id === localId ? mapped : e));
          });
          return;
        }
      } catch {}
      setEntries(prev => prev.map(e => (e.id === localId ? mapped : e)));
    };
    window.dreamShowToast = (opts) => {
      // Replace any existing toast (1 at a time)
      const id = "t-" + Date.now();
      setToast({ id, ...opts });
    };
  }, []);

  // Reload entries from API
  const refreshEntries = async () => {
    try {
      setEntriesLoading(true);
      const data = await window.DreamAPI.listKairos({ limit: 50 });
      const rows = (data?.kairos || []).map(k => ({
        id: k.id,
        type: k.type,
        when: k.when,
        text: k.text || k.raw_text || "",
        numinous: k.numinous,
        bigDream: k.bigDream,
        // keep raw backend fields available
        _raw: k,
      }));
      // If API returned nothing, fall back to seed for visual continuity
      // (seed kept as bootstrap UX while user has 0 kairos)
      // 2026-04-27 P1.4 : preserve pending local kairos pendant refresh
      // (sinon optimistic disappears au refresh asynchrone post-create).
      if (rows.length === 0 && data?._seed) {
        setEntries(prev => {
          const pending = prev.filter(e => e._pending);
          return pending.length ? [...pending, ...(window.seedEntries || [])] : (window.seedEntries || []);
        });
      } else if (rows.length === 0) {
        setEntries(prev => prev.filter(e => e._pending));
      } else {
        setEntries(prev => {
          const pending = prev.filter(e => e._pending);
          // Si un real kairos a un id matchant un pending → drop pending
          const pendingFiltered = pending.filter(p => !rows.find(r => r.id === p.id));
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
    // Auto-refresh on auth change (if available)
    if (window.DreamAuth && !window.DreamAuth.noAuth) {
      const unsub = window.DreamAuth.onAuthChange(() => { refreshEntries(); });
      return unsub;
    }
  }, []);

  // Expose for child screens that want to trigger refresh after create/delete
  uE(() => {
    window.DreamRefreshEntries = refreshEntries;
    window.DreamEntriesLoading = entriesLoading;
  });

  const go = (s, c) => {
    setScreen(s);
    setCtx(c || null);
    try { location.hash = s; } catch {}
    window.scrollTo({ top: 0 });
    try { window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { screen: s } }, "*"); } catch {}
  };

  // 2026-04-27 — Sprint P0 §D : guard Tweaks en prod.
  // Listener postMessage __activate_edit_mode UNIQUEMENT si :
  //   - localStorage["dream:tweaks-enabled"] === "true"  (active via console pour dev)
  //   - OU URL ?tweaks=1                                 (active manuellement pour debug)
  // Sinon le panneau ne peut jamais s'ouvrir (pollution prod évitée).
  uE(() => {
    let tweaksAllowed = false;
    try {
      tweaksAllowed = localStorage.getItem("dream:tweaks-enabled") === "true";
      if (!tweaksAllowed) {
        const params = new URLSearchParams(location.search);
        if (params.get("tweaks") === "1") {
          tweaksAllowed = true;
          // Persist pour la session (sans forcer permanent — opt-in via URL)
          // Si on veut perma : décommenter la ligne ci-dessous
          // localStorage.setItem("dream:tweaks-enabled", "true");
        }
      }
    } catch {}

    if (!tweaksAllowed) {
      // Pas de listener installé en prod → panel jamais affiché.
      return;
    }

    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaks(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaks(false);
    };
    window.addEventListener("message", handler);
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch {}
    return () => window.removeEventListener("message", handler);
  }, []);

  // 2026-04-26 — Nightmare auto-detect : silent check on mount + once per session.
  // Si valence < -0.6 sur 3+ kairos sur 14j → propose modal douce.
  const [nightmareProposal, setNightmareProposal] = uS(null);
  uE(() => {
    let cancelled = false;
    (async () => {
      try {
        // Skip if user already on nightmares route or has dismissed recently
        const dismissedAt = parseInt(localStorage.getItem("dream:nightmare-proposal:dismissed-at") || "0", 10);
        if (Date.now() - dismissedAt < 7 * 24 * 3600 * 1000) return;
        if (!window.DreamAPI?.autoDetectProtection) return;
        const r = await window.DreamAPI.autoDetectProtection();
        if (cancelled) return;
        if (r?.propose) {
          setNightmareProposal({ count: r.recent_low_valence_count || 3 });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  const [tweaks, setTweaks] = uS(false);
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "screen": "home"
  }/*EDITMODE-END*/;

  uE(() => {
    if (TWEAK_DEFAULTS.screen && TWEAK_DEFAULTS.screen !== screen) {
      setScreen(TWEAK_DEFAULTS.screen);
    }
  }, []);

  // Pick current entry: when ctx provided, find it; else use first available.
  // Ensures KairosDetail receives a real entry even before async load completes.
  const entry = ctx ? (entries.find(e => e.id === ctx) || (window.seedEntries || [])[0])
                    : (entries[0] || (window.seedEntries || [])[0]);

  let view;
  switch (screen) {
    // core flow
    case "capture":        view = <window.Capture go={go} />; break;
    case "journal":        view = <window.Journal go={go} entries={entries} loading={entriesLoading} />; break;
    case "kairos":         view = <window.KairosDetail go={go} entry={entry || entries[0]} allEntries={entries} />; break;

    // 2026-04-25 — Portrait refonte LETTRE narrative (Design §7.6)
    case "portrait":       view = window.PortraitNarrative
                                    ? <window.PortraitNarrative go={go} />
                                    : <window.Portrait go={go} />; break;
    case "portrait-carte": view = <window.Portrait go={go} />; break;  // sous-page constellation
    // 2026-04-26 — Anima Mundi 1 écran scrollable (Design §11.bis.5)
    // Tous les sub-routes legacy redirigent vers AnimaUnifiedScreen avec
    // scrollToSection (la page scroll smooth vers la section au mount).
    case "anima":            view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} />
                                      : window.AnimaVouteScreen
                                        ? <window.AnimaVouteScreen go={go} />
                                        : <window.AnimaVoute go={go} />; break;
    case "anima-meteo":      view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} scrollToSection="meteo" />
                                      : window.AnimaMeteoScreen
                                        ? <window.AnimaMeteoScreen go={go} />
                                        : <window.Meteo go={go} />; break;
    case "anima-annales":    view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} scrollToSection="annales" />
                                      : window.AnimaAnnalesScreen
                                        ? <window.AnimaAnnalesScreen go={go} />
                                        : <window.AnnalesScreen go={go} />; break;
    case "anima-polyphonie": view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} scrollToSection="polyphonie" />
                                      : window.AnimaPolyphonieScreen
                                        ? <window.AnimaPolyphonieScreen go={go} />
                                        : <window.Polyphonie go={go} />; break;
    // Compat legacy : redirige aussi vers l'écran unifié
    case "meteo":            view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} scrollToSection="meteo" />
                                      : window.AnimaMeteoScreen
                                        ? <window.AnimaMeteoScreen go={go} />
                                        : <window.Meteo go={go} />; break;
    case "polyphonie":       view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} scrollToSection="polyphonie" />
                                      : window.AnimaPolyphonieScreen
                                        ? <window.AnimaPolyphonieScreen go={go} />
                                        : <window.Polyphonie go={go} />; break;
    case "annales":          view = window.AnimaUnifiedScreen
                                      ? <window.AnimaUnifiedScreen go={go} scrollToSection="annales" />
                                      : window.AnimaAnnalesScreen
                                        ? <window.AnimaAnnalesScreen go={go} />
                                        : <window.AnnalesScreen go={go} />; break;
    case "chat":             view = <window.Chat go={go} contextId={ctx} />; break;

    // 2026-04-28 — Pivot Chat IA Dream personnel (Sprint A, Design §11.bis.20)
    case "dream-chat":       view = <window.DreamChatHome go={go} />; break;

    // cercle (refonte 2026-04-25 — Bible §3.4.1 + Design §7.7)
    case "cercle":           view = <window.CercleScreen go={go} />; break;
    case "cercle-detail":    view = window.CercleSubApp
                                      ? <window.CercleSubApp go={go} circleId={ctx} />
                                      : <window.CercleDetail go={go} circleId={ctx} />; break;
    case "creer-cercle":     view = <window.CreerCercleScreen go={go} />; break;
    case "rejoindre":        view = <window.RejoindreScreen go={go} />; break;
    case "partager-reve":    view = <window.PartagerReveScreen go={go} />; break;

    // 2026-04-27 — Sprint P0.2 : Explorer hub (remplace drawer caché)
    // Spec : 2_DESIGN §11.bis.17. ExplorerScreen = liste sobre des sous-apps
    // organisée en 3 sections (Le tien · Les autres · Profondeurs).
    case "explorer":         view = window.ExplorerScreen
                                      ? <window.ExplorerScreen go={go} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;
    case "comment":          view = window.CommentScreen
                                      ? <window.CommentScreen go={go} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;
    // 2026-04-27 — Sprint P0.4 : Glossaire (Design §11.bis.18)
    case "glossaire":        view = window.GlossaireScreen
                                      ? <window.GlossaireScreen go={go} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;
    // 2026-04-29 — Mon dictionnaire (moat épistémique, 4_LOG.md 2026-04-29)
    case "personal-dictionary": view = window.PersonalDictionaryScreen
                                      ? <window.PersonalDictionaryScreen go={go} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;

    // anima mundi (legacy / utilitaire)
    case "offre-kairos":     view = <window.OffreKairosScreen go={go} />; break;

    // soma
    case "oracle-corps":   view = <window.OracleCorpsScreen go={go} />; break;
    case "conte-miroir":   view = <window.ConteMiroirScreen go={go} />; break;
    case "reentry":        view = <window.ReentryScreen go={go} />; break;

    // 2026-04-26 nuit profonde — Quick vs Protocole Accompagné (Bible §3.11)
    case "capture-choice": view = window.CaptureChoiceScreen
                                    ? <window.CaptureChoiceScreen go={go} />
                                    : <window.Capture go={go} />; break;
    case "protocole-selector": view = window.ProtocoleSelector
                                    ? <window.ProtocoleSelector go={go} />
                                    : <window.Capture go={go} />; break;
    case "protocole-sub-flow": view = window.ProtocoleSubFlow
                                    ? <window.ProtocoleSubFlow
                                        go={go}
                                        protocolId={ctx?.protocolId}
                                        kairosId={ctx?.kairosId}
                                        entryId={ctx?.entryId} />
                                    : <window.Capture go={go} />; break;
    case "protocole-pre-sommeil": view = window.ProtocoleSubFlow
                                    ? <window.ProtocoleSubFlow
                                        go={go}
                                        protocolId="pre_sommeil" />
                                    : <window.Capture go={go} />; break;

    // meta
    case "onboarding":     view = <window.OnboardingScreen go={go} />; break;
    case "privacy":        view = <window.PrivacyScreen go={go} />; break;
    case "notifs":         view = <window.NotifsScreen go={go} />; break;
    case "abonnement":     view = <window.AbonnementScreen go={go} />; break;

    // figure
    case "figure":         view = <window.FigureDetailScreen go={go} />; break;

    // v1.2 amplification
    case "bigdream-signal": view = <window.BigDreamSignalScreen go={go} />; break;

    // 2026-04-26 — Sanctuaire Nightmares (Bible §17.3) MODE INTÉGRÉ + écran dédié
    case "nightmares":      view = <window.NightmaresScreen go={go} />; break;

    // 2026-04-29 — Big Dream Workflow 7 jours (Feature 3, 4_LOG.md)
    // ctx peut être un workflow_id (string) OU { workflow_id, kairos_id }
    case "bigdream-workflow": view = window.BigDreamWorkflowScreen
                                      ? <window.BigDreamWorkflowScreen go={go} ctx={ctx} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;

    // 2026-04-29 — Recurring Re-entry (Feature 4) — fermeture boucle ouverte UI
    // ctx peut être un pattern_id string OU { pattern_id }. Sans ctx → liste patterns.
    case "recurring":
    case "recurring-re-entry": view = window.RecurringReEntryScreen
                                      ? <window.RecurringReEntryScreen go={go} ctx={ctx} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;

    // 2026-04-26 — Sous-app Lucid Dreaming (Bible §17) opt-in strict
    // Si user n'a pas activé lucid mode → redirect vers profile (onboarding)
    case "lucid-profile":   view = <window.LucidProfileScreen go={go} />; break;
    case "lucid-dashboard":
    case "lucid-reality-checks":
    case "lucid-dream-signs":
    case "lucid-wbtb": {
      const lucidEnabled = (() => {
        try { return localStorage.getItem("dream:lucid:enabled") === "true"; }
        catch { return false; }
      })();
      if (!lucidEnabled) {
        view = <window.LucidProfileScreen go={go} />;
      } else if (screen === "lucid-dashboard")       view = <window.LucidDashboardScreen go={go} />;
      else if (screen === "lucid-reality-checks")    view = <window.LucidRealityChecksScreen go={go} />;
      else if (screen === "lucid-dream-signs")       view = <window.LucidDreamSignsScreen go={go} />;
      else if (screen === "lucid-wbtb")              view = <window.LucidWBTBScreen go={go} />;
      break;
    }

    // 2026-04-25 — Vue contemplative ancienne (1 kairos en grand)
    case "home-nuit":      view = <window.Home go={go} entries={entries} loading={entriesLoading} />; break;
    // 2026-04-25 — Drill-down section : ctx = objet section complet
    case "journal-section": view = window.JournalSectionDrillDown
                                    ? <window.JournalSectionDrillDown go={go} section={ctx} />
                                    : <window.JournalDeVieJour go={go} />; break;
    // 2026-04-26 (soir) — Pivot porte d'entrée RÊVE (Bible §1.6 + Design §11.bis.12)
    // home → DreamHome (NOUVEAU DEFAULT). home-jour → Journal de Vie LUMINEUX (sous-page)
    case "home":           view = window.DreamHome
                                    ? <window.DreamHome go={go} entries={entries} />
                                    : window.JournalDeVieJour
                                      ? <window.JournalDeVieJour go={go} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;
    case "home-jour":
    case "journal-jour":   view = window.JournalDeVieJour
                                    ? <window.JournalDeVieJour go={go} />
                                    : <window.Home go={go} entries={entries} loading={entriesLoading} />; break;

    default:               view = window.DreamHome
                                    ? <window.DreamHome go={go} entries={entries} />
                                    : window.JournalDeVieJour
                                      ? <window.JournalDeVieJour go={go} />
                                      : <window.Home go={go} entries={entries} loading={entriesLoading} />;
  }

  // ── Onboarding B+D : si pas onboardé OU screen === "onboarding-rituel"
  // → afficher l'écran rituel AVANT tout reste (skip → marque + go home)
  if (window.OnboardingRituel && (needsOnboarding || screen === "onboarding-rituel")) {
    return (
      <window.OnboardingRituel go={(s, c) => {
        setNeedsOnboarding(false);
        go(s || "home", c);
      }} />
    );
  }

  // ── Swipe horizontal DREAM ↔ JOUR (Design §11.bis.12 — refonte porte RÊVE)
  // Threshold 80px. Touchstart enregistre, touchend calcule deltaX.
  // Actif uniquement quand screen === "home" (DreamHome) ou "home-jour" (Journal de Vie LUMINEUX).
  // Note : "home-nuit" reste accessible (vue contemplative) mais HORS du swipe rotation.
  const isVieScreen = screen === "home" || screen === "home-jour" || screen === "journal-jour";
  const onTouchStart = (e) => {
    if (!isVieScreen) return;
    const t = e.touches?.[0];
    if (!t) return;
    swipeStartRef.current = { x: t.clientX, y: t.clientY, t: Date.now() };
  };
  const onTouchEnd = (e) => {
    if (!isVieScreen) return;
    const start = swipeStartRef.current;
    if (!start) return;
    swipeStartRef.current = null;
    const t = e.changedTouches?.[0];
    if (!t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const dt = Date.now() - start.t;
    if (Math.abs(dx) < 80) return;
    if (Math.abs(dy) > Math.abs(dx) * 0.8) return; // mostly vertical → ignore
    if (dt > 800) return; // too slow → ignore
    if (dx < 0 && screen === "home") {
      // swipe gauche depuis DREAM → JOUR (Journal de Vie LUMINEUX)
      go("home-jour");
    } else if (dx > 0 && (screen === "home-jour" || screen === "journal-jour")) {
      // swipe droite depuis JOUR → DREAM
      go("home");
    }
  };

  // Indicateur visuel DREAM/JOUR (2 dots ☾/☉) — seulement sur Vie
  // ☾ (gauche) = DreamHome (default) / ☉ (droite) = Journal de Vie LUMINEUX
  const isJourActive = screen === "home-jour" || screen === "journal-jour";
  const dayNightIndicator = isVieScreen ? (
    <div aria-hidden="true" style={{
      position: "fixed", top: "calc(env(safe-area-inset-top, 0px) + 6px)",
      left: 0, right: 0,
      display: "flex", justifyContent: "center", gap: 10,
      zIndex: 40, pointerEvents: "none",
    }}>
      {/* ☾ Dream (default) */}
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: !isJourActive ? "var(--silk-gold, #C9B098)" : "color-mix(in oklch, var(--ash-light) 40%, transparent)",
        opacity: !isJourActive ? 0.85 : 0.4,
        transition: "all 380ms ease",
        boxShadow: !isJourActive ? "0 0 6px color-mix(in oklch, var(--silk-gold) 30%, transparent)" : "none",
      }} />
      {/* ☉ Journal de Vie */}
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: isJourActive ? "var(--day-clay-warm, #C9B098)" : "color-mix(in oklch, var(--ash-light) 40%, transparent)",
        opacity: isJourActive ? 0.85 : 0.4,
        transition: "all 380ms ease",
        boxShadow: isJourActive ? "0 0 6px color-mix(in oklch, var(--day-clay-warm) 30%, transparent)" : "none",
      }} />
    </div>
  ) : null;

  // Sprint P1 §D (2026-04-27) — Bandeau démo mode.
  // Affiché sticky-top quand window.DreamAuth.noAuth === true (mode ?demo=1
  // ou Supabase non chargé). Indique que les dépôts ne sont pas sauvegardés
  // + bouton "se connecter →" qui force le passage par SignInScreen.
  // Le bouton recharge sans le param ?demo=1 ; AuthGate prend le relais.
  const isDemoMode = !!(window.DreamAuth?.noAuth);
  const onDemoSignIn = () => {
    try {
      const u = new URL(location.href);
      u.searchParams.delete("demo");
      // On garde le hash pour revenir à l'écran courant après login
      location.href = u.toString();
    } catch {
      location.reload();
    }
  };
  const demoBanner = isDemoMode ? (
    <div role="status" aria-live="polite" style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 60, // au-dessus de BottomNav (50) ; sous modals (200+)
      background: "color-mix(in oklch, var(--ash-deep) 40%, color-mix(in oklch, var(--night-floor) 70%, transparent))",
      borderBottom: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      padding: "calc(env(safe-area-inset-top, 0px) + 6px) 16px 6px",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
      flexWrap: "wrap",
      fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
      color: "var(--ash-light)",
      letterSpacing: "0.02em",
      lineHeight: 1.4,
    }}>
      <span style={{ opacity: 0.9 }}>
        mode démo · les dépôts ne sont pas sauvegardés
      </span>
      <button onClick={onDemoSignIn}
        aria-label="se connecter pour sauvegarder"
        style={{
          background: "transparent",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
          color: "color-mix(in oklch, var(--silk-gold) 75%, var(--bone))",
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
          padding: "3px 10px",
          cursor: "pointer",
          letterSpacing: "0.02em",
          transition: "all 280ms ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 8%, transparent)";
          e.currentTarget.style.color = "var(--silk-gold)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "color-mix(in oklch, var(--silk-gold) 75%, var(--bone))";
        }}>
        se connecter →
      </button>
    </div>
  ) : null;

  // Si bandeau visible, on push le contenu de 32px (variable selon safe-area).
  // Wrapper utilise un padding-top conditionnel.
  const demoBannerOffset = isDemoMode ? "calc(env(safe-area-inset-top, 0px) + 32px)" : "0px";

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      style={{ minHeight: "100vh", paddingTop: demoBannerOffset }}>
      {demoBanner}
      {dayNightIndicator}
      {/* 2026-04-27 P0.5 — SyncStatus badge top-right discret */}
      {window.SyncStatus && <window.SyncStatus />}
      {view}
      {/* 2026-04-27 P1.4 — Toast bottom-center auto-dismiss */}
      {toast && window.OptimisticToast && (
        <window.OptimisticToast
          key={toast.id}
          text={toast.text}
          tone={toast.tone}
          duration={toast.duration || 3000}
          onDismiss={() => setToast(null)}
        />
      )}
      {/* Bottom nav V1.2 — refonte 2026-04-26 : 3 onglets + FAB */}
      <BottomNavV12 screen={screen} go={go} />
      {tweaks && <TweaksUI screen={screen} go={go} />}

      {/* 2026-04-26 — Nightmare auto-proposal modal (Bible §17.3) */}
      {nightmareProposal && window.NightmareAutoProposalModal && (
        <window.NightmareAutoProposalModal
          count={nightmareProposal.count}
          onClose={() => {
            try { localStorage.setItem("dream:nightmare-proposal:dismissed-at", String(Date.now())); } catch {}
            setNightmareProposal(null);
          }}
          onActivate={() => {
            setNightmareProposal(null);
            go("nightmares");
          }}
        />
      )}

      {/* 2026-04-29 — Overlays plein écran (Yeshua) :
          ConstellationOverlay (auto-trigger nouvelle figure post-create)
          EchoPropheticOverlay (auto-trigger via window.dreamShowEchoOverlay
          depuis KairosDetail quand echo_with_entry_id détecté). */}
      {window.ConstellationOverlayRoot && <window.ConstellationOverlayRoot />}
      {window.EchoPropheticOverlayRoot && <window.EchoPropheticOverlayRoot />}
    </div>
  );
}

// ── BottomNav V3 (refonte 2026-04-28 — Cercle 1ère classe) ──
// 4 onglets visibles + FAB ORBE central qui ouvre Anima Chat (geste premier).
// Spec : Design §11.bis.20.x + brief T2 mission triple
//   [ ☾ Vie | ✷ Portrait | 🌀 ORBE central | ⭕ Cercle | ◐ Monde ]
//
// CHANGEMENT-CLÉ 2026-04-28 :
// - Cercle PROMU 1ère classe (était caché derrière Explorer).
// - Explorer reste accessible via long-press du FAB ORBE central
//   (et carte Explorer dans Le Monde + section Vie pour découvrabilité).
// - Le FAB ORBE court-tap = Anima chat ("dream-chat" — la présence personnelle,
//   geste premier post-Sprint A). Long-press = Explorer.
// - Capture reste accessible via /home (DreamHome) bouton primaire + via
//   Anima qui peut router "ouvrir capture".
//
// Adaptive JOUR/NUIT préservé. Hide-on-screen logic préservée.
function BottomNavV12({ screen, go }) {
  // Hide on contemplative/modal screens
  const HIDE_NAV_ON = [
    "capture", "onboarding", "reentry", "kairos", "onboarding-rituel",
    // 2026-04-26 — protocoles flow (Bible §3.11)
    "capture-choice", "protocole-selector", "protocole-sub-flow", "protocole-pre-sommeil",
  ];
  if (HIDE_NAV_ON.includes(screen)) return null;

  // Détection mode JOUR (palette + glyphe Vie)
  const isDayMode = screen === "home-jour" || screen === "journal-jour" || screen === "journal-section";
  const isVieActive = ["home", "home-jour", "home-nuit", "journal-jour", "journal-section", "journal", "kairos"].includes(screen);
  const isPortraitActive = ["portrait", "portrait-carte", "figure"].includes(screen);
  // Cercle onglet : actif sur tous les écrans cercle.
  const isCercleActive = [
    "cercle", "cercle-detail", "creer-cercle", "rejoindre", "partager-reve",
  ].includes(screen);
  // Anima/Monde onglet : "le monde" = Anima Mundi (constellation collective).
  const isAnimaActive = ["anima", "anima-meteo", "anima-annales", "anima-polyphonie", "meteo", "polyphonie", "annales"].includes(screen);
  // Orbe central actif quand on est en chat-anima (geste premier).
  const isOrbActive = ["dream-chat"].includes(screen);
  // Explorer reste accessible (long-press orbe OU card dans Le Monde) — pas
  // d'onglet dédié, mais on suit qu'on y est pour guidance visuelle.
  const isExplorerSubActive = [
    "explorer", "comment", "glossaire",
    "oracle-corps", "conte-miroir", "nightmares",
    "lucid-profile", "lucid-dashboard", "lucid-reality-checks", "lucid-dream-signs", "lucid-wbtb",
    "privacy", "notifs", "abonnement",
  ].includes(screen);

  const vieGlyph = isDayMode ? "☉" : "☾";

  // Helpers couleur (factor — palette adaptative JOUR/NUIT)
  const activeColor = isDayMode ? "var(--day-clay-warm, #C9B098)" : "var(--silk-gold)";
  const idleColor   = isDayMode ? "var(--day-ash-soft, #776E62)" : "var(--ash-light)";

  // Renderer onglet — réutilisé pour les 4 onglets (DRY)
  const renderTab = (it) => (
    <button key={it.id} onClick={it.onTap}
      aria-label={it.label}
      style={{
        background: "transparent", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        padding: "6px 4px",
        color: it.active ? activeColor : idleColor,
        opacity: it.active ? 1 : 0.65,
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
      }}>
      <span style={{ fontSize: 18, fontStyle: "italic" }}>{it.glyph}</span>
      <span style={{ fontSize: 10, fontStyle: "italic", letterSpacing: "0.02em" }}>{it.label}</span>
    </button>
  );

  // 4 onglets — l'ordre visuel : [ Vie ] [ Portrait ] (ORBE) [ Cercle ] [ Le Monde ]
  const leftItems = [
    { id: "home",     label: "vie",      glyph: vieGlyph, active: isVieActive,
      onTap: () => go(isDayMode ? "home-jour" : "home") },
    { id: "portrait", label: "portrait", glyph: "✷",      active: isPortraitActive,
      onTap: () => go("portrait") },
  ];
  const rightItems = [
    { id: "cercle",   label: "cercle",   glyph: "○",      active: isCercleActive,
      onTap: () => go("cercle") },
    { id: "anima",    label: "le monde", glyph: "◐",      active: isAnimaActive,
      onTap: () => go("anima") },
  ];

  // Long-press handler pour l'ORBE → Explorer
  // (touch & mouse). 600ms threshold. Court-tap = dream-chat.
  const longPressTimerRef = uR(null);
  const longPressFiredRef = uR(false);
  const ORB_LONGPRESS_MS = 600;
  const onOrbDown = (e) => {
    longPressFiredRef.current = false;
    longPressTimerRef.current = setTimeout(() => {
      longPressFiredRef.current = true;
      try {
        if (window.navigator?.vibrate) window.navigator.vibrate(15);
      } catch {}
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

  return (
    <nav style={{
      position: "fixed",
      bottom: 0, left: 0, right: 0,
      zIndex: 50,
      background: isDayMode
        ? "color-mix(in oklch, var(--day-paper, #EBE2D2) 92%, transparent)"
        : "color-mix(in oklch, var(--night-floor) 92%, transparent)",
      borderTop: isDayMode
        ? "1px solid color-mix(in oklch, var(--day-clay-warm, #C9B098) 25%, transparent)"
        : "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
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
      transition: "background 920ms ease, border-color 920ms ease",
    }}>
      {/* Onglets gauche : Vie, Portrait */}
      {leftItems.map(renderTab)}

      {/* ORBE central — geste premier (Sprint A pivot) :
          court-tap → Anima chat (dream-chat) — la présence onirique nommable.
          long-press 600ms → Explorer hub (lucid, oracle, contes, nightmares,
          settings). Vibrate 15ms feedback haptique sur long-press fire. */}
      <button
        onClick={onOrbClick}
        onMouseDown={onOrbDown} onMouseUp={onOrbUp} onMouseLeave={onOrbLeave}
        onTouchStart={onOrbDown} onTouchEnd={onOrbUp} onTouchCancel={onOrbLeave}
        aria-label="parler avec anima · long-press pour explorer"
        title="parler avec anima · long-press pour explorer"
        style={{
          width: 56, height: 56, borderRadius: "50%",
          background: isOrbActive
            ? "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--silk-gold) 38%, var(--night-warm)), color-mix(in oklch, var(--ember) 22%, var(--night-floor)))"
            : "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--ember) 28%, var(--night-warm)), color-mix(in oklch, var(--silk-gold) 18%, var(--night-floor)))",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
          cursor: "pointer", display: "grid", placeItems: "center",
          color: "var(--bone)", fontSize: 22,
          boxShadow: isOrbActive
            ? "0 0 32px color-mix(in oklch, var(--silk-gold) 32%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 30%, transparent)"
            : "0 0 24px color-mix(in oklch, var(--silk-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 20%, transparent)",
          transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
          marginTop: -16,
          fontStyle: "italic",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}>
        ☾
      </button>

      {/* Onglets droite : Cercle, Le Monde */}
      {rightItems.map(renderTab)}
    </nav>
  );
}

// ── Top-level App = AuthGate(AppShell) ──────────────────────
// 2026-04-29 (Yeshua, FIX P0 animations) — HaloRespire silk monté en
// background fixed global, derrière TOUT (zIndex 0, pointer-events none).
// Visible sur tous les screens — Tim doit sentir la respiration constante
// de l'app, pas un noir mort. Opacity 0.4 = lisible mais pas envahissant.
// Respecte prefers-reduced-motion (CSS gate dans styles.css).
function App() {
  const Gate = window.AuthGate || (({ children }) => children);
  const Halo = window.HaloRespire;
  return (
    <Gate>
      {Halo && (
        <div aria-hidden="true" style={{
          position: "fixed", inset: "-10%",
          pointerEvents: "none", zIndex: 0,
          opacity: 0.4,
        }}>
          <Halo kind="silk" />
        </div>
      )}
      <AppShell />
    </Gate>
  );
}

const screenGroups = [
  { label: "matière", items: [
    ["home", "home — journal substrat"],
    ["capture", "capture — somatic gate"],
    ["journal", "journal de vie"],
    ["kairos", "détail kairos"],
  ]},
  { label: "portrait", items: [
    ["portrait", "portrait — constellation"],
    ["figure", "détail figure"],
  ]},
  { label: "cercle", items: [
    ["cercle", "cercle — liste"],
    ["cercle-detail", "cercle — détail"],
    ["creer-cercle", "créer un cercle"],
    ["rejoindre", "rejoindre cercle"],
    ["partager-reve", "partager un rêve (legacy)"],
  ]},
  { label: "anima mundi (4 chambres)", items: [
    ["anima", "1 · la voûte (hub)"],
    ["anima-meteo", "2 · le temps qu'il fait dans la nuit"],
    ["anima-annales", "3 · tenu ensemble"],
    ["anima-polyphonie", "4 · polyphonie de la lune"],
    ["offre-kairos", "offre au kairos (legacy)"],
  ]},
  { label: "soma", items: [
    ["oracle-corps", "oracle du corps"],
    ["conte-miroir", "conte-miroir"],
    ["reentry", "réentrée onirique"],
    ["nightmares", "sanctuaire cauchemars & deuil"],
  ]},
  { label: "protocoles · quick vs accompagné", items: [
    ["capture-choice", "écran de choix ⚡/🌀"],
    ["protocole-selector", "sélection des 9 protocoles"],
    ["protocole-pre-sommeil", "🌙 pré-sommeil (raccourci)"],
  ]},
  { label: "narratrice", items: [
    ["chat", "chat narratrice"],
  ]},
  { label: "v1.2 amplifié", items: [
    ["bigdream-signal", "big dream signal"],
  ]},
  { label: "entrée & réglages", items: [
    ["onboarding", "onboarding p-zéro"],
    ["privacy", "paramètres · privacy"],
    ["notifs", "paramètres · notifs"],
    ["abonnement", "paramètres · abonnement"],
  ]},
];

function TweaksUI({ screen, go }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 300, maxHeight: "calc(100vh - 48px)", overflowY: "auto",
      background: "var(--night-warm)",
      border: "1px solid var(--ash-mid)", padding: "var(--s-4)",
      fontFamily: "var(--sans)", fontSize: 13, color: "var(--bone)",
    }}>
      <div className="row mb-m" style={{ justifyContent: "space-between" }}>
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16 }}>Tweaks</div>
        <button className="btn-text" onClick={() => {
          window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
        }}>×</button>
      </div>
      <div className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>écran</div>
      <div className="stack" style={{ gap: 2 }}>
        {screenGroups.map(g => (
          <div key={g.label} style={{ marginTop: 10 }}>
            <div className="meta op-70" style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 4 }}>
              {g.label.toUpperCase()}
            </div>
            {g.items.map(([k, l]) => (
              <button key={k}
                onClick={() => go(k)}
                style={{
                  display: "block", width: "100%",
                  textAlign: "left", padding: "5px 10px",
                  background: screen === k ? "color-mix(in oklch, var(--bone) 6%, transparent)" : "transparent",
                  border: "1px solid " + (screen === k ? "var(--bone)" : "var(--ash-deep)"),
                  color: screen === k ? "var(--bone)" : "var(--ash-light)",
                  fontSize: 12.5, fontFamily: "var(--serif)", fontStyle: "italic", cursor: "pointer",
                  marginBottom: 2,
                }}>
                {l}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Auth status footer */}
      <div className="mt-l" style={{
        marginTop: 16, paddingTop: 12,
        borderTop: "1px solid var(--ash-deep)",
        fontSize: 11, fontFamily: "var(--mono)",
        color: "var(--ash-light)",
      }}>
        {window.DreamUser
          ? <>
              auth: {window.DreamUser.email}<br />
              <button className="btn-text" style={{ fontSize: 11, marginTop: 4 }}
                onClick={async () => { await window.DreamAuth.signOut(); location.reload(); }}>
                déconnexion
              </button>
            </>
          : window.DreamAuth?.noAuth
            ? "auth: désactivée (seed mode)"
            : "auth: non connecté"}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
