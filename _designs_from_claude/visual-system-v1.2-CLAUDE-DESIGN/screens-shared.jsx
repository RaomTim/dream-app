/* global React */
// ──────────────────────────────────────────────────────────────
// Composants first-class partagés (V1.1 patches)
// AhaCapture · FeltShiftGate · ExitToHuman
// ──────────────────────────────────────────────────────────────

const { useState: uShS, useEffect: uShE } = React;

// ── AhaCapture ────────────────────────────────────────────────
// "Où est ton aha ?" — à la fin de chaque lecture IA.
// 4 voies : résonne fort / partiel / pas du tout / autre note libre.
// Léger, rituel, pas formulaire. Stocké en user_validations.
const AhaCapture = ({ context = "lecture", onClose, embedded = true }) => {
  const [chosen, setChosen] = uShS(null);
  const [note, setNote] = uShS("");
  const [sent, setSent] = uShS(false);

  if (sent) {
    return (
      <div style={{
        marginTop: "var(--s-5)", padding: "var(--s-4)",
        borderTop: "1px solid var(--ash-deep)",
        textAlign: "center",
      }}>
        <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
          ton aha est posé. il reste avec toi.
        </div>
      </div>
    );
  }

  const send = () => {
    try {
      const key = "dream:user_validations";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push({ context, chosen, note: note.trim() || null, at: Date.now() });
      localStorage.setItem(key, JSON.stringify(prev));
    } catch {}
    setSent(true);
    setTimeout(() => onClose?.(), 1200);
  };

  return (
    <div style={{
      marginTop: "var(--s-5)",
      paddingTop: "var(--s-4)",
      borderTop: "1px solid var(--ash-deep)",
    }}>
      <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)" }}>
        — où est ton aha ?
      </div>
      <div className="row gap-s mb-s" style={{ flexWrap: "wrap" }}>
        {[
          ["fort", "ça résonne fort"],
          ["partiel", "partiel"],
          ["non", "pas du tout"],
          ["note", "autre — note libre"],
        ].map(([k, l]) => (
          <button key={k}
            className={"chip " + (chosen === k ? "active" : "")}
            onClick={() => setChosen(k)}>
            {l}
          </button>
        ))}
      </div>
      {chosen === "note" && (
        <textarea className="field-textarea mt-s mb-s"
          placeholder="ce qui s'est posé, ou ce qui n'a pas regardé…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ minHeight: 70, fontSize: 15 }} />
      )}
      {chosen && (
        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn-text" onClick={send}>déposer</button>
        </div>
      )}
      <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12 }}>
        rien n'est évalué. ton aha est pour toi.
      </div>
    </div>
  );
};

