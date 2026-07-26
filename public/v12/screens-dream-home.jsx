/* global React */
// ──────────────────────────────────────────────────────────────
// DreamHome — Porte d'entrée RÊVE (directive Tim 2026-04-26)
// Spec : 1_BIBLE §1.6 + 2_DESIGN §11.bis.12 + 11.bis.17 (P0.3)
//
// Pivot cardinal Tim 26/04 :
//   "La porte d'entrée reste le RÊVE. Faut que ce soit clair, et que
//    ça reste une super DREAM APP au quotidien. C'est LA porte
//    d'entrée. Le reste est une découverte surprenante permanente
//    d'une incroyable profondeur."
//
// Cet écran remplace `JournalDeVieJour` comme route par défaut `home`.
// Le Journal de Vie LUMINEUX devient sous-page accessible via
// swipe horizontal OU lien "et ta vie de jour ?" (déplacé en bas P0.3).
//
// 2026-04-27 P0.3 — Refonte hiérarchie 3 niveaux :
//   - HERO (primaire) : phrase invitation + textarea + bouton ⌄
//   - AMBIANCE (secondaire) : glyphe lune top-left avec hint + halo
//   - INVITATIONS (tertiaire) : "et ta vie de jour ?" + "et aussi"
//     liens texte sobres en bas (au-dessus du BottomNav)
//
// Drawer caché SUPPRIMÉ (§11.bis.17). Glyphe lune route maintenant
// vers /explorer (onglet permanent BottomNav).
//
// Patterns dominants :
//   - DREAM_FIRST_ENTRY (la promesse rêve honorée dès la 1ère seconde)
//   - DISCOVERABLE_DEPTH (P-Zéro §2.1 — profondeur révélée progressivement)
//   - GESTE_UNIQUE (déposer — ici par défaut un kairos type='reve')
//   - KAIROS_PREVIEW (dernière entrée discrète en bas)
//   - HIÉRARCHIE EXPLICITE (P0.3) — 3 niveaux clairs, pas de bouton muet
// ──────────────────────────────────────────────────────────────

const { useState: dhS, useEffect: dhE, useRef: dhR } = React;

// ── Phrases d'invitation rotative selon heure ─────────────────
function dreamInvitation() {
  const h = new Date().getHours();
  // matin (4-11) : on revient de la nuit
  if (h >= 4 && h < 12) return "Quel rêve vient ce matin ?";
  // après-midi (12-18) : un rêve t'a marqué ?
  if (h >= 12 && h < 19) return "Un rêve t'a marqué aujourd'hui ?";
  // soir/nuit (19-3) : déposer pour la nuit qui vient
  return "Quel rêve veux-tu déposer ?";
}

// ── Glyphe lune décroissante (SVG) ─────────────────────────────
// Sprint P1 §C : enveloppé d'un halo radial silk-gold respirant 8s.
// Le halo est rendu en gradient SVG (radialGradient) + animation `dh-halo-souffle`
// définie dans la <style> globale du composant (clé : présence d'un keyframe
// dans le block style global au bas de DreamHome).
function GlyphLuneDecroissante({ size = 36 }) {
  // Halo 80×80 (ou 2.22× la taille de la lune) — ne bouge pas le layout du bouton
  // car positionné absolute derrière. Utilisé seulement quand size >= 32 (pas
  // sur les petits glyphes des modal headers).
  const haloSize = Math.max(size * 2.4, 80);
  const showHalo = size >= 28;
  return (
    <span style={{ position: "relative", display: "inline-grid", placeItems: "center" }}>
      {showHalo && (
        <svg
          aria-hidden="true"
          width={haloSize}
          height={haloSize}
          viewBox="0 0 100 100"
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            opacity: 0.55,
            animation: "dh-halo-souffle 8s ease-in-out infinite",
            filter: "blur(0.6px)",
          }}
        >
          <defs>
            <radialGradient id={`dh-halo-grad-${size}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="color-mix(in oklch, var(--silk-gold) 50%, transparent)" stopOpacity="0.42" />
              <stop offset="55%" stopColor="color-mix(in oklch, var(--silk-gold) 28%, transparent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="color-mix(in oklch, var(--silk-gold) 14%, transparent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill={`url(#dh-halo-grad-${size})`} />
        </svg>
      )}
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true"
        style={{ display: "block", position: "relative" }}>
        {/* lune décroissante : disque masqué par croissant à droite */}
        <defs>
          <mask id="lune-decroissante-mask">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <circle cx="62" cy="50" r="34" fill="black" />
          </mask>
        </defs>
        <circle cx="50" cy="50" r="32" fill="none"
          stroke="color-mix(in oklch, var(--silk-gold) 45%, var(--bone))"
          strokeWidth="1.1" opacity="0.65" />
        <circle cx="50" cy="50" r="32"
          fill="color-mix(in oklch, var(--silk-gold) 22%, var(--night-warm))"
          mask="url(#lune-decroissante-mask)"
          opacity="0.85" />
      </svg>
    </span>
  );
}

// ──────────────────────────────────────────────────────────────
// Découverte progressive — système d'auto-révélation
// ──────────────────────────────────────────────────────────────

