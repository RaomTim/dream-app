/* global React, window */
// ──────────────────────────────────────────────────────────────
// Lucid Dream — sous-app refonte 2026-04-28 (Yeshua)
//
// Avant (2026-04-26) : esthétique dark monospace pure, EN, jugée
// "chelou, incompréhensible, moche" par Tim. ABANDONNÉ.
//
// Maintenant : grammaire visuelle Dream main (night-warm + EB Garamond
// italic + chips silk-gold + halos respirants). 100% français.
// Vocabulaire technique LaBerge/Tholey introduit en douceur.
//
// Structure : sous-app à 5 onglets (mêmes routes qu'avant, on garde
// le routing app.jsx) + onboarding 3 écrans rituels FR + features
// L.1–L.6 (RC contextuels, dream signs ★ MILD, WBTB intention, stats
// graphes simples + export, entry hub avec 3 propositions de layout).
//
// Persona : pratiquant lucide curieux, FR. Techniques nommées (DILD/MILD
// /WBTB/SSILD/WILD) introduites au moment où elles servent.
//
// Anti-gamification : pas de leaderboard, pas de "vs autres". Stats
// pour soi. Cf. 2_DESIGN §7.10.
// ──────────────────────────────────────────────────────────────

(function setupLucidScreens() {
  const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

  // ============================================================
  // Tokens — alignés Dream main (night-warm + serif italic + silk-gold)
  // ============================================================
  // On lit les CSS vars quand on peut, fallback sinon.
  const T = {
    bg:       "var(--night-warm, #15130F)",
    bgFloor:  "var(--night-floor, #0E0F14)",
    bgSoft:   "color-mix(in oklch, var(--paper-warm, #B89E7C) 6%, transparent)",
    border:   "var(--ash-deep, #1F2025)",
    borderActive: "var(--silk-gold, #C8A658)",
    text:     "var(--bone, #C4B9AD)",
    textDim:  "var(--ash-light, #5C5854)",
    textMuted:"var(--ash-mid, #363430)",
    accent:   "var(--silk-gold, #C8A658)",
    ember:    "var(--ember-live, #C46B3D)",
    danger:   "var(--clay-earth, #8C5C3B)",
    serif:    "var(--serif, 'EB Garamond', Garamond, serif)",
    sans:     "var(--sans, Inter, system-ui, sans-serif)",
    mono:     "var(--mono, 'JetBrains Mono', ui-monospace, monospace)",
  };

  // ── Primitives visuelles (Dream main aesthetic) ──────────────
  function Stage({ children, style }) {
    return (
      <div className="stage screen-enter" style={{
        minHeight: "100vh",
        background: T.bgFloor,
        color: T.text,
        fontFamily: T.sans,
        fontSize: 15,
        lineHeight: 1.55,
        padding: "0 0 100px",
        ...style,
      }}>
        {children}
      </div>
    );
  }

  function Frame({ children }) {
    return (
      <div className="frame" style={{
        maxWidth: 720, margin: "0 auto", padding: "24px 24px 48px",
      }}>
        {children}
      </div>
    );
  }

  // Header sub-app — glyphe ◐ + title italic
  // 2026-04-29 (Yeshua) : ajout croissant lunaire SVG fin au-dessus, animation
  // breathe-souffle 6s, opacity 0.55. Visuel sacré subtil pour onglet pratique.
  function LucidHeader({ go, sub }) {
    return (
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => go("explorer")}
          style={{
            background: "transparent",
            border: "none",
            color: T.textDim,
            fontFamily: T.serif,
            fontStyle: "italic",
            fontSize: 14,
            padding: "6px 0",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          ← retour
        </button>

        {/* Croissant lunaire fin SVG — Yeshua 2026-04-29 */}
        {window.GeoSymbol && (
          <div aria-hidden="true" style={{
            display: "flex", justifyContent: "flex-start",
            marginBottom: 14,
          }}>
            <div style={{
              position: "relative", width: 30, height: 30, opacity: 0.55,
              animation: "breathe-souffle 6s ease-in-out infinite",
            }}>
              <window.GeoSymbol kind="croissant" color="bone"
                style={{ position: "relative", width: 30, height: 30, opacity: 1 }} />
            </div>
          </div>
        )}

        <div style={{
          fontFamily: T.mono, fontSize: 10, letterSpacing: "0.16em",
          color: T.accent, textTransform: "uppercase", marginBottom: 8,
        }}>
          ◐ &nbsp;lucid · ton terrain de pratique
        </div>
        {sub && (
          <div style={{
            fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
            color: T.textDim, maxWidth: 540,
          }}>
            {sub}
          </div>
        )}
      </div>
    );
  }

  // Card panel — pas de bordure dure, juste un voile
  function Card({ children, title, accent, style }) {
    return (
      <section style={{
        background: T.bgSoft,
        border: `1px solid ${T.border}`,
        padding: "20px 22px",
        marginBottom: 20,
        borderRadius: 0,
        ...style,
      }}>
        {title && (
          <div style={{
            fontFamily: T.mono,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: accent ? T.accent : T.textDim,
            textTransform: "uppercase",
            marginBottom: 14,
          }}>
            {title}
          </div>
        )}
        {children}
      </section>
    );
  }

  // Bouton — chip-like
  function Btn({ children, onClick, primary, ghost, danger, disabled, style }) {
    let color = T.text;
    let border = T.border;
    let bg = "transparent";
    if (primary) { color = T.accent; border = T.accent; bg = "color-mix(in oklch, var(--silk-gold, #C8A658) 8%, transparent)"; }
    else if (ghost) { color = T.textDim; border = "transparent"; }
    else if (danger) { color = T.danger; border = T.danger; }
    return (
      <button onClick={onClick} disabled={disabled} style={{
        background: bg,
        border: `1px solid ${border}`,
        color: disabled ? T.textMuted : color,
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 14,
        padding: "10px 18px",
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.01em",
        opacity: disabled ? 0.4 : 1,
        borderRadius: 0,
        transition: "all 280ms ease",
        ...style,
      }}>
        {children}
      </button>
    );
  }

  // Chip — pour qualif onboarding + filtres
  function Chip({ children, active, onClick, style }) {
    return (
      <button onClick={onClick} style={{
        background: active
          ? "color-mix(in oklch, var(--silk-gold, #C8A658) 10%, transparent)"
          : "transparent",
        border: `1px solid ${active ? T.accent : T.border}`,
        color: active ? T.accent : T.textDim,
        fontFamily: T.serif,
        fontStyle: "italic",
        fontSize: 14,
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: 100,
        transition: "all 280ms ease",
        ...style,
      }}>
        {children}
      </button>
    );
  }

  function Field({ label, children, hint }) {
    return (
      <div style={{ marginBottom: 16 }}>
        {label && (
          <div style={{
            fontFamily: T.mono, fontSize: 10, color: T.textDim,
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 6,
          }}>
            {label}
          </div>
        )}
        {children}
        {hint && (
          <div style={{
            fontFamily: T.serif, fontStyle: "italic", fontSize: 13,
            color: T.textMuted, marginTop: 6, lineHeight: 1.5,
          }}>
            {hint}
          </div>
        )}
      </div>
    );
  }

  function Input({ value, onChange, placeholder, type }) {
    return (
      <input
        type={type || "text"}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: T.bg,
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.sans, fontSize: 15,
          padding: "10px 14px",
          outline: "none",
          borderRadius: 0,
        }}
        onFocus={(e) => (e.target.style.borderColor = T.accent)}
        onBlur={(e) => (e.target.style.borderColor = T.border)}
      />
    );
  }

  function Select({ value, onChange, options }) {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: T.bg,
          border: `1px solid ${T.border}`,
          color: T.text,
          fontFamily: T.sans, fontSize: 15,
          padding: "10px 14px",
          borderRadius: 0,
          outline: "none",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  }

  function Toggle({ on, onClick, label, hint }) {
    return (
      <div onClick={onClick} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: `1px solid ${T.border}`,
        cursor: "pointer",
      }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
          <div style={{ fontFamily: T.serif, fontSize: 16, color: T.text, fontStyle: "italic" }}>
            {label}
          </div>
          {hint && (
            <div style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 13, color: T.textDim, marginTop: 2 }}>
              {hint}
            </div>
          )}
        </div>
        <div style={{
          width: 38, height: 20, position: "relative", flexShrink: 0,
          background: on ? "color-mix(in oklch, var(--silk-gold, #C8A658) 16%, transparent)" : "transparent",
          border: `1px solid ${on ? T.accent : T.border}`,
          borderRadius: 100,
        }}>
          <div style={{
            position: "absolute", top: 1, left: on ? 18 : 1,
            width: 16, height: 16, borderRadius: "50%",
            background: on ? T.accent : T.textDim,
            transition: "left 280ms ease",
          }} />
        </div>
      </div>
    );
  }

  function Slider({ value, onChange, min, max, step, label, valueLabel }) {
    return (
      <div style={{ marginBottom: 14 }}>
        {label && (
          <div style={{
            display: "flex", justifyContent: "space-between",
            fontFamily: T.mono, fontSize: 10, color: T.textDim,
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: 6,
          }}>
            <span>{label}</span>
            <span style={{ color: T.accent, fontStyle: "normal" }}>
              {valueLabel || (value + (max ? "/" + max : ""))}
            </span>
          </div>
        )}
        <input type="range"
          min={min || 0} max={max || 5} step={step || 1}
          value={value || 0}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{ width: "100%", accentColor: "var(--silk-gold, #C8A658)" }}
        />
      </div>
    );
  }

  // ============================================================
  // L.1 — ONBOARDING 3 écrans rituels FR
  // ============================================================
  const ONB_EXPERIENCES = [
    { value: "discovery", label: "découverte" },
    { value: "occasional", label: "j'en ai eu quelques-uns" },
    { value: "regular_dild", label: "je pratique (DILD)" },
    { value: "regular_mild", label: "je pratique (MILD)" },
    { value: "regular_wild", label: "je pratique (WILD)" },
    { value: "advanced", label: "avancé·e (200+)" },
  ];

  const LucidOnboarding = ({ profile, onComplete, onSkip }) => {
    const [step, setStep] = uS(0); // 0/1/2
    const [exp, setExp] = uS(profile?.experience_level || null);
    const [busy, setBusy] = uS(false);

    const finish = async (createDefaultRC) => {
      setBusy(true);
      try {
        const patch = {
          enabled: true,
          onboarding_completed: true,
          ui_mode: "dream_ambient",
        };
        if (exp) patch.experience_level = exp;
        await window.DreamAPI.updateLucidProfile(patch);
        if (createDefaultRC) {
          // 3 RC par défaut (les classiques LaBerge), max 3/jour
          await window.DreamAPI.createRealityCheck({
            technique: "look_at_hands",
            interval_minutes: 240,
            active_hours_start: "09:00",
            active_hours_end: "21:00",
            vibration_pattern: "short",
            trigger_context: "interval",
            max_per_day: 3,
          });
        }
        try { localStorage.setItem("dream:lucid:enabled", "true"); } catch {}
        onComplete();
      } finally { setBusy(false); }
    };

    return (
      <Stage>
        <Frame>
          <LucidHeader go={() => onSkip()} />

          {/* Step 0 — accueil */}
          {step === 0 && (
            <Card>
              <div style={{
                textAlign: "center",
                padding: "32px 0 16px",
              }}>
                <div style={{
                  fontFamily: T.serif, fontSize: 56,
                  color: T.accent, opacity: 0.85,
                  marginBottom: 24, letterSpacing: "0.05em",
                }}>
                  ◐
                </div>
                <h1 style={{
                  fontFamily: T.serif, fontStyle: "italic",
                  fontSize: 28, lineHeight: 1.3,
                  color: T.text, fontWeight: 300,
                  margin: "0 0 16px",
                  maxWidth: 460,
                  marginLeft: "auto", marginRight: "auto",
                }}>
                  le rêve lucide — un terrain de pratique. pas une magie.
                </h1>
                <p style={{
                  fontFamily: T.serif, fontStyle: "italic",
                  fontSize: 16, lineHeight: 1.6, color: T.textDim,
                  maxWidth: 480, margin: "0 auto 32px",
                }}>
                  ici, tu peux t'entraîner à reconnaître que tu rêves, pendant que tu rêves.
                  des techniques (MILD, WBTB, dream signs), pas de promesses.
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Btn primary onClick={() => setStep(1)}>commencer</Btn>
                  <Btn ghost onClick={onSkip}>plus tard</Btn>
                </div>
              </div>
            </Card>
          )}

          {/* Step 1 — qualification */}
          {step === 1 && (
            <Card>
              <div style={{ padding: "16px 0" }}>
                <h2 style={{
                  fontFamily: T.serif, fontStyle: "italic",
                  fontSize: 24, lineHeight: 1.3,
                  color: T.text, fontWeight: 300,
                  margin: "0 0 24px",
                }}>
                  où en es-tu, dans ta pratique ?
                </h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
                  {ONB_EXPERIENCES.map((o) => (
                    <Chip key={o.value} active={exp === o.value} onClick={() => setExp(o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn ghost onClick={() => setStep(0)}>← retour</Btn>
                  <Btn primary onClick={() => setStep(2)} disabled={!exp}>
                    continuer →
                  </Btn>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2 — proposer technique simple */}
          {step === 2 && (
            <Card>
              <div style={{ padding: "16px 0" }}>
                <h2 style={{
                  fontFamily: T.serif, fontStyle: "italic",
                  fontSize: 24, lineHeight: 1.3,
                  color: T.text, fontWeight: 300,
                  margin: "0 0 16px",
                }}>
                  veux-tu une première technique simple ?
                </h2>
                <p style={{
                  fontFamily: T.serif, fontStyle: "italic",
                  fontSize: 16, lineHeight: 1.6,
                  color: T.textDim, marginBottom: 20,
                }}>
                  on peut t'installer un reality check léger (3 fois par jour, regarde tes mains)
                  + commencer la pratique <em>MILD</em>.
                </p>
                <div style={{
                  borderLeft: `2px solid ${T.accent}`,
                  paddingLeft: 16, marginBottom: 24,
                  fontFamily: T.serif, fontStyle: "italic",
                  fontSize: 15, color: T.text, lineHeight: 1.6,
                }}>
                  <strong style={{ color: T.accent, fontStyle: "normal", fontFamily: T.mono, fontSize: 11, letterSpacing: "0.1em" }}>
                    MILD
                  </strong>
                  <br />
                  avant de dormir, répète intérieurement :
                  <br />
                  <em style={{ color: T.text }}>« la prochaine fois que je rêve, je le saurai. »</em>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Btn primary onClick={() => finish(true)} disabled={busy}>
                    {busy ? "…" : "oui, installer"}
                  </Btn>
                  <Btn onClick={() => finish(false)} disabled={busy}>
                    je verrai plus tard
                  </Btn>
                  <Btn ghost onClick={() => setStep(1)}>← retour</Btn>
                </div>
              </div>
            </Card>
          )}
        </Frame>
      </Stage>
    );
  };

  // ============================================================
  // L.BONUS — Hub sub-app : header + bottom-tabs (5 onglets)
  // ============================================================
  // Tabs : profil / reality checks / dream signs / WBTB / stats
  // Le tab principal devient celui que la route demande.
  // Pour le user expérimenté, c'est plus rapide ; pour le débutant,
  // l'onboarding se fait avant ce hub.
  const TABS = [
    { key: "profile", route: "lucid-profile",        label: "profil",    glyph: "◐" },
    { key: "rc",      route: "lucid-reality-checks", label: "reality",   glyph: "✱" },
    { key: "signs",   route: "lucid-dream-signs",    label: "dream signs", glyph: "✦" },
    { key: "wbtb",    route: "lucid-wbtb",           label: "WBTB",      glyph: "☾" },
    { key: "stats",   route: "lucid-dashboard",      label: "stats",     glyph: "▤" },
  ];

  function LucidTabs({ go, current }) {
    return (
      <nav style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        background: "color-mix(in oklch, var(--night-floor, #0E0F14) 95%, transparent)",
        backdropFilter: "blur(12px)",
        borderTop: `1px solid ${T.border}`,
        padding: "10px 12px 18px",
        display: "flex", justifyContent: "space-around", alignItems: "center",
      }}>
        {TABS.map((t) => {
          const active = t.key === current;
          return (
            <button key={t.key}
              onClick={() => go(t.route)}
              aria-label={t.label}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                padding: "4px 8px",
                color: active ? T.accent : T.textDim,
                opacity: active ? 1 : 0.7,
                transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
              }}
            >
              <span style={{ fontSize: 18 }}>{t.glyph}</span>
              <span style={{
                fontFamily: T.serif, fontStyle: "italic",
                fontSize: 11, letterSpacing: "0.02em",
              }}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    );
  }

  // ============================================================
  // 1. PROFIL (route lucid-profile)
  // ============================================================
  const LucidProfileScreen = ({ go }) => {
    const [profile, setProfile] = uS(null);
    const [loading, setLoading] = uS(true);
    const [forceOnboard, setForceOnboard] = uS(false);

    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.getLucidProfile();
        setProfile(res?.profile || null);
      } finally { setLoading(false); }
    };
    uE(() => { refresh(); }, []);

    const update = async (patch) => {
      const res = await window.DreamAPI.updateLucidProfile(patch);
      setProfile(res?.profile || null);
      if ("enabled" in patch) {
        try { localStorage.setItem("dream:lucid:enabled", patch.enabled ? "true" : "false"); } catch {}
      }
    };

    if (loading) {
      return (
        <Stage>
          <Frame>
            <LucidHeader go={go} />
            <div className="breath" style={{ color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>
              chargement…
            </div>
          </Frame>
        </Stage>
      );
    }

    // Onboarding si pas encore fait OU activation forcée
    const needOnboard =
      forceOnboard ||
      (!profile?.enabled && !profile?.onboarding_completed) ||
      (profile?.enabled && !profile?.onboarding_completed);
    if (needOnboard) {
      return (
        <LucidOnboarding
          profile={profile}
          onComplete={() => { setForceOnboard(false); refresh(); }}
          onSkip={() => go("explorer")}
        />
      );
    }

    // Mode désactivé → écran "réactiver"
    if (!profile?.enabled) {
      return (
        <Stage>
          <Frame>
            <LucidHeader go={go} sub="le mode lucide est désactivé. tu peux le rallumer ici." />
            <Card>
              <div style={{ padding: "20px 0", textAlign: "center" }}>
                <div style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 18, color: T.textDim, marginBottom: 24 }}>
                  rien ne tourne en arrière-plan tant que le mode est éteint.
                </div>
                <Btn primary onClick={() => update({ enabled: true })}>
                  rallumer le mode lucide
                </Btn>
              </div>
            </Card>
          </Frame>
          <LucidTabs go={go} current="profile" />
        </Stage>
      );
    }

    // Mode actif → settings
    return (
      <Stage>
        <Frame>
          <LucidHeader go={go} sub="ton terrain de pratique. opt-in, sans pression." />

          <Card title="pratique" accent>
            <Field label="niveau d'expérience">
              <Select
                value={profile.experience_level || ""}
                onChange={(v) => update({ experience_level: v || null })}
                options={[{ value: "", label: "—" }, ...ONB_EXPERIENCES]}
              />
            </Field>
            <Field label="technique préférée"
              hint="MILD = répétition d'intention. WBTB = réveil + retour avec intention. WILD = passage conscient. SSILD = cycle des sens. DILD = lucidité spontanée dans le rêve.">
              <Select
                value={profile.preferred_technique || ""}
                onChange={(v) => update({ preferred_technique: v || null })}
                options={[
                  { value: "", label: "—" },
                  { value: "MILD", label: "MILD (intention répétée)" },
                  { value: "WBTB", label: "WBTB (wake back to bed)" },
                  { value: "WILD", label: "WILD (passage conscient)" },
                  { value: "SSILD", label: "SSILD (cycle des sens)" },
                  { value: "DILD", label: "DILD (spontané dans le rêve)" },
                ]}
              />
            </Field>
          </Card>

          <Card title="export">
            <Toggle
              on={!!profile.obsidian_export_enabled}
              onClick={() => update({ obsidian_export_enabled: !profile.obsidian_export_enabled })}
              label="export Obsidian / Markdown activé"
              hint="téléchargement .md avec frontmatter (date, lucidité, technique, signs)."
            />
          </Card>

          {/* T4 — Bridge vers Dream main : explorer la profondeur via Anima */}
          <Card title="explore la profondeur" accent>
            <p style={{
              fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
              color: T.textDim, marginBottom: 14, lineHeight: 1.6,
            }}>
              cette chambre est une chapelle latérale de la cathédrale Dream.
              tu peux remonter au sol — converser avec Anima de ta pratique,
              ou voir comment tes lucides s'inscrivent dans ton portrait global.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn primary onClick={() => {
                try {
                  sessionStorage.setItem("dream:chat:prefilled",
                    "Je viens de la chambre Lucid. J'aimerais parler de ma pratique du rêve lucide — ce qui revient, ce qui me trouble, ce que je n'ose pas regarder.");
                } catch {}
                go("dream-chat");
              }}>
                ✦ converse avec Anima de cette pratique
              </Btn>
              <Btn ghost onClick={() => go("portrait")}>
                ↺ portrait narratif
              </Btn>
            </div>
          </Card>

          <Card title="zone de retrait">
            <Toggle
              on={!!profile.enabled}
              onClick={() => update({ enabled: false })}
              label="désactiver le mode lucide"
              hint="rien n'est supprimé. tu peux rallumer quand tu veux."
            />
            <div style={{ marginTop: 14 }}>
              <Btn ghost onClick={() => setForceOnboard(true)}>
                refaire l'introduction
              </Btn>
            </div>
          </Card>
        </Frame>
        <LucidTabs go={go} current="profile" />
      </Stage>
    );
  };

  // ============================================================
  // 2. REALITY CHECKS (route lucid-reality-checks) — L.3
  // ============================================================
  const RC_TECHNIQUES_FR = [
    { value: "look_at_hands",        label: "regarde tes mains" },
    { value: "look_at_text",         label: "lis un texte deux fois" },
    { value: "finger_through_palm",  label: "passe un doigt à travers ta paume" },
    { value: "look_at_clock",        label: "regarde l'heure (deux fois)" },
    { value: "breath_through_nose",  label: "pince ton nez et respire" },
    { value: "jump_test",            label: "saute (est-ce que tu flottes ?)" },
    { value: "custom",               label: "personnalisé…" },
  ];
  const RC_TRIGGERS_FR = [
    { value: "interval",     label: "à intervalles réguliers" },
    { value: "on_app_open",  label: "à l'ouverture de l'app" },
    { value: "on_morning",   label: "le matin (au réveil)" },
    { value: "on_evening",   label: "le soir (avant dormir)" },
    { value: "on_random",    label: "à un moment imprévu" },
  ];
  const RC_VIB_FR = [
    { value: "short",  label: "courte" },
    { value: "medium", label: "moyenne" },
    { value: "long",   label: "longue" },
  ];

  const LucidRealityChecksScreen = ({ go }) => {
    const [checks, setChecks] = uS([]);
    const [loading, setLoading] = uS(true);
    const [adding, setAdding] = uS(false);
    const [draft, setDraft] = uS(null);
    const intervalRef = uR(null);

    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.listRealityChecks();
        setChecks(res?.reality_checks || []);
      } finally { setLoading(false); }
    };
    uE(() => { refresh(); }, []);

    // Notif loop côté client (V1 web)
    uE(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      const enabled = checks.filter((c) => c.enabled);
      if (enabled.length === 0) return;
      intervalRef.current = setInterval(() => {
        if (typeof Notification === "undefined") return;
        if (Notification.permission !== "granted") return;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const hour = now.toTimeString().slice(0, 5);
        for (const rc of enabled) {
          if (rc.trigger_context && rc.trigger_context !== "interval") continue;
          if (rc.active_hours_start && hour < rc.active_hours_start) continue;
          if (rc.active_hours_end && hour > rc.active_hours_end) continue;
          // Anti-spam : max_per_day
          const lastDay = rc.last_performed_at ? rc.last_performed_at.slice(0, 10) : null;
          const performedToday = lastDay === today
            ? (rc._countToday || 1)
            : 0;
          if (performedToday >= (rc.max_per_day || 3)) continue;
          const last = rc.last_performed_at ? new Date(rc.last_performed_at).getTime() : 0;
          const interval = (rc.interval_minutes || 90) * 60 * 1000;
          if (Date.now() - last >= interval) {
            try {
              new Notification("Reality check", {
                body: rc.custom_label || (RC_TECHNIQUES_FR.find((x) => x.value === rc.technique)?.label || rc.technique),
                silent: !rc.sound_enabled,
              });
              window.DreamAPI.updateRealityCheck(rc.id, {
                last_performed_at: new Date().toISOString(),
                performed_count: (rc.performed_count || 0) + 1,
              }).then(refresh).catch(() => {});
            } catch (e) { console.warn(e); }
          }
        }
      }, 60 * 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [checks]);

    // Trigger "on_app_open"
    uE(() => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const onOpen = checks.filter((c) =>
        c.enabled && c.trigger_context === "on_app_open" &&
        (!c.last_performed_at || !c.last_performed_at.startsWith(today))
      );
      if (onOpen.length === 0) return;
      // Soft in-app banner via console + fallback alert
      // Vraie implém : on déclenche notif si autorisée, sinon banner.
      for (const rc of onOpen) {
        try {
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            new Notification("Reality check", {
              body: rc.custom_label || (RC_TECHNIQUES_FR.find((x) => x.value === rc.technique)?.label || rc.technique),
            });
          }
          window.DreamAPI.updateRealityCheck(rc.id, {
            last_performed_at: new Date().toISOString(),
            performed_count: (rc.performed_count || 0) + 1,
          }).then(refresh).catch(() => {});
        } catch {}
      }
    }, [checks.length]);

    const askPerm = async () => {
      if (typeof Notification === "undefined") {
        alert("notifications indisponibles sur cet appareil.");
        return;
      }
      if (Notification.permission === "default") {
        const p = await Notification.requestPermission();
        alert("permission : " + p);
      } else {
        alert("déjà : " + Notification.permission);
      }
    };

    const startAdd = () => {
      setDraft({
        technique: "look_at_hands",
        custom_label: "",
        interval_minutes: 240,
        active_hours_start: "09:00",
        active_hours_end: "21:00",
        vibration_pattern: "short",
        sound_enabled: false,
        trigger_context: "interval",
        max_per_day: 3,
        enabled: true,
      });
      setAdding(true);
    };

    const save = async () => {
      try {
        await window.DreamAPI.createRealityCheck(draft);
        setAdding(false);
        setDraft(null);
        refresh();
      } catch (e) { alert("erreur : " + e.message); }
    };

    const toggle = async (rc) => {
      await window.DreamAPI.updateRealityCheck(rc.id, { enabled: !rc.enabled });
      refresh();
    };

    const remove = async (rc) => {
      if (!confirm("supprimer ce reality check ?")) return;
      await window.DreamAPI.deleteRealityCheck(rc.id);
      refresh();
    };

    return (
      <Stage>
        <Frame>
          <LucidHeader
            go={go}
            sub="reality checks — petits gestes répétés dans la journée. quand un sign apparaît, l'habitude te dit : « est-ce que je rêve ? »"
          />

          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
            <Btn primary onClick={startAdd}>+ ajouter</Btn>
            <Btn onClick={askPerm}>activer notifications</Btn>
          </div>

          {adding && draft && (
            <Card title="nouveau reality check" accent>
              <Field label="technique">
                <Select
                  value={draft.technique}
                  onChange={(v) => setDraft({ ...draft, technique: v })}
                  options={RC_TECHNIQUES_FR}
                />
              </Field>

              {draft.technique === "custom" && (
                <Field label="formulation perso">
                  <Input
                    value={draft.custom_label}
                    onChange={(v) => setDraft({ ...draft, custom_label: v })}
                    placeholder="ex. compte tes doigts"
                  />
                </Field>
              )}

              <Field label="quand" hint="si tu choisis « à intervalles », fixe la fréquence ci-dessous.">
                <Select
                  value={draft.trigger_context}
                  onChange={(v) => setDraft({ ...draft, trigger_context: v })}
                  options={RC_TRIGGERS_FR}
                />
              </Field>

              {draft.trigger_context === "interval" && (
                <Slider
                  label="fréquence"
                  valueLabel={`toutes les ${draft.interval_minutes} min`}
                  value={draft.interval_minutes}
                  onChange={(v) => setDraft({ ...draft, interval_minutes: v })}
                  min={30} max={360} step={15}
                />
              )}

              <Slider
                label="max par jour"
                valueLabel={String(draft.max_per_day || 3)}
                value={draft.max_per_day}
                onChange={(v) => setDraft({ ...draft, max_per_day: v })}
                min={1} max={8} step={1}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="actif de">
                  <Input type="time" value={draft.active_hours_start}
                    onChange={(v) => setDraft({ ...draft, active_hours_start: v })} />
                </Field>
                <Field label="à">
                  <Input type="time" value={draft.active_hours_end}
                    onChange={(v) => setDraft({ ...draft, active_hours_end: v })} />
                </Field>
              </div>

              <Field label="vibration">
                <Select
                  value={draft.vibration_pattern}
                  onChange={(v) => setDraft({ ...draft, vibration_pattern: v })}
                  options={RC_VIB_FR}
                />
              </Field>

              <Toggle
                on={!!draft.sound_enabled}
                onClick={() => setDraft({ ...draft, sound_enabled: !draft.sound_enabled })}
                label="son discret"
              />

              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                <Btn primary onClick={save}>enregistrer</Btn>
                <Btn ghost onClick={() => { setAdding(false); setDraft(null); }}>annuler</Btn>
              </div>
            </Card>
          )}

          {loading && <div style={{ color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>chargement…</div>}
          {!loading && checks.length === 0 && !adding && (
            <Card>
              <div style={{
                fontFamily: T.serif, fontStyle: "italic", color: T.textDim,
                textAlign: "center", padding: "20px 0",
              }}>
                aucun reality check pour l'instant.
                <br />
                <span style={{ fontSize: 13 }}>les classiques : <em>regarde tes mains</em>, <em>lis un texte deux fois</em>, <em>est-ce que je rêve ?</em></span>
              </div>
            </Card>
          )}

          {checks.map((rc) => {
            const techLabel = RC_TECHNIQUES_FR.find((x) => x.value === rc.technique)?.label || rc.technique;
            const trigLabel = RC_TRIGGERS_FR.find((x) => x.value === rc.trigger_context)?.label || "intervalle";
            return (
              <Card key={rc.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: T.serif, fontStyle: "italic",
                      fontSize: 17, color: T.text, marginBottom: 6,
                    }}>
                      {rc.custom_label || techLabel}
                    </div>
                    <div style={{
                      fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.04em",
                    }}>
                      {trigLabel}
                      {rc.trigger_context === "interval" && ` · toutes les ${rc.interval_minutes} min`}
                      {` · ${rc.active_hours_start}–${rc.active_hours_end}`}
                      {` · max ${rc.max_per_day || 3}/j`}
                    </div>
                    <div style={{
                      fontFamily: T.mono, fontSize: 11, color: T.accent, marginTop: 4,
                    }}>
                      {rc.performed_count || 0} fait{(rc.performed_count || 0) > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <Btn primary={!!rc.enabled} onClick={() => toggle(rc)} style={{ padding: "6px 12px", fontSize: 12 }}>
                      {rc.enabled ? "actif" : "off"}
                    </Btn>
                    <Btn danger onClick={() => remove(rc)} style={{ padding: "6px 10px", fontSize: 12 }}>×</Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </Frame>
        <LucidTabs go={go} current="rc" />
      </Stage>
    );
  };

  // ============================================================
  // 3. DREAM SIGNS (route lucid-dream-signs) — L.4
  // ============================================================
  const SIGN_CAT_FR = [
    { value: "",          label: "—" },
    { value: "character", label: "personnage" },
    { value: "location",  label: "lieu" },
    { value: "object",    label: "objet" },
    { value: "action",    label: "action" },
    { value: "emotion",   label: "émotion" },
  ];
  const CAT_COLOR = {
    character: "#C46B3D",  // ember
    location:  "#7E9DBA",  // stone-cool
    object:    "#A89469",
    action:    "#C8A658",  // silk-gold
    emotion:   "#9E7BB0",
  };

  const LucidDreamSignsScreen = ({ go }) => {
    const [signs, setSigns] = uS([]);
    const [loading, setLoading] = uS(true);
    const [newLabel, setNewLabel] = uS("");
    const [newCat, setNewCat] = uS("");
    const [showTuto, setShowTuto] = uS(false);
    const [suggesting, setSuggesting] = uS(false);
    const [suggestNote, setSuggestNote] = uS("");

    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.listDreamSigns();
        setSigns(res?.dream_signs || []);
      } finally { setLoading(false); }
    };
    uE(() => { refresh(); }, []);

    const add = async () => {
      const label = (newLabel || "").trim();
      if (!label) return;
      await window.DreamAPI.addDreamSign(label, newCat || null);
      setNewLabel(""); setNewCat("");
      refresh();
    };

    const suggestIA = async () => {
      setSuggesting(true);
      setSuggestNote("");
      try {
        const res = await window.DreamAPI.suggestDreamSigns();
        const n = (res?.suggestions || []).length;
        if (n > 0) {
          setSuggestNote(`${n} suggestion${n > 1 ? "s" : ""} ajoutée${n > 1 ? "s" : ""} (à confirmer ★).`);
          refresh();
        } else if (res?.reason) {
          setSuggestNote(res.reason);
        } else {
          setSuggestNote("Aucune récurrence claire détectée pour l'instant.");
        }
      } catch (e) {
        setSuggestNote("Erreur : " + (e.message || "inconnue"));
      } finally {
        setSuggesting(false);
      }
    };

    const togglePersonal = async (s) => {
      await window.DreamAPI.updateDreamSign(s.id, { is_personal_sign: !s.is_personal_sign });
      refresh();
    };

    const remove = async (id) => {
      if (!confirm("supprimer ce dream sign ?")) return;
      await window.DreamAPI.deleteDreamSign(id);
      refresh();
    };

    const top = signs.slice(0, 30);
    const personal = signs.filter((s) => s.is_personal_sign);

    return (
      <Stage>
        <Frame>
          <LucidHeader
            go={go}
            sub="dream signs — éléments qui reviennent dans tes rêves. quand tu les vois, ton attention peut basculer en lucidité."
          />

          {/* Personal signs in focus */}
          {personal.length > 0 && (
            <Card title="★ tes dream signs personnels" accent>
              <p style={{
                fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                color: T.textDim, marginBottom: 12, lineHeight: 1.6,
              }}>
                pour chacun, formule l'intention MILD :
                <br />
                <em style={{ color: T.text }}>« la prochaine fois que je vois [{personal.map((p) => p.sign_label).join(", ")}], je deviens lucide. »</em>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {personal.map((s) => (
                  <span key={s.id} style={{
                    fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                    color: T.accent,
                    padding: "6px 14px", borderRadius: 100,
                    border: `1px solid ${T.accent}`,
                    background: "color-mix(in oklch, var(--silk-gold, #C8A658) 8%, transparent)",
                  }}>
                    ★ {s.sign_label}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Add manual */}
          <Card title="ajouter un dream sign">
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: 8 }}>
              <Input value={newLabel} onChange={setNewLabel} placeholder="ex. escaliers, eau, maison d'enfance" />
              <Select value={newCat} onChange={setNewCat} options={SIGN_CAT_FR} />
              <Btn primary onClick={add}>+</Btn>
            </div>
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <Btn ghost onClick={suggestIA} disabled={suggesting} style={{ fontSize: 12 }}>
                {suggesting ? "analyse en cours…" : "✦ proposer 3 suggestions (IA · 30 derniers rêves)"}
              </Btn>
              {suggestNote && (
                <span style={{
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 13, color: T.textDim,
                }}>
                  {suggestNote}
                </span>
              )}
            </div>
          </Card>

          {/* Tuto trigger */}
          <div style={{ marginBottom: 14 }}>
            <Btn ghost onClick={() => setShowTuto((v) => !v)}>
              {showTuto ? "↑ replier" : "↓ pourquoi les dream signs ?"}
            </Btn>
          </div>
          {showTuto && (
            <Card>
              <p style={{ fontFamily: T.serif, fontStyle: "italic", fontSize: 15, color: T.text, lineHeight: 1.7, margin: 0 }}>
                LaBerge & Tholey ont noté que la plupart des rêves contiennent des
                <em style={{ color: T.accent }}> motifs récurrents </em> propres à chaque rêveur.
                Un dream sign, c'est un de ces motifs.
                Si tu lui dédies une intention pré-sommeil — la pratique <em>MILD</em> — il devient un déclencheur de lucidité dans le rêve.
                <br /><br />
                Marque un dream sign avec <em>★</em> pour le passer en <em>personnel</em> : il sera mis en avant pour ton intention MILD.
              </p>
            </Card>
          )}

          {/* List */}
          {loading && <div style={{ color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>chargement…</div>}
          {!loading && signs.length === 0 && (
            <Card>
              <div style={{
                fontFamily: T.serif, fontStyle: "italic",
                color: T.textDim, textAlign: "center", padding: "16px 0",
              }}>
                aucun dream sign détecté. ajoute-en un manuellement,
                <br />ou laisse l'extraction automatique faire son travail
                quand tu déposes des rêves.
              </div>
            </Card>
          )}

          {top.length > 0 && (
            <Card title={`tu vois souvent (${signs.length})`}>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {top.map((s) => (
                  <div key={s.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0",
                    borderBottom: `1px solid ${T.border}`,
                    gap: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                      <button onClick={() => togglePersonal(s)} style={{
                        background: "transparent", border: "none", cursor: "pointer",
                        color: s.is_personal_sign ? T.accent : T.textMuted,
                        fontSize: 18, padding: 4,
                      }} aria-label="marquer personnel">
                        {s.is_personal_sign ? "★" : "☆"}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: T.serif, fontStyle: "italic",
                          fontSize: 16, color: T.text,
                        }}>
                          {s.sign_label}
                        </div>
                        <div style={{
                          fontFamily: T.mono, fontSize: 10, color: T.textDim,
                          letterSpacing: "0.06em", marginTop: 2,
                        }}>
                          {s.sign_category && (
                            <span style={{
                              color: CAT_COLOR[s.sign_category] || T.textDim,
                              marginRight: 8, textTransform: "uppercase",
                            }}>
                              {SIGN_CAT_FR.find((c) => c.value === s.sign_category)?.label || s.sign_category}
                            </span>
                          )}
                          ×{s.occurrences_count || 1}
                          {s.triggered_lucidity_count > 0 && (
                            <span style={{ color: T.accent, marginLeft: 8 }}>
                              · {s.triggered_lucidity_count} lucid
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Btn danger onClick={() => remove(s.id)} style={{ padding: "4px 10px", fontSize: 11 }}>×</Btn>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </Frame>
        <LucidTabs go={go} current="signs" />
      </Stage>
    );
  };

  // ============================================================
  // 4. WBTB (route lucid-wbtb) — L.5
  // ============================================================
  const DAYS_FR = [
    { value: "mon", label: "lun" },
    { value: "tue", label: "mar" },
    { value: "wed", label: "mer" },
    { value: "thu", label: "jeu" },
    { value: "fri", label: "ven" },
    { value: "sat", label: "sam" },
    { value: "sun", label: "dim" },
  ];
  const SOUND_PROFILES = [
    { value: "gentle",         label: "doux (cloche feutrée)" },
    { value: "chime",          label: "carillon clair" },
    { value: "vibration_only", label: "vibration uniquement" },
  ];

  const LucidWBTBScreen = ({ go }) => {
    const [alarms, setAlarms] = uS([]);
    const [loading, setLoading] = uS(true);
    const [adding, setAdding] = uS(false);
    const [draft, setDraft] = uS(null);

    const refresh = async () => {
      setLoading(true);
      try {
        const res = await window.DreamAPI.listWBTBAlarms();
        setAlarms(res?.alarms || []);
      } finally { setLoading(false); }
    };
    uE(() => { refresh(); }, []);

    const startAdd = () => {
      setDraft({
        bedtime: "23:00",
        wake_time: "04:30",
        back_to_sleep_minutes: 20,
        active_days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        intention_text: "je vais retourner dormir, et je vais reconnaître que je rêve.",
        sound_profile: "gentle",
        enabled: true,
      });
      setAdding(true);
    };

    const save = async () => {
      try {
        await window.DreamAPI.createWBTBAlarm(draft);
        setAdding(false);
        setDraft(null);
        refresh();
      } catch (e) { alert("erreur : " + e.message); }
    };

    const remove = async (id) => {
      if (!confirm("supprimer cette alarme ?")) return;
      await window.DreamAPI.deleteWBTBAlarm(id);
      refresh();
    };

    const toggleEnabled = async (a) => {
      await window.DreamAPI.updateWBTBAlarm(a.id, { enabled: !a.enabled });
      refresh();
    };

    const toggleDay = (d) => {
      if (!draft) return;
      const days = draft.active_days.includes(d)
        ? draft.active_days.filter((x) => x !== d)
        : [...draft.active_days, d];
      setDraft({ ...draft, active_days: days });
    };

    return (
      <Stage>
        <Frame>
          <LucidHeader
            go={go}
            sub="WBTB (Wake Back To Bed) — réveille-toi 4–6h après l'endormissement, reste lucide 15–30 min, retourne dormir avec une intention."
          />

          <Btn primary onClick={startAdd} style={{ marginBottom: 20 }}>+ créer une alarme</Btn>

          {adding && draft && (
            <Card title="nouvelle alarme WBTB" accent>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="heure de coucher">
                  <Input type="time" value={draft.bedtime}
                    onChange={(v) => setDraft({ ...draft, bedtime: v })} />
                </Field>
                <Field label="réveil WBTB"
                  hint="souvent 4h30–6h après le coucher (pendant un cycle REM tardif).">
                  <Input type="time" value={draft.wake_time}
                    onChange={(v) => setDraft({ ...draft, wake_time: v })} />
                </Field>
              </div>

              <Slider
                label="rester éveillé"
                valueLabel={`${draft.back_to_sleep_minutes} min`}
                value={draft.back_to_sleep_minutes}
                onChange={(v) => setDraft({ ...draft, back_to_sleep_minutes: v })}
                min={5} max={45} step={5}
              />

              <Field label="texte d'intention"
                hint="ce que tu vas te répéter en retournant dormir.">
                <textarea
                  value={draft.intention_text}
                  onChange={(e) => setDraft({ ...draft, intention_text: e.target.value })}
                  style={{
                    width: "100%", minHeight: 60,
                    background: T.bg, border: `1px solid ${T.border}`,
                    color: T.text, fontFamily: T.serif, fontStyle: "italic",
                    fontSize: 15, padding: 12, outline: "none", resize: "vertical",
                    borderRadius: 0,
                  }}
                />
              </Field>

              <Field label="son">
                <Select
                  value={draft.sound_profile}
                  onChange={(v) => setDraft({ ...draft, sound_profile: v })}
                  options={SOUND_PROFILES}
                />
              </Field>

              <Field label="jours actifs">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {DAYS_FR.map((d) => (
                    <Chip key={d.value}
                      active={draft.active_days.includes(d.value)}
                      onClick={() => toggleDay(d.value)}
                    >
                      {d.label}
                    </Chip>
                  ))}
                </div>
              </Field>

              <div style={{
                marginTop: 12, marginBottom: 4,
                fontFamily: T.serif, fontStyle: "italic", fontSize: 12,
                color: T.textMuted, lineHeight: 1.5,
              }}>
                note : le déclenchement réel demande l'app native
                (Capacitor + notifications locales). en web, l'alarme reste
                en mémoire ; active les notifications natives quand tu installes
                Dream comme app.
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <Btn primary onClick={save}>créer l'alarme</Btn>
                <Btn ghost onClick={() => { setAdding(false); setDraft(null); }}>annuler</Btn>
              </div>
            </Card>
          )}

          {loading && <div style={{ color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>chargement…</div>}
          {!loading && alarms.length === 0 && !adding && (
            <Card>
              <div style={{
                fontFamily: T.serif, fontStyle: "italic", color: T.textDim,
                textAlign: "center", padding: "16px 0",
              }}>
                aucune alarme WBTB. la pratique demande de la régularité —
                <br />commence par 1 ou 2 nuits par semaine.
              </div>
            </Card>
          )}

          {alarms.map((a) => (
            <Card key={a.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: T.serif, fontStyle: "italic",
                    fontSize: 17, color: T.text, marginBottom: 6,
                  }}>
                    coucher {a.bedtime} → réveil <span style={{ color: T.accent }}>{a.wake_time}</span>
                  </div>
                  <div style={{
                    fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.04em",
                  }}>
                    {a.back_to_sleep_minutes} min éveillé · {(a.active_days || []).map((d) => {
                      const x = DAYS_FR.find((y) => y.value === d);
                      return x ? x.label : d;
                    }).join(", ")}
                    {a.sound_profile && ` · ${SOUND_PROFILES.find((s) => s.value === a.sound_profile)?.label || a.sound_profile}`}
                  </div>
                  {a.intention_text && (
                    <div style={{
                      fontFamily: T.serif, fontStyle: "italic", fontSize: 13,
                      color: T.textDim, marginTop: 8, lineHeight: 1.5,
                      borderLeft: `2px solid ${T.border}`, paddingLeft: 10,
                    }}>
                      « {a.intention_text} »
                    </div>
                  )}
                  <div style={{
                    fontFamily: T.mono, fontSize: 10, color: T.accent, marginTop: 8, letterSpacing: "0.06em",
                  }}>
                    {a.triggered_count || 0} déclenchements · {a.resulted_in_lucid_count || 0} lucides
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <Btn primary={!!a.enabled} onClick={() => toggleEnabled(a)} style={{ padding: "6px 12px", fontSize: 12 }}>
                    {a.enabled ? "actif" : "off"}
                  </Btn>
                  <Btn danger onClick={() => remove(a.id)} style={{ padding: "6px 10px", fontSize: 12 }}>×</Btn>
                </div>
              </div>
            </Card>
          ))}
        </Frame>
        <LucidTabs go={go} current="wbtb" />
      </Stage>
    );
  };

  // ============================================================
  // 5. STATS (route lucid-dashboard) — L.6
  // ============================================================
  const TECH_FR_LABELS = {
    DILD: "DILD",
    MILD: "MILD",
    WILD: "WILD",
    SSILD: "SSILD",
    WBTB: "WBTB",
    spontaneous: "spontané",
    none: "non noté",
    unknown: "—",
  };

  const LucidDashboardScreen = ({ go }) => {
    const [stats, setStats] = uS(null);
    const [loading, setLoading] = uS(true);
    const [exporting, setExporting] = uS(false);
    const [letter, setLetter] = uS(null);
    const [letterLoading, setLetterLoading] = uS(false);

    uE(() => {
      (async () => {
        try {
          const res = await window.DreamAPI.getLucidStats();
          setStats(res?.stats || null);
        } finally { setLoading(false); }
      })();
    }, []);

    const fetchLetter = async (force) => {
      setLetterLoading(true);
      try {
        const res = await window.DreamAPI.getLucidPracticeLetter({ force: !!force });
        setLetter(res || null);
      } catch (e) {
        alert("erreur lettre : " + (e.message || "inconnue"));
      } finally {
        setLetterLoading(false);
      }
    };

    if (loading) {
      return (
        <Stage>
          <Frame>
            <LucidHeader go={go} />
            <div style={{ color: T.textDim, fontFamily: T.serif, fontStyle: "italic" }}>chargement des stats…</div>
          </Frame>
          <LucidTabs go={go} current="stats" />
        </Stage>
      );
    }

    const s = stats || {};

    const exportObsidian = async (format) => {
      setExporting(true);
      try {
        const md = await window.DreamAPI.exportObsidian();
        const ext = format === "json" ? "json" : "md";
        const mime = format === "json" ? "application/json" : "text/markdown";
        // V1 simple : on shipe le markdown même pour json (le front peut transformer plus tard)
        const blob = new Blob([md], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dream-lucid-${new Date().toISOString().slice(0, 10)}.${ext}`;
        document.body.appendChild(a);
        a.click(); a.remove();
        URL.revokeObjectURL(url);
      } catch (e) { alert("export impossible : " + e.message); }
      finally { setExporting(false); }
    };

    return (
      <Stage>
        {/* 2026-04-29 — Halo ember discret en background (Yeshua, opacity 0.10) */}
        {window.HaloRespire && (
          <div aria-hidden="true" style={{
            position: "fixed", top: "30vh", left: "50%",
            transform: "translateX(-50%)",
            width: "min(420px, 85vw)", height: "min(420px, 85vw)",
            opacity: 0.10, pointerEvents: "none", zIndex: 0,
          }}>
            <window.HaloRespire kind="ember" />
          </div>
        )}
        <Frame>
          <LucidHeader
            go={go}
            sub="ces chiffres sont pour toi. il n'y a pas de classement, pas de comparaison avec d'autres rêveurs."
          />

          {/* Métriques principales */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <Stat label="total lucides" value={s.total_lucid_dreams || 0} />
            <Stat label="taux de rappel" value={(s.recall_rate_pct || 0) + "%"}
              hint={`${s.total_dreams || 0} rêves notés`} />
            <Stat label="cette semaine" value={s.current_streak_per_week || 0}
              hint={"meilleur 7 jours : " + (s.best_streak_in_7d_window || 0)} />
            <Stat label="dream signs" value={s.signs_count || 0} />
          </div>

          {/* Graphe lucidité 30j */}
          <Card title="indice de lucidité — 30 derniers jours" accent>
            <LucidLineGraph data={s.recent_lucid_per_day || []} />
          </Card>

          {/* Technique gagnante */}
          <Card title="technique par fréquence">
            {Object.keys(s.technique_breakdown || {}).length === 0 ? (
              <div style={{ fontFamily: T.serif, fontStyle: "italic", color: T.textDim }}>
                pas encore de données — ajoute la métadonnée lucide à un rêve.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(s.technique_breakdown || {})
                  .sort((a, b) => (b[1]) - (a[1]))
                  .map(([t, n]) => {
                    const max = Math.max(...Object.values(s.technique_breakdown || {}).map(Number));
                    const pct = max > 0 ? Math.round((Number(n) / max) * 100) : 0;
                    return (
                      <div key={t}>
                        <div style={{
                          display: "flex", justifyContent: "space-between",
                          fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                          color: T.text, marginBottom: 3,
                        }}>
                          <span>{TECH_FR_LABELS[t] || t}</span>
                          <span style={{ color: T.accent, fontFamily: T.mono, fontStyle: "normal", fontSize: 12 }}>
                            {n}
                          </span>
                        </div>
                        <div style={{ height: 4, background: T.border }}>
                          <div style={{
                            height: "100%", width: pct + "%",
                            background: T.accent, opacity: 0.7,
                            transition: "width 480ms ease",
                          }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </Card>

          {/* Practice letter (narrative, anti-gamification) */}
          <Card title="✦ lettre de pratique · 90 derniers jours" accent>
            {!letter && !letterLoading && (
              <div>
                <p style={{
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
                  color: T.textDim, marginBottom: 14, lineHeight: 1.6,
                }}>
                  une lettre narrative écrite pour toi à partir de ta pratique récente.
                  pas de scores, pas de chiffres — juste ce qui revient, ce qui se tient.
                  régénérée tous les 14 jours.
                </p>
                <Btn primary onClick={() => fetchLetter(false)}>
                  recevoir ma lettre
                </Btn>
              </div>
            )}
            {letterLoading && (
              <div className="breath" style={{
                fontFamily: T.serif, fontStyle: "italic", color: T.textDim,
              }}>
                la lettre s'écrit…
              </div>
            )}
            {letter && letter.letter && (
              <div>
                <div style={{
                  fontFamily: T.serif, fontStyle: "italic", fontSize: 16,
                  color: T.text, lineHeight: 1.75, whiteSpace: "pre-wrap",
                  borderLeft: `2px solid ${T.accent}`, paddingLeft: 18,
                }}>
                  {letter.letter}
                </div>
                <div style={{
                  marginTop: 14, display: "flex", gap: 10, alignItems: "center",
                  fontFamily: T.mono, fontSize: 10, color: T.textDim,
                  letterSpacing: "0.06em",
                }}>
                  <span>{letter.cached ? "lettre en cache" : "fraîchement écrite"}</span>
                  <span>·</span>
                  <span>{letter.word_count || "?"} mots</span>
                  <Btn ghost onClick={() => fetchLetter(true)} style={{ marginLeft: "auto", fontSize: 11 }}>
                    régénérer
                  </Btn>
                </div>
              </div>
            )}
          </Card>

          {/* Top 10 dream signs */}
          <Card title="dream signs · top 10">
            {(s.top_signs || []).length === 0 ? (
              <div style={{ fontFamily: T.serif, fontStyle: "italic", color: T.textDim }}>
                aucun dream sign détecté pour l'instant.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(s.top_signs || []).map((sig, i) => (
                  <div key={sig.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontFamily: T.serif, fontStyle: "italic", fontSize: 15,
                    color: T.text,
                    padding: "6px 0",
                    borderBottom: i < (s.top_signs.length - 1) ? `1px solid ${T.border}` : "none",
                  }}>
                    <span>
                      <span style={{ color: T.textDim, marginRight: 8, fontFamily: T.mono, fontStyle: "normal", fontSize: 11 }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {sig.sign_label}
                    </span>
                    <span style={{ color: T.accent, fontFamily: T.mono, fontStyle: "normal", fontSize: 12 }}>
                      ×{sig.occurrences_count}
                      {sig.triggered_lucidity_count > 0 && ` · ${sig.triggered_lucidity_count}L`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Export */}
          <Card title="exporter">
            <p style={{
              fontFamily: T.serif, fontStyle: "italic", fontSize: 14,
              color: T.textDim, marginBottom: 14, lineHeight: 1.6,
            }}>
              récupère tout ton historique lucide (rêves + métadonnées + dream signs)
              dans un format réutilisable ailleurs.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn primary onClick={() => exportObsidian("md")} disabled={exporting}>
                {exporting ? "…" : "Markdown (Obsidian)"}
              </Btn>
              <Btn onClick={() => exportObsidian("json")} disabled={exporting}>
                JSON
              </Btn>
            </div>
          </Card>
        </Frame>
        <LucidTabs go={go} current="stats" />
      </Stage>
    );
  };

  function Stat({ label, value, hint }) {
    return (
      <div style={{
        background: T.bgSoft, border: `1px solid ${T.border}`,
        padding: "16px 18px",
      }}>
        <div style={{
          fontFamily: T.mono, fontSize: 10, color: T.textDim,
          letterSpacing: "0.12em", textTransform: "uppercase",
          marginBottom: 6,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: T.serif, fontSize: 28, color: T.accent,
          fontStyle: "normal", lineHeight: 1, marginBottom: 4,
        }}>
          {value}
        </div>
        {hint && (
          <div style={{
            fontFamily: T.serif, fontStyle: "italic", fontSize: 12,
            color: T.textDim,
          }}>
            {hint}
          </div>
        )}
      </div>
    );
  }

  function LucidLineGraph({ data }) {
    if (!data || data.length === 0) {
      return (
        <div style={{ fontFamily: T.serif, fontStyle: "italic", color: T.textDim, padding: "12px 0" }}>
          pas encore de données.
        </div>
      );
    }
    const W = 520, H = 120, P = 8;
    const max = Math.max(1, ...data.map((d) => d.count || 0));
    const stepX = (W - P * 2) / Math.max(1, data.length - 1);
    const points = data.map((d, i) => {
      const x = P + i * stepX;
      const y = H - P - ((d.count || 0) / max) * (H - P * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 120, display: "block" }}>
        {/* baseline */}
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke={T.border} strokeWidth="0.6" />
        {/* gradient halo */}
        <defs>
          <linearGradient id="lucidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--silk-gold, #C8A658)" stopOpacity="0.32" />
            <stop offset="100%" stopColor="var(--silk-gold, #C8A658)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          fill="url(#lucidGrad)"
          points={`${P},${H - P} ${points} ${W - P},${H - P}`}
        />
        <polyline fill="none" stroke="var(--silk-gold, #C8A658)" strokeWidth="1.4" points={points} />
        {data.map((d, i) => {
          if (!d.count) return null;
          const x = P + i * stepX;
          const y = H - P - (d.count / max) * (H - P * 2);
          return <circle key={i} cx={x} cy={y} r="2.4" fill="var(--silk-gold, #C8A658)" />;
        })}
      </svg>
    );
  }

  // ============================================================
  // 6. METADATA MODAL — utilisée depuis KairosDetail si lucid mode actif
  // ============================================================
  const TECHNIQUE_FR_OPTS = [
    { value: "none",         label: "—" },
    { value: "DILD",         label: "DILD (spontané)" },
    { value: "MILD",         label: "MILD (intention)" },
    { value: "WILD",         label: "WILD (passage conscient)" },
    { value: "SSILD",        label: "SSILD (cycle des sens)" },
    { value: "WBTB",         label: "WBTB" },
    { value: "spontaneous",  label: "spontané" },
  ];

  const LucidKairosMetadataModal = ({ kairosId, kairosText, onClose, onSaved }) => {
    const [m, setM] = uS({
      lucidity_score: 0,
      lucidity_technique: "none",
      stability_score: 0,
      control_score: 0,
      false_awakening_count: 0,
      reality_check_performed: false,
      signs_recognized: [],
      pre_sleep_intention: "",
      notes_technique: "",
      rem_cycle_estimate: 0,
      hours_slept: 0,
    });
    const [signsAvailable, setSignsAvailable] = uS([]);
    const [saving, setSaving] = uS(false);
    const [extracting, setExtracting] = uS(false);

    uE(() => {
      (async () => {
        try {
          const res = await window.DreamAPI.listDreamSigns();
          setSignsAvailable(res?.dream_signs || []);
        } catch {}
      })();
    }, []);

    const toggleSign = (label) => {
      const next = m.signs_recognized.includes(label)
        ? m.signs_recognized.filter((s) => s !== label)
        : [...m.signs_recognized, label];
      setM({ ...m, signs_recognized: next });
    };

    const save = async () => {
      setSaving(true);
      try {
        await window.DreamAPI.attachLucidMetadata(kairosId, m);
        if (onSaved) onSaved();
        onClose && onClose();
      } catch (e) { alert("erreur : " + e.message); }
      finally { setSaving(false); }
    };

    const extractSigns = async () => {
      setExtracting(true);
      try {
        const res = await window.DreamAPI.extractDreamSigns(kairosId);
        const newSigns = res?.dream_signs || [];
        setSignsAvailable((prev) => {
          const ids = new Set(prev.map((s) => s.id));
          const merged = [...prev];
          for (const s of newSigns) if (!ids.has(s.id)) merged.push(s);
          return merged;
        });
        if (newSigns.length === 0) alert("aucun nouveau dream sign détecté.");
      } catch (e) { alert("erreur : " + e.message); }
      finally { setExtracting(false); }
    };

    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.78)",
        zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16, fontFamily: T.sans,
      }}>
        <div style={{
          background: T.bg, border: `1px solid ${T.border}`,
          maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto",
          padding: 24, color: T.text,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 18,
          }}>
            <h2 style={{
              fontFamily: T.serif, fontStyle: "italic", fontWeight: 300,
              fontSize: 22, color: T.accent, margin: 0,
            }}>
              annoter ce rêve
            </h2>
            <button onClick={onClose} style={{
              background: "transparent", border: "none", color: T.textDim,
              fontFamily: T.serif, fontStyle: "italic", fontSize: 22, cursor: "pointer",
              padding: 4,
            }}>×</button>
          </div>

          <Slider label="lucidité" value={m.lucidity_score}
            onChange={(v) => setM({ ...m, lucidity_score: v })}
            min={0} max={5} valueLabel={`${m.lucidity_score}/5`} />

          <Field label="technique">
            <Select
              value={m.lucidity_technique}
              onChange={(v) => setM({ ...m, lucidity_technique: v })}
              options={TECHNIQUE_FR_OPTS}
            />
          </Field>

          <Slider label="stabilité" value={m.stability_score}
            onChange={(v) => setM({ ...m, stability_score: v })}
            min={0} max={5} valueLabel={`${m.stability_score}/5`} />
          <Slider label="contrôle" value={m.control_score}
            onChange={(v) => setM({ ...m, control_score: v })}
            min={0} max={5} valueLabel={`${m.control_score}/5`} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="cycle REM (estim.)">
              <Input type="number" value={m.rem_cycle_estimate}
                onChange={(v) => setM({ ...m, rem_cycle_estimate: parseInt(v, 10) || 0 })} />
            </Field>
            <Field label="heures de sommeil">
              <Input type="number" value={m.hours_slept}
                onChange={(v) => setM({ ...m, hours_slept: parseFloat(v) || 0 })} />
            </Field>
          </div>

          <Toggle
            on={m.reality_check_performed}
            onClick={() => setM({ ...m, reality_check_performed: !m.reality_check_performed })}
            label="reality check fait dans le rêve"
          />

          <Field label="faux réveils">
            <Input type="number" value={m.false_awakening_count}
              onChange={(v) => setM({ ...m, false_awakening_count: parseInt(v, 10) || 0 })} />
          </Field>

          <Field label="signs reconnus">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: T.serif, fontStyle: "italic", color: T.textDim, fontSize: 13 }}>
                tap pour cocher
              </span>
              <Btn ghost onClick={extractSigns} disabled={extracting} style={{ padding: "4px 10px", fontSize: 12 }}>
                {extracting ? "…" : "+ extraction NLP"}
              </Btn>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {signsAvailable.length === 0 && (
                <span style={{ fontFamily: T.serif, fontStyle: "italic", color: T.textMuted, fontSize: 13 }}>
                  aucun sign — utilise l'extraction NLP.
                </span>
              )}
              {signsAvailable.map((s) => (
                <Chip key={s.id}
                  active={m.signs_recognized.includes(s.sign_label)}
                  onClick={() => toggleSign(s.sign_label)}
                >
                  {s.sign_label}
                </Chip>
              ))}
            </div>
          </Field>

          <Field label="intention pré-sommeil (MILD)">
            <textarea
              value={m.pre_sleep_intention}
              onChange={(e) => setM({ ...m, pre_sleep_intention: e.target.value })}
              placeholder="« la prochaine fois que je vois… »"
              style={{
                width: "100%", minHeight: 56,
                background: T.bg, border: `1px solid ${T.border}`,
                color: T.text, fontFamily: T.serif, fontStyle: "italic",
                fontSize: 14, padding: 10, outline: "none", resize: "vertical",
                borderRadius: 0,
              }}
            />
          </Field>

          <Field label="notes">
            <textarea
              value={m.notes_technique}
              onChange={(e) => setM({ ...m, notes_technique: e.target.value })}
              style={{
                width: "100%", minHeight: 50,
                background: T.bg, border: `1px solid ${T.border}`,
                color: T.text, fontFamily: T.serif, fontStyle: "italic",
                fontSize: 14, padding: 10, outline: "none", resize: "vertical",
                borderRadius: 0,
              }}
            />
          </Field>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <Btn primary onClick={save} disabled={saving}>
              {saving ? "…" : "enregistrer"}
            </Btn>
            <Btn ghost onClick={onClose}>annuler</Btn>
          </div>
        </div>
      </div>
    );
  };

  // ── Expose ─────────────────────────────────────────────────
  window.LucidProfileScreen = LucidProfileScreen;
  window.LucidDashboardScreen = LucidDashboardScreen;
  window.LucidRealityChecksScreen = LucidRealityChecksScreen;
  window.LucidDreamSignsScreen = LucidDreamSignsScreen;
  window.LucidWBTBScreen = LucidWBTBScreen;
  window.LucidKairosMetadataModal = LucidKairosMetadataModal;
})();
