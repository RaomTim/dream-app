/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Écrans CERCLE (refonte 2026-04-25 — Yeshua)
//
// Vision Bible §3.4.1 + Design §7.7 :
//   3 types de cercles V1 :
//     - SPONTANÉ      : intimité, zéro protocole, lien partageable instantané.
//     - INTENTIONNEL  : intention partagée + jusqu'à 3 sous-intentions.
//     - FACILITÉ      : V2 (marketplace praticiens) — désactivé V1.
//
//   L'IA = témoin discret + synthétiseur polyphonique.
//   Anonymat strict dans la restitution (no real names exposed).
//
// Vocabulaire désensorcelé :
//   "tenir ensemble" / "le cercle" / "déposer dans le cercle"
//   PAS : "groupe" / "team" / "share" / "post"
//
// Écrans :
//   <CercleScreen>     — page principale (liste OU empty state)
//   <CercleDetail>     — détail d'un cercle (restitution + réactions + opt-in)
//   <CreerCercleScreen> — wizard 3 steps
//   <RejoindreScreen>  — code via URL ou saisie
//   <PartagerReveScreen> — conservé V1 (legacy, peu utilisé désormais)
// ──────────────────────────────────────────────────────────────

const { useState: uCS, useEffect: uCE, useMemo: uCM, useRef: uCR } = React;

// ── Helpers visuels partagés ──────────────────────────────────
const KIND_LABEL = {
  spontane: "spontané",
  intentionnel: "intentionnel",
  facilite: "facilité",
};

function relativeWhen(iso) {
  if (!iso) return "récemment";
  try {
    return window.DreamAPI?._relativeWhen?.(iso) || "récemment";
  } catch {
    return "récemment";
  }
}

// Pseudo générique pour anonymat (Bible : pas de vrais noms exposés)
function genericPseudo(idx) {
  // Lettres grecques sobres + glyphe → identité visuelle non-nominative
  const glyphs = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ"];
  return glyphs[idx % glyphs.length];
}

// ── CercleScreen ── liste OU empty state ──────────────────────
const CercleScreen = ({ go }) => {
  const [circles, setCircles] = uCS([]);
  const [loading, setLoading] = uCS(true);

  uCE(() => {
    let cancelled = false;
    setLoading(true);
    window.DreamAPI.listCircles()
      .then((d) => {
        if (cancelled) return;
        setCircles(d?.circles || []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Empty state poétique
  if (!loading && circles.length === 0) {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div
          className="frame center"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          <div
            className="stack text-center gap-m"
            style={{ alignItems: "center", maxWidth: 480 }}
          >
            <h1 className="h1-seuil mb-m">aucun cercle ne te tient encore</h1>
            <p
              className="seuil-italic mb-l"
              style={{ color: "var(--ash-light)" }}
            >
              un cercle se tient à plusieurs. ouvre-en un, ou rejoins celui qu'un·e autre porte déjà.
            </p>
            <div className="row gap-m" style={{ flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              {/* CTA principal silk-gold tinted pour visibilité (sans crier) */}
              <button
                onClick={() => go("creer-cercle")}
                style={{
                  background: "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))",
                  color: "var(--bone)",
                  border: "1px solid color-mix(in oklch, var(--silk-gold) 45%, var(--ash-deep))",
                  padding: "14px 28px",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 16,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  borderRadius: 0,
                  transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
                  boxShadow: "0 0 24px color-mix(in oklch, var(--silk-gold) 12%, transparent)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, var(--night-warm))";
                  e.currentTarget.style.boxShadow = "0 0 32px color-mix(in oklch, var(--silk-gold) 18%, transparent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))";
                  e.currentTarget.style.boxShadow = "0 0 24px color-mix(in oklch, var(--silk-gold) 12%, transparent)";
                }}>
                + créer un cercle
              </button>
              <button
                onClick={() => go("rejoindre")}
                style={{
                  background: "transparent",
                  color: "var(--ash-light)",
                  border: "none",
                  padding: "14px 16px",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 14,
                  letterSpacing: "0.02em",
                  cursor: "pointer",
                  borderBottom: "1px dashed color-mix(in oklch, var(--ash-light) 50%, transparent)",
                  transition: "color 280ms ease",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "var(--bone)"}
                onMouseLeave={e => e.currentTarget.style.color = "var(--ash-light)"}>
                rejoindre via un code
              </button>
            </div>
            <p className="meta op-50 mt-xl" style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--ash-light)", maxWidth: 360,
            }}>
              un cercle s'ouvre en moins d'une minute · code partageable instantané
            </p>
          </div>
        </div>
        {window.FeedbackFloat && <window.FeedbackFloat />}
      </div>
    );
  }

  // Loading state sobre
  if (loading) {
    return (
      <div className="stage" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="breath" />
        </div>
      </div>
    );
  }

  // Liste de cercles
  return (
    <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div
          className="meta mb-s"
          style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
        >
          tes cercles
        </div>
        <h1 className="h1-seuil mb-l">ce que tu tiens ensemble</h1>

        <div className="stack gap-m mb-xl">
          {circles.map((c) => (
            <CercleCard key={c.id} circle={c} go={go} />
          ))}
        </div>

        <div className="row gap-m" style={{ flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={() => go("creer-cercle")}>
            + créer un cercle
          </button>
          <button className="btn-text" onClick={() => go("rejoindre")}>
            rejoindre via un code
          </button>
        </div>

        <p
          className="meta op-70 mt-xl"
          style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 480 }}
        >
          un cercle n'est pas un groupe de discussion. on y dépose ce qu'on porte, on tient ce que d'autres déposent.
        </p>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── CercleCard ── carte cliquable ─────────────────────────────
const CercleCard = ({ circle, go }) => {
  const kind = circle.type || (circle.frequency === "open" ? "spontane" : "intentionnel");
  const kindLabel = KIND_LABEL[kind] || kind;
  const memberCount = circle.member_count || 1;
  const lastRestit = circle.last_restitution;
  const isActive = circle.my_role === "guardian";

  return (
    <button
      onClick={() => go("cercle-detail", circle.id)}
      className="card"
      style={{
        textAlign: "left",
        padding: "var(--s-4)",
        background:
          "color-mix(in oklch, var(--stone-cool) 6%, var(--night-floor))",
        border: isActive
          ? "1px solid color-mix(in oklch, var(--silk-gold) 20%, var(--ash-deep))"
          : "1px solid var(--ash-deep)",
        borderRadius: 0,
        cursor: "pointer",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        className="row mb-s"
        style={{ justifyContent: "space-between", alignItems: "baseline" }}
      >
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: 20,
            color: "var(--bone)",
          }}
        >
          {circle.name}
        </div>
        <div
          className="meta-mono"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.12em",
            color: "var(--ash-light)",
            textTransform: "uppercase",
          }}
        >
          {kindLabel}
        </div>
      </div>

      {kind === "intentionnel" && circle.intention_text && (
        <div
          className="seuil-italic mb-s"
          style={{
            color: "var(--ash-light)",
            fontSize: 14,
            lineHeight: 1.5,
            textWrap: "pretty",
          }}
        >
          « {circle.intention_text} »
        </div>
      )}

      <div
        className="meta mb-s"
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 12.5,
          color: "var(--ash-light)",
        }}
      >
        {memberCount} {memberCount > 1 ? "personnes" : "personne"} qui {memberCount > 1 ? "tiennent" : "tient"} ce cercle
      </div>

      {lastRestit ? (
        <div
          className="mt-s"
          style={{
            paddingTop: "var(--s-3)",
            borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
          }}
        >
          <div
            className="meta op-70 mb-s"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              color: "var(--silk-gold)",
              textTransform: "uppercase",
            }}
          >
            dernière lecture · {relativeWhen(lastRestit.requested_at)}
          </div>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 14,
              color: "var(--bone)",
              opacity: 0.85,
              lineHeight: 1.55,
              textWrap: "pretty",
            }}
          >
            {(lastRestit.preview || "").slice(0, 180)}
            {(lastRestit.preview || "").length > 180 ? "…" : ""}
          </div>
        </div>
      ) : (
        <div
          className="meta op-70 mt-s"
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 12.5,
          }}
        >
          ce cercle n'a pas encore reçu de lecture
        </div>
      )}
    </button>
  );
};

