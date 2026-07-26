/* global React */
const { useState: uCS, useEffect: uCE, useMemo: uCM, useRef: uCR } = React;

// ── Sample Cercle data ──────────────────────────────────────
const seedCercles = [
  {
    id: "c-foret",
    name: "la forêt tenue",
    kind: "intentionnel",
    intention: "traverser nos transitions professionnelles ensemble, sans conseils",
    created: "il y a trois lunes",
    members: [
      { id: "m-self", name: "toi", self: true, active: true, holding: 2 },
      { id: "m-al",   name: "Aliénor", active: true, holding: 1 },
      { id: "m-yo",   name: "Yohan", active: true, holding: 0 },
      { id: "m-na",   name: "Nadège", active: true, holding: 1 },
      { id: "m-si",   name: "Simon", active: false, holding: 0 },
      { id: "m-cl",   name: "Claire", active: true, holding: 0 },
    ],
    sharedDreams: [
      {
        id: "sd-1",
        author: "Aliénor",
        when: "il y a deux jours",
        text: "Une marée basse immense. Je cherche quelque chose sous une pierre qu'une enfant plus jeune que moi garde en apnée.",
        tenir: { tendre: 2, connue: 1, reste: 1 },
      },
      {
        id: "sd-2",
        author: "Yohan",
        when: "il y a cinq jours",
        text: "Mon père me tend une lettre écrite dans une langue que je ne peux pas lire mais dont je connais chaque mot.",
        tenir: { tendre: 3, connue: 0, reste: 2 },
      },
    ],
  },
];

// ── Force-directed-ish placement (deterministic) ─────────────
const layoutCercle = (members, W = 380, H = 320) => {
  const cx = W / 2, cy = H / 2;
  const self = members.find(m => m.self);
  const others = members.filter(m => !m.self);
  const positions = {};
  if (self) positions[self.id] = { x: cx, y: cy };
  others.forEach((m, i) => {
    const angle = (i / others.length) * Math.PI * 2 + 0.3;
    const r = 110 + (m.active ? 0 : 18) + ((i * 13) % 22);
    positions[m.id] = {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    };
  });
  return positions;
};

// ── Cercle — main screen ────────────────────────────────────
const CercleScreen = ({ go }) => {
  const cercle = seedCercles[0];
  const [temporal, setTemporal] = uCS("ce-cycle"); // ce-cycle | dernier | saison
  const [reading, setReading] = uCS(false);
  const positions = uCM(() => layoutCercle(cercle.members), []);

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          cercle · {cercle.created}
        </div>
        <h1 className="h1-seuil mb-m">{cercle.name}</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 560 }}>
          {cercle.intention}
        </p>

        <div className="cercle-stage mb-l">
          <svg width="100%" height="100%" viewBox="0 0 380 320" preserveAspectRatio="xMidYMid meet">
            {cercle.members.filter(m => !m.self).map((m) => {
              const p = positions[m.id];
              const s = positions["m-self"];
              return (
                <line key={m.id}
                  x1={s.x} y1={s.y} x2={p.x} y2={p.y}
                  className={"cercle-edge " + (m.active && m.holding > 0 ? "alive" : "")}
                />
              );
            })}
          </svg>
          {cercle.members.map((m) => {
            const p = positions[m.id];
            const pct = (v, dim) => (v / dim) * 100;
            return (
              <div key={m.id}
                className={"cercle-node " + (m.self ? "self " : "") + (m.holding > 0 ? "holding" : "")}
                style={{ left: pct(p.x, 380) + "%", top: pct(p.y, 320) + "%" }}>
                <div className="disc" title={m.name}>
                  {m.self ? "·" : m.name[0]}
                </div>
                {!m.self && <div className="name">{m.name.toLowerCase()}</div>}
              </div>
            );
          })}
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

        <div className="divider-moon">rêves partagés récemment</div>

        <div className="stack gap-l">
          {cercle.sharedDreams.map(d => (
            <SharedDreamCard key={d.id} dream={d} go={go} />
          ))}
        </div>

        <button className="btn-text mt-xl" onClick={() => go("partager-reve")}
          style={{ display: "block", width: "100%", textAlign: "center", padding: "var(--s-4)" }}>
          déposer un rêve dans le cercle →
        </button>
      </div>

      {reading && (
        <ReadingRequestModal cercle={cercle} onClose={() => setReading(false)} />
      )}

      <window.FeedbackFloat />
    </div>
  );
};

