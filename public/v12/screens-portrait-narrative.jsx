/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Portrait NARRATIF (refonte 2026-04-25)
// Design §7.6 refonte : page lettre vivante, pas dataviz à bulles.
//
// Patterns dominants :
//   - POLYPHONIE_ONTOLOGIQUEMENT_HONNETE
//   - OPEN_QUESTION_NOT_INTERPRETATION
//   - JOURNAL_NUIT_CROISÉ (3 toggles : day / night / crossed)
//   - DREAM_ASK_CLOSING
//
// L'IA narratrice écrit une lettre du moment 200-400 mots.
// 3 toggles vivants (vie de jour / vie de nuit / les deux qui se croisent)
// 4 filtres temporels (cette lune / saison / année / always)
// 3 sections sous-jacentes : échos vivants, figures qui reviennent, tensions ouvertes.
// La constellation visuelle reste accessible en sous-page.
// ──────────────────────────────────────────────────────────────

const { useState: pS, useEffect: pE, useRef: pR } = React;

const TOGGLES = [
  { key: "day", label: "vie de jour", glyph: "☉" },
  { key: "crossed", label: "les deux qui se croisent", glyph: "⌬" },
  { key: "night", label: "vie de nuit", glyph: "☾" },
];

const PERIODS = [
  { key: "lune", label: "cette lune" },
  { key: "saison", label: "cette saison" },
  { key: "annee", label: "cette année" },
  { key: "always", label: "toujours" },
];

// Palette qui s'adapte au toggle (jour clair / nuit sombre / crépuscule)
function paletteFor(toggle) {
  if (toggle === "day") {
    return {
      "--p-bg": "var(--day-paper, oklch(0.92 0.018 75))",
      "--p-card": "var(--day-linen, oklch(0.88 0.022 70))",
      "--p-text": "var(--day-bone-warm, oklch(0.65 0.025 65))",
      "--p-meta": "var(--day-ash-soft, oklch(0.50 0.015 65))",
      "--p-accent": "var(--day-clay-warm, oklch(0.78 0.045 60))",
      "--p-glow": "var(--day-sun-low, oklch(0.72 0.090 75))",
    };
  }
  if (toggle === "night") {
    return {
      "--p-bg": "var(--night-floor)",
      "--p-card": "color-mix(in oklch, var(--night-warm) 80%, var(--ash-deep))",
      "--p-text": "var(--bone)",
      "--p-meta": "var(--ash-light)",
      "--p-accent": "var(--silk-gold)",
      "--p-glow": "var(--ember-live)",
    };
  }
  // crossed = crépuscule (gradient)
  return {
    "--p-bg": "color-mix(in oklch, var(--day-paper, #EBE2D2) 50%, var(--night-floor))",
    "--p-card": "color-mix(in oklch, var(--day-linen, #DFD3BF) 30%, var(--night-warm))",
    "--p-text": "color-mix(in oklch, var(--day-bone-warm, #9F8E7C) 50%, var(--bone))",
    "--p-meta": "color-mix(in oklch, var(--day-ash-soft, #776E62) 60%, var(--ash-light))",
    "--p-accent": "var(--silk-gold)",
    "--p-glow": "var(--day-sun-low, #C5A672)",
  };
}

