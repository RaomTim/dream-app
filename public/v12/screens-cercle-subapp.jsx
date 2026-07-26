/* global React */
// ──────────────────────────────────────────────────────────────
// Dream V1.2 — CercleSubApp (refonte 2026-04-28 — Yeshua)
//
// Spec : 2_DESIGN.md §11.bis.20.11 (Cercle avec IA gardienne)
//        3_TECHNICAL.md §39.5/39.6 (tables + routes circle/*)
//
// Refonte du Cercle en sous-app à 5 onglets :
//   1. Membres        — réutilise circle_members (data déjà existante)
//   2. Dépôts         — réutilise circle_shares + restitutions (CercleDetail legacy)
//   3. Chat cercle    — NEW : chat IA gardienne via /api/circles/[id]/chat/converse
//   4. Portrait       — NEW : lettre mensuelle via /api/circles/[id]/portrait/generate
//   5. Intentions     — NEW : CRUD via /api/circles/[id]/intentions
//
// Routing : window.CercleSubApp prend la place de window.CercleDetail dans app.jsx
// (fallback gracieux sur CercleDetail legacy si window.CercleSubApp n'est pas dispo).
//
// Style : night-warm + EB Garamond italic + chips, conformément aux autres écrans.
// ──────────────────────────────────────────────────────────────

const { useState: uSAS, useEffect: uSAE, useMemo: uSAM, useRef: uSAR, useCallback: uSAC } = React;

// ── Helpers partagés ──────────────────────────────────────────
function _relWhen(iso) {
  if (!iso) return "récemment";
  try {
    return window.DreamAPI?._relativeWhen?.(iso) || "récemment";
  } catch {
    return "récemment";
  }
}

function _glyph(idx) {
  const g = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ", "ι", "κ", "λ", "μ"];
  return g[idx % g.length];
}