// ── FeltShiftGate ─────────────────────────────────────────────
// Chips somatiques Gendlin avant validation d'une lecture profonde.
// Bloque progression si "rien ne bouge" sans confirmation.
const FeltShiftGate = ({ onPass, onPause, label = "ce que tu lis là, ça résonne dans ton corps ?" }) => {
  const [chosen, setChosen] = uShS(null);
  const [confirmed, setConfirmed] = uShS(false);

  const opts = [
    ["frisson", "oui, frisson"],
    ["relache", "tension qui se relâche"],
    ["rien", "rien ne bouge"],
    ["pas-maintenant", "pas maintenant"],
  ];

  return (
    <div className="card" style={{
      padding: "var(--s-4)",
      borderColor: "var(--clay-earth)",
      background: "color-mix(in oklch, var(--clay-earth) 4%, transparent)",
    }}>
      <div className="meta mb-s" style={{
        fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em",
        color: "var(--clay-earth)",
      }}>
        FELT-SHIFT · GENDLIN
      </div>
      <p className="body mb-m" style={{ textWrap: "pretty", fontFamily: "var(--serif)", fontSize: 16 }}>
        {label}
      </p>
      <div className="row gap-s mb-s" style={{ flexWrap: "wrap" }}>
        {opts.map(([k, l]) => (
          <button key={k}
            className={"chip " + (chosen === k ? "active" : "")}
            onClick={() => { setChosen(k); setConfirmed(false); }}>
            {l}
          </button>
        ))}
      </div>

      {(chosen === "frisson" || chosen === "relache") && (
        <div className="row mt-m" style={{ justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={() => onPass?.(chosen)}>continuer</button>
        </div>
      )}

      {chosen === "pas-maintenant" && (
        <div className="mt-m">
          <p className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty" }}>
            pas ce soir. la lecture t'attendra.
          </p>
          <button className="btn-text mt-s" onClick={() => onPause?.()}>refermer</button>
        </div>
      )}

      {chosen === "rien" && !confirmed && (
        <div className="mt-m">
          <p className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty", color: "var(--ash-light)" }}>
            si rien ne bouge, peut-être que cette lecture n'est pas pour toi — ou pas maintenant.
            tu peux quand même continuer, mais nous préférons te le redemander.
          </p>
          <div className="row gap-s mt-s">
            <button className="btn-text" onClick={() => onPause?.()}>plutôt refermer</button>
            <button className="btn-ghost" onClick={() => setConfirmed(true)} style={{ fontSize: 13 }}>
              continuer quand même
            </button>
          </div>
        </div>
      )}

      {chosen === "rien" && confirmed && (
        <div className="row mt-m" style={{ justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={() => onPass?.(chosen)}>continuer</button>
        </div>
      )}
    </div>
  );
};

// ── ExitToHuman ───────────────────────────────────────────────
// Footer discret omniprésent sur écrans sensibles.
// Ouvre marketplace praticiens INFUSE (V2 stub).
const ExitToHuman = () => {
  const [open, setOpen] = uShS(false);

  return (
    <>
      <div style={{
        marginTop: "var(--s-7)",
        paddingTop: "var(--s-4)",
        borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
        textAlign: "center",
      }}>
        <button
          onClick={() => setOpen(true)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--ash-light)",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 13,
            cursor: "pointer",
            opacity: 0.7,
            padding: 4,
            transition: "opacity var(--tempo-tisse), color var(--tempo-tisse)",
          }}
          onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--bone)"; }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = "var(--ash-light)"; }}>
          → parler à un humain
        </button>
      </div>

      {open && (
        <div className="modal-scrim" onClick={() => setOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="row mb-l" style={{ justifyContent: "space-between" }}>
              <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                accompagnement humain
              </div>
              <button className="btn-text" onClick={() => setOpen(false)}>×</button>
            </div>

            <h2 className="h2-section mb-m" style={{ fontSize: 22 }}>
              bientôt : la marketplace INFUSE
            </h2>

            <p className="body mb-m" style={{ textWrap: "pretty" }}>
              Une app n'est jamais l'endroit pour traverser seule. Nous tissons en ce moment un réseau de praticiennes et praticiens — analystes jungiens, somatic experiencing, IFS, accompagnantes en rêves — sélectionnées pour leur sobriété et leur éthique.
            </p>

            <div className="card mb-m" style={{ background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)", borderColor: "var(--silk-gold)" }}>
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
                disponible bientôt — V2
              </div>
              <p className="body" style={{ textWrap: "pretty", fontSize: 14 }}>
                Tu pourras chercher par approche, langue, fourchette de tarif (avec accès solidaire). Aucune commission ne dépendra du nombre de séances. Nous ne vendons pas ta présence.
              </p>
            </div>

            <div className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              en attendant — tout de suite
            </div>
            <div className="stack gap-s mb-m">
              <div className="body" style={{ fontSize: 14, textWrap: "pretty" }}>
                · <strong style={{ color: "var(--bone)" }}>SOS Amitié</strong> — 09 72 39 40 50, 24h/24
              </div>
              <div className="body" style={{ fontSize: 14, textWrap: "pretty" }}>
                · <strong style={{ color: "var(--bone)" }}>3114</strong> — prévention du suicide, 24h/24
              </div>
              <div className="body" style={{ fontSize: 14, textWrap: "pretty" }}>
                · une personne de chair, autour de toi, à qui écrire maintenant
              </div>
            </div>

            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn-text" onClick={() => setOpen(false)}>refermer</button>
            </div>

            <div className="meta op-70 mt-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty", fontSize: 12 }}>
              à 2 clics, jamais plus. cette porte reste toujours ouverte.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

Object.assign(window, { AhaCapture, FeltShiftGate, ExitToHuman });
