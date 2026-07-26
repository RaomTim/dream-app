/* global React */
const { useState: uSS, useEffect: uSE, useMemo: uSM, useRef: uSR } = React;

// ═════════════════════════════════════════════════════════════
// 2026-04-26 — Refonte Oracle du Corps + Conte-miroir (Bible §17.2 + §17.4)
// Yeshua — agent code 1M
//
// ORACLE DU CORPS :
// - Silhouette SVG cliquable FRONT + BACK (toggle)
// - Tap sur zone → modal capture intensité 1-5 + valence + sensation_text
// - Heat map 30j (size + couleur ember selon count + intensité)
// - Corrélations zones↔motifs (ventre + porte fermée)
// - Lectures Mindell/Martel/Dethlefsen/Odoul tenues en Plis poétiques
// ═════════════════════════════════════════════════════════════

// ── Zones canoniques (silhouette tap targets) ─────────────────
// Coordonnées dans viewBox 200x340 (silhouette plus grande pour tap targets).
// view = "front" | "back". Chaque zone = { id, label, view, cx, cy, r }.
// id matche le set ALLOWED_ZONES dans /api/oracle-corps/markers.
const SILHOUETTE_ZONES_FRONT = [
  { id: "head",        label: "tête",          cx: 100, cy: 38,  r: 22, body: "migraines, sinus, charge mentale" },
  { id: "jaw",         label: "mâchoire",      cx: 100, cy: 60,  r: 11, body: "serrement, paroles ravalées" },
  { id: "throat",      label: "gorge",         cx: 100, cy: 76,  r: 11, body: "voix, vérité retenue" },
  { id: "shoulders",   label: "épaules",       cx: 100, cy: 92,  r: 18, body: "fardeaux portés sans le voir" },
  { id: "heart",       label: "cœur",          cx: 100, cy: 118, r: 16, body: "amour, peine ancienne" },
  { id: "chest",       label: "poitrine",      cx: 100, cy: 130, r: 22, body: "respiration, accueil/refus" },
  { id: "belly",       label: "ventre",        cx: 100, cy: 168, r: 22, body: "intuition, ce qui ne se digère pas" },
  { id: "lower_belly", label: "bas-ventre",    cx: 100, cy: 198, r: 17, body: "ancrage, lignées, désir" },
  { id: "pelvis",      label: "bassin",        cx: 100, cy: 220, r: 15, body: "racine, créativité corporelle" },
  { id: "arms_left",   label: "bras gauche",   cx: 60,  cy: 130, r: 12, body: "donner, retenir" },
  { id: "arms_right",  label: "bras droit",    cx: 140, cy: 130, r: 12, body: "agir, refuser" },
  { id: "hands",       label: "mains",         cx: 50,  cy: 175, r: 11, body: "tenir, lâcher" },
  { id: "knees",       label: "genoux",        cx: 100, cy: 268, r: 12, body: "souplesse, soumission" },
  { id: "feet",        label: "pieds",         cx: 100, cy: 312, r: 13, body: "ancrage, direction" },
];
const SILHOUETTE_ZONES_BACK = [
  { id: "head",        label: "nuque",         cx: 100, cy: 42,  r: 18, body: "ce qui pèse derrière la tête" },
  { id: "neck",        label: "cou (arrière)", cx: 100, cy: 70,  r: 11, body: "raideurs, tensions" },
  { id: "shoulders",   label: "trapèzes",      cx: 100, cy: 92,  r: 18, body: "fardeaux d'autrui" },
  { id: "back_upper",  label: "dos (haut)",    cx: 100, cy: 122, r: 18, body: "ce qu'on porte sans le voir" },
  { id: "back_lower",  label: "dos (bas)",     cx: 100, cy: 175, r: 18, body: "lombaires, soutien" },
  { id: "pelvis",      label: "sacrum",        cx: 100, cy: 215, r: 15, body: "fondations, lignées" },
  { id: "legs",        label: "jambes",        cx: 100, cy: 270, r: 18, body: "trajectoire, fuite" },
  { id: "feet",        label: "talons",        cx: 100, cy: 318, r: 13, body: "appui, posture" },
];

// Lectures auteur-par-zone (digests Mindell / Martel / Dethlefsen / Odoul)
const ZONE_READINGS = {
  head:        { mindell: "le voyant, le penseur, la couronne qui sait", martel: "conflit entre ce que tu sais et ce que tu peux porter", dethlefsen: "polarité intellect ↔ incarnation", odoul: "le lieu du père" },
  jaw:         { mindell: "ce qui mord et ce qui retient", martel: "agressivité retenue, mots avalés", dethlefsen: "polarité dire ↔ taire", odoul: "le lieu de l'expression" },
  throat:      { mindell: "le passage entre ce qui sait et ce qui parle", martel: "parole retenue, vérité étouffée", dethlefsen: "polarité intérieur ↔ extérieur", odoul: "le lieu du refus" },
  shoulders:   { mindell: "ce qu'on porte sans le voir", martel: "fardeaux d'autrui, devoirs assimilés", dethlefsen: "polarité visible ↔ invisible", odoul: "le lieu de la responsabilité" },
  heart:       { mindell: "la chambre intime de l'accueil", martel: "amour qui n'a pas pu entrer ou sortir", dethlefsen: "polarité prendre ↔ donner", odoul: "le lieu de la mère" },
  chest:       { mindell: "souffle, respiration, présence", martel: "tristesse non pleurée", dethlefsen: "polarité ouvrir ↔ refermer", odoul: "le lieu du souffle" },
  belly:       { mindell: "le cerveau ancien, celui qui sait avant qu'on sache", martel: "ce qu'on ne peut digérer, soi-même inclus", dethlefsen: "polarité recevoir ↔ transformer", odoul: "le lieu de l'enfant intérieur" },
  lower_belly: { mindell: "la racine du désir et de l'enracinement", martel: "lignées, appartenance, honte héritée", dethlefsen: "polarité racine ↔ créativité", odoul: "le lieu des ancêtres" },
  pelvis:      { mindell: "le bol qui contient", martel: "manque de soutien intérieur", dethlefsen: "polarité tenir ↔ couler", odoul: "le lieu de la base" },
  back_upper:  { mindell: "ce que tu portes derrière toi sans le voir", martel: "fardeaux d'autrui devenus tiens", dethlefsen: "polarité visible ↔ invisible", odoul: "le lieu du père dorsal" },
  back_lower:  { mindell: "soutien fondamental, vie matérielle", martel: "peurs financières, manque de soutien", dethlefsen: "polarité solidité ↔ flexibilité", odoul: "le lieu du soutien" },
  hands:       { mindell: "ce qu'on peut faire, tenir, relâcher", martel: "donner sans recevoir, retenir ce qui doit partir", dethlefsen: "polarité saisir ↔ lâcher", odoul: "le lieu du faire" },
  arms_left:   { mindell: "côté du recevoir et du féminin", martel: "ce que tu ne reçois pas pour toi", dethlefsen: "polarité passif ↔ actif", odoul: "le lieu du yin" },
  arms_right:  { mindell: "côté du donner et du masculin", martel: "ce que tu donnes trop sans recevoir", dethlefsen: "polarité actif ↔ passif", odoul: "le lieu du yang" },
  knees:       { mindell: "souplesse devant la vie", martel: "orgueil, refus de plier", dethlefsen: "polarité raideur ↔ souplesse", odoul: "le lieu du compromis" },
  feet:        { mindell: "le lien à la terre, à la direction", martel: "avancer, refuser d'avancer, où tu marches", dethlefsen: "polarité mouvement ↔ immobilité", odoul: "le lieu de la trajectoire" },
  legs:        { mindell: "la course de ta vie", martel: "envie de fuir, d'avancer, d'être porté", dethlefsen: "polarité mobilité ↔ ancrage", odoul: "le lieu de l'élan" },
  neck:        { mindell: "ce qui relie tête et corps", martel: "tensions entre savoir et faire", dethlefsen: "polarité haut ↔ bas", odoul: "le lieu du lien" },
};

