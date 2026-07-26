const { useState: cmS, useEffect: cmE } = React;
const PROFILE_ALIASES = {
  "rever-souvent": "reveur",
  "r\xEAveur": "reveur",
  "rever": "reveur",
  "reveur": "reveur",
  "reconnexion": "reconnexion",
  "se-reconnecter": "reconnexion",
  "chercheur-sens": "chercheur",
  "chercheur": "chercheur",
  "sens": "chercheur"
};
function detectPersona() {
  try {
    const raw = localStorage.getItem("dream:onboarding-profile");
    if (!raw) return null;
    const norm = raw.toLowerCase().trim();
    return PROFILE_ALIASES[norm] || null;
  } catch (e) {
    return null;
  }
}
const PERSONAS = [
  {
    key: "reveur",
    glyph: "\u{1F319}",
    title: "Je r\xEAve souvent et veux les comprendre",
    hook: "Tu as d\xE9j\xE0 une m\xE9moire onirique vivante. Dream va t'aider \xE0 voir les patterns qui t'\xE9chappent.",
    steps: [
      { num: 1, text: "Le matin, ouvre l'app et d\xE9poser ton r\xEAve (1 minute, c'est tout)." },
      { num: 2, text: "Au bout de quelques r\xEAves, l'app commence \xE0 voir des patterns \u2014 figures qui reviennent, lieux r\xE9currents, \xE9motions tiss\xE9es." },
      { num: 3, text: { __html: `Tape \u2726 "sagesse" sur n'importe quelle question pour relier r\xEAves pass\xE9s \xE0 ton pr\xE9sent.` } },
      { num: 4, text: { __html: `Au bout d'une lune, demande \xE0 l'app une "lettre du moment" \u2014 l'IA narratrice \xE9crit ce qui te traverse.` } },
      { num: 5, text: "D\xE9couvre les protocoles guid\xE9s (depuis \u2304) pour aller plus profond \u2014 incubation, dialogue de figure, rentry." }
    ],
    terms: ["kairos", "ondinnonk", "framework_2", "polyphonie"],
    subApps: [
      { glyph: "\u25D0", label: "Mode Lucid", desc: "si tu veux pratiquer le r\xEAve lucide", route: "lucid-profile" },
      { glyph: "\u274B", label: "Tales", desc: "32 contes r\xE9els qui font \xE9cho \xE0 tes r\xEAves", route: "conte-miroir" },
      { glyph: "\u2737", label: "Portrait Lettre", desc: "ce qui vit en toi en ce moment", route: "portrait" }
    ]
  },
  {
    key: "reconnexion",
    glyph: "\u2728",
    title: "Je veux me reconnecter \xE0 mes r\xEAves",
    hook: "Tu as perdu le fil. Pas grave. Dream rouvre la porte sans forcer, par le corps et le quotidien.",
    steps: [
      { num: 1, text: "Commence par une note de jour, un fragment, une sensation au r\xE9veil \u2014 pas besoin d'un r\xEAve complet." },
      { num: 2, text: "Le Mode Lucid (dans Explorer) propose des reality-checks doux qui \xE9paississent la m\xE9moire onirique." },
      { num: 3, text: { __html: "Ton corps redevient sismographe via Oracle du Corps (10 cartes vivantes)." } },
      { num: 4, text: "Au bout de 7-14 jours, les fragments commencent \xE0 former des images. Tu r\xEAves d\xE9j\xE0 \u2014 tu les attrapes maintenant." },
      { num: 5, text: { __html: `Dream te demandera doucement : "qu'est-ce qui shift dans ton corps ?" apr\xE8s chaque lecture. Pas obligatoire.` } }
    ],
    terms: ["kairos", "felt_shift", "trauma_safe", "kairomancer"],
    subApps: [
      { glyph: "\u25C9", label: "Oracle du Corps", desc: "10 cartes pour relire les sensations", route: "oracle-corps" },
      { glyph: "\u25D0", label: "Mode Lucid", desc: "reality-checks doux pour \xE9paissir la m\xE9moire", route: "lucid-profile" },
      { glyph: "\u274B", label: "Cauchemars & Deuil", desc: "sanctuaire pour ce qui p\xE8se", route: "nightmares" }
    ]
  },
  {
    key: "chercheur",
    glyph: "\u2609",
    title: "Je cherche du sens dans ma vie",
    hook: "Dream n'est pas un journal de r\xEAves. C'est une mati\xE8re vivante qui \xE9claire ta vie de jour.",
    steps: [
      { num: 1, text: "D\xE9pose tes kairos \u2014 pas seulement les r\xEAves : signes diurnes, frissons, synchronicit\xE9s. Six types au total." },
      { num: 2, text: "Swipe gauche depuis l'accueil pour voir ton Journal de Vie LUMINEUX \u2014 la couche jour qui compl\xE8te la nuit." },
      { num: 3, text: { __html: "Pose une question dans le journal et tape \u2726 \u2014 la sagesse des kairos cherche les r\xEAves pass\xE9s qui r\xE9pondent." } },
      { num: 4, text: { __html: "Anima Mundi te montre ce que r\xEAve le monde anonymement \u2014 m\xE9t\xE9o, polyphonie, big dreams partag\xE9s." } },
      { num: 5, text: "Les Cercles (Explorer) te connectent \xE0 3-12 autres r\xEAveurs qui tissent ensemble \u2014 pas social, intime." }
    ],
    terms: ["kairos", "anima_mundi", "sagesse_des_kairos", "portrait_lettre", "tenir"],
    subApps: [
      { glyph: "\u25D0", label: "Anima Mundi", desc: "le r\xEAve du monde \u2014 m\xE9t\xE9o, annales, polyphonie", route: "anima" },
      { glyph: "\u25CB", label: "Cercles", desc: "3-12 r\xEAveurs qui tissent ensemble", route: "cercle" },
      { glyph: "\u2737", label: "Portrait Lettre", desc: "ta lettre du moment, \xE9crite par l'IA", route: "portrait" }
    ]
  }
];
const PersonaCard = ({ persona, active, onTap }) => /* @__PURE__ */ React.createElement(
  "button",
  {
    onClick: onTap,
    "aria-label": `parcours ${persona.title}`,
    "aria-pressed": active,
    style: {
      display: "grid",
      gridTemplateColumns: "32px 1fr 16px",
      alignItems: "center",
      gap: 14,
      width: "100%",
      textAlign: "left",
      background: active ? "color-mix(in oklch, var(--silk-gold) 10%, color-mix(in oklch, var(--night-warm) 50%, transparent))" : "color-mix(in oklch, var(--night-warm) 40%, transparent)",
      border: active ? "1px solid color-mix(in oklch, var(--silk-gold) 45%, var(--bone))" : "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
      cursor: "pointer",
      padding: "14px 16px",
      color: "var(--bone)",
      fontFamily: "var(--serif)",
      transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
      minHeight: 60,
      marginBottom: 8
    }
  },
  /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    fontSize: 22,
    textAlign: "center",
    opacity: active ? 1 : 0.85
  } }, persona.glyph),
  /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    color: "var(--bone)",
    opacity: active ? 1 : 0.88,
    lineHeight: 1.4,
    letterSpacing: "0.005em",
    textWrap: "pretty"
  } }, persona.title),
  /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    fontSize: 14,
    color: active ? "var(--silk-gold)" : "var(--ash-light)",
    opacity: active ? 1 : 0.45,
    textAlign: "center",
    fontFamily: "var(--serif)",
    transition: "color 280ms ease, opacity 280ms ease"
  } }, active ? "\u2713" : "\u2192")
);
const PersonaJourney = ({ persona, go }) => {
  const TermDef = window.TermDef;
  const renderStepText = (step) => {
    var _a;
    if (typeof step.text === "object" && ((_a = step.text) == null ? void 0 : _a.__html)) {
      return /* @__PURE__ */ React.createElement("span", { dangerouslySetInnerHTML: step.text });
    }
    return /* @__PURE__ */ React.createElement("span", null, step.text);
  };
  return /* @__PURE__ */ React.createElement("section", { style: {
    animation: "comment-section-in 480ms ease-out both"
  } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 16,
    lineHeight: 1.55,
    color: "var(--bone)",
    opacity: 0.92,
    margin: "0 0 22px",
    textWrap: "pretty"
  } }, persona.hook), /* @__PURE__ */ React.createElement("div", { style: {
    marginBottom: 28
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ash-light)",
    opacity: 0.5,
    marginBottom: 12
  } }, "ton parcours d'entr\xE9e"), persona.steps.map((step) => /* @__PURE__ */ React.createElement("div", { key: step.num, style: {
    display: "grid",
    gridTemplateColumns: "28px 1fr",
    gap: 12,
    alignItems: "start",
    marginBottom: 14
  } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 13,
    color: "var(--silk-gold)",
    opacity: 0.6,
    paddingTop: 2,
    textAlign: "center"
  } }, step.num), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14.5,
    lineHeight: 1.55,
    color: "var(--ash-light)",
    opacity: 0.92,
    margin: 0,
    textWrap: "pretty"
  } }, renderStepText(step))))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ash-light)",
    opacity: 0.5,
    marginBottom: 12
  } }, "termes que tu rencontreras"), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    padding: "12px 14px",
    background: "color-mix(in oklch, var(--night-warm) 30%, transparent)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))"
  } }, persona.terms.map((termKey) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement("span", { key: termKey, style: {
      fontFamily: "var(--serif)",
      fontSize: 14,
      color: "var(--bone)",
      lineHeight: 1.5
    } }, TermDef ? /* @__PURE__ */ React.createElement(TermDef, { term: termKey }) : /* @__PURE__ */ React.createElement("span", { style: { fontStyle: "italic" } }, ((_b = (_a = window.DREAM_GLOSSAIRE) == null ? void 0 : _a[termKey]) == null ? void 0 : _b.label) || termKey));
  })), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12,
    color: "var(--ash-light)",
    opacity: 0.6,
    margin: "8px 0 0",
    letterSpacing: "0.02em"
  } }, "tap-long sur un mot pour la d\xE9finition")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ash-light)",
    opacity: 0.5,
    marginBottom: 12
  } }, "sous-apps qui t'int\xE9resseront"), persona.subApps.map((app) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: app.label,
      onClick: () => go && go(app.route),
      style: {
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
        transition: "all 380ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 28%, var(--ash-deep))";
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 4%, color-mix(in oklch, var(--night-warm) 40%, transparent))";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))";
        e.currentTarget.style.background = "color-mix(in oklch, var(--night-warm) 30%, transparent)";
      }
    },
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      fontSize: 16,
      color: "var(--silk-gold)",
      opacity: 0.78,
      textAlign: "center",
      fontStyle: "italic"
    } }, app.glyph),
    /* @__PURE__ */ React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "var(--sans)",
      fontSize: 14.5,
      color: "var(--bone)",
      fontWeight: 400,
      letterSpacing: "0.005em"
    } }, app.label), /* @__PURE__ */ React.createElement("span", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 12.5,
      color: "var(--ash-light)",
      opacity: 0.7,
      lineHeight: 1.4,
      textWrap: "pretty"
    } }, app.desc)),
    /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
      fontSize: 13,
      color: "var(--ash-light)",
      opacity: 0.45,
      textAlign: "center",
      fontFamily: "var(--serif)"
    } }, "\u2192")
  ))));
};
const CommentScreen = ({ go }) => {
  const [selected, setSelected] = cmS(() => {
    const detected = detectPersona();
    return detected || null;
  });
  const persona = selected ? PERSONAS.find((p) => p.key === selected) : null;
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    background: "var(--night-floor)",
    color: "var(--bone)",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative",
    overflow: "hidden"
  } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.18,
    zIndex: 0
  } }, /* @__PURE__ */ React.createElement("svg", { width: "100%", height: "100%", preserveAspectRatio: "none", style: { display: "block" } }, /* @__PURE__ */ React.createElement("rect", { width: "100%", height: "100%", filter: "url(#noise-ash)" }))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "0 22px 14px",
    maxWidth: 580,
    margin: "0 auto"
  } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("explorer"),
      "aria-label": "retour \xE0 explorer",
      style: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        color: "var(--ash-light)",
        opacity: 0.6,
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "4px 0",
        letterSpacing: "0.02em"
      },
      onMouseEnter: (e) => e.currentTarget.style.opacity = 1,
      onMouseLeave: (e) => e.currentTarget.style.opacity = 0.6
    },
    "\u2190 explorer"
  )), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "0 22px 24px",
    maxWidth: 580,
    margin: "0 auto",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 26,
    color: "var(--bone)",
    margin: 0,
    marginBottom: 10,
    letterSpacing: "0.005em"
  } }, "Comment Dream marche"), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    width: 48,
    height: 1,
    background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
    margin: "0 auto 12px"
  } }), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14,
    color: "var(--ash-light)",
    opacity: 0.78,
    margin: 0,
    letterSpacing: "0.02em"
  } }, "Trouve ton entr\xE9e selon ce que tu cherches.")), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "0 18px",
    maxWidth: 580,
    margin: "0 auto",
    marginBottom: 22
  } }, PERSONAS.map((p) => /* @__PURE__ */ React.createElement(
    PersonaCard,
    {
      key: p.key,
      persona: p,
      active: selected === p.key,
      onTap: () => setSelected(p.key)
    }
  ))), persona && /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "0 22px",
    maxWidth: 580,
    margin: "0 auto",
    marginTop: 8
  } }, /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    width: 48,
    height: 1,
    background: "color-mix(in oklch, var(--silk-gold) 18%, transparent)",
    margin: "0 auto 22px"
  } }), /* @__PURE__ */ React.createElement(PersonaJourney, { persona, go })), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "32px 22px 0",
    maxWidth: 580,
    margin: "0 auto",
    textAlign: "center"
  } }, /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    color: "var(--ash-light)",
    opacity: 0.62,
    margin: "0 0 12px",
    letterSpacing: "0.02em",
    lineHeight: 1.55,
    textWrap: "pretty"
  } }, 'Toutes les portes sont accessibles via "explorer" en bas.'), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("glossaire"),
      style: {
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
        color: "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))",
        fontFamily: "var(--serif)",
        fontStyle: "italic",
        fontSize: 13,
        padding: "8px 18px",
        cursor: "pointer",
        letterSpacing: "0.02em",
        transition: "all 280ms ease"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 8%, transparent)";
        e.currentTarget.style.color = "var(--silk-gold)";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "color-mix(in oklch, var(--silk-gold) 80%, var(--bone))";
      }
    },
    "glossaire complet \u2192"
  )), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes comment-section-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `));
};
Object.assign(window, {
  CommentScreen,
  PERSONAS
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1jb21tZW50LmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERyZWFtIFYxLjIgXHUyMDE0IFBhZ2UgXCJDb21tZW50IFx1MDBFN2EgbWFyY2hlXCIgKFNwcmludCBQMC40IFx1MjAxNCAyMDI2LTA0LTI3KVxuLy8gRGVzaWduIFx1MDBBNzExLmJpcy4xOCBcdTIwMTQgRkFRIHBhciBwZXJzb25hICsgZ2xvc3NhaXJlIGludFx1MDBFOWdyXHUwMEU5LlxuLy9cbi8vIFJFTVBMQUNFIGxlIHN0dWIgQ29tbWVudFNjcmVlbiBkZSBzY3JlZW5zLWV4cGxvcmVyLmpzeCAoMyBwYXJhZ3JhcGhlc1xuLy8gc3RhdGlxdWVzKSBwYXIgdW5lIHZyYWllIHBhZ2UgZCdvcmllbnRhdGlvbiA6IDMgY2FyZHMgcGVyc29uYSBlblxuLy8gc1x1MDBFOWxlY3Rpb24sIHBhcmNvdXJzIGQnZW50clx1MDBFOWUgY29uY3JldCwgdGVybWVzIHJlbmNvbnRyXHUwMEU5cyAoVGVybURlZiksXG4vLyBzb3VzLWFwcHMgcXVpIG1hdGNoZW50LCBsaWVuIHZlcnMgZ2xvc3NhaXJlIGNvbXBsZXQuXG4vL1xuLy8gQXV0by1zZWxlY3QgbGUgcGVyc29uYSB2aWEgbG9jYWxTdG9yYWdlW1wiZHJlYW06b25ib2FyZGluZy1wcm9maWxlXCJdXG4vLyBzaSBkXHUwMEU5ZmluaSAoaXNzdSBkZSBsJ29uYm9hcmRpbmcgcml0dWVsIEIrRCkuXG4vL1xuLy8gUGF0dGVybnMgZG9taW5hbnRzIDpcbi8vICAgLSBESVNDT1ZFUkFCTEVfREVQVEggKFAtWlx1MDBFOXJvIFx1MDBBNzIuMSkgXHUyMDE0IGwndXRpbGlzYXRldXIgY2hvaXNpdCBzb25cbi8vICAgICBlbnRyXHUwMEU5ZSwgRHJlYW0gbmUgbHVpIGltcG9zZSBwYXMgdW4gcGFyY291cnMgdW5pcXVlXG4vLyAgIC0gSElcdTAwQzlSQVJDSElFIEVYUExJQ0lURSAoQmlibGUgXHUwMEE3MS42KSBcdTIwMTQgMSBzdGVwIHBhciBudW1cdTAwRTlybywgbWF4IDVcbi8vICAgLSBHTE9TU0FJUkUgSU5UXHUwMEM5R1JcdTAwQzkgKFNwcmludCBQMC40KSBcdTIwMTQgVGVybURlZiBwYXJ0b3V0IHBvdXIgclx1MDBFOXZcdTAwRTlsZXJcbi8vICAgICBsZXMgdGVybWVzIHNwXHUwMEU5Y2lhbGlzXHUwMEU5cyBzYW5zIGFsb3VyZGlyIGxlIHRleHRlXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgeyB1c2VTdGF0ZTogY21TLCB1c2VFZmZlY3Q6IGNtRSB9ID0gUmVhY3Q7XG5cbi8vIFx1MjUwMFx1MjUwMCBNYXBwaW5nIHBlcnNvbmEgb25ib2FyZGluZyBcdTIxOTIga2V5IGludGVybmUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBMJ29uYm9hcmRpbmcgcml0dWVsIHN0b2NrZSBsb2NhbFN0b3JhZ2VbXCJkcmVhbTpvbmJvYXJkaW5nLXByb2ZpbGVcIl1cbi8vIGF2ZWMgbGVzIHZhbGV1cnMgOiBcInJldmVyLXNvdXZlbnRcIiAvIFwicmVjb25uZXhpb25cIiAvIFwiY2hlcmNoZXVyLXNlbnNcIlxuLy8gKG91IGRlcyBwcm9jaGVzIFx1MjAxNCBvbiB0b2xcdTAwRThyZSBwbHVzaWV1cnMgYWxpYXNlcykuXG5jb25zdCBQUk9GSUxFX0FMSUFTRVMgPSB7XG4gIFwicmV2ZXItc291dmVudFwiOiBcInJldmV1clwiLFxuICBcInJcdTAwRUF2ZXVyXCI6IFwicmV2ZXVyXCIsXG4gIFwicmV2ZXJcIjogXCJyZXZldXJcIixcbiAgXCJyZXZldXJcIjogXCJyZXZldXJcIixcbiAgXCJyZWNvbm5leGlvblwiOiBcInJlY29ubmV4aW9uXCIsXG4gIFwic2UtcmVjb25uZWN0ZXJcIjogXCJyZWNvbm5leGlvblwiLFxuICBcImNoZXJjaGV1ci1zZW5zXCI6IFwiY2hlcmNoZXVyXCIsXG4gIFwiY2hlcmNoZXVyXCI6IFwiY2hlcmNoZXVyXCIsXG4gIFwic2Vuc1wiOiBcImNoZXJjaGV1clwiLFxufTtcblxuZnVuY3Rpb24gZGV0ZWN0UGVyc29uYSgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByYXcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRyZWFtOm9uYm9hcmRpbmctcHJvZmlsZVwiKTtcbiAgICBpZiAoIXJhdykgcmV0dXJuIG51bGw7XG4gICAgY29uc3Qgbm9ybSA9IHJhdy50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICByZXR1cm4gUFJPRklMRV9BTElBU0VTW25vcm1dIHx8IG51bGw7XG4gIH0gY2F0Y2ggeyByZXR1cm4gbnVsbDsgfVxufVxuXG4vLyBcdTI1MDBcdTI1MDAgRFx1MDBFOWZpbml0aW9uIGRlcyAzIHBhcmNvdXJzIHBlcnNvbmEgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBDaGFxdWUgcGFyY291cnMgPSB7IGdseXBoLCB0aXRsZSwgaG9vaywgc3RlcHNbXSwgdGVybXNbXSwgc3ViQXBwc1tdIH1cbi8vICAgLSBzdGVwcyA6IGFycmF5IGRlIHtudW0sIHRleHR9IFx1MjAxNCB0ZXh0IHBldXQgY29udGVuaXIgPFRlcm1EZWY+XG4vLyAgIC0gdGVybXMgOiBsaXN0ZSBkZXMga2V5cyBnbG9zc2FpcmUgXHUwMEUwIG1ldHRyZSBlbiBcdTAwRTl2aWRlbmNlXG4vLyAgIC0gc3ViQXBwcyA6IHNvdXMtYXBwcyBxdWkgclx1MDBFOXNvbm5lbnQgYXZlYyBjZSBwcm9maWxcbmNvbnN0IFBFUlNPTkFTID0gW1xuICB7XG4gICAga2V5OiBcInJldmV1clwiLFxuICAgIGdseXBoOiBcIlx1RDgzQ1x1REYxOVwiLFxuICAgIHRpdGxlOiBcIkplIHJcdTAwRUF2ZSBzb3V2ZW50IGV0IHZldXggbGVzIGNvbXByZW5kcmVcIixcbiAgICBob29rOiBcIlR1IGFzIGRcdTAwRTlqXHUwMEUwIHVuZSBtXHUwMEU5bW9pcmUgb25pcmlxdWUgdml2YW50ZS4gRHJlYW0gdmEgdCdhaWRlciBcdTAwRTAgdm9pciBsZXMgcGF0dGVybnMgcXVpIHQnXHUwMEU5Y2hhcHBlbnQuXCIsXG4gICAgc3RlcHM6IFtcbiAgICAgIHsgbnVtOiAxLCB0ZXh0OiBcIkxlIG1hdGluLCBvdXZyZSBsJ2FwcCBldCBkXHUwMEU5cG9zZXIgdG9uIHJcdTAwRUF2ZSAoMSBtaW51dGUsIGMnZXN0IHRvdXQpLlwiIH0sXG4gICAgICB7IG51bTogMiwgdGV4dDogXCJBdSBib3V0IGRlIHF1ZWxxdWVzIHJcdTAwRUF2ZXMsIGwnYXBwIGNvbW1lbmNlIFx1MDBFMCB2b2lyIGRlcyBwYXR0ZXJucyBcdTIwMTQgZmlndXJlcyBxdWkgcmV2aWVubmVudCwgbGlldXggclx1MDBFOWN1cnJlbnRzLCBcdTAwRTltb3Rpb25zIHRpc3NcdTAwRTllcy5cIiB9LFxuICAgICAgeyBudW06IDMsIHRleHQ6IHsgX19odG1sOiBcIlRhcGUgXHUyNzI2IFxcXCJzYWdlc3NlXFxcIiBzdXIgbidpbXBvcnRlIHF1ZWxsZSBxdWVzdGlvbiBwb3VyIHJlbGllciByXHUwMEVBdmVzIHBhc3NcdTAwRTlzIFx1MDBFMCB0b24gcHJcdTAwRTlzZW50LlwiIH0gfSxcbiAgICAgIHsgbnVtOiA0LCB0ZXh0OiB7IF9faHRtbDogXCJBdSBib3V0IGQndW5lIGx1bmUsIGRlbWFuZGUgXHUwMEUwIGwnYXBwIHVuZSBcXFwibGV0dHJlIGR1IG1vbWVudFxcXCIgXHUyMDE0IGwnSUEgbmFycmF0cmljZSBcdTAwRTljcml0IGNlIHF1aSB0ZSB0cmF2ZXJzZS5cIiB9IH0sXG4gICAgICB7IG51bTogNSwgdGV4dDogXCJEXHUwMEU5Y291dnJlIGxlcyBwcm90b2NvbGVzIGd1aWRcdTAwRTlzIChkZXB1aXMgXHUyMzA0KSBwb3VyIGFsbGVyIHBsdXMgcHJvZm9uZCBcdTIwMTQgaW5jdWJhdGlvbiwgZGlhbG9ndWUgZGUgZmlndXJlLCByZW50cnkuXCIgfSxcbiAgICBdLFxuICAgIHRlcm1zOiBbXCJrYWlyb3NcIiwgXCJvbmRpbm5vbmtcIiwgXCJmcmFtZXdvcmtfMlwiLCBcInBvbHlwaG9uaWVcIl0sXG4gICAgc3ViQXBwczogW1xuICAgICAgeyBnbHlwaDogXCJcdTI1RDBcIiwgbGFiZWw6IFwiTW9kZSBMdWNpZFwiLCBkZXNjOiBcInNpIHR1IHZldXggcHJhdGlxdWVyIGxlIHJcdTAwRUF2ZSBsdWNpZGVcIiwgcm91dGU6IFwibHVjaWQtcHJvZmlsZVwiIH0sXG4gICAgICB7IGdseXBoOiBcIlx1Mjc0QlwiLCBsYWJlbDogXCJUYWxlc1wiLCBkZXNjOiBcIjMyIGNvbnRlcyByXHUwMEU5ZWxzIHF1aSBmb250IFx1MDBFOWNobyBcdTAwRTAgdGVzIHJcdTAwRUF2ZXNcIiwgcm91dGU6IFwiY29udGUtbWlyb2lyXCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUyNzM3XCIsIGxhYmVsOiBcIlBvcnRyYWl0IExldHRyZVwiLCBkZXNjOiBcImNlIHF1aSB2aXQgZW4gdG9pIGVuIGNlIG1vbWVudFwiLCByb3V0ZTogXCJwb3J0cmFpdFwiIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGtleTogXCJyZWNvbm5leGlvblwiLFxuICAgIGdseXBoOiBcIlx1MjcyOFwiLFxuICAgIHRpdGxlOiBcIkplIHZldXggbWUgcmVjb25uZWN0ZXIgXHUwMEUwIG1lcyByXHUwMEVBdmVzXCIsXG4gICAgaG9vazogXCJUdSBhcyBwZXJkdSBsZSBmaWwuIFBhcyBncmF2ZS4gRHJlYW0gcm91dnJlIGxhIHBvcnRlIHNhbnMgZm9yY2VyLCBwYXIgbGUgY29ycHMgZXQgbGUgcXVvdGlkaWVuLlwiLFxuICAgIHN0ZXBzOiBbXG4gICAgICB7IG51bTogMSwgdGV4dDogXCJDb21tZW5jZSBwYXIgdW5lIG5vdGUgZGUgam91ciwgdW4gZnJhZ21lbnQsIHVuZSBzZW5zYXRpb24gYXUgclx1MDBFOXZlaWwgXHUyMDE0IHBhcyBiZXNvaW4gZCd1biByXHUwMEVBdmUgY29tcGxldC5cIiB9LFxuICAgICAgeyBudW06IDIsIHRleHQ6IFwiTGUgTW9kZSBMdWNpZCAoZGFucyBFeHBsb3JlcikgcHJvcG9zZSBkZXMgcmVhbGl0eS1jaGVja3MgZG91eCBxdWkgXHUwMEU5cGFpc3Npc3NlbnQgbGEgbVx1MDBFOW1vaXJlIG9uaXJpcXVlLlwiIH0sXG4gICAgICB7IG51bTogMywgdGV4dDogeyBfX2h0bWw6IFwiVG9uIGNvcnBzIHJlZGV2aWVudCBzaXNtb2dyYXBoZSB2aWEgT3JhY2xlIGR1IENvcnBzICgxMCBjYXJ0ZXMgdml2YW50ZXMpLlwiIH0gfSxcbiAgICAgIHsgbnVtOiA0LCB0ZXh0OiBcIkF1IGJvdXQgZGUgNy0xNCBqb3VycywgbGVzIGZyYWdtZW50cyBjb21tZW5jZW50IFx1MDBFMCBmb3JtZXIgZGVzIGltYWdlcy4gVHUgclx1MDBFQXZlcyBkXHUwMEU5alx1MDBFMCBcdTIwMTQgdHUgbGVzIGF0dHJhcGVzIG1haW50ZW5hbnQuXCIgfSxcbiAgICAgIHsgbnVtOiA1LCB0ZXh0OiB7IF9faHRtbDogXCJEcmVhbSB0ZSBkZW1hbmRlcmEgZG91Y2VtZW50IDogXFxcInF1J2VzdC1jZSBxdWkgc2hpZnQgZGFucyB0b24gY29ycHMgP1xcXCIgYXByXHUwMEU4cyBjaGFxdWUgbGVjdHVyZS4gUGFzIG9ibGlnYXRvaXJlLlwiIH0gfSxcbiAgICBdLFxuICAgIHRlcm1zOiBbXCJrYWlyb3NcIiwgXCJmZWx0X3NoaWZ0XCIsIFwidHJhdW1hX3NhZmVcIiwgXCJrYWlyb21hbmNlclwiXSxcbiAgICBzdWJBcHBzOiBbXG4gICAgICB7IGdseXBoOiBcIlx1MjVDOVwiLCBsYWJlbDogXCJPcmFjbGUgZHUgQ29ycHNcIiwgZGVzYzogXCIxMCBjYXJ0ZXMgcG91ciByZWxpcmUgbGVzIHNlbnNhdGlvbnNcIiwgcm91dGU6IFwib3JhY2xlLWNvcnBzXCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUyNUQwXCIsIGxhYmVsOiBcIk1vZGUgTHVjaWRcIiwgZGVzYzogXCJyZWFsaXR5LWNoZWNrcyBkb3V4IHBvdXIgXHUwMEU5cGFpc3NpciBsYSBtXHUwMEU5bW9pcmVcIiwgcm91dGU6IFwibHVjaWQtcHJvZmlsZVwiIH0sXG4gICAgICB7IGdseXBoOiBcIlx1Mjc0QlwiLCBsYWJlbDogXCJDYXVjaGVtYXJzICYgRGV1aWxcIiwgZGVzYzogXCJzYW5jdHVhaXJlIHBvdXIgY2UgcXVpIHBcdTAwRThzZVwiLCByb3V0ZTogXCJuaWdodG1hcmVzXCIgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAga2V5OiBcImNoZXJjaGV1clwiLFxuICAgIGdseXBoOiBcIlx1MjYwOVwiLFxuICAgIHRpdGxlOiBcIkplIGNoZXJjaGUgZHUgc2VucyBkYW5zIG1hIHZpZVwiLFxuICAgIGhvb2s6IFwiRHJlYW0gbidlc3QgcGFzIHVuIGpvdXJuYWwgZGUgclx1MDBFQXZlcy4gQydlc3QgdW5lIG1hdGlcdTAwRThyZSB2aXZhbnRlIHF1aSBcdTAwRTljbGFpcmUgdGEgdmllIGRlIGpvdXIuXCIsXG4gICAgc3RlcHM6IFtcbiAgICAgIHsgbnVtOiAxLCB0ZXh0OiBcIkRcdTAwRTlwb3NlIHRlcyBrYWlyb3MgXHUyMDE0IHBhcyBzZXVsZW1lbnQgbGVzIHJcdTAwRUF2ZXMgOiBzaWduZXMgZGl1cm5lcywgZnJpc3NvbnMsIHN5bmNocm9uaWNpdFx1MDBFOXMuIFNpeCB0eXBlcyBhdSB0b3RhbC5cIiB9LFxuICAgICAgeyBudW06IDIsIHRleHQ6IFwiU3dpcGUgZ2F1Y2hlIGRlcHVpcyBsJ2FjY3VlaWwgcG91ciB2b2lyIHRvbiBKb3VybmFsIGRlIFZpZSBMVU1JTkVVWCBcdTIwMTQgbGEgY291Y2hlIGpvdXIgcXVpIGNvbXBsXHUwMEU4dGUgbGEgbnVpdC5cIiB9LFxuICAgICAgeyBudW06IDMsIHRleHQ6IHsgX19odG1sOiBcIlBvc2UgdW5lIHF1ZXN0aW9uIGRhbnMgbGUgam91cm5hbCBldCB0YXBlIFx1MjcyNiBcdTIwMTQgbGEgc2FnZXNzZSBkZXMga2Fpcm9zIGNoZXJjaGUgbGVzIHJcdTAwRUF2ZXMgcGFzc1x1MDBFOXMgcXVpIHJcdTAwRTlwb25kZW50LlwiIH0gfSxcbiAgICAgIHsgbnVtOiA0LCB0ZXh0OiB7IF9faHRtbDogXCJBbmltYSBNdW5kaSB0ZSBtb250cmUgY2UgcXVlIHJcdTAwRUF2ZSBsZSBtb25kZSBhbm9ueW1lbWVudCBcdTIwMTQgbVx1MDBFOXRcdTAwRTlvLCBwb2x5cGhvbmllLCBiaWcgZHJlYW1zIHBhcnRhZ1x1MDBFOXMuXCIgfSB9LFxuICAgICAgeyBudW06IDUsIHRleHQ6IFwiTGVzIENlcmNsZXMgKEV4cGxvcmVyKSB0ZSBjb25uZWN0ZW50IFx1MDBFMCAzLTEyIGF1dHJlcyByXHUwMEVBdmV1cnMgcXVpIHRpc3NlbnQgZW5zZW1ibGUgXHUyMDE0IHBhcyBzb2NpYWwsIGludGltZS5cIiB9LFxuICAgIF0sXG4gICAgdGVybXM6IFtcImthaXJvc1wiLCBcImFuaW1hX211bmRpXCIsIFwic2FnZXNzZV9kZXNfa2Fpcm9zXCIsIFwicG9ydHJhaXRfbGV0dHJlXCIsIFwidGVuaXJcIl0sXG4gICAgc3ViQXBwczogW1xuICAgICAgeyBnbHlwaDogXCJcdTI1RDBcIiwgbGFiZWw6IFwiQW5pbWEgTXVuZGlcIiwgZGVzYzogXCJsZSByXHUwMEVBdmUgZHUgbW9uZGUgXHUyMDE0IG1cdTAwRTl0XHUwMEU5bywgYW5uYWxlcywgcG9seXBob25pZVwiLCByb3V0ZTogXCJhbmltYVwiIH0sXG4gICAgICB7IGdseXBoOiBcIlx1MjVDQlwiLCBsYWJlbDogXCJDZXJjbGVzXCIsIGRlc2M6IFwiMy0xMiByXHUwMEVBdmV1cnMgcXVpIHRpc3NlbnQgZW5zZW1ibGVcIiwgcm91dGU6IFwiY2VyY2xlXCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUyNzM3XCIsIGxhYmVsOiBcIlBvcnRyYWl0IExldHRyZVwiLCBkZXNjOiBcInRhIGxldHRyZSBkdSBtb21lbnQsIFx1MDBFOWNyaXRlIHBhciBsJ0lBXCIsIHJvdXRlOiBcInBvcnRyYWl0XCIgfSxcbiAgICBdLFxuICB9LFxuXTtcblxuLy8gXHUyNTAwXHUyNTAwIENhcmQgcGVyc29uYSAoc1x1MDBFOWxlY3Rpb24pIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgUGVyc29uYUNhcmQgPSAoeyBwZXJzb25hLCBhY3RpdmUsIG9uVGFwIH0pID0+IChcbiAgPGJ1dHRvblxuICAgIG9uQ2xpY2s9e29uVGFwfVxuICAgIGFyaWEtbGFiZWw9e2BwYXJjb3VycyAke3BlcnNvbmEudGl0bGV9YH1cbiAgICBhcmlhLXByZXNzZWQ9e2FjdGl2ZX1cbiAgICBzdHlsZT17e1xuICAgICAgZGlzcGxheTogXCJncmlkXCIsXG4gICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiBcIjMycHggMWZyIDE2cHhcIixcbiAgICAgIGFsaWduSXRlbXM6IFwiY2VudGVyXCIsXG4gICAgICBnYXA6IDE0LFxuICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgdGV4dEFsaWduOiBcImxlZnRcIixcbiAgICAgIGJhY2tncm91bmQ6IGFjdGl2ZVxuICAgICAgICA/IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEwJSwgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA1MCUsIHRyYW5zcGFyZW50KSlcIlxuICAgICAgICA6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA0MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgYm9yZGVyOiBhY3RpdmVcbiAgICAgICAgPyBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNDUlLCB2YXIoLS1ib25lKSlcIlxuICAgICAgICA6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gICAgICBwYWRkaW5nOiBcIjE0cHggMTZweFwiLFxuICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSlcIixcbiAgICAgIG1pbkhlaWdodDogNjAsXG4gICAgICBtYXJnaW5Cb3R0b206IDgsXG4gICAgfX1cbiAgPlxuICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICBmb250U2l6ZTogMjIsIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgIG9wYWNpdHk6IGFjdGl2ZSA/IDEgOiAwLjg1LFxuICAgIH19PntwZXJzb25hLmdseXBofTwvc3Bhbj5cbiAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgZm9udFNpemU6IDE1LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgb3BhY2l0eTogYWN0aXZlID8gMSA6IDAuODgsXG4gICAgICBsaW5lSGVpZ2h0OiAxLjQsIGxldHRlclNwYWNpbmc6IFwiMC4wMDVlbVwiLFxuICAgICAgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgfX0+e3BlcnNvbmEudGl0bGV9PC9zcGFuPlxuICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICBmb250U2l6ZTogMTQsXG4gICAgICBjb2xvcjogYWN0aXZlID8gXCJ2YXIoLS1zaWxrLWdvbGQpXCIgOiBcInZhcigtLWFzaC1saWdodClcIixcbiAgICAgIG9wYWNpdHk6IGFjdGl2ZSA/IDEgOiAwLjQ1LFxuICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgIHRyYW5zaXRpb246IFwiY29sb3IgMjgwbXMgZWFzZSwgb3BhY2l0eSAyODBtcyBlYXNlXCIsXG4gICAgfX0+e2FjdGl2ZSA/IFwiXHUyNzEzXCIgOiBcIlx1MjE5MlwifTwvc3Bhbj5cbiAgPC9idXR0b24+XG4pO1xuXG4vLyBcdTI1MDBcdTI1MDAgUmVuZGVyIHBhcmNvdXJzIGQndW4gcGVyc29uYSAoZFx1MDBFOXJvdWxcdTAwRTkpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgUGVyc29uYUpvdXJuZXkgPSAoeyBwZXJzb25hLCBnbyB9KSA9PiB7XG4gIGNvbnN0IFRlcm1EZWYgPSB3aW5kb3cuVGVybURlZjtcbiAgY29uc3QgcmVuZGVyU3RlcFRleHQgPSAoc3RlcCkgPT4ge1xuICAgIC8vIFNpIHN0ZXAudGV4dCBlc3QgdW4gb2JqZXQgX19odG1sLCBvbiBpbmplY3RlIGxlIEhUTUwgYnJ1dCB0ZWwgcXVlbFxuICAgIC8vIChjYXMgb1x1MDBGOSBvbiBhIGJlc29pbiBkZSBtYXJrdXAgbFx1MDBFOWdlcikuIFNpbm9uIG9uIHJlbmRlciBwbGFpbiB0ZXh0LlxuICAgIGlmICh0eXBlb2Ygc3RlcC50ZXh0ID09PSBcIm9iamVjdFwiICYmIHN0ZXAudGV4dD8uX19odG1sKSB7XG4gICAgICByZXR1cm4gPHNwYW4gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3N0ZXAudGV4dH0gLz47XG4gICAgfVxuICAgIHJldHVybiA8c3Bhbj57c3RlcC50ZXh0fTwvc3Bhbj47XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8c2VjdGlvbiBzdHlsZT17e1xuICAgICAgYW5pbWF0aW9uOiBcImNvbW1lbnQtc2VjdGlvbi1pbiA0ODBtcyBlYXNlLW91dCBib3RoXCIsXG4gICAgfX0+XG4gICAgICB7LyogSG9vayBvdXZyYW50ICovfVxuICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMTYsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG9wYWNpdHk6IDAuOTIsXG4gICAgICAgIG1hcmdpbjogXCIwIDAgMjJweFwiLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgIH19PntwZXJzb25hLmhvb2t9PC9wPlxuXG4gICAgICB7LyogU3RlcHMgbnVtXHUwMEU5cm90XHUwMEU5cyAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgbWFyZ2luQm90dG9tOiAyOCxcbiAgICAgIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vLCBtb25vc3BhY2UpXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxuICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgfX0+XG4gICAgICAgICAgdG9uIHBhcmNvdXJzIGQnZW50clx1MDBFOWVcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtwZXJzb25hLnN0ZXBzLm1hcCgoc3RlcCkgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtzdGVwLm51bX0gc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIyOHB4IDFmclwiLFxuICAgICAgICAgICAgZ2FwOiAxMixcbiAgICAgICAgICAgIGFsaWduSXRlbXM6IFwic3RhcnRcIixcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTQsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8sIG1vbm9zcGFjZSlcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuNiwgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgfX0+e3N0ZXAubnVtfTwvc3Bhbj5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LjUsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC45MixcbiAgICAgICAgICAgICAgbWFyZ2luOiAwLCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgIH19PntyZW5kZXJTdGVwVGV4dChzdGVwKX08L3A+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBUZXJtZXMgcmVuY29udHJcdTAwRTlzIChUZXJtRGVmIGNoaXBzKSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luQm90dG9tOiAyOCB9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubywgbW9ub3NwYWNlKVwiLFxuICAgICAgICAgIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjE2ZW1cIixcbiAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC41LFxuICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHRlcm1lcyBxdWUgdHUgcmVuY29udHJlcmFzXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhXcmFwOiBcIndyYXBcIiwgZ2FwOiAxMixcbiAgICAgICAgICBwYWRkaW5nOiBcIjEycHggMTRweFwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEwJSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7cGVyc29uYS50ZXJtcy5tYXAoKHRlcm1LZXkpID0+IChcbiAgICAgICAgICAgIDxzcGFuIGtleT17dGVybUtleX0gc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjUsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge1Rlcm1EZWZcbiAgICAgICAgICAgICAgICA/IDxUZXJtRGVmIHRlcm09e3Rlcm1LZXl9IC8+XG4gICAgICAgICAgICAgICAgOiA8c3BhbiBzdHlsZT17eyBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+e3dpbmRvdy5EUkVBTV9HTE9TU0FJUkU/Llt0ZXJtS2V5XT8ubGFiZWwgfHwgdGVybUtleX08L3NwYW4+fVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEyLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgb3BhY2l0eTogMC42LCBtYXJnaW46IFwiOHB4IDAgMFwiLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICB9fT50YXAtbG9uZyBzdXIgdW4gbW90IHBvdXIgbGEgZFx1MDBFOWZpbml0aW9uPC9wPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTb3VzLWFwcHMgcXVpIHQnaW50XHUwMEU5cmVzc2Vyb250ICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDEyIH19PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vLCBtb25vc3BhY2UpXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxuICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjUsXG4gICAgICAgICAgbWFyZ2luQm90dG9tOiAxMixcbiAgICAgICAgfX0+XG4gICAgICAgICAgc291cy1hcHBzIHF1aSB0J2ludFx1MDBFOXJlc3Nlcm9udFxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3BlcnNvbmEuc3ViQXBwcy5tYXAoKGFwcCkgPT4gKFxuICAgICAgICAgIDxidXR0b24ga2V5PXthcHAubGFiZWx9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhhcHAucm91dGUpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogXCJncmlkXCIsXG4gICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6IFwiMjhweCAxZnIgMTZweFwiLFxuICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgICAgICAgICBnYXA6IDE0LFxuICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogXCJsZWZ0XCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIxMnB4IDE0cHhcIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA2LFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzODBtcyBlYXNlXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IHtcbiAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMjglLCB2YXIoLS1hc2gtZGVlcCkpXCI7XG4gICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgNCUsIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgNDAlLCB0cmFuc3BhcmVudCkpXCI7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHtcbiAgICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTAlLCB2YXIoLS1hc2gtZGVlcCkpXCI7XG4gICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDMwJSwgdHJhbnNwYXJlbnQpXCI7XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNiwgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgICAgICBvcGFjaXR5OiAwLjc4LCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgIH19PnthcHAuZ2x5cGh9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogMiwgbWluV2lkdGg6IDAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zYW5zKVwiLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxNC41LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDQwMCwgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgICAgICAgIH19PnthcHAubGFiZWx9PC9zcGFuPlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIuNSwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNywgbGluZUhlaWdodDogMS40LCB0ZXh0V3JhcDogXCJwcmV0dHlcIixcbiAgICAgICAgICAgICAgfX0+e2FwcC5kZXNjfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMywgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICBvcGFjaXR5OiAwLjQ1LCB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICB9fT5cdTIxOTI8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuICApO1xufTtcblxuLy8gXHUyNTAwXHUyNTAwIENvbW1lbnRTY3JlZW4gXHUyMDE0IGNvbXBvc2FudCBwcmluY2lwYWwgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBBdXRvLXNlbGVjdCBwZXJzb25hIGR1IHVzZXIgYXUgbW91bnQgc2kgZFx1MDBFOXRlY3RcdTAwRTkuXG4vLyBPdmVycmlkZSBsZSBzdHViIGV4cG9ydFx1MDBFOSBwYXIgc2NyZWVucy1leHBsb3Jlci5qc3ggKGNoYXJnXHUwMEU5IGFwclx1MDBFOHMpLlxuY29uc3QgQ29tbWVudFNjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgW3NlbGVjdGVkLCBzZXRTZWxlY3RlZF0gPSBjbVMoKCkgPT4ge1xuICAgIGNvbnN0IGRldGVjdGVkID0gZGV0ZWN0UGVyc29uYSgpO1xuICAgIHJldHVybiBkZXRlY3RlZCB8fCBudWxsO1xuICB9KTtcblxuICAvLyBTaSBwYXMgZGUgcGVyc29uYSBhdXRvLWRcdTAwRTl0ZWN0XHUwMEU5LCBvbiBhdHRlbmQgcXVlIGwndXNlciBjaG9pc2lzc2VcbiAgLy8gKHBhcyBkJ2F1dG8tc1x1MDBFOWxlY3Rpb24gbXVldHRlIFx1MjE5MiByZXNwZWN0IGR1IGNob2l4IGNvbnNjaWVudCkuXG5cbiAgY29uc3QgcGVyc29uYSA9IHNlbGVjdGVkID8gUEVSU09OQVMuZmluZChwID0+IHAua2V5ID09PSBzZWxlY3RlZCkgOiBudWxsO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBzdHlsZT17e1xuICAgICAgbWluSGVpZ2h0OiBcIjEwMHZoXCIsXG4gICAgICBiYWNrZ3JvdW5kOiBcInZhcigtLW5pZ2h0LWZsb29yKVwiLFxuICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgIHBhZGRpbmdUb3A6IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LXRvcCwgMHB4KSArIDE4cHgpXCIsXG4gICAgICBwYWRkaW5nQm90dG9tOiBcImNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC1ib3R0b20sIDBweCkgKyAxMTBweClcIixcbiAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsXG4gICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcbiAgICB9fT5cbiAgICAgIHsvKiBBc2ggc3VidGxlIGdyYWluIG92ZXJsYXkgKGNvaFx1MDBFOXJlbmNlIEV4cGxvcmVyU2NyZWVuKSAqL31cbiAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIiwgaW5zZXQ6IDAsIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiLFxuICAgICAgICBvcGFjaXR5OiAwLjE4LCB6SW5kZXg6IDAsXG4gICAgICB9fT5cbiAgICAgICAgPHN2ZyB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgcHJlc2VydmVBc3BlY3RSYXRpbz1cIm5vbmVcIiBzdHlsZT17eyBkaXNwbGF5OiBcImJsb2NrXCIgfX0+XG4gICAgICAgICAgPHJlY3Qgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIGZpbHRlcj1cInVybCgjbm9pc2UtYXNoKVwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBCb3V0b24gcmV0b3VyICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEsXG4gICAgICAgIHBhZGRpbmc6IFwiMCAyMnB4IDE0cHhcIiwgbWF4V2lkdGg6IDU4MCwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgfX0+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gZ28gJiYgZ28oXCJleHBsb3JlclwiKX1cbiAgICAgICAgICBhcmlhLWxhYmVsPVwicmV0b3VyIFx1MDBFMCBleHBsb3JlclwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC42LFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjRweCAwXCIsIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxfVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNn0+XG4gICAgICAgICAgXHUyMTkwIGV4cGxvcmVyXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBIZWFkZXIgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMSxcbiAgICAgICAgcGFkZGluZzogXCIwIDIycHggMjRweFwiLCBtYXhXaWR0aDogNTgwLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgIH19PlxuICAgICAgICA8aDEgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDI2LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCBtYXJnaW46IDAsIG1hcmdpbkJvdHRvbTogMTAsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgIH19PkNvbW1lbnQgRHJlYW0gbWFyY2hlPC9oMT5cbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiA0OCwgaGVpZ2h0OiAxLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgbWFyZ2luOiBcIjAgYXV0byAxMnB4XCIsXG4gICAgICAgIH19IC8+XG4gICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAxNCwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNzgsIG1hcmdpbjogMCwgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgfX0+VHJvdXZlIHRvbiBlbnRyXHUwMEU5ZSBzZWxvbiBjZSBxdWUgdHUgY2hlcmNoZXMuPC9wPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiAzIGNhcmRzIHBlcnNvbmEgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIHBvc2l0aW9uOiBcInJlbGF0aXZlXCIsIHpJbmRleDogMSxcbiAgICAgICAgcGFkZGluZzogXCIwIDE4cHhcIiwgbWF4V2lkdGg6IDU4MCwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICBtYXJnaW5Cb3R0b206IDIyLFxuICAgICAgfX0+XG4gICAgICAgIHtQRVJTT05BUy5tYXAoKHApID0+IChcbiAgICAgICAgICA8UGVyc29uYUNhcmRcbiAgICAgICAgICAgIGtleT17cC5rZXl9XG4gICAgICAgICAgICBwZXJzb25hPXtwfVxuICAgICAgICAgICAgYWN0aXZlPXtzZWxlY3RlZCA9PT0gcC5rZXl9XG4gICAgICAgICAgICBvblRhcD17KCkgPT4gc2V0U2VsZWN0ZWQocC5rZXkpfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBTZWN0aW9uIHNcdTAwRTlsZWN0aW9ublx1MDBFOWUgXHUyMDE0IGRcdTAwRTlmaWxlICovfVxuICAgICAge3BlcnNvbmEgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxLFxuICAgICAgICAgIHBhZGRpbmc6IFwiMCAyMnB4XCIsIG1heFdpZHRoOiA1ODAsIG1hcmdpbjogXCIwIGF1dG9cIixcbiAgICAgICAgICBtYXJnaW5Ub3A6IDgsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiA0OCwgaGVpZ2h0OiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTglLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICAgIG1hcmdpbjogXCIwIGF1dG8gMjJweFwiLFxuICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPFBlcnNvbmFKb3VybmV5IHBlcnNvbmE9e3BlcnNvbmF9IGdvPXtnb30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7LyogRm9vdGVyICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEsXG4gICAgICAgIHBhZGRpbmc6IFwiMzJweCAyMnB4IDBcIiwgbWF4V2lkdGg6IDU4MCwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICB9fT5cbiAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDEzLCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgb3BhY2l0eTogMC42MiwgbWFyZ2luOiBcIjAgMCAxMnB4XCIsIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgbGluZUhlaWdodDogMS41NSwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIFRvdXRlcyBsZXMgcG9ydGVzIHNvbnQgYWNjZXNzaWJsZXMgdmlhIFwiZXhwbG9yZXJcIiBlbiBiYXMuXG4gICAgICAgIDwvcD5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImdsb3NzYWlyZVwiKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzUlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgODAlLCB2YXIoLS1ib25lKSlcIixcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLFxuICAgICAgICAgICAgcGFkZGluZzogXCI4cHggMThweFwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDI4MG1zIGVhc2VcIixcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7XG4gICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDglLCB0cmFuc3BhcmVudClcIjtcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5jb2xvciA9IFwidmFyKC0tc2lsay1nb2xkKVwiO1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IHtcbiAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5zdHlsZS5iYWNrZ3JvdW5kID0gXCJ0cmFuc3BhcmVudFwiO1xuICAgICAgICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgODAlLCB2YXIoLS1ib25lKSlcIjtcbiAgICAgICAgICB9fT5cbiAgICAgICAgICBnbG9zc2FpcmUgY29tcGxldCBcdTIxOTJcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPHN0eWxlPntgXG4gICAgICAgIEBrZXlmcmFtZXMgY29tbWVudC1zZWN0aW9uLWluIHtcbiAgICAgICAgICBmcm9tIHsgb3BhY2l0eTogMDsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDhweCk7IH1cbiAgICAgICAgICB0byAgIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApOyB9XG4gICAgICAgIH1cbiAgICAgIGB9PC9zdHlsZT5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBFeHBvcnRzIFx1MjE5MiB3aW5kb3cgKG92ZXJyaWRlIHN0dWIgZGUgc2NyZWVucy1leHBsb3Jlci5qc3gpIFx1MjUwMFx1MjUwMFxuLy8gSU1QT1JUQU5UIDogY2UgZmljaGllciBkb2l0IFx1MDBFQXRyZSBjaGFyZ1x1MDBFOSBBUFJcdTAwQzhTIHNjcmVlbnMtZXhwbG9yZXIuanN4XG4vLyBkYW5zIGluZGV4Lmh0bWwgcG91ciBxdWUgd2luZG93LkNvbW1lbnRTY3JlZW4gcG9pbnRlIHZlcnMgY2V0dGUgdmVyc2lvbi5cbk9iamVjdC5hc3NpZ24od2luZG93LCB7XG4gIENvbW1lbnRTY3JlZW4sXG4gIFBFUlNPTkFTLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUFxQkEsTUFBTSxFQUFFLFVBQVUsS0FBSyxXQUFXLElBQUksSUFBSTtBQU0xQyxNQUFNLGtCQUFrQjtBQUFBLEVBQ3RCLGlCQUFpQjtBQUFBLEVBQ2pCLGFBQVU7QUFBQSxFQUNWLFNBQVM7QUFBQSxFQUNULFVBQVU7QUFBQSxFQUNWLGVBQWU7QUFBQSxFQUNmLGtCQUFrQjtBQUFBLEVBQ2xCLGtCQUFrQjtBQUFBLEVBQ2xCLGFB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
