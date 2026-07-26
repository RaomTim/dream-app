/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Journal de Vie LUMINEUX (révélation Tim 2026-04-25)
// Bible §3.1.bis + §3.1.ter — Le SUBSTRAT central de l'app, en mode JOUR.
// Design §7.1 refonte 2026-04-25.
//
// Patterns dominants :
//   - JOURNAL_DE_VIE_SUBSTRAT (centre architectural)
//   - JOURNAL_DAY_DASHBOARD (palette JOUR vs reste de l'app NUIT)
//   - KAIROS_WISDOM_SUMMON (bouton "appel sagesse des kairos")
//   - AUTO_CATEGORIZATION (Sonnet route en silence)
//
// L'écran est l'écran d'accueil par défaut. Inversion ontologique :
// papier patiné chaud, pas de dark-first. Le user vit le JOUR ici,
// les kairos chantent depuis la NUIT (le reste de l'app).
// ──────────────────────────────────────────────────────────────

const { useState: jS, useEffect: jE, useRef: jR, useCallback: jCB } = React;

// ── Palette JOUR (Design §5 ajout 2026-04-25) ─────────────────
const DAY_VARS = {
  "--day-paper": "oklch(0.92 0.018 75)",
  "--day-linen": "oklch(0.88 0.022 70)",
  "--day-clay-warm": "oklch(0.78 0.045 60)",
  "--day-bone-warm": "oklch(0.65 0.025 65)",
  "--day-ash-soft": "oklch(0.50 0.015 65)",
  "--day-sun-low": "oklch(0.72 0.090 75)",
  "--day-shadow": "oklch(0.40 0.020 280)",
};

const dayStyle = (extra = {}) => ({
  background: "var(--day-paper)",
  color: "var(--day-bone-warm)",
  fontFamily: "var(--serif)",
  ...DAY_VARS,
  ...extra,
});

