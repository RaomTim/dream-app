/* global React */
// ──────────────────────────────────────────────────────────────
// Anima Mundi — Sanctuaire à 4 chambres séparées
// 2026-04-25 — Yeshua (Opus 4.7 1M, autonome)
//
// Refonte Bible §3.6 + Design §7.8 : on quitte le pattern "Voûte = polyphonie+
// liens" pour une architecture 1 hub + 3 chambres profondes.
//
//   1. AnimaVouteScreen      — La Voûte (hub, contemplatif, 3 cartes)
//   2. AnimaMeteoScreen      — Le temps qu'il fait dans la nuit
//   3. AnimaAnnalesScreen    — Tenu ensemble (Big Dreams en circulation)
//   4. AnimaPolyphonieScreen — Polyphonie de la lune (texte 200-500 mots)
//
// Discipline : aucun badge, aucun "nouveau", aucun call-to-action.
// Vocabulaire désensorcelé : "tenir" pas "voter", "offert" pas "posté",
// chiffres arrondis ("environ 47 000") pas "47 234 dépôts".
// Latence rituelle ≥ 14 j sur la météo. Polyphonie 1× par lune.
// ──────────────────────────────────────────────────────────────

const { useState: uAS, useEffect: uAE, useMemo: uAM, useRef: uAR } = React;

// ── Helpers ──────────────────────────────────────────────────
function roundHumane(n) {
  if (!n || n < 50) return null;
  if (n < 1000) return Math.round(n / 50) * 50;
  if (n < 10000) return Math.round(n / 500) * 500;
  if (n < 100000) return Math.round(n / 1000) * 1000;
  return Math.round(n / 10000) * 10000;
}

function frNumber(n) {
  if (n == null) return "";
  return n.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, " ");
}

// "tenu par ~300" — toujours arrondi, jamais exact
function holdRounded(n) {
  if (!n || n < 1) return 0;
  if (n < 30) return Math.max(10, Math.round(n / 10) * 10);
  if (n < 300) return Math.round(n / 50) * 50;
  if (n < 3000) return Math.round(n / 100) * 100;
  return Math.round(n / 500) * 500;
}

// Shuffle (anti-classement) — déterministe par seed (index lune) pour
// éviter que la liste saute à chaque re-render mais change chaque lune.
function shuffleSeeded(arr, seed = 1) {
  const a = arr.slice();
  let s = seed * 9301 + 49297;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Background commun aux chambres : night-floor + matter water lente ──
function ChamberBackground({ intensity = 0.5 }) {
  return (
    <div aria-hidden="true" style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "var(--night-floor)",
    }}>
      {/* Caustics water — très lentes (60s/cycle), opacité basse */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: 0.10 * intensity,
        animation: "anima-water-drift 60s ease-in-out infinite",
        mixBlendMode: "screen",
      }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
          <rect width="100%" height="100%" filter="url(#noise-water)" />
        </svg>
      </div>
      {/* Halo violet profond bas */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: "55%",
        background: "radial-gradient(ellipse at 50% 100%, color-mix(in oklch, var(--obsidian) 55%, transparent), transparent 70%)",
        opacity: 0.7,
      }} />
      {/* Halo navy centre */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 35%, color-mix(in oklch, var(--stone-cool) 22%, transparent), transparent 65%)",
        opacity: 0.55,
      }} />
    </div>
  );
}

