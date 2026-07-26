/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Page "Comment ça marche" (Sprint P0.4 — 2026-04-27)
// Design §11.bis.18 — FAQ par persona + glossaire intégré.
//
// REMPLACE le stub CommentScreen de screens-explorer.jsx (3 paragraphes
// statiques) par une vraie page d'orientation : 3 cards persona en
// sélection, parcours d'entrée concret, termes rencontrés (TermDef),
// sous-apps qui matchent, lien vers glossaire complet.
//
// Auto-select le persona via localStorage["dream:onboarding-profile"]
// si défini (issu de l'onboarding rituel B+D).
//
// Patterns dominants :
//   - DISCOVERABLE_DEPTH (P-Zéro §2.1) — l'utilisateur choisit son
//     entrée, Dream ne lui impose pas un parcours unique
//   - HIÉRARCHIE EXPLICITE (Bible §1.6) — 1 step par numéro, max 5
//   - GLOSSAIRE INTÉGRÉ (Sprint P0.4) — TermDef partout pour révéler
//     les termes spécialisés sans alourdir le texte
// ──────────────────────────────────────────────────────────────

const { useState: cmS, useEffect: cmE } = React;

// ── Mapping persona onboarding → key interne ──────────────────
// L'onboarding rituel stocke localStorage["dream:onboarding-profile"]
// avec les valeurs : "rever-souvent" / "reconnexion" / "chercheur-sens"
// (ou des proches — on tolère plusieurs aliases).
const PROFILE_ALIASES = {
  "rever-souvent": "reveur",
  "rêveur": "reveur",
  "rever": "reveur",
  "reveur": "reveur",
  "reconnexion": "reconnexion",
  "se-reconnecter": "reconnexion",
  "chercheur-sens": "chercheur",
  "chercheur": "chercheur",
  "sens": "chercheur",
};

function detectPersona() {
  try {
    const raw = localStorage.getItem("dream:onboarding-profile");
    if (!raw) return null;
    const norm = raw.toLowerCase().trim();
    return PROFILE_ALIASES[norm] || null;
  } catch { return null; }
}