// ── Header lumineux (lune en haut-droit pour passer NUIT) ─────
// 2026-04-25 v2 : ajout accès direct "tes kairos" (Journal de la nuit = liste
// des kairos déposés filtrable par type) qui était devenu invisible après refonte.
function JourHeader({ go, lunePhase = "lune décroissante" }) {
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "16px 24px", borderBottom: "1px solid color-mix(in oklch, var(--day-clay-warm) 30%, transparent)",
    }}>
      <div style={{
        fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
        color: "var(--day-ash-soft)", letterSpacing: "0.02em",
      }}>
        {today} · {lunePhase}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {/* 2026-04-26 — Accès Portrait depuis Vie (B+D §11.bis.4 : Portrait
            n'est plus en bottom-nav, accessible via Vie) */}
        <button onClick={() => go && go("portrait")}
          title="ta lettre du moment"
          aria-label="voir mon portrait"
          style={{
            background: "transparent",
            border: "1px solid color-mix(in oklch, var(--day-clay-warm) 35%, transparent)",
            borderRadius: 100,
            padding: "5px 12px 5px 10px",
            cursor: "pointer",
            color: "var(--day-bone-warm)",
            opacity: 0.85,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
            display: "flex", alignItems: "center", gap: 5,
            letterSpacing: "0.02em",
            transition: "all 380ms ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, transparent)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.background = "transparent"; }}>
          <span style={{ fontSize: 13 }}>✷</span>
          <span>mon portrait</span>
        </button>
        {/* 2026-04-26 (soir) — refonte porte RÊVE : ce bouton devient "retour à Dream"
            (icône ☾). C'était auparavant "tes kairos" → /journal ; le drill-down kairos
            reste accessible via mon portrait + journal entries (sous-pages). */}
        <button onClick={() => go && go("home")}
          title="retour à Dream — l'écran d'accueil rêve"
          aria-label="retour à Dream"
          style={{
            background: "transparent",
            border: "1px solid color-mix(in oklch, var(--day-clay-warm) 35%, transparent)",
            borderRadius: 100,
            padding: "5px 12px 5px 10px",
            cursor: "pointer",
            color: "var(--day-bone-warm)",
            opacity: 0.85,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
            display: "flex", alignItems: "center", gap: 5,
            letterSpacing: "0.02em",
            transition: "all 380ms ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, transparent)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.background = "transparent"; }}>
          <span style={{ fontSize: 13 }}>☾</span>
          <span>retour à Dream</span>
        </button>
        {/* Vue contemplative (ancien Home V1.2 — 1 rêve en grand) — reste sub-action discrète */}
        <button onClick={() => go && go("home-nuit")}
          title="vue contemplative (un seul kairos)"
          aria-label="vue contemplative"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            fontSize: 18, padding: "5px 8px",
            color: "var(--day-shadow)", opacity: 0.5,
            transition: "opacity 380ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
          ◌
        </button>
      </div>
    </div>
  );
}

// ── Champ de dépôt libre (geste central) ──────────────────────
function DeposerLibre({ onDepose }) {
  const [text, setText] = jS("");
  const [sending, setSending] = jS(false);
  const [recording, setRecording] = jS(false);
  const [error, setError] = jS(null);
  const [success, setSuccess] = jS(false);
  const [linkedHint, setLinkedHint] = jS(null);
  const taRef = jR(null);
  const mediaRef = jR(null);
  const chunksRef = jR([]);

  const PLACEHOLDERS = [
    "Que vis-tu, là, maintenant ?",
    "Qu'est-ce qui se demande aujourd'hui ?",
    "Qu'est-ce qui te traverse ?",
    "Que veux-tu déposer dans le journal ?",
    "Un doute, une joie, une question, un conflit ?",
  ];
  const placeholder = PLACEHOLDERS[Math.floor(Date.now() / 86400000) % PLACEHOLDERS.length];

  // 2026-04-25 — Consume __dreamJournalLinkedHint (set by Capture RITUAL_LATENCY)
  // Pré-remplissage contextuel quand l'user vient de déposer un kairos
  // et choisit "déposer une note de Journal de Vie liée"
  jE(() => {
    try {
      const hint = window.__dreamJournalLinkedHint;
      if (hint && Date.now() - hint.createdAt < 5 * 60 * 1000) {
        setLinkedHint(hint);
        // Pré-remplir le champ avec un prompt contextuel doux
        const snippet = (hint.source_text || "").slice(0, 80);
        const ellipsis = (hint.source_text || "").length > 80 ? "…" : "";
        setText(`En écho au kairos déposé («\u00a0${snippet}${ellipsis}\u00a0»), je note ici dans ma vie de jour : `);
        // Focus l'input après mount
        setTimeout(() => {
          if (taRef.current) {
            taRef.current.focus();
            taRef.current.setSelectionRange(taRef.current.value.length, taRef.current.value.length);
          }
        }, 100);
        // Consume the hint (one-shot)
        try { delete window.__dreamJournalLinkedHint; } catch {}
      }
    } catch {}
  }, []);

  const submit = async () => {
    if (text.trim().length < 1) return;
    // 2026-04-27 P1.4 — Optimistic UI : feedback immédiat (success state),
    // push API en background, track sync via dreamSyncBegin/End.
    const trimmed = text.trim();
    const linkedId = linkedHint?.linked_kairos_id || null;
    setSending(true); setError(null);
    setSuccess(true);
    setText("");
    setLinkedHint(null);
    setTimeout(() => setSuccess(false), 2500);

    const syncId = window.dreamSyncBegin ? window.dreamSyncBegin("createJournalEntry") : null;
    try {
      const r = await window.DreamAPI.createJournalEntry({
        raw_text: trimmed,
        linked_kairos_id: linkedId,
      });
      if (r?.entry?.id) {
        if (onDepose) onDepose(r.entry);
        if (window.dreamSyncEnd) window.dreamSyncEnd(syncId);
      } else if (r?.error) {
        setError(r.error);
        if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: r.error });
        try { window.dreamShowToast?.({
          text: "le dépôt n'a pas atteint l'app, reviens dans un instant",
          tone: "error", duration: 5000,
        }); } catch {}
      }
    } catch (e) {
      setError("Dépôt échoué : " + e.message);
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: e.message });
      try { window.dreamShowToast?.({
        text: "le dépôt n'a pas atteint l'app, reviens dans un instant",
        tone: "error", duration: 5000,
      }); } catch {}
    } finally {
      setSending(false);
    }
  };

  // Voice recording (simple — full webm/mp4 fallback)
  const pickMime = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = ["audio/webm;codecs=opus","audio/webm","audio/mp4","audio/aac","audio/ogg"];
    for (const t of candidates) {
      try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t; } catch {}
    }
    return "";
  };
  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickMime();
      const mr = new MediaRecorder(stream, mime ? { mimeType: mime } : {});
      const actual = mr.mimeType || mime || "audio/webm";
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: actual });
        try {
          const r = await window.DreamAPI.transcribe(blob, actual);
          if (r?.text) setText(p => (p ? p + "\n\n" : "") + r.text);
        } catch (e) { setError("Transcription : " + e.message); }
      };
      mediaRef.current = mr; mr.start(); setRecording(true);
    } catch (e) { setError("Micro inaccessible : " + e.message); }
  };
  const stopRec = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRecording(false);
  };

  return (
    <div style={{
      padding: "32px 24px",
      background: "var(--day-paper)",
    }}>
      {linkedHint && (
        <div style={{
          marginBottom: 12,
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
          color: "var(--day-clay-warm)", letterSpacing: "0.02em",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>☾</span>
          note de jour reliée à un kairos déposé
          <button
            onClick={() => { setLinkedHint(null); setText(""); }}
            aria-label="détacher"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--day-ash-soft)", fontSize: 12, marginLeft: "auto",
              fontFamily: "var(--serif)", fontStyle: "italic",
            }}>
            détacher
          </button>
        </div>
      )}
      <textarea
        ref={taRef}
        value={text}
        onChange={e => { setText(e.target.value); setError(null); }}
        placeholder={placeholder}
        disabled={sending}
        rows={4}
        style={{
          width: "100%",
          minHeight: 120,
          background: "var(--day-linen)",
          border: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
          borderRadius: 4,
          padding: "20px 24px",
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 18,
          lineHeight: 1.6,
          color: "var(--day-bone-warm)",
          outline: "none",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      {error && (
        <div style={{
          color: "var(--ember-live)", fontStyle: "italic", fontSize: 13,
          marginTop: 8, fontFamily: "var(--serif)",
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          color: "var(--day-clay-warm)", fontStyle: "italic", fontSize: 13,
          marginTop: 8, fontFamily: "var(--serif)",
        }}>
          déposé. l'app range en silence.
        </div>
      )}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginTop: 14,
      }}>
        <button
          onClick={recording ? stopRec : startRec}
          aria-label={recording ? "arrêter l'enregistrement" : "déposer en voix"}
          style={{
            background: "transparent",
            border: "1px solid var(--day-bone-warm)",
            borderRadius: "50%",
            width: 40, height: 40,
            cursor: "pointer",
            color: recording ? "var(--ember-live)" : "var(--day-bone-warm)",
            opacity: 0.7,
            transition: "all 280ms ease",
          }}>
          {recording ? "■" : "🎙"}
        </button>
        <button
          onClick={submit}
          disabled={sending || text.trim().length < 1}
          style={{
            background: "var(--day-clay-warm)",
            color: "var(--day-paper)",
            border: "none",
            padding: "12px 28px",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 15,
            letterSpacing: "0.02em",
            cursor: sending || text.trim().length < 1 ? "not-allowed" : "pointer",
            opacity: sending || text.trim().length < 1 ? 0.4 : 1,
            transition: "all 380ms ease",
          }}>
          {sending ? "…" : "déposer"}
        </button>
      </div>
    </div>
  );
}

