/* global React */
// ──────────────────────────────────────────────────────────────
// Dream — V1.2 amplification · Vague 2
// 8 écrans pivotaux refondus avec les fondations V1.2.
//
// Stratégie : ce fichier OVERRIDE les composants originaux via
// window.X = AmplifiedX. Aucune modif aux fichiers source.
// Rollback = retirer le <script src="screens-v12-amplified.jsx">.
//
// Écrans amplifiés (overrides) :
//   1. Home          — Surface linen + spirale de fond + breath welcome
//   2. Capture       — gate ember braise + Wow1 spirale au dépôt
//   3. KairosDetail  — halo silk respirant + Wow3 BigDream marquage
//   4. Portrait      — ConstellationD3 vivant
//   5. AnimaVoute    — D3 + demi-cercle aurore + songlines
//   6. Chat          — surface paper + halo silk discret
//   7. ReentryScreen — triangle rituel + matter ember/earth selon phase
//   8. BigDreamSignal — drop cap + halo combiné + revisits
//
// Tous les écrans préservent : navigation, AhaCapture, FeltShiftGate,
// ExitToHuman, FeedbackFloat, contenu textuel, vocabulaire désensorcelé.
// ──────────────────────────────────────────────────────────────

const { useState: vS, useEffect: vE, useRef: vR, useMemo: vM, useCallback: vC } = React;

