/* global React */
const { useState: uMS, useEffect: uME, useMemo: uMM } = React;

// ── Onboarding 30 premiers jours (P-Zéro) ───────────────────
// Gradient d'ouverture : 5 portes, puis 25 jours en compagnonnage silencieux

const onboardingSteps = [
  {
    id: "p-zero",
    kind: "accueil",
    title: "bienvenue au seuil",
    body: "Ici, nous tenons les rêves, les synchronicités, les frissons. Rien ne t'est demandé tout de suite. Ce que tu déposes reste à toi.",
    cta: "entrer",
  },
  {
    id: "nom",
    kind: "champ",
    title: "comment veux-tu être nommée ici ?",
    body: "ton prénom, un autre nom, une initiale. tu peux changer plus tard.",
    field: "nom",
    cta: "continuer",
  },
  {
    id: "pourquoi",
    kind: "choix-multi",
    title: "qu'est-ce qui t'amène ?",
    body: "plusieurs réponses possibles. aucune n'est évaluée.",
    choices: [
      "mes rêves reviennent, j'aimerais leur faire de la place",
      "je traverse une transition et j'écoute ce qui me regarde",
      "je cherche une pratique contemplative qui ne soit pas de la productivité",
      "mon corps dit des choses que ma tête ne décode pas",
      "j'ai lu Robert Moss / Marie-Louise von Franz / Michael Meade",
      "quelqu'un m'a parlé de cette app et ça a fait écho",
      "autre — je ne sais pas encore",
    ],
    cta: "continuer",
  },
  {
    id: "rythme",
    kind: "choix",
    title: "à quel rythme veux-tu que nous t'accompagnions ?",
    body: "ce n'est pas une notification, c'est un tempo. tu peux l'éteindre à tout moment.",
    choices: [
      { k: "aucune", l: "aucun rappel", d: "je viens quand je viens" },
      { k: "hebdo", l: "une fois par semaine", d: "un whisper le dimanche soir" },
      { k: "lune", l: "aux phases de lune", d: "quatre fois par mois, au rythme du ciel" },
    ],
    cta: "continuer",
  },
  {
    id: "premiere",
    kind: "invitation",
    title: "veux-tu déposer un premier kairos ?",
    body: "un rêve de cette nuit, un frisson d'hier, une synchronicité de la semaine. tu peux aussi ne rien déposer — juste entrer, et regarder.",
    cta: "déposer",
    alt: "entrer sans déposer",
  },
];

