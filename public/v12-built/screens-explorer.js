const { useState: exS, useEffect: exE } = React;
const EXPLORER_SECTIONS = [
  {
    label: "Le tien",
    items: [
      { glyph: "\u263E", label: "Parler avec Anima", hint: "ta pr\xE9sence Dream \u2014 chat, voix, threads (Sprint A)", route: "dream-chat" },
      { glyph: "\u2609", label: "Tes kairos", hint: "l'historique de tes r\xEAves et signes", route: "journal", termInLabel: "kairos" },
      { glyph: "\u2726", label: "Sagesse des kairos", hint: "l'IA tisse depuis tes patterns", route: "journal-jour", action: "wisdom", termInLabel: "sagesse_des_kairos" },
      { glyph: "\u274D", label: "Mon dictionnaire", hint: "20+ symboles personnels qui reviennent dans tes r\xEAves", route: "personal-dictionary" },
      { glyph: "\u21BB", label: "Motifs r\xE9currents", hint: "ce qui revient dans tes r\xEAves \u2014 re-entr\xE9e consciente Aizenstat", route: "recurring" },
      { glyph: "\u25C9", label: "Oracle du Corps", hint: "le corps comme sismographe", route: "oracle-corps" },
      { glyph: "\u274B", label: "Cauchemars & Deuil", hint: "sanctuaire pour ce qui p\xE8se", route: "nightmares" }
    ]
  },
  {
    label: "Pratiques",
    items: [
      { glyph: "\u25D0", label: "Lucid Dreaming", hint: "5 onglets \xB7 profil, RC, dream signs, WBTB, stats \u2014 anti-iatrog\xE8ne", route: "lucid-profile" },
      { glyph: "\u274B", label: "Tales", hint: "32 contes r\xE9els qui font \xE9cho \xE0 tes r\xEAves", route: "conte-miroir" }
    ]
  },
  {
    label: "Profondeurs",
    items: [
      { glyph: "?", label: "Glossaire", hint: "tous les mots de Dream d\xE9finis", route: "glossaire" },
      { glyph: "\xB7", label: "Param\xE8tres", hint: "privacy, notifications, d\xE9sactivation", route: "privacy" },
      { glyph: "?", label: "Comment \xE7a marche", hint: "FAQ par persona", route: "comment" }
    ]
  }
];
function renderLabelWithTerm(label, termKey) {
  var _a;
  const T = window.TermDef;
  const def = (_a = window.DREAM_GLOSSAIRE) == null ? void 0 : _a[termKey];
  if (!T || !def) return label;
  const target = def.label;
  const lower = label.toLowerCase();
  const idx = lower.indexOf(target.toLowerCase());
  if (idx === -1) return label;
  const before = label.slice(0, idx);
  const match = label.slice(idx, idx + target.length);
  const after = label.slice(idx + target.length);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, before, /* @__PURE__ */ React.createElement(
    "span",
    {
      onClick: (e) => e.stopPropagation(),
      onTouchStart: (e) => e.stopPropagation()
    },
    /* @__PURE__ */ React.createElement(T, { term: termKey }, match)
  ), after);
}
const ExplorerCard = ({ item, onTap }) => /* @__PURE__ */ React.createElement(
  "button",
  {
    onClick: onTap,
    "aria-label": item.label,
    style: {
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
      minHeight: 64
    },
    onMouseEnter: (e) => {
      e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 6%, color-mix(in oklch, var(--night-warm) 50%, transparent))";
      e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 32%, var(--ash-deep))";
      e.currentTarget.style.transform = "scale(1.015)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = "color-mix(in oklch, var(--night-warm) 40%, transparent)";
      e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 12%, var(--ash-deep))";
      e.currentTarget.style.transform = "scale(1)";
    }
  },
  /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    fontSize: 18,
    color: "var(--silk-gold)",
    opacity: 0.82,
    fontStyle: "italic",
    textAlign: "center"
  } }, item.glyph),
  /* @__PURE__ */ React.createElement("span", { style: { display: "flex", flexDirection: "column", gap: 2, minWidth: 0 } }, /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--sans)",
    fontSize: 15.5,
    color: "var(--bone)",
    fontWeight: 400,
    letterSpacing: "0.005em"
  } }, item.termInLabel ? renderLabelWithTerm(item.label, item.termInLabel) : item.label), /* @__PURE__ */ React.createElement("span", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12.5,
    color: "var(--ash-light)",
    opacity: 0.72,
    lineHeight: 1.4,
    textWrap: "pretty"
  } }, item.hint)),
  /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", style: {
    fontSize: 14,
    color: "var(--ash-light)",
    opacity: 0.45,
    textAlign: "center",
    fontFamily: "var(--serif)"
  } }, "\u2192")
);
const ExplorerScreen = ({ go }) => {
  const handleTap = (item) => {
    if (typeof go !== "function") return;
    if (item.action === "wisdom") {
      try {
        window.dreamAutoTriggerWisdom = true;
      } catch (e) {
      }
    }
    go(item.route);
  };
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
    padding: "0 22px 20px",
    maxWidth: 580,
    width: "100%",
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
  } }, "Explorer"), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    width: 48,
    height: 1,
    background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
    margin: "0 auto 10px"
  } }), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13.5,
    color: "var(--ash-light)",
    opacity: 0.72,
    margin: 0,
    letterSpacing: "0.02em"
  } }, "Toutes les portes de Dream")), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "0 18px",
    maxWidth: 580,
    width: "100%",
    margin: "0 auto"
  } }, EXPLORER_SECTIONS.map((section, sIdx) => /* @__PURE__ */ React.createElement("section", { key: section.label, style: {
    marginBottom: sIdx < EXPLORER_SECTIONS.length - 1 ? 26 : 12
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono, monospace)",
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "var(--ash-light)",
    opacity: 0.5,
    padding: "0 6px 10px"
  } }, section.label), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, section.items.map((item) => /* @__PURE__ */ React.createElement(
    ExplorerCard,
    {
      key: item.label,
      item,
      onTap: () => handleTap(item)
    }
  )))))), /* @__PURE__ */ React.createElement("div", { style: {
    position: "relative",
    zIndex: 1,
    padding: "12px 22px 0",
    maxWidth: 580,
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 11,
    color: "var(--ash-light)",
    opacity: 0.4,
    letterSpacing: "0.05em"
  } }, "v0.4 \xB7 alpha"));
};
const CommentScreen = ({ go }) => {
  const personas = [
    {
      glyph: "\u{1F319}",
      title: "Tu r\xEAves souvent",
      text: "D\xE9pose chaque r\xEAve d\xE8s le r\xE9veil \u2014 Dream cherche les figures, lieux, \xE9motions qui reviennent. Au fil des semaines, tu vois ton paysage onirique se dessiner. La Sagesse des kairos tisse depuis tes patterns. C'est ton miroir long-terme."
    },
    {
      glyph: "\u2728",
      title: "Tu te reconnectes",
      text: "Commence par une note de jour, un fragment, une sensation au r\xE9veil. Le Mode Lucid (dans Explorer) propose des reality-checks doux pour \xE9paissir la m\xE9moire onirique. Ton corps redevient sismographe via Oracle du Corps. La porte se rouvre sans forcer."
    },
    {
      glyph: "\u2609",
      title: "Tu cherches du sens",
      text: "Dream n'est pas un journal de r\xEAves \u2014 c'est une mati\xE8re vivante qui \xE9claire ta vie de jour. Swipe gauche depuis l'accueil pour voir ton Journal de Vie LUMINEUX. Anima Mundi te montre ce que r\xEAve le monde anonymement. Les Cercles (Explorer) te connectent \xE0 d'autres r\xEAveurs."
    }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: {
    minHeight: "100vh",
    background: "var(--night-floor)",
    color: "var(--bone)",
    paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
    paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
    position: "relative"
  } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 14px", maxWidth: 580, margin: "0 auto" } }, /* @__PURE__ */ React.createElement(
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
    "\u2190 retour"
  )), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px 20px", maxWidth: 580, margin: "0 auto", textAlign: "center" } }, /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 24,
    color: "var(--bone)",
    margin: 0
  } }, "Comment \xE7a marche"), /* @__PURE__ */ React.createElement("div", { "aria-hidden": "true", style: {
    width: 48,
    height: 1,
    background: "color-mix(in oklch, var(--silk-gold) 30%, transparent)",
    margin: "10px auto 0"
  } })), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 22px", maxWidth: 580, margin: "0 auto" } }, personas.map((p, i) => /* @__PURE__ */ React.createElement("div", { key: p.title, style: {
    marginBottom: 24,
    padding: "18px 18px",
    background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"
  } }, /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10
  } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 20 } }, p.glyph), /* @__PURE__ */ React.createElement("h2", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    color: "var(--bone)",
    margin: 0,
    letterSpacing: "0.005em"
  } }, p.title)), /* @__PURE__ */ React.createElement("p", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 14.5,
    lineHeight: 1.6,
    color: "var(--ash-light)",
    opacity: 0.88,
    margin: 0,
    textWrap: "pretty"
  } }, p.text)))));
};
Object.assign(window, {
  ExplorerScreen,
  CommentScreen,
  EXPLORER_SECTIONS
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1leHBsb3Jlci5qc3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qIGdsb2JhbCBSZWFjdCAqL1xuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBFeHBsb3JlclNjcmVlbiBcdTIwMTQgSHViIGNlbnRyYWxpc1x1MDBFOSBzb3VzLWFwcHMgKyBmb25jdGlvbm5hbGl0XHUwMEU5c1xuLy8gU3BlYyA6IDJfREVTSUdOIFx1MDBBNzExLmJpcy4xNyAoU3ByaW50IFAwLjIgKyBQMC4zIFx1MjAxNCAyMDI2LTA0LTI3KVxuLy9cbi8vIFJFTVBMQUNFIGxlIGRyYXdlciBjYWNoXHUwMEU5IGRlcnJpXHUwMEU4cmUgbGUgZ2x5cGhlIGx1bmUgKERpc2NvdmVyRHJhd2VyXG4vLyBlbiBcdTAwQTcxMS5iaXMuMTQpIHBhciB1biBvbmdsZXQgZFx1MDBFOWRpXHUwMEU5IGRhbnMgQm90dG9tTmF2LiBMYSBuYXYgcGFzc2Vcbi8vIGRlIDQgb25nbGV0cyArIGRyYXdlciBjYWNoXHUwMEU5IFx1MDBFMCA1IG9uZ2xldHMgZXhwbGljaXRlcyA6XG4vL1xuLy8gICBbIFx1MjYzRSB2aWUgXSBbIFx1MjczNyBwb3J0cmFpdCBdIFsgRkFCIFx1MjMwNCBdIFsgXHUyNUM5IGV4cGxvcmVyIF0gWyBcdTI1RDAgbW9uZGUgXVxuLy9cbi8vIERpYWdub3N0aWMgVVggMjcvMDQgOiA2IHpvbmVzIGRlIG5hdmlnYXRpb24gKDQgb25nbGV0cyArIEZBQiArXG4vLyBkcmF3ZXIgY2FjaFx1MDBFOSBkZXJyaVx1MDBFOHJlIGdseXBoZSBtdWV0KSA9IEhpY2sncyBMYXcgdmlvbFx1MDBFOS4gU29sdXRpb25cbi8vIHNlbmlvciBkZXNpZ24gOiBjb252ZXJ0aXIgbGUgZHJhd2VyIGVuIHJvdXRlIGV4cGxpY2l0ZSArIGNhcmRzXG4vLyB2ZXJ0aWNhbGVzIGhpXHUwMEU5cmFyY2hpc1x1MDBFOWVzIHBhciBjYXRcdTAwRTlnb3JpZS5cbi8vXG4vLyBQYXR0ZXJucyBkb21pbmFudHMgOlxuLy8gICAtIERJU0NPVkVSQUJMRV9ERVBUSCAoUC1aXHUwMEU5cm8gXHUwMEE3Mi4xKSBcdTIwMTQgdG91dGVzIGxlcyBzb3VzLWFwcHNcbi8vICAgICBhY2Nlc3NpYmxlcyBkJ3VuIHRhcCwgcGx1cyBkZSBmcmljdGlvbiBcInNhdm9pciB0YXBwZXIgbGEgbHVuZVwiXG4vLyAgIC0gSElcdTAwQzlSQVJDSElFIEVYUExJQ0lURSAoQmlibGUgXHUwMEE3MS42KSBcdTIwMTQgMyBzZWN0aW9ucyBub21tXHUwMEU5ZXMgOlxuLy8gICAgIExlIHRpZW4gXHUwMEI3IExlcyBhdXRyZXMgXHUwMEI3IFByb2ZvbmRldXJzIChtZW50YWwgbW9kZWwgY2xhaXIpXG4vLyAgIC0gU09CUklFVFx1MDBDOSBOSUdIVC1GSVJTVCAoRGVzaWduIFx1MDBBNzYuMikgXHUyMDE0IHBhbGV0dGUgbmlnaHQtZmxvb3IsXG4vLyAgICAgYXNoIHN1YnRpbCBvdmVybGF5LCBFQiBHYXJhbW9uZCBpdGFsaWMgcGFydG91dFxuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5cbmNvbnN0IHsgdXNlU3RhdGU6IGV4UywgdXNlRWZmZWN0OiBleEUgfSA9IFJlYWN0O1xuXG4vLyBcdTI1MDBcdTI1MDAgU2VjdGlvbnMgKyBpdGVtcyBkdSBodWIgRXhwbG9yZXIgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBOb3RlIDogb3JkcmUgPSBwcmlvcml0XHUwMEU5IHBzeWNoaXF1ZS4gXCJMZSB0aWVuXCIgZCdhYm9yZCAobGVzIHBvcnRlc1xuLy8gcXVlIHR1IHBvc3NcdTAwRThkZXMgZFx1MDBFOWpcdTAwRTApLCBwdWlzIFwiTGVzIGF1dHJlc1wiIChjZSBxdWkgc2UgcGFydGFnZSksXG4vLyBwdWlzIFwiUHJvZm9uZGV1cnNcIiAobGVzIHByYXRpcXVlcyBhdmFuY1x1MDBFOWVzICsgcGFyYW1cdTAwRTh0cmVzKS5cbi8vIDIwMjYtMDQtMjcgUDAuNCBcdTIwMTQgYHRlcm1JbkxhYmVsYCA6IGtleSBnbG9zc2FpcmUgXHUwMEUwIHdyYXBwZXIgZGFucyBsZSBsYWJlbFxuLy8gKHByZW1pZXIgbW90IHNwXHUwMEU5Y2lhbGlzXHUwMEU5IHJlbmNvbnRyXHUwMEU5KS4gYHRlcm1JbkhpbnRgIDogaWRlbSBwb3VyIGxhIGRlc2NyaXB0aW9uLlxuLy8gQ29tcG9zYW50IEV4cGxvcmVyQ2FyZCBkXHUwMEU5dGVjdGUgY2VzIGNsXHUwMEU5cyBldCB1dGlsaXNlIHdpbmRvdy5UZXJtRGVmIHNpIGRpc3BvLlxuY29uc3QgRVhQTE9SRVJfU0VDVElPTlMgPSBbXG4gIHtcbiAgICBsYWJlbDogXCJMZSB0aWVuXCIsXG4gICAgaXRlbXM6IFtcbiAgICAgIHsgZ2x5cGg6IFwiXHUyNjNFXCIsIGxhYmVsOiBcIlBhcmxlciBhdmVjIEFuaW1hXCIsICBoaW50OiBcInRhIHByXHUwMEU5c2VuY2UgRHJlYW0gXHUyMDE0IGNoYXQsIHZvaXgsIHRocmVhZHMgKFNwcmludCBBKVwiLCAgICAgICAgICAgIHJvdXRlOiBcImRyZWFtLWNoYXRcIiB9LFxuICAgICAgeyBnbHlwaDogXCJcdTI2MDlcIiwgbGFiZWw6IFwiVGVzIGthaXJvc1wiLCAgICAgICAgIGhpbnQ6IFwibCdoaXN0b3JpcXVlIGRlIHRlcyByXHUwMEVBdmVzIGV0IHNpZ25lc1wiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZTogXCJqb3VybmFsXCIsICAgICAgIHRlcm1JbkxhYmVsOiBcImthaXJvc1wiIH0sXG4gICAgICB7IGdseXBoOiBcIlx1MjcyNlwiLCBsYWJlbDogXCJTYWdlc3NlIGRlcyBrYWlyb3NcIiwgaGludDogXCJsJ0lBIHRpc3NlIGRlcHVpcyB0ZXMgcGF0dGVybnNcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGU6IFwiam91cm5hbC1qb3VyXCIsIGFjdGlvbjogXCJ3aXNkb21cIiwgdGVybUluTGFiZWw6IFwic2FnZXNzZV9kZXNfa2Fpcm9zXCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUyNzREXCIsIGxhYmVsOiBcIk1vbiBkaWN0aW9ubmFpcmVcIiwgICBoaW50OiBcIjIwKyBzeW1ib2xlcyBwZXJzb25uZWxzIHF1aSByZXZpZW5uZW50IGRhbnMgdGVzIHJcdTAwRUF2ZXNcIiwgICAgICAgICAgICByb3V0ZTogXCJwZXJzb25hbC1kaWN0aW9uYXJ5XCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUyMUJCXCIsIGxhYmVsOiBcIk1vdGlmcyByXHUwMEU5Y3VycmVudHNcIiwgIGhpbnQ6IFwiY2UgcXVpIHJldmllbnQgZGFucyB0ZXMgclx1MDBFQXZlcyBcdTIwMTQgcmUtZW50clx1MDBFOWUgY29uc2NpZW50ZSBBaXplbnN0YXRcIiwgIHJvdXRlOiBcInJlY3VycmluZ1wiIH0sXG4gICAgICB7IGdseXBoOiBcIlx1MjVDOVwiLCBsYWJlbDogXCJPcmFjbGUgZHUgQ29ycHNcIiwgICAgaGludDogXCJsZSBjb3JwcyBjb21tZSBzaXNtb2dyYXBoZVwiLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGU6IFwib3JhY2xlLWNvcnBzXCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUyNzRCXCIsIGxhYmVsOiBcIkNhdWNoZW1hcnMgJiBEZXVpbFwiLCBoaW50OiBcInNhbmN0dWFpcmUgcG91ciBjZSBxdWkgcFx1MDBFOHNlXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlOiBcIm5pZ2h0bWFyZXNcIiB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogXCJQcmF0aXF1ZXNcIixcbiAgICBpdGVtczogW1xuICAgICAgeyBnbHlwaDogXCJcdTI1RDBcIiwgbGFiZWw6IFwiTHVjaWQgRHJlYW1pbmdcIiwgICAgIGhpbnQ6IFwiNSBvbmdsZXRzIFx1MDBCNyBwcm9maWwsIFJDLCBkcmVhbSBzaWducywgV0JUQiwgc3RhdHMgXHUyMDE0IGFudGktaWF0cm9nXHUwMEU4bmVcIiwgcm91dGU6IFwibHVjaWQtcHJvZmlsZVwiIH0sXG4gICAgICB7IGdseXBoOiBcIlx1Mjc0QlwiLCBsYWJlbDogXCJUYWxlc1wiLCAgICAgICAgICAgICAgaGludDogXCIzMiBjb250ZXMgclx1MDBFOWVscyBxdWkgZm9udCBcdTAwRTljaG8gXHUwMEUwIHRlcyByXHUwMEVBdmVzXCIsICAgICAgICAgICAgICAgICAgICAgICByb3V0ZTogXCJjb250ZS1taXJvaXJcIiB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBsYWJlbDogXCJQcm9mb25kZXVyc1wiLFxuICAgIGl0ZW1zOiBbXG4gICAgICB7IGdseXBoOiBcIj9cIiwgbGFiZWw6IFwiR2xvc3NhaXJlXCIsICAgICAgICAgIGhpbnQ6IFwidG91cyBsZXMgbW90cyBkZSBEcmVhbSBkXHUwMEU5ZmluaXNcIiwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGU6IFwiZ2xvc3NhaXJlXCIgfSxcbiAgICAgIHsgZ2x5cGg6IFwiXHUwMEI3XCIsIGxhYmVsOiBcIlBhcmFtXHUwMEU4dHJlc1wiLCAgICAgICAgIGhpbnQ6IFwicHJpdmFjeSwgbm90aWZpY2F0aW9ucywgZFx1MDBFOXNhY3RpdmF0aW9uXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlOiBcInByaXZhY3lcIiB9LFxuICAgICAgeyBnbHlwaDogXCI/XCIsIGxhYmVsOiBcIkNvbW1lbnQgXHUwMEU3YSBtYXJjaGVcIiwgIGhpbnQ6IFwiRkFRIHBhciBwZXJzb25hXCIsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZTogXCJjb21tZW50XCIgfSxcbiAgICBdLFxuICB9LFxuXTtcblxuLy8gXHUyNTAwXHUyNTAwIEhlbHBlciBQMC40IFx1MjAxNCByZW5kZXIgbGFiZWwgYXZlYyBUZXJtRGVmIHdyYXBwYW50IGxlIHRlcm1lIGNpYmxlXG4vLyBMZSBjb21wb3NhbnQgVGVybURlZiBpbnRlcmNlcHRlIGxlIHRhcCwgZG9uYyBvbiBzdG9wcGUgbGEgcHJvcGFnYXRpb25cbi8vIHBvdXIgXHUwMEU5dml0ZXIgZGUgZFx1MDBFOWNsZW5jaGVyIGxlIHJvdXRpbmcgY2FyZC4gKFRlcm1EZWYgZS5wcmV2ZW50RGVmYXVsdCBkXHUwMEU5alx1MDBFMC4pXG5mdW5jdGlvbiByZW5kZXJMYWJlbFdpdGhUZXJtKGxhYmVsLCB0ZXJtS2V5KSB7XG4gIGNvbnN0IFQgPSB3aW5kb3cuVGVybURlZjtcbiAgY29uc3QgZGVmID0gd2luZG93LkRSRUFNX0dMT1NTQUlSRT8uW3Rlcm1LZXldO1xuICBpZiAoIVQgfHwgIWRlZikgcmV0dXJuIGxhYmVsO1xuICAvLyBPbiBjaGVyY2hlIGxlIGxhYmVsIGdsb3NzYWlyZSBkYW5zIGxlIHRleHRlIChjYXNlLWluc2Vuc2l0aXZlKSBldCBvblxuICAvLyB3cmFwIFVOSVFVRU1FTlQgY2V0dGUgb2NjdXJyZW5jZS4gU2kgcGFzIHRyb3V2XHUwMEU5LCBmYWxsYmFjayBicnV0LlxuICBjb25zdCB0YXJnZXQgPSBkZWYubGFiZWw7XG4gIGNvbnN0IGxvd2VyID0gbGFiZWwudG9Mb3dlckNhc2UoKTtcbiAgY29uc3QgaWR4ID0gbG93ZXIuaW5kZXhPZih0YXJnZXQudG9Mb3dlckNhc2UoKSk7XG4gIGlmIChpZHggPT09IC0xKSByZXR1cm4gbGFiZWw7XG4gIGNvbnN0IGJlZm9yZSA9IGxhYmVsLnNsaWNlKDAsIGlkeCk7XG4gIGNvbnN0IG1hdGNoID0gbGFiZWwuc2xpY2UoaWR4LCBpZHggKyB0YXJnZXQubGVuZ3RoKTtcbiAgY29uc3QgYWZ0ZXIgPSBsYWJlbC5zbGljZShpZHggKyB0YXJnZXQubGVuZ3RoKTtcbiAgLy8gc3RvcFByb3BhZ2F0aW9uIHN1ciBzcGFuIGV4dGVybmUgcG91ciBcdTAwRTl2aXRlciBsZSB0YXAgcm91dGFudCBsYSBjYXJkXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtiZWZvcmV9XG4gICAgICA8c3BhbiBvbkNsaWNrPXsoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKX1cbiAgICAgICAgICAgIG9uVG91Y2hTdGFydD17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9PlxuICAgICAgICA8VCB0ZXJtPXt0ZXJtS2V5fT57bWF0Y2h9PC9UPlxuICAgICAgPC9zcGFuPlxuICAgICAge2FmdGVyfVxuICAgIDwvPlxuICApO1xufVxuXG4vLyBcdTI1MDBcdTI1MDAgQ2FyZCBpdGVtIFx1MjAxNCByXHUwMEU5dXRpbGlzXHUwMEU5IGRhbnMgdG91dGVzIGxlcyBzZWN0aW9ucyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmNvbnN0IEV4cGxvcmVyQ2FyZCA9ICh7IGl0ZW0sIG9uVGFwIH0pID0+IChcbiAgPGJ1dHRvblxuICAgIG9uQ2xpY2s9e29uVGFwfVxuICAgIGFyaWEtbGFiZWw9e2l0ZW0ubGFiZWx9XG4gICAgc3R5bGU9e3tcbiAgICAgIGRpc3BsYXk6IFwiZ3JpZFwiLFxuICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogXCIyOHB4IDFmciAxOHB4XCIsXG4gICAgICBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLFxuICAgICAgZ2FwOiAxNCxcbiAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgIHRleHRBbGlnbjogXCJsZWZ0XCIsXG4gICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tbmlnaHQtd2FybSkgNDAlLCB0cmFuc3BhcmVudClcIixcbiAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEyJSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIixcbiAgICAgIHBhZGRpbmc6IFwiMTRweCAxNnB4XCIsXG4gICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgIHRyYW5zaXRpb246IFwiYWxsIDM4MG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKVwiLFxuICAgICAgbWluSGVpZ2h0OiA2NCxcbiAgICB9fVxuICAgIG9uTW91c2VFbnRlcj17ZSA9PiB7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDYlLCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDUwJSwgdHJhbnNwYXJlbnQpKVwiO1xuICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzIlLCB2YXIoLS1hc2gtZGVlcCkpXCI7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxLjAxNSlcIjtcbiAgICB9fVxuICAgIG9uTW91c2VMZWF2ZT17ZSA9PiB7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUuYmFja2dyb3VuZCA9IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA0MCUsIHRyYW5zcGFyZW50KVwiO1xuICAgICAgZS5jdXJyZW50VGFyZ2V0LnN0eWxlLmJvcmRlckNvbG9yID0gXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTIlLCB2YXIoLS1hc2gtZGVlcCkpXCI7XG4gICAgICBlLmN1cnJlbnRUYXJnZXQuc3R5bGUudHJhbnNmb3JtID0gXCJzY2FsZSgxKVwiO1xuICAgIH19XG4gID5cbiAgICB7LyogR2x5cGhlICovfVxuICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICBmb250U2l6ZTogMTgsXG4gICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsXG4gICAgICBvcGFjaXR5OiAwLjgyLFxuICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgIH19PntpdGVtLmdseXBofTwvc3Bhbj5cblxuICAgIHsvKiBUaXRyZSArIGRlc2NyaXB0aW9uICovfVxuICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6IFwiZmxleFwiLCBmbGV4RGlyZWN0aW9uOiBcImNvbHVtblwiLCBnYXA6IDIsIG1pbldpZHRoOiAwIH19PlxuICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zYW5zKVwiLFxuICAgICAgICBmb250U2l6ZTogMTUuNSxcbiAgICAgICAgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgZm9udFdlaWdodDogNDAwLFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDA1ZW1cIixcbiAgICAgIH19PntpdGVtLnRlcm1JbkxhYmVsID8gcmVuZGVyTGFiZWxXaXRoVGVybShpdGVtLmxhYmVsLCBpdGVtLnRlcm1JbkxhYmVsKSA6IGl0ZW0ubGFiZWx9PC9zcGFuPlxuICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICAgICAgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMTIuNSxcbiAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICBvcGFjaXR5OiAwLjcyLFxuICAgICAgICBsaW5lSGVpZ2h0OiAxLjQsXG4gICAgICAgIHRleHRXcmFwOiBcInByZXR0eVwiLFxuICAgICAgfX0+e2l0ZW0uaGludH08L3NwYW4+XG4gICAgPC9zcGFuPlxuXG4gICAgey8qIENoZXZyb24gXHUyMTkyICovfVxuICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPXt7XG4gICAgICBmb250U2l6ZTogMTQsXG4gICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICBvcGFjaXR5OiAwLjQ1LFxuICAgICAgdGV4dEFsaWduOiBcImNlbnRlclwiLFxuICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIixcbiAgICB9fT5cdTIxOTI8L3NwYW4+XG4gIDwvYnV0dG9uPlxuKTtcblxuLy8gXHUyNTAwXHUyNTAwIEV4cGxvcmVyU2NyZWVuIFx1MjAxNCBjb21wb3NhbnQgcHJpbmNpcGFsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgRXhwbG9yZXJTY3JlZW4gPSAoeyBnbyB9KSA9PiB7XG4gIC8vIEhhbmRsZXIgdGFwIGNhcmQgXHUyMDE0IHN1cHBvcnRlIGFjdGlvbiBcIndpc2RvbVwiIHBvdXIgbCdpdGVtIFNhZ2Vzc2VcbiAgLy8gMjAyNi0wNC0yOCBmaXggYnVnIFQ2NyA6IFNhZ2Vzc2UgZGVzIEthaXJvcyByZW52b3lhaXQgYXUgaG9tZSAocm91dGU9XCJob21lXCJcbiAgLy8gc2FucyBoYW5kbGVyIGNcdTAwRTJibFx1MDBFOSkuIERcdTAwRTlzb3JtYWlzIHJvdXRlIHZlcnMgXCJqb3VybmFsLWpvdXJcIiBvXHUwMEY5IGxlIGJvdXRvbiBcdTI3MjZcbiAgLy8gXCJhcHBlbCBcdTAwRTAgbGEgc2FnZXNzZSBkZXMga2Fpcm9zIHN1ciBjZXR0ZSBzZWN0aW9uXCIgZXN0IG5hdGlmIGV0IHByb1x1MDBFOW1pbmVudFxuICAvLyAoY2YuIHNjcmVlbnMtam91cm5hbC1qb3VyLmpzeCBsLjk0NS05NjIgKyB3aW5kb3cuRHJlYW1BUEkuc3VtbW9uS2Fpcm9zV2lzZG9tKS5cbiAgLy8gQXV0by10cmlnZ2VyIDogcG9zZSB1biBmbGFnIGdsb2JhbCBxdWUgam91cm5hbC1qb3VyIHBldXQgbGlyZSBhdSBtb3VudCBwb3VyXG4gIC8vIG91dnJpciBkaXJlY3RlbWVudCBsZSBtb2RhbCBXaXNkb20gKFRPRE86IFx1MDBFMCBjXHUwMEUyYmxlciBkYW5zIHNjcmVlbnMtam91cm5hbC1qb3VyLmpzeFxuICAvLyB1c2VFZmZlY3QgbW91bnQgXHUyMTkyIGlmIHdpbmRvdy5kcmVhbUF1dG9UcmlnZ2VyV2lzZG9tIFx1MjE5MiBkXHUwMEU5Y2xlbmNoZSBzdW1tb24gKyByZXNldCBmbGFnKS5cbiAgY29uc3QgaGFuZGxlVGFwID0gKGl0ZW0pID0+IHtcbiAgICBpZiAodHlwZW9mIGdvICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybjtcbiAgICBpZiAoaXRlbS5hY3Rpb24gPT09IFwid2lzZG9tXCIpIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5kcmVhbUF1dG9UcmlnZ2VyV2lzZG9tID0gdHJ1ZTsgfSBjYXRjaCB7fVxuICAgIH1cbiAgICBnbyhpdGVtLnJvdXRlKTtcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIG1pbkhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgYmFja2dyb3VuZDogXCJ2YXIoLS1uaWdodC1mbG9vcilcIixcbiAgICAgIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICBwYWRkaW5nVG9wOiBcImNhbGMoZW52KHNhZmUtYXJlYS1pbnNldC10b3AsIDBweCkgKyAxOHB4KVwiLFxuICAgICAgcGFkZGluZ0JvdHRvbTogXCJjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtYm90dG9tLCAwcHgpICsgMTEwcHgpXCIsXG4gICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLFxuICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXG4gICAgfX0+XG4gICAgICB7LyogQXNoIHN1YnRsZSBncmFpbiBvdmVybGF5IChtYXR0ZXIgYXNoLCBjb2hcdTAwRTlyZW5jZSBEcmVhbUhvbWUpICovfVxuICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLCBpbnNldDogMCwgcG9pbnRlckV2ZW50czogXCJub25lXCIsXG4gICAgICAgIG9wYWNpdHk6IDAuMTgsIHpJbmRleDogMCxcbiAgICAgIH19PlxuICAgICAgICA8c3ZnIHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPVwibm9uZVwiIHN0eWxlPXt7IGRpc3BsYXk6IFwiYmxvY2tcIiB9fT5cbiAgICAgICAgICA8cmVjdCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsdGVyPVwidXJsKCNub2lzZS1hc2gpXCIgLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEhlYWRlciBzb2JyZSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIiwgekluZGV4OiAxLFxuICAgICAgICBwYWRkaW5nOiBcIjAgMjJweCAyMHB4XCIsXG4gICAgICAgIG1heFdpZHRoOiA1ODAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgICB0ZXh0QWxpZ246IFwiY2VudGVyXCIsXG4gICAgICB9fT5cbiAgICAgICAgPGgxIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAyNiwgY29sb3I6IFwidmFyKC0tYm9uZSlcIixcbiAgICAgICAgICBtYXJnaW46IDAsIG1hcmdpbkJvdHRvbTogMTAsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAwNWVtXCIsXG4gICAgICAgIH19PkV4cGxvcmVyPC9oMT5cbiAgICAgICAgPGRpdiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiA0OCwgaGVpZ2h0OiAxLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDMwJSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICAgICAgbWFyZ2luOiBcIjAgYXV0byAxMHB4XCIsXG4gICAgICAgIH19IC8+XG4gICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgIGZvbnRTaXplOiAxMy41LCBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgb3BhY2l0eTogMC43MixcbiAgICAgICAgICBtYXJnaW46IDAsXG4gICAgICAgICAgbGV0dGVyU3BhY2luZzogXCIwLjAyZW1cIixcbiAgICAgICAgfX0+VG91dGVzIGxlcyBwb3J0ZXMgZGUgRHJlYW08L3A+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIFNlY3Rpb25zICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEsXG4gICAgICAgIHBhZGRpbmc6IFwiMCAxOHB4XCIsXG4gICAgICAgIG1heFdpZHRoOiA1ODAsIHdpZHRoOiBcIjEwMCVcIiwgbWFyZ2luOiBcIjAgYXV0b1wiLFxuICAgICAgfX0+XG4gICAgICAgIHtFWFBMT1JFUl9TRUNUSU9OUy5tYXAoKHNlY3Rpb24sIHNJZHgpID0+IChcbiAgICAgICAgICA8c2VjdGlvbiBrZXk9e3NlY3Rpb24ubGFiZWx9IHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IHNJZHggPCBFWFBMT1JFUl9TRUNUSU9OUy5sZW5ndGggLSAxID8gMjYgOiAxMixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHsvKiBMYWJlbCBzZWN0aW9uIFx1MjAxNCB1cHBlcmNhc2UgbW9ubyBhc2gtbGlnaHQgb3AgMC41ICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8sIG1vbm9zcGFjZSlcIixcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMTZlbVwiLFxuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsXG4gICAgICAgICAgICAgIG9wYWNpdHk6IDAuNSxcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIwIDZweCAxMHB4XCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3NlY3Rpb24ubGFiZWx9XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgey8qIENhcmRzIFx1MjAxNCBnYXAgOHB4IGVudHJlIGNoYXF1ZSAqL31cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogXCJmbGV4XCIsIGZsZXhEaXJlY3Rpb246IFwiY29sdW1uXCIsIGdhcDogOCB9fT5cbiAgICAgICAgICAgICAge3NlY3Rpb24uaXRlbXMubWFwKGl0ZW0gPT4gKFxuICAgICAgICAgICAgICAgIDxFeHBsb3JlckNhcmRcbiAgICAgICAgICAgICAgICAgIGtleT17aXRlbS5sYWJlbH1cbiAgICAgICAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICAgICAgICBvblRhcD17KCkgPT4gaGFuZGxlVGFwKGl0ZW0pfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogRm9vdGVyIHNvYnJlIFx1MjAxNCB2ZXJzaW9uICovfVxuICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICBwb3NpdGlvbjogXCJyZWxhdGl2ZVwiLCB6SW5kZXg6IDEsXG4gICAgICAgIHBhZGRpbmc6IFwiMTJweCAyMnB4IDBcIixcbiAgICAgICAgbWF4V2lkdGg6IDU4MCwgd2lkdGg6IFwiMTAwJVwiLCBtYXJnaW46IFwiMCBhdXRvXCIsXG4gICAgICAgIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICBmb250U2l6ZTogMTEsIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgb3BhY2l0eTogMC40LFxuICAgICAgICBsZXR0ZXJTcGFjaW5nOiBcIjAuMDVlbVwiLFxuICAgICAgfX0+XG4gICAgICAgIHYwLjQgXHUwMEI3IGFscGhhXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBDb21tZW50U2NyZWVuIFx1MjAxNCBwbGFjZWhvbGRlciBzaW1wbGUgRkFRIHBhciBwZXJzb25hIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gMjAyNi0wNC0yNyBTcHJpbnQgUDAuMiA6IHJvdXRlIFwiY29tbWVudFwiIHJcdTAwRTlmXHUwMEU5cmVuY1x1MDBFOWUgcGFyIEV4cGxvcmVyLlxuLy8gU3R1YiBtaW5pbWFsaXN0ZSA6IGxlcyAzIHBlcnNvbmFzIG9uYm9hcmRpbmcgKHJcdTAwRUF2ZXVyIC8gcmVjb25uZXhpb25cbi8vIC8gY2hlcmNoZXVyKSBhdmVjIDEgcGFyYWdyYXBoZSBjaGFjdW5lLiBcdTAwQzl2b2x1dGlvbiBmdXR1cmUgcG9zc2libGVcbi8vIHZlcnMgRkFRIHJpY2hlLCBtYWlzIGNvaFx1MDBFOXJlbmNlIGQnYWJvcmQgKHBhcyBkZSBsaWVuIG1vcnQpLlxuY29uc3QgQ29tbWVudFNjcmVlbiA9ICh7IGdvIH0pID0+IHtcbiAgY29uc3QgcGVyc29uYXMgPSBbXG4gICAge1xuICAgICAgZ2x5cGg6IFwiXHVEODNDXHVERjE5XCIsXG4gICAgICB0aXRsZTogXCJUdSByXHUwMEVBdmVzIHNvdXZlbnRcIixcbiAgICAgIHRleHQ6IFwiRFx1MDBFOXBvc2UgY2hhcXVlIHJcdTAwRUF2ZSBkXHUwMEU4cyBsZSByXHUwMEU5dmVpbCBcdTIwMTQgRHJlYW0gY2hlcmNoZSBsZXMgZmlndXJlcywgbGlldXgsIFx1MDBFOW1vdGlvbnMgcXVpIHJldmllbm5lbnQuIEF1IGZpbCBkZXMgc2VtYWluZXMsIHR1IHZvaXMgdG9uIHBheXNhZ2Ugb25pcmlxdWUgc2UgZGVzc2luZXIuIExhIFNhZ2Vzc2UgZGVzIGthaXJvcyB0aXNzZSBkZXB1aXMgdGVzIHBhdHRlcm5zLiBDJ2VzdCB0b24gbWlyb2lyIGxvbmctdGVybWUuXCIsXG4gICAgfSxcbiAgICB7XG4gICAgICBnbHlwaDogXCJcdTI3MjhcIixcbiAgICAgIHRpdGxlOiBcIlR1IHRlIHJlY29ubmVjdGVzXCIsXG4gICAgICB0ZXh0OiBcIkNvbW1lbmNlIHBhciB1bmUgbm90ZSBkZSBqb3VyLCB1biBmcmFnbWVudCwgdW5lIHNlbnNhdGlvbiBhdSByXHUwMEU5dmVpbC4gTGUgTW9kZSBMdWNpZCAoZGFucyBFeHBsb3JlcikgcHJvcG9zZSBkZXMgcmVhbGl0eS1jaGVja3MgZG91eCBwb3VyIFx1MDBFOXBhaXNzaXIgbGEgbVx1MDBFOW1vaXJlIG9uaXJpcXVlLiBUb24gY29ycHMgcmVkZXZpZW50IHNpc21vZ3JhcGhlIHZpYSBPcmFjbGUgZHUgQ29ycHMuIExhIHBvcnRlIHNlIHJvdXZyZSBzYW5zIGZvcmNlci5cIixcbiAgICB9LFxuICAgIHtcbiAgICAgIGdseXBoOiBcIlx1MjYwOVwiLFxuICAgICAgdGl0bGU6IFwiVHUgY2hlcmNoZXMgZHUgc2Vuc1wiLFxuICAgICAgdGV4dDogXCJEcmVhbSBuJ2VzdCBwYXMgdW4gam91cm5hbCBkZSByXHUwMEVBdmVzIFx1MjAxNCBjJ2VzdCB1bmUgbWF0aVx1MDBFOHJlIHZpdmFudGUgcXVpIFx1MDBFOWNsYWlyZSB0YSB2aWUgZGUgam91ci4gU3dpcGUgZ2F1Y2hlIGRlcHVpcyBsJ2FjY3VlaWwgcG91ciB2b2lyIHRvbiBKb3VybmFsIGRlIFZpZSBMVU1JTkVVWC4gQW5pbWEgTXVuZGkgdGUgbW9udHJlIGNlIHF1ZSByXHUwMEVBdmUgbGUgbW9uZGUgYW5vbnltZW1lbnQuIExlcyBDZXJjbGVzIChFeHBsb3JlcikgdGUgY29ubmVjdGVudCBcdTAwRTAgZCdhdXRyZXMgclx1MDBFQXZldXJzLlwiLFxuICAgIH0sXG4gIF07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtaW5IZWlnaHQ6IFwiMTAwdmhcIixcbiAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtZmxvb3IpXCIsXG4gICAgICBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgcGFkZGluZ1RvcDogXCJjYWxjKGVudihzYWZlLWFyZWEtaW5zZXQtdG9wLCAwcHgpICsgMThweClcIixcbiAgICAgIHBhZGRpbmdCb3R0b206IFwiY2FsYyhlbnYoc2FmZS1hcmVhLWluc2V0LWJvdHRvbSwgMHB4KSArIDExMHB4KVwiLFxuICAgICAgcG9zaXRpb246IFwicmVsYXRpdmVcIixcbiAgICB9fT5cbiAgICAgIHsvKiBCb3V0b24gcmV0b3VyICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiBcIjAgMjJweCAxNHB4XCIsIG1heFdpZHRoOiA1ODAsIG1hcmdpbjogXCIwIGF1dG9cIiB9fT5cbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBnbyAmJiBnbyhcImV4cGxvcmVyXCIpfVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJyZXRvdXIgXHUwMEUwIGV4cGxvcmVyXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLCBib3JkZXI6IFwibm9uZVwiLCBjdXJzb3I6IFwicG9pbnRlclwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBvcGFjaXR5OiAwLjYsXG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgIHBhZGRpbmc6IFwiNHB4IDBcIixcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6IFwiMC4wMmVtXCIsXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9e2UgPT4gZS5jdXJyZW50VGFyZ2V0LnN0eWxlLm9wYWNpdHkgPSAxfVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17ZSA9PiBlLmN1cnJlbnRUYXJnZXQuc3R5bGUub3BhY2l0eSA9IDAuNn0+XG4gICAgICAgICAgXHUyMTkwIHJldG91clxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogVGl0cmUgKi99XG4gICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6IFwiMCAyMnB4IDIwcHhcIiwgbWF4V2lkdGg6IDU4MCwgbWFyZ2luOiBcIjAgYXV0b1wiLCB0ZXh0QWxpZ246IFwiY2VudGVyXCIgfX0+XG4gICAgICAgIDxoMSBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICBmb250U2l6ZTogMjQsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIG1hcmdpbjogMCxcbiAgICAgICAgfX0+Q29tbWVudCBcdTAwRTdhIG1hcmNoZTwvaDE+XG4gICAgICAgIDxkaXYgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogNDgsIGhlaWdodDogMSxcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAzMCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIG1hcmdpbjogXCIxMHB4IGF1dG8gMFwiLFxuICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBQZXJzb25hcyAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogXCIwIDIycHhcIiwgbWF4V2lkdGg6IDU4MCwgbWFyZ2luOiBcIjAgYXV0b1wiIH19PlxuICAgICAgICB7cGVyc29uYXMubWFwKChwLCBpKSA9PiAoXG4gICAgICAgICAgPGRpdiBrZXk9e3AudGl0bGV9IHN0eWxlPXt7XG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IDI0LFxuICAgICAgICAgICAgcGFkZGluZzogXCIxOHB4IDE4cHhcIixcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1uaWdodC13YXJtKSA0MCUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiBcImNlbnRlclwiLCBnYXA6IDEwLFxuICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IDEwLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAyMCB9fT57cC5nbHlwaH08L3NwYW4+XG4gICAgICAgICAgICAgIDxoMiBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogMTcsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMDA1ZW1cIixcbiAgICAgICAgICAgICAgfX0+e3AudGl0bGV9PC9oMj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPHAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTQuNSwgbGluZUhlaWdodDogMS42LFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIG9wYWNpdHk6IDAuODgsXG4gICAgICAgICAgICAgIG1hcmdpbjogMCwgdGV4dFdyYXA6IFwicHJldHR5XCIsXG4gICAgICAgICAgICB9fT57cC50ZXh0fTwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBFeHBvcnRzIFx1MjE5MiB3aW5kb3cgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5PYmplY3QuYXNzaWduKHdpbmRvdywge1xuICBFeHBsb3JlclNjcmVlbixcbiAgQ29tbWVudFNjcmVlbixcbiAgRVhQTE9SRVJfU0VDVElPTlMsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICJBQXlCQSxNQUFNLEVBQUUsVUFBVSxLQUFLLFdBQVcsSUFBSSxJQUFJO0FBUzFDLE1BQU0sb0JBQW9CO0FBQUEsRUFDeEI7QUFBQSxJQUNFLE9BQU87QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEVBQUUsT0FBTyxVQUFLLE9BQU8scUJBQXNCLE1BQU0sOERBQWlFLE9BQU8sYUFBYTtBQUFBLE1BQ3RJLEVBQUUsT0FBTyxVQUFLLE9BQU8sY0FBc0IsTUFBTSwwQ0FBa0UsT0FBTyxXQUFpQixhQUFhLFNBQVM7QUFBQSxNQUNqSyxFQUFFLE9BQU8sVUFBSyxPQUFPLHNCQUFzQixNQUFNLGtDQUFtRSxPQUFPLGdCQUFnQixRQUFRLFVBQVUsYUFBYSxxQkFBcUI7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
