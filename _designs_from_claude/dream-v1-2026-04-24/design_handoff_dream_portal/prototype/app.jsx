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
    "screen": "home"
  }/*EDITMODE-END*/;

  uE(() => {
    if (TWEAK_DEFAULTS.screen && TWEAK_DEFAULTS.screen !== screen) {
      setScreen(TWEAK_DEFAULTS.screen);
    }
  }, []);

  const entry = ctx ? entries.find(e => e.id === ctx) : entries[0];

  let view;
  switch (screen) {
    case "capture":    view = <window.Capture go={go} />; break;
    case "journal":    view = <window.Journal go={go} entries={entries} />; break;
    case "kairos":     view = <window.KairosDetail go={go} entry={entry || entries[0]} allEntries={entries} />; break;
    case "portrait":   view = <window.Portrait go={go} />; break;
    case "anima":      view = <window.AnimaVoute go={go} />; break;
    case "meteo":      view = <window.Meteo go={go} />; break;
    case "polyphonie": view = <window.Polyphonie go={go} />; break;
    case "chat":       view = <window.Chat go={go} contextId={ctx} />; break;
    default:           view = <window.Home go={go} entries={entries} />;
  }

  return (
    <>
      {view}
      {tweaks && <TweaksUI screen={screen} go={go} />}
    </>
  );
}

function TweaksUI({ screen, go }) {
  const screens = [
    ["home", "Home — journal substrat"],
    ["capture", "Capture — somatic gate"],
    ["journal", "Journal de Vie"],
    ["kairos", "Détail Kairos"],
    ["portrait", "Portrait — constellation"],
    ["anima", "Anima Mundi — Voûte"],
    ["meteo", "Météo de l'inconscient"],
    ["polyphonie", "Polyphonie lunaire"],
    ["chat", "Chat narratrice"],
  ];
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      width: 280, background: "var(--night-warm)",
      border: "1px solid var(--ash-mid)", padding: "var(--s-4)",
      fontFamily: "var(--sans)", fontSize: 13, color: "var(--bone)"
    }}>
      <div className="row mb-m" style={{ justifyContent: "space-between" }}>
        <div style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 16 }}>Tweaks</div>
        <button className="btn-text" onClick={() => {
          window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
        }}>×</button>
      </div>
      <div className="meta op-70 mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>écran</div>
      <div className="stack" style={{ gap: 4 }}>
        {screens.map(([k, l]) => (
          <button key={k}
            onClick={() => go(k)}
            style={{
              textAlign: "left", padding: "6px 10px",
              background: screen === k ? "color-mix(in oklch, var(--bone) 6%, transparent)" : "transparent",
              border: "1px solid " + (screen === k ? "var(--bone)" : "var(--ash-deep)"),
              color: screen === k ? "var(--bone)" : "var(--ash-light)",
              fontSize: 13, fontFamily: "var(--serif)", fontStyle: "italic", cursor: "pointer"
            }}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
