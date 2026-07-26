/* global React, window */
// ═════════════════════════════════════════════════════════════════════
// SCREENS PROTOCOLES — UI components
// Spec : 1_BIBLE §3.11 + 2_DESIGN §11.bis.13
// Yeshua, 2026-04-26 nuit profonde.
//
// Components exposed on window :
//   - CaptureChoiceScreen     écran ⚡/🌀 (visible si user a ≥3 kairos)
//   - ProtocoleSelector       modal sélection 9 protocoles + 2 rituels
//   - ProtocoleSubFlow        state machine générique étape par étape
//   - ProtocoleDiscoveryReveal modal douce J3 (intégrée dans flow Dream Home)
//
// Réutilise :
//   - window.AhaCapture          (screens-shared.jsx) pour étape "aha_capture"
//   - window.FeltShiftGate       (screens-shared.jsx) pour étape "body_zone"
//   - window.OracleCorpsScreen   silhouette → on intègre une mini-version pour body_zone_full
//   - window.DreamAPI.createKairos, updateKairos, transcribe
//   - fetch("/api/journal/entries")  pour cible "journal"
// ═════════════════════════════════════════════════════════════════════

const { useState: pS, useEffect: pE, useRef: pR, useMemo: pM } = React;

// ── Helpers locale ────────────────────────────────────────────────
function pLocale() {
  try { return localStorage.getItem("dream:locale") === "en" ? "en" : "fr"; }
  catch { return "fr"; }
}
function pTxt(obj, key) {
  const loc = pLocale();
  if (loc === "en" && obj[key + "_en"]) return obj[key + "_en"];
  return obj[key];
}

// ── Discovery progressive (réutilisable depuis Dream Home) ────────
const PROTOCOLES_REVEAL_KEY = "dream:protocoles:revealed-at";
const PROTOCOLES_DISMISSED_KEY = "dream:protocoles:dismissed-at";

function shouldRevealProtocoles(kairosCount) {
  try {
    const revealed = localStorage.getItem(PROTOCOLES_REVEAL_KEY);
    if (revealed) return false;
    const dismissedAt = parseInt(localStorage.getItem(PROTOCOLES_DISMISSED_KEY) || "0", 10);
    if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 3600 * 1000) return false;
    return kairosCount >= 3;
  } catch { return false; }
}
function markProtocolesRevealed() {
  try { localStorage.setItem(PROTOCOLES_REVEAL_KEY, String(Date.now())); } catch {}
}
function markProtocolesDismissed() {
  try { localStorage.setItem(PROTOCOLES_DISMISSED_KEY, String(Date.now())); } catch {}
}