// 2026-04-27 — Sprint P0.5 (Design §11.bis.19)
// Skeleton spécifique Portrait LETTRE pendant getPortraitNarrative (3-15s).
// 8 lignes EB Garamond italic shimmer + LoadingHalo + message rotating
// adapté au toggle (day/night/crossed).
function PortraitLetterSkeleton({ toggle }) {
  const Shim  = window.SkeletonShimmer;
  const Halo  = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const isNight = toggle === "night";
  const isDay   = toggle === "day";
  const messages = isDay
    ? ["lire ton jour…", "écouter le soleil…", "tisser ce moment…"]
    : isNight
      ? ["chercher tes patterns…", "écouter la lune…", "tisser ce moment…"]
      : ["tisser ce moment…", "chercher tes patterns…", "écouter la lune…"];
  const message = useRotating ? useRotating(messages, 2200) : messages[0];

  // Render simple si primitives pas encore chargées (no-op gracieux)
  if (!Shim || !Halo) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        padding: "60px 0",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "1px solid var(--p-accent)",
          animation: "halo-slow 2.5s ease-in-out infinite",
        }} />
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
          color: "var(--p-meta)",
        }}>
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className="dream-skeleton-fade-in" style={{
      background: "var(--p-card)",
      padding: "32px 28px",
      borderLeft: "3px solid var(--p-accent)",
      display: "flex", flexDirection: "column", gap: 24,
      position: "relative", overflow: "hidden",
    }}>
      {/* 2026-04-29 — HaloRespire silk central pendant skeleton (Yeshua) */}
      {window.HaloRespire && !isDay && (
        <div aria-hidden="true" style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(280px, 70%)", height: "min(280px, 70%)",
          opacity: 0.45, pointerEvents: "none", zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}

      <div style={{
        fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
        color: "var(--p-meta)", textTransform: "uppercase",
        position: "relative", zIndex: 1,
      }}>
        la lettre du moment
      </div>
      {/* 8 lignes shimmer EB Garamond italic 18px ≈ 28-30px line-height */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Shim lines={8} height={14} gap={14} dark={!isDay} lastLineWidth="58%" />
      </div>
      {/* Halo respire + message rotating italic rotating */}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 8, position: "relative", zIndex: 1 }}>
        <Halo size={28} message={message} dark={!isDay} />
      </div>
    </div>
  );
}

