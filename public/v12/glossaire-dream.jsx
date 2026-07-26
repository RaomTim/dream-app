/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — Glossaire tap-long (Sprint P0.4 — 2026-04-27)
// Design §11.bis.18 — Glossaire 12 termes spécialisés.
//
// Diagnostic Senior Designer 27/04 : 80% du grand public décroche
// en moins de 30s face aux termes "kairos / anima mundi / felt-shift /
// désensorcelé / portrait lettre / sagesse des kairos". Le glossaire
// prévu en §11.bis.3 n'avait jamais été codé.
//
// Ce fichier expose :
//   - window.DREAM_GLOSSAIRE : dict {key: {label, short, long, source}}
//   - window.TermDef         : composant <TermDef term="kairos" /> qui
//     affiche le label en italic dashed silk-gold et ouvre un popover
//     sobre au tap-long mobile / hover desktop.
//   - window.TERMS_SEEN_KEY  : clé localStorage pour tracker les termes
//     déjà rencontrés (helper pour wrap UNE fois par session — mais on
//     ne court-circuite PAS le composant : il s'auto-style toujours,
//     l'opacité du soulignement diminue après première vue).
//   - window.GlossaireScreen : route "glossaire", liste alphabétique
//     de tous les termes accessibles depuis "Comment ça marche".
//
// Patterns dominants :
//   - DISCOVERABLE_DEPTH (P-Zéro §2.1) — la définition est latente,
//     révélée par tap-long, jamais imposée
//   - SOBRIÉTÉ NIGHT-FIRST (Design §6.2) — popover night-warm, paper
//     border silk-gold 30%, EB Garamond italic 14px
//   - TRAUMA-SAFE (Bible §17) — pas d'animation criarde, fade tenu
//     280ms ease-tenue, tap outside ferme silencieusement
// ──────────────────────────────────────────────────────────────

const { useState: gS, useEffect: gE, useRef: gR } = React;

// ── Dictionnaire global ────────────────────────────────────────
window.DREAM_GLOSSAIRE = {
  kairos: {
    label: "kairos",
    short: "moment marqué dans le quotidien qui porte trace",
    long: "Mot grec ancien (καιρός) qui signifie 'moment opportun' — par opposition à chronos (le temps qui passe). Dans Dream, un kairos désigne tout instant chargé : rêve nocturne, signe diurne, frisson, synchronicité, rêverie, hypnagogie. Six types au total.",
    source: "Robert Moss, Sidewalk Oracles",
  },
  anima_mundi: {
    label: "anima mundi",
    short: "le rêve du monde — ce que l'humanité tisse ensemble",
    long: "Concept latin qui signifie 'âme du monde'. Dans Dream, désigne le sanctuaire collectif où les rêves anonymisés des utilisateurs forment une polyphonie — une météo de l'inconscient planétaire. K-anonymity 100+ stricte, jamais de profilage individuel.",
    source: "Stephen Aizenstat, Dream Tending",
  },
  felt_shift: {
    label: "felt-shift",
    short: "la sensation qui se transforme dans le corps",
    long: "Concept du psychothérapeute Eugene Gendlin (Focusing). Quand une parole, image ou interprétation touche juste, le corps répond par un micro-changement (relâchement, frémissement, ouverture). Dream demande après chaque lecture : 'qu'est-ce qui shift dans ton corps ?'",
    source: "Eugene Gendlin, Focusing",
  },
  sagesse_des_kairos: {
    label: "sagesse des kairos",
    short: "tes rêves passés qui répondent à ta question d'aujourd'hui",
    long: "Geste secondaire central de Dream. Tu poses une question éveillée (note de Journal de Vie). L'app cherche dans tous tes kairos passés ceux qui résonnent symboliquement. L'IA tisse une polyphonie 100-200 mots qui ne te dit pas le sens — qui rappelle ce que tu as déjà perçu.",
    source: "Bible §3.10",
  },
  portrait_lettre: {
    label: "lettre du moment",
    short: "ce qui vit en toi en ce moment, écrit par l'IA",
    long: "L'IA narratrice écrit une lettre de 200-400 mots qui dit ce qui te traverse en ce moment, à partir de ton journal et tes kairos. 3 toggles : vie de jour / vie de nuit / les deux qui se croisent. Régénération 1× par jour pour préserver le rituel.",
    source: "Design §7.6",
  },
  tenir: {
    label: "tenir",
    short: "geste sans valoir, soutenir sans juger",
    long: "Dans Anima Mundi, le rêve grand qui passe a besoin d'être tenu par plusieurs mains pour ne pas se perdre. Pas voter, pas liker — tenir. Geste irréversible silencieux. Inspiré de Brown 'Holding Change'.",
    source: "adrienne maree brown, Holding Change",
  },
  ondinnonk: {
    label: "Ondinnonk",
    short: "désir caché de l'âme — révélé par le rêve",
    long: "Concept iroquois (via Robert Moss) — désir secret de l'âme révélé par les rêves. Les Big Dreams sont les kairos qui portent un Ondinnonk. Compas pour la traversée.",
    source: "Robert Moss, Conscious Dreaming",
  },
  framework_2: {
    label: "Framework 2",
    short: "la dimension d'où viennent les rêves",
    long: "Terme du channel Seth/Jane Roberts. La réalité que nous percevons éveillés (Framework 1) émerge d'un domaine plus vaste (Framework 2) où les possibles se forment. Les rêves donnent accès à Framework 2.",
    source: "Seth, Nature of Personal Reality",
  },
  kairomancer: {
    label: "kairomancer",
    short: "celui qui perçoit les signes — pas qui les reçoit",
    long: "Robert Moss : 'The kairomancer is the perceiver, not the receiver.' Dream entraîne ton œil oraculaire. L'app n'est pas un oracle, elle est un instrument qui te rend oraculaire.",
    source: "Robert Moss, Sidewalk Oracles",
  },
  trauma_safe: {
    label: "trauma-safe",
    short: "respect des fenêtres de tolérance",
    long: "30-40% des humains portent un trauma actif. Dream est trauma-safe par défaut : pas d'interprétation pushée, EXIT_TO_HUMAN partout, sanctuaire dédié, mode freeze 30j si crise.",
    source: "Donald Kalsched, Inner World of Trauma",
  },
  polyphonie: {
    label: "polyphonie",
    short: "plusieurs voix qui éclairent sans imposer",
    long: "L'IA narratrice de Dream tisse plusieurs voix Forêt (Aizenstat, Moss, Bachelard, Hopcke...) en harmonie. Phrasé conditionnel obligatoire ('on pourrait entendre', 'il semble que'). Jamais de verdict.",
    source: "Design §3.4 polyphonie ontologiquement honnête",
  },
  foret: {
    label: "Forêt",
    short: "333 livres digérés, bibliothèque épistémique vivante",
    long: "Bibliothèque INFUSE de 333 livres digérés en deux niveaux : Tier 1 fidèle à la source, Tier 2 traduit en grammaire INFUSE. ~60 voix densément mobilisées au cœur du tissage Dream (root rêve, psyché, prophétie, corps, mythe). Filtre triple éthique Said+Smith+Kimmerer.",
    source: "Bible §3.5 + 3_TECHNICAL §47",
  },
};

