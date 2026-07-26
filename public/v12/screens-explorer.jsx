/* global React */
// ──────────────────────────────────────────────────────────────
// ExplorerScreen — Hub centralisé sous-apps + fonctionnalités
// Spec : 2_DESIGN §11.bis.17 (Sprint P0.2 + P0.3 — 2026-04-27)
//
// REMPLACE le drawer caché derrière le glyphe lune (DiscoverDrawer
// en §11.bis.14) par un onglet dédié dans BottomNav. La nav passe
// de 4 onglets + drawer caché à 5 onglets explicites :
//
//   [ ☾ vie ] [ ✷ portrait ] [ FAB ⌄ ] [ ◉ explorer ] [ ◐ monde ]
//
// Diagnostic UX 27/04 : 6 zones de navigation (4 onglets + FAB +
// drawer caché derrière glyphe muet) = Hick's Law violé. Solution
// senior design : convertir le drawer en route explicite + cards
// verticales hiérarchisées par catégorie.
//
// Patterns dominants :
//   - DISCOVERABLE_DEPTH (P-Zéro §2.1) — toutes les sous-apps
//     accessibles d'un tap, plus de friction "savoir tapper la lune"
//   - HIÉRARCHIE EXPLICITE (Bible §1.6) — 3 sections nommées :
//     Le tien · Les autres · Profondeurs (mental model clair)
//   - SOBRIETÉ NIGHT-FIRST (Design §6.2) — palette night-floor,
//     ash subtil overlay, EB Garamond italic partout
// ──────────────────────────────────────────────────────────────

const { useState: exS, useEffect: exE } = React;

// ── Sections + items du hub Explorer ──────────────────────────
// Note : ordre = priorité psychique. "Le tien" d'abord (les portes
// que tu possèdes déjà), puis "Les autres" (ce qui se partage),
// puis "Profondeurs" (les pratiques avancées + paramètres).
// 2026-04-27 P0.4 — `termInLabel` : key glossaire à wrapper dans le label
// (premier mot spécialisé rencontré). `termInHint` : idem pour la description.
// Composant ExplorerCard détecte ces clés et utilise window.TermDef si dispo.
const EXPLORER_SECTIONS = [
  {
    label: "Le tien",
    items: [
      { glyph: "☾", label: "Parler avec Anima",  hint: "ta présence Dream — chat, voix, threads (Sprint A)",            route: "dream-chat" },
      { glyph: "☉", label: "Tes kairos",         hint: "l'historique de tes rêves et signes",                            route: "journal",       termInLabel: "kairos" },
      { glyph: "✦", label: "Sagesse des kairos", hint: "l'IA tisse depuis tes patterns",                                  route: "journal-jour", action: "wisdom", termInLabel: "sagesse_des_kairos" },
      { glyph: "❍", label: "Mon dictionnaire",   hint: "20+ symboles personnels qui reviennent dans tes rêves",            route: "personal-dictionary" },
      { glyph: "↻", label: "Motifs récurrents",  hint: "ce qui revient dans tes rêves — re-entrée consciente Aizenstat",  route: "recurring" },
      { glyph: "◉", label: "Oracle du Corps",    hint: "le corps comme sismographe",                                      route: "oracle-corps" },
      { glyph: "❋", label: "Cauchemars & Deuil", hint: "sanctuaire pour ce qui pèse",                                     route: "nightmares" },
    ],
  },
  {
    label: "Pratiques",
    items: [
      { glyph: "◐", label: "Lucid Dreaming",     hint: "5 onglets · profil, RC, dream signs, WBTB, stats — anti-iatrogène", route: "lucid-profile" },
      { glyph: "❋", label: "Tales",              hint: "32 contes réels qui font écho à tes rêves",                       route: "conte-miroir" },
    ],
  },
  {
    label: "Profondeurs",
    items: [
      { glyph: "?", label: "Glossaire",          hint: "tous les mots de Dream définis",                                  route: "glossaire" },
      { glyph: "·", label: "Paramètres",         hint: "privacy, notifications, désactivation",                            route: "privacy" },
      { glyph: "?", label: "Comment ça marche",  hint: "FAQ par persona",                                                  route: "comment" },
    ],
  },
];