// ══════════════════════════════════════════════════════════════
// 1. HOME — Surface linen + spirale subtle background + breath welcome
// ══════════════════════════════════════════════════════════════
const HomeV12 = ({ go, entries }) => {
  const latest = entries[0];
  const [welcomed, setWelcomed] = vS(false);

  // breath de bienvenue : 1 cycle souffle (6s) puis fade
  vE(() => {
    const t = setTimeout(() => setWelcomed(true), 6200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="stage screen-enter">
      {/* Surface linen pleine page */}
      <window.Surface matter="linen" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none"
      }} />

      {/* Spirale géosymbolique très très discrète en fond, derrière la card */}
      <div style={{
        position: "absolute", top: "30%", left: "50%",
        transform: "translate(-50%, -40%)",
        width: 520, height: 520, opacity: 0.08, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="spirale" color="silk" />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav />
        <div className="frame" style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div className="meta mb-l text-center op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              ce que le journal tient en ce moment
            </div>

            <div className="card" style={{
              padding: "var(--s-6) var(--s-5)",
              position: "relative",
              background: "color-mix(in oklch, var(--night-warm) 86%, transparent)",
              backdropFilter: "blur(2px)",
            }}>
              {/* breath halo subtil au-dessus de la card pendant 6s */}
              {!welcomed && (
                <div style={{
                  position: "absolute", top: -40, left: "50%",
                  transform: "translateX(-50%)",
                  width: 120, height: 80, pointerEvents: "none",
                }}>
                  <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
                </div>
              )}
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                {latest.when}
              </div>
              <p className="h3-lecture" style={{ textWrap: "pretty" }}>{latest.text}</p>
            </div>

            <button className="whisper mt-l" onClick={() => go("kairos", latest.id)}>
              un kairos t'attend pour cette question
            </button>
          </div>

          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "var(--s-4)", paddingTop: "var(--s-6)", paddingBottom: "var(--s-6)",
            position: "relative",
          }}>
            {/* halo respirant discret derrière le bouton déposer */}
            <div style={{
              position: "absolute", top: -8, left: "50%",
              transform: "translateX(-50%)",
              width: 120, height: 120, pointerEvents: "none", opacity: 0.5,
            }}>
              <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
            </div>
            <button className="btn-deposer" onClick={() => go("capture")} aria-label="déposer"
              style={{ position: "relative", zIndex: 1 }}>
              <svg viewBox="0 0 28 28">
                <path d="M4 10 Q14 22 24 10" />
                <line x1="14" y1="2" x2="14" y2="10" />
              </svg>
            </button>
            <div className="meta" style={{ letterSpacing: "0.15em", textTransform: "lowercase" }}>déposer</div>
          </div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. CAPTURE — gate ember/braise + Wow1 spirale au dépôt
// ══════════════════════════════════════════════════════════════
const CaptureV12 = ({ go }) => {
  const [phase, setPhase] = vS("gate");
  const [text, setText] = vS("");
  const [showWow, setShowWow] = vS(false);
  const taRef = vR(null);

  vE(() => { if (phase === "field" && taRef.current) taRef.current.focus(); }, [phase]);

  const enterGate = () => {
    if (window.playRitual) window.playRitual("souffle");
    setPhase("field");
  };

  const garder = () => {
    // Wow 1 : premier kairos déposé
    const isFirst = !window.wowRegistry?.has("premier-kairos");
    if (isFirst) {
      window.wowRegistry?.fire("premier-kairos");
      if (window.playRitual) window.playRitual("ceremoniel");
      setShowWow(true);
      // post phase apparaît après spirale
      setTimeout(() => setPhase("post"), 1900);
    } else {
      if (window.playRitual) window.playRitual("tisse");
      setPhase("post");
    }
  };

  if (phase === "gate") {
    return (
      <div className="stage screen-enter" style={{ position: "relative" }}>
        <window.Surface matter="ember" motion="flicker" style={{
          position: "absolute", inset: 0, zIndex: 0,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <window.TopNav showBack onBack={() => go("home")} label="" />
          <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
            <div className="stack" style={{ alignItems: "center", gap: "var(--s-6)", position: "relative" }}>
              {/* halo ember braise derrière le breath circle */}
              <div style={{ position: "relative", width: 180, height: 180 }}>
                <window.HaloRespire kind="ember" style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%",
                }} />
                <div className="breath" style={{
                  position: "absolute", inset: "30%", margin: "auto",
                }} />
              </div>
              <p className="seuil-italic text-center" style={{ maxWidth: 420 }}>
                Trois respirations. Sens tes pieds. Tu es là.
              </p>
              <button className="btn-ghost" onClick={enterGate}>entrer</button>
              <button className="btn-text" onClick={() => setPhase("field")}>passer</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "field") {
    return (
      <div className="stage screen-enter" style={{ position: "relative" }}>
        <window.Surface matter="ember" motion={true} style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.8,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="nav">
            <button className="btn-text" onClick={() => go("home")}>× fermer</button>
            <div className="meta op-70" style={{ fontFamily: "var(--mono)" }}>auto · local</div>
          </div>
          <div className="frame" style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, paddingTop: "var(--s-5)" }}>
              <textarea ref={taRef} className="capture-field" rows={14}
                placeholder="Ce qui est venu…"
                value={text} onChange={(e) => setText(e.target.value)} />
            </div>
            <div className="row" style={{ justifyContent: "space-between", paddingBottom: "var(--s-4)" }}>
              <div className="meta op-70">voix · {text.length} caractères</div>
              <div className="row gap-s">
                <button className="btn-ghost" onClick={garder}
                  disabled={text.trim().length < 3}
                  style={{ opacity: text.trim().length < 3 ? 0.4 : 1 }}>
                  garder
                </button>
                <button aria-label="voix" className="btn-deposer" style={{ width: 48, height: 48 }}>
                  <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                    <rect x="9" y="3" width="6" height="12" rx="3" />
                    <path d="M5 11 Q5 18 12 18 Q19 18 19 11" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <window.SpiraleWowOverlay show={showWow} onDone={() => setShowWow(false)} />
      </div>
    );
  }

  // post
  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="silk" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.7,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="stack text-center gap-m" style={{ alignItems: "center", maxWidth: 480 }}>
            <h3 className="h3-lecture">Ton kairos est arrivé.</h3>
            <p className="ash-italic" style={{ fontSize: 16 }}>
              Il dort 24 h avant que les échos ne murmurent.
            </p>
            <div className="divider op-50" />
            <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15 }}>
              Ce dépôt sent un rêve nocturne, un signe diurne, une rêverie,
              une synchronicité… ou autre chose ?
            </p>
            <div className="row gap-s" style={{ flexWrap: "wrap", justifyContent: "center" }}>
              {["rêve nocturne", "signe diurne", "rêverie", "hypnagogie", "synchronicité", "frisson", "note de vie"].map(t => (
                <button key={t} className="chip">{t}</button>
              ))}
            </div>
            <button className="btn-text mt-m" onClick={() => go("home")}>laisser comme ça →</button>
            <button className="btn-text op-70" style={{ fontSize: 12 }}>à laisser dormir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. KAIROS DETAIL — halo silk respirant + Wow3 BigDream marquage