async function _authedFetch(url, opts = {}) {
  // Réutilise le bridge Auth si dispo (Bearer token), sinon laisse passer.
  let headers = { ...(opts.headers || {}) };
  try {
    const sess = window.DreamAuth?.getSession?.();
    const token = sess?.access_token;
    if (token) headers["Authorization"] = "Bearer " + token;
  } catch {}
  if (opts.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(url, { ...opts, headers });
}

// ── Onglet : Membres ──────────────────────────────────────────
const TabMembres = ({ circle, members, circleId }) => {
  const count = members?.length || circle?.member_count || 1;
  const [inviteData, setInviteData] = uSAS(null); // { token, share_url, expires_at, uses_remaining }
  const [creating, setCreating] = uSAS(false);
  const [error, setError] = uSAS(null);
  const [copied, setCopied] = uSAS(false);

  const generateInvite = async () => {
    setCreating(true);
    setError(null);
    try {
      const r = await _authedFetch(`/api/circles/${encodeURIComponent(circleId)}/invitations`, {
        method: "POST",
        body: JSON.stringify({ uses_remaining: 12, expires_in_days: 14 }),
      });
      const data = await r.json();
      if (!r.ok) {
        setError(data?.error || "génération impossible");
      } else {
        setInviteData(data);
      }
    } catch (e) {
      setError(e?.message || "génération impossible");
    } finally {
      setCreating(false);
    }
  };

  const doCopy = async () => {
    if (!inviteData?.share_url) return;
    try {
      await navigator.clipboard?.writeText(inviteData.share_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {}
  };

  const doShare = async () => {
    if (!inviteData?.share_url) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: (circle?.name || "cercle") + " · Dream",
          text: "tu es invité·e à tenir ce cercle dans Dream",
          url: inviteData.share_url,
        });
      } catch {}
    } else {
      doCopy();
    }
  };

  const openPreview = () => {
    if (inviteData?.share_url) window.open(inviteData.share_url, "_blank", "noopener");
  };

  return (
    <div>
      <div
        className="meta op-70 mb-l"
        style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}
      >
        {count} {count > 1 ? "personnes tiennent" : "personne tient"} ce cercle. les pseudos sont génériques — l'identité est portée par la voix, pas par le nom.
      </div>
      <div className="row mb-xl" style={{ gap: 10, flexWrap: "wrap" }}>
        {Array.from({ length: Math.min(count, 12) }, (_, i) => (
          <div
            key={i}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "1px solid var(--ash-deep)",
              display: "grid", placeItems: "center",
              fontFamily: "var(--serif)", fontStyle: "italic",
              fontSize: 15, color: "var(--ash-light)",
              background: "color-mix(in oklch, var(--stone-cool) 4%, transparent)",
            }}
          >
            {_glyph(i)}
          </div>
        ))}
        {count > 12 && (
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic",
            color: "var(--ash-light)", fontSize: 14, alignSelf: "center",
          }}>
            +{count - 12}
          </div>
        )}
      </div>

      {/* Bouton "✦ inviter" (T1 Niveau 3) — invitation magique */}
      {!inviteData && (
        <div className="mt-l">
          <button
            className="btn-ghost"
            onClick={generateInvite}
            disabled={creating || !!circle?.closed_at}
          >
            {creating ? "…" : "✦ inviter"}
          </button>
          {error && (
            <div className="meta mt-s" style={{
              color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic",
            }}>
              {error}
            </div>
          )}
        </div>
      )}

      {inviteData && (
        <div
          className="card mt-l"
          style={{
            padding: "var(--s-4)",
            background: "color-mix(in oklch, var(--silk-gold) 4%, var(--night-floor))",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
            borderRadius: 0,
          }}
        >
          <div className="meta-mono mb-s" style={{
            fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
            color: "var(--silk-gold)", textTransform: "uppercase",
          }}>
            ✦ lien d'invitation prêt
          </div>
          <p
            className="seuil-italic mb-m"
            style={{
              color: "var(--bone)", fontSize: 14, lineHeight: 1.6,
              fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 480,
            }}
          >
            partage ce lien à qui tu veux inviter. il révèle l'intention du cercle —
            jamais les noms des membres. {inviteData.uses_remaining} utilisations
            restantes · expire {_relWhen(inviteData.expires_at)}.
          </p>
          <div
            className="card mb-m"
            style={{
              padding: "var(--s-3) var(--s-4)",
              background: "var(--night-floor)",
              border: "1px solid var(--ash-deep)",
              fontFamily: "var(--mono)",
              fontSize: 12,
              color: "var(--ash-light)",
              wordBreak: "break-all",
              userSelect: "all",
            }}
          >
            {inviteData.share_url}
          </div>
          <div className="row gap-s" style={{ flexWrap: "wrap" }}>
            <button className="btn-ghost" onClick={doCopy}>
              {copied ? "✓ copié" : "copier le lien"}
            </button>
            {typeof navigator !== "undefined" && navigator.share && (
              <button className="btn-text" onClick={doShare}>
                partager…
              </button>
            )}
            <button className="btn-text" onClick={openPreview} style={{ color: "var(--ash-light)" }}>
              voir le preview
            </button>
            <button
              className="btn-text"
              onClick={() => { setInviteData(null); setCopied(false); }}
              style={{ color: "var(--ash-light)" }}
            >
              générer un autre
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Onglet : Dépôts (réutilise CercleDetail legacy si dispo) ──
const TabDepots = ({ circle, circleId, go }) => {
  // Pour MVP — on rend la version legacy CercleDetail (restitutions + opt-in kairos)
  // dans une version condensée. Si window.CercleDetail existe, on délègue.
  if (window.CercleDetail) {
    return (
      <div className="dream-cercle-legacy-host">
        <window.CercleDetail go={go} circleId={circleId} />
      </div>
    );
  }
  return (
    <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
      les dépôts s'afficheront ici une fois le module legacy chargé.
    </div>
  );
};

// ── Onglet : Chat cercle (IA gardienne) ───────────────────────
const TabChat = ({ circleId }) => {
  const [messages, setMessages] = uSAS([]);
  const [loading, setLoading] = uSAS(true);
  const [input, setInput] = uSAS("");
  const [sending, setSending] = uSAS(false);
  const [streaming, setStreaming] = uSAS(""); // buffer streaming IA
  const [error, setError] = uSAS(null);
  const scrollRef = uSAR(null);

  const fetchMessages = uSAC(async () => {
    try {
      const r = await _authedFetch(`/api/circles/${circleId}/chat/converse`);
      const data = await r.json();
      if (data?.messages) setMessages(data.messages);
      setLoading(false);
    } catch (e) {
      console.warn("[TabChat] fetch failed:", e?.message);
      setLoading(false);
    }
  }, [circleId]);

  uSAE(() => { fetchMessages(); }, [fetchMessages]);

  uSAE(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streaming]);

  const send = async (overrideText, voiceMeta) => {
    const text = (typeof overrideText === "string" ? overrideText : input).trim();
    if (!text || sending) return;
    setSending(true);
    setError(null);
    setStreaming("");
    if (typeof overrideText !== "string") setInput("");

    // Optimistic — push user message
    const optimistic = {
      id: "tmp-" + Date.now(),
      user_id: "me",
      is_ai_gardienne: false,
      content: text,
      created_at: new Date().toISOString(),
      is_voice: !!voiceMeta,
      voice_duration_ms: voiceMeta?.duration_ms || null,
    };
    setMessages((m) => [...m, optimistic]);

    try {
      const payload = { message: text };
      if (voiceMeta) {
        payload.is_voice = true;
        payload.voice_duration_ms = voiceMeta.duration_ms || null;
        if (voiceMeta.lang) payload.voice_transcript_lang = voiceMeta.lang;
      }
      const r = await _authedFetch(`/api/circles/${circleId}/chat/converse`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const ct = r.headers.get("Content-Type") || "";
      // Si pas SSE (cas pas-trigger ou erreur JSON), on lit JSON
      if (!ct.includes("text/event-stream")) {
        const data = await r.json().catch(() => ({}));
        if (data?.error) setError(data.error);
        // refresh full
        await fetchMessages();
        setSending(false);
        return;
      }

      // SSE streaming
      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          try {
            const ev = JSON.parse(t.slice(5).trim());
            if (ev.type === "chunk" && ev.text) {
              setStreaming((s) => s + ev.text);
            } else if (ev.type === "sanctuaire" && ev.text) {
              setStreaming(ev.text);
            } else if (ev.type === "error" && ev.error) {
              setError(ev.error);
            }
          } catch {}
        }
      }

      // Refresh complet pour avoir l'état serveur
      await fetchMessages();
      setStreaming("");
    } catch (e) {
      setError(e?.message || "envoi non abouti");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="stack gap-m">
      <p
        className="meta op-70 mb-s"
        style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}
      >
        ici on écrit ensemble. l'IA gardienne reste silencieuse — appelle-la avec @Anima ou /forêt /synthèse /intention.
      </p>

      <div
        ref={scrollRef}
        className="card"
        style={{
          padding: "var(--s-3) var(--s-4)",
          background: "color-mix(in oklch, var(--night-warm) 70%, var(--night-floor))",
          border: "1px solid var(--ash-deep)", borderRadius: 0,
          maxHeight: 480, overflowY: "auto",
        }}
      >
        {loading ? (
          <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            chargement…
          </div>
        ) : messages.length === 0 && !streaming ? (
          <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
            le cercle est silencieux. dépose le premier mot.
          </div>
        ) : (
          <div className="stack gap-s">
            {messages.map((m) => (
              <ChatMessageRow key={m.id} msg={m} />
            ))}
            {streaming && (
              <ChatMessageRow
                msg={{
                  id: "streaming",
                  is_ai_gardienne: true,
                  content: streaming,
                  voice_attribution: "gardienne",
                  created_at: new Date().toISOString(),
                }}
                streaming
              />
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="meta" style={{
          color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic",
        }}>
          {error}
        </div>
      )}

      <div className="row gap-s" style={{ alignItems: "flex-end" }}>
        <textarea
          className="field-textarea"
          placeholder="déposer un mot dans le cercle…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          style={{ flex: 1 }}
          disabled={sending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        {window.ChatVoiceMicButton && (
          <window.ChatVoiceMicButton
            disabled={sending}
            onTranscribed={({ transcript, duration_ms, lang }) => {
              if (transcript) send(transcript, { duration_ms, lang });
            }}
          />
        )}
        <button
          className="btn-ghost"
          disabled={sending || !input.trim()}
          onClick={() => send()}
          style={{ minWidth: 100 }}
        >
          {sending ? "…" : "déposer"}
        </button>
      </div>
      <div className="meta op-50" style={{
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
      }}>
        @Anima · /forêt · /synthèse · /intention
      </div>
    </div>
  );
};

const ChatMessageRow = ({ msg, streaming }) => {
  const ai = msg.is_ai_gardienne;
  return (
    <div
      className="card"
      style={{
        padding: "var(--s-3) var(--s-4)",
        background: ai
          ? "color-mix(in oklch, var(--silk-gold) 5%, var(--night-floor))"
          : "transparent",
        border: ai
          ? "1px solid color-mix(in oklch, var(--silk-gold) 25%, var(--ash-deep))"
          : "1px solid var(--ash-deep)",
        borderRadius: 0,
        opacity: streaming ? 0.85 : 1,
      }}
    >
      <div className="meta-mono mb-s" style={{
        fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
        color: ai ? "var(--silk-gold)" : "var(--ash-light)",
        textTransform: "uppercase",
      }}>
        {ai ? (msg.voice_attribution || "gardienne") : "voix du cercle"} · {_relWhen(msg.created_at)}
        {msg.triggered_by_keyword && (
          <span style={{ marginLeft: 8, opacity: 0.7 }}>· {msg.triggered_by_keyword}</span>
        )}
        {msg.is_voice && (
          <span style={{ marginLeft: 8, color: "var(--silk-gold)" }}>
            · 🎙{msg.voice_duration_ms ? " " + Math.round(msg.voice_duration_ms / 1000) + "s" : ""}
          </span>
        )}
      </div>
      <div style={{
        fontFamily: "var(--serif)",
        fontStyle: ai ? "italic" : "normal",
        fontSize: 15, lineHeight: 1.6, color: "var(--bone)",
        textWrap: "pretty", whiteSpace: "pre-wrap",
      }}>
        {msg.content}
        {streaming && <span style={{ opacity: 0.5 }}>▍</span>}
      </div>
    </div>
  );
};

// ── Onglet : Portrait du cercle ───────────────────────────────
const TabPortrait = ({ circleId }) => {
  const [lettre, setLettre] = uSAS(null);
  const [loading, setLoading] = uSAS(false);
  const [info, setInfo] = uSAS(null);
  const [error, setError] = uSAS(null);

  const generate = async (force = false) => {
    setLoading(true);
    setError(null);
    setInfo(null);
    try {
      const r = await _authedFetch(`/api/circles/${circleId}/portrait/generate`, {
        method: "POST",
        body: JSON.stringify({ force }),
      });
      const data = await r.json();
      if (data?.error) {
        setError(data.error);
      } else if (data?.k_anonymity_failed) {
        setLettre(null);
        setInfo(data.message || "pas encore assez de voix.");
      } else if (data?.empty) {
        setLettre(null);
        setInfo(data.message || "rien à tisser pour le moment.");
      } else if (data?.lettre) {
        setLettre(data.lettre);
        setInfo(data.cached
          ? `version générée ${_relWhen(data.generated_at)} — cache mensuel`
          : "version fraîche");
      } else {
        setError("réponse inattendue");
      }
    } catch (e) {
      setError(e?.message || "génération non aboutie");
    } finally {
      setLoading(false);
    }
  };

  uSAE(() => { generate(false); /* eslint-disable-next-line */ }, [circleId]);

  return (
    <div className="stack gap-m">
      <p
        className="meta op-70"
        style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}
      >
        une lettre tissée chaque mois à partir des motifs collectifs déposés dans le cercle. anonyme par construction. au moins 5 voix doivent avoir contribué.
      </p>

      {loading && (
        <div className="text-center" style={{ padding: "var(--s-5)" }}>
          <div className="breath" style={{ margin: "0 auto" }} />
          <p className="seuil-italic mt-m" style={{ color: "var(--ash-light)" }}>
            la lettre se forme.
          </p>
        </div>
      )}

      {!loading && lettre && (
        <div
          className="card"
          style={{
            padding: "var(--s-5) var(--s-4)",
            background: "var(--night-warm)",
            border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
            borderRadius: 0,
          }}
        >
          {info && (
            <div className="meta-mono mb-m" style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              color: "var(--silk-gold)", textTransform: "uppercase",
            }}>
              {info}
            </div>
          )}
          <div style={{
            fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
            lineHeight: 1.7, color: "var(--bone)", textWrap: "pretty",
            whiteSpace: "pre-wrap",
          }}>
            {lettre}
          </div>
        </div>
      )}

      {!loading && !lettre && info && (
        <div className="card" style={{
          padding: "var(--s-4)", background: "transparent",
          border: "1px solid var(--ash-deep)", borderRadius: 0,
        }}>
          <p className="seuil-italic" style={{ color: "var(--ash-light)", maxWidth: 480 }}>
            {info}
          </p>
        </div>
      )}

      {error && (
        <div className="meta" style={{
          color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic",
        }}>
          {error}
        </div>
      )}

      <div className="row gap-m mt-s" style={{ flexWrap: "wrap" }}>
        <button className="btn-ghost" disabled={loading} onClick={() => generate(true)}>
          {loading ? "génération…" : "régénérer"}
        </button>
      </div>
    </div>
  );
};

