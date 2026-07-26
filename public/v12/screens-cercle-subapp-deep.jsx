/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — CercleSubApp DEEP (refonte profonde 2026-04-28 — Yeshua)
//
// Spec : 2_DESIGN.md §11.bis.20.11 — Cercle communautaire RICHE
//        Tim 2026-04-28 — "fonctions CERCLE RICHES, vraie expérience vivante"
//
// Étend la sous-app Cercle de 5 onglets → 9 onglets :
//   1. Membres        (legacy)
//   2. Dépôts         (legacy)
//   3. Chat cercle    (legacy + voice messages C.9 ajoutés inline)
//   4. Portrait       (legacy)
//   5. Intentions     (legacy)
//   6. Synchronicités — NEW C.5 (motifs croisés ≥3 membres / 7j)
//   7. Météo          — NEW C.6 (vue agrégée 30j sobre, Haiku)
//   8. Annales        — NEW C.7 (archive shared_clear + tale_marquant)
//   9. Rituels        — NEW C.8 (Council / Theory U / 4 voix Aizenstat / Lightning)
//
// Et (C.9) : voice messages dans Chat cercle → patché in-place dans TabChat existant
//
// Architecture : on EXPOSE chaque nouveau composant sur window.* puis le wrapper
// CercleSubApp (screens-cercle-subapp.jsx) les pioche si présents.
// ──────────────────────────────────────────────────────────────

const { useState: dpS, useEffect: dpE, useMemo: dpM, useRef: dpR, useCallback: dpC } = React;

// ── Helpers partagés ──────────────────────────────────────────
function _dpRel(iso) {
  if (!iso) return "récemment";
  try { return window.DreamAPI?._relativeWhen?.(iso) || "récemment"; } catch { return "récemment"; }
}

async function _dpFetch(url, opts = {}) {
  let headers = { ...(opts.headers || {}) };
  try {
    const sess = window.DreamAuth?.getSession?.();
    const token = sess?.access_token;
    if (token) headers["Authorization"] = "Bearer " + token;
  } catch {}
  if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(url, { ...opts, headers });
}

