/* global React */
const { useState: useS2, useEffect: useE2, useRef: useR2, useMemo: useM2 } = React;

// ── Forest 3 Angles Skeleton ────────────────────────────────
// 2026-04-27 — Sprint P0.5 (Design §11.bis.19)
// 3 cards verticales side-by-side avec shimmer matter (paper/stone/silk).
// Halo respire au-dessus + message rotating "la forêt convoque ses voix…".
const ForestThreeAnglesSkeleton = ({ matterColor }) => {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const messages = [
    "la forêt convoque ses voix…",
    "trois angles cherchent ton kairos…",
    "écouter ce qui te touche…",
  ];
  const message = useRotating ? useRotating(messages, 2400) : messages[0];

  if (!Shim || !Halo) {
    return (
      <div className="card text-center" style={{ padding: "var(--s-6)", opacity: 0.7 }}>
        <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {message}
        </div>
      </div>
    );
  }

  const matters = ["paper", "stone", "silk"];

  return (
    <div className="dream-skeleton-fade-in stack gap-m">
      <div style={{ display: "flex", justifyContent: "center", padding: "var(--s-3) 0" }}>
        <Halo size={28} message={message} dark={true} />
      </div>
      {matters.map(m => {
        const color = (matterColor && matterColor[m]) || "var(--paper-warm)";
        return (
          <div key={m} className="card" style={{
            padding: "var(--s-5)",
            borderColor: color,
            background: "color-mix(in oklch, " + color + " 4%, transparent)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {/* Citation simulée — 3 lignes */}
            <Shim lines={3} height={14} gap={10} dark={true} lastLineWidth="68%" />
            {/* Angle simulé — 2 lignes plus opaques */}
            <div style={{ marginTop: 8 }}>
              <Shim lines={2} height={11} gap={9} dark={true} lastLineWidth="52%" />
            </div>
            {/* Source mono uppercase */}
            <div style={{ marginTop: 6, opacity: 0.6 }}>
              <Shim lines={1} height={9} dark={true} width="38%" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Détail Kairos ───────────────────────────────────────────
// Refonte 2026-04-25 — Bible §2.2 P-Inversion Oraculaire + Design §7.3
//   4 actions discrètes en bas (jamais imposées) :
//     1. que vois-tu ?      → USER_FIRST_READING (sheet plein écran fond night-warm + paper)
//     2. demander à la forêt → 3 angles polyphoniques (paper/stone/silk) — APRÈS user_first
//     3. échos depuis le passé → kairos passés qui résonnent (sheet)
//     4. brûler              → BURN_RITUAL ~30s confirmation visuelle
//   Après chaque lecture : FELT_SHIFT_GATE (6 zones corps) + AHA_CAPTURE (3 niveaux + note)
const KairosDetail = ({ go, entry, allEntries }) => {
  // Sheet courante : null | 'user_first' | 'forest' | 'echoes' | 'burn'
  const [sheet, setSheet] = useS2(null);
  const [userReading, setUserReading] = useS2("");
  const [readingSubmitted, setReadingSubmitted] = useS2(false);

  // Forest reading state
  const [forestAngles, setForestAngles] = useS2(null);
  const [forestFraming, setForestFraming] = useS2("");
  const [forestLoading, setForestLoading] = useS2(false);
  const [forestError, setForestError] = useS2("");

  // FELT_SHIFT_GATE + AHA_CAPTURE state — partagé par les sheets de lecture
  // currentReading : { kind: 'forest'|'echo'|'tale'|'user_first', snapshot?: any }
  const [currentReading, setCurrentReading] = useS2(null);
  const [feltShift, setFeltShift] = useS2(null);
  const [ahaLevel, setAhaLevel] = useS2(null);
  const [ahaNote, setAhaNote] = useS2("");
  const [feedbackPosted, setFeedbackPosted] = useS2(false);

  // Burn ritual countdown
  const [burnCountdown, setBurnCountdown] = useS2(0);
  const burnTimerRef = useR2(null);

  // Live data from API : full kairos detail + echoes
  const [fullKairos, setFullKairos] = useS2(entry);
  const [apiEchoes, setApiEchoes] = useS2([]);
  const [propheties, setPropheties] = useS2([]);
  const [loadingDetail, setLoadingDetail] = useS2(false);

  // F.2 — Modal Sanctuaire auto-déclenchée sur cauchemar (§11.bis.20.13)
  // Conditions : entry.is_nightmare === true OU valence < -0.6 OU is_grief_related
  // Une seule fois par kairos (localStorage flag pour ne pas spam)
  const [showSanctuaireModal, setShowSanctuaireModal] = useS2(false);

  useE2(() => {
    if (!entry?.id) return;
    let cancelled = false;
    setLoadingDetail(true);
    Promise.all([
      window.DreamAPI.getKairos(entry.id).catch(() => null),
      window.DreamAPI.getEchoesForKairos(entry.id, { limit: 6 }).catch(() => ({ echoes: [] })),
      window.DreamAPI.getProphecyForKairos(entry.id).catch(() => ({ propheties: [] })),
    ]).then(([kData, echoData, prophData]) => {
      if (cancelled) return;
      if (kData?.kairos) {
        const merged = { ...entry, ...kData.kairos };
        setFullKairos(merged);
        if (kData.kairos.user_first_reading_submitted) setReadingSubmitted(true);

        // F.2 — auto-trigger NightmareDepositChoiceModal si condition + pas déjà vue
        try {
          const valence = typeof merged.valence === "number" ? merged.valence : null;
          const isNightmareLike =
            merged.is_nightmare === true ||
            merged.is_grief_related === true ||
            (valence !== null && valence < -0.6);
          if (isNightmareLike && window.NightmareDepositChoiceModal) {
            const seenKey = "dream:sanctuaire:seen:" + merged.id;
            const alreadySeen = (() => {
              try { return localStorage.getItem(seenKey) === "1"; } catch { return false; }
            })();
            if (!alreadySeen) {
              // Petit délai pour laisser le détail s'animer en premier (~600ms)
              setTimeout(() => {
                if (!cancelled) setShowSanctuaireModal(true);
              }, 600);
            }
          }
        } catch (err) {
          console.warn("[KairosDetail] sanctuaire auto-check failed:", err && err.message);
        }
      }
      setApiEchoes(echoData?.echoes || []);
      const props = prophData?.propheties || [];
      setPropheties(props);
      setLoadingDetail(false);
      if (props.length > 0) {
        try { window.wowRegistry?.fire?.("premier-echo-prophetique"); } catch {}
      }
    });
    return () => { cancelled = true; };
  }, [entry?.id]);

  // Compose echoes list : prefer live API, fall back to allEntries siblings
  const echoes = (apiEchoes.length > 0)
    ? apiEchoes.slice(0, 6).map(e => ({
        id: e.other_id || e.id,
        when: window.DreamAPI._relativeWhen ? window.DreamAPI._relativeWhen(e.created_at) : "",
        type: window.DreamAPI._mapTypeFromBackend
          ? window.DreamAPI._mapTypeFromBackend(e.kairos_type || "reve")
          : "dream_night",
        text: e.preview || "",
        prophetic: false,
      }))
    : (allEntries || []).filter(e => e.id !== entry.id).slice(0, 6).map(e => ({ ...e, prophetic: false }));

  const propheticEchoes = (propheties || []).slice(0, 3).map(p => ({
    id: p.past_id,
    when: window.DreamAPI._relativeWhen ? window.DreamAPI._relativeWhen(p.created_at) : "",
    type: "dream_night",
    text: p.preview || "",
    prophetic: true,
  }));

  const allEchoes = [...propheticEchoes, ...echoes];

  // Reset feedback state when opening a new reading
  const openReadingFeedback = (kind, snapshot = null) => {
    setCurrentReading({ kind, snapshot });
    setFeltShift(null);
    setAhaLevel(null);
    setAhaNote("");
    setFeedbackPosted(false);
  };

  // ── USER_FIRST_READING ──
  const submitUserReading = async () => {
    if (userReading.trim().length < 4) return;
    setReadingSubmitted(true);
    if (entry?.id) {
      await window.DreamAPI.updateKairos(entry.id, { user_first_reading_submitted: true }).catch(() => {});
      if (userReading.trim()) {
        await window.DreamAPI.annotateKairos(entry.id, userReading.trim()).catch(() => {});
      }
    }
    openReadingFeedback("user_first");
    setSheet(null);
  };

  // ── FOREST_READING ──
  const askForest = async () => {
    if (!entry?.id) return;
    setSheet("forest");
    if (forestAngles) return; // déjà chargé
    setForestLoading(true);
    setForestError("");
    try {
      const res = await window.DreamAPI.forestReading(entry.id, {
        user_first_reading: userReading.trim() || null,
      });
      setForestAngles(res?.angles || []);
      setForestFraming(res?.framing || "");
    } catch (e) {
      setForestError("la forêt n'a pas répondu. reviens tout à l'heure.");
    } finally {
      setForestLoading(false);
    }
  };

  // After viewing the 3 angles, prepare FELT_SHIFT + AHA
  const acknowledgeForest = () => {
    openReadingFeedback("forest", forestAngles);
  };

  // ── BURN ritual : 30s countdown ──
  const startBurnCountdown = () => {
    setBurnCountdown(30);
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
    burnTimerRef.current = setInterval(() => {
      setBurnCountdown(c => {
        if (c <= 1) {
          clearInterval(burnTimerRef.current);
          burnTimerRef.current = null;
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const cancelBurn = () => {
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
    burnTimerRef.current = null;
    setBurnCountdown(0);
    setSheet(null);
  };

  const confirmBurn = async () => {
    if (burnCountdown > 0) return; // doit attendre le countdown
    if (!entry?.id) return;
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
    burnTimerRef.current = null;
    await window.DreamAPI.deleteKairos(entry.id).catch(() => {});
    if (window.DreamRefreshEntries) window.DreamRefreshEntries();
    go("journal");
  };

  useE2(() => () => {
    if (burnTimerRef.current) clearInterval(burnTimerRef.current);
  }, []);

  // ── FELT_SHIFT + AHA submit ──
  const sendFeedback = async () => {
    if (!entry?.id || !currentReading) return;
    setFeedbackPosted(true);
    await window.DreamAPI.submitAhaFeedback(entry.id, {
      reading_kind: currentReading.kind,
      felt_shift_location: feltShift || undefined,
      aha_level: ahaLevel || undefined,
      aha_note: ahaNote.trim() || undefined,
      forest_reading_angles: currentReading.kind === "forest" ? currentReading.snapshot : undefined,
    }).catch(() => {});
    setTimeout(() => setCurrentReading(null), 1400);
  };

  const display = fullKairos || entry;

  // ── Matter color helper for FOREST_READING cards ──
  const matterColor = {
    paper: "var(--paper-warm)",
    stone: "var(--stone-cool)",
    silk: "var(--silk-gold)",
  };

  // 2026-04-29 — Détection écho prophétique pour overlay (Yeshua).
  // Trigger window.dreamShowEchoOverlay UNE FOIS par kairos quand
  // propheties[0] arrive (echo_with_entry_id). localStorage flag pour
  // ne pas spam si user revient sur le détail.
  useE2(() => {
    if (!entry?.id || propheties.length === 0) return;
    const seenKey = "dream:echo-overlay:seen:" + entry.id;
    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem(seenKey) === "1"; } catch {}
    if (alreadySeen) return;
    const p = propheties[0];
    const presentText = (display.text || display.raw_text || "").trim();
    const pastText = (p.preview || "").trim();
    if (!presentText || !pastText) return;
    // daysAgo : compute depuis p.created_at
    let daysAgo = 0;
    try {
      const t = new Date(p.created_at).getTime();
      if (t) daysAgo = Math.max(0, Math.floor((Date.now() - t) / (24 * 3600 * 1000)));
    } catch {}
    // Délai léger pour laisser KairosDetail se rendre
    const tmr = setTimeout(() => {
      try {
        if (window.dreamShowEchoOverlay) {
          window.dreamShowEchoOverlay({
            presentText, pastText, daysAgo,
            onDismiss: () => {
              try { localStorage.setItem(seenKey, "1"); } catch {}
            },
          });
          // Toujours marquer vu après display (que user dismiss ou pas)
          try { localStorage.setItem(seenKey, "1"); } catch {}
        }
      } catch {}
    }, 900);
    return () => clearTimeout(tmr);
  }, [entry?.id, propheties.length]);

  // Big Dream condition — utilise numinosity_score > 0.7 ou bigDream/deep
  const isBigDreamLike =
    (display.numinosity_score && display.numinosity_score > 0.7) ||
    display.bigDream === true ||
    display.synthesis_tier === "deep";

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)", position: "relative", overflow: "hidden" }}>
      {/* 2026-04-29 — Background Surface linen subtil (Yeshua, opacity 0.4) */}
      {window.Surface && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.4, zIndex: 0,
          pointerEvents: "none",
        }}>
          <window.Surface matter="linen" motion={true}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
      )}

      {/* 2026-04-29 — HaloRespire bigdream derrière le titre (Yeshua) si numinosity */}
      {isBigDreamLike && window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: "absolute", top: 80, left: "50%",
          transform: "translateX(-50%)",
          width: "min(540px, 92vw)", height: 320,
          opacity: 0.55, pointerEvents: "none", zIndex: 0,
        }}>
          <window.HaloRespire kind="bigdream" />
        </div>
      )}

      <TopNav showBack onBack={() => go("journal")} label="" />
      <div className="frame" style={{ position: "relative", paddingBottom: "calc(var(--s-7) + 80px)", zIndex: 2 }}>
        {(display.bigDream || display.synthesis_tier === "deep") && <div className="halo-big" />}

        <div className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {typeLabel(display.type)}, déposé {display.when}
          {loadingDetail && <span className="op-50" style={{ marginLeft: 12 }}>· enrichissement en cours…</span>}
        </div>

        <p className="h3-lecture" style={{
          fontSize: 25, lineHeight: 1.55, maxWidth: 580, textWrap: "pretty",
          marginBottom: "var(--s-6)"
        }}>
          {display.text || display.raw_text}
        </p>

        {/* Synthèse tissée si disponible — 2026-04-27 P0.5 :
            placeholder skeleton si null ET kairos < 90s (synthesis pending). */}
        {display.synthesis_text ? (
          <div className="card mb-l" style={{
            padding: "var(--s-5)",
            background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
            borderColor: "var(--silk-gold)",
          }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)" }}>
              SYNTHÈSE TISSÉE
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.7, textWrap: "pretty", whiteSpace: "pre-wrap" }}>
              {display.synthesis_text}
            </p>
            {display.synthesis_voices?.length > 0 && (
              <div className="meta mt-m op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13 }}>
                voix · {display.synthesis_voices.join(" · ")}
              </div>
            )}
          </div>
        ) : (() => {
          // Pending synthesis : si created_at < 90s, on affiche placeholder
          const createdAtIso = display.created_at || display._raw?.created_at;
          if (!createdAtIso) return null;
          const ageSec = (Date.now() - new Date(createdAtIso).getTime()) / 1000;
          if (ageSec > 90 || ageSec < 0) return null;
          const Halo = window.LoadingHalo;
          return (
            <div className="card mb-l dream-skeleton-fade-in" style={{
              padding: "var(--s-5)",
              background: "color-mix(in oklch, var(--silk-gold) 3%, transparent)",
              borderColor: "color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
              borderStyle: "dashed",
            }}>
              <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)", opacity: 0.7 }}>
                SYNTHÈSE TISSÉE · EN CHEMIN
              </div>
              <p style={{
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
                lineHeight: 1.65, textWrap: "pretty", color: "var(--ash-light)",
                margin: 0,
              }}>
                l'app tisse les échos pour ce kairos. reviens dans une minute…
              </p>
              {Halo && (
                <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-start" }}>
                  <Halo size={20} message={null} dark={true} />
                </div>
              )}
            </div>
          );
        })()}

        {/* Motifs / archétypes détectés */}
        {(display.motif_tags?.length > 0 || display.archetypal_tags?.length > 0) && (
          <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
            {(display.motif_tags || []).slice(0, 6).map(t => (
              <span key={"m-" + t} className="chip" style={{ pointerEvents: "none", opacity: 0.85 }}>
                · {t}
              </span>
            ))}
            {(display.archetypal_tags || []).slice(0, 4).map(t => (
              <span key={"a-" + t} className="chip" style={{ pointerEvents: "none", opacity: 0.85, borderColor: "var(--silk-gold)", color: "var(--silk-gold)" }}>
                ◇ {t}
              </span>
            ))}
          </div>
        )}

        {/* Lecture user déjà offerte → affichage sobre */}
        {readingSubmitted && userReading.trim() && (
          <div className="card mb-l" style={{
            padding: "var(--s-4)",
            background: "color-mix(in oklch, var(--paper-warm) 4%, transparent)",
            borderColor: "color-mix(in oklch, var(--paper-warm) 30%, var(--ash-deep))",
          }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--paper-warm)" }}>
              TA LECTURE
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic", lineHeight: 1.6, textWrap: "pretty", margin: 0 }}>
              {userReading}
            </p>
          </div>
        )}

        {!readingSubmitted && (
          <p className="meta op-70 mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14, maxWidth: 520 }}>
            la forêt parle après toi. offre d'abord ta lecture.
          </p>
        )}

        {/* FELT_SHIFT_GATE + AHA_CAPTURE inline après une lecture */}
        {currentReading && !feedbackPosted && (
          <div className="mt-xl card" style={{
            padding: "var(--s-5)",
            borderColor: "var(--clay-earth)",
            background: "color-mix(in oklch, var(--clay-earth) 4%, transparent)",
          }}>
            <FeltShiftAhaInline
              feltShift={feltShift}
              setFeltShift={setFeltShift}
              ahaLevel={ahaLevel}
              setAhaLevel={setAhaLevel}
              ahaNote={ahaNote}
              setAhaNote={setAhaNote}
              onSend={sendFeedback}
              onSkip={() => setCurrentReading(null)}
            />
          </div>
        )}

        {currentReading && feedbackPosted && (
          <div className="mt-xl text-center" style={{ padding: "var(--s-4)", borderTop: "1px solid var(--ash-deep)" }}>
            <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
              ton aha est posé. il reste avec toi.
            </div>
          </div>
        )}

        {window.ExitToHuman && <window.ExitToHuman />}
      </div>

      {/* ── 4 ACTIONS DISCRÈTES EN BAS ──────────────────────── */}
      <div style={{
        position: "sticky", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(to top, var(--night-warm) 70%, transparent)",
        padding: "var(--s-5) var(--s-4) var(--s-4)",
        zIndex: 10,
      }}>
        <div className="row gap-s" style={{ flexWrap: "wrap", justifyContent: "center", maxWidth: 640, margin: "0 auto" }}>
          <button className="chip" onClick={() => setSheet("user_first")}>
            <TypeGlyph type="note_vie" size={10} /> que vois-tu ?
          </button>
          <button className="chip"
            disabled={!readingSubmitted}
            onClick={readingSubmitted ? askForest : null}
            style={{ opacity: readingSubmitted ? 1 : 0.4, cursor: readingSubmitted ? "pointer" : "not-allowed" }}
            title={readingSubmitted ? "" : "offre d'abord ta lecture"}>
            demander à la forêt
          </button>
          <button className="chip" onClick={() => setSheet("echoes")}>
            échos depuis le passé
          </button>
          <button className="chip" onClick={() => { setBurnCountdown(0); setSheet("burn"); }}
            style={{ color: "var(--ash-light)" }}>
            brûler
          </button>
        </div>

        {/* 2026-04-29 — Big Dream CTA : tenir ce rêve sur 7 jours
            Visible uniquement si numinosity_score > 0.85 OU big_dream/synthesis_tier='deep' */}
        {(() => {
          const shouldShowBigDreamCTA =
            (display.numinosity_score && display.numinosity_score > 0.85) ||
            display.bigDream === true ||
            display.synthesis_tier === "deep" ||
            display.synthesis_tier === "big_dream";
          if (!shouldShowBigDreamCTA) return null;
          return (
            <div style={{
              maxWidth: 640, margin: "var(--s-3) auto 0",
              display: "flex", justifyContent: "center",
            }}>
              <button
                className="chip"
                onClick={() => go("bigdream-workflow", { kairos_id: display.id })}
                style={{
                  borderColor: "var(--silk-gold)",
                  color: "var(--silk-gold)",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 14,
                }}
              >
                ✦ tenir ce rêve sur 7 jours
              </button>
            </div>
          );
        })()}
      </div>

      {/* ── SHEET : USER_FIRST_READING ─────────────────────── */}
      {sheet === "user_first" && (
        <Sheet onClose={() => setSheet(null)} matter="paper">
          <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--paper-warm)" }}>
            TA LECTURE — EN PREMIER
          </div>
          <h3 className="h3-lecture mb-s" style={{ fontSize: 26 }}>
            Ce que tu vois là, ce qui te touche, ce qui te résiste.
          </h3>
          <p className="ash-italic mb-l" style={{ fontSize: 15, textWrap: "pretty", maxWidth: 540 }}>
            La forêt arrive après. Tes mots d'abord — même maladroits, même fragmentaires.
          </p>
          <textarea
            rows={10}
            placeholder="ce que ce kairos pose dans toi…"
            style={{
              width: "100%", minHeight: 220,
              background: "transparent",
              border: "1px solid color-mix(in oklch, var(--paper-warm) 35%, var(--ash-deep))",
              padding: "var(--s-4)",
              color: "var(--bone)",
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 18, lineHeight: 1.6,
              resize: "vertical", outline: "none",
            }}
            value={userReading}
            onChange={e => setUserReading(e.target.value)} />
          <div className="row gap-s mt-l" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <button className="btn-text" onClick={() => setSheet(null)}>plus tard</button>
            <button className="btn-ghost" onClick={submitUserReading}
              disabled={userReading.trim().length < 4}
              style={{
                opacity: userReading.trim().length < 4 ? 0.4 : 1,
                borderColor: "var(--paper-warm)", color: "var(--paper-warm)",
              }}>
              déposer ma lecture
            </button>
          </div>
        </Sheet>
      )}

      {/* ── SHEET : FOREST_READING (3 angles) ────────────────── */}
      {sheet === "forest" && (
        <Sheet onClose={() => setSheet(null)}>
          <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)" }}>
            FORÊT — 3 ANGLES
          </div>
          <p className="ash-italic mb-l" style={{ fontSize: 15, textWrap: "pretty", maxWidth: 580 }}>
            {forestFraming || "ces voix ne disent pas ton rêve — elles le touchent depuis leur angle. ton corps tranche."}
          </p>

          {forestLoading && <ForestThreeAnglesSkeleton matterColor={matterColor} />}

          {forestError && !forestLoading && (
            <div className="card" style={{ padding: "var(--s-4)", borderColor: "var(--ember-live)" }}>
              <p className="ash-italic" style={{ fontSize: 15 }}>{forestError}</p>
              <button className="btn-text mt-s" onClick={() => { setForestAngles(null); askForest(); }}>réessayer</button>
            </div>
          )}

          {!forestLoading && forestAngles && forestAngles.length > 0 && (
            <div className="stack gap-m">
              {forestAngles.map((a, i) => {
                const color = matterColor[a.matter] || "var(--paper-warm)";
                return (
                  <div key={i} className="card" style={{
                    padding: "var(--s-5)",
                    borderColor: color,
                    background: "color-mix(in oklch, " + color + " 4%, transparent)",
                  }}>
                    {a.citation && (
                      <p style={{
                        fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.5,
                        fontStyle: "italic", margin: 0, textWrap: "pretty",
                        color: "var(--bone)",
                      }}>
                        « {a.citation} »
                      </p>
                    )}
                    {a.angle && (
                      <p style={{
                        fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.6,
                        marginTop: a.citation ? "var(--s-3)" : 0, textWrap: "pretty",
                        opacity: 0.9,
                      }}>
                        {a.angle}
                      </p>
                    )}
                    <div className="meta mt-m" style={{
                      fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em",
                      color: color, opacity: 0.85,
                    }}>
                      — {a.source}
                    </div>
                  </div>
                );
              })}

              <div className="row gap-s mt-l" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <button className="btn-text" onClick={() => setSheet(null)}>refermer</button>
                <button className="btn-ghost" onClick={() => { setSheet(null); acknowledgeForest(); }}>
                  ce qui a touché
                </button>
              </div>
            </div>
          )}
        </Sheet>
      )}

      {/* ── SHEET : ÉCHOS ───────────────────────────────────── */}
      {sheet === "echoes" && (
        <Sheet onClose={() => setSheet(null)}>
          <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ember-live)" }}>
            ÉCHOS DEPUIS LE PASSÉ
          </div>
          <p className="ash-italic mb-l" style={{ fontSize: 15, textWrap: "pretty", maxWidth: 540 }}>
            kairos passés qui résonnent avec celui-ci. {propheticEchoes.length > 0 ? "ceux marqués prophétique se sont allumés rétroactivement." : "signal probabiliste — pas certitude."}
          </p>

          {allEchoes.length === 0 ? (
            <div className="card text-center" style={{ padding: "var(--s-5)", opacity: 0.6 }}>
              <p className="ash-italic">ton sol est encore peu peuplé. reviens dans quelques semaines.</p>
            </div>
          ) : (
            <div className="stack gap-s">
              {allEchoes.map(e => (
                <div key={(e.prophetic ? "p-" : "e-") + e.id}
                  className="card"
                  style={{
                    padding: "var(--s-4)", cursor: "pointer",
                    borderColor: e.prophetic ? "var(--ember-live)" : undefined,
                    background: e.prophetic ? "color-mix(in oklch, var(--ember-live) 3%, transparent)" : undefined,
                  }}
                  onClick={() => { setSheet(null); go("kairos", e.id); }}>
                  <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
                    <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                      {e.when} — {typeLabel(e.type)}
                    </div>
                    {e.prophetic && (
                      <span className="meta" style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ember-live)", letterSpacing: "0.08em" }}>
                        ◊ PROPHÉTIQUE
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontFamily: "var(--serif)", fontSize: 16, opacity: 0.85,
                    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                    margin: "var(--s-3) 0 0",
                  }}>
                    {e.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="row mt-l" style={{ justifyContent: "space-between" }}>
            <button className="btn-text" onClick={() => setSheet(null)}>refermer</button>
            {allEchoes.length > 0 && (
              <button className="btn-ghost" onClick={() => { setSheet(null); openReadingFeedback("echo"); }}>
                ce qui a touché
              </button>
            )}
          </div>
        </Sheet>
      )}

      {/* ── SHEET : BURN RITUAL (30s countdown) ──────────────── */}
      {sheet === "burn" && (
        <Sheet onClose={cancelBurn}>
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle at center, color-mix(in oklch, var(--ember-live) 14%, transparent), transparent 65%)",
            pointerEvents: "none",
          }} />
          <div style={{ position: "relative" }}>
            <div className="meta mb-s text-center" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ember-live)" }}>
              GESTE RITUEL — DISSOLUTION
            </div>
            <h3 className="h3-lecture text-center mb-s" style={{ fontStyle: "italic", fontSize: 24 }}>
              ce kairos sera dissous.
            </h3>
            <p className="ash-italic text-center mb-l" style={{ fontSize: 15, maxWidth: 480, margin: "0 auto var(--s-5)" }}>
              suppression cryptographique. pas de retour. pas d'undo.
              {' '}laisse passer trente secondes — si ton corps dit encore oui, alors confirme.
            </p>

            {/* Countdown circular */}
            <div className="text-center mb-l">
              {burnCountdown > 0 ? (
                <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
                  <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--ash-deep)" strokeWidth="2" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="var(--ember-live)" strokeWidth="2"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - burnCountdown / 30)}
                      style={{ transition: "stroke-dashoffset 1s linear" }} />
                  </svg>
                  <div style={{
                    position: "absolute", inset: 0, display: "grid", placeItems: "center",
                    fontFamily: "var(--mono)", fontSize: 28, color: "var(--ember-live)",
                  }}>
                    {burnCountdown}
                  </div>
                </div>
              ) : (
                <div style={{
                  width: 120, height: 120, margin: "0 auto", display: "grid", placeItems: "center",
                  border: "1px solid var(--ember-live)",
                  borderRadius: "50%",
                  color: "var(--ember-live)",
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                }}>
                  prêt
                </div>
              )}
            </div>

            <div className="row gap-s" style={{ justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-text" onClick={cancelBurn}>annuler · garder</button>
              {burnCountdown === 0 && (
                <button className="btn-ghost"
                  onClick={confirmBurn}
                  style={{
                    borderColor: "color-mix(in oklch, var(--ember-live) 60%, var(--ash-mid))",
                    color: "var(--ember-live)",
                  }}>
                  confirmer la dissolution
                </button>
              )}
              {burnCountdown === 0 && burnTimerRef.current === null && (
                <button className="btn-ghost"
                  onClick={startBurnCountdown}
                  style={{
                    borderColor: "var(--ash-mid)", color: "var(--ash-light)",
                    display: burnCountdown === 0 ? "inline-flex" : "none",
                  }}>
                  ▷ démarrer trente secondes
                </button>
              )}
            </div>
          </div>
        </Sheet>
      )}

      {window.FeedbackFloat && <window.FeedbackFloat />}

      {/* F.2 — Modal Sanctuaire auto-déclenchée (§11.bis.20.13) */}
      {showSanctuaireModal && window.NightmareDepositChoiceModal && (
        <window.NightmareDepositChoiceModal
          entry={fullKairos}
          isFrozen={false}
          onClose={() => {
            setShowSanctuaireModal(false);
            try { localStorage.setItem("dream:sanctuaire:seen:" + (fullKairos?.id || entry?.id), "1"); } catch {}
          }}
          onGoSanctuaire={() => {
            try { localStorage.setItem("dream:sanctuaire:seen:" + (fullKairos?.id || entry?.id), "1"); } catch {}
            setShowSanctuaireModal(false);
            go("nightmares");
          }}
          onExitToHuman={() => {
            try { localStorage.setItem("dream:sanctuaire:seen:" + (fullKairos?.id || entry?.id), "1"); } catch {}
            setShowSanctuaireModal(false);
            go("nightmares");
          }}
        />
      )}
    </div>
  );
};

// ── FELT_SHIFT_GATE inline + AHA_CAPTURE (refonte 2026-04-25 → 2026-04-26) ─
// 2026-04-26 (B+D, Design §11.bis.7) :
//   - Default J0-J30 = 1 question simple "ça shift où ?" + 3 chips
//     (gorge / poitrine / ailleurs)
//   - Opt-in J30+ : propose "veux-tu plus de précision ?" → débloque 6 zones
//   - localStorage["dream:felt-shift-mode"] = "6-zones" pour étendre
//   - Backend collecte tout pareil, l'UI s'adapte
const FeltShiftAhaInline = ({ feltShift, setFeltShift, ahaLevel, setAhaLevel, ahaNote, setAhaNote, onSend, onSkip }) => {
  // Mode actuel : "6-zones" (étendu) ou défaut (3 zones simples)
  const [mode, setMode] = useS2(() => {
    try { return localStorage.getItem("dream:felt-shift-mode") || "default"; }
    catch { return "default"; }
  });
  const [showOptIn, setShowOptIn] = useS2(false);

  // Au mount : si pas en mode étendu, pas encore prompted, et post-J30
  // → propose la modal d'opt-in une fois.
  useE2(() => {
    try {
      if (mode === "6-zones") return;
      const prompted = localStorage.getItem("dream:felt-shift-prompted");
      if (prompted) return;
      const isPost = (typeof window.isPostJ30 === "function")
        ? window.isPostJ30("dream:account-created", 30)
        : false;
      if (isPost) setShowOptIn(true);
    } catch {}
  }, [mode]);

  const acceptExtended = () => {
    try {
      localStorage.setItem("dream:felt-shift-mode", "6-zones");
      localStorage.setItem("dream:felt-shift-prompted", String(Date.now()));
    } catch {}
    setMode("6-zones");
    setShowOptIn(false);
  };
  const declineExtended = () => {
    try { localStorage.setItem("dream:felt-shift-prompted", String(Date.now())); } catch {}
    setShowOptIn(false);
  };

  // Zones selon mode
  const SHIFT_ZONES_DEFAULT = [
    ["gorge", "gorge"],
    ["poitrine", "poitrine"],
    ["ailleurs", "ailleurs"],
  ];
  const SHIFT_ZONES_EXTENDED = [
    ["gorge", "gorge"],
    ["poitrine", "poitrine"],
    ["ventre", "ventre"],
    ["nuque", "nuque"],
    ["ailleurs", "ailleurs"],
    ["aucune", "aucune part"],
  ];
  const SHIFT_ZONES = mode === "6-zones" ? SHIFT_ZONES_EXTENDED : SHIFT_ZONES_DEFAULT;
  const gridCols = mode === "6-zones" ? "repeat(3, 1fr)" : "repeat(3, 1fr)";

  const AHA_LEVELS = [
    ["fort", "résonne fort"],
    ["peut-etre", "peut-être"],
    ["non", "non"],
  ];

  const canSend = !!feltShift || !!ahaLevel || ahaNote.trim().length > 0;

  return (
    <div>
      <div className="meta mb-s" style={{
        fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--clay-earth)",
      }}>
        FELT-SHIFT · GENDLIN
      </div>
      <p className="body mb-m" style={{ textWrap: "pretty", fontFamily: "var(--serif)", fontSize: 16, fontStyle: "italic" }}>
        {mode === "6-zones"
          ? "prends dix secondes. lequel a fait quelque chose dans ton corps ?"
          : "ça shift où ?"}
      </p>
      <div style={{
        display: "grid", gridTemplateColumns: gridCols, gap: "var(--s-2)",
        marginBottom: "var(--s-3)",
      }}>
        {SHIFT_ZONES.map(([k, l]) => (
          <button key={k}
            className={"chip " + (feltShift === k ? "active" : "")}
            onClick={() => setFeltShift(k)}
            style={{ width: "100%", justifyContent: "center" }}>
            {l}
          </button>
        ))}
      </div>
      <button
        className={"btn-text " + (feltShift === "rien" ? "active" : "")}
        onClick={() => setFeltShift("rien")}
        style={{
          fontSize: 13, opacity: 0.7,
          color: feltShift === "rien" ? "var(--bone)" : "var(--ash-light)",
          fontStyle: "italic",
        }}>
        rien ne shift — j'attends
      </button>

      {/* Modal opt-in J30+ : propose les 6 zones étendues */}
      {showOptIn && (
        <div style={{
          marginTop: "var(--s-4)",
          padding: "var(--s-3) var(--s-3)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))",
          background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
        }}>
          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
            lineHeight: 1.55, color: "var(--bone)",
            margin: "0 0 var(--s-3) 0", textWrap: "pretty",
          }}>
            Veux-tu plus de précision corporelle&nbsp;? On peut déverrouiller 6 zones.
          </p>
          <div className="row gap-s" style={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button className="btn-text" onClick={declineExtended}
              style={{ fontSize: 13 }}>
              non, garde simple
            </button>
            <button className="btn-ghost" onClick={acceptExtended}
              style={{ fontSize: 13 }}>
              oui, déverrouiller 6 zones
            </button>
          </div>
        </div>
      )}

      <div className="divider" style={{ margin: "var(--s-4) 0" }} />

      <div className="meta mb-s" style={{
        fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)",
      }}>
        AHA — CE QUI S'EST POSÉ
      </div>
      <div className="row gap-s mb-m" style={{ flexWrap: "wrap" }}>
        {AHA_LEVELS.map(([k, l]) => (
          <button key={k}
            className={"chip " + (ahaLevel === k ? "active" : "")}
            onClick={() => setAhaLevel(k)}>
            {l}
          </button>
        ))}
      </div>
      <textarea
        rows={3}
        placeholder="ce qui s'est posé en mots — ou laisser vide."
        value={ahaNote}
        onChange={e => setAhaNote(e.target.value)}
        style={{
          width: "100%", minHeight: 70,
          background: "transparent",
          border: "1px solid var(--ash-deep)",
          padding: "var(--s-3)",
          color: "var(--bone)",
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, lineHeight: 1.5,
          resize: "vertical", outline: "none",
          marginBottom: "var(--s-3)",
        }} />

      <div className="row gap-s" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn-text" onClick={onSkip} style={{ fontSize: 13 }}>plus tard</button>
        <button className="btn-ghost" onClick={onSend}
          disabled={!canSend}
          style={{ opacity: canSend ? 1 : 0.4 }}>
          enregistrer
        </button>
      </div>
      <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12 }}>
        rien n'est évalué. ces traces pondèrent les lectures futures, c'est tout.
      </div>
    </div>
  );
};