const REVEAL_KEY = "dream:discovery:revealed";
const REVEAL_DISMISSED_KEY = "dream:discovery:dismissed-at";

const DISCOVERY_LEVELS = [
  {
    key: "journal-vie",
    threshold: 3,
    glyph: "☉",
    title: "une seconde porte s'ouvre",
    text: "3 rêves déposés. Sais-tu qu'ils peuvent éclairer ta vie de jour ?",
    cta: "ouvrir Journal de Vie",
    route: "home-jour",
  },
  {
    key: "cercle",
    threshold: 7,
    glyph: "○",
    title: "tu n'es pas seul·e à rêver",
    text: "7 rêves déposés. Tu peux aussi rejoindre un cercle pour partager.",
    cta: "découvrir les cercles",
    route: "cercle",
  },
  {
    key: "anima",
    threshold: 14,
    glyph: "◐",
    title: "le rêve du monde t'attend",
    // 2026-04-27 P0.4 — text peut être un render function (JSX) pour TermDef
    text: () => {
      const T = window.TermDef;
      return (
        <>
          14 rêves déposés. {T ? <T term="anima_mundi" /> : "Anima Mundi"} — la voûte commune — a quelque chose à te dire.
        </>
      );
    },
    cta: "ouvrir Anima Mundi",
    route: "anima",
  },
  {
    key: "portrait-lettre",
    threshold: 30,
    glyph: "✷",
    title: "une lettre t'a été tissée",
    text: () => {
      const T = window.TermDef;
      return (
        <>
          30 rêves déposés. Une lecture personnelle peut être faite — ta {T ? <T term="portrait_lettre" /> : "lettre du moment"}.
        </>
      );
    },
    cta: "demander ma lettre",
    route: "portrait",
  },
];

function getRevealed() {
  try { return JSON.parse(localStorage.getItem(REVEAL_KEY) || "[]"); }
  catch { return []; }
}
function markRevealed(key) {
  try {
    const r = getRevealed();
    if (!r.includes(key)) {
      r.push(key);
      localStorage.setItem(REVEAL_KEY, JSON.stringify(r));
    }
  } catch {}
}
function getDismissedAt() {
  try { return parseInt(localStorage.getItem(REVEAL_DISMISSED_KEY) || "0", 10); }
  catch { return 0; }
}
function setDismissedAt(t) {
  try { localStorage.setItem(REVEAL_DISMISSED_KEY, String(t)); } catch {}
}

// shouldRevealDiscovery(kairosCount) → returns the next pending level or null.
// Skip if a level was dismissed in the last 7d.
function shouldRevealDiscovery(kairosCount) {
  const revealed = getRevealed();
  const dismissedAt = getDismissedAt();
  // Re-prompt cooldown : 7j
  if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 3600 * 1000) return null;
  for (const lvl of DISCOVERY_LEVELS) {
    if (revealed.includes(lvl.key)) continue;
    if (kairosCount >= lvl.threshold) return lvl;
  }
  return null;
}

