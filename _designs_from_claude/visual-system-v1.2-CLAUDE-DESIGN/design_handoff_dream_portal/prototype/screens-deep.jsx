/* global React */
const { useState: useS2, useEffect: useE2, useRef: useR2, useMemo: useM2 } = React;

// ── Détail Kairos ───────────────────────────────────────────
const KairosDetail = ({ go, entry, allEntries }) => {
  const [modal, setModal] = useS2(null); // null | 'reading' | 'burn' | 'aha'
  const [userReading, setUserReading] = useS2("");
  const [readingSubmitted, setReadingSubmitted] = useS2(false);
  const echoes = allEntries.filter(e => e.id !== entry.id).slice(0, 3);

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <TopNav showBack onBack={() => go("journal")} label="" />
      <div className="frame" style={{ position: "relative" }}>
        {entry.bigDream && <div className="halo-big" />}

        <div className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {typeLabel(entry.type)}, déposé {entry.when}
        </div>

        <p className="h3-lecture" style={{
          fontSize: 25, lineHeight: 1.55, maxWidth: 580, textWrap: "pretty",
          marginBottom: "var(--s-6)"
        }}>
          {entry.text}
        </p>

        <div className="divider" />

        <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
          <button className="chip" onClick={() => setModal("reading")}>
            <TypeGlyph type="note_vie" size={10} /> que vois-tu ?
          </button>
          <button className="chip" style={{ opacity: readingSubmitted ? 1 : 0.5, pointerEvents: readingSubmitted ? "auto" : "none" }}
            onClick={() => go("chat", entry.id)}>
            demander à la forêt
          </button>
          <button className="chip">
            échos depuis le passé
          </button>
          <button className="chip" onClick={() => setModal("burn")}>
            brûler
          </button>
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
                {e.when} — {typeLabel(e.type)}
              </div>
              <p style={{ fontFamily: "var(--serif)", fontSize: 16, opacity: 0.85,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                margin: 0 }}>
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
      </div>

      {modal === "reading" && (
        <Modal onClose={() => setModal(null)}>
          <h3 className="h3-lecture mb-s">Ta lecture, en premier.</h3>
          <p className="ash-italic mb-m" style={{ fontSize: 14 }}>
            L'IA arrivera après.
          </p>
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
        </Modal>
      )}

      {modal === "burn" && (
        <Modal onClose={() => setModal(null)}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at center, color-mix(in oklch, var(--ember-live) 12%, transparent), transparent 65%)", pointerEvents: "none" }} />
          <h3 className="h3-lecture text-center mb-s" style={{ fontStyle: "italic" }}>
            Veux-tu vraiment brûler ce kairos ?
          </h3>
          <p className="ash-italic text-center mb-l" style={{ fontSize: 14 }}>
            Suppression cryptographique. Pas de retour.
          </p>
          <div className="row gap-s" style={{ justifyContent: "center" }}>
            <button className="btn-text" onClick={() => setModal(null)}>garder</button>
            <button className="btn-ghost"
              style={{ borderColor: "color-mix(in oklch, var(--ember-live) 60%, var(--ash-mid))",
                       color: "var(--ember-live)" }}>
              appuyer 2 s pour brûler
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div style={{
    position: "fixed", inset: 0, zIndex: 100,
    background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
    backdropFilter: "blur(8px)",
    display: "grid", placeItems: "center", padding: "var(--s-4)",
    animation: "screen-in var(--tempo-tisse) var(--ease-respire) both"
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()}
      style={{
        background: "var(--night-warm)",
        border: "1px solid var(--ash-mid)",
        padding: "var(--s-5)",
        maxWidth: 540, width: "100%",
        position: "relative", overflow: "hidden"
      }}>
      {children}
    </div>
  </div>
);

// ── Portrait (constellation) ────────────────────────────────
const Constellation = ({ nodes, selected, onSelect, height = 340 }) => {
  const w = 640;
  const h = height;

  // positions lightly perturbed + slow drift
  const [tick, setTick] = useS2(0);
  useE2(() => {
    let raf;
    const loop = () => {
      setTick(t => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const placed = useM2(() => nodes.map((n, i) => {
    // deterministic base position
    const angle = (i / nodes.length) * Math.PI * 2 + (n.seed || 0);
    const radius = 40 + (n.weight || 1) * 22 + ((i * 17) % 60);
    return {
      ...n,
      bx: w / 2 + Math.cos(angle) * radius,
      by: h / 2 + Math.sin(angle) * radius * 0.75,
    };
  }), [nodes, w, h]);

  return (
    <div className="constellation" style={{ height }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%" style={{ display: "block" }}>
        {/* edges */}
        {placed.map((a, i) =>
          placed.slice(i+1).map((b, j) => {
            if (!a.edges?.includes(b.id)) return null;
            const dx = (Math.sin(tick / 60 + i) * 3);
            const dy = (Math.cos(tick / 60 + j) * 3);
            return (
              <line key={`${a.id}-${b.id}`}
                x1={a.bx + dx} y1={a.by + dy}
                x2={b.bx - dx} y2={b.by - dy}
                stroke="var(--ash-mid)" strokeWidth="0.5" opacity="0.45" />
            );
          })
        )}
        {/* nodes */}
        {placed.map((n, i) => {
          const breath = 1 + Math.sin(tick / 50 + i) * 0.04;
          const dx = Math.sin(tick / 80 + i * 0.7) * 2;
          const dy = Math.cos(tick / 90 + i * 1.1) * 2;
          const r = (4 + (n.weight || 1) * 3) * breath;
          const isSel = selected === n.id;
          const fill = n.color || "var(--bone)";
          return (
            <g key={n.id}
              transform={`translate(${n.bx + dx} ${n.by + dy})`}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect?.(n.id)}>
              {isSel && <circle r={r + 10} fill="none" stroke="var(--bone)" strokeWidth="0.5" opacity="0.4" />}
              {n.shape === "star" ? (
                <polygon points="0,-6 1.5,-1.5 6,-1.5 2.5,1.5 4,6 0,3 -4,6 -2.5,1.5 -6,-1.5 -1.5,-1.5"
                  fill={fill} opacity={0.85} transform={`scale(${r/6})`} />
              ) : (
                <circle r={r} fill={fill} opacity={0.9} />
              )}
              {isSel && (
                <text y={r + 16} fontSize="11" fill="var(--bone)" textAnchor="middle"
                  fontFamily="var(--serif)" fontStyle="italic">
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const portraitNodes = [
  { id: "grand-mere", label: "la grand-mère", weight: 3, color: "var(--stone-cool)", edges: ["maison", "porte"], seed: 0.3, shape: "circle" },
  { id: "maison",     label: "la maison aux pièces inconnues", weight: 2.5, color: "var(--paper-warm)", edges: ["porte"], seed: 0.8 },
  { id: "porte",      label: "la porte qui ne s'ouvre pas", weight: 2.2, color: "var(--paper-warm)", edges: ["cuisine"], seed: 1.5 },
  { id: "cuisine",    label: "cuisine sans feu", weight: 1.8, color: "var(--clay-earth)", edges: [], seed: 2.1 },
  { id: "eau",        label: "eau qui cherche son lit", weight: 2.8, color: "var(--stone-cool)", edges: ["estuaire", "pont"], seed: 2.8, shape: "star" },
  { id: "estuaire",   label: "estuaire", weight: 1.5, color: "var(--stone-cool)", edges: [], seed: 3.3 },
  { id: "pont",       label: "pont inachevé", weight: 2.0, color: "var(--silk-gold)", edges: ["seuil"], seed: 3.9, shape: "star" },
  { id: "seuil",      label: "seuil à traverser", weight: 2.4, color: "var(--silk-gold)", edges: ["travail"], seed: 4.5 },
  { id: "travail",    label: "question du travail", weight: 2.6, color: "var(--paper-warm)", edges: [], seed: 5.1 },
  { id: "corbeau",    label: "corbeau / feuille morte", weight: 1.2, color: "var(--obsidian)", edges: [], seed: 5.7 },
  { id: "enfant",     label: "enfant qui pleure", weight: 1.6, color: "var(--ember-live)", edges: ["maison"], seed: 0.1, shape: "star" },
];

const Portrait = ({ go }) => {
  const [toggle, setToggle] = useS2("croise");
  const [period, setPeriod] = useS2("lune");
  const [selected, setSelected] = useS2(null);

  return (
    <div className="stage screen-enter">
      <TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="row mb-l" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <h1 className="h1-seuil">Portrait</h1>
          <div className="row gap-m">
            <button className="btn-text" aria-label="légende">?</button>
            <button className="btn-text" aria-label="paramètres">⚙</button>
          </div>
        </div>

        <Constellation nodes={portraitNodes} selected={selected} onSelect={setSelected} height={380} />

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
      </div>
    </div>
  );
};

// ── Anima Mundi — Voûte ─────────────────────────────────────
const AnimaVoute = ({ go }) => {
  const [tick, setTick] = useS2(0);
  useE2(() => {
    const t = setInterval(() => setTick(v => v + 1), 50);
    return () => clearInterval(t);
  }, []);

  const points = useM2(() => {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        x: (i * 37) % 100,
        y: (i * 53) % 100,
        phase: i * 0.27,
        size: 0.6 + ((i * 13) % 7) / 10,
      });
    }
    return arr;
  }, []);

  return (
    <div className="stage screen-enter">
      <TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <h1 className="h1-seuil text-center mb-xl" style={{ fontSize: 44 }}>Anima Mundi</h1>

        <div className="anima-constellation mb-l">
          <svg viewBox="0 0 100 60" width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
            {points.map((p, i) => {
              const breathe = (Math.sin(tick / 40 + p.phase) + 1) / 2;
              const opacity = 0.15 + breathe * 0.5;
              return (
                <circle key={i}
                  cx={p.x} cy={p.y * 0.6}
                  r={p.size * (0.4 + breathe * 0.6)}
                  fill={i % 23 === 0 ? "var(--silk-gold)" : i % 11 === 0 ? "var(--stone-cool)" : "var(--bone)"}
                  opacity={opacity} />
              );
            })}
          </svg>
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
  );
};

// ── Météo de l'inconscient ──────────────────────────────────
const Meteo = ({ go }) => (
  <div className="stage screen-enter">
    <TopNav showBack onBack={() => go("anima")} label="anima mundi" />
    <div className="frame">
      <h2 className="h2-section mb-s">Le temps qu'il fait dans la nuit</h2>
      <div className="divider" />
      <p className="seuil-italic mb-xl" style={{ maxWidth: 560, textWrap: "pretty" }}>
        Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes —
        d'eau qui se cherche un lit, d'estuaires qui se forment.
      </p>
      <div className="text-center mb-xl">
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ opacity: 0.7 }}>
          <path d="M40 15 Q28 30 28 45 Q28 60 40 68 Q52 60 52 45 Q52 30 40 15 Z"
            fill="none" stroke="var(--stone-cool)" strokeWidth="0.75" />
          <path d="M40 25 Q33 35 33 48 Q33 58 40 62"
            fill="none" stroke="var(--stone-cool)" strokeWidth="0.5" opacity="0.6" />
        </svg>
        <div className="meta mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>eau</div>
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
);

// ── Polyphonie lunaire ──────────────────────────────────────
const Polyphonie = ({ go }) => (
  <div className="stage screen-enter">
    <TopNav showBack onBack={() => go("anima")} label="anima mundi" />
    <div className="frame" style={{ maxWidth: 640 }}>
      <h2 className="h2-section mb-l">Polyphonie de la lune de mars</h2>
      <div className="divider" />

      <div style={{ fontFamily: "var(--serif)", fontSize: 19, lineHeight: 1.7, color: "var(--bone)" }}>
        <p style={{ textWrap: "pretty" }}>
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
        <p style={{ textWrap: "pretty", fontStyle: "italic", marginTop: "var(--s-5)" }}>
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
);

// ── Chat IA narratrice ──────────────────────────────────────
const Chat = ({ go, contextId }) => {
  const [messages, setMessages] = useS2([
    { from: "ai", text: "Avant que je te propose quoi que ce soit, dis-moi : qu'est-ce que tu vois là, en regardant ce kairos ?" },
  ]);
  const [input, setInput] = useS2("");
  const [thinking, setThinking] = useS2(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setInput("");
    setThinking(true);
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
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <TopNav showBack onBack={() => go("kairos", contextId || "k-08")} label="" />
      <div className="frame" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 60px)" }}>
        <div className="meta mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          mode · exploration de kairos
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
          {messages.map((m, i) => (
            <div key={i} className={"bubble " + m.from} style={{ textWrap: "pretty" }}>
              {m.text}
            </div>
          ))}
          {thinking && (
            <div className="bubble ai" style={{ opacity: 0.7, fontStyle: "italic" }}>
              <span style={{ display: "inline-block", animation: "halo-slow 2s ease-in-out infinite" }}>les liens se tissent…</span>
            </div>
          )}
        </div>

        <div className="mt-l">
          <div className="row gap-s" style={{ alignItems: "flex-end" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="ce qui vient…"
              style={{
                flex: 1,
                background: "transparent",
                border: "1px solid var(--ash-deep)",
                padding: "12px 16px",
                color: "var(--bone)",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
                resize: "none", outline: "none",
                minHeight: 44,
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
      </div>
    </div>
  );
};

Object.assign(window, { KairosDetail, Portrait, AnimaVoute, Meteo, Polyphonie, Chat, Modal, Constellation });
