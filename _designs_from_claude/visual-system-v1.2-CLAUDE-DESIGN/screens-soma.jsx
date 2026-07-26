/* global React */
const { useState: uSS, useEffect: uSE, useMemo: uSM } = React;

// ── Oracle du Corps ─────────────────────────────────────────
// 8 Mindell zones + Martel/Dethlefsen/Odoul polarities reading

const zones = [
  {
    id: "tete",
    label: "tête",
    coord: { cx: 90, cy: 38, r: 18 },
    mindell: "le voyant, le penseur, la couronne qui sait",
    martel: "conflit entre ce que tu sais et ce que tu peux porter",
    dethlefsen: "polarité intellect ↔ incarnation",
    odoul: "le lieu du père",
    body: "migraines, tensions cervicales, sinus",
  },
  {
    id: "gorge",
    label: "gorge",
    coord: { cx: 90, cy: 72, r: 10 },
    mindell: "le passage entre ce qui sait et ce qui parle",
    martel: "parole retenue, vérité étouffée, tendresse qu'on n'offre pas",
    dethlefsen: "polarité intérieur ↔ extérieur",
    odoul: "le lieu de l'expression et du refus",
    body: "maux de gorge, thyroïde, perte de voix",
  },
  {
    id: "poitrine",
    label: "poitrine",
    coord: { cx: 90, cy: 100, r: 24 },
    mindell: "la chambre de l'accueil et du refus",
    martel: "peine ancienne, amour qu'on n'a pas laissé entrer",
    dethlefsen: "polarité prendre ↔ donner",
    odoul: "le lieu de la mère",
    body: "poitrine serrée, respiration courte, cœur",
  },
  {
    id: "ventre",
    label: "ventre",
    coord: { cx: 90, cy: 140, r: 22 },
    mindell: "le cerveau ancien, celui qui sait avant qu'on sache",
    martel: "ce qu'on ne peut digérer, soi-même inclus",
    dethlefsen: "polarité recevoir ↔ transformer",
    odoul: "le lieu de l'enfant intérieur",
    body: "crampes, troubles digestifs, nausées",
  },
  {
    id: "bas-ventre",
    label: "bas-ventre",
    coord: { cx: 90, cy: 172, r: 17 },
    mindell: "la racine du désir et de l'enracinement",
    martel: "lignées, appartenance, honte héritée",
    dethlefsen: "polarité racine ↔ créativité",
    odoul: "le lieu des ancêtres",
    body: "pelvis, reins, cycle",
  },
  {
    id: "dos",
    label: "dos (haut)",
    coord: { cx: 125, cy: 92, r: 14 },
    mindell: "ce qu'on porte sans le voir",
    martel: "fardeaux d'autrui, devoirs assimilés",
    dethlefsen: "polarité visible ↔ invisible",
    odoul: "le lieu du père, version dorsale",
    body: "épaules lourdes, trapèzes, cervicales",
  },
  {
    id: "pieds",
    label: "pieds",
    coord: { cx: 90, cy: 248, r: 14 },
    mindell: "le lien à la terre, à la direction",
    martel: "avancer, refuser d'avancer, où tu marches",
    dethlefsen: "polarité mouvement ↔ immobilité",
    odoul: "le lieu de la trajectoire",
    body: "chevilles, talons, envie de fuir",
  },
  {
    id: "mains",
    label: "mains",
    coord: { cx: 45, cy: 140, r: 12 },
    mindell: "ce qu'on peut faire, tenir, relâcher",
    martel: "donner sans recevoir, retenir ce qui doit partir",
    dethlefsen: "polarité saisir ↔ lâcher",
    odoul: "le lieu du faire",
    body: "poignets, arthrites, crampes",
  },
];