function PortraitNarrative({ go }) {
  const [toggle, setToggle] = pS("crossed");
  const [period, setPeriod] = pS("lune");
  const [reading, setReading] = pS(null);
  const [loading, setLoading] = pS(true);
  const [regenerating, setRegenerating] = pS(false);
  // 2026-04-30 — arc silk-gold éphémère (echoArcDraw 4.2s) si la lettre cite un écho
  const [showEchoArc, setShowEchoArc] = pS(false);

  const pal = paletteFor(toggle);

  // 2026-04-30 — détecter mention "écho" dans la lettre → trigger arc Wow2
  pE(() => {
    if (!reading || !reading.lettre || reading.error) return;
    // Détection souple : "écho", "echos", "résonance", "résonne"
    const lower = reading.lettre.toLowerCase();
    const hasEcho = /\béch[oô]s?\b|\brésonn(e|ent|ance|ances)\b|\bresonn(e|ent|ance|ances)\b|\bse fait écho\b/.test(lower);
    if (hasEcho) {
      const t = setTimeout(() => setShowEchoArc(true), 800);
      const t2 = setTimeout(() => setShowEchoArc(false), 800 + 4400);
      return () => { clearTimeout(t); clearTimeout(t2); };
    }
  }, [reading?.lettre]);

  const fetchReading = async (force = false) => {
    setLoading(true);
    if (force) setRegenerating(true);
    try {
      const r = await window.DreamAPI.getPortraitNarrative({ toggle, period, force });
      setReading(r);
    } catch (e) {
      console.warn("[Portrait] fetch failed:", e.message);
      setReading({ lettre: "L'app n'a pas pu lire ce moment. Reviens dans un instant.", error: true });
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  pE(() => { fetchReading(false); }, [toggle, period]);

  return (
    <div style={{
      ...pal,
      background: "var(--p-bg)",
      color: "var(--p-text)",
      minHeight: "100vh",
      paddingBottom: 100,
      transition: "background 920ms cubic-bezier(0.45,0,0.15,1), color 920ms ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 2026-04-29 — Background Surface paper subtil (Yeshua, opacity 0.15)
          2026-04-30 amplification : matter switch selon toggle. JOUR → paper
          (clarté patinée), NUIT → stone (gravité minérale), CROISÉ → silk
          (tissage entre les deux). Opacity 0.18 pour visibilité honnête sans
          écraser la lettre. */}
      {window.Surface && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.18, zIndex: 0,
          pointerEvents: "none",
          transition: "opacity 920ms ease",
        }}>
          <window.Surface
            matter={toggle === "day" ? "paper" : toggle === "night" ? "stone" : "silk"}
            motion={true}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
      )}

      {/* 2026-04-30 — Cercles concentriques en background (Yeshua amplification).
          Posés derrière la lettre, opacity douce, signature géosymbolique du
          Portrait (la vue d'ensemble qui se tisse en cercles depuis le centre
          MOI). Animation breathe-souffle 8s. */}
      {window.GeoSymbol && (
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "32%", left: "50%",
          width: "min(420px, 80vw)", height: "min(420px, 80vw)",
          transform: "translate(-50%, -30%)",
          opacity: 0.14,
          pointerEvents: "none", zIndex: 0,
          animation: "breathe-souffle 8s ease-in-out infinite",
        }}>
          <window.GeoSymbol kind="concentric" color="silk"
            style={{ width: "100%", height: "100%" }} />
        </div>
      )}

      {/* 2026-04-30 — HaloRespire silk pendant la lecture (Yeshua ampli)
          Une fois la lettre chargée, halo silk-gold subtil derrière le bloc
          lettre. Donne une présence vivante à la lecture, TEMPO-SOUFFLE 6s.
          Skip si toggle === day (palette claire, halo or invisible). */}
      {window.HaloRespire && reading && !loading && toggle !== "day" && (
        <div aria-hidden="true" style={{
          position: "absolute",
          top: "30%", left: "50%",
          width: "min(560px, 92vw)", height: "min(420px, 60vh)",
          transform: "translateX(-50%)",
          opacity: 0.32,
          pointerEvents: "none", zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}

      {/* 2026-04-29 — Demi-cercle aurore en haut (Yeshua, 60vw, opacity 0.4)
          aurore-gradient défini dans index.html <defs>. */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "60vw", maxWidth: 600, height: 130,
        opacity: 0.4, pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 600 130" preserveAspectRatio="none"
          style={{ width: "100%", height: "100%", overflow: "visible" }}>
          <path d="M 0 120 Q 300 -30, 600 120"
            fill="none" stroke="url(#aurore-gradient)" strokeWidth="1.2"
            style={{ animation: "breathe-souffle 8s ease-in-out infinite" }}
          />
          <path d="M 30 120 Q 300 0, 570 120"
            fill="none" stroke="url(#aurore-gradient)" strokeWidth="0.7" opacity="0.55"
          />
        </svg>
      </div>

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 24px",
        borderBottom: "1px solid color-mix(in oklch, var(--p-accent) 20%, transparent)",
      }}>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
          color: "var(--p-meta)", letterSpacing: "0.02em",
        }}>
          ton portrait · lune décroissante
        </div>
        <button onClick={() => go && go("portrait-carte")}
          title="voir ma carte"
          aria-label="voir ma carte"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--p-meta)", fontSize: 18, padding: "4px 8px",
            opacity: 0.7,
          }}>
          ✶
        </button>
      </div>

      {/* 3 toggles vivants */}
      <div style={{ padding: "24px 24px 12px" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 6, marginBottom: 14,
        }}>
          {TOGGLES.map(t => {
            const active = toggle === t.key;
            return (
              <button key={t.key} onClick={() => setToggle(t.key)}
                style={{
                  // 2026-04-30 ampli : actif = matter accent doux + glyphe agrandi
                  // au lieu de plein-bloc accent. Plus contemplatif, moins UI brute.
                  background: active
                    ? "color-mix(in oklch, var(--p-accent) 18%, transparent)"
                    : "transparent",
                  color: active ? "var(--p-accent)" : "var(--p-text)",
                  border: active
                    ? "1px solid var(--p-accent)"
                    : "1px solid color-mix(in oklch, var(--p-accent) 30%, transparent)",
                  padding: "12px 8px 10px",
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
                  cursor: "pointer", letterSpacing: "0.02em",
                  transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                  position: "relative",
                  overflow: "hidden",
                }}>
                <span style={{
                  fontSize: active ? 22 : 17,
                  opacity: active ? 1 : 0.6,
                  transition: "all 380ms ease",
                  lineHeight: 1,
                }}>{t.glyph}</span>
                <span>{t.label}</span>
                {/* barre silk-gold subtile sous le toggle actif */}
                {active && (
                  <span aria-hidden="true" style={{
                    position: "absolute", bottom: 0, left: "20%", right: "20%",
                    height: 2,
                    background: "var(--p-accent)",
                    opacity: 0.7,
                    animation: "breathe-souffle 6s ease-in-out infinite",
                  }} />
                )}
              </button>
            );
          })}
        </div>

        {/* 4 filtres temporels */}
        <div style={{
          display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap",
        }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              style={{
                background: period === p.key ? "color-mix(in oklch, var(--p-accent) 30%, transparent)" : "transparent",
                color: period === p.key ? "var(--p-text)" : "var(--p-meta)",
                border: "none",
                padding: "6px 12px",
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
                cursor: "pointer", letterSpacing: "0.02em",
                transition: "all 280ms ease",
                opacity: period === p.key ? 1 : 0.6,
              }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lettre du moment */}
      <div style={{ padding: "24px", position: "relative", zIndex: 2 }}>
        {loading && !reading ? (
          <PortraitLetterSkeleton toggle={toggle} />
        ) : reading ? (
          <div style={{
            background: "var(--p-card)",
            padding: "32px 28px",
            borderLeft: "3px solid var(--p-accent)",
            position: "relative",
            // subtle inner shadow pour ancrer la lettre au-dessus du halo
            boxShadow: "0 1px 0 color-mix(in oklch, var(--p-accent) 18%, transparent), 0 8px 32px -16px color-mix(in oklch, var(--p-accent) 12%, transparent)",
          }}>
            <div style={{
              fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
              color: "var(--p-meta)", textTransform: "uppercase", marginBottom: 16,
            }}>
              la lettre du moment
            </div>
            <p style={{
              fontFamily: "var(--serif)",
              fontSize: 18,
              lineHeight: 1.75,
              color: "var(--p-text)",
              fontStyle: "italic",
              whiteSpace: "pre-wrap",
              marginBottom: 24,
              textWrap: "pretty",
            }}>
              {reading.lettre}
            </p>
            {/* 2026-04-30 — Encart matter silk pour voix mobilisées (Yeshua ampli)
                Au lieu d'un simple texte sous la barre, encadré silk subtil
                qui marque ces voix comme citations vivantes. Si toggle === day,
                garder la sobriété (pas de matter sombre sur fond clair). */}
            {reading.voix_mobilisees && reading.voix_mobilisees.length > 0 && (
              <div style={{
                fontSize: 12.5, color: "var(--p-meta)", fontStyle: "italic",
                fontFamily: "var(--serif)",
                marginTop: 4,
                padding: "12px 14px",
                background: toggle === "day"
                  ? "transparent"
                  : "color-mix(in oklch, var(--p-accent) 8%, transparent)",
                borderTop: "1px solid color-mix(in oklch, var(--p-accent) 22%, transparent)",
                borderLeft: toggle !== "day"
                  ? "1px solid color-mix(in oklch, var(--p-accent) 28%, transparent)"
                  : "none",
                letterSpacing: "0.01em",
                lineHeight: 1.6,
              }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 9.5,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  opacity: 0.7, marginRight: 8,
                }}>
                  voix tissées
                </span>
                {reading.voix_mobilisees.join(" · ")}
              </div>
            )}
            {!reading.error && (
              <button onClick={() => fetchReading(true)}
                disabled={regenerating}
                style={{
                  marginTop: 20,
                  background: "transparent",
                  border: "1px solid var(--p-accent)",
                  color: "var(--p-accent)",
                  padding: "8px 16px",
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
                  cursor: regenerating ? "wait" : "pointer",
                  opacity: regenerating ? 0.5 : 1,
                }}>
                {regenerating ? "…" : "demander une nouvelle lecture"}
              </button>
            )}

            {/* 2026-04-30 — Arc silk-gold éphémère (Wow2 echoArcDraw 4.2s)
                Apparaît au-dessus du bloc lettre si "écho" est mentionné.
                Récupère l'animation echoArcDraw du screens-v12-amplified.jsx. */}
            {showEchoArc && (
              <svg className="echo-arc-portrait-letter" viewBox="0 0 100 30"
                preserveAspectRatio="none"
                style={{
                  position: "absolute", top: -8, left: 0, right: 0,
                  width: "100%", height: 36,
                  pointerEvents: "none", zIndex: 3,
                }}
                aria-hidden="true">
                <path d="M 12 24 Q 50 -4, 88 22"
                  fill="none"
                  stroke="var(--p-accent)"
                  strokeWidth="0.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: 200,
                    filter: "drop-shadow(0 0 4px color-mix(in oklch, var(--p-accent) 60%, transparent))",
                    animation: "echoArcDrawPortrait 4200ms cubic-bezier(0.7, 0, 0.3, 1) forwards",
                  }} />
                <style>{`
                  @keyframes echoArcDrawPortrait {
                    0%   { stroke-dashoffset: 200; opacity: 0; }
                    20%  { opacity: 0.95; }
                    65%  { stroke-dashoffset: 0; opacity: 0.85; }
                    100% { stroke-dashoffset: 0; opacity: 0; }
                  }
                `}</style>
              </svg>
            )}
          </div>
        ) : null}
      </div>

      {/* Sections sous-jacentes : échos vivants / figures / tensions */}
      {reading && !reading.empty && !reading.error && (
        <div style={{ padding: "0 24px 24px" }}>
          {reading.echos_actifs && reading.echos_actifs.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
                color: "var(--p-meta)", textTransform: "uppercase", marginBottom: 12,
              }}>
                échos vivants en ce moment
              </div>
              {reading.echos_actifs.map((e, i) => (
                <div key={i}
                  onClick={() => e.kairos_id && go && go("kairos", e.kairos_id)}
                  style={{
                    padding: "14px 18px", marginBottom: 8,
                    background: "color-mix(in oklch, var(--p-card) 60%, transparent)",
                    borderLeft: "1px solid var(--p-glow)",
                    cursor: e.kairos_id ? "pointer" : "default",
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                    color: "var(--p-text)", lineHeight: 1.6,
                  }}>
                  {e.resonance || e.preview}
                </div>
              ))}
            </div>
          )}

          {reading.figures_dominantes && reading.figures_dominantes.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
                color: "var(--p-meta)", textTransform: "uppercase", marginBottom: 12,
              }}>
                figures qui reviennent
              </div>
              <p style={{
                fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                color: "var(--p-text)", lineHeight: 1.7,
              }}>
                {reading.figures_dominantes.map((f, i) => (
                  <span key={i}>
                    <strong style={{ color: "var(--p-accent)", fontWeight: 500 }}>{f.nom}</strong>
                    {" "}({f.occurrences}× {f.qualite ? "— " + f.qualite : ""})
                    {i < reading.figures_dominantes.length - 1 ? ". " : "."}
                    {" "}
                  </span>
                ))}
              </p>
            </div>
          )}

          {reading.tensions_ouvertes && reading.tensions_ouvertes.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em",
                color: "var(--p-meta)", textTransform: "uppercase", marginBottom: 12,
              }}>
                tensions ouvertes
              </div>
              {reading.tensions_ouvertes.map((t, i) => (
                <div key={i} style={{
                  padding: "12px 16px", marginBottom: 6,
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
                  color: "var(--p-text)", lineHeight: 1.6,
                  borderLeft: "1px solid color-mix(in oklch, var(--p-accent) 40%, transparent)",
                }}>
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Constellation visuelle — sous-page accessible */}
      <div style={{ padding: "24px", textAlign: "center" }}>
        <button onClick={() => go && go("portrait-carte")}
          style={{
            background: "transparent",
            border: "1px dashed color-mix(in oklch, var(--p-accent) 40%, transparent)",
            color: "var(--p-meta)",
            padding: "10px 20px",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
            cursor: "pointer", letterSpacing: "0.02em",
          }}>
          voir la carte vivante (constellation)
        </button>
      </div>
    </div>
  );
}

window.PortraitNarrative = PortraitNarrative;
