/* global React */
// ──────────────────────────────────────────────────────────────
// OnboardingRituel — 3 écrans rituels
// REFONTE 2026-04-27 (Sprint P0.1) — Onboarding qualifié grand public
// Spec : 1_BIBLE §1.6 + 2_DESIGN §11.bis.16
//
// Pattern : pas de tutoriel pédant. 3 seuils :
//   1. Phrase poétique + glyphe lune décroissante + TRIO de 3 promesses
//      concrètes (capture / patterns / sagesse cumulative) + bouton commencer.
//   2. Qualification d'usage (pas démo) : 3 cards "d'où viens-tu ?"
//      (rêveur / reconnexion / chercheur). Réponse stockée dans
//      localStorage["dream:onboarding-profile"]. Lien "passer cette question →".
//   3. Champ "ton premier dépôt" pré-focus + texte rassurant +
//      DreamAPI.createKairos kairos_type='reve' → home + Wow1.
//
// Skip toujours possible (bouton coin haut-droit).
// Marque localStorage["dream:onboarded:b-plus-d"] à la fin.
// Transitions Van Gennep (380ms cubic-bezier ease-tenue) entre écrans.
//
// Garde-fou : aucun mention "kairos / anima / désensorcelé / journal de vie"
// dans ces 3 écrans. La profondeur se révèle ensuite (DiscoveryReveal).
//
// Évolution refonte P0.1 :
// - Trio promesses sub-titles : capture (en 30s) / patterns (révélés) /
//   sagesse cumulative (au fil du temps). Fade-in séquencé 300/600/900ms.
// - Écran 2 entièrement repensé : qualification > tutoriel.
// - Écran 3 : copy enrichi protection + privacy radicale + fallback skip.
// ──────────────────────────────────────────────────────────────

const { useState: uOR_S, useEffect: uOR_E, useRef: uOR_R } = React;

const ONBOARDED_KEY = "dream:onboarded:b-plus-d";
const PROFILE_KEY = "dream:onboarding-profile";

// Helper : a-t-on déjà fait l'onboarding B+D ?
function isOnboardedBPlusD() {
  try { return !!localStorage.getItem(ONBOARDED_KEY); }
  catch { return false; }
}

// Helper : marquer l'onboarding comme fait (à la fin OU au skip)
function markOnboardedBPlusD() {
  try { localStorage.setItem(ONBOARDED_KEY, String(Date.now())); } catch {}
}

// Helper : stocker le profil d'usage (servira plus tard pour personnaliser)
function setOnboardingProfile(profile) {
  try { localStorage.setItem(PROFILE_KEY, profile); } catch {}
}

// ── Glyphe lune décroissante (SVG) — porte RÊVE ──
function GlyphLuneDecroissante({ size = 88, breathing = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
      className={breathing ? "onb-lune-breath" : ""}
      style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <mask id="onb-lune-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <circle cx="62" cy="50" r="34" fill="black" />
        </mask>
      </defs>
      <circle cx="50" cy="50" r="32" fill="none"
        stroke="color-mix(in oklch, var(--silk-gold) 60%, var(--bone))"
        strokeWidth="1.1" opacity="0.78" />
      <circle cx="50" cy="50" r="32"
        fill="color-mix(in oklch, var(--silk-gold) 28%, var(--night-warm))"
        mask="url(#onb-lune-mask)"
        opacity="0.88" />
    </svg>
  );
}

// ── Glyphe trinité (3 cercles concentriques) — écran 2 qualification ──
function GlyphTrinite({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
      style={{ display: "block", margin: "0 auto" }}>
      <circle cx="50" cy="50" r="36" fill="none"
        stroke="color-mix(in oklch, var(--silk-gold) 35%, var(--ash-light))"
        strokeWidth="0.9" opacity="0.6" />
      <circle cx="50" cy="50" r="24" fill="none"
        stroke="color-mix(in oklch, var(--silk-gold) 50%, var(--bone))"
        strokeWidth="1" opacity="0.78" />
      <circle cx="50" cy="50" r="12" fill="none"
        stroke="color-mix(in oklch, var(--silk-gold) 70%, var(--bone))"
        strokeWidth="1.1" opacity="0.92" />
      <circle cx="50" cy="50" r="2.4"
        fill="color-mix(in oklch, var(--silk-gold) 80%, var(--bone))"
        opacity="0.95" />
    </svg>
  );
}

