/* global window */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — DreamAPI module (iframe → Next.js /api/*)
// 2026-04-25 — Yeshua
//
// Wraps every fetch with Bearer auth from window.DreamAuth.
// Each method returns parsed JSON or throws.
// Each method has a *_seed fallback in case of error/no-auth (to keep
// the V1.2 visual demo working even without backend).
// ──────────────────────────────────────────────────────────────

(function setupDreamAPI() {
  // ── Helpers ───────────────────────────────────────────────
  async function authHeaders(extra = {}) {
    const headers = { ...extra };
    if (window.DreamAuth && !window.DreamAuth.noAuth) {
      const token = await window.DreamAuth.getAccessToken();
      if (token) headers["Authorization"] = "Bearer " + token;
    }
    return headers;
  }

  async function jsonFetch(url, opts = {}) {
    const finalOpts = { ...opts };
    const baseHeaders = opts.headers || {};
    const auth = await authHeaders(baseHeaders);
    if (opts.body && !(opts.body instanceof FormData) && !auth["Content-Type"]) {
      auth["Content-Type"] = "application/json";
    }
    finalOpts.headers = auth;
    const res = await fetch(url, finalOpts);
    if (!res.ok) {
      let errBody = null;
      try { errBody = await res.json(); } catch {}
      const msg = errBody?.error || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      err.body = errBody;
      throw err;
    }
    return res.json();
  }

  function safeCall(fn, fallback) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (e) {
        console.warn("[DreamAPI] " + fn.name + " failed:", e.message);
        if (typeof fallback === "function") return fallback(...args);
        return fallback;
      }
    };
  }

  // ── Seed fallbacks (only used when API down / no auth) ──────
  // Keep V1.2 visual coherent in degraded mode.
  const SEED = {
    kairos: () => (window.seedEntries || []).map((e, i) => ({
      id: e.id,
      kairos_type: mapTypeToBackend(e.type),
      raw_text: e.text,
      created_at: new Date(Date.now() - i * 24 * 3600 * 1000).toISOString(),
      numinosity_score: e.numinous ? 0.8 : 0.3,
      synthesis_tier: e.bigDream ? "deep" : "light",
      motif_tags: [],
      archetypal_tags: [],
      user_marked_numinous: !!e.numinous,
    })),
    constellation: () => ({
      nodes: (window.portraitNodes || []).map(n => ({
        id: n.id,
        label: n.label,
        weight: n.weight,
        kind: n.shape === "star" ? "bigdream" : "kairos",
      })),
      edges: [],
    }),
    voute: () => ({
      meteo: { top_motifs: [{ motif: "eau", count: 12 }], k_count: 47 },
      polyphonie: null,
      annales_circulating_count: 0,
      meteo_optin_count: 0,
    }),
  };

  // Map V1.2 type strings to backend kairos_type enum
  function mapTypeToBackend(t) {
    return ({
      dream_night: "reve",
      sidewalk_oracle: "signe",
      daydream_reverie: "reverie",
      hypnagogic: "hypnagogie",
      synchronicity: "synchronicite",
      somatic_shiver: "frisson",
      note_vie: "note",
    })[t] || "reve";
  }

  function mapTypeFromBackend(t) {
    return ({
      reve: "dream_night",
      signe: "sidewalk_oracle",
      reverie: "daydream_reverie",
      hypnagogie: "hypnagogic",
      synchronicite: "synchronicity",
      frisson: "somatic_shiver",
      note: "note_vie",
    })[t] || "dream_night";
  }

  function relativeWhen(iso) {
    if (!iso) return "récemment";
    const now = Date.now();
    const t = new Date(iso).getTime();
    const dh = (now - t) / 3600000;
    if (dh < 1) return "à l'instant";
    if (dh < 12) return "ce matin";
    if (dh < 24) return "aujourd'hui";
    if (dh < 36) return "hier soir";
    if (dh < 48) return "hier";
    if (dh < 24 * 7) return "il y a " + Math.floor(dh / 24) + " jours";
    if (dh < 24 * 30) return "il y a " + Math.floor(dh / (24 * 7)) + " semaine(s)";
    if (dh < 24 * 60) return "il y a une lune";
    if (dh < 24 * 90) return "il y a deux lunes";
    return "il y a plusieurs lunes";
  }

  // ── DreamAPI (public surface) ─────────────────────────────
  const DreamAPI = {
    // Internal helpers exposed for screen-side use
    _mapTypeToBackend: mapTypeToBackend,
    _mapTypeFromBackend: mapTypeFromBackend,
    _relativeWhen: relativeWhen,

    // ── Kairos ──
    listKairos: safeCall(
      async function listKairos({ limit = 50, kairos_type = null, numinous_only = false } = {}) {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (kairos_type) params.set("kairos_type", kairos_type);
        if (numinous_only) params.set("numinous_only", "true");
        const data = await jsonFetch("/api/kairos?" + params.toString());
        // Decorate with V1.2-friendly fields
        const decorated = (data.kairos || []).map(k => ({
          ...k,
          when: relativeWhen(k.created_at),
          type: mapTypeFromBackend(k.kairos_type),
          numinous: !!k.user_marked_numinous || (k.numinosity_score || 0) >= 0.7,
          bigDream: k.synthesis_tier === "deep" || (k.numinosity_score || 0) >= 0.85,
          text: k.raw_text || "",
        }));
        return { ...data, kairos: decorated };
      },
      () => ({ kairos: SEED.kairos(), total: SEED.kairos().length, next_cursor: null, _seed: true })
    ),

    getKairos: safeCall(
      async function getKairos(id) {
        const data = await jsonFetch("/api/kairos/" + encodeURIComponent(id));
        const k = data.kairos;
        if (k) {
          k.when = relativeWhen(k.created_at);
          k.type = mapTypeFromBackend(k.kairos_type);
          k.numinous = !!k.user_marked_numinous || (k.numinosity_score || 0) >= 0.7;
          k.bigDream = k.synthesis_tier === "deep" || (k.numinosity_score || 0) >= 0.85;
          k.text = k.raw_text || "";
        }
        return data;
      },
      (id) => {
        const seed = SEED.kairos().find(k => k.id === id) || SEED.kairos()[0];
        return { kairos: seed, _seed: true };
      }
    ),

    createKairos: safeCall(
      async function createKairos({ raw_text, kairos_type = "reve", capture_method = "text", mark_numinous = false }) {
        return jsonFetch("/api/kairos", {
          method: "POST",
          body: JSON.stringify({ raw_text, kairos_type, capture_method, mark_numinous }),
        });
      },
      ({ raw_text }) => ({
        kairos: {
          id: "local-" + Date.now(),
          raw_text,
          kairos_type: "reve",
          created_at: new Date().toISOString(),
          enrichment_status: "offline",
        },
        _seed: true,
      })
    ),

    updateKairos: safeCall(
      async function updateKairos(id, patch) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(id), {
          method: "PATCH",
          body: JSON.stringify(patch),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    deleteKairos: safeCall(
      async function deleteKairos(id) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(id), { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    // ── Échos ──
    listEchoesGlobal: safeCall(
      async function listEchoesGlobal({ synthesis = false, locale = "fr" } = {}) {
        const params = new URLSearchParams();
        if (synthesis) params.set("synthesis", "true");
        params.set("locale", locale);
        return jsonFetch("/api/echoes?" + params.toString());
      },
      () => ({ echoes: [], synthesis: null, stats: {}, correspondences: [], _seed: true })
    ),

    getEchoesForKairos: safeCall(
      async function getEchoesForKairos(kairosId, opts = {}) {
        const params = new URLSearchParams();
        if (opts.limit) params.set("limit", String(opts.limit));
        return jsonFetch("/api/kairos/" + encodeURIComponent(kairosId) + "/echoes?" + params.toString());
      },
      () => ({ echoes: [], _seed: true })
    ),

    getProphecyForKairos: safeCall(
      async function getProphecyForKairos(kairosId) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(kairosId) + "/prophetic");
      },
      () => ({ propheties: [], _seed: true })
    ),

    // Sprint P1 (2026-04-27) — chuchotement DreamHome quand un écho mûrit.
    // Retourne au max 1 écho prophétique 'awakened' jamais notifié.
    // Side-effect serveur : marque notified_at à now() (idempotent).
    getMaturedPropheticEchoes: safeCall(
      async function getMaturedPropheticEchoes() {
        return jsonFetch("/api/echoes/prophetic/matured");
      },
      () => ({ echoes: [], _seed: true })
    ),

    // Sprint P1 (2026-04-27) — user dismiss explicit du chuchotement.
    dismissPropheticEcho: safeCall(
      async function dismissPropheticEcho(kairosId) {
        return jsonFetch("/api/echoes/prophetic/" + encodeURIComponent(kairosId) + "/dismiss", {
          method: "POST",
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    // ── KairosDetail refonte 2026-04-25 ──
    // Forêt en deuxième temps — APRÈS user_first_reading.
    forestReading: safeCall(
      async function forestReading(kairosId, { user_first_reading } = {}) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(kairosId) + "/forest-reading", {
          method: "POST",
          body: JSON.stringify({ user_first_reading: user_first_reading || null }),
        });
      },
      () => ({
        angles: [
          { source: "Aizenstat (Dream Tending)", citation: "Le rêve veut être tenu, pas résolu.", angle: "on pourrait entendre ici l'invitation à laisser cette image respirer encore.", matter: "paper" },
          { source: "Bachelard (Poétique de la rêverie)", citation: "L'eau qui hésite est une eau qui pense.", angle: "il semble que ce passage évoque une fluidité qui cherche encore son lit.", matter: "stone" },
          { source: "Gendlin (Focusing)", citation: "Le sens vit d'abord dans le corps.", angle: "peut-être que ton corps tient déjà ce que ton mental n'a pas nommé.", matter: "silk" },
        ],
        framing: "ces voix ne disent pas ton rêve — elles le touchent depuis leur angle. ton corps tranche.",
        _seed: true,
      })
    ),

    // FELT_SHIFT_GATE + AHA_CAPTURE après une lecture (forest / echo / tale / user_first).
    submitAhaFeedback: safeCall(
      async function submitAhaFeedback(kairosId, { reading_kind, felt_shift_location, aha_level, aha_note, forest_reading_angles, proposition_voix } = {}) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(kairosId) + "/aha-feedback", {
          method: "POST",
          body: JSON.stringify({
            reading_kind,
            felt_shift_location,
            aha_level,
            aha_note,
            forest_reading_angles,
            proposition_voix,
          }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    // ── Figures / Constellation ──
    listFigures: safeCall(
      async function listFigures({ synthesis = false } = {}) {
        const params = new URLSearchParams();
        if (synthesis) params.set("synthesis", "true");
        return jsonFetch("/api/figures?" + params.toString());
      },
      () => ({ motifs: [], edges: [], synthesis: null, _seed: true })
    ),

    getConstellationGraph: safeCall(
      async function getConstellationGraph({ days = 90, min_weight = 0.3 } = {}) {
        const params = new URLSearchParams();
        params.set("days", String(days));
        params.set("min_weight", String(min_weight));
        const data = await jsonFetch("/api/constellation?" + params.toString());
        return data.graph || { nodes: [], edges: [] };
      },
      () => SEED.constellation()
    ),

    // ── Anima Mundi ──
    getVoute: safeCall(
      async function getVoute() { return jsonFetch("/api/anima-mundi/voute"); },
      () => SEED.voute()
    ),

    getMeteo: safeCall(
      async function getMeteo({ limit = 4 } = {}) {
        return jsonFetch("/api/anima-mundi/meteo?limit=" + limit);
      },
      () => ({ meteos: [], _seed: true })
    ),

    getPolyphonie: safeCall(
      async function getPolyphonie({ limit = 6 } = {}) {
        return jsonFetch("/api/anima-mundi/polyphonie?limit=" + limit);
      },
      () => ({ polyphonies: [], _seed: true })
    ),

    // Archive lunaire — toutes polyphonies passées (chronologique inversé)
    // Utilisé par AnimaPolyphonieScreen "lectures précédentes" (chambre 4).
    getPolyphonieArchive: safeCall(
      async function getPolyphonieArchive({ limit = 60 } = {}) {
        return jsonFetch("/api/anima-mundi/polyphonie/archive?limit=" + limit);
      },
      () => ({ polyphonies: [], _seed: true })
    ),

    getAnnales: safeCall(
      async function getAnnales() { return jsonFetch("/api/anima-mundi/annales"); },
      () => ({ circulating: [], archived: [], _seed: true })
    ),

    tenirAnnale: safeCall(
      async function tenirAnnale(annales_id) {
        return jsonFetch("/api/anima-mundi/tenir", {
          method: "POST",
          body: JSON.stringify({ annales_id }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    // ── Cercles ──
    listCircles: safeCall(
      async function listCircles() { return jsonFetch("/api/circles"); },
      () => ({ circles: [], _seed: true })
    ),

    createCircle: safeCall(
      async function createCircle({
        name,
        description,
        maxMembers,
        frequency,
        displayName,
        // 2026-04-25 — Refonte Cercle V1 (Bible §3.4.1)
        type,           // 'spontane' | 'intentionnel' | 'facilite'
        intention_text, // libre
        sub_intentions, // string[] up to 3
        // 2026-04-28 — Cercles éphémères 21j (T2 Niveau 3)
        ephemeral_days, // number 1..90 ; null = non-éphémère
      }) {
        return jsonFetch("/api/circles", {
          method: "POST",
          body: JSON.stringify({
            name,
            description,
            maxMembers,
            frequency,
            displayName,
            type,
            intention_text,
            sub_intentions,
            ephemeral_days,
          }),
        });
      },
      () => ({ _seed: true, error: "auth required" })
    ),

    // 2026-04-28 — Invitations magiques (T1 Niveau 3)
    createCircleInvitation: safeCall(
      async function createCircleInvitation(circleId, opts = {}) {
        return jsonFetch(
          "/api/circles/" + encodeURIComponent(circleId) + "/invitations",
          {
            method: "POST",
            body: JSON.stringify({
              uses_remaining: opts.uses_remaining,
              expires_in_days: opts.expires_in_days,
            }),
          }
        );
      },
      () => ({ _seed: true, error: "auth required" })
    ),

    listCircleInvitations: safeCall(
      async function listCircleInvitations(circleId) {
        return jsonFetch(
          "/api/circles/" + encodeURIComponent(circleId) + "/invitations"
        );
      },
      () => ({ invitations: [], _seed: true })
    ),

    revokeCircleInvitation: safeCall(
      async function revokeCircleInvitation(circleId, token) {
        return jsonFetch(
          "/api/circles/" +
            encodeURIComponent(circleId) +
            "/invitations/" +
            encodeURIComponent(token),
          { method: "DELETE" }
        );
      },
      () => ({ _seed: true, error: "auth required" })
    ),

    joinCircle: safeCall(
      async function joinCircle({ inviteCode, displayName }) {
        // Note : /api/circles/join still uses legacy userId pattern, send via body
        const user = window.DreamUser;
        return jsonFetch("/api/circles/join", {
          method: "POST",
          body: JSON.stringify({ inviteCode, displayName, userId: user?.id }),
        });
      },
      () => ({ _seed: true, error: "auth required" })
    ),

    // 2026-04-28 — 7 templates pré-configurés V1
    listCircleTemplates: safeCall(
      async function listCircleTemplates() {
        return jsonFetch("/api/circles/templates");
      },
      () => ({ templates: [], _seed: true })
    ),

    createCircleFromTemplate: safeCall(
      async function createCircleFromTemplate({
        slug,
        customName,
        customIntention,
        customSubIntentions,
        displayName,
      }) {
        return jsonFetch(
          "/api/circles/templates/" + encodeURIComponent(slug) + "/use",
          {
            method: "POST",
            body: JSON.stringify({
              customName,
              customIntention,
              customSubIntentions,
              displayName,
            }),
          }
        );
      },
      () => ({ _seed: true, error: "auth required" })
    ),

    listRestitutions: safeCall(
      async function listRestitutions(circleId) {
        return jsonFetch("/api/circles/" + encodeURIComponent(circleId) + "/restitutions");
      },
      () => ({ restitutions: [], _seed: true })
    ),

    requestRestitution: safeCall(
      async function requestRestitution(circleId, period_days = 28) {
        return jsonFetch("/api/circles/" + encodeURIComponent(circleId) + "/restitutions", {
          method: "POST",
          body: JSON.stringify({ period_days }),
        });
      },
      () => ({ _seed: true, status: "pending" })
    ),

    // 2026-04-25 — Réactions sobres sur restitution polyphonique (3 valeurs)
    submitCircleReaction: safeCall(
      async function submitCircleReaction(circleId, restitutionId, reactionType) {
        return jsonFetch("/api/circles/" + encodeURIComponent(circleId) + "/reactions", {
          method: "POST",
          body: JSON.stringify({ restitution_id: restitutionId, reaction_type: reactionType }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    removeCircleReaction: safeCall(
      async function removeCircleReaction(circleId, restitutionId, reactionType) {
        const params = new URLSearchParams();
        params.set("restitution_id", restitutionId);
        params.set("reaction_type", reactionType);
        return jsonFetch(
          "/api/circles/" + encodeURIComponent(circleId) + "/reactions?" + params.toString(),
          { method: "DELETE" }
        );
      },
      () => ({ _seed: true, ok: true })
    ),

    listCircleReactions: safeCall(
      async function listCircleReactions(circleId, restitutionId) {
        const params = new URLSearchParams();
        params.set("restitution_id", restitutionId);
        return jsonFetch(
          "/api/circles/" + encodeURIComponent(circleId) + "/reactions?" + params.toString()
        );
      },
      () => ({
        counts: { resonates: 0, unfamiliar: 0, question: 0 },
        mine: { resonates: false, unfamiliar: false, question: false },
        total: 0,
        _seed: true,
      })
    ),

    // 2026-04-25 — Quitter le cercle (soft : pose left_at)
    leaveCircle: safeCall(
      async function leaveCircle(circleId) {
        return jsonFetch("/api/circles/" + encodeURIComponent(circleId) + "/leave", {
          method: "DELETE",
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    // 2026-04-25 — Opt-in kairos vers cercle, 3 modes (Bible §3.4.1)
    //   mode = 'private' | 'optin_anon' | 'shared_clear'
    optinKairosToCircle: safeCall(
      async function optinKairosToCircle({ kairosId, circleId, mode, pseudonym }) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(kairosId) + "/circle-optin", {
          method: "POST",
          body: JSON.stringify({ circle_id: circleId, mode, pseudonym }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    getKairosCircleMode: safeCall(
      async function getKairosCircleMode(kairosId, circleId) {
        const params = new URLSearchParams();
        params.set("circle_id", circleId);
        return jsonFetch(
          "/api/kairos/" + encodeURIComponent(kairosId) + "/circle-optin?" + params.toString()
        );
      },
      () => ({ mode: "private", _seed: true })
    ),

    // ── Oracle Corps / Tales ──
    getOracleCorps: safeCall(
      async function getOracleCorps({ synthesis = false, locale = "fr" } = {}) {
        const params = new URLSearchParams();
        if (synthesis) params.set("synthesis", "true");
        params.set("locale", locale);
        return jsonFetch("/api/oracle-corps?" + params.toString());
      },
      () => ({ correlations: [], synthesis: null, _seed: true })
    ),

    matchTales: safeCall(
      async function matchTales(dreamId, top_k = 5) {
        return jsonFetch("/api/tales/match", {
          method: "POST",
          body: JSON.stringify({ dreamId, top_k }),
        });
      },
      () => ({ tales: [], _seed: true })
    ),

    // 2026-04-26 — Conte résonance user (Bible §17.4)
    submitTaleResonance: safeCall(
      async function submitTaleResonance({ tale_id, kairos_id, resonance, user_note }) {
        return jsonFetch("/api/tales/resonance", {
          method: "POST",
          body: JSON.stringify({ tale_id, kairos_id, resonance, user_note }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    listTaleResonances: safeCall(
      async function listTaleResonances() {
        return jsonFetch("/api/tales/resonance");
      },
      () => ({ resonances: [], _seed: true })
    ),

    // ── Oracle Corps — body markers (Bible §17.2) ──
    // 2026-04-26 — silhouette tap markers + heat map
    listBodyMarkers: safeCall(
      async function listBodyMarkers({ days = 30, kairos_id } = {}) {
        const params = new URLSearchParams();
        params.set("days", String(days));
        if (kairos_id) params.set("kairos_id", kairos_id);
        return jsonFetch("/api/oracle-corps/markers?" + params.toString());
      },
      () => ({ markers: [], heatmap: [], correlations: [], _seed: true })
    ),

    createBodyMarker: safeCall(
      async function createBodyMarker(data) {
        return jsonFetch("/api/oracle-corps/markers", {
          method: "POST",
          body: JSON.stringify(data || {}),
        });
      },
      () => ({ _seed: true, marker: null })
    ),

    deleteBodyMarker: safeCall(
      async function deleteBodyMarker(id) {
        return jsonFetch("/api/oracle-corps/markers?id=" + encodeURIComponent(id), { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    // ── Nightmares sub-app (Bible §17.3, opt-in + auto-detect) ──
    getProtectionState: safeCall(
      async function getProtectionState() { return jsonFetch("/api/nightmares/protection-state"); },
      () => ({ state: { nightmare_mode_enabled: false, freeze_until: null, is_frozen: false, _seed: true } })
    ),

    updateProtectionState: safeCall(
      async function updateProtectionState(patch) {
        return jsonFetch("/api/nightmares/protection-state", {
          method: "POST",
          body: JSON.stringify(patch || {}),
        });
      },
      () => ({ _seed: true, state: null })
    ),

    enableProtectionFreeze: safeCall(
      async function enableProtectionFreeze({ days = 30, is_crisis = false } = {}) {
        return jsonFetch("/api/nightmares/enable-freeze", {
          method: "POST",
          body: JSON.stringify({ days, is_crisis }),
        });
      },
      () => ({ _seed: true, state: null, frozen_for_days: 30 })
    ),

    liftProtectionFreeze: safeCall(
      async function liftProtectionFreeze() {
        return jsonFetch("/api/nightmares/enable-freeze", { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    listMarkedNightmares: safeCall(
      async function listMarkedNightmares({ type = "both", limit = 50 } = {}) {
        const params = new URLSearchParams();
        params.set("type", type);
        params.set("limit", String(limit));
        return jsonFetch("/api/nightmares/list-marked?" + params.toString());
      },
      () => ({ entries: [], _seed: true })
    ),

    markNightmare: safeCall(
      async function markNightmare({ kairos_id, is_nightmare, is_grief_related, grief_who }) {
        return jsonFetch("/api/nightmares/mark", {
          method: "POST",
          body: JSON.stringify({ kairos_id, is_nightmare, is_grief_related, grief_who }),
        });
      },
      () => ({ _seed: true, entry: null })
    ),

    autoDetectProtection: safeCall(
      async function autoDetectProtection() {
        return jsonFetch("/api/nightmares/auto-detect");
      },
      () => ({ propose: false, _seed: true })
    ),

    // 2026-04-28 §11.bis.20.13 — interprétation Forêt nuancée trauma-safe
    forestReadingNightmare: safeCall(
      async function forestReadingNightmare({ dream_id, raw_text } = {}) {
        return jsonFetch("/api/nightmares/forest-reading", {
          method: "POST",
          body: JSON.stringify({ dream_id: dream_id || null, raw_text: raw_text || null }),
        });
      },
      () => ({ status: "ok", reading: null, framing: null, _seed: true })
    ),

    // 2026-04-28 §11.bis.20.12 — lecture polyphonique 3 voix corps
    bodyOracleReading: safeCall(
      async function bodyOracleReading(payload = {}) {
        return jsonFetch("/api/oracle-corps/reading", {
          method: "POST",
          body: JSON.stringify(payload || {}),
        });
      },
      () => ({ reading: null, framing: null, _seed: true })
    ),

    // ── Chat narratrice (SSE) ──
    // Returns { reader, decoder } — caller pulls chunks
    async chatStream({ messages, mode = "dream", dreamId = null, locale = "fr" }) {
      const token = await (window.DreamAuth?.getAccessToken?.() || Promise.resolve(null));
      if (!token && !window.DreamAuth?.noAuth) throw new Error("Auth required for chat");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: "Bearer " + token } : {}),
        },
        body: JSON.stringify({ messages, mode, dreamId, locale }),
      });
      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error("chat stream failed: " + (text || res.status));
      }
      return res.body.getReader();
    },

    // Convenience: parse SSE stream from chatStream into chunks/done events
    async chat({ messages, mode = "dream", dreamId = null, locale = "fr", onChunk, onDone, onError }) {
      try {
        const reader = await this.chatStream({ messages, mode, dreamId, locale });
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop();  // last is incomplete
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            try {
              const ev = JSON.parse(line.slice(5).trim());
              if (ev.type === "chunk" && onChunk) onChunk(ev.content);
              else if (ev.type === "done" && onDone) onDone(ev.metadata || {});
              else if (ev.type === "error" && onError) onError(ev.message);
            } catch (e) {
              console.warn("[DreamAPI] SSE parse error:", e.message);
            }
          }
        }
      } catch (e) {
        if (onError) onError(e.message);
        else throw e;
      }
    },

    // ── Transcribe (voice) ──
    transcribe: safeCall(
      async function transcribe(audioBlob, mimeType = "audio/webm") {
        const fd = new FormData();
        fd.append("audio", audioBlob, "recording." + (mimeType.split("/")[1] || "webm"));
        // Add userId fallback for legacy auth
        const user = window.DreamUser;
        if (user?.id) fd.append("userId", user.id);
        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: await authHeaders(),
          body: fd,
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.error || "HTTP " + res.status);
        }
        return res.json();
      },
      () => ({ text: "", _seed: true, error: "transcribe unavailable" })
    ),

    // ── User personal layer ──
    listMeanings: safeCall(
      async function listMeanings() { return jsonFetch("/api/user/meaning"); },
      () => ({ meanings: [], _seed: true })
    ),

    setMeaning: safeCall(
      async function setMeaning({ symbol_concept, user_meaning, weight = 1.0, context_lang = "fr", source = null }) {
        return jsonFetch("/api/user/meaning", {
          method: "POST",
          body: JSON.stringify({ symbol_concept, user_meaning, weight, context_lang, source }),
        });
      },
      () => ({ _seed: true })
    ),

    deleteMeaning: safeCall(
      async function deleteMeaning(id) {
        return jsonFetch("/api/user/meaning?id=" + encodeURIComponent(id), { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    validate: safeCall(
      async function validate({ context_type, context_id, validation, proposition_voix, user_note }) {
        return jsonFetch("/api/user/validate", {
          method: "POST",
          body: JSON.stringify({ context_type, context_id, validation, proposition_voix, user_note }),
        });
      },
      () => ({ _seed: true })
    ),

    annotateKairos: safeCall(
      async function annotateKairos(kairos_id, annotation_text, marker_position = null) {
        return jsonFetch("/api/user/annotate", {
          method: "POST",
          body: JSON.stringify({ kairos_id, annotation_text, marker_position }),
        });
      },
      () => ({ _seed: true })
    ),

    listAnnotations: safeCall(
      async function listAnnotations(kairos_id) {
        return jsonFetch("/api/user/annotate?kairos_id=" + encodeURIComponent(kairos_id));
      },
      () => ({ annotations: [], _seed: true })
    ),

    // ── Feedback ──
    submitFeedback: safeCall(
      async function submitFeedback({ context_type, context_id, feedback_text, severity = "low", user_email }) {
        return jsonFetch("/api/feedback", {
          method: "POST",
          body: JSON.stringify({ context_type, context_id, feedback_text, severity, user_email }),
        });
      },
      () => ({ _seed: true })
    ),

    // ── Journal de Vie LUMINEUX (révélation Tim 2026-04-25) ──
    createJournalEntry: safeCall(
      async function createJournalEntry({ raw_text, voice_url = null, linked_kairos_id = null }) {
        return jsonFetch("/api/journal/entries", {
          method: "POST",
          body: JSON.stringify({ raw_text, voice_url, linked_kairos_id }),
        });
      },
      ({ raw_text }) => ({ entry: { id: "local-" + Date.now(), raw_text, created_at: new Date().toISOString() }, _seed: true })
    ),

    listJournalEntries: safeCall(
      async function listJournalEntries({ category = null, sub_category = null, limit = 50, offset = 0 } = {}) {
        const params = new URLSearchParams();
        params.set("limit", String(limit));
        if (category) params.set("category", category);
        if (sub_category) params.set("sub_category", sub_category);
        if (offset) params.set("offset", String(offset));
        return jsonFetch("/api/journal/entries?" + params.toString());
      },
      () => ({ entries: [], _seed: true })
    ),

    listJournalSections: safeCall(
      async function listJournalSections() {
        return jsonFetch("/api/journal/sections");
      },
      () => ({
        sections: [
          { category: "travail", label: "travail & vocation", glyph: "◇", count: 0 },
          { category: "relations", label: "relations", glyph: "○", count: 0, sub_categories: [] },
          { category: "corps_sante", label: "corps & santé", glyph: "◐", count: 0 },
          { category: "passions", label: "passions & création", glyph: "✶", count: 0 },
          { category: "argent", label: "argent & matériel", glyph: "⌬", count: 0 },
          { category: "spiritualite", label: "spiritualité & sens", glyph: "☉", count: 0 },
          { category: "transitions", label: "transitions & seuils", glyph: "⌒", count: 0 },
        ],
        _seed: true,
      })
    ),

    summonKairosWisdom: safeCall(
      async function summonKairosWisdom({ entry_id = null, category = null, sub_category = null }) {
        return jsonFetch("/api/journal/summon-kairos-wisdom", {
          method: "POST",
          body: JSON.stringify({ entry_id, category, sub_category }),
        });
      },
      () => ({
        polyphony_text: "Cette voix viendra quand l'app sera connectée. En mode démo, la sagesse dort.",
        voices_mobilisees: [],
        resonant_kairos: [],
        _seed: true,
      })
    ),

    submitWisdomFeedback: safeCall(
      async function submitWisdomFeedback(summon_id, { felt_shift_location, aha_level, aha_note }) {
        return jsonFetch("/api/journal/summons/" + encodeURIComponent(summon_id), {
          method: "PATCH",
          body: JSON.stringify({ felt_shift_location, aha_level, aha_note }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    // ── Lucid sub-app (Bible §17, opt-in strict) ───────────────
    getLucidProfile: safeCall(
      async function getLucidProfile() {
        return jsonFetch("/api/lucid/profile");
      },
      () => ({
        profile: {
          enabled: false, experience_level: null, preferred_technique: null,
          ui_mode: "dark_mono", obsidian_export_enabled: false,
          total_lucid_dreams: 0, total_dreams_recalled: 0,
          current_streak_lucid_per_week: 0, best_streak: 0,
          _exists: false, _seed: true,
        },
      })
    ),

    updateLucidProfile: safeCall(
      async function updateLucidProfile(patch) {
        return jsonFetch("/api/lucid/profile", {
          method: "POST",
          body: JSON.stringify(patch || {}),
        });
      },
      () => ({ _seed: true, profile: null })
    ),

    listRealityChecks: safeCall(
      async function listRealityChecks() {
        return jsonFetch("/api/lucid/reality-checks");
      },
      () => ({ reality_checks: [], _seed: true })
    ),

    createRealityCheck: safeCall(
      async function createRealityCheck(data) {
        return jsonFetch("/api/lucid/reality-checks", {
          method: "POST",
          body: JSON.stringify(data || {}),
        });
      },
      () => ({ _seed: true, reality_check: null })
    ),

    updateRealityCheck: safeCall(
      async function updateRealityCheck(id, patch) {
        return jsonFetch("/api/lucid/reality-checks/" + encodeURIComponent(id), {
          method: "PATCH",
          body: JSON.stringify(patch || {}),
        });
      },
      () => ({ _seed: true, reality_check: null })
    ),

    deleteRealityCheck: safeCall(
      async function deleteRealityCheck(id) {
        return jsonFetch("/api/lucid/reality-checks/" + encodeURIComponent(id), { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    listDreamSigns: safeCall(
      async function listDreamSigns() {
        return jsonFetch("/api/lucid/dream-signs");
      },
      () => ({ dream_signs: [], _seed: true })
    ),

    addDreamSign: safeCall(
      async function addDreamSign(label, category) {
        return jsonFetch("/api/lucid/dream-signs", {
          method: "POST",
          body: JSON.stringify({ sign_label: label, sign_category: category || null }),
        });
      },
      () => ({ _seed: true, dream_sign: null })
    ),

    deleteDreamSign: safeCall(
      async function deleteDreamSign(id) {
        return jsonFetch("/api/lucid/dream-signs/" + encodeURIComponent(id), { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    updateDreamSign: safeCall(
      async function updateDreamSign(id, patch) {
        return jsonFetch("/api/lucid/dream-signs/" + encodeURIComponent(id), {
          method: "PATCH",
          body: JSON.stringify(patch || {}),
        });
      },
      () => ({ _seed: true, dream_sign: null })
    ),

    attachLucidMetadata: safeCall(
      async function attachLucidMetadata(kairosId, data) {
        return jsonFetch("/api/lucid/kairos-metadata", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId, ...(data || {}) }),
        });
      },
      () => ({ _seed: true, metadata: null })
    ),

    listWBTBAlarms: safeCall(
      async function listWBTBAlarms() {
        return jsonFetch("/api/lucid/wbtb-alarms");
      },
      () => ({ alarms: [], _seed: true })
    ),

    createWBTBAlarm: safeCall(
      async function createWBTBAlarm(data) {
        return jsonFetch("/api/lucid/wbtb-alarms", {
          method: "POST",
          body: JSON.stringify(data || {}),
        });
      },
      () => ({ _seed: true, alarm: null })
    ),

    deleteWBTBAlarm: safeCall(
      async function deleteWBTBAlarm(id) {
        return jsonFetch("/api/lucid/wbtb-alarms/" + encodeURIComponent(id), { method: "DELETE" });
      },
      () => ({ _seed: true, ok: true })
    ),

    updateWBTBAlarm: safeCall(
      async function updateWBTBAlarm(id, patch) {
        return jsonFetch("/api/lucid/wbtb-alarms/" + encodeURIComponent(id), {
          method: "PATCH",
          body: JSON.stringify(patch || {}),
        });
      },
      () => ({ _seed: true, alarm: null })
    ),

    getLucidStats: safeCall(
      async function getLucidStats() {
        return jsonFetch("/api/lucid/stats");
      },
      () => ({
        stats: {
          total_dreams: 0, total_lucid_dreams: 0, recall_rate_pct: 0,
          current_streak_per_week: 0, best_streak_in_7d_window: 0,
          signs_count: 0, top_signs: [], recent_lucid_per_day: [],
          technique_breakdown: {},
        },
        _seed: true,
      })
    ),

    extractDreamSigns: safeCall(
      async function extractDreamSigns(kairosId) {
        return jsonFetch("/api/lucid/extract-dream-signs", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId }),
        });
      },
      () => ({ dream_signs: [], _seed: true })
    ),

    exportObsidian: safeCall(
      async function exportObsidian() {
        // Returns text/markdown; the Dashboard handles the download itself.
        const token = await (window.DreamAuth?.getAccessToken?.() || Promise.resolve(null));
        const res = await fetch("/api/lucid/export-obsidian", {
          headers: token ? { Authorization: "Bearer " + token } : {},
        });
        if (!res.ok) throw new Error("export failed: " + res.status);
        return res.text();
      },
      () => "# (offline) — no export available\n"
    ),

    // ── Lucid V1 — routes nouvelles 2026-04-28 (Yeshua) ─────────
    detectLucidMarkers: safeCall(
      async function detectLucidMarkers({ kairos_id, raw_text, persist = false } = {}) {
        return jsonFetch("/api/lucid/detect-markers", {
          method: "POST",
          body: JSON.stringify({ kairos_id, raw_text, persist }),
        });
      },
      () => ({ markers: { is_lucid: false, confidence: 0, signals: [] }, _seed: true })
    ),

    suggestDreamSigns: safeCall(
      async function suggestDreamSigns() {
        return jsonFetch("/api/lucid/dream-signs-suggest", {
          method: "POST",
          body: JSON.stringify({}),
        });
      },
      () => ({ suggestions: [], _seed: true })
    ),

    getLucidPracticeLetter: safeCall(
      async function getLucidPracticeLetter({ force = false } = {}) {
        return jsonFetch("/api/lucid/practice-letter", {
          method: "POST",
          body: JSON.stringify({ force }),
        });
      },
      () => ({
        letter: "Mode démo : la lettre de ta pratique apparaîtra ici quand l'app sera connectée.",
        cached: false, word_count: 14, _seed: true,
      })
    ),

    logRealityCheckTick: safeCall(
      async function logRealityCheckTick({ rc_id, result, triggered_kairos_id, notes } = {}) {
        return jsonFetch("/api/lucid/reality-check-tick", {
          method: "POST",
          body: JSON.stringify({ rc_id, result, triggered_kairos_id, notes }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    setWBTBIntention: safeCall(
      async function setWBTBIntention({ alarm_id, intention, sound_profile } = {}) {
        return jsonFetch("/api/lucid/wbtb-intention", {
          method: "POST",
          body: JSON.stringify({ alarm_id, intention, sound_profile }),
        });
      },
      () => ({ _seed: true, ok: true })
    ),

    listLucidSessions: safeCall(
      async function listLucidSessions() {
        return jsonFetch("/api/lucid/session-events");
      },
      () => ({ sessions: [], _seed: true })
    ),

    logLucidSession: safeCall(
      async function logLucidSession(data) {
        return jsonFetch("/api/lucid/session-events", {
          method: "POST",
          body: JSON.stringify(data || {}),
        });
      },
      () => ({ _seed: true, session: null })
    ),

    submitLucidOnboarding: safeCall(
      async function submitLucidOnboarding(data) {
        return jsonFetch("/api/lucid/onboarding", {
          method: "POST",
          body: JSON.stringify(data || {}),
        });
      },
      () => ({ _seed: true, gateway_unlocked: false })
    ),

    exportLucidJournal: safeCall(
      async function exportLucidJournal({ format = "markdown" } = {}) {
        const token = await (window.DreamAuth?.getAccessToken?.() || Promise.resolve(null));
        const res = await fetch("/api/lucid/export?format=" + encodeURIComponent(format), {
          headers: token ? { Authorization: "Bearer " + token } : {},
        });
        if (!res.ok) throw new Error("export failed: " + res.status);
        return format === "json" ? res.json() : res.text();
      },
      () => "# (offline)\n"
    ),

    getLucidForestBridge: safeCall(
      async function getLucidForestBridge(kairosId) {
        return jsonFetch("/api/lucid/forest-bridge", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId }),
        });
      },
      () => ({ voices: [], _seed: true })
    ),

    checkNightmareDetour: safeCall(
      async function checkNightmareDetour({ kairos_id, valence, intention_was_to_resolve } = {}) {
        return jsonFetch("/api/lucid/nightmare-detour", {
          method: "POST",
          body: JSON.stringify({ kairos_id, valence, intention_was_to_resolve }),
        });
      },
      () => ({ detour_required: false, _seed: true })
    ),

    // ── Portrait narrative (refonte 2026-04-25) ──
    getPortraitNarrative: safeCall(
      async function getPortraitNarrative({ toggle = "crossed", period = "lune", force = false } = {}) {
        return jsonFetch("/api/portrait/narrative-reading", {
          method: "POST",
          body: JSON.stringify({ toggle, period, force }),
        });
      },
      ({ toggle = "crossed" } = {}) => ({
        lettre: toggle === "day"
          ? "Mode démo : ta vie de jour respire en silence ici."
          : toggle === "night"
          ? "Mode démo : la nuit dort encore dans ce sol."
          : "Mode démo : les deux mondes se croiseront quand l'app sera connectée.",
        voix_mobilisees: [],
        figures_dominantes: [],
        echos_actifs: [],
        tensions_ouvertes: [],
        _seed: true,
      })
    ),
    // ── 2026-04-29 — Prophetic echoes (Feature 1, moat philosophique) ─────
    propheticDetect: safeCall(
      async function propheticDetect() {
        return jsonFetch("/api/dream-chat/prophetic/detect", {
          method: "POST",
          body: JSON.stringify({}),
        });
      },
      () => ({ proposed: 0, skipped: 0, _seed: true })
    ),

    propheticEchoes: safeCall(
      async function propheticEchoes({ include_delivered = false, limit = 20 } = {}) {
        const qs = new URLSearchParams();
        if (include_delivered) qs.set("include_delivered", "true");
        if (limit) qs.set("limit", String(limit));
        return jsonFetch("/api/dream-chat/prophetic/echoes?" + qs.toString());
      },
      () => ({ echoes: [], _seed: true })
    ),

    // ── 2026-04-29 — Personal Dictionary (Feature 2, moat épistémique) ────
    personalDictionary: safeCall(
      async function personalDictionary({ kind, include_archived = false, limit = 100, offset = 0 } = {}) {
        const qs = new URLSearchParams();
        if (kind) qs.set("kind", kind);
        if (include_archived) qs.set("include_archived", "true");
        if (limit) qs.set("limit", String(limit));
        if (offset) qs.set("offset", String(offset));
        return jsonFetch("/api/personal-dictionary?" + qs.toString());
      },
      () => ({ symbols: [], _seed: true })
    ),

    personalDictionaryRefresh: safeCall(
      async function personalDictionaryRefresh() {
        return jsonFetch("/api/personal-dictionary/refresh", {
          method: "POST",
          body: JSON.stringify({}),
        });
      },
      () => ({ upserts: 0, _seed: true })
    ),

    personalDictionaryGenerateAngles: safeCall(
      async function personalDictionaryGenerateAngles(symbolId, { force = false } = {}) {
        return jsonFetch("/api/personal-dictionary/" + encodeURIComponent(symbolId) + "/generate-angles", {
          method: "POST",
          body: JSON.stringify({ force }),
        });
      },
      () => ({ paper: "", stone: "", silk: "", evolution: "", _seed: true })
    ),

    personalDictionaryArchive: safeCall(
      async function personalDictionaryArchive(symbolId) {
        return jsonFetch("/api/personal-dictionary/" + encodeURIComponent(symbolId), {
          method: "DELETE",
        });
      },
      () => ({ archived: false, _seed: true })
    ),

    // ── BIG DREAMS WORKFLOW (Feature 3, 2026-04-29) ──
    startBigDreamWorkflow: safeCall(
      async function startBigDreamWorkflow(kairosId) {
        return jsonFetch("/api/bigdream/workflow/start", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId }),
        });
      },
      () => ({ workflow: null, _seed: true })
    ),

    getBigDreamWorkflow: safeCall(
      async function getBigDreamWorkflow(workflowId) {
        return jsonFetch("/api/bigdream/workflow/" + encodeURIComponent(workflowId));
      },
      () => ({ workflow: null, steps: [], kairos: null, _seed: true })
    ),

    completeBigDreamStep: safeCall(
      async function completeBigDreamStep(workflowId, day, { capture_text = null, capture_voice = false } = {}) {
        return jsonFetch(
          "/api/bigdream/workflow/" + encodeURIComponent(workflowId) +
          "/step/" + encodeURIComponent(String(day)) + "/complete",
          {
            method: "POST",
            body: JSON.stringify({ capture_text, capture_voice }),
          }
        );
      },
      () => ({ step: null, current_day: null, _seed: true })
    ),

    generateBigDreamClosingLetter: safeCall(
      async function generateBigDreamClosingLetter(workflowId) {
        return jsonFetch(
          "/api/bigdream/workflow/" + encodeURIComponent(workflowId) + "/closing-letter",
          { method: "POST" }
        );
      },
      () => ({ closing_letter: null, _seed: true })
    ),

    requestBigDreamHumanPush: safeCall(
      async function requestBigDreamHumanPush({ kairos_id = null, workflow_id = null, user_request_text } = {}) {
        return jsonFetch("/api/bigdream/human-push/request", {
          method: "POST",
          body: JSON.stringify({ kairos_id, workflow_id, user_request_text }),
        });
      },
      () => ({ push: null, payment: null, _seed: true })
    ),

    listBigDreamHumanPushes: safeCall(
      async function listBigDreamHumanPushes() {
        return jsonFetch("/api/bigdream/human-push/list");
      },
      () => ({ pushes: [], _seed: true })
    ),

    // ── RECURRING DREAM PATTERNS (Feature 4, 2026-04-29) ──
    detectRecurringPatterns: safeCall(
      async function detectRecurringPatterns() {
        return jsonFetch("/api/dream-chat/recurring/detect", {
          method: "POST",
          body: JSON.stringify({}),
        });
      },
      () => ({ patterns_upserted: 0, pending_created: 0, _seed: true })
    ),

    listRecurringPatterns: safeCall(
      async function listRecurringPatterns() {
        return jsonFetch("/api/dream-chat/recurring");
      },
      () => ({ patterns: [], _seed: true })
    ),

    acknowledgeRecurringPattern: safeCall(
      async function acknowledgeRecurringPattern(patternId) {
        return jsonFetch(
          "/api/dream-chat/recurring/" + encodeURIComponent(patternId) + "/acknowledge",
          { method: "POST" }
        );
      },
      () => ({ pattern: null, suggestion: null, _seed: true })
    ),

    startRecurringReEntry: safeCall(
      async function startRecurringReEntry(patternId, { capture_text = null, capture_method = "text" } = {}) {
        return jsonFetch(
          "/api/dream-chat/recurring/" + encodeURIComponent(patternId) + "/re-entry-session",
          {
            method: "POST",
            body: JSON.stringify({ capture_text, capture_method }),
          }
        );
      },
      () => ({ session: null, guidance: null, exit_to_human: false, _seed: true })
    ),
  };

  window.DreamAPI = DreamAPI;
})();
