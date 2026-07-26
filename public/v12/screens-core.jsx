/* global React */
const { useState, useEffect, useRef, useMemo } = React;

// ── Sample data ─────────────────────────────────────────────
const seedEntries = [
  {
    id: "k-08",
    type: "dream_night",
    when: "ce matin, avant le réveil",
    text: "Une grand-mère inconnue lave du linge dans une cuisine sans feu. Elle ne me regarde pas mais sait mon nom. Quelque part, une porte qu'on ne finit pas d'ouvrir.",
    numinous: true,
    bigDream: true,
  },
  {
    id: "k-07",
    type: "note_vie",
    when: "hier soir",
    text: "Doute profond sur la mission. Ce n'est pas la peur d'échouer. C'est la peur que ce soit juste — et qu'il faille tout redessiner.",
  },
  {
    id: "k-06",
    type: "sidewalk_oracle",
    when: "hier, 14h",
    text: "Un corbeau sur le muret de la mosquée, qui tenait dans son bec une feuille morte plus grande que sa tête. Il ne la laissait pas tomber.",
  },
  {
    id: "k-05",
    type: "synchronicity",
    when: "avant-hier",
    text: "Trois personnes, en moins de six heures, m'ont parlé d'un pont inachevé. Aucune ne se connaissait.",
  },
  {
    id: "k-04",
    type: "daydream_reverie",
    when: "il y a quatre jours, midi",
    text: "Pendant une conversation sur les taxes, j'ai vu un estuaire depuis en haut. L'eau cherchait son lit entre des bancs de sable que personne n'avait dessinés.",
  },
  {
    id: "k-03",
    type: "dream_night",
    when: "il y a une lune",
    text: "Une maison aux pièces inconnues. Je cherche un enfant qui pleure derrière une porte. La porte est plus petite que moi.",
    echoOf: "k-08",
  },
  {
    id: "k-02",
    type: "somatic_shiver",
    when: "il y a deux lunes",
    text: "Frisson dans la nuque en lisant une lettre ancienne. Pas de mots — juste le frisson.",
  },
  {
    id: "k-01",
    type: "note_vie",
    when: "il y a deux lunes",
    text: "Décision reportée sur le contrat Paris. Quelque chose dans le ventre dit attends.",
  },
];

// ── Type glyphs (matter) ────────────────────────────────────
const typeLabel = (t) => ({
  dream_night: "rêve nocturne",
  sidewalk_oracle: "signe diurne",
  daydream_reverie: "rêverie",
  hypnagogic: "hypnagogie",
  synchronicity: "synchronicité",
  somatic_shiver: "frisson somatique",
  note_vie: "note de vie",
}[t] || "moment");

const TypeGlyph = ({ type, size = 14 }) => {
  const common = { width: size, height: size, fill: "none", stroke: "currentColor", strokeWidth: 1 };
  switch (type) {
    case "dream_night":
      return <svg {...common}><circle cx={size/2} cy={size/2} r={size/2 - 1} /></svg>;
    case "sidewalk_oracle":
      return <svg {...common}><polygon points={`${size/2},1 ${size-1},${size-1} 1,${size-1}`} /></svg>;
    case "daydream_reverie":
      return <svg {...common}><path d={`M1 ${size/2} Q ${size/4} 1 ${size/2} ${size/2} T ${size-1} ${size/2}`} /></svg>;
    case "synchronicity":
      return <svg {...common}><circle cx={size/3} cy={size/2} r={size/4} /><circle cx={2*size/3} cy={size/2} r={size/4} /></svg>;
    case "somatic_shiver":
      return <svg {...common}><path d={`M1 ${size-2} L ${size/3} 2 L ${2*size/3} ${size-2} L ${size-1} 2`} /></svg>;
    case "hypnagogic":
      return <svg {...common}><line x1="1" y1={size/2} x2={size-1} y2={size/2} /><circle cx={size/2} cy={size/2} r="2" /></svg>;
    default:
      return <svg {...common}><rect x="1" y="1" width={size-2} height={size-2} /></svg>;
  }
};