// ── Helper P0.4 — render label avec TermDef wrappant le terme cible
// Le composant TermDef intercepte le tap, donc on stoppe la propagation
// pour éviter de déclencher le routing card. (TermDef e.preventDefault déjà.)
function renderLabelWithTerm(label, termKey) {
  const T = window.TermDef;
  const def = window.DREAM_GLOSSAIRE?.[termKey];
  if (!T || !def) return label;
  // On cherche le label glossaire dans le texte (case-insensitive) et on
  // wrap UNIQUEMENT cette occurrence. Si pas trouvé, fallback brut.
  const target = def.label;
  const lower = label.toLowerCase();
  const idx = lower.indexOf(target.toLowerCase());
  if (idx === -1) return label;
  const before = label.slice(0, idx);
  const match = label.slice(idx, idx + target.length);
  const after = label.slice(idx + target.length);
  // stopPropagation sur span externe pour éviter le tap routant la card
  return (
    <>
      {before}
      <span onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}>
        <T term={termKey}>{match}</T>
      </span>
      {after}
    </>
  );
}

// ── Card item — réutilisé dans toutes les sections ────────────
const ExplorerCard = ({ item, onTap }) => (
  <button
    onClick={onTap}
    aria-label={item.label}
    style={{
      display: "grid",
      gridTemplateColumns: "28px 1fr 18px",
      alignItems: "center",
      gap: 14,
      width: "100%",
      textAlign: "left",
      background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
      border: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
      cursor: "pointer",
      padding: "14px 16px",
      color: "var(--bone)",
      fontFamily: "var(--serif)",
      transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
      minHeight: 64,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 6%, color-mix(in oklch, var(--night-warm) 50%, transparent))";
      e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 32%, var(--ash-deep))";
      e.currentTarget.style.transform = "scale(1.015)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "color-mix(in oklch, var(--night-warm) 40%, transparent)";
      e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))";
      e.currentTarget.style.transform = "scale(1)";
    }}
  >
    {/* Glyphe */}
    <span aria-hidden="true" style={{
      fontSize: 18,
      color: "var(--silk-gold)",
      opacity: 0.82,
      fontStyle: "italic",
      textAlign: "center",
    }}>{item.glyph}</span>

    {/* Titre + description */}
    <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
      <span style={{
        fontFamily: "var(--sans)",
        fontSize: 15.5,
        color: "var(--bone)",
        fontWeight: 400,
        letterSpacing: "0.005em",
      }}>{item.termInLabel ? renderLabelWithTerm(item.label, item.termInLabel) : item.label}</span>
      <span style={{
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 12.5,
        color: "var(--ash-light)",
        opacity: 0.72,
        lineHeight: 1.4,
        textWrap: "pretty",
      }}>{item.hint}</span>
    </span>

    {/* Chevron → */}
    <span aria-hidden="true" style={{
      fontSize: 14,
      color: "var(--ash-light)",
      opacity: 0.45,
      textAlign: "center",
      fontFamily: "var(--serif)",
    }}>→</span>
  </button>
);