// Clé localStorage pour tracker les termes déjà vus (helper "wrap PREMIÈRE
// occurrence par session"). Le composant TermDef reste fonctionnel partout
// — cette liste est juste un signal d'opacité.
window.TERMS_SEEN_KEY = "dream:terms-seen";

window.markTermSeen = function (termKey) {
  try {
    const seen = JSON.parse(localStorage.getItem(window.TERMS_SEEN_KEY) || "[]");
    if (!seen.includes(termKey)) {
      seen.push(termKey);
      localStorage.setItem(window.TERMS_SEEN_KEY, JSON.stringify(seen));
    }
  } catch {}
};

window.isTermSeen = function (termKey) {
  try {
    const seen = JSON.parse(localStorage.getItem(window.TERMS_SEEN_KEY) || "[]");
    return seen.includes(termKey);
  } catch { return false; }
};

// ── Composant <TermDef term="kairos" /> ───────────────────────
// Render label en italic + soulignement dashed silk-gold opacity 50%.
// Tap court (mobile) / hover (desktop) → popover sobre.
// Tap-long mobile = onTouchStart + setTimeout 500ms (perçu comme intentionnel).
// Tap outside ferme. Touch hors zone trigger via overlay invisible.
const TermDef = ({ term, children, asInline = true }) => {
  const def = window.DREAM_GLOSSAIRE?.[term];
  const [open, setOpen] = gS(false);
  const [expanded, setExpanded] = gS(false);
  const [seen, setSeen] = gS(() => window.isTermSeen?.(term) || false);
  // 2026-04-28 fix bug T68 : track HOW the popover was opened.
  // 'hover' = mouseLeave allowed to close. 'click'/'touch' = stay open until
  // explicit close (tap outside / click outside / Escape / re-tap on term).
  const [openSource, setOpenSource] = gS(null);
  const longPressTimer = gR(null);
  const anchorRef = gR(null);
  const popoverRef = gR(null);
  const [popoverPos, setPopoverPos] = gS({ top: 0, left: 0 });

  // Si terme inconnu, on render le children ou le terme brut sans wrap
  if (!def) return <span>{children || term}</span>;

  // Marque comme vu à l'ouverture
  const handleOpen = (source = 'click') => {
    setOpen(true);
    setOpenSource(source);
    if (!seen) {
      window.markTermSeen?.(term);
      setSeen(true);
    }
    // Calcul position popover (sous le label, centré horizontalement,
    // clamp aux bords de l'écran)
    requestAnimationFrame(() => {
      try {
        if (!anchorRef.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        const popW = 320;
        const margin = 12;
        let left = rect.left + (rect.width / 2) - (popW / 2);
        left = Math.max(margin, Math.min(left, window.innerWidth - popW - margin));
        let top = rect.bottom + 8;
        // Si dépasse en bas, on inverse au-dessus
        if (top + 200 > window.innerHeight) {
          top = rect.top - 8 - 200;
        }
        setPopoverPos({ top, left });
      } catch {}
    });
  };

  const handleClose = () => {
    setOpen(false);
    setExpanded(false);
    setOpenSource(null);
  };

  // Touch long-press (mobile) — 2026-04-28 fix bug T68 : tag source 'touch'
  // pour ne PAS auto-close sur mouseLeave artificiel post-tap (mobile fire
  // mouse events synthetic après touch).
  const onTouchStart = (e) => {
    longPressTimer.current = setTimeout(() => {
      handleOpen('touch');
    }, 500);
  };
  const onTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const onTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Click desktop = toggle (en plus du hover) — tag source 'click'
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (open) handleClose();
    else handleOpen('click');
  };

  // Hover desktop — tag source 'hover'
  const onMouseEnter = () => {
    // Détection desktop (no touch) — heuristique : pas de touch event récent
    if (!("ontouchstart" in window)) {
      handleOpen('hover');
    }
  };
  // 2026-04-28 fix bug T68 : ne ferme QUE si ouvert par hover
  // (sinon click/touch reste ouvert jusqu'à action explicite — fix flash 0.5s).
  // Délai augmenté à 400ms pour permettre transition souris label → popover.
  const onMouseLeave = () => {
    if (!("ontouchstart" in window) && !expanded && openSource === 'hover') {
      setTimeout(() => {
        if (popoverRef.current && popoverRef.current.matches(":hover")) return;
        // Re-check au moment du timeout : si l'user a cliqué entre temps, openSource a changé
        if (openSource === 'hover') handleClose();
      }, 400);
    }
  };

  // Cleanup timer au démontage
  gE(() => () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);

  // Style label : italic + soulignement dashed silk-gold
  // Opacité plus forte tant que pas vu (signale "il y a quelque chose à découvrir")
  const labelOpacity = seen ? 0.32 : 0.55;

  return (
    <>
      <span
        ref={anchorRef}
        role="button"
        tabIndex={0}
        aria-label={`définition de ${def.label}`}
        aria-expanded={open}
        onClick={onClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onTouchMove={onTouchMove}
        onTouchCancel={onTouchEnd}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
          if (e.key === "Escape") handleClose();
        }}
        style={{
          fontStyle: "italic",
          borderBottom: `1px dashed color-mix(in oklch, var(--silk-gold) ${Math.round(labelOpacity * 100)}%, transparent)`,
          paddingBottom: 1,
          cursor: "help",
          color: "inherit",
          transition: "border-color 280ms ease",
          WebkitTapHighlightColor: "transparent",
          userSelect: "none",
        }}
      >
        {children || def.label}
      </span>

      {open && (
        <>
          {/* Tap-outside overlay (invisible) — close au tap n'importe où ailleurs.
              2026-04-28 fix bug T68 : retiré onTouchStart={handleClose} qui se déclenchait
              prématurément quand le doigt se relevait après long-press (synthese touch
              event qui touchait l'overlay invisible juste après l'open). Garder onClick
              suffit pour fermer sur tap dehors (les clicks proviennent aussi de touchend
              sur mobile, mais APRÈS que le popover ait pleinement ouvert). */}
          <div
            onClick={handleClose}
            aria-hidden="true"
            style={{
              position: "fixed", inset: 0, zIndex: 400,
              background: "transparent",
            }}
          />
          {/* Popover */}
          <div
            ref={popoverRef}
            role="tooltip"
            style={{
              position: "fixed",
              top: popoverPos.top,
              left: popoverPos.left,
              zIndex: 401,
              maxWidth: 320,
              width: "calc(100vw - 24px)",
              background: "color-mix(in oklch, var(--night-warm) 96%, transparent)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))",
              padding: 20,
              boxShadow: "0 8px 28px color-mix(in oklch, var(--night-floor) 60%, transparent)",
              fontFamily: "var(--serif)",
              color: "var(--bone)",
              animation: "term-pop 280ms cubic-bezier(0.45,0,0.55,1) both",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            onMouseLeave={() => {
              // 2026-04-28 fix bug T68 : ne ferme QUE si ouvert par hover
              if (!("ontouchstart" in window) && !expanded && openSource === 'hover') handleClose();
            }}
          >
            {/* Titre */}
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--silk-gold)",
              marginBottom: 8,
              letterSpacing: "0.01em",
            }}>
              {def.label}
            </div>

            {/* Définition courte (toujours visible) */}
            <div style={{
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--bone)",
              opacity: 0.92,
              marginBottom: expanded ? 12 : 10,
              textWrap: "pretty",
            }}>
              {def.short}
            </div>

            {/* Bouton "en savoir plus" → expand */}
            {!expanded && (
              <button
                onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 12.5,
                  color: "var(--silk-gold)",
                  opacity: 0.75,
                  padding: 0,
                  letterSpacing: "0.02em",
                  transition: "opacity 280ms ease",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.75}
              >
                en savoir plus →
              </button>
            )}

            {/* Définition longue + source (expanded) */}
            {expanded && (
              <>
                <div style={{
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  color: "var(--ash-light)",
                  opacity: 0.88,
                  marginBottom: 10,
                  textWrap: "pretty",
                }}>
                  {def.long}
                </div>
                <div style={{
                  fontFamily: "var(--mono, monospace)",
                  fontSize: 10.5,
                  letterSpacing: "0.08em",
                  color: "var(--ash-light)",
                  opacity: 0.55,
                  textTransform: "uppercase",
                  borderTop: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
                  paddingTop: 8,
                  marginTop: 4,
                }}>
                  source · {def.source}
                </div>
              </>
            )}
          </div>
          <style>{`
            @keyframes term-pop {
              from { opacity: 0; transform: scale(0.96) translateY(-2px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
        </>
      )}
    </>
  );
};

// ── GlossaireScreen — route "glossaire" ──────────────────────
// Liste alphabétique de tous les termes. Accessible depuis la page
// "Comment ça marche" (lien footer) ET depuis Explorer (Profondeurs).
const GlossaireScreen = ({ go }) => {
  // Tri alphabétique par label affiché
  const entries = Object.entries(window.DREAM_GLOSSAIRE || {})
    .sort(([, a], [, b]) => a.label.localeCompare(b.label, "fr"));

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
      <div style={{ padding: "0 22px 14px", maxWidth: 640, margin: "0 auto" }}>
        <button onClick={() => go && go("comment")}
          aria-label="retour"
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
      <div style={{ padding: "0 22px 28px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 26, color: "var(--bone)", margin: 0,
        }}>Glossaire</h1>
        <div aria-hidden="true" style={{
          width: 48, height: 1,
          background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
          margin: "10px auto 12px",
        }} />
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 13.5, color: "var(--ash-light)",
          opacity: 0.72, margin: 0, letterSpacing: "0.02em",
        }}>Les mots que tu rencontreras dans Dream</p>
      </div>

      {/* Liste */}
      <div style={{ padding: "0 18px", maxWidth: 640, margin: "0 auto" }}>
        {entries.map(([key, def]) => (
          <article key={key} style={{
            marginBottom: 18,
            padding: "16px 18px",
            background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
          }}>
            <h2 style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 17, color: "var(--silk-gold)",
              margin: 0, marginBottom: 8, letterSpacing: "0.005em",
            }}>{def.label}</h2>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 14.5, lineHeight: 1.55,
              color: "var(--bone)", opacity: 0.92,
              margin: 0, marginBottom: 8, textWrap: "pretty",
            }}>{def.short}</p>
            <p style={{
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 13, lineHeight: 1.55,
              color: "var(--ash-light)", opacity: 0.78,
              margin: 0, marginBottom: 10, textWrap: "pretty",
            }}>{def.long}</p>
            <div style={{
              fontFamily: "var(--mono, monospace)",
              fontSize: 10, letterSpacing: "0.08em",
              color: "var(--ash-light)", opacity: 0.5,
              textTransform: "uppercase",
              borderTop: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))",
              paddingTop: 6,
            }}>source · {def.source}</div>
          </article>
        ))}
      </div>
    </div>
  );
};

// ── Exports ────────────────────────────────────────────────────
Object.assign(window, {
  TermDef,
  GlossaireScreen,
});
