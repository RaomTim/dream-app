/* global React */
// ──────────────────────────────────────────────────────────────
// Dream — V1.2 amplification · Vague 4 (finale)
// 8 surfaces : Onboarding P-Zéro, Oracle du Corps, Notifications,
// Privacy, Abonnement (≈feedback meta), Offre au Kairos, Modal V1.2,
// Constellation générique wrapper.
//
// Chargé après screens-v12-vague3.jsx, avant app.jsx.
// ──────────────────────────────────────────────────────────────

const { useState: v4S, useEffect: v4E, useRef: v4R } = React;

// ══════════════════════════════════════════════════════════════
// 1. ONBOARDING P-ZÉRO — matter ember (braise d'accueil) +
//    souffle au passage de chaque étape + Wow0 à la première entrée
// ══════════════════════════════════════════════════════════════
const OnboardingV12 = ({ go }) => {
  const Original = window.__OnboardingOriginal;
  if (!Original) return null;
  const [stepKey, setStepKey] = v4S(0);

  // Wow0 — première fois qu'on rentre dans onboarding (P-Zéro).
  // Désormais via wowRegistry.fire("first-launch") (cohérence registry, idempotent).
  // Compat : si l'ancienne clé localStorage "dream:wow0:fired" existe, on respecte (pas de re-fire).
  v4E(() => {
    if (!window.wowRegistry) return;
    try {
      const legacy = localStorage.getItem("dream:wow0:fired");
      if (legacy && !window.wowRegistry.has("first-launch")) {
        // migration silencieuse : marque first-launch comme déjà fired
        const s = JSON.parse(localStorage.getItem("dream:wow-fired") || "{}");
        s["first-launch"] = Date.now();
        localStorage.setItem("dream:wow-fired", JSON.stringify(s));
        return;
      }
    } catch {}
    const fired = window.wowRegistry.fire("first-launch");
    if (fired && window.playRitual) window.playRitual("seuil");
  }, []);

  // Détecte les changements de step pour rejouer un souffle subtil
  v4E(() => {
    if (stepKey > 0 && window.playRitual) window.playRitual("souffle");
  }, [stepKey]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* matter ember — la braise qui accueille, très douce */}
      <window.Surface matter="ember" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.45, pointerEvents: "none",
      }} />
      {/* halo silk doux derrière la zone centrale */}
      <div style={{
        position: "absolute", top: "20%", left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 500, pointerEvents: "none", zIndex: 1, opacity: 0.4,
      }}>
        <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
      </div>
      {/* géosymbole spirale très subtil en bas — le commencement */}
      <div style={{
        position: "absolute", bottom: -150, right: -100,
        width: 450, height: 450, opacity: 0.07, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="spirale" color="silk" />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}
        onClick={() => setStepKey(k => k + 1)}>
        <Original go={go} />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 2. ORACLE DU CORPS — matter earth + halo earth respirant +
//    cercles concentriques autour de la silhouette + felt-shift gates
// ══════════════════════════════════════════════════════════════
const OracleCorpsV12 = ({ go }) => {
  const Original = window.__OracleCorpsOriginal;
  if (!Original) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* matter earth — l'enracinement somatique */}
      <window.Surface matter="earth" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none",
      }} />
      {/* cercles concentriques derrière la silhouette — les couches du corps */}
      <div style={{
        position: "absolute", top: 200, left: 40,
        width: 380, height: 380, opacity: 0.08, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="cercle-concentrique" color="silk" />
      </div>
      {/* halo earth respirant centré sur le corps */}
      <div style={{
        position: "absolute", top: 250, left: 60,
        width: 400, height: 500, pointerEvents: "none", zIndex: 1, opacity: 0.45,
      }}>
        <window.HaloRespire kind="earth" style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
      {/* style additionnel pour les zones — pulsation discrète à l'hover */}
      <style>{`
        .oracle-zone {
          fill: color-mix(in oklch, var(--clay-earth) 35%, transparent);
          stroke: color-mix(in oklch, var(--clay-earth) 70%, transparent);
          stroke-width: 0.6;
          cursor: pointer;
          transition: fill var(--respire) var(--ease-respire),
                      stroke var(--respire) var(--ease-respire);
        }
        .oracle-zone:hover {
          fill: color-mix(in oklch, var(--silk-gold) 22%, transparent);
          stroke: var(--silk-gold);
        }
        .oracle-zone.active {
          fill: color-mix(in oklch, var(--silk-gold) 30%, transparent);
          stroke: var(--silk-gold);
          stroke-width: 0.9;
          animation: oraclePulse 6s var(--ease-respire) infinite;
        }
        @keyframes oraclePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 3. NOTIFICATIONS — matter linen + chuchotements en serif italique
//    + suppression définitive des "alertes" comme tonalité
// ══════════════════════════════════════════════════════════════
const NotifsV12 = ({ go }) => {
  const Original = window.__NotifsOriginal;
  if (!Original) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <window.Surface matter="linen" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none",
      }} />
      {/* demi-cercle aurore très subtil en haut — les phases qui s'ouvrent */}
      <div style={{
        position: "absolute", top: 70, left: 0, right: 0, height: 180,
        zIndex: 1, pointerEvents: "none", opacity: 0.3,
      }}>
        <window.GeoSymbol kind="demi-cercle" />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
      {/* override : tout label "notification" devient "chuchotement" en serif */}
      <style>{`
        .stage label, .stage .meta {
          font-family: var(--serif);
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 4. PRIVACY — matter bone (vélin clair) + sobriété cryptographique
//    + spirale subtile pour rappeler que la mémoire est gardée, pas archivée
// ══════════════════════════════════════════════════════════════
const PrivacyV12 = ({ go }) => {
  const Original = window.__PrivacyOriginal;
  if (!Original) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <window.Surface matter="bone" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.5, pointerEvents: "none",
      }} />
      {/* spirale lente, signature de la mémoire vivante */}
      <div style={{
        position: "absolute", top: 200, right: -60,
        width: 320, height: 320, opacity: 0.08, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="spirale" color="silk" />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 5. ABONNEMENT — matter paper (l'engagement écrit) + voix sobre
//     pas de "premium", pas d'urgence, juste une offre tenue
// ══════════════════════════════════════════════════════════════
const AbonnementV12 = ({ go }) => {
  const Original = window.__AbonnementOriginal;
  if (!Original) return null;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <window.Surface matter="paper" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.55, pointerEvents: "none",
      }} />
      {/* halo silk discret, l'offre a une présence rituelle */}
      <div style={{
        position: "absolute", top: 280, left: "50%",
        transform: "translateX(-50%)",
        width: 600, height: 500, pointerEvents: "none", zIndex: 1, opacity: 0.35,
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
// 6. OFFRE AU KAIROS — matter silk + halo bigdream + Wow rituel
//    Ce moment est rare. Il mérite la dorure pleine.
// ══════════════════════════════════════════════════════════════
const OffreKairosV12 = ({ go }) => {
  const Original = window.__OffreKairosOriginal;
  if (!Original) return null;

  v4E(() => {
    // jouer le rituel d'offrande à l'ouverture
    if (window.playRitual) window.playRitual("ceremoniel");
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <window.Surface matter="silk" motion={true} style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.7, pointerEvents: "none",
      }} />
      {/* halo bigdream pleine puissance — c'est l'offrande */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.55,
      }}>
        <window.HaloRespire kind="bigdream" style={{ width: "100%", height: "100%" }} />
      </div>
      {/* spirale dorée ample en arrière-plan */}
      <div style={{
        position: "absolute", top: "10%", left: "50%",
        transform: "translateX(-50%)",
        width: 600, height: 600, opacity: 0.12, pointerEvents: "none", zIndex: 1,
      }}>
        <window.GeoSymbol kind="spirale" color="silk" />
      </div>
      <div style={{ position: "relative", zIndex: 2 }}>
        <Original go={go} />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 7. MODAL V1.2 — backdrop avec matter douce + ember pour modales burn
//    Override de window.Modal pour amplifier toutes les modales du système
// ══════════════════════════════════════════════════════════════
const ModalV12 = ({ children, onClose, kind = "default" }) => {
  // kind: "default" | "burn" | "ceremonial"
  const matter = kind === "burn" ? "ember" : kind === "ceremonial" ? "silk" : "paper";
  const haloKind = kind === "burn" ? "ember" : kind === "ceremonial" ? "bigdream" : "silk";

  v4E(() => {
    if (kind === "ceremonial" && window.playRitual) window.playRitual("ceremoniel");
    if (kind === "burn" && window.playRitual) window.playRitual("braise");
  }, [kind]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "var(--s-4)",
      animation: "modalFadeIn var(--respire) var(--ease-respire)",
    }}
      onClick={onClose}>
      {/* backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        background: "color-mix(in oklch, var(--obsidian) 78%, transparent)",
        backdropFilter: "blur(8px)",
      }} />
      {/* matter overlay sobre */}
      <window.Surface matter={matter} motion={true} style={{
        position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none",
      }} />
      {/* halo respirant subtil */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4,
      }}>
        <window.HaloRespire kind={haloKind} style={{ width: "100%", height: "100%" }} />
      </div>
      <div onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", zIndex: 1,
          background: "var(--night-warm)",
          border: "1px solid var(--ash-deep)",
          padding: "var(--s-6)",
          maxWidth: 520, width: "100%",
          maxHeight: "calc(100vh - var(--s-6))", overflowY: "auto",
        }}>
        <button onClick={onClose}
          aria-label="fermer"
          style={{
            position: "absolute", top: "var(--s-3)", right: "var(--s-3)",
            background: "transparent", border: "none",
            color: "var(--ash-light)", cursor: "pointer",
            fontSize: 18, fontFamily: "var(--serif)",
          }}>×</button>
        {children}
      </div>
      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// 8. CONSTELLATION — wrapper réutilisable autour de ConstellationD3
//    expose une API simplifiée : <ConstellationGeneric data={…} mode="figures|kairos|cercle" />
// ══════════════════════════════════════════════════════════════
const ConstellationGeneric = ({
  data,
  mode = "figures",      // figures | kairos | cercle | abstract
  focalLabel = "ici",
  onNodeClick,
  height = 360,
  showLabels = true,
  driftParticles = true,
  ambientHalo = true,
}) => {
  if (!data || !data.nodes) return null;

  // assure qu'un nœud "self" existe
  const nodes = data.nodes.find(n => n.id === "self")
    ? data.nodes
    : [{ id: "self", label: focalLabel, kind: "self", weight: 2.5 }, ...data.nodes];

  // matter selon le mode
  const matter = {
    figures: "silk",
    kairos: "paper",
    cercle: "earth",
    abstract: "linen",
  }[mode] || "linen";

  return (
    <div style={{
      position: "relative",
      border: "1px solid var(--ash-deep)",
      background: "color-mix(in oklch, var(--obsidian) 45%, transparent)",
    }}>
      {/* matter en arrière-fond, très discret */}
      <window.Surface matter={matter} motion={true} style={{
        position: "absolute", inset: 0, opacity: 0.3, pointerEvents: "none",
      }} />
      {/* halo silk respirant si activé */}
      {ambientHalo && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.25, zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <window.ConstellationD3
          nodes={nodes}
          edges={data.edges || []}
          focalId="self"
          driftParticles={driftParticles}
          showLabels={showLabels}
          onNodeClick={onNodeClick}
          style={{ width: "100%", height }}
        />
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// Application des overrides V4
// ══════════════════════════════════════════════════════════════

// Sauvegarde des originaux pour wrapping
window.__OnboardingOriginal = window.OnboardingScreen;
window.__OracleCorpsOriginal = window.OracleCorpsScreen;
window.__NotifsOriginal = window.NotifsScreen;
window.__PrivacyOriginal = window.PrivacyScreen;
window.__AbonnementOriginal = window.AbonnementScreen;
window.__OffreKairosOriginal = window.OffreKairosScreen;
window.__ModalOriginal = window.Modal;

// Override par les versions V1.2
window.OnboardingScreen = OnboardingV12;
window.OracleCorpsScreen = OracleCorpsV12;
window.NotifsScreen = NotifsV12;
window.PrivacyScreen = PrivacyV12;
window.AbonnementScreen = AbonnementV12;
window.OffreKairosScreen = OffreKairosV12;
window.Modal = ModalV12;

// Nouveau composant exposé : Constellation générique
window.ConstellationGeneric = ConstellationGeneric;