// ── ExplorerScreen — composant principal ──────────────────────
const ExplorerScreen = ({ go }) => {
  // Handler tap card — supporte action "wisdom" pour l'item Sagesse
  // 2026-04-28 fix bug T67 : Sagesse des Kairos renvoyait au home (route="home"
  // sans handler câblé). Désormais route vers "journal-jour" où le bouton ✦
  // "appel à la sagesse des kairos sur cette section" est natif et proéminent
  // (cf. screens-journal-jour.jsx l.945-962 + window.DreamAPI.summonKairosWisdom).
  // Auto-trigger : pose un flag global que journal-jour peut lire au mount pour
  // ouvrir directement le modal Wisdom (TODO: à câbler dans screens-journal-jour.jsx
  // useEffect mount → if window.dreamAutoTriggerWisdom → déclenche summon + reset flag).
  const handleTap = (item) => {
    if (typeof go !== "function") return;
    if (item.action === "wisdom") {
      try { window.dreamAutoTriggerWisdom = true; } catch {}
    }
    go(item.route);
  };

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
      {/* Ash subtle grain overlay (matter ash, cohérence DreamHome) */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.18, zIndex: 0,
      }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
          <rect width="100%" height="100%" filter="url(#noise-ash)" />
        </svg>
      </div>

      {/* Header sobre */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 22px 20px",
        maxWidth: 580, width: "100%", margin: "0 auto",
        textAlign: "center",
      }}>
        <h1 style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 26, color: "var(--bone)",
          margin: 0, marginBottom: 10,
          letterSpacing: "0.005em",
        }}>Explorer</h1>
        <div aria-hidden="true" style={{
          width: 48, height: 1,
          background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
          margin: "0 auto 10px",
        }} />
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 13.5, color: "var(--ash-light)",
          opacity: 0.72,
          margin: 0,
          letterSpacing: "0.02em",
        }}>Toutes les portes de Dream</p>
      </div>

      {/* Sections */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 18px",
        maxWidth: 580, width: "100%", margin: "0 auto",
      }}>
        {EXPLORER_SECTIONS.map((section, sIdx) => (
          <section key={section.label} style={{
            marginBottom: sIdx < EXPLORER_SECTIONS.length - 1 ? 26 : 12,
          }}>
            {/* Label section — uppercase mono ash-light op 0.5 */}
            <div style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ash-light)",
              opacity: 0.5,
              padding: "0 6px 10px",
            }}>
              {section.label}
            </div>

            {/* Cards — gap 8px entre chaque */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {section.items.map(item => (
                <ExplorerCard
                  key={item.label}
                  item={item}
                  onTap={() => handleTap(item)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer sobre — version */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "12px 22px 0",
        maxWidth: 580, width: "100%", margin: "0 auto",
        textAlign: "center",
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 11, color: "var(--ash-light)", opacity: 0.4,
        letterSpacing: "0.05em",
      }}>
        v0.4 · alpha
      </div>
    </div>
  );
};

// ── CommentScreen — placeholder simple FAQ par persona ─────────
// 2026-04-27 Sprint P0.2 : route "comment" référencée par Explorer.
// Stub minimaliste : les 3 personas onboarding (rêveur / reconnexion
// / chercheur) avec 1 paragraphe chacune. Évolution future possible
// vers FAQ riche, mais cohérence d'abord (pas de lien mort).
const CommentScreen = ({ go }) => {
  const personas = [
    {
      glyph: "🌙",
      title: "Tu rêves souvent",
      text: "Dépose chaque rêve dès le réveil — Dream cherche les figures, lieux, émotions qui reviennent. Au fil des semaines, tu vois ton paysage onirique se dessiner. La Sagesse des kairos tisse depuis tes patterns. C'est ton miroir long-terme.",
    },
    {
      glyph: "✨",
      title: "Tu te reconnectes",
      text: "Commence par une note de jour, un fragment, une sensation au réveil. Le Mode Lucid (dans Explorer) propose des reality-checks doux pour épaissir la mémoire onirique. Ton corps redevient sismographe via Oracle du Corps. La porte se rouvre sans forcer.",
    },
    {
      glyph: "☉",
      title: "Tu cherches du sens",
      text: "Dream n'est pas un journal de rêves — c'est une matière vivante qui éclaire ta vie de jour. Swipe gauche depuis l'accueil pour voir ton Journal de Vie LUMINEUX. Anima Mundi te montre ce que rêve le monde anonymement. Les Cercles (Explorer) te connectent à d'autres rêveurs.",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--night-floor)",
      color: "var(--bone)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      position: "relative",
    }}>
      {/* Bouton retour */}
      <div style={{ padding: "0 22px 14px", maxWidth: 580, margin: "0 auto" }}>
        <button onClick={() => go && go("explorer")}
          aria-label="retour à explorer"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--ash-light)", opacity: 0.6,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "4px 0",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.6}>
          ← retour
        </button>
      </div>

      {/* Titre */}
      <div style={{ padding: "0 22px 20px", maxWidth: 580, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 24, color: "var(--bone)", margin: 0,
        }}>Comment ça marche</h1>
        <div aria-hidden="true" style={{
          width: 48, height: 1,
          background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
          margin: "10px auto 0",
        }} />
      </div>

      {/* Personas */}
      <div style={{ padding: "0 22px", maxWidth: 580, margin: "0 auto" }}>
        {personas.map((p, i) => (
          <div key={p.title} style={{
            marginBottom: 24,
            padding: "18px 18px",
            background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 10,
            }}>
              <span style={{ fontSize: 20 }}>{p.glyph}</span>
              <h2 style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 17, color: "var(--bone)",
                margin: 0, letterSpacing: "0.005em",
              }}>{p.title}</h2>
            </div>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 14.5, lineHeight: 1.6,
              color: "var(--ash-light)", opacity: 0.88,
              margin: 0, textWrap: "pretty",
            }}>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Exports → window ───────────────────────────────────────────
Object.assign(window, {
  ExplorerScreen,
  CommentScreen,
  EXPLORER_SECTIONS,
});
