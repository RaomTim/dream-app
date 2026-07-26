const { useState: dpS, useEffect: dpE, useMemo: dpM, useRef: dpR, useCallback: dpC } = React;
function _dpRel(iso) {
  var _a, _b;
  if (!iso) return "r\xE9cemment";
  try {
    return ((_b = (_a = window.DreamAPI) == null ? void 0 : _a._relativeWhen) == null ? void 0 : _b.call(_a, iso)) || "r\xE9cemment";
  } catch (e) {
    return "r\xE9cemment";
  }
}
async function _dpFetch(url, opts = {}) {
  var _a, _b;
  let headers = { ...opts.headers || {} };
  try {
    const sess = (_b = (_a = window.DreamAuth) == null ? void 0 : _a.getSession) == null ? void 0 : _b.call(_a);
    const token = sess == null ? void 0 : sess.access_token;
    if (token) headers["Authorization"] = "Bearer " + token;
  } catch (e) {
  }
  if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(url, { ...opts, headers });
}
function _dpDur(ms) {
  if (!ms || ms < 0) return "";
  const s = Math.round(ms / 1e3);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m${String(r).padStart(2, "0")}s` : `${s}s`;
}
const TabSynchronicites = ({ circleId }) => {
  const [items, setItems] = dpS([]);
  const [loading, setLoading] = dpS(true);
  const [error, setError] = dpS(null);
  const [openMotif, setOpenMotif] = dpS(null);
  const [reading, setReading] = dpS(null);
  const [readingBusy, setReadingBusy] = dpS(false);
  const load = dpC(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/synchronicities`);
      const data = await r.json();
      if (data == null ? void 0 : data.error) setError(data.error);
      else setItems(data.synchronicities || []);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "fetch non aboutie");
    } finally {
      setLoading(false);
    }
  }, [circleId]);
  dpE(() => {
    load();
  }, [load]);
  const askReading = async (item) => {
    setOpenMotif(item.motif);
    setReading(null);
    setReadingBusy(true);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/synchronicities`, {
        method: "POST",
        body: JSON.stringify({ motif: item.motif, kind: item.kind })
      });
      const data = await r.json();
      if (data == null ? void 0 : data.error) setError(data.error);
      else setReading(data);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "lecture non aboutie");
    } finally {
      setReadingBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("p", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 } }, "ce que plusieurs voix du cercle d\xE9posent en commun cette semaine. on parle de motifs, de figures, de patterns \u2014 pas de personnes. au moins 3 voix, sur 7 jours."), loading && /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "d\xE9tection en cours\u2026"), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" } }, error), !loading && items.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "rien ne traverse encore le cercle au-dessus du seuil. il faut au moins trois voix sur un m\xEAme motif."), /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, items.map((it, i) => /* @__PURE__ */ React.createElement(
    SyncRow,
    {
      key: it.motif + ":" + it.kind + ":" + i,
      item: it,
      onAsk: () => askReading(it),
      isActive: openMotif === it.motif
    }
  ))), openMotif && /* @__PURE__ */ React.createElement("div", { className: "card mt-l", style: {
    padding: "var(--s-4) var(--s-4)",
    background: "color-mix(in oklch, var(--silk-gold) 4%, var(--night-floor))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, "lecture polyphonique \xB7 \xAB ", openMotif, " \xBB"), readingBusy && /* @__PURE__ */ React.createElement("div", { className: "text-center", style: { padding: "var(--s-4)" } }, /* @__PURE__ */ React.createElement("div", { className: "breath", style: { margin: "0 auto" } }), /* @__PURE__ */ React.createElement("p", { className: "seuil-italic mt-s", style: { color: "var(--ash-light)" } }, "les voix se forment.")), !readingBusy && (reading == null ? void 0 : reading.voices) && /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement(PolyVoice, { tag: "paper", label: "profondeurs", text: reading.voices.paper }), /* @__PURE__ */ React.createElement(PolyVoice, { tag: "stone", label: "corps", text: reading.voices.stone }), /* @__PURE__ */ React.createElement(PolyVoice, { tag: "silk", label: "onirique", text: reading.voices.silk }), reading.closing_question && /* @__PURE__ */ React.createElement("div", { className: "seuil-italic", style: {
    color: "var(--silk-gold)",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: "var(--s-3)"
  } }, "\xAB ", reading.closing_question, " \xBB")), /* @__PURE__ */ React.createElement("div", { className: "row mt-m", style: { justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: () => {
    setOpenMotif(null);
    setReading(null);
  } }, "fermer"))), /* @__PURE__ */ React.createElement("div", { className: "row gap-m mt-s" }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", onClick: load, disabled: loading }, loading ? "\u2026" : "rafra\xEEchir")));
};
const SyncRow = ({ item, onAsk, isActive }) => {
  const kindLabel = item.kind === "motif_tag" ? "motif" : item.kind === "figure" ? "figure" : "pattern";
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-3) var(--s-4)",
    background: isActive ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 200 } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, kindLabel, " \xB7 ", item.contributors, " voix \xB7 ", item.kairos_count, " d\xE9p\xF4ts"), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.45,
    color: "var(--bone)"
  } }, "\xAB ", item.motif, " \xBB"), /* @__PURE__ */ React.createElement("div", { className: "row mt-s", style: { gap: 6, flexWrap: "wrap" } }, item.contributor_names && item.contributor_names.length === item.contributor_glyphs.length ? item.contributor_names.map((n, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "meta op-70", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 13
  } }, n, i < item.contributor_names.length - 1 ? " \xB7" : "")) : item.contributor_glyphs.map((g, i) => /* @__PURE__ */ React.createElement("span", { key: i, style: {
    width: 24,
    height: 24,
    borderRadius: "50%",
    border: "1px solid var(--ash-deep)",
    display: "inline-grid",
    placeItems: "center",
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 12,
    color: "var(--ash-light)"
  } }, g)))), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onAsk, style: { alignSelf: "center", whiteSpace: "nowrap" } }, isActive ? "relancer" : "lecture polyphonique")));
};
const PolyVoice = ({ tag, label, text }) => {
  const colorByTag = {
    paper: "color-mix(in oklch, var(--ember-warm) 12%, var(--night-floor))",
    stone: "color-mix(in oklch, var(--stone-cool) 12%, var(--night-floor))",
    silk: "color-mix(in oklch, var(--silk-gold) 10%, var(--night-floor))"
  };
  return /* @__PURE__ */ React.createElement("div", { style: {
    padding: "var(--s-3) var(--s-4)",
    background: colorByTag[tag] || "var(--night-warm)",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 9,
    letterSpacing: "0.18em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, tag, " \xB7 ", label), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 1.6,
    color: "var(--bone)",
    whiteSpace: "pre-wrap"
  } }, text));
};
const TabMeteo = ({ circleId }) => {
  const [weather, setWeather] = dpS(null);
  const [stale, setStale] = dpS(false);
  const [loading, setLoading] = dpS(true);
  const [busy, setBusy] = dpS(false);
  const [info, setInfo] = dpS(null);
  const [error, setError] = dpS(null);
  const load = dpC(async () => {
    setLoading(true);
    setInfo(null);
    setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/weather`);
      const data = await r.json();
      if (data == null ? void 0 : data.weather) {
        setWeather(data.weather);
        setStale(!!data.stale);
      } else {
        setWeather(null);
        setStale(true);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "fetch non aboutie");
    } finally {
      setLoading(false);
    }
  }, [circleId]);
  const tisser = async () => {
    setBusy(true);
    setInfo(null);
    setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/weather`, {
        method: "POST",
        body: JSON.stringify({})
      });
      const data = await r.json();
      if (data == null ? void 0 : data.error) setError(data.error);
      else if (data == null ? void 0 : data.k_anonymity_failed) {
        setWeather(null);
        setInfo(data.message || "pas encore assez de voix.");
      } else if (data == null ? void 0 : data.empty) {
        setWeather(null);
        setInfo(data.message || "rien \xE0 tisser.");
      } else if (data == null ? void 0 : data.weather) {
        setWeather(data.weather);
        setStale(false);
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "tissage non abouti");
    } finally {
      setBusy(false);
    }
  };
  dpE(() => {
    load();
  }, [load]);
  const m = (weather == null ? void 0 : weather.metrics) || {};
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("p", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 } }, "une note m\xE9t\xE9o du cercle sur 30 jours. anonyme par construction. au moins 5 voix doivent avoir contribu\xE9."), loading && /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "chargement\u2026"), !loading && (weather == null ? void 0 : weather.weather_text) && /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-5) var(--s-4)",
    background: "var(--night-warm)",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-m", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, "m\xE9t\xE9o \xB7 ", _dpRel(weather.generated_at), stale ? " \xB7 \xE0 rafra\xEEchir" : ""), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 1.7,
    color: "var(--bone)",
    whiteSpace: "pre-wrap"
  } }, weather.weather_text), (m.contributors || m.deposit_count) && /* @__PURE__ */ React.createElement("div", { className: "meta-mono mt-l op-50", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, m.contributors, " voix \xB7 ", m.deposit_count, " d\xE9p\xF4ts")), !loading && !(weather == null ? void 0 : weather.weather_text) && info && /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-4)",
    background: "transparent",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)", maxWidth: 480 } }, info)), !loading && !(weather == null ? void 0 : weather.weather_text) && !info && /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "aucune m\xE9t\xE9o encore tiss\xE9e. lance la premi\xE8re."), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" } }, error), /* @__PURE__ */ React.createElement("div", { className: "row gap-m mt-s" }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", disabled: busy, onClick: tisser }, busy ? "tissage\u2026" : (weather == null ? void 0 : weather.weather_text) ? "tisser une nouvelle m\xE9t\xE9o" : "tisser la m\xE9t\xE9o")));
};
const TabAnnales = ({ circleId }) => {
  const [entries, setEntries] = dpS([]);
  const [loading, setLoading] = dpS(true);
  const [filterMotif, setFilterMotif] = dpS("");
  const [filterMonth, setFilterMonth] = dpS("");
  const [starredOnly, setStarredOnly] = dpS(false);
  const [error, setError] = dpS(null);
  const load = dpC(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterMotif.trim()) params.set("motif", filterMotif.trim());
      if (filterMonth) params.set("month", filterMonth);
      if (starredOnly) params.set("starred", "1");
      const r = await _dpFetch(`/api/circles/${circleId}/annales?` + params.toString());
      const data = await r.json();
      if (data == null ? void 0 : data.error) setError(data.error);
      else setEntries(data.entries || []);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "fetch non aboutie");
    } finally {
      setLoading(false);
    }
  }, [circleId, filterMotif, filterMonth, starredOnly]);
  dpE(() => {
    load();
  }, [load]);
  const toggleMark = async (entry) => {
    try {
      if (entry.marked_by_me) {
        const params = new URLSearchParams();
        params.set("kairos_id", entry.kairos_id);
        await _dpFetch(`/api/circles/${circleId}/annales/mark?` + params.toString(), {
          method: "DELETE",
          body: JSON.stringify({ kairos_id: entry.kairos_id })
        });
      } else {
        await _dpFetch(`/api/circles/${circleId}/annales/mark`, {
          method: "POST",
          body: JSON.stringify({ kairos_id: entry.kairos_id })
        });
      }
      load();
    } catch (e) {
      console.warn("[TabAnnales] toggleMark failed:", e == null ? void 0 : e.message);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("p", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 } }, "les r\xEAves partag\xE9s en clair dans le cercle, conserv\xE9s ici. marque \u2605 ce qui r\xE9sonne. filtre par motif, par mois."), /* @__PURE__ */ React.createElement("div", { className: "row gap-s mb-m", style: { flexWrap: "wrap", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      placeholder: "filtrer par motif (eau, porte, m\xE8re\u2026)",
      value: filterMotif,
      onChange: (e) => setFilterMotif(e.target.value),
      style: { maxWidth: 260 }
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input",
      type: "month",
      value: filterMonth,
      onChange: (e) => setFilterMonth(e.target.value),
      style: { maxWidth: 180 }
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "meta op-70 row gap-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: starredOnly,
      onChange: (e) => setStarredOnly(e.target.checked)
    }
  ), "marqu\xE9s \u2605 uniquement")), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" } }, error), loading ? /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "chargement\u2026") : entries.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "aucune annale qui correspond \xE0 ce filtre.") : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, entries.map((e) => /* @__PURE__ */ React.createElement(AnnaleCard, { key: e.kairos_id, entry: e, onToggleMark: () => toggleMark(e) }))));
};
const AnnaleCard = ({ entry, onToggleMark }) => {
  var _a;
  const text = (entry.raw_text || "").slice(0, 320);
  const more = (entry.raw_text || "").length > 320;
  const dateStr = new Date(entry.shared_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-3) var(--s-4)",
    background: entry.marked_by_me ? "color-mix(in oklch, var(--silk-gold) 6%, transparent)" : "transparent",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "row", style: { justifyContent: "space-between", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, entry.pseudonym || "voix anonyme", " \xB7 ", dateStr), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onToggleMark,
      title: entry.marked_by_me ? "retirer ma marque" : "marquer \u2605",
      style: {
        background: "transparent",
        border: "none",
        color: entry.marked_by_me ? "var(--silk-gold)" : "var(--ash-light)",
        fontSize: 18,
        cursor: "pointer",
        padding: 0,
        lineHeight: 1
      }
    },
    entry.marked_by_me ? "\u2605" : "\u2606",
    entry.marks_count > 1 && /* @__PURE__ */ React.createElement("span", { className: "meta-mono ml-s", style: { fontSize: 10, color: "var(--ash-light)" } }, entry.marks_count)
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-s", style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 1.55,
    color: "var(--bone)",
    whiteSpace: "pre-wrap"
  } }, text, more && "\u2026"), (((_a = entry.motif_tags) == null ? void 0 : _a.length) || 0) > 0 && /* @__PURE__ */ React.createElement("div", { className: "row mt-s", style: { gap: 6, flexWrap: "wrap" } }, entry.motif_tags.slice(0, 6).map((t, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "meta-mono", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.1em",
    color: "var(--ash-light)",
    textTransform: "uppercase",
    border: "1px solid var(--ash-deep)",
    padding: "2px 6px"
  } }, t))));
};
const RITUAL_LABELS = {
  council: "Council Process \xB7 tour de parole",
  theory_u: "Theory U \xB7 4 mouvements",
  council_4_voix: "Council 4 voix sur un r\xEAve",
  lightning_group: "Lightning Dreamwork \xB7 groupe"
};
const TabRituels = ({ circleId }) => {
  const [rituals, setRituals] = dpS([]);
  const [loading, setLoading] = dpS(true);
  const [creating, setCreating] = dpS(false);
  const [openRitualId, setOpenRitualId] = dpS(null);
  const load = dpC(async () => {
    setLoading(true);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/rituals`);
      const data = await r.json();
      setRituals((data == null ? void 0 : data.rituals) || []);
    } catch (e) {
      console.warn("[TabRituels] load failed:", e == null ? void 0 : e.message);
    } finally {
      setLoading(false);
    }
  }, [circleId]);
  dpE(() => {
    load();
  }, [load]);
  if (openRitualId) {
    return /* @__PURE__ */ React.createElement(
      RitualView,
      {
        circleId,
        ritualId: openRitualId,
        onBack: () => {
          setOpenRitualId(null);
          load();
        }
      }
    );
  }
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("p", { className: "meta op-70", style: { fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 } }, "un rituel collectif tient le cercle dans une forme. async \u2014 chacun contribue \xE0 son rythme dans une fen\xEAtre. quatre formes disponibles."), loading ? /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "chargement\u2026") : rituals.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "aucun rituel encore. propose le premier.") : /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, rituals.map((r) => /* @__PURE__ */ React.createElement(RitualRow, { key: r.id, ritual: r, onOpen: () => setOpenRitualId(r.id) }))), !creating ? /* @__PURE__ */ React.createElement("button", { className: "btn-ghost mt-m", onClick: () => setCreating(true) }, "+ proposer un rituel") : /* @__PURE__ */ React.createElement(
    RitualCreator,
    {
      circleId,
      onCancel: () => setCreating(false),
      onCreated: (r) => {
        setCreating(false);
        setOpenRitualId(r.id);
        load();
      }
    }
  ));
};
const RitualRow = ({ ritual, onOpen }) => {
  const closed = ["archived", "closed"].includes(ritual.current_phase);
  return /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-3) var(--s-4)",
    background: closed ? "transparent" : "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0,
    opacity: closed ? 0.7 : 1
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, RITUAL_LABELS[ritual.ritual_type] || ritual.ritual_type, " \xB7 ", ritual.current_phase), /* @__PURE__ */ React.createElement("div", { style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16, color: "var(--bone)" } }, ritual.title || (ritual.prompt_seed ? "\xAB " + ritual.prompt_seed.slice(0, 80) + " \xBB" : "(sans titre)")), /* @__PURE__ */ React.createElement("div", { className: "row mt-s", style: { justifyContent: "space-between", flexWrap: "wrap", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, ritual.participant_count || 0, " participants \xB7 ouvert ", _dpRel(ritual.created_at)), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onOpen, style: { fontSize: 12.5 } }, ritual.i_joined ? "ouvrir" : "rejoindre & ouvrir")));
};
const RitualCreator = ({ circleId, onCancel, onCreated }) => {
  const [ritualType, setRitualType] = dpS("council");
  const [title, setTitle] = dpS("");
  const [promptSeed, setPromptSeed] = dpS("");
  const [targetKairosId, setTargetKairosId] = dpS("");
  const [windowHours, setWindowHours] = dpS(48);
  const [busy, setBusy] = dpS(false);
  const [error, setError] = dpS(null);
  const requireKairos = ritualType === "council_4_voix" || ritualType === "lightning_group";
  const create = async () => {
    if (busy) return;
    if (requireKairos && !targetKairosId.trim()) {
      setError("ce rituel a besoin d'un r\xEAve cible (kairos_id)");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/rituals`, {
        method: "POST",
        body: JSON.stringify({
          ritual_type: ritualType,
          title: title.trim() || null,
          prompt_seed: promptSeed.trim() || null,
          target_kairos_id: targetKairosId.trim() || null,
          window_hours: parseInt(windowHours, 10) || 48
        })
      });
      const data = await r.json();
      if (data == null ? void 0 : data.error) setError(data.error);
      else if (data == null ? void 0 : data.ritual) onCreated(data.ritual);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "cr\xE9ation non aboutie");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "card mt-m", style: {
    padding: "var(--s-4)",
    background: "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-m", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, "nouveau rituel"), /* @__PURE__ */ React.createElement("label", { className: "meta op-70 mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" } }, "forme"), /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input mb-m",
      value: ritualType,
      onChange: (e) => setRitualType(e.target.value),
      style: { width: "100%" }
    },
    /* @__PURE__ */ React.createElement("option", { value: "council" }, "Council Process \u2014 tour de parole"),
    /* @__PURE__ */ React.createElement("option", { value: "theory_u" }, "Theory U \u2014 4 mouvements (suspending / redirecting / letting go / letting come)"),
    /* @__PURE__ */ React.createElement("option", { value: "council_4_voix" }, "Council 4 voix sur un r\xEAve (r\xEAveur / protecteur / \xE2me / ombre)"),
    /* @__PURE__ */ React.createElement("option", { value: "lightning_group" }, `Lightning Dreamwork groupe \u2014 "si c'\xE9tait mon r\xEAve"`)
  ), /* @__PURE__ */ React.createElement("label", { className: "meta op-70 mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" } }, "titre (optionnel)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input mb-m",
      value: title,
      onChange: (e) => setTitle(e.target.value),
      placeholder: "ex: 'le seuil de l'\xE9t\xE9'",
      style: { width: "100%" }
    }
  ), /* @__PURE__ */ React.createElement("label", { className: "meta op-70 mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" } }, "question / contexte (optionnel)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-textarea mb-m",
      value: promptSeed,
      onChange: (e) => setPromptSeed(e.target.value),
      placeholder: "ce que le cercle vient regarder ensemble\u2026",
      rows: 3
    }
  ), requireKairos && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { className: "meta op-70 mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" } }, "kairos_id du r\xEAve cible"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input mb-m",
      value: targetKairosId,
      onChange: (e) => setTargetKairosId(e.target.value),
      placeholder: "uuid du r\xEAve partag\xE9 dans le cercle",
      style: { width: "100%" }
    }
  )), /* @__PURE__ */ React.createElement("label", { className: "meta op-70 mb-s", style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" } }, "fen\xEAtre (heures, async)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "field-input mb-m",
      type: "number",
      min: 1,
      max: 168,
      value: windowHours,
      onChange: (e) => setWindowHours(e.target.value),
      style: { width: 120 }
    }
  ), error && /* @__PURE__ */ React.createElement("div", { className: "meta mb-m", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" } }, error), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", disabled: busy, onClick: onCancel }, "annuler"), /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", disabled: busy, onClick: create }, busy ? "\u2026" : "proposer")));
};
const RitualView = ({ circleId, ritualId, onBack }) => {
  var _a;
  const [data, setData] = dpS(null);
  const [loading, setLoading] = dpS(true);
  const [contribDraft, setContribDraft] = dpS("");
  const [contribVoice, setContribVoice] = dpS(null);
  const [contribBusy, setContribBusy] = dpS(false);
  const [busy, setBusy] = dpS(false);
  const [error, setError] = dpS(null);
  const load = dpC(async () => {
    setLoading(true);
    try {
      const r2 = await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}`);
      const d = await r2.json();
      if (d == null ? void 0 : d.error) setError(d.error);
      else setData(d);
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "fetch non aboutie");
    } finally {
      setLoading(false);
    }
  }, [circleId, ritualId]);
  dpE(() => {
    load();
  }, [load]);
  const join = async () => {
    setBusy(true);
    try {
      await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}/join`, { method: "POST", body: "{}" });
      load();
    } catch (e) {
      console.warn("[RitualView] join failed:", e == null ? void 0 : e.message);
    } finally {
      setBusy(false);
    }
  };
  const advance = async () => {
    if (!confirm("passer \xE0 la phase suivante ?")) return;
    setBusy(true);
    try {
      await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}/advance`, { method: "POST", body: "{}" });
      load();
    } catch (e) {
      console.warn("[RitualView] advance failed:", e == null ? void 0 : e.message);
    } finally {
      setBusy(false);
    }
  };
  const contribute = async () => {
    var _a2;
    const text = contribDraft.trim();
    if (!text || contribBusy) return;
    setContribBusy(true);
    setError(null);
    try {
      const body = { content: text };
      if (((_a2 = data == null ? void 0 : data.ritual) == null ? void 0 : _a2.ritual_type) === "council_4_voix" && contribVoice) {
        body.voice_attribution = contribVoice;
      }
      const r2 = await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}/contribute`, {
        method: "POST",
        body: JSON.stringify(body)
      });
      const d = await r2.json();
      if (d == null ? void 0 : d.error) setError(d.error);
      else {
        setContribDraft("");
        load();
      }
    } catch (e) {
      setError((e == null ? void 0 : e.message) || "contribution non aboutie");
    } finally {
      setContribBusy(false);
    }
  };
  if (loading) return /* @__PURE__ */ React.createElement("div", { className: "meta op-70" }, "chargement du rituel\u2026");
  if (!(data == null ? void 0 : data.ritual)) {
    return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("p", { className: "seuil-italic", style: { color: "var(--ash-light)" } }, "rituel introuvable."), /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onBack }, "\u2190 retour"));
  }
  const r = data.ritual;
  const phasesDef = (((_a = r.metadata) == null ? void 0 : _a.phases) || []).filter((p) => p !== "open" && p !== "closed" && p !== "archived");
  const closed = ["archived", "closed"].includes(r.current_phase);
  const currentPhaseDef = (window.CIRCLE_RITUAL_PHASE_DEFS && window.CIRCLE_RITUAL_PHASE_DEFS[r.ritual_type] || []).find((p) => p.phase === r.current_phase);
  return /* @__PURE__ */ React.createElement("div", { className: "stack gap-m" }, /* @__PURE__ */ React.createElement("button", { className: "btn-text", onClick: onBack }, "\u2190 retour aux rituels"), /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-4) var(--s-4)",
    background: "color-mix(in oklch, var(--silk-gold) 4%, var(--night-floor))",
    border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.14em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, RITUAL_LABELS[r.ritual_type] || r.ritual_type, " \xB7 phase ", r.current_phase), /* @__PURE__ */ React.createElement("h2", { className: "h2-seuil mb-s" }, r.title || "(rituel sans titre)"), r.prompt_seed && /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--bone)", whiteSpace: "pre-wrap" } }, r.prompt_seed), /* @__PURE__ */ React.createElement("div", { className: "meta-mono mt-m op-70", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, data.participant_count, " participants \xB7 fen\xEAtre ", r.window_hours, "h")), /* @__PURE__ */ React.createElement("div", { className: "row", style: { gap: 6, flexWrap: "wrap" } }, phasesDef.map((p, i) => {
    const passed = phasesDef.indexOf(r.current_phase) > i;
    const here = r.current_phase === p;
    return /* @__PURE__ */ React.createElement("span", { key: p, className: "meta-mono", style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.1em",
      color: here ? "var(--silk-gold)" : passed ? "var(--ash-light)" : "var(--ash-deep)",
      textTransform: "uppercase",
      border: here ? "1px solid var(--silk-gold)" : "1px solid var(--ash-deep)",
      padding: "2px 8px"
    } }, p);
  })), currentPhaseDef && /* @__PURE__ */ React.createElement("div", { className: "card", style: {
    padding: "var(--s-3) var(--s-4)",
    background: "color-mix(in oklch, var(--stone-cool) 5%, transparent)",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--silk-gold)",
    textTransform: "uppercase"
  } }, currentPhaseDef.title), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--bone)" } }, currentPhaseDef.prompt)), /* @__PURE__ */ React.createElement("div", { className: "stack gap-s" }, (data.contributions || []).map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, className: "card", style: {
    padding: "var(--s-3) var(--s-4)",
    background: "transparent",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, /* @__PURE__ */ React.createElement("div", { className: "meta-mono mb-s", style: {
    fontFamily: "var(--mono)",
    fontSize: 10,
    letterSpacing: "0.12em",
    color: "var(--ash-light)",
    textTransform: "uppercase"
  } }, c.voice_attribution || c.phase, " \xB7 ", _dpRel(c.created_at), c.is_voice && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, color: "var(--silk-gold)" } }, "\u{1F399} ", _dpDur(c.voice_duration_ms))), /* @__PURE__ */ React.createElement("div", { style: {
    fontFamily: "var(--serif)",
    fontStyle: "italic",
    fontSize: 15,
    lineHeight: 1.55,
    color: "var(--bone)",
    whiteSpace: "pre-wrap"
  } }, c.content)))), error && /* @__PURE__ */ React.createElement("div", { className: "meta", style: { color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" } }, error), !data.i_joined && !closed && /* @__PURE__ */ React.createElement("button", { className: "btn-ghost mt-m", disabled: busy, onClick: join }, "rejoindre le rituel"), data.i_joined && !closed && /* @__PURE__ */ React.createElement("div", { className: "card mt-m", style: {
    padding: "var(--s-4)",
    background: "color-mix(in oklch, var(--stone-cool) 4%, transparent)",
    border: "1px solid var(--ash-deep)",
    borderRadius: 0
  } }, r.ritual_type === "council_4_voix" && /* @__PURE__ */ React.createElement(
    "select",
    {
      className: "field-input mb-s",
      value: contribVoice || "",
      onChange: (e) => setContribVoice(e.target.value || null),
      style: { width: "100%" }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, "\u2014 voix (optionnel) \u2014"),
    /* @__PURE__ */ React.createElement("option", { value: "dreamer" }, "voix du r\xEAveur"),
    /* @__PURE__ */ React.createElement("option", { value: "protector" }, "voix du protecteur"),
    /* @__PURE__ */ React.createElement("option", { value: "soul" }, "voix de l'\xE2me"),
    /* @__PURE__ */ React.createElement("option", { value: "shadow" }, "voix de l'ombre")
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "field-textarea mb-s",
      placeholder: "ta contribution \xE0 cette phase\u2026",
      value: contribDraft,
      onChange: (e) => setContribDraft(e.target.value),
      rows: 4
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "row gap-m", style: { justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-ghost", disabled: contribBusy || !contribDraft.trim(), onClick: contribute }, contribBusy ? "\u2026" : "d\xE9poser"))), data.i_joined && !closed && /* @__PURE__ */ React.createElement("button", { className: "btn-text mt-m", disabled: busy, onClick: advance, style: { alignSelf: "flex-start" } }, "\u2192 faire avancer \xE0 la phase suivante"));
};
const ChatVoiceMicButton = ({ onTranscribed, disabled }) => {
  const recRef = dpR(null);
  const streamRef = dpR(null);
  const chunksRef = dpR([]);
  const startedAtRef = dpR(0);
  const [recording, setRecording] = dpS(false);
  const [transcribing, setTranscribing] = dpS(false);
  const start = async () => {
    if (recRef.current || disabled) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start(250);
      recRef.current = rec;
      startedAtRef.current = Date.now();
      setRecording(true);
    } catch (e) {
      console.warn("[ChatVoiceMic] mic denied:", e.message);
      alert("Permission micro refus\xE9e. Active-la dans ton navigateur.");
    }
  };
  const stop = async () => {
    const rec = recRef.current;
    const stream = streamRef.current;
    if (!rec) return;
    return new Promise((resolve) => {
      rec.onstop = async () => {
        var _a, _b;
        try {
          if (stream) stream.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          recRef.current = null;
          setRecording(false);
          const dur = Date.now() - startedAtRef.current;
          if (chunksRef.current.length === 0) {
            resolve();
            return;
          }
          const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
          chunksRef.current = [];
          if (blob.size < 500) {
            resolve();
            return;
          }
          setTranscribing(true);
          try {
            const token = await ((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a));
            const fd = new FormData();
            fd.append("audio", new File([blob], "voice.webm", { type: blob.type }));
            const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: token ? { Authorization: "Bearer " + token } : {},
              body: fd
            });
            if (!res.ok) throw new Error("transcribe " + res.status);
            const json = await res.json();
            const transcript = (json.text || json.transcript || "").trim();
            if (transcript) onTranscribed == null ? void 0 : onTranscribed({ transcript, duration_ms: dur, lang: json.language || null });
          } catch (e) {
            console.warn("[ChatVoiceMic] transcribe failed:", e.message);
            alert("Transcription \xE9chou\xE9e. R\xE9essaie ou tape au clavier.");
          } finally {
            setTranscribing(false);
            resolve();
          }
        } catch (e) {
          console.warn("[ChatVoiceMic] stop fail:", e.message);
          resolve();
        }
      };
      rec.stop();
    });
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "btn-ghost",
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: () => {
        if (recRef.current) stop();
      },
      onTouchStart: (e) => {
        e.preventDefault();
        start();
      },
      onTouchEnd: (e) => {
        e.preventDefault();
        stop();
      },
      disabled: disabled || transcribing,
      title: recording ? "l\xE2cher pour envoyer" : transcribing ? "transcription\u2026" : "tenir pour parler",
      style: {
        minWidth: 44,
        padding: "8px 10px",
        borderColor: recording ? "var(--silk-gold)" : "var(--ash-deep)",
        color: recording ? "var(--silk-gold)" : "var(--ash-light)"
      }
    },
    transcribing ? "\u2026" : recording ? "\u25CF rec" : "\u{1F399}"
  );
};
window.CIRCLE_RITUAL_PHASE_DEFS = {
  council: [
    { phase: "phase_1", title: "Tour de parole", prompt: "Chacun\xB7e prend la parole \xE0 son tour. Pas de r\xE9ponse aux autres \u2014 on d\xE9pose, on \xE9coute en silence ce que les autres d\xE9posent. On peut passer son tour." }
  ],
  theory_u: [
    { phase: "phase_1", title: "Suspending \u2014 voir avec des yeux nouveaux", prompt: "Quel jugement tiens-tu sur ce qui se passe ? Mets-le \xE0 distance. D\xE9cris la situation comme si tu la voyais pour la premi\xE8re fois." },
    { phase: "phase_2", title: "Redirecting \u2014 voir depuis le tout", prompt: "Si tu te d\xE9places d'un cran, vers le tout du syst\xE8me, qu'est-ce que tu vois ? Quel r\xF4le joue le cercle dans cela ?" },
    { phase: "phase_3", title: "Letting go \u2014 laisser tomber le contr\xF4le", prompt: "Qu'est-ce qui voudrait s'en aller ? Quelle vieille forme demande \xE0 mourir ?" },
    { phase: "phase_4", title: "Letting come \u2014 laisser \xE9merger", prompt: "Qu'est-ce qui voudrait advenir si on faisait silence ? Quelle question, quelle image, quel acte ?" }
  ],
  council_4_voix: [
    { phase: "phase_1", title: "Voix du r\xEAveur", prompt: "D\xE9cris le r\xEAve comme tu l'as v\xE9cu, \xE0 la premi\xE8re personne. Qu'est-ce qui s'est pass\xE9 pour toi ?" },
    { phase: "phase_2", title: "Voix du protecteur", prompt: "Quelque chose dans le r\xEAve prot\xE8ge. Que dirait-elle, cette part qui veille ?" },
    { phase: "phase_3", title: "Voix de l'\xE2me", prompt: "Si l'\xE2me du r\xEAve avait une parole \u2014 pas une explication, une parole \u2014 quelle serait-elle ?" },
    { phase: "phase_4", title: "Voix de l'ombre", prompt: "Ce qui n'a pas \xE9t\xE9 dit, ce qui a \xE9t\xE9 refus\xE9, ce qui r\xE9siste \xE0 \xEAtre nomm\xE9 \u2014 que dit cela ?" }
  ],
  lightning_group: [
    { phase: "phase_1", title: "Le r\xEAve d\xE9pos\xE9", prompt: "Le r\xEAveur partage le r\xEAve \xE0 voix nue. Pas d'analyse, pas de commentaire. Juste les images, les figures, les sensations." },
    { phase: "phase_2", title: "Si c'\xE9tait mon r\xEAve", prompt: `"Si c'\xE9tait mon r\xEAve\u2026" \u2014 chaque autre membre prend le r\xEAve comme s'il \xE9tait le sien et dit ce qu'il y trouverait. Pas de "tu devrais", uniquement "moi je".` },
    { phase: "phase_3", title: "Le r\xEAveur reprend", prompt: "Le r\xEAveur dit ce qu'il garde \u2014 pas par politesse, par r\xE9sonance. Et peut-\xEAtre un acte qui honore le r\xEAve." }
  ]
};
Object.assign(window, {
  TabSynchronicites,
  TabMeteo,
  TabAnnales,
  TabRituels,
  ChatVoiceMicButton
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2NyZWVucy1jZXJjbGUtc3ViYXBwLWRlZXAuanN4Il0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvKiBnbG9iYWwgUmVhY3QgKi9cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuLy8gRHJlYW0gVjEuMiBcdTIwMTQgQ2VyY2xlU3ViQXBwIERFRVAgKHJlZm9udGUgcHJvZm9uZGUgMjAyNi0wNC0yOCBcdTIwMTQgWWVzaHVhKVxuLy9cbi8vIFNwZWMgOiAyX0RFU0lHTi5tZCBcdTAwQTcxMS5iaXMuMjAuMTEgXHUyMDE0IENlcmNsZSBjb21tdW5hdXRhaXJlIFJJQ0hFXG4vLyAgICAgICAgVGltIDIwMjYtMDQtMjggXHUyMDE0IFwiZm9uY3Rpb25zIENFUkNMRSBSSUNIRVMsIHZyYWllIGV4cFx1MDBFOXJpZW5jZSB2aXZhbnRlXCJcbi8vXG4vLyBcdTAwQzl0ZW5kIGxhIHNvdXMtYXBwIENlcmNsZSBkZSA1IG9uZ2xldHMgXHUyMTkyIDkgb25nbGV0cyA6XG4vLyAgIDEuIE1lbWJyZXMgICAgICAgIChsZWdhY3kpXG4vLyAgIDIuIERcdTAwRTlwXHUwMEY0dHMgICAgICAgICAobGVnYWN5KVxuLy8gICAzLiBDaGF0IGNlcmNsZSAgICAobGVnYWN5ICsgdm9pY2UgbWVzc2FnZXMgQy45IGFqb3V0XHUwMEU5cyBpbmxpbmUpXG4vLyAgIDQuIFBvcnRyYWl0ICAgICAgIChsZWdhY3kpXG4vLyAgIDUuIEludGVudGlvbnMgICAgIChsZWdhY3kpXG4vLyAgIDYuIFN5bmNocm9uaWNpdFx1MDBFOXMgXHUyMDE0IE5FVyBDLjUgKG1vdGlmcyBjcm9pc1x1MDBFOXMgXHUyMjY1MyBtZW1icmVzIC8gN2opXG4vLyAgIDcuIE1cdTAwRTl0XHUwMEU5byAgICAgICAgICBcdTIwMTQgTkVXIEMuNiAodnVlIGFnclx1MDBFOWdcdTAwRTllIDMwaiBzb2JyZSwgSGFpa3UpXG4vLyAgIDguIEFubmFsZXMgICAgICAgIFx1MjAxNCBORVcgQy43IChhcmNoaXZlIHNoYXJlZF9jbGVhciArIHRhbGVfbWFycXVhbnQpXG4vLyAgIDkuIFJpdHVlbHMgICAgICAgIFx1MjAxNCBORVcgQy44IChDb3VuY2lsIC8gVGhlb3J5IFUgLyA0IHZvaXggQWl6ZW5zdGF0IC8gTGlnaHRuaW5nKVxuLy9cbi8vIEV0IChDLjkpIDogdm9pY2UgbWVzc2FnZXMgZGFucyBDaGF0IGNlcmNsZSBcdTIxOTIgcGF0Y2hcdTAwRTkgaW4tcGxhY2UgZGFucyBUYWJDaGF0IGV4aXN0YW50XG4vL1xuLy8gQXJjaGl0ZWN0dXJlIDogb24gRVhQT1NFIGNoYXF1ZSBub3V2ZWF1IGNvbXBvc2FudCBzdXIgd2luZG93LiogcHVpcyBsZSB3cmFwcGVyXG4vLyBDZXJjbGVTdWJBcHAgKHNjcmVlbnMtY2VyY2xlLXN1YmFwcC5qc3gpIGxlcyBwaW9jaGUgc2kgcHJcdTAwRTlzZW50cy5cbi8vIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuXG5jb25zdCB7IHVzZVN0YXRlOiBkcFMsIHVzZUVmZmVjdDogZHBFLCB1c2VNZW1vOiBkcE0sIHVzZVJlZjogZHBSLCB1c2VDYWxsYmFjazogZHBDIH0gPSBSZWFjdDtcblxuLy8gXHUyNTAwXHUyNTAwIEhlbHBlcnMgcGFydGFnXHUwMEU5cyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbmZ1bmN0aW9uIF9kcFJlbChpc28pIHtcbiAgaWYgKCFpc28pIHJldHVybiBcInJcdTAwRTljZW1tZW50XCI7XG4gIHRyeSB7IHJldHVybiB3aW5kb3cuRHJlYW1BUEk/Ll9yZWxhdGl2ZVdoZW4/Lihpc28pIHx8IFwiclx1MDBFOWNlbW1lbnRcIjsgfSBjYXRjaCB7IHJldHVybiBcInJcdTAwRTljZW1tZW50XCI7IH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gX2RwRmV0Y2godXJsLCBvcHRzID0ge30pIHtcbiAgbGV0IGhlYWRlcnMgPSB7IC4uLihvcHRzLmhlYWRlcnMgfHwge30pIH07XG4gIHRyeSB7XG4gICAgY29uc3Qgc2VzcyA9IHdpbmRvdy5EcmVhbUF1dGg/LmdldFNlc3Npb24/LigpO1xuICAgIGNvbnN0IHRva2VuID0gc2Vzcz8uYWNjZXNzX3Rva2VuO1xuICAgIGlmICh0b2tlbikgaGVhZGVyc1tcIkF1dGhvcml6YXRpb25cIl0gPSBcIkJlYXJlciBcIiArIHRva2VuO1xuICB9IGNhdGNoIHt9XG4gIGlmIChvcHRzLmJvZHkgJiYgIWhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0pIGhlYWRlcnNbXCJDb250ZW50LVR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL2pzb25cIjtcbiAgcmV0dXJuIGZldGNoKHVybCwgeyAuLi5vcHRzLCBoZWFkZXJzIH0pO1xufVxuXG5mdW5jdGlvbiBfZHBEdXIobXMpIHtcbiAgaWYgKCFtcyB8fCBtcyA8IDApIHJldHVybiBcIlwiO1xuICBjb25zdCBzID0gTWF0aC5yb3VuZChtcyAvIDEwMDApO1xuICBjb25zdCBtID0gTWF0aC5mbG9vcihzIC8gNjApO1xuICBjb25zdCByID0gcyAlIDYwO1xuICByZXR1cm4gbSA+IDAgPyBgJHttfW0ke1N0cmluZyhyKS5wYWRTdGFydCgyLCBcIjBcIil9c2AgOiBgJHtzfXNgO1xufVxuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIEMuNSBcdTIwMTQgVGFiU3luY2hyb25pY2l0ZXNcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgVGFiU3luY2hyb25pY2l0ZXMgPSAoeyBjaXJjbGVJZCB9KSA9PiB7XG4gIGNvbnN0IFtpdGVtcywgc2V0SXRlbXNdID0gZHBTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gZHBTKHRydWUpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGRwUyhudWxsKTtcbiAgY29uc3QgW29wZW5Nb3RpZiwgc2V0T3Blbk1vdGlmXSA9IGRwUyhudWxsKTsgICAvLyBtb3RpZiBjb3VyYW50IHBvdXIgbGVjdHVyZSBwb2x5XG4gIGNvbnN0IFtyZWFkaW5nLCBzZXRSZWFkaW5nXSA9IGRwUyhudWxsKTsgICAgICAgIC8vIHJcdTAwRTlzdWx0YXQgMyB2b2l4XG4gIGNvbnN0IFtyZWFkaW5nQnVzeSwgc2V0UmVhZGluZ0J1c3ldID0gZHBTKGZhbHNlKTtcblxuICBjb25zdCBsb2FkID0gZHBDKGFzeW5jICgpID0+IHtcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgIHNldEVycm9yKG51bGwpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgX2RwRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9zeW5jaHJvbmljaXRpZXNgKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGlmIChkYXRhPy5lcnJvcikgc2V0RXJyb3IoZGF0YS5lcnJvcik7XG4gICAgICBlbHNlIHNldEl0ZW1zKGRhdGEuc3luY2hyb25pY2l0aWVzIHx8IFtdKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRFcnJvcihlPy5tZXNzYWdlIHx8IFwiZmV0Y2ggbm9uIGFib3V0aWVcIik7XG4gICAgfSBmaW5hbGx5IHsgc2V0TG9hZGluZyhmYWxzZSk7IH1cbiAgfSwgW2NpcmNsZUlkXSk7XG5cbiAgZHBFKCgpID0+IHsgbG9hZCgpOyB9LCBbbG9hZF0pO1xuXG4gIGNvbnN0IGFza1JlYWRpbmcgPSBhc3luYyAoaXRlbSkgPT4ge1xuICAgIHNldE9wZW5Nb3RpZihpdGVtLm1vdGlmKTtcbiAgICBzZXRSZWFkaW5nKG51bGwpO1xuICAgIHNldFJlYWRpbmdCdXN5KHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgX2RwRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9zeW5jaHJvbmljaXRpZXNgLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbW90aWY6IGl0ZW0ubW90aWYsIGtpbmQ6IGl0ZW0ua2luZCB9KSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHIuanNvbigpO1xuICAgICAgaWYgKGRhdGE/LmVycm9yKSBzZXRFcnJvcihkYXRhLmVycm9yKTtcbiAgICAgIGVsc2Ugc2V0UmVhZGluZyhkYXRhKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzZXRFcnJvcihlPy5tZXNzYWdlIHx8IFwibGVjdHVyZSBub24gYWJvdXRpZVwiKTtcbiAgICB9IGZpbmFsbHkgeyBzZXRSZWFkaW5nQnVzeShmYWxzZSk7IH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLW1cIj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1heFdpZHRoOiA1NjAgfX0+XG4gICAgICAgIGNlIHF1ZSBwbHVzaWV1cnMgdm9peCBkdSBjZXJjbGUgZFx1MDBFOXBvc2VudCBlbiBjb21tdW4gY2V0dGUgc2VtYWluZS4gb24gcGFybGUgZGUgbW90aWZzLCBkZSBmaWd1cmVzLCBkZSBwYXR0ZXJucyBcdTIwMTQgcGFzIGRlIHBlcnNvbm5lcy4gYXUgbW9pbnMgMyB2b2l4LCBzdXIgNyBqb3Vycy5cbiAgICAgIDwvcD5cblxuICAgICAge2xvYWRpbmcgJiYgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG9wLTcwXCI+ZFx1MDBFOXRlY3Rpb24gZW4gY291cnNcdTIwMjY8L2Rpdj59XG4gICAgICB7ZXJyb3IgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGFcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAge2Vycm9yfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICB7IWxvYWRpbmcgJiYgaXRlbXMubGVuZ3RoID09PSAwICYmIChcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgIHJpZW4gbmUgdHJhdmVyc2UgZW5jb3JlIGxlIGNlcmNsZSBhdS1kZXNzdXMgZHUgc2V1aWwuIGlsIGZhdXQgYXUgbW9pbnMgdHJvaXMgdm9peCBzdXIgdW4gbVx1MDBFQW1lIG1vdGlmLlxuICAgICAgICA8L3A+XG4gICAgICApfVxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1zXCI+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0LCBpKSA9PiAoXG4gICAgICAgICAgPFN5bmNSb3dcbiAgICAgICAgICAgIGtleT17aXQubW90aWYgKyBcIjpcIiArIGl0LmtpbmQgKyBcIjpcIiArIGl9XG4gICAgICAgICAgICBpdGVtPXtpdH1cbiAgICAgICAgICAgIG9uQXNrPXsoKSA9PiBhc2tSZWFkaW5nKGl0KX1cbiAgICAgICAgICAgIGlzQWN0aXZlPXtvcGVuTW90aWYgPT09IGl0Lm1vdGlmfVxuICAgICAgICAgIC8+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG5cbiAgICAgIHtvcGVuTW90aWYgJiYgKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgbXQtbFwiIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTQpIHZhcigtLXMtNClcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDIyJSwgdmFyKC0tYXNoLWRlZXApKVwiLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIGxlY3R1cmUgcG9seXBob25pcXVlIFx1MDBCNyBcdTAwQUIge29wZW5Nb3RpZn0gXHUwMEJCXG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7cmVhZGluZ0J1c3kgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiIHN0eWxlPXt7IHBhZGRpbmc6IFwidmFyKC0tcy00KVwiIH19PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJyZWF0aFwiIHN0eWxlPXt7IG1hcmdpbjogXCIwIGF1dG9cIiB9fSAvPlxuICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWMgbXQtc1wiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiB9fT5sZXMgdm9peCBzZSBmb3JtZW50LjwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7IXJlYWRpbmdCdXN5ICYmIHJlYWRpbmc/LnZvaWNlcyAmJiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInN0YWNrIGdhcC1tXCI+XG4gICAgICAgICAgICAgIDxQb2x5Vm9pY2UgdGFnPVwicGFwZXJcIiBsYWJlbD1cInByb2ZvbmRldXJzXCIgdGV4dD17cmVhZGluZy52b2ljZXMucGFwZXJ9IC8+XG4gICAgICAgICAgICAgIDxQb2x5Vm9pY2UgdGFnPVwic3RvbmVcIiBsYWJlbD1cImNvcnBzXCIgdGV4dD17cmVhZGluZy52b2ljZXMuc3RvbmV9IC8+XG4gICAgICAgICAgICAgIDxQb2x5Vm9pY2UgdGFnPVwic2lsa1wiIGxhYmVsPVwib25pcmlxdWVcIiB0ZXh0PXtyZWFkaW5nLnZvaWNlcy5zaWxrfSAvPlxuICAgICAgICAgICAgICB7cmVhZGluZy5jbG9zaW5nX3F1ZXN0aW9uICYmIChcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNldWlsLWl0YWxpY1wiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIHRleHRBbGlnbjogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWFyZ2luVG9wOiBcInZhcigtLXMtMylcIixcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIFx1MDBBQiB7cmVhZGluZy5jbG9zaW5nX3F1ZXN0aW9ufSBcdTAwQkJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtdC1tXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1lbmRcIiB9fT5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXsoKSA9PiB7IHNldE9wZW5Nb3RpZihudWxsKTsgc2V0UmVhZGluZyhudWxsKTsgfX0+XG4gICAgICAgICAgICAgIGZlcm1lclxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLW0gbXQtc1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIG9uQ2xpY2s9e2xvYWR9IGRpc2FibGVkPXtsb2FkaW5nfT5cbiAgICAgICAgICB7bG9hZGluZyA/IFwiXHUyMDI2XCIgOiBcInJhZnJhXHUwMEVFY2hpclwifVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgU3luY1JvdyA9ICh7IGl0ZW0sIG9uQXNrLCBpc0FjdGl2ZSB9KSA9PiB7XG4gIGNvbnN0IGtpbmRMYWJlbCA9IGl0ZW0ua2luZCA9PT0gXCJtb3RpZl90YWdcIiA/IFwibW90aWZcIlxuICAgICAgICAgICAgICAgICAgOiBpdGVtLmtpbmQgPT09IFwiZmlndXJlXCIgPyBcImZpZ3VyZVwiXG4gICAgICAgICAgICAgICAgICA6IFwicGF0dGVyblwiO1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7XG4gICAgICBwYWRkaW5nOiBcInZhcigtLXMtMykgdmFyKC0tcy00KVwiLFxuICAgICAgYmFja2dyb3VuZDogaXNBY3RpdmUgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA1JSwgdHJhbnNwYXJlbnQpXCIgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGFsaWduSXRlbXM6IFwiZmxleC1zdGFydFwiLCBnYXA6IDEyLCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgZmxleDogMSwgbWluV2lkdGg6IDIwMCB9fT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1zXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxuICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAge2tpbmRMYWJlbH0gXHUwMEI3IHtpdGVtLmNvbnRyaWJ1dG9yc30gdm9peCBcdTAwQjcge2l0ZW0ua2Fpcm9zX2NvdW50fSBkXHUwMEU5cFx1MDBGNHRzXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTcsXG4gICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjQ1LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLFxuICAgICAgICAgIH19PlxuICAgICAgICAgICAgXHUwMEFCIHtpdGVtLm1vdGlmfSBcdTAwQkJcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvdyBtdC1zXCIgc3R5bGU9e3sgZ2FwOiA2LCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgICAgICB7aXRlbS5jb250cmlidXRvcl9uYW1lcyAmJiBpdGVtLmNvbnRyaWJ1dG9yX25hbWVzLmxlbmd0aCA9PT0gaXRlbS5jb250cmlidXRvcl9nbHlwaHMubGVuZ3RoID8gKFxuICAgICAgICAgICAgICBpdGVtLmNvbnRyaWJ1dG9yX25hbWVzLm1hcCgobiwgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT17aX0gY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMyxcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHtufXtpIDwgaXRlbS5jb250cmlidXRvcl9uYW1lcy5sZW5ndGggLSAxID8gXCIgXHUwMEI3XCIgOiBcIlwifVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgIGl0ZW0uY29udHJpYnV0b3JfZ2x5cGhzLm1hcCgoZywgaSkgPT4gKFxuICAgICAgICAgICAgICAgIDxzcGFuIGtleT17aX0gc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNCwgaGVpZ2h0OiAyNCwgYm9yZGVyUmFkaXVzOiBcIjUwJVwiLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIixcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiaW5saW5lLWdyaWRcIiwgcGxhY2VJdGVtczogXCJjZW50ZXJcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMiwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgICAgIH19PntnfTwvc3Bhbj5cbiAgICAgICAgICAgICAgKSlcbiAgICAgICAgICAgICl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0XCIgb25DbGljaz17b25Bc2t9IHN0eWxlPXt7IGFsaWduU2VsZjogXCJjZW50ZXJcIiwgd2hpdGVTcGFjZTogXCJub3dyYXBcIiB9fT5cbiAgICAgICAgICB7aXNBY3RpdmUgPyBcInJlbGFuY2VyXCIgOiBcImxlY3R1cmUgcG9seXBob25pcXVlXCJ9XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG5jb25zdCBQb2x5Vm9pY2UgPSAoeyB0YWcsIGxhYmVsLCB0ZXh0IH0pID0+IHtcbiAgY29uc3QgY29sb3JCeVRhZyA9IHtcbiAgICBwYXBlcjogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLWVtYmVyLXdhcm0pIDEyJSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgIHN0b25lOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc3RvbmUtY29vbCkgMTIlLCB2YXIoLS1uaWdodC1mbG9vcikpXCIsXG4gICAgc2lsazogIFwiY29sb3ItbWl4KGluIG9rbGNoLCB2YXIoLS1zaWxrLWdvbGQpIDEwJSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICB9O1xuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSB2YXIoLS1zLTQpXCIsXG4gICAgICBiYWNrZ3JvdW5kOiBjb2xvckJ5VGFnW3RhZ10gfHwgXCJ2YXIoLS1uaWdodC13YXJtKVwiLFxuICAgICAgYm9yZGVyOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIiwgYm9yZGVyUmFkaXVzOiAwLFxuICAgIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiIHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDksIGxldHRlclNwYWNpbmc6IFwiMC4xOGVtXCIsXG4gICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgIH19PlxuICAgICAgICB7dGFnfSBcdTAwQjcge2xhYmVsfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LFxuICAgICAgICBsaW5lSGVpZ2h0OiAxLjYsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIsIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcbiAgICAgIH19Pnt0ZXh0fTwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyBDLjYgXHUyMDE0IFRhYk1ldGVvXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbmNvbnN0IFRhYk1ldGVvID0gKHsgY2lyY2xlSWQgfSkgPT4ge1xuICBjb25zdCBbd2VhdGhlciwgc2V0V2VhdGhlcl0gPSBkcFMobnVsbCk7XG4gIGNvbnN0IFtzdGFsZSwgc2V0U3RhbGVdID0gZHBTKGZhbHNlKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gZHBTKHRydWUpO1xuICBjb25zdCBbYnVzeSwgc2V0QnVzeV0gPSBkcFMoZmFsc2UpO1xuICBjb25zdCBbaW5mbywgc2V0SW5mb10gPSBkcFMobnVsbCk7XG4gIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gZHBTKG51bGwpO1xuXG4gIGNvbnN0IGxvYWQgPSBkcEMoYXN5bmMgKCkgPT4ge1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgc2V0SW5mbyhudWxsKTsgc2V0RXJyb3IobnVsbCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBfZHBGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L3dlYXRoZXJgKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGlmIChkYXRhPy53ZWF0aGVyKSB7IHNldFdlYXRoZXIoZGF0YS53ZWF0aGVyKTsgc2V0U3RhbGUoISFkYXRhLnN0YWxlKTsgfVxuICAgICAgZWxzZSB7IHNldFdlYXRoZXIobnVsbCk7IHNldFN0YWxlKHRydWUpOyB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcImZldGNoIG5vbiBhYm91dGllXCIpO1xuICAgIH0gZmluYWxseSB7IHNldExvYWRpbmcoZmFsc2UpOyB9XG4gIH0sIFtjaXJjbGVJZF0pO1xuXG4gIGNvbnN0IHRpc3NlciA9IGFzeW5jICgpID0+IHtcbiAgICBzZXRCdXN5KHRydWUpOyBzZXRJbmZvKG51bGwpOyBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IF9kcEZldGNoKGAvYXBpL2NpcmNsZXMvJHtjaXJjbGVJZH0vd2VhdGhlcmAsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgci5qc29uKCk7XG4gICAgICBpZiAoZGF0YT8uZXJyb3IpIHNldEVycm9yKGRhdGEuZXJyb3IpO1xuICAgICAgZWxzZSBpZiAoZGF0YT8ua19hbm9ueW1pdHlfZmFpbGVkKSB7XG4gICAgICAgIHNldFdlYXRoZXIobnVsbCk7XG4gICAgICAgIHNldEluZm8oZGF0YS5tZXNzYWdlIHx8IFwicGFzIGVuY29yZSBhc3NleiBkZSB2b2l4LlwiKTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0YT8uZW1wdHkpIHtcbiAgICAgICAgc2V0V2VhdGhlcihudWxsKTtcbiAgICAgICAgc2V0SW5mbyhkYXRhLm1lc3NhZ2UgfHwgXCJyaWVuIFx1MDBFMCB0aXNzZXIuXCIpO1xuICAgICAgfSBlbHNlIGlmIChkYXRhPy53ZWF0aGVyKSB7XG4gICAgICAgIHNldFdlYXRoZXIoZGF0YS53ZWF0aGVyKTsgc2V0U3RhbGUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHsgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcInRpc3NhZ2Ugbm9uIGFib3V0aVwiKTsgfVxuICAgIGZpbmFsbHkgeyBzZXRCdXN5KGZhbHNlKTsgfVxuICB9O1xuXG4gIGRwRSgoKSA9PiB7IGxvYWQoKTsgfSwgW2xvYWRdKTtcblxuICBjb25zdCBtID0gd2VhdGhlcj8ubWV0cmljcyB8fCB7fTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLW1cIj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1heFdpZHRoOiA1NjAgfX0+XG4gICAgICAgIHVuZSBub3RlIG1cdTAwRTl0XHUwMEU5byBkdSBjZXJjbGUgc3VyIDMwIGpvdXJzLiBhbm9ueW1lIHBhciBjb25zdHJ1Y3Rpb24uIGF1IG1vaW5zIDUgdm9peCBkb2l2ZW50IGF2b2lyIGNvbnRyaWJ1XHUwMEU5LlxuICAgICAgPC9wPlxuXG4gICAgICB7bG9hZGluZyAmJiA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIj5jaGFyZ2VtZW50XHUyMDI2PC9kaXY+fVxuXG4gICAgICB7IWxvYWRpbmcgJiYgd2VhdGhlcj8ud2VhdGhlcl90ZXh0ICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNSkgdmFyKC0tcy00KVwiLFxuICAgICAgICAgIGJhY2tncm91bmQ6IFwidmFyKC0tbmlnaHQtd2FybSlcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxNCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YS1tb25vIG1iLW1cIiBzdHlsZT17e1xuICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAsIGxldHRlclNwYWNpbmc6IFwiMC4xNGVtXCIsXG4gICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICBtXHUwMEU5dFx1MDBFOW8gXHUwMEI3IHtfZHBSZWwod2VhdGhlci5nZW5lcmF0ZWRfYXQpfXtzdGFsZSA/IFwiIFx1MDBCNyBcdTAwRTAgcmFmcmFcdTAwRUVjaGlyXCIgOiBcIlwifVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE3LFxuICAgICAgICAgICAgbGluZUhlaWdodDogMS43LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICB7d2VhdGhlci53ZWF0aGVyX3RleHR9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgeyhtLmNvbnRyaWJ1dG9ycyB8fCBtLmRlcG9zaXRfY291bnQpICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YS1tb25vIG10LWwgb3AtNTBcIiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcbiAgICAgICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHttLmNvbnRyaWJ1dG9yc30gdm9peCBcdTAwQjcge20uZGVwb3NpdF9jb3VudH0gZFx1MDBFOXBcdTAwRjR0c1xuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7IWxvYWRpbmcgJiYgIXdlYXRoZXI/LndlYXRoZXJfdGV4dCAmJiBpbmZvICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNClcIiwgYmFja2dyb3VuZDogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCBtYXhXaWR0aDogNDgwIH19PntpbmZvfTwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgICAgeyFsb2FkaW5nICYmICF3ZWF0aGVyPy53ZWF0aGVyX3RleHQgJiYgIWluZm8gJiYgKFxuICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIgfX0+XG4gICAgICAgICAgYXVjdW5lIG1cdTAwRTl0XHUwMEU5byBlbmNvcmUgdGlzc1x1MDBFOWUuIGxhbmNlIGxhIHByZW1pXHUwMEU4cmUuXG4gICAgICAgIDwvcD5cbiAgICAgICl9XG5cbiAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YVwiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWVtYmVyLWxpdmUpXCIsIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLW0gbXQtc1wiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIGRpc2FibGVkPXtidXN5fSBvbkNsaWNrPXt0aXNzZXJ9PlxuICAgICAgICAgIHtidXN5ID8gXCJ0aXNzYWdlXHUyMDI2XCIgOiAod2VhdGhlcj8ud2VhdGhlcl90ZXh0ID8gXCJ0aXNzZXIgdW5lIG5vdXZlbGxlIG1cdTAwRTl0XHUwMEU5b1wiIDogXCJ0aXNzZXIgbGEgbVx1MDBFOXRcdTAwRTlvXCIpfVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyBDLjcgXHUyMDE0IFRhYkFubmFsZXNcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgVGFiQW5uYWxlcyA9ICh7IGNpcmNsZUlkIH0pID0+IHtcbiAgY29uc3QgW2VudHJpZXMsIHNldEVudHJpZXNdID0gZHBTKFtdKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gZHBTKHRydWUpO1xuICBjb25zdCBbZmlsdGVyTW90aWYsIHNldEZpbHRlck1vdGlmXSA9IGRwUyhcIlwiKTtcbiAgY29uc3QgW2ZpbHRlck1vbnRoLCBzZXRGaWx0ZXJNb250aF0gPSBkcFMoXCJcIik7IC8vIFlZWVktTU1cbiAgY29uc3QgW3N0YXJyZWRPbmx5LCBzZXRTdGFycmVkT25seV0gPSBkcFMoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGRwUyhudWxsKTtcblxuICBjb25zdCBsb2FkID0gZHBDKGFzeW5jICgpID0+IHtcbiAgICBzZXRMb2FkaW5nKHRydWUpOyBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgaWYgKGZpbHRlck1vdGlmLnRyaW0oKSkgcGFyYW1zLnNldChcIm1vdGlmXCIsIGZpbHRlck1vdGlmLnRyaW0oKSk7XG4gICAgICBpZiAoZmlsdGVyTW9udGgpIHBhcmFtcy5zZXQoXCJtb250aFwiLCBmaWx0ZXJNb250aCk7XG4gICAgICBpZiAoc3RhcnJlZE9ubHkpIHBhcmFtcy5zZXQoXCJzdGFycmVkXCIsIFwiMVwiKTtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBfZHBGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L2FubmFsZXM/YCArIHBhcmFtcy50b1N0cmluZygpKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGlmIChkYXRhPy5lcnJvcikgc2V0RXJyb3IoZGF0YS5lcnJvcik7XG4gICAgICBlbHNlIHNldEVudHJpZXMoZGF0YS5lbnRyaWVzIHx8IFtdKTtcbiAgICB9IGNhdGNoIChlKSB7IHNldEVycm9yKGU/Lm1lc3NhZ2UgfHwgXCJmZXRjaCBub24gYWJvdXRpZVwiKTsgfVxuICAgIGZpbmFsbHkgeyBzZXRMb2FkaW5nKGZhbHNlKTsgfVxuICB9LCBbY2lyY2xlSWQsIGZpbHRlck1vdGlmLCBmaWx0ZXJNb250aCwgc3RhcnJlZE9ubHldKTtcblxuICBkcEUoKCkgPT4geyBsb2FkKCk7IH0sIFtsb2FkXSk7XG5cbiAgY29uc3QgdG9nZ2xlTWFyayA9IGFzeW5jIChlbnRyeSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoZW50cnkubWFya2VkX2J5X21lKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldChcImthaXJvc19pZFwiLCBlbnRyeS5rYWlyb3NfaWQpO1xuICAgICAgICBhd2FpdCBfZHBGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L2FubmFsZXMvbWFyaz9gICsgcGFyYW1zLnRvU3RyaW5nKCksIHtcbiAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsga2Fpcm9zX2lkOiBlbnRyeS5rYWlyb3NfaWQgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgX2RwRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9hbm5hbGVzL21hcmtgLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBrYWlyb3NfaWQ6IGVudHJ5LmthaXJvc19pZCB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICAvLyBvcHRpbWlzdGljIHJlZnJlc2hcbiAgICAgIGxvYWQoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJbVGFiQW5uYWxlc10gdG9nZ2xlTWFyayBmYWlsZWQ6XCIsIGU/Lm1lc3NhZ2UpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLW1cIj5cbiAgICAgIDxwIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIG1heFdpZHRoOiA1NjAgfX0+XG4gICAgICAgIGxlcyByXHUwMEVBdmVzIHBhcnRhZ1x1MDBFOXMgZW4gY2xhaXIgZGFucyBsZSBjZXJjbGUsIGNvbnNlcnZcdTAwRTlzIGljaS4gbWFycXVlIFx1MjYwNSBjZSBxdWkgclx1MDBFOXNvbm5lLiBmaWx0cmUgcGFyIG1vdGlmLCBwYXIgbW9pcy5cbiAgICAgIDwvcD5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLXMgbWItbVwiIHN0eWxlPXt7IGZsZXhXcmFwOiBcIndyYXBcIiwgYWxpZ25JdGVtczogXCJjZW50ZXJcIiB9fT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXRcIlxuICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZmlsdHJlciBwYXIgbW90aWYgKGVhdSwgcG9ydGUsIG1cdTAwRThyZVx1MjAyNilcIlxuICAgICAgICAgIHZhbHVlPXtmaWx0ZXJNb3RpZn1cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEZpbHRlck1vdGlmKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogMjYwIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0XCJcbiAgICAgICAgICB0eXBlPVwibW9udGhcIlxuICAgICAgICAgIHZhbHVlPXtmaWx0ZXJNb250aH1cbiAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEZpbHRlck1vbnRoKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogMTgwIH19XG4gICAgICAgIC8+XG4gICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIHJvdyBnYXAtc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzIH19PlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICAgIGNoZWNrZWQ9e3N0YXJyZWRPbmx5fVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRTdGFycmVkT25seShlLnRhcmdldC5jaGVja2VkKX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIG1hcnF1XHUwMEU5cyBcdTI2MDUgdW5pcXVlbWVudFxuICAgICAgICA8L2xhYmVsPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIHtlcnJvciAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YVwiIHN0eWxlPXt7IGNvbG9yOiBcInZhcigtLWVtYmVyLWxpdmUpXCIsIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiB9fT5cbiAgICAgICAgICB7ZXJyb3J9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiPmNoYXJnZW1lbnRcdTIwMjY8L2Rpdj5cbiAgICAgICkgOiBlbnRyaWVzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgIGF1Y3VuZSBhbm5hbGUgcXVpIGNvcnJlc3BvbmQgXHUwMEUwIGNlIGZpbHRyZS5cbiAgICAgICAgPC9wPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtc1wiPlxuICAgICAgICAgIHtlbnRyaWVzLm1hcCgoZSkgPT4gKFxuICAgICAgICAgICAgPEFubmFsZUNhcmQga2V5PXtlLmthaXJvc19pZH0gZW50cnk9e2V9IG9uVG9nZ2xlTWFyaz17KCkgPT4gdG9nZ2xlTWFyayhlKX0gLz5cbiAgICAgICAgICApKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgQW5uYWxlQ2FyZCA9ICh7IGVudHJ5LCBvblRvZ2dsZU1hcmsgfSkgPT4ge1xuICBjb25zdCB0ZXh0ID0gKGVudHJ5LnJhd190ZXh0IHx8IFwiXCIpLnNsaWNlKDAsIDMyMCk7XG4gIGNvbnN0IG1vcmUgPSAoZW50cnkucmF3X3RleHQgfHwgXCJcIikubGVuZ3RoID4gMzIwO1xuICBjb25zdCBkYXRlU3RyID0gbmV3IERhdGUoZW50cnkuc2hhcmVkX2F0KS50b0xvY2FsZURhdGVTdHJpbmcoXCJmci1GUlwiLCB7IGRheTogXCIyLWRpZ2l0XCIsIG1vbnRoOiBcImxvbmdcIiwgeWVhcjogXCJudW1lcmljXCIgfSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3tcbiAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSB2YXIoLS1zLTQpXCIsXG4gICAgICBiYWNrZ3JvdW5kOiBlbnRyeS5tYXJrZWRfYnlfbWVcbiAgICAgICAgPyBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA2JSwgdHJhbnNwYXJlbnQpXCJcbiAgICAgICAgOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGdhcDogOCB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAge2VudHJ5LnBzZXVkb255bSB8fCBcInZvaXggYW5vbnltZVwifSBcdTAwQjcge2RhdGVTdHJ9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgb25DbGljaz17b25Ub2dnbGVNYXJrfVxuICAgICAgICAgIHRpdGxlPXtlbnRyeS5tYXJrZWRfYnlfbWUgPyBcInJldGlyZXIgbWEgbWFycXVlXCIgOiBcIm1hcnF1ZXIgXHUyNjA1XCJ9XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGJhY2tncm91bmQ6IFwidHJhbnNwYXJlbnRcIiwgYm9yZGVyOiBcIm5vbmVcIixcbiAgICAgICAgICAgIGNvbG9yOiBlbnRyeS5tYXJrZWRfYnlfbWUgPyBcInZhcigtLXNpbGstZ29sZClcIiA6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgICAgICAgZm9udFNpemU6IDE4LCBjdXJzb3I6IFwicG9pbnRlclwiLCBwYWRkaW5nOiAwLCBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICB7ZW50cnkubWFya2VkX2J5X21lID8gXCJcdTI2MDVcIiA6IFwiXHUyNjA2XCJ9XG4gICAgICAgICAge2VudHJ5Lm1hcmtzX2NvdW50ID4gMSAmJiAoXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWwtc1wiIHN0eWxlPXt7IGZvbnRTaXplOiAxMCwgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgICAgICB7ZW50cnkubWFya3NfY291bnR9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtc1wiIHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDE1LFxuICAgICAgICBsaW5lSGVpZ2h0OiAxLjU1LCBjb2xvcjogXCJ2YXIoLS1ib25lKVwiLCB3aGl0ZVNwYWNlOiBcInByZS13cmFwXCIsXG4gICAgICB9fT5cbiAgICAgICAge3RleHR9e21vcmUgJiYgXCJcdTIwMjZcIn1cbiAgICAgIDwvZGl2PlxuICAgICAgeyhlbnRyeS5tb3RpZl90YWdzPy5sZW5ndGggfHwgMCkgPiAwICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgbXQtc1wiIHN0eWxlPXt7IGdhcDogNiwgZmxleFdyYXA6IFwid3JhcFwiIH19PlxuICAgICAgICAgIHtlbnRyeS5tb3RpZl90YWdzLnNsaWNlKDAsIDYpLm1hcCgodCwgaSkgPT4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtpfSBjbGFzc05hbWU9XCJtZXRhLW1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsIHBhZGRpbmc6IFwiMnB4IDZweFwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHt0fVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICkpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgPC9kaXY+XG4gICk7XG59O1xuXG4vLyBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcdTI1NTBcbi8vIEMuOCBcdTIwMTQgVGFiUml0dWVsc1xuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG5jb25zdCBSSVRVQUxfTEFCRUxTID0ge1xuICBjb3VuY2lsOiBcIkNvdW5jaWwgUHJvY2VzcyBcdTAwQjcgdG91ciBkZSBwYXJvbGVcIixcbiAgdGhlb3J5X3U6IFwiVGhlb3J5IFUgXHUwMEI3IDQgbW91dmVtZW50c1wiLFxuICBjb3VuY2lsXzRfdm9peDogXCJDb3VuY2lsIDQgdm9peCBzdXIgdW4gclx1MDBFQXZlXCIsXG4gIGxpZ2h0bmluZ19ncm91cDogXCJMaWdodG5pbmcgRHJlYW13b3JrIFx1MDBCNyBncm91cGVcIixcbn07XG5cbmNvbnN0IFRhYlJpdHVlbHMgPSAoeyBjaXJjbGVJZCB9KSA9PiB7XG4gIGNvbnN0IFtyaXR1YWxzLCBzZXRSaXR1YWxzXSA9IGRwUyhbXSk7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IGRwUyh0cnVlKTtcbiAgY29uc3QgW2NyZWF0aW5nLCBzZXRDcmVhdGluZ10gPSBkcFMoZmFsc2UpO1xuICBjb25zdCBbb3BlblJpdHVhbElkLCBzZXRPcGVuUml0dWFsSWRdID0gZHBTKG51bGwpO1xuXG4gIGNvbnN0IGxvYWQgPSBkcEMoYXN5bmMgKCkgPT4ge1xuICAgIHNldExvYWRpbmcodHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBfZHBGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L3JpdHVhbHNgKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIHNldFJpdHVhbHMoZGF0YT8ucml0dWFscyB8fCBbXSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS53YXJuKFwiW1RhYlJpdHVlbHNdIGxvYWQgZmFpbGVkOlwiLCBlPy5tZXNzYWdlKTtcbiAgICB9IGZpbmFsbHkgeyBzZXRMb2FkaW5nKGZhbHNlKTsgfVxuICB9LCBbY2lyY2xlSWRdKTtcblxuICBkcEUoKCkgPT4geyBsb2FkKCk7IH0sIFtsb2FkXSk7XG5cbiAgaWYgKG9wZW5SaXR1YWxJZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8Uml0dWFsVmlld1xuICAgICAgICBjaXJjbGVJZD17Y2lyY2xlSWR9XG4gICAgICAgIHJpdHVhbElkPXtvcGVuUml0dWFsSWR9XG4gICAgICAgIG9uQmFjaz17KCkgPT4geyBzZXRPcGVuUml0dWFsSWQobnVsbCk7IGxvYWQoKTsgfX1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbVwiPlxuICAgICAgPHAgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgbWF4V2lkdGg6IDU2MCB9fT5cbiAgICAgICAgdW4gcml0dWVsIGNvbGxlY3RpZiB0aWVudCBsZSBjZXJjbGUgZGFucyB1bmUgZm9ybWUuIGFzeW5jIFx1MjAxNCBjaGFjdW4gY29udHJpYnVlIFx1MDBFMCBzb24gcnl0aG1lIGRhbnMgdW5lIGZlblx1MDBFQXRyZS4gcXVhdHJlIGZvcm1lcyBkaXNwb25pYmxlcy5cbiAgICAgIDwvcD5cblxuICAgICAge2xvYWRpbmcgPyAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YSBvcC03MFwiPmNoYXJnZW1lbnRcdTIwMjY8L2Rpdj5cbiAgICAgICkgOiByaXR1YWxzLmxlbmd0aCA9PT0gMCA/IChcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwic2V1aWwtaXRhbGljXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiIH19PlxuICAgICAgICAgIGF1Y3VuIHJpdHVlbCBlbmNvcmUuIHByb3Bvc2UgbGUgcHJlbWllci5cbiAgICAgICAgPC9wPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtc1wiPlxuICAgICAgICAgIHtyaXR1YWxzLm1hcCgocikgPT4gKFxuICAgICAgICAgICAgPFJpdHVhbFJvdyBrZXk9e3IuaWR9IHJpdHVhbD17cn0gb25PcGVuPXsoKSA9PiBzZXRPcGVuUml0dWFsSWQoci5pZCl9IC8+XG4gICAgICAgICAgKSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgeyFjcmVhdGluZyA/IChcbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3QgbXQtbVwiIG9uQ2xpY2s9eygpID0+IHNldENyZWF0aW5nKHRydWUpfT5cbiAgICAgICAgICArIHByb3Bvc2VyIHVuIHJpdHVlbFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICkgOiAoXG4gICAgICAgIDxSaXR1YWxDcmVhdG9yXG4gICAgICAgICAgY2lyY2xlSWQ9e2NpcmNsZUlkfVxuICAgICAgICAgIG9uQ2FuY2VsPXsoKSA9PiBzZXRDcmVhdGluZyhmYWxzZSl9XG4gICAgICAgICAgb25DcmVhdGVkPXsocikgPT4geyBzZXRDcmVhdGluZyhmYWxzZSk7IHNldE9wZW5SaXR1YWxJZChyLmlkKTsgbG9hZCgpOyB9fVxuICAgICAgICAvPlxuICAgICAgKX1cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IFJpdHVhbFJvdyA9ICh7IHJpdHVhbCwgb25PcGVuIH0pID0+IHtcbiAgY29uc3QgY2xvc2VkID0gWydhcmNoaXZlZCcsICdjbG9zZWQnXS5pbmNsdWRlcyhyaXR1YWwuY3VycmVudF9waGFzZSk7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3tcbiAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSB2YXIoLS1zLTQpXCIsXG4gICAgICBiYWNrZ3JvdW5kOiBjbG9zZWQgPyBcInRyYW5zcGFyZW50XCIgOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdHJhbnNwYXJlbnQpXCIsXG4gICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgYm9yZGVyUmFkaXVzOiAwLCBvcGFjaXR5OiBjbG9zZWQgPyAwLjcgOiAxLFxuICAgIH19PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiIHN0eWxlPXt7XG4gICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTJlbVwiLFxuICAgICAgICBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICB9fT5cbiAgICAgICAge1JJVFVBTF9MQUJFTFNbcml0dWFsLnJpdHVhbF90eXBlXSB8fCByaXR1YWwucml0dWFsX3R5cGV9IFx1MDBCNyB7cml0dWFsLmN1cnJlbnRfcGhhc2V9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTYsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIgfX0+XG4gICAgICAgIHtyaXR1YWwudGl0bGUgfHwgKHJpdHVhbC5wcm9tcHRfc2VlZCA/IFwiXHUwMEFCIFwiICsgcml0dWFsLnByb21wdF9zZWVkLnNsaWNlKDAsIDgwKSArIFwiIFx1MDBCQlwiIDogXCIoc2FucyB0aXRyZSlcIil9XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IG10LXNcIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJzcGFjZS1iZXR3ZWVuXCIsIGZsZXhXcmFwOiBcIndyYXBcIiwgZ2FwOiA4IH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEtbW9ub1wiIHN0eWxlPXt7XG4gICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAsIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXG4gICAgICAgICAgY29sb3I6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICB9fT5cbiAgICAgICAgICB7cml0dWFsLnBhcnRpY2lwYW50X2NvdW50IHx8IDB9IHBhcnRpY2lwYW50cyBcdTAwQjcgb3V2ZXJ0IHtfZHBSZWwocml0dWFsLmNyZWF0ZWRfYXQpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9e29uT3Blbn0gc3R5bGU9e3sgZm9udFNpemU6IDEyLjUgfX0+XG4gICAgICAgICAge3JpdHVhbC5pX2pvaW5lZCA/IFwib3V2cmlyXCIgOiBcInJlam9pbmRyZSAmIG91dnJpclwifVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufTtcblxuY29uc3QgUml0dWFsQ3JlYXRvciA9ICh7IGNpcmNsZUlkLCBvbkNhbmNlbCwgb25DcmVhdGVkIH0pID0+IHtcbiAgY29uc3QgW3JpdHVhbFR5cGUsIHNldFJpdHVhbFR5cGVdID0gZHBTKFwiY291bmNpbFwiKTtcbiAgY29uc3QgW3RpdGxlLCBzZXRUaXRsZV0gPSBkcFMoXCJcIik7XG4gIGNvbnN0IFtwcm9tcHRTZWVkLCBzZXRQcm9tcHRTZWVkXSA9IGRwUyhcIlwiKTtcbiAgY29uc3QgW3RhcmdldEthaXJvc0lkLCBzZXRUYXJnZXRLYWlyb3NJZF0gPSBkcFMoXCJcIik7XG4gIGNvbnN0IFt3aW5kb3dIb3Vycywgc2V0V2luZG93SG91cnNdID0gZHBTKDQ4KTtcbiAgY29uc3QgW2J1c3ksIHNldEJ1c3ldID0gZHBTKGZhbHNlKTtcbiAgY29uc3QgW2Vycm9yLCBzZXRFcnJvcl0gPSBkcFMobnVsbCk7XG5cbiAgY29uc3QgcmVxdWlyZUthaXJvcyA9IHJpdHVhbFR5cGUgPT09IFwiY291bmNpbF80X3ZvaXhcIiB8fCByaXR1YWxUeXBlID09PSBcImxpZ2h0bmluZ19ncm91cFwiO1xuXG4gIGNvbnN0IGNyZWF0ZSA9IGFzeW5jICgpID0+IHtcbiAgICBpZiAoYnVzeSkgcmV0dXJuO1xuICAgIGlmIChyZXF1aXJlS2Fpcm9zICYmICF0YXJnZXRLYWlyb3NJZC50cmltKCkpIHtcbiAgICAgIHNldEVycm9yKFwiY2Ugcml0dWVsIGEgYmVzb2luIGQndW4gclx1MDBFQXZlIGNpYmxlIChrYWlyb3NfaWQpXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRCdXN5KHRydWUpOyBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgciA9IGF3YWl0IF9kcEZldGNoKGAvYXBpL2NpcmNsZXMvJHtjaXJjbGVJZH0vcml0dWFsc2AsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIHJpdHVhbF90eXBlOiByaXR1YWxUeXBlLFxuICAgICAgICAgIHRpdGxlOiB0aXRsZS50cmltKCkgfHwgbnVsbCxcbiAgICAgICAgICBwcm9tcHRfc2VlZDogcHJvbXB0U2VlZC50cmltKCkgfHwgbnVsbCxcbiAgICAgICAgICB0YXJnZXRfa2Fpcm9zX2lkOiB0YXJnZXRLYWlyb3NJZC50cmltKCkgfHwgbnVsbCxcbiAgICAgICAgICB3aW5kb3dfaG91cnM6IHBhcnNlSW50KHdpbmRvd0hvdXJzLCAxMCkgfHwgNDgsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgci5qc29uKCk7XG4gICAgICBpZiAoZGF0YT8uZXJyb3IpIHNldEVycm9yKGRhdGEuZXJyb3IpO1xuICAgICAgZWxzZSBpZiAoZGF0YT8ucml0dWFsKSBvbkNyZWF0ZWQoZGF0YS5yaXR1YWwpO1xuICAgIH0gY2F0Y2ggKGUpIHsgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcImNyXHUwMEU5YXRpb24gbm9uIGFib3V0aWVcIik7IH1cbiAgICBmaW5hbGx5IHsgc2V0QnVzeShmYWxzZSk7IH1cbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBtdC1tXCIgc3R5bGU9e3tcbiAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy00KVwiLFxuICAgICAgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXN0b25lLWNvb2wpIDUlLCB2YXIoLS1uaWdodC1mbG9vcikpXCIsXG4gICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgIGJvcmRlclJhZGl1czogMCxcbiAgICB9fT5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YS1tb25vIG1iLW1cIiBzdHlsZT17e1xuICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjE0ZW1cIixcbiAgICAgICAgY29sb3I6IFwidmFyKC0tc2lsay1nb2xkKVwiLCB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgfX0+XG4gICAgICAgIG5vdXZlYXUgcml0dWVsXG4gICAgICA8L2Rpdj5cblxuICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbWItc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLCBkaXNwbGF5OiBcImJsb2NrXCIgfX0+XG4gICAgICAgIGZvcm1lXG4gICAgICA8L2xhYmVsPlxuICAgICAgPHNlbGVjdFxuICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBtYi1tXCJcbiAgICAgICAgdmFsdWU9e3JpdHVhbFR5cGV9XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0Uml0dWFsVHlwZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiB9fVxuICAgICAgPlxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiY291bmNpbFwiPkNvdW5jaWwgUHJvY2VzcyBcdTIwMTQgdG91ciBkZSBwYXJvbGU8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInRoZW9yeV91XCI+VGhlb3J5IFUgXHUyMDE0IDQgbW91dmVtZW50cyAoc3VzcGVuZGluZyAvIHJlZGlyZWN0aW5nIC8gbGV0dGluZyBnbyAvIGxldHRpbmcgY29tZSk8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImNvdW5jaWxfNF92b2l4XCI+Q291bmNpbCA0IHZvaXggc3VyIHVuIHJcdTAwRUF2ZSAoclx1MDBFQXZldXIgLyBwcm90ZWN0ZXVyIC8gXHUwMEUybWUgLyBvbWJyZSk8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxpZ2h0bmluZ19ncm91cFwiPkxpZ2h0bmluZyBEcmVhbXdvcmsgZ3JvdXBlIFx1MjAxNCBcInNpIGMnXHUwMEU5dGFpdCBtb24gclx1MDBFQXZlXCI8L29wdGlvbj5cbiAgICAgIDwvc2VsZWN0PlxuXG4gICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtYi1zXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsIGRpc3BsYXk6IFwiYmxvY2tcIiB9fT5cbiAgICAgICAgdGl0cmUgKG9wdGlvbm5lbClcbiAgICAgIDwvbGFiZWw+XG4gICAgICA8aW5wdXRcbiAgICAgICAgY2xhc3NOYW1lPVwiZmllbGQtaW5wdXQgbWItbVwiXG4gICAgICAgIHZhbHVlPXt0aXRsZX1cbiAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRUaXRsZShlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIHBsYWNlaG9sZGVyPVwiZXg6ICdsZSBzZXVpbCBkZSBsJ1x1MDBFOXRcdTAwRTknXCJcbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiIH19XG4gICAgICAvPlxuXG4gICAgICA8bGFiZWwgY2xhc3NOYW1lPVwibWV0YSBvcC03MCBtYi1zXCIgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTMsIGRpc3BsYXk6IFwiYmxvY2tcIiB9fT5cbiAgICAgICAgcXVlc3Rpb24gLyBjb250ZXh0ZSAob3B0aW9ubmVsKVxuICAgICAgPC9sYWJlbD5cbiAgICAgIDx0ZXh0YXJlYVxuICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC10ZXh0YXJlYSBtYi1tXCJcbiAgICAgICAgdmFsdWU9e3Byb21wdFNlZWR9XG4gICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UHJvbXB0U2VlZChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgIHBsYWNlaG9sZGVyPVwiY2UgcXVlIGxlIGNlcmNsZSB2aWVudCByZWdhcmRlciBlbnNlbWJsZVx1MjAyNlwiXG4gICAgICAgIHJvd3M9ezN9XG4gICAgICAvPlxuXG4gICAgICB7cmVxdWlyZUthaXJvcyAmJiAoXG4gICAgICAgIDw+XG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cIm1ldGEgb3AtNzAgbWItc1wiIHN0eWxlPXt7IGZvbnRGYW1pbHk6IFwidmFyKC0tc2VyaWYpXCIsIGZvbnRTdHlsZTogXCJpdGFsaWNcIiwgZm9udFNpemU6IDEzLCBkaXNwbGF5OiBcImJsb2NrXCIgfX0+XG4gICAgICAgICAgICBrYWlyb3NfaWQgZHUgclx1MDBFQXZlIGNpYmxlXG4gICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IG1iLW1cIlxuICAgICAgICAgICAgdmFsdWU9e3RhcmdldEthaXJvc0lkfVxuICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRUYXJnZXRLYWlyb3NJZChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cInV1aWQgZHUgclx1MDBFQXZlIHBhcnRhZ1x1MDBFOSBkYW5zIGxlIGNlcmNsZVwiXG4gICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIgfX1cbiAgICAgICAgICAvPlxuICAgICAgICA8Lz5cbiAgICAgICl9XG5cbiAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJtZXRhIG9wLTcwIG1iLXNcIiBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxMywgZGlzcGxheTogXCJibG9ja1wiIH19PlxuICAgICAgICBmZW5cdTAwRUF0cmUgKGhldXJlcywgYXN5bmMpXG4gICAgICA8L2xhYmVsPlxuICAgICAgPGlucHV0XG4gICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLWlucHV0IG1iLW1cIlxuICAgICAgICB0eXBlPVwibnVtYmVyXCJcbiAgICAgICAgbWluPXsxfVxuICAgICAgICBtYXg9ezE2OH1cbiAgICAgICAgdmFsdWU9e3dpbmRvd0hvdXJzfVxuICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFdpbmRvd0hvdXJzKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgc3R5bGU9e3sgd2lkdGg6IDEyMCB9fVxuICAgICAgLz5cblxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhIG1iLW1cIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1lbWJlci1saXZlKVwiLCBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIgfX0+XG4gICAgICAgICAge2Vycm9yfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93IGdhcC1tXCIgc3R5bGU9e3sganVzdGlmeUNvbnRlbnQ6IFwiZmxleC1lbmRcIiB9fT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIGRpc2FibGVkPXtidXN5fSBvbkNsaWNrPXtvbkNhbmNlbH0+YW5udWxlcjwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi1naG9zdFwiIGRpc2FibGVkPXtidXN5fSBvbkNsaWNrPXtjcmVhdGV9PlxuICAgICAgICAgIHtidXN5ID8gXCJcdTIwMjZcIiA6IFwicHJvcG9zZXJcIn1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn07XG5cbmNvbnN0IFJpdHVhbFZpZXcgPSAoeyBjaXJjbGVJZCwgcml0dWFsSWQsIG9uQmFjayB9KSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IGRwUyhudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gZHBTKHRydWUpO1xuICBjb25zdCBbY29udHJpYkRyYWZ0LCBzZXRDb250cmliRHJhZnRdID0gZHBTKFwiXCIpO1xuICBjb25zdCBbY29udHJpYlZvaWNlLCBzZXRDb250cmliVm9pY2VdID0gZHBTKG51bGwpOyAvLyBmb3IgY291bmNpbF80X3ZvaXhcbiAgY29uc3QgW2NvbnRyaWJCdXN5LCBzZXRDb250cmliQnVzeV0gPSBkcFMoZmFsc2UpO1xuICBjb25zdCBbYnVzeSwgc2V0QnVzeV0gPSBkcFMoZmFsc2UpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IGRwUyhudWxsKTtcblxuICBjb25zdCBsb2FkID0gZHBDKGFzeW5jICgpID0+IHtcbiAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByID0gYXdhaXQgX2RwRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9yaXR1YWxzLyR7cml0dWFsSWR9YCk7XG4gICAgICBjb25zdCBkID0gYXdhaXQgci5qc29uKCk7XG4gICAgICBpZiAoZD8uZXJyb3IpIHNldEVycm9yKGQuZXJyb3IpO1xuICAgICAgZWxzZSBzZXREYXRhKGQpO1xuICAgIH0gY2F0Y2ggKGUpIHsgc2V0RXJyb3IoZT8ubWVzc2FnZSB8fCBcImZldGNoIG5vbiBhYm91dGllXCIpOyB9XG4gICAgZmluYWxseSB7IHNldExvYWRpbmcoZmFsc2UpOyB9XG4gIH0sIFtjaXJjbGVJZCwgcml0dWFsSWRdKTtcblxuICBkcEUoKCkgPT4geyBsb2FkKCk7IH0sIFtsb2FkXSk7XG5cbiAgY29uc3Qgam9pbiA9IGFzeW5jICgpID0+IHtcbiAgICBzZXRCdXN5KHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBfZHBGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L3JpdHVhbHMvJHtyaXR1YWxJZH0vam9pbmAsIHsgbWV0aG9kOiBcIlBPU1RcIiwgYm9keTogXCJ7fVwiIH0pO1xuICAgICAgbG9hZCgpO1xuICAgIH0gY2F0Y2ggKGUpIHsgY29uc29sZS53YXJuKFwiW1JpdHVhbFZpZXddIGpvaW4gZmFpbGVkOlwiLCBlPy5tZXNzYWdlKTsgfVxuICAgIGZpbmFsbHkgeyBzZXRCdXN5KGZhbHNlKTsgfVxuICB9O1xuXG4gIGNvbnN0IGFkdmFuY2UgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKCFjb25maXJtKFwicGFzc2VyIFx1MDBFMCBsYSBwaGFzZSBzdWl2YW50ZSA/XCIpKSByZXR1cm47XG4gICAgc2V0QnVzeSh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgX2RwRmV0Y2goYC9hcGkvY2lyY2xlcy8ke2NpcmNsZUlkfS9yaXR1YWxzLyR7cml0dWFsSWR9L2FkdmFuY2VgLCB7IG1ldGhvZDogXCJQT1NUXCIsIGJvZHk6IFwie31cIiB9KTtcbiAgICAgIGxvYWQoKTtcbiAgICB9IGNhdGNoIChlKSB7IGNvbnNvbGUud2FybihcIltSaXR1YWxWaWV3XSBhZHZhbmNlIGZhaWxlZDpcIiwgZT8ubWVzc2FnZSk7IH1cbiAgICBmaW5hbGx5IHsgc2V0QnVzeShmYWxzZSk7IH1cbiAgfTtcblxuICBjb25zdCBjb250cmlidXRlID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHRleHQgPSBjb250cmliRHJhZnQudHJpbSgpO1xuICAgIGlmICghdGV4dCB8fCBjb250cmliQnVzeSkgcmV0dXJuO1xuICAgIHNldENvbnRyaWJCdXN5KHRydWUpOyBzZXRFcnJvcihudWxsKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgYm9keSA9IHsgY29udGVudDogdGV4dCB9O1xuICAgICAgaWYgKGRhdGE/LnJpdHVhbD8ucml0dWFsX3R5cGUgPT09IFwiY291bmNpbF80X3ZvaXhcIiAmJiBjb250cmliVm9pY2UpIHtcbiAgICAgICAgYm9keS52b2ljZV9hdHRyaWJ1dGlvbiA9IGNvbnRyaWJWb2ljZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHIgPSBhd2FpdCBfZHBGZXRjaChgL2FwaS9jaXJjbGVzLyR7Y2lyY2xlSWR9L3JpdHVhbHMvJHtyaXR1YWxJZH0vY29udHJpYnV0ZWAsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIiwgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGQgPSBhd2FpdCByLmpzb24oKTtcbiAgICAgIGlmIChkPy5lcnJvcikgc2V0RXJyb3IoZC5lcnJvcik7XG4gICAgICBlbHNlIHsgc2V0Q29udHJpYkRyYWZ0KFwiXCIpOyBsb2FkKCk7IH1cbiAgICB9IGNhdGNoIChlKSB7IHNldEVycm9yKGU/Lm1lc3NhZ2UgfHwgXCJjb250cmlidXRpb24gbm9uIGFib3V0aWVcIik7IH1cbiAgICBmaW5hbGx5IHsgc2V0Q29udHJpYkJ1c3koZmFsc2UpOyB9XG4gIH07XG5cbiAgaWYgKGxvYWRpbmcpIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEgb3AtNzBcIj5jaGFyZ2VtZW50IGR1IHJpdHVlbFx1MjAyNjwvZGl2PjtcbiAgaWYgKCFkYXRhPy5yaXR1YWwpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbVwiPlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJzZXVpbC1pdGFsaWNcIiBzdHlsZT17eyBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIgfX0+XG4gICAgICAgICAgcml0dWVsIGludHJvdXZhYmxlLlxuICAgICAgICA8L3A+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLXRleHRcIiBvbkNsaWNrPXtvbkJhY2t9Plx1MjE5MCByZXRvdXI8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb25zdCByID0gZGF0YS5yaXR1YWw7XG4gIGNvbnN0IHBoYXNlc0RlZiA9IChyLm1ldGFkYXRhPy5waGFzZXMgfHwgW10pLmZpbHRlcigocCkgPT4gcCAhPT0gXCJvcGVuXCIgJiYgcCAhPT0gXCJjbG9zZWRcIiAmJiBwICE9PSBcImFyY2hpdmVkXCIpO1xuICBjb25zdCBjbG9zZWQgPSBbXCJhcmNoaXZlZFwiLCBcImNsb3NlZFwiXS5pbmNsdWRlcyhyLmN1cnJlbnRfcGhhc2UpO1xuICBjb25zdCBjdXJyZW50UGhhc2VEZWYgPSAod2luZG93LkNJUkNMRV9SSVRVQUxfUEhBU0VfREVGUyAmJiB3aW5kb3cuQ0lSQ0xFX1JJVFVBTF9QSEFTRV9ERUZTW3Iucml0dWFsX3R5cGVdIHx8IFtdKVxuICAgIC5maW5kKChwKSA9PiBwLnBoYXNlID09PSByLmN1cnJlbnRfcGhhc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJzdGFjayBnYXAtbVwiPlxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tdGV4dFwiIG9uQ2xpY2s9e29uQmFja30+XHUyMTkwIHJldG91ciBhdXggcml0dWVsczwvYnV0dG9uPlxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIiBzdHlsZT17e1xuICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNCkgdmFyKC0tcy00KVwiLFxuICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSA0JSwgdmFyKC0tbmlnaHQtZmxvb3IpKVwiLFxuICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIGNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc2lsay1nb2xkKSAxOCUsIHZhcigtLWFzaC1kZWVwKSlcIixcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAwLFxuICAgICAgfX0+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWV0YS1tb25vIG1iLXNcIiBzdHlsZT17e1xuICAgICAgICAgIGZvbnRGYW1pbHk6IFwidmFyKC0tbW9ubylcIiwgZm9udFNpemU6IDEwLCBsZXR0ZXJTcGFjaW5nOiBcIjAuMTRlbVwiLFxuICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgfX0+XG4gICAgICAgICAge1JJVFVBTF9MQUJFTFNbci5yaXR1YWxfdHlwZV0gfHwgci5yaXR1YWxfdHlwZX0gXHUwMEI3IHBoYXNlIHtyLmN1cnJlbnRfcGhhc2V9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwiaDItc2V1aWwgbWItc1wiPntyLnRpdGxlIHx8IFwiKHJpdHVlbCBzYW5zIHRpdHJlKVwifTwvaDI+XG4gICAgICAgIHtyLnByb21wdF9zZWVkICYmIChcbiAgICAgICAgICA8cCBzdHlsZT17eyBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSwgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiIH19PlxuICAgICAgICAgICAge3IucHJvbXB0X3NlZWR9XG4gICAgICAgICAgPC9wPlxuICAgICAgICApfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtdC1tIG9wLTcwXCIgc3R5bGU9e3tcbiAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcbiAgICAgICAgICBjb2xvcjogXCJ2YXIoLS1hc2gtbGlnaHQpXCIsIHRleHRUcmFuc2Zvcm06IFwidXBwZXJjYXNlXCIsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtkYXRhLnBhcnRpY2lwYW50X2NvdW50fSBwYXJ0aWNpcGFudHMgXHUwMEI3IGZlblx1MDBFQXRyZSB7ci53aW5kb3dfaG91cnN9aFxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICB7LyogUGhhc2UgdHJhY2tlciAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgc3R5bGU9e3sgZ2FwOiA2LCBmbGV4V3JhcDogXCJ3cmFwXCIgfX0+XG4gICAgICAgIHtwaGFzZXNEZWYubWFwKChwLCBpKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFzc2VkID0gcGhhc2VzRGVmLmluZGV4T2Yoci5jdXJyZW50X3BoYXNlKSA+IGk7XG4gICAgICAgICAgY29uc3QgaGVyZSA9IHIuY3VycmVudF9waGFzZSA9PT0gcDtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtwfSBjbGFzc05hbWU9XCJtZXRhLW1vbm9cIiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjFlbVwiLFxuICAgICAgICAgICAgICBjb2xvcjogaGVyZSA/IFwidmFyKC0tc2lsay1nb2xkKVwiIDogcGFzc2VkID8gXCJ2YXIoLS1hc2gtbGlnaHQpXCIgOiBcInZhcigtLWFzaC1kZWVwKVwiLFxuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiBcInVwcGVyY2FzZVwiLFxuICAgICAgICAgICAgICBib3JkZXI6IGhlcmUgPyBcIjFweCBzb2xpZCB2YXIoLS1zaWxrLWdvbGQpXCIgOiBcIjFweCBzb2xpZCB2YXIoLS1hc2gtZGVlcClcIixcbiAgICAgICAgICAgICAgcGFkZGluZzogXCIycHggOHB4XCIsXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge3B9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cblxuICAgICAge2N1cnJlbnRQaGFzZURlZiAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiIHN0eWxlPXt7XG4gICAgICAgICAgcGFkZGluZzogXCJ2YXIoLS1zLTMpIHZhcigtLXMtNClcIixcbiAgICAgICAgICBiYWNrZ3JvdW5kOiBcImNvbG9yLW1peChpbiBva2xjaCwgdmFyKC0tc3RvbmUtY29vbCkgNSUsIHRyYW5zcGFyZW50KVwiLFxuICAgICAgICAgIGJvcmRlcjogXCIxcHggc29saWQgdmFyKC0tYXNoLWRlZXApXCIsIGJvcmRlclJhZGl1czogMCxcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhLW1vbm8gbWItc1wiIHN0eWxlPXt7XG4gICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLW1vbm8pXCIsIGZvbnRTaXplOiAxMCwgbGV0dGVyU3BhY2luZzogXCIwLjEyZW1cIixcbiAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLXNpbGstZ29sZClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtjdXJyZW50UGhhc2VEZWYudGl0bGV9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPHAgc3R5bGU9e3sgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiLCBmb250U2l6ZTogMTUsIGNvbG9yOiBcInZhcigtLWJvbmUpXCIgfX0+XG4gICAgICAgICAgICB7Y3VycmVudFBoYXNlRGVmLnByb21wdH1cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cblxuICAgICAgey8qIENvbnRyaWJ1dGlvbnMgbGlzdCAqL31cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RhY2sgZ2FwLXNcIj5cbiAgICAgICAgeyhkYXRhLmNvbnRyaWJ1dGlvbnMgfHwgW10pLm1hcCgoYykgPT4gKFxuICAgICAgICAgIDxkaXYga2V5PXtjLmlkfSBjbGFzc05hbWU9XCJjYXJkXCIgc3R5bGU9e3tcbiAgICAgICAgICAgIHBhZGRpbmc6IFwidmFyKC0tcy0zKSB2YXIoLS1zLTQpXCIsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLCBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1ldGEtbW9ubyBtYi1zXCIgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZm9udEZhbWlseTogXCJ2YXIoLS1tb25vKVwiLCBmb250U2l6ZTogMTAsIGxldHRlclNwYWNpbmc6IFwiMC4xMmVtXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcInZhcigtLWFzaC1saWdodClcIiwgdGV4dFRyYW5zZm9ybTogXCJ1cHBlcmNhc2VcIixcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7Yy52b2ljZV9hdHRyaWJ1dGlvbiB8fCBjLnBoYXNlfSBcdTAwQjcge19kcFJlbChjLmNyZWF0ZWRfYXQpfVxuICAgICAgICAgICAgICB7Yy5pc192b2ljZSAmJiA8c3BhbiBzdHlsZT17eyBtYXJnaW5MZWZ0OiA4LCBjb2xvcjogXCJ2YXIoLS1zaWxrLWdvbGQpXCIgfX0+XHVEODNDXHVERjk5IHtfZHBEdXIoYy52b2ljZV9kdXJhdGlvbl9tcyl9PC9zcGFuPn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBmb250RmFtaWx5OiBcInZhcigtLXNlcmlmKVwiLCBmb250U3R5bGU6IFwiaXRhbGljXCIsIGZvbnRTaXplOiAxNSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMS41NSwgY29sb3I6IFwidmFyKC0tYm9uZSlcIiwgd2hpdGVTcGFjZTogXCJwcmUtd3JhcFwiLFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjLmNvbnRlbnR9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKSl9XG4gICAgICA8L2Rpdj5cblxuICAgICAge2Vycm9yICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZXRhXCIgc3R5bGU9e3sgY29sb3I6IFwidmFyKC0tZW1iZXItbGl2ZSlcIiwgZm9udEZhbWlseTogXCJ2YXIoLS1zZXJpZilcIiwgZm9udFN0eWxlOiBcIml0YWxpY1wiIH19PlxuICAgICAgICAgIHtlcnJvcn1cbiAgICAgICAgPC9kaXY+XG4gICAgICApfVxuXG4gICAgICB7IWRhdGEuaV9qb2luZWQgJiYgIWNsb3NlZCAmJiAoXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuLWdob3N0IG10LW1cIiBkaXNhYmxlZD17YnVzeX0gb25DbGljaz17am9pbn0+cmVqb2luZHJlIGxlIHJpdHVlbDwvYnV0dG9uPlxuICAgICAgKX1cblxuICAgICAge2RhdGEuaV9qb2luZWQgJiYgIWNsb3NlZCAmJiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBtdC1tXCIgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiBcInZhcigtLXMtNClcIiwgYmFja2dyb3VuZDogXCJjb2xvci1taXgoaW4gb2tsY2gsIHZhcigtLXN0b25lLWNvb2wpIDQlLCB0cmFuc3BhcmVudClcIixcbiAgICAgICAgICBib3JkZXI6IFwiMXB4IHNvbGlkIHZhcigtLWFzaC1kZWVwKVwiLCBib3JkZXJSYWRpdXM6IDAsXG4gICAgICAgIH19PlxuICAgICAgICAgIHtyLnJpdHVhbF90eXBlID09PSBcImNvdW5jaWxfNF92b2l4XCIgJiYgKFxuICAgICAgICAgICAgPHNlbGVjdFxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmaWVsZC1pbnB1dCBtYi1zXCJcbiAgICAgICAgICAgICAgdmFsdWU9e2NvbnRyaWJWb2ljZSB8fCBcIlwifVxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENvbnRyaWJWb2ljZShlLnRhcmdldC52YWx1ZSB8fCBudWxsKX1cbiAgICAgICAgICAgICAgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj5cdTIwMTQgdm9peCAob3B0aW9ubmVsKSBcdTIwMTQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImRyZWFtZXJcIj52b2l4IGR1IHJcdTAwRUF2ZXVyPC9vcHRpb24+XG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJwcm90ZWN0b3JcIj52b2l4IGR1IHByb3RlY3RldXI8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNvdWxcIj52b2l4IGRlIGwnXHUwMEUybWU8L29wdGlvbj5cbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInNoYWRvd1wiPnZvaXggZGUgbCdvbWJyZTwvb3B0aW9uPlxuICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgKX1cbiAgICAgICAgICA8dGV4dGFyZWFcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZpZWxkLXRleHRhcmVhIG1iLXNcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ0YSBjb250cmlidXRpb24gXHUwMEUwIGNldHRlIHBoYXNlXHUyMDI2XCJcbiAgICAgICAgICAgIHZhbHVlPXtjb250cmliRHJhZnR9XG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldENvbnRyaWJEcmFmdChlLnRhcmdldC52YWx1ZSl9XG4gICAgICAgICAgICByb3dzPXs0fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3cgZ2FwLW1cIiBzdHlsZT17eyBqdXN0aWZ5Q29udGVudDogXCJmbGV4LWVuZFwiIH19PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIiBkaXNhYmxlZD17Y29udHJpYkJ1c3kgfHwgIWNvbnRyaWJEcmFmdC50cmltKCl9IG9uQ2xpY2s9e2NvbnRyaWJ1dGV9PlxuICAgICAgICAgICAgICB7Y29udHJpYkJ1c3kgPyBcIlx1MjAyNlwiIDogXCJkXHUwMEU5cG9zZXJcIn1cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG5cbiAgICAgIHtkYXRhLmlfam9pbmVkICYmICFjbG9zZWQgJiYgKFxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0bi10ZXh0IG10LW1cIiBkaXNhYmxlZD17YnVzeX0gb25DbGljaz17YWR2YW5jZX0gc3R5bGU9e3sgYWxpZ25TZWxmOiBcImZsZXgtc3RhcnRcIiB9fT5cbiAgICAgICAgICBcdTIxOTIgZmFpcmUgYXZhbmNlciBcdTAwRTAgbGEgcGhhc2Ugc3VpdmFudGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICApfVxuICAgIDwvZGl2PlxuICApO1xufTtcblxuLy8gXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXHUyNTUwXG4vLyBDLjkgXHUyMDE0IFZvaWNlIGNvbXBvc2VyIChyXHUwMEU5dXRpbGlzYWJsZSBkZXB1aXMgVGFiQ2hhdCBwYXRjaFx1MDBFOSBpbi1wbGFjZSlcbi8vIFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFx1MjU1MFxuY29uc3QgQ2hhdFZvaWNlTWljQnV0dG9uID0gKHsgb25UcmFuc2NyaWJlZCwgZGlzYWJsZWQgfSkgPT4ge1xuICBjb25zdCByZWNSZWYgPSBkcFIobnVsbCk7XG4gIGNvbnN0IHN0cmVhbVJlZiA9IGRwUihudWxsKTtcbiAgY29uc3QgY2h1bmtzUmVmID0gZHBSKFtdKTtcbiAgY29uc3Qgc3RhcnRlZEF0UmVmID0gZHBSKDApO1xuICBjb25zdCBbcmVjb3JkaW5nLCBzZXRSZWNvcmRpbmddID0gZHBTKGZhbHNlKTtcbiAgY29uc3QgW3RyYW5zY3JpYmluZywgc2V0VHJhbnNjcmliaW5nXSA9IGRwUyhmYWxzZSk7XG5cbiAgY29uc3Qgc3RhcnQgPSBhc3luYyAoKSA9PiB7XG4gICAgaWYgKHJlY1JlZi5jdXJyZW50IHx8IGRpc2FibGVkKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGF3YWl0IG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHsgYXVkaW86IHRydWUgfSk7XG4gICAgICBzdHJlYW1SZWYuY3VycmVudCA9IHN0cmVhbTtcbiAgICAgIGNodW5rc1JlZi5jdXJyZW50ID0gW107XG4gICAgICBjb25zdCBtaW1lID0gTWVkaWFSZWNvcmRlci5pc1R5cGVTdXBwb3J0ZWQoXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXCIpXG4gICAgICAgID8gXCJhdWRpby93ZWJtO2NvZGVjcz1vcHVzXCJcbiAgICAgICAgOiBNZWRpYVJlY29yZGVyLmlzVHlwZVN1cHBvcnRlZChcImF1ZGlvL21wNFwiKSA/IFwiYXVkaW8vbXA0XCIgOiBcImF1ZGlvL3dlYm1cIjtcbiAgICAgIGNvbnN0IHJlYyA9IG5ldyBNZWRpYVJlY29yZGVyKHN0cmVhbSwgeyBtaW1lVHlwZTogbWltZSB9KTtcbiAgICAgIHJlYy5vbmRhdGFhdmFpbGFibGUgPSAoZSkgPT4geyBpZiAoZS5kYXRhLnNpemUgPiAwKSBjaHVua3NSZWYuY3VycmVudC5wdXNoKGUuZGF0YSk7IH07XG4gICAgICByZWMuc3RhcnQoMjUwKTtcbiAgICAgIHJlY1JlZi5jdXJyZW50ID0gcmVjO1xuICAgICAgc3RhcnRlZEF0UmVmLmN1cnJlbnQgPSBEYXRlLm5vdygpO1xuICAgICAgc2V0UmVjb3JkaW5nKHRydWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIltDaGF0Vm9pY2VNaWNdIG1pYyBkZW5pZWQ6XCIsIGUubWVzc2FnZSk7XG4gICAgICBhbGVydChcIlBlcm1pc3Npb24gbWljcm8gcmVmdXNcdTAwRTllLiBBY3RpdmUtbGEgZGFucyB0b24gbmF2aWdhdGV1ci5cIik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcmVjID0gcmVjUmVmLmN1cnJlbnQ7XG4gICAgY29uc3Qgc3RyZWFtID0gc3RyZWFtUmVmLmN1cnJlbnQ7XG4gICAgaWYgKCFyZWMpIHJldHVybjtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIHJlYy5vbnN0b3AgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHN0cmVhbSkgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2goKHQpID0+IHQuc3RvcCgpKTtcbiAgICAgICAgICBzdHJlYW1SZWYuY3VycmVudCA9IG51bGw7XG4gICAgICAgICAgcmVjUmVmLmN1cnJlbnQgPSBudWxsO1xuICAgICAgICAgIHNldFJlY29yZGluZyhmYWxzZSk7XG4gICAgICAgICAgY29uc3QgZHVyID0gRGF0ZS5ub3coKSAtIHN0YXJ0ZWRBdFJlZi5jdXJyZW50O1xuICAgICAgICAgIGlmIChjaHVua3NSZWYuY3VycmVudC5sZW5ndGggPT09IDApIHsgcmVzb2x2ZSgpOyByZXR1cm47IH1cbiAgICAgICAgICBjb25zdCBibG9iID0gbmV3IEJsb2IoY2h1bmtzUmVmLmN1cnJlbnQsIHsgdHlwZTogcmVjLm1pbWVUeXBlIHx8IFwiYXVkaW8vd2VibVwiIH0pO1xuICAgICAgICAgIGNodW5rc1JlZi5jdXJyZW50ID0gW107XG4gICAgICAgICAgaWYgKGJsb2Iuc2l6ZSA8IDUwMCkgeyByZXNvbHZlKCk7IHJldHVybjsgfVxuXG4gICAgICAgICAgc2V0VHJhbnNjcmliaW5nKHRydWUpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0IHdpbmRvdy5EcmVhbUF1dGg/LmdldEFjY2Vzc1Rva2VuPy4oKTtcbiAgICAgICAgICAgIGNvbnN0IGZkID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgICAgICAgICBmZC5hcHBlbmQoXCJhdWRpb1wiLCBuZXcgRmlsZShbYmxvYl0sIFwidm9pY2Uud2VibVwiLCB7IHR5cGU6IGJsb2IudHlwZSB9KSk7XG4gICAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcIi9hcGkvdHJhbnNjcmliZVwiLCB7XG4gICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgIGhlYWRlcnM6IHRva2VuID8geyBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHRva2VuIH0gOiB7fSxcbiAgICAgICAgICAgICAgYm9keTogZmQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJ0cmFuc2NyaWJlIFwiICsgcmVzLnN0YXR1cyk7XG4gICAgICAgICAgICBjb25zdCBqc29uID0gYXdhaXQgcmVzLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zY3JpcHQgPSAoanNvbi50ZXh0IHx8IGpzb24udHJhbnNjcmlwdCB8fCBcIlwiKS50cmltKCk7XG4gICAgICAgICAgICBpZiAodHJhbnNjcmlwdCkgb25UcmFuc2NyaWJlZD8uKHsgdHJhbnNjcmlwdCwgZHVyYXRpb25fbXM6IGR1ciwgbGFuZzoganNvbi5sYW5ndWFnZSB8fCBudWxsIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltDaGF0Vm9pY2VNaWNdIHRyYW5zY3JpYmUgZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgYWxlcnQoXCJUcmFuc2NyaXB0aW9uIFx1MDBFOWNob3VcdTAwRTllLiBSXHUwMEU5ZXNzYWllIG91IHRhcGUgYXUgY2xhdmllci5cIik7XG4gICAgICAgICAgfSBmaW5hbGx5IHsgc2V0VHJhbnNjcmliaW5nKGZhbHNlKTsgcmVzb2x2ZSgpOyB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJbQ2hhdFZvaWNlTWljXSBzdG9wIGZhaWw6XCIsIGUubWVzc2FnZSk7IHJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIHJlYy5zdG9wKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8YnV0dG9uXG4gICAgICBjbGFzc05hbWU9XCJidG4tZ2hvc3RcIlxuICAgICAgb25Nb3VzZURvd249e3N0YXJ0fVxuICAgICAgb25Nb3VzZVVwPXtzdG9wfVxuICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiB7IGlmIChyZWNSZWYuY3VycmVudCkgc3RvcCgpOyB9fVxuICAgICAgb25Ub3VjaFN0YXJ0PXsoZSkgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IHN0YXJ0KCk7IH19XG4gICAgICBvblRvdWNoRW5kPXsoZSkgPT4geyBlLnByZXZlbnREZWZhdWx0KCk7IHN0b3AoKTsgfX1cbiAgICAgIGRpc2FibGVkPXtkaXNhYmxlZCB8fCB0cmFuc2NyaWJpbmd9XG4gICAgICB0aXRsZT17cmVjb3JkaW5nID8gXCJsXHUwMEUyY2hlciBwb3VyIGVudm95ZXJcIiA6IHRyYW5zY3JpYmluZyA/IFwidHJhbnNjcmlwdGlvblx1MjAyNlwiIDogXCJ0ZW5pciBwb3VyIHBhcmxlclwifVxuICAgICAgc3R5bGU9e3tcbiAgICAgICAgbWluV2lkdGg6IDQ0LCBwYWRkaW5nOiBcIjhweCAxMHB4XCIsXG4gICAgICAgIGJvcmRlckNvbG9yOiByZWNvcmRpbmcgPyBcInZhcigtLXNpbGstZ29sZClcIiA6IFwidmFyKC0tYXNoLWRlZXApXCIsXG4gICAgICAgIGNvbG9yOiByZWNvcmRpbmcgPyBcInZhcigtLXNpbGstZ29sZClcIiA6IFwidmFyKC0tYXNoLWxpZ2h0KVwiLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7dHJhbnNjcmliaW5nID8gXCJcdTIwMjZcIiA6IHJlY29yZGluZyA/IFwiXHUyNUNGIHJlY1wiIDogXCJcdUQ4M0NcdURGOTlcIn1cbiAgICA8L2J1dHRvbj5cbiAgKTtcbn07XG5cbi8vIFx1MjUwMFx1MjUwMCBQaGFzZSBkZWZpbml0aW9ucyBleHBvc1x1MDBFOWVzIFx1MDBFMCB3aW5kb3cgcG91ciBSaXR1YWxWaWV3IFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxud2luZG93LkNJUkNMRV9SSVRVQUxfUEhBU0VfREVGUyA9IHtcbiAgY291bmNpbDogW1xuICAgIHsgcGhhc2U6ICdwaGFzZV8xJywgdGl0bGU6ICdUb3VyIGRlIHBhcm9sZScsIHByb21wdDogXCJDaGFjdW5cdTAwQjdlIHByZW5kIGxhIHBhcm9sZSBcdTAwRTAgc29uIHRvdXIuIFBhcyBkZSByXHUwMEU5cG9uc2UgYXV4IGF1dHJlcyBcdTIwMTQgb24gZFx1MDBFOXBvc2UsIG9uIFx1MDBFOWNvdXRlIGVuIHNpbGVuY2UgY2UgcXVlIGxlcyBhdXRyZXMgZFx1MDBFOXBvc2VudC4gT24gcGV1dCBwYXNzZXIgc29uIHRvdXIuXCIgfSxcbiAgXSxcbiAgdGhlb3J5X3U6IFtcbiAgICB7IHBoYXNlOiAncGhhc2VfMScsIHRpdGxlOiAnU3VzcGVuZGluZyBcdTIwMTQgdm9pciBhdmVjIGRlcyB5ZXV4IG5vdXZlYXV4JywgcHJvbXB0OiAnUXVlbCBqdWdlbWVudCB0aWVucy10dSBzdXIgY2UgcXVpIHNlIHBhc3NlID8gTWV0cy1sZSBcdTAwRTAgZGlzdGFuY2UuIERcdTAwRTljcmlzIGxhIHNpdHVhdGlvbiBjb21tZSBzaSB0dSBsYSB2b3lhaXMgcG91ciBsYSBwcmVtaVx1MDBFOHJlIGZvaXMuJyB9LFxuICAgIHsgcGhhc2U6ICdwaGFzZV8yJywgdGl0bGU6ICdSZWRpcmVjdGluZyBcdTIwMTQgdm9pciBkZXB1aXMgbGUgdG91dCcsIHByb21wdDogXCJTaSB0dSB0ZSBkXHUwMEU5cGxhY2VzIGQndW4gY3JhbiwgdmVycyBsZSB0b3V0IGR1IHN5c3RcdTAwRThtZSwgcXUnZXN0LWNlIHF1ZSB0dSB2b2lzID8gUXVlbCByXHUwMEY0bGUgam91ZSBsZSBjZXJjbGUgZGFucyBjZWxhID9cIiB9LFxuICAgIHsgcGhhc2U6ICdwaGFzZV8zJywgdGl0bGU6ICdMZXR0aW5nIGdvIFx1MjAxNCBsYWlzc2VyIHRvbWJlciBsZSBjb250clx1MDBGNGxlJywgcHJvbXB0OiBcIlF1J2VzdC1jZSBxdWkgdm91ZHJhaXQgcydlbiBhbGxlciA/IFF1ZWxsZSB2aWVpbGxlIGZvcm1lIGRlbWFuZGUgXHUwMEUwIG1vdXJpciA/XCIgfSxcbiAgICB7IHBoYXNlOiAncGhhc2VfNCcsIHRpdGxlOiAnTGV0dGluZyBjb21lIFx1MjAxNCBsYWlzc2VyIFx1MDBFOW1lcmdlcicsIHByb21wdDogJ1F1XFwnZXN0LWNlIHF1aSB2b3VkcmFpdCBhZHZlbmlyIHNpIG9uIGZhaXNhaXQgc2lsZW5jZSA/IFF1ZWxsZSBxdWVzdGlvbiwgcXVlbGxlIGltYWdlLCBxdWVsIGFjdGUgPycgfSxcbiAgXSxcbiAgY291bmNpbF80X3ZvaXg6IFtcbiAgICB7IHBoYXNlOiAncGhhc2VfMScsIHRpdGxlOiAnVm9peCBkdSByXHUwMEVBdmV1cicsIHByb21wdDogJ0RcdTAwRTljcmlzIGxlIHJcdTAwRUF2ZSBjb21tZSB0dSBsXFwnYXMgdlx1MDBFOWN1LCBcdTAwRTAgbGEgcHJlbWlcdTAwRThyZSBwZXJzb25uZS4gUXVcXCdlc3QtY2UgcXVpIHNcXCdlc3QgcGFzc1x1MDBFOSBwb3VyIHRvaSA/JyB9LFxuICAgIHsgcGhhc2U6ICdwaGFzZV8yJywgdGl0bGU6ICdWb2l4IGR1IHByb3RlY3RldXInLCBwcm9tcHQ6IFwiUXVlbHF1ZSBjaG9zZSBkYW5zIGxlIHJcdTAwRUF2ZSBwcm90XHUwMEU4Z2UuIFF1ZSBkaXJhaXQtZWxsZSwgY2V0dGUgcGFydCBxdWkgdmVpbGxlID9cIiB9LFxuICAgIHsgcGhhc2U6ICdwaGFzZV8zJywgdGl0bGU6ICdWb2l4IGRlIGxcXCdcdTAwRTJtZScsIHByb21wdDogXCJTaSBsJ1x1MDBFMm1lIGR1IHJcdTAwRUF2ZSBhdmFpdCB1bmUgcGFyb2xlIFx1MjAxNCBwYXMgdW5lIGV4cGxpY2F0aW9uLCB1bmUgcGFyb2xlIFx1MjAxNCBxdWVsbGUgc2VyYWl0LWVsbGUgP1wiIH0sXG4gICAgeyBwaGFzZTogJ3BoYXNlXzQnLCB0aXRsZTogXCJWb2l4IGRlIGwnb21icmVcIiwgcHJvbXB0OiBcIkNlIHF1aSBuJ2EgcGFzIFx1MDBFOXRcdTAwRTkgZGl0LCBjZSBxdWkgYSBcdTAwRTl0XHUwMEU5IHJlZnVzXHUwMEU5LCBjZSBxdWkgclx1MDBFOXNpc3RlIFx1MDBFMCBcdTAwRUF0cmUgbm9tbVx1MDBFOSBcdTIwMTQgcXVlIGRpdCBjZWxhID9cIiB9LFxuICBdLFxuICBsaWdodG5pbmdfZ3JvdXA6IFtcbiAgICB7IHBoYXNlOiAncGhhc2VfMScsIHRpdGxlOiAnTGUgclx1MDBFQXZlIGRcdTAwRTlwb3NcdTAwRTknLCBwcm9tcHQ6ICdMZSByXHUwMEVBdmV1ciBwYXJ0YWdlIGxlIHJcdTAwRUF2ZSBcdTAwRTAgdm9peCBudWUuIFBhcyBkXFwnYW5hbHlzZSwgcGFzIGRlIGNvbW1lbnRhaXJlLiBKdXN0ZSBsZXMgaW1hZ2VzLCBsZXMgZmlndXJlcywgbGVzIHNlbnNhdGlvbnMuJyB9LFxuICAgIHsgcGhhc2U6ICdwaGFzZV8yJywgdGl0bGU6ICdTaSBjXFwnXHUwMEU5dGFpdCBtb24gclx1MDBFQXZlJywgcHJvbXB0OiAnXCJTaSBjXFwnXHUwMEU5dGFpdCBtb24gclx1MDBFQXZlXHUyMDI2XCIgXHUyMDE0IGNoYXF1ZSBhdXRyZSBtZW1icmUgcHJlbmQgbGUgclx1MDBFQXZlIGNvbW1lIHNcXCdpbCBcdTAwRTl0YWl0IGxlIHNpZW4gZXQgZGl0IGNlIHF1XFwnaWwgeSB0cm91dmVyYWl0LiBQYXMgZGUgXCJ0dSBkZXZyYWlzXCIsIHVuaXF1ZW1lbnQgXCJtb2kgamVcIi4nIH0sXG4gICAgeyBwaGFzZTogJ3BoYXNlXzMnLCB0aXRsZTogJ0xlIHJcdTAwRUF2ZXVyIHJlcHJlbmQnLCBwcm9tcHQ6ICdMZSByXHUwMEVBdmV1ciBkaXQgY2UgcXVcXCdpbCBnYXJkZSBcdTIwMTQgcGFzIHBhciBwb2xpdGVzc2UsIHBhciByXHUwMEU5c29uYW5jZS4gRXQgcGV1dC1cdTAwRUF0cmUgdW4gYWN0ZSBxdWkgaG9ub3JlIGxlIHJcdTAwRUF2ZS4nIH0sXG4gIF0sXG59O1xuXG5PYmplY3QuYXNzaWduKHdpbmRvdywge1xuICBUYWJTeW5jaHJvbmljaXRlcyxcbiAgVGFiTWV0ZW8sXG4gIFRhYkFubmFsZXMsXG4gIFRhYlJpdHVlbHMsXG4gIENoYXRWb2ljZU1pY0J1dHRvbixcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIkFBd0JBLE1BQU0sRUFBRSxVQUFVLEtBQUssV0FBVyxLQUFLLFNBQVMsS0FBSyxRQUFRLEtBQUssYUFBYSxJQUFJLElBQUk7QUFHdkYsU0FBUyxPQUFPLEtBQUs7QUEzQnJCO0FBNEJFLE1BQUksQ0FBQyxJQUFLLFFBQU87QUFDakIsTUFBSTtBQUFFLGFBQU8sa0JBQU8sYUFBUCxtQkFBaUIsa0JBQWpCLDRCQUFpQyxTQUFRO0FBQUEsRUFBYSxTQUFRO0FBQUUsV0FBTztBQUFBLEVBQWE7QUFDbkc7QUFF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