// ── Sheet plein écran (modal lourd, fond night-warm + matter) ─
const Sheet = ({ children, onClose, matter = null }) => {
  const matterBorder = matter === "paper" ? "var(--paper-warm)"
    : matter === "stone" ? "var(--stone-cool)"
    : matter === "silk"  ? "var(--silk-gold)"
    : "var(--ash-mid)";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 110,
      background: "color-mix(in oklch, var(--night-floor) 88%, transparent)",
      backdropFilter: "blur(10px)",
      display: "grid", placeItems: "stretch",
      animation: "screen-in var(--tempo-tisse) var(--ease-respire) both",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{
          background: "var(--night-warm)",
          borderTop: "1px solid " + matterBorder,
          width: "100%", maxWidth: 720, margin: "0 auto",
          padding: "var(--s-6) var(--s-5) var(--s-7)",
          position: "relative", overflowY: "auto",
          maxHeight: "100vh",
        }}>
        <button onClick={onClose}
          aria-label="refermer"
          style={{
            position: "absolute", top: "var(--s-3)", right: "var(--s-3)",
            background: "none", border: "none", color: "var(--ash-light)",
            fontFamily: "var(--serif)", fontSize: 22, cursor: "pointer",
            padding: 8, opacity: 0.7,
          }}>×</button>
        {children}
      </div>
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 100,
    background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
    backdropFilter: "blur(8px)",
    display: "grid", placeItems: "center", padding: "var(--s-4)",
    animation: "screen-in var(--tempo-tisse) var(--ease-respire) both"
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      style={{
        background: "var(--night-warm)",
        border: "1px solid var(--ash-mid)",
        padding: "var(--s-5)",
        maxWidth: 540, width: "100%",
        position: "relative", overflow: "hidden"
      }}>
      {children}
    </div>
  </div>
);

