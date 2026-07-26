/* global React */
const { useState: uFS, useEffect: uFE, useMemo: uFM, useRef: uFR } = React;

// ── Détail Figure (typing Seth backend invisible) ──────────
// La typologie de Jane Roberts / Seth est utilisée en interne pour structurer
// la reconnaissance des figures, mais JAMAIS exposée comme label à l'utilisatrice.
// On ne dit pas "c'est un archétype aspect-personnalité fragmentaire" —
// on dit "elle revient quand tu t'approches d'une décision."

const seedFigure = {
  id: "fig-grandmere",
  nom: "la grand-mère sans feu",
  apparu: "depuis onze mois",
  occurrences: 14,
  firstSeen: "dans un rêve de janvier, il y a onze mois",
  lastSeen: "ce matin, avant le réveil",
  glyph: "◐",
  // backend seth typing (invisible à l'UI, pour référence dev)
  _sethInternal: { classification: "aspect-gardien", polarity: "réceptif", fragmentLevel: "2" },
  description: "elle lave. du linge, de la vaisselle, parfois tes pensées. jamais en feu. elle ne te regarde pas, mais elle est là quand tu t'approches de ce qui a été laissé.",
  moments: [
    { id: "m-1", when: "il y a onze mois", kairosId: "k-99", text: "première apparition : elle chante dans une langue que tu ne connais pas. tu pleures sans comprendre.", transform: false },
    { id: "m-2", when: "il y a sept mois", kairosId: "k-85", text: "elle tient ta main pendant que tu signes un contrat que tu ne veux pas signer.", transform: false },
    { id: "m-3", when: "il y a cinq mois", kairosId: "k-72", text: "tu la vois de dos pour la première fois. elle n'est plus vieille. elle a ton âge.", transform: true, transformNote: "elle change d'âge — la figure commence à se rapprocher" },
    { id: "m-4", when: "il y a deux lunes", kairosId: "k-42", text: "elle n'apparaît pas. mais tu vois son linge étendu, sec, dans le rêve de quelqu'un d'autre.", transform: false },
    { id: "m-5", when: "il y a une lune", kairosId: "k-24", text: "elle te donne une clé. tu ne sais pas ce qu'elle ouvre. tu la glisses dans ta poche.", transform: true, transformNote: "premier don de sa part — la figure s'adresse à toi" },
    { id: "m-6", when: "ce matin", kairosId: "k-08", text: "elle sait ton nom. elle ne le dit pas à voix haute. tu l'entends quand même.", transform: true, transformNote: "elle te reconnaît — ou se reconnaît" },
  ],
  resonances: ["ancêtre", "maternel non-biologique", "seuil", "lavage"],
  appearsIn: ["dream_night", "synchronicity", "somatic_shiver"],
};