// ── Constellation respirante (fond contemplatif, 0 interaction) ─────
// Densité = volume kairos déposés ces 28 j (arrondi humanisé).
function ConstellationBreathing({ density = 80 }) {
  const [tick, setTick] = uAS(0);
  uAE(() => {
    let raf;
    let last = performance.now();
    const loop = (now) => {
      // Respiration 5 s in / 5 s out → tick advance lent
      const dt = now - last;
      last = now;
      setTick(t => t + dt / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const points = uAM(() => {
    // Densité bornée pour éviter saturation visuelle (sanctuaire pas dashboard)
    const N = Math.max(40, Math.min(140, Math.round(density)));
    const arr = [];
    for (let i = 0; i < N; i++) {
      // Distribution pseudo-aléatoire (golden ratio) — plus organique qu'une grille
      const t = i / N;
      const angle = i * 2.39996; // golden angle
      const r = Math.sqrt(t) * 44;
      const cx = 50 + Math.cos(angle) * r;
      const cy = 50 + Math.sin(angle) * r * 0.62; // écrasement vertical
      const phase = (i * 0.317) % (Math.PI * 2);
      const size = 0.35 + ((i * 13) % 9) / 14;
      // 1 sur 28 = "pointe argent rare" (silk-gold), 1 sur 11 = stone-cool, sinon bone
      const kind = i % 28 === 0 ? "gold" : i % 11 === 0 ? "cool" : "bone";
      arr.push({ cx, cy, phase, size, kind });
    }
    return arr;
  }, [density]);

  // Cycle respiration 10s (5 in / 5 out)
  const breath = (Math.sin((tick / 10) * Math.PI * 2) + 1) / 2;

  return (
    <div className="anima-constellation" aria-hidden="true" style={{
      width: "100%", height: 320,
      position: "relative", overflow: "hidden",
      pointerEvents: "none",
    }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
        {points.map((p, i) => {
          // Légère désynchronisation par point pour éviter "tout pulse à l'unisson"
          const local = (Math.sin((tick / 10) * Math.PI * 2 + p.phase * 0.3) + 1) / 2;
          const a = 0.15 + local * 0.55;
          const r = p.size * (0.7 + breath * 0.4);
          const fill = p.kind === "gold"
            ? "var(--silk-gold)"
            : p.kind === "cool"
              ? "var(--stone-cool)"
              : "var(--bone)";
          return <circle key={i} cx={p.cx} cy={p.cy} r={r} fill={fill} opacity={a} />;
        })}
      </svg>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// CHAMBRE 1 — La Voûte (hub d'accueil contemplatif)
// ──────────────────────────────────────────────────────────────
const AnimaVouteScreen = ({ go }) => {
  const [voute, setVoute] = uAS(null);
  const [loading, setLoading] = uAS(true);

  uAE(() => {
    let cancelled = false;
    window.DreamAPI.getVoute().then(d => {
      if (cancelled) return;
      setVoute(d);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  // Volume kairos arrondi (ces 28 j)
  const rawCount = voute?.meteo?.k_count
    || voute?.meteo_optin_count
    || null;
  const humaneCount = roundHumane(rawCount);

  // Densité constellation : proportionnelle au volume, bornée
  const density = uAM(() => {
    if (!rawCount || rawCount < 50) return 60;
    return Math.min(140, 50 + Math.round(rawCount / 600));
  }, [rawCount]);

  return (
    <div className="stage screen-enter" style={{ background: "transparent", position: "relative" }}>
      <ChamberBackground intensity={1} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav />
        <div className="frame" style={{ paddingBottom: 120 }}>
          {/* Chiffre arrondi haut — sobre, EB Garamond italic, jamais en gras */}
          <div className="text-center" style={{
            marginTop: "var(--s-4)", marginBottom: "var(--s-4)",
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 15.5, color: "var(--ash-light)",
            letterSpacing: "0.01em", textWrap: "pretty",
            opacity: loading ? 0 : 0.85,
            transition: "opacity 1200ms var(--ease-respire)",
          }}>
            {humaneCount
              ? <>Cette lune, l'humanité a rêvé environ {frNumber(humaneCount)} fois.</>
              : <>Cette lune, des voix se rassemblent dans la nuit.</>}
          </div>

          {/* Constellation respirante centrale (fond contemplatif, 0 tap) */}
          <ConstellationBreathing density={density} />

          {/* Titre sanctuaire — discret, presque effacé */}
          <div className="text-center" style={{
            marginTop: "var(--s-4)", marginBottom: "var(--s-6)",
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 13, color: "var(--ash-light)",
            letterSpacing: "0.18em", textTransform: "lowercase",
            opacity: 0.6,
          }}>
            anima mundi
          </div>

          {/* 3 chambres — cards espacées, respirantes */}
          <div className="stack" style={{ gap: 28 }}>
            <ChamberCard
              title="Le temps qu'il fait dans la nuit"
              hint="météo"
              onClick={() => go("anima-meteo")}
              breathDelay={0}
            />
            <ChamberCard
              title="Tenu ensemble"
              hint="annales"
              onClick={() => go("anima-annales")}
              breathDelay={1.6}
            />
            <ChamberCard
              title="Polyphonie de la lune"
              hint="lecture longue"
              onClick={() => go("anima-polyphonie")}
              breathDelay={3.2}
            />
          </div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}

      <style>{`
        @keyframes anima-water-drift {
          0%, 100% { transform: translate3d(-1.5%, -1%, 0) scale(1.04); }
          50%      { transform: translate3d(1.5%, 1%, 0) scale(1.06); }
        }
        @keyframes anima-card-breathe {
          0%, 100% { box-shadow: 0 0 24px color-mix(in oklch, var(--bone) 3%, transparent); }
          50%      { box-shadow: 0 0 42px color-mix(in oklch, var(--silk-gold) 9%, transparent); }
        }
        .anima-chamber-card {
          padding: 32px 28px;
          background:
            radial-gradient(ellipse at 80% 20%, color-mix(in oklch, var(--bone) 3%, transparent), transparent 60%),
            color-mix(in oklch, var(--obsidian) 48%, transparent);
          border: 1px solid color-mix(in oklch, var(--silk-gold) 8%, var(--ash-deep));
          color: var(--bone);
          cursor: pointer; text-align: left;
          transition: border-color 920ms var(--ease-respire),
                      transform 920ms var(--ease-respire),
                      background 920ms var(--ease-respire);
          position: relative; overflow: hidden;
          font-family: var(--serif);
          animation: anima-card-breathe 9s ease-in-out infinite;
        }
        .anima-chamber-card::before {
          content: ""; position: absolute; inset: 0;
          background-image: url('#noise-stone');
          opacity: 0.30;
          pointer-events: none;
        }
        .anima-chamber-card:hover {
          border-color: color-mix(in oklch, var(--silk-gold) 28%, var(--ash-mid));
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

const ChamberCard = ({ title, hint, onClick, breathDelay = 0 }) => (
  <button className="anima-chamber-card" onClick={onClick}
    style={{ animationDelay: `-${breathDelay}s` }}>
    <div style={{ position: "relative", zIndex: 1 }}>
      <h3 style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 24, lineHeight: 1.25,
        color: "var(--bone)",
        margin: 0,
        textWrap: "pretty",
      }}>{title}</h3>
      <div style={{
        marginTop: 12,
        fontFamily: "var(--mono)", fontSize: 10.5,
        color: "var(--ash-light)",
        letterSpacing: "0.18em", textTransform: "uppercase",
        opacity: 0.7,
      }}>{hint}</div>
    </div>
  </button>
);

// ──────────────────────────────────────────────────────────────
// CHAMBRE 2 — Le temps qu'il fait dans la nuit (Météo)
// ──────────────────────────────────────────────────────────────
const AnimaMeteoScreen = ({ go }) => {
  const [meteos, setMeteos] = uAS([]);
  const [loading, setLoading] = uAS(true);

  uAE(() => {
    let cancelled = false;
    window.DreamAPI.getMeteo({ limit: 4 }).then(d => {
      if (cancelled) return;
      setMeteos(d?.meteos || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const latest = meteos[0];

  // Phrase principale poétique — privilégie un texte généré côté backend
  // (latest.poetic_phrase / latest.headline). Fallback : compose à partir
  // du top motif. Toujours en image, jamais en %.
  const poetic = latest?.poetic_phrase
    || latest?.headline
    || (latest?.top_motifs?.length
        ? composeMeteoPhrase(latest.top_motifs[0])
        : "Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes — d'eau qui se cherche un lit.");

  // Glyphe matter principal
  const mainMotif = latest?.top_motifs?.[0]?.motif
    || latest?.top_motifs?.[0]?.label
    || "eau";
  const matterKind = motifToMatter(mainMotif);

  // 3-5 nuages thématiques (en image)
  const clouds = composeClouds(latest);
  // Tournures qui montent (3-5 motifs en amplification)
  const tournures = composeTournures(latest);
  // Polarités vivantes
  const polarities = composePolarities(latest);
  // Initiations en cours
  const initiations = composeInitiations(latest);

  // Latence rituelle : matériel >= 14j d'âge
  const ageDays = latest?.computed_at
    ? Math.floor((Date.now() - new Date(latest.computed_at).getTime()) / (24 * 3600 * 1000))
    : null;

  return (
    <div className="stage screen-enter" style={{ background: "transparent", position: "relative" }}>
      <ChamberBackground intensity={0.7} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav showBack onBack={() => go("anima")} label="" />
        <div className="frame" style={{ paddingBottom: 120 }}>
          <div className="meta mb-s" style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            color: "var(--ash-light)", fontSize: 13,
            letterSpacing: "0.12em", textTransform: "lowercase",
          }}>
            anima mundi · chambre seconde
          </div>

          <h1 style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 32, lineHeight: 1.15,
            color: "var(--bone)",
            margin: "0 0 var(--s-5) 0",
            textWrap: "pretty",
            maxWidth: 580,
          }}>
            Le temps qu'il fait dans la nuit
          </h1>

          {/* Phrase principale poétique — H2, EB Garamond italic */}
          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 23, lineHeight: 1.5,
            color: "var(--bone)",
            maxWidth: 600, textWrap: "pretty",
            margin: "0 0 var(--s-6) 0",
            opacity: loading ? 0.4 : 1,
            transition: "opacity 920ms var(--ease-respire)",
          }}>
            {loading ? "la météo se compose…" : poetic}
          </p>

          {/* Glyphe / matter principal */}
          <div className="text-center mb-xl" style={{ marginTop: "var(--s-4)", marginBottom: "var(--s-6)" }}>
            <MatterGlyph kind={matterKind} />
            <div style={{
              marginTop: 14,
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 14, color: "var(--ash-light)",
              letterSpacing: "0.05em",
            }}>
              {mainMotif}
            </div>
          </div>

          <SectionRule label="nuages thématiques" />
          <div className="stack" style={{ gap: 20, marginBottom: "var(--s-6)" }}>
            {clouds.map((t, i) => (
              <p key={i} style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 18, lineHeight: 1.55,
                color: "var(--bone)",
                margin: 0, textWrap: "pretty",
                maxWidth: 600,
                opacity: 0.92,
              }}>{t}</p>
            ))}
          </div>

          <SectionRule label="tournures qui montent" />
          <div className="stack" style={{ gap: 16, marginBottom: "var(--s-6)" }}>
            {tournures.map((t, i) => (
              <p key={i} style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 17, lineHeight: 1.55,
                color: "var(--bone)",
                margin: 0, textWrap: "pretty",
                maxWidth: 600,
                opacity: 0.85,
              }}>{t}</p>
            ))}
          </div>

          {polarities.length > 0 && (
            <>
              <SectionRule label="polarités vivantes" />
              <div className="stack" style={{ gap: 14, marginBottom: "var(--s-6)" }}>
                {polarities.map((p, i) => (
                  <div key={i} style={{
                    fontFamily: "var(--serif)", fontStyle: "italic",
                    fontSize: 16.5, lineHeight: 1.5,
                    color: "var(--bone)", opacity: 0.85,
                    textWrap: "pretty", maxWidth: 600,
                  }}>
                    <span style={{ color: "var(--silk-gold)", opacity: 0.7 }}>↔</span>
                    {" "}
                    {p}
                  </div>
                ))}
              </div>
            </>
          )}

          {initiations.length > 0 && (
            <>
              <SectionRule label="initiations en cours" />
              <div className="stack" style={{ gap: 14, marginBottom: "var(--s-6)" }}>
                {initiations.map((p, i) => (
                  <p key={i} style={{
                    fontFamily: "var(--serif)", fontStyle: "italic",
                    fontSize: 17, lineHeight: 1.55,
                    color: "var(--bone)", opacity: 0.88,
                    textWrap: "pretty", maxWidth: 600, margin: 0,
                  }}>{p}</p>
                ))}
              </div>
            </>
          )}

          {/* Latence rituelle — toujours visible, sobre */}
          <div className="meta op-50" style={{
            fontFamily: "var(--mono)", fontSize: 11,
            letterSpacing: "0.05em",
            marginTop: "var(--s-6)",
            color: "var(--ash-light)",
          }}>
            {ageDays != null
              ? `recomposée il y a ${ageDays} jours · délai rituel ≥ 14 j`
              : "recomposée régulièrement · délai rituel ≥ 14 j"}
          </div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── Composers (fallback si backend ne génère pas encore les phrases) ──
function composeMeteoPhrase(topMotif) {
  const m = (topMotif?.motif || topMotif?.label || "eau").toLowerCase();
  const map = {
    eau: "Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes — d'eau qui se cherche un lit.",
    pierre: "Cette lune, beaucoup de pierres. Pierres qui retiennent, pierres qui marquent un seuil.",
    feu: "Cette lune, du feu qui couve plus qu'il ne brûle. Braises tenues, pas flammes hautes.",
    brume: "Cette lune, beaucoup de brume. Les contours se défont avant de se reposer ailleurs.",
    vent: "Cette lune, du vent qui passe sans presser. Il déplace ce qui pesait.",
    racine: "Cette lune, des racines qui descendent. Lentement, sans bruit, vers ce qui les nourrit.",
    porte: "Cette lune, beaucoup de portes. Certaines s'ouvrent, beaucoup attendent encore.",
    animal: "Cette lune, des animaux qui parlent doucement. Ils n'ont pas l'air pressés d'être compris.",
  };
  return map[m] || `Cette lune, le motif de la ${m} revient le plus — sans s'imposer.`;
}

function composeClouds(meteo) {
  // Si le backend renvoie des clouds générés, les utiliser. Sinon fallback.
  if (meteo?.clouds && Array.isArray(meteo.clouds) && meteo.clouds.length > 0) {
    return meteo.clouds.slice(0, 5);
  }
  // Fallback : 3 phrases en image qui tiennent le ton
  return [
    "Beaucoup de portes qui ne s'ouvrent pas tout de suite.",
    "Des animaux qui parlent doucement, sans urgence.",
    "Des défunts qui reviennent pour faire la cuisine.",
  ];
}

function composeTournures(meteo) {
  if (meteo?.tournures && Array.isArray(meteo.tournures) && meteo.tournures.length > 0) {
    return meteo.tournures.slice(0, 5);
  }
  return [
    "L'eau revient plus que le feu cette saison.",
    "Les paysages se font plus vastes ; les pièces fermées se font plus rares.",
    "Les figures grand-maternelles se rapprochent.",
  ];
}

function composePolarities(meteo) {
  if (meteo?.polarities && Array.isArray(meteo.polarities) && meteo.polarities.length > 0) {
    return meteo.polarities.slice(0, 4).map(p =>
      typeof p === "string" ? p : `${p.left || ""} et ${p.right || ""}`
    );
  }
  return [];
}

function composeInitiations(meteo) {
  if (meteo?.initiations && Array.isArray(meteo.initiations) && meteo.initiations.length > 0) {
    return meteo.initiations.slice(0, 3);
  }
  return [];
}

function motifToMatter(motif) {
  const m = (motif || "").toLowerCase();
  if (m.includes("eau") || m.includes("riv") || m.includes("mer")) return "eau";
  if (m.includes("feu") || m.includes("braise") || m.includes("flamme")) return "feu";
  if (m.includes("pierre") || m.includes("roche")) return "pierre";
  if (m.includes("brume") || m.includes("nuage") || m.includes("vapeur")) return "brume";
  if (m.includes("vent") || m.includes("souffle")) return "vent";
  if (m.includes("racine") || m.includes("arbre") || m.includes("forêt")) return "racine";
  return "eau";
}

const MatterGlyph = ({ kind = "eau" }) => {
  const common = {
    width: 90, height: 90, viewBox: "0 0 80 80",
    style: { opacity: 0.78 },
  };
  const stroke = "var(--stone-cool)";
  const sw = 0.7;
  switch (kind) {
    case "eau":
      return (
        <svg {...common}>
          <path d="M40 14 Q26 30 26 46 Q26 62 40 70 Q54 62 54 46 Q54 30 40 14 Z"
            fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M40 24 Q32 34 32 48 Q32 60 40 64"
            fill="none" stroke={stroke} strokeWidth={sw * 0.7} opacity="0.6" />
        </svg>
      );
    case "feu":
      return (
        <svg {...common}>
          <path d="M40 14 Q30 30 32 44 Q34 56 40 60 Q46 56 48 44 Q50 30 40 14 Z"
            fill="none" stroke="var(--ember-live)" strokeWidth={sw} opacity="0.9" />
          <path d="M40 28 Q36 38 38 48 Q40 56 40 56"
            fill="none" stroke="var(--ember-live)" strokeWidth={sw * 0.7} opacity="0.55" />
        </svg>
      );
    case "pierre":
      return (
        <svg {...common}>
          <path d="M22 50 Q22 32 40 30 Q58 32 58 50 Q58 60 50 64 L30 64 Q22 60 22 50 Z"
            fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M30 48 L36 42 L46 50 L52 44"
            fill="none" stroke={stroke} strokeWidth={sw * 0.6} opacity="0.55" />
        </svg>
      );
    case "brume":
      return (
        <svg {...common}>
          <path d="M16 30 Q28 26 40 30 T64 30" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.7" />
          <path d="M14 42 Q28 38 40 42 T66 42" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.6" />
          <path d="M18 54 Q30 50 42 54 T62 54" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.5" />
        </svg>
      );
    case "vent":
      return (
        <svg {...common}>
          <path d="M14 32 Q34 28 50 32 Q56 33 60 30" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.75" />
          <path d="M14 44 Q40 40 56 44 Q62 45 64 42" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.6" />
          <path d="M14 56 Q30 52 46 56 Q52 57 54 54" fill="none" stroke={stroke} strokeWidth={sw} opacity="0.45" />
        </svg>
      );
    case "racine":
      return (
        <svg {...common}>
          <path d="M40 14 L40 38" fill="none" stroke={stroke} strokeWidth={sw} />
          <path d="M40 38 Q34 46 28 56 M40 38 Q46 46 52 56 M40 38 L40 64 M28 56 Q24 60 20 66 M52 56 Q56 60 60 66"
            fill="none" stroke={stroke} strokeWidth={sw * 0.7} opacity="0.7" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="40" cy="40" r="22" fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
  }
};

const SectionRule = ({ label }) => (
  <div className="row" style={{
    alignItems: "center", gap: 14, marginBottom: 22,
  }}>
    <span style={{
      flex: "0 0 auto",
      fontFamily: "var(--mono)", fontSize: 10.5,
      color: "var(--ash-light)",
      letterSpacing: "0.18em", textTransform: "uppercase",
      opacity: 0.75,
    }}>{label}</span>
    <span style={{
      flex: 1, height: 1,
      background: "color-mix(in oklch, var(--ash-deep) 100%, transparent)",
      opacity: 0.5,
    }} />
  </div>
);

// ──────────────────────────────────────────────────────────────
// CHAMBRE 3 — Tenu ensemble (Annales Big Dreams collectifs)
// ──────────────────────────────────────────────────────────────
const AnimaAnnalesScreen = ({ go }) => {
  const [corpus, setCorpus] = uAS([]);
  const [loading, setLoading] = uAS(true);
  const [tenuById, setTenuById] = uAS({}); // user-side tenu state

  // Seed pour mode démo / early days
  const seed = uAM(() => ([
    { id: "seed-1", text: "Une grand-mère inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom.", hold_count: 280, shared_at: null },
    { id: "seed-2", text: "Un enfant-animal que j'ai oublié de nourrir depuis des années sort du placard vivant. Pas en colère. Simplement vivant.", hold_count: 410, shared_at: null },
    { id: "seed-3", text: "Je traverse un pont qu'on n'a pas fini de construire. Il se construit sous mes pieds — mais seulement si je continue.", hold_count: 180, shared_at: null },
    { id: "seed-4", text: "Une baleine remonte dans une rivière asséchée, suivie par des gens qui tiennent des seaux d'eau, un à la fois.", hold_count: 530, shared_at: null },
  ]), []);

  uAE(() => {
    let cancelled = false;
    window.DreamAPI.getAnnales().then(d => {
      if (cancelled) return;
      const live = (d?.circulating || []).map(a => ({
        id: a.id,
        text: a.curated_text,
        hold_count: a.hold_count || 0,
        shared_at: a.shared_at,
      }));
      setCorpus(live.length > 0 ? live : seed);
      setLoading(false);
    }).catch(() => {
      setCorpus(seed);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [seed]);

  // Ordre rotatif aléatoire — anti-classement (seed = jour de l'année,
  // pour stabilité dans la session mais rotation lente)
  const display = uAM(() => {
    const today = new Date();
    const seedDay = today.getFullYear() * 1000 + Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (24 * 3600 * 1000)
    );
    return shuffleSeeded(corpus, seedDay);
  }, [corpus]);

  const tenir = async (id) => {
    if (tenuById[id]) return; // pas d'undo nécessaire — silencieux
    setTenuById(t => ({ ...t, [id]: true }));
    try { await window.DreamAPI.tenirAnnale(id); } catch {}
  };

  return (
    <div className="stage screen-enter" style={{ background: "transparent", position: "relative" }}>
      <ChamberBackground intensity={0.6} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav showBack onBack={() => go("anima")} label="" />
        <div className="frame" style={{ paddingBottom: 120 }}>
          <div className="meta mb-s" style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            color: "var(--ash-light)", fontSize: 13,
            letterSpacing: "0.12em", textTransform: "lowercase",
          }}>
            anima mundi · chambre troisième
          </div>

          <h1 style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 32, lineHeight: 1.15,
            color: "var(--bone)",
            margin: "0 0 var(--s-4) 0",
            textWrap: "pretty",
          }}>
            Tenu ensemble
          </h1>

          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 17, lineHeight: 1.55,
            color: "var(--ash-light)",
            maxWidth: 580, textWrap: "pretty",
            margin: "0 0 var(--s-6) 0",
          }}>
            Ces rêves ont été offerts à la voûte commune. Nous les tenons —
            non pour les comprendre, mais parce qu'ils nous regardent.
          </p>

          {loading && corpus.length === 0 ? (
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              color: "var(--ash-light)", opacity: 0.6,
              padding: "var(--s-5) 0",
            }}>
              les annales se rassemblent…
            </div>
          ) : (
            <div className="stack" style={{ gap: 32 }}>
              {display.map(d => (
                <AnnaleCard key={d.id}
                  annale={d}
                  tenu={!!tenuById[d.id]}
                  onTenir={() => tenir(d.id)}
                />
              ))}
            </div>
          )}

          {/* Garde-fous anti-popularity contest — tenue silencieuse en bas */}
          <div className="meta op-50" style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            color: "var(--ash-light)",
            marginTop: "var(--s-6)", maxWidth: 600,
            textWrap: "pretty",
            fontSize: 14, lineHeight: 1.55,
          }}>
            Tenir n'est pas voter. Aucun classement. L'ordre change à chaque lune.
            Tu peux retirer un rêve que tu as offert, à tout moment — il s'efface en silence.
          </div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}

      <style>{`
        .anima-annale-card {
          padding: 32px 28px;
          background:
            linear-gradient(180deg,
              color-mix(in oklch, var(--paper-warm) 8%, var(--night-warm)) 0%,
              color-mix(in oklch, var(--obsidian) 60%, var(--night-floor)) 100%);
          border: 1px solid color-mix(in oklch, var(--paper-warm) 14%, var(--ash-deep));
          position: relative; overflow: hidden;
        }
        .anima-annale-card::before {
          content: ""; position: absolute; inset: 0;
          background-image: url('#noise-paper');
          opacity: 0.18;
          pointer-events: none;
        }
        .anima-tenir {
          background: transparent; border: none;
          color: var(--ash-light);
          font-family: var(--serif); font-style: italic;
          font-size: 22px; line-height: 1;
          cursor: pointer; padding: 6px 10px;
          transition: color 920ms var(--ease-respire),
                      transform 380ms var(--ease-respire),
                      text-shadow 920ms var(--ease-respire);
        }
        .anima-tenir:hover { color: var(--bone); }
        .anima-tenir.tenu {
          color: var(--silk-gold);
          text-shadow: 0 0 12px color-mix(in oklch, var(--silk-gold) 40%, transparent);
        }
      `}</style>
    </div>
  );
};

const AnnaleCard = ({ annale, tenu, onTenir }) => {
  const heldRound = holdRounded(annale.hold_count);
  return (
    <article className="anima-annale-card">
      <div style={{ position: "relative", zIndex: 1 }}>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 22, lineHeight: 1.5,
          color: "var(--bone)",
          margin: 0, textAlign: "center",
          textWrap: "pretty",
          padding: "0 8px",
        }}>
          {annale.text}
        </p>

        <div className="row" style={{
          justifyContent: "space-between", alignItems: "center",
          marginTop: 28,
          paddingTop: 18,
          borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 70%, transparent)",
          flexWrap: "wrap", gap: 14,
        }}>
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 14, color: "var(--ash-light)",
            opacity: 0.85,
          }}>
            {heldRound > 0 ? <>tenu par ~{frNumber(heldRound)}</> : <>en circulation</>}
          </div>
          <button
            className={"anima-tenir " + (tenu ? "tenu" : "")}
            onClick={onTenir}
            aria-label={tenu ? "tu tiens ce rêve" : "tenir ce rêve"}
            title={tenu ? "tu le tiens" : "tenir"}>
            {tenu ? "✦" : "✧"}
          </button>
        </div>
      </div>
    </article>
  );
};