// ══════════════════════════════════════════════════════════════
const KairosDetailV12 = ({ go, entry, allEntries }) => {
  const [modal, setModal] = vS(null);
  const [userReading, setUserReading] = vS("");
  const [readingSubmitted, setReadingSubmitted] = vS(false);
  const [feltShift, setFeltShift] = vS(null);
  const [showAha, setShowAha] = vS(false);
  const [bigDreamPulse, setBigDreamPulse] = vS(false);
  const echoes = allEntries.filter(e => e.id !== entry.id).slice(0, 3);

  // Wow 3 : Big Dream marquage
  vE(() => {
    if (entry.bigDream && !window.wowRegistry?.has("big-dream-marquage")) {
      const t = setTimeout(() => {
        window.wowRegistry?.fire("big-dream-marquage");
        if (window.playRitual) window.playRitual("ceremoniel");
        setBigDreamPulse(true);
        setTimeout(() => setBigDreamPulse(false), 4500);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [entry.id, entry.bigDream]);

  return (
    <div className="stage screen-enter" style={{ position: "relative", background: "var(--night-warm)" }}>
      {/* Surface linen subtile pour la lecture */}
      <window.Surface matter="linen" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.5,
      }} />
      {/* Halo silk respirant pour kairos numinous, combiné si bigDream */}
      {(entry.numinous || entry.bigDream) && (
        <div style={{
          position: "absolute", top: 80, left: "50%",
          transform: "translateX(-50%)",
          width: 600, height: 400, pointerEvents: "none", zIndex: 1, opacity: 0.6,
        }}>
          <window.HaloRespire kind={entry.bigDream ? "bigdream" : "silk"}
            style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("journal")} label="" />
        <div className="frame" style={{ position: "relative" }}>
          {entry.bigDream && <div className="halo-big" />}

          <div className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            {window.typeLabel(entry.type)}, déposé {entry.when}
          </div>

          {/* Big Dream : drop cap + spirale subtile derrière le texte */}
          {entry.bigDream ? (
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 200, height: 200, opacity: bigDreamPulse ? 0.22 : 0.10,
                transition: "opacity 1s var(--ease-respire)", pointerEvents: "none",
              }}>
                <window.GeoSymbol kind="spirale" color="silk" />
              </div>
              <p className="h3-lecture bigdream-dropcap" style={{
                fontSize: 25, lineHeight: 1.55, maxWidth: 580, textWrap: "pretty",
                marginBottom: "var(--s-6)", position: "relative", zIndex: 1,
              }}>
                {entry.text}
              </p>
            </div>
          ) : (
            <p className="h3-lecture" style={{
              fontSize: 25, lineHeight: 1.55, maxWidth: 580, textWrap: "pretty",
              marginBottom: "var(--s-6)",
            }}>
              {entry.text}
            </p>
          )}

          <div className="divider" />

          <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
            <button className="chip" onClick={() => setModal("reading")}>
              <window.TypeGlyph type="note_vie" size={10} /> que vois-tu ?
            </button>
            <button className="chip" style={{ opacity: readingSubmitted ? 1 : 0.5, pointerEvents: readingSubmitted ? "auto" : "none" }}
              onClick={() => go("chat", entry.id)}>
              demander à la forêt
            </button>
            <button className="chip">échos depuis le passé</button>
            <button className="chip" onClick={() => setModal("burn")}>brûler</button>
          </div>

          {!readingSubmitted && (
            <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14, maxWidth: 520 }}>
              la forêt parle après toi. offre d'abord ta lecture.
            </p>
          )}

          <div className="divider-moon">échos qui résonnent</div>

          <div className="stack gap-s">
            {echoes.map(e => (
              <div key={e.id} className="card" style={{ padding: "var(--s-4)", cursor: "pointer" }}
                onClick={() => go("kairos", e.id)}>
                <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                  {e.when} — {window.typeLabel(e.type)}
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: 16, opacity: 0.85,
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  overflow: "hidden", margin: 0 }}>
                  {e.text}
                </p>
              </div>
            ))}
          </div>

          {entry.numinous && (
            <div className="mt-xl" style={{ padding: "var(--s-4)", border: "1px solid var(--ash-deep)" }}>
              <p className="ash-italic mb-s" style={{ fontSize: 15 }}>
                Tu peux offrir ce kairos à Anima Mundi. Il pourrait y être tenu par d'autres.
              </p>
              <div className="row gap-s">
                <button className="btn-text">en savoir plus</button>
                <button className="btn-text">pas maintenant</button>
                <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>offrir</button>
              </div>
            </div>
          )}

          {readingSubmitted && !feltShift && (
            <div className="mt-xl">
              <window.FeltShiftGate
                label="ta lecture vient d'être posée. ce que tu lis là, ça résonne dans ton corps ?"
                onPass={(k) => { setFeltShift(k); setShowAha(true); }}
                onPause={() => setFeltShift("pas-maintenant")}
              />
            </div>
          )}

          {showAha && <window.AhaCapture context="kairos-detail" onClose={() => setShowAha(false)} />}

          {window.ExitToHuman && <window.ExitToHuman />}
        </div>

        {modal === "reading" && (
          <window.Modal onClose={() => setModal(null)}>
            <h3 className="h3-lecture mb-s">Ta lecture, en premier.</h3>
            <p className="ash-italic mb-m" style={{ fontSize: 14 }}>L'IA arrivera après.</p>
            <textarea className="capture-field" rows={6}
              placeholder="Ce que tu vois là…"
              style={{ fontSize: 18, lineHeight: 1.5 }}
              value={userReading}
              onChange={e => setUserReading(e.target.value)} />
            <div className="row gap-s mt-m" style={{ justifyContent: "flex-end" }}>
              <button className="btn-text" onClick={() => setModal(null)}>plus tard</button>
              <button className="btn-ghost" onClick={() => { setReadingSubmitted(true); setModal(null); }}
                disabled={userReading.trim().length < 4}
                style={{ opacity: userReading.trim().length < 4 ? 0.4 : 1 }}>
                garder
              </button>
            </div>
          </window.Modal>
        )}

        {modal === "burn" && (
          <window.Modal onClose={() => setModal(null)}>
            <div style={{ position: "absolute", inset: 0,
              background: "radial-gradient(circle at center, color-mix(in oklch, var(--ember-live) 12%, transparent), transparent 65%)",
              pointerEvents: "none" }} />
            <h3 className="h3-lecture text-center mb-s" style={{ fontStyle: "italic" }}>
              Veux-tu vraiment brûler ce kairos ?
            </h3>
            <p className="ash-italic text-center mb-l" style={{ fontSize: 14 }}>
              Suppression cryptographique. Pas de retour.
            </p>
            <div className="row gap-s" style={{ justifyContent: "center" }}>
              <button className="btn-text" onClick={() => setModal(null)}>garder</button>
              <button className="btn-ghost" onClick={() => { if (window.playRitual) window.playRitual("braise"); }}
                style={{ borderColor: "color-mix(in oklch, var(--ember-live) 60%, var(--ash-mid))",
                         color: "var(--ember-live)" }}>
                appuyer 2 s pour brûler
              </button>
            </div>
          </window.Modal>
        )}
        {window.FeedbackFloat && <window.FeedbackFloat />}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 4. PORTRAIT — ConstellationD3 vivant