// ── Composant principal ────────────────────────────────────────
const OnboardingRituel = ({ go }) => {
  const [step, setStep] = uOR_S(0); // 0 | 1 | 2
  const [animating, setAnimating] = uOR_S(false); // transition Van Gennep
  const [text, setText] = uOR_S("");
  const [submitting, setSubmitting] = uOR_S(false);
  const [submitError, setSubmitError] = uOR_S(null);
  const [selectedProfile, setSelectedProfile] = uOR_S(null);
  // 2026-04-29 (Yeshua, FIX P0 anim) — Spirale wow déclenchée au passage step 2
  // (premier message à Anima). Auto-disparaît après 1.9s via SpiraleWowOverlay.
  const [wowSpirale, setWowSpirale] = uOR_S(false);
  const taRef = uOR_R(null);

  // 2026-04-29 (Yeshua, FIX P0 anim) — Backdrop animé commun aux 3 écrans :
  // Surface silk + HaloRespire silk discret. Posé en absolute z-index 0,
  // derrière SkipButton et contenu. La Surface donne grain/respiration au fond.
  const OnbBackdrop = () => (
    <React.Fragment>
      {window.Surface && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.45,
          pointerEvents: "none", zIndex: 0,
        }}>
          <window.Surface matter="silk" motion={true}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
      )}
      {window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.5,
          pointerEvents: "none", zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}
    </React.Fragment>
  );

  // Pré-focus du textarea sur l'écran 3
  uOR_E(() => {
    if (step === 2 && taRef.current) {
      // Petit délai pour laisser la transition finir
      setTimeout(() => { try { taRef.current && taRef.current.focus(); } catch {} }, 420);
    }
  }, [step]);

  // Transition 380ms entre écrans (Van Gennep, ease-tenue)
  const goStep = (n) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(n);
      setAnimating(false);
    }, 380);
  };

  // Sélection profil écran 2 → stock + transition vers écran 3
  const pickProfile = (profile) => {
    setSelectedProfile(profile);
    setOnboardingProfile(profile);
    // Petit délai visuel pour que la card sélectionnée se voie avant transition
    setTimeout(() => {
      goStep(2);
      // 2026-04-29 (Yeshua, FIX P0 anim) — Spirale wow au moment où l'on
      // entre dans le rituel "premier message à Anima" (step 2). Marqueur
      // sensoriel du seuil. Auto-disparaît après ~1.9s.
      setTimeout(() => setWowSpirale(true), 380);
    }, 280);
  };

  // Skip → marque comme fait, retour home
  const skip = () => {
    markOnboardedBPlusD();
    if (typeof go === "function") go("home");
    else { try { window.location.hash = "home"; } catch {} window.location.reload && window.location.reload(); }
  };

  // Fin de l'onboarding : tente de créer un kairos type='reve' si texte rempli
  const finish = async () => {
    if (text.trim().length >= 3 && window.DreamAPI && window.DreamAPI.createKairos) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        await window.DreamAPI.createKairos({
          raw_text: text.trim(),
          kairos_type: "reve",
          capture_method: "text",
        });
        // Wow1 : premier kairos déposé (idempotent via wowRegistry)
        try { window.wowRegistry?.fire?.("premier-kairos"); } catch {}
      } catch (e) {
        setSubmitError("Le dépôt a buté : " + (e?.message || "?") + " — on continue, tu pourras réessayer.");
        // On marque quand même comme onboardé, pas de blocage
      } finally {
        setSubmitting(false);
      }
    }
    markOnboardedBPlusD();
    // Refresh entries si possible
    if (window.DreamRefreshEntries) setTimeout(() => window.DreamRefreshEntries(), 250);
    if (typeof go === "function") go("home");
    else { try { window.location.hash = "home"; } catch {} }
  };

  // Bouton "passer" coin haut-droit toujours visible
  const SkipButton = () => (
    <button onClick={skip} aria-label="passer l'onboarding"
      style={{
        position: "absolute", top: 18, right: 22, zIndex: 5,
        background: "transparent", border: "none", cursor: "pointer",
        color: "var(--ash-light)", opacity: 0.65,
        fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
        letterSpacing: "0.02em",
        padding: "8px 12px",
        transition: "opacity 380ms ease",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
      onMouseLeave={e => e.currentTarget.style.opacity = "0.65"}>
      passer →
    </button>
  );

  // ── ÉCRAN 1 ── Phrase poétique + glyphe lune respirant + TRIO promesses + bouton commencer
  if (step === 0) {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "var(--night-floor)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "var(--s-5)",
        opacity: animating ? 0 : 1,
        transition: "opacity 380ms cubic-bezier(0.45,0,0.15,1)",
        overflow: "hidden",
      }}>
        <SkipButton />
        <OnbBackdrop />

        {/* Halo subtil derrière la lune (cohérence DreamHome §11.bis.15) */}
        <div className="onb-halo-bg" aria-hidden="true" />

        <div style={{ maxWidth: 540, textAlign: "center", position: "relative", zIndex: 1 }}>
          <GlyphLuneDecroissante size={96} breathing={true} />

          <p style={{
            marginTop: "var(--s-6)",
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 32, lineHeight: 1.42,
            color: "var(--bone)",
            textWrap: "pretty",
            letterSpacing: "0.005em",
            textShadow: "0 1px 14px color-mix(in oklch, var(--night-floor) 50%, transparent)",
          }}>
            Dream — pour tes rêves,<br />
            et ce qu'ils éclairent.
          </p>

          {/* TRIO de 3 promesses concrètes — fade-in séquencé */}
          <div className="onb-trio" role="list" aria-label="ce que Dream te permet">
            <div className="onb-trio-item onb-trio-1" role="listitem">
              <span className="onb-trio-title">capture</span>
              <span className="onb-trio-paren">(en 30s)</span>
            </div>
            <span className="onb-trio-sep" aria-hidden="true">/</span>
            <div className="onb-trio-item onb-trio-2" role="listitem">
              <span className="onb-trio-title">patterns</span>
              <span className="onb-trio-paren">(révélés)</span>
            </div>
            <span className="onb-trio-sep onb-trio-sep-2" aria-hidden="true">/</span>
            <div className="onb-trio-item onb-trio-3" role="listitem">
              <span className="onb-trio-title">sagesse cumulative</span>
              <span className="onb-trio-paren">(au fil du temps)</span>
            </div>
          </div>

          <button onClick={() => goStep(1)}
            className="onb-btn-commencer"
            style={{
              marginTop: "var(--s-7)",
              background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
              border: "1px solid var(--silk-gold)",
              color: "var(--bone)",
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
              padding: "13px 32px",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 380ms cubic-bezier(0.45,0,0.15,1)",
              boxShadow: "0 0 22px color-mix(in oklch, var(--silk-gold) 16%, transparent)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, transparent)";
              e.currentTarget.style.boxShadow = "0 0 30px color-mix(in oklch, var(--silk-gold) 26%, transparent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, transparent)";
              e.currentTarget.style.boxShadow = "0 0 22px color-mix(in oklch, var(--silk-gold) 16%, transparent)";
            }}>
            commencer
          </button>
        </div>

        <style>{`
          .onb-halo-bg {
            position: absolute;
            top: 50%; left: 50%;
            width: 520px; height: 520px;
            transform: translate(-50%, -64%);
            background: radial-gradient(circle, color-mix(in oklch, var(--silk-gold) 8%, transparent) 0%, transparent 65%);
            pointer-events: none;
            z-index: 0;
            animation: onb-halo-breath 9s ease-in-out infinite;
          }
          @keyframes onb-halo-breath {
            0%, 100% { opacity: 0.55; transform: translate(-50%, -64%) scale(1); }
            50%      { opacity: 0.85; transform: translate(-50%, -64%) scale(1.06); }
          }
          .onb-lune-breath {
            animation: onb-lune-breath-anim 6s ease-in-out infinite;
          }
          @keyframes onb-lune-breath-anim {
            0%, 100% { opacity: 0.92; transform: scale(1); }
            50%      { opacity: 1;    transform: scale(1.025); }
          }

          /* TRIO promesses — fade-in séquencé 300/600/900ms */
          .onb-trio {
            margin-top: var(--s-5);
            display: flex; flex-wrap: wrap;
            align-items: baseline; justify-content: center;
            gap: 14px;
            padding: 0 8px;
          }
          .onb-trio-item {
            display: inline-flex; flex-direction: column;
            align-items: center; gap: 2px;
            opacity: 0;
            animation-name: onb-trio-fade-up;
            animation-duration: 720ms;
            animation-timing-function: cubic-bezier(0.45,0,0.15,1);
            animation-fill-mode: forwards;
          }
          .onb-trio-1 { animation-delay: 300ms; }
          .onb-trio-2 { animation-delay: 600ms; }
          .onb-trio-3 { animation-delay: 900ms; }
          .onb-trio-title {
            font-family: var(--serif); font-style: italic; font-size: 14px;
            color: var(--ash-light);
            letter-spacing: 0.02em;
            opacity: 0.92;
          }
          .onb-trio-paren {
            font-family: var(--serif); font-style: italic; font-size: 12px;
            color: var(--ash-light);
            opacity: 0.55;
            letter-spacing: 0.01em;
          }
          .onb-trio-sep {
            font-family: var(--serif); font-style: italic; font-size: 14px;
            color: var(--ash-light);
            opacity: 0;
            animation: onb-trio-sep-fade 720ms cubic-bezier(0.45,0,0.15,1) forwards;
            animation-delay: 450ms;
          }
          .onb-trio-sep-2 { animation-delay: 750ms; }
          @keyframes onb-trio-fade-up {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes onb-trio-sep-fade {
            from { opacity: 0; }
            to   { opacity: 0.4; }
          }
          @media (max-width: 480px) {
            .onb-trio {
              flex-direction: column;
              gap: 10px;
            }
            .onb-trio-sep { display: none; }
          }
        `}</style>
      </div>
    );
  }

  // ── ÉCRAN 2 ── QUALIFICATION : "D'où viens-tu ?" 3 cards
  if (step === 1) {
    const profiles = [
      {
        id: "rêveur",
        glyph: "🌙",
        text: "Je rêve souvent et je veux les comprendre",
      },
      {
        id: "reconnexion",
        glyph: "✨",
        text: "Je me souviens à peine de mes rêves, je voudrais m'y reconnecter",
      },
      {
        id: "chercheur",
        glyph: "☉",
        text: "Je cherche du sens dans ma vie et j'entends parler de Dream",
      },
    ];

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "var(--night-floor)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "var(--s-5)",
        opacity: animating ? 0 : 1,
        transition: "opacity 380ms cubic-bezier(0.45,0,0.15,1)",
        overflowY: "auto",
      }}>
        <SkipButton />
        <OnbBackdrop />

        <div style={{ maxWidth: 480, width: "100%", textAlign: "center", padding: "var(--s-5) 0", position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "var(--s-5)" }}>
            <GlyphTrinite size={72} />
          </div>

          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            fontSize: 26, lineHeight: 1.42,
            color: "var(--bone)",
            marginBottom: "var(--s-6)",
            textWrap: "pretty",
            letterSpacing: "0.005em",
          }}>
            D'où viens-tu&nbsp;?
          </p>

          <div className="onb-qual-cards" role="radiogroup" aria-label="d'où viens-tu">
            {profiles.map((p, i) => {
              const selected = selectedProfile === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={selected}
                  onClick={() => pickProfile(p.id)}
                  className={"onb-qual-card onb-qual-card-" + i + (selected ? " is-selected" : "")}
                  disabled={!!selectedProfile}
                  style={{
                    cursor: selectedProfile ? "default" : "pointer",
                  }}
                >
                  <span className="onb-qual-glyph" aria-hidden="true">{p.glyph}</span>
                  <span className="onb-qual-text">{p.text}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goStep(2)}
            className="onb-qual-skip"
            style={{
              marginTop: "var(--s-5)",
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.55,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
              letterSpacing: "0.02em",
              padding: "8px 12px",
              transition: "opacity 380ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.55"}>
            passer cette question →
          </button>
        </div>

        <style>{`
          .onb-qual-cards {
            display: flex; flex-direction: column; gap: 12px;
            width: 100%;
          }
          .onb-qual-card {
            display: flex; align-items: center;
            gap: 14px;
            text-align: left;
            background: color-mix(in oklch, var(--night-warm) 50%, transparent);
            border: 1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep));
            padding: 16px 18px;
            color: var(--bone);
            font-family: var(--serif); font-style: italic; font-size: 15px;
            line-height: 1.45;
            letter-spacing: 0.005em;
            transition: all 380ms cubic-bezier(0.45,0,0.15,1);
            opacity: 0;
            animation: onb-qual-card-in 720ms cubic-bezier(0.45,0,0.15,1) forwards;
          }
          .onb-qual-card-0 { animation-delay: 200ms; }
          .onb-qual-card-1 { animation-delay: 400ms; }
          .onb-qual-card-2 { animation-delay: 600ms; }
          .onb-qual-card:hover:not(:disabled) {
            background: color-mix(in oklch, var(--night-warm) 70%, transparent);
            border-color: color-mix(in oklch, var(--silk-gold) 32%, var(--ash-deep));
            transform: translateY(-1px);
          }
          .onb-qual-card.is-selected {
            background: color-mix(in oklch, var(--silk-gold) 12%, var(--night-warm));
            border-color: var(--silk-gold);
            box-shadow: 0 0 24px color-mix(in oklch, var(--silk-gold) 18%, transparent);
          }
          .onb-qual-glyph {
            font-size: 22px;
            line-height: 1;
            min-width: 28px;
            text-align: center;
            font-style: normal;
            opacity: 0.92;
          }
          .onb-qual-text {
            flex: 1;
            font-style: italic;
          }
          @keyframes onb-qual-card-in {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ── ÉCRAN 3 ── Premier dépôt : champ pré-focus + protection + privacy radicale
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "var(--night-warm)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      padding: "calc(var(--s-7) + env(safe-area-inset-top, 0)) var(--s-5) var(--s-6)",
      opacity: animating ? 0 : 1,
      transition: "opacity 380ms cubic-bezier(0.45,0,0.15,1)",
      overflowY: "auto",
    }}>
      <SkipButton />
      <OnbBackdrop />
      {/* 2026-04-29 (Yeshua, FIX P0 anim) — Spirale wow déclenchée
          au passage step 2, marque sensoriel du seuil "premier message". */}
      {window.SpiraleWowOverlay && (
        <window.SpiraleWowOverlay
          show={wowSpirale}
          onDone={() => setWowSpirale(false)}
        />
      )}

      <div style={{ maxWidth: 540, width: "100%", marginTop: "var(--s-5)", position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "var(--s-5)" }}>
          <GlyphLuneDecroissante size={64} breathing={true} />
        </div>

        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 26, lineHeight: 1.42,
          color: "var(--bone)",
          textWrap: "pretty",
          marginBottom: "var(--s-3)",
          textAlign: "center",
          letterSpacing: "0.005em",
        }}>
          Ton premier dépôt.
        </p>

        {/* Texte rassurant — protection + privacy radicale */}
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 13, lineHeight: 1.6,
          color: "var(--ash-light)",
          opacity: 0.82,
          textAlign: "center",
          marginBottom: "var(--s-5)",
          textWrap: "pretty",
          letterSpacing: "0.005em",
          maxWidth: 460, marginLeft: "auto", marginRight: "auto",
        }}>
          peu importe — un fragment, une image, une sensation,
          ou une ligne sur ce que tu vis aujourd'hui.<br />
          l'app garde tout, sans jugement, sans effort, en privacy radicale.
        </p>

        <textarea
          ref={taRef}
          rows={6}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="raconte — un fragment, une image, une sensation…"
          disabled={submitting}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
            padding: "var(--s-4)",
            color: "var(--bone)",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, lineHeight: 1.6,
            resize: "vertical", outline: "none",
            minHeight: 130,
            transition: "border-color 380ms cubic-bezier(0.45,0,0.15,1), box-shadow 380ms ease",
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))";
            e.currentTarget.style.boxShadow = "0 0 16px color-mix(in oklch, var(--silk-gold) 12%, transparent)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))";
            e.currentTarget.style.boxShadow = "none";
          }}
        />

        {submitError && (
          <div className="meta mt-s" style={{
            color: "var(--ember-live, #C97A4A)",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            marginTop: "var(--s-3)",
          }}>
            {submitError}
          </div>
        )}

        <div className="row" style={{
          marginTop: "var(--s-5)",
          justifyContent: "center", alignItems: "center",
          flexDirection: "column", gap: 14,
        }}>
          <button onClick={finish}
            disabled={submitting}
            style={{
              background: text.trim().length >= 3
                ? "color-mix(in oklch, var(--silk-gold) 18%, transparent)"
                : "transparent",
              border: "1px solid " + (text.trim().length >= 3
                ? "var(--silk-gold)"
                : "color-mix(in oklch, var(--silk-gold) 50%, var(--bone))"),
              color: "var(--bone)",
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16,
              padding: "13px 28px",
              cursor: submitting ? "default" : "pointer",
              opacity: submitting ? 0.5 : 1,
              letterSpacing: "0.02em",
              transition: "all 380ms cubic-bezier(0.45,0,0.15,1)",
              boxShadow: text.trim().length >= 3
                ? "0 0 22px color-mix(in oklch, var(--silk-gold) 18%, transparent)"
                : "none",
            }}>
            {submitting
              ? "dépôt en cours…"
              : (text.trim().length >= 3 ? "déposer mon premier rêve" : "déposer mon premier rêve")}
          </button>

          <button onClick={finish}
            disabled={submitting}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.6,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
              padding: "6px 0",
              letterSpacing: "0.02em",
              transition: "opacity 380ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}>
            ou commencer sans déposer →
          </button>
        </div>

        {/* Micro-text bas : indicateur de la porte cachée */}
        <p className="meta op-50 mt-l" style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 12, color: "var(--ash-light)",
          textAlign: "center", marginTop: "var(--s-6)",
          textWrap: "pretty",
          opacity: 0.55,
          letterSpacing: "0.01em",
        }}>
          le glyphe lune en haut révèle toutes les portes cachées.
        </p>

        {/* Lien retour discret */}
        <div style={{ textAlign: "center", marginTop: "var(--s-4)" }}>
          <button onClick={() => goStep(1)}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.45,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12,
              padding: "6px 0",
              transition: "opacity 380ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.75"}
            onMouseLeave={e => e.currentTarget.style.opacity = "0.45"}>
            ← retour
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Exports → window ───────────────────────────────────────────
Object.assign(window, {
  OnboardingRituel,
  isOnboardedBPlusD,
  markOnboardedBPlusD,
});
