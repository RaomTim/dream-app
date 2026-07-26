/* global React */
const { useState: uAS, useEffect: uAE, useMemo: uAM } = React;

// ── Sample Big Dreams corpus ─────────────────────────────────
const seedBigDreams = [
  {
    id: "bd-1",
    text: "Une grand-mère inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom. Quelque part, une porte qu'on ne finit pas d'ouvrir.",
    when: "il y a onze jours",
    moon: "lune décroissante",
    seasons: "début de printemps",
    region: "europe ouest",
    held: 34,
    youHold: false,
    anonymous: true,
    resonances: ["seuil", "ancêtre", "maison intérieure"],
    echo: 7,
  },
  {
    id: "bd-2",
    text: "Un enfant-animal que j'ai oublié de nourrir depuis des années sort du placard vivant. Pas en colère. Simplement vivant.",
    when: "il y a une lune",
    moon: "nouvelle lune",
    seasons: "fin d'hiver",
    region: "amérique nord",
    held: 52,
    youHold: true,
    anonymous: true,
    resonances: ["animal intérieur", "négligence", "retour"],
    echo: 12,
  },
  {
    id: "bd-3",
    text: "Je traverse un pont qu'on n'a pas fini de construire. Il se construit sous mes pieds — mais seulement si je continue.",
    when: "il y a deux lunes",
    moon: "pleine lune",
    seasons: "plein hiver",
    region: "océanie",
    held: 21,
    youHold: false,
    anonymous: true,
    resonances: ["pont", "traversée", "foi"],
    echo: 4,
  },
  {
    id: "bd-4",
    text: "Une baleine remonte dans une rivière asséchée, suivie par des gens qui tiennent des seaux d'eau, un à la fois.",
    when: "il y a trois lunes",
    moon: "lune croissante",
    seasons: "fin d'automne",
    region: "asie sud",
    held: 67,
    youHold: false,
    anonymous: true,
    resonances: ["baleine", "soif", "entraide"],
    echo: 18,
  },
];

