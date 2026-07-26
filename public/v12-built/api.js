(function setupDreamAPI() {
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
      try {
        errBody = await res.json();
      } catch (e) {
      }
      const msg = (errBody == null ? void 0 : errBody.error) || `HTTP ${res.status}`;
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
  const SEED = {
    kairos: () => (window.seedEntries || []).map((e, i) => ({
      id: e.id,
      kairos_type: mapTypeToBackend(e.type),
      raw_text: e.text,
      created_at: new Date(Date.now() - i * 24 * 3600 * 1e3).toISOString(),
      numinosity_score: e.numinous ? 0.8 : 0.3,
      synthesis_tier: e.bigDream ? "deep" : "light",
      motif_tags: [],
      archetypal_tags: [],
      user_marked_numinous: !!e.numinous
    })),
    constellation: () => ({
      nodes: (window.portraitNodes || []).map((n) => ({
        id: n.id,
        label: n.label,
        weight: n.weight,
        kind: n.shape === "star" ? "bigdream" : "kairos"
      })),
      edges: []
    }),
    voute: () => ({
      meteo: { top_motifs: [{ motif: "eau", count: 12 }], k_count: 47 },
      polyphonie: null,
      annales_circulating_count: 0,
      meteo_optin_count: 0
    })
  };
  function mapTypeToBackend(t) {
    return {
      dream_night: "reve",
      sidewalk_oracle: "signe",
      daydream_reverie: "reverie",
      hypnagogic: "hypnagogie",
      synchronicity: "synchronicite",
      somatic_shiver: "frisson",
      note_vie: "note"
    }[t] || "reve";
  }
  function mapTypeFromBackend(t) {
    return {
      reve: "dream_night",
      signe: "sidewalk_oracle",
      reverie: "daydream_reverie",
      hypnagogie: "hypnagogic",
      synchronicite: "synchronicity",
      frisson: "somatic_shiver",
      note: "note_vie"
    }[t] || "dream_night";
  }
  function relativeWhen(iso) {
    if (!iso) return "r\xE9cemment";
    const now = Date.now();
    const t = new Date(iso).getTime();
    const dh = (now - t) / 36e5;
    if (dh < 1) return "\xE0 l'instant";
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
        const decorated = (data.kairos || []).map((k) => ({
          ...k,
          when: relativeWhen(k.created_at),
          type: mapTypeFromBackend(k.kairos_type),
          numinous: !!k.user_marked_numinous || (k.numinosity_score || 0) >= 0.7,
          bigDream: k.synthesis_tier === "deep" || (k.numinosity_score || 0) >= 0.85,
          text: k.raw_text || ""
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
        const seed = SEED.kairos().find((k) => k.id === id) || SEED.kairos()[0];
        return { kairos: seed, _seed: true };
      }
    ),
    createKairos: safeCall(
      async function createKairos({ raw_text, kairos_type = "reve", capture_method = "text", mark_numinous = false }) {
        return jsonFetch("/api/kairos", {
          method: "POST",
          body: JSON.stringify({ raw_text, kairos_type, capture_method, mark_numinous })
        });
      },
      ({ raw_text }) => ({
        kairos: {
          id: "local-" + Date.now(),
          raw_text,
          kairos_type: "reve",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          enrichment_status: "offline"
        },
        _seed: true
      })
    ),
    updateKairos: safeCall(
      async function updateKairos(id, patch) {
        return jsonFetch("/api/kairos/" + encodeURIComponent(id), {
          method: "PATCH",
          body: JSON.stringify(patch)
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
          method: "POST"
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
          body: JSON.stringify({ user_first_reading: user_first_reading || null })
        });
      },
      () => ({
        angles: [
          { source: "Aizenstat (Dream Tending)", citation: "Le r\xEAve veut \xEAtre tenu, pas r\xE9solu.", angle: "on pourrait entendre ici l'invitation \xE0 laisser cette image respirer encore.", matter: "paper" },
          { source: "Bachelard (Po\xE9tique de la r\xEAverie)", citation: "L'eau qui h\xE9site est une eau qui pense.", angle: "il semble que ce passage \xE9voque une fluidit\xE9 qui cherche encore son lit.", matter: "stone" },
          { source: "Gendlin (Focusing)", citation: "Le sens vit d'abord dans le corps.", angle: "peut-\xEAtre que ton corps tient d\xE9j\xE0 ce que ton mental n'a pas nomm\xE9.", matter: "silk" }
        ],
        framing: "ces voix ne disent pas ton r\xEAve \u2014 elles le touchent depuis leur angle. ton corps tranche.",
        _seed: true
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
            proposition_voix
          })
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
      async function getVoute() {
        return jsonFetch("/api/anima-mundi/voute");
      },
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
      async function getAnnales() {
        return jsonFetch("/api/anima-mundi/annales");
      },
      () => ({ circulating: [], archived: [], _seed: true })
    ),
    tenirAnnale: safeCall(
      async function tenirAnnale(annales_id) {
        return jsonFetch("/api/anima-mundi/tenir", {
          method: "POST",
          body: JSON.stringify({ annales_id })
        });
      },
      () => ({ _seed: true, ok: true })
    ),
    // ── Cercles ──
    listCircles: safeCall(
      async function listCircles() {
        return jsonFetch("/api/circles");
      },
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
        type,
        // 'spontane' | 'intentionnel' | 'facilite'
        intention_text,
        // libre
        sub_intentions,
        // string[] up to 3
        // 2026-04-28 — Cercles éphémères 21j (T2 Niveau 3)
        ephemeral_days
        // number 1..90 ; null = non-éphémère
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
            ephemeral_days
          })
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
              expires_in_days: opts.expires_in_days
            })
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
          "/api/circles/" + encodeURIComponent(circleId) + "/invitations/" + encodeURIComponent(token),
          { method: "DELETE" }
        );
      },
      () => ({ _seed: true, error: "auth required" })
    ),
    joinCircle: safeCall(
      async function joinCircle({ inviteCode, displayName }) {
        const user = window.DreamUser;
        return jsonFetch("/api/circles/join", {
          method: "POST",
          body: JSON.stringify({ inviteCode, displayName, userId: user == null ? void 0 : user.id })
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
        displayName
      }) {
        return jsonFetch(
          "/api/circles/templates/" + encodeURIComponent(slug) + "/use",
          {
            method: "POST",
            body: JSON.stringify({
              customName,
              customIntention,
              customSubIntentions,
              displayName
            })
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
          body: JSON.stringify({ period_days })
        });
      },
      () => ({ _seed: true, status: "pending" })
    ),
    // 2026-04-25 — Réactions sobres sur restitution polyphonique (3 valeurs)
    submitCircleReaction: safeCall(
      async function submitCircleReaction(circleId, restitutionId, reactionType) {
        return jsonFetch("/api/circles/" + encodeURIComponent(circleId) + "/reactions", {
          method: "POST",
          body: JSON.stringify({ restitution_id: restitutionId, reaction_type: reactionType })
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
        _seed: true
      })
    ),
    // 2026-04-25 — Quitter le cercle (soft : pose left_at)
    leaveCircle: safeCall(
      async function leaveCircle(circleId) {
        return jsonFetch("/api/circles/" + encodeURIComponent(circleId) + "/leave", {
          method: "DELETE"
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
          body: JSON.stringify({ circle_id: circleId, mode, pseudonym })
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
          body: JSON.stringify({ dreamId, top_k })
        });
      },
      () => ({ tales: [], _seed: true })
    ),
    // 2026-04-26 — Conte résonance user (Bible §17.4)
    submitTaleResonance: safeCall(
      async function submitTaleResonance({ tale_id, kairos_id, resonance, user_note }) {
        return jsonFetch("/api/tales/resonance", {
          method: "POST",
          body: JSON.stringify({ tale_id, kairos_id, resonance, user_note })
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
          body: JSON.stringify(data || {})
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
      async function getProtectionState() {
        return jsonFetch("/api/nightmares/protection-state");
      },
      () => ({ state: { nightmare_mode_enabled: false, freeze_until: null, is_frozen: false, _seed: true } })
    ),
    updateProtectionState: safeCall(
      async function updateProtectionState(patch) {
        return jsonFetch("/api/nightmares/protection-state", {
          method: "POST",
          body: JSON.stringify(patch || {})
        });
      },
      () => ({ _seed: true, state: null })
    ),
    enableProtectionFreeze: safeCall(
      async function enableProtectionFreeze({ days = 30, is_crisis = false } = {}) {
        return jsonFetch("/api/nightmares/enable-freeze", {
          method: "POST",
          body: JSON.stringify({ days, is_crisis })
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
          body: JSON.stringify({ kairos_id, is_nightmare, is_grief_related, grief_who })
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
          body: JSON.stringify({ dream_id: dream_id || null, raw_text: raw_text || null })
        });
      },
      () => ({ status: "ok", reading: null, framing: null, _seed: true })
    ),
    // 2026-04-28 §11.bis.20.12 — lecture polyphonique 3 voix corps
    bodyOracleReading: safeCall(
      async function bodyOracleReading(payload = {}) {
        return jsonFetch("/api/oracle-corps/reading", {
          method: "POST",
          body: JSON.stringify(payload || {})
        });
      },
      () => ({ reading: null, framing: null, _seed: true })
    ),
    // ── Chat narratrice (SSE) ──
    // Returns { reader, decoder } — caller pulls chunks
    async chatStream({ messages, mode = "dream", dreamId = null, locale = "fr" }) {
      var _a, _b, _c;
      const token = await (((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a)) || Promise.resolve(null));
      if (!token && !((_c = window.DreamAuth) == null ? void 0 : _c.noAuth)) throw new Error("Auth required for chat");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...token ? { Authorization: "Bearer " + token } : {}
        },
        body: JSON.stringify({ messages, mode, dreamId, locale })
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
          buffer = parts.pop();
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
        const user = window.DreamUser;
        if (user == null ? void 0 : user.id) fd.append("userId", user.id);
        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: await authHeaders(),
          body: fd
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error((errBody == null ? void 0 : errBody.error) || "HTTP " + res.status);
        }
        return res.json();
      },
      () => ({ text: "", _seed: true, error: "transcribe unavailable" })
    ),
    // ── User personal layer ──
    listMeanings: safeCall(
      async function listMeanings() {
        return jsonFetch("/api/user/meaning");
      },
      () => ({ meanings: [], _seed: true })
    ),
    setMeaning: safeCall(
      async function setMeaning({ symbol_concept, user_meaning, weight = 1, context_lang = "fr", source = null }) {
        return jsonFetch("/api/user/meaning", {
          method: "POST",
          body: JSON.stringify({ symbol_concept, user_meaning, weight, context_lang, source })
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
          body: JSON.stringify({ context_type, context_id, validation, proposition_voix, user_note })
        });
      },
      () => ({ _seed: true })
    ),
    annotateKairos: safeCall(
      async function annotateKairos(kairos_id, annotation_text, marker_position = null) {
        return jsonFetch("/api/user/annotate", {
          method: "POST",
          body: JSON.stringify({ kairos_id, annotation_text, marker_position })
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
          body: JSON.stringify({ context_type, context_id, feedback_text, severity, user_email })
        });
      },
      () => ({ _seed: true })
    ),
    // ── Journal de Vie LUMINEUX (révélation Tim 2026-04-25) ──
    createJournalEntry: safeCall(
      async function createJournalEntry({ raw_text, voice_url = null, linked_kairos_id = null }) {
        return jsonFetch("/api/journal/entries", {
          method: "POST",
          body: JSON.stringify({ raw_text, voice_url, linked_kairos_id })
        });
      },
      ({ raw_text }) => ({ entry: { id: "local-" + Date.now(), raw_text, created_at: (/* @__PURE__ */ new Date()).toISOString() }, _seed: true })
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
          { category: "travail", label: "travail & vocation", glyph: "\u25C7", count: 0 },
          { category: "relations", label: "relations", glyph: "\u25CB", count: 0, sub_categories: [] },
          { category: "corps_sante", label: "corps & sant\xE9", glyph: "\u25D0", count: 0 },
          { category: "passions", label: "passions & cr\xE9ation", glyph: "\u2736", count: 0 },
          { category: "argent", label: "argent & mat\xE9riel", glyph: "\u232C", count: 0 },
          { category: "spiritualite", label: "spiritualit\xE9 & sens", glyph: "\u2609", count: 0 },
          { category: "transitions", label: "transitions & seuils", glyph: "\u2312", count: 0 }
        ],
        _seed: true
      })
    ),
    summonKairosWisdom: safeCall(
      async function summonKairosWisdom({ entry_id = null, category = null, sub_category = null }) {
        return jsonFetch("/api/journal/summon-kairos-wisdom", {
          method: "POST",
          body: JSON.stringify({ entry_id, category, sub_category })
        });
      },
      () => ({
        polyphony_text: "Cette voix viendra quand l'app sera connect\xE9e. En mode d\xE9mo, la sagesse dort.",
        voices_mobilisees: [],
        resonant_kairos: [],
        _seed: true
      })
    ),
    submitWisdomFeedback: safeCall(
      async function submitWisdomFeedback(summon_id, { felt_shift_location, aha_level, aha_note }) {
        return jsonFetch("/api/journal/summons/" + encodeURIComponent(summon_id), {
          method: "PATCH",
          body: JSON.stringify({ felt_shift_location, aha_level, aha_note })
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
          enabled: false,
          experience_level: null,
          preferred_technique: null,
          ui_mode: "dark_mono",
          obsidian_export_enabled: false,
          total_lucid_dreams: 0,
          total_dreams_recalled: 0,
          current_streak_lucid_per_week: 0,
          best_streak: 0,
          _exists: false,
          _seed: true
        }
      })
    ),
    updateLucidProfile: safeCall(
      async function updateLucidProfile(patch) {
        return jsonFetch("/api/lucid/profile", {
          method: "POST",
          body: JSON.stringify(patch || {})
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
          body: JSON.stringify(data || {})
        });
      },
      () => ({ _seed: true, reality_check: null })
    ),
    updateRealityCheck: safeCall(
      async function updateRealityCheck(id, patch) {
        return jsonFetch("/api/lucid/reality-checks/" + encodeURIComponent(id), {
          method: "PATCH",
          body: JSON.stringify(patch || {})
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
          body: JSON.stringify({ sign_label: label, sign_category: category || null })
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
          body: JSON.stringify(patch || {})
        });
      },
      () => ({ _seed: true, dream_sign: null })
    ),
    attachLucidMetadata: safeCall(
      async function attachLucidMetadata(kairosId, data) {
        return jsonFetch("/api/lucid/kairos-metadata", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId, ...data || {} })
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
          body: JSON.stringify(data || {})
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
          body: JSON.stringify(patch || {})
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
          total_dreams: 0,
          total_lucid_dreams: 0,
          recall_rate_pct: 0,
          current_streak_per_week: 0,
          best_streak_in_7d_window: 0,
          signs_count: 0,
          top_signs: [],
          recent_lucid_per_day: [],
          technique_breakdown: {}
        },
        _seed: true
      })
    ),
    extractDreamSigns: safeCall(
      async function extractDreamSigns(kairosId) {
        return jsonFetch("/api/lucid/extract-dream-signs", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId })
        });
      },
      () => ({ dream_signs: [], _seed: true })
    ),
    exportObsidian: safeCall(
      async function exportObsidian() {
        var _a, _b;
        const token = await (((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a)) || Promise.resolve(null));
        const res = await fetch("/api/lucid/export-obsidian", {
          headers: token ? { Authorization: "Bearer " + token } : {}
        });
        if (!res.ok) throw new Error("export failed: " + res.status);
        return res.text();
      },
      () => "# (offline) \u2014 no export available\n"
    ),
    // ── Lucid V1 — routes nouvelles 2026-04-28 (Yeshua) ─────────
    detectLucidMarkers: safeCall(
      async function detectLucidMarkers({ kairos_id, raw_text, persist = false } = {}) {
        return jsonFetch("/api/lucid/detect-markers", {
          method: "POST",
          body: JSON.stringify({ kairos_id, raw_text, persist })
        });
      },
      () => ({ markers: { is_lucid: false, confidence: 0, signals: [] }, _seed: true })
    ),
    suggestDreamSigns: safeCall(
      async function suggestDreamSigns() {
        return jsonFetch("/api/lucid/dream-signs-suggest", {
          method: "POST",
          body: JSON.stringify({})
        });
      },
      () => ({ suggestions: [], _seed: true })
    ),
    getLucidPracticeLetter: safeCall(
      async function getLucidPracticeLetter({ force = false } = {}) {
        return jsonFetch("/api/lucid/practice-letter", {
          method: "POST",
          body: JSON.stringify({ force })
        });
      },
      () => ({
        letter: "Mode d\xE9mo : la lettre de ta pratique appara\xEEtra ici quand l'app sera connect\xE9e.",
        cached: false,
        word_count: 14,
        _seed: true
      })
    ),
    logRealityCheckTick: safeCall(
      async function logRealityCheckTick({ rc_id, result, triggered_kairos_id, notes } = {}) {
        return jsonFetch("/api/lucid/reality-check-tick", {
          method: "POST",
          body: JSON.stringify({ rc_id, result, triggered_kairos_id, notes })
        });
      },
      () => ({ _seed: true, ok: true })
    ),
    setWBTBIntention: safeCall(
      async function setWBTBIntention({ alarm_id, intention, sound_profile } = {}) {
        return jsonFetch("/api/lucid/wbtb-intention", {
          method: "POST",
          body: JSON.stringify({ alarm_id, intention, sound_profile })
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
          body: JSON.stringify(data || {})
        });
      },
      () => ({ _seed: true, session: null })
    ),
    submitLucidOnboarding: safeCall(
      async function submitLucidOnboarding(data) {
        return jsonFetch("/api/lucid/onboarding", {
          method: "POST",
          body: JSON.stringify(data || {})
        });
      },
      () => ({ _seed: true, gateway_unlocked: false })
    ),
    exportLucidJournal: safeCall(
      async function exportLucidJournal({ format = "markdown" } = {}) {
        var _a, _b;
        const token = await (((_b = (_a = window.DreamAuth) == null ? void 0 : _a.getAccessToken) == null ? void 0 : _b.call(_a)) || Promise.resolve(null));
        const res = await fetch("/api/lucid/export?format=" + encodeURIComponent(format), {
          headers: token ? { Authorization: "Bearer " + token } : {}
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
          body: JSON.stringify({ kairos_id: kairosId })
        });
      },
      () => ({ voices: [], _seed: true })
    ),
    checkNightmareDetour: safeCall(
      async function checkNightmareDetour({ kairos_id, valence, intention_was_to_resolve } = {}) {
        return jsonFetch("/api/lucid/nightmare-detour", {
          method: "POST",
          body: JSON.stringify({ kairos_id, valence, intention_was_to_resolve })
        });
      },
      () => ({ detour_required: false, _seed: true })
    ),
    // ── Portrait narrative (refonte 2026-04-25) ──
    getPortraitNarrative: safeCall(
      async function getPortraitNarrative({ toggle = "crossed", period = "lune", force = false } = {}) {
        return jsonFetch("/api/portrait/narrative-reading", {
          method: "POST",
          body: JSON.stringify({ toggle, period, force })
        });
      },
      ({ toggle = "crossed" } = {}) => ({
        lettre: toggle === "day" ? "Mode d\xE9mo : ta vie de jour respire en silence ici." : toggle === "night" ? "Mode d\xE9mo : la nuit dort encore dans ce sol." : "Mode d\xE9mo : les deux mondes se croiseront quand l'app sera connect\xE9e.",
        voix_mobilisees: [],
        figures_dominantes: [],
        echos_actifs: [],
        tensions_ouvertes: [],
        _seed: true
      })
    ),
    // ── 2026-04-29 — Prophetic echoes (Feature 1, moat philosophique) ─────
    propheticDetect: safeCall(
      async function propheticDetect() {
        return jsonFetch("/api/dream-chat/prophetic/detect", {
          method: "POST",
          body: JSON.stringify({})
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
          body: JSON.stringify({})
        });
      },
      () => ({ upserts: 0, _seed: true })
    ),
    personalDictionaryGenerateAngles: safeCall(
      async function personalDictionaryGenerateAngles(symbolId, { force = false } = {}) {
        return jsonFetch("/api/personal-dictionary/" + encodeURIComponent(symbolId) + "/generate-angles", {
          method: "POST",
          body: JSON.stringify({ force })
        });
      },
      () => ({ paper: "", stone: "", silk: "", evolution: "", _seed: true })
    ),
    personalDictionaryArchive: safeCall(
      async function personalDictionaryArchive(symbolId) {
        return jsonFetch("/api/personal-dictionary/" + encodeURIComponent(symbolId), {
          method: "DELETE"
        });
      },
      () => ({ archived: false, _seed: true })
    ),
    // ── BIG DREAMS WORKFLOW (Feature 3, 2026-04-29) ──
    startBigDreamWorkflow: safeCall(
      async function startBigDreamWorkflow(kairosId) {
        return jsonFetch("/api/bigdream/workflow/start", {
          method: "POST",
          body: JSON.stringify({ kairos_id: kairosId })
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
          "/api/bigdream/workflow/" + encodeURIComponent(workflowId) + "/step/" + encodeURIComponent(String(day)) + "/complete",
          {
            method: "POST",
            body: JSON.stringify({ capture_text, capture_voice })
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
          body: JSON.stringify({ kairos_id, workflow_id, user_request_text })
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
          body: JSON.stringify({})
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
            body: JSON.stringify({ capture_text, capture_method })
          }
        );
      },
      () => ({ session: null, guidance: null, exit_to_human: false, _seed: true })
    )
  };
  window.DreamAPI = DreamAPI;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBpLmpzeCJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyogZ2xvYmFsIHdpbmRvdyAqL1xuLy8gXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4vLyBEcmVhbSBWMS4yIFx1MjAxNCBEcmVhbUFQSSBtb2R1bGUgKGlmcmFtZSBcdTIxOTIgTmV4dC5qcyAvYXBpLyopXG4vLyAyMDI2LTA0LTI1IFx1MjAxNCBZZXNodWFcbi8vXG4vLyBXcmFwcyBldmVyeSBmZXRjaCB3aXRoIEJlYXJlciBhdXRoIGZyb20gd2luZG93LkRyZWFtQXV0aC5cbi8vIEVhY2ggbWV0aG9kIHJldHVybnMgcGFyc2VkIEpTT04gb3IgdGhyb3dzLlxuLy8gRWFjaCBtZXRob2QgaGFzIGEgKl9zZWVkIGZhbGxiYWNrIGluIGNhc2Ugb2YgZXJyb3Ivbm8tYXV0aCAodG8ga2VlcFxuLy8gdGhlIFYxLjIgdmlzdWFsIGRlbW8gd29ya2luZyBldmVuIHdpdGhvdXQgYmFja2VuZCkuXG4vLyBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcblxuKGZ1bmN0aW9uIHNldHVwRHJlYW1BUEkoKSB7XG4gIC8vIFx1MjUwMFx1MjUwMCBIZWxwZXJzIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICBhc3luYyBmdW5jdGlvbiBhdXRoSGVhZGVycyhleHRyYSA9IHt9KSB7XG4gICAgY29uc3QgaGVhZGVycyA9IHsgLi4uZXh0cmEgfTtcbiAgICBpZiAod2luZG93LkRyZWFtQXV0aCAmJiAhd2luZG93LkRyZWFtQXV0aC5ub0F1dGgpIHtcbiAgICAgIGNvbnN0IHRva2VuID0gYXdhaXQgd2luZG93LkRyZWFtQXV0aC5nZXRBY2Nlc3NUb2tlbigpO1xuICAgICAgaWYgKHRva2VuKSBoZWFkZXJzW1wiQXV0aG9yaXphdGlvblwiXSA9IFwiQmVhcmVyIFwiICsgdG9rZW47XG4gICAgfVxuICAgIHJldHVybiBoZWFkZXJzO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24ganNvbkZldGNoKHVybCwgb3B0cyA9IHt9KSB7XG4gICAgY29uc3QgZmluYWxPcHRzID0geyAuLi5vcHRzIH07XG4gICAgY29uc3QgYmFzZUhlYWRlcnMgPSBvcHRzLmhlYWRlcnMgfHwge307XG4gICAgY29uc3QgYXV0aCA9IGF3YWl0IGF1dGhIZWFkZXJzKGJhc2VIZWFkZXJzKTtcbiAgICBpZiAob3B0cy5ib2R5ICYmICEob3B0cy5ib2R5IGluc3RhbmNlb2YgRm9ybURhdGEpICYmICFhdXRoW1wiQ29udGVudC1UeXBlXCJdKSB7XG4gICAgICBhdXRoW1wiQ29udGVudC1UeXBlXCJdID0gXCJhcHBsaWNhdGlvbi9qc29uXCI7XG4gICAgfVxuICAgIGZpbmFsT3B0cy5oZWFkZXJzID0gYXV0aDtcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCh1cmwsIGZpbmFsT3B0cyk7XG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIGxldCBlcnJCb2R5ID0gbnVsbDtcbiAgICAgIHRyeSB7IGVyckJvZHkgPSBhd2FpdCByZXMuanNvbigpOyB9IGNhdGNoIHt9XG4gICAgICBjb25zdCBtc2cgPSBlcnJCb2R5Py5lcnJvciB8fCBgSFRUUCAke3Jlcy5zdGF0dXN9YDtcbiAgICAgIGNvbnN0IGVyciA9IG5ldyBFcnJvcihtc2cpO1xuICAgICAgZXJyLnN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICBlcnIuYm9keSA9IGVyckJvZHk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgIHJldHVybiByZXMuanNvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2FmZUNhbGwoZm4sIGZhbGxiYWNrKSB7XG4gICAgcmV0dXJuIGFzeW5jICguLi5hcmdzKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gYXdhaXQgZm4oLi4uYXJncyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIltEcmVhbUFQSV0gXCIgKyBmbi5uYW1lICsgXCIgZmFpbGVkOlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICBpZiAodHlwZW9mIGZhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgU2VlZCBmYWxsYmFja3MgKG9ubHkgdXNlZCB3aGVuIEFQSSBkb3duIC8gbm8gYXV0aCkgXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXHUyNTAwXG4gIC8vIEtlZXAgVjEuMiB2aXN1YWwgY29oZXJlbnQgaW4gZGVncmFkZWQgbW9kZS5cbiAgY29uc3QgU0VFRCA9IHtcbiAgICBrYWlyb3M6ICgpID0+ICh3aW5kb3cuc2VlZEVudHJpZXMgfHwgW10pLm1hcCgoZSwgaSkgPT4gKHtcbiAgICAgIGlkOiBlLmlkLFxuICAgICAga2Fpcm9zX3R5cGU6IG1hcFR5cGVUb0JhY2tlbmQoZS50eXBlKSxcbiAgICAgIHJhd190ZXh0OiBlLnRleHQsXG4gICAgICBjcmVhdGVkX2F0OiBuZXcgRGF0ZShEYXRlLm5vdygpIC0gaSAqIDI0ICogMzYwMCAqIDEwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICBudW1pbm9zaXR5X3Njb3JlOiBlLm51bWlub3VzID8gMC44IDogMC4zLFxuICAgICAgc3ludGhlc2lzX3RpZXI6IGUuYmlnRHJlYW0gPyBcImRlZXBcIiA6IFwibGlnaHRcIixcbiAgICAgIG1vdGlmX3RhZ3M6IFtdLFxuICAgICAgYXJjaGV0eXBhbF90YWdzOiBbXSxcbiAgICAgIHVzZXJfbWFya2VkX251bWlub3VzOiAhIWUubnVtaW5vdXMsXG4gICAgfSkpLFxuICAgIGNvbnN0ZWxsYXRpb246ICgpID0+ICh7XG4gICAgICBub2RlczogKHdpbmRvdy5wb3J0cmFpdE5vZGVzIHx8IFtdKS5tYXAobiA9PiAoe1xuICAgICAgICBpZDogbi5pZCxcbiAgICAgICAgbGFiZWw6IG4ubGFiZWwsXG4gICAgICAgIHdlaWdodDogbi53ZWlnaHQsXG4gICAgICAgIGtpbmQ6IG4uc2hhcGUgPT09IFwic3RhclwiID8gXCJiaWdkcmVhbVwiIDogXCJrYWlyb3NcIixcbiAgICAgIH0pKSxcbiAgICAgIGVkZ2VzOiBbXSxcbiAgICB9KSxcbiAgICB2b3V0ZTogKCkgPT4gKHtcbiAgICAgIG1ldGVvOiB7IHRvcF9tb3RpZnM6IFt7IG1vdGlmOiBcImVhdVwiLCBjb3VudDogMTIgfV0sIGtfY291bnQ6IDQ3IH0sXG4gICAgICBwb2x5cGhvbmllOiBudWxsLFxuICAgICAgYW5uYWxlc19jaXJjdWxhdGluZ19jb3VudDogMCxcbiAgICAgIG1ldGVvX29wdGluX2NvdW50OiAwLFxuICAgIH0pLFxuICB9O1xuXG4gIC8vIE1hcCBWMS4yIHR5cGUgc3RyaW5ncyB0byBiYWNrZW5kIGthaXJvc190eXBlIGVudW1cbiAgZnVuY3Rpb24gbWFwVHlwZVRvQmFja2VuZCh0KSB7XG4gICAgcmV0dXJuICh7XG4gICAgICBkcmVhbV9uaWdodDogXCJyZXZlXCIsXG4gICAgICBzaWRld2Fsa19vcmFjbGU6IFwic2lnbmVcIixcbiAgICAgIGRheWRyZWFtX3JldmVyaWU6IFwicmV2ZXJpZVwiLFxuICAgICAgaHlwbmFnb2dpYzogXCJoeXBuYWdvZ2llXCIsXG4gICAgICBzeW5jaHJvbmljaXR5OiBcInN5bmNocm9uaWNpdGVcIixcbiAgICAgIHNvbWF0aWNfc2hpdmVyOiBcImZyaXNzb25cIixcbiAgICAgIG5vdGVfdmllOiBcIm5vdGVcIixcbiAgICB9KVt0XSB8fCBcInJldmVcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1hcFR5cGVGcm9tQmFja2VuZCh0KSB7XG4gICAgcmV0dXJuICh7XG4gICAgICByZXZlOiBcImRyZWFtX25pZ2h0XCIsXG4gICAgICBzaWduZTogXCJzaWRld2Fsa19vcmFjbGVcIixcbiAgICAgIHJldmVyaWU6IFwiZGF5ZHJlYW1fcmV2ZXJpZVwiLFxuICAgICAgaHlwbmFnb2dpZTogXCJoeXBuYWdvZ2ljXCIsXG4gICAgICBzeW5jaHJvbmljaXRlOiBcInN5bmNocm9uaWNpdHlcIixcbiAgICAgIGZyaXNzb246IFwic29tYXRpY19zaGl2ZXJcIixcbiAgICAgIG5vdGU6IFwibm90ZV92aWVcIixcbiAgICB9KVt0XSB8fCBcImRyZWFtX25pZ2h0XCI7XG4gIH1cblxuICBmdW5jdGlvbiByZWxhdGl2ZVdoZW4oaXNvKSB7XG4gICAgaWYgKCFpc28pIHJldHVybiBcInJcdTAwRTljZW1tZW50XCI7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCB0ID0gbmV3IERhdGUoaXNvKS5nZXRUaW1lKCk7XG4gICAgY29uc3QgZGggPSAobm93IC0gdCkgLyAzNjAwMDAwO1xuICAgIGlmIChkaCA8IDEpIHJldHVybiBcIlx1MDBFMCBsJ2luc3RhbnRcIjtcbiAgICBpZiAoZGggPCAxMikgcmV0dXJuIFwiY2UgbWF0aW5cIjtcbiAgICBpZiAoZGggPCAyNCkgcmV0dXJuIFwiYXVqb3VyZCdodWlcIjtcbiAgICBpZiAoZGggPCAzNikgcmV0dXJuIFwiaGllciBzb2lyXCI7XG4gICAgaWYgKGRoIDwgNDgpIHJldHVybiBcImhpZXJcIjtcbiAgICBpZiAoZGggPCAyNCAqIDcpIHJldHVybiBcImlsIHkgYSBcIiArIE1hdGguZmxvb3IoZGggLyAyNCkgKyBcIiBqb3Vyc1wiO1xuICAgIGlmIChkaCA8IDI0ICogMzApIHJldHVybiBcImlsIHkgYSBcIiArIE1hdGguZmxvb3IoZGggLyAoMjQgKiA3KSkgKyBcIiBzZW1haW5lKHMpXCI7XG4gICAgaWYgKGRoIDwgMjQgKiA2MCkgcmV0dXJuIFwiaWwgeSBhIHVuZSBsdW5lXCI7XG4gICAgaWYgKGRoIDwgMjQgKiA5MCkgcmV0dXJuIFwiaWwgeSBhIGRldXggbHVuZXNcIjtcbiAgICByZXR1cm4gXCJpbCB5IGEgcGx1c2lldXJzIGx1bmVzXCI7XG4gIH1cblxuICAvLyBcdTI1MDBcdTI1MDAgRHJlYW1BUEkgKHB1YmxpYyBzdXJmYWNlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgY29uc3QgRHJlYW1BUEkgPSB7XG4gICAgLy8gSW50ZXJuYWwgaGVscGVycyBleHBvc2VkIGZvciBzY3JlZW4tc2lkZSB1c2VcbiAgICBfbWFwVHlwZVRvQmFja2VuZDogbWFwVHlwZVRvQmFja2VuZCxcbiAgICBfbWFwVHlwZUZyb21CYWNrZW5kOiBtYXBUeXBlRnJvbUJhY2tlbmQsXG4gICAgX3JlbGF0aXZlV2hlbjogcmVsYXRpdmVXaGVuLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEthaXJvcyBcdTI1MDBcdTI1MDBcbiAgICBsaXN0S2Fpcm9zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RLYWlyb3MoeyBsaW1pdCA9IDUwLCBrYWlyb3NfdHlwZSA9IG51bGwsIG51bWlub3VzX29ubHkgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KFwibGltaXRcIiwgU3RyaW5nKGxpbWl0KSk7XG4gICAgICAgIGlmIChrYWlyb3NfdHlwZSkgcGFyYW1zLnNldChcImthaXJvc190eXBlXCIsIGthaXJvc190eXBlKTtcbiAgICAgICAgaWYgKG51bWlub3VzX29ubHkpIHBhcmFtcy5zZXQoXCJudW1pbm91c19vbmx5XCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGpzb25GZXRjaChcIi9hcGkva2Fpcm9zP1wiICsgcGFyYW1zLnRvU3RyaW5nKCkpO1xuICAgICAgICAvLyBEZWNvcmF0ZSB3aXRoIFYxLjItZnJpZW5kbHkgZmllbGRzXG4gICAgICAgIGNvbnN0IGRlY29yYXRlZCA9IChkYXRhLmthaXJvcyB8fCBbXSkubWFwKGsgPT4gKHtcbiAgICAgICAgICAuLi5rLFxuICAgICAgICAgIHdoZW46IHJlbGF0aXZlV2hlbihrLmNyZWF0ZWRfYXQpLFxuICAgICAgICAgIHR5cGU6IG1hcFR5cGVGcm9tQmFja2VuZChrLmthaXJvc190eXBlKSxcbiAgICAgICAgICBudW1pbm91czogISFrLnVzZXJfbWFya2VkX251bWlub3VzIHx8IChrLm51bWlub3NpdHlfc2NvcmUgfHwgMCkgPj0gMC43LFxuICAgICAgICAgIGJpZ0RyZWFtOiBrLnN5bnRoZXNpc190aWVyID09PSBcImRlZXBcIiB8fCAoay5udW1pbm9zaXR5X3Njb3JlIHx8IDApID49IDAuODUsXG4gICAgICAgICAgdGV4dDogay5yYXdfdGV4dCB8fCBcIlwiLFxuICAgICAgICB9KSk7XG4gICAgICAgIHJldHVybiB7IC4uLmRhdGEsIGthaXJvczogZGVjb3JhdGVkIH07XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsga2Fpcm9zOiBTRUVELmthaXJvcygpLCB0b3RhbDogU0VFRC5rYWlyb3MoKS5sZW5ndGgsIG5leHRfY3Vyc29yOiBudWxsLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBnZXRLYWlyb3M6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0S2Fpcm9zKGlkKSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCBqc29uRmV0Y2goXCIvYXBpL2thaXJvcy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChpZCkpO1xuICAgICAgICBjb25zdCBrID0gZGF0YS5rYWlyb3M7XG4gICAgICAgIGlmIChrKSB7XG4gICAgICAgICAgay53aGVuID0gcmVsYXRpdmVXaGVuKGsuY3JlYXRlZF9hdCk7XG4gICAgICAgICAgay50eXBlID0gbWFwVHlwZUZyb21CYWNrZW5kKGsua2Fpcm9zX3R5cGUpO1xuICAgICAgICAgIGsubnVtaW5vdXMgPSAhIWsudXNlcl9tYXJrZWRfbnVtaW5vdXMgfHwgKGsubnVtaW5vc2l0eV9zY29yZSB8fCAwKSA+PSAwLjc7XG4gICAgICAgICAgay5iaWdEcmVhbSA9IGsuc3ludGhlc2lzX3RpZXIgPT09IFwiZGVlcFwiIHx8IChrLm51bWlub3NpdHlfc2NvcmUgfHwgMCkgPj0gMC44NTtcbiAgICAgICAgICBrLnRleHQgPSBrLnJhd190ZXh0IHx8IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9LFxuICAgICAgKGlkKSA9PiB7XG4gICAgICAgIGNvbnN0IHNlZWQgPSBTRUVELmthaXJvcygpLmZpbmQoayA9PiBrLmlkID09PSBpZCkgfHwgU0VFRC5rYWlyb3MoKVswXTtcbiAgICAgICAgcmV0dXJuIHsga2Fpcm9zOiBzZWVkLCBfc2VlZDogdHJ1ZSB9O1xuICAgICAgfVxuICAgICksXG5cbiAgICBjcmVhdGVLYWlyb3M6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gY3JlYXRlS2Fpcm9zKHsgcmF3X3RleHQsIGthaXJvc190eXBlID0gXCJyZXZlXCIsIGNhcHR1cmVfbWV0aG9kID0gXCJ0ZXh0XCIsIG1hcmtfbnVtaW5vdXMgPSBmYWxzZSB9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2thaXJvc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHJhd190ZXh0LCBrYWlyb3NfdHlwZSwgY2FwdHVyZV9tZXRob2QsIG1hcmtfbnVtaW5vdXMgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICh7IHJhd190ZXh0IH0pID0+ICh7XG4gICAgICAgIGthaXJvczoge1xuICAgICAgICAgIGlkOiBcImxvY2FsLVwiICsgRGF0ZS5ub3coKSxcbiAgICAgICAgICByYXdfdGV4dCxcbiAgICAgICAgICBrYWlyb3NfdHlwZTogXCJyZXZlXCIsXG4gICAgICAgICAgY3JlYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgIGVucmljaG1lbnRfc3RhdHVzOiBcIm9mZmxpbmVcIixcbiAgICAgICAgfSxcbiAgICAgICAgX3NlZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICksXG5cbiAgICB1cGRhdGVLYWlyb3M6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlS2Fpcm9zKGlkLCBwYXRjaCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9rYWlyb3MvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF0Y2gpLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgZGVsZXRlS2Fpcm9zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZUthaXJvcyhpZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9rYWlyb3MvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7IG1ldGhvZDogXCJERUxFVEVcIiB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIFx1MDBDOWNob3MgXHUyNTAwXHUyNTAwXG4gICAgbGlzdEVjaG9lc0dsb2JhbDogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0RWNob2VzR2xvYmFsKHsgc3ludGhlc2lzID0gZmFsc2UsIGxvY2FsZSA9IFwiZnJcIiB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBpZiAoc3ludGhlc2lzKSBwYXJhbXMuc2V0KFwic3ludGhlc2lzXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgcGFyYW1zLnNldChcImxvY2FsZVwiLCBsb2NhbGUpO1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9lY2hvZXM/XCIgKyBwYXJhbXMudG9TdHJpbmcoKSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgZWNob2VzOiBbXSwgc3ludGhlc2lzOiBudWxsLCBzdGF0czoge30sIGNvcnJlc3BvbmRlbmNlczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGdldEVjaG9lc0ZvckthaXJvczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRFY2hvZXNGb3JLYWlyb3Moa2Fpcm9zSWQsIG9wdHMgPSB7fSkge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIGlmIChvcHRzLmxpbWl0KSBwYXJhbXMuc2V0KFwibGltaXRcIiwgU3RyaW5nKG9wdHMubGltaXQpKTtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkva2Fpcm9zL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KGthaXJvc0lkKSArIFwiL2VjaG9lcz9cIiArIHBhcmFtcy50b1N0cmluZygpKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBlY2hvZXM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBnZXRQcm9waGVjeUZvckthaXJvczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRQcm9waGVjeUZvckthaXJvcyhrYWlyb3NJZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9rYWlyb3MvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoa2Fpcm9zSWQpICsgXCIvcHJvcGhldGljXCIpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHByb3BoZXRpZXM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBTcHJpbnQgUDEgKDIwMjYtMDQtMjcpIFx1MjAxNCBjaHVjaG90ZW1lbnQgRHJlYW1Ib21lIHF1YW5kIHVuIFx1MDBFOWNobyBtXHUwMEZCcml0LlxuICAgIC8vIFJldG91cm5lIGF1IG1heCAxIFx1MDBFOWNobyBwcm9waFx1MDBFOXRpcXVlICdhd2FrZW5lZCcgamFtYWlzIG5vdGlmaVx1MDBFOS5cbiAgICAvLyBTaWRlLWVmZmVjdCBzZXJ2ZXVyIDogbWFycXVlIG5vdGlmaWVkX2F0IFx1MDBFMCBub3coKSAoaWRlbXBvdGVudCkuXG4gICAgZ2V0TWF0dXJlZFByb3BoZXRpY0VjaG9lczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRNYXR1cmVkUHJvcGhldGljRWNob2VzKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9lY2hvZXMvcHJvcGhldGljL21hdHVyZWRcIik7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgZWNob2VzOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gU3ByaW50IFAxICgyMDI2LTA0LTI3KSBcdTIwMTQgdXNlciBkaXNtaXNzIGV4cGxpY2l0IGR1IGNodWNob3RlbWVudC5cbiAgICBkaXNtaXNzUHJvcGhldGljRWNobzogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBkaXNtaXNzUHJvcGhldGljRWNobyhrYWlyb3NJZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9lY2hvZXMvcHJvcGhldGljL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KGthaXJvc0lkKSArIFwiL2Rpc21pc3NcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBvazogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgS2Fpcm9zRGV0YWlsIHJlZm9udGUgMjAyNi0wNC0yNSBcdTI1MDBcdTI1MDBcbiAgICAvLyBGb3JcdTAwRUF0IGVuIGRldXhpXHUwMEU4bWUgdGVtcHMgXHUyMDE0IEFQUlx1MDBDOFMgdXNlcl9maXJzdF9yZWFkaW5nLlxuICAgIGZvcmVzdFJlYWRpbmc6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZm9yZXN0UmVhZGluZyhrYWlyb3NJZCwgeyB1c2VyX2ZpcnN0X3JlYWRpbmcgfSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2thaXJvcy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChrYWlyb3NJZCkgKyBcIi9mb3Jlc3QtcmVhZGluZ1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHVzZXJfZmlyc3RfcmVhZGluZzogdXNlcl9maXJzdF9yZWFkaW5nIHx8IG51bGwgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7XG4gICAgICAgIGFuZ2xlczogW1xuICAgICAgICAgIHsgc291cmNlOiBcIkFpemVuc3RhdCAoRHJlYW0gVGVuZGluZylcIiwgY2l0YXRpb246IFwiTGUgclx1MDBFQXZlIHZldXQgXHUwMEVBdHJlIHRlbnUsIHBhcyByXHUwMEU5c29sdS5cIiwgYW5nbGU6IFwib24gcG91cnJhaXQgZW50ZW5kcmUgaWNpIGwnaW52aXRhdGlvbiBcdTAwRTAgbGFpc3NlciBjZXR0ZSBpbWFnZSByZXNwaXJlciBlbmNvcmUuXCIsIG1hdHRlcjogXCJwYXBlclwiIH0sXG4gICAgICAgICAgeyBzb3VyY2U6IFwiQmFjaGVsYXJkIChQb1x1MDBFOXRpcXVlIGRlIGxhIHJcdTAwRUF2ZXJpZSlcIiwgY2l0YXRpb246IFwiTCdlYXUgcXVpIGhcdTAwRTlzaXRlIGVzdCB1bmUgZWF1IHF1aSBwZW5zZS5cIiwgYW5nbGU6IFwiaWwgc2VtYmxlIHF1ZSBjZSBwYXNzYWdlIFx1MDBFOXZvcXVlIHVuZSBmbHVpZGl0XHUwMEU5IHF1aSBjaGVyY2hlIGVuY29yZSBzb24gbGl0LlwiLCBtYXR0ZXI6IFwic3RvbmVcIiB9LFxuICAgICAgICAgIHsgc291cmNlOiBcIkdlbmRsaW4gKEZvY3VzaW5nKVwiLCBjaXRhdGlvbjogXCJMZSBzZW5zIHZpdCBkJ2Fib3JkIGRhbnMgbGUgY29ycHMuXCIsIGFuZ2xlOiBcInBldXQtXHUwMEVBdHJlIHF1ZSB0b24gY29ycHMgdGllbnQgZFx1MDBFOWpcdTAwRTAgY2UgcXVlIHRvbiBtZW50YWwgbidhIHBhcyBub21tXHUwMEU5LlwiLCBtYXR0ZXI6IFwic2lsa1wiIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGZyYW1pbmc6IFwiY2VzIHZvaXggbmUgZGlzZW50IHBhcyB0b24gclx1MDBFQXZlIFx1MjAxNCBlbGxlcyBsZSB0b3VjaGVudCBkZXB1aXMgbGV1ciBhbmdsZS4gdG9uIGNvcnBzIHRyYW5jaGUuXCIsXG4gICAgICAgIF9zZWVkOiB0cnVlLFxuICAgICAgfSlcbiAgICApLFxuXG4gICAgLy8gRkVMVF9TSElGVF9HQVRFICsgQUhBX0NBUFRVUkUgYXByXHUwMEU4cyB1bmUgbGVjdHVyZSAoZm9yZXN0IC8gZWNobyAvIHRhbGUgLyB1c2VyX2ZpcnN0KS5cbiAgICBzdWJtaXRBaGFGZWVkYmFjazogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzdWJtaXRBaGFGZWVkYmFjayhrYWlyb3NJZCwgeyByZWFkaW5nX2tpbmQsIGZlbHRfc2hpZnRfbG9jYXRpb24sIGFoYV9sZXZlbCwgYWhhX25vdGUsIGZvcmVzdF9yZWFkaW5nX2FuZ2xlcywgcHJvcG9zaXRpb25fdm9peCB9ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkva2Fpcm9zL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KGthaXJvc0lkKSArIFwiL2FoYS1mZWVkYmFja1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICByZWFkaW5nX2tpbmQsXG4gICAgICAgICAgICBmZWx0X3NoaWZ0X2xvY2F0aW9uLFxuICAgICAgICAgICAgYWhhX2xldmVsLFxuICAgICAgICAgICAgYWhhX25vdGUsXG4gICAgICAgICAgICBmb3Jlc3RfcmVhZGluZ19hbmdsZXMsXG4gICAgICAgICAgICBwcm9wb3NpdGlvbl92b2l4LFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEZpZ3VyZXMgLyBDb25zdGVsbGF0aW9uIFx1MjUwMFx1MjUwMFxuICAgIGxpc3RGaWd1cmVzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RGaWd1cmVzKHsgc3ludGhlc2lzID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgaWYgKHN5bnRoZXNpcykgcGFyYW1zLnNldChcInN5bnRoZXNpc1wiLCBcInRydWVcIik7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2ZpZ3VyZXM/XCIgKyBwYXJhbXMudG9TdHJpbmcoKSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgbW90aWZzOiBbXSwgZWRnZXM6IFtdLCBzeW50aGVzaXM6IG51bGwsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGdldENvbnN0ZWxsYXRpb25HcmFwaDogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRDb25zdGVsbGF0aW9uR3JhcGgoeyBkYXlzID0gOTAsIG1pbl93ZWlnaHQgPSAwLjMgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldChcImRheXNcIiwgU3RyaW5nKGRheXMpKTtcbiAgICAgICAgcGFyYW1zLnNldChcIm1pbl93ZWlnaHRcIiwgU3RyaW5nKG1pbl93ZWlnaHQpKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IGpzb25GZXRjaChcIi9hcGkvY29uc3RlbGxhdGlvbj9cIiArIHBhcmFtcy50b1N0cmluZygpKTtcbiAgICAgICAgcmV0dXJuIGRhdGEuZ3JhcGggfHwgeyBub2RlczogW10sIGVkZ2VzOiBbXSB9O1xuICAgICAgfSxcbiAgICAgICgpID0+IFNFRUQuY29uc3RlbGxhdGlvbigpXG4gICAgKSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBBbmltYSBNdW5kaSBcdTI1MDBcdTI1MDBcbiAgICBnZXRWb3V0ZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRWb3V0ZSgpIHsgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvYW5pbWEtbXVuZGkvdm91dGVcIik7IH0sXG4gICAgICAoKSA9PiBTRUVELnZvdXRlKClcbiAgICApLFxuXG4gICAgZ2V0TWV0ZW86IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0TWV0ZW8oeyBsaW1pdCA9IDQgfSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2FuaW1hLW11bmRpL21ldGVvP2xpbWl0PVwiICsgbGltaXQpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IG1ldGVvczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGdldFBvbHlwaG9uaWU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0UG9seXBob25pZSh7IGxpbWl0ID0gNiB9ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvYW5pbWEtbXVuZGkvcG9seXBob25pZT9saW1pdD1cIiArIGxpbWl0KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBwb2x5cGhvbmllczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIC8vIEFyY2hpdmUgbHVuYWlyZSBcdTIwMTQgdG91dGVzIHBvbHlwaG9uaWVzIHBhc3NcdTAwRTllcyAoY2hyb25vbG9naXF1ZSBpbnZlcnNcdTAwRTkpXG4gICAgLy8gVXRpbGlzXHUwMEU5IHBhciBBbmltYVBvbHlwaG9uaWVTY3JlZW4gXCJsZWN0dXJlcyBwclx1MDBFOWNcdTAwRTlkZW50ZXNcIiAoY2hhbWJyZSA0KS5cbiAgICBnZXRQb2x5cGhvbmllQXJjaGl2ZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRQb2x5cGhvbmllQXJjaGl2ZSh7IGxpbWl0ID0gNjAgfSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2FuaW1hLW11bmRpL3BvbHlwaG9uaWUvYXJjaGl2ZT9saW1pdD1cIiArIGxpbWl0KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBwb2x5cGhvbmllczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGdldEFubmFsZXM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0QW5uYWxlcygpIHsgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvYW5pbWEtbXVuZGkvYW5uYWxlc1wiKTsgfSxcbiAgICAgICgpID0+ICh7IGNpcmN1bGF0aW5nOiBbXSwgYXJjaGl2ZWQ6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICB0ZW5pckFubmFsZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiB0ZW5pckFubmFsZShhbm5hbGVzX2lkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2FuaW1hLW11bmRpL3RlbmlyXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYW5uYWxlc19pZCB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBDZXJjbGVzIFx1MjUwMFx1MjUwMFxuICAgIGxpc3RDaXJjbGVzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RDaXJjbGVzKCkgeyByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9jaXJjbGVzXCIpOyB9LFxuICAgICAgKCkgPT4gKHsgY2lyY2xlczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGNyZWF0ZUNpcmNsZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVDaXJjbGUoe1xuICAgICAgICBuYW1lLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgbWF4TWVtYmVycyxcbiAgICAgICAgZnJlcXVlbmN5LFxuICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgICAgLy8gMjAyNi0wNC0yNSBcdTIwMTQgUmVmb250ZSBDZXJjbGUgVjEgKEJpYmxlIFx1MDBBNzMuNC4xKVxuICAgICAgICB0eXBlLCAgICAgICAgICAgLy8gJ3Nwb250YW5lJyB8ICdpbnRlbnRpb25uZWwnIHwgJ2ZhY2lsaXRlJ1xuICAgICAgICBpbnRlbnRpb25fdGV4dCwgLy8gbGlicmVcbiAgICAgICAgc3ViX2ludGVudGlvbnMsIC8vIHN0cmluZ1tdIHVwIHRvIDNcbiAgICAgICAgLy8gMjAyNi0wNC0yOCBcdTIwMTQgQ2VyY2xlcyBcdTAwRTlwaFx1MDBFOW1cdTAwRThyZXMgMjFqIChUMiBOaXZlYXUgMylcbiAgICAgICAgZXBoZW1lcmFsX2RheXMsIC8vIG51bWJlciAxLi45MCA7IG51bGwgPSBub24tXHUwMEU5cGhcdTAwRTltXHUwMEU4cmVcbiAgICAgIH0pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvY2lyY2xlc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBtYXhNZW1iZXJzLFxuICAgICAgICAgICAgZnJlcXVlbmN5LFxuICAgICAgICAgICAgZGlzcGxheU5hbWUsXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgaW50ZW50aW9uX3RleHQsXG4gICAgICAgICAgICBzdWJfaW50ZW50aW9ucyxcbiAgICAgICAgICAgIGVwaGVtZXJhbF9kYXlzLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgZXJyb3I6IFwiYXV0aCByZXF1aXJlZFwiIH0pXG4gICAgKSxcblxuICAgIC8vIDIwMjYtMDQtMjggXHUyMDE0IEludml0YXRpb25zIG1hZ2lxdWVzIChUMSBOaXZlYXUgMylcbiAgICBjcmVhdGVDaXJjbGVJbnZpdGF0aW9uOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUNpcmNsZUludml0YXRpb24oY2lyY2xlSWQsIG9wdHMgPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFxuICAgICAgICAgIFwiL2FwaS9jaXJjbGVzL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KGNpcmNsZUlkKSArIFwiL2ludml0YXRpb25zXCIsXG4gICAgICAgICAge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgdXNlc19yZW1haW5pbmc6IG9wdHMudXNlc19yZW1haW5pbmcsXG4gICAgICAgICAgICAgIGV4cGlyZXNfaW5fZGF5czogb3B0cy5leHBpcmVzX2luX2RheXMsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIGVycm9yOiBcImF1dGggcmVxdWlyZWRcIiB9KVxuICAgICksXG5cbiAgICBsaXN0Q2lyY2xlSW52aXRhdGlvbnM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbGlzdENpcmNsZUludml0YXRpb25zKGNpcmNsZUlkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXG4gICAgICAgICAgXCIvYXBpL2NpcmNsZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoY2lyY2xlSWQpICsgXCIvaW52aXRhdGlvbnNcIlxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IGludml0YXRpb25zOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgcmV2b2tlQ2lyY2xlSW52aXRhdGlvbjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiByZXZva2VDaXJjbGVJbnZpdGF0aW9uKGNpcmNsZUlkLCB0b2tlbikge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFxuICAgICAgICAgIFwiL2FwaS9jaXJjbGVzL1wiICtcbiAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChjaXJjbGVJZCkgK1xuICAgICAgICAgICAgXCIvaW52aXRhdGlvbnMvXCIgK1xuICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHRva2VuKSxcbiAgICAgICAgICB7IG1ldGhvZDogXCJERUxFVEVcIiB9XG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIGVycm9yOiBcImF1dGggcmVxdWlyZWRcIiB9KVxuICAgICksXG5cbiAgICBqb2luQ2lyY2xlOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGpvaW5DaXJjbGUoeyBpbnZpdGVDb2RlLCBkaXNwbGF5TmFtZSB9KSB7XG4gICAgICAgIC8vIE5vdGUgOiAvYXBpL2NpcmNsZXMvam9pbiBzdGlsbCB1c2VzIGxlZ2FjeSB1c2VySWQgcGF0dGVybiwgc2VuZCB2aWEgYm9keVxuICAgICAgICBjb25zdCB1c2VyID0gd2luZG93LkRyZWFtVXNlcjtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvY2lyY2xlcy9qb2luXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaW52aXRlQ29kZSwgZGlzcGxheU5hbWUsIHVzZXJJZDogdXNlcj8uaWQgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBlcnJvcjogXCJhdXRoIHJlcXVpcmVkXCIgfSlcbiAgICApLFxuXG4gICAgLy8gMjAyNi0wNC0yOCBcdTIwMTQgNyB0ZW1wbGF0ZXMgcHJcdTAwRTktY29uZmlndXJcdTAwRTlzIFYxXG4gICAgbGlzdENpcmNsZVRlbXBsYXRlczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0Q2lyY2xlVGVtcGxhdGVzKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9jaXJjbGVzL3RlbXBsYXRlc1wiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyB0ZW1wbGF0ZXM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBjcmVhdGVDaXJjbGVGcm9tVGVtcGxhdGU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ2lyY2xlRnJvbVRlbXBsYXRlKHtcbiAgICAgICAgc2x1ZyxcbiAgICAgICAgY3VzdG9tTmFtZSxcbiAgICAgICAgY3VzdG9tSW50ZW50aW9uLFxuICAgICAgICBjdXN0b21TdWJJbnRlbnRpb25zLFxuICAgICAgICBkaXNwbGF5TmFtZSxcbiAgICAgIH0pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcbiAgICAgICAgICBcIi9hcGkvY2lyY2xlcy90ZW1wbGF0ZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc2x1ZykgKyBcIi91c2VcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBjdXN0b21OYW1lLFxuICAgICAgICAgICAgICBjdXN0b21JbnRlbnRpb24sXG4gICAgICAgICAgICAgIGN1c3RvbVN1YkludGVudGlvbnMsXG4gICAgICAgICAgICAgIGRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBlcnJvcjogXCJhdXRoIHJlcXVpcmVkXCIgfSlcbiAgICApLFxuXG4gICAgbGlzdFJlc3RpdHV0aW9uczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0UmVzdGl0dXRpb25zKGNpcmNsZUlkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2NpcmNsZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoY2lyY2xlSWQpICsgXCIvcmVzdGl0dXRpb25zXCIpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHJlc3RpdHV0aW9uczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIHJlcXVlc3RSZXN0aXR1dGlvbjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiByZXF1ZXN0UmVzdGl0dXRpb24oY2lyY2xlSWQsIHBlcmlvZF9kYXlzID0gMjgpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvY2lyY2xlcy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChjaXJjbGVJZCkgKyBcIi9yZXN0aXR1dGlvbnNcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBwZXJpb2RfZGF5cyB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIHN0YXR1czogXCJwZW5kaW5nXCIgfSlcbiAgICApLFxuXG4gICAgLy8gMjAyNi0wNC0yNSBcdTIwMTQgUlx1MDBFOWFjdGlvbnMgc29icmVzIHN1ciByZXN0aXR1dGlvbiBwb2x5cGhvbmlxdWUgKDMgdmFsZXVycylcbiAgICBzdWJtaXRDaXJjbGVSZWFjdGlvbjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzdWJtaXRDaXJjbGVSZWFjdGlvbihjaXJjbGVJZCwgcmVzdGl0dXRpb25JZCwgcmVhY3Rpb25UeXBlKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2NpcmNsZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoY2lyY2xlSWQpICsgXCIvcmVhY3Rpb25zXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcmVzdGl0dXRpb25faWQ6IHJlc3RpdHV0aW9uSWQsIHJlYWN0aW9uX3R5cGU6IHJlYWN0aW9uVHlwZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIHJlbW92ZUNpcmNsZVJlYWN0aW9uOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHJlbW92ZUNpcmNsZVJlYWN0aW9uKGNpcmNsZUlkLCByZXN0aXR1dGlvbklkLCByZWFjdGlvblR5cGUpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KFwicmVzdGl0dXRpb25faWRcIiwgcmVzdGl0dXRpb25JZCk7XG4gICAgICAgIHBhcmFtcy5zZXQoXCJyZWFjdGlvbl90eXBlXCIsIHJlYWN0aW9uVHlwZSk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXG4gICAgICAgICAgXCIvYXBpL2NpcmNsZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoY2lyY2xlSWQpICsgXCIvcmVhY3Rpb25zP1wiICsgcGFyYW1zLnRvU3RyaW5nKCksXG4gICAgICAgICAgeyBtZXRob2Q6IFwiREVMRVRFXCIgfVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBvazogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBsaXN0Q2lyY2xlUmVhY3Rpb25zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RDaXJjbGVSZWFjdGlvbnMoY2lyY2xlSWQsIHJlc3RpdHV0aW9uSWQpIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KFwicmVzdGl0dXRpb25faWRcIiwgcmVzdGl0dXRpb25JZCk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXG4gICAgICAgICAgXCIvYXBpL2NpcmNsZXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoY2lyY2xlSWQpICsgXCIvcmVhY3Rpb25zP1wiICsgcGFyYW1zLnRvU3RyaW5nKClcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBjb3VudHM6IHsgcmVzb25hdGVzOiAwLCB1bmZhbWlsaWFyOiAwLCBxdWVzdGlvbjogMCB9LFxuICAgICAgICBtaW5lOiB7IHJlc29uYXRlczogZmFsc2UsIHVuZmFtaWxpYXI6IGZhbHNlLCBxdWVzdGlvbjogZmFsc2UgfSxcbiAgICAgICAgdG90YWw6IDAsXG4gICAgICAgIF9zZWVkOiB0cnVlLFxuICAgICAgfSlcbiAgICApLFxuXG4gICAgLy8gMjAyNi0wNC0yNSBcdTIwMTQgUXVpdHRlciBsZSBjZXJjbGUgKHNvZnQgOiBwb3NlIGxlZnRfYXQpXG4gICAgbGVhdmVDaXJjbGU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbGVhdmVDaXJjbGUoY2lyY2xlSWQpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvY2lyY2xlcy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChjaXJjbGVJZCkgKyBcIi9sZWF2ZVwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIkRFTEVURVwiLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gMjAyNi0wNC0yNSBcdTIwMTQgT3B0LWluIGthaXJvcyB2ZXJzIGNlcmNsZSwgMyBtb2RlcyAoQmlibGUgXHUwMEE3My40LjEpXG4gICAgLy8gICBtb2RlID0gJ3ByaXZhdGUnIHwgJ29wdGluX2Fub24nIHwgJ3NoYXJlZF9jbGVhcidcbiAgICBvcHRpbkthaXJvc1RvQ2lyY2xlOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIG9wdGluS2Fpcm9zVG9DaXJjbGUoeyBrYWlyb3NJZCwgY2lyY2xlSWQsIG1vZGUsIHBzZXVkb255bSB9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2thaXJvcy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChrYWlyb3NJZCkgKyBcIi9jaXJjbGUtb3B0aW5cIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjaXJjbGVfaWQ6IGNpcmNsZUlkLCBtb2RlLCBwc2V1ZG9ueW0gfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBvazogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBnZXRLYWlyb3NDaXJjbGVNb2RlOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldEthaXJvc0NpcmNsZU1vZGUoa2Fpcm9zSWQsIGNpcmNsZUlkKSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldChcImNpcmNsZV9pZFwiLCBjaXJjbGVJZCk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXG4gICAgICAgICAgXCIvYXBpL2thaXJvcy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChrYWlyb3NJZCkgKyBcIi9jaXJjbGUtb3B0aW4/XCIgKyBwYXJhbXMudG9TdHJpbmcoKVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IG1vZGU6IFwicHJpdmF0ZVwiLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgT3JhY2xlIENvcnBzIC8gVGFsZXMgXHUyNTAwXHUyNTAwXG4gICAgZ2V0T3JhY2xlQ29ycHM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0T3JhY2xlQ29ycHMoeyBzeW50aGVzaXMgPSBmYWxzZSwgbG9jYWxlID0gXCJmclwiIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIGlmIChzeW50aGVzaXMpIHBhcmFtcy5zZXQoXCJzeW50aGVzaXNcIiwgXCJ0cnVlXCIpO1xuICAgICAgICBwYXJhbXMuc2V0KFwibG9jYWxlXCIsIGxvY2FsZSk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL29yYWNsZS1jb3Jwcz9cIiArIHBhcmFtcy50b1N0cmluZygpKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBjb3JyZWxhdGlvbnM6IFtdLCBzeW50aGVzaXM6IG51bGwsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIG1hdGNoVGFsZXM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbWF0Y2hUYWxlcyhkcmVhbUlkLCB0b3BfayA9IDUpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvdGFsZXMvbWF0Y2hcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBkcmVhbUlkLCB0b3BfayB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgdGFsZXM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyAyMDI2LTA0LTI2IFx1MjAxNCBDb250ZSByXHUwMEU5c29uYW5jZSB1c2VyIChCaWJsZSBcdTAwQTcxNy40KVxuICAgIHN1Ym1pdFRhbGVSZXNvbmFuY2U6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gc3VibWl0VGFsZVJlc29uYW5jZSh7IHRhbGVfaWQsIGthaXJvc19pZCwgcmVzb25hbmNlLCB1c2VyX25vdGUgfSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS90YWxlcy9yZXNvbmFuY2VcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0YWxlX2lkLCBrYWlyb3NfaWQsIHJlc29uYW5jZSwgdXNlcl9ub3RlIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgbGlzdFRhbGVSZXNvbmFuY2VzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RUYWxlUmVzb25hbmNlcygpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvdGFsZXMvcmVzb25hbmNlXCIpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHJlc29uYW5jZXM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgT3JhY2xlIENvcnBzIFx1MjAxNCBib2R5IG1hcmtlcnMgKEJpYmxlIFx1MDBBNzE3LjIpIFx1MjUwMFx1MjUwMFxuICAgIC8vIDIwMjYtMDQtMjYgXHUyMDE0IHNpbGhvdWV0dGUgdGFwIG1hcmtlcnMgKyBoZWF0IG1hcFxuICAgIGxpc3RCb2R5TWFya2Vyczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0Qm9keU1hcmtlcnMoeyBkYXlzID0gMzAsIGthaXJvc19pZCB9ID0ge30pIHtcbiAgICAgICAgY29uc3QgcGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBwYXJhbXMuc2V0KFwiZGF5c1wiLCBTdHJpbmcoZGF5cykpO1xuICAgICAgICBpZiAoa2Fpcm9zX2lkKSBwYXJhbXMuc2V0KFwia2Fpcm9zX2lkXCIsIGthaXJvc19pZCk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL29yYWNsZS1jb3Jwcy9tYXJrZXJzP1wiICsgcGFyYW1zLnRvU3RyaW5nKCkpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IG1hcmtlcnM6IFtdLCBoZWF0bWFwOiBbXSwgY29ycmVsYXRpb25zOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgY3JlYXRlQm9keU1hcmtlcjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVCb2R5TWFya2VyKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvb3JhY2xlLWNvcnBzL21hcmtlcnNcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSB8fCB7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBtYXJrZXI6IG51bGwgfSlcbiAgICApLFxuXG4gICAgZGVsZXRlQm9keU1hcmtlcjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBkZWxldGVCb2R5TWFya2VyKGlkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL29yYWNsZS1jb3Jwcy9tYXJrZXJzP2lkPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGlkKSwgeyBtZXRob2Q6IFwiREVMRVRFXCIgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBOaWdodG1hcmVzIHN1Yi1hcHAgKEJpYmxlIFx1MDBBNzE3LjMsIG9wdC1pbiArIGF1dG8tZGV0ZWN0KSBcdTI1MDBcdTI1MDBcbiAgICBnZXRQcm90ZWN0aW9uU3RhdGU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0UHJvdGVjdGlvblN0YXRlKCkgeyByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9uaWdodG1hcmVzL3Byb3RlY3Rpb24tc3RhdGVcIik7IH0sXG4gICAgICAoKSA9PiAoeyBzdGF0ZTogeyBuaWdodG1hcmVfbW9kZV9lbmFibGVkOiBmYWxzZSwgZnJlZXplX3VudGlsOiBudWxsLCBpc19mcm96ZW46IGZhbHNlLCBfc2VlZDogdHJ1ZSB9IH0pXG4gICAgKSxcblxuICAgIHVwZGF0ZVByb3RlY3Rpb25TdGF0ZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVQcm90ZWN0aW9uU3RhdGUocGF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbmlnaHRtYXJlcy9wcm90ZWN0aW9uLXN0YXRlXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHBhdGNoIHx8IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIHN0YXRlOiBudWxsIH0pXG4gICAgKSxcblxuICAgIGVuYWJsZVByb3RlY3Rpb25GcmVlemU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZW5hYmxlUHJvdGVjdGlvbkZyZWV6ZSh7IGRheXMgPSAzMCwgaXNfY3Jpc2lzID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL25pZ2h0bWFyZXMvZW5hYmxlLWZyZWV6ZVwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGRheXMsIGlzX2NyaXNpcyB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIHN0YXRlOiBudWxsLCBmcm96ZW5fZm9yX2RheXM6IDMwIH0pXG4gICAgKSxcblxuICAgIGxpZnRQcm90ZWN0aW9uRnJlZXplOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpZnRQcm90ZWN0aW9uRnJlZXplKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9uaWdodG1hcmVzL2VuYWJsZS1mcmVlemVcIiwgeyBtZXRob2Q6IFwiREVMRVRFXCIgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGxpc3RNYXJrZWROaWdodG1hcmVzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RNYXJrZWROaWdodG1hcmVzKHsgdHlwZSA9IFwiYm90aFwiLCBsaW1pdCA9IDUwIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKCk7XG4gICAgICAgIHBhcmFtcy5zZXQoXCJ0eXBlXCIsIHR5cGUpO1xuICAgICAgICBwYXJhbXMuc2V0KFwibGltaXRcIiwgU3RyaW5nKGxpbWl0KSk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL25pZ2h0bWFyZXMvbGlzdC1tYXJrZWQ/XCIgKyBwYXJhbXMudG9TdHJpbmcoKSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgZW50cmllczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIG1hcmtOaWdodG1hcmU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbWFya05pZ2h0bWFyZSh7IGthaXJvc19pZCwgaXNfbmlnaHRtYXJlLCBpc19ncmllZl9yZWxhdGVkLCBncmllZl93aG8gfSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9uaWdodG1hcmVzL21hcmtcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBrYWlyb3NfaWQsIGlzX25pZ2h0bWFyZSwgaXNfZ3JpZWZfcmVsYXRlZCwgZ3JpZWZfd2hvIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgZW50cnk6IG51bGwgfSlcbiAgICApLFxuXG4gICAgYXV0b0RldGVjdFByb3RlY3Rpb246IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gYXV0b0RldGVjdFByb3RlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL25pZ2h0bWFyZXMvYXV0by1kZXRlY3RcIik7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgcHJvcG9zZTogZmFsc2UsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIC8vIDIwMjYtMDQtMjggXHUwMEE3MTEuYmlzLjIwLjEzIFx1MjAxNCBpbnRlcnByXHUwMEU5dGF0aW9uIEZvclx1MDBFQXQgbnVhbmNcdTAwRTllIHRyYXVtYS1zYWZlXG4gICAgZm9yZXN0UmVhZGluZ05pZ2h0bWFyZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBmb3Jlc3RSZWFkaW5nTmlnaHRtYXJlKHsgZHJlYW1faWQsIHJhd190ZXh0IH0gPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9uaWdodG1hcmVzL2ZvcmVzdC1yZWFkaW5nXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZHJlYW1faWQ6IGRyZWFtX2lkIHx8IG51bGwsIHJhd190ZXh0OiByYXdfdGV4dCB8fCBudWxsIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBzdGF0dXM6IFwib2tcIiwgcmVhZGluZzogbnVsbCwgZnJhbWluZzogbnVsbCwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gMjAyNi0wNC0yOCBcdTAwQTcxMS5iaXMuMjAuMTIgXHUyMDE0IGxlY3R1cmUgcG9seXBob25pcXVlIDMgdm9peCBjb3Jwc1xuICAgIGJvZHlPcmFjbGVSZWFkaW5nOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGJvZHlPcmFjbGVSZWFkaW5nKHBheWxvYWQgPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9vcmFjbGUtY29ycHMvcmVhZGluZ1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkIHx8IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgcmVhZGluZzogbnVsbCwgZnJhbWluZzogbnVsbCwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIENoYXQgbmFycmF0cmljZSAoU1NFKSBcdTI1MDBcdTI1MDBcbiAgICAvLyBSZXR1cm5zIHsgcmVhZGVyLCBkZWNvZGVyIH0gXHUyMDE0IGNhbGxlciBwdWxscyBjaHVua3NcbiAgICBhc3luYyBjaGF0U3RyZWFtKHsgbWVzc2FnZXMsIG1vZGUgPSBcImRyZWFtXCIsIGRyZWFtSWQgPSBudWxsLCBsb2NhbGUgPSBcImZyXCIgfSkge1xuICAgICAgY29uc3QgdG9rZW4gPSBhd2FpdCAod2luZG93LkRyZWFtQXV0aD8uZ2V0QWNjZXNzVG9rZW4/LigpIHx8IFByb21pc2UucmVzb2x2ZShudWxsKSk7XG4gICAgICBpZiAoIXRva2VuICYmICF3aW5kb3cuRHJlYW1BdXRoPy5ub0F1dGgpIHRocm93IG5ldyBFcnJvcihcIkF1dGggcmVxdWlyZWQgZm9yIGNoYXRcIik7XG4gICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChcIi9hcGkvY2hhdFwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAuLi4odG9rZW4gPyB7IEF1dGhvcml6YXRpb246IFwiQmVhcmVyIFwiICsgdG9rZW4gfSA6IHt9KSxcbiAgICAgICAgfSxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlcywgbW9kZSwgZHJlYW1JZCwgbG9jYWxlIH0pLFxuICAgICAgfSk7XG4gICAgICBpZiAoIXJlcy5vayB8fCAhcmVzLmJvZHkpIHtcbiAgICAgICAgY29uc3QgdGV4dCA9IGF3YWl0IHJlcy50ZXh0KCkuY2F0Y2goKCkgPT4gXCJcIik7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNoYXQgc3RyZWFtIGZhaWxlZDogXCIgKyAodGV4dCB8fCByZXMuc3RhdHVzKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzLmJvZHkuZ2V0UmVhZGVyKCk7XG4gICAgfSxcblxuICAgIC8vIENvbnZlbmllbmNlOiBwYXJzZSBTU0Ugc3RyZWFtIGZyb20gY2hhdFN0cmVhbSBpbnRvIGNodW5rcy9kb25lIGV2ZW50c1xuICAgIGFzeW5jIGNoYXQoeyBtZXNzYWdlcywgbW9kZSA9IFwiZHJlYW1cIiwgZHJlYW1JZCA9IG51bGwsIGxvY2FsZSA9IFwiZnJcIiwgb25DaHVuaywgb25Eb25lLCBvbkVycm9yIH0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHJlYWRlciA9IGF3YWl0IHRoaXMuY2hhdFN0cmVhbSh7IG1lc3NhZ2VzLCBtb2RlLCBkcmVhbUlkLCBsb2NhbGUgfSk7XG4gICAgICAgIGNvbnN0IGRlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoKTtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IFwiXCI7XG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgY29uc3QgeyBkb25lLCB2YWx1ZSB9ID0gYXdhaXQgcmVhZGVyLnJlYWQoKTtcbiAgICAgICAgICBpZiAoZG9uZSkgYnJlYWs7XG4gICAgICAgICAgYnVmZmVyICs9IGRlY29kZXIuZGVjb2RlKHZhbHVlLCB7IHN0cmVhbTogdHJ1ZSB9KTtcbiAgICAgICAgICBjb25zdCBwYXJ0cyA9IGJ1ZmZlci5zcGxpdChcIlxcblxcblwiKTtcbiAgICAgICAgICBidWZmZXIgPSBwYXJ0cy5wb3AoKTsgIC8vIGxhc3QgaXMgaW5jb21wbGV0ZVxuICAgICAgICAgIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IHBhcnQudHJpbSgpO1xuICAgICAgICAgICAgaWYgKCFsaW5lLnN0YXJ0c1dpdGgoXCJkYXRhOlwiKSkgY29udGludWU7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBldiA9IEpTT04ucGFyc2UobGluZS5zbGljZSg1KS50cmltKCkpO1xuICAgICAgICAgICAgICBpZiAoZXYudHlwZSA9PT0gXCJjaHVua1wiICYmIG9uQ2h1bmspIG9uQ2h1bmsoZXYuY29udGVudCk7XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGV2LnR5cGUgPT09IFwiZG9uZVwiICYmIG9uRG9uZSkgb25Eb25lKGV2Lm1ldGFkYXRhIHx8IHt9KTtcbiAgICAgICAgICAgICAgZWxzZSBpZiAoZXYudHlwZSA9PT0gXCJlcnJvclwiICYmIG9uRXJyb3IpIG9uRXJyb3IoZXYubWVzc2FnZSk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIltEcmVhbUFQSV0gU1NFIHBhcnNlIGVycm9yOlwiLCBlLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAob25FcnJvcikgb25FcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgICBlbHNlIHRocm93IGU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBUcmFuc2NyaWJlICh2b2ljZSkgXHUyNTAwXHUyNTAwXG4gICAgdHJhbnNjcmliZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiB0cmFuc2NyaWJlKGF1ZGlvQmxvYiwgbWltZVR5cGUgPSBcImF1ZGlvL3dlYm1cIikge1xuICAgICAgICBjb25zdCBmZCA9IG5ldyBGb3JtRGF0YSgpO1xuICAgICAgICBmZC5hcHBlbmQoXCJhdWRpb1wiLCBhdWRpb0Jsb2IsIFwicmVjb3JkaW5nLlwiICsgKG1pbWVUeXBlLnNwbGl0KFwiL1wiKVsxXSB8fCBcIndlYm1cIikpO1xuICAgICAgICAvLyBBZGQgdXNlcklkIGZhbGxiYWNrIGZvciBsZWdhY3kgYXV0aFxuICAgICAgICBjb25zdCB1c2VyID0gd2luZG93LkRyZWFtVXNlcjtcbiAgICAgICAgaWYgKHVzZXI/LmlkKSBmZC5hcHBlbmQoXCJ1c2VySWRcIiwgdXNlci5pZCk7XG4gICAgICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZldGNoKFwiL2FwaS90cmFuc2NyaWJlXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGhlYWRlcnM6IGF3YWl0IGF1dGhIZWFkZXJzKCksXG4gICAgICAgICAgYm9keTogZmQsXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXJlcy5vaykge1xuICAgICAgICAgIGNvbnN0IGVyckJvZHkgPSBhd2FpdCByZXMuanNvbigpLmNhdGNoKCgpID0+IG51bGwpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJCb2R5Py5lcnJvciB8fCBcIkhUVFAgXCIgKyByZXMuc3RhdHVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzLmpzb24oKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyB0ZXh0OiBcIlwiLCBfc2VlZDogdHJ1ZSwgZXJyb3I6IFwidHJhbnNjcmliZSB1bmF2YWlsYWJsZVwiIH0pXG4gICAgKSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBVc2VyIHBlcnNvbmFsIGxheWVyIFx1MjUwMFx1MjUwMFxuICAgIGxpc3RNZWFuaW5nczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0TWVhbmluZ3MoKSB7IHJldHVybiBqc29uRmV0Y2goXCIvYXBpL3VzZXIvbWVhbmluZ1wiKTsgfSxcbiAgICAgICgpID0+ICh7IG1lYW5pbmdzOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgc2V0TWVhbmluZzogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzZXRNZWFuaW5nKHsgc3ltYm9sX2NvbmNlcHQsIHVzZXJfbWVhbmluZywgd2VpZ2h0ID0gMS4wLCBjb250ZXh0X2xhbmcgPSBcImZyXCIsIHNvdXJjZSA9IG51bGwgfSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS91c2VyL21lYW5pbmdcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBzeW1ib2xfY29uY2VwdCwgdXNlcl9tZWFuaW5nLCB3ZWlnaHQsIGNvbnRleHRfbGFuZywgc291cmNlIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBkZWxldGVNZWFuaW5nOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU1lYW5pbmcoaWQpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvdXNlci9tZWFuaW5nP2lkPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KGlkKSwgeyBtZXRob2Q6IFwiREVMRVRFXCIgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIHZhbGlkYXRlOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHZhbGlkYXRlKHsgY29udGV4dF90eXBlLCBjb250ZXh0X2lkLCB2YWxpZGF0aW9uLCBwcm9wb3NpdGlvbl92b2l4LCB1c2VyX25vdGUgfSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS91c2VyL3ZhbGlkYXRlXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgY29udGV4dF90eXBlLCBjb250ZXh0X2lkLCB2YWxpZGF0aW9uLCBwcm9wb3NpdGlvbl92b2l4LCB1c2VyX25vdGUgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGFubm90YXRlS2Fpcm9zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGFubm90YXRlS2Fpcm9zKGthaXJvc19pZCwgYW5ub3RhdGlvbl90ZXh0LCBtYXJrZXJfcG9zaXRpb24gPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL3VzZXIvYW5ub3RhdGVcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBrYWlyb3NfaWQsIGFubm90YXRpb25fdGV4dCwgbWFya2VyX3Bvc2l0aW9uIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBsaXN0QW5ub3RhdGlvbnM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbGlzdEFubm90YXRpb25zKGthaXJvc19pZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS91c2VyL2Fubm90YXRlP2thaXJvc19pZD1cIiArIGVuY29kZVVSSUNvbXBvbmVudChrYWlyb3NfaWQpKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBhbm5vdGF0aW9uczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIC8vIFx1MjUwMFx1MjUwMCBGZWVkYmFjayBcdTI1MDBcdTI1MDBcbiAgICBzdWJtaXRGZWVkYmFjazogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzdWJtaXRGZWVkYmFjayh7IGNvbnRleHRfdHlwZSwgY29udGV4dF9pZCwgZmVlZGJhY2tfdGV4dCwgc2V2ZXJpdHkgPSBcImxvd1wiLCB1c2VyX2VtYWlsIH0pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvZmVlZGJhY2tcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjb250ZXh0X3R5cGUsIGNvbnRleHRfaWQsIGZlZWRiYWNrX3RleHQsIHNldmVyaXR5LCB1c2VyX2VtYWlsIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgSm91cm5hbCBkZSBWaWUgTFVNSU5FVVggKHJcdTAwRTl2XHUwMEU5bGF0aW9uIFRpbSAyMDI2LTA0LTI1KSBcdTI1MDBcdTI1MDBcbiAgICBjcmVhdGVKb3VybmFsRW50cnk6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gY3JlYXRlSm91cm5hbEVudHJ5KHsgcmF3X3RleHQsIHZvaWNlX3VybCA9IG51bGwsIGxpbmtlZF9rYWlyb3NfaWQgPSBudWxsIH0pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvam91cm5hbC9lbnRyaWVzXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgcmF3X3RleHQsIHZvaWNlX3VybCwgbGlua2VkX2thaXJvc19pZCB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKHsgcmF3X3RleHQgfSkgPT4gKHsgZW50cnk6IHsgaWQ6IFwibG9jYWwtXCIgKyBEYXRlLm5vdygpLCByYXdfdGV4dCwgY3JlYXRlZF9hdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpIH0sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGxpc3RKb3VybmFsRW50cmllczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0Sm91cm5hbEVudHJpZXMoeyBjYXRlZ29yeSA9IG51bGwsIHN1Yl9jYXRlZ29yeSA9IG51bGwsIGxpbWl0ID0gNTAsIG9mZnNldCA9IDAgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgcGFyYW1zLnNldChcImxpbWl0XCIsIFN0cmluZyhsaW1pdCkpO1xuICAgICAgICBpZiAoY2F0ZWdvcnkpIHBhcmFtcy5zZXQoXCJjYXRlZ29yeVwiLCBjYXRlZ29yeSk7XG4gICAgICAgIGlmIChzdWJfY2F0ZWdvcnkpIHBhcmFtcy5zZXQoXCJzdWJfY2F0ZWdvcnlcIiwgc3ViX2NhdGVnb3J5KTtcbiAgICAgICAgaWYgKG9mZnNldCkgcGFyYW1zLnNldChcIm9mZnNldFwiLCBTdHJpbmcob2Zmc2V0KSk7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2pvdXJuYWwvZW50cmllcz9cIiArIHBhcmFtcy50b1N0cmluZygpKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBlbnRyaWVzOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgbGlzdEpvdXJuYWxTZWN0aW9uczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsaXN0Sm91cm5hbFNlY3Rpb25zKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9qb3VybmFsL3NlY3Rpb25zXCIpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7XG4gICAgICAgIHNlY3Rpb25zOiBbXG4gICAgICAgICAgeyBjYXRlZ29yeTogXCJ0cmF2YWlsXCIsIGxhYmVsOiBcInRyYXZhaWwgJiB2b2NhdGlvblwiLCBnbHlwaDogXCJcdTI1QzdcIiwgY291bnQ6IDAgfSxcbiAgICAgICAgICB7IGNhdGVnb3J5OiBcInJlbGF0aW9uc1wiLCBsYWJlbDogXCJyZWxhdGlvbnNcIiwgZ2x5cGg6IFwiXHUyNUNCXCIsIGNvdW50OiAwLCBzdWJfY2F0ZWdvcmllczogW10gfSxcbiAgICAgICAgICB7IGNhdGVnb3J5OiBcImNvcnBzX3NhbnRlXCIsIGxhYmVsOiBcImNvcnBzICYgc2FudFx1MDBFOVwiLCBnbHlwaDogXCJcdTI1RDBcIiwgY291bnQ6IDAgfSxcbiAgICAgICAgICB7IGNhdGVnb3J5OiBcInBhc3Npb25zXCIsIGxhYmVsOiBcInBhc3Npb25zICYgY3JcdTAwRTlhdGlvblwiLCBnbHlwaDogXCJcdTI3MzZcIiwgY291bnQ6IDAgfSxcbiAgICAgICAgICB7IGNhdGVnb3J5OiBcImFyZ2VudFwiLCBsYWJlbDogXCJhcmdlbnQgJiBtYXRcdTAwRTlyaWVsXCIsIGdseXBoOiBcIlx1MjMyQ1wiLCBjb3VudDogMCB9LFxuICAgICAgICAgIHsgY2F0ZWdvcnk6IFwic3Bpcml0dWFsaXRlXCIsIGxhYmVsOiBcInNwaXJpdHVhbGl0XHUwMEU5ICYgc2Vuc1wiLCBnbHlwaDogXCJcdTI2MDlcIiwgY291bnQ6IDAgfSxcbiAgICAgICAgICB7IGNhdGVnb3J5OiBcInRyYW5zaXRpb25zXCIsIGxhYmVsOiBcInRyYW5zaXRpb25zICYgc2V1aWxzXCIsIGdseXBoOiBcIlx1MjMxMlwiLCBjb3VudDogMCB9LFxuICAgICAgICBdLFxuICAgICAgICBfc2VlZDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIHN1bW1vbkthaXJvc1dpc2RvbTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzdW1tb25LYWlyb3NXaXNkb20oeyBlbnRyeV9pZCA9IG51bGwsIGNhdGVnb3J5ID0gbnVsbCwgc3ViX2NhdGVnb3J5ID0gbnVsbCB9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2pvdXJuYWwvc3VtbW9uLWthaXJvcy13aXNkb21cIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlbnRyeV9pZCwgY2F0ZWdvcnksIHN1Yl9jYXRlZ29yeSB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHtcbiAgICAgICAgcG9seXBob255X3RleHQ6IFwiQ2V0dGUgdm9peCB2aWVuZHJhIHF1YW5kIGwnYXBwIHNlcmEgY29ubmVjdFx1MDBFOWUuIEVuIG1vZGUgZFx1MDBFOW1vLCBsYSBzYWdlc3NlIGRvcnQuXCIsXG4gICAgICAgIHZvaWNlc19tb2JpbGlzZWVzOiBbXSxcbiAgICAgICAgcmVzb25hbnRfa2Fpcm9zOiBbXSxcbiAgICAgICAgX3NlZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICksXG5cbiAgICBzdWJtaXRXaXNkb21GZWVkYmFjazogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzdWJtaXRXaXNkb21GZWVkYmFjayhzdW1tb25faWQsIHsgZmVsdF9zaGlmdF9sb2NhdGlvbiwgYWhhX2xldmVsLCBhaGFfbm90ZSB9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2pvdXJuYWwvc3VtbW9ucy9cIiArIGVuY29kZVVSSUNvbXBvbmVudChzdW1tb25faWQpLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBmZWx0X3NoaWZ0X2xvY2F0aW9uLCBhaGFfbGV2ZWwsIGFoYV9ub3RlIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEx1Y2lkIHN1Yi1hcHAgKEJpYmxlIFx1MDBBNzE3LCBvcHQtaW4gc3RyaWN0KSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBnZXRMdWNpZFByb2ZpbGU6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZ2V0THVjaWRQcm9maWxlKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9wcm9maWxlXCIpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7XG4gICAgICAgIHByb2ZpbGU6IHtcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSwgZXhwZXJpZW5jZV9sZXZlbDogbnVsbCwgcHJlZmVycmVkX3RlY2huaXF1ZTogbnVsbCxcbiAgICAgICAgICB1aV9tb2RlOiBcImRhcmtfbW9ub1wiLCBvYnNpZGlhbl9leHBvcnRfZW5hYmxlZDogZmFsc2UsXG4gICAgICAgICAgdG90YWxfbHVjaWRfZHJlYW1zOiAwLCB0b3RhbF9kcmVhbXNfcmVjYWxsZWQ6IDAsXG4gICAgICAgICAgY3VycmVudF9zdHJlYWtfbHVjaWRfcGVyX3dlZWs6IDAsIGJlc3Rfc3RyZWFrOiAwLFxuICAgICAgICAgIF9leGlzdHM6IGZhbHNlLCBfc2VlZDogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIHVwZGF0ZUx1Y2lkUHJvZmlsZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVMdWNpZFByb2ZpbGUocGF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvcHJvZmlsZVwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXRjaCB8fCB7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBwcm9maWxlOiBudWxsIH0pXG4gICAgKSxcblxuICAgIGxpc3RSZWFsaXR5Q2hlY2tzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RSZWFsaXR5Q2hlY2tzKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9yZWFsaXR5LWNoZWNrc1wiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyByZWFsaXR5X2NoZWNrczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGNyZWF0ZVJlYWxpdHlDaGVjazogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVSZWFsaXR5Q2hlY2soZGF0YSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9yZWFsaXR5LWNoZWNrc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhIHx8IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIHJlYWxpdHlfY2hlY2s6IG51bGwgfSlcbiAgICApLFxuXG4gICAgdXBkYXRlUmVhbGl0eUNoZWNrOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVJlYWxpdHlDaGVjayhpZCwgcGF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvcmVhbGl0eS1jaGVja3MvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF0Y2ggfHwge30pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgcmVhbGl0eV9jaGVjazogbnVsbCB9KVxuICAgICksXG5cbiAgICBkZWxldGVSZWFsaXR5Q2hlY2s6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZGVsZXRlUmVhbGl0eUNoZWNrKGlkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2x1Y2lkL3JlYWxpdHktY2hlY2tzL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KGlkKSwgeyBtZXRob2Q6IFwiREVMRVRFXCIgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGxpc3REcmVhbVNpZ25zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3REcmVhbVNpZ25zKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9kcmVhbS1zaWduc1wiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBkcmVhbV9zaWduczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGFkZERyZWFtU2lnbjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBhZGREcmVhbVNpZ24obGFiZWwsIGNhdGVnb3J5KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2x1Y2lkL2RyZWFtLXNpZ25zXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgc2lnbl9sYWJlbDogbGFiZWwsIHNpZ25fY2F0ZWdvcnk6IGNhdGVnb3J5IHx8IG51bGwgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBkcmVhbV9zaWduOiBudWxsIH0pXG4gICAgKSxcblxuICAgIGRlbGV0ZURyZWFtU2lnbjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBkZWxldGVEcmVhbVNpZ24oaWQpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvZHJlYW0tc2lnbnMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7IG1ldGhvZDogXCJERUxFVEVcIiB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgdXBkYXRlRHJlYW1TaWduOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZURyZWFtU2lnbihpZCwgcGF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvZHJlYW0tc2lnbnMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF0Y2ggfHwge30pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgZHJlYW1fc2lnbjogbnVsbCB9KVxuICAgICksXG5cbiAgICBhdHRhY2hMdWNpZE1ldGFkYXRhOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGF0dGFjaEx1Y2lkTWV0YWRhdGEoa2Fpcm9zSWQsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQva2Fpcm9zLW1ldGFkYXRhXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsga2Fpcm9zX2lkOiBrYWlyb3NJZCwgLi4uKGRhdGEgfHwge30pIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgbWV0YWRhdGE6IG51bGwgfSlcbiAgICApLFxuXG4gICAgbGlzdFdCVEJBbGFybXM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbGlzdFdCVEJBbGFybXMoKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2x1Y2lkL3didGItYWxhcm1zXCIpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IGFsYXJtczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGNyZWF0ZVdCVEJBbGFybTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBjcmVhdGVXQlRCQWxhcm0oZGF0YSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC93YnRiLWFsYXJtc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhIHx8IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIGFsYXJtOiBudWxsIH0pXG4gICAgKSxcblxuICAgIGRlbGV0ZVdCVEJBbGFybTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBkZWxldGVXQlRCQWxhcm0oaWQpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvd2J0Yi1hbGFybXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7IG1ldGhvZDogXCJERUxFVEVcIiB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgb2s6IHRydWUgfSlcbiAgICApLFxuXG4gICAgdXBkYXRlV0JUQkFsYXJtOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZVdCVEJBbGFybShpZCwgcGF0Y2gpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvd2J0Yi1hbGFybXMvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoaWQpLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBBVENIXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF0Y2ggfHwge30pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBfc2VlZDogdHJ1ZSwgYWxhcm06IG51bGwgfSlcbiAgICApLFxuXG4gICAgZ2V0THVjaWRTdGF0czogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRMdWNpZFN0YXRzKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9zdGF0c1wiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoe1xuICAgICAgICBzdGF0czoge1xuICAgICAgICAgIHRvdGFsX2RyZWFtczogMCwgdG90YWxfbHVjaWRfZHJlYW1zOiAwLCByZWNhbGxfcmF0ZV9wY3Q6IDAsXG4gICAgICAgICAgY3VycmVudF9zdHJlYWtfcGVyX3dlZWs6IDAsIGJlc3Rfc3RyZWFrX2luXzdkX3dpbmRvdzogMCxcbiAgICAgICAgICBzaWduc19jb3VudDogMCwgdG9wX3NpZ25zOiBbXSwgcmVjZW50X2x1Y2lkX3Blcl9kYXk6IFtdLFxuICAgICAgICAgIHRlY2huaXF1ZV9icmVha2Rvd246IHt9LFxuICAgICAgICB9LFxuICAgICAgICBfc2VlZDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIGV4dHJhY3REcmVhbVNpZ25zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGV4dHJhY3REcmVhbVNpZ25zKGthaXJvc0lkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2x1Y2lkL2V4dHJhY3QtZHJlYW0tc2lnbnNcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBrYWlyb3NfaWQ6IGthaXJvc0lkIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBkcmVhbV9zaWduczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGV4cG9ydE9ic2lkaWFuOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGV4cG9ydE9ic2lkaWFuKCkge1xuICAgICAgICAvLyBSZXR1cm5zIHRleHQvbWFya2Rvd247IHRoZSBEYXNoYm9hcmQgaGFuZGxlcyB0aGUgZG93bmxvYWQgaXRzZWxmLlxuICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0ICh3aW5kb3cuRHJlYW1BdXRoPy5nZXRBY2Nlc3NUb2tlbj8uKCkgfHwgUHJvbWlzZS5yZXNvbHZlKG51bGwpKTtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCIvYXBpL2x1Y2lkL2V4cG9ydC1vYnNpZGlhblwiLCB7XG4gICAgICAgICAgaGVhZGVyczogdG9rZW4gPyB7IEF1dGhvcml6YXRpb246IFwiQmVhcmVyIFwiICsgdG9rZW4gfSA6IHt9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFyZXMub2spIHRocm93IG5ldyBFcnJvcihcImV4cG9ydCBmYWlsZWQ6IFwiICsgcmVzLnN0YXR1cyk7XG4gICAgICAgIHJldHVybiByZXMudGV4dCgpO1xuICAgICAgfSxcbiAgICAgICgpID0+IFwiIyAob2ZmbGluZSkgXHUyMDE0IG5vIGV4cG9ydCBhdmFpbGFibGVcXG5cIlxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgTHVjaWQgVjEgXHUyMDE0IHJvdXRlcyBub3V2ZWxsZXMgMjAyNi0wNC0yOCAoWWVzaHVhKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBkZXRlY3RMdWNpZE1hcmtlcnM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZGV0ZWN0THVjaWRNYXJrZXJzKHsga2Fpcm9zX2lkLCByYXdfdGV4dCwgcGVyc2lzdCA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9kZXRlY3QtbWFya2Vyc1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGthaXJvc19pZCwgcmF3X3RleHQsIHBlcnNpc3QgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IG1hcmtlcnM6IHsgaXNfbHVjaWQ6IGZhbHNlLCBjb25maWRlbmNlOiAwLCBzaWduYWxzOiBbXSB9LCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBzdWdnZXN0RHJlYW1TaWduczogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBzdWdnZXN0RHJlYW1TaWducygpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvZHJlYW0tc2lnbnMtc3VnZ2VzdFwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHN1Z2dlc3Rpb25zOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgZ2V0THVjaWRQcmFjdGljZUxldHRlcjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRMdWNpZFByYWN0aWNlTGV0dGVyKHsgZm9yY2UgPSBmYWxzZSB9ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvcHJhY3RpY2UtbGV0dGVyXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZm9yY2UgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7XG4gICAgICAgIGxldHRlcjogXCJNb2RlIGRcdTAwRTltbyA6IGxhIGxldHRyZSBkZSB0YSBwcmF0aXF1ZSBhcHBhcmFcdTAwRUV0cmEgaWNpIHF1YW5kIGwnYXBwIHNlcmEgY29ubmVjdFx1MDBFOWUuXCIsXG4gICAgICAgIGNhY2hlZDogZmFsc2UsIHdvcmRfY291bnQ6IDE0LCBfc2VlZDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgKSxcblxuICAgIGxvZ1JlYWxpdHlDaGVja1RpY2s6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbG9nUmVhbGl0eUNoZWNrVGljayh7IHJjX2lkLCByZXN1bHQsIHRyaWdnZXJlZF9rYWlyb3NfaWQsIG5vdGVzIH0gPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9yZWFsaXR5LWNoZWNrLXRpY2tcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyByY19pZCwgcmVzdWx0LCB0cmlnZ2VyZWRfa2Fpcm9zX2lkLCBub3RlcyB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIHNldFdCVEJJbnRlbnRpb246IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gc2V0V0JUQkludGVudGlvbih7IGFsYXJtX2lkLCBpbnRlbnRpb24sIHNvdW5kX3Byb2ZpbGUgfSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2x1Y2lkL3didGItaW50ZW50aW9uXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYWxhcm1faWQsIGludGVudGlvbiwgc291bmRfcHJvZmlsZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIG9rOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGxpc3RMdWNpZFNlc3Npb25zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGxpc3RMdWNpZFNlc3Npb25zKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9zZXNzaW9uLWV2ZW50c1wiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBzZXNzaW9uczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGxvZ0x1Y2lkU2Vzc2lvbjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBsb2dMdWNpZFNlc3Npb24oZGF0YSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9zZXNzaW9uLWV2ZW50c1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShkYXRhIHx8IHt9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgX3NlZWQ6IHRydWUsIHNlc3Npb246IG51bGwgfSlcbiAgICApLFxuXG4gICAgc3VibWl0THVjaWRPbmJvYXJkaW5nOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHN1Ym1pdEx1Y2lkT25ib2FyZGluZyhkYXRhKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2x1Y2lkL29uYm9hcmRpbmdcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSB8fCB7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IF9zZWVkOiB0cnVlLCBnYXRld2F5X3VubG9ja2VkOiBmYWxzZSB9KVxuICAgICksXG5cbiAgICBleHBvcnRMdWNpZEpvdXJuYWw6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gZXhwb3J0THVjaWRKb3VybmFsKHsgZm9ybWF0ID0gXCJtYXJrZG93blwiIH0gPSB7fSkge1xuICAgICAgICBjb25zdCB0b2tlbiA9IGF3YWl0ICh3aW5kb3cuRHJlYW1BdXRoPy5nZXRBY2Nlc3NUb2tlbj8uKCkgfHwgUHJvbWlzZS5yZXNvbHZlKG51bGwpKTtcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goXCIvYXBpL2x1Y2lkL2V4cG9ydD9mb3JtYXQ9XCIgKyBlbmNvZGVVUklDb21wb25lbnQoZm9ybWF0KSwge1xuICAgICAgICAgIGhlYWRlcnM6IHRva2VuID8geyBBdXRob3JpemF0aW9uOiBcIkJlYXJlciBcIiArIHRva2VuIH0gOiB7fSxcbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghcmVzLm9rKSB0aHJvdyBuZXcgRXJyb3IoXCJleHBvcnQgZmFpbGVkOiBcIiArIHJlcy5zdGF0dXMpO1xuICAgICAgICByZXR1cm4gZm9ybWF0ID09PSBcImpzb25cIiA/IHJlcy5qc29uKCkgOiByZXMudGV4dCgpO1xuICAgICAgfSxcbiAgICAgICgpID0+IFwiIyAob2ZmbGluZSlcXG5cIlxuICAgICksXG5cbiAgICBnZXRMdWNpZEZvcmVzdEJyaWRnZTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBnZXRMdWNpZEZvcmVzdEJyaWRnZShrYWlyb3NJZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9sdWNpZC9mb3Jlc3QtYnJpZGdlXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsga2Fpcm9zX2lkOiBrYWlyb3NJZCB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgdm9pY2VzOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgY2hlY2tOaWdodG1hcmVEZXRvdXI6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gY2hlY2tOaWdodG1hcmVEZXRvdXIoeyBrYWlyb3NfaWQsIHZhbGVuY2UsIGludGVudGlvbl93YXNfdG9fcmVzb2x2ZSB9ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvbHVjaWQvbmlnaHRtYXJlLWRldG91clwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGthaXJvc19pZCwgdmFsZW5jZSwgaW50ZW50aW9uX3dhc190b19yZXNvbHZlIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBkZXRvdXJfcmVxdWlyZWQ6IGZhbHNlLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUG9ydHJhaXQgbmFycmF0aXZlIChyZWZvbnRlIDIwMjYtMDQtMjUpIFx1MjUwMFx1MjUwMFxuICAgIGdldFBvcnRyYWl0TmFycmF0aXZlOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldFBvcnRyYWl0TmFycmF0aXZlKHsgdG9nZ2xlID0gXCJjcm9zc2VkXCIsIHBlcmlvZCA9IFwibHVuZVwiLCBmb3JjZSA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9wb3J0cmFpdC9uYXJyYXRpdmUtcmVhZGluZ1wiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHRvZ2dsZSwgcGVyaW9kLCBmb3JjZSB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKHsgdG9nZ2xlID0gXCJjcm9zc2VkXCIgfSA9IHt9KSA9PiAoe1xuICAgICAgICBsZXR0cmU6IHRvZ2dsZSA9PT0gXCJkYXlcIlxuICAgICAgICAgID8gXCJNb2RlIGRcdTAwRTltbyA6IHRhIHZpZSBkZSBqb3VyIHJlc3BpcmUgZW4gc2lsZW5jZSBpY2kuXCJcbiAgICAgICAgICA6IHRvZ2dsZSA9PT0gXCJuaWdodFwiXG4gICAgICAgICAgPyBcIk1vZGUgZFx1MDBFOW1vIDogbGEgbnVpdCBkb3J0IGVuY29yZSBkYW5zIGNlIHNvbC5cIlxuICAgICAgICAgIDogXCJNb2RlIGRcdTAwRTltbyA6IGxlcyBkZXV4IG1vbmRlcyBzZSBjcm9pc2Vyb250IHF1YW5kIGwnYXBwIHNlcmEgY29ubmVjdFx1MDBFOWUuXCIsXG4gICAgICAgIHZvaXhfbW9iaWxpc2VlczogW10sXG4gICAgICAgIGZpZ3VyZXNfZG9taW5hbnRlczogW10sXG4gICAgICAgIGVjaG9zX2FjdGlmczogW10sXG4gICAgICAgIHRlbnNpb25zX291dmVydGVzOiBbXSxcbiAgICAgICAgX3NlZWQ6IHRydWUsXG4gICAgICB9KVxuICAgICksXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIwMjYtMDQtMjkgXHUyMDE0IFByb3BoZXRpYyBlY2hvZXMgKEZlYXR1cmUgMSwgbW9hdCBwaGlsb3NvcGhpcXVlKSBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcdTI1MDBcbiAgICBwcm9waGV0aWNEZXRlY3Q6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gcHJvcGhldGljRGV0ZWN0KCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9kcmVhbS1jaGF0L3Byb3BoZXRpYy9kZXRlY3RcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBwcm9wb3NlZDogMCwgc2tpcHBlZDogMCwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgcHJvcGhldGljRWNob2VzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHByb3BoZXRpY0VjaG9lcyh7IGluY2x1ZGVfZGVsaXZlcmVkID0gZmFsc2UsIGxpbWl0ID0gMjAgfSA9IHt9KSB7XG4gICAgICAgIGNvbnN0IHFzID0gbmV3IFVSTFNlYXJjaFBhcmFtcygpO1xuICAgICAgICBpZiAoaW5jbHVkZV9kZWxpdmVyZWQpIHFzLnNldChcImluY2x1ZGVfZGVsaXZlcmVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgaWYgKGxpbWl0KSBxcy5zZXQoXCJsaW1pdFwiLCBTdHJpbmcobGltaXQpKTtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvZHJlYW0tY2hhdC9wcm9waGV0aWMvZWNob2VzP1wiICsgcXMudG9TdHJpbmcoKSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgZWNob2VzOiBbXSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIDIwMjYtMDQtMjkgXHUyMDE0IFBlcnNvbmFsIERpY3Rpb25hcnkgKEZlYXR1cmUgMiwgbW9hdCBcdTAwRTlwaXN0XHUwMEU5bWlxdWUpIFx1MjUwMFx1MjUwMFx1MjUwMFx1MjUwMFxuICAgIHBlcnNvbmFsRGljdGlvbmFyeTogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBwZXJzb25hbERpY3Rpb25hcnkoeyBraW5kLCBpbmNsdWRlX2FyY2hpdmVkID0gZmFsc2UsIGxpbWl0ID0gMTAwLCBvZmZzZXQgPSAwIH0gPSB7fSkge1xuICAgICAgICBjb25zdCBxcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKTtcbiAgICAgICAgaWYgKGtpbmQpIHFzLnNldChcImtpbmRcIiwga2luZCk7XG4gICAgICAgIGlmIChpbmNsdWRlX2FyY2hpdmVkKSBxcy5zZXQoXCJpbmNsdWRlX2FyY2hpdmVkXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgaWYgKGxpbWl0KSBxcy5zZXQoXCJsaW1pdFwiLCBTdHJpbmcobGltaXQpKTtcbiAgICAgICAgaWYgKG9mZnNldCkgcXMuc2V0KFwib2Zmc2V0XCIsIFN0cmluZyhvZmZzZXQpKTtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvcGVyc29uYWwtZGljdGlvbmFyeT9cIiArIHFzLnRvU3RyaW5nKCkpO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHN5bWJvbHM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBwZXJzb25hbERpY3Rpb25hcnlSZWZyZXNoOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHBlcnNvbmFsRGljdGlvbmFyeVJlZnJlc2goKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL3BlcnNvbmFsLWRpY3Rpb25hcnkvcmVmcmVzaFwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7fSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHVwc2VydHM6IDAsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIHBlcnNvbmFsRGljdGlvbmFyeUdlbmVyYXRlQW5nbGVzOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHBlcnNvbmFsRGljdGlvbmFyeUdlbmVyYXRlQW5nbGVzKHN5bWJvbElkLCB7IGZvcmNlID0gZmFsc2UgfSA9IHt9KSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL3BlcnNvbmFsLWRpY3Rpb25hcnkvXCIgKyBlbmNvZGVVUklDb21wb25lbnQoc3ltYm9sSWQpICsgXCIvZ2VuZXJhdGUtYW5nbGVzXCIsIHtcbiAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgZm9yY2UgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHBhcGVyOiBcIlwiLCBzdG9uZTogXCJcIiwgc2lsazogXCJcIiwgZXZvbHV0aW9uOiBcIlwiLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBwZXJzb25hbERpY3Rpb25hcnlBcmNoaXZlOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHBlcnNvbmFsRGljdGlvbmFyeUFyY2hpdmUoc3ltYm9sSWQpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcIi9hcGkvcGVyc29uYWwtZGljdGlvbmFyeS9cIiArIGVuY29kZVVSSUNvbXBvbmVudChzeW1ib2xJZCksIHtcbiAgICAgICAgICBtZXRob2Q6IFwiREVMRVRFXCIsXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IGFyY2hpdmVkOiBmYWxzZSwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgLy8gXHUyNTAwXHUyNTAwIEJJRyBEUkVBTVMgV09SS0ZMT1cgKEZlYXR1cmUgMywgMjAyNi0wNC0yOSkgXHUyNTAwXHUyNTAwXG4gICAgc3RhcnRCaWdEcmVhbVdvcmtmbG93OiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0QmlnRHJlYW1Xb3JrZmxvdyhrYWlyb3NJZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9iaWdkcmVhbS93b3JrZmxvdy9zdGFydFwiLCB7XG4gICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGthaXJvc19pZDoga2Fpcm9zSWQgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgICgpID0+ICh7IHdvcmtmbG93OiBudWxsLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBnZXRCaWdEcmVhbVdvcmtmbG93OiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGdldEJpZ0RyZWFtV29ya2Zsb3cod29ya2Zsb3dJZCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9iaWdkcmVhbS93b3JrZmxvdy9cIiArIGVuY29kZVVSSUNvbXBvbmVudCh3b3JrZmxvd0lkKSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgd29ya2Zsb3c6IG51bGwsIHN0ZXBzOiBbXSwga2Fpcm9zOiBudWxsLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBjb21wbGV0ZUJpZ0RyZWFtU3RlcDogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBjb21wbGV0ZUJpZ0RyZWFtU3RlcCh3b3JrZmxvd0lkLCBkYXksIHsgY2FwdHVyZV90ZXh0ID0gbnVsbCwgY2FwdHVyZV92b2ljZSA9IGZhbHNlIH0gPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFxuICAgICAgICAgIFwiL2FwaS9iaWdkcmVhbS93b3JrZmxvdy9cIiArIGVuY29kZVVSSUNvbXBvbmVudCh3b3JrZmxvd0lkKSArXG4gICAgICAgICAgXCIvc3RlcC9cIiArIGVuY29kZVVSSUNvbXBvbmVudChTdHJpbmcoZGF5KSkgKyBcIi9jb21wbGV0ZVwiLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGNhcHR1cmVfdGV4dCwgY2FwdHVyZV92b2ljZSB9KSxcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgc3RlcDogbnVsbCwgY3VycmVudF9kYXk6IG51bGwsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGdlbmVyYXRlQmlnRHJlYW1DbG9zaW5nTGV0dGVyOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGdlbmVyYXRlQmlnRHJlYW1DbG9zaW5nTGV0dGVyKHdvcmtmbG93SWQpIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcbiAgICAgICAgICBcIi9hcGkvYmlnZHJlYW0vd29ya2Zsb3cvXCIgKyBlbmNvZGVVUklDb21wb25lbnQod29ya2Zsb3dJZCkgKyBcIi9jbG9zaW5nLWxldHRlclwiLFxuICAgICAgICAgIHsgbWV0aG9kOiBcIlBPU1RcIiB9XG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgY2xvc2luZ19sZXR0ZXI6IG51bGwsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIHJlcXVlc3RCaWdEcmVhbUh1bWFuUHVzaDogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiByZXF1ZXN0QmlnRHJlYW1IdW1hblB1c2goeyBrYWlyb3NfaWQgPSBudWxsLCB3b3JrZmxvd19pZCA9IG51bGwsIHVzZXJfcmVxdWVzdF90ZXh0IH0gPSB7fSkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9iaWdkcmVhbS9odW1hbi1wdXNoL3JlcXVlc3RcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBrYWlyb3NfaWQsIHdvcmtmbG93X2lkLCB1c2VyX3JlcXVlc3RfdGV4dCB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgcHVzaDogbnVsbCwgcGF5bWVudDogbnVsbCwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgbGlzdEJpZ0RyZWFtSHVtYW5QdXNoZXM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbGlzdEJpZ0RyZWFtSHVtYW5QdXNoZXMoKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXCIvYXBpL2JpZ2RyZWFtL2h1bWFuLXB1c2gvbGlzdFwiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBwdXNoZXM6IFtdLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICAvLyBcdTI1MDBcdTI1MDAgUkVDVVJSSU5HIERSRUFNIFBBVFRFUk5TIChGZWF0dXJlIDQsIDIwMjYtMDQtMjkpIFx1MjUwMFx1MjUwMFxuICAgIGRldGVjdFJlY3VycmluZ1BhdHRlcm5zOiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIGRldGVjdFJlY3VycmluZ1BhdHRlcm5zKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9kcmVhbS1jaGF0L3JlY3VycmluZy9kZXRlY3RcIiwge1xuICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe30pLFxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBwYXR0ZXJuc191cHNlcnRlZDogMCwgcGVuZGluZ19jcmVhdGVkOiAwLCBfc2VlZDogdHJ1ZSB9KVxuICAgICksXG5cbiAgICBsaXN0UmVjdXJyaW5nUGF0dGVybnM6IHNhZmVDYWxsKFxuICAgICAgYXN5bmMgZnVuY3Rpb24gbGlzdFJlY3VycmluZ1BhdHRlcm5zKCkge1xuICAgICAgICByZXR1cm4ganNvbkZldGNoKFwiL2FwaS9kcmVhbS1jaGF0L3JlY3VycmluZ1wiKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBwYXR0ZXJuczogW10sIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcblxuICAgIGFja25vd2xlZGdlUmVjdXJyaW5nUGF0dGVybjogc2FmZUNhbGwoXG4gICAgICBhc3luYyBmdW5jdGlvbiBhY2tub3dsZWRnZVJlY3VycmluZ1BhdHRlcm4ocGF0dGVybklkKSB7XG4gICAgICAgIHJldHVybiBqc29uRmV0Y2goXG4gICAgICAgICAgXCIvYXBpL2RyZWFtLWNoYXQvcmVjdXJyaW5nL1wiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhdHRlcm5JZCkgKyBcIi9hY2tub3dsZWRnZVwiLFxuICAgICAgICAgIHsgbWV0aG9kOiBcIlBPU1RcIiB9XG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgKCkgPT4gKHsgcGF0dGVybjogbnVsbCwgc3VnZ2VzdGlvbjogbnVsbCwgX3NlZWQ6IHRydWUgfSlcbiAgICApLFxuXG4gICAgc3RhcnRSZWN1cnJpbmdSZUVudHJ5OiBzYWZlQ2FsbChcbiAgICAgIGFzeW5jIGZ1bmN0aW9uIHN0YXJ0UmVjdXJyaW5nUmVFbnRyeShwYXR0ZXJuSWQsIHsgY2FwdHVyZV90ZXh0ID0gbnVsbCwgY2FwdHVyZV9tZXRob2QgPSBcInRleHRcIiB9ID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGpzb25GZXRjaChcbiAgICAgICAgICBcIi9hcGkvZHJlYW0tY2hhdC9yZWN1cnJpbmcvXCIgKyBlbmNvZGVVUklDb21wb25lbnQocGF0dGVybklkKSArIFwiL3JlLWVudHJ5LXNlc3Npb25cIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjYXB0dXJlX3RleHQsIGNhcHR1cmVfbWV0aG9kIH0pLFxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICAoKSA9PiAoeyBzZXNzaW9uOiBudWxsLCBndWlkYW5jZTogbnVsbCwgZXhpdF90b19odW1hbjogZmFsc2UsIF9zZWVkOiB0cnVlIH0pXG4gICAgKSxcbiAgfTtcblxuICB3aW5kb3cuRHJlYW1BUEkgPSBEcmVhbUFQSTtcbn0pKCk7XG4iXSwKICAibWFwcGluZ3MiOiAiQ0FXQyxTQUFTLGdCQUFnQjtBQUV4QixpQkFBZSxZQUFZLFFBQVEsQ0FBQyxHQUFHO0FBQ3JDLFVBQU0sVUFBVSxFQUFFLEdBQUcsTUFBTTtBQUMz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
