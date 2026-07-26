/* global React, window */
// ──────────────────────────────────────────────────────────────
// Recurring Re-entry — sous-app Mode Rêve Récurrent (Feature 4, 2026-04-29)
//
// Spec : 4_LOG.md 2026-04-29 (Mode Rêve Récurrent + Re-entry Aizenstat).
// Cause-racine: Le LOG du 29/04 notait "UI re-entry pas créée" — boucle ouverte
// jusqu'à 2026-04-29 (audit T3 feature 4).
//
// Composants exportés :
//   - window.RecurringReEntryScreen : routing entry. Si pas de patternId en ctx,
//     liste les patterns acknowledged=null. Si patternId présent, fetch +
//     acknowledge + démarre re-entry session (5 min, 1 angle Aizenstat).
//
// Garde-fous :
//   - trauma_flag → redirect Sanctuaire (NightmaresScreen) AVANT démarrage session.
//   - exit_to_human (crisis pattern) → message dédié + numéros d'urgence visibles.
//
// Grammaire : alignée Dream main (night-warm + EB Garamond italic + silk-gold).
// ──────────────────────────────────────────────────────────────

(function setupRecurringScreens() {
  const { useState: uS, useEffect: uE, useCallback: uCB } = React;

  // Tokens Dream main (mêmes que screens-bigdream.jsx)
  const T = {
    bg:           "var(--night-warm, #15130F)",
    bgFloor:      "var(--night-floor, #0E0F14)",
    border:       "var(--ash-deep, #1F2025)",
    borderActive: "var(--silk-gold, #C8A658)",
    text:         "var(--bone, #C4B9AD)",
    textDim:      "var(--ash-light, #5C5854)",
    accent:       "var(--silk-gold, #C8A658)",
    ember:        "var(--ember-live, #C46B3D)",
    serif:        "var(--serif, 'EB Garamond', Garamond, serif)",
    mono:         "var(--mono, 'JetBrains Mono', ui-monospace, monospace)",
  };

  function PatternListView({ go, patterns, loading }) {
    if (loading) {
      return (
        <div style={{ padding: "120px 24px", textAlign: "center", color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>
          les motifs récurrents s'organisent…
        </div>
      );
    }
    if (!patterns || patterns.length === 0) {
      return (
        <div style={{ padding: "80px 24px", textAlign: "center" }}>
          <div style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 18, color: T.text, marginBottom: 12 }}>
            Aucun motif récurrent détecté pour l'instant.
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 14, color: T.textDim, opacity: 0.85 }}>
            Un motif émerge quand un même symbole/figure/lieu revient au moins 5 fois en 60 jours.
          </div>
        </div>
      );
    }
    return (
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 14 }}>
        {patterns.map((p) => (
          <button key={p.id}
            onClick={() => go("recurring-re-entry", { pattern_id: p.id })}
            style={{
              textAlign: "left",
              background: p.trauma_flag
                ? "color-mix(in oklch, var(--ember-live) 6%, var(--night-warm))"
                : "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))",
              border: "1px solid " + (p.trauma_flag ? T.ember : T.border),
              padding: "14px 16px",
              cursor: "pointer",
              borderRadius: 2,
              color: T.text,
              fontFamily: T.serif,
            }}>
            <div style={{
              fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase",
              color: p.trauma_flag ? T.ember : T.accent,
              fontFamily: T.mono, marginBottom: 6, opacity: 0.85,
            }}>
              {p.pattern_kind} · revient {p.count_total}×
            </div>
            <div style={{ fontStyle: "italic", fontSize: 17, lineHeight: 1.5 }}>
              « {p.pattern_text} »
            </div>
            {p.trauma_flag && (
              <div style={{
                marginTop: 8, fontSize: 12.5, color: T.ember, opacity: 0.9,
                fontStyle: "italic",
              }}>
                valence lourde — sanctuaire suggéré
              </div>
            )}
          </button>
        ))}
      </div>
    );
  }

  function ReEntrySessionView({ go, pattern, guidance, exitToHuman, onCapture, captured, captureBusy }) {
    const [text, setText] = uS("");

    if (exitToHuman) {
      return (
        <div style={{ padding: "60px 24px", maxWidth: 600, margin: "0 auto" }}>
          <div style={{
            fontFamily: T.serif, fontStyle: "italic",
            fontSize: 22, lineHeight: 1.5, color: T.text, marginBottom: 18,
            textWrap: "pretty",
          }}>
            Ce motif touche quelque chose de difficile.
          </div>
          <div style={{
            fontFamily: T.serif, fontSize: 16, lineHeight: 1.65, color: T.textDim,
            marginBottom: 24, textWrap: "pretty",
          }}>
            Ce que tu portes mérite une présence humaine. Je ne suis pas équipée pour
            t'accompagner dans ce qui s'ouvre. Quelqu'un peut t'écouter dès maintenant.
          </div>
          <div style={{
            padding: "18px 20px", border: "1px solid " + T.borderActive,
            background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
            fontFamily: T.serif, fontSize: 15, lineHeight: 1.65, color: T.text,
          }}>
            <div style={{ marginBottom: 10 }}><strong>SOS Amitié</strong> · 09 72 39 40 50 (24/7)</div>
            <div style={{ marginBottom: 10 }}><strong>3114</strong> · prévention suicide (24/7, gratuit)</div>
            <div><strong>SAMU</strong> · 15 · urgence vitale</div>
          </div>
          <button onClick={() => go("home")} style={{
            marginTop: 30, background: "transparent", border: "1px solid " + T.border,
            color: T.textDim, padding: "10px 20px", fontFamily: T.serif, fontStyle: "italic",
            fontSize: 14, cursor: "pointer", borderRadius: 0,
          }}>
            retour
          </button>
        </div>
      );
    }

    if (!guidance) {
      return (
        <div style={{ padding: "120px 24px", textAlign: "center", color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>
          la re-entrée se prépare…
        </div>
      );
    }

    const aizenstatAngle = guidance.aizenstat_angle || "Le personnage non-décodé. La voix qui n'a pas encore parlé.";
    const reading = guidance.reading || "";
    const questions = Array.isArray(guidance.questions) ? guidance.questions.slice(0, 3) : [];

    return (
      <div style={{ padding: "0 20px 80px", maxWidth: 640, margin: "0 auto" }}>
        {pattern && (
          <div style={{
            marginBottom: 22,
            fontFamily: T.mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
            color: T.accent, opacity: 0.78,
          }}>
            re-entrée consciente · 5 min · {pattern.pattern_kind}
          </div>
        )}

        {pattern && (
          <div style={{
            marginBottom: 24, padding: "14px 16px",
            background: "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))",
            border: "1px solid " + T.border,
            fontFamily: T.serif, fontStyle: "italic",
            fontSize: 17, lineHeight: 1.55, color: T.text,
            textWrap: "pretty",
          }}>
            « {pattern.pattern_text} » revient dans {pattern.count_total} de tes rêves.
          </div>
        )}

        <div style={{
          fontFamily: T.serif, fontSize: 17, lineHeight: 1.65, color: T.text,
          marginBottom: 24, textWrap: "pretty",
        }}>
          {reading}
        </div>

        <div style={{
          padding: "16px 18px",
          borderTop: "1px dashed color-mix(in oklch, var(--silk-gold) 28%, transparent)",
          borderBottom: "1px dashed color-mix(in oklch, var(--silk-gold) 28%, transparent)",
          fontFamily: T.serif, fontStyle: "italic",
          fontSize: 16, lineHeight: 1.6, color: "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))",
          marginBottom: 24, textWrap: "pretty",
        }}>
          <div style={{
            fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase",
            color: T.accent, opacity: 0.85, fontFamily: T.mono,
            marginBottom: 8, fontStyle: "normal",
          }}>
            angle Aizenstat
          </div>
          {aizenstatAngle}
        </div>

        {questions.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.16em",
              textTransform: "uppercase", color: T.textDim, marginBottom: 12, opacity: 0.78,
            }}>
              trois portes
            </div>
            <ol style={{
              listStyle: "decimal inside",
              padding: 0, margin: 0,
              display: "flex", flexDirection: "column", gap: 12,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 16, lineHeight: 1.55,
              color: T.text, textWrap: "pretty",
            }}>
              {questions.map((q, i) => <li key={i}>{q}</li>)}
            </ol>
          </div>
        )}

        {!captured ? (
          <>
            <div style={{
              fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.16em",
              textTransform: "uppercase", color: T.textDim, marginBottom: 8, opacity: 0.78,
            }}>
              capture (facultatif)
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ce qui vient quand tu retournes là…"
              rows={5}
              style={{
                width: "100%",
                background: "color-mix(in oklch, var(--night-warm) 60%, transparent)",
                border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
                color: T.text, padding: 14,
                fontFamily: T.serif, fontStyle: "italic", fontSize: 16, lineHeight: 1.55,
                resize: "vertical", outline: "none", borderRadius: 0,
              }}
            />
            <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => onCapture(text)} disabled={captureBusy}
                style={{
                  background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
                  border: "1px solid " + T.borderActive, color: T.accent,
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                  padding: "8px 18px", cursor: captureBusy ? "default" : "pointer",
                  borderRadius: 0, opacity: captureBusy ? 0.6 : 1,
                }}>
                {captureBusy ? "…" : "garder"}
              </button>
              <button onClick={() => onCapture(null)} disabled={captureBusy}
                style={{
                  background: "transparent",
                  border: "1px solid " + T.border, color: T.textDim,
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                  padding: "8px 18px", cursor: captureBusy ? "default" : "pointer",
                  borderRadius: 0, opacity: captureBusy ? 0.6 : 1,
                }}>
                fermer sans capture
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", marginTop: 30 }}>
            <div style={{
              fontFamily: T.serif, fontStyle: "italic", fontSize: 18,
              color: T.text, marginBottom: 18, textWrap: "pretty",
            }}>
              C'est tenu. La trace est posée.
            </div>
            <button onClick={() => go("home")} style={{
              background: "transparent", border: "1px solid " + T.borderActive,
              color: T.accent, padding: "10px 22px",
              fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
              cursor: "pointer", borderRadius: 0,
            }}>
              retour
            </button>
          </div>
        )}
      </div>
    );
  }

  function RecurringReEntryScreen({ go, ctx }) {
    const ctxObj = (ctx && typeof ctx === "object") ? ctx : (typeof ctx === "string" ? { pattern_id: ctx } : {});
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

    // Mode liste : charge tous les patterns non-acknowledged
    uE(() => {
      if (phase !== "list") return;
      let cancelled = false;
      setLoadingList(true);
      window.DreamAPI.listRecurringPatterns()
        .then((res) => {
          if (cancelled) return;
          const all = (res?.patterns || []).filter((p) => !p.acknowledged_at && !p.archived_at);
          setPatterns(all);
          setLoadingList(false);
        })
        .catch(() => { if (!cancelled) { setLoadingList(false); } });
      return () => { cancelled = true; };
    }, [phase]);

    // Mode session : acknowledge + start re-entry
    uE(() => {
      if (phase !== "session" || !initialPatternId) return;
      let cancelled = false;
      (async () => {
        try {
          // 1. acknowledge → récupère pattern + suggestion
          const ack = await window.DreamAPI.acknowledgeRecurringPattern(initialPatternId);
          if (cancelled) return;
          if (!ack || !ack.pattern) {
            setError("Motif introuvable.");
            return;
          }
          setPattern(ack.pattern);

          // 2. trauma_flag → redirect sanctuaire
          if (ack.suggestion === "sanctuaire" || ack.pattern.trauma_flag) {
            setRedirectingSanctuaire(true);
            // soft delay pour que user voie le message
            setTimeout(() => { if (!cancelled) go("nightmares"); }, 1800);
            return;
          }

          // 3. start re-entry session
          const sess = await window.DreamAPI.startRecurringReEntry(initialPatternId, {});
          if (cancelled) return;
          if (sess?.exit_to_human) {
            setExitToHuman(true);
            return;
          }
          setGuidance(sess?.guidance || {
            reading: "",
            questions: [],
            aizenstat_angle: "Le personnage non-décodé. La voix qui n'a pas encore parlé.",
          });
        } catch (e) {
          if (!cancelled) setError("La re-entrée n'a pas pu démarrer. Réessaie plus tard.");
        }
      })();
      return () => { cancelled = true; };
    }, [phase, initialPatternId]);

    const onCapture = uCB(async (text) => {
      setCaptureBusy(true);
      try {
        if (text && text.trim().length > 0) {
          await window.DreamAPI.startRecurringReEntry(initialPatternId, {
            capture_text: text.trim(),
            capture_method: "text",
          });
        }
      } catch {}
      setCaptureBusy(false);
      setCaptured(true);
    }, [initialPatternId]);

    return (
      <div style={{
        minHeight: "100vh",
        background: T.bgFloor,
        color: T.text,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
        position: "relative",
      }}>
        {/* HaloRespire silk subtil en background */}
        {window.HaloRespire && (
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
            opacity: 0.14,
          }}>
            <window.HaloRespire kind="silk" />
          </div>
        )}

        <div style={{ position: "relative", zIndex: 1 }}>
          {window.TopNav && <window.TopNav showBack onBack={() => go("home")} label="" />}

          <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 0 0" }}>
            <h1 style={{
              fontFamily: T.serif, fontStyle: "italic",
              fontSize: 28, lineHeight: 1.2, color: T.text,
              padding: "0 20px", marginBottom: 18, textWrap: "pretty",
            }}>
              {phase === "list" ? "Motifs qui reviennent" : "Re-entrée"}
            </h1>

            {error && (
              <div style={{
                padding: "12px 18px", margin: "0 20px 18px",
                background: "color-mix(in oklch, var(--ember-live) 8%, transparent)",
                border: "1px solid " + T.ember, color: T.text,
                fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
              }}>
                {error}
              </div>
            )}

            {redirectingSanctuaire ? (
              <div style={{ padding: "60px 24px", textAlign: "center", color: T.textDim, fontFamily: T.serif, fontStyle: "italic", fontSize: 16, textWrap: "pretty" }}>
                Ce motif est lourd — je t'amène vers le sanctuaire.
              </div>
            ) : phase === "list" ? (
              <PatternListView go={go} patterns={patterns} loading={loadingList} />
            ) : (
              <ReEntrySessionView
                go={go}
                pattern={pattern}
                guidance={guidance}
                exitToHuman={exitToHuman}
                onCapture={onCapture}
                captured={captured}
                captureBusy={captureBusy}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  window.RecurringReEntryScreen = RecurringReEntryScreen;
})();