// ── CercleDetail ── écran détail d'un cercle ─────────────────
const CercleDetail = ({ go, circleId }) => {
  const [circle, setCircle] = uCS(null);
  const [restitutions, setRestitutions] = uCS([]);
  const [loading, setLoading] = uCS(true);
  const [requesting, setRequesting] = uCS(false);
  const [confirmLeave, setConfirmLeave] = uCS(false);
  const [kairos, setKairos] = uCS([]);
  const [kairosLoading, setKairosLoading] = uCS(true);

  // Charger le cercle (depuis listCircles) + ses restitutions + les kairos du user
  uCE(() => {
    let cancelled = false;
    if (!circleId) {
      setLoading(false);
      return;
    }

    Promise.all([
      window.DreamAPI.listCircles(),
      window.DreamAPI.listRestitutions(circleId),
      window.DreamAPI.listKairos({ limit: 30 }),
    ])
      .then(([circlesData, restitData, kairosData]) => {
        if (cancelled) return;
        const found = (circlesData?.circles || []).find((c) => c.id === circleId);
        setCircle(found || null);
        setRestitutions(restitData?.restitutions || []);
        setKairos((kairosData?.kairos || []).slice(0, 12));
        setLoading(false);
        setKairosLoading(false);
        // Wow trigger : première restitution reçue
        if ((restitData?.restitutions || []).length > 0) {
          try {
            window.wowRegistry?.fire?.("premiere-restitution-cercle");
          } catch {}
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
          setKairosLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [circleId]);

  const requestReading = async () => {
    if (!circleId || requesting) return;
    setRequesting(true);
    try {
      await window.DreamAPI.requestRestitution(circleId, 28);
      // refresh restitutions
      const r = await window.DreamAPI.listRestitutions(circleId);
      setRestitutions(r?.restitutions || []);
    } catch (e) {
      console.warn("[CercleDetail] requestReading failed:", e.message);
    } finally {
      setRequesting(false);
    }
  };

  const doLeave = async () => {
    if (!circleId) return;
    try {
      await window.DreamAPI.leaveCircle(circleId);
    } catch (e) {
      console.warn("[CercleDetail] leave failed:", e.message);
    }
    go("cercle");
  };

  if (loading) {
    return (
      <div className="stage" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("cercle")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="breath" />
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("cercle")} label="" />
        <div className="frame center" style={{ paddingTop: "var(--s-6)" }}>
          <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
            ce cercle ne te tient plus, ou n'existe pas.
          </p>
          <button className="btn-text mt-l" onClick={() => go("cercle")}>
            ← retour à tes cercles
          </button>
        </div>
      </div>
    );
  }

  const kind = circle.type || (circle.frequency === "open" ? "spontane" : "intentionnel");
  const kindLabel = KIND_LABEL[kind] || kind;
  const memberCount = circle.member_count || 1;
  const latest = restitutions[0] || null;

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
      <window.TopNav showBack onBack={() => go("cercle")} label="" />
      <div className="frame">
        {/* Header */}
        <div
          className="meta-mono mb-s"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--silk-gold)",
            textTransform: "uppercase",
          }}
        >
          cercle · {kindLabel}
        </div>
        <h1 className="h1-seuil mb-m">{circle.name}</h1>

        {kind === "intentionnel" && circle.intention_text && (
          <div
            className="card mb-l"
            style={{
              padding: "var(--s-4)",
              background:
                "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
            }}
          >
            <div
              className="meta op-70 mb-s"
              style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
            >
              intention tenue ensemble
            </div>
            <p
              className="seuil-italic"
              style={{ color: "var(--bone)", fontSize: 16, lineHeight: 1.55 }}
            >
              « {circle.intention_text} »
            </p>
            {Array.isArray(circle.intention_history) &&
              circle.intention_history[0]?.sub_intentions?.length > 0 && (
                <ul
                  className="mt-m"
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    fontFamily: "var(--serif)",
                    fontStyle: "italic",
                    color: "var(--ash-light)",
                    fontSize: 13.5,
                  }}
                >
                  {circle.intention_history[0].sub_intentions.map((s, i) => (
                    <li key={i} style={{ paddingLeft: 14, position: "relative", marginBottom: 4 }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--silk-gold)" }}>·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
          </div>
        )}

        <div
          className="meta mb-l"
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            color: "var(--ash-light)",
          }}
        >
          {memberCount} {memberCount > 1 ? "personnes tiennent" : "personne tient"} ce cercle
        </div>

        {/* Pseudos anonymes (avatars génériques sobres) */}
        <div className="row mb-xl" style={{ gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: Math.min(memberCount, 9) }, (_, i) => (
            <div
              key={i}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "1px solid var(--ash-deep)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 13,
                color: "var(--ash-light)",
                background: "color-mix(in oklch, var(--stone-cool) 4%, transparent)",
              }}
            >
              {genericPseudo(i)}
            </div>
          ))}
          {memberCount > 9 && (
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                color: "var(--ash-light)",
                fontSize: 13,
                alignSelf: "center",
              }}
            >
              +{memberCount - 9}
            </div>
          )}
        </div>

        {/* Restitution polyphonique */}
        <div className="divider-moon">restitution polyphonique</div>

        {latest ? (
          <RestitutionBlock
            circleId={circleId}
            restitution={latest}
          />
        ) : (
          <div
            className="card text-center"
            style={{
              padding: "var(--s-5) var(--s-4)",
              background:
                "color-mix(in oklch, var(--night-warm) 60%, var(--night-floor))",
              border: "1px solid var(--ash-deep)",
              borderRadius: 0,
            }}
          >
            <p
              className="seuil-italic mb-l"
              style={{ color: "var(--ash-light)", maxWidth: 420, margin: "0 auto" }}
            >
              ce cercle n'a pas encore reçu de lecture.
            </p>
            <button
              className="btn-ghost"
              disabled={requesting}
              onClick={requestReading}
            >
              {requesting ? "lecture en chemin…" : "demander une lecture"}
            </button>
          </div>
        )}

        {latest && (
          <div className="row mt-l mb-xl" style={{ justifyContent: "center" }}>
            <button
              className="btn-text"
              disabled={requesting}
              onClick={requestReading}
              style={{ fontSize: 13 }}
            >
              {requesting ? "lecture en chemin…" : "demander une nouvelle lecture du cercle"}
            </button>
          </div>
        )}

        {/* Section : mes opt-in cercle (3 modes par kairos) */}
        <div className="divider-moon mt-xl">mes kairos & ce cercle</div>

        <p
          className="meta op-70 mb-l"
          style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 520 }}
        >
          chaque kairos peut rester privé, alimenter la lecture du cercle anonymement, ou être déposé en clair pour les autres.
        </p>

        {kairosLoading ? (
          <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            chargement…
          </div>
        ) : kairos.length === 0 ? (
          <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
            tu n'as pas encore déposé de kairos. commence par en cueillir un.
          </p>
        ) : (
          <div className="stack gap-s mb-xl">
            {kairos.map((k) => (
              <KairosOptinRow key={k.id} kairos={k} circleId={circleId} />
            ))}
          </div>
        )}

        {/* Quitter le cercle */}
        <div
          className="mt-xl"
          style={{
            paddingTop: "var(--s-4)",
            borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
          }}
        >
          {!confirmLeave ? (
            <button
              className="btn-text"
              onClick={() => setConfirmLeave(true)}
              style={{
                fontSize: 12.5,
                color: "var(--ash-light)",
                fontStyle: "italic",
              }}
            >
              quitter ce cercle
            </button>
          ) : (
            <div className="stack gap-s">
              <p
                className="seuil-italic"
                style={{ color: "var(--ash-light)", maxWidth: 480 }}
              >
                tu cesseras de tenir ce cercle. les lectures déjà reçues restent.
              </p>
              <div className="row gap-m">
                <button
                  className="btn-ghost"
                  onClick={doLeave}
                  style={{ borderColor: "var(--ember-live)", color: "var(--ember-live)" }}
                >
                  oui, quitter
                </button>
                <button className="btn-text" onClick={() => setConfirmLeave(false)}>
                  rester
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── RestitutionBlock ── narrative + 3 réactions sobres ────────
const RestitutionBlock = ({ circleId, restitution }) => {
  const [counts, setCounts] = uCS({ resonates: 0, unfamiliar: 0, question: 0 });
  const [mine, setMine] = uCS({ resonates: false, unfamiliar: false, question: false });
  const [loading, setLoading] = uCS(true);

  uCE(() => {
    let cancelled = false;
    window.DreamAPI.listCircleReactions(circleId, restitution.id)
      .then((r) => {
        if (cancelled) return;
        if (r?.counts) setCounts(r.counts);
        if (r?.mine) setMine(r.mine);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [circleId, restitution.id]);

  const toggle = async (type) => {
    const wasOn = !!mine[type];
    // Optimistic
    setMine((m) => ({ ...m, [type]: !wasOn }));
    setCounts((c) => ({ ...c, [type]: Math.max(0, (c[type] || 0) + (wasOn ? -1 : 1)) }));
    // 2026-04-27 P1.4 — Track sync mutation pour <SyncStatus>
    const syncId = window.dreamSyncBegin ? window.dreamSyncBegin("circleReaction") : null;
    try {
      if (wasOn) {
        await window.DreamAPI.removeCircleReaction(circleId, restitution.id, type);
      } else {
        await window.DreamAPI.submitCircleReaction(circleId, restitution.id, type);
      }
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId);
    } catch (e) {
      // revert
      setMine((m) => ({ ...m, [type]: wasOn }));
      setCounts((c) => ({ ...c, [type]: Math.max(0, (c[type] || 0) + (wasOn ? 1 : -1)) }));
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: e.message });
      try { window.dreamShowToast?.({
        text: "réaction non enregistrée, reviens dans un instant",
        tone: "error", duration: 4000,
      }); } catch {}
      console.warn("[RestitutionBlock] reaction toggle failed:", e.message);
    }
  };

  const text = restitution.narrative_text || "";
  const status = restitution.status;

  if (status === "pending") {
    return (
      <div
        className="card text-center"
        style={{
          padding: "var(--s-5) var(--s-4)",
          background:
            "color-mix(in oklch, var(--night-warm) 60%, var(--night-floor))",
          border: "1px solid var(--ash-deep)",
          borderRadius: 0,
        }}
      >
        <div className="breath mb-l" style={{ width: 40, height: 40, margin: "0 auto" }} />
        <p
          className="seuil-italic"
          style={{ color: "var(--ash-light)", maxWidth: 380, margin: "0 auto" }}
        >
          la lecture est en chemin. reviens dans un instant.
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className="card"
        style={{
          padding: "var(--s-4)",
          background: "color-mix(in oklch, var(--ember-soft) 8%, var(--night-floor))",
          border: "1px solid color-mix(in oklch, var(--ember-live) 30%, var(--ash-deep))",
          borderRadius: 0,
        }}
      >
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          la lecture n'a pas pu se faire cette fois. demande à nouveau plus tard.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div
        className="card mb-l"
        style={{
          padding: "var(--s-5) var(--s-4)",
          background: "var(--night-warm)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
          borderRadius: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Texture paper subtle */}
        <svg
          width="100%"
          height="100%"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.5,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <rect width="100%" height="100%" filter="url(#noise-paper)" />
        </svg>

        <div
          className="meta-mono mb-m"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--silk-gold)",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          {relativeWhen(restitution.requested_at)} · sur {restitution.metadata?.period_days || 28} jours
        </div>

        <div
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--bone)",
            textWrap: "pretty",
            position: "relative",
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </div>

        {restitution.intention_at_time && (
          <div
            className="mt-l"
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 12.5,
              color: "var(--ash-light)",
              opacity: 0.75,
              position: "relative",
            }}
          >
            intention au moment de la lecture : « {restitution.intention_at_time} »
          </div>
        )}
      </div>

      {/* 3 réactions sobres : pas d'emoji, pas de boutons gros */}
      <div className="row gap-l" style={{ flexWrap: "wrap", justifyContent: "center" }}>
        {[
          ["resonates", "résonne"],
          ["unfamiliar", "unfamiliar"],
          ["question", "question"],
        ].map(([k, label]) => {
          const isOn = !!mine[k];
          const c = counts[k] || 0;
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              disabled={loading}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px 4px",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 14.5,
                color: isOn ? "var(--silk-gold)" : "var(--ash-light)",
                letterSpacing: "0.02em",
                transition: "color 380ms cubic-bezier(0.45,0,0.55,1)",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {label}
              {c > 0 && (
                <span
                  style={{
                    marginLeft: 6,
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    opacity: 0.7,
                  }}
                >
                  · {c}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div
        className="meta op-70 text-center mt-s"
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          fontSize: 11.5,
        }}
      >
        pas un vote — une façon de tenir
      </div>
    </div>
  );
};

// ── KairosOptinRow ── 3 modes par kairos ──────────────────────
const KairosOptinRow = ({ kairos, circleId }) => {
  const [mode, setMode] = uCS("private"); // private | optin_anon | shared_clear
  const [busy, setBusy] = uCS(false);
  const [loaded, setLoaded] = uCS(false);

  uCE(() => {
    let cancelled = false;
    window.DreamAPI.getKairosCircleMode(kairos.id, circleId)
      .then((r) => {
        if (cancelled) return;
        if (r?.mode) setMode(r.mode);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [kairos.id, circleId]);

  const change = async (newMode) => {
    if (busy || newMode === mode) return;
    const prev = mode;
    setBusy(true);
    setMode(newMode);
    try {
      await window.DreamAPI.optinKairosToCircle({
        kairosId: kairos.id,
        circleId,
        mode: newMode,
      });
    } catch (e) {
      setMode(prev);
      console.warn("[KairosOptinRow] mode change failed:", e.message);
    } finally {
      setBusy(false);
    }
  };

  const text = kairos.text || kairos.raw_text || "";
  const preview = text.length > 120 ? text.slice(0, 120) + "…" : text;
  const when = kairos.when || relativeWhen(kairos.created_at);

  return (
    <div
      className="card"
      style={{
        padding: "var(--s-3) var(--s-4)",
        background:
          mode === "shared_clear"
            ? "color-mix(in oklch, var(--silk-gold) 5%, var(--night-floor))"
            : mode === "optin_anon"
            ? "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))"
            : "transparent",
        border:
          mode === "shared_clear"
            ? "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))"
            : "1px solid var(--ash-deep)",
        borderRadius: 0,
        opacity: loaded ? 1 : 0.6,
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
      }}
    >
      <div
        className="meta-mono mb-s"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.1em",
          color: "var(--ash-light)",
          textTransform: "uppercase",
        }}
      >
        {window.typeLabel ? window.typeLabel(kairos.type) : kairos.type} · {when}
      </div>
      <div
        className="mb-s"
        style={{
          fontFamily: "var(--serif)",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--bone)",
          textWrap: "pretty",
        }}
      >
        {preview}
      </div>
      <div className="row gap-s" style={{ flexWrap: "wrap" }}>
        {[
          ["private", "privé"],
          ["optin_anon", "opt-in cercle"],
          ["shared_clear", "partagé en clair"],
        ].map(([k, label]) => {
          const isOn = mode === k;
          return (
            <button
              key={k}
              onClick={() => change(k)}
              disabled={busy}
              style={{
                background: "transparent",
                border: "none",
                cursor: busy ? "wait" : "pointer",
                padding: "4px 0",
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 12.5,
                color: isOn ? "var(--silk-gold)" : "var(--ash-light)",
                opacity: busy ? 0.6 : 1,
                borderBottom: isOn
                  ? "1px solid var(--silk-gold)"
                  : "1px solid transparent",
                marginRight: 14,
                transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── CercleTemplatePicker ──────────────────────────────────────
// Spec : 1_CERCLE_BIBLE.md §3.1 + 3_CERCLE_TECHNICAL.md §11.bis.20.11
// 7 templates + option "cercle libre". Grille douce, glyphs, EB Garamond italic.
const CercleTemplatePicker = ({ onPick, onCancel }) => {
  const [tpls, setTpls] = uCS([]);
  const [loading, setLoading] = uCS(true);
  const [err, setErr] = uCS(null);

  uCE(() => {
    let alive = true;
    window.DreamAPI.listCircleTemplates()
      .then((res) => {
        if (!alive) return;
        if (Array.isArray(res?.templates)) setTpls(res.templates);
        else setErr("templates indisponibles");
      })
      .catch((e) => alive && setErr(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <h1 className="h1-seuil mb-l">qu'est-ce que ce cercle va tenir&nbsp;?</h1>
      <p
        className="body op-70 mb-xl"
        style={{ maxWidth: 540, fontFamily: "var(--serif)", fontStyle: "italic" }}
      >
        un point de départ doux, jamais un carcan — tout reste modifiable juste après.
      </p>

      {loading && <div className="breath" style={{ marginTop: 24 }} />}

      {err && (
        <p className="meta op-70" style={{ color: "var(--ash-light)" }}>
          {err}
        </p>
      )}

      {!loading && !err && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 14,
            marginBottom: 28,
          }}
        >
          {tpls.map((t) => (
            <button
              key={t.slug}
              onClick={() => onPick(t)}
              style={{
                background: "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))",
                border:
                  "1px solid color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
                color: "var(--bone)",
                padding: "20px 18px",
                textAlign: "left",
                cursor: "pointer",
                borderRadius: 0,
                fontFamily: "var(--serif)",
                transition: "all 320ms cubic-bezier(0.45,0,0.55,1)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                minHeight: 138,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "color-mix(in oklch, var(--silk-gold) 14%, var(--night-warm))";
                e.currentTarget.style.borderColor =
                  "color-mix(in oklch, var(--silk-gold) 55%, var(--ash-deep))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "color-mix(in oklch, var(--silk-gold) 5%, var(--night-warm))";
                e.currentTarget.style.borderColor =
                  "color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))";
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  color: "var(--silk-gold)",
                  letterSpacing: "0.05em",
                }}
              >
                {t.glyph || "○"}
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: 17,
                  letterSpacing: "0.01em",
                  lineHeight: 1.3,
                }}
              >
                {t.name}
              </div>
              <div
                className="op-70"
                style={{
                  fontSize: 13,
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {t.short_description}
              </div>
              {t.trauma_aware && (
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--silk-gold)",
                    marginTop: "auto",
                  }}
                >
                  · trauma-aware
                </div>
              )}
              {t.ephemeral_default_days && (
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--silk-gold)",
                    marginTop: "auto",
                  }}
                >
                  · {t.ephemeral_default_days} jours
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div className="row gap-m" style={{ flexWrap: "wrap", marginTop: 12 }}>
        <button
          className="btn-text"
          onClick={() => onPick(null)}
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--ash-light)",
            background: "transparent",
            border: "none",
            borderBottom: "1px dashed color-mix(in oklch, var(--ash-light) 50%, transparent)",
            cursor: "pointer",
            padding: "10px 4px",
          }}
        >
          ou créer un cercle libre →
        </button>
        <button
          className="btn-text"
          onClick={onCancel}
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            fontSize: 14,
            color: "var(--ash-light)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "10px 4px",
          }}
        >
          annuler
        </button>
      </div>
    </>
  );
};

// ── CreerCercleScreen ── wizard 4 steps (template picker + name + intention + confirm) ─
const CreerCercleScreen = ({ go }) => {
  // step values: 'pick' | 0 | 1 | 2
  const [step, setStep] = uCS("pick");
  const [chosenTemplate, setChosenTemplate] = uCS(null); // slug or null (libre)
  const [templateMeta, setTemplateMeta] = uCS(null);     // full template row
  const [name, setName] = uCS("");
  const [kind, setKind] = uCS("spontane"); // toggle spontane / intentionnel
  const [intention, setIntention] = uCS("");
  const [subIntents, setSubIntents] = uCS(["", "", ""]);
  const [createdCircle, setCreatedCircle] = uCS(null);
  const [creating, setCreating] = uCS(false);
  const [createError, setCreateError] = uCS(null);
  const [copied, setCopied] = uCS(false);
  // Cercle éphémère (T2 Niveau 3) — null = non-éphémère ; sinon nombre de jours
  const [isEphemeral, setIsEphemeral] = uCS(false);
  const [ephemeralDays, setEphemeralDays] = uCS(21);

  // Compute steps : if spontane → step 0 (name+type) → step 2 (confirm)
  //                 if intentionnel → step 0 → step 1 (intention) → step 2
  const goNext = () => {
    if (step === "pick") setStep(0);
    else if (step === 0 && kind === "spontane") setStep(2);
    else setStep(step + 1);
  };
  const goBack = () => {
    if (step === 0) setStep("pick");
    else if (step === 2 && kind === "spontane") setStep(0);
    else if (typeof step === "number" && step > 0) setStep(step - 1);
  };

  // Picker handler : choose template or "libre"
  const onPickTemplate = (tpl) => {
    if (!tpl) {
      // cercle libre : reset to free wizard
      setChosenTemplate(null);
      setTemplateMeta(null);
      setStep(0);
      return;
    }
    setChosenTemplate(tpl.slug);
    setTemplateMeta(tpl);
    // Pre-fill from template
    setName(tpl.name || "");
    setKind(tpl.default_circle_type || "spontane");
    setIntention(tpl.default_intention || "");
    const subs = Array.isArray(tpl.default_sub_intentions) ? tpl.default_sub_intentions : [];
    setSubIntents([subs[0] || "", subs[1] || "", subs[2] || ""]);
    setStep(0);
  };

  // Create on entering step 2
  uCE(() => {
    if (step !== 2 || createdCircle || creating) return;
    setCreating(true);
    setCreateError(null);
    const cleanedSubs = subIntents.map((s) => s.trim()).filter(Boolean).slice(0, 3);

    // Branche template vs libre
    const promise = chosenTemplate
      ? window.DreamAPI.createCircleFromTemplate({
          slug: chosenTemplate,
          customName: name.trim(),
          customIntention: kind === "intentionnel" ? intention.trim() : null,
          customSubIntentions: kind === "intentionnel" ? cleanedSubs : [],
        })
      : window.DreamAPI.createCircle({
          name: name.trim(),
          type: kind,
          intention_text: kind === "intentionnel" ? intention.trim() : null,
          sub_intentions: kind === "intentionnel" ? cleanedSubs : [],
          maxMembers: 8,
          frequency: kind === "spontane" ? "freeform" : "weekly",
          ephemeral_days: isEphemeral ? ephemeralDays : null,
        });

    promise
      .then((result) => {
        if (result?.circle?.invite_code) {
          setCreatedCircle(result.circle);
        } else if (result?._seed) {
          setCreateError("création locale (mode démo, sans backend)");
          setCreatedCircle({
            id: "local-" + Date.now(),
            name: name.trim(),
            invite_code: "DEMO" + Math.random().toString(36).slice(2, 6).toUpperCase(),
          });
        } else {
          setCreateError(result?.error || "la création n'a pas abouti");
        }
      })
      .catch((e) => setCreateError(e.message))
      .finally(() => setCreating(false));
  }, [step]);

  const inviteUrl = createdCircle?.invite_code
    ? `${location.origin}/v12/index.html#rejoindre?code=${createdCircle.invite_code}`
    : "";

  const doCopy = async () => {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard?.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const doShare = async () => {
    if (!inviteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: name + " · Dream",
          text: "rejoins le cercle « " + name + " » dans Dream",
          url: inviteUrl,
        });
      } catch {}
    } else {
      doCopy();
    }
  };

  return (
    <div
      className="stage screen-enter"
      style={{
        background: "var(--night-floor)",
        // Van Gennep transition between steps
        transition: "all var(--tempo-tisse, 380ms) cubic-bezier(0.45,0,0.55,1)",
      }}
    >
      <window.TopNav showBack onBack={() => (step !== "pick" ? goBack() : go("cercle"))} label="" />
      <div className="frame" style={{ maxWidth: step === "pick" ? 760 : 560 }}>
        <div
          className="meta-mono mb-s"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--silk-gold)",
            textTransform: "uppercase",
          }}
        >
          {step === "pick"
            ? "créer un cercle · choisir un point de départ"
            : "créer un cercle · étape " +
              (step === 0 ? 1 : step === 1 ? 2 : 3) +
              "/" +
              (kind === "intentionnel" ? 3 : 2)}
        </div>

        {/* PICK — template picker (7 templates + cercle libre) */}
        {step === "pick" && (
          <CercleTemplatePicker onPick={onPickTemplate} onCancel={() => go("cercle")} />
        )}

        {/* STEP 0 — nom + type */}
        {step === 0 && (
          <CreerStepOne
            name={name}
            setName={setName}
            kind={kind}
            setKind={setKind}
            isEphemeral={isEphemeral}
            setIsEphemeral={setIsEphemeral}
            ephemeralDays={ephemeralDays}
            setEphemeralDays={setEphemeralDays}
            onNext={goNext}
            onCancel={() => go("cercle")}
            templateMeta={templateMeta}
          />
        )}

        {/* STEP 1 — intention (intentionnel uniquement) */}
        {step === 1 && (
          <CreerStepIntention
            intention={intention}
            setIntention={setIntention}
            subIntents={subIntents}
            setSubIntents={setSubIntents}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {/* STEP 2 — confirm + invite link */}
        {step === 2 && (
          <CreerStepConfirm
            name={name}
            kind={kind}
            intention={intention}
            creating={creating}
            createError={createError}
            createdCircle={createdCircle}
            inviteUrl={inviteUrl}
            copied={copied}
            doCopy={doCopy}
            doShare={doShare}
            onEnter={() => {
              if (createdCircle?.id) go("cercle-detail", createdCircle.id);
              else go("cercle");
            }}
          />
        )}
      </div>
    </div>
  );
};

const CreerStepOne = ({
  name,
  setName,
  kind,
  setKind,
  isEphemeral,
  setIsEphemeral,
  ephemeralDays,
  setEphemeralDays,
  onNext,
  onCancel,
  templateMeta,
}) => (
  <>
    <h1 className="h1-seuil mb-l">comment voudrais-tu l'appeler ?</h1>
    {templateMeta && (
      <div
        className="meta-mono mb-m"
        style={{
          fontFamily: "var(--mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          color: "var(--silk-gold)",
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        départ&nbsp;: {templateMeta.glyph || "○"} {templateMeta.name}
      </div>
    )}
    <p className="body op-70 mb-m" style={{ maxWidth: 480 }}>
      un nom qui décrit ce que ce cercle tient.
    </p>
    <input
      className="field-input mb-xl"
      placeholder="la forêt tenue, les veilleuses de mars, l'équipe transition…"
      value={name}
      onChange={(e) => setName(e.target.value)}
      autoFocus
    />

    <div
      className="meta-mono mb-m"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: "var(--ash-light)",
        textTransform: "uppercase",
      }}
    >
      quel type de cercle
    </div>

    <div className="stack gap-s mb-xl">
      {[
        [
          "spontane",
          "spontané",
          "famille, amis, collègues. on partage les rêves pour l'intimité. zéro protocole.",
        ],
        [
          "intentionnel",
          "intentionnel",
          "ONG, asso, entreprise, collectif. on tient ensemble une intention partagée.",
        ],
      ].map(([k, lbl, desc]) => (
        <button
          key={k}
          onClick={() => setKind(k)}
          style={{
            textAlign: "left",
            padding: "var(--s-3) var(--s-4)",
            border:
              "1px solid " +
              (kind === k
                ? "color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))"
                : "var(--ash-deep)"),
            background:
              kind === k
                ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)"
                : "transparent",
            cursor: "pointer",
            transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 17,
              color: kind === k ? "var(--silk-gold)" : "var(--bone)",
              marginBottom: 4,
              fontStyle: "italic",
            }}
          >
            {lbl}
          </div>
          <div
            className="meta"
            style={{
              color: "var(--ash-light)",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {desc}
          </div>
        </button>
      ))}
    </div>

    {/* Cercle éphémère 21j (T2 Niveau 3) — discret, sobre */}
    <div
      className="meta-mono mb-m"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: "var(--ash-light)",
        textTransform: "uppercase",
      }}
    >
      ce cercle est-il éphémère ?
    </div>

    <div
      className="card mb-xl"
      style={{
        padding: "var(--s-3) var(--s-4)",
        border: "1px solid " + (isEphemeral
          ? "color-mix(in oklch, var(--silk-gold) 24%, var(--ash-deep))"
          : "var(--ash-deep)"),
        background: isEphemeral
          ? "color-mix(in oklch, var(--silk-gold) 4%, transparent)"
          : "transparent",
        transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={!!isEphemeral}
          onChange={(e) => setIsEphemeral(e.target.checked)}
          style={{
            marginTop: 4,
            accentColor: "var(--silk-gold)",
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: isEphemeral ? "var(--silk-gold)" : "var(--bone)",
              marginBottom: 4,
            }}
          >
            ce cercle se referme tout seul
          </div>
          <div
            className="meta"
            style={{
              color: "var(--ash-light)",
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            une traversée commune avec une fin inscrite dès le départ. au jour J,
            une lecture finale est tissée et le cercle s'archive.
          </div>
        </div>
      </label>

      {isEphemeral && (
        <div className="mt-m" style={{ paddingLeft: 28 }}>
          <div
            className="meta-mono mb-s"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              color: "var(--ash-light)",
              textTransform: "uppercase",
            }}
          >
            durée &nbsp;·&nbsp; <span style={{ color: "var(--silk-gold)" }}>{ephemeralDays} jours</span>
          </div>
          <div className="row gap-s" style={{ flexWrap: "wrap", marginBottom: 10 }}>
            {[7, 14, 21, 30, 60].map((d) => (
              <button
                key={d}
                onClick={() => setEphemeralDays(d)}
                style={{
                  background:
                    ephemeralDays === d
                      ? "color-mix(in oklch, var(--silk-gold) 12%, transparent)"
                      : "transparent",
                  border:
                    "1px solid " +
                    (ephemeralDays === d
                      ? "var(--silk-gold)"
                      : "var(--ash-deep)"),
                  color:
                    ephemeralDays === d
                      ? "var(--silk-gold)"
                      : "var(--ash-light)",
                  padding: "6px 14px",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 280ms ease",
                }}
              >
                {d}j
              </button>
            ))}
          </div>
          <input
            type="range"
            min={1}
            max={90}
            value={ephemeralDays}
            onChange={(e) => setEphemeralDays(Number(e.target.value))}
            style={{
              width: "100%",
              accentColor: "var(--silk-gold)",
            }}
          />
          {ephemeralDays === 21 && (
            <div
              className="meta op-70 mt-s"
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 13,
                color: "var(--ash-light)",
                lineHeight: 1.5,
              }}
            >
              21 jours · trois semaines, un cycle de traversée (Estés, Vasalisa).
            </div>
          )}
        </div>
      )}
    </div>

    <div className="row" style={{ justifyContent: "space-between" }}>
      <button className="btn-text" onClick={onCancel}>
        annuler
      </button>
      <button
        className="btn-ghost"
        disabled={!name.trim() || !kind}
        onClick={onNext}
      >
        continuer
      </button>
    </div>
  </>
);

const CreerStepIntention = ({
  intention,
  setIntention,
  subIntents,
  setSubIntents,
  onNext,
  onBack,
}) => (
  <>
    <h1 className="h1-seuil mb-l">quelle intention tenez-vous ensemble ?</h1>
    <p className="body op-70 mb-l" style={{ maxWidth: 480 }}>
      une phrase. pas un objectif — une orientation.
    </p>
    <textarea
      className="field-textarea mb-l"
      placeholder="traverser nos transitions professionnelles, sans conseils. tenir ce projet politique du regard de nos rêves. écouter ce que la communauté porte."
      value={intention}
      onChange={(e) => setIntention(e.target.value)}
      rows={3}
      autoFocus
    />

    <div
      className="meta-mono mb-s"
      style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        letterSpacing: "0.14em",
        color: "var(--ash-light)",
        textTransform: "uppercase",
      }}
    >
      sous-intentions (jusqu'à 3, optionnel)
    </div>
    <div className="stack gap-s mb-xl">
      {subIntents.map((s, i) => (
        <input
          key={i}
          className="field-input"
          placeholder={`sous-intention ${i + 1}…`}
          value={s}
          onChange={(e) => {
            const next = [...subIntents];
            next[i] = e.target.value;
            setSubIntents(next);
          }}
        />
      ))}
    </div>

    <div className="row" style={{ justifyContent: "space-between" }}>
      <button className="btn-text" onClick={onBack}>
        ← retour
      </button>
      <button
        className="btn-ghost"
        disabled={!intention.trim()}
        onClick={onNext}
      >
        continuer
      </button>
    </div>
  </>
);

const CreerStepConfirm = ({
  name,
  kind,
  intention,
  creating,
  createError,
  createdCircle,
  inviteUrl,
  copied,
  doCopy,
  doShare,
  onEnter,
}) => {
  if (creating) {
    return (
      <div className="text-center" style={{ paddingTop: "var(--s-6)" }}>
        <div className="breath mb-xl" />
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          le cercle se forme.
        </p>
      </div>
    );
  }

  if (!createdCircle) {
    return (
      <div className="stack gap-m">
        <h1 className="h1-seuil mb-m">la création n'a pas pu se faire</h1>
        <p className="seuil-italic" style={{ color: "var(--ember-live)" }}>
          {createError || "vérifie ta connexion et réessaie."}
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="h1-seuil mb-m">le cercle est ouvert.</h1>
      <p
        className="seuil-italic mb-l"
        style={{ color: "var(--ash-light)", maxWidth: 480 }}
      >
        voici le lien d'invitation. partage-le aux personnes que tu veux voir tenir ce cercle avec toi.
      </p>

      <div
        className="card mb-l"
        style={{
          padding: "var(--s-4)",
          background:
            "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
          border:
            "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
          borderRadius: 0,
        }}
      >
        <div
          className="meta-mono mb-s"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--silk-gold)",
            textTransform: "uppercase",
          }}
        >
          code · {createdCircle.invite_code}
        </div>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12.5,
            color: "var(--bone)",
            wordBreak: "break-all",
            lineHeight: 1.5,
          }}
        >
          {inviteUrl}
        </div>
      </div>

      <div className="row gap-m mb-xl" style={{ flexWrap: "wrap" }}>
        <button className="btn-ghost" onClick={doCopy}>
          {copied ? "copié ·" : "copier le lien"}
        </button>
        <button className="btn-text" onClick={doShare}>
          partager…
        </button>
      </div>

      <p
        className="meta op-70 mb-l"
        style={{
          fontFamily: "var(--serif)",
          fontStyle: "italic",
          maxWidth: 460,
        }}
      >
        un cercle à une personne reste un cercle. invite à ton rythme.
      </p>

      {createError && (
        <p
          className="meta mb-m"
          style={{
            color: "var(--ember-live)",
            fontFamily: "var(--serif)",
            fontStyle: "italic",
          }}
        >
          {createError}
        </p>
      )}

      <button className="btn-ghost" onClick={onEnter}>
        entrer dans le cercle
      </button>
    </>
  );
};