// ── Section card (catégorie de vie) ───────────────────────────
function SectionCard({ section, onOpen }) {
  const empty = section.count === 0;
  return (
    <button
      onClick={() => onOpen(section)}
      disabled={empty}
      style={{
        background: empty ? "transparent" : "var(--day-linen)",
        border: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
        padding: "18px 20px",
        textAlign: "left",
        cursor: empty ? "default" : "pointer",
        fontFamily: "var(--serif)",
        color: "var(--day-bone-warm)",
        opacity: empty ? 0.45 : 1,
        transition: "all 380ms ease",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
      onMouseEnter={e => { if (!empty) e.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, var(--day-linen))"; }}
      onMouseLeave={e => { if (!empty) e.currentTarget.style.background = "var(--day-linen)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 18, color: "var(--day-clay-warm)" }}>{section.glyph}</span>
          <span style={{ fontSize: 16, fontStyle: "italic" }}>{section.label}</span>
        </div>
        {section.count > 0 && (
          <span style={{ fontSize: 12, color: "var(--day-ash-soft)", fontFamily: "var(--mono)" }}>
            ≈{section.count > 50 ? "50+" : section.count}
          </span>
        )}
      </div>
      {section.last_entry && (
        <div style={{
          fontSize: 13, color: "var(--day-ash-soft)", lineHeight: 1.5,
          fontStyle: "italic", marginTop: 4,
        }}>
          "{section.last_entry.raw_text}"
        </div>
      )}
      {empty && (
        <div style={{ fontSize: 12, fontStyle: "italic", color: "var(--day-ash-soft)" }}>
          encore vide
        </div>
      )}
    </button>
  );
}

// ── Modal Polyphonie (résultat appel sagesse) ─────────────────
function PolyphonieSheet({ summon, onClose, onFeedback }) {
  const [feltShift, setFeltShift] = jS(null);
  const [ahaLevel, setAhaLevel] = jS(null);
  const [ahaNote, setAhaNote] = jS("");
  const [submitted, setSubmitted] = jS(false);
  const [phase, setPhase] = jS("read"); // read | felt | aha | done

  const submit = async () => {
    if (submitted || !summon?.summon_id) return;
    setSubmitted(true);
    try {
      await window.DreamAPI.submitWisdomFeedback(summon.summon_id, {
        felt_shift_location: feltShift,
        aha_level: ahaLevel,
        aha_note: ahaNote.trim() || null,
      });
      if (onFeedback) onFeedback();
    } catch (e) {
      console.warn("feedback failed:", e.message);
    }
    setPhase("done");
    setTimeout(onClose, 1800);
  };

  if (!summon) return null;

  return (
    <div role="dialog" aria-modal="true"
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "color-mix(in oklch, var(--day-paper) 96%, var(--day-shadow))",
        overflowY: "auto",
        padding: "40px 24px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
      <div style={{ maxWidth: 600, width: "100%" }}>
        <button onClick={onClose}
          aria-label="fermer"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--day-ash-soft)", fontSize: 14, fontStyle: "italic",
            fontFamily: "var(--serif)", marginBottom: 24,
          }}>
          × fermer
        </button>

        {phase !== "done" && (
          <>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
              color: "var(--day-clay-warm)", marginBottom: 16, textTransform: "uppercase",
            }}>
              {/* P0.4 — TermDef sur "sagesse des kairos" (Design §11.bis.18) */}
              {window.TermDef
                ? <window.TermDef term="sagesse_des_kairos">sagesse des kairos</window.TermDef>
                : "sagesse des kairos"}
            </div>

            <p style={{
              fontFamily: "var(--serif)",
              fontSize: 19,
              lineHeight: 1.7,
              color: "var(--day-bone-warm)",
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
              marginBottom: 24,
              textWrap: "pretty",
            }}>
              {summon.polyphony_text}
            </p>

            {summon.voices_mobilisees && summon.voices_mobilisees.length > 0 && (
              <div style={{
                fontSize: 12, fontStyle: "italic", color: "var(--day-ash-soft)",
                fontFamily: "var(--serif)", marginBottom: 32,
                paddingTop: 12, borderTop: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
              }}>
                voix tissées : {summon.voices_mobilisees.join(", ")}
              </div>
            )}

            {phase === "read" && (
              <button onClick={() => setPhase("felt")}
                style={{
                  background: "var(--day-clay-warm)", color: "var(--day-paper)",
                  border: "none", padding: "12px 24px",
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                  cursor: "pointer", letterSpacing: "0.02em",
                }}>
                continuer
              </button>
            )}

            {phase === "felt" && (
              <div style={{ marginTop: 24 }}>
                <p style={{
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
                  color: "var(--day-bone-warm)", marginBottom: 20,
                }}>
                  Qu'est-ce qui shift dans ton corps ?
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                  {[
                    ["gorge","gorge"],["poitrine","poitrine"],["ventre","ventre"],
                    ["nuque","nuque"],["ailleurs","ailleurs"],["aucune","rien"],
                  ].map(([k, label]) => (
                    <button key={k} onClick={() => { setFeltShift(k); setPhase("aha"); }}
                      style={{
                        background: feltShift === k ? "var(--day-clay-warm)" : "transparent",
                        color: feltShift === k ? "var(--day-paper)" : "var(--day-bone-warm)",
                        border: "1px solid var(--day-clay-warm)",
                        padding: "10px 12px", fontSize: 13, fontStyle: "italic",
                        fontFamily: "var(--serif)", cursor: "pointer",
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === "aha" && (
              <div style={{ marginTop: 24 }}>
                <p style={{
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
                  color: "var(--day-bone-warm)", marginBottom: 20,
                }}>
                  Où est ton aha ?
                </p>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[["fort","résonne fort"],["peut-etre","peut-être"],["non","non"]].map(([k, l]) => (
                    <button key={k} onClick={() => setAhaLevel(k)}
                      style={{
                        flex: 1, background: ahaLevel === k ? "var(--day-clay-warm)" : "transparent",
                        color: ahaLevel === k ? "var(--day-paper)" : "var(--day-bone-warm)",
                        border: "1px solid var(--day-clay-warm)",
                        padding: "10px 12px", fontSize: 13, fontStyle: "italic",
                        fontFamily: "var(--serif)", cursor: "pointer",
                      }}>
                      {l}
                    </button>
                  ))}
                </div>
                <textarea
                  value={ahaNote}
                  onChange={e => setAhaNote(e.target.value)}
                  placeholder="une note libre (optionnel)…"
                  rows={2}
                  style={{
                    width: "100%",
                    background: "var(--day-linen)",
                    border: "1px solid color-mix(in oklch, var(--day-clay-warm) 20%, transparent)",
                    padding: "10px 14px",
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
                    color: "var(--day-bone-warm)", outline: "none",
                    boxSizing: "border-box", resize: "vertical",
                  }}
                />
                <button onClick={submit}
                  disabled={!ahaLevel || submitted}
                  style={{
                    marginTop: 16,
                    background: "var(--day-clay-warm)", color: "var(--day-paper)",
                    border: "none", padding: "12px 24px",
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                    cursor: ahaLevel ? "pointer" : "not-allowed",
                    opacity: ahaLevel ? 1 : 0.4,
                  }}>
                  enregistrer
                </button>
              </div>
            )}
          </>
        )}

        {phase === "done" && (
          <div style={{
            textAlign: "center", padding: "60px 0",
            fontFamily: "var(--serif)", fontStyle: "italic",
            color: "var(--day-clay-warm)", fontSize: 17,
          }}>
            tenu.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bouton "appel sagesse" sur entrée ou section ──────────────
function SummonButton({ entry_id = null, category = null, sub_category = null, onSummonStart, onSummonDone }) {
  const [loading, setLoading] = jS(false);

  const trigger = async (e) => {
    e?.stopPropagation();
    if (loading) return;
    setLoading(true);
    if (onSummonStart) onSummonStart();
    try {
      const r = await window.DreamAPI.summonKairosWisdom({ entry_id, category, sub_category });
      if (r.error) {
        alert(r.error);
      } else if (onSummonDone) {
        onSummonDone(r);
      }
    } catch (e) {
      alert("Échec : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={trigger} disabled={loading}
      title="appel à la sagesse des kairos"
      aria-label="appel à la sagesse des kairos"
      style={{
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--day-sun-low) 50%, transparent)",
        borderRadius: "50%",
        width: 32, height: 32,
        cursor: loading ? "wait" : "pointer",
        color: "var(--day-sun-low)",
        fontSize: 14,
        opacity: loading ? 0.5 : 0.85,
        transition: "all 380ms ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = "scale(1.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = loading ? 0.5 : 0.85; e.currentTarget.style.transform = "scale(1)"; }}>
      {loading ? "…" : "✦"}
    </button>
  );
}

// ── Main screen : Journal de Vie LUMINEUX ─────────────────────
function JournalDeVieJour({ go }) {
  const [sections, setSections] = jS([]);
  const [loading, setLoading] = jS(true);
  const [activeSummon, setActiveSummon] = jS(null);
  const [summonLoading, setSummonLoading] = jS(false);
  const [recentEntries, setRecentEntries] = jS([]);

  const refreshSections = jCB(async () => {
    setLoading(true);
    try {
      const [sects, entries] = await Promise.all([
        window.DreamAPI.listJournalSections(),
        window.DreamAPI.listJournalEntries({ limit: 5 }),
      ]);
      setSections(sects?.sections || []);
      setRecentEntries(entries?.entries || []);
    } catch (e) {
      console.warn("[Journal] refresh failed:", e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  jE(() => { refreshSections(); }, [refreshSections]);

  return (
    <div style={dayStyle({
      minHeight: "100vh",
      paddingBottom: 100, // espace pour bottom nav
    })}>
      <JourHeader go={go} />

      <DeposerLibre onDepose={() => refreshSections()} />

      {/* Section "récentes" — 5 dernières entrées avec bouton sagesse */}
      {recentEntries.length > 0 && (
        <div style={{ padding: "16px 24px 8px" }}>
          <div style={{
            fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
            color: "var(--day-ash-soft)", textTransform: "uppercase", marginBottom: 12,
          }}>
            récemment déposé
          </div>
          {recentEntries.map(e => (
            <div key={e.id}
              style={{
                background: "var(--day-linen)",
                padding: "14px 18px",
                marginBottom: 8,
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12,
                borderLeft: "2px solid var(--day-clay-warm)",
              }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                  color: "var(--day-bone-warm)", lineHeight: 1.6,
                }}>
                  {e.raw_text}
                </div>
                {e.category && (
                  <div style={{
                    fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
                    color: "var(--day-ash-soft)", marginTop: 6, textTransform: "uppercase",
                  }}>
                    {e.category}{e.sub_category ? " · " + e.sub_category : ""}
                  </div>
                )}
              </div>
              <SummonButton entry_id={e.id}
                onSummonStart={() => setSummonLoading(true)}
                onSummonDone={r => { setSummonLoading(false); setActiveSummon(r); }} />
            </div>
          ))}
        </div>
      )}

      {/* Sections de vie — grille verticale */}
      <div style={{ padding: "24px 24px 24px" }}>
        <div style={{
          fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
          color: "var(--day-ash-soft)", textTransform: "uppercase", marginBottom: 14,
        }}>
          tes domaines de vie
        </div>
        {loading ? (
          <div style={{ fontStyle: "italic", color: "var(--day-ash-soft)", fontSize: 14 }}>
            …
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
            {sections.map(s => (
              <div key={s.category} style={{ position: "relative" }}>
                <SectionCard section={s} onOpen={() => go && go("journal-section", s)} />
                {s.count > 0 && (
                  <div style={{
                    position: "absolute", top: 14, right: 14,
                  }}>
                    <SummonButton category={s.category}
                      onSummonStart={() => setSummonLoading(true)}
                      onSummonDone={r => { setSummonLoading(false); setActiveSummon(r); }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {summonLoading && (
        <SummonLoadingModal dark={false} />
      )}

      {activeSummon && (
        <PolyphonieSheet summon={activeSummon}
          onClose={() => setActiveSummon(null)}
          onFeedback={() => {}} />
      )}
    </div>
  );
}

// 2026-04-27 — Sprint P0.5 (Design §11.bis.19)
// Modal partagée pendant summonKairosWisdom (5-10s) :
// LoadingHalo + skeleton 5 lignes + message rotating "les kairos résonnent…"
// Adaptive day/night via prop dark.
function SummonLoadingModal({ dark = false }) {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const messages = [
    "les kairos résonnent…",
    "écouter ce qui revient…",
    "tisser les voix…",
  ];
  const message = useRotating ? useRotating(messages, 2400) : messages[0];

  const overlayBg = dark
    ? "color-mix(in oklch, var(--night-floor) 78%, transparent)"
    : "color-mix(in oklch, var(--day-paper) 88%, var(--day-shadow, transparent))";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: overlayBg,
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--s-5)",
    }}>
      <div className="dream-skeleton-fade-in" style={{
        maxWidth: 460, width: "100%",
        display: "flex", flexDirection: "column", gap: 20,
        padding: "28px 24px",
        background: dark
          ? "color-mix(in oklch, var(--night-warm) 70%, var(--night-floor))"
          : "color-mix(in oklch, var(--day-linen, #DFD3BF) 35%, var(--day-paper, #EBE2D2))",
        border: "1px solid " + (dark
          ? "color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))"
          : "color-mix(in oklch, var(--day-clay-warm, #C9B098) 35%, transparent)"),
      }}>
        {Halo
          ? <Halo size={32} message={null} dark={dark} />
          : <div style={{
              width: 32, height: 32, borderRadius: "50%",
              border: "1px solid " + (dark ? "var(--silk-gold)" : "var(--day-clay-warm)"),
              animation: "halo-slow 2.5s ease-in-out infinite",
              alignSelf: "center",
            }} />}
        {Shim && (
          <Shim lines={5} height={12} gap={12} dark={dark} lastLineWidth="62%" />
        )}
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
          color: dark ? "var(--ash-light)" : "var(--day-bone-warm, #9F8E7C)",
          textAlign: "center", textWrap: "pretty",
          opacity: 0.9,
        }}>
          {message}
        </div>
      </div>
    </div>
  );
}

// Expose for nightly Journal screen reuse
window.SummonLoadingModal = SummonLoadingModal;

// ── Helpers : relative date for drill-down ────────────────────
function relativeDateJour(iso) {
  if (!iso) return "récemment";
  const now = Date.now();
  const t = new Date(iso).getTime();
  const dh = (now - t) / 3600000;
  if (dh < 1) return "à l'instant";
  if (dh < 12) return "ce matin";
  if (dh < 24) return "aujourd'hui";
  if (dh < 36) return "hier soir";
  if (dh < 48) return "hier";
  if (dh < 24 * 7) return "il y a " + Math.floor(dh / 24) + " jours";
  if (dh < 24 * 30) return "il y a " + Math.floor(dh / (24 * 7)) + " semaine(s)";
  if (dh < 24 * 60) return "il y a une lune";
  if (dh < 24 * 90) return "il y a deux lunes";
  return "il y a plusieurs lunes";
}

// ── Sub-categories canoniques pour 'relations' ────────────────
const RELATIONS_SUBS = [
  ["all",        "toutes"],
  ["amour",      "amour"],
  ["famille",    "famille"],
  ["amis",       "amis"],
  ["collegues",  "collègues"],
  ["rencontres", "rencontres"],
];

// ── JournalSectionDrillDown — vue chronologique inversée ──────
// Design §7.1 + §3.1.bis
// Drill-down d'une section du Journal de Vie LUMINEUX.
// Header lumineux + bouton sagesse de section + liste entries
// + bouton sagesse individuel + bouton "déposer un kairos lié"
function JournalSectionDrillDown({ go, section }) {
  const safeSection = section || { category: "travail", label: "section", glyph: "◇", count: 0 };
  const isRelations = safeSection.category === "relations";

  const [entries, setEntries] = jS([]);
  const [loading, setLoading] = jS(true);
  const [activeSub, setActiveSub] = jS("all");
  const [activeSummon, setActiveSummon] = jS(null);
  const [summonLoading, setSummonLoading] = jS(false);

  const refreshEntries = jCB(async () => {
    setLoading(true);
    try {
      const params = { category: safeSection.category, limit: 100 };
      if (isRelations && activeSub !== "all") params.sub_category = activeSub;
      const r = await window.DreamAPI.listJournalEntries(params);
      setEntries(r?.entries || []);
    } catch (e) {
      console.warn("[JournalSectionDrillDown] refresh failed:", e.message);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [safeSection.category, isRelations, activeSub]);

  jE(() => { refreshEntries(); }, [refreshEntries]);

  // Bouton "déposer un kairos lié" — navigue vers Capture (NUIT)
  // avec un hint inversé : la note Journal devient le contexte du kairos
  const goCaptureFromEntry = (entry) => {
    try {
      window.__dreamCaptureLinkedHint = {
        from_journal_entry_id: entry.id,
        from_journal_text: entry.raw_text,
        from_category: safeSection.category,
        createdAt: Date.now(),
      };
    } catch {}
    go("capture");
  };

  return (
    <div style={dayStyle({
      minHeight: "100vh",
      paddingBottom: 100,
    })}>
      {/* Header lumineux : retour + label + count */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid color-mix(in oklch, var(--day-clay-warm) 30%, transparent)",
      }}>
        <button onClick={() => go && go("home")}
          aria-label="retour au journal"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--day-ash-soft)", fontSize: 13, fontStyle: "italic",
            fontFamily: "var(--serif)", padding: "4px 0",
          }}>
          ← journal
        </button>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
          color: "var(--day-ash-soft)",
        }}>
          {entries.length > 0 ? `${entries.length} entrée${entries.length > 1 ? "s" : ""}` : ""}
        </div>
      </div>

      {/* Titre section + glyphe */}
      <div style={{ padding: "24px 24px 12px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontSize: 28, color: "var(--day-clay-warm)" }}>
            {safeSection.glyph}
          </span>
          <h2 style={{
            margin: 0,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 26,
            color: "var(--day-bone-warm)", fontWeight: 400,
            letterSpacing: "0.01em",
          }}>
            {safeSection.label}
          </h2>
        </div>
      </div>

      {/* Bouton "appel sagesse des kairos sur cette section" — proéminent */}
      <div style={{
        padding: "8px 24px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        {window.SummonButton && (
          <window.SummonButton
            category={safeSection.category}
            sub_category={isRelations && activeSub !== "all" ? activeSub : null}
            onSummonStart={() => setSummonLoading(true)}
            onSummonDone={r => { setSummonLoading(false); setActiveSummon(r); }}
          />
        )}
        <span style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
          color: "var(--day-bone-warm)", letterSpacing: "0.01em",
        }}>
          appel à la sagesse des kairos sur cette section
        </span>
      </div>

      {/* Sub-categories tabs (relations only) */}
      {isRelations && (
        <div style={{
          padding: "0 24px 16px",
          display: "flex", flexWrap: "wrap", gap: 8,
        }}>
          {RELATIONS_SUBS.map(([k, l]) => (
            <button key={k}
              onClick={() => setActiveSub(k)}
              style={{
                background: activeSub === k
                  ? "var(--day-clay-warm)"
                  : "transparent",
                color: activeSub === k
                  ? "var(--day-paper)"
                  : "var(--day-bone-warm)",
                border: "1px solid color-mix(in oklch, var(--day-clay-warm) 50%, transparent)",
                padding: "6px 14px",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
                cursor: "pointer",
                borderRadius: 999,
                transition: "all 280ms ease",
              }}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* Liste chronologique inversée des entries */}
      <div style={{ padding: "0 24px 24px" }}>
        {loading ? (
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
            color: "var(--day-ash-soft)", padding: "40px 0", textAlign: "center",
          }}>
            les entrées s'éveillent…
          </div>
        ) : entries.length === 0 ? (
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
            color: "var(--day-ash-soft)", padding: "40px 0", textAlign: "center",
            lineHeight: 1.6, textWrap: "pretty",
          }}>
            cette section ne tient encore rien.<br />
            dépose une note depuis l'accueil pour commencer.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {entries.map(e => (
              <article key={e.id}
                style={{
                  background: "var(--day-linen)",
                  border: "1px solid color-mix(in oklch, var(--day-clay-warm) 18%, transparent)",
                  padding: "16px 18px",
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                {/* Header : date relative + sub_category */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                }}>
                  <span style={{
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
                    color: "var(--day-ash-soft)",
                  }}>
                    {relativeDateJour(e.created_at)}
                  </span>
                  {e.sub_category && (
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
                      color: "var(--day-clay-warm)", textTransform: "uppercase",
                    }}>
                      {e.sub_category}
                    </span>
                  )}
                </div>

                {/* Texte de l'entry */}
                <p style={{
                  margin: 0,
                  fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.6,
                  color: "var(--day-bone-warm)", fontStyle: "italic",
                  textWrap: "pretty",
                }}>
                  {e.raw_text}
                </p>

                {/* Linked kairos badge if any */}
                {e.linked_kairos_id && (
                  <div style={{
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11,
                    color: "var(--day-clay-warm)", letterSpacing: "0.02em",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 12 }}>☾</span>
                    relié à un kairos
                  </div>
                )}

                {/* Actions row : sagesse + déposer kairos lié */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginTop: 4, gap: 12,
                }}>
                  <button
                    onClick={() => goCaptureFromEntry(e)}
                    style={{
                      background: "transparent",
                      border: "1px solid color-mix(in oklch, var(--day-bone-warm) 30%, transparent)",
                      color: "var(--day-bone-warm)",
                      padding: "6px 12px",
                      fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
                      cursor: "pointer", letterSpacing: "0.02em",
                      transition: "all 280ms ease",
                    }}
                    onMouseEnter={ev => ev.currentTarget.style.background = "color-mix(in oklch, var(--day-clay-warm) 8%, transparent)"}
                    onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                    déposer un kairos lié
                  </button>

                  {window.SummonButton && (
                    <window.SummonButton
                      entry_id={e.id}
                      onSummonStart={() => setSummonLoading(true)}
                      onSummonDone={r => { setSummonLoading(false); setActiveSummon(r); }}
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Loading overlay summon — Sprint P0.5 (Design §11.bis.19) */}
      {summonLoading && (
        <SummonLoadingModal dark={false} />
      )}

      {/* Polyphonie modal */}
      {activeSummon && window.PolyphonieSheet && (
        <window.PolyphonieSheet
          summon={activeSummon}
          onClose={() => setActiveSummon(null)}
          onFeedback={() => {}}
        />
      )}
    </div>
  );
}

// Expose globally for app.jsx routing
window.JournalDeVieJour = JournalDeVieJour;
window.SummonButton = SummonButton;
window.PolyphonieSheet = PolyphonieSheet;
window.JournalSectionDrillDown = JournalSectionDrillDown;