// ── Définition des 3 parcours persona ─────────────────────────
// Chaque parcours = { glyph, title, hook, steps[], terms[], subApps[] }
//   - steps : array de {num, text} — text peut contenir <TermDef>
//   - terms : liste des keys glossaire à mettre en évidence
//   - subApps : sous-apps qui résonnent avec ce profil
const PERSONAS = [
  {
    key: "reveur",
    glyph: "🌙",
    title: "Je rêve souvent et veux les comprendre",
    hook: "Tu as déjà une mémoire onirique vivante. Dream va t'aider à voir les patterns qui t'échappent.",
    steps: [
      { num: 1, text: "Le matin, ouvre l'app et déposer ton rêve (1 minute, c'est tout)." },
      { num: 2, text: "Au bout de quelques rêves, l'app commence à voir des patterns — figures qui reviennent, lieux récurrents, émotions tissées." },
      { num: 3, text: { __html: "Tape ✦ \"sagesse\" sur n'importe quelle question pour relier rêves passés à ton présent." } },
      { num: 4, text: { __html: "Au bout d'une lune, demande à l'app une \"lettre du moment\" — l'IA narratrice écrit ce qui te traverse." } },
      { num: 5, text: "Découvre les protocoles guidés (depuis ⌄) pour aller plus profond — incubation, dialogue de figure, rentry." },
    ],
    terms: ["kairos", "ondinnonk", "framework_2", "polyphonie"],
    subApps: [
      { glyph: "◐", label: "Mode Lucid", desc: "si tu veux pratiquer le rêve lucide", route: "lucid-profile" },
      { glyph: "❋", label: "Tales", desc: "32 contes réels qui font écho à tes rêves", route: "conte-miroir" },
      { glyph: "✷", label: "Portrait Lettre", desc: "ce qui vit en toi en ce moment", route: "portrait" },
    ],
  },
  {
    key: "reconnexion",
    glyph: "✨",
    title: "Je veux me reconnecter à mes rêves",
    hook: "Tu as perdu le fil. Pas grave. Dream rouvre la porte sans forcer, par le corps et le quotidien.",
    steps: [
      { num: 1, text: "Commence par une note de jour, un fragment, une sensation au réveil — pas besoin d'un rêve complet." },
      { num: 2, text: "Le Mode Lucid (dans Explorer) propose des reality-checks doux qui épaississent la mémoire onirique." },
      { num: 3, text: { __html: "Ton corps redevient sismographe via Oracle du Corps (10 cartes vivantes)." } },
      { num: 4, text: "Au bout de 7-14 jours, les fragments commencent à former des images. Tu rêves déjà — tu les attrapes maintenant." },
      { num: 5, text: { __html: "Dream te demandera doucement : \"qu'est-ce qui shift dans ton corps ?\" après chaque lecture. Pas obligatoire." } },
    ],
    terms: ["kairos", "felt_shift", "trauma_safe", "kairomancer"],
    subApps: [
      { glyph: "◉", label: "Oracle du Corps", desc: "10 cartes pour relire les sensations", route: "oracle-corps" },
      { glyph: "◐", label: "Mode Lucid", desc: "reality-checks doux pour épaissir la mémoire", route: "lucid-profile" },
      { glyph: "❋", label: "Cauchemars & Deuil", desc: "sanctuaire pour ce qui pèse", route: "nightmares" },
    ],
  },
  {
    key: "chercheur",
    glyph: "☉",
    title: "Je cherche du sens dans ma vie",
    hook: "Dream n'est pas un journal de rêves. C'est une matière vivante qui éclaire ta vie de jour.",
    steps: [
      { num: 1, text: "Dépose tes kairos — pas seulement les rêves : signes diurnes, frissons, synchronicités. Six types au total." },
      { num: 2, text: "Swipe gauche depuis l'accueil pour voir ton Journal de Vie LUMINEUX — la couche jour qui complète la nuit." },
      { num: 3, text: { __html: "Pose une question dans le journal et tape ✦ — la sagesse des kairos cherche les rêves passés qui répondent." } },
      { num: 4, text: { __html: "Anima Mundi te montre ce que rêve le monde anonymement — météo, polyphonie, big dreams partagés." } },
      { num: 5, text: "Les Cercles (Explorer) te connectent à 3-12 autres rêveurs qui tissent ensemble — pas social, intime." },
    ],
    terms: ["kairos", "anima_mundi", "sagesse_des_kairos", "portrait_lettre", "tenir"],
    subApps: [
      { glyph: "◐", label: "Anima Mundi", desc: "le rêve du monde — météo, annales, polyphonie", route: "anima" },
      { glyph: "○", label: "Cercles", desc: "3-12 rêveurs qui tissent ensemble", route: "cercle" },
      { glyph: "✷", label: "Portrait Lettre", desc: "ta lettre du moment, écrite par l'IA", route: "portrait" },
    ],
  },
];

// ── Card persona (sélection) ──────────────────────────────────
const PersonaCard = ({ persona, active, onTap }) => (
  <button
    onClick={onTap}
    aria-label={`parcours ${persona.title}`}
    aria-pressed={active}
    style={{
      display: "grid",
      gridTemplateColumns: "32px 1fr 16px",
      alignItems: "center",
      gap: 14,
      width: "100%",
      textAlign: "left",
      background: active
        ? "color-mix(in oklch, var(--silk-gold) 10%, color-mix(in oklch, var(--night-warm) 50%, transparent))"
        : "color-mix(in oklch, var(--night-warm) 40%, transparent)",
      border: active
        ? "1px solid color-mix(in oklch, var(--silk-gold) 45%, var(--bone))"
        : "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
      cursor: "pointer",
      padding: "14px 16px",
      color: "var(--bone)",
      fontFamily: "var(--serif)",
      transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
      minHeight: 60,
      marginBottom: 8,
    }}
  >
    <span aria-hidden="true" style={{
      fontSize: 22, textAlign: "center",
      opacity: active ? 1 : 0.85,
    }}>{persona.glyph}</span>
    <span style={{
      fontFamily: "var(--serif)", fontStyle: "italic",
      fontSize: 15, color: "var(--bone)",
      opacity: active ? 1 : 0.88,
      lineHeight: 1.4, letterSpacing: "0.005em",
      textWrap: "pretty",
    }}>{persona.title}</span>
    <span aria-hidden="true" style={{
      fontSize: 14,
      color: active ? "var(--silk-gold)" : "var(--ash-light)",
      opacity: active ? 1 : 0.45,
      textAlign: "center",
      fontFamily: "var(--serif)",
      transition: "color 280ms ease, opacity 280ms ease",
    }}>{active ? "✓" : "→"}</span>
  </button>
);