// ── Shared dream card with tenir reactions ──────────────────
const SharedDreamCard = ({ dream, go }) => {
  const [tenir, setTenir] = uCS(dream.tenir);
  const [mine, setMine] = uCS({ tendre: false, connue: false, reste: false });
  const tap = (k) => {
    setMine(m => ({ ...m, [k]: !m[k] }));
    setTenir(t => ({ ...t, [k]: t[k] + (mine[k] ? -1 : 1) }));
  };
  return (
    <div className="card">
      <div className="row mb-s" style={{ justifyContent: "space-between" }}>
        <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {dream.author} · {dream.when}
        </div>
      </div>
      <p className="h3-lecture" style={{ fontSize: 20, textWrap: "pretty", marginBottom: "var(--s-4)" }}>
        {dream.text}
      </p>
      <div className="tenir-row">
        <button className={"tenir-chip " + (mine.tendre ? "active" : "")} onClick={() => tap("tendre")}>
          c'est tendre <span className="count">{tenir.tendre}</span>
        </button>
        <button className={"tenir-chip " + (mine.connue ? "active" : "")} onClick={() => tap("connue")}>
          je connais ça <span className="count">{tenir.connue}</span>
        </button>
        <button className={"tenir-chip " + (mine.reste ? "active" : "")} onClick={() => tap("reste")}>
          reste avec moi <span className="count">{tenir.reste}</span>
        </button>
      </div>
      <div className="meta op-70 mt-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5 }}>
        pas un vote — une façon de tenir
      </div>
    </div>
  );
};