// ── Portrait (constellation) ────────────────────────────────
const Constellation = ({ nodes, selected, onSelect, height = 340 }) => {
  const w = 640;
  const h = height;

  // positions lightly perturbed + slow drift
  const [tick, setTick] = useS2(0);
  useE2(() => {
    let raf;
    const loop = () => {
      setTick(t => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const placed = useM2(() => nodes.map((n, i) => {
    // deterministic base position
    const angle = (i / nodes.length) * Math.PI * 2 + (n.seed || 0);
    const radius = 40 + (n.weight || 1) * 22 + ((i * 17) % 60);
    return {
      ...n,
      bx: w / 2 + Math.cos(angle) * radius,
      by: h / 2 + Math.sin(angle) * radius * 0.75,
    };
  }), [nodes, w, h]);

  return (
    <div className="constellation" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ display: "block" }}>
        {/* edges */}
        {placed.map((a, i) =>
          placed.slice(i+1).map((b, j) => {
            if (!a.edges?.includes(b.id)) return null;
            const dx = (Math.sin(tick / 60 + i) * 3);
            const dy = (Math.cos(tick / 60 + j) * 3);
            return (
              <line key={`${a.id}-${b.id}`}
                x1={a.bx + dx} y1={a.by + dy}
                x2={b.bx - dx} y2={b.by - dy}
                stroke="var(--ash-mid)" strokeWidth="0.5" opacity="0.45" />
            );
          })
        )}
        {/* nodes */}
        {placed.map((n, i) => {
          const breath = 1 + Math.sin(tick / 50 + i) * 0.04;
          const dx = Math.sin(tick / 80 + i * 0.7) * 2;
          const dy = Math.cos(tick / 90 + i * 1.1) * 2;
          const r = (4 + (n.weight || 1) * 3) * breath;
          const isSel = selected === n.id;
          const fill = n.color || "var(--bone)";
          return (
            <g key={n.id}
              transform={`translate(${n.bx + dx} ${n.by + dy})`}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect?.(n.id)}>
              {isSel && <circle r={r + 10} fill="none" stroke="var(--bone)" strokeWidth="0.5" opacity="0.4" />}
              {n.shape === "star" ? (
                <polygon points="0,-6 1.5,-1.5 6,-1.5 2.5,1.5 4,6 0,3 -4,6 -2.5,1.5 -6,-1.5 -1.5,-1.5"
                  fill={fill} opacity={0.85} transform={`scale(${r/6})`} />
              ) : (
                <circle r={r} fill={fill} opacity={0.9} />
              )}
              {isSel && (
                <text y={r + 16} fontSize="11" fill="var(--bone)" textAnchor="middle"
                  fontFamily="var(--serif)" fontStyle="italic">
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const portraitNodes = [
  { id: "grand-mere", label: "la grand-mère", weight: 3, color: "var(--stone-cool)", edges: ["maison", "porte"], seed: 0.3, shape: "circle" },
  { id: "maison",     label: "la maison aux pièces inconnues", weight: 2.5, color: "var(--paper-warm)", edges: ["porte"], seed: 0.8 },
  { id: "porte",      label: "la porte qui ne s'ouvre pas", weight: 2.2, color: "var(--paper-warm)", edges: ["cuisine"], seed: 1.5 },
  { id: "cuisine",    label: "cuisine sans feu", weight: 1.8, color: "var(--clay-earth)", edges: [], seed: 2.1 },
  { id: "eau",        label: "eau qui cherche son lit", weight: 2.8, color: "var(--stone-cool)", edges: ["estuaire", "pont"], seed: 2.8, shape: "star" },
  { id: "estuaire",   label: "estuaire", weight: 1.5, color: "var(--stone-cool)", edges: [], seed: 3.3 },
  { id: "pont",       label: "pont inachevé", weight: 2.0, color: "var(--silk-gold)", edges: ["seuil"], seed: 3.9, shape: "star" },
  { id: "seuil",      label: "seuil à traverser", weight: 2.4, color: "var(--silk-gold)", edges: ["travail"], seed: 4.5 },
  { id: "travail",    label: "question du travail", weight: 2.6, color: "var(--paper-warm)", edges: [], seed: 5.1 },
  { id: "corbeau",    label: "corbeau / feuille morte", weight: 1.2, color: "var(--obsidian)", edges: [], seed: 5.7 },
  { id: "enfant",     label: "enfant qui pleure", weight: 1.6, color: "var(--ember-live)", edges: ["maison"], seed: 0.1, shape: "star" },
];

const Portrait = ({ go }) => {
  const [toggle, setToggle] = useS2("croise");
  const [period, setPeriod] = useS2("lune");
  const [selected, setSelected] = useS2(null);
  const [graph, setGraph] = useS2({ nodes: portraitNodes, edges: [] });
  const [loading, setLoading] = useS2(true);

  // Map period chip → days param
  const periodDays = ({ lune: 30, saison: 90, annee: 365, always: 3650 })[period] || 90;

  useE2(() => {
    let cancelled = false;
    setLoading(true);
    window.DreamAPI.getConstellationGraph({ days: periodDays, min_weight: 0.3 })
      .then(g => {
        if (cancelled) return;
        // API returns { nodes: [...], edges: [...] }
        // Convert to Constellation-compatible shape
        const nodes = (g?.nodes || []).map((n, i) => ({
          id: n.id || ("n-" + i),
          label: n.label || n.name || "·",
          weight: n.weight || n.occurrences || 1,
          color: n.kind === "bigdream" ? "var(--silk-gold)"
            : n.kind === "figure" ? "var(--paper-warm)"
            : n.kind === "motif" ? "var(--stone-cool)"
            : "var(--bone)",
          shape: n.kind === "bigdream" ? "star" : "circle",
          edges: (g.edges || [])
            .filter(e => (e.source || e.a) === (n.id || ("n-" + i)))
            .map(e => e.target || e.b),
          seed: (i * 0.7) % 6.28,
        }));
        // Fall back to seed if backend returns empty
        const finalNodes = nodes.length > 0 ? nodes : portraitNodes;
        setGraph({ nodes: finalNodes, edges: g?.edges || [] });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setGraph({ nodes: portraitNodes, edges: [] });
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [periodDays]);

  return (
    <div className="stage screen-enter">
      <TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="row mb-l" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <h1 className="h1-seuil">Portrait</h1>
          <div className="row gap-m">
            <button className="btn-text" aria-label="légende">?</button>
            <button className="btn-text" aria-label="paramètres">⚙</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center" style={{ height: 380, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
            <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>la constellation s'organise…</div>
          </div>
        ) : (
          <Constellation nodes={graph.nodes} selected={selected} onSelect={setSelected} height={380} />
        )}

        <div className="mt-l toggle-row">
          {[["onirique", "onirique"], ["jour", "jour"], ["croise", "croisé"]].map(([k, l]) => (
            <button key={k} className={"chip" + (toggle === k ? " active" : "")} onClick={() => setToggle(k)}>{l}</button>
          ))}
        </div>

        <div className="mt-s toggle-row">
          {[["lune", "cette lune"], ["saison", "saison"], ["annee", "année"], ["always", "always"]].map(([k, l]) => (
            <button key={k} className={"chip" + (period === k ? " active" : "")} onClick={() => setPeriod(k)}>{l}</button>
          ))}
        </div>

        <div className="divider-moon">échos vivants en ce moment</div>

        <div className="stack gap-s">
          <div className="card" style={{ padding: "var(--s-4)" }}>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, margin: 0, textWrap: "pretty" }}>
              il y a une lune — « la maison aux pièces inconnues » résonne avec ton rêve de ce matin.
            </p>
          </div>
          <div className="card" style={{ padding: "var(--s-4)" }}>
            <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, margin: 0, textWrap: "pretty" }}>
              il y a deux lunes — « attends, décision Paris » résonne avec la question du travail cette semaine.
            </p>
          </div>
        </div>

        <div className="mt-xl text-center">
          <button className="btn-ghost" onClick={() => go("chat", "portrait")}>
            ⊙ demander une lecture
          </button>
          <div className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            voix mobilisées cette lune · aizenstat · moss · bachelard
          </div>
        </div>
        {window.ExitToHuman && <window.ExitToHuman />}
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── Anima Mundi — Voûte ─────────────────────────────────────
const AnimaVoute = ({ go }) => {
  const [tick, setTick] = useS2(0);
  const [voute, setVoute] = useS2(null);

  useE2(() => {
    const t = setInterval(() => setTick(v => v + 1), 50);
    return () => clearInterval(t);
  }, []);

  useE2(() => {
    let cancelled = false;
    window.DreamAPI.getVoute().then(d => { if (!cancelled) setVoute(d); });
    return () => { cancelled = true; };
  }, []);

  const points = useM2(() => {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        x: (i * 37) % 100,
        y: (i * 53) % 100,
        phase: i * 0.27,
        size: 0.6 + ((i * 13) % 7) / 10,
      });
    }
    return arr;
  }, []);

  // Compose human-friendly count from voute aggregat
  const meteoCount = voute?.meteo?.k_count || voute?.meteo_optin_count || null;

  return (
    <div className="stage screen-enter">
      <TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <h1 className="h1-seuil text-center mb-xl" style={{ fontSize: 44 }}>Anima Mundi</h1>

        <div className="anima-constellation mb-l">
          <svg viewBox="0 0 100 60" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
            {points.map((p, i) => {
              const breathe = (Math.sin(tick / 40 + p.phase) + 1) / 2;
              const opacity = 0.15 + breathe * 0.5;
              return (
                <circle key={i}
                  cx={p.x} cy={p.y * 0.6}
                  r={p.size * (0.4 + breathe * 0.6)}
                  fill={i % 23 === 0 ? "var(--silk-gold)" : i % 11 === 0 ? "var(--stone-cool)" : "var(--bone)"}
                  opacity={opacity} />
              );
            })}
          </svg>
        </div>

        <p className="seuil-italic text-center" style={{ fontSize: 19, maxWidth: 520, margin: "0 auto", textWrap: "pretty" }}>
          {meteoCount
            ? `Cette lune, ${meteoCount.toLocaleString("fr-FR")} voix ont déposé — rêves, signes, traversées.`
            : "Cette lune, des voix se rassemblent — rêves, signes, traversées."}
        </p>

        <div className="stack gap-m mt-xl">
          <button className="chamber-card" onClick={() => go("meteo")}>
            <h3 className="h3-lecture">Le temps qu'il fait dans la nuit</h3>
            <p className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              météo de l'inconscient
            </p>
          </button>
          <button className="chamber-card" onClick={() => go("annales")}
            style={{ opacity: (voute?.annales_circulating_count || 0) > 0 ? 1 : 0.55 }}>
            <h3 className="h3-lecture">Tenu ensemble</h3>
            <p className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              {voute?.annales_circulating_count
                ? `${voute.annales_circulating_count} annale(s) en circulation`
                : "rêves et traversées offerts au collectif"}
            </p>
          </button>
          <button className="chamber-card" onClick={() => go("polyphonie")}>
            <h3 className="h3-lecture">Polyphonie de la lune</h3>
            <p className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              {voute?.polyphonie?.lunar_phase || "lecture longue"}
            </p>
          </button>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── Météo de l'inconscient ──────────────────────────────────
const Meteo = ({ go }) => {
  const [meteos, setMeteos] = useS2([]);
  const [loading, setLoading] = useS2(true);

  useE2(() => {
    let cancelled = false;
    window.DreamAPI.getMeteo({ limit: 4 }).then(d => {
      if (cancelled) return;
      setMeteos(d?.meteos || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const latest = meteos[0];
  const topMotif = latest?.top_motifs?.[0];

  return (
  <div className="stage screen-enter">
    <TopNav showBack onBack={() => go("anima")} label="anima mundi" />
    <div className="frame">
      <h2 className="h2-section mb-s">Le temps qu'il fait dans la nuit</h2>
      <div className="divider" />
      <p className="seuil-italic mb-xl" style={{ maxWidth: 560, textWrap: "pretty" }}>
        {loading
          ? "la météo se compose…"
          : topMotif
            ? `Cette période, le motif ${topMotif.motif || topMotif} revient le plus.`
            : "Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes — d'eau qui se cherche un lit, d'estuaires qui se forment."}
      </p>
      <div className="text-center mb-xl">
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ opacity: 0.7 }}>
          <path d="M40 15 Q28 30 28 45 Q28 60 40 68 Q52 60 52 45 Q52 30 40 15 Z"
            fill="none" stroke="var(--stone-cool)" strokeWidth="0.75" />
          <path d="M40 25 Q33 35 33 48 Q33 58 40 62"
            fill="none" stroke="var(--stone-cool)" strokeWidth="0.5" opacity="0.6" />
        </svg>
        <div className="meta mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>eau</div>
      </div>

      <div className="divider" />

      <h4 className="h4-repere mb-m" style={{ fontSize: 17, color: "var(--ash-light)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "lowercase" }}>
        ▽ nuages thématiques
      </h4>
      <div className="stack gap-m mb-xl">
        {[
          "Beaucoup de portes qui ne s'ouvrent pas tout de suite.",
          "Des animaux qui parlent doucement, sans urgence.",
          "Des défunts qui reviennent pour faire la cuisine.",
        ].map((t, i) => (
          <div key={i} className="card" style={{ padding: "var(--s-4)" }}>
            <p className="seuil-italic" style={{ fontSize: 18, margin: 0, textWrap: "pretty" }}>{t}</p>
          </div>
        ))}
      </div>

      <h4 className="h4-repere mb-m" style={{ fontSize: 17, color: "var(--ash-light)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "lowercase" }}>
        ▽ tournures qui montent
      </h4>
      <div className="stack gap-m mb-xl">
        <p className="seuil-italic" style={{ fontSize: 18, textWrap: "pretty" }}>
          L'eau revient plus que le feu cette saison.
        </p>
        <p className="seuil-italic" style={{ fontSize: 18, textWrap: "pretty" }}>
          Les paysages se font plus vastes ; les pièces fermées se font plus rares.
        </p>
      </div>

      <h4 className="h4-repere mb-m" style={{ fontSize: 17, color: "var(--ash-light)", fontWeight: 400, letterSpacing: "0.1em", textTransform: "lowercase" }}>
        ▽ journal de vie collectif
      </h4>
      <p className="seuil-italic mb-xl" style={{ fontSize: 18, textWrap: "pretty" }}>
        Beaucoup de questions sur le travail cette lune. Le motif du
        seuil-à-traverser revient — choix de carrière, rupture, déménagement.
      </p>

      <div className="meta op-50 mt-xl" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em" }}>
        {latest?.computed_at
          ? `recalculée ${new Date(latest.computed_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} · délai rituel 14 j`
          : "recalculée régulièrement · délai rituel 14 j · prochaine : nouvelle lune"}
      </div>
    </div>
    {window.FeedbackFloat && <window.FeedbackFloat />}
  </div>
);
};

// ── Polyphonie lunaire ──────────────────────────────────────
const Polyphonie = ({ go }) => {
  const [polyphonies, setPolyphonies] = useS2([]);
  const [loading, setLoading] = useS2(true);

  useE2(() => {
    let cancelled = false;
    window.DreamAPI.getPolyphonie({ limit: 6 }).then(d => {
      if (cancelled) return;
      setPolyphonies(d?.polyphonies || []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const latest = polyphonies[0];
  const earlier = polyphonies.slice(1);
  const lunarLabel = latest?.lunar_phase || "lecture longue";

  return (
  <div className="stage screen-enter">
    <TopNav showBack onBack={() => go("anima")} label="anima mundi" />
    <div className="frame" style={{ maxWidth: 640 }}>
      <h2 className="h2-section mb-l">Polyphonie · {lunarLabel}</h2>
      <div className="divider" />

      <div style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.7, color: "var(--bone)" }}>
        {loading ? (
          <p className="meta op-50" style={{ fontStyle: "italic" }}>la polyphonie s'écrit…</p>
        ) : latest?.narrative_text ? (
          latest.narrative_text.split(/\n\n+/).map((para, i) => (
            <p key={i} style={{ textWrap: "pretty" }}>{para}</p>
          ))
        ) : (
        <>
        <p style={{ textWrap: "pretty" }}>
          Plusieurs ont rêvé d'eau cette lune. Pas de tempêtes —
          d'eau qui se cherche un lit, d'estuaires qui se forment.
          Et plusieurs ont écrit des doutes sur leur travail.
        </p>
        <p style={{ textWrap: "pretty" }}>
          À la lumière de Bachelard, on pourrait entendre dans ces eaux
          cherchant leur lit la même chose que dans ces questions de seuil :
          une fluidité qui demande à se poser quelque part, sans encore
          savoir où. L'eau, ici, n'est pas celle qui noie. C'est celle qui
          hésite avant de prendre sa forme.
        </p>
        <p style={{ textWrap: "pretty" }}>
          Aizenstat aurait invité à tenir la grand-mère qui revient —
          plusieurs l'ont vue cette lune, dans des cuisines sans feu,
          avec du linge à laver. Elle n'est pas figure de passé.
          Elle est figure qui travaille quelque chose qui n'a pas encore
          de nom.
        </p>
        <p style={{ textWrap: "pretty" }}>
          Et Moss, on l'imagine dire : les ponts inachevés qui reviennent
          en synchronicité ne demandent peut-être pas à être finis. Ils
          demandent à être regardés, depuis les deux rives à la fois.
        </p>
        <p style={{ textWrap: "pretty", fontStyle: "italic", marginTop: "var(--s-5)" }}>
          Que se cherche-t-elle, l'eau qui cherche son lit ?
        </p>
        </>
        )}
      </div>

      <div className="divider" />

      <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14 }}>
        voix mobilisées cette lune
      </div>
      <div className="mt-s meta-mono">
        {(latest?.voices_mobilisees && latest.voices_mobilisees.length > 0)
          ? latest.voices_mobilisees.join(" · ")
          : "Aizenstat · Moss · Bachelard"}
      </div>

      <div className="divider-moon">lectures précédentes</div>
      <div className="stack gap-s">
        {earlier.length > 0
          ? earlier.map(p => (
              <button key={p.id} className="btn-text text-center" style={{ fontSize: 15 }}>
                • {p.lunar_phase || new Date(p.period_end).toLocaleDateString("fr-FR", { month: "long" })}
              </button>
            ))
          : <>
              <button className="btn-text text-center" style={{ fontSize: 15 }}>• lune précédente</button>
            </>}
      </div>
    </div>
    {window.FeedbackFloat && <window.FeedbackFloat />}
  </div>
  );
};

// ── Chat IA narratrice ──────────────────────────────────────
const Chat = ({ go, contextId }) => {
  const [messages, setMessages] = useS2([
    { from: "ai", text: "Avant que je te propose quoi que ce soit, dis-moi : qu'est-ce que tu vois là, en regardant ce kairos ?" },
  ]);
  const [input, setInput] = useS2("");
  const [thinking, setThinking] = useS2(false);
  const [streaming, setStreaming] = useS2("");

  const send = async () => {
    if (!input.trim() || thinking) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setThinking(true);
    setStreaming("");

    // Build messages array for /api/chat
    const apiMessages = messages
      .map(m => ({ role: m.from === "ai" ? "assistant" : "user", content: m.text }))
      .concat([{ role: "user", content: userMsg }]);

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
            setMessages(m => [...m, { from: "ai", text: buffer.trim() }]);
          }
          setStreaming("");
          setThinking(false);
        },
        onError: (msg) => {
          setMessages(m => [...m, { from: "ai", text: msg ? "Le lien est gardé. (" + msg + ") Reviens quand tu peux." : "Le lien est gardé. Reviens quand tu peux." }]);
          setStreaming("");
          setThinking(false);
        },
      });
    } catch (e) {
      setMessages(m => [...m, { from: "ai", text: "Le lien est gardé. Reviens quand tu peux." }]);
      setStreaming("");
      setThinking(false);
    }
  };

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <TopNav showBack onBack={() => go("kairos", contextId || "k-08")} label="" />
      <div className="frame" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 60px)" }}>
        <div className="meta mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          mode · exploration de kairos
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
          {messages.map((m, i) => (
            <div key={i} className={"bubble " + m.from} style={{ textWrap: "pretty", whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          ))}
          {streaming && (
            <div className="bubble ai" style={{ textWrap: "pretty", whiteSpace: "pre-wrap" }}>
              {streaming}
              <span style={{ opacity: 0.4 }}>▍</span>
            </div>
          )}
          {thinking && !streaming && (
            <div className="bubble ai" style={{ opacity: 0.7, fontStyle: "italic" }}>
              <span style={{ display: "inline-block", animation: "halo-slow 2s ease-in-out infinite" }}>les liens se tissent…</span>
            </div>
          )}
        </div>

        <div className="mt-l">
          <div className="row gap-s" style={{ alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="ce qui vient…"
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid var(--ash-deep)",
                padding: "12px 16px",
                color: "var(--bone)",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
                resize: "none", outline: "none",
                minHeight: 44,
              }} />
            <button className="btn-ghost" onClick={send} disabled={!input.trim() || thinking}
              style={{ opacity: !input.trim() || thinking ? 0.4 : 1 }}>
              envoyer
            </button>
          </div>
          <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            voix mobilisées · gendlin · moss
          </div>
        </div>

        {messages.length >= 3 && (
          <window.AhaCapture context="chat-narratrice" onClose={() => {}} />
        )}

        {window.ExitToHuman && <window.ExitToHuman />}
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

Object.assign(window, { KairosDetail, Portrait, AnimaVoute, Meteo, Polyphonie, Chat, Modal, Constellation });