// ── Seasonal compass (top nav) ──────────────────────────────
const SeasonalCompass = () => (
  <div className="nav-compass">
    <span className="glyph">◐</span>lune décroissante · mars
  </div>
);

const TopNav = ({ onLogo, showBack, onBack, label }) => (
  <nav className="nav">
    {showBack ? (
      <button className="btn-text" onClick={onBack} aria-label="retour">
        ← {label || "retour"}
      </button>
    ) : (
      <button onClick={onLogo} aria-label="accueil"
        style={{ background: "none", border: "none", padding: 0 }}>
        <span className="nav-dot" />
      </button>
    )}
    <SeasonalCompass />
  </nav>
);

// ── Home (journal substrat) ─────────────────────────────────
const Home = ({ go, entries, loading }) => {
  const latest = (entries && entries[0]) || (window.seedEntries || [])[0] || null;
  return (
    <div className="stage screen-enter">
      <TopNav />
      <div className="frame" style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div className="meta mb-l text-center op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            ce que le journal tient en ce moment
          </div>

          {loading && !latest ? (
            <div className="card text-center" style={{ padding: "var(--s-6) var(--s-5)", opacity: 0.6 }}>
              <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                le journal s'éveille…
              </div>
            </div>
          ) : latest ? (
            <>
              <div className="card" style={{ padding: "var(--s-6) var(--s-5)" }}>
                <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                  {latest.when}
                </div>
                <p className="h3-lecture" style={{ textWrap: "pretty" }}>
                  {latest.text}
                </p>
              </div>

              <button className="whisper mt-l" onClick={() => go("kairos", latest.id)}>
                un kairos t'attend pour cette question
              </button>
            </>
          ) : (
            <div className="card text-center" style={{ padding: "var(--s-6) var(--s-5)" }}>
              <div className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)" }}>
                ton journal est encore vide
              </div>
              <p className="seuil-italic" style={{ fontSize: 17, textWrap: "pretty" }}>
                dépose un premier kairos — un rêve, un signe, un frisson.
              </p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--s-4)", paddingTop: "var(--s-6)", paddingBottom: "var(--s-6)" }}>
          <button className="btn-deposer" onClick={() => go("capture")} aria-label="déposer">
            <svg viewBox="0 0 28 28">
              <path d="M4 10 Q14 22 24 10" />
              <line x1="14" y1="2" x2="14" y2="10" />
            </svg>
          </button>
          <div className="meta" style={{ letterSpacing: "0.15em", textTransform: "lowercase" }}>déposer</div>
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

// ── Capture (somatic gate → field → post) ───────────────────
const TYPE_CHIPS = [
  ["reve",          "rêve nocturne"],
  ["signe",         "signe diurne"],
  ["reverie",       "rêverie"],
  ["hypnagogie",    "hypnagogie"],
  ["synchronicite", "synchronicité"],
  ["frisson",       "frisson"],
  ["note",          "note de vie"],
];

const Capture = ({ go }) => {
  // 2026-04-26 — B+D refonte (Design §11.bis.6) :
  //   skip somatic gate par défaut J0-J30. Décide initial phase.
  //   - Si user a explicitement activé `dream:somatic-gate-enabled = "true"` → "gate"
  //   - Sinon → skip direct vers "field" + propose modal opt-in si J30+ et pas encore prompted
  const initialPhase = (() => {
    try {
      const explicit = localStorage.getItem("dream:somatic-gate-enabled");
      if (explicit === "true") return "gate";
      // Default = skip
      return "field";
    } catch { return "field"; }
  })();

  const [phase, setPhase] = useState(initialPhase); // gate | field | post | type
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdId, setCreatedId] = useState(null);
  const [selectedType, setSelectedType] = useState("reve");
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  // Modal proposition opt-in somatic gate (J30+)
  const [showSomaticOptIn, setShowSomaticOptIn] = useState(false);
  const taRef = useRef(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    if (phase === "field" && taRef.current) taRef.current.focus();
  }, [phase]);

  // Au mount, si on a sauté le gate ET qu'on est post-J30 ET qu'on n'a
  // jamais prompted, propose la modal d'opt-in (une seule fois).
  useEffect(() => {
    try {
      const explicit = localStorage.getItem("dream:somatic-gate-enabled");
      if (explicit !== null) return; // déjà décidé
      const prompted = localStorage.getItem("dream:somatic-gate-prompted");
      if (prompted) return;
      const isPost = (typeof window.isPostJ30 === "function")
        ? window.isPostJ30("dream:account-created", 30)
        : false;
      if (isPost) {
        setShowSomaticOptIn(true);
      }
    } catch {}
  }, []);

  // Choix opt-in : enable / refuse / postpone
  const acceptSomaticGate = () => {
    try {
      localStorage.setItem("dream:somatic-gate-enabled", "true");
      localStorage.setItem("dream:somatic-gate-prompted", String(Date.now()));
    } catch {}
    setShowSomaticOptIn(false);
    setPhase("gate");
  };
  const declineSomaticGate = () => {
    try {
      localStorage.setItem("dream:somatic-gate-enabled", "false");
      localStorage.setItem("dream:somatic-gate-prompted", String(Date.now()));
    } catch {}
    setShowSomaticOptIn(false);
  };

  // ── Voice recording (uses /api/transcribe) ──
  // 2026-04-25 — iOS Safari fallback : MediaRecorder n'aime pas audio/webm sur iOS,
  // il faut audio/mp4 ou audio/aac. On essaie les types par ordre de support.
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
    return ""; // browser default
  };

  const startRecording = async () => {
    try {
      if (typeof MediaRecorder === "undefined") {
        setSubmitError("L'enregistrement vocal n'est pas supporté sur ce navigateur. Essaie en mode texte.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = pickMimeType();
      const opts = mimeType ? { mimeType } : {};
      const mr = new MediaRecorder(stream, opts);
      const actualMime = mr.mimeType || mimeType || "audio/webm";
      chunksRef.current = [];
      mr.ondataavailable = (ev) => { if (ev.data.size > 0) chunksRef.current.push(ev.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: actualMime });
        setTranscribing(true);
        try {
          const result = await window.DreamAPI.transcribe(blob, actualMime);
          if (result?.text) {
            setText(prev => (prev ? prev + "\n\n" : "") + result.text);
          } else if (result?.error) {
            setSubmitError("Transcription : " + result.error);
          }
        } catch (e) {
          setSubmitError("Transcription échouée : " + e.message);
        } finally {
          setTranscribing(false);
        }
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setSubmitError("Impossible d'accéder au micro : " + e.message);
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    setRecording(false);
  };

  // ── Submit ── 2026-04-27 P1.4 : Optimistic UI
  // Navigate to "post" phase IMMEDIATELY, then push to API in background.
  // local kairos id `local-${ts}` flagged `_pending: true` insère localement.
  // Au retour API : remplace via window.DreamReplaceLocalKairos(localId, realKairos).
  // Erreur : OptimisticToast + retry.
  const submit = async () => {
    if (text.trim().length < 3) return;
    setSubmitError(null);

    const trimmed = text.trim();
    const localId = "local-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6);
    const localKairos = {
      id: localId,
      type: selectedType === "reve" ? "dream_night"
          : selectedType === "signe" ? "sidewalk_oracle"
          : selectedType === "reverie" ? "daydream_reverie"
          : selectedType === "hypnagogie" ? "hypnagogic"
          : selectedType === "synchronicite" ? "synchronicity"
          : selectedType === "frisson" ? "somatic_shiver"
          : selectedType === "note" ? "note_vie"
          : "dream_night",
      when: "à l'instant",
      text: trimmed,
      raw_text: trimmed,
      _pending: true,
      _localId: localId,
      created_at: new Date().toISOString(),
    };

    // Optimistic local insert + transition immédiate
    try {
      if (typeof window.DreamInsertLocalKairos === "function") {
        window.DreamInsertLocalKairos(localKairos);
      }
    } catch {}

    setCreatedId(localId);
    setPhase("post");

    // Wow1 : premier kairos déposé (idempotent via wowRegistry)
    try { window.wowRegistry?.fire?.("premier-kairos"); } catch {}

    // Track sync mutation pour <SyncStatus>
    const syncId = window.dreamSyncBegin ? window.dreamSyncBegin("createKairos") : null;
    setSubmitting(true);

    try {
      const result = await window.DreamAPI.createKairos({
        raw_text: trimmed,
        kairos_type: selectedType,
        capture_method: recording || transcribing ? "voice" : "text",
      });
      if (result?.kairos?.id) {
        // Remplace local par real kairos
        if (typeof window.DreamReplaceLocalKairos === "function") {
          window.DreamReplaceLocalKairos(localId, result.kairos);
        }
        setCreatedId(result.kairos.id);
      }
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId);
      // Refresh in background (server-truth)
      if (window.DreamRefreshEntries) setTimeout(() => window.DreamRefreshEntries(), 800);
    } catch (e) {
      // Le local kairos reste visible avec _pending → toast retry
      if (window.dreamSyncEnd) window.dreamSyncEnd(syncId, { error: e.message });
      setSubmitError("Le dépôt n'a pas atteint l'app, reviens dans un instant.");
      try { window.dreamShowToast?.({
        text: "le dépôt n'a pas atteint l'app, reviens dans un instant",
        tone: "error",
        duration: 5000,
      }); } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  // Update kairos_type after the fact (post-phase chips)
  // 2026-04-25 — backend whitelist now includes kairos_type → PATCH live
  const updateType = async (newType) => {
    setSelectedType(newType);
    if (createdId) {
      try {
        await window.DreamAPI.updateKairos(createdId, { kairos_type: newType });
      } catch (e) {
        console.warn("updateKairos type failed:", e.message);
      }
    }
  };

  if (phase === "gate") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
        <TopNav showBack onBack={() => go("home")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="stack" style={{ alignItems: "center", gap: "var(--s-6)" }}>
            <div className="breath" />
            <p className="seuil-italic text-center" style={{ maxWidth: 420 }}>
              Trois respirations. Sens tes pieds. Tu es là.
            </p>
            <button className="btn-ghost" onClick={() => setPhase("field")}>entrer</button>
            <button className="btn-text" onClick={() => setPhase("field")}>passer</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "field") {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-warm)" }}>
        <div className="nav">
          <button className="btn-text" onClick={() => go("home")} aria-label="fermer">
            × fermer
          </button>
          <div className="meta op-70" style={{ fontFamily: "var(--mono)" }}>auto · local</div>
        </div>
        <div className="frame" style={{ minHeight: "calc(100vh - 60px)", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, paddingTop: "var(--s-5)" }}>
            <textarea
              ref={taRef}
              className="capture-field"
              rows={14}
              placeholder={transcribing ? "transcription en cours…" : "Ce qui est venu…"}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting || transcribing}
            />
            {submitError && (
              <div className="meta mt-m" style={{ color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic" }}>
                {submitError}
              </div>
            )}
          </div>
          <div className="row" style={{ justifyContent: "space-between", paddingBottom: "var(--s-4)" }}>
            <div className="meta op-70">
              {recording ? "🔴 enregistrement…" : transcribing ? "transcription…" : `voix · ${text.length} caractères`}
            </div>
            <div className="row gap-s">
              <button className="btn-ghost" onClick={submit}
                disabled={text.trim().length < 3 || submitting || recording || transcribing}
                style={{ opacity: (text.trim().length < 3 || submitting || recording || transcribing) ? 0.4 : 1 }}>
                {submitting ? "dépôt…" : "garder"}
              </button>
              <button
                aria-label={recording ? "arrêter" : "voix"}
                className="btn-deposer"
                style={{
                  width: 48, height: 48,
                  background: recording ? "color-mix(in oklch, var(--ember-live) 30%, transparent)" : undefined,
                }}
                onClick={recording ? stopRecording : startRecording}
                disabled={submitting || transcribing}
              >
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                  <rect x="9" y="3" width="6" height="12" rx="3" />
                  <path d="M5 11 Q5 18 12 18 Q19 18 19 11" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 2026-04-26 — Modal opt-in somatic gate (Design §11.bis.6) */}
        {showSomaticOptIn && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 150,
            background: "color-mix(in oklch, var(--night-floor) 78%, transparent)",
            backdropFilter: "blur(8px)",
            display: "grid", placeItems: "center", padding: "var(--s-4)",
          }}>
            <div style={{
              background: "var(--night-warm)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-mid))",
              padding: "var(--s-5)",
              maxWidth: 460, width: "100%",
            }}>
              <div className="meta mb-m" style={{
                fontFamily: "var(--mono)", fontSize: 10.5,
                letterSpacing: "0.08em", color: "var(--silk-gold)",
              }}>
                UN GESTE QU'ON TE PROPOSE
              </div>
              <p style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 18, lineHeight: 1.55,
                color: "var(--bone)",
                margin: "0 0 var(--s-4) 0", textWrap: "pretty",
              }}>
                Veux-tu un seuil de respiration avant chaque dépôt&nbsp;?
                Trois respirations, une trentaine de secondes.
              </p>
              <p className="meta op-70 mb-m" style={{
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 13, lineHeight: 1.6, textWrap: "pretty",
              }}>
                Tu peux changer d'avis dans les paramètres.
              </p>
              <div className="row" style={{
                justifyContent: "space-between", marginTop: "var(--s-4)",
                gap: 12, flexWrap: "wrap",
              }}>
                <button className="btn-text" onClick={declineSomaticGate}
                  style={{ fontSize: 14 }}>
                  non, garde rapide
                </button>
                <button className="btn-ghost" onClick={acceptSomaticGate}>
                  oui, ralentir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (phase === "post") {
    return <CapturePostSequenced
      go={go}
      createdId={createdId}
      selectedType={selectedType}
      text={text}
      updateType={updateType} />;
  }
};