// ── RejoindreScreen ── parse code depuis URL OU saisie ────────
const RejoindreScreen = ({ go }) => {
  const [code, setCode] = uCS(() => {
    try {
      const hash = location.hash || "";
      const m = hash.match(/[?&]code=([A-Za-z0-9]+)/);
      return m ? m[1].toUpperCase() : "";
    } catch {
      return "";
    }
  });
  const [joining, setJoining] = uCS(false);
  const [error, setError] = uCS(null);
  const [success, setSuccess] = uCS(null); // joined circle object

  const doJoin = async () => {
    if (!code.trim()) {
      setError("entre un code à 6 caractères");
      return;
    }
    setJoining(true);
    setError(null);
    try {
      const result = await window.DreamAPI.joinCircle({
        inviteCode: code.trim().toUpperCase(),
      });
      if (result?.error) {
        setError(prettifyError(result.error));
      } else if (result?.circle) {
        setSuccess(result.circle);
        // Navigate to detail after a beat
        setTimeout(() => go("cercle-detail", result.circle.id), 1200);
      } else {
        setError("rejoindre n'a pas abouti. recommence dans un instant.");
      }
    } catch (e) {
      setError(prettifyError(e.message));
    } finally {
      setJoining(false);
    }
  };

  if (success) {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("cercle")} label="" />
        <div className="frame text-center" style={{ paddingTop: "var(--s-7)" }}>
          <div className="breath mb-xl" />
          <p
            className="seuil-italic"
            style={{ color: "var(--bone)", fontSize: 18, maxWidth: 380, margin: "0 auto" }}
          >
            le cercle « {success.name} » te tient maintenant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
      <window.TopNav showBack onBack={() => go("cercle")} label="" />
      <div className="frame" style={{ maxWidth: 480 }}>
        <div
          className="meta-mono mb-s"
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "var(--silk-gold)",
            textTransform: "uppercase",
          }}
        >
          rejoindre un cercle
        </div>
        <h1 className="h1-seuil mb-l">tu as reçu un code ?</h1>
        <p
          className="body op-70 mb-l"
          style={{ maxWidth: 460 }}
        >
          entre les six caractères que la personne qui tient ce cercle t'a transmis.
        </p>

        <input
          className="field-input mb-l"
          placeholder="ABC123"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8));
            setError(null);
          }}
          autoFocus
          style={{
            fontFamily: "var(--mono)",
            letterSpacing: "0.18em",
            fontSize: 18,
            textAlign: "center",
          }}
        />

        {error && (
          <div
            className="meta mb-m"
            style={{
              color: "var(--ember-live)",
              fontFamily: "var(--serif)",
              fontStyle: "italic",
            }}
          >
            {error}
          </div>
        )}

        <div className="row gap-m" style={{ justifyContent: "space-between" }}>
          <button className="btn-text" onClick={() => go("cercle")}>
            pas cette fois
          </button>
          <button
            className="btn-ghost"
            disabled={joining || !code.trim()}
            onClick={doJoin}
          >
            {joining ? "rejoindre…" : "rejoindre"}
          </button>
        </div>

        <p
          className="meta op-70 mt-xl"
          style={{
            fontFamily: "var(--serif)",
            fontStyle: "italic",
            maxWidth: 460,
          }}
        >
          en rejoignant, tu choisiras à chaque kairos s'il reste privé, alimente la lecture du cercle, ou est partagé en clair.
        </p>
      </div>
    </div>
  );
};