function _dpDur(ms) {
  if (!ms || ms < 0) return "";
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m${String(r).padStart(2, "0")}s` : `${s}s`;
}

// ════════════════════════════════════════════════════════════════════
// C.5 — TabSynchronicites
// ════════════════════════════════════════════════════════════════════
const TabSynchronicites = ({ circleId }) => {
  const [items, setItems] = dpS([]);
  const [loading, setLoading] = dpS(true);
  const [error, setError] = dpS(null);
  const [openMotif, setOpenMotif] = dpS(null);   // motif courant pour lecture poly
  const [reading, setReading] = dpS(null);        // résultat 3 voix
  const [readingBusy, setReadingBusy] = dpS(false);

  const load = dpC(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/synchronicities`);
      const data = await r.json();
      if (data?.error) setError(data.error);
      else setItems(data.synchronicities || []);
    } catch (e) {
      setError(e?.message || "fetch non aboutie");
    } finally { setLoading(false); }
  }, [circleId]);

  dpE(() => { load(); }, [load]);

  const askReading = async (item) => {
    setOpenMotif(item.motif);
    setReading(null);
    setReadingBusy(true);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/synchronicities`, {
        method: "POST",
        body: JSON.stringify({ motif: item.motif, kind: item.kind }),
      });
      const data = await r.json();
      if (data?.error) setError(data.error);
      else setReading(data);
    } catch (e) {
      setError(e?.message || "lecture non aboutie");
    } finally { setReadingBusy(false); }
  };

  return (
    <div className="stack gap-m">
      <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}>
        ce que plusieurs voix du cercle déposent en commun cette semaine. on parle de motifs, de figures, de patterns — pas de personnes. au moins 3 voix, sur 7 jours.
      </p>

      {loading && <div className="meta op-70">détection en cours…</div>}
      {error && (
        <div className="meta" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {error}
        </div>
      )}
      {!loading && items.length === 0 && (
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          rien ne traverse encore le cercle au-dessus du seuil. il faut au moins trois voix sur un même motif.
        </p>
      )}

      <div className="stack gap-s">
        {items.map((it, i) => (
          <SyncRow
            key={it.motif + ":" + it.kind + ":" + i}
            item={it}
            onAsk={() => askReading(it)}
            isActive={openMotif === it.motif}
          />
        ))}
      </div>

      {openMotif && (
        <div className="card mt-l" style={{
          padding: "var(--s-4) var(--s-4)",
          background: "color-mix(in oklch, var(--silk-gold) 4%, var(--night-floor))",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
          borderRadius: 0,
        }}>
          <div className="meta-mono mb-s" style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
            color: "var(--silk-gold)", textTransform: "uppercase",
          }}>
            lecture polyphonique · « {openMotif} »
          </div>

          {readingBusy && (
            <div className="text-center" style={{ padding: "var(--s-4)" }}>
              <div className="breath" style={{ margin: "0 auto" }} />
              <p className="seuil-italic mt-s" style={{ color: "var(--ash-light)" }}>les voix se forment.</p>
            </div>
          )}

          {!readingBusy && reading?.voices && (
            <div className="stack gap-m">
              <PolyVoice tag="paper" label="profondeurs" text={reading.voices.paper} />
              <PolyVoice tag="stone" label="corps" text={reading.voices.stone} />
              <PolyVoice tag="silk" label="onirique" text={reading.voices.silk} />
              {reading.closing_question && (
                <div className="seuil-italic" style={{
                  color: "var(--silk-gold)", textAlign: "center",
                  fontStyle: "italic", marginTop: "var(--s-3)",
                }}>
                  « {reading.closing_question} »
                </div>
              )}
            </div>
          )}

          <div className="row mt-m" style={{ justifyContent: "flex-end" }}>
            <button className="btn-text" onClick={() => { setOpenMotif(null); setReading(null); }}>
              fermer
            </button>
          </div>
        </div>
      )}

      <div className="row gap-m mt-s">
        <button className="btn-ghost" onClick={load} disabled={loading}>
          {loading ? "…" : "rafraîchir"}
        </button>
      </div>
    </div>
  );
};

const SyncRow = ({ item, onAsk, isActive }) => {
  const kindLabel = item.kind === "motif_tag" ? "motif"
                  : item.kind === "figure" ? "figure"
                  : "pattern";
  return (
    <div className="card" style={{
      padding: "var(--s-3) var(--s-4)",
      background: isActive ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent",
      border: "1px solid var(--ash-deep)",
      borderRadius: 0,
    }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="meta-mono mb-s" style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
            color: "var(--ash-light)", textTransform: "uppercase",
          }}>
            {kindLabel} · {item.contributors} voix · {item.kairos_count} dépôts
          </div>
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
            lineHeight: 1.45, color: "var(--bone)",
          }}>
            « {item.motif} »
          </div>
          <div className="row mt-s" style={{ gap: 6, flexWrap: "wrap" }}>
            {item.contributor_names && item.contributor_names.length === item.contributor_glyphs.length ? (
              item.contributor_names.map((n, i) => (
                <span key={i} className="meta op-70" style={{
                  fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
                }}>
                  {n}{i < item.contributor_names.length - 1 ? " ·" : ""}
                </span>
              ))
            ) : (
              item.contributor_glyphs.map((g, i) => (
                <span key={i} style={{
                  width: 24, height: 24, borderRadius: "50%",
                  border: "1px solid var(--ash-deep)",
                  display: "inline-grid", placeItems: "center",
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 12, color: "var(--ash-light)",
                }}>{g}</span>
              ))
            )}
          </div>
        </div>
        <button className="btn-text" onClick={onAsk} style={{ alignSelf: "center", whiteSpace: "nowrap" }}>
          {isActive ? "relancer" : "lecture polyphonique"}
        </button>
      </div>
    </div>
  );
};

const PolyVoice = ({ tag, label, text }) => {
  const colorByTag = {
    paper: "color-mix(in oklch, var(--ember-warm) 12%, var(--night-floor))",
    stone: "color-mix(in oklch, var(--stone-cool) 12%, var(--night-floor))",
    silk:  "color-mix(in oklch, var(--silk-gold) 10%, var(--night-floor))",
  };
  return (
    <div style={{
      padding: "var(--s-3) var(--s-4)",
      background: colorByTag[tag] || "var(--night-warm)",
      border: "1px solid var(--ash-deep)", borderRadius: 0,
    }}>
      <div className="meta-mono mb-s" style={{
        fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.18em",
        color: "var(--ash-light)", textTransform: "uppercase",
      }}>
        {tag} · {label}
      </div>
      <div style={{
        fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
        lineHeight: 1.6, color: "var(--bone)", whiteSpace: "pre-wrap",
      }}>{text}</div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// C.6 — TabMeteo
// ════════════════════════════════════════════════════════════════════
const TabMeteo = ({ circleId }) => {
  const [weather, setWeather] = dpS(null);
  const [stale, setStale] = dpS(false);
  const [loading, setLoading] = dpS(true);
  const [busy, setBusy] = dpS(false);
  const [info, setInfo] = dpS(null);
  const [error, setError] = dpS(null);

  const load = dpC(async () => {
    setLoading(true);
    setInfo(null); setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/weather`);
      const data = await r.json();
      if (data?.weather) { setWeather(data.weather); setStale(!!data.stale); }
      else { setWeather(null); setStale(true); }
    } catch (e) {
      setError(e?.message || "fetch non aboutie");
    } finally { setLoading(false); }
  }, [circleId]);

  const tisser = async () => {
    setBusy(true); setInfo(null); setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/weather`, {
        method: "POST", body: JSON.stringify({}),
      });
      const data = await r.json();
      if (data?.error) setError(data.error);
      else if (data?.k_anonymity_failed) {
        setWeather(null);
        setInfo(data.message || "pas encore assez de voix.");
      } else if (data?.empty) {
        setWeather(null);
        setInfo(data.message || "rien à tisser.");
      } else if (data?.weather) {
        setWeather(data.weather); setStale(false);
      }
    } catch (e) { setError(e?.message || "tissage non abouti"); }
    finally { setBusy(false); }
  };

  dpE(() => { load(); }, [load]);

  const m = weather?.metrics || {};

  return (
    <div className="stack gap-m">
      <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}>
        une note météo du cercle sur 30 jours. anonyme par construction. au moins 5 voix doivent avoir contribué.
      </p>

      {loading && <div className="meta op-70">chargement…</div>}

      {!loading && weather?.weather_text && (
        <div className="card" style={{
          padding: "var(--s-5) var(--s-4)",
          background: "var(--night-warm)",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
          borderRadius: 0,
        }}>
          <div className="meta-mono mb-m" style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
            color: "var(--silk-gold)", textTransform: "uppercase",
          }}>
            météo · {_dpRel(weather.generated_at)}{stale ? " · à rafraîchir" : ""}
          </div>
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
            lineHeight: 1.7, color: "var(--bone)", whiteSpace: "pre-wrap",
          }}>
            {weather.weather_text}
          </div>
          {(m.contributors || m.deposit_count) && (
            <div className="meta-mono mt-l op-50" style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
              color: "var(--ash-light)", textTransform: "uppercase",
            }}>
              {m.contributors} voix · {m.deposit_count} dépôts
            </div>
          )}
        </div>
      )}

      {!loading && !weather?.weather_text && info && (
        <div className="card" style={{
          padding: "var(--s-4)", background: "transparent",
          border: "1px solid var(--ash-deep)", borderRadius: 0,
        }}>
          <p className="seuil-italic" style={{ color: "var(--ash-light)", maxWidth: 480 }}>{info}</p>
        </div>
      )}
      {!loading && !weather?.weather_text && !info && (
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          aucune météo encore tissée. lance la première.
        </p>
      )}

      {error && (
        <div className="meta" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {error}
        </div>
      )}

      <div className="row gap-m mt-s">
        <button className="btn-ghost" disabled={busy} onClick={tisser}>
          {busy ? "tissage…" : (weather?.weather_text ? "tisser une nouvelle météo" : "tisser la météo")}
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// C.7 — TabAnnales
// ════════════════════════════════════════════════════════════════════
const TabAnnales = ({ circleId }) => {
  const [entries, setEntries] = dpS([]);
  const [loading, setLoading] = dpS(true);
  const [filterMotif, setFilterMotif] = dpS("");
  const [filterMonth, setFilterMonth] = dpS(""); // YYYY-MM
  const [starredOnly, setStarredOnly] = dpS(false);
  const [error, setError] = dpS(null);

  const load = dpC(async () => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (filterMotif.trim()) params.set("motif", filterMotif.trim());
      if (filterMonth) params.set("month", filterMonth);
      if (starredOnly) params.set("starred", "1");
      const r = await _dpFetch(`/api/circles/${circleId}/annales?` + params.toString());
      const data = await r.json();
      if (data?.error) setError(data.error);
      else setEntries(data.entries || []);
    } catch (e) { setError(e?.message || "fetch non aboutie"); }
    finally { setLoading(false); }
  }, [circleId, filterMotif, filterMonth, starredOnly]);

  dpE(() => { load(); }, [load]);

  const toggleMark = async (entry) => {
    try {
      if (entry.marked_by_me) {
        const params = new URLSearchParams();
        params.set("kairos_id", entry.kairos_id);
        await _dpFetch(`/api/circles/${circleId}/annales/mark?` + params.toString(), {
          method: "DELETE", body: JSON.stringify({ kairos_id: entry.kairos_id }),
        });
      } else {
        await _dpFetch(`/api/circles/${circleId}/annales/mark`, {
          method: "POST", body: JSON.stringify({ kairos_id: entry.kairos_id }),
        });
      }
      // optimistic refresh
      load();
    } catch (e) {
      console.warn("[TabAnnales] toggleMark failed:", e?.message);
    }
  };

  return (
    <div className="stack gap-m">
      <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}>
        les rêves partagés en clair dans le cercle, conservés ici. marque ★ ce qui résonne. filtre par motif, par mois.
      </p>

      <div className="row gap-s mb-m" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <input
          className="field-input"
          placeholder="filtrer par motif (eau, porte, mère…)"
          value={filterMotif}
          onChange={(e) => setFilterMotif(e.target.value)}
          style={{ maxWidth: 260 }}
        />
        <input
          className="field-input"
          type="month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ maxWidth: 180 }}
        />
        <label className="meta op-70 row gap-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13 }}>
          <input
            type="checkbox"
            checked={starredOnly}
            onChange={(e) => setStarredOnly(e.target.checked)}
          />
          marqués ★ uniquement
        </label>
      </div>

      {error && (
        <div className="meta" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="meta op-70">chargement…</div>
      ) : entries.length === 0 ? (
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          aucune annale qui correspond à ce filtre.
        </p>
      ) : (
        <div className="stack gap-s">
          {entries.map((e) => (
            <AnnaleCard key={e.kairos_id} entry={e} onToggleMark={() => toggleMark(e)} />
          ))}
        </div>
      )}
    </div>
  );
};

const AnnaleCard = ({ entry, onToggleMark }) => {
  const text = (entry.raw_text || "").slice(0, 320);
  const more = (entry.raw_text || "").length > 320;
  const dateStr = new Date(entry.shared_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <div className="card" style={{
      padding: "var(--s-3) var(--s-4)",
      background: entry.marked_by_me
        ? "color-mix(in oklch, var(--silk-gold) 6%, transparent)"
        : "transparent",
      border: "1px solid var(--ash-deep)",
      borderRadius: 0,
    }}>
      <div className="row" style={{ justifyContent: "space-between", gap: 8 }}>
        <div className="meta-mono" style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
          color: "var(--ash-light)", textTransform: "uppercase",
        }}>
          {entry.pseudonym || "voix anonyme"} · {dateStr}
        </div>
        <button
          onClick={onToggleMark}
          title={entry.marked_by_me ? "retirer ma marque" : "marquer ★"}
          style={{
            background: "transparent", border: "none",
            color: entry.marked_by_me ? "var(--silk-gold)" : "var(--ash-light)",
            fontSize: 18, cursor: "pointer", padding: 0, lineHeight: 1,
          }}
        >
          {entry.marked_by_me ? "★" : "☆"}
          {entry.marks_count > 1 && (
            <span className="meta-mono ml-s" style={{ fontSize: 10, color: "var(--ash-light)" }}>
              {entry.marks_count}
            </span>
          )}
        </button>
      </div>
      <div className="mt-s" style={{
        fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
        lineHeight: 1.55, color: "var(--bone)", whiteSpace: "pre-wrap",
      }}>
        {text}{more && "…"}
      </div>
      {(entry.motif_tags?.length || 0) > 0 && (
        <div className="row mt-s" style={{ gap: 6, flexWrap: "wrap" }}>
          {entry.motif_tags.slice(0, 6).map((t, i) => (
            <span key={i} className="meta-mono" style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
              color: "var(--ash-light)", textTransform: "uppercase",
              border: "1px solid var(--ash-deep)", padding: "2px 6px",
            }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// C.8 — TabRituels
// ════════════════════════════════════════════════════════════════════
const RITUAL_LABELS = {
  council: "Council Process · tour de parole",
  theory_u: "Theory U · 4 mouvements",
  council_4_voix: "Council 4 voix sur un rêve",
  lightning_group: "Lightning Dreamwork · groupe",
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
      setRituals(data?.rituals || []);
    } catch (e) {
      console.warn("[TabRituels] load failed:", e?.message);
    } finally { setLoading(false); }
  }, [circleId]);

  dpE(() => { load(); }, [load]);

  if (openRitualId) {
    return (
      <RitualView
        circleId={circleId}
        ritualId={openRitualId}
        onBack={() => { setOpenRitualId(null); load(); }}
      />
    );
  }

  return (
    <div className="stack gap-m">
      <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}>
        un rituel collectif tient le cercle dans une forme. async — chacun contribue à son rythme dans une fenêtre. quatre formes disponibles.
      </p>

      {loading ? (
        <div className="meta op-70">chargement…</div>
      ) : rituals.length === 0 ? (
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          aucun rituel encore. propose le premier.
        </p>
      ) : (
        <div className="stack gap-s">
          {rituals.map((r) => (
            <RitualRow key={r.id} ritual={r} onOpen={() => setOpenRitualId(r.id)} />
          ))}
        </div>
      )}

      {!creating ? (
        <button className="btn-ghost mt-m" onClick={() => setCreating(true)}>
          + proposer un rituel
        </button>
      ) : (
        <RitualCreator
          circleId={circleId}
          onCancel={() => setCreating(false)}
          onCreated={(r) => { setCreating(false); setOpenRitualId(r.id); load(); }}
        />
      )}
    </div>
  );
};

const RitualRow = ({ ritual, onOpen }) => {
  const closed = ['archived', 'closed'].includes(ritual.current_phase);
  return (
    <div className="card" style={{
      padding: "var(--s-3) var(--s-4)",
      background: closed ? "transparent" : "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
      border: "1px solid var(--ash-deep)",
      borderRadius: 0, opacity: closed ? 0.7 : 1,
    }}>
      <div className="meta-mono mb-s" style={{
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
        color: "var(--silk-gold)", textTransform: "uppercase",
      }}>
        {RITUAL_LABELS[ritual.ritual_type] || ritual.ritual_type} · {ritual.current_phase}
      </div>
      <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16, color: "var(--bone)" }}>
        {ritual.title || (ritual.prompt_seed ? "« " + ritual.prompt_seed.slice(0, 80) + " »" : "(sans titre)")}
      </div>
      <div className="row mt-s" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div className="meta-mono" style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
          color: "var(--ash-light)", textTransform: "uppercase",
        }}>
          {ritual.participant_count || 0} participants · ouvert {_dpRel(ritual.created_at)}
        </div>
        <button className="btn-text" onClick={onOpen} style={{ fontSize: 12.5 }}>
          {ritual.i_joined ? "ouvrir" : "rejoindre & ouvrir"}
        </button>
      </div>
    </div>
  );
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
      setError("ce rituel a besoin d'un rêve cible (kairos_id)");
      return;
    }
    setBusy(true); setError(null);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/rituals`, {
        method: "POST",
        body: JSON.stringify({
          ritual_type: ritualType,
          title: title.trim() || null,
          prompt_seed: promptSeed.trim() || null,
          target_kairos_id: targetKairosId.trim() || null,
          window_hours: parseInt(windowHours, 10) || 48,
        }),
      });
      const data = await r.json();
      if (data?.error) setError(data.error);
      else if (data?.ritual) onCreated(data.ritual);
    } catch (e) { setError(e?.message || "création non aboutie"); }
    finally { setBusy(false); }
  };

  return (
    <div className="card mt-m" style={{
      padding: "var(--s-4)",
      background: "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
      border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
      borderRadius: 0,
    }}>
      <div className="meta-mono mb-m" style={{
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
        color: "var(--silk-gold)", textTransform: "uppercase",
      }}>
        nouveau rituel
      </div>

      <label className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" }}>
        forme
      </label>
      <select
        className="field-input mb-m"
        value={ritualType}
        onChange={(e) => setRitualType(e.target.value)}
        style={{ width: "100%" }}
      >
        <option value="council">Council Process — tour de parole</option>
        <option value="theory_u">Theory U — 4 mouvements (suspending / redirecting / letting go / letting come)</option>
        <option value="council_4_voix">Council 4 voix sur un rêve (rêveur / protecteur / âme / ombre)</option>
        <option value="lightning_group">Lightning Dreamwork groupe — "si c'était mon rêve"</option>
      </select>

      <label className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" }}>
        titre (optionnel)
      </label>
      <input
        className="field-input mb-m"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ex: 'le seuil de l'été'"
        style={{ width: "100%" }}
      />

      <label className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" }}>
        question / contexte (optionnel)
      </label>
      <textarea
        className="field-textarea mb-m"
        value={promptSeed}
        onChange={(e) => setPromptSeed(e.target.value)}
        placeholder="ce que le cercle vient regarder ensemble…"
        rows={3}
      />

      {requireKairos && (
        <>
          <label className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" }}>
            kairos_id du rêve cible
          </label>
          <input
            className="field-input mb-m"
            value={targetKairosId}
            onChange={(e) => setTargetKairosId(e.target.value)}
            placeholder="uuid du rêve partagé dans le cercle"
            style={{ width: "100%" }}
          />
        </>
      )}

      <label className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13, display: "block" }}>
        fenêtre (heures, async)
      </label>
      <input
        className="field-input mb-m"
        type="number"
        min={1}
        max={168}
        value={windowHours}
        onChange={(e) => setWindowHours(e.target.value)}
        style={{ width: 120 }}
      />

      {error && (
        <div className="meta mb-m" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {error}
        </div>
      )}

      <div className="row gap-m" style={{ justifyContent: "flex-end" }}>
        <button className="btn-text" disabled={busy} onClick={onCancel}>annuler</button>
        <button className="btn-ghost" disabled={busy} onClick={create}>
          {busy ? "…" : "proposer"}
        </button>
      </div>
    </div>
  );
};