// ── Onglet : Intentions ───────────────────────────────────────
const TabIntentions = ({ circleId }) => {
  const [intentions, setIntentions] = uSAS([]);
  const [loading, setLoading] = uSAS(true);
  const [proposeOpen, setProposeOpen] = uSAS(false);
  const [draftText, setDraftText] = uSAS("");
  const [draftUntil, setDraftUntil] = uSAS("");
  const [busy, setBusy] = uSAS(false);
  const [error, setError] = uSAS(null);

  const fetchAll = uSAC(async () => {
    try {
      const r = await _authedFetch(`/api/circles/${circleId}/intentions`);
      const data = await r.json();
      // Filtre les marqueurs portrait (ne pas afficher comme intentions)
      const filtered = (data?.intentions || []).filter((i) => i.intention_text !== "__portrait_mensuel__");
      setIntentions(filtered);
    } catch (e) {
      console.warn("[TabIntentions] fetch failed:", e?.message);
    } finally {
      setLoading(false);
    }
  }, [circleId]);

  uSAE(() => { fetchAll(); }, [fetchAll]);

  const propose = async () => {
    const text = draftText.trim();
    if (!text || busy) return;
    setBusy(true);
    setError(null);
    try {
      const r = await _authedFetch(`/api/circles/${circleId}/intentions`, {
        method: "POST",
        body: JSON.stringify({
          intention_text: text,
          active_until: draftUntil || null,
        }),
      });
      const data = await r.json();
      if (data?.error) setError(data.error);
      else {
        setDraftText("");
        setDraftUntil("");
        setProposeOpen(false);
        await fetchAll();
      }
    } catch (e) {
      setError(e?.message || "proposition non aboutie");
    } finally {
      setBusy(false);
    }
  };

  const vote = async (intentionId) => {
    setBusy(true);
    try {
      await _authedFetch(`/api/circles/${circleId}/intentions/${intentionId}/vote`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      await fetchAll();
    } catch (e) {
      console.warn("[TabIntentions] vote failed:", e?.message);
    } finally {
      setBusy(false);
    }
  };

  const archive = async (intentionId) => {
    if (!confirm("archiver cette intention ?")) return;
    setBusy(true);
    try {
      await _authedFetch(`/api/circles/${circleId}/intentions/${intentionId}`, {
        method: "DELETE",
      });
      await fetchAll();
    } catch (e) {
      console.warn("[TabIntentions] archive failed:", e?.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack gap-m">
      <p
        className="meta op-70"
        style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}
      >
        une intention n'est pas un objectif. c'est une orientation que le cercle tient ensemble. propose, vote, laisse vivre.
      </p>

      {loading ? (
        <div className="meta op-70" style={{ fontFamily: "var(--serif)", fontStyle: "italic" }}>
          chargement…
        </div>
      ) : intentions.length === 0 ? (
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          aucune intention active. propose la première.
        </p>
      ) : (
        <div className="stack gap-s">
          {intentions.map((it) => (
            <IntentionRow
              key={it.id}
              intention={it}
              onVote={() => vote(it.id)}
              onArchive={() => archive(it.id)}
              busy={busy}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="meta" style={{
          color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic",
        }}>
          {error}
        </div>
      )}

      {!proposeOpen ? (
        <button className="btn-ghost mt-m" onClick={() => setProposeOpen(true)}>
          + proposer une intention
        </button>
      ) : (
        <div className="card mt-m" style={{
          padding: "var(--s-4)",
          background: "color-mix(in oklch, var(--stone-cool) 5%, var(--night-floor))",
          border: "1px solid color-mix(in oklch, var(--silk-gold) 18%, var(--ash-deep))",
          borderRadius: 0,
        }}>
          <textarea
            className="field-textarea mb-m"
            placeholder="traverser cette saison sans se précipiter. tenir nos désaccords sans rompre. écouter ce qui revient dans nos rêves…"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={3}
            autoFocus
          />
          <div className="row gap-s mb-m" style={{ alignItems: "center" }}>
            <label className="meta op-70" style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 13,
            }}>
              active jusqu'au (optionnel) :
            </label>
            <input
              type="date"
              className="field-input"
              value={draftUntil}
              onChange={(e) => setDraftUntil(e.target.value)}
              style={{ maxWidth: 200 }}
            />
          </div>
          <div className="row gap-m" style={{ justifyContent: "flex-end" }}>
            <button className="btn-text" onClick={() => setProposeOpen(false)} disabled={busy}>
              annuler
            </button>
            <button className="btn-ghost" onClick={propose} disabled={busy || !draftText.trim()}>
              {busy ? "…" : "proposer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const IntentionRow = ({ intention, onVote, onArchive, busy }) => {
  const until = intention.active_until
    ? new Date(intention.active_until).toLocaleDateString("fr-FR")
    : null;
  return (
    <div
      className="card"
      style={{
        padding: "var(--s-3) var(--s-4)",
        background: "transparent",
        border: "1px solid var(--ash-deep)",
        borderRadius: 0,
      }}
    >
      <div style={{
        fontFamily: "var(--serif)", fontStyle: "italic",
        fontSize: 16, lineHeight: 1.55, color: "var(--bone)",
        textWrap: "pretty",
      }}>
        « {intention.intention_text} »
      </div>
      <div className="row mt-s" style={{
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8,
      }}>
        <div className="meta-mono" style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em",
          color: "var(--ash-light)", textTransform: "uppercase",
        }}>
          {_relWhen(intention.created_at)}
          {until && <span> · jusqu'au {until}</span>}
          {" · "}
          <span style={{ color: "var(--silk-gold)" }}>
            {intention.votes_count || 0} {intention.votes_count === 1 ? "voix" : "voix"}
          </span>
        </div>
        <div className="row gap-s">
          <button
            className="btn-text"
            disabled={busy}
            onClick={onVote}
            style={{ fontSize: 12.5 }}
          >
            tenir cette intention
          </button>
          <button
            className="btn-text"
            disabled={busy}
            onClick={onArchive}
            style={{ fontSize: 12.5, color: "var(--ash-light)" }}
          >
            archiver
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Onglet : Rituel de clôture (T2 Niveau 3) ──────────────────
// Affiché uniquement si circle.closed_at IS NOT NULL.
// Charge la restitution finale via /api/circles/[id]/restitutions et trouve
// celle marquée is_closure_restitution = true (ou la plus récente fallback).
const TabCloture = ({ circle, circleId }) => {
  const [restitution, setRestitution] = uSAS(null);
  const [loading, setLoading] = uSAS(true);
  const [error, setError] = uSAS(null);

  uSAE(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const r = await _authedFetch(`/api/circles/${encodeURIComponent(circleId)}/restitutions`);
        const data = await r.json();
        if (cancelled) return;
        if (!r.ok) {
          setError(data?.error || "lecture finale introuvable");
        } else {
          const list = data?.restitutions || [];
          // Trouve la closure restitution prioritairement
          const closure = list.find((x) => x.is_closure_restitution || x.id === circle?.closure_restitution_id);
          setRestitution(closure || list[0] || null);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "lecture finale introuvable");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [circleId, circle?.closure_restitution_id]);

  const archiveToMemories = async () => {
    // V1 : on copie le texte dans la presse-papier comme premier geste d'archivage doux.
    // V2 : insertion dans une table user_archived_restitutions ou export PDF.
    if (!restitution?.narrative_text) return;
    try {
      await navigator.clipboard?.writeText(restitution.narrative_text);
      alert("la lecture finale est dans ton presse-papier — colle-la où tu gardes tes mémoires.");
    } catch {
      alert("copie manuelle nécessaire — sélectionne le texte ci-dessus.");
    }
  };

  return (
    <div className="stack gap-m">
      <p
        className="meta op-70"
        style={{ fontFamily: "var(--serif)", fontStyle: "italic", maxWidth: 560 }}
      >
        ce cercle s'est refermé. trois voix tressées — paper, stone, silk — sont
        venues poser ce qui a traversé pendant cette traversée. la trame reste,
        anonyme et nue, dans tes mémoires si tu veux.
      </p>

      {loading && (
        <div className="text-center" style={{ padding: "var(--s-5)" }}>
          <div className="breath" style={{ margin: "0 auto" }} />
          <p className="seuil-italic mt-m" style={{ color: "var(--ash-light)" }}>
            la lecture finale se charge.
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="meta" style={{
          color: "var(--ember-live)", fontFamily: "var(--serif)", fontStyle: "italic",
        }}>
          {error}
        </div>
      )}

      {!loading && restitution && (
        <>
          <div
            className="card"
            style={{
              padding: "var(--s-5) var(--s-4)",
              background: "var(--night-warm)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 14%, var(--ash-deep))",
              borderRadius: 0,
            }}
          >
            <div className="meta-mono mb-m" style={{
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
              color: "var(--silk-gold)", textTransform: "uppercase",
            }}>
              ✦ lecture finale · {_relWhen(restitution.requested_at || restitution.generated_at || circle?.closed_at)}
            </div>
            <div style={{
              fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 17,
              lineHeight: 1.75, color: "var(--bone)", textWrap: "pretty",
              whiteSpace: "pre-wrap",
            }}>
              {restitution.narrative_text || "(la lecture finale n'a pas pu être tissée.)"}
            </div>
          </div>

          <div className="row gap-m mt-s" style={{ flexWrap: "wrap" }}>
            <button className="btn-ghost" onClick={archiveToMemories}>
              archiver dans mes mémoires
            </button>
          </div>
        </>
      )}

      {!loading && !restitution && !error && (
        <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
          aucune lecture finale n'a encore été tissée pour ce cercle.
        </p>
      )}
    </div>
  );
};

// ── CercleSubApp — wrapper avec nav 5 onglets ─────────────────
const CercleSubApp = ({ go, circleId }) => {
  const [tab, setTab] = uSAS(() => {
    try {
      const m = (location.hash || "").match(/[?&]tab=([a-z-]+)/);
      return m ? m[1] : "depots";
    } catch { return "depots"; }
  });
  const [circle, setCircle] = uSAS(null);
  const [members, setMembers] = uSAS([]);
  const [loading, setLoading] = uSAS(true);

  uSAE(() => {
    let cancelled = false;
    if (!circleId) {
      setLoading(false);
      return;
    }
    window.DreamAPI.listCircles()
      .then((d) => {
        if (cancelled) return;
        const found = (d?.circles || []).find((c) => c.id === circleId);
        setCircle(found || null);
        // members data : on a member_count, et on n'a pas de listMembers, donc fallback count.
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [circleId]);

  if (loading) {
    return (
      <div className="stage" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("cercle")} label="" />
        <div className="frame center" style={{ minHeight: "calc(100vh - 60px)" }}>
          <div className="breath" />
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
        <window.TopNav showBack onBack={() => go("cercle")} label="" />
        <div className="frame center" style={{ paddingTop: "var(--s-6)" }}>
          <p className="seuil-italic" style={{ color: "var(--ash-light)" }}>
            ce cercle ne te tient plus, ou n'existe pas.
          </p>
          <button className="btn-text mt-l" onClick={() => go("cercle")}>
            ← retour à tes cercles
          </button>
        </div>
      </div>
    );
  }

  const isEphemeral = !!circle?.ephemeral_until;
  const isClosed = !!circle?.closed_at;
  const ephemeralCountdown = uSAM(() => {
    if (!isEphemeral || isClosed) return null;
    const ms = new Date(circle.ephemeral_until).getTime() - Date.now();
    if (ms <= 0) return { days: 0, hours: 0, label: "ce cercle se referme aujourd'hui" };
    const days = Math.floor(ms / (24 * 3600 * 1000));
    const hours = Math.floor((ms % (24 * 3600 * 1000)) / (3600 * 1000));
    let label;
    if (days >= 2) label = `ce cercle se referme dans ${days} jours`;
    else if (days === 1) label = "ce cercle se referme demain";
    else label = `ce cercle se referme dans ${hours} heures`;
    return { days, hours, label };
  }, [isEphemeral, isClosed, circle?.ephemeral_until]);

  const TABS = [
    ...(isClosed ? [["closure", "✦ rituel de clôture"]] : []),
    ["depots", "dépôts"],
    ["chat", "chat"],
    ["synchronicites", "synchronicités"],
    ["meteo", "météo"],
    ["annales", "annales"],
    ["rituels", "rituels"],
    ["intentions", "intentions"],
    ["portrait", "portrait"],
    ["membres", "membres"],
  ];

  return (
    <div className="stage screen-enter" style={{ background: "var(--night-floor)" }}>
      <window.TopNav showBack onBack={() => go("cercle")} label="" />
      <div className="frame" style={{ position: "relative" }}>
        {/* Header cercle */}
        <div className="meta-mono mb-s" style={{
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.14em",
          color: "var(--silk-gold)", textTransform: "uppercase",
        }}>
          cercle · {circle.type || "spontane"}
        </div>
        <h1 className="h1-seuil mb-l">{circle.name}</h1>

        {/* Ephemeral countdown banner (T2 Niveau 3) */}
        {ephemeralCountdown && !isClosed && (
          <div
            className="card mb-l"
            style={{
              padding: "var(--s-2) var(--s-3)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
              background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
              borderRadius: 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--silk-gold)",
              }}
            >
              ✦ {ephemeralCountdown.label}.
              <span style={{ color: "var(--ash-light)", marginLeft: 8 }}>
                au jour J, une lecture finale sera tissée.
              </span>
            </div>
          </div>
        )}

        {isClosed && (
          <div
            className="card mb-l"
            style={{
              padding: "var(--s-2) var(--s-3)",
              border: "1px solid color-mix(in oklch, var(--silk-gold) 22%, var(--ash-deep))",
              background: "color-mix(in oklch, var(--silk-gold) 4%, transparent)",
              borderRadius: 0,
            }}
          >
            <div
              style={{
                fontFamily: "var(--serif)",
                fontStyle: "italic",
                fontSize: 14,
                lineHeight: 1.6,
                color: "var(--silk-gold)",
              }}
            >
              ✦ ce cercle a été. {_relWhen(circle.closed_at)}, il s'est refermé sur lui-même.
            </div>
          </div>
        )}

        {/* Tabs nav */}
        <div
          className="row mb-l"
          style={{
            gap: 0, flexWrap: "wrap",
            borderBottom: "1px solid var(--ash-deep)",
            marginBottom: "var(--s-5)",
          }}
        >
          {TABS.map(([k, label]) => {
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: active
                    ? "2px solid var(--silk-gold)"
                    : "2px solid transparent",
                  padding: "10px 16px",
                  fontFamily: "var(--serif)",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: active ? "var(--silk-gold)" : "var(--ash-light)",
                  cursor: "pointer",
                  transition: "all 280ms ease",
                  marginBottom: -1,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 2026-04-29 — Glyphe sacré contextuel par onglet (Yeshua, sobre 24x24) */}
        {window.GeoSymbol && (() => {
          const glyphForTab = {
            portrait: "concentric",
            rituels: "croissant",
            cloture: "triangle",
          };
          const kind = glyphForTab[tab];
          if (!kind) return null;
          return (
            <div aria-hidden="true" style={{
              display: "flex", justifyContent: "center",
              marginTop: "calc(-1 * var(--s-3))",
              marginBottom: "var(--s-3)",
              height: 36, position: "relative",
            }}>
              <div style={{ position: "relative", width: 32, height: 32, opacity: 0.55 }}>
                <window.GeoSymbol kind={kind} color="silk"
                  style={{ position: "relative", width: 32, height: 32, opacity: 1 }} />
              </div>
            </div>
          );
        })()}

        {/* 2026-04-29 — Synchronicités : songlines en background discret (Yeshua, opacity 0.1) */}
        {tab === "synchronicites" && window.GeoSymbol && (
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            opacity: 0.10, pointerEvents: "none", zIndex: 0,
          }}>
            <window.GeoSymbol kind="songlines" color="silk"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 1 }} />
          </div>
        )}

        {/* Contenu de l'onglet actif */}
        <div style={{ position: "relative", zIndex: 1 }}>
        {tab === "membres" && <TabMembres circle={circle} members={members} circleId={circleId} />}
        {tab === "closure" && <TabCloture circle={circle} circleId={circleId} />}
        {tab === "depots" && <TabDepots circle={circle} circleId={circleId} go={go} />}
        {tab === "chat" && <TabChat circleId={circleId} />}
        {tab === "portrait" && <TabPortrait circleId={circleId} />}
        {tab === "intentions" && <TabIntentions circleId={circleId} />}
        {tab === "synchronicites" && (window.TabSynchronicites
          ? <window.TabSynchronicites circleId={circleId} />
          : <div className="meta op-70">module synchronicités non chargé.</div>)}
        {tab === "meteo" && (window.TabMeteo
          ? <window.TabMeteo circleId={circleId} />
          : <div className="meta op-70">module météo non chargé.</div>)}
        {tab === "annales" && (window.TabAnnales
          ? <window.TabAnnales circleId={circleId} />
          : <div className="meta op-70">module annales non chargé.</div>)}
        {tab === "rituels" && (window.TabRituels
          ? <window.TabRituels circleId={circleId} />
          : <div className="meta op-70">module rituels non chargé.</div>)}
        </div>
      </div>
      {window.FeedbackFloat && <window.FeedbackFloat />}
    </div>
  );
};

Object.assign(window, { CercleSubApp });