const OracleCorpsScreen = ({ go }) => {
  const [active, setActive] = uSS(null);
  const zone = zones.find(z => z.id === active);

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          oracle du corps
        </div>
        <h1 className="h1-seuil mb-m">où ton corps porte-t-il cela ?</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 580 }}>
          Le corps ne cache rien. Choisis la zone qui a frémi, ou celle qui pèse. Mindell, Martel, Dethlefsen, Odoul — quatre lectures, aucune n'est la vérité.
        </p>

        <div className="row gap-l" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          <div className="oracle-stage" style={{ flex: "0 0 220px", minWidth: 200 }}>
            <svg viewBox="0 0 180 290" width="180" height="auto" className="oracle-silhouette"
              style={{ maxHeight: 500 }}>
              {/* Silhouette schematic */}
              <g>
                {/* head */}
                <ellipse cx="90" cy="38" rx="19" ry="22" />
                {/* neck */}
                <rect x="84" y="60" width="12" height="14" />
                {/* torso */}
                <path d="M 64 74 Q 90 70 116 74 L 124 152 Q 90 160 56 152 Z" />
                {/* hips */}
                <path d="M 58 154 L 122 154 L 118 192 Q 90 198 62 192 Z" />
                {/* left leg */}
                <path d="M 64 196 L 70 260 L 82 260 L 84 196 Z" />
                {/* right leg */}
                <path d="M 96 196 L 98 260 L 110 260 L 116 196 Z" />
                {/* left arm */}
                <path d="M 60 82 L 42 160 L 52 162 L 66 90 Z" />
                {/* right arm */}
                <path d="M 120 82 L 138 160 L 128 162 L 114 90 Z" />
              </g>

              {/* clickable zones */}
              {zones.map(z => (
                <circle key={z.id}
                  cx={z.coord.cx} cy={z.coord.cy} r={z.coord.r}
                  className={"oracle-zone " + (active === z.id ? "active" : "")}
                  onClick={() => setActive(active === z.id ? null : z.id)}
                />
              ))}

              {/* labels (right side) */}
              {zones.map(z => (
                <text key={z.id + "-l"}
                  x={z.coord.cx > 90 ? z.coord.cx + z.coord.r + 4 : (z.coord.cx === 45 ? 8 : z.coord.cx + z.coord.r + 4)}
                  y={z.coord.cy + 3}
                  className="oracle-label"
                  style={{ opacity: active === z.id ? 1 : 0.5 }}>
                  {z.label}
                </text>
              ))}
            </svg>
          </div>

          <div style={{ flex: 1, minWidth: 280 }}>
            {!zone && (
              <div className="stack gap-m" style={{ paddingTop: "var(--s-4)" }}>
                <p className="body op-70" style={{ textWrap: "pretty" }}>
                  Touche une zone. Le corps parle en métaphores — pas en diagnostics.
                </p>
                <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                  ceci n'est jamais un avis médical. pour ton corps physique, va voir quelqu'un de chair.
                </div>
              </div>
            )}
            {zone && (
              <div className="stack gap-l" style={{ paddingTop: "var(--s-3)" }}>
                <div>
                  <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--clay-earth)" }}>
                    ZONE · {zone.label.toUpperCase()}
                  </div>
                  <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)" }}>
                    corps : {zone.body}
                  </div>
                </div>
                <ReadingBlock author="Mindell — le rêve du corps" text={zone.mindell} />
                <ReadingBlock author="Martel — ton corps te dit" text={zone.martel} />
                <ReadingBlock author="Dethlefsen — la maladie comme chemin" text={zone.dethlefsen} />
                <ReadingBlock author="Odoul — lecture des lieux" text={zone.odoul} />
                <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty" }}>
                  Ces lectures sont des hypothèses contradictoires. Garde celle qui te regarde en retour, laisse les autres.
                </div>
                <div className="row gap-s">
                  <button className="btn-ghost" onClick={() => go("capture")}>déposer ce que ça éveille</button>
                  <button className="btn-text" onClick={() => go("chat")}>en parler à la narratrice</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

const ReadingBlock = ({ author, text }) => (
  <div style={{ paddingLeft: "var(--s-3)", borderLeft: "1px solid var(--clay-earth)" }}>
    <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
      {author}
    </div>
    <p className="body" style={{ textWrap: "pretty" }}>{text}</p>
  </div>
);

