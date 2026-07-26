/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ── Sample data ─────────────────────────────────────────────
const seedEntries = [
  {
    id: "k-08",
    type: "dream_night",
    when: "ce matin, avant le réveil",
    text: "Une grand-mère inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom. Quelque part, une porte qu'on ne finit pas d'ouvrir.",
    numinous: true,
    bigDream: true,
  },
  {
    id: "k-07",
    type: "note_vie",
    when: "hier soir",
    text: "Doute profond sur la mission. Ce n'est pas la peur d'échouer. C'est la peur que ce soit juste — et qu'il faille tout redessiner.",
  },
  {
    id: "k-06",
    type: "sidewalk_oracle",
    when: "hier, 14h",
    text: "Un corbeau sur le muret de la mosquée, qui tenait dans son bec une feuille morte plus grande que sa tête. Il ne la laissait pas tomber.",
  },
  {
    id: "k-05",
    type: "synchronicity",
    when: "avant-hier",
    text: "Trois personnes, en moins de six heures, m'ont parlé d'un pont inachevé. Aucune ne se connaissait.",
  },
  {
    id: "k-04",
    type: "daydream_reverie",
    when: "il y a quatre jours, midi",
    text: "Pendant une conversation sur les taxes, j'ai vu un estuaire depuis en haut. L'eau cherchait son lit entre des bancs de sable que personne n'avait dessinés.",
  },
  {
    id: "k-03",
    type: "dream_night",
    when: "il y a une lune",
    text: "Une maison aux pièces inconnues. Je cherche un enfant qui pleure derrière une porte. La porte est plus petite que moi.",
    echoOf: "k-08",
  },
  {
    id: "k-02",
    type: "somatic_shiver",
    when: "il y a deux lunes",
    text: "Frisson dans la nuque en lisant une lettre ancienne. Pas de mots — juste le frisson.",
  },
  {
    id: "k-01",
    type: "note_vie",
    when: "il y a deux lunes",
    text: "Décision reportée sur le contrat Paris. Quelque chose dans le ventre dit attends.",
  },
];

// ── Type glyphs (matter) ────────────────────────────────────
const typeLabel = (t) => ({
  dream_night: "rêve nocturne",
  sidewalk_oracle: "signe diurne",
  daydream_reverie: "rêverie",
  hypnagogic: "hypnagogie",
  synchronicity: "synchronicité",
  somatic_shiver: "frisson somatique",
  note_vie: "note de vie",
}[t] || "moment");

const TypeGlyph = ({ type, size = 14 }) => {
  const common = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1 };
  switch (type) {
    case "dream_night":
      return <svg {...common}><circle cx={size/2} cy={size/2} r={size/2 - 1} /></svg>;
    case "sidewalk_oracle":
      return <svg {...common}><polygon points={`${size/2},1 ${size-1},${size-1} 1,${size-1}`} /></svg>;
    case "daydream_reverie":
      return <svg {...common}><path d={`M1 ${size/2} Q ${size/4} 1 ${size/2} ${size/2} T ${size-1} ${size/2}`} /></svg>;
    case "synchronicity":
      return <svg {...common}><circle cx={size/3} cy={size/2} r={size/4} /><circle cx={2*size/3} cy={size/2} r={size/4} /></svg>;
    case "somatic_shiver":
      return <svg {...common}><path d={`M1 ${size-2} L ${size/3} 2 L ${2*size/3} ${size-2} L ${size-1} 2`} /></svg>;
    case "hypnagogic":
      return <svg {...common}><line x1="1" y1={size/2} x2={size-1} y2={size/2} /><circle cx={size/2} cy={size/2} r="2" /></svg>;
    default:
      return <svg {...common}><rect x="1" y="1" width={size-2} height={size-2} /></svg>;
  }
};

// ── Seasonal compass (top nav) ──────────────────────────────
const SeasonalCompass = () => (
  <div className="nav-compass">
    <span className="glyph">◐</span>lune décroissante · mars
  </div>
);

const TopNav = ({ onLogo, showBack, onBack, label }) => (
  <nav className="nav">
    {showBack ? (
      <button className="btn-text" onClick={onBack} aria-label="retour">
        ← {label || "retour"}
      </button>
    ) : (
      <button onClick={onLogo} aria-label="accueil"
        style={{ background: "none", border: "none", padding: 0 }}>
        <span className="nav-dot" />
      </button>
    )}
    <SeasonalCompass />
  </nav>
);