// ── Capture Phase POST séquencée ────────────────────────────
// 2026-04-27 — Sprint P1.4 (Design §11.bis.19)
// Refonte cognitive : 4 vagues séquencées au lieu de tout d'un coup.
//
// t = 0      : halo ember radial subtil fade-in 600ms
// t = 600ms  : texte poétique italic 18px fade-in
// t = 1400ms : 1 ACTION PRINCIPALE silk-gold "voir mon kairos →"
// t = 2200ms : 2 actions secondaires text-link sobre
// t = 3000ms : "▼ ajuster le type" expandable très discret
//
// Auto-navigate vers KairosDetail si user inactif 8s après wave 4.
//
// Préserve TOUTE la logique d'origine : update type via PATCH live,
// goJournalLinked flag, navigation vers home/kairos.
function CapturePostSequenced({ go, createdId, selectedType, text, updateType }) {
  const [wave, setWave] = useState(0); // 0=halo only, 1=texte, 2=cta, 3=secondaires, 4=expand
  const [showTypeChips, setShowTypeChips] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const autoNavRef = useRef(null);
  // 2026-04-29 — SpiraleWowOverlay (Yeshua) : 1.9s sur premier kairos OU à
  // chaque dépôt si user a explicitement reset wow registry. On l'affiche
  // en parallèle du halo (zIndex 5).
  const [showSpiraleWow, setShowSpiraleWow] = useState(false);

  useEffect(() => {
    // SpiraleWow : déclenche tout de suite si premier kairos OU si pas
    // encore vue dans cette session. wowRegistry.fire() retourne true si
    // c'est le premier kairos jamais (idempotent persistant). Mais on
    // veut aussi un wow doux à chaque dépôt important — V1 simple :
    // affiche systématiquement 1.9s. Au pire c'est sobre et discret.
    setShowSpiraleWow(true);
  }, []);

  useEffect(() => {
    // 4 vagues séquencées
    const t1 = setTimeout(() => setWave(1), 600);
    const t2 = setTimeout(() => setWave(2), 1400);
    const t3 = setTimeout(() => setWave(3), 2200);
    const t4 = setTimeout(() => setWave(4), 3000);

    // Auto-navigate après 8s d'inactivité (post wave 4)
    const tAuto = setTimeout(() => {
      if (!interacted && createdId) {
        if (autoNavRef.current) return;
        autoNavRef.current = true;
        go("kairos", createdId);
      }
    }, 11000); // 3000ms wave 4 + 8000ms attente

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      clearTimeout(tAuto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toute interaction utilisateur = annule l'auto-navigate
  const onUserInteract = () => { setInteracted(true); };

  const goJournalLinked = () => {
    onUserInteract();
    try {
      window.__dreamJournalLinkedHint = {
        linked_kairos_id: createdId,
        source_text: text.trim(),
        source_type: selectedType,
        createdAt: Date.now(),
      };
    } catch {}
    go("home");
  };

  const goSeeKairos = () => {
    onUserInteract();
    if (createdId) go("kairos", createdId);
  };

  const goLetSleep = () => {
    onUserInteract();
    go("home");
  };

  // Animation helper : style fade+translate-up pour wave entrance
  const waveStyle = (active, delay = 0) => ({
    opacity: active ? 1 : 0,
    transform: active ? "translateY(0)" : "translateY(8px)",
    transition: `opacity 600ms cubic-bezier(0.45,0,0.15,1) ${delay}ms, transform 600ms cubic-bezier(0.45,0,0.15,1) ${delay}ms`,
    pointerEvents: active ? "auto" : "none",
  });

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-warm)", position: "relative", overflow: "hidden" }}>
      {/* 2026-04-29 — Surface silk en background (Yeshua, opacity 0.5) +
          HaloRespire silk derrière le texte central. Surface ne s'applique
          qu'à un container avec position relative — on l'utilise via Tag
          absolute behind. */}
      {window.Surface && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, opacity: 0.5, zIndex: 0,
          pointerEvents: "none",
        }}>
          <window.Surface matter="silk" motion={true}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </div>
      )}

      <TopNav showBack onBack={() => { onUserInteract(); go("home"); }} label="" />

      {/* Wave 0 — Halo ember radial, fade-in 600ms (animation CSS via opacity transition) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 38%, color-mix(in oklch, var(--ember-live) 14%, transparent), transparent 60%)",
        opacity: wave >= 0 ? 0.7 : 0,
        transition: "opacity 600ms cubic-bezier(0.45,0,0.15,1)",
        zIndex: 0,
      }} />

      {/* 2026-04-29 — HaloRespire silk derrière le texte central (zIndex 1) */}
      {window.HaloRespire && (
        <div aria-hidden="true" style={{
          position: "absolute", top: "32%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(380px, 80vw)", height: "min(380px, 80vw)",
          opacity: wave >= 0 ? 0.6 : 0,
          transition: "opacity 800ms cubic-bezier(0.45,0,0.15,1)",
          pointerEvents: "none", zIndex: 0,
        }}>
          <window.HaloRespire kind="silk" />
        </div>
      )}

      {/* 2026-04-29 — SpiraleWowOverlay : trace de spirale qui se dessine
          1.9s sur dépôt. Auto-dismiss via onDone. zIndex 5 dans .spirale-wow. */}
      {window.SpiraleWowOverlay && (
        <window.SpiraleWowOverlay show={showSpiraleWow} onDone={() => setShowSpiraleWow(false)} />
      )}

      <div className="frame center" style={{ minHeight: "calc(100vh - 60px)", position: "relative", zIndex: 2 }}>
        <div className="stack text-center gap-m" style={{ alignItems: "center", maxWidth: 480 }}
          onClick={onUserInteract} onTouchStart={onUserInteract}>

          {/* Wave 1 — Texte poétique italic 18px (apparait t=600ms) */}
          <p style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 18,
            lineHeight: 1.6, color: "var(--bone)", textAlign: "center",
            textWrap: "pretty", maxWidth: 420,
            ...waveStyle(wave >= 1),
          }}>
            Le kairos est déposé.<br />
            <span style={{ color: "var(--ash-light)", opacity: 0.85 }}>
              Il dort 24 h avant que les échos ne murmurent.
            </span>
          </p>

          {/* Wave 2 — 1 ACTION PRINCIPALE silk-gold (apparait t=1400ms) */}
          <div style={{
            width: "100%", maxWidth: 360, marginTop: "var(--s-5)",
            ...waveStyle(wave >= 2),
          }}>
            {createdId && (
              <button onClick={goSeeKairos}
                style={{
                  width: "100%",
                  background: "color-mix(in oklch, var(--silk-gold) 14%, transparent)",
                  border: "1px solid var(--silk-gold)",
                  color: "var(--silk-gold)",
                  fontFamily: "var(--serif)", fontStyle: "italic",
                  fontSize: 16, lineHeight: 1.4,
                  padding: "12px 24px",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  transition: "all 280ms cubic-bezier(0.45,0,0.55,1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 22%, transparent)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "color-mix(in oklch, var(--silk-gold) 14%, transparent)";
                }}>
                voir mon kairos →
              </button>
            )}
          </div>

          {/* Wave 3 — 2 actions secondaires text-link sobre (apparait t=2200ms) */}
          <div className="stack gap-s" style={{
            alignItems: "center", width: "100%", maxWidth: 360,
            marginTop: "var(--s-3)",
            ...waveStyle(wave >= 3),
          }}>
            <button onClick={goJournalLinked}
              style={{
                background: "transparent", border: "none",
                color: "var(--ash-light)",
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 14, cursor: "pointer",
                padding: "6px 12px",
                letterSpacing: "0.01em",
                opacity: 0.85,
                transition: "opacity 280ms ease, color 280ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "var(--bone)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.85; e.currentTarget.style.color = "var(--ash-light)"; }}>
              · déposer une note de Journal de Vie liée
            </button>
            <button onClick={goLetSleep}
              style={{
                background: "transparent", border: "none",
                color: "var(--ash-light)",
                fontFamily: "var(--serif)", fontStyle: "italic",
                fontSize: 14, cursor: "pointer",
                padding: "6px 12px",
                letterSpacing: "0.01em",
                opacity: 0.7,
                transition: "opacity 280ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.7; }}>
              · laisser dormir →
            </button>
          </div>

          {/* Wave 4 — Expandable "ajuster le type" très discret (apparait t=3000ms) */}
          <div style={{
            marginTop: "var(--s-5)", width: "100%", maxWidth: 360,
            ...waveStyle(wave >= 4),
          }}>
            <button onClick={() => { onUserInteract(); setShowTypeChips(s => !s); }}
              style={{
                background: "transparent", border: "none",
                color: "var(--ash-light)",
                fontFamily: "var(--mono)", fontSize: 10.5,
                letterSpacing: "0.08em", textTransform: "uppercase",
                cursor: "pointer", padding: "4px 8px",
                opacity: 0.5,
                transition: "opacity 280ms ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = 0.85; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = 0.5; }}>
              {showTypeChips ? "▲ replier" : "▼ ajuster le type"}
            </button>

            {showTypeChips && (
              <div className="dream-skeleton-fade-in" style={{
                marginTop: "var(--s-3)",
                padding: "var(--s-3) 0",
              }}>
                <div className="row gap-s" style={{ flexWrap: "wrap", justifyContent: "center" }}>
                  {TYPE_CHIPS.map(([k, l]) => (
                    <button key={k}
                      className={"chip " + (selectedType === k ? "active" : "")}
                      onClick={() => { onUserInteract(); updateType(k); }}
                      style={selectedType === k ? {
                        borderColor: "var(--silk-gold)",
                        color: "var(--silk-gold)",
                        background: "color-mix(in oklch, var(--silk-gold) 8%, transparent)",
                      } : undefined}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Journal de Vie ──────────────────────────────────────────
const Journal = ({ go, entries, loading }) => {
  const [filter, setFilter] = useState("all");
  const safeEntries = entries || [];
  const shown = filter === "all" ? safeEntries : safeEntries.filter(e => e.type === filter);
  return (
    <div className="stage screen-enter">
      <TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame">
        <div className="row mb-m" style={{ justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 className="h1-seuil">Journal</h1>
            <div className="mt-s"><SeasonalCompass /></div>
          </div>
          <button className="btn-text" aria-label="filtrer" style={{ fontSize: 18 }}>⎙</button>
        </div>

        <div className="row gap-s mb-l" style={{ flexWrap: "wrap" }}>
          {[
            ["all", "tout"],
            ["dream_night", "rêves"],
            ["sidewalk_oracle", "signes"],
            ["daydream_reverie", "rêveries"],
            ["synchronicity", "synchronicités"],
            ["note_vie", "notes de vie"],
          ].map(([k, l]) => (
            <button key={k} className={"chip" + (filter === k ? " active" : "")} onClick={() => setFilter(k)}>{l}</button>
          ))}
        </div>

        {loading && shown.length === 0 ? (
          <div className="text-center" style={{ padding: "var(--s-7)", opacity: 0.6 }}>
            <div className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
              le journal s'éveille…
            </div>
          </div>
        ) : shown.length === 0 ? (
          <div className="card text-center" style={{ padding: "var(--s-6)" }}>
            <p className="seuil-italic" style={{ fontSize: 17, textWrap: "pretty" }}>
              {filter === "all"
                ? "ton journal est encore vide. dépose un premier kairos."
                : "aucun kairos de ce type pour l'instant."}
            </p>
          </div>
        ) : (
          <div className="stack" style={{ gap: "var(--s-5)" }}>
            {shown.map((e, i) => (
              <div key={e.id}>
                {i === 3 && filter === "all" && (
                  <div className="divider-moon">⟶ lune décroissante de mars</div>
                )}
                <article
                  className={"card" + (e.bigDream ? " card-bigdream" : "")}
                  onClick={() => go("kairos", e.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="row mb-s gap-s" style={{ color: "var(--ash-light)" }}>
                    <TypeGlyph type={e.type} />
                    <span className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>{e.when}</span>
                    <span className="meta op-50">·</span>
                    <span className="meta">{typeLabel(e.type)}</span>
                    {e.numinous && (
                      <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "var(--ember-live)", opacity: 0.7 }} />
                    )}
                  </div>
                  <p className="body" style={{
                    fontFamily: "var(--serif)", fontSize: 18, lineHeight: 1.55,
                    display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                    textWrap: "pretty"
                  }}>
                    {e.text}
                  </p>
                </article>
              </div>
            ))}
          </div>
        )}

        <button className="btn-deposer" style={{ position: "fixed", bottom: 32, right: 32, width: 56, height: 56 }}
          onClick={() => go("capture")} aria-label="déposer">
          <svg viewBox="0 0 28 28" style={{ width: 20, height: 20 }}>
            <path d="M4 10 Q14 22 24 10" />
            <line x1="14" y1="2" x2="14" y2="10" />
          </svg>
        </button>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

Object.assign(window, {
  Home, Capture, Journal, TopNav, TypeGlyph, typeLabel, seedEntries, SeasonalCompass,
  // Sprint P1.4 (2026-04-27) — Optimistic Capture phase post séquencée
  CapturePostSequenced,
});