const FigureDetailScreen = ({ go }) => {
  const figure = seedFigure;
  const [mode, setMode] = uFS("timeline"); // timeline | dialogue
  const [dialogue, setDialogue] = uFS([
    { role: "ai", text: "elle est là, pas loin. veux-tu lui parler de ce rêve de ce matin ?" },
  ]);
  const [input, setInput] = uFS("");
  const [pending, setPending] = uFS(false);
  const scrollRef = uFR(null);

  uFE(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [dialogue, pending]);

  const send = async () => {
    if (!input.trim() || pending) return;
    const msg = input.trim();
    setInput("");
    setDialogue(d => [...d, { role: "user", text: msg }]);
    setPending(true);

    // Build messages array for /api/chat
    const apiMessages = dialogue
      .map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text }))
      .concat([{ role: "user", content: msg }]);

    let buffer = "";
    try {
      await window.DreamAPI.chat({
        messages: apiMessages,
        mode: "dream",
        dreamId: null,
        locale: "fr",
        onChunk: (c) => { buffer += c; },
        onDone: () => {
          if (buffer.trim()) {
            setDialogue(d => [...d, { role: "ai", text: buffer.trim() }]);
          }
          setPending(false);
        },
        onError: () => {
          setDialogue(d => [...d, { role: "ai", text: "le silence, cette fois. essaie tout à l'heure." }]);
          setPending(false);
        },
      });
    } catch (e) {
      setDialogue(d => [...d, { role: "ai", text: "le silence, cette fois. essaie tout à l'heure." }]);
      setPending(false);
    }
  };

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <window.TopNav showBack onBack={() => go("portrait")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          portrait · figure
        </div>

        <div className="row mb-l" style={{ alignItems: "baseline", gap: "var(--s-4)", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 42, color: "var(--silk-gold)", lineHeight: 1 }}>
            {figure.glyph}
          </span>
          <div>
            <h1 className="h1-seuil" style={{ fontStyle: "italic" }}>{figure.nom}</h1>
            <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 4 }}>
              {figure.occurrences} apparitions · {figure.apparu}
            </div>
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            comment elle arrive
          </div>
          <p className="h3-lecture" style={{ fontSize: 20, textWrap: "pretty", fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--bone)" }}>
            {figure.description}
          </p>
        </div>

        <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
          {figure.resonances.map(r => (
            <span key={r} style={{
              padding: "4px 12px", border: "1px solid var(--ash-deep)",
              fontSize: 12, color: "var(--ash-light)",
              fontFamily: "var(--serif)", fontStyle: "italic",
            }}>{r}</span>
          ))}
        </div>

        <div className="row gap-s mb-l">
          <button className={"chip " + (mode === "timeline" ? "active" : "")} onClick={() => setMode("timeline")}>
            ses apparitions
          </button>
          <button className={"chip " + (mode === "dialogue" ? "active" : "")} onClick={() => setMode("dialogue")}>
            explorer cette figure
          </button>
        </div>

        {mode === "timeline" && (
          <>
            <div className="divider-moon">chronologie</div>
            <div className="figure-timeline">
              {figure.moments.map((m, i) => (
                <div key={m.id} className={"figure-moment " + (m.transform ? "transform" : "")}>
                  <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)" }}>
                    {m.when}
                  </div>
                  <p className="body mb-s" style={{ textWrap: "pretty", fontSize: 15.5 }}>
                    {m.text}
                  </p>
                  {m.transform && (
                    <div className="meta" style={{
                      fontFamily: "var(--serif)", fontStyle: "italic",
                      color: "var(--silk-gold)",
                      padding: "4px 10px",
                      display: "inline-block",
                      border: "1px solid var(--silk-gold)",
                      marginTop: 4,
                      fontSize: 12,
                    }}>
                      ↓ {m.transformNote}
                    </div>
                  )}
                  <div className="mt-s">
                    <button className="btn-text" onClick={() => go("kairos", m.kairosId)}>
                      revenir au kairos →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="divider-moon">ce qu'on observe, doucement</div>
            <div className="card" style={{ background: "color-mix(in oklch, var(--obsidian) 25%, transparent)" }}>
              <p className="body" style={{ textWrap: "pretty", fontStyle: "italic", fontFamily: "var(--serif)" }}>
                Sa posture a changé trois fois cette année. Elle s'adresse à toi plus souvent depuis l'automne. Elle apparaît près de 78% de tes kairos où il est question d'héritage — lignées, dettes, promesses tenues ou rompues.
              </p>
              <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                ce ne sont pas des conclusions. des motifs que nous avons remarqués — tu peux ne pas les voir comme nous.
              </div>
            </div>
          </>
        )}

        {mode === "dialogue" && (
          <>
            <div className="divider-moon">explorer</div>
            <p className="meta op-70 mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty" }}>
              ici elle parle avec sa voix, pas avec celle de la narratrice. ce n'est pas la figure elle-même — c'est une écoute imaginée, tenue par l'app. garde ce qui résonne, laisse ce qui sonne faux.
            </p>

            <div ref={scrollRef}
              className="stack gap-m"
              style={{ maxHeight: 420, overflowY: "auto", padding: "var(--s-3) 0" }}>
              {dialogue.map((m, i) => (
                <div key={i} className={"bubble " + m.role}>
                  {m.text}
                </div>
              ))}
              {pending && (
                <div className="bubble ai" style={{ opacity: 0.5 }}>
                  <span style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>…</span>
                </div>
              )}
            </div>

            <div className="row gap-s mt-l" style={{ alignItems: "flex-end" }}>
              <textarea className="field-textarea"
                style={{ minHeight: 70, fontSize: 16 }}
                placeholder="parle-lui, ou pose-lui une question simple…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
                }} />
              <button className="btn-ghost" disabled={pending || !input.trim()} onClick={send}>
                offrir
              </button>
            </div>
            <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              si à un moment ça tangue, ferme. reviens à ton corps. ce dialogue t'attendra.
            </div>
          </>
        )}
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

// ── Feedback in-app (bouton + modal) ────────────────────────
const FeedbackFloat = () => {
  const [open, setOpen] = uFS(false);
  return (
    <>
      <button className="fb-float" onClick={() => setOpen(true)} aria-label="feedback" title="feedback">
        <svg viewBox="0 0 16 16"><path d="M3 3h10v7H7l-3 3v-3H3z" /></svg>
      </button>
      {open && <FeedbackModal onClose={() => setOpen(false)} />}
    </>
  );
};

