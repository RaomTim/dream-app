/* global React, window */
// ──────────────────────────────────────────────────────────────
// Big Dream Workflow — sous-app 7 jours (Feature 3, 2026-04-29)
//
// Spec : 4_LOG.md 2026-04-29 (Big Dreams Workflow + Push humain payant).
//
// Composants exportés :
//   - window.BigDreamWorkflowScreen : routing entry, charge workflow
//   - window.WorkflowOverview        : 7 cards J1..J7, current_day highlight
//   - window.WorkflowDayDetail       : étape du jour avec text/voice capture
//   - window.HumanPushRequestModal   : push praticien 30€ (Stripe MVP stub)
//
// Grammaire : alignée Dream main (night-warm + EB Garamond italic + silk-gold).
// 7 étapes : silence / image_or_drawing / dialogue_personnage / polyphonie_3_voix /
//            correlations_foret / oracle_corps / letter_to_self
// ──────────────────────────────────────────────────────────────

(function setupBigDreamScreens() {
  const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

  // ── Tokens — Dream main aesthetic ──────────────────────────
  const T = {
    bg:           "var(--night-warm, #15130F)",
    bgFloor:      "var(--night-floor, #0E0F14)",
    bgSoft:       "color-mix(in oklch, var(--paper-warm, #B89E7C) 6%, transparent)",
    bgSilkSoft:   "color-mix(in oklch, var(--silk-gold, #C8A658) 5%, transparent)",
    border:       "var(--ash-deep, #1F2025)",
    borderActive: "var(--silk-gold, #C8A658)",
    text:         "var(--bone, #C4B9AD)",
    textDim:      "var(--ash-light, #5C5854)",
    textMuted:    "var(--ash-mid, #363430)",
    accent:       "var(--silk-gold, #C8A658)",
    ember:        "var(--ember-live, #C46B3D)",
    paper:        "var(--paper-warm, #B89E7C)",
    stone:        "var(--stone-cool, #6F7C88)",
    serif:        "var(--serif, 'EB Garamond', Garamond, serif)",
    sans:         "var(--sans, Inter, system-ui, sans-serif)",
    mono:         "var(--mono, 'JetBrains Mono', ui-monospace, monospace)",
  };

  // 7 étapes — labels + intentions
  const STEP_META = {
    1: {
      kind: "silence",
      label: "Silence",
      title: "juste poser, ne rien interpréter",
      desc: "Aujourd'hui, ne fais rien. Re-lis le rêve. Laisse-le être. Aucune capture obligatoire.",
      placeholder: "(facultatif) un mot, une sensation, ce qui surnage…",
    },
    2: {
      kind: "image_or_drawing",
      label: "Image / dessin",
      title: "une image, un dessin, ou la description d'une image",
      desc: "Si une image vient, dépose-la (texte ou photo). Si rien ne vient, décris une image qui pourrait porter le rêve.",
      placeholder: "ce que je vois, ce que je dessinerais, ce qui prend forme…",
    },
    3: {
      kind: "dialogue_personnage",
      label: "Dialogue avec un personnage",
      title: "parler à un personnage du rêve",
      desc: "Choisis une figure du rêve. Pose-lui une question. Écoute ce qu'elle dit (mode incarnation Aizenstat — tu peux écrire les deux voix).",
      placeholder: "moi : … / la figure : …",
    },
    4: {
      kind: "polyphonie_3_voix",
      label: "Polyphonie 3 voix",
      title: "lecture polyphonique paper / stone / silk",
      desc: "Convoque les 3 voix de la Forêt sur ce rêve. Aucune ne dit le sens. Lequel résonne ?",
      placeholder: "ce qui m'a touché dans une voix, ce qui m'a résisté…",
      hasAction: "polyphony", // bouton qui appelle /api/dream-chat/converse force_polyphony=true
    },
    5: {
      kind: "correlations_foret",
      label: "Corrélations Forêt étendues",
      title: "5-7 chunks Forêt vs 3 standard",
      desc: "Recherche ciblée dans la bibliothèque pour ce rêve. Pas pour décoder — pour entendre les voix qui résonnent.",
      placeholder: "ce qui s'est ouvert avec les voix Forêt…",
      hasAction: "forest", // bouton qui appelle forestReading
    },
    6: {
      kind: "oracle_corps",
      label: "Oracle du Corps",
      title: "où le rêve vit dans ton corps",
      desc: "Sensation associée au rêve. Lecture corps 3 voix. Pas dans la tête — dans la chair.",
      placeholder: "où ça vit dans le corps, ce qui se passe quand j'y reviens…",
      hasAction: "body",
    },
    7: {
      kind: "letter_to_self",
      label: "Lettre à toi-même",
      title: "synthèse narrative ~400-500 mots",
      desc: "L'app tisse une lettre à partir de tes 6 captures. Tu peux l'amender ou la garder telle quelle.",
      placeholder: "(la lettre est générée automatiquement — clique le bouton ci-dessous)",
      hasAction: "closing_letter",
    },
  };

  // ─────────────────────────────────────────────────────────────
  // WorkflowOverview — 7 cards horizontales/verticales
  // ─────────────────────────────────────────────────────────────
  function WorkflowOverview({ workflow, steps, onSelectDay }) {
    const currentDay = workflow?.current_day || 1;
    const closed = !!workflow?.closed_at;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((d) => {
          const meta = STEP_META[d];
          const step = (steps || []).find((s) => s.day === d);
          const completed = !!step?.completed_at;
          const isCurrent = d === currentDay && !closed;

          const borderColor = completed
            ? T.borderActive
            : isCurrent
            ? T.ember
            : T.border;
          const bg = completed
            ? T.bgSilkSoft
            : isCurrent
            ? "color-mix(in oklch, var(--ember-live) 4%, transparent)"
            : "transparent";

          return (
            <button
              key={d}
              onClick={() => onSelectDay && onSelectDay(d)}
              style={{
                textAlign: "left",
                background: bg,
                border: `1px solid ${borderColor}`,
                color: T.text,
                padding: "14px 16px",
                cursor: "pointer",
                fontFamily: T.sans,
                transition: "border-color 200ms ease, background 200ms ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{
                  fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.1em",
                  color: completed ? T.accent : isCurrent ? T.ember : T.textDim,
                }}>
                  J{d} — {meta.label.toUpperCase()}
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.textDim }}>
                  {completed ? "✓ tenu" : isCurrent ? "← aujourd'hui" : ""}
                </div>
              </div>
              <div style={{
                fontFamily: T.serif, fontStyle: "italic", fontSize: 16,
                color: T.text, marginTop: 6, lineHeight: 1.4,
              }}>
                {meta.title}
              </div>
              {step?.user_capture && (
                <div style={{
                  fontFamily: T.serif, fontSize: 13, color: T.textDim,
                  marginTop: 8, lineHeight: 1.5,
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {step.user_capture.slice(0, 180)}{step.user_capture.length > 180 ? "…" : ""}
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // WorkflowDayDetail — étape du jour avec capture + actions
  // ─────────────────────────────────────────────────────────────
  function WorkflowDayDetail({ workflow, kairos, day, step, onComplete, onBack, onGenerateClosingLetter }) {
    const meta = STEP_META[day];
    const [capture, uCap] = uS(step?.user_capture || "");
    const [voice, uVoice] = uS(!!step?.user_capture_voice);
    const [saving, uSav] = uS(false);
    const [error, uErr] = uS(null);

    // Pour J7 letter_to_self : lance la génération auto
    const [letterLoading, uLL] = uS(false);
    const [generatedLetter, uGL] = uS(null);

    uE(() => {
      uCap(step?.user_capture || "");
      uVoice(!!step?.user_capture_voice);
      uErr(null);
      uGL(null);
    }, [step?.day]);

    const handleSave = async () => {
      if (saving) return;
      if (capture.trim().length < 1 && day !== 1 && day !== 7) {
        uErr("dépose au moins quelques mots");
        return;
      }
      uSav(true);
      uErr(null);
      try {
        const res = await window.DreamAPI.completeBigDreamStep(workflow.id, day, {
          capture_text: capture.trim() || null,
          capture_voice: voice,
        });
        if (res?._seed) throw new Error("connexion impossible");
        if (onComplete) onComplete(res);
      } catch (e) {
        uErr((e && e.message) || "erreur");
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
        if (res?.closing_letter) {
          uGL(res.closing_letter);
          uCap(res.closing_letter);
          if (onGenerateClosingLetter) onGenerateClosingLetter(res);
        } else if (res?.error) {
          uErr(res.error);
        } else {
          uErr("la lettre n'a pas pu être tissée");
        }
      } catch (e) {
        uErr((e && e.message) || "erreur");
      } finally {
        uLL(false);
      }
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Header */}
        <div>
          <div style={{
            fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.1em",
            color: T.accent, marginBottom: 8,
          }}>
            J{day} — {meta.label.toUpperCase()}
          </div>
          <h2 style={{
            fontFamily: T.serif, fontStyle: "italic", fontSize: 24,
            color: T.text, lineHeight: 1.35, margin: 0,
          }}>
            {meta.title}
          </h2>
          <p style={{
            fontFamily: T.serif, fontSize: 15, color: T.textDim,
            lineHeight: 1.6, marginTop: 10,
          }}>
            {meta.desc}
          </p>
        </div>

        {/* Rappel rêve original */}
        {kairos?.raw_text && (
          <div style={{
            border: `1px solid ${T.border}`,
            background: T.bgSoft,
            padding: 14,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 10, letterSpacing: "0.1em",
              color: T.paper, marginBottom: 6,
            }}>
              RÊVE INITIAL
            </div>
            <p style={{
              fontFamily: T.serif, fontSize: 14, fontStyle: "italic",
              color: T.text, lineHeight: 1.55, margin: 0,
              display: "-webkit-box", WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {kairos.raw_text}
            </p>
          </div>
        )}

        {/* J7 — bouton générer la lettre */}
        {day === 7 && !generatedLetter && !step?.completed_at && (
          <button
            onClick={handleGenerateLetter}
            disabled={letterLoading}
            style={{
              padding: "14px 18px",
              border: `1px solid ${T.borderActive}`,
              background: T.bgSilkSoft,
              color: T.accent,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 16,
              cursor: letterLoading ? "wait" : "pointer",
              opacity: letterLoading ? 0.6 : 1,
            }}
          >
            {letterLoading ? "la lettre se tisse…" : "tisser la lettre maintenant (~400-500 mots)"}
          </button>
        )}

        {/* J7 — affichage de la lettre */}
        {day === 7 && (generatedLetter || step?.user_capture) && (
          <div style={{
            border: `1px solid ${T.borderActive}`,
            background: T.bgSilkSoft,
            padding: 16,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.1em",
              color: T.accent, marginBottom: 10,
            }}>
              LETTRE — TISSÉE POUR TOI
            </div>
            <p style={{
              fontFamily: T.serif, fontSize: 16, color: T.text,
              lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0,
              textWrap: "pretty",
            }}>
              {generatedLetter || step?.user_capture}
            </p>
          </div>
        )}

        {/* Capture textarea (sauf J7 si lettre déjà là) */}
        {!(day === 7 && (generatedLetter || step?.user_capture)) && (
          <textarea
            value={capture}
            onChange={(e) => uCap(e.target.value)}
            placeholder={meta.placeholder}
            rows={day === 1 ? 4 : 8}
            style={{
              width: "100%",
              minHeight: day === 1 ? 80 : 160,
              background: "transparent",
              border: `1px solid ${T.border}`,
              color: T.text,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 16,
              lineHeight: 1.6, padding: 12,
              outline: "none", resize: "vertical",
            }}
          />
        )}

        {/* Voice toggle */}
        <label style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: T.mono, fontSize: 11, color: T.textDim,
          cursor: "pointer",
        }}>
          <input
            type="checkbox"
            checked={voice}
            onChange={(e) => uVoice(e.target.checked)}
            style={{ accentColor: T.accent }}
          />
          capture vocale (à venir : transcription Whisper)
        </label>

        {error && (
          <div style={{
            fontFamily: T.serif, fontSize: 13, fontStyle: "italic",
            color: T.ember,
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginTop: 8, gap: 12,
        }}>
          <button
            onClick={onBack}
            style={{
              background: "transparent",
              border: "none",
              color: T.textDim,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
              cursor: "pointer",
            }}
          >
            ← retour
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "10px 18px",
              border: `1px solid ${T.borderActive}`,
              background: "transparent",
              color: T.accent,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 15,
              cursor: saving ? "wait" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "déposer…" : step?.completed_at ? "mettre à jour" : "tenir ce jour"}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // HumanPushRequestModal — push praticien 30€
  // ─────────────────────────────────────────────────────────────
  function HumanPushRequestModal({ workflowId, kairosId, onClose, onSubmitted }) {
    const [text, uText] = uS("");
    const [submitting, uSub] = uS(false);
    const [error, uErr] = uS(null);
    const [submitted, uDone] = uS(null);

    const handleSubmit = async () => {
      if (text.trim().length < 10) {
        uErr("dis quelques mots de plus à la praticienne (min 10 caractères)");
        return;
      }
      uSub(true);
      uErr(null);
      try {
        const res = await window.DreamAPI.requestBigDreamHumanPush({
          workflow_id: workflowId || null,
          kairos_id: kairosId || null,
          user_request_text: text.trim(),
        });
        if (res?._seed || !res?.push) throw new Error("connexion impossible");
        uDone(res);
        if (onSubmitted) onSubmitted(res);
      } catch (e) {
        uErr((e && e.message) || "erreur");
      } finally {
        uSub(false);
      }
    };

    return (
      <div style={{
        position: "fixed", inset: 0,
        background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
        zIndex: 1000, display: "grid", placeItems: "center",
        padding: 16,
      }} onClick={onClose}>
        <div style={{
          maxWidth: 520, width: "100%",
          background: T.bg, border: `1px solid ${T.border}`,
          padding: 24,
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.1em",
            color: T.accent, marginBottom: 8,
          }}>
            DEMANDER UN REGARD HUMAIN
          </div>
          <h3 style={{
            fontFamily: T.serif, fontStyle: "italic", fontSize: 22,
            color: T.text, lineHeight: 1.35, marginTop: 0, marginBottom: 12,
          }}>
            Une praticienne formée Aizenstat / Moss / Hopcke peut tenir ce rêve avec toi.
          </h3>
          <p style={{
            fontFamily: T.serif, fontSize: 14, color: T.textDim,
            lineHeight: 1.6, marginBottom: 16,
          }}>
            <strong style={{ color: T.accent }}>30€</strong> · réponse écrite sous 7 jours · pas un diagnostic, un compagnonnage.
          </p>

          {!submitted && (
            <>
              <textarea
                value={text}
                onChange={(e) => uText(e.target.value)}
                placeholder="ce que tu veux que la praticienne sache, la question qui revient, ce qui pèse…"
                rows={6}
                style={{
                  width: "100%", minHeight: 140,
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  color: T.text,
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 15,
                  lineHeight: 1.55, padding: 12,
                  outline: "none", resize: "vertical",
                }}
              />

              {error && (
                <div style={{
                  fontFamily: T.serif, fontSize: 13, fontStyle: "italic",
                  color: T.ember, marginTop: 10,
                }}>
                  {error}
                </div>
              )}

              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginTop: 16,
              }}>
                <button
                  onClick={onClose}
                  style={{
                    background: "transparent", border: "none",
                    color: T.textDim,
                    fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  refermer
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${T.borderActive}`,
                    background: T.bgSilkSoft,
                    color: T.accent,
                    fontFamily: T.serif, fontStyle: "italic", fontSize: 15,
                    cursor: submitting ? "wait" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "envoi…" : "demander (30€)"}
                </button>
              </div>
            </>
          )}

          {submitted && (
            <div>
              <p style={{
                fontFamily: T.serif, fontSize: 16, fontStyle: "italic",
                color: T.text, lineHeight: 1.6,
              }}>
                Ta demande est partie. La praticienne reviendra vers toi sous 7 jours.
              </p>
              {submitted.payment?.stub && (
                <div style={{
                  fontFamily: T.mono, fontSize: 11, color: T.textDim,
                  marginTop: 12, padding: 10,
                  border: `1px dashed ${T.border}`,
                }}>
                  MVP : Stripe stub — la facturation réelle arrive en V1.5.
                  Intent ID : {submitted.payment.payment_intent_id}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: "10px 18px",
                    border: `1px solid ${T.borderActive}`,
                    background: "transparent",
                    color: T.accent,
                    fontFamily: T.serif, fontStyle: "italic", fontSize: 15,
                    cursor: "pointer",
                  }}
                >
                  refermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // BigDreamWorkflowScreen — entry/routing
  //
  // Props :
  //   - go : router callback
  //   - ctx : peut être un workflow_id (string) OU { workflow_id, kairos_id }
  //
  // Si pas de workflow_id mais un kairos_id → start workflow puis charge.
  // ─────────────────────────────────────────────────────────────
  function BigDreamWorkflowScreen({ go, ctx }) {
    const ctxObj = typeof ctx === "string" ? { workflow_id: ctx } : (ctx || {});
    const [workflowId, uWid] = uS(ctxObj.workflow_id || null);
    const [workflow, uWf] = uS(null);
    const [steps, uSteps] = uS([]);
    const [kairos, uK] = uS(null);
    const [loading, uLoad] = uS(true);
    const [error, uErr] = uS(null);

    const [selectedDay, uSelDay] = uS(null);
    const [showPush, uShowPush] = uS(false);

    // Bootstrap : si pas de workflow_id mais kairos_id → start
    uE(() => {
      let cancelled = false;

      async function bootstrap() {
        uLoad(true);
        uErr(null);
        try {
          let wid = workflowId;
          if (!wid && ctxObj.kairos_id) {
            const startRes = await window.DreamAPI.startBigDreamWorkflow(ctxObj.kairos_id);
            if (startRes?._seed) throw new Error("impossible de créer le workflow");
            if (startRes?.workflow?.id) {
              wid = startRes.workflow.id;
              if (!cancelled) uWid(wid);
            } else if (startRes?.error) {
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
          if (res?._seed || !res?.workflow) throw new Error("workflow introuvable");
          uWf(res.workflow);
          uSteps(res.steps || []);
          uK(res.kairos || null);
          // Sélectionne automatiquement le current_day
          uSelDay(res.workflow.current_day || 1);
        } catch (e) {
          if (!cancelled) uErr((e && e.message) || "erreur");
        } finally {
          if (!cancelled) uLoad(false);
        }
      }

      bootstrap();
      return () => { cancelled = true; };
    }, [ctxObj.kairos_id, ctxObj.workflow_id]);

    const refresh = async () => {
      if (!workflowId) return;
      const res = await window.DreamAPI.getBigDreamWorkflow(workflowId);
      if (res?.workflow) {
        uWf(res.workflow);
        uSteps(res.steps || []);
        uK(res.kairos || null);
      }
    };

    const onStepComplete = async () => {
      await refresh();
      // Repositionne sur current_day après save
      // (sauf si user a manuellement choisi un autre jour)
    };

    const currentStep = selectedDay ? (steps || []).find((s) => s.day === selectedDay) : null;

    // ── Render ──
    if (loading) {
      return (
        <div className="stage screen-enter" style={{ background: T.bgFloor, color: T.text, minHeight: "100vh", padding: "24px 16px" }}>
          <div style={{
            fontFamily: T.serif, fontStyle: "italic", color: T.textDim,
            textAlign: "center", marginTop: 40, fontSize: 16,
          }}>
            le workflow se prépare…
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="stage screen-enter" style={{ background: T.bgFloor, color: T.text, minHeight: "100vh", padding: "24px 16px" }}>
          <div style={{ fontFamily: T.serif, color: T.ember, fontSize: 15 }}>
            {error}
          </div>
          <button
            onClick={() => go && go("home")}
            style={{
              marginTop: 16, padding: "10px 18px",
              border: `1px solid ${T.border}`, background: "transparent",
              color: T.text, cursor: "pointer", fontFamily: T.serif,
            }}
          >
            ← retour
          </button>
        </div>
      );
    }

    return (
      <div className="stage screen-enter" style={{
        background: T.bgFloor, color: T.text,
        minHeight: "100vh",
        fontFamily: T.sans,
        padding: "20px 16px 100px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <button
            onClick={() => go && go(kairos ? "kairos" : "home", kairos?.id)}
            style={{
              background: "transparent", border: "none",
              color: T.textDim,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
              cursor: "pointer",
            }}
          >
            ← retour
          </button>
          <div style={{
            fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.1em",
            color: T.accent,
          }}>
            BIG DREAM · 7 JOURS
          </div>
        </div>

        <h1 style={{
          fontFamily: T.serif, fontStyle: "italic", fontSize: 28,
          lineHeight: 1.3, color: T.text, margin: "0 0 8px 0",
        }}>
          tenir ce rêve sur 7 jours
        </h1>
        <p style={{
          fontFamily: T.serif, fontSize: 14, color: T.textDim,
          lineHeight: 1.55, marginBottom: 20, maxWidth: 540,
        }}>
          Un rituel par jour. Le rêve continue à parler tant qu'on le tient.
          {workflow?.closed_at ? " — refermé." : ""}
        </p>

        {/* Detail du jour ou Overview */}
        {selectedDay && currentStep ? (
          <WorkflowDayDetail
            workflow={workflow}
            kairos={kairos}
            day={selectedDay}
            step={currentStep}
            onComplete={onStepComplete}
            onBack={() => uSelDay(null)}
            onGenerateClosingLetter={refresh}
          />
        ) : (
          <>
            <WorkflowOverview
              workflow={workflow}
              steps={steps}
              onSelectDay={(d) => uSelDay(d)}
            />

            {/* Push humain CTA */}
            <div style={{
              marginTop: 28, padding: 16,
              border: `1px solid ${T.border}`,
              background: T.bgSoft,
            }}>
              <div style={{
                fontFamily: T.mono, fontSize: 10.5, letterSpacing: "0.1em",
                color: T.paper, marginBottom: 8,
              }}>
                BESOIN D'UN REGARD HUMAIN ?
              </div>
              <p style={{
                fontFamily: T.serif, fontSize: 14, color: T.text,
                lineHeight: 1.55, marginTop: 0, marginBottom: 12,
              }}>
                Une praticienne formée peut tenir ce rêve avec toi. <strong style={{ color: T.accent }}>30€</strong>, réponse écrite sous 7 jours.
              </p>
              <button
                onClick={() => uShowPush(true)}
                style={{
                  padding: "10px 18px",
                  border: `1px solid ${T.borderActive}`,
                  background: "transparent",
                  color: T.accent,
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 15,
                  cursor: "pointer",
                }}
              >
                demander un regard humain
              </button>
            </div>
          </>
        )}

        {showPush && (
          <HumanPushRequestModal
            workflowId={workflowId}
            kairosId={kairos?.id}
            onClose={() => uShowPush(false)}
            onSubmitted={() => { /* pas de refresh state nécessaire pour l'instant */ }}
          />
        )}
      </div>
    );
  }

  // Expose
  Object.assign(window, {
    BigDreamWorkflowScreen,
    WorkflowOverview,
    WorkflowDayDetail,
    HumanPushRequestModal,
  });
})();