// ── Render parcours d'un persona (déroulé) ────────────────────
const PersonaJourney = ({ persona, go }) => {
  const TermDef = window.TermDef;
  const renderStepText = (step) => {
    // Si step.text est un objet __html, on injecte le HTML brut tel quel
    // (cas où on a besoin de markup léger). Sinon on render plain text.
    if (typeof step.text === "object" && step.text?.__html) {
      return <span dangerouslySetInnerHTML={step.text} />;
    }
    return <span>{step.text}</span>;
  };

  return (
    <section style={{
      animation: "comment-section-in 480ms ease-out both",
    }}>
      {/* Hook ouvrant */}
      <p style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 16, lineHeight: 1.55,
        color: "var(--bone)", opacity: 0.92,
        margin: "0 0 22px", textWrap: "pretty",
      }}>{persona.hook}</p>

      {/* Steps numérotés */}
      <div style={{
        marginBottom: 28,
      }}>
        <div style={{
          fontFamily: "var(--mono, monospace)",
          fontSize: 10, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ash-light)", opacity: 0.5,
          marginBottom: 12,
        }}>
          ton parcours d'entrée
        </div>
        {persona.steps.map((step) => (
          <div key={step.num} style={{
            display: "grid",
            gridTemplateColumns: "28px 1fr",
            gap: 12,
            alignItems: "start",
            marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 13, color: "var(--silk-gold)",
              opacity: 0.6, paddingTop: 2,
              textAlign: "center",
            }}>{step.num}</span>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 14.5, lineHeight: 1.55,
              color: "var(--ash-light)", opacity: 0.92,
              margin: 0, textWrap: "pretty",
            }}>{renderStepText(step)}</p>
          </div>
        ))}
      </div>

      {/* Termes rencontrés (TermDef chips) */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "var(--mono, monospace)",
          fontSize: 10, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ash-light)", opacity: 0.5,
          marginBottom: 12,
        }}>
          termes que tu rencontreras
        </div>
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 12,
          padding: "12px 14px",
          background: "color-mix(in oklch, var(--night-warm) 30%, transparent)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))",
        }}>
          {persona.terms.map((termKey) => (
            <span key={termKey} style={{
              fontFamily: "var(--serif)",
              fontSize: 14, color: "var(--bone)",
              lineHeight: 1.5,
            }}>
              {TermDef
                ? <TermDef term={termKey} />
                : <span style={{ fontStyle: "italic" }}>{window.DREAM_GLOSSAIRE?.[termKey]?.label || termKey}</span>}
            </span>
          ))}
        </div>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 12, color: "var(--ash-light)",
          opacity: 0.6, margin: "8px 0 0", letterSpacing: "0.02em",
        }}>tap-long sur un mot pour la définition</p>
      </div>

      {/* Sous-apps qui t'intéresseront */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontFamily: "var(--mono, monospace)",
          fontSize: 10, letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ash-light)", opacity: 0.5,
          marginBottom: 12,
        }}>
          sous-apps qui t'intéresseront
        </div>
        {persona.subApps.map((app) => (
          <button key={app.label}
            onClick={() => go && go(app.route)}
            style={{
              display: "grid",
              gridTemplateColumns: "28px 1fr 16px",
              alignItems: "center",
              gap: 14,
              width: "100%",
              textAlign: "left",
              background: "color-mix(in oklch, var(--night-warm) 30%, transparent)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))",
              cursor: "pointer",
              padding: "12px 14px",
              color: "var(--bone)",
              fontFamily: "var(--serif)",
              marginBottom: 6,
              transition: "all 380ms ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))";
              e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 4%, color-mix(in oklch, var(--night-warm) 40%, transparent))";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))";
              e.currentTarget.style.background = "color-mix(in oklch, var(--night-warm) 30%, transparent)";
            }}>
            <span aria-hidden="true" style={{
              fontSize: 16, color: "var(--silk-gold)",
              opacity: 0.78, textAlign: "center", fontStyle: "italic",
            }}>{app.glyph}</span>
            <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
              <span style={{
                fontFamily: "var(--sans)",
                fontSize: 14.5, color: "var(--bone)",
                fontWeight: 400, letterSpacing: "0.005em",
              }}>{app.label}</span>
              <span style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 12.5, color: "var(--ash-light)",
                opacity: 0.7, lineHeight: 1.4, textWrap: "pretty",
              }}>{app.desc}</span>
            </span>
            <span aria-hidden="true" style={{
              fontSize: 13, color: "var(--ash-light)",
              opacity: 0.45, textAlign: "center",
              fontFamily: "var(--serif)",
            }}>→</span>
          </button>
        ))}
      </div>
    </section>
  );
};