// ══════════════════════════════════════════════════════════════
const portraitNodesV12 = [
  { id: "self",       label: "moi", kind: "self", weight: 3 },
  { id: "grand-mere", label: "la grand-mère", kind: "figure", weight: 3 },
  { id: "maison",     label: "la maison aux pièces inconnues", kind: "kairos", weight: 2.5 },
  { id: "porte",      label: "la porte qui ne s'ouvre pas", kind: "kairos", weight: 2.2 },
  { id: "cuisine",    label: "cuisine sans feu", kind: "kairos", weight: 1.8 },
  { id: "eau",        label: "eau qui cherche son lit", kind: "bigdream", weight: 2.8 },
  { id: "estuaire",   label: "estuaire", kind: "kairos", weight: 1.5 },
  { id: "pont",       label: "pont inachevé", kind: "kairos", weight: 2.0 },
  { id: "seuil",      label: "seuil à traverser", kind: "kairos", weight: 2.4 },
  { id: "travail",    label: "question du travail", kind: "kairos", weight: 2.6 },
  { id: "corbeau",    label: "corbeau / feuille morte", kind: "kairos", weight: 1.2 },
  { id: "enfant",     label: "enfant qui pleure", kind: "kairos", weight: 1.6 },
];
const portraitEdgesV12 = [
  { source: "self", target: "grand-mere", alive: true },
  { source: "self", target: "eau", alive: true },
  { source: "self", target: "travail", alive: true },
  { source: "grand-mere", target: "maison" },
  { source: "grand-mere", target: "cuisine" },
  { source: "maison", target: "porte" },
  { source: "porte", target: "seuil" },
  { source: "eau", target: "estuaire" },
  { source: "eau", target: "pont" },
  { source: "pont", target: "seuil" },
  { source: "seuil", target: "travail" },
  { source: "enfant", target: "maison" },
  { source: "corbeau", target: "porte" },
];