// ── Annales des Big Dreams ──────────────────────────────────
const AnnalesScreen = ({ go }) => {
  const [resonance, setResonance] = uAS(null);
  const [moon, setMoon] = uAS(null);
  const [corpus, setCorpus] = uAS(seedBigDreams);

  const allResonances = uAM(() => {
    const s = new Set();
    seedBigDreams.forEach(d => d.resonances.forEach(r => s.add(r)));
    return Array.from(s);
  }, []);

  const filtered = corpus.filter(d =>
    (!resonance || d.resonances.includes(resonance)) &&
    (!moon || d.moon === moon)
  );

  const toggleHold = (id) => {
    setCorpus(c => c.map(d => d.id === id ? { ...d, youHold: !d.youHold, held: d.held + (d.youHold ? -1 : 1) } : d));
  };

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
      <window.TopNav showBack onBack={() => go("anima")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          anima mundi · annales
        </div>
        <h1 className="h1-seuil mb-m">les rêves qu'on tient ensemble</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 580 }}>
          Ces rêves ont été offerts à la voûte commune. Nous les tenons — non pour les comprendre, mais parce qu'ils nous regardent.
        </p>

        <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
          <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", marginRight: 6 }}>
            résonance :
          </div>
          {allResonances.map(r => (
            <button key={r}
              className={"chip " + (resonance === r ? "active" : "")}
              onClick={() => setResonance(resonance === r ? null : r)}>
              {r}
            </button>
          ))}
        </div>

        <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
          <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", marginRight: 6 }}>
            lune :
          </div>
          {["nouvelle lune", "lune croissante", "pleine lune", "lune décroissante"].map(m => (
            <button key={m}
              className={"chip " + (moon === m ? "active" : "")}
              onClick={() => setMoon(moon === m ? null : m)}>
              {m}
            </button>
          ))}
        </div>

        <div className="divider-moon">
          {filtered.length} rêves tenus
        </div>

        <div className="stack gap-l">
          {filtered.map(d => (
            <div key={d.id} className="annale-card">
              <div className="row mb-s" style={{ gap: "var(--s-3)", flexWrap: "wrap" }}>
                <div className="meta" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.06em" }}>
                  {d.moon.toUpperCase()}
                </div>
                <div className="meta op-70">{d.seasons}</div>
                <div className="meta op-70">· {d.region}</div>
              </div>
              <p className="h3-lecture mb-m" style={{ fontSize: 21, textWrap: "pretty" }}>
                {d.text}
              </p>
              <div className="row gap-s mb-m" style={{ flexWrap: "wrap" }}>
                {d.resonances.map(r => (
                  <span key={r} style={{
                    padding: "2px 10px",
                    border: "1px solid var(--ash-deep)",
                    fontSize: 11.5, color: "var(--ash-light)",
                    fontFamily: "var(--serif)", fontStyle: "italic",
                  }}>{r}</span>
                ))}
              </div>
              <div className="divider" style={{ margin: "var(--s-3) 0" }} />
              <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--s-3)" }}>
                <button
                  className={"tenir-ensemble " + (d.youHold ? "held" : "")}
                  onClick={() => toggleHold(d.id)}>
                  {d.youHold ? "tu tiens ceci" : "tenir ceci avec nous"}
                </button>
                <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                  {d.held} personnes tiennent · {d.echo} échos
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="divider-moon">sur l'anonymat</div>
        <p className="body op-70" style={{ textWrap: "pretty", maxWidth: 620 }}>
          Tous les rêves offerts à la voûte sont anonymes par défaut. Lune, saison, région — pas de nom, pas d'âge, pas de parcours. Ce qui reste, c'est l'image qui voyage, et celles et ceux qui la tiennent avec toi.
        </p>
        <p className="body op-70 mt-m" style={{ textWrap: "pretty", maxWidth: 620, fontFamily: "var(--serif)", fontStyle: "italic" }}>
          "Tenir" n'est pas voter. Cette métrique ne décide de rien. Elle te dit seulement : tu n'es pas seule à porter cela.
        </p>
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

// ── Offre au kairos (slide-up après kairos numinous) ────────
const OffreKairosSheet = ({ entry, onClose, onOffer }) => {
  const [step, setStep] = uAS(0);
  const [consent, setConsent] = uAS({ image: true, moon: true, region: false });

  return (
    <div className="offre-sheet">
      <div style={{ maxWidth: 620, margin: "0 auto" }}>
        {step === 0 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
              ce rêve porte un numinous
            </div>
            <h2 className="h2-section mb-m" style={{ fontSize: 23 }}>
              voudrais-tu l'offrir à anima mundi ?
            </h2>
            <p className="body op-70 mb-m" style={{ textWrap: "pretty" }}>
              Certains rêves semblent appartenir au-delà de nous. Les offrir à la voûte commune, c'est permettre qu'ils soient tenus par des inconnues, dans d'autres régions, d'autres lunes.
            </p>
            <p className="meta mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)", textWrap: "pretty" }}>
              ce n'est pas obligatoire. tu peux dire non, sans explication.
            </p>
            <div className="row gap-m" style={{ justifyContent: "flex-end" }}>
              <button className="btn-text" onClick={onClose}>pas cette fois</button>
              <button className="btn-ghost" onClick={() => setStep(1)}>voir ce qui serait partagé</button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              ce qui voyagerait vers anima mundi
            </div>
            <h3 className="h3-lecture mb-m" style={{ fontSize: 19 }}>avec ton accord, et seulement ce que tu veux.</h3>

            <div className="stack" style={{ gap: 0 }}>
              <div className="setting-row">
                <div className="label">
                  <div className="title">l'image du rêve</div>
                  <div className="desc">anonyme. aucune trace de toi, aucun identifiant.</div>
                </div>
                <span className={"toggle " + (consent.image ? "on" : "")}
                  onClick={() => setConsent(c => ({ ...c, image: !c.image }))} />
              </div>
              <div className="setting-row">
                <div className="label">
                  <div className="title">phase de lune et saison</div>
                  <div className="desc">aide la voûte à lire les rythmes collectifs.</div>
                </div>
                <span className={"toggle " + (consent.moon ? "on" : "")}
                  onClick={() => setConsent(c => ({ ...c, moon: !c.moon }))} />
              </div>
              <div className="setting-row">
                <div className="label">
                  <div className="title">région large (continent)</div>
                  <div className="desc">jamais de ville, jamais de pays. continent seulement.</div>
                </div>
                <span className={"toggle " + (consent.region ? "on" : "")}
                  onClick={() => setConsent(c => ({ ...c, region: !c.region }))} />
              </div>
            </div>

            <div className="meta op-70 mt-l mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              tu peux retirer ce rêve de la voûte à tout moment. il disparaît en 48h.
            </div>
            <div className="row gap-m" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>← retour</button>
              <button className="btn-ghost" onClick={() => { onOffer?.(consent); setStep(2); }}>
                offrir
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="text-center" style={{ padding: "var(--s-5) 0" }}>
            <div className="breath mb-l" style={{ width: 80, height: 80 }} />
            <p className="seuil-italic mb-s" style={{ maxWidth: 420, margin: "0 auto" }}>
              le rêve a rejoint la voûte.
            </p>
            <div className="meta op-70 mt-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              il est tenu par les lunes. tu seras notifiée si son image en rencontre d'autres.
            </div>
            <button className="btn-text mt-xl" onClick={onClose}>refermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Screen standalone pour démontrer l'offre ────────────────
const OffreKairosScreen = ({ go }) => {
  const [open, setOpen] = uAS(true);
  const entry = (window.seedEntries || [])[0];
  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <window.TopNav showBack onBack={() => go("kairos")} label="" />
      <div className="frame" style={{ opacity: open ? 0.3 : 1, transition: "opacity var(--tempo-tisse)" }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          détail · {entry?.when}
        </div>
        <p className="h3-lecture" style={{ fontSize: 25, textWrap: "pretty", maxWidth: 600 }}>
          {entry?.text}
        </p>
      </div>
      {open && (
        <OffreKairosSheet
          entry={entry}
          onClose={() => setOpen(false)}
          onOffer={() => {}}
        />
      )}
      {!open && (
        <div className="frame" style={{ paddingTop: 0 }}>
          <button className="btn-text" onClick={() => setOpen(true)}>rouvrir l'offre</button>
        </div>
      )}
      <window.FeedbackFloat />
    </div>
  );
};

Object.assign(window, { AnnalesScreen, OffreKairosScreen, OffreKairosSheet });