// ── CommentScreen — composant principal ──────────────────────
// Auto-select persona du user au mount si détecté.
// Override le stub exporté par screens-explorer.jsx (chargé après).
const CommentScreen = ({ go }) => {
  const [selected, setSelected] = cmS(() => {
    const detected = detectPersona();
    return detected || null;
  });

  // Si pas de persona auto-détecté, on attend que l'user choisisse
  // (pas d'auto-sélection muette → respect du choix conscient).

  const persona = selected ? PERSONAS.find(p => p.key === selected) : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--night-floor)",
      color: "var(--bone)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Ash subtle grain overlay (cohérence ExplorerScreen) */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.18, zIndex: 0,
      }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
          <rect width="100%" height="100%" filter="url(#noise-ash)" />
        </svg>
      </div>

      {/* Bouton retour */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 22px 14px", maxWidth: 580, margin: "0 auto",
      }}>
        <button onClick={() => go && go("explorer")}
          aria-label="retour à explorer"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--ash-light)", opacity: 0.6,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "4px 0", letterSpacing: "0.02em",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>
          ← explorer
        </button>
      </div>

      {/* Header */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 22px 24px", maxWidth: 580, margin: "0 auto",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 26, color: "var(--bone)", margin: 0, marginBottom: 10,
          letterSpacing: "0.005em",
        }}>Comment Dream marche</h1>
        <div aria-hidden="true" style={{
          width: 48, height: 1,
          background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
          margin: "0 auto 12px",
        }} />
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 14, color: "var(--ash-light)",
          opacity: 0.78, margin: 0, letterSpacing: "0.02em",
        }}>Trouve ton entrée selon ce que tu cherches.</p>
      </div>

      {/* 3 cards persona */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 18px", maxWidth: 580, margin: "0 auto",
        marginBottom: 22,
      }}>
        {PERSONAS.map((p) => (
          <PersonaCard
            key={p.key}
            persona={p}
            active={selected === p.key}
            onTap={() => setSelected(p.key)}
          />
        ))}
      </div>

      {/* Section sélectionnée — défile */}
      {persona && (
        <div style={{
          position: "relative", zIndex: 1,
          padding: "0 22px", maxWidth: 580, margin: "0 auto",
          marginTop: 8,
        }}>
          <div aria-hidden="true" style={{
            width: 48, height: 1,
            background: "color-mix(in oklch, var(--silk-gold) 18%, transparent)",
            margin: "0 auto 22px",
          }} />
          <PersonaJourney persona={persona} go={go} />
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "32px 22px 0", maxWidth: 580, margin: "0 auto",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 13, color: "var(--ash-light)",
          opacity: 0.62, margin: "0 0 12px", letterSpacing: "0.02em",
          lineHeight: 1.55, textWrap: "pretty",
        }}>
          Toutes les portes sont accessibles via "explorer" en bas.
        </p>
        <button onClick={() => go && go("glossaire")}
          style={{
            background: "transparent",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
            color: "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "8px 18px", cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "all 280ms ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 8%, transparent)";
            e.currentTarget.style.color = "var(--silk-gold)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))";
          }}>
          glossaire complet →
        </button>
      </div>

      <style>{`
        @keyframes comment-section-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Exports → window (override stub de screens-explorer.jsx) ──
// IMPORTANT : ce fichier doit être chargé APRÈS screens-explorer.jsx
// dans index.html pour que window.CommentScreen pointe vers cette version.
Object.assign(window, {
  CommentScreen,
  PERSONAS,
});