const PortraitV12 = ({ go }) => {
  const [toggle, setToggle] = vS("croise");
  const [period, setPeriod] = vS("lune");
  const [selected, setSelected] = vS(null);
  const [echoArc, setEchoArc] = vS(null); // { from, to } pour arc silk-gold reliant 2 kairos

  // Wow 2 — premier écho prophétique détecté sur Portrait :
  // une fois la constellation construite, on relie 2 kairos par un arc silk-gold
  // bref pour signifier qu'un écho a été perçu. Idempotent via wowRegistry.
  vE(() => {
    if (!window.wowRegistry?.has("premier-echo-prophetique")) {
      const t = setTimeout(() => {
        const fired = window.wowRegistry?.fire("premier-echo-prophetique");
        if (fired) {
          if (window.playRitual) window.playRitual("tisse");
          // arc silk-gold reliant 2 kairos résonants (eau ↔ travail)
          setEchoArc({ from: "eau", to: "travail" });
          setTimeout(() => setEchoArc(null), 4200);
        }
      }, 2500);
      return () => clearTimeout(t);
    }
  }, []);

  // Listener générique (compat Tweaks demo) — déclenche aussi l'arc si event reçu hors fire direct.
  // Implémentation locale (pas de hook conditionnel) : abonnement à l'event "wow:fire".
  vE(() => {
    const handler = (e) => {
      if (e.detail?.name === "premier-echo-prophetique") {
        setEchoArc({ from: "eau", to: "travail" });
        setTimeout(() => setEchoArc(null), 4200);
      }
    };
    window.addEventListener("wow:fire", handler);
    return () => window.removeEventListener("wow:fire", handler);
  }, []);

  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="stone" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.6,
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame">
          <div className="row mb-l" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <h1 className="h1-seuil">Portrait</h1>
            <div className="row gap-m">
              <button className="btn-text" aria-label="légende">?</button>
              <button className="btn-text" aria-label="paramètres">⚙</button>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <window.ConstellationD3
              nodes={portraitNodesV12}
              edges={portraitEdgesV12}
              focalId="self"
              onNodeClick={(n) => setSelected(n.id)}
              driftParticles={true}
              showLabels={true}
              style={{ width: "100%", height: 420, marginBottom: "var(--s-4)" }}
            />
            {/* Wow2 — arc silk-gold éphémère reliant 2 kairos résonants */}
            {echoArc && (
              <svg className="echo-arc-wow" viewBox="0 0 100 60"
                preserveAspectRatio="none"
                style={{
                  position: "absolute", inset: 0, width: "100%", height: 420,
                  pointerEvents: "none", zIndex: 3,
                }}
                aria-hidden="true">
                <path d="M 22 38 Q 50 4, 78 30"
                  fill="none"
                  stroke="var(--silk-gold)"
                  strokeWidth="0.35"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: 200,
                    filter: "drop-shadow(0 0 6px color-mix(in oklch, var(--silk-gold) 55%, transparent))",
                    animation: "echoArcDraw 4200ms cubic-bezier(0.7, 0, 0.3, 1) forwards",
                  }} />
                <style>{`
                  @keyframes echoArcDraw {
                    0%   { stroke-dashoffset: 200; opacity: 0; }
                    20%  { opacity: 0.95; }
                    65%  { stroke-dashoffset: 0; opacity: 0.85; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                  }
                `}</style>
              </svg>
            )}
          </div>

          {selected && (
            <div className="meta text-center mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
              {portraitNodesV12.find(n => n.id === selected)?.label}
            </div>
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
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. ANIMA VOÛTE — D3 + demi-cercle aurore + songlines
// ══════════════════════════════════════════════════════════════
const animaNodesV12 = (() => {
  const arr = [{ id: "anima", label: "anima mundi", kind: "self", weight: 4 }];
  const labels = ["porte", "eau", "grand-mère", "estuaire", "pont", "seuil", "feu mort",
                  "cuisine", "défunt", "animal qui parle", "enfant", "maison", "rivière",
                  "linge", "lune", "songe en lune"];
  for (let i = 0; i < 28; i++) {
    arr.push({
      id: `n${i}`,
      label: i < 8 ? labels[i % labels.length] : "",
      kind: i % 11 === 0 ? "bigdream" : (i % 4 === 0 ? "holding" : "member"),
      weight: 1 + (i % 3) * 0.5,
    });
  }
  return arr;
})();
const animaEdgesV12 = (() => {
  const e = [];
  for (let i = 0; i < 28; i++) e.push({ source: "anima", target: `n${i}`, alive: i < 6 });
  for (let i = 0; i < 28; i++) {
    if (i % 3 === 0 && i + 2 < 28) e.push({ source: `n${i}`, target: `n${i+2}` });
  }
  return e;
})();

const AnimaVouteV12 = ({ go }) => {
  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      {/* Surface earth dans la nuit */}
      <window.Surface matter="earth" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.6,
      }} />
      {/* Songlines en arrière-plan, très subtil */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.18, pointerEvents: "none" }}>
        <window.GeoSymbol kind="songlines" color="silk" />
      </div>
      {/* Demi-cercle aurore en haut */}
      <div style={{
        position: "absolute", top: 60, left: 0, right: 0, height: 180,
        zIndex: 1, pointerEvents: "none", opacity: 0.7,
      }}>
        <window.GeoSymbol kind="demi-cercle" />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame">
          <h1 className="h1-seuil text-center mb-xl" style={{ fontSize: 44, marginTop: "var(--s-6)" }}>
            Anima Mundi
          </h1>

          {/* Constellation D3 vivante */}
          <div style={{
            border: "1px solid var(--ash-deep)",
            background: "color-mix(in oklch, var(--obsidian) 50%, transparent)",
            marginBottom: "var(--s-5)",
          }}>
            <window.ConstellationD3
              nodes={animaNodesV12}
              edges={animaEdgesV12}
              focalId="anima"
              driftParticles={true}
              showLabels={true}
              style={{ width: "100%", height: 380 }}
            />
          </div>

          <p className="seuil-italic text-center" style={{ fontSize: 19, maxWidth: 520, margin: "0 auto", textWrap: "pretty" }}>
            Cette lune, l'humanité a déposé environ 47 000 moments —
            rêves, signes, traversées.
          </p>

          <div className="stack gap-m mt-xl">
            <button className="chamber-card" onClick={() => go("meteo")}>
              <h3 className="h3-lecture">Le temps qu'il fait dans la nuit</h3>
              <p className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                météo de l'inconscient — lune de mars
              </p>
            </button>
            <button className="chamber-card" disabled style={{ opacity: 0.55 }}>
              <h3 className="h3-lecture">Tenu ensemble</h3>
              <p className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                rêves et traversées offerts au collectif
              </p>
            </button>
            <button className="chamber-card" onClick={() => go("polyphonie")}>
              <h3 className="h3-lecture">Polyphonie de la lune</h3>
              <p className="meta mt-s op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                lecture longue — mars
              </p>
            </button>
          </div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 6. CHAT — surface paper + halo silk discret