const FeedbackModal = ({ onClose }) => {
  const [step, setStep] = uFS(0);
  const [context, setContext] = uFS(null);
  const [severity, setSeverity] = uFS(null);
  const [text, setText] = uFS("");
  const [submitting, setSubmitting] = uFS(false);

  // Map V1.2 severity to backend enum
  const sevMap = { whisper: "low", trouble: "medium", urgent: "high" };

  const submit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const screen = (location.hash || "").replace("#", "") || "unknown";
      await window.DreamAPI.submitFeedback({
        context_type: context || "feature",
        context_id: screen,
        feedback_text: text.trim(),
        severity: sevMap[severity] || "low",
        user_email: window.DreamUser?.email || null,
      });
    } catch (e) {
      console.warn("[Feedback] submit failed:", e.message);
    } finally {
      setSubmitting(false);
      setStep(2);
    }
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="row mb-l" style={{ justifyContent: "space-between" }}>
          <div>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              feedback
            </div>
            <h2 className="h2-section" style={{ fontSize: 22 }}>ce qui te traverse ?</h2>
          </div>
          <button className="btn-text" onClick={onClose}>×</button>
        </div>

        {step === 0 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              c'est à propos de…
            </div>
            <div className="stack gap-s mb-l">
              {[
                ["voix", "la voix de la narratrice"],
                ["lecture", "une lecture qui ne m'a pas regardée"],
                ["flow", "un geste qui bloque ou ne respire pas"],
                ["tech", "un bug, un écran qui saute"],
                ["idee", "une idée, un manque, un souhait"],
                ["atmosphere", "l'atmosphère, la tonalité"],
                ["autre", "autre chose"],
              ].map(([k, l]) => (
                <button key={k}
                  onClick={() => setContext(k)}
                  style={{
                    textAlign: "left", padding: "10px 14px",
                    border: "1px solid " + (context === k ? "var(--bone)" : "var(--ash-deep)"),
                    background: context === k ? "color-mix(in oklch, var(--bone) 4%, transparent)" : "transparent",
                    color: context === k ? "var(--bone)" : "var(--ash-light)",
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14.5,
                  }}>
                  {l}
                </button>
              ))}
            </div>

            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              intensité
            </div>
            <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
              {[
                ["whisper", "léger — pour plus tard"],
                ["trouble", "ça me trouble"],
                ["urgent", "urgent — ça blesse"],
              ].map(([k, l]) => (
                <button key={k}
                  className={"chip " + (severity === k ? "active" : "")}
                  onClick={() => setSeverity(k)}
                  style={severity === k && k === "urgent" ? { borderColor: "var(--ember-live)", color: "var(--ember-live)" } : {}}>
                  {l}
                </button>
              ))}
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn-ghost"
                disabled={!context || !severity}
                onClick={() => setStep(1)}>
                continuer
              </button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              dis-nous ce qui se passe
            </div>
            <textarea className="field-textarea mb-m"
              placeholder={context === "voix" ? "qu'est-ce que la narratrice a dit qui n'a pas regardé juste ?" :
                context === "lecture" ? "quelle lecture, quelle phrase — et ce qui t'a pincée ?" :
                context === "urgent" ? "prends ton temps." :
                "ce qui s'est passé, ce que tu aurais voulu à la place"}
              value={text} onChange={(e) => setText(e.target.value)}
              style={{ minHeight: 140 }} />

            {severity === "urgent" && (
              <div className="card mb-m" style={{ background: "color-mix(in oklch, var(--ember-live) 6%, transparent)", borderColor: "var(--ember-live)", padding: "var(--s-4)" }}>
                <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
                  avant de soumettre
                </div>
                <p className="body" style={{ textWrap: "pretty", fontSize: 14 }}>
                  Si tu es en crise immédiate, nous ne sommes pas l'endroit. SOS Amitié : 09 72 39 40 50. Ligne 3114 (prévention suicide) : 3114. Ce formulaire sera lu dans les 24h — pas plus tôt.
                </p>
              </div>
            )}

            <div className="row mb-m gap-s">
              <button className="chip">
                joindre l'écran où j'étais
              </button>
              <button className="chip">
                répondre-moi (me recontacter)
              </button>
            </div>

            <div className="meta op-70 mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty" }}>
              aucun de tes kairos n'est envoyé. seulement ton message, et — si tu le demandes — la capture d'écran que tu acceptes.
            </div>

            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>← retour</button>
              <button className="btn-ghost" disabled={!text.trim() || submitting} onClick={submit}>
                {submitting ? "envoi…" : "déposer"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center" style={{ padding: "var(--s-5) 0" }}>
            <div className="breath mb-l" style={{ width: 60, height: 60 }} />
            <p className="seuil-italic mb-s" style={{ maxWidth: 380, margin: "0 auto" }}>
              reçu. merci de tenir l'app debout avec nous.
            </p>
            <div className="meta op-70 mt-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              si tu as demandé une réponse, tu en auras une. sinon, ton message est lu — simplement — et il compte.
            </div>
            <button className="btn-text mt-xl" onClick={onClose}>refermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { FigureDetailScreen, FeedbackFloat, FeedbackModal });
