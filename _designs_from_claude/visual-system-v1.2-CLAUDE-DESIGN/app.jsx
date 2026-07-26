/* global React, ReactDOM */
const { useState: uS, useEffect: uE } = React;

function App() {
  const [screen, setScreen] = uS(() => {
    try {
      const p = new URL(location.href).hash.replace("#", "");
      return p || "home";
    } catch { return "home"; }
  });
  const [ctx, setCtx] = uS(null);
  const [entries] = uS(window.seedEntries);

  const go = (s, c) => {
    setScreen(s);
    setCtx(c || null);
    try { location.hash = s; } catch {}
    window.scrollTo({ top: 0 });
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { screen: s } }, "*");
  };

  uE(() => {
    const handler = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweaks(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweaks(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  const [tweaks, setTweaks] = uS(false);
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "screen": "chat"
  }/*EDITMODE-END*/;

  uE(() => {
    if (TWEAK_DEFAULTS.screen && TWEAK_DEFAULTS.screen !== screen) {
      setScreen(TWEAK_DEFAULTS.screen);
    }
  }, []);

  const entry = ctx ? entries.find(e => e.id === ctx) : entries[0];

  let view;
  switch (screen) {
    // core flow
    case "capture":        view = <window.Capture go={go} />; break;
    case "journal":        view = <window.Journal go={go} entries={entries} />; break;
    case "kairos":         view = <window.KairosDetail go={go} entry={entry || entries[0]} allEntries={entries} />; break;
    case "portrait":       view = <window.Portrait go={go} />; break;
    case "anima":          view = <window.AnimaVoute go={go} />; break;
    case "meteo":          view = <window.Meteo go={go} />; break;
    case "polyphonie":     view = <window.Polyphonie go={go} />; break;
    case "chat":           view = <window.Chat go={go} contextId={ctx} />; break;

    // cercle
    case "cercle":         view = <window.CercleScreen go={go} />; break;
    case "creer-cercle":   view = <window.CreerCercleScreen go={go} />; break;
    case "rejoindre":      view = <window.RejoindreScreen go={go} />; break;
    case "partager-reve":  view = <window.PartagerReveScreen go={go} />; break;

    // anima mundi
    case "annales":        view = <window.AnnalesScreen go={go} />; break;
    case "offre-kairos":   view = <window.OffreKairosScreen go={go} />; break;

    // soma
    case "oracle-corps":   view = <window.OracleCorpsScreen go={go} />; break;
    case "conte-miroir":   view = <window.ConteMiroirScreen go={go} />; break;
    case "reentry":        view = <window.ReentryScreen go={go} />; break;

    // meta
    case "onboarding":     view = <window.OnboardingScreen go={go} />; break;
    case "privacy":        view = <window.PrivacyScreen go={go} />; break;
    case "notifs":         view = <window.NotifsScreen go={go} />; break;
    case "abonnement":     view = <window.AbonnementScreen go={go} />; break;

    // figure
    case "figure":         view = <window.FigureDetailScreen go={go} />; break;

    default:               view = <window.Home go={go} entries={entries} />;
  }

  return (
    <>
      {view}
      {tweaks && <TweaksUI screen={screen} go={go} />}
    </>
  );
}

const screenGroups = [
  { label: "matière", items: [
    ["home", "home — journal substrat"],
    ["capture", "capture — somatic gate"],
    ["journal", "journal de vie"],
    ["kairos", "détail kairos"],
  ]},
  { label: "portrait", items: [
    ["portrait", "portrait — constellation"],
    ["figure", "détail figure"],
  ]},
  { label: "cercle", items: [
    ["cercle", "cercle"],
    ["creer-cercle", "créer un cercle"],
    ["rejoindre", "rejoindre cercle"],
    ["partager-reve", "partager un rêve"],
  ]},
  { label: "anima mundi", items: [
    ["anima", "anima mundi — voûte"],
    ["meteo", "météo de l'inconscient"],
    ["polyphonie", "polyphonie lunaire"],
    ["annales", "annales big dreams"],
    ["offre-kairos", "offre au kairos"],
  ]},
  { label: "soma", items: [
    ["oracle-corps", "oracle du corps"],
    ["conte-miroir", "conte-miroir"],
    ["reentry", "réentrée onirique"],
  ]},
  { label: "narratrice", items: [
    ["chat", "chat narratrice"],
  ]},
  { label: "entrée & réglages", items: [
    ["onboarding", "onboarding p-zéro"],
    ["privacy", "paramètres · privacy"],
    ["notifs", "paramètres · notifs"],
    ["abonnement", "paramètres · abonnement"],
  ]},
];

function TweaksUI({ screen, go }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 300, maxHeight: "calc(100vh - 48px)", overflowY: "auto",
      background: "var(--night-warm)",
      border: "1px solid var(--ash-mid)", padding: "var(--s-4)",
      fontFamily: "var(--sans)", fontSize: 13, color: "var(--bone)",
    }}>
      <div className="row mb-m" style={{ justifyContent: "space-between" }}>
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16 }}>Tweaks</div>
        <button className="btn-text" onClick={() => {
          window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
        }}>×</button>
      </div>
      <div className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>écran</div>
      <div className="stack" style={{ gap: 2 }}>
        {screenGroups.map(g => (
          <div key={g.label} style={{ marginTop: 10 }}>
            <div className="meta op-70" style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em", marginBottom: 4 }}>
              {g.label.toUpperCase()}
            </div>
            {g.items.map(([k, l]) => (
              <button key={k}
                onClick={() => go(k)}
                style={{
                  display: "block", width: "100%",
                  textAlign: "left", padding: "5px 10px",
                  background: screen === k ? "color-mix(in oklch, var(--bone) 6%, transparent)" : "transparent",
                  border: "1px solid " + (screen === k ? "var(--bone)" : "var(--ash-deep)"),
                  color: screen === k ? "var(--bone)" : "var(--ash-light)",
                  fontSize: 12.5, fontFamily: "var(--serif)", fontStyle: "italic", cursor: "pointer",
                  marginBottom: 2,
                }}>
                {l}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