// ── Modal douce de révélation ─────────────────────────────────
const DiscoveryReveal = ({ level, go, onClose }) => {
  if (!level) return null;
  const handleDiscover = () => {
    markRevealed(level.key);
    onClose && onClose();
    if (typeof go === "function") setTimeout(() => go(level.route), 200);
  };
  const handleLater = () => {
    setDismissedAt(Date.now());
    onClose && onClose();
  };
  return (
    <div role="dialog" aria-modal="true" aria-label={level.title}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "color-mix(in oklch, var(--night-floor) 80%, transparent)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--s-5)",
        animation: "dh-modal-fade-in 480ms ease",
      }}>
      <div style={{
        maxWidth: 420, width: "100%",
        background: "color-mix(in oklch, var(--night-warm) 92%, transparent)",
        border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
        padding: "var(--s-6) var(--s-5)",
        textAlign: "center",
        boxShadow: "0 6px 40px color-mix(in oklch, var(--night-floor) 60%, transparent)",
      }}>
        <div style={{
          fontSize: 32, marginBottom: "var(--s-3)",
          color: "var(--silk-gold)", opacity: 0.85,
        }}>{level.glyph}</div>
        <div style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 17, color: "var(--bone)",
          marginBottom: "var(--s-3)",
          letterSpacing: "0.01em",
        }}>{level.title}</div>
        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 15, lineHeight: 1.55,
          color: "var(--ash-light)",
          marginBottom: "var(--s-5)",
          textWrap: "pretty",
        }}>{typeof level.text === "function" ? level.text() : level.text}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button onClick={handleDiscover}
            style={{
              background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 50%, var(--bone))",
              color: "var(--bone)",
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 15,
              padding: "11px 22px",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition: "all 380ms ease",
            }}>
            {level.cta}
          </button>
          <button onClick={handleLater}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.6,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
              padding: "8px 0",
            }}>
            plus tard
          </button>
        </div>
      </div>
      <style>{`
        @keyframes dh-modal-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ── Drawer "découvrir" (Sprint P0 §B 2026-04-27) — LEGACY ────
// 2026-04-27 (P0.2) : DRAWER OBSOLÈTE. Le hub "découvrir" est
// devenu un onglet permanent dans BottomNav (route "explorer",
// composant ExplorerScreen). Le composant est conservé en
// compatibilité (zéro consommateur dans l'app après cette refonte)
// mais N'EST PLUS APPELÉ depuis DreamHome (le glyphe lune route
// directement vers /explorer).
//
// À retirer dans une session suivante après vérif. de zéro usage.
const DiscoverDrawer = ({ open, onClose, go }) => {
  // Ferme drawer puis route vers la destination
  const goAndClose = (route) => {
    onClose && onClose();
    setTimeout(() => { try { go && go(route); } catch {} }, 220);
  };

  // Items du drawer — sobres, un par un, palette night-warm
  const items = [
    { glyph: "☉", label: "Tes kairos",                hint: "l'historique de tes rêves et signes",      route: "journal" },
    { glyph: "◉", label: "Oracle du Corps",           hint: "le corps comme sismographe",               route: "oracle-corps" },
    { glyph: "✦", label: "Cauchemars & Deuil",        hint: "sanctuaire pour ce qui pèse",              route: "nightmares" },
    { glyph: "❋", label: "Tales — contes qui répondent", hint: "32 contes réels qui font écho",         route: "conte-miroir" },
    { glyph: "◐", label: "Mode Lucid",                hint: "pour pratiquer le rêve lucide",            route: "lucid-profile" },
    { glyph: "·", label: "Paramètres",                hint: "préférences, notifications",               route: "privacy" },
  ];

  return (
    <>
      {/* Overlay (tap-outside ferme) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 310,
          background: "color-mix(in oklch, var(--night-floor) 70%, transparent)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 300ms cubic-bezier(0.45,0,0.55,1)",
          backdropFilter: open ? "blur(4px)" : "none",
          WebkitBackdropFilter: open ? "blur(4px)" : "none",
        }}
      />
      {/* Drawer panel — slide-in gauche */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="découvrir les autres entrées"
        style={{
          position: "fixed", top: 0, bottom: 0, left: 0,
          width: "min(86vw, 340px)",
          zIndex: 311,
          background: "color-mix(in oklch, var(--night-warm) 96%, var(--night-floor))",
          borderRight: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
          boxShadow: open ? "8px 0 28px color-mix(in oklch, var(--night-floor) 50%, transparent)" : "none",
          transform: open ? "translateX(0)" : "translateX(-104%)",
          transition: "transform 380ms cubic-bezier(0.45,0,0.55,1), box-shadow 380ms ease",
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 22px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 18px)",
          display: "flex", flexDirection: "column",
          color: "var(--bone)",
          fontFamily: "var(--serif)",
        }}
      >
        {/* Header drawer */}
        <div style={{
          padding: "0 22px 18px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid color-mix(in oklch, var(--silk-gold) 10%, var(--ash-deep))",
        }}>
          <span style={{
            fontStyle: "italic", fontSize: 15,
            color: "var(--silk-gold)", opacity: 0.85,
            letterSpacing: "0.04em",
          }}>découvrir</span>
          <button
            onClick={onClose}
            aria-label="fermer le menu"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.6,
              fontSize: 20, padding: "4px 6px",
              transition: "opacity 280ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.6}
          >×</button>
        </div>

        {/* Items */}
        <nav style={{
          flex: 1, overflowY: "auto",
          padding: "var(--s-3) 0",
        }}>
          {items.map((it, i) => (
            <button
              key={it.route}
              onClick={() => goAndClose(it.route)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                width: "100%", textAlign: "left",
                background: "transparent", border: "none", cursor: "pointer",
                padding: "14px 22px",
                color: "var(--bone)",
                fontFamily: "var(--serif)",
                transition: "background 280ms ease, color 280ms ease",
                borderBottom: i < items.length - 1
                  ? "1px solid color-mix(in oklch, var(--silk-gold) 6%, var(--ash-deep))"
                  : "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 4%, transparent)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{
                fontSize: 18, color: "var(--silk-gold)", opacity: 0.78,
                marginTop: 1, minWidth: 18,
              }}>{it.glyph}</span>
              <span style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
                <span style={{
                  fontStyle: "italic", fontSize: 15.5,
                  letterSpacing: "0.005em",
                }}>{it.label}</span>
                <span style={{
                  fontStyle: "italic", fontSize: 12.5,
                  color: "var(--ash-light)", opacity: 0.7,
                  lineHeight: 1.45, textWrap: "pretty",
                }}>{it.hint}</span>
              </span>
            </button>
          ))}
        </nav>

        {/* Footer drawer */}
        <div style={{
          padding: "16px 22px 0",
          borderTop: "1px solid color-mix(in oklch, var(--silk-gold) 8%, var(--ash-deep))",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontStyle: "italic", fontSize: 11.5,
          color: "var(--ash-light)", opacity: 0.55,
          letterSpacing: "0.05em",
        }}>
          <span>v0.4 · alpha</span>
          <button
            onClick={onClose}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.7,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11.5,
              padding: 0,
              letterSpacing: "0.05em",
            }}
          >← retour</button>
        </div>
      </aside>
    </>
  );
};

// ── DreamHome — composant principal ───────────────────────────
const DreamHome = ({ go, entries }) => {
  const [text, setText] = dhS("");
  const [submitting, setSubmitting] = dhS(false);
  const [error, setError] = dhS(null);
  const [recording, setRecording] = dhS(false);
  const [transcribing, setTranscribing] = dhS(false);
  const [reveal, setReveal] = dhS(null); // discovery level pending
  const [protoReveal, setProtoReveal] = dhS(false); // 2026-04-26 — modal "Avec un guide" (Bible §3.11)
  // 2026-04-27 P0.3 — hint "explorer" sous la lune top-left après 2s
  // (signal de tappabilité doux, pas d'animation criarde).
  const [showLuneHint, setShowLuneHint] = dhS(false);
  // Sprint P1 §B (2026-04-27) — chuchotement écho prophétique mûri
  const [propheticEcho, setPropheticEcho] = dhS(null);
  const [propheticDismissing, setPropheticDismissing] = dhS(false);
  const taRef = dhR(null);
  const mediaRef = dhR(null);
  const chunksRef = dhR([]);

  const invitation = dreamInvitation();

  // Dernière entrée preview (preferred : kairos, fallback : note de vie)
  const latest = (() => {
    if (!entries || entries.length === 0) return null;
    // Prefer the latest kairos type='reve' if any, else any latest entry
    const reveLatest = entries.find(e => e.type === "reve" || e._raw?.kairos_type === "reve");
    return reveLatest || entries[0];
  })();

  // Voice recording (port from Capture/JournalDeVieJour) ─────
  const pickMimeType = () => {
    if (typeof MediaRecorder === "undefined") return null;
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/aac",
      "audio/ogg;codecs=opus",
    ];
    for (const t of candidates) {
      try {
        if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t;
      } catch {}
    }
    return "";
  };

  const startRecording = async () => {
    try {
      if (typeof MediaRecorder === "undefined") {
        setError("Enregistrement vocal non supporté ici. Essaie en texte.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      const actualMime = mr.mimeType || mimeType || "audio/webm";
      chunksRef.current = [];
      mr.ondataavailable = (ev) => { if (ev.data.size > 0) chunksRef.current.push(ev.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: actualMime });
        setTranscribing(true);
        try {
          const result = await window.DreamAPI.transcribe(blob, actualMime);
          if (result?.text) setText(prev => (prev ? prev + "\n\n" : "") + result.text);
          else if (result?.error) setError("Transcription : " + result.error);
        } catch (e) {
          setError("Transcription échouée : " + e.message);
        } finally {
          setTranscribing(false);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setError("Micro inaccessible : " + e.message);
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") mediaRef.current.stop();
    setRecording(false);
  };

  // Submit a kairos type='reve' (default) ────────────────────
  const submit = async () => {
    if (text.trim().length < 3) return;
    setSubmitting(true); setError(null);
    try {
      const result = await window.DreamAPI.createKairos({
        raw_text: text.trim(),
        kairos_type: "reve",
        capture_method: recording || transcribing ? "voice" : "text",
      });
      // Wow1 : premier kairos déposé (idempotent)
      try { window.wowRegistry?.fire?.("premier-kairos"); } catch {}
      setText("");
      // Refresh global entries
      if (window.DreamRefreshEntries) setTimeout(() => window.DreamRefreshEntries(), 250);
      // Naviguer vers KairosDetail (post-capture suggestion type via chips)
      if (result?.kairos?.id && typeof go === "function") {
        setTimeout(() => go("kairos", result.kairos.id), 350);
      }
    } catch (e) {
      setError("Dépôt échoué : " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Sprint P1 §B (2026-04-27) — fetch écho prophétique mûri au mount.
  // Si présent → affichage chuchotement au-dessus de la phrase d'invitation.
  // localStorage hold : "dream:prophetic:dismissed" empêche le re-affichage
  // d'un écho déjà dismiss côté client (en plus du serveur). Cooldown court 7j.
  dhE(() => {
    let cancelled = false;
    (async () => {
      try {
        // Skip si dismiss client-side récent (cooldown 7j)
        const localDismiss = parseInt(localStorage.getItem("dream:prophetic:dismissed") || "0", 10);
        if (localDismiss && Date.now() - localDismiss < 7 * 24 * 3600 * 1000) return;
        if (!window.DreamAPI?.getMaturedPropheticEchoes) return;
        const r = await window.DreamAPI.getMaturedPropheticEchoes();
        if (cancelled) return;
        const e = r?.echoes && r.echoes[0];
        if (e && e.kairos_id) setPropheticEcho(e);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Sprint P1 §B — handler dismiss du chuchotement (POST + close UI + cooldown)
  const dismissPropheticEcho = async () => {
    if (!propheticEcho || propheticDismissing) return;
    setPropheticDismissing(true);
    const id = propheticEcho.kairos_id;
    try {
      try { localStorage.setItem("dream:prophetic:dismissed", String(Date.now())); } catch {}
      if (window.DreamAPI?.dismissPropheticEcho) {
        await window.DreamAPI.dismissPropheticEcho(id);
      }
    } catch {}
    finally {
      setPropheticEcho(null);
      setPropheticDismissing(false);
    }
  };

  // Sprint P1 §B — handler tap chuchotement → navigate vers KairosDetail
  const openPropheticEcho = () => {
    if (!propheticEcho) return;
    const id = propheticEcho.kairos_id;
    setPropheticEcho(null);
    if (typeof go === "function") go("kairos", id);
  };

  // 2026-04-27 P0.3 — Hint "explorer" apparaît après 2s sous la lune
  // top-left (signal de tappabilité, opacity 0 → 0.5 fade-in 920ms).
  // Skip si user a déjà visité explorer au moins 1 fois (localStorage).
  dhE(() => {
    let hasVisitedExplorer = false;
    try { hasVisitedExplorer = localStorage.getItem("dream:explorer-visited") === "true"; } catch {}
    if (hasVisitedExplorer) return;
    const t = setTimeout(() => setShowLuneHint(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // Discovery reveal check on mount + when entries change ────
  dhE(() => {
    if (!entries || entries.length === 0) return;
    const lvl = shouldRevealDiscovery(entries.length);
    if (lvl) {
      // Délai léger pour ne pas frapper l'écran d'arrivée
      const t = setTimeout(() => setReveal(lvl), 1400);
      return () => clearTimeout(t);
    }
    // 2026-04-26 — Protocoles reveal (Bible §3.11) si pas de discovery autre + count >= 3
    if (typeof window.shouldRevealProtocoles === "function" && window.shouldRevealProtocoles(entries.length)) {
      const t = setTimeout(() => setProtoReveal(true), 2000);
      return () => clearTimeout(t);
    }
  }, [entries?.length]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--night-floor)",
      color: "var(--bone)",
      display: "flex", flexDirection: "column",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 110px)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 2026-04-29 — HaloRespire silk fixed (Yeshua, animation TEMPO-SOUFFLE).
          Posé en background absolute fixed top, derrière contenu.
          Respecte prefers-reduced-motion (la classe est neutralisée par CSS).
          2026-04-29 (FIX #4) — opacity 0.18 → 0.42 : à 0.18 le halo était
          quasi invisible (4% luminance effective). 0.42 reste subtil
          mais perceptible. */}
      {window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          opacity: 0.42,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}

      {/* Sprint P1 §C — vignette radiale warm pour casser le noir trop vide
          (haut centre = très légère lueur silk-gold, bas = night-floor pur).
          Plus subtil qu'un gradient direct sur background : c'est un overlay
          additif qui respecte la palette dark-first. */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 90% 60% at 50% 28%, color-mix(in oklch, var(--silk-gold) 6%, transparent) 0%, transparent 70%)",
      }} />

      {/* Ash subtle grain overlay (matter ash, 4% effective opacity) — Sprint P1 §C confirmé */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        opacity: 0.22, zIndex: 1,
      }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ display: "block" }}>
          <rect width="100%" height="100%" filter="url(#noise-ash)" />
        </svg>
      </div>

      {/* Header : glyphe lune (gauche, ambiance + tap = explorer)
          2026-04-27 P0.3 — Le top-right toggle "et ta vie de jour ?" est
          DÉPLACÉ EN BAS (zone tertiaire). Le glyphe lune devient
          ambiance avec hint "explorer" en mono uppercase qui apparaît
          après 2s pour signaler la tappabilité (skip si user déjà visité). */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "flex-start", alignItems: "flex-start",
        padding: "0 22px 4px",
        minHeight: 56,
      }}>
        <button
          onClick={() => {
            try { localStorage.setItem("dream:explorer-visited", "true"); } catch {}
            setShowLuneHint(false);
            go && go("explorer");
          }}
          aria-label="ouvrir explorer"
          title="explorer toutes les portes de Dream"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            padding: 4, margin: -4,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            transition: "transform 380ms cubic-bezier(0.45,0,0.55,1), opacity 280ms ease",
            opacity: 0.95,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.08)"; e.currentTarget.style.opacity = 1; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.opacity = 0.95; }}
        >
          <GlyphLuneDecroissante size={32} />
          {/* Hint "explorer" — apparaît après 2s, fade-in 920ms,
              guide doux vers le hub. Disparaît dès que user a tap. */}
          <span aria-hidden="true" style={{
            fontFamily: "var(--mono, monospace)",
            fontSize: 9,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ash-light)",
            opacity: showLuneHint ? 0.5 : 0,
            transition: "opacity 920ms ease",
            marginTop: 2,
            pointerEvents: "none",
          }}>explorer</span>
        </button>
      </div>

      {/* Centre : phrase d'invitation + champ + bouton ⌄ déposer */}
      <div style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "var(--s-6) 24px var(--s-5)",
        maxWidth: 580, width: "100%", margin: "0 auto",
      }}>
        {/* Sprint P1 §B (2026-04-27) — Chuchotement écho prophétique mûri.
            Apparaît AU-DESSUS de la phrase d'invitation. Tap → KairosDetail
            du kairos résonnant. "x" → POST dismiss + cooldown 7j. */}
        {propheticEcho && (
          <div className="dh-prophetic-whisper" role="button" tabIndex={0}
            onClick={openPropheticEcho}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPropheticEcho(); } }}
            aria-label="ouvrir le kairos qui résonne"
            style={{
              position: "relative",
              marginBottom: "var(--s-5)",
              padding: "12px 36px 12px 14px",
              borderTop: "1px dashed color-mix(in oklch, var(--silk-gold) 30%, transparent)",
              borderBottom: "1px dashed color-mix(in oklch, var(--silk-gold) 30%, transparent)",
              cursor: "pointer",
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
              lineHeight: 1.55,
              color: "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))",
              letterSpacing: "0.005em",
              textWrap: "pretty",
              display: "flex", alignItems: "center", gap: 12,
              transition: "background 380ms ease, color 380ms ease",
              animation: "dh-whisper-fade-in 920ms ease-out",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 4%, transparent)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            {/* Glyph ◑ qui pulse 4s */}
            <span aria-hidden="true" style={{
              fontSize: 17,
              color: "var(--silk-gold)",
              opacity: 0.85,
              animation: "dh-whisper-pulse 4s ease-in-out infinite",
              flexShrink: 0,
              fontStyle: "normal",
            }}>◑</span>

            {/* Phrase chuchotée */}
            <span style={{ flex: 1 }}>
              {propheticEcho.whisper || "un kairos d'autrefois résonne avec ta semaine"}
              <span aria-hidden="true" style={{
                marginLeft: 8,
                color: "color-mix(in oklch, var(--silk-gold) 60%, var(--ash-light))",
                opacity: 0.7,
              }}>→</span>
            </span>

            {/* Bouton x dismiss — discret, top-right absolute */}
            <button
              onClick={(e) => { e.stopPropagation(); dismissPropheticEcho(); }}
              aria-label="ne plus afficher ce chuchotement"
              title="ne plus afficher"
              disabled={propheticDismissing}
              style={{
                position: "absolute",
                top: 6, right: 6,
                background: "transparent", border: "none",
                cursor: propheticDismissing ? "default" : "pointer",
                padding: "4px 8px",
                fontSize: 14,
                color: "var(--ash-light)",
                opacity: 0.5,
                fontFamily: "var(--serif)", fontStyle: "normal",
                lineHeight: 1,
                transition: "opacity 280ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; }}
            >×</button>
          </div>
        )}

        {/* 2026-04-29 — Petit glyphe spirale logarithmique au-dessus du champ
            (Yeshua). 24x24, animation breathe-souffle 6s, opacité 0.55. */}
        {window.GeoSymbol && (
          <div aria-hidden="true" style={{
            display: "flex", justifyContent: "center", marginBottom: 14,
          }}>
            <div style={{
              position: "relative", width: 28, height: 28,
              opacity: 0.6,
              animation: "breathe-souffle 6s ease-in-out infinite",
            }}>
              <window.GeoSymbol kind="spirale" color="silk"
                style={{ position: "relative", width: 28, height: 28, opacity: 1 }} />
            </div>
          </div>
        )}

        <p style={{
          fontFamily: "var(--serif)", fontStyle: "italic",
          fontSize: 24, lineHeight: 1.45,
          color: "var(--bone)",
          textAlign: "center",
          marginBottom: "var(--s-5)",
          textWrap: "pretty",
          letterSpacing: "0.005em",
          textShadow: "0 1px 14px color-mix(in oklch, var(--night-floor) 50%, transparent)",
        }}>
          {invitation}
        </p>

        {/* 2026-04-27 Sprint P0 §B : micro voix devient petit icône à droite du textarea
            (intégré dans le champ, plus de row sphère séparée). */}
        <div style={{ position: "relative", width: "100%" }}>
          <textarea
            ref={taRef}
            value={text}
            onChange={e => { setText(e.target.value); setError(null); }}
            placeholder="raconte — un fragment, une image, une sensation…"
            disabled={submitting}
            rows={5}
            autoFocus
            style={{
              width: "100%",
              minHeight: 140,
              background: "color-mix(in oklch, var(--night-warm) 60%, transparent)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
              padding: "18px 48px 18px 20px", // padding-right augmenté pour micro
              color: "var(--bone)",
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17, lineHeight: 1.6,
              outline: "none", resize: "vertical",
              boxSizing: "border-box",
              transition: "border-color 380ms ease",
            }}
            onFocus={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 38%, var(--ash-deep))"}
            onBlur={e => e.currentTarget.style.borderColor = "color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))"}
          />
          {/* Micro voix intégré au champ — petit icône discret top-right du textarea */}
          <button
            onClick={recording ? stopRecording : startRecording}
            aria-label={recording ? "arrêter l'enregistrement" : "déposer en voix"}
            title={recording ? "arrêter l'enregistrement" : "déposer en voix"}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "transparent", border: "none",
              padding: 6,
              cursor: "pointer",
              color: recording ? "var(--ember-live, #C97A4A)" : "var(--ash-light)",
              fontSize: 16,
              opacity: recording ? 1 : 0.55,
              display: "grid", placeItems: "center",
              transition: "all 280ms ease",
              borderRadius: "50%",
            }}
            onMouseEnter={e => { if (!recording) e.currentTarget.style.opacity = 1; }}
            onMouseLeave={e => { if (!recording) e.currentTarget.style.opacity = 0.55; }}
          >
            {recording ? "■" : "🎙"}
          </button>
        </div>

        {error && (
          <div style={{
            color: "var(--ember-live, #C97A4A)",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            marginTop: 8,
          }}>
            {error}
          </div>
        )}

        {transcribing && (
          <div style={{
            color: "var(--silk-gold)", fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            marginTop: 8,
          }}>
            transcription en cours…
          </div>
        )}

        {/* 2026-04-27 Sprint P0 §B : UN SEUL bouton ⌄ central proéminent, halo ember radial pulsant 8s.
            (Plus de row sphères séparée — micro est dans le textarea ci-dessus,
            FAB BottomNav reste accessible permanent.) */}
        <div style={{
          marginTop: "var(--s-5)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <button
            onClick={submit}
            disabled={submitting || text.trim().length < 3}
            aria-label="déposer ce rêve"
            className="dh-deposer-button"
            style={{
              width: 76, height: 76, borderRadius: "50%",
              background: "radial-gradient(circle at 30% 30%, color-mix(in oklch, var(--ember) 32%, var(--night-warm)), color-mix(in oklch, var(--silk-gold) 18%, var(--night-floor)))",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 35%, var(--ash-deep))",
              cursor: (submitting || text.trim().length < 3) ? "not-allowed" : "pointer",
              opacity: (submitting || text.trim().length < 3) ? 0.45 : 1,
              display: "grid", placeItems: "center",
              color: "var(--bone)", fontSize: 28,
              transition: "all 380ms cubic-bezier(0.45,0,0.55,1)",
              position: "relative",
              boxShadow: "0 0 32px color-mix(in oklch, var(--silk-gold) 22%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 22%, transparent)",
              animation: (submitting || text.trim().length < 3) ? "none" : "dh-halo-pulse 8s ease-in-out infinite",
            }}>
            {submitting ? (
              <span style={{ fontSize: 20 }}>…</span>
            ) : (
              /* 2026-04-29 — Demi-cercle aurore inline (Yeshua) :
                 petit demi-cercle silk-gold qui pulse en mode silk-gold,
                 remplace le "⌄" plat par un signe de seuil aurore. */
              <svg viewBox="0 0 60 28" width="38" height="20" aria-hidden="true"
                style={{ display: "block", overflow: "visible" }}>
                <path d="M 4 24 Q 30 -4, 56 24"
                  fill="none"
                  stroke="color-mix(in oklch, var(--silk-gold) 90%, var(--bone))"
                  strokeWidth="1.4" strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px color-mix(in oklch, var(--silk-gold) 55%, transparent))" }}
                />
                <path d="M 10 24 Q 30 4, 50 24"
                  fill="none"
                  stroke="color-mix(in oklch, var(--silk-gold) 60%, transparent)"
                  strokeWidth="0.9" strokeLinecap="round" opacity="0.6"
                />
              </svg>
            )}
          </button>

          <div style={{
            textAlign: "center",
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14,
            color: "var(--bone)", opacity: 0.85, letterSpacing: "0.02em",
          }}>
            déposer un rêve
          </div>
        </div>

        {/* Halo pulsant — keyframes locales (8s, ember radial doux, respect dark-first)
            Sprint P1 §B+C — ajout dh-halo-souffle (lune top-left), dh-whisper-pulse,
            dh-whisper-fade-in (chuchotement écho prophétique). */}
        <style>{`
          @keyframes dh-halo-pulse {
            0%   { box-shadow: 0 0 28px color-mix(in oklch, var(--silk-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 22%, transparent); }
            50%  { box-shadow: 0 0 48px color-mix(in oklch, var(--ember) 28%, transparent), 0 0 18px color-mix(in oklch, var(--silk-gold) 26%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 28%, transparent); }
            100% { box-shadow: 0 0 28px color-mix(in oklch, var(--silk-gold) 18%, transparent), inset 0 1px 0 color-mix(in oklch, var(--silk-gold) 22%, transparent); }
          }
          /* Sprint P1 §C — halo souffle derrière la lune top-left (8s) */
          @keyframes dh-halo-souffle {
            0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
            50%      { opacity: 0.7; transform: translate(-50%, -50%) scale(1.08); }
          }
          /* Sprint P1 §B — pulse glyph ◑ chuchotement (4s) */
          @keyframes dh-whisper-pulse {
            0%, 100% { opacity: 0.55; transform: scale(1); }
            50%      { opacity: 1;    transform: scale(1.12); }
          }
          /* Sprint P1 §B — entrée du chuchotement (douce) */
          @keyframes dh-whisper-fade-in {
            from { opacity: 0; transform: translateY(-4px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>

      {/* Bas : preview de la dernière entrée (1 ligne italic) */}
      {latest && (
        <div style={{
          position: "relative", zIndex: 2,
          padding: "var(--s-4) 24px 0",
          maxWidth: 580, width: "100%", margin: "0 auto",
          textAlign: "center",
        }}>
          <button
            onClick={() => go && go("kairos", latest.id)}
            aria-label="ouvrir la dernière entrée"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.55,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
              lineHeight: 1.5, padding: "8px 0",
              maxWidth: "100%",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              display: "block", margin: "0 auto",
              letterSpacing: "0.005em",
              transition: "opacity 380ms ease",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
            onMouseLeave={e => e.currentTarget.style.opacity = 0.55}>
            <span style={{ opacity: 0.7, marginRight: 8 }}>·</span>
            {(latest.text || "").slice(0, 88)}{(latest.text || "").length > 88 ? "…" : ""}
          </button>
        </div>
      )}

      {/* 2026-04-27 P0.3 — Zone TERTIAIRE invitations.
          Lien "et ta vie de jour ?" déplacé du top-right vers ici (sous le
          preview). Underline dashed silk-gold pour signaler le bascule
          horizontal vers Journal de Vie LUMINEUX. */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "var(--s-3) 24px 0",
        maxWidth: 580, width: "100%", margin: "0 auto",
        textAlign: "center",
      }}>
        <button onClick={() => go && go("home-jour")}
          title="bascule vers ton Journal de Vie LUMINEUX"
          aria-label="ouvrir le Journal de Vie"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))",
            opacity: 0.75,
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            padding: "6px 4px",
            letterSpacing: "0.02em",
            textDecoration: "underline",
            textDecorationStyle: "dashed",
            textUnderlineOffset: 4,
            textDecorationColor: "color-mix(in oklch, var(--silk-gold) 35%, transparent)",
            transition: "opacity 380ms ease, color 380ms ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--silk-gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = 0.75; e.currentTarget.style.color = "color-mix(in oklch, var(--silk-gold) 70%, var(--bone))"; }}>
          <span aria-hidden="true" style={{ marginRight: 5, fontSize: 12 }}>☉</span>
          et ta vie de jour ?
        </button>
      </div>

      {/* 2026-04-27 P0.3 — "et aussi" micro-bar
          Révèle 3 features-clés (sagesse / oracle / tales) en text-link
          sobres séparés par "·". User qui a 5+ kairos voit ces alternatives
          sans encombrer le hero. Tap → navigate. Hover → silk-gold full. */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "var(--s-3) 24px 0",
        maxWidth: 580, width: "100%", margin: "0 auto",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 11.5,
          color: "var(--ash-light)", opacity: 0.5,
          letterSpacing: "0.08em",
          textTransform: "lowercase",
          marginBottom: 6,
        }}>
          <span aria-hidden="true" style={{
            display: "inline-block", width: 14, height: 1,
            background: "color-mix(in oklch, var(--ash-light) 50%, transparent)",
          }} />
          <span>et aussi</span>
          <span aria-hidden="true" style={{
            display: "inline-block", width: 14, height: 1,
            background: "color-mix(in oklch, var(--ash-light) 50%, transparent)",
          }} />
        </div>
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: 10, flexWrap: "wrap",
          fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5,
        }}>
          <button onClick={() => go && go("explorer")}
            aria-label="ouvrir Sagesse des kairos via explorer"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.7,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5,
              padding: "3px 4px",
              letterSpacing: "0.02em",
              transition: "all 280ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--silk-gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = "var(--ash-light)"; }}>
            <span style={{ marginRight: 4, opacity: 0.85 }}>✦</span>appel sagesse
          </button>
          <span aria-hidden="true" style={{ color: "var(--ash-light)", opacity: 0.35 }}>·</span>
          <button onClick={() => go && go("oracle-corps")}
            aria-label="ouvrir Oracle du Corps"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.7,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5,
              padding: "3px 4px",
              letterSpacing: "0.02em",
              transition: "all 280ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--silk-gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = "var(--ash-light)"; }}>
            <span style={{ marginRight: 4, opacity: 0.85 }}>◉</span>oracle du corps
          </button>
          <span aria-hidden="true" style={{ color: "var(--ash-light)", opacity: 0.35 }}>·</span>
          <button onClick={() => go && go("conte-miroir")}
            aria-label="ouvrir Tales — contes qui répondent"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ash-light)", opacity: 0.7,
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 12.5,
              padding: "3px 4px",
              letterSpacing: "0.02em",
              transition: "all 280ms ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--silk-gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; e.currentTarget.style.color = "var(--ash-light)"; }}>
            <span style={{ marginRight: 4, opacity: 0.85 }}>❋</span>tales
          </button>
        </div>
      </div>

      {/* Discovery reveal modal */}
      {reveal && (
        <DiscoveryReveal level={reveal} go={go} onClose={() => setReveal(null)} />
      )}

      {/* 2026-04-26 — Protocoles reveal modal (Bible §3.11 — découverte progressive J3) */}
      {protoReveal && window.ProtocoleDiscoveryReveal && (
        <window.ProtocoleDiscoveryReveal go={go} onClose={() => setProtoReveal(false)} />
      )}

      {/* 2026-04-27 P0.2 — DiscoverDrawer DÉPRÉCIÉ. Le hub est maintenant
          un onglet permanent (route "explorer"). Le drawer reste exporté
          en compatibilité mais n'est plus monté ici. */}
    </div>
  );
};

// ── Exports → window ───────────────────────────────────────────
Object.assign(window, {
  DreamHome,
  DiscoveryReveal,
  DiscoverDrawer, // 2026-04-27 Sprint P0 §B
  shouldRevealDiscovery,
  markRevealedDiscovery: markRevealed,
  getRevealedDiscoveries: getRevealed,
  dreamInvitation,
});