// Pretty error mapping
function prettifyError(msg) {
  if (!msg) return "rejoindre n'a pas abouti.";
  const m = String(msg).toLowerCase();
  if (m.includes("non trouvé") || m.includes("not found") || m.includes("404")) {
    return "ce code ne mène à aucun cercle. vérifie qu'il est exact.";
  }
  if (m.includes("déjà membre") || m.includes("already")) {
    return "tu tiens déjà ce cercle.";
  }
  if (m.includes("complet") || m.includes("full")) {
    return "ce cercle est complet pour le moment.";
  }
  if (m.includes("auth") || m.includes("401")) {
    return "tu dois te connecter avant de rejoindre.";
  }
  return msg;
}

// ── PartagerReveScreen (legacy V1, conservé pour compat) ──────
// NOTE 2026-04-25 — l'opt-in 3-modes par kairos vit maintenant dans CercleDetail.
// Ce flow reste accessible via routes anciennes mais n'est plus le geste primaire.
const PartagerReveScreen = ({ go }) => {
  const [step, setStep] = uCS(0);
  const [selectedId, setSelectedId] = uCS(null);
  const [framing, setFraming] = uCS("");
  const [anon, setAnon] = uCS(false);
  const entries = window.seedEntries || [];
  const selected = entries.find((e) => e.id === selectedId);

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("cercle")} label="" />
      <div className="frame" style={{ maxWidth: 620 }}>
        <div
          className="meta mb-s"
          style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
        >
          déposer un kairos · le cercle
        </div>

        {step === 0 && (
          <>
            <h1 className="h1-seuil mb-l">quel kairos veux-tu déposer ?</h1>
            <p className="body op-70 mb-l">
              déposer dans le cercle est toujours un geste explicite, jamais par défaut.
            </p>
            <div className="stack gap-m mb-l">
              {entries.slice(0, 5).map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedId(e.id)}
                  style={{
                    textAlign: "left",
                    padding: "var(--s-4)",
                    border:
                      "1px solid " +
                      (selectedId === e.id ? "var(--bone)" : "var(--ash-deep)"),
                    background:
                      selectedId === e.id
                        ? "color-mix(in oklch, var(--bone) 4%, transparent)"
                        : "transparent",
                  }}
                >
                  <div
                    className="meta mb-s"
                    style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
                  >
                    {window.typeLabel ? window.typeLabel(e.type) : e.type} · {e.when}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--serif)",
                      fontSize: 16,
                      color: "var(--bone)",
                      textWrap: "pretty",
                    }}
                  >
                    {e.text.length > 180 ? e.text.slice(0, 180) + "…" : e.text}
                  </div>
                </button>
              ))}
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => go("cercle")}>
                annuler
              </button>
              <button
                className="btn-ghost"
                disabled={!selectedId}
                onClick={() => setStep(1)}
              >
                continuer
              </button>
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
              <div
                className="meta mb-s"
                style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
              >
                {window.typeLabel ? window.typeLabel(selected.type) : selected.type} ·{" "}
                {selected.when}
              </div>
              <p className="body" style={{ textWrap: "pretty" }}>
                {selected.text}
              </p>
            </div>
            <textarea
              className="field-textarea mb-l"
              placeholder="ce rêve est venu après une journée où… / je n'ai pas compris mais quelque chose a bougé…"
              value={framing}
              onChange={(e) => setFraming(e.target.value)}
            />
            <label
              className="row gap-s mb-l"
              style={{ cursor: "pointer" }}
            >
              <span
                className={"toggle " + (anon ? "on" : "")}
                onClick={() => setAnon(!anon)}
              />
              <span style={{ fontSize: 14 }}>déposer sans mon nom</span>
            </label>
            <div
              className="meta op-70 mb-l"
              style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
            >
              déposer dans le cercle n'envoie rien à Anima Mundi. ce sont deux gestes séparés.
            </div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <button className="btn-text" onClick={() => setStep(0)}>
                ← retour
              </button>
              <button className="btn-ghost" onClick={() => setStep(2)}>
                déposer dans le cercle
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center" style={{ paddingTop: "var(--s-6)" }}>
            <div className="breath mb-xl" />
            <p
              className="seuil-italic mb-s"
              style={{ maxWidth: 420, margin: "0 auto" }}
            >
              le kairos est déposé dans le cercle.
            </p>
            <div
              className="meta op-70 mt-m"
              style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}
            >
              tu seras notifiée quand quelqu'un le tient. ou jamais.
            </div>
            <button className="btn-ghost mt-xl" onClick={() => go("cercle")}>
              retourner au cercle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, {
  CercleScreen,
  CercleDetail,
  CreerCercleScreen,
  CercleTemplatePicker,
  RejoindreScreen,
  PartagerReveScreen,
});
