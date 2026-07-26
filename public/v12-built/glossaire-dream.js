const { useState: gS, useEffect: gE, useRef: gR } = React;
window.DREAM_GLOSSAIRE = {
  kairos: {
    label: "kairos",
    short: "moment marqu\xE9 dans le quotidien qui porte trace",
    long: "Mot grec ancien (\u03BA\u03B1\u03B9\u03C1\u03CC\u03C2) qui signifie 'moment opportun' \u2014 par opposition \xE0 chronos (le temps qui passe). Dans Dream, un kairos d\xE9signe tout instant charg\xE9 : r\xEAve nocturne, signe diurne, frisson, synchronicit\xE9, r\xEAverie, hypnagogie. Six types au total.",
    source: "Robert Moss, Sidewalk Oracles"
  },
  anima_mundi: {
    label: "anima mundi",
    short: "le r\xEAve du monde \u2014 ce que l'humanit\xE9 tisse ensemble",
    long: "Concept latin qui signifie '\xE2me du monde'. Dans Dream, d\xE9signe le sanctuaire collectif o\xF9 les r\xEAves anonymis\xE9s des utilisateurs forment une polyphonie \u2014 une m\xE9t\xE9o de l'inconscient plan\xE9taire. K-anonymity 100+ stricte, jamais de profilage individuel.",
    source: "Stephen Aizenstat, Dream Tending"
  },
  felt_shift: {
    label: "felt-shift",
    short: "la sensation qui se transforme dans le corps",
    long: "Concept du psychoth\xE9rapeute Eugene Gendlin (Focusing). Quand une parole, image ou interpr\xE9tation touche juste, le corps r\xE9pond par un micro-changement (rel\xE2chement, fr\xE9missement, ouverture). Dream demande apr\xE8s chaque lecture : 'qu'est-ce qui shift dans ton corps ?'",
    source: "Eugene Gendlin, Focusing"
  },
  sagesse_des_kairos: {
    label: "sagesse des kairos",
    short: "tes r\xEAves pass\xE9s qui r\xE9pondent \xE0 ta question d'aujourd'hui",
    long: "Geste secondaire central de Dream. Tu poses une question \xE9veill\xE9e (note de Journal de Vie). L'app cherche dans tous tes kairos pass\xE9s ceux qui r\xE9sonnent symboliquement. L'IA tisse une polyphonie 100-200 mots qui ne te dit pas le sens \u2014 qui rappelle ce que tu as d\xE9j\xE0 per\xE7u.",
    source: "Bible \xA73.10"
  },
  portrait_lettre: {
    label: "lettre du moment",
    short: "ce qui vit en toi en ce moment, \xE9crit par l'IA",
    long: "L'IA narratrice \xE9crit une lettre de 200-400 mots qui dit ce qui te traverse en ce moment, \xE0 partir de ton journal et tes kairos. 3 toggles : vie de jour / vie de nuit / les deux qui se croisent. R\xE9g\xE9n\xE9ration 1\xD7 par jour pour pr\xE9server le rituel.",
    source: "Design \xA77.6"
  },
  tenir: {
    label: "tenir",
    short: "geste sans valoir, soutenir sans juger",
    long: "Dans Anima Mundi, le r\xEAve grand qui passe a besoin d'\xEAtre tenu par plusieurs mains pour ne pas se perdre. Pas voter, pas liker \u2014 tenir. Geste irr\xE9versible silencieux. Inspir\xE9 de Brown 'Holding Change'.",
    source: "adrienne maree brown, Holding Change"
  },
  ondinnonk: {
    label: "Ondinnonk",
    short: "d\xE9sir cach\xE9 de l'\xE2me \u2014 r\xE9v\xE9l\xE9 par le r\xEAve",
    long: "Concept iroquois (via Robert Moss) \u2014 d\xE9sir secret de l'\xE2me r\xE9v\xE9l\xE9 par les r\xEAves. Les Big Dreams sont les kairos qui portent un Ondinnonk. Compas pour la travers\xE9e.",
    source: "Robert Moss, Conscious Dreaming"
  },
  framework_2: {
    label: "Framework 2",
    short: "la dimension d'o\xF9 viennent les r\xEAves",
    long: "Terme du channel Seth/Jane Roberts. La r\xE9alit\xE9 que nous percevons \xE9veill\xE9s (Framework 1) \xE9merge d'un domaine plus vaste (Framework 2) o\xF9 les possibles se forment. Les r\xEAves donnent acc\xE8s \xE0 Framework 2.",
    source: "Seth, Nature of Personal Reality"
  },
  kairomancer: {
    label: "kairomancer",
    short: "celui qui per\xE7oit les signes \u2014 pas qui les re\xE7oit",
    long: "Robert Moss : 'The kairomancer is the perceiver, not the receiver.' Dream entra\xEEne ton \u0153il oraculaire. L'app n'est pas un oracle, elle est un instrument qui te rend oraculaire.",
    source: "Robert Moss, Sidewalk Oracles"
  },
  trauma_safe: {
    label: "trauma-safe",
    short: "respect des fen\xEAtres de tol\xE9rance",
    long: "30-40% des humains portent un trauma actif. Dream est trauma-safe par d\xE9faut : pas d'interpr\xE9tation push\xE9e, EXIT_TO_HUMAN partout, sanctuaire d\xE9di\xE9, mode freeze 30j si crise.",
    source: "Donald Kalsched, Inner World of Trauma"
  },
  polyphonie: {
    label: "polyphonie",
    short: "plusieurs voix qui \xE9clairent sans imposer",
    long: "L'IA narratrice de Dream tisse plusieurs voix For\xEAt (Aizenstat, Moss, Bachelard, Hopcke...) en harmonie. Phras\xE9 conditionnel obligatoire ('on pourrait entendre', 'il semble que'). Jamais de verdict.",
    source: "Design \xA73.4 polyphonie ontologiquement honn\xEAte"
  },
  foret: {
    label: "For\xEAt",
    short: "333 livres dig\xE9r\xE9s, biblioth\xE8que \xE9pist\xE9mique vivante",
    long: "Biblioth\xE8que INFUSE de 333 livres dig\xE9r\xE9s en deux niveaux : Tier 1 fid\xE8le \xE0 la source, Tier 2 traduit en grammaire INFUSE. ~60 voix dens\xE9ment mobilis\xE9es au c\u0153ur du tissage Dream (root r\xEAve, psych\xE9, proph\xE9tie, corps, mythe). Filtre triple \xE9thique Said+Smith+Kimmerer.",
    source: "Bible \xA73.5 + 3_TECHNICAL \xA747"
  }
};
window.TERMS_SEEN_KEY = "dream:terms-seen";
window.markTermSeen = function(termKey) {
  try {
    const seen = JSON.parse(localStorage.getItem(window.TERMS_SEEN_KEY) || "[]");
    if (!seen.includes(termKey)) {
      seen.push(termKey);
      localStorage.setItem(window.TERMS_SEEN_KEY, JSON.stringify(seen));
    }
  } catch (e) {
  }
};
window.isTermSeen = function(termKey) {
  try {
    const seen = JSON.parse(localStorage.getItem(window.TERMS_SEEN_KEY) || "[]");
    return seen.includes(termKey);
  } catch (e) {
    return false;
  }
};
const TermDef = ({ term, children, asInline = true }) => {
  var _a;
  const def = (_a = window.DREAM_GLOSSAIRE) == null ? void 0 : _a[term];
  const [open, setOpen] = gS(false);
  const [expanded, setExpanded] = gS(false);
  const [seen, setSeen] = gS(() => {
    var _a2;
    return ((_a2 = window.isTermSeen) == null ? void 0 : _a2.call(window, term)) || false;
  });
  const [openSource, setOpenSource] = gS(null);
  const longPressTimer = gR(null);
  const anchorRef = gR(null);
  const popoverRef = gR(null);
  const [popoverPos, setPopoverPos] = gS({ top: 0, left: 0 });
  if (!def) return /* @__PURE__ */ React.createElement("span", null, children || term);
  const handleOpen = (source = "click") => {
    var _a2;
    setOpen(true);
    setOpenSource(source);
    if (!seen) {
      (_a2 = window.markTermSeen) == null ? void 0 : _a2.call(window, term);
      setSeen(true);
    }
    requestAnimationFrame(() => {
      try {
        if (!anchorRef.current) return;
        const rect = anchorRef.current.getBoundingClientRect();
        const popW = 320;
        const margin = 12;
        let left = rect.left + rect.width / 2 - popW / 2;
        left = Math.max(margin, Math.min(left, window.innerWidth - popW - margin));
        let top = rect.bottom + 8;
        if (top + 200 > window.innerHeight) {
          top = rect.top - 8 - 200;
        }
        setPopoverPos({ top, left });
      } catch (e) {
      }
    });
  };
  const handleClose = () => {
    setOpen(false);
    setExpanded(false);
    setOpenSource(null);
  };
  const onTouchStart = (e) => {
    longPressTimer.current = setTimeout(() => {
      handleOpen("touch");
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
  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (open) handleClose();
    else handleOpen("click");
  };
  const onMouseEnter = () => {
    if (!("ontouchstart" in window)) {
      handleOpen("hover");
    }
  };
  const onMouseLeave = () => {
    if (!("ontouchstart" in window) && !expanded && openSource === "hover") {
      setTimeout(() => {
        if (popoverRef.current && popoverRef.current.matches(":hover")) return;
        if (openSource === "hover") handleClose();
      }, 400);
    }
  };
  gE(() => () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }, []);
  const labelOpacity = seen ? 0.32 : 0.55;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "span",
    {
      ref: anchorRef,
      role: "button",
      tabIndex: 0,
      "aria-label": `d\xE9finition de ${def.label}`,
      "aria-expanded": open,
      onClick,
      onTouchStart,
      onTouchEnd,
      onTouchMove,
      onTouchCancel: onTouchEnd,
      onMouseEnter,
      onMouseLeave,
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
        if (e.key === "Escape") handleClose();
      },
      style: {
        fontStyle: "italic",
        borderBottom: `1px dashed color-mix(in oklch, var(--silk-gold) ${Math.round(labelOpacity * 100)}%, transparent)`,
        paddingBottom: 1,
        cursor: "help",
        color: "inherit",
        transition: "border-color 280ms ease",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none"
      }
    },
    children || def.label
  ), open && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: handleClose,
      "aria-hidden": "true",
      style: {
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "transparent"
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: popoverRef,
      role: "tooltip",
      style: {
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
        WebkitBackdropFilter: "blur(6px)"
      },
      onMouseLeave: () => {
        if (!("ontouchstart" in window) && !expanded && openSource === "hover") handleClose();
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 16,
      color: "var(--silk-gold)",
      marginBottom: 8,
      letterSpacing: "0.01em"
    } }, def.label),
    /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 14,
      lineHeight: 1.55,
      color: "var(--bone)",
      opacity: 0.92,
      marginBottom: expanded ? 12 : 10,
      textWrap: "pretty"
    } }, def.short),
    !expanded && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: (e) => {
          e.stopPropagation();
          setExpanded(true);
        },
        style: {
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
          transition: "opacity 280ms ease"
        },
        onMouseEnter: (e) => e.currentTarget.style.opacity = 1,
        onMouseLeave: (e) => e.currentTarget.style.opacity = 0.75
      },
      "en savoir plus \u2192"
    ),
    expanded && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--serif)",
      fontStyle: "italic",
      fontSize: 13.5,
      lineHeight: 1.55,
      color: "var(--ash-light)",
      opacity: 0.88,
      marginBottom: 10,
      textWrap: "pretty"
    } }, def.long), /* @__PURE__ */ React.createElement("div", { style: {
      fontFamily: "var(--mono, monospace)",
      fontSize: 10.5,
      letterSpacing: "0.08em",
      color: "var(--ash-light)",
      opacity: 0.55,
      textTransform: "uppercase",
      borderTop: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))",
      paddingTop: 8,
      marginTop: 4
    } }, "source \xB7 ", def.source))
  ), /* @__PURE__ */ React.createElement("style", null, `
            @keyframes term-pop {
              from { opacity: 0; transform: scale(0.96) translateY(-2px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `)));
};
const GlossaireScreen = ({ go }) => {
  const entries = Object.entries(window.DREAM_GLOSSAIRE || {}).sort(([, a], [, b]) => a.label.localeCompare(b.label, "fr"));
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    background: "var(--night-floor)",
    color: "var(--bone)",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 14px", maxWidth: 640, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("comment"),
      "aria-label": "retour",
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
    "\u2190 retour"
  )), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 28px", maxWidth: 640, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 26,
    color: "var(--bone)",
    margin: 0
  } }, "Glossaire"), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    width: 48,
    height: 1,
    background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
    margin: "10px auto 12px"
  } }), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13.5,
    color: "var(--ash-light)",
    opacity: 0.72,
    margin: 0,
    letterSpacing: "0.02em"
  } }, "Les mots que tu rencontreras dans Dream")), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 18px", maxWidth: 640, margin: "0 auto" } }, entries.map(([key, def]) => /* @__PURE__ */ React.createElement("article", { key, style: {
    marginBottom: 18,
    padding: "16px 18px",
    background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))"
  } }, /* @__PURE__ */ React.createElement("h2", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    color: "var(--silk-gold)",
    margin: 0,
    marginBottom: 8,
    letterSpacing: "0.005em"
  } }, def.label), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14.5,
    lineHeight: 1.55,
    color: "var(--bone)",
    opacity: 0.92,
    margin: 0,
    marginBottom: 8,
    textWrap: "pretty"
  } }, def.short), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13,
    lineHeight: 1.55,
    color: "var(--ash-light)",
    opacity: 0.78,
    margin: 0,
    marginBottom: 10,
    textWrap: "pretty"
  } }, def.long), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 10,
    letterSpacing: "0.08em",
    color: "var(--ash-light)",
    opacity: 0.5,
    textTransform: "uppercase",
    borderTop: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))",
    paddingTop: 6
  } }, "source \xB7 ", def.source)))));
};
Object.assign(window, {
  TermDef,
  GlossaireScreen
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZ2xvc3NhaXJlLWRyZWFtLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIFJlYWN0ICovXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbi8vIERyZWFtIFYxLjIgXHUyMDE0IEdsb3NzYWlyZSB0YXAtbG9uZyAoU3ByaW50IFAwLjQgXHUyMDE0IDIwMjYtMDQtMjcpXG4vLyBEZXNpZ24gXHUwMEE3MTEuYmlzLjE4IFx1MjAxNCBHbG9zc2FpcmUgMTIgdGVybWVzIHNwXHUwMEU5Y2lhbGlzXHUwMEU5cy5cbi8vXG4vLyBEaWFnbm9zdGljIFNlbmlvciBEZXNpZ25lciAyNy8wNCA6IDgwJSBkdSBncmFuZCBwdWJsaWMgZFx1MDBFOWNyb2NoZVxuLy8gZW4gbW9pbnMgZGUgMzBzIGZhY2UgYXV4IHRlcm1lcyBcImthaXJvcyAvIGFuaW1hIG11bmRpIC8gZmVsdC1zaGlmdCAvXG4vLyBkXHUwMEU5c2Vuc29yY2VsXHUwMEU5IC8gcG9ydHJhaXQgbGV0dHJlIC8gc2FnZXNzZSBkZXMga2Fpcm9zXCIuIExlIGdsb3NzYWlyZVxuLy8gcHJcdTAwRTl2dSBlbiBcdTAwQTcxMS5iaXMuMyBuJ2F2YWl0IGphbWFpcyBcdTAwRTl0XHUwMEU5IGNvZFx1MDBFOS5cbi8vXG4vLyBDZSBmaWNoaWVyIGV4cG9zZSA6XG4vLyAgIC0gd2luZG93LkRSRUFNX0dMT1NTQUlSRSA6IGRpY3Qge2tleToge2xhYmVsLCBzaG9ydCwgbG9uZywgc291cmNlfX1cbi8vICAgLSB3aW5kb3cuVGVybURlZiAgICAgICAgIDogY29tcG9zYW50IDxUZXJtRGVmIHRlcm09XCJrYWlyb3NcIiAvPiBxdWlcbi8vICAgICBhZmZpY2hlIGxlIGxhYmVsIGVuIGl0YWxpYyBkYXNoZWQgc2lsay1nb2xkIGV0IG91dnJlIHVuIHBvcG92ZXJcbi8vICAgICBzb2JyZSBhdSB0YXAtbG9uZyBtb2JpbGUgLyBob3ZlciBkZXNrdG9wLlxuLy8gICAtIHdpbmRvdy5URVJNU19TRUVOX0tFWSAgOiBjbFx1MDBFOSBsb2NhbFN0b3JhZ2UgcG91ciB0cmFja2VyIGxlcyB0ZXJtZXNcbi8vICAgICBkXHUwMEU5alx1MDBFMCByZW5jb250clx1MDBFOXMgKGhlbHBlciBwb3VyIHdyYXAgVU5FIGZvaXMgcGFyIHNlc3Npb24gXHUyMDE0IG1haXMgb25cbi8vICAgICBuZSBjb3VydC1jaXJjdWl0ZSBQQVMgbGUgY29tcG9zYW50IDogaWwgcydhdXRvLXN0eWxlIHRvdWpvdXJzLFxuLy8gICAgIGwnb3BhY2l0XHUwMEU5IGR1IHNvdWxpZ25lbWVudCBkaW1pbnVlIGFwclx1MDBFOHMgcHJlbWlcdTAwRThyZSB2dWUpLlxuLy8gICAtIHdpbmRvdy5HbG9zc2FpcmVTY3JlZW4gOiByb3V0ZSBcImdsb3NzYWlyZVwiLCBsaXN0ZSBhbHBoYWJcdTAwRTl0aXF1ZVxuLy8gICAgIGRlIHRvdXMgbGVzIHRlcm1lcyBhY2Nlc3NpYmxlcyBkZXB1aXMgXCJDb21tZW50IFx1MDBFN2EgbWFyY2hlXCIuXG4vL1xuLy8gUGF0dGVybnMgZG9taW5hbnRzIDpcbi8vICAgLSBESVNDT1ZFUkFCTEVfREVQVEggKFAtWlx1MDBFOXJvIFx1MDBBNzIuMSkgXHUyMDE0IGxhIGRcdTAwRTlmaW5pdGlvbiBlc3QgbGF0ZW50ZSxcbi8vICAgICByXHUwMEU5dlx1MDBFOWxcdTAwRTllIHBhciB0YXAtbG9uZywgamFtYWlzIGltcG9zXHUwMEU5ZVxuLy8gICAtIFNPQlJJXHUwMEM5VFx1MDBDOSBOSUdIVC1GSVJTVCAoRGVzaWduIFx1MDBBNzYuMikgXHUyMDE0IHBvcG92ZXIgbmlnaHQtd2FybSwgcGFwZXJcbi8vICAgICBib3JkZXIgc2lsay1nb2xkIDMwJSwgRUIgR2FyYW1vbmQgaXRhbGljIDE0cHhcbi8vICAgLSBUUkFVTUEtU0FGRSAoQmlibGUgXHUwMEE3MTcpIFx1MjAxNCBwYXMgZCdhbmltYXRpb24gY3JpYXJkZSwgZmFkZSB0ZW51XG4vLyAgICAgMjgwbXMgZWFzZS10ZW51ZSwgdGFwIG91dHNpZGUgZmVybWUgc2lsZW5jaWV1c2VtZW50XG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuY29uc3QgeyB1c2VTdGF0ZTogZ1MsIHVzZUVmZmVjdDogZ0UsIHVzZVJlZjogZ1IgfSA9IFJlYWN0O1xuXG4vLyBcdTI1MDBcdTI1MDAgRGljdGlvbm5haXJlIGdsb2JhbCBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbndpbmRvdy5EUkVBTV9HTE9TU0FJUkUgPSB7XG4gIGthaXJvczoge1xuICAgIGxhYmVsOiBcImthaXJvc1wiLFxuICAgIHNob3J0OiBcIm1vbWVudCBtYXJxdVx1MDBFOSBkYW5zIGxlIHF1b3RpZGllbiBxdWkgcG9ydGUgdHJhY2VcIixcbiAgICBsb25nOiBcIk1vdCBncmVjIGFuY2llbiAoXHUwM0JBXHUwM0IxXHUwM0I5XHUwM0MxXHUwM0NDXHUwM0MyKSBxdWkgc2lnbmlmaWUgJ21vbWVudCBvcHBvcnR1bicgXHUyMDE0IHBhciBvcHBvc2l0aW9uIFx1MDBFMCBjaHJvbm9zIChsZSB0ZW1wcyBxdWkgcGFzc2UpLiBEYW5zIERyZWFtLCB1biBrYWlyb3MgZFx1MDBFOXNpZ25lIHRvdXQgaW5zdGFudCBjaGFyZ1x1MDBFOSA6IHJcdTAwRUF2ZSBub2N0dXJuZSwgc2lnbmUgZGl1cm5lLCBmcmlzc29uLCBzeW5jaHJvbmljaXRcdTAwRTksIHJcdTAwRUF2ZXJpZSwgaHlwbmFnb2dpZS4gU2l4IHR5cGVzIGF1IHRvdGFsLlwiLFxuICAgIHNvdXJjZTogXCJSb2JlcnQgTW9zcywgU2lkZXdhbGsgT3JhY2xlc1wiLFxuICB9LFxuICBhbmltYV9tdW5kaToge1xuICAgIGxhYmVsOiBcImFuaW1hIG11bmRpXCIsXG4gICAgc2hvcnQ6IFwibGUgclx1MDBFQXZlIGR1IG1vbmRlIFx1MjAxNCBjZSBxdWUgbCdodW1hbml0XHUwMEU5IHRpc3NlIGVuc2VtYmxlXCIsXG4gICAgbG9uZzogXCJDb25jZXB0IGxhdGluIHF1aSBzaWduaWZpZSAnXHUwMEUybWUgZHUgbW9uZGUnLiBEYW5zIERyZWFtLCBkXHUwMEU5c2lnbmUgbGUgc2FuY3R1YWlyZSBjb2xsZWN0aWYgb1x1MDBGOSBsZXMgclx1MDBFQXZlcyBhbm9ueW1pc1x1MDBFOXMgZGVzIHV0aWxpc2F0ZXVycyBmb3JtZW50IHVuZSBwb2x5cGhvbmllIFx1MjAxNCB1bmUgbVx1MDBFOXRcdTAwRTlvIGRlIGwnaW5jb25zY2llbnQgcGxhblx1MDBFOXRhaXJlLiBLLWFub255bWl0eSAxMDArIHN0cmljdGUsIGphbWFpcyBkZSBwcm9maWxhZ2UgaW5kaXZpZHVlbC5cIixcbiAgICBzb3VyY2U6IFwiU3RlcGhlbiBBaXplbnN0YXQsIERyZWFtIFRlbmRpbmdcIixcbiAgfSxcbiAgZmVsdF9zaGlmdDoge1xuICAgIGxhYmVsOiBcImZlbHQtc2hpZnRcIixcbiAgICBzaG9ydDogXCJsYSBzZW5zYXRpb24gcXVpIHNlIHRyYW5zZm9ybWUgZGFucyBsZSBjb3Jwc1wiLFxuICAgIGxvbmc6IFwiQ29uY2VwdCBkdSBwc3ljaG90aFx1MDBFOXJhcGV1dGUgRXVnZW5lIEdlbmRsaW4gKEZvY3VzaW5nKS4gUXVhbmQgdW5lIHBhcm9sZSwgaW1hZ2Ugb3UgaW50ZXJwclx1MDBFOXRhdGlvbiB0b3VjaGUganVzdGUsIGxlIGNvcnBzIHJcdTAwRTlwb25kIHBhciB1biBtaWNyby1jaGFuZ2VtZW50IChyZWxcdTAwRTJjaGVtZW50LCBmclx1MDBFOW1pc3NlbWVudCwgb3V2ZXJ0dXJlKS4gRHJlYW0gZGVtYW5kZSBhcHJcdTAwRThzIGNoYXF1ZSBsZWN0dXJlIDogJ3F1J2VzdC1jZSBxdWkgc2hpZnQgZGFucyB0b24gY29ycHMgPydcIixcbiAgICBzb3VyY2U6IFwiRXVnZW5lIEdlbmRsaW4sIEZvY3VzaW5nXCIsXG4gIH0sXG4gIHNhZ2Vzc2VfZGVzX2thaXJvczoge1xuICAgIGxhYmVsOiBcInNhZ2Vzc2UgZGVzIGthaXJvc1wiLFxuICAgIHNob3J0OiBcInRlcyByXHUwMEVBdmVzIHBhc3NcdTAwRTlzIHF1aSByXHUwMEU5cG9uZGVudCBcdTAwRTAgdGEgcXVlc3Rpb24gZCdhdWpvdXJkJ2h1aVwiLFxuICAgIGxvbmc6IFwiR2VzdGUgc2Vjb25kYWlyZSBjZW50cmFsIGRlIERyZWFtLiBUdSBwb3NlcyB1bmUgcXVlc3Rpb24gXHUwMEU5dmVpbGxcdTAwRTllIChub3RlIGRlIEpvdXJuYWwgZGUgVmllKS4gTCdhcHAgY2hlcmNoZSBkYW5zIHRvdXMgdGVzIGthaXJvcyBwYXNzXHUwMEU5cyBjZXV4IHF1aSByXHUwMEU5c29ubmVudCBzeW1ib2xpcXVlbWVudC4gTCdJQSB0aXNzZSB1bmUgcG9seXBob25pZSAxMDAtMjAwIG1vdHMgcXVpIG5lIHRlIGRpdCBwYXMgbGUgc2VucyBcdTIwMTQgcXVpIHJhcHBlbGxlIGNlIHF1ZSB0dSBhcyBkXHUwMEU5alx1MDBFMCBwZXJcdTAwRTd1LlwiLFxuICAgIHNvdXJjZTogXCJCaWJsZSBcdTAwQTczLjEwXCIsXG4gIH0sXG4gIHBvcnRyYWl0X2xldHRyZToge1xuICAgIGxhYmVsOiBcImxldHRyZSBkdSBtb21lbnRcIixcbiAgICBzaG9ydDogXCJjZSBxdWkgdml0IGVuIHRvaSBlbiBjZSBtb21lbnQsIFx1MDBFOWNyaXQgcGFyIGwnSUFcIixcbiAgICBsb25nOiBcIkwnSUEgbmFycmF0cmljZSBcdTAwRTljcml0IHVuZSBsZXR0cmUgZGUgMjAwLTQwMCBtb3RzIHF1aSBkaXQgY2UgcXVpIHRlIHRyYXZlcnNlIGVuIGNlIG1vbWVudCwgXHUwMEUwIHBhcnRpciBkZSB0b24gam91cm5hbCBldCB0ZXMga2Fpcm9zLiAzIHRvZ2dsZXMgOiB2aWUgZGUgam91ciAvIHZpZSBkZSBudWl0IC8gbGVzIGRldXggcXVpIHNlIGNyb2lzZW50LiBSXHUwMEU5Z1x1MDBFOW5cdTAwRTlyYXRpb24gMVx1MDBENyBwYXIgam91ciBwb3VyIHByXHUwMEU5c2VydmVyIGxlIHJpdHVlbC5cIixcbiAgICBzb3VyY2U6IFwiRGVzaWduIFx1MDBBNzcuNlwiLFxuICB9LFxuICB0ZW5pcjoge1xuICAgIGxhYmVsOiBcInRlbmlyXCIsXG4gICAgc2hvcnQ6IFwiZ2VzdGUgc2FucyB2YWxvaXIsIHNvdXRlbmlyIHNhbnMganVnZXJcIixcbiAgICBsb25nOiBcIkRhbnMgQW5pbWEgTXVuZGksIGxlIHJcdTAwRUF2ZSBncmFuZCBxdWkgcGFzc2UgYSBiZXNvaW4gZCdcdTAwRUF0cmUgdGVudSBwYXIgcGx1c2lldXJzIG1haW5zIHBvdXIgbmUgcGFzIHNlIHBlcmRyZS4gUGFzIHZvdGVyLCBwYXMgbGlrZXIgXHUyMDE0IHRlbmlyLiBHZXN0ZSBpcnJcdTAwRTl2ZXJzaWJsZSBzaWxlbmNpZXV4LiBJbnNwaXJcdTAwRTkgZGUgQnJvd24gJ0hvbGRpbmcgQ2hhbmdlJy5cIixcbiAgICBzb3VyY2U6IFwiYWRyaWVubmUgbWFyZWUgYnJvd24sIEhvbGRpbmcgQ2hhbmdlXCIsXG4gIH0sXG4gIG9uZGlubm9uazoge1xuICAgIGxhYmVsOiBcIk9uZGlubm9ua1wiLFxuICAgIHNob3J0OiBcImRcdTAwRTlzaXIgY2FjaFx1MDBFOSBkZSBsJ1x1MDBFMm1lIFx1MjAxNCByXHUwMEU5dlx1MDBFOWxcdTAwRTkgcGFyIGxlIHJcdTAwRUF2ZVwiLFxuICAgIGxvbmc6IFwiQ29uY2VwdCBpcm9xdW9pcyAodmlhIFJvYmVydCBNb3NzKSBcdTIwMTQgZFx1MDBFOXNpciBzZWNyZXQgZGUgbCdcdTAwRTJtZSByXHUwMEU5dlx1MDBFOWxcdTAwRTkgcGFyIGxlcyByXHUwMEVBdmVzLiBMZXMgQmlnIERyZWFtcyBzb250IGxlcyBrYWlyb3MgcXVpIHBvcnRlbnQgdW4gT25kaW5ub25rLiBDb21wYXMgcG91ciBsYSB0cmF2ZXJzXHUwMEU5ZS5cIixcbiAgICBzb3VyY2U6IFwiUm9iZXJ0IE1vc3MsIENvbnNjaW91cyBEcmVhbWluZ1wiLFxuICB9LFxuICBmcmFtZXdvcmtfMjoge1xuICAgIGxhYmVsOiBcIkZyYW1ld29yayAyXCIsXG4gICAgc2hvcnQ6IFwibGEgZGltZW5zaW9uIGQnb1x1MDBGOSB2aWVubmVudCBsZXMgclx1MDBFQXZlc1wiLFxuICAgIGxvbmc6IFwiVGVybWUgZHUgY2hhbm5lbCBTZXRoL0phbmUgUm9iZXJ0cy4gTGEgclx1MDBFOWFsaXRcdTAwRTkgcXVlIG5vdXMgcGVyY2V2b25zIFx1MDBFOXZlaWxsXHUwMEU5cyAoRnJhbWV3b3JrIDEpIFx1MDBFOW1lcmdlIGQndW4gZG9tYWluZSBwbHVzIHZhc3RlIChGcmFtZXdvcmsgMikgb1x1MDBGOSBsZXMgcG9zc2libGVzIHNlIGZvcm1lbnQuIExlcyByXHUwMEVBdmVzIGRvbm5lbnQgYWNjXHUwMEU4cyBcdTAwRTAgRnJhbWV3b3JrIDIuXCIsXG4gICAgc291cmNlOiBcIlNldGgsIE5hdHVyZSBvZiBQZXJzb25hbCBSZWFsaXR5XCIsXG4gIH0sXG4gIGthaXJvbWFuY2VyOiB7XG4gICAgbGFiZWw6IFwia2Fpcm9tYW5jZXJcIixcbiAgICBzaG9ydDogXCJjZWx1aSBxdWkgcGVyXHUwMEU3b2l0IGxlcyBzaWduZXMgXHUyMDE0IHBhcyBxdWkgbGVzIHJlXHUwMEU3b2l0XCIsXG4gICAgbG9uZzogXCJSb2JlcnQgTW9zcyA6ICdUaGUga2Fpcm9tYW5jZXIgaXMgdGhlIHBlcmNlaXZlciwgbm90IHRoZSByZWNlaXZlci4nIERyZWFtIGVudHJhXHUwMEVFbmUgdG9uIFx1MDE1M2lsIG9yYWN1bGFpcmUuIEwnYXBwIG4nZXN0IHBhcyB1biBvcmFjbGUsIGVsbGUgZXN0IHVuIGluc3RydW1lbnQgcXVpIHRlIHJlbmQgb3JhY3VsYWlyZS5cIixcbiAgICBzb3VyY2U6IFwiUm9iZXJ0IE1vc3MsIFNpZGV3YWxrIE9yYWNsZXNcIixcbiAgfSxcbiAgdHJhdW1hX3NhZmU6IHtcbiAgICBsYWJlbDogXCJ0cmF1bWEtc2FmZVwiLFxuICAgIHNob3J0OiBcInJlc3BlY3QgZGVzIGZlblx1MDBFQXRyZXMgZGUgdG9sXHUwMEU5cmFuY2VcIixcbiAgICBsb25nOiBcIjMwLTQwJSBkZXMgaHVtYWlucyBwb3J0ZW50IHVuIHRyYXVtYSBhY3RpZi4gRHJlYW0gZXN0IHRyYXVtYS1zYWZlIHBhciBkXHUwMEU5ZmF1dCA6IHBhcyBkJ2ludGVycHJcdTAwRTl0YXRpb24gcHVzaFx1MDBFOWUsIEVYSVRfVE9fSFVNQU4gcGFydG91dCwgc2FuY3R1YWlyZSBkXHUwMEU5ZGlcdTAwRTksIG1vZGUgZnJlZXplIDMwaiBzaSBjcmlzZS5cIixcbiAgICBzb3VyY2U6IFwiRG9uYWxkIEthbHNjaGVkLCBJbm5lciBXb3JsZCBvZiBUcmF1bWFcIixcbiAgfSxcbiAgcG9seXBob25pZToge1xuICAgIGxhYmVsOiBcInBvbHlwaG9uaWVcIixcbiAgICBzaG9ydDogXCJwbHVzaWV1cnMgdm9peCBxdWkgXHUwMEU5Y2xhaXJlbnQgc2FucyBpbXBvc2VyXCIsXG4gICAgbG9uZzogXCJMJ0lBIG5hcnJhdHJpY2UgZGUgRHJlYW0gdGlzc2UgcGx1c2lldXJzIHZvaXggRm9yXHUwMEVBdCAoQWl6ZW5zdGF0LCBNb3NzLCBCYWNoZWxhcmQsIEhvcGNrZS4uLikgZW4gaGFybW9uaWUuIFBocmFzXHUwMEU5IGNvbmRpdGlvbm5lbCBvYmxpZ2F0b2lyZSAoJ29uIHBvdXJyYWl0IGVudGVuZHJlJywgJ2lsIHNlbWJsZSBxdWUnKS4gSmFtYWlzIGRlIHZlcmRpY3QuXCIsXG4gICAgc291cmNlOiBcIkRlc2lnbiBcdTAwQTczLjQgcG9seXBob25pZSBvbnRvbG9naXF1ZW1lbnQgaG9ublx1MDBFQXRlXCIsXG4gIH0sXG4gIGZvcmV0OiB7XG4gICAgbGFiZWw6IFwiRm9yXHUwMEVBdFwiLFxuICAgIHNob3J0OiBcIjMzMyBsaXZyZXMgZGlnXHUwMEU5clx1MDBFOXMsIGJpYmxpb3RoXHUwMEU4cXVlIFx1MDBFOXBpc3RcdTAwRTltaXF1ZSB2aXZhbnRlXCIsXG4gICAgbG9uZzogXCJCaWJsaW90aFx1MDBFOHF1ZSBJTkZVU0UgZGUgMzMzIGxpdnJlcyBkaWdcdTAwRTlyXHUwMEU5cyBlbiBkZXV4IG5pdmVhdXggOiBUaWVyIDEgZmlkXHUwMEU4bGUgXHUwMEUwIGxhIHNvdXJjZSwgVGllciAyIHRyYWR1aXQgZW4gZ3JhbW1haXJlIElORlVTRS4gfjYwIHZvaXggZGVuc1x1MDBFOW1lbnQgbW9iaWxpc1x1MDBFOWVzIGF1IGNcdTAxNTN1ciBkdSB0aXNzYWdlIERyZWFtIChyb290IHJcdTAwRUF2ZSwgcHN5Y2hcdTAwRTksIHByb3BoXHUwMEU5dGllLCBjb3JwcywgbXl0aGUpLiBGaWx0cmUgdHJpcGxlIFx1MDBFOXRoaXF1ZSBTYWlkK1NtaXRoK0tpbW1lcmVyLlwiLFxuICAgIHNvdXJjZTogXCJCaWJsZSBcdTAwQTczLjUgKyAzX1RFQ0hOSUNBTCBcdTAwQTc0N1wiLFxuICB9LFxufTtcblxuLy8gQ2xcdTAwRTkgbG9jYWxTdG9yYWdlIHBvdXIgdHJhY2tlciBsZXMgdGVybWVzIGRcdTAwRTlqXHUwMEUwIHZ1cyAoaGVscGVyIFwid3JhcCBQUkVNSVx1MDBDOFJFXG4vLyBvY2N1cnJlbmNlIHBhciBzZXNzaW9uXCIpLiBMZSBjb21wb3NhbnQgVGVybURlZiByZXN0ZSBmb25jdGlvbm5lbCBwYXJ0b3V0XG4vLyBcdTIwMTQgY2V0dGUgbGlzdGUgZXN0IGp1c3RlIHVuIHNpZ25hbCBkJ29wYWNpdFx1MDBFOS5cbndpbmRvdy5URVJNU19TRUVOX0tFWSA9IFwiZHJlYW06dGVybXMtc2VlblwiO1xuXG53aW5kb3cubWFya1Rlcm1TZWVuID0gZnVuY3Rpb24gKHRlcm1LZXkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWVuID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh3aW5kb3cuVEVSTVNfU0VFTl9LRVkpIHx8IFwiW11cIik7XG4gICAgaWYgKCFzZWVuLmluY2x1ZGVzKHRlcm1LZXkpKSB7XG4gICAgICBzZWVuLnB1c2godGVybUtleSk7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSh3aW5kb3cuVEVSTVNfU0VFTl9LRVksIEpTT04uc3RyaW5naWZ5KHNlZW4pKTtcbiAgICB9XG4gIH0gY2F0Y2gge31cbn07XG5cbndpbmRvdy5pc1Rlcm1TZWVuID0gZnVuY3Rpb24gKHRlcm1LZXkpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWVuID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh3aW5kb3cuVEVSTVNfU0VFTl9LRVkpIHx8IFwiW11cIik7XG4gICAgcmV0dXJuIHNlZW4uaW5jbHVkZXModGVybUtleSk7XG4gIH0gY2F0Y2ggeyByZXR1cm4gZmFsc2U7IH1cbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBDb21wb3NhbnQgPFRlcm1EZWYgdGVybT1cImthaXJvc1wiIC8+IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gUmVuZGVyIGxhYmVsIGVuIGl0YWxpYyArIHNvdWxpZ25lbWVudCBkYXNoZWQgc2lsay1nb2xkIG9wYWNpdHkgNTAlLlxuLy8gVGFwIGNvdXJ0IChtb2JpbGUpIC8gaG92ZXIgKGRlc2t0b3ApIFx1MjE5MiBwb3BvdmVyIHNvYnJlLlxuLy8gVGFwLWxvbmcgbW9iaWxlID0gb25Ub3VjaFN0YXJ0ICsgc2V0VGltZW91dCA1MDBtcyAocGVyXHUwMEU3dSBjb21tZSBpbnRlbnRpb25uZWwpLlxuLy8gVGFwIG91dHNpZGUgZmVybWUuIFRvdWNoIGhvcnMgem9uZSB0cmlnZ2VyIHZpYSBvdmVybGF5IGludmlzaWJsZS5cbmNvbnN0IFRlcm1EZWYgPSAoeyB0ZXJtLCBjaGlsZHJlbiwgYXNJbmxpbmUgPSB0cnVlIH0pID0+IHtcbiAgY29uc3QgZGVmID0gd2luZG93LkRSRUFNX0dMT1NTQUlSRT8uW3Rlcm1dO1xuICBjb25zdCBbb3Blbiwgc2V0T3Blbl0gPSBnUyhmYWxzZSk7XG4gIGNvbnN0IFtleHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gZ1MoZmFsc2UpO1xuICBjb25zdCBbc2Vlbiwgc2V0U2Vlbl0gPSBnUygoKSA9PiB3aW5kb3cuaXNUZXJtU2Vlbj8uKHRlcm0pIHx8IGZhbHNlKTtcbiAgLy8gMjAyNi0wNC0yOCBmaXggYnVnIFQ2OCA6IHRyYWNrIEhPVyB0aGUgcG9wb3ZlciB3YXMgb3BlbmVkLlxuICAvLyAnaG92ZXInID0gbW91c2VMZWF2ZSBhbGxvd2VkIHRvIGNsb3NlLiAnY2xpY2snLyd0b3VjaCcgPSBzdGF5IG9wZW4gdW50aWxcbiAgLy8gZXhwbGljaXQgY2xvc2UgKHRhcCBvdXRzaWRlIC8gY2xpY2sgb3V0c2lkZSAvIEVzY2FwZSAvIHJlLXRhcCBvbiB0ZXJtKS5cbiAgY29uc3QgW29wZW5Tb3VyY2UsIHNldE9wZW5Tb3VyY2VdID0gZ1MobnVsbCk7XG4gIGNvbnN0IGxvbmdQcmVzc1RpbWVyID0gZ1IobnVsbCk7XG4gIGNvbnN0IGFuY2hvclJlZiA9IGdSKG51bGwpO1xuICBjb25zdCBwb3BvdmVyUmVmID0gZ1IobnVsbCk7XG4gIGNvbnN0IFtwb3BvdmVyUG9zLCBzZXRQb3BvdmVyUG9zXSA9IGdTKHsgdG9wOiAwLCBsZWZ0OiAwIH0pO1xuXG4gIC8vIFNpIHRlcm1lIGluY29ubnUsIG9uIHJlbmRlciBsZSBjaGlsZHJlbiBvdSBsZSB0ZXJtZSBicnV0IHNhbnMgd3JhcFxuICBpZiAoIWRlZikgcmV0dXJuIDxzcGFuPntjaGlsZHJlbiB8fCB0ZXJtfTwvc3Bhbj47XG5cbiAgLy8gTWFycXVlIGNvbW1lIHZ1IFx1MDBFMCBsJ291dmVydHVyZVxuICBjb25zdCBoYW5kbGVPcGVuID0gKHNvdXJjZSA9ICdjbGljaycpID0+IHtcbiAgICBzZXRPcGVuKHRydWUpO1xuICAgIHNldE9wZW5Tb3VyY2Uoc291cmNlKTtcbiAgICBpZiAoIXNlZW4pIHtcbiAgICAgIHdpbmRvdy5tYXJrVGVybVNlZW4/Lih0ZXJtKTtcbiAgICAgIHNldFNlZW4odHJ1ZSk7XG4gICAgfVxuICAgIC8vIENhbGN1bCBwb3NpdGlvbiBwb3BvdmVyIChzb3VzIGxlIGxhYmVsLCBjZW50clx1MDBFOSBob3Jpem9udGFsZW1lbnQsXG4gICAgLy8gY2xhbXAgYXV4IGJvcmRzIGRlIGwnXHUwMEU5Y3JhbilcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFhbmNob3JSZWYuY3VycmVudCkgcmV0dXJuO1xuICAgICAgICBjb25zdCByZWN0ID0gYW5jaG9yUmVmLmN1cnJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGNvbnN0IHBvcFcgPSAzMjA7XG4gICAgICAgIGNvbnN0IG1hcmdpbiA9IDEyO1xuICAgICAgICBsZXQgbGVmdCA9IHJlY3QubGVmdCArIChyZWN0LndpZHRoIC8gMikgLSAocG9wVyAvIDIpO1xuICAgICAgICBsZWZ0ID0gTWF0aC5tYXgobWFyZ2luLCBNYXRoLm1pbihsZWZ0LCB3aW5kb3cuaW5uZXJXaWR0aCAtIHBvcFcgLSBtYXJnaW4pKTtcbiAgICAgICAgbGV0IHRvcCA9IHJlY3QuYm90dG9tICsgODtcbiAgICAgICAgLy8gU2kgZFx1MDBFOXBhc3NlIGVuIGJhcywgb24gaW52ZXJzZSBhdS1kZXNzdXNcbiAgICAgICAgaWYgKHRvcCArIDIwMCA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xuICAgICAgICAgIHRvcCA9IHJlY3QudG9wIC0gOCAtIDIwMDtcbiAgICAgICAgfVxuICAgICAgICBzZXRQb3BvdmVyUG9zKHsgdG9wLCBsZWZ0IH0pO1xuICAgICAgfSBjYXRjaCB7fVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZUNsb3NlID0gKCkgPT4ge1xuICAgIHNldE9wZW4oZmFsc2UpO1xuICAgIHNldEV4cGFuZGVkKGZhbHNlKTtcbiAgICBzZXRPcGVuU291cmNlKG51bGwpO1xuICB9O1xuXG4gIC8vIFRvdWNoIGxvbmctcHJlc3MgKG1vYmlsZSkgXHUyMDE0IDIwMjYtMDQtMjggZml4IGJ1ZyBUNjggOiB0YWcgc291cmNlICd0b3VjaCdcbiAgLy8gcG91ciBuZSBQQVMgYXV0by1jbG9zZSBzdXIgbW91c2VMZWF2ZSBhcnRpZmljaWVsIHBvc3QtdGFwIChtb2JpbGUgZmlyZVxuICAvLyBtb3VzZSBldmVudHMgc3ludGhldGljIGFwclx1MDBFOHMgdG91Y2gpLlxuICBjb25zdCBvblRvdWNoU3RhcnQgPSAoZSkgPT4ge1xuICAgIGxvbmdQcmVzc1RpbWVyLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIGhhbmRsZU9wZW4oJ3RvdWNoJyk7XG4gICAgfSwgNTAwKTtcbiAgfTtcbiAgY29uc3Qgb25Ub3VjaEVuZCA9ICgpID0+IHtcbiAgICBpZiAobG9uZ1ByZXNzVGltZXIuY3VycmVudCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGxvbmdQcmVzc1RpbWVyLmN1cnJlbnQpO1xuICAgICAgbG9uZ1ByZXNzVGltZXIuY3VycmVudCA9IG51bGw7XG4gICAgfVxuICB9O1xuICBjb25zdCBvblRvdWNoTW92ZSA9ICgpID0+IHtcbiAgICBpZiAobG9uZ1ByZXNzVGltZXIuY3VycmVudCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGxvbmdQcmVzc1RpbWVyLmN1cnJlbnQpO1xuICAgICAgbG9uZ1ByZXNzVGltZXIuY3VycmVudCA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8vIENsaWNrIGRlc2t0b3AgPSB0b2dnbGUgKGVuIHBsdXMgZHUgaG92ZXIpIFx1MjAxNCB0YWcgc291cmNlICdjbGljaydcbiAgY29uc3Qgb25DbGljayA9IChlKSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKG9wZW4pIGhhbmRsZUNsb3NlKCk7XG4gICAgZWxzZSBoYW5kbGVPcGVuKCdjbGljaycpO1xuICB9O1xuXG4gIC8vIEhvdmVyIGRlc2t0b3AgXHUyMDE0IHRhZyBzb3VyY2UgJ2hvdmVyJ1xuICBjb25zdCBvbk1vdXNlRW50ZXIgPSAoKSA9PiB7XG4gICAgLy8gRFx1MDBFOXRlY3Rpb24gZGVza3RvcCAobm8gdG91Y2gpIFx1MjAxNCBoZXVyaXN0aXF1ZSA6IHBhcyBkZSB0b3VjaCBldmVudCByXHUwMEU5Y2VudFxuICAgIGlmICghKFwib250b3VjaHN0YXJ0XCIgaW4gd2luZG93KSkge1xuICAgICAgaGFuZGxlT3BlbignaG92ZXInKTtcbiAgICB9XG4gIH07XG4gIC8vIDIwMjYtMDQtMjggZml4IGJ1ZyBUNjggOiBuZSBmZXJtZSBRVUUgc2kgb3V2ZXJ0IHBhciBob3ZlclxuICAvLyAoc2lub24gY2xpY2svdG91Y2ggcmVzdGUgb3V2ZXJ0IGp1c3F1J1x1MDBFMCBhY3Rpb24gZXhwbGljaXRlIFx1MjAxNCBmaXggZmxhc2ggMC41cykuXG4gIC8vIERcdTAwRTlsYWkgYXVnbWVudFx1MDBFOSBcdTAwRTAgNDAwbXMgcG91ciBwZXJtZXR0cmUgdHJhbnNpdGlvbiBzb3VyaXMgbGFiZWwgXHUyMTkyIHBvcG92ZXIuXG4gIGNvbnN0IG9uTW91c2VMZWF2ZSA9ICgpID0+IHtcbiAgICBpZiAoIShcIm9udG91Y2hzdGFydFwiIGluIHdpbmRvdykgJiYgIWV4cGFuZGVkICYmIG9wZW5Tb3VyY2UgPT09ICdob3ZlcicpIHtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBpZiAocG9wb3ZlclJlZi5jdXJyZW50ICYmIHBvcG92ZXJSZWYuY3VycmVudC5tYXRjaGVzKFwiOmhvdmVyXCIpKSByZXR1cm47XG4gICAgICAgIC8vIFJlLWNoZWNrIGF1IG1vbWVudCBkdSB0aW1lb3V0IDogc2kgbCd1c2VyIGEgY2xpcXVcdTAwRTkgZW50cmUgdGVtcHMsIG9wZW5Tb3VyY2UgYSBjaGFuZ1x1MDBFOVxuICAgICAgICBpZiAob3BlblNvdXJjZSA9PT0gJ2hvdmVyJykgaGFuZGxlQ2xvc2UoKTtcbiAgICAgIH0sIDQwMCk7XG4gICAgfVxuICB9O1xuXG4gIC8vIENsZWFudXAgdGltZXIgYXUgZFx1MDBFOW1vbnRhZ2VcbiAgZ0UoKCkgPT4gKCkgPT4ge1xuICAgIGlmIChsb25nUHJlc3NUaW1lci5jdXJyZW50KSBjbGVhclRpbWVvdXQobG9uZ1ByZXNzVGltZXIuY3VycmVudCk7XG4gIH0sIFtdKTtcblxuICAvLyBTdHlsZSBsYWJlbCA6IGl0YWxpYyArIHNvdWxpZ25lbWVudCBkYXNoZWQgc2lsay1nb2xkXG4gIC8vIE9wYWNpdFx1MDBFOSBwbHVzIGZvcnRlIHRhbnQgcXVlIHBhcyB2dSAoc2lnbmFsZSBcImlsIHkgYSBxdWVscXVlIGNob3NlIFx1MDBFMCBkXHUwMEU5Y291dnJpclwiKVxuICBjb25zdCBsYWJlbE9wYWNpdHkgPSBzZWVuID8gMC4zMiA6IDAuNTU7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPHNwYW5cbiAgICAgICAgcmVmPXthbmNob3JSZWZ9XG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICB0YWJJbmRleD17MH1cbiAgICAgICAgYXJpYS1sYWJlbD17YGRcdTAwRTlmaW5pdGlvbiBkZSAke2RlZi5sYWJlbH1gfVxuICAgICAgICBhcmlhLWV4cGFuZGVkPXtvcGVufVxuICAgICAgICBvbkNsaWNrPXtvbkNsaWNrfVxuICAgICAgICBvblRvdWNoU3RhcnQ9e29uVG91Y2hTdGFydH1cbiAgICAgICAgb25Ub3VjaEVuZD17b25Ub3VjaEVuZH1cbiAgICAgICAgb25Ub3VjaE1vdmU9e29uVG91Y2hNb3ZlfVxuICAgICAgICBvblRvdWNoQ2FuY2VsPXtvblRvdWNoRW5kfVxuICAgICAgICBvbk1vdXNlRW50ZXI9e29uTW91c2VFbnRlcn1cbiAgICAgICAgb25Nb3VzZUxlYXZlPXtvbk1vdXNlTGVhdmV9XG4gICAgICAgIG9uS2V5RG93bj17KGUpID0+IHtcbiAgICAgICAgICBpZiAoZS5rZXkgPT09IFwiRW50ZXJcIiB8fCBlLmtleSA9PT0gXCIgXCIpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGhhbmRsZU9wZW4oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGUua2V5ID09PSBcIkVzY2FwZVwiKSBoYW5kbGVDbG9zZSgpO1xuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICBib3JkZXJCb3R0b206IGAxcHggZGFzaGVkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAke01hdGgucm91bmQobGFiZWxPcGFjaXR5ICogMTAwKX0lLCB0cmFuc3BhcmVudClgLFxuICAgICAgICAgIHBhZGRpbmdCb3R0b206IDEsXG4gICAgICAgICAgY3Vyc29yOiBcImhlbHBcIixcbiAgICAgICAgICBjb2xvcjogXCJpbmhlcml0XCIsXG4gICAgICAgICAgdHJhbnNpdGlvbjogXCJib3JkZXItY29sb3IgMjgwbXMgZWFzZVwiLFxuICAgICAgICAgIFdlYmtpdFRhcEhpZ2hsaWdodENvbG9yOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgdXNlclNlbGVjdDogXCJub25lXCIsXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtjaGlsZHJlbiB8fCBkZWYubGFiZWx9XG4gICAgICA8L3NwYW4+XG5cbiAgICAgIHtvcGVuICYmIChcbiAgICAgICAgPD5cbiAgICAgICAgICB7LyogVGFwLW91dHNpZGUgb3ZlcmxheSAoaW52aXNpYmxlKSBcdTIwMTQgY2xvc2UgYXUgdGFwIG4naW1wb3J0ZSBvXHUwMEY5IGFpbGxldXJzLlxuICAgICAgICAgICAgICAyMDI2LTA0LTI4IGZpeCBidWcgVDY4IDogcmV0aXJcdTAwRTkgb25Ub3VjaFN0YXJ0PXtoYW5kbGVDbG9zZX0gcXVpIHNlIGRcdTAwRTljbGVuY2hhaXRcbiAgICAgICAgICAgICAgcHJcdTAwRTltYXR1clx1MDBFOW1lbnQgcXVhbmQgbGUgZG9pZ3Qgc2UgcmVsZXZhaXQgYXByXHUwMEU4cyBsb25nLXByZXNzIChzeW50aGVzZSB0b3VjaFxuICAgICAgICAgICAgICBldmVudCBxdWkgdG91Y2hhaXQgbCdvdmVybGF5IGludmlzaWJsZSBqdXN0ZSBhcHJcdTAwRThzIGwnb3BlbikuIEdhcmRlciBvbkNsaWNrXG4gICAgICAgICAgICAgIHN1ZmZpdCBwb3VyIGZlcm1lciBzdXIgdGFwIGRlaG9ycyAobGVzIGNsaWNrcyBwcm92aWVubmVudCBhdXNzaSBkZSB0b3VjaGVuZFxuICAgICAgICAgICAgICBzdXIgbW9iaWxlLCBtYWlzIEFQUlx1MDBDOFMgcXVlIGxlIHBvcG92ZXIgYWl0IHBsZWluZW1lbnQgb3V2ZXJ0KS4gKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgb25DbGljaz17aGFuZGxlQ2xvc2V9XG4gICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIiwgaW5zZXQ6IDAsIHpJbmRleDogNDAwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgey8qIFBvcG92ZXIgKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgcmVmPXtwb3BvdmVyUmVmfVxuICAgICAgICAgICAgcm9sZT1cInRvb2x0aXBcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgICAgICAgICAgICAgdG9wOiBwb3BvdmVyUG9zLnRvcCxcbiAgICAgICAgICAgICAgbGVmdDogcG9wb3ZlclBvcy5sZWZ0LFxuICAgICAgICAgICAgICB6SW5kZXg6IDQwMSxcbiAgICAgICAgICAgICAgbWF4V2lkdGg6IDMyMCxcbiAgICAgICAgICAgICAgd2lkdGg6IFwiY2FsYygxMDB2dyAtIDI0cHgpXCIsXG4gICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA5NiUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogMjAsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogXCIwIDhweCAyOHB4IGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtZmxvb3IpIDYwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgIGFuaW1hdGlvbjogXCJ0ZXJtLXBvcCAyODBtcyBjdWJpYy1iZXppZXIoMC40NSwwLDAuNTUsMSkgYm90aFwiLFxuICAgICAgICAgICAgICBiYWNrZHJvcEZpbHRlcjogXCJibHVyKDZweClcIixcbiAgICAgICAgICAgICAgV2Via2l0QmFja2Ryb3BGaWx0ZXI6IFwiYmx1cig2cHgpXCIsXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiB7XG4gICAgICAgICAgICAgIC8vIDIwMjYtMDQtMjggZml4IGJ1ZyBUNjggOiBuZSBmZXJtZSBRVUUgc2kgb3V2ZXJ0IHBhciBob3ZlclxuICAgICAgICAgICAgICBpZiAoIShcIm9udG91Y2hzdGFydFwiIGluIHdpbmRvdykgJiYgIWV4cGFuZGVkICYmIG9wZW5Tb3VyY2UgPT09ICdob3ZlcicpIGhhbmRsZUNsb3NlKCk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsvKiBUaXRyZSAqL31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTYsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIixcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiA4LFxuICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDFlbVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtkZWYubGFiZWx9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIERcdTAwRTlmaW5pdGlvbiBjb3VydGUgKHRvdWpvdXJzIHZpc2libGUpICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLFxuICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNCxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41NSxcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICAgICAgb3BhY2l0eTogMC45MixcbiAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiBleHBhbmRlZCA/IDEyIDogMTAsXG4gICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtkZWYuc2hvcnR9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIEJvdXRvbiBcImVuIHNhdm9pciBwbHVzXCIgXHUyMTkyIGV4cGFuZCAqL31cbiAgICAgICAgICAgIHshZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHsgZS5zdG9wUHJvcGFnYXRpb24oKTsgc2V0RXhwYW5kZWQodHJ1ZSk7IH19XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogXCJub25lXCIsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMi41LFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC43NSxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDAsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDI4MG1zIGVhc2VcIixcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uTW91c2VFbnRlcj17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDF9XG4gICAgICAgICAgICAgICAgb25Nb3VzZUxlYXZlPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMC43NX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIGVuIHNhdm9pciBwbHVzIFx1MjE5MlxuICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgIHsvKiBEXHUwMEU5ZmluaXRpb24gbG9uZ3VlICsgc291cmNlIChleHBhbmRlZCkgKi99XG4gICAgICAgICAgICB7ZXhwYW5kZWQgJiYgKFxuICAgICAgICAgICAgICA8PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsXG4gICAgICAgICAgICAgICAgICBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTMuNSxcbiAgICAgICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjg4LFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAxMCxcbiAgICAgICAgICAgICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAge2RlZi5sb25nfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubywgbW9ub3NwYWNlKVwiLFxuICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwLjUsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMC41NSxcbiAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICAgICAgICBib3JkZXJUb3A6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDgsXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDQsXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICBzb3VyY2UgXHUwMEI3IHtkZWYuc291cmNlfVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8Lz5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHN0eWxlPntgXG4gICAgICAgICAgICBAa2V5ZnJhbWVzIHRlcm0tcG9wIHtcbiAgICAgICAgICAgICAgZnJvbSB7IG9wYWNpdHk6IDA7IHRyYW5zZm9ybTogc2NhbGUoMC45NikgdHJhbnNsYXRlWSgtMnB4KTsgfVxuICAgICAgICAgICAgICB0byAgIHsgb3BhY2l0eTogMTsgdHJhbnNmb3JtOiBzY2FsZSgxKSB0cmFuc2xhdGVZKDApOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgYH08L3N0eWxlPlxuICAgICAgICA8Lz5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59O1xuXG4vLyBcdTI1MDBcdTI1MDAgR2xvc3NhaXJlU2NyZWVuIFx1MjAxNCByb3V0ZSBcImdsb3NzYWlyZVwiIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gTGlzdGUgYWxwaGFiXHUwMEU5dGlxdWUgZGUgdG91cyBsZXMgdGVybWVzLiBBY2Nlc3NpYmxlIGRlcHVpcyBsYSBwYWdlXG4vLyBcIkNvbW1lbnQgXHUwMEU3YSBtYXJjaGVcIiAobGllbiBmb290ZXIpIEVUIGRlcHVpcyBFeHBsb3JlciAoUHJvZm9uZGV1cnMpLlxuY29uc3QgR2xvc3NhaXJlU2NyZWVuID0gKHsgZ28gfSkgPT4ge1xuICAvLyBUcmkgYWxwaGFiXHUwMEU5dGlxdWUgcGFyIGxhYmVsIGFmZmljaFx1MDBFOVxuICBjb25zdCBlbnRyaWVzID0gT2JqZWN0LmVudHJpZXMod2luZG93LkRSRUFNX0dMT1NTQUlSRSB8fCB7fSlcbiAgICAuc29ydCgoWywgYV0sIFssIGJdKSA9PiBhLmxhYmVsLmxvY2FsZUNvbXBhcmUoYi5sYWJlbCwgXCJmclwiKSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtaW5IZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIsXG4gICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgcGFkZGluZ1RvcDogXCJjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtdG9wLCAwcHgpICsgMThweClcIixcbiAgICAgIHBhZGRpbmdCb3R0b206IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSwgMHB4KSArIDExMHB4KVwiLFxuICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICB9fT5cbiAgICAgIHsvKiBCb3V0b24gcmV0b3VyICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjAgMjJweCAxNHB4XCIsIG1heFdpZHRoOiA2NDAsIG1hcmdpbjogXCIwIGF1dG9cIiB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImNvbW1lbnRcIil9XG4gICAgICAgICAgYXJpYS1sYWJlbD1cInJldG91clwiXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIiwgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC42LFxuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjRweCAwXCIsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDJlbVwiLFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXtlID0+IGUuY3VycmVudFRhcmdldC5zdHlsZS5vcGFjaXR5ID0gMX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAwLjZ9PlxuICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFRpdHJlICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjAgMjJweCAyOHB4XCIsIG1heFdpZHRoOiA2NDAsIG1hcmdpbjogXCIwIGF1dG9cIiwgdGV4dEFsaWduOiBcImNlbnRlclwiIH19PlxuICAgICAgICA8aDEgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgZm9udFNpemU6IDI2LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCBtYXJnaW46IDAsXG4gICAgICAgIH19Pkdsb3NzYWlyZTwvaDE+XG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogMSxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIG1hcmdpbjogXCIxMHB4IGF1dG8gMTJweFwiLFxuICAgICAgICB9fSAvPlxuICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICBmb250U2l6ZTogMTMuNSwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgIG9wYWNpdHk6IDAuNzIsIG1hcmdpbjogMCwgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgfX0+TGVzIG1vdHMgcXVlIHR1IHJlbmNvbnRyZXJhcyBkYW5zIERyZWFtPC9wPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBMaXN0ZSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIwIDE4cHhcIiwgbWF4V2lkdGg6IDY0MCwgbWFyZ2luOiBcIjAgYXV0b1wiIH19PlxuICAgICAgICB7ZW50cmllcy5tYXAoKFtrZXksIGRlZl0pID0+IChcbiAgICAgICAgICA8YXJ0aWNsZSBrZXk9e2tleX0gc3R5bGU9e3tcbiAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogMTgsXG4gICAgICAgICAgICBwYWRkaW5nOiBcIjE2cHggMThweFwiLFxuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDQwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxMiUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNywgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLFxuICAgICAgICAgICAgICBtYXJnaW46IDAsIG1hcmdpbkJvdHRvbTogOCwgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgICAgICB9fT57ZGVmLmxhYmVsfTwvaDI+XG4gICAgICAgICAgICA8cCBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNC41LCBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCBvcGFjaXR5OiAwLjkyLFxuICAgICAgICAgICAgICBtYXJnaW46IDAsIG1hcmdpbkJvdHRvbTogOCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT57ZGVmLnNob3J0fTwvcD5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEzLCBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNzgsXG4gICAgICAgICAgICAgIG1hcmdpbjogMCwgbWFyZ2luQm90dG9tOiAxMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT57ZGVmLmxvbmd9PC9wPlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8sIG1vbm9zcGFjZSlcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDhlbVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTAlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICAgICAgICB9fT5zb3VyY2UgXHUwMEI3IHtkZWYuc291cmNlfTwvZGl2PlxuICAgICAgICAgIDwvYXJ0aWNsZT5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBFeHBvcnRzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuT2JqZWN0LmFzc2lnbih3aW5kb3csIHtcbiAgVGVybURlZixcbiAgR2xvc3NhaXJlU2NyZWVuLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiQUErQkEsTUFBTSxFQUFFLFVBQVUsSUFBSSxXQUFXLElBQUksUUFBUSxHQUFHLElBQUk7QUFHcEQsT0FBTyxrQkFBa0I7QUFBQSxFQUN2QixRQUFRO0FBQUEsSUFDTixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsYUFBYTtBQUFBLElBQ1gsT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLFlBQVk7QUFBQSxJQUNWLE9BQU87QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxvQkFBb0I7QUFBQSxJQUNsQixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsaUJBQWlCO0FBQUEsSUFDZixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRO0FBQUEsRUFDVjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsT0FBTztBQUFBLElBQ1AsT0FBTztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sUUFBUTtBQUFBLEVB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QUFBQSxJQUFNLE9BQU87QUFBQSxJQUN2QixTQUFTO0FBQUEsSUFBTSxRQUFRO0FBQUEsSUFBRyxlQUFlO0FBQUEsRUFDM0MsS0FBRyx5Q0FBdUMsQ0FDNUMsR0FHQSxvQ0FBQyxTQUFJLE9BQU8sRUFBRSxTQUFTLFVBQVUsVUFBVSxLQUFLLFFBQVEsU0FBUyxLQUM5RCxRQUFRLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUNyQixvQ0FBQyxhQUFRLEtBQVUsT0FBTztBQUFBLElBQ3hCLGNBQWM7QUFBQSxJQUNkLFNBQVM7QUFBQSxJQUNULFlBQVk7QUFBQSxJQUNaLFFBQVE7QUFBQSxFQUNWLEtBQ0Usb0NBQUMsUUFBRyxPQUFPO0FBQUEsSUFDVCxZQUFZO0FBQUEsSUFBZ0IsV0FBVztBQUFBLElBQ3ZDLFVBQVU7QUFBQSxJQUFJLE9BQU87QUFBQSxJQUNyQixRQUFRO0FBQUEsSUFBRyxjQUFjO0FBQUEsSUFBRyxlQUFlO0FBQUEsRUFDN0MsS0FBSSxJQUFJLEtBQU0sR0FDZCxvQ0FBQyxPQUFFLE9BQU87QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUFnQixXQUFXO0FBQUEsSUFDdkMsVUFBVTtBQUFBLElBQU0sWUFBWTtBQUFBLElBQzVCLE9BQU87QUFBQSxJQUFlLFNBQVM7QUFBQSxJQUMvQixRQUFRO0FBQUEsSUFBRyxjQUFjO0FBQUEsSUFBRyxVQUFVO0FBQUEsRUFDeEMsS0FBSSxJQUFJLEtBQU0sR0FDZCxvQ0FBQyxPQUFFLE9BQU87QUFBQSxJQUNSLFlBQVk7QUFBQSxJQUFnQixXQUFXO0FBQUEsSUFDdkMsVUFBVTtBQUFBLElBQUksWUFBWTtBQUFBLElBQzFCLE9BQU87QUFBQSxJQUFvQixTQUFTO0FBQUEsSUFDcEMsUUFBUTtBQUFBLElBQUcsY0FBYztBQUFBLElBQUksVUFBVTtBQUFBLEVBQ3pDLEtBQUksSUFBSSxJQUFLLEdBQ2Isb0NBQUMsU0FBSSxPQUFPO0FBQUEsSUFDVixZQUFZO0FBQUEsSUFDWixVQUFVO0FBQUEsSUFBSSxlQUFlO0FBQUEsSUFDN0IsT0FBTztBQUFBLElBQW9CLFNBQVM7QUFBQSxJQUNwQyxlQUFlO0FBQUEsSUFDZixXQUFXO0FBQUEsSUFDWCxZQUFZO0FBQUEsRUFDZCxLQUFHLGdCQUFVLElBQUksTUFBTyxDQUMxQixDQUNELENBQ0gsQ0FDRjtBQUVKO0FBR0EsT0FBTyxPQUFPLFFBQVE7QUFBQSxFQUNwQjtBQUFBLEVBQ0E7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJfYSJdCn0K
