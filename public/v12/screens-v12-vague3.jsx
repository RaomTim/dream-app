/* global React */
// ──────────────────────────────────────────────────────────────
// Dream — V1.2 amplification · Vague 3
// 8 écrans suivants : Journal, Forêt FIRST, Cercle, FigureDetail,
// Météo, Polyphonie, Annales, Conte-miroir.
//
// Stratégie identique à Vague 2 : OVERRIDE via window.X = AmplifiedX.
// Chargé après screens-v12-amplified.jsx, avant app.jsx (qui lit
// window.* au render).
// ──────────────────────────────────────────────────────────────

const { useState: v3S, useEffect: v3E, useRef: v3R, useMemo: v3M } = React;

// ══════════════════════════════════════════════════════════════
// 1. JOURNAL — Surface paper + halo silk subtil sur kairos numinous
//    + spirale BigDream sur card + filtres avec matters
// ══════════════════════════════════════════════════════════════
const JournalV12 = ({ go, entries }) => {
  const [filter, setFilter] = v3S("all");
  const shown = filter === "all" ? entries : entries.filter(e => e.type === filter);

  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="paper" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.6,
      }} />
      {/* trace de songlines très douce en fond — la nappe des kairos */}
      <div style={{
        position: "absolute", top: 200, left: 0, right: 0, bottom: 0,
        zIndex: 1, opacity: 0.06, pointerEvents: "none",
      }}>
        <window.GeoSymbol kind="songlines" color="silk" />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame">
          <div className="row mb-m" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 className="h1-seuil">Journal</h1>
              {window.SeasonalCompass && <div className="mt-s"><window.SeasonalCompass /></div>}
            </div>
            <button className="btn-text" aria-label="filtrer" style={{ fontSize: 18 }}>⎙</button>
          </div>

          <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
            {[
              ["all", "tout"],
              ["dream_night", "rêves"],
              ["sidewalk_oracle", "signes"],
              ["daydream_reverie", "rêveries"],
              ["synchronicity", "synchronicités"],
              ["note_vie", "notes de vie"],
            ].map(([k, l]) => (
              <button key={k} className={"chip" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>

          <div className="stack" style={{ gap: "var(--s-5)" }}>
            {shown.map((e, i) => (
              <div key={e.id}>
                {i === 3 && filter === "all" && (
                  <div className="divider-moon">⟶ lune décroissante de mars</div>
                )}
                <article
                  className={"card" + (e.bigDream ? " card-bigdream" : "")}
                  onClick={() => go("kairos", e.id)}
                  style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}>
                  {/* halo silk respirant subtil sur kairos numinous */}
                  {e.numinous && !e.bigDream && (
                    <div style={{
                      position: "absolute", top: -30, right: -30,
                      width: 160, height: 160, opacity: 0.5,
                      pointerEvents: "none",
                    }}>
                      <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
                    </div>
                  )}
                  {/* spirale BigDream + halo combiné */}
                  {e.bigDream && (
                    <>
                      <div style={{
                        position: "absolute", top: -20, right: -40,
                        width: 180, height: 180, opacity: 0.18,
                        pointerEvents: "none",
                      }}>
                        <window.GeoSymbol kind="spirale" color="silk" />
                      </div>
                      <div style={{
                        position: "absolute", inset: 0,
                        opacity: 0.35, pointerEvents: "none",
                      }}>
                        <window.HaloRespire kind="bigdream" style={{ width: "100%", height: "100%" }} />
                      </div>
                    </>
                  )}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div className="row mb-s gap-s" style={{ color: "var(--ash-light)" }}>
                      {window.TypeGlyph && <window.TypeGlyph type={e.type} />}
                      <span className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>{e.when}</span>
                      <span className="meta op-50">·</span>
                      <span className="meta">{window.typeLabel(e.type)}</span>
                      {e.numinous && (
                        <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--ember-live)", opacity: 0.7 }} />
                      )}
                    </div>
                    <p className="body" style={{
                      fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.55,
                      display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                      textWrap: "pretty",
                      ...(e.bigDream ? { paddingLeft: 12, borderLeft: "1px solid color-mix(in oklch, var(--silk-gold) 40%, transparent)" } : {}),
                    }}>
                      {e.text}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>

          <button className="btn-deposer" style={{ position: "fixed", bottom: 32, right: 32, width: 56, height: 56, zIndex: 10 }}
            onClick={() => go("capture")} aria-label="déposer">
            <svg viewBox="0 0 28 28" style={{ width: 20, height: 20 }}>
              <path d="M4 10 Q14 22 24 10" />
              <line x1="14" y1="2" x2="14" y2="10" />
            </svg>
          </button>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. FORÊT FIRST — workflow d'interprétation 5 temps
//    matter silk + halo silk + cérémonie loading + 3 angles + felt shift
// ══════════════════════════════════════════════════════════════
const ForetFirstV12 = ({ go, contextId }) => {
  const entry = (window.seedEntries || [])[0];
  const [phase, setPhase] = v3S("user-reading"); // user-reading | loading | angles | felt-shift | resolve
  const [userReading, setUserReading] = v3S("");
  const [angles, setAngles] = v3S(null);
  const [chosen, setChosen] = v3S(null);
  const [shiftZone, setShiftZone] = v3S(null);
  const [loadingWord, setLoadingWord] = v3S("écouter");
  const [showAha, setShowAha] = v3S(false);

  // mots qui changent toutes les 4s pendant cérémoniel
  v3E(() => {
    if (phase !== "loading") return;
    const words = ["écouter", "tisser", "amplifier", "tenir"];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % words.length;
      setLoadingWord(words[i]);
    }, 4000);
    return () => clearInterval(id);
  }, [phase]);

  // simule l'arrivée des angles après 6s
  v3E(() => {
    if (phase !== "loading") return;
    const t = setTimeout(() => {
      setAngles([
        {
          source: "Aizenstat",
          source_full: "Stephen Aizenstat — Dream Tending",
          text: "À la lumière d'Aizenstat, on pourrait entendre dans cette grand-mère sans feu une figure qui demande d'être tenue, pas comprise. Le feu n'est pas absent par accident — il attend que tu le ranimes par ta présence. La cuisine, ici, est l'endroit où la nourriture se prépare ; le feu y manque parce qu'il te manque.",
        },
        {
          source: "Bachelard",
          source_full: "Gaston Bachelard — La Poétique de la Rêverie",
          text: "Bachelard aurait invité à voir la maison aux pièces inconnues comme la maison verticale de l'âme. Les pièces que tu n'as jamais ouvertes ne sont pas vides ; elles sont en attente. Ouvrir, ici, ne signifie pas comprendre — cela signifie laisser entrer la lumière de ta lampe.",
        },
        {
          source: "Moss",
          source_full: "Robert Moss — Active Dreaming",
          text: "Pour Moss, les portes qui ne s'ouvrent pas tout de suite sont les plus dignes de confiance. Elles te demandent de revenir, de frapper avec une autre attention. Le seuil n'est pas là pour te bloquer ; il est là pour t'apprendre à demander.",
        },
      ]);
      setPhase("angles");
      if (window.playRitual) window.playRitual("ceremoniel");
    }, 6500);
    return () => clearTimeout(t);
  }, [phase]);

  const submitReading = () => {
    if (userReading.trim().length < 10) return;
    if (window.playRitual) window.playRitual("souffle");
    setPhase("loading");
  };

  const onShiftPicked = (zone) => {
    setShiftZone(zone);
    setPhase("resolve");
    if (window.playRitual) window.playRitual("ceremoniel");
    // Wow 4 — naissance d'un nouveau noeud constellation : le felt-shift fait que
    // ce kairos rentre comme noeud vivant dans la trame. Idempotent via wowRegistry.
    if (window.wowRegistry && !window.wowRegistry.has("naissance-noeud")) {
      window.wowRegistry.fire("naissance-noeud");
    }
    setTimeout(() => setShowAha(true), 1200);
  };

  // Wow4 listener — anime la naissance du noeud (drift + edges progressives)
  // dans la phase "resolve" : un petit overlay visuel apparait pendant ~3.6s.
  const [showNoeudBirth, setShowNoeudBirth] = v3S(false);
  v3E(() => {
    const handler = (e) => {
      if (e.detail?.name === "naissance-noeud") {
        setShowNoeudBirth(true);
        setTimeout(() => setShowNoeudBirth(false), 3600);
      }
    };
    window.addEventListener("wow:fire", handler);
    return () => window.removeEventListener("wow:fire", handler);
  }, []);

  // Phase 1: user reading first
  if (phase === "user-reading") {
    return (
      <div className="stage screen-enter" style={{ position: "relative" }}>
        <window.Surface matter="paper" motion={true} style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.7,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <window.TopNav showBack onBack={() => go("kairos")} label="" />
          <div className="frame" style={{ maxWidth: 600 }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              forêt first · ta lecture en premier
            </div>
            <h1 className="h1-seuil mb-m">avant que la forêt parle</h1>
            <p className="seuil-italic mb-l" style={{ maxWidth: 540, color: "var(--ash-light)" }}>
              326 livres dorment sous nos pieds. Ils ne s'ouvriront que si tu offres ta lecture en premier.
            </p>

            <div className="card mb-l" style={{ padding: "var(--s-4)" }}>
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                ton kairos
              </div>
              <p className="body" style={{ fontStyle: "italic", textWrap: "pretty", fontFamily: "var(--serif)", fontSize: 17 }}>
                {entry.text}
              </p>
            </div>

            <p className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15 }}>
              que vois-tu là, en regardant ce kairos ?
            </p>
            <textarea
              className="capture-field"
              rows={6}
              placeholder="ce qui se présente, sans censure…"
              value={userReading}
              onChange={(e) => setUserReading(e.target.value)}
              style={{ fontSize: 17, lineHeight: 1.5 }}
            />

            <div className="row mt-m" style={{ justifyContent: "space-between" }}>
              <div className="meta op-70">{userReading.length} caractères</div>
              <button className="btn-ghost" onClick={submitReading}
                disabled={userReading.trim().length < 10}
                style={{ opacity: userReading.trim().length < 10 ? 0.4 : 1 }}>
                offrir à la forêt
              </button>
            </div>
          </div>
        </div>
        {window.FeedbackFloat && <window.FeedbackFloat />}
      </div>
    );
  }

  // Phase 2: loading cérémoniel
  if (phase === "loading") {
    return (
      <div className="stage screen-enter" style={{ position: "relative" }}>
        <window.Surface matter="silk" motion={true} style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.5,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1, opacity: 0.6, pointerEvents: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <window.HaloRespire kind="silk" style={{ width: 480, height: 480 }} />
        </div>
        <div style={{ position: "relative", zIndex: 2 }}>
          <window.TopNav showBack onBack={() => go("kairos")} label="" />
          <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
            <div className="stack text-center gap-l" style={{ alignItems: "center" }}>
              {/* constellation lente — 5 points qui apparaissent progressivement */}
              <svg width="160" height="100" viewBox="0 0 160 100">
                {[
                  [30, 40, "0s"], [60, 25, "1.2s"], [85, 60, "2.4s"],
                  [115, 35, "3.6s"], [140, 70, "4.8s"],
                ].map(([cx, cy, delay], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2" fill="var(--bone)"
                    style={{
                      opacity: 0,
                      animation: `fadeInPoint 0.8s var(--ease-respire) ${delay} forwards`,
                    }} />
                ))}
                <style>{`@keyframes fadeInPoint { to { opacity: 0.7; } }`}</style>
              </svg>
              <p className="seuil-italic" style={{ fontSize: 22, fontStyle: "italic" }}>
                {loadingWord}…
              </p>
              <div className="meta op-50" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                326 livres veillent
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: 3 angles
  if (phase === "angles") {
    return (
      <div className="stage screen-enter" style={{ position: "relative" }}>
        <window.Surface matter="silk" motion={true} style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.6,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <window.TopNav showBack onBack={() => go("kairos")} label="" />
          <div className="frame" style={{ maxWidth: 640 }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              forêt first · trois angles
            </div>
            <h1 className="h1-seuil mb-m">trois angles, sans hiérarchie</h1>
            <p className="seuil-italic mb-l" style={{ maxWidth: 580, color: "var(--ash-light)" }}>
              Ces lectures sont des hypothèses, pas des vérités. Aucune n'est plus juste qu'une autre. Vois laquelle bouge quelque chose dans ton corps.
            </p>

            <div className="stack gap-l">
              {angles.map((a, i) => (
                <div key={i} className="card" style={{
                  padding: "var(--s-5)",
                  borderColor: chosen === i ? "var(--silk-gold)" : "var(--ash-deep)",
                  cursor: "pointer",
                  background: chosen === i ? "color-mix(in oklch, var(--silk-gold) 6%, transparent)" : undefined,
                }}
                  onClick={() => setChosen(i)}>
                  <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
                    {a.source_full}
                  </div>
                  <p className="body" style={{ fontFamily: "var(--serif)", fontSize: 17, lineHeight: 1.6, textWrap: "pretty" }}>
                    {a.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="row mt-xl" style={{ justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setPhase("felt-shift")}>
                ressentir →
              </button>
            </div>
            {window.ExitToHuman && <window.ExitToHuman />}
          </div>
        </div>
      </div>
    );
  }

  // Phase 4: felt shift
  if (phase === "felt-shift") {
    return (
      <div className="stage screen-enter" style={{ position: "relative" }}>
        <window.Surface matter="silk" motion={true} style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.55,
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <window.TopNav showBack onBack={() => setPhase("angles")} label="" />
          <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
            <div className="stack text-center gap-l" style={{ alignItems: "center", maxWidth: 540 }}>
              <p className="seuil-italic" style={{ fontSize: 22, textWrap: "pretty" }}>
                Lequel a fait quelque chose dans ton corps ?
              </p>
              <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14 }}>
                pause de 10 à 30 secondes. ne presse pas.
              </div>
              <div className="row gap-s mt-m" style={{ flexWrap: "wrap", justifyContent: "center" }}>
                {["gorge", "poitrine", "ventre", "nuque", "ailleurs", "aucune part"].map(z => (
                  <button key={z} className="chip" onClick={() => onShiftPicked(z)}>
                    {z}
                  </button>
                ))}
              </div>
              <button className="btn-text mt-m op-70" onClick={() => onShiftPicked("rien-shift")}>
                rien ne shift — j'attends
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 5: resolve + AhaCapture
  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="silk" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.7,
      }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.4 }}>
        <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
      </div>
      {/* Wow4 — naissance noeud : drift particles + edges progressives en overlay */}
      {showNoeudBirth && (
        <svg className="naissance-noeud-wow"
          viewBox="0 0 200 200"
          style={{
            position: "absolute", top: "20%", left: "50%",
            transform: "translateX(-50%)",
            width: 280, height: 280, pointerEvents: "none", zIndex: 3, opacity: 0.85,
          }}
          aria-hidden="true">
          {/* noeud central */}
          <circle cx="100" cy="100" r="3" fill="var(--silk-gold)"
            style={{
              filter: "drop-shadow(0 0 10px color-mix(in oklch, var(--silk-gold) 70%, transparent))",
              animation: "noeudCorePulse 3600ms var(--ease-souffle) forwards",
            }} />
          {/* edges progressives vers 5 satellites */}
          {[
            [40, 50], [160, 50], [30, 130], [170, 140], [100, 175],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1="100" y1="100" x2={x} y2={y}
                stroke="var(--silk-gold)" strokeWidth="0.5"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  opacity: 0,
                  animation: `noeudEdgeDraw 1400ms cubic-bezier(0.6,0,0.4,1) ${400 + i * 280}ms forwards`,
                }} />
              <circle cx={x} cy={y} r="1.6" fill="var(--silk-gold)"
                style={{
                  opacity: 0,
                  animation: `noeudSatelliteAppear 600ms var(--ease-souffle) ${800 + i * 280}ms forwards`,
                }} />
            </g>
          ))}
          <style>{`
            @keyframes noeudCorePulse {
              0%   { r: 0; opacity: 0; }
              25%  { r: 3; opacity: 1; }
              80%  { r: 4; opacity: 0.9; }
              100% { r: 4; opacity: 0; }
            }
            @keyframes noeudEdgeDraw {
              0%   { stroke-dashoffset: 100; opacity: 0; }
              30%  { opacity: 0.8; }
              80%  { stroke-dashoffset: 0; opacity: 0.7; }
              100% { stroke-dashoffset: 0; opacity: 0; }
            }
            @keyframes noeudSatelliteAppear {
              0%   { opacity: 0; }
              50%  { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </svg>
      )}
      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("kairos")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="stack text-center gap-m" style={{ alignItems: "center", maxWidth: 540 }}>
            <h3 className="h3-lecture">La forêt a parlé. Tu as ressenti dans {shiftZone === "rien-shift" ? "l'attente" : "ta " + shiftZone}.</h3>
            <p className="ash-italic" style={{ fontSize: 16, textWrap: "pretty" }}>
              C'est tenu. Le reste n'a pas besoin d'être dit.
            </p>
            <div className="row gap-s mt-m">
              <button className="btn-text" onClick={() => go("kairos")}>retour au kairos</button>
              <button className="btn-ghost" onClick={() => go("conte-miroir")}>
                un conte qui porte l'image ?
              </button>
            </div>
          </div>
        </div>
        {showAha && window.AhaCapture && <window.AhaCapture context="foret-first" onClose={() => setShowAha(false)} />}
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. CERCLE — ConstellationD3 KAIROS (pas membres)
//    matter earth + nodes = rêves partagés, edges = résonances
// ══════════════════════════════════════════════════════════════
const cercleKairosNodesV12 = [
  { id: "self",       label: "ici", kind: "self", weight: 2.5 },
  { id: "k-baleine",  label: "la baleine qui remonte",   kind: "kairos",   weight: 2.2 },
  { id: "k-pont",     label: "pont inachevé",            kind: "bigdream", weight: 2.6 },
  { id: "k-grandmere",label: "grand-mère sans feu",      kind: "kairos",   weight: 2.0 },
  { id: "k-enfant",   label: "enfant-animal au placard", kind: "kairos",   weight: 1.8 },
  { id: "k-porte",    label: "la porte fermée",          kind: "kairos",   weight: 1.6 },
  { id: "k-eau",      label: "eau qui cherche son lit",  kind: "kairos",   weight: 1.9 },
  { id: "k-corbeau",  label: "corbeau / feuille morte",  kind: "kairos",   weight: 1.4 },
  { id: "k-cuisine",  label: "cuisine sans feu",         kind: "kairos",   weight: 1.5 },
];
const cercleKairosEdgesV12 = [
  { source: "self", target: "k-pont", alive: true },
  { source: "self", target: "k-baleine" },
  { source: "self", target: "k-grandmere", alive: true },
  { source: "k-baleine", target: "k-eau" },
  { source: "k-grandmere", target: "k-cuisine" },
  { source: "k-grandmere", target: "k-porte" },
  { source: "k-pont", target: "k-eau", alive: true },
  { source: "k-enfant", target: "k-grandmere" },
  { source: "k-corbeau", target: "k-porte" },
];

const CercleV12 = ({ go }) => {
  const [temporal, setTemporal] = v3S("ce-cycle");
  const [reading, setReading] = v3S(false);
  const [selectedKairos, setSelectedKairos] = v3S(null);

  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="earth" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55,
      }} />
      {/* triangle géosymbolique discret en haut, rappel rituel cercle */}
      <div style={{
        position: "absolute", top: 70, right: -40,
        width: 220, height: 220, opacity: 0.07, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="cercle-concentrique" color="silk" />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            cercle · 5 personnes · depuis l'équinoxe d'automne
          </div>
          <h1 className="h1-seuil mb-m">les pieds dans la même rivière</h1>
          <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 560 }}>
            Pas une carte des membres. Une carte des <em>rêves</em> que vous tenez ensemble — et qui se cherchent les uns les autres.
          </p>

          {/* ConstellationD3 des KAIROS partagés (pas des membres) */}
          <div style={{
            border: "1px solid var(--ash-deep)",
            background: "color-mix(in oklch, var(--obsidian) 45%, transparent)",
            marginBottom: "var(--s-4)",
          }}>
            <window.ConstellationD3
              nodes={cercleKairosNodesV12}
              edges={cercleKairosEdgesV12}
              focalId="self"
              driftParticles={true}
              showLabels={true}
              onNodeClick={(n) => setSelectedKairos(n.id)}
              style={{ width: "100%", height: 360 }}
            />
          </div>
          {selectedKairos && (
            <div className="meta text-center mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
              {cercleKairosNodesV12.find(n => n.id === selectedKairos)?.label}
            </div>
          )}
          <div className="meta op-70 mb-l text-center" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5 }}>
            les rêves ici sont anonymisés — la trame compte plus que la signature
          </div>

          <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
            {[
              ["ce-cycle", "ce cycle"],
              ["dernier", "dernière lune"],
              ["saison", "cette saison"],
            ].map(([k, l]) => (
              <button key={k}
                className={"chip " + (temporal === k ? "active" : "")}
                onClick={() => setTemporal(k)}>
                {l}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button className="btn-ghost" onClick={() => setReading(true)}>
              demander une lecture
            </button>
          </div>

          <div className="divider-moon">tenir ensemble</div>
          <p className="body op-70 text-center" style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 540, margin: "0 auto", textWrap: "pretty" }}>
            chaque nœud est un rêve qu'au moins deux d'entre vous tiennent.
            les liens qui respirent sont ceux qui ont été ravivés cette lune.
          </p>

          <button className="btn-text mt-xl" onClick={() => go("partager-reve")}
            style={{ display: "block", width: "100%", textAlign: "center", padding: "var(--s-4)" }}>
            déposer un rêve dans le cercle →
          </button>
        </div>

        {reading && window.ReadingRequestModal && (
          <window.ReadingRequestModal cercle={{ name: "le cercle" }} onClose={() => setReading(false)} />
        )}
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 4. FIGURE DETAIL — halo silk + drop cap pour figures bigdream
// ══════════════════════════════════════════════════════════════
const FigureDetailV12 = ({ go }) => {
  const figure = window.seedFigure || {
    id: "fig-grandmere",
    nom: "la grand-mère sans feu",
    glyph: "✥",
    occurrences: 14,
    apparu: "depuis avril 2024",
    description: "Elle revient depuis 11 mois. Toujours dans des cuisines, toujours sans feu. Elle ne te regarde pas — mais elle sait ton nom.",
    resonances: ["ancêtre", "seuil", "linge", "héritage", "lignée"],
    moments: [
      { id: "m1", when: "il y a 11 mois", text: "Première apparition. Cuisine d'enfance, mais agrandie. Elle lave du linge.", kairosId: "k-08" },
      { id: "m2", when: "il y a 7 mois", text: "Elle apparaît dans une rêverie diurne, près d'un évier réel.", kairosId: "k-08", transform: true, transformNote: "passage du nocturne au diurne" },
      { id: "m3", when: "il y a une lune", text: "Elle parle pour la première fois — un mot inaudible, peut-être un nom.", kairosId: "k-08" },
    ],
  };
  const [mode, setMode] = v3S("timeline");
  const [dialogue, setDialogue] = v3S([
    { role: "ai", text: "elle est là, pas loin. veux-tu lui parler de ce rêve de ce matin ?" },
  ]);
  const [input, setInput] = v3S("");
  const [pending, setPending] = v3S(false);
  const scrollRef = v3R(null);

  v3E(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [dialogue, pending]);

  const send = async () => {
    if (!input.trim() || pending) return;
    const msg = input.trim();
    setInput("");
    setDialogue(d => [...d, { role: "user", text: msg }]);
    setPending(true);
    if (window.playRitual) window.playRitual("tisse");
    try {
      const sys = `Tu es la voix d'une figure intérieure rencontrée dans les rêves de l'utilisatrice.
Nom : "la grand-mère sans feu". Elle est apparue 14 fois en 11 mois.
- Tu n'expliques jamais. Tu t'adresses à elle comme une figure peut s'adresser.
- Pas de "archétypes", "inconscient", "symboles", "fragments". Tu es cette figure.
- 1 à 3 phrases maximum. Français.
- Si l'utilisatrice traverse une zone de détresse aiguë : "ceci m'échappe. pose tes mains au sol, et va vers quelqu'un de chair."`;
      const reply = await window.claude.complete({ system: sys, messages: [{ role: "user", content: msg }] });
      setDialogue(d => [...d, { role: "ai", text: String(reply).trim() }]);
    } catch {
      setDialogue(d => [...d, { role: "ai", text: "le silence, cette fois." }]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="stage screen-enter" style={{ position: "relative" }}>
      <window.Surface matter="paper" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55,
      }} />
      {/* halo silk respirant derrière le glyph de la figure */}
      <div style={{
        position: "absolute", top: 80, left: "10%",
        width: 240, height: 240, pointerEvents: "none", zIndex: 1, opacity: 0.55,
      }}>
        <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
      </div>

      <div style={{ position: "relative", zIndex: 2 }}>
        <window.TopNav showBack onBack={() => go("portrait")} label="" />
        <div className="frame">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            portrait · figure
          </div>

          <div className="row mb-l" style={{ alignItems: "baseline", gap: "var(--s-4)", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--serif)", fontSize: 56, color: "var(--silk-gold)", lineHeight: 1, position: "relative" }}>
              {figure.glyph}
            </span>
            <div>
              <h1 className="h1-seuil" style={{ fontStyle: "italic" }}>{figure.nom}</h1>
              <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", marginTop: 4 }}>
                {figure.occurrences} apparitions · {figure.apparu}
              </div>
            </div>
          </div>

          {/* description avec drop cap */}
          <div className="card mb-l" style={{ position: "relative" }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              comment elle arrive
            </div>
            <p className="h3-lecture bigdream-dropcap" style={{ fontSize: 21, textWrap: "pretty", fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--bone)" }}>
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
                {figure.moments.map(m => (
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
                        color: "var(--silk-gold)", padding: "4px 10px",
                        display: "inline-block", border: "1px solid var(--silk-gold)",
                        marginTop: 4, fontSize: 12,
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

              <div ref={scrollRef} className="stack gap-m" style={{ maxHeight: 420, overflowY: "auto", padding: "var(--s-3) 0" }}>
                {dialogue.map((m, i) => (
                  <div key={i} className={"bubble " + m.role}>{m.text}</div>
                ))}
                {pending && <div className="bubble ai" style={{ fontStyle: "italic", opacity: 0.7 }}>…</div>}
              </div>

              <div className="row gap-s mt-l" style={{ alignItems: "flex-end" }}>
                <textarea value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  rows={1} placeholder="lui parler…"
                  style={{
                    flex: 1, background: "transparent",
                    border: "1px solid var(--ash-deep)", padding: "10px 14px",
                    color: "var(--bone)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
                    resize: "none", outline: "none", minHeight: 44,
                  }} />
                <button className="btn-ghost" onClick={send} disabled={!input.trim() || pending}>
                  parler
                </button>
              </div>
            </>
          )}
          {window.ExitToHuman && <window.ExitToHuman />}
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. MÉTÉO — songlines pleine page + matter water + symbole eau central
// ══════════════════════════════════════════════════════════════
const MeteoV12 = ({ go }) => (
  <div className="stage screen-enter" style={{ position: "relative" }}>
    <window.Surface matter="water" motion={true} style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.7,
    }} />
    {/* songlines pleine page — c'est la signature de la météo */}
    <div style={{
      position: "absolute", inset: 0, zIndex: 1, opacity: 0.18, pointerEvents: "none",
    }}>
      <window.GeoSymbol kind="songlines" color="silk" />
    </div>
    {/* halo earth très discret en bas — l'ancrage collectif */}
    <div style={{
      position: "absolute", bottom: -100, left: "50%",
      transform: "translateX(-50%)",
      width: 600, height: 400, pointerEvents: "none", zIndex: 1, opacity: 0.4,
    }}>
      <window.HaloRespire kind="earth" style={{ width: "100%", height: "100%" }} />
    </div>

    <div style={{ position: "relative", zIndex: 2 }}>
      <window.TopNav showBack onBack={() => go("anima")} label="anima mundi" />
      <div className="frame">
        <h2 className="h2-section mb-s">Le temps qu'il fait dans la nuit</h2>
        <div className="divider" />
        <p className="seuil-italic mb-xl" style={{ maxWidth: 560, textWrap: "pretty" }}>
          Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes —
          d'eau qui se cherche un lit, d'estuaires qui se forment.
        </p>

        {/* Symbole eau central avec halo silk respirant */}
        <div className="text-center mb-xl" style={{ position: "relative", padding: "var(--s-5) 0" }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 220, height: 220, pointerEvents: "none", opacity: 0.6,
          }}>
            <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
          </div>
          <svg width="100" height="100" viewBox="0 0 80 80" style={{ opacity: 0.85, position: "relative" }}>
            <path d="M40 15 Q28 30 28 45 Q28 60 40 68 Q52 60 52 45 Q52 30 40 15 Z"
              fill="none" stroke="var(--bone)" strokeWidth="0.9" />
            <path d="M40 25 Q33 35 33 48 Q33 58 40 62"
              fill="none" stroke="var(--bone)" strokeWidth="0.5" opacity="0.6" />
          </svg>
          <div className="meta mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", position: "relative" }}>eau</div>
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
          recalculée le 18 mars · délai rituel 14 j · prochaine : nouvelle lune
        </div>
      </div>
    </div>
    {window.FeedbackFloat && <window.FeedbackFloat />}
  </div>
);

// ══════════════════════════════════════════════════════════════
// 6. POLYPHONIE — demi-cercle aurore haut + halo silk + matter linen
//     + drop cap sur le premier paragraphe
// ══════════════════════════════════════════════════════════════
const PolyphonieV12 = ({ go }) => (
  <div className="stage screen-enter" style={{ position: "relative" }}>
    <window.Surface matter="linen" motion={true} style={{
      position: "absolute", inset: 0, zIndex: 0, opacity: 0.65,
    }} />
    {/* demi-cercle aurore en haut — c'est une lecture, pas une chambre */}
    <div style={{
      position: "absolute", top: 50, left: 0, right: 0, height: 200,
      zIndex: 1, pointerEvents: "none", opacity: 0.55,
    }}>
      <window.GeoSymbol kind="demi-cercle" />
    </div>
    {/* halo silk discret derrière le texte */}
    <div style={{
      position: "absolute", top: 200, left: "50%",
      transform: "translateX(-50%)",
      width: 580, height: 600, pointerEvents: "none", zIndex: 1, opacity: 0.4,
    }}>
      <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
    </div>

    <div style={{ position: "relative", zIndex: 2 }}>
      <window.TopNav showBack onBack={() => go("anima")} label="anima mundi" />
      <div className="frame" style={{ maxWidth: 640 }}>
        <h2 className="h2-section mb-l">Polyphonie de la lune de mars</h2>
        <div className="divider" />

        <div style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.7, color: "var(--bone)" }}>
          <p className="bigdream-dropcap" style={{ textWrap: "pretty" }}>
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
          <p style={{ textWrap: "pretty", fontStyle: "italic", marginTop: "var(--s-5)", color: "var(--silk-gold)" }}>
            Que se cherche-t-elle, l'eau qui cherche son lit ?
          </p>
        </div>

        <div className="divider" />

        <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14 }}>
          voix mobilisées cette lune
        </div>
        <div className="mt-s meta-mono">Aizenstat · Moss · Bachelard</div>

        <div className="divider-moon">lectures précédentes</div>
        <div className="stack gap-s">
          <button className="btn-text text-center" style={{ fontSize: 15 }}>• lune de février</button>
          <button className="btn-text text-center" style={{ fontSize: 15 }}>• lune de janvier</button>
        </div>
      </div>
    </div>
    {window.FeedbackFloat && <window.FeedbackFloat />}
  </div>
);

// ══════════════════════════════════════════════════════════════
// 7. ANNALES — matter stone + cercles concentriques en arrière-plan
//    + halo silk sur cards qui sont "tenues" par l'utilisateur
// ══════════════════════════════════════════════════════════════
const AnnalesV12 = ({ go }) => {
  const Original = window.__AnnalesOriginal;
  if (!Original) return null;
  return (
    <div style={{ position: "relative" }}>
      <window.Surface matter="stone" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none",
      }} />
      {/* cercles concentriques très subtils à droite — les rêves qui se tiennent en cercle */}
      <div style={{
        position: "absolute", top: 200, right: -100,
        width: 400, height: 400, opacity: 0.10, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="cercle-concentrique" color="silk" />
      </div>
      {/* halo silk subtil en haut à gauche pour les rêves "tenus" */}
      <div style={{
        position: "absolute", top: 100, left: -50,
        width: 300, height: 300, opacity: 0.4, pointerEvents: "none", zIndex: 1,
      }}>
        <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 8. CONTE-MIROIR — matter silk + spirale + drop cap conte
// ══════════════════════════════════════════════════════════════
const ConteMiroirV12 = ({ go }) => {
  const Original = window.__ConteMiroirOriginal;
  if (!Original) return null;
  return (
    <div style={{ position: "relative" }}>
      <window.Surface matter="silk" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: "none",
      }} />
      {/* spirale ample — la mémoire des contes qui tourne */}
      <div style={{
        position: "absolute", top: 150, left: -100,
        width: 500, height: 500, opacity: 0.10, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="spirale" color="silk" />
      </div>
      {/* halo silk derrière la zone de lecture */}
      <div style={{
        position: "absolute", top: 300, left: "50%",
        transform: "translateX(-50%)",
        width: 600, height: 400, pointerEvents: "none", zIndex: 1, opacity: 0.45,
      }}>
        <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
      <style>{`
        .stage .conte-card .body {
          font-family: var(--serif);
        }
        .stage .conte-card .body::first-letter {
          font-family: var(--serif);
          font-size: 3.2em;
          font-style: italic;
          line-height: 0.85;
          float: left;
          padding: 0.05em 0.12em 0 0;
          color: var(--silk-gold);
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 9-11. CERCLE — wrappers ambient pour Créer / Rejoindre / Partager rêve
//       matter earth + halo silk discret sur titre. Pas de refonte.
// ══════════════════════════════════════════════════════════════
const cercleAmbientWrap = (Original, { matter = "earth", titleHalo = true } = {}) => {
  return ({ go }) => {
    if (!Original) return null;
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <window.Surface matter={matter} motion={true} style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: "none",
        }} />
        {/* cercles concentriques discrets en arrière-plan, signature cercle */}
        <div style={{
          position: "absolute", top: 80, right: -60,
          width: 280, height: 280, opacity: 0.07, pointerEvents: "none", zIndex: 1,
        }}>
          <window.GeoSymbol kind="cercle-concentrique" color="silk" />
        </div>
        {/* halo silk subtil derrière la zone titre */}
        {titleHalo && (
          <div style={{
            position: "absolute", top: 90, left: "50%",
            transform: "translateX(-50%)",
            width: 380, height: 180, pointerEvents: "none", zIndex: 1, opacity: 0.32,
          }}>
            <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
          </div>
        )}
        <div style={{ position: "relative", zIndex: 2 }}>
          <Original go={go} />
        </div>
      </div>
    );
  };
};

// ══════════════════════════════════════════════════════════════
// Application des overrides V3
// ══════════════════════════════════════════════════════════════

// Sauvegarde des originaux pour wrapping
window.__AnnalesOriginal = window.AnnalesScreen;
window.__ConteMiroirOriginal = window.ConteMiroirScreen;
window.__CreerCercleOriginal = window.CreerCercleScreen;
window.__RejoindreOriginal = window.RejoindreScreen;
window.__PartagerReveOriginal = window.PartagerReveScreen;

// Override les composants V1.1 par leurs versions V1.2
window.Journal = JournalV12;
// 2026-04-25 — CercleScreen NE doit PLUS être écrasé par CercleV12.
// Le nouveau CercleScreen (liste cercles + créer + rejoindre) vient de screens-cercle.jsx.
// CercleV12 (constellation seed ambient) reste accessible via window.CercleConstellation
// pour usage futur (sous-page "voir la trame du cercle" depuis CercleDetail).
window.CercleConstellation = CercleV12;
// window.CercleScreen = CercleV12;  // BLOQUÉ : laisse passer le nouveau CercleScreen
window.FigureDetailScreen = FigureDetailV12;
window.Meteo = MeteoV12;
window.Polyphonie = PolyphonieV12;
window.AnnalesScreen = AnnalesV12;
window.ConteMiroirScreen = ConteMiroirV12;

// Nouveau écran : Forêt FIRST — workflow d'interprétation 5 temps
window.ForetFirstScreen = ForetFirstV12;

// Wrappers ambient sur les 3 écrans cercle V1.1 non amplifiés en V5
window.CreerCercleScreen   = cercleAmbientWrap(window.__CreerCercleOriginal, { matter: "earth" });
window.RejoindreScreen     = cercleAmbientWrap(window.__RejoindreOriginal,   { matter: "earth" });
window.PartagerReveScreen  = cercleAmbientWrap(window.__PartagerReveOriginal, { matter: "silk" });