const OnboardingScreen = ({ go }) => {
  const [i, setI] = uMS(0);
  const [answers, setAnswers] = uMS({});
  const step = onboardingSteps[i];

  return (
    <div className="p-zero-stage screen-enter">
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "var(--s-5) var(--s-4) var(--s-6)" }}>
        {/* progress dots */}
        <div className="row gap-s mb-xl" style={{ justifyContent: "center" }}>
          {onboardingSteps.map((_, idx) => (
            <span key={idx}
              className={"p-zero-dot " + (idx === i ? "active" : idx < i ? "done" : "")} />
          ))}
        </div>

        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textAlign: "center" }}>
          {step.kind === "accueil" && "p-zéro · premier souffle"}
          {step.kind !== "accueil" && `${i + 1} / ${onboardingSteps.length}`}
        </div>

        <h1 className="h1-seuil mb-l text-center" style={{ maxWidth: 460, margin: "0 auto var(--s-5)" }}>
          {step.title}
        </h1>

        <p className="seuil-italic mb-xl text-center" style={{ color: "var(--ash-light)", textWrap: "pretty", maxWidth: 460, margin: "0 auto var(--s-6)" }}>
          {step.body}
        </p>

        {step.kind === "champ" && (
          <input className="field-input mb-l"
            placeholder={step.field}
            value={answers[step.id] || ""}
            onChange={(e) => setAnswers(a => ({ ...a, [step.id]: e.target.value }))} />
        )}

        {step.kind === "choix-multi" && (
          <div className="stack gap-s mb-l">
            {step.choices.map((c, idx) => {
              const sel = (answers[step.id] || []).includes(idx);
              return (
                <button key={idx}
                  onClick={() => setAnswers(a => {
                    const cur = a[step.id] || [];
                    return { ...a, [step.id]: sel ? cur.filter(x => x !== idx) : [...cur, idx] };
                  })}
                  style={{
                    textAlign: "left", padding: "10px 14px",
                    border: "1px solid " + (sel ? "var(--silk-gold)" : "var(--ash-deep)"),
                    background: sel ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent",
                    color: sel ? "var(--silk-gold)" : "var(--bone)",
                    fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 14.5,
                  }}>
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {step.kind === "choix" && (
          <div className="stack gap-m mb-l">
            {step.choices.map(c => (
              <button key={c.k}
                onClick={() => setAnswers(a => ({ ...a, [step.id]: c.k }))}
                style={{
                  textAlign: "left", padding: "var(--s-4)",
                  border: "1px solid " + (answers[step.id] === c.k ? "var(--silk-gold)" : "var(--ash-deep)"),
                  background: answers[step.id] === c.k ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent",
                }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 18, color: "var(--bone)", marginBottom: 4 }}>
                  {c.l}
                </div>
                <div className="meta" style={{ color: "var(--ash-light)" }}>{c.d}</div>
              </button>
            ))}
          </div>
        )}

        {step.kind === "invitation" && (
          <div className="row gap-m mb-l" style={{ justifyContent: "center" }}>
            <button className="btn-ghost" onClick={() => go("capture")}>{step.cta}</button>
            {step.alt && (
              <button className="btn-text" onClick={() => go("home")}>{step.alt}</button>
            )}
          </div>
        )}

        {step.kind !== "invitation" && (
          <div className="row" style={{ justifyContent: i === 0 ? "flex-end" : "space-between" }}>
            {i > 0 && <button className="btn-text" onClick={() => setI(i - 1)}>← retour</button>}
            <button className="btn-ghost"
              disabled={step.kind === "champ" && !answers[step.id]?.trim?.()}
              onClick={() => setI(i + 1)}>
              {step.cta}
            </button>
          </div>
        )}

        {i === 0 && (
          <div className="meta op-70 mt-xl text-center" style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 440, margin: "var(--s-6) auto 0" }}>
            Les 30 premiers jours sont un gradient d'ouverture — des lectures, des invitations douces, puis le silence. Jamais de leçons.
          </div>
        )}
      </div>
    </div>
  );
};

// ── Paramètres — Privacy ────────────────────────────────────
const PrivacyScreen = ({ go }) => {
  const [s, setS] = uMS(() => ({
    localOnly: true,
    kairosNumerous: false,        // offre au kairos proposée si numinous
    cercleEchoes: true,            // voir résonances de nos rêves avec d'autres cercles
    animaMundi: false,             // contribuer à la voûte
    analyticsBase: false,
    crashReports: true,
    // 2026-04-26 (B+D Design §11.bis.6 + §11.bis.7) : rituels somatiques
    somaticGate: (() => { try { return localStorage.getItem("dream:somatic-gate-enabled") === "true"; } catch { return false; } })(),
    feltShiftExtended: (() => { try { return localStorage.getItem("dream:felt-shift-mode") === "6-zones"; } catch { return false; } })(),
  }));
  const set = (k, v) => setS(o => ({ ...o, [k]: v }));

  // Persister les toggles rituels dans localStorage
  const toggleSomaticGate = () => {
    const next = !s.somaticGate;
    set("somaticGate", next);
    try {
      localStorage.setItem("dream:somatic-gate-enabled", next ? "true" : "false");
      localStorage.setItem("dream:somatic-gate-prompted", String(Date.now()));
    } catch {}
  };
  const toggleFeltShiftExtended = () => {
    const next = !s.feltShiftExtended;
    set("feltShiftExtended", next);
    try {
      localStorage.setItem("dream:felt-shift-mode", next ? "6-zones" : "default");
      localStorage.setItem("dream:felt-shift-prompted", String(Date.now()));
    } catch {}
  };

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame" style={{ maxWidth: 640 }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          paramètres · privacy
        </div>
        <h1 className="h1-seuil mb-m">ce qui sort, ce qui reste</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty", maxWidth: 580 }}>
          Par défaut, rien ne quitte ton téléphone. Tout ce qui s'ouvre vers les autres est un geste que tu actives, jamais l'inverse.
        </p>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            GESTES INDIVIDUELS
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="stockage local uniquement"
              desc="tes kairos restent sur ton appareil. synchronisation désactivée."
              on={s.localOnly}
              toggle={() => set("localOnly", !s.localOnly)}
            />
          </div>
        </div>

        {/* 2026-04-26 — Rituels du dépôt (B+D refonte Design §11.bis.6 + §11.bis.7) */}
        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            RITUELS DU DÉPÔT
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="seuil de respiration avant Capture"
              desc="trois respirations, environ 30 secondes, avant chaque dépôt. par défaut désactivé pendant tes premiers jours."
              on={s.somaticGate}
              toggle={toggleSomaticGate}
            />
            <SettingRow
              title="felt-shift étendu (6 zones)"
              desc="déverrouille gorge / poitrine / ventre / nuque / ailleurs / aucune part. par défaut, 3 zones simples."
              on={s.feltShiftExtended}
              toggle={toggleFeltShiftExtended}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            GESTES AU KAIROS
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="proposer l'offre anima mundi si numinous"
              desc="quand la narratrice reconnaît un rêve numinous, elle te propose de l'offrir à la voûte commune. jamais automatique."
              on={s.kairosNumerous}
              toggle={() => set("kairosNumerous", !s.kairosNumerous)}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            CERCLE
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="voir les échos du cercle"
              desc="si un rêve que tu as partagé dans un cercle résonne avec les rêves d'autres cercles, tu en es informée."
              on={s.cercleEchoes}
              toggle={() => set("cercleEchoes", !s.cercleEchoes)}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            ANIMA MUNDI — VOÛTE GLOBALE
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="contribuer à la voûte"
              desc="rejoint le corpus anonyme mondial. jamais de nom, jamais de ville, jamais de lien vers toi. uniquement ce que tu offres explicitement, kairos par kairos."
              on={s.animaMundi}
              toggle={() => set("animaMundi", !s.animaMundi)}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            TECHNIQUE
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="analytics d'usage anonymisés"
              desc="jamais sur le contenu. uniquement : fréquence d'ouverture, écrans consultés."
              on={s.analyticsBase}
              toggle={() => set("analyticsBase", !s.analyticsBase)}
            />
            <SettingRow
              title="rapports de crash"
              desc="uniquement si ça plante. aucune donnée de rêve n'est incluse."
              on={s.crashReports}
              toggle={() => set("crashReports", !s.crashReports)}
            />
          </div>
        </div>

        <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty", maxWidth: 580 }}>
          Tu peux exporter ou effacer toutes tes données à tout moment. Aucune condition. Aucune question.
        </p>
        <div className="row gap-m mt-m">
          <button className="btn-ghost">exporter mes données</button>
          <button className="btn-text" style={{ color: "var(--ember-live)" }}>effacer tout</button>
        </div>

        {/* 2026-04-26 — Sous-app Lucid Dreaming (opt-in strict, Bible §17) */}
        <div className="card mt-l" style={{ marginTop: 24, borderColor: "color-mix(in oklch, var(--silk-gold) 30%, var(--ash-deep))" }}>
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            MODE PRATIQUE LUCIDE
          </div>
          <p className="body mb-m" style={{ fontSize: 13, color: "var(--ash-light)" }}>
            Une couche technique dédiée aux praticiens du rêve lucide : reality checks, dream signs, WBTB,
            scoring de lucidité par rêve, export Obsidian. Vocabulaire scientifique strict (LaBerge, Waggoner).
            Désactivé par défaut.
          </p>
          <button className="btn-ghost" onClick={() => go("lucid-profile")}>
            ouvrir le mode pratique lucide →
          </button>
        </div>

        {/* 2026-04-26 — Sanctuaire des cauchemars & deuil (Bible §17.3) */}
        <div className="card mt-l" style={{ marginTop: 16, borderColor: "color-mix(in oklch, var(--clay-earth) 25%, var(--ash-deep))" }}>
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            SANCTUAIRE DES CAUCHEMARS & DEUIL
          </div>
          <p className="body mb-m" style={{ fontSize: 13, color: "var(--ash-light)", textWrap: "pretty" }}>
            Espace dédié pour les rêves lourds — cauchemars récurrents, rêves de deuil, traversées difficiles.
            Trauma-safe complet. Mode "freeze 30j" pour mettre en silence les propositions Forêt/échos/portrait.
            Numéros d'urgence par pays + annuaire praticiens trauma-curés (SE, IFS, EMDR, Sensorimotor, Jungien).
          </p>
          <button className="btn-ghost" onClick={() => go("nightmares")}>
            ouvrir le sanctuaire →
          </button>
        </div>
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

// ── Paramètres — Notifications ──────────────────────────────
const NotifsScreen = ({ go }) => {
  const [n, setN] = uMS({
    whisper: false,
    lunaire: false,
    cercleMoi: false,
    cercleAutres: false,
    annales: false,
    aha: false,
    offre: false,
  });
  const set = (k) => setN(o => ({ ...o, [k]: !o[k] }));
  const any = Object.values(n).some(Boolean);

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame" style={{ maxWidth: 640 }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          paramètres · notifications
        </div>
        <h1 className="h1-seuil mb-m">comment voudrais-tu qu'on te touche ?</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty", maxWidth: 580 }}>
          Par défaut, nous ne te notifions jamais. Tu choisis ce qui mérite une interruption — et ce qui peut attendre que tu reviennes.
        </p>

        <div className="card mb-l" style={{ padding: "var(--s-4)", background: !any ? "color-mix(in oklch, var(--silk-gold) 5%, transparent)" : "transparent", borderColor: !any ? "var(--silk-gold)" : "var(--ash-deep)" }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: !any ? "var(--silk-gold)" : "var(--ash-light)" }}>
            {!any ? "silence complet — état par défaut" : `${Object.values(n).filter(Boolean).length} notifications activées`}
          </div>
          <p className="body" style={{ textWrap: "pretty", fontSize: 14 }}>
            {!any
              ? "l'app ne t'envoie rien. tu y viens quand quelque chose t'appelle. c'est notre posture préférée."
              : "tu peux tout désactiver d'un geste."}
          </p>
          {any && (
            <button className="btn-text mt-s" onClick={() => setN({ whisper: false, lunaire: false, cercleMoi: false, cercleAutres: false, annales: false, aha: false, offre: false })}>
              tout désactiver
            </button>
          )}
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            RYTHMES
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="whisper hebdomadaire"
              desc="dimanche soir, une phrase de la narratrice en regard de ta semaine. jamais un rappel à 'capturer plus'."
              on={n.whisper}
              toggle={() => set("whisper")}
            />
            <SettingRow
              title="phases de lune"
              desc="quatre touches par mois : nouvelle, premier quartier, pleine, dernier quartier. une image, pas une alerte."
              on={n.lunaire}
              toggle={() => set("lunaire")}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            CERCLE
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="quelqu'un a tenu mon rêve"
              desc="quand une personne du cercle a marqué 'tenir' sur un rêve que tu as partagé."
              on={n.cercleMoi}
              toggle={() => set("cercleMoi")}
            />
            <SettingRow
              title="un rêve a été déposé dans le cercle"
              desc="jamais son contenu en push — seulement : 'quelqu'un vient de déposer'. tu ouvres quand tu veux."
              on={n.cercleAutres}
              toggle={() => set("cercleAutres")}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            ANIMA MUNDI
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="un rêve que j'ai offert rencontre d'autres images"
              desc="quand ton rêve voyage et résonne avec ceux d'autres régions."
              on={n.annales}
              toggle={() => set("annales")}
            />
          </div>
        </div>

        <div className="card mb-l">
          <div className="meta mb-m" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em", color: "var(--ash-light)" }}>
            RARES
          </div>
          <div className="stack" style={{ gap: 0 }}>
            <SettingRow
              title="AHA — insight reconnu"
              desc="quand la narratrice détecte qu'un kairos vient de faire bouger quelque chose en toi. une invitation douce à écrire — pas un badge."
              on={n.aha}
              toggle={() => set("aha")}
            />
            <SettingRow
              title="offre au kairos (numinous)"
              desc="quand un rêve porte un numinous, te proposer de l'offrir à anima mundi. désactivable sans perte."
              on={n.offre}
              toggle={() => set("offre")}
            />
          </div>
        </div>

        <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty", maxWidth: 560 }}>
          Aucune notification n'utilisera jamais ton rêve ou son contenu en texte visible d'aperçu. Le verrouillage écran est une peau.
        </p>
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

// ── Paramètres — Abonnement ─────────────────────────────────
const tiers = [
  {
    k: "graine",
    name: "graine",
    price: "gratuit",
    per: "",
    tagline: "pour poser un premier kairos. sans fin.",
    features: [
      "journal local illimité",
      "capture, somatic gate, détail kairos",
      "portrait (figures émergentes)",
      "7 contes-miroirs par saison",
      "conte-miroir + oracle du corps en lecture",
    ],
  },
  {
    k: "pratique",
    name: "pratique",
    price: "6€",
    per: "/ mois",
    tagline: "pour qui revient chaque semaine.",
    featured: true,
    features: [
      "tout ce qui est dans graine",
      "narratrice — conversations illimitées",
      "cercles (créer + rejoindre, jusqu'à 3)",
      "réentrée onirique, lightning dreamwork",
      "contes-miroirs illimités",
      "synchronisation entre appareils (chiffrée)",
      "export illimité (markdown, pdf)",
    ],
  },
  {
    k: "fondateur",
    name: "fondateur",
    price: "25–40€",
    per: "/ mois · choisi",
    tagline: "pour soutenir la construction lente.",
    features: [
      "tout ce qui est dans pratique",
      "cercles illimités + tenue de cercle facilité",
      "accès aux annales des big dreams",
      "lectures approfondies par une praticienne (1 / saison)",
      "voix précoce sur les évolutions de l'app",
      "nom gravé (si tu veux) dans les fondations",
    ],
  },
];

const AbonnementScreen = ({ go }) => {
  const [current] = uMS("pratique");
  const [community, setCommunity] = uMS(false);

  return (
    <div className="stage screen-enter">
      <window.TopNav showBack onBack={() => go("home")} label="" />
      <div className="frame" style={{ maxWidth: 900 }}>
        <div className="meta mb-s" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          paramètres · abonnement
        </div>
        <h1 className="h1-seuil mb-m">trois façons de tenir cet espace</h1>
        <p className="seuil-italic mb-l" style={{ color: "var(--ash-light)", textWrap: "pretty", maxWidth: 620 }}>
          Nous n'avons pas de publicité, ni de revente, ni d'investisseurs qui pèsent. Ce que tu paies tient cet endroit debout — et tient, aussi, l'accès gratuit pour qui n'a pas les moyens.
        </p>

        <div className="stack gap-l" style={{ flexDirection: "column" }}>
          <div className="row gap-l" style={{ flexWrap: "wrap", alignItems: "stretch" }}>
            {tiers.map(t => (
              <div key={t.k}
                className={"tier-card " + (t.featured ? "featured" : "") + (t.k === current ? "" : "")}
                style={{ flex: "1 1 260px", minWidth: 260 }}>
                <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.1em" }}>
                  {t.name.toUpperCase()}
                </div>
                <div className="tier-price mb-s">
                  {t.price}<span className="per">{t.per}</span>
                </div>
                <p className="meta mb-m" style={{ fontFamily: "var(--serif)", fontStyle: "italic", color: "var(--ash-light)", textWrap: "pretty" }}>
                  {t.tagline}
                </p>
                <div className="stack">
                  {t.features.map((f, i) => (
                    <div key={i} className="tier-feature">
                      <span className="mark" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button className={"btn-ghost mt-l"} disabled={t.k === current}
                  style={{ width: "100%", borderColor: t.k === current ? "var(--silk-gold)" : undefined, color: t.k === current ? "var(--silk-gold)" : undefined }}>
                  {t.k === current ? "ton rythme actuel" : t.k === "graine" ? "revenir à graine" : "passer à " + t.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="divider-moon">variante communauté</div>

        <div className="card mb-l">
          <div className="row mb-m" style={{ justifyContent: "space-between", flexWrap: "wrap", gap: "var(--s-3)" }}>
            <div>
              <div className="h4-repere mb-s">pratique — gratuit, par demande</div>
              <p className="body op-70" style={{ maxWidth: 560, textWrap: "pretty" }}>
                Si 6€/mois est un obstacle — étudiantes, précarité, soignantes en fin de mois, qui que tu sois — écris-nous une phrase. Pas de justificatif, pas de dossier. Nous t'offrons pratique pour six lunes, renouvelables.
              </p>
            </div>
            <div className="row gap-s" style={{ alignItems: "center" }}>
              <span className={"toggle " + (community ? "on" : "")} onClick={() => setCommunity(!community)} />
              <span className="meta" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
                {community ? "demande envoyée" : "demander"}
              </span>
            </div>
          </div>
          <p className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic", textWrap: "pretty" }}>
            Les tiers fondateur soutiennent directement ces accès gratuits. 1 fondateur finance environ 3 communauté.
          </p>
        </div>

        <div className="card" style={{ borderColor: "var(--obsidian)" }}>
          <div className="meta mb-s" style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: "0.08em" }}>
            PROMESSES
          </div>
          <div className="stack gap-s">
            <PromiseLine text="annulable à tout moment, sans question, en deux taps." />
            <PromiseLine text="aucune fonctionnalité essentielle ne déménagera jamais de graine vers pratique rétroactivement." />
            <PromiseLine text="si tu paies pratique ou fondateur et que tu perds ton emploi, écris — on te bascule en communauté sans poser de question." />
            <PromiseLine text="les prix ne bougent pas pour qui est déjà abonné. jamais." />
          </div>
        </div>
      </div>
      <window.FeedbackFloat />
    </div>
  );
};

const PromiseLine = ({ text }) => (
  <div className="row gap-s" style={{ alignItems: "flex-start" }}>
    <span style={{ flex: "0 0 4px", width: 4, height: 4, borderRadius: 2, background: "var(--silk-gold)", marginTop: 9 }} />
    <span className="body" style={{ textWrap: "pretty", fontSize: 14 }}>{text}</span>
  </div>
);

const SettingRow = ({ title, desc, on, toggle }) => (
  <div className="setting-row">
    <div className="label">
      <div className="title">{title}</div>
      <div className="desc" style={{ textWrap: "pretty" }}>{desc}</div>
    </div>
    <span className={"toggle " + (on ? "on" : "")} onClick={toggle} />
  </div>
);

Object.assign(window, {
  OnboardingScreen, PrivacyScreen, NotifsScreen, AbonnementScreen,
});