const ProtocoleDiscoveryReveal = ({ go, onClose }) => {
  return (
    <div role="dialog" aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 320,
        background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--s-5)",
        animation: "p-fade-in 480ms ease",
      }}>
      <div style={{
        maxWidth: 440, width: "100%",
        background: "color-mix(in oklch, var(--night-warm) 92%, transparent)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
        padding: "var(--s-6) var(--s-5)",
        textAlign: "center",
      }}>
        {/* 2026-04-27 — Fix Sprint P0 §C : remplacement emoji 🌀 (rendu bleu OS-natif HORS palette)
            par SVG spirale sobre qui respecte var(--silk-gold). Glyphe inspiré spirale archaïque,
            cohérent avec palette dark-first oklch. */}
        <div style={{ marginBottom: "var(--s-3)", display: "grid", placeItems: "center" }} aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 40 40" style={{ display: "block", opacity: 0.85 }}>
            <path
              d="M 20 6
                 a 14 14 0 1 1 -10 23.8
                 a 10 10 0 1 1 16.5 -7.5
                 a 6 6 0 1 1 -10 4
                 a 3 3 0 1 1 5.2 -2"
              fill="none"
              stroke="var(--silk-gold)"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
        </div>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
          color: "var(--bone)", marginBottom: "var(--s-3)",
        }}>
          un autre chemin pour déposer
        </div>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, lineHeight: 1.55,
          color: "var(--ash-light)", marginBottom: "var(--s-5)", textWrap: "pretty",
        }}>
          Sais-tu qu'à chaque dépôt, tu peux choisir entre rapide ou accompagné par un guide inspiré d'une voix de la Forêt ?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={() => { markProtocolesRevealed(); onClose && onClose(); if (typeof go === "function") setTimeout(() => go("protocole-selector"), 200); }}
            style={pBtnPrimary}>
            essayer un guide
          </button>
          <button onClick={() => { markProtocolesDismissed(); onClose && onClose(); }}
            style={pBtnGhost}>
            plus tard
          </button>
        </div>
      </div>
      <style>{`@keyframes p-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// CaptureChoiceScreen — écran de choix Quick / Avec un guide
// Visible UNIQUEMENT si user a ≥3 kairos. Sinon → flow Quick direct.
// ─────────────────────────────────────────────────────────────────

const CaptureChoiceScreen = ({ go }) => {
  // Compte les kairos depuis window.DreamAPI
  const [kairosCount, setKairosCount] = pS(null); // null = loading

  pE(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!window.DreamAPI?.listKairos) { if (!cancelled) setKairosCount(0); return; }
        const data = await window.DreamAPI.listKairos({ limit: 50 });
        const n = (data?.kairos || []).length;
        if (!cancelled) setKairosCount(n);
      } catch { if (!cancelled) setKairosCount(0); }
    })();
    return () => { cancelled = true; };
  }, []);

  // Avant 3e dépôt → bypass direct vers flow Quick (existant)
  pE(() => {
    if (kairosCount !== null && kairosCount < 3) {
      // Direct vers Capture quick existant
      setTimeout(() => go && go("capture"), 0);
    }
  }, [kairosCount]);

  if (kairosCount === null || kairosCount < 3) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--night-warm)",
        display: "grid", placeItems: "center",
        color: "var(--ash-light)", fontFamily: "var(--serif)", fontStyle: "italic",
      }}>
        <div style={{ opacity: 0.6 }}>…</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--night-warm)", color: "var(--bone)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      position: "relative", overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header — bouton passer (skip choice → flow Quick direct) */}
      <div style={{
        display: "flex", justifyContent: "flex-end", padding: "0 22px 4px",
      }}>
        <button onClick={() => go && go("capture")}
          aria-label="passer ce choix"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--ash-light)", opacity: 0.6,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "8px 12px",
          }}>
          passer →
        </button>
      </div>

      {/* Centre : titre + 2 cards */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "var(--s-5) 22px var(--s-6)", maxWidth: 540, width: "100%", margin: "0 auto",
      }}>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 22, lineHeight: 1.45, textAlign: "center",
          marginBottom: "var(--s-6)", color: "var(--bone)",
          textWrap: "pretty",
        }}>
          Comment veux-tu déposer ?
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Card ⚡ Rapide */}
          <button onClick={() => go && go("capture")}
            style={{
              ...pCardBase,
              cursor: "pointer", textAlign: "left",
              background: "color-mix(in oklch, var(--night-floor) 60%, transparent)",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"}>
            <div style={{
              fontSize: 26, marginBottom: 8,
              color: "var(--silk-gold)", opacity: 0.9,
            }}>⚡</div>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 19,
              color: "var(--bone)", marginBottom: 6,
            }}>Rapide</div>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
              color: "var(--ash-light)", lineHeight: 1.5,
            }}>en 30 secondes — un fragment, une image</div>
          </button>

          {/* Card 🌀 Avec un guide */}
          <button onClick={() => go && go("protocole-selector")}
            style={{
              ...pCardBase,
              cursor: "pointer", textAlign: "left",
              background: "color-mix(in oklch, var(--night-floor) 60%, transparent)",
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"}>
            {/* 2026-04-27 Sprint P0 §C : SVG spirale sobre, remplace emoji 🌀 (rendu OS bleu) */}
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center" }} aria-hidden="true">
              <svg width="26" height="26" viewBox="0 0 40 40" style={{ display: "block", opacity: 0.9 }}>
                <path
                  d="M 20 6
                     a 14 14 0 1 1 -10 23.8
                     a 10 10 0 1 1 16.5 -7.5
                     a 6 6 0 1 1 -10 4
                     a 3 3 0 1 1 5.2 -2"
                  fill="none"
                  stroke="var(--silk-gold)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 19,
              color: "var(--bone)", marginBottom: 6,
            }}>Avec un guide</div>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
              color: "var(--ash-light)", lineHeight: 1.5,
            }}>un protocole inspiré d'une voix de la Forêt</div>
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ProtocoleSelector — modal de sélection (route protocole-selector)
// ─────────────────────────────────────────────────────────────────

const ProtocoleSelector = ({ go }) => {
  const catalog = window.PROTOCOLES_CATALOG || {};
  const all = Object.values(catalog);
  // Group : par category_label dans l'ordre catalogue
  const groups = pM(() => {
    const out = [];
    const seen = new Set();
    for (const p of all) {
      // Skip reentry de la liste (accessible depuis KairosDetail)
      if (p.id === "reentry") continue;
      const cat = p.category_label || "Autres";
      if (!seen.has(cat)) {
        seen.add(cat);
        out.push({ label: cat, items: [] });
      }
      out.find(g => g.label === cat).items.push(p);
    }
    return out;
  }, [catalog]);

  return (
    <div style={{
      minHeight: "100vh", background: "var(--night-warm)", color: "var(--bone)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      position: "relative",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 18px 12px",
      }}>
        <button onClick={() => go && go("capture-choice")}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--ash-light)", opacity: 0.7,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
            padding: "8px 4px",
          }}>
          ← retour
        </button>
        <button onClick={() => go && go("home")}
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--ash-light)", opacity: 0.5,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "8px 12px",
          }}>
          fermer
        </button>
      </div>

      <div style={{
        maxWidth: 580, width: "100%", margin: "0 auto",
        padding: "8px 18px 0",
      }}>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22,
          textAlign: "center", marginBottom: "var(--s-5)",
          color: "var(--bone)", textWrap: "pretty",
        }}>
          Quel guide veux-tu pour cette fois ?
        </p>

        {groups.map((g, gi) => (
          <div key={g.label} style={{ marginTop: gi === 0 ? 0 : "var(--s-5)" }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.08em",
              color: "var(--silk-gold)", opacity: 0.78,
              textTransform: "uppercase", marginBottom: 12,
              paddingLeft: 4,
            }}>
              {g.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {g.items.map(p => (
                <button key={p.id}
                  onClick={() => go && go("protocole-sub-flow", { protocolId: p.id })}
                  style={{
                    ...pCardBase,
                    cursor: "pointer", textAlign: "left",
                    background: "color-mix(in oklch, var(--night-floor) 55%, transparent)",
                    padding: "14px 16px",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"}>
                  <div style={{
                    display: "flex", alignItems: "baseline", gap: 8,
                    marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 18, color: "var(--silk-gold)", opacity: 0.9 }}>{p.glyph}</span>
                    <span style={{
                      fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
                      color: "var(--bone)",
                    }}>{pTxt(p, "title")}</span>
                  </div>
                  <div style={{
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
                    color: "var(--ash-light)", marginBottom: 4,
                  }}>{pTxt(p, "subtitle")}</div>
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.04em",
                    color: "var(--ash-light)", opacity: 0.55,
                    marginTop: 6,
                  }}>
                    source · {p.source}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// ProtocoleSubFlow — state machine générique étape par étape
// ─────────────────────────────────────────────────────────────────

const ProtocoleSubFlow = ({ go, protocolId, kairosId, entryId }) => {
  const protocol = (window.PROTOCOLES_CATALOG || {})[protocolId] || null;

  // Hooks — appelés inconditionnellement (avant tout return conditionnel)
  const [stepIdx, setStepIdx] = pS(0);
  const [answers, setAnswers] = pS({});  // { stepId: { type, answer, skipped } }
  const [submitting, setSubmitting] = pS(false);
  const [error, setError] = pS(null);
  const [savedRecordId, setSavedRecordId] = pS(kairosId || entryId || null);
  const [completed, setCompleted] = pS(false);

  const totalSteps = protocol ? protocol.steps.length : 0;
  const step = protocol ? protocol.steps[stepIdx] : null;
  const isLast = stepIdx === totalSteps - 1;

  // Auto-advance pour breathing/info
  pE(() => {
    if (!step) return;
    if ((step.type === "breathing" || step.type === "info") && step.duration) {
      const t = setTimeout(() => {
        setAnswers(prev => ({ ...prev, [step.id]: { type: step.type, answer: "_auto_", skipped: false } }));
        if (isLast) finalize({ type: step.type, answer: "_auto_", skipped: false });
        else setStepIdx(stepIdx + 1);
      }, step.duration);
      return () => clearTimeout(t);
    }
  }, [stepIdx, step?.id]);

  // Si pas de protocole valide → afficher message + retour
  if (!protocol) {
    return (
      <div style={{
        minHeight: "100vh", background: "var(--night-warm)",
        display: "grid", placeItems: "center", color: "var(--ash-light)",
        fontFamily: "var(--serif)", fontStyle: "italic",
      }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <p>protocole introuvable</p>
          <button onClick={() => go && go("home")}
            style={pBtnGhost}>retour</button>
        </div>
      </div>
    );
  }

  // ── Persist ────────────────────────────────────────────────────
  // Crée ou met à jour le kairos / entry avec protocol_session_data.
  async function persist(finalAnswers, isCompleting = false) {
    const sessionData = {
      protocol_id: protocol.id,
      language: pLocale(),
      steps: protocol.steps.map(s => {
        const a = finalAnswers[s.id];
        return {
          id: s.id,
          type: s.type,
          answer: a?.answer ?? null,
          skipped: !!a?.skipped,
        };
      }),
      completed: isCompleting,
    };

    // Compose raw_text à partir des réponses textuelles
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
    const composed_raw_text = raw_text_parts.join("\n\n").slice(0, 8000) || `[${protocol.title}] dépôt protocolaire`;

    const protocolPatch = {
      protocol_used: protocol.id,
      protocol_session_data: sessionData,
    };
    if (isCompleting) {
      protocolPatch.protocol_completed_at = new Date().toISOString();
      if (protocol.target === "kairos" || protocol.target === "kairos_existing") {
        protocolPatch.protocol_step_count = protocol.steps.length;
      }
    }

    try {
      // CIBLE 1 : kairos_existing (réentrée) → PATCH kairosId existant
      if (protocol.target === "kairos_existing") {
        if (!savedRecordId) throw new Error("Réentrée sans kairosId");
        await fetch("/api/kairos/" + encodeURIComponent(savedRecordId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...await authHeaders() },
          body: JSON.stringify(protocolPatch),
        });
        return savedRecordId;
      }

      // CIBLE 2 : journal (Fin de Journée) → POST /api/journal/entries
      if (protocol.target === "journal") {
        if (!savedRecordId) {
          const res = await fetch("/api/journal/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json", ...await authHeaders() },
            body: JSON.stringify({
              raw_text: composed_raw_text,
            }),
          });
          const d = await res.json();
          if (!res.ok) throw new Error(d?.error || "POST journal failed");
          const newId = d?.entry?.id;
          setSavedRecordId(newId);
          // Patch protocol fields séparément
          if (newId) {
            await fetch("/api/journal/entries/" + encodeURIComponent(newId), {
              method: "PATCH",
              headers: { "Content-Type": "application/json", ...await authHeaders() },
              body: JSON.stringify(protocolPatch),
            }).catch(() => {});  // best effort — patch journal entry
          }
          return newId;
        }
        // Update existing journal entry
        await fetch("/api/journal/entries/" + encodeURIComponent(savedRecordId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...await authHeaders() },
          body: JSON.stringify({ raw_text: composed_raw_text, ...protocolPatch }),
        }).catch(() => {});
        return savedRecordId;
      }

      // CIBLE 3 : kairos (création + patch protocole)
      if (!savedRecordId) {
        const res = await window.DreamAPI.createKairos({
          raw_text: composed_raw_text,
          kairos_type: protocol.target_type || "reve",
          capture_method: "protocol",
        });
        const newId = res?.kairos?.id;
        setSavedRecordId(newId);
        if (newId) {
          await window.DreamAPI.updateKairos(newId, protocolPatch).catch(() => {});
        }
        return newId;
      }
      // Update existing kairos
      await window.DreamAPI.updateKairos(savedRecordId, {
        raw_text: composed_raw_text,
        ...protocolPatch,
      });
      return savedRecordId;
    } catch (e) {
      console.warn("[ProtocoleSubFlow.persist] failed:", e?.message);
      throw e;
    }
  }

  // Auth headers helper (mirroring api.jsx jsonFetch behavior)
  async function authHeaders() {
    try {
      const t = await window.DreamAuth?.getAccessToken?.();
      if (t) return { Authorization: "Bearer " + t };
    } catch {}
    return {};
  }

  // ── Save current step answer + advance ─────────────────────────
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
    setSubmitting(true); setError(null);
    try {
      const id = await persist(finalAnswers, true);
      setSavedRecordId(id);
      setCompleted(true);
      // Refresh global entries
      try { window.DreamRefreshEntries && setTimeout(() => window.DreamRefreshEntries(), 250); } catch {}
    } catch (e) {
      setError("Sauvegarde échouée — " + (e?.message || ""));
    } finally {
      setSubmitting(false);
    }
  }

  async function pauseAndSave() {
    setSubmitting(true);
    try {
      const id = await persist(answers, false);
      setSavedRecordId(id);
      // Navigate vers kairos detail si applicable
      if (protocol.target === "kairos" || protocol.target === "kairos_existing") {
        if (typeof go === "function") setTimeout(() => go("kairos", id), 400);
      } else if (protocol.target === "journal") {
        if (typeof go === "function") setTimeout(() => go("home-jour"), 400);
      } else {
        if (typeof go === "function") setTimeout(() => go("home"), 400);
      }
    } catch (e) {
      setError("Sauvegarde échouée — " + (e?.message || ""));
      setSubmitting(false);
    }
  }

  // ── Closing screen ─────────────────────────────────────────────
  if (completed) {
    return (
      <div style={pStageNight}>
        <div style={{
          maxWidth: 480, width: "100%", margin: "0 auto",
          textAlign: "center", paddingTop: "var(--s-7)",
        }}>
          <div style={{
            fontSize: 40, color: "var(--silk-gold)", opacity: 0.9, marginBottom: 16,
          }}>{protocol.glyph}</div>
          <h2 style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22,
            color: "var(--bone)", marginBottom: 12, textWrap: "pretty",
          }}>
            le protocole est complet
          </h2>
          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
            color: "var(--ash-light)", textWrap: "pretty",
            marginBottom: "var(--s-6)", lineHeight: 1.55,
          }}>
            ce que tu as déposé tient. tu peux y revenir quand tu veux.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            {(protocol.target === "kairos" || protocol.target === "kairos_existing") && savedRecordId && (
              <button onClick={() => go && go("kairos", savedRecordId)} style={pBtnPrimary}>
                ouvrir l'entrée
              </button>
            )}
            {protocol.target === "journal" && (
              <button onClick={() => go && go("home-jour")} style={pBtnPrimary}>
                voir Journal de Vie
              </button>
            )}
            <button onClick={() => go && go("home")} style={pBtnGhost}>
              retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step UI ────────────────────────────────────────────────────
  return (
    <div style={pStageNight}>
      {/* Header progress */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 18px var(--s-3)",
        maxWidth: 620, width: "100%", margin: "0 auto",
      }}>
        <button onClick={pauseAndSave} disabled={submitting}
          style={{
            background: "transparent", border: "none", cursor: submitting ? "wait" : "pointer",
            color: "var(--ash-light)", opacity: 0.7,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "8px 4px",
          }}>
          ← garder ce que j'ai
        </button>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em",
          color: "var(--ash-light)", opacity: 0.6,
        }}>
          {stepIdx + 1} / {totalSteps}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 6,
        padding: "0 18px var(--s-4)",
      }}>
        {protocol.steps.map((_, i) => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: i <= stepIdx ? "var(--silk-gold)" : "color-mix(in oklch, var(--ash-light) 40%, transparent)",
            opacity: i === stepIdx ? 1 : i < stepIdx ? 0.6 : 0.35,
            transition: "all 380ms ease",
          }} />
        ))}
      </div>

      {/* Title + subtitle */}
      <div style={{
        textAlign: "center", padding: "0 18px var(--s-5)",
        maxWidth: 540, width: "100%", margin: "0 auto",
      }}>
        <div style={{ fontSize: 22, color: "var(--silk-gold)", opacity: 0.85, marginBottom: 4 }}>
          {protocol.glyph}
        </div>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
          color: "var(--ash-light)", opacity: 0.85,
        }}>
          {pTxt(protocol, "title")}
        </div>
      </div>

      {/* Step body */}
      <div style={{
        flex: 1, maxWidth: 600, width: "100%", margin: "0 auto",
        padding: "0 22px",
      }}>
        <StepRenderer
          step={step}
          value={answers[step.id]?.answer}
          onSubmit={(answer) => recordAnswer(answer)}
          onSkip={step.skippable ? skipStep : null}
          submitting={submitting}
        />

        {error && (
          <div style={{
            color: "var(--ember-live, #C97A4A)",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            marginTop: 12, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Skip button (toujours visible) */}
        {step.skippable !== false && step.type !== "breathing" && step.type !== "info" && (
          <div style={{ textAlign: "center", marginTop: 18 }}>
            <button onClick={skipStep} disabled={submitting}
              style={{
                background: "transparent", border: "none",
                cursor: submitting ? "wait" : "pointer",
                color: "var(--ash-light)", opacity: 0.55,
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
                padding: "8px 12px",
              }}>
              passer cette question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// StepRenderer — dispatch par type de step
// ─────────────────────────────────────────────────────────────────

const StepRenderer = ({ step, value, onSubmit, onSkip, submitting }) => {
  if (!step) return null;
  const Q = (
    <p style={pQuestion}>{pTxt(step, "question")}</p>
  );
  const Hint = step.hint ? (
    <div style={pHint}>{step.hint}</div>
  ) : null;

  switch (step.type) {

    // ── Voix + textarea ───────────────────────────────────────
    case "textarea":
    case "title_short":
      return <TextareaStep step={step} Q={Q} Hint={Hint} value={value || ""}
        onSubmit={onSubmit} submitting={submitting}
        small={step.type === "title_short"} />;

    case "two_textareas":
      return <TwoTextareasStep step={step} Q={Q} Hint={Hint}
        value={value || ["", ""]}
        onSubmit={onSubmit} submitting={submitting} />;

    case "chips":
      return <ChipsStep step={step} Q={Q} Hint={Hint} value={value}
        onSubmit={onSubmit} multi={false} submitting={submitting} />;

    case "chips_multi":
      return <ChipsStep step={step} Q={Q} Hint={Hint} value={value || []}
        onSubmit={onSubmit} multi={true} submitting={submitting} />;

    case "binary":
      return <ChipsStep step={step} Q={Q} Hint={Hint} value={value}
        onSubmit={onSubmit} multi={false} submitting={submitting} binary />;

    case "slider":
      return <SliderStep step={step} Q={Q} Hint={Hint} value={value}
        onSubmit={onSubmit} submitting={submitting} />;

    case "body_zone":
      return <BodyZoneStep step={step} Q={Q} Hint={Hint} value={value}
        onSubmit={onSubmit} submitting={submitting} />;

    case "body_zone_full":
      return <BodyZoneFullStep step={step} Q={Q} Hint={Hint} value={value}
        onSubmit={onSubmit} submitting={submitting} />;

    case "aha_capture":
      return <AhaCaptureStep step={step} Q={Q} Hint={Hint}
        onSubmit={onSubmit} submitting={submitting} />;

    case "breathing":
      return <BreathingStep step={step} Q={Q} Hint={Hint} />;

    case "info":
      return <InfoStep step={step} Q={Q} Hint={Hint} />;

    default:
      return (
        <div style={{ textAlign: "center", color: "var(--ash-light)", padding: 24 }}>
          {Q}
          <div style={{ marginTop: 12, opacity: 0.5, fontFamily: "var(--mono)", fontSize: 11 }}>
            type "{step.type}" non géré — passer
          </div>
        </div>
      );
  }
};

// ── Sub-components by type ────────────────────────────────────────

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
      try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t; } catch {}
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
      mr.ondataavailable = ev => { if (ev.data.size > 0) chunksRef.current.push(ev.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: actualMime });
        setTranscribing(true);
        try {
          const r = await window.DreamAPI.transcribe(blob, actualMime);
          if (r?.text) setText(prev => (prev ? prev + " " : "") + r.text);
        } catch {} finally { setTranscribing(false); }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch {}
  };
  const stopRecord = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      {Q}
      {Hint}
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={step.placeholder || "…"}
        disabled={submitting}
        autoFocus
        rows={small ? 2 : 5}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "color-mix(in oklch, var(--night-floor) 60%, transparent)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
          padding: "16px 18px",
          color: "var(--bone)",
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, lineHeight: 1.55,
          outline: "none", resize: "vertical",
          marginTop: 18,
          transition: "border-color 380ms ease",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))"}
        onBlur={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"}
      />
      {transcribing && (
        <div style={{ color: "var(--silk-gold)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, marginTop: 8 }}>
          transcription en cours…
        </div>
      )}
      <div style={{
        marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 18,
      }}>
        <button onClick={recording ? stopRecord : startRecord}
          aria-label={recording ? "arrêter" : "voix"}
          style={pVoiceBtn(recording)}>
          {recording ? "■" : "🎙"}
        </button>
        <button
          onClick={() => onSubmit(text.trim())}
          disabled={submitting || text.trim().length < 1}
          style={pSubmitBtn(submitting || text.trim().length < 1)}>
          {submitting ? "…" : "⌄"}
        </button>
      </div>
      <div style={pSubmitLabel}>continuer</div>
    </div>
  );
};

const TwoTextareasStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const [a, setA] = pS(value[0] || "");
  const [b, setB] = pS(value[1] || "");
  return (
    <div>
      {Q}
      {Hint}
      <textarea
        value={a} onChange={e => setA(e.target.value)} disabled={submitting}
        placeholder="…" rows={3} autoFocus
        style={pTwoTaStyle()}
      />
      <p style={{ ...pQuestion, fontSize: 17, marginTop: 18 }}>
        {pTxt(step, "subQuestion")}
      </p>
      <textarea
        value={b} onChange={e => setB(e.target.value)} disabled={submitting}
        placeholder="…" rows={3}
        style={pTwoTaStyle()}
      />
      <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
        <button onClick={() => onSubmit([a.trim(), b.trim()])}
          disabled={submitting || (a.trim().length < 1 && b.trim().length < 1)}
          style={pSubmitBtn(submitting || (a.trim().length < 1 && b.trim().length < 1))}>
          {submitting ? "…" : "⌄"}
        </button>
      </div>
      <div style={pSubmitLabel}>continuer</div>
    </div>
  );
};

const ChipsStep = ({ step, Q, Hint, value, onSubmit, multi, submitting, binary }) => {
  const [sel, setSel] = pS(multi ? (Array.isArray(value) ? value : []) : value);
  const toggle = (k) => {
    if (multi) {
      setSel(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
    } else {
      setSel(k);
      // single → auto-submit après petit délai
      setTimeout(() => onSubmit(k), 280);
    }
  };
  return (
    <div>
      {Q}
      {Hint}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
        marginTop: 22,
      }}>
        {(step.chips || []).map(([k, l]) => {
          const active = multi ? sel.includes(k) : sel === k;
          return (
            <button key={k} onClick={() => toggle(k)} disabled={submitting}
              style={{
                padding: "10px 16px",
                borderRadius: 100,
                border: "1px solid " + (active
                  ? "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))"
                  : "color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))"),
                background: active
                  ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)"
                  : "transparent",
                color: active ? "var(--bone)" : "var(--ash-light)",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                cursor: submitting ? "wait" : "pointer",
                transition: "all 280ms ease",
              }}>
              {l}
            </button>
          );
        })}
      </div>
      {multi && (
        <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
          <button onClick={() => onSubmit(sel)} disabled={submitting}
            style={pSubmitBtn(submitting)}>
            {submitting ? "…" : "⌄"}
          </button>
        </div>
      )}
      {multi && <div style={pSubmitLabel}>continuer</div>}
    </div>
  );
};

const SliderStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const min = step.min || 1;
  const max = step.max || 5;
  const [v, setV] = pS(value || Math.round((min + max) / 2));
  return (
    <div style={{ textAlign: "center" }}>
      {Q}
      {Hint}
      <div style={{ marginTop: 28 }}>
        <input type="range" min={min} max={max} step="1"
          value={v} onChange={e => setV(parseInt(e.target.value, 10))}
          style={{ width: "100%", maxWidth: 320 }}
        />
        <div style={{
          marginTop: 12, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 24,
          color: "var(--silk-gold)",
        }}>
          {v} / {max}
        </div>
      </div>
      <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
        <button onClick={() => onSubmit(v)} disabled={submitting}
          style={pSubmitBtn(submitting)}>
          {submitting ? "…" : "⌄"}
        </button>
      </div>
      <div style={pSubmitLabel}>continuer</div>
    </div>
  );
};

const BodyZoneStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const ZONES_DEFAULT = ["corps_entier"];
  const ZONES_FULL = [
    ["tete", "tête"],
    ["gorge", "gorge"],
    ["coeur", "cœur"],
    ["ventre", "ventre"],
    ["bassin", "bassin"],
    ["jambes", "jambes"],
  ];
  // Read user pref for extended mode
  const ext = (() => { try { return localStorage.getItem("dream:felt-shift-mode") === "6-zones"; } catch { return false; } })();
  const [sel, setSel] = pS(value || null);
  return (
    <div>
      {Q}
      {Hint}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
        marginTop: 22,
      }}>
        {(ext ? ZONES_FULL : [["corps_entier", "dans tout le corps"]]).map(([k, l]) => {
          const active = sel === k;
          return (
            <button key={k} onClick={() => { setSel(k); setTimeout(() => onSubmit(k), 280); }}
              disabled={submitting}
              style={{
                padding: "10px 16px",
                borderRadius: 100,
                border: "1px solid " + (active
                  ? "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))"
                  : "color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))"),
                background: active
                  ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)"
                  : "transparent",
                color: active ? "var(--bone)" : "var(--ash-light)",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                cursor: submitting ? "wait" : "pointer",
              }}>
              {l}
            </button>
          );
        })}
        <button onClick={() => onSubmit("rien")} disabled={submitting}
          style={{
            padding: "10px 16px", borderRadius: 100,
            border: "none", background: "transparent",
            color: "var(--ash-light)", opacity: 0.6,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            cursor: submitting ? "wait" : "pointer",
          }}>
          rien ne bouge
        </button>
      </div>
    </div>
  );
};

// Body zone full — silhouette mini cliquable (pour Focusing)
const BodyZoneFullStep = ({ step, Q, Hint, value, onSubmit, submitting }) => {
  const [sel, setSel] = pS(value || null);
  // Mini silhouette : 8 zones cliquables
  const ZONES = [
    { id: "head",        label: "tête",          cx: 100, cy: 38,  r: 22 },
    { id: "throat",      label: "gorge",         cx: 100, cy: 76,  r: 11 },
    { id: "shoulders",   label: "épaules",       cx: 100, cy: 92,  r: 18 },
    { id: "heart",       label: "cœur",          cx: 100, cy: 118, r: 16 },
    { id: "belly",       label: "ventre",        cx: 100, cy: 168, r: 22 },
    { id: "lower_belly", label: "bas-ventre",    cx: 100, cy: 198, r: 17 },
    { id: "pelvis",      label: "bassin",        cx: 100, cy: 220, r: 15 },
    { id: "feet",        label: "pieds",         cx: 100, cy: 312, r: 13 },
  ];
  return (
    <div style={{ textAlign: "center" }}>
      {Q}
      {Hint}
      <svg viewBox="0 0 200 340" width="200" height="auto"
        style={{ maxHeight: 380, display: "block", margin: "16px auto 8px" }}>
        <g style={{
          fill: "color-mix(in oklch, var(--ash-mid) 40%, transparent)",
          stroke: "var(--ash-mid)", strokeWidth: 0.6,
        }}>
          <ellipse cx="100" cy="38" rx="22" ry="26" />
          <rect x="93" y="62" width="14" height="14" />
          <path d="M 70 76 Q 100 72 130 76 L 138 168 Q 100 178 62 168 Z" />
          <path d="M 64 170 L 136 170 L 132 222 Q 100 230 68 222 Z" />
          <path d="M 70 226 L 78 312 L 92 312 L 96 226 Z" />
          <path d="M 104 226 L 108 312 L 122 312 L 130 226 Z" />
          <path d="M 64 84 L 44 178 L 56 180 L 72 92 Z" />
          <path d="M 136 84 L 156 178 L 144 180 L 128 92 Z" />
        </g>
        {ZONES.map(z => {
          const active = sel === z.id;
          return (
            <circle key={z.id} cx={z.cx} cy={z.cy} r={z.r}
              style={{
                fill: active
                  ? "color-mix(in oklch, var(--silk-gold) 28%, transparent)"
                  : "transparent",
                stroke: active
                  ? "var(--silk-gold)"
                  : "color-mix(in oklch, var(--ash-light) 30%, transparent)",
                strokeWidth: active ? 1.5 : 0.5,
                cursor: submitting ? "wait" : "pointer",
                transition: "all 280ms ease",
              }}
              onClick={() => { setSel(z.id); setTimeout(() => onSubmit(z.id), 320); }}
            />
          );
        })}
      </svg>
      {sel && (
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
          color: "var(--silk-gold)", marginTop: 4,
        }}>
          {ZONES.find(z => z.id === sel)?.label}
        </div>
      )}
    </div>
  );
};

const AhaCaptureStep = ({ step, Q, Hint, onSubmit, submitting }) => {
  const [chosen, setChosen] = pS(null);
  const [note, setNote] = pS("");
  return (
    <div>
      {Q}
      {Hint}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center",
        marginTop: 22,
      }}>
        {[
          ["fort",    "ça résonne fort"],
          ["partiel", "partiel"],
          ["non",     "pas du tout"],
          ["note",    "autre — note libre"],
        ].map(([k, l]) => {
          const active = chosen === k;
          return (
            <button key={k} onClick={() => setChosen(k)} disabled={submitting}
              style={{
                padding: "10px 16px", borderRadius: 100,
                border: "1px solid " + (active
                  ? "color-mix(in oklch, var(--silk-gold) 60%, var(--bone))"
                  : "color-mix(in oklch, var(--silk-gold) 16%, var(--ash-deep))"),
                background: active
                  ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)"
                  : "transparent",
                color: active ? "var(--bone)" : "var(--ash-light)",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                cursor: submitting ? "wait" : "pointer",
              }}>
              {l}
            </button>
          );
        })}
      </div>
      {chosen === "note" && (
        <textarea value={note} onChange={e => setNote(e.target.value)}
          placeholder="ce qui s'est posé, ou ce qui n'a pas regardé…"
          disabled={submitting}
          rows={3}
          style={{
            ...pTwoTaStyle(),
            marginTop: 16,
          }}
        />
      )}
      {chosen && (
        <div style={{ marginTop: 22, display: "flex", justifyContent: "center" }}>
          <button onClick={() => onSubmit({ aha: chosen, note: note.trim() })}
            disabled={submitting}
            style={pSubmitBtn(submitting)}>
            {submitting ? "…" : "⌄"}
          </button>
        </div>
      )}
      <div style={{ ...pSubmitLabel, marginTop: 6 }}>déposer ton aha · achever</div>
    </div>
  );
};

const BreathingStep = ({ step, Q, Hint }) => {
  return (
    <div style={{ textAlign: "center", padding: "var(--s-5) 0" }}>
      {Q}
      {Hint}
      <div style={{
        margin: "32px auto 0",
        width: 100, height: 100, borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--silk-gold) 24%, transparent), color-mix(in oklch, var(--ember) 16%, transparent))",
        animation: "p-breath 14s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes p-breath {
          0%   { transform: scale(0.7); opacity: 0.6; }
          28%  { transform: scale(1.15); opacity: 1; }
          50%  { transform: scale(1.15); opacity: 1; }
          92%  { transform: scale(0.7); opacity: 0.6; }
          100% { transform: scale(0.7); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

const InfoStep = ({ Q, Hint }) => {
  return (
    <div style={{ textAlign: "center", padding: "var(--s-7) 0" }}>
      <div style={{
        fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 22,
        color: "var(--silk-gold)", marginBottom: 12,
        textWrap: "pretty",
      }}>
        {Q.props.children}
      </div>
      {Hint}
    </div>
  );
};

// ── Styles helpers ────────────────────────────────────────────────
const pStageNight = {
  minHeight: "100vh",
  background: "var(--night-warm)",
  color: "var(--bone)",
  paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)",
  paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
  position: "relative",
  display: "flex", flexDirection: "column",
};
const pCardBase = {
  border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
  padding: "var(--s-5) var(--s-4)",
  transition: "border-color 380ms ease, background 380ms ease",
};
const pBtnPrimary = {
  background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 50%, var(--bone))",
  color: "var(--bone)",
  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
  padding: "11px 22px", cursor: "pointer", letterSpacing: "0.02em",
  transition: "all 380ms ease",
};
const pBtnGhost = {
  background: "transparent", border: "none", cursor: "pointer",
  color: "var(--ash-light)", opacity: 0.6,
  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
  padding: "8px 0",
};
const pQuestion = {
  fontFamily: "var(--serif)", fontStyle: "italic",
  fontSize: 19, lineHeight: 1.45,
  color: "var(--bone)",
  textAlign: "center",
  marginTop: 12, marginBottom: 4,
  textWrap: "pretty",
  whiteSpace: "pre-line",
};
const pHint = {
  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
  color: "var(--ash-light)", opacity: 0.7,
  textAlign: "center", marginBottom: 4,
  textWrap: "pretty",
};
const pTwoTaStyle = () => ({
  width: "100%", boxSizing: "border-box",
  background: "color-mix(in oklch, var(--night-floor) 60%, transparent)",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
  padding: "14px 16px",
  color: "var(--bone)",
  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16, lineHeight: 1.55,
  outline: "none", resize: "vertical", marginTop: 12,
});
const pVoiceBtn = (recording) => ({
  background: "transparent",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))",
  borderRadius: "50%",
  width: 44, height: 44,
  cursor: "pointer",
  color: recording ? "var(--ember-live, #C97A4A)" : "var(--ash-light)",
  fontSize: 16, opacity: 0.85,
  display: "grid", placeItems: "center",
});
const pSubmitBtn = (disabled) => ({
  width: 60, height: 60, borderRadius: "50%",
  background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--ember) 32%, var(--night-warm)), color-mix(in oklch, var(--silk-gold) 18%, var(--night-floor)))",
  border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
  cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.45 : 1,
  display: "grid", placeItems: "center",
  color: "var(--bone)", fontSize: 22,
  boxShadow: "0 0 24px color-mix(in oklch, var(--silk-gold) 22%, transparent)",
  transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
});
const pSubmitLabel = {
  marginTop: 8, textAlign: "center",
  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
  color: "var(--ash-light)", opacity: 0.6, letterSpacing: "0.04em",
};

// ── Exports ───────────────────────────────────────────────────────
Object.assign(window, {
  CaptureChoiceScreen,
  ProtocoleSelector,
  ProtocoleSubFlow,
  ProtocoleDiscoveryReveal,
  shouldRevealProtocoles,
  markProtocolesRevealed,
  markProtocolesDismissed,
});