// ── Conte-miroir ────────────────────────────────────────────
const seedContes = [
  {
    id: "ct-1",
    title: "la jeune fille qui lavait le linge des mortes",
    origin: "conte slave, recueilli par Alexandre Afanassiev",
    age: "≈ XIXe siècle",
    lines: 3,
    text: "Une jeune fille, orpheline, entre dans la maison d'une vieille qui lave le linge sans feu. La vieille lui dit : \"Ici on ne regarde pas. On lave ce qui doit être lavé.\" La jeune fille travaille un an. Au soir du dernier jour, la vieille lui donne une porte.",
    match: "grand-mère lavant · porte qu'on n'ouvre pas · ne me regarde pas",
    caveat: "Ce conte n'a pas été généré. Il vient d'une collection de contes populaires russes. Nous te l'offrons comme un écho possible — non comme une explication de ton rêve.",
    source: "Narodnye Russkie Skazki, 1855-1863",
  },
  {
    id: "ct-2",
    title: "le pont de paille",
    origin: "conte japonais, tradition orale",
    age: "anonyme, recueilli 1920",
    lines: 4,
    text: "Un homme rêve qu'un pont de paille lui permettra de traverser la rivière. Au matin, il va à la rivière. Il n'y a pas de pont. Il revient chaque matin pendant sept ans. Le huitième matin, la paille du champ d'à côté est coupée. Il construit le pont lui-même.",
    match: "pont inachevé · traversée · temps long",
    caveat: "Ce conte existe dans une tradition documentée. Nous ne l'avons pas écrit pour toi — il t'attendait.",
    source: "Collection Yanagita Kunio",
  },
];

