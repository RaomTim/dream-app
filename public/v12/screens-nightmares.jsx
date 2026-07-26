/* global React, window */
// ══════════════════════════════════════════════════════════════
// 2026-04-26 — Sanctuaire des cauchemars & deuil (Bible §17.3)
// Yeshua — agent code 1M
//
// MODE INTÉGRÉ trauma-aware par défaut + ÉCRAN DÉDIÉ accessible :
//   - via /privacy (lien)
//   - via auto-detection silencieuse (3 kairos valence < -0.6 sur 14j)
//
// Posture : pas d'interprétation jamais. Accueil pur. EXIT_TO_HUMAN très visible.
// Esthétique noir mat plus profond que le reste de Dream (PAS dark-first oklch).
// ══════════════════════════════════════════════════════════════

(function setupNightmaresScreens() {
  const { useState: uS, useEffect: uE, useRef: uR } = React;

  // ── Tokens noir mat ────────────────────────────────────────
  const NX = {
    bg: "#040404",
    bgPanel: "#0A0A0B",
    bgPanel2: "#0F0F10",
    border: "#1A1A1C",
    borderActive: "#2A2A2D",
    text: "#E6E0D2",
    textDim: "#9A8F80",
    textMuted: "#5A5550",
    accent: "#C9B098",      // silk-gold doux
    danger: "#D17A6E",      // ember-soft non-agressif
    serif: "'EB Garamond', Georgia, serif",
    mono: "'JetBrains Mono', ui-monospace, Menlo, monospace",
  };

  // ── EXIT_TO_HUMAN ressources par pays ───────────────────────
  const EXIT_RESOURCES = {
    FR: {
      country: "France",
      lines: [
        { name: "3114 — Numéro national de prévention du suicide", phone: "3114", note: "24/7, gratuit, anonyme" },
        { name: "SOS Amitié", phone: "09 72 39 40 50", note: "écoute 24/7" },
        { name: "SOS Suicide Phénix", phone: "01 40 44 46 45", note: "tous les jours" },
        { name: "Suicide Écoute", phone: "01 45 39 40 00", note: "24/7" },
        { name: "Croix-Rouge Écoute", phone: "0 800 858 858", note: "soutien psy général" },
      ],
      annuaires: [
        { name: "Annuaire EMDR France", url: "https://www.emdr-france.org/" },
        { name: "Praticiens Somatic Experiencing France", url: "https://traumahealing.fr/" },
        { name: "IFS France (Internal Family Systems)", url: "https://ifs-france.fr/" },
        { name: "Société Française de Psychanalyse (annuaire)", url: "https://www.spp.asso.fr/" },
      ],
    },
    BE: {
      country: "Belgique",
      lines: [
        { name: "Centre de Prévention du Suicide", phone: "0800 32 123", note: "24/7 gratuit" },
        { name: "Télé-Accueil", phone: "107", note: "24/7" },
      ],
      annuaires: [
        { name: "EMDR Belgique", url: "https://www.emdr-belgium.be/" },
      ],
    },
    CH: {
      country: "Suisse",
      lines: [
        { name: "La Main Tendue", phone: "143", note: "24/7" },
        { name: "Pro Juventute (jeunes)", phone: "147", note: "24/7" },
      ],
      annuaires: [
        { name: "EMDR Suisse", url: "https://www.emdr-schweiz.ch/" },
      ],
    },
    CA: {
      country: "Canada (FR)",
      lines: [
        { name: "Suicide Action Canada", phone: "1-833-456-4566", note: "24/7" },
        { name: "Tel-Aide", phone: "514-935-1101", note: "Québec" },
      ],
      annuaires: [
        { name: "EMDR Canada", url: "https://emdrcanada.org/" },
      ],
    },
  };

  // ── StageDark wrapper ──────────────────────────────────────
  function StageNight({ children }) {
    return (
      <div style={{
        minHeight: "100vh",
        background: NX.bg,
        color: NX.text,
        fontFamily: NX.serif,
        padding: "20px 16px 100px",
      }}>
        {children}
      </div>
    );
  }

  // ── EXIT_TO_HUMAN bandeau supérieur ────────────────────────
  function ExitToHumanBanner({ countryCode, onChangeCountry }) {
    const [open, setOpen] = uS(false);
    const cc = countryCode || "FR";
    const res = EXIT_RESOURCES[cc] || EXIT_RESOURCES.FR;

    return (
      <div style={{
        background: NX.bgPanel2,
        border: `1px solid ${NX.borderActive}`,
        padding: "14px 16px",
        marginBottom: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
          <div style={{ fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.1em", color: NX.accent }}>
            SI ÇA URGE — APPELER QUELQU'UN DE CHAIR
          </div>
          <select
            value={cc}
            onChange={(e) => onChangeCountry && onChangeCountry(e.target.value)}
            style={{
              background: NX.bgPanel, color: NX.textDim,
              border: `1px solid ${NX.border}`, fontFamily: NX.mono, fontSize: 11,
              padding: "3px 6px",
            }}>
            {Object.keys(EXIT_RESOURCES).map((k) => (
              <option key={k} value={k}>{EXIT_RESOURCES[k].country}</option>
            ))}
          </select>
        </div>

        <div style={{ marginTop: 10 }}>
          {res.lines.slice(0, open ? res.lines.length : 2).map((l, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <a href={`tel:${l.phone.replace(/\s/g, "")}`} style={{
                color: NX.text, textDecoration: "none",
                fontFamily: NX.serif, fontSize: 15, fontStyle: "italic",
              }}>
                {l.name}
                <span style={{ marginLeft: 8, fontFamily: NX.mono, fontSize: 13, color: NX.accent }}>
                  {l.phone}
                </span>
              </a>
              <div style={{ fontSize: 11, color: NX.textMuted, fontFamily: NX.mono }}>
                {l.note}
              </div>
            </div>
          ))}
          {!open && res.lines.length > 2 && (
            <button onClick={() => setOpen(true)} style={{
              background: "transparent", border: "none",
              color: NX.textDim, fontFamily: NX.mono, fontSize: 11,
              cursor: "pointer", padding: 0, marginTop: 4,
              textDecoration: "underline",
            }}>+ {res.lines.length - 2} autres lignes</button>
          )}
        </div>

        {open && (
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${NX.border}` }}>
            <div style={{ fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.08em", color: NX.textDim, marginBottom: 8 }}>
              ANNUAIRES PRATICIENS TRAUMA-CURÉS
            </div>
            {res.annuaires.map((a, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <a href={a.url} target="_blank" rel="noopener noreferrer" style={{
                  color: NX.text, fontFamily: NX.serif, fontSize: 14,
                  textDecoration: "underline", textDecorationColor: NX.borderActive,
                }}>
                  {a.name} →
                </a>
              </div>
            ))}
            <div style={{ marginTop: 8, fontSize: 11, color: NX.textMuted, fontFamily: NX.mono }}>
              modalités recommandées : SE (Somatic Experiencing), IFS (Internal Family Systems), EMDR, Sensorimotor, jungien
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Sanctuaire principal ───────────────────────────────────
  const NightmaresScreen = ({ go }) => {
    const [pState, setPState] = uS(null);
    const [entries, setEntries] = uS([]);
    const [filter, setFilter] = uS("both"); // both | nightmare | grief
    const [loading, setLoading] = uS(true);
    const [showFreezeModal, setShowFreezeModal] = uS(false);
    const [showMarkModal, setShowMarkModal] = uS(null); // entry to mark/edit
    const [countryCode, setCountryCode] = uS(() => {
      try { return localStorage.getItem("dream:nightmares:country") || "FR"; }
      catch { return "FR"; }
    });

    const refresh = async () => {
      try {
        setLoading(true);
        const [pr, lr] = await Promise.all([
          window.DreamAPI.getProtectionState(),
          window.DreamAPI.listMarkedNightmares({ type: filter, limit: 100 }),
        ]);
        setPState(pr?.state || null);
        setEntries(lr?.entries || []);
      } catch (e) {
        console.warn("[Nightmares] refresh failed:", e?.message);
      } finally {
        setLoading(false);
      }
    };

    uE(() => { refresh(); }, [filter]);

    const handleChangeCountry = async (cc) => {
      setCountryCode(cc);
      try { localStorage.setItem("dream:nightmares:country", cc); } catch {}
      await window.DreamAPI.updateProtectionState({ country_code: cc });
    };

    const isFrozen = pState?.is_frozen;
    const freezeUntil = pState?.freeze_until ? new Date(pState.freeze_until) : null;
    const daysRemaining = freezeUntil
      ? Math.max(0, Math.ceil((freezeUntil.getTime() - Date.now()) / (24 * 3600 * 1000)))
      : 0;

    return (
      <StageNight>
        {/* TopBar simple */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 16, paddingBottom: 10,
          borderBottom: `1px solid ${NX.border}`,
        }}>
          <button onClick={() => go("home")} style={{
            background: "transparent",
            border: `1px solid ${NX.border}`,
            color: NX.textDim,
            fontFamily: NX.mono, fontSize: 11,
            padding: "5px 10px", cursor: "pointer",
            letterSpacing: "0.04em",
          }}>← retour</button>
          <div style={{ fontFamily: NX.mono, fontSize: 10, color: NX.textMuted, letterSpacing: "0.1em" }}>
            SANCTUAIRE
          </div>
        </div>

        {/* Header sobre */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 12, color: NX.textDim, marginBottom: 6 }}>
            sanctuaire des cauchemars & deuil
          </div>
          <h1 style={{
            fontFamily: NX.serif, fontWeight: 300, fontStyle: "italic",
            fontSize: 30, lineHeight: 1.25, color: NX.text,
            margin: 0, textWrap: "pretty",
          }}>
            il y a des rêves qui pèsent. Tu peux les déposer ici, sans rien attendre.
          </h1>
          <p style={{
            fontFamily: NX.serif, fontSize: 15, color: NX.textDim,
            marginTop: 14, lineHeight: 1.65, textWrap: "pretty",
            maxWidth: 580,
          }}>
            Ici, rien n'est interprété. Aucun écho prophétique, aucune voix de la Forêt, aucun portrait — juste l'espace pour que ce qui pèse soit posé.
          </p>
        </div>

        {/* EXIT_TO_HUMAN — toujours en haut */}
        <ExitToHumanBanner
          countryCode={countryCode}
          onChangeCountry={handleChangeCountry}
        />

        {/* État protection (freeze) */}
        <div style={{
          background: isFrozen
            ? `color-mix(in oklch, ${NX.accent} 8%, ${NX.bgPanel})`
            : NX.bgPanel,
          border: `1px solid ${isFrozen ? NX.accent : NX.border}`,
          padding: "14px 16px",
          marginBottom: 24,
        }}>
          <div style={{
            fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.1em",
            color: isFrozen ? NX.accent : NX.textDim,
            marginBottom: 8,
          }}>
            {isFrozen ? "MODE PROTECTION ACTIF" : "MODE PROTECTION"}
          </div>
          {isFrozen ? (
            <>
              <p style={{ fontFamily: NX.serif, fontSize: 15, fontStyle: "italic", margin: 0, marginBottom: 10 }}>
                Les révélations Forêt, échos prophétiques, portrait, et propositions de la narratrice sont gelés pendant {daysRemaining} jour{daysRemaining > 1 ? "s" : ""}.
              </p>
              <p style={{ fontFamily: NX.serif, fontSize: 13, color: NX.textDim, margin: 0, marginBottom: 12, textWrap: "pretty" }}>
                Tu peux toujours déposer des rêves. Mais Dream se tient à distance — pas de propositions, pas d'analyses. Juste l'archive de tes mots.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={async () => {
                  await window.DreamAPI.liftProtectionFreeze();
                  refresh();
                }} style={btnGhost(NX)}>
                  lever le gel
                </button>
              </div>
            </>
          ) : (
            <>
              <p style={{ fontFamily: NX.serif, fontSize: 14, color: NX.textDim, margin: 0, marginBottom: 12, textWrap: "pretty" }}>
                Tu peux geler les propositions automatiques de Dream pendant 30 jours — utile en deuil, crise, traversée. Tu pourras toujours déposer ce qui vient.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => setShowFreezeModal(true)} style={btnPrimary(NX)}>
                  activer le mode protection
                </button>
              </div>
            </>
          )}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { v: "both", l: "tout" },
            { v: "nightmare", l: "cauchemars" },
            { v: "grief", l: "rêves de deuil" },
          ].map((t) => (
            <button key={t.v} onClick={() => setFilter(t.v)} style={{
              background: filter === t.v ? NX.bgPanel2 : "transparent",
              border: `1px solid ${filter === t.v ? NX.accent : NX.border}`,
              color: filter === t.v ? NX.accent : NX.textDim,
              fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.05em",
              padding: "6px 12px", cursor: "pointer",
            }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Liste entries */}
        {loading && (
          <div style={{ fontFamily: NX.serif, fontStyle: "italic", color: NX.textDim, padding: 16 }}>
            chargement…
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div style={{
            background: NX.bgPanel,
            border: `1px solid ${NX.border}`,
            padding: 20,
          }}>
            <p style={{ fontFamily: NX.serif, fontStyle: "italic", color: NX.textDim, margin: 0, textWrap: "pretty" }}>
              {filter === "nightmare" ? "Aucun cauchemar marqué pour l'instant." :
               filter === "grief" ? "Aucun rêve de deuil marqué pour l'instant." :
               "Rien ici pour l'instant. Quand un rêve pèse, tu peux le marquer depuis sa fiche détail — il viendra se ranger ici."}
            </p>
          </div>
        )}

        {!loading && entries.map((e) => (
          <NightmareEntryCard
            key={e.id}
            entry={e}
            onMark={() => setShowMarkModal(e)}
            onOpen={() => go("kairos", e.id)}
          />
        ))}

        {/* Modal freeze */}
        {showFreezeModal && (
          <FreezeModal
            onClose={() => setShowFreezeModal(false)}
            onActivated={() => { setShowFreezeModal(false); refresh(); }}
          />
        )}

        {/* Modal mark */}
        {showMarkModal && (
          <MarkEntryModal
            entry={showMarkModal}
            onClose={() => setShowMarkModal(null)}
            onSaved={() => { setShowMarkModal(null); refresh(); }}
          />
        )}
      </StageNight>
    );
  };

  // ── Sub-component : NightmareEntryCard ─────────────────────
  function NightmareEntryCard({ entry, onMark, onOpen }) {
    const dt = new Date(entry.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
    const flagText = entry.is_nightmare && entry.is_grief_related ? "cauchemar · deuil"
                   : entry.is_nightmare ? "cauchemar"
                   : entry.is_grief_related ? "rêve de deuil"
                   : "";
    return (
      <div style={{
        background: NX.bgPanel,
        border: `1px solid ${NX.border}`,
        padding: 16,
        marginBottom: 12,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <div style={{ fontFamily: NX.mono, fontSize: 10, letterSpacing: "0.06em", color: NX.textMuted }}>
            {dt}
          </div>
          <div style={{ fontFamily: NX.mono, fontSize: 10, letterSpacing: "0.06em", color: NX.accent }}>
            {flagText.toUpperCase()}
          </div>
        </div>
        {entry.title && (
          <div style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 18, color: NX.text, marginBottom: 6 }}>
            {entry.title}
          </div>
        )}
        <p style={{ fontFamily: NX.serif, fontSize: 14, lineHeight: 1.6, color: NX.textDim, margin: 0, textWrap: "pretty" }}>
          {(entry.raw_text || "").slice(0, 240)}{(entry.raw_text || "").length > 240 ? "…" : ""}
        </p>
        {entry.grief_who && (
          <div style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 13, color: NX.accent, marginTop: 8 }}>
            pour : {entry.grief_who}
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={onOpen} style={btnGhost(NX)}>ouvrir</button>
          <button onClick={onMark} style={btnText(NX)}>modifier les marques</button>
        </div>
      </div>
    );
  }

  // ── Sub-component : FreezeModal ────────────────────────────
  function FreezeModal({ onClose, onActivated }) {
    const [days, setDays] = uS(30);
    const [isCrisis, setIsCrisis] = uS(false);
    const [saving, setSaving] = uS(false);

    return (
      <ModalShell onClose={onClose}>
        <div style={{ fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.1em", color: NX.accent, marginBottom: 8 }}>
          ACTIVER LE GEL
        </div>
        <h2 style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 22, marginBottom: 12, color: NX.text }}>
          combien de temps tu veux qu'on se taise ?
        </h2>
        <p style={{ fontFamily: NX.serif, fontSize: 14, color: NX.textDim, lineHeight: 1.6, marginBottom: 16, textWrap: "pretty" }}>
          Pendant ce temps : pas d'échos prophétiques, pas de Forêt, pas de portrait, pas de proposition. Juste l'archive de tes mots.
        </p>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: NX.mono, fontSize: 10, letterSpacing: "0.08em", color: NX.textDim, marginBottom: 8 }}>
            DURÉE
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[7, 14, 30, 60, 90].map((d) => (
              <button key={d} onClick={() => setDays(d)} style={{
                background: days === d ? NX.bgPanel2 : "transparent",
                border: `1px solid ${days === d ? NX.accent : NX.border}`,
                color: days === d ? NX.accent : NX.textDim,
                fontFamily: NX.mono, fontSize: 12,
                padding: "5px 10px", cursor: "pointer",
              }}>{d}j</button>
            ))}
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
          <input type="checkbox" checked={isCrisis} onChange={(e) => setIsCrisis(e.target.checked)}
            style={{ accentColor: NX.accent }} />
          <span style={{ fontFamily: NX.serif, fontSize: 14, color: NX.text, fontStyle: "italic" }}>
            je marque ceci comme crise (notation interne, ne change rien à toi)
          </span>
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <button onClick={onClose} disabled={saving} style={btnText(NX)}>annuler</button>
          <button disabled={saving} onClick={async () => {
            setSaving(true);
            try {
              await window.DreamAPI.enableProtectionFreeze({ days, is_crisis: isCrisis });
              onActivated && onActivated();
            } catch (e) {
              console.error(e);
            } finally { setSaving(false); }
          }} style={btnPrimary(NX)}>
            {saving ? "active…" : "activer le gel"}
          </button>
        </div>
      </ModalShell>
    );
  }

  // ── Sub-component : MarkEntryModal ────────────────────────
  function MarkEntryModal({ entry, onClose, onSaved }) {
    const [isNight, setIsNight] = uS(!!entry.is_nightmare);
    const [isGrief, setIsGrief] = uS(!!entry.is_grief_related);
    const [griefWho, setGriefWho] = uS(entry.grief_who || "");
    const [saving, setSaving] = uS(false);

    return (
      <ModalShell onClose={onClose}>
        <div style={{ fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.1em", color: NX.accent, marginBottom: 8 }}>
          MARQUER CE RÊVE
        </div>
        <h2 style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 20, marginBottom: 14, color: NX.text }}>
          {entry.title || (entry.raw_text || "").slice(0, 60) + "…"}
        </h2>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={isNight} onChange={(e) => setIsNight(e.target.checked)}
            style={{ accentColor: NX.accent }} />
          <span style={{ fontFamily: NX.serif, fontSize: 15, color: NX.text }}>
            cauchemar
          </span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
          <input type="checkbox" checked={isGrief} onChange={(e) => setIsGrief(e.target.checked)}
            style={{ accentColor: NX.accent }} />
          <span style={{ fontFamily: NX.serif, fontSize: 15, color: NX.text }}>
            rêve de deuil
          </span>
        </label>

        {isGrief && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: NX.mono, fontSize: 10, letterSpacing: "0.08em", color: NX.textDim, marginBottom: 6 }}>
              QUI AS-TU PERDU (OPTIONNEL)
            </div>
            <input type="text"
              value={griefWho}
              onChange={(e) => setGriefWho(e.target.value)}
              placeholder="ex : ma mère · un ami · un être encore vivant qui a changé de visage"
              style={{
                width: "100%",
                background: NX.bgPanel2,
                border: `1px solid ${NX.border}`,
                color: NX.text,
                fontFamily: NX.serif, fontSize: 14, fontStyle: "italic",
                padding: "8px 10px",
              }}
            />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
          <button onClick={onClose} disabled={saving} style={btnText(NX)}>annuler</button>
          <button disabled={saving} onClick={async () => {
            setSaving(true);
            try {
              await window.DreamAPI.markNightmare({
                kairos_id: entry.id,
                is_nightmare: isNight,
                is_grief_related: isGrief,
                grief_who: isGrief ? (griefWho.trim() || null) : null,
              });
              onSaved && onSaved();
            } catch (e) {
              console.error(e);
            } finally { setSaving(false); }
          }} style={btnPrimary(NX)}>
            {saving ? "enregistre…" : "enregistrer"}
          </button>
        </div>
      </ModalShell>
    );
  }

  // ── ModalShell ─────────────────────────────────────────────
  function ModalShell({ children, onClose }) {
    return (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 90,
        background: "rgba(0,0,0,0.85)",
        display: "grid", placeItems: "center", padding: 16,
        backdropFilter: "blur(8px)",
      }}>
        <div onClick={(e) => e.stopPropagation()} style={{
          maxWidth: 480, width: "100%", maxHeight: "85vh", overflowY: "auto",
          background: NX.bgPanel,
          border: `1px solid ${NX.borderActive}`,
          padding: 22,
        }}>
          {children}
        </div>
      </div>
    );
  }

  // ── Auto-detect proposal modal (rendered by app.jsx) ──────
  // Soft modal qui apparaît quand l'API auto-detect renvoie propose=true
  const NightmareAutoProposalModal = ({ onClose, onActivate, count }) => {
    return (
      <ModalShell onClose={onClose}>
        <div style={{ fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.1em", color: NX.accent, marginBottom: 8 }}>
          UNE PROPOSITION DOUCE
        </div>
        <h2 style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 22, marginBottom: 14, color: NX.text, lineHeight: 1.3 }}>
          Plusieurs de tes rêves récents ont été lourds.
        </h2>
        <p style={{ fontFamily: NX.serif, fontSize: 15, color: NX.textDim, lineHeight: 1.65, marginBottom: 16, textWrap: "pretty" }}>
          Tu peux activer un mode où Dream se fait silencieux pendant 30 jours — pas d'échos prophétiques, pas de Forêt, pas de portrait. Juste un espace pour déposer ce qui pèse, sans qu'on te propose quoi que ce soit.
        </p>
        <p style={{ fontFamily: NX.serif, fontSize: 13, color: NX.textMuted, lineHeight: 1.6, marginBottom: 18, textWrap: "pretty", fontStyle: "italic" }}>
          (cette proposition apparaît parce que {count} rêves récents avaient une charge lourde — ce n'est pas un diagnostic, juste une attention)
        </p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <button onClick={onClose} style={btnText(NX)}>pas maintenant</button>
          <button onClick={onActivate} style={btnPrimary(NX)}>
            ouvrir le sanctuaire
          </button>
        </div>
      </ModalShell>
    );
  };

  // ── Button helpers ────────────────────────────────────────
  function btnPrimary(t) {
    return {
      background: t.bgPanel2,
      border: `1px solid ${t.accent}`,
      color: t.accent,
      fontFamily: t.mono, fontSize: 12, letterSpacing: "0.04em",
      padding: "8px 14px", cursor: "pointer",
    };
  }
  function btnGhost(t) {
    return {
      background: "transparent",
      border: `1px solid ${t.border}`,
      color: t.textDim,
      fontFamily: t.mono, fontSize: 12,
      padding: "7px 13px", cursor: "pointer",
    };
  }
  function btnText(t) {
    return {
      background: "transparent", border: "none",
      color: t.textDim,
      fontFamily: t.mono, fontSize: 12,
      padding: "6px 8px", cursor: "pointer",
    };
  }

  // ─────────────────────────────────────────────────────────────
  // 2026-04-28 §11.bis.20.13 — NightmareDepositChoiceModal
  // 4 options douces post-dépôt cauchemar (valence < -0.6 OU is_nightmare)
  // ─────────────────────────────────────────────────────────────
  const NightmareDepositChoiceModal = ({
    entry,                  // { id, raw_text, valence, is_nightmare, is_grief_related }
    isFrozen = false,       // user_protection_state.freeze_until > now()
    onClose,
    onGoSanctuaire,         // route to sanctuaire screen
    onExitToHuman,          // open EXIT_TO_HUMAN selector
  }) => {
    const [phase, uPh] = uS("choice"); // 'choice' | 'loading' | 'reading' | 'frozen' | 'exit' | 'grief_silence' | 'error'
    const [reading, uRd] = uS(null);   // { paper, stone, silk }
    const [framing, uFr] = uS(null);
    const [errorMsg, uEr] = uS(null);
    const [exitResources, uEx] = uS(null); // { FR: [...] } when status=exit_to_human

    const callForest = async () => {
      uPh("loading");
      try {
        const res = await window.DreamAPI.forestReadingNightmare({
          dream_id: entry?.id || null,
          raw_text: entry?.raw_text || null,
        });
        if (!res || res._seed) {
          uEr("la voie de la Forêt est silencieuse pour l'instant");
          uPh("error");
          return;
        }
        if (res.status === "frozen") {
          uPh("frozen");
          uFr(res.message || null);
          return;
        }
        if (res.status === "exit_to_human") {
          uPh("exit");
          uFr(res.message || null);
          uEx(res.resources || null);
          return;
        }
        if (res.status === "grief_silence") {
          uPh("grief_silence");
          uFr(res.message || null);
          return;
        }
        if (res.status === "ok" && res.reading) {
          uRd(res.reading);
          uFr(res.framing || null);
          uPh("reading");
          return;
        }
        uEr("réponse inattendue de la Forêt");
        uPh("error");
      } catch (e) {
        uEr((e && e.message) || "erreur");
        uPh("error");
      }
    };

    return (
      <ModalShell onClose={onClose}>
        {/* Header doux */}
        <div style={{ fontFamily: NX.mono, fontSize: 11, letterSpacing: "0.1em", color: NX.accent, marginBottom: 8 }}>
          UN RÊVE LOURD VIENT D'ARRIVER
        </div>
        <h2 style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 22, marginBottom: 14, color: NX.text, lineHeight: 1.3 }}>
          Plusieurs voies s'offrent à toi —
        </h2>

        {phase === "choice" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Option 1 — juste tenir (default) */}
            <button onClick={onClose} style={choiceBtn(NX, true)}>
              <div style={choiceTitle(NX)}>juste tenir, ne rien dire</div>
              <div style={choiceSub(NX)}>
                accueil pur, l'écho dort, on revient plus tard si tu veux
              </div>
            </button>

            {/* Option 2 — convoquer la Forêt (cachée si freeze ou deuil) */}
            {!isFrozen && !entry?.is_grief_related && (
              <button onClick={callForest} style={choiceBtn(NX)}>
                <div style={choiceTitle(NX)}>convoquer la sagesse de la Forêt</div>
                <div style={choiceSub(NX)}>
                  trois angles trauma-safe pour TENIR ce qui est venu, pas pour expliquer
                </div>
              </button>
            )}

            {/* Option 3 — sanctuaire pour écrire */}
            <button
              onClick={() => { onGoSanctuaire && onGoSanctuaire(); onClose && onClose(); }}
              style={choiceBtn(NX)}
            >
              <div style={choiceTitle(NX)}>aller vers le sanctuaire pour écrire ce qui pèse</div>
              <div style={choiceSub(NX)}>
                un espace dédié, sans interprétation, sans jugement
              </div>
            </button>

            {/* Option 4 — humain de chair */}
            <button
              onClick={() => { onExitToHuman && onExitToHuman(); }}
              style={choiceBtn(NX)}
            >
              <div style={choiceTitle(NX)}>appeler quelqu'un de chair maintenant</div>
              <div style={choiceSub(NX)}>
                3114, SOS Amitié, et un sélecteur de pays
              </div>
            </button>
          </div>
        )}

        {phase === "loading" && (
          <div style={{ fontFamily: NX.serif, fontStyle: "italic", color: NX.textDim, padding: "20px 4px" }}>
            la Forêt prend son souffle…
          </div>
        )}

        {phase === "reading" && reading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {framing && (
              <p style={{ fontFamily: NX.serif, fontStyle: "italic", fontSize: 14, color: NX.textDim, textWrap: "pretty", lineHeight: 1.55 }}>
                {framing}
              </p>
            )}
            {["paper", "stone", "silk"].map((k) => (
              <div key={k} style={{
                paddingLeft: 12,
                borderLeft: `1px solid ${NX.borderActive}`,
              }}>
                <div style={{ fontFamily: NX.mono, fontSize: 10.5, letterSpacing: "0.1em", color: NX.accent, marginBottom: 4 }}>
                  {k.toUpperCase()}
                </div>
                <p style={{ fontFamily: NX.serif, fontSize: 14.5, color: NX.text, lineHeight: 1.6, textWrap: "pretty" }}>
                  {reading[k]?.text}
                </p>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={onClose} style={btnPrimary(NX)}>refermer</button>
            </div>
          </div>
        )}

        {phase === "frozen" && (
          <div>
            <p style={{ fontFamily: NX.serif, fontSize: 14.5, color: NX.text, lineHeight: 1.6, textWrap: "pretty" }}>
              {framing || "Cette voie est suspendue le temps que tu te restaures."}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => { onGoSanctuaire && onGoSanctuaire(); onClose && onClose(); }}
                style={btnPrimary(NX)}
              >
                vers le sanctuaire
              </button>
            </div>
          </div>
        )}

        {phase === "grief_silence" && (
          <div>
            <p style={{ fontFamily: NX.serif, fontSize: 14.5, color: NX.text, lineHeight: 1.6, textWrap: "pretty", fontStyle: "italic" }}>
              {framing}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={onClose} style={btnPrimary(NX)}>refermer</button>
            </div>
          </div>
        )}

        {phase === "exit" && (
          <div>
            <p style={{ fontFamily: NX.serif, fontSize: 14.5, color: NX.text, lineHeight: 1.6, textWrap: "pretty" }}>
              {framing}
            </p>
            <div style={{ marginTop: 12 }}>
              {(exitResources?.FR || EXIT_RESOURCES.FR.lines).map((r, i) => (
                <div key={i} style={{
                  fontFamily: NX.serif, fontSize: 14, color: NX.text,
                  padding: "6px 0", borderBottom: `1px solid ${NX.border}`,
                }}>
                  <strong style={{ fontWeight: 600 }}>{r.name}</strong> — {r.phone}
                  {r.note ? <span style={{ color: NX.textMuted, fontSize: 12 }}> · {r.note}</span> : null}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button onClick={onClose} style={btnText(NX)}>refermer</button>
            </div>
          </div>
        )}

        {phase === "error" && (
          <div>
            <p style={{ fontFamily: NX.serif, fontSize: 14, color: NX.danger, fontStyle: "italic" }}>
              {errorMsg}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 14 }}>
              <button onClick={() => uPh("choice")} style={btnGhost(NX)}>retour</button>
              <button onClick={onClose} style={btnPrimary(NX)}>refermer</button>
            </div>
          </div>
        )}
      </ModalShell>
    );
  };

  function choiceBtn(t, isDefault = false) {
    return {
      textAlign: "left",
      background: isDefault ? t.bgPanel2 : "transparent",
      border: `1px solid ${isDefault ? t.borderActive : t.border}`,
      color: t.text,
      padding: "12px 14px",
      cursor: "pointer",
      transition: "border-color 200ms ease",
    };
  }
  function choiceTitle(t) {
    return {
      fontFamily: t.serif, fontStyle: "italic",
      fontSize: 15.5, color: t.text, marginBottom: 4, lineHeight: 1.3,
    };
  }
  function choiceSub(t) {
    return {
      fontFamily: t.serif, fontSize: 12.5, color: t.textDim,
      lineHeight: 1.45, textWrap: "pretty",
    };
  }

  Object.assign(window, {
    NightmaresScreen,
    NightmareAutoProposalModal,
    NightmareDepositChoiceModal,
  });
})();
