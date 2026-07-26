const { useState: pdS, useEffect: pdE, useCallback: pdCB } = React;
function pdValenceLabel(v) {
  if (v === null || v === void 0) return null;
  if (v > 0.4) return "porteuse";
  if (v > 0.15) return "plut\xF4t douce";
  if (v < -0.4) return "sombre";
  if (v < -0.15) return "plut\xF4t pesante";
  return "m\xEAl\xE9e";
}
function pdValenceColor(v) {
  if (v === null || v === void 0) return "var(--ash-light)";
  if (v > 0.15) return "var(--silk-gold)";
  if (v < -0.15) return "color-mix(in oklch, var(--ash-light) 80%, var(--ash-deep))";
  return "var(--ash-light)";
}
function pdFormatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  } catch (e) {
    return "";
  }
}
function pdKindLabel(k) {
  return {
    motif: "motif",
    figure: "figure",
    lieu: "lieu",
    sensation: "sensation",
    synchronicite: "synchronicit\xE9"
  }[k] || k;
}
const SymbolCard = ({ symbol, expanded, onToggleExpand, onSeeKairos, onArchive, onGenerateAngles, anglesLoading, anglesError }) => {
  const M = window.MatterBubble;
  const valenceLabel = pdValenceLabel(symbol.valence_avg);
  const hasAngles = symbol.paper_angle && symbol.stone_angle && symbol.silk_angle;
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "18px 20px",
    background: "color-mix(in oklch, var(--night-warm) 60%, transparent)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
    borderRadius: 2,
    marginBottom: 14,
    animation: "dream-skeleton-fade-in 320ms cubic-bezier(0.45,0,0.55,1) both"
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 22,
    color: "var(--bone)",
    lineHeight: 1.2,
    marginBottom: 6,
    wordBreak: "break-word"
  } }, symbol.symbol_text), /* @__PURE__ */ React.createElement("div", { style: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    fontFamily: "var(--mono)",
    fontSize: 10.5,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--ash-light)",
    opacity: 0.78
  } }, /* @__PURE__ */ React.createElement("span", null, pdKindLabel(symbol.symbol_kind)), /* @__PURE__ */ React.createElement("span", null, symbol.count_total, "\xD7 "), valenceLabel && /* @__PURE__ */ React.createElement("span", { style: { color: pdValenceColor(symbol.valence_avg) } }, valenceLabel), /* @__PURE__ */ React.createElement("span", null, "derni\xE8re \xB7 ", pdFormatDate(symbol.last_seen_at))))), (symbol.evolution_summary || symbol.associated_figures && symbol.associated_figures.length > 0) && /* @__PURE__ */ React.createElement("div", { style: {
    marginTop: 12,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13.5,
    color: "color-mix(in oklch, var(--bone) 75%, transparent)",
    lineHeight: 1.55
  } }, symbol.evolution_summary && /* @__PURE__ */ React.createElement("div", null, symbol.evolution_summary), symbol.associated_figures && symbol.associated_figures.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, opacity: 0.8 } }, "accompagne \xB7 ", symbol.associated_figures.slice(0, 5).join(" \xB7 "))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onToggleExpand,
      style: {
        padding: "7px 14px",
        background: hasAngles ? "color-mix(in oklch, var(--silk-gold) 14%, transparent)" : "transparent",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 36%, transparent)",
        color: "var(--bone)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        borderRadius: 2
      }
    },
    expanded ? "\u2014 masquer les 3 angles" : hasAngles ? "\u2726 afficher 3 angles" : "\u2726 g\xE9n\xE9rer 3 angles"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onSeeKairos,
      style: {
        padding: "7px 14px",
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--ash-light) 30%, transparent)",
        color: "var(--ash-light)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        borderRadius: 2
      }
    },
    "\u2609 voir mes kairos"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onArchive,
      "aria-label": "archiver ce symbole",
      style: {
        padding: "7px 12px",
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--ash-light) 18%, transparent)",
        color: "color-mix(in oklch, var(--ash-light) 60%, transparent)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        borderRadius: 2,
        marginLeft: "auto"
      }
    },
    "\xB7archiver\xB7"
  )), expanded && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, marginTop: 16 } }, anglesLoading && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    opacity: 0.7,
    padding: "12px 0"
  } }, "Anima tisse les trois angles\u2026"), anglesError && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--mono)",
    fontSize: 11,
    color: "var(--ember)",
    padding: "8px 12px",
    border: "1px solid var(--ember)"
  } }, anglesError), !anglesLoading && hasAngles && M && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(M, { role: "assistant", matter: "paper", voiceAttribution: "paper \xB7 lecture intime", fadeIn: true }, symbol.paper_angle), /* @__PURE__ */ React.createElement(M, { role: "assistant", matter: "stone", voiceAttribution: "stone \xB7 lecture structurelle", fadeIn: true }, symbol.stone_angle), /* @__PURE__ */ React.createElement(M, { role: "assistant", matter: "silk", voiceAttribution: "silk \xB7 invitation", fadeIn: true }, symbol.silk_angle))));
};
const PersonalDictionaryScreen = ({ go }) => {
  const [symbols, setSymbols] = pdS([]);
  const [loading, setLoading] = pdS(true);
  const [error, setError] = pdS(null);
  const [refreshing, setRefreshing] = pdS(false);
  const [filterKind, setFilterKind] = pdS("all");
  const [expandedId, setExpandedId] = pdS(null);
  const [anglesState, setAnglesState] = pdS({});
  const fetchSymbols = pdCB(async () => {
    var _a, _b;
    setLoading(true);
    setError(null);
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      const res = await fetch("/api/personal-dictionary?limit=100", {
        headers: token ? { Authorization: "Bearer " + token } : {}
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      setSymbols(json.symbols || []);
    } catch (e) {
      setError("Le dictionnaire est temporairement indisponible.");
      console.warn("[PersonalDictionaryScreen] fetch failed:", e == null ? void 0 : e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  pdE(() => {
    fetchSymbols();
  }, [fetchSymbols]);
  const handleRefresh = pdCB(async () => {
    var _a, _b;
    setRefreshing(true);
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      await fetch("/api/personal-dictionary/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: "Bearer " + token } : {}
        },
        body: JSON.stringify({})
      });
      await fetchSymbols();
    } catch (e) {
      console.warn("[PersonalDictionaryScreen] refresh failed:", e == null ? void 0 : e.message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchSymbols]);
  const handleToggleExpand = pdCB(async (sym) => {
    var _a, _b;
    if (expandedId === sym.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(sym.id);
    const hasAngles = sym.paper_angle && sym.stone_angle && sym.silk_angle;
    const cacheValid = sym.paragraph_cache_valid_until && new Date(sym.paragraph_cache_valid_until) > /* @__PURE__ */ new Date();
    if (hasAngles && cacheValid) return;
    setAnglesState((prev) => ({ ...prev, [sym.id]: { loading: true } }));
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      const res = await fetch("/api/personal-dictionary/" + encodeURIComponent(sym.id) + "/generate-angles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: "Bearer " + token } : {}
        },
        body: JSON.stringify({})
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const json = await res.json();
      setSymbols((prev) => prev.map((s) => s.id === sym.id ? {
        ...s,
        paper_angle: json.paper,
        stone_angle: json.stone,
        silk_angle: json.silk,
        evolution_summary: json.evolution || s.evolution_summary,
        paragraph_cache_valid_until: json.valid_until || s.paragraph_cache_valid_until
      } : s));
      setAnglesState((prev) => ({ ...prev, [sym.id]: {} }));
    } catch (e) {
      setAnglesState((prev) => ({ ...prev, [sym.id]: { error: "Anima n'a pas pu tisser les angles maintenant. R\xE9essaie plus tard." } }));
      console.warn("[PersonalDictionaryScreen] generate-angles failed:", e == null ? void 0 : e.message);
    }
  }, [expandedId]);
  const handleSeeKairos = pdCB((sym) => {
    if (typeof go === "function") {
      go("journal", { filter_tag: sym.symbol_text, filter_kind: sym.symbol_kind });
    }
  }, [go]);
  const handleArchive = pdCB(async (sym) => {
    var _a, _b;
    if (typeof window !== "undefined" && !window.confirm(`Archiver \xAB ${sym.symbol_text} \xBB ? Tes kairos sont pr\xE9serv\xE9s. Le symbole peut revenir tout seul s'il continue d'appara\xEEtre.`)) {
      return;
    }
    try {
      const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
      await fetch("/api/personal-dictionary/" + encodeURIComponent(sym.id), {
        method: "DELETE",
        headers: token ? { Authorization: "Bearer " + token } : {}
      });
      setSymbols((prev) => prev.filter((s) => s.id !== sym.id));
    } catch (e) {
      console.warn("[PersonalDictionaryScreen] archive failed:", e == null ? void 0 : e.message);
    }
  }, []);
  const filtered = filterKind === "all" ? symbols : symbols.filter((s) => s.symbol_kind === filterKind);
  const allKinds = ["all", "motif", "figure", "lieu", "sensation", "synchronicite"];
  const counts = symbols.reduce((acc, s) => {
    acc[s.symbol_kind] = (acc[s.symbol_kind] || 0) + 1;
    return acc;
  }, {});
  return /* @__PURE__ */ React.createElement("div", { style: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "32px 20px 80px",
    minHeight: "100vh"
  } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 28 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => go && go("explorer"),
      style: {
        background: "transparent",
        border: "none",
        color: "var(--ash-light)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: "pointer",
        padding: 0,
        marginBottom: 18,
        opacity: 0.78
      }
    },
    "\u2190 retour"
  ), /* @__PURE__ */ React.createElement("h1", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 32,
    color: "var(--bone)",
    margin: 0,
    lineHeight: 1.2
  } }, "Mon dictionnaire"), /* @__PURE__ */ React.createElement("p", { style: {
    marginTop: 10,
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "color-mix(in oklch, var(--bone) 70%, transparent)",
    fontSize: 15,
    lineHeight: 1.55
  } }, "Les symboles qui reviennent dans tes kairos. Pas un compendium universel \u2014 ton lexique propre, qui se tisse \xE0 mesure que tu d\xE9poses.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 22 } }, allKinds.map((k) => {
    const active = filterKind === k;
    const count = k === "all" ? symbols.length : counts[k] || 0;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: k,
        onClick: () => setFilterKind(k),
        style: {
          padding: "5px 12px",
          background: active ? "color-mix(in oklch, var(--silk-gold) 16%, transparent)" : "transparent",
          border: "1px solid color-mix(in oklch, var(--silk-gold) " + (active ? "40" : "14") + "%, var(--ash-deep))",
          color: active ? "var(--bone)" : "var(--ash-light)",
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: 2
        }
      },
      k === "all" ? "tous" : pdKindLabel(k),
      " \xB7 ",
      count
    );
  }), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleRefresh,
      disabled: refreshing,
      style: {
        padding: "5px 12px",
        marginLeft: "auto",
        background: "transparent",
        border: "1px solid color-mix(in oklch, var(--ash-light) 22%, transparent)",
        color: "var(--ash-light)",
        fontFamily: "var(--mono)",
        fontSize: 10.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        cursor: refreshing ? "wait" : "pointer",
        borderRadius: 2,
        opacity: refreshing ? 0.5 : 1
      }
    },
    refreshing ? "\xB7 tissage en cours \xB7" : "\u21BB rafra\xEEchir"
  )), loading && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ash-light)",
    opacity: 0.7,
    textAlign: "center",
    padding: "40px 20px"
  } }, "Le dictionnaire se rassemble\u2026"), error && !loading && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "var(--ember)",
    textAlign: "center",
    padding: "32px 20px"
  } }, error), !loading && !error && filtered.length === 0 && /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    color: "color-mix(in oklch, var(--bone) 65%, transparent)",
    textAlign: "center",
    padding: "40px 20px",
    lineHeight: 1.6
  } }, symbols.length === 0 ? "Encore vide. Ton dictionnaire commence apr\xE8s quelques d\xE9p\xF4ts \u2014 un symbole appara\xEEt ici quand il revient au moins 3 fois sur 90 jours." : "Aucun symbole pour ce filtre."), !loading && filtered.map((sym) => {
    var _a, _b;
    return /* @__PURE__ */ React.createElement(
      SymbolCard,
      {
        key: sym.id,
        symbol: sym,
        expanded: expandedId === sym.id,
        onToggleExpand: () => handleToggleExpand(sym),
        onSeeKairos: () => handleSeeKairos(sym),
        onArchive: () => handleArchive(sym),
        anglesLoading: (_a = anglesState[sym.id]) == null ? void 0 : _a.loading,
        anglesError: (_b = anglesState[sym.id]) == null ? void 0 : _b.error
      }
    );
  }));
};
window.PersonalDictionaryScreen = PersonalDictionaryScreen;
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1wZXJzb25hbC1kaWN0aW9uYXJ5LmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBzY3JlZW5zLXBlcnNvbmFsLWRpY3Rpb25hcnkuanN4IFx1MjAxNCBNb24gZGljdGlvbm5haXJlICgyMDI2LTA0LTI5KVxuICpcbiAqIFNwZWMgOiA0X0xPRy5tZCAyMDI2LTA0LTI5IFx1MjAxNCBtb2F0IFx1MDBFOXBpc3RcdTAwRTltaXF1ZS5cbiAqXG4gKiBDb21wb3NhbnRzIGV4cG9zXHUwMEU5cyA6XG4gKiAgIHdpbmRvdy5QZXJzb25hbERpY3Rpb25hcnlTY3JlZW4gXHUyMDE0IHBhZ2UgbGlzdGUgc3ltYm9sZXMgcGVyc29ubmVsc1xuICpcbiAqIFJvdXRlcyBhcHAuanN4IDpcbiAqICAgY2FzZSBcInBlcnNvbmFsLWRpY3Rpb25hcnlcIiBcdTIxOTIgPHdpbmRvdy5QZXJzb25hbERpY3Rpb25hcnlTY3JlZW4gZ289e2dvfSAvPlxuICpcbiAqIFVYIDpcbiAqICAgLSBMaXN0ZSB2ZXJ0aWNhbGUgb3Jkb25uXHUwMEU5ZSBsYXN0X3NlZW5fYXQgREVTQ1xuICogICAtIENhcmQgcGFyIHN5bWJvbGUgOiB0aXRyZSArIGNvdW50ICsgdmFsZW5jZSBhdmcgKyBkZXJuaVx1MDBFOHJlIGRhdGUgKyBib3V0b24gMyBhbmdsZXNcbiAqICAgLSAzIGFuZ2xlcyBwYXBlci9zdG9uZS9zaWxrIGVuIE1hdHRlckJ1YmJsZSAod2luZG93Lk1hdHRlckJ1YmJsZSByXHUwMEU5dXRpbGlzXHUwMEU5KVxuICogICAtIEJvdXRvbiBcInZvaXIgbWVzIGthaXJvcyBhdmVjIGNlIHN5bWJvbGVcIiBcdTIxOTIgZ28oXCJqb3VybmFsXCIsIHsgdGFnOiBzeW1ib2xfdGV4dCB9KVxuICogICAtIEJvdXRvbiBcImFyY2hpdmVyXCIgXHUyMTkyIERFTEVURSBzb2Z0XG4gKiAgIC0gQm91dG9uIFwicmFmcmFcdTAwRUVjaGlyXCIgXHUyMTkyIFBPU1QgL3JlZnJlc2ggdXNlci1zY29wZWRcbiAqL1xuXG5jb25zdCB7IHVzZVN0YXRlOiBwZFMsIHVzZUVmZmVjdDogcGRFLCB1c2VDYWxsYmFjazogcGRDQiB9ID0gUmVhY3Q7XG5cbi8vIFx1MjUwMFx1MjUwMCBoZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuZnVuY3Rpb24gcGRWYWxlbmNlTGFiZWwodikge1xuICBpZiAodiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQpIHJldHVybiBudWxsO1xuICBpZiAodiA+IDAuNCkgcmV0dXJuICdwb3J0ZXVzZSc7XG4gIGlmICh2ID4gMC4xNSkgcmV0dXJuICdwbHV0XHUwMEY0dCBkb3VjZSc7XG4gIGlmICh2IDwgLTAuNCkgcmV0dXJuICdzb21icmUnO1xuICBpZiAodiA8IC0wLjE1KSByZXR1cm4gJ3BsdXRcdTAwRjR0IHBlc2FudGUnO1xuICByZXR1cm4gJ21cdTAwRUFsXHUwMEU5ZSc7XG59XG5cbmZ1bmN0aW9uIHBkVmFsZW5jZUNvbG9yKHYpIHtcbiAgaWYgKHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJ3ZhcigtLWFzaC1saWdodCknO1xuICBpZiAodiA+IDAuMTUpIHJldHVybiAndmFyKC0tc2lsay1nb2xkKSc7XG4gIGlmICh2IDwgLTAuMTUpIHJldHVybiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDgwJSwgdmFyKC0tYXNoLWRlZXApKSc7XG4gIHJldHVybiAndmFyKC0tYXNoLWxpZ2h0KSc7XG59XG5cbmZ1bmN0aW9uIHBkRm9ybWF0RGF0ZShpc28pIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gbmV3IERhdGUoaXNvKS50b0xvY2FsZURhdGVTdHJpbmcoJ2ZyLUZSJywgeyBkYXk6ICcyLWRpZ2l0JywgbW9udGg6ICdzaG9ydCcsIHllYXI6ICdudW1lcmljJyB9KTtcbiAgfSBjYXRjaCB7IHJldHVybiAnJzsgfVxufVxuXG5mdW5jdGlvbiBwZEtpbmRMYWJlbChrKSB7XG4gIHJldHVybiAoe1xuICAgIG1vdGlmOiAnbW90aWYnLFxuICAgIGZpZ3VyZTogJ2ZpZ3VyZScsXG4gICAgbGlldTogJ2xpZXUnLFxuICAgIHNlbnNhdGlvbjogJ3NlbnNhdGlvbicsXG4gICAgc3luY2hyb25pY2l0ZTogJ3N5bmNocm9uaWNpdFx1MDBFOScsXG4gIH0pW2tdIHx8IGs7XG59XG5cbi8vIFx1MjUwMFx1MjUwMCBDYXJkIHN5bWJvbGUgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG5jb25zdCBTeW1ib2xDYXJkID0gKHsgc3ltYm9sLCBleHBhbmRlZCwgb25Ub2dnbGVFeHBhbmQsIG9uU2VlS2Fpcm9zLCBvbkFyY2hpdmUsIG9uR2VuZXJhdGVBbmdsZXMsIGFuZ2xlc0xvYWRpbmcsIGFuZ2xlc0Vycm9yIH0pID0+IHtcbiAgY29uc3QgTSA9IHdpbmRvdy5NYXR0ZXJCdWJibGU7XG4gIGNvbnN0IHZhbGVuY2VMYWJlbCA9IHBkVmFsZW5jZUxhYmVsKHN5bWJvbC52YWxlbmNlX2F2Zyk7XG4gIGNvbnN0IGhhc0FuZ2xlcyA9IHN5bWJvbC5wYXBlcl9hbmdsZSAmJiBzeW1ib2wuc3RvbmVfYW5nbGUgJiYgc3ltYm9sLnNpbGtfYW5nbGU7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBwYWRkaW5nOiAnMThweCAyMHB4JyxcbiAgICAgIGJhY2tncm91bmQ6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLW5pZ2h0LXdhcm0pIDYwJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB2YXIoLS1hc2gtZGVlcCkpJyxcbiAgICAgIGJvcmRlclJhZGl1czogMixcbiAgICAgIG1hcmdpbkJvdHRvbTogMTQsXG4gICAgICBhbmltYXRpb246ICdkcmVhbS1za2VsZXRvbi1mYWRlLWluIDMyMG1zIGN1YmljLWJlemllcigwLjQ1LDAsMC41NSwxKSBib3RoJyxcbiAgICB9fT5cbiAgICAgIHsvKiBIZWFkZXIgXHUyMDE0IHRpdHJlICsgbWV0YSAqL31cbiAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsIGdhcDogMTQgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgbWluV2lkdGg6IDAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsXG4gICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgZm9udFNpemU6IDIyLFxuICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1ib25lKScsXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjIsXG4gICAgICAgICAgICBtYXJnaW5Cb3R0b206IDYsXG4gICAgICAgICAgICB3b3JkQnJlYWs6ICdicmVhay13b3JkJyxcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtzeW1ib2wuc3ltYm9sX3RleHR9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLCBnYXA6IDE0LCBmbGV4V3JhcDogJ3dyYXAnLFxuICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLW1vbm8pJywgZm9udFNpemU6IDEwLjUsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWFzaC1saWdodCknLCBvcGFjaXR5OiAwLjc4LFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4+e3BkS2luZExhYmVsKHN5bWJvbC5zeW1ib2xfa2luZCl9PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4+e3N5bWJvbC5jb3VudF90b3RhbH1cdTAwRDcgPC9zcGFuPlxuICAgICAgICAgICAge3ZhbGVuY2VMYWJlbCAmJiAoXG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiBwZFZhbGVuY2VDb2xvcihzeW1ib2wudmFsZW5jZV9hdmcpIH19PlxuICAgICAgICAgICAgICAgIHt2YWxlbmNlTGFiZWx9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8c3Bhbj5kZXJuaVx1MDBFOHJlIFx1MDBCNyB7cGRGb3JtYXREYXRlKHN5bWJvbC5sYXN0X3NlZW5fYXQpfTwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEV2b2x1dGlvbiArIGZpZ3VyZXMgYXNzb2NpXHUwMEU5ZXMgKi99XG4gICAgICB7KHN5bWJvbC5ldm9sdXRpb25fc3VtbWFyeSB8fCAoc3ltYm9sLmFzc29jaWF0ZWRfZmlndXJlcyAmJiBzeW1ib2wuYXNzb2NpYXRlZF9maWd1cmVzLmxlbmd0aCA+IDApKSAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBtYXJnaW5Ub3A6IDEyLFxuICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLFxuICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgZm9udFNpemU6IDEzLjUsXG4gICAgICAgICAgY29sb3I6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWJvbmUpIDc1JSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjU1LFxuICAgICAgICB9fT5cbiAgICAgICAgICB7c3ltYm9sLmV2b2x1dGlvbl9zdW1tYXJ5ICYmIDxkaXY+e3N5bWJvbC5ldm9sdXRpb25fc3VtbWFyeX08L2Rpdj59XG4gICAgICAgICAge3N5bWJvbC5hc3NvY2lhdGVkX2ZpZ3VyZXMgJiYgc3ltYm9sLmFzc29jaWF0ZWRfZmlndXJlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luVG9wOiA2LCBvcGFjaXR5OiAwLjggfX0+XG4gICAgICAgICAgICAgIGFjY29tcGFnbmUgXHUwMEI3IHtzeW1ib2wuYXNzb2NpYXRlZF9maWd1cmVzLnNsaWNlKDAsIDUpLmpvaW4oJyBcdTAwQjcgJyl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHsvKiBBY3Rpb25zICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogMTAsIG1hcmdpblRvcDogMTYsIGZsZXhXcmFwOiAnd3JhcCcgfX0+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvblRvZ2dsZUV4cGFuZH1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogJzdweCAxNHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IGhhc0FuZ2xlc1xuICAgICAgICAgICAgICA/ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTQlLCB0cmFuc3BhcmVudCknXG4gICAgICAgICAgICAgIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCBjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMzYlLCB0cmFuc3BhcmVudCknLFxuICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1ib25lKScsXG4gICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLFxuICAgICAgICAgICAgZm9udFNpemU6IDExLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDhlbScsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7ZXhwYW5kZWQgPyAnXHUyMDE0IG1hc3F1ZXIgbGVzIDMgYW5nbGVzJyA6IChoYXNBbmdsZXMgPyAnXHUyNzI2IGFmZmljaGVyIDMgYW5nbGVzJyA6ICdcdTI3MjYgZ1x1MDBFOW5cdTAwRTlyZXIgMyBhbmdsZXMnKX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXtvblNlZUthaXJvc31cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogJzdweCAxNHB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDMwJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tYXNoLWxpZ2h0KScsXG4gICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLFxuICAgICAgICAgICAgZm9udFNpemU6IDExLFxuICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMDhlbScsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBcdTI2MDkgdm9pciBtZXMga2Fpcm9zXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17b25BcmNoaXZlfVxuICAgICAgICAgIGFyaWEtbGFiZWw9XCJhcmNoaXZlciBjZSBzeW1ib2xlXCJcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcGFkZGluZzogJzdweCAxMnB4JyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDE4JSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICAgIGNvbG9yOiAnY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDYwJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1tb25vKScsXG4gICAgICAgICAgICBmb250U2l6ZTogMTEsXG4gICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJyxcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDIsXG4gICAgICAgICAgICBtYXJnaW5MZWZ0OiAnYXV0bycsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIFx1MDBCN2FyY2hpdmVyXHUwMEI3XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiAzIGFuZ2xlcyBkXHUwMEU5cGxpXHUwMEU5cyAqL31cbiAgICAgIHtleHBhbmRlZCAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJywgZ2FwOiAxMCwgbWFyZ2luVG9wOiAxNiB9fT5cbiAgICAgICAgICB7YW5nbGVzTG9hZGluZyAmJiAoXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICBjb2xvcjogJ3ZhcigtLWFzaC1saWdodCknLCBvcGFjaXR5OiAwLjcsIHBhZGRpbmc6ICcxMnB4IDAnLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIEFuaW1hIHRpc3NlIGxlcyB0cm9pcyBhbmdsZXNcdTIwMjZcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAge2FuZ2xlc0Vycm9yICYmIChcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLW1vbm8pJywgZm9udFNpemU6IDExLCBjb2xvcjogJ3ZhcigtLWVtYmVyKScsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc4cHggMTJweCcsIGJvcmRlcjogJzFweCBzb2xpZCB2YXIoLS1lbWJlciknLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHthbmdsZXNFcnJvcn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgICAgeyFhbmdsZXNMb2FkaW5nICYmIGhhc0FuZ2xlcyAmJiBNICYmIChcbiAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgIDxNIHJvbGU9XCJhc3Npc3RhbnRcIiBtYXR0ZXI9XCJwYXBlclwiIHZvaWNlQXR0cmlidXRpb249XCJwYXBlciBcdTAwQjcgbGVjdHVyZSBpbnRpbWVcIiBmYWRlSW49e3RydWV9PlxuICAgICAgICAgICAgICAgIHtzeW1ib2wucGFwZXJfYW5nbGV9XG4gICAgICAgICAgICAgIDwvTT5cbiAgICAgICAgICAgICAgPE0gcm9sZT1cImFzc2lzdGFudFwiIG1hdHRlcj1cInN0b25lXCIgdm9pY2VBdHRyaWJ1dGlvbj1cInN0b25lIFx1MDBCNyBsZWN0dXJlIHN0cnVjdHVyZWxsZVwiIGZhZGVJbj17dHJ1ZX0+XG4gICAgICAgICAgICAgICAge3N5bWJvbC5zdG9uZV9hbmdsZX1cbiAgICAgICAgICAgICAgPC9NPlxuICAgICAgICAgICAgICA8TSByb2xlPVwiYXNzaXN0YW50XCIgbWF0dGVyPVwic2lsa1wiIHZvaWNlQXR0cmlidXRpb249XCJzaWxrIFx1MDBCNyBpbnZpdGF0aW9uXCIgZmFkZUluPXt0cnVlfT5cbiAgICAgICAgICAgICAgICB7c3ltYm9sLnNpbGtfYW5nbGV9XG4gICAgICAgICAgICAgIDwvTT5cbiAgICAgICAgICAgIDwvPlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBTY3JlZW4gcHJpbmNpcGFsIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuY29uc3QgUGVyc29uYWxEaWN0aW9uYXJ5U2NyZWVuID0gKHsgZ28gfSkgPT4ge1xuICBjb25zdCBbc3ltYm9scywgc2V0U3ltYm9sc10gPSBwZFMoW10pO1xuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSBwZFModHJ1ZSk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gcGRTKG51bGwpO1xuICBjb25zdCBbcmVmcmVzaGluZywgc2V0UmVmcmVzaGluZ10gPSBwZFMoZmFsc2UpO1xuICBjb25zdCBbZmlsdGVyS2luZCwgc2V0RmlsdGVyS2luZF0gPSBwZFMoJ2FsbCcpO1xuICBjb25zdCBbZXhwYW5kZWRJZCwgc2V0RXhwYW5kZWRJZF0gPSBwZFMobnVsbCk7XG4gIGNvbnN0IFthbmdsZXNTdGF0ZSwgc2V0QW5nbGVzU3RhdGVdID0gcGRTKHt9KTsgLy8geyBbc3ltYm9sSWRdOiB7IGxvYWRpbmc/LCBlcnJvcj8gfSB9XG5cbiAgLy8gRmV0Y2ggc3ltYm9sc1xuICBjb25zdCBmZXRjaFN5bWJvbHMgPSBwZENCKGFzeW5jICgpID0+IHtcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgIHNldEVycm9yKG51bGwpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGg/LmdldEFjY2Vzc1Rva2VuPy4oKTtcbiAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKCcvYXBpL3BlcnNvbmFsLWRpY3Rpb25hcnk/bGltaXQ9MTAwJywge1xuICAgICAgICBoZWFkZXJzOiB0b2tlbiA/IHsgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4gfSA6IHt9LFxuICAgICAgfSk7XG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKCdIVFRQICcgKyByZXMuc3RhdHVzKTtcbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgc2V0U3ltYm9scyhqc29uLnN5bWJvbHMgfHwgW10pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNldEVycm9yKCdMZSBkaWN0aW9ubmFpcmUgZXN0IHRlbXBvcmFpcmVtZW50IGluZGlzcG9uaWJsZS4nKTtcbiAgICAgIGNvbnNvbGUud2FybignW1BlcnNvbmFsRGljdGlvbmFyeVNjcmVlbl0gZmV0Y2ggZmFpbGVkOicsIGU/Lm1lc3NhZ2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICBwZEUoKCkgPT4geyBmZXRjaFN5bWJvbHMoKTsgfSwgW2ZldGNoU3ltYm9sc10pO1xuXG4gIC8vIFJlZnJlc2ggPSByZS1hZ2dyZWdhdGVcbiAgY29uc3QgaGFuZGxlUmVmcmVzaCA9IHBkQ0IoYXN5bmMgKCkgPT4ge1xuICAgIHNldFJlZnJlc2hpbmcodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgd2luZG93LkRyZWFtQXV0aD8uZ2V0QWNjZXNzVG9rZW4/LigpO1xuICAgICAgYXdhaXQgZmV0Y2goJy9hcGkvcGVyc29uYWwtZGljdGlvbmFyeS9yZWZyZXNoJywge1xuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgLi4uKHRva2VuID8geyBBdXRob3JpemF0aW9uOiAnQmVhcmVyICcgKyB0b2tlbiB9IDoge30pLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICB9KTtcbiAgICAgIGF3YWl0IGZldGNoU3ltYm9scygpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1BlcnNvbmFsRGljdGlvbmFyeVNjcmVlbl0gcmVmcmVzaCBmYWlsZWQ6JywgZT8ubWVzc2FnZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHNldFJlZnJlc2hpbmcoZmFsc2UpO1xuICAgIH1cbiAgfSwgW2ZldGNoU3ltYm9sc10pO1xuXG4gIC8vIFRvZ2dsZSBleHBhbmQgXHUyMTkyIGZldGNoIGFuZ2xlcyBzaSBwYXMgZFx1MDBFOWpcdTAwRTBcbiAgY29uc3QgaGFuZGxlVG9nZ2xlRXhwYW5kID0gcGRDQihhc3luYyAoc3ltKSA9PiB7XG4gICAgaWYgKGV4cGFuZGVkSWQgPT09IHN5bS5pZCkge1xuICAgICAgc2V0RXhwYW5kZWRJZChudWxsKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0RXhwYW5kZWRJZChzeW0uaWQpO1xuICAgIGNvbnN0IGhhc0FuZ2xlcyA9IHN5bS5wYXBlcl9hbmdsZSAmJiBzeW0uc3RvbmVfYW5nbGUgJiYgc3ltLnNpbGtfYW5nbGU7XG4gICAgY29uc3QgY2FjaGVWYWxpZCA9IHN5bS5wYXJhZ3JhcGhfY2FjaGVfdmFsaWRfdW50aWwgJiYgbmV3IERhdGUoc3ltLnBhcmFncmFwaF9jYWNoZV92YWxpZF91bnRpbCkgPiBuZXcgRGF0ZSgpO1xuICAgIGlmIChoYXNBbmdsZXMgJiYgY2FjaGVWYWxpZCkgcmV0dXJuOyAvLyBkXHUwMEU5alx1MDBFMCBPS1xuXG4gICAgc2V0QW5nbGVzU3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIFtzeW0uaWRdOiB7IGxvYWRpbmc6IHRydWUgfSB9KSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgd2luZG93LkRyZWFtQXV0aD8uZ2V0QWNjZXNzVG9rZW4/LigpO1xuICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goJy9hcGkvcGVyc29uYWwtZGljdGlvbmFyeS8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHN5bS5pZCkgKyAnL2dlbmVyYXRlLWFuZ2xlcycsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAgIC4uLih0b2tlbiA/IHsgQXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgdG9rZW4gfSA6IHt9KSxcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgfSk7XG4gICAgICBpZiAoIXJlcy5vaykgdGhyb3cgbmV3IEVycm9yKCdIVFRQICcgKyByZXMuc3RhdHVzKTtcbiAgICAgIGNvbnN0IGpzb24gPSBhd2FpdCByZXMuanNvbigpO1xuICAgICAgLy8gVXBkYXRlIGxvY2FsIHN5bWJvbCBlbnRyeVxuICAgICAgc2V0U3ltYm9scygocHJldikgPT4gcHJldi5tYXAoKHMpID0+IHMuaWQgPT09IHN5bS5pZCA/IHtcbiAgICAgICAgLi4ucyxcbiAgICAgICAgcGFwZXJfYW5nbGU6IGpzb24ucGFwZXIsXG4gICAgICAgIHN0b25lX2FuZ2xlOiBqc29uLnN0b25lLFxuICAgICAgICBzaWxrX2FuZ2xlOiBqc29uLnNpbGssXG4gICAgICAgIGV2b2x1dGlvbl9zdW1tYXJ5OiBqc29uLmV2b2x1dGlvbiB8fCBzLmV2b2x1dGlvbl9zdW1tYXJ5LFxuICAgICAgICBwYXJhZ3JhcGhfY2FjaGVfdmFsaWRfdW50aWw6IGpzb24udmFsaWRfdW50aWwgfHwgcy5wYXJhZ3JhcGhfY2FjaGVfdmFsaWRfdW50aWwsXG4gICAgICB9IDogcykpO1xuICAgICAgc2V0QW5nbGVzU3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIFtzeW0uaWRdOiB7fSB9KSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0QW5nbGVzU3RhdGUoKHByZXYpID0+ICh7IC4uLnByZXYsIFtzeW0uaWRdOiB7IGVycm9yOiAnQW5pbWEgblxcJ2EgcGFzIHB1IHRpc3NlciBsZXMgYW5nbGVzIG1haW50ZW5hbnQuIFJcdTAwRTllc3NhaWUgcGx1cyB0YXJkLicgfSB9KSk7XG4gICAgICBjb25zb2xlLndhcm4oJ1tQZXJzb25hbERpY3Rpb25hcnlTY3JlZW5dIGdlbmVyYXRlLWFuZ2xlcyBmYWlsZWQ6JywgZT8ubWVzc2FnZSk7XG4gICAgfVxuICB9LCBbZXhwYW5kZWRJZF0pO1xuXG4gIGNvbnN0IGhhbmRsZVNlZUthaXJvcyA9IHBkQ0IoKHN5bSkgPT4ge1xuICAgIGlmICh0eXBlb2YgZ28gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGdvKCdqb3VybmFsJywgeyBmaWx0ZXJfdGFnOiBzeW0uc3ltYm9sX3RleHQsIGZpbHRlcl9raW5kOiBzeW0uc3ltYm9sX2tpbmQgfSk7XG4gICAgfVxuICB9LCBbZ29dKTtcblxuICBjb25zdCBoYW5kbGVBcmNoaXZlID0gcGRDQihhc3luYyAoc3ltKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICF3aW5kb3cuY29uZmlybShgQXJjaGl2ZXIgXHUwMEFCICR7c3ltLnN5bWJvbF90ZXh0fSBcdTAwQkIgPyBUZXMga2Fpcm9zIHNvbnQgcHJcdTAwRTlzZXJ2XHUwMEU5cy4gTGUgc3ltYm9sZSBwZXV0IHJldmVuaXIgdG91dCBzZXVsIHMnaWwgY29udGludWUgZCdhcHBhcmFcdTAwRUV0cmUuYCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgd2luZG93LkRyZWFtQXV0aD8uZ2V0QWNjZXNzVG9rZW4/LigpO1xuICAgICAgYXdhaXQgZmV0Y2goJy9hcGkvcGVyc29uYWwtZGljdGlvbmFyeS8nICsgZW5jb2RlVVJJQ29tcG9uZW50KHN5bS5pZCksIHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgICAgaGVhZGVyczogdG9rZW4gPyB7IEF1dGhvcml6YXRpb246ICdCZWFyZXIgJyArIHRva2VuIH0gOiB7fSxcbiAgICAgIH0pO1xuICAgICAgc2V0U3ltYm9scygocHJldikgPT4gcHJldi5maWx0ZXIoKHMpID0+IHMuaWQgIT09IHN5bS5pZCkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1BlcnNvbmFsRGljdGlvbmFyeVNjcmVlbl0gYXJjaGl2ZSBmYWlsZWQ6JywgZT8ubWVzc2FnZSk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgLy8gRmlsdGVyXG4gIGNvbnN0IGZpbHRlcmVkID0gZmlsdGVyS2luZCA9PT0gJ2FsbCcgPyBzeW1ib2xzIDogc3ltYm9scy5maWx0ZXIoKHMpID0+IHMuc3ltYm9sX2tpbmQgPT09IGZpbHRlcktpbmQpO1xuICBjb25zdCBhbGxLaW5kcyA9IFsnYWxsJywgJ21vdGlmJywgJ2ZpZ3VyZScsICdsaWV1JywgJ3NlbnNhdGlvbicsICdzeW5jaHJvbmljaXRlJ107XG4gIGNvbnN0IGNvdW50cyA9IHN5bWJvbHMucmVkdWNlKChhY2MsIHMpID0+IHtcbiAgICBhY2Nbcy5zeW1ib2xfa2luZF0gPSAoYWNjW3Muc3ltYm9sX2tpbmRdIHx8IDApICsgMTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICBtYXhXaWR0aDogNzIwLFxuICAgICAgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICAgIHBhZGRpbmc6ICczMnB4IDIwcHggODBweCcsXG4gICAgICBtaW5IZWlnaHQ6ICcxMDB2aCcsXG4gICAgfX0+XG4gICAgICB7LyogSGVhZGVyICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW5Cb3R0b206IDI4IH19PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gZ28gJiYgZ28oJ2V4cGxvcmVyJyl9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJywgZm9udEZhbWlseTogJ3ZhcigtLW1vbm8pJyxcbiAgICAgICAgICAgIGZvbnRTaXplOiAxMSwgbGV0dGVyU3BhY2luZzogJzAuMDhlbScsIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6IDAsIG1hcmdpbkJvdHRvbTogMTgsIG9wYWNpdHk6IDAuNzgsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIFx1MjE5MCByZXRvdXJcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxoMSBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1zZXJpZiknLCBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgIGZvbnRTaXplOiAzMiwgY29sb3I6ICd2YXIoLS1ib25lKScsIG1hcmdpbjogMCwgbGluZUhlaWdodDogMS4yLFxuICAgICAgICB9fT5cbiAgICAgICAgICBNb24gZGljdGlvbm5haXJlXG4gICAgICAgIDwvaDE+XG4gICAgICAgIDxwIHN0eWxlPXt7XG4gICAgICAgICAgbWFyZ2luVG9wOiAxMCwgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgY29sb3I6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWJvbmUpIDcwJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICBmb250U2l6ZTogMTUsIGxpbmVIZWlnaHQ6IDEuNTUsXG4gICAgICAgIH19PlxuICAgICAgICAgIExlcyBzeW1ib2xlcyBxdWkgcmV2aWVubmVudCBkYW5zIHRlcyBrYWlyb3MuIFBhcyB1biBjb21wZW5kaXVtIHVuaXZlcnNlbCBcdTIwMTQgdG9uIGxleGlxdWUgcHJvcHJlLCBxdWkgc2UgdGlzc2UgXHUwMEUwIG1lc3VyZSBxdWUgdHUgZFx1MDBFOXBvc2VzLlxuICAgICAgICA8L3A+XG4gICAgICA8L2Rpdj5cblxuICAgICAgey8qIEZpbHRlcnMgKyByZWZyZXNoICovfVxuICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGdhcDogOCwgZmxleFdyYXA6ICd3cmFwJywgYWxpZ25JdGVtczogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogMjIgfX0+XG4gICAgICAgIHthbGxLaW5kcy5tYXAoKGspID0+IHtcbiAgICAgICAgICBjb25zdCBhY3RpdmUgPSBmaWx0ZXJLaW5kID09PSBrO1xuICAgICAgICAgIGNvbnN0IGNvdW50ID0gayA9PT0gJ2FsbCcgPyBzeW1ib2xzLmxlbmd0aCA6IChjb3VudHNba10gfHwgMCk7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAga2V5PXtrfVxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWx0ZXJLaW5kKGspfVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc1cHggMTJweCcsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogYWN0aXZlXG4gICAgICAgICAgICAgICAgICA/ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXNpbGstZ29sZCkgMTYlLCB0cmFuc3BhcmVudCknXG4gICAgICAgICAgICAgICAgICA6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAnICsgKGFjdGl2ZSA/ICc0MCcgOiAnMTQnKSArICclLCB2YXIoLS1hc2gtZGVlcCkpJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogYWN0aXZlID8gJ3ZhcigtLWJvbmUpJyA6ICd2YXIoLS1hc2gtbGlnaHQpJyxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLCBmb250U2l6ZTogMTAuNSxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJywgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsIGJvcmRlclJhZGl1czogMixcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge2sgPT09ICdhbGwnID8gJ3RvdXMnIDogcGRLaW5kTGFiZWwoayl9IFx1MDBCNyB7Y291bnR9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVJlZnJlc2h9XG4gICAgICAgICAgZGlzYWJsZWQ9e3JlZnJlc2hpbmd9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6ICc1cHggMTJweCcsIG1hcmdpbkxlZnQ6ICdhdXRvJyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1hc2gtbGlnaHQpIDIyJSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICAgIGNvbG9yOiAndmFyKC0tYXNoLWxpZ2h0KScsXG4gICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tbW9ubyknLCBmb250U2l6ZTogMTAuNSxcbiAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjA4ZW0nLCB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgIGN1cnNvcjogcmVmcmVzaGluZyA/ICd3YWl0JyA6ICdwb2ludGVyJywgYm9yZGVyUmFkaXVzOiAyLFxuICAgICAgICAgICAgb3BhY2l0eTogcmVmcmVzaGluZyA/IDAuNSA6IDEsXG4gICAgICAgICAgfX1cbiAgICAgICAgPlxuICAgICAgICAgIHtyZWZyZXNoaW5nID8gJ1x1MDBCNyB0aXNzYWdlIGVuIGNvdXJzIFx1MDBCNycgOiAnXHUyMUJCIHJhZnJhXHUwMEVFY2hpcid9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHsvKiBCb2R5ICovfVxuICAgICAge2xvYWRpbmcgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgY29sb3I6ICd2YXIoLS1hc2gtbGlnaHQpJywgb3BhY2l0eTogMC43LCB0ZXh0QWxpZ246ICdjZW50ZXInLCBwYWRkaW5nOiAnNDBweCAyMHB4JyxcbiAgICAgICAgfX0+XG4gICAgICAgICAgTGUgZGljdGlvbm5haXJlIHNlIHJhc3NlbWJsZVx1MjAyNlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHtlcnJvciAmJiAhbG9hZGluZyAmJiAoXG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tc2VyaWYpJywgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICBjb2xvcjogJ3ZhcigtLWVtYmVyKScsIHRleHRBbGlnbjogJ2NlbnRlcicsIHBhZGRpbmc6ICczMnB4IDIwcHgnLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgeyFsb2FkaW5nICYmICFlcnJvciAmJiBmaWx0ZXJlZC5sZW5ndGggPT09IDAgJiYgKFxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLXNlcmlmKScsIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgY29sb3I6ICdjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWJvbmUpIDY1JSwgdHJhbnNwYXJlbnQpJyxcbiAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLCBwYWRkaW5nOiAnNDBweCAyMHB4JywgbGluZUhlaWdodDogMS42LFxuICAgICAgICB9fT5cbiAgICAgICAgICB7c3ltYm9scy5sZW5ndGggPT09IDBcbiAgICAgICAgICAgID8gJ0VuY29yZSB2aWRlLiBUb24gZGljdGlvbm5haXJlIGNvbW1lbmNlIGFwclx1MDBFOHMgcXVlbHF1ZXMgZFx1MDBFOXBcdTAwRjR0cyBcdTIwMTQgdW4gc3ltYm9sZSBhcHBhcmFcdTAwRUV0IGljaSBxdWFuZCBpbCByZXZpZW50IGF1IG1vaW5zIDMgZm9pcyBzdXIgOTAgam91cnMuJ1xuICAgICAgICAgICAgOiAnQXVjdW4gc3ltYm9sZSBwb3VyIGNlIGZpbHRyZS4nfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHshbG9hZGluZyAmJiBmaWx0ZXJlZC5tYXAoKHN5bSkgPT4gKFxuICAgICAgICA8U3ltYm9sQ2FyZFxuICAgICAgICAgIGtleT17c3ltLmlkfVxuICAgICAgICAgIHN5bWJvbD17c3ltfVxuICAgICAgICAgIGV4cGFuZGVkPXtleHBhbmRlZElkID09PSBzeW0uaWR9XG4gICAgICAgICAgb25Ub2dnbGVFeHBhbmQ9eygpID0+IGhhbmRsZVRvZ2dsZUV4cGFuZChzeW0pfVxuICAgICAgICAgIG9uU2VlS2Fpcm9zPXsoKSA9PiBoYW5kbGVTZWVLYWlyb3Moc3ltKX1cbiAgICAgICAgICBvbkFyY2hpdmU9eygpID0+IGhhbmRsZUFyY2hpdmUoc3ltKX1cbiAgICAgICAgICBhbmdsZXNMb2FkaW5nPXthbmdsZXNTdGF0ZVtzeW0uaWRdPy5sb2FkaW5nfVxuICAgICAgICAgIGFuZ2xlc0Vycm9yPXthbmdsZXNTdGF0ZVtzeW0uaWRdPy5lcnJvcn1cbiAgICAgICAgLz5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxud2luZG93LlBlcnNvbmFsRGljdGlvbmFyeVNjcmVlbiA9IFBlcnNvbmFsRGljdGlvbmFyeVNjcmVlbjtcbiJdLAogICJtYXBwaW5ncyI6ICJBQW9CQSxNQUFNLEVBQUUsVUFBVSxLQUFLLFdBQVcsS0FBSyxhQUFhLEtBQUssSUFBSTtBQUc3RCxTQUFTLGVBQWUsR0FBRztBQUN6QixNQUFJLE1BQU0sUUFBUSxNQUFNLE9BQVcsUUFBTztBQUMxQyxNQUFJLElBQUksSUFBSyxRQUFPO0FBQ3BC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