// ── Composant principal Oracle du Corps ──────────────────────
const OracleCorpsScreen = ({ go }) => {
  const [view, setView] = uSS("front"); // front | back
  const [activeZone, setActiveZone] = uSS(null); // zone id selected
  const [showCaptureModal, setShowCaptureModal] = uSS(null); // { zone } when tapping
  const [markers, setMarkers] = uSS([]);
  const [heatmap, setHeatmap] = uSS([]);
  const [correlations, setCorrelations] = uSS([]);
  const [synthesis, setSynthesis] = uSS(null);
  const [legacyCorrelations, setLegacyCorrelations] = uSS([]); // dreams.somatic_location aggregation
  const [loading, setLoading] = uSS(true);
  // F.3 — modal lecture du corps (3 voix paper/stone/silk MATTER) post-dépôt marker
  const [bodyReading, setBodyReading] = uSS(null); // { marker_id, loading, reading?, framing?, error? }

  // Heat lookup (zone+view → entry)
  const heatLookup = uSM(() => {
    const m = new Map();
    for (const h of heatmap) m.set(`${h.zone}::${h.view_face}`, h);
    // Merge legacy correlations by zone (front by default)
    for (const c of legacyCorrelations) {
      const k = `${c.zone}::front`;
      if (!m.has(k)) m.set(k, { zone: c.zone, view_face: "front", count: c.count, avg_intensity: 3, avg_valence: null });
      else {
        const e = m.get(k);
        e.count += c.count;
      }
    }
    return m;
  }, [heatmap, legacyCorrelations]);

  const refresh = async () => {
    try {
      setLoading(true);
      const [mres, ores] = await Promise.all([
        window.DreamAPI.listBodyMarkers({ days: 30 }),
        window.DreamAPI.getOracleCorps({ synthesis: true, locale: "fr" }),
      ]);
      setMarkers(mres?.markers || []);
      setHeatmap(mres?.heatmap || []);
      setCorrelations(mres?.correlations || []);
      setLegacyCorrelations(ores?.correlations || []);
      setSynthesis(ores?.synthesis || null);
    } catch (e) {
      console.warn("[OracleCorps] refresh failed:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  uSE(() => { refresh(); }, []);

  const zones = view === "front" ? SILHOUETTE_ZONES_FRONT : SILHOUETTE_ZONES_BACK;
  const activeZoneObj = zones.find((z) => z.id === activeZone);
  const reading = activeZone ? ZONE_READINGS[activeZone] : null;

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          oracle du corps
        </div>
        <h1 className="h1-seuil mb-m">où ton corps porte-t-il cela ?</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 580 }}>
          Le corps ne cache rien. Tape une zone pour la marquer, tape encore pour l'écouter. Mindell, Martel, Dethlefsen, Odoul — quatre lectures, aucune n'est la vérité.
        </p>

        {/* Synthèse Forêt (dreambody) */}
        {synthesis && (
          <div className="card mb-l" style={{
            padding: "var(--s-4)",
            background: "color-mix(in oklch, var(--clay-earth) 5%, transparent)",
            borderColor: "var(--clay-earth)",
          }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--clay-earth)" }}>
              SYNTHÈSE DREAMBODY · CE QUE TON CORPS RÉPÈTE
            </div>
            <p style={{ fontFamily: "var(--serif)", fontSize: 16, lineHeight: 1.7, textWrap: "pretty", whiteSpace: "pre-wrap" }}>
              {synthesis}
            </p>
          </div>
        )}

        {/* Toggle FRONT / BACK */}
        <div className="row gap-s mb-m" style={{ alignItems: "center" }}>
          <button
            className={"chip " + (view === "front" ? "active" : "")}
            onClick={() => setView("front")}
            style={{ minWidth: 80 }}
          >face avant</button>
          <button
            className={"chip " + (view === "back" ? "active" : "")}
            onClick={() => setView("back")}
            style={{ minWidth: 80 }}
          >face arrière</button>
          <span className="meta op-70" style={{ marginLeft: "auto", fontFamily: "var(--serif)", fontStyle: "italic" }}>
            {markers.length > 0 ? `${markers.length} marques · 30j` : "aucune marque encore"}
          </span>
        </div>

        <div className="row gap-l" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* SVG silhouette */}
          <div className="oracle-stage" style={{ flex: "0 0 240px", minWidth: 220 }}>
            <BodySilhouette
              view={view}
              zones={zones}
              activeZone={activeZone}
              heatLookup={heatLookup}
              onTapZone={(zone) => {
                if (activeZone === zone.id) {
                  // Second tap = open capture modal
                  setShowCaptureModal({ zone, view });
                } else {
                  setActiveZone(zone.id);
                }
              }}
            />
            <div className="meta op-70 mt-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textAlign: "center", textWrap: "pretty" }}>
              tape une zone pour l'écouter, tape à nouveau pour y déposer une sensation
            </div>
          </div>

          {/* Lecture / capture panel */}
          <div style={{ flex: 1, minWidth: 280 }}>
            {!activeZone && (
              <div className="stack gap-m" style={{ paddingTop: "var(--s-4)" }}>
                <p className="body op-70" style={{ textWrap: "pretty" }}>
                  Touche une zone. Le corps parle en métaphores — pas en diagnostics.
                </p>
                {heatmap.length > 0 && (
                  <div className="card" style={{ padding: "var(--s-3)", background: "color-mix(in oklch, var(--clay-earth) 4%, transparent)" }}>
                    <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--clay-earth)" }}>
                      ZONES LES PLUS ACTIVES · 30J
                    </div>
                    <div className="stack" style={{ gap: 4 }}>
                      {heatmap.slice(0, 5).map((h, i) => (
                        <div key={i} className="row" style={{ justifyContent: "space-between", fontSize: 13 }}>
                          <span style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                            {labelFor(h.zone, h.view_face)} · {h.view_face}
                          </span>
                          <span className="op-70" style={{ fontFamily: "var(--mono)", fontSize: 11 }}>
                            {h.count}× · int. {h.avg_intensity?.toFixed?.(1) || h.avg_intensity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {correlations.length > 0 && (
                  <div className="card" style={{ padding: "var(--s-3)", background: "color-mix(in oklch, var(--silk-gold) 5%, transparent)", borderColor: "var(--silk-gold)" }}>
                    <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--silk-gold)" }}>
                      MOTIFS QUI REVIENNENT AVEC CES ZONES
                    </div>
                    {correlations.map((c, i) => (
                      <div key={i} style={{ fontSize: 13, marginBottom: 6, textWrap: "pretty" }}>
                        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
                          {labelFor(c.zone, "front")}
                        </span>{" "}
                        ↔ {c.co_occurring_motifs.join(" · ")}
                      </div>
                    ))}
                  </div>
                )}
                <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                  ceci n'est jamais un avis médical. pour ton corps physique, va voir quelqu'un de chair.
                </div>
              </div>
            )}

            {activeZone && reading && (
              <div className="stack gap-l" style={{ paddingTop: "var(--s-3)" }}>
                <div>
                  <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--clay-earth)" }}>
                    ZONE · {(activeZoneObj?.label || activeZone).toUpperCase()}
                  </div>
                  <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)" }}>
                    corps : {activeZoneObj?.body}
                  </div>
                </div>
                <ReadingBlock author="Mindell — le rêve du corps" text={reading.mindell} />
                <ReadingBlock author="Martel — ton corps te dit" text={reading.martel} />
                <ReadingBlock author="Dethlefsen — la maladie comme chemin" text={reading.dethlefsen} />
                <ReadingBlock author="Odoul — lecture des lieux" text={reading.odoul} />
                <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty" }}>
                  Ces lectures sont des hypothèses contradictoires. Garde celle qui te regarde en retour, laisse les autres.
                </div>

                <div className="row gap-s">
                  <button className="btn-ghost" onClick={() => setShowCaptureModal({ zone: activeZoneObj, view })}>
                    déposer une sensation ici
                  </button>
                  <button className="btn-text" onClick={() => go("capture")}>déposer un kairos entier</button>
                </div>

                {/* Markers récents pour cette zone */}
                {(() => {
                  const here = markers.filter((m) => m.zone === activeZone && m.view_face === view);
                  if (here.length === 0) return null;
                  return (
                    <div className="card" style={{ padding: "var(--s-3)" }}>
                      <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.08em" }}>
                        TES MARQUES ICI · {here.length}
                      </div>
                      <div className="stack" style={{ gap: 8 }}>
                        {here.slice(0, 5).map((m, idx) => (
                          <MarkerLine
                            key={m.id}
                            marker={m}
                            isMostRecent={idx === 0}
                            onAskReading={() => setBodyReading({ marker_id: m.id, loading: true })}
                            onDelete={async () => {
                              await window.DreamAPI.deleteBodyMarker(m.id);
                              refresh();
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* F.3 — Modal lecture du corps (3 voix MATTER paper/stone/silk) */}
      {bodyReading && (
        <BodyReadingModal
          marker={markers.find((m) => m.id === bodyReading.marker_id) || null}
          onClose={() => setBodyReading(null)}
        />
      )}

      {/* Capture modal */}
      {showCaptureModal && (
        <BodyMarkerCaptureModal
          zone={showCaptureModal.zone}
          view={showCaptureModal.view}
          onClose={() => setShowCaptureModal(null)}
          onSaved={() => { setShowCaptureModal(null); refresh(); }}
        />
      )}

      <window.FeedbackFloat />
    </div>
  );
};

// ── Sub-component : silhouette SVG ───────────────────────────
const BodySilhouette = ({ view, zones, activeZone, heatLookup, onTapZone }) => {
  return (
    <svg viewBox="0 0 200 340" width="240" height="auto" className="oracle-silhouette"
      style={{ maxHeight: 540, display: "block", margin: "0 auto" }}>
      <g style={{ fill: "color-mix(in oklch, var(--ash-mid) 40%, transparent)", stroke: "var(--ash-mid)", strokeWidth: 0.6 }}>
        {view === "front" ? (
          <>
            <ellipse cx="100" cy="38" rx="22" ry="26" />
            <rect x="93" y="62" width="14" height="14" />
            <path d="M 70 76 Q 100 72 130 76 L 138 168 Q 100 178 62 168 Z" />
            <path d="M 64 170 L 136 170 L 132 222 Q 100 230 68 222 Z" />
            <path d="M 70 226 L 78 312 L 92 312 L 96 226 Z" />
            <path d="M 104 226 L 108 312 L 122 312 L 130 226 Z" />
            <path d="M 64 84 L 44 178 L 56 180 L 72 92 Z" />
            <path d="M 136 84 L 156 178 L 144 180 L 128 92 Z" />
          </>
        ) : (
          <>
            <ellipse cx="100" cy="42" rx="20" ry="24" />
            <rect x="94" y="64" width="12" height="12" />
            <path d="M 70 76 Q 100 70 130 76 L 138 220 Q 100 230 62 220 Z" />
            <path d="M 70 226 L 78 312 L 92 312 L 96 226 Z" />
            <path d="M 104 226 L 108 312 L 122 312 L 130 226 Z" />
            <path d="M 64 84 L 44 178 L 56 180 L 72 92 Z" />
            <path d="M 136 84 L 156 178 L 144 180 L 128 92 Z" />
          </>
        )}
      </g>

      {/* Heat halos (under tap zones) */}
      {zones.map((z) => {
        const h = heatLookup.get(`${z.id}::${view}`);
        if (!h || h.count === 0) return null;
        const intensity = (h.avg_intensity || 3) / 5;
        const radius = z.r + Math.min(15, h.count * 2.5);
        return (
          <circle key={"halo-" + z.id} cx={z.cx} cy={z.cy} r={radius}
            style={{
              fill: "color-mix(in oklch, var(--ember) " + (10 + intensity * 25) + "%, transparent)",
              filter: "blur(" + (3 + intensity * 4) + "px)",
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Tap zones */}
      {zones.map((z) => {
        const h = heatLookup.get(`${z.id}::${view}`);
        const count = h?.count || 0;
        const isActive = activeZone === z.id;
        return (
          <circle key={z.id}
            cx={z.cx} cy={z.cy} r={z.r}
            className={"oracle-zone " + (isActive ? "active" : "")}
            style={{
              fill: isActive
                ? "color-mix(in oklch, var(--silk-gold) 28%, transparent)"
                : count > 0
                  ? "color-mix(in oklch, var(--ember) 14%, transparent)"
                  : "transparent",
              stroke: isActive
                ? "var(--silk-gold)"
                : count > 0 ? "var(--clay-earth)" : "color-mix(in oklch, var(--ash-light) 30%, transparent)",
              strokeWidth: isActive ? 1.5 : count > 0 ? 1 : 0.5,
              cursor: "pointer",
              transition: "all 280ms ease",
            }}
            onClick={() => onTapZone(z)}
          />
        );
      })}

      {/* Labels (right side) */}
      {zones.map((z) => {
        const h = heatLookup.get(`${z.id}::${view}`);
        const count = h?.count || 0;
        const isActive = activeZone === z.id;
        // Anchor labels on the side away from center
        const anchor = z.cx < 100 ? "end" : "start";
        const xOffset = z.cx < 100 ? -z.r - 4 : z.r + 4;
        return (
          <text key={z.id + "-l"}
            x={z.cx + xOffset}
            y={z.cy + 3}
            className="oracle-label"
            textAnchor={anchor}
            style={{
              fontSize: 9.5,
              fontFamily: "var(--serif)",
              fontStyle: "italic",
              fill: isActive ? "var(--silk-gold)" : count > 0 ? "var(--clay-earth)" : "var(--ash-light)",
              opacity: isActive ? 1 : count > 0 ? 0.92 : 0.55,
            }}>
            {z.label}{count > 0 && ` · ${count}×`}
          </text>
        );
      })}
    </svg>
  );
};

// ── Sub-component : capture modal ────────────────────────────
const BodyMarkerCaptureModal = ({ zone, view, onClose, onSaved }) => {
  const [intensity, setIntensity] = uSS(3);
  const [valence, setValence] = uSS(0);
  const [side, setSide] = uSS(null);
  const [sensationText, setSensationText] = uSS("");
  const [contextText, setContextText] = uSS("");
  const [triggerText, setTriggerText] = uSS("");
  // 2026-04-28 §11.bis.20.12 — champ "autre — précise" (résout plainte
  // Tim "pas pu choisir main droite"). Toujours visible sous les zones canoniques.
  const [zoneCustomText, setZoneCustomText] = uSS("");
  const [saving, setSaving] = uSS(false);
  const [err, setErr] = uSS(null);

  const submit = async () => {
    setSaving(true); setErr(null);
    try {
      const customTrim = zoneCustomText.trim();
      const res = await window.DreamAPI.createBodyMarker({
        zone: zone.id,
        view_face: view,
        side,
        intensity,
        valence,
        sensation_text: sensationText.trim() || null,
        context_text: contextText.trim() || null,
        trigger_text: triggerText.trim() || null,
        zone_custom_text: customTrim || null,
      });
      if (res?.error) throw new Error(res.error);
      onSaved && onSaved();
    } catch (e) {
      setErr(e.message || "erreur");
      setSaving(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 80,
      background: "color-mix(in oklch, var(--obsidian) 70%, transparent)",
      display: "grid", placeItems: "center", padding: 16,
      backdropFilter: "blur(6px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto",
        background: "var(--night-warm)",
        border: "1px solid var(--ash-mid)",
        padding: "var(--s-5)",
      }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--clay-earth)" }}>
          DÉPOSER UNE SENSATION
        </div>
        <h2 className="h2-section mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          {zone.label} · {view === "front" ? "face avant" : "face arrière"}
        </h2>

        {/* Intensity 1-5 */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>intensité</div>
          <div className="row gap-s" style={{ flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n}
                className={"chip " + (intensity === n ? "active" : "")}
                onClick={() => setIntensity(n)}
                style={{ minWidth: 40 }}
              >{n}</button>
            ))}
            <span className="meta op-70" style={{ marginLeft: 8, fontStyle: "italic" }}>
              {["", "à peine", "léger", "présent", "fort", "envahissant"][intensity]}
            </span>
          </div>
        </div>

        {/* Valence */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>tonalité (négative ↔ positive)</div>
          <input type="range" min="-1" max="1" step="0.1" value={valence}
            onChange={(e) => setValence(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--silk-gold)" }} />
          <div className="row" style={{ justifyContent: "space-between", fontSize: 11, opacity: 0.7 }}>
            <span>douleur · serrement</span>
            <span>neutre</span>
            <span>chaleur · ouverture</span>
          </div>
        </div>

        {/* Side */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>côté (optionnel)</div>
          <div className="row gap-s" style={{ flexWrap: "wrap" }}>
            {[
              { v: null, l: "—" },
              { v: "left", l: "gauche" },
              { v: "right", l: "droite" },
              { v: "center", l: "centre" },
              { v: "both", l: "les deux" },
            ].map((s) => (
              <button key={String(s.v)}
                className={"chip " + (side === s.v ? "active" : "")}
                onClick={() => setSide(s.v)}
              >{s.l}</button>
            ))}
          </div>
        </div>

        {/* Autre — précise (toujours visible, résout les zones non-canoniques) */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>autre — précise (optionnel)</div>
          <input
            type="text"
            placeholder="ex : main droite, paupière gauche, plante du pied…"
            value={zoneCustomText}
            onChange={(e) => setZoneCustomText(e.target.value)}
            className="field-input"
            maxLength={120}
          />
          <div className="meta op-70" style={{ fontSize: 10.5, marginTop: 4, fontStyle: "italic" }}>
            si la zone que tu veux marquer n'est pas dans la silhouette
          </div>
        </div>

        {/* Sensation */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>sensation (libre)</div>
          <textarea
            placeholder="ex : un noeud qui tourne, une chaleur lente, un creux…"
            value={sensationText}
            onChange={(e) => setSensationText(e.target.value)}
            className="field-textarea"
            style={{ minHeight: 70 }}
          />
        </div>

        {/* Context */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>contexte (optionnel)</div>
          <input
            type="text"
            placeholder="ex : juste après le rêve, en parlant à X…"
            value={contextText}
            onChange={(e) => setContextText(e.target.value)}
            className="field-input"
          />
        </div>

        {/* Trigger */}
        <div className="mb-m">
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>déclencheur (optionnel)</div>
          <input
            type="text"
            placeholder="ex : un mot, une image, un son…"
            value={triggerText}
            onChange={(e) => setTriggerText(e.target.value)}
            className="field-input"
          />
        </div>

        {err && (
          <div className="meta mb-m" style={{ color: "var(--ember-live)" }}>erreur : {err}</div>
        )}

        <div className="row gap-m mt-m" style={{ justifyContent: "flex-end" }}>
          <button className="btn-text" onClick={onClose} disabled={saving}>annuler</button>
          <button className="btn-ghost" onClick={submit} disabled={saving}>
            {saving ? "dépose…" : "déposer"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Sub-component : marker line ──────────────────────────────
const MarkerLine = ({ marker, onDelete, isMostRecent = false, onAskReading }) => {
  const dt = new Date(marker.created_at);
  const when = window.DreamAPI?._relativeWhen?.(marker.created_at) || dt.toLocaleDateString();
  return (
    <div style={{ borderLeft: "1px solid var(--clay-earth)", paddingLeft: 10 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--ash-light)" }}>
          {when} · int. {marker.intensity}/5{marker.valence !== null ? ` · v ${marker.valence?.toFixed?.(1) ?? marker.valence}` : ""}
        </div>
        <button className="btn-text" onClick={onDelete} style={{ fontSize: 11, color: "var(--ash-light)" }}>×</button>
      </div>
      {marker.sensation_text && (
        <div className="body" style={{ fontSize: 13, fontStyle: "italic", textWrap: "pretty" }}>
          « {marker.sensation_text} »
        </div>
      )}
      {marker.context_text && (
        <div className="meta op-70" style={{ fontSize: 11.5, textWrap: "pretty" }}>
          contexte : {marker.context_text}
        </div>
      )}
      {/* F.3 — bouton "veux-tu une lecture ?" sur le marker le plus récent */}
      {isMostRecent && onAskReading && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={onAskReading}
            style={{
              background: "transparent",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))",
              color: "var(--silk-gold)",
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 13, padding: "5px 12px", cursor: "pointer",
              borderRadius: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 10%, transparent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
          >
            ✦ veux-tu une lecture ?
          </button>
        </div>
      )}
    </div>
  );
};

// ── F.3 — Sub-component : BodyReadingModal (3 voix MATTER) ─────
// Appelle window.DreamAPI.bodyOracleReading({ marker_id })
// Réutilise window.MatterBubble (paper/stone/silk) exposé par screens-dream-chat-home.jsx
const BodyReadingModal = ({ marker, onClose }) => {
  const [state, setState] = uSS({ loading: true, reading: null, framing: null, error: null });

  uSE(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await window.DreamAPI.bodyOracleReading({
          marker_id: marker?.id || null,
          zone: marker?.zone || null,
          sensation_text: marker?.sensation_text || null,
        });
        if (cancelled) return;
        if (!res || res._seed) {
          setState({ loading: false, reading: null, framing: null, error: "la lecture est silencieuse pour l'instant" });
          return;
        }
        if (res.reading) {
          setState({ loading: false, reading: res.reading, framing: res.framing || null, error: null });
        } else {
          setState({ loading: false, reading: null, framing: null, error: "réponse inattendue" });
        }
      } catch (e) {
        if (!cancelled) setState({ loading: false, reading: null, framing: null, error: (e && e.message) || "erreur" });
      }
    })();
    return () => { cancelled = true; };
  }, [marker?.id]);

  const Bubble = window.MatterBubble;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 90,
      background: "color-mix(in oklch, var(--obsidian) 75%, transparent)",
      display: "grid", placeItems: "center", padding: 16,
      backdropFilter: "blur(6px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        maxWidth: 540, width: "100%", maxHeight: "85vh", overflowY: "auto",
        background: "var(--night-warm)",
        border: "1px solid var(--ash-mid)",
        padding: "var(--s-5)",
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        <div className="meta" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--silk-gold)" }}>
          ✦ LECTURE DU CORPS · 3 ANGLES
        </div>
        <h2 className="h2-section" style={{ fontFamily: "var(--serif)", fontStyle: "italic", margin: 0, fontSize: 22 }}>
          ce que ton corps tient — trois voix
        </h2>
        {marker && (
          <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13 }}>
            zone : {marker.zone}{marker.side ? ` · ${marker.side}` : ""} · int. {marker.intensity}/5
          </div>
        )}

        {state.loading && (
          <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)", padding: "20px 0" }}>
            la Forêt prend son souffle…
          </div>
        )}

        {state.error && !state.loading && (
          <div className="meta" style={{ color: "var(--ember-live)", fontStyle: "italic" }}>
            {state.error}
          </div>
        )}

        {state.framing && (
          <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)", fontSize: 13.5, lineHeight: 1.55, textWrap: "pretty" }}>
            {state.framing}
          </p>
        )}

        {state.reading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {["paper", "stone", "silk"].map((k) => {
              const v = state.reading[k];
              if (!v) return null;
              const text = typeof v === "string" ? v : (v.text || "");
              const voice = typeof v === "object" ? (v.voice || v.lineage || null) : null;
              if (!text) return null;
              if (Bubble) {
                return (
                  <Bubble key={k} role="assistant" matter={k} voiceAttribution={voice}>
                    {text}
                  </Bubble>
                );
              }
              // Fallback si MatterBubble pas chargé
              return (
                <div key={k} style={{
                  paddingLeft: 12,
                  borderLeft: `2px solid ${k === "paper" ? "var(--paper-warm)" : k === "stone" ? "var(--stone-cool)" : "var(--silk-gold)"}`,
                }}>
                  <div className="meta" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--silk-gold)", marginBottom: 4 }}>
                    {k.toUpperCase()}{voice ? ` · ${voice}` : ""}
                  </div>
                  <p style={{ fontFamily: "var(--serif)", fontSize: 14.5, lineHeight: 1.6, textWrap: "pretty", margin: 0 }}>
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div className="row gap-s" style={{ justifyContent: "flex-end", marginTop: 8 }}>
          <button className="btn-ghost" onClick={onClose}>refermer</button>
        </div>
      </div>
    </div>
  );
};

const ReadingBlock = ({ author, text }) => (
  <div style={{ paddingLeft: "var(--s-3)", borderLeft: "1px solid var(--clay-earth)" }}>
    <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
      {author}
    </div>
    <p className="body" style={{ textWrap: "pretty" }}>{text}</p>
  </div>
);

function labelFor(zoneId, view) {
  const arr = view === "back" ? SILHOUETTE_ZONES_BACK : SILHOUETTE_ZONES_FRONT;
  return arr.find((z) => z.id === zoneId)?.label || zoneId;
}

// ═════════════════════════════════════════════════════════════
// CONTE-MIROIR (Bible §17.4) — refonte 2026-04-26
// 100% contes réels (red line Tim) — RPC vector + résonance user
// ═════════════════════════════════════════════════════════════

const ConteMiroirScreen = ({ go }) => {
  const [tales, setTales] = uSS([]);
  const [mode, setMode] = uSS(null); // 'vector' | 'heuristic' | 'recency'
  const [loading, setLoading] = uSS(true);
  const [err, setErr] = uSS(null);
  const [openTale, setOpenTale] = uSS(null); // for full-text modal
  const [resonances, setResonances] = uSS({}); // { tale_id: 'chants' | ... }
  const [latestKairos, setLatestKairos] = uSS(null);

  uSE(() => {
    let cancelled = false;
    (async () => {
      try {
        const seed = (window.seedEntries || [])[0];
        let dreamId = null;
        // Try to fetch latest real kairos
        try {
          const list = await window.DreamAPI.listKairos({ limit: 1 });
          dreamId = list?.kairos?.[0]?.id || seed?.id;
          setLatestKairos(list?.kairos?.[0] || seed);
        } catch {
          dreamId = seed?.id;
          setLatestKairos(seed);
        }
        if (!dreamId) {
          setLoading(false);
          return;
        }
        const res = await window.DreamAPI.matchTales(dreamId, 5);
        if (cancelled) return;
        setMode(res?.mode || null);
        setTales(res?.tales || []);
      } catch (e) {
        setErr(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const sendResonance = async (tale, kind) => {
    setResonances((r) => ({ ...r, [tale.id]: kind }));
    try {
      await window.DreamAPI.submitTaleResonance({
        tale_id: tale.id,
        kairos_id: latestKairos?.id || null,
        resonance: kind,
      });
    } catch (e) {
      console.warn("[conte] resonance failed:", e?.message);
    }
  };

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("kairos")} label="" />
      <div className="frame">
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          contes-miroirs
        </div>
        <h1 className="h1-seuil mb-m">ton rêve est déjà passé par ces forêts</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", maxWidth: 620 }}>
          voici quelques récits qui touchent à des éléments de ton rêve. Lequel te chante ? Aucun, peut-être. Ils ne disent pas ton rêve — ils le tiennent, comme une famille de récits.
        </p>

        {/* Cadrage red-line */}
        <div className="card mb-l" style={{ padding: "var(--s-4)", background: "color-mix(in oklch, var(--obsidian) 30%, transparent)" }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--silk-gold)" }}>
            principe
          </div>
          <p className="body" style={{ textWrap: "pretty" }}>
            Les contes-miroirs ne sont <span style={{ fontStyle: "italic", color: "var(--bone)" }}>jamais</span> générés par une intelligence artificielle. Ils sont puisés dans un corpus documenté de traditions orales et écrites — Grimm, Perrault, Estés, Campbell, Attar, Andersen, Iroquois, Bushman, Senoi, et bien d'autres. Nous te les apparions — nous n'en fabriquons pas.
          </p>
          {mode && (
            <div className="meta op-70 mt-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5 }}>
              mode d'appariement : {mode === "vector" ? "résonance sémantique vectorielle" : mode === "heuristic" ? "appariement par motifs" : "proximité atmosphérique"}
            </div>
          )}
        </div>

        {loading && (
          <div className="card" style={{ padding: "var(--s-4)" }}>
            <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              la sous-forêt cherche…
            </div>
          </div>
        )}

        {err && (
          <div className="card" style={{ padding: "var(--s-4)", borderColor: "var(--ember-live)" }}>
            <div className="meta" style={{ color: "var(--ember-live)" }}>erreur : {err}</div>
          </div>
        )}

        {!loading && tales.length === 0 && !err && (
          <div className="card" style={{ padding: "var(--s-4)" }}>
            <p className="body op-70" style={{ textWrap: "pretty" }}>
              Pas de conte trouvé. Dépose un rêve, puis reviens — la sous-forêt aura quelque chose à te tendre.
            </p>
          </div>
        )}

        {/* Cards verticales 3-5 contes */}
        {!loading && tales.map((t) => {
          const myReson = resonances[t.id];
          return (
            <div key={t.id} className="conte-card mb-m" style={{
              padding: "var(--s-5)",
              borderLeft: myReson === "chants" ? "3px solid var(--silk-gold)" : "1px solid var(--ash-deep)",
              background: myReson === "chants" ? "color-mix(in oklch, var(--silk-gold) 4%, transparent)" : "transparent",
              transition: "all 380ms ease",
            }}>
              <div className="row mb-m" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--s-3)" }}>
                <div className="conte-attribution" style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em", color: "var(--ash-light)" }}>
                  {t.tradition || "tradition"}
                </div>
                {Array.isArray(t.match_reasons) && t.match_reasons.length > 0 && (
                  <span className="conte-match" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.04em", color: "var(--clay-earth)" }}>
                    apparié sur : {t.match_reasons.slice(0, 3).join(" · ")}
                  </span>
                )}
              </div>
              <h3 className="h3-lecture mb-m" style={{ fontFamily: "var(--serif)", fontSize: 23, fontStyle: "italic" }}>
                {t.title}
              </h3>
              {t.summary && (
                <p className="body mb-m" style={{ textWrap: "pretty", fontSize: 14, fontStyle: "italic", color: "var(--ash-light)" }}>
                  {t.summary}
                </p>
              )}
              <p className="body mb-l" style={{ textWrap: "pretty", fontSize: 16, lineHeight: 1.65 }}>
                {(t.full_text || t.text || "").slice(0, 380)}
                {(t.full_text || "").length > 380 && "…"}
              </p>

              <div className="row gap-s" style={{ flexWrap: "wrap", alignItems: "center" }}>
                <button
                  className={"btn-ghost " + (myReson === "chants" ? "active" : "")}
                  onClick={() => sendResonance(t, "chants")}
                  style={myReson === "chants" ? { borderColor: "var(--silk-gold)", color: "var(--silk-gold)" } : undefined}
                >
                  {myReson === "chants" ? "✓ ce conte chante" : "ce conte chante"}
                </button>
                <button className="btn-text" onClick={() => sendResonance(t, "silent")}>
                  pas pour moi
                </button>
                {(t.full_text || "").length > 380 && (
                  <button className="btn-text" onClick={() => setOpenTale(t)}>
                    lire le conte entier →
                  </button>
                )}
              </div>

              {(t.source || t.source_book_slug) && (
                <div className="meta mt-m op-70" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.05em" }}>
                  source : {t.source || t.source_book_slug}
                </div>
              )}
            </div>
          );
        })}

        <div className="row gap-s mt-l" style={{ flexWrap: "wrap" }}>
          <button className="btn-ghost" onClick={() => go("kairos")}>retourner au kairos</button>
        </div>
      </div>

      {/* Modal full text */}
      {openTale && (
        <div onClick={() => setOpenTale(null)} style={{
          position: "fixed", inset: 0, zIndex: 80,
          background: "color-mix(in oklch, var(--obsidian) 75%, transparent)",
          display: "grid", placeItems: "center", padding: 16,
          backdropFilter: "blur(6px)",
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            maxWidth: 640, width: "100%", maxHeight: "88vh", overflowY: "auto",
            background: "var(--night-warm)",
            border: "1px solid var(--ash-mid)",
            padding: "var(--s-5)",
          }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--clay-earth)" }}>
              {openTale.tradition}
            </div>
            <h2 className="h2-section mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 26 }}>
              {openTale.title}
            </h2>
            <p className="body mb-l" style={{ textWrap: "pretty", fontSize: 16, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {openTale.full_text || openTale.text || openTale.summary}
            </p>
            <div className="meta op-70 mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.05em" }}>
              source : {openTale.source || openTale.source_book_slug}
            </div>
            <div className="row gap-s" style={{ justifyContent: "flex-end" }}>
              <button className="btn-text" onClick={() => setOpenTale(null)}>refermer</button>
            </div>
          </div>
        </div>
      )}

      <window.FeedbackFloat />
    </div>
  );
};

// ═════════════════════════════════════════════════════════════
// REENTRY SCREEN (Active Dreaming / Moss / Lightning) — inchangé
// ═════════════════════════════════════════════════════════════

const ReentryScreen = ({ go }) => {
  const [phase, setPhase] = uSS("gate"); // gate | choice | lightning | moss | closing
  const [gateAnswers, setGateAnswers] = uSS({ safe: null, sober: null, anchored: null });
  const [choice, setChoice] = uSS(null);
  const entry = (window.seedEntries || [])[0];

  const allSafe = Object.values(gateAnswers).every(v => v === true);

  if (phase === "gate") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => go("kairos")} label="" />
        <div className="frame" style={{ maxWidth: 540 }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
            gate · avant toute réentrée
          </div>
          <h1 className="h1-seuil mb-l">trois questions, honnêtement</h1>
          <p className="body op-70 mb-l" style={{ textWrap: "pretty" }}>
            La réentrée onirique peut rouvrir ce que le rêve a déjà touché. Nous ne commençons que si le sol est là.
          </p>

          <div className="stack gap-l">
            <GateQuestion
              q="es-tu dans un lieu sûr, où personne ne te dérangera pendant 20 minutes ?"
              value={gateAnswers.safe}
              onChange={(v) => setGateAnswers(a => ({ ...a, safe: v }))}
            />
            <GateQuestion
              q="es-tu sobre — pas d'alcool, pas de substance en ce moment ?"
              value={gateAnswers.sober}
              onChange={(v) => setGateAnswers(a => ({ ...a, sober: v }))}
            />
            <GateQuestion
              q="as-tu quelqu'un à qui écrire ou appeler si ça remue fort ?"
              value={gateAnswers.anchored}
              onChange={(v) => setGateAnswers(a => ({ ...a, anchored: v }))}
            />
          </div>

          {Object.values(gateAnswers).includes(false) && (
            <div className="card mt-l" style={{ borderColor: "var(--ember-live)", background: "color-mix(in oklch, var(--ember-live) 5%, transparent)" }}>
              <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
                pas ce soir
              </div>
              <p className="body" style={{ textWrap: "pretty" }}>
                Ce n'est pas un échec. La réentrée demande un sol. Reviens quand il sera là. En attendant, tu peux déposer une note, demander à la narratrice, ou simplement refermer.
              </p>
              <div className="row gap-m mt-m">
                <button className="btn-ghost" onClick={() => go("capture")}>déposer plutôt</button>
                <button className="btn-text" onClick={() => go("home")}>refermer</button>
              </div>
            </div>
          )}

          {allSafe && (
            <div className="row mt-l" style={{ justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={() => setPhase("choice")}>continuer</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === "choice") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => setPhase("gate")} label="" />
        <div className="frame" style={{ maxWidth: 560 }}>
          <h1 className="h1-seuil mb-l">quel chemin ce soir ?</h1>
          <p className="body op-70 mb-l" style={{ textWrap: "pretty" }}>
            Deux pratiques, inspirées du travail de Robert Moss. Tu peux arrêter à tout moment, sans justification.
          </p>

          <div className="stack gap-m">
            <button onClick={() => { setChoice("lightning"); setPhase("lightning"); }}
              style={{
                textAlign: "left", padding: "var(--s-5)",
                border: "1px solid var(--ash-deep)",
                background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
              }}>
              <div className="h4-repere mb-s" style={{ color: "var(--bone)" }}>lightning dreamwork</div>
              <div className="body op-70" style={{ textWrap: "pretty" }}>
                Court. 8 minutes. Une question simple au rêve, suivie d'une écoute. Pour démêler une image qui te hante.
              </div>
            </button>

            <button onClick={() => { setChoice("moss"); setPhase("moss"); }}
              style={{
                textAlign: "left", padding: "var(--s-5)",
                border: "1px solid var(--ash-deep)",
                background: "color-mix(in oklch, var(--night-warm) 40%, transparent)",
              }}>
              <div className="h4-repere mb-s" style={{ color: "var(--bone)" }}>active dreaming — réentrée</div>
              <div className="body op-70" style={{ textWrap: "pretty" }}>
                20 minutes. Retourner dans le rêve à l'endroit précis, avec l'intention de rencontrer — pas d'interpréter.
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "lightning") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => setPhase("choice")} label="" />
        <div className="frame text-center" style={{ maxWidth: 540 }}>
          <div className="reentry-circle mb-xl">
            <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 20, color: "var(--bone)" }}>
              respire
            </div>
          </div>
          <h2 className="h2-section mb-l">une question unique</h2>
          <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty", maxWidth: 480, margin: "0 auto var(--s-5)" }}>
            "{entry?.text.split(".")[0]}."
          </p>
          <p className="body mb-xl" style={{ maxWidth: 480, margin: "0 auto", textWrap: "pretty" }}>
            Pose une seule question à ce rêve. Ne cherche pas la bonne formulation. Puis reste immobile pendant huit minutes. Ce qui vient, vient.
          </p>
          <div className="row gap-m" style={{ justifyContent: "center" }}>
            <button className="btn-ghost" onClick={() => setPhase("closing")}>c'est fait</button>
            <button className="btn-text" onClick={() => setPhase("choice")}>arrêter</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "moss") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
        <window.TopNav showBack onBack={() => setPhase("choice")} label="" />
        <div className="frame" style={{ maxWidth: 560 }}>
          <div className="reentry-gate mb-l">
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              seuil
            </div>
            <p className="body" style={{ textWrap: "pretty" }}>
              Ferme les yeux. Reviens au moment exact du rêve — pas au début, au moment qui a appelé. Ce n'est pas une histoire. C'est un lieu.
            </p>
          </div>

          <div className="stack gap-m mb-l">
            <ReentryStep n="1" text="reviens à l'image. pas à l'intrigue. l'image." />
            <ReentryStep n="2" text="remarque ce qui t'avait échappé la première fois — une odeur, un angle, ce qui se passe derrière." />
            <ReentryStep n="3" text="parle à ce qui est là. pas pour obtenir. pour rencontrer." />
            <ReentryStep n="4" text="quand tu sens que c'est fini — c'est fini. note trois mots seulement." />
          </div>

          <div className="card mb-l" style={{ borderColor: "var(--ember-live)", background: "color-mix(in oklch, var(--ember-live) 5%, transparent)" }}>
            <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ember-live)" }}>
              si ça tangue
            </div>
            <p className="body" style={{ textWrap: "pretty" }}>
              Ouvre les yeux. Pose les pieds au sol. Bois. Écris à quelqu'un. Tu peux refermer et revenir une autre nuit. Ce rêve t'attendra.
            </p>
          </div>

          <div className="row gap-m" style={{ justifyContent: "center" }}>
            <button className="btn-ghost" onClick={() => setPhase("closing")}>je reviens</button>
            <button className="btn-text" onClick={() => setPhase("choice")}>arrêter</button>
          </div>
        </div>
      </div>
    );
  }

  // closing
  return (
    <div className="stage screen-enter" style={{ background: "var(--obsidian)" }}>
      <window.TopNav showBack onBack={() => go("kairos")} label="" />
      <div className="frame text-center" style={{ maxWidth: 520, paddingTop: "var(--s-7)" }}>
        <div className="breath mb-xl" style={{ width: 80, height: 80 }} />
        <h2 className="h2-section mb-m">refermer doucement</h2>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty" }}>
          Ne cherche pas à comprendre tout de suite. Écris trois mots, ou rien.
        </p>
        <textarea className="field-textarea mb-l"
          placeholder="trois mots de ce qui est venu, ou laisse vide"
          style={{ minHeight: 80 }} />
        <div className="row gap-m" style={{ justifyContent: "center" }}>
          <button className="btn-ghost" onClick={() => go("kairos")}>déposer et sortir</button>
          <button className="btn-text" onClick={() => go("home")}>sortir sans déposer</button>
        </div>
      </div>
    </div>
  );
};

const GateQuestion = ({ q, value, onChange }) => (
  <div>
    <div className="body mb-s" style={{ textWrap: "pretty" }}>{q}</div>
    <div className="row gap-s">
      <button
        className={"chip " + (value === true ? "active" : "")}
        onClick={() => onChange(true)}>oui</button>
      <button
        className={"chip " + (value === false ? "active" : "")}
        onClick={() => onChange(false)}>non / pas sûr</button>
    </div>
  </div>
);

const ReentryStep = ({ n, text }) => (
  <div className="row gap-m" style={{ alignItems: "flex-start" }}>
    <div style={{
      flex: "0 0 28px",
      fontFamily: "var(--mono)", fontSize: 14, color: "var(--silk-gold)",
      textAlign: "center", borderRight: "1px solid var(--ash-deep)",
      padding: "2px 8px 2px 0",
    }}>
      {n}
    </div>
    <div className="body" style={{ textWrap: "pretty" }}>{text}</div>
  </div>
);

Object.assign(window, { OracleCorpsScreen, ConteMiroirScreen, ReentryScreen });