// ══════════════════════════════════════════════════════════════
const ChatV12 = ({ go, contextId }) => {
  const [messages, setMessages] = vS([
    { from: "ai", text: "Avant que je te propose quoi que ce soit, dis-moi : qu'est-ce que tu vois là, en regardant ce kairos ?" },
  ]);
  const [input, setInput] = vS("");
  const [thinking, setThinking] = vS(false);
  const scrollRef = vR(null);

  vE(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, thinking]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setThinking(true);
    if (window.playRitual) window.playRitual("tisse");
    try {
      const reply = await window.claude.complete(
        `Tu es la voix sobre de Dream App — instrument oraculaire, pas oracle.
Règles strictes:
- Voix conditionnelle obligatoire ("à la lumière de X, on pourrait entendre…", "Aizenstat aurait invité à…"). JAMAIS "X te dit".
- Ne parle JAMAIS comme une figure du rêve, l'oracle, ou le rêveur.
- Pas d'emoji, pas de diagnostic, pas de "magique/vibrationnel/quantique".
- Une seule question ouverte à la fin, jamais plusieurs.
- Phrases courtes, EB Garamond-friendly. 3-5 phrases max. En français.
- Mentionne 1-2 voix de la Forêt (Jung, Gendlin, Aizenstat, Moss, Bachelard, Hillman, Hopcke) en conditionnel.

L'utilisateur vient de dire: "${userMsg}"

Réponds avec sobriété.`
      );
      setMessages(m => [...m, { from: "ai", text: reply.trim() }]);
    } catch {
      setMessages(m => [...m, { from: "ai", text: "Le lien est gardé. Reviens quand tu peux." }]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="paper" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.85,
      }} />
      {/* halo silk discret en haut, derrière les messages IA */}
      <div style={{
        position: "absolute", top: 60, left: "50%",
        transform: "translateX(-50%)",
        width: 480, height: 200, pointerEvents: "none", zIndex: 1, opacity: 0.4,
      }}>
        <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("kairos", contextId || "k-08")} label="" />
        <div className="frame" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 60px)" }}>
          <div className="meta mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            mode · exploration de kairos
          </div>

          <div ref={scrollRef} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
            {messages.map((m, i) => (
              <div key={i} className={"bubble " + m.from} style={{ textWrap: "pretty" }}>
                {m.text}
              </div>
            ))}
            {thinking && (
              <div className="bubble ai" style={{ opacity: 0.7, fontStyle: "italic", position: "relative" }}>
                <div style={{
                  position: "absolute", left: -30, top: "50%",
                  transform: "translateY(-50%)",
                  width: 24, height: 24, opacity: 0.6,
                }}>
                  <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
                </div>
                <span>les liens se tissent…</span>
              </div>
            )}
          </div>

          <div className="mt-l">
            <div className="row gap-s" style={{ alignItems: "flex-end" }}>
              <textarea value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                rows={1} placeholder="ce qui vient…"
                style={{
                  flex: 1, background: "transparent",
                  border: "1px solid var(--ash-deep)", padding: "12px 16px",
                  color: "var(--bone)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
                  resize: "none", outline: "none", minHeight: 44,
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

          {messages.length >= 3 && <window.AhaCapture context="chat-narratrice" onClose={() => {}} />}
          {window.ExitToHuman && <window.ExitToHuman />}
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. RÉENTRÉE — triangle rituel + matter ember/earth selon phase
// ══════════════════════════════════════════════════════════════
// On réutilise la logique de l'original — on enveloppe la racine
// d'un Surface ember (gate) ou earth (réentrée) et on superpose un
// triangle rituel discret aux phases lightning/moss.
const ReentryV12 = ({ go }) => {
  const Original = window.__ReentryOriginal;
  if (!Original) return null;

  // On wrap : matter selon phase = on ne peut pas inspecter la phase
  // depuis l'extérieur ; on choisit donc earth (ancrage) en fond
  // global + triangle rituel doux. Le breath-circle interne reste.
  return (
    <div style={{ position: "relative" }}>
      <window.Surface matter="earth" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none",
      }} />
      {/* triangle rituel en haut-centre */}
      <div style={{
        position: "absolute", top: 80, left: "50%",
        transform: "translateX(-50%)",
        width: 180, height: 180, opacity: 0.10, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="triangle" color="ember" />
      </div>
      {/* halo ember braise très discret */}
      <div style={{
        position: "absolute", top: 60, left: "50%",
        transform: "translateX(-50%)",
        width: 320, height: 320, pointerEvents: "none", zIndex: 1, opacity: 0.5,
      }}>
        <window.HaloRespire kind="ember" style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 8. BIG DREAM SIGNAL — drop cap + halo combiné + revisits
// ══════════════════════════════════════════════════════════════
// Ce composant est un nouvel écran dédié pour démontrer le
// marquage permanent Big Dream + la mécanique des revisits J+7/30/365.
const BigDreamSignalV12 = ({ go }) => {
  const entries = (window.seedEntries || []);
  const bigDream = entries.find(e => e.bigDream) || entries[0];
  const [revisitsOn, setRevisitsOn] = vS(true);
  const [showRevisit, setShowRevisit] = vS(false);

  vE(() => {
    if (!window.wowRegistry?.has("big-dream-marquage")) {
      const t = setTimeout(() => {
        window.wowRegistry?.fire("big-dream-marquage");
        if (window.playRitual) window.playRitual("ceremoniel");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="ember" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.7,
      }} />
      {/* halo combiné silk + ember en arrière-plan */}
      <div style={{
        position: "absolute", top: 100, left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 500, pointerEvents: "none", zIndex: 1, opacity: 0.7,
      }}>
        <window.HaloRespire kind="bigdream" style={{ width: "100%", height: "100%" }} />
      </div>
      {/* spirale géosymbolique en bas-droite */}
      <div style={{
        position: "absolute", bottom: 40, right: -80,
        width: 280, height: 280, opacity: 0.12, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="spirale" color="silk" />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("kairos", bigDream.id)} label="" />
        <div className="frame" style={{ maxWidth: 600 }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
            big dream signal
          </div>
          <h1 className="h1-seuil mb-l">marqué pour durer</h1>

          {/* Citation du Big Dream avec drop cap silk-gold */}
          <div style={{
            padding: "var(--s-5)",
            background: "color-mix(in oklch, var(--night-warm) 70%, transparent)",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
            marginBottom: "var(--s-5)",
            position: "relative",
          }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              {bigDream.when} — {window.typeLabel(bigDream.type)}
            </div>
            <p className="bigdream-dropcap" style={{
              fontFamily: "var(--serif)", fontSize: 22, lineHeight: 1.55,
              textWrap: "pretty", margin: 0, color: "var(--bone)",
            }}>
              {bigDream.text}
            </p>
          </div>

          <p className="seuil-italic mb-l" style={{ fontSize: 17, maxWidth: 540, textWrap: "pretty" }}>
            Ce kairos a été marqué <em>Big Dream</em>. Pas de label visible dans le journal —
            juste un halo qui respire. Il dort et revient quand son temps vient.
          </p>

          <div className="divider" />

          {/* Toggle revisits */}
          <div className="setting-row" style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "var(--s-4) 0",
          }}>
            <div>
              <div className="body" style={{ fontWeight: 500 }}>revisits automatiques</div>
              <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                un chuchotement à J+7, J+30, J+365
              </div>
            </div>
            <button onClick={() => setRevisitsOn(v => !v)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                border: "1px solid var(--ash-mid)",
                background: revisitsOn ? "var(--silk-gold)" : "transparent",
                position: "relative", cursor: "pointer",
              }}>
              <div style={{
                position: "absolute", top: 2,
                left: revisitsOn ? 22 : 2,
                width: 18, height: 18, borderRadius: 9,
                background: revisitsOn ? "var(--obsidian)" : "var(--ash-light)",
                transition: "left var(--tempo-tisse) var(--ease-respire)",
              }} />
            </button>
          </div>

          <div className="divider" />

          {/* Aperçu d'un chuchotement revisit */}
          <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ash-light)" }}>
            aperçu du chuchotement
          </div>
          <button onClick={() => { setShowRevisit(s => !s); if (window.playRitual) window.playRitual("souffle"); }}
            className="card" style={{
              padding: "var(--s-4)", width: "100%", textAlign: "left", cursor: "pointer",
              borderColor: "color-mix(in oklch, var(--silk-gold) 40%, var(--ash-deep))",
            }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
              il y a une lune
            </div>
            <p className="seuil-italic" style={{ fontSize: 17, margin: 0, textWrap: "pretty" }}>
              un kairos te demande à être revisité — il a 1 lune.
            </p>
          </button>

          {showRevisit && (
            <div className="card mt-m" style={{
              padding: "var(--s-5)",
              background: "color-mix(in oklch, var(--silk-gold) 8%, var(--night-warm))",
              borderColor: "var(--silk-gold)",
            }}>
              <p className="seuil-italic" style={{ fontSize: 18, margin: 0, textWrap: "pretty" }}>
                1 lune s'est écoulée depuis ce dépôt.
                Quelque chose se demande à toi à son propos ?
              </p>
              <div className="row gap-s mt-m">
                <button className="btn-text">pas maintenant</button>
                <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13 }}>
                  ouvrir
                </button>
              </div>
            </div>
          )}

          <div className="meta op-50 mt-xl" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em" }}>
            let_the_dream_live · synthèse délibérément minimale · jung a laissé son rêve travailler 30 ans
          </div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Application des overrides
// ══════════════════════════════════════════════════════════════

// Sauvegarder l'original Reentry pour wrapping
window.__ReentryOriginal = window.ReentryScreen;

// ══════════════════════════════════════════════════════════════
// 2026-04-28 — DROP des overrides V12 mockup (cause-racine bugs P0 T66/T69)
// ══════════════════════════════════════════════════════════════
// Diagnostic Tim 28/04 : "boutons catégorisation kairos morts" + "demander à la forêt
// route vers Chat générique au lieu de sheet polyphonique 3 angles".
// Cause-racine identifiée : screens-v12-amplified.jsx ÉCRASAIT 8 composants câblés
// (Home, Capture, KairosDetail, Portrait, AnimaVoute, Chat, ReentryScreen, BigDreamSignal)
// avec des versions V12 mockup non câblées (chips sans onClick, pas de createKairos API,
// pas d'updateType, pas de askForest interne 3 angles).
//
// Composants câblés à PRÉSERVER (chargés avant V12-amplified mais écrasés par lui) :
// - Home → screens-core.jsx (mais en pratique window.DreamHome de screens-dream-home.jsx prime via app.jsx case "home")
// - Capture → screens-core.jsx (CapturePostSequenced 4 vagues + chips fonctionnels + updateType + createKairos API)
// - KairosDetail → screens-deep.jsx (askForest interne sheet polyphonique 3 angles paper/stone/silk)
// - Portrait → screens-portrait-narrative.jsx (lettre narrative IA + skeleton)
// - AnimaVoute → screens-deep.jsx (mais window.AnimaUnifiedScreen prime via app.jsx)
// - Chat → screens-deep.jsx (Chat narratrice câblée /api/chat — pas idéal mais pas mockup)
// - ReentryScreen → préservé via window.__ReentryOriginal sauvegardé ligne 1039
// - BigDreamSignal → REMIS, pas d'autre source ailleurs pour l'instant
//
// Décision : commenter les 8 overrides. Les composants V12 sont laissés comme code de
// référence visuelle (HaloRespire/Surface ember effets sont précieux à porter ailleurs).
// Ne PAS supprimer ce fichier — porter ses idées visuelles dans les composants câblés.
// ══════════════════════════════════════════════════════════════

// window.Home = HomeV12;          // DROP — DreamHome prime
// window.Capture = CaptureV12;    // DROP — Capture câblé screens-core.jsx (fix bug T66)
// window.KairosDetail = KairosDetailV12;  // DROP — KairosDetail câblé screens-deep.jsx (fix bug T69)
// window.Portrait = PortraitV12;  // DROP — PortraitNarrative prime
// window.AnimaVoute = AnimaVouteV12;  // DROP — AnimaUnifiedScreen prime
// window.Chat = ChatV12;          // DROP — Chat câblé screens-deep.jsx (mitigation bug T69)
// window.ReentryScreen = ReentryV12;  // DROP — ReentryOriginal préservé

// BigDreamSignal n'a pas d'autre source — on le garde pour l'instant
// (à porter dans un screens-bigdream.jsx propre lors du sprint A pivot Chat)
window.BigDreamSignalScreen = BigDreamSignalV12;