// ──────────────────────────────────────────────────────────────
// CHAMBRE 4 — Polyphonie de la lune
// ──────────────────────────────────────────────────────────────
const AnimaPolyphonieScreen = ({ go }) => {
  const [polyphonies, setPolyphonies] = uAS([]);
  const [archive, setArchive] = uAS([]);
  const [showArchive, setShowArchive] = uAS(false);
  const [activeIdx, setActiveIdx] = uAS(0);
  const [loading, setLoading] = uAS(true);

  uAE(() => {
    let cancelled = false;
    Promise.all([
      window.DreamAPI.getPolyphonie({ limit: 1 }),
      window.DreamAPI.getPolyphonieArchive
        ? window.DreamAPI.getPolyphonieArchive()
        : Promise.resolve({ polyphonies: [] }),
    ]).then(([latestData, archiveData]) => {
      if (cancelled) return;
      setPolyphonies(latestData?.polyphonies || []);
      setArchive(archiveData?.polyphonies || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  // Pool : current + archive (current en index 0)
  const pool = uAM(() => {
    const current = polyphonies[0];
    const map = new Map();
    if (current) map.set(current.id, current);
    archive.forEach(p => { if (!map.has(p.id)) map.set(p.id, p); });
    return Array.from(map.values());
  }, [polyphonies, archive]);

  const active = pool[activeIdx] || polyphonies[0] || null;
  const lunarLabel = active?.lunar_phase || "lecture longue";
  const voices = active?.voices_mobilisees || [];

  // Date label (mois année) pour l'archive
  const fmtMonth = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };

  // Texte fallback (mode démo) — pas de bullets, pas d'emoji
  const fallback = `Plusieurs ont rêvé d'eau cette lune. Pas de tempêtes — d'eau qui se cherche un lit, d'estuaires qui se forment. Et plusieurs ont écrit des doutes sur leur travail, sur ce qu'il faut tenir et ce qu'il faut lâcher.

À la lumière de Bachelard, on pourrait entendre dans ces eaux cherchant leur lit la même chose que dans ces questions de seuil : une fluidité qui demande à se poser quelque part, sans encore savoir où. L'eau, ici, n'est pas celle qui noie. C'est celle qui hésite avant de prendre sa forme.

Aizenstat aurait invité à tenir la grand-mère qui revient — plusieurs l'ont vue cette lune, dans des cuisines sans feu, avec du linge à laver. Elle n'est pas figure de passé. Elle est figure qui travaille quelque chose qui n'a pas encore de nom dans la vie de jour.

Et Moss, on l'imagine dire : les ponts inachevés qui reviennent en synchronicité ne demandent peut-être pas à être finis. Ils demandent à être regardés, depuis les deux rives à la fois.

Que se cherche-t-elle, l'eau qui cherche son lit ?`;

  const text = active?.narrative_text || fallback;
  const paragraphs = text.split(/\n\n+/).filter(Boolean);

  return (
    <div className="stage screen-enter" style={{ background: "transparent", position: "relative" }}>
      <ChamberBackground intensity={0.55} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav showBack onBack={() => go("anima")} label="" />
        <div className="frame" style={{ paddingBottom: 120, maxWidth: 680 }}>
          <div className="meta mb-s" style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            color: "var(--ash-light)", fontSize: 13,
            letterSpacing: "0.12em", textTransform: "lowercase",
          }}>
            anima mundi · chambre quatrième
          </div>

          <h1 style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 32, lineHeight: 1.15,
            color: "var(--bone)",
            margin: "0 0 var(--s-3) 0",
            textWrap: "pretty",
          }}>
            Polyphonie de la lune
          </h1>

          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 14, color: "var(--ash-light)",
            marginBottom: "var(--s-6)",
            opacity: 0.85,
          }}>
            {activeIdx === 0 ? <>· {lunarLabel}</> : <>· lecture précédente · {fmtMonth(active?.period_end)}</>}
          </div>

          {/* Texte fluide, EB Garamond, pas de bullets, pas de titres internes */}
          <div style={{
            fontFamily: "var(--serif)",
            fontSize: 19, lineHeight: 1.75,
            color: "var(--bone)",
            maxWidth: 600,
            textAlign: "justify",
            textWrap: "pretty",
          }}>
            {loading ? (
              window.PolyphonieLetterSkeleton
                ? <window.PolyphonieLetterSkeleton />
                : <p style={{ fontStyle: "italic", opacity: 0.5 }}>la polyphonie s'écrit…</p>
            ) : (
              paragraphs.map((para, i) => (
                <p key={i} style={{
                  margin: "0 0 1.4em 0",
                  textWrap: "pretty",
                }}>{para}</p>
              ))
            )}
          </div>

          {/* Voix mobilisées — signature discrète bas */}
          <div style={{
            marginTop: "var(--s-6)",
            paddingTop: "var(--s-4)",
            borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 13, color: "var(--ash-light)",
            opacity: 0.85,
            textWrap: "pretty",
          }}>
            voix mobilisées cette lune ·{" "}
            {voices.length > 0
              ? voices.join(", ")
              : "Aizenstat, Moss, Bachelard"}
          </div>

          {/* Bouton lectures précédentes */}
          {pool.length > 1 && (
            <div style={{ marginTop: "var(--s-6)" }}>
              <button
                onClick={() => setShowArchive(s => !s)}
                style={{
                  background: "transparent", border: "none",
                  color: "var(--ash-light)",
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 14.5, cursor: "pointer",
                  padding: "8px 0",
                  letterSpacing: "0.02em",
                  textDecoration: "underline",
                  textDecorationColor: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
                  textUnderlineOffset: 6,
                }}>
                {showArchive ? "refermer les lectures précédentes" : "lectures précédentes"}
              </button>

              {showArchive && (
                <div className="stack" style={{ gap: 6, marginTop: "var(--s-4)" }}>
                  {pool.map((p, i) => (
                    <button key={p.id || i}
                      onClick={() => { setActiveIdx(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      style={{
                        background: i === activeIdx
                          ? "color-mix(in oklch, var(--silk-gold) 8%, transparent)"
                          : "transparent",
                        border: "1px solid " + (i === activeIdx
                          ? "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))"
                          : "var(--ash-deep)"),
                        color: i === activeIdx ? "var(--bone)" : "var(--ash-light)",
                        fontFamily: "var(--serif)", fontStyle: "italic",
                        fontSize: 15,
                        padding: "10px 14px",
                        textAlign: "left", cursor: "pointer",
                        transition: "all 380ms var(--ease-respire)",
                      }}>
                      {i === 0 ? "lune actuelle" : (p.lunar_phase || fmtMonth(p.period_end) || "lecture précédente")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// Compatibilité héritage : OffreKairosSheet / OffreKairosScreen
// (préservés depuis l'ancien screens-anima.jsx — utilisés par capture flow)
// ──────────────────────────────────────────────────────────────
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
              Certains rêves semblent appartenir au-delà de nous. Les offrir à la voûte commune,
              c'est permettre qu'ils soient tenus par des inconnues, dans d'autres régions, d'autres lunes.
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
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ──────────────────────────────────────────────────────────────
// 2026-04-26 — REFONTE B+D §11.bis.5
// AnimaUnifiedScreen : 1 SEULE entrée scrollable, 4 sections cascade
// (Voûte / Météo / Annales / Polyphonie). Plus de sub-routes user.
//
// scrollToSection : si on arrive avec un hash de section
// (anima-meteo / anima-annales / anima-polyphonie), on scroll auto
// vers la section correspondante après mount.
// ──────────────────────────────────────────────────────────────
const ANIMA_SECTION_IDS = {
  voute: "anima-section-voute",
  meteo: "anima-section-meteo",
  annales: "anima-section-annales",
  polyphonie: "anima-section-polyphonie",
};

const AnimaSectionDivider = ({ label }) => (
  <div style={{
    margin: "var(--s-7) auto var(--s-6)",
    maxWidth: 600,
    display: "flex", alignItems: "center", gap: 16,
  }}>
    <span style={{
      flex: 1, height: 1,
      background: "color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
      opacity: 0.45,
    }} />
    <span style={{
      flex: "0 0 auto",
      fontFamily: "var(--mono)", fontSize: 10.5,
      color: "var(--ash-light)",
      letterSpacing: "0.22em", textTransform: "uppercase",
      opacity: 0.6,
    }}>{label}</span>
    <span style={{
      flex: 1, height: 1,
      background: "color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
      opacity: 0.45,
    }} />
  </div>
);

const AnimaUnifiedScreen = ({ go, scrollToSection = null }) => {
  // Données (fetch en parallèle) ──
  const [voute, setVoute] = uAS(null);
  const [vouteLoading, setVouteLoading] = uAS(true);
  const [meteos, setMeteos] = uAS([]);
  const [meteoLoading, setMeteoLoading] = uAS(true);
  const [corpus, setCorpus] = uAS([]);
  const [annalesLoading, setAnnalesLoading] = uAS(true);
  const [tenuById, setTenuById] = uAS({});
  const [polyphonies, setPolyphonies] = uAS([]);
  const [archive, setArchive] = uAS([]);
  const [polyLoading, setPolyLoading] = uAS(true);
  const [showArchive, setShowArchive] = uAS(false);
  const [polyActiveIdx, setPolyActiveIdx] = uAS(0);

  // Seed annales pour mode démo
  const seedAnnales = uAM(() => ([
    { id: "seed-1", text: "Une grand-mère inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom.", hold_count: 280, shared_at: null },
    { id: "seed-2", text: "Un enfant-animal que j'ai oublié de nourrir depuis des années sort du placard vivant. Pas en colère. Simplement vivant.", hold_count: 410, shared_at: null },
    { id: "seed-3", text: "Je traverse un pont qu'on n'a pas fini de construire. Il se construit sous mes pieds — mais seulement si je continue.", hold_count: 180, shared_at: null },
  ]), []);

  // Fetch toutes les sections en parallèle au mount
  uAE(() => {
    let cancelled = false;
    Promise.all([
      window.DreamAPI.getVoute().catch(() => null),
      window.DreamAPI.getMeteo({ limit: 4 }).catch(() => null),
      window.DreamAPI.getAnnales().catch(() => null),
      window.DreamAPI.getPolyphonie({ limit: 1 }).catch(() => null),
      window.DreamAPI.getPolyphonieArchive ? window.DreamAPI.getPolyphonieArchive().catch(() => null) : Promise.resolve(null),
    ]).then(([vData, mData, aData, pData, paData]) => {
      if (cancelled) return;
      setVoute(vData); setVouteLoading(false);
      setMeteos(mData?.meteos || []); setMeteoLoading(false);
      const live = (aData?.circulating || []).map(a => ({
        id: a.id, text: a.curated_text, hold_count: a.hold_count || 0, shared_at: a.shared_at,
      }));
      setCorpus(live.length > 0 ? live : seedAnnales);
      setAnnalesLoading(false);
      setPolyphonies(pData?.polyphonies || []);
      setArchive(paData?.polyphonies || []);
      setPolyLoading(false);
    });
    return () => { cancelled = true; };
  }, [seedAnnales]);

  // Scroll vers section spécifique (compat legacy routes anima-meteo etc.)
  uAE(() => {
    if (!scrollToSection) return;
    const id = ANIMA_SECTION_IDS[scrollToSection];
    if (!id) return;
    // Délai pour laisser les sections se rendre
    setTimeout(() => {
      try {
        const el = document.getElementById(id);
        if (el && typeof el.scrollIntoView === "function") {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } catch {}
    }, 600);
  }, [scrollToSection]);

  // ── Voûte ──
  const rawCount = voute?.meteo?.k_count || voute?.meteo_optin_count || null;
  const humaneCount = roundHumane(rawCount);
  const density = uAM(() => {
    if (!rawCount || rawCount < 50) return 60;
    return Math.min(140, 50 + Math.round(rawCount / 600));
  }, [rawCount]);

  // ── Météo ──
  const latestMeteo = meteos[0];
  const poetic = latestMeteo?.poetic_phrase
    || latestMeteo?.headline
    || (latestMeteo?.top_motifs?.length
        ? composeMeteoPhrase(latestMeteo.top_motifs[0])
        : "Cette lune, l'humanité a rêvé d'eau. Pas de tempêtes — d'eau qui se cherche un lit.");
  const mainMotif = latestMeteo?.top_motifs?.[0]?.motif
    || latestMeteo?.top_motifs?.[0]?.label
    || "eau";
  const matterKind = motifToMatter(mainMotif);
  const clouds = composeClouds(latestMeteo);

  // ── Annales ──
  const displayAnnales = uAM(() => {
    const today = new Date();
    const seedDay = today.getFullYear() * 1000 + Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (24 * 3600 * 1000)
    );
    return shuffleSeeded(corpus, seedDay).slice(0, 5);
  }, [corpus]);
  const tenir = async (id) => {
    if (tenuById[id]) return;
    setTenuById(t => ({ ...t, [id]: true }));
    try { await window.DreamAPI.tenirAnnale(id); } catch {}
  };

  // ── Polyphonie ──
  const polyPool = uAM(() => {
    const current = polyphonies[0];
    const map = new Map();
    if (current) map.set(current.id, current);
    archive.forEach(p => { if (!map.has(p.id)) map.set(p.id, p); });
    return Array.from(map.values());
  }, [polyphonies, archive]);
  const polyActive = polyPool[polyActiveIdx] || polyphonies[0] || null;
  const lunarLabel = polyActive?.lunar_phase || "lecture longue";
  const voices = polyActive?.voices_mobilisees || [];
  const fmtMonth = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
  };
  const polyFallback = `Plusieurs ont rêvé d'eau cette lune. Pas de tempêtes — d'eau qui se cherche un lit, d'estuaires qui se forment. Et plusieurs ont écrit des doutes sur leur travail, sur ce qu'il faut tenir et ce qu'il faut lâcher.

À la lumière de Bachelard, on pourrait entendre dans ces eaux cherchant leur lit la même chose que dans ces questions de seuil : une fluidité qui demande à se poser quelque part, sans encore savoir où.

Aizenstat aurait invité à tenir la grand-mère qui revient — plusieurs l'ont vue cette lune, dans des cuisines sans feu, avec du linge à laver.

Que se cherche-t-elle, l'eau qui cherche son lit ?`;
  const polyText = polyActive?.narrative_text || polyFallback;
  const polyParagraphs = polyText.split(/\n\n+/).filter(Boolean);

  return (
    <div className="stage screen-enter" style={{ background: "transparent", position: "relative" }}>
      <ChamberBackground intensity={0.85} />

      {/* 2026-04-29 — HaloRespire silk géant (Yeshua, voûte top, 90vw, opacity 0.4) */}
      {window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: "absolute", top: 30, left: "50%",
          transform: "translateX(-50%)",
          width: "90vw", maxWidth: 800, height: 360,
          opacity: 0.40, pointerEvents: "none", zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}

      {/* 2026-04-29 — Songlines drift en background (Yeshua, opacity 0.12, 12s drift) */}
      {window.GeoSymbol && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          opacity: 0.12, pointerEvents: "none", zIndex: 0,
          animation: "drift-derive 12s linear infinite alternate",
        }}>
          <window.GeoSymbol kind="songlines" color="silk"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 }} />
        </div>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        <window.TopNav />
        <div className="frame" style={{ paddingBottom: 140, maxWidth: 720, margin: "0 auto" }}>

          {/* ── SECTION 1 · VOÛTE ─────────────────────────────── */}
          <section id={ANIMA_SECTION_IDS.voute}>
            <div className="text-center" style={{
              marginTop: "var(--s-4)", marginBottom: "var(--s-4)",
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 15.5, color: "var(--ash-light)",
              letterSpacing: "0.01em", textWrap: "pretty",
              opacity: vouteLoading ? 0 : 0.9,
              transition: "opacity 1200ms var(--ease-respire)",
            }}>
              {humaneCount
                ? <>Cette lune, l'humanité a tissé environ {frNumber(humaneCount)} moments.</>
                : <>Cette lune, des voix se rassemblent dans la nuit.</>}
            </div>

            <ConstellationBreathing density={density} />

            <div className="text-center" style={{
              marginTop: "var(--s-3)",
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 13, color: "var(--ash-light)",
              letterSpacing: "0.18em", textTransform: "lowercase",
              opacity: 0.55,
            }}>
              anima mundi
            </div>
          </section>

          {/* ── SECTION 2 · MÉTÉO ─────────────────────────────── */}
          <AnimaSectionDivider label="météo" />
          <section id={ANIMA_SECTION_IDS.meteo}>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 22, lineHeight: 1.55,
              color: "var(--bone)",
              maxWidth: 600, textWrap: "pretty",
              margin: "0 0 var(--s-5) 0",
              opacity: meteoLoading ? 0.4 : 1,
              transition: "opacity 920ms var(--ease-respire)",
            }}>
              {meteoLoading ? "la météo se compose…" : poetic}
            </p>

            <div className="text-center" style={{ marginBottom: "var(--s-5)" }}>
              <MatterGlyph kind={matterKind} />
              <div style={{
                marginTop: 12,
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 13, color: "var(--ash-light)",
                letterSpacing: "0.05em",
              }}>
                {mainMotif}
              </div>
            </div>

            <div className="stack" style={{ gap: 18 }}>
              {clouds.slice(0, 5).map((t, i) => (
                <p key={i} style={{
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 17, lineHeight: 1.55,
                  color: "var(--bone)",
                  margin: 0, textWrap: "pretty",
                  maxWidth: 600,
                  opacity: 0.9,
                }}>{t}</p>
              ))}
            </div>
          </section>

          {/* ── SECTION 3 · ANNALES ───────────────────────────── */}
          <AnimaSectionDivider label="tenu ensemble" />
          <section id={ANIMA_SECTION_IDS.annales}>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 16, lineHeight: 1.55,
              color: "var(--ash-light)",
              maxWidth: 580, textWrap: "pretty",
              margin: "0 0 var(--s-5) 0",
            }}>
              Ces rêves ont été offerts à la voûte commune. Nous les tenons —
              non pour les comprendre, mais parce qu'ils nous regardent.
            </p>

            {annalesLoading && corpus.length === 0 ? (
              <div style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                color: "var(--ash-light)", opacity: 0.6,
                padding: "var(--s-5) 0",
              }}>
                les annales se rassemblent…
              </div>
            ) : (
              <div className="stack" style={{ gap: 24 }}>
                {displayAnnales.map(d => (
                  <AnnaleCard key={d.id}
                    annale={d}
                    tenu={!!tenuById[d.id]}
                    onTenir={() => tenir(d.id)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── SECTION 4 · POLYPHONIE ────────────────────────── */}
          <AnimaSectionDivider label="polyphonie de la lune" />
          <section id={ANIMA_SECTION_IDS.polyphonie}>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 13, color: "var(--ash-light)",
              marginBottom: "var(--s-4)",
              opacity: 0.85,
            }}>
              {polyActiveIdx === 0 ? <>· {lunarLabel}</> : <>· lecture précédente · {fmtMonth(polyActive?.period_end)}</>}
            </div>

            <div style={{
              fontFamily: "var(--serif)",
              fontSize: 18, lineHeight: 1.75,
              color: "var(--bone)",
              maxWidth: 600,
              textAlign: "justify",
              textWrap: "pretty",
            }}>
              {polyLoading ? (
                window.PolyphonieLetterSkeleton
                  ? <window.PolyphonieLetterSkeleton />
                  : <p style={{ fontStyle: "italic", opacity: 0.5 }}>la polyphonie s'écrit…</p>
              ) : (
                polyParagraphs.map((para, i) => (
                  <p key={i} style={{ margin: "0 0 1.4em 0", textWrap: "pretty" }}>{para}</p>
                ))
              )}
            </div>

            <div style={{
              marginTop: "var(--s-5)", paddingTop: "var(--s-3)",
              borderTop: "1px solid color-mix(in oklch, var(--ash-deep) 60%, transparent)",
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 13, color: "var(--ash-light)",
              opacity: 0.85, textWrap: "pretty",
            }}>
              voix mobilisées cette lune ·{" "}
              {voices.length > 0 ? voices.join(", ") : "Aizenstat, Moss, Bachelard"}
            </div>

            {polyPool.length > 1 && (
              <div style={{ marginTop: "var(--s-5)" }}>
                <button
                  onClick={() => setShowArchive(s => !s)}
                  style={{
                    background: "transparent", border: "none",
                    color: "var(--ash-light)",
                    fontFamily: "var(--serif)", fontStyle: "italic",
                    fontSize: 14, cursor: "pointer",
                    padding: "8px 0",
                    letterSpacing: "0.02em",
                    textDecoration: "underline",
                    textDecorationColor: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
                    textUnderlineOffset: 6,
                  }}>
                  {showArchive ? "refermer les lectures précédentes" : "lectures précédentes"}
                </button>

                {showArchive && (
                  <div className="stack" style={{ gap: 6, marginTop: "var(--s-4)" }}>
                    {polyPool.map((p, i) => (
                      <button key={p.id || i}
                        onClick={() => { setPolyActiveIdx(i); }}
                        style={{
                          background: i === polyActiveIdx
                            ? "color-mix(in oklch, var(--silk-gold) 8%, transparent)"
                            : "transparent",
                          border: "1px solid " + (i === polyActiveIdx
                            ? "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))"
                            : "var(--ash-deep)"),
                          color: i === polyActiveIdx ? "var(--bone)" : "var(--ash-light)",
                          fontFamily: "var(--serif)", fontStyle: "italic",
                          fontSize: 14,
                          padding: "10px 14px",
                          textAlign: "left", cursor: "pointer",
                          transition: "all 380ms var(--ease-respire)",
                        }}>
                        {i === 0 ? "lune actuelle" : (p.lunar_phase || fmtMonth(p.period_end) || "lecture précédente")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>

        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── 2026-04-27 — Sprint P0.5 (Design §11.bis.19) ─────────────
// PolyphonieLetterSkeleton : 12-15 lignes EB Garamond justify shimmer
// + LoadingHalo + message rotating "la polyphonie s'écrit…".
function PolyphonieLetterSkeleton() {
  const Shim = window.SkeletonShimmer;
  const Halo = window.LoadingHalo;
  const useRotating = window.useRotatingMessage;
  const messages = [
    "la polyphonie s'écrit…",
    "les voix se cherchent…",
    "tisser la lune…",
  ];
  const message = useRotating ? useRotating(messages, 2400) : messages[0];

  if (!Shim || !Halo) {
    return <p style={{ fontStyle: "italic", opacity: 0.5 }}>{message}</p>;
  }

  return (
    <div className="dream-skeleton-fade-in" style={{
      display: "flex", flexDirection: "column", gap: 18,
    }}>
      {/* 3 paragraphes simulés, 4-5 lignes chacun, justify */}
      {[5, 4, 4].map((lines, p) => (
        <Shim key={p} lines={lines} height={13} gap={11} dark={true} lastLineWidth={p === 2 ? "45%" : "82%"} />
      ))}
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 8 }}>
        <Halo size={26} message={message} dark={true} />
      </div>
    </div>
  );
}
window.PolyphonieLetterSkeleton = PolyphonieLetterSkeleton;

// ── Compat alias ─────────────────────────────────────────────
// AnnalesScreen reste exposé pour ne pas casser des liens existants
// (route legacy `annales` continue à pointer vers la chambre 3).
const AnnalesScreen = AnimaAnnalesScreen;

Object.assign(window, {
  // 4 chambres canoniques (gardées pour compat / fallback)
  AnimaVouteScreen,
  AnimaMeteoScreen,
  AnimaAnnalesScreen,
  AnimaPolyphonieScreen,
  // 2026-04-26 — B+D : 1 écran scrollable cascade (Design §11.bis.5)
  AnimaUnifiedScreen,
  // legacy / compat
  AnnalesScreen,
  OffreKairosScreen,
  OffreKairosSheet,
});