const ConteMiroirScreen = ({ go }) => {
  const [selected, setSelected] = uSS(seedContes[0].id);
  const conte = seedContes.find(c => c.id === selected) || seedContes[0];

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("kairos")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          conte-miroir
        </div>
        <h1 className="h1-seuil mb-m">ton rêve est déjà passé par ces forêts</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 580 }}>
          Voici des contes qui portent des images proches de ton kairos. Ils ne l'expliquent pas — ils le tiennent, comme une famille de rêves.
        </p>

        <div className="card mb-l" style={{ padding: "var(--s-4)", background: "color-mix(in oklch, var(--obsidian) 30%, transparent)" }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
            principe
          </div>
          <p className="body" style={{ textWrap: "pretty" }}>
            Les contes-miroirs ne sont <span style={{ fontStyle: "italic", color: "var(--bone)" }}>jamais</span> générés par une intelligence artificielle. Ils sont puisés dans un corpus documenté de traditions orales, recueilli par des ethnologues et mythologues. Nous te les apparions — nous n'en fabriquons pas.
          </p>
        </div>

        <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
          {seedContes.map(c => (
            <button key={c.id}
              className={"chip " + (selected === c.id ? "active" : "")}
              onClick={() => setSelected(c.id)}>
              {c.title}
            </button>
          ))}
        </div>

        <div className="conte-card">
          <div className="row mb-m" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--s-3)" }}>
            <div className="conte-attribution">
              {conte.origin} · {conte.age}
            </div>
            <span className="conte-match">
              apparié sur : {conte.match}
            </span>
          </div>
          <h3 className="h3-lecture mb-m" style={{ fontFamily: "var(--serif)", fontSize: 23, fontStyle: "italic" }}>
            {conte.title}
          </h3>
          <p className="body mb-l" style={{ textWrap: "pretty", fontSize: 17, lineHeight: 1.65 }}>
            {conte.text}
          </p>
          <div className="divider" />
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            garde-fou
          </div>
          <p className="body op-70" style={{ textWrap: "pretty", fontStyle: "italic" }}>
            {conte.caveat}
          </p>
          <div className="meta mt-m op-70" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.05em" }}>
            source : {conte.source}
          </div>
        </div>

        <div className="row gap-s mt-l" style={{ flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={() => go("kairos")}>retourner au kairos</button>
          <button className="btn-text" onClick={() => go("conte-miroir")}>un autre conte ?</button>
        </div>
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

// ── Réentrée onirique (Active Dreaming / Moss / Lightning) ──
const ReentryScreen = ({ go }) => {
  const [phase, setPhase] = uSS("gate"); // gate | choice | lightning | moss | closing
  const [gateAnswers, setGateAnswers] = uSS({ safe: null, sober: null, anchored: null });
  const [choice, setChoice] = uSS(null);
  const entry = (window.seedEntries || [])[0];

  const allSafe = Object.values(gateAnswers).every(v => v === true);

  if (phase === "gate") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => go("kairos")} label="" />
        <div className="frame" style={{ maxWidth: 540 }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
            gate · avant toute réentrée
          </div>
          <h1 className="h1-seuil mb-l">trois questions, honnêtement</h1>
          <p className="body op-70 mb-l" style={{ textWrap: "pretty" }}>
            La réentrée onirique peut rouvrir ce que le rêve a déjà touché. Nous ne commençons que si le sol est là.
          </p>

          <div className="stack gap-l">
            <GateQuestion
              q="es-tu dans un lieu sûr, où personne ne te dérangera pendant 20 minutes ?"
              value={gateAnswers.safe}
              onChange={(v) => setGateAnswers(a => ({ ...a, safe: v }))}
            />
            <GateQuestion
              q="es-tu sobre — pas d'alcool, pas de substance en ce moment ?"
              value={gateAnswers.sober}
              onChange={(v) => setGateAnswers(a => ({ ...a, sober: v }))}
            />
            <GateQuestion
              q="as-tu quelqu'un à qui écrire ou appeler si ça remue fort ?"
              value={gateAnswers.anchored}
              onChange={(v) => setGateAnswers(a => ({ ...a, anchored: v }))}
            />
          </div>

          {Object.values(gateAnswers).includes(false) && (
            <div className="card mt-l" style={{ borderColor: "var(--ember-live)", background: "color-mix(in oklch, var(--ember-live) 5%, transparent)" }}>
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
                pas ce soir
              </div>
              <p className="body" style={{ textWrap: "pretty" }}>
                Ce n'est pas un échec. La réentrée demande un sol. Reviens quand il sera là. En attendant, tu peux déposer une note, demander à la narratrice, ou simplement refermer.
              </p>
              <div className="row gap-m mt-m">
                <button className="btn-ghost" onClick={() => go("capture")}>déposer plutôt</button>
                <button className="btn-text" onClick={() => go("home")}>refermer</button>
              </div>
            </div>
          )}

          {allSafe && (
            <div className="row mt-l" style={{ justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setPhase("choice")}>continuer</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "choice") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => setPhase("gate")} label="" />
        <div className="frame" style={{ maxWidth: 560 }}>
          <h1 className="h1-seuil mb-l">quel chemin ce soir ?</h1>
          <p className="body op-70 mb-l" style={{ textWrap: "pretty" }}>
            Deux pratiques, inspirées du travail de Robert Moss. Tu peux arrêter à tout moment, sans justification.
          </p>

          <div className="stack gap-m">
            <button onClick={() => { setChoice("lightning"); setPhase("lightning"); }}
              style={{
                textAlign: "left", padding: "var(--s-5)",
                border: "1px solid var(--ash-deep)",
                background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
              }}>
              <div className="h4-repere mb-s" style={{ color: "var(--bone)" }}>lightning dreamwork</div>
              <div className="body op-70" style={{ textWrap: "pretty" }}>
                Court. 8 minutes. Une question simple au rêve, suivie d'une écoute. Pour démêler une image qui te hante.
              </div>
            </button>

            <button onClick={() => { setChoice("moss"); setPhase("moss"); }}
              style={{
                textAlign: "left", padding: "var(--s-5)",
                border: "1px solid var(--ash-deep)",
                background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
              }}>
              <div className="h4-repere mb-s" style={{ color: "var(--bone)" }}>active dreaming — réentrée</div>
              <div className="body op-70" style={{ textWrap: "pretty" }}>
                20 minutes. Retourner dans le rêve à l'endroit précis, avec l'intention de rencontrer — pas d'interpréter.
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "lightning") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => setPhase("choice")} label="" />
        <div className="frame text-center" style={{ maxWidth: 540 }}>
          <div className="reentry-circle mb-xl">
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 20, color: "var(--bone)" }}>
              respire
            </div>
          </div>
          <h2 className="h2-section mb-l">une question unique</h2>
          <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty", maxWidth: 480, margin: "0 auto var(--s-5)" }}>
            "{entry?.text.split(".")[0]}."
          </p>
          <p className="body mb-xl" style={{ maxWidth: 480, margin: "0 auto", textWrap: "pretty" }}>
            Pose une seule question à ce rêve. Ne cherche pas la bonne formulation. Puis reste immobile pendant huit minutes. Ce qui vient, vient.
          </p>
          <div className="row gap-m" style={{ justifyContent: "center" }}>
            <button className="btn-ghost" onClick={() => setPhase("closing")}>c'est fait</button>
            <button className="btn-text" onClick={() => setPhase("choice")}>arrêter</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "moss") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => setPhase("choice")} label="" />
        <div className="frame" style={{ maxWidth: 560 }}>
          <div className="reentry-gate mb-l">
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              seuil
            </div>
            <p className="body" style={{ textWrap: "pretty" }}>
              Ferme les yeux. Reviens au moment exact du rêve — pas au début, au moment qui a appelé. Ce n'est pas une histoire. C'est un lieu.
            </p>
          </div>

          <div className="stack gap-m mb-l">
            <ReentryStep n="1" text="reviens à l'image. pas à l'intrigue. l'image." />
            <ReentryStep n="2" text="remarque ce qui t'avait échappé la première fois — une odeur, un angle, ce qui se passe derrière." />
            <ReentryStep n="3" text="parle à ce qui est là. pas pour obtenir. pour rencontrer." />
            <ReentryStep n="4" text="quand tu sens que c'est fini — c'est fini. note trois mots seulement." />
          </div>

          <div className="card mb-l" style={{ borderColor: "var(--ember-live)", background: "color-mix(in oklch, var(--ember-live) 5%, transparent)" }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
              si ça tangue
            </div>
            <p className="body" style={{ textWrap: "pretty" }}>
              Ouvre les yeux. Pose les pieds au sol. Bois. Écris à quelqu'un. Tu peux refermer et revenir une autre nuit. Ce rêve t'attendra.
            </p>
          </div>

          <div className="row gap-m" style={{ justifyContent: "center" }}>
            <button className="btn-ghost" onClick={() => setPhase("closing")}>je reviens</button>
            <button className="btn-text" onClick={() => setPhase("choice")}>arrêter</button>
          </div>
        </div>
      </div>
    );
  }

  // closing
  return (
    <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
      <window.TopNav showBack onBack={() => go("kairos")} label="" />
      <div className="frame text-center" style={{ maxWidth: 520, paddingTop: "var(--s-7)" }}>
        <div className="breath mb-xl" style={{ width: 80, height: 80 }} />
        <h2 className="h2-section mb-m">refermer doucement</h2>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty" }}>
          Ne cherche pas à comprendre tout de suite. Écris trois mots, ou rien.
        </p>
        <textarea className="field-textarea mb-l"
          placeholder="trois mots de ce qui est venu, ou laisse vide"
          style={{ minHeight: 80 }} />
        <div className="row gap-m" style={{ justifyContent: "center" }}>
          <button className="btn-ghost" onClick={() => go("kairos")}>déposer et sortir</button>
          <button className="btn-text" onClick={() => go("home")}>sortir sans déposer</button>
        </div>
      </div>
    </div>
  );
};

const GateQuestion = ({ q, value, onChange }) => (
  <div>
    <div className="body mb-s" style={{ textWrap: "pretty" }}>{q}</div>
    <div className="row gap-s">
      <button
        className={"chip " + (value === true ? "active" : "")}
        onClick={() => onChange(true)}>oui</button>
      <button
        className={"chip " + (value === false ? "active" : "")}
        onClick={() => onChange(false)}>non / pas sûr</button>
    </div>
  </div>
);

const ReentryStep = ({ n, text }) => (
  <div className="row gap-m" style={{ alignItems: "flex-start" }}>
    <div style={{
      flex: "0 0 28px",
      fontFamily: "var(--mono)", fontSize: 14, color: "var(--silk-gold)",
      textAlign: "center", borderRight: "1px solid var(--ash-deep)",
      padding: "2px 8px 2px 0",
    }}>
      {n}
    </div>
    <div className="body" style={{ textWrap: "pretty" }}>{text}</div>
  </div>
);

Object.assign(window, { OracleCorpsScreen, ConteMiroirScreen, ReentryScreen });