// ── Home (journal substrat) ─────────────────────────────────
const Home = ({ go, entries }) => {
  const latest = entries[0];
  return (
    <div className="stage screen-enter">
      <TopNav />
      <div className="frame" style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="meta mb-l text-center op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            ce que le journal tient en ce moment
          </div>

          <div className="card" style={{ padding: "var(--s-6) var(--s-5)" }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              {latest.when}
            </div>
            <p className="h3-lecture" style={{ textWrap: "pretty" }}>
              {latest.text}
            </p>
          </div>

          <button className="whisper mt-l" onClick={() => go("kairos", latest.id)}>
            un kairos t'attend pour cette question
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-4)", paddingTop: "var(--s-6)" }}>
          <button className="btn-deposer" onClick={() => go("capture")} aria-label="déposer">
            <svg viewBox="0 0 28 28">
              <path d="M4 10 Q14 22 24 10" />
              <line x1="14" y1="2" x2="14" y2="10" />
            </svg>
          </button>
          <div className="meta" style={{ letterSpacing: "0.15em", textTransform: "lowercase" }}>déposer</div>
        </div>

        <div className="row" style={{ justifyContent: "space-between", marginTop: "var(--s-6)" }}>
          <button className="btn-text" onClick={() => go("journal")}>journal</button>
          <button className="btn-text" onClick={() => go("portrait")}>portrait</button>
          <button className="btn-text" onClick={() => go("anima")}>anima mundi</button>
        </div>
      </div>
    </div>
  );
};

// ── Capture (somatic gate → field → post) ───────────────────
const Capture = ({ go }) => {
  const [phase, setPhase] = useState("gate"); // gate | field | post | type
  const [text, setText] = useState("");
  const taRef = useRef(null);

  useEffect(() => {
    if (phase === "field" && taRef.current) taRef.current.focus();
  }, [phase]);

  if (phase === "gate") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
        <TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="stack" style={{ alignItems: "center", gap: "var(--s-6)" }}>
            <div className="breath" />
            <p className="seuil-italic text-center" style={{ maxWidth: 420 }}>
              Trois respirations. Sens tes pieds. Tu es là.
            </p>
            <button className="btn-ghost" onClick={() => setPhase("field")}>entrer</button>
            <button className="btn-text" onClick={() => setPhase("field")}>passer</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "field") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
        <div className="nav">
          <button className="btn-text" onClick={() => go("home")} aria-label="fermer">
            × fermer
          </button>
          <div className="meta op-70" style={{ fontFamily: "var(--mono)" }}>auto · local</div>
        </div>
        <div className="frame" style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, paddingTop: "var(--s-5)" }}>
            <textarea
              ref={taRef}
              className="capture-field"
              rows={14}
              placeholder="Ce qui est venu…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
          <div className="row" style={{ justifyContent: "space-between", paddingBottom: "var(--s-4)" }}>
            <div className="meta op-70">voix · {text.length} caractères</div>
            <div className="row gap-s">
              <button className="btn-ghost" onClick={() => setPhase("post")}
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
    );
  }

  if (phase === "post") {
    return (
      <div className="stage screen-enter">
        <TopNav showBack onBack={() => go("home")} label="" />
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
    );
  }
};

// ── Journal de Vie ──────────────────────────────────────────
const Journal = ({ go, entries }) => {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? entries : entries.filter(e => e.type === filter);
  return (
    <div className="stage screen-enter">
      <TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="row mb-m" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 className="h1-seuil">Journal</h1>
            <div className="mt-s"><SeasonalCompass /></div>
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
                style={{ cursor: "pointer" }}
              >
                <div className="row mb-s gap-s" style={{ color: "var(--ash-light)" }}>
                  <TypeGlyph type={e.type} />
                  <span className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>{e.when}</span>
                  <span className="meta op-50">·</span>
                  <span className="meta">{typeLabel(e.type)}</span>
                  {e.numinous && (
                    <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--ember-live)", opacity: 0.7 }} />
                  )}
                </div>
                <p className="body" style={{
                  fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.55,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                  textWrap: "pretty"
                }}>
                  {e.text}
                </p>
              </article>
            </div>
          ))}
        </div>

        <button className="btn-deposer" style={{ position: "fixed", bottom: 32, right: 32, width: 56, height: 56 }}
          onClick={() => go("capture")} aria-label="déposer">
          <svg viewBox="0 0 28 28" style={{ width: 20, height: 20 }}>
            <path d="M4 10 Q14 22 24 10" />
            <line x1="14" y1="2" x2="14" y2="10" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { Home, Capture, Journal, TopNav, TypeGlyph, typeLabel, seedEntries, SeasonalCompass });