// ── Reading request (ritual modal) ──────────────────────────
const ReadingRequestModal = ({ cercle, onClose }) => {
  const [step, setStep] = uCS(0);
  const [text, setText] = uCS("");
  const [who, setWho] = uCS([]);
  const toggle = (id) => setWho(w => w.includes(id) ? w.filter(x => x !== id) : [...w, id]);

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {step === 0 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              demander une lecture au cercle
            </div>
            <h2 className="h2-section mb-m" style={{ fontSize: 22 }}>
              quel rêve, quelle question ?
            </h2>
            <textarea className="field-textarea mb-m"
              placeholder="le rêve ou le moment que tu veux qu'on tienne avec toi…"
              value={text} onChange={(e) => setText(e.target.value)} />
            <div className="row gap-m" style={{ justifyContent: "flex-end" }}>
              <button className="btn-text" onClick={onClose}>annuler</button>
              <button className="btn-ghost" disabled={!text.trim()} onClick={() => setStep(1)}>
                continuer
              </button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              qui veux-tu inviter à tenir ceci ?
            </div>
            <div className="stack gap-s mb-m">
              {cercle.members.filter(m => !m.self).map(m => (
                <button key={m.id}
                  onClick={() => toggle(m.id)}
                  style={{
                    textAlign: "left", padding: "10px 14px",
                    border: "1px solid " + (who.includes(m.id) ? "var(--silk-gold)" : "var(--ash-deep)"),
                    color: who.includes(m.id) ? "var(--silk-gold)" : "var(--bone)",
                    background: who.includes(m.id) ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent",
                    fontFamily: "var(--serif)", fontSize: 15, fontStyle: "italic",
                  }}>
                  {m.name}
                </button>
              ))}
            </div>
            <div className="meta op-70 mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              ils reçoivent une invitation — jamais une obligation
            </div>
            <div className="row gap-m" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>← retour</button>
              <button className="btn-ghost" disabled={who.length === 0} onClick={() => setStep(2)}>
                déposer
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="text-center" style={{ padding: "var(--s-5) 0" }}>
            <div className="breath mb-l" style={{ width: 60, height: 60 }} />
            <p className="seuil-italic mb-s" style={{ maxWidth: 360, margin: "0 auto" }}>
              ta demande est déposée. le cercle tient.
            </p>
            <div className="meta op-70 mt-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              tu seras notifiée si quelqu'un répond — ou pas
            </div>
            <button className="btn-text mt-xl" onClick={onClose}>refermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Créer un cercle (flow) ──────────────────────────────────
const CreerCercleScreen = ({ go }) => {
  const [step, setStep] = uCS(0);
  const [name, setName] = uCS("");
  const [kind, setKind] = uCS(null);
  const [intention, setIntention] = uCS("");
  const [invite, setInvite] = uCS("");

  uCE(() => {
    if (step === 3 && !invite) {
      const slug = (name || "cercle").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "cercle";
      setInvite(`dream.app/c/${slug}-${Math.random().toString(36).slice(2, 8)}`);
    }
  }, [step]);

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("cercle")} label="" />
      <div className="frame" style={{ maxWidth: 560 }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          créer un cercle
        </div>

        {step === 0 && (
          <>
            <h1 className="h1-seuil mb-l">comment voudrais-tu l'appeler ?</h1>
            <p className="body op-70 mb-l">
              un nom qui décrit ce que ce cercle tient — pas qui il est.
            </p>
            <input className="field-input mb-l" placeholder="la forêt tenue, les veilleuses de mars…"
              value={name} onChange={(e) => setName(e.target.value)} />
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn-ghost" disabled={!name.trim()} onClick={() => setStep(1)}>continuer</button>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="h1-seuil mb-l">quelle sorte de cercle ?</h1>
            <div className="stack gap-m mb-l">
              {[
                ["spontane", "spontané", "on se retrouve quand la vie le permet. pas d'ordre du jour. pas de cadence."],
                ["intentionnel", "intentionnel", "on partage une intention commune pendant une saison."],
                ["facilite", "facilité", "une personne tient la respiration — lecture-miroir, silence partagé, Lightning Dreamwork."],
              ].map(([k, lbl, desc]) => (
                <button key={k}
                  onClick={() => setKind(k)}
                  style={{
                    textAlign: "left", padding: "var(--s-4)",
                    border: "1px solid " + (kind === k ? "var(--bone)" : "var(--ash-deep)"),
                    background: kind === k ? "color-mix(in oklch, var(--bone) 5%, transparent)" : "transparent",
                  }}>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 19, color: "var(--bone)", marginBottom: 4 }}>{lbl}</div>
                  <div className="meta" style={{ color: "var(--ash-light)" }}>{desc}</div>
                </button>
              ))}
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>← retour</button>
              <button className="btn-ghost" disabled={!kind} onClick={() => setStep(kind === "intentionnel" ? 2 : 3)}>
                continuer
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="h1-seuil mb-l">quelle intention tenez-vous ensemble ?</h1>
            <p className="body op-70 mb-l">
              une phrase. pas un objectif — une orientation.
            </p>
            <textarea className="field-textarea mb-l"
              placeholder="traverser nos transitions professionnelles, sans conseils. écouter nos peurs d'être mère. tenir un deuil."
              value={intention} onChange={(e) => setIntention(e.target.value)} />
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(1)}>← retour</button>
              <button className="btn-ghost" disabled={!intention.trim()} onClick={() => setStep(3)}>continuer</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="h1-seuil mb-l">le cercle est ouvert.</h1>
            <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)" }}>
              voici le lien d'invitation. il ne dure que 72 heures.
            </p>
            <div className="card mb-l" style={{ padding: "var(--s-4)" }}>
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>lien</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--bone)", wordBreak: "break-all" }}>
                {invite}
              </div>
            </div>
            <div className="row gap-m mb-xl">
              <button className="btn-ghost" onClick={() => {
                try { navigator.clipboard?.writeText(invite); } catch {}
              }}>copier le lien</button>
              <button className="btn-text">partager…</button>
            </div>
            <div className="meta op-70 mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              tu peux inviter à ton rythme. un cercle à une personne est un cercle.
            </div>
            <button className="btn-ghost" onClick={() => go("cercle")}>entrer dans le cercle</button>
          </>
        )}
      </div>
    </div>
  );
};