const RitualView = ({ circleId, ritualId, onBack }) => {
  const [data, setData] = dpS(null);
  const [loading, setLoading] = dpS(true);
  const [contribDraft, setContribDraft] = dpS("");
  const [contribVoice, setContribVoice] = dpS(null); // for council_4_voix
  const [contribBusy, setContribBusy] = dpS(false);
  const [busy, setBusy] = dpS(false);
  const [error, setError] = dpS(null);

  const load = dpC(async () => {
    setLoading(true);
    try {
      const r = await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}`);
      const d = await r.json();
      if (d?.error) setError(d.error);
      else setData(d);
    } catch (e) { setError(e?.message || "fetch non aboutie"); }
    finally { setLoading(false); }
  }, [circleId, ritualId]);

  dpE(() => { load(); }, [load]);

  const join = async () => {
    setBusy(true);
    try {
      await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}/join`, { method: "POST", body: "{}" });
      load();
    } catch (e) { console.warn("[RitualView] join failed:", e?.message); }
    finally { setBusy(false); }
  };

  const advance = async () => {
    if (!confirm("passer à la phase suivante ?")) return;
    setBusy(true);
    try {
      await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}/advance`, { method: "POST", body: "{}" });
      load();
    } catch (e) { console.warn("[RitualView] advance failed:", e?.message); }
    finally { setBusy(false); }
  };

  const contribute = async () => {
    const text = contribDraft.trim();
    if (!text || contribBusy) return;
    setContribBusy(true); setError(null);
    try {
      const body = { content: text };
      if (data?.ritual?.ritual_type === "council_4_voix" && contribVoice) {
        body.voice_attribution = contribVoice;
      }
      const r = await _dpFetch(`/api/circles/${circleId}/rituals/${ritualId}/contribute`, {
        method: "POST", body: JSON.stringify(body),
      });
      const d = await r.json();
      if (d?.error) setError(d.error);
      else { setContribDraft(""); load(); }
    } catch (e) { setError(e?.message || "contribution non aboutie"); }
    finally { setContribBusy(false); }
  };

  if (loading) return <div className="meta op-70">chargement du rituel…</div>;
  if (!data?.ritual) {
    return (
      <div className="stack gap-m">
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          rituel introuvable.
        </p>
        <button className="btn-text" onClick={onBack}>← retour</button>
      </div>
    );
  }

  const r = data.ritual;
  const phasesDef = (r.metadata?.phases || []).filter((p) => p !== "open" && p !== "closed" && p !== "archived");
  const closed = ["archived", "closed"].includes(r.current_phase);
  const currentPhaseDef = (window.CIRCLE_RITUAL_PHASE_DEFS && window.CIRCLE_RITUAL_PHASE_DEFS[r.ritual_type] || [])
    .find((p) => p.phase === r.current_phase);

  return (
    <div className="stack gap-m">
      <button className="btn-text" onClick={onBack}>← retour aux rituels</button>

      <div className="card" style={{
        padding: "var(--s-4) var(--s-4)",
        background: "color-mix(in oklch, var(--silk-gold) 4%, var(--night-floor))",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
        borderRadius: 0,
      }}>
        <div className="meta-mono mb-s" style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
          color: "var(--silk-gold)", textTransform: "uppercase",
        }}>
          {RITUAL_LABELS[r.ritual_type] || r.ritual_type} · phase {r.current_phase}
        </div>
        <h2 className="h2-seuil mb-s">{r.title || "(rituel sans titre)"}</h2>
        {r.prompt_seed && (
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--bone)", whiteSpace: "pre-wrap" }}>
            {r.prompt_seed}
          </p>
        )}
        <div className="meta-mono mt-m op-70" style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
          color: "var(--ash-light)", textTransform: "uppercase",
        }}>
          {data.participant_count} participants · fenêtre {r.window_hours}h
        </div>
      </div>

      {/* Phase tracker */}
      <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
        {phasesDef.map((p, i) => {
          const passed = phasesDef.indexOf(r.current_phase) > i;
          const here = r.current_phase === p;
          return (
            <span key={p} className="meta-mono" style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
              color: here ? "var(--silk-gold)" : passed ? "var(--ash-light)" : "var(--ash-deep)",
              textTransform: "uppercase",
              border: here ? "1px solid var(--silk-gold)" : "1px solid var(--ash-deep)",
              padding: "2px 8px",
            }}>
              {p}
            </span>
          );
        })}
      </div>

      {currentPhaseDef && (
        <div className="card" style={{
          padding: "var(--s-3) var(--s-4)",
          background: "color-mix(in oklch, var(--stone-cool) 5%, transparent)",
          border: "1px solid var(--ash-deep)", borderRadius: 0,
        }}>
          <div className="meta-mono mb-s" style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
            color: "var(--silk-gold)", textTransform: "uppercase",
          }}>
            {currentPhaseDef.title}
          </div>
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15, color: "var(--bone)" }}>
            {currentPhaseDef.prompt}
          </p>
        </div>
      )}

      {/* Contributions list */}
      <div className="stack gap-s">
        {(data.contributions || []).map((c) => (
          <div key={c.id} className="card" style={{
            padding: "var(--s-3) var(--s-4)",
            background: "transparent",
            border: "1px solid var(--ash-deep)", borderRadius: 0,
          }}>
            <div className="meta-mono mb-s" style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
              color: "var(--ash-light)", textTransform: "uppercase",
            }}>
              {c.voice_attribution || c.phase} · {_dpRel(c.created_at)}
              {c.is_voice && <span style={{ marginLeft: 8, color: "var(--silk-gold)" }}>🎙 {_dpDur(c.voice_duration_ms)}</span>}
            </div>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
              lineHeight: 1.55, color: "var(--bone)", whiteSpace: "pre-wrap",
            }}>
              {c.content}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="meta" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {error}
        </div>
      )}

      {!data.i_joined && !closed && (
        <button className="btn-ghost mt-m" disabled={busy} onClick={join}>rejoindre le rituel</button>
      )}

      {data.i_joined && !closed && (
        <div className="card mt-m" style={{
          padding: "var(--s-4)", background: "color-mix(in oklch, var(--stone-cool) 4%, transparent)",
          border: "1px solid var(--ash-deep)", borderRadius: 0,
        }}>
          {r.ritual_type === "council_4_voix" && (
            <select
              className="field-input mb-s"
              value={contribVoice || ""}
              onChange={(e) => setContribVoice(e.target.value || null)}
              style={{ width: "100%" }}
            >
              <option value="">— voix (optionnel) —</option>
              <option value="dreamer">voix du rêveur</option>
              <option value="protector">voix du protecteur</option>
              <option value="soul">voix de l'âme</option>
              <option value="shadow">voix de l'ombre</option>
            </select>
          )}
          <textarea
            className="field-textarea mb-s"
            placeholder="ta contribution à cette phase…"
            value={contribDraft}
            onChange={(e) => setContribDraft(e.target.value)}
            rows={4}
          />
          <div className="row gap-m" style={{ justifyContent: "flex-end" }}>
            <button className="btn-ghost" disabled={contribBusy || !contribDraft.trim()} onClick={contribute}>
              {contribBusy ? "…" : "déposer"}
            </button>
          </div>
        </div>
      )}

      {data.i_joined && !closed && (
        <button className="btn-text mt-m" disabled={busy} onClick={advance} style={{ alignSelf: "flex-start" }}>
          → faire avancer à la phase suivante
        </button>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
// C.9 — Voice composer (réutilisable depuis TabChat patché in-place)
// ════════════════════════════════════════════════════════════════════
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
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.start(250);
      recRef.current = rec;
      startedAtRef.current = Date.now();
      setRecording(true);
    } catch (e) {
      console.warn("[ChatVoiceMic] mic denied:", e.message);
      alert("Permission micro refusée. Active-la dans ton navigateur.");
    }
  };

  const stop = async () => {
    const rec = recRef.current;
    const stream = streamRef.current;
    if (!rec) return;
    return new Promise((resolve) => {
      rec.onstop = async () => {
        try {
          if (stream) stream.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
          recRef.current = null;
          setRecording(false);
          const dur = Date.now() - startedAtRef.current;
          if (chunksRef.current.length === 0) { resolve(); return; }
          const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
          chunksRef.current = [];
          if (blob.size < 500) { resolve(); return; }

          setTranscribing(true);
          try {
            const token = await window.DreamAuth?.getAccessToken?.();
            const fd = new FormData();
            fd.append("audio", new File([blob], "voice.webm", { type: blob.type }));
            const res = await fetch("/api/transcribe", {
              method: "POST",
              headers: token ? { Authorization: "Bearer " + token } : {},
              body: fd,
            });
            if (!res.ok) throw new Error("transcribe " + res.status);
            const json = await res.json();
            const transcript = (json.text || json.transcript || "").trim();
            if (transcript) onTranscribed?.({ transcript, duration_ms: dur, lang: json.language || null });
          } catch (e) {
            console.warn("[ChatVoiceMic] transcribe failed:", e.message);
            alert("Transcription échouée. Réessaie ou tape au clavier.");
          } finally { setTranscribing(false); resolve(); }
        } catch (e) {
          console.warn("[ChatVoiceMic] stop fail:", e.message); resolve();
        }
      };
      rec.stop();
    });
  };

  return (
    <button
      className="btn-ghost"
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={() => { if (recRef.current) stop(); }}
      onTouchStart={(e) => { e.preventDefault(); start(); }}
      onTouchEnd={(e) => { e.preventDefault(); stop(); }}
      disabled={disabled || transcribing}
      title={recording ? "lâcher pour envoyer" : transcribing ? "transcription…" : "tenir pour parler"}
      style={{
        minWidth: 44, padding: "8px 10px",
        borderColor: recording ? "var(--silk-gold)" : "var(--ash-deep)",
        color: recording ? "var(--silk-gold)" : "var(--ash-light)",
      }}
    >
      {transcribing ? "…" : recording ? "● rec" : "🎙"}
    </button>
  );
};

// ── Phase definitions exposées à window pour RitualView ───────
window.CIRCLE_RITUAL_PHASE_DEFS = {
  council: [
    { phase: 'phase_1', title: 'Tour de parole', prompt: "Chacun·e prend la parole à son tour. Pas de réponse aux autres — on dépose, on écoute en silence ce que les autres déposent. On peut passer son tour." },
  ],
  theory_u: [
    { phase: 'phase_1', title: 'Suspending — voir avec des yeux nouveaux', prompt: 'Quel jugement tiens-tu sur ce qui se passe ? Mets-le à distance. Décris la situation comme si tu la voyais pour la première fois.' },
    { phase: 'phase_2', title: 'Redirecting — voir depuis le tout', prompt: "Si tu te déplaces d'un cran, vers le tout du système, qu'est-ce que tu vois ? Quel rôle joue le cercle dans cela ?" },
    { phase: 'phase_3', title: 'Letting go — laisser tomber le contrôle', prompt: "Qu'est-ce qui voudrait s'en aller ? Quelle vieille forme demande à mourir ?" },
    { phase: 'phase_4', title: 'Letting come — laisser émerger', prompt: 'Qu\'est-ce qui voudrait advenir si on faisait silence ? Quelle question, quelle image, quel acte ?' },
  ],
  council_4_voix: [
    { phase: 'phase_1', title: 'Voix du rêveur', prompt: 'Décris le rêve comme tu l\'as vécu, à la première personne. Qu\'est-ce qui s\'est passé pour toi ?' },
    { phase: 'phase_2', title: 'Voix du protecteur', prompt: "Quelque chose dans le rêve protège. Que dirait-elle, cette part qui veille ?" },
    { phase: 'phase_3', title: 'Voix de l\'âme', prompt: "Si l'âme du rêve avait une parole — pas une explication, une parole — quelle serait-elle ?" },
    { phase: 'phase_4', title: "Voix de l'ombre", prompt: "Ce qui n'a pas été dit, ce qui a été refusé, ce qui résiste à être nommé — que dit cela ?" },
  ],
  lightning_group: [
    { phase: 'phase_1', title: 'Le rêve déposé', prompt: 'Le rêveur partage le rêve à voix nue. Pas d\'analyse, pas de commentaire. Juste les images, les figures, les sensations.' },
    { phase: 'phase_2', title: 'Si c\'était mon rêve', prompt: '"Si c\'était mon rêve…" — chaque autre membre prend le rêve comme s\'il était le sien et dit ce qu\'il y trouverait. Pas de "tu devrais", uniquement "moi je".' },
    { phase: 'phase_3', title: 'Le rêveur reprend', prompt: 'Le rêveur dit ce qu\'il garde — pas par politesse, par résonance. Et peut-être un acte qui honore le rêve.' },
  ],
};

Object.assign(window, {
  TabSynchronicites,
  TabMeteo,
  TabAnnales,
  TabRituels,
  ChatVoiceMicButton,
});