// ── Rejoindre cercle ────────────────────────────────────────
const RejoindreScreen = ({ go }) => {
  const [step, setStep] = uCS(0);
  const [name, setName] = uCS("");
  const sample = { host: "Aliénor", name: "la forêt tenue", kind: "intentionnel",
    intention: "traverser nos transitions professionnelles ensemble, sans conseils" };

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame" style={{ maxWidth: 520 }}>
        {step === 0 && (
          <>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              invitation · {sample.host}
            </div>
            <h1 className="h1-seuil mb-m">{sample.name}</h1>
            <div className="meta mb-l op-70" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em" }}>
              CERCLE · {sample.kind.toUpperCase()}
            </div>
            <div className="card mb-l">
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>intention</div>
              <p className="seuil-italic">{sample.intention}</p>
            </div>
            <p className="body op-70 mb-l" style={{ textWrap: "pretty" }}>
              un cercle n'est pas un groupe de discussion. on y dépose ce qu'on porte, et on tient ce que les autres déposent — sans conseils, sans interprétations.
            </p>
            <div className="row gap-m">
              <button className="btn-ghost" onClick={() => setStep(1)}>rejoindre</button>
              <button className="btn-text" onClick={() => go("home")}>pas cette fois</button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="h1-seuil mb-m">comment veux-tu être nommée ici ?</h1>
            <p className="body op-70 mb-l">
              ton prénom, un autre nom. tu peux le changer plus tard.
            </p>
            <input className="field-input mb-l" placeholder="nom"
              value={name} onChange={(e) => setName(e.target.value)} />
            <div className="meta op-70 mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              tu recevras les rêves partagés du cercle. tu choisiras quand partager les tiens.
            </div>
            <div className="row gap-m" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>← retour</button>
              <button className="btn-ghost" disabled={!name.trim()} onClick={() => setStep(2)}>entrer</button>
            </div>
          </>
        )}
        {step === 2 && (
          <div className="text-center" style={{ paddingTop: "var(--s-7)" }}>
            <div className="breath mb-xl" />
            <p className="seuil-italic mb-l" style={{ maxWidth: 380, margin: "0 auto" }}>
              bienvenue, {name}. le cercle tient avec toi maintenant.
            </p>
            <button className="btn-ghost mt-l" onClick={() => go("cercle")}>découvrir le cercle</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Partager un rêve au cercle ──────────────────────────────
const PartagerReveScreen = ({ go }) => {
  const [step, setStep] = uCS(0);
  const [selectedId, setSelectedId] = uCS(null);
  const [framing, setFraming] = uCS("");
  const [anon, setAnon] = uCS(false);
  const entries = window.seedEntries || [];
  const selected = entries.find(e => e.id === selectedId);

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("cercle")} label="" />
      <div className="frame" style={{ maxWidth: 620 }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          partager un rêve · la forêt tenue
        </div>

        {step === 0 && (
          <>
            <h1 className="h1-seuil mb-l">quel kairos veux-tu déposer ?</h1>
            <p className="body op-70 mb-l">
              partager au cercle est toujours un geste explicite, jamais par défaut.
            </p>
            <div className="stack gap-m mb-l">
              {entries.slice(0, 5).map(e => (
                <button key={e.id}
                  onClick={() => setSelectedId(e.id)}
                  style={{
                    textAlign: "left", padding: "var(--s-4)",
                    border: "1px solid " + (selectedId === e.id ? "var(--bone)" : "var(--ash-deep)"),
                    background: selectedId === e.id ? "color-mix(in oklch, var(--bone) 4%, transparent)" : "transparent",
                  }}>
                  <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                    {window.typeLabel(e.type)} · {e.when}
                  </div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 16, color: "var(--bone)", textWrap: "pretty" }}>
                    {e.text.length > 180 ? e.text.slice(0, 180) + "…" : e.text}
                  </div>
                </button>
              ))}
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => go("cercle")}>annuler</button>
              <button className="btn-ghost" disabled={!selectedId} onClick={() => setStep(1)}>continuer</button>
            </div>
          </>
        )}

        {step === 1 && selected && (
          <>
            <h1 className="h1-seuil mb-l">un cadre pour que le cercle reçoive ?</h1>
            <p className="body op-70 mb-l">
              optionnel. une phrase pour situer — pas pour expliquer.
            </p>
            <div className="card mb-l">
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                {window.typeLabel(selected.type)} · {selected.when}
              </div>
              <p className="body" style={{ textWrap: "pretty" }}>{selected.text}</p>
            </div>
            <textarea className="field-textarea mb-l"
              placeholder="ce rêve est venu après une journée où… / je n'ai pas compris mais quelque chose a bougé…"
              value={framing} onChange={(e) => setFraming(e.target.value)} />
            <label className="row gap-s mb-l" style={{ cursor: "pointer" }}>
              <span className={"toggle " + (anon ? "on" : "")} onClick={() => setAnon(!anon)} />
              <span style={{ fontSize: 14 }}>partager sans mon nom</span>
            </label>
            <div className="meta op-70 mb-l" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              partager au cercle n'envoie rien à Anima Mundi. ce sont deux gestes séparés.
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>← retour</button>
              <button className="btn-ghost" onClick={() => setStep(2)}>déposer au cercle</button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center" style={{ paddingTop: "var(--s-6)" }}>
            <div className="breath mb-xl" />
            <p className="seuil-italic mb-s" style={{ maxWidth: 420, margin: "0 auto" }}>
              le rêve est déposé dans le cercle.
            </p>
            <div className="meta op-70 mt-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              tu seras notifiée quand quelqu'un le tient. ou jamais.
            </div>
            <button className="btn-ghost mt-xl" onClick={() => go("cercle")}>retourner au cercle</button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, {
  CercleScreen, CreerCercleScreen, RejoindreScreen, PartagerReveScreen,
});
